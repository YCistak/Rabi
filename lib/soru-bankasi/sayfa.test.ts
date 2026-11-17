import { describe, expect, it } from 'vitest'
import { SAYFA_BUTCESI, sayfaBul, sayfalaraBol, soruYuksekligi, testSayfalari } from './sayfa'
import type { BankaSorusu } from './tip'

const soru = (ek: Partial<BankaSorusu> = {}): BankaSorusu => ({
  konu: 'deneme',
  zorluk: 1,
  soru: 'x + 3 = 7 olduğuna göre x kaçtır?',
  siklar: ['1', '2', '3', '4', '5'],
  dogru: 3,
  cozum: '',
  ...ek,
})

const sekilli = soru({
  soru: 'Şekildeki ABC üçgeninde |AB| = 6 birim, |BC| = 8 birimdir. Buna göre ABC üçgeninin alanı kaç birimkaredir?',
  gorsel: { tur: 'koordinat', pencere: [0, 10, 0, 8] },
  siklar: ['12', '18', '24', '30', '36'],
})

const boylar = (sayfalar: number[][]) => sayfalar.map((s) => s.length)

describe('kitap sayfası yerleşimi', () => {
  it('kısa sorular dörder dizilir', () => {
    const sayfalar = testSayfalari(Array.from({ length: 12 }, () => soru()))
    expect(boylar(sayfalar)).toEqual([4, 4, 4])
  })

  it('şekilli sorular üçer dizilir', () => {
    expect(soruYuksekligi(sekilli)).toBeGreaterThan(soruYuksekligi(soru()) + 150)
    const sayfalar = testSayfalari(Array.from({ length: 12 }, () => sekilli))
    expect(boylar(sayfalar)).toEqual([3, 3, 3, 3])
  })

  it('sıra bozulmaz, her soru tam bir kez yer alır', () => {
    const yukseklikler = [300, 600, 250, 250, 700, 220, 230, 640, 260, 280, 590, 240]
    const sayfalar = sayfalaraBol(yukseklikler)
    expect(sayfalar.flat()).toEqual(yukseklikler.map((_, i) => i))
    for (const sayfa of sayfalar) {
      expect(sayfa.length).toBeGreaterThanOrEqual(3)
      expect(sayfa.length).toBeLessThanOrEqual(4)
    }
  })

  it('sayfa 3–4 soru; kalan zorunluysa (5 soru) küçük sayfa olur', () => {
    expect(boylar(sayfalaraBol([200, 200, 200, 200, 200]))).toEqual([3, 2])
    expect(boylar(sayfalaraBol([200, 200]))).toEqual([2])
    expect(boylar(sayfalaraBol([200, 200, 200, 200, 200, 200, 200]))).toEqual([4, 3])
    expect(sayfalaraBol([])).toEqual([])
  })

  it('bütçeye sığan sayfada dört soru', () => {
    const q = Math.floor(SAYFA_BUTCESI / 4)
    expect(boylar(sayfalaraBol(Array(8).fill(q)))).toEqual([4, 4])
  })

  it('uzun şıklar alt alta sayılır ve yükseklik artar', () => {
    const uzun = soru({
      siklar: [
        'Fonksiyon birebir ve örtendir',
        'Fonksiyon birebirdir, örten değildir',
        'Fonksiyon örtendir, birebir değildir',
        'Fonksiyon ne birebir ne örtendir',
        'Fonksiyon sabit fonksiyondur',
      ],
    })
    expect(soruYuksekligi(uzun)).toBeGreaterThan(soruYuksekligi(soru()) + 60)
  })

  it('sorunun sayfası bulunur', () => {
    const sayfalar = [
      [0, 1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    expect(sayfaBul(sayfalar, 5)).toBe(1)
    expect(sayfaBul(sayfalar, 9)).toBe(2)
    expect(sayfaBul(sayfalar, 99)).toBe(0)
  })
})
