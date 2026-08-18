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
  TUR_SURESI,
  YANLIS_CEZASI,
  guncelSeri,
  kalanSaniye,
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
} from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Yanlış eşleştirmenin kırmızı kaldığı süre (ms). */
const YANLIS_BEKLEME = 800

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
}: {
  istatistik: OyunIstatistigi
  /** Ses efektleri açık mı (Ayarlar → Mini oyun sesleri). */
  sesAcik: boolean
  /** Boş değilse eller önce bu sorulardan kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<EdebiyatEsi>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
}) {
  const oyun = oyunBul('edebiyat')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [el, setEl] = useState<EdebiyatEli | null>(null)
  const [secim, setSecim] = useState<Secim>(BOS_SECIM)
  const [eslesenler, setEslesenler] = useState<EdebiyatEsi[]>([])
  const [yanlisCift, setYanlisCift] = useState<Secim | null>(null)
  const [cevaplar, setCevaplar] = useState<Cevap<EdebiyatEsi>[]>([])
  /** Yanlışlarla aynı sıradaki seçimler — tur sonunda "sen X dedin" için. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<EdebiyatEsi>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaEsleri(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<EdebiyatEsi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş eserler — aynı eser iki kez gelmesin. */
  const kullanilanRef = useRef<Set<string>>(new Set())
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  /** Sıradaki el: banka turunda banka öncelikli, normal turda havuzdan. */
  const sonrakiEl = useCallback(
    () =>
      bankaTuru
        ? bankaEliHazirla(bankaHavuzu, kullanilanRef.current)
        : elHazirla(kullanilanRef.current),
    [bankaHavuzu, bankaTuru],
  )

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    kullanilanRef.current = new Set()
    setEl(sonrakiEl())
    setSecim(BOS_SECIM)
    setEslesenler([])
    setYanlisCift(null)
    setCevaplar([])
    setYanlisGirdileri([])
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
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
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  useEffect(() => {
    if (asama !== 'oynaniyor' || duraklatilan !== null) return
    const oku = () => {
      const yeni = kalanSaniye(bitisZamani)
      setKalan(yeni)
      if (yeni <= 0) turBitir(cevaplarRef.current)
    }
    oku()
    const isaret = setInterval(oku, 250)
    return () => clearInterval(isaret)
  }, [asama, bitisZamani, duraklatilan, turBitir])

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
      setBitisZamani((b) => b - YANLIS_CEZASI * 1000)
      setYanlisCift({ eser, yazar })
      zamanlayiciRef.current = setTimeout(() => {
        setYanlisCift(null)
        setSecim(BOS_SECIM)
      }, YANLIS_BEKLEME)
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

    // El bitti: hemen yenisi kuruluyor, arada bir "devam" ekranı yok.
    for (const e of el.esler) kullanilanRef.current.add(e.eser)
    setEl(sonrakiEl())
    setEslesenler([])
  }

  const eserSec = (eser: string) => {
    if (asama !== 'oynaniyor' || yanlisCift !== null || eslesenEserler.has(eser)) return
    // Aynı kutuya ikinci dokunuş seçimi geri alır; yanlış dokunan kilitlenmesin.
    if (secim.eser === eser) return setSecim({ ...secim, eser: null })
    if (secim.yazar) return denetle(eser, secim.yazar)
    setSecim({ ...secim, eser })
  }

  const yazarSec = (yazar: string) => {
    if (asama !== 'oynaniyor' || yanlisCift !== null || eslesenYazarlar.has(yazar)) return
    if (secim.yazar === yazar) return setSecim({ ...secim, yazar: null })
    if (secim.eser) return denetle(secim.eser, yazar)
    setSecim({ ...secim, yazar })
  }

  const yardimAc = () => {
    setDuraklatilan(kalanSaniye(bitisZamani))
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    if (duraklatilan !== null) setBitisZamani(Date.now() + duraklatilan * 1000)
    setDuraklatilan(null)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const gorunenKalan = duraklatilan ?? kalan

  return (
    <>
      <OyunKabugu
        oyunId="edebiyat"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan: gorunenKalan,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
                cezaGorunur: yanlisCift !== null,
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
            onTekrar={turBaslat}
            onCik={onCik}
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
                  secildi && 'border-edb-koyu bg-edb text-edb-koyu',
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
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti<EdebiyatEsi>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki yazar seçimleri. */
  girdiler: string[]
  rekor: number
  bankaTuru: boolean
  onTekrar: () => void
  onCik: () => void
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
            <YanlisKarti key={`${es.eser}-${sira}`} oyunId="edebiyat">
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
