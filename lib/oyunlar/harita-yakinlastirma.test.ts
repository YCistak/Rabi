import { describe, expect, it } from 'vitest'
import { HARITA_GENISLIK, HARITA_YUKSEKLIK } from './harita-havuzu'
import {
  EN_COK_OLCEK,
  TAM_GORUNUM,
  gorunumBoyu,
  gorunumMerkezi,
  gorunumOlcegi,
  kaydir,
  odaklaYakinlastir,
  sinirla,
  type Gorunum,
} from './harita-yakinlastirma'

/** Görünüm haritanın dışına taşmamalı — her testin ortak beklentisi. */
function iceridedirMi(g: Gorunum) {
  expect(g.x).toBeGreaterThanOrEqual(-0.001)
  expect(g.y).toBeGreaterThanOrEqual(-0.001)
  expect(g.x + g.en).toBeLessThanOrEqual(HARITA_GENISLIK + 0.001)
  expect(g.y + gorunumBoyu(g)).toBeLessThanOrEqual(HARITA_YUKSEKLIK + 0.001)
}

describe('görünüm', () => {
  it('tam görünüm haritanın tamamı', () => {
    expect(gorunumOlcegi(TAM_GORUNUM)).toBe(1)
    expect(gorunumBoyu(TAM_GORUNUM)).toBeCloseTo(HARITA_YUKSEKLIK)
  })

  it('en-boy oranı ölçek değişse de bozulmuyor', () => {
    for (const olcek of [1, 1.7, 3, EN_COK_OLCEK]) {
      const g = sinirla({ x: 0, y: 0, en: HARITA_GENISLIK / olcek })
      expect(g.en / gorunumBoyu(g)).toBeCloseTo(HARITA_GENISLIK / HARITA_YUKSEKLIK)
    }
  })
})

describe('sinirla', () => {
  it('haritadan dışarı çıkan görünümü içeri çeker', () => {
    iceridedirMi(sinirla({ x: -500, y: -500, en: HARITA_GENISLIK / 3 }))
    iceridedirMi(sinirla({ x: 5000, y: 5000, en: HARITA_GENISLIK / 3 }))
  })

  it('ölçeği iki uçta da sınırlıyor', () => {
    // Sonuna kadar uzaklaşmak haritanın tamamı; ötesi yok.
    const uzak = sinirla({ x: 40, y: 40, en: HARITA_GENISLIK * 4 })
    expect(uzak).toEqual(TAM_GORUNUM)
    const yakin = sinirla({ x: 0, y: 0, en: 1 })
    expect(gorunumOlcegi(yakin)).toBeCloseTo(EN_COK_OLCEK)
  })
})

describe('odaklaYakinlastir', () => {
  it('odaktaki noktayı yerinde tutuyor', () => {
    const baslangic: Gorunum = { x: 0, y: 0, en: HARITA_GENISLIK }
    const odak: [number, number] = [400, 200]
    const sonra = odaklaYakinlastir(baslangic, odak, 2)

    // Odağın görünüm içindeki bağıl yeri değişmemeli.
    const onceOran = (odak[0] - baslangic.x) / baslangic.en
    const sonraOran = (odak[0] - sonra.x) / sonra.en
    expect(sonraOran).toBeCloseTo(onceOran)
    expect(gorunumOlcegi(sonra)).toBeCloseTo(2)
    iceridedirMi(sonra)
  })

  it('kenardaki odakta bile görünüm haritanın içinde kalıyor', () => {
    iceridedirMi(odaklaYakinlastir(TAM_GORUNUM, [0, 0], 3))
    iceridedirMi(odaklaYakinlastir(TAM_GORUNUM, [HARITA_GENISLIK, HARITA_YUKSEKLIK], 3))
  })

  it('çarpan 1’in altındayken uzaklaşıyor', () => {
    const yakin = odaklaYakinlastir(TAM_GORUNUM, [500, 200], 4)
    const geri = odaklaYakinlastir(yakin, gorunumMerkezi(yakin), 1 / 4)
    expect(gorunumOlcegi(geri)).toBeCloseTo(1)
    expect(geri.x).toBeCloseTo(0)
    expect(geri.y).toBeCloseTo(0)
  })

  it('sınıra dayanınca kaydırma da o kadar oluyor', () => {
    // Ölçek tavanda: bir daha yakınlaştırmak görünümü hiç oynatmamalı.
    const tavan = odaklaYakinlastir(TAM_GORUNUM, [500, 200], EN_COK_OLCEK)
    const sonra = odaklaYakinlastir(tavan, [500, 200], 2)
    expect(sonra).toEqual(tavan)
  })
})

describe('kaydir', () => {
  it('yakınken kaydırıyor, kenarda duruyor', () => {
    const yakin = odaklaYakinlastir(TAM_GORUNUM, [500, 200], 2)
    const saga = kaydir(yakin, 60, 0)
    expect(saga.x).toBeCloseTo(yakin.x + 60)

    const sola = kaydir(yakin, -10_000, 0)
    expect(sola.x).toBe(0)
    iceridedirMi(sola)
  })

  it('tam görünümde kaydıracak yer yok', () => {
    expect(kaydir(TAM_GORUNUM, 200, 200)).toEqual(TAM_GORUNUM)
  })
})
