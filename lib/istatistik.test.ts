import { describe, expect, it } from 'vitest'
import {
  denemeKarsilastir,
  grupNeti,
  ilerleyenDersler,
  istatistikOzeti,
  secimGuncelle,
  yon,
} from './istatistik'
import { HAZIR_SABLONLAR } from './sablonlar'
import type { Deneme, Sablon } from './types'

const sablon: Sablon = {
  id: 's',
  ad: 'Deneme',
  tur: 'tyt',
  yanlisKatsayi: 4,
  hazir: false,
  dersler: [
    { id: 'tr', ad: 'Türkçe', soruSayisi: 40 },
    { id: 'mat', ad: 'Matematik', soruSayisi: 40 },
    { id: 'fel', ad: 'Felsefe', soruSayisi: 5 },
  ],
}

function deneme(id: string, tarih: string, tr: number, mat: number, fel: number): Deneme {
  return {
    id,
    sablonId: 's',
    ad: id,
    tarih,
    sonuclar: [
      { dersId: 'tr', dogru: tr, yanlis: 0 },
      { dersId: 'mat', dogru: mat, yanlis: 0 },
      { dersId: 'fel', dogru: fel, yanlis: 0 },
    ],
  }
}

describe('istatistikOzeti', () => {
  it('deneme yoksa null döner', () => {
    expect(istatistikOzeti([], sablon)).toBeNull()
  })

  it('tek denemede önceki ve ders farkı yok', () => {
    const o = istatistikOzeti([deneme('a', '2026-05-01', 20, 10, 3)], sablon)!
    expect(o.oncekiNet).toBeNull()
    expect(o.degisimler).toEqual([])
    expect(o.sonNet).toBe(33)
  })

  it('son deneme tarihten seçiliyor, kayıt sırasından değil', () => {
    const o = istatistikOzeti(
      [deneme('yeni', '2026-06-01', 30, 20, 4), deneme('eski', '2026-05-01', 20, 10, 5)],
      sablon,
    )!
    expect(o.sonNet).toBe(54)
    expect(o.oncekiNet).toBe(35)
    expect(o.sonDortNet).toEqual([35, 54])
    expect(ilerleyenDersler(o.degisimler).map((d) => d.dersId)).toEqual(['tr', 'mat'])
  })

  it('güçlü ders ham nete değil orana göre', () => {
    // Felsefe 5/5 (%100), Türkçe 30/40 (%75)
    const o = istatistikOzeti([deneme('a', '2026-05-01', 30, 10, 5)], sablon)!
    expect(o.enGucluDers).toBe('Felsefe')
    expect(o.enZayifDers).toBe('Matematik')
  })
})

describe('denemeKarsilastir', () => {
  it('A her zaman eski deneme', () => {
    const eski = deneme('e', '2026-05-01', 20, 10, 5)
    const yeni = deneme('y', '2026-06-01', 25, 8, 5)
    const k = denemeKarsilastir(yeni, eski, sablon)
    expect(k.a.id).toBe('e')
    expect(k.toplamFark).toBe(3)
    expect(k.artanlar.map((s) => s.dersId)).toEqual(['tr'])
    expect(k.azalanlar.map((s) => s.dersId)).toEqual(['mat'])
    expect(k.sabitler.map((s) => s.dersId)).toEqual(['fel'])
  })

  it('çeyrek netlerin kayan nokta artığı "değişmedi"yi bozmuyor', () => {
    expect(yon(0.1 + 0.2 - 0.3)).toBe('ayni')
  })
})

describe('secimGuncelle', () => {
  it('üçüncü seçim en eskisini düşürür, aynı seçim kaldırır', () => {
    expect(secimGuncelle(['a', 'b'], 'c')).toEqual(['b', 'c'])
    expect(secimGuncelle(['a', 'b'], 'a')).toEqual(['b'])
    expect(secimGuncelle([], 'a')).toEqual(['a'])
  })
})

