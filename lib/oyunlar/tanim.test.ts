import { describe, expect, it } from 'vitest'
import { OYUN_KIMLIKLERI } from './banka'
import type { OyunIstatistigi, OyunKayitlari } from '../types'
import { DERSLER, OYUNLAR, istatistikAl, oyunBul, oyunToplami } from './tanim'
import { BOS_ISTATISTIK, istatistigiGuncelle, istatistigiTamamla } from './tur'

const tam: OyunIstatistigi = {
  enIyiDogru: 12,
  enIyiSeri: 7,
  oynananTur: 3,
  toplamDogru: 25,
  toplamYanlis: 4,
  hatasizTur: 1,
  sonTarih: '2026-08-17',
}

/**
 * Kayıtlar localStorage'dan ham JSON olarak okunuyor; sürüm yükseltmesinde
 * eklenen alanlar eski kayıtlarda **yok**. Bu, yaşanmış bir hatanın gerileme
 * koruması: `enIyiSeri` eklendiğinde ekranda "En iyi seri: NaN" çıktı ve NaN
 * bütün eşik karşılaştırmalarını sessizce false yaptığı için seri rozeti hiç
 * gelmeyecekti.
 */
const eksikKayit = {
  enIyiDogru: 9,
  oynananTur: 2,
  toplamDogru: 14,
  toplamYanlis: 3,
  hatasizTur: 0,
  sonTarih: '2026-08-16',
} as OyunIstatistigi

describe('oyun listesi', () => {
  it('her oyunun kimliği benzersiz', () => {
    expect(new Set(OYUNLAR.map((o) => o.id)).size).toBe(OYUNLAR.length)
  })

  it('her oyunun adı, simgesi ve anlatımı var', () => {
    for (const oyun of OYUNLAR) {
      expect(oyun.ad, oyun.id).toBeTruthy()
      expect(oyun.ikon, oyun.id).toBeTruthy()
      expect(oyun.nasilOynanir.length, oyun.id).toBeGreaterThan(2)
    }
  })

  it('kimlikten oyunu bulur', () => {
    expect(oyunBul('edebiyat').ad).toBe('Edebiyat Eşleştirme')
  })
})

describe('istatistigiTamamla', () => {
  it('eksik alanları sıfırla doldurur', () => {
    expect(istatistigiTamamla(eksikKayit).enIyiSeri).toBe(0)
    expect(istatistigiTamamla(eksikKayit).enIyiDogru).toBe(9)
  })

  it('kayıt hiç yoksa boş istatistik verir', () => {
    expect(istatistigiTamamla(undefined)).toEqual(BOS_ISTATISTIK)
  })

  it('eksik alanlı kayda tur eklenince NaN üretmez', () => {
    const sonuc = istatistigiGuncelle(eksikKayit, {
      dogru: 5,
      yanlis: 1,
      hatasiz: false,
      enIyiSeri: 3,
    }, '2026-08-17')
    expect(sonuc.enIyiSeri).toBe(3)
    expect(Object.values(sonuc).some((d) => typeof d === 'number' && Number.isNaN(d))).toBe(false)
  })
})

describe('oyunToplami', () => {
  it('bütün oyunları toplar, en iyileri seçer', () => {
    const kayitlar: OyunKayitlari = {
      yazim: tam,
      islem: { ...tam, enIyiDogru: 20, enIyiSeri: 4, oynananTur: 1, toplamDogru: 20 },
    }
    const toplam = oyunToplami(kayitlar)
    expect(toplam.oynananTur).toBe(4)
    expect(toplam.toplamDogru).toBe(45)
    expect(toplam.enIyiDogru).toBe(20)
    expect(toplam.enIyiSeri).toBe(7)
    expect(toplam.denenenOyun).toBe(2)
  })

  it('eksik alanlı eski kayıtta NaN üretmez', () => {
    const toplam = oyunToplami({ yazim: eksikKayit, islem: tam })
    for (const [ad, deger] of Object.entries(toplam)) {
      expect(Number.isNaN(deger), ad).toBe(false)
    }
    expect(toplam.enIyiSeri).toBe(7)
    expect(toplam.toplamDogru).toBe(39)
  })

  it('kayıt yoksa hepsi sıfır', () => {
    expect(oyunToplami({})).toEqual({
      oynananTur: 0,
      toplamDogru: 0,
      hatasizTur: 0,
      enIyiDogru: 0,
      enIyiSeri: 0,
      denenenOyun: 0,
    })
  })
})

describe('istatistikAl', () => {
  it('oynanmamış oyun için boş istatistik verir', () => {
    expect(istatistikAl({ yazim: tam }, 'edebiyat')).toEqual(BOS_ISTATISTIK)
  })

  it('eksik alanlı kaydı tamamlayarak verir', () => {
    expect(istatistikAl({ yazim: eksikKayit }, 'yazim').enIyiSeri).toBe(0)
  })
})

describe('oyun listesi bütünlüğü', () => {
  /**
   * `OYUN_KIMLIKLERI` bankanın tarafında, `OYUNLAR` oyun tanımlarının
   * tarafında duruyor. İkisi ayrışırsa oyun ya bankada görünmez ya da
   * bankada görünüp ekranı olmaz — dördüncü oyun eklenirken tam bu oldu.
   */
  it('tanımlı oyunlarla banka kimlikleri örtüşüyor', () => {
    expect([...OYUN_KIMLIKLERI].sort()).toEqual(OYUNLAR.map((o) => o.id).sort())
  })

  it('her oyunun dersi tanımlı bir ders', () => {
    const dersler = new Set(DERSLER.map((d) => d.id))
    for (const oyun of OYUNLAR) {
      expect(dersler.has(oyun.ders), `${oyun.id} → ${oyun.ders}`).toBe(true)
    }
  })

  it('her oyun tam olarak bir kez listeleniyor', () => {
    const kimlikler = OYUNLAR.map((o) => o.id)
    expect(new Set(kimlikler).size).toBe(kimlikler.length)
  })
})
