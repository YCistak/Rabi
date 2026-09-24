'use client'

import { MODLAR, MOD_SIRASI, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { cn } from '@/lib/utils'

/** Tur kuralları seçilir; her satır süresini ve eleme biçimini de gösterir. */
export function ModSecimi({
  secili,
  onSec,
}: {
  secili: OyunModu
  onSec: (mod: OyunModu) => void
}) {
  return (
    <section aria-labelledby="oyun-modu-basligi">
      <BolumBasligi id="oyun-modu-basligi">Oyun modu</BolumBasligi>
      <div className="mt-3 grid grid-cols-2 border-l border-t border-border">
        {MOD_SIRASI.map((mod) => {
          const tanim = MODLAR[mod]
          const acik = mod === secili
          return (
            <button
              key={mod}
              type="button"
              onClick={() => onSec(mod)}
              aria-pressed={acik}
              className={cn(
                'flex min-h-[72px] w-full items-start gap-2.5 border-b border-r border-border px-2.5 py-3 text-left active:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                acik && 'bg-primary-soft',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'mt-0.5 flex size-[18px] flex-none items-center justify-center rounded-full border-2',
                  acik ? 'border-primary' : 'border-muted-foreground/50',
                )}
              >
                {acik && <span className="size-2 rounded-full bg-primary" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-[14px] font-black leading-tight">{tanim.ad}</span>
                <span className="text-[11px] font-bold leading-tight text-muted-foreground">{tanim.ozet}</span>
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs leading-snug text-muted-foreground">{MODLAR[secili].kural}</p>
      {!modKayitliMi(secili) && (
        <p className="mt-2 border-l-2 border-warning pl-3 text-xs font-bold leading-snug text-warning">
          Bu turun rekoru ve istatistiği tutulmaz. Yanlışların yine Oyun Bankası’na düşer.
        </p>
      )}
    </section>
  )
}

function BolumBasligi({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="font-display text-[16px] font-black text-foreground">{children}</h2>
}

export { BolumBasligi }
