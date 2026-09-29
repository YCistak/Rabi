'use client'

import { ArrowUpRight } from 'lucide-react'
import type { GununHali as Hal } from '@/lib/gunun-hali'
import type { Ekran } from '@/lib/gezinme'
import { Rabi } from '@/components/maskot/rabi'

/** Tavsiye ve hedef ekranı ayrı okunur; kartın tamamı aynı bağlantıyı açar. */
export function GununHali({ hal, onAc }: {
  hal: Hal | null
  onAc: (ekran: Ekran) => void
}) {
  if (!hal) return null
  const baglanti = hal.ekran === 'yanlis-banka'
    ? 'Yanlışlarını gözden geçir'
    : hal.ekran === 'deneme' ? 'Denemelerini aç' : 'Soru takibini aç'

  return (
    <button
      type="button"
      onClick={() => onAc(hal.ekran)}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left transition active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="flex items-center gap-3">
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-muted-foreground">Günün hâli</span>
          <span className="mt-1 block font-display text-base font-extrabold leading-snug tracking-tight">
            {hal.baslik}
          </span>
        </span>
        <span aria-hidden className="shrink-0">
          <Rabi durum={hal.durum} poz={hal.poz} boyut={64} />
        </span>
      </span>
      <span className="mt-2 block text-[13px] leading-relaxed text-muted-foreground">
        {hal.alt}
      </span>
      <span className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-xs font-bold text-primary">
        {baglanti}
        <ArrowUpRight size={16} aria-hidden className="shrink-0" />
      </span>
    </button>
  )
}
