import { describe, expect, it } from 'vitest'
import {
  OTURUM_EN_COK,
  oturumAnahtari,
  oturumlariCoz,
  oturumSil,
  oturumUyarla,
  oturumYaz,
  sonOturum,
  type OturumKaydi,
} from './oturum-kaydi'

const kayit = (ek: Partial<OturumKaydi> = {}): OturumKaydi => ({
  mod: 'deneme',
  sira: 3,
  gorunum: 'soru',
  secimler: { 0: 2, 3: 4 },
  elenenler: { 1: [0, 3] },
  supheliler: [3],
  paslar: [1],
  sureler: [12000, 4000, 0, 9000],
  zaman: 100,
  ...ek,
})

describe('yarım test kaydı', () => {
  it('anahtar ekrandaki test numarasıyla', () => expect(oturumAnahtari('mat9-mantik', 0)).toBe('mat9-mantik#1'))

  it('geçerli kayıt aynen okunur (JSON gidiş-dönüş)', () => {
    const ham = JSON.parse(JSON.stringify({ 'mat9-mantik#1': kayit() }))
    expect(oturumlariCoz(ham)).toEqual({ 'mat9-mantik#1': kayit() })
  })

  it('bozuk alanlar atılır, bozuk kayıt düşer', () => {
    const ham = {
      'a#1': { ...kayit(), secimler: { 0: 7, 1: 2, x: 1 }, supheliler: [2, 2, -1, 'a'], sureler: [5, 'x', -3] },
      'a#0': kayit(),
      b: kayit(),
      'c#2': { mod: 'oyun' },
      'd#3': 'metin',
    }
    const temiz = oturumlariCoz(ham)
    expect(Object.keys(temiz)).toEqual(['a#1'])
    expect(temiz['a#1'].secimler).toEqual({ 1: 2 })
    expect(temiz['a#1'].supheliler).toEqual([2])
    expect(temiz['a#1'].sureler).toEqual([5, 0, 0])
    expect(oturumlariCoz(null)).toEqual({})
    expect(oturumlariCoz([1])).toEqual({})
  })

  it('yazınca sınır aşılırsa en eski düşer, yazılan kalır', () => {
    let kayitlar = {}
    for (let i = 0; i < OTURUM_EN_COK; i++) kayitlar = oturumYaz(kayitlar, `k#${i + 1}`, kayit({ zaman: 1000 + i }))
    kayitlar = oturumYaz(kayitlar, 'yeni#1', kayit({ zaman: 1 }))
    expect(Object.keys(kayitlar)).toHaveLength(OTURUM_EN_COK)
    expect(kayitlar).toHaveProperty('yeni#1')
    expect(kayitlar).not.toHaveProperty('k#1')
  })

  it('silme', () => {
    const kayitlar = { 'a#1': kayit() }
    expect(oturumSil(kayitlar, 'a#1')).toEqual({})
    expect(oturumSil(kayitlar, 'b#1')).toBe(kayitlar)
  })

  it('kısalan teste uyarlanır', () => {
    const uyarlanmis = oturumUyarla(kayit({ sira: 9, secimler: { 0: 1, 5: 2 }, paslar: [1, 6], sureler: [1, 2, 3, 4, 5, 6] }), 3)
    expect(uyarlanmis.sira).toBe(2)
    expect(uyarlanmis.secimler).toEqual({ 0: 1 })
    expect(uyarlanmis.paslar).toEqual([1])
    expect(uyarlanmis.sureler).toEqual([1, 2, 3])
  })

  it('konunun en son çalışılan yarım testi', () => {
    const kayitlar = { 'a#1': kayit({ zaman: 5 }), 'a#3': kayit({ zaman: 9 }), 'ab#2': kayit({ zaman: 99 }) }
    expect(sonOturum(kayitlar, 'a')?.test).toBe(2)
    expect(sonOturum(kayitlar, 'yok')).toBeNull()
  })
})
