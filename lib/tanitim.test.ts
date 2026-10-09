import { describe, expect, it } from 'vitest'
import { tanitimGeriKarari } from './tanitim-rehber'
import {
  DENEME_FORMU_ADIMLARI,
  DENEME_VAZGEC,
  GOREV_FORMU_ADIMLARI,
  GOREV_VAZGEC,
  ANA_TUR_SURUM_ANAHTARI,
  ANA_TUR_SURUMU,
  ESKI_ANA_TUR_ANAHTARI,
  HARITA_TUR_ADIMLARI,
  TANITIM_ADIMLARI,
  TUR_ADIMLARI,
  TUR_ANAHTARLARI,
  TUR_ETIKETLERI,
  demoSonucu,
  demoVerileriTemizle,
  gorevFormuTurdaAcik,
  gorevYazilabilir,
  miniTurSec,
  turBitisKayitlari,
  turGorulduOku,
  tanitimGecisi,
  tanitimKonumu,
  type MiniTurKonumu,
  type TanitimAdimi,
  type TanitimDurumu,
  type TanitimTuru,
} from './tanitim'

const TURLAR = Object.keys(TUR_ADIMLARI) as TanitimTuru[]
const MINI_TURLAR = TURLAR.filter((t) => t !== 'ana_tur')

/** Adımı kendi beklediği eylemle geçirir. */
function gec(durum: TanitimDurumu, adim: TanitimAdimi): TanitimDurumu {
  if (adim.kimlik === 'soru-bir') return tanitimGecisi(durum, { tur: 'oyun-bitti', dogru: 1, yanlis: 0 })
  if (adim.kayit) return tanitimGecisi(durum, { tur: 'kayit-eklendi', kayit: adim.kayit })
  if (adim.tiklamali) return tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: adim.hedef })
  return tanitimGecisi(durum, { tur: 'ileri' })
}

function adimaKadar(kimlik: string, turAdi: TanitimTuru = 'ana_tur'): TanitimDurumu {
  const adimlar = TUR_ADIMLARI[turAdi]
  let durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi })
  for (let sira = 0; sira < adimlar.length; sira++) {
    const adim = adimlar[durum.aktifAdim!]
    if (adim.kimlik === kimlik) return durum
    durum = gec(durum, adim)
  }
  throw new Error(`Adım bulunamadı: ${kimlik}`)
}

const kimlik = (d: TanitimDurumu) => TUR_ADIMLARI[d.aktifTur!][d.aktifAdim!].kimlik

