import { describe, expect, it } from 'vitest'
import {
  DILIMLER,
  EN_COK_GOREV,
  EN_UZUN_GOREV,
  GOREV_RENKLERI,
  bekleyenGorev,
  dilimGorevleri,
  dilimeYerVarMi,
  gorevEkle,
  gorevErtele,
  gorevIsaretle,
  gorevRengi,
  gorevSil,
  gorevYildizla,
  gorevleriNormalize,
  gununGorevleri,
  kalanSure,
  sureYaz,
  elleSure,
  EN_UZUN_SURE,
  SURE_SECENEKLERI,
  haftaninGorevleri,
  metniKirp,
  simdikiDilim,
  type Gorev,
  type GorevDilimi,
} from './yapilacaklar'
import { haftaBasi } from './utils'

/** 21 Ağustos 2026, cuma. */
const GUN = '2026-08-21'

function gorev(pay: Partial<Gorev> & { id: string }): Gorev {
  return {
    metin: 'iş',
    gun: GUN,
    dilim: 'sabah',
    kategori: 'soru',
    renk: 'turuncu',
    sure: 30,
    bitti: false,
    yildiz: false,
    ...pay,
  }
}

/** `adet` kadar görevi aynı gün ve dilime yazar. */
function doldur(adet: number, dilim: GorevDilimi = 'sabah', gun = GUN): Gorev[] {
  let liste: Gorev[] = []
  for (let i = 0; i < adet; i++) {
    liste = gorevEkle(liste, {
      id: `g${i}`,
      metin: `iş ${i}`,
      gun,
      dilim,
      kategori: 'soru',
      renk: 'turuncu',
      sure: 30,
    }) ?? liste
  }
  return liste
}

describe('metniKirp', () => {
  it('boşlukları atar', () => {
    expect(metniKirp('  40 soru  ')).toBe('40 soru')
  })

  it('sınırı aşan metni keser', () => {
    const uzun = 'a'.repeat(EN_UZUN_GOREV + 20)
    expect(metniKirp(uzun)).toHaveLength(EN_UZUN_GOREV)
  })

  it('sınır tek satıra sığacak kadar kısa', () => {
    // Satırda metne kalan yer ~198 piksel (ölçüldü), Türkçe küçük harfli metin
    // karakter başına ~7,4 piksel: yirmi altı karakter sığıyor, sınır altında.
    expect(EN_UZUN_GOREV).toBeLessThanOrEqual(26)
  })
})

describe('simdikiDilim', () => {
  it('saati dilime çevirir', () => {
    expect(simdikiDilim(0)).toBe('sabah')
    expect(simdikiDilim(11)).toBe('sabah')
    expect(simdikiDilim(12)).toBe('ogle')
    expect(simdikiDilim(16)).toBe('ogle')
    expect(simdikiDilim(17)).toBe('aksam')
    expect(simdikiDilim(23)).toBe('aksam')
  })
})

describe('gorevEkle', () => {
  it('görevi bitmemiş ve yıldızsız ekler', () => {
    const liste = gorevEkle([], {
      id: 'a',
      metin: '  40 soru  ',
      gun: GUN,
      dilim: 'ogle',
      kategori: 'deneme',
      renk: 'mor',
      sure: 45,
    })
    expect(liste).toEqual([
      {
        id: 'a',
        metin: '40 soru',
        gun: GUN,
        dilim: 'ogle',
        kategori: 'deneme',
        renk: 'mor',
        sure: 45,
        bitti: false,
        yildiz: false,
      },
    ])
  })

  it('boş metni kabul etmez', () => {
    const sonuc = gorevEkle([], {
      id: 'a',
      metin: '   ',
      gun: GUN,
      dilim: 'sabah',
      kategori: 'soru',
      renk: 'turuncu',
      sure: 30,
    })
    expect(sonuc).toBeNull()
  })

  it('dilim dolduğunda null döner', () => {
    const dolu = doldur(EN_COK_GOREV)
    expect(dolu).toHaveLength(EN_COK_GOREV)
    expect(dilimeYerVarMi(dolu, GUN, 'sabah')).toBe(false)
    const sonuc = gorevEkle(dolu, {
      id: 'fazla',
      metin: 'sığmaz',
      gun: GUN,
      dilim: 'sabah',
      kategori: 'soru',
      renk: 'turuncu',
      sure: 30,
    })
    expect(sonuc).toBeNull()
  })

  it('sınır dilim başına: sabah doluyken akşama yazılabiliyor', () => {
    const dolu = doldur(EN_COK_GOREV)
    const sonuc = gorevEkle(dolu, {
      id: 'aksam-1',
      metin: 'etüt',
      gun: GUN,
      dilim: 'aksam',
      kategori: 'tekrar',
      renk: 'yesil',
      sure: 30,
    })
    expect(sonuc).toHaveLength(EN_COK_GOREV + 1)
    expect(dilimeYerVarMi(sonuc!, GUN, 'aksam')).toBe(true)
  })

  it('sınır gün başına da ayrı: dolu günün ertesine yazılabiliyor', () => {
    const dolu = doldur(EN_COK_GOREV)
    const sonuc = gorevEkle(dolu, {
      id: 'yarin',
      metin: 'deneme',
      gun: '2026-08-22',
      dilim: 'sabah',
      kategori: 'deneme',
      renk: 'mavi',
      sure: 30,
    })
    expect(sonuc).not.toBeNull()
  })
})

