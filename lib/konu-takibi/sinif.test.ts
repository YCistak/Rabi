import { describe, expect, it } from 'vitest'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import { YKS_DERSLERI, tumYksKonulari, yksDersBul } from './liste'
import {
  ESKI_SINIF,
  HARITASIZ_SINIF,
  HENUZ_YOK,
  MAARIF_SINIF,
  YKS_SINIFLARI,
  eskiSinifi,
  eslemeSinifi,
  maarifSinifi,
  ogrenciMufredati,
  sinifAtamasi,
  sinifKonulari,
  sinifMi,
  varsayilanSinif,
} from './sinif'
import { sinifDersleri } from './okul-dersleri'
import {
  BOS_TAKIP,
  asamaYaz,
  konuBloklari,
  oncekiOkulsuzlar,
  satirlarinKimlikleri,
  sinifSekmeleri,
  type YksTakip,
} from './takip'

const ders = (id: string) => yksDersBul(id)!

describe('müfredat seçimi', () => {
  it('12 ve mezun eski program, 9–11 Maarif, bilinmeyen Maarif', () => {
    expect(ogrenciMufredati(9)).toBe('maarif')
    expect(ogrenciMufredati(10)).toBe('maarif')
    expect(ogrenciMufredati(11)).toBe('maarif')
    expect(ogrenciMufredati(12)).toBe('eski')
    expect(ogrenciMufredati(13)).toBe('eski')
    expect(ogrenciMufredati(Number.NaN)).toBe('maarif')
  })

  it('sinifAtamasi müfredata göre tablo seçiyor', () => {
    // Polinomlar: 2018'de 10, Maarif 9–11'de yok.
    for (const s of [9, 10, 11]) expect(sinifAtamasi('tyt-mat-polinom', s)).toBe(HENUZ_YOK)
    for (const s of [12, 13]) expect(sinifAtamasi('tyt-mat-polinom', s)).toBe(10)
    // XX. yüzyıl başları: Maarif 11 (harita), 2018'de 12. sınıf İnkılap Tarihi.
    expect(sinifAtamasi('tyt-tar-xx-yuzyil', 10)).toBe(11)
    expect(sinifAtamasi('tyt-tar-xx-yuzyil', 12)).toBe(12)
    // Optik: Maarif 11 (harita), 2018'de 10.
    expect(sinifAtamasi('tyt-fiz-optik', 9)).toBe(11)
    expect(sinifAtamasi('tyt-fiz-optik', 13)).toBe(10)
  })
})

describe('eski program tablosu (2018)', () => {
  it('her YKS konusunun 9–12 arası bir sınıfı var, fazladan kimlik yok', () => {
    const kimlikler = tumYksKonulari().map((k) => k.id)
    for (const id of kimlikler) expect(YKS_SINIFLARI, id).toContain(ESKI_SINIF[id])
    expect(Object.keys(ESKI_SINIF).sort()).toEqual([...kimlikler].sort())
  })

  it('bilinen 2018 yerleri', () => {
    const beklenen: Record<string, number> = {
      'tyt-mat-polinom': 10,
      'ayt-mat-limit': 12,
      'ayt-mat-turev': 12,
      'ayt-mat-integral': 12,
      'tyt-biy-bolunme': 10,
      'ayt-edb-divan': 10,
      'ayt-edb-tanzimat': 11,
      'ayt-edb-servetifunun': 11,
      'ayt-edb-cumhuriyet': 12,
      'tyt-tar-milli-mucadele': 12,
      'tyt-tar-ataturkculuk': 12,
      'ayt-fiz-tork': 11,
      'ayt-kim-organik': 12,
    }
    for (const [id, sinif] of Object.entries(beklenen)) expect(eskiSinifi(id), id).toBe(sinif)
  })
})

