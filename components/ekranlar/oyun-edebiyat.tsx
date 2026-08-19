'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { BookOpen, Check } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { EdebiyatEsi } from '@/lib/oyunlar/edebiyat-havuzu'
import { DONEM_ADI, EDEBIYAT_HAVUZU } from '@/lib/oyunlar/edebiyat-havuzu'
import { EL_BOYUTU, elHazirla, eslesiyorMu, type EdebiyatEli } from '@/lib/oyunlar/edebiyat'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import {
  edebiyattanBanka,
  type BankaCevabi,
  type BankaKaydi,
} from '@/lib/oyunlar/banka'
import {
  bossElMi,
  bossZorlugu,
  elerMi,
  soruSuresi,
  zorluktaSuz,
  type Zorluk,
} from '@/lib/oyunlar/ritim'
import { useSoruSayaci } from '@/lib/oyunlar/soru-sayaci'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { ZorlukSecimi } from '@/components/zorluk-secimi'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import {
  EN_COK_YANLIS,
  KalanHapi,
  OyunKabugu,
  TurSonu,
  YanlisKarti,
  rekorCumlesi,
  type Eleme,
} from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/**
 * Bir cevaptan sonra ekranın beklediği süre (ms).
 *
 * Yanlışta kırmızı çift bu kadar duruyor. Altıncı doğru eşleşmede de aynı süre
 * bekleniyor: el bitince yenisi **anında** dağıtılıyordu ve oyuncu son
 * eşleştirdiği çiftin yeşile döndüğünü göremeden ekran tamamen değişiyordu.
 * Doğru ile yanlış arasında ritim farkı kalmasın diye tek sabit.
 */
const CEVAP_BEKLEMESI = 800

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type Secim = { eser: string | null; yazar: string | null }

const BOS_SECIM: Secim = { eser: null, yazar: null }

/**
 * Banka kayıtlarını havuzdaki eşlere bağlar.
 *
 * Kayıt yalnızca eser ve yazar tutuyor; ele dönem de gerekiyor (ekranın
 * başlığında yazıyor, tek dönemli el kuralını da o belirliyor). Havuzdan
 * kalkmış bir eser sessizce eleniyor — sorusu olmayan bir kaydı ele koymak
 * cevabı olmayan bir soru demek.
 */
function bankaEsleri(
  kayitlar: readonly BankaKaydi[],
  havuz: readonly EdebiyatEsi[] = EDEBIYAT_HAVUZU,
): EdebiyatEsi[] {
  const esler: EdebiyatEsi[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'edebiyat') continue
    const aranan = kayit.soru.eser
    const es = havuz.find((h) => h.eser === aranan)
    if (es) esler.push(es)
  }
  return esler
}

/**
 * Banka turunun eli.
 *
 * `elHazirla` kullanılamıyor: o, havuzdan rastgele bir el kuruyor: banka
 * sorularını **öne alması** gerekiyor. Kuralları aynen taşınıyor — bir elde
 * aynı yazardan iki eser olamaz (yazarın tuşu iki esere birden uyar ve doğru
 * cevap yanlış sayılırdı), aynı eser tur içinde iki kez sorulmaz.
 *
 * El altı eser istiyor; banka altıyı doldurmuyorsa geri kalanı havuz
 * tamamlıyor. Banka tarafından tek eser bile kalmadıysa `null` dönüyor ve tur
 * erken bitiyor: banka turu bankadaki soruları bitirince amacına ulaşmış olur.
 */
