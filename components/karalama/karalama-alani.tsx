'use client'

import { useEffect, useRef, useState } from 'react'
import { Eraser, Hand, PenLine, RotateCcw, Trash2, Undo2, ZoomIn } from 'lucide-react'
import {
  cizgiKalinligi, kalinlikDegeri, kalinlikOrani, pinchYakinligi, YAKINLIK_YOK,
  yakinlikAyarla, yakinlikDegeri, yakinlikKaydir, yakinlikOrani,
  type Cizgi, type Yakinlik,
} from '@/lib/cizim'
import { geriKaydirmayiKilitle } from '@/lib/geri-kaydirma'

const RENKLER = ['#e5484d', '#2f6fde', '#2f9e5b', '#1b1a19'] as const
type Arac = 'kalem' | 'silgi' | 'el'

/** Soru Bankası için depoya yazılmayan, oturumluk vektör karalama yüzeyi. */
export function KaralamaAlani() {
  const yuzey = useRef<SVGSVGElement>(null)
  const parmaklar = useRef(new Map<number, { x: number; y: number }>())
  const oncekiParmaklar = useRef(new Map<number, { x: number; y: number }>())
  const cizgi = useRef<Cizgi | null>(null)
  const [arac, setArac] = useState<Arac>('kalem')
  const [renk, setRenk] = useState<string>(RENKLER[0])
  const [kalinlik, setKalinlik] = useState(0.012)
  const [cizgiler, setCizgiler] = useState<Cizgi[]>([])
  const [yakinlik, setYakinlik] = useState<Yakinlik>(YAKINLIK_YOK)
  const [acik, setAcik] = useState<'kalinlik' | 'yakinlik' | null>(null)

  useEffect(() => {
    if (cizgi.current) return geriKaydirmayiKilitle()
  })

  const nokta = (olay: React.PointerEvent<SVGSVGElement>) => {
    const kutu = olay.currentTarget.getBoundingClientRect()
    return { x: (olay.clientX - kutu.left) / kutu.width, y: (olay.clientY - kutu.top) / kutu.height }
  }
  const ikiParmak = () => {
    const onceki = [...oncekiParmaklar.current.values()]
    const sonraki = [...parmaklar.current.values()]
    if (onceki.length !== 2 || sonraki.length !== 2) return
    setYakinlik((y) => pinchYakinligi(y, { ilk: [onceki[0].x, onceki[0].y], ikinci: [onceki[1].x, onceki[1].y] }, { ilk: [sonraki[0].x, sonraki[0].y], ikinci: [sonraki[1].x, sonraki[1].y] }))
  }
  const bitir = () => {
    const tamam = cizgi.current
    cizgi.current = null
    if (tamam) setCizgiler((onceki) => [...onceki, tamam])
  }
  const dugme = (etiket: string, secili: boolean, islev: () => void, simge: React.ReactNode) => <button type="button" aria-label={etiket} aria-pressed={secili} onClick={islev} className={`grid size-11 place-items-center rounded-xl ${secili ? 'bg-card text-foreground shadow-sm' : 'text-white/90 active:bg-white/10'}`}>{simge}</button>

  return <section className="mt-5">
    <div className="rounded-2xl bg-foreground p-2 text-white">
      <div className="flex items-center gap-1">
        {dugme('Kalem', arac === 'kalem', () => setArac('kalem'), <PenLine size={19} />)}
        {dugme('Silgi', arac === 'silgi', () => setArac('silgi'), <Eraser size={19} />)}
        {dugme('Kaydır', arac === 'el', () => setArac('el'), <Hand size={19} />)}
        <div className="relative">
          {dugme('Kalınlık', acik === 'kalinlik', () => setAcik(acik === 'kalinlik' ? null : 'kalinlik'), <span className="rounded-full bg-white" style={{ width: Math.max(4, kalinlik * 240), height: Math.max(4, kalinlik * 240) }} />)}
          {acik === 'kalinlik' && <Cubuk oran={kalinlikOrani(kalinlik)} onOran={(oran) => setKalinlik(kalinlikDegeri(oran))} />}
        </div>
        <div className="relative">
          {dugme('Yakınlaştır', yakinlik.olcek > 1 || acik === 'yakinlik', () => setAcik(acik === 'yakinlik' ? null : 'yakinlik'), <ZoomIn size={19} />)}
          {acik === 'yakinlik' && <Cubuk oran={yakinlikOrani(yakinlik.olcek)} onOran={(oran) => setYakinlik((y) => yakinlikAyarla(y, yakinlikDegeri(oran)))} />}
        </div>
        <span className="flex-1" />
        {dugme('Geri al', false, () => setCizgiler((onceki) => onceki.slice(0, -1)), <Undo2 size={19} />)}
        {dugme('Temizle', false, () => setCizgiler([]), <Trash2 size={19} />)}
      </div>
      <div className="mt-1 flex gap-2 px-1">{RENKLER.map((r) => <button key={r} type="button" aria-label="Mürekkep rengi" onClick={() => { setRenk(r); setArac('kalem') }} className={`size-7 rounded-full border border-white/40 ${renk === r ? 'ring-2 ring-white ring-offset-2 ring-offset-foreground' : ''}`} style={{ background: r }} />)}<span className="ml-auto self-center text-xs text-white/70">%{Math.round(yakinlik.olcek * 100)} · Çift dokun: sıfırla</span></div>
    </div>
    <svg ref={yuzey} viewBox="0 0 1 1" preserveAspectRatio="none" className="mt-2 h-[max(100vh,32rem)] w-full touch-none rounded-2xl border border-dashed border-border bg-muted/20" style={{ touchAction: 'none' }} onDoubleClick={() => setYakinlik(YAKINLIK_YOK)} onPointerDown={(olay) => {
      const yeni = nokta(olay); parmaklar.current.set(olay.pointerId, yeni); oncekiParmaklar.current = new Map(parmaklar.current)
      olay.currentTarget.setPointerCapture(olay.pointerId)
      if (olay.pointerType === 'pen' || (arac !== 'el' && parmaklar.current.size === 1)) cizgi.current = { arac: arac === 'silgi' ? 'silgi' : 'kalem', renk, kalinlik: cizgiKalinligi(kalinlik, yakinlik.olcek), noktalar: [[yeni.x, yeni.y]] }
    }} onPointerMove={(olay) => {
      const yeni = nokta(olay); const onceki = parmaklar.current.get(olay.pointerId); parmaklar.current.set(olay.pointerId, yeni)
      if (parmaklar.current.size >= 2) { bitir(); ikiParmak(); oncekiParmaklar.current = new Map(parmaklar.current); return }
      if (arac === 'el' && onceki) { setYakinlik((y) => yakinlikKaydir(y, yeni.x - onceki.x, yeni.y - onceki.y)); return }
      if (cizgi.current) cizgi.current.noktalar.push([yeni.x, yeni.y])
    }} onPointerUp={(olay) => { parmaklar.current.delete(olay.pointerId); oncekiParmaklar.current = new Map(parmaklar.current); bitir() }} onPointerCancel={(olay) => { parmaklar.current.delete(olay.pointerId); bitir() }}>
      <g transform={`translate(${yakinlik.x} ${yakinlik.y}) scale(${yakinlik.olcek})`}>{cizgiler.map((iz, i) => <polyline key={i} points={iz.noktalar.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={iz.arac === 'silgi' ? 'var(--card)' : iz.renk} strokeWidth={iz.kalinlik} strokeLinecap="round" strokeLinejoin="round" />)}</g>
    </svg>
    <p className="mt-2 text-xs text-muted-foreground">Çizimler yalnız bu test açıkken tutulur; çıkınca silinir.</p>
  </section>
}

function Cubuk({ oran, onOran }: { oran: number; onOran: (oran: number) => void }) {
  const ayarla = (olay: React.PointerEvent<HTMLDivElement>) => { const kutu = olay.currentTarget.getBoundingClientRect(); onOran(Math.min(1, Math.max(0, 1 - (olay.clientY - kutu.top) / kutu.height))) }
  return <div onPointerDown={ayarla} onPointerMove={(olay) => { if (olay.currentTarget.hasPointerCapture(olay.pointerId)) ayarla(olay) }} className="absolute bottom-full left-1/2 z-20 mb-2 h-36 w-11 -translate-x-1/2 touch-none rounded-2xl bg-foreground p-3 shadow-lg"><span className="absolute inset-y-3 left-1/2 w-1 -translate-x-1/2 rounded bg-white/25"/><span className="absolute bottom-3 left-1/2 w-1 -translate-x-1/2 rounded bg-white" style={{ height: `${oran * 120}px` }}/></div>
}
