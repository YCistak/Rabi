import { describe, expect, it } from 'vitest'
import {
  devamsizlikOzeti,
  denemeOzeti,
  gunOzeti,
  hedefSerisi,
  net,
  obpTahmini,
  osymNetleri,
} from './hesap'
import { HAZIR_SABLONLAR } from './sablonlar'
import type { Deneme, Devamsizlik, GunlukKayit } from './types'

const tyt = HAZIR_SABLONLAR.find((s) => s.id === 'tyt')!

describe('net', () => {
  it('dört yanlış bir doğruyu götürür', () => {
    expect(net(20, 4)).toBe(19)
    expect(net(30, 10)).toBe(27.5)
  })

  it('yanlış katsayısı 0 ise yanlış net düşürmez', () => {
    expect(net(20, 8, 0)).toBe(20)
  })

  it('kayan nokta artığı bırakmaz', () => {
    expect(net(10, 3)).toBe(9.25)
  })
})

describe('denemeOzeti', () => {
  it('boş sayısını soru sayısından hesaplar', () => {
    const deneme: Deneme = {
      id: 'd1',
      sablonId: 'tyt',
      ad: 'TYT 1',
      tarih: '2026-08-16',
      sonuclar: [
        { dersId: 'turkce', dogru: 30, yanlis: 4 },
        { dersId: 'matematik', dogru: 20, yanlis: 8 },
      ],
    }
    const ozet = denemeOzeti(deneme, tyt)

    expect(ozet.toplamSoru).toBe(120)
    expect(ozet.toplamDogru).toBe(50)
    expect(ozet.toplamYanlis).toBe(12)
    expect(ozet.toplamBos).toBe(58)
    // Türkçe 29, Matematik 18 → 47
    expect(ozet.toplamNet).toBe(47)
  })
})

describe('osymNetleri', () => {
  it('aynı ÖSYM testine bağlı dersleri toplar', () => {
    const deneme: Deneme = {
      id: 'd2',
      sablonId: 'tyt',
      ad: 'TYT 2',
      tarih: '2026-08-16',
      sonuclar: [
        { dersId: 'tarih', dogru: 4, yanlis: 0 },
        { dersId: 'cografya', dogru: 3, yanlis: 4 },
        { dersId: 'felsefe', dogru: 5, yanlis: 0 },
        { dersId: 'din', dogru: 5, yanlis: 0 },
      ],
    }
    // 4 + 2 + 5 + 5 = 16
    expect(osymNetleri(deneme, tyt)['tyt-sosyal']).toBe(16)
  })
})

describe('obpTahmini', () => {
  it('diploma notunu beşle çarpar', () => {
    const sonuc = obpTahmini(90, [
      { id: '1', sinif: 9, ortalama: 90 },
      { id: '2', sinif: 10, ortalama: 90 },
      { id: '3', sinif: 11, ortalama: 90 },
    ])
    expect(sonuc?.diplomaNotu).toBe(90)
    expect(sonuc?.obp).toBe(450)
    expect(sonuc?.tamMi).toBe(true)
  })

  it('eksik yılda tamMi false döner', () => {
    const sonuc = obpTahmini(85, [{ id: '1', sinif: 9, ortalama: 95 }])
    expect(sonuc?.diplomaNotu).toBe(90)
    expect(sonuc?.tamMi).toBe(false)
    expect(sonuc?.girilenYil).toBe(2)
  })

  it('OBP alt sınırı 250', () => {
    expect(obpTahmini(40, [])?.obp).toBe(250)
  })

  it('veri yoksa null döner', () => {
    expect(obpTahmini(null, [])).toBeNull()
  })
})

describe('gunOzeti', () => {
  it('boş sayısını toplamdan hesaplar', () => {
    const kayit: GunlukKayit = {
      tarih: '2026-08-16',
      kayitlar: [
        { ders: 'Matematik', toplam: 40, dogru: 30, yanlis: 6 },
        { ders: 'Fizik', toplam: 20, dogru: 15, yanlis: 4 },
      ],
    }
    const ozet = gunOzeti(kayit)
    expect(ozet.toplam).toBe(60)
    expect(ozet.bos).toBe(5)
    expect(ozet.net).toBe(42.5)
  })

  it('doğru+yanlış toplamı aşarsa boş negatife düşmez', () => {
    const kayit: GunlukKayit = {
      tarih: '2026-08-16',
      kayitlar: [{ ders: 'Matematik', toplam: 10, dogru: 8, yanlis: 5 }],
    }
    expect(gunOzeti(kayit).bos).toBe(0)
  })
})

describe('hedefSerisi', () => {
  const gun = (tarih: string, toplam: number): GunlukKayit => ({
    tarih,
    kayitlar: [{ ders: 'Matematik', toplam, dogru: toplam, yanlis: 0 }],
  })

  it('üst üste tutturulan günleri sayar', () => {
    const kayitlar = [gun('2026-08-14', 250), gun('2026-08-15', 300), gun('2026-08-16', 200)]
    expect(hedefSerisi(kayitlar, 200, '2026-08-16')).toBe(3)
  })

  it('bugün henüz tutturulmadıysa seriyi kırmaz', () => {
    const kayitlar = [gun('2026-08-14', 250), gun('2026-08-15', 300), gun('2026-08-16', 50)]
    expect(hedefSerisi(kayitlar, 200, '2026-08-16')).toBe(2)
  })

  it('araya boş gün girerse seri kopar', () => {
    const kayitlar = [gun('2026-08-13', 250), gun('2026-08-15', 300), gun('2026-08-16', 250)]
    expect(hedefSerisi(kayitlar, 200, '2026-08-16')).toBe(2)
  })
})

describe('devamsizlikOzeti', () => {
  const kayit = (tur: Devamsizlik['tur'], yarimGun = false): Devamsizlik => ({
    id: Math.random().toString(),
    tarih: '2026-08-16',
    tur,
    yarimGun,
  })

  it('yarım günü 0,5 sayar', () => {
    const ozet = devamsizlikOzeti([kayit('ozursuz'), kayit('ozursuz', true)])
    expect(ozet.ozursuz).toBe(1.5)
    expect(ozet.ozursuzKalan).toBe(8.5)
  })

  it('sınır aşılınca asildi true olur', () => {
    const ozet = devamsizlikOzeti(Array.from({ length: 11 }, () => kayit('ozursuz')))
    expect(ozet.asildi).toBe(true)
    expect(ozet.uyari).toBe(false)
  })

  it('sınırın %70inde uyarı verir', () => {
    const ozet = devamsizlikOzeti(Array.from({ length: 7 }, () => kayit('ozursuz')))
    expect(ozet.uyari).toBe(true)
    expect(ozet.asildi).toBe(false)
  })

  it('kayıt yoksa uyarı vermez', () => {
    const ozet = devamsizlikOzeti([])
    expect(ozet.uyari).toBe(false)
    expect(ozet.ozurluKalan).toBe(20)
  })
})
