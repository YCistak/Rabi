import { describe, expect, it } from 'vitest'
import { haftaBasi, tariheCevir, tariheYaz } from './utils'

describe('haftaBasi', () => {
  it('haftayı pazartesiden başlatır', () => {
    // 2026-08-16 pazar; ait olduğu hafta 10 Ağustos pazartesi başlar.
    expect(haftaBasi('2026-08-16')).toBe('2026-08-10')
    expect(haftaBasi('2026-08-10')).toBe('2026-08-10')
    expect(haftaBasi('2026-08-14')).toBe('2026-08-10')
  })

  it('pazartesi sonraki haftaya taşınmaz', () => {
    expect(haftaBasi('2026-08-17')).toBe('2026-08-17')
  })

  it('ay sınırını aşan haftayı doğru bulur', () => {
    // 1 Eylül 2026 salı → haftası 31 Ağustos pazartesi başlar.
    expect(haftaBasi('2026-09-01')).toBe('2026-08-31')
  })
})

describe('tariheYaz / tariheCevir', () => {
  it('gidiş-dönüş aynı tarihi verir', () => {
    expect(tariheYaz(tariheCevir('2026-03-07'))).toBe('2026-03-07')
  })

  it('yerel gece yarısını kullanır, UTC kaymasına düşmez', () => {
    const t = tariheCevir('2026-01-01')
    expect(t.getFullYear()).toBe(2026)
    expect(t.getMonth()).toBe(0)
    expect(t.getDate()).toBe(1)
  })

  it('tek haneli ay ve günü sıfırla doldurur', () => {
    expect(tariheYaz(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
