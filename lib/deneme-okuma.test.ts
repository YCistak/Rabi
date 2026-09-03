import { describe, expect, it } from 'vitest'
import { denemeyiCoz, okumaPuani, sablonOnerisi } from './deneme-okuma'
import { HAZIR_SABLONLAR } from './sablonlar'
import type { Sablon } from './types'

function sablon(id: string): Sablon {
  const bulunan = HAZIR_SABLONLAR.find((s) => s.id === id)
  if (!bulunan) throw new Error(`şablon yok: ${id}`)
  return bulunan
}

const TYT = sablon('tyt')
const AYT_SOZEL = sablon('ayt-soz')

/** Okunan sonucu karşılaştırması kolay bir nesneye çevirir. */
function tablo(metin: string, s: Sablon = TYT): Record<string, string> {
  return Object.fromEntries(
    denemeyiCoz(metin, s).okunanlar.map((o) => [o.dersId, `${o.dogru}/${o.yanlis}`]),
  )
}

describe('önerilen yazım', () => {
  it('"Matematik 38D 2Y" okunuyor', () => {
    expect(tablo('Matematik 38D 2Y')).toEqual({ matematik: '38/2' })
  })

  it('bütün bir TYT kâğıdı okunuyor', () => {
    const metin = [
      'TYT Deneme 3',
      'Türkçe 32D 5Y',
      'Tarih 4D 1Y',
      'Coğrafya 5D 0Y',
      'Felsefe 3D 2Y',
      'Din Kültürü 5D 0Y',
      'Matematik 38D 2Y',
      'Fizik 6D 1Y',
      'Kimya 7D 0Y',
      'Biyoloji 5D 1Y',
    ].join('\n')

    expect(tablo(metin)).toEqual({
      turkce: '32/5',
      tarih: '4/1',
      cografya: '5/0',
      felsefe: '3/2',
      din: '5/0',
      matematik: '38/2',
      fizik: '6/1',
      kimya: '7/0',
      biyoloji: '5/1',
    })
  })
})

describe('yazım değişkeleri', () => {
  it('boşluk, iki nokta ve küçük harf sorun değil', () => {
    expect(tablo('matematik: 38 d  2 y')).toEqual({ matematik: '38/2' })
  })

  it('Türkçe harfsiz yazılmış ders adı bulunuyor', () => {
    expect(tablo('turkce 32D 5Y')).toEqual({ turkce: '32/5' })
  })

  it('kısaltma tanınıyor', () => {
    expect(tablo('Mat 38D 2Y')).toEqual({ matematik: '38/2' })
  })

  it('"doğru" ve "yanlış" kelimeleri de işaret sayılıyor', () => {
    expect(tablo('Fizik 6 doğru 1 yanlış')).toEqual({ fizik: '6/1' })
  })

  it('işaret yoksa ilk iki sayı sırayla doğru ve yanlış', () => {
    // TYT Kimya 7 soru; 5 + 2 sığıyor.
    expect(tablo('Kimya 5 2')).toEqual({ kimya: '5/2' })
  })

  it('OCR iki dersi tek satıra birleştirse de ikisi de okunuyor', () => {
    // Bloklar birleşince satır sonu kaybolabiliyor; ders adları satır içinde
    // yerleriyle aranıyor, bu yüzden ayrım korunuyor.
    expect(tablo('Türkçe 32D 5Y Matematik 38D 2Y')).toEqual({
      turkce: '32/5',
      matematik: '38/2',
    })
  })

  it('başlık satırı sonuçları bozmuyor', () => {
    expect(tablo('3D Yayınları TYT\nMatematik 38D 2Y')).toEqual({ matematik: '38/2' })
  })
})

