import { karistir } from './tur'
import { SIK_SAYISI, type Sik } from './coktan-secmeli'
import type { Zorluk } from './ritim'

/**
 * Biyolojinin çoktan seçmeli oyunlarının ortak mantığı.
 *
 * "Ortak Özellikler" ile "Canlıları Sınıflandır" aynı işi yapıyor: bir soru
 * gösterip dört şıktan doğrusunu seçtiriyor. İkisi de tek bir ekran bileşenini
 * paylaşıyor, burası da onların ortak veri şekli.
 *
 * `coktan-secmeli.ts` burada kullanılmıyor, çünkü orada seçenek kümesi
 * **sabit**: şıklar bütün olası cevaplardan çekiliyor (ses olayları, cümlenin
 * ögeleri gibi kapalı listeler). Biyolojide böyle bir liste yok — "canlıların
 * ortak özelliği değildir" sorusunun çeldiricileri sorunun kendisine ait,
 * başka bir sorunun şıkkı olamaz. O yüzden çeldiriciler havuzda soruyla
 * birlikte yazılıyor.
 */

export { SIK_SAYISI }

export type BiyolojiSorusu = {
  /** Ekranda okunan soru cümlesi. */
  soru: string
  dogru: string
  /**
   * Üç çeldirici.
   *
   * Sayısı tipte sabit: ikisi yazılıp üçüncüsü unutulsaydı o soruda üç şık
   * çıkar ve doğruyu bulma şansı sessizce artardı.
   */
  celdiriciler: [string, string, string]
  /** Tur sonunda yanlışın altında görünen kısa öğretici not. */
  aciklama: string
  zorluk: Zorluk
}

export type BiyolojiSikki = Sik<string>
export type BiyolojiOyunSorusu = { soru: BiyolojiSorusu; siklar: BiyolojiSikki[] }

/**
 * Havuz satırlarını okunur tutan kısayol.
 *
 * Alanlar tek tek yazılsaydı her soru altı satır tutardı ve havuzu gözden
 * geçirmek — asıl yapılacak iş bu — imkânsızlaşırdı. Zorluk başta duruyor
 * çünkü havuzu tararken en çok bakılan alan o.
 */
export function soruKur(
  zorluk: Zorluk,
  soru: string,
  dogru: string,
  celdiriciler: [string, string, string],
  aciklama: string,
): BiyolojiSorusu {
  return { soru, dogru, celdiriciler, aciklama, zorluk }
}

/**
 * Bir sorunun şıkları.
 *
 * Dizilim her soruda yeniden atılıyor: doğru şık hep aynı yerde olsaydı oyuncu
 * birkaç soruda konumu ezberler, soruyu okumayı bırakırdı.
 */
export function siklariKur(
  soru: BiyolojiSorusu,
  rastgele: () => number = Math.random,
): BiyolojiSikki[] {
  return karistir([soru.dogru, ...soru.celdiriciler], rastgele).map((metin) => ({
    deger: metin,
    metin,
    dogruMu: metin === soru.dogru,
  }))
}

/**
 * Turun soruları.
 *
 * `karistirilsin` yalnızca sıra **dışarıda** kurulduğunda kapatılıyor:
 * `ritim.ts` boss sorularını belirli konumlara yerleştiriyor, burada yeniden
 * karıştırmak o yerleşimi bozardı.
 */
export function turHazirla(
  havuz: readonly BiyolojiSorusu[],
  rastgele: () => number = Math.random,
  karistirilsin = true,
): BiyolojiOyunSorusu[] {
  const sira = karistirilsin ? karistir(havuz, rastgele) : havuz
  return sira.map((soru) => ({ soru, siklar: siklariKur(soru, rastgele) }))
}
