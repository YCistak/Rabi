import type { HizliKontrol } from './tip'

/**
 * Destenin akışı — kartların arasına giren iki ara ekranın yeri.
 *
 * Deste yalnızca kart değil: arada bir **kısa mola** (Rabi sevinir, okunan
 * kartların adları sıralanır) ve bir–iki **hızlı kontrol** (okunmuş bir
 * karttan iki şıklı soru) geliyor. Hiçbiri kart sayılmıyor; ilerleme çubuğu
 * ve `okunan` yalnızca kartları sayıyor.
 *
 * Yer **rastgele**, ama iki kural var:
 *
 * - Ara ekran ilk iki kartın ve son iki kartın arasına **girmiyor**. İkinci
 *   karttan sonra gelen mola henüz okuma başlamadan verilen bir mola; son
 *   karttan hemen önce gelen kontrol ise destenin kendi kapanışıyla (soru
 *   sahnesi) üst üste biniyor.
 * - Kontrol, dayandığı kart (`HizliKontrol.kart`) okunmadan gelmiyor.
 *
 * Yer sığmıyorsa ara ekran hiç konmuyor: üç kartlık destede mola için yer
 * yok ve zorla sıkıştırılan bir mola, kuralın kendisini bozardı.
 *
 * Rastgelelik dışarıdan geliyor (`rastgele`), `Math.random` burada
 * çağrılmıyor: test aynı desteyi aynı yerleşimle görebilmeli.
 */

export type DesteAdimi =
  | { tur: 'kart'; sira: number }
  | { tur: 'mola' }
  /** `sira`: `Konu.kontroller` içindeki dizin. */
  | { tur: 'kontrol'; sira: number }

/** Ara ekranın giremeyeceği kart sayısı — baştan ve sondan. */
const KENAR_PAYI = 2

/**
 * Ara ekran hangi kartlardan sonra gelebilir (1'den başlayan kart sırası).
 *
 * "k. karttan sonra" demek k ≥ 2 (ilk ikiden sonra) ve k ≤ N−2 (son ikiden
 * önce) demek: N kartlık destede k = 2 … N−2.
 */
function uygunYerler(kartSayisi: number): number[] {
  const yerler: number[] = []
  for (let k = KENAR_PAYI; k <= kartSayisi - KENAR_PAYI; k++) yerler.push(k)
  return yerler
}

function rastgeleSec<T>(liste: T[], rastgele: () => number): T | undefined {
  if (liste.length === 0) return undefined
  return liste[Math.min(liste.length - 1, Math.floor(rastgele() * liste.length))]
}

/**
 * Kart ve ara ekranların sırası.
 *
 * Önce kontrollerin yeri seçiliyor (her biri dayandığı karttan sonraki
 * **boş** uygun yerlerden), sonra molanın — kalanlardan. Kontroller önce,
 * çünkü seçenekleri daha dar: mola her uygun yere girebiliyor, kontrol
 * yalnızca dayandığı karttan sonrakilere. Uygun yer kalmayan ara ekran o
 * destede yok.
 *
 * Kontroller dayandıkları kartın sırasıyla yerleşiyor; iki kontrolün sırası
 * hiçbir zaman ters dönmüyor — ikinci yarının sorusu ilkinden önce gelseydi
 * daha okunmamış bir kartı sorardı.
 */
export function desteAkisi(
  kartSayisi: number,
  kontroller: HizliKontrol[],
  rastgele: () => number = Math.random,
): DesteAdimi[] {
  const yerler = uygunYerler(kartSayisi)
  const dolu = new Set<number>()

  /** Kart sırası → o karttan sonra gelecek ara ekranlar. */
  const yerlesim = new Map<number, DesteAdimi[]>()
  function koy(k: number, adim: DesteAdimi) {
    dolu.add(k)
    yerlesim.set(k, [...(yerlesim.get(k) ?? []), adim])
  }

  // Erken karta dayanan kontrol önce yer seçiyor; sonrakiler onun arkasında
  // kalan yerlerden seçiyor, böylece sıra korunuyor.
  const sirali = kontroller
    .map((kontrol, sira) => ({ kontrol, sira }))
    .sort((a, b) => a.kontrol.kart - b.kontrol.kart)
  let enSon = 0
  const sonYer = yerler[yerler.length - 1] ?? 0
  sirali.forEach(({ kontrol, sira }, i) => {
    // Arkadan gelen kontrollere yer bırakılıyor: ilk kontrol son boşluğu
    // kapsaydı ikincisi hiç yerleşemezdi.
    const arkadakiler = sirali.length - i - 1
    const yer = rastgeleSec(
      yerler.filter(
        (k) => k >= kontrol.kart && k > enSon && k <= sonYer - arkadakiler && !dolu.has(k),
      ),
      rastgele,
    )
    if (yer === undefined) return
    enSon = yer
    koy(yer, { tur: 'kontrol', sira })
  })

  const molaYeri = rastgeleSec(
    yerler.filter((k) => !dolu.has(k)),
    rastgele,
  )
  if (molaYeri !== undefined) koy(molaYeri, { tur: 'mola' })

  const adimlar: DesteAdimi[] = []
  for (let sira = 0; sira < kartSayisi; sira++) {
    adimlar.push({ tur: 'kart', sira })
    adimlar.push(...(yerlesim.get(sira + 1) ?? []))
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
