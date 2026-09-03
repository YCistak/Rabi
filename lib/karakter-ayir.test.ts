import { describe, expect, it } from 'vitest'
import { bilesenleriBul, gurultuyuEle, kareyeOturt, satirlaraAyir, KARE } from './karakter-ayir'
import type { Gri } from './goruntu-esikle'

/** Beyaz zemin; `lekeler` içindeki dikdörtgenler siyah. */
function sayfa(en: number, boy: number, lekeler: { x: number; y: number; en: number; boy: number }[]): Gri {
  const veri = new Uint8ClampedArray(en * boy).fill(255)
  for (const l of lekeler) {
    for (let y = l.y; y < l.y + l.boy; y++) {
      for (let x = l.x; x < l.x + l.en; x++) veri[y * en + x] = 0
    }
  }
  return { veri, en, boy }
}

describe('bileşen bulma', () => {
  it('ayrı lekeleri ayrı sayıyor', () => {
    const gri = sayfa(60, 40, [
      { x: 5, y: 5, en: 8, boy: 12 },
      { x: 30, y: 5, en: 8, boy: 12 },
    ])
    expect(bilesenleriBul(gri)).toHaveLength(2)
  })

  it('çaprazdan değen lekeyi tek sayıyor', () => {
    // Sekiz komşuluk: ince kalemle yazılmış "7"nin çapraz bacağı böyle
    // bağlanıyor; dört komşulukta iki parçaya bölünürdü.
    const gri = sayfa(20, 20, [
      { x: 4, y: 4, en: 3, boy: 3 },
      { x: 7, y: 7, en: 3, boy: 3 },
    ])
    expect(bilesenleriBul(gri)).toHaveLength(1)
  })

  it('kutuyu lekeye tam oturtuyor', () => {
    const [kutu] = bilesenleriBul(sayfa(30, 30, [{ x: 6, y: 9, en: 5, boy: 7 }]))
    expect(kutu).toMatchObject({ x: 6, y: 9, en: 5, boy: 7, piksel: 35 })
  })
})

describe('gürültü eleme', () => {
  it('tozu atıp harfleri bırakıyor', () => {
    const lekeler = [
      { x: 5, y: 5, en: 10, boy: 20 },
      { x: 25, y: 5, en: 10, boy: 20 },
      { x: 45, y: 8, en: 2, boy: 2 },
    ]
    const gri = sayfa(80, 40, lekeler)
    expect(gurultuyuEle(bilesenleriBul(gri), gri)).toHaveLength(2)
  })

  it('toz sayıca baskınken bile harfleri koruyor', () => {
    // Ölçülmüş çuvallama: ahşap masanın damarları yüzlerce ufak leke üretince
    // düz ortanca toz boyuna oturuyor ve gerçek harfler "çok büyük" diye
    // eleniyordu. Mürekkebe göre tartılan ortanca bunu yapmıyor.
    const lekeler = [{ x: 2, y: 2, en: 20, boy: 30 }]
    for (let i = 0; i < 40; i++) lekeler.push({ x: 30 + (i % 20) * 5, y: 4 + Math.floor(i / 20) * 7, en: 3, boy: 3 })

    const gri = sayfa(140, 120, lekeler)
    const kalan = gurultuyuEle(bilesenleriBul(gri), gri)
    expect(kalan).toHaveLength(1)
    expect(kalan[0].boy).toBe(30)
  })

  it('sayfa kadar büyük lekeyi atıyor', () => {
    const gri = sayfa(60, 60, [{ x: 0, y: 0, en: 50, boy: 50 }])
    expect(gurultuyuEle(bilesenleriBul(gri), gri)).toHaveLength(0)
  })
})

describe('satırlara ayırma', () => {
  it('alt alta iki satırı ayırıyor', () => {
    const gri = sayfa(80, 80, [
      { x: 5, y: 5, en: 8, boy: 14 },
      { x: 20, y: 6, en: 8, boy: 14 },
      { x: 5, y: 45, en: 8, boy: 14 },
    ])
    const satirlar = satirlaraAyir(gurultuyuEle(bilesenleriBul(gri), gri))
    expect(satirlar.map((s) => s.length)).toEqual([2, 1])
  })

  it('satır içinde soldan sağa diziyor', () => {
    const gri = sayfa(80, 40, [
      { x: 40, y: 5, en: 8, boy: 14 },
      { x: 5, y: 5, en: 8, boy: 14 },
    ])
    const [satir] = satirlaraAyir(gurultuyuEle(bilesenleriBul(gri), gri))
    expect(satir.map((k) => k.x)).toEqual([5, 40])
  })

  it('aynı satırdaki kayık harfi ayrı satır saymıyor', () => {
    // "12D" içinde rakamlar birkaç piksel oynak duruyor; dikey örtüşmeye
    // bakmak bunu tolere ediyor, y merkezine bakmak ayırırdı.
    const gri = sayfa(80, 40, [
      { x: 5, y: 5, en: 8, boy: 20 },
      { x: 20, y: 9, en: 8, boy: 20 },
    ])
    expect(satirlaraAyir(gurultuyuEle(bilesenleriBul(gri), gri))).toHaveLength(1)
  })
})

describe('kareye oturtma', () => {
  it('28×28 veriyor', () => {
    const gri = sayfa(40, 40, [{ x: 5, y: 5, en: 10, boy: 20 }])
    const [kutu] = bilesenleriBul(gri)
    expect(kareyeOturt(gri, kutu)).toHaveLength(KARE * KARE)
  })

  it('en-boy oranını koruyor', () => {
    // Dar bir "1" kareye yayılsaydı "0" gibi görünürdü.
    const gri = sayfa(40, 40, [{ x: 5, y: 5, en: 4, boy: 20 }])
    const [kutu] = bilesenleriBul(gri)
    const kare = kareyeOturt(gri, kutu)

    const doluSutun = new Set<number>()
    for (let i = 0; i < kare.length; i++) if (kare[i] > 0.5) doluSutun.add(i % KARE)
    expect(doluSutun.size).toBeLessThan(KARE / 2)
  })

  it('kütle merkezini kareye ortalıyor', () => {
    const gri = sayfa(60, 60, [{ x: 2, y: 2, en: 12, boy: 12 }])
    const [kutu] = bilesenleriBul(gri)
    const kare = kareyeOturt(gri, kutu)

    let toplam = 0
    let mx = 0
    let my = 0
    for (let y = 0; y < KARE; y++) {
      for (let x = 0; x < KARE; x++) {
        const d = kare[y * KARE + x]
        toplam += d
        mx += d * x
        my += d * y
      }
    }
    expect(mx / toplam).toBeCloseTo((KARE - 1) / 2, 0)
    expect(my / toplam).toBeCloseTo((KARE - 1) / 2, 0)
  })

  it('mürekkebi 1, zemini 0 yapıyor', () => {
    const gri = sayfa(40, 40, [{ x: 10, y: 10, en: 10, boy: 10 }])
    const [kutu] = bilesenleriBul(gri)
    const kare = kareyeOturt(gri, kutu)
    expect(Math.max(...kare)).toBeCloseTo(1)
    expect(kare[0]).toBe(0)
  })
})
