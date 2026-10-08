import { describe, expect, it } from 'vitest'
import { OYUN_ADIMLARI, demoVerileriTemizle, tanitimGecisi, type TanitimDurumu, type TanitimEylemi } from './tanitim'
import {
  SAYIM_ADIMI,
  gecisteEylemKarari,
  kuyrugaEkle,
  kuyruktanCikar,
  rehberAnahtari,
  rehberGizliMi,
  sayimKorumasiGerekli,
  tanitimGeriKarari,
} from './tanitim-rehber'

const sira = (kimlik: string) => OYUN_ADIMLARI.findIndex((adim) => adim.kimlik === kimlik)

describe('rehber gizliliği adıma bağlı', () => {
  it('yalnız gizlendiği adımda gizli kalır', () => {
    const anahtar = rehberAnahtari('oyunlar', sira('oyun-baslat'))
    expect(rehberGizliMi(anahtar, rehberAnahtari('oyunlar', sira('oyun-baslat')))).toBe(true)
    // Geri tuşu adımı Hazırlık'a döndürdüyse rehber kendiliğinden görünür.
    expect(rehberGizliMi(anahtar, rehberAnahtari('oyunlar', sira('zorluk')))).toBe(false)
    // Sayım bitip soruya geçilince de.
    expect(rehberGizliMi(anahtar, rehberAnahtari('oyunlar', sira('soru-bir')))).toBe(false)
  })

  it('tur bitince ya da başka tur başlayınca gizli kalmaz', () => {
    const anahtar = rehberAnahtari('oyunlar', 2)
    expect(rehberGizliMi(anahtar, rehberAnahtari(null, null))).toBe(false)
    expect(rehberGizliMi(anahtar, rehberAnahtari('ana_tur', 2))).toBe(false)
    expect(rehberGizliMi(null, rehberAnahtari('oyunlar', 2))).toBe(false)
  })
})

describe('geri tuşu kararı', () => {
  const temel = { tanitimdaMi: true, rehberGizli: false, adimKimligi: 'zorluk', katmanVar: false }

  it('geri sayım sürerken tuş yutulur, açık katman olsa da', () => {
    expect(tanitimGeriKarari({ ...temel, rehberGizli: true, adimKimligi: SAYIM_ADIMI })).toBe('yut')
    expect(tanitimGeriKarari({ ...temel, rehberGizli: true, adimKimligi: SAYIM_ADIMI, katmanVar: true })).toBe('yut')
  })

  it('rehber görünürken bir adım geri alınır', () => {
    expect(tanitimGeriKarari({ ...temel, adimKimligi: SAYIM_ADIMI })).toBe('adim-geri')
    expect(tanitimGeriKarari(temel)).toBe('adim-geri')
  })

  it('Okut açıkken (rehber gizli, katman var) önce katman kapanır', () => {
    expect(tanitimGeriKarari({ ...temel, rehberGizli: true, adimKimligi: 'deneme-okut', katmanVar: true })).toBe('katman')
    // Katman yoksa tuş kilitlenmez: adım geri.
    expect(tanitimGeriKarari({ ...temel, rehberGizli: true, adimKimligi: 'deneme-okut' })).toBe('adim-geri')
  })

  it('tur yokken uygulamanın kendi sırası', () => {
    expect(tanitimGeriKarari({ ...temel, tanitimdaMi: false, rehberGizli: true, adimKimligi: null })).toBe('normal')
  })
})

describe('sayım koruması', () => {
  it('yalnız sayım adımında rehber gizliyken kurulur', () => {
    expect(sayimKorumasiGerekli({ rehberGizli: true, adimKimligi: SAYIM_ADIMI })).toBe(true)
    expect(sayimKorumasiGerekli({ rehberGizli: false, adimKimligi: SAYIM_ADIMI })).toBe(false)
    expect(sayimKorumasiGerekli({ rehberGizli: true, adimKimligi: 'deneme-okut' })).toBe(false)
  })

  it('korumanın gönderdiği geri, turu Hazırlık’a ve temiz demoya döndürür', () => {
    const durum: TanitimDurumu = { ...demoVerileriTemizle(), aktifTur: 'oyunlar', aktifAdim: sira(SAYIM_ADIMI) }
    const sonra = tanitimGecisi(durum, { tur: 'geri', beklenenTur: 'oyunlar', beklenenAdim: sira(SAYIM_ADIMI) })
    expect(OYUN_ADIMLARI[sonra.aktifAdim!].kimlik).toBe('zorluk')
    expect(sonra.demo.sonuc).toBeNull()
  })
})

describe('geçiş sürerken gelen eylemler', () => {
  it('kullanıcı dokunuşları düşer (çift dokunuş koruması)', () => {
    expect(gecisteEylemKarari({ tur: 'ileri' })).toBe('dusur')
    expect(gecisteEylemKarari({ tur: 'geri' })).toBe('dusur')
    expect(gecisteEylemKarari({ tur: 'hedefe-dokun', hedef: 'demo-oyun' })).toBe('dusur')
    expect(gecisteEylemKarari({ tur: 'hedefe-dokun', hedef: 'araclar-ac' })).toBe('dusur')
  })

  it('oyundan ve formdan gelen olaylar sıraya alınır', () => {
    expect(gecisteEylemKarari({ tur: 'hedefe-dokun', hedef: 'demo-baslat' })).toBe('kuyruk')
    expect(gecisteEylemKarari({ tur: 'oyun-bitti', dogru: 1, yanlis: 0 })).toBe('kuyruk')
    expect(gecisteEylemKarari({ tur: 'kayit-eklendi', kayit: 'soru' })).toBe('kuyruk')
  })

  it('aynı olay sıraya iki kez girmez', () => {
    const bas: TanitimEylemi = { tur: 'hedefe-dokun', hedef: 'demo-baslat' }
    const bitti: TanitimEylemi = { tur: 'oyun-bitti', dogru: 1, yanlis: 0 }
    let kuyruk = kuyrugaEkle([], bas)
    kuyruk = kuyrugaEkle(kuyruk, { ...bas })
    kuyruk = kuyrugaEkle(kuyruk, bitti)
    expect(kuyruk).toHaveLength(2)
  })

  it('sıradan çıkan olay geçişten sonraki adımda işlenir, tur denetimi kalır', () => {
    const eylem = kuyruktanCikar({ tur: 'hedefe-dokun', hedef: 'demo-baslat', beklenenAdim: sira('zorluk'), beklenenTur: 'oyunlar' })
    expect('beklenenAdim' in eylem).toBe(false)
    expect(eylem.beklenenTur).toBe('oyunlar')
    // Geçiş bitince adım "Başlat"ta: olay turu soruya geçirir.
    const durum: TanitimDurumu = { ...demoVerileriTemizle(), aktifTur: 'oyunlar', aktifAdim: sira(SAYIM_ADIMI) }
    expect(OYUN_ADIMLARI[tanitimGecisi(durum, eylem).aktifAdim!].kimlik).toBe('soru-bir')
    // Tur bu arada bittiyse olay yok sayılır.
    expect(tanitimGecisi(demoVerileriTemizle(), eylem)).toEqual(demoVerileriTemizle())
  })
})
