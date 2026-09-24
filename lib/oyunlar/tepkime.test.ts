import { describe, expect, it } from 'vitest'
import {
  SIK_SAYISI,
  TURLER,
  aciklama,
  denklemCoz,
  denklemDuzYazi,
  siklariKur,
  tepkimeBul,
  terimCoz,
  turHazirla,
  type Terim,
} from './tepkime'
import {
  TEPKIME_HAVUZU,
  TUR_ADI,
  TUR_KURALI,
  type TepkimeSorusu,
  type TepkimeTuru,
} from './tepkime-havuzu'
import { ZORLUKLAR } from './ritim'

/** Formüldeki atomları sayar: `Ca3(PO4)2` → Ca 3, P 2, O 8. */
function atomlar(formul: string): Map<string, number> {
  const yigin: Map<string, number>[] = [new Map()]
  const ekle = (hedef: Map<string, number>, element: string, adet: number) =>
    hedef.set(element, (hedef.get(element) ?? 0) + adet)
  let i = 0
  const sayiOku = () => {
    const bas = i
    while (i < formul.length && /\d/.test(formul[i])) i++
    return bas === i ? 1 : Number(formul.slice(bas, i))
  }
  while (i < formul.length) {
    const k = formul[i]
    if (k === '(') {
      yigin.push(new Map())
      i++
    } else if (k === ')') {
      i++
      const ic = yigin.pop()!
      const carpan = sayiOku()
      for (const [element, adet] of ic) ekle(yigin[yigin.length - 1], element, adet * carpan)
    } else {
      const element = /^[A-Z][a-z]?/.exec(formul.slice(i))
      if (!element) throw new Error(`Okunmayan formül: ${formul}`)
      i += element[0].length
      ekle(yigin[yigin.length - 1], element[0], sayiOku())
    }
  }
  return yigin[0]
}

function yukDegeri(yuk: string | null): number {
  if (!yuk) return 0
  const buyukluk = yuk.length > 1 ? Number(yuk.slice(0, -1)) : 1
  return yuk.endsWith('+') ? buyukluk : -buyukluk
}

function taraf(terimler: Terim[]): { atom: Map<string, number>; yuk: number } {
  const atom = new Map<string, number>()
  let yuk = 0
  for (const t of terimler) {
    for (const [element, adet] of atomlar(t.formul)) {
      atom.set(element, (atom.get(element) ?? 0) + adet * t.katsayi)
    }
    yuk += yukDegeri(t.yuk) * t.katsayi
  }
  return { atom, yuk }
}

/** Tek bir elementten oluşan yüksüz tür: Fe, O2, Cl2, S. İyon serbest element değil. */
function serbestElement(t: Terim): boolean {
  return t.yuk === null && atomlar(t.formul).size === 1
}

const hepsi = (soru: TepkimeSorusu): Set<TepkimeTuru> => new Set([soru.tur, ...soru.ayrica])

const soru = (tur: TepkimeTuru, ayrica: TepkimeTuru[] = []): TepkimeSorusu => ({
  denklem: 'CH4(g) + 2O2(g) → CO2(g) + 2H2O(s)',
  tur,
  ayrica,
  zorluk: 'orta',
})

describe('terimCoz', () => {
  it('katsayıyı alt indisten ayırır', () => {
    expect(terimCoz('2H2O(s)')).toEqual({ katsayi: 2, formul: 'H2O', yuk: null, hal: 's' })
  })

  it('parantezli formülde hâli formüle katmaz', () => {
    expect(terimCoz('Ca(OH)2(suda)')).toEqual({
      katsayi: 1,
      formul: 'Ca(OH)2',
      yuk: null,
      hal: 'suda',
    })
  })

  it('iyon yükünü okur', () => {
    expect(terimCoz('2Fe^3+(suda)')).toEqual({ katsayi: 2, formul: 'Fe', yuk: '3+', hal: 'suda' })
    expect(terimCoz('Cl^-(suda)')).toMatchObject({ formul: 'Cl', yuk: '-' })
    expect(terimCoz('SO4^2-(suda)')).toMatchObject({ formul: 'SO4', yuk: '2-' })
  })

  it('parantezle başlayan formülü okur', () => {
    expect(terimCoz('(NH4)2CO3(k)')).toMatchObject({ katsayi: 1, formul: '(NH4)2CO3', hal: 'k' })
  })
})

