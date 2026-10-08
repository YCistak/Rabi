import { describe, expect, it } from 'vitest'
import { HARITA_SINIFLARI, haritaSinifiBul, programBul, sinifDersleri } from './index'
import { MEZUN } from '../hesap'

describe('haritanın sınıfı', () => {
  it('öğrencinin kendi sınıfıyla açılıyor, mezunda seçim kalıyor', () => {
    expect(haritaSinifiBul(9)).toBe(9)
    expect(haritaSinifiBul(10)).toBe(10)
    expect(haritaSinifiBul(11)).toBe(11)
    expect(haritaSinifiBul(12)).toBe(12)
    expect(haritaSinifiBul(MEZUN)).toBeNull()
    expect(haritaSinifiBul(Number.NaN)).toBeNull()
  })

  it('12. sınıfta Matematik ve Coğrafya var (2018 programı)', () => {
    expect(HARITA_SINIFLARI).toEqual([9, 10, 11, 12])
    expect(sinifDersleri(12).map((ders) => ders.id)).toEqual(['matematik', 'cografya'])
    expect(programBul('matematik', 12)?.sinif).toBe(12)
    expect(programBul('fizik', 12)).toBeNull()
  })
})
