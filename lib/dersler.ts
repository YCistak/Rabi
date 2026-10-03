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

/**
 * Pomodoro'nun ders şeridinin sırası: en çok çalışılan üç ders başta, kalanı
 * listenin kendi sırasıyla.
 *
 * Hazırlık ekranı bir süre listenin ilk üç dersini ve bir "Diğer" düğmesi
 * gösteriyordu; Kimya çalışan öğrenci her turda çekmeceyi açıyordu. Şimdi
 * şerit yana kayıyor ve öğrencinin en çok seçtiği ders elinin altında.
 * Ölçü toplam dakika, seans sayısı değil: iki kısa deneme, üç saatlik bir
 * çalışmadan daha çok "çalışılmış" sayılmasın. Hiç çalışılmamış ders öne
 * alınmıyor — sıfır dakikalık bir "en çok" yok. Listede olmayan eski adlar
 * (`PROVA_DERSI`, kaldırılmış dersler) seçilemediği için sayılmıyor.
 */
export function calismaSirasi(
  seanslar: readonly { dakika: number; ders?: string }[],
  oneAlinan = 3,
): string[] {
  const toplam = new Map<string, number>()
  for (const s of seanslar) {
    if (s.ders && CALISMA_DERSLERI.includes(s.ders)) {
      toplam.set(s.ders, (toplam.get(s.ders) ?? 0) + s.dakika)
    }
  }
  const one = CALISMA_DERSLERI.filter((d) => (toplam.get(d) ?? 0) > 0)
    .sort((a, b) => (toplam.get(b) ?? 0) - (toplam.get(a) ?? 0))
    .slice(0, oneAlinan)
  return [...one, ...CALISMA_DERSLERI.filter((d) => !one.includes(d))]
}