function bankaEliHazirla(
  esler: readonly EdebiyatEsi[],
  kullanilan: ReadonlySet<string>,
  havuz: readonly EdebiyatEsi[] = EDEBIYAT_HAVUZU,
  rastgele: () => number = Math.random,
): EdebiyatEli | null {
  const secilen: EdebiyatEsi[] = []
  const yazarlar = new Set<string>()
  const eserler = new Set<string>()

  const topla = (kaynak: readonly EdebiyatEsi[]) => {
    for (const es of karistir(kaynak, rastgele)) {
      if (secilen.length >= EL_BOYUTU) return
      if (kullanilan.has(es.eser) || eserler.has(es.eser) || yazarlar.has(es.yazar)) continue
      secilen.push(es)
      eserler.add(es.eser)
      yazarlar.add(es.yazar)
    }
  }

  topla(esler)
  if (secilen.length === 0) return null

  topla(havuz)
  if (secilen.length < EL_BOYUTU) return null

  // El tek dönemden çıktıysa dönem yazılıyor; banka karışık olduğu için bu
  // çoğunlukla olmuyor ve ekran "Karışık dönem" diyor.
  const ilk = secilen[0].donem
  const donem = secilen.every((es) => es.donem === ilk) ? ilk : null

  return {
    donem,
    esler: secilen,
    // İki sütun ayrı karıştırılıyor: aynı sırada dursalardı eşleştirme
    // okumadan, konuma bakarak yapılırdı.
    eserler: karistir(secilen.map((e) => e.eser), rastgele),
    yazarlar: karistir(secilen.map((e) => e.yazar), rastgele),
  }
}

/**
 * Edebiyat Eşleştirme — mini oyun.
 *
 * Altı eser ve altı yazar; birine sonra ötekine dokunarak eşleştiriliyor.
 * Eşleşen kutular ekrandan **kaldırılmıyor**, yeşile dönüp yerinde kalıyor:
 * silinselerdi ızgara her eşleşmede yeniden dizilir, oyuncunun parmağı
 * gitmek istediği kutuyu kaybederdi.
 */
