import type { Gorsel } from '@/lib/konu/tip'

/** Soru Bankası'nın yayımlanmış, uygulamada kullanılan soru biçimi. */
export type BankaSorusu = {
  konu: string
  zorluk: 1 | 2 | 3
  soru: string
  onculler?: string[]
  gorsel?: Gorsel
  siklar: [string, string, string, string, string]
  dogru: 0 | 1 | 2 | 3 | 4
  cozum: string
}

export type SoruDurumu = '-' | 'd' | 'y'
export type SoruBankasiKaydi = Record<string, string>

/**
 * Bitirilen bir testin son çözüşü. `sure` saniye; `tarih` ISO zaman damgası.
 * Soru sırasına bağlı `SoruBankasiKaydi`ndan ayrı: o ilk cevabı tutar, bu son
 * çözüşün süresini ve sonucunu.
 */
export type TestSonucKaydi = { sure: number; dogru: number; yanlis: number; bos: number; tarih: string }

/** Konu kimliği → test numarası (1'den başlar, ekranda görünen "Test 3") → son sonuç. */
export type SoruBankasiTestleri = Record<string, Record<string, TestSonucKaydi>>

/**
 * Alıştırma: şık seçilince doğru/yanlış ve çözüm hemen görünür.
 * Deneme: cevaplar test bitince toplu değerlendirilir ve kayda o zaman yazılır.
 */
export type CalismaModu = 'alistirma' | 'deneme'
