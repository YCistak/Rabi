import { describe, expect, it } from 'vitest'
import {
  ISLEM_ADI,
  ISLEM_ORNEGI,
  TUM_ISLEMLER,
  islemTuruHazirla,
  usYaz,
  type IslemSorusu,
  type IslemTuru,
} from './islem'

/**
 * Ekranda görünen ifadeyi hesaplar.
 *
 * Testin asıl işi bu: üreteç `sonuc` alanını kendi hesaplıyor, ama oyuncu
 * **metni** görüyor. İkisi ayrışırsa (örneğin metinde "12 × 24" yazıp sonucu
 * 12×25 hesaplarsak) oyun sessizce yanlış cevap ister. Metni bağımsız
 * hesaplamak bu ayrışmayı yakalar.
 */
function ifadeyiHesapla(metin: string): number {
  const carpanlar = metin.split(' · ').map(terimiHesapla)
  if (carpanlar.length > 1) return carpanlar.reduce((t, s) => t * s, 1)

  const ikili = metin.match(/^(\d+) ([+−×÷]) (\d+)$/)
  if (ikili) {
    const [, sol, islec, sag] = ikili
    const a = Number(sol)
    const b = Number(sag)
    if (islec === '+') return a + b
    if (islec === '−') return a - b
    if (islec === '×') return a * b
    return a / b
  }

  return terimiHesapla(metin)
}

const US_RAKAMLARI = '⁰¹²³⁴⁵⁶⁷⁸⁹'

/** Tek terim: "√144", "2³" ya da düz sayı. */
function terimiHesapla(terim: string): number {
  if (terim.startsWith('√')) return Math.sqrt(Number(terim.slice(1)))

  const uslu = terim.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)
  if (uslu) {
    const us = Number([...uslu[2]].map((k) => US_RAKAMLARI.indexOf(k)).join(''))
    return Number(uslu[1]) ** us
  }

  return Number(terim)
}

/** Sabit sıra üreten sahte rastgele — testler tekrarlanabilir olsun. */
function sahteRastgele(degerler: number[]): () => number {
  let sira = 0
  return () => degerler[sira++ % degerler.length]
}

/** Her türden bol miktarda soru — istatistiksel iddialar için. */
function bolSoru(turler: IslemTuru[] = TUM_ISLEMLER, adet = 400): IslemSorusu[] {
  return islemTuruHazirla(turler, adet)
}

describe('usYaz', () => {
  it('çok basamaklı üssü de yazar', () => {
    expect(usYaz(3)).toBe('³')
    expect(usYaz(10)).toBe('¹⁰')
  })
})

describe('islemTuruHazirla', () => {
  it('istenen kadar soru üretir', () => {
    expect(islemTuruHazirla(TUM_ISLEMLER, 50)).toHaveLength(50)
  })

  it('ekrandaki ifade ile beklenen sonuç her zaman uyuşur', () => {
    for (const soru of bolSoru()) {
      expect(ifadeyiHesapla(soru.metin), soru.metin).toBe(soru.sonuc)
    }
  })

  it('bütün sonuçlar negatif olmayan tam sayı', () => {
    // Tuş takımında eksi ve virgül yok; ondalıklı ya da eksi bir sonuç
    // yazılamaz, soru cevapsız kalırdı.
    for (const soru of bolSoru()) {
      expect(Number.isInteger(soru.sonuc), soru.metin).toBe(true)
      expect(soru.sonuc, soru.metin).toBeGreaterThanOrEqual(0)
    }
  })

  it('sonuçlar zihinden hesaplanabilir aralıkta kalıyor', () => {
    for (const soru of bolSoru()) {
      expect(soru.sonuc, soru.metin).toBeLessThanOrEqual(2000)
    }
  })

  it('yalnızca seçilen türlerden soru gelir', () => {
    const turler = bolSoru(['carpma', 'bolme'], 200).map((s) => s.tur)
    expect(new Set(turler)).toEqual(new Set(['carpma', 'bolme']))
  })

  it('hiç tür seçilmemişse hepsini kullanır', () => {
    // Arayüz son türün çıkarılmasını engelliyor ama bozuk bir kayıt boş dizi
    // getirebilir; oyun o durumda soru üretemeyip donmamalı.
    expect(islemTuruHazirla([], 30)).toHaveLength(30)
  })

  it('bölme her zaman tam bölünür', () => {
    for (const soru of bolSoru(['bolme'], 200)) {
      const [bolunen, bolen] = soru.metin.split(' ÷ ').map(Number)
      expect(bolunen % bolen, soru.metin).toBe(0)
    }
  })

  it('çıkarmada sonuç eksiye düşmez', () => {
    for (const soru of bolSoru(['cikarma'], 200)) {
      const [buyuk, kucuk] = soru.metin.split(' − ').map(Number)
      expect(buyuk, soru.metin).toBeGreaterThan(kucuk)
    }
  })

  it('köklü sorularda kök tam çıkar', () => {
    for (const soru of bolSoru(['koklu'], 200)) {
      for (const terim of soru.metin.split(' · ')) {
        const icerik = Number(terim.slice(1))
        expect(Number.isInteger(Math.sqrt(icerik)), soru.metin).toBe(true)
      }
    }
  })

  it('yakın sorular tekrarlanmıyor', () => {
    // Aynı işlem arka arkaya gelseydi ikincisi hesap değil hatırlama olurdu.
    const sorular = bolSoru(TUM_ISLEMLER, 200)
    for (let i = 1; i < sorular.length; i++) {
      const pencere = sorular.slice(Math.max(0, i - 12), i).map((s) => s.metin)
      expect(pencere, sorular[i].metin).not.toContain(sorular[i].metin)
    }
  })

  it('az çeşit üreten tür seçilse bile sonsuz döngüye girmez', () => {
    // Yalnızca köklü seçilirse üretilebilecek farklı soru sayısı sınırlı;
    // istenen adet karşılanamasa da fonksiyon dönmeli.
    const sorular = islemTuruHazirla(['koklu'], 5000, sahteRastgele([0.1, 0.5, 0.9]))
    expect(sorular.length).toBeGreaterThan(0)
    expect(sorular.length).toBeLessThanOrEqual(5000)
  })

  it('seçilen tek tür de tur doldurmaya yeter', () => {
    for (const tur of TUM_ISLEMLER) {
      expect(islemTuruHazirla([tur], 60), tur).toHaveLength(60)
    }
  })
})

describe('etiketler', () => {
  it('her tür için ad ve örnek var', () => {
    for (const tur of TUM_ISLEMLER) {
      expect(ISLEM_ADI[tur]).toBeTruthy()
      expect(ISLEM_ORNEGI[tur]).toBeTruthy()
    }
  })

  it('örnekler gerçekten o türün üretebileceği ifadeler', () => {
    // Seçim ekranındaki örnek yanıltıcı olmasın: hepsi hesaplanabilir olmalı.
    for (const tur of TUM_ISLEMLER) {
      expect(Number.isInteger(ifadeyiHesapla(ISLEM_ORNEGI[tur])), tur).toBe(true)
    }
  })
})
