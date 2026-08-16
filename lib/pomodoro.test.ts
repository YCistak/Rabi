import { describe, expect, it } from 'vitest'
import { asamaSuresi, ilerlemeOrani, kalanSaniye, sonrakiAsama, sureYaz } from './pomodoro'
import { VARSAYILAN_POMODORO } from './depo'

const ayar = VARSAYILAN_POMODORO // 25/5/15, 4 tur

describe('sonrakiAsama', () => {
  it('çalışmadan sonra kısa mola gelir', () => {
    expect(sonrakiAsama('calisma', 1, ayar)).toBe('kisa-mola')
    expect(sonrakiAsama('calisma', 2, ayar)).toBe('kisa-mola')
    expect(sonrakiAsama('calisma', 3, ayar)).toBe('kisa-mola')
  })

  it('tur sayısı dolunca uzun mola gelir', () => {
    expect(sonrakiAsama('calisma', 4, ayar)).toBe('uzun-mola')
    expect(sonrakiAsama('calisma', 8, ayar)).toBe('uzun-mola')
  })

  it('moladan sonra hep çalışma gelir', () => {
    expect(sonrakiAsama('kisa-mola', 2, ayar)).toBe('calisma')
    expect(sonrakiAsama('uzun-mola', 4, ayar)).toBe('calisma')
  })

  it('tur sayısı 0 ise dörde düşer, sıfıra bölme olmaz', () => {
    const bozuk = { ...ayar, turSayisi: 0 }
    expect(sonrakiAsama('calisma', 4, bozuk)).toBe('uzun-mola')
    expect(sonrakiAsama('calisma', 3, bozuk)).toBe('kisa-mola')
  })
})

describe('asamaSuresi', () => {
  it('her aşamanın kendi süresini verir', () => {
    expect(asamaSuresi('calisma', ayar)).toBe(25)
    expect(asamaSuresi('kisa-mola', ayar)).toBe(5)
    expect(asamaSuresi('uzun-mola', ayar)).toBe(15)
  })
})

describe('sureYaz', () => {
  it('dakika:saniye biçiminde yazar', () => {
    expect(sureYaz(1500)).toBe('25:00')
    expect(sureYaz(65)).toBe('01:05')
    expect(sureYaz(9)).toBe('00:09')
  })

  it('negatif değeri sıfıra çeker', () => {
    expect(sureYaz(-30)).toBe('00:00')
  })
})

describe('kalanSaniye', () => {
  it('hedef zamandan geri sayar', () => {
    const simdi = 1_000_000
    expect(kalanSaniye(simdi + 90_000, simdi)).toBe(90)
  })

  it('geçmiş hedefte sıfırda kalır', () => {
    const simdi = 1_000_000
    expect(kalanSaniye(simdi - 5_000, simdi)).toBe(0)
  })
})

describe('ilerlemeOrani', () => {
  it('yarısı geçince 0,5 verir', () => {
    const simdi = 1_000_000
    // 10 dakikalık aşamanın 5 dakikası kaldı
    expect(ilerlemeOrani(simdi + 5 * 60_000, 10, simdi)).toBeCloseTo(0.5, 2)
  })

  it('süre bitince 1 olur ve aşmaz', () => {
    const simdi = 1_000_000
    expect(ilerlemeOrani(simdi - 60_000, 10, simdi)).toBe(1)
  })

  it('süre sıfırsa 1 döner, sıfıra bölme olmaz', () => {
    expect(ilerlemeOrani(Date.now() + 1000, 0)).toBe(1)
  })
})
