'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Check, HelpCircle, RotateCcw, X } from 'lucide-react'
import type { OyunIstatistigi } from '@/lib/types'
import { KURAL_ACIKLAMASI, KURAL_ADI } from '@/lib/oyunlar/yazim-havuzu'
import {
  TUR_SURESI,
  YANLIS_CEZASI,
  kalanSaniye,
  rekorKirildiMi,
  sureOrani,
  turHazirla,
  turOzeti,
  type Cevap,
  type OyunSorusu,
  type Sik,
  type TurOzeti,
} from '@/lib/oyunlar/yazim-oyunu'
import { oyunBul } from '@/lib/oyunlar/tanim'
import { useGeriKatmani } from '@/lib/geri'
import { cn } from '@/lib/utils'
import { Buton, Deger } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'
import { OyunTanitim } from '@/components/oyun-tanitim'

/** Doğru cevaptan sonra bir sonraki soruya geçiş gecikmesi (ms). */
const DOGRU_BEKLEME = 320
/** Yanlışta daha uzun bekleniyor: doğrusunun hangisi olduğu okunabilsin. */
const YANLIS_BEKLEME = 900

type Asama = 'tanitim' | 'oynaniyor' | 'bitti'

type GeriBildirim = { secilenMetin: string; dogruMu: boolean }

/**
 * Yazım Ustası — mini oyun.
 *
 * Tam ekran bir katman olarak açılıyor (alt menü ve "Geri" düğmesi dahil her
 * şeyin üstüne): süreli bir oyunda yanlışlıkla sekmeye basmak turu mahveder.
 * Android geri tuşu `useGeriKatmani` ile oyundan çıkarıyor.
 */
