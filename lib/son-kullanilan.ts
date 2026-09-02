/**
 * Ana sayfadaki kısayolların sırası.
 *
 * "Araçlar" ve "Oyunlar" bölümleri eskiden sabit listenin başını gösteriyordu:
 * araçlarda `KARTLAR`'ın ilk dördü, oyunlarda **hepsi**. Oyun sayısı ona,
 * sonra on yediye çıkınca ana sayfa oyun ızgarasına dönüştü ve altındaki
 * "Hedefim" kartı ekranın dışına itildi. Artık iki bölüm de dört kutucuk
 * gösteriyor ve dördü de en son kullanılanlar.
 *
 * Burası saf: hangi kimliğin ne zaman kullanıldığını bilmiyor, yalnızca
 * "en son kullanılan başa" listesini yönetiyor. Zamanı saklamıyoruz çünkü
 * gereken tek şey sıra — damga tutmak aynı bilgiyi daha kırılgan biçimde
 * saklamak olurdu (saat değişince sıra bozulur).
 */

/** Ana sayfada bir bölümde gösterilen kutucuk sayısı. */
export const KISAYOL_SAYISI = 4

/**
 * Listede tutulan en fazla kimlik.
 *
 * Gösterilenden fazlası tutuluyor: bir güncellemede oyun ya da araç kaldırılsa
 * listenin başındaki kimlik geçersizleşir ve dördü doldurmak için gerideki
 * kayıtlar lazım olur. Sekiz satır localStorage'da birkaç bayt.
 */
export const SON_KULLANILAN_SINIRI = 8

/**
 * Kullanılan kimliği listenin başına alır.
 *
 * Zaten listedeyse eski yeri düşüyor; aynı oyunu üst üste açmak listeyi
 * kopyalarla doldurmamalı.
 */
export function kullanildi<T extends string>(liste: readonly T[], id: T): T[] {
  return [id, ...liste.filter((mevcut) => mevcut !== id)].slice(0, SON_KULLANILAN_SINIRI)
}

/**
 * Gösterilecek kısayollar.
 *
 * Önce son kullanılanlar kendi sıralarıyla, sonra kalan yerler `tumu`'nun
 * baştan sırasıyla doluyor. İki kaynak da gerekli: yeni kullanıcının hiç
 * geçmişi yok ve boş bir bölüm görmemeli, geçmişi olan kullanıcı da dördü
 * dolduramayacak kadar az şey denemiş olabilir.
 *
 * `tumu` aynı zamanda geçerlilik ölçüsü: listede olmayan bir kimlik (kaldırılmış
 * oyun, eski sürümden kalan kayıt) sessizce eleniyor.
 */
export function kisayollar<T extends { id: string }>(
  tumu: readonly T[],
  sonKullanilan: readonly string[],
  adet: number = KISAYOL_SAYISI,
): T[] {
  const secilen: T[] = []

  for (const id of sonKullanilan) {
    if (secilen.length >= adet) break
    const oge = tumu.find((t) => t.id === id)
    if (oge && !secilen.includes(oge)) secilen.push(oge)
  }

  for (const oge of tumu) {
    if (secilen.length >= adet) break
    if (!secilen.includes(oge)) secilen.push(oge)
  }

  return secilen
}

/**
 * Kullanıcının kendi sabitlediği kısayollar önde.
 *
 * "En son kullanılan" iyi bir varsayılan ama bir tercih değil: her tur sonrası
 * sıra değişiyor ve kullanıcı aradığı kutucuğu bulmak için her seferinde
 * okumak zorunda kalıyordu. Sabitlenen kutucuk yerinde duruyor.
 *
 * Sabitleme listeyi **kapatmıyor**: dörtten az sabitlenmişse kalan yerler yine
 * son kullanılanlarla doluyor. Boş bırakılan yerin karşılığı boş bir kutucuk
 * olsaydı, tek bir aracı sabitlemek ötekilerin üçünü birden gizlerdi.
 *
 * `tumu` yine geçerlilik ölçüsü: kaldırılmış bir kimlik sabitlenmiş olsa da
 * eleniyor.
 */
export function sabitliKisayollar<T extends { id: string }>(
  tumu: readonly T[],
  sabitler: readonly string[],
  sonKullanilan: readonly string[],
  adet: number = KISAYOL_SAYISI,
): T[] {
  const secilen: T[] = []

  for (const id of sabitler) {
    if (secilen.length >= adet) break
    const oge = tumu.find((t) => t.id === id)
    if (oge && !secilen.includes(oge)) secilen.push(oge)
  }

  // Kalan yerler eski kuralla doluyor: sabitlenmemiş kullanıcıda davranış
  // birebir eskisi gibi kalsın.
  for (const oge of kisayollar(tumu, sonKullanilan, adet)) {
    if (secilen.length >= adet) break
    if (!secilen.includes(oge)) secilen.push(oge)
  }

  return secilen
}
