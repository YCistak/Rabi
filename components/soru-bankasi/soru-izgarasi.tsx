'use client'

import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAsagiKaydirKapat } from '@/lib/asagi-kaydir'
import { useGeriKatmani } from '@/lib/geri'

/** Izgaradaki bir sorunun görünen hâli. Deneme bitmeden doğruluk gösterilmez: `cevaplandi`. */
export type HucreDurumu = 'd' | 'y' | '-' | 'cevaplandi'

const RENK: Record<HucreDurumu, string> = {
  d: 'bg-success-dolu text-white',
  y: 'bg-danger-dolu text-white',
  cevaplandi: 'bg-primary-derin text-white',
  '-': 'bg-muted text-foreground',
}

export function IzgaraHucreleri({
  durumlar,
  isaretliler,
  aktif,
  onSec,
}: {
  durumlar: HucreDurumu[]
  isaretliler: ReadonlySet<number>
  aktif?: number
  onSec: (sira: number) => void
}) {
  return (
    <div className="grid grid-cols-6 gap-2" role="list" aria-label="Sorular">
      {durumlar.map((durum, sira) => {
        const etiket = {
          d: 'doğru',
          y: 'yanlış',
          cevaplandi: 'cevaplandı',
          '-': 'boş',
        }[durum]
        return (
          <button
            key={sira}
            type="button"
            role="listitem"
            onClick={() => onSec(sira)}
            aria-current={sira === aktif ? 'step' : undefined}
            aria-label={`Soru ${sira + 1}, ${etiket}${isaretliler.has(sira) ? ', işaretli' : ''}`}
            className={`rakam relative grid aspect-square min-h-11 place-items-center rounded-xl text-[15px] font-extrabold transition active:scale-95 ${RENK[durum]} ${sira === aktif ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : ''}`}
          >
            {sira + 1}
            {isaretliler.has(sira) && (
              <Star
                size={13}
                aria-hidden
                className="absolute -top-1 -right-1 fill-warning-dolu text-warning-dolu drop-shadow-sm"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function IzgaraAciklamasi({ deneme }: { deneme: boolean }) {
  const ogeler: [string, string][] = deneme
    ? [
        ['bg-primary-derin', 'Cevaplandı'],
        ['bg-muted ring-1 ring-border', 'Boş'],
      ]
    : [
        ['bg-success-dolu', 'Doğru'],
        ['bg-danger-dolu', 'Yanlış'],
        ['bg-muted ring-1 ring-border', 'Boş'],
      ]
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-bold text-muted-foreground">
      {ogeler.map(([renk, ad]) => (
        <span key={ad} className="flex items-center gap-1.5">
          <i className={`size-2.5 rounded-full ${renk}`} />
          {ad}
        </span>
      ))}
      <span className="flex items-center gap-1">
        <Star size={12} className="fill-warning-dolu text-warning-dolu" aria-hidden />
        Sonra bak
      </span>
    </p>
  )
}

/** ▦ ile alttan açılan soru ızgarası. */
export function SoruIzgarasi({
  durumlar,
  isaretliler,
  aktif,
  deneme,
  bitti,
  onSec,
  onBitir,
  onSonuc,
  onKapat,
}: {
  durumlar: HucreDurumu[]
  isaretliler: ReadonlySet<number>
  aktif: number
  deneme: boolean
  bitti: boolean
  onSec: (sira: number) => void
  onBitir: () => void
  onSonuc: () => void
  onKapat: () => void
}) {
  useGeriKatmani(true, onKapat)
  const kaydir = useAsagiKaydirKapat(onKapat)
  const [hazir, setHazir] = useState(false)
  useEffect(() => setHazir(true), [])
  if (!hazir) return null

  const cevaplanan = durumlar.filter((durum) => durum !== '-').length
  return createPortal(
    <div
      className="katman-zemin tablet-orta-zemin fixed inset-0 z-[70] flex items-end justify-center bg-black/40"
      onClick={onKapat}
    >
      <div
        ref={kaydir}
        role="dialog"
        aria-modal
        aria-labelledby="soru-izgarasi-baslik"
        className="alt-pencere-girisi tablet-orta-pencere w-full max-w-md rounded-t-[26px] bg-card px-[18px] pt-2 pb-[calc(1.25rem+var(--guvenli-alt))]"
        onClick={(olay) => olay.stopPropagation()}
      >
        <div className="tablet-orta-tutamac flex justify-center pt-1.5 pb-3">
          <span className="h-[5px] w-[42px] rounded-[3px] bg-border" />
        </div>
        <div className="mb-3 flex items-baseline justify-between">
          <p id="soru-izgarasi-baslik" className="font-display text-lg font-extrabold tracking-tight">
            Sorular
          </p>
          <p className="text-[13px] font-bold text-muted-foreground">
            <span className="rakam">
              {cevaplanan}/{durumlar.length}
            </span>{' '}
            cevaplandı
          </p>
        </div>
        <IzgaraHucreleri durumlar={durumlar} isaretliler={isaretliler} aktif={aktif} onSec={onSec} />
        <IzgaraAciklamasi deneme={deneme && !bitti} />
        <button
          type="button"
          onClick={bitti ? onSonuc : onBitir}
          className="mt-5 min-h-12 w-full rounded-xl bg-primary-dolu font-extrabold text-white active:brightness-95"
        >
          {bitti ? 'Sonuca dön' : 'Testi bitir'}
        </button>
      </div>
    </div>,
    document.body,
  )
}
