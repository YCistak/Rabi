import { describe, expect, it } from 'vitest'
import { SIK_SAYISI, celdiriciUygunMu, turHazirla } from './soz'
import { KONU_ADI, SOZ_HAVUZU, TUR_ACIKLAMASI, TUR_ADI, type SozSorusu } from './soz-havuzu'

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar', () => {
    expect(turHazirla()).toHaveLength(SOZ_HAVUZU.length)
  })

  it('her soruda dört şık ve tam bir doğru var', () => {
    for (const soru of turHazirla()) {
      expect(soru.siklar).toHaveLength(SIK_SAYISI)
      expect(soru.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(soru.siklar.find((s) => s.dogruMu)?.deger.soz).toBe(soru.soru.soz)
    }
  })

  /**
   * Asıl kural bu: iki eşanlamlı deyim aynı soruda karşılaşırsa iki şık birden
   * doğru olur. Çeldiriciler doğru cevaptan **farklı konudan** seçiliyor.
   */
  it('çeldiriciler doğru cevapla aynı konudan değil', () => {
    for (const soru of turHazirla()) {
      for (const sik of soru.siklar) {
        if (sik.dogruMu) continue
        expect(sik.deger.konu, `${soru.soru.soz} · ${sik.deger.soz}`).not.toBe(soru.soru.konu)
      }
    }
  })

  it('aynı anlam iki şıkta çıkmaz', () => {
    for (const soru of turHazirla()) {
      expect(new Set(soru.siklar.map((s) => s.metin)).size).toBe(SIK_SAYISI)
    }
  })

  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(turHazirla(SOZ_HAVUZU.slice(0, 1))[0].siklar.findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })

  /**
   * Banka turunda elde iki soru kalabiliyor; çeldiriciler turun havuzundan
   * çekilseydi dört şık kurulamazdı.
   */
  it('iki soruluk banka turunda da dört şık kuruluyor', () => {
    const kucuk = [SOZ_HAVUZU[0], SOZ_HAVUZU[40]]
    for (const soru of turHazirla(kucuk)) {
      expect(soru.siklar).toHaveLength(SIK_SAYISI)
      expect(soru.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
    }
  })

  /** Bankadan gelen soru havuzdakiyle aynı nesne değil; kopyası. */
  it('havuzdan kopyalanmış soruda doğru cevap iki kez çıkmaz', () => {
    const kopya: SozSorusu = { ...SOZ_HAVUZU[0] }
    const siklar = turHazirla([kopya])[0].siklar
    expect(siklar.filter((s) => s.metin === kopya.anlam)).toHaveLength(1)
  })
})

describe('havuz', () => {
  it('her söz ve her anlam yalnız bir kez geçiyor', () => {
    const sozler = SOZ_HAVUZU.map((s) => s.soz)
    const anlamlar = SOZ_HAVUZU.map((s) => s.anlam)
    expect(new Set(sozler).size).toBe(sozler.length)
    expect(new Set(anlamlar).size).toBe(anlamlar.length)
  })

  /** Dört şık için doğru cevabın konusu dışında en az üç aday gerekiyor. */
  it('her konu için yeterli çeldirici var', () => {
    for (const soru of SOZ_HAVUZU) {
      const uygun = SOZ_HAVUZU.filter((a) => a !== soru && celdiriciUygunMu(a, soru))
      expect(uygun.length, soru.soz).toBeGreaterThanOrEqual(SIK_SAYISI - 1)
    }
  })

  it('her tür ve konu adı tanımlı', () => {
    for (const soru of SOZ_HAVUZU) {
      expect(TUR_ADI[soru.tur], soru.soz).toBeTruthy()
      expect(KONU_ADI[soru.konu], soru.soz).toBeTruthy()
      expect(TUR_ACIKLAMASI[soru.tur], soru.soz).toBeTruthy()
    }
  })

  /** Atasözü tek başına cümle kurar, bu yüzden büyük harfle başlar. */
  it('atasözleri büyük, deyimler küçük harfle yazılmış', () => {
    for (const soru of SOZ_HAVUZU) {
      const ilk = soru.soz[0]
      if (soru.tur === 'atasozu') {
        expect(ilk, soru.soz).toBe(ilk.toLocaleUpperCase('tr'))
      } else {
        expect(ilk, soru.soz).toBe(ilk.toLocaleLowerCase('tr'))
      }
    }
  })

  it('anlamlar şıkka sığacak kadar kısa', () => {
    for (const soru of SOZ_HAVUZU) {
      expect(soru.anlam.length, soru.soz).toBeLessThanOrEqual(60)
    }
  })

  it('hem deyim hem atasözü var', () => {
    const turler = new Set(SOZ_HAVUZU.map((s) => s.tur))
    expect(turler.has('deyim')).toBe(true)
    expect(turler.has('atasozu')).toBe(true)
  })
})
