/**
 * Mini oyunların ortak tur mantığı — hangi oyun olduğundan bağımsız, saf.
 *
 * Süre, ceza ve rekor kuralları bilerek tek yerde: iki oyun farklı süreyle ya da
 * farklı ceza ile çalışsaydı rekorlar karşılaştırılamaz, "en iyi tur" rozeti de
 * anlamını yitirirdi.
 *
 * Puan tasarımı: tur sabit süreli, doğru cevap süre kazandırmaz, yanlış cevap
 * süre **götürür**. Cezasız bir turda rastgele denemek de yaklaşık aynı puanı
 * getirirdi; ceza, bilmeden cevaplamayı pahalı yapıyor.
 */

import type { OyunIstatistigi } from '../types'

/** Bir turun süresi, saniye. */
export const TUR_SURESI = 60

/** Yanlış cevabın süreden götürdüğü saniye. */
export const YANLIS_CEZASI = 3

/** Verilen tek cevap. `T` oyuna özgü soru tipi — tur sonunda yanlışları listelemek için. */
export type Cevap<T> = {
  soru: T
  dogruMu: boolean
}

export type TurOzeti<T> = {
  dogru: number
  yanlis: number
  toplam: number
  /** Başarı oranı, 0–1. Hiç cevap verilmemişse 0. */
  oran: number
  /** Yanlış bilinen sorular — sonuç ekranı bunları doğrusuyla gösterir. */
  yanlislar: T[]
  /** Hiç yanlış yapılmadı mı. En az bir cevap gerekiyor. */
  hatasiz: boolean
}

/** İstatistiğe yazılan asgari özet; hangi oyun olduğu bu noktada önemli değil. */
export type TurSayilari = {
  dogru: number
  yanlis: number
  hatasiz: boolean
}

export function turOzeti<T>(cevaplar: readonly Cevap<T>[]): TurOzeti<T> {
  const dogru = cevaplar.filter((c) => c.dogruMu).length
  const yanlis = cevaplar.length - dogru
  return {
    dogru,
    yanlis,
    toplam: cevaplar.length,
    oran: cevaplar.length > 0 ? dogru / cevaplar.length : 0,
    yanlislar: cevaplar.filter((c) => !c.dogruMu).map((c) => c.soru),
    hatasiz: cevaplar.length > 0 && yanlis === 0,
  }
}

/**
 * Fisher–Yates karıştırma. `rastgele` dışarıdan veriliyor ki testler sabit bir
 * üreteçle çalışabilsin.
 */
export function karistir<T>(dizi: readonly T[], rastgele: () => number = Math.random): T[] {
  const kopya = [...dizi]
  for (let i = kopya.length - 1; i > 0; i--) {
    const j = Math.floor(rastgele() * (i + 1))
    ;[kopya[i], kopya[j]] = [kopya[j], kopya[i]]
  }
  return kopya
}

/** `enAz` ile `enCok` arasında tam sayı (iki uç dahil). */
export function arasinda(enAz: number, enCok: number, rastgele: () => number): number {
  if (enCok <= enAz) return enAz
  return enAz + Math.floor(rastgele() * (enCok - enAz + 1))
}

/** Diziden rastgele bir eleman. Boş dizide çağrılmaz. */
export function sec<T>(dizi: readonly T[], rastgele: () => number): T {
  return dizi[Math.floor(rastgele() * dizi.length)]
}

/**
 * Kalan saniye. Pomodoro'daki gibi hedef zaman damgasından hesaplanıyor:
 * WebView arka plana atıldığında `setInterval` kısılıyor, sayarak ilerleyen bir
 * sayaç orada donup kalırdı.
 */
export function kalanSaniye(bitisZamani: number, simdi = Date.now()): number {
  return Math.max(0, Math.ceil((bitisZamani - simdi) / 1000))
}

/** Süre çubuğunun doluluğu, 0–1. */
export function sureOrani(kalan: number, toplam = TUR_SURESI): number {
  if (toplam <= 0) return 0
  return Math.min(1, Math.max(0, kalan / toplam))
}

// ---------------------------------------------------------------------------
// Rekor
// ---------------------------------------------------------------------------

export const BOS_ISTATISTIK: OyunIstatistigi = {
  enIyiDogru: 0,
  oynananTur: 0,
  toplamDogru: 0,
  toplamYanlis: 0,
  hatasizTur: 0,
  sonTarih: '',
}

/** Biten turu istatistiğe işler. Rekor kırılmadıysa `enIyiDogru` korunur. */
export function istatistigiGuncelle(
  mevcut: OyunIstatistigi | undefined,
  ozet: TurSayilari,
  tarih: string,
): OyunIstatistigi {
  const onceki = mevcut ?? BOS_ISTATISTIK
  return {
    enIyiDogru: Math.max(onceki.enIyiDogru, ozet.dogru),
    oynananTur: onceki.oynananTur + 1,
    toplamDogru: onceki.toplamDogru + ozet.dogru,
    toplamYanlis: onceki.toplamYanlis + ozet.yanlis,
    hatasizTur: onceki.hatasizTur + (ozet.hatasiz ? 1 : 0),
    sonTarih: tarih,
  }
}

/** Rekor bu turda kırıldı mı — sonuç ekranındaki "Yeni rekor!" için. */
export function rekorKirildiMi(mevcut: OyunIstatistigi | undefined, ozet: TurSayilari): boolean {
  return ozet.dogru > 0 && ozet.dogru > (mevcut?.enIyiDogru ?? 0)
}
