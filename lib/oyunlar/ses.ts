import type { SesOlayi, SesSorusu } from './ses-havuzu'
import { OLAY_ADI, SES_HAVUZU } from './ses-havuzu'
import {
  SIK_SAYISI,
  turHazirla as coktanSecmeliTur,
  type CoktanSecmeliSoru,
  type Sik,
} from './coktan-secmeli'

/**
 * Ses Olayları'na özgü kısım. Şık kurma ve tur sırası `coktan-secmeli.ts`
 * içinde; burada yalnız hangi havuzdan, hangi seçenek kümesinden çekildiği
 * duruyor.
 */

export { SIK_SAYISI }

export type SesSikki = Sik<SesOlayi>
export type SesOyunSorusu = CoktanSecmeliSoru<SesSorusu, SesOlayi>

/** Havuzda geçen bütün ses olayları — çeldiriciler buradan seçiliyor. */
export const OLAYLAR = Object.keys(OLAY_ADI) as SesOlayi[]

export function siklariKur(soru: SesSorusu, rastgele: () => number = Math.random): SesSikki[] {
  return coktanSecmeliTur([soru], (s) => s.olay, OLAYLAR, (o) => OLAY_ADI[o], rastgele)[0].siklar
}

export function turHazirla(
  havuz: readonly SesSorusu[] = SES_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): SesOyunSorusu[] {
  return coktanSecmeliTur(havuz, (s) => s.olay, OLAYLAR, (o) => OLAY_ADI[o], rastgele, undefined, karistirilsin)
}