describe('dilimGorevleri', () => {
  const liste = [
    gorev({ id: 'a', dilim: 'sabah' }),
    gorev({ id: 'b', dilim: 'aksam' }),
    gorev({ id: 'c', dilim: 'sabah', yildiz: true }),
    gorev({ id: 'd', dilim: 'sabah', bitti: true }),
    gorev({ id: 'e', dilim: 'sabah', gun: '2026-08-22' }),
  ]

  it('yalnızca o günün o dilimini verir', () => {
    expect(dilimGorevleri(liste, GUN, 'sabah').map((g) => g.id)).toEqual(['c', 'a', 'd'])
    expect(dilimGorevleri(liste, GUN, 'aksam').map((g) => g.id)).toEqual(['b'])
  })

  it('yıldızlıyı üste alır, ötekilerin sırasını bozmaz', () => {
    const sirali = dilimGorevleri(liste, GUN, 'sabah')
    expect(sirali[0].id).toBe('c')
    // 'a' ve 'd' eklenme sırasını koruyor: biten görev sona atılmıyor.
    expect(sirali.map((g) => g.id).slice(1)).toEqual(['a', 'd'])
  })

  it('kaynak listeyi değiştirmez', () => {
    const kopya = liste.map((g) => g.id)
    dilimGorevleri(liste, GUN, 'sabah')
    expect(liste.map((g) => g.id)).toEqual(kopya)
  })
})

describe('haftaninGorevleri', () => {
  it('bu haftadan eskisini atar, ileriyi tutar', () => {
    // 21 Ağustos 2026 cuma; haftanın pazartesisi 17 Ağustos.
    const hafta = haftaBasi(GUN)
    expect(hafta).toBe('2026-08-17')
    const liste = [
      gorev({ id: 'gecen-hafta', gun: '2026-08-16' }),
      gorev({ id: 'pazartesi', gun: '2026-08-17' }),
      gorev({ id: 'bugun', gun: GUN }),
      gorev({ id: 'gelecek-hafta', gun: '2026-08-25' }),
      gorev({ id: 'gunsuz', gun: '' }),
    ]
    expect(haftaninGorevleri(liste, hafta).map((g) => g.id)).toEqual([
      'pazartesi',
      'bugun',
      'gelecek-hafta',
    ])
  })
})

describe('gununGorevleri ve bekleyenGorev', () => {
  const liste = [
    gorev({ id: 'a' }),
    gorev({ id: 'b', bitti: true }),
    gorev({ id: 'c', gun: '2026-08-22' }),
  ]

  it('günü süzer', () => {
    expect(gununGorevleri(liste, GUN).map((g) => g.id)).toEqual(['a', 'b'])
  })

  it('bitmemişleri sayar', () => {
    expect(bekleyenGorev(gununGorevleri(liste, GUN))).toBe(1)
  })
})

