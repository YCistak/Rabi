import { describe, expect, it } from 'vitest'
import {
  EN_COK_NOT,
  EN_UZUN_NOT,
  NOT_RENKLERI,
  kalanIs,
  konumuSinirla,
  notEkle,
  notSil,
  notTasi,
  notYaz,
  notlariNormalize,
  notuIsaretle,
  oneAl,
  siradakiRenk,
  yerVarMi,
  yeniKonum,
  type NotKagidi,
} from './yapilacaklar'

const TARIH = '2026-08-21T10:00:00.000Z'

/** `adet` kadar kâğıtlık dolu bir tahta. */
function tahta(adet: number): NotKagidi[] {
  let notlar: NotKagidi[] = []
  for (let i = 0; i < adet; i++) notlar = notEkle(notlar, `n${i}`, TARIH) ?? notlar
  return notlar
}

describe('notEkle', () => {
  it('boş kâğıt ekliyor', () => {
    const notlar = notEkle([], 'a', TARIH)
    expect(notlar).toHaveLength(1)
    expect(notlar?.[0]).toMatchObject({ id: 'a', metin: '', bitti: false, olusturma: TARIH })
  })

  /* Hepsi aynı yere yapışsaydı ikinci kâğıt birincisini örterdi. */
  it('art arda eklenen kâğıtlar aynı yere yapışmıyor', () => {
    const notlar = tahta(3)
    const konumlar = notlar.map((n) => `${n.x},${n.y}`)
    expect(new Set(konumlar).size).toBe(3)
  })

  it('art arda eklenen kâğıtlar farklı renk alıyor', () => {
    const renkler = tahta(NOT_RENKLERI.length).map((n) => n.renk)
    expect(new Set(renkler).size).toBe(NOT_RENKLERI.length)
  })

  /* Tahta dolunca en eski kâğıt silinmiyor: silmek kullanıcının kararı. */
  it('tahta dolunca eklemiyor', () => {
    const dolu = tahta(EN_COK_NOT)
    expect(dolu).toHaveLength(EN_COK_NOT)
    expect(yerVarMi(dolu)).toBe(false)
    expect(notEkle(dolu, 'fazla', TARIH)).toBeNull()
  })
})

describe('yeniKonum', () => {
  it('konumlar tahtanın içinde kalıyor', () => {
    for (let i = 0; i < EN_COK_NOT; i++) {
      const { x, y } = yeniKonum(i)
      expect(x, `x ${i}`).toBeGreaterThanOrEqual(0)
      expect(x, `x ${i}`).toBeLessThanOrEqual(1)
      expect(y, `y ${i}`).toBeGreaterThanOrEqual(0)
      expect(y, `y ${i}`).toBeLessThanOrEqual(1)
    }
  })
})

describe('konumuSinirla', () => {
  it('0–1 aralığına kırpıyor', () => {
    expect(konumuSinirla(-3)).toBe(0)
    expect(konumuSinirla(4.2)).toBe(1)
    expect(konumuSinirla(0.35)).toBe(0.35)
  })

  it('sayı olmayanı sıfıra çekiyor', () => {
    expect(konumuSinirla(Number.NaN)).toBe(0)
    expect(konumuSinirla(Number.POSITIVE_INFINITY)).toBe(0)
  })
})

