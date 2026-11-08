import { describe, expect, it } from 'vitest'
import { SESLI_AD_TABLOSU, SESLI_SORU_ADLARI } from './sesli-adlar'
import { sesliMetniCoz } from './sesli-giris'
import { HAZIR_SABLONLAR } from './sablonlar'
import { dersinGrubu } from './toplu-grup'

/** Konuşmadaki adın sonuna gelen bütün desteklenen ek ve tamlayan biçimleri. */
const AD_BICIMLERI = [
  (ad: string) => ad,
  (ad: string) => `${ad}'i`,
  (ad: string) => `${ad}'e`,
  (ad: string) => `${ad}'de`,
  (ad: string) => `${ad}'den`,
  (ad: string) => `${ad}'le`,
  (ad: string) => `${ad}'im`,
  (ad: string) => `${ad} dersi`,
  (ad: string) => `${ad} dersinden`,
  (ad: string) => `${ad} testi`,
  (ad: string) => `${ad} testinde`,
  (ad: string) => `${ad} testinden`,
  (ad: string) => `${ad} soruları`,
  (ad: string) => `${ad} sorularından`,
] as const

const SORU_DURUMU = { sablonlar: HAZIR_SABLONLAR, varsayilanSablonId: 'tyt', kip: 'soru' as const }

describe('sesli ad tablosu', () => {
  it('her günlük ders adı ve ek biçimini Soru Takibi’nde kanonik derse yazar', () => {
    for (const ad of SESLI_SORU_ADLARI) {
      for (const bicim of AD_BICIMLERI) {
        const sonuc = sesliMetniCoz(`${bicim(ad.ad)} 10 soru çözdüm`, SORU_DURUMU)
        expect(sonuc.sorular, `${ad.ad} / ${bicim.name || 'biçim'}`).toEqual([
          { ders: ad.soruDersi, toplam: 10, dogru: 0, yanlis: 0 },
        ])
      }
    }
  })

  it('her şablonda geçerli ders/grup adını ve bütün ek biçimlerini deneme sonucuna yazar', () => {
    for (const sablon of HAZIR_SABLONLAR) {
      const secenek = { sablonlar: HAZIR_SABLONLAR, varsayilanSablonId: sablon.id, kip: 'deneme' as const }
      for (const ad of SESLI_AD_TABLOSU) {
        // "Edebiyat Sosyal 1" şablondaki iki ayrı sosyal alt testi kapsar;
        // mevcut toplu sonuç modeli yalnız Sosyal/Fen tutabildiğinden onu
        // sayıya bölmeden ders adı gibi kaydetmek güvenli değildir.
        if (ad.ad === 'edebiyat sosyal 1') continue
        const adayDersler = sablon.dersler.filter((ders) => ad.dersKimlikleri.includes(ders.id))
        // Aynı şablonda Tarih-1 ve Tarih-2 gibi birden çok hedefe giden yalın
        // adlar güvenle tek derse yazılamaz; çözücü bunları bilerek atlar.
        const ders = adayDersler.length === 1 ? adayDersler[0] : undefined
        const grup = ad.grup && sablon.dersler.filter((ders) => dersinGrubu(ders.id) === ad.grup).length >= 2 ? ad.grup : null
        if (!ders && !grup) continue
        for (const [bicimSirasi, bicim] of AD_BICIMLERI.entries()) {
          // 1 ve 2, bazı resmî AYT grup adlarının kendi parçasıdır; sonuç
          // sayısı sanılmaması için ayırt edici bir değer kullanılır.
          const sonuc = sesliMetniCoz(`${bicim(ad.ad)} 3 doğru 0 yanlış`, secenek)
          if (ders) {
            expect(sonuc.deneme?.dersler, `${sablon.id}: ${ad.ad} / ${bicimSirasi}`).toContainEqual({ dersId: ders.id, dogru: 3, yanlis: 0 })
          } else {
            expect(sonuc.deneme?.toplu, `${sablon.id}: ${ad.ad} / ${bicimSirasi}`).toContainEqual({ grup, dogru: 3, yanlis: 0 })
          }
        }
      }
    }
    // Bütün şablon × ad × ek birleşimi birkaç saniye sürer; varsayılan 5 sn sınırı dar.
  }, 60_000)
})
