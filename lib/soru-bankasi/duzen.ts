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

export type SikSinirlari = { bes: number; iki: number }

export function sikDuzeni(
  siklar: readonly string[],
  sinirlar: SikSinirlari = { bes: BES_SUTUN_EN_COK, iki: IKI_SUTUN_EN_COK },
): SikDuzeni {
  if (siklar.some((sik) => sik.includes('\n'))) return 'liste'
  const enUzun = Math.max(...siklar.map(gorunurUzunluk))
  if (enUzun <= sinirlar.bes) return 'bes'
  if (enUzun <= sinirlar.iki) return 'iki'
  return 'liste'
}

/**
 * Öğrencinin seçtiği şık düzeni (cihaz tercihi). `kitap` uzunluğa göre
 * kendiliğinden seçer (test kitabındaki gibi); `tek` hep alt alta; `iki`
 * sığdığı sürece iki sütun — iki sütuna sığmayan uzun şık yine alt alta
 * gelir, yoksa satır kırılıp okunmaz olurdu.
 */
export type SikDuzeniTercihi = 'kitap' | 'tek' | 'iki'
/** İki sütun zorlandığında bir hücreye (iki satıra kırılarak) sığan en uzun şık. */
export const IKI_SUTUN_ZORLA_EN_COK = 24

export function sikDuzeniSec(siklar: readonly string[], tercih: SikDuzeniTercihi): SikDuzeni {
  if (tercih === 'kitap') return sikDuzeni(siklar)
  if (tercih === 'tek') return 'liste'
  if (siklar.some((sik) => sik.includes('\n'))) return 'liste'
  return Math.max(...siklar.map(gorunurUzunluk)) <= IKI_SUTUN_ZORLA_EN_COK ? 'iki' : 'liste'
}

export function sikDuzeniTercihiCoz(ham: unknown): SikDuzeniTercihi {
  return ham === 'tek' || ham === 'iki' ? ham : 'kitap'
}
