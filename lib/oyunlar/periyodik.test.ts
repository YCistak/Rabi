import { describe, expect, it } from 'vitest'
import {
  BOLGELER,
  BOLGE_ADI,
  ELEMENTLER,
  ELEMENT_SAYISI,
  ILK_YIRMI,
  SATIR_SAYISI,
  SORU_HAVUZU,
  SUTUN_SAYISI,
  elementBul,
  grupAdi,
  konumMetni,
  periyot,
  sorulanBul,
  tabloKonumu,
} from './periyodik-havuzu'
import {
  SIK_SAYISI,
  adCeldiricisi,
  asamaKur,
  dogruCevap,
  eliKur,
  ilkYirmiMi,
  sembolCeldiricisi,
} from './periyodik'
import { ZORLUKLAR, zorluktaSuz } from './ritim'

/** Testlerde okunurluk için: sembolden elementi bulur. */
function sembolle(sembol: string) {
  const element = ELEMENTLER.find((e) => e.sembol === sembol)
  if (!element) throw new Error(`Böyle bir element yok: ${sembol}`)
  return element
}

/** Sorulan elementler arasından — `eliKur` yalnızca onları kabul ediyor. */
function sorulan(sembol: string) {
  const element = sorulanBul(sembolle(sembol).numara)
  if (!element) throw new Error(`Sorulmayan element: ${sembol}`)
  return element
}

describe('element listesi', () => {
  it('118 element var', () => {
    expect(ELEMENT_SAYISI).toBe(118)
  })

  it('atom numaraları 1’den 118’e kesintisiz', () => {
    ELEMENTLER.forEach((element, sira) => {
      expect(element.numara).toBe(sira + 1)
    })
  })

  it('sembol ve adlar benzersiz', () => {
    expect(new Set(ELEMENTLER.map((e) => e.sembol)).size).toBe(ELEMENT_SAYISI)
    expect(new Set(ELEMENTLER.map((e) => e.ad)).size).toBe(ELEMENT_SAYISI)
  })

  it('semboller en fazla iki harf ve büyük harfle başlıyor', () => {
    for (const element of ELEMENTLER) {
      expect(element.sembol, element.ad).toMatch(/^[A-Z][a-z]?$/)
    }
  })

  it('numaradan elementi bulur, tablo dışını bulmaz', () => {
    expect(elementBul(26)?.ad).toBe('Demir')
    expect(elementBul(0)).toBeUndefined()
    expect(elementBul(119)).toBeUndefined()
  })

  it('her bölgenin adı tanımlı ve açıklama şeridinde yeri var', () => {
    for (const element of ELEMENTLER) {
      expect(BOLGE_ADI[element.bolge], element.ad).toBeTruthy()
      expect(BOLGELER, element.ad).toContain(element.bolge)
    }
  })
})

describe('bölgeler', () => {
  /*
    Hidrojen 1A sütununda durur ama alkali metal değildir. `bolgeBul` içindeki
    denetim sırası bunun için var; sıra bozulursa burası kırılıyor.
  */
  it('hidrojen ametal, alkali değil', () => {
    expect(sembolle('H').bolge).toBe('ametal')
  })

  it('bilinen elementleri doğru bölgeye koyuyor', () => {
    expect(sembolle('Na').bolge).toBe('alkali')
    expect(sembolle('Ca').bolge).toBe('toprak-alkali')
    expect(sembolle('Fe').bolge).toBe('gecis')
    expect(sembolle('Al').bolge).toBe('zayif-metal')
    expect(sembolle('Si').bolge).toBe('yari-metal')
    expect(sembolle('O').bolge).toBe('ametal')
    expect(sembolle('Cl').bolge).toBe('halojen')
    expect(sembolle('Ar').bolge).toBe('soy-gaz')
    expect(sembolle('La').bolge).toBe('lantanit')
    expect(sembolle('U').bolge).toBe('aktinit')
  })

  it('lantanit ve aktinit sıraları on beşer element', () => {
    expect(ELEMENTLER.filter((e) => e.bolge === 'lantanit')).toHaveLength(15)
    expect(ELEMENTLER.filter((e) => e.bolge === 'aktinit')).toHaveLength(15)
  })
})

