'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { RotateCcw } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import type { EdebiyatEsi } from '@/lib/oyunlar/edebiyat-havuzu'
import { DONEM_ADI } from '@/lib/oyunlar/edebiyat-havuzu'
import { EL_BOYUTU, elHazirla, eslesiyorMu, type EdebiyatEli } from '@/lib/oyunlar/edebiyat'
import {
  TUR_SURESI,
  YANLIS_CEZASI,
  guncelSeri,
  kalanSaniye,
  rekorKirildiMi,
  turOzeti,
  type Cevap,
  type TurOzeti,
} from '@/lib/oyunlar/tur'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton, Deger } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { OyunKabugu } from '@/components/oyun-kabuk'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Yanlış eşleştirmenin kırmızı kaldığı süre (ms). */
const YANLIS_BEKLEME = 800

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type Secim = { eser: string | null; yazar: string | null }

const BOS_SECIM: Secim = { eser: null, yazar: null }

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
  onTurBitti,
  onCik,
}: {
  istatistik: OyunIstatistigi
  onTurBitti: (ozet: TurOzeti<EdebiyatEsi>) => void
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

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti<EdebiyatEsi>; yeniRekor: boolean } | null>(
    null,
  )

  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cevaplarRef = useRef<Cevap<EdebiyatEsi>[]>([])
  cevaplarRef.current = cevaplar
  /** Tur boyunca sorulmuş eserler — aynı eser iki kez gelmesin. */
  const kullanilanRef = useRef<Set<string>>(new Set())
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    kullanilanRef.current = new Set()
    setEl(elHazirla(kullanilanRef.current))
    setSecim(BOS_SECIM)
    setEslesenler([])
    setYanlisCift(null)
    setCevaplar([])
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap<EdebiyatEsi>[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({
        ozet,
        yeniRekor: rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet),
      })
      setAsama('bitti')
      onTurBitti(ozet)
    },
    [istatistik, onTurBitti],
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

  // Havuz tükenip yeni el kurulamazsa tur süre dolmadan biter.
  useEffect(() => {
    if (asama === 'oynaniyor' && el === null) turBitir(cevaplarRef.current)
  }, [asama, el, turBitir])

  useEffect(() => () => {
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
  }, [])

  const titre = (dogruMu: boolean) => {
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
    titre(dogruMu)

    if (!dogruMu) {
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
    setEl(elHazirla(kullanilanRef.current))
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
  const cozulenler = cevaplar.filter((c) => c.dogruMu).map((c) => c.soru)

  return (
    <>
      <OyunKabugu
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
              }
        }
        onCik={onCik}
        onYardim={yardimAc}
      >
        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            rekor={Math.max(istatistik.enIyiDogru, sonuc.ozet.dogru)}
            onTekrar={turBaslat}
            onCik={onCik}
          />
        ) : (
          asama === 'oynaniyor' &&
          el && (
            <div className="pb-3">
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {el.donem ? DONEM_ADI[el.donem] : 'Karışık dönem'} · eseri yazarıyla eşleştir
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

              <EslesenlerListesi esler={cozulenler} />
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
    <section className="mt-3">
      <h2 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {baslik}
      </h2>
      <ul className="grid grid-cols-2 gap-2">
        {secenekler.map((deger) => {
          const eslesti = eslesenler.has(deger)
          return (
            <li key={deger}>
              <button
                type="button"
                onClick={() => onSec(deger)}
                disabled={eslesti}
                className={cn(
                  'flex min-h-16 w-full items-center justify-center rounded-2xl border-2 px-2 py-2.5',
                  'text-center text-[13px] font-medium leading-tight transition',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  eslesti && 'border-success/40 bg-success/10 text-success/70',
                  !eslesti && yanlis === deger && 'border-danger bg-danger/15 text-danger',
                  !eslesti && yanlis !== deger && secili === deger && 'border-primary bg-primary/12 text-primary',
                  !eslesti && yanlis !== deger && secili !== deger && 'border-border bg-card active:bg-muted',
                )}
              >
                {deger}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * Tur boyunca kurulan eşleşmeler.
 *
 * Ekranın altı boş kalmasın diye konmadı — asıl işi öğretmek: doğru eşleştirdiğin
 * çift yazıyla bir kez daha karşına çıkıyor, dönemiyle birlikte. En yenisi üstte.
 */
function EslesenlerListesi({ esler }: { esler: EdebiyatEsi[] }) {
  if (esler.length === 0) {
    return (
      <p className="mt-5 rounded-2xl border border-dashed border-border px-4 py-5 text-center text-xs leading-relaxed text-muted-foreground">
        Eşleştirdiğin çiftler burada birikecek — tur boyunca göz ucuyla tekrar edebilirsin.
      </p>
    )
  }

  return (
    <section className="mt-5">
      <h2 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Eşleştirdiklerin ({esler.length})
      </h2>
      <ul className="space-y-1.5">
        {[...esler].reverse().map((es) => (
          <li
            key={es.eser}
            className="rounded-xl bg-muted/50 px-3 py-2 text-[13px] leading-snug"
          >
            <span className="font-medium">{es.eser}</span>
            <span className="text-muted-foreground"> — {es.yazar}</span>
            <span className="block text-[11px] text-muted-foreground/70">
              {DONEM_ADI[es.donem]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SonucGorunumu({
  sonuc,
  rekor,
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti<EdebiyatEsi>; yeniRekor: boolean }
  rekor: number
  onTekrar: () => void
  onCik: () => void
}) {
  const { ozet, yeniRekor } = sonuc
  const yuzde = Math.round(ozet.oran * 100)

  return (
    <div className="flex-1 py-4">
      <div className="flex flex-col items-center text-center">
        <Rabi
          durum={yeniRekor || ozet.hatasiz ? 'kutlama' : ozet.oran >= 0.6 ? 'mutlu' : 'normal'}
          boyut={104}
        />
        <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {yeniRekor ? 'Yeni rekor!' : 'Süre bitti'}
        </p>
        {ozet.hatasiz && (
          <p className="mt-1 text-sm text-success">Hiç yanlışın yok — hatasız tur.</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <Deger className="px-2" etiket="Eşleşme" deger={String(ozet.dogru)} vurgu />
        <Deger className="px-2" etiket="Yanlış" deger={String(ozet.yanlis)} />
        <Deger className="px-2" etiket="Seri" deger={String(ozet.enIyiSeri)} />
        <Deger className="px-2" etiket="Başarı" deger={`%${yuzde}`} altNot={`rekor ${rekor}`} />
      </div>

      {ozet.yanlislar.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Karıştırdıkların</h2>
          <ul className="space-y-2">
            {ozet.yanlislar.map((es, sira) => (
              <li
                key={`${es.eser}-${sira}`}
                className="rounded-2xl border border-border bg-card px-3 py-2.5"
              >
                <p className="text-sm leading-snug">
                  <span className="font-medium">{es.eser}</span>
                  <span className="text-success"> — {es.yazar}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{DONEM_ADI[es.donem]}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ozet.toplam === 0 && (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Hiç eşleştirme yapmadın. Bir daha dene, süre {TUR_SURESI} saniye.
        </p>
      )}

      <div className="mt-6 flex gap-2 pb-2">
        <Buton bicim="ikincil" className="flex-1" onClick={onCik}>
          Çık
        </Buton>
        <Buton className="flex-1" onClick={onTekrar}>
          <RotateCcw size={16} aria-hidden /> Tekrar oyna
        </Buton>
      </div>
    </div>
  )
}
