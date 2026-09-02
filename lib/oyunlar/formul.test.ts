import { describe, expect, it } from 'vitest'
import { FORMUL_HAVUZU, TUR_ADI, type FormulEsi } from './formul-havuzu'
import { EL_BOYUTU, adiniBul, elHazirla, eslesiyorMu, formulParcalari } from './formul'
import { ZORLUKLAR } from './ritim'

describe('formül havuzu', () => {
  it('aynı formül iki kez geçmiyor', () => {
    const formuller = FORMUL_HAVUZU.map((e) => e.formul)
    expect(new Set(formuller).size).toBe(formuller.length)
  })

  it('aynı ad iki kez geçmiyor', () => {
    // İki formülün adı aynı olsaydı o adın tuşu ikisine birden uyar, doğru
    // eşleştirme yanlış sayılırdı.
    const adlar = FORMUL_HAVUZU.map((e) => e.ad)
    expect(new Set(adlar).size).toBe(adlar.length)
  })

  it('hiçbir alan boş değil', () => {
    const bos = FORMUL_HAVUZU.filter((e) => e.formul.trim() === '' || e.ad.trim() === '')
    expect(bos).toEqual([])
  })

  it('formüllerde alt indise inmeyecek karakter yok', () => {
    // Çizim tarafı **her** rakamı alt indise indiriyor (`formulParcalari`);
    // değerlik gösteren Roma rakamları bu yüzden adda duruyor, formülde değil.
    for (const es of FORMUL_HAVUZU) {
      expect(es.formul, es.ad).toMatch(/^[A-Za-z0-9()]+$/)
    }
  })

  it('her türün adı tanımlı', () => {
    for (const es of FORMUL_HAVUZU) {
      expect(TUR_ADI[es.tur], es.formul).toBeTruthy()
    }
  })

  it('her zorlukta bileşik var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(FORMUL_HAVUZU.filter((e) => e.zorluk === zorluk).length, zorluk).toBeGreaterThan(5)
    }
  })

  it('bir turu doldurmaya yetecek kadar bileşik var', () => {
    // 60 saniyede bir eli (6 eşleşme) birkaç kez bitirmek mümkün; havuz bunun
    // katı olmalı ki tur ortasında bileşik tükenmesin.
    expect(FORMUL_HAVUZU.length).toBeGreaterThan(EL_BOYUTU * 5)
  })

  it('her tür tek başına el kurabiliyor', () => {
    // Tek türlü el oyunun asıl zorluğu: karışık elde öğrenci formüle değil
    // biçime bakıp eliyor ("OH ile bitiyorsa bazdır").
    const sayilar = new Map<string, number>()
    for (const es of FORMUL_HAVUZU) sayilar.set(es.tur, (sayilar.get(es.tur) ?? 0) + 1)
    for (const [tur, adet] of sayilar) {
      expect(adet, tur).toBeGreaterThanOrEqual(EL_BOYUTU)
    }
  })
})

describe('formulParcalari', () => {
  it('rakamları alt indise ayırır', () => {
    expect(formulParcalari('H2SO4')).toEqual([
      { metin: 'H', alt: false },
      { metin: '2', alt: true },
      { metin: 'SO', alt: false },
      { metin: '4', alt: true },
    ])
  })

  it('rakamsız formülü tek parça bırakır', () => {
    expect(formulParcalari('NaOH')).toEqual([{ metin: 'NaOH', alt: false }])
  })

  it('parantezli formülde rakam parantezin dışında kalır', () => {
    expect(formulParcalari('Ca(OH)2')).toEqual([
      { metin: 'Ca(OH)', alt: false },
      { metin: '2', alt: true },
    ])
  })

  it('bitişik rakamlar tek parça', () => {
    expect(formulParcalari('C6H12O6')).toEqual([
      { metin: 'C', alt: false },
      { metin: '6', alt: true },
      { metin: 'H', alt: false },
      { metin: '12', alt: true },
      { metin: 'O', alt: false },
      { metin: '6', alt: true },
    ])
  })

  it('parçaları birleştirmek formülün kendisini veriyor', () => {
    for (const es of FORMUL_HAVUZU) {
      expect(
        formulParcalari(es.formul)
          .map((p) => p.metin)
          .join(''),
        es.formul,
      ).toBe(es.formul)
    }
  })
})

