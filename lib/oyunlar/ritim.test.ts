import { describe, expect, it } from 'vitest'
import type { OyunId } from '../types'
import {
  SORU_SURESI,
  TUR_SORU_SINIRI,
  ZORLUKLAR,
  akisUret,
  akisUzunlugu,
  akisiEsle,
  elerMi,
  soruSuresi,
  tekAkis,
  turSirasi,
  zorluktaSuz,
  type Zorluk,
} from './ritim'
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
  it('her şerit kendi zorluğundan geliyor', () => {
    const akis = turSirasi(havuz)
    for (const zorluk of ZORLUKLAR) {
      for (const soru of akis[zorluk]) expect(soru.zorluk, zorluk).toBe(zorluk)
    }
  })

  /*
    Şeritler aynı `sira` numarasıyla okunuyor: uyum seviyeyi kaydırdığında
    oyunun elinde her seviye için o numarada bir soru olmalı, yoksa seviye
    değişimi turu tanımsız bir soruya düşürür.
  */
  it('üç şerit de sınır kadar soru taşıyor', () => {
    const akis = turSirasi(havuz)
    for (const zorluk of ZORLUKLAR) expect(akis[zorluk], zorluk).toHaveLength(TUR_SORU_SINIRI)
    expect(akisUzunlugu(akis)).toBe(TUR_SORU_SINIRI)
  })

  it('havuz tükenmeden tekrar başlamıyor', () => {
    // 12 kolay soru var; ilk 12'sinin hepsi farklı olmalı.
    const ilkler = turSirasi(havuz).kolay.slice(0, 12).map((s) => s.ad)
    expect(new Set(ilkler).size).toBe(12)
  })

  it('bir zorlukta soru yoksa o şerit tüm havuza düşüyor', () => {
    const yalnizKolay = havuz.filter((s) => s.zorluk === 'kolay')
    const akis = turSirasi(yalnizKolay, Math.random, 5)
    expect(akis.zor).toHaveLength(5)
    for (const soru of akis.zor) expect(soru.zorluk).toBe('kolay')
  })

  it('boş havuzda boş şerit veriyor', () => {
    const akis = turSirasi([] as Ornek[])
    expect(akisUzunlugu(akis)).toBe(0)
  })
})

describe('tekAkis', () => {
  it('üç şerit de aynı listeyi veriyor', () => {
    const akis = tekAkis(['a', 'b', 'c'])
    expect(akis.kolay).toEqual(akis.orta)
    expect(akis.orta).toEqual(akis.zor)
    expect(akisUzunlugu(akis)).toBe(3)
  })
})

describe('akisUret', () => {
  it('her seviye için bir kez çağrılıyor', () => {
    const cagrilar: Zorluk[] = []
    const akis = akisUret((zorluk) => {
      cagrilar.push(zorluk)
      return [zorluk]
    })
    expect(new Set(cagrilar)).toEqual(new Set(ZORLUKLAR))
    expect(akis.zor).toEqual(['zor'])
  })
})

describe('akisiEsle', () => {
  it('her şeridi ayrı ayrı dönüştürüyor', () => {
    const akis = akisiEsle(tekAkis([1, 2]), (sayilar) => sayilar.map((s) => s * 2))
    expect(akis.orta).toEqual([2, 4])
  })
})

/**
 * Süresi tek bir karara değil, bir yığın karara birden ait olan oyunlar.
 *
 * Eşleştirme oyunlarında bir "soru" tek eşleştirme ama süre elin tamamına
 * veriliyor. Zaman Şeridi'nde de bir soru beş kartın yerleştirilmesi demek.
 * Üst sınırları doğal olarak yüksek.
 */
const EL_SURELI: OyunId[] = ['edebiyat', 'antlasma', 'kavram', 'sirala', 'formul']

describe('soruSuresi', () => {
  it('her oyun için süre tanımlı ve makul', () => {
    for (const oyun of OYUNLAR) {
      const sure = SORU_SURESI[oyun.id]
      expect(sure).toBeGreaterThanOrEqual(8)
      expect(sure, oyun.id).toBeLessThanOrEqual(EL_SURELI.includes(oyun.id) ? 60 : 30)
    }
  })

  /* Zorluk süreyi değiştirmiyor: seviye sorunun kendisini seçiyor. */
  it('tablodaki sayıyı olduğu gibi veriyor', () => {
    for (const oyun of OYUNLAR) {
      expect(soruSuresi(oyun.id), oyun.id).toBe(SORU_SURESI[oyun.id])
      expect(Number.isInteger(soruSuresi(oyun.id))).toBe(true)
    }
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
