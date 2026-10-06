import { describe, expect, it, vi } from 'vitest'
import {
  ANAHTARLAR,
  ayarlariNormalize,
  elenenSoruSayisi,
  tumVeriyiSil,
  yedegiDogrula,
  yedegiUygula,
  yedekOlustur,
} from './depo'
import { TUR_ANAHTARLARI } from './tanitim'
import { ANIMASYON_ANAHTARI } from './tanitim-animasyonu'
import type { Yedek } from './types'

const bos: Omit<Yedek, 'uygulama' | 'surum' | 'tarih'> = {
  denemeler: [],
  sablonlar: [],
  okulYillari: [],
  gunlukKayitlar: [],
  devamsizlik: [],
  yanlisSorular: [],
  rozetler: [],
  oyunlar: {},
  oyunGecmisi: [],
  pomodoroGecmis: [],
  hedef: null,
  ayarlar: {
    varsayilanSablonId: 'okul',
    ad: 'Emre',
    buYilSinif: 12,
    elleObp: null,
    sinifYili: 2026,
    puanTuru: 'ea',
    gunlukHedef: 200,
    hatirlatmaSaati: 20,
    hatirlatmaDakikasi: 0,
    bildirimAcik: false,
    oyunSesi: true,
    oyunMuzigi: true,
  oyunMuzikTuru: 'mod' as const,
    kurulumTamamlandi: true,
  },
}

function coz(veri: unknown) {
  const sonuc = yedegiDogrula(JSON.stringify(veri))
  if ('hata' in sonuc) throw new Error(sonuc.hata)
  return sonuc.yedek
}

describe('yedegiDogrula', () => {
  it('Rabi yedeği olmayan dosyayı reddeder', () => {
    expect(yedegiDogrula(JSON.stringify({ uygulama: 'ortala' }))).toEqual({
      hata: 'Bu dosya Rabi yedeği değil.',
    })
  })

  it('bozuk JSON’u reddeder', () => {
    expect(yedegiDogrula('{ bu json değil')).toEqual({
      hata: 'Dosya geçerli bir JSON değil.',
    })
  })

  /**
   * Gerileme koruması: kimlik yalnızca liste anahtarı değil, silme ölçütü de.
   * Elle düzenlenmiş bir yedekte kimlikler boş kalsaydı, bir yılı silmek
   * hepsini birden silerdi.
   */
  it('kimliksiz okul yıllarına kimlik verir', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      okulYillari: [
        { sinif: 9, ortalama: 93.2 },
        { sinif: 10, ortalama: 94.1 },
      ],
    })

    const kimlikler = yedek.okulYillari.map((y) => y.id)
    expect(kimlikler.every(Boolean)).toBe(true)
    expect(new Set(kimlikler).size).toBe(2)
  })

  it('mini oyun istatistiklerini taşır', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      oyunlar: {
        yazim: {
          enIyiDogru: 23,
          oynananTur: 4,
          toplamDogru: 61,
          toplamYanlis: 9,
          hatasizTur: 1,
          sonTarih: '2026-08-17',
        },
      },
    })
    expect(yedek.oyunlar.yazim?.enIyiDogru).toBe(23)
    expect(yedek.oyunlar.yazim?.sonTarih).toBe('2026-08-17')
  })

  it('mini oyunları olmayan eski yedeği kabul eder', () => {
    const { oyunlar: _atilan, ...oyunsuz } = yedekOlustur(bos)
    expect(coz(oyunsuz).oyunlar).toEqual({})
  })

  /**
   * Bozuk sayı sessizce NaN'a dönüşseydi rozet eşiği hiç sağlanmaz, kullanıcı
   * kazandığı rozeti bir daha göremezdi.
   */
  it('bozuk mini oyun sayılarını sıfırlar', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      oyunlar: { yazim: { enIyiDogru: 'çok', oynananTur: -3, toplamDogru: null } },
    })
    expect(yedek.oyunlar.yazim).toEqual({
      enIyiDogru: 0,
      enIyiSeri: 0,
      oynananTur: 0,
      toplamDogru: 0,
      toplamYanlis: 0,
      hatasizTur: 0,
      sonTarih: '',
    })
  })

  it('var olan kimliği korur', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      okulYillari: [{ id: 'abc', sinif: 9, ortalama: 90 }],
    })
    expect(yedek.okulYillari[0].id).toBe('abc')
  })

  /**
   * Eski yedeklerde alan `gecmisYillar` adındaydı. Kullanıcı okul notlarını
   * yeniden girmek zorunda kalmasın diye o ad da okunuyor.
   */
  it('eski gecmisYillar alanını da okur', () => {
    const eski = { ...yedekOlustur(bos) } as Record<string, unknown>
    delete eski.okulYillari
    eski.gecmisYillar = [{ id: 'y9', sinif: 9, ortalama: 91 }]

    expect(coz(eski).okulYillari).toEqual([{ id: 'y9', sinif: 9, ortalama: 91 }])
  })

  /**
   * Dilim dönemindeki yedeklerde görevlerin `dilim`i var, `saat`i yok.
   * Görevler kaybolmadan saatsiz geri yükleniyor; dilimden saat uydurulmuyor.
   */
  it('dilimli eski görevleri saatsiz okur', () => {
    const eski = {
      ...yedekOlustur(bos),
      notlar: [
        { id: 'g1', gun: '2026-10-05', dilim: 'aksam', metin: 'etüt', kategori: 'tekrar', renk: 'mavi', sure: 60, bitti: false, yildiz: false },
      ],
    }
    const notlar = coz(eski).notlar!
    expect(notlar).toHaveLength(1)
    expect(notlar[0]).toMatchObject({ id: 'g1', metin: 'etüt', saat: null, sure: 60 })
    expect(notlar[0]).not.toHaveProperty('dilim')
  })

  it('sınıfı veya notu olmayan yıl kaydını atar', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      okulYillari: [
        { id: 'a', sinif: 9, ortalama: 90 },
        { id: 'b', sinif: 10 },
        { id: 'c', ortalama: 80 },
      ],
    })
    expect(yedek.okulYillari.map((y) => y.id)).toEqual(['a'])
  })

  it('kurulum tamamlanmış sayılır', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      ayarlar: { ...bos.ayarlar, kurulumTamamlandi: false },
    })
    expect(yedek.ayarlar.kurulumTamamlandi).toBe(true)
  })

  it('data: olmayan resim değerlerini atar', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      resimler: { a: 'data:image/jpeg;base64,AAA', b: 'https://kotu.example/x.jpg' },
    })
    expect(Object.keys(yedek.resimler ?? {})).toEqual(['a'])
  })

  it('resim alanı yoksa undefined kalır', () => {
    expect(coz(yedekOlustur(bos)).resimler).toBeUndefined()
  })

  it('konu takibini taşır ve bozuk alanlarını süzer', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      yksKonuTakibi: {
        surum: 1,
        konular: {
          'tyt-mat-uslu': { okul: '2026-10-01', bitti: '2026-10-04' },
          'tyt-mat-koklu': { soru: 'bozuk' },
        },
      },
    })
    expect(yedek.yksKonuTakibi).toEqual({
      surum: 1,
      konular: { 'tyt-mat-uslu': { okul: '2026-10-01', bitti: '2026-10-04' } },
    })
  })

  it('konu takibi olmayan eski yedekte alan undefined kalır', () => {
    expect(coz(yedekOlustur(bos)).yksKonuTakibi).toBeUndefined()
  })
})

