'use client'

import { Home, Timer, PencilLine, ClipboardList, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Sekme } from '@/lib/gezinme'

const SEKMELER: { id: Sekme; ad: string; Simge: typeof Home }[] = [
  { id: 'ana', ad: 'Ana Sayfa', Simge: Home },
  { id: 'pomodoro', ad: 'Pomodoro', Simge: Timer },
  { id: 'soru', ad: 'Soru', Simge: PencilLine },
  { id: 'deneme', ad: 'Deneme', Simge: ClipboardList },
  { id: 'daha', ad: 'Daha', Simge: LayoutGrid },
]

export function BottomNav({
  sekme,
  onDegis,
}: {
  sekme: Sekme
  onDegis: (sekme: Sekme) => void
}) {
  return (
    <nav className="guvenli-alt fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/85 backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {SEKMELER.map(({ id, ad, Simge }) => {
          const aktif = sekme === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onDegis(id)}
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition',
                  aktif ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Simge size={21} strokeWidth={aktif ? 2.4 : 1.9} aria-hidden />
                {ad}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
