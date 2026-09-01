import { describe, expect, it } from 'vitest'
import { denemeyiCoz, sablonOnerisi } from './deneme-okuma'
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
