import { describe, expect, it } from 'vitest'
import type { GunlukKayit } from './types'
import { anaBaslik } from './ana-baslik'
import type { AnaMaskotGirdisi, MaskotKurali, PomodoroHali } from './ana-maskot'

const BUGUN = '2026-09-14' // pazartesi

function gun(tarih: string, toplam: number, ders = 'Matematik'): GunlukKayit {
  return { tarih, kayitlar: [{ ders, toplam, dogru: toplam, yanlis: 0 }] }
}

const temel: AnaMaskotGirdisi = {
  bugun: BUGUN,
  saat: 15,
  hedef: 50,
  gunlukKayitlar: [],
  kalanGun: 200,
  pomodoro: null,
  devamsizlikAsildi: false,
  ozetHazir: false,
  sonDenemeTarihi: null,
  konuBitti: false,
  gorevlerBitti: false,
  bekleyenYanlis: 0,
}

/**
 * Her kuralın cümlesinde **olması** ve **olmaması** gerekenler.
 *
 * "Olmaması gerekenler" uyumsuzluğun kendisi: dans eden tavşanın altında
 * "hedefine N soru kaldı", uyuyan ya da kayıtsız günün tavşanının altında
 * "hedefine ulaştın", çalışan tavşanın altında "henüz kaydın yok".
 */
const KAYITSIZ_DEGIL = /hedefine \d+ soru|tamamladın|ulaştın|hedeftesin|Tekrar hoş geldin/
const UYUM: Record<MaskotKurali, { olmali?: RegExp; olmamali?: RegExp }> = {
  pomodoro: { olmali: /Pomodoro/ },
  mola: { olmali: /[Mm]ola/ },
  devamsizlik: { olmali: /Devamsızlık/ },
  'sinav-gunu': { olmali: /sınav günü/ },
  ozet: { olmali: /özeti hazır/ },
  deneme: { olmali: /deneme/ },
  konu: { olmali: /konu/ },
  kutlama: {
    olmali: /tamamladın|ulaştın|hedeftesin/,
    olmamali: /hedefine \d+ soru|henüz|bekliyor|göz at|başla/,
  },
  gorevler: { olmali: /görevlerini bitirdin/ },
  'geri-donus': { olmali: /Tekrar hoş geldin/ },
  calisma: {
    olmamali: /henüz soru kaydın yok|Dün hedefini|günlük serin|tamamladın|ulaştın|hedeftesin|Günaydın/,
  },
  gece: { olmamali: KAYITSIZ_DEGIL },
  sabah: { olmali: /Günaydın/, olmamali: KAYITSIZ_DEGIL },
  'hafta-sonu': { olmali: /Hafta sonu/, olmamali: KAYITSIZ_DEGIL },
  seri: { olmali: /Dün hedefini|günlük serin/ },
  yanlis: { olmali: /Yanlış bankanda \d+ soru/, olmamali: KAYITSIZ_DEGIL },
  'sinav-yakin': { olmali: /Sınava \d+ gün kaldı/, olmamali: KAYITSIZ_DEGIL },
  aksam: { olmali: /Akşam/, olmamali: KAYITSIZ_DEGIL },
  uyuyan: { olmali: /henüz/, olmamali: KAYITSIZ_DEGIL },
}

/** Bütün girdilerin kombinasyonları: her kuralın tutabileceği her yol. */
function* butunDurumlar(): Generator<AnaMaskotGirdisi> {
  const gecmisler: GunlukKayit[][] = [
    [],
    [gun('2026-09-13', 60)], // dün tuttu → seri
    [gun('2026-09-12', 60), gun('2026-09-13', 60)], // 2 günlük seri
    [gun('2026-09-05', 20)], // uzun ara → geri dönüş
    [gun('2026-09-01', 20, 'Kimya'), gun('2026-09-13', 10)], // ihmal edilen Kimya
  ]
  const bugunkuler = [0, 10, 25, 60]
  const pomodorolar: PomodoroHali[] = [null, 'calisma', 'mola']
  for (const bugun of [BUGUN, '2026-09-12'])
    for (const saat of [2, 8, 15, 19, 23])
      for (const gecmis of gecmisler)
        for (const toplam of bugunkuler)
          for (const pomodoro of pomodorolar)
            for (const kalanGun of [0, 5, 20, 200])
              for (const bayrak of [0, 1, 2, 3, 4, 5, 6]) {
                const kayitlar = toplam > 0 ? [...gecmis, gun(bugun, toplam)] : gecmis
                yield {
                  ...temel,
                  bugun,
                  saat,
                  gunlukKayitlar: kayitlar,
                  pomodoro,
                  kalanGun,
                  devamsizlikAsildi: bayrak === 1,
                  ozetHazir: bayrak === 2,
                  sonDenemeTarihi: bayrak === 3 ? bugun : '2026-09-10',
                  konuBitti: bayrak === 4,
                  gorevlerBitti: bayrak === 5,
                  bekleyenYanlis: bayrak === 6 ? 12 : 3,
                }
              }
}

describe('anaBaslik', () => {
  it('tavşan ile cümle hiçbir durumda çelişmiyor', () => {
    const gorulen = new Set<MaskotKurali>()
    let sayi = 0
    for (const g of butunDurumlar()) {
      const { maskot, cumle } = anaBaslik(g)
      gorulen.add(maskot.kural)
      sayi++
      expect(cumle, JSON.stringify(g)).toBeTypeOf('string')
      const { olmali, olmamali } = UYUM[maskot.kural]
      const iz = `${maskot.kural} → "${cumle}"`
      if (olmali) expect(cumle, iz).toMatch(olmali)
      if (olmamali) expect(cumle, iz).not.toMatch(olmamali)
    }
    // Kombinasyonlar her kuralı en az bir kez tutturmalı; yoksa test bir
    // kuralı hiç denetlemeden geçiyor olurdu.
    expect([...gorulen].sort()).toEqual(Object.keys(UYUM).sort())
    expect(sayi).toBeGreaterThan(10_000)
  })

  it('hedef sıfırsa cümle yok, tavşan yine poz veriyor', () => {
    const { maskot, cumle } = anaBaslik({ ...temel, hedef: 0, pomodoro: 'calisma' })
    expect(cumle).toBeNull()
    expect(maskot.poz).toBe('laptoplu')
  })

  it('örnek cümleler', () => {
    const c = (g: Partial<AnaMaskotGirdisi>) => anaBaslik({ ...temel, ...g }).cumle
    expect(c({ pomodoro: 'calisma', gunlukKayitlar: [gun(BUGUN, 20)] })).toBe(
      'Pomodoro turundasın; hedefine 30 soru kaldı.',
    )
    expect(c({ gorevlerBitti: true, gunlukKayitlar: [gun(BUGUN, 20)] })).toBe(
      'Bugünkü görevlerini bitirdin; hedefine 30 soru kaldı.',
    )
    expect(c({ bekleyenYanlis: 12 })).toBe('Yanlış bankanda 12 soru seni bekliyor; birkaçına göz at.')
    expect(c({ kalanGun: 20 })).toContain('Sınava 20 gün kaldı')
    expect(c({ gunlukKayitlar: [gun('2026-09-05', 20, 'Kimya')] })).toBe(
      'Bugün henüz kaydın yok; Kimya dersiyle başlamaya ne dersin?',
    )
    expect(c({ saat: 23 })).toBe('Bugün kayıt girmedin; çözdüysen ekle, sonra iyi uykular.')
  })
})
