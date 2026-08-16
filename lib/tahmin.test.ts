import { describe, expect, it } from 'vitest'
import { aytAdaylari, enYeni, tahminUret, tytAdaylari } from './tahmin'
import { HAZIR_SABLONLAR, sablonBul } from './sablonlar'
import type { Deneme } from './types'

const sablonlar = HAZIR_SABLONLAR

const tytDenemesi: Deneme = {
  id: 'tyt1',
  sablonId: 'tyt',
  ad: 'TYT 1',
  tarih: '2026-08-10',
  sonuclar: [
    { dersId: 'turkce', dogru: 36, yanlis: 2 },
    { dersId: 'tarih', dogru: 5, yanlis: 0 },
    { dersId: 'cografya', dogru: 4, yanlis: 1 },
    { dersId: 'felsefe', dogru: 4, yanlis: 1 },
    { dersId: 'din', dogru: 5, yanlis: 0 },
    { dersId: 'matematik', dogru: 33, yanlis: 4 },
    { dersId: 'fizik', dogru: 5, yanlis: 1 },
    { dersId: 'kimya', dogru: 5, yanlis: 1 },
    { dersId: 'biyoloji', dogru: 5, yanlis: 1 },
  ],
}

const aytDenemesi: Deneme = {
  id: 'ayt1',
  sablonId: 'ayt-ea',
  ad: 'AYT EA 1',
  tarih: '2026-08-12',
  sonuclar: [
    { dersId: 'matematik', dogru: 29, yanlis: 5 },
    { dersId: 'edebiyat', dogru: 19, yanlis: 3 },
    { dersId: 'tarih1', dogru: 8, yanlis: 1 },
    { dersId: 'cografya1', dogru: 5, yanlis: 1 },
  ],
}

/** Okul denemesi: 120 soru ama dağılımı gerçek sınavdan farklı. */
const okulDenemesi: Deneme = {
  id: 'okul1',
  sablonId: 'okul',
  ad: 'Okul Denemesi 1',
  tarih: '2026-08-14',
  sonuclar: [
    { dersId: 'edebiyat', dogru: 24, yanlis: 3 },
    { dersId: 'matematik', dogru: 22, yanlis: 4 },
    { dersId: 'tarih', dogru: 10, yanlis: 1 },
    { dersId: 'cografya', dogru: 9, yanlis: 2 },
    { dersId: 'fizik', dogru: 6, yanlis: 2 },
    { dersId: 'kimya', dogru: 6, yanlis: 1 },
    { dersId: 'biyoloji', dogru: 7, yanlis: 1 },
    { dersId: 'din', dogru: 5, yanlis: 1 },
  ],
}

const temel = { sablonlar, tur: 'ea' as const, obp: 475 }

describe('tahminUret', () => {
  it('deneme yoksa null döner', () => {
    expect(
      tahminUret({ ...temel, tytDenemesi: undefined, aytDenemesi: undefined }),
    ).toBeNull()
  })

  it('TYT + AYT denemesinden puan ve sıralama üretir', () => {
    const t = tahminUret({ ...temel, tytDenemesi, aytDenemesi })!
    expect(t.sinavPuani).toBeGreaterThan(350)
    expect(t.sinavPuani).toBeLessThan(500)
    expect(t.yerlestirmePuani).toBeCloseTo(t.sinavPuani + 475 * 0.12, 1)
    expect(t.siralama.yillar).toHaveLength(3)
    expect(t.aytVar).toBe(true)
  })

  it('gerçek formatlı denemede oranlama yapılmaz', () => {
    const t = tahminUret({ ...temel, tytDenemesi, aytDenemesi })!
    expect(t.oranlanan).toEqual([])
  })

  it('okul denemesinde farklı soru sayılı testler oranlanır', () => {
    const t = tahminUret({ ...temel, tytDenemesi, aytDenemesi: okulDenemesi })!
    // Okul denemesinde Matematik 30 soru, AYT'de 40 → oranlanmalı
    expect(t.oranlanan).toContain('ayt-mat')
    expect(t.oranlanan).toContain('ayt-edebiyat')
    // 22 doğru 4 yanlış = 21 net, 30 → 40 ölçeğinde 28
    expect(t.netler['ayt-mat']).toBeCloseTo(28, 1)
  })

  /**
   * Gerileme testi: iki deneme de aynı ÖSYM testini içeriyorsa soru sayıları
   * toplanmamalı. Toplandığında ölçek bozulup net yarıya düşüyordu.
   */
  it('aynı testi içeren iki deneme seçilince net yarıya düşmez', () => {
    const yalniz = tahminUret({ ...temel, tytDenemesi: undefined, aytDenemesi: okulDenemesi })!
    const ikili = tahminUret({ ...temel, tytDenemesi, aytDenemesi: okulDenemesi })!

    // AYT tarafı aynı denemeden geldiği için netler birebir aynı olmalı
    expect(ikili.netler['ayt-mat']).toBe(yalniz.netler['ayt-mat'])
    expect(ikili.netler['ayt-edebiyat']).toBe(yalniz.netler['ayt-edebiyat'])

    // TYT eklendiği için puan yalnızca yükselmeli
    expect(ikili.sinavPuani).toBeGreaterThan(yalniz.sinavPuani)
  })

  it('aynı deneme iki tarafta da seçilebilir', () => {
    const t = tahminUret({ ...temel, tytDenemesi: okulDenemesi, aytDenemesi: okulDenemesi })!
    expect(t.netler['ayt-mat']).toBeCloseTo(28, 1)
  })

  it('AYT seçilmezse bayrak düşer', () => {
    const t = tahminUret({ ...temel, tytDenemesi, aytDenemesi: undefined })!
    expect(t.aytVar).toBe(false)
  })
})

describe('şablon bütünlüğü', () => {
  it('hazır şablonlarda her dersin ÖSYM testi tanımlı', () => {
    for (const sablon of HAZIR_SABLONLAR) {
      for (const ders of sablon.dersler) {
        expect(ders.osymTesti, `${sablon.ad} / ${ders.ad}`).toBeDefined()
      }
    }
  })

  it('bilinmeyen kimlikte varsayılan şablona düşer', () => {
    expect(sablonBul(sablonlar, 'yok-boyle-bir-sey').id).toBe('okul')
  })
})

describe('aday listeleri', () => {
  const denemeler = [tytDenemesi, aytDenemesi, okulDenemesi]

  /**
   * Gerileme testi: okul denemesi türü "okul" olmasına rağmen içinde hiç TYT
   * testi yok. TYT listesine girseydi (en yeni olduğu için) varsayılan seçim
   * olur, bütün TYT netleri sıfır sayılır ve puan gerçeğin çok altına düşerdi.
   */
  it('TYT testi içermeyen deneme TYT listesine girmez', () => {
    const liste = tytAdaylari(denemeler, sablonlar).map((d) => d.id)
    expect(liste).toContain('tyt1')
    expect(liste).not.toContain('okul1')
    expect(liste).not.toContain('ayt1')
  })

  it('AYT testi içeren denemeler AYT listesinde', () => {
    const liste = aytAdaylari(denemeler, sablonlar).map((d) => d.id)
    expect(liste).toContain('ayt1')
    expect(liste).toContain('okul1')
    expect(liste).not.toContain('tyt1')
  })

  it('en yeni deneme tarihe göre seçilir', () => {
    expect(enYeni(denemeler)?.id).toBe('okul1')
    expect(enYeni([])).toBeUndefined()
  })
})
