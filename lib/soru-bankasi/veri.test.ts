import { describe, expect, it } from 'vitest'
import { BANKA_GORSEL_TURLERI, gorselHatasi } from './gorsel-denetim'
import { konuDersi } from './ders'
import { BANKA_DIZINLERI } from './dizin'

describe('Soru Bankası verisi', () => {
  it('her veri dosyasını biçim ve dizin sayısı bakımından denetler', async () => {
    const BANKA_DIZINI = Object.values(BANKA_DIZINLERI).flat()
    const konuKimlikleri = new Set(BANKA_DIZINI.flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular).map((konu) => konu.id))
    for (const konu of BANKA_DIZINI.flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular)) {
      if (!konu.yukle) continue
      const sorular = (await konu.yukle()).default
      expect(sorular).toHaveLength(konu.sayi)
      expect(new Set(sorular.map((soru) => soru.soru)).size).toBe(sorular.length)
      for (const soru of sorular) {
        expect(konuKimlikleri.has(soru.konu)).toBe(true)
        expect(BANKA_DIZINLERI[konuDersi(soru.konu)].flatMap((sinif) => sinif.temalar).flatMap((tema) => tema.konular).some((k) => k.id === soru.konu)).toBe(true)
        expect(soru.soru.length).toBeLessThanOrEqual(700)
        expect(soru.cozum.trim()).not.toBe('')
        expect(soru.siklar).toHaveLength(5)
        expect(new Set(soru.siklar).size).toBe(5)
        expect(soru.dogru).toBeGreaterThanOrEqual(0)
        expect(soru.dogru).toBeLessThanOrEqual(4)
        if (soru.gorsel) {
          expect(BANKA_GORSEL_TURLERI).toContain(soru.gorsel.tur)
          expect(gorselHatasi(soru.gorsel)).toBeNull()
        }
      }
    }
  })
})
