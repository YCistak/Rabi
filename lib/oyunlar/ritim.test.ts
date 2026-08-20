import { describe, expect, it } from 'vitest'
import type { OyunId } from '../types'
import {
  BOSS_ARALIGI,
  bossElMi,
  MATEMATIK_TUR_SORUSU,
  SORU_SURESI,
  ZORLUKLAR,
  bossMu,
  bossZorlugu,
  bossluMu,
  elerMi,
  sonSoruMu,
  soruSuresi,
} from './ritim'
import { TUR_SORU_SINIRI, turSirasi, zorluktaSuz, type Zorluk } from './ritim'
import { OYUNLAR } from './tanim'

type Ornek = { ad: string; zorluk: Zorluk }
const havuz: Ornek[] = [
  ...Array.from({ length: 12 }, (_, i) => ({ ad: `k${i}`, zorluk: 'kolay' as const })),
  ...Array.from({ length: 8 }, (_, i) => ({ ad: `o${i}`, zorluk: 'orta' as const })),
  ...Array.from({ length: 5 }, (_, i) => ({ ad: `z${i}`, zorluk: 'zor' as const })),
]

describe('zorluktaSuz', () => {
  it('yalnızca istenen zorluğu veriyor', () => {
    expect(zorluktaSuz(havuz, 'orta')).toHaveLength(8)
    expect(zorluktaSuz(havuz, 'orta').every((s) => s.zorluk === 'orta')).toBe(true)
  })
})

describe('turSirasi', () => {
  it('normal sorular seçilen zorluktan geliyor', () => {
    const sira = turSirasi(havuz, 'ses', 'kolay')
    for (const { soru, boss } of sira) if (!boss) expect(soru.zorluk).toBe('kolay')
  })

  it('boss bir üst zorluktan geliyor', () => {
    const sira = turSirasi(havuz, 'ses', 'kolay')
    const bosslar = sira.filter((s) => s.boss)
    expect(bosslar.length).toBeGreaterThan(0)
    for (const { soru } of bosslar) expect(soru.zorluk).toBe('orta')
  })

  it('zor seçilince boss da zor havuzundan geliyor', () => {
    const sira = turSirasi(havuz, 'ses', 'zor')
    for (const { soru } of sira) expect(soru.zorluk).toBe('zor')
  })

  it('boss tam onda bir geliyor', () => {
    const sira = turSirasi(havuz, 'ses', 'kolay')
    sira.forEach(({ boss }, i) => expect(boss).toBe((i + 1) % 10 === 0))
  })

  it('matematik sırasında hiç boss yok', () => {
    expect(turSirasi(havuz, 'islem', 'kolay').some((s) => s.boss)).toBe(false)
  })

  it('havuz tükenmeden tekrar başlamıyor', () => {
    // 12 kolay soru var; ilk 12 normal sorunun hepsi farklı olmalı.
    const normaller = turSirasi(havuz, 'ses', 'kolay')
      .filter((s) => !s.boss)
      .slice(0, 12)
      .map((s) => s.soru.ad)
    expect(new Set(normaller).size).toBe(12)
  })

  it('sınır kadar soru üretiyor', () => {
    expect(turSirasi(havuz, 'ses', 'kolay')).toHaveLength(TUR_SORU_SINIRI)
  })

  it('seçilen zorlukta soru yoksa tüm havuza düşüyor', () => {
    const yalnizKolay = havuz.filter((s) => s.zorluk === 'kolay')
    const sira = turSirasi(yalnizKolay, 'ses', 'zor', Math.random, 5)
    expect(sira).toHaveLength(5)
  })

  it('boş havuzda boş sıra veriyor', () => {
    expect(turSirasi([] as Ornek[], 'ses', 'kolay')).toEqual([])
  })
})

describe('bossZorlugu', () => {
  it('seçilenin bir üstünü veriyor', () => {
    expect(bossZorlugu('kolay')).toEqual({ zorluk: 'orta', cetin: false })
    expect(bossZorlugu('orta')).toEqual({ zorluk: 'zor', cetin: false })
  })

  it('zorda üst kalmadığı için çetine geçiyor', () => {
    expect(bossZorlugu('zor')).toEqual({ zorluk: 'zor', cetin: true })
  })

  it('her zorluk için bir boss tanımlı', () => {
    for (const z of ZORLUKLAR) expect(ZORLUKLAR).toContain(bossZorlugu(z).zorluk)
  })
})

