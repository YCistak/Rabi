'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, Compass } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { KavramEsi } from '@/lib/oyunlar/kavram-havuzu'
import { KAVRAM_HAVUZU, KAVRAM_KONU_ADI } from '@/lib/oyunlar/kavram-havuzu'
import {
  CELDIRICI_SAYISI,
  KAVRAM_SAYISI,
  eslesiyorMu,
  tahtaHazirla,
  tanimSahibi,
  type KavramTahtasi,
} from '@/lib/oyunlar/kavram'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { kavramdanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
import {
  EslestirmeDugmesi,
  eslestirmeDurumu,
  type EslestirmeRengi,
} from '@/components/oyun-eslestirme'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Bir cevaptan sonra ekranın beklediği süre (ms). */
const CEVAP_BEKLEMESI = 800

/** Seçili kutunun rengi — Tarih dersinin ailesi. */
const RENK: EslestirmeRengi = {
  kenar: 'border-trh-koyu',
  zemin: 'bg-trh-kart',
  yazi: 'text-trh-koyu',
}

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type Secim = { kavram: string | null; tanim: string | null }

const BOS_SECIM: Secim = { kavram: null, tanim: null }

/** Banka kayıtlarını havuzdaki kavramlara bağlar; havuzdan kalkmışlar eleniyor. */
function bankaEsleri(
  kayitlar: readonly BankaKaydi[],
  havuz: readonly KavramEsi[] = KAVRAM_HAVUZU,
): KavramEsi[] {
  const esler: KavramEsi[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'kavram') continue
    const aranan = kayit.soru.kavram
    const es = havuz.find((h) => h.kavram === aranan)
    if (es) esler.push(es)
  }
  return esler
}

/**
 * Banka turunun tahtası.
 *
 * `tahtaHazirla` kullanılamıyor: o havuzdan rastgele seçiyor, banka turunun ise
 * bankadaki kavramları **öne alması** gerekiyor. Üç kavram bankadan
 * doldurulamazsa gerisi havuzdan tamamlanıyor; çeldiriciler her hâlükârda
 * havuzdan geliyor çünkü onların bankayla ilgisi yok.
 */
function bankaTahtasiHazirla(
  esler: readonly KavramEsi[],
  kullanilan: ReadonlySet<string>,
  havuz: readonly KavramEsi[] = KAVRAM_HAVUZU,
  rastgele: () => number = Math.random,
): KavramTahtasi | null {
  const secilen: KavramEsi[] = []
  const kavramlar = new Set<string>()

  const topla = (kaynak: readonly KavramEsi[]) => {
    for (const es of karistir(kaynak, rastgele)) {
      if (secilen.length >= KAVRAM_SAYISI) return
      if (kullanilan.has(es.kavram) || kavramlar.has(es.kavram)) continue
      secilen.push(es)
      kavramlar.add(es.kavram)
    }
  }

  topla(esler)
  if (secilen.length === 0) return null

  topla(havuz)
  if (secilen.length < KAVRAM_SAYISI) return null

  // Çeldiriciler tahtadaki kavramların konusundan seçiliyor; tahta karışıksa
  // bütün havuzdan.
  const ilk = secilen[0].konu
  const konu = secilen.every((e) => e.konu === ilk) ? ilk : null
  const celdiriciKaynak = havuz.filter(
    (e) => (konu === null || e.konu === konu) && !kavramlar.has(e.kavram),
  )
  const celdiriciler = karistir(celdiriciKaynak, rastgele).slice(0, CELDIRICI_SAYISI)
  if (celdiriciler.length < CELDIRICI_SAYISI) return null

  return {
    konu,
    esler: secilen,
    kavramlar: karistir(secilen.map((e) => e.kavram), rastgele),
    tanimlar: karistir([...secilen, ...celdiriciler].map((e) => e.tanim), rastgele),
  }
}

/**
 * Kavram Eşleştirme — mini oyun.
 *
 * Solda üç kavram, sağda beş tanım: ikisi kimseye ait değil. Üç eşleşme bitince
 * yeni tahta geliyor, tur süre dolana kadar sürüyor.
 */
