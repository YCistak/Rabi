'use client'

/**
 * Tanıtım penceresindeki mod seçimi.
 *
 * Zorluk seçiminin (`zorluk-secimi.tsx`) üstünde duruyor çünkü sorduğu şey
 * daha büyük: zorluk soruların nereden geleceğini, mod turun nasıl işleyeceğini
 * belirliyor. Çip yerine ızgara, çünkü her modun adı tek başına yetmiyor —
 * "Turbo"nun kaç saniye olduğu kutunun içinde yazmalı, kullanıcı seçmeden önce
 * bilmeli.
 *
 * Seçim bütün oyunlarda ortak ve saklanıyor (`rabi-oyun-modu`).
 */

import { MODLAR, MOD_SIRASI, modKayitliMi, type OyunModu } from '@/lib/oyunlar/mod'
import { cn } from '@/lib/utils'

export function ModSecimi({
  secili,
  onSec,
}: {
  secili: OyunModu
  onSec: (mod: OyunModu) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Tur nasıl işlesin?</p>

      <div className="grid grid-cols-2 gap-2">
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
                'rounded-2xl border px-2.5 py-2 text-left transition active:brightness-95',
                acik
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border bg-muted/50 text-muted-foreground',
              )}
            >
              <span className="flex items-center gap-1.5">
                <span aria-hidden>{tanim.simge}</span>
                <span className="text-[13px] font-extrabold leading-tight">{tanim.ad}</span>
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold leading-tight opacity-80">
                {tanim.ozet}
              </span>
            </button>
          )
        })}
      </div>

      {/* Seçilen modun kuralı tam olarak yazıyor: tur ortasında "bu neden
          bitti" diye sorulmasın. */}
      <p className="mt-2 text-xs leading-snug text-muted-foreground">{MODLAR[secili].kural}</p>

      {!modKayitliMi(secili) && (
        <p className="mt-1.5 rounded-xl bg-warning-soft px-2.5 py-1.5 text-[11.5px] font-bold leading-snug text-warning">
          Bu turun rekoru ve istatistiği tutulmaz. Yanlışların yine Oyun
          Bankası’na düşer.
        </p>
      )}
    </div>
  )
}
