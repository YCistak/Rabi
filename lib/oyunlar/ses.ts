import type { SesOlayi, SesSorusu } from './ses-havuzu'
import { OLAY_ADI, SES_HAVUZU } from './ses-havuzu'
import { karistir } from './tur'

/**
 * Ses Olayları'na özgü mantık. Süre, ceza, rekor gibi bütün oyunlarda ortak
 * olan her şey `tur.ts` içinde.
 */

/** Bir soruda gösterilen şık sayısı. */
export const SIK_SAYISI = 4

export type SesSikki = {
  olay: SesOlayi
  metin: string
  dogruMu: boolean
}

/** Ekrana gelen tek soru: kaynak sözcük + karıştırılmış dört şık. */
export type SesOyunSorusu = {
  soru: SesSorusu
  siklar: SesSikki[]
}

/** Havuzda geçen bütün ses olayları — çeldiriciler buradan seçiliyor. */
export const OLAYLAR = Object.keys(OLAY_ADI) as SesOlayi[]

/**
 * Bir sorunun şıkları: doğru olay + üç çeldirici.
 *
 * Çeldiriciler **rastgele** seçiliyor ama sabit bir sırayla dizilmiyor: doğru
 * şık hep aynı yerde olsaydı oyuncu birkaç soruda konumu ezberler, sözcüğe
 * bakmayı bırakırdı.
 */
export function siklariKur(
  soru: SesSorusu,
  rastgele: () => number = Math.random,
): SesSikki[] {
  const celdiriciler = karistir(
    OLAYLAR.filter((o) => o !== soru.olay),
    rastgele,
  ).slice(0, SIK_SAYISI - 1)

  return karistir([soru.olay, ...celdiriciler], rastgele).map((olay) => ({
    olay,
    metin: OLAY_ADI[olay],
    dogruMu: olay === soru.olay,
  }))
}

/**
 * Bir turun soru sırası.
 *
 * Havuz baştan bir kez karıştırılıp sırayla tüketiliyor; her soruda rastgele
 * çekilseydi aynı sözcük tur içinde iki kez çıkabilirdi.
 */
export function turHazirla(
  havuz: readonly SesSorusu[] = SES_HAVUZU,
  rastgele: () => number = Math.random,
): SesOyunSorusu[] {
  return karistir(havuz, rastgele).map((soru) => ({
    soru,
    siklar: siklariKur(soru, rastgele),
  }))
}
