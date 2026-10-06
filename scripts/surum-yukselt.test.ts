import { describe, expect, it } from 'vitest'
import { gradleGuncelle, gradleOku, jsonSurumYaz, surumGecerliMi, surumKarsilastir } from './surum-yukselt.mjs'

const GRADLE = `defaultConfig {
        applicationId "com.example.app"
        versionCode 84
        versionName "0.9.0"
    }`

describe('surumGecerliMi', () => {
  it('X.Y.Z biçimini kabul eder', () => {
    expect(surumGecerliMi('0.9.1')).toBe(true)
    expect(surumGecerliMi('10.0.12')).toBe(true)
  })
  it('bozuk biçimleri reddeder', () => {
    for (const s of ['1.2', '1.2.3.4', 'v1.2.3', '01.2.3', '1.2.x', '', ' 1.2.3']) {
      expect(surumGecerliMi(s)).toBe(false)
    }
    expect(surumGecerliMi(undefined)).toBe(false)
  })
})

describe('surumKarsilastir', () => {
  it('parçaları sayı olarak karşılaştırır', () => {
    expect(surumKarsilastir('0.10.0', '0.9.0')).toBeGreaterThan(0)
    expect(surumKarsilastir('1.0.0', '1.0.0')).toBe(0)
    expect(surumKarsilastir('0.9.0', '0.9.1')).toBeLessThan(0)
  })
})

describe('gradleGuncelle', () => {
  it('versionCode 1 artar, versionName yazılır, gerisi aynı kalır', () => {
    const s = gradleGuncelle(GRADLE, '0.9.1')
    expect(s.versionCode).toBe(85)
    expect(s.metin).toContain('versionCode 85')
    expect(s.metin).toContain('versionName "0.9.1"')
    expect(s.metin).toContain('applicationId "com.example.app"')
    expect(gradleOku(s.metin)).toEqual({ versionCode: 85, versionName: '0.9.1' })
  })
  it('geçersiz, aynı ya da geri sürümü reddeder', () => {
    expect(() => gradleGuncelle(GRADLE, '0.9')).toThrow()
    expect(() => gradleGuncelle(GRADLE, '0.9.0')).toThrow()
    expect(() => gradleGuncelle(GRADLE, '0.8.9')).toThrow()
  })
  it('sürüm alanları yoksa hata verir', () => {
    expect(() => gradleOku('android {}')).toThrow()
  })
})

describe('jsonSurumYaz', () => {
  it('package.json ve kilit dosyasının sürümünü eşitler', () => {
    const p = JSON.parse(jsonSurumYaz('{"name":"x","version":"0.1.0"}', '0.9.1'))
    expect(p.version).toBe('0.9.1')
    const k = JSON.parse(jsonSurumYaz('{"version":"0.1.0","packages":{"":{"version":"0.1.0"}}}', '0.9.1', true))
    expect(k.version).toBe('0.9.1')
    expect(k.packages[''].version).toBe('0.9.1')
  })
})
