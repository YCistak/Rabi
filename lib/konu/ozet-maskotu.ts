import type { MaskotPozu } from '@/components/maskot/rabi'

/**
 * Konu özetinin tepesindeki Rabi — her açılışta bu üçünden biri.
 *
 * Yalnız kutlayan pozlar (kullanıcı istedi: ekrana uymayan tavşan seçilmesin):
 * kollarını açan, zıplayan ve kupayı kaldıran. El sallayan bir selam, kitaplı
 * olan okumaya devam ediyor, düşünen ve kahveli olan bitmiş bir konuyu
 * kutlamıyor; o yüzden listede yoklar.
 */
export const OZET_POZLARI = ['sevinen', 'ziplayan', 'kupali'] as const satisfies readonly MaskotPozu[]

export type OzetPozu = (typeof OZET_POZLARI)[number]

/**
 * Rastgele bir poz; bir öncekiyle aynı olmaz — art arda iki konu bitiren
 * kullanıcı aynı tavşanı görürse seçim rastgele değil sabit sanılır.
 * `rastgele` [0, 1) arası bir sayı (testte sabitlenir).
 */
export function ozetPozuSec(onceki: OzetPozu | null, rastgele: number = Math.random()): OzetPozu {
  const adaylar = OZET_POZLARI.filter((p) => p !== onceki)
  return adaylar[Math.min(adaylar.length - 1, Math.floor(rastgele * adaylar.length))]
}
