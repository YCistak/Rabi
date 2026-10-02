import { describe, expect, it } from 'vitest'
import { animasyonuDogrula, VARSAYILAN_ANIMASYON } from './tanitim-animasyonu'
describe('Tanıtım animasyon ayarları', () => {
  it('bozuk kayıtlarda varsayılan ayarları korur', () => {
    for (const deger of [null, 'bozuk', { cerceveMs: NaN, karartma: 'koyu' }]) expect(animasyonuDogrula(deger)).toEqual(VARSAYILAN_ANIMASYON)
  })
  it('süre ve koyuluk sınırlarını uygular', () => {
    expect(animasyonuDogrula({ cerceveMs: -40, aydinlatmaMs: 99999, karartma: 4 })).toEqual({ ...VARSAYILAN_ANIMASYON, cerceveMs: 0, aydinlatmaMs: 3000, karartma: 0.9 })
  })
})
