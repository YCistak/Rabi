import { describe, expect, it } from 'vitest'
import { MOL_HAVUZU, dogruMu, dogruYuk, uretim } from './mol-kargo'
import { bankaCevabiMetni, bankaKimligi, bankaSorusuMetni, molKargodanBanka } from './banka'

describe('Mol Kargo', () => {
  it('her hedef için artıksız yük kurulabilir', () => {
    expect(new Set(MOL_HAVUZU.map((soru) => soru.id)).size).toBe(MOL_HAVUZU.length)
    for (const soru of MOL_HAVUZU) {
      const yuk = dogruYuk(soru)
      expect(dogruMu(soru, yuk), soru.id).toBe(true)
      expect(uretim(soru, yuk)).toEqual({ urun: soru.hedef, kalan: [0, 0] })
      expect(dogruMu(soru, [yuk[0] + 1, yuk[1]]), soru.id).toBe(false)
      expect(dogruMu(soru, [yuk[0], yuk[1] - 1]), soru.id).toBe(false)
    }
  })

  it('su örneğinde mol oranını ve artanı doğru hesaplar', () => {
    const soru = MOL_HAVUZU.find((aday) => aday.id === 'su-2')!
    expect(soru.hedef).toBe(4)
    expect(dogruYuk(soru)).toEqual([4, 2])
    expect(uretim(soru, [5, 2])).toEqual({ urun: 4, kalan: [1, 0] })
    expect(uretim(soru, [4, 1])).toEqual({ urun: 2, kalan: [2, 0] })
    expect(uretim(soru, [1, 1])).toEqual({ urun: 1, kalan: [0, 0.5] })
    const kayit = molKargodanBanka(soru)
    expect(bankaKimligi(kayit)).toBe('mol-kargo:su-2')
    expect(bankaSorusuMetni(kayit)).toContain('4 mol H₂O')
    expect(bankaCevabiMetni(kayit)).toContain('4 mol H₂ + 2 mol O₂')
  })

  it('bütün denklemlerde atom sayısı iki tarafta eşittir', () => {
    const indisler: Record<string, string> = { '₂': '2', '₃': '3' }
    const atomlar = (formul: string) => {
      const sayilar: Record<string, number> = {}
      for (const eslesme of formul.matchAll(/([A-Z][a-z]?)([₂₃]?)/g)) {
        const [, atom, indis] = eslesme
        sayilar[atom] = (sayilar[atom] ?? 0) + Number(indisler[indis] ?? '1')
      }
      return sayilar
    }
    for (const soru of MOL_HAVUZU) {
      const giren: Record<string, number> = {}
      for (const madde of soru.tepkenler) {
        for (const [atom, adet] of Object.entries(atomlar(madde.formul))) {
          giren[atom] = (giren[atom] ?? 0) + adet * madde.katsayi
        }
      }
      const cikan = Object.fromEntries(Object.entries(atomlar(soru.urun.formul)).map(([atom, adet]) => [atom, adet * soru.urun.katsayi]))
      expect(giren, soru.id).toEqual(cikan)
    }
  })
})
