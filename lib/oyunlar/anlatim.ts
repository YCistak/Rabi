import type { AnlatimSorusu, BozuklukTuru } from './anlatim-havuzu'
import { ANLATIM_HAVUZU, BOZUKLUK_ADI } from './anlatim-havuzu'
import {
  SIK_SAYISI,
  turHazirla as coktanSecmeliTur,
  type CoktanSecmeliSoru,
  type Sik,
} from './coktan-secmeli'

/**
 * Anlatım Bozukluğu'na özgü kısım. Şık kurma ve tur sırası `coktan-secmeli.ts`
 * içinde; burada yalnız hangi havuzdan, hangi seçenek kümesinden çekildiği
 * duruyor.
 */

export { SIK_SAYISI }

export type AnlatimSikki = Sik<BozuklukTuru>
export type AnlatimOyunSorusu = CoktanSecmeliSoru<AnlatimSorusu, BozuklukTuru>

/** Havuzda geçen bütün bozukluk türleri — çeldiriciler buradan seçiliyor. */
export const BOZUKLUKLAR = Object.keys(BOZUKLUK_ADI) as BozuklukTuru[]

export function turHazirla(
  havuz: readonly AnlatimSorusu[] = ANLATIM_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): AnlatimOyunSorusu[] {
  return coktanSecmeliTur(
    havuz,
    (s) => s.tur,
    BOZUKLUKLAR,
    (t) => BOZUKLUK_ADI[t],
    rastgele,
    undefined,
    karistirilsin,
  )
}
