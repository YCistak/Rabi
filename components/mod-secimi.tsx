'use client'

/**
 * Tur ayarlarında dört mod aynı genişlikte satırlar olarak gösterilir.
 * Seçilen mod işaretle ve renkle belirtilir; süre adıyla birlikte okunur.
 * Mod bütün oyunlarda ortak saklanır, zorluk ise oyun başına seçilir.
 */

import { AlertTriangle, Check, Clock, Moon, Zap } from 'lucide-react'
import { MODLAR, MOD_SIRASI, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { cn } from '@/lib/utils'

/**
 * Kutudaki çizgi ikon.
 *
 * `ModTanimi.simge`deki emoji burada kullanılmıyor: tasarım çizgi ikon
 * istiyor ve emoji telefondan telefona başka çiziliyor — dört kutunun
 * dördü de aynı ailede olmalı. Emoji duruyor ve tur içindeki mod rozetinde
 * (`oyun-kabuk.tsx`) hâlâ o çiziliyor; orası tek bir simge, hizalanacak
 * kardeşi yok.
 */
const SIMGELER: Record<OyunModu, typeof Clock> = {
  siradan: Clock,
  turbo: Zap,
  'ani-olum': AlertTriangle,
  rahat: Moon,
}

export function ModSecimi({
  secili,
  onSec,
}: {
  secili: OyunModu
  onSec: (mod: OyunModu) => void
}) {
  return (
    <div>
      <BolumBasligi>Oyun modu</BolumBasligi>

      <div className="mt-3 flex flex-col gap-2">
        {MOD_SIRASI.map((mod) => {
          const tanim = MODLAR[mod]
          const Simge = SIMGELER[mod]
          const acik = mod === secili
          return (
            <button
              key={mod}
              type="button"
              onClick={() => onSec(mod)}
              aria-pressed={acik}
              className={cn(
                'flex min-h-[64px] items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition active:brightness-95',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                acik
                  ? 'border-primary bg-primary-soft'
                  : 'border-border bg-card',
              )}
            >
              <Simge size={20} strokeWidth={2} className={acik ? 'text-primary' : 'text-muted-foreground'} aria-hidden />
              <span className="flex-1">
                <span className="block text-[15px] font-extrabold leading-tight">{tanim.ad}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{tanim.ozet}</span>
              </span>
              <span aria-hidden className={cn('grid size-5 shrink-0 place-items-center rounded-full border', acik ? 'border-primary bg-primary text-white' : 'border-border')}>
                {acik && <Check size={13} strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      {/* Seçilen modun kuralı tam olarak yazıyor: tur ortasında "bu neden
          bitti" diye sorulmasın. */}
      <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
        {MODLAR[secili].kural}
      </p>

      {/*
        Kayıtsız mod seçildiği **anda** söyleniyor. Turun sonunda öğrenilen bir
        kural, o turu boşa harcatır.
      */}
      {!modKayitliMi(secili) && (
        <p className="mt-2 rounded-xl bg-warning-soft px-2.5 py-1.5 text-[11.5px] font-bold leading-snug text-warning">
          Rekor tutulmaz; yanlışların Oyun Bankası’na eklenir.
        </p>
      )}
    </div>
  )
}

/** Seçim alanlarının ortak başlığı. */
function BolumBasligi({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[16px] font-extrabold leading-tight tracking-tight">
      {children}
    </h2>
  )
}

export { BolumBasligi }
