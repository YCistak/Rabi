import { describe, expect, it } from 'vitest'
import { MEZUN } from './hesap'
import { hazirKutulari, type HazirGirdisi } from './kurulum-hazir'
import { geriSayim } from './sinav-tarihi'

const BUGUN = '2026-10-08'

const temel: HazirGirdisi = {
  sinif: 11,
  puanTuru: 'say',
  hedef: {
    universite: 'Boğaziçi Üniversitesi',
    bolum: 'Bilgisayar Mühendisliği',
    puanTuru: 'say',
    tabanPuan: null,
    basariSirasi: null,
  },
  gunlukHedef: 200,
  hatirlatmaSaati: 20,
  hatirlatmaDakikasi: 0,
  bildirimAcik: true,
}

const satir = (girdi: Partial<HazirGirdisi>, kimlik: string) =>
  hazirKutulari({ ...temel, ...girdi }, BUGUN).find((k) => k.kimlik === kimlik)!

describe('hazirKutulari', () => {
  it('altı kutucuk, Oyunlar ve Pomodoro yok', () => {
    expect(hazirKutulari(temel, BUGUN).map((k) => k.kimlik)).toEqual([
      'konu',
      'denemeler',
      'hedef',
      'hatirlatma',
      'geri-sayim',
      'gunluk',
    ])
  })

  it('cevaplar alt satırlara geçer', () => {
    expect(satir({}, 'konu').satir).toBe('11. sınıf konuların hazır')
    expect(satir({}, 'denemeler').satir).toBe('Sayısal netlerini izle')
    expect(satir({}, 'hedef').satir).toBe('Boğaziçi · Bilgisayar Mühendisliği')
    expect(satir({}, 'hatirlatma').satir).toBe('Her gün 20:00')
    expect(satir({ hatirlatmaSaati: 7, hatirlatmaDakikasi: 5 }, 'hatirlatma').satir).toBe('Her gün 07:05')
    expect(satir({}, 'gunluk').ad).toBe('Günde 200 soru')
  })

  it('12. sınıfa ve mezuna olmayan konuyu vaat etmez', () => {
    expect(satir({ sinif: 12 }, 'konu').satir).toBe('Konu kartları seni bekliyor')
    expect(satir({ sinif: MEZUN }, 'konu').satir).toBe('Konu kartları seni bekliyor')
  })

  it('atlanan cevaplarda boş kutu kalmaz', () => {
    expect(satir({ puanTuru: null }, 'denemeler').satir).toBe('Netlerini izle')
    expect(satir({ hedef: null }, 'hedef').satir).toBe('Sonra seçebilirsin')
  })

  it('izin yoksa hatırlatma saati yazılmaz', () => {
    expect(satir({ bildirimAcik: false }, 'hatirlatma').satir).toBe("Ayarlar'dan açabilirsin")
  })

  it('geri sayım sınıfın kendi sınavına', () => {
    const kalan = geriSayim(BUGUN, 11).kalanGun
    expect(satir({}, 'geri-sayim').ad).toBe(`YKS'ye ${kalan} gün`)
  })
})
