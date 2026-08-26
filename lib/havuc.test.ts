import { describe, expect, it } from 'vitest'
import {
  BANKA_ODULU,
  BANKA_ODUL_TAVANI,
  ODAK_CEZASI,
  ODULLU_SORU,
  bankaOdulu,
  cezaDus,
} from './havuc'
import { JOKERLER } from './magaza/jokerler'
import { TOPLAM_HAVUC } from './seviye'

describe('cezaDus', () => {
  it('bakiyeden düşüyor', () => {
    expect(cezaDus(500, ODAK_CEZASI)).toEqual({ havuc: 500 - ODAK_CEZASI, dusen: ODAK_CEZASI })
  })

  /* Bakiyesi 10 olan kullanıcıya "120 havuç gitti" demek yalan olurdu. */
  it('yetmeyen bakiyede yalnızca kalanı alıyor', () => {
    expect(cezaDus(10, ODAK_CEZASI)).toEqual({ havuc: 0, dusen: 10 })
  })

  it('bakiyeyi eksiye düşürmüyor', () => {
    expect(cezaDus(0, ODAK_CEZASI).havuc).toBe(0)
    expect(cezaDus(-50, ODAK_CEZASI).havuc).toBe(0)
  })

  it('bozuk sayıyı tamsayıya indiriyor', () => {
    expect(cezaDus(10.9, 3.7)).toEqual({ havuc: 7, dusen: 3 })
  })
})

describe('bankaOdulu', () => {
  it('düşen soru başına ödüyor', () => {
    expect(bankaOdulu(0, 1)).toBe(BANKA_ODULU)
    expect(bankaOdulu(4, 7)).toBe(3 * BANKA_ODULU)
  })

  it('sayaç ilerlemediyse ödemiyor', () => {
    expect(bankaOdulu(9, 9)).toBe(0)
    expect(bankaOdulu(9, 4)).toBe(0)
  })

  /* Tavan olmadan bankaya bilerek yanlış düşürüp düzelten biri havuç basardı. */
  it('ömür boyu tavanı aşmıyor', () => {
    expect(bankaOdulu(0, ODULLU_SORU)).toBe(BANKA_ODUL_TAVANI)
    expect(bankaOdulu(0, ODULLU_SORU * 10)).toBe(BANKA_ODUL_TAVANI)
    expect(bankaOdulu(ODULLU_SORU, ODULLU_SORU + 50)).toBe(0)
  })

  /* Tavana binen aralıkta yalnızca tavana kadarki kısım ödeniyor. */
  it('tavana binen aralığı kırpıyor', () => {
    expect(bankaOdulu(ODULLU_SORU - 2, ODULLU_SORU + 5)).toBe(2 * BANKA_ODULU)
  })

  it('tek tek ödemekle toptan ödemek aynı tutuyor', () => {
    let toplam = 0
    for (let i = 0; i < ODULLU_SORU * 2; i++) toplam += bankaOdulu(i, i + 1)
    expect(toplam).toBe(bankaOdulu(0, ODULLU_SORU * 2))
  })
})

/*
  Ekonominin dengesi. Ceza ve ödül `lib/seviye.ts` ile birlikte okunuyor: joker
  fiyatları ömür boyu kazanılan toplama **oranla** konuldu, tek başına değil.
*/
describe('denge', () => {
  /* Sayı elle yazılı çünkü ters yönde import döngüsü açardı; eşitliği bu test tutuyor. */
  it('odak cezası en ucuz jokerin fiyatı kadar', () => {
    expect(ODAK_CEZASI).toBe(Math.min(...JOKERLER.map((j) => j.fiyat)))
  })

  it('banka ödülü seviyenin yanında kalıyor, önüne geçmiyor', () => {
    expect(BANKA_ODUL_TAVANI).toBeLessThan(TOPLAM_HAVUC / 4)
  })
})
