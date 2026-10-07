import { describe, expect, it } from 'vitest'
import {
  GOREV_BILDIRIM_ILK_ID,
  GOREV_ONCE_DAKIKA,
  gorevBildirimKimligi,
  gorevBildirimiMi,
  gorevBildirimMetni,
  gorevBildirimPlanlari,
  gorevBildirimZamani,
} from './gorev-bildirimi'
import type { Gorev } from './yapilacaklar'

/** Yerel saatle tarih kurar — bildirim yerel saate göre hesaplanıyor. */
function an(ay: number, gun: number, saat: number, dakika = 0, saniye = 0): Date {
  return new Date(2026, ay - 1, gun, saat, dakika, saniye, 0)
}

function gorev(ozel: Partial<Gorev> = {}): Gorev {
  return {
    id: 'g1',
    metin: 'Kimya tekrarı',
    gun: '2026-10-07',
    saat: '14:30',
    kategori: 'tekrar',
    renk: 'turuncu',
    sure: null,
    bitti: false,
    yildiz: false,
    ...ozel,
  }
}

describe('gorevBildirimZamani', () => {
  it('saatten beş dakika önce', () => {
    expect(gorevBildirimZamani(gorev())).toEqual(an(10, 7, 14, 25))
    expect(GOREV_ONCE_DAKIKA).toBe(5)
  })

  it('saatsiz ve bitmiş görevde yok', () => {
    expect(gorevBildirimZamani(gorev({ saat: null }))).toBeNull()
    expect(gorevBildirimZamani(gorev({ bitti: true }))).toBeNull()
  })

  it('bozuk gün ya da saatte yok', () => {
    expect(gorevBildirimZamani(gorev({ gun: 'dün' }))).toBeNull()
    expect(gorevBildirimZamani(gorev({ saat: '9:5' }))).toBeNull()
  })

  it('00:00–00:04 önceki güne düşüyor', () => {
    expect(gorevBildirimZamani(gorev({ saat: '00:00' }))).toEqual(an(10, 6, 23, 55))
    expect(gorevBildirimZamani(gorev({ saat: '00:04' }))).toEqual(an(10, 6, 23, 59))
    expect(gorevBildirimZamani(gorev({ saat: '00:05' }))).toEqual(an(10, 7, 0, 0))
  })

  it('ayın ve yılın ilk gününde önceki aya/yıla sarıyor', () => {
    expect(gorevBildirimZamani(gorev({ gun: '2026-11-01', saat: '00:02' }))).toEqual(
      an(10, 31, 23, 57),
    )
    expect(gorevBildirimZamani(gorev({ gun: '2027-01-01', saat: '00:00' }))).toEqual(
      new Date(2026, 11, 31, 23, 55),
    )
  })
})

describe('gorevBildirimKimligi', () => {
  it('kararlı ve aralıkta', () => {
    const id = gorevBildirimKimligi('mf3k2a-x9y8z7')
    expect(gorevBildirimKimligi('mf3k2a-x9y8z7')).toBe(id)
    expect(gorevBildirimiMi(id)).toBe(true)
    expect(Number.isInteger(id)).toBe(true)
    expect(id).toBeLessThan(2 ** 31)
  })

  it('farklı görevler farklı kimlik alıyor', () => {
    const idler = new Set(Array.from({ length: 500 }, (_, i) => gorevBildirimKimligi(`gorev-${i}`)))
    expect(idler.size).toBe(500)
  })

  it('Pomodoro, günlük hatırlatma ve odak servisi kimlikleri görev sayılmıyor', () => {
    for (const id of [1, 2, 8, 4211]) expect(gorevBildirimiMi(id)).toBe(false)
    expect(gorevBildirimiMi(GOREV_BILDIRIM_ILK_ID)).toBe(true)
  })
})

describe('gorevBildirimMetni', () => {
  it('başlıkta görev adı, emoji yok', () => {
    const { baslik, metin } = gorevBildirimMetni(gorev())
    expect(baslik).toBe('5 dakika sonra: Kimya tekrarı')
    expect(`${baslik}${metin}`).not.toMatch(/\p{Extended_Pictographic}/u)
  })

  it('Pomodoro’lu görevde sayaçtan söz ediyor', () => {
    expect(gorevBildirimMetni(gorev({ pomodoro: true })).metin).toMatch(/sayac/)
    expect(gorevBildirimMetni(gorev()).metin).not.toMatch(/sayac/)
  })

  it('24 karakterlik adla başlık kilit ekranına sığıyor', () => {
    expect(gorevBildirimMetni(gorev({ metin: 'x'.repeat(24) })).baslik.length).toBeLessThanOrEqual(40)
  })
})

describe('gorevBildirimPlanlari', () => {
  const simdi = an(10, 7, 12, 0)

  it('saatli ve bitmemiş görevi planlıyor', () => {
    const [plan, ...fazla] = gorevBildirimPlanlari([gorev({ pomodoro: true })], simdi)
    expect(fazla).toHaveLength(0)
    expect(plan).toMatchObject({
      id: gorevBildirimKimligi('g1'),
      gorevId: 'g1',
      zaman: an(10, 7, 14, 25),
      pomodoro: true,
    })
  })

  it('saatsiz, bitmiş ve geçmiş görevleri atlıyor', () => {
    const planlar = gorevBildirimPlanlari(
      [
        gorev({ id: 'a', saat: null }),
        gorev({ id: 'b', bitti: true }),
        gorev({ id: 'c', saat: '11:00' }),
        gorev({ id: 'd', gun: '2026-10-06' }),
        gorev({ id: 'e', gun: '2026-10-08', saat: '08:00' }),
      ],
      simdi,
    )
    expect(planlar.map((p) => p.gorevId)).toEqual(['e'])
  })

  it('saatine beş dakikadan az kalan görev planlanmıyor', () => {
    const simdi2 = an(10, 7, 14, 27)
    expect(gorevBildirimPlanlari([gorev()], simdi2)).toEqual([])
    // Bildirim anının tam kendisi de geçmiş sayılıyor.
    expect(gorevBildirimPlanlari([gorev()], an(10, 7, 14, 25))).toEqual([])
    expect(gorevBildirimPlanlari([gorev()], an(10, 7, 14, 24, 58))).toHaveLength(1)
  })

  it('gece yarısı görevi: 23:50’de 00:03 görevi 23:58’e kuruluyor, 23:59’da kurulmuyor', () => {
    const yarin = gorev({ gun: '2026-10-08', saat: '00:03' })
    expect(gorevBildirimPlanlari([yarin], an(10, 7, 23, 50))[0].zaman).toEqual(an(10, 7, 23, 58))
    expect(gorevBildirimPlanlari([yarin], an(10, 7, 23, 59))).toEqual([])
  })

  it('zamana göre sıralı ve sınırla kırpılıyor', () => {
    const gorevler = ['18:00', '09:00', '13:00'].map((saat, i) => gorev({ id: `g${i}`, saat }))
    const planlar = gorevBildirimPlanlari(gorevler, an(10, 7, 6, 0), 2)
    expect(planlar.map((p) => p.zaman)).toEqual([an(10, 7, 8, 55), an(10, 7, 12, 55)])
  })

  it('kimlikler benzersiz', () => {
    const gorevler = Array.from({ length: 40 }, (_, i) =>
      gorev({ id: `g${i}`, saat: `${String(13 + (i % 10)).padStart(2, '0')}:00` }),
    )
    const idler = gorevBildirimPlanlari(gorevler, simdi).map((p) => p.id)
    expect(new Set(idler).size).toBe(idler.length)
  })
})
