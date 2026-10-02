import { describe, expect, it } from 'vitest'
import {
  baslangicHizi,
  CIKIS_EN_KISA_MS,
  CIKIS_EN_UZUN_MS,
  cikisHareketi,
  geriGidilmeli,
  hizOlc,
  YAYLANMA_EN_UZUN_MS,
  yaylanmaHareketi,
} from './geri-kaydirma-hesap'

// 60 Hz'de her karede bir örnek.
const ornekler = (adim: number, n: number, t0 = 0) =>
  Array.from({ length: n }, (_, i) => ({ t: t0 + i * 16, x: i * adim }))

describe('hizOlc', () => {
  it('tek örnekle hız 0', () => {
    expect(hizOlc([{ t: 0, x: 10 }], 0)).toBe(0)
  })

  it('son pencere içindeki eğimi verir', () => {
    // Kare başına 32 px = 2 px/ms
    expect(hizOlc(ornekler(32, 10), 9 * 16)).toBeCloseTo(2, 5)
  })

  it('yalnızca son pencereye bakar: önce yavaş sonra hızlı parmak hızlı sayılır', () => {
    const yavas = ornekler(2, 20)
    const son = yavas[yavas.length - 1]
    const hizli = Array.from({ length: 5 }, (_, i) => ({ t: son.t + (i + 1) * 16, x: son.x + (i + 1) * 40 }))
    const tum = [...yavas, ...hizli]
    expect(hizOlc(tum, tum[tum.length - 1].t)).toBeGreaterThan(2)
  })

  it('parmak durduktan sonra bırakılırsa hız 0', () => {
    const o = ornekler(30, 10)
    expect(hizOlc(o, o[o.length - 1].t + 200)).toBe(0)
  })

  it('sola giden parmak negatif hız', () => {
    const o = Array.from({ length: 6 }, (_, i) => ({ t: i * 16, x: 200 - i * 24 }))
    expect(hizOlc(o, 80)).toBeCloseTo(-1.5, 5)
  })
})

describe('geriGidilmeli', () => {
  it('sağa ya da durgun bırakınca geri gider', () => {
    expect(geriGidilmeli(0)).toBe(true)
    expect(geriGidilmeli(2)).toBe(true)
    expect(geriGidilmeli(-0.3)).toBe(true)
  })

  it('sola hızlı fırlatma vazgeçmektir', () => {
    expect(geriGidilmeli(-0.8)).toBe(false)
  })
})

describe('cikisHareketi', () => {
  it('ilk hızı parmağın hızına eşit (sınırlar içinde)', () => {
    const konum = 180
    const genislik = 390
    for (const v of [1, 1.5, 2.5]) {
      const h = cikisHareketi(konum, genislik, v, false)
      expect(h.sure).toBeGreaterThanOrEqual(CIKIS_EN_KISA_MS)
      expect(h.sure).toBeLessThanOrEqual(CIKIS_EN_UZUN_MS)
      expect(baslangicHizi(h, genislik - konum)).toBeCloseTo(v, 1)
    }
  })

  it('hızlı fırlatma yavaş bırakmadan kısa sürer', () => {
    const hizli = cikisHareketi(150, 390, 2, false)
    const yavas = cikisHareketi(150, 390, 0.2, false)
    expect(hizli.sure).toBeLessThan(yavas.sure)
  })

  it('durgun bırakınca en uzun süre ve duraktan kalkış', () => {
    const h = cikisHareketi(180, 390, 0, false)
    expect(h.sure).toBe(CIKIS_EN_UZUN_MS)
    expect(baslangicHizi(h, 210)).toBe(0)
  })

  it('çok hızlı fırlatmada süre alt sınırda, eğim üst sınırda', () => {
    const h = cikisHareketi(300, 390, 50, false)
    expect(h.sure).toBe(CIKIS_EN_KISA_MS)
    expect(h.egri).toBe('cubic-bezier(0.25, 1, 0.4, 1)')
  })

  it('azaltılmış harekette süre 0', () => {
    expect(cikisHareketi(100, 390, 2, true).sure).toBe(0)
  })

  it('zaten ekran dışındaysa süre 0', () => {
    expect(cikisHareketi(390, 390, 1, false).sure).toBe(0)
  })
})

describe('yaylanmaHareketi', () => {
  it('sola fırlatılan sayfa o hızla döner', () => {
    const h = yaylanmaHareketi(120, -1, false)
    expect(baslangicHizi(h, 120)).toBeCloseTo(1, 1)
  })

  it('sağa giderken bırakılan sayfa duraktan döner', () => {
    const h = yaylanmaHareketi(60, 1, false)
    expect(h.sure).toBe(YAYLANMA_EN_UZUN_MS)
    expect(baslangicHizi(h, 60)).toBe(0)
  })

  it('azaltılmış harekette süre 0', () => {
    expect(yaylanmaHareketi(60, 0, true).sure).toBe(0)
  })
})
