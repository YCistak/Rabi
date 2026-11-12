import { describe, expect, it } from 'vitest'
import type { KoordinatGorseli } from '../konu/tip'
import {
  bosYon,
  cakismaSay,
  dikMi,
  dilimBul,
  eksenAdimi,
  eksenCentikleri,
  etiketleriAyir,
  etiketTuru,
  geometriSahnesi,
  grafikSahnesi,
  kesirParcalariSec,
  sayiDogrusuYazilari,
  sayiYaz,
  type YerlesenEtiket,
} from './sekil'

const derece = (d: number) => (d * Math.PI) / 180
/** Ekranda y aşağı: "yukarı" -90°. */
const aciFarki = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)))

describe('köşe harfini dışarı itme', () => {
  it('üçgen köşesinde iç açıortayın tersine bakar', () => {
    // Tepe köşesi: kollar sol-aşağı (120°) ve sağ-aşağı (60°); boş yön yukarı.
    const y = bosYon([derece(60), derece(120)])
    expect(aciFarki(y, derece(-90))).toBeLessThan(0.01)
  })

  it('kenar üstündeki noktada içeri inen çizginin karşı yüzüne gider', () => {
    // BC yatay (0° ve 180°), AD yukarı-sol iniyor (-120°): harf aşağıya.
    const y = bosYon([0, Math.PI, derece(-120)])
    expect(aciFarki(y, derece(90))).toBeLessThan(0.3)
  })

  it('doğru üstündeki iki eşit boşlukta tercih edilen tarafı seçer', () => {
    expect(aciFarki(bosYon([0, Math.PI], derece(90)), derece(90))).toBeLessThan(0.01)
    expect(aciFarki(bosYon([0, Math.PI], derece(-90)), derece(-90))).toBeLessThan(0.01)
  })

  it('geometri sahnesinde A harfi üçgenin dışında, tepenin üstünde', () => {
    const g: KoordinatGorseli = {
      tur: 'koordinat',
      pencere: [-1, 7, -1, 6],
      eksenler: false,
      egriler: [{ noktalar: [[0, 0], [6, 0], [3, 5]], kapali: true, kirik: true }],
      // Veri harfi özensizce köşenin tam üstüne koymuş.
      etiketler: [{ x: 3, y: 5, ad: 'A' }, { x: 0, y: 0, ad: 'B' }, { x: 6, y: 0, ad: 'C' }],
    }
    const s = geometriSahnesi(g)
    const a = s.etiketler.find((e) => e.duzen.metin === 'A')!
    const b = s.etiketler.find((e) => e.duzen.metin === 'B')!
    const c = s.etiketler.find((e) => e.duzen.metin === 'C')!
    expect(a.y).toBeLessThan(b.y - 20)
    expect(b.x).toBeLessThan(c.x)
    // B sol alt köşenin solunda/altında, C sağ alt köşenin sağında/altında.
    expect(b.y).toBeGreaterThan(a.y)
  })
})

describe('dik açı tespiti', () => {
  it('90° ± 1,5° dik sayılır, 93° sayılmaz', () => {
    expect(dikMi(derece(90))).toBe(true)
    expect(dikMi(derece(91.2))).toBe(true)
    expect(dikMi(derece(93))).toBe(false)
  })

  it('dikme ayağına kare, dikdörtgen köşesine kare yok', () => {
    const dikme: KoordinatGorseli = {
      tur: 'koordinat',
      pencere: [-1, 11, -1, 7],
      eksenler: false,
      egriler: [
        { noktalar: [[0, 0], [10, 0], [3, 6]], kapali: true, kirik: true },
        { noktalar: [[3, 6], [3, 0]], kesik: true, kirik: true },
      ],
    }
    expect(geometriSahnesi(dikme).dikAcilar).toBeTruthy()

    const dikdortgen: KoordinatGorseli = {
      tur: 'koordinat',
      pencere: [-1, 9, -1, 5],
      eksenler: false,
      egriler: [{ noktalar: [[0, 0], [8, 0], [8, 4], [0, 4]], kapali: true, kirik: true }],
    }
    expect(geometriSahnesi(dikdortgen).dikAcilar).toBeUndefined()
  })

  it('verinin çizdiği küçük L işareti yerine kare çizilir', () => {
    const g: KoordinatGorseli = {
      tur: 'koordinat',
      pencere: [-1, 6, -1, 5],
      eksenler: false,
      egriler: [
        { noktalar: [[0, 4], [0, 0], [5, 0], [0, 4]], kapali: true, kirik: true },
        { noktalar: [[0, 0.4], [0.4, 0.4], [0.4, 0]], kirik: true, renk: 'soluk' },
      ],
    }
    const s = geometriSahnesi(g)
    expect(s.dikAcilar).toBeTruthy()
    expect(s.yollar).toHaveLength(1)
  })

  it('açı yazısının düştüğü dilim bulunur (dış açı)', () => {
    // C köşesi: B'ye (180°), A'ya (-130°, yukarı-sol), D'ye (0°).
    const yonler = [Math.PI, derece(-130), 0]
    const dilim = dilimBul(yonler, derece(-40))!
    expect(dilim.aci).toBeCloseTo(derece(130), 3)
  })
})

