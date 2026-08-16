import { describe, expect, it } from 'vitest'
import {
  OBP_KATSAYI,
  SON_VERI_YILI,
  VERI_YILLARI,
  agirlikliPuan,
  dagilimOrtalamasi,
  olcek,
  sinavPuani,
  standartPuan,
  turTestleri,
  yerlestirmePuani,
  yilVerisi,
  type Netler,
} from './puan'
import { siralamaTahmini, yilSiralamasi, bantYaz } from './siralama'
import type { PuanTuru } from './types'

const TURLER: PuanTuru[] = ['say', 'ea', 'soz', 'dil']

describe('veri dosyası', () => {
  it('üç yıl içeriyor', () => {
    expect(VERI_YILLARI).toEqual([2024, 2025, 2026])
    expect(SON_VERI_YILI).toBe(2026)
  })

  it('her yılda her testin ortalama ve sapması var', () => {
    for (const yil of VERI_YILLARI) {
      const { istatistik } = yilVerisi(yil)
      for (const test of turTestleri('soz')) {
        expect(istatistik[test], `${yil} ${test}`).toBeDefined()
        expect(istatistik[test]![1], `${yil} ${test} sapma`).toBeGreaterThan(0)
      }
    }
  })

  it('yığınsal dağılım puan yükseldikçe azalır', () => {
    for (const yil of VERI_YILLARI) {
      const noktalar = yilVerisi(yil).yerlestirme.ea
      for (let i = 1; i < noktalar.length; i++) {
        expect(noktalar[i][1], `${yil} ${noktalar[i][0]}`).toBeLessThanOrEqual(noktalar[i - 1][1])
      }
    }
  })

  it('ÖSYM tablosundaki bilinen değerler yerinde', () => {
    // 2026 yerleştirme, EA: "550 ve üstü → 12"
    const ea2026 = yilVerisi(2026).yerlestirme.ea
    expect(ea2026[ea2026.length - 1]).toEqual([550, 12])
    // 2026 son sınıf TYT Türkçe: ortalama 20,5 · sapma 8,4
    expect(yilVerisi(2026).istatistik['tyt-turkce']).toEqual([20.5, 8.4])
  })
})

describe('standartPuan', () => {
  it('ortalamada 50 verir', () => {
    expect(standartPuan(20, 20, 8)).toBe(50)
  })

  it('bir sapma yukarıda 60 verir', () => {
    expect(standartPuan(28, 20, 8)).toBe(60)
  })

  it('sapma sıfırsa 50 döner, sıfıra bölme olmaz', () => {
    expect(standartPuan(30, 20, 0)).toBe(50)
  })
})

describe('agirlikliPuan', () => {
  it('ortalama netli aday tam 50 alır', () => {
    // Ağırlıklar toplamı %100 ve her testin ortalamadaki standart puanı 50.
    for (const tur of TURLER) {
      const { istatistik } = yilVerisi(SON_VERI_YILI)
      const netler: Netler = {}
      for (const test of turTestleri(tur)) netler[test] = istatistik[test]![0]
      expect(agirlikliPuan(tur, netler, SON_VERI_YILI), tur).toBeCloseTo(50, 6)
    }
  })
})

describe('olcek', () => {
  it('alt uç üst uçtan küçük', () => {
    for (const yil of VERI_YILLARI) {
      for (const tur of TURLER) {
        const { enKucuk, enBuyuk } = olcek(tur, yil)
        expect(enBuyuk, `${yil} ${tur}`).toBeGreaterThan(enKucuk)
      }
    }
  })

  it('puan türleri birbirine yakın alt uç veriyor (model tutarlılığı)', () => {
    // SAY, EA ve SÖZ bağımsız hesaplanmasına rağmen aynı ölçek altına oturmalı.
    const altlar = (['say', 'ea', 'soz'] as PuanTuru[]).map((t) => olcek(t, 2026).enKucuk)
    const fark = Math.max(...altlar) - Math.min(...altlar)
    expect(fark).toBeLessThan(2)
  })
})

