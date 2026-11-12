import { describe, expect, it } from 'vitest'
import { denemeyiKaydet, netHesapla, oncekiDurumlar, testDegerlendir, yarimTestBul } from './oturum'

const sorular = [{ dogru: 0 }, { dogru: 1 }, { dogru: 2 }, { dogru: 3 }]

describe('test değerlendirmesi', () => {
  it('seçimleri doğru/yanlış/boş sayar', () => {
    const sonuc = testDegerlendir(sorular, { 0: 0, 1: 2, 3: 3 })
    expect(sonuc.sonuclar).toEqual(['d', 'y', '-', 'd'])
    expect([sonuc.dogru, sonuc.yanlis, sonuc.bos]).toEqual([2, 1, 1])
  })

  it('seçim yoksa önceki oturumun durumunu kullanır', () => {
    expect(testDegerlendir(sorular, { 1: 1 }, { 0: 'y', 1: 'y' }).sonuclar).toEqual(['y', 'd', '-', '-'])
  })

  it('net: dört yanlış bir doğruyu götürür', () => {
    expect(netHesapla(10, 2)).toBe(9.5)
  })
})

describe('deneme modunun kayda yazımı', () => {
  it('yalnız cevaplananları yazar, ilk cevabı korur', () => {
    const kayit = denemeyiKaydet({ k: '-y' }, 'k', [0, 1, 2, 3], sorular, { 0: 0, 1: 1, 3: 0 }, false)
    expect(kayit).toEqual({ k: 'dy-y' })
  })

  it('tekrar testinde doğru cevap yanlışı düzeltir', () => {
    expect(denemeyiKaydet({ k: '-y' }, 'k', [1], [{ dogru: 1 }], { 0: 1 }, true)).toEqual({ k: '-d' })
  })
})

describe('yarım test', () => {
  it('kısmen çözülmüş ve bitirilmemiş ilk testi bulur', () => {
    const kayit = { k: 'd'.repeat(12) + 'dy--' }
    expect(yarimTestBul(kayit, {}, 'k', 30)).toEqual({ test: 1, cozulen: 2, toplam: 12, ilkBos: 2 })
  })

  it('bitirilmiş (sonucu yazılmış) testi yarım saymaz', () => {
    const testler = { k: { '1': { sure: 60, dogru: 1, yanlis: 0, bos: 11, tarih: '2026-11-12' } } }
    expect(yarimTestBul({ k: 'd' }, testler, 'k', 12)).toBeNull()
  })

  it('önceki durumları oturum sırasına çevirir', () => {
    expect(oncekiDurumlar({ k: '--dy' }, 'k', [2, 3, 4])).toEqual({ 0: 'd', 1: 'y' })
  })
})
