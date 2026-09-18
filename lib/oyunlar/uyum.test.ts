import { describe, expect, it } from 'vitest'
import {
  BASLANGIC_ZORLUGU,
  DUSME_SERISI,
  YUKSELME_SERISI,
  uyumBasla,
  uyumIsle,
  type UyumDurumu,
} from './uyum'
import { ZORLUKLAR } from './ritim'

/** Arka arkaya `sayi` kadar aynı cevabı işler. */
function seri(durum: UyumDurumu, dogruMu: boolean, sayi: number): UyumDurumu {
  let sonuc = durum
  for (let i = 0; i < sayi; i++) sonuc = uyumIsle(sonuc, dogruMu)
  return sonuc
}

describe('uyumBasla', () => {
  it('seçim verilmeyince ortadan başlıyor', () => {
    expect(uyumBasla().zorluk).toBe(BASLANGIC_ZORLUGU)
    expect(ZORLUKLAR).toContain(BASLANGIC_ZORLUGU)
  })

  /*
    Varsayılan uçlarda değil: seçim yapılmamış turda uyum iki yöne de
    gidebilmeli, uçtan başlayan tur bir yönü hiç kullanamaz. Kullanıcı ucu
    **kendi** seçebiliyor — o zaman tek yön onun kararı.
  */
  it('varsayılan başlangıç uçlarda değil', () => {
    expect(BASLANGIC_ZORLUGU).not.toBe(ZORLUKLAR[0])
    expect(BASLANGIC_ZORLUGU).not.toBe(ZORLUKLAR[ZORLUKLAR.length - 1])
  })

  it('seçilen seviyeden başlıyor', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(uyumBasla(zorluk).zorluk, zorluk).toBe(zorluk)
      expect(uyumBasla(zorluk).seri, zorluk).toBe(0)
    }
  })
})

/*
  Seçim başlangıcı belirliyor, tavanı değil: uyum seçilen seviyenin üstünde
  de altında da çalışmaya devam ediyor. İkisinin birlikte yaşadığı yer burası —
  biri ötekini dondurursa bu testler kırılır.
*/
describe('seçim ile uyum birlikte', () => {
  it('kolay seçilse de yükselebiliyor', () => {
    expect(seri(uyumBasla('kolay'), true, YUKSELME_SERISI).zorluk).toBe('orta')
  })

  it('zor seçilse de düşebiliyor', () => {
    expect(seri(uyumBasla('zor'), false, DUSME_SERISI).zorluk).toBe('orta')
  })

  /* Uçta gidecek yer yok: seçim de olsa uyum da olsa liste taşmıyor. */
  it('seçilen uçtan dışarı çıkmıyor', () => {
    expect(seri(uyumBasla('zor'), true, YUKSELME_SERISI * 3).zorluk).toBe('zor')
    expect(seri(uyumBasla('kolay'), false, DUSME_SERISI * 3).zorluk).toBe('kolay')
  })
})

describe('uyumIsle', () => {
  it('eşiğe varmadan seviye değişmiyor', () => {
    expect(seri(uyumBasla(), true, YUKSELME_SERISI - 1).zorluk).toBe('orta')
    expect(seri(uyumBasla(), false, DUSME_SERISI - 1).zorluk).toBe('orta')
  })

  it('ardışık doğru yükseltiyor', () => {
    expect(seri(uyumBasla(), true, YUKSELME_SERISI).zorluk).toBe('zor')
  })

  it('ardışık yanlış düşürüyor', () => {
    expect(seri(uyumBasla(), false, DUSME_SERISI).zorluk).toBe('kolay')
  })

  /* Tek yanlış seriyi kesiyor: yoksa aradaki hatalar sayılmadan yükselinirdi. */
  it('araya giren yanlış doğru serisini sıfırlıyor', () => {
    let durum = seri(uyumBasla(), true, YUKSELME_SERISI - 1)
    durum = uyumIsle(durum, false)
    durum = seri(durum, true, YUKSELME_SERISI - 1)
    expect(durum.zorluk).toBe('orta')
  })

  /* Seviye değişince seri sıfırlanıyor: yeni seviyedeki ilk soru eskisinin
     serisinin devamı değil. */
  it('yükseldikten sonra tek doğruyla yeniden yükselmiyor', () => {
    const yukselen = seri(uyumBasla(), true, YUKSELME_SERISI)
    expect(yukselen.seri).toBe(0)
  })

  it('zorun üstü, kolayın altı yok', () => {
    expect(seri(uyumBasla(), true, 30).zorluk).toBe('zor')
    expect(seri(uyumBasla(), false, 30).zorluk).toBe('kolay')
  })

  /* Uçta seri sıfırlanmıyor; sıfırlansaydı zordaki oyuncu düşmeden önce
     fazladan bir yanlış hakkı kazanırdı. */
  it('uçtan dönüş eşik kadar ters cevapla oluyor', () => {
    const zorda = seri(uyumBasla(), true, 10)
    expect(seri(zorda, false, DUSME_SERISI).zorluk).toBe('orta')
  })

  it('düşme yükselmeden hızlı', () => {
    expect(DUSME_SERISI).toBeLessThan(YUKSELME_SERISI)
  })
})
