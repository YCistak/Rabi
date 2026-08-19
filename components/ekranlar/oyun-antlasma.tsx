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
import { antlasmadanBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
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
  zemin: 'bg-trh',
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
  onCik,
}: {
  istatistik: OyunIstatistigi
  sesAcik: boolean
  /** Boş değilse eller önce bu sorulardan kurulur (Oyun Bankası turu). */
  bankaSorulari: BankaKaydi[]
  onTurBitti: (ozet: TurOzeti<AntlasmaMaddesi>, bankaCevaplari: BankaCevabi[]) => void
  onCik: () => void
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

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{
    ozet: TurOzeti<AntlasmaMaddesi>
    yeniRekor: boolean
  } | null>(null)

  const bankaHavuzu = useMemo(() => bankaEsleri(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<AntlasmaMaddesi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş maddeler — aynı madde iki kez gelmesin. */
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
    setElBekliyor(false)
    setCevaplar([])
    setYanlisGirdileri([])
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru, sonrakiEl])

  const turBitir = useCallback(
    (verilenler: Cevap<AntlasmaMaddesi>[]) => {
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
          soru: antlasmadanBanka(cevap.soru),
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
      setBitisZamani((b) => b - YANLIS_CEZASI * 1000)
      setYanlisCift({ madde, antlasma })
      zamanlayiciRef.current = setTimeout(() => {
        setYanlisCift(null)
        setSecim(BOS_SECIM)
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
    zamanlayiciRef.current = setTimeout(() => {
      for (const e of el.esler) kullanilanRef.current.add(e.madde)
      setEl(sonrakiEl())
      setEslesenler([])
      setElBekliyor(false)
    }, CEVAP_BEKLEMESI)
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
        oyunId="antlasma"
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
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
      />
    </>
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
  sonuc: { ozet: TurOzeti<AntlasmaMaddesi>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki antlaşma seçimleri. */
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
      oyunId="antlasma"
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
      bolumAltYazisi="Madde, ait olduğu antlaşma ve senin dediğin."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((es, sira) => (
            <YanlisKarti key={`${es.madde}-${sira}`} oyunId="antlasma">
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
