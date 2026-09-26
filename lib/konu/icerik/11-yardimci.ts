import { kart, konu, sikli, soru, type Konu } from '../tip'

export type Secim = [soru: string, dogru: string, yanlis: string, aciklama: string]
export type Iddia = [ifade: string, dogru: boolean, aciklama: string]

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

/** Ek kartlar bir kavramın nedenini, kullanımını veya sınırını açar; sorular bilgi aktarımını yoklar. */
export type KonuDerinligi = {
  kartlar: [baslik: string, metin: string][]
  iddialar: Iddia[]
  secimler: Secim[]
  kontrol: Secim
  kontrolKarti: number
  ikinciKontrol?: Secim
  ikinciKontrolKarti?: number
}

function yanitYeri(anahtar: string): 0 | 1 {
  let ozet = 2166136261
  for (const harf of anahtar) ozet = Math.imul(ozet ^ harf.charCodeAt(0), 16777619)
  return (ozet >>> 0) % 2 as 0 | 1
}

export function onBirinciSinifKonusu(taslak: OnBirinciSinifKonusu, ek: KonuDerinligi): Konu {
  const kartlar = [...taslak.kartlar, ...ek.kartlar].map(([baslik, metin], dizin) =>
    kart(baslik, metin, undefined, dizin === 2 ? { not: taslak.not } : undefined),
  )
  const iddiaSorulari = [...ek.iddialar, ...taslak.iddialar]
    .map(([ifade, dogru, aciklama]) => soru(ifade, dogru, aciklama))
  const secimSorulari = ek.secimler.map(([metin, dogru, yanlis, aciklama]) => {
    const yanit = yanitYeri(`${taslak.id}:${metin}`)
    return sikli(metin, yanit === 0 ? [dogru, yanlis] : [yanlis, dogru], yanit, aciklama)
  })
  const sorular = secimSorulari.flatMap((secim, dizin) => [iddiaSorulari[dizin], secim])
    .concat(iddiaSorulari.slice(secimSorulari.length))
  const kontroller = ([
    [ek.kontrol, ek.kontrolKarti],
    ...(ek.ikinciKontrol && ek.ikinciKontrolKarti ? [[ek.ikinciKontrol, ek.ikinciKontrolKarti]] : []),
  ] as [Secim, number][]).map(([[metin, dogru, yanlis, aciklama], kartSirasi]) => {
    const yanit = yanitYeri(`${taslak.id}:kontrol:${metin}`)
    return {
      soru: metin,
      siklar: yanit === 0 ? [dogru, yanlis] as [string, string] : [yanlis, dogru] as [string, string],
      dogru: yanit,
      aciklama: { dogru: aciklama, yanlis: `Doğru cevap: ${dogru}. ${aciklama}` },
      kart: kartSirasi,
    }
  })
  return konu(taslak.id, taslak.ad, kartlar, sorular, kontroller)
}