describe('denklemDuzYazi', () => {
  it('hâli atar, yükü üst simgeyle yazar', () => {
    expect(denklemDuzYazi('Ba^2+(suda) + SO4^2-(suda) → BaSO4(k)')).toBe('Ba²⁺ + SO4²⁻ → BaSO4')
  })

  it('katsayıyı korur', () => {
    expect(denklemDuzYazi('2H2(g) + O2(g) → 2H2O(s)')).toBe('2H2 + O2 → 2H2O')
  })
})

describe('havuz', () => {
  it('en az yüz denklem var', () => {
    expect(TEPKIME_HAVUZU.length).toBeGreaterThanOrEqual(100)
  })

  it('aynı denklem iki kez geçmiyor', () => {
    const denklemler = TEPKIME_HAVUZU.map((s) => s.denklem)
    expect(new Set(denklemler).size).toBe(denklemler.length)
  })

  it('her denklem çözülüyor ve her terimin hâli yazılı', () => {
    // Hâl yalnızca çökelmede yazılsaydı "(k)" türün kendisini ele verirdi.
    for (const s of TEPKIME_HAVUZU) {
      const { girenler, urunler } = denklemCoz(s.denklem)
      for (const t of [...girenler, ...urunler]) expect(t.hal, s.denklem).not.toBeNull()
    }
  })

  it('her denklem denkleşmiş: atomlar ve yük iki tarafta eşit', () => {
    for (const s of TEPKIME_HAVUZU) {
      const { girenler, urunler } = denklemCoz(s.denklem)
      const sol = taraf(girenler)
      const sag = taraf(urunler)
      expect(Object.fromEntries(sag.atom), s.denklem).toEqual(Object.fromEntries(sol.atom))
      expect(sag.yuk, s.denklem).toBe(sol.yuk)
    }
  })

  it('denge denetimi dengesiz denklemi yakalıyor', () => {
    // Denetimin kendisi sınanıyor: her şeyi "eşit" bulan bir sayaç, havuzdaki
    // bütün denklemleri de geçirirdi.
    const { girenler, urunler } = denklemCoz('H2(g) + O2(g) → H2O(s)')
    expect(taraf(urunler).atom).not.toEqual(taraf(girenler).atom)
    const iyon = denklemCoz('Zn(k) + Fe^3+(suda) → Zn^2+(suda) + Fe^2+(suda)')
    expect(taraf(iyon.urunler).yuk).not.toBe(taraf(iyon.girenler).yuk)
    expect(Object.fromEntries(atomlar('Ca3(PO4)2'))).toEqual({ Ca: 3, P: 2, O: 8 })
    expect(Object.fromEntries(atomlar('(NH4)2SO4'))).toEqual({ N: 2, H: 8, S: 1, O: 4 })
  })

  it('katsayılar sadeleştirilmiş', () => {
    // 4H2 + 2O2 → 4H2O denk ama sınavda yazılmaz; ortak böleni 1 olmalı.
    const ebob = (a: number, b: number): number => (b === 0 ? a : ebob(b, a % b))
    for (const s of TEPKIME_HAVUZU) {
      const { girenler, urunler } = denklemCoz(s.denklem)
      const ortak = [...girenler, ...urunler].map((t) => t.katsayi).reduce(ebob)
      expect(ortak, s.denklem).toBe(1)
    }
  })

  it('asıl tür ayrıca listesinde tekrar etmiyor', () => {
    for (const s of TEPKIME_HAVUZU) expect(s.ayrica, s.denklem).not.toContain(s.tur)
  })

  it('her türden en az on denklem var', () => {
    for (const tur of TURLER) {
      expect(TEPKIME_HAVUZU.filter((s) => s.tur === tur).length, tur).toBeGreaterThanOrEqual(10)
    }
  })

  it('her zorlukta denklem var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(TEPKIME_HAVUZU.filter((s) => s.zorluk === zorluk).length, zorluk).toBeGreaterThan(15)
    }
  })

  it('her türün adı ve kuralı tanımlı', () => {
    for (const tur of TURLER) {
      expect(TUR_ADI[tur]).toBeTruthy()
      expect(TUR_KURALI[tur]).toBeTruthy()
    }
  })

  it('notlarda alt indisli formül yok', () => {
    // Bildirim düz metin; H2O orada "H2O" diye okunur. Alt indis rakamları
    // (₂) ise Nunito'da yok ve başka yazı tipine düşer (`formul.ts`).
    for (const s of TEPKIME_HAVUZU) {
      if (!s.not) continue
      expect(s.not, s.denklem).not.toMatch(/[A-Z][a-z]?\d|[₀-₉]/)
    }
  })
})

