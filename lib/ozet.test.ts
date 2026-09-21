import { describe, expect, it } from 'vitest'
import {
  arsivdeEksikAylar,
  ayAraligi,
  ayAraligiYaz,
  ayKaydir,
  aylikOzet,
  bekleyenOzetAyi,
  dakikaKisa,
  dakikaYaz,
  ondalikYuzdeYaz,
  ozetGosterilebilirMi,
  sayiEki,
  sonrakiOzetGunu,
  tamYaz,
  yuzdeYaz,
  type AylikOzet,
  type OzetGirdisi,
} from './ozet'
import type { Deneme, GunlukKayit, OyunTurKaydi, PomodoroSeans, Sablon } from './types'

const EYLUL = '2026-09'
/** Ayın dışında bir gün — sızıntı testleri için. */
const EKIM_1 = '2026-10-01'

const TYT: Sablon = {
  id: 'tyt',
  ad: 'TYT',
  tur: 'tyt',
  yanlisKatsayi: 4,
  hazir: true,
  dersler: [
    { id: 'turkce', ad: 'Türkçe', soruSayisi: 40 },
    { id: 'mat', ad: 'Matematik', soruSayisi: 40 },
  ],
}
const AYT: Sablon = { ...TYT, id: 'ayt', ad: 'AYT', tur: 'ayt' }

function gun(tarih: string, ...satirlar: [string, number, number?][]): GunlukKayit {
  return {
    tarih,
    kayitlar: satirlar.map(([ders, toplam, yanlis = 0]) => ({
      ders,
      toplam,
      dogru: toplam - yanlis,
      yanlis,
    })),
  }
}

function deneme(id: string, tarih: string, dogru: number, sablonId = 'tyt'): Deneme {
  return {
    id,
    sablonId,
    ad: `Deneme ${id}`,
    tarih,
    sonuclar: [
      { dersId: 'turkce', dogru, yanlis: 0 },
      { dersId: 'mat', dogru: 0, yanlis: 0 },
    ],
  }
}

function seans(tarih: string, dakika: number): PomodoroSeans {
  // Yerel öğle saati: UTC kaymasıyla gün değişmesin.
  return { id: tarih + dakika, baslangic: new Date(`${tarih}T12:00:00`).toISOString(), dakika }
}

function tur(tarih: string, oyun: OyunTurKaydi['oyun'], dogru: number, yanlis?: number): OyunTurKaydi {
  return { tarih, oyun, saniye: 60, dogru, yanlis }
}

function girdi(ek: Partial<OzetGirdisi> = {}): OzetGirdisi {
  return {
    ay: EYLUL,
    gunlukKayitlar: [],
    gunlukHedef: 100,
    pomodoroGecmis: [],
    oyunGecmisi: [],
    denemeler: [],
    sablonlar: [TYT, AYT],
    konuIlerleme: {},
    okumaGecmisi: [],
    ...ek,
  }
}

describe('ay aralığı', () => {
  it('ayın bütün günlerini üretir', () => {
    const ay = ayAraligi(EYLUL)
    expect(ay.baslangic).toBe('2026-09-01')
    expect(ay.bitis).toBe('2026-09-30')
    expect(ay.gunler).toHaveLength(30)
    expect(ayAraligi('2028-02').gunler).toHaveLength(29)
  })

  it('ayKaydir yıl sınırını geçer', () => {
    expect(ayKaydir('2026-12', 1)).toBe('2027-01')
    expect(ayKaydir('2026-01', -1)).toBe('2025-12')
  })

  it('ayAraligiYaz gün sayısını yazar', () => {
    expect(ayAraligiYaz(ayAraligi(EYLUL))).toBe('1 — 30 Eylül')
    expect(ayAraligiYaz(ayAraligi('2026-02'))).toBe('1 — 28 Şubat')
  })
})

