import { describe, expect, it } from 'vitest'
import { KAVRAM_HAVUZU, KAVRAM_KONU_ADI, type KavramEsi } from './kavram-havuzu'
import {
  CELDIRICI_SAYISI,
  KAVRAM_SAYISI,
  TANIM_SAYISI,
  eslesiyorMu,
  tahtaHazirla,
  tanimSahibi,
  taniminiBul,
} from './kavram'
import { ZORLUKLAR, zorluktaSuz } from './ritim'

describe('kavram havuzu', () => {
  it('aynı kavram iki kez geçmiyor', () => {
    const gorulen = new Set<string>()
    const tekrar = KAVRAM_HAVUZU.filter((e) => {
      if (gorulen.has(e.kavram)) return true
      gorulen.add(e.kavram)
      return false
    })
    expect(tekrar).toEqual([])
  })

  /*
    İki kavramın tanımı birebir aynı olsaydı, biri çeldirici olarak geldiğinde
    oyuncu doğru tanıma dokunup yanlış sayılırdı — oyunun affetmediği hata bu.
  */
  it('aynı tanım iki kavrama ait değil', () => {
    const gorulen = new Set<string>()
    const tekrar = KAVRAM_HAVUZU.filter((e) => {
      if (gorulen.has(e.tanim)) return true
      gorulen.add(e.tanim)
      return false
    })
    expect(tekrar).toEqual([])
  })

  it('hiçbir alan boş değil', () => {
    const bos = KAVRAM_HAVUZU.filter((e) => e.kavram.trim() === '' || e.tanim.trim() === '')
    expect(bos).toEqual([])
  })

  it('her konunun adı tanımlı', () => {
    for (const es of KAVRAM_HAVUZU) {
      expect(KAVRAM_KONU_ADI[es.konu], es.kavram).toBeTruthy()
    }
  })

  /*
    Sağ sütunda beş tanım alt alta duruyor; uzun bir tanım kutuyu büyütüp
    aşağıdakileri ekrandan taşırıyor.
  */
  it('tanımlar kutuya sığacak kadar kısa', () => {
    for (const es of KAVRAM_HAVUZU) {
      expect(es.tanim.length, es.tanim).toBeLessThanOrEqual(100)
    }
  })

  it('kavram adları tuşa sığacak kadar kısa', () => {
    for (const es of KAVRAM_HAVUZU) {
      expect(es.kavram.length, es.kavram).toBeLessThanOrEqual(20)
    }
  })

  it('her konu tek başına tahta kurabiliyor', () => {
    // Çeldiriciler de aynı konudan geliyor: konuda en az beş kavram olmalı.
    const sayilar = new Map<string, number>()
    for (const es of KAVRAM_HAVUZU) sayilar.set(es.konu, (sayilar.get(es.konu) ?? 0) + 1)
    for (const [konu, adet] of sayilar) {
      expect(adet, konu).toBeGreaterThanOrEqual(TANIM_SAYISI)
    }
  })

  it('bir turu doldurmaya yetecek kadar kavram var', () => {
    expect(KAVRAM_HAVUZU.length).toBeGreaterThan(KAVRAM_SAYISI * 10)
  })
})

describe('zorluk dağılımı', () => {
  it('her seviyede tahta kurmaya yetecek kavram var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(zorluktaSuz(KAVRAM_HAVUZU, zorluk).length, zorluk).toBeGreaterThan(KAVRAM_SAYISI * 3)
    }
  })

  it('her seviyede tek konudan tahta kurulabiliyor', () => {
    for (const zorluk of ZORLUKLAR) {
      const konular = new Map<string, number>()
      for (const es of zorluktaSuz(KAVRAM_HAVUZU, zorluk)) {
        konular.set(es.konu, (konular.get(es.konu) ?? 0) + 1)
      }
      const yeterli = [...konular.values()].filter((adet) => adet >= KAVRAM_SAYISI)
      expect(yeterli.length, zorluk).toBeGreaterThan(0)
    }
  })

  /*
    Çeldiriciler süzgecin dışında kalmalı: zor seviyede bir konuda beş kavram
    kalmayabiliyor, çeldirici de süzülseydi tahta konu bütünlüğünü kaybederdi.
  */
  it('çeldiriciler süzülmüş havuzun dışından gelebiliyor', () => {
    for (const zorluk of ZORLUKLAR) {
      const suzulmus = zorluktaSuz(KAVRAM_HAVUZU, zorluk)
      for (let i = 0; i < 50; i++) {
        const tahta = tahtaHazirla(new Set(), suzulmus, Math.random, KAVRAM_HAVUZU)
        expect(tahta, zorluk).not.toBeNull()
        // Sorulan kavramlar süzgeçten, tahtanın tamamı değil.
        for (const es of tahta!.esler) expect(es.zorluk, es.kavram).toBe(zorluk)
        expect(tahta!.tanimlar).toHaveLength(TANIM_SAYISI)
      }
    }
  })
})

