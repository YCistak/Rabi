import { describe, expect, it } from 'vitest'
import { desteAkisi, MOLA_METINLERI, molaMetni, molaSecimi } from './deste-akisi'
import type { HizliKontrol } from './tip'

const kontrol: HizliKontrol = {
  soru: 'Deney neyi sınar?',
  siklar: ['Kurulan hipotezi', 'Ölçüm biriminin adını'],
  dogru: 0,
  aciklama: { dogru: 'Evet.', yanlis: 'Hayır.' },
  kart: 2,
}

/** 0–1 arası sabit bir dizi döndüren sözde rastgele. */
function sabit(...degerler: number[]): () => number {
  let i = 0
  return () => degerler[i++ % degerler.length]
}

/** Ara ekranın kaçıncı karttan sonra geldiği (1'den); yoksa `undefined`. */
function yeri(adimlar: ReturnType<typeof desteAkisi>, tur: 'mola' | 'kontrol') {
  const i = adimlar.findIndex((a) => a.tur === tur)
  if (i < 0) return undefined
  return adimlar.slice(0, i).filter((a) => a.tur === 'kart').length
}

describe('desteAkisi', () => {
  it('kartların sırası ve sayısı değişmiyor', () => {
    for (let n = 1; n <= 10; n++) {
      const kartlar = desteAkisi(n, [kontrol]).filter((a) => a.tur === 'kart')
      expect(kartlar.map((a) => (a.tur === 'kart' ? a.sira : -1))).toEqual(
        Array.from({ length: n }, (_, i) => i),
      )
    }
  })

  it('ara ekranlar ilk iki ve son iki kartın arasına girmiyor', () => {
    for (let n = 1; n <= 10; n++) {
      for (let deneme = 0; deneme < 40; deneme++) {
        const adimlar = desteAkisi(n, [kontrol])
        for (const tur of ['mola', 'kontrol'] as const) {
          const k = yeri(adimlar, tur)
          if (k === undefined) continue
          expect(k, `${n} kartta ${tur} ${k}. karttan sonra`).toBeGreaterThanOrEqual(2)
          expect(k, `${n} kartta ${tur} ${k}. karttan sonra`).toBeLessThanOrEqual(n - 2)
        }
      }
    }
  })

  it('üç ve daha az kartlık destede ara ekran yok', () => {
    for (let n = 0; n <= 3; n++) {
      const adimlar = desteAkisi(n, [kontrol])
      expect(adimlar.every((a) => a.tur === 'kart')).toBe(true)
    }
  })

  it('dört kartlık destede tek yer var; kontrol oraya oturunca mola yok', () => {
    const adimlar = desteAkisi(4, [kontrol])
    expect(yeri(adimlar, 'kontrol')).toBe(2)
    expect(yeri(adimlar, 'mola')).toBeUndefined()
  })

  it('kontrol yoksa mola tek başına geliyor', () => {
    const adimlar = desteAkisi(4, [])
    expect(yeri(adimlar, 'mola')).toBe(2)
    expect(adimlar.some((a) => a.tur === 'kontrol')).toBe(false)
  })

  it('kontrol dayandığı kart okunmadan gelmiyor', () => {
    const gec = { ...kontrol, kart: 5 }
    for (let deneme = 0; deneme < 40; deneme++) {
      const k = yeri(desteAkisi(8, [gec]), 'kontrol')
      expect(k).toBeDefined()
      expect(k!).toBeGreaterThanOrEqual(5)
    }
  })

  it('dayandığı kart uygun yerlerin dışındaysa kontrol hiç gelmiyor', () => {
    // 8 kartta uygun yerler 2…6; 7. karta dayanan kontrolün yeri yok.
    const adimlar = desteAkisi(8, [{ ...kontrol, kart: 7 }])
    expect(adimlar.some((a) => a.tur === 'kontrol')).toBe(false)
    expect(adimlar.some((a) => a.tur === 'mola')).toBe(true)
  })

  it('mola ile kontrol aynı yere düşmüyor', () => {
    for (let deneme = 0; deneme < 60; deneme++) {
      const adimlar = desteAkisi(6, [kontrol])
      expect(yeri(adimlar, 'mola')).not.toBe(yeri(adimlar, 'kontrol'))
    }
  })

  it('rastgelelik dışarıdan geliyor: aynı sayı aynı yerleşim', () => {
    const a = desteAkisi(8, [kontrol], sabit(0.3, 0.9))
    const b = desteAkisi(8, [kontrol], sabit(0.3, 0.9))
    expect(a).toEqual(b)
  })

  it('kontrolden hemen sonra mola gelirse önce kontrol sorulur', () => {
    // İki ekran aynı yere giremiyor; art arda gelen ekranlarda kontrol önce.
    const adimlar = desteAkisi(8, [kontrol], sabit(0, 0))
    const kontrolIdx = adimlar.findIndex((a) => a.tur === 'kontrol')
    const molaIdx = adimlar.findIndex((a) => a.tur === 'mola')
    expect(kontrolIdx).toBeGreaterThan(0)
    expect(molaIdx).toBeGreaterThan(kontrolIdx)
  })
})