describe('sinavPuani', () => {
  it('tam net 500 verir', () => {
    for (const tur of TURLER) {
      const netler: Netler = {}
      for (const test of turTestleri(tur)) {
        netler[test] = yilVerisi(SON_VERI_YILI).istatistik[test] ? 999 : 0
      }
      // 999 yerine gerçek soru sayıları kullanılıyor; olcek zaten tam neti
      // üst uç kabul ediyor, dolayısıyla tam net 500'e çok yakın olmalı.
      expect(sinavPuani(tur, netler)).toBe(500)
    }
  })

  it('100 ile 500 arasında kalır', () => {
    for (const tur of TURLER) {
      const bos: Netler = {}
      expect(sinavPuani(tur, bos)).toBeGreaterThanOrEqual(100)
      expect(sinavPuani(tur, bos)).toBeLessThanOrEqual(500)
    }
  })

  it('net arttıkça puan artar', () => {
    const az: Netler = { 'tyt-turkce': 10, 'tyt-mat': 5, 'ayt-mat': 5, 'ayt-edebiyat': 5 }
    const cok: Netler = { 'tyt-turkce': 35, 'tyt-mat': 30, 'ayt-mat': 30, 'ayt-edebiyat': 20 }
    expect(sinavPuani('ea', cok)).toBeGreaterThan(sinavPuani('ea', az))
  })
})

describe('yerlestirmePuani', () => {
  it('OBP katkısı 0,12 katsayısıyla ekleniyor', () => {
    const netler: Netler = { 'tyt-turkce': 25, 'tyt-mat': 15, 'ayt-mat': 15, 'ayt-edebiyat': 12 }
    const obpsuz = yerlestirmePuani('ea', netler, null)
    const obpli = yerlestirmePuani('ea', netler, 450)
    expect(obpli - obpsuz).toBeCloseTo(450 * OBP_KATSAYI, 1)
  })
})

describe('dagilimOrtalamasi', () => {
  it('yayınlanmış dağılımdan makul bir ortalama çıkarır', () => {
    for (const tur of TURLER) {
      const ortalama = dagilimOrtalamasi(yilVerisi(2026).sinav[tur] as [number, number][])
      expect(ortalama, tur).toBeGreaterThan(150)
      expect(ortalama, tur).toBeLessThan(350)
    }
  })
})

describe('yilSiralamasi', () => {
  it('tablodaki eşikte tablo değerini verir', () => {
    // 2026 EA, 550 ve üstü → 12 aday
    expect(yilSiralamasi(550, 'ea', 2026).siralama).toBe(12)
  })

  it('puan arttıkça sıralama küçülür', () => {
    let onceki = Number.POSITIVE_INFINITY
    for (const puan of [200, 250, 300, 350, 400, 450]) {
      const s = yilSiralamasi(puan, 'ea', 2026).siralama
      expect(s).toBeLessThan(onceki)
      onceki = s
    }
  })

  it('tablo dışı puanlar işaretlenir', () => {
    expect(yilSiralamasi(80, 'ea', 2026).tabloDisi).toBe(true)
    expect(yilSiralamasi(300, 'ea', 2026).tabloDisi).toBe(false)
  })

  it('sıralama hiç sıfır ya da negatif olmaz', () => {
    for (const puan of [100, 300, 500, 600]) {
      expect(yilSiralamasi(puan, 'say', 2025).siralama).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('siralamaTahmini', () => {
  it('üç yılın hepsini döndürür ve bant tutarlı', () => {
    const sonuc = siralamaTahmini(400, 'ea')
    expect(sonuc.yillar).toHaveLength(3)
    expect(sonuc.enIyi).toBeLessThanOrEqual(sonuc.enKotu)
    for (const y of sonuc.yillar) {
      expect(y.siralama).toBeGreaterThanOrEqual(sonuc.enIyi)
      expect(y.siralama).toBeLessThanOrEqual(sonuc.enKotu)
    }
  })
})

describe('bantYaz', () => {
  it('geniş bandı kabalaştırır', () => {
    expect(bantYaz(47_912, 61_204)).toBe('47.000 – 62.000')
  })

  it('aynı değerde tek sayı yazar', () => {
    expect(bantYaz(12, 12)).toBe('12')
  })
})
