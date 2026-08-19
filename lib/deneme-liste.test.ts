import { describe, expect, it } from 'vitest'
import { denemeSatirlari, mevcutTurler, suzVeSirala } from './deneme-liste'
import { HAZIR_SABLONLAR } from './sablonlar'
import type { Deneme, Sablon } from './types'

const tyt = HAZIR_SABLONLAR.find((s) => s.id === 'tyt')!
const ayt = HAZIR_SABLONLAR.find((s) => s.tur === 'ayt')!
const sablonlar: Sablon[] = [tyt, ayt]

/** Tek derse doğru/yanlış yazan kısa yardımcı — netler kolay okunsun diye. */
function deneme(id: string, sablon: Sablon, tarih: string, dogru: number): Deneme {
  return {
    id,
    sablonId: sablon.id,
    ad: id,
    tarih,
    sonuclar: [{ dersId: sablon.dersler[0].id, dogru, yanlis: 0 }],
  }
}

const denemeler: Deneme[] = [
  deneme('t1', tyt, '2026-01-10', 10),
  deneme('a1', ayt, '2026-01-20', 30),
  deneme('t2', tyt, '2026-02-01', 25),
  deneme('t3', tyt, '2026-03-01', 15),
]

describe('denemeSatirlari', () => {
  it('tarih sırasında verir ve netleri hesaplar', () => {
    const satirlar = denemeSatirlari(denemeler, sablonlar)
    expect(satirlar.map((s) => s.deneme.id)).toEqual(['t1', 'a1', 't2', 't3'])
    expect(satirlar[0].ozet?.toplamNet).toBe(10)
  })

  it('değişimi aynı şablondaki bir önceki denemeye göre yazar', () => {
    const satirlar = denemeSatirlari(denemeler, sablonlar)
    const degisimler = Object.fromEntries(satirlar.map((s) => [s.deneme.id, s.degisim]))
    // a1 araya girse de t2, t1 ile karşılaştırılır.
    expect(degisimler).toEqual({ t1: null, a1: null, t2: 15, t3: -10 })
  })

  it('şablonu silinmiş denemeyi netsiz bırakır', () => {
    const satirlar = denemeSatirlari([deneme('x', tyt, '2026-01-01', 5)], [])
    expect(satirlar[0]).toMatchObject({ sablon: null, ozet: null, degisim: null })
  })
})

describe('mevcutTurler', () => {
  it('yalnızca kaydı olan türleri, sabit sırada verir', () => {
    expect(mevcutTurler(denemeSatirlari(denemeler, sablonlar))).toEqual(['tyt', 'ayt'])
  })

  it('şablonsuz kayıtlar tür üretmez', () => {
    expect(mevcutTurler(denemeSatirlari(denemeler, []))).toEqual([])
  })
})

describe('suzVeSirala', () => {
  const satirlar = denemeSatirlari(denemeler, sablonlar)

  it('türe göre süzer', () => {
    expect(suzVeSirala(satirlar, 'tyt', 'eski').map((s) => s.deneme.id)).toEqual([
      't1',
      't2',
      't3',
    ])
    expect(suzVeSirala(satirlar, 'ayt', 'eski').map((s) => s.deneme.id)).toEqual(['a1'])
  })

  it('tarihe göre iki yönde sıralar', () => {
    expect(suzVeSirala(satirlar, 'hepsi', 'yeni').map((s) => s.deneme.id)).toEqual([
      't3',
      't2',
      'a1',
      't1',
    ])
    expect(suzVeSirala(satirlar, 'hepsi', 'eski').map((s) => s.deneme.id)).toEqual([
      't1',
      'a1',
      't2',
      't3',
    ])
  })

  it('nete göre iki yönde sıralar', () => {
    expect(suzVeSirala(satirlar, 'hepsi', 'yuksek').map((s) => s.deneme.id)).toEqual([
      'a1',
      't2',
      't3',
      't1',
    ])
    expect(suzVeSirala(satirlar, 'hepsi', 'dusuk').map((s) => s.deneme.id)).toEqual([
      't1',
      't3',
      't2',
      'a1',
    ])
  })

  it('netsiz kayıtları her iki yönde de sona atar', () => {
    const karisik = denemeSatirlari([...denemeler, deneme('yok', tyt, '2026-04-01', 5)], [
      ayt,
    ])
    for (const sira of ['yuksek', 'dusuk'] as const) {
      const sonuncu = suzVeSirala(karisik, 'hepsi', sira).at(-1)
      expect(sonuncu?.ozet).toBeNull()
    }
  })

  it('kaynak listeyi değiştirmez', () => {
    const kopya = satirlar.map((s) => s.deneme.id)
    suzVeSirala(satirlar, 'hepsi', 'yuksek')
    expect(satirlar.map((s) => s.deneme.id)).toEqual(kopya)
  })
})
