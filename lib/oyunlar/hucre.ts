import type { OrganelSorusu } from './hucre-havuzu'
import { HUCRE_HAVUZU } from './hucre-havuzu'
import { siklariKur as coktanSecmeliSik, SIK_SAYISI, type Sik } from './coktan-secmeli'
import { karistir } from './tur'

/**
 * Organel Kartı'nın puan mantığı.
 *
 * Öteki oyunlarda bir soru ya doğru ya yanlış; burada **ne zaman** bilindiği de
 * sayılıyor. Kartın arkasındaki organel üç ipucuyla açılıyor ve her ipucu
 * cevabı bir adım kolaylaştırdığı için puanı bir azaltıyor: birinci ipucuyla
 * bilmek 3, ikinciyle 2, üçüncüyle 1 puan. Süre dolarsa puan yok.
 *
 * Puan tur içinde duruyor, kalıcı istatistiğe yazılmıyor: rekor bütün
 * oyunlarda "kaç doğru" demek ve tek bir oyunun kendi puanıyla rekor tutması
 * o karşılaştırmayı bozardı. (`lib/oyunlar/tur.ts`)
 */

export { SIK_SAYISI }

/** Kartın açtığı en fazla ipucu. */
export const IPUCU_SAYISI = 3

export type HucreSikki = Sik<string>
export type HucreOyunSorusu = { soru: OrganelSorusu; siklar: HucreSikki[] }

/** Şıklarda kullanılan bütün organel adları — çeldiriciler buradan seçiliyor. */
export const ORGANELLER = HUCRE_HAVUZU.map((s) => s.organel)

/**
 * Şu an kaçıncı ipucu görünüyor: 1, 2 ya da `IPUCU_SAYISI`.
 *
 * İpuçları soru süresini eşit üçe bölüyor, sabit üç saniyeye değil: boss
 * sorusunda süre uzuyor ve sabit aralık kalsaydı üç ipucu da ilk yarıda
 * açılır, kalan yarı boş geçerdi. Normal soruda süre 9 saniye olduğu için
 * aralık yine üç saniye.
 */
export function gorunenIpucu(gecenSaniye: number, toplamSure: number): number {
  if (toplamSure <= 0) return IPUCU_SAYISI
  const aralik = toplamSure / IPUCU_SAYISI
  const sira = Math.floor(gecenSaniye / aralik) + 1
  return Math.min(IPUCU_SAYISI, Math.max(1, sira))
}

/**
 * Kaçıncı ipucunda bilindiyse kaç puan.
 *
 * Erken bilmek pahalıdır: ilk ipucu tek başına birkaç organele birden uyar,
 * oradan cevabı çıkarmak gerçekten bilmeyi gerektirir.
 */
export function ipucuPuani(gorunen: number): number {
  return Math.max(0, IPUCU_SAYISI + 1 - gorunen)
}

/** Bir sorunun şıkları: doğru organel + üç çeldirici, karışık sırada. */
export function siklariKur(
  soru: OrganelSorusu,
  rastgele: () => number = Math.random,
): HucreSikki[] {
  return coktanSecmeliSik(soru.organel, ORGANELLER, (ad) => ad, rastgele)
}

/**
 * Turun soruları.
 *
 * `karistirilsin` yalnızca sıra **dışarıda** kurulduğunda kapatılıyor:
 * `ritim.ts` boss sorularını belirli konumlara yerleştiriyor, burada yeniden
 * karıştırmak o yerleşimi bozardı.
 */
export function turHazirla(
  havuz: readonly OrganelSorusu[] = HUCRE_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): HucreOyunSorusu[] {
  const sira = karistirilsin ? karistir(havuz, rastgele) : havuz
  return sira.map((soru) => ({ soru, siklar: siklariKur(soru, rastgele) }))
}
