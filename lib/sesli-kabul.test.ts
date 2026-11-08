/**
 * Kabul testleri: Emre'nin uygulamada gerçekten yazdığı/söylediği cümleler
 * (2026-11-08 ekran görüntüleri), birebir yazımlarıyla. Beklentiler KESİNDİR;
 * çözücü bunlara uyar, bu dosyadaki beklenti değiştirilmez (operatör yazdı).
 */
import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import { sesliMetniCoz } from './sesli-giris'
import { rabiCevabi } from './sesli-sohbet'
import type { Sablon } from './types'

const sablonlar: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)
const coz = (metin: string) => sesliMetniCoz(metin, { sablonlar, varsayilanSablonId: 'tyt' })
const cevap = (metin: string) =>
  rabiCevabi(coz(metin), { sablonlar, mesajSirasi: 0, hedefeKalan: null, metin }).join(' ')

describe('kabul — Emre’nin cümleleri', () => {
  it('selam + günlük soru + DERS sorularının + kalanları ise boştu', () => {
    const metin =
      "Merhaba abi  bugün 50 tane matematik sorusu çözdüm  matematik sorularının 20'si doğru 10 tanesi yanlış kalanları ise boştu"
    const c = coz(metin)
    expect(c.sorular).toEqual([{ ders: 'Matematik', toplam: 50, dogru: 20, yanlis: 10 }])
    expect(c.deneme).toBeNull()
    expect(c.anlasilmayan).toEqual([])
    const r = cevap(metin)
    expect(r).toMatch(/^Merhaba/)
    expect(r).not.toMatch(/anlayamadım/)
  })

  it('yalnız selam: anlayamadım denmez', () => {
    expect(coz('Merhaba').anlasilmayan).toEqual([])
    expect(cevap('Merhaba')).not.toMatch(/anlayamadım/)
  })

  it('hiç çözmedim: anlayamadım denmez', () => {
    const c = coz('Bugün hiç soru çözmedim')
    expect(c.sorular).toEqual([])
    expect(c.anlasilmayan).toEqual([])
    expect(cevap('Bugün hiç soru çözmedim')).not.toMatch(/anlayamadım/)
  })

  it('önce günlük soru, sonra deneme: deneme dersleri günlüğe karışmaz', () => {
    const metin =
      "bugün 50 Türkçe çözdüm 10 tanesi doğru 30 tanesi boş denemeye girdim denemede tyt denemesi bu arada  10 tane Türkçe doğrusu yaptım 20'si yanlıştı matematikten 20 doğru 20 yanlış yaptım"
    const c = coz(metin)
    expect(c.sorular).toEqual([{ ders: 'Türkçe', toplam: 50, dogru: 10, yanlis: 10 }])
    expect(c.deneme).toMatchObject({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 10, yanlis: 20 },
        { dersId: 'matematik', dogru: 20, yanlis: 20 },
      ],
    })
    expect(c.anlasilmayan).toEqual([])
  })

  it('aynı cümlenin devamı: imkânsız Sosyal/Fen (40 > 20) anlaşılmayana, gerisi bozulmaz', () => {
    const metin =
      "bugün 50 Türkçe çözdüm 10 tanesi doğru 30 tanesi boş denemeye girdim denemede tyt denemesi bu arada  10 tane Türkçe doğrusu yaptım 20'si yanlıştı matematikten 20 doğru 20 yanlış yaptım  Sosyalden 10 doğru 30 yanlış fenden ise 20 doğru 20 yanlış"
    const c = coz(metin)
    expect(c.sorular).toEqual([{ ders: 'Türkçe', toplam: 50, dogru: 10, yanlis: 10 }])
    expect(c.deneme?.dersler).toEqual([
      { dersId: 'turkce', dogru: 10, yanlis: 20 },
      { dersId: 'matematik', dogru: 20, yanlis: 20 },
    ])
    expect(c.deneme?.toplu ?? []).toEqual([])
    expect(c.anlasilmayan.length).toBe(2)
  })

  it('SONUÇ … DERS yaptım sırası', () => {
    const metin =
      'tyt denemesine girdim 20 doğru 20 yanlış Türkçe yaptım 10 doğru 30 yanlış matematik yaptım'
    const c = coz(metin)
    expect(c.sorular).toEqual([])
    expect(c.deneme).toMatchObject({
      sablonId: 'tyt',
      dersler: [
        { dersId: 'turkce', dogru: 20, yanlis: 20 },
        { dersId: 'matematik', dogru: 10, yanlis: 30 },
      ],
    })
    expect(c.anlasilmayan).toEqual([])
  })

  it('yalın "sosyal" ve "fen" denemede toplu sonuçtur (Emre: "direkt sosyal 20 doğru 0 yanlış")', () => {
    const c = coz('tyt denemesine girdim türkçe 30 doğru 5 yanlış sosyal 15 doğru 2 yanlış fen 12 doğru 3 yanlış')
    expect(c.deneme?.dersler).toEqual([{ dersId: 'turkce', dogru: 30, yanlis: 5 }])
    expect(c.deneme?.toplu).toEqual([
      { grup: 'sosyal', dogru: 15, yanlis: 2 },
      { grup: 'fen', dogru: 12, yanlis: 3 },
    ])
    expect(c.anlasilmayan).toEqual([])
  })

  it('"sosyal 20 doğru 0 yanlış" tek başına TYT denemesinde', () => {
    const c = coz('TYT denemesi sosyal 20 doğru 0 yanlış')
    expect(c.deneme?.toplu).toEqual([{ grup: 'sosyal', dogru: 20, yanlis: 0 }])
    expect(c.anlasilmayan).toEqual([])
  })

  it('teşekkür niyeti: "Ben buradayım" değil, teşekküre karşılık', () => {
    for (const m of ['teşekkürler', 'Teşekkürler', 'teşekkür ederim', 'sağ ol', 'sağol', 'eyvallah']) {
      for (let sira = 0; sira < 5; sira++) {
        const r = rabiCevabi(coz(m), { sablonlar, mesajSirasi: sira, hedefeKalan: null, metin: m }).join(' ')
        expect(r, `${m} / ${sira}`).not.toMatch(/burada|anlayamadım/i)
      }
    }
  })

  it('"sosyalden 20 net" toplam net değildir, deneme toplam netine yazılmaz', () => {
    const c = coz('TYT denemesinde sosyalden 12 net yaptım')
    expect(c.deneme?.toplamNet ?? null).toBeNull()
  })
})
