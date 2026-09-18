'use client'

/**
 * Tanıtım penceresindeki zorluk seçimi.
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
 */

import { ZORLUKLAR, ZORLUK_ADI, type Zorluk } from '@/lib/oyunlar/ritim'
import { cn } from '@/lib/utils'

/** Seviyenin ne demek olduğu — çipin adı tek başına "kime göre" sorusunu bırakıyor. */
const ACIKLAMA: Record<Zorluk, string> = {
  kolay: 'Temel sorularla başlar.',
  orta: 'Sınavda en sık çıkan seviyeden başlar.',
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
      <p className="font-display text-lg font-bold">Hangi seviyeden başlayalım?</p>

      <div className="mt-3 flex gap-2">
        {ZORLUKLAR.map((zorluk) => {
          const acik = zorluk === secili
          return (
            <button
              key={zorluk}
              type="button"
              onClick={() => onSec(zorluk)}
              aria-pressed={acik}
              className={cn(
                'flex-1 rounded-2xl border-2 py-2.5 text-sm font-extrabold transition active:brightness-95',
                acik
                  ? 'border-primary-dolu bg-primary-soft text-primary'
                  : 'border-border bg-muted/50 text-muted-foreground',
              )}
            >
              {ZORLUK_ADI[zorluk]}
            </button>
          )
        })}
      </div>

      <p className="mt-2.5 text-xs leading-snug text-muted-foreground">{ACIKLAMA[secili]}</p>
    </div>
  )
}