describe('etiket çakışma çözümü', () => {
  it('üst üste binen iki yazıyı ayırır', () => {
    const e: YerlesenEtiket[] = [
      { x: 100, y: 100, gen: 40, yuk: 14, hx: 100, hy: 100, hareket: 1 },
      { x: 104, y: 102, gen: 40, yuk: 14, hx: 104, hy: 102, hareket: 1 },
    ]
    expect(cakismaSay(e)).toBe(1)
    etiketleriAyir(e, [])
    expect(cakismaSay(e)).toBe(0)
  })

  it('çizginin üstündeki yazıyı çizgiden çeker, sabit yazıya dokunmaz', () => {
    const cizgi = { a: { x: 0, y: 100 }, b: { x: 300, y: 100 } }
    const e: YerlesenEtiket[] = [
      { x: 150, y: 98, gen: 30, yuk: 14, hx: 150, hy: 98, hareket: 1 },
      { x: 20, y: 20, gen: 30, yuk: 14, hx: 20, hy: 20, hareket: 0 },
    ]
    etiketleriAyir(e, [cizgi])
    expect(cakismaSay(e, [cizgi])).toBe(0)
    expect(e[0].y).toBeLessThan(100)
    expect(e[1]).toMatchObject({ x: 20, y: 20 })
  })
})

describe('eksen çentikleri', () => {
  it('sık pencerede adım büyür, sıfır çentik almaz', () => {
    expect(eksenAdimi(10, 30, 16)).toBe(1)
    expect(eksenAdimi(380, 0.7, 16)).toBe(25)
    expect(eksenCentikleri(-3, 3, 1)).toEqual([-3, -2, -1, 1, 2, 3])
  })

  it('birim çemberde 0,5; π etiketli grafikte π/2 katları', () => {
    expect(eksenAdimi(3, 90, 16)).toBe(0.5)
    expect(eksenAdimi(7, 20, 16, true)).toBeCloseTo(Math.PI / 2)
  })

  it('negatif sayı uzun eksiyle, ondalık virgülle yazılır', () => {
    expect(sayiYaz(-3)).toBe('−3')
    expect(sayiYaz(0.5)).toBe('0,5')
  })

  it('veri eksene kendi sayısını yazmışsa otomatik sayı yazılmaz', () => {
    const g: KoordinatGorseli = {
      tur: 'koordinat',
      pencere: [-3, 2, -2, 8],
      egriler: [{ noktalar: [[-2.5, -1.5], [0.5, 7.5]], ad: 'f' }],
      noktalar: [{ x: -2, y: 0, ad: '−2' }, { x: 0, y: 6, ad: '6' }],
    }
    const s = grafikSahnesi(g)
    const yazilar = s.etiketler.map((e) => e.duzen.metin)
    expect(yazilar.filter((m) => m === '6')).toHaveLength(1)
    expect(yazilar).not.toContain('4')
    expect(s.izgara).toBeUndefined()
  })

  it('sayı doğrusunda aralık uçları hep yazılır, sığmayan ara sayı düşer', () => {
    const konum = (v: number) => v * 10
    expect(sayiDogrusuYazilari([0, 1, 2, 3], konum, [1])).toEqual([1, 3])
  })
})

describe('etiket türü ve kesir', () => {
  it('etiketin metninden türünü çıkarır', () => {
    expect(etiketTuru('A')).toBe('harf')
    expect(etiketTuru("B'")).toBe('harf')
    expect(etiketTuru('65°')).toBe('aci')
    expect(etiketTuru('α')).toBe('aci')
    expect(etiketTuru('8 cm')).toBe('uzunluk')
    expect(etiketTuru('2√3')).toBe('uzunluk')
    expect(etiketTuru('|BC| = 24')).toBe('uzunluk')
    expect(etiketTuru('14 cm²')).toBe('alan')
    expect(etiketTuru('||')).toBe('centik')
    expect(etiketTuru('Ortak Bölge')).toBe('serbest')
    expect(etiketTuru('2x + 10')).toBe('belirsiz')
    expect(etiketTuru('3k')).toBe('belirsiz')
    expect(etiketTuru('4√2 m')).toBe('uzunluk')
    expect(etiketTuru('log₂ 27 m')).toBe('uzunluk')
  })

  it('birim eğik çizgisini kesir saymaz', () => {
    expect(kesirParcalariSec('Birim Fiyat (TL/m')).toEqual([{ tur: 'metin', metin: 'Birim Fiyat (TL/m' }])
    expect(kesirParcalariSec('y = 1/2')).toEqual([{ tur: 'metin', metin: 'y = ' }, { tur: 'kesir', pay: '1', payda: '2' }])
  })
})
