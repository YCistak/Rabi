import { describe, expect, it } from 'vitest'
import {
  ANTLASMA_HAVUZU,
  TARIH_DONEM_ADI,
  sutunBasligi,
  type AntlasmaMaddesi,
} from './antlasma-havuzu'
import { EL_BOYUTU, antlasmasiniBul, elHazirla, eslesiyorMu } from './antlasma'
import { ZORLUKLAR, zorluktaSuz } from './ritim'

/** Sabit sıra üreten sahte rastgele — testler tekrarlanabilir olsun. */
function sahteRastgele(degerler: number[]): () => number {
  let sira = 0
  return () => degerler[sira++ % degerler.length]
}

describe('antlaşma havuzu', () => {
  it('aynı madde iki kez geçmiyor', () => {
    // Aynı metin iki antlaşmaya bağlıysa sorunun iki doğru cevabı olur;
    // oyuncu doğru bildiği hâlde yanlış sayılır.
    const gorulen = new Set<string>()
    const tekrar = ANTLASMA_HAVUZU.filter((e) => {
      if (gorulen.has(e.madde)) return true
      gorulen.add(e.madde)
      return false
    })
    expect(tekrar).toEqual([])
  })

  it('hiçbir alan boş değil', () => {
    const bos = ANTLASMA_HAVUZU.filter((e) => e.madde.trim() === '' || e.antlasma.trim() === '')
    expect(bos).toEqual([])
  })

  it('her dönemin adı tanımlı', () => {
    for (const es of ANTLASMA_HAVUZU) {
      expect(TARIH_DONEM_ADI[es.donem], es.madde).toBeTruthy()
    }
  })

  /*
    Madde kutusu telefonda üç satıra sığacak kadar dar. Uzun bir madde kutuyu
    büyütüp diğerlerini ekrandan taşırıyor — okunamayan soru sorulmamış
    sorudur.
  */
  it('madde metinleri kutuya sığacak kadar kısa', () => {
    for (const es of ANTLASMA_HAVUZU) {
      expect(es.madde.length, es.madde).toBeLessThanOrEqual(110)
    }
  })

  it('antlaşma adları tuşa sığacak kadar kısa', () => {
    for (const es of ANTLASMA_HAVUZU) {
      expect(es.antlasma.length, es.antlasma).toBeLessThanOrEqual(38)
    }
  })

  it('her antlaşma adı yılıyla yazılmış', () => {
    // Yıl hem aynı adı taşıyan iki antlaşmayı ayırıyor (İstanbul 1700/1913,
    // Ankara 1921/1926) hem de maddeyle birlikte tarihi öğretiyor.
    for (const es of ANTLASMA_HAVUZU) {
      expect(es.antlasma, es.antlasma).toMatch(/\(\d{4}\)$/)
    }
  })

  it('her dönem tek başına el kurabiliyor', () => {
    // Tek dönemlik el oyunun asıl zorluğu: karışık elde öğrenci maddeyi
    // okumadan tarihe bakarak eşleştirir.
    const antlasmalar = new Map<string, Set<string>>()
    for (const es of ANTLASMA_HAVUZU) {
      const kume = antlasmalar.get(es.donem) ?? new Set<string>()
      kume.add(es.antlasma)
      antlasmalar.set(es.donem, kume)
    }
    for (const [donem, kume] of antlasmalar) {
      expect(kume.size, donem).toBeGreaterThanOrEqual(EL_BOYUTU)
    }
  })

  it('bir turu doldurmaya yetecek kadar madde var', () => {
    expect(ANTLASMA_HAVUZU.length).toBeGreaterThan(EL_BOYUTU * 10)
  })
})

/*
  Zorluk burada döneme bağlı; testin işi bunun **mekanik** karşılığını korumak.
  Süzülmüş havuzda tek dönemden dört antlaşma kalmazsa eller karışık kurulur ve
  oyunun asıl zorluğu (aynı dönemden dört antlaşma) kaybolur.
*/
describe('zorluk dağılımı', () => {
  it('her seviyede el kurmaya yetecek madde var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(zorluktaSuz(ANTLASMA_HAVUZU, zorluk).length, zorluk).toBeGreaterThan(EL_BOYUTU * 2)
    }
  })

  it('her seviyede tek dönemden el kurulabiliyor', () => {
    for (const zorluk of ZORLUKLAR) {
      const donemler = new Map<string, Set<string>>()
      for (const es of zorluktaSuz(ANTLASMA_HAVUZU, zorluk)) {
        const kume = donemler.get(es.donem) ?? new Set<string>()
        kume.add(es.antlasma)
        donemler.set(es.donem, kume)
      }
      const yeterli = [...donemler.values()].filter((k) => k.size >= EL_BOYUTU)
      expect(yeterli.length, zorluk).toBeGreaterThan(0)
    }
  })

  it('bir dönemin bütün maddeleri aynı seviyede', () => {
    const seviye = new Map<string, string>()
    for (const es of ANTLASMA_HAVUZU) {
      const onceki = seviye.get(es.donem)
      if (onceki === undefined) seviye.set(es.donem, es.zorluk)
      else expect(es.zorluk, es.donem).toBe(onceki)
    }
  })
})