describe('grupNeti', () => {
  const tyt: Sablon = {
    id: 'tyt',
    ad: 'TYT',
    tur: 'tyt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'turkce', ad: 'Türkçe', soruSayisi: 40 },
      { id: 'fizik', ad: 'Fizik', soruSayisi: 7 },
      { id: 'kimya', ad: 'Kimya', soruSayisi: 7 },
      { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 6 },
    ],
  }

  it('şablonda grup yoksa null döner', () => {
    const tekDers: Sablon = {
      id: 'tek',
      ad: 'Tek',
      tur: 'tyt',
      yanlisKatsayi: 4,
      hazir: false,
      dersler: [{ id: 'fizik', ad: 'Fizik', soruSayisi: 10 }],
    }
    const d: Deneme = {
      id: '1',
      sablonId: 'tek',
      ad: '1',
      tarih: '2026-05-01',
      sonuclar: [{ dersId: 'fizik', dogru: 5, yanlis: 0 }],
    }
    expect(grupNeti(d, tekDers, 'fen')).toBeNull()
  })

  it('denemede grubun hiç verisi yoksa null döner', () => {
    const d: Deneme = {
      id: '1',
      sablonId: 'tyt',
      ad: '1',
      tarih: '2026-05-01',
      sonuclar: [{ dersId: 'turkce', dogru: 30, yanlis: 0 }],
    }
    expect(grupNeti(d, tyt, 'fen')).toBeNull()
  })

  it('grup toplu girildiyse toplu satırın netini hesaplar', () => {
    const d: Deneme = {
      id: '1',
      sablonId: 'tyt',
      ad: '1',
      tarih: '2026-05-01',
      sonuclar: [{ dersId: 'turkce', dogru: 30, yanlis: 0 }],
      toplu: [{ grup: 'fen', dogru: 10, yanlis: 2 }],
    }
    // 10 - 2/4 = 9.5
    expect(grupNeti(d, tyt, 'fen')).toBe(9.5)
  })

  it('grup ders ders girildiyse üye derslerin net toplamını hesaplar', () => {
    const d: Deneme = {
      id: '1',
      sablonId: 'tyt',
      ad: '1',
      tarih: '2026-05-01',
      sonuclar: [
        { dersId: 'fizik', dogru: 5, yanlis: 0 },
        { dersId: 'kimya', dogru: 4, yanlis: 4 }, // 3 net
        { dersId: 'biyoloji', dogru: 6, yanlis: 0 }, // 6 net
      ],
    }
    // 5 + 3 + 6 = 14
    expect(grupNeti(d, tyt, 'fen')).toBe(14)
  })
})

