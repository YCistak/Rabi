import { describe, expect, it } from 'vitest'
import {
  denemeKarsilastir,
  ilerleyenDersler,
  istatistikOzeti,
  secimGuncelle,
  yon,
} from './istatistik'
import type { Deneme, Sablon } from './types'

const sablon: Sablon = {
  id: 's',
  ad: 'Deneme',
  tur: 'tyt',
  yanlisKatsayi: 4,
  hazir: false,
  dersler: [
    { id: 'tr', ad: 'Türkçe', soruSayisi: 40 },
    { id: 'mat', ad: 'Matematik', soruSayisi: 40 },
    { id: 'fel', ad: 'Felsefe', soruSayisi: 5 },
  ],
}

function deneme(id: string, tarih: string, tr: number, mat: number, fel: number): Deneme {
  return {
    id,
    sablonId: 's',
    ad: id,
    tarih,
    sonuclar: [
      { dersId: 'tr', dogru: tr, yanlis: 0 },
      { dersId: 'mat', dogru: mat, yanlis: 0 },
      { dersId: 'fel', dogru: fel, yanlis: 0 },
    ],
  }
}

describe('istatistikOzeti', () => {
  it('deneme yoksa null döner', () => {
    expect(istatistikOzeti([], sablon)).toBeNull()
  })

  it('tek denemede önceki ve ders farkı yok', () => {
    const o = istatistikOzeti([deneme('a', '2026-05-01', 20, 10, 3)], sablon)!
    expect(o.oncekiNet).toBeNull()
    expect(o.degisimler).toEqual([])
    expect(o.sonNet).toBe(33)
  })

  it('son deneme tarihten seçiliyor, kayıt sırasından değil', () => {
    const o = istatistikOzeti(
      [deneme('yeni', '2026-06-01', 30, 20, 4), deneme('eski', '2026-05-01', 20, 10, 5)],
      sablon,
    )!
    expect(o.sonNet).toBe(54)
    expect(o.oncekiNet).toBe(35)
    expect(o.sonDortNet).toEqual([35, 54])
    expect(ilerleyenDersler(o.degisimler).map((d) => d.dersId)).toEqual(['tr', 'mat'])
  })

  it('güçlü ders ham nete değil orana göre', () => {
    // Felsefe 5/5 (%100), Türkçe 30/40 (%75)
    const o = istatistikOzeti([deneme('a', '2026-05-01', 30, 10, 5)], sablon)!
    expect(o.enGucluDers).toBe('Felsefe')
    expect(o.enZayifDers).toBe('Matematik')
  })
})

describe('denemeKarsilastir', () => {
  it('A her zaman eski deneme', () => {
    const eski = deneme('e', '2026-05-01', 20, 10, 5)
    const yeni = deneme('y', '2026-06-01', 25, 8, 5)
    const k = denemeKarsilastir(yeni, eski, sablon)
    expect(k.a.id).toBe('e')
    expect(k.toplamFark).toBe(3)
    expect(k.artanlar.map((s) => s.dersId)).toEqual(['tr'])
    expect(k.azalanlar.map((s) => s.dersId)).toEqual(['mat'])
    expect(k.sabitler.map((s) => s.dersId)).toEqual(['fel'])
  })

  it('çeyrek netlerin kayan nokta artığı "değişmedi"yi bozmuyor', () => {
    expect(yon(0.1 + 0.2 - 0.3)).toBe('ayni')
  })
})

describe('secimGuncelle', () => {
  it('üçüncü seçim en eskisini düşürür, aynı seçim kaldırır', () => {
    expect(secimGuncelle(['a', 'b'], 'c')).toEqual(['b', 'c'])
    expect(secimGuncelle(['a', 'b'], 'a')).toEqual(['b'])
    expect(secimGuncelle([], 'a')).toEqual(['a'])
  })
})

describe('toplu grup girişi', () => {
  const tyt: Sablon = {
    id: 'tyt',
    ad: 'TYT',
    tur: 'tyt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'turkce', ad: 'Türkçe', soruSayisi: 40 },
      { id: 'fizik', ad: 'Fizik', soruSayisi: 7 },
      { id: 'kimya', ad: 'Kimya', soruSayisi: 7 },
      { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 6 },
    ],
  }
  const dersDers: Deneme = {
    id: 'a',
    sablonId: 'tyt',
    ad: 'a',
    tarih: '2026-05-01',
    sonuclar: [
      { dersId: 'turkce', dogru: 30, yanlis: 0 },
      { dersId: 'fizik', dogru: 5, yanlis: 0 },
      { dersId: 'kimya', dogru: 5, yanlis: 0 },
      { dersId: 'biyoloji', dogru: 5, yanlis: 0 },
    ],
  }
  const toplu: Deneme = {
    id: 'b',
    sablonId: 'tyt',
    ad: 'b',
    tarih: '2026-05-08',
    sonuclar: [{ dersId: 'turkce', dogru: 32, yanlis: 0 }],
    toplu: [{ grup: 'fen', dogru: 10, yanlis: 0 }],
  }

  it('toplu denemede grubun dersleri değişime girmez, sıfır sayılmaz', () => {
    const o = istatistikOzeti([dersDers, toplu], tyt)!
    expect(o.degisimler.map((d) => d.dersId)).toEqual(['turkce'])
    expect(o.sonNet).toBe(42)
    expect(o.topluNotlari).toEqual([{ grup: 'fen', ad: 'Fen', denemeSayisi: 1 }])
    // Biyoloji ortalaması yalnız ders ders girilen denemeden: 5/6, en güçlü o.
    // Sıfır sayılsaydı 2,5/6 olur, Türkçe'nin (31/40) altına düşerdi.
    expect(o.enGucluDers).toBe('Biyoloji')
  })

  it('karşılaştırma toplu grubu kıyaslamaz, belirtir', () => {
    const k = denemeKarsilastir(dersDers, toplu, tyt)
    expect([...k.artanlar, ...k.azalanlar, ...k.sabitler].map((s) => s.dersId)).toEqual(['turkce'])
    expect(k.topluGruplar).toEqual(['fen'])
    expect(k.toplamFark).toBe(-3)
  })

  it('toplu yoksa not boş', () => {
    expect(istatistikOzeti([dersDers], tyt)!.topluNotlari).toEqual([])
  })
})
