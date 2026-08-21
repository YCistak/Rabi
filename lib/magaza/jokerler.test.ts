import { describe, expect, it } from 'vitest'
import {
  BOS_STOK,
  EN_GEC_SEVIYE,
  JOKERLER,
  KATALOG_TUTARI,
  OMURLUK_JOKER,
  STOK_SINIRI,
  jokerAcikMi,
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
import { EN_YUKSEK_SEVIYE, TOPLAM_HAVUC } from '../seviye'

const joker = (id: string) => {
  const bulunan = jokerBul(id)
  if (!bulunan) throw new Error(`katalogda yok: ${id}`)
  return bulunan
}

/** Seviye şartını devre dışı bırakan değer — konusu seviye olmayan testler için. */
const TAVAN = EN_YUKSEK_SEVIYE

describe('katalog', () => {
  it('aynı kimlik iki kez geçmiyor', () => {
    expect(new Set(JOKERLER.map((j) => j.id)).size).toBe(JOKERLER.length)
  })

  it('her jokerin adı, açıklaması, pozitif fiyatı ve seviye şartı var', () => {
    for (const j of JOKERLER) {
      expect(j.ad.length, j.id).toBeGreaterThan(1)
      expect(j.aciklama.length, j.id).toBeGreaterThan(10)
      expect(j.fiyat, j.id).toBeGreaterThan(0)
      expect(j.enAzSeviye, j.id).toBeGreaterThanOrEqual(1)
    }
  })

  /* Tavanın üstünde bir şart konsaydı o joker hiçbir zaman satılmazdı. */
  it('en geç açılan joker seviye tavanının altında', () => {
    expect(EN_GEC_SEVIYE).toBeLessThan(EN_YUKSEK_SEVIYE)
  })

  /* Güç fiyatla da seviyeyle de artmalı; ikisi ters düşerse vitrin anlamsızlaşır. */
  it('pahalı joker daha geç açılıyor', () => {
    const sirali = [...JOKERLER].sort((a, b) => a.fiyat - b.fiyat)
    for (let i = 1; i < sirali.length; i++) {
      expect(sirali[i].enAzSeviye, sirali[i].id).toBeGreaterThanOrEqual(sirali[i - 1].enAzSeviye)
    }
  })

  /* İlk günden alınabilen bir joker olmalı, yoksa mağaza ölü bir vitrin. */
  it('en az bir joker 1. seviyede açık', () => {
    expect(JOKERLER.some((j) => j.enAzSeviye === 1)).toBe(true)
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
    const sonuc = jokerAl(BOS_STOK, 500, j, TAVAN)
    expect(sonuc?.havuc).toBe(500 - j.fiyat)
    expect(jokerSayisi(sonuc!.stok, 'elli-elli')).toBe(1)
  })

  it('havuç yetmiyorsa satmıyor', () => {
    const j = joker('cift-cevap')
    expect(jokerAlinabilirMi(BOS_STOK, j.fiyat - 1, j, TAVAN)).toBe(false)
    expect(jokerAl(BOS_STOK, j.fiyat - 1, j, TAVAN)).toBeNull()
  })

  /*
    Seviye, havuçtan bağımsız ikinci bir kapı: bütün havucunu biriktirmiş ama
    seviyesi yetmeyen biri güçlü jokeri alamamalı, yoksa şartın anlamı kalmaz.
  */
  it('seviye yetmiyorsa havuç yetse de satmıyor', () => {
    const j = joker('cift-cevap')
    expect(jokerAcikMi(j, j.enAzSeviye - 1)).toBe(false)
    expect(jokerAlinabilirMi(BOS_STOK, 100000, j, j.enAzSeviye - 1)).toBe(false)
    expect(jokerAl(BOS_STOK, 100000, j, j.enAzSeviye - 1)).toBeNull()
  })

  it('şartın tam sağlandığı seviyede satılıyor', () => {
    const j = joker('cift-cevap')
    expect(jokerAcikMi(j, j.enAzSeviye)).toBe(true)
    expect(jokerAl(BOS_STOK, j.fiyat, j, j.enAzSeviye)).not.toBeNull()
  })

  it('aynı joker birden çok kez alınabiliyor', () => {
    const j = joker('ek-sure')
    const ilk = jokerAl(BOS_STOK, 1000, j, TAVAN)!
    const ikinci = jokerAl(ilk.stok, ilk.havuc, j, TAVAN)!
    expect(jokerSayisi(ikinci.stok, 'ek-sure')).toBe(2)
    expect(ikinci.havuc).toBe(1000 - 2 * j.fiyat)
  })

  it('stok dolunca satmıyor', () => {
    const j = joker('ek-sure')
    const dolu: JokerStogu = { 'ek-sure': STOK_SINIRI }
    expect(jokerDoluMu(dolu, j)).toBe(true)
    expect(jokerAl(dolu, 10000, j, TAVAN)).toBeNull()
  })

  it('bakiyeyi eksiye düşürmüyor', () => {
    let stok = BOS_STOK
    let havuc = 400
    for (const j of [...JOKERLER, ...JOKERLER]) {
      const sonuc = jokerAl(stok, havuc, j, TAVAN)
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

/*
  Ekonominin dengesi. Buradaki sayılar `lib/seviye.ts` ile birlikte okunuyor:
  fiyat tek başına değil, ömür boyu kazanılan havuca **oranla** anlamlı. Fiyat
  ya da XP eğrisi değişince kırılması gereken testler bunlar.
*/
describe('denge', () => {
  it('bütün havuç jokere yatırılsa birkaç düzine joker alınıyor', () => {
    expect(OMURLUK_JOKER).toBeGreaterThan(25)
    expect(OMURLUK_JOKER).toBeLessThan(60)
  })

  /* Çantayı tepeleme doldurmak ömür boyu kazanılan havucun üstünde kalmalı. */
  it('her jokerden dokuzar tane almak mümkün değil', () => {
    expect(KATALOG_TUTARI * STOK_SINIRI).toBeGreaterThan(TOPLAM_HAVUC)
  })
})
