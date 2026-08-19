/**
 * Köklü Sayı Aralığı — √n hangi iki tam sayı arasında?
 *
 * TYT'de köklü sayı sorularının çoğu tam değeri değil **konumu** soruyor:
 * √50'nin kaç ettiği değil, 7 ile 8 arasında olduğu. Oyun da bunu ölçüyor;
 * cevap bir sayı değil, sayı doğrusu üzerinde iki ardışık tam sayı.
 *
 * Bonus sorusu ("hangisine daha yakın?") aynı bilginin bir adım ötesi: aralığı
 * bulmak √50 ≈ 7,07 demeye yetmiyor, yakınlık ise tam kareye olan uzaklığı
 * düşündürüyor. Ayrı bir soru değil, doğru bilinen sorunun devamı — o yüzden
 * kaçırmak temel puanı götürmüyor.
 *
 * Saf: React'e bağlı hiçbir şey yok, hepsi test edilebilir.
 */

import { arasinda } from './tur'

/** Sayı çubuğunun uçları. Çubuk mobil ekranda okunacak kadar kısa kalmalı. */
export const CUBUK_EN_AZ = 1
export const CUBUK_EN_COK = 25

/** Bonus sorusunun süresi, saniye. */
export const BONUS_SURESI = 5

/** Aralığı doğru bulmanın puanı. */
export const TEMEL_PUAN = 1
/** Bonusu da bilmenin getirdiği ek puan. */
export const BONUS_PUAN = 1

export type KokluSorusu = {
  /**
   * Kökün içindeki sayı — **tam kare değil**.
   *
   * Tam kare olsaydı √36 gibi bir soruda cevap iki ardışık sayı arasında değil
   * tam sayının kendisi olurdu; çubukta bunun karşılığı yok.
   */
  sayi: number
}

/** Aralığın alt ucu: √n'den küçük en büyük tam sayı. */
export function altSinir(soru: KokluSorusu): number {
  return Math.floor(Math.sqrt(soru.sayi))
}

/** Aralığın üst ucu — her zaman alt ucun bir fazlası. */
export function ustSinir(soru: KokluSorusu): number {
  return altSinir(soru) + 1
}

/**
 * Seçilen aralık doğru mu.
 *
 * Yalnızca **en dar** aralık doğru sayılıyor: "√50, 1 ile 25 arasında" da
 * doğrudur ama hiçbir şey söylemez. Oyunun ölçtüğü şey aralığı daraltabilmek.
 */
export function aralikDogruMu(soru: KokluSorusu, alt: number, ust: number): boolean {
  return alt === altSinir(soru) && ust === ustSinir(soru)
}

/**
 * Bonus sorusunun cevabı: √n hangi uca daha yakın?
 *
 * Orta nokta (k + 0,5)² = k² + k + 0,25; sayı tam sayı olduğu için bu değere
 * asla eşit olamıyor — yani berabere biten bir soru çıkmıyor.
 */
export function yakinUc(soru: KokluSorusu): number {
  const k = altSinir(soru)
  return soru.sayi > k * k + k ? k + 1 : k
}

/** √n'nin ondalık karşılığı — geri bildirimde "≈ 7,07" olarak gösteriliyor. */
export function yaklasikDeger(soru: KokluSorusu): string {
  return Math.sqrt(soru.sayi).toFixed(2).replace('.', ',')
}

/** Aralığın iki ucunun kareleri: "49 < 50 < 64" gibi bir açıklama için. */
export function aralikAciklamasi(soru: KokluSorusu): string {
  const k = altSinir(soru)
  return `${k * k} < ${soru.sayi} < ${(k + 1) * (k + 1)}`
}

/**
 * Tek soru üretir: alt sınırı `k` olan, tam kare olmayan bir sayı.
 *
 * Aralık k² ile (k+1)² arasındaki tam sayılardan seçiliyor, iki uç dışarıda —
 * ikisi de tam kare.
 */
export function soruKur(k: number, rastgele: () => number = Math.random): KokluSorusu {
  return { sayi: arasinda(k * k + 1, k * k + 2 * k, rastgele) }
}

/**
 * Turun soruları.
 *
 * Alt sınır bütün çubuğa yayılıyor: hep küçük sayılar gelseydi oyuncu çubuğun
 * sol ucundan hiç ayrılmaz, sağ yarısını hiç kullanmazdı. Üst uç 24, çünkü
 * 24–25 çubuğa sığan son aralık.
 *
 * Aynı sayı arka arkaya iki kez gelmiyor: gelseydi ikinci soru cevabı zaten
 * bilinen bir tekrar olurdu.
 */
export function kokluTuruHazirla(
  adet: number,
  rastgele: () => number = Math.random,
): KokluSorusu[] {
  const sorular: KokluSorusu[] = []
  let oncekiSayi = 0
  for (let i = 0; i < adet; i++) {
    let soru = soruKur(arasinda(CUBUK_EN_AZ, CUBUK_EN_COK - 1, rastgele), rastgele)
    if (soru.sayi === oncekiSayi) soru = soruKur(arasinda(CUBUK_EN_AZ, CUBUK_EN_COK - 1, rastgele), rastgele)
    oncekiSayi = soru.sayi
    sorular.push(soru)
  }
  return sorular
}
