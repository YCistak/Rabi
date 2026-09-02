import { describe, expect, it } from 'vitest'
import {
  ELEMENTLER,
  GRUP_SAYISI,
  PERIYOT_SAYISI,
  SINIF_ADI,
  hucreVarMi,
  sinifSorulurMu,
} from './periyodik-havuzu'
import {
  SIK_SAYISI,
  dogruCevap,
  elementBul,
  enYakinlar,
  sinifSiklariKur,
  siklariKur,
  soruKur,
  tipteSoruKur,
} from './periyodik'
import { ZORLUKLAR } from './ritim'

describe('periyodik havuzu', () => {
  it('aynı sembol iki kez geçmiyor', () => {
    const semboller = ELEMENTLER.map((e) => e.sembol)
    expect(new Set(semboller).size).toBe(semboller.length)
  })

  it('aynı ad iki kez geçmiyor', () => {
    // Aynı adın iki kaydı olsaydı "sec" sorusunda iki şık birden doğru olurdu.
    const adlar = ELEMENTLER.map((e) => e.ad)
    expect(new Set(adlar).size).toBe(adlar.length)
  })

  it('iki element aynı hücrede durmuyor', () => {
    // Izgara grup–periyot kesişimine göre çiziliyor; çakışan iki elementin
    // biri ekranda hiç görünmezdi.
    const yerler = ELEMENTLER.map((e) => `${e.grup}:${e.periyot}`)
    expect(new Set(yerler).size).toBe(yerler.length)
  })

  it('her element tablonun içinde ve var olan bir hücrede', () => {
    for (const element of ELEMENTLER) {
      expect(element.grup, element.ad).toBeGreaterThanOrEqual(1)
      expect(element.grup, element.ad).toBeLessThanOrEqual(GRUP_SAYISI)
      expect(element.periyot, element.ad).toBeGreaterThanOrEqual(1)
      expect(element.periyot, element.ad).toBeLessThanOrEqual(PERIYOT_SAYISI)
      expect(hucreVarMi(element.grup, element.periyot), element.ad).toBe(true)
    }
  })

  it('atom numarası ile grup–periyot birbirini tutuyor', () => {
    // Numarası büyük olan element tabloda daha aşağıda ya da aynı satırda
    // sağda durur; tutmazsa hücre yanlış yere yazılmış demektir.
    const sirali = [...ELEMENTLER].sort((a, b) => a.numara - b.numara)
    for (let i = 1; i < sirali.length; i++) {
      const onceki = sirali[i - 1]
      const simdiki = sirali[i]
      const ileri =
        simdiki.periyot > onceki.periyot ||
        (simdiki.periyot === onceki.periyot && simdiki.grup > onceki.grup)
      expect(ileri, `${onceki.ad} → ${simdiki.ad}`).toBe(true)
    }
  })

  it('her zorlukta soru var', () => {
    // Bir zorluk boş kalsaydı orada tur tüm havuza düşer, seçim anlamını
    // yitirirdi.
    for (const zorluk of ZORLUKLAR) {
      expect(ELEMENTLER.filter((e) => e.zorluk === zorluk).length, zorluk).toBeGreaterThan(3)
    }
  })

  it('havuz sınavda karşılığı olan elementlerle sınırlı', () => {
    // Havuz bir kez bütün tabloyu taşıdı ve oyun oynanmaz hâle geldi. Sayı
    // burada bir sınır değil bir hatırlatma: yeni element eklerken soru
    // "TYT'de çıkıyor mu" olmalı, "tabloda var mı" değil.
    expect(ELEMENTLER.length).toBeLessThan(60)
    // İlk yirmi element müfredatın çekirdeği; hepsi havuzda olmalı.
    for (let numara = 1; numara <= 20; numara++) {
      expect(
        ELEMENTLER.some((e) => e.numara === numara),
        `atom numarası ${numara}`,
      ).toBe(true)
    }
  })

  it('her sınıfın adı tanımlı', () => {
    for (const element of ELEMENTLER) {
      expect(SINIF_ADI[element.sinif], element.ad).toBeTruthy()
    }
  })
})

describe('hucreVarMi', () => {
  it('ilk periyotta yalnızca iki uç dolu', () => {
    expect(hucreVarMi(1, 1)).toBe(true)
    expect(hucreVarMi(18, 1)).toBe(true)
    expect(hucreVarMi(2, 1)).toBe(false)
    expect(hucreVarMi(13, 1)).toBe(false)
  })

  it('2. ve 3. periyotta geçiş bloğu boş', () => {
    for (const periyot of [2, 3]) {
      expect(hucreVarMi(2, periyot)).toBe(true)
      expect(hucreVarMi(13, periyot)).toBe(true)
      for (let grup = 3; grup <= 12; grup++) {
        expect(hucreVarMi(grup, periyot), `${grup}. grup`).toBe(false)
      }
    }
  })

  it('4. periyottan sonra bütün sütunlar dolu', () => {
    // Yedincisi çizilmiyor ama kural onu da kapsıyor.
    for (let periyot = 4; periyot <= 7; periyot++) {
      for (let grup = 1; grup <= GRUP_SAYISI; grup++) {
        expect(hucreVarMi(grup, periyot), `${grup}:${periyot}`).toBe(true)
      }
    }
  })
})

