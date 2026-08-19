/**
 * Harita Avı'na özgü kısım: soru tipi seçimi ve çeldiriciler.
 *
 * Havuz `harita-havuzu.ts` içinde, tur sırası ve boss yerleşimi `ritim.ts`
 * içinde; burada yalnızca "bu il nasıl sorulur" kararı duruyor.
 */

import { BULUNABILIR_ALAN, ILLER, type Il } from './harita-havuzu'
import { karistir } from './tur'

/**
 * Soru tipi.
 *
 * - `bul`: adı verilir, oyuncu haritada ile dokunur. Asıl zor olan yön —
 *   yerini bilmeden bulunamıyor, şıktan elenemiyor.
 * - `sec`: il haritada yanıp söner, oyuncu dört addan doğrusunu seçer.
 */
export type HaritaTipi = 'bul' | 'sec'

export const SIK_SAYISI = 4

export type HaritaSorusu = {
  tip: HaritaTipi
  il: Il
  /** `sec` tipinde dört il adı (karışık sırayla); `bul` tipinde boş. */
  siklar: string[]
}

/** Adından ili bulur — banka kayıtları yalnızca adı saklıyor. */
export function ilBul(ad: string): Il | undefined {
  return ILLER.find((il) => il.ad === ad)
}

function uzaklik(a: Il, b: Il): number {
  return Math.hypot(a.merkez[0] - b.merkez[0], a.merkez[1] - b.merkez[1])
}

/**
 * En yakın iller — çeldiriciler buradan.
 *
 * Rastgele il seçmek soruyu anlamsız kolaylaştırırdı: Kırşehir sorulup şıklara
 * Edirne konsaydı, haritaya bakmadan elenebilirdi. Komşular ise gerçekten
 * karıştırılan illerdir.
 */
export function enYakinlar(il: Il, adet: number, havuz: readonly Il[] = ILLER): Il[] {
  return havuz
    .filter((a) => a.ad !== il.ad)
    .sort((a, b) => uzaklik(il, a) - uzaklik(il, b))
    .slice(0, adet)
}

export function siklariKur(
  il: Il,
  rastgele: () => number = Math.random,
  havuz: readonly Il[] = ILLER,
): string[] {
  const celdiriciler = enYakinlar(il, SIK_SAYISI - 1, havuz)
  return karistir([il, ...celdiriciler], rastgele).map((a) => a.ad)
}

/**
 * Bir ili soruya çevirir.
 *
 * Küçük iller `bul` olarak sorulmuyor: telefonda birkaç piksel kalıyorlar ve
 * orada dokunmak beceri değil şans olurdu. Onlar işaretlenip adı soruluyor —
 * zaten gerçekçi beceri de bu: Yalova'yı ekranda göstermek değil, gösterilince
 * tanımak.
 */
export function soruKur(
  il: Il,
  rastgele: () => number = Math.random,
  havuz: readonly Il[] = ILLER,
): HaritaSorusu {
  const bulunabilir = il.alan >= BULUNABILIR_ALAN
  const tip: HaritaTipi = bulunabilir && rastgele() < 0.5 ? 'bul' : 'sec'
  return {
    tip,
    il,
    siklar: tip === 'sec' ? siklariKur(il, rastgele, havuz) : [],
  }
}
