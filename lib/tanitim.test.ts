import { describe, expect, it } from 'vitest'
import { demoSonucu, demoVerileriTemizle, TUR_ADIMLARI, TUR_ANAHTARLARI, TANITIM_ADIMLARI, tanitimGecisi, tanitimKonumu, type TanitimDurumu, type TanitimTuru } from './tanitim'

function adimaKadar(kimlik: string): TanitimDurumu {
  let durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat' })
  for (let sira = 0; sira < TANITIM_ADIMLARI.length; sira++) {
    const adim = TANITIM_ADIMLARI[durum.aktifAdim!]
    if (adim.kimlik === kimlik) return durum
    durum = tanitimGecisi(durum, adim.kimlik === 'soru-bir' ? { tur: 'oyun-bitti', dogru: 1, yanlis: 0 } : adim.kayit ? { tur: 'kayit-eklendi', kayit: adim.kayit } : adim.tiklamali ? { tur: 'hedefe-dokun', hedef: adim.hedef } : { tur: 'ileri' })
  }
  throw new Error(`Adım bulunamadı: ${kimlik}`)
}

describe('Ana ve bağlamsal tanıtım turları', () => {
  it('prova, çalışma ayarları ve odak kilidini Pomodoro içinde sırayla tanıtır', () => {
    const kimlikler = TANITIM_ADIMLARI.map((adim) => adim.kimlik)
    expect(kimlikler.slice(4, 7)).toEqual(['pomodoro-prova', 'pomodoro', 'pomodoro-kilit'])
    for (const kimlik of kimlikler.slice(4, 7)) expect(tanitimKonumu(TANITIM_ADIMLARI.find((adim) => adim.kimlik === kimlik)!)).toEqual({ sekme: 'daha', ekran: 'pomodoro', denemeFormu: false })
  })
  it('oyun hazırlığından gerçek başlatma dokunuşuyla oyun aşamasına geçer', () => {
    const ayar = adimaKadar('zorluk')
    const baslat = tanitimGecisi(ayar, { tur: 'ileri' })
    expect(TANITIM_ADIMLARI[baslat.aktifAdim!].kimlik).toBe('oyun-baslat')
    expect(tanitimGecisi(baslat, { tur: 'ileri' })).toBe(baslat)
    const oyun = tanitimGecisi(baslat, { tur: 'hedefe-dokun', hedef: 'demo-baslat' })
    expect(TANITIM_ADIMLARI[oyun.aktifAdim!].kimlik).toBe('oyun-sayac')
    const soru = tanitimGecisi(oyun, { tur: 'ileri' })
    expect(TANITIM_ADIMLARI[soru.aktifAdim!].kimlik).toBe('soru-bir')
    expect(tanitimGecisi(soru, { tur: 'geri' })).toBe(soru)
  })
  it.each([[1, 0], [0, 1]])('gerçek oyunun %i doğru %i yanlış sonucuyla üç geçici soru hazırlar', (dogru, yanlis) => {
    let durum = tanitimGecisi(adimaKadar('soru-bir'), { tur: 'oyun-bitti', dogru, yanlis })
    expect(TANITIM_ADIMLARI[durum.aktifAdim!].kimlik).toBe('sonuc')
    expect(demoSonucu(durum.demo)).toEqual({ dogru, yanlis, skor: dogru * 10 })
    expect(durum.demo.banka).toHaveLength(3)
    expect(new Set(durum.demo.banka.map((kayit) => kayit.id)).size).toBe(3)
    expect(tanitimGecisi(durum, { tur: 'oyun-bitti', dogru, yanlis })).toBe(durum)
    durum = tanitimGecisi(durum, { tur: 'ileri' })
    expect(tanitimKonumu(TANITIM_ADIMLARI[durum.aktifAdim!])).toEqual({ sekme: 'oyunlar', ekran: null, denemeFormu: false })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    durum = tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'oyun-bankasi-ac' })
    expect(tanitimKonumu(TANITIM_ADIMLARI[durum.aktifAdim!])).toEqual({ sekme: 'oyunlar', ekran: 'oyun-bankasi', denemeFormu: false })
    expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
  })
  it('kapanış animasyonu sürerken demo verilerini hemen temizler', () => {
    const sonuc = adimaKadar('sonuc')
    const temiz = tanitimGecisi(sonuc, { tur: 'demo-temizle' })
    expect(temiz.aktifAdim).toBe(sonuc.aktifAdim)
    expect(temiz.aktifTur).toBe('ana_tur')
    expect(temiz.demo).toEqual(demoVerileriTemizle().demo)
  })
  it('sonuçtan geri gidildiğinde yeni bir oyun için geçici sonucu temizler', () => {
    const durum = tanitimGecisi(adimaKadar('sonuc'), { tur: 'geri' })
    expect(TANITIM_ADIMLARI[durum.aktifAdim!].kimlik).toBe('zorluk')
    expect(durum.demo).toEqual(demoVerileriTemizle().demo)
  })
  it('araç adımlarını ana sayfada değil Araçlar sekmesinden yürütür; başka hedef adımı atlatamaz', () => {
    const kimlikler = TANITIM_ADIMLARI.map((adim) => adim.kimlik)
    expect(kimlikler.slice(0, 3)).toEqual(['sinav-hedefi', 'hedef', 'araclar-ac'])
    expect(kimlikler).not.toContain('soru-takibi')
    // Sıra: Pomodoro → Soru Takibi → Yapılacaklar → Denemeler → İstatistik → oyunlar.
    const sira = ['pomodoro-ac', 'soru-ac', 'gorev-ac', 'deneme-ac', 'istatistik-ac', 'oyunlar-ac'].map((k) => kimlikler.indexOf(k))
    expect(sira).toEqual([...sira].sort((a, b) => a - b))
    for (const adim of TANITIM_ADIMLARI.slice(3, kimlikler.indexOf('oyunlar-ac'))) expect(tanitimKonumu(adim).sekme).toBe('daha')
    const araclar = adimaKadar('araclar-ac')
    expect(tanitimGecisi(araclar, { tur: 'ileri' })).toBe(araclar)
    expect(TANITIM_ADIMLARI[tanitimGecisi(araclar, { tur: 'hedefe-dokun', hedef: 'araclar-ac' }).aktifAdim!].kimlik).toBe('pomodoro-ac')
    const durum = adimaKadar('pomodoro-ac')
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'arac-soru' })).toBe(durum)
  })
  it.each([['soru-form', 'soru'], ['gorev-form', 'gorev'], ['deneme-kaydet', 'deneme']] as const)('%s ancak kayıt eklenince ilerler', (kimlik, kayit) => {
    const durum = adimaKadar(kimlik)
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: TANITIM_ADIMLARI[durum.aktifAdim!].hedef })).toBe(durum)
    const baska = kayit === 'soru' ? 'gorev' : 'soru'
    expect(tanitimGecisi(durum, { tur: 'kayit-eklendi', kayit: baska })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'kayit-eklendi', kayit }).aktifAdim).toBe(durum.aktifAdim! + 1)
  })
  it('turda eklenen veriyi turun listesinde tutar, temizleyince siler', () => {
    let durum = adimaKadar('soru-form')
    durum = tanitimGecisi(durum, { tur: 'demo-veri', alan: 'soruKayitlari', guncelle: (o) => [...o, { tarih: '2026-10-03', kayitlar: [{ ders: 'Matematik', toplam: 20, dogru: 15, yanlis: 3 }] }] })
    durum = tanitimGecisi(durum, { tur: 'demo-veri', alan: 'gorevler', guncelle: [{ id: 'tanitim-g', metin: 'Paragraf', gun: '2026-10-03', dilim: 'sabah', kategori: 'tekrar', renk: 'turuncu', sure: null, bitti: false, yildiz: false }] })
    expect(durum.demo.soruKayitlari).toHaveLength(1)
    expect(durum.demo.gorevler).toHaveLength(1)
    // Oyunun hazırlığına geri dönmek turda eklenenleri silmiyor; yalnızca oyun sonucu sıfırlanıyor.
    let oyun = tanitimGecisi({ ...adimaKadar('sonuc'), demo: durum.demo }, { tur: 'geri' })
    expect(oyun.demo.soruKayitlari).toHaveLength(1)
    oyun = tanitimGecisi(oyun, { tur: 'geri' })
    expect(oyun.demo.gorevler).toHaveLength(1)
    expect(tanitimGecisi(durum, { tur: 'demo-temizle' }).demo).toEqual(demoVerileriTemizle().demo)
    expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
    // Ana tur dışında (deneme mini turu) veri eylemi yok sayılıyor.
    const mini = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi: 'denemeler' })
    expect(tanitimGecisi(mini, { tur: 'demo-veri', alan: 'denemeler', guncelle: [] })).toBe(mini)
  })
  it('form adımlarında geri ve vazgeç formu kapalı, yeniden açılabilir adıma götürür', () => {
    const kimlik = (d: TanitimDurumu) => TANITIM_ADIMLARI[d.aktifAdim!].kimlik
    expect(kimlik(tanitimGecisi(adimaKadar('soru-kaydedildi'), { tur: 'geri' }))).toBe('soru-ekle')
    expect(kimlik(tanitimGecisi(adimaKadar('gorev-kaydedildi'), { tur: 'geri' }))).toBe('gorev-ekle')
    expect(kimlik(tanitimGecisi(adimaKadar('istatistik-ac'), { tur: 'geri' }))).toBe('deneme-liste')
    expect(kimlik(tanitimGecisi(adimaKadar('soru-form'), { tur: 'geri' }))).toBe('soru-ekle')
    for (const adim of ['deneme-okut', 'deneme-elle', 'deneme-kaydet']) {
      expect(kimlik(tanitimGecisi(adimaKadar(adim), { tur: 'hedefe-dokun', hedef: 'deneme-vazgec' }))).toBe('deneme-ekle')
      expect(tanitimKonumu(TANITIM_ADIMLARI.find((a) => a.kimlik === adim)!)).toEqual({ sekme: 'daha', ekran: 'deneme', denemeFormu: true })
    }
    const liste = adimaKadar('deneme-liste')
    expect(tanitimGecisi(liste, { tur: 'hedefe-dokun', hedef: 'deneme-vazgec' })).toBe(liste)
  })
  it('gecikmiş adım veya başka turdan gelen dokunuşu yok sayar', () => {
    const durum = adimaKadar('hedef')
    expect(tanitimGecisi(durum, { tur: 'ileri', beklenenAdim: 0 })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'ileri', beklenenAdim: 1, beklenenTur: 'denemeler' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'baslat', turAdi: 'denemeler' })).toBe(durum)
  })
  it.each(['denemeler', 'konu_haritasi'] as const)('%s bağımsız başlar ve son adımı aşamaz', (turAdi) => {
    let durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat', turAdi })
    expect(durum.aktifTur).toBe(turAdi)
    for (let sira = 1; sira < TUR_ADIMLARI[turAdi].length; sira++) durum = tanitimGecisi(durum, { tur: 'ileri' })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(durum.demo).toEqual(demoVerileriTemizle().demo)
  })
  it('her aşamada temizler ve üç bağımsız kayıt anahtarı kullanır', () => {
    expect(Object.values(TUR_ANAHTARLARI)).toEqual(['rabi_ana_tur_tamamlandi', 'rabi_deneme_turu_tamamlandi', 'rabi_harita_turu_tamamlandi'])
    for (const turAdi of Object.keys(TUR_ADIMLARI) as TanitimTuru[]) for (let aktifAdim = 0; aktifAdim < TUR_ADIMLARI[turAdi].length; aktifAdim++) {
      expect(tanitimGecisi({ ...demoVerileriTemizle(), aktifTur: turAdi, aktifAdim }, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
    }
  })
})
