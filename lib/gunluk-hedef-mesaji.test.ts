import { describe, expect, it } from 'vitest'
import { gunlukHedefMesaji } from './gunluk-hedef-mesaji'

describe('gunlukHedefMesaji', () => {
  it('aynı gün sabit, ertesi gün farklıdır', () => {
    const bugun = gunlukHedefMesaji(0, 200, '2026-09-27')
    expect(gunlukHedefMesaji(0, 200, '2026-09-27')).toBe(bugun)
    expect(gunlukHedefMesaji(0, 200, '2026-09-28')).not.toBe(bugun)
  })

  it('çözülen soru sayısına göre kalan miktarı doğru söyler', () => {
    expect(gunlukHedefMesaji(80, 200, '2026-09-27')).toContain('120')
    expect(gunlukHedefMesaji(200, 200, '2026-09-27')).toContain('Hedef')
  })
})
