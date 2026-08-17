import type { OyunId, OyunIstatistigi, OyunKayitlari } from '../types'
import { BOS_ISTATISTIK, TUR_SURESI, YANLIS_CEZASI } from './yazim-oyunu'
import { HAVUZ_BOYUTU } from './yazim-havuzu'

/**
 * Mini oyun listesi.
 *
 * Oyunlar tek bir kayıt tablosundan besleniyor: istatistikler `rabi-oyunlar`
 * altında oyun kimliğine göre tutuluyor, rozetler de bütün oyunların toplamına
 * bakıyor. Yeni bir oyun eklemek için buraya bir satır ve bir ekran yetiyor —
 * depo ve rozet mantığına dokunmak gerekmiyor.
 */

export type OyunTanimi = {
  id: OyunId
  ad: string
  kisaAciklama: string
  ikon: string
  /** Tanıtım penceresindeki "nasıl oynanır" maddeleri. */
  nasilOynanir: string[]
}

export const OYUNLAR: OyunTanimi[] = [
  {
    id: 'yazim',
    ad: 'Yazım Ustası',
    kisaAciklama: 'Doğru yazılışı seç, süreye karşı yarış',
    ikon: '✍️',
    nasilOynanir: [
      `Ekrana bir kelime iki farklı yazılışıyla gelir; biri doğru, biri yaygın hatadır. Doğrusuna dokun.`,
      `Turun süresi ${TUR_SURESI} saniye. Doğru cevap süreyi uzatmaz, ${YANLIS_CEZASI} saniyeyi yanlış cevap götürür — emin değilsen okumadan dokunma.`,
      `Puanın tek turda bildiğin doğru sayısı. En yüksek puanın rekor olarak saklanır.`,
      `Havuzda ${HAVUZ_BOYUTU} soru var: TDK Yazım Kılavuzu'ndan ve ÖSYM'nin sık sorduğu başlıklardan derlendi.`,
      `Tur bitince yanlış bildiğin kelimeler kuralıyla birlikte listelenir — asıl öğrenme orada.`,
    ],
  },
]

export function oyunBul(id: OyunId): OyunTanimi {
  const oyun = OYUNLAR.find((o) => o.id === id)
  // Kimlik tipten geliyor; bulunamaması ancak liste bozulursa mümkün.
  if (!oyun) throw new Error(`Bilinmeyen oyun: ${id}`)
  return oyun
}

export type OyunToplami = {
  oynananTur: number
  toplamDogru: number
  hatasizTur: number
  /** Bütün oyunlardaki en yüksek tek tur puanı. */
  enIyiDogru: number
}

/** Rozetlerin baktığı toplam. Oyun ayrımı yok: hepsi "mini oyun" sayılıyor. */
export function oyunToplami(kayitlar: OyunKayitlari): OyunToplami {
  const hepsi = Object.values(kayitlar).filter(Boolean) as OyunIstatistigi[]
  return {
    oynananTur: hepsi.reduce((t, i) => t + i.oynananTur, 0),
    toplamDogru: hepsi.reduce((t, i) => t + i.toplamDogru, 0),
    hatasizTur: hepsi.reduce((t, i) => t + i.hatasizTur, 0),
    enIyiDogru: hepsi.reduce((t, i) => Math.max(t, i.enIyiDogru), 0),
  }
}

export function istatistikAl(kayitlar: OyunKayitlari, id: OyunId): OyunIstatistigi {
  return kayitlar[id] ?? BOS_ISTATISTIK
}
