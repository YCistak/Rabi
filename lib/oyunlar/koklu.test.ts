import { describe, expect, it } from 'vitest'
import {
  CUBUK_EN_AZ,
  CUBUK_EN_COK,
  altSinir,
  aralikAciklamasi,
  aralikDogruMu,
  kokluTuruHazirla,
  soruKur,
  ustSinir,
  yakinUc,
  yaklasikDeger,
} from './koklu'

describe('altSinir / ustSinir', () => {
  it('kökün düştüğü aralığı veriyor', () => {
    expect(altSinir({ sayi: 50 })).toBe(7)
    expect(ustSinir({ sayi: 50 })).toBe(8)
    expect(altSinir({ sayi: 2 })).toBe(1)
    expect(altSinir({ sayi: 624 })).toBe(24)
    expect(ustSinir({ sayi: 624 })).toBe(25)
  })
})

describe('aralikDogruMu', () => {
  it('yalnızca en dar aralığı doğru sayıyor', () => {
    expect(aralikDogruMu({ sayi: 50 }, 7, 8)).toBe(true)
    // Doğru ama daraltılmamış: oyunun ölçtüğü şey tam olarak bu daraltma.
    expect(aralikDogruMu({ sayi: 50 }, 1, 25)).toBe(false)
    expect(aralikDogruMu({ sayi: 50 }, 6, 8)).toBe(false)
    expect(aralikDogruMu({ sayi: 50 }, 8, 9)).toBe(false)
  })
})

describe('yakinUc', () => {
  it('orta noktaya göre karar veriyor', () => {
    // 7² = 49, 8² = 64; orta nokta 7,5² = 56,25.
    expect(yakinUc({ sayi: 50 })).toBe(7)
    expect(yakinUc({ sayi: 56 })).toBe(7)
    expect(yakinUc({ sayi: 57 })).toBe(8)
    expect(yakinUc({ sayi: 63 })).toBe(8)
  })

  /**
   * Berabere biten soru olmamalı: orta nokta (k+0,5)² hiçbir zaman tam sayı
   * değil, o yüzden her sayı bir uca kesin olarak daha yakın.
   */
  it('her sayı bir uca kesin olarak yakın', () => {
    for (let sayi = 2; sayi <= 624; sayi++) {
      if (Number.isInteger(Math.sqrt(sayi))) continue
      const k = altSinir({ sayi })
      const altUzaklik = Math.sqrt(sayi) - k
      const ustUzaklik = k + 1 - Math.sqrt(sayi)
      expect(altUzaklik).not.toBe(ustUzaklik)
      expect(yakinUc({ sayi })).toBe(altUzaklik < ustUzaklik ? k : k + 1)
    }
  })
})

describe('soruKur', () => {
  it('üretilen sayı tam kare değil ve aralığın içinde', () => {
    for (let k = CUBUK_EN_AZ; k < CUBUK_EN_COK; k++) {
      for (let i = 0; i < 40; i++) {
        const soru = soruKur(k)
        expect(Number.isInteger(Math.sqrt(soru.sayi)), String(soru.sayi)).toBe(false)
        expect(altSinir(soru)).toBe(k)
      }
    }
  })
})

describe('kokluTuruHazirla', () => {
  it('istenen sayıda soru üretiyor', () => {
    expect(kokluTuruHazirla(20)).toHaveLength(20)
  })

  it('bütün sorular çubuğa sığıyor', () => {
    for (const soru of kokluTuruHazirla(400)) {
      expect(altSinir(soru)).toBeGreaterThanOrEqual(CUBUK_EN_AZ)
      expect(ustSinir(soru)).toBeLessThanOrEqual(CUBUK_EN_COK)
    }
  })

  it('aynı sayı arka arkaya gelmiyor', () => {
    const sorular = kokluTuruHazirla(400)
    for (let i = 1; i < sorular.length; i++) {
      expect(sorular[i].sayi).not.toBe(sorular[i - 1].sayi)
    }
  })

  /** Çubuğun sağ yarısı hiç kullanılmasaydı oyun tek uca sıkışırdı. */
  it('alt sınırlar çubuğa yayılıyor', () => {
    const sinirlar = new Set(kokluTuruHazirla(600).map(altSinir))
    expect(sinirlar.size).toBeGreaterThan(15)
  })
})

describe('metinler', () => {
  it('yaklaşık değer virgüllü yazılıyor', () => {
    expect(yaklasikDeger({ sayi: 50 })).toBe('7,07')
  })

  it('açıklama komşu tam kareleri gösteriyor', () => {
    expect(aralikAciklamasi({ sayi: 50 })).toBe('49 < 50 < 64')
  })
})
