'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Eraser, Hand, Minus, Pencil, Plus, Trash2, Undo2, ZoomIn } from 'lucide-react'
import {
  cizgiKalinligi,
  cizimAnahtari,
  fotografKutusu,
  kalinlikDegeri,
  kalinlikOrani,
  kayitOlcusu,
  oranla,
  YAKINLIK_ADIMLARI,
  YAKINLIK_YOK,
  yakinlastir,
  yakinlikKaydir,
  type Cizgi,
  type CizimAraci,
  type Kutu,
  type Yakinlik,
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

/**
 * Kalem ve silginin kalınlığı ayrı tutuluyor: silgi genişken kaleme dönen
 * kullanıcı kalın bir kalemle yazmaya başlamasın.
 */
const ILK_KALINLIK: Record<CizimAraci, number> = { kalem: 0.012, silgi: 0.036 }

/** Kalem, silgi ve yakınlaştırılmış fotoğrafı sürüklemek için el. */
export type Arac = CizimAraci | 'el'

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
  const [arac, setArac] = useState<Arac>('kalem')
  const [renk, setRenk] = useState<string>(RENKLER[0])
  const [kalinliklar, setKalinliklar] = useState(ILK_KALINLIK)
  const [yakinlik, setYakinlik] = useState<Yakinlik>(YAKINLIK_YOK)
  const [dogal, setDogal] = useState<{ genislik: number; yukseklik: number } | null>(null)
  const [gorunenGenislik, setGorunenGenislik] = useState(0)

  // Soru değişince (karışık tekrarda sıradaki) çizim de onunki olmalı.
  useEffect(() => {
    let iptal = false
    setTaban(null)
    setDurum({ taban: true, cizgiler: [] })
    setGecmis([])
    setCiziyor(false)
    setYakinlik(YAKINLIK_YOK)
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

  const yaklas = (yon: 1 | -1) => {
    const yeni = yakinlastir(yakinlik, yon)
    setYakinlik(yeni)
    // Sürüklenecek bir şey kalmadıysa el aracı da anlamsız; kaleme dönülüyor.
    if (yeni.olcek === 1 && arac === 'el') setArac('kalem')
  }

  // Çizimden çıkınca fotoğraf yeniden sığdırılıyor: görüntüleyici çizimsiz
  // hâlde yakınlaştırmayı bilmiyor, kaydırılmış bir fotoğrafta kalırdı.
  const cik = () => {
    setCiziyor(false)
    setYakinlik(YAKINLIK_YOK)
    if (arac === 'el') setArac('kalem')
  }

  const vazgec = () => {
    setDurum({ taban: true, cizgiler: [] })
    setGecmis([])
    cik()
  }

  const kaydet = async () => {
    cik()
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

  const kalinlik = arac === 'el' ? kalinliklar.kalem : kalinliklar[arac]
  const setKalinlik = (k: number) =>
    setKalinliklar((o) => ({ ...o, [arac === 'el' ? 'kalem' : arac]: k }))

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
      yakinlik,
      setYakinlik,
      cizgiEkle,
      setDogal,
      setGorunenGenislik,
    },
    araclar: {
      arac,
      setArac,
      renk,
      setRenk,
      kalinlik,
      setKalinlik,
      yakinlik,
      yaklas,
      gorunenGenislik,
    },
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

/** Yakınlaştırılmış tuvalin bir kenarı bundan uzun olmasın; bellek telefonda dar. */
const TUVAL_SINIRI = 4096

/**
 * Fotoğraf ve üstündeki çizim yüzeyi.
 *
 * Fotoğraf `object-contain` ile değil, hesaplanan kutuya mutlak konumla
 * yerleşiyor ve tuval **aynı kutuya** oturuyor. Tuval bütün alanı kaplasaydı
 * fotoğrafın altındaki ve üstündeki siyah boşluğa da çizilirdi; kutu
 * hesaplandığı için yüzeyin kendisi fotoğrafın sınırında bitiyor.
 *
 * Yakınlaştırma kutuyu büyütmüyor: kutu `overflow: hidden`, içindeki fotoğraf
 * ve tuval birlikte ölçekleniyor. Siyah boşluk yakınlaştırmada da çizilemiyor
 * — kırpılan parça dokunuşu da almıyor.
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
  const surukleme = useRef<{ x: number; y: number } | null>(null)
  const kirpma = useRef<HTMLDivElement>(null)
  const imlec = useRef<HTMLSpanElement>(null)
  const { setDogal, setGorunenGenislik, yakinlik } = cizim

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

  // Kalınlık önizlemesi ekrandaki boyu gösterebilsin diye.
  useEffect(() => setGorunenGenislik(kutu.genislik), [kutu.genislik, setGorunenGenislik])

  // Tuvalin iç çözünürlüğü ekran yoğunluğuna ve yakınlığa göre; yoksa çizgi
  // yakınlaştırınca tırtıklı görünür.
  const yogunluk = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  const carpan = Math.min(
    yogunluk * yakinlik.olcek,
    TUVAL_SINIRI / Math.max(1, kutu.genislik, kutu.yukseklik),
  )
  const tuvalG = Math.round(kutu.genislik * carpan)
  const tuvalY = Math.round(kutu.yukseklik * carpan)

  const yenidenCiz = useCallback(() => {
    const ctx = tuval.current?.getContext('2d')
    if (!ctx || tuvalG === 0) return
    ciz(ctx, tuvalG, tuvalY, cizim.taban, cizim.cizgiler)
  }, [tuvalG, tuvalY, cizim.taban, cizim.cizgiler])

  useEffect(yenidenCiz, [yenidenCiz])

  // Tuvalin ekrandaki (ölçeklenmiş) kutusu orana çevirmeye yetiyor: dönüşüm
  // hesaba kendiliğinden giriyor.
  const oranlar = (el: HTMLCanvasElement, olaylar: { clientX: number; clientY: number }[]) => {
    const r = el.getBoundingClientRect()
    const k = { x: 0, y: 0, genislik: r.width, yukseklik: r.height }
    return olaylar.map((o) => oranla(o.clientX - r.left, o.clientY - r.top, k))
  }

  const basla = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // İkinci parmak yeni bir çizgi açmasın.
    if (!cizim.ciziyor || !e.isPrimary || cizim.arac === 'el') return
    e.currentTarget.setPointerCapture(e.pointerId)
    suren.current = {
      arac: cizim.arac,
      renk: cizim.renk,
      kalinlik: cizgiKalinligi(cizim.kalinlik, yakinlik.olcek),
      noktalar: oranlar(e.currentTarget, [e]),
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
    const yeni = oranlar(e.currentTarget, e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent])
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

  const elAcik = cizim.ciziyor && cizim.arac === 'el'
  const silgiAcik = cizim.ciziyor && cizim.arac === 'silgi'

  /**
   * Silginin sileceği alan, Paint'teki gibi beyaz bir halka. Silgi saydam
   * iz bıraktığı için basmadan önce ne kadar yer kaplayacağı görünmüyordu;
   * kalın silgi yazının yarısını götürüyordu. Halkanın çapı ekrandaki
   * kalınlık — yakınlaştırılmışken de silginin gerçekte kapladığı yer.
   *
   * Konum state'e değil doğrudan öğeye yazılıyor: her parmak hareketinde
   * bileşeni yeniden çizmek, tam da çizerken takılmak demekti.
   */
  const imleciGoster = (e: React.PointerEvent) => {
    const el = imlec.current
    const kutuEl = kirpma.current
    if (!el || !kutuEl || !silgiAcik || !e.isPrimary) return
    const r = kutuEl.getBoundingClientRect()
    const cap = Math.max(6, cizim.kalinlik * kutu.genislik)
    el.style.width = `${cap}px`
    el.style.height = `${cap}px`
    el.style.transform = `translate(${e.clientX - r.left - cap / 2}px, ${e.clientY - r.top - cap / 2}px)`
    el.style.opacity = '1'
  }
  const imleciGizle = () => {
    if (imlec.current) imlec.current.style.opacity = '0'
  }

  // Silgiden çıkınca halka son yerinde asılı kalmasın.
  useEffect(() => {
    if (!silgiAcik) imleciGizle()
  }, [silgiAcik])

  return (
    <div ref={alan} className="absolute inset-y-0 inset-x-3">
      <div
        ref={kirpma}
        className={cn('absolute overflow-hidden', elAcik && 'touch-none cursor-grab')}
        style={{ left: kutu.x, top: kutu.y, width: kutu.genislik, height: kutu.yukseklik }}
        onPointerDown={(e) => {
          if (!elAcik || !e.isPrimary) return
          e.currentTarget.setPointerCapture(e.pointerId)
          surukleme.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerMove={(e) => {
          const onceki = surukleme.current
          if (!onceki || !e.isPrimary || kutu.genislik === 0) return
          surukleme.current = { x: e.clientX, y: e.clientY }
          cizim.setYakinlik((y) =>
            yakinlikKaydir(
              y,
              (e.clientX - onceki.x) / kutu.genislik,
              (e.clientY - onceki.y) / kutu.yukseklik,
            ),
          )
        }}
        onPointerUp={() => (surukleme.current = null)}
        onPointerCancel={() => (surukleme.current = null)}
      >
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${yakinlik.x * kutu.genislik}px, ${yakinlik.y * kutu.yukseklik}px) scale(${yakinlik.olcek})`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            onLoad={(e) => {
              const o = {
                genislik: e.currentTarget.naturalWidth,
                yukseklik: e.currentTarget.naturalHeight,
              }
              setDogalYerel(o)
              setDogal(o)
            }}
            className="absolute inset-0 h-full w-full max-w-none select-none"
            draggable={false}
          />
          <canvas
            ref={tuval}
            width={tuvalG}
            height={tuvalY}
            onPointerDown={(e) => {
              basla(e)
              imleciGoster(e)
            }}
            onPointerMove={(e) => {
              surdur(e)
              imleciGoster(e)
            }}
            onPointerUp={(e) => {
              bitir()
              // Farede halka imlecin kendisi, kalıyor; dokunmatikte parmak
              // kalkınca gösterecek bir yer yok.
              if (e.pointerType !== 'mouse') imleciGizle()
            }}
            onPointerCancel={() => {
              bitir()
              imleciGizle()
            }}
            onPointerLeave={imleciGizle}
            className={cn(
              'absolute inset-0 h-full w-full',
              cizim.ciziyor && !elAcik ? 'touch-none' : 'pointer-events-none',
              silgiAcik && 'cursor-none',
            )}
          />
        </div>
        {/* Halka ölçeklenen katmanın dışında: yakınlaştırmada kalınlaşmasın.
            Beyaz halkanın çevresindeki ince koyu gölge onu beyaz kâğıtta da
            görünür tutuyor. */}
        <span
          ref={imlec}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 rounded-full border-[1.5px] border-white opacity-0 shadow-[0_0_0_1px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(0,0,0,0.35)]"
        />
      </div>
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

type Acilir = 'kalinlik' | 'yakinlik' | null

/** Çizim açıkken alttaki düğmelerin yerine geçen araç çubuğu. */
export function CizimAraclari({ cizim }: { cizim: SoruCizimi }) {
  const { arac, setArac, renk, setRenk, kalinlik, setKalinlik, yakinlik, yaklas, gorunenGenislik } =
    cizim.araclar
  const [acik, setAcik] = useState<Acilir>(null)
  const yakin = yakinlik.olcek > 1

  const aracDugmesi = (tur: Arac, simge: React.ReactNode, ad: string, pasif = false) => (
    <button
      type="button"
      onClick={() => setArac(tur)}
      disabled={pasif}
      aria-pressed={arac === tur}
      aria-label={ad}
      className={cn(
        'flex size-10 items-center justify-center rounded-xl disabled:opacity-30',
        arac === tur ? 'bg-white text-foreground' : 'text-white/80 active:bg-white/10',
      )}
    >
      {simge}
    </button>
  )

  // Önizleme noktası ekrandaki gerçek kalınlıkta; çok küçük ya da çok büyükse
  // düğmeye sığacak kadar kırpılıyor.
  const nokta = (sinir: number) =>
    Math.min(sinir, Math.max(3, kalinlik * (gorunenGenislik || 300)))

  return (
    <div className="relative flex w-full flex-col gap-2 rounded-2xl bg-white/10 p-2">
      {/* Açılır parçanın dışına dokunmak onu kapatıyor. */}
      {acik && (
        <div className="fixed inset-0 z-10" aria-hidden onPointerDown={() => setAcik(null)} />
      )}
      <div className="flex items-center gap-1">
        {aracDugmesi('kalem', <Pencil size={18} aria-hidden />, 'Kalem')}
        {aracDugmesi('silgi', <Eraser size={18} aria-hidden />, 'Silgi')}
        {/* Sürükleme yalnızca yakınlaştırılmışken anlamlı; tek parmak çizdiği
            için fotoğrafı gezdirmenin ayrı bir aracı olmalı. */}
        {aracDugmesi('el', <Hand size={18} aria-hidden />, 'Fotoğrafı kaydır', !yakin)}
        <span className="mx-1 h-6 w-px bg-white/15" aria-hidden />

        <div className="relative">
          <button
            type="button"
            onClick={() => setAcik(acik === 'kalinlik' ? null : 'kalinlik')}
            aria-expanded={acik === 'kalinlik'}
            aria-label={arac === 'silgi' ? 'Silgi büyüklüğü' : 'Kalem kalınlığı'}
            className={cn(
              'relative z-20 flex size-10 items-center justify-center rounded-xl',
              acik === 'kalinlik' ? 'bg-white/20' : 'active:bg-white/10',
            )}
          >
            <span
              className="rounded-full bg-white"
              style={{ width: nokta(22), height: nokta(22) }}
            />
          </button>
          {acik === 'kalinlik' && (
            <KalinlikCubugu
              deger={kalinlik}
              onDegis={setKalinlik}
              onizleme={nokta(44)}
              renk={arac === 'silgi' ? '#fff' : renk}
            />
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAcik(acik === 'yakinlik' ? null : 'yakinlik')}
            aria-expanded={acik === 'yakinlik'}
            aria-label="Yakınlaştır"
            className={cn(
              'relative z-20 flex size-10 items-center justify-center rounded-xl text-white/80',
              acik === 'yakinlik' || yakin ? 'bg-white/20 text-white' : 'active:bg-white/10',
            )}
          >
            <ZoomIn size={18} aria-hidden />
          </button>
          {acik === 'yakinlik' && (
            <div className="acilir-giris absolute bottom-full left-1/2 z-20 mb-2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl bg-foreground ring-1 ring-white/15 p-1.5 shadow-lg">
              <button
                type="button"
                onClick={() => yaklas(1)}
                disabled={yakinlik.olcek >= YAKINLIK_ADIMLARI.at(-1)!}
                aria-label="Yakınlaştır"
                className="flex size-10 items-center justify-center rounded-xl text-white active:bg-white/10 disabled:opacity-30"
              >
                <Plus size={20} aria-hidden />
              </button>
              <span className="rakam text-xs font-bold text-white/70">
                {Math.round(yakinlik.olcek * 100)}%
              </span>
              <button
                type="button"
                onClick={() => yaklas(-1)}
                disabled={!yakin}
                aria-label="Uzaklaştır"
                className="flex size-10 items-center justify-center rounded-xl text-white active:bg-white/10 disabled:opacity-30"
              >
                <Minus size={20} aria-hidden />
              </button>
            </div>
          )}
        </div>

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

/**
 * Düğmenin üstünde yukarı uzanan kalınlık çubuğu. `<input type="range">`
 * değil: dikey sürgü WebView sürümüne göre ya hiç dikey durmuyor ya ters
 * çalışıyordu. Yukarı çekmek kalınlaştırıyor.
 */
function KalinlikCubugu({
  deger,
  onDegis,
  onizleme,
  renk,
}: {
  deger: number
  onDegis: (k: number) => void
  onizleme: number
  renk: string
}) {
  const ray = useRef<HTMLDivElement>(null)
  const oran = kalinlikOrani(deger)

  const ayarla = (clientY: number) => {
    const r = ray.current?.getBoundingClientRect()
    if (!r) return
    onDegis(kalinlikDegeri(1 - (clientY - r.top) / r.height))
  }

  return (
    <div className="acilir-giris absolute bottom-full left-1/2 z-20 mb-2 flex w-14 -translate-x-1/2 flex-col items-center gap-3 rounded-2xl bg-foreground ring-1 ring-white/15 px-2 pt-3 pb-4 shadow-lg">
      <span className="flex size-11 items-center justify-center" aria-hidden>
        <span
          className="rounded-full border border-white/30"
          style={{ width: onizleme, height: onizleme, background: renk }}
        />
      </span>
      <div
        ref={ray}
        role="slider"
        aria-label="Kalınlık"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(oran * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') onDegis(kalinlikDegeri(oran + 0.05))
          if (e.key === 'ArrowDown') onDegis(kalinlikDegeri(oran - 0.05))
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          ayarla(e.clientY)
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) ayarla(e.clientY)
        }}
        className="relative flex h-40 w-10 touch-none justify-center"
      >
        <span className="absolute inset-y-0 w-1.5 rounded-full bg-white/20" />
        <span
          className="absolute bottom-0 w-1.5 rounded-full bg-white"
          style={{ height: `${oran * 100}%` }}
        />
        <span
          className="absolute size-5 -translate-y-1/2 rounded-full bg-white shadow"
          style={{ top: `${(1 - oran) * 100}%` }}
        />
      </div>
    </div>
  )
}
