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

  // Zaman aşımı geniş: tüm veri dosyalarını tarıyor, dört derste veri büyüdü.
  it('biyoloji konularının soru sayısı veri dosyasıyla aynıdır; verisi olmayan sıfırdır', async () => {
    const tumu = BANKA_DIZINLERI.biyoloji.flatMap((s) => s.temalar).flatMap((t) => t.konular)
    expect(tumu.length).toBeGreaterThan(0)
    let verili = 0
    for (const konu of tumu) {
      if (konu.yukle) {
        verili++
        const { default: sorular } = await konu.yukle()
        expect(sorular.length, konu.id).toBeGreaterThan(0)
        expect(konu.sayi, konu.id).toBe(sorular.length)
        for (const soru of sorular) expect(soru.konu, konu.id).toBe(konu.id)
      } else {
        expect(konu.sayi, konu.id).toBe(0)
      }
    }
    expect(verili).toBeGreaterThan(0)
  }, 120_000)

  it('biyoloji konusu kimlikle bulunabilir', async () => {
    const konu = bankaKonusuBul('byl9-onem')
    expect(konu).toBeDefined()
    expect(konu?.ad).toBe('Biyolojinin Önemi')
    expect(konu?.yukle).toBeDefined()
    const { default: sorular } = await konu!.yukle!()
    expect(sorular.length).toBeGreaterThan(0)
    expect(konu?.sayi).toBe(sorular.length)
  })
})
