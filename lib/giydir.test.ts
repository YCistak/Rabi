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
  it('dört eşya, her biri kendi yuvasında ve ücretsiz', () => {
    expect(ESYALAR.map((e) => [e.id, e.yuva])).toEqual([
      ['kep', 'kafa'],
      ['gozluk', 'yuz'],
      ['gunes', 'yuz'],
      ['bot', 'ayak'],
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
    const g = giy(giy({}, 'kep'), 'bot')
    expect(g).toEqual({ kafa: 'kep', ayak: 'bot' })
    expect(giyiliMi(g, 'kep')).toBe(true)
    expect(giyiliMi(g, 'gozluk')).toBe(false)
  })

  it('cikar yuvayı boşaltır, girdiyi değiştirmez', () => {
    const g: Giyilenler = { kafa: 'kep', yuz: 'gozluk' }
    expect(cikar(g, 'kafa')).toEqual({ yuz: 'gozluk' })
    expect(g).toEqual({ kafa: 'kep', yuz: 'gozluk' })
    // Boş yuvayı çıkarmak aynı nesneyi döndürür (gereksiz yeniden çizim yok).
    expect(cikar(g, 'ayak')).toBe(g)
  })

  it('aynı eşyaya ikinci dokunuş çıkarır', () => {
    const bir = dokun({}, 'gozluk')
    expect(bir).toEqual({ yuz: 'gozluk' })
    expect(dokun(bir, 'gozluk')).toEqual({})
  })

  it('güneş gözlüğü gözlüğün yerini alır (aynı yuva)', () => {
    const g = giy(giy({}, 'gozluk'), 'gunes')
    expect(g).toEqual({ yuz: 'gunes' })
    expect(giyiliMi(g, 'gozluk')).toBe(false)
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

  it('sıra alttan üste: rabi → bot → gözlük → kep, giyme sırasından bağımsız', () => {
    const g = giy(giy(giy({}, 'kep'), 'gozluk'), 'bot')
    expect(katmanlar(g)).toEqual([
      '/giydir/rabi-kep.png',
      '/giydir/bot.png',
      '/giydir/gozluk.png',
      '/giydir/kep.png',
    ])
  })

  it('kep takılıyken alttaki Rabi sarkık kulaklı olan, çıkınca dik kulaklıya döner', () => {
    const g = giy(giy({}, 'kep'), 'gunes')
    expect(katmanlar(g)).toEqual(['/giydir/rabi-kep.png', '/giydir/gunes.png', '/giydir/kep.png'])
    expect(katmanlar(cikar(g, 'kafa'))).toEqual([CIPLAK_RABI, '/giydir/gunes.png'])
  })

  it('yanlış yuvadaki eşyayı çizmez', () => {
    // Yanlış yuvadaki kepin tabanı da gelmez: kep yoksa kulaklar dik.
    expect(katmanlar({ ayak: 'kep' } as Giyilenler)).toEqual([CIPLAK_RABI])
  })
})

describe('giyilenleriCoz', () => {
  it('geçerli kaydı olduğu gibi okur', () => {
    expect(giyilenleriCoz({ kafa: 'kep', ayak: 'bot' })).toEqual({ kafa: 'kep', ayak: 'bot' })
  })

  it('bozuk kayıtta boş döner', () => {
    for (const ham of [null, undefined, 'kep', 42, [], ['kep'], true]) {
      expect(giyilenleriCoz(ham)).toEqual({})
    }
  })

  it('bilinmeyen eşyayı, yanlış yuvayı ve bilinmeyen alanı düşürür', () => {
    expect(
      giyilenleriCoz({ kafa: 'pelerin', yuz: 'bot', ayak: 'bot', kuyruk: 'kep', gozluk: 1 }),
    ).toEqual({ ayak: 'bot' })
    expect(giyilenleriCoz({ kafa: 7, yuz: { id: 'gozluk' } })).toEqual({})
  })
})
