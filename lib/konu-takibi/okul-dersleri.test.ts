import { describe, expect, it } from 'vitest'
import type { PuanTuru } from '../types'
import { YKS_DERSLERI, tumYksKonulari, yksDersBul } from './liste'
import {
  BIRLESEN_KONULAR,
  OKUL_DERSLERI,
  kaynakGorunur,
  satirKimlikleri,
  sinifDersleri,
  tumSinifDersleri,
} from './okul-dersleri'
import { HENUZ_YOK, YKS_SINIFLARI, maarifSinifi, sinifAtamasi } from './sinif'
import { BOS_TAKIP, asamaYaz, devamKonusu, dersOzeti, satirDurumu, satirYaz, siradakiKonu, takibiCoz } from './takip'

const BUGUN = '2026-10-07'
const MAARIF = 10
const ESKI = 12
const ALANLAR: (PuanTuru | null)[] = ['say', 'ea', 'soz', 'dil', null]

/** Bir öğrencinin bütün sınıflarda gördüğü kayıt kimlikleri, tekrarlı. */
const gorunenKimlikler = (alan: PuanTuru | null, ogrenci: number) =>
  tumSinifDersleri(alan, ogrenci).flatMap((d) => d.konular.flatMap((k) => [...satirKimlikleri(k)]))

describe('okul dersleri — birleştirme', () => {
  it('her YKS dersi tam bir okul dersinin kaynağı', () => {
    const kaynaklar = OKUL_DERSLERI.flatMap((d) => d.kaynaklar.map((k) => k.ders))
    expect([...kaynaklar].sort()).toEqual(YKS_DERSLERI.map((d) => d.id).sort())
    for (const id of kaynaklar) expect(yksDersBul(id), id).not.toBeNull()
  })

  it('TYT ve AYT aynı derste: Matematik, Fizik; Türkçe ile Edebiyat tek ders', () => {
    const kaynak = (id: string) => OKUL_DERSLERI.find((d) => d.id === id)!.kaynaklar.map((k) => k.ders)
    expect(kaynak('matematik')).toEqual(['tyt-matematik', 'ayt-matematik'])
    expect(kaynak('fizik')).toEqual(['tyt-fizik', 'ayt-fizik'])
    expect(kaynak('edebiyat')).toEqual(['tyt-turkce', 'ayt-edebiyat'])
    expect(OKUL_DERSLERI.find((d) => d.id === 'edebiyat')!.ad).toBe('Türk Dili ve Edebiyatı')
  })

  it('eski program: alan seçilmemişken (Dil ile birlikte) her konu tam bir kez görünüyor — kaybolan ya da çift yok', () => {
    const hepsi = [...gorunenKimlikler(null, ESKI), ...gorunenKimlikler('dil', ESKI).filter((id) => id.startsWith('ydt-'))]
    expect(new Set(hepsi).size).toBe(hepsi.length)
    expect([...hepsi].sort()).toEqual(tumYksKonulari().map((k) => k.id).sort())
  })

  it('Maarif: "henüz yok" dışındaki her konu tam bir kez, "henüz yok" hiçbir sınıfta', () => {
    const gorunen = gorunenKimlikler(null, MAARIF)
    expect(new Set(gorunen).size).toBe(gorunen.length)
    const beklenen = tumYksKonulari()
      .filter((k) => !k.id.startsWith('ydt-') && maarifSinifi(k.id) !== HENUZ_YOK)
      .map((k) => k.id)
    expect([...gorunen].sort()).toEqual(beklenen.sort())
    expect(sinifDersleri(12, null, MAARIF)).toEqual([])
  })

  it('her satır seçili sınıfa ait', () => {
    for (const ogrenci of [9, 10, 11, 12, 13]) {
      for (const sinif of YKS_SINIFLARI) {
        for (const d of sinifDersleri(sinif, null, ogrenci)) {
          for (const k of d.konular) {
            for (const id of satirKimlikleri(k)) expect(sinifAtamasi(id, ogrenci), `${ogrenci} ${id}`).toBe(sinif)
          }
        }
      }
    }
  })

  it('bir dersin sınıf listesinde aynı ad iki kez yok', () => {
    for (const alan of ALANLAR) {
      for (const ogrenci of [MAARIF, ESKI]) {
        for (const d of tumSinifDersleri(alan, ogrenci)) {
          const adlar = d.konular.map((k) => k.ad)
          expect(new Set(adlar).size, `${d.id} ${d.sinif}`).toBe(adlar.length)
        }
      }
    }
  })

  it('Türk Dili ve Edebiyatı bölümlerle: önce Dil ve Anlatım, sonra Edebiyat', () => {
    const tde = sinifDersleri(9, 'ea', ESKI).find((d) => d.id === 'edebiyat')!
    const bolumler = [...new Set(tde.konular.map((k) => k.bolum))]
    expect(bolumler).toEqual(['Dil ve Anlatım', 'Edebiyat'])
  })
})

