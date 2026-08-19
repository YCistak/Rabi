import { describe, expect, it } from 'vitest'
import {
  aciDerece,
  koseYayi,
  noktaCizgiUzakligi,
  ortaNokta,
  yonde,
  type Nokta,
  type Sekil,
} from './sekil'
import { TUM_ACI_SORULARI, aciSekli } from './aci'
import { ucgenSekli, ucgenTuruHazirla } from './ucgen'

/** Sabit üreteç: üçgen soruları rastgele üretiliyor, tarama tekrarlanabilir olsun. */
function uretec(tohum: number): () => number {
  let x = tohum
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648
    return x / 2147483648
  }
}

describe('yonde', () => {
  it('0° sağa, 90° yukarı bakar — SVG y ekseni ters olduğu için', () => {
    const merkez: Nokta = { x: 100, y: 100 }
    expect(yonde(merkez, 0, 10).x).toBeCloseTo(110)
    expect(yonde(merkez, 90, 10).y).toBeCloseTo(90)
    expect(yonde(merkez, 180, 10).x).toBeCloseTo(90)
  })
})

describe('aciDerece', () => {
  it('yönün açısını 0–360 arasında verir', () => {
    expect(aciDerece({ x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(0)
    expect(aciDerece({ x: 0, y: 0 }, { x: 0, y: -10 })).toBeCloseTo(90)
    expect(aciDerece({ x: 0, y: 0 }, { x: 0, y: 10 })).toBeCloseTo(270)
  })
})

describe('koseYayi', () => {
  it('iki ışın arasındaki küçük açıyı alır — üçgende iç açı her zaman odur', () => {
    const kose: Nokta = { x: 0, y: 0 }
    const yay = koseYayi(kose, { x: 10, y: 0 }, { x: 0, y: -10 })
    expect(yay.son - yay.ilk).toBeCloseTo(90)

    // Sıra değişince de aynı açı çıkmalı: yay hep dar taraftan gidiyor.
    const ters = koseYayi(kose, { x: 0, y: -10 }, { x: 10, y: 0 })
    expect(ters.son - ters.ilk).toBeCloseTo(90)
  })
})

describe('ortaNokta', () => {
  it('iki noktanın ortası', () => {
    expect(ortaNokta({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({ x: 5, y: 10 })
  })
})

/** Şekildeki en yakın etiket–çizgi mesafesi. */
function enYakinEtiket(sekil: Sekil): number {
  let enYakin = Infinity
  for (const etiket of sekil.parcalar) {
    if (etiket.tur !== 'yazi') continue
    for (const cizgi of sekil.parcalar) {
      if (cizgi.tur !== 'cizgi') continue
      enYakin = Math.min(enYakin, noktaCizgiUzakligi(etiket.konum, cizgi.bas, cizgi.son))
    }
  }
  return enYakin
}

/*
  Etiketlerin okunabilirliği.

  Yaşanmış hata: ikizkenar üçgende tepe açısı 20° seçilebiliyordu; şekil ölçekli
  çizildiği için üçgen tuvale sığmak üzere daralıyor, "80°" yazısı kenarın tam
  üstüne biniyordu. Sayı ile çizgi çakışınca soru okunamaz oluyor, ama hiçbir
  hesap testi bunu yakalamıyor — ölçü tutuyor, şekil okunmuyor.

  İkinci ders, testin kendisiyle ilgili: burası eskiden 500 **rastgele** soru
  tarıyordu. Açı oyununun 471 kombinasyonundan yalnızca biri (25°-25°-130°)
  bozuktu; test o yüzden bazen kırmızı bazen yeşil yandı ve gerçek bir kusur
  "kararsız test" sanıldı. Artık kombinasyonların tamamı taranıyor: kapsam da
  tam, sonuç da her koşuda aynı.
*/
describe('etiketler çizgilerin üstüne binmiyor', () => {
  const ESIK = 7

  it('açı şekillerinin tamamında', () => {
    for (const soru of TUM_ACI_SORULARI) {
      expect(enYakinEtiket(aciSekli(soru)), JSON.stringify(soru)).toBeGreaterThan(ESIK)
    }
  })

  /*
    Üçgen oyununda sorular listelenebilir değil (Pisagor üçlüleri katsayılarıyla
    çarpılıyor), o yüzden burada geniş bir örnekleme var: sabit tohumlarla
    üretiliyor, dolayısıyla her koşuda aynı sorular taranıyor.
  */
  it('üçgen şekillerinde', () => {
    for (let tohum = 1; tohum <= 40; tohum++) {
      for (const soru of ucgenTuruHazirla(200, uretec(tohum))) {
        expect(enYakinEtiket(ucgenSekli(soru)), JSON.stringify(soru)).toBeGreaterThan(ESIK)
      }
    }
  })
})
