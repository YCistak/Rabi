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

/** Bir turdaki pas hakkı. */
export const PAS_HAKKI = 5

/**
 * Verilen tek cevap. `T` oyuna özgü soru tipi — tur sonunda yanlışları listelemek için.
 *
 * Pas geçilen soru da bir cevap kaydı: `dogruMu` false, `pas` true. Pas
 * **bedelsiz** (kullanıcı seçti): yanlış sayılmaz, süreden götürmez, Sıfır
 * Tolerans'ta turu bitirmez, seriyi bozmaz. Yine de bilinmeyen bir soru, o
 * yüzden yanlışlarla birlikte tur sonunda listelenir ve Oyun Bankası'na düşer
 * (`dogruMu` false olan her kayıt gibi).
 *
 * Hak sınırı (`PAS_HAKKI`) sınırsız pasın bir kez kaldırılma sebebini
 * karşılıyor: "bilmiyorum" deyip geçmek ilk tercih oluyor ve tur soruya hiç
 * dokunmadan bitiyordu.
 */
export type Cevap<T> = {
  soru: T
  dogruMu: boolean
  pas?: boolean
}

export type TurOzeti<T> = {
  dogru: number
  yanlis: number
  toplam: number
  /** Başarı oranı, 0–1. Hiç cevap verilmemişse 0. */
  oran: number
  /** Pas geçilen soru sayısı; `yanlis`a dahil değil. */
  pas: number
  /**
   * Yanlış bilinen ve pas geçilen sorular — sonuç ekranı bunları doğrusuyla
   * gösterir. Pas da burada: bilinmeyen bir soru, bankaya da o yüzden düşüyor.
   */
  yanlislar: T[]
  /** Hiç yanlış yapılmadı mı. En az bir cevap gerekiyor. */
  hatasiz: boolean
  /** Tur içindeki en uzun ardışık doğru dizisi. */
  enIyiSeri: number
}

/** İstatistiğe yazılan asgari özet; hangi oyun olduğu bu noktada önemli değil. */
export type TurSayilari = {
  dogru: number
  yanlis: number
  hatasiz: boolean
  enIyiSeri: number
}

export function turOzeti<T>(cevaplar: readonly Cevap<T>[]): TurOzeti<T> {
  const dogru = cevaplar.filter((c) => c.dogruMu).length
  const pas = pasSayisi(cevaplar)
  const yanlis = cevaplar.length - dogru - pas
  // Toplam ve oran cevaplananlar üstünden: pas cevap değil, isabeti düşürmesin.
  const toplam = dogru + yanlis
  return {
    dogru,
    yanlis,
    toplam,
    pas,
    oran: toplam > 0 ? dogru / toplam : 0,
    yanlislar: cevaplar.filter((c) => !c.dogruMu).map((c) => c.soru),
    hatasiz: toplam > 0 && yanlis === 0,
    enIyiSeri: enIyiSeri(cevaplar),
  }
}

/** Turda pas geçilen soru sayısı. */
export function pasSayisi(cevaplar: readonly { pas?: boolean }[]): number {
  return cevaplar.filter((c) => c.pas).length
}

/**
 * Turdaki yanlış sayısı, pas hariç. Tur saatinin cezası (`useTurSayaci` →
 * `yanlisSayisi`) ve kabuğun sarsıntısı buna bakıyor: pas bedelsiz.
 */
export function yanlisSayisi(cevaplar: readonly { dogruMu: boolean; pas?: boolean }[]): number {
  return cevaplar.filter((c) => !c.dogruMu && !c.pas).length
}

/** Kalan pas hakkı. Ayrı bir sayaç tutulmuyor: cevap listesinden türüyor. */
export function kalanPas(cevaplar: readonly { pas?: boolean }[]): number {
  return Math.max(0, PAS_HAKKI - pasSayisi(cevaplar))
}

/**
 * Seri = arka arkaya verilen doğru cevap sayısı.
 *
 * Puanı etkilemiyor, ayrı bir ölçü olarak duruyor: seri çarpanı olsaydı eski
 * turlarda kurulan rekorlar yeni turlarla karşılaştırılamaz hâle gelirdi.
 * Yine de "kaç tanesini üst üste bildim" sorusu, toplam doğrudan farklı ve
 * gerçek bir beceri göstergesi.
 */
export function enIyiSeri(cevaplar: readonly { dogruMu: boolean; pas?: boolean }[]): number {
  let enIyi = 0
  let simdiki = 0
  for (const cevap of cevaplar) {
    // Pas seriyi ne bozuyor ne uzatıyor.
    if (cevap.pas) continue
    simdiki = cevap.dogruMu ? simdiki + 1 : 0
    if (simdiki > enIyi) enIyi = simdiki
  }
  return enIyi
}

/** Şu an devam eden seri — sondan geriye kaç doğru üst üste. */
export function guncelSeri(cevaplar: readonly { dogruMu: boolean; pas?: boolean }[]): number {
  let sayi = 0
  for (let i = cevaplar.length - 1; i >= 0; i--) {
    if (cevaplar[i].pas) continue
    if (!cevaplar[i].dogruMu) break
    sayi++
  }
  return sayi
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
  enIyiSeri: 0,
  oynananTur: 0,
  toplamDogru: 0,
  toplamYanlis: 0,
  hatasizTur: 0,
  sonTarih: '',
}

/**
 * Kayıtlı istatistiği güncel şemaya tamamlar.
 *
 * Gerekli, çünkü kayıtlar `useYerelDepo` ile ham JSON olarak okunuyor: sürüm
 * yükseltmesinde eklenen bir alan (`enIyiSeri` gibi) eski kayıtlarda yok ve
 * `Math.max(0, undefined)` NaN veriyor. NaN bir kez toplama karışınca hem ekranda
 * "NaN" yazıyor hem de her rozet eşiği sessizce sağlanamaz hâle geliyor.
 */
export function istatistigiTamamla(ham: Partial<OyunIstatistigi> | undefined): OyunIstatistigi {
  return { ...BOS_ISTATISTIK, ...ham }
}

/** Biten turu istatistiğe işler. Rekor kırılmadıysa `enIyiDogru` korunur. */
export function istatistigiGuncelle(
  mevcut: OyunIstatistigi | undefined,
  ozet: TurSayilari,
  tarih: string,
): OyunIstatistigi {
  const onceki = istatistigiTamamla(mevcut)
  return {
    enIyiDogru: Math.max(onceki.enIyiDogru, ozet.dogru),
    enIyiSeri: Math.max(onceki.enIyiSeri, ozet.enIyiSeri),
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
