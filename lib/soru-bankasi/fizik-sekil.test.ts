import { describe, expect, it } from 'vitest'
import { bankaDersiCoz, konuDersi } from './ders'
import { blokKoseleri, devreKollari, devreSahnesi, duzenekSahnesi, goruntuSanalMi, kolYazisi, optikSahnesi, yariDuzlemKirp } from './fizik-sekil'
import { BANKA_GORSEL_TURLERI, gorselHatasi, kollarBinisiyor } from './gorsel-denetim'
import { cakismaSay, etiketTuru, koordinatSahnesi, SEKIL_GENISLIGI, type Sahne } from './sekil'
import type { BankaGorseli, DevreGorseli, OptikGorseli } from './tip'

/* Şema belgesindeki (soru-bankasi-calisma/gorev/tip-fizik.ts) örneklerin kopyası. */
const ORNEKLER: Record<string, BankaGorseli> = {
  seri: { tur: 'devre', kollar: [{ bas: [0, 0], bit: [4, 0], eleman: 'pil', deger: '6 V', arti: 'bas' }, { bas: [0, 0], bit: [0, 2], eleman: 'tel', akim: { yon: 'ileri', ad: 'I' } }, { bas: [0, 2], bit: [4, 2], eleman: 'direnc', ad: 'R₁', deger: '4 Ω' }, { bas: [4, 2], bit: [4, 0], eleman: 'lamba', ad: 'L' }] },
  paralel: { tur: 'devre', kollar: [{ bas: [0, 0], bit: [4, 0], eleman: 'pil', deger: '12 V' }, { bas: [0, 0], bit: [0, 2], eleman: 'tel' }, { bas: [4, 0], bit: [4, 2], eleman: 'tel' }, { bas: [0, 2], bit: [4, 2], eleman: 'direnc', ad: 'R₁' }, { bas: [0, 2], bit: [0, 4], eleman: 'tel' }, { bas: [0, 4], bit: [4, 4], eleman: 'direnc', ad: 'R₂' }, { bas: [4, 4], bit: [4, 2], eleman: 'tel' }] },
  cukur: { tur: 'optik', pencere: [-8, 2, -2, 3], araclar: [{ tur: 'cukurAyna', merkez: [0, 0], boy: 4, odak: 2 }, { tur: 'cisim', bas: [-6, 0], bit: [-6, 1.5], ad: 'K' }, { tur: 'goruntu', bas: [-3, 0], bit: [-3, -0.75], ad: 'K′' }], isinlar: [{ noktalar: [[-6, 1.5], [0, 1.5], [-3, -0.75]] }, { noktalar: [[-6, 1.5], [0, 0], [-3, -0.75]] }] },
  kirilma: { tur: 'optik', pencere: [-4, 4, -3, 3], araclar: [{ tur: 'sinir', bas: [-4, 0], bit: [4, 0], normal: [0, 0] }], isinlar: [{ noktalar: [[-2, 2], [0, 0], [1.2, -2.25]] }], acilar: [{ merkez: [0, 0], bas: 90, bit: 135, ad: '45°' }], etiketler: [{ konum: [2.8, 1.6], ad: 'Hava' }, { konum: [-2.6, -1.5], ad: 'Cam' }] },
  egik: { tur: 'duzenek', pencere: [-1, 7, -1, 5], parcalar: [{ tur: 'zemin', noktalar: [[0, 0], [6, 3]] }, { tur: 'blok', merkez: [2.78, 1.95], en: 1.6, boy: 1, aci: 26.565, ad: 'K' }, { tur: 'ok', bas: [3.5, 2.3], bit: [5.1, 3.1], ad: 'F' }] },
  uBorusu: { tur: 'duzenek', pencere: [-1, 6, -1, 6], parcalar: [{ tur: 'sivi', noktalar: [[0, 2], [1, 2], [1, 1], [4, 1], [4, 3.6], [5, 3.6], [5, 0], [0, 0]] }, { tur: 'sivi', noktalar: [[0, 2], [1, 2], [1, 4], [0, 4]] }, { tur: 'kap', noktalar: [[0, 5], [0, 0], [5, 0], [5, 5]] }, { tur: 'kap', noktalar: [[1, 5], [1, 1], [4, 1], [4, 5]] }], etiketler: [{ konum: [0.5, 3], ad: 'Yağ' }, { konum: [4.5, 2], ad: 'Su' }] },
  xt: { tur: 'koordinat', pencere: [-1, 6, -1, 6], eksenler: true, xAd: 't (s)', yAd: 'x (m)', egriler: [{ noktalar: [[0, 0], [2, 4], [5, 4]], kirik: true }], noktalar: [{ x: 2, y: 4 }, { x: 5, y: 4 }] },
}