describe('elementBul', () => {
  it('sembolden elementi bulur', () => {
    expect(elementBul('Ca')?.ad).toBe('Kalsiyum')
  })

  it('havuzda olmayan sembolde undefined döner', () => {
    expect(elementBul('Uuo')).toBeUndefined()
  })
})

describe('enYakinlar', () => {
  it('kendini çeldirici yapmaz', () => {
    const kalsiyum = elementBul('Ca')!
    expect(enYakinlar(kalsiyum, 3).map((e) => e.sembol)).not.toContain('Ca')
  })

  it('uzaktaki elementi yakındakinin önüne koymuyor', () => {
    // Çeldirici komşudan geliyor: tabloya bakmadan elenebilen bir şık soruyu
    // anlamsız kolaylaştırırdı.
    const potasyum = elementBul('K')!
    const yakinlar = enYakinlar(potasyum, 3).map((e) => e.sembol)
    expect(yakinlar).toContain('Ca')
    expect(yakinlar).not.toContain('Au')
  })
})

describe('siklariKur', () => {
  it('dört farklı ad veriyor ve doğrusu içinde', () => {
    for (const element of ELEMENTLER) {
      const siklar = siklariKur(element)
      expect(siklar, element.ad).toHaveLength(SIK_SAYISI)
      expect(new Set(siklar).size, element.ad).toBe(SIK_SAYISI)
      expect(siklar, element.ad).toContain(element.ad)
    }
  })
})

describe('sinifSiklariKur', () => {
  it('dört farklı sınıf veriyor ve doğrusu içinde', () => {
    for (const element of ELEMENTLER.filter(sinifSorulurMu)) {
      const siklar = sinifSiklariKur(element)
      expect(siklar, element.ad).toHaveLength(SIK_SAYISI)
      expect(new Set(siklar).size, element.ad).toBe(SIK_SAYISI)
      expect(siklar, element.ad).toContain(SINIF_ADI[element.sinif])
    }
  })

  it('şıklara "Metal" hiç girmiyor', () => {
    // Kalsiyum hem toprak alkali hem metaldir; ikisi birden şıkta dururken
    // doğru cevap iki tane olurdu.
    for (const element of ELEMENTLER.filter(sinifSorulurMu)) {
      for (let deneme = 0; deneme < 20; deneme++) {
        expect(sinifSiklariKur(element), element.ad).not.toContain(SINIF_ADI.metal)
      }
    }
  })
})

describe('soruKur', () => {
  it('metal etiketli elemente sınıf sorusu sormuyor', () => {
    const metaller = ELEMENTLER.filter((e) => !sinifSorulurMu(e))
    expect(metaller.length).toBeGreaterThan(0)
    for (const element of metaller) {
      for (let deneme = 0; deneme < 50; deneme++) {
        expect(soruKur(element).tip, element.ad).not.toBe('sinif')
      }
    }
  })

  it('bul sorusunda şık yok, ötekilerde dört şık var', () => {
    for (const element of ELEMENTLER) {
      for (let deneme = 0; deneme < 20; deneme++) {
        const soru = soruKur(element)
        if (soru.tip === 'bul') expect(soru.siklar).toEqual([])
        else expect(soru.siklar, element.ad).toHaveLength(SIK_SAYISI)
      }
    }
  })

  it('doğru cevap her zaman şıklardan biri', () => {
    for (const element of ELEMENTLER) {
      for (let deneme = 0; deneme < 20; deneme++) {
        const soru = soruKur(element)
        if (soru.tip === 'bul') continue
        expect(soru.siklar, `${element.ad} · ${soru.tip}`).toContain(dogruCevap(soru))
      }
    }
  })

  it('üç tip de çıkıyor', () => {
    const tipler = new Set<string>()
    for (const element of ELEMENTLER.filter(sinifSorulurMu)) {
      for (let deneme = 0; deneme < 30; deneme++) tipler.add(soruKur(element).tip)
    }
    expect(tipler).toEqual(new Set(['bul', 'sec', 'sinif']))
  })
})

describe('tipteSoruKur', () => {
  it('istenen tipi veriyor — banka turu buna bağlı', () => {
    const kalsiyum = elementBul('Ca')!
    for (const tip of ['bul', 'sec', 'sinif'] as const) {
      const soru = tipteSoruKur(kalsiyum, tip)
      expect(soru.tip).toBe(tip)
      if (tip !== 'bul') expect(soru.siklar).toContain(dogruCevap(soru))
    }
  })

  it('sınıf sorusunun şıkları element adı değil', () => {
    const soru = tipteSoruKur(elementBul('Cl')!, 'sinif')
    expect(soru.siklar).toContain(SINIF_ADI.halojen)
    expect(soru.siklar).not.toContain('Klor')
  })
})

describe('dogruCevap', () => {
  it('sınıf sorusunda aile adını, ötekilerde element adını döner', () => {
    const demir = elementBul('Fe')!
    expect(dogruCevap(tipteSoruKur(demir, 'sinif'))).toBe(SINIF_ADI.gecis)
    expect(dogruCevap(tipteSoruKur(demir, 'sec'))).toBe('Demir')
    expect(dogruCevap(tipteSoruKur(demir, 'bul'))).toBe('Demir')
  })
})
