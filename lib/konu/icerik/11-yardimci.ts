import { kart, konu, sikli, soru, type Konu } from '../tip'

type Secim = [soru: string, dogru: string, yanlis: string, aciklama: string]
type Iddia = [ifade: string, dogru: boolean, aciklama: string]

/** 11. sınıfın kısa desteleri için ortak yazım kalıbı; metinlerin tamamı ders dosyalarında yazılır. */
export type OnBirinciSinifKonusu = {
  id: string
  ad: string
  kartlar: [baslik: string, metin: string][]
  not: string
  iddialar: Iddia[]
  secimler: Secim[]
  kontrol: Secim
  kontrolKarti: number
}

export function onBirinciSinifKonusu(taslak: OnBirinciSinifKonusu, sira: number): Konu {
  const kartlar = taslak.kartlar.map(([baslik, metin], dizin) =>
    kart(baslik, metin, undefined, dizin === 2 ? { not: taslak.not } : undefined),
  )
  const sorular = [
    ...taslak.iddialar.map(([ifade, dogru, aciklama]) => soru(ifade, dogru, aciklama)),
    ...taslak.secimler.map(([metin, dogru, yanlis, aciklama], dizin) => {
      const yanit = (sira + dizin) % 2 as 0 | 1
      return sikli(metin, yanit === 0 ? [dogru, yanlis] : [yanlis, dogru], yanit, aciklama)
    }),
  ]
  const [metin, dogru, yanlis, aciklama] = taslak.kontrol
  const yanit = sira % 2 as 0 | 1
  return konu(taslak.id, taslak.ad, kartlar, sorular, [{
    soru: metin,
    siklar: yanit === 0 ? [dogru, yanlis] : [yanlis, dogru],
    dogru: yanit,
    aciklama: {
      dogru: aciklama,
      yanlis: `Doğru cevap: ${dogru}. ${aciklama}`,
    },
    kart: taslak.kontrolKarti,
  }])
}