describe('Ana tur kısa ve kritik akışta', () => {
  it('ana sayfa, soru ekleme, Konu Takibi, Harita; ardından deneme ekleme ve İstatistik', () => {
    expect(TANITIM_ADIMLARI.map((a) => a.kimlik)).toEqual([
      'sinav-hedefi', 'hedef', 'araclar-ac',
      'soru-ac', 'soru-ekle', 'soru-form', 'soru-kaydedildi',
      'konu-takibi-ac', 'konu-takibi', 'harita-ac', 'harita-ders', 'harita-soru',
      'deneme-ac', 'deneme-liste', 'deneme-ekle', 'deneme-okut', 'deneme-elle', 'deneme-yanlis', 'deneme-kaydet',
      'istatistik-ac', 'istatistik-tur', 'istatistik-son', 'istatistik-ilerleyen', 'istatistik-kutular', 'istatistik-karsilastir',
    ])
  })

  it('balon metinleri kısa (≤ 85 karakter)', () => {
    for (const adim of TANITIM_ADIMLARI) expect(adim.aciklama.length, adim.kimlik).toBeLessThanOrEqual(85)
  })

  it('Pomodoro, Yapılacaklar, Oyunlar ve Oyun Bankası ana turda yok; onlar mini turlarda', () => {
    const ana = new Set(TANITIM_ADIMLARI.map((a) => a.kimlik))
    // Denemeler ve İstatistik'in mini turları ana turu bu sürümden önce bitirmiş kullanıcı için duruyor.
    for (const tur of MINI_TURLAR.filter((t) => t !== 'denemeler' && t !== 'istatistik')) {
      for (const adim of TUR_ADIMLARI[tur]) expect(ana.has(adim.kimlik), adim.kimlik).toBe(false)
    }
  })

  it('her adım kendi sekmesinde ve ekranında geçiyor', () => {
    const bul = (k: string) => TANITIM_ADIMLARI.find((a) => a.kimlik === k)!
    for (const k of ['sinav-hedefi', 'hedef', 'araclar-ac']) expect(tanitimKonumu(bul(k)).sekme).toBe('ana')
    expect(tanitimKonumu(bul('soru-ac'))).toEqual({ sekme: 'daha', ekran: null, denemeFormu: false })
    for (const k of ['soru-ekle', 'soru-form', 'soru-kaydedildi']) expect(tanitimKonumu(bul(k))).toEqual({ sekme: 'daha', ekran: 'soru', denemeFormu: false })
    expect(tanitimKonumu(bul('konu-takibi-ac'))).toEqual({ sekme: 'daha', ekran: null, denemeFormu: false })
    expect(tanitimKonumu(bul('konu-takibi'))).toEqual({ sekme: 'daha', ekran: 'konu-takibi', denemeFormu: false })
    expect(tanitimKonumu(bul('harita-ac'))).toEqual({ sekme: 'daha', ekran: 'konu-takibi', denemeFormu: false })
    for (const k of HARITA_TUR_ADIMLARI) expect(tanitimKonumu(bul(k))).toEqual({ sekme: 'harita', ekran: null, denemeFormu: false })
    for (const k of ['deneme-ac', 'istatistik-ac']) expect(tanitimKonumu(bul(k))).toEqual({ sekme: 'daha', ekran: null, denemeFormu: false })
    for (const k of ['deneme-liste', 'deneme-ekle']) expect(tanitimKonumu(bul(k))).toEqual({ sekme: 'daha', ekran: 'deneme', denemeFormu: false })
    for (const k of DENEME_FORMU_ADIMLARI) expect(tanitimKonumu(bul(k))).toEqual({ sekme: 'daha', ekran: 'deneme', denemeFormu: true })
    for (const k of ['istatistik-tur', 'istatistik-son', 'istatistik-ilerleyen', 'istatistik-kutular', 'istatistik-karsilastir']) {
      expect(tanitimKonumu(bul(k))).toEqual({ sekme: 'daha', ekran: 'istatistik', denemeFormu: false })
    }
  })

  it('dokunma adımı yalnızca kendi hedefiyle geçiyor', () => {
    const araclar = adimaKadar('araclar-ac')
    expect(tanitimGecisi(araclar, { tur: 'ileri' })).toBe(araclar)
    expect(tanitimGecisi(araclar, { tur: 'hedefe-dokun', hedef: 'harita-ac' })).toBe(araclar)
    expect(kimlik(tanitimGecisi(araclar, { tur: 'hedefe-dokun', hedef: 'araclar-ac' }))).toBe('soru-ac')
    const soru = adimaKadar('soru-ac')
    expect(tanitimGecisi(soru, { tur: 'hedefe-dokun', hedef: 'arac-pomodoro' })).toBe(soru)
  })

  it('soru formu ancak soru kaydı eklenince ilerliyor', () => {
    const durum = adimaKadar('soru-form')
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'soru-formu' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'kayit-eklendi', kayit: 'gorev' })).toBe(durum)
    expect(kimlik(tanitimGecisi(durum, { tur: 'kayit-eklendi', kayit: 'soru' }))).toBe('soru-kaydedildi')
  })

  it('kaydedildi adımından geri, form kapalı "Soru ekle" adımına dönüyor', () => {
    expect(kimlik(tanitimGecisi(adimaKadar('soru-kaydedildi'), { tur: 'geri' }))).toBe('soru-ekle')
    expect(kimlik(tanitimGecisi(adimaKadar('soru-form'), { tur: 'geri' }))).toBe('soru-ekle')
    expect(kimlik(tanitimGecisi(adimaKadar('konu-takibi-ac'), { tur: 'geri' }))).toBe('soru-kaydedildi')
  })

  it('soru kaydından sonra Konu Takibi, ardından Harita’nın iki kitabı', () => {
    const takip = tanitimGecisi(adimaKadar('konu-takibi-ac'), { tur: 'hedefe-dokun', hedef: 'arac-konu-takibi' })
    expect(kimlik(takip)).toBe('konu-takibi')
    const harita = tanitimGecisi(takip, { tur: 'ileri' })
    expect(kimlik(harita)).toBe('harita-ac')
    expect(tanitimGecisi(harita, { tur: 'ileri' })).toBe(harita)
    expect(kimlik(tanitimGecisi(harita, { tur: 'hedefe-dokun', hedef: 'harita-ac' }))).toBe('harita-ders')
  })

  it('Konu Takibi düğmesi normal "İleri"; harita kitapları dokunuş istemeyen bilgi adımı', () => {
    const bul = (k: string) => TANITIM_ADIMLARI.find((a) => a.kimlik === k)!
    expect(bul('konu-takibi').ileriEtiketi).toBeUndefined()
    for (const k of HARITA_TUR_ADIMLARI) {
      expect(bul(k).tiklamali, k).toBe(false)
      expect(bul(k).aciklama.toLocaleLowerCase('tr'), k).not.toContain('dokun')
    }
    // Kitaba dokunmak adımı geçirmiyor; yalnızca İleri geçiriyor.
    const ders = adimaKadar('harita-ders')
    expect(tanitimGecisi(ders, { tur: 'hedefe-dokun', hedef: 'harita-kart' })).toBe(ders)
    expect(kimlik(tanitimGecisi(ders, { tur: 'ileri' }))).toBe('harita-soru')
  })

  it('Harita’dan sonra Araçlar’a dönüp Denemeler açılıyor', () => {
    const harita = adimaKadar('harita-soru')
    expect(TANITIM_ADIMLARI[harita.aktifAdim!].ileriEtiketi).toBe('Araçlara dön')
    const deneme = tanitimGecisi(harita, { tur: 'ileri' })
    expect(kimlik(deneme)).toBe('deneme-ac')
    expect(tanitimGecisi(deneme, { tur: 'ileri' })).toBe(deneme)
    expect(kimlik(tanitimGecisi(deneme, { tur: 'hedefe-dokun', hedef: 'arac-deneme' }))).toBe('deneme-liste')
  })

  it('Okut’tan İleri ile boş ders adımına geçiliyor; geçerli giriş bildirilmeden ilerlemiyor', () => {
    const okut = adimaKadar('deneme-okut')
    const elle = tanitimGecisi(okut, { tur: 'ileri' })
    expect(kimlik(elle)).toBe('deneme-elle')
    expect(tanitimGecisi(elle, { tur: 'ileri' })).toBe(elle)
    expect(tanitimGecisi(elle, { tur: 'hedefe-dokun', hedef: 'deneme-bos-ders' })).toBe(elle)
    expect(tanitimGecisi(elle, { tur: 'kayit-eklendi', kayit: 'deneme' })).toBe(elle)
    expect(kimlik(tanitimGecisi(elle, { tur: 'kayit-eklendi', kayit: 'deneme-ders' }))).toBe('deneme-yanlis')
  })

  it('"Yanlış soru ekle" yalnızca gösteriliyor: İleri ile geçiliyor, dokunuş formu açmıyor', () => {
    const yanlis = adimaKadar('deneme-yanlis')
    expect(TANITIM_ADIMLARI.find((a) => a.kimlik === 'deneme-yanlis')).toMatchObject({ tiklamali: false })
    expect(tanitimGecisi(yanlis, { tur: 'hedefe-dokun', hedef: 'deneme-yanlis-ekle' })).toBe(yanlis)
    const kaydet = tanitimGecisi(yanlis, { tur: 'ileri' })
    expect(kimlik(kaydet)).toBe('deneme-kaydet')
    expect(kimlik(tanitimGecisi(kaydet, { tur: 'geri' }))).toBe('deneme-yanlis')
    expect(tanitimGecisi(kaydet, { tur: 'hedefe-dokun', hedef: 'deneme-kaydet' })).toBe(kaydet)
    expect(kimlik(tanitimGecisi(kaydet, { tur: 'kayit-eklendi', kayit: 'deneme' }))).toBe('istatistik-ac')
  })

  it('turda hiçbir adım yanlış soru formunu hedeflemiyor', () => {
    for (const adimlar of Object.values(TUR_ADIMLARI)) {
      for (const adim of adimlar) expect(adim.hedef, adim.kimlik).not.toBe('yanlis-soru-formu')
    }
  })

  it('deneme formunun Vazgeç’i "Deneme ekle" adımına dönüyor; formun dışında yok sayılıyor', () => {
    for (const k of DENEME_FORMU_ADIMLARI) expect(kimlik(tanitimGecisi(adimaKadar(k), { tur: 'hedefe-dokun', hedef: DENEME_VAZGEC })), k).toBe('deneme-ekle')
    const liste = adimaKadar('deneme-liste')
    expect(tanitimGecisi(liste, { tur: 'hedefe-dokun', hedef: DENEME_VAZGEC })).toBe(liste)
  })

  it('deneme kaydedildikten sonra geri, forma değil listeye dönüyor', () => {
    expect(kimlik(tanitimGecisi(adimaKadar('istatistik-ac'), { tur: 'geri' }))).toBe('deneme-liste')
  })

  it('son adım İstatistik’in karşılaştırması; aşılamıyor, çıkış yalnızca Turu Bitir', () => {
    const son = adimaKadar('istatistik-karsilastir')
    expect(son.aktifAdim).toBe(TANITIM_ADIMLARI.length - 1)
    expect(tanitimGecisi(son, { tur: 'ileri' })).toBe(son)
  })

  it('turda eklenen soru turun listesinde kalıyor, temizleyince siliniyor', () => {
    let durum = adimaKadar('soru-form')
    durum = tanitimGecisi(durum, { tur: 'demo-veri', alan: 'soruKayitlari', guncelle: (o) => [...o, { tarih: '2026-10-03', kayitlar: [{ ders: 'Matematik', toplam: 20, dogru: 15, yanlis: 3 }] }] })
    expect(durum.demo.soruKayitlari).toHaveLength(1)
    expect(tanitimGecisi(durum, { tur: 'demo-temizle' }).demo).toEqual(demoVerileriTemizle().demo)
    expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
    // Mini turda veri eylemi yok sayılıyor: mini turlar kayıt eklettirmiyor.
    const mini = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi: 'yapilacaklar' })
    expect(tanitimGecisi(mini, { tur: 'demo-veri', alan: 'gorevler', guncelle: [] })).toBe(mini)
  })

  it('gecikmiş adım ya da başka turdan gelen dokunuş yok sayılıyor', () => {
    const durum = adimaKadar('hedef')
    expect(tanitimGecisi(durum, { tur: 'ileri', beklenenAdim: 0 })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'ileri', beklenenAdim: 1, beklenenTur: 'denemeler' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'baslat', turAdi: 'pomodoro' })).toBe(durum)
  })
})

