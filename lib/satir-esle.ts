/**
 * Okunan sayı satırını ders adıyla eşleştirir — saf, telefonsuz test edilebilir.
 *
 * Kâğıtta iki ayrı tanıyıcı çalışıyor ve ikisi ayrı şeyi görüyor: sayıları
 * kendi ağımız okuyor (`lib/kagit-oku.ts`), ders adını ML Kit. İkisini
 * birleştiren şey **konum**: aynı hizadaki ad ile sayı aynı satırdır.
 *
 * ## Neden sıraya bakılmıyor
 *
 * Eskiden okunan 1. satır şablonun 1. dersine yazılıyordu. Ölçüldü ve iki
 * yerden birden bozuluyor:
 *
 * - **Öğrenci kendi sırasıyla yazıyor.** Elimizdeki bir kâğıtta sıra
 *   `Türk Dili, Coğ1, Tar2, Mat, Coğ2, Tar1, DKAB, F` — hiçbir şablonun
 *   sırası değil. Satırlar doğru okunsa bile sayılar yanlış derse gidiyordu.
 * - **Bir satırın kayması altındaki her şeyi kaydırıyor.** Uzun ders adından
 *   sonra alta taşan sayı ("… Edebiyat: 36D" ⏎ "1B") iki satır sayılıyor;
 *   "Edebiyat: Full" satırı da sayı yokken bir şey okunmuş gibi görünüyor.
 *   Tek bir fazla satır, altındaki sekiz dersi birden yanlış kutuya yazıyor.
 *
 * Konuma bakan eşleme ikisinden de etkilenmiyor: ad hangi satırdaysa sayı da
 * oradadır.
 */

import type { SatirOkuma } from './kagit-oku'

/** Bir metin tanıyıcısının (ML Kit) okuduğu satır ve kapladığı dikey aralık. */
export type MetinSatiri = {
  metin: string
  ustY: number
  altY: number
}

/**
 * İki satırın aynı satır sayılması için gereken en az örtüşme.
 *
 * Ölçü, kısa olanın boyuna göre alınıyor: ders adı ile sayılar aynı hizada
 * ama her zaman aynı boyda değil ("Coğ" alçak, "12D" yüksek). Payda büyük
 * olanı seçmek, aynı satırdaki iki kutuyu ayrı satır göstermeye yetiyordu.
 */
const EN_AZ_ORTUSME = 0.5

/**
 * Ders adının bittiği yer: ilk "sayı + işaret" kümesi.
 *
 * Ada sızan rakam bu yüzden zarar vermiyor — "Coğ1", "Tar2" ve "T.M" gibi
 * adlarda rakam adın parçası ve arkasında B/D/Y gelmiyor. Kesme noktası ilk
 * rakamda olsaydı "Coğ1" ile "Coğ2" ayırt edilemez olurdu.
 */
const SAYI_KUMESI = /\d+\s*[BDYbdy]/

/**
 * Her sayı satırı için ders adını döndürür; bulunamayanda boş dizi elemanı.
 *
 * Bir metin satırı yalnızca **bir** sayı satırına ad olabiliyor: iki sayı
 * satırı aynı ada denk gelirse en çok örtüşen alıyor, öteki adsız kalıyor.
 * Adsız kalan satıra ad uydurmak, yanlış dersin kutusunu doldurmak olurdu.
 */
export function adlariEsle(
  sayiSatirlari: readonly SatirOkuma[],
  metinSatirlari: readonly MetinSatiri[],
): string[] {
  const adlar = sayiSatirlari.map(() => '')
  // Her metin satırı için en iyi adayı tutuyoruz; eşleşme metin tarafından
  // kurulunca aynı ad iki sayı satırına birden yazılamıyor.
  const sahipler = new Map<number, { sira: number; oran: number }>()

  sayiSatirlari.forEach((sayi, sira) => {
    let enIyi = -1
    let enIyiOran = EN_AZ_ORTUSME

    metinSatirlari.forEach((metin, mSira) => {
      const oran = ortusme(sayi, metin)
      if (oran > enIyiOran) {
        enIyiOran = oran
        enIyi = mSira
      }
    })

    if (enIyi === -1) return
    const sahip = sahipler.get(enIyi)
    if (sahip !== undefined && sahip.oran >= enIyiOran) return
    if (sahip !== undefined) adlar[sahip.sira] = ''
    sahipler.set(enIyi, { sira, oran: enIyiOran })
    adlar[sira] = dersAdi(metinSatirlari[enIyi].metin)
  })

  return adlar
}

/** İki dikey aralığın, kısa olana oranla örtüşmesi. */
function ortusme(a: { ustY: number; altY: number }, b: { ustY: number; altY: number }): number {
  const kesisim = Math.min(a.altY, b.altY) - Math.max(a.ustY, b.ustY)
  if (kesisim <= 0) return 0
  const kisa = Math.min(a.altY - a.ustY, b.altY - b.ustY)
  return kisa <= 0 ? 0 : kesisim / kisa
}

/**
 * Metin satırından ders adını ayıklar.
 *
 * Sayılar atılıyor çünkü onları kendi ağımız okuyor ve ML Kit'in el yazısı
 * sayıları güvenilmez: ölçüldü, aynı satırda adı doğru okurken "3D 2B"yi
 * "30 28" yapabiliyor. İki tanıyıcının her biri iyi olduğu işi yapıyor.
 */
export function dersAdi(metin: string): string {
  const kesim = metin.search(SAYI_KUMESI)
  const ad = kesim === -1 ? metin : metin.slice(0, kesim)
  // Baştaki/sondaki ayraçlar (":", "-", ".") ada dahil değil; şablon
  // anahtarları söz sınırına bakıyor ve bunlar sınırın kendisi.
  return ad.replace(/^[\s:.\-–—!|]+|[\s:.\-–—!|]+$/g, '')
}
