import { describe, expect, it } from 'vitest'
import { MASKOT_POZLARI } from '../maskot'
import { KART_POZLARI, kartPozlari } from './kart-maskotu'

/** Tekrarlanabilir rastgele dizi (mulberry32). */
function tohumlu(tohum: number): () => number {
  return () => {
    tohum = (tohum + 0x6d2b79f5) | 0
    let t = Math.imul(tohum ^ (tohum >>> 15), 1 | tohum)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('kartPozlari', () => {
  it('her poz üretilmiş pozlardan biri', () => {
    for (const poz of KART_POZLARI) expect(MASKOT_POZLARI).toContain(poz)
  })

  it('kart sayısı kadar poz veriyor', () => {
    for (const n of [0, 1, 5, 11, 12, 40]) expect(kartPozlari(n, tohumlu(n))).toHaveLength(n)
  })

  it('art arda iki kart aynı tavşanı göstermiyor', () => {
    for (let tohum = 1; tohum <= 500; tohum++) {
      const dizi = kartPozlari(60, tohumlu(tohum))
      for (let i = 1; i < dizi.length; i++) expect(dizi[i]).not.toBe(dizi[i - 1])
    }
  })

  it('liste bitmeden hiçbir poz ikinci kez çıkmıyor', () => {
    const n = KART_POZLARI.length
    for (let tohum = 1; tohum <= 100; tohum++) {
      const dizi = kartPozlari(n * 3, tohumlu(tohum))
      for (let t = 0; t < 3; t++) {
        expect(new Set(dizi.slice(t * n, (t + 1) * n)).size).toBe(n)
      }
    }
  })
})