describe('bekleyen özet ayı', () => {
  it('yalnızca ayın 1inde bir önceki ayı verir', () => {
    expect(bekleyenOzetAyi('2026-10-01')).toBe(EYLUL)
    expect(bekleyenOzetAyi('2026-10-02')).toBeNull()
    expect(bekleyenOzetAyi('2026-09-30')).toBeNull()
    expect(bekleyenOzetAyi('2027-01-01')).toBe('2026-12')
  })

  it('sonraki özet günü bir sonraki ayın 1i', () => {
    expect(sonrakiOzetGunu('2026-09-17')).toBe('2026-10-01')
    // Ayın 1'inde bile bir sonraki ayı gösteriyor: o günkü özet ya aktif ya izlenmiş.
    expect(sonrakiOzetGunu('2026-10-01')).toBe('2026-11-01')
    expect(sonrakiOzetGunu('2026-12-05')).toBe('2027-01-01')
  })

  it('arşivde eksik ayları ilk veriden bugüne kadar sayar, bu ayı saymaz', () => {
    const bos = {} as AylikOzet
    expect(arsivdeEksikAylar({}, '2026-07-20', '2026-10-01')).toEqual(['2026-07', '2026-08', '2026-09'])
    expect(arsivdeEksikAylar({ '2026-08': bos }, '2026-07-20', '2026-10-01')).toEqual(['2026-07', '2026-09'])
    expect(arsivdeEksikAylar({}, '2026-10-05', '2026-10-20')).toEqual([])
    expect(arsivdeEksikAylar({}, null, '2026-10-20')).toEqual([])
  })
})

describe('aylık özet — soru ve haftalar', () => {
  it('yalnızca ayın günlerini toplar', () => {
    const ozet = aylikOzet(
      girdi({
        gunlukKayitlar: [
          gun('2026-09-01', ['Matematik', 120]),
          gun('2026-09-30', ['Türkçe', 80]),
          gun(EKIM_1, ['Fizik', 500]),
          gun('2026-08-31', ['Fizik', 500]),
        ],
      }),
    )
    expect(ozet.toplamSoru).toBe(200)
    expect(ozet.calisilanGun).toBe(2)
  })

  it('haftaları 1-7, 8-14, 15-21, 22-son diye böler', () => {
    const ozet = aylikOzet(
      girdi({
        gunlukKayitlar: [gun('2026-09-07', ['M', 10]), gun('2026-09-08', ['M', 20]), gun('2026-09-30', ['M', 30])],
      }),
    )
    expect(ozet.haftalar.map((h) => h.ad)).toEqual(['1-7 Eyl', '8-14 Eyl', '15-21 Eyl', '22-30 Eyl'])
    expect(ozet.haftalar.map((h) => h.soru)).toEqual([10, 20, 0, 30])
    expect(aylikOzet(girdi({ ay: '2026-02' })).haftalar.map((h) => h.ad)).toEqual([
      '1-7 Şub', '8-14 Şub', '15-21 Şub', '22-28 Şub',
    ])
  })

  it('en uzun seri art arda çalışılan günleri sayar', () => {
    const ozet = aylikOzet(
      girdi({
        gunlukKayitlar: [gun('2026-09-01', ['M', 1]), gun('2026-09-02', ['M', 1])],
        pomodoroGecmis: [seans('2026-09-03', 25)],
        oyunGecmisi: [tur('2026-09-05', 'islem', 5)],
      }),
    )
    expect(ozet.calisilanGun).toBe(4)
    expect(ozet.enUzunSeri).toBe(3)
  })
})

