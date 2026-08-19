import { describe, expect, it } from 'vitest'
import { SIK_SAYISI, siklariKur, turHazirla, type BiyolojiSorusu } from './biyoloji'
import { ORTAK_HAVUZU } from './ortak-havuzu'
import { SINIFLANDIRMA_HAVUZU } from './siniflandirma-havuzu'
import { ZORLUKLAR } from './ritim'

const havuzlar: [string, readonly BiyolojiSorusu[]][] = [
  ['Ortak Özellikler', ORTAK_HAVUZU],
  ['Canlıları Sınıflandır', SINIFLANDIRMA_HAVUZU],
]

describe('siklariKur', () => {
  const soru = ORTAK_HAVUZU[0]

  it('dört şık üretir', () => {
    expect(siklariKur(soru)).toHaveLength(SIK_SAYISI)
  })

  it('tam olarak bir doğru şık var', () => {
    for (let i = 0; i < 50; i++) {
      const siklar = siklariKur(soru)
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(siklar.find((s) => s.dogruMu)?.metin).toBe(soru.dogru)
    }
  })

  /**
   * Doğru şık hep aynı yerde olsaydı oyuncu konumu ezberler, soruyu okumayı
   * bırakırdı. Yeterince deneme sonunda dört konumun hepsi görülmeli.
   */
  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(siklariKur(soru).findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe.each(havuzlar)('%s havuzu', (_ad, havuz) => {
  it('turda havuzun tamamı var ve soru tekrarı yok', () => {
    const sorular = turHazirla(havuz).map((s) => s.soru.soru)
    expect(sorular).toHaveLength(havuz.length)
    expect(new Set(sorular).size).toBe(sorular.length)
  })

  it('her sorunun dört şıkkı kurulmuş', () => {
    for (const oyunSorusu of turHazirla(havuz)) {
      expect(oyunSorusu.siklar).toHaveLength(SIK_SAYISI)
      expect(oyunSorusu.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
    }
  })

  /** Doğru cevap çeldiriciler arasında da geçseydi iki şık birden doğru olurdu. */
  it('doğru cevap çeldiricilerde tekrar etmiyor', () => {
    for (const soru of havuz) {
      expect(soru.celdiriciler, soru.soru).not.toContain(soru.dogru)
      expect(new Set(soru.celdiriciler).size, soru.soru).toBe(3)
    }
  })

  it('her soruda öğretici bir açıklama var', () => {
    for (const soru of havuz) {
      expect(soru.aciklama.length, soru.soru).toBeGreaterThan(20)
    }
  })

  it('soru metni soru işaretiyle bitiyor', () => {
    for (const soru of havuz) {
      expect(soru.soru.endsWith('?'), soru.soru).toBe(true)
    }
  })

  /**
   * Her zorlukta soru olmalı: bir zorluk boş kalsaydı orayı seçen oyuncuya
   * `turSirasi` sessizce bütün havuzu verirdi.
   */
  it('her zorluk seviyesinde soru var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(
        havuz.some((s) => s.zorluk === zorluk),
        `${zorluk} seviyesinde soru yok`,
      ).toBe(true)
    }
  })
})