describe('alan süzgeci', () => {
  const kimlikler = (alan: PuanTuru | null, ogrenci = ESKI) => new Set(gorunenKimlikler(alan, ogrenci))
  const dersKonulari = (id: string) => yksDersBul(id)!.konular.map((k) => k.id)

  it('TYT konuları her alana görünüyor', () => {
    for (const alan of ALANLAR) {
      const gorunen = kimlikler(alan)
      for (const ders of YKS_DERSLERI.filter((d) => d.oturum === 'tyt')) {
        for (const id of ders.konular.map((k) => k.id)) expect(gorunen.has(id), `${alan} ${id}`).toBe(true)
      }
    }
  })

  it('sayısal: AYT Mat, Fizik, Kimya, Biyoloji; Edebiyat, Tarih, Felsefe Grubu yok', () => {
    const g = kimlikler('say')
    for (const d of ['ayt-matematik', 'ayt-fizik', 'ayt-kimya', 'ayt-biyoloji']) expect(dersKonulari(d).every((id) => g.has(id)), d).toBe(true)
    for (const d of ['ayt-edebiyat', 'ayt-tarih', 'ayt-cografya', 'ayt-felsefe', 'ayt-din', 'ydt']) expect(dersKonulari(d).some((id) => g.has(id)), d).toBe(false)
  })

  it('eşit ağırlık: AYT Mat, Edebiyat, Tarih, Coğrafya', () => {
    const g = kimlikler('ea')
    for (const d of ['ayt-matematik', 'ayt-edebiyat', 'ayt-tarih', 'ayt-cografya']) expect(dersKonulari(d).every((id) => g.has(id)), d).toBe(true)
    for (const d of ['ayt-fizik', 'ayt-kimya', 'ayt-biyoloji', 'ayt-felsefe', 'ayt-din', 'ydt']) expect(dersKonulari(d).some((id) => g.has(id)), d).toBe(false)
  })

  it('sözel: Edebiyat, Tarih, Coğrafya, Felsefe Grubu, Din; AYT Mat yok', () => {
    const g = kimlikler('soz')
    for (const d of ['ayt-edebiyat', 'ayt-tarih', 'ayt-cografya', 'ayt-felsefe', 'ayt-din']) expect(dersKonulari(d).every((id) => g.has(id)), d).toBe(true)
    expect(dersKonulari('ayt-matematik').some((id) => g.has(id))).toBe(false)
  })

  it('YDT yalnız Dil alanında ve 12. sınıfta; Maarif öğrencisinde yok', () => {
    expect(kaynakGorunur(yksDersBul('ydt')!, null)).toBe(false)
    expect(kaynakGorunur(yksDersBul('ydt')!, 'dil')).toBe(true)
    for (const sinif of YKS_SINIFLARI) {
      const dil = sinifDersleri(sinif, 'dil', ESKI).some((d) => d.id === 'yabanci-dil')
      expect(dil, String(sinif)).toBe(sinif === 12)
    }
    expect(tumSinifDersleri('dil', MAARIF).some((d) => d.id === 'yabanci-dil')).toBe(false)
  })

  it('alan seçilmemişse bütün AYT dersleri (YDT hariç) görünüyor', () => {
    const g = kimlikler(null)
    for (const d of YKS_DERSLERI.filter((x) => x.oturum === 'ayt' && x.id !== 'ydt')) {
      expect(dersKonulari(d.id).every((id) => g.has(id)), d.id).toBe(true)
    }
  })
})