describe('düzenleme', () => {
  it('metni yazıyor ve sınırda kesiyor', () => {
    const notlar = tahta(1)
    expect(notYaz(notlar, 'n0', 'akşam etüt')[0].metin).toBe('akşam etüt')
    expect(notYaz(notlar, 'n0', 'x'.repeat(EN_UZUN_NOT + 50))[0].metin).toHaveLength(EN_UZUN_NOT)
  })

  it('taşıma konumu kırpıyor', () => {
    const tasinan = notTasi(tahta(1), 'n0', 5, -2)[0]
    expect(tasinan).toMatchObject({ x: 1, y: 0 })
  })

  it('işaretleme iki yönlü', () => {
    const notlar = tahta(1)
    expect(notuIsaretle(notlar, 'n0')[0].bitti).toBe(true)
    expect(notuIsaretle(notuIsaretle(notlar, 'n0'), 'n0')[0].bitti).toBe(false)
  })

  it('silinen kâğıt yer açıyor', () => {
    const dolu = tahta(EN_COK_NOT)
    const kalan = notSil(dolu, 'n3')
    expect(kalan).toHaveLength(EN_COK_NOT - 1)
    expect(notEkle(kalan, 'yeni', TARIH)).toHaveLength(EN_COK_NOT)
  })

  it('olmayan kimlik listeyi değiştirmiyor', () => {
    const notlar = tahta(2)
    expect(notYaz(notlar, 'yok', 'x')).toEqual(notlar)
    expect(notSil(notlar, 'yok')).toEqual(notlar)
  })

  it('kalan iş bitmemişleri sayıyor', () => {
    const notlar = tahta(3)
    expect(kalanIs(notlar)).toBe(3)
    expect(kalanIs(notuIsaretle(notlar, 'n1'))).toBe(2)
  })
})

describe('oneAl', () => {
  /* Sürüklenen kâğıt öne gelmezse üstüne binenin altında kalır. */
  it('kâğıdı dizinin sonuna taşıyor', () => {
    const notlar = tahta(3)
    expect(oneAl(notlar, 'n0').map((n) => n.id)).toEqual(['n1', 'n2', 'n0'])
  })

  it('zaten öndeki kâğıdın sırasını bozmuyor', () => {
    const notlar = tahta(3)
    expect(oneAl(notlar, 'n2').map((n) => n.id)).toEqual(['n0', 'n1', 'n2'])
  })

  it('olmayan kimlikte liste aynı kalıyor', () => {
    const notlar = tahta(2)
    expect(oneAl(notlar, 'yok')).toEqual(notlar)
  })
})

describe('notlariNormalize', () => {
  it('bozuk kaydı boş tahtaya indiriyor', () => {
    expect(notlariNormalize(undefined)).toEqual([])
    expect(notlariNormalize({ id: 'a' })).toEqual([])
    expect(notlariNormalize(['metin'])).toEqual([])
  })

  /* Eski kayıtta olmayan alan `undefined` kalsaydı kâğıt çizilirken çökerdi. */
  it('eksik alanları tamamlıyor', () => {
    const [not] = notlariNormalize([{ id: 'a' }])
    expect(not).toMatchObject({ id: 'a', metin: '', bitti: false, x: 0, y: 0 })
    expect(NOT_RENKLERI).toContain(not.renk)
  })

  it('tahtanın dışına taşan konumu içeri alıyor', () => {
    const [not] = notlariNormalize([{ id: 'a', x: 9, y: -4 }])
    expect(not).toMatchObject({ x: 1, y: 0 })
  })

  it('tanınmayan rengi paletten birine düşürüyor', () => {
    const [not] = notlariNormalize([{ id: 'a', renk: 'turuncu' }])
    expect(NOT_RENKLERI).toContain(not.renk)
  })

  it('sınırı aşan kaydı kırpıyor', () => {
    const cok = Array.from({ length: EN_COK_NOT + 8 }, (_, i) => ({ id: `n${i}` }))
    expect(notlariNormalize(cok)).toHaveLength(EN_COK_NOT)
  })

  it('kimliksiz kaydı atıyor', () => {
    expect(notlariNormalize([{ metin: 'x' }, { id: '' }, { id: 'a' }])).toHaveLength(1)
  })
})

describe('siradakiRenk', () => {
  it('palette dönüyor', () => {
    expect(siradakiRenk(0)).toBe(NOT_RENKLERI[0])
    expect(siradakiRenk(NOT_RENKLERI.length)).toBe(NOT_RENKLERI[0])
  })
})
