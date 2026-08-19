import { arasinda, sec } from './tur'

/**
 * Bölünebilme Kuralları oyununun soru üreteci.
 *
 * İki soru tipi bir arada:
 * - **bölünür mü** → Evet / Hayır (2'den 10'a bütün bölenler),
 * - **kalan kaç**  → tuş takımından tek rakam.
 *
 * Sorular havuzdan değil üretiliyor: dört-beş basamaklı sayı ile bölenin bütün
 * ikilileri milyonlarca soru eder, listelemenin anlamı olmazdı.
 *
 * Sayılar rastgele seçilmiyor, **cevaba göre kuruluyor**. Rastgele bir sayı
 * 7'ye yedide bir bölünür; "7'ye bölünür mü" sorularının %86'sında cevap Hayır
 * olurdu ve hep Hayır diyen oyuncu kural öğrenmeden kazanırdı. Önce cevap
 * (bölünsün mü, kalan kaç olsun) seçiliyor, sayı ona göre üretiliyor.
 */

export type BolunmeTipi = 'bolunur' | 'kalan'

export type BolunmeSorusu = {
  tip: BolunmeTipi
  sayi: number
  bolen: number
}

/** Sorulabilecek bütün bölenler — 2 ve 10 dahil. */
export const TUM_BOLENLER = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const

/**
 * "Kalan kaç" sorulabilen bölenler.
 *
 * 6 ve 7 dışarıda: kuralları sayının bölünüp bölünmediğini söylüyor ama
 * **kalanı vermiyor**. 7'nin kuralı (son rakamın iki katını çıkar) kalanı
 * bozuyor, 6'nınki iki ayrı kalandan birleştirme istiyor. Öğrencinin
 * kalanı bulmak için elden bölme yapması gerekirdi; oyun bunu sormuyor.
 * Diğer yedi bölende kural zaten kalanı da veriyor: rakam toplamının 3'e
 * bölümünden kalan, sayının 3'e bölümünden kalandır.
 */
export const KALAN_BOLENLERI = [2, 3, 4, 5, 8, 9, 10] as const

/** Sayının basamak aralığı — dört ya da beş basamak. */
export const EN_KUCUK_SAYI = 1000
export const EN_BUYUK_SAYI = 99999

/** Kuralın kendisi: tanıtımda ve tur sonunda görünüyor. */
export const BOLEN_KURALI: Record<number, string> = {
  2: 'Son rakam çiftse (0, 2, 4, 6, 8) sayı 2’ye bölünür.',
  3: 'Rakamlar toplamı 3’e bölünüyorsa sayı da 3’e bölünür.',
  4: 'Son iki hane 4’e bölünüyorsa sayı da 4’e bölünür.',
  5: 'Son rakam 0 ya da 5 ise sayı 5’e bölünür.',
  6: 'Sayı hem 2’ye hem 3’e bölünüyorsa 6’ya da bölünür.',
  7: 'Son rakamı at, iki katını kalan sayıdan çıkar. Sonuç 7’ye bölünüyorsa sayı da bölünür.',
  8: 'Son üç hane 8’e bölünüyorsa sayı da 8’e bölünür.',
  9: 'Rakamlar toplamı 9’a bölünüyorsa sayı da 9’a bölünür.',
  10: 'Son rakam 0 ise sayı 10’a bölünür.',
}

/** Kuralın kalanı da verdiği bölenlerde, kalanın nereden okunacağı. */
export const KALAN_KURALI: Record<number, string> = {
  2: 'Son rakamın 2’ye bölümünden kalan, sayının da kalanıdır.',
  3: 'Rakamlar toplamının 3’e bölümünden kalan, sayının da kalanıdır.',
  4: 'Son iki hanenin 4’e bölümünden kalan, sayının da kalanıdır.',
  5: 'Son rakamın 5’e bölümünden kalan, sayının da kalanıdır.',
  8: 'Son üç hanenin 8’e bölümünden kalan, sayının da kalanıdır.',
  9: 'Rakamlar toplamının 9’a bölümünden kalan, sayının da kalanıdır.',
  10: 'Son rakamın kendisi, sayının 10’a bölümünden kalandır.',
}

/** Rakamlar toplamı: 4536 → 18. */
export function rakamToplami(sayi: number): number {
  return String(sayi)
    .split('')
    .reduce((toplam, rakam) => toplam + Number(rakam), 0)
}

/**
 * 7 kuralının adımları: 4536 → 441 → 42.
 *
 * Sayı iki basamağa inene kadar sürüyor. Adımlar bölünebilirliği koruyor ama
 * kalanı korumuyor — bu yüzden yalnızca "bölünür mü" sorusunda gösteriliyor.
 */
export function yediAdimlari(sayi: number): number[] {
  const adimlar: number[] = []
  let n = sayi
  // Üst sınır dört-beş basamaktan iki basamağa üç adımda iniyor; döngü yine de
  // sayaçlı, çünkü negatife düşen bir adım sonsuza kadar dönebilirdi.
  for (let i = 0; i < 6 && n > 99; i++) {
    n = Math.floor(n / 10) - 2 * (n % 10)
    adimlar.push(n)
  }
  return adimlar
}

