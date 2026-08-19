import { describe, expect, it } from 'vitest'
import { OLAYLAR, SIK_SAYISI, siklariKur, turHazirla } from './ses'
import { OLAY_ACIKLAMASI, OLAY_ADI, SES_HAVUZU, type SesSorusu } from './ses-havuzu'

const soru = (kelime: string, olay: SesSorusu['olay']): SesSorusu => ({
  kelime,
  olusum: 'kök + ek',
  olay,
  zorluk: 'orta',
})

describe('siklariKur', () => {
  it('dört şık üretir', () => {
    expect(siklariKur(soru('kitabı', 'yumusama'))).toHaveLength(SIK_SAYISI)
  })

  it('tam olarak bir doğru şık var', () => {
    for (let i = 0; i < 50; i++) {
      const siklar = siklariKur(soru('burnu', 'unluDusmesi'))
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(siklar.find((s) => s.dogruMu)?.deger).toBe('unluDusmesi')
    }
  })

  it('aynı olay iki şıkta çıkmaz', () => {
    for (let i = 0; i < 50; i++) {
      const siklar = siklariKur(soru('bekliyor', 'unluDaralmasi'))
      expect(new Set(siklar.map((s) => s.deger)).size).toBe(SIK_SAYISI)
    }
  })

  /**
   * Doğru şık hep aynı yerde olsaydı oyuncu konumu ezberler, sözcüğe bakmayı
   * bırakırdı. Yeterince deneme sonunda dört konumun hepsi görülmeli.
   */
  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(siklariKur(soru('babası', 'kaynastirma')).findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar', () => {
    expect(turHazirla()).toHaveLength(SES_HAVUZU.length)
  })

  it('aynı sözcük tur içinde iki kez çıkmaz', () => {
    const kelimeler = turHazirla().map((s) => s.soru.kelime)
    expect(new Set(kelimeler).size).toBe(kelimeler.length)
  })

  it('her sorunun şıkları kurulmuş', () => {
    for (const oyunSorusu of turHazirla()) {
      expect(oyunSorusu.siklar).toHaveLength(SIK_SAYISI)
      expect(oyunSorusu.siklar.some((s) => s.dogruMu)).toBe(true)
    }
  })
})

describe('havuz', () => {
  it('her sözcük yalnız bir kez geçiyor', () => {
    const kelimeler = SES_HAVUZU.map((s) => s.kelime)
    expect(new Set(kelimeler).size).toBe(kelimeler.length)
  })

  /** Şıklar için en az dört farklı olay gerekiyor. */
  it('havuzda dörtten fazla olay var', () => {
    expect(new Set(SES_HAVUZU.map((s) => s.olay)).size).toBeGreaterThan(SIK_SAYISI)
  })

  it('her olayın adı ve açıklaması tanımlı', () => {
    for (const olay of OLAYLAR) {
      expect(OLAY_ADI[olay]).toBeTruthy()
      expect(OLAY_ACIKLAMASI[olay]).toBeTruthy()
    }
  })

  /** Kullanılmayan bir olay şıklarda çeldirici olarak çıkar ama hiç sorulmaz. */
  it('tanımlı her olayın en az bir örneği var', () => {
    const kullanilan = new Set(SES_HAVUZU.map((s) => s.olay))
    for (const olay of OLAYLAR) {
      expect(kullanilan.has(olay), `${olay} için örnek yok`).toBe(true)
    }
  })

  it('oluşum satırı boş değil', () => {
    for (const s of SES_HAVUZU) {
      expect(s.olusum.length, s.kelime).toBeGreaterThan(2)
    }
  })
})
