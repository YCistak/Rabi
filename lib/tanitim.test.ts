import { describe, expect, it } from 'vitest'
import { demoSonucu, demoVerileriTemizle, TUR_ADIMLARI, TUR_ANAHTARLARI, TANITIM_ADIMLARI, tanitimGecisi, tanitimKonumu, type TanitimDurumu, type TanitimTuru } from './tanitim'

function adimaKadar(kimlik: string): TanitimDurumu {
  let durum = tanitimGecisi(demoVerileriTemizle(), { tur: 'baslat' })
  for (let sira = 0; sira < TANITIM_ADIMLARI.length; sira++) {
    const adim = TANITIM_ADIMLARI[durum.aktifAdim!]
    if (adim.kimlik === kimlik) return durum
    durum = tanitimGecisi(durum, adim.kimlik === 'soru-bir' ? { tur: 'oyun-bitti', dogru: 1, yanlis: 0 } : adim.tiklamali ? { tur: 'hedefe-dokun', hedef: adim.hedef } : { tur: 'ileri' })
  }
  throw new Error(`Adım bulunamadı: ${kimlik}`)
}

describe('Ana ve bağlamsal tanıtım turları', () => {
  it('prova, çalışma ayarları ve odak kilidini Pomodoro içinde sırayla tanıtır', () => {
    const kimlikler = TANITIM_ADIMLARI.map((adim) => adim.kimlik)
    expect(kimlikler.slice(4, 7)).toEqual(['pomodoro-prova', 'pomodoro', 'pomodoro-kilit'])
    for (const kimlik of kimlikler.slice(4, 7)) expect(tanitimKonumu(TANITIM_ADIMLARI.find((adim) => adim.kimlik === kimlik)!)).toEqual({ sekme: 'ana', ekran: 'pomodoro' })
  })
  it('oyun hazırlığından gerçek başlatma dokunuşuyla oyun aşamasına geçer', () => {
    const ayar = adimaKadar('zorluk')
    const baslat = tanitimGecisi(ayar, { tur: 'ileri' })
    expect(TANITIM_ADIMLARI[baslat.aktifAdim!].kimlik).toBe('oyun-baslat')
    expect(tanitimGecisi(baslat, { tur: 'ileri' })).toBe(baslat)
    const oyun = tanitimGecisi(baslat, { tur: 'hedefe-dokun', hedef: 'demo-baslat' })
    expect(TANITIM_ADIMLARI[oyun.aktifAdim!].kimlik).toBe('soru-bir')
    expect(tanitimGecisi(oyun, { tur: 'geri' })).toBe(oyun)
  })
  it.each([[1, 0], [0, 1]])('gerçek oyunun %i doğru %i yanlış sonucuyla üç geçici soru hazırlar', (dogru, yanlis) => {
    let durum = tanitimGecisi(adimaKadar('soru-bir'), { tur: 'oyun-bitti', dogru, yanlis })
    expect(TANITIM_ADIMLARI[durum.aktifAdim!].kimlik).toBe('sonuc')
    expect(demoSonucu(durum.demo)).toEqual({ dogru, yanlis, skor: dogru * 10 })
    expect(durum.demo.banka).toHaveLength(3)
    expect(new Set(durum.demo.banka.map((kayit) => kayit.id)).size).toBe(3)
    expect(tanitimGecisi(durum, { tur: 'oyun-bitti', dogru, yanlis })).toBe(durum)
    durum = tanitimGecisi(durum, { tur: 'ileri' })
    expect(tanitimKonumu(TANITIM_ADIMLARI[durum.aktifAdim!])).toEqual({ sekme: 'oyunlar', ekran: null })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    durum = tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'oyun-bankasi-ac' })
    expect(tanitimKonumu(TANITIM_ADIMLARI[durum.aktifAdim!])).toEqual({ sekme: 'oyunlar', ekran: 'oyun-bankasi' })
    expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
  })
  it('sonuçtan geri gidildiğinde yeni bir oyun için geçici sonucu temizler', () => {
    const durum = tanitimGecisi(adimaKadar('sonuc'), { tur: 'geri' })
    expect(TANITIM_ADIMLARI[durum.aktifAdim!].kimlik).toBe('zorluk')
    expect(durum.demo).toEqual(demoVerileriTemizle().demo)
  })
  it('soru takibini yalnızca ana sayfada tanıtır; başka hedef adımı atlatamaz', () => {
    const kart = TANITIM_ADIMLARI.find((adim) => adim.kimlik === 'soru-takibi')!
    expect(tanitimKonumu(kart)).toEqual({ sekme: 'ana', ekran: null })
    const durum = adimaKadar('pomodoro-ac')
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' })).toBe(durum)
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
