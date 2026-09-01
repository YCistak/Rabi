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
 * İpuçları sorunun **ilk yarısında** tükeniyor.
 *
 * Bir süre soru süresinin tamamına yayılıyorlardı: üçüncü ipucu tam süre
 * dolarken geliyordu, yani gördüğü an oyuncunun cevaplayacak vakti kalmıyordu
 * ve bekleme "oyun donmuş" gibi duruyordu. Şimdi son ipucu sürenin yarısında
 * açılıyor; kalan yarı kararı vermeye ayrılıyor.
 *
 * Oran olarak duruyor, sabit saniye olarak değil: boss sorusunda süre uzuyor
 * ve sabit aralık orada da aynı sorunu geri getirirdi.
 */
const IPUCU_PAYI = 0.5

/**
 * Şu an kaçıncı ipucu görünüyor: 1, 2 ya da `IPUCU_SAYISI`.
 *
 * İpuçları soru süresinin `IPUCU_PAYI` kadarını eşit üçe bölüyor, sabit
 * saniyeye değil: boss sorusunda süre uzuyor ve sabit aralık kalsaydı ipuçları
 * turdan tura farklı hızda gelirdi.
 *
 * Geçen süreyi besleyen saat **turun sayacı değil** (`oyun-hucre.tsx`,
 * `useAcikIpucu`): Sıradan ve Turbo'da saat tura ait, Rahat'ta hiç yok. İkisi
 * karıştırıldığında kart tur boyunca tek ipucunda donuyordu.
 */
export function gorunenIpucu(gecenSaniye: number, toplamSure: number): number {
  if (toplamSure <= 0) return IPUCU_SAYISI
  const aralik = (toplamSure * IPUCU_PAYI) / IPUCU_SAYISI
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
