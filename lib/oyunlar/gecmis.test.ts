import { describe, expect, it } from 'vitest'
import { GECMIS_SINIRI, gecmiseIsle, yakinlariSonaAt, type SoruGecmisi } from './gecmis'
import { turSirasi, type Zorluk } from './ritim'

describe('gecmiseIsle', () => {
  it('kimlikleri eskiden yeniye ekliyor', () => {
    const g = gecmiseIsle({}, 'hucre', ['a', 'b'])
    expect(g.hucre).toEqual(['a', 'b'])
    expect(gecmiseIsle(g, 'hucre', ['c']).hucre).toEqual(['a', 'b', 'c'])
  })

  it('yeniden görülen kimlik sona taşınıyor, çoğalmıyor', () => {
    const g = gecmiseIsle({ hucre: ['a', 'b', 'c'] }, 'hucre', ['a'])
    expect(g.hucre).toEqual(['b', 'c', 'a'])
  })

  it('aynı turda iki kez görülen bir kez yazılıyor', () => {
    expect(gecmiseIsle({}, 'ses', ['a', 'b', 'a']).ses).toEqual(['b', 'a'])
  })

  it('sınırı aşınca en eskiler düşüyor', () => {
    const uzun = Array.from({ length: GECMIS_SINIRI + 5 }, (_, i) => `s${i}`)
    const g = gecmiseIsle({}, 'oge', uzun)
    expect(g.oge).toHaveLength(GECMIS_SINIRI)
    expect(g.oge?.[0]).toBe('s5')
  })

  it('oyunlar birbirine karışmıyor', () => {
    const g = gecmiseIsle(gecmiseIsle({}, 'hucre', ['a']), 'ses', ['a'])
    expect(g.hucre).toEqual(['a'])
    expect(g.ses).toEqual(['a'])
  })

  it('boş liste geçmişi değiştirmiyor', () => {
    const g: SoruGecmisi = { hucre: ['a'] }
    expect(gecmiseIsle(g, 'hucre', [])).toBe(g)
  })
})

describe('yakinlariSonaAt', () => {
  const anahtar = (s: string) => s

  it('görülmeyenler öne, sıraları bozulmadan', () => {
    expect(yakinlariSonaAt(['c', 'a', 'd', 'b'], ['a', 'b'], anahtar)).toEqual(['c', 'd', 'a', 'b'])
  })

  it('görülenler en eskiden en yeniye', () => {
    // b en son görüldü, a daha önce: a önce gelmeli.
    expect(yakinlariSonaAt(['b', 'a', 'x'], ['a', 'b'], anahtar)).toEqual(['x', 'a', 'b'])
  })

  it('geçmiş boşsa liste olduğu gibi', () => {
    expect(yakinlariSonaAt(['b', 'a'], [], anahtar)).toEqual(['b', 'a'])
  })

  it('birden çok aday kimlikten herhangi biri görüldüyse görülmüş sayılıyor', () => {
    const cok = (s: string) => [`${s}:bul`, `${s}:sec`]
    expect(yakinlariSonaAt(['a', 'b'], ['a:sec'], cok)).toEqual(['b', 'a'])
  })

  it('havuzun tamamı görüldüyse en uzun süredir görülmeyen önce', () => {
    expect(yakinlariSonaAt(['c', 'a', 'b'], ['a', 'b', 'c'], anahtar)).toEqual(['a', 'b', 'c'])
  })
})

describe('turSirasi + geçmiş', () => {
  type Ornek = { ad: string; zorluk: Zorluk }
  const havuz: Ornek[] = Array.from({ length: 10 }, (_, i) => ({ ad: `k${i}`, zorluk: 'kolay' }))

  it('önceki turda görülenler şeridin sonuna düşüyor', () => {
    const gorulenler = ['k0', 'k1', 'k2', 'k3']
    const akis = turSirasi(havuz, Math.random, 10, { gorulenler, anahtar: (s) => s.ad })
    const ilkAlti = akis.kolay.slice(0, 6).map((s) => s.ad)
    for (const g of gorulenler) expect(ilkAlti).not.toContain(g)
    expect(akis.kolay.slice(6).map((s) => s.ad)).toEqual(gorulenler)
  })

  it('geçmiş verilmezse davranış eskisi gibi', () => {
    const akis = turSirasi(havuz, Math.random, 10)
    expect(new Set(akis.kolay.map((s) => s.ad)).size).toBe(10)
  })
})
