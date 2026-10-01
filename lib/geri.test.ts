import { afterEach, describe, expect, it } from 'vitest'
import { katmanKaydet, katmanVarMi, tumKatmanlariKapat, ustKatmaniKapat } from './geri'

const temizlik: Array<() => void> = []
afterEach(() => {
  while (temizlik.length) temizlik.pop()!()
})

describe('tumKatmanlariKapat', () => {
  it('katman yokken 0 döner ve bir şey yapmaz', () => {
    expect(tumKatmanlariKapat()).toBe(0)
  })

  it('katmanları en üsttekinden başlayarak kapatır', () => {
    const sira: string[] = []
    temizlik.push(katmanKaydet(() => sira.push('ders')))
    temizlik.push(katmanKaydet(() => sira.push('bolum')))
    temizlik.push(katmanKaydet(() => sira.push('oyun')))
    expect(tumKatmanlariKapat()).toBe(3)
    expect(sira).toEqual(['oyun', 'bolum', 'ders'])
    expect(katmanVarMi()).toBe(false)
  })

  it('geri tuşuyla aynı kapatma fonksiyonunu çağırır', () => {
    let kapandi = 0
    temizlik.push(katmanKaydet(() => kapandi++))
    expect(ustKatmaniKapat()).toBe(true)
    expect(kapandi).toBe(1)
    expect(tumKatmanlariKapat()).toBe(0)
  })
})
