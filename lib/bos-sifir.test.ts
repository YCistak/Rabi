import { describe, expect, it } from 'vitest'
import { bosSifir, herhangiDolu } from './bos-sifir'

describe('bosSifir', () => {
  it('boş ve geçersiz metni 0 sayar', () => {
    expect(bosSifir('')).toBe(0)
    expect(bosSifir(undefined)).toBe(0)
    expect(bosSifir('abc')).toBe(0)
    expect(bosSifir('-3')).toBe(0)
  })
  it('sayıyı okur', () => {
    expect(bosSifir('60')).toBe(60)
    expect(bosSifir('0')).toBe(0)
  })
})

describe('herhangiDolu', () => {
  it('hepsi boşsa false', () => {
    expect(herhangiDolu('', '', undefined)).toBe(false)
    expect(herhangiDolu(' ')).toBe(false)
  })
  it('"0" yazılmışsa true', () => {
    expect(herhangiDolu('', '0')).toBe(true)
    expect(herhangiDolu('60', '', '')).toBe(true)
  })
})
