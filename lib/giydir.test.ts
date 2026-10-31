import { describe, expect, it } from 'vitest'
import {
  CIPLAK_RABI,
  ESYALAR,
  cikar,
  dokun,
  giy,
  giyiliMi,
  giyilenleriCoz,
  katmanlar,
  type Giyilenler,
} from './giydir'

describe('katalog', () => {
  it('sekiz eşya, baştan aşağı sıralı, her biri kendi yuvasında ve ücretsiz', () => {
    expect(ESYALAR.map((e) => [e.id, e.yuva])).toEqual([
      ['kep', 'kafa'],
      ['bere', 'kafa'],
      ['tac', 'kafa'],
      ['kulaklik', 'kafa'],
      ['kalem', 'kulak'],
      ['gunes', 'yuz'],
      ['papyon', 'boyun'],
      ['atki', 'boyun'],
    ])
    expect(ESYALAR.every((e) => e.fiyat === 0)).toBe(true)
  })

  it('görsel ve ikon yolları kimlikten türüyor', () => {
    for (const e of ESYALAR) {
      expect(e.gorsel).toBe(`/giydir/${e.id}.png`)
      expect(e.ikon).toBe(`/giydir/${e.id}-ikon.png`)
    }
  })
})

describe('giy / cikar / dokun', () => {
  it('giy eşyayı yuvasına koyar, farklı yuvalar birlikte giyilir', () => {
    const g = giy(giy({}, 'kep'), 'gunes')
    expect(g).toEqual({ kafa: 'kep', yuz: 'gunes' })
    expect(giyiliMi(g, 'kep')).toBe(true)
    expect(giyiliMi(cikar(g, 'yuz'), 'gunes')).toBe(false)
  })

  it('cikar yuvayı boşaltır, girdiyi değiştirmez', () => {
    const g: Giyilenler = { kafa: 'kep', yuz: 'gunes' }
    expect(cikar(g, 'kafa')).toEqual({ yuz: 'gunes' })
    expect(g).toEqual({ kafa: 'kep', yuz: 'gunes' })
    // Boş yuvayı çıkarmak aynı nesneyi döndürür (gereksiz yeniden çizim yok).
    expect(cikar(g, 'ayak')).toBe(g)
  })

  it('aynı yuvadaki ikinci eşya ilkinin yerini alır', () => {
    expect(giy(giy({}, 'kep'), 'tac')).toEqual({ kafa: 'tac' })
    expect(giy(giy({}, 'papyon'), 'atki')).toEqual({ boyun: 'atki' })
  })

  it('aynı eşyaya ikinci dokunuş çıkarır', () => {
    const bir = dokun({}, 'gunes')
    expect(bir).toEqual({ yuz: 'gunes' })
    expect(dokun(bir, 'gunes')).toEqual({})
  })

  it('bilinmeyen kimlik bir şey değiştirmez', () => {
    const g: Giyilenler = { kafa: 'kep' }
    expect(giy(g, 'pelerin' as never)).toBe(g)
    expect(dokun(g, 'pelerin' as never)).toBe(g)
  })
})

describe('katmanlar', () => {
  it('çıplak Rabi her zaman en altta', () => {
    expect(katmanlar({})).toEqual([CIPLAK_RABI])
  })

  it('sıra rabi → güneş gözlüğü → kep; kep takılıyken alttaki Rabi kepli olan, çıkınca çıplak', () => {
    const g = giy(giy({}, 'gunes'), 'kep')
    expect(katmanlar(g)).toEqual(['/giydir/rabi-kep.png', '/giydir/gunes.png', '/giydir/kep.png'])
    expect(katmanlar(cikar(g, 'kafa'))).toEqual([CIPLAK_RABI, '/giydir/gunes.png'])
  })

  it('sıra alttan üste: boyun → yüz → kulak → kafa', () => {
    const g = giy(giy(giy(giy({}, 'bere'), 'kalem'), 'gunes'), 'atki')
    expect(katmanlar(g)).toEqual([
      CIPLAK_RABI,
      '/giydir/atki.png',
      '/giydir/gunes.png',
      '/giydir/kalem.png',
      '/giydir/bere.png',
    ])
  })

  it("kepteyken kalem bükük kulaklı Rabi'ye göre çizilmiş katmanına geçer", () => {
    expect(katmanlar({ kafa: 'kep', kulak: 'kalem' })).toEqual([
      '/giydir/rabi-kep.png',
      '/giydir/kalem-kep.png',
      '/giydir/kep.png',
    ])
    expect(katmanlar({ kafa: 'tac', kulak: 'kalem' })).toEqual([CIPLAK_RABI, '/giydir/kalem.png', '/giydir/tac.png'])
  })

  it('yanlış yuvadaki eşyayı çizmez', () => {
    // Yanlış yuvadaki kepin tabanı da gelmez: kep yoksa kulaklar dik.
    expect(katmanlar({ ayak: 'kep' } as Giyilenler)).toEqual([CIPLAK_RABI])
  })
})

describe('giyilenleriCoz', () => {
  it('geçerli kaydı olduğu gibi okur', () => {
    expect(giyilenleriCoz({ kafa: 'kep', yuz: 'gunes' })).toEqual({ kafa: 'kep', yuz: 'gunes' })
  })

  it('bozuk kayıtta boş döner', () => {
    for (const ham of [null, undefined, 'kep', 42, [], ['kep'], true]) {
      expect(giyilenleriCoz(ham)).toEqual({})
    }
  })

  it('bilinmeyen eşyayı, yanlış yuvayı ve bilinmeyen alanı düşürür', () => {
    expect(
      giyilenleriCoz({ kafa: 'pelerin', yuz: 'kep', ayak: 'gunes', kuyruk: 'kep', gunes: 1 }),
    ).toEqual({})
    expect(giyilenleriCoz({ kafa: 7, yuz: { id: 'gunes' } })).toEqual({})
  })

  it('kaldırılan gözlük ve botun eski kaydı düşer, kalan seçim korunur', () => {
    expect(giyilenleriCoz({ kafa: 'kep', yuz: 'gozluk', ayak: 'bot' })).toEqual({ kafa: 'kep' })
  })
})
