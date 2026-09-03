import { describe, expect, it } from 'vitest'
import { grilestir, olcek, uyarlamaliEsik, rgbaYaz, type Gri } from './goruntu-esikle'

/** Düz renkli RGBA görüntü. */
function duz(en: number, boy: number, ton: number): Uint8ClampedArray {
  const veri = new Uint8ClampedArray(en * boy * 4)
  for (let i = 0; i < en * boy; i++) {
    veri[i * 4] = ton
    veri[i * 4 + 1] = ton
    veri[i * 4 + 2] = ton
    veri[i * 4 + 3] = 255
  }
  return veri
}

/** Gri görüntüyü satır satır okunur hâle getirir ('#' siyah, '.' beyaz). */
function ciz(gri: Gri): string[] {
  const satirlar: string[] = []
  for (let y = 0; y < gri.boy; y++) {
    let satir = ''
    for (let x = 0; x < gri.en; x++) satir += gri.veri[y * gri.en + x] < 128 ? '#' : '.'
    satirlar.push(satir)
  }
  return satirlar
}

describe('grileştirme', () => {
  it('gri tonu olduğu gibi bırakıyor', () => {
    const gri = grilestir(duz(2, 2, 100), 2, 2)
    expect([...gri.veri]).toEqual([100, 100, 100, 100])
  })

  it('mavi kanalı yeşilden hafif sayıyor', () => {
    // Saf mavi ile saf yeşil aynı parlaklıkta olsaydı mavi tükenmez yazı
    // zeminden ayırt edilemezdi.
    const mavi = new Uint8ClampedArray([0, 0, 255, 255])
    const yesil = new Uint8ClampedArray([0, 255, 0, 255])
    expect(grilestir(mavi, 1, 1).veri[0]).toBeLessThan(grilestir(yesil, 1, 1).veri[0])
  })
})

describe('uyarlamalı eşik', () => {
  it('düz zeminde yazı üretmiyor', () => {
    // Gürültüsüz düz bir yüzeyde her piksel kendi ortalamasına eşit; eşik
    // payı olmasaydı burası tümüyle siyaha dönerdi.
    const gri = uyarlamaliEsik(grilestir(duz(40, 40, 200), 40, 40))
    expect(gri.veri.every((t) => t === 255)).toBe(true)
  })

  it('soluk yazıyı da yakalıyor', () => {
    // Zemin 200, yazı 170: göz zor seçiyor, sabit eşik (128) hiç göremezdi.
    const en = 40
    const boy = 40
    const rgba = duz(en, boy, 200)
    for (let y = 18; y < 22; y++) {
      for (let x = 10; x < 30; x++) {
        const k = (y * en + x) * 4
        rgba[k] = 170
        rgba[k + 1] = 170
        rgba[k + 2] = 170
      }
    }

    const cikti = ciz(uyarlamaliEsik(grilestir(rgba, en, boy)))
    expect(cikti[20][20]).toBe('#')
    expect(cikti[5][5]).toBe('.')
  })

  it('gölgeli sayfayı yazı sanmıyor', () => {
    // Soldan sağa 120'den 230'a giden bir aydınlanma; hiç yazı yok. Gerçek
    // gölgeler böyle geçişli. Sabit eşik sol yarının tamamını siyaha boyardı.
    const en = 60
    const boy = 30
    const rgba = new Uint8ClampedArray(en * boy * 4)
    for (let y = 0; y < boy; y++) {
      for (let x = 0; x < en; x++) {
        const ton = 120 + Math.round((110 * x) / (en - 1))
        const k = (y * en + x) * 4
        rgba[k] = ton
        rgba[k + 1] = ton
        rgba[k + 2] = ton
        rgba[k + 3] = 255
      }
    }

    const gri = uyarlamaliEsik(grilestir(rgba, en, boy))
    expect([...gri.veri].filter((t) => t === 0).length).toBe(0)
  })

  it('gölgedeki soluk yazıyı da yakalıyor', () => {
    // Aynı yazı, bu kez karanlık yarıda: zemin 120, yazı 95. Sabit eşik bunu
    // ya tümüyle siyah ya tümüyle beyaz yapardı.
    const en = 60
    const boy = 30
    const rgba = new Uint8ClampedArray(en * boy * 4)
    for (let y = 0; y < boy; y++) {
      for (let x = 0; x < en; x++) {
        const golgede = x < en / 2
        const yazidaMi = golgede && y >= 13 && y < 17 && x >= 8 && x < 22
        const ton = yazidaMi ? 95 : golgede ? 120 : 230
        const k = (y * en + x) * 4
        rgba[k] = ton
        rgba[k + 1] = ton
        rgba[k + 2] = ton
        rgba[k + 3] = 255
      }
    }

    const cikti = ciz(uyarlamaliEsik(grilestir(rgba, en, boy)))
    expect(cikti[15][15]).toBe('#')
    expect(cikti[3][15]).toBe('.')
  })

  it('çıktıda 0 ile 255 dışında ton yok', () => {
    const gri = uyarlamaliEsik(grilestir(duz(20, 20, 180), 20, 20))
    expect([...new Set(gri.veri)].every((t) => t === 0 || t === 255)).toBe(true)
  })
})

describe('rgba geri yazma', () => {
  it('gri kanalı üç kanala kopyalayıp saydamlığı kapatıyor', () => {
    const gri: Gri = { veri: new Uint8ClampedArray([0, 255]), en: 2, boy: 1 }
    const hedef = new Uint8ClampedArray(8)
    rgbaYaz(gri, hedef)
    expect([...hedef]).toEqual([0, 0, 0, 255, 255, 255, 255, 255])
  })
})

describe('ölçek', () => {
  it('büyük fotoğrafı küçültüyor', () => {
    expect(olcek(4000, 3000)).toBeCloseTo(0.5)
  })

  it('küçük fotoğrafı büyütmüyor', () => {
    // Büyütmek bilgi katmıyor, yalnızca işi ağırlaştırırdı.
    expect(olcek(800, 600)).toBe(1)
  })
})
