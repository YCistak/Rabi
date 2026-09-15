import { describe, expect, it } from 'vitest'
import { isabetOrani, kapanisKademesi, sureYaz } from './kapanis'

describe('kapanisKademesi', () => {
  it('eşikler haritadaki yıldızlarla aynı: 90 harika, 50 iyi, altı tekrar', () => {
    expect(kapanisKademesi(10, 1)).toBe('harika')
    expect(kapanisKademesi(9, 1)).toBe('harika')
    expect(kapanisKademesi(9, 2)).toBe('iyi')
    expect(kapanisKademesi(5, 5)).toBe('iyi')
    expect(kapanisKademesi(5, 6)).toBe('tekrar')
    expect(kapanisKademesi(0, 3)).toBe('tekrar')
  })

  it('hiç soru yoksa tekrar; sıfıra bölme yok', () => {
    expect(isabetOrani(0, 0)).toBe(0)
    expect(kapanisKademesi(0, 0)).toBe('tekrar')
  })
})

describe('sureYaz', () => {
  it('dakika:saniye, saniye iki basamak', () => {
    expect(sureYaz(0)).toBe('0:00')
    expect(sureYaz(5_400)).toBe('0:05')
    expect(sureYaz(192_000)).toBe('3:12')
    expect(sureYaz(3_725_000)).toBe('62:05')
  })

  it('eksi süre sıfıra çekiliyor', () => {
    expect(sureYaz(-4000)).toBe('0:00')
  })
})
