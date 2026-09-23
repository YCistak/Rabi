'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Eraser, Pencil, Trash2, Undo2 } from 'lucide-react'
import {
  cizimAnahtari,
  fotografKutusu,
  kayitOlcusu,
  oranla,
  type Cizgi,
  type CizimAraci,
  type Kutu,
} from '@/lib/cizim'
import { resimOku, resimSil, resimYaz } from '@/lib/resim-depo'
import { cn } from '@/lib/utils'

/**
 * Mürekkep renkleri tema değişkenlerinden gelmiyor, gelemiyor: çizim
 * fotoğrafın piksellerine yazılıp PNG olarak saklanıyor ve tuval `var(--…)`
 * çözemiyor (aylık özet afişiyle aynı gerekçe). Kâğıt fotoğrafının beyazında
 * okunan dört kalem rengi.
 */
const RENKLER = ['#e5484d', '#2f6fde', '#2f9e5b', '#1b1a19'] as const

/** Fotoğraf genişliğine oran; ince kalem cevap yazmak, kalın altını çizmek için. */
const KALINLIKLAR = [0.006, 0.012, 0.024] as const

/** Silgi kalemden geniş: ince bir silgiyle çizgiyi tutturmak iğneyle kazımak gibi. */
const SILGI_CARPANI = 3

type Durum = { taban: boolean; cizgiler: Cizgi[] }

/**
 * Tek bir sorunun çizim hâli.
 *
 * Kayıtlı çizim (taban) ayrı bir katman olarak yükleniyor ve bu oturumun
 * çizgileri onun üstüne ekleniyor; silgi ikisini birden siliyor
 * (`destination-out`). Fotoğrafın kendisine hiç dokunulmuyor — "Temizle"
 * her zaman asıl fotoğrafa dönebiliyor.
 */
export function useSoruCizimi(resimId: string, onKaydedildi: () => void) {
  const anahtar = cizimAnahtari(resimId)
  const [ciziyor, setCiziyor] = useState(false)
  const [taban, setTaban] = useState<HTMLImageElement | null>(null)
  const [durum, setDurum] = useState<Durum>({ taban: true, cizgiler: [] })
  const [gecmis, setGecmis] = useState<Durum[]>([])
  const [arac, setArac] = useState<CizimAraci>('kalem')
  const [renk, setRenk] = useState<string>(RENKLER[0])
  const [kalinlik, setKalinlik] = useState<number>(KALINLIKLAR[1])
  const [dogal, setDogal] = useState<{ genislik: number; yukseklik: number } | null>(null)

  // Soru değişince (karışık tekrarda sıradaki) çizim de onunki olmalı.
  useEffect(() => {
    let iptal = false
    setTaban(null)
    setDurum({ taban: true, cizgiler: [] })
    setGecmis([])
    setCiziyor(false)
    void resimOku(anahtar).then(async (blob) => {
      if (!blob || iptal) return
      const resim = await blobdanResim(blob)
      if (!iptal) setTaban(resim)
    })
    return () => {
      iptal = true
    }
  }, [anahtar])

  const degistir = (yeni: (d: Durum) => Durum) => {
    setGecmis((g) => [...g, durum])
    setDurum(yeni(durum))
  }

  const cizgiEkle = (cizgi: Cizgi) => degistir((d) => ({ ...d, cizgiler: [...d.cizgiler, cizgi] }))
  const geriAl = () => {
    const onceki = gecmis.at(-1)
    if (!onceki) return
    setGecmis((g) => g.slice(0, -1))
    setDurum(onceki)
  }
  const temizle = () => {
    if (!durum.taban && durum.cizgiler.length === 0) return
    degistir(() => ({ taban: false, cizgiler: [] }))
  }

  const vazgec = () => {
    setDurum({ taban: true, cizgiler: [] })
    setGecmis([])
    setCiziyor(false)
  }

  const kaydet = async () => {
    setCiziyor(false)
    if (gecmis.length === 0 || !dogal) return
    const tabanVar = durum.taban && taban !== null
    if (!tabanVar && durum.cizgiler.length === 0) {
      await resimSil(anahtar)
      setTaban(null)
    } else {
      const olcu = kayitOlcusu(dogal.genislik, dogal.yukseklik)
      const tuval = document.createElement('canvas')
      tuval.width = olcu.genislik
      tuval.height = olcu.yukseklik
      const ctx = tuval.getContext('2d')
      if (!ctx) return
      ciz(ctx, olcu.genislik, olcu.yukseklik, tabanVar ? taban : null, durum.cizgiler)
      const blob = await new Promise<Blob | null>((coz) => tuval.toBlob(coz, 'image/png'))
      if (!blob) return
      await resimYaz(anahtar, blob)
      // Kaydedilen çizim yeni taban oluyor; depodan yeniden okumak bir kare
      // çizgisiz fotoğraf gösterirdi.
      setTaban(await blobdanResim(blob))
    }
    setDurum({ taban: true, cizgiler: [] })
    setGecmis([])
    onKaydedildi()
  }

  return {
    ciziyor,
    basla: () => setCiziyor(true),
    kaydet,
    vazgec,
    geriAl,
    temizle,
    geriAlinabilir: gecmis.length > 0,
    temizlenebilir: (durum.taban && taban !== null) || durum.cizgiler.length > 0,
    yuzey: {
      taban: durum.taban ? taban : null,
      cizgiler: durum.cizgiler,
      ciziyor,
      arac,
      renk,
      kalinlik,
      cizgiEkle,
      setDogal,
    },
    araclar: { arac, setArac, renk, setRenk, kalinlik, setKalinlik },
  }
}

