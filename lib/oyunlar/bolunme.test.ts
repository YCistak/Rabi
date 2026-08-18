import { describe, expect, it } from 'vitest'
import {
  BOLEN_KURALI,
  EN_BUYUK_SAYI,
  EN_KUCUK_SAYI,
  KALAN_BOLENLERI,
  KALAN_KURALI,
  TUM_BOLENLER,
  bolunmeCevabi,
  bolunmeTuruHazirla,
  kuralIzi,
  rakamToplami,
  sayiUret,
  yediAdimlari,
} from './bolunme'

/** Tekrarlanabilir sözde rastgele üreteç — testler sabit sonuç versin diye. */
function uretec(tohum: number): () => number {
  let x = tohum
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648
    return x / 2147483648
  }
}

describe('sayiUret', () => {
  it('istenen kalanı veren, dört ya da beş basamaklı sayı üretir', () => {
    const r = uretec(7)
    for (const bolen of TUM_BOLENLER) {
      for (let kalan = 0; kalan < bolen; kalan++) {
        for (let i = 0; i < 20; i++) {
          const sayi = sayiUret(bolen, kalan, r)
          expect(sayi % bolen, `${sayi} % ${bolen}`).toBe(kalan)
          expect(sayi).toBeGreaterThanOrEqual(EN_KUCUK_SAYI)
          expect(sayi).toBeLessThanOrEqual(EN_BUYUK_SAYI)
        }
      }
    }
  })
})

describe('rakamToplami', () => {
  it('rakamları toplar', () => {
    expect(rakamToplami(4536)).toBe(18)
    expect(rakamToplami(10000)).toBe(1)
  })

  it('3 ve 9 kuralının dayanağı: toplamın kalanı sayının kalanıdır', () => {
    const r = uretec(3)
    for (let i = 0; i < 300; i++) {
      const sayi = sayiUret(7, 3, r)
      expect(rakamToplami(sayi) % 3).toBe(sayi % 3)
      expect(rakamToplami(sayi) % 9).toBe(sayi % 9)
    }
  })
})

describe('yediAdimlari', () => {
  it('sayıyı iki basamağa indirir', () => {
    expect(yediAdimlari(4536)).toEqual([441, 42])
  })

  it('bölünebilirliği korur', () => {
    const r = uretec(11)
    for (let i = 0; i < 200; i++) {
      const sayi = sayiUret(7, i % 7, r)
      const adimlar = yediAdimlari(sayi)
      const son = adimlar[adimlar.length - 1]
      expect(son % 7 === 0, `${sayi} → ${adimlar.join(' → ')}`).toBe(sayi % 7 === 0)
    }
  })

  it('sonsuz döngüye girmez', () => {
    for (const sayi of [1000, 10000, 99999, 10080, 50008]) {
      expect(yediAdimlari(sayi).length).toBeLessThanOrEqual(6)
    }
  })
})

describe('kuralIzi', () => {
  it('kuralın bu sayıdaki karşılığını yazar', () => {
    expect(kuralIzi(4536, 3)).toBe('rakam toplamı 4+5+3+6 = 18')
    expect(kuralIzi(4536, 4)).toBe('son iki hane 36')
    expect(kuralIzi(4536, 8)).toBe('son üç hane 536')
    expect(kuralIzi(4536, 7)).toBe('4536 → 441 → 42')
    expect(kuralIzi(4530, 10)).toBe('son rakam 0')
  })

  it('her bölen için bir iz var', () => {
    for (const bolen of TUM_BOLENLER) {
      expect(kuralIzi(48312, bolen), String(bolen)).not.toBe('')
    }
  })
})

describe('kural metinleri', () => {
  it('her bölenin kuralı yazılı', () => {
    for (const bolen of TUM_BOLENLER) {
      expect(BOLEN_KURALI[bolen], String(bolen)).toBeTruthy()
    }
  })

  it('kalan sorulan her bölenin kalan kuralı da yazılı', () => {
    for (const bolen of KALAN_BOLENLERI) {
      expect(KALAN_KURALI[bolen], String(bolen)).toBeTruthy()
    }
  })

  it('6 ve 7 kalan sorusuna girmiyor', () => {
    expect(KALAN_BOLENLERI).not.toContain(6)
    expect(KALAN_BOLENLERI).not.toContain(7)
  })
})