const sahneCiz = (g: BankaGorseli): Sahne => (g.tur === 'devre' ? devreSahnesi(g) : g.tur === 'optik' ? optikSahnesi(g) : g.tur === 'duzenek' ? duzenekSahnesi(g) : koordinatSahnesi(g as never))
const kutular = (s: Sahne) => s.etiketler.map((e) => ({ x: e.x, y: e.y, gen: e.duzen.gen, yuk: e.duzen.yuk }))

describe('ders', () => {
  it('konu kimliğinin önekinden dersi çıkarır', () => {
    expect(konuDersi('mat10-alan')).toBe('matematik')
    expect(konuDersi('fzk11-mercek')).toBe('fizik')
    expect(konuDersi(undefined)).toBe('matematik')
    expect(bankaDersiCoz('fizik')).toBe('fizik')
    expect(bankaDersiCoz('kimya')).toBe('matematik')
  })
})

describe('şekil denetimi', () => {
  it('şema örneklerinin hepsi geçerli', () => {
    for (const g of Object.values(ORNEKLER)) expect(gorselHatasi(g)).toBeNull()
    expect(BANKA_GORSEL_TURLERI).toEqual(expect.arrayContaining(['devre', 'optik', 'duzenek', 'koordinat']))
  })

  it('bozuk devreyi yakalar', () => {
    const kol = { bas: [0, 0], bit: [2, 0], eleman: 'direnc' }
    expect(gorselHatasi({ tur: 'devre', kollar: [] })).toMatch(/boş/)
    expect(gorselHatasi({ tur: 'devre', kollar: [{ ...kol, eleman: 'diyot' }] })).toMatch(/bilinmeyen eleman/)
    expect(gorselHatasi({ tur: 'devre', kollar: [{ ...kol, bit: [0, 0] }] })).toMatch(/aynı nokta/)
    expect(gorselHatasi({ tur: 'devre', kollar: [{ ...kol, arti: 'arti' }] })).toMatch(/arti/)
    expect(gorselHatasi({ tur: 'devre', kollar: [{ ...kol, akim: { yon: 'sag' } }] })).toMatch(/akim/)
    expect(gorselHatasi({ tur: 'devre', kollar: [kol, { bas: [1, 0], bit: [3, 0], eleman: 'tel' }] })).toMatch(/üst üste/)
    // Elemanlı kolun ortasından çıkan kol: eleman birleşimin üstüne düşerdi.
    expect(gorselHatasi({ tur: 'devre', kollar: [kol, { bas: [1, 0], bit: [1, 2], eleman: 'tel' }] })).toMatch(/ikiye böl/)
    // Telde aynı durum serbest: çizici böler.
    expect(gorselHatasi({ tur: 'devre', kollar: [{ ...kol, eleman: 'tel' }, { bas: [1, 0], bit: [1, 2], eleman: 'lamba' }] })).toBeNull()
  })

  it('bozuk optik ve düzeneği yakalar', () => {
    expect(gorselHatasi({ tur: 'optik', pencere: [0, -1, 0, 1], araclar: [] })).toMatch(/pencere/)
    expect(gorselHatasi({ tur: 'optik', pencere: [0, 1, 0, 1], araclar: [{ tur: 'cukurAyna', merkez: [0, 0], boy: 2, odak: -1 }] })).toMatch(/odak/)
    expect(gorselHatasi({ tur: 'optik', pencere: [0, 1, 0, 1], araclar: [{ tur: 'lazer', konum: [0, 0] }] })).toMatch(/bilinmeyen/)
    expect(gorselHatasi({ tur: 'optik', pencere: [0, 1, 0, 1], araclar: [], isinlar: [{ noktalar: [[0, 0]] }] })).toMatch(/ışın/)
    expect(gorselHatasi({ tur: 'duzenek', pencere: [0, 1, 0, 1], parcalar: [{ tur: 'sivi', noktalar: [[0, 0], [1, 0]] }] })).toMatch(/en az 3/)
    expect(gorselHatasi({ tur: 'duzenek', pencere: [0, 1, 0, 1], parcalar: [{ tur: 'blok', merkez: [0, 0], en: 0, boy: 1 }] })).toMatch(/blok/)
    expect(gorselHatasi({ tur: 'duzenek', pencere: [0, 1, 0, 1], parcalar: [{ tur: 'makara', merkez: [0, 0], yaricap: 1 }], etiketler: [{ x: 0, y: 0, ad: 'A' }] })).toMatch(/etiketler/)
  })

  it('matematik türlerinde eski gevşek denetim sürer', () => {
    // Eski betik koordinatta yalnız pencereye bakıyordu; aynı veri aynı sonucu vermeli.
    expect(gorselHatasi({ tur: 'koordinat', pencere: [0, 1, 0, 1], egriler: 'bozuk' })).toBeNull()
    expect(gorselHatasi({ tur: 'koordinat', pencere: [0, 1, 0] })).not.toBeNull()
  })

  it('aynı doğrudaki iki kolun binişmesini T birleşiminden ayırır', () => {
    expect(kollarBinisiyor({ bas: [0, 0], bit: [2, 0] }, { bas: [2, 0], bit: [4, 0] })).toBe(false)
    expect(kollarBinisiyor({ bas: [0, 0], bit: [4, 0] }, { bas: [2, 0], bit: [2, 2] })).toBe(false)
    expect(kollarBinisiyor({ bas: [0, 0], bit: [4, 0] }, { bas: [4, 0], bit: [0, 0] })).toBe(true)
  })
})

