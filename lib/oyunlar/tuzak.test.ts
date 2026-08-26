import { describe, expect, it } from 'vitest'
import {
  bankadanSorular,
  cevapDogruMu,
  duzeltme,
  ifade,
  soruKimligi,
  soruKur,
  tuzakTuruHazirla,
} from './tuzak'
import { TUZAK_HAVUZU, type TuzakKurali } from './tuzak-havuzu'

const KURAL: TuzakKurali = {
  dogru: '(a + b)² = a² + 2ab + b²',
  yanlis: '(a + b)² = a² + b²',
  aciklama: 'Ortadaki 2ab kayboluyor.',
  konu: 'ozdeslik',
  zorluk: 'kolay',
}

describe('ifade', () => {
  it('sorunun yüzüne göre doğru ya da yanlış hâli veriyor', () => {
    expect(ifade({ kural: KURAL, dogruHali: true })).toBe(KURAL.dogru)
    expect(ifade({ kural: KURAL, dogruHali: false })).toBe(KURAL.yanlis)
  })
})

describe('cevapDogruMu', () => {
  it('doğru hâle "doğru" demek doğru sayılıyor', () => {
    expect(cevapDogruMu({ kural: KURAL, dogruHali: true }, true)).toBe(true)
    expect(cevapDogruMu({ kural: KURAL, dogruHali: true }, false)).toBe(false)
  })

  it('yanlış hâle "yanlış" demek doğru sayılıyor', () => {
    expect(cevapDogruMu({ kural: KURAL, dogruHali: false }, false)).toBe(true)
    expect(cevapDogruMu({ kural: KURAL, dogruHali: false }, true)).toBe(false)
  })
})

describe('duzeltme', () => {
  it('yanlış hâlde kuralın doğrusunu veriyor', () => {
    expect(duzeltme({ kural: KURAL, dogruHali: false })).toBe(KURAL.dogru)
  })

  it('doğru hâlde düzeltecek bir şey yok', () => {
    expect(duzeltme({ kural: KURAL, dogruHali: true })).toBeNull()
  })
})

describe('soruKimligi', () => {
  it('aynı kuralın iki yüzünü tek kayda bağlıyor', () => {
    expect(soruKimligi({ kural: KURAL, dogruHali: true })).toBe(
      soruKimligi({ kural: KURAL, dogruHali: false }),
    )
  })
})

describe('soruKur', () => {
  it('rastgele üretecin yarısında doğru, yarısında yanlış hâli seçiyor', () => {
    expect(soruKur(KURAL, () => 0.2).dogruHali).toBe(true)
    expect(soruKur(KURAL, () => 0.8).dogruHali).toBe(false)
  })
})

describe('tuzakTuruHazirla', () => {
  it('istenen sayıda soru üretiyor', () => {
    expect(tuzakTuruHazirla(20, 'kolay')).toHaveLength(20)
  })

  it('yalnızca seçilen zorluktan kural çekiyor', () => {
    for (const soru of tuzakTuruHazirla(30, 'zor')) {
      expect(soru.kural.zorluk).toBe('zor')
    }
  })

  it('havuz tükenince başa dönüyor, tur kısalmıyor', () => {
    const kolaylar = TUZAK_HAVUZU.filter((k) => k.zorluk === 'kolay')
    const tur = tuzakTuruHazirla(kolaylar.length * 2, 'kolay')
    expect(tur).toHaveLength(kolaylar.length * 2)
  })

  it('havuzun tamamı bitmeden aynı kural tekrar etmiyor', () => {
    const kolaylar = TUZAK_HAVUZU.filter((k) => k.zorluk === 'kolay')
    const tur = tuzakTuruHazirla(kolaylar.length, 'kolay')
    expect(new Set(tur.map((s) => s.kural.dogru)).size).toBe(kolaylar.length)
  })

  it('seçilen zorlukta kural yoksa havuzun tamamına düşüyor', () => {
    const tekZorluk = TUZAK_HAVUZU.filter((k) => k.zorluk === 'kolay')
    const tur = tuzakTuruHazirla(5, 'zor', tekZorluk)
    expect(tur).toHaveLength(5)
  })

  it('boş havuzda boş tur veriyor, sonsuz döngüye girmiyor', () => {
    expect(tuzakTuruHazirla(10, 'kolay', [])).toEqual([])
  })

  it('cevap dağılımı tek yöne kaymıyor', () => {
    // Yazı tura gerçekten atılıyor mu: yüz soruda hepsi aynı yüz çıkarsa
    // "hep doğru de" stratejisi turu kazanırdı.
    const tur = tuzakTuruHazirla(100, 'orta')
    const dogruHali = tur.filter((s) => s.dogruHali).length
    expect(dogruHali).toBeGreaterThan(20)
    expect(dogruHali).toBeLessThan(80)
  })
})

describe('bankadanSorular', () => {
  it('her kayıttan bir soru üretiyor', () => {
    expect(bankadanSorular([KURAL, TUZAK_HAVUZU[1]])).toHaveLength(2)
  })
})

describe('TUZAK_HAVUZU', () => {
  it('her zorlukta soru var', () => {
    for (const zorluk of ['kolay', 'orta', 'zor'] as const) {
      expect(
        TUZAK_HAVUZU.filter((k) => k.zorluk === zorluk).length,
        `${zorluk} seviyesi`,
      ).toBeGreaterThan(0)
    }
  })

  it('doğru ve yanlış hâller birbirinden farklı', () => {
    for (const kural of TUZAK_HAVUZU) {
      expect(kural.dogru, kural.dogru).not.toBe(kural.yanlis)
    }
  })

  it('kuralların doğru hâli benzersiz — banka kimliği ondan üretiliyor', () => {
    const dogrular = TUZAK_HAVUZU.map((k) => k.dogru)
    expect(new Set(dogrular).size).toBe(dogrular.length)
  })
})
