'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Beaker, Check } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { FormulEsi } from '@/lib/oyunlar/formul-havuzu'
import { FORMUL_HAVUZU, TUR_ADI } from '@/lib/oyunlar/formul-havuzu'
import {
  EL_BOYUTU,
  elHazirla,
  eslesiyorMu,
  formulParcalari,
  type FormulEli,
} from '@/lib/oyunlar/formul'
import {
  guncelSeri,
  karistir,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { formuldenBanka, type BankaCevabi, type BankaKaydi } from '@/lib/oyunlar/banka'
import {
  bossElMi,
  bossZorlugu,
  elerMi,
  soruSuresi,
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

/** Bir cevaptan sonra ekranın beklediği süre (ms) — Edebiyat'takiyle aynı ritim. */
const CEVAP_BEKLEMESI = 800

/** Seçili kutunun rengi — Kimya dersinin ailesi. */
const RENK: EslestirmeRengi = {
  kenar: 'border-edb-koyu',
  zemin: 'bg-edb-kart',
  yazi: 'text-edb-koyu',
}

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type Secim = { formul: string | null; ad: string | null }

const BOS_SECIM: Secim = { formul: null, ad: null }

/**
 * Formülü alt indisli çizer.
 *
 * Havuzda `H2SO4` yazıyor, ekranda H₂SO₄ duruyor. Unicode'un alt indis
 * rakamları kullanılmadı; gerekçesi `lib/oyunlar/formul.ts` içinde.
 */
export function FormulYazisi({ formul }: { formul: string }) {
  return (
    <span className="rakam">
      {formulParcalari(formul).map((parca, sira) =>
        parca.alt ? (
          <sub key={sira} className="text-[0.7em]">
            {parca.metin}
          </sub>
        ) : (
          <span key={sira}>{parca.metin}</span>
        ),
      )}
    </span>
  )
}

/**
 * Banka kayıtlarını havuzdaki eşlere bağlar.
 *
 * Kayıt formül ve adı tutuyor ama ele tür de gerekiyor (ekranın başlığında
 * yazıyor, tek türlü el kuralını da o belirliyor). Havuzdan kalkmış bir formül
 * sessizce eleniyor — sorusu olmayan bir kaydı ele koymak cevabı olmayan bir
 * soru demek.
 */
function bankaEsleri(
  kayitlar: readonly BankaKaydi[],
  havuz: readonly FormulEsi[] = FORMUL_HAVUZU,
): FormulEsi[] {
  const esler: FormulEsi[] = []
  for (const kayit of kayitlar) {
    if (kayit.soru.oyun !== 'formul') continue
    const aranan = kayit.soru.formul
    const es = havuz.find((h) => h.formul === aranan)
    if (es) esler.push(es)
  }
  return esler
}

/**
 * Banka turunun eli.
 *
 * `elHazirla` kullanılamıyor: o havuzdan rastgele bir el kuruyor, banka
 * sorularını **öne alması** gerekiyor. El altı bileşik istiyor; banka altıyı
 * doldurmuyorsa geri kalanı havuz tamamlıyor. Banka tarafından tek eş bile
 * kalmadıysa `null` dönüyor ve tur erken bitiyor: banka turu bankadaki
 * soruları bitirince amacına ulaşmış olur.
 */
function bankaEliHazirla(
  esler: readonly FormulEsi[],
  kullanilan: ReadonlySet<string>,
  havuz: readonly FormulEsi[] = FORMUL_HAVUZU,
  rastgele: () => number = Math.random,
): FormulEli | null {
  const secilen: FormulEsi[] = []
  const formuller = new Set<string>()

  const topla = (kaynak: readonly FormulEsi[]) => {
    for (const es of karistir(kaynak, rastgele)) {
      if (secilen.length >= EL_BOYUTU) return
      if (kullanilan.has(es.formul) || formuller.has(es.formul)) continue
      secilen.push(es)
      formuller.add(es.formul)
    }
  }

  topla(esler)
  if (secilen.length === 0) return null

  topla(havuz)
  if (secilen.length < EL_BOYUTU) return null

  const ilk = secilen[0].tur
  const tur = secilen.every((es) => es.tur === ilk) ? ilk : null

  return {
    tur,
    esler: secilen,
    formuller: karistir(secilen.map((e) => e.formul), rastgele),
    adlar: karistir(secilen.map((e) => e.ad), rastgele),
  }
}

/**
 * Formül Eşleştirme — mini oyun.
 *
 * Altı formül ve altı ad; birine sonra ötekine dokunarak eşleştiriliyor.
 * Eşleşen kutular ekrandan kaldırılmıyor, yeşile dönüp yerinde kalıyor:
 * silinselerdi ızgara her eşleşmede yeniden dizilir, oyuncunun parmağı gitmek
 * istediği kutuyu kaybederdi. (Edebiyat Eşleştirme'deki kuralın aynısı.)
 */
export function FormulOyunuEkrani({
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
    ozet: TurOzeti<FormulEsi>,
    bankaCevaplari: BankaCevabi[],
    gecenSaniye: number,
    yarim: boolean,
  ) => void
  mod: OyunModu
  setMod: (mod: OyunModu) => void
  onCik: () => void
  bildir: BildirimKolu
}) {
  const oyun = oyunBul('formul')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [el, setEl] = useState<FormulEli | null>(null)
  const [secim, setSecim] = useState<Secim>(BOS_SECIM)
  const [eslesenler, setEslesenler] = useState<FormulEsi[]>([])
  const [yanlisCift, setYanlisCift] = useState<Secim | null>(null)
  /** El tamamlandı, yenisi dağıtılmayı bekliyor — bu sırada dokunuşlar yok sayılır. */
  const [elBekliyor, setElBekliyor] = useState(false)
  const [cevaplar, setCevaplar] = useState<Cevap<FormulEsi>[]>([])
  /** Yanlışlarla aynı sıradaki seçimler — tur sonunda "sen X dedin" için. */
  const [yanlisGirdileri, setYanlisGirdileri] = useState<string[]>([])

  const [bossEl, setBossEl] = useState(false)
  const [verilenBoss, setVerilenBoss] = useState(0)
  const [elendi, setElendi] = useState<Eleme>(false)
  /** Kaçıncı el — sayaç her elde sıfırlansın diye. */
  const [elSayisi, setElSayisi] = useState(0)

  const [zorluk, setZorluk] = useYerelDepo<Zorluk>(ANAHTARLAR.zorlukFormul, 'kolay')
  const [duraklatilan, setDuraklatilan] = useState(false)
  const [turNo, setTurNo] = useState(0)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<FormulEsi>; yeniRekor: boolean } | null>(
    null,
  )

  const bankaHavuzu = useMemo(() => bankaEsleri(bankaSorulari), [bankaSorulari])
  const bankaTuru = bankaHavuzu.length > 0
  // Banka turu modu dinlemiyor; kural tek yerden okunuyor.
  const gecerliMod = etkinMod(mod, bankaTuru)

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const turBasladiRef = useRef(0)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<FormulEsi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş formüller — aynı bileşik iki kez gelmesin. */
  const kullanilanRef = useRef<Set<string>>(new Set())
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const sonrakiEl = useCallback(
    (boss: boolean) => {
      if (bankaTuru) return bankaEliHazirla(bankaHavuzu, kullanilanRef.current)
      // Zorluk elin türünü değil içindeki bileşikleri seçiyor; gerekçesi
      // `lib/oyunlar/formul.ts` içinde.
      return elHazirla(kullanilanRef.current, boss ? bossZorlugu(zorluk).zorluk : zorluk)
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
    (verilenler: Cevap<FormulEsi>[], yarim = false) => {
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
      onTurBitti(
        ozet,
        verilenler.map((cevap) => ({
          soru: formuldenBanka(cevap.soru),
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

  const geriBildir = (dogruMu: boolean) => {
    oyunSesiCal(dogruMu ? 'dogru' : 'yanlis', sesAcik)
    if (!Capacitor.isNativePlatform()) return
    void (dogruMu
      ? Haptics.impact({ style: ImpactStyle.Light })
      : Haptics.notification({ type: NotificationType.Error })
    ).catch(() => {})
  }

  const elDagit = () => {
    for (const e of el?.esler ?? []) kullanilanRef.current.add(e.formul)
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
   * Kalan eşleşmeler cevaplanmamış sayılıyor — süre dolması bilememekle aynı.
   * Banka turunda eleme yok: yeni el dağıtılıyor.
   */
  const sureDoldu = useCallback(() => {
    if (asama !== 'oynaniyor' || !el) return
    const kalanEsler = el.esler.filter((e) => !eslesenler.some((s) => s.formul === e.formul))
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
    Çıkış turu bitiriyor — her modda. Doğrudan çıkılsaydı o turda yanlış
    bilinen sorular Oyun Bankası'na hiç düşmezdi.
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
    sure: soruSuresi('formul', bossEl ? bossZorlugu(zorluk) : null),
    anahtar: elSayisi,
    onBitti: sureDoldu,
  })

  const eslesenFormuller = new Set(eslesenler.map((e) => e.formul))
  const eslesenAdlar = new Set(eslesenler.map((e) => e.ad))

  const denetle = (formul: string, ad: string) => {
    if (!el) return

    const dogruMu = eslesiyorMu(el, formul, ad)
    const es = el.esler.find((e) => e.formul === formul)
    if (!es) return

    setCevaplar((onceki) => [...onceki, { soru: es, dogruMu }])
    geriBildir(dogruMu)

    if (!dogruMu) {
      setYanlisGirdileri((onceki) => [...onceki, ad])
      setYanlisCift({ formul, ad })
      zamanlayiciRef.current = setTimeout(() => {
        setYanlisCift(null)
        setSecim(BOS_SECIM)
        if (elerMi(false, bankaTuru, gecerliMod)) {
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

    setEslesenler(yeniEslesenler)
    setElBekliyor(true)
    zamanlayiciRef.current = setTimeout(elDagit, CEVAP_BEKLEMESI)
  }

  const formulSec = (formul: string) => {
    if (
      asama !== 'oynaniyor' ||
      yanlisCift !== null ||
      elBekliyor ||
      eslesenFormuller.has(formul)
    )
      return
    // Aynı kutuya ikinci dokunuş seçimi geri alır; yanlış dokunan kilitlenmesin.
    if (secim.formul === formul) return setSecim({ ...secim, formul: null })
    if (secim.ad) return denetle(formul, secim.ad)
    setSecim({ ...secim, formul })
  }

  const adSec = (ad: string) => {
    if (asama !== 'oynaniyor' || yanlisCift !== null || elBekliyor || eslesenAdlar.has(ad)) return
    if (secim.ad === ad) return setSecim({ ...secim, ad: null })
    if (secim.formul) return denetle(secim.formul, ad)
    setSecim({ ...secim, ad })
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
        oyunId="formul"
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
            <div className="flex flex-1 flex-col gap-2.5 pb-1">
              {/* Elin türü. El mümkün olduğunca tek türden kuruluyor; bunu
                  söylemek öğrenciye bağlam veriyor ve oyunun neden zor
                  olduğunu açıklıyor: aynı türden altı bileşik. */}
              <p className="mt-3 flex flex-none items-center justify-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-edb-koyu">
                <Beaker size={13} aria-hidden />
                {el.tur ? TUR_ADI[el.tur] : 'Karışık'}
              </p>

              <section className="flex-none">
                <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
                  Formüller
                </h2>
                {/* Formüller üç sütun: en uzunu bile (C6H12O6) sekiz karakter,
                    adlarınsa yarısı iki kelime. Aynı ızgarada dursalardı ya
                    formüller boşluk içinde yüzer ya adlar üç satıra inerdi. */}
                <ul className="grid grid-cols-3 gap-[7px]">
                  {el.formuller.map((formul) => (
                    <li key={formul}>
                      <EslestirmeDugmesi
                        durum={eslestirmeDurumu({
                          eslesti: eslesenFormuller.has(formul),
                          hatali: yanlisCift?.formul === formul,
                          secili: secim.formul === formul,
                        })}
                        renk={RENK}
                        onSec={() => formulSec(formul)}
                        className="min-h-[48px] justify-center px-1 text-center text-[15px]"
                      >
                        <FormulYazisi formul={formul} />
                      </EslestirmeDugmesi>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex-none">
                <h2 className="mb-1.5 pl-0.5 text-[11px] font-extrabold uppercase tracking-wide text-muted-foreground/75">
                  Adlar
                </h2>
                <ul className="grid grid-cols-2 gap-[7px]">
                  {el.adlar.map((ad) => (
                    <li key={ad}>
                      <EslestirmeDugmesi
                        durum={eslestirmeDurumu({
                          eslesti: eslesenAdlar.has(ad),
                          hatali: yanlisCift?.ad === ad,
                          secili: secim.ad === ad,
                        })}
                        renk={RENK}
                        onSec={() => adSec(ad)}
                        className="min-h-[52px] justify-center px-2 text-center"
                      >
                        {ad}
                      </EslestirmeDugmesi>
                    </li>
                  ))}
                </ul>
              </section>

              {/* İki adımlı bir işlemde ilk adımdan sonra ne olacağını söylemek
                  gerekiyor. */}
              <p className="mt-auto flex-none pt-1 text-center text-[11.5px] font-bold text-muted-foreground">
                {secim.formul
                  ? 'Şimdi adına dokun'
                  : secim.ad
                    ? 'Şimdi formülüne dokun'
                    : 'Bir formüle dokun'}
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
  sonuc: { ozet: TurOzeti<FormulEsi>; yeniRekor: boolean }
  /** Yanlışlarla aynı sıradaki ad seçimleri. */
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
      oyunId="formul"
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
      bolumAltYazisi="Formül, doğru adı ve senin dediğin."
      onTekrar={onTekrar}
      onCik={onCik}
    >
      {ozet.yanlislar.length > 0 && (
        <div className="flex flex-none flex-col gap-2">
          {gorunen.map((es, sira) => (
            <YanlisKarti
              key={`${es.formul}-${sira}`}
              oyunId="formul"
              soru={formuldenBanka(es)}
              bildir={bildir}
            >
              <b className="block font-display text-[15px] font-extrabold leading-tight">
                <FormulYazisi formul={es.formul} />
              </b>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-success">
                <Check size={13} className="shrink-0" aria-hidden />
                {es.ad}
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
