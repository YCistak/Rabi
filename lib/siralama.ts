import type { PuanTuru } from './types'
import { VERI_YILLARI, yilVerisi } from './puan'

/**
 * Yerleştirme puanından tahmini başarı sırası.
 *
 * ÖSYM her yıl "Yerleştirme Puanlarının Yığınsal Dağılımı" tablosunu yayınlıyor:
 * her 20 puanlık eşik için o puanın üstündeki aday sayısı. Bir adayın sırası,
 * kendisinden yüksek puan alan aday sayısının bir fazlasıdır — yani tablo
 * doğrudan sıralama tablosudur. Aradaki değerler iç değerle (interpolasyon)
 * bulunuyor.
 */

export type YilSiralamasi = {
  yil: number
  siralama: number
  /** Puan tablonun kapsadığı aralığın dışındaysa sonuç güvenilir değil. */
  tabloDisi: boolean
}

export type SiralamaSonucu = {
  yillar: YilSiralamasi[]
  /** Üç yılın en iyisi (en küçük sıra). */
  enIyi: number
  /** Üç yılın en kötüsü (en büyük sıra). */
  enKotu: number
}

/**
 * İki eşik arasında iç değer. Aday sayısı puanla üstel değiştiği için
 * **logaritmik** interpolasyon kullanılıyor: doğrusal iç değer, üst uçlarda
 * (az adayın olduğu yerde) sırayı kat kat şişiriyor.
 */
function icDeger(
  puan: number,
  altPuan: number,
  altSayi: number,
  ustPuan: number,
  ustSayi: number,
): number {
  if (ustPuan <= altPuan) return altSayi
  const oran = (puan - altPuan) / (ustPuan - altPuan)

  // Sayılardan biri 0 ise logaritma tanımsız; o durumda doğrusala düşülür.
  if (altSayi <= 0 || ustSayi <= 0) {
    return altSayi + (ustSayi - altSayi) * oran
  }
  return Math.exp(Math.log(altSayi) + (Math.log(ustSayi) - Math.log(altSayi)) * oran)
}

/**
 * Tek bir yıl için sıralama.
 *
 * Tablo artan puan sırasında [eşik, eşiğin üstündeki aday sayısı] çiftleri
 * tutuyor; puan yükseldikçe sayı düşüyor.
 */
export function yilSiralamasi(puan: number, tur: PuanTuru, yil: number): YilSiralamasi {
  const noktalar = yilVerisi(yil).yerlestirme[tur]
  if (!noktalar || noktalar.length === 0) {
    return { yil, siralama: 0, tabloDisi: true }
  }

  const enDusuk = noktalar[0]
  const enYuksek = noktalar[noktalar.length - 1]

  if (puan <= enDusuk[0]) {
    // Tablonun altında: sıralama en fazla toplam aday sayısı kadar olabilir.
    return { yil, siralama: enDusuk[1], tabloDisi: true }
  }
  if (puan >= enYuksek[0]) {
    return { yil, siralama: Math.max(1, enYuksek[1]), tabloDisi: puan > enYuksek[0] }
  }

  for (let i = 0; i < noktalar.length - 1; i++) {
    const [altPuan, altSayi] = noktalar[i]
    const [ustPuan, ustSayi] = noktalar[i + 1]
    if (puan >= altPuan && puan <= ustPuan) {
      const ham = icDeger(puan, altPuan, altSayi, ustPuan, ustSayi)
      return { yil, siralama: Math.max(1, Math.round(ham)), tabloDisi: false }
    }
  }

  return { yil, siralama: enYuksek[1], tabloDisi: true }
}

/** Veri bulunan bütün yıllar için sıralama ve bunların oluşturduğu bant. */
export function siralamaTahmini(puan: number, tur: PuanTuru): SiralamaSonucu {
  const yillar = VERI_YILLARI.map((yil) => yilSiralamasi(puan, tur, yil))
  const sayilar = yillar.map((y) => y.siralama)
  return {
    yillar,
    enIyi: Math.min(...sayilar),
    enKotu: Math.max(...sayilar),
  }
}

/** "47.900" gibi binlik ayraçlı yazım. */
export function siraYaz(siralama: number): string {
  return siralama.toLocaleString('tr-TR')
}

/**
 * Bandı okunur bir aralığa yuvarlar: "47.000 – 61.000".
 * Kesin görünen sayılar tahmini olduğundan daha güvenilir gösteriyor; bant
 * bilerek kabalaştırılıyor.
 */
export function bantYaz(enIyi: number, enKotu: number): string {
  // Yuvarlama adımı değerin ~%1'i kadar. Küçük sıralamalarda hiç yuvarlanmıyor:
  // 12. sırayı "10 – 20" diye göstermek, kabalaştırmak değil yanlış bilgi olurdu.
  const basamak = (n: number) => {
    if (n >= 100_000) return 10_000
    if (n >= 10_000) return 1_000
    if (n >= 1_000) return 100
    if (n >= 200) return 10
    return 1
  }
  const alt = Math.floor(enIyi / basamak(enIyi)) * basamak(enIyi)
  const ust = Math.ceil(enKotu / basamak(enKotu)) * basamak(enKotu)
  if (alt === ust) return siraYaz(alt)
  return `${siraYaz(Math.max(1, alt))} – ${siraYaz(ust)}`
}
