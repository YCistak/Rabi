import { describe, expect, it } from 'vitest'
import {
  BOS_GECMIS,
  gecmiseYaz,
  gecmisGeriAl,
  gecmisIleriAl,
  noktalariSeyrelt,
  parcalarArasiUzaklik,
  silgiDegiyorMu,
  yolParcasi,
  yumusakYol,
  type SayfaCizgisi,
  type SayfaNoktasi,
} from './cizim'

describe('sayfa karalaması', () => {
  it('doğru üstündeki ara noktalar seyreltmede düşer, köşe kalır', () => {
    const duz = Array.from({ length: 20 }, (_, i): SayfaNoktasi => [i, 0])
    expect(noktalariSeyrelt(duz, 0.5)).toEqual([[0, 0], [19, 0]])
    expect(noktalariSeyrelt([[0, 0], [5, 0.1], [10, 0], [10, 10]], 0.5)).toEqual([[0, 0], [10, 0], [10, 10]])
  })

  it('yumuşak yol orta noktalardan geçer, uçlarda gerçek noktaya varır', () => {
    const yol = yumusakYol([[0, 0], [10, 0], [10, 10]])
    expect(yol[0]).toEqual({ tur: 'tasi', x: 0, y: 0 })
    expect(yol[1]).toEqual({ tur: 'cizgi', x: 5, y: 0 })
    expect(yol[2]).toEqual({ tur: 'egri', kx: 10, ky: 0, x: 10, y: 5 })
    expect(yol[yol.length - 1]).toEqual({ tur: 'cizgi', x: 10, y: 10 })
  })

  it('canlı parça bitmiş yolla aynı eğriyi çizer', () => {
    const noktalar: SayfaNoktasi[] = [[0, 0], [10, 0], [10, 10], [20, 10]]
    const parca = yolParcasi(noktalar, 3)
    expect(parca[0]).toEqual({ tur: 'tasi', x: 10, y: 5 })
    expect(yumusakYol(noktalar)).toContainEqual(parca[1])
  })

  it('parçalar arası uzaklık: kesişen 0, paralel aralık kadar', () => {
    expect(parcalarArasiUzaklik([0, 0], [10, 10], [0, 10], [10, 0])).toBe(0)
    expect(parcalarArasiUzaklik([0, 0], [10, 0], [0, 3], [10, 3])).toBe(3)
  })

  it('çizgi silgisi: yarıçap ve yarı kalınlık kadar yaklaşan çizgiye değer', () => {
    const cizgi: SayfaCizgisi = { arac: 'kalem', renk: 'kursun', kalinlik: 4, noktalar: [[0, 0], [100, 0]] }
    expect(silgiDegiyorMu(cizgi, [50, 9], [60, 9], 8)).toBe(true)
    expect(silgiDegiyorMu(cizgi, [50, 11], [60, 11], 8)).toBe(false)
    // Silgi hızlı geçip iki örnek arasında çizgiyi atlasa da yolu kesiştiği için değer.
    expect(silgiDegiyorMu(cizgi, [50, -40], [50, 40], 2)).toBe(true)
    expect(silgiDegiyorMu({ ...cizgi, noktalar: [[5, 5]] }, [0, 0], [0, 10], 4)).toBe(true)
  })

  it('geçmiş: geri al, ileri al; yeni eylem ileriyi siler; temizle geri alınır', () => {
    const c: SayfaCizgisi = { arac: 'kalem', renk: 'kursun', kalinlik: 2, noktalar: [[0, 0]] }
    let g = gecmiseYaz(BOS_GECMIS, [c])
    g = gecmiseYaz(g, [])
    expect(g.cizgiler).toEqual([])
    g = gecmisGeriAl(g)
    expect(g.cizgiler).toEqual([c])
    g = gecmisIleriAl(g)
    expect(g.cizgiler).toEqual([])
    g = gecmisGeriAl(gecmisGeriAl(g))
    expect(g.cizgiler).toEqual([])
    expect(gecmiseYaz(gecmisIleriAl(g), [c, c]).ileri).toEqual([])
  })
})
