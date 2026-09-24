/**
 * Soru takibi ve yanlış soru bankasında kullanılan çalışma dersleri.
 * YKS'de sorulan testler esas alınır — okulun ders listesi değil.
 */
export const CALISMA_DERSLERI: string[] = [
  'Türkçe',
  'Matematik',
  'Geometri',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Edebiyat',
  'Tarih',
  'Coğrafya',
  'Felsefe',
  'Psikoloji',
  'Sosyoloji',
  'Mantık',
  'Din Kültürü',
  'İngilizce',
  'Almanca',
  'Fransızca',
  // Ders değil ama çalışma seansının gerçekten geçtiği yerler. Pomodoro'da
  // "hangi derse çalışıyorsun" sorusunun en sık cevabı bunlar oluyor ve
  // listede yoklarsa seans dersiz kaydediliyordu.
  'Deneme Çözümü',
  'Soru Çözümü',
  'Tekrar',
]

/**
 * Yanlış soru eklerken seçilebilen dersler — `CALISMA_DERSLERI`den ayrı.
 *
 * Çalışma listesi soru takibi ve Pomodoro'ya ait ve seans türlerini
 * ("Tekrar", "Deneme Çözümü") da taşıyor; bir soru fotoğrafı ise tek bir
 * derse aittir. Türkçe ile Edebiyat tek ders (kâğıttaki soru hangisi olduğunu
 * ayırmıyor), Geometri Matematik'in içinde, diller tek "Yabancı Dil" altında:
 * liste kısa kalsın ki seçim yazmadan yapılabilsin. Serbest metin kapalı —
 * "matematik", "Mat", "mat." aynı dersin üç ayrı süzgeç çipi oluyordu.
 * Uymayan her şey "Diğer".
 *
 * Eski kayıtlarda bu listede olmayan adlar (Geometri, İngilizce…) duruyor;
 * süzgeç ve renk onları da tanıyor, yeniden adlandırılmıyorlar.
 */
export const YANLIS_SORU_DERSLERI: string[] = [
  'Türk Dili ve Edebiyatı',
  'Matematik',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Tarih',
  'Coğrafya',
  'Felsefe',
  'Yabancı Dil',
  'Diğer',
]

/**
 * Konu ve not kısa tutuluyor: ikisi de küçük karede ve görüntüleyicinin
 * başlığında tek satırda duruyor; uzun not fotoğrafın yerini yiyordu.
 */
export const YANLIS_SORU_KONU_SINIRI = 30
export const YANLIS_SORU_NOT_SINIRI = 60

/** Türkçe harfleri de doğru karşılaştırmak için sadeleştirir: "İNGİLİZCE" → "ingilizce". */
export function sadelestir(metin: string): string {
  return metin
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('â', 'a')
    .replaceAll('’', "'")
    .trim()
}