export function KavramOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  /** Boş değilse tahtalar önce bu sorulardan kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<KavramEsi>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — tur artık sabit süreli değil. */
    gecenSaniye: number,
  ) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('kavram')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [tahta, setTahta] = useState<KavramTahtasi | null>(null)
  const [secim, setSecim] = useState<Secim>(BOS_SECIM)
  const [eslesenler, setEslesenler] = useState<KavramEsi[]>([])
  const [yanlisCift, setYanlisCift] = useState<Secim | null>(null)
  /** Tahta doldu, yenisi bekleniyor — bu sırada dokunuşlar yok sayılır. */
  const [tahtaBekliyor, setTahtaBekliyor] = useState(false)
  const [cevaplar, setCevaplar] = useState<Cevap<KavramEsi>[]>([])
  /** Yanlışlarla aynı sıradaki tanım seçimleri — "sen bunu dedin" için. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])

  /** Bu tahta boss mu — kısa süre, tek yanlışta eleme. */
  const [bossTahta, setBossTahta] = useState(false)
  /** Kaç boss tahta verildi — sıradakinin boss olup olmayacağı buna bakıyor. */
  const [verilenBoss, setVerilenBoss] = useState(0)
  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Kaçıncı tahta — sayaç her tahtada sıfırlansın diye. */
  const [tahtaSayisi, setTahtaSayisi] = useState(0)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukKavram, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<KavramEsi>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaEsleri(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  /** Turun başladığı an — tur sınırsız olduğu için süre gerçekten ölçülüyor. */
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<KavramEsi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş kavramlar — aynı kavram iki kez gelmesin. */
  const kullanilanRef = useRef<Set<string>>(new Set())
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  /**
   * Sıradaki tahta: banka turunda banka öncelikli, normal turda seçilen
   * zorluktan.
   *
   * Zorluk süzgeci yalnızca **sorulan** üç kavrama uygulanıyor; çeldiriciler
   * tüm havuzdan geliyor (dördüncü argüman). Çeldirici cevaplanmıyor, tek işi
   * aynı konudan inandırıcı bir tanım olmak — süzülseydi küçük konularda beş
   * kavram kalmaz, tahta konu bütünlüğünü kaybederdi.
   */
  const sonrakiTahta = useCallback(
    (boss: boolean) => {
      if (bankaTuru) return bankaTahtasiHazirla(bankaHavuzu, kullanilanRef.current)
      const seviye = boss ? bossZorlugu(zorluk).zorluk : zorluk
      const suzulmus = zorluktaSuz(KAVRAM_HAVUZU, seviye)
      return (
        tahtaHazirla(kullanilanRef.current, suzulmus, Math.random, KAVRAM_HAVUZU) ??
        tahtaHazirla(kullanilanRef.current)
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
    setTahta(sonrakiTahta(false))
    setBossTahta(false)
    setVerilenBoss(0)
    setElendi(false)
    setTahtaSayisi(0)
    setSecim(BOS_SECIM)
    setEslesenler([])
    setYanlisCift(null)
    setTahtaBekliyor(false)
    setCevaplar([])
    setYanlisGirdileri([])
    setSonuc(null)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru, sonrakiTahta])

  const turBitir = useCallback(
    (verilenler: Cevap<KavramEsi>[]) => {
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
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: kavramdanBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
      )
    },
    [bankaTuru, istatistik, onTurBitti, sesAcik],
  )

  // Havuz tükenip yeni tahta kurulamazsa tur süre dolmadan biter.
  useEffect(() => {
    if (asama === 'oynaniyor' && tahta === null) turBitir(cevaplarRef.current)
  }, [asama, tahta, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

  const geriBildir = (dogruMu: boolean) => {
    oyunSesiCal(dogruMu ? 'dogru' : 'yanlis', sesAcik)
    if (!Capacitor.isNativePlatform()) return
    void (dogruMu
      ? Haptics.impact({ style: ImpactStyle.Light })
      : Haptics.notification({ type: NotificationType.Error })
    ).catch(() => {})
  }

  /**
   * Sıradaki tahtayı dağıtır.
   *
   * Boss kararı burada: on eşleştirme tamamlandıysa bu tahta boss olur ve bir
   * üst seviyeden kurulur.
   */
  const tahtaDagit = () => {
    for (const e of tahta?.esler ?? []) kullanilanRef.current.add(e.kavram)
    const boss = bossElMi(cevaplarRef.current.length, verilenBoss)
    if (boss) setVerilenBoss((v) => v + 1)
    setBossTahta(boss)
    setTahta(sonrakiTahta(boss))
    setEslesenler([])
    setTahtaBekliyor(false)
    setTahtaSayisi((n) => n + 1)
  }

  /**
   * Tahta süresi dolunca.
   *
   * Eşleştirilmemiş kavramlar cevaplanmamış sayılıyor — süre dolması bilememekle
   * aynı, dolayısıyla tur da orada bitiyor. Banka turunda eleme yok.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || !tahta) return
    const kalanEsler = tahta.esler.filter((e) => !eslesenler.some((s) => s.kavram === e.kavram))
    setCevaplar((onceki) => [...onceki, ...kalanEsler.map((soru) => ({ soru, dogruMu: false }))])
    setYanlisGirdileri((onceki) => [...onceki, ...kalanEsler.map(() => 'süre doldu')])
    geriBildir(false)
    if (elerMi(false, bankaTuru)) {
      setElendi(bossTahta ? 'boss' : 'yanlis')
      zamanlayiciRef.current = setTimeout(() => turBitir(cevaplarRef.current), CEVAP_BEKLEMESI)
      return
    }
    zamanlayiciRef.current = setTimeout(tahtaDagit, CEVAP_BEKLEMESI)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, bankaTuru, bossTahta, tahta, eslesenler])

  const { kalan, toplam } = useSoruSayaci({
    aktif: asama === 'oynaniyor' && !duraklatilan && !tahtaBekliyor && tahta !== null,
    sure: soruSuresi('kavram', bossTahta ? bossZorlugu(zorluk) : null),
    anahtar: tahtaSayisi,
    onBitti: sureDoldu,
  })

  const eslesenKavramlar = new Set(eslesenler.map((e) => e.kavram))
  const eslesenTanimlar = new Set(eslesenler.map((e) => e.tanim))

  const denetle = (kavram: string, tanim: string) => {
    if (!tahta) return

    const dogruMu = eslesiyorMu(tahta, kavram, tanim)
    const es = tahta.esler.find((e) => e.kavram === kavram)
    if (!es) return

    setCevaplar((onceki) => [...onceki, { soru: es, dogruMu }])
    geriBildir(dogruMu)

    if (!dogruMu) {
      setYanlisGirdileri((onceki) => [...onceki, tanim])
      setYanlisCift({ kavram, tanim })
      zamanlayiciRef.current = setTimeout(() => {
        setYanlisCift(null)
        setSecim(BOS_SECIM)
        // Tek yanlış eşleştirme turu bitiriyor; banka turu bunun dışında.
        if (elerMi(false, bankaTuru)) {
          setElendi(bossTahta ? 'boss' : 'yanlis')
          turBitir(cevaplarRef.current)
        }
      }, CEVAP_BEKLEMESI)
      return
    }

    setSecim(BOS_SECIM)

    const yeniEslesenler = [...eslesenler, es]
    if (yeniEslesenler.length < KAVRAM_SAYISI) {
      setEslesenler(yeniEslesenler)
      return
    }

    // Tahta bitti. Son çift önce yeşile dönsün, açıkta kalan iki tanım da
    // görülsün; sonra yenisi geliyor.
    setEslesenler(yeniEslesenler)
    setTahtaBekliyor(true)
    zamanlayiciRef.current = setTimeout(tahtaDagit, CEVAP_BEKLEMESI)
  }

  const kavramSec = (kavram: string) => {
    if (
      asama !== 'oynaniyor' ||
      yanlisCift !== null ||
      tahtaBekliyor ||
      eslesenKavramlar.has(kavram)
    )
      return
    if (secim.kavram === kavram) return setSecim({ ...secim, kavram: null })
    if (secim.tanim) return denetle(kavram, secim.tanim)
    setSecim({ ...secim, kavram })
  }

  const tanimSec = (tanim: string) => {
    if (
      asama !== 'oynaniyor' ||
      yanlisCift !== null ||
      tahtaBekliyor ||
      eslesenTanimlar.has(tanim)
    )
      return
    if (secim.tanim === tanim) return setSecim({ ...secim, tanim: null })
    if (secim.kavram) return denetle(secim.kavram, tanim)
    setSecim({ ...secim, tanim })
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
        oyunId="kavram"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: tahtaSayisi + 1,
                boss: bossTahta,
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
          tahta && (
            <div className="flex flex-1 flex-col gap-2 pb-1">
              {/* Tahtanın konusu: çeldiriciler de aynı konudan geldiği için
                  bunu söylemek oyuncuya haksız bir sürpriz yaşatmıyor. */}
              <p className="mt-2.5 flex flex-none items-center justify-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-trh-koyu">
                <Compass size={13} aria-hidden />
                {tahta.konu ? KAVRAM_KONU_ADI[tahta.konu] : 'Karışık konu'}
              </p>

              <section className="flex-none">
                <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
                  Kavramlar
                </h2>
                <ul className="grid grid-cols-3 gap-[7px]">
                  {tahta.kavramlar.map((kavram) => (
                    <li key={kavram}>
                      <EslestirmeDugmesi
                        durum={eslestirmeDurumu({
                          eslesti: eslesenKavramlar.has(kavram),
                          hatali: yanlisCift?.kavram === kavram,
                          secili: secim.kavram === kavram,
                        })}
                        renk={RENK}
                        onSec={() => kavramSec(kavram)}
                        className="min-h-[50px] justify-center px-1.5 text-center text-[12px]"
                      >
                        {kavram}
                      </EslestirmeDugmesi>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex-none">
                <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
                  Tanımlar
                </h2>
                <ul className="flex flex-col gap-[7px]">
                  {tahta.tanimlar.map((tanim) => {
                    // Tahta bitince karşılığı olmayan iki tanım soluyor: oyuncu
                    // hangilerinin boşuna durduğunu görmeden ekran değişmesin.
                    const acikta =
                      tahtaBekliyor &&
                      !eslesenTanimlar.has(tanim) &&
                      tanimSahibi(tahta, tanim) === null
                    return (
                      <li key={tanim}>
                        <EslestirmeDugmesi
                          durum={eslestirmeDurumu({
                            eslesti: eslesenTanimlar.has(tanim),
                            hatali: yanlisCift?.tanim === tanim,
                            secili: secim.tanim === tanim,
                          })}
                          renk={RENK}
                          onSec={() => tanimSec(tanim)}
                          className={cn(
                            'min-h-[52px] items-start py-2 text-left text-[11.5px] font-bold leading-[1.35]',
                            acikta && 'opacity-45',
                          )}
                        >
                          {tanim}
                        </EslestirmeDugmesi>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <p className="mt-auto flex-none pt-1 text-center text-[11.5px] font-bold text-muted-foreground">
                {secim.kavram
                  ? 'Şimdi tanımına dokun'
                  : secim.tanim
                    ? 'Şimdi kavramına dokun'
                    : `İki tanımın karşılığı yok`}
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
  sonuc: { ozet: TurOzeti<KavramEsi>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki tanım seçimleri. */
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
      oyunId="kavram"
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
      bolumAltYazisi="Kavram, doğru tanımı ve senin seçtiğin."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((es, sira) => (
            <YanlisKarti
              key={`${es.kavram}-${sira}`}
              oyunId="kavram"
              soru={kavramdanBanka(es)}
              bildir={bildir}
            >
              <b className="block font-display text-[13.5px] font-extrabold leading-tight">
                {es.kavram}
              </b>
              <span className="mt-1 flex items-start gap-1.5 text-[11.5px] font-bold text-success">
                <Check size={13} className="mt-0.5 shrink-0" aria-hidden />
                {es.tanim}
              </span>
              {girdiler[sira] && (
                <span className="mt-0.5 block text-[11px] font-semibold text-muted-foreground">
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
