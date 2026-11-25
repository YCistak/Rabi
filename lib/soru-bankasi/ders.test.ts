import { describe, expect, it } from 'vitest'
import { BANKA_DERSLERI, bankaDersiCoz, dersAdi, konuDersi } from './ders'
import { BANKA_DIZINLERI, bankaKonusuBul } from './dizin'

describe('Soru Bankası dersleri', () => {
  it('dört ders tanınır (matematik, fizik, kimya, biyoloji)', () => {
    expect(BANKA_DERSLERI.map((d) => d.id)).toEqual(['matematik', 'fizik', 'kimya', 'biyoloji'])
    expect(BANKA_DERSLERI.map((d) => d.onek)).toEqual(['mat', 'fzk', 'kim', 'byl'])
  })

  it('konu kimliğinden dersi önekle çözer', () => {
    expect(konuDersi('mat9-mantik')).toBe('matematik')
    expect(konuDersi('fzk10-akim')).toBe('fizik')
    expect(konuDersi('kim9-adlandirma')).toBe('kimya')
    expect(konuDersi('byl9-onem')).toBe('biyoloji')
    expect(konuDersi('byl10-hucre')).toBe('biyoloji')
    expect(konuDersi('byl11-sinir')).toBe('biyoloji')
    expect(konuDersi('bilinmeyen')).toBe('matematik')
    expect(konuDersi(undefined)).toBe('matematik')
  })

  it('ders adını döndürür', () => {
    expect(dersAdi('matematik')).toBe('Matematik')
    expect(dersAdi('fizik')).toBe('Fizik')
    expect(dersAdi('kimya')).toBe('Kimya')
    expect(dersAdi('biyoloji')).toBe('Biyoloji')
  })

  it('kayıttan ders tercihini çözer', () => {
    expect(bankaDersiCoz('biyoloji')).toBe('biyoloji')
    expect(bankaDersiCoz('kimya')).toBe('kimya')
    expect(bankaDersiCoz('fizik')).toBe('fizik')
    expect(bankaDersiCoz('matematik')).toBe('matematik')
    expect(bankaDersiCoz('gecersiz')).toBe('matematik')
    expect(bankaDersiCoz(null)).toBe('matematik')
  })
})

describe('Soru Bankası dizinleri', () => {
  it('biyoloji 9, 10, 11 sınıfları dizinde yer alır', () => {
    const siniflar = BANKA_DIZINLERI.biyoloji
    expect(siniflar.map((s) => s.sinif)).toEqual([9, 10, 11])
    for (const sinif of siniflar) {
      expect(sinif.temalar.length).toBeGreaterThan(0)
    }
  })

  it('henüz verisi olmayan biyoloji konuları sıfır sayılıdır (yakında)', () => {
    const tumu = BANKA_DIZINLERI.biyoloji.flatMap((s) => s.temalar).flatMap((t) => t.konular)
    expect(tumu.length).toBeGreaterThan(0)
    for (const konu of tumu) {
      expect(konu.sayi).toBe(0)
      expect(konu.yukle).toBeUndefined()
    }
  })

  it('biyoloji konusu kimlikle bulunabilir', () => {
    const konu = bankaKonusuBul('byl9-onem')
    expect(konu).toBeDefined()
    expect(konu?.ad).toBe('Biyolojinin Önemi')
    expect(konu?.sayi).toBe(0)
  })
})