describe('gorevErtele', () => {
  it('ertesi güne, aynı dilime taşır', () => {
    const liste = [gorev({ id: 'a', dilim: 'aksam' })]
    const sonuc = gorevErtele(liste, 'a')
    expect(sonuc?.[0]).toMatchObject({ gun: '2026-08-22', dilim: 'aksam' })
  })

  it('ay sonunda da doğru güne gider', () => {
    const liste = [gorev({ id: 'a', gun: '2026-08-31' })]
    expect(gorevErtele(liste, 'a')?.[0].gun).toBe('2026-09-01')
  })

  it('hedef dilim doluysa null döner', () => {
    const yarin = doldur(EN_COK_GOREV, 'sabah', '2026-08-22')
    const liste = [...yarin, gorev({ id: 'bugunku' })]
    expect(gorevErtele(liste, 'bugunku')).toBeNull()
  })

  it('bitmiş görevi ertelemez', () => {
    expect(gorevErtele([gorev({ id: 'a', bitti: true })], 'a')).toBeNull()
  })

  it('bilinmeyen kimlikte null döner', () => {
    expect(gorevErtele([gorev({ id: 'a' })], 'yok')).toBeNull()
  })
})

describe('işaretleme, yıldız ve silme', () => {
  const liste = [gorev({ id: 'a' }), gorev({ id: 'b' })]

  it('tik durumunu çevirir', () => {
    const bir = gorevIsaretle(liste, 'a')
    expect(bir[0].bitti).toBe(true)
    expect(bir[1].bitti).toBe(false)
    expect(gorevIsaretle(bir, 'a')[0].bitti).toBe(false)
  })

  it('yıldızı çevirir', () => {
    expect(gorevYildizla(liste, 'b')[1].yildiz).toBe(true)
  })

  it('siler', () => {
    expect(gorevSil(liste, 'a').map((g) => g.id)).toEqual(['b'])
  })

  it('bilinmeyen kimlik listeyi bozmaz', () => {
    expect(gorevIsaretle(liste, 'yok')).toEqual(liste)
    expect(gorevSil(liste, 'yok')).toEqual(liste)
  })
})

describe('gorevleriNormalize', () => {
  it('dizi olmayanı boş liste sayar', () => {
    expect(gorevleriNormalize(null)).toEqual([])
    expect(gorevleriNormalize({ a: 1 })).toEqual([])
  })

  it('kimliksiz ve günsüz kayıtları eler', () => {
    expect(
      gorevleriNormalize([
        { metin: 'kimliksiz', gun: GUN },
        { id: '', gun: GUN },
        { id: 'a' },
        null,
        'x',
        { id: 'b', gun: GUN },
      ]).map((g) => g.id),
    ).toEqual(['b'])
  })

  it('eksik alanları güvenli varsayılana çeker', () => {
    expect(gorevleriNormalize([{ id: 'a', gun: GUN }])[0]).toEqual({
      id: 'a',
      metin: '',
      gun: GUN,
      dilim: 'sabah',
      kategori: 'diger',
      renk: 'turuncu',
      sure: null,
      bitti: false,
      yildiz: false,
    })
  })

  it('tanınmayan dilim, kategori ve rengi varsayılana düşürür', () => {
    expect(
      gorevleriNormalize([
        { id: 'a', gun: GUN, dilim: 'gece', kategori: 'spor', renk: 'neon' },
      ])[0],
    ).toMatchObject({ dilim: 'sabah', kategori: 'diger', renk: 'turuncu' })
  })

  it('uzun metni sınıra kırpar', () => {
    const uzun = gorevleriNormalize([{ id: 'a', gun: GUN, metin: 'x'.repeat(200) }])[0]
    expect(uzun.metin).toHaveLength(EN_UZUN_GOREV)
  })

  it('eski tahta kâğıdını görev olarak taşır', () => {
    // Tahta döneminin kaydı: konum var, dilim ve kategori yok.
    const eski = { id: 'k1', metin: 'kimya tekrarı', renk: 'mavi', x: 0.4, y: 0.7, bitti: true, gun: GUN }
    const tasinan = gorevleriNormalize([eski])[0]
    expect(tasinan).toEqual({
      id: 'k1',
      metin: 'kimya tekrarı',
      gun: GUN,
      dilim: 'sabah',
      kategori: 'diger',
      renk: 'mavi',
      sure: null,
      bitti: true,
      yildiz: false,
    })
    expect(tasinan).not.toHaveProperty('x')
  })

  it('dilim sınırını aşan kayıtları eler, ilk yazılanları tutar', () => {
    const ham = Array.from({ length: EN_COK_GOREV + 3 }, (_, i) => ({
      id: `g${i}`,
      gun: GUN,
      dilim: 'aksam',
      metin: `iş ${i}`,
    }))
    const temiz = gorevleriNormalize(ham)
    expect(temiz).toHaveLength(EN_COK_GOREV)
    expect(temiz.at(-1)!.id).toBe(`g${EN_COK_GOREV - 1}`)
  })

  it('sınır gün ve dilim başına sayılıyor', () => {
    const ham = [
      ...Array.from({ length: EN_COK_GOREV }, (_, i) => ({ id: `s${i}`, gun: GUN, dilim: 'sabah' })),
      { id: 'aksam', gun: GUN, dilim: 'aksam' },
      { id: 'yarin', gun: '2026-08-22', dilim: 'sabah' },
    ]
    const temiz = gorevleriNormalize(ham)
    expect(temiz).toHaveLength(EN_COK_GOREV + 2)
    expect(temiz.map((g) => g.id)).toContain('aksam')
    expect(temiz.map((g) => g.id)).toContain('yarin')
  })

  it('eski paletin karşılığı olmayan rengini varsayılana çeker', () => {
    // 'sari' ve 'pembe' yeni palette yok.
    expect(gorevleriNormalize([{ id: 'a', gun: GUN, renk: 'sari' }])[0].renk).toBe('turuncu')
  })
})

