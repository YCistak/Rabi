'use client'

import { Check, ChevronLeft, ChevronRight, Minus, Plus, SkipForward } from 'lucide-react'
import { useEffect, useState } from 'react'

/** Karalama yüzeyinin yakınlığı: değişince yalnız bu küçük gösterge yeniden çizilir. */
export type YakinlikKolu = {
  /** Gösterge kendini kaydeder; dönen işlev kaydı siler. */
  dinle: (dinleyici: (olcek: number) => void) => () => void
  al: () => number
  degistir: (fark: number) => void
  sifirla: () => void
}

function YakinlikDugmeleri({ kol }: { kol: YakinlikKolu }) {
  const [olcek, setOlcek] = useState(1)
  useEffect(() => {
    setOlcek(kol.al())
    return kol.dinle(setOlcek)
  }, [kol])
  const dugme = 'grid h-12 place-items-center text-foreground transition active:bg-card/70 disabled:opacity-30'
  return (
    <div role="group" aria-label="Yakınlık" className="flex shrink-0 overflow-hidden rounded-xl bg-muted">
      <button type="button" aria-label="Küçült" disabled={olcek <= 1} onClick={() => kol.degistir(-0.5)} className={`${dugme} w-10`}>
        <Minus size={18} />
      </button>
      <button
        type="button"
        aria-label={olcek === 1 ? 'Yakınlık yüzde 100' : `Yakınlık yüzde ${Math.round(olcek * 100)}. Sıfırla`}
        disabled={olcek === 1}
        onClick={kol.sifirla}
        className={`${dugme} rakam w-12 text-[13px] font-extrabold disabled:opacity-60`}
      >
        %{Math.round(olcek * 100)}
      </button>
      <button type="button" aria-label="Büyüt" disabled={olcek >= 4} onClick={() => kol.degistir(0.5)} className={`${dugme} w-10`}>
        <Plus size={18} />
      </button>
    </div>
  )
}

/**
 * Soru görünümünün alt çubuğu: ‹ önceki · − %100 + · sağda tek ana düğme.
 * Ana düğme duruma göre değişir: cevapsız soruda "Pas geç" (işaretleyip
 * sonrakine), cevaplıda "Sonraki", son soruda "Bitir" (bitmiş testte
 * "Sonuç"). Kendiliğinden geçiş yok.
 */
export function GezinmeCubugu({
  oncekiVar,
  sonrakiVar,
  cevapli,
  bitti,
  yakinlik,
  onOnceki,
  onSonraki,
  onPas,
  onBitir,
}: {
  oncekiVar: boolean
  sonrakiVar: boolean
  cevapli: boolean
  bitti: boolean
  yakinlik: YakinlikKolu
  onOnceki: () => void
  onSonraki: () => void
  onPas: () => void
  onBitir: () => void
}) {
  const ana = !sonrakiVar ? 'bitir' : cevapli || bitti ? 'sonraki' : 'pas'
  return (
    <nav aria-label="Sorular arası geçiş" className="shrink-0 bg-background px-2 pt-1.5 pb-[calc(0.375rem+var(--guvenli-alt))]">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={onOnceki}
          disabled={!oncekiVar}
          aria-label="Önceki soru"
          className="grid min-h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted text-foreground transition active:brightness-95 disabled:opacity-35"
        >
          <ChevronLeft size={22} />
        </button>
        <YakinlikDugmeleri kol={yakinlik} />
        {ana === 'pas' ? (
          <button
            type="button"
            onClick={onPas}
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-muted px-2 font-extrabold text-foreground transition active:brightness-95"
          >
            <SkipForward size={18} aria-hidden /> Pas geç
          </button>
        ) : ana === 'sonraki' ? (
          <button
            type="button"
            onClick={onSonraki}
            className={`flex min-h-12 min-w-0 flex-1 items-center justify-center gap-0.5 rounded-xl pr-1.5 pl-3 font-extrabold transition active:brightness-95 ${
              cevapli ? 'bg-primary-dolu text-white' : 'bg-muted text-foreground'
            }`}
          >
            Sonraki <ChevronRight size={20} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={onBitir}
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-dolu px-2 font-extrabold text-white transition active:brightness-95"
          >
            <Check size={18} aria-hidden /> {bitti ? 'Sonuç' : 'Bitir'}
          </button>
        )}
      </div>
    </nav>
  )
}
