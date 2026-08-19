import { describe, expect, it } from 'vitest'
import { SIK_SAYISI, enYakinlar, ilBul, siklariKur, soruKur } from './harita'
import { BULUNABILIR_ALAN, HARITA_GENISLIK, HARITA_YUKSEKLIK, ILLER } from './harita-havuzu'

/** Sabit üreteç: testler rastgeleliğe bağlı kalmasın. */
function uretec(tohum: number): () => number {
  let x = tohum
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648
    return x / 2147483648
  }
}

describe('havuz', () => {
  it('81 il var ve adları benzersiz', () => {
    expect(ILLER).toHaveLength(81)
    expect(new Set(ILLER.map((i) => i.ad)).size).toBe(81)
  })

  it('plaka kodları benzersiz ve iki haneli', () => {
    expect(new Set(ILLER.map((i) => i.plaka)).size).toBe(81)
    for (const il of ILLER) expect(il.plaka).toMatch(/^\d{2}$/)
  })

  it('bilinen iller doğru yerde', () => {
    // Kutu 1000 birim geniş, batıdan doğuya. İzmir batıda, Van doğuda.
    const izmir = ilBul('İzmir')!
    const van = ilBul('Van')!
    expect(izmir.merkez[0]).toBeLessThan(200)
    expect(van.merkez[0]).toBeGreaterThan(800)
  })

  it('her ilin yolu kutunun içinde kalıyor', () => {
    for (const il of ILLER) {
      const sayilar = il.yol.match(/-?\d+(\.\d+)?/g)!.map(Number)
      for (let i = 0; i < sayilar.length; i += 2) {
        expect(sayilar[i]).toBeGreaterThanOrEqual(-1)
        expect(sayilar[i]).toBeLessThanOrEqual(HARITA_GENISLIK + 1)
        expect(sayilar[i + 1]).toBeGreaterThanOrEqual(-1)
        expect(sayilar[i + 1]).toBeLessThanOrEqual(HARITA_YUKSEKLIK + 1)
      }
    }
  })

  it('her zorlukta yeterince il var', () => {
    for (const z of ['kolay', 'orta', 'zor'] as const) {
      expect(ILLER.filter((i) => i.zorluk === z).length).toBeGreaterThanOrEqual(20)
    }
  })
})

describe('enYakinlar', () => {
  it('komşuları veriyor, uzakları değil', () => {
    const yakin = enYakinlar(ilBul('Kırşehir')!, 3).map((i) => i.ad)
    expect(yakin).not.toContain('Edirne')
    expect(yakin.some((a) => ['Nevşehir', 'Kırıkkale', 'Yozgat', 'Aksaray'].includes(a))).toBe(true)
  })

  it('ilin kendisini vermiyor', () => {
    for (const il of ILLER.slice(0, 10)) {
      expect(enYakinlar(il, 5).map((i) => i.ad)).not.toContain(il.ad)
    }
  })
})

describe('siklariKur', () => {
  it('dört şık veriyor ve doğrusu içinde', () => {
    const il = ilBul('Ankara')!
    const siklar = siklariKur(il, uretec(7))
    expect(siklar).toHaveLength(SIK_SAYISI)
    expect(siklar).toContain('Ankara')
    expect(new Set(siklar).size).toBe(SIK_SAYISI)
  })

  it('doğru şık hep aynı yerde değil', () => {
    const il = ilBul('Ankara')!
    const rastgele = uretec(3)
    const yerler = new Set(
      Array.from({ length: 40 }, () => siklariKur(il, rastgele).indexOf('Ankara')),
    )
    expect(yerler.size).toBeGreaterThan(1)
  })
})

describe('soruKur', () => {
  it('küçük iller asla “bul” olarak sorulmuyor', () => {
    const kucukler = ILLER.filter((i) => i.alan < BULUNABILIR_ALAN)
    expect(kucukler.length).toBeGreaterThan(0)
    const rastgele = uretec(11)
    for (const il of kucukler) {
      for (let i = 0; i < 20; i++) expect(soruKur(il, rastgele).tip).toBe('sec')
    }
  })

  it('büyük illerde iki tip de çıkıyor', () => {
    const konya = ilBul('Konya')!
    const rastgele = uretec(5)
    const tipler = new Set(Array.from({ length: 40 }, () => soruKur(konya, rastgele).tip))
    expect(tipler).toEqual(new Set(['bul', 'sec']))
  })

  it('“bul” sorusunda şık yok, “sec” sorusunda dört tane var', () => {
    const rastgele = uretec(9)
    for (let i = 0; i < 60; i++) {
      const soru = soruKur(ILLER[i % ILLER.length], rastgele)
      expect(soru.siklar).toHaveLength(soru.tip === 'bul' ? 0 : SIK_SAYISI)
    }
  })
})
