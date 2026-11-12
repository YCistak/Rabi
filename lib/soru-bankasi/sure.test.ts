import { describe, expect, it } from 'vitest'
import {
  anlikSoruSureleri,
  kisaSureYazisi,
  sayacDuraklat,
  sayacKur,
  sayacSoruDegistir,
  sayacSurdur,
  sayacYazisi,
  sureOzeti,
  sureYazisi,
  toplamSure,
} from './sure'

describe('test süresi', () => {
  it('süreyi soru soru biriktirir', () => {
    let sayac = sayacKur(3, 0)
    sayac = sayacSoruDegistir(sayac, 1, 5000)
    sayac = sayacSoruDegistir(sayac, 0, 12000)
    expect(anlikSoruSureleri(sayac, 13000)).toEqual([6000, 7000, 0])
    expect(toplamSure(sayac, 13000)).toBe(13000)
  })

  it('duraklatılınca saymaz, sürdürülünce kaldığı yerden sayar', () => {
    let sayac = sayacKur(2, 0)
    sayac = sayacDuraklat(sayac, 4000)
    expect(toplamSure(sayac, 60000)).toBe(4000)
    sayac = sayacSurdur(sayac, 60000)
    expect(toplamSure(sayac, 61000)).toBe(5000)
  })

  it('duraklatılmışken soru değişimi süre eklemez', () => {
    let sayac = sayacDuraklat(sayacKur(2, 0), 1000)
    sayac = sayacSoruDegistir(sayac, 1, 9000)
    expect(anlikSoruSureleri(sayac, 9000)).toEqual([1000, 0])
  })

  it('saat geri giderse eksiye düşmez', () => {
    expect(toplamSure(sayacKur(1, 5000), 1000)).toBe(0)
  })

  it('özet: toplam, soru başına ortalama, en uzun üç soru', () => {
    const ozet = sureOzeti([10000, 50000, 0, 30000, 40000])
    expect(ozet.toplam).toBe(130000)
    expect(ozet.ortalama).toBe(26000)
    expect(ozet.enUzun).toEqual([
      { sira: 1, sure: 50000 },
      { sira: 4, sure: 40000 },
      { sira: 3, sure: 30000 },
    ])
  })

  it('bir saniyeden kısa bakılan soru en uzunlara girmez', () => {
    expect(sureOzeti([500, 0]).enUzun).toEqual([])
  })

  it('yazılar', () => {
    expect(sayacYazisi(247000)).toBe('4:07')
    expect(sayacYazisi(3847000)).toBe('1:04:07')
    expect(sureYazisi(45000)).toBe('45 sn')
    expect(sureYazisi(492000)).toBe('8 dk 12 sn')
    expect(sureYazisi(480000)).toBe('8 dk')
    expect(kisaSureYazisi(40)).toBe('<1 dk')
    expect(kisaSureYazisi(492)).toBe('8 dk')
  })
})
