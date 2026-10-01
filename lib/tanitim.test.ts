import { describe, expect, it } from 'vitest'
import { demoSonucu, demoVerileriTemizle, DEMO_SORULAR, TANITIM_ADIMLARI, tanitimGecisi, tanitimKonumu, type TanitimDurumu, type TanitimEylemi, type TanitimZorlugu } from './tanitim'

function ilerlet(durum: TanitimDurumu, ...eylemler: TanitimEylemi[]) {
  return eylemler.reduce(tanitimGecisi, durum)
}

function zorlugaKadar(): TanitimDurumu {
  return ilerlet(demoVerileriTemizle(), { tur: 'baslat' }, { tur: 'ileri' },
    { tur: 'hedefe-dokun', hedef: 'pomodoro-ac' }, { tur: 'ileri' }, { tur: 'ileri' },
    { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' }, { tur: 'hedefe-dokun', hedef: 'demo-oyun' })
}

describe('Rehberli tanıtım', () => {
  it.each(['kolay', 'orta', 'zor'] as TanitimZorlugu[])('%s seviyesinde iki cevaptan sonra üç örnekle bankaya gider', (zorluk) => {
    let durum = ilerlet(zorlugaKadar(), { tur: 'zorluk-sec', zorluk })
    const sorular = DEMO_SORULAR[zorluk]
    durum = ilerlet(durum, { tur: 'cevapla', cevap: sorular[0].cevap }, { tur: 'soruyu-gec' },
      { tur: 'cevapla', cevap: sorular[1].secenekler.find((cevap) => cevap !== sorular[1].cevap)! }, { tur: 'soruyu-gec' })
    expect(TANITIM_ADIMLARI[durum.aktifAdim!].kimlik).toBe('sonuc')
    expect(demoSonucu(durum.demo)).toEqual({ dogru: 1, yanlis: 1, skor: 10 })
    expect(durum.demo.banka).toHaveLength(3)
    expect(new Set(durum.demo.banka.map((kayit) => kayit.id)).size).toBe(3)
    durum = tanitimGecisi(durum, { tur: 'ileri' })
    expect(tanitimKonumu(TANITIM_ADIMLARI[durum.aktifAdim!])).toEqual({ sekme: 'oyunlar', ekran: 'oyun-bankasi' })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
  })

  it('tıklama adımında İleri veya başka hedef turu ilerletemez', () => {
    const durum = ilerlet(demoVerileriTemizle(), { tur: 'baslat' }, { tur: 'ileri' })
    expect(tanitimGecisi(durum, { tur: 'ileri' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' })).toBe(durum)
  })

  it('cevap verilmeden geçmez; geçersiz ve ikinci cevabı yok sayar', () => {
    const durum = tanitimGecisi(zorlugaKadar(), { tur: 'zorluk-sec', zorluk: 'kolay' })
    expect(tanitimGecisi(durum, { tur: 'soruyu-gec' })).toBe(durum)
    expect(tanitimGecisi(durum, { tur: 'cevapla', cevap: -1 })).toBe(durum)
    const cevapli = tanitimGecisi(durum, { tur: 'cevapla', cevap: 13 })
    expect(tanitimGecisi(cevapli, { tur: 'cevapla', cevap: 11 })).toBe(cevapli)
    expect(durum.demo.cevaplar).toEqual([])
  })

  it('gecikmiş dokunuş yeni adımı atlatamaz', () => {
    const durum = tanitimGecisi(zorlugaKadar(), { tur: 'geri' })
    expect(tanitimGecisi(durum, { tur: 'hedefe-dokun', hedef: 'demo-oyun', beklenenAdim: 4 })).toBe(durum)
  })

  it('geri dönünce ilgili cevap ve sonuç temizlenir', () => {
    const sonuc = ilerlet(zorlugaKadar(), { tur: 'zorluk-sec', zorluk: 'orta' },
      { tur: 'cevapla', cevap: 48 }, { tur: 'soruyu-gec' }, { tur: 'cevapla', cevap: 9 }, { tur: 'soruyu-gec' })
    const geri = tanitimGecisi(sonuc, { tur: 'geri' })
    expect(geri.demo.cevaplar).toEqual([48])
    expect(geri.demo.banka).toEqual([])
    const ilk = tanitimGecisi(geri, { tur: 'geri' })
    expect(ilk.demo.cevaplar).toEqual([])
    expect(tanitimGecisi(ilk, { tur: 'geri' }).demo.zorluk).toBeNull()
    expect(sonuc.demo.banka).toHaveLength(3)
  })

  it('her aşamada çıkış bütün demo veriyi sıfırlar', () => {
    const eylemler: TanitimEylemi[] = [{ tur: 'baslat' }, { tur: 'ileri' }, { tur: 'hedefe-dokun', hedef: 'pomodoro-ac' },
      { tur: 'ileri' }, { tur: 'ileri' }, { tur: 'hedefe-dokun', hedef: 'oyunlar-ac' }, { tur: 'hedefe-dokun', hedef: 'demo-oyun' },
      { tur: 'zorluk-sec', zorluk: 'kolay' }, { tur: 'cevapla', cevap: 13 }, { tur: 'soruyu-gec' }, { tur: 'cevapla', cevap: 18 },
      { tur: 'soruyu-gec' }, { tur: 'ileri' }]
    let durum = demoVerileriTemizle()
    for (const eylem of eylemler) {
      durum = tanitimGecisi(durum, eylem)
      expect(tanitimGecisi(durum, { tur: 'temizle' })).toEqual(demoVerileriTemizle())
    }
  })

  it('soru takibini yalnızca ana sayfada tanıtır', () => {
    const adim = TANITIM_ADIMLARI.find((adim) => adim.kimlik === 'soru-takibi')!
    expect(tanitimKonumu(adim)).toEqual({ sekme: 'ana', ekran: null })
    expect(TANITIM_ADIMLARI.filter((adim) => tanitimKonumu(adim).ekran === 'soru')).toEqual([])
  })
})