/**
 * Kuralın bu sayıdaki karşılığı — tur sonunda "neden" satırı.
 *
 * Kuralı okumakla kuralın bu sayıda ne dediğini görmek ayrı şeyler: "son üç
 * hane 536" cümlesi öğrenciye bir dahaki sefere nereye bakacağını söylüyor.
 */
export function kuralIzi(sayi: number, bolen: number): string {
  const metin = String(sayi)
  const sonRakam = sayi % 10

  switch (bolen) {
    case 2:
      return `son rakam ${sonRakam}`
    case 5:
      return `son rakam ${sonRakam}`
    case 10:
      return `son rakam ${sonRakam}`
    case 3:
    case 9:
      return `rakam toplamı ${metin.split('').join('+')} = ${rakamToplami(sayi)}`
    case 4:
      return `son iki hane ${metin.slice(-2)}`
    case 8:
      return `son üç hane ${metin.slice(-3)}`
    case 6:
      return `son rakam ${sonRakam} · rakam toplamı ${rakamToplami(sayi)}`
    case 7:
      return `${sayi} → ${yediAdimlari(sayi).join(' → ')}`
    default:
      return ''
  }
}

/**
 * Verilen bölen ve kalana uyan, dört ya da beş basamaklı bir sayı.
 *
 * `bolen * kat + kalan` biçiminde kuruluyor; `kat` aralığı iki uçtan da
 * hesaplandığı için sonuç her zaman basamak sınırları içinde kalıyor.
 */
export function sayiUret(bolen: number, kalan: number, rastgele: () => number): number {
  const enKucukKat = Math.ceil((EN_KUCUK_SAYI - kalan) / bolen)
  const enBuyukKat = Math.floor((EN_BUYUK_SAYI - kalan) / bolen)
  return bolen * arasinda(enKucukKat, enBuyukKat, rastgele) + kalan
}

/** Bir "bölünür mü" sorusu. Cevap yazı-tura: yarısı Evet, yarısı Hayır. */
function bolunurUret(bolen: number, rastgele: () => number): BolunmeSorusu {
  const bolunsun = rastgele() < 0.5
  const kalan = bolunsun ? 0 : arasinda(1, bolen - 1, rastgele)
  return { tip: 'bolunur', sayi: sayiUret(bolen, kalan, rastgele), bolen }
}

/** Bir "kalan kaç" sorusu. Kalan 0 ile bolen−1 arasında, her değer eşit şansla. */
function kalanUret(bolen: number, rastgele: () => number): BolunmeSorusu {
  const kalan = arasinda(0, bolen - 1, rastgele)
  return { tip: 'kalan', sayi: sayiUret(bolen, kalan, rastgele), bolen }
}

/** Sorunun doğru cevabı: kalan sorusunda kalan, bölünür sorusunda 0 mı. */
export function bolunmeCevabi(soru: BolunmeSorusu): number {
  return soru.sayi % soru.bolen
}

export function bolunuyorMu(soru: BolunmeSorusu): boolean {
  return bolunmeCevabi(soru) === 0
}

/** Aynı sorunun kaç soru içinde tekrarlanmayacağı. */
const TEKRAR_PENCERESI = 12

/** Kalan sorulabilen bir bölende iki tipin payı — yazı tura. */
const KALAN_ORANI = 0.5

/**
 * Bir turun soruları.
 *
 * Önce **bölen** seçiliyor, sonra soru tipi. Sırası önemli: tip önce seçilseydi
 * kalan soruları yedi bölene, bölünür soruları dokuz bölene dağılırdı ve 6 ile 7
 * diğerlerinin yarısı kadar çıkardı — üstelik 7 kuralı en zor olanı. Bu sırayla
 * her bölen eşit sıklıkta geliyor; 6 ile 7 yalnızca "bölünür mü" olarak
 * soruluyor, kalanları kuraldan okunamadığı için.
 */
export function bolunmeTuruHazirla(
  bolenler: readonly number[],
  adet: number,
  rastgele: () => number = Math.random,
): BolunmeSorusu[] {
  const secili = bolenler.length > 0 ? bolenler : TUM_BOLENLER

  const sorular: BolunmeSorusu[] = []
  const sonGorulen: string[] = []

  for (let deneme = 0; deneme < adet * 20 && sorular.length < adet; deneme++) {
    const bolen = sec(secili, rastgele)
    const kalanSorusu =
      (KALAN_BOLENLERI as readonly number[]).includes(bolen) && rastgele() < KALAN_ORANI
    const soru = kalanSorusu ? kalanUret(bolen, rastgele) : bolunurUret(bolen, rastgele)

    const imza = `${soru.tip}:${soru.sayi}:${soru.bolen}`
    if (sonGorulen.includes(imza)) continue

    sorular.push(soru)
    sonGorulen.push(imza)
    if (sonGorulen.length > TEKRAR_PENCERESI) sonGorulen.shift()
  }

  return sorular
}
