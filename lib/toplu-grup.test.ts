import { describe, expect, it } from 'vitest'
import {
  dersinGrubu,
  gecerliToplu,
  sablonGruplari,
  topluDersIdleri,
  topluTestDagilimi,
} from './toplu-grup'
import { HAZIR_SABLONLAR } from './sablonlar'
import type { Sablon } from './types'

const sablon = (id: string) => HAZIR_SABLONLAR.find((s) => s.id === id)!

describe('dersinGrubu', () => {
  it('Fen ve Sosyal üyeliği ders kimliğinden', () => {
    expect(dersinGrubu('fizik')).toBe('fen')
    expect(dersinGrubu('tarih2')).toBe('sosyal')
    expect(dersinGrubu('din')).toBe('sosyal')
    expect(dersinGrubu('edebiyat')).toBeNull()
    expect(dersinGrubu('turkce')).toBeNull()
    expect(dersinGrubu('matematik')).toBeNull()
  })
})

describe('sablonGruplari', () => {
  it('TYT: Sosyal 20, Fen 20', () => {
    expect(sablonGruplari(sablon('tyt'))).toEqual([
      { grup: 'sosyal', dersIdleri: ['tarih', 'cografya', 'felsefe', 'din'], soruSayisi: 20 },
      { grup: 'fen', dersIdleri: ['fizik', 'kimya', 'biyoloji'], soruSayisi: 20 },
    ])
  })

  it('AYT sayısalda yalnız Fen, EA ve sözelde yalnız Sosyal', () => {
    expect(sablonGruplari(sablon('ayt-say')).map((g) => g.grup)).toEqual(['fen'])
    expect(sablonGruplari(sablon('ayt-ea'))).toEqual([
      { grup: 'sosyal', dersIdleri: ['tarih1', 'cografya1'], soruSayisi: 16 },
    ])
    expect(sablonGruplari(sablon('ayt-soz'))[0].soruSayisi).toBe(56)
  })

  it('tek üyeli grup sayılmaz, YDT’de grup yok', () => {
    const tekFen: Sablon = {
      ...sablon('tyt'),
      dersler: [{ id: 'fizik', ad: 'Fizik', soruSayisi: 7 }],
    }
    expect(sablonGruplari(tekFen)).toEqual([])
    expect(sablonGruplari(sablon('ydt'))).toEqual([])
  })
})

describe('gecerliToplu', () => {
  const tyt = sablon('tyt')
  it('bozuk, şablonda olmayan ve tekrarlanan satırı atar', () => {
    expect(
      gecerliToplu(
        {
          toplu: [
            { grup: 'sosyal', dogru: 15, yanlis: 4 },
            { grup: 'sosyal', dogru: 1, yanlis: 1 },
            { grup: 'fen', dogru: 18, yanlis: 5 },
          ],
        },
        tyt,
      ),
    ).toEqual([{ grup: 'sosyal', dogru: 15, yanlis: 4 }])
    expect(gecerliToplu({ toplu: [{ grup: 'fen', dogru: 2.5, yanlis: 0 }] }, tyt)).toEqual([])
    expect(gecerliToplu({ toplu: [{ grup: 'sosyal', dogru: 5, yanlis: 0 }] }, sablon('ayt-say'))).toEqual([])
    expect(gecerliToplu({}, tyt)).toEqual([])
  })

  it('toplu grubun derslerini verir', () => {
    expect([...topluDersIdleri({ toplu: [{ grup: 'fen', dogru: 10, yanlis: 0 }] }, tyt)]).toEqual([
      'fizik',
      'kimya',
      'biyoloji',
    ])
  })
})

describe('topluTestDagilimi', () => {
  it('TYT’de bütün net tek teste', () => {
    expect(topluTestDagilimi(16, 'sosyal', sablon('tyt'))).toEqual({ 'tyt-sosyal': 16 })
  })

  it('AYT Fen’de soru sayısına orantılı', () => {
    const d = topluTestDagilimi(20, 'fen', sablon('ayt-say'))
    expect(d['ayt-fizik']).toBeCloseTo(7)
    expect(d['ayt-kimya']).toBeCloseTo(6.5)
    expect(d['ayt-biyoloji']).toBeCloseTo(6.5)
  })
})
