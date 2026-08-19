import { describe, expect, it } from 'vitest'
import {
  ISARET_SIMGESI,
  NOKTALAMA_ACIKLAMASI,
  NOKTALAMA_HAVUZU,
  type NoktalamaSorusu,
} from './noktalama-havuzu'
import { havuzlariSec, turHazirla, type Havuzlar } from './yazim-oyunu'
import type { YazimSorusu } from './yazim-havuzu'

/** Metinde bir karakterin kaç kez geçtiği. */
function sayim(metin: string, karakter: string): number {
  return metin.split(karakter).length - 1
}

describe('NOKTALAMA_HAVUZU', () => {
  it('boş değil ve her kuralın açıklaması var', () => {
    expect(NOKTALAMA_HAVUZU.length).toBeGreaterThan(20)
    for (const soru of NOKTALAMA_HAVUZU) {
      expect(NOKTALAMA_ACIKLAMASI[soru.kural]).toBeTruthy()
    }
  })

  it('aynı cümle iki kez geçmiyor', () => {
    const cumleler = NOKTALAMA_HAVUZU.map((s) => s.cumle)
    expect(new Set(cumleler).size).toBe(cumleler.length)
  })

  /*
    Oyunun tek kuralı: cümlede yanlış kullanılmış işaret **bir tane** ve şıkların
    ötekisi aynı cümlede doğru kullanılmış olacak. Elle yazılan bir havuzda bu
    gözden kaçar; kaçtığında da soru cevaplanamaz hâle gelir, o yüzden testte.
  */
  it('her soruda yanlış işaret cümlede tam bir kez geçiyor', () => {
    for (const soru of NOKTALAMA_HAVUZU) {
      const simge = ISARET_SIMGESI[soru.yanlisIsaret]
      expect(sayim(soru.cumle, simge), soru.cumle).toBe(1)
    }
  })

  it('yanlış işaret düzeltmede kalmıyor, çeldirici işaret olduğu gibi duruyor', () => {
    for (const soru of NOKTALAMA_HAVUZU) {
      const yanlisSimge = ISARET_SIMGESI[soru.yanlisIsaret]
      const dogruSimge = ISARET_SIMGESI[soru.dogruIsaret]

      expect(soru.yanlisIsaret, soru.cumle).not.toBe(soru.dogruIsaret)
      expect(soru.cumle, soru.cumle).not.toBe(soru.duzeltme)
      // Yanlış işaret düzeltmede ya kalkmış ya da başkasıyla değişmiş olmalı.
      expect(sayim(soru.duzeltme, yanlisSimge), soru.cumle).toBeLessThan(
        sayim(soru.cumle, yanlisSimge),
      )
      // Çeldirici gerçekten doğru kullanılmış: düzeltme ona dokunmuyor.
      expect(sayim(soru.cumle, dogruSimge), soru.cumle).toBeGreaterThan(0)
      expect(sayim(soru.duzeltme, dogruSimge), soru.cumle).toBe(
        sayim(soru.cumle, dogruSimge),
      )
    }
  })
})

describe('havuzlariSec', () => {
  const tumu: Havuzlar = {
    yazim: [{ dogru: 'yalnız', yanlis: 'yanlız', kural: 'ses', zorluk: 'orta' as const }],
    noktalama: NOKTALAMA_HAVUZU.slice(0, 2),
  }

  it('seçilmeyen türün havuzunu boşaltır', () => {
    expect(havuzlariSec(['yazim'], tumu).noktalama).toEqual([])
    expect(havuzlariSec(['noktalama'], tumu).yazim).toEqual([])
    expect(havuzlariSec(['yazim', 'noktalama'], tumu)).toEqual(tumu)
  })
})

describe('turHazirla — noktalama', () => {
  const noktalama = NOKTALAMA_HAVUZU.slice(0, 6)

  it('şıklar cümledeki iki işaret, doğru cevap yanlış kullanılan işaret', () => {
    for (const soru of turHazirla({ yazim: [], noktalama })) {
      if (soru.tur !== 'noktalama') throw new Error('noktalama havuzundan yazım sorusu çıktı')
      const kaynak = soru.soru as NoktalamaSorusu
      expect(soru.siklar.filter((s) => s.dogruMu)).toHaveLength(1)
      expect(soru.siklar.find((s) => s.dogruMu)?.metin).toBe(
        ISARET_SIMGESI[kaynak.yanlisIsaret],
      )
      expect(soru.siklar.find((s) => !s.dogruMu)?.metin).toBe(
        ISARET_SIMGESI[kaynak.dogruIsaret],
      )
      // İşaretin adı da şıkta duruyor; tek başına bir “;” okunmuyor.
      expect(soru.siklar.every((s) => (s.altYazi ?? '') !== '')).toBe(true)
    }
  })

  it('tek tür seçiliyse yalnızca o tür geliyor', () => {
    const tur = turHazirla({ yazim: [], noktalama })
    expect(tur).toHaveLength(noktalama.length)
    expect(tur.every((s) => s.tur === 'noktalama')).toBe(true)
  })

  it('iki tür de seçiliyse sorular dönüşümlü geliyor', () => {
    const yazim: YazimSorusu[] = Array.from({ length: 20 }, (_, i) => ({
      dogru: `d${i}`,
      yanlis: `y${i}`,
      zorluk: 'orta' as const,
      kural: 'ses' as const,
    }))
    const tur = turHazirla({ yazim, noktalama })
    expect(tur).toHaveLength(yazim.length + noktalama.length)

    // Küçük havuz tükenene kadar iki tür eşit sayıda: düz karıştırma olsaydı
    // noktalama sorusu turun başında hiç görünmeyebilirdi.
    const bas = tur.slice(0, noktalama.length * 2)
    expect(bas.filter((s) => s.tur === 'noktalama')).toHaveLength(noktalama.length)
    expect(bas.filter((s) => s.tur === 'yazim')).toHaveLength(noktalama.length)
  })
})
