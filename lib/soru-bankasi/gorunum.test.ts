import { describe, expect, it } from 'vitest'
import {
  ataletAdimi,
  ciftDokunmaGorunumu,
  GORUNUM_BASI,
  gorunumKaydir,
  gorunumOlcekle,
  hizOlc,
  icerikNoktasi,
  kistirmaGorunumu,
  tekerlekFarki,
  tekerlekOlcegi,
} from './gorunum'

const olcu = { genislik: 400, yukseklik: 600, icerikYukseklik: 1500 }

describe('sayfa görünümü', () => {
  it('kaydırma içeriğin sonunda durur, %100 iken yatay kaymaz', () => {
    expect(gorunumKaydir(GORUNUM_BASI, -50, -2000, olcu)).toEqual({ olcek: 1, x: 0, y: -900 })
    expect(gorunumKaydir(GORUNUM_BASI, 0, 100, olcu)).toEqual(GORUNUM_BASI)
  })

  it('yakınlaşınca yatay da kayar', () => {
    const g = gorunumOlcekle(GORUNUM_BASI, 2, [0, 0], olcu)
    expect(gorunumKaydir(g, -1000, 0, olcu).x).toBe(-400)
  })

  it('ölçeklemede odaktaki içerik yerinde kalır', () => {
    const g = gorunumOlcekle({ olcek: 1, x: 0, y: -300 }, 2, [200, 300], olcu)
    expect(icerikNoktasi(g, [200, 300])).toEqual([200, 600])
  })

  it('ölçek 1 ile 4 arasında kalır', () => {
    expect(gorunumOlcekle(GORUNUM_BASI, 9, [0, 0], olcu).olcek).toBe(4)
    expect(gorunumOlcekle(GORUNUM_BASI, 0.3, [0, 0], olcu).olcek).toBe(1)
  })

  it('tekerlek: satır kipi piksele çevrilir, Shift yatay kaydırır', () => {
    expect(tekerlekFarki({ deltaX: 0, deltaY: 3, deltaMode: 1, shiftKey: false }, 600)).toEqual({ dx: 0, dy: 48 })
    expect(tekerlekFarki({ deltaX: 0, deltaY: 100, deltaMode: 0, shiftKey: true }, 600)).toEqual({ dx: 100, dy: 0 })
  })

  it('Ctrl+tekerlek yukarı yakınlaştırır, aşağı uzaklaştırır', () => {
    expect(tekerlekOlcegi(1, -100)).toBeGreaterThan(1.2)
    expect(tekerlekOlcegi(2, 100)).toBeLessThan(2)
    expect(tekerlekOlcegi(1, 100)).toBe(1)
  })

  it('kıstırma: parmaklar açılınca orta noktanın altındaki içerik yerinde büyür', () => {
    const g = kistirmaGorunumu(
      GORUNUM_BASI,
      { ilk: [150, 300], ikinci: [250, 300] },
      { ilk: [100, 300], ikinci: [300, 300] },
      olcu,
    )
    expect(g.olcek).toBe(2)
    expect(icerikNoktasi(g, [200, 300])).toEqual([200, 300])
  })

  it('kıstırma: iki parmak birlikte kayınca sayfa kayar', () => {
    const g = kistirmaGorunumu(
      GORUNUM_BASI,
      { ilk: [100, 400], ikinci: [200, 400] },
      { ilk: [100, 300], ikinci: [200, 300] },
      olcu,
    )
    expect(g).toEqual({ olcek: 1, x: 0, y: -100 })
  })

  it('çift dokunma %100 ile 2x arasında gider gelir', () => {
    const yakin = ciftDokunmaGorunumu(GORUNUM_BASI, [100, 100], olcu)
    expect(yakin.olcek).toBe(2)
    expect(ciftDokunmaGorunumu(yakin, [100, 100], olcu).olcek).toBe(1)
  })

  it('atalet söner ve yönünü korur', () => {
    const { hiz, kayma } = ataletAdimi([1, -0.5], 16)
    expect(hiz[0]).toBeLessThan(1)
    expect(kayma[0]).toBeGreaterThan(15)
    expect(kayma[1]).toBeLessThan(0)
  })

  it('hız son 100 milisaniyedeki hareketten ölçülür', () => {
    expect(
      hizOlc(
        [
          { x: 0, y: 0, zaman: 0 },
          { x: 0, y: 0, zaman: 900 },
          { x: 0, y: 50, zaman: 1000 },
        ],
        1000,
      ),
    ).toEqual([0, 0.5])
    expect(hizOlc([{ x: 0, y: 0, zaman: 0 }], 1000)).toEqual([0, 0])
  })
})
