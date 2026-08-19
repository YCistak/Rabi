import type { OgeSorusu, OgeTuru } from './oge-havuzu'
import { OGE_ADI, OGE_HAVUZU } from './oge-havuzu'
import {
  SIK_SAYISI,
  turHazirla as coktanSecmeliTur,
  type CoktanSecmeliSoru,
  type Sik,
} from './coktan-secmeli'

/**
 * Cümlenin Ögeleri'ne özgü kısım. Şık kurma ve tur sırası `coktan-secmeli.ts`
 * içinde; burada yalnız hangi havuzdan, hangi seçenek kümesinden çekildiği
 * duruyor.
 */

export { SIK_SAYISI }

export type OgeSikki = Sik<OgeTuru>
export type OgeOyunSorusu = CoktanSecmeliSoru<OgeSorusu, OgeTuru>

/** Bütün öge türleri — çeldiriciler buradan seçiliyor. */
export const OGE_TURLERI = Object.keys(OGE_ADI) as OgeTuru[]

/** Cümlenin vurgusuz, düz hâli — banka listesinde ve testlerde kullanılıyor. */
export function cumleMetni(soru: OgeSorusu): string {
  return `${soru.once}${soru.oge}${soru.sonra}`
}

export function turHazirla(
  havuz: readonly OgeSorusu[] = OGE_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): OgeOyunSorusu[] {
  return coktanSecmeliTur(havuz, (s) => s.tur, OGE_TURLERI, (t) => OGE_ADI[t], rastgele, undefined, karistirilsin)
}