describe('şüphedeyken doldurmuyor', () => {
  it('yalnızca doğru yazılmışsa satır atlanıyor', () => {
    // "38D" tek başına yanlışın sıfır olduğunu söylemiyor; yazılmamış olabilir.
    const sonuc = denemeyiCoz('Matematik 38D', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toContain('Temel Matematik')
  })

  it('soru sayısını aşan sonuç atlanıyor', () => {
    // TYT Fizik 7 soru; 60+2 okunmuşsa sayı yanlış tanınmış demektir.
    const sonuc = denemeyiCoz('Fizik 60D 2Y', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toContain('Fizik')
  })

  it('iki derse birden uyan ad atlanıyor', () => {
    // AYT Sözel'de Tarih-1 ve Tarih-2 var; yalnızca "Tarih" ikisine de uyuyor.
    const sonuc = denemeyiCoz('Tarih 10D 2Y', AYT_SOZEL)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar.length).toBeGreaterThan(0)
  })

  it('numarası yazılmış tarih ayırt ediliyor', () => {
    expect(tablo('Tarih-1 9D 1Y\nTarih-2 8D 3Y', AYT_SOZEL)).toEqual({
      tarih1: '9/1',
      tarih2: '8/3',
    })
  })

  it('ders adındaki rakam sonuç sanılmıyor', () => {
    // "Tarih-1"deki 1, doğru sayısı olarak okunursa sonuç 1/9 çıkardı.
    expect(tablo('Tarih-1 9D 1Y', AYT_SOZEL)).toEqual({ tarih1: '9/1' })
  })

  it('aynı ders iki farklı sonuçla okunursa ikisi de atılıyor', () => {
    const sonuc = denemeyiCoz('Matematik 38D 2Y\nMatematik 30D 5Y', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toContain('Temel Matematik')
  })

  it('aynı ders aynı sonuçla iki kez okunursa sorun değil', () => {
    expect(tablo('Matematik 38D 2Y\nMatematik 38D 2Y')).toEqual({ matematik: '38/2' })
  })

  it('hiç ders bulunamazsa boş dönüyor', () => {
    const sonuc = denemeyiCoz('bir iki üç', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toEqual([])
  })

  it('boş metin çökmüyor', () => {
    expect(denemeyiCoz('', TYT)).toEqual({ okunanlar: [], atlananlar: [] })
  })
})

describe('okunan sıra şablonun sırası', () => {
  it('kâğıtta karışık yazılsa da kutular sırasında dönüyor', () => {
    const sonuc = denemeyiCoz('Biyoloji 5D 1Y\nTürkçe 32D 5Y\nMatematik 38D 2Y', TYT)
    expect(sonuc.okunanlar.map((o) => o.dersId)).toEqual(['turkce', 'matematik', 'biyoloji'])
  })
})

describe('şablon önerisi', () => {
  it('başka bir şablon daha çok ders okuyorsa öneriliyor', () => {
    // Tarih-2 yalnızca AYT Sözel'de var; öteki şablonlar o satırı okuyamıyor.
    const metin = 'Türk Dili ve Edebiyatı 20D 4Y\nTarih-1 9D 1Y\nTarih-2 8D 3Y\nCoğrafya-1 5D 1Y'
    expect(sablonOnerisi(metin, TYT, HAZIR_SABLONLAR)?.id).toBe('ayt-soz')
  })

  it('seçili şablon zaten en iyisiyse öneri yok', () => {
    const metin = 'Türkçe 32D 5Y\nMatematik 38D 2Y\nFizik 6D 1Y'
    expect(sablonOnerisi(metin, TYT, HAZIR_SABLONLAR)).toBeNull()
  })
})

describe('gerçek kâğıtlar', () => {
  // Aşağıdaki satırlar kullanıcının çektiği dokuz fotoğraftan alındı.
  // Hiçbiri önerilen yazımda değil; okuma gerçekte yazılana uymak zorunda.

  it('boş işareti yanlış sanılmıyor', () => {
    // Eski davranış: "2D 1B" -> 2 doğru 1 yanlış. TYT Coğrafya 5 soru,
    // 2 doğru 1 boş demek 2 yanlış demek.
    expect(tablo('Coğrafya: 2D 1B')).toEqual({ cografya: '2/2' })
  })

  it('doğru yazılmamışsa boştan çıkarılıyor', () => {
    // TYT Temel Matematik 40 soru: 40 - 15 - 20 = 5 yanlış.
    expect(tablo('Temel Matematik: 15D 20B')).toEqual({ matematik: '15/5' })
  })

  it('yanlış ile boş yazılmışsa doğru çıkarılıyor', () => {
    // TYT Türkçe 40 soru: 40 - 10 - 5 = 25 doğru.
    expect(tablo('Türkçe: 5B 10Y')).toEqual({ turkce: '25/10' })
  })

  it('sıra ters olsa da okunuyor', () => {
    expect(tablo('Coğrafya: 3Y 2D')).toEqual({ cografya: '2/3' })
  })

  it('yalnızca boş yazılmışsa satır atlanıyor', () => {
    // "Coğ: 1B" doğrunun kaç olduğunu söylemiyor.
    const sonuc = denemeyiCoz('Coğ: 1B', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toContain('Coğrafya')
  })

  it('alt satıra taşan sayı yukarıdaki derse bağlanıyor', () => {
    expect(tablo('Türkçe: 36D\n1B')).toEqual({ turkce: '36/3' })
  })

  it('taşan satır yalnızca sayıysa birleşiyor, ders adı varsa birleşmiyor', () => {
    expect(tablo('Türkçe: 32D 5Y\nMatematik: 38D 2Y')).toEqual({
      turkce: '32/5',
      matematik: '38/2',
    })
  })

  it('kısaltmalar tanınıyor', () => {
    const metin = 'Fels: 3D 1Y\nFiz: 2D 3Y\nKim: 4D 1Y\nBiy: 5D 1Y\nTar: 4D 1Y'
    expect(tablo(metin)).toEqual({
      felsefe: '3/1',
      fizik: '2/3',
      kimya: '4/1',
      biyoloji: '5/1',
      tarih: '4/1',
    })
  })

  it('numaralı kısaltma ayırt ediliyor', () => {
    expect(tablo('Tar1: 6D 4Y\nTar2: 5D 5Y\nCoğ1: 2D 1Y\nCoğ2: 6D 1Y', AYT_SOZEL)).toEqual({
      tarih1: '6/4',
      tarih2: '5/5',
      cografya1: '2/1',
      cografya2: '6/1',
    })
  })

  it('çıkarım eksiye düşerse atlanıyor', () => {
    // TYT Fizik 7 soru; 5 doğru + 9 boş olamaz.
    const sonuc = denemeyiCoz('Fizik: 5D 9B', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toContain('Fizik')
  })
})

describe('tek olasılık kalınca dolduruluyor', () => {
  it('"Full" hepsi doğru demek', () => {
    // TYT Tarih 5 soru.
    expect(tablo('Tarih: Full')).toEqual({ tarih: '5/0' })
  })

  it('doğru soru sayısına eşitse yanlış sıfırdır', () => {
    // "Din K.: 5D" -- 5 soruluk derste 5 doğru, yanlışa yer kalmıyor.
    expect(tablo('Din Kültürü: 5D')).toEqual({ din: '5/0' })
  })

  it('soru sayısının altındaki tek işaret hâlâ atlanıyor', () => {
    // "Felsefe: 1Y" -- geri kalan 4 sorunun kaçı doğru, bilinmiyor.
    const sonuc = denemeyiCoz('Felsefe: 1Y', TYT)
    expect(sonuc.okunanlar).toEqual([])
    expect(sonuc.atlananlar).toContain('Felsefe')
  })

  it('eksik harfli ders adı tanınıyor', () => {
    expect(tablo('Byoloji: 5D 1B')).toEqual({ biyoloji: '5/0' })
  })
})

describe('okuma puanı', () => {
  it('işaretli sayıları sayıyor', () => {
    expect(okumaPuani('Matematik 38D 2Y\nFizik 6D 1Y')).toBe(4)
  })

  it('gürültülü uzun metin, kısa doğru metni geçemiyor', () => {
    // Eşikleme kâğıttaki lekeleri harfe benzetebiliyor; uzunluğa bakan bir
    // ölçü o metni seçerdi.
    const gurultu = 'lmnop qrstuv wxyz abcdefgh ijklmno pqrstuvw xyzabcd efghijk'
    expect(okumaPuani(gurultu)).toBeLessThan(okumaPuani('Mat 38D 2Y'))
  })

  it('boş metnin puanı sıfır', () => {
    expect(okumaPuani('')).toBe(0)
  })
})
