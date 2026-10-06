import { describe, expect, it } from 'vitest'
import { cokmeTanitimKarari } from './cokme-tanitim'

describe('cokmeTanitimKarari', () => {
  it('bekleyen çökme yoksa tur başlar, pencere yok', () => {
    expect(cokmeTanitimKarari({ cokmeBekliyor: false, tanitimdaMi: false, turKapaniyor: false })).toEqual({ turBaslayabilir: true, soruGorunsun: false })
  })
  it('pencere bekliyorken tur başlamaz, pencere görünür', () => {
    expect(cokmeTanitimKarari({ cokmeBekliyor: true, tanitimdaMi: false, turKapaniyor: false })).toEqual({ turBaslayabilir: false, soruGorunsun: true })
  })
  it('tur sürerken gelen pencere ertelenir', () => {
    expect(cokmeTanitimKarari({ cokmeBekliyor: true, tanitimdaMi: true, turKapaniyor: false }).soruGorunsun).toBe(false)
  })
  it('turun kapanış animasyonunda da pencere beklemede kalır', () => {
    expect(cokmeTanitimKarari({ cokmeBekliyor: true, tanitimdaMi: false, turKapaniyor: true }).soruGorunsun).toBe(false)
  })
  it('hiçbir durumda ikisi birden görünmez', () => {
    for (const cokmeBekliyor of [false, true]) for (const tanitimdaMi of [false, true]) for (const turKapaniyor of [false, true]) {
      const k = cokmeTanitimKarari({ cokmeBekliyor, tanitimdaMi, turKapaniyor })
      // Pencere görünüyorsa ne tur sürüyor ne de yeni bir tur başlayabiliyor.
      if (k.soruGorunsun) {
        expect(tanitimdaMi || turKapaniyor).toBe(false)
        expect(k.turBaslayabilir).toBe(false)
      }
    }
  })
})