describe('iki kontrol', () => {
  const ikinci = { ...kontrol, kart: 6 }

  it('ikisi de yerleşiyor, sırası dayandıkları kartın sırası', () => {
    for (let deneme = 0; deneme < 60; deneme++) {
      const adimlar = desteAkisi(12, [ikinci, kontrol])
      const yerler = adimlar
        .map((a, i) => (a.tur === 'kontrol' ? { sira: a.sira, i } : null))
        .filter((x): x is { sira: number; i: number } => x !== null)
      expect(yerler.length).toBe(2)
      // kontrol (kart 2) dizinde 1, ikinci (kart 6) dizinde 0 — 1 önce gelmeli
      expect(yerler[0].sira).toBe(1)
      expect(yerler[1].sira).toBe(0)
      expect(yeri(adimlar, 'kontrol')!).toBeGreaterThanOrEqual(2)
    }
  })

  it('aynı yere iki kontrol düşmüyor', () => {
    for (let deneme = 0; deneme < 60; deneme++) {
      const adimlar = desteAkisi(12, [kontrol, ikinci])
      const kartSayilari = adimlar.map((a, i) =>
        a.tur === 'kontrol' ? adimlar.slice(0, i).filter((b) => b.tur === 'kart').length : -1,
      ).filter((k) => k >= 0)
      expect(new Set(kartSayilari).size).toBe(kartSayilari.length)
    }
  })

  it('yer kalmazsa ikinci kontrol düşüyor, ilki kalıyor', () => {
    // 5 kartta uygun yerler 2 ve 3; kart 3'e dayanan iki kontrol tek yere sığar.
    const adimlar = desteAkisi(5, [{ ...kontrol, kart: 3 }, { ...ikinci, kart: 3 }])
    expect(adimlar.filter((a) => a.tur === 'kontrol').length).toBe(1)
  })
})

describe('mola metni', () => {
  it('beş varyasyon var ve seçim hepsine ulaşıyor', () => {
    expect(MOLA_METINLERI.length).toBe(5)
    const secimler = new Set<number>()
    for (let i = 0; i < 5; i++) secimler.add(molaSecimi(() => i / 5))
    expect(secimler.size).toBe(5)
  })

  it('her varyasyon başlık ve metin veriyor, sayıyı yazıyor', () => {
    for (let s = 0; s < MOLA_METINLERI.length; s++) {
      const m = molaMetni(s, 3, 4)
      expect(m.baslik.trim().length).toBeGreaterThan(0)
      expect(m.metin).toContain('3')
    }
  })

  it('seçim sınırın üstündeyse başa sarıyor', () => {
    expect(molaMetni(5, 3, 4)).toEqual(molaMetni(0, 3, 4))
  })
})
