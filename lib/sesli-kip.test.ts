import { describe, expect, it } from 'vitest'
import { sesliMetniCoz, type SesliCozum, type SesliKip } from './sesli-giris'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import { BOS_BIRIKIM, birikimeEkle, denemeTuruSecildi, rabiCevabi } from './sesli-sohbet'
import type { Sablon } from './types'

const SABLONLAR: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)

function coz(metin: string, kip: SesliKip, sablonId = 'tyt'): SesliCozum {
  return sesliMetniCoz(metin, { sablonlar: SABLONLAR, varsayilanSablonId: sablonId, kip })
}

describe('iki kip — soru (Soru Takibi)', () => {
  const ornekler = Array.from({ length: 40 }, (_, sira) => {
    const toplam = 20 + sira
    const denemeVar = sira % 2 === 1
    const metin = `${sira % 5 === 0 ? 'selam rabi ' : ''}${toplam} matematik sorusu çözdüm${denemeVar ? ' sonra AYT denemesinde fizik 8 doğru 2 yanlış' : ''}${sira % 7 === 0 ? ' teşekkürler' : ''}`
    return {
      metin,
      beklenen: {
        sorular: [{ ders: 'Matematik', toplam, dogru: 0, yanlis: 0 }],
        deneme: null,
        anlasilmayan: [],
        ...(denemeVar ? { yanlisYer: 'deneme' as const } : {}),
      },
    }
  })

  it('en az 40 kesin örnek kapsar', () => {
    expect(ornekler).toHaveLength(40)
  })

  it.each(ornekler)('$metin', ({ metin, beklenen }) => {
    expect(coz(metin, 'soru')).toEqual(beklenen)
  })
})

describe('iki kip — deneme (Denemeler)', () => {
  const sablonlar = ['tyt', 'ayt-say', 'ayt-ea', 'okul'] as const
  const ornekler = Array.from({ length: 40 }, (_, sira) => {
    const sablonId = sablonlar[sira % sablonlar.length]!
    const dogru = 10 + (sira % 10)
    const yanlis = 1 + (sira % 3)
    const gunlukSoruVar = sira % 4 === 0
    const baskaTur = sira % 3 === 0 ? ' AYT denemesi' : ''
    const metin = `${sira % 5 === 0 ? 'merhaba ' : ''}${baskaTur} matematik ${dogru} doğru ${yanlis} yanlış${gunlukSoruVar ? ' bir de 50 Türkçe soru çözdüm' : ''}${sira % 7 === 0 ? ' sağ ol' : ''}`
    return {
      metin,
      sablonId,
      beklenen: {
        sorular: [],
        deneme: { sablonId, dersler: [{ dersId: 'matematik', dogru, yanlis }], toplu: [], toplamNet: null },
        anlasilmayan: [],
        ...(gunlukSoruVar ? { yanlisYer: 'soru' as const } : {}),
      },
    }
  })

  it('en az 40 kesin örnek; AYT sayısal, EA ve 9. sınıf şablonunu kapsar', () => {
    expect(ornekler).toHaveLength(40)
    expect(new Set(ornekler.map((ornek) => ornek.sablonId))).toEqual(new Set(sablonlar))
  })

  it.each(ornekler)('$metin', ({ metin, sablonId, beklenen }) => {
    expect(coz(metin, 'deneme', sablonId)).toEqual(beklenen)
  })

  it('seçili tür, boş mesajda da korunur; birikim aynı dersi yeniler', () => {
    expect(coz('', 'deneme', 'ayt-ea')).toEqual({
      sorular: [],
      deneme: { sablonId: 'ayt-ea', dersler: [], toplu: [], toplamNet: null },
      anlasilmayan: [],
    })
    const ilk = coz('matematik 20 doğru 5 yanlış', 'deneme', 'ayt-ea')
    const ikinci = coz('matematik 22 doğru 4 yanlış', 'deneme', 'ayt-ea')
    expect(birikimeEkle(birikimeEkle(BOS_BIRIKIM, ilk), ikinci).deneme?.dersler).toEqual([
      { dersId: 'matematik', dogru: 22, yanlis: 4 },
    ])
  })

  it('ders adı olmadan söylenen toplam soru da yanlış yerde sayılır', () => {
    expect(coz('bugün toplam 50 soru çözdüm', 'deneme', 'tyt')).toEqual({
      sorular: [],
      deneme: { sablonId: 'tyt', dersler: [], toplu: [], toplamNet: null },
      anlasilmayan: [],
      yanlisYer: 'soru',
    })
  })

  it('deneme cevabı tür ön eki taşımaz ve yanlış yerde uygun yönlendirmeyi verir', () => {
    const deneme = coz('türkçe 30 doğru 5 yanlış', 'deneme', 'tyt')
    expect(rabiCevabi(deneme, { sablonlar: SABLONLAR, mesajSirasi: 0, metin: 'türkçe 30 doğru 5 yanlış', kip: 'deneme' })[0]).toBe('Türkçe 30 doğru 5 yanlış.')
    expect(rabiCevabi(coz('50 matematik sorusu çözdüm', 'deneme'), { sablonlar: SABLONLAR, mesajSirasi: 0, metin: '50 matematik sorusu çözdüm', kip: 'deneme' }).join(' ')).toMatch(/Soru Takibi/)
    expect(denemeTuruSecildi('TYT')).toBe('TYT, tamam. Ders ders doğru ve yanlışlarını anlat.')
  })
})
