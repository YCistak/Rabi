import { describe, expect, it } from 'vitest'
import {
  BOS_STOK,
  JOKERLER,
  STOK_SINIRI,
  jokerAl,
  jokerAlinabilirMi,
  jokerBul,
  jokerDoluMu,
  jokerKullan,
  jokerSayisi,
  jokerToplami,
  stoguNormalize,
  type JokerStogu,
} from './jokerler'

const joker = (id: string) => {
  const bulunan = jokerBul(id)
  if (!bulunan) throw new Error(`katalogda yok: ${id}`)
  return bulunan
}

describe('katalog', () => {
  it('aynı kimlik iki kez geçmiyor', () => {
    expect(new Set(JOKERLER.map((j) => j.id)).size).toBe(JOKERLER.length)
  })

  it('her jokerin adı, açıklaması ve pozitif fiyatı var', () => {
    for (const j of JOKERLER) {
      expect(j.ad.length, j.id).toBeGreaterThan(1)
      expect(j.aciklama.length, j.id).toBeGreaterThan(10)
      expect(j.fiyat, j.id).toBeGreaterThan(0)
    }
  })

  /*
    Joker cevabı söylemiyor, sahayı daraltıyor: 50/50 iki yanlışı eliyor.
    Kalan iki şıktan birini seçmek hâlâ kullanıcının işi.
  */
  it('elli-elli katalogda duruyor', () => {
    expect(jokerBul('elli-elli')?.fiyat).toBeGreaterThan(0)
  })

  it('bilinmeyen kimlik bulunmuyor', () => {
    expect(jokerBul('sihirli-degnek')).toBeUndefined()
  })
})

describe('stoguNormalize', () => {
  it('bozuk kaydı boş stoğa indiriyor', () => {
    expect(stoguNormalize(undefined)).toEqual(BOS_STOK)
    expect(stoguNormalize({ 'elli-elli': 'çok' } as never)).toEqual(BOS_STOK)
  })

  /*
    `localStorage` elle kurcalanabilir. Sınırsız stok yazılabilseydi mağazayı
    atlamanın yolu açık kalırdı; negatif adet ise sayaçları bozardı.
  */
  it('sınırı aşan, negatif ve kesirli adetleri düzeltiyor', () => {
    const stok = stoguNormalize({ 'elli-elli': 99, 'ek-sure': -3, 'cift-cevap': 2.7 })
    expect(stok['elli-elli']).toBe(STOK_SINIRI)
    expect(stok['ek-sure']).toBeUndefined()
    expect(stok['cift-cevap']).toBe(2)
  })

  it('katalogda olmayan kimliği atıyor', () => {
    expect(stoguNormalize({ 'kaldirilmis-joker': 3 } as never)).toEqual(BOS_STOK)
  })
})

describe('satın alma', () => {
  it('havuç yetiyorsa alıyor ve düşüyor', () => {
    const j = joker('elli-elli')
    const sonuc = jokerAl(BOS_STOK, 500, j)
    expect(sonuc?.havuc).toBe(500 - j.fiyat)
    expect(jokerSayisi(sonuc!.stok, 'elli-elli')).toBe(1)
  })

  it('havuç yetmiyorsa satmıyor', () => {
    const j = joker('cift-cevap')
    expect(jokerAlinabilirMi(BOS_STOK, j.fiyat - 1, j)).toBe(false)
    expect(jokerAl(BOS_STOK, j.fiyat - 1, j)).toBeNull()
  })

  /* Kozmetikten en büyük fark: aynı joker üst üste alınabiliyor. */
  it('aynı joker birden çok kez alınabiliyor', () => {
    const j = joker('ek-sure')
    const ilk = jokerAl(BOS_STOK, 1000, j)!
    const ikinci = jokerAl(ilk.stok, ilk.havuc, j)!
    expect(jokerSayisi(ikinci.stok, 'ek-sure')).toBe(2)
    expect(ikinci.havuc).toBe(1000 - 2 * j.fiyat)
  })

  it('stok dolunca satmıyor', () => {
    const j = joker('ek-sure')
    const dolu: JokerStogu = { 'ek-sure': STOK_SINIRI }
    expect(jokerDoluMu(dolu, j)).toBe(true)
    expect(jokerAl(dolu, 10000, j)).toBeNull()
  })

  it('bakiyeyi eksiye düşürmüyor', () => {
    let stok = BOS_STOK
    let havuc = 200
    for (const j of [...JOKERLER, ...JOKERLER]) {
      const sonuc = jokerAl(stok, havuc, j)
      if (!sonuc) continue
      stok = sonuc.stok
      havuc = sonuc.havuc
    }
    expect(havuc).toBeGreaterThanOrEqual(0)
  })
})

describe('kullanma', () => {
  it('stoktan bir tane düşüyor', () => {
    expect(jokerKullan({ 'elli-elli': 3 }, 'elli-elli')['elli-elli']).toBe(2)
  })

  /* Sıfıra inen joker anahtar olarak da kalmıyor: "0 tane var" diye bir şey yok. */
  it('sonuncusu kullanılınca anahtar siliniyor', () => {
    expect(jokerKullan({ 'elli-elli': 1 }, 'elli-elli')).toEqual({})
  })

  it('olmayan jokeri kullanmak durumu değiştirmiyor', () => {
    const stok: JokerStogu = { 'ek-sure': 2 }
    expect(jokerKullan(stok, 'elli-elli')).toEqual(stok)
  })
})

describe('jokerToplami', () => {
  it('bütün jokerleri sayıyor', () => {
    expect(jokerToplami(BOS_STOK)).toBe(0)
    expect(jokerToplami({ 'elli-elli': 2, 'ek-sure': 3 })).toBe(5)
  })
})
