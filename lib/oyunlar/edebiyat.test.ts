import { describe, expect, it } from 'vitest'
import { DONEM_ADI, EDEBIYAT_HAVUZU, type EdebiyatEsi } from './edebiyat-havuzu'
import { EL_BOYUTU, elHazirla, eslesiyorMu, yazariniBul } from './edebiyat'

/** Sabit sıra üreten sahte rastgele — testler tekrarlanabilir olsun. */
function sahteRastgele(degerler: number[]): () => number {
  let sira = 0
  return () => degerler[sira++ % degerler.length]
}

describe('edebiyat havuzu', () => {
  it('aynı eser iki kez geçmiyor', () => {
    const gorulen = new Set<string>()
    const tekrar = EDEBIYAT_HAVUZU.filter((e) => {
      if (gorulen.has(e.eser)) return true
      gorulen.add(e.eser)
      return false
    })
    expect(tekrar).toEqual([])
  })

  it('hiçbir alan boş değil', () => {
    const bos = EDEBIYAT_HAVUZU.filter((e) => e.eser.trim() === '' || e.yazar.trim() === '')
    expect(bos).toEqual([])
  })

  it('her dönemin adı tanımlı', () => {
    for (const es of EDEBIYAT_HAVUZU) {
      expect(DONEM_ADI[es.donem], es.eser).toBeTruthy()
    }
  })

  it('bir turu doldurmaya yetecek kadar eser var', () => {
    // 60 saniyede bir eli (6 eşleşme) birkaç kez bitirmek mümkün; havuz
    // bunun katı olmalı ki tur ortasında eser tükenmesin.
    expect(EDEBIYAT_HAVUZU.length).toBeGreaterThan(EL_BOYUTU * 10)
  })

  it('çoğu dönem tek başına el kurabiliyor', () => {
    // Tek dönemlik el oyunun asıl zorluğu; dönemlerin çoğu buna yetmezse
    // eller sürekli karışık kurulur ve oyun kolaylaşır.
    const yazarSayisi = new Map<string, Set<string>>()
    for (const es of EDEBIYAT_HAVUZU) {
      const kume = yazarSayisi.get(es.donem) ?? new Set<string>()
      kume.add(es.yazar)
      yazarSayisi.set(es.donem, kume)
    }
    const yeterli = [...yazarSayisi.values()].filter((k) => k.size >= EL_BOYUTU)
    expect(yeterli.length).toBeGreaterThanOrEqual(5)
  })
})

describe('elHazirla', () => {
  it('altı eser ve altı yazar verir', () => {
    const el = elHazirla()!
    expect(el.esler).toHaveLength(EL_BOYUTU)
    expect(el.eserler).toHaveLength(EL_BOYUTU)
    expect(el.yazarlar).toHaveLength(EL_BOYUTU)
  })

  it('bir elde aynı yazardan iki eser olmuyor', () => {
    // Olsaydı o yazarın tuşu iki esere birden uyar, doğru cevap yanlış sayılırdı.
    for (let i = 0; i < 300; i++) {
      const el = elHazirla()!
      expect(new Set(el.yazarlar).size, el.yazarlar.join(', ')).toBe(EL_BOYUTU)
    }
  })

  it('gösterilen adlar seçilen eşlerle birebir aynı', () => {
    const el = elHazirla()!
    expect([...el.eserler].sort()).toEqual(el.esler.map((e) => e.eser).sort())
    expect([...el.yazarlar].sort()).toEqual(el.esler.map((e) => e.yazar).sort())
  })

  it('iki sütun ayrı karıştırılıyor', () => {
    // Aynı sırada dursalardı eşleştirme okumadan, konuma bakarak yapılırdı.
    let farkliSira = 0
    for (let i = 0; i < 50; i++) {
      const el = elHazirla()!
      const eserSirasi = el.esler.map((e) => e.eser)
      if (el.eserler.join('|') !== eserSirasi.join('|')) farkliSira++
    }
    expect(farkliSira).toBeGreaterThan(0)
  })

  it('kullanılmış eserleri tekrar sormuyor', () => {
    const ilk = elHazirla()!
    const kullanilan = new Set(ilk.esler.map((e) => e.eser))
    const ikinci = elHazirla(kullanilan)!
    for (const es of ikinci.esler) {
      expect(kullanilan.has(es.eser), es.eser).toBe(false)
    }
  })

  it('yeterli eser kalmayınca null döner', () => {
    const hepsi = new Set(EDEBIYAT_HAVUZU.map((e) => e.eser))
    expect(elHazirla(hepsi)).toBeNull()
  })

  it('tek dönem yetiyorsa el o dönemden kurulur', () => {
    const el = elHazirla()!
    if (el.donem !== null) {
      expect(new Set(el.esler.map((e) => e.donem))).toEqual(new Set([el.donem]))
    }
  })

  it('tek dönem yetmezse karışık el kurar', () => {
    // Yapay bir havuz: her dönemde el kuracak kadar yazar yok, ama toplamda var.
    const havuz: EdebiyatEsi[] = [
      { eser: 'a1', yazar: 'y1', donem: 'ilk' , zorluk: 'orta' as const },
      { eser: 'a2', yazar: 'y2', donem: 'ilk' , zorluk: 'orta' as const },
      { eser: 'b1', yazar: 'y3', donem: 'divan' , zorluk: 'orta' as const },
      { eser: 'b2', yazar: 'y4', donem: 'divan' , zorluk: 'orta' as const },
      { eser: 'c1', yazar: 'y5', donem: 'halk' , zorluk: 'orta' as const },
      { eser: 'c2', yazar: 'y6', donem: 'halk' , zorluk: 'orta' as const },
    ]
    const el = elHazirla(new Set(), havuz)!
    expect(el.donem).toBeNull()
    expect(el.esler).toHaveLength(EL_BOYUTU)
  })

  it('aynı yazarlı havuzda el kurulamaz', () => {
    const havuz: EdebiyatEsi[] = Array.from({ length: 20 }, (_, i) => ({
      eser: `e${i}`,
      yazar: 'tek yazar',
      donem: 'divan' as const,
      zorluk: 'orta' as const,
    }))
    expect(elHazirla(new Set(), havuz, sahteRastgele([0.3, 0.7]))).toBeNull()
  })
})

describe('eşleştirme', () => {
  const el = elHazirla()!

  it('doğru çifti tanır', () => {
    const es = el.esler[0]
    expect(eslesiyorMu(el, es.eser, es.yazar)).toBe(true)
  })

  it('yanlış çifti reddeder', () => {
    const [ilk, ikinci] = el.esler
    expect(eslesiyorMu(el, ilk.eser, ikinci.yazar)).toBe(false)
  })

  it('eserin yazarını bulur', () => {
    const es = el.esler[2]
    expect(yazariniBul(el, es.eser)).toBe(es.yazar)
    expect(yazariniBul(el, 'olmayan eser')).toBeNull()
  })
})
