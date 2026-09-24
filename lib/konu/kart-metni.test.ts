import { describe, expect, it } from 'vitest'
import { gorunenMetin, metniAyristir, satiriParcala } from './kart-metni'

describe('kart metni', () => {
  it('düz metin tek paragraf', () => {
    expect(metniAyristir('Bir cümle.')).toEqual([
      { tur: 'paragraf', parcalar: [{ yazi: 'Bir cümle.', vurgu: false }] },
    ])
  })

  it('art arda maddeler tek liste, araya giren paragraf listeyi böler', () => {
    const bloklar = metniAyristir('Giriş.\n- bir\n- iki\nAra.\n- üç\n- dört')
    expect(bloklar.map((b) => b.tur)).toEqual(['paragraf', 'liste', 'paragraf', 'liste'])
    const ilk = bloklar[1]
    expect(ilk.tur === 'liste' && ilk.maddeler.length).toBe(2)
  })

  it('vurgu ayrılıyor, kapanmayan işaret düz kalıyor', () => {
    expect(satiriParcala('**sin:** 1/2')).toEqual([
      { yazi: 'sin:', vurgu: true },
      { yazi: ' 1/2', vurgu: false },
    ])
    expect(satiriParcala('a ** b')).toEqual([{ yazi: 'a ** b', vurgu: false }])
  })

  it('boş satır blok üretmiyor', () => {
    expect(metniAyristir('a\n\n\nb')).toHaveLength(2)
  })

  it('görünen metin işaretleri düşürüyor', () => {
    expect(gorunenMetin('Giriş.\n- **a:** 1\n- **b:** 2')).toBe('Giriş. a: 1 b: 2')
  })
})
