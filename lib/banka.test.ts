import { describe, expect, it } from 'vitest'
import { bankaOzeti, bankaSuz, derslereGore, gecerliDers } from './banka'
import type { YanlisSoru } from './types'

function soru(veri: Partial<YanlisSoru> & { id: string }): YanlisSoru {
  return {
    ders: 'Matematik',
    tarih: '2026-08-10',
    resimId: `r-${veri.id}`,
    cozuldu: false,
    ...veri,
  }
}

const sorular: YanlisSoru[] = [
  soru({ id: '1', ders: 'Matematik', tarih: '2026-08-10' }),
  soru({ id: '2', ders: 'matematik', tarih: '2026-08-12' }),
  soru({ id: '3', ders: 'Fizik', tarih: '2026-08-11' }),
  soru({ id: '4', ders: 'Kimya', tarih: '2026-08-09', cozuldu: true }),
  soru({ id: '5', ders: 'Matematik', tarih: '2026-08-08', cozuldu: true }),
]

describe('bankaOzeti', () => {
  it('toplam, bekleyen ve çözüleni sayar', () => {
    expect(bankaOzeti(sorular)).toEqual({ toplam: 5, bekleyen: 3, cozulen: 2 })
  })

  it('boş listede sıfırlar', () => {
    expect(bankaOzeti([])).toEqual({ toplam: 0, bekleyen: 0, cozulen: 0 })
  })
})

describe('derslereGore', () => {
  it('çoktan aza sıralar', () => {
    const dagilim = derslereGore(sorular)
    expect(dagilim[0]).toEqual({ ders: 'Matematik', sayi: 3 })
    expect(dagilim.map((d) => d.sayi)).toEqual([3, 1, 1])
  })

  /** Büyük/küçük harf farkı iki ayrı ders sekmesi açmamalı. */
  it('yazım farkını tek ders sayar', () => {
    const dagilim = derslereGore([
      soru({ id: 'a', ders: 'FİZİK' }),
      soru({ id: 'b', ders: 'fizik' }),
    ])
    expect(dagilim).toHaveLength(1)
    expect(dagilim[0].sayi).toBe(2)
  })

  it('eşit sayıda olanları alfabetik sıralar', () => {
    const dagilim = derslereGore([
      soru({ id: 'a', ders: 'Tarih' }),
      soru({ id: 'b', ders: 'Coğrafya' }),
    ])
    expect(dagilim.map((d) => d.ders)).toEqual(['Coğrafya', 'Tarih'])
  })
})

describe('bankaSuz', () => {
  it('bekleyen sekmesinde çözülenler görünmez', () => {
    const liste = bankaSuz(sorular, { sekme: 'bekleyen' })
    expect(liste.map((s) => s.id)).toEqual(['2', '3', '1'])
  })

  it('çözülen sekmesi yalnızca işaretlileri verir', () => {
    const liste = bankaSuz(sorular, { sekme: 'cozulen' })
    expect(liste.map((s) => s.id)).toEqual(['4', '5'])
  })

  it('ders süzgeci yazım farkına takılmaz', () => {
    const liste = bankaSuz(sorular, { sekme: 'bekleyen', ders: 'MATEMATİK' })
    expect(liste.map((s) => s.id)).toEqual(['2', '1'])
  })

  it('ders boşsa süzme yapılmaz', () => {
    expect(bankaSuz(sorular, { sekme: 'bekleyen', ders: '' })).toHaveLength(3)
  })

  /** Aynı gün eklenen sorularda sıra kararlı olmalı, yoksa liste kendiliğinden oynar. */
  it('aynı tarihli sorularda sıra kararlı', () => {
    const ayniGun = [
      soru({ id: 'a', tarih: '2026-08-10' }),
      soru({ id: 'b', tarih: '2026-08-10' }),
    ]
    expect(bankaSuz(ayniGun, { sekme: 'bekleyen' }).map((s) => s.id)).toEqual(['b', 'a'])
  })
})

describe('gecerliDers', () => {
  const dersler = derslereGore(sorular)

  it('listede olan ders korunur', () => {
    expect(gecerliDers('Fizik', dersler)).toBe('Fizik')
  })

  /**
   * Gerileme koruması: bir dersin son sorusu çözüldü işaretlenince o ders
   * listeden düşer. Süzgeç eski değerde kalsaydı ekran boş görünür, kullanıcı
   * sorularının silindiğini sanırdı.
   */
  it('listeden düşen ders Tümü’ye iner', () => {
    expect(gecerliDers('Biyoloji', dersler)).toBe('')
  })

  it('Tümü zaten geçerli', () => {
    expect(gecerliDers('', dersler)).toBe('')
  })
})
