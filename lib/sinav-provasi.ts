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
export type KitapcikId = 'tyt' | 'ayt' | 'ydt'

/**
 * `ozel`: kullanıcının kendi yazdığı süre ("Süre gir"). Branş denemesi,
 * okulun deneme sınavı gibi süresi ÖSYM'nin yazmadığı bir oturum. Bir süre
 * yerinde MEB'in STS'si (40 dk) duruyordu; kullanıcı kaldırttı, sabit tek
 * bir süre yerine her öğrenci kendi süresini girsin istedi. Prova kimliği
 * hiçbir yere kaydedilmiyor, 'sts' kimliğinin eski bir kaydı yok.
 */
export type ProvaId = KitapcikId | 'ozel'

export type Prova = {
  id: ProvaId
  ad: string
  /** Sınav süresi, dakika. */
  dakika: number
  /** Kitapçıktaki toplam soru; kullanıcının süresinde bilinmiyor. */
  soru: number | null
}

/**
 * Süreler 2026 YKS kılavuzundan: TYT 165, AYT 180, YDT 120 dakika.
 *
 * Sayılar burada yazılı çünkü ÖSYM'nin kararı — soru sayısından türetilemez.
 */
const SURE: Record<KitapcikId, number> = { tyt: 165, ayt: 180, ydt: 120 }

/**
 * Kitapçıktaki testler. Soru sayısı bu tablodan **toplanıyor**, elle
 * yazılmıyor: aynı sayı `sablonlar.ts`te zaten duruyor ve iki yere yazılan bir
 * sayı ÖSYM dağılımı değişince birinde eski kalırdı.
 */
const TESTLER: Record<KitapcikId, OsymTest[]> = {
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

function soruSayisi(id: KitapcikId): number {
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

/**
 * "Süre gir"in sınırları, dakika. Üst sınır en uzun kitapçığın (AYT, 180)
 * üstünde bırakıldı: ek süreli öğrenci ya da art arda iki oturum da yazılabilsin.
 */
export const OZEL_PROVA_SINIRI = { enAz: 1, enCok: 300 } as const

/** Hiç süre girilmemişken kutuda duran değer. */
export const VARSAYILAN_OZEL_PROVA = 60

/**
 * Kayıtlı ya da yazılan süreyi sınırların içine alır. Sayı olmayan her şey
 * (eski kurulumda alan yok, bozuk kayıt) varsayılana düşüyor.
 */
export function ozelProvaSuresi(ham: unknown): number {
  if (typeof ham !== 'number' || !Number.isFinite(ham)) return VARSAYILAN_OZEL_PROVA
  return Math.min(OZEL_PROVA_SINIRI.enCok, Math.max(OZEL_PROVA_SINIRI.enAz, Math.round(ham)))
}

/** Kullanıcının kendi süresiyle prova. */
export function ozelProva(dakika: number): Prova {
  return { id: 'ozel', ad: 'Deneme', dakika: ozelProvaSuresi(dakika), soru: null }
}

/** Kimliğe göre hazır kitapçık provası; tanınmayan kimlikte `null`. */
export function provaBul(id: string | null): Prova | null {
  return PROVALAR.find((p) => p.id === id) ?? null
}

/**
 * Prova turunun seans kaydındaki ders adı.
 *
 * Seçilebilen derslerden (`CALISMA_DERSLERI`) biri değil: prova bir derse
 * değil bütün denemeye ait ve ders listesi on dersle sınırlı. Ad eskisi gibi
 * "Deneme Çözümü" kalıyor — liste kısalmadan önce seçilebilen bir addı ve eski
 * seanslar istatistikte bu adla duruyor; yenileri aynı dilime düşmeli.
 */
export const PROVA_DERSI = 'Deneme Çözümü'
