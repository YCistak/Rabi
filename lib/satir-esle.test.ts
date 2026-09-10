import { describe, expect, it } from 'vitest'
import { adlariEsle, dersAdi, type MetinSatiri } from './satir-esle'
import type { SatirOkuma } from './kagit-oku'

function sayi(metin: string, ustY: number, altY: number): SatirOkuma {
  return { metin, guven: 0.9, ustY, altY }
}

function ad(metin: string, ustY: number, altY: number): MetinSatiri {
  return { metin, ustY, altY }
}

describe('dersAdi', () => {
  it('sayıları atıp adı bırakıyor', () => {
    expect(dersAdi('Türk Dili ve Edebiyat: 36D')).toBe('Türk Dili ve Edebiyat')
    expect(dersAdi('Temel Matematik! 15D 20B')).toBe('Temel Matematik')
  })

  it('addaki rakamı adın parçası sayıyor', () => {
    // İlk rakamda kesilseydi Coğ1 ile Coğ2 ayırt edilemezdi.
    expect(dersAdi('Coğ1: 2D 1B')).toBe('Coğ1')
    expect(dersAdi('Tar2: 5D 5Y')).toBe('Tar2')
  })

  it('sayı yoksa satırın tamamı ad', () => {
    expect(dersAdi('Din Kültürü:')).toBe('Din Kültürü')
    expect(dersAdi('Edebiyat: Full')).toBe('Edebiyat: Full')
  })
})

describe('adlariEsle', () => {
  it('adı sıraya değil hizaya göre veriyor', () => {
    // Kâğıtta sıra şablonun sırası değil: sıraya bakan eşleme burada
    // Coğrafya'nın sayısını Matematik'e yazardı.
    const sayilar = [sayi('12D 6Y', 100, 140), sayi('2D 1B', 200, 240)]
    const adlar = [ad('Coğrafya: 12D 6Y', 98, 142), ad('Matematik: 2D 1B', 198, 242)]
    expect(adlariEsle(sayilar, adlar)).toEqual(['Coğrafya', 'Matematik'])
  })

  it('fazladan metin satırı sırayı kaydırmıyor', () => {
    // "Edebiyat: Full" sayı taşımadığı için sayı satırı üretmiyor; sıraya
    // bakan eşlemede bu satır listeyi bir kaydırıyordu.
    const sayilar = [sayi('5D 1B', 200, 240)]
    const adlar = [ad('Edebiyat: Full', 100, 140), ad('Coğ1: 5D 1B', 198, 242)]
    expect(adlariEsle(sayilar, adlar)).toEqual(['Coğ1'])
  })

  it('hizasında ad yoksa boş bırakıyor', () => {
    // Alta taşan sayı ("… Edebiyat: 36D" ⏎ "1B") kendi başına bir ad
    // taşımıyor; uydurmak yanlış dersi doldurmak olurdu.
    const sayilar = [sayi('36D', 100, 140), sayi('1B', 160, 200)]
    const adlar = [ad('Türk Dili ve Edebiyat: 36D', 98, 142)]
    expect(adlariEsle(sayilar, adlar)).toEqual(['Türk Dili ve Edebiyat', ''])
  })

  it('bir adı iki sayı satırına birden vermiyor', () => {
    const sayilar = [sayi('36D', 100, 140), sayi('1B', 130, 170)]
    const adlar = [ad('Türk Dili: 36D', 98, 142)]
    expect(adlariEsle(sayilar, adlar)).toEqual(['Türk Dili', ''])
  })

  it('yarıdan az örtüşen satırı eşleştirmiyor', () => {
    const sayilar = [sayi('5D', 100, 200)]
    const adlar = [ad('Coğrafya: 5D', 180, 280)]
    expect(adlariEsle(sayilar, adlar)).toEqual([''])
  })
})
