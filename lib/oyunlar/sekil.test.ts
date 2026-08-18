import { describe, expect, it } from 'vitest'
import { aciDerece, koseYayi, ortaNokta, yonde, type Nokta, type Sekil } from './sekil'
import { aciSekli, aciTuruHazirla } from './aci'
import { ucgenSekli, ucgenTuruHazirla } from './ucgen'

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

/** Noktanın bir doğru parçasına uzaklığı. */
function cizgiyeUzaklik(nokta: Nokta, bas: Nokta, son: Nokta): number {
  const dx = son.x - bas.x
  const dy = son.y - bas.y
  const uzunlukKare = dx * dx + dy * dy
  const oran =
    uzunlukKare === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((nokta.x - bas.x) * dx + (nokta.y - bas.y) * dy) / uzunlukKare),
        )
  return Math.hypot(nokta.x - (bas.x + oran * dx), nokta.y - (bas.y + oran * dy))
}

/** Şekildeki en yakın etiket–çizgi mesafesi. */
function enYakinEtiket(sekil: Sekil): number {
  let enYakin = Infinity
  for (const etiket of sekil.parcalar) {
    if (etiket.tur !== 'yazi') continue
    for (const cizgi of sekil.parcalar) {
      if (cizgi.tur !== 'cizgi') continue
      enYakin = Math.min(enYakin, cizgiyeUzaklik(etiket.konum, cizgi.bas, cizgi.son))
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
*/
describe('etiketler çizgilerin üstüne binmiyor', () => {
  const ESIK = 7

  it('açı şekillerinde', () => {
    for (const soru of aciTuruHazirla(500)) {
      expect(enYakinEtiket(aciSekli(soru)), JSON.stringify(soru)).toBeGreaterThan(ESIK)
    }
  })

  it('üçgen şekillerinde', () => {
    for (const soru of ucgenTuruHazirla(500)) {
      expect(enYakinEtiket(ucgenSekli(soru)), JSON.stringify(soru)).toBeGreaterThan(ESIK)
    }
  })
})
