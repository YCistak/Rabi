import { describe, expect, it } from 'vitest'
import { MEZUN } from './hesap'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import type { PuanTuru, Sablon } from './types'

describe('secilebilirSablonlar', () => {
  const idler = (sinif: number, alan: PuanTuru | null) =>
    secilebilirSablonlar(HAZIR_SABLONLAR, sinif, alan).map((s) => s.id)

  it('9 ve 10. sınıf alanı ne olursa olsun yalnızca seviye tespit ve TYT görüyor', () => {
    expect(idler(9, 'say')).toEqual(['okul', 'tyt'])
    expect(idler(10, 'soz')).toEqual(['okul', 'tyt'])
  })

  it('11, 12 ve mezun yalnızca kendi alanının sınavını görüyor', () => {
    expect(idler(11, 'say')).toEqual(['okul', 'tyt', 'ayt-say'])
    expect(idler(12, 'ea')).toEqual(['okul', 'tyt', 'ayt-ea'])
    expect(idler(12, 'soz')).toEqual(['okul', 'tyt', 'ayt-soz'])
    expect(idler(MEZUN, 'dil')).toEqual(['okul', 'tyt', 'ydt'])
  })

  it('alanında karar vermemiş öğrenci, sınıfı ne olursa olsun tüm hazır şablonları görüyor', () => {
    const tumu = HAZIR_SABLONLAR.map((s) => s.id)
    expect(tumu).toEqual(expect.arrayContaining(['okul', 'tyt', 'ayt-say', 'ayt-ea', 'ayt-soz', 'ydt']))
    expect(idler(11, null)).toEqual(tumu)
    expect(idler(12, null)).toEqual(tumu)
    expect(idler(MEZUN, null)).toEqual(tumu)
    expect(idler(9, null)).toEqual(tumu)
    expect(idler(10, null)).toEqual(tumu)
  })

  it('kullanıcının kendi şablonu süzülmüyor', () => {
    const ozel: Sablon = { id: 'ozel', ad: 'Özel', tur: 'ayt', yanlisKatsayi: 4, hazir: false, dersler: [] }
    expect(secilebilirSablonlar([...HAZIR_SABLONLAR, ozel], 9, null).map((s) => s.id)).toContain('ozel')
  })
})
