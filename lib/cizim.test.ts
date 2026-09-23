import { describe, expect, it } from 'vitest'
import {
  cizgiKalinligi,
  cizimAnahtari,
  fotografKutusu,
  KALINLIK_EN_AZ,
  KALINLIK_EN_COK,
  kalinlikDegeri,
  kalinlikOrani,
  kayitOlcusu,
  oranla,
  yakinlastir,
  YAKINLIK_YOK,
  yakinlikKaydir,
} from './cizim'

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

describe('kalınlık çubuğu', () => {
  it('uçlar sınırlara denk', () => {
    expect(kalinlikDegeri(0)).toBeCloseTo(KALINLIK_EN_AZ)
    expect(kalinlikDegeri(1)).toBeCloseTo(KALINLIK_EN_COK)
    expect(kalinlikDegeri(2)).toBeCloseTo(KALINLIK_EN_COK)
  })
  it('oran ile değer birbirinin tersi', () => {
    for (const t of [0, 0.2, 0.5, 0.9, 1]) expect(kalinlikOrani(kalinlikDegeri(t))).toBeCloseTo(t)
  })
  it('yakınlaştırınca kaydedilen çizgi inceliyor', () => {
    expect(cizgiKalinligi(0.02, 2)).toBeCloseTo(0.01)
  })
})

describe('yakınlaştırma', () => {
  it('ortayı yerinde tutarak yaklaşıyor', () => {
    const y = yakinlastir(YAKINLIK_YOK, 1)
    expect(y.olcek).toBe(1.5)
    expect(y.x).toBeCloseTo(-0.25)
    expect(y.y).toBeCloseTo(-0.25)
  })
  it('sınırlarda duruyor', () => {
    expect(yakinlastir(YAKINLIK_YOK, -1)).toEqual(YAKINLIK_YOK)
    let y = YAKINLIK_YOK
    for (let i = 0; i < 10; i++) y = yakinlastir(y, 1)
    expect(y.olcek).toBe(4)
  })
  it('uzaklaşınca kenar boşluğa açılmıyor', () => {
    const y = yakinlastir({ olcek: 2, x: -1, y: 0 }, -1)
    expect(y.olcek).toBe(1.5)
    expect(y.x).toBeGreaterThanOrEqual(-0.5)
    expect(y.y).toBeLessThanOrEqual(0)
  })
  it('kaydırma kutunun dışına taşmıyor', () => {
    expect(yakinlikKaydir({ olcek: 2, x: -0.5, y: -0.5 }, 5, -5)).toEqual({ olcek: 2, x: 0, y: -1 })
  })
})