describe('Mini turlar', () => {
  it('her mini tur kısa (1–6 adım); kendi ekranından çıkmıyor', () => {
    for (const tur of MINI_TURLAR) {
      expect(TUR_ADIMLARI[tur].length, tur).toBeGreaterThanOrEqual(1)
      // Yapılacaklar görev eklemeyi alan alan gösterdiği için altı adım; öteki turlar en çok beş.
      expect(TUR_ADIMLARI[tur].length, tur).toBeLessThanOrEqual(tur === 'yapilacaklar' ? 6 : 5)
    }
    // Oyun turu (kart, Başlat) ve Yapılacaklar ("+") dokunuş istiyor; öteki mini turlar bakıp geçiliyor.
    for (const tur of MINI_TURLAR.filter((t) => t !== 'oyunlar' && t !== 'yapilacaklar')) {
      for (const adim of TUR_ADIMLARI[tur]) expect(adim.tiklamali, `${tur}/${adim.kimlik}`).toBe(false)
    }
  })

  it('balon metinleri kısa', () => {
    for (const tur of TURLAR) for (const adim of TUR_ADIMLARI[tur]) {
      expect(adim.aciklama.length, adim.kimlik).toBeLessThanOrEqual(85)
      expect(adim.baslik.length, adim.kimlik).toBeLessThanOrEqual(30)
    }
  })

  it.each(MINI_TURLAR)('%s bağımsız başlıyor ve son adımı aşamıyor', (turAdi) => {
    let durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi })
    expect(durum.aktifTur).toBe(turAdi)
    for (const adim of TUR_ADIMLARI[turAdi].slice(0, -1)) durum = gec(durum, adim)
    expect(durum.aktifAdim).toBe(TUR_ADIMLARI[turAdi].length - 1)
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
  })

  it('oyun turu gerçek başlatma dokunuşuyla soruya geçiyor; soruda geri yok', () => {
    const ayar = adimaKadar('zorluk', 'oyunlar')
    const baslat = tanitimGecisi(ayar, { tur: 'ileri' })
    expect(kimlik(baslat)).toBe('oyun-baslat')
    expect(tanitimGecisi(baslat, { tur: 'ileri' })).toBe(baslat)
    const soru = tanitimGecisi(baslat, { tur: 'hedefe-dokun', hedef: 'demo-baslat' })
    expect(kimlik(soru)).toBe('soru-bir')
    expect(tanitimGecisi(soru, { tur: 'geri' })).toBe(soru)
    expect(tanitimGecisi(soru, { tur: 'hedefe-dokun', hedef: 'demo-soru' })).toBe(soru)
  })

  it('tanıtım oyununda pas yok: soru adımı pas önermiyor, Onayla’yı anlatıyor', () => {
    // 0.9.14'te tuş takımındaki "Pas geç" kalktı, kabuğun ortak pası demoya
    // verilmedi (`oyun-islem.tsx`); balon hâlâ "pas geç" diyordu.
    const soru = TUR_ADIMLARI.oyunlar.find((adim) => adim.kimlik === 'soru-bir')!
    expect(soru.aciklama.toLocaleLowerCase('tr')).not.toContain('pas')
    expect(soru.aciklama).toContain('Onayla')
  })

  it('oyun turu yeni giriş penceresini anlatıyor: hazırlık ekranı ve zorluk yok, düğme "Başla"', () => {
    // Hazırlık ekranı oyun modu penceresine döndü (`ModPenceresi`); balon hâlâ
    // "Hazırlık ekranı" ve "Başlat’a dokun" diyordu.
    const metinler = TUR_ADIMLARI.oyunlar.map((adim) => `${adim.baslik} ${adim.aciklama}`.toLocaleLowerCase('tr'))
    for (const metin of metinler) {
      expect(metin).not.toContain('hazırlık')
      expect(metin).not.toContain('zorluk')
      expect(metin).not.toMatch(/\bpas\b/)
    }
    const baslat = TUR_ADIMLARI.oyunlar.find((adim) => adim.kimlik === 'oyun-baslat')!
    expect(baslat.aciklama).toContain('Başla’ya dokun')
    expect(TUR_ADIMLARI.oyunlar.find((adim) => adim.kimlik === 'zorluk')!.baslik).toBe('Oyun modu')
  })

  it.each([[1, 0], [0, 1]])('oyun %i doğru %i yanlışla bitince sonuç adımı, geri hazırlığa ve temiz sonuca', (dogru, yanlis) => {
    const sonuc = tanitimGecisi(adimaKadar('soru-bir', 'oyunlar'), { tur: 'oyun-bitti', dogru, yanlis })
    expect(kimlik(sonuc)).toBe('sonuc')
    expect(demoSonucu(sonuc.demo)).toEqual({ dogru, yanlis, skor: dogru * 10 })
    expect(tanitimGecisi(sonuc, { tur: 'oyun-bitti', dogru, yanlis })).toBe(sonuc)
    const geri = tanitimGecisi(sonuc, { tur: 'geri' })
    expect(kimlik(geri)).toBe('zorluk')
    expect(geri.demo).toEqual(demoVerileriTemizle().demo)
  })

  it('Oyun Bankası turu üç geçici örnek soruyla açılıyor, bitince siliniyor', () => {
    const durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi: 'oyun_bankasi' })
    expect(durum.demo.banka).toHaveLength(3)
    expect(new Set(durum.demo.banka.map((k) => k.id)).size).toBe(3)
    expect(tanitimGecisi(durum, { tur: 'demo-temizle' }).demo.banka).toEqual([])
    // Öteki turlar boş bankayla başlıyor.
    expect(tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi: 'oyunlar' }).demo.banka).toEqual([])
  })

  it('her aşamada temizlenebiliyor', () => {
    for (const turAdi of TURLAR) for (let aktifAdim = 0; aktifAdim < TUR_ADIMLARI[turAdi].length; aktifAdim++) {
      expect(tanitimGecisi({ ...demoVerileriTemizle(), aktifTur: turAdi, aktifAdim }, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
    }
  })
})

