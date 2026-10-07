import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Şıkkın cevaptan sonraki hâli.
 *
 * `isaretli`: seçilmeyen ama doğru olan şık. Yanlış seçildiğinde doğrusu da
 * gösteriliyor — öğrenme orada oluyor. `soluk`: seçilmeyen yanlış şık.
 */
export type SikHali = 'bos' | 'dogru' | 'yanlis' | 'isaretli' | 'soluk'

/** Oyunların ortak hesabı; her oyun "seçilen"i kendi türünde karşılaştırıyor. */
export function sikHali(acikta: boolean, secilen: boolean, dogruMu: boolean): SikHali {
  if (!acikta) return 'bos'
  if (secilen) return dogruMu ? 'dogru' : 'yanlis'
  return dogruMu ? 'isaretli' : 'soluk'
}

const HARFLER = ['A', 'B', 'C', 'D', 'E', 'F']

/**
 * Bütün oyunların şık düğmesi.
 *
 * Kenar ve alttaki 3 px'lik gölge dersin rengi (`--vurgu-kenar`, kabuk
 * `dersVurgusu` ile veriyor): beyaz düğme pastel zeminde basılabilir bir taş
 * gibi duruyor, basınca gölge kadar iniyor. Harf (A, B…) şıkları birbirinden
 * ayırıyor; içerik ortada kalsın diye sağda harf kadar yer ayrılıyor, doğru
 * işareti oraya düşüyor. Yanlış şıkta çarpı yok: kırmızı dolgu yetiyor, yanındaki
 * yeşil işaret de doğrusunu gösteriyor.
 *
 * Önceden on iki oyunda ayrı ayrı yazılmıştı; renkler ve hâller tek yerde
 * değişsin diye buraya alındı. Yazı boyu ve yüksekliği oyuna ait (`className`).
 */
export function OyunSikki({
  sira,
  hal,
  onSec,
  className,
  icerikClassName,
  children,
}: {
  /** Şıkkın sırası; harfi veriyor. */
  sira: number
  hal: SikHali
  onSec: () => void
  /** Yükseklik, yazı boyu, köşe — oyuna göre. */
  className?: string
  icerikClassName?: string
  children: React.ReactNode
}) {
  const acikta = hal !== 'bos'
  const dolu = hal === 'dogru' || hal === 'yanlis'

  return (
    <button
      type="button"
      onClick={onSec}
      disabled={acikta}
      className={cn(
        'grid w-full grid-cols-[28px_1fr_28px] items-center gap-2 rounded-[20px] border-2 px-3',
        'font-display font-extrabold leading-snug transition-[transform,box-shadow,opacity] duration-75',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        hal === 'bos' &&
          'border-[var(--vurgu-kenar)] bg-card shadow-[0_3px_0_var(--vurgu-kenar)] active:translate-y-[3px] active:shadow-none',
        hal === 'dogru' &&
          'border-success bg-success text-white shadow-[0_3px_0_color-mix(in_srgb,var(--success)_75%,black)]',
        hal === 'yanlis' &&
          'border-ikincil bg-ikincil text-white shadow-[0_3px_0_color-mix(in_srgb,var(--ikincil)_75%,black)]',
        hal === 'isaretli' && 'border-success bg-card text-success shadow-[0_3px_0_var(--success)]',
        hal === 'soluk' &&
          'border-[var(--vurgu-kenar)] bg-card opacity-45 shadow-[0_3px_0_var(--vurgu-kenar)]',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'grid h-7 w-7 place-items-center rounded-[8px] text-[13px] font-extrabold',
          dolu && 'bg-white/20 text-white',
          hal === 'isaretli' && 'bg-success-soft text-success',
          (hal === 'bos' || hal === 'soluk') && 'bg-primary-soft text-primary',
        )}
      >
        {HARFLER[sira] ?? sira + 1}
      </span>
      <span className={cn('min-w-0 break-words text-center', icerikClassName)}>{children}</span>
      <span className="grid place-items-center">
        {(hal === 'dogru' || hal === 'isaretli') && <Check size={19} strokeWidth={3} aria-hidden />}
      </span>
    </button>
  )
}