export function EdebiyatOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse eller önce bu sorulardan kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<EdebiyatEsi>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('edebiyat')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [el, setEl] = useState<EdebiyatEli | null>(null)
  const [secim, setSecim] = useState<Secim>(BOS_SECIM)
  const [eslesenler, setEslesenler] = useState<EdebiyatEsi[]>([])
  const [yanlisCift, setYanlisCift] = useState<Secim | null>(null)
  /** El tamamlandı, yenisi dağıtılmayı bekliyor — bu sırada dokunuşlar yok sayılır. */
  const [elBekliyor, setElBekliyor] = useState(false)
  const [cevaplar, setCevaplar] = useState<Cevap<EdebiyatEsi>[]>([])
  /** Yanlışlarla aynı sıradaki seçimler — tur sonunda "sen X dedin" için. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])

  /** Bu el boss mu — kırmızı ekran, kısa süre, tek yanlışta eleme. */
  const [bossEl, setBossEl] = useState(false)
  /** Kaç boss el verildi — sıradakinin boss olup olmayacağı buna bakıyor. */
  const [verilenBoss, setVerilenBoss] = useState(0)
  /** Boss elinde yanılıp elendi mi. */
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Kaçıncı el — sayaç her elde sıfırlansın diye. */
  const [elSayisi, setElSayisi] = useState(0)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukEdebiyat, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<EdebiyatEsi>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaEsleri(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  /**
   * Turun başladığı an.
   *
   * Tur artık sabit uzunlukta değil — sınırsız sürüyor ve boss'ta bitiyor. Eski
   * hesap "tur süresi eksi yanlış cezası" formülüyle türetiliyordu, o formülün
   * karşılığı kalmadı; süre gerçekten ölçülüyor.
   */
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<EdebiyatEsi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş eserler — aynı eser iki kez gelmesin. */
  const kullanilanRef = useRef<Set<string>>(new Set())
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  /** Sıradaki el: banka turunda banka öncelikli, normal turda havuzdan. */
  const sonrakiEl = useCallback(
    (boss: boolean) => {
      if (bankaTuru) return bankaEliHazirla(bankaHavuzu, kullanilanRef.current)
      const seviye = boss ? bossZorlugu(zorluk).zorluk : zorluk
      const suzulmus = zorluktaSuz(EDEBIYAT_HAVUZU, seviye)
      // Seçilen seviyede el kuracak kadar eser kalmadıysa tüm havuza düşülüyor:
      // turun ortasında durmak, bir soru fazla kolay gelmesinden kötü.
      return (
        elHazirla(kullanilanRef.current, suzulmus) ?? elHazirla(kullanilanRef.current)
      )
    },
    [bankaHavuzu, bankaTuru, zorluk],
  )

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    turBasladiRef.current = Date.now()
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    kullanilanRef.current = new Set()
    setEl(sonrakiEl(false))
    setBossEl(false)
    setVerilenBoss(0)
    setElendi(false)
    setElSayisi(0)
    setSecim(BOS_SECIM)
    setEslesenler([])
    setYanlisCift(null)
    // Tur, el dağıtımı beklenirken bittiyse bayrak açık kalırdı ve yeni tur
    // dokunuşları yok sayardı.
    setElBekliyor(false)
    setCevaplar([])
    setYanlisGirdileri([])
    setSonuc(null)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru, sonrakiEl])

  const turBitir = useCallback(
    (verilenler: Cevap<EdebiyatEsi>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor:
          !bankaTuru &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor: banka, üst üste üç kez doğru bilinen kaydı
      // düşürüyor.
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: edebiyattanBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Havuz (banka turunda banka) tükenip yeni el kurulamazsa tur süre dolmadan
  // biter.
  useEffect(() => {
    if (asama === 'oynaniyor' && el === null) turBitir(cevaplarRef.current)
  }, [asama, el, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

  /** Cevabın geri bildirimi: titreşim (yalnızca cihazda) + ses efekti. */
  const geriBildir = (dogruMu: boolean) => {
    oyunSesiCal(dogruMu ? 'dogru' : 'yanlis', sesAcik)
    if (!Capacitor.isNativePlatform()) return
    void (dogruMu
      ? Haptics.impact({ style: ImpactStyle.Light })
      : Haptics.notification({ type: NotificationType.Error })
    ).catch(() => {})
  }

  /**
   * Sıradaki eli dağıtır.
   *
   * Boss kararı burada veriliyor: on eşleştirme tamamlandıysa bu el boss olur
   * ve bir üst seviyeden kurulur.
   */
  const elDagit = () => {
    for (const e of el?.esler ?? []) kullanilanRef.current.add(e.eser)
    const boss = bossElMi(cevaplarRef.current.length, verilenBoss)
    if (boss) setVerilenBoss((v) => v + 1)
    setBossEl(boss)
    setEl(sonrakiEl(boss))
    setEslesenler([])
    setElBekliyor(false)
    setElSayisi((n) => n + 1)
  }

  /**
   * El süresi dolunca.
   *
   * Kalan eşleşmeler cevaplanmamış sayılıyor — süre dolması bilememekle aynı,
   * dolayısıyla tur da orada bitiyor. Banka turunda eleme yok: yeni el dağıtılıyor.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || !el) return
    const kalanEsler = el.esler.filter((e) => !eslesenler.some((s) => s.eser === e.eser))
    setCevaplar((onceki) => [...onceki, ...kalanEsler.map((soru) => ({ soru, dogruMu: false }))])
    setYanlisGirdileri((onceki) => [...onceki, ...kalanEsler.map(() => 'süre doldu')])
    geriBildir(false)
    if (elerMi(false, bankaTuru)) {
      setElendi(bossEl ? 'boss' : 'yanlis')
      zamanlayiciRef.current = setTimeout(() => turBitir(cevaplarRef.current), CEVAP_BEKLEMESI)
      return
    }
    zamanlayiciRef.current = setTimeout(elDagit, CEVAP_BEKLEMESI)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, bankaTuru, bossEl, el, eslesenler])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && !duraklatilan && !elBekliyor && el !== null,
    sure: soruSuresi('edebiyat', bossEl ? bossZorlugu(zorluk) : null),
    anahtar: elSayisi,
    onBitti: sureDoldu,
  })

  /** Eşleşmişleri hızlı sorgulamak için ad kümeleri. */
  const eslesenEserler = new Set(eslesenler.map((e) => e.eser))
  const eslesenYazarlar = new Set(eslesenler.map((e) => e.yazar))

  const denetle = (eser: string, yazar: string) => {
    if (!el) return

    const dogruMu = eslesiyorMu(el, eser, yazar)
    const es = el.esler.find((e) => e.eser === eser)
    if (!es) return

    setCevaplar((onceki) => [...onceki, { soru: es, dogruMu }])
    geriBildir(dogruMu)

    if (!dogruMu) {
      setYanlisGirdileri((onceki) => [...onceki, yazar])
      setYanlisCift({ eser, yazar })
      zamanlayiciRef.current = setTimeout(() => {
        setYanlisCift(null)
        setSecim(BOS_SECIM)
        // Tek yanlış eşleştirme turu bitiriyor; banka turu bunun dışında.
        if (elerMi(false, bankaTuru)) {
          setElendi(bossEl ? 'boss' : 'yanlis')
          turBitir(cevaplarRef.current)
        }
      }, CEVAP_BEKLEMESI)
      return
    }

    setSecim(BOS_SECIM)

    // Yeni el kurmak bir yan etki; `setEslesenler`in güncelleyicisi içinde
    // yapılamaz. React güncelleyicileri geliştirmede iki kez çağırıyor, el iki
    // kez dağıtılırdı.
    const yeniEslesenler = [...eslesenler, es]
    if (yeniEslesenler.length < EL_BOYUTU) {
      setEslesenler(yeniEslesenler)
      return
    }

    // El bitti. Altıncı çift önce yeşile dönsün, sonra yenisi dağıtılsın —
    // arada bir "devam" ekranı yok, yalnızca okunacak kadar bir duraklama.
    setEslesenler(yeniEslesenler)
    setElBekliyor(true)
    zamanlayiciRef.current = setTimeout(elDagit, CEVAP_BEKLEMESI)
  }

  const eserSec = (eser: string) => {
    if (asama !== 'oynaniyor' || yanlisCift !== null || elBekliyor || eslesenEserler.has(eser)) return
    // Aynı kutuya ikinci dokunuş seçimi geri alır; yanlış dokunan kilitlenmesin.
    if (secim.eser === eser) return setSecim({ ...secim, eser: null })
    if (secim.yazar) return denetle(eser, secim.yazar)
    setSecim({ ...secim, eser })
  }

  const yazarSec = (yazar: string) => {
    if (asama !== 'oynaniyor' || yanlisCift !== null || elBekliyor || eslesenYazarlar.has(yazar)) return
    if (secim.yazar === yazar) return setSecim({ ...secim, yazar: null })
    if (secim.eser) return denetle(secim.eser, yazar)
    setSecim({ ...secim, yazar })
  }

  const yardimAc = () => {
    setDuraklatilan(true)
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    setDuraklatilan(false)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length

  return (
    <>
      <OyunKabugu
        oyunId="edebiyat"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: elSayisi + 1,
                boss: bossEl,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
              }
        }
        onCik={onCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            girdiler={yanlisGirdileri}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            elendi={elendi}
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          />
        ) : (
          asama === 'oynaniyor' &&
          el && (
            <div className="flex flex-1 flex-col gap-2.5 pb-1">
              {/* Elin dönemi. El mümkün olduğunca tek dönemden kuruluyor;
                  bunu söylemek öğrenciye bağlam veriyor ve oyunun neden zor
                  olduğunu açıklıyor: aynı dönemden altı isim. */}
              <p className="mt-3 flex flex-none items-center justify-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-edb-koyu">
                <BookOpen size={13} aria-hidden />
                {el.donem ? DONEM_ADI[el.donem] : 'Karışık dönem'}
              </p>

              <Bolum
                baslik="Eserler"
                secenekler={el.eserler}
                secili={secim.eser}
                eslesenler={eslesenEserler}
                yanlis={yanlisCift?.eser ?? null}
                onSec={eserSec}
              />
              <Bolum
                baslik="Yazarlar"
                secenekler={el.yazarlar}
                secili={secim.yazar}
                eslesenler={eslesenYazarlar}
                yanlis={yanlisCift?.yazar ?? null}
                onSec={yazarSec}
              />

              {/* İki adımlı bir işlemde ilk adımdan sonra ne olacağını söylemek
                  gerekiyor. */}
              <p className="mt-auto flex-none pt-1 text-center text-[11.5px] font-bold text-muted-foreground">
                {secim.eser
                  ? 'Şimdi yazarına dokun'
                  : secim.yazar
                    ? 'Şimdi eserine dokun'
                    : 'Bir esere dokun'}
              </p>
            </div>
          )
        )}
      </OyunKabugu>

      <OyunTanitim
        oyun={oyun}
        acik={asama === 'tanitim' || yardimAcik}
        rekor={istatistik.enIyiDogru}
        baslatir={asama === 'tanitim'}
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
        ekstra={
          asama === 'tanitim' && !bankaTuru ? (
            <ZorlukSecimi secili={zorluk} onSec={setZorluk} bossVar />
          ) : null
        }
      />
    </>
  )
}

function Bolum({
  baslik,
  secenekler,
  secili,
  eslesenler,
  yanlis,
  onSec,
}: {
  baslik: string
  secenekler: string[]
  secili: string | null
  eslesenler: ReadonlySet<string>
  yanlis: string | null
  onSec: (deger: string) => void
}) {
  return (
    <section className="flex-none">
      <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
        {baslik}
      </h2>
      <ul className="grid grid-cols-2 gap-[7px]">
        {secenekler.map((deger) => {
          const eslesti = eslesenler.has(deger)
          const hatali = !eslesti && yanlis === deger
          const secildi = !eslesti && !hatali && secili === deger
          return (
            <li key={deger}>
              <button
                type="button"
                onClick={() => onSec(deger)}
                disabled={eslesti}
                className={cn(
                  'flex min-h-[54px] w-full items-center justify-center gap-1 rounded-[15px] border-2 px-2 py-1.5',
                  'text-center text-[12.5px] font-extrabold leading-tight transition',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  eslesti && 'border-transparent bg-success-soft text-success',
                  hatali && 'border-ikincil bg-ikincil-soft text-ikincil',
                  secildi && 'border-edb-koyu bg-edb-kart text-edb-koyu',
                  !eslesti && !hatali && !secildi && 'golge-kart border-border bg-card',
                )}
              >
                <span className="min-w-0">{deger}</span>
                {eslesti && <Check size={13} className="shrink-0" aria-hidden />}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function SonucGorunumu({
  sonuc,
  girdiler,
  rekor,
  bankaTuru,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<EdebiyatEsi>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki yazar seçimleri. */
  girdiler: string[]
  rekor: number
  bankaTuru: boolean
  elendi: Eleme
  onTekrar: () => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const { ozet, yeniRekor } = sonuc
  const gorunen = ozet.yanlislar.slice(0, EN_COK_YANLIS)
  const kalan = ozet.yanlislar.length - gorunen.length

  return (
    <TurSonu
      oyunId="edebiyat"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      elendi={elendi}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — üst üste üç doğruda düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'eşleştirme')
      }
      bolumBasligi="Karıştırdıkların"
      bolumAltYazisi="Eser, doğru yazarı ve senin dediğin."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((es, sira) => (
            <YanlisKarti
              key={`${es.eser}-${sira}`}
              oyunId="edebiyat"
              soru={edebiyattanBanka(es)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {es.eser}
              </b>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-success">
                <Check size={13} className="shrink-0" aria-hidden />
                {es.yazar}
              </span>
              {girdiler[sira] && (
                <span className="mt-0.5 block text-[11.5px] font-semibold text-muted-foreground">
                  Sen <s className="text-ikincil">{girdiler[sira]}</s> dedin
                </span>
              )}
            </YanlisKarti>
          ))}

          {kalan > 0 && <KalanHapi kalan={kalan} />}
        </div>
      )}
    </TurSonu>
  )
}