describe('bossMu', () => {
  it('sözel oyunda onda bir geliyor', () => {
    expect(bossMu('ses', 9)).toBe(false)
    expect(bossMu('ses', 10)).toBe(true)
    expect(bossMu('ses', 11)).toBe(false)
    expect(bossMu('ses', 20)).toBe(true)
  })

  it('sıfırıncı soru boss değil', () => {
    expect(bossMu('ses', 0)).toBe(false)
  })

  it('matematik oyunlarında hiç gelmiyor', () => {
    for (const sira of [10, 20, 30, 100]) {
      expect(bossMu('islem', sira)).toBe(false)
      expect(bossMu('bolunme', sira)).toBe(false)
      expect(bossMu('aci', sira)).toBe(false)
      expect(bossMu('ucgen', sira)).toBe(false)
    }
  })
})

describe('bossElMi', () => {
  it('on eşleştirme dolunca sıradaki el boss', () => {
    expect(bossElMi(6, 0)).toBe(false)
    expect(bossElMi(12, 0)).toBe(true)
    expect(bossElMi(12, 1)).toBe(false)
    expect(bossElMi(24, 1)).toBe(true)
  })
})

describe('bossluMu', () => {
  it('matematik dersini dışarıda bırakıyor', () => {
    for (const oyun of OYUNLAR) {
      expect(bossluMu(oyun.id)).toBe(oyun.ders !== 'matematik')
    }
  })
})

/**
 * Süresi tek bir karara değil, bir yığın karara birden ait olan oyunlar.
 *
 * Eşleştirme oyunlarında bir "soru" tek eşleştirme ama süre elin tamamına
 * veriliyor. Zaman Şeridi'nde de bir soru beş kartın yerleştirilmesi demek.
 * Üst sınırları doğal olarak yüksek.
 */
const EL_SURELI: OyunId[] = ['edebiyat', 'antlasma', 'kavram', 'sirala']

describe('soruSuresi', () => {
  it('her oyun için süre tanımlı ve makul', () => {
    for (const oyun of OYUNLAR) {
      const sure = SORU_SURESI[oyun.id]
      expect(sure).toBeGreaterThanOrEqual(8)
      expect(sure, oyun.id).toBeLessThanOrEqual(EL_SURELI.includes(oyun.id) ? 60 : 30)
    }
  })

  it('boss normalden uzun', () => {
    const normal = soruSuresi('ses', null)
    expect(soruSuresi('ses', { zorluk: 'orta', cetin: false })).toBeGreaterThan(normal)
  })

  it('çetin boss normal bosstan kısa ama normal sorudan uzun', () => {
    const normal = soruSuresi('ses', null)
    const boss = soruSuresi('ses', { zorluk: 'zor', cetin: false })
    const cetin = soruSuresi('ses', { zorluk: 'zor', cetin: true })
    expect(cetin).toBeLessThan(boss)
    expect(cetin).toBeGreaterThan(normal)
  })

  it('tam sayı saniye döndürüyor', () => {
    for (const oyun of OYUNLAR) {
      expect(Number.isInteger(soruSuresi(oyun.id, { zorluk: 'zor', cetin: true }))).toBe(true)
    }
  })
})

describe('sonSoruMu', () => {
  it('bosslu oyunda tur kendiliğinden bitmiyor', () => {
    expect(sonSoruMu('ses', MATEMATIK_TUR_SORUSU)).toBe(false)
    expect(sonSoruMu('ses', 500)).toBe(false)
  })

  it('matematikte soru sayısı dolunca bitiyor', () => {
    expect(sonSoruMu('islem', MATEMATIK_TUR_SORUSU - 1)).toBe(false)
    expect(sonSoruMu('islem', MATEMATIK_TUR_SORUSU)).toBe(true)
  })

  it('tur uzunluğu boss aralığının katı', () => {
    expect(MATEMATIK_TUR_SORUSU % BOSS_ARALIGI).toBe(0)
  })
})

describe('elerMi', () => {
  it('her yanlış eliyor, doğru elemiyor', () => {
    expect(elerMi(false)).toBe(true)
    expect(elerMi(true)).toBe(false)
  })

  /** Banka turu tekrar turu: ilk yanlışta kapansa soru bankadan hiç düşmezdi. */
  it('banka turunda eleme yok', () => {
    expect(elerMi(false, true)).toBe(false)
    expect(elerMi(true, true)).toBe(false)
  })
})
