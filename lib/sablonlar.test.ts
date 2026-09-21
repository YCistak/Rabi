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

  it('alanını seçmemiş 12. sınıf AYT görmüyor', () => {
    expect(idler(12, null)).toEqual(['okul', 'tyt'])
  })

  it('kullanıcının kendi şablonu süzülmüyor', () => {
    const ozel: Sablon = { id: 'ozel', ad: 'Özel', tur: 'ayt', yanlisKatsayi: 4, hazir: false, dersler: [] }
    expect(secilebilirSablonlar([...HAZIR_SABLONLAR, ozel], 9, null).map((s) => s.id)).toContain('ozel')
  })
})
