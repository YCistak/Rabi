import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { MASKOT_POZLARI, gununPozu, pozGorseli } from './maskot'

describe('maskot pozları', () => {
  it('her pozun üretilmiş bir dosyası var', () => {
    const eksik = MASKOT_POZLARI.filter(
      (poz) => !existsSync(join(process.cwd(), 'public', pozGorseli(poz))),
    )
    expect(eksik).toEqual([])
  })

  it('poz adları tekrarlanmıyor', () => {
    expect(new Set(MASKOT_POZLARI).size).toBe(MASKOT_POZLARI.length)
  })
})

describe('gununPozu', () => {
  const pozlar = ['a', 'b', 'c'] as const

  it('aynı gün aynı pozu, ardışık günler farklı pozları veriyor', () => {
    expect(gununPozu('2026-10-04', pozlar)).toBe(gununPozu('2026-10-04', pozlar))
    const uc = ['2026-10-04', '2026-10-05', '2026-10-06'].map((g) => gununPozu(g, pozlar))
    expect(new Set(uc).size).toBe(3)
  })

  it('ay ve yıl sınırında da sırayla ilerliyor', () => {
    const i = (g: string) => pozlar.indexOf(gununPozu(g, pozlar))
    expect((i('2026-12-31') + 1) % 3).toBe(i('2027-01-01'))
    expect((i('2028-02-28') + 1) % 3).toBe(i('2028-02-29'))
  })

  it('kaydırma aynı günün başka bir pozunu seçiyor', () => {
    expect(gununPozu('2026-10-04', pozlar, 1)).not.toBe(gununPozu('2026-10-04', pozlar))
  })
})
