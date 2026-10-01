'use client'

import { useState } from 'react'
import { Kart } from '@/components/ui'
import { netYaz, tarihYaz } from '@/lib/hesap'
import type { DenemeSatiri } from '@/lib/deneme-liste'

/** Şablonları karıştırmadan gerçek netlerden çizilir; boş durumda veri üretilmez. */
export function NetGelisimi({ satirlar }: { satirlar: DenemeSatiri[] }) {
  const [secilenSablon, setSecilenSablon] = useState('')
  const gruplar = new Map<string, DenemeSatiri[]>()
  for (const satir of satirlar) {
    if (!satir.sablon || !satir.ozet) continue
    const grup = gruplar.get(satir.sablon.id) ?? []
    grup.push(satir)
    gruplar.set(satir.sablon.id, grup)
  }
  const aktifSablon = gruplar.has(secilenSablon) ? secilenSablon : gruplar.keys().next().value
  return <Kart data-tanitim="deneme-grafik" className="mb-4">
    <h2 className="font-display font-extrabold">Net gelişimin</h2>
    {gruplar.size > 1 && <label className="mt-3 block text-xs font-bold">Deneme şablonu
      <select className="mt-1 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm" value={aktifSablon} onChange={(olay) => setSecilenSablon(olay.target.value)}>
        {Array.from(gruplar, ([kimlik, grup]) => <option key={kimlik} value={kimlik}>{grup[0].sablon!.ad}</option>)}
      </select>
    </label>}
    {!gruplar.size ? <p className="mt-2 text-sm text-muted-foreground">İlk denemeni eklediğinde net grafiğin burada oluşacak.</p> :
      <div className="mt-3 space-y-4">{Array.from(gruplar).filter(([kimlik]) => kimlik === aktifSablon).map(([kimlik, grup]) => {
        const sonKayitlar = grup.slice(-10)
        const netler = sonKayitlar.map((satir) => satir.ozet!.toplamNet)
        const alt = Math.min(0, ...netler)
        const ust = Math.max(1, ...netler)
        const noktalar = netler.map((net, sira) => ({ x: netler.length === 1 ? 150 : 16 + sira * 268 / (netler.length - 1), y: 80 - (net - alt) * 64 / (ust - alt) }))
        return <div key={kimlik}>
          <p className="text-xs font-bold">{grup[0].sablon!.ad} · Son {netler.length} deneme</p>
          <svg viewBox="0 0 300 96" className="mt-2 w-full text-primary" role="img" aria-label={`${grup[0].sablon!.ad} net gelişimi: ${netler.map(netYaz).join(', ')}`}>
            <path d="M16 80 H284" fill="none" stroke="var(--border)" />
            <polyline points={noktalar.map((nokta) => `${nokta.x},${nokta.y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="2" />
            {noktalar.map((nokta, sira) => <circle key={sonKayitlar[sira].deneme.id} cx={nokta.x} cy={nokta.y} r="4" fill="currentColor"><title>{tarihYaz(sonKayitlar[sira].deneme.tarih)}: {netYaz(netler[sira])} net</title></circle>)}
          </svg>
          <div className="flex justify-between text-xs text-muted-foreground"><span>{tarihYaz(sonKayitlar[0].deneme.tarih)}</span><span>{netYaz(netler.at(-1)!)} net</span></div>
        </div>
      })}</div>}
  </Kart>
}
