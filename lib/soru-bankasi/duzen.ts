/**
 * Şıkların yerleşimi. Kısa şıklar alt alta dizilince beş satır (≈ 280 px)
 * tutuyor ve şekilli soruda şıklar ekranın altına düşüyordu; yan yana dizilince
 * soru, şekil ve şıklar çoğu zaman tek ekrana sığıyor.
 */
import { kesirParcala } from '../kesir'
import { simgeleriParcala } from './metin'

export type SikDuzeni = 'bes' | 'iki' | 'liste'

/** Beş sütunda ~62 px'lik hücreye sığan uzunluk ("108", "−3/4", "√5"). */
export const BES_SUTUN_EN_COK = 5
/** İki sütunda ~165 px'lik hücreye sığan uzunluk ("Yalnız I", "(−∞, −5]"). */
export const IKI_SUTUN_EN_COK = 12

/**
 * Ekranda kapladığı karakter sayısı: üst/alt simge yarım, üst üste çizilen
 * kesir pay ile paydanın uzunu kadar sayılır.
 */
export function gorunurUzunluk(metin: string): number {
  let uzunluk = 0
  for (const parca of simgeleriParcala(metin)) {
    if (parca.tur !== 'metin') {
      uzunluk += parca.metin.length / 2
      continue
    }
    for (const kesir of kesirParcala(parca.metin)) {
      uzunluk += kesir.tur === 'metin' ? Array.from(kesir.metin).length : Math.max(kesir.pay.length, kesir.payda.length)
    }
  }
  return uzunluk
}

export function sikDuzeni(siklar: readonly string[]): SikDuzeni {
  if (siklar.some((sik) => sik.includes('\n'))) return 'liste'
  const enUzun = Math.max(...siklar.map(gorunurUzunluk))
  if (enUzun <= BES_SUTUN_EN_COK) return 'bes'
  if (enUzun <= IKI_SUTUN_EN_COK) return 'iki'
  return 'liste'
}