describe('Maarif tablosu', () => {
  it('her konunun yeri var: eşlemeden ya da tablodan', () => {
    const eksik = tumYksKonulari().filter((k) => !HARITA_ESLEMESI[k.id] && MAARIF_SINIF[k.id] === undefined)
    expect(eksik.map((k) => k.id)).toEqual([])
  })

  it('tablo 9–11 destesine eşli bir konuyu ezmiyor ve listede olmayan kimlik taşımıyor', () => {
    const kimlikler = new Set(tumYksKonulari().map((k) => k.id))
    for (const id of Object.keys(MAARIF_SINIF)) {
      expect(kimlikler.has(id), id).toBe(true)
      // Yalnız 12. sınıf (2018) destesine eşli konu tabloda kalır: önek okunmuyor.
      expect(eslemeSinifi(HARITA_ESLEMESI[id] ?? []), id).toBeNull()
    }
  })

  it('eşli her konunun Maarif sınıfı: 9–11 destesi varsa ondan, yalnız 12 destesiyse tablodan', () => {
    for (const [id, desteler] of Object.entries(HARITA_ESLEMESI)) {
      const sinif = eslemeSinifi(desteler)
      if (sinif === null) {
        expect(desteler.every((d) => /^[a-z]+12-/.test(d)), id).toBe(true)
        expect(maarifSinifi(id), id).toBe(MAARIF_SINIF[id])
      } else {
        expect(maarifSinifi(id), id).toBe(sinif)
      }
    }
  })

  it('Maarif 12 vermiyor; "henüz yok" olan hiçbir konu 9–11 haritasına eşli değil', () => {
    const yok = tumYksKonulari().filter((k) => maarifSinifi(k.id) === HENUZ_YOK)
    expect(yok.length).toBeGreaterThan(0)
    for (const k of tumYksKonulari()) expect(maarifSinifi(k.id), k.id).not.toBe(12)
    for (const k of yok) expect(eslemeSinifi(HARITA_ESLEMESI[k.id] ?? []), k.id).toBeNull()
  })

  it('12. sınıf Matematik destelerine eşli konular Maarif\'te yine "henüz yok"', () => {
    for (const id of ['ayt-mat-diziler', 'ayt-mat-trig-formul', 'ayt-mat-turev', 'ayt-geo-cember-analitik']) {
      expect(HARITA_ESLEMESI[id]?.length, id).toBeGreaterThan(0)
      expect(maarifSinifi(id), id).toBe(HENUZ_YOK)
    }
    expect(eslemeSinifi(['mat12-limit'])).toBeNull()
  })

  it('eşli konu destelerinin sınıfını alıyor', () => {
    expect(maarifSinifi('tyt-trk-paragraf')).toBe(9)
    expect(maarifSinifi('tyt-trk-fiilimsi')).toBe(10)
    expect(maarifSinifi('tyt-fiz-optik')).toBe(11)
    expect(maarifSinifi('tyt-tar-xx-yuzyil')).toBe(11)
  })

  it('2018 programının 12. sınıf konuları Maarif\'te "henüz yok"', () => {
    for (const id of ['ayt-mat-limit', 'ayt-mat-turev', 'ayt-mat-integral', 'tyt-tar-milli-mucadele', 'tyt-tar-ataturkculuk', 'ayt-edb-cumhuriyet']) {
      expect(maarifSinifi(id), id).toBe(HENUZ_YOK)
    }
  })
})

describe('eslemeSinifi — çok sınıflı eşleme', () => {
  it('en çok desteye sahip sınıf kazanıyor', () => {
    expect(eslemeSinifi(['trk9-tiyatro', 'trk11-karagoz', 'trk11-tiyatro'])).toBe(11)
    expect(eslemeSinifi(['fzk9-hareket', 'fzk9-temel-kuvvet', 'fzk10-sabit-hiz'])).toBe(9)
  })

  it('eşitlikte en erken sınıf', () => {
    expect(eslemeSinifi(['trk9-siir', 'trk10-ahenk'])).toBe(9)
    expect(eslemeSinifi(['fzk10-sabit-ivme', 'fzk11-serbest'])).toBe(10)
  })

  it('önek okunamazsa null', () => {
    expect(eslemeSinifi(['bilinmeyen'])).toBeNull()
    expect(eslemeSinifi([])).toBeNull()
  })
})

// Bir Maarif (10) ve bir eski program (12) öğrencisi.
const MAARIF = 10
const ESKI = 12

describe('sinifKonulari', () => {
  it('sınıfların birleşimi dersin bütün konuları, tekrar yok (eski program)', () => {
    for (const d of YKS_DERSLERI) {
      const birlesim = YKS_SINIFLARI.flatMap((s) => sinifKonulari(d, s, ESKI).map((k) => k.id))
      expect(new Set(birlesim).size, d.id).toBe(d.konular.length)
      expect(birlesim, d.id).toHaveLength(d.konular.length)
    }
  })

  it('Maarif: 12 boş, "henüz yok" konuları hiçbir sınıfta yok', () => {
    for (const d of YKS_DERSLERI) {
      expect(sinifKonulari(d, 12, MAARIF), d.id).toEqual([])
      const sinifta = [9, 10, 11].flatMap((s) => sinifKonulari(d, s as 9 | 10 | 11, MAARIF).map((k) => k.id))
      const yok = d.konular.filter((k) => maarifSinifi(k.id) === HENUZ_YOK).map((k) => k.id)
      expect(sinifta.length + yok.length, d.id).toBe(d.konular.length)
      expect(sinifta.some((id) => yok.includes(id)), d.id).toBe(false)
    }
  })

  it('sınıf içinde müfredat sırası korunuyor', () => {
    const mat = ders('tyt-matematik')
    const dokuz = sinifKonulari(mat, 9, MAARIF).map((k) => k.id)
    const sirali = mat.konular.map((k) => k.id).filter((id) => dokuz.includes(id))
    expect(dokuz).toEqual(sirali)
  })
})

