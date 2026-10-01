import { describe, expect, it } from 'vitest'
import { KOYU_ESIGI, mercekKonumu, parlaklik, parmaktanSira, rengiCoz } from './cam-menu'

describe('parmaktanSira', () => {
  it('şeridi eşit beşe bölüyor', () => {
    expect(parmaktanSira(10, 500, 5)).toBe(0)
    expect(parmaktanSira(250, 500, 5)).toBe(2)
    expect(parmaktanSira(499, 500, 5)).toBe(4)
  })
  it('şeridin dışına taşan parmak uçtaki sekmede kalıyor', () => {
    expect(parmaktanSira(-40, 500, 5)).toBe(0)
    expect(parmaktanSira(900, 500, 5)).toBe(4)
  })
  it('ölçü yoksa ilk sekme', () => {
    expect(parmaktanSira(10, 0, 5)).toBe(0)
  })
})

describe('mercekKonumu', () => {
  it('mercek parmağı ortasından izliyor', () => {
    expect(mercekKonumu(250, 500, 5)).toBe(200)
  })
  it('mercek şeridin dışına çıkmıyor', () => {
    expect(mercekKonumu(5, 500, 5)).toBe(0)
    expect(mercekKonumu(495, 500, 5)).toBe(400)
  })
})

describe('rengiCoz', () => {
  it('rgb ve rgba okunuyor', () => {
    expect(rengiCoz('rgb(248, 248, 247)')).toEqual({ r: 248, g: 248, b: 247 })
    expect(rengiCoz('rgba(217, 98, 47, 0.9)')).toEqual({ r: 217, g: 98, b: 47 })
  })
  it('boşluklu yeni yazım da okunuyor', () => {
    expect(rengiCoz('rgb(10 20 30 / 50%)')).toEqual({ r: 10, g: 20, b: 30 })
  })
  it('saydam zemin ton vermiyor', () => {
    expect(rengiCoz('rgba(0, 0, 0, 0)')).toBeNull()
    expect(rengiCoz('rgba(255, 255, 255, 0.1)')).toBeNull()
    expect(rengiCoz('transparent')).toBeNull()
  })
})

describe('parlaklik', () => {
  it('uygulamanın zemini açık, koyu kahve koyu', () => {
    expect(parlaklik({ r: 248, g: 248, b: 247 })).toBeGreaterThan(KOYU_ESIGI)
    expect(parlaklik({ r: 42, g: 33, b: 28 })).toBeLessThan(KOYU_ESIGI)
  })
  it('amber dolgu açık sayılıyor', () => {
    expect(parlaklik({ r: 217, g: 98, b: 47 })).toBeGreaterThan(KOYU_ESIGI)
  })
})
