'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays } from 'lucide-react'
import { Takvim, type GunIsareti } from '@/components/takvim'
import { useGeriKatmani } from '@/lib/geri'
import { tarihYaz } from '@/lib/hesap'
import { bugun, cn, tariheCevir } from '@/lib/utils'

const ISARETSIZ = new Map<string, GunIsareti>()

/**
 * Tarih kutusu — telefonun kendi tarih seçicisi yerine uygulamanın takvimini
 * açılır pencerede açar. Kullanıcı istedi: `type="date"` Android'de sistemin,
 * iOS'ta tekerleğin seçicisini açıyordu, uygulamanın geri kalanına benzemiyordu.
 * Bir güne dokunmak seçer ve kapatır; zemine dokunmak ya da geri tuşu seçmeden
 * kapatır.
 */
export function TarihSecici({
  id,
  deger,
  onDegis,
  className,
}: {
  id?: string
  /** 'YYYY-AA-GG'. */
  deger: string
  onDegis: (tarih: string) => void
  className?: string
}) {
  const [acik, setAcik] = useState(false)
  const [ay, setAy] = useState(() => tariheCevir(deger))

  useGeriKatmani(acik, () => setAcik(false))

  const ac = () => {
    // Pencere her açılışta seçili tarihin ayından başlar; önceki gezinti kalmaz.
    setAy(tariheCevir(deger))
    setAcik(true)
  }

  // React olayları portaldan da ata kabarır: pencerede bir dokunuş, formu
  // çizen katmanın işleyicilerine ulaşmasın (`useKapatmaOnayi` ile aynı sebep).
  const durdur = (e: React.SyntheticEvent) => e.stopPropagation()

  return (
    <>
      <button
        id={id}
        type="button"
        onClick={ac}
        aria-haspopup="dialog"
        className={cn(
          'flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 text-left text-[15px]',
          'focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring/40',
          'active:bg-muted',
          className,
        )}
      >
        <span className={cn('truncate rakam', !deger && 'text-muted-foreground/70')}>
          {deger ? tarihYaz(deger) : 'Tarih seç'}
        </span>
        <CalendarDays size={17} aria-hidden className="shrink-0 text-muted-foreground" />
      </button>

      {/* Pencere `body`ye taşınıyor: form kaydırılan, dönüşümlü bir kabın
          içinde; orada çizilse kabın içine hapsolurdu. */}
      {acik &&
        createPortal(
          <div
            className="relative z-[100]"
            onClick={durdur}
            onPointerDown={durdur}
            onPointerUp={durdur}
            onTouchStart={durdur}
            onTouchEnd={durdur}
          >
            <div className="katman-zemin fixed inset-0 grid place-items-center bg-black/35 px-6">
              <button
                type="button"
                aria-label="Takvimi kapat"
                onClick={() => setAcik(false)}
                className="absolute inset-0 cursor-default"
              />
              <div
                role="dialog"
                aria-label="Tarih seç"
                className="pencere-girisi golge-kart relative w-full max-w-[340px] rounded-[22px] bg-card p-3"
              >
                <Takvim
                  ay={ay}
                  onAyDegis={setAy}
                  secili={deger}
                  onSec={(tarih) => {
                    onDegis(tarih)
                    setAcik(false)
                  }}
                  isaretler={ISARETSIZ}
                  bugunIso={bugun()}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