describe('yedegiUygula — konu takibi', () => {
  function sahteDepo() {
    const depo = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => depo.get(k) ?? null,
      setItem: (k: string, v: string) => void depo.set(k, v),
      removeItem: (k: string) => void depo.delete(k),
      key: (i: number) => [...depo.keys()][i] ?? null,
      get length() { return depo.size },
    })
    return depo
  }

  it('yedekteki takibi yazar', () => {
    const depo = sahteDepo()
    const takip = { surum: 1 as const, konular: { 'tyt-mat-uslu': { bitti: '2026-10-04' } } }
    yedegiUygula({ ...yedekOlustur(bos), yksKonuTakibi: takip })
    vi.unstubAllGlobals()
    expect(JSON.parse(depo.get(ANAHTARLAR.yksKonuTakibi)!)).toEqual(takip)
  })

  it('eski yedek mevcut takibe dokunmaz', () => {
    const depo = sahteDepo()
    depo.set(ANAHTARLAR.yksKonuTakibi, '{"surum":1,"konular":{"a":{"okul":"2026-10-01"}}}')
    yedegiUygula(yedekOlustur(bos))
    vi.unstubAllGlobals()
    expect(depo.get(ANAHTARLAR.yksKonuTakibi)).toBe('{"surum":1,"konular":{"a":{"okul":"2026-10-01"}}}')
  })
})

describe('elenenSoruSayisi', () => {
  const soru = (id: string, resimId: string) => ({
    id,
    ders: 'Matematik',
    tarih: '2026-08-16',
    resimId,
    cozuldu: false,
  })

  it('fotoğrafsız yedekte hepsi elenir', () => {
    const yedek = yedekOlustur({ ...bos, yanlisSorular: [soru('1', 'r1'), soru('2', 'r2')] })
    expect(elenenSoruSayisi(yedek)).toBe(2)
  })

  it('fotoğrafı olanlar elenmez', () => {
    const yedek = yedekOlustur({
      ...bos,
      yanlisSorular: [soru('1', 'r1'), soru('2', 'r2')],
      resimler: { r1: 'data:image/jpeg;base64,AAA' },
    })
    expect(elenenSoruSayisi(yedek)).toBe(1)
  })
})

describe('ayarlariNormalize', () => {
  it('bozuk sınıfı (null/NaN) son sınıfa düşürür, sayıyı korur', () => {
    // NaN JSON'a `null` olarak yazılıyor; eski bir hata bunu kayda geçirmişti.
    expect(ayarlariNormalize({ buYilSinif: null as unknown as number }).buYilSinif).toBe(12)
    expect(ayarlariNormalize({ buYilSinif: Number.NaN }).buYilSinif).toBe(12)
    expect(ayarlariNormalize({ buYilSinif: 11 }).buYilSinif).toBe(11)
  })
})

describe('tumVeriyiSil', () => {
  it('tanıtım tur bayraklarını ve animasyon ayarını da siler', () => {
    const depo = new Map<string, string>()
    for (const k of [...Object.values(TUR_ANAHTARLARI), ANIMASYON_ANAHTARI, 'rabi-ayarlar']) depo.set(k, 'true')
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => depo.get(k) ?? null,
      setItem: (k: string, v: string) => void depo.set(k, v),
      removeItem: (k: string) => void depo.delete(k),
      key: (i: number) => [...depo.keys()][i] ?? null,
      get length() { return depo.size },
    })
    tumVeriyiSil()
    vi.unstubAllGlobals()
    expect(depo.size).toBe(0)
  })
})
