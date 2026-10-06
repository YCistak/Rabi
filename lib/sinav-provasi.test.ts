import { describe, expect, it } from 'vitest'
import {
  OZEL_PROVA_SINIRI,
  PROVALAR,
  PROVA_DERSI,
  VARSAYILAN_OZEL_PROVA,
  ozelProva,
  ozelProvaSuresi,
  provaBul,
} from './sinav-provasi'
import { CALISMA_DERSLERI } from './dersler'

describe('PROVALAR', () => {
  it('soru sayıları ÖSYM kitapçıklarıyla aynı', () => {
    // Sayılar `OSYM_TEST_SORU`dan toplanıyor; dağılım bozulursa burası kırılır.
    expect(provaBul('tyt')?.soru).toBe(120)
    expect(provaBul('ayt')?.soru).toBe(160)
    expect(provaBul('ydt')?.soru).toBe(80)
  })

  it('süreler kılavuzdaki değerler', () => {
    expect(provaBul('tyt')?.dakika).toBe(165)
    expect(provaBul('ayt')?.dakika).toBe(180)
    expect(provaBul('ydt')?.dakika).toBe(120)
  })

  it('YKS provalarının süresi pomodoro turundan uzun', () => {
    // Provanın ayrı bir kip olmasının sebebi bu: hiçbiri mola vermeden
    // geçilebilecek bir çalışma turu değil.
    for (const prova of PROVALAR) expect(prova.dakika).toBeGreaterThan(60)
  })

  it('STS artık hazır seçenek değil', () => {
    // Yerini "Süre gir" aldı (`ozelProva`).
    expect(provaBul('sts')).toBeNull()
    expect(PROVALAR.map((p) => p.id)).toEqual(['tyt', 'ayt', 'ydt'])
  })
})

describe('ozelProvaSuresi', () => {
  it('sınırların içine alıp yuvarlıyor', () => {
    expect(ozelProvaSuresi(75)).toBe(75)
    expect(ozelProvaSuresi(42.6)).toBe(43)
    expect(ozelProvaSuresi(0)).toBe(OZEL_PROVA_SINIRI.enAz)
    expect(ozelProvaSuresi(-5)).toBe(OZEL_PROVA_SINIRI.enAz)
    expect(ozelProvaSuresi(999)).toBe(OZEL_PROVA_SINIRI.enCok)
  })

  it('sayı olmayan kayıtta varsayılana düşüyor', () => {
    expect(ozelProvaSuresi(undefined)).toBe(VARSAYILAN_OZEL_PROVA)
    expect(ozelProvaSuresi(null)).toBe(VARSAYILAN_OZEL_PROVA)
    expect(ozelProvaSuresi(Number.NaN)).toBe(VARSAYILAN_OZEL_PROVA)
    expect(ozelProvaSuresi('90')).toBe(VARSAYILAN_OZEL_PROVA)
  })
})

describe('ozelProva', () => {
  it('kullanıcının süresiyle, soru sayısı olmadan', () => {
    const prova = ozelProva(90)
    expect(prova.id).toBe('ozel')
    expect(prova.dakika).toBe(90)
    expect(prova.soru).toBeNull()
    expect(ozelProva(1000).dakika).toBe(OZEL_PROVA_SINIRI.enCok)
  })
})

describe('provaBul', () => {
  it('tanınmayan kimlikte null döner', () => {
    expect(provaBul('yok')).toBeNull()
    expect(provaBul(null)).toBeNull()
  })
})

describe('PROVA_DERSI', () => {
  it('seçilebilen derslerden biri değil', () => {
    // Prova bir derse değil denemenin tamamına ait.
    expect(CALISMA_DERSLERI).not.toContain(PROVA_DERSI)
  })
})
