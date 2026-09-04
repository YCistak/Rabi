import { describe, expect, it } from 'vitest'
import { genisleriBol, kumeleriYaz, type Okunan } from './kagit-oku'
import { bilesenleriBul } from './karakter-ayir'
import { SINIFLAR } from './karakter-tani'
import type { Gri } from './goruntu-esikle'

function sayfa(en: number, boy: number, lekeler: { x: number; y: number; en: number; boy: number }[]): Gri {
  const veri = new Uint8ClampedArray(en * boy).fill(255)
  for (const l of lekeler) {
    for (let y = l.y; y < l.y + l.boy; y++) {
      for (let x = l.x; x < l.x + l.en; x++) veri[y * en + x] = 0
    }
  }
  return { veri, en, boy }
}

describe('geniş kutuyu bölme', () => {
  it('tek karaktere dokunmuyor', () => {
    const gri = sayfa(60, 60, [{ x: 10, y: 10, en: 12, boy: 24 }])
    const [kutu] = bilesenleriBul(gri)
    expect(genisleriBol(gri, kutu)).toHaveLength(1)
  })

  it('bitişik iki rakamı ayırıyor', () => {
    // Elle yazarken "20"nin sıfırı ikiye değiyor ve tek leke oluyor;
    // bölünmezse tanıyıcıya iki rakam gösterip tek cevap istemiş oluruz.
    const gri = sayfa(80, 60, [
      { x: 10, y: 10, en: 10, boy: 16 },
      { x: 20, y: 17, en: 2, boy: 2 },
      { x: 22, y: 10, en: 10, boy: 16 },
    ])
    const [kutu] = bilesenleriBul(gri)
    expect(kutu.en).toBeGreaterThan(kutu.boy * 0.95)

    const parcalar = genisleriBol(gri, kutu)
    expect(parcalar).toHaveLength(2)
    expect(parcalar[0].x).toBeLessThan(parcalar[1].x)
  })

  it('mürekkebin inceldiği yerden bölüyor', () => {
    const gri = sayfa(80, 60, [
      { x: 10, y: 10, en: 12, boy: 16 },
      { x: 22, y: 17, en: 1, boy: 1 },
      { x: 23, y: 10, en: 12, boy: 16 },
    ])
    const [kutu] = bilesenleriBul(gri)
    const [sol] = genisleriBol(gri, kutu)
    // Kesim değme noktasına düşmeli, yani sol parça ilk rakamı kapsamalı.
    expect(sol.en).toBeGreaterThanOrEqual(11)
    expect(sol.en).toBeLessThanOrEqual(14)
  })

  it('parçaların çevresindeki boşluğu kırpıyor', () => {
    const gri = sayfa(80, 60, [
      { x: 10, y: 14, en: 10, boy: 10 },
      { x: 20, y: 17, en: 2, boy: 2 },
      { x: 22, y: 10, en: 10, boy: 18 },
    ])
    const [kutu] = bilesenleriBul(gri)
    const parcalar = genisleriBol(gri, kutu)
    // Sol rakam kısa; parça onun gerçek boyuna daralmalı, kutunun boyuna değil.
    expect(parcalar[0].boy).toBeLessThan(kutu.boy)
  })
})

