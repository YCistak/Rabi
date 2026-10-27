import { describe, expect, it } from 'vitest'
import {
  EN_COK_KAYNAK,
  EN_UZUN_KAYNAK_ADI,
  kaynakAdiKirp,
  kaynakAdlandir,
  kaynakBittiMi,
  kaynakEkle,
  kaynakIlerlemesi,
  kaynaklariCoz,
  kaynakSil,
  konuIsaretle,
  siraliKaynaklar,
  uniteIlerlemesi,
  uniteIsaretle,
  varsayilanKaynakSinifi,
  type Kaynak,
} from './kaynak'
import { KAYNAK_SINIFLARI, dersAdi, kaynakDersleri, konuKimligi, uniteler } from './konular'

const ornek = (ek: Partial<Kaynak> = {}): Kaynak => ({
  id: 'a',
  ad: 'Fizik Soru Bankası',
  sinif: 10,
  ders: 'fizik',
  eklenme: '2026-10-27',
  bitenler: [],
  ...ek,
})

describe('konu listeleri', () => {
  it('her sınıfta sekiz ders var, hepsinin ünitesi ve konusu dolu', () => {
    for (const sinif of KAYNAK_SINIFLARI) {
      const dersler = kaynakDersleri(sinif)
      expect(dersler.map((d) => d.id), `${sinif}`).toEqual([
        'matematik', 'turkce', 'fizik', 'kimya', 'biyoloji', 'tarih', 'cografya', 'ingilizce',
      ])
      for (const ders of dersler) {
        const liste = uniteler(sinif, ders.id)
        expect(liste.length, `${sinif}-${ders.id}`).toBeGreaterThan(0)
        for (const unite of liste) expect(unite.konular.length, `${sinif}-${ders.id} ${unite.ad}`).toBeGreaterThan(0)
      }
    }
  })

  // Kimlik adından türüyor; aynı listede iki konu aynı kimliğe düşerse biri
  // işaretlenince öteki de işaretli görünür.
  it('bir kaynağın konu kimlikleri tekil ve boş değil', () => {
    for (const sinif of KAYNAK_SINIFLARI) {
      for (const ders of kaynakDersleri(sinif)) {
        const kimlikler = uniteler(sinif, ders.id).flatMap((u) => u.konular.map(konuKimligi))
        expect(kimlikler.every((k) => k.length > 0)).toBe(true)
        expect(new Set(kimlikler).size, `${sinif}-${ders.id}`).toBe(kimlikler.length)
      }
    }
  })

  it('kimlik Türkçe harfleri sadeleştirir', () => {
    expect(konuKimligi('Üslü ve Köklü Gösterimlerle İşlemler')).toBe('uslu-ve-koklu-gosterimlerle-islemler')
    expect(konuKimligi('Mustafa Kemal’in Hayatı (1881-1918)')).toBe('mustafa-kemal-in-hayati-1881-1918')
  })

  it('12. sınıf 2018 programının haritada olmayan konularını da taşır', () => {
    const ad = (ders: Parameters<typeof uniteler>[1]) => uniteler(12, ders).map((u) => u.ad)
    expect(ad('matematik')).toEqual([
      'Üstel ve Logaritmik Fonksiyonlar', 'Diziler', 'Trigonometri', 'Dönüşümler', 'Türev', 'İntegral',
      'Çemberin Analitik İncelenmesi',
    ])
    expect(ad('biyoloji')).toContain('Canlılarda Enerji Dönüşümleri')
    expect(ad('tarih')[0]).toBe('20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya')
    expect(dersAdi('tarih', 12)).toBe('İnkılap Tarihi')
    expect(dersAdi('tarih', 11)).toBe('Tarih')
  })
})

