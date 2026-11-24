import { describe, expect, it } from 'vitest'
import { BANKA_DIZINLERI } from '../lib/soru-bankasi/dizin'
import { cevir, soruOzeti } from './kimya-donustur.mjs'

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 170"><text x="1">H₂O</text></svg>'
const ham = {
  id: 'kim9-dnm-001',
  zorluk: 2,
  kok: 'X için,\nI. a\nII. b\nyargılarından hangileri doğrudur?',
  secenekler: { A: 'Yalnız I', B: 'Yalnız II', C: 'I ve II', D: 'Hiçbiri', E: 'Veri yetersiz' },
  cevap: 'C',
  cozum: 'İkisi de doğrudur.',
  gorsel: 'gorseller/9/kim9-dnm-001.svg',
  gorselAciklama: 'Su yazısı.',
  kaynak: { dosya: 'k', sayfa: 1 },
  kazanim: 'z',
}

describe('kimya dönüştürme', () => {
  it('alanları eşler, kaynak alanını taşımaz, öncülleri kökte bırakır', () => {
    expect(cevir(ham, 'kim9-sivilar', svg)).toEqual({
      konu: 'kim9-sivilar',
      zorluk: 2,
      soru: ham.kok,
      siklar: ['Yalnız I', 'Yalnız II', 'I ve II', 'Hiçbiri', 'Veri yetersiz'],
      dogru: 2,
      cozum: 'İkisi de doğrudur.',
      gorsel: { tur: 'svg', yol: 'soru-bankasi/kimya/9/kim9-dnm-001.svg', aciklama: 'Su yazısı.', en: 600, boy: 170 },
    })
  })

  it.each([
    ['eksik şekil', ham, null],
    ['tekrar eden şık', { ...ham, secenekler: { ...ham.secenekler, E: 'Hiçbiri' } }, svg],
    ['geçersiz cevap', { ...ham, cevap: 'F' }, svg],
    ['bozuk harf', { ...ham, cozum: 'deÄŸer' }, svg],
    ['güvensiz şekil', ham, svg.replace('<text', '<script')],
  ])('%s reddedilir', (_, soru, sekil) => {
    expect(() => cevir(soru, 'kim9-sivilar', sekil)).toThrow()
  })

  it('özet içerik ya da şekil değişince değişir', () => {
    const ozet = soruOzeti(ham, svg)
    expect(soruOzeti({ ...ham, cevap: 'D' }, svg)).not.toBe(ozet)
    expect(soruOzeti(ham, svg.replace('H₂O', 'CO₂'))).not.toBe(ozet)
    expect(soruOzeti({ ...ham, kazanim: 'başka' }, svg)).toBe(ozet)
  })

  it('kimya dizininde yalnız 9. sınıf dolu', () => {
    const sayi = (s: number) => BANKA_DIZINLERI.kimya.find((d) => d.sinif === s)!.temalar.flatMap((t) => t.konular).reduce((t, k) => t + k.sayi, 0)
    expect(sayi(9)).toBeGreaterThan(0)
    expect([sayi(10), sayi(11)]).toEqual([0, 0])
    expect(BANKA_DIZINLERI.matematik.length && BANKA_DIZINLERI.fizik.length).toBe(3)
  })
})
