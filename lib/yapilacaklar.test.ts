import { describe, expect, it } from 'vitest'
import {
  EN_COK_GOREV,
  EN_UZUN_GOREV,
  GOREV_RENKLERI,
  bekleyenGorev,
  gununSiraliGorevleri,
  gunuYerVarMi,
  gorevEkle,
  gorevErtele,
  gorevIsaretle,
  gorevRengi,
  gorevSil,
  gorevDuzenle,
  gorevYildizla,
  gorevleriNormalize,
  gununGorevleri,
  kalanSure,
  sureYaz,
  elleSure,
  EN_UZUN_SURE,
  SURE_SECENEKLERI,
  gorevleriTarihtenItibaren,
  metniKirp,
  kategoriAdiGoster,
  ozelKategoriKirp,
  EN_UZUN_OZEL_KATEGORI,
  saatKirp,
  type Gorev,
} from './yapilacaklar'
import { haftaBasi } from './utils'

/** 21 Ağustos 2026, cuma. */
const GUN = '2026-08-21'

function gorev(pay: Partial<Gorev> & { id: string }): Gorev {
  return {
    metin: 'iş',
    gun: GUN,
    saat: null,
    kategori: 'soru',
    renk: 'turuncu',
    sure: 30,
    bitti: false,
    yildiz: false,
    ...pay,
  }
}

