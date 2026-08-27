import { describe, expect, it } from 'vitest'
import { MUZIK_SEVIYESI, tempo } from './mod-muzigi'
import { MOD_SIRASI } from './mod'

describe('tempo', () => {
  it('Sıradan turda süre azaldıkça hızlanıyor', () => {
    const bas = tempo('siradan', 0)
    const orta = tempo('siradan', 0.5)
    const son = tempo('siradan', 1)
    expect(orta).toBeGreaterThan(bas)
    expect(son).toBeGreaterThan(orta)
  })

  it('Turbo hızlı başlıyor ve yalnızca sonda vites atıyor', () => {
    // Turbo'nun başlangıcı, Sıradan'ın en hızlı hâlinden de hızlı: kısa turun
    // baskısı ilk saniyeden duyuluyor.
    expect(tempo('turbo', 0)).toBeGreaterThan(tempo('siradan', 1))
    expect(tempo('turbo', 0.5)).toBe(tempo('turbo', 0))
    expect(tempo('turbo', 1)).toBeGreaterThan(tempo('turbo', 0.5))
  })

  it('Ani Ölüm gerginliğe bakmıyor — orada tur saati yok', () => {
    expect(tempo('ani-olum', 0)).toBe(tempo('ani-olum', 1))
    expect(tempo('ani-olum', 0)).toBeGreaterThan(0)
  })

  it('Rahat modun parçasında vuruş yok', () => {
    expect(tempo('rahat', 0)).toBe(0)
    expect(tempo('rahat', 1)).toBe(0)
  })

  it('aralık dışındaki oran kırpılıyor', () => {
    expect(tempo('siradan', -3)).toBe(tempo('siradan', 0))
    expect(tempo('siradan', 12)).toBe(tempo('siradan', 1))
  })

  it('her mod bir tempo kuralı tanımlıyor', () => {
    // Yeni bir mod eklenip buraya yazılmazsa sessizce Rahat'ın kuralına
    // düşerdi: vuruşsuz bir parça, ritmik olması gereken bir turda.
    for (const mod of MOD_SIRASI) {
      const deger = tempo(mod, 0.5)
      expect(Number.isFinite(deger)).toBe(true)
      if (mod !== 'rahat') expect(deger).toBeGreaterThan(60)
    }
  })
})

describe('ses dengesi', () => {
  it('müzik efektlerin altında kalıyor', () => {
    // Efekt dosyaları 0.42'de çalıyor (`oyun-sesi.ts`). Müzik onun üstüne
    // çıkarsa oyunun tek sesli geri bildirimi olan doğru/yanlış duyulmaz.
    expect(MUZIK_SEVIYESI).toBeLessThan(0.42)
    // Duyulmayan müzik de hiç olmamış demek.
    expect(MUZIK_SEVIYESI).toBeGreaterThan(0.03)
  })
})
