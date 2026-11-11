'use client'

import { useEffect, useRef, useState } from 'react'
import { geriKaydirmayiKilitle } from '@/lib/geri-kaydirma'
import { pinchYakinligi, tikMi, YAKINLIK_YOK, yakinlikKaydir, type Cizgi, type Yakinlik } from '@/lib/cizim'
import { AracCubugu, type KaralamaAraci } from './arac-cubugu'

type Isaretci = { x: number; y: number; bas: { x: number; y: number; zaman: number }; tur: string }

/** Soru içeriği ve çizgileri aynı CSS dönüşümünü paylaşan oturumluk yüzey. */
export function KaralamaKatmani({
  soruAnahtari,
  cizgiler: disCizgiler,
  onCizgiler,
  children,
}: {
  soruAnahtari: string
  cizgiler?: Cizgi[]
  onCizgiler?: (cizgiler: Cizgi[]) => void
  children: React.ReactNode
}) {
  const yuzey = useRef<HTMLDivElement>(null)
  const tuval = useRef<HTMLCanvasElement>(null)
  const parmaklar = useRef(new Map<number, Isaretci>())
  const cizilen = useRef<Cizgi | null>(null)
  const sonDokunus = useRef(0)
  const kalemGoruldu = useRef(false)
  const [yerelCizgiler, setYerelCizgiler] = useState<Cizgi[]>([])
  const [arac, setArac] = useState<KaralamaAraci>('kalem')
  const [renk, setRenk] = useState('#e5484d')
  const [kalinlik, setKalinlik] = useState(0.012)
  const [yakinlik, setYakinlik] = useState<Yakinlik>(YAKINLIK_YOK)
  const [katli, setKatli] = useState(false)

  const cizgiler = disCizgiler ?? yerelCizgiler
  const cizgileriYaz = onCizgiler ?? setYerelCizgiler

  useEffect(() => {
    if (onCizgiler) return
    setYerelCizgiler([])
    setYakinlik(YAKINLIK_YOK)
    parmaklar.current.clear()
    cizilen.current = null
  }, [soruAnahtari, onCizgiler])

  useEffect(() => {
    const alan = yuzey.current
    const canvas = tuval.current
    if (!alan || !canvas) return
    const kutu = alan.getBoundingClientRect()
    const oran = window.devicePixelRatio || 1
    // Yakınlığı hem içerik hem tuval aynı CSS dönüşümüyle alıyor. Çözünürlüğe
    // ölçeği bir daha katmak çizgiyi içerikten iki kez büyütürdü.
    canvas.width = Math.ceil(kutu.width * oran)
    canvas.height = Math.ceil(kutu.height * oran)
    canvas.style.width = `${kutu.width}px`
    canvas.style.height = `${kutu.height}px`
    const baglam = canvas.getContext('2d')
    if (!baglam) return
    baglam.scale(oran, oran)
    baglam.clearRect(0, 0, kutu.width, kutu.height)
    for (const cizgi of cizgiler) {
      if (cizgi.noktalar.length < 2) continue
      baglam.save()
      baglam.globalCompositeOperation = cizgi.arac === 'silgi' ? 'destination-out' : 'source-over'
      baglam.strokeStyle = cizgi.renk
      baglam.lineWidth = cizgi.kalinlik * kutu.width
      baglam.lineCap = 'round'
      baglam.lineJoin = 'round'
      baglam.beginPath()
      cizgi.noktalar.forEach(([x, y], sira) => sira === 0 ? baglam.moveTo(x * kutu.width, y * kutu.height) : baglam.lineTo(x * kutu.width, y * kutu.height))
      baglam.stroke()
      baglam.restore()
    }
  }, [cizgiler, yakinlik])

  const koordinat = (olay: React.PointerEvent<HTMLCanvasElement>) => {
    const kutu = yuzey.current!.getBoundingClientRect()
    return { x: (olay.clientX - kutu.left) / kutu.width, y: (olay.clientY - kutu.top) / kutu.height }
  }
  const icerikNoktasi = (n: { x: number; y: number }) => [(n.x - yakinlik.x) / yakinlik.olcek, (n.y - yakinlik.y) / yakinlik.olcek] as [number, number]
  const cizimiBitir = (kaydet: boolean) => {
    const cizgi = cizilen.current
    cizilen.current = null
    if (kaydet && cizgi && cizgi.noktalar.length > 1) cizgileriYaz([...cizgiler, cizgi])
  }
  const alttakiniTikla = (olay: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = tuval.current
    if (!canvas) return
    canvas.style.pointerEvents = 'none'
    const hedef = document.elementFromPoint(olay.clientX, olay.clientY) as HTMLElement | null
    canvas.style.pointerEvents = ''
    hedef?.closest<HTMLElement>('button, a, input, label')?.click()
  }
  const ikiParmak = () => {
    const degerler = [...parmaklar.current.values()]
    if (degerler.length !== 2) return
    const onceki = degerler.map((deger) => [deger.bas.x, deger.bas.y] as [number, number])
    const simdi = degerler.map((deger) => [deger.x, deger.y] as [number, number])
    setYakinlik((oncekiYakinlik) => pinchYakinligi(oncekiYakinlik, { ilk: onceki[0], ikinci: onceki[1] }, { ilk: simdi[0], ikinci: simdi[1] }))
    degerler.forEach((deger) => { deger.bas = { ...deger.bas, x: deger.x, y: deger.y } })
  }
  return <>
    <div ref={yuzey} className="relative overflow-hidden rounded-2xl bg-card" style={{ touchAction: 'none' }}>
      <div className="origin-top-left" style={{ transform: `translate(${yakinlik.x * 100}%, ${yakinlik.y * 100}%) scale(${yakinlik.olcek})` }}>{children}</div>
      <canvas ref={tuval} className="absolute top-0 left-0 touch-none" style={{ transformOrigin: 'top left', transform: `translate(${yakinlik.x * 100}%, ${yakinlik.y * 100}%) scale(${yakinlik.olcek})`, touchAction: 'none' }} onPointerDown={(olay) => {
        const n = koordinat(olay)
        if (olay.pointerType === 'pen') kalemGoruldu.current = true
        parmaklar.current.set(olay.pointerId, { ...n, bas: { ...n, zaman: Date.now() }, tur: olay.pointerType })
        olay.currentTarget.setPointerCapture(olay.pointerId)
        if (parmaklar.current.size === 2) { cizimiBitir(false); return }
        const cizer = olay.pointerType === 'pen' || (!kalemGoruldu.current && arac !== 'el')
        if (cizer) {
          const [x, y] = icerikNoktasi(n)
          cizilen.current = { arac: arac === 'silgi' ? 'silgi' : 'kalem', renk, kalinlik: kalinlik / yakinlik.olcek, noktalar: [[x, y]] }
        }
      }} onPointerMove={(olay) => {
        const n = koordinat(olay)
        const onceki = parmaklar.current.get(olay.pointerId)
        if (!onceki) return
        parmaklar.current.set(olay.pointerId, { ...onceki, ...n })
        if (parmaklar.current.size >= 2) { cizimiBitir(false); ikiParmak(); return }
        const parmakKaydirir = kalemGoruldu.current && olay.pointerType !== 'pen'
        if (arac === 'el' || parmakKaydirir) {
          const kutu = yuzey.current!.getBoundingClientRect()
          if (yakinlik.olcek > 1) setYakinlik((deger) => yakinlikKaydir(deger, (n.x - onceki.x), (n.y - onceki.y)))
          else window.scrollBy({ top: -(n.y - onceki.y) * kutu.height, behavior: 'instant' })
          return
        }
        if (cizilen.current) {
          const [x, y] = icerikNoktasi(n)
          cizilen.current.noktalar.push([x, y])
          if (cizilen.current.noktalar.length === 2) void geriKaydirmayiKilitle()
          cizgileriYaz([...cizgiler])
        }
      }} onPointerUp={(olay) => {
        const deger = parmaklar.current.get(olay.pointerId)
        parmaklar.current.delete(olay.pointerId)
        cizimiBitir(true)
        if (deger && tikMi(deger.bas, { ...koordinat(olay), zaman: Date.now() })) {
          const simdi = Date.now()
          if (simdi - sonDokunus.current < 300) setYakinlik(YAKINLIK_YOK)
          else alttakiniTikla(olay)
          sonDokunus.current = simdi
        }
      }} onPointerCancel={() => { parmaklar.current.clear(); cizimiBitir(false) }} />
    </div>
    <AracCubugu arac={arac} renk={renk} kalinlik={kalinlik} yakinlik={yakinlik.olcek} katli={katli} onArac={setArac} onRenk={setRenk} onKalinlik={setKalinlik} onGeri={() => cizgileriYaz(cizgiler.slice(0, -1))} onTemizle={() => cizgileriYaz([])} onSifirla={() => setYakinlik(YAKINLIK_YOK)} onKatla={() => setKatli((onceki) => !onceki)} />
  </>
}
