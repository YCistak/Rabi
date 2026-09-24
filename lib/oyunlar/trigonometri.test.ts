import { describe, expect, it } from 'vitest'
import {
  ORANLAR,
  OZEL_DEGER,
  bankaTuruHazirla,
  degerSayisi,
  kesirYaz,
  trigCevabi,
  trigKimligi,
  trigMetni,
  trigSiklari,
  trigSorusuUret,
  trigTuruHazirla,
  verilenDeger,
  type Oran,
  type TrigSorusu,
} from './trigonometri'
import { ZORLUKLAR, type Zorluk } from './ritim'
import { bankaCevabiMetni, bankaKimligi, bankaSorusuMetni, trigdenBanka } from './banka'

/** Sabit üreteç: sorular rastgele üretiliyor, tarama tekrarlanabilir olsun. */
function uretec(tohum: number): () => number {
  let x = tohum
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648
    return x / 2147483648
  }
}

/** Her seviyeden geniş, tekrarlanabilir bir örneklem. */
function ornekler(zorluk: Zorluk, adet = 400): TrigSorusu[] {
  const rastgele = uretec(zorluk.length * 7919)
  return Array.from({ length: adet }, () => trigSorusuUret(zorluk, rastgele))
}

const HEPSI = ZORLUKLAR.flatMap((z) => ornekler(z))

/** Oranın gerçek değeri — açı kenarlardan `atan2` ile bulunuyor. */
function gercekOran(oran: Oran, aci: number): number {
  switch (oran) {
    case 'sin':
      return Math.sin(aci)
    case 'cos':
      return Math.cos(aci)
    case 'tan':
      return Math.tan(aci)
    case 'cot':
      return 1 / Math.tan(aci)
  }
}

describe('değerler', () => {
  it('kesirler sadeleşiyor', () => {
    expect(kesirYaz(6, 10)).toBe('3/5')
    expect(kesirYaz(12, 4)).toBe('3')
    expect(kesirYaz(5, 13)).toBe('5/13')
  })

  it('metnin sayısal değeri okunuyor', () => {
    expect(degerSayisi('1/2')).toBeCloseTo(0.5)
    expect(degerSayisi('√3/2')).toBeCloseTo(Math.sqrt(3) / 2)
    expect(degerSayisi('√3')).toBeCloseTo(Math.sqrt(3))
    expect(degerSayisi('1')).toBe(1)
    expect(degerSayisi('12/13')).toBeCloseTo(12 / 13)
  })

  it('özel açıların tablosu gerçek değerlerle aynı', () => {
    for (const oran of ORANLAR) {
      for (const aci of [30, 45, 60] as const) {
        expect(degerSayisi(OZEL_DEGER[oran][aci]), `${oran} ${aci}`).toBeCloseTo(
          gercekOran(oran, (aci * Math.PI) / 180),
        )
      }
    }
  })
})

describe('cevaplar gerçek trigonometriyle tutuyor', () => {
  it('üçgenli sorularda α kenarlardan hesaplanınca', () => {
    for (const soru of HEPSI) {
      if (soru.tur === 'ozel') continue
      // Tümlerde cevap β'nın: β = 90° − α.
      const alfa = Math.atan2(soru.karsi, soru.komsu)
      const aci = soru.tur === 'tumler' ? Math.PI / 2 - alfa : alfa
      expect(degerSayisi(trigCevabi(soru)), JSON.stringify(soru)).toBeCloseTo(gercekOran(soru.oran, aci))
    }
  })

  it('kenarlar gerçekten dik üçgen', () => {
    for (const soru of HEPSI) {
      if (soru.tur === 'ozel') continue
      expect(soru.karsi ** 2 + soru.komsu ** 2).toBe(soru.hipotenus ** 2)
    }
  })

  it('verilen değer α’nın oranı', () => {
    for (const soru of HEPSI) {
      if (soru.tur !== 'donusum' && soru.tur !== 'tumler') continue
      const alfa = Math.atan2(soru.karsi, soru.komsu)
      expect(degerSayisi(verilenDeger(soru))).toBeCloseTo(gercekOran(soru.verilen, alfa))
    }
  })
})

