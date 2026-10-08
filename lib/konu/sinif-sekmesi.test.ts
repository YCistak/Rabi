import { describe, expect, it } from 'vitest'
import { programBul, sinifDersleri, tumKonular } from './index'
import { ilerlemeyiYaz, type KonuIlerlemeleri } from './ilerleme'
import {
  haritaAcilisSinifi,
  pencereBilgisi,
  sinifDegisimi,
  sinifOrtalamasi,
  sinifPasifMi,
  sinifSekmeleri,
  sinifYuzdesi,
  yonlendirmeMetni,
} from './sinif-sekmesi'

/** Bir programın ilk `adet` konusunu bitirilmiş (soruları geçilmiş) yazar. */
function bitir(ders: 'matematik' | 'tarih', sinif: 9 | 10 | 11, adet: number): KonuIlerlemeleri {
  const program = programBul(ders, sinif)!
  let ilerlemeler: KonuIlerlemeleri = {}
  for (const konu of tumKonular(program).slice(0, adet)) {
    ilerlemeler = ilerlemeyiYaz(
      ilerlemeler,
      konu.id,
      { okunan: konu.kartlar.length, bitti: true, dogru: konu.sorular.length },
      '2026-10-01',
    )
  }
  return ilerlemeler
}

describe('haritanın sınıf sekmesi', () => {
  it('dört sekme 9–12 sırasında; 12 pasif, ötekiler açık', () => {
    const sekmeler = sinifSekmeleri('matematik', {}, 10)
    expect(sekmeler.map((s) => s.sinif)).toEqual([9, 10, 11, 12])
    expect(sekmeler.map((s) => s.pasif)).toEqual([false, false, false, true])
    expect(sinifPasifMi(12)).toBe(true)
  })

  it('"sen" işareti yalnızca kullanıcının sınıfında, mezunda hiçbirinde', () => {
    expect(sinifSekmeleri('matematik', {}, 10).filter((s) => s.sen).map((s) => s.sinif)).toEqual([10])
    expect(sinifSekmeleri('matematik', {}, 12).filter((s) => s.sen).map((s) => s.sinif)).toEqual([12])
    expect(sinifSekmeleri('matematik', {}, null).some((s) => s.sen)).toBe(false)
  })

  it('yüzde seçili dersin o sınıftaki tamamlanmış konularından', () => {
    const toplam = tumKonular(programBul('matematik', 9)!).length
    const ilerlemeler = bitir('matematik', 9, 2)
    expect(sinifYuzdesi('matematik', 9, ilerlemeler)).toBe(Math.round((2 / toplam) * 100))
    // Başka sınıfın ilerlemesi bu sınıfa sızmıyor.
    expect(sinifYuzdesi('matematik', 10, ilerlemeler)).toBe(0)
    expect(sinifYuzdesi('matematik', 9, {})).toBe(0)
  })

  it('ders o sınıfta yoksa ya da sınıf pasifse yüzde yok', () => {
    expect(sinifYuzdesi('ingilizce', 9, {})).toBeNull()
    expect(sinifYuzdesi('matematik', 12, {})).toBeNull()
    expect(sinifSekmeleri('ingilizce', {}, 11).map((s) => s.yuzde)).toEqual([null, null, 0, null])
  })

  it('açılış sınıfı kullanıcının sınıfı; 12 içeriği olan en büyük sınıfa düşüyor', () => {
    expect(haritaAcilisSinifi(9)).toBe(9)
    expect(haritaAcilisSinifi(11)).toBe(11)
    expect(haritaAcilisSinifi(12)).toBe(11)
    expect(haritaAcilisSinifi(null)).toBeNull()
  })

  it('sınıf değişince ders varsa kalıyor, yoksa ilk derse geçip bunu söylüyor', () => {
    expect(sinifDegisimi({ ders: 'tarih', sinif: 9 }, 10)).toEqual({ secim: { ders: 'tarih', sinif: 10 }, bilgi: null })
    const degisim = sinifDegisimi({ ders: 'ingilizce', sinif: 11 }, 9)
    expect(degisim?.secim).toEqual({ ders: 'matematik', sinif: 9 })
    expect(degisim?.bilgi).toBe('İngilizce 9. sınıfta yok; Matematik açıldı.')
    // 11. sınıfın Türkçesi Edebiyat adıyla anılıyor.
    expect(sinifDegisimi({ ders: 'turkce', sinif: 11 }, 10)?.bilgi).toBeNull()
  })

  it('pasif sınıfa geçilmiyor', () => {
    expect(sinifDegisimi({ ders: 'matematik', sinif: 11 }, 12)).toBeNull()
  })

  it('yönlendirme şeridi yalnızca kendi sınıfından farklı bir sınıfa gidilince', () => {
    expect(yonlendirmeMetni('Trigonometri', 10, 11)).toBe('Trigonometri için 10. sınıfa geçildi')
    expect(yonlendirmeMetni('Trigonometri', 10, 10)).toBeNull()
    expect(yonlendirmeMetni('Trigonometri', 10, null)).toBeNull()
    // 12. sınıf öğrencisinin haritası 11'de açılıyor; 11'e gitmek yönlendirme değil.
    expect(yonlendirmeMetni('Türev', 11, 12)).toBeNull()
    expect(yonlendirmeMetni('Kümeler', 9, 12)).toBe('Kümeler için 9. sınıfa geçildi')
  })
})

describe('haritanın seçim penceresi', () => {
  it('sınıf yüzdesi o sınıftaki derslerin ortalaması; 12 boş', () => {
    const dersSayisi = sinifDersleri(9).length
    const mat = Math.round((2 / tumKonular(programBul('matematik', 9)!).length) * 100)
    expect(sinifOrtalamasi(9, bitir('matematik', 9, 2))).toBe(Math.round(mat / dersSayisi))
    expect(sinifOrtalamasi(9, {})).toBe(0)
    expect(sinifOrtalamasi(12, {})).toBeNull()
  })

  it('bakılan sınıfta seçili ders yoksa söylüyor, varsa ya da aynı sınıfsa susuyor', () => {
    expect(pencereBilgisi({ ders: 'ingilizce', sinif: 11 }, 9)).toBe('İngilizce 9. sınıfta yok, başka bir ders seç.')
    expect(pencereBilgisi({ ders: 'kimya', sinif: 10 }, 9)).toBeNull()
    expect(pencereBilgisi({ ders: 'ingilizce', sinif: 11 }, 11)).toBeNull()
    expect(pencereBilgisi({ ders: 'turkce', sinif: 10 }, 11)).toBeNull()
  })
})
