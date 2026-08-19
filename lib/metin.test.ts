import { describe, expect, it } from 'vitest'
import { vurgulariAyir } from './metin'
import { OYUNLAR } from './oyunlar/tanim'

describe('vurgulariAyir', () => {
  it('yıldızsız metni tek parça bırakır', () => {
    expect(vurgulariAyir('düz metin')).toEqual([{ tur: 'duz', metin: 'düz metin' }])
  })

  it('kalın ve eğik bölümleri ayırır', () => {
    expect(vurgulariAyir('bir **kalın** ve *eğik* söz')).toEqual([
      { tur: 'duz', metin: 'bir ' },
      { tur: 'kalin', metin: 'kalın' },
      { tur: 'duz', metin: ' ve ' },
      { tur: 'egik', metin: 'eğik' },
      { tur: 'duz', metin: ' söz' },
    ])
  })

  it('metnin başındaki ve sonundaki vurguyu da alır', () => {
    expect(vurgulariAyir('**baş** orta **son**')).toEqual([
      { tur: 'kalin', metin: 'baş' },
      { tur: 'duz', metin: ' orta ' },
      { tur: 'kalin', metin: 'son' },
    ])
  })

  /** Parçalar birleşince metin yıldızsız hâline dönmeli — hiçbir şey kaybolmuyor. */
  it('oyun tanıtımlarının tamamında metin korunuyor', () => {
    for (const oyun of OYUNLAR) {
      for (const madde of oyun.nasilOynanir) {
        const birlesik = vurgulariAyir(madde)
          .map((p) => p.metin)
          .join('')
        expect(birlesik, madde).toBe(madde.replaceAll('*', ''))
      }
    }
  })

  /** Ekranda yıldız kalmamalı: asıl düzeltilen hata buydu. */
  it('hiçbir parçada yıldız kalmıyor', () => {
    for (const oyun of OYUNLAR) {
      for (const madde of oyun.nasilOynanir) {
        for (const parca of vurgulariAyir(madde)) expect(parca.metin).not.toContain('*')
      }
    }
  })
})
