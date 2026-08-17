import { describe, expect, it } from 'vitest'
import {
  HATIRLATMA_MESAJLARI,
  hatirlatmaMesaji,
  dakikayiKirp,
  hatirlatmaPlani,
  saatDegeri,
  saatYaz,
  saatiCoz,
  saatiKirp,
  sonrakiHatirlatma,
} from './hatirlatma'

/** Yerel saatle tarih kurar — bildirim saati yerel saate göre hesaplanıyor. */
function an(gun: number, saat: number, dakika = 0): Date {
  return new Date(2026, 7, gun, saat, dakika, 0, 0)
}

describe('sonrakiHatirlatma', () => {
  it('saat gelmediyse bugüne planlar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 14), 20, 0, false)
    expect(sonuc.getDate()).toBe(16)
    expect(sonuc.getHours()).toBe(20)
    expect(sonuc.getMinutes()).toBe(0)
  })

  /**
   * Saat geçtiyse bildirim "hemen" gönderilmemeli: kullanıcı 21'de uygulamayı
   * açtığında 20:00 hatırlatması, üstelik uygulama elindeyken patlardı.
   */
  it('saat geçtiyse yarına atar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 21), 20, 0, false)
    expect(sonuc.getDate()).toBe(17)
    expect(sonuc.getHours()).toBe(20)
  })

  /** Günde en fazla bir bildirim: bugün soru girildiyse bugünkü hak harcanmaz. */
  it('bugün soru girildiyse yarına atar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 14), 20, 0, true)
    expect(sonuc.getDate()).toBe(17)
  })

  it('tam saatinde de yarına atar', () => {
    // 20:00:00'da planlanan bildirim aynı anda tetiklenirdi
    expect(sonrakiHatirlatma(an(16, 20), 20, 0, false).getDate()).toBe(17)
  })

  it('ay sonunda sonraki aya geçer', () => {
    const sonuc = sonrakiHatirlatma(new Date(2026, 7, 31, 22), 20, 0, false)
    expect(sonuc.getMonth()).toBe(8)
    expect(sonuc.getDate()).toBe(1)
  })

  it('gece yarısı saati de çalışır', () => {
    const sonuc = sonrakiHatirlatma(an(16, 23), 0, 0, false)
    expect(sonuc.getDate()).toBe(17)
    expect(sonuc.getHours()).toBe(0)
  })
})

describe('hatirlatmaMesaji', () => {
  it('aynı gün için hep aynı mesajı verir', () => {
    expect(hatirlatmaMesaji('2026-08-16')).toEqual(hatirlatmaMesaji('2026-08-16'))
  })

  it('havuzun içinden seçer', () => {
    for (const gun of ['2026-08-16', '2026-01-01', '2025-12-31']) {
      expect(HATIRLATMA_MESAJLARI).toContainEqual(hatirlatmaMesaji(gun))
    }
  })

  it('farklı günlerde mesaj değişebiliyor', () => {
    const metinler = new Set(
      Array.from({ length: 30 }, (_, i) => hatirlatmaMesaji(`2026-08-${String(i + 1).padStart(2, '0')}`).metin),
    )
    expect(metinler.size).toBeGreaterThan(1)
  })
})

describe('hatirlatmaPlani', () => {
  it('zaman ve metni birlikte verir', () => {
    const plan = hatirlatmaPlani(an(16, 14), 20, 0, false)
    expect(plan.zaman.getDate()).toBe(16)
    expect(plan.baslik).toBeTruthy()
    expect(plan.metin).toBeTruthy()
  })

  /** Metin, bildirimin **düşeceği** güne göre seçilmeli; planlandığı güne göre değil. */
  it('metin bildirimin düştüğü güne göre seçilir', () => {
    const yarinaAtan = hatirlatmaPlani(an(16, 21), 20, 0, false)
    const ertesiGun = hatirlatmaPlani(an(17, 14), 20, 0, false)
    expect(yarinaAtan.metin).toBe(ertesiGun.metin)
  })
})

describe('özel saat', () => {
  it('dakikayı da hesaba katar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 21), 21, 30, false)
    expect(sonuc.getDate()).toBe(16)
    expect(sonuc.getHours()).toBe(21)
    expect(sonuc.getMinutes()).toBe(30)
  })

  it('dakikası geçmiş saat yarına kayar', () => {
    // 21:45'te 21:30 hatırlatması geçmiş sayılır; anında patlamamalı.
    const sonuc = sonrakiHatirlatma(new Date(2026, 7, 16, 21, 45), 21, 30, false)
    expect(sonuc.getDate()).toBe(17)
    expect(sonuc.getMinutes()).toBe(30)
  })

  /**
   * Saat elle girilebiliyor. Bozuk bir değer `setHours`'a girerse tarih sessizce
   * kayar (25 → ertesi günün 01'i) ve hatırlatma yanlış güne planlanırdı.
   */
  it('aralık dışı değerleri kırpar', () => {
    expect(saatiKirp(25)).toBe(23)
    expect(saatiKirp(-3)).toBe(0)
    expect(saatiKirp(Number.NaN)).toBe(20)
    expect(dakikayiKirp(90)).toBe(59)
    expect(dakikayiKirp(-1)).toBe(0)
    expect(dakikayiKirp(Number.NaN)).toBe(0)
  })

  it('saati okunur ve girdi biçiminde yazar', () => {
    expect(saatYaz(9, 5)).toBe('09.05')
    expect(saatYaz(21, 30)).toBe('21.30')
    expect(saatDegeri(9, 5)).toBe('09:05')
  })

  it('"HH:MM" metnini çözer, bozuğu reddeder', () => {
    expect(saatiCoz('07:45')).toEqual({ saat: 7, dakika: 45 })
    expect(saatiCoz('24:00')).toBeNull()
    expect(saatiCoz('12:60')).toBeNull()
    expect(saatiCoz('')).toBeNull()
    expect(saatiCoz('12.30')).toBeNull()
  })
})
