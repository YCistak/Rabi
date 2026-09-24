'use client'

import { ZORLUKLAR, ZORLUK_ADI, type Zorluk } from '@/lib/oyunlar/ritim'
import { BolumBasligi } from '@/components/mod-secimi'
import { cn } from '@/lib/utils'

/** Seçim yalnızca turun başladığı düzeyi belirler; sorular sonra uyarlanır. */
const ACIKLAMA: Record<Zorluk, string> = {
  kolay: 'Temel sorularla başlar.',
  orta: 'Sınavda en sık çıkan seviyeden başlar.',
  zor: 'En zor sorularla başlar.',
}

export function ZorlukSecimi({
  secili,
  onSec,
}: {
  secili: Zorluk
  onSec: (zorluk: Zorluk) => void
}) {
  return (
    <section aria-labelledby="zorluk-basligi">
      <BolumBasligi id="zorluk-basligi">Başlangıç zorluğu</BolumBasligi>
      <div className="mt-3 grid grid-cols-3 border-b border-border">
        {ZORLUKLAR.map((zorluk) => (
          <button
            key={zorluk}
            type="button"
            onClick={() => onSec(zorluk)}
            aria-pressed={zorluk === secili}
            className={cn(
              'min-h-12 border-b-[3px] px-2 text-sm font-extrabold active:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              zorluk === secili ? 'border-primary text-primary' : 'border-transparent text-muted-foreground',
            )}
          >
            {ZORLUK_ADI[zorluk]}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs leading-snug text-muted-foreground">{ACIKLAMA[secili]}</p>
    </section>
  )
}
