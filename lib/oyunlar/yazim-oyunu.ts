import type { OyunIstatistigi } from '../types'
import type { YazimSorusu } from './yazim-havuzu'
import { YAZIM_HAVUZU } from './yazim-havuzu'

/**
 * Yazım kuralları oyununun saf mantığı — React'e bağlı hiçbir şey yok, hepsi
 * test edilebilir.
 *
 * Puan tasarımı: tur sabit süreli, doğru cevap süre kazandırmaz, yanlış cevap
 * süre **götürür**. Cezasız bir turda rastgele dokunmak da yaklaşık aynı puanı
 * getirirdi (iki şık var, %50 tutturulur); ceza, bilmeden dokunmayı pahalı
 * yaparak oyunu gerçekten okumaya zorluyor.
 */

/** Bir turun süresi, saniye. */
export const TUR_SURESI = 60

/** Yanlış cevabın süreden götürdüğü saniye. */
export const YANLIS_CEZASI = 3

export type Sik = {
  metin: string
  dogruMu: boolean
}

/** Ekrana gelen tek soru: kaynak çift + karıştırılmış iki şık. */
export type OyunSorusu = {
  soru: YazimSorusu
  siklar: [Sik, Sik]
}

/** Verilen tek cevap; tur sonunda yanlışları listelemek için saklanır. */
export type Cevap = {
  soru: YazimSorusu
  dogruMu: boolean
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

/**
 * Bir turun soru sırası.
 *
 * Havuz baştan bir kez karıştırılıp sırayla tüketiliyor; her soruda rastgele
 * çekilseydi aynı kelime tur içinde iki kez çıkabilirdi. Doğru şıkkın hangi
 * tarafa düşeceği de her soruda ayrıca atılıyor — sabit olsaydı oyuncu birkaç
 * soruda konumu ezberler, kelimeye bakmayı bırakırdı.
 */
export function turHazirla(
  havuz: readonly YazimSorusu[] = YAZIM_HAVUZU,
  rastgele: () => number = Math.random,
): OyunSorusu[] {
  return karistir(havuz, rastgele).map((soru) => {
    const dogruSik: Sik = { metin: soru.dogru, dogruMu: true }
    const yanlisSik: Sik = { metin: soru.yanlis, dogruMu: false }
    const siklar: [Sik, Sik] =
      rastgele() < 0.5 ? [dogruSik, yanlisSik] : [yanlisSik, dogruSik]
    return { soru, siklar }
  })
}

export type TurOzeti = {
  dogru: number
  yanlis: number
  toplam: number
  /** Başarı oranı, 0–1. Hiç cevap verilmemişse 0. */
  oran: number
  /** Yanlış bilinen sorular — sonuç ekranı bunları kuralıyla birlikte gösterir. */
  yanlislar: YazimSorusu[]
  /** Hiç yanlış yapılmadı mı. En az bir cevap gerekiyor. */
  hatasiz: boolean
}

export function turOzeti(cevaplar: readonly Cevap[]): TurOzeti {
  const dogru = cevaplar.filter((c) => c.dogruMu).length
  const yanlis = cevaplar.length - dogru
  return {
    dogru,
    yanlis,
    toplam: cevaplar.length,
    oran: cevaplar.length > 0 ? dogru / cevaplar.length : 0,
    // Aynı kelime tur içinde tekrarlanmıyor, o yüzden ayrıca tekilleştirmeye gerek yok.
    yanlislar: cevaplar.filter((c) => !c.dogruMu).map((c) => c.soru),
    hatasiz: cevaplar.length > 0 && yanlis === 0,
  }
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
  ozet: TurOzeti,
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
export function rekorKirildiMi(mevcut: OyunIstatistigi | undefined, ozet: TurOzeti): boolean {
  return ozet.dogru > 0 && ozet.dogru > (mevcut?.enIyiDogru ?? 0)
}
