'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, ScrollText } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { AntlasmaMaddesi } from '@/lib/oyunlar/antlasma-havuzu'
import {
  ANTLASMA_HAVUZU,
  TARIH_DONEM_ADI,
  sutunBasligi,
} from '@/lib/oyunlar/antlasma-havuzu'
import { EL_BOYUTU, elHazirla, eslesiyorMu, type AntlasmaEli } from '@/lib/oyunlar/antlasma'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { antlasmadanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  bossElMi,
  bossZorlugu,
  elerMi,
  soruSuresi,
  zorluktaSuz,
  type Zorluk,
} from '@/lib/oyunlar/ritim'
import { etkinMod, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { useTurSayaci } from '@/lib/oyunlar/tur-sayaci'
import { ANAHTARLAR, useYerelDepo } from '@/lib/depo'
import { ZorlukSecimi } from '@/components/zorluk-secimi'
import type { BildirimKolu } from '@/components/hata-bildir'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { oyunSesiCal } from '@/lib/oyunlar/oyun-sesi'
import { useGeriKatmani } from '@/lib/geri'
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

/**
 * Bir cevaptan sonra ekranın beklediği süre (ms).
 *
 * Yanlışta kırmızı çift bu kadar duruyor; son doğru eşleşmede de aynı süre
 * bekleniyor ki oyuncu yeşile döndüğünü görsün, ekran altından değişmesin.
 */
const CEVAP_BEKLEMESI = 800

/** Seçili kutunun rengi — Tarih dersinin ailesi. */
const RENK: EslestirmeRengi = {
  kenar: 'border-trh-koyu',
  zemin: 'bg-trh-kart',
  yazi: 'text-trh-koyu',
}

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type Secim = { madde: string | null; antlasma: string | null }

const BOS_SECIM: Secim = { madde: null, antlasma: null }

/**
 * Banka kayıtlarını havuzdaki maddelere bağlar.
 *
 * Kayıt yalnızca madde ve antlaşma tutuyor; ele dönem de gerekiyor (başlıkta
 * yazıyor, tek dönemli el kuralını da o belirliyor). Havuzdan kalkmış bir madde
 * sessizce eleniyor.
 */
function bankaEsleri(
  kayitlar: readonly BankaKaydi[],
  havuz: readonly AntlasmaMaddesi[] = ANTLASMA_HAVUZU,
): AntlasmaMaddesi[] {
  const esler: AntlasmaMaddesi[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'antlasma') continue
    const aranan = kayit.soru.madde
    const es = havuz.find((h) => h.madde === aranan)
    if (es) esler.push(es)
  }
  return esler
}

/**
 * Banka turunun eli.
 *
 * `elHazirla` kullanılamıyor: o havuzdan rastgele bir el kuruyor, banka turunun
 * ise bankadaki maddeleri **öne alması** gerekiyor. Kurallar aynen taşınıyor:
 * bir elde aynı antlaşmadan iki madde olamaz, aynı madde tur içinde iki kez
 * sorulmaz. Banka dördü doldurmuyorsa gerisini havuz tamamlıyor; bankadan tek
 * madde bile kalmadıysa `null` dönüyor ve tur erken bitiyor.
 */
function bankaEliHazirla(
  esler: readonly AntlasmaMaddesi[],
  kullanilan: ReadonlySet<string>,
  havuz: readonly AntlasmaMaddesi[] = ANTLASMA_HAVUZU,
  rastgele: () => number = Math.random,
): AntlasmaEli | null {
  const secilen: AntlasmaMaddesi[] = []
  const antlasmalar = new Set<string>()
  const maddeler = new Set<string>()

  const topla = (kaynak: readonly AntlasmaMaddesi[]) => {
    for (const es of karistir(kaynak, rastgele)) {
      if (secilen.length >= EL_BOYUTU) return
      if (kullanilan.has(es.madde) || maddeler.has(es.madde) || antlasmalar.has(es.antlasma))
        continue
      secilen.push(es)
      maddeler.add(es.madde)
      antlasmalar.add(es.antlasma)
    }
  }

  topla(esler)
  if (secilen.length === 0) return null

  topla(havuz)
  if (secilen.length < EL_BOYUTU) return null

  const ilk = secilen[0].donem
  const donem = secilen.every((es) => es.donem === ilk) ? ilk : null

  return {
    donem,
    esler: secilen,
    maddeler: karistir(secilen.map((e) => e.madde), rastgele),
    antlasmalar: karistir(secilen.map((e) => e.antlasma), rastgele),
  }
}

