import { describe, expect, it } from 'vitest'
import {
  bekleyenOzetHaftasi,
  dakikaYaz,
  gunYaz,
  haftaAraligi,
  haftaKaydir,
  haftaYaz,
  haftalikOzet,
  pazarMi,
  sayiEki,
  yuzdeYaz,
  type OzetGirdisi,
} from './ozet'
import type { Deneme, GunlukKayit, Sablon } from './types'

// 2026-08-17 pazartesi → hafta 17–23 Ağustos 2026
const PAZARTESI = '2026-08-17'
const CARSAMBA = '2026-08-19'
const PAZAR = '2026-08-23'
/** Haftanın dışında bir gün — sızıntı testleri için. */
const SONRAKI_PAZARTESI = '2026-08-24'

const SABLON: Sablon = {
  id: 's1',
  ad: 'TYT',
  tur: 'tyt',
  yanlisKatsayi: 4,
  hazir: true,
  dersler: [
    { id: 'turkce', ad: 'Türkçe', soruSayisi: 40 },
    { id: 'mat', ad: 'Matematik', soruSayisi: 40 },
  ],
}

function gun(tarih: string, ...satirlar: [string, number][]): GunlukKayit {
  return {
    tarih,
    kayitlar: satirlar.map(([ders, toplam]) => ({ ders, toplam, dogru: toplam, yanlis: 0 })),
  }
}

function deneme(id: string, tarih: string, dogru: number): Deneme {
  return {
    id,
    sablonId: 's1',
    ad: `Deneme ${id}`,
    tarih,
    sonuclar: [
      { dersId: 'turkce', dogru, yanlis: 0 },
      { dersId: 'mat', dogru: 0, yanlis: 0 },
    ],
  }
}

function girdi(ek: Partial<OzetGirdisi> = {}): OzetGirdisi {
  return {
    haftaBasiIso: PAZARTESI,
    gunlukKayitlar: [],
    gunlukHedef: 100,
    devamsizlik: [],
    pomodoroGecmis: [],
    oyunGecmisi: [],
    yanlisSorular: [],
    denemeler: [],
    sablonlar: [SABLON],
    ...ek,
  }
}

describe('hafta aralığı', () => {
  it('pazartesiden pazara yedi gün üretir', () => {
    const hafta = haftaAraligi(CARSAMBA)
    expect(hafta.baslangic).toBe(PAZARTESI)
    expect(hafta.bitis).toBe(PAZAR)
    expect(hafta.gunler).toHaveLength(7)
    expect(hafta.gunler[0]).toBe(PAZARTESI)
    expect(hafta.gunler[6]).toBe(PAZAR)
  })

  it('pazar günü kendi haftasına aittir, sonrakine değil', () => {
    expect(haftaAraligi(PAZAR).baslangic).toBe(PAZARTESI)
  })

  it('ay sınırını aşan haftada da yedi gün üretir', () => {
    const hafta = haftaAraligi('2026-08-31')
    expect(hafta.baslangic).toBe('2026-08-31')
    expect(hafta.bitis).toBe('2026-09-06')
  })

  it('haftaKaydir ileri ve geri gider', () => {
    expect(haftaKaydir(PAZARTESI, -1)).toBe('2026-08-10')
    expect(haftaKaydir(PAZARTESI, 1)).toBe(SONRAKI_PAZARTESI)
  })

  it('pazarMi yalnızca pazarı doğru bulur', () => {
    expect(pazarMi(PAZAR)).toBe(true)
    expect(pazarMi(PAZARTESI)).toBe(false)
  })
})

describe('bekleyen özet haftası', () => {
  it('pazar günü, biten haftanın kendisini verir', () => {
    expect(bekleyenOzetHaftasi(PAZAR)).toBe(PAZARTESI)
  })

  it('hafta içinde bir önceki haftayı verir', () => {
    expect(bekleyenOzetHaftasi(CARSAMBA)).toBe('2026-08-10')
  })

  it('pazar ile ertesi pazartesi aynı haftayı gösterir', () => {
    expect(bekleyenOzetHaftasi(SONRAKI_PAZARTESI)).toBe(bekleyenOzetHaftasi(PAZAR))
  })
})

