import { describe, expect, it } from 'vitest'
import { gorunurUzunluk, sikDuzeni, sikDuzeniSec, sikDuzeniTercihiCoz } from './duzen'

describe('şık düzeni', () => {
  it('sayılar beş sütuna dizilir', () => expect(sikDuzeni(['36', '45', '54', '72', '108'])).toBe('bes'))

  it('kesir paydasıyla değil, genişliğiyle sayılır', () => {
    expect(gorunurUzunluk('12/13')).toBe(2)
    expect(sikDuzeni(['1/2', '3/4', '√3/2', '5/12', '7/8'])).toBe('bes')
  })

  it('üs yarım sayılır', () => expect(gorunurUzunluk('2^(10)')).toBe(2))

  it('orta uzunluk iki sütun', () => {
    expect(sikDuzeni(['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'])).toBe('iki')
  })

  it('uzun şık ya da satır sonu liste', () => {
    expect(sikDuzeni(['a', 'b', 'c', 'd', 'Fonksiyon birebir ve örtendir'])).toBe('liste')
    expect(sikDuzeni(['a', 'b', 'c', 'd', 'x\ny'])).toBe('liste')
  })
})

describe('şık düzeni tercihi', () => {
  const kisa = ['36', '45', '54', '72', '108']
  const orta = ['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III']
  const uzun = ['a', 'b', 'c', 'd', 'Fonksiyon birebir ve örtendir, tanım kümesi gerçek sayılardır']

  it('kitap düzeni uzunluğa göre seçer', () => {
    expect(sikDuzeniSec(kisa, 'kitap')).toBe('bes')
    expect(sikDuzeniSec(orta, 'kitap')).toBe('iki')
  })

  it('tek sütun hep liste', () => expect(sikDuzeniSec(kisa, 'tek')).toBe('liste'))

  it('iki sütun sığmayan uzun şıkta listeye düşer', () => {
    expect(sikDuzeniSec(kisa, 'iki')).toBe('iki')
    expect(sikDuzeniSec(uzun, 'iki')).toBe('liste')
  })

  it('kitap sayfası için daha dar sınırlar', () => {
    expect(sikDuzeni(['1/2', '3/4', '√3/2', '5/12', '7/8'], { bes: 3, iki: 13 })).toBe('bes')
    expect(sikDuzeni(['10000', '2', '3', '4', '5'], { bes: 3, iki: 13 })).toBe('iki')
  })

  it('bozuk tercih kitap olur', () => {
    expect(sikDuzeniTercihiCoz('iki')).toBe('iki')
    expect(sikDuzeniTercihiCoz(42)).toBe('kitap')
  })
})
