'use client'

import { Star } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { HUCRE_ETIKETI, HUCRE_RENGI, type HucreDurumu } from './soru-izgarasi'

/**
 * Soru görünümünün üstündeki numara şeridi: her soru tek dokunuşla açılır,
 * durumu (boş, cevaplı/doğru/yanlış, pas) rengiyle, "sonra bak" yıldızla
 * görünür. 12 soru 360 px'e sığar (hücre 30 px, dokunma hedefi 44 px boy);
 * daha uzun listede (yanlışları tekrar) yana kayar ve etkin soru görünür kalır.
 */
export function SoruSeridi({
  durumlar,
  supheliler,
  aktif,
  onSec,
}: {
  durumlar: HucreDurumu[]
  supheliler: ReadonlySet<number>
  aktif: number
  onSec: (sira: number) => void
}) {
  const kutu = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const oge = kutu.current?.querySelector<HTMLElement>(`[data-serit-sira="${aktif}"]`)
    oge?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [aktif])

  return (
    <nav aria-label="Sorular" className="relative z-10 shrink-0 border-b border-border bg-background">
      <div ref={kutu} className="scrollbar-gizli flex overflow-x-auto px-1.5">
        {durumlar.map((durum, sira) => (
          <button
            key={sira}
            type="button"
            data-serit-sira={sira}
            onClick={() => onSec(sira)}
            aria-current={sira === aktif ? 'step' : undefined}
            aria-label={`Soru ${sira + 1}, ${HUCRE_ETIKETI[durum]}${supheliler.has(sira) ? ', sonra bak' : ''}`}
            className="group relative grid h-11 min-w-[1.875rem] flex-1 place-items-center"
          >
            <span
              className={`rakam grid size-7 place-items-center rounded-full text-[13px] font-extrabold transition group-active:scale-90 ${HUCRE_RENGI[durum]} ${
                sira === aktif ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
              }`}
            >
              {sira + 1}
            </span>
            {supheliler.has(sira) && (
              <Star
                size={11}
                aria-hidden
                className="absolute top-0.5 right-0 fill-warning-dolu text-warning-dolu"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
