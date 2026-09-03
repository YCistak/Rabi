import { describe, expect, it } from 'vitest'
import {
  agirliklariCoz,
  OLCULER,
  PARAMETRE_SAYISI,
  SINIFLAR,
  tani,
  YAZI_DISI,
} from './karakter-tani'
import { AGIRLIKLAR } from './karakter-agirliklari'
import { KARE } from './karakter-ayir'

/** İstenen sayıda parametreyi base64 olarak paketler. */
function paketle(degerler: number[]): string {
  const dizi = Float32Array.from(degerler)
  const bayt = new Uint8Array(dizi.buffer)
  let metin = ''
  for (const b of bayt) metin += String.fromCharCode(b)
  return btoa(metin)
}

const { konv1Suzgec: S1, konv2Suzgec: S2, cekirdek: C } = OLCULER
const ADET = PARAMETRE_SAYISI

describe('ağırlık çözme', () => {
  it('katmanları doğru boyda ayırıyor', () => {
    const a = agirliklariCoz(paketle(Array.from({ length: ADET }, (_, i) => i)))
    expect(a.k1).toHaveLength(S1 * C * C)
    expect(a.b1).toHaveLength(S1)
    expect(a.k2).toHaveLength(S2 * S1 * C * C)
    expect(a.b2).toHaveLength(S2)
    expect(a.w).toHaveLength(SINIFLAR.length * S2 * 16)
    expect(a.b).toHaveLength(SINIFLAR.length)
  })

  it('katmanları sırayla okuyor', () => {
    const a = agirliklariCoz(paketle(Array.from({ length: ADET }, (_, i) => i)))
    expect(a.k1[0]).toBe(0)
    expect(a.b1[0]).toBe(S1 * C * C)
  })
})

describe('tanıma', () => {
  it('geçerli bir sınıf ve 0-1 arası güven veriyor', () => {
    const a = agirliklariCoz(paketle(Array.from({ length: ADET }, (_, i) => Math.sin(i) * 0.1)))
    const nokta = new Float32Array(KARE * KARE)
    for (let i = 0; i < nokta.length; i++) nokta[i] = i % 3 === 0 ? 1 : 0

    const tahmin = tani(nokta, a)
    expect(SINIFLAR).toContain(tahmin.sinif)
    expect(tahmin.guven).toBeGreaterThan(0)
    expect(tahmin.guven).toBeLessThanOrEqual(1)
  })

  it('yanlılık tek başına sınıfı belirleyebiliyor', () => {
    // Bütün ağırlıklar sıfır, yalnız son katmanın yanlılığı "9" sınıfında
    // yüksek: çıkış katmanının doğru yerden okunduğunu doğruluyor.
    const degerler = new Array(ADET).fill(0)
    degerler[ADET - SINIFLAR.length + 9] = 5
    const a = agirliklariCoz(paketle(degerler))

    expect(tani(new Float32Array(KARE * KARE), a).sinif).toBe('9')
  })

  it('boş girdide bile güven toplamı taşmıyor', () => {
    const degerler = new Array(ADET).fill(0)
    // Büyük puanlar üstel taşmaya yol açmamalı; en büyüğü çıkarma bunun için.
    degerler[ADET - 1] = 500
    const a = agirliklariCoz(paketle(degerler))

    const tahmin = tani(new Float32Array(KARE * KARE), a)
    expect(tahmin.sinif).toBe(YAZI_DISI)
    expect(Number.isFinite(tahmin.guven)).toBe(true)
  })
})

describe('paketteki ağırlıklar', () => {
  it('ağın ölçüleriyle uyuşuyor', () => {
    // Ağın biçimi değişip `scripts/taniyici-egit.mjs` yeniden
    // çalıştırılmazsa katmanlar kayıyor ve tanıyıcı çökmeden **kendinden emin
    // saçmalıyor**. Denetim burada duruyor ki hata cihazda değil testte çıksın.
    expect(() => agirliklariCoz(AGIRLIKLAR)).not.toThrow()
  })
})

describe('uymayan ağırlıklar', () => {
  it('sessizce kırpmıyor, hata veriyor', () => {
    expect(() => agirliklariCoz(paketle([1, 2, 3]))).toThrow()
  })
})