describe('aylık özet — gösterim uygunluğu', () => {
  it.each([
    [0, false],
    [1, false],
    [6, false],
    [7, true],
  ])('%i etkin günde gösterim kararı %s olur', (gunSayisi, beklenen) => {
    const gunlukKayitlar = Array.from({ length: gunSayisi }, (_, sira) =>
      gun(`2026-09-${String(sira + 1).padStart(2, '0')}`, ['Matematik', 1]),
    )
    const ozet = aylikOzet(girdi({ gunlukKayitlar }))

    expect(ozet.calisilanGun).toBe(gunSayisi)
    expect(ozetGosterilebilirMi(ozet)).toBe(beklenen)
  })

  it('deneme ve bitirilen konu günlerini de etkin sayar', () => {
    const ozet = aylikOzet(
      girdi({
        denemeler: [deneme('a', '2026-09-03', 20)],
        konuIlerleme: {
          konu: { bitti: true, bitisTarihi: '2026-09-04', tarih: '2026-09-04' },
        },
      }),
    )

    expect(ozet.calisilanGun).toBe(2)
  })
})

describe('aylık özet — dersler', () => {
  it('ilk üç dersi doğru/yanlış/boş ve gün sayısıyla verir', () => {
    const ozet = aylikOzet(
      girdi({
        gunlukKayitlar: [
          gun('2026-09-01', ['Matematik', 100, 20], ['Türkçe', 50], ['Fizik', 30], ['Tarih', 10]),
          gun('2026-09-02', ['Matematik', 100, 10]),
        ],
      }),
    )
    expect(ozet.ilkUcDers.map((d) => d.ders)).toEqual(['Matematik', 'Türkçe', 'Fizik'])
    const mat = ozet.ilkUcDers[0]
    expect(mat.soru).toBe(200)
    expect(mat.yanlis).toBe(30)
    expect(mat.dogru).toBe(170)
    expect(mat.bos).toBe(0)
    expect(mat.basari).toBeCloseTo(0.85)
    expect(mat.gunSayisi).toBe(2)
    expect(mat.oran).toBeCloseTo(200 / 290)
  })

  it('boş sayılır: toplam − doğru − yanlış', () => {
    const ozet = aylikOzet(
      girdi({
        gunlukKayitlar: [{ tarih: '2026-09-01', kayitlar: [{ ders: 'M', toplam: 40, dogru: 30, yanlis: 5 }] }],
      }),
    )
    expect(ozet.ilkUcDers[0].bos).toBe(5)
  })
})

describe('aylık özet — denemeler', () => {
  it('TYT ve AYT için ayrı ayrı en yüksek neti bulur', () => {
    const ozet = aylikOzet(
      girdi({
        denemeler: [
          deneme('a', '2026-09-03', 20),
          deneme('b', '2026-09-14', 35),
          deneme('c', '2026-09-20', 25, 'ayt'),
          deneme('d', EKIM_1, 40),
        ],
      }),
    )
    expect(ozet.denemeSayisi).toBe(3)
    expect(ozet.enIyiTyt?.net).toBe(35)
    expect(ozet.enIyiTyt?.tarih).toBe('2026-09-14')
    expect(ozet.enIyiTyt?.toplamSoru).toBe(80)
    expect(ozet.enIyiAyt?.net).toBe(25)
  })

  it('deneme yoksa ikisi de null', () => {
    const ozet = aylikOzet(girdi())
    expect(ozet.enIyiTyt).toBeNull()
    expect(ozet.enIyiAyt).toBeNull()
  })
})

describe('aylık özet — pomodoro ve oyunlar', () => {
  it('pomodoro toplamını, en uzun günü ve seriyi sayar', () => {
    const ozet = aylikOzet(
      girdi({
        pomodoroGecmis: [seans('2026-09-01', 25), seans('2026-09-01', 50), seans('2026-09-02', 25), seans(EKIM_1, 90)],
      }),
    )
    expect(ozet.pomodoroDakika).toBe(100)
    expect(ozet.pomodoroSeans).toBe(3)
    expect(ozet.enUzunGunDakika).toBe(75)
    expect(ozet.pomodoroSeri).toBe(2)
    expect(ozet.pomodoroOrani).toBeCloseTo(100 / (30 * 24 * 60))
  })

  it('oyun sorusu doğru + yanlış; yanlışı olmayan eski turda yalnızca doğru', () => {
    const ozet = aylikOzet(
      girdi({
        oyunGecmisi: [tur('2026-09-01', 'islem', 8, 2), tur('2026-09-02', 'islem', 5), tur('2026-09-02', 'koklu', 3, 0)],
      }),
    )
    expect(ozet.oyunSoru).toBe(18)
    expect(ozet.oyunTur).toBe(3)
    expect(ozet.enCokOynananlar[0]).toEqual({ oyun: 'islem', soru: 15, tur: 2 })
    expect(ozet.okumaDakika).toBe(0)
  })
})

