import { describe, expect, it } from 'vitest'
import { gorunurUzunluk, sikDuzeni } from './duzen'

describe('şık düzeni', () => {
  it('sayılar beş sütuna dizilir', () => expect(sikDuzeni(['36', '45', '54', '72', '108'])).toBe('bes'))

  it('kesir paydasıyla değil, genişliğiyle sayılır', () => {
    expect(gorunurUzunluk('12/13')).toBe(2)
    expect(sikDuzeni(['1/2', '3/4', '√3/2', '5/12', '7/8'])).toBe('bes')
  })

  it('üs yarım sayılır', () => expect(gorunurUzunluk('2^(10)')).toBe(2))

  it('orta uzunluk iki sütun', () => {
    expect(sikDuzeni(['Yalnız I', 'I ve II', 'I ve III', 'II ve III', 'I, II ve III'])).toBe('iki')
  })

  it('uzun şık ya da satır sonu liste', () => {
    expect(sikDuzeni(['a', 'b', 'c', 'd', 'Fonksiyon birebir ve örtendir'])).toBe('liste')
    expect(sikDuzeni(['a', 'b', 'c', 'd', 'x\ny'])).toBe('liste')
  })
})
