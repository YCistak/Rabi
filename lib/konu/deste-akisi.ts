import type { HizliKontrol } from './tip'

/**
 * Destenin akışı — kartların arasına giren iki ara ekranın yeri.
 *
 * Deste yalnızca kart değil: arada bir **kısa mola** (Rabi sevinir, okunan
 * kartların adları sıralanır) ve bir–iki **hızlı kontrol** (okunmuş bir
 * karttan iki şıklı soru) geliyor. Hiçbiri kart sayılmıyor; ilerleme çubuğu
 * ve `okunan` yalnızca kartları sayıyor.
 *
 * Yer kart sayısına göre sabit, iki kural var:
 *
 * - Mola ve ilk kontrol baştaki ve sondaki iki karttan uzak duruyor. Son
 *   kontrol son karta dayanıyorsa onu kart okunmadan öne çekmiyoruz.
 * - Kontrol, dayandığı kart (`HizliKontrol.kart`) okunmadan gelmiyor.
 *
 * Yer sığmıyorsa ara ekran hiç konmuyor: üç kartlık destede mola için yer
 * yok ve zorla sıkıştırılan bir mola, kuralın kendisini bozardı.
 *
 * Eski çağrıların üçüncü parametresi uyumluluk için korunuyor; yerleşimi
 * değiştirmiyor.
 */

export type DesteAdimi =
  | { tur: 'kart'; sira: number }
  | { tur: 'mola' }
  /** `sira`: `Konu.kontroller` içindeki dizin. */
  | { tur: 'kontrol'; sira: number }

/** Ara ekran baştaki ve sondaki iki karttan uzak durur. */
const KENAR_PAYI = 2

function uygunYerler(kartSayisi: number): number[] {
  return Array.from(
    { length: Math.max(0, kartSayisi - KENAR_PAYI * 2 + 1) },
    (_, sira) => sira + KENAR_PAYI,
  )
}

/**
 * Kartlar arasındaki sabit sıra: kısa destede kontrol → mola, uzun destede
 * kontrol → mola → kontrol. Kontrol yalnızca dayandığı kart okunduktan sonra
 * gelir; yer yetmezse ara ekranı zorlamayız.
 */
export function desteAkisi(
  kartSayisi: number,
  kontroller: HizliKontrol[],
  _rastgele: () => number = Math.random,
): DesteAdimi[] {
  const yerler = uygunYerler(kartSayisi)
  const sirali = kontroller
    .map((kontrol, sira) => ({ kontrol, sira }))
    .sort((a, b) => a.kontrol.kart - b.kontrol.kart)
  const yerlesim = new Map<number, DesteAdimi>()

  if (sirali.length > 0) {
    const ilk = sirali[0]
    const hedef = Math.max(KENAR_PAYI, Math.round(kartSayisi / 3))
    const yer = yerler.find((k) => k >= hedef && k >= ilk.kontrol.kart)
    if (yer !== undefined) yerlesim.set(yer, { tur: 'kontrol', sira: ilk.sira })
  }

  const ilkKontrolYeri = [...yerlesim.keys()][0]
  const molaHedefi = Math.max(KENAR_PAYI, Math.round(kartSayisi / 2))
  const molaYeri = yerler.find((k) => k >= molaHedefi && (ilkKontrolYeri === undefined || k > ilkKontrolYeri))
  if (molaYeri !== undefined) yerlesim.set(molaYeri, { tur: 'mola' })

  if (sirali.length > 1 && molaYeri !== undefined) {
    const ikinci = sirali[1]
    const hedef = Math.max(KENAR_PAYI, Math.round((kartSayisi * 2) / 3))
    const sonKontrolYerleri = Array.from({ length: Math.max(0, kartSayisi - 1) }, (_, i) => i + 2)
    const yer = sonKontrolYerleri.find((k) => k >= hedef && k > molaYeri && k >= ikinci.kontrol.kart)
    if (yer !== undefined) yerlesim.set(yer, { tur: 'kontrol', sira: ikinci.sira })
  }

  const adimlar: DesteAdimi[] = []
  for (let sira = 0; sira < kartSayisi; sira++) {
    adimlar.push({ tur: 'kart', sira })
    const araEkran = yerlesim.get(sira + 1)
    if (araEkran) adimlar.push(araEkran)
  }
  return adimlar
}

/**
 * Kısa molanın metni.
 *
 * Beş ayrı varyasyon ve hangisinin geleceği rastgele: aynı cümleyi her
 * destede okuyan kullanıcı ikinci desteden sonra okumayı bırakıyor. Sayılar
 * (`okunan`, `kalan`) cümleye girdiği için şablon fonksiyon; metin
 * yazılırken kalan sıfır olamaz — mola son kartın öncesine hiç gelmiyor.
 */
export type MolaMetni = { baslik: string; metin: string }

export const MOLA_METINLERI: ReadonlyArray<(okunan: number, kalan: number) => MolaMetni> = [
  (okunan) => ({
    baslik: 'Böyle devam et!',
    metin: `${okunan} kartı bitirdin. Aynı tempoyla devam edersen bu konuyu bugün kapatırsın.`,
  }),
  (okunan, kalan) => ({
    baslik: 'İyi gidiyorsun!',
    metin: `${okunan} kart geride kaldı, ${kalan} kart önünde. Bir nefes al, sonra devam.`,
  }),
  (okunan, kalan) => ({
    baslik: 'Tempo tam yerinde',
    metin: `${okunan} kart okundu. Bu hızla kalan ${kalan} kart birkaç dakikanı alır.`,
  }),
  (okunan) => ({
    baslik: 'Kısa bir nefes',
    metin: `Okuduğun ${okunan} kartı bir kez de kendi cümlelerinle düşün, sonra ilerle.`,
  }),
  (okunan, kalan) => ({
    baslik: 'En zor kısım geride',
    metin: `Başlamak en zoruydu ve ${okunan} kart bitti. Kalan ${kalan} kart daha kısa sürecek.`,
  }),
]

/** Rastgele bir mola varyasyonunun **sırası** — metin okunan/kalan belli olunca kuruluyor. */
export function molaSecimi(rastgele: () => number = Math.random): number {
  return Math.min(MOLA_METINLERI.length - 1, Math.floor(rastgele() * MOLA_METINLERI.length))
}

export function molaMetni(secim: number, okunan: number, kalan: number): MolaMetni {
  return MOLA_METINLERI[secim % MOLA_METINLERI.length](okunan, kalan)
}
