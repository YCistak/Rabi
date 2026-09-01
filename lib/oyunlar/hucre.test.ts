import { describe, expect, it } from 'vitest'
import {
  IPUCU_SAYISI,
  ORGANELLER,
  SIK_SAYISI,
  gorunenIpucu,
  ipucuPuani,
  siklariKur,
  turHazirla,
} from './hucre'
import { HUCRE_HAVUZU } from './hucre-havuzu'
import { SORU_SURESI, ZORLUKLAR, soruSuresi } from './ritim'

describe('gorunenIpucu', () => {
  const sure = SORU_SURESI.hucre

  it('üç ipucu da sürenin ilk yarısında açılıyor', () => {
    // 9 saniyelik soruda aralık 1,5 saniye: son ipucu 3. saniyede, yani
    // sürenin yarısında tamamlanıyor ve kalan yarı karar vermeye kalıyor.
    expect(gorunenIpucu(0, sure)).toBe(1)
    expect(gorunenIpucu(1.4, sure)).toBe(1)
    expect(gorunenIpucu(1.5, sure)).toBe(2)
    expect(gorunenIpucu(3, sure)).toBe(3)
    // Yarıyı geçtikten sonra açılacak yeni bir ipucu yok.
    expect(gorunenIpucu(sure / 2, sure)).toBe(IPUCU_SAYISI)
  })

  it('süre bitse de son ipucunda kalıyor', () => {
    expect(gorunenIpucu(sure, sure)).toBe(IPUCU_SAYISI)
    expect(gorunenIpucu(sure * 2, sure)).toBe(IPUCU_SAYISI)
  })

  /**
   * Boss'ta süre uzuyor; aralık oranla hesaplandığı için ipuçları orada da
   * sürenin ilk yarısında bitiyor — sabit saniye olsaydı ipucu ritmi soru
   * uzunluğuna göre değişirdi.
   */
  it('boss süresinde aralık da uzuyor', () => {
    const bossSuresi = soruSuresi('hucre', { zorluk: 'zor', cetin: false })
    expect(bossSuresi).toBeGreaterThan(sure)
    expect(gorunenIpucu(0, bossSuresi)).toBe(1)
    expect(gorunenIpucu(bossSuresi / 2, bossSuresi)).toBe(IPUCU_SAYISI)
    // Aralık gerçekten uzuyor: normal sorunun son ipucu anında boss hâlâ
    // erken bir ipucunda.
    expect(gorunenIpucu(sure / 2, bossSuresi)).toBeLessThan(IPUCU_SAYISI)
  })
})

describe('ipucuPuani', () => {
  it('erken bilmek daha çok puan getiriyor', () => {
    expect(ipucuPuani(1)).toBe(3)
    expect(ipucuPuani(2)).toBe(2)
    expect(ipucuPuani(3)).toBe(1)
  })

  it('puan hiçbir zaman eksiye düşmüyor', () => {
    expect(ipucuPuani(IPUCU_SAYISI + 1)).toBe(0)
  })
})

describe('siklariKur', () => {
  const soru = HUCRE_HAVUZU[0]

  it('dört şık üretir, biri doğru', () => {
    for (let i = 0; i < 50; i++) {
      const siklar = siklariKur(soru)
      expect(siklar).toHaveLength(SIK_SAYISI)
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(siklar.find((s) => s.dogruMu)?.deger).toBe(soru.organel)
      expect(new Set(siklar.map((s) => s.deger)).size).toBe(SIK_SAYISI)
    }
  })

  /**
   * Doğru şık hep aynı yerde olsaydı oyuncu konumu ezberler, ipuçlarını
   * okumayı bırakırdı.
   */
  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(siklariKur(soru).findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar, organel tekrarı yok', () => {
    const organeller = turHazirla().map((s) => s.soru.organel)
    expect(organeller).toHaveLength(HUCRE_HAVUZU.length)
    expect(new Set(organeller).size).toBe(organeller.length)
  })
})

describe('havuz', () => {
  it('her organel yalnız bir kez geçiyor', () => {
    expect(new Set(ORGANELLER).size).toBe(ORGANELLER.length)
  })

  /** Şıklar için en az dört farklı organel gerekiyor. */
  it('havuzda dörtten fazla organel var', () => {
    expect(ORGANELLER.length).toBeGreaterThan(SIK_SAYISI)
  })

  it('her organelin üç ipucu ve açıklaması var', () => {
    for (const soru of HUCRE_HAVUZU) {
      expect(soru.ipuclari, soru.organel).toHaveLength(IPUCU_SAYISI)
      for (const ipucu of soru.ipuclari) {
        expect(ipucu.length, soru.organel).toBeGreaterThan(15)
      }
      expect(soru.aciklama.length, soru.organel).toBeGreaterThan(20)
    }
  })

  /**
   * İpucu cevabı doğrudan yazsaydı oyunun tamamı okumaya inerdi; üç puanlık
   * ilk ipucu hiç değilse organelin adını içermemeli.
   */
  it('ipuçları organelin adını vermiyor', () => {
    for (const soru of HUCRE_HAVUZU) {
      const ad = soru.organel.toLocaleLowerCase('tr')
      for (const ipucu of soru.ipuclari) {
        expect(ipucu.toLocaleLowerCase('tr').includes(ad), soru.organel).toBe(false)
      }
    }
  })

  /**
   * Her zorlukta organel olmalı: bir zorluk boş kalsaydı orayı seçen oyuncuya
   * `turSirasi` sessizce bütün havuzu verirdi.
   */
  it('her zorluk seviyesinde organel var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(
        HUCRE_HAVUZU.some((s) => s.zorluk === zorluk),
        `${zorluk} seviyesinde organel yok`,
      ).toBe(true)
    }
  })
})