export function YazimOyunuEkrani({
  istatistik,
  onTurBitti,
  onCik,
}: {
  istatistik: OyunIstatistigi
  onTurBitti: (ozet: TurOzeti) => void
  onCik: () => void
}) {
  const oyun = oyunBul('yazim')

  const [asama, setAsama] = useState<Asama>('tanitim')
  const [yardimAcik, setYardimAcik] = useState(false)

  const [sorular, setSorular] = useState<OyunSorusu[]>([])
  const [sira, setSira] = useState(0)
  const [cevaplar, setCevaplar] = useState<Cevap[]>([])
  const [geriBildirim, setGeriBildirim] = useState<GeriBildirim | null>(null)

  const [bitisZamani, setBitisZamani] = useState(0)
  const [kalan, setKalan] = useState(TUR_SURESI)
  /** Yardım açıkken sayaç durur; kalan saniye burada bekletilir. */
  const [duraklatilan, setDuraklatilan] = useState<number | null>(null)

  const [sonuc, setSonuc] = useState<{ ozet: TurOzeti; yeniRekor: boolean } | null>(null)

  // Tur başındaki rekor: sonuç ekranı "yeni rekor" derken güncellenmiş değerle
  // değil, tura girerken geçerli olan değerle karşılaştırmalı.
  const turBasiRekor = useRef(istatistik.enIyiDogru)
  const zamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Sayaç bittiğinde o ana kadarki cevaplar lazım; efekt `cevaplar`a bağlanırsa
   *  her cevapta yeniden kurulur ve sayaç zıplar. */
  const cevaplarRef = useRef<Cevap[]>([])
  cevaplarRef.current = cevaplar
  /** Tur bir kez bitirilir: 250 ms'lik sayaç, `asama` değişmeden önce ikinci kez
   *  tetiklenirse istatistik iki kat sayılırdı. */
  const bittiRef = useRef(false)

  useGeriKatmani(asama !== 'tanitim' && !yardimAcik, onCik)

  const turBaslat = useCallback(() => {
    turBasiRekor.current = istatistik.enIyiDogru
    bittiRef.current = false
    if (zamanlayiciRef.current) clearTimeout(zamanlayiciRef.current)
    setSorular(turHazirla())
    setSira(0)
    setCevaplar([])
    setGeriBildirim(null)
    setSonuc(null)
    setDuraklatilan(null)
    setKalan(TUR_SURESI)
    setBitisZamani(Date.now() + TUR_SURESI * 1000)
    setAsama('oynaniyor')
  }, [istatistik.enIyiDogru])

  const turBitir = useCallback(
    (verilenler: Cevap[]) => {
      if (bittiRef.current) return
      bittiRef.current = true
      const ozet = turOzeti(verilenler)
      setSonuc({ ozet, yeniRekor: rekorKirildiMi({ ...istatistik, enIyiDogru: turBasiRekor.current }, ozet) })
      setAsama('bitti')
      onTurBitti(ozet)
    },
    [istatistik, onTurBitti],
  )

  // Sayaç. Hedef zaman damgasından okunuyor; arka plana atılan WebView'da
  // sayarak ilerleyen bir sayaç donup kalırdı (pomodoro ile aynı yaklaşım).
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

  // Havuz tükenirse (262 soru — pratikte imkânsız ama tur uzatılabilir) tur
  // süre dolmadan biter; yoksa ekranda soru kalmaz ve sayaç boşa işlerdi.
  useEffect(() => {
    if (asama !== 'oynaniyor' || sorular.length === 0) return
    if (sira >= sorular.length) turBitir(cevaplarRef.current)
  }, [asama, sira, sorular.length, turBitir])

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

  const cevapla = (sik: Sik) => {
    // Geri bildirim gösterilirken ikinci dokunuş yok sayılıyor; yoksa aynı
    // soruya iki cevap yazılır ve süre iki kez cezalandırılırdı.
    if (asama !== 'oynaniyor' || geriBildirim !== null) return

    const soru = sorular[sira]
    if (!soru) return

    const dogruMu = sik.dogruMu
    setCevaplar((onceki) => [...onceki, { soru: soru.soru, dogruMu }])
    setGeriBildirim({ secilenMetin: sik.metin, dogruMu })
    titre(dogruMu)

    if (!dogruMu) setBitisZamani((b) => b - YANLIS_CEZASI * 1000)

    zamanlayiciRef.current = setTimeout(
      () => {
        setGeriBildirim(null)
        setSira((s) => s + 1)
      },
      dogruMu ? DOGRU_BEKLEME : YANLIS_BEKLEME,
    )
  }

  const yardimAc = () => {
    setDuraklatilan(kalanSaniye(bitisZamani))
    setYardimAcik(true)
  }

  const yardimKapat = () => {
    // Okurken geçen süre oyuncudan gitmesin: kalan süre olduğu gibi geri konur.
    if (duraklatilan !== null) setBitisZamani(Date.now() + duraklatilan * 1000)
    setDuraklatilan(null)
    setYardimAcik(false)
  }

  const dogruSayisi = cevaplar.filter((c) => c.dogruMu).length
  const yanlisSayisi = cevaplar.length - dogruSayisi
  const gorunenKalan = duraklatilan ?? kalan
  const rekor = Math.max(istatistik.enIyiDogru, dogruSayisi)
  const soru = sorular[sira]

  return (
    // z-50: alt menü z-40'ta duruyor, oyun onun da üstünde olmalı — süreli bir
    // turda yanlışlıkla sekmeye basmak turu bitirirdi.
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="guvenli-alt mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 pt-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCik}
            aria-label="Oyundan çık"
            className="-ml-2 rounded-full p-2 text-muted-foreground active:bg-muted"
          >
            <X size={20} aria-hidden />
          </button>
          <p className="font-display text-base font-semibold">{oyun.ad}</p>
          <button
            type="button"
            onClick={yardimAc}
            aria-label="Nasıl oynanır"
            className="-mr-2 rounded-full p-2 text-muted-foreground active:bg-muted"
          >
            <HelpCircle size={20} aria-hidden />
          </button>
        </div>

        {asama === 'bitti' && sonuc ? (
          <SonucGorunumu
            sonuc={sonuc}
            rekor={Math.max(istatistik.enIyiDogru, sonuc.ozet.dogru)}
            onTekrar={turBaslat}
            onCik={onCik}
          />
        ) : (
          <>
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              <Deger className="px-2" etiket="Doğru" deger={String(dogruSayisi)} vurgu />
              <Deger className="px-2" etiket="Yanlış" deger={String(yanlisSayisi)} />
              <Deger className="px-2" etiket="Süre" deger={String(gorunenKalan)} altNot="sn" />
              <Deger className="px-2" etiket="Rekor" deger={String(rekor)} />
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-200',
                  gorunenKalan <= 10 ? 'bg-danger' : 'bg-primary',
                )}
                style={{ width: `${sureOrani(gorunenKalan) * 100}%` }}
              />
            </div>

            {asama === 'oynaniyor' && soru && (
              <div className="flex flex-1 flex-col justify-center py-6">
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Hangisi doğru yazılmış?
                </p>
                <div className="space-y-3">
                  {soru.siklar.map((sik) => (
                    <SikDugmesi
                      key={sik.metin}
                      sik={sik}
                      geriBildirim={geriBildirim}
                      onSec={() => cevapla(sik)}
                    />
                  ))}
                </div>
                <p className="mt-5 text-center text-xs text-muted-foreground">
                  {KURAL_ADI[soru.soru.kural]}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <OyunTanitim
        oyun={oyun}
        acik={asama === 'tanitim' || yardimAcik}
        rekor={istatistik.enIyiDogru}
        baslatir={asama === 'tanitim'}
        onBasla={turBaslat}
        onKapat={asama === 'tanitim' ? onCik : yardimKapat}
      />
    </div>
  )
}

/**
 * Tek şık.
 *
 * Cevaptan sonra **iki** şık da renklenir: seçilen kırmızıysa doğrusunun
 * hangisi olduğu aynı anda yeşille gösterilir. Yalnızca seçilen renklenseydi
 * oyuncu yanlış yaptığını görür ama doğrusunu öğrenemezdi.
 */
function SikDugmesi({
  sik,
  geriBildirim,
  onSec,
}: {
  sik: Sik
  geriBildirim: GeriBildirim | null
  onSec: () => void
}) {
  const acikta = geriBildirim !== null
  const secilen = acikta && geriBildirim.secilenMetin === sik.metin
  const yanlisSecim = secilen && !sik.dogruMu

  return (
    <button
      type="button"
      onClick={onSec}
      disabled={acikta}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-6 text-center',
        'font-display text-xl font-semibold leading-snug transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        !acikta && 'border-border bg-card active:bg-muted',
        acikta && sik.dogruMu && 'border-success bg-success/12 text-success',
        yanlisSecim && 'border-danger bg-danger/12 text-danger',
        acikta && !sik.dogruMu && !secilen && 'border-border bg-card opacity-45',
      )}
    >
      <span className="min-w-0 break-words">{sik.metin}</span>
      {acikta && sik.dogruMu && <Check size={20} className="shrink-0" aria-hidden />}
      {yanlisSecim && <X size={20} className="shrink-0" aria-hidden />}
    </button>
  )
}

