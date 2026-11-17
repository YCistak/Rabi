import { describe, expect, it } from 'vitest'
import { kesirParcalariSec, simgeleriParcala } from './metin'

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

  it('birimleri düz, matematik kesirlerini kesir bırakır', () => {
    expect(kesirParcalariSec('kg/m³, g/cm³, km/sa, m/s², TL/kg')).toEqual([{ tur: 'metin', metin: 'kg/m³, g/cm³, km/sa, m/s², TL/kg' }])
    expect(kesirParcalariSec('3/4 ve a/b')).toEqual([
      { tur: 'kesir', pay: '3', payda: '4' },
      { tur: 'metin', metin: ' ve ' },
      { tur: 'kesir', pay: 'a', payda: 'b' },
    ])
  })

  it('dereceden sonraki ekleri düz metin tutar', () => {
    expect(simgeleriParcala("90°'dir ve 45°'lik")).toEqual([{ tur: 'metin', metin: "90°'dir ve 45°'lik" }])
  })
})
