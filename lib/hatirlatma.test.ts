import { describe, expect, it } from 'vitest'
import {
  HATIRLATMA_MESAJLARI,
  hatirlatmaMesaji,
  hatirlatmaPlani,
  sonrakiHatirlatma,
} from './hatirlatma'

/** Yerel saatle tarih kurar — bildirim saati yerel saate göre hesaplanıyor. */
function an(gun: number, saat: number, dakika = 0): Date {
  return new Date(2026, 7, gun, saat, dakika, 0, 0)
}

describe('sonrakiHatirlatma', () => {
  it('saat gelmediyse bugüne planlar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 14), 20, false)
    expect(sonuc.getDate()).toBe(16)
    expect(sonuc.getHours()).toBe(20)
    expect(sonuc.getMinutes()).toBe(0)
  })

  /**
   * Saat geçtiyse bildirim "hemen" gönderilmemeli: kullanıcı 21'de uygulamayı
   * açtığında 20:00 hatırlatması, üstelik uygulama elindeyken patlardı.
   */
  it('saat geçtiyse yarına atar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 21), 20, false)
    expect(sonuc.getDate()).toBe(17)
    expect(sonuc.getHours()).toBe(20)
  })

  /** Günde en fazla bir bildirim: bugün soru girildiyse bugünkü hak harcanmaz. */
  it('bugün soru girildiyse yarına atar', () => {
    const sonuc = sonrakiHatirlatma(an(16, 14), 20, true)
    expect(sonuc.getDate()).toBe(17)
  })

  it('tam saatinde de yarına atar', () => {
    // 20:00:00'da planlanan bildirim aynı anda tetiklenirdi
    expect(sonrakiHatirlatma(an(16, 20), 20, false).getDate()).toBe(17)
  })

  it('ay sonunda sonraki aya geçer', () => {
    const sonuc = sonrakiHatirlatma(new Date(2026, 7, 31, 22), 20, false)
    expect(sonuc.getMonth()).toBe(8)
    expect(sonuc.getDate()).toBe(1)
  })

  it('gece yarısı saati de çalışır', () => {
    const sonuc = sonrakiHatirlatma(an(16, 23), 0, false)
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
    const plan = hatirlatmaPlani(an(16, 14), 20, false)
    expect(plan.zaman.getDate()).toBe(16)
    expect(plan.baslik).toBeTruthy()
    expect(plan.metin).toBeTruthy()
  })

  /** Metin, bildirimin **düşeceği** güne göre seçilmeli; planlandığı güne göre değil. */
  it('metin bildirimin düştüğü güne göre seçilir', () => {
    const yarinaAtan = hatirlatmaPlani(an(16, 21), 20, false)
    const ertesiGun = hatirlatmaPlani(an(17, 14), 20, false)
    expect(yarinaAtan.metin).toBe(ertesiGun.metin)
  })
})
