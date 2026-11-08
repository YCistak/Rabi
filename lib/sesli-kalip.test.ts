import { describe, expect, it } from 'vitest'
import { sesliMetniCoz, type SesliCozum } from './sesli-giris'
import { HAZIR_SABLONLAR, secilebilirSablonlar } from './sablonlar'
import type { Sablon } from './types'

const SABLONLAR: Sablon[] = secilebilirSablonlar(HAZIR_SABLONLAR, 12, null)

type KalipTesti = {
  metin: string
  beklenen: SesliCozum
}

const bosCozum = (): SesliCozum => ({ sorular: [], deneme: null, anlasilmayan: [] })

function cozumle(metin: string): SesliCozum {
  return sesliMetniCoz(metin, { sablonlar: SABLONLAR, varsayilanSablonId: 'tyt' })
}

function denemeKipindeCozumle(metin: string): SesliCozum {
  return sesliMetniCoz(metin, { sablonlar: SABLONLAR, varsayilanSablonId: 'tyt', kip: 'deneme' })
}

/** Katalogdaki ders çekimlerinin her biri, kanonik ders adıyla eşlenmelidir. */
const DERS_YUVALARI = [
  { ders: 'Türkçe', bicimler: ['türkçe', 'türkçeyi', 'türkçeye', 'türkçede', 'türkçeden', 'türkçeyle', 'türkçem'] },
  { ders: 'Matematik', bicimler: ['matematik', 'matematiği', 'matematiğe', 'matematikte', 'matematikten', 'matematikle', 'matematiğim'] },
  { ders: 'Fizik', bicimler: ['fizik', 'fiziği', 'fiziğe', 'fizikte', 'fizikten', 'fizikle', 'fiziğim'] },
  { ders: 'Kimya', bicimler: ['kimya', 'kimyayı', 'kimyaya', 'kimyada', 'kimyadan', 'kimyayla', 'kimyam'] },
  { ders: 'Biyoloji', bicimler: ['biyoloji', 'biyolojiyi', 'biyolojiye', 'biyolojide', 'biyolojiden', 'biyolojiyle', 'biyolojim'] },
  { ders: 'Tarih', bicimler: ['tarih', 'tarihi', 'tarihe', 'tarihte', 'tarihten', 'tarihle', 'tarihim'] },
  { ders: 'Coğrafya', bicimler: ['coğrafya', 'coğrafyayı', 'coğrafyaya', 'coğrafyada', 'coğrafyadan', 'coğrafyayla', 'coğrafyam'] },
  { ders: 'Yabancı Dil', bicimler: ['yabancı dil', 'yabancı dili', 'yabancı dile', 'yabancı dilde', 'yabancı dilden', 'yabancı dille', 'yabancı dilim'] },
  { ders: 'Felsefe', bicimler: ['felsefe', 'felsefeyi', 'felsefeye', 'felsefede', 'felsefeden', 'felsefeyle', 'felsefem'] },
  { ders: 'Din Kültürü', bicimler: ['din kültürü', 'din kültürünü', 'din kültürüne', 'din kültüründe', 'din kültüründen', 'din kültürüyle', 'din kültürüm'] },
] as const

/** Rakam, yazıyla sayı ve yaklaşık sayı doldurucularının sabit kapsaması. */
const SAYI_BICIMLERI = ['50', 'elli', 'yaklaşık 50', '50 civarı', '50 kadar', '50 falan', '50 küsur', '50 gibi', 'elli tane', '50 tane'] as const

function dersCumlesi(ders: string, bicim: string, sayi: string): string {
  if (bicim === ders.toLocaleLowerCase('tr-TR')) return `${sayi} ${bicim} sorusu çözdüm`
  return `${bicim} ${sayi} soru çözdüm`
}

/** Rastgelelik yoktur: 10 ders × 7 çekim × 10 sayı biçimi = 700 cümle. */
const URETILEN_KALIPLAR: KalipTesti[] = DERS_YUVALARI.flatMap(({ ders, bicimler }) =>
  bicimler.flatMap((bicim) =>
    SAYI_BICIMLERI.map((sayi) => ({
      metin: dersCumlesi(ders, bicim, sayi),
      beklenen: { ...bosCozum(), sorular: [{ ders, toplam: 50, dogru: 0, yanlis: 0 }] },
    })),
  ),
)

