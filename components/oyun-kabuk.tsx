'use client'

import { Check, Flame, HelpCircle, Trophy, X } from 'lucide-react'
import { TUR_SURESI, sureOrani } from '@/lib/oyunlar/tur'
import { cn } from '@/lib/utils'
import { Halka } from '@/components/ui'

/**
 * Bütün mini oyunların ortak çerçevesi: kapatma, başlık, süre halkası, süre
 * çubuğu ve sayaç şeridi.
 *
 * Tek yerde tutulmasının sebebi tutarlılık: üç oyun da aynı süreyi, aynı cezayı
 * ve aynı puanı kullanıyor. Her oyun kendi üst bilgisini çizseydi aynı sayının
 * farklı yerlerde farklı göründüğü bir arayüz çıkardı.
 *
 * Tam ekran açılıyor (`z-50`, alt menü z-40'ta): süreli bir turda yanlışlıkla
 * sekmeye basmak turu bitirirdi.
 */

export type SayacBilgisi = {
  /** Kalan saniye. */
  kalan: number
  /** Şu anki ardışık doğru sayısı. */
  seri: number
  dogru: number
  yanlis: number
  enIyiSeri: number
  rekor: number
}

export function OyunKabugu({
  baslik,
  sayac,
  onCik,
  onYardim,
  children,
}: {
  baslik: string
  /** Sonuç ekranında `null` — orada süre ve sayaçların yeri yok. */
  sayac: SayacBilgisi | null
  onCik: () => void
  onYardim: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="guvenli-alt mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-4 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <YuvarlakDugme etiket="Oyundan çık" onClick={onCik}>
              <X size={18} aria-hidden />
            </YuvarlakDugme>
            <YuvarlakDugme etiket="Nasıl oynanır" onClick={onYardim}>
              <HelpCircle size={18} aria-hidden />
            </YuvarlakDugme>
          </div>

          <p className="min-w-0 truncate font-display text-base font-semibold">{baslik}</p>

          {/* Seri rozeti sağda: yerini hep koruyor, yoksa başlık her doğru
              cevapta yana kayardı. */}
          <SeriRozeti seri={sayac?.seri ?? 0} gorunur={sayac !== null} />
        </div>

        {sayac && (
          <>
            <div className="mt-3 flex items-center gap-3">
              <Halka
                deger={sayac.kalan}
                hedef={TUR_SURESI}
                boyut={52}
                kalinlik={5}
                renk={sayac.kalan <= 10 ? 'var(--danger)' : 'var(--ikincil)'}
              >
                <span
                  className={cn(
                    'rakam font-display text-lg font-semibold',
                    sayac.kalan <= 10 ? 'text-danger' : 'text-foreground',
                  )}
                >
                  {sayac.kalan}
                </span>
              </Halka>

              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-[width] duration-200',
                    sayac.kalan <= 10 ? 'bg-danger' : 'bg-ikincil',
                  )}
                  style={{ width: `${sureOrani(sayac.kalan) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1 border-b border-border pb-3">
              <Sayac
                simge={<Check size={15} aria-hidden />}
                renk="text-success"
                deger={sayac.dogru}
                etiket="Doğru"
              />
              <Sayac
                simge={<X size={15} aria-hidden />}
                renk="text-danger"
                deger={sayac.yanlis}
                etiket="Yanlış"
              />
              <Sayac
                simge={<Flame size={15} aria-hidden />}
                renk="text-warning"
                deger={sayac.enIyiSeri}
                etiket="En iyi seri"
              />
              <Sayac
                simge={<Trophy size={15} aria-hidden />}
                renk="text-primary"
                deger={sayac.rekor}
                etiket="Rekor"
              />
            </div>
          </>
        )}

        {children}
      </div>
    </div>
  )
}

function YuvarlakDugme({
  etiket,
  onClick,
  children,
}: {
  etiket: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiket}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition active:bg-muted"
    >
      {children}
    </button>
  )
}

/** Ardışık doğru sayısı. İki ve üzerinde yanıyor; altında soluk duruyor. */
function SeriRozeti({ seri, gorunur }: { seri: number; gorunur: boolean }) {
  const yaniyor = seri >= 2
  return (
    <span
      aria-label={gorunur ? `Ardışık doğru: ${seri}` : undefined}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1 rounded-full px-2.5 text-sm font-semibold transition',
        !gorunur && 'invisible',
        yaniyor ? 'bg-warning/15 text-warning' : 'bg-muted/70 text-muted-foreground/60',
      )}
    >
      <Flame size={15} aria-hidden />
      <span className="rakam">×{seri}</span>
    </span>
  )
}

function Sayac({
  simge,
  renk,
  deger,
  etiket,
}: {
  simge: React.ReactNode
  renk: string
  deger: number
  etiket: string
}) {
  return (
    <div className="text-center">
      <span className="flex items-center justify-center gap-1">
        <span className={renk}>{simge}</span>
        <span className="rakam font-display text-base font-semibold">{deger}</span>
      </span>
      <span className="mt-0.5 block text-[11px] leading-none text-muted-foreground">
        {etiket}
      </span>
    </div>
  )
}