/** `adet` kadar görevi aynı güne yazar. */
function doldur(adet: number, gun = GUN): Gorev[] {
  let liste: Gorev[] = []
  for (let i = 0; i < adet; i++) {
    liste = gorevEkle(liste, {
      id: `g${i}`,
      metin: `iş ${i}`,
      gun,
      saat: null,
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

describe('saatKirp', () => {
  it("geçerli 'SS:DD'yi tutar, saniyeyi atar", () => {
    expect(saatKirp('09:05')).toBe('09:05')
    expect(saatKirp('23:59')).toBe('23:59')
    expect(saatKirp('00:00')).toBe('00:00')
    expect(saatKirp('14:30:00')).toBe('14:30')
  })

  it('bozuk ya da boş saati null sayar', () => {
    expect(saatKirp('')).toBeNull()
    expect(saatKirp('24:00')).toBeNull()
    expect(saatKirp('9:30')).toBeNull()
    expect(saatKirp('12:60')).toBeNull()
    expect(saatKirp('sabah')).toBeNull()
    expect(saatKirp(930)).toBeNull()
    expect(saatKirp(undefined)).toBeNull()
  })
})

describe('gorevEkle', () => {
  it('görevi bitmemiş ve yıldızsız ekler', () => {
    const liste = gorevEkle([], {
      id: 'a',
      metin: '  40 soru  ',
      gun: GUN,
      saat: '14:30',
      kategori: 'deneme',
      renk: 'mor',
      sure: 45,
    })
    expect(liste).toEqual([
      {
        id: 'a',
        metin: '40 soru',
        gun: GUN,
        saat: '14:30',
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
      saat: null,
      kategori: 'soru',
      renk: 'turuncu',
      sure: 30,
    })
    expect(sonuc).toBeNull()
  })

  it('bozuk saati saatsiz kaydeder', () => {
    const [g] = gorevEkle([], {
      id: 'a',
      metin: 'iş',
      gun: GUN,
      saat: '25:00',
      kategori: 'soru',
      renk: 'turuncu',
      sure: null,
    })!
    expect(g.saat).toBeNull()
  })

  it('gün dolduğunda null döner', () => {
    const dolu = doldur(EN_COK_GOREV)
    expect(dolu).toHaveLength(EN_COK_GOREV)
    expect(gunuYerVarMi(dolu, GUN)).toBe(false)
    const sonuc = gorevEkle(dolu, {
      id: 'fazla',
      metin: 'sığmaz',
      gun: GUN,
      saat: '20:00',
      kategori: 'soru',
      renk: 'turuncu',
      sure: 30,
    })
    expect(sonuc).toBeNull()
  })

  it('günlük sınır eski üç dilimin toplamından düşük değil', () => {
    // Dilim döneminde bir güne 3 × 10 görev yazılabiliyordu; taşınırken
    // hiçbiri elenmemeli.
    expect(EN_COK_GOREV).toBeGreaterThanOrEqual(30)
  })

  it('sınır gün başına da ayrı: dolu günün ertesine yazılabiliyor', () => {
    const dolu = doldur(EN_COK_GOREV)
    const sonuc = gorevEkle(dolu, {
      id: 'yarin',
      metin: 'deneme',
      gun: '2026-08-22',
      saat: null,
      kategori: 'deneme',
      renk: 'mavi',
      sure: 30,
    })
    expect(sonuc).not.toBeNull()
  })
})

describe('gununSiraliGorevleri', () => {
  const liste = [
    gorev({ id: 'saatsiz-1' }),
    gorev({ id: 'aksam', saat: '19:00' }),
    gorev({ id: 'saatsiz-yildiz', yildiz: true }),
    gorev({ id: 'sabah', saat: '08:30', bitti: true }),
    gorev({ id: 'ogle', saat: '13:00' }),
    gorev({ id: 'ogle-yildiz', saat: '13:00', yildiz: true }),
    gorev({ id: 'saatsiz-2' }),
    gorev({ id: 'yarin', saat: '07:00', gun: '2026-08-22' }),
  ]

  it('saatliler saate göre üstte, saatsizler altta; yalnızca o gün', () => {
    expect(gununSiraliGorevleri(liste, GUN).map((g) => g.id)).toEqual([
      'sabah',
      'ogle-yildiz',
      'ogle',
      'aksam',
      'saatsiz-yildiz',
      'saatsiz-1',
      'saatsiz-2',
    ])
  })

  it('yıldız saatin önüne geçmiyor', () => {
    const sirali = gununSiraliGorevleri(
      [gorev({ id: 'gec', saat: '20:00', yildiz: true }), gorev({ id: 'erken', saat: '09:00' })],
      GUN,
    )
    expect(sirali.map((g) => g.id)).toEqual(['erken', 'gec'])
  })

  it('biten görev yerinde kalıyor, saatsizlerde eklenme sırası korunuyor', () => {
    const sirali = gununSiraliGorevleri(
      [gorev({ id: 'a' }), gorev({ id: 'b', bitti: true }), gorev({ id: 'c' })],
      GUN,
    )
    expect(sirali.map((g) => g.id)).toEqual(['a', 'b', 'c'])
  })

  it('kaynak listeyi değiştirmez', () => {
    const kopya = liste.map((g) => g.id)
    gununSiraliGorevleri(liste, GUN)
    expect(liste.map((g) => g.id)).toEqual(kopya)
  })
})

describe('gorevleriTarihtenItibaren', () => {
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
    expect(gorevleriTarihtenItibaren(liste, hafta).map((g) => g.id)).toEqual([
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
  it('ertesi güne, aynı saate taşır', () => {
    const liste = [gorev({ id: 'a', saat: '18:30' })]
    const sonuc = gorevErtele(liste, 'a')
    expect(sonuc?.[0]).toMatchObject({ gun: '2026-08-22', saat: '18:30' })
  })

  it('ay sonunda da doğru güne gider', () => {
    const liste = [gorev({ id: 'a', gun: '2026-08-31' })]
    expect(gorevErtele(liste, 'a')?.[0].gun).toBe('2026-09-01')
  })

  it('hedef gün doluysa null döner', () => {
    const yarin = doldur(EN_COK_GOREV, '2026-08-22')
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

describe('gorevDuzenle', () => {
  const liste = [gorev({ id: 'a', yildiz: true, bitti: true }), gorev({ id: 'b' })]
  const duzen = {
    metin: '  yeni ad  ',
    saat: '16:45',
    kategori: 'tekrar',
    renk: 'mavi',
    sure: 45,
  } as const

  it('ad, saat, kategori, renk ve süreyi değiştirir; gün ve durum yerinde kalır', () => {
    const sonuc = gorevDuzenle(liste, 'a', duzen)!
    expect(sonuc[0]).toMatchObject({
      id: 'a',
      metin: 'yeni ad',
      saat: '16:45',
      kategori: 'tekrar',
      renk: 'mavi',
      sure: 45,
      gun: GUN,
      yildiz: true,
      bitti: true,
    })
    expect(sonuc[1]).toEqual(liste[1])
  })

  it('saat kaldırılabiliyor', () => {
    const saatli = gorevDuzenle(liste, 'b', duzen)!
    expect(gorevDuzenle(saatli, 'b', { ...duzen, saat: null })![1].saat).toBeNull()
  })

  it("özel ad yalnızca Diğer'de kalır", () => {
    const diger = gorevDuzenle(liste, 'b', { ...duzen, kategori: 'diger', ozelKategori: 'Spor' })!
    expect(diger[1].ozelKategori).toBe('Spor')
    const geri = gorevDuzenle(diger, 'b', duzen)!
    expect(geri[1]).not.toHaveProperty('ozelKategori')
  })

  it('boş metinde ya da bilinmeyen kimlikte null', () => {
    expect(gorevDuzenle(liste, 'a', { ...duzen, metin: '   ' })).toBeNull()
    expect(gorevDuzenle(liste, 'yok', duzen)).toBeNull()
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
      saat: null,
      kategori: 'diger',
      renk: 'turuncu',
      sure: null,
      bitti: false,
      yildiz: false,
    })
  })

  it('tanınmayan saat, kategori ve rengi varsayılana düşürür', () => {
    expect(
      gorevleriNormalize([
        { id: 'a', gun: GUN, saat: 'öğlen', kategori: 'spor', renk: 'neon' },
      ])[0],
    ).toMatchObject({ saat: null, kategori: 'diger', renk: 'turuncu' })
  })

  it('geçerli saati korur', () => {
    expect(gorevleriNormalize([{ id: 'a', gun: GUN, saat: '07:15' }])[0].saat).toBe('07:15')
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
      saat: null,
      kategori: 'diger',
      renk: 'mavi',
      sure: null,
      bitti: true,
      yildiz: false,
    })
    expect(tasinan).not.toHaveProperty('x')
  })

  it('dilimli eski görevi saatsiz taşır, dilimden saat uydurmaz', () => {
    // Dilim döneminin kaydı: `dilim` var, `saat` yok.
    const eski = [
      { id: 's', gun: GUN, dilim: 'sabah', metin: 'paragraf', kategori: 'soru', renk: 'mor', sure: 30, bitti: false, yildiz: true },
      { id: 'o', gun: GUN, dilim: 'ogle', metin: 'deneme', kategori: 'deneme', renk: 'mavi', sure: null, bitti: true, yildiz: false },
      { id: 'a', gun: GUN, dilim: 'aksam', metin: 'etüt', kategori: 'tekrar', renk: 'yesil', sure: 60, bitti: false, yildiz: false },
    ]
    const tasinan = gorevleriNormalize(eski)
    expect(tasinan.map((g) => g.id)).toEqual(['s', 'o', 'a'])
    for (const g of tasinan) {
      expect(g.saat).toBeNull()
      expect(g).not.toHaveProperty('dilim')
    }
    // Öteki alanlar olduğu gibi kalıyor.
    expect(tasinan[0]).toMatchObject({ metin: 'paragraf', kategori: 'soru', renk: 'mor', sure: 30, yildiz: true })
    expect(tasinan[1]).toMatchObject({ bitti: true, sure: null })
  })

  it('dilim döneminin dolu günü (3 × 10) taşınırken hiçbir görev elenmiyor', () => {
    const ham = ['sabah', 'ogle', 'aksam'].flatMap((dilim) =>
      Array.from({ length: 10 }, (_, i) => ({ id: `${dilim}${i}`, gun: GUN, dilim, metin: `iş ${i}` })),
    )
    expect(gorevleriNormalize(ham)).toHaveLength(30)
  })

  it('gün sınırını aşan kayıtları eler, ilk yazılanları tutar', () => {
    const ham = Array.from({ length: EN_COK_GOREV + 3 }, (_, i) => ({
      id: `g${i}`,
      gun: GUN,
      metin: `iş ${i}`,
    }))
    const temiz = gorevleriNormalize(ham)
    expect(temiz).toHaveLength(EN_COK_GOREV)
    expect(temiz.at(-1)!.id).toBe(`g${EN_COK_GOREV - 1}`)
  })

  it('sınır gün başına sayılıyor', () => {
    const ham = [
      ...Array.from({ length: EN_COK_GOREV }, (_, i) => ({ id: `s${i}`, gun: GUN })),
      { id: 'fazla', gun: GUN },
      { id: 'yarin', gun: '2026-08-22' },
    ]
    const temiz = gorevleriNormalize(ham)
    expect(temiz).toHaveLength(EN_COK_GOREV + 1)
    expect(temiz.map((g) => g.id)).not.toContain('fazla')
    expect(temiz.map((g) => g.id)).toContain('yarin')
  })

  it('eski paletin karşılığı olmayan rengini varsayılana çeker', () => {
    // 'sari' ve 'pembe' yeni palette yok.
    expect(gorevleriNormalize([{ id: 'a', gun: GUN, renk: 'sari' }])[0].renk).toBe('turuncu')
  })
})

describe('palet', () => {
  it('on iki renk, hepsi ayrı', () => {
    expect(GOREV_RENKLERI).toHaveLength(12)
    expect(new Set(GOREV_RENKLERI.map((r) => r.id)).size).toBe(12)
    expect(new Set(GOREV_RENKLERI.map((r) => r.ad)).size).toBe(12)
  })

  it('renk kimliği CSS değişkenine çevriliyor', () => {
    expect(gorevRengi('deniz')).toBe('var(--gorev-deniz)')
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

describe('özel kategori ("Diğer")', () => {
  const yeni = (pay: Partial<Parameters<typeof gorevEkle>[1]> = {}) => ({
    id: 'o1',
    metin: 'kitap oku',
    gun: GUN,
    saat: null,
    kategori: 'diger' as const,
    renk: 'turuncu' as const,
    sure: null,
    ...pay,
  })

  it('"Diğer"de yazılan ad kaydediliyor ve satırda görünüyor', () => {
    const [g] = gorevEkle([], yeni({ ozelKategori: '  Kitap  ' }))!
    expect(g.ozelKategori).toBe('Kitap')
    expect(kategoriAdiGoster(g)).toBe('Kitap')
  })

  it('boş ya da boşluk olan ad "Diğer" kalıyor, alan yazılmıyor', () => {
    const [g] = gorevEkle([], yeni({ ozelKategori: '   ' }))!
    expect('ozelKategori' in g).toBe(false)
    expect(kategoriAdiGoster(g)).toBe('Diğer')
  })

  it('ad sınıra kırpılıyor', () => {
    const [g] = gorevEkle([], yeni({ ozelKategori: 'a'.repeat(40) }))!
    expect(g.ozelKategori).toHaveLength(EN_UZUN_OZEL_KATEGORI)
  })

  it('başka kategoriye ad sızmıyor', () => {
    const [g] = gorevEkle([], yeni({ kategori: 'soru', ozelKategori: 'Kitap' }))!
    expect(g.ozelKategori).toBeUndefined()
    expect(kategoriAdiGoster(g)).toBe('Soru')
  })

  it('kayıttan okurken korunuyor, eski kayıt (alansız) bozulmuyor', () => {
    const ham = [
      { ...gorev({ id: 'a', kategori: 'diger' }), ozelKategori: 'Kitap' },
      gorev({ id: 'b', kategori: 'diger' }),
      { ...gorev({ id: 'c', kategori: 'soru' }), ozelKategori: 'Sızan' },
    ]
    const [a, b, c] = gorevleriNormalize(ham)
    expect(a.ozelKategori).toBe('Kitap')
    expect(b.ozelKategori).toBeUndefined()
    expect(c.ozelKategori).toBeUndefined()
  })

  it('ozelKategoriKirp boşta undefined döner', () => {
    expect(ozelKategoriKirp(undefined)).toBeUndefined()
    expect(ozelKategoriKirp('  ')).toBeUndefined()
  })
})
