import { describe, expect, it } from 'vitest'
import { CALISMA_DERSLERI, calismaSirasi } from './dersler'

describe('calismaSirasi', () => {
  it('hiç seans yoksa listenin kendi sırası', () => {
    expect(calismaSirasi([])).toEqual(CALISMA_DERSLERI)
  })

  it('en çok dakika çalışılan üç ders başa geliyor', () => {
    const sira = calismaSirasi([
      { dakika: 25, ders: 'Kimya' },
      { dakika: 50, ders: 'Tarih' },
      { dakika: 25, ders: 'Kimya' },
      { dakika: 90, ders: 'Fizik' },
      { dakika: 10, ders: 'Türkçe' },
    ])
    expect(sira.slice(0, 3)).toEqual(['Fizik', 'Kimya', 'Tarih'])
    expect(sira).toHaveLength(CALISMA_DERSLERI.length)
    expect(new Set(sira).size).toBe(CALISMA_DERSLERI.length)
  })

  it('listede olmayan ad sayılmıyor', () => {
    expect(calismaSirasi([{ dakika: 165, ders: 'Deneme Çözümü' }])).toEqual(CALISMA_DERSLERI)
  })
})
