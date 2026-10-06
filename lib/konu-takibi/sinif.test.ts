import { describe, expect, it } from 'vitest'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import { YKS_DERSLERI, tumYksKonulari, yksDersBul } from './liste'
import {
  ELLE_SINIFLAR,
  HARITASIZ_SINIF,
  YKS_SINIFLARI,
  eslemeSinifi,
  konuSinifi,
  konuyuGosterenSecim,
  sinifKonulari,
  varsayilanSinifSecimi,
} from './sinif'
import { BOS_TAKIP, asamaYaz, konuBloklari, oncekiOkulsuzlar, sinifSekmeleri, type YksTakip } from './takip'

const ders = (id: string) => yksDersBul(id)!

describe('konu sınıfı — veri', () => {
  it('her YKS konusunun bir sınıfı var: ya eşlemeden ya elle tablodan', () => {
    const eksik = tumYksKonulari().filter((k) => !HARITA_ESLEMESI[k.id] && ELLE_SINIFLAR[k.id] === undefined)
    expect(eksik.map((k) => k.id)).toEqual([])
  })

  it('elle tablo eşli bir konuyu ezmiyor ve listede olmayan kimlik taşımıyor', () => {
    const kimlikler = new Set(tumYksKonulari().map((k) => k.id))
    for (const id of Object.keys(ELLE_SINIFLAR)) {
      expect(kimlikler.has(id), id).toBe(true)
      expect(HARITA_ESLEMESI[id], id).toBeUndefined()
    }
  })

  it('eşli her konunun destelerinden bir sınıf okunuyor (önek biçimi kaymadı)', () => {
    for (const [id, desteler] of Object.entries(HARITA_ESLEMESI)) {
      expect(eslemeSinifi(desteler), id).not.toBeNull()
    }
  })

  it('12 olan hiçbir konu haritaya eşli değil', () => {
    const on_iki = tumYksKonulari().filter((k) => konuSinifi(k.id) === HARITASIZ_SINIF)
    expect(on_iki.length).toBeGreaterThan(0)
    for (const k of on_iki) expect(HARITA_ESLEMESI[k.id], k.id).toBeUndefined()
  })

  it('eşli konu destelerinin sınıfını alıyor', () => {
    expect(konuSinifi('tyt-trk-paragraf')).toBe(9)
    expect(konuSinifi('tyt-trk-fiilimsi')).toBe(10)
    expect(konuSinifi('tyt-fiz-optik')).toBe(11)
    expect(konuSinifi('tyt-tar-xx-yuzyil')).toBe(11)
  })

  it('YKS 12. sınıf konuları 12', () => {
    for (const id of ['ayt-mat-limit', 'ayt-mat-turev', 'ayt-mat-integral', 'tyt-tar-milli-mucadele', 'tyt-tar-ataturkculuk', 'ayt-edb-cumhuriyet']) {
      expect(konuSinifi(id), id).toBe(12)
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

describe('sinifKonulari ve konuBloklari', () => {
  it('sınıfların birleşimi dersin bütün konuları, tekrar yok', () => {
    for (const d of YKS_DERSLERI) {
      const birlesim = YKS_SINIFLARI.flatMap((s) => sinifKonulari(d, s).map((k) => k.id))
      expect(new Set(birlesim).size).toBe(d.konular.length)
      expect(sinifKonulari(d, 'tumu')).toHaveLength(d.konular.length)
    }
  })

  it('sınıf içinde müfredat sırası korunuyor', () => {
    const mat = ders('tyt-matematik')
    const dokuz = sinifKonulari(mat, 9).map((k) => k.id)
    const sirali = mat.konular.map((k) => k.id).filter((id) => dokuz.includes(id))
    expect(dokuz).toEqual(sirali)
  })

  it('"Tümü" sınıf sınıf diziliyor', () => {
    const siniflar = sinifKonulari(ders('tyt-tarih'), 'tumu').map((k) => konuSinifi(k.id))
    expect(siniflar).toEqual([...siniflar].sort((a, b) => a - b))
  })

  it('bloklar: sınıfta bölüm, "Tümü"de sınıf + bölüm', () => {
    const mat = ders('tyt-matematik')
    const sinifta = konuBloklari(mat, 9)
    expect(sinifta.every((b) => b.sinif === null)).toBe(true)
    expect(sinifta.map((b) => b.bolum)).toEqual([null, 'Geometri'])
    const tumu = konuBloklari(mat, 'tumu')
    expect(tumu[0]).toMatchObject({ sinif: 9, bolum: null })
    expect(tumu.some((b) => b.sinif === 11 && b.bolum === 'Geometri')).toBe(true)
    expect(tumu.flatMap((b) => b.konular)).toHaveLength(mat.konular.length)
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

describe('konuyuGosterenSecim — "Devam et" ve Sıradaki', () => {
  it('konu seçili sekmedeyse sekme kalıyor, değilse konunun sınıfına geçiliyor', () => {
    expect(konuyuGosterenSecim('tyt-trk-paragraf', 9)).toBe(9)
    expect(konuyuGosterenSecim('tyt-trk-fiilimsi', 9)).toBe(10)
    expect(konuyuGosterenSecim('ayt-mat-turev', 11)).toBe(12)
  })

  it('"Tümü" her konuyu gösteriyor', () => {
    expect(konuyuGosterenSecim('ayt-mat-turev', 'tumu')).toBe('tumu')
  })
})

describe('sinifSekmeleri', () => {
  const trk = ders('tyt-turkce')

  it('beş sekme; kendi sınıfında "sen", 12 haritasız', () => {
    const sekmeler = sinifSekmeleri(trk, BOS_TAKIP, {}, 10)
    expect(sekmeler.map((s) => s.secim)).toEqual([9, 10, 11, 12, 'tumu'])
    expect(sekmeler.filter((s) => s.sen).map((s) => s.secim)).toEqual([10])
    expect(sekmeler.filter((s) => s.haritasiz).map((s) => s.secim)).toEqual([12])
  })

  it('konusu olmayan sınıf pasif ve yüzdesiz', () => {
    const sekmeler = sinifSekmeleri(ders('ayt-tarih'), BOS_TAKIP, {}, 11)
    const dokuz = sekmeler.find((s) => s.secim === 9)!
    expect(dokuz).toMatchObject({ pasif: true, yuzde: null })
    expect(sekmeler.find((s) => s.secim === 12)!.pasif).toBe(false)
  })

  it('yüzde satır dairelerinin ortalaması', () => {
    const dokuz = sinifKonulari(trk, 9)
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
    const ids = oncekiOkulsuzlar(mat, 'tyt-mat-polinom', BOS_TAKIP, 10)
    expect(ids.every((id) => konuSinifi(id) === 10)).toBe(true)
    expect(ids).toContain('tyt-mat-ebob-ekok')
    expect(ids).not.toContain('tyt-mat-temel-kavramlar')
    expect(ids.at(-1)).toBe('tyt-mat-polinom')
  })

  it('"Tümü"de alt sınıflar üstte kaldığı için öncekiler arasında', () => {
    const ids = oncekiOkulsuzlar(mat, 'tyt-mat-polinom', BOS_TAKIP, 'tumu')
    expect(ids).toContain('tyt-mat-temel-kavramlar')
    // 11. sınıfın konusu (Çember) listede Polinomlar'dan sonra; dokunulmuyor.
    expect(ids.some((id) => konuSinifi(id) === 11)).toBe(false)
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