describe('aylık özet — konu ve kapanış', () => {
  it('bu ay bitirilen konuları sayar', () => {
    const ozet = aylikOzet(
      girdi({
        konuIlerleme: {
          // Bu ay bitti.
          a: { bitti: true, tarih: '2026-09-10', bitisTarihi: '2026-09-10' },
          // Bitmedi.
          b: { bitti: false, tarih: '2026-09-11' },
          // Geçen ay bitti, bu ay yeniden okundu — geçen aya ait.
          c: { bitti: true, tarih: '2026-09-11', bitisTarihi: '2026-08-11' },
          // Eski kayıt, bitiş günü yok — hiçbir aya sayılmıyor.
          d: { bitti: true, tarih: '2026-09-12' },
        },
      }),
    )
    expect(ozet.okunanKonu).toBe(1)
    expect(ozet.bosMu).toBe(false)
  })

  it('okuma süresini yalnızca ayın seanslarından toplar', () => {
    const ozet = aylikOzet(
      girdi({
        okumaGecmisi: [
          { konuId: 'a', tarih: '2026-09-03', saniye: 600 },
          { konuId: 'a', tarih: '2026-09-04', saniye: 330 },
          { konuId: 'b', tarih: EKIM_1, saniye: 9000 },
        ],
      }),
    )
    expect(ozet.okumaDakika).toBe(16)
    expect(ozet.calisilanGun).toBe(2)
    expect(ozet.bosMu).toBe(false)
  })

  it('sonraki ayın hedefi günlük hedef × gün', () => {
    expect(aylikOzet(girdi({ gunlukHedef: 100 })).sonrakiAyHedefi).toBe(3100)
    expect(aylikOzet(girdi({ gunlukHedef: 0 })).sonrakiAyHedefi).toBe(0)
  })

  it('hiç veri yoksa boş', () => {
    expect(aylikOzet(girdi()).bosMu).toBe(true)
  })
})

describe('yazı yardımcıları', () => {
  it('dakikaYaz ve dakikaKisa', () => {
    expect(dakikaYaz(45)).toBe('45 dk')
    expect(dakikaYaz(120)).toBe('2 sa')
    expect(dakikaYaz(80)).toBe('1 sa 20 dk')
    expect(dakikaKisa(2900)).toBe('48sa 20dk')
    expect(dakikaKisa(5)).toBe('5dk')
  })

  it('tamYaz binlik ayraç koyar', () => {
    expect(tamYaz(3860)).toBe('3.860')
  })

  it('sayı eki okunuşa uyar', () => {
    expect(sayiEki(49)).toBe('u')
    expect(sayiEki(40)).toBe('ı')
    expect(sayiEki(42)).toBe('si')
    expect(sayiEki(100)).toBe('ü')
    expect(sayiEki(0)).toBe('ı')
    expect(yuzdeYaz(0.49)).toBe("%49'u")
    expect(yuzdeYaz(0.26)).toBe("%26'sı")
  })

  it('ondalıklı yüzde eki', () => {
    expect(ondalikYuzdeYaz(0.067)).toBe("%6,7'si")
    expect(ondalikYuzdeYaz(0.063)).toBe("%6,3'ü")
    expect(ondalikYuzdeYaz(0.07)).toBe("%7'si")
  })
})