describe('varsayılan sınıf', () => {
  it('9–12 kendi sınıfı, mezun 12, bilinmeyen 9', () => {
    expect(varsayilanSinif(9)).toBe(9)
    expect(varsayilanSinif(10)).toBe(10)
    expect(varsayilanSinif(11)).toBe(11)
    expect(varsayilanSinif(12)).toBe(12)
    expect(varsayilanSinif(13)).toBe(12)
    expect(varsayilanSinif(Number.NaN)).toBe(9)
  })

  it('oturumdan okunan değer: yalnız 9–12', () => {
    expect(sinifMi(9)).toBe(true)
    expect(sinifMi(12)).toBe(true)
    expect(sinifMi(13)).toBe(false)
    expect(sinifMi(Number('tyt'))).toBe(false)
  })
})

describe('sinifSekmeleri — ekranın üstü', () => {
  it('dört sekme (TYT/AYT ve "Tümü" yok); kendi sınıfında "sen"', () => {
    const sekmeler = sinifSekmeleri('say', 10, BOS_TAKIP, {})
    expect(sekmeler.map((s) => s.sinif)).toEqual([9, 10, 11, 12])
    expect(sekmeler.filter((s) => s.sen).map((s) => s.sinif)).toEqual([10])
    expect(sinifSekmeleri('say', 13, BOS_TAKIP, {}).some((s) => s.sen)).toBe(false)
  })

  it('9–11 (Maarif): 12 pasif ve "Yakında", öteki sınıflar açık', () => {
    for (const ogrenci of [9, 10, 11]) {
      for (const alan of ['say', 'ea', 'soz', 'dil', null] as const) {
        const sekmeler = sinifSekmeleri(alan, ogrenci, BOS_TAKIP, {})
        expect(sekmeler.find((s) => s.sinif === 12), `${alan} ${ogrenci}`).toMatchObject({
          pasif: true,
          yakinda: true,
          haritasiz: false,
          yuzde: null,
        })
        expect(sekmeler.filter((s) => s.sinif !== 12).every((s) => !s.pasif)).toBe(true)
      }
    }
  })

  it('12 ve mezun (eski program): 12 açık, "Yakında" yok; harita yalnız Matematik görünüyorsa var', () => {
    for (const ogrenci of [12, 13]) {
      const sekmeler = sinifSekmeleri('ea', ogrenci, BOS_TAKIP, {})
      expect(sekmeler.some((s) => s.yakinda)).toBe(false)
      // EA'da AYT Matematik görünüyor ve 12. sınıf konuları mat12 destelerine eşli.
      expect(sekmeler.find((s) => s.sinif === 12)).toMatchObject({ pasif: false, haritasiz: false, yuzde: 0 })
    }
  })

  it('yüzde, sınıftaki bütün satırların dairelerinin ortalaması', () => {
    const satirlar = sinifDersleri(9, 'say', 9).flatMap((d) => d.konular)
    let takip: YksTakip = BOS_TAKIP
    // Bir konu bitti (1), haritasız bir konunun iki aşamasından biri dolu (1/2).
    takip = asamaYaz(takip, 'tyt-trk-sozcukte-anlam', 'bitti', true, '2026-10-01')
    takip = asamaYaz(takip, 'tyt-din-bilgi-inanc', 'okul', true, '2026-10-01')
    const sekmeler = sinifSekmeleri('say', 9, takip, {})
    expect(sekmeler.find((s) => s.sinif === 9)!.yuzde).toBe(Math.round(((1 + 1 / 2) / satirlar.length) * 100))
    expect(sekmeler.find((s) => s.sinif === 10)!.yuzde).toBe(0)
  })
})

describe('konuBloklari ve oncekiOkulsuzlar — sınıfın ders listesi', () => {
  const mat = (ogrenci: number, sinif: 9 | 10 | 11 | 12) =>
    sinifDersleri(sinif, 'say', ogrenci).find((d) => d.id === 'matematik')!

  it('bloklar bölüm bölüm: bölümsüz önce, sonra Geometri', () => {
    expect(konuBloklari(mat(MAARIF, 9)).map((b) => b.bolum)).toEqual([null, 'Geometri'])
  })

  it('"bu ve öncekiler" yalnız o sınıfın, aynı bölümün önceki satırları', () => {
    const on = mat(ESKI, 10)
    const satirlar = oncekiOkulsuzlar(on, 'tyt-mat-polinom', BOS_TAKIP)
    expect(satirlar.map((s) => s.id)).toEqual(['tyt-mat-carpanlara-ayirma', 'tyt-mat-fonksiyon', 'tyt-mat-polinom'])
    // Birleşen satırlar iki kimliği de yazıyor.
    expect(satirlarinKimlikleri(satirlar)).toEqual([
      'tyt-mat-carpanlara-ayirma',
      'tyt-mat-fonksiyon',
      'ayt-mat-fonksiyon',
      'tyt-mat-polinom',
      'ayt-mat-polinom',
    ])
    expect(satirlar.every((s) => sinifAtamasi(s.id, ESKI) === 10)).toBe(true)
  })

  it('Maarif\'te görünmeyen konu listede yok', () => {
    expect(oncekiOkulsuzlar(mat(MAARIF, 10), 'tyt-mat-polinom', BOS_TAKIP)).toEqual([])
  })
})
