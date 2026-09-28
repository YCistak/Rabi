'use client'

/**
 * "Turu ayarla" penceresindeki zorluk seçimi
 * (`tasarim/oyun-modu-secimi.dc.html`).
 *
 * Sorduğu şey turun **başlangıcı**, tamamı değil: seviye tur içinde cevaplara
 * göre kaymaya devam ediyor (`lib/oyunlar/uyum.ts`). Bir süre seçim hiç yoktu
 * ve herkes ortadan başlıyordu; seviyesini bilen oyuncu her turda üç soru
 * boyunca ısınmak zorunda kalıyordu. Bir süre de yalnızca seçim vardı ve
 * seçim tur boyunca donuyordu — kolayda on doğru yapana oyun kolay soru
 * vermeye devam ediyordu. İkisi birlikte: seçim nereden, uyum nereye.
 *
 * Bu yüzden altındaki cümle "bu tur hep kolay olacak" demiyor. Kullanıcıya
 * söylenen şey başlangıç; kaymanın kendisi söylenmiyor (gerekçesi `uyum.ts`).
 *
 * Seçim oyun başına saklanıyor (`ANAHTARLAR.oyunZorlugu`): biri edebiyatta
 * kolayda kalırken sesi zorda oynayabiliyor.
 *
 * Üç başlangıç seviyesi yan yana düğmelerle seçilir; seçili seviye mod
 * satırlarıyla aynı çerçeve ve renk işaretini kullanır.
 */

import { ZORLUKLAR, ZORLUK_ADI, type Zorluk } from '@/lib/oyunlar/ritim'
import { BolumBasligi } from '@/components/mod-secimi'
import { cn } from '@/lib/utils'

/** Seviyenin ne demek olduğu — çipin adı tek başına "kime göre" sorusunu bırakıyor. */
const ACIKLAMA: Record<Zorluk, string> = {
  kolay: 'Temel sorularla başlar.',
  orta: 'Orta düzey sorularla başlar.',
  zor: 'En zor sorularla başlar.',
}

export function ZorlukSecimi({
  secili,
  onSec,
}: {
  secili: Zorluk
  onSec: (zorluk: Zorluk) => void
}) {
  return (
    <div>
      <BolumBasligi>Başlangıç zorluğu</BolumBasligi>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {ZORLUKLAR.map((zorluk) => (
          <button
            key={zorluk}
            type="button"
            onClick={() => onSec(zorluk)}
            aria-pressed={zorluk === secili}
            className={cn(
              'min-h-12 rounded-lg border text-[14px] font-extrabold transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              zorluk === secili ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-card text-muted-foreground',
            )}
          >
            {ZORLUK_ADI[zorluk]}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{ACIKLAMA[secili]}</p>
    </div>
  )
}
