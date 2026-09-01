import { describe, expect, it } from 'vitest'
import {
  KISAYOL_SAYISI,
  SON_KULLANILAN_SINIRI,
  kisayollar,
  kullanildi,
  sabitliKisayollar,
} from './son-kullanilan'

const TUMU = [
  { id: 'a' },
  { id: 'b' },
  { id: 'c' },
  { id: 'd' },
  { id: 'e' },
  { id: 'f' },
]

describe('kullanildi', () => {
  it('yeni kimliği başa alır', () => {
    expect(kullanildi(['b', 'c'], 'a')).toEqual(['a', 'b', 'c'])
  })

  it('zaten listedeyse kopya bırakmadan öne taşır', () => {
    expect(kullanildi(['a', 'b', 'c'], 'c')).toEqual(['c', 'a', 'b'])
  })

  it('aynı kimliği üst üste açmak listeyi büyütmez', () => {
    let liste: string[] = []
    for (let i = 0; i < 5; i++) liste = kullanildi(liste, 'a')
    expect(liste).toEqual(['a'])
  })

  it('sınırı aşan eski kayıtlar düşer', () => {
    let liste: string[] = []
    for (let i = 0; i < SON_KULLANILAN_SINIRI + 3; i++) liste = kullanildi(liste, `o${i}`)
    expect(liste).toHaveLength(SON_KULLANILAN_SINIRI)
    // En son açılan başta, en eskiler listede yok.
    expect(liste[0]).toBe(`o${SON_KULLANILAN_SINIRI + 2}`)
    expect(liste).not.toContain('o0')
  })

  it('verilen listeyi değiştirmez', () => {
    const liste = ['a', 'b']
    kullanildi(liste, 'c')
    expect(liste).toEqual(['a', 'b'])
  })
})

describe('kisayollar', () => {
  it('geçmiş yoksa listenin başından doldurur', () => {
    expect(kisayollar(TUMU, []).map((o) => o.id)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('son kullanılanları kendi sırasıyla öne alır', () => {
    expect(kisayollar(TUMU, ['f', 'e']).map((o) => o.id)).toEqual(['f', 'e', 'a', 'b'])
  })

  it('geçmiş dördü doldurunca varsayılana hiç bakmaz', () => {
    expect(kisayollar(TUMU, ['f', 'e', 'd', 'c']).map((o) => o.id)).toEqual([
      'f',
      'e',
      'd',
      'c',
    ])
  })

  it('varsayılandan gelenler geçmiştekileri tekrarlamaz', () => {
    const secilen = kisayollar(TUMU, ['b']).map((o) => o.id)
    expect(secilen).toEqual(['b', 'a', 'c', 'd'])
    expect(new Set(secilen).size).toBe(secilen.length)
  })

  it('kaldırılmış oyunun kaydını sessizce eler', () => {
    expect(kisayollar(TUMU, ['yok-artik', 'e']).map((o) => o.id)).toEqual([
      'e',
      'a',
      'b',
      'c',
    ])
  })

  it('geçmişteki kopya kayıt yeri iki kez işgal etmez', () => {
    expect(kisayollar(TUMU, ['e', 'e']).map((o) => o.id)).toEqual(['e', 'a', 'b', 'c'])
  })

  it('her zaman istenen sayıda kutucuk döner', () => {
    expect(kisayollar(TUMU, [])).toHaveLength(KISAYOL_SAYISI)
    expect(kisayollar(TUMU, ['f', 'e', 'd'])).toHaveLength(KISAYOL_SAYISI)
  })

  it('seçenek dörtten azsa var olan kadarını döner', () => {
    expect(kisayollar([{ id: 'a' }, { id: 'b' }], ['b']).map((o) => o.id)).toEqual(['b', 'a'])
  })
})

describe('sabitliKisayollar', () => {
  it('sabitlenenler kendi sırasıyla başta durur', () => {
    expect(sabitliKisayollar(TUMU, ['e', 'c'], ['f']).map((o) => o.id)).toEqual([
      'e',
      'c',
      'f',
      'a',
    ])
  })

  // Sabitlemek listeyi kapatmıyor: kalan yerler son kullanılanlarla doluyor.
  it('dördü doldurmayan sabit, geri kalanı geçmişe bırakır', () => {
    expect(sabitliKisayollar(TUMU, ['d'], ['f', 'e']).map((o) => o.id)).toEqual([
      'd',
      'f',
      'e',
      'a',
    ])
  })

  it('hiç sabit yoksa eski davranışın aynısı', () => {
    expect(sabitliKisayollar(TUMU, [], ['f', 'e'])).toEqual(kisayollar(TUMU, ['f', 'e']))
  })

  it('geçmişte de duran sabit iki yer işgal etmez', () => {
    const secilen = sabitliKisayollar(TUMU, ['f'], ['f', 'e']).map((o) => o.id)
    expect(secilen).toEqual(['f', 'e', 'a', 'b'])
    expect(new Set(secilen).size).toBe(secilen.length)
  })

  it('kaldırılmış bir kimlik sabitlenmiş olsa da elenir', () => {
    expect(sabitliKisayollar(TUMU, ['yok-artik', 'b'], []).map((o) => o.id)).toEqual([
      'b',
      'a',
      'c',
      'd',
    ])
  })

  it('dört sabit varken geçmişe hiç bakmaz', () => {
    expect(sabitliKisayollar(TUMU, ['a', 'b', 'c', 'd'], ['f']).map((o) => o.id)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ])
  })
})