describe('şıklar', () => {
  it('dört şık, biri doğru, hiçbir çeldirici doğruya eşit değil', () => {
    const rastgele = uretec(42)
    for (const soru of HEPSI) {
      const siklar = trigSiklari(soru, rastgele)
      const dogru = degerSayisi(trigCevabi(soru))
      expect(siklar, JSON.stringify(soru)).toHaveLength(4)
      expect(siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(new Set(siklar.map((s) => s.deger)).size).toBe(4)
      for (const sik of siklar.filter((s) => !s.dogruMu)) {
        expect(Math.abs(degerSayisi(sik.deger) - dogru), `${sik.deger} ~ ${trigCevabi(soru)}`).toBeGreaterThan(1e-9)
      }
    }
  })

  it('şıklar sade yazılıyor: aynı değerin ikinci yazılışı yok', () => {
    const rastgele = uretec(7)
    for (const soru of HEPSI) {
      const degerler = trigSiklari(soru, rastgele).map((s) => degerSayisi(s.deger))
      for (let i = 0; i < degerler.length; i++) {
        for (let j = i + 1; j < degerler.length; j++) {
          expect(Math.abs(degerler[i] - degerler[j])).toBeGreaterThan(1e-9)
        }
      }
    }
  })

  /*
    Tümler sorunun tuzağı aynı adlı oran: tan α = 3/4 verilip tan β
    sorulduğunda 3/4 şıkta durmalı. Çeldiriciler β'nın öteki oranlarından
    geldiği için bu kendiliğinden oluyor — test onu tutuyor.
  */
  it('tümlerde verilen değer şıklarda duruyor (tuzak)', () => {
    const rastgele = uretec(99)
    for (const soru of HEPSI) {
      if (soru.tur !== 'tumler' || soru.oran !== soru.verilen) continue
      const siklar = trigSiklari(soru, rastgele).map((s) => s.deger)
      // tan/cot sorusunda çeldirici üç tane ve hepsi şıkta; sin/cos'ta dört
      // adaydan üçü seçiliyor, orada garanti yok.
      if (soru.oran === 'tan' || soru.oran === 'cot') {
        expect(siklar).toContain(verilenDeger(soru))
      }
    }
  })
})

describe('zorluk soru biçimini seçiyor', () => {
  const turler = (z: Zorluk) => new Set(ornekler(z).map((s) => s.tur))

  it('kolayda tanım ve özel açılar, cot yok', () => {
    expect(turler('kolay')).toEqual(new Set(['ucgen', 'ozel']))
    expect(ornekler('kolay').some((s) => s.oran === 'cot')).toBe(false)
    expect(ornekler('kolay').some((s) => s.tur === 'ozel' && s.oran === 'tan')).toBe(false)
  })

  it('ortada eksik kenar ve cot geliyor', () => {
    expect(turler('orta')).toEqual(new Set(['ucgen', 'eksik', 'ozel']))
    expect(ornekler('orta').some((s) => s.oran === 'cot')).toBe(true)
  })

  it('zorda şekilsiz dönüşüm ve tümler açı', () => {
    expect(turler('zor')).toEqual(new Set(['donusum', 'tumler', 'eksik']))
  })

  it('eksik kenar sorulan oranın içinde', () => {
    const icinde: Record<Oran, string[]> = {
      sin: ['karsi', 'hipotenus'],
      cos: ['komsu', 'hipotenus'],
      tan: ['karsi', 'komsu'],
      cot: ['karsi', 'komsu'],
    }
    for (const soru of HEPSI) {
      if (soru.tur !== 'eksik') continue
      expect(soru.gizli).not.toBeNull()
      expect(icinde[soru.oran]).toContain(soru.gizli)
    }
  })

  it('dönüşümde sorulan oran verilenden farklı', () => {
    for (const soru of HEPSI) {
      if (soru.tur === 'donusum') expect(soru.oran).not.toBe(soru.verilen)
    }
  })
})

describe('tur', () => {
  it('yakın sorular tekrarlanmıyor', () => {
    for (const zorluk of ZORLUKLAR) {
      const kimlikler = trigTuruHazirla(60, zorluk, uretec(3)).map((s) => trigKimligi(s.soru))
      expect(kimlikler).toHaveLength(60)
      for (let i = 1; i < kimlikler.length; i++) {
        expect(kimlikler.slice(Math.max(0, i - 12), i)).not.toContain(kimlikler[i])
      }
    }
  })

  it('banka turu kayıtlı soruların hepsini soruyor', () => {
    const sorular = ornekler('orta', 10)
    const tur = bankaTuruHazirla(sorular, uretec(5))
    expect(tur.map((s) => trigKimligi(s.soru)).sort()).toEqual(sorular.map(trigKimligi).sort())
  })
})

describe('banka', () => {
  it('kayıt metni şekilsiz de cevaplanabiliyor: yazılı kenarlar satırda', () => {
    for (const soru of HEPSI) {
      const metin = trigMetni(soru)
      if (soru.tur === 'ucgen') expect(metin).toMatch(/karşı \d+, komşu \d+, hipotenüs \d+/)
      if (soru.tur === 'eksik') expect((metin.match(/\d+/g) ?? []).length).toBe(2)
    }
  })

  it('kimlik, metin ve cevap bankadan okunuyor', () => {
    const soru = HEPSI[0]
    const kayit = trigdenBanka(soru)
    expect(bankaKimligi(kayit)).toBe(`trigonometri:${trigKimligi(soru)}`)
    expect(bankaSorusuMetni(kayit)).toBe(trigMetni(soru))
    expect(bankaCevabiMetni(kayit)).toBe(trigCevabi(soru))
  })
})
