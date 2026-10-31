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
  tabanYolu,
  tumDurusGorselleri,
  tumTabanlar,
  type Giyilenler,
} from './giydir'

describe('katalog', () => {
  it('sekiz eşya, baştan aşağı sıralı, her biri kendi yuvasında ve ücretsiz', () => {
    expect(ESYALAR.map((e) => [e.id, e.yuva])).toEqual([
      ['kep', 'kafa'],
      ['bere', 'kafa'],
      ['tac', 'kafa'],
      ['kulaklik', 'kafa'],
      ['gunes', 'yuz'],
      ['papyon', 'boyun'],
      ['atki', 'boyun'],
      ['sigma', 'boyun'],
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

  it('sıra alttan üste: boyun → yüz → kafa; berede kulaklar gizli taban', () => {
    const g = giy(giy(giy({}, 'bere'), 'gunes'), 'atki')
    expect(katmanlar(g)).toEqual(['/giydir/rabi-bere.png', '/giydir/atki.png', '/giydir/gunes.png', '/giydir/bere.png'])
    expect(katmanlar({ kafa: 'tac' })).toEqual(['/giydir/rabi-tac.png', '/giydir/tac.png'])
    expect(katmanlar({ kafa: 'kulaklik' })).toEqual([CIPLAK_RABI, '/giydir/kulaklik.png'])
  })

  it('Sigma tabanı yüzü ve duruşu değiştirir; öbür eşyalar Sigma duruşundaki katmanına geçer', () => {
    expect(katmanlar({ boyun: 'sigma' })).toEqual(['/giydir/rabi-sigma.png', '/giydir/sigma.png'])
    expect(katmanlar({ boyun: 'sigma', kafa: 'kep', yuz: 'gunes' })).toEqual([
      '/giydir/rabi-sigma-kep.png',
      '/giydir/sigma.png',
      '/giydir/gunes-sigma.png',
      '/giydir/kep-sigma.png',
    ])
    expect(katmanlar({ boyun: 'sigma', kafa: 'bere' })).toEqual([
      '/giydir/rabi-sigma-bere.png',
      '/giydir/sigma.png',
      '/giydir/bere-sigma.png',
    ])
    // Sigma çıkınca katmanlar düz duruşa döner
    expect(katmanlar({ kafa: 'bere' })).toEqual(['/giydir/rabi-bere.png', '/giydir/bere.png'])
  })

  it('Sigma duruş katmanları: boyun dışındaki her eşya için bir tane', () => {
    expect(tumDurusGorselleri().sort()).toEqual(
      ['kep', 'bere', 'tac', 'kulaklik', 'gunes'].map((id) => `/giydir/${id}-sigma.png`).sort(),
    )
  })

  it('taban dosyaları: çıplak, tek ekli ve birleşik hâlleri', () => {
    expect(tabanYolu([])).toBe(CIPLAK_RABI)
    expect(tumTabanlar().sort()).toEqual(
      [
        CIPLAK_RABI,
        '/giydir/rabi-kep.png',
        '/giydir/rabi-bere.png',
        '/giydir/rabi-tac.png',
        '/giydir/rabi-sigma.png',
        '/giydir/rabi-sigma-kep.png',
        '/giydir/rabi-sigma-bere.png',
        '/giydir/rabi-sigma-tac.png',
      ].sort(),
    )
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

  it('kaldırılan gözlük, bot ve kalemin eski kaydı düşer, kalan seçim korunur', () => {
    expect(giyilenleriCoz({ kafa: 'kep', yuz: 'gozluk', ayak: 'bot', kulak: 'kalem' })).toEqual({ kafa: 'kep' })
  })
})
