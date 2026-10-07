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
  konuyuGosterenSecim,
  maarifSinifi,
  ogrenciMufredati,
  sekmeSecilebilir,
  sinifAtamasi,
  sinifKonulari,
  varsayilanSinifSecimi,
} from './sinif'
import { BOS_TAKIP, asamaYaz, konuBloklari, oncekiOkulsuzlar, sinifSekmeleri, type YksTakip } from './takip'

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

  it('tablo eşli bir konuyu ezmiyor ve listede olmayan kimlik taşımıyor', () => {
    const kimlikler = new Set(tumYksKonulari().map((k) => k.id))
    for (const id of Object.keys(MAARIF_SINIF)) {
      expect(kimlikler.has(id), id).toBe(true)
      expect(HARITA_ESLEMESI[id], id).toBeUndefined()
    }
  })

  it('eşli her konunun destelerinden bir sınıf okunuyor ve Maarif sınıfı o', () => {
    for (const [id, desteler] of Object.entries(HARITA_ESLEMESI)) {
      const sinif = eslemeSinifi(desteler)
      expect(sinif, id).not.toBeNull()
      expect(maarifSinifi(id), id).toBe(sinif)
    }
  })

  it('Maarif 12 vermiyor; "henüz yok" olan hiçbir konu haritaya eşli değil', () => {
    const yok = tumYksKonulari().filter((k) => maarifSinifi(k.id) === HENUZ_YOK)
    expect(yok.length).toBeGreaterThan(0)
    for (const k of tumYksKonulari()) expect(maarifSinifi(k.id), k.id).not.toBe(12)
    for (const k of yok) expect(HARITA_ESLEMESI[k.id], k.id).toBeUndefined()
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
const sira = (s: ReturnType<typeof sinifAtamasi>) => (s === HENUZ_YOK ? 13 : s)

describe('sinifKonulari ve konuBloklari', () => {
  it('sekmelerin birleşimi dersin bütün konuları, tekrar yok (eski program)', () => {
    for (const d of YKS_DERSLERI) {
      const birlesim = YKS_SINIFLARI.flatMap((s) => sinifKonulari(d, s, ESKI).map((k) => k.id))
      expect(new Set(birlesim).size, d.id).toBe(d.konular.length)
      expect(birlesim, d.id).toHaveLength(d.konular.length)
      expect(sinifKonulari(d, 'tumu', ESKI)).toHaveLength(d.konular.length)
    }
  })

  it('Maarif: 12 sekmesi boş, "henüz yok" konuları yalnız "Tümü"de', () => {
    for (const d of YKS_DERSLERI) {
      expect(sinifKonulari(d, 12, MAARIF), d.id).toEqual([])
      const sinifta = [9, 10, 11].flatMap((s) => sinifKonulari(d, s as 9 | 10 | 11, MAARIF).map((k) => k.id))
      const yok = d.konular.filter((k) => maarifSinifi(k.id) === HENUZ_YOK).map((k) => k.id)
      expect(sinifta.length + yok.length, d.id).toBe(d.konular.length)
      expect(sinifta.some((id) => yok.includes(id)), d.id).toBe(false)
      expect(sinifKonulari(d, 'tumu', MAARIF), d.id).toHaveLength(d.konular.length)
    }
  })

  it('sınıf içinde müfredat sırası korunuyor', () => {
    const mat = ders('tyt-matematik')
    const dokuz = sinifKonulari(mat, 9, MAARIF).map((k) => k.id)
    const sirali = mat.konular.map((k) => k.id).filter((id) => dokuz.includes(id))
    expect(dokuz).toEqual(sirali)
  })

  it('"Tümü" sınıf sınıf diziliyor, Maarif\'te "henüz yok" en sonda', () => {
    for (const ogrenci of [MAARIF, ESKI]) {
      const siniflar = sinifKonulari(ders('tyt-tarih'), 'tumu', ogrenci).map((k) => sira(sinifAtamasi(k.id, ogrenci)))
      expect(siniflar).toEqual([...siniflar].sort((a, b) => a - b))
    }
    const tumu = sinifKonulari(ders('tyt-tarih'), 'tumu', MAARIF).map((k) => k.id)
    expect(tumu.slice(-2)).toEqual(['tyt-tar-milli-mucadele', 'tyt-tar-ataturkculuk'])
  })

  it('bloklar: sınıfta bölüm, "Tümü"de sınıf + bölüm', () => {
    const mat = ders('tyt-matematik')
    const sinifta = konuBloklari(mat, 9, MAARIF)
    expect(sinifta.every((b) => b.sinif === null)).toBe(true)
    expect(sinifta.map((b) => b.bolum)).toEqual([null, 'Geometri'])
    const tumu = konuBloklari(mat, 'tumu', MAARIF)
    expect(tumu[0]).toMatchObject({ sinif: 9, bolum: null })
    expect(tumu.some((b) => b.sinif === 11 && b.bolum === 'Geometri')).toBe(true)
    expect(tumu.at(-1)).toMatchObject({ sinif: HENUZ_YOK, bolum: 'Geometri' })
    expect(tumu.flatMap((b) => b.konular)).toHaveLength(mat.konular.length)
    // Eski programda "henüz yok" bloğu yok; 12 bloğu 2018'in 12'si.
    const eski = konuBloklari(ders('ayt-matematik'), 'tumu', ESKI)
    expect(eski.some((b) => b.sinif === HENUZ_YOK)).toBe(false)
    expect(eski.at(-2)).toMatchObject({ sinif: 12, bolum: null })
  })
})

describe('varsayılan sekme', () => {
  const mat = ders('tyt-matematik')
  it('9–11 öğrencisi kendi sınıfında açılıyor', () => {
    expect(varsayilanSinifSecimi(mat, 9)).toBe(9)
    expect(varsayilanSinifSecimi(mat, 10)).toBe(10)
    expect(varsayilanSinifSecimi(mat, 11)).toBe(11)
  })

  it('12 ve mezun "Tümü"de', () => {
    expect(varsayilanSinifSecimi(mat, 12)).toBe('tumu')
    expect(varsayilanSinifSecimi(mat, 13)).toBe('tumu')
  })

  it('kendi sınıfında dersin konusu yoksa "Tümü"', () => {
    expect(varsayilanSinifSecimi(ders('ydt'), 11)).toBe('tumu')
    expect(varsayilanSinifSecimi(ders('ayt-tarih'), 10)).toBe('tumu')
  })
})

describe('sekmeSecilebilir — oturumdan geri yüklenen sekme', () => {
  it('Maarif\'te 12 seçilemiyor, eski programda seçilebiliyor', () => {
    const mat = ders('ayt-matematik')
    expect(sekmeSecilebilir(mat, 12, MAARIF)).toBe(false)
    expect(sekmeSecilebilir(mat, 12, ESKI)).toBe(true)
    expect(sekmeSecilebilir(mat, 'tumu', MAARIF)).toBe(true)
    expect(sekmeSecilebilir(ders('ayt-tarih'), 9, ESKI)).toBe(false)
  })
})

describe('konuyuGosterenSecim — "Devam et" ve Sıradaki', () => {
  it('konu seçili sekmedeyse sekme kalıyor, değilse konunun sınıfına geçiliyor', () => {
    expect(konuyuGosterenSecim('tyt-trk-paragraf', 9, MAARIF)).toBe(9)
    expect(konuyuGosterenSecim('tyt-trk-fiilimsi', 9, MAARIF)).toBe(10)
    expect(konuyuGosterenSecim('tyt-trk-fiilimsi', 9, ESKI)).toBe(11)
    expect(konuyuGosterenSecim('ayt-mat-turev', 11, ESKI)).toBe(12)
  })

  it('Maarif\'te "henüz yok" konusu için "Tümü"', () => {
    expect(konuyuGosterenSecim('ayt-mat-turev', 11, MAARIF)).toBe('tumu')
  })

  it('"Tümü" her konuyu gösteriyor', () => {
    expect(konuyuGosterenSecim('ayt-mat-turev', 'tumu', MAARIF)).toBe('tumu')
  })
})

describe('sinifSekmeleri', () => {
  const trk = ders('tyt-turkce')

  it('beş sekme; kendi sınıfında "sen"', () => {
    const sekmeler = sinifSekmeleri(trk, BOS_TAKIP, {}, 10)
    expect(sekmeler.map((s) => s.secim)).toEqual([9, 10, 11, 12, 'tumu'])
    expect(sekmeler.filter((s) => s.sen).map((s) => s.secim)).toEqual([10])
  })

  it('9–11 (Maarif): 12 pasif ve "Yakında", harita yok yazmıyor', () => {
    for (const ogrenci of [9, 10, 11]) {
      for (const d of YKS_DERSLERI) {
        const on_iki = sinifSekmeleri(d, BOS_TAKIP, {}, ogrenci).find((s) => s.secim === 12)!
        expect(on_iki, `${d.id} ${ogrenci}`).toMatchObject({ pasif: true, yakinda: true, haritasiz: false, yuzde: null })
      }
    }
  })

  it('12 ve mezun (eski program): 12 açık ve haritasız, "Yakında" yok', () => {
    for (const ogrenci of [12, 13]) {
      const sekmeler = sinifSekmeleri(trk, BOS_TAKIP, {}, ogrenci)
      expect(sekmeler.some((s) => s.yakinda)).toBe(false)
      expect(sekmeler.find((s) => s.secim === 12)).toMatchObject({ pasif: false, haritasiz: true, yuzde: 0 })
    }
  })

  it('konusu olmayan sınıf pasif ve yüzdesiz', () => {
    const sekmeler = sinifSekmeleri(ders('ayt-tarih'), BOS_TAKIP, {}, 12)
    expect(sekmeler.find((s) => s.secim === 9)).toMatchObject({ pasif: true, yuzde: null, yakinda: false })
    expect(sekmeler.find((s) => s.secim === 12)!.pasif).toBe(false)
  })

  it('yüzde satır dairelerinin ortalaması', () => {
    const dokuz = sinifKonulari(trk, 9, 9)
    let takip: YksTakip = BOS_TAKIP
    // Bir konu bitti (1), bir konunun haritalı üç aşamasından biri dolu (1/3).
    takip = asamaYaz(takip, dokuz[0].id, 'bitti', true, '2026-10-01')
    takip = asamaYaz(takip, dokuz[1].id, 'okul', true, '2026-10-01')
    const sekme = sinifSekmeleri(trk, takip, {}, 9).find((s) => s.secim === 9)!
    expect(sekme.yuzde).toBe(Math.round(((1 + 1 / 3) / dokuz.length) * 100))
    const on = sinifSekmeleri(trk, takip, {}, 9).find((s) => s.secim === 10)!
    expect(on.yuzde).toBe(0)
  })
})

describe('oncekiOkulsuzlar — sınıf sekmesiyle', () => {
  const mat = ders('tyt-matematik')

  it('sınıf sekmesinde yalnızca o sınıfın önceki konuları', () => {
    const ids = oncekiOkulsuzlar(mat, 'tyt-mat-polinom', BOS_TAKIP, { secim: 10, buYilSinif: ESKI })
    expect(ids.every((id) => sinifAtamasi(id, ESKI) === 10)).toBe(true)
    expect(ids).toContain('tyt-mat-carpanlara-ayirma')
    expect(ids).not.toContain('tyt-mat-temel-kavramlar')
    expect(ids.at(-1)).toBe('tyt-mat-polinom')
  })

  it('Maarif\'te görünmeyen konu sekmede yok sayılıyor', () => {
    expect(oncekiOkulsuzlar(mat, 'tyt-mat-polinom', BOS_TAKIP, { secim: 10, buYilSinif: MAARIF })).toEqual([])
  })

  it('"Tümü"de alt sınıflar üstte kaldığı için öncekiler arasında', () => {
    const ids = oncekiOkulsuzlar(mat, 'tyt-mat-polinom', BOS_TAKIP, { secim: 'tumu', buYilSinif: ESKI })
    expect(ids).toContain('tyt-mat-temel-kavramlar')
    // 11. sınıfın konusu (Çember) listede Polinomlar'dan sonra; dokunulmuyor.
    expect(ids.some((id) => sinifAtamasi(id, ESKI) === 11)).toBe(false)
  })

  it('sekmesiz çağrı eski davranış: dersin sırası', () => {
    expect(oncekiOkulsuzlar(mat, 'tyt-mat-ebob-ekok', BOS_TAKIP)).toEqual([
      'tyt-mat-temel-kavramlar',
      'tyt-mat-basamak',
      'tyt-mat-bolunebilme',
      'tyt-mat-ebob-ekok',
    ])
  })
})