export type SoruCizimi = ReturnType<typeof useSoruCizimi>

function blobdanResim(blob: Blob): Promise<HTMLImageElement | null> {
  return new Promise((coz) => {
    const url = URL.createObjectURL(blob)
    const resim = new Image()
    // Yüklenmiş bir görsel adres bırakıldıktan sonra da tuvale çizilebiliyor.
    resim.onload = () => {
      URL.revokeObjectURL(url)
      coz(resim)
    }
    resim.onerror = () => {
      URL.revokeObjectURL(url)
      coz(null)
    }
    resim.src = url
  })
}

function cizgiAyarla(ctx: CanvasRenderingContext2D, cizgi: Cizgi, genislik: number) {
  ctx.globalCompositeOperation = cizgi.arac === 'silgi' ? 'destination-out' : 'source-over'
  ctx.strokeStyle = cizgi.renk
  ctx.fillStyle = cizgi.renk
  ctx.lineWidth = cizgi.kalinlik * genislik
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function cizgiCiz(ctx: CanvasRenderingContext2D, cizgi: Cizgi, genislik: number, yukseklik: number) {
  const [ilk, ...kalan] = cizgi.noktalar
  if (!ilk) return
  cizgiAyarla(ctx, cizgi, genislik)
  if (kalan.length === 0) {
    // Tek dokunuş nokta bırakmalı; sıfır boylu yol bazı WebView'larda hiç çizilmiyor.
    ctx.beginPath()
    ctx.arc(ilk[0] * genislik, ilk[1] * yukseklik, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  ctx.beginPath()
  ctx.moveTo(ilk[0] * genislik, ilk[1] * yukseklik)
  for (const [x, y] of kalan) ctx.lineTo(x * genislik, y * yukseklik)
  ctx.stroke()
}

function ciz(
  ctx: CanvasRenderingContext2D,
  genislik: number,
  yukseklik: number,
  taban: HTMLImageElement | null,
  cizgiler: Cizgi[],
) {
  ctx.globalCompositeOperation = 'source-over'
  ctx.clearRect(0, 0, genislik, yukseklik)
  if (taban) ctx.drawImage(taban, 0, 0, genislik, yukseklik)
  for (const c of cizgiler) cizgiCiz(ctx, c, genislik, yukseklik)
  ctx.globalCompositeOperation = 'source-over'
}

/**
 * Fotoğraf ve üstündeki çizim yüzeyi.
 *
 * Fotoğraf `object-contain` ile değil, hesaplanan kutuya mutlak konumla
 * yerleşiyor ve tuval **aynı kutuya** oturuyor. Tuval bütün alanı kaplasaydı
 * fotoğrafın altındaki ve üstündeki siyah boşluğa da çizilirdi; kutu
 * hesaplandığı için yüzeyin kendisi fotoğrafın sınırında bitiyor.
 */
export function CizimliFotograf({
  url,
  alt,
  cizim,
}: {
  url: string
  alt: string
  cizim: SoruCizimi['yuzey']
}) {
  const alan = useRef<HTMLDivElement>(null)
  const tuval = useRef<HTMLCanvasElement>(null)
  const [alanOlcu, setAlanOlcu] = useState({ genislik: 0, yukseklik: 0 })
  const [dogal, setDogalYerel] = useState({ genislik: 0, yukseklik: 0 })
  const suren = useRef<Cizgi | null>(null)
  const { setDogal } = cizim

  useLayoutEffect(() => {
    const el = alan.current
    if (!el) return
    const olc = () => setAlanOlcu({ genislik: el.clientWidth, yukseklik: el.clientHeight })
    olc()
    const gozcu = new ResizeObserver(olc)
    gozcu.observe(el)
    return () => gozcu.disconnect()
  }, [])

  const kutu: Kutu = fotografKutusu(
    alanOlcu.genislik,
    alanOlcu.yukseklik,
    dogal.genislik,
    dogal.yukseklik,
  )

  // Tuvalin iç çözünürlüğü ekran yoğunluğuna göre; yoksa çizgi tırtıklı görünür.
  const yogunluk = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  const tuvalG = Math.round(kutu.genislik * yogunluk)
  const tuvalY = Math.round(kutu.yukseklik * yogunluk)

  const yenidenCiz = useCallback(() => {
    const ctx = tuval.current?.getContext('2d')
    if (!ctx || tuvalG === 0) return
    ciz(ctx, tuvalG, tuvalY, cizim.taban, cizim.cizgiler)
  }, [tuvalG, tuvalY, cizim.taban, cizim.cizgiler])

  useEffect(yenidenCiz, [yenidenCiz])

  const nokta = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect()
    return oranla(e.clientX - r.left, e.clientY - r.top, {
      x: 0,
      y: 0,
      genislik: r.width,
      yukseklik: r.height,
    })
  }

  const basla = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // İkinci parmak yeni bir çizgi açmasın.
    if (!cizim.ciziyor || !e.isPrimary) return
    e.currentTarget.setPointerCapture(e.pointerId)
    suren.current = {
      arac: cizim.arac,
      renk: cizim.renk,
      kalinlik: cizim.arac === 'silgi' ? cizim.kalinlik * SILGI_CARPANI : cizim.kalinlik,
      noktalar: [nokta(e)],
    }
    const ctx = tuval.current?.getContext('2d')
    if (ctx) cizgiCiz(ctx, suren.current, tuvalG, tuvalY)
  }

  const surdur = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cizgi = suren.current
    if (!cizgi || !e.isPrimary) return
    const onceki = cizgi.noktalar.at(-1)!
    // Hızlı harekette tarayıcı ara noktaları birleştiriyor; onları da alınca
    // eğri köşeli çıkmıyor.
    const olaylar = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]
    const r = e.currentTarget.getBoundingClientRect()
    const yeni = olaylar.map((o) =>
      oranla(o.clientX - r.left, o.clientY - r.top, {
        x: 0,
        y: 0,
        genislik: r.width,
        yukseklik: r.height,
      }),
    )
    cizgi.noktalar.push(...yeni)
    // Sürerken yalnızca yeni parça çiziliyor; her harekette bütün çizimi
    // baştan kurmak uzun oturumda takılırdı.
    const ctx = tuval.current?.getContext('2d')
    if (ctx) cizgiCiz(ctx, { ...cizgi, noktalar: [onceki, ...yeni] }, tuvalG, tuvalY)
  }

  const bitir = () => {
    const cizgi = suren.current
    suren.current = null
    if (cizgi) cizim.cizgiEkle(cizgi)
  }

  return (
    <div ref={alan} className="absolute inset-y-0 inset-x-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        onLoad={(e) => {
          const o = { genislik: e.currentTarget.naturalWidth, yukseklik: e.currentTarget.naturalHeight }
          setDogalYerel(o)
          setDogal(o)
        }}
        className="absolute max-w-none select-none"
        style={{ left: kutu.x, top: kutu.y, width: kutu.genislik, height: kutu.yukseklik }}
        draggable={false}
      />
      <canvas
        ref={tuval}
        width={tuvalG}
        height={tuvalY}
        onPointerDown={basla}
        onPointerMove={surdur}
        onPointerUp={bitir}
        onPointerCancel={bitir}
        className={cn('absolute', cizim.ciziyor ? 'touch-none' : 'pointer-events-none')}
        style={{ left: kutu.x, top: kutu.y, width: kutu.genislik, height: kutu.yukseklik }}
      />
    </div>
  )
}