describe('devre yerleşimi', () => {
  it('bölünmemiş T birleşimini böler ve birleşime nokta koyar', () => {
    const g: DevreGorseli = { tur: 'devre', kollar: [{ bas: [0, 0], bit: [4, 0], eleman: 'tel', akim: { yon: 'ileri' } }, { bas: [2, 0], bit: [2, 2], eleman: 'lamba' }, { bas: [0, 0], bit: [0, 2], eleman: 'pil' }, { bas: [0, 2], bit: [2, 2], eleman: 'tel' }, { bas: [4, 0], bit: [4, 2], eleman: 'tel' }, { bas: [2, 2], bit: [4, 2], eleman: 'tel' }] }
    const kollar = devreKollari(g.kollar)
    expect(kollar).toHaveLength(7)
    expect(kollar.filter((k) => k.akim)).toHaveLength(1)
    const s = devreSahnesi(g)
    // (2,0) ve (2,2) üç kolun birleşimi.
    expect(s.noktalar.filter((n) => (n.r ?? 0) > 3)).toHaveLength(2)
  })

  it('eleman yazısı ad ve değeri birleştirir', () => {
    expect(kolYazisi({ ad: 'R₁', deger: '4 Ω' })).toBe('R₁ = 4 Ω')
    expect(kolYazisi({ deger: '6 V' })).toBe('6 V')
    expect(kolYazisi({})).toBeUndefined()
  })

  it('seri devrede yazılar devrenin dışında ve çakışmasız', () => {
    const s = devreSahnesi(ORNEKLER.seri as DevreGorseli)
    const metinler = s.etiketler.map((e) => e.duzen.metin)
    expect(metinler).toEqual(expect.arrayContaining(['6 V', 'R₁ = 4 Ω', 'L', 'I']))
    expect(cakismaSay(kutular(s))).toBe(0)
    // Üst koldaki R₁ yazısı devrenin üstünde (dışında).
    const r1 = s.etiketler.find((e) => e.duzen.metin === 'R₁ = 4 Ω')!
    const ustKol = Math.min(...s.yollar.flatMap((y) => [...y.d.matchAll(/[ML] [\d.-]+ ([\d.-]+)/g)].map((m) => Number(m[1]))))
    expect(r1.y).toBeLessThan(ustKol)
  })

  it('ampermetre ve voltmetrede harf dairenin ortasında', () => {
    const s = devreSahnesi({ tur: 'devre', kollar: [{ bas: [0, 0], bit: [3, 0], eleman: 'ampermetre' }, { bas: [3, 0], bit: [3, 2], eleman: 'voltmetre' }, { bas: [3, 2], bit: [0, 2], eleman: 'pil' }, { bas: [0, 2], bit: [0, 0], eleman: 'tel' }] })
    for (const harf of ['A', 'V']) {
      const e = s.etiketler.find((x) => x.duzen.metin === harf)!
      expect(s.cemberler.some((c) => Math.hypot(c.x - e.x, c.y - e.y) < 0.5)).toBe(true)
    }
  })
})