/** Yeni yuvaların yanında eski temel kalıbı farklı ders/sayı dönüşümleriyle çaprazlar. */
const GENISLETILMIS_KALIPLAR: KalipTesti[] = Array.from({ length: 500 }, (_, sira) => {
  const { ders, bicimler } = DERS_YUVALARI[sira % DERS_YUVALARI.length]!
  const bicim = bicimler[sira % bicimler.length]!
  return {
    metin: dersCumlesi(ders, bicim, 'elli tane'),
    beklenen: { ...bosCozum(), sorular: [{ ders, toplam: 50, dogru: 0, yanlis: 0 }] },
  }
})

/** Deneme kipinde de aynı ders çekimleri, seçilen sabit TYT şablonuna yazılır. */
const DENEME_KIPI_DERS_YUVALARI = [
  { dersId: 'turkce', bicimler: DERS_YUVALARI[0].bicimler },
  { dersId: 'matematik', bicimler: DERS_YUVALARI[1].bicimler },
  { dersId: 'fizik', bicimler: DERS_YUVALARI[2].bicimler },
  { dersId: 'kimya', bicimler: DERS_YUVALARI[3].bicimler },
  { dersId: 'biyoloji', bicimler: DERS_YUVALARI[4].bicimler },
  { dersId: 'tarih', bicimler: DERS_YUVALARI[5].bicimler },
  { dersId: 'cografya', bicimler: DERS_YUVALARI[6].bicimler },
  { dersId: 'felsefe', bicimler: DERS_YUVALARI[8].bicimler },
  { dersId: 'din', bicimler: DERS_YUVALARI[9].bicimler },
] as const

const DENEME_DOLGU_SOZCUKLERI = ['', 'bugün ', 'sabah ', 'akşam ', 'şey ', 'işte ', 'ee ', 'bu arada ', 'neyse ', 'lütfen '] as const

const DENEME_KIPI_KALIPLARI: KalipTesti[] = DENEME_KIPI_DERS_YUVALARI.flatMap(({ dersId, bicimler }) =>
  bicimler.flatMap((bicim) =>
    DENEME_DOLGU_SOZCUKLERI.map((dolgu) => ({
      metin: `${dolgu}${bicim} 3 doğru 1 yanlış`,
      beklenen: {
        sorular: [],
        deneme: { sablonId: 'tyt', dersler: [{ dersId, dogru: 3, yanlis: 1 }], toplu: [], toplamNet: null },
        anlasilmayan: [],
      },
    })),
  ),
)

