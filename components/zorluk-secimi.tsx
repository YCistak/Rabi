'use client'

/**
 * Tanıtım penceresindeki zorluk seçimi.
 *
 * Dokuz oyunun hepsinde aynı: seçilen seviye hem normal soruların hem de
 * boss'un kaynağını belirliyor — boss her zaman bir üst seviyeden geliyor.
 * Seçim oyun bazında saklanıyor, çünkü biri edebiyatta kolayda kalırken sesi
 * zorda oynayabiliyor.
 */

import { Cip } from '@/components/ui'
import { ZORLUKLAR, ZORLUK_ADI, bossZorlugu, type Zorluk } from '@/lib/oyunlar/ritim'

/** Boss'un ne olacağını seçimin altında yazıyoruz — kural gizli kalmasın. */
const BOSS_ACIKLAMASI: Record<Zorluk, string> = {
  kolay: 'Boss soruları orta seviyeden gelir.',
  orta: 'Boss soruları zor seviyeden gelir.',
  zor: 'Üstü yok: boss yine zor, ama süresi çok daha kısa.',
}

export function ZorlukSecimi({
  secili,
  onSec,
  bossVar,
}: {
  secili: Zorluk
  onSec: (zorluk: Zorluk) => void
  /** Matematik oyunlarında boss yok; boss açıklaması da gösterilmiyor. */
  bossVar: boolean
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Hangi seviye?</p>
      <div className="flex flex-wrap gap-2">
        {ZORLUKLAR.map((zorluk) => (
          <Cip key={zorluk} secili={secili === zorluk} onClick={() => onSec(zorluk)}>
            {ZORLUK_ADI[zorluk]}
          </Cip>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {bossVar ? BOSS_ACIKLAMASI[secili] : 'Seçimin saklanır.'}
      </p>
    </div>
  )
}

/** Boss zorluğunun okunur adı — tur sonu ekranında kullanılıyor. */
export function bossAdi(secilen: Zorluk): string {
  const { zorluk, cetin } = bossZorlugu(secilen)
  return cetin ? `${ZORLUK_ADI[zorluk]} (kısa süreli)` : ZORLUK_ADI[zorluk]
}
