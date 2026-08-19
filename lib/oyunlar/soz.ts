import type { SozSorusu } from './soz-havuzu'
import { SOZ_HAVUZU } from './soz-havuzu'
import {
  SIK_SAYISI,
  turHazirla as coktanSecmeliTur,
  type CoktanSecmeliSoru,
  type Sik,
} from './coktan-secmeli'

/**
 * Deyim ve Atasözü'ne özgü kısım.
 *
 * Diğer çoktan seçmeli oyunlardan bir farkı var: şıklar sabit bir listeden
 * değil, havuzun kendisinden geliyor — çeldiriciler başka sözlerin anlamları.
 * Bu yüzden "farklı konudan olsun" kuralı geçiliyor; iki eşanlamlı deyim aynı
 * soruda karşılaşırsa iki şık birden doğru olurdu.
 */

export { SIK_SAYISI }

export type SozSikki = Sik<SozSorusu>
export type SozOyunSorusu = CoktanSecmeliSoru<SozSorusu, SozSorusu>

/** Çeldirici kuralı: doğru cevapla aynı konudan bir söz şık olamaz. */
export function celdiriciUygunMu(aday: SozSorusu, dogru: SozSorusu): boolean {
  return aday.konu !== dogru.konu
}

export function turHazirla(
  havuz: readonly SozSorusu[] = SOZ_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): SozOyunSorusu[] {
  // Çeldiriciler her zaman **tam havuzdan** çekiliyor, turun havuzundan değil:
  // banka turunda elde iki soru olabiliyor ve o iki sorudan dört şık çıkmaz.
  return coktanSecmeliTur(
    havuz,
    (s) => s,
    SOZ_HAVUZU,
    (s) => s.anlam,
    rastgele,
    celdiriciUygunMu,
    karistirilsin,
  )
}