describe('sayı + işaret kümeleri', () => {
  /**
   * "12D 6Y" gibi bir diziyi, boşlukları ayrık bayrağına çevirerek kurar.
   *
   * Ağın olasılıkları burada yapay: okunan sınıfa 1 veriliyor, ötekilere 0.
   * Kümeleme kuralları zaten sınıfa bakıyor; olasılık yalnızca harfsiz biten
   * bir dizinin sonunu çevirirken devreye giriyor ve o durum ayrı test
   * ediliyor.
   */
  function oku(metin: string): Okunan[] {
    const okunanlar: Okunan[] = []
    let ayrik = true
    for (const karakter of metin) {
      if (karakter === ' ') {
        ayrik = true
        continue
      }
      const olasilik = new Float32Array(SINIFLAR.length)
      const yer = SINIFLAR.indexOf(karakter as (typeof SINIFLAR)[number])
      if (yer >= 0) olasilik[yer] = 1
      okunanlar.push({ karakter, ayrik, olasilik, tamBoy: true })
      ayrik = false
    }
    return okunanlar
  }

  /** Belirli bir harfe belirli olasılık veren tek kutu. */
  function kutu(karakter: string, harf: string, p: number, ayrik: boolean): Okunan {
    const olasilik = new Float32Array(SINIFLAR.length)
    olasilik[SINIFLAR.indexOf(karakter as (typeof SINIFLAR)[number])] = 1 - p
    olasilik[SINIFLAR.indexOf(harf as (typeof SINIFLAR)[number])] = p
    return { karakter, ayrik, olasilik, tamBoy: true }
  }

  it('sayı ve işareti bitişikse alıyor', () => {
    expect(kumeleriYaz(oku('12D 6Y'))).toBe('12D 6Y')
  })

  it('tek başına harfi atıyor', () => {
    // "Tar2: 5D 5Y" satırı ders adından artan bir "Y" ile başlıyordu; bu
    // biçimde arkasında sayı olmayan bir harf hiçbir şey söylemiyor.
    expect(kumeleriYaz(oku('Y21 5D 5Y'))).toBe('5D 5Y')
  })

  it('arkasında işaret olmayan sayıyı atıyor', () => {
    expect(kumeleriYaz(oku('621 1B'))).toBe('1B')
  })

  it('araya boşluk girmiş sayı ile işareti birleştirmiyor', () => {
    // "7 D" iki ayrı şey; birleştirmek olmayan bir sayı uydurmak olurdu.
    expect(kumeleriYaz(oku('7 D'))).toBe('')
  })

  it('hiç küme yoksa boş metin veriyor', () => {
    expect(kumeleriYaz(oku('D Y B'))).toBe('')
  })

  it('harfsiz biten diziyi harfe çeviriyor', () => {
    // Kalın uçlu kalemde "1B" satırı "13" diye okunuyordu; küme her zaman bir
    // işaretle bittiğine göre son kutuya en olası harfi sormak doğru cevap.
    expect(kumeleriYaz([kutu('1', 'B', 0.1, true), kutu('3', 'B', 0.3, false)])).toBe('1B')
  })

  it('harf olasılığı düşükse çevirmiyor', () => {
    expect(kumeleriYaz([kutu('1', 'B', 0.1, true), kutu('3', 'B', 0.01, false)])).toBe('')
  })

  it('alçak kutuyu harfe çevirmiyor', () => {
    // İki nokta üst üstenin noktası da rakam okunabiliyor; ona harf demek
    // olmayan bir sonuç uydurmak olurdu.
    const son = { ...kutu('3', 'B', 0.9, false), tamBoy: false }
    expect(kumeleriYaz([kutu('1', 'B', 0.1, true), son])).toBe('')
  })

  it('satır ortasında iki küme veren bitişik diziyi atıyor', () => {
    // "Edebiyat" harfleri "6D8B" diye okunuyordu: gerçek cevaplar arasında
    // her zaman boşluk var, tek dizide iki küme bir sözcüğün işareti.
    expect(kumeleriYaz(oku('6D8B 36D'))).toBe('36D')
  })

  it('satırın son dizisinde iki kümeye izin veriyor', () => {
    // Sağında ders adı olamaz; sıkışık yazılmış "3D2B" gerçek cevaptır.
    expect(kumeleriYaz(oku('3D2B'))).toBe('3D 2B')
  })
})

describe('vadi kuralı', () => {
  it('kalın kalemle yazılmış geniş tek harfi bölmüyor', () => {
    // Ölçülmüş çuvallama: yalnızca orana bakan kural kalın kalemle yazılmış
    // bir "D"yi ikiye kırpıyor ve tanıyıcıya yarım harf gidiyordu.
    const en = 60
    const boy = 60
    const veri = new Uint8ClampedArray(en * boy).fill(255)
    // Boyu kadar geniş, içi dolu bir leke: ortasında mürekkep incelmiyor.
    for (let y = 12; y < 32; y++) {
      for (let x = 8; x < 32; x++) veri[y * en + x] = 0
    }
    const gri: Gri = { veri, en, boy }
    const [kutu] = bilesenleriBul(gri)

    expect(kutu.en).toBeGreaterThan(kutu.boy)
    expect(genisleriBol(gri, kutu)).toHaveLength(1)
  })
})