describe('bolunmeTuruHazirla', () => {
  it('istenen sayıda soru üretir', () => {
    expect(bolunmeTuruHazirla(TUM_BOLENLER, 40, uretec(1))).toHaveLength(40)
  })

  it('yalnızca seçili bölenleri sorar', () => {
    for (const soru of bolunmeTuruHazirla([7, 8], 60, uretec(2))) {
      expect([7, 8]).toContain(soru.bolen)
    }
  })

  it('yalnızca 6 ve 7 seçiliyse kalan sorusu üretmez', () => {
    for (const soru of bolunmeTuruHazirla([6, 7], 60, uretec(5))) {
      expect(soru.tip).toBe('bolunur')
    }
  })

  it('kalan sorusu yalnızca kuralı kalanı veren bölenlerde çıkar', () => {
    for (const soru of bolunmeTuruHazirla(TUM_BOLENLER, 300, uretec(9))) {
      if (soru.tip === 'kalan') expect(KALAN_BOLENLERI).toContain(soru.bolen)
    }
  })

  it('sorular dört ya da beş basamaklı', () => {
    for (const soru of bolunmeTuruHazirla(TUM_BOLENLER, 200, uretec(4))) {
      expect(String(soru.sayi).length).toBeGreaterThanOrEqual(4)
      expect(String(soru.sayi).length).toBeLessThanOrEqual(5)
    }
  })

  it('aynı soru arka arkaya gelmiyor', () => {
    const sorular = bolunmeTuruHazirla(TUM_BOLENLER, 120, uretec(6))
    const imzalar = sorular.map((s) => `${s.tip}:${s.sayi}:${s.bolen}`)
    for (let i = 0; i < imzalar.length; i++) {
      expect(imzalar.slice(Math.max(0, i - 12), i)).not.toContain(imzalar[i])
    }
  })

  /**
   * Oyunun can damarı: "bölünür mü" sorularında Evet ile Hayır dengeli olmalı.
   * Sayılar rastgele seçilseydi 7'ye bölünenlerin oranı yedide bir olur, hep
   * "Hayır" diyen oyuncu kural bilmeden kazanırdı.
   */
  it('her bölende Evet ve Hayır dengeli', () => {
    for (const bolen of TUM_BOLENLER) {
      const sorular = bolunmeTuruHazirla([bolen], 400, uretec(bolen * 31)).filter(
        (s) => s.tip === 'bolunur',
      )
      const evet = sorular.filter((s) => bolunmeCevabi(s) === 0).length
      const oran = evet / sorular.length
      expect(oran, `${bolen} → ${Math.round(oran * 100)}% evet`).toBeGreaterThan(0.35)
      expect(oran, `${bolen} → ${Math.round(oran * 100)}% evet`).toBeLessThan(0.65)
    }
  })

  /** Bölen önce seçildiği için her bölen eşit sıklıkta çıkmalı — 6 ve 7 dahil. */
  it('bölenler eşit dağılıyor', () => {
    const sorular = bolunmeTuruHazirla(TUM_BOLENLER, 3000, uretec(21))
    const beklenen = sorular.length / TUM_BOLENLER.length
    for (const bolen of TUM_BOLENLER) {
      const sayi = sorular.filter((s) => s.bolen === bolen).length
      expect(sayi, `${bolen} → ${sayi}`).toBeGreaterThan(beklenen * 0.75)
      expect(sayi, `${bolen} → ${sayi}`).toBeLessThan(beklenen * 1.25)
    }
  })

  it('kalan sorularında her kalan değeri çıkabiliyor', () => {
    const gorulen = new Set<number>()
    for (const soru of bolunmeTuruHazirla([9], 400, uretec(13))) {
      if (soru.tip === 'kalan') gorulen.add(bolunmeCevabi(soru))
    }
    expect(gorulen.size).toBe(9)
  })
})