describe('elHazirla', () => {
  it('altı formül ve altı ad verir', () => {
    const el = elHazirla()!
    expect(el.esler).toHaveLength(EL_BOYUTU)
    expect(el.formuller).toHaveLength(EL_BOYUTU)
    expect(el.adlar).toHaveLength(EL_BOYUTU)
  })

  it('bir elde aynı formül iki kez yok', () => {
    for (let i = 0; i < 200; i++) {
      const el = elHazirla()!
      expect(new Set(el.formuller).size, el.formuller.join(', ')).toBe(EL_BOYUTU)
      expect(new Set(el.adlar).size, el.adlar.join(', ')).toBe(EL_BOYUTU)
    }
  })

  it('gösterilen adlar seçilen eşlerle birebir aynı', () => {
    const el = elHazirla()!
    expect([...el.formuller].sort()).toEqual(el.esler.map((e) => e.formul).sort())
    expect([...el.adlar].sort()).toEqual(el.esler.map((e) => e.ad).sort())
  })

  it('iki sütun ayrı karıştırılıyor', () => {
    // Aynı sırada dursalardı eşleştirme okumadan, konuma bakarak yapılırdı.
    let farkliSira = 0
    for (let i = 0; i < 50; i++) {
      const el = elHazirla()!
      const kaynakSira = el.esler.map((e) => e.formul).join('|')
      if (el.formuller.join('|') !== kaynakSira) farkliSira++
    }
    expect(farkliSira).toBeGreaterThan(0)
  })

  it('kullanılmış formülleri tekrar sormuyor', () => {
    const ilk = elHazirla()!
    const kullanilan = new Set(ilk.esler.map((e) => e.formul))
    const ikinci = elHazirla(kullanilan)!
    for (const es of ikinci.esler) {
      expect(kullanilan.has(es.formul), es.formul).toBe(false)
    }
  })

  it('yeterli bileşik kalmayınca null döner', () => {
    const hepsi = new Set(FORMUL_HAVUZU.map((e) => e.formul))
    expect(elHazirla(hepsi)).toBeNull()
  })

  it('tek tür yetiyorsa el o türden kurulur', () => {
    for (let i = 0; i < 50; i++) {
      const el = elHazirla()!
      // Tam havuzda her tür el kurmaya yetiyor; karışık ele hiç düşülmemeli.
      expect(el.tur).not.toBeNull()
      expect(new Set(el.esler.map((e) => e.tur))).toEqual(new Set([el.tur]))
    }
  })

  it('zorluk seçili olsa da el tek türden kuruluyor', () => {
    // Havuz önce zorluğa göre süzülseydi Kolay'da hiçbir tür altıya ulaşmaz ve
    // her el karışık kurulurdu — karışık elde öğrenci formüle değil biçime
    // bakıp eliyor.
    for (const zorluk of ZORLUKLAR) {
      for (let i = 0; i < 30; i++) {
        const el = elHazirla(new Set(), zorluk)!
        expect(el.tur, zorluk).not.toBeNull()
      }
    }
  })

  it('seçilen zorluk elin içinde öne alınıyor', () => {
    // Kolay'da o türün kolay bileşikleri bitmeden orta/zor gelmiyor.
    let kolayToplam = 0
    let zorToplam = 0
    for (let i = 0; i < 60; i++) {
      kolayToplam += elHazirla(new Set(), 'kolay')!.esler.filter((e) => e.zorluk === 'kolay')
        .length
      zorToplam += elHazirla(new Set(), 'zor')!.esler.filter((e) => e.zorluk === 'kolay').length
    }
    expect(kolayToplam).toBeGreaterThan(zorToplam)
  })

  it('tek tür yetmezse karışık el kurar', () => {
    // Yapay havuz: hiçbir tür tek başına altıya ulaşmıyor, toplamda yetiyor.
    const havuz: FormulEsi[] = [
      { formul: 'A1', ad: 'a1', tur: 'asit', zorluk: 'orta' },
      { formul: 'A2', ad: 'a2', tur: 'asit', zorluk: 'orta' },
      { formul: 'B1', ad: 'b1', tur: 'baz', zorluk: 'orta' },
      { formul: 'B2', ad: 'b2', tur: 'baz', zorluk: 'orta' },
      { formul: 'T1', ad: 't1', tur: 'tuz', zorluk: 'orta' },
      { formul: 'T2', ad: 't2', tur: 'tuz', zorluk: 'orta' },
    ]
    const el = elHazirla(new Set(), null, havuz)!
    expect(el.tur).toBeNull()
    expect(el.esler).toHaveLength(EL_BOYUTU)
  })
})

describe('eşleştirme', () => {
  const el = elHazirla()!

  it('doğru çifti tanır', () => {
    const es = el.esler[0]
    expect(eslesiyorMu(el, es.formul, es.ad)).toBe(true)
  })

  it('yanlış çifti reddeder', () => {
    const [ilk, ikinci] = el.esler
    expect(eslesiyorMu(el, ilk.formul, ikinci.ad)).toBe(false)
  })

  it('formülün adını bulur', () => {
    const es = el.esler[2]
    expect(adiniBul(el, es.formul)).toBe(es.ad)
    expect(adiniBul(el, 'olmayan formül')).toBeNull()
  })
})
