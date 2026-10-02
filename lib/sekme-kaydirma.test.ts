import { describe, expect, it } from 'vitest'
import { EN_AZ_YOL, KENAR_PAYI, kaydirmaYonu, komsuSekme } from './sekme-kaydirma'

const G = 390

describe('kaydirmaYonu', () => {
  it('parmak sağa: soldaki sekme, sola: sağdaki', () => {
    expect(kaydirmaYonu(100, 120, 10, 250, G)).toBe(-1)
    expect(kaydirmaYonu(300, -120, 10, 250, G)).toBe(1)
  })
  it('kısa, dikey ya da yavaş hareket sekme değiştirmiyor', () => {
    expect(kaydirmaYonu(100, EN_AZ_YOL - 1, 0, 200, G)).toBe(0)
    expect(kaydirmaYonu(100, 120, 100, 200, G)).toBe(0)
    expect(kaydirmaYonu(100, 120, 0, 1500, G)).toBe(0)
  })
  it('kenardan başlayan hareket sistemin geri hareketi', () => {
    expect(kaydirmaYonu(KENAR_PAYI - 1, 150, 0, 200, G)).toBe(0)
    expect(kaydirmaYonu(G - KENAR_PAYI + 1, -150, 0, 200, G)).toBe(0)
  })
})

describe('komsuSekme', () => {
  it("Araçlar'ın solu Ana Sayfa, sağı Harita", () => {
    expect(komsuSekme('daha', -1)).toBe('ana')
    expect(komsuSekme('daha', 1)).toBe('harita')
  })
  it('uçlarda öte yok', () => {
    expect(komsuSekme('ana', -1)).toBeNull()
    expect(komsuSekme('ayarlar', 1)).toBeNull()
  })
})
