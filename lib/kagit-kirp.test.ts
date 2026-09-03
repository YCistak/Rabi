import { describe, expect, it } from 'vitest'
import { ceyrekDondur, kagidaKirp, kagidiBul, kirp, otsuEsigi } from './kagit-kirp'
import type { Gri } from './goruntu-esikle'

/** Verilen tondan düz görüntü. */
function duz(en: number, boy: number, ton: number): Gri {
  return { veri: new Uint8ClampedArray(en * boy).fill(ton), en, boy }
}

/** Koyu zemine açık bir dikdörtgen koyar. */
function kagitli(en: number, boy: number, alan: { x: number; y: number; en: number; boy: number }): Gri {
  const gri = duz(en, boy, 60)
  for (let y = alan.y; y < alan.y + alan.boy; y++) {
    for (let x = alan.x; x < alan.x + alan.en; x++) gri.veri[y * en + x] = 235
  }
  return gri
}

describe('otsu eşiği', () => {
  it('iki yığını doğru tarafa ayırıyor', () => {
    // Değerin kendisi değil, ayırdığı yer önemli: koyu yığın eşiğin altında,
    // açık yığın üstünde kalmalı ki kâğıt masadan ayrılsın.
    const gri = duz(20, 20, 50)
    gri.veri.fill(200, 200)
    const esik = otsuEsigi(gri)
    expect(50).toBeLessThanOrEqual(esik)
    expect(200).toBeGreaterThan(esik)
  })

  it('tek tonlu görüntüde çökmüyor', () => {
    expect(otsuEsigi(duz(10, 10, 128))).toBeGreaterThanOrEqual(0)
  })
})

describe('kâğıdı bulma', () => {
  it('masadaki kâğıdı buluyor', () => {
    const alan = kagidiBul(kagitli(400, 400, { x: 80, y: 60, en: 240, boy: 280 }))
    expect(alan).not.toBeNull()
    // Kenar payı içeri alıyor; sınırlar birkaç piksel içeride olabilir.
    expect(alan!.x).toBeGreaterThanOrEqual(80)
    expect(alan!.y).toBeGreaterThanOrEqual(60)
    expect(alan!.x + alan!.en).toBeLessThanOrEqual(320)
    expect(alan!.y + alan!.boy).toBeLessThanOrEqual(340)
  })

  it('kâğıt kareyi doldurunca kırpacak bir şey bulmuyor', () => {
    // Düz beyaz sayfada Otsu eşiği anlamsız; en büyük bölge tüm kare oluyor
    // ve kırpma yine tüm kareyi veriyor — yani hiçbir şey kaybolmuyor.
    const gri = kagidaKirp(duz(200, 200, 230))
    expect(gri.en * gri.boy).toBeGreaterThan(200 * 200 * 0.9)
  })

  it('kâğıt çok küçükse bulunmuş saymıyor', () => {
    // Karenin yüzde biri kadar parlak bir leke kâğıt değil; kırpsaydık
    // fotoğrafın tamamını atardık.
    expect(kagidiBul(kagitli(400, 400, { x: 10, y: 10, en: 40, boy: 40 }))).toBeNull()
  })
})

describe('kırpma', () => {
  it('istenen alanı kesiyor', () => {
    const gri: Gri = { veri: new Uint8ClampedArray([1, 2, 3, 4, 5, 6, 7, 8, 9]), en: 3, boy: 3 }
    const kesik = kirp(gri, { x: 1, y: 1, en: 2, boy: 2 })
    expect([...kesik.veri]).toEqual([5, 6, 8, 9])
  })
})

describe('çeyrek döndürme', () => {
  const gri: Gri = { veri: new Uint8ClampedArray([1, 2, 3, 4, 5, 6]), en: 3, boy: 2 }

  it('saat yönünde döndürüyor', () => {
    const donuk = ceyrekDondur(gri, 1)
    expect([donuk.en, donuk.boy]).toEqual([2, 3])
    expect([...donuk.veri]).toEqual([4, 1, 5, 2, 6, 3])
  })

  it('dört çeyrek başa dönüyor', () => {
    const donuk = ceyrekDondur(gri, 4)
    expect([donuk.en, donuk.boy]).toEqual([3, 2])
    expect([...donuk.veri]).toEqual([...gri.veri])
  })

  it('sıfır çeyrekte görüntüyü değiştirmiyor', () => {
    expect([...ceyrekDondur(gri, 0).veri]).toEqual([...gri.veri])
  })
})
