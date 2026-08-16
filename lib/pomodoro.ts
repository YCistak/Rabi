import type { PomodoroAyar } from './types'

/** Sayacın hangi aşamada olduğu. */
export type Asama = 'calisma' | 'kisa-mola' | 'uzun-mola'

export const ASAMA_ADI: Record<Asama, string> = {
  calisma: 'Çalışma',
  'kisa-mola': 'Kısa mola',
  'uzun-mola': 'Uzun mola',
}

/** Aşamanın dakika cinsinden uzunluğu. */
export function asamaSuresi(asama: Asama, ayar: PomodoroAyar): number {
  if (asama === 'calisma') return ayar.calisma
  if (asama === 'kisa-mola') return ayar.kisaMola
  return ayar.uzunMola
}

/**
 * Bir aşama bittiğinde sıradaki aşama.
 *
 * `tamamlananTur`, bu çalışma turu dahil kaçıncı turda olduğumuz. Uzun mola,
 * `turSayisi` kadar çalışma turu tamamlandığında gelir.
 */
export function sonrakiAsama(
  asama: Asama,
  tamamlananTur: number,
  ayar: PomodoroAyar,
): Asama {
  if (asama !== 'calisma') return 'calisma'
  const turBasi = ayar.turSayisi > 0 ? ayar.turSayisi : 4
  return tamamlananTur % turBasi === 0 ? 'uzun-mola' : 'kisa-mola'
}

/** Kalan saniyeyi "24:05" biçiminde yazar. */
export function sureYaz(kalanSaniye: number): string {
  const guvenli = Math.max(0, Math.floor(kalanSaniye))
  const dakika = Math.floor(guvenli / 60)
  const saniye = guvenli % 60
  return `${String(dakika).padStart(2, '0')}:${String(saniye).padStart(2, '0')}`
}

/**
 * Kalan saniye. Hedef zaman damgasından hesaplanır — `setInterval` sayarak
 * ilerlemiyor. WebView arka plana atıldığında zamanlayıcılar kısılıyor; hedef
 * zaman yaklaşımıyla ekran kapalı kalsa bile sayaç doğru bitiyor.
 */
export function kalanSaniye(bitisZamani: number, simdi = Date.now()): number {
  return Math.max(0, Math.ceil((bitisZamani - simdi) / 1000))
}

/** Aşamanın ne kadarının geçtiği, 0–1 arası. Halka bunu çizer. */
export function ilerlemeOrani(
  bitisZamani: number,
  toplamDakika: number,
  simdi = Date.now(),
): number {
  const toplamSaniye = toplamDakika * 60
  if (toplamSaniye <= 0) return 1
  return Math.min(1, Math.max(0, 1 - kalanSaniye(bitisZamani, simdi) / toplamSaniye))
}
