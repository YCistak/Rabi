import { describe, expect, it } from 'vitest'
import { kesirParcala } from './kesir'

describe('kesirParcala', () => {
  it('sayı ve parantezli ifadeyi kesir yapar', () => {
    expect(kesirParcala('3/5 ile (x+1)/(x−2)')).toEqual([
      { tur: 'kesir', pay: '3', payda: '5' },
      { tur: 'metin', metin: ' ile ' },
      { tur: 'kesir', pay: '(x+1)', payda: '(x−2)' },
    ])
  })

  it('noktalamanın yanındaki kesri de tanır', () => {
    expect(kesirParcala('x/2, kaçtır?')).toEqual([
      { tur: 'kesir', pay: 'x', payda: '2' },
      { tur: 'metin', metin: ', kaçtır?' },
    ])
  })

  it('birim ve tarihi düz metin bırakır', () => {
    expect(kesirParcala('Hız 72 km/sa, debi 3 m/s ve tarih 12/10/2026.')).toEqual([
      { tur: 'metin', metin: 'Hız 72 km/sa, debi 3 m/s ve tarih 12/10/2026.' },
    ])
  })

  it('boşluklu bölmeyi kesir saymaz', () => {
    expect(kesirParcala('x / 2')).toEqual([{ tur: 'metin', metin: 'x / 2' }])
  })
})
