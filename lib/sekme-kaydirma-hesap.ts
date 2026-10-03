/**
 * Sekmeler arası kaydırmanın saf hesapları (`sekme-kaydirma.ts`). Ayrı
 * dosyada: kanca tarayıcıya ve ekran görüntülerine bağlı, bunlar test ediliyor.
 */

import type { Sekme } from './gezinme'

/** Alt menüdeki sıra; `bottom-nav.tsx` de bunu çiziyor. */
export const SEKME_SIRASI: readonly Sekme[] = ['ana', 'daha', 'harita', 'oyunlar', 'ayarlar']

/** Kenara bu kadar yakın başlayan hareket sistemin (geri) hareketi. */
export const KENAR_PAYI = 24
/** Yön bu kadar yoldan sonra belli oluyor. */
export const KILIT_YOLU = 10
/** Yatay yol dikeyin en az bu katıysa hareket yatay. */
export const YATAYLIK = 1.15
/** Bırakınca bu oranı geçen kaydırma sekmeyi değiştiriyor. */
export const GECIS_ORANI = 0.33
/** Ya da bu hızla (px/ms) savrulan, en az `SAVRULMA_YOLU` yol almış hareket. */
export const SAVRULMA_HIZI = 0.45
export const SAVRULMA_YOLU = 36
/** Uçtaki sekmede sayfa parmağın bu oranı kadar kayıyor. */
export const DIRENC = 0.28

/** Komşu sekme; uçta `null` (ilk sekmenin solunda bir şey yok). */
export function komsuSekme(sekme: Sekme, yon: -1 | 1): Sekme | null {
  const sira = SEKME_SIRASI.indexOf(sekme) + yon
  return SEKME_SIRASI[sira] ?? null
}

/** Parmağın yönünden hedefin yönü: parmak sağa (dx > 0) → soldaki (−1). */
export function hedefYonu(dx: number): -1 | 1 {
  return dx > 0 ? -1 : 1
}

/**
 * Bırakınca sekme değişsin mi.
 *
 * `dx` toplam yatay yol, `hiz` son anların hızı (px/ms, işaretli),
 * `genislik` ekran genişliği. Hız hareketle aynı yöndeyse sayılıyor: geri
 * savrulan parmak "vazgeçtim" demek.
 */
export function birakmaKarari(dx: number, hiz: number, genislik: number): boolean {
  if (Math.abs(dx) >= genislik * GECIS_ORANI) return Math.sign(hiz) !== -Math.sign(dx) || Math.abs(hiz) < SAVRULMA_HIZI
  return Math.abs(dx) >= SAVRULMA_YOLU && Math.abs(hiz) >= SAVRULMA_HIZI && Math.sign(hiz) === Math.sign(dx)
}
