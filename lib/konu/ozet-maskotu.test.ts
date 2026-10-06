import { describe, expect, it } from 'vitest'
import { OZET_POZLARI, ozetPozuSec } from './ozet-maskotu'

describe('ozetPozuSec', () => {
  it('ilk açılışta üç pozun hepsi gelebilir', () => {
    expect(ozetPozuSec(null, 0)).toBe('sevinen')
    expect(ozetPozuSec(null, 0.5)).toBe('ziplayan')
    expect(ozetPozuSec(null, 0.99)).toBe('kupali')
  })

  it('bir öncekiyle aynı pozu seçmez', () => {
    for (const onceki of OZET_POZLARI) {
      for (const r of [0, 0.3, 0.6, 0.999]) {
        const poz = ozetPozuSec(onceki, r)
        expect(poz).not.toBe(onceki)
        expect(OZET_POZLARI).toContain(poz)
      }
    }
  })

  it('sınırda (1’e çok yakın) listenin dışına taşmaz', () => {
    expect(OZET_POZLARI).toContain(ozetPozuSec('kupali', 0.9999999))
  })
})
