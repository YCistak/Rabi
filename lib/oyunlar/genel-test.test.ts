import { describe, expect, it } from 'vitest'
import { bankaKimligi, bankayiGuncelle, type BankaSorusu } from './banka'
import {
  dogruKimlikler,
  genelTestBittiMi,
  genelTestIlerlet,
  genelTestKur,
  genelTestOyunu,
} from './genel-test'

const edebiyat = (eser: string, yazar: string): BankaSorusu => ({ oyun: 'edebiyat', eser, yazar })
const islem = (metin: string, sonuc: number): BankaSorusu => ({
  oyun: 'islem',
  islemTuru: 'bolme',
  metin,
  sonuc,
})

/** Testler karışıklığa değil kurala baksın diye üreteç sabit. */
const sabit = () => 0.5

function banka(sorular: BankaSorusu[]) {
  return bankayiGuncelle(
    [],
    sorular.map((soru) => ({ soru, dogruMu: false })),
    '2026-08-18',
  )
}

describe('genelTestKur', () => {
  it('boş bankada test kurulmuyor', () => {
    expect(genelTestKur([], sabit)).toBeNull()
  })

  it('yalnızca kaydı olan oyunlar sıraya giriyor, her oyun bir kez', () => {
    const test = genelTestKur(
      banka([
        edebiyat('Çalıkuşu', 'Reşat Nuri Güntekin'),
        edebiyat('Tutunamayanlar', 'Oğuz Atay'),
        islem('84 : 4', 21),
      ]),
      sabit,
    )!
    expect([...test.sira].sort()).toEqual(['edebiyat', 'islem'])
    expect(test.adim).toBe(0)
    expect(test.dogruIdler).toEqual([])
  })
})

describe('genelTestIlerlet', () => {
  const test = { sira: ['edebiyat', 'islem'] as const, adim: 0, dogruIdler: [] as string[] }

  it('sıra bir sonraki oyuna geçiyor', () => {
    const sonraki = genelTestIlerlet({ ...test, sira: [...test.sira] }, ['a'])
    expect(genelTestOyunu(sonraki)).toBe('islem')
    expect(genelTestBittiMi(sonraki)).toBe(false)
  })

  it('son turdan sonra test bitiyor', () => {
    let gecerli = genelTestIlerlet({ ...test, sira: [...test.sira] }, [])
    gecerli = genelTestIlerlet(gecerli, [])
    expect(genelTestBittiMi(gecerli)).toBe(true)
    expect(genelTestOyunu(gecerli)).toBeNull()
  })

  /**
   * Aynı kayıt bir turda iki kez sorulabiliyor (havuz kısaysa soru tekrar
   * geliyor); iki kez sayılan kimlik "bankadan düşen" sayacını şişirirdi.
   */
  it('aynı kimlik iki kez birikmiyor', () => {
    let gecerli = genelTestIlerlet({ ...test, sira: [...test.sira] }, ['a', 'a'])
    gecerli = genelTestIlerlet(gecerli, ['a', 'b'])
    expect(gecerli.dogruIdler).toEqual(['a', 'b'])
  })
})

describe('dogruKimlikler', () => {
  it('yalnızca doğru bilinenlerin kimliğini veriyor', () => {
    const dogru = edebiyat('Çalıkuşu', 'Reşat Nuri Güntekin')
    const yanlis = islem('84 : 4', 21)
    expect(dogruKimlikler([{ soru: dogru, dogruMu: true }, { soru: yanlis, dogruMu: false }])).toEqual(
      [bankaKimligi(dogru)],
    )
  })
})