describe('tablo yerleşimi', () => {
  it('iki element aynı hücreye düşmüyor', () => {
    const hucreler = ELEMENTLER.map((e) => {
      const { sutun, satir } = tabloKonumu(e.numara)
      return `${sutun}:${satir}`
    })
    expect(new Set(hucreler).size).toBe(ELEMENT_SAYISI)
  })

  it('bütün hücreler tablonun içinde', () => {
    for (const element of ELEMENTLER) {
      const { sutun, satir } = tabloKonumu(element.numara)
      expect(sutun, element.ad).toBeGreaterThanOrEqual(1)
      expect(sutun, element.ad).toBeLessThanOrEqual(SUTUN_SAYISI)
      expect(satir, element.ad).toBeGreaterThanOrEqual(1)
      expect(satir, element.ad).toBeLessThanOrEqual(SATIR_SAYISI)
    }
  })

  it('köşe taşları yerinde', () => {
    expect(tabloKonumu(1)).toEqual({ sutun: 1, satir: 1 })
    expect(tabloKonumu(2)).toEqual({ sutun: 18, satir: 1 })
    expect(tabloKonumu(3)).toEqual({ sutun: 1, satir: 2 })
    expect(tabloKonumu(5)).toEqual({ sutun: 13, satir: 2 })
    expect(tabloKonumu(10)).toEqual({ sutun: 18, satir: 2 })
    expect(tabloKonumu(17)).toEqual({ sutun: 17, satir: 3 })
    expect(tabloKonumu(21)).toEqual({ sutun: 3, satir: 4 })
    expect(tabloKonumu(36)).toEqual({ sutun: 18, satir: 4 })
    expect(tabloKonumu(57)).toEqual({ sutun: 3, satir: 9 })
    expect(tabloKonumu(71)).toEqual({ sutun: 17, satir: 9 })
    expect(tabloKonumu(72)).toEqual({ sutun: 4, satir: 6 })
    expect(tabloKonumu(89)).toEqual({ sutun: 3, satir: 10 })
    expect(tabloKonumu(103)).toEqual({ sutun: 17, satir: 10 })
    expect(tabloKonumu(118)).toEqual({ sutun: 18, satir: 7 })
  })

  /*
    8. satır boş: ana gövde ile f bloku arasındaki ayırıcı. Dolarsa tablo
    ders kitaplarındaki biçimden çıkmış demektir.
  */
  it('sekizinci satır boş kalıyor', () => {
    expect(ELEMENTLER.filter((e) => tabloKonumu(e.numara).satir === 8)).toEqual([])
  })

  it('6. ve 7. periyotta 3. sütun boş — f bloku aşağıda', () => {
    const ucuncu = ELEMENTLER.filter((e) => {
      const { sutun, satir } = tabloKonumu(e.numara)
      return sutun === 3 && (satir === 6 || satir === 7)
    })
    expect(ucuncu).toEqual([])
  })

  it('periyodu verir', () => {
    expect(periyot(1)).toBe(1)
    expect(periyot(17)).toBe(3)
    expect(periyot(26)).toBe(4)
    // f bloku ayrı satırda çiziliyor ama 6. ve 7. periyoda ait.
    expect(periyot(57)).toBe(6)
    expect(periyot(92)).toBe(7)
  })

  it('grup adını verir', () => {
    expect(grupAdi(1)).toBe('1A')
    expect(grupAdi(4)).toBe('2A')
    expect(grupAdi(13)).toBe('3A')
    expect(grupAdi(17)).toBe('7A')
    expect(grupAdi(18)).toBe('8A')
    expect(grupAdi(21)).toBe('3B')
    expect(grupAdi(26)).toBe('8B')
    expect(grupAdi(29)).toBe('1B')
    expect(grupAdi(30)).toBe('2B')
    expect(grupAdi(57)).toBe('3B')
  })

  it('konum metni okunur', () => {
    expect(konumMetni(17)).toBe('3. periyot · 7A grubu')
  })
})

