import { describe, expect, it } from 'vitest'
import { demoSonucu, demoVerileriTemizle, DEMO_SORULAR, TUR_ADIMLARI, TUR_ANAHTARLARI, TANITIM_ADIMLARI, tanitimGecisi, tanitimKonumu, type TanitimDurumu, type TanitimEylemi, type TanitimZorlugu } from './tanitim'

function ilerlet(durum: TanitimDurumu, ...eylemler: TanitimEylemi[]) {
  return eylemler.reduce(tanitimGecisi, durum)
}
function zorlugaKadar() {
  return ilerlet(demoVerileriTemizle(), { tur: 'baslat' }, { tur: 'ileri' }, { tur: 'ileri' }, { tur: 'ileri' },
    { tur: 'hedefe-dokun', hedef: 'pomodoro-ac' }, { tur: 'ileri' },
    { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' }, { tur: 'hedefe-dokun', hedef: 'demo-oyun' })
}
describe('Ana ve bağlamsal tanıtım turları', () => {
  it.each(['kolay', 'orta', 'zor'] as TanitimZorlugu[])('%s seviyesinde tek cevaptan sonra üç geçici soru hazırlar', (zorluk) => {
    let durum = ilerlet(zorlugaKadar(), { tur: 'zorluk-sec', zorluk })
    durum = ilerlet(durum, { tur: 'cevapla', cevap: DEMO_SORULAR[zorluk][0].cevap }, { tur: 'soruyu-gec' })
    expect(TANITIM_ADIMLARI[durum.aktifAdim!].kimlik).toBe('sonuc')
    expect(demoSonucu(durum.demo)).toEqual({ dogru: 1, yanlis: 0, skor: 10 })
    expect(durum.demo.banka).toHaveLength(3)
    expect(new Set(durum.demo.banka.map((kayit) => kayit.id)).size).toBe(3)
    durum = tanitimGecisi(durum, { tur: 'ileri' })
    expect(tanitimKonumu(TANITIM_ADIMLARI[durum.aktifAdim!])).toEqual({ sekme: 'oyunlar', ekran: 'oyun-bankasi' })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
  })
  it('soru takibini yalnızca ana sayfada tanıtır; tıklamalı adım atlanamaz', () => {
    const kart = TANITIM_ADIMLARI.find((adim) => adim.kimlik === 'soru-takibi')!
    expect(tanitimKonumu(kart)).toEqual({ sekme: 'ana', ekran: null })
    const durum = ilerlet(demoVerileriTemizle(), { tur: 'baslat' }, { tur: 'ileri' }, { tur: 'ileri' }, { tur: 'ileri' })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' })).toBe(durum)
  })
  it('cevapsız, geçersiz ve yinelenen cevaplarla ilerlemez', () => {
    const durum = tanitimGecisi(zorlugaKadar(), { tur: 'zorluk-sec', zorluk: 'kolay' })
    expect(tanitimGecisi(durum, { tur: 'soruyu-gec' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'cevapla', cevap: -1 })).toBe(durum)
    const cevapli = tanitimGecisi(durum, { tur: 'cevapla', cevap: 13 })
    expect(tanitimGecisi(cevapli, { tur: 'cevapla', cevap: 11 })).toBe(cevapli)
    const sonuc = tanitimGecisi(cevapli, { tur: 'soruyu-gec' })
    const geri = tanitimGecisi(sonuc, { tur: 'geri' })
    expect(geri.demo.banka).toEqual([])
    expect(geri.demo.cevaplar).toEqual([])
    expect(geri.demo.zorluk).toBe('kolay')
  })
  it('gecikmiş adım veya başka turdan gelen dokunuşu yok sayar', () => {
    const durum = ilerlet(demoVerileriTemizle(), { tur: 'baslat' }, { tur: 'ileri' })
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
    expect(tanitimGecisi(durum, { tur: 'temizle' }).aktifTur).toBeNull()
  })
  it('her aşamada temizler ve üç bağımsız kayıt anahtarı kullanır', () => {
    expect(Object.values(TUR_ANAHTARLARI)).toEqual(['rabi_ana_tur_tamamlandi', 'rabi_deneme_turu_tamamlandi', 'rabi_harita_turu_tamamlandi'])
    for (const turAdi of Object.keys(TUR_ADIMLARI) as (keyof typeof TUR_ADIMLARI)[]) {
      for (let aktifAdim = 0; aktifAdim < TUR_ADIMLARI[turAdi].length; aktifAdim++) {
        const durum = { ...demoVerileriTemizle(), aktifTur: turAdi, aktifAdim }
        expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
      }
    }
  })
})