describe('haftalık özet — soru ve hedef', () => {
  it('yalnızca haftanın günlerini toplar', () => {
    const ozet = haftalikOzet(
      girdi({
        gunlukKayitlar: [
          gun(PAZARTESI, ['Matematik', 120]),
          gun(PAZAR, ['Türkçe', 80]),
          gun(SONRAKI_PAZARTESI, ['Fizik', 500]),
        ],
      }),
    )
    expect(ozet.toplamSoru).toBe(200)
  })

  it('hedefi belirgin şekilde aşınca "asti" der', () => {
    const ozet = haftalikOzet(
      girdi({ gunlukHedef: 100, gunlukKayitlar: [gun(PAZARTESI, ['Matematik', 900])] }),
    )
    expect(ozet.haftalikHedef).toBe(700)
    expect(ozet.hedefDurumu).toBe('asti')
    expect(ozet.hedefFarki).toBe(200)
  })

  it('hedefin hemen altını "tutturdu" sayar — %2 tolerans', () => {
    const ozet = haftalikOzet(
      girdi({ gunlukHedef: 100, gunlukKayitlar: [gun(PAZARTESI, ['Matematik', 695])] }),
    )
    expect(ozet.hedefDurumu).toBe('tutturdu')
  })

  it('hedefin gerisinde kalınca farkı eksi verir', () => {
    const ozet = haftalikOzet(
      girdi({ gunlukHedef: 100, gunlukKayitlar: [gun(PAZARTESI, ['Matematik', 100])] }),
    )
    expect(ozet.hedefDurumu).toBe('geride')
    expect(ozet.hedefFarki).toBe(-600)
  })

  it('günlük hedefin tutturulduğu günleri sayar', () => {
    const ozet = haftalikOzet(
      girdi({
        gunlukHedef: 100,
        gunlukKayitlar: [
          gun(PAZARTESI, ['Matematik', 100]),
          gun(CARSAMBA, ['Matematik', 99]),
          gun(PAZAR, ['Matematik', 300]),
        ],
      }),
    )
    expect(ozet.hedefliGun).toBe(2)
  })

  it('seri haftanın son gününden geriye sayılır, bugünden değil', () => {
    // Pazartesi–pazar hepsi hedefi tutturuyor → yedi günlük seri.
    const kayitlar = haftaAraligi(PAZARTESI).gunler.map((g) => gun(g, ['Matematik', 150]))
    const ozet = haftalikOzet(girdi({ gunlukHedef: 100, gunlukKayitlar: kayitlar }))
    expect(ozet.seri).toBe(7)
  })

  it('hedefin tutturulmadığı gün seriyi keser', () => {
    const gunler = haftaAraligi(PAZARTESI).gunler
    const kayitlar = gunler.map((g, i) => gun(g, ['Matematik', i === 4 ? 10 : 150]))
    const ozet = haftalikOzet(girdi({ gunlukHedef: 100, gunlukKayitlar: kayitlar }))
    // Cuma (indeks 4) düştü; cumartesi–pazar kaldı.
    expect(ozet.seri).toBe(2)
  })
})

