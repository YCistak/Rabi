import { describe, expect, it } from 'vitest'
import { OGE_TURLERI, SIK_SAYISI, cumleMetni, turHazirla } from './oge'
import { OGE_ACIKLAMASI, OGE_ADI, OGE_HAVUZU } from './oge-havuzu'

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar', () => {
    expect(turHazirla()).toHaveLength(OGE_HAVUZU.length)
  })

  it('her soruda dört şık ve tam bir doğru var', () => {
    for (const soru of turHazirla()) {
      expect(soru.siklar).toHaveLength(SIK_SAYISI)
      expect(soru.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(soru.siklar.find((s) => s.dogruMu)?.deger).toBe(soru.soru.tur)
    }
  })

  it('aynı öge türü iki şıkta çıkmaz', () => {
    for (const soru of turHazirla()) {
      expect(new Set(soru.siklar.map((s) => s.deger)).size).toBe(SIK_SAYISI)
    }
  })

  /**
   * Aynı cümle farklı ögesi sorularak iki kez geçebiliyor; tur içinde aynı
   * **soru** (cümle + sorulan öge) iki kez çıkmamalı.
   */
  it('aynı soru tur içinde iki kez çıkmaz', () => {
    const kimlikler = turHazirla().map((s) => `${s.soru.once}[${s.soru.oge}]${s.soru.sonra}`)
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })

  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      const tur = turHazirla(OGE_HAVUZU.slice(0, 1))
      yerler.add(tur[0].siklar.findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe('havuz', () => {
  it('her öge türünün örneği var', () => {
    const kullanilan = new Set(OGE_HAVUZU.map((s) => s.tur))
    for (const tur of OGE_TURLERI) {
      expect(kullanilan.has(tur), `${tur} için cümle yok`).toBe(true)
    }
  })

  it('her türün adı ve açıklaması tanımlı', () => {
    for (const tur of OGE_TURLERI) {
      expect(OGE_ADI[tur]).toBeTruthy()
      expect(OGE_ACIKLAMASI[tur]).toBeTruthy()
    }
  })

  it('sorulan öge hiç boş değil', () => {
    for (const s of OGE_HAVUZU) {
      expect(s.oge.trim().length, cumleMetni(s)).toBeGreaterThan(0)
    }
  })

  /** Cümle büyük harfle başlamalı; öge başta ise ilk harf ondadır. */
  it('her cümle büyük harfle başlıyor', () => {
    for (const s of OGE_HAVUZU) {
      const metin = cumleMetni(s)
      expect(metin[0], metin).toBe(metin[0].toLocaleUpperCase('tr'))
    }
  })

  it('her cümle noktalama ile bitiyor', () => {
    for (const s of OGE_HAVUZU) {
      const metin = cumleMetni(s)
      expect(['.', '?', '!'], metin).toContain(metin.at(-1))
    }
  })

  /** Aynı cümle + aynı öge iki kez girilmiş olmamalı. */
  it('havuzda tekrar yok', () => {
    const kimlikler = OGE_HAVUZU.map((s) => `${s.once}[${s.oge}]${s.sonra}`)
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })
})
