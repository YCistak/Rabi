'use client'

/**
 * Oyun modu penceresindeki dört mod: 2×2 ayrı kartlar
 * (`tasarim/oyun-modu-penceresi.html`).
 *
 * Kartta emoji, ad ve tek satırlık özet var; uzun kural yok (kullanıcı
 * kaldırttı — kartın altındaki açıklama pencereyi uzatıyordu, özet yetiyor).
 * Seçili kart **modun kendi rengine** boyanıyor, oyunun dersine değil: dört
 * mod dört ayrı şey ve ders rengi her oyunda dördünü de aynı kahverengiye
 * ya da maviye çeviriyordu.
 *
 * Simge emoji (kullanıcı istedi). Bir süre lucide çizgi ikondu — emoji
 * telefondan telefona başka çiziliyor ve hizalanan kardeşleri olan yerde
 * kural çizgi ikon diyor; burada istisna, karar kullanıcının.
 */

import { MODLAR, MOD_SIRASI, type OyunModu } from '@/lib/oyunlar/mod'
import { cn } from '@/lib/utils'

/**
 * Seçili kartın zemini, kenarı ve yazısı. Genel pastel aileler (`isl`, `yzm`,
 * `fzk`, `cog`): ders kimliği değiller, ders renkleriyle karışmasınlar diye.
 */
const RENKLER: Record<OyunModu, string> = {
  siradan: 'bg-isl border-isl-koyu text-isl-koyu',
  turbo: 'bg-yzm border-yzm-koyu text-yzm-koyu',
  'ani-olum': 'bg-fzk border-fzk-koyu text-fzk-koyu',
  rahat: 'bg-cog border-cog-koyu text-cog-koyu',
}

export function ModSecimi({
  secili,
  onSec,
}: {
  secili: OyunModu
  onSec: (mod: OyunModu) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
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
              'flex flex-col items-center rounded-[20px] border-[1.5px] px-2.5 pt-4 pb-3.5 text-center transition-colors active:brightness-[0.97]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              acik
                ? cn(RENKLER[mod], 'shadow-[0_0_0_1px_currentColor,0_4px_12px_rgb(27_26_25/0.10)]')
                : 'golge-kart border-foreground/15 bg-card text-foreground',
            )}
          >
            <span aria-hidden className="emoji text-[40px] leading-none">
              {tanim.simge}
            </span>
            <span className="mt-2.5 whitespace-nowrap text-[15px] font-extrabold leading-tight">
              {tanim.ad}
            </span>
            <span
              className={cn(
                'mt-0.5 whitespace-nowrap text-[11.5px] font-semibold leading-snug',
                !acik && 'text-muted-foreground',
              )}
            >
              {tanim.ozet}
            </span>
          </button>
        )
      })}
    </div>
  )
}
