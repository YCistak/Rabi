import { describe, expect, it } from 'vitest'
import { surumYeniMi } from './surum-karsilastir'

describe('surumYeniMi', () => {
  it('parçaları sayı olarak karşılaştırır', () => {
    expect(surumYeniMi('1.0.10', '1.0.9')).toBe(true)
    expect(surumYeniMi('1.0.9', '1.0.10')).toBe(false)
    expect(surumYeniMi('1.1.0', '1.0.4')).toBe(true)
  })

  it('aynı sürüm yeni sayılmaz', () => {
    expect(surumYeniMi('1.0.4', '1.0.4')).toBe(false)
    expect(surumYeniMi('1.1', '1.1.0')).toBe(false)
  })

  it('eksik parça sıfır sayılır', () => {
    expect(surumYeniMi('1.0.1', '1.0')).toBe(true)
    expect(surumYeniMi('2', '1.9.9')).toBe(true)
  })

  it('bozuk metin şeridi boşuna açmaz', () => {
    expect(surumYeniMi('', '1.0.4')).toBe(false)
    expect(surumYeniMi('abc', '1.0.4')).toBe(false)
  })
})