/*
  Türlerin denklemin yapısından okunabilen kısmı.

  `ayrica` elle yazılıyor ve eksik bir tür şıkka düşüp doğru bilen öğrenciyi
  yanlış sayardı. Burada yalnızca kesin olan kurallar var; asit-baz gibi
  maddeyi tanımayı gerektiren türler elle kalıyor.
*/
describe('türler denklemle çelişmiyor', () => {
  const cozulmus = TEPKIME_HAVUZU.map((s) => ({ s, ...denklemCoz(s.denklem) }))

  it('serbest element giren ya da çıkan tepkime redoks', () => {
    for (const { s, girenler, urunler } of cozulmus) {
      if ([...girenler, ...urunler].some(serbestElement)) {
        expect(hepsi(s).has('redoks'), s.denklem).toBe(true)
      }
    }
  })

  it('tek ürünlü tepkime sentez kalıbında', () => {
    for (const { s, girenler, urunler } of cozulmus) {
      if (urunler.length === 1 && girenler.length > 1) {
        expect(hepsi(s).has('sentez'), s.denklem).toBe(true)
      }
    }
  })

  it('tek girenli tepkime analiz, analiz de tek girenli', () => {
    for (const { s, girenler } of cozulmus) {
      expect(girenler.length === 1, s.denklem).toBe(hepsi(s).has('analiz'))
    }
  })

  it('sentez tek ürünlü', () => {
    for (const { s, urunler } of cozulmus) {
      if (s.tur === 'sentez') expect(urunler.length, s.denklem).toBe(1)
    }
  })

  it('oksijenle giren tepkime yanma — azot dışında', () => {
    // Azot oksijenle birleşir ama yanmaz (ısı alır): sınavın bilinen tuzağı,
    // yanma şıkkı orada bilerek çeldirici.
    const yanmayanlar = new Set(['N2(g) + O2(g) → 2NO(g)'])
    for (const { s, girenler } of cozulmus) {
      if (yanmayanlar.has(s.denklem)) {
        expect(hepsi(s).has('yanma'), s.denklem).toBe(false)
        continue
      }
      if (girenler.some((t) => t.formul === 'O2')) {
        expect(hepsi(s).has('yanma'), s.denklem).toBe(true)
      }
    }
  })

  it('yanma oksijenle giriyor', () => {
    for (const { s, girenler } of cozulmus) {
      if (s.tur === 'yanma') {
        expect(girenler.some((t) => t.formul === 'O2'), s.denklem).toBe(true)
      }
    }
  })

  it('çözeltiden katı çıkaran tepkime çökelme', () => {
    for (const { s, girenler, urunler } of cozulmus) {
      if (girenler.every((t) => t.hal === 'suda') && urunler.some((t) => t.hal === 'k')) {
        expect(hepsi(s).has('cokelme'), s.denklem).toBe(true)
      }
    }
  })

  it('çökelmede katı ürün var ve girenler çözeltide', () => {
    for (const { s, girenler, urunler } of cozulmus) {
      if (s.tur !== 'cokelme') continue
      expect(urunler.some((t) => t.hal === 'k'), s.denklem).toBe(true)
      // Kireç suyu testinde karbondioksit gaz olarak giriyor; tek istisna.
      if (s.ayrica.includes('asitBaz')) continue
      expect(girenler.every((t) => t.hal === 'suda'), s.denklem).toBe(true)
    }
  })

  it('iki tarafta da serbest element olan iki girenli tepkime yer değiştirme', () => {
    for (const { s, girenler, urunler } of cozulmus) {
      if (girenler.length > 1 && girenler.some(serbestElement) && urunler.some(serbestElement)) {
        expect(hepsi(s).has('yerDegistirme'), s.denklem).toBe(true)
      }
    }
  })

  it('yer değiştirmede element girip element çıkıyor', () => {
    for (const { s, girenler, urunler } of cozulmus) {
      if (s.tur !== 'yerDegistirme') continue
      // Net iyon denkleminde çıkan metal iyon değil element; giren de öyle.
      expect(girenler.some(serbestElement), s.denklem).toBe(true)
      expect(urunler.some(serbestElement), s.denklem).toBe(true)
    }
  })

  it('her denklemde en az üç çeldirici kalıyor', () => {
    for (const s of TEPKIME_HAVUZU) {
      const uygun = TURLER.filter((t) => !hepsi(s).has(t))
      expect(uygun.length, s.denklem).toBeGreaterThanOrEqual(SIK_SAYISI - 1)
    }
  })
})

