import { describe, expect, it } from 'vitest'
import type { YazimSorusu } from './yazim-havuzu'
import { YAZIM_HAVUZU } from './yazim-havuzu'
import {
  BOS_ISTATISTIK,
  TUR_SURESI,
  istatistigiGuncelle,
  kalanSaniye,
  karistir,
  rekorKirildiMi,
  sureOrani,
  turHazirla,
  turOzeti,
  type Cevap,
} from './yazim-oyunu'

/** Sabit sıra üreten sahte rastgele — testler tekrarlanabilir olsun. */
function sahteRastgele(degerler: number[]): () => number {
  let sira = 0
  return () => degerler[sira++ % degerler.length]
}

const ornek: YazimSorusu[] = [
  { dogru: 'yalnız', yanlis: 'yanlız', kural: 'ses' },
  { dogru: 'her şey', yanlis: 'herşey', kural: 'ayri' },
  { dogru: 'birçok', yanlis: 'bir çok', kural: 'bitisik' },
]

describe('yazım havuzu', () => {
  it('doğru ve yanlış şık hiçbir soruda aynı değil', () => {
    const ayni = YAZIM_HAVUZU.filter((s) => s.dogru === s.yanlis)
    expect(ayni).toEqual([])
  })

  it('aynı doğru yazılış iki kez geçmiyor', () => {
    const gorulen = new Set<string>()
    const tekrar = YAZIM_HAVUZU.filter((s) => {
      if (gorulen.has(s.dogru)) return true
      gorulen.add(s.dogru)
      return false
    })
    expect(tekrar).toEqual([])
  })

  it('bir turu doldurmaya yetecek kadar soru var', () => {
    // Turda saniyede birden fazla cevap verilemiyor; havuz süreden büyük olmalı
    // ki tur ortasında soru bitmesin.
    expect(YAZIM_HAVUZU.length).toBeGreaterThan(TUR_SURESI)
  })

  it('hiçbir şık boş değil', () => {
    const bos = YAZIM_HAVUZU.filter((s) => s.dogru.trim() === '' || s.yanlis.trim() === '')
    expect(bos).toEqual([])
  })
})

describe('karistir', () => {
  it('aynı elemanları döndürür, kaynağı değiştirmez', () => {
    const kaynak = [1, 2, 3, 4, 5]
    const sonuc = karistir(kaynak, sahteRastgele([0.9, 0.1, 0.5, 0.3]))
    expect([...sonuc].sort()).toEqual(kaynak)
    expect(kaynak).toEqual([1, 2, 3, 4, 5])
  })
})

describe('turHazirla', () => {
  it('havuzdaki her soruyu bir kez kullanır', () => {
    const tur = turHazirla(ornek, sahteRastgele([0.2, 0.7, 0.4, 0.9, 0.1]))
    expect(tur).toHaveLength(ornek.length)
    expect(new Set(tur.map((s) => s.soru.dogru)).size).toBe(ornek.length)
  })

  it('her soruda tam olarak bir doğru şık var', () => {
    for (const soru of turHazirla(ornek)) {
      expect(soru.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(soru.siklar.map((s) => s.metin).sort()).toEqual(
        [soru.soru.dogru, soru.soru.yanlis].sort(),
      )
    }
  })

  it('doğru şık her zaman aynı tarafa düşmüyor', () => {
    // Konum sabit olsaydı oyuncu kelimeye bakmadan kazanırdı.
    const uzunHavuz = Array.from({ length: 60 }, (_, i) => ({
      dogru: `d${i}`,
      yanlis: `y${i}`,
      kural: 'ses' as const,
    }))
    const ustte = turHazirla(uzunHavuz).filter((s) => s.siklar[0].dogruMu).length
    expect(ustte).toBeGreaterThan(0)
    expect(ustte).toBeLessThan(uzunHavuz.length)
  })
})

describe('turOzeti', () => {
  const cevaplar: Cevap[] = [
    { soru: ornek[0], dogruMu: true },
    { soru: ornek[1], dogruMu: false },
    { soru: ornek[2], dogruMu: true },
  ]

  it('doğru, yanlış ve oranı sayar', () => {
    const ozet = turOzeti(cevaplar)
    expect(ozet).toMatchObject({ dogru: 2, yanlis: 1, toplam: 3 })
    expect(ozet.oran).toBeCloseTo(2 / 3)
  })

  it('yanlış bilinen soruları listeler', () => {
    expect(turOzeti(cevaplar).yanlislar).toEqual([ornek[1]])
  })

  it('hiç cevap verilmemiş tur hatasız sayılmaz', () => {
    const ozet = turOzeti([])
    expect(ozet.hatasiz).toBe(false)
    expect(ozet.oran).toBe(0)
  })

  it('yanlışsız tur hatasız sayılır', () => {
    expect(turOzeti([{ soru: ornek[0], dogruMu: true }]).hatasiz).toBe(true)
  })
})

describe('sayaç', () => {
  it('kalan saniye hedef zamandan hesaplanır', () => {
    expect(kalanSaniye(10_000, 0)).toBe(10)
    expect(kalanSaniye(10_000, 7_500)).toBe(3)
  })

  it('süre geçmişse eksiye düşmez', () => {
    // Yanlış cezası hedef zamanı geriye çekiyor; ceza kalan süreden büyükse
    // sayaç eksiye düşmemeli, tur bitmeli.
    expect(kalanSaniye(1_000, 9_000)).toBe(0)
  })

  it('süre oranı 0 ile 1 arasında kalır', () => {
    expect(sureOrani(TUR_SURESI)).toBe(1)
    expect(sureOrani(0)).toBe(0)
    expect(sureOrani(TUR_SURESI * 2)).toBe(1)
  })
})

describe('istatistik', () => {
  const iyiTur = turOzeti([
    { soru: ornek[0], dogruMu: true },
    { soru: ornek[1], dogruMu: true },
  ])
  const kotuTur = turOzeti([
    { soru: ornek[0], dogruMu: true },
    { soru: ornek[1], dogruMu: false },
  ])

  it('ilk turu boş kayıttan kurar', () => {
    const sonuc = istatistigiGuncelle(undefined, iyiTur, '2026-08-17')
    expect(sonuc).toEqual({
      enIyiDogru: 2,
      oynananTur: 1,
      toplamDogru: 2,
      toplamYanlis: 0,
      hatasizTur: 1,
      sonTarih: '2026-08-17',
    })
  })

  it('daha kötü bir tur rekoru düşürmez', () => {
    const once = istatistigiGuncelle(undefined, iyiTur, '2026-08-17')
    const sonra = istatistigiGuncelle(once, kotuTur, '2026-08-18')
    expect(sonra.enIyiDogru).toBe(2)
    expect(sonra.oynananTur).toBe(2)
    expect(sonra.toplamDogru).toBe(3)
    expect(sonra.toplamYanlis).toBe(1)
    expect(sonra.hatasizTur).toBe(1)
  })

  it('rekor yalnızca gerçekten geçilince kırılır', () => {
    expect(rekorKirildiMi(undefined, iyiTur)).toBe(true)
    expect(rekorKirildiMi({ ...BOS_ISTATISTIK, enIyiDogru: 2 }, iyiTur)).toBe(false)
    expect(rekorKirildiMi({ ...BOS_ISTATISTIK, enIyiDogru: 1 }, iyiTur)).toBe(true)
  })

  it('sıfır doğrulu tur rekor sayılmaz', () => {
    const bosTur = turOzeti([{ soru: ornek[0], dogruMu: false }])
    expect(rekorKirildiMi(undefined, bosTur)).toBe(false)
  })
})
