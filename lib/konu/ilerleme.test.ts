import { describe, expect, it } from 'vitest'
import {
  BILINMEYEN_SINIRI,
  bankaDagilimi,
  bilinmeyenKur,
  bilinmeyenSil,
  bilinmeyenleriEkle,
  dersOrani,
  ilerlemeyiYaz,
  konuBitti,
  temadaBiten,
  type BilinmeyenKart,
} from './ilerleme'
import { konu, kart, program, tema } from './tip'

const ornekKonu = konu('k1', 'Birinci Konu', [
  kart('A', 'a metni'),
  kart('B', 'b metni'),
])
const ikinciKonu = konu('k2', 'İkinci Konu', [kart('C', 'c metni')])
const ornekProgram = program('biyoloji', 9, [
  tema('t1', 'Tema Bir', [ornekKonu, ikinciKonu]),
])

function bilinmeyen(id: string, ders: BilinmeyenKart['ders'] = 'biyoloji'): BilinmeyenKart {
  return {
    id,
    konuId: 'k1',
    konuAdi: 'Birinci Konu',
    ders,
    sinif: 9,
    baslik: id,
    metin: `${id} metni`,
    tarih: '2026-09-01',
  }
}

describe('ilerleme', () => {
  it('deste bitmeden konu tamamlanmış sayılmaz', () => {
    const yarim = ilerlemeyiYaz({}, 'k1', { bilinen: 1, bilinmeyen: 0, bitti: false }, '2026-09-01')
    expect(konuBitti(yarim, 'k1')).toBe(false)
  })

  it('biten konu haritada tamamlanmış görünür', () => {
    const tam = ilerlemeyiYaz({}, 'k1', { bilinen: 2, bilinmeyen: 0, bitti: true }, '2026-09-01')
    expect(konuBitti(tam, 'k1')).toBe(true)
    expect(temadaBiten(ornekProgram.temalar[0], tam)).toBe(1)
    expect(dersOrani(ornekProgram, tam)).toEqual({ biten: 1, toplam: 2 })
  })

  /** Aynı konu yeniden okunabiliyor; kayıt birikmiyor, son okuma kazanıyor. */
  it('aynı konu ikinci kez okunursa kayıt tazelenir', () => {
    let ilerlemeler = ilerlemeyiYaz({}, 'k1', { bilinen: 0, bilinmeyen: 2, bitti: true }, '2026-09-01')
    ilerlemeler = ilerlemeyiYaz(
      ilerlemeler,
      'k1',
      { bilinen: 2, bilinmeyen: 0, bitti: true },
      '2026-09-05',
    )
    expect(Object.keys(ilerlemeler)).toHaveLength(1)
    expect(ilerlemeler.k1).toEqual({ bilinen: 2, bilinmeyen: 0, bitti: true, tarih: '2026-09-05' })
  })
})

describe('bilinmeyenler bankası', () => {
  it('yeni kartlar başa girer', () => {
    const banka = bilinmeyenleriEkle([bilinmeyen('a')], [bilinmeyen('b')])
    expect(banka.map((k) => k.id)).toEqual(['b', 'a'])
  })

  /** Aynı kart iki kez "bilmiyorum" işaretlenebilir; liste ikiye çıkmamalı. */
  it('aynı kart ikinci kez eklenmez, tazelenir', () => {
    const banka = bilinmeyenleriEkle([bilinmeyen('a'), bilinmeyen('b')], [bilinmeyen('a')])
    expect(banka.map((k) => k.id)).toEqual(['a', 'b'])
  })

  it('sınır aşılınca en eski kayıt düşer', () => {
    const dolu = Array.from({ length: BILINMEYEN_SINIRI }, (_, i) => bilinmeyen(`k${i}`))
    const banka = bilinmeyenleriEkle(dolu, [bilinmeyen('yeni')])
    expect(banka).toHaveLength(BILINMEYEN_SINIRI)
    expect(banka[0].id).toBe('yeni')
    expect(banka.some((k) => k.id === `k${BILINMEYEN_SINIRI - 1}`)).toBe(false)
  })

  it('girdiyi değiştirmez', () => {
    const once = [bilinmeyen('a')]
    bilinmeyenleriEkle(once, [bilinmeyen('b')])
    expect(once).toHaveLength(1)
  })

  it('tek kaydı siler', () => {
    expect(bilinmeyenSil([bilinmeyen('a'), bilinmeyen('b')], 'a').map((k) => k.id)).toEqual(['b'])
  })

  it('derse göre sayar', () => {
    const banka = [bilinmeyen('a'), bilinmeyen('b'), bilinmeyen('c', 'tarih')]
    expect(bankaDagilimi(banka)).toEqual({ biyoloji: 2, tarih: 1 })
  })

  /**
   * Kayıt kartın metnini kendi içinde taşıyor: içerik güncellenip kart
   * kimlikleri kaysa bile bankadaki yazı doğru kalmalı.
   */
  it('kart kaydı metni kendi içinde taşır', () => {
    const kayit = bilinmeyenKur(ornekKonu.kartlar[0], ornekKonu, 'biyoloji', 9, '2026-09-01')
    expect(kayit).toMatchObject({
      id: 'k1-1',
      konuId: 'k1',
      konuAdi: 'Birinci Konu',
      baslik: 'A',
      metin: 'a metni',
    })
  })
})
