import { GECME_ORANI } from './ilerleme'

/**
 * Yoklama kapanışının kademesi (`components/konu/soru-sahnesi.tsx` → `Kapanis`).
 *
 * Üç kademe, üç başlık, üç renk. Eşikler haritadaki yıldızlarla **aynı**
 * (`konu-haritasi.tsx`): %90 üç yıldız, geçme sınırı iki, altı bir. Kapanış
 * "harika" derken harita iki yıldız gösterseydi iki ekran aynı sonucu iki
 * ayrı ölçekle okumuş olurdu.
 */
export type KapanisKademesi = 'harika' | 'iyi' | 'tekrar'

export const YUKSEK_ORAN = 90

export function kapanisKademesi(dogru: number, yanlis: number): KapanisKademesi {
  const oran = isabetOrani(dogru, yanlis)
  if (oran >= YUKSEK_ORAN) return 'harika'
  if (oran >= GECME_ORANI) return 'iyi'
  return 'tekrar'
}

/** Doğru yüzdesi, tam sayı. Hiç soru yoksa sıfır — bölme hatası değil. */
export function isabetOrani(dogru: number, yanlis: number): number {
  const toplam = dogru + yanlis
  if (toplam === 0) return 0
  return Math.round((dogru / toplam) * 100)
}

/**
 * Geçen süre `d:ss` biçiminde. Saat basamağı yok: bir yoklama yirmi soru ve
 * saati aşan bir süre, sayacın değil unutulmuş bir ekranın ölçüsü — yine de
 * taşmıyor, dakika büyümeye devam ediyor.
 */
export function sureYaz(ms: number): string {
  const saniye = Math.max(0, Math.round(ms / 1000))
  const dakika = Math.floor(saniye / 60)
  return `${dakika}:${String(saniye % 60).padStart(2, '0')}`
}
