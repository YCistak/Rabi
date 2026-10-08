import { kart, konu, sikli, soru, type Gorsel, type Konu } from '../tip'

/** [ifade, doğru mu, gerekçe] */
export type Iddia = [ifade: string, dogru: boolean, gerekce: string]
/** [soru, doğru şık, yanlış şık, gerekçe] */
export type Secim = [soru: string, dogru: string, yanlis: string, gerekce: string]
/** [soru, doğru şık, yanlış şık, gerekçe, dayandığı kartın sırası (1'den)] */
export type Kontrol = [soru: string, dogru: string, yanlis: string, gerekce: string, kart: number]
export type KartGirdisi = [baslik: string, metin: string] | [baslik: string, metin: string, gorsel: Gorsel]

/**
 * 12. sınıf Tarih destesinin ortak yazım kalıbı (11. sınıf `onBirinciSinifKonusu`
 * kalıbının aynısı): kartlar, tek Rabi notu, iddialar, iki şıklı sorular ve
 * hızlı kontroller ders dosyalarında yazılır; burada yalnızca biçime dökülür.
 */
export type Tarih12Konusu = {
  id: string
  ad: string
  kartlar: KartGirdisi[]
  /** Rabi notu (≤ 120 karakter); `notKarti` (1'den) numaralı karta konur. */
  not: string
  notKarti?: number
  iddialar: Iddia[]
  secimler: Secim[]
  kontroller: Kontrol[]
}

/**
 * Şıklı soruların doğru şıkkı A/B sırayla gider: tek tek konuda da, bütün
 * derste de denge sapmaz. Sayaç içe aktarma sırasına bağlı, ama sıra sabit.
 */
let yanitSirasi = 0

export function tarih12Konusu(t: Tarih12Konusu): Konu {
  const notSirasi = (t.notKarti ?? 3) - 1
  const kartlar = t.kartlar.map(([baslik, metin, gorsel], dizin) =>
    kart(baslik, metin, gorsel, dizin === notSirasi ? { not: t.not } : undefined),
  )
  const iddiaSorulari = t.iddialar.map(([ifade, dogru, gerekce]) => soru(ifade, dogru, gerekce))
  const secimSorulari = t.secimler.map(([metin, dogru, yanlis, gerekce]) => {
    const yanit = (yanitSirasi++ % 2) as 0 | 1
    return sikli(metin, yanit === 0 ? [dogru, yanlis] : [yanlis, dogru], yanit, gerekce)
  })
  // İki biçim iç içe: iddia, şıklı, iddia, şıklı … kalan iddialar sona.
  const sorular = secimSorulari
    .flatMap((secim, dizin) => [iddiaSorulari[dizin], secim])
    .concat(iddiaSorulari.slice(secimSorulari.length))
  const kontroller = t.kontroller.map(([metin, dogru, yanlis, gerekce, kartSirasi]) => {
    const yanit = (yanitSirasi++ % 2) as 0 | 1
    return {
      soru: metin,
      siklar: yanit === 0 ? ([dogru, yanlis] as [string, string]) : ([yanlis, dogru] as [string, string]),
      dogru: yanit,
      aciklama: { dogru: gerekce, yanlis: `Doğru cevap: ${dogru}. ${gerekce}` },
      kart: kartSirasi,
    }
  })
  return konu(t.id, t.ad, kartlar, sorular, kontroller)
}