describe('birleşen TYT–AYT satırları', () => {
  const matOn = (alan: PuanTuru | null = 'say', ogrenci = ESKI) =>
    sinifDersleri(10, alan, ogrenci).find((d) => d.id === 'matematik')!
  const satir = (id: string, alan: PuanTuru | null = 'say', ogrenci = ESKI) =>
    matOn(alan, ogrenci).konular.find((k) => k.id === id)!

  it('aynı sınıfta çift tek satır: Fonksiyonlar ve Polinomlar (eski program, 10)', () => {
    expect(satirKimlikleri(satir('tyt-mat-fonksiyon'))).toEqual(['tyt-mat-fonksiyon', 'ayt-mat-fonksiyon'])
    expect(satirKimlikleri(satir('tyt-mat-polinom'))).toEqual(['tyt-mat-polinom', 'ayt-mat-polinom'])
    expect(matOn().konular.some((k) => k.id === 'ayt-mat-fonksiyon')).toBe(false)
  })

  it('AYT yarısı alan dışıysa birleşmiyor', () => {
    expect(satirKimlikleri(satir('tyt-mat-fonksiyon', 'soz'))).toEqual(['tyt-mat-fonksiyon'])
  })

  it('çift farklı sınıflara düşünce birleşmiyor (Maarif: Fonksiyonlar 10, Bileşke 11)', () => {
    expect(satirKimlikleri(satir('tyt-mat-fonksiyon', 'say', MAARIF))).toEqual(['tyt-mat-fonksiyon'])
    const onBir = sinifDersleri(11, 'say', MAARIF).find((d) => d.id === 'matematik')!
    expect(onBir.konular.some((k) => k.id === 'ayt-mat-fonksiyon')).toBe(true)
  })

  it('Maarif Fizik: İş-Enerji ve Manyetizma birleşiyor, Manyetizma satırı geniş adı alıyor', () => {
    const fiz = (s: 10 | 11) => sinifDersleri(s, 'say', MAARIF).find((d) => d.id === 'fizik')!
    const enerji = fiz(10).konular.find((k) => k.id === 'tyt-fiz-is-enerji')!
    expect(satirKimlikleri(enerji)).toEqual(['tyt-fiz-is-enerji', 'ayt-fiz-enerji-hareket'])
    const manyetizma = fiz(11).konular.find((k) => k.id === 'tyt-fiz-manyetizma')!
    expect(manyetizma.ad).toBe('Manyetizma ve Elektromanyetik İndüksiyon')
    expect(satirKimlikleri(manyetizma)).toEqual(['tyt-fiz-manyetizma', 'ayt-fiz-induksiyon'])
  })

  it('her çiftin kimlikleri listede', () => {
    const hepsi = new Set(tumYksKonulari().map((k) => k.id))
    for (const [a, b] of BIRLESEN_KONULAR) {
      expect(hepsi.has(a), a).toBe(true)
      expect(hepsi.has(b), b).toBe(true)
    }
  })

  it('eski kayıtta yalnız bir yarısı işaretliyse satır işaretli görünüyor — işaret kaybolmuyor', () => {
    const takip = takibiCoz({ surum: 2, konular: { 'ayt-mat-fonksiyon': { okul: '2026-09-01', bitti: '2026-09-03' } } })
    const durum = satirDurumu(satir('tyt-mat-fonksiyon'), takip, {})
    expect(durum.kayit).toEqual({ okul: '2026-09-01', bitti: '2026-09-03' })
    expect(durum.bitti).toBe(true)
  })

  it('satır iki kimliği birlikte işaretliyor ve kaldırıyor; kayıt şeması aynı', () => {
    const s = satir('tyt-mat-polinom')
    const once = asamaYaz(BOS_TAKIP, 'tyt-mat-polinom', 'okul', true, '2026-09-01')
    const sonra = satirYaz(once, s, 'okul', true, BUGUN)
    // Zaten işaretli yarının ilk günü korunuyor.
    expect(sonra.konular['tyt-mat-polinom']).toEqual({ okul: '2026-09-01' })
    expect(sonra.konular['ayt-mat-polinom']).toEqual({ okul: BUGUN })
    expect(satirDurumu(s, sonra, {}).kayit.okul).toBe('2026-09-01')
    const kaldirildi = satirYaz(sonra, s, 'okul', false, BUGUN)
    expect(kaldirildi).toEqual(BOS_TAKIP)
    expect(takibiCoz(JSON.parse(JSON.stringify(sonra)))).toEqual(sonra)
  })

  it('özet birleşen satırı bir konu sayıyor', () => {
    const ders = matOn()
    const takip = satirYaz(BOS_TAKIP, satir('tyt-mat-fonksiyon'), 'bitti', true, BUGUN)
    const ozet = dersOzeti(ders, takip, {})
    expect(ozet.toplam).toBe(ders.konular.length)
    expect(ozet.biten).toBe(1)
  })
})

describe('sınıf içinde öneri', () => {
  it('Sıradaki ve Devam et seçili sınıfın derslerinde', () => {
    const dersler = sinifDersleri(10, 'say', ESKI)
    let takip = asamaYaz(BOS_TAKIP, 'tyt-fiz-elektrik', 'okul', true, '2026-10-01')
    // Başka sınıfın konusu (9. sınıf Türkçe) daha yeni ama bu sınıfın önerisini etkilemiyor.
    takip = asamaYaz(takip, 'tyt-trk-paragraf', 'soru', true, '2026-10-05')
    const devam = devamKonusu(dersler, takip, {})
    expect(devam?.ders.id).toBe('fizik')
    expect(devam?.konu.id).toBe('tyt-fiz-elektrik')
    const mat = dersler.find((d) => d.id === 'matematik')!
    expect(siradakiKonu(mat, BOS_TAKIP, {})?.id).toBe(mat.konular[0].id)
  })
})
