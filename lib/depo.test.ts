import { describe, expect, it } from 'vitest'
import { elenenSoruSayisi, yedegiDogrula, yedekOlustur } from './depo'
import type { Yedek } from './types'

const bos: Omit<Yedek, 'uygulama' | 'surum' | 'tarih'> = {
  denemeler: [],
  sablonlar: [],
  okulYillari: [],
  gunlukKayitlar: [],
  devamsizlik: [],
  yanlisSorular: [],
  rozetler: [],
  hedef: null,
  ayarlar: {
    varsayilanSablonId: 'okul',
    buYilSinif: 12,
    sinifYili: 2026,
    puanTuru: 'ea',
    gunlukHedef: 200,
    hatirlatmaSaati: 20,
    bildirimAcik: false,
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