describe('palet ve dilimler', () => {
  it('on iki renk, hepsi ayrı', () => {
    expect(GOREV_RENKLERI).toHaveLength(12)
    expect(new Set(GOREV_RENKLERI.map((r) => r.id)).size).toBe(12)
    expect(new Set(GOREV_RENKLERI.map((r) => r.ad)).size).toBe(12)
  })

  it('renk kimliği CSS değişkenine çevriliyor', () => {
    expect(gorevRengi('deniz')).toBe('var(--gorev-deniz)')
  })

  it('üç dilim, sıra sabit', () => {
    expect(DILIMLER).toEqual(['sabah', 'ogle', 'aksam'])
  })
})

describe('süre', () => {
  it('okunur yazılıyor', () => {
    expect(sureYaz(15)).toBe('15 dk')
    expect(sureYaz(60)).toBe('1 sa')
    expect(sureYaz(90)).toBe('1 sa 30 dk')
    expect(sureYaz(120)).toBe('2 sa')
  })

  it('kalan süre bitmemiş ve süresi bilinen görevleri topluyor', () => {
    const liste = [
      gorev({ id: 'a', sure: 30 }),
      gorev({ id: 'b', sure: 45, bitti: true }),
      gorev({ id: 'c', sure: null }),
      gorev({ id: 'd', sure: 60 }),
    ]
    expect(kalanSure(liste)).toBe(90)
  })

  it('eski kayıtta süre uydurulmuyor, bozuk süre eleniyor', () => {
    const [eski, bozuk, eksi, iyi] = gorevleriNormalize([
      { id: 'a', gun: GUN, metin: 'eski' },
      { id: 'b', gun: GUN, metin: 'b', sure: 'yarım saat' },
      { id: 'c', gun: GUN, metin: 'c', sure: -5 },
      { id: 'd', gun: GUN, metin: 'd', sure: 45 },
    ])
    expect(eski.sure).toBeNull()
    expect(bozuk.sure).toBeNull()
    expect(eksi.sure).toBeNull()
    expect(iyi.sure).toBe(45)
  })

  it('ertelenen görev süresini koruyor', () => {
    const sonuc = gorevErtele([gorev({ id: 'a', sure: 90 })], 'a')
    expect(sonuc?.[0].sure).toBe(90)
  })
})

describe('elle süre', () => {
  it('rakamları okuyor, sıfırı ve boşu süre saymıyor', () => {
    expect(elleSure('37')).toBe(37)
    expect(elleSure('45 dk')).toBe(45)
    expect(elleSure('')).toBeNull()
    expect(elleSure('0')).toBeNull()
    expect(elleSure('abc')).toBeNull()
  })

  it('üst sınırı aşmıyor', () => {
    expect(elleSure('99999')).toBe(EN_UZUN_SURE)
  })

  it('hazır sürelerde 90 yok, 120 son hazır süre', () => {
    expect(SURE_SECENEKLERI).not.toContain(90)
    expect(SURE_SECENEKLERI.at(-1)).toBe(120)
  })
})
