import { describe, expect, it } from 'vitest'
import { balonGenisligi, balonKonumu, durgunlukSayaci, kutuFarki, type Kutu } from './tanitim-yerlesim'

const TELEFON = { sol: 0, ust: 0, genislik: 390, yukseklik: 844 }
const IPAD_YATAY = { sol: 0, ust: 0, genislik: 983, yukseklik: 683 }
const ustSinir = 12
const altSinir = 832

function icinde(yer: { sol: number; ust: number }, ekran: typeof TELEFON, genislik: number, yukseklik: number, alt = altSinir) {
  expect(yer.sol).toBeGreaterThanOrEqual(ekran.sol)
  expect(yer.sol + genislik).toBeLessThanOrEqual(ekran.sol + ekran.genislik)
  expect(yer.ust).toBeGreaterThanOrEqual(ustSinir)
  expect(yer.ust + yukseklik).toBeLessThanOrEqual(alt)
}
const ortusme = (a: Kutu, b: Kutu) => Math.max(0, Math.min(a.sol + a.genislik, b.sol + b.genislik) - Math.max(a.sol, b.sol)) * Math.max(0, Math.min(a.ust + a.yukseklik, b.ust + b.yukseklik) - Math.max(a.ust, b.ust))

describe('balon yerleşimi', () => {
  it('telefonda hedefin altına, yer yoksa üstüne konur', () => {
    const hedef = { sol: 11, ust: 100, genislik: 368, yukseklik: 200 }
    expect(balonKonumu(hedef, TELEFON, ustSinir, altSinir, 340, 255).ust).toBe(316)
    const altta = { sol: 11, ust: 600, genislik: 368, yukseklik: 200 }
    expect(balonKonumu(altta, TELEFON, ustSinir, altSinir, 340, 255).ust).toBe(600 - 255 - 16)
  })

  it('hiçbir yere sığmayan hedefte büyük boşluğa konur, ekrandan taşmaz', () => {
    // iPad yatayda Pomodoro'nun ayar kartı: 626 px yüksek, yanlarda yer yok.
    const alt = 683 - 12
    const hedef = { sol: 145, ust: 5, genislik: 780, yukseklik: 626 }
    const yer = balonKonumu(hedef, IPAD_YATAY, ustSinir, alt, 340, 244)
    icinde(yer, IPAD_YATAY, 340, 244, alt)
  })

  it('klavye açıkken odaktaki kutunun üstüne binmez', () => {
    // iPhone, Soru ekle formu, ders listesi açık: görünür alan 224–732, form bütün alanı kaplıyor,
    // odaktaki "Toplam" kutusu görünür alanın dibinde (664–716).
    const ekran = { sol: 0, ust: 224, genislik: 390, yukseklik: 508 }
    const hedef = { sol: 4, ust: 283, genislik: 382, yukseklik: 445 }
    const odak = { sol: 16, ust: 664, genislik: 80, yukseklik: 52 }
    const yer = balonKonumu(hedef, ekran, 283, 720, 340, 110, odak)
    expect(ortusme({ ...yer, genislik: 340, yukseklik: 110 }, odak)).toBe(0)
    expect(yer.ust).toBe(283)
    // Kutu üstteyse balon alta iner.
    const usttekiOdak = { ...odak, ust: 300 }
    const alttaki = balonKonumu(hedef, ekran, 283, 720, 340, 110, usttekiOdak)
    expect(ortusme({ ...alttaki, genislik: 340, yukseklik: 110 }, usttekiOdak)).toBe(0)
  })

  it('her durumda balon ekranın içinde kalır', () => {
    for (let ust = 0; ust < 844; ust += 37) for (const yukseklik of [40, 200, 500, 800]) {
      const hedef = { sol: 11, ust, genislik: 368, yukseklik: Math.min(yukseklik, 844 - ust) }
      const genislik = balonGenisligi(hedef, TELEFON, false)
      icinde(balonKonumu(hedef, TELEFON, ustSinir, altSinir, genislik, 255), TELEFON, genislik, 255)
    }
  })

  it('yer olduğunda balon hedefin üstüne binmez', () => {
    for (let ust = 20; ust < 560; ust += 23) {
      const hedef = { sol: 11, ust, genislik: 368, yukseklik: 120 }
      const yer = balonKonumu(hedef, TELEFON, ustSinir, altSinir, 340, 255)
      expect(ortusme({ ...yer, genislik: 340, yukseklik: 255 }, hedef)).toBe(0)
    }
  })

  it('yatay ekranda yanda yer varsa balon yana geçer; tablette dar şeride sıkışmaz', () => {
    const yatay = { sol: 0, ust: 0, genislik: 844, yukseklik: 390 }
    const hedef = { sol: 20, ust: 40, genislik: 400, yukseklik: 300 }
    const genislik = balonGenisligi(hedef, yatay, false)
    const yer = balonKonumu(hedef, yatay, ustSinir, 378, genislik, 200)
    expect(yer.sol).toBe(436)
    // Tablette 260 px yan boşluk balonu daraltmaya yetmiyor.
    const tabletHedef = { sol: 20, ust: 40, genislik: 703, yukseklik: 300 }
    expect(balonGenisligi(tabletHedef, IPAD_YATAY, true)).toBe(340)
  })
})

describe('durgunluk sayacı', () => {
  it('hedef art arda kıpırdamadan durunca yerleşmiş sayılır', () => {
    const sayac = durgunlukSayaci(2)
    const kutu = { sol: 0, ust: 100, genislik: 10, yukseklik: 10 }
    expect(sayac.bildir(kutu)).toBe(false)
    expect(sayac.bildir({ ...kutu, ust: 104 })).toBe(false)
    expect(sayac.bildir({ ...kutu, ust: 104.2 })).toBe(false)
    expect(sayac.bildir({ ...kutu, ust: 104.3 })).toBe(true)
    sayac.sifirla()
    expect(sayac.bildir(kutu)).toBe(false)
  })

  it('kutu farkı', () => {
    expect(kutuFarki(null, null)).toBe(0)
    expect(kutuFarki(null, { sol: 0, ust: 0, genislik: 1, yukseklik: 1 })).toBe(Number.POSITIVE_INFINITY)
    expect(kutuFarki({ sol: 0, ust: 0, genislik: 1, yukseklik: 1 }, { sol: 3, ust: -2, genislik: 1, yukseklik: 1 })).toBe(3)
  })
})

describe('sığmayan hedefte en az örtüşme', () => {
  it('iPad yatayda Pomodoro kartında balon köşeye kaçar, örtüşme ortadakinden az', () => {
    const alt = 683 - 12
    const hedef = { sol: 121, ust: 4, genislik: 650, yukseklik: 522 }
    const yer = balonKonumu(hedef, IPAD_YATAY, ustSinir, alt, 340, 203)
    const ortada = { sol: (983 - 340) / 2, ust: alt - 203, genislik: 340, yukseklik: 203 }
    expect(ortusme({ ...yer, genislik: 340, yukseklik: 203 }, hedef)).toBeLessThan(ortusme(ortada, hedef) / 2)
    icinde(yer, IPAD_YATAY, 340, 203, alt)
  })
})