describe('Yapılacaklar turu: görev ekleme gösteriliyor, eklettirilmiyor', () => {
  const adimlar = TUR_ADIMLARI.yapilacaklar

  it('"+", ekleme sayfasının dört alanı, sonra liste', () => {
    expect(adimlar.map((a) => a.kimlik)).toEqual(['gorev-ekle', 'gorev-ad', 'gorev-saat', 'gorev-pomodoro', 'gorev-kaydet', 'gorev-liste-bilgi'])
    expect(GOREV_FORMU_ADIMLARI).toEqual(['gorev-ad', 'gorev-saat', 'gorev-pomodoro', 'gorev-kaydet'])
    // Yalnızca "+" dokunuş istiyor; form adımları İleri ile geçiliyor, yazı ya da seçim beklemiyor.
    expect(adimlar.filter((a) => a.tiklamali).map((a) => a.kimlik)).toEqual(['gorev-ekle'])
    for (const adim of adimlar) {
      expect(adim.kayit, adim.kimlik).toBeUndefined()
      expect(adim.etkilesimli, adim.kimlik).toBeFalsy()
    }
  })

  it('ekleme sayfası yalnızca form adımlarında açık', () => {
    for (const adim of adimlar) expect(gorevFormuTurdaAcik('yapilacaklar', adim.kimlik), adim.kimlik).toBe(GOREV_FORMU_ADIMLARI.includes(adim.kimlik))
    expect(gorevFormuTurdaAcik(null, 'gorev-ad')).toBe(false)
    expect(gorevFormuTurdaAcik('ana_tur', 'gorev-ad')).toBe(false)
  })

  it('"+" sayfayı açıyor; son alandan İleri sayfayı kaydetmeden kapatıyor', () => {
    let durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi: 'yapilacaklar' })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    durum = tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'gorev-ekle' })
    expect(kimlik(durum)).toBe('gorev-ad')
    for (const beklenen of ['gorev-saat', 'gorev-pomodoro', 'gorev-kaydet', 'gorev-liste-bilgi']) {
      durum = tanitimGecisi(durum, { tur: 'ileri' })
      expect(kimlik(durum)).toBe(beklenen)
    }
    expect(gorevFormuTurdaAcik(durum.aktifTur, kimlik(durum))).toBe(false)
    // Tur boyunca hiçbir görev oluşmadı; Kaydet dokunuşu adımı geçmiyor.
    expect(durum.demo.gorevler).toEqual([])
    const kaydet = adimaKadar('gorev-kaydet', 'yapilacaklar')
    expect(tanitimGecisi(kaydet, { tur: 'hedefe-dokun', hedef: 'gorev-kaydet' })).toBe(kaydet)
    expect(tanitimGecisi(kaydet, { tur: 'kayit-eklendi', kayit: 'gorev' })).toBe(kaydet)
    expect(tanitimGecisi(kaydet, { tur: 'demo-veri', alan: 'gorevler', guncelle: (o) => o })).toBe(kaydet)
  })

  it('tur sürerken gerçek görev listesine yazılmıyor', () => {
    expect(gorevYazilabilir('yapilacaklar')).toBe(false)
    expect(gorevYazilabilir(null)).toBe(true)
    expect(gorevYazilabilir('pomodoro')).toBe(true)
  })

  it('geri: ilk alandan sayfa kapanıp "+"ya, öteki alanlardan bir önceki alana', () => {
    const ad = adimaKadar('gorev-ad', 'yapilacaklar')
    const geri = tanitimGecisi(ad, { tur: 'geri' })
    expect(kimlik(geri)).toBe('gorev-ekle')
    expect(gorevFormuTurdaAcik(geri.aktifTur, kimlik(geri))).toBe(false)
    expect(kimlik(tanitimGecisi(adimaKadar('gorev-saat', 'yapilacaklar'), { tur: 'geri' }))).toBe('gorev-ad')
    // Listeden geri: sayfa Kaydet adımında yeniden açılıyor (yine kayıtsız).
    expect(kimlik(tanitimGecisi(adimaKadar('gorev-liste-bilgi', 'yapilacaklar'), { tur: 'geri' }))).toBe('gorev-kaydet')
    // Turda geri tuşu katman kapatmıyor, adımı geri alıyor (sayfa adıma bağlı kapanıyor).
    expect(tanitimGeriKarari({ tanitimdaMi: true, rehberGizli: false, adimKimligi: 'gorev-ad', katmanVar: true })).toBe('adim-geri')
  })

  it('sayfanın kapatılması (✕, aşağı kaydırma) "+" adımına dönüyor; formun dışında yok sayılıyor', () => {
    for (const adim of GOREV_FORMU_ADIMLARI) {
      expect(kimlik(tanitimGecisi(adimaKadar(adim, 'yapilacaklar'), { tur: 'hedefe-dokun', hedef: GOREV_VAZGEC })), adim).toBe('gorev-ekle')
    }
    const liste = adimaKadar('gorev-liste-bilgi', 'yapilacaklar')
    expect(tanitimGecisi(liste, { tur: 'hedefe-dokun', hedef: GOREV_VAZGEC })).toBe(liste)
    // Ana turun deneme vazgeçi bu turda işlemiyor.
    const ad = adimaKadar('gorev-ad', 'yapilacaklar')
    expect(tanitimGecisi(ad, { tur: 'hedefe-dokun', hedef: DENEME_VAZGEC })).toBe(ad)
  })

  it('anahtar v2: v1 turunu görenler yeni hâli bir kez görüyor', () => {
    expect(TUR_ANAHTARLARI.yapilacaklar).toBe('rabi-mini-tur-yapilacaklar-v2')
    expect(turGorulduOku('yapilacaklar', (a) => (a === 'rabi-mini-tur-yapilacaklar-v1' ? 'true' : null))).toBe(false)
    expect(turGorulduOku('yapilacaklar', (a) => (a === 'rabi-mini-tur-yapilacaklar-v2' ? 'true' : null))).toBe(true)
  })
})

