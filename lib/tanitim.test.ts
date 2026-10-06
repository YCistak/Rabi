import { describe, expect, it } from 'vitest'
import {
  ESKI_ANA_TUR_ANAHTARI,
  HARITA_TUR_ADIMLARI,
  TANITIM_ADIMLARI,
  TUR_ADIMLARI,
  TUR_ANAHTARLARI,
  TUR_ETIKETLERI,
  demoSonucu,
  demoVerileriTemizle,
  miniTurSec,
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
  it('10–12 adım: ana sayfa, soru ekleme, Konu Takibi, Harita', () => {
    expect(TANITIM_ADIMLARI.length).toBeGreaterThanOrEqual(10)
    expect(TANITIM_ADIMLARI.length).toBeLessThanOrEqual(12)
    expect(TANITIM_ADIMLARI.map((a) => a.kimlik)).toEqual([
      'sinav-hedefi', 'hedef', 'araclar-ac',
      'soru-ac', 'soru-ekle', 'soru-form', 'soru-kaydedildi',
      'konu-takibi-ac', 'konu-takibi', 'harita-ac', 'harita-ders', 'harita-soru',
    ])
  })

  it('başka ekranların adımları ana turda yok; onlar mini turlarda', () => {
    const ana = new Set(TANITIM_ADIMLARI.map((a) => a.kimlik))
    for (const tur of MINI_TURLAR) for (const adim of TUR_ADIMLARI[tur]) expect(ana.has(adim.kimlik), adim.kimlik).toBe(false)
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

  it('son adımı aşamıyor; çıkış yalnızca Turu Bitir', () => {
    const son = adimaKadar('harita-soru')
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
  it('her mini tur kısa (1–5 adım); kendi ekranından çıkmıyor', () => {
    for (const tur of MINI_TURLAR) {
      expect(TUR_ADIMLARI[tur].length, tur).toBeGreaterThanOrEqual(1)
      expect(TUR_ADIMLARI[tur].length, tur).toBeLessThanOrEqual(5)
    }
    // Yalnızca oyun turu dokunuş istiyor (kartı ve Başlat'ı); öteki mini turlar bakıp geçiliyor.
    for (const tur of MINI_TURLAR.filter((t) => t !== 'oyunlar')) {
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

describe('turGorulduOku (eski anahtar göçü)', () => {
  const depo = (kayit: Record<string, string>) => (anahtar: string) => kayit[anahtar] ?? null
  it('yeni anahtar varsa görülmüş', () => {
    expect(turGorulduOku('ana_tur', depo({ rabi_ana_tur_tamamlandi: 'true' }))).toBe(true)
  })
  it('yalnız eski rabi_tanitim_tamamlandi varsa ana tur görülmüş sayılır', () => {
    expect(turGorulduOku('ana_tur', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(true)
  })
  it('eski anahtar mini turları görülmüş saymaz', () => {
    expect(turGorulduOku('denemeler', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(false)
    expect(turGorulduOku('konu_haritasi', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'true' }))).toBe(false)
  })
  it('hiç kayıt yoksa ya da değer true değilse görülmemiş', () => {
    expect(turGorulduOku('ana_tur', depo({}))).toBe(false)
    expect(turGorulduOku('ana_tur', depo({ [ESKI_ANA_TUR_ANAHTARI]: 'false' }))).toBe(false)
  })
})
