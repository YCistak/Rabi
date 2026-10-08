import { kart, konu, sikli, soru, type HizliKontrol, type Konu, type SoruKarti } from '../tip'

/**
 * 12. sınıf Türk Dili ve Edebiyatı için ortak yazım kalıbı. Metinler ders
 * dosyalarında; burada yalnız biçim ve cevap yerleşimi var.
 */
export type KontrolTaslagi = [soru: string, dogru: string, yanlis: string, aciklama: string, kart: number]

export type EdebiyatKonusu = {
  id: string
  ad: string
  kartlar: [baslik: string, metin: string][]
  /** Rabi notu: konu başına bir kartta (`notKarti`, 1'den başlar). */
  not: string
  notKarti: number
  kontrol: KontrolTaslagi
}

let kontrolSirasi = 0

export function edebiyatKonusu(taslak: EdebiyatKonusu): Konu {
  const kartlar = taslak.kartlar.map(([baslik, metin], sira) =>
    kart(baslik, metin, undefined, sira + 1 === taslak.notKarti ? { not: taslak.not } : undefined),
  )
  const [metin, dogru, yanlis, aciklama, kartSirasi] = taslak.kontrol
  const yanit = (kontrolSirasi++ % 2) as 0 | 1
  const kontrol: HizliKontrol = {
    soru: metin,
    siklar: yanit === 0 ? [dogru, yanlis] : [yanlis, dogru],
    dogru: yanit,
    aciklama: { dogru: aciklama, yanlis: `Doğru cevap: ${dogru}. ${aciklama}` },
    kart: kartSirasi,
  }
  return konu(taslak.id, taslak.ad, kartlar, [], [kontrol])
}

export type Iddia = [ifade: string, dogru: boolean, gerekce: string]
export type Secim = [metin: string, dogru: string, yanlis: string, gerekce: string]

let secimSirasi = 0

/** Şıklı soruların doğru şıkkı A/B sırayla; iki biçim iç içe dizilir. */
export function sorular(iddialar: Iddia[], secimler: Secim[]): Omit<SoruKarti, 'id'>[] {
  const dogruYanlis = iddialar.map(([ifade, dogru, gerekce]) => soru(ifade, dogru, gerekce))
  const ikiSikli = secimler.map(([metin, dogru, yanlis, gerekce]) => {
    const yanit = (secimSirasi++ % 2) as 0 | 1
    return sikli(metin, yanit === 0 ? [dogru, yanlis] : [yanlis, dogru], yanit, gerekce)
  })
  return ikiSikli.flatMap((secim, dizin) => [dogruYanlis[dizin], secim])
    .concat(dogruYanlis.slice(ikiSikli.length))
}
