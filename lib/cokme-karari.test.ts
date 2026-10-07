import { describe, expect, it } from 'vitest'
import { bekleyenRaporKarari } from './cokme-karari'

describe('bekleyenRaporKarari', () => {
  it('bekleyen rapor yoksa hiçbir şey yapılmaz', () => {
    expect(bekleyenRaporKarari({ bekleyen: false, cokme: false, cevapsizCokme: false })).toBe('yok')
    expect(bekleyenRaporKarari({ bekleyen: false, cokme: true, cevapsizCokme: true })).toBe('yok')
  })

  it('gerçek çökmede pencere açılır', () => {
    expect(bekleyenRaporKarari({ bekleyen: true, cokme: true, cevapsizCokme: false })).toBe('sor')
  })

  it('çökme olmayan kayıtlar (console.error vb.) sorulmadan silinir', () => {
    expect(bekleyenRaporKarari({ bekleyen: true, cokme: false, cevapsizCokme: false })).toBe('sil')
  })

  it('önceki açılışta cevaplanmamış çökme yeniden sorulur', () => {
    expect(bekleyenRaporKarari({ bekleyen: true, cokme: false, cevapsizCokme: true })).toBe('sor')
  })
})
