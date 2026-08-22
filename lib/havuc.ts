/**
 * Havucun seviye dışındaki akışları — saf mantık.
 *
 * `lib/seviye.ts` ekonominin omurgası: havuç orada seviye atlayarak kazanılıyor
 * ve mağazada harcanıyor. Burası iki tane daha ekliyor, ikisi de bilerek dar:
 *
 * - **Odak cezası.** Pomodoro sırasında odak kilidini kıran kullanıcıdan havuç
 *   gidiyor. Sebebi kilidin kendisi: bedeli olmayan bir engel engel değil.
 *   Kilit zaten "kapat" düğmesiyle kırılabiliyor (kırılamaz olsaydı telefonun
 *   sahibi kendi telefonunda mahsur kalırdı), dolayısıyla caydırıcılığı
 *   ödemesi gereken şey bedel.
 * - **Banka ödülü.** Oyun Bankası'ndan düşen soru havuç getiriyor. Bankadan bir
 *   soru düşürmek, o soruyu **üst üste üç kez** doğru bilmek demek; uygulamadaki
 *   en zor uydurulan ölçü bu ve ödülü hak ediyor.
 *
 * ## Neden ikisinin de tavanı var
 *
 * Joker fiyatları ömür boyu kazanılabilecek toplam havuca (`TOPLAM_HAVUC`) göre
 * konuldu. Tavansız bir kaynak o oranı bozar: bankaya bilerek yanlış düşürüp
 * sonra düzelten biri sınırsız havuç basabilirdi — yavaş ama sınırsız, ve
 * mağazayı anlamsız kılmaya yavaş olması engel değil. Ceza tarafında tavan
 * bakiyenin kendisi: eksiye düşen bir bakiye "borçlu" bir oyuncu demek olurdu
 * ve borç bu uygulamanın öğretmek istediği şey değil.
 */

import { TOPLAM_HAVUC } from './seviye'

/**
 * Odak kilidini kırmanın bedeli.
 *
 * Katalogdaki **en ucuz jokerin** fiyatı (`lib/magaza/jokerler.ts`): "kilidi
 * kırdın, bir Ek Süre jokeri gitti" diye okunabilen bir sayı. Elle yazılı çünkü
 * ters yönde bir import döngüsü açardı; ikisinin eşit kaldığını `havuc.test.ts`
 * denetliyor.
 *
 * Daha küçüğü fark edilmez. Daha büyüğü kilidi **denemekten** caydırırdı, oysa
 * caydırılması istenen şey kırmak. Bakiyesi yetmeyenden yetmediği kadarı
 * gidiyor (`cezaDus`) — borç yok.
 */
export const ODAK_CEZASI = 120

/**
 * Bankadan düşen soru başına havuç.
 *
 * Sekiz soru bir Ek Süre jokeri ediyor: tek başına gelir kaynağı değil ama
 * bankayı boşaltmanın gözle görülür bir karşılığı var.
 */
export const BANKA_ODULU = 15

/** Ödülün verildiği en fazla soru. */
export const ODULLU_SORU = 40

/**
 * Banka ödülünün ömür boyu tavanı.
 *
 * Sayı yukarıdan geliyor: çantayı her jokerden dokuzar tane doldurmak ömür boyu
 * kazanılan havucun **üstünde** kalmalı (`jokerler.test.ts` içindeki denge
 * testi). Seviye ödülleriyle katalog tutarı arasındaki boşluk dar; banka ödülü
 * o boşluğun yarısından fazlasını almıyor. Tavanı büyütmek istersen önce o
 * testi oku, sayıyı büyütüp testi güncelleyerek geçme.
 */
export const BANKA_ODUL_TAVANI = BANKA_ODULU * ODULLU_SORU

/**
 * Bakiyeden ceza düşer.
 *
 * Gerçekten düşen miktarı da döndürüyor: bakiyesi 10 olan kullanıcıya "40 havuç
 * gitti" demek yalan olurdu. Bakiye eksiye inmiyor.
 */
export function cezaDus(havuc: number, ceza: number): { havuc: number; dusen: number } {
  const mevcut = Math.max(0, Math.floor(havuc))
  const dusen = Math.min(mevcut, Math.max(0, Math.floor(ceza)))
  return { havuc: mevcut - dusen, dusen }
}

/**
 * Bankadan düşen sorunun getirdiği havuç.
 *
 * Aralık olarak hesaplanıyor, `birikenOdul` gibi: ödenmiş miktarı ayrı bir
 * sayaçta tutmak yerine, zaten var olan "şimdiye kadar düşen toplam soru"
 * sayacının iki hâli arasındaki farktan çıkıyor. Böylece tavan tek yerde
 * uygulanıyor ve aynı soru ikinci kez ödenemiyor.
 *
 * Geriye dönük ödeme **yok**: sistem açılmadan önce düşürülmüş sorular
 * ödenmiyor, çünkü `oncekiDusen` her zaman kayıttaki güncel sayaç. Seviyenin
 * tersi (orası geçmişi ödüyor) ama sebebi aynı yerden geliyor — seviye veriden
 * türetiliyor, bu sayaç ise akış hâlinde birikiyor.
 */
export function bankaOdulu(oncekiDusen: number, yeniDusen: number): number {
  // Sayaç geriye gidemez ama yedek geri yüklenince küçülebilir; eksi ödül
  // bakiyeden havuç götürürdü.
  return Math.max(0, odenen(yeniDusen) - odenen(oncekiDusen))
}

function odenen(dusen: number): number {
  return Math.min(BANKA_ODUL_TAVANI, Math.max(0, Math.floor(dusen)) * BANKA_ODULU)
}

/**
 * Ömür boyu kazanılabilecek toplam havuç — seviye ödülleri ve banka ödülü.
 *
 * Mağaza dengesi buna bakıyor; `lib/magaza/jokerler.test.ts` fiyatların bu
 * toplama oranını denetliyor.
 */
export const TOPLAM_KAZANC = TOPLAM_HAVUC + BANKA_ODUL_TAVANI
