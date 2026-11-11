import { describe, expect, it } from 'vitest'
import { simgeleriParcala } from './metin'

describe('simgeleriParcala', () => {
  it('art arda gelen unicode üst simgelerini tek parçada toplar', () => {
    expect(simgeleriParcala('2⁽ᵗ⁄³⁾')).toEqual([
      { tur: 'metin', metin: '2' },
      { tur: 'ust', metin: 't/3' },
    ])
  })

  it('alt simge ve düz parantezli yazımı ayırır', () => {
    expect(simgeleriParcala('aₙ + x^(k+1) + y_(i)')).toEqual([
      { tur: 'metin', metin: 'a' },
      { tur: 'alt', metin: 'n' },
      { tur: 'metin', metin: ' + x' },
      { tur: 'ust', metin: 'k+1' },
      { tur: 'metin', metin: ' + y' },
      { tur: 'alt', metin: 'i' },
    ])
  })
})