describe('optik yerleşimi', () => {
  it('çukur aynada F ve M aynanın önünde, görüntü gerçek', () => {
    const g = ORNEKLER.cukur as OptikGorseli
    const s = optikSahnesi(g)
    const f = s.etiketler.find((e) => e.duzen.metin === 'F')!
    const m = s.etiketler.find((e) => e.duzen.metin === 'M')!
    expect(m.x).toBeLessThan(f.x)
    expect(goruntuSanalMi(g, g.araclar[2] as never)).toBe(false)
    expect(s.yollar.some((y) => y.kesik)).toBe(false)
  })

  it('sanal görüntüyü fizikten bulur', () => {
    const tumsek: OptikGorseli = { tur: 'optik', pencere: [-6, 4, -2, 2], araclar: [{ tur: 'tumsekAyna', merkez: [0, 0], boy: 3, odak: 1 }, { tur: 'goruntu', bas: [0.8, 0], bit: [0.8, 0.4] }], isinlar: [] }
    expect(goruntuSanalMi(tumsek, tumsek.araclar[1] as never)).toBe(true)
    const mercek: OptikGorseli = { tur: 'optik', pencere: [-6, 4, -2, 2], araclar: [{ tur: 'inceMercek', merkez: [0, 0], boy: 3, odak: 2 }, { tur: 'cisim', bas: [-1, 0], bit: [-1, 1] }, { tur: 'goruntu', bas: [-2, 0], bit: [-2, 2] }] }
    expect(goruntuSanalMi(mercek, mercek.araclar[2] as never)).toBe(true)
    const duzlem: OptikGorseli = { tur: 'optik', pencere: [-3, 3, -3, 3], araclar: [{ tur: 'duzlemAyna', bas: [0, -2], bit: [0, 2] }, { tur: 'goruntu', bas: [1, 0], bit: [1, 1], sanal: false }] }
    expect(goruntuSanalMi(duzlem, duzlem.araclar[1] as never)).toBe(false)
  })

  it('ışın aynaya değdiği yerde aynanın eğrisine oturur', () => {
    const s = optikSahnesi(ORNEKLER.cukur as OptikGorseli)
    const tepe = s.yollar.find((y) => y.kalinlik === 2.6)!.d
    // Çukur aynanın kenarları tepeye göre sola (bakılan yana) kayık.
    const [, ux] = tepe.match(/^M ([\d.-]+)/)!.map(Number)
    const [, qx] = tepe.match(/Q ([\d.-]+)/)!.map(Number)
    expect(ux).toBeLessThan(qx)
  })

  it('kırılmada ortam boyanır, normal kesik, yazılar çakışmasız', () => {
    const s = optikSahnesi(ORNEKLER.kirilma as OptikGorseli)
    expect(s.yollar.some((y) => y.dolgu === 'cam' && y.kenarsiz)).toBe(true)
    expect(s.yollar.some((y) => y.kesik)).toBe(true)
    expect(s.yaylar).toBeTruthy()
    expect(cakismaSay(kutular(s))).toBe(0)
  })

  it('pencereyi yarı düzleme kırpar', () => {
    const kare = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]
    const alt = yariDuzlemKirp(kare, { x: 0, y: 5 }, { x: 0, y: 1 })
    expect(alt).toHaveLength(4)
    expect(Math.min(...alt.map((p) => p.y))).toBe(5)
  })
})

