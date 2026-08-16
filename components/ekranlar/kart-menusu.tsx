'use client'

import { KARTLAR, type Ekran } from '@/lib/gezinme'
import { cn } from '@/lib/utils'

/**
 * Ana sayfadaki ve "Daha" sekmesindeki kart ızgarası.
 * `kisa` verilirse yalnızca ilk dört kart gösterilir (ana sayfa kalabalıklaşmasın).
 */
export function KartMenusu({
  onKartAc,
  kisa,
  className,
}: {
  onKartAc: (ekran: Ekran) => void
  kisa?: boolean
  className?: string
}) {
  const kartlar = kisa ? KARTLAR.slice(0, 4) : KARTLAR

  return (
    <div className={className}>
      {!kisa && (
        <h1 className="mb-4 font-display text-2xl font-semibold tracking-tight">Tüm bölümler</h1>
      )}
      <ul className="grid grid-cols-2 gap-3">
        {kartlar.map(({ id, ad, aciklama, Simge }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onKartAc(id)}
              className={cn(
                'flex h-full w-full flex-col items-start gap-2 rounded-2xl border border-border bg-card p-3.5 text-left transition',
                'active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              )}
            >
              <span className="rounded-xl bg-primary-soft p-2 text-primary">
                <Simge size={20} aria-hidden />
              </span>
              <span className="font-medium leading-tight">{ad}</span>
              <span className="text-xs leading-snug text-muted-foreground">{aciklama}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
