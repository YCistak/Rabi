import { describe, expect, it } from 'vitest'
import { hafizaKur, siklariDiz } from './sik-dizilimi'

const kimlik = (s: string) => s

describe('siklariDiz', () => {
  it('şıkların hepsini bir kez döndürüyor', () => {
    const hafiza = hafizaKur()
    for (let i = 0; i < 50; i++) {
      const dizilim = siklariDiz(['a', 'b', 'c', 'd'], kimlik, Math.random, hafiza)
      expect([...dizilim].sort()).toEqual(['a', 'b', 'c', 'd'])
    }
  })

  it('tek şıkkı olduğu gibi bırakıyor', () => {
    expect(siklariDiz(['tek'], kimlik, Math.random, hafizaKur())).toEqual(['tek'])
  })

  /*
    Asıl kural bu: aynı küme art arda aynı sırayla gelmiyor. İki şıkta rastgele
    karıştırma bunu yarı yarıya ihlal ederdi ve tekrar eden soru — havuz başa
    döndüğünde ya da Oyun Bankası turunda — soru olmaktan çıkardı.
  */
  it('aynı küme üst üste aynı dizilimle gelmiyor', () => {
    const hafiza = hafizaKur()
    let onceki = siklariDiz(['a', 'b'], kimlik, Math.random, hafiza).join('')
    for (let i = 0; i < 100; i++) {
      const simdiki = siklariDiz(['a', 'b'], kimlik, Math.random, hafiza).join('')
      expect(simdiki).not.toBe(onceki)
      onceki = simdiki
    }
  })

  it('dört şıkta da art arda aynı sıra çıkmıyor', () => {
    const hafiza = hafizaKur()
    let onceki = siklariDiz(['a', 'b', 'c', 'd'], kimlik, Math.random, hafiza).join('')
    for (let i = 0; i < 100; i++) {
      const simdiki = siklariDiz(['a', 'b', 'c', 'd'], kimlik, Math.random, hafiza).join('')
      expect(simdiki).not.toBe(onceki)
      onceki = simdiki
    }
  })

  it('iki şıkta doğru cevap iki tarafa da düşüyor', () => {
    const hafiza = hafizaKur()
    const ilkler = new Set<string>()
    for (let i = 0; i < 20; i++) ilkler.add(siklariDiz(['a', 'b'], kimlik, Math.random, hafiza)[0])
    expect(ilkler).toEqual(new Set(['a', 'b']))
  })

  /*
    Kayıt sıraya duyarsız bir anahtarla tutuluyor: aynı küme hangi sırayla
    verilirse verilsin aynı hafızayı bulmalı, yoksa çağıran taraf şıkları farklı
    sırada verdiğinde kural sessizce devre dışı kalırdı.
  */
  it('kümeyi ters sırayla vermek hafızayı şaşırtmıyor', () => {
    const hafiza = hafizaKur()
    const ilk = siklariDiz(['a', 'b'], kimlik, Math.random, hafiza)
    const ikinci = siklariDiz(['b', 'a'], kimlik, Math.random, hafiza)
    expect(ikinci.join('')).not.toBe(ilk.join(''))
  })

  it('farklı kümeler birbirinin kaydını bozmuyor', () => {
    const hafiza = hafizaKur()
    const ilk = siklariDiz(['a', 'b'], kimlik, Math.random, hafiza).join('')
    siklariDiz(['c', 'd'], kimlik, Math.random, hafiza)
    expect(siklariDiz(['a', 'b'], kimlik, Math.random, hafiza).join('')).not.toBe(ilk)
  })

  it('sabit üreteçle bile diziliş değişiyor', () => {
    // Testlerde `rastgele` sabitleniyor; karıştırma o zaman hep aynı sırayı
    // verir. Kaydırma tam da bunun için var.
    const hafiza = hafizaKur()
    const ilk = siklariDiz(['a', 'b', 'c'], kimlik, () => 0, hafiza).join('')
    const ikinci = siklariDiz(['a', 'b', 'c'], kimlik, () => 0, hafiza).join('')
    expect(ikinci).not.toBe(ilk)
  })

  it('verilen hafızaya yazıyor, ortak hafızaya değil', () => {
    const hafiza = hafizaKur()
    siklariDiz(['a', 'b'], kimlik, Math.random, hafiza)
    expect(hafiza.size).toBe(1)
  })
})
