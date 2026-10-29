import { describe, expect, it } from 'vitest'
import { ayarlariNormalize } from './depo'
import { temaCoz, temaTercihiNormalize, VARSAYILAN_TEMA } from './tema'

describe('temaCoz', () => {
  it('koyu tema açıkken üç tercih × iki telefon modu', () => {
    expect(temaCoz('acik', false, true)).toBe('acik')
    expect(temaCoz('acik', true, true)).toBe('acik')
    expect(temaCoz('koyu', false, true)).toBe('koyu')
    expect(temaCoz('koyu', true, true)).toBe('koyu')
    expect(temaCoz('sistem', false, true)).toBe('acik')
    expect(temaCoz('sistem', true, true)).toBe('koyu')
  })

  it('koyu tema kapalıyken "Telefona uy" açık kalır, açık "koyu" tercihi yine koyu', () => {
    expect(temaCoz('sistem', true, false)).toBe('acik')
    expect(temaCoz('koyu', false, false)).toBe('koyu')
  })
})

describe('tema tercihi kaydı', () => {
  it('tanınmayan değer "Telefona uy"a düşer', () => {
    expect(VARSAYILAN_TEMA).toBe('sistem')
    expect(temaTercihiNormalize(undefined)).toBe('sistem')
    expect(temaTercihiNormalize('karanlik')).toBe('sistem')
    expect(temaTercihiNormalize('koyu')).toBe('koyu')
  })

  it('alanı olmayan eski kayıt — kurulumu bitmiş olsa da — "Telefona uy" olur', () => {
    expect(ayarlariNormalize({ kurulumTamamlandi: true }).tema).toBe('sistem')
    expect(ayarlariNormalize(null).tema).toBe('sistem')
    expect(ayarlariNormalize({ tema: 'acik' }).tema).toBe('acik')
  })
})
