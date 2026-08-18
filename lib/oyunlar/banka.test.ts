import { describe, expect, it } from 'vitest'
import {
  BANKA_SINIRI,
  DUSME_ESIGI,
  bankaDagilimi,
  bankaKimligi,
  bankaSuz,
  bankayiGuncelle,
  enKalabalikOyun,
  type BankaKaydi,
  type BankaSorusu,
} from './banka'

const yazim = (dogru: string): BankaSorusu => ({
  oyun: 'yazim',
  dogru,
  yanlis: `${dogru}!`,
  kural: 'kural',
})

const islem: BankaSorusu = { oyun: 'islem', islemTuru: 'bolme', metin: '156 ÷ 12', sonuc: 13 }
const edebiyat: BankaSorusu = { oyun: 'edebiyat', eser: 'Çalıkuşu', yazar: 'Reşat Nuri Güntekin' }

describe('bankaKimligi', () => {
  it('aynı soru için aynı kimliği üretir', () => {
    expect(bankaKimligi(yazim('yanlış'))).toBe(bankaKimligi(yazim('yanlış')))
  })

  it('farklı oyunların kimlikleri çakışmaz', () => {
    expect(bankaKimligi(islem)).not.toBe(bankaKimligi(edebiyat))
  })
})

describe('bankayiGuncelle', () => {
  it('yanlış bilinen soruyu bankaya ekler', () => {
    const banka = bankayiGuncelle([], [{ soru: yazim('yanlış'), dogruMu: false }], '2026-08-18')
    expect(banka).toHaveLength(1)
    expect(banka[0].kacKez).toBe(1)
    expect(banka[0].ardisikDogru).toBe(0)
  })

  it('doğru bilinen soru bankaya girmez', () => {
    expect(bankayiGuncelle([], [{ soru: islem, dogruMu: true }], '2026-08-18')).toHaveLength(0)
  })

  it('aynı soru ikinci kez yanlışsa yeni kayıt açmaz, sayacı artırır', () => {
    let banka = bankayiGuncelle([], [{ soru: islem, dogruMu: false }], '2026-08-18')
    banka = bankayiGuncelle(banka, [{ soru: islem, dogruMu: false }], '2026-08-19')
    expect(banka).toHaveLength(1)
    expect(banka[0].kacKez).toBe(2)
  })

  it(`üst üste ${DUSME_ESIGI} doğrudan sonra kayıt düşer`, () => {
    let banka = bankayiGuncelle([], [{ soru: edebiyat, dogruMu: false }], '2026-08-18')
    for (let i = 0; i < DUSME_ESIGI - 1; i++) {
      banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: true }], '2026-08-19')
      expect(banka).toHaveLength(1)
    }
    banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: true }], '2026-08-20')
    expect(banka).toHaveLength(0)
  })

  it('araya giren yanlış ilerlemeyi sıfırlar', () => {
    let banka = bankayiGuncelle([], [{ soru: edebiyat, dogruMu: false }], '2026-08-18')
    banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: true }], '2026-08-19')
    banka = bankayiGuncelle(banka, [{ soru: edebiyat, dogruMu: false }], '2026-08-20')
    expect(banka[0].ardisikDogru).toBe(0)
    expect(banka[0].kacKez).toBe(2)
  })

  it('girdiyi değiştirmez', () => {
    const banka = bankayiGuncelle([], [{ soru: islem, dogruMu: false }], '2026-08-18')
    const kopya = structuredClone(banka)
    bankayiGuncelle(banka, [{ soru: islem, dogruMu: false }], '2026-08-19')
    expect(banka).toEqual(kopya)
  })

  it(`sınır aşılınca en eski kayıt düşer, boyut ${BANKA_SINIRI}'de kalır`, () => {
    let banka: BankaKaydi[] = []
    for (let i = 0; i < BANKA_SINIRI; i++) {
      const gun = String(i + 1).padStart(2, '0')
      banka = bankayiGuncelle(banka, [{ soru: yazim(`k${i}`), dogruMu: false }], `2026-01-${gun}`)
    }
    expect(banka).toHaveLength(BANKA_SINIRI)

    banka = bankayiGuncelle(banka, [{ soru: yazim('yeni'), dogruMu: false }], '2026-12-31')
    expect(banka).toHaveLength(BANKA_SINIRI)
    expect(banka.some((k) => k.id === bankaKimligi(yazim('yeni')))).toBe(true)
    expect(banka.some((k) => k.id === bankaKimligi(yazim('k0')))).toBe(false)
  })
})

describe('dağılım ve süzme', () => {
  const banka = bankayiGuncelle(
    [],
    [
      { soru: yazim('a'), dogruMu: false },
      { soru: yazim('b'), dogruMu: false },
      { soru: islem, dogruMu: false },
    ],
    '2026-08-18',
  )

  it('oyun başına sayar', () => {
    expect(bankaDagilimi(banka)).toEqual({ yazim: 2, islem: 1, edebiyat: 0 })
  })

  it('tek oyuna süzer', () => {
    expect(bankaSuz(banka, 'islem')).toHaveLength(1)
    expect(bankaSuz(banka, 'tumu')).toHaveLength(3)
  })

  it('en kalabalık oyunu bulur', () => {
    expect(enKalabalikOyun(banka)).toBe('yazim')
    expect(enKalabalikOyun([])).toBeNull()
  })
})
