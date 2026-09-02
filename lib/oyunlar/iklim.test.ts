import { describe, expect, it } from 'vitest'
import { DUNYA, noktayaCevir, ulkeBul } from './dunya-havuzu'
import { IKLIM_ADI, IKLIM_HAVUZU, KARISTIRILAN, type IklimTipi } from './iklim-havuzu'
import { ENLEM_CIZGILERI, iklimBul, isaretNoktasi, siklariKur, soruUlkesi, turHazirla } from './iklim'
import { ZORLUKLAR } from './ritim'

function uretec(tohum: number): () => number {
  let x = tohum
  return () => {
    x = (x * 9301 + 49297) % 233280
    return x / 233280
  }
}

const TIPLER = Object.keys(IKLIM_ADI) as IklimTipi[]

describe('havuz', () => {
  it('bölge adları benzersiz', () => {
    const adlar = IKLIM_HAVUZU.map((s) => s.ad)
    expect(new Set(adlar).size).toBe(adlar.length)
  })

  /*
    Ülke kodu havuzda elle yazılıyor, sınır dünya haritasından geliyor. Kod
    tutmazsa soru haritada hiçbir yeri boyamıyor ve öğrenci "işaretli bölge"yi
    yalnızca halkadan çıkarmak zorunda kalıyor — sessiz bir bozulma, o yüzden
    test ediliyor.
  */
  it('her ülke kodu haritada karşılık buluyor', () => {
    for (const soru of IKLIM_HAVUZU) {
      if (soru.ulke === null) continue
      expect(ulkeBul(soru.ulke), `${soru.ad} → ${soru.ulke}`).toBeDefined()
    }
  })

  it('koordinatlar dünya üzerinde', () => {
    for (const soru of IKLIM_HAVUZU) {
      const [boylam, enlem] = soru.nokta
      expect(boylam).toBeGreaterThanOrEqual(-180)
      expect(boylam).toBeLessThanOrEqual(180)
      // Haritanın kesildiği enlemler: dışında kalan bir nokta kutuya
      // yapışır ve yanlış yeri gösterirdi.
      expect(enlem).toBeGreaterThan(-56)
      expect(enlem).toBeLessThan(84)
    }
  })

  /** İşaret haritanın içine düşmeli; kenara yapışan halka okunmuyor. */
  it('işaret noktaları kutunun içinde', () => {
    for (const soru of IKLIM_HAVUZU) {
      const [x, y] = isaretNoktasi(soru)
      expect(x).toBeGreaterThan(0)
      expect(x).toBeLessThan(1000)
      expect(y).toBeGreaterThan(0)
      expect(y).toBeLessThan(389)
    }
  })

  /*
    Ülkeli soruda halka ülkenin üstünde durmalı: elle yazılan koordinat ile
    kodun birbirini tutmaması, Kenya yazıp Peru'yu işaretlemek demek.
  */
  it('ülkeli sorularda halka ülkenin yakınında', () => {
    for (const soru of IKLIM_HAVUZU) {
      const ulke = soruUlkesi(soru)
      if (!ulke) continue
      const [x, y] = isaretNoktasi(soru)
      const uzaklik = Math.hypot(x - ulke.merkez[0], y - ulke.merkez[1])
      // Rusya gibi çok geniş ülkelerde merkez uzakta kalabiliyor; eşik
      // "aynı bölge" demeye yetecek kadar geniş, "başka kıta" demeye yetmez.
      expect(uzaklik, `${soru.ad}`).toBeLessThan(90)
    }
  })

  it('her zorlukta soru var', () => {
    for (const zorluk of ZORLUKLAR) {
      expect(IKLIM_HAVUZU.filter((s) => s.zorluk === zorluk).length).toBeGreaterThan(4)
    }
  })

  it('her iklim tipi en az bir kez soruluyor', () => {
    for (const tip of TIPLER) {
      expect(IKLIM_HAVUZU.some((s) => s.iklim === tip), tip).toBe(true)
    }
  })

  it('açıklamalar dolu', () => {
    for (const soru of IKLIM_HAVUZU) {
      expect(soru.aciklama.length).toBeGreaterThan(30)
    }
  })

  it('adından bulunuyor — banka kaydı yalnızca adı saklıyor', () => {
    for (const soru of IKLIM_HAVUZU) {
      expect(iklimBul(soru.ad)).toBe(soru)
    }
    expect(iklimBul('Olmayan Bölge')).toBeUndefined()
  })
})

describe('çeldiriciler', () => {
  it('her tipin üç karıştırılanı var ve kendisi listede yok', () => {
    for (const tip of TIPLER) {
      expect(KARISTIRILAN[tip]).toHaveLength(3)
      expect(KARISTIRILAN[tip]).not.toContain(tip)
      expect(new Set(KARISTIRILAN[tip]).size).toBe(3)
    }
  })

  it('dört şık, tek doğru', () => {
    for (const soru of IKLIM_HAVUZU) {
      const siklar = siklariKur(soru, uretec(soru.ad.length + 3))
      expect(siklar).toHaveLength(4)
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(siklar.find((s) => s.dogruMu)?.deger).toBe(soru.iklim)
      expect(new Set(siklar.map((s) => s.deger)).size).toBe(4)
    }
  })
})

describe('tur', () => {
  it('havuzun tamamını bir kez dağıtıyor', () => {
    const sorular = turHazirla(IKLIM_HAVUZU, uretec(11))
    expect(sorular).toHaveLength(IKLIM_HAVUZU.length)
    expect(new Set(sorular.map((s) => s.soru.ad)).size).toBe(IKLIM_HAVUZU.length)
  })

  it('karıştırma kapalıyken sıra korunuyor — boss yerleşimi bozulmasın', () => {
    const sorular = turHazirla(IKLIM_HAVUZU, uretec(11), false)
    expect(sorular.map((s) => s.soru.ad)).toEqual(IKLIM_HAVUZU.map((s) => s.ad))
  })
})

describe('harita', () => {
  it('ülkeler benzersiz kodlarla duruyor', () => {
    const kodlar = DUNYA.map((u) => u.kod)
    expect(new Set(kodlar).size).toBe(kodlar.length)
    expect(DUNYA.length).toBeGreaterThan(150)
  })

  it('ekvator kutunun ortasına değil kendi enlemine düşüyor', () => {
    const [, ekvator] = noktayaCevir(0, 0)
    const [, yengec] = noktayaCevir(0, 23.5)
    expect(yengec).toBeLessThan(ekvator)
    expect(ekvator).toBeCloseTo(84 * (1000 / 360), 3)
  })

  it('çizilen enlemler haritanın içinde', () => {
    for (const { enlem } of ENLEM_CIZGILERI) {
      const [, y] = noktayaCevir(0, enlem)
      expect(y).toBeGreaterThan(0)
      expect(y).toBeLessThan(389)
    }
  })
})