/** Kalem düğmesi — çizim kapalıyken alttaki düğmelerin üstünde duruyor. */
export function KalemDugmesi({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fotoğrafın üstüne çiz"
      className="flex h-10 items-center gap-2 rounded-full bg-white/12 px-4 text-sm font-bold text-white active:bg-white/20"
    >
      <Pencil size={17} aria-hidden />
      Çiz
    </button>
  )
}

/** Çizim açıkken alttaki düğmelerin yerine geçen araç çubuğu. */
export function CizimAraclari({ cizim }: { cizim: SoruCizimi }) {
  const { arac, setArac, renk, setRenk, kalinlik, setKalinlik } = cizim.araclar

  const aracDugmesi = (tur: CizimAraci, simge: React.ReactNode, ad: string) => (
    <button
      type="button"
      onClick={() => setArac(tur)}
      aria-pressed={arac === tur}
      aria-label={ad}
      className={cn(
        'flex size-10 items-center justify-center rounded-xl',
        arac === tur ? 'bg-white text-foreground' : 'text-white/80 active:bg-white/10',
      )}
    >
      {simge}
    </button>
  )

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-white/10 p-2">
      <div className="flex items-center gap-1">
        {aracDugmesi('kalem', <Pencil size={18} aria-hidden />, 'Kalem')}
        {aracDugmesi('silgi', <Eraser size={18} aria-hidden />, 'Silgi')}
        <span className="mx-1 h-6 w-px bg-white/15" aria-hidden />
        {KALINLIKLAR.map((k, i) => (
          <button
            key={k}
            type="button"
            onClick={() => setKalinlik(k)}
            aria-pressed={kalinlik === k}
            aria-label={['İnce', 'Orta', 'Kalın'][i]}
            className={cn(
              'flex size-10 items-center justify-center rounded-xl',
              kalinlik === k ? 'bg-white/20' : 'active:bg-white/10',
            )}
          >
            <span className="rounded-full bg-white" style={{ width: 4 + i * 4, height: 4 + i * 4 }} />
          </button>
        ))}
        <span className="flex-1" />
        <button
          type="button"
          onClick={cizim.geriAl}
          disabled={!cizim.geriAlinabilir}
          aria-label="Geri al"
          className="flex size-10 items-center justify-center rounded-xl text-white/80 active:bg-white/10 disabled:opacity-30"
        >
          <Undo2 size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={cizim.temizle}
          disabled={!cizim.temizlenebilir}
          aria-label="Çizimi temizle"
          className="flex size-10 items-center justify-center rounded-xl text-white/80 active:bg-white/10 disabled:opacity-30"
        >
          <Trash2 size={18} aria-hidden />
        </button>
      </div>
      {/* Silgide renk anlamsız; gizlenmiyor ki satır zıplamasın, sönüyor. */}
      <div className={cn('flex items-center gap-2 px-1', arac === 'silgi' && 'opacity-30')}>
        {RENKLER.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRenk(r)
              setArac('kalem')
            }}
            aria-pressed={renk === r}
            aria-label="Kalem rengi"
            // İnce beyaz kenar siyah kalemi siyah zeminde görünür tutuyor.
            className={cn(
              'size-7 rounded-full border border-white/30',
              renk === r && arac === 'kalem' && 'ring-2 ring-white ring-offset-2 ring-offset-black',
            )}
            style={{ background: r }}
          />
        ))}
      </div>
    </div>
  )
}
