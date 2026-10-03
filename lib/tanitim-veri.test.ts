import { describe, expect, it } from 'vitest'
import { sablonlariBirlestir, secilebilirSablonlar } from './sablonlar'
import { demoDenemeleri, demoSablonIdleri, tanitimKaydiMi, tanitimKayitlariniAyikla, tanitimKimligi } from './tanitim-veri'
import { net } from './hesap'
import type { PuanTuru } from './types'

const SABLONLAR = sablonlariBirlestir([])

describe('Tanıtımın örnek denemeleri', () => {
  it.each([
    [12, 'say', ['tyt', 'ayt-say']],
    [12, 'ea', ['tyt', 'ayt-ea']],
    [11, 'soz', ['tyt', 'ayt-soz']],
    [13, 'dil', ['tyt', 'ydt']],
    [12, null, ['tyt', 'tyt']],
    [10, 'say', ['tyt', 'tyt']],
  ] as [number, PuanTuru | null, string[]][])('%i. sınıf, %s alanı → %j', (sinif, puanTuru, beklenen) => {
    expect(demoSablonIdleri(sinif, puanTuru)).toEqual(beklenen)
    // Örnekler öğrencinin kendi deneme formunda seçebileceği türlerden.
    const secilebilir = secilebilirSablonlar(SABLONLAR, sinif, puanTuru).map((s) => s.id)
    for (const id of beklenen) expect(secilebilir).toContain(id)
  })

  it('Dil öğrencisine AYT, kararsız öğrenciye alan sınavı göstermez', () => {
    expect(demoDenemeleri(12, 'dil', '2026-10-03').map((d) => d.sablonId)).not.toContain('ayt-say')
    expect(demoDenemeleri(12, null, '2026-10-03').every((d) => d.sablonId === 'tyt')).toBe(true)
  })

  it.each([['say'], ['ea'], ['soz'], ['dil'], [null]] as [PuanTuru | null][])('%s: netler şablona uyuyor ve gerçekçi', (puanTuru) => {
    const denemeler = demoDenemeleri(12, puanTuru, '2026-10-03')
    expect(denemeler.map((d) => d.tarih)).toEqual(['2026-09-19', '2026-09-26'])
    for (const deneme of denemeler) {
      expect(tanitimKaydiMi(deneme)).toBe(true)
      const sablon = SABLONLAR.find((s) => s.id === deneme.sablonId)!
      // Her ders dolu ve soru sayısını aşmıyor.
      expect(deneme.sonuclar.map((s) => s.dersId).sort()).toEqual(sablon.dersler.map((d) => d.id).sort())
      for (const sonuc of deneme.sonuclar) {
        const ders = sablon.dersler.find((d) => d.id === sonuc.dersId)!
        expect(sonuc.dogru + sonuc.yanlis).toBeLessThanOrEqual(ders.soruSayisi)
        expect(sonuc.dogru).toBeGreaterThan(sonuc.yanlis)
      }
      const toplam = deneme.sonuclar.reduce((t, s) => t + net(s.dogru, s.yanlis, sablon.yanlisKatsayi), 0)
      const soru = sablon.dersler.reduce((t, d) => t + d.soruSayisi, 0)
      // Ortalama bir aday: soruların %30–%60'ı kadar net.
      expect(toplam / soru).toBeGreaterThan(0.3)
      expect(toplam / soru).toBeLessThan(0.6)
    }
    // İki TYT varsa ikincisi birincisinden iyi (İstatistik'te ilerleme görünsün).
    if (denemeler[0].sablonId === denemeler[1].sablonId) {
      const sablon = SABLONLAR.find((s) => s.id === 'tyt')!
      const toplamNet = (i: number) => denemeler[i].sonuclar.reduce((t, s) => t + net(s.dogru, s.yanlis, sablon.yanlisKatsayi), 0)
      expect(toplamNet(1)).toBeGreaterThan(toplamNet(0))
    }
  })
})

describe('Tanıtım kayıtlarının temizliği', () => {
  it('yalnızca tanıtım önekli kayıtları siler, gerçek kayıtları sırasıyla korur', () => {
    const gercek = [{ id: 'm1abc-x9y8z7' }, { id: 'lzq-tanitim' }, { id: 'tanitimsiz-1' }]
    const liste = [gercek[0], { id: tanitimKimligi('m2') }, gercek[1], { id: 'tanitim-deneme-1' }, gercek[2]]
    expect(tanitimKayitlariniAyikla(liste)).toEqual(gercek)
    expect(tanitimKayitlariniAyikla(gercek)).toEqual(gercek)
  })
  it('kimliği iki kez öneklemez', () => {
    expect(tanitimKimligi(tanitimKimligi('abc'))).toBe('tanitim-abc')
  })
})
