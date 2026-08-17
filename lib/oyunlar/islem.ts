import { arasinda, sec } from './tur'

/**
 * Zihinden İşlem oyununun soru üreteci.
 *
 * Sorular kayıtlı bir havuzdan değil **üretiliyor**: yazım oyununda doğru cevap
 * kelimenin kendisi, burada ise işlem sonucu — ezberlenecek bir şey yok, o yüzden
 * sabit bir liste tutmanın faydası olmazdı ve oyun birkaç turda tekrara düşerdi.
 *
 * Bütün sonuçlar **negatif olmayan tam sayı**: tuş takımında eksi ve virgül yok,
 * öğrenci sayıyı yazıp onaylıyor. Çıkarmada büyük sayı öne, bölmede bölünen
 * çarpımdan kuruluyor — kalanlı bir bölme hiç üretilmiyor.
 *
 * Zorluk, YKS'de gerçekten kazandıran aralığa göre seçildi: iki basamaklı
 * toplama/çıkarma, tek × iki basamaklı çarpım, tam bölme, tam kare kökler ve
 * küçük tabanlı üsler. Sonuçlar 2000'i geçmiyor; daha büyüğü zihinden hesap
 * değil, tuşlama egzersizi olurdu.
 */

export type IslemTuru = 'toplama' | 'cikarma' | 'carpma' | 'bolme' | 'koklu' | 'uslu'

export type IslemSorusu = {
  tur: IslemTuru
  /** Ekranda görünen ifade — "47 + 68", "√144", "2³ · 2⁴". */
  metin: string
  sonuc: number
}

export const TUM_ISLEMLER: IslemTuru[] = [
  'toplama',
  'cikarma',
  'carpma',
  'bolme',
  'koklu',
  'uslu',
]

export const ISLEM_ADI: Record<IslemTuru, string> = {
  toplama: 'Toplama',
  cikarma: 'Çıkarma',
  carpma: 'Çarpma',
  bolme: 'Bölme',
  koklu: 'Köklü sayılar',
  uslu: 'Üslü sayılar',
}

/** Seçim ekranındaki çiplerin altında görünen örnek. */
export const ISLEM_ORNEGI: Record<IslemTuru, string> = {
  toplama: '47 + 68',
  cikarma: '134 − 57',
  carpma: '7 × 24',
  bolme: '156 ÷ 12',
  koklu: '√196',
  uslu: '2³ · 2⁴',
}

const US_RAKAMLARI = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']

/** Sayıyı üs olarak yazar: 12 → "¹²". Ekranda gerçek üs görünsün diye. */
export function usYaz(sayi: number): string {
  return String(sayi)
    .split('')
    .map((rakam) => US_RAKAMLARI[Number(rakam)])
    .join('')
}

function toplamaUret(r: () => number): IslemSorusu {
  // Üçte biri üç basamaklı: hep iki basamak olsaydı oyun birkaç turda kolaylaşırdı.
  const a = r() < 0.35 ? arasinda(101, 899, r) : arasinda(12, 99, r)
  const b = arasinda(11, 99, r)
  return { tur: 'toplama', metin: `${a} + ${b}`, sonuc: a + b }
}

function cikarmaUret(r: () => number): IslemSorusu {
  const a = r() < 0.35 ? arasinda(120, 950, r) : arasinda(25, 99, r)
  // Sonuç en az 10 kalsın; "31 − 30" gibi bir soru zihinden hesap sayılmaz.
  const b = arasinda(11, a - 10, r)
  // U+2212 gerçek eksi işareti; kısa çizgi ekranda tire gibi duruyor.
  return { tur: 'cikarma', metin: `${a} − ${b}`, sonuc: a - b }
}

function carpmaUret(r: () => number): IslemSorusu {
  const [a, b] =
    r() < 0.55
      ? [arasinda(3, 9, r), arasinda(11, 29, r)]
      : [arasinda(11, 25, r), arasinda(11, 19, r)]
  return { tur: 'carpma', metin: `${a} × ${b}`, sonuc: a * b }
}

