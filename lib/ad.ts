/**
 * Kullanıcının adı: doğrulama ve biçim.
 *
 * Kurulumda ve Ayarlar'da aynı ad soruluyor; kural iki yerde ayrı yazılsaydı
 * biri değişip öteki olduğu yerde kalırdı — nitekim uzunluk kuralı bir süre
 * yalnızca kurulumda vardı ve Ayarlar'dan tek harflik ad kaydedilebiliyordu.
 */

/**
 * Adın en az kaç harf olacağı.
 *
 * Tek harf ("a") ya da boş bırakılan ad selamlamayı anlamsızlaştırıyor; üç,
 * gerçek adların hepsini geçirip baştan savma girişleri eleyen en küçük sınır.
 */
export const AD_EN_AZ = 3

export function adGecerliMi(ad: string): boolean {
  return ad.trim().length >= AD_EN_AZ
}

/**
 * Her kelimenin ilk harfini büyütür: "emre nuri" → "Emre Nuri".
 *
 * Klavyeye `autoCapitalize` ile de söyleniyor ama o yalnızca bir ipucu:
 * Android'de kullanıcının klavyesi ya da dil ayarı bunu yok sayabiliyor ve ad
 * ana sayfada küçük harfle selamlanıyordu.
 *
 * Büyütme Türkçe kurallarına göre ("ilker" → "İlker"); geri kalan harflere
 * dokunulmuyor, çünkü "TUĞÇE" diye yazan kullanıcının tercihi de bir tercih.
 */
export function adBiciminde(ham: string): string {
  return ham.replace(/(^|\s)(\p{L})/gu, (_, onceki: string, harf: string) =>
    onceki + harf.toLocaleUpperCase('tr-TR'),
  )
}