describe('soru havuzu', () => {
  it('her kayıt tabloda karşılığı olan bir element', () => {
    for (const element of SORU_HAVUZU) {
      expect(elementBul(element.numara)?.sembol, String(element.numara)).toBe(element.sembol)
    }
  })

  it('aynı element iki kez sorulmuyor', () => {
    expect(new Set(SORU_HAVUZU.map((e) => e.numara)).size).toBe(SORU_HAVUZU.length)
  })

  it('kolay seviye ilk 20 elementin tamamı', () => {
    const kolay = zorluktaSuz(SORU_HAVUZU, 'kolay').map((e) => e.numara).sort((a, b) => a - b)
    expect(kolay).toEqual(Array.from({ length: ILK_YIRMI }, (_, i) => i + 1))
  })

  /*
    Orta ve zor seviyede ilk 20 hiç yok: o aralığın soru biçimi (önce ad,
    sonra sembol) kolaya ait. Karışsaydı zor bir turda "8 numara nedir"
    sorusu çıkardı.
  */
  it('orta ve zor seviyede ilk 20 element yok', () => {
    for (const zorluk of ['orta', 'zor'] as const) {
      for (const element of zorluktaSuz(SORU_HAVUZU, zorluk)) {
        expect(element.numara, element.ad).toBeGreaterThan(ILK_YIRMI)
      }
    }
  })

  /*
    Havuz bilerek dar: ilk 20'nin dışında yalnızca TYT'nin gerçekten sorduğu
    on beş element var, dolayısıyla orta ve zor seviye on soruluk boss
    aralığını tek turda dolduramıyor. Tur içindeki tekrar kabul edilmiş bir
    sonuç; şıkların yeri her gösterimde değiştiği için tekrar eden soru yine
    soru olarak kalıyor. Alt sınır bir turun ilk yarısını taşıyacak kadar.
  */
  it('her seviyede turu taşıyacak kadar element var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(zorluktaSuz(SORU_HAVUZU, zorluk).length, zorluk).toBeGreaterThanOrEqual(5)
    }
  })

  /*
    Havuzun tamamı burada yazılı. Liste elle daraltıldı: ilk 20 element ve
    TYT'nin gerçekten dönüp durduğu on beş element. Yeni bir element eklemek
    serbest ama sessizce olmamalı — bu test onu görünür kılıyor.
  */
  it('havuz ilk 20 ile seçilmiş on beş elementten ibaret', () => {
    const beklenen = [
      ...Array.from({ length: ILK_YIRMI }, (_, i) => i + 1),
      24, 26, 28, 29, 30, 35, 47, 50, 53, 78, 79, 80, 82, 88, 92,
    ]
    expect(SORU_HAVUZU.map((e) => e.numara).sort((a, b) => a - b)).toEqual(beklenen)
  })

  it('sorulan elementi numarasıyla bulur', () => {
    expect(sorulanBul(26)?.ad).toBe('Demir')
    // Tabloda var ama TYT'de sorulmuyor.
    expect(sorulanBul(118)).toBeUndefined()
  })
})

describe('eliKur', () => {
  it('ilk 20’de önce ad, sonra sembol sorulur', () => {
    const el = eliKur(sorulan('Cl'))
    expect(ilkYirmiMi(el.element)).toBe(true)
    expect(el.asamalar.map((a) => a.asama)).toEqual(['ad', 'sembol'])
  })

  it('ilk 20’nin dışında yalnızca sembol sorulur', () => {
    const el = eliKur(sorulan('Fe'))
    expect(ilkYirmiMi(el.element)).toBe(false)
    expect(el.asamalar.map((a) => a.asama)).toEqual(['sembol'])
  })

  it('her aşamada iki farklı şık ve içlerinde doğrusu var', () => {
    for (const element of SORU_HAVUZU) {
      for (const soru of eliKur(element).asamalar) {
        expect(soru.siklar, element.ad).toHaveLength(SIK_SAYISI)
        expect(new Set(soru.siklar).size, element.ad).toBe(SIK_SAYISI)
        expect(soru.siklar, element.ad).toContain(dogruCevap(soru))
      }
    }
  })

  it('doğru cevap aşamaya göre değişiyor', () => {
    const element = sorulan('Na')
    expect(dogruCevap(asamaKur(element, 'ad'))).toBe('Sodyum')
    expect(dogruCevap(asamaKur(element, 'sembol'))).toBe('Na')
  })
})