function bolmeUret(r: () => number): IslemSorusu {
  // Bölünen çarpımdan kuruluyor: kalanlı bölme hiç üretilmiyor.
  const bolen = arasinda(3, 12, r)
  const sonuc = arasinda(3, 25, r)
  return { tur: 'bolme', metin: `${bolen * sonuc} ÷ ${bolen}`, sonuc }
}

function kokluUret(r: () => number): IslemSorusu {
  if (r() < 0.6) {
    const n = arasinda(4, 30, r)
    return { tur: 'koklu', metin: `√${n * n}`, sonuc: n }
  }
  const p = arasinda(2, 12, r)
  const q = arasinda(2, 9, r)
  return { tur: 'koklu', metin: `√${p * p} · √${q * q}`, sonuc: p * q }
}

/** Taban → o taban için en büyük üs. Sonuç 2000'i geçmesin diye sınırlandı. */
const US_TABANLARI: [taban: number, enCokUs: number][] = [
  [2, 10],
  [3, 6],
  [4, 5],
  [5, 4],
  [6, 3],
  [7, 3],
  [9, 3],
  [11, 2],
  [12, 2],
  [13, 2],
  [15, 2],
  [20, 2],
]

/** Aynı tabanlı çarpımda kullanılan tabanlar ve üs toplamının üst sınırı. */
const CARPIM_TABANLARI: [taban: number, enCokToplam: number][] = [
  [2, 10],
  [3, 6],
  [5, 4],
]

function usluUret(r: () => number): IslemSorusu {
  if (r() < 0.6) {
    const [taban, enCokUs] = sec(US_TABANLARI, r)
    const us = arasinda(2, enCokUs, r)
    return { tur: 'uslu', metin: `${taban}${usYaz(us)}`, sonuc: taban ** us }
  }
  // aⁿ · aᵐ = aⁿ⁺ᵐ — ÖSYM'nin üslü sayılarda en çok sorduğu kural.
  const [taban, enCokToplam] = sec(CARPIM_TABANLARI, r)
  const toplamUs = arasinda(3, enCokToplam, r)
  const ilk = arasinda(1, toplamUs - 1, r)
  return {
    tur: 'uslu',
    metin: `${taban}${usYaz(ilk)} · ${taban}${usYaz(toplamUs - ilk)}`,
    sonuc: taban ** toplamUs,
  }
}

const URETECLER: Record<IslemTuru, (r: () => number) => IslemSorusu> = {
  toplama: toplamaUret,
  cikarma: cikarmaUret,
  carpma: carpmaUret,
  bolme: bolmeUret,
  koklu: kokluUret,
  uslu: usluUret,
}

/** Aynı sorunun kaç soru içinde tekrarlanmayacağı. */
const TEKRAR_PENCERESI = 12

/**
 * Bir turun soruları.
 *
 * Son `TEKRAR_PENCERESI` soruda görülen bir ifade yeniden üretilmiyor: "7 × 24"
 * arka arkaya iki kez gelseydi ikincisi hesap değil hatırlama olurdu. Seçilen tür
 * az sayıda farklı soru üretebiliyorsa (örneğin yalnızca köklü) deneme sayısı
 * sınırlı; havuz tükenirse liste kısa döner ve tur erken biter.
 */
export function islemTuruHazirla(
  turler: readonly IslemTuru[],
  adet: number,
  rastgele: () => number = Math.random,
): IslemSorusu[] {
  const secili = turler.length > 0 ? turler : TUM_ISLEMLER
  const sorular: IslemSorusu[] = []
  const sonGorulen: string[] = []

  for (let deneme = 0; deneme < adet * 20 && sorular.length < adet; deneme++) {
    const soru = URETECLER[sec(secili, rastgele)](rastgele)
    if (sonGorulen.includes(soru.metin)) continue

    sorular.push(soru)
    sonGorulen.push(soru.metin)
    if (sonGorulen.length > TEKRAR_PENCERESI) sonGorulen.shift()
  }

  return sorular
}
