import { describe, expect, it } from 'vitest'
import { AD_EN_AZ, adBiciminde, adGecerliMi } from './ad'

describe('adGecerliMi', () => {
  it('en az sınırının altını eler', () => {
    expect(adGecerliMi('')).toBe(false)
    expect(adGecerliMi('a'.repeat(AD_EN_AZ - 1))).toBe(false)
  })

  it('boşluk saymıyor', () => {
    expect(adGecerliMi('  a  ')).toBe(false)
  })

  it('sınırdaki adı geçiriyor', () => {
    expect(adGecerliMi('a'.repeat(AD_EN_AZ))).toBe(true)
    expect(adGecerliMi(' Emre ')).toBe(true)
  })
})

describe('adBiciminde', () => {
  it('her kelimenin ilk harfini büyütüyor', () => {
    expect(adBiciminde('emre nuri')).toBe('Emre Nuri')
  })

  it('Türkçe büyütüyor: i → İ', () => {
    expect(adBiciminde('ilker')).toBe('İlker')
  })

  it('sonraki harflere dokunmuyor', () => {
    expect(adBiciminde('TUĞÇE')).toBe('TUĞÇE')
    expect(adBiciminde('mcAdam')).toBe('McAdam')
  })

  it('yazarken araya düşen boşluğu koruyor', () => {
    expect(adBiciminde('emre ')).toBe('Emre ')
  })
})
