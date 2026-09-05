import { OSYM_TEST_SORU } from './sablonlar'
import type { OsymTest } from './types'

/**
 * Pomodoro'daki hazır sınav provaları.
 *
 * Pomodoro turu "biraz çalış, biraz dinlen" diyor; deneme kitapçığı ise tek
 * parça ve süresi ÖSYM tarafından yazılmış. İkisi aynı sayaçta ama ayrı
 * kurallarla çalışıyor: prova seçilince mola döngüsü, tur sayacı ve ders
 * çipleri devre dışı kalıyor — 165 dakikanın ortasında beş dakikalık kısa mola
 * vermek provayı prova olmaktan çıkarır.
 */
export type ProvaId = 'tyt' | 'ayt' | 'ydt'

export type Prova = {
  id: ProvaId
  ad: string
  /** Kitapçığın sınav süresi, dakika. */
  dakika: number
  /** Kitapçıktaki toplam soru. */
  soru: number
}

/**
 * Süreler 2026 YKS kılavuzundan: TYT 165, AYT 180, YDT 120 dakika.
 *
 * Sayılar burada yazılı çünkü ÖSYM'nin kararı — soru sayısından türetilemez.
 */
const SURE: Record<ProvaId, number> = { tyt: 165, ayt: 180, ydt: 120 }

/**
 * Kitapçıktaki testler. Soru sayısı bu tablodan **toplanıyor**, elle
 * yazılmıyor: aynı sayı `sablonlar.ts`te zaten duruyor ve iki yere yazılan bir
 * sayı ÖSYM dağılımı değişince birinde eski kalırdı.
 */
const TESTLER: Record<ProvaId, OsymTest[]> = {
  tyt: ['tyt-turkce', 'tyt-sosyal', 'tyt-mat', 'tyt-fen'],
  ayt: [
    'ayt-mat',
    'ayt-fizik',
    'ayt-kimya',
    'ayt-biyoloji',
    'ayt-edebiyat',
    'ayt-tarih1',
    'ayt-cografya1',
    'ayt-tarih2',
    'ayt-cografya2',
    'ayt-felsefe',
    'ayt-din',
  ],
  ydt: ['ydt'],
}

function soruSayisi(id: ProvaId): number {
  return TESTLER[id].reduce((toplam, test) => toplam + OSYM_TEST_SORU[test], 0)
}

export const PROVALAR: Prova[] = [
  {
    id: 'tyt',
    ad: 'TYT',
    dakika: SURE.tyt,
    soru: soruSayisi('tyt'),
  },
  {
    id: 'ayt',
    ad: 'AYT',
    dakika: SURE.ayt,
    /*
      AYT kitapçığı 160 soruluk ama kimse hepsini çözmüyor — sayısalcı 80'ini,
      sözelci kendi 80'ini işaretliyor. Süre yine de kitapçığın tamamının süresi.
    */
    soru: soruSayisi('ayt'),
  },
  {
    id: 'ydt',
    ad: 'YDT',
    dakika: SURE.ydt,
    soru: soruSayisi('ydt'),
  },
]

/** Kimliğe göre prova; tanınmayan kimlikte `null`. */
export function provaBul(id: string | null): Prova | null {
  return PROVALAR.find((p) => p.id === id) ?? null
}

/**
 * Prova turunun seans kaydındaki ders adı.
 *
 * `CALISMA_DERSLERI` içindeki "Deneme Çözümü" kullanılıyor, "TYT provası" gibi
 * yeni bir ad uydurulmuyor: istatistik ekranı seansları ders adına göre
 * topluyor ve listede olmayan bir ad orada tek başına bir dilim olurdu.
 */
export const PROVA_DERSI = 'Deneme Çözümü'
