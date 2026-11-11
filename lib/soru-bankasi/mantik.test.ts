import { describe, expect, it } from 'vitest'
import { cevapKaydet, kaydiCoz, ozet, testlereBol, zorlukEtiketi } from './mantik'

describe('Soru Bankası mantığı', () => {
  it('soruları on ikişerli testlere böler', () => expect(testlereBol(Array.from({ length: 25 }))).toHaveLength(3))
  it('bozuk kayıtları atar', () => expect(kaydiCoz({ iyi: 'dy-', kotu: 'dx', sayi: 3 })).toEqual({ iyi: 'dy-' }))
  it('ilk cevabı korur, tekrar testi yanlışı düzeltebilir', () => {
    const yanlis = cevapKaydet({}, 'k', 1, 'y')
    expect(cevapKaydet(yanlis, 'k', 1, 'd')).toBe(yanlis)
    expect(cevapKaydet(yanlis, 'k', 1, 'd', true)).toEqual({ k: '-d' })
  })
  it('özeti hesaplar', () => expect(ozet({ k: 'dy-' }, 'k', 4)).toEqual({ cozulen: 2, dogru: 1, yanlis: 1, toplam: 4 }))
  it('çoğunluk zorluğunu test etiketine çevirir', () => {
    expect(zorlukEtiketi([1, 1, 2])).toBe('Kolay')
    expect(zorlukEtiketi([2, 3, 2])).toBe('Orta')
    expect(zorlukEtiketi([3, 3, 1])).toBe('Zor')
  })
})