describe('toplu grup girişi', () => {
  const tyt: Sablon = {
    id: 'tyt',
    ad: 'TYT',
    tur: 'tyt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'turkce', ad: 'Türkçe', soruSayisi: 40 },
      { id: 'fizik', ad: 'Fizik', soruSayisi: 7 },
      { id: 'kimya', ad: 'Kimya', soruSayisi: 7 },
      { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 6 },
    ],
  }
  const dersDers: Deneme = {
    id: 'a',
    sablonId: 'tyt',
    ad: 'a',
    tarih: '2026-05-01',
    sonuclar: [
      { dersId: 'turkce', dogru: 30, yanlis: 0 },
      { dersId: 'fizik', dogru: 5, yanlis: 0 },
      { dersId: 'kimya', dogru: 5, yanlis: 0 },
      { dersId: 'biyoloji', dogru: 5, yanlis: 0 },
    ],
  }
  const toplu: Deneme = {
    id: 'b',
    sablonId: 'tyt',
    ad: 'b',
    tarih: '2026-05-08',
    sonuclar: [{ dersId: 'turkce', dogru: 32, yanlis: 0 }],
    toplu: [{ grup: 'fen', dogru: 10, yanlis: 0 }],
  }

  it('ikisi de ders ders girildiyse eski davranış korunur (ders ders kıyaslanır)', () => {
    const d1: Deneme = {
      id: 'd1',
      sablonId: 'tyt',
      ad: 'd1',
      tarih: '2026-05-01',
      sonuclar: [
        { dersId: 'turkce', dogru: 30, yanlis: 0 },
        { dersId: 'fizik', dogru: 4, yanlis: 0 },
        { dersId: 'kimya', dogru: 4, yanlis: 0 },
        { dersId: 'biyoloji', dogru: 4, yanlis: 0 },
      ],
    }
    const d2: Deneme = {
      id: 'd2',
      sablonId: 'tyt',
      ad: 'd2',
      tarih: '2026-05-08',
      sonuclar: [
        { dersId: 'turkce', dogru: 32, yanlis: 0 },
        { dersId: 'fizik', dogru: 5, yanlis: 0 },
        { dersId: 'kimya', dogru: 4, yanlis: 0 },
        { dersId: 'biyoloji', dogru: 3, yanlis: 0 },
      ],
    }
    const k = denemeKarsilastir(d1, d2, tyt)
    expect(k.artanlar.map((s) => s.dersId)).toEqual(['turkce', 'fizik'])
    expect(k.sabitler.map((s) => s.dersId)).toEqual(['kimya'])
    expect(k.azalanlar.map((s) => s.dersId)).toEqual(['biyoloji'])
    expect(k.topluGruplar).toEqual([])

    const o = istatistikOzeti([d1, d2], tyt)!
    expect(o.degisimler.map((d) => d.dersId)).toEqual(['turkce', 'fizik', 'kimya', 'biyoloji'])
    expect(o.dersIlerleyisleri.map((d) => d.dersId)).toEqual([
      'turkce',
      'fizik',
      'kimya',
      'biyoloji',
      'fen-toplam',
    ])
  })

  it('biri toplu biri ders ders ise grup satırı olarak karşılaştırılır', () => {
    // dersDers: Fen 5+5+5 = 15 net, turkce 30 net
    // toplu: Fen 10 net (toplu), turkce 32 net
    const k = denemeKarsilastir(dersDers, toplu, tyt)
    expect(k.artanlar.map((s) => s.dersId)).toEqual(['turkce'])
    expect(k.azalanlar.map((s) => s.dersId)).toEqual(['fen'])
    expect(k.azalanlar[0]).toEqual({
      dersId: 'fen',
      ad: 'Fen',
      onceki: 15,
      son: 10,
      fark: -5,
      toplu: true,
    })
    expect(k.toplamFark).toBe(-3)

    const o = istatistikOzeti([dersDers, toplu], tyt)!
    expect(o.degisimler.map((d) => d.dersId)).toEqual(['turkce', 'fen'])
    expect(o.sonNet).toBe(42)
    expect(o.topluNotlari).toEqual([{ grup: 'fen', ad: 'Fen', denemeSayisi: 1 }])
    // Biyoloji ortalaması yalnız ders ders girilen denemeden: 5/6, en güçlü o.
    expect(o.enGucluDers).toBe('Biyoloji')
  })

  it("Emre'nin örneği (9. sınıf seviye tespit şablonu, okul)", () => {
    const okul = HAZIR_SABLONLAR.find((s) => s.id === 'okul')!
    expect(okul).toBeDefined()

    // A denemesi: 95 net (Sosyal toplu 10 D 20 Y = 5 net, Fen toplu 30 net; Edebiyat 30, Mat 30)
    const denemeA: Deneme = {
      id: 'emre-a',
      sablonId: 'okul',
      ad: 'Deneme A',
      tarih: '2026-05-01',
      sonuclar: [
        { dersId: 'edebiyat', dogru: 30, yanlis: 0 },
        { dersId: 'matematik', dogru: 30, yanlis: 0 },
      ],
      toplu: [
        { grup: 'sosyal', dogru: 10, yanlis: 20 },
        { grup: 'fen', dogru: 30, yanlis: 0 },
      ],
    }

    // B denemesi: 120 net (hepsi tam ders ders)
    const denemeB: Deneme = {
      id: 'emre-b',
      sablonId: 'okul',
      ad: 'Deneme B',
      tarih: '2026-05-15',
      sonuclar: [
        { dersId: 'edebiyat', dogru: 30, yanlis: 0 },
        { dersId: 'matematik', dogru: 30, yanlis: 0 },
        { dersId: 'tarih', dogru: 12, yanlis: 0 },
        { dersId: 'cografya', dogru: 12, yanlis: 0 },
        { dersId: 'din', dogru: 6, yanlis: 0 },
        { dersId: 'fizik', dogru: 10, yanlis: 0 },
        { dersId: 'kimya', dogru: 10, yanlis: 0 },
        { dersId: 'biyoloji', dogru: 10, yanlis: 0 },
      ],
    }

    const k = denemeKarsilastir(denemeA, denemeB, okul)
    expect(k.aNet).toBe(95)
    expect(k.bNet).toBe(120)
    expect(k.toplamFark).toBe(25)

    // Kazandığın netlerde Sosyal (+25 net, toplu etiketiyle)
    expect(k.artanlar).toEqual([
      { dersId: 'sosyal', ad: 'Sosyal', onceki: 5, son: 30, fark: 25, toplu: true },
    ])
    // Kaybettiğin netler boş
    expect(k.azalanlar).toEqual([])
    // Değişmeyen netlerde Edebiyat, Matematik ve Fen (şablon sırası)
    expect(k.sabitler.map((s) => s.dersId)).toEqual(['edebiyat', 'matematik', 'fen'])
    expect(k.sabitler.find((s) => s.dersId === 'fen')?.toplu).toBe(true)

    // En büyük sıçrama: Sosyal (25 net)
    expect(k.artanlar[0].ad).toBe('Sosyal')
    expect(k.artanlar[0].fark).toBe(25)

    // İstatistik özeti: en çok ilerleyen derslerde Sosyal ilk sırada
    const o = istatistikOzeti([denemeA, denemeB], okul)!
    const ilerleyen = ilerleyenDersler(o.degisimler)
    expect(ilerleyen[0].ad).toBe('Sosyal')
    expect(ilerleyen[0].fark).toBe(25)
    expect(ilerleyen[0].toplu).toBe(true)

    // Ders bazında ilerleyişte Sosyal ve Fen serileri
    expect(o.dersIlerleyisleri.find((d) => d.dersId === 'sosyal-toplam')).toEqual({
      dersId: 'sosyal-toplam',
      ad: 'Sosyal (toplam)',
      onceki: 5,
      son: 30,
      fark: 25,
      toplu: true,
    })
    expect(o.dersIlerleyisleri.find((d) => d.dersId === 'fen-toplam')).toEqual({
      dersId: 'fen-toplam',
      ad: 'Fen (toplam)',
      onceki: 30,
      son: 30,
      fark: 0,
      toplu: true,
    })
  })

  it('toplu yoksa not boş', () => {
    expect(istatistikOzeti([dersDers], tyt)!.topluNotlari).toEqual([])
  })
})
