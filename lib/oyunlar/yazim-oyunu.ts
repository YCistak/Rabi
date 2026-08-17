import type { YazimSorusu } from './yazim-havuzu'
import { YAZIM_HAVUZU } from './yazim-havuzu'
import { karistir } from './tur'

/**
 * Yazım Ustası'na özgü mantık. Süre, ceza, rekor gibi bütün oyunlarda ortak
 * olan her şey `tur.ts` içinde.
 */

export type Sik = {
  metin: string
  dogruMu: boolean
}

/** Ekrana gelen tek soru: kaynak çift + karıştırılmış iki şık. */
export type OyunSorusu = {
  soru: YazimSorusu
  siklar: [Sik, Sik]
}

/**
 * Bir turun soru sırası.
 *
 * Havuz baştan bir kez karıştırılıp sırayla tüketiliyor; her soruda rastgele
 * çekilseydi aynı kelime tur içinde iki kez çıkabilirdi. Doğru şıkkın hangi
 * tarafa düşeceği de her soruda ayrıca atılıyor — sabit olsaydı oyuncu birkaç
 * soruda konumu ezberler, kelimeye bakmayı bırakırdı.
 */
export function turHazirla(
  havuz: readonly YazimSorusu[] = YAZIM_HAVUZU,
  rastgele: () => number = Math.random,
): OyunSorusu[] {
  return karistir(havuz, rastgele).map((soru) => {
    const dogruSik: Sik = { metin: soru.dogru, dogruMu: true }
    const yanlisSik: Sik = { metin: soru.yanlis, dogruMu: false }
    const siklar: [Sik, Sik] =
      rastgele() < 0.5 ? [dogruSik, yanlisSik] : [yanlisSik, dogruSik]
    return { soru, siklar }
  })
}
