import { describe, expect, it } from 'vitest'
import type { SayfaCizgisi } from '@/lib/cizim'
import { cizimleriCoz, cizimleriSadelestir } from './cizim-kaydi'

const cizgi: SayfaCizgisi = {
  arac: 'kalem',
  renk: 'kirmizi',
  kalinlik: 2.6123,
  noktalar: [
    [10.04, 20.06],
    [11.55, 23.449],
  ],
}

describe('karalama kaydı', () => {
  it('noktalar bir ondalığa yuvarlanır, boş soru yazılmaz', () => {
    expect(cizimleriSadelestir({ 0: [cizgi], 3: [] })).toEqual({
      0: [
        {
          arac: 'kalem',
          renk: 'kirmizi',
          kalinlik: 2.6,
          noktalar: [
            [10, 20.1],
            [11.6, 23.4],
          ],
        },
      ],
    })
  })

  it('okurken bozuk çizgi ve anahtar atılır', () => {
    const ham = {
      0: [cizgi, { arac: 'firca', renk: 'mavi', kalinlik: 1, noktalar: [[1, 1]] }, { ...cizgi, noktalar: [] }],
      x: [cizgi],
      2: 'metin',
    }
    expect(cizimleriCoz(ham)).toEqual({ 0: [cizgi] })
    expect(cizimleriCoz(undefined)).toEqual({})
  })
})