describe('siklariKur', () => {
  it('dört şık, tek doğru', () => {
    for (let i = 0; i < 50; i++) {
      const siklar = siklariKur(soru('yanma', ['redoks', 'sentez']))
      expect(siklar).toHaveLength(SIK_SAYISI)
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(siklar.find((s) => s.dogruMu)?.deger).toBe('yanma')
    }
  })

  it('ayrıca girdiği tür şıkka hiç düşmüyor', () => {
    for (let i = 0; i < 200; i++) {
      const degerler = siklariKur(soru('yerDegistirme', ['redoks'])).map((s) => s.deger)
      expect(degerler).not.toContain('redoks')
    }
  })

  it('havuzdaki hiçbir soruda ikinci doğru şık yok', () => {
    for (const s of TEPKIME_HAVUZU) {
      for (let i = 0; i < 5; i++) {
        const siklar = siklariKur(s)
        expect(siklar).toHaveLength(SIK_SAYISI)
        for (const sik of siklar) {
          if (!sik.dogruMu) expect(hepsi(s).has(sik.deger), s.denklem).toBe(false)
        }
      }
    }
  })

  it('doğru şıkkın yeri değişiyor', () => {
    const yerler = new Set<number>()
    for (let i = 0; i < 200; i++) {
      yerler.add(siklariKur(soru('analiz')).findIndex((s) => s.dogruMu))
    }
    expect(yerler.size).toBe(SIK_SAYISI)
  })
})

describe('turHazirla', () => {
  it('havuzun tamamını sıraya koyar, tekrarsız', () => {
    const tur = turHazirla()
    expect(tur).toHaveLength(TEPKIME_HAVUZU.length)
    expect(new Set(tur.map((s) => s.soru.denklem)).size).toBe(tur.length)
  })
})

describe('tepkimeBul ve aciklama', () => {
  it('banka kaydındaki denklemden soruyu bulur', () => {
    const ilk = TEPKIME_HAVUZU[0]
    expect(tepkimeBul(ilk.denklem)).toBe(ilk)
    expect(tepkimeBul('yok → yok')).toBeNull()
  })

  it('ayrıca girdiği türleri söylüyor', () => {
    expect(aciklama(soru('yerDegistirme', ['redoks']))).toBe(
      `${TUR_KURALI.yerDegistirme} Ayrıca redoks.`,
    )
  })

  it('notu kuralın önüne alıyor', () => {
    expect(aciklama({ ...soru('sentez'), not: 'Azot yanmaz.' })).toBe('Azot yanmaz.')
  })
})
