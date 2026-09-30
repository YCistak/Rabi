import { describe, expect, it } from 'vitest'
import { ctcCoz, kutulariBul, okumalariSirala } from './ocr-cozum'

describe('OCR olasılık çözümü', () => {
  it('CTC tekrarlarını birleştirir, boşluktan sonraki aynı karakteri korur', () => {
    const veri = Float32Array.from([0,1,0, 0,1,0, 1,0,0, 0,1,0, 0,0,1])
    expect(ctcCoz(veri, 3, ['', '1', 'D'])).toEqual({ metin: '11D', guven: 1 })
  })
  it('ilk sayı bloğunu ders adına taşımaz', () => {
    const karakterler = ['', ...'Geometri: 7D2Y1B']
    const metin = 'Geometri: 7D 2Y 1B'
    const veri = new Float32Array(metin.length*2*karakterler.length)
    for (const [i,c] of [...metin].entries()) {
      veri[i*2*karakterler.length+karakterler.indexOf(c)] = 1
      veri[(i*2+1)*karakterler.length] = 1
    }
    expect(ctcCoz(veri, karakterler.length, karakterler).metin).toBe(metin)
  })
  it('aynı hizadaki ayrı ad ve sayı kutularını yatay sırayla birleştirir', () => {
    expect(okumalariSirala([
      { sol: 100, sag: 160, ust: 10, alt: 30, metin: '38D 2Y' },
      { sol: 10, sag: 80, ust: 12, alt: 32, metin: 'Matematik' },
      { sol: 10, sag: 100, ust: 70, alt: 90, metin: 'Fizik 6D 1Y' },
    ])).toBe('Matematik 38D 2Y\nFizik 6D 1Y')
  })
  it('tespit haritasındaki küçük gürültüyü eler', () => {
    const veri = new Float32Array(32*32)
    veri[0] = 1
    for (let y=10;y<15;y++) for(let x=8;x<24;x++) veri[y*32+x] = 0.9
    expect(kutulariBul(veri,32,32)).toHaveLength(1)
    expect(kutulariBul(new Float32Array(32*32),32,32)).toEqual([])
  })
})
