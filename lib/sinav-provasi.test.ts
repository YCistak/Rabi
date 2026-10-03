import { describe, expect, it } from 'vitest'
import { PROVALAR, PROVA_DERSI, provaBul } from './sinav-provasi'
import { CALISMA_DERSLERI } from './dersler'

describe('PROVALAR', () => {
  it('soru sayıları ÖSYM kitapçıklarıyla aynı', () => {
    // Sayılar `OSYM_TEST_SORU`dan toplanıyor; dağılım bozulursa burası kırılır.
    expect(provaBul('tyt')?.soru).toBe(120)
    expect(provaBul('ayt')?.soru).toBe(160)
    expect(provaBul('ydt')?.soru).toBe(80)
    // STS ÖSYM sınavı değil: ders başına tek oturum.
    expect(provaBul('sts')?.soru).toBe(20)
  })

  it('süreler kılavuzdaki değerler', () => {
    expect(provaBul('tyt')?.dakika).toBe(165)
    expect(provaBul('ayt')?.dakika).toBe(180)
    expect(provaBul('ydt')?.dakika).toBe(120)
    expect(provaBul('sts')?.dakika).toBe(40)
  })

  it('YKS provalarının süresi pomodoro turundan uzun', () => {
    // Provanın ayrı bir kip olmasının sebebi bu: hiçbiri mola vermeden
    // geçilebilecek bir çalışma turu değil. STS kısa ama yine kesintisiz bir
    // sınav oturumu.
    for (const prova of PROVALAR.filter((p) => p.id !== 'sts')) expect(prova.dakika).toBeGreaterThan(60)
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