const SONUC_KALIPLARI: KalipTesti[] = [
  {
    metin: 'matematik 50 soru çözdüm 20 doğru 20 yanlış 10 boş',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Matematik', toplam: 50, dogru: 20, yanlis: 20 }] },
  },
  {
    metin: 'fizikten elli soru yaptım 20si doğru 20si yanlış 10 tanesi ise boş',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Fizik', toplam: 50, dogru: 20, yanlis: 20 }] },
  },
  {
    metin: 'kimyadan 50 soru çözdüm hepsini doğru yaptım',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Kimya', toplam: 50, dogru: 50, yanlis: 0 }] },
  },
  {
    metin: 'biyolojide 20 doğrum 5 yanlışım var',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Biyoloji', toplam: 25, dogru: 20, yanlis: 5 }] },
  },
  {
    metin: 'tarihte 5 yanlış 30 doğru 2 boş',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Tarih', toplam: 37, dogru: 30, yanlis: 5 }] },
  },
  {
    metin: 'coğrafyadan 50 soru çözdüm 10 tanesini yanlış yaptım',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Coğrafya', toplam: 50, dogru: 40, yanlis: 10 }] },
  },
  {
    metin: 'felsefeden 50 soru çözdüm 20 doğru 20 yanlış kalanı boş',
    beklenen: { ...bosCozum(), sorular: [{ ders: 'Felsefe', toplam: 50, dogru: 20, yanlis: 20 }] },
  },
  {
    metin: 'mat 20 soru sonra fizik 15 soru ayrıca biyo 10 soru çözdüm',
    beklenen: {
      ...bosCozum(),
      sorular: [
        { ders: 'Matematik', toplam: 20, dogru: 0, yanlis: 0 },
        { ders: 'Fizik', toplam: 15, dogru: 0, yanlis: 0 },
        { ders: 'Biyoloji', toplam: 10, dogru: 0, yanlis: 0 },
      ],
    },
  },
  {
    metin: 'ayt sayısal denemesinde matematik 25 doğru 5 yanlış',
    beklenen: { ...bosCozum(), deneme: { sablonId: 'ayt-say', dersler: [{ dersId: 'matematik', dogru: 25, yanlis: 5 }], toplamNet: null } },
  },
  {
    metin: 'tyt denemesine girdim toplam 87 netim var',
    beklenen: { ...bosCozum(), deneme: { sablonId: 'tyt', dersler: [], toplamNet: 87 } },
  },
  {
    metin: 'matematiğim 25 netti',
    beklenen: bosCozum(),
  },
  {
    metin: 'fizikten 30 netim var',
    beklenen: bosCozum(),
  },
  {
    metin: 'kimyada 40 net yaptım',
    beklenen: bosCozum(),
  },
  {
    metin: 'biyoloji 18 net çıktı',
    beklenen: bosCozum(),
  },
]

describe('sesli konuşma kalıpları — üretilen katalog', () => {
  it('en az 1200 cümle üretir; tüm ders ve çekim yuvaları kapsanır', () => {
    expect([...URETILEN_KALIPLAR, ...GENISLETILMIS_KALIPLAR]).toHaveLength(1200)
    expect(new Set(URETILEN_KALIPLAR.map((kalip) => kalip.beklenen.sorular[0]!.ders))).toEqual(new Set(DERS_YUVALARI.map(({ ders }) => ders)))
  })

  it.each(URETILEN_KALIPLAR)('$metin', ({ metin, beklenen }) => {
    expect(cozumle(metin)).toEqual(beklenen)
  })

  it.each(GENISLETILMIS_KALIPLAR)('$metin', ({ metin, beklenen }) => {
    expect(cozumle(metin)).toEqual(beklenen)
  })

  it.each(SONUC_KALIPLARI)('$metin', ({ metin, beklenen }) => {
    expect(cozumle(metin)).toEqual(beklenen)
  })

  it('deneme kipinde en az 400 ders çekimi üretir', () => {
    expect(DENEME_KIPI_KALIPLARI.length).toBeGreaterThanOrEqual(400)
  })

  it.each(DENEME_KIPI_KALIPLARI)('deneme: $metin', ({ metin, beklenen }) => {
    expect(denemeKipindeCozumle(metin)).toEqual(beklenen)
  })

  it("bugün 50 matematik sorusu çözdüm 20'si doğru 20'si yanlış 10 tanesi ise boş", () => {
    expect(cozumle("bugün 50 matematik sorusu çözdüm 20'si doğru 20'si yanlış 10 tanesi ise boş")).toEqual({
      ...bosCozum(),
      sorular: [{ ders: 'Matematik', toplam: 50, dogru: 20, yanlis: 20 }],
    })
  })

  it('yeni ders, geçmiş zaman, sonuç-ders sırası ve bağlam yuvalarını çözer', () => {
    expect(cozumle("matematik 50 soru çözdüm matematik sorularının 20'si doğru 10 tanesi yanlıştı kalanları boştu").sorular).toEqual([
      { ders: 'Matematik', toplam: 50, dogru: 20, yanlis: 10 },
    ])
    const deneme = cozumle('TYT denemesine girdim 20 doğru 20 yanlış Türkçe yaptım 10 doğru 30 yanlış matematik yaptım')
    expect(deneme.deneme?.dersler).toEqual([
      { dersId: 'turkce', dogru: 20, yanlis: 20 },
      { dersId: 'matematik', dogru: 10, yanlis: 30 },
    ])
  })
})
