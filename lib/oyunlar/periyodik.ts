/**
 * Periyodik Tablo Avı'na özgü kısım: soru tipi seçimi ve çeldiriciler.
 *
 * Havuz `periyodik-havuzu.ts` içinde, tur sırası ve boss yerleşimi `ritim.ts`
 * içinde; burada yalnızca "bu element nasıl sorulur" kararı duruyor. Harita
 * Avı'ndaki (`harita.ts`) ayrımın aynısı.
 */

import {
  ELEMENTLER,
  SINIF_ADI,
  sinifSorulurMu,
  type Element,
  type ElementSinifi,
} from './periyodik-havuzu'
import { karistir, sec } from './tur'

/**
 * Soru tipi.
 *
 * - `bul`: adı verilir, oyuncu tabloda hücreye dokunur. Konumu bilmeyen
 *   bulamıyor; şıktan elenecek bir şey yok.
 * - `sec`: hücre yanıp söner, oyuncu dört addan doğrusunu seçer.
 * - `sinif`: hücre yanıp söner, oyuncu ailesini seçer (alkali, halojen…).
 *
 * Üçü ayrı beceri: biri yeri, biri sembolü, biri tablonun **anlamını**
 * ölçüyor. TYT'de sorulan çoğunlukla üçüncüsü, ama ilk ikisi olmadan üçüncüsü
 * ezberden ibaret kalıyor.
 */
export type PeriyodikTipi = 'bul' | 'sec' | 'sinif'

export const SIK_SAYISI = 4

export type PeriyodikSorusu = {
  tip: PeriyodikTipi
  element: Element
  /** `sec`'te dört element adı, `sinif`'ta dört sınıf adı; `bul`'da boş. */
  siklar: string[]
}

/** Sembolden elementi bulur — banka kayıtları yalnızca sembolü saklıyor. */
export function elementBul(sembol: string): Element | undefined {
  return ELEMENTLER.find((e) => e.sembol === sembol)
}

/** Tablodaki uzaklık — sütun ve satır farkı, ızgara birimiyle. */
function uzaklik(a: Element, b: Element): number {
  return Math.hypot(a.grup - b.grup, a.periyot - b.periyot)
}

/**
 * Tabloda en yakın elementler — çeldiriciler buradan.
 *
 * Rastgele element seçmek soruyu anlamsız kolaylaştırırdı: işaretli hücre 2.
 * periyotta dururken şıklara Altın konsaydı, tabloya bakmadan elenirdi. Komşu
 * hücreler ise gerçekten karıştırılan elementlerdir — aynı gruptakiler benzer
 * davranıyor, aynı periyottakiler yan yana duruyor.
 */
export function enYakinlar(
  element: Element,
  adet: number,
  havuz: readonly Element[] = ELEMENTLER,
): Element[] {
  return havuz
    .filter((e) => e.sembol !== element.sembol)
    .sort((a, b) => uzaklik(element, a) - uzaklik(element, b))
    .slice(0, adet)
}

export function siklariKur(
  element: Element,
  rastgele: () => number = Math.random,
  havuz: readonly Element[] = ELEMENTLER,
): string[] {
  const celdiriciler = enYakinlar(element, SIK_SAYISI - 1, havuz)
  return karistir([element, ...celdiriciler], rastgele).map((e) => e.ad)
}

/**
 * Sınıf sorusunun şıkları.
 *
 * Çeldiriciler öteki ailelerden rastgele seçiliyor ama `metal` hiç girmiyor:
 * doğru cevabı "Toprak alkali metal" olan bir soruda "Metal" şıkkı da doğru
 * olurdu (`periyodik-havuzu.ts`).
 */
export function sinifSiklariKur(
  element: Element,
  rastgele: () => number = Math.random,
): string[] {
  const oteki = (Object.keys(SINIF_ADI) as ElementSinifi[]).filter(
    (s) => s !== element.sinif && s !== 'metal',
  )
  const celdiriciler = karistir(oteki, rastgele).slice(0, SIK_SAYISI - 1)
  return karistir([element.sinif, ...celdiriciler], rastgele).map((s) => SINIF_ADI[s])
}

/**
 * Tipi verilmiş soru.
 *
 * Banka turu bunu çağırıyor: kayıtta soru tipi duruyor (`banka.ts`) ve
 * şıkların o tiple uyuşması gerekiyor — "ailesi hangisi" sorusunun altında
 * element adları dururdu. Şıklar kayıtta **durmuyor**, her seferinde yeniden
 * kuruluyor: ezberlenmiş bir şık dizilimi soruyu cevaplamadan geçirtirdi.
 */
export function tipteSoruKur(
  element: Element,
  tip: PeriyodikTipi,
  rastgele: () => number = Math.random,
  havuz: readonly Element[] = ELEMENTLER,
): PeriyodikSorusu {
  return {
    tip,
    element,
    siklar:
      tip === 'sec'
        ? siklariKur(element, rastgele, havuz)
        : tip === 'sinif'
          ? sinifSiklariKur(element, rastgele)
          : [],
  }
}

/**
 * Bir elementi soruya çevirir.
 *
 * Üç tip eşit ağırlıkta gelmiyor: `metal` etiketli elementlerin sınıfı
 * sorulamıyor ve onlarda seçim ikiye düşüyor.
 */
export function soruKur(
  element: Element,
  rastgele: () => number = Math.random,
  havuz: readonly Element[] = ELEMENTLER,
): PeriyodikSorusu {
  const tipler: PeriyodikTipi[] = sinifSorulurMu(element)
    ? ['bul', 'sec', 'sinif']
    : ['bul', 'sec']
  return tipteSoruKur(element, sec(tipler, rastgele), rastgele, havuz)
}

/** Sorunun doğru cevabı — `sec` ve `sinif` şıklarında aranan metin. */
export function dogruCevap(soru: PeriyodikSorusu): string {
  return soru.tip === 'sinif' ? SINIF_ADI[soru.element.sinif] : soru.element.ad
}