describe('kaynak kaydı', () => {
  it('ad boşlukları sadeleşir ve sınırda kesilir', () => {
    expect(kaynakAdiKirp('  Limit   AYT  ')).toBe('Limit AYT')
    expect(kaynakAdiKirp('x'.repeat(80))).toHaveLength(EN_UZUN_KAYNAK_ADI)
  })

  it('ekleme başa koyar, boş adı ve dolu listeyi reddeder', () => {
    const yeni = { id: 'b', ad: ' Kimya ', sinif: 9 as const, ders: 'kimya' as const, eklenme: '2026-10-27' }
    const liste = kaynakEkle([ornek()], yeni)
    expect(liste?.map((k) => k.id)).toEqual(['b', 'a'])
    expect(liste?.[0]).toMatchObject({ ad: 'Kimya', bitenler: [] })
    expect(kaynakEkle([], { ...yeni, ad: '   ' })).toBeNull()
    const dolu = Array.from({ length: EN_COK_KAYNAK }, (_, i) => ornek({ id: String(i) }))
    expect(kaynakEkle(dolu, yeni)).toBeNull()
  })

  it('tik açılır ve geri kaldırılır', () => {
    const acik = konuIsaretle([ornek()], 'a', 'basinc')
    expect(acik[0].bitenler).toEqual(['basinc'])
    expect(konuIsaretle(acik, 'a', 'basinc')[0].bitenler).toEqual([])
  })

  it('ünite toplu işaretlenir, hepsi işaretliyse toplu kalkar', () => {
    const unite = uniteler(10, 'fizik')[0]
    const kimlikler = unite.konular.map(konuKimligi)
    const yarim = [ornek({ bitenler: [kimlikler[0], 'baska'] })]
    const dolu = uniteIsaretle(yarim, 'a', unite)
    expect(uniteIlerlemesi(dolu[0], unite)).toEqual({ biten: kimlikler.length, toplam: kimlikler.length })
    expect(dolu[0].bitenler.filter((b) => b === kimlikler[0])).toHaveLength(1)
    expect(uniteIsaretle(dolu, 'a', unite)[0].bitenler).toEqual(['baska'])
  })

  it('ilerleme listede olmayan kimliği saymaz; hepsi bitince kaynak biter', () => {
    const tumu = uniteler(10, 'fizik').flatMap((u) => u.konular.map(konuKimligi))
    expect(kaynakIlerlemesi(ornek({ bitenler: ['yok-boyle-konu'] }))).toEqual({ biten: 0, toplam: tumu.length })
    const biten = ornek({ id: 'b', bitenler: tumu })
    expect(kaynakBittiMi(biten)).toBe(true)
    expect(siraliKaynaklar([biten, ornek()]).map((k) => k.id)).toEqual(['a', 'b'])
  })

  it('adlandırma yalnız adı değiştirir, silme yalnız o kaynağı siler', () => {
    const liste = [ornek(), ornek({ id: 'b' })]
    expect(kaynakAdlandir(liste, 'b', ' Yeni ')[1]).toMatchObject({ ad: 'Yeni', sinif: 10, ders: 'fizik' })
    expect(kaynakAdlandir(liste, 'b', '  ')).toBe(liste)
    expect(kaynakSil(liste, 'a').map((k) => k.id)).toEqual(['b'])
  })

  it('bozuk kayıtları süzer, tekrarlanan kimliği ve tiki tekler', () => {
    const ham = [
      ornek({ bitenler: ['x', 'x', 3 as unknown as string] }),
      ornek(),
      { ...ornek({ id: 'c' }), sinif: 8 },
      { ...ornek({ id: 'd' }), ders: 'felsefe' },
      { ...ornek({ id: 'e' }), ad: '  ' },
      null,
    ]
    const temiz = kaynaklariCoz(ham)
    expect(temiz.map((k) => k.id)).toEqual(['a'])
    expect(temiz[0].bitenler).toEqual(['x'])
    expect(kaynaklariCoz('bozuk')).toEqual([])
  })

  it('varsayılan sınıf: mezun 12, bilinmeyen 9', () => {
    expect(varsayilanKaynakSinifi(11)).toBe(11)
    expect(varsayilanKaynakSinifi(13)).toBe(12)
    expect(varsayilanKaynakSinifi(NaN)).toBe(9)
  })
})

describe('yedek', () => {
  it('kaynaklar yedekten süzülerek okunur, eski yedekte alan yoksa dokunulmaz', async () => {
    const { yedegiDogrula } = await import('../depo')
    const yeni = yedegiDogrula(JSON.stringify({ uygulama: 'rabi', kaynakTakibi: [ornek(), { id: 'bozuk' }] }))
    expect('yedek' in yeni && yeni.yedek.kaynakTakibi?.map((k) => k.id)).toEqual(['a'])
    const eski = yedegiDogrula(JSON.stringify({ uygulama: 'rabi' }))
    expect('yedek' in eski && eski.yedek.kaynakTakibi).toBeUndefined()
  })
})