describe('tahtaHazirla', () => {
  it('üç kavram ve beş tanım verir', () => {
    const tahta = tahtaHazirla()!
    expect(tahta.esler).toHaveLength(KAVRAM_SAYISI)
    expect(tahta.kavramlar).toHaveLength(KAVRAM_SAYISI)
    expect(tahta.tanimlar).toHaveLength(TANIM_SAYISI)
  })

  it('tanımların ikisinin karşılığı yok', () => {
    for (let i = 0; i < 200; i++) {
      const tahta = tahtaHazirla()!
      const sahipsiz = tahta.tanimlar.filter((t) => tanimSahibi(tahta, t) === null)
      expect(sahipsiz).toHaveLength(CELDIRICI_SAYISI)
    }
  })

  it('doğru tanımların hepsi tahtada duruyor', () => {
    for (let i = 0; i < 100; i++) {
      const tahta = tahtaHazirla()!
      for (const es of tahta.esler) {
        expect(tahta.tanimlar, es.kavram).toContain(es.tanim)
      }
      expect(new Set(tahta.tanimlar).size).toBe(TANIM_SAYISI)
    }
  })

  it('çeldiriciler de aynı konudan geliyor', () => {
    // Başka konudan gelselerdi ("Balbal" tanımı Osmanlı vergilerinin arasında)
    // okumadan elenirdi.
    for (let i = 0; i < 100; i++) {
      const tahta = tahtaHazirla()!
      if (tahta.konu === null) continue
      const konununTanimlari = new Set(
        KAVRAM_HAVUZU.filter((e) => e.konu === tahta.konu).map((e) => e.tanim),
      )
      for (const tanim of tahta.tanimlar) {
        expect(konununTanimlari.has(tanim), tanim).toBe(true)
      }
    }
  })

  it('tek konu yetiyorsa tahta o konudan kurulur', () => {
    for (let i = 0; i < 50; i++) {
      const tahta = tahtaHazirla()!
      if (tahta.konu !== null) {
        expect(new Set(tahta.esler.map((e) => e.konu))).toEqual(new Set([tahta.konu]))
      }
    }
  })

  it('kullanılmış kavramları tekrar sormuyor', () => {
    const ilk = tahtaHazirla()!
    const kullanilan = new Set(ilk.esler.map((e) => e.kavram))
    const ikinci = tahtaHazirla(kullanilan)!
    for (const es of ikinci.esler) {
      expect(kullanilan.has(es.kavram), es.kavram).toBe(false)
    }
  })

  it('kullanılmış bir kavramın tanımı çeldirici olarak gelebilir', () => {
    // Bilerek: bir kez okunan tanımı hatırlamak oyunun parçası.
    const kullanilan = new Set(KAVRAM_HAVUZU.slice(0, 5).map((e) => e.kavram))
    for (let i = 0; i < 50; i++) {
      const tahta = tahtaHazirla(kullanilan)
      expect(tahta).not.toBeNull()
    }
  })

  it('kavram kalmayınca null döner', () => {
    const hepsi = new Set(KAVRAM_HAVUZU.map((e) => e.kavram))
    expect(tahtaHazirla(hepsi)).toBeNull()
  })

  it('çeldiriciye yer olmayan havuzda tahta kurulamaz', () => {
    const havuz: KavramEsi[] = [
      { kavram: 'a', tanim: 'a tanımı', konu: 'inkilap', zorluk: 'orta' },
      { kavram: 'b', tanim: 'b tanımı', konu: 'inkilap', zorluk: 'orta' },
      { kavram: 'c', tanim: 'c tanımı', konu: 'inkilap', zorluk: 'orta' },
    ]
    expect(tahtaHazirla(new Set(), havuz)).toBeNull()
  })
})

describe('eşleştirme', () => {
  const tahta = tahtaHazirla()!

  it('doğru çifti tanır', () => {
    const es = tahta.esler[0]
    expect(eslesiyorMu(tahta, es.kavram, es.tanim)).toBe(true)
  })

  it('yanlış çifti reddeder', () => {
    const [ilk, ikinci] = tahta.esler
    expect(eslesiyorMu(tahta, ilk.kavram, ikinci.tanim)).toBe(false)
  })

  it('çeldiriciye dokunmak yanlış sayılır', () => {
    const celdirici = tahta.tanimlar.find((t) => tanimSahibi(tahta, t) === null)!
    expect(eslesiyorMu(tahta, tahta.esler[0].kavram, celdirici)).toBe(false)
  })

  it('kavramın tanımını bulur', () => {
    const es = tahta.esler[2]
    expect(taniminiBul(tahta, es.kavram)).toBe(es.tanim)
    expect(taniminiBul(tahta, 'olmayan kavram')).toBeNull()
  })
})
