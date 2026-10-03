import { describe, expect, it } from 'vitest'
import { ANIMASYON_SURUMU, VARSAYILAN_ANIMASYON, animasyonKaydi, animasyonuDogrula, egriDegeri } from './tanitim-animasyonu'

describe('tanıtım animasyon ayarı', () => {
  it('sürümsüz eski kayıt yeni varsayılanları ezmez', () => {
    // 047b1ac döneminin kaydı: 450 ms karartmasız bekleme, 700 ms çerçeve.
    const eski = { gecisMs: 450, cerceveMs: 700, aydinlatmaGecikmesiMs: 450, aydinlatmaMs: 550, balonMs: 450, karartma: 0.64 }
    expect(animasyonuDogrula(eski)).toEqual(VARSAYILAN_ANIMASYON)
    expect(animasyonuDogrula({ ...eski, surum: ANIMASYON_SURUMU - 1 })).toEqual(VARSAYILAN_ANIMASYON)
  })

  it('güncel sürümle kaydedilen ayar okunur, sınırlar korunur', () => {
    const kayit = JSON.parse(JSON.stringify(animasyonKaydi({ ...VARSAYILAN_ANIMASYON, cerceveMs: 500, karartma: 2 })))
    expect(kayit.surum).toBe(ANIMASYON_SURUMU)
    const okunan = animasyonuDogrula(kayit)
    expect(okunan.cerceveMs).toBe(500)
    expect(okunan.karartma).toBe(0.9)
    expect(okunan).not.toHaveProperty('surum')
  })

  it('bozuk kayıt varsayılana döner', () => {
    expect(animasyonuDogrula(null)).toEqual(VARSAYILAN_ANIMASYON)
    expect(animasyonuDogrula('x')).toEqual(VARSAYILAN_ANIMASYON)
    expect(animasyonuDogrula({ surum: ANIMASYON_SURUMU, balonMs: Number.NaN }).balonMs).toBe(VARSAYILAN_ANIMASYON.balonMs)
  })

  it('balon spottan biraz sonra, ama ona yakın biter', () => {
    const { cerceveMs, balonMs, balonGecikmesiMs } = VARSAYILAN_ANIMASYON
    expect(balonGecikmesiMs).toBeGreaterThan(0)
    expect(Math.abs(balonMs + balonGecikmesiMs - cerceveMs)).toBeLessThanOrEqual(40)
  })
})

describe('egriDegeri (CSS cubic-bezier ile aynı)', () => {
  it('uçlarda 0 ve 1, arada monoton artar ve hiç taşmaz', () => {
    expect(egriDegeri(0)).toBe(0)
    expect(egriDegeri(1)).toBe(1)
    let onceki = 0
    for (let t = 0.01; t < 1; t += 0.01) {
      const d = egriDegeri(t)
      expect(d).toBeGreaterThanOrEqual(onceki)
      expect(d).toBeLessThanOrEqual(1)
      onceki = d
    }
  })

  it('doğrusal eğride t döner; ease-out eğrisi önde gider', () => {
    for (const t of [0.1, 0.37, 0.5, 0.9]) expect(egriDegeri(t, [0, 0, 1, 1])).toBeCloseTo(t, 6)
    // Varsayılan eğri: hareketin büyük kısmı ilk yarıda biter.
    expect(egriDegeri(0.4)).toBeGreaterThan(0.75)
    // CSS `ease` (0.25, 0.1, 0.25, 1) için bilinen değer: t=0.5 → ~0.8024.
    expect(egriDegeri(0.5, [0.25, 0.1, 0.25, 1])).toBeCloseTo(0.8024, 3)
  })
})