/**
 * Antlaşma Eşleştirme — mini oyun.
 *
 * Dört madde ve dört antlaşma; birine sonra ötekine dokunarak eşleştiriliyor.
 * Eşleşen kutular ekrandan kaldırılmıyor, yeşile dönüp yerinde kalıyor:
 * silinselerdi ızgara her eşleşmede yeniden dizilir, parmak gitmek istediği
 * kutuyu kaybederdi.
 */
export function AntlasmaOyunuEkrani({
  istatistik,
  sesAcik,
  bankaSorulari,
  onTurBitti,
  mod,
  setMod,
  onCik,
  bildir,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  /** Boş değilse eller önce bu sorulardan kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (
    ozet: TurOzeti<AntlasmaMaddesi>,
    bankaCevaplari: BankaCevabi[],
    /** Turun gerçek uzunluğu — modlar arasında değişiyor. */
    gecenSaniye: number,
    /** Tur bitmeden çıkıldı mı — yarım tur rekora ve istatistiğe yazılmıyor. */
    yarim: boolean,
  ) => void
  /** Seçili tur modu — bütün oyunlarda ortak (`lib/oyunlar/mod.ts`). */
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('antlasma')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [el, setEl] = useState<AntlasmaEli | null>(null)
  const [secim, setSecim] = useState<Secim>(BOS_SECIM)
  const [eslesenler, setEslesenler] = useState<AntlasmaMaddesi[]>([])
  const [yanlisCift, setYanlisCift] = useState<Secim | null>(null)
  /** El tamamlandı, yenisi dağıtılmayı bekliyor — bu sırada dokunuşlar yok sayılır. */
  const [elBekliyor, setElBekliyor] = useState(false)
  const [cevaplar, setCevaplar] = useState<Cevap<AntlasmaMaddesi>[]>([])
  /** Yanlışlarla aynı sıradaki seçimler — tur sonunda "sen X dedin" için. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])

  /** Bu el boss mu — kısa süre, tek yanlışta eleme. */
  const [bossEl, setBossEl] = useState(false)
  /** Kaç boss el verildi — sıradakinin boss olup olmayacağı buna bakıyor. */
  const [verilenBoss, setVerilenBoss] = useState(0)
  /** Tur nasıl bitti — tur sonu ekranı bunu ayrıca söylüyor. */
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Kaçıncı el — sayaç her elde sıfırlansın diye. */
  const [elSayisi, setElSayisi] = useState(0)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukAntlasma, 'kolay')
  /** Yardım açıkken sayaç duruyor. */
  const [duraklatilan, setDuraklatilan] = useState(false)
  /**
   * Kaçıncı tur.
   *
   * Tur saatli modlarda sayacı sıfırlayan tek şey bu: soru sırası bir turun
   * ortasında da sıfır olabiliyor (`tur-sayaci.ts`).
   */
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<AntlasmaMaddesi>
    yeniRekor: boolean
  } | null>(null)

  const bankaHavuzu = useMemo(() => bankaEsleri(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  /** Turun başladığı an — tur sınırsız olduğu için süre gerçekten ölçülüyor. */
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<AntlasmaMaddesi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş maddeler — aynı madde iki kez gelmesin. */
  const kullanilanRef = useRef<Set<string>>(new Set())
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  /** Sıradaki el: banka turunda banka öncelikli, normal turda seçilen zorluktan. */
  const sonrakiEl = useCallback(
    (boss: boolean) => {
      if (bankaTuru) return bankaEliHazirla(bankaHavuzu, kullanilanRef.current)
      const seviye = boss ? bossZorlugu(zorluk).zorluk : zorluk
      const suzulmus = zorluktaSuz(ANTLASMA_HAVUZU, seviye)
      // Seçilen seviyede el kuracak kadar madde kalmadıysa tüm havuza düşülüyor:
      // turun ortasında durmak, bir sorunun fazla kolay gelmesinden kötü.
      return elHazirla(kullanilanRef.current, suzulmus) ?? elHazirla(kullanilanRef.current)
    },
    [bankaHavuzu, bankaTuru, zorluk],
  )

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    setTurNo((n) => n + 1)
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
    setElBekliyor(false)
    setCevaplar([])
    setYanlisGirdileri([])
    setSonuc(null)
    setDuraklatilan(false)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru, sonrakiEl])

  const turBitir = useCallback(
    (verilenler: Cevap<AntlasmaMaddesi>[], yarim = false) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor:
          !yarim &&
          !bankaTuru &&
          modKayitliMi(gecerliMod) &&
          rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      oyunSesiCal('bitis', sesAcik)
      setAsama('bitti')
      // Doğrular da bildiriliyor ama bankayı ilerletmiyor: kayıt yalnızca
      // Oyun Bankası’ndaki genel testte doğru bilinince düşüyor (`banka.ts`).
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: antlasmadanBanka(cevap.soru),
          dogruMu: cevap.dogruMu,
        })),
        Math.round((Date.now() - turBasladiRef.current) / 1000),
        yarim,
      )
    },
    [bankaTuru, gecerliMod, istatistik, onTurBitti, sesAcik],
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
   * Boss kararı burada veriliyor: on eşleştirme tamamlandıysa bu el boss olur ve
   * bir üst seviyeden kurulur.
   */
  const elDagit = () => {
    for (const e of el?.esler ?? []) kullanilanRef.current.add(e.madde)
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
   * Eşleştirilmemiş maddeler cevaplanmamış sayılıyor — süre dolması bilememekle
   * aynı, dolayısıyla tur da orada bitiyor. Banka turunda eleme yok.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || !el) return
    const kalanEsler = el.esler.filter((e) => !eslesenler.some((s) => s.madde === e.madde))
    setCevaplar((onceki) => [...onceki, ...kalanEsler.map((soru) => ({ soru, dogruMu: false }))])
    setYanlisGirdileri((onceki) => [...onceki, ...kalanEsler.map(() => 'süre doldu')])
    geriBildir(false)
    if (elerMi(false, bankaTuru, gecerliMod)) {
      setElendi(bossEl ? 'boss' : 'yanlis')
      zamanlayiciRef.current = setTimeout(() => turBitir(cevaplarRef.current), CEVAP_BEKLEMESI)
      return
    }
    zamanlayiciRef.current = setTimeout(elDagit, CEVAP_BEKLEMESI)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asama, bankaTuru, bossEl, el, eslesenler])

  /** Tur saati bitti: yanlış değil, tur biter. */
  const turSuresiDoldu = () => {
    setElendi('sure')
    turBitir(cevaplarRef.current)
  }

  /*
    Çıkış turu bitiriyor — her modda.

    Doğrudan çıkılsaydı o turda yanlış bilinen sorular Oyun Bankası'na hiç
    düşmezdi: yarıda bırakılan tur da öğrenilen bir turdur. Tur sonu ekranı da
    çıkışta görünüyor, oyuncu ne yaptığını görmeden ekrandan atılmıyor.

    Yarım tur `yarim` bayrağıyla bildiriliyor ve rekora, istatistiğe, oyun
    geçmişine **yazılmıyor** (`oyunlar.tsx`). Bankaya yazılıyor: soruyu nerede
    yanlış bilirsen bil, öğrenmen gereken soru odur.
  */
  const turdanCik = () => {
    if (asama === 'oynaniyor' && cevaplarRef.current.length > 0) {
      turBitir(cevaplarRef.current, true)
      return
    }
    onCik()
  }

  const { kalan, toplam } = useTurSayaci({
    mod: gecerliMod,
    turNo,
    yanlisSayisi: cevaplar.filter((c) => !c.dogruMu).length,
    onTurBitti: turSuresiDoldu,
    aktif: asama === 'oynaniyor' && !duraklatilan && !elBekliyor && el !== null,
    sure: soruSuresi('antlasma', bossEl ? bossZorlugu(zorluk) : null),
    anahtar: elSayisi,
    onBitti: sureDoldu,
  })

  const eslesenMaddeler = new Set(eslesenler.map((e) => e.madde))
  const eslesenAntlasmalar = new Set(eslesenler.map((e) => e.antlasma))

  const denetle = (madde: string, antlasma: string) => {
    if (!el) return

    const dogruMu = eslesiyorMu(el, madde, antlasma)
    const es = el.esler.find((e) => e.madde === madde)
    if (!es) return

    setCevaplar((onceki) => [...onceki, { soru: es, dogruMu }])
    geriBildir(dogruMu)

    if (!dogruMu) {
      setYanlisGirdileri((onceki) => [...onceki, antlasma])
      setYanlisCift({ madde, antlasma })
      zamanlayiciRef.current = setTimeout(() => {
        setYanlisCift(null)
        setSecim(BOS_SECIM)
        // Tek yanlış eşleştirme turu bitiriyor; banka turu bunun dışında.
        if (elerMi(false, bankaTuru, gecerliMod)) {
          setElendi(bossEl ? 'boss' : 'yanlis')
          turBitir(cevaplarRef.current)
        }
      }, CEVAP_BEKLEMESI)
      return
    }

    setSecim(BOS_SECIM)

    // Yeni el kurmak bir yan etki; `setEslesenler`in güncelleyicisi içinde
    // yapılamaz — React güncelleyicileri geliştirmede iki kez çağırıyor.
    const yeniEslesenler = [...eslesenler, es]
    if (yeniEslesenler.length < EL_BOYUTU) {
      setEslesenler(yeniEslesenler)
      return
    }

    setEslesenler(yeniEslesenler)
    setElBekliyor(true)
    zamanlayiciRef.current = setTimeout(elDagit, CEVAP_BEKLEMESI)
  }

  const maddeSec = (madde: string) => {
    if (asama !== 'oynaniyor' || yanlisCift !== null || elBekliyor || eslesenMaddeler.has(madde))
      return
    // Aynı kutuya ikinci dokunuş seçimi geri alır; yanlış dokunan kilitlenmesin.
    if (secim.madde === madde) return setSecim({ ...secim, madde: null })
    if (secim.antlasma) return denetle(madde, secim.antlasma)
    setSecim({ ...secim, madde })
  }

  const antlasmaSec = (antlasma: string) => {
    if (
      asama !== 'oynaniyor' ||
      yanlisCift !== null ||
      elBekliyor ||
      eslesenAntlasmalar.has(antlasma)
    )
      return
    if (secim.antlasma === antlasma) return setSecim({ ...secim, antlasma: null })
    if (secim.madde) return denetle(secim.madde, antlasma)
    setSecim({ ...secim, antlasma })
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
        oyunId="antlasma"
        baslik={oyun.ad}
        sayac={
          asama === 'bitti'
            ? null
            : {
                kalan,
                toplam,
                sira: elSayisi + 1,
                boss: bossEl,
                mod: gecerliMod,
                seri: guncelSeri(cevaplar),
                dogru: dogruSayisi,
                yanlis: cevaplar.length - dogruSayisi,
                enIyiSeri: turOzeti(cevaplar).enIyiSeri,
                rekor: Math.max(istatistik.enIyiDogru, dogruSayisi),
              }
        }
        onCik={turdanCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            girdiler={yanlisGirdileri}
            rekor={turBasiRekor.current}
            bankaTuru={bankaTuru}
            mod={gecerliMod}
            elendi={elendi}
            onTekrar={turBaslat}
            onCik={onCik}
            bildir={bildir}
          />
        ) : (
          asama === 'oynaniyor' &&
          el && (
            <div className="flex flex-1 flex-col gap-2 pb-1">
              {/* Elin dönemi. El mümkün olduğunca tek dönemden kuruluyor;
                  bunu söylemek bağlam veriyor ve oyunun neden zor olduğunu
                  açıklıyor: aynı dönemden dört antlaşma. */}
              <p className="mt-2.5 flex flex-none items-center justify-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-trh-koyu">
                <ScrollText size={13} aria-hidden />
                {el.donem ? TARIH_DONEM_ADI[el.donem] : 'Karışık dönem'}
              </p>

              <section className="flex-none">
                <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
                  Maddeler
                </h2>
                <ul className="flex flex-col gap-[7px]">
                  {el.maddeler.map((madde) => (
                    <li key={madde}>
                      <EslestirmeDugmesi
                        durum={eslestirmeDurumu({
                          eslesti: eslesenMaddeler.has(madde),
                          hatali: yanlisCift?.madde === madde,
                          secili: secim.madde === madde,
                        })}
                        renk={RENK}
                        onSec={() => maddeSec(madde)}
                        className="min-h-[52px] items-start py-2 text-left text-[11.5px] font-bold leading-[1.35]"
                      >
                        {madde}
                      </EslestirmeDugmesi>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex-none">
                <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
                  {sutunBasligi(el.donem)}
                </h2>
                <ul className="grid grid-cols-2 gap-[7px]">
                  {el.antlasmalar.map((antlasma) => (
                    <li key={antlasma}>
                      <EslestirmeDugmesi
                        durum={eslestirmeDurumu({
                          eslesti: eslesenAntlasmalar.has(antlasma),
                          hatali: yanlisCift?.antlasma === antlasma,
                          secili: secim.antlasma === antlasma,
                        })}
                        renk={RENK}
                        onSec={() => antlasmaSec(antlasma)}
                        className="min-h-[50px] justify-center text-center text-[12px]"
                      >
                        {antlasma}
                      </EslestirmeDugmesi>
                    </li>
                  ))}
                </ul>
              </section>

              {/* İki adımlı bir işlemde ilk adımdan sonra ne olacağını söylemek
                  gerekiyor. */}
              <p className="mt-auto flex-none pt-1 text-center text-[11.5px] font-bold text-muted-foreground">
                {secim.madde
                  ? 'Şimdi antlaşmasına dokun'
                  : secim.antlasma
                    ? 'Şimdi maddesine dokun'
                    : 'Bir maddeye dokun'}
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
        mod={mod}
        setMod={bankaTuru ? null : setMod}
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
  mod,
  elendi,
  onTekrar,
  onCik,
  bildir,
}: {
  sonuc: { ozet: TurOzeti<AntlasmaMaddesi>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki antlaşma seçimleri. */
  girdiler: string[]
  rekor: number
  bankaTuru: boolean
  mod: OyunModu
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
      oyunId="antlasma"
      dogru={ozet.dogru}
      yanlis={ozet.yanlis}
      enIyiSeri={ozet.enIyiSeri}
      rekor={rekor}
      yeniRekor={yeniRekor}
      bankaTuru={bankaTuru}
      mod={mod}
      elendi={elendi}
      altBaslik={
        bankaTuru
          ? 'Banka soruları — genel testte doğru bilince düşerler.'
          : rekorCumlesi(ozet.dogru, rekor, yeniRekor, 'eşleştirme')
      }
      bolumBasligi="Karıştırdıkların"
      bolumAltYazisi="Madde, ait olduğu antlaşma ve senin dediğin."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((es, sira) => (
            <YanlisKarti
              key={`${es.madde}-${sira}`}
              oyunId="antlasma"
              soru={antlasmadanBanka(es)}
              bildir={bildir}
            >
              <b className="block text-[12.5px] font-bold leading-snug">{es.madde}</b>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-success">
                <Check size={13} className="shrink-0" aria-hidden />
                {es.antlasma}
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
