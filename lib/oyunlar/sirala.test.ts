import { describe, expect, it } from 'vitest'
import {
  BOSS_KART_SAYISI,
  KART_SAYISI,
  TAM_BONUS,
  dogruKomsuSayisi,
  dogruSira,
  siraDogruMu,
  siralaTuruHazirla,
  soruKimligi,
  soruKur,
  soruPuani,
  yilMetni,
} from './sirala'
import { SIRALA_HAVUZU, type SiraliOlay } from './sirala-havuzu'

/** Test için kısa olay üreteci — havuzun kendisine bağlı kalmamak için. */
function olay(ad: string, yil: number): SiraliOlay {
  return { olay: ad, yil, donem: 'kurtulus', zorluk: 'kolay' }
}

const A = olay('A', 1900)
const B = olay('B', 1910)
const C = olay('C', 1920)

describe('siraDogruMu', () => {
  it('eskiden yeniye dizilmiş listeyi doğru sayıyor', () => {
    expect(siraDogruMu([A, B, C])).toBe(true)
    expect(siraDogruMu([C, B, A])).toBe(false)
    expect(siraDogruMu([A, C, B])).toBe(false)
  })

  it('tek kart ve boş liste doğru sayılıyor', () => {
    expect(siraDogruMu([A])).toBe(true)
    expect(siraDogruMu([])).toBe(true)
  })
})

describe('dogruKomsuSayisi', () => {
  it('doğru sırada duran komşu çiftlerini sayıyor', () => {
    expect(dogruKomsuSayisi([A, B, C])).toBe(2)
    // Yalnızca A–B doğru; B–C bozuk değil ama C ortada, yani B'den önce.
    expect(dogruKomsuSayisi([A, C, B])).toBe(1)
    expect(dogruKomsuSayisi([C, B, A])).toBe(0)
  })
})

describe('soruPuani', () => {
  it('tam sırada komşuluk puanına bonus ekliyor', () => {
    expect(soruPuani([A, B, C])).toBe(2 + TAM_BONUS)
  })

  it('yanlış sırada yalnızca komşulukları veriyor — bonus yok', () => {
    expect(soruPuani([A, C, B])).toBe(1)
    expect(soruPuani([C, B, A])).toBe(0)
  })
})

describe('dogruSira', () => {
  it('kartları yıla göre diziyor, soruyu değiştirmiyor', () => {
    const soru = { olaylar: [C, A, B], donem: null }
    expect(dogruSira(soru).map((o) => o.olay)).toEqual(['A', 'B', 'C'])
    // Girdi bozulmamalı: ekran hem karışık hâli hem doğrusunu aynı anda çiziyor.
    expect(soru.olaylar.map((o) => o.olay)).toEqual(['C', 'A', 'B'])
  })
})

describe('yilMetni', () => {
  it('eksi yılları MÖ olarak yazıyor', () => {
    expect(yilMetni(1923)).toBe('1923')
    expect(yilMetni(-209)).toBe('MÖ 209')
  })
})

describe('soruKimligi', () => {
  it('aynı olaylardan kurulu iki soruyu aynı sayıyor', () => {
    expect(soruKimligi({ olaylar: [C, A, B], donem: null })).toBe(
      soruKimligi({ olaylar: [A, B, C], donem: 'kurtulus' }),
    )
  })
})