describe('sutunBasligi', () => {
  it('belge dönemlerinde antlaşma demiyor', () => {
    expect(sutunBasligi('belgeler')).toBe('Belgeler')
    expect(sutunBasligi('inkilap')).toBe('Belgeler')
    expect(sutunBasligi('lozan' as never)).toBe('Antlaşmalar')
    expect(sutunBasligi(null)).toBe('Antlaşma ve belgeler')
  })
})

describe('elHazirla', () => {
  it('dört madde ve dört antlaşma verir', () => {
    const el = elHazirla()!
    expect(el.esler).toHaveLength(EL_BOYUTU)
    expect(el.maddeler).toHaveLength(EL_BOYUTU)
    expect(el.antlasmalar).toHaveLength(EL_BOYUTU)
  })

  it('bir elde aynı antlaşmadan iki madde olmuyor', () => {
    // Olsaydı o antlaşmanın tuşu iki maddeye birden uyar, doğru cevap yanlış
    // sayılırdı.
    for (let i = 0; i < 300; i++) {
      const el = elHazirla()!
      expect(new Set(el.antlasmalar).size, el.antlasmalar.join(', ')).toBe(EL_BOYUTU)
    }
  })

  it('gösterilen metinler seçilen eşlerle birebir aynı', () => {
    const el = elHazirla()!
    expect([...el.maddeler].sort()).toEqual(el.esler.map((e) => e.madde).sort())
    expect([...el.antlasmalar].sort()).toEqual(el.esler.map((e) => e.antlasma).sort())
  })

  it('iki sütun ayrı karıştırılıyor', () => {
    let farkliSira = 0
    for (let i = 0; i < 50; i++) {
      const el = elHazirla()!
      if (el.maddeler.join('|') !== el.esler.map((e) => e.madde).join('|')) farkliSira++
    }
    expect(farkliSira).toBeGreaterThan(0)
  })

  it('kullanılmış maddeleri tekrar sormuyor', () => {
    const ilk = elHazirla()!
    const kullanilan = new Set(ilk.esler.map((e) => e.madde))
    const ikinci = elHazirla(kullanilan)!
    for (const es of ikinci.esler) {
      expect(kullanilan.has(es.madde), es.madde).toBe(false)
    }
  })

  it('tek dönem yetiyorsa el o dönemden kurulur', () => {
    for (let i = 0; i < 50; i++) {
      const el = elHazirla()!
      if (el.donem !== null) {
        expect(new Set(el.esler.map((e) => e.donem))).toEqual(new Set([el.donem]))
      }
    }
  })

  it('tek dönem yetmezse karışık el kurar', () => {
    const havuz: AntlasmaMaddesi[] = [
      { madde: 'a1', antlasma: 'A (1900)', donem: 'klasik', zorluk: 'orta' },
      { madde: 'a2', antlasma: 'B (1901)', donem: 'klasik', zorluk: 'orta' },
      { madde: 'b1', antlasma: 'C (1902)', donem: 'kurtulus', zorluk: 'orta' },
      { madde: 'b2', antlasma: 'D (1903)', donem: 'kurtulus', zorluk: 'orta' },
    ]
    const el = elHazirla(new Set(), havuz)!
    expect(el.donem).toBeNull()
    expect(el.esler).toHaveLength(EL_BOYUTU)
  })

  it('madde kalmayınca null döner', () => {
    const hepsi = new Set(ANTLASMA_HAVUZU.map((e) => e.madde))
    expect(elHazirla(hepsi)).toBeNull()
  })

  it('tek antlaşmalı havuzda el kurulamaz', () => {
    const havuz: AntlasmaMaddesi[] = Array.from({ length: 20 }, (_, i) => ({
      madde: `m${i}`,
      antlasma: 'Tek Antlaşma (1900)',
      donem: 'klasik' as const,
      zorluk: 'orta' as const,
    }))
    expect(elHazirla(new Set(), havuz, sahteRastgele([0.3, 0.7]))).toBeNull()
  })
})

describe('eşleştirme', () => {
  const el = elHazirla()!

  it('doğru çifti tanır', () => {
    const es = el.esler[0]
    expect(eslesiyorMu(el, es.madde, es.antlasma)).toBe(true)
  })

  it('yanlış çifti reddeder', () => {
    const [ilk, ikinci] = el.esler
    expect(eslesiyorMu(el, ilk.madde, ikinci.antlasma)).toBe(false)
  })

  it('maddenin antlaşmasını bulur', () => {
    const es = el.esler[1]
    expect(antlasmasiniBul(el, es.madde)).toBe(es.antlasma)
    expect(antlasmasiniBul(el, 'olmayan madde')).toBeNull()
  })
})
