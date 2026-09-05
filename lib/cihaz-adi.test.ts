import { describe, expect, it } from 'vitest'
import { yeniCihazAdi } from './cihaz-adi'

describe('yeniCihazAdi', () => {
  it('renk-hayvan-iki hane biçiminde', () => {
    for (let i = 0; i < 200; i++) {
      expect(yeniCihazAdi()).toMatch(/^[a-zçğıöşü]+-[a-zçğıöşü]+-\d{2}$/)
    }
  })

  it('farklı adlar üretiyor', () => {
    const kume = new Set(Array.from({ length: 200 }, () => yeniCihazAdi()))
    // 19.200 olasılıkta 200 çekilişin hepsinin aynı çıkması imkânsız denecek
    // kadar düşük; bu sınav üretecin gerçekten rastgele olduğunu gösteriyor.
    expect(kume.size).toBeGreaterThan(150)
  })
})
