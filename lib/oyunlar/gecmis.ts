/**
 * Yakın geçmişte sorulan soruların kaydı — "az önce çıkan soru yine çıktı"
 * şikâyetinin cevabı.
 *
 * Tur içinde tekrar zaten yoktu: şerit karıştırılıp sırayla tüketiliyor
 * (`ritim.ts`). Sorun **turlar arasında**ydı. Her tur şeridi sıfırdan
 * karıştırıyor ve önceki turun son sorusu yeni turun ilk sorusu olabiliyordu;
 * otuz soruluk bir havuzda birkaç dakikada aynı soruyu iki kez görmek
 * sıradandı.
 *
 * Çözüm **yasak değil, sıra**: yakın zamanda görülen sorular şeridin sonuna
 * atılıyor, görülmeyenler öne. Yasak olsaydı küçük havuzlarda tur erken
 * biterdi; sıra ile havuzun tamamı hâlâ oynanıyor ama en son görülen en geç
 * geliyor. Havuz geçmişten küçükse bu düpedüz "en uzun süredir görülmeyen
 * önce" demek.
 *
 * Kimlik `bankaKimligi` (`banka.ts`): her oyunun sorusunu tek bir dizeye
 * indiren tek yer zaten orası ve bir soruyu Oyun Bankası'nda "aynı soru"
 * yapan şey burada da aynı soru yapıyor. Geçmiş, tur bitince bankaya giden
 * cevap listesinden yazılıyor (`oyunlar.tsx`); ekranlar ayrıca bir şey
 * kaydetmiyor.
 */

import type { OyunId } from '../types'

/** Oyun başına, eskiden yeniye sıralı soru kimlikleri. */
export type SoruGecmisi = Partial<Record<OyunId, string[]>>

/**
 * Oyun başına tutulan kimlik sayısı.
 *
 * Havuzların çoğu 20–60 soru; sınır havuzdan büyükse geçmiş "en az görüleni
 * öne al" sırasına dönüyor, küçükse yalnızca en yakın turları uzak tutuyor.
 * İkisi de istenen davranış. Sayı localStorage'a yazılıyor; yirmi dört oyun
 * çarpı seksen kısa dize birkaç kilobayt.
 */
export const GECMIS_SINIRI = 80

/**
 * Cevaplanan soruları geçmişe işler.
 *
 * Zaten listede olan kimlik sona taşınıyor: sıra "en son ne zaman görüldü"
 * demek ve ikinci görülüş ilkini eskitmeli. Sınır aşılınca en eskiler düşüyor.
 */
export function gecmiseIsle(
  gecmis: SoruGecmisi,
  oyun: OyunId,
  kimlikler: readonly string[],
  sinir: number = GECMIS_SINIRI,
): SoruGecmisi {
  if (kimlikler.length === 0) return gecmis
  const yeniler = new Set(kimlikler)
  const kalan = (gecmis[oyun] ?? []).filter((k) => !yeniler.has(k))
  // Aynı turda iki kez görülen soru (küçük havuz döndü) bir kez yazılıyor;
  // son görülüşü sayılıyor.
  const tekil = kimlikler.filter((k, i) => kimlikler.lastIndexOf(k) === i)
  const liste = [...kalan, ...tekil]
  return { ...gecmis, [oyun]: liste.slice(Math.max(0, liste.length - sinir)) }
}

/**
 * Bir soru şu listedeki kimliklerden hangisiyle geçmişte anılıyor.
 *
 * Tek dize yetmediği durumlar var: aynı il "haritada bul" ve "adını seç"
 * olarak iki ayrı kimlikle kaydediliyor, havuzdaki il ise tek. Böyle bir soru
 * adaylarından **herhangi biri** görüldüyse görülmüş sayılıyor.
 */
export type Anahtar<T> = (soru: T) => string | readonly string[]

/**
 * Yakın geçmişte görülenleri listenin sonuna atar.
 *
 * Görülmeyenler geldikleri sırayla önde kalıyor — liste zaten karıştırılmış
 * geliyor, rastgelelik oradan. Görülenler en eski görülüşten en yeniye doğru
 * diziliyor: iki tur önce görülen, az önce görülenden önce gelsin.
 *
 * Saf ve kararlı: aynı girdi aynı çıktıyı verir, testler buna dayanıyor.
 */
export function yakinlariSonaAt<T>(
  liste: readonly T[],
  gorulenler: readonly string[],
  anahtar: Anahtar<T>,
): T[] {
  if (gorulenler.length === 0 || liste.length === 0) return [...liste]

  // Kimlik → listedeki yeri (büyük = yakın). Aynı kimlik iki kez olmaz
  // (`gecmiseIsle` sona taşıyor) ama olursa sonuncusu geçerli.
  const yer = new Map<string, number>()
  gorulenler.forEach((k, i) => yer.set(k, i))

  const yakinlik = (soru: T): number => {
    const adaylar = anahtar(soru)
    const kimlikler = typeof adaylar === 'string' ? [adaylar] : adaylar
    let enYakin = -1
    for (const k of kimlikler) {
      const y = yer.get(k)
      if (y !== undefined && y > enYakin) enYakin = y
    }
    return enYakin
  }

  const gorulmeyenler: T[] = []
  const gorulenlerSirali: { soru: T; yakinlik: number; sira: number }[] = []
  liste.forEach((soru, sira) => {
    const y = yakinlik(soru)
    if (y < 0) gorulmeyenler.push(soru)
    else gorulenlerSirali.push({ soru, yakinlik: y, sira })
  })
  // Eşit yakınlıkta (aynı turda görülmüş) karışık sıra korunuyor.
  gorulenlerSirali.sort((a, b) => a.yakinlik - b.yakinlik || a.sira - b.sira)

  return [...gorulmeyenler, ...gorulenlerSirali.map((g) => g.soru)]
}
