/**
 * Açılışta bekleyen Crashlytics raporlarıyla ne yapılacağı — saf karar.
 *
 * Bekleyen rapor yalnız çökmeden gelmiyor: WebView kanallarının
 * (`console.error`, `window.onerror`, `unhandledrejection`, kaynak yükleme
 * hatası) yazdığı non-fatal kayıtlar da aynı kuyruğa giriyor. Eskiden bunların
 * her biri için de "Bir aksaklık kaydettim" penceresi açılıyordu; kullanıcı
 * kapanmamış bir uygulama için her açılışta soru görüyordu (kullanıcı
 * kaldırttı, 2026-10). Artık pencere **yalnız gerçek çökmede** açılıyor.
 *
 * Çökme olmayan bekleyen raporlar için soru yok. Kalıcı bir "hep gönder"
 * izni de yok (Ayarlar'daki anahtar kaldırıldı, bkz.
 * `docs/kurallar/ag-ve-gizlilik.md`); onaysız hiçbir şey ağa çıkmayacağı için
 * bu raporlar gönderilmeden **siliniyor** — yoksa her açılışta birikirlerdi.
 *
 * `cevapsizCokme`: önceki bir açılışta gerçek çökme bulundu ama pencere
 * cevaplanmadan uygulama kapandı. Crashlytics `didCrashOnPreviousExecution`'ı
 * yalnız çökmeden hemen sonraki açılışta `true` döndürüyor; bu bayrak olmasa
 * o çökme raporu bir sonraki açılışta "çökme değil" sanılıp sessizce silinirdi.
 */

export type BekleyenRaporEylemi =
  /** Bekleyen rapor yok; hiçbir şey yapma. */
  | 'yok'
  /** Gerçek çökme: kullanıcıya pencereyle sor. */
  | 'sor'
  /** Çökme olmayan kayıtlar: sormadan, göndermeden sil. */
  | 'sil'

export interface BekleyenRaporDurumu {
  /** Crashlytics'te gönderilmeyi bekleyen rapor var mı. */
  bekleyen: boolean
  /** Önceki oturum gerçekten çökmeyle mi bitti. */
  cokme: boolean
  /** Daha önce sorulup cevaplanmamış bir çökme var mı (bkz. dosya başı). */
  cevapsizCokme: boolean
}

export function bekleyenRaporKarari(d: BekleyenRaporDurumu): BekleyenRaporEylemi {
  if (!d.bekleyen) return 'yok'
  if (d.cokme || d.cevapsizCokme) return 'sor'
  return 'sil'
}

/**
 * Cevaplanmamış çökme bayrağının anahtarı. Pencere açılmaya karar verilince
 * yazılıyor, "Gönder"/"Gönderme" ile siliniyor.
 */
export const CEVAPSIZ_COKME_ANAHTARI = 'rabi-cokme-cevapsiz-v1'
