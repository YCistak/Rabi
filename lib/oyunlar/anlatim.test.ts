import { describe, expect, it } from 'vitest'
import { BOZUKLUKLAR, SIK_SAYISI, turHazirla } from './anlatim'
import {
  ANLATIM_HAVUZU,
  BOZUKLUK_ACIKLAMASI,
  BOZUKLUK_ADI,
} from './anlatim-havuzu'
import { ZORLUKLAR } from './ritim'

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar', () => {
    expect(turHazirla()).toHaveLength(ANLATIM_HAVUZU.length)
  })

  it('aynı cümle tur içinde iki kez çıkmaz', () => {
    const cumleler = turHazirla().map((s) => s.soru.cumle)
    expect(new Set(cumleler).size).toBe(cumleler.length)
  })

  it('her sorunun dört şıkkı ve tek doğrusu var', () => {
    for (const oyunSorusu of turHazirla()) {
      expect(oyunSorusu.siklar).toHaveLength(SIK_SAYISI)
      expect(oyunSorusu.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(oyunSorusu.siklar.find((s) => s.dogruMu)?.deger).toBe(oyunSorusu.soru.tur)
    }
  })

  it('aynı sebep iki şıkta çıkmaz', () => {
    for (const oyunSorusu of turHazirla()) {
      expect(new Set(oyunSorusu.siklar.map((s) => s.deger)).size).toBe(SIK_SAYISI)
    }
  })

  /**
   * Doğru şık hep aynı yerde olsaydı oyuncu konumu ezberler, cümleyi okumayı
   * bırakırdı. Yeterince deneme sonunda dört konumun hepsi görülmeli.
   */
  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(turHazirla([ANLATIM_HAVUZU[0]])[0].siklar.findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe('havuz', () => {
  it('her cümle yalnız bir kez geçiyor', () => {
    const cumleler = ANLATIM_HAVUZU.map((s) => s.cumle)
    expect(new Set(cumleler).size).toBe(cumleler.length)
  })

  /** Şıklar için en az dört farklı sebep gerekiyor. */
  it('havuzda dörtten fazla bozukluk türü var', () => {
    expect(new Set(ANLATIM_HAVUZU.map((s) => s.tur)).size).toBeGreaterThan(SIK_SAYISI)
  })

  it('her türün adı ve açıklaması tanımlı', () => {
    for (const tur of BOZUKLUKLAR) {
      expect(BOZUKLUK_ADI[tur]).toBeTruthy()
      expect(BOZUKLUK_ACIKLAMASI[tur]).toBeTruthy()
    }
  })

  /** Kullanılmayan bir tür şıklarda çeldirici olur ama hiç sorulmaz. */
  it('tanımlı her türün en az bir örneği var', () => {
    const kullanilan = new Set(ANLATIM_HAVUZU.map((s) => s.tur))
    for (const tur of BOZUKLUKLAR) {
      expect(kullanilan.has(tur), `${tur} için örnek yok`).toBe(true)
    }
  })

  /** Düzeltme bozuk cümlenin aynısı olsaydı tur sonunda hiçbir şey öğretmezdi. */
  it('düzeltme cümleden farklı ve dolu', () => {
    for (const s of ANLATIM_HAVUZU) {
      expect(s.duzeltme.length, s.cumle).toBeGreaterThan(5)
      expect(s.duzeltme, s.cumle).not.toBe(s.cumle)
    }
  })

  /**
   * Her zorlukta soru olmalı: bir zorluk boş kalsaydı orayı seçen oyuncuya
   * `turSirasi` sessizce bütün havuzu verirdi.
   */
  it('her zorluk seviyesinde soru var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(
        ANLATIM_HAVUZU.some((s) => s.zorluk === zorluk),
        `${zorluk} seviyesinde soru yok`,
      ).toBe(true)
    }
  })
})
