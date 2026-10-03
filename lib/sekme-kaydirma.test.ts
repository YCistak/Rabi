import { describe, expect, it } from 'vitest'
import { GECIS_ORANI, SAVRULMA_HIZI, SAVRULMA_YOLU, birakmaKarari, hedefYonu, komsuSekme } from './sekme-kaydirma-hesap'

const G = 390

describe('hedefYonu', () => {
  it('parmak sağa: soldaki sekme, sola: sağdaki', () => {
    expect(hedefYonu(120)).toBe(-1)
    expect(hedefYonu(-120)).toBe(1)
  })
})

describe('birakmaKarari', () => {
  it('ekranın üçte birini geçen kaydırma sekmeyi değiştiriyor, yavaş da olsa', () => {
    expect(birakmaKarari(G * GECIS_ORANI + 1, 0.05, G)).toBe(true)
    expect(birakmaKarari(-(G * GECIS_ORANI + 1), -0.05, G)).toBe(true)
  })
  it('kısa ve yavaş kaydırma yerine dönüyor', () => {
    expect(birakmaKarari(60, 0.1, G)).toBe(false)
  })
  it('kısa ama hızlı savrulma sekmeyi değiştiriyor', () => {
    expect(birakmaKarari(SAVRULMA_YOLU + 4, SAVRULMA_HIZI + 0.1, G)).toBe(true)
    expect(birakmaKarari(SAVRULMA_YOLU - 4, SAVRULMA_HIZI + 0.5, G)).toBe(false)
  })
  it('geri savrulan parmak vazgeçmek demek', () => {
    expect(birakmaKarari(G * 0.5, -(SAVRULMA_HIZI + 0.2), G)).toBe(false)
    expect(birakmaKarari(60, -(SAVRULMA_HIZI + 0.2), G)).toBe(false)
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