describe('Turların kayıtları', () => {
  it('eski üç anahtar aynı kalıyor; yeniler rabi- önekli ve sürümlü, hepsi ayrı', () => {
    expect(TUR_ANAHTARLARI.ana_tur).toBe('rabi_ana_tur_tamamlandi')
    expect(TUR_ANAHTARLARI.denemeler).toBe('rabi_deneme_turu_tamamlandi')
    expect(TUR_ANAHTARLARI.konu_haritasi).toBe('rabi_harita_turu_tamamlandi')
    for (const tur of ['pomodoro', 'yapilacaklar', 'istatistik', 'oyunlar', 'oyun_bankasi'] as const) {
      expect(TUR_ANAHTARLARI[tur]).toMatch(/^rabi-mini-tur-[a-z-]+-v\d+$/)
    }
    expect(new Set(Object.values(TUR_ANAHTARLARI)).size).toBe(TURLAR.length)
  })

  it('her turun bir etiketi var', () => {
    for (const tur of TURLAR) expect(TUR_ETIKETLERI[tur].length).toBeGreaterThan(0)
  })
})

describe('miniTurSec', () => {
  const yer = (pay: Partial<MiniTurKonumu>): MiniTurKonumu => ({
    sekme: 'ana', ekran: null, denemeFormu: false, pomodoroIsliyor: false, pomodoroIstegi: false, genelTest: false, ...pay,
  })

  it('ekranın kendi mini turunu seçiyor', () => {
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'deneme' }))).toBe('denemeler')
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'pomodoro' }))).toBe('pomodoro')
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'notlar' }))).toBe('yapilacaklar')
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'istatistik' }))).toBe('istatistik')
    expect(miniTurSec(yer({ sekme: 'oyunlar', ekran: 'oyun-bankasi' }))).toBe('oyun_bankasi')
    expect(miniTurSec(yer({ sekme: 'harita' }))).toBe('konu_haritasi')
    expect(miniTurSec(yer({ sekme: 'oyunlar' }))).toBe('oyunlar')
  })

  it('turu olmayan yerde ve engelli durumda tur yok', () => {
    expect(miniTurSec(yer({}))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'daha' }))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'ayarlar' }))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'soru' }))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'deneme', denemeFormu: true }))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'pomodoro', pomodoroIsliyor: true }))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'daha', ekran: 'pomodoro', pomodoroIstegi: true }))).toBeNull()
    expect(miniTurSec(yer({ sekme: 'oyunlar', genelTest: true }))).toBeNull()
  })
})

