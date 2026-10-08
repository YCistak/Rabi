import { describe, expect, it } from 'vitest'
import { HAZIR_SABLONLAR, sablonlariBirlestir, secilebilirSablonlar } from './sablonlar'
import {
  dersleriDenetle,
  hazirSeviyeSablonu,
  seviyeDersleriniKaydet,
  seviyeSablonu,
  varsayilanSeviyeSinifi,
} from './seviye-tespit'
import type { SablonDers } from './types'

const dersIdleri = (dersler: readonly SablonDers[]) => dersler.map((d) => d.id)

describe('hazır seviye tespit şablonları', () => {
  it('9. sınıf eski `okul` şablonu, kimliği değişmedi', () => {
    expect(hazirSeviyeSablonu(9, 'say').id).toBe('okul')
  })

  it('10. sınıf 9 ile aynı, bir de Felsefe', () => {
    const dokuz = hazirSeviyeSablonu(9, 'say')
    const on = hazirSeviyeSablonu(10, 'say')
    expect(on.id).toBe('okul-10')
    expect(dersIdleri(on.dersler).filter((id) => id !== 'felsefe')).toEqual(dersIdleri(dokuz.dersler))
    expect(on.dersler.find((d) => d.id === 'felsefe')).toMatchObject({ soruSayisi: 6, osymTesti: 'ayt-felsefe' })
  })

  it.each([
    [11, 'say', 'ayt-say'],
    [11, 'ea', 'ayt-ea'],
    [12, 'soz', 'ayt-soz'],
    [12, 'dil', 'ydt'],
  ] as const)('%i. sınıf %s alanı → %s ile aynı dersler, tür seviye tespit', (sinif, alan, kaynak) => {
    const sablon = hazirSeviyeSablonu(sinif, alan)
    expect(sablon.tur).toBe('okul')
    expect(sablon.dersler).toEqual(HAZIR_SABLONLAR.find((s) => s.id === kaynak)!.dersler)
  })

  it('9 ve 10 alanı dikkate almıyor', () => {
    expect(hazirSeviyeSablonu(10, 'ea').id).toBe(hazirSeviyeSablonu(10, 'dil').id)
  })

  it('kimlikler tekrarlanmıyor', () => {
    const idler = HAZIR_SABLONLAR.map((s) => s.id)
    expect(new Set(idler).size).toBe(idler.length)
  })

  it('deneme türü satırında seviye tespit tek düğme', () => {
    const satir = secilebilirSablonlar(sablonlariBirlestir([]), 12, null).filter((s) => s.tur === 'okul')
    expect(satir.map((s) => s.id)).toEqual(['okul'])
  })

  it('mezun 12. sınıfın seviye tespitine düşüyor', () => {
    expect(varsayilanSeviyeSinifi(13)).toBe(12)
    expect(varsayilanSeviyeSinifi(9)).toBe(9)
  })
})

describe('Dersleri düzenle', () => {
  const dersler: SablonDers[] = [
    { id: 'matematik', ad: 'Matematik', soruSayisi: 20, osymTesti: 'ayt-mat' },
    { id: 'ders-1', ad: 'Sanat Tarihi', soruSayisi: 5 },
  ]

  it('düzenlenen şablon o sınıfta hazır olanın önüne geçiyor, ötekilere dokunmuyor', () => {
    const kayitli = seviyeDersleriniKaydet([], 10, 'say', dersler, new Set(), 'y1')
    const sablonlar = sablonlariBirlestir(kayitli)
    expect(seviyeSablonu(sablonlar, 10, 'say').id).toBe('y1')
    expect(seviyeSablonu(sablonlar, 9, 'say').id).toBe('okul')
    expect(seviyeSablonu(sablonlar, 11, 'say').id).toBe('okul-11-say')
    expect(sablonlar.find((s) => s.id === 'okul-10')?.dersler.length).toBe(9)
  })

  it('11-12de alan ayrı tutuluyor', () => {
    const sablonlar = sablonlariBirlestir(seviyeDersleriniKaydet([], 11, 'ea', dersler, new Set(), 'y1'))
    expect(seviyeSablonu(sablonlar, 11, 'ea').id).toBe('y1')
    expect(seviyeSablonu(sablonlar, 11, 'say').id).toBe('okul-11-say')
  })

  it('kullanılmamış eski düzenleme silinir, kullanılmış olan eskiye ayrılıp durur', () => {
    const ilk = seviyeDersleriniKaydet([], 9, 'say', dersler, new Set(), 'y1')
    expect(seviyeDersleriniKaydet(ilk, 9, 'say', dersler.slice(0, 1), new Set(), 'y2').map((s) => s.id)).toEqual(['y2'])

    const ikinci = seviyeDersleriniKaydet(ilk, 9, 'say', dersler.slice(0, 1), new Set(['y1']), 'y2')
    expect(ikinci.map((s) => [s.id, !!s.seviye?.eski])).toEqual([['y1', true], ['y2', false]])
    expect(seviyeSablonu(sablonlariBirlestir(ikinci), 9, 'say').id).toBe('y2')
  })

  it('hazırla aynı derslere dönmek düzenlemeyi kaldırır', () => {
    const ilk = seviyeDersleriniKaydet([], 10, 'say', dersler, new Set(['y1']), 'y1')
    const geri = seviyeDersleriniKaydet(ilk, 10, 'say', hazirSeviyeSablonu(10, 'say').dersler, new Set(['y1']), 'y2')
    expect(seviyeSablonu(sablonlariBirlestir(geri), 10, 'say').id).toBe('okul-10')
  })

  it('denetim boş listeyi, adsız dersi, tekrarı ve geçersiz sayıyı yakalıyor', () => {
    expect(dersleriDenetle(dersler)).toBeNull()
    expect(dersleriDenetle([])).not.toBeNull()
    expect(dersleriDenetle([{ id: 'a', ad: '  ', soruSayisi: 5 }])).not.toBeNull()
    expect(dersleriDenetle([...dersler, { id: 'b', ad: 'matematik', soruSayisi: 5 }])).toContain('iki kez')
    expect(dersleriDenetle([{ id: 'a', ad: 'Fizik', soruSayisi: 0 }])).not.toBeNull()
    expect(dersleriDenetle([{ id: 'a', ad: 'Fizik', soruSayisi: 201 }])).not.toBeNull()
  })
})
