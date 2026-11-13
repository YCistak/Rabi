import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Sabit alt çubuk: ‹ Önceki · 5 / 12 · Sonraki ›. Kendiliğinden geçiş yok;
 * cevaplanmış soruda Sonraki dolu renkte, son soruda "Bitir" (bitmiş testte
 * "Sonuç"). Ortadaki sayı ızgarayı açar.
 */
export function GezinmeCubugu({
  sira,
  toplam,
  modEtiketi,
  vurgulu,
  sonEtiket,
  onOnceki,
  onSonraki,
  onIzgara,
}: {
  sira: number
  toplam: number
  modEtiketi: string
  vurgulu: boolean
  sonEtiket: string
  onOnceki: () => void
  onSonraki: () => void
  onIzgara: () => void
}) {
  const son = sira === toplam - 1
  return (
    <nav aria-label="Sorular arası geçiş" className="shrink-0 bg-background px-2 pt-1.5 pb-[calc(0.375rem+var(--guvenli-alt))]">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={onOnceki}
          disabled={sira === 0}
          className="flex min-h-12 flex-1 items-center justify-center gap-0.5 rounded-xl bg-muted pr-3 pl-1.5 font-extrabold text-foreground transition active:brightness-95 disabled:opacity-35"
        >
          <ChevronLeft size={20} aria-hidden /> Önceki
        </button>
        <button
          type="button"
          onClick={onIzgara}
          aria-label={`Soru ${sira + 1} / ${toplam}. Soru ızgarasını aç`}
          className="flex min-h-12 min-w-[5.5rem] flex-col items-center justify-center rounded-xl px-2 leading-tight active:bg-muted"
        >
          <span className="rakam font-display text-[17px] font-extrabold">
            {sira + 1} <span className="text-muted-foreground">/ {toplam}</span>
          </span>
          <span className="text-[11px] font-bold text-muted-foreground">{modEtiketi}</span>
        </button>
        <button
          type="button"
          onClick={onSonraki}
          className={`flex min-h-12 flex-1 items-center justify-center gap-0.5 rounded-xl pr-1.5 pl-3 font-extrabold transition active:brightness-95 ${vurgulu ? 'bg-primary-dolu text-white' : 'bg-muted text-foreground'}`}
        >
          {son ? sonEtiket : 'Sonraki'} {!son && <ChevronRight size={20} aria-hidden />}
        </button>
      </div>
    </nav>
  )
}
