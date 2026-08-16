import { describe, expect, it } from 'vitest'
import { elenenSoruSayisi, yedegiDogrula, yedekOlustur } from './depo'
import type { Yedek } from './types'

const bos: Omit<Yedek, 'uygulama' | 'surum' | 'tarih'> = {
  denemeler: [],
  sablonlar: [],
  okulDersleri: [],
  gecmisYillar: [],
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
  it('kimliksiz geçmiş yıllara kimlik verir', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      gecmisYillar: [
        { sinif: 9, ortalama: 93.2 },
        { sinif: 10, ortalama: 94.1 },
      ],
    })

    const kimlikler = yedek.gecmisYillar.map((y) => y.id)
    expect(kimlikler.every(Boolean)).toBe(true)
    expect(new Set(kimlikler).size).toBe(2)
  })

  it('var olan kimliği korur', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      gecmisYillar: [{ id: 'abc', sinif: 9, ortalama: 90 }],
    })
    expect(yedek.gecmisYillar[0].id).toBe('abc')
  })

  /** Eski şemadan gelen ders, dönem alanları eksik olsa da hesaba girebilmeli. */
  it('eksik dönem alanlarını doldurur', () => {
    const yedek = coz({
      ...yedekOlustur(bos),
      okulDersleri: [{ id: 'd1', ad: 'Matematik', haftalikSaat: 6 }],
    })
    const ders = yedek.okulDersleri[0]
    expect(ders.projeVar).toBe(false)
    expect(ders.donem1).toEqual({
      yazili1: null,
      yazili2: null,
      sozlu1: null,
      sozlu2: null,
      proje: null,
    })
    expect(ders.donem2).toBeDefined()
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