describe('turGorulduOku / turBitisKayitlari (ana tur sürümü)', () => {
  const depo = (kayit: Record<string, string>) => (anahtar: string) => kayit[anahtar] ?? null
  it('eski anahtarlardan biri olan kullanıcı yeni ana turu görür', () => {
    expect(turGorulduOku('ana_tur', depo({ rabi_ana_tur_tamamlandi: 'true' }))).toBe(false)
    expect(turGorulduOku('ana_tur', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(false)
    expect(turGorulduOku('ana_tur', depo({ rabi_ana_tur_tamamlandi: 'true', [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(false)
  })
  it('güncel sürüm yazılmış kullanıcı ana turu görmez', () => {
    expect(ANA_TUR_SURUMU).toBe(2)
    expect(turGorulduOku('ana_tur', depo({ [ANA_TUR_SURUM_ANAHTARI]: '2' }))).toBe(true)
    expect(turGorulduOku('ana_tur', depo({ [ANA_TUR_SURUM_ANAHTARI]: '1', rabi_ana_tur_tamamlandi: 'true' }))).toBe(false)
  })
  it('tur bitince sürüm yazılır ve bir daha görülmez', () => {
    const kayit: Record<string, string> = { rabi_ana_tur_tamamlandi: 'true' }
    expect(turGorulduOku('ana_tur', depo(kayit))).toBe(false)
    for (const [anahtar, deger] of turBitisKayitlari('ana_tur')) kayit[anahtar] = deger
    expect(kayit[ANA_TUR_SURUM_ANAHTARI]).toBe(String(ANA_TUR_SURUMU))
    expect(turGorulduOku('ana_tur', depo(kayit))).toBe(true)
  })
  it('mini turlar kendi anahtarına true yazar, ana tur sürümüne dokunmaz', () => {
    expect(turBitisKayitlari('pomodoro')).toEqual([[TUR_ANAHTARLARI.pomodoro, 'true']])
    expect(turGorulduOku('pomodoro', depo({ [TUR_ANAHTARLARI.pomodoro]: 'true' }))).toBe(true)
  })
  it('eski anahtar ve ana tur sürümü mini turları görülmüş saymaz', () => {
    expect(turGorulduOku('denemeler', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true', [ANA_TUR_SURUM_ANAHTARI]: '2' }))).toBe(false)
    expect(turGorulduOku('konu_haritasi', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(false)
  })
  it('hiç kayıt yoksa ya da değer geçersizse görülmemiş', () => {
    expect(turGorulduOku('ana_tur', depo({}))).toBe(false)
    expect(turGorulduOku('ana_tur', depo({ [ANA_TUR_SURUM_ANAHTARI]: 'bozuk' }))).toBe(false)
  })
})