describe('haftalık özet — diğer alanlar', () => {
  it('devamsızlıkta yarım günü 0,5 sayar ve türlere ayırır', () => {
    const ozet = haftalikOzet(
      girdi({
        devamsizlik: [
          { id: '1', tarih: PAZARTESI, tur: 'ozursuz', yarimGun: false },
          { id: '2', tarih: CARSAMBA, tur: 'ozursuz', yarimGun: true },
          { id: '3', tarih: PAZAR, tur: 'ozurlu', yarimGun: false },
          { id: '4', tarih: SONRAKI_PAZARTESI, tur: 'ozursuz', yarimGun: false },
        ],
      }),
    )
    expect(ozet.devamsizlikOzursuz).toBe(1.5)
    expect(ozet.devamsizlikOzurlu).toBe(1)
    expect(ozet.devamsizlikToplam).toBe(2.5)
  })

  it('pomodoro dakikasını toplar ve en çok çalışılan dersi bulur', () => {
    const ozet = haftalikOzet(
      girdi({
        pomodoroGecmis: [
          { id: '1', baslangic: `${PAZARTESI}T10:00:00.000Z`, dakika: 25, ders: 'Matematik' },
          { id: '2', baslangic: `${CARSAMBA}T10:00:00.000Z`, dakika: 50, ders: 'Fizik' },
          { id: '3', baslangic: `${PAZAR}T10:00:00.000Z`, dakika: 30, ders: 'Matematik' },
          { id: '4', baslangic: `${SONRAKI_PAZARTESI}T10:00:00.000Z`, dakika: 999, ders: 'Kimya' },
        ],
      }),
    )
    expect(ozet.pomodoroDakika).toBe(105)
    expect(ozet.pomodoroSeans).toBe(3)
    expect(ozet.pomodoroDers).toEqual({ ders: 'Matematik', dakika: 55 })
  })

  it('gece yarısına yakın seansı yerel güne göre sayar, UTC gününe göre değil', () => {
    // Yerel saatle pazartesi 00.30'da başlayan seans. UTC+3'te bu, UTC'de
    // pazar 21.30 — ham damganın ilk on karakteri alınsaydı seans bir önceki
    // haftaya düşerdi.
    const yerelGeceYarisi = new Date(2026, 7, 17, 0, 30).toISOString()
    const ozet = haftalikOzet(
      girdi({ pomodoroGecmis: [{ id: '1', baslangic: yerelGeceYarisi, dakika: 25 }] }),
    )
    expect(ozet.pomodoroDakika).toBe(25)
  })

  it('dersi olmayan pomodoro seansı süreye girer ama ders sıralamasına girmez', () => {
    const ozet = haftalikOzet(
      girdi({
        pomodoroGecmis: [{ id: '1', baslangic: `${PAZARTESI}T10:00:00.000Z`, dakika: 40 }],
      }),
    )
    expect(ozet.pomodoroDakika).toBe(40)
    expect(ozet.pomodoroDers).toBeNull()
  })

  it('oyun süresini dakikaya çevirir ve en çok oynananı bulur', () => {
    const ozet = haftalikOzet(
      girdi({
        oyunGecmisi: [
          { tarih: PAZARTESI, oyun: 'yazim', saniye: 60, dogru: 10 },
          { tarih: PAZARTESI, oyun: 'yazim', saniye: 54, dogru: 8 },
          { tarih: CARSAMBA, oyun: 'islem', saniye: 60, dogru: 12 },
          { tarih: SONRAKI_PAZARTESI, oyun: 'edebiyat', saniye: 60, dogru: 5 },
        ],
      }),
    )
    expect(ozet.oyunTur).toBe(3)
    expect(ozet.oyunDogru).toBe(30)
    expect(ozet.oyunDakika).toBe(3)
    expect(ozet.enCokOynanan).toBe('yazim')
  })

  it('bankada yalnızca o hafta çözülmüş işaretlenenleri sayar', () => {
    const soru = (id: string, cozuldu: boolean, cozulmeTarihi?: string) => ({
      id,
      ders: 'Matematik',
      tarih: PAZARTESI,
      resimId: `r${id}`,
      cozuldu,
      cozulmeTarihi,
    })
    const ozet = haftalikOzet(
      girdi({
        yanlisSorular: [
          soru('1', true, PAZARTESI),
          soru('2', true, SONRAKI_PAZARTESI),
          // Tarihi olmayan eski kayıt hiçbir haftaya sayılmaz.
          soru('3', true),
          soru('4', false),
        ],
      }),
    )
    expect(ozet.bankaCozulen).toBe(1)
  })

  it('deneme netlerini en yüksek, en düşük ve ortalama olarak verir', () => {
    const ozet = haftalikOzet(
      girdi({
        denemeler: [
          deneme('a', PAZARTESI, 30),
          deneme('b', CARSAMBA, 20),
          deneme('c', PAZAR, 40),
          deneme('d', SONRAKI_PAZARTESI, 80),
        ],
      }),
    )
    expect(ozet.denemeSayisi).toBe(3)
    expect(ozet.denemeEnYuksek?.net).toBe(40)
    expect(ozet.denemeEnDusuk?.net).toBe(20)
    expect(ozet.denemeOrtalama).toBe(30)
  })

  it('tek deneme varsa en yüksek ve en düşük aynıdır', () => {
    const ozet = haftalikOzet(girdi({ denemeler: [deneme('a', PAZARTESI, 25)] }))
    expect(ozet.denemeEnYuksek?.net).toBe(25)
    expect(ozet.denemeEnDusuk?.net).toBe(25)
    expect(ozet.denemeOrtalama).toBe(25)
  })

  it('şablonu silinmiş deneme ortalamayı bozmaz', () => {
    const oksuz: Deneme = { ...deneme('x', PAZARTESI, 10), sablonId: 'yok' }
    const ozet = haftalikOzet(girdi({ denemeler: [deneme('a', PAZARTESI, 30), oksuz] }))
    expect(ozet.denemeSayisi).toBe(1)
    expect(ozet.denemeOrtalama).toBe(30)
  })

  it('en çok soru çözülen üç dersi çoktan aza sıralar', () => {
    const ozet = haftalikOzet(
      girdi({
        gunlukKayitlar: [
          gun(PAZARTESI, ['Matematik', 100], ['Türkçe', 60], ['Fizik', 40]),
          gun(CARSAMBA, ['Türkçe', 50], ['Kimya', 10]),
        ],
      }),
    )
    expect(ozet.ilkUcDers.map((d) => d.ders)).toEqual(['Türkçe', 'Matematik', 'Fizik'])
    expect(ozet.ilkUcDers[0].soru).toBe(110)
    expect(ozet.ilkUcDers[0].oran).toBeCloseTo(110 / 260, 5)
  })

  it('eşit soruda ders adına göre sıralar — sıra her açılışta aynı kalsın', () => {
    const ozet = haftalikOzet(
      girdi({ gunlukKayitlar: [gun(PAZARTESI, ['Zooloji', 50], ['Anatomi', 50])] }),
    )
    expect(ozet.ilkUcDers.map((d) => d.ders)).toEqual(['Anatomi', 'Zooloji'])
  })

  it('hiç veri yoksa bosMu doğrudur', () => {
    expect(haftalikOzet(girdi()).bosMu).toBe(true)
  })

  it('tek bir pomodoro seansı bile özeti dolu sayar', () => {
    const ozet = haftalikOzet(
      girdi({
        pomodoroGecmis: [{ id: '1', baslangic: `${PAZARTESI}T09:00:00.000Z`, dakika: 25 }],
      }),
    )
    expect(ozet.bosMu).toBe(false)
  })
})

