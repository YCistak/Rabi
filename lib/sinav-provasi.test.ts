import { describe, expect, it } from 'vitest'
import { PROVALAR, PROVA_DERSI, provaBul } from './sinav-provasi'
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

  it('her provanın süresi pomodoro turundan uzun', () => {
    // Provanın ayrı bir kip olmasının sebebi bu: hiçbiri mola vermeden
    // geçilebilecek bir çalışma turu değil.
    for (const prova of PROVALAR) expect(prova.dakika).toBeGreaterThan(60)
  })
})

describe('provaBul', () => {
  it('tanınmayan kimlikte null döner', () => {
    expect(provaBul('yok')).toBeNull()
    expect(provaBul(null)).toBeNull()
  })
})

describe('PROVA_DERSI', () => {
  it('çalışma dersleri listesinde var', () => {
    // Listede olmayan bir ad istatistikte tek başına bir dilim olurdu.
    expect(CALISMA_DERSLERI).toContain(PROVA_DERSI)
  })
})