describe('düzenek yerleşimi', () => {
  it('blok köşeleri merkez çevresinde döner', () => {
    const k = blokKoseleri([0, 0], 2, 1, 90)
    expect(k[0][0]).toBeCloseTo(0.5)
    expect(k[0][1]).toBeCloseTo(-1)
  })

  it('iki sıvı ayrı dokuyla, blok yazısı ortada', () => {
    const s = duzenekSahnesi(ORNEKLER.uBorusu as never)
    expect(s.yollar.filter((y) => y.dolgu === 'sivi')).toHaveLength(1)
    expect(s.yollar.filter((y) => y.dolgu === 'sivi2')).toHaveLength(1)
    const b = duzenekSahnesi(ORNEKLER.egik as never)
    expect(b.yollar.some((y) => y.dolgu === 'blok')).toBe(true)
  })

  it('eğik zeminin ucundaki açı yazısına yay çizer', () => {
    const s = duzenekSahnesi({ tur: 'duzenek', pencere: [-1, 9, -1, 7], parcalar: [{ tur: 'zemin', noktalar: [[0, 0], [8, 6]] }], etiketler: [{ konum: [1.3, 0.3], ad: '37°' }] })
    expect(s.yaylar).toBeTruthy()
    expect(s.yollar.some((y) => y.kesik)).toBe(true)
  })
})

describe('sığma', () => {
  it('bütün örnekler 340 birim genişliğe sığar', () => {
    for (const g of Object.values(ORNEKLER)) {
      const s = sahneCiz(g)
      expect(s.viewBox[2]).toBeLessThanOrEqual(SEKIL_GENISLIGI + 0.5)
      expect(s.viewBox[3]).toBeLessThanOrEqual(320)
    }
  })

  it('manyetik alan simgeleri yerinde ve simge olarak kalır', () => {
    expect(etiketTuru('⊗')).toBe('simge')
    const s = koordinatSahnesi({ tur: 'koordinat', pencere: [0, 4, 0, 3], eksenler: false, egriler: [{ noktalar: [[0, 0], [4, 0], [4, 3], [0, 3]], kapali: true, kirik: true }], etiketler: [{ x: 1, y: 1, ad: '⊗' }, { x: 2, y: 1, ad: '⊗' }, { x: 3, y: 2, ad: '⊙' }] })
    const simgeler = s.etiketler.filter((e) => e.simge)
    expect(simgeler.map((e) => e.simge)).toEqual(['ice', 'ice', 'disa'])
    // Eşit aralıklı ızgara bozulmaz.
    expect(simgeler[1].x - simgeler[0].x).toBeGreaterThan(20)
    expect(simgeler[0].y).toBeCloseTo(simgeler[1].y)
  })
})