describe('yazı yardımcıları', () => {
  it('aynı ay içindeki haftayı tek ay adıyla yazar', () => {
    expect(haftaYaz(haftaAraligi(PAZARTESI))).toBe('17–23 Ağustos')
  })

  it('ay değiştiren haftada iki ay adı yazar', () => {
    expect(haftaYaz(haftaAraligi('2026-08-31'))).toBe('31 Ağustos – 6 Eylül')
  })

  it('dakikayı saate çevirir', () => {
    expect(dakikaYaz(45)).toBe('45 dk')
    expect(dakikaYaz(60)).toBe('1 sa')
    expect(dakikaYaz(95)).toBe('1 sa 35 dk')
  })

  it('yarım günü virgüllü yazar', () => {
    expect(gunYaz(2)).toBe('2')
    expect(gunYaz(1.5)).toBe('1,5')
  })

  it('yüzde ekini sayının okunuşuna göre seçer', () => {
    // Birler basamağı belirleyici: "kırk dokuz" → u, "kırk" → ı
    expect(yuzdeYaz(0.49)).toBe("%49'u")
    expect(yuzdeYaz(0.4)).toBe("%40'ı")
    expect(yuzdeYaz(0.03)).toBe("%3'ü")
    expect(yuzdeYaz(0.11)).toBe("%11'i")
    expect(yuzdeYaz(0.7)).toBe("%70'i")
    // "yüz" ile bitiyor
    expect(yuzdeYaz(1)).toBe("%100'ü")
  })

  it('sayiEki her birler basamağı için bir ek verir', () => {
    for (let i = 0; i <= 100; i++) {
      expect(sayiEki(i)).toMatch(/^[ıiuü]$/)
    }
  })
})