describe('ad çeldiricisi', () => {
  it('elementin kendi adını vermiyor', () => {
    for (const element of SORU_HAVUZU) {
      for (let i = 0; i < 20; i++) {
        expect(adCeldiricisi(element), element.ad).not.toBe(element.ad)
      }
    }
  })

  it('sorulan elementlerden birini veriyor', () => {
    const adlar = new Set(SORU_HAVUZU.map((e) => e.ad))
    for (const element of SORU_HAVUZU) {
      expect(adlar.has(adCeldiricisi(element)), element.ad).toBe(true)
    }
  })

  /*
    Aynı gruptan gelmesi asıl kural: tabloya bakıp elemeyi imkânsız kılıyor.
    Klorun karşısına altın konsaydı, 17'nin halojen sütununda durduğunu gören
    biri elementi hiç bilmeden doğru cevabı bulurdu.
  */
  it('aynı grupta aday varsa oradan seçiyor', () => {
    const klor = sorulan('Cl')
    const halojenler = new Set(['Flor', 'Brom', 'İyot'])
    for (let i = 0; i < 40; i++) {
      expect(halojenler.has(adCeldiricisi(klor))).toBe(true)
    }
  })
})

describe('sembol çeldiricisi', () => {
  it('gerçek bir element sembolü veriyor, doğrusunu değil', () => {
    const semboller = new Set(ELEMENTLER.map((e) => e.sembol))
    for (const element of SORU_HAVUZU) {
      for (let i = 0; i < 10; i++) {
        const celdirici = sembolCeldiricisi(element)
        expect(semboller.has(celdirici), element.ad).toBe(true)
        expect(celdirici, element.ad).not.toBe(element.sembol)
      }
    }
  })

  /*
    Öğrencinin gerçekten yaptığı hata: sembolü Türkçe addan türetmek. Altına
    "Al", kurşuna "K" demek — ikisi de başka elementlerin gerçek sembolü.
  */
  it('adından türetilebilecek yanlış sembolü seçiyor', () => {
    for (let i = 0; i < 20; i++) {
      expect(sembolCeldiricisi(sembolle('Au'))).toBe('Al')
      expect(sembolCeldiricisi(sembolle('Pb'))).toBe('K')
      expect(sembolCeldiricisi(sembolle('Hg'))).toBe('C')
      expect(['B', 'Ba']).toContain(sembolCeldiricisi(sembolle('Cu')))
    }
  })

  /*
    Türkçe'nin I/İ ayrımı: `toLowerCase()` "İ"yi noktalı bir çifte çevirdiği
    için sadeleştirme olmadan iyot hiçbir adaya uymaz ve çeldirici alakasız
    bir sembole düşerdi.
  */
  it('İ ile başlayan adlarda da harf eşleşmesi çalışıyor', () => {
    const adaylar = new Set(['In', 'Ir'])
    for (let i = 0; i < 20; i++) {
      expect(adaylar.has(sembolCeldiricisi(sembolle('I')))).toBe(true)
    }
  })
})

/*
  Havuz on soruluk boss aralığından kısa: zor seviyede yedi element var ve tur
  sınırsız. Aynı element ikinci kez sorulduğunda şıklar aynı yerde kalsaydı
  oyuncu soruyu okumadan geçen sefer dokunduğu yere dokunurdu.
*/
describe('tekrar eden element', () => {
  it('aynı elementi üst üste aynı dizilimle sormuyor', () => {
    const element = sorulan('Au')
    let onceki = asamaKur(element, 'sembol').siklar.join('|')
    for (let i = 0; i < 20; i++) {
      const simdiki = asamaKur(element, 'sembol').siklar.join('|')
      expect(simdiki).not.toBe(onceki)
      onceki = simdiki
    }
  })
})