function SonucGorunumu({
  sonuc,
  rekor,
  onTekrar,
  onCik,
}: {
  sonuc: { ozet: TurOzeti; yeniRekor: boolean }
  rekor: number
  onTekrar: () => void
  onCik: () => void
}) {
  const { ozet, yeniRekor } = sonuc
  const yuzde = Math.round(ozet.oran * 100)

  return (
    <div className="flex-1 py-4">
      <div className="flex flex-col items-center text-center">
        <Rabi durum={yeniRekor || ozet.hatasiz ? 'kutlama' : ozet.oran >= 0.6 ? 'mutlu' : 'normal'} boyut={104} />
        <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {yeniRekor ? 'Yeni rekor!' : 'Süre bitti'}
        </p>
        {ozet.hatasiz && (
          <p className="mt-1 text-sm text-success">Hiç yanlışın yok — hatasız tur.</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Deger etiket="Doğru" deger={String(ozet.dogru)} vurgu />
        <Deger etiket="Yanlış" deger={String(ozet.yanlis)} />
        <Deger etiket="Başarı" deger={`%${yuzde}`} altNot={`rekor ${rekor}`} />
      </div>

      {ozet.yanlislar.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            Yanlış bildiklerin
          </h2>
          <ul className="space-y-2">
            {ozet.yanlislar.map((yanlis) => (
              <li key={yanlis.dogru} className="rounded-2xl border border-border bg-card p-3">
                <p className="font-medium">
                  <span className="text-success">{yanlis.dogru}</span>{' '}
                  <span className="text-sm text-muted-foreground line-through">{yanlis.yanlis}</span>
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {KURAL_ADI[yanlis.kural]} — {KURAL_ACIKLAMASI[yanlis.kural]}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ozet.toplam === 0 && (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Hiç cevap vermedin. Bir daha dene, süre {TUR_SURESI} saniye.
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
