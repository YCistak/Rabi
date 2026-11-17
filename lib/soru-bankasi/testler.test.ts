import { describe, expect, it } from 'vitest'
import { testleriCoz, testSonucuAl, testSonucuYaz } from './testler'

const iyi = { sure: 480, dogru: 10, yanlis: 2, bos: 0, tarih: '2026-11-12T10:00:00.000Z' }

describe('test sonuçları kaydı', () => {
  it('bozuk değerleri atar', () => {
    expect(
      testleriCoz({
        k: { '1': iyi, '0': iyi, x: iyi, '2': { ...iyi, sure: -1 }, '3': { ...iyi, tarih: 5 } },
        bos: {},
        dizi: [],
      }),
    ).toEqual({ k: { '1': iyi } })
    expect(testleriCoz('bozuk')).toEqual({})
  })

  it('sıfırdan başlayan test sırasını ekrandaki numarayla yazar', () => {
    const kayit = testSonucuYaz({}, 'k', 2, iyi)
    expect(kayit).toEqual({ k: { '3': iyi } })
    expect(testSonucuAl(kayit, 'k', 2)).toEqual(iyi)
  })

  it('aynı testin yeni sonucu eskisinin yerine geçer, ötekilere dokunmaz', () => {
    const kayit = testSonucuYaz(testSonucuYaz({}, 'k', 0, iyi), 'k', 1, iyi)
    expect(testSonucuYaz(kayit, 'k', 0, { ...iyi, dogru: 12, yanlis: 0 }).k['2']).toEqual(iyi)
  })
})
