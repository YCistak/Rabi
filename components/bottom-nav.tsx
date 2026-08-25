'use client'

import { cn } from '@/lib/utils'
import type { Sekme } from '@/lib/gezinme'

/**
 * Alt menü simgeleri elle çiziliyor, hazır setten alınmıyor.
 *
 * Tasarımdaki dört simgenin görsel ağırlığı birbirine eşit; lucide'ın
 * `Gamepad2`si diğerlerinin yanında basık duruyordu. Dördü de 24×24 kutuda,
 * aynı çizgi kalınlığında ve aynı optik yükseklikte.
 */
const SIMGELER: Record<Sekme, React.ReactNode> = {
  ana: (
    <>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" />
      <path d="M9.5 20.5V14h5v6.5" />
    </>
  ),
  oyunlar: (
    <>
      <path d="M9.3 4.6h5.4a5.7 5.7 0 0 1 5.7 5.7v2a2.4 2.4 0 0 1-.1.8l-1.7 5a3.2 3.2 0 0 1-6-.3l-.5-1.7h-1.6l-.5 1.7a3.2 3.2 0 0 1-6 .3l-1.7-5a2.4 2.4 0 0 1-.1-.8v-2a5.7 5.7 0 0 1 5.7-5.7Z" />
      <path d="M8.4 9.4v3.2M6.8 11h3.2" />
      <path d="M15.4 9.9h.01M17.2 12.1h.01" />
    </>
  ),
  daha: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  ayarlar: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1v-.3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4.9Z" />
    </>
  ),
}

const SEKMELER: { id: Sekme; ad: string }[] = [
  { id: 'ana', ad: 'Ana Sayfa' },
  { id: 'oyunlar', ad: 'Oyunlar' },
  { id: 'daha', ad: 'Araçlar' },
  { id: 'ayarlar', ad: 'Ayarlar' },
]

export function BottomNav({
  sekme,
  onDegis,
}: {
  sekme: Sekme
  onDegis: (sekme: Sekme) => void
}) {
  return (
    /*
      Menü zeminden ayrılan, üst köşeleri yuvarlatılmış bir yüzey — tasarımda
      ekranın devamı değil, üstüne oturmuş ayrı bir parça. Yanlarda boşluk yok:
      telefonun alt kenarına yapışık duruyor, yalnızca köşeleri kırılıyor.
    */
    <nav className="guvenli-alt fixed inset-x-0 bottom-0 z-40 rounded-t-[26px] bg-card/95 shadow-[0_-4px_18px_rgba(38,58,110,0.07)] backdrop-blur">
      <ul className="mx-auto flex max-w-md px-3 pt-2.5 pb-1">
        {SEKMELER.map(({ id, ad }) => {
          const aktif = sekme === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onDegis(id)}
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-bold transition',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  aktif ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={aktif ? 2.3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {SIMGELER[id]}
                </svg>
                {ad}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
