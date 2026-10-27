import { describe, expect, it } from 'vitest'
import type { Kaynak } from './kaynak'
import { YAYINEVLERI, adinYayinevi, gecmisOneriler, yayineviOnerileri } from './yayinevleri'

const kaynak = (id: string, ad: string): Kaynak => ({
  id, ad, sinif: 12, ders: 'fizik', eklenme: '2026-10-27', bitenler: [],
})

describe('yayınevleri', () => {
  // Hiçbiri öne çıkarılmış görünmesin diye liste alfabetik.
  it('liste alfabetik ve tekrarsız', () => {
    const adlar = YAYINEVLERI.map((y) => y.on)
    expect(adlar).toEqual([...adlar].sort((a, b) => a.localeCompare(b, 'tr')))
    expect(new Set(adlar).size).toBe(adlar.length)
  })

  it('adın başındaki yayınevini tanır, uzun adı önce dener', () => {
    expect(adinYayinevi('Limit AYT Fizik')).toBe('Limit')
    expect(adinYayinevi('hız ve renk Geometri')).toBe('Hız ve Renk')
    expect(adinYayinevi('Limitsiz Fizik')).toBeNull()
    expect(adinYayinevi('Paraf')).toBe('Paraf')
  })

  it('yazdıkça süzülür: ad başı ya da kelime başı, harf farkı gözetmeden', () => {
    expect(yayineviOnerileri('')).toHaveLength(YAYINEVLERI.length)
    expect(yayineviOnerileri('lim')).toEqual(['Limit'])
    expect(yayineviOnerileri('HIZ')).toEqual(['Hız ve Renk'])
    expect(yayineviOnerileri('renk')).toEqual(['Hız ve Renk'])
    expect(yayineviOnerileri('cap')).toEqual(['Çap'])
    expect(yayineviOnerileri('pa')).toEqual(['Palme', 'Paraf'])
    expect(yayineviOnerileri('Fizik Soru')).toEqual([])
  })

  it('adın başında yayınevi varsa liste kapanır', () => {
    expect(yayineviOnerileri('Limit ')).toEqual([])
    expect(yayineviOnerileri('Limit AYT')).toEqual([])
  })
})

describe('geçmiş öneriler', () => {
  const liste = [kaynak('a', 'Limit AYT Fizik'), kaynak('b', 'Paraf Paragraf'), kaynak('c', 'Limit AYT Fizik')]

  it('yazılanı içeren eski adları tekrarsız önerir', () => {
    expect(gecmisOneriler(liste, 'limit')).toEqual(['Limit AYT Fizik'])
    expect(gecmisOneriler(liste, 'Par')).toEqual(['Paraf Paragraf'])
  })

  it('boş kutuda ve birebir aynı adda öneri yok', () => {
    expect(gecmisOneriler(liste, '  ')).toEqual([])
    expect(gecmisOneriler(liste, 'Paraf Paragraf')).toEqual([])
  })
})