describe('soruKur', () => {
  it('istenen sayıda kart veriyor ve hepsi tek dönemden geliyor', () => {
    const soru = soruKur('kolay')
    expect(soru).not.toBeNull()
    expect(soru!.olaylar).toHaveLength(KART_SAYISI)
    expect(new Set(soru!.olaylar.map((o) => o.donem)).size).toBe(1)
    expect(soru!.donem).not.toBeNull()
  })

  it('kartları asla doğru sırada vermiyor', () => {
    // Karıştırma bazen doğru sırayı üretiyor; soru o zaman dokunmadan
    // kazanılırdı. Yüz deneme, beş kartta 120'de bir olan durumu yakalamaya yeter.
    for (let i = 0; i < 100; i++) {
      const soru = soruKur('orta')
      expect(siraDogruMu(soru!.olaylar)).toBe(false)
    }
  })

  it('aynı soruda iki olay aynı yıla düşmüyor', () => {
    for (let i = 0; i < 50; i++) {
      const soru = soruKur('zor')
      const yillar = soru!.olaylar.map((o) => o.yil)
      expect(new Set(yillar).size).toBe(yillar.length)
    }
  })

  it('kullanılmış olayları tekrar sormuyor', () => {
    const ilk = soruKur('kolay')!
    const kullanilan = new Set(ilk.olaylar.map((o) => o.olay))
    const ikinci = soruKur('kolay', KART_SAYISI, kullanilan)
    // Kolay havuzda iki dönem var; ikisi de tükenmeden ikinci soru kurulabilir.
    if (ikinci !== null) {
      for (const o of ikinci.olaylar) expect(kullanilan.has(o.olay)).toBe(false)
    }
  })

  it('havuz yetmiyorsa null dönüyor', () => {
    const kucuk = [olay('X', 1), olay('Y', 2)]
    expect(soruKur('kolay', KART_SAYISI, new Set(), kucuk)).toBeNull()
  })
})

describe('siralaTuruHazirla', () => {
  const bossVar = (sira: number) => sira % 10 === 0

  it('istenen sayıda soru üretiyor', () => {
    const tur = siralaTuruHazirla('kolay', bossVar, 'orta', 30)
    expect(tur).toHaveLength(30)
  })

  it('boss sorularında bir kart fazla veriyor', () => {
    const tur = siralaTuruHazirla('kolay', bossVar, 'orta', 20)
    expect(tur[9].boss).toBe(true)
    expect(tur[9].soru.olaylar).toHaveLength(BOSS_KART_SAYISI)
    expect(tur[0].boss).toBe(false)
    expect(tur[0].soru.olaylar).toHaveLength(KART_SAYISI)
  })

  it('havuz tükenince baştan dönüyor, erken kesmiyor', () => {
    // Kolay havuzda iki dönem × altı olay var: sınırsız tur ancak tekrara
    // dönerek sürebilir.
    const tur = siralaTuruHazirla('kolay', () => false, 'orta', 25)
    expect(tur).toHaveLength(25)
  })

  it('tek dönemlik havuzda bile soru üretiyor', () => {
    const tekDonem = SIRALA_HAVUZU.filter((o) => o.donem === 'kurtulus')
    const tur = siralaTuruHazirla('kolay', () => false, 'orta', 5, tekDonem)
    expect(tur).toHaveLength(5)
  })
})

describe('SIRALA_HAVUZU', () => {
  it('her dönemde boss sorusunu kuracak kadar olay var', () => {
    const sayilar = new Map<string, number>()
    for (const o of SIRALA_HAVUZU) sayilar.set(o.donem, (sayilar.get(o.donem) ?? 0) + 1)
    for (const [donem, sayi] of sayilar) {
      expect(sayi, `${donem} dönemi`).toBeGreaterThanOrEqual(BOSS_KART_SAYISI)
    }
  })

  it('bir dönemde aynı yıl iki kez geçmiyor', () => {
    const donemler = new Map<string, number[]>()
    for (const o of SIRALA_HAVUZU) {
      const liste = donemler.get(o.donem) ?? []
      liste.push(o.yil)
      donemler.set(o.donem, liste)
    }
    for (const [donem, yillar] of donemler) {
      expect(new Set(yillar).size, `${donem} dönemi`).toBe(yillar.length)
    }
  })

  it('olay adları benzersiz', () => {
    const adlar = SIRALA_HAVUZU.map((o) => o.olay)
    expect(new Set(adlar).size).toBe(adlar.length)
  })
})
