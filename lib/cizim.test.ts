import { describe, expect, it } from 'vitest'
import { cizimAnahtari, fotografKutusu, kayitOlcusu, oranla } from './cizim'

describe('fotografKutusu', () => {
  it('dikey fotoğraf geniş kutuda ortalanıyor, yanlarda boşluk kalıyor', () => {
    expect(fotografKutusu(400, 600, 1000, 2000)).toEqual({
      x: 50,
      y: 0,
      genislik: 300,
      yukseklik: 600,
    })
  })
  it('yatay fotoğrafın üstünde ve altında boşluk kalıyor', () => {
    const k = fotografKutusu(400, 600, 2000, 1000)
    expect(k).toEqual({ x: 0, y: 200, genislik: 400, yukseklik: 200 })
  })
  it('küçük fotoğraf büyütülmüyor', () => {
    expect(fotografKutusu(400, 600, 100, 50)).toEqual({ x: 150, y: 275, genislik: 100, yukseklik: 50 })
  })
  it('ölçü yokken boş kutu', () => {
    expect(fotografKutusu(400, 600, 0, 0).genislik).toBe(0)
  })
})

describe('oranla', () => {
  const kutu = { x: 0, y: 200, genislik: 400, yukseklik: 200 }
  it('fotoğrafın içindeki noktayı orana çeviriyor', () => {
    expect(oranla(200, 250, kutu)).toEqual([0.5, 0.25])
  })
  it('taşan noktayı kısmıyor — kenar boyunca çizgi sürüklenmesin', () => {
    expect(oranla(-40, 100, kutu)).toEqual([-0.1, -0.5])
    expect(oranla(600, 500, kutu)).toEqual([1.5, 1.5])
  })
})

describe('kayitOlcusu', () => {
  it('uzun kenarı sınırda kesiyor, oranı koruyor', () => {
    expect(kayitOlcusu(4000, 3000)).toEqual({ genislik: 1600, yukseklik: 1200 })
  })
  it('küçük fotoğrafı büyütmüyor', () => {
    expect(kayitOlcusu(800, 600)).toEqual({ genislik: 800, yukseklik: 600 })
  })
})

it('çizim anahtarı fotoğrafınkinden türüyor', () => {
  expect(cizimAnahtari('abc')).toBe('abc-cizim')
})
