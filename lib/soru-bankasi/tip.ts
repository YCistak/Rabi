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
