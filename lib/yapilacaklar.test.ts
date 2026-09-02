import { describe, expect, it } from 'vitest'
import {
  EN_AZ_PAY_X,
  EN_AZ_PAY_Y,
  EN_COK_NOT,
  EN_UZUN_NOT,
  NOT_RENKLERI,
  ayrikKonum,
  gununNotlari,
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

const TARIH = '2026-08-21'

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
    expect(notlar?.[0]).toMatchObject({ id: 'a', metin: '', bitti: false, gun: TARIH })
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

  /*
    Asıl şikâyet buydu: eski basamak beşte bir başa dönüyordu ve altıncı kâğıt
    birincinin üstüne oturuyordu. Sınıra kadar her kâğıdın ayrı yeri olmalı.
  */
  it('tahta sınırına kadar hiçbir konum tekrarlanmıyor', () => {
    const konumlar = Array.from({ length: EN_COK_NOT }, (_, i) => {
      const { x, y } = yeniKonum(i)
      return `${x},${y}`
    })
    expect(new Set(konumlar).size).toBe(EN_COK_NOT)
  })

  /* Kenarda pay var: 0 ya da 1 kâğıdı tahtanın yuvarlak köşesine dayardı. */
  it('kâğıtlar tahtanın kenarına yapışmıyor', () => {
    for (let i = 0; i < EN_COK_NOT; i++) {
      const { x, y } = yeniKonum(i)
      expect(x).toBeGreaterThan(0)
      expect(x).toBeLessThan(1)
      expect(y).toBeGreaterThan(0)
      expect(y).toBeLessThan(1)
    }
  })
})

describe('gununNotlari', () => {
  it('yalnızca bugünün kâğıtlarını bırakıyor', () => {
    const notlar = [
      ...(notEkle([], 'dun', '2026-08-20') ?? []),
      ...(notEkle([], 'bugun', TARIH) ?? []),
    ]
    expect(gununNotlari(notlar, TARIH).map((n) => n.id)).toEqual(['bugun'])
  })

  it('gün dönmediyse tahtaya dokunmuyor', () => {
    const notlar = tahta(3)
    expect(gununNotlari(notlar, TARIH)).toHaveLength(3)
  })

  /* Eski sürümden kalan kayıtta gün yok; bugüne ait sayılmamalı. */
  it('günü olmayan kayıt temizleniyor', () => {
    const eski = notlariNormalize([{ id: 'a', metin: 'eski' }])
    expect(eski).toHaveLength(1)
    expect(gununNotlari(eski, TARIH)).toHaveLength(0)
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

describe('ayrikKonum', () => {
  /** İki kâğıt birbirini tümüyle kapatıyor mu. */
  function kapaniyorMu(a: { x: number; y: number }, b: { x: number; y: number }): boolean {
    return Math.abs(a.x - b.x) < EN_AZ_PAY_X && Math.abs(a.y - b.y) < EN_AZ_PAY_Y
  }

  it('tam üst üste bırakılan kâğıdı kenara çekiyor', () => {
    const notlar = tahta(2)
    const hedef = notlar[0]
    const yeni = ayrikKonum(notlar, 'n1', hedef.x, hedef.y)
    expect(kapaniyorMu(yeni, hedef)).toBe(false)
  })

  it('üst üste binmeye izin veriyor — yalnızca tam örtüşmeyi engelliyor', () => {
    const notlar = tahta(2)
    const hedef = notlar[0]
    // Bir eksende payın üstünde kalan konum olduğu gibi kabul ediliyor.
    const yakin = { x: hedef.x, y: hedef.y + EN_AZ_PAY_Y + 0.01 }
    expect(ayrikKonum(notlar, 'n1', yakin.x, yakin.y)).toEqual(yakin)
  })

  it('kendini engel saymıyor', () => {
    const notlar = tahta(1)
    const n = notlar[0]
    expect(ayrikKonum(notlar, 'n0', n.x, n.y)).toEqual({ x: n.x, y: n.y })
  })

  it('taşıma sonrası hiçbir kâğıt bir başkasını kapatmıyor', () => {
    // On kâğıdın hepsi aynı köşeye bırakılıyor; her biri boş bir yer buluyor.
    let notlar = tahta(EN_COK_NOT)
    for (const not of [...notlar]) notlar = notTasi(notlar, not.id, 0.5, 0.5)

    for (const a of notlar) {
      for (const b of notlar) {
        if (a.id === b.id) continue
        expect(kapaniyorMu(a, b), `${a.id} ↔ ${b.id}`).toBe(false)
      }
    }
  })

  it('yeni kâğıt dolu bir ızgara yerine oturmuyor', () => {
    // İlk kâğıt ikinci ızgara yerine taşınırsa, ikinci kâğıt oraya düşmemeli.
    const ikinciYer = yeniKonum(1)
    const notlar = notTasi(tahta(1), 'n0', ikinciYer.x, ikinciYer.y)
    const eklenen = notEkle(notlar, 'yeni', TARIH)?.[1]
    expect(eklenen).toBeDefined()
    expect(kapaniyorMu(eklenen!, notlar[0])).toBe(false)
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
