/**
 * Ders seçilen her yerin listesi: Pomodoro, Soru Takibi, yanlış soru ekleme.
 *
 * Kullanıcı on derste sabitledi ve "fazlası olmasın" dedi. Liste bir süre
 * okulun ve YKS'nin bütün adlarını taşıyordu (Geometri, Edebiyat, Psikoloji,
 * Sosyoloji, Mantık, üç dil ayrı ayrı) ve Pomodoro'da seans türlerini de
 * ("Deneme Çözümü", "Soru Çözümü", "Tekrar"); yanlış sorunun ayrı, "Diğer"li
 * bir listesi vardı. On sekiz çip arasında aranan ders kayboluyordu ve aynı
 * ders iki ekranda iki adla duruyordu ("Türkçe" / "Türk Dili ve Edebiyatı").
 * Geometri Matematik'in, Edebiyat Türkçe'nin, sosyal bilimler Felsefe'nin
 * içinde.
 *
 * Eski kayıtlardaki adlar yeniden adlandırılmıyor: istatistik ve süzgeç
 * onları kendi adlarıyla göstermeye devam ediyor, yalnızca yeni seçimde
 * yoklar. Sınav provası seansı da listede değil, kendi adıyla kaydediliyor
 * (`PROVA_DERSI`, `lib/sinav-provasi.ts`) — seçilen bir ders değil.
 */
export const CALISMA_DERSLERI: string[] = [
  'Türkçe',
  'Matematik',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Tarih',
  'Coğrafya',
  'Yabancı Dil',
  'Felsefe',
  'Din Kültürü',
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
