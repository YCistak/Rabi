import { sec } from './tur'
import {
  TUVAL_GENISLIK,
  TUVAL_YUKSEKLIK,
  aciEtiketi,
  kenarTiki,
  koseEtiketi,
  koseYayi,
  paralelIsareti,
  yonde,
  type Nokta,
  type Sekil,
  type SekilParcasi,
} from './sekil'

/**
 * Açı Tamamlama — Geometri Ustası'nın açı oyununun soru üreteci.
 *
 * TYT geometrisinde açı soruları birkaç kuralın etrafında dönüyor ve hepsi
 * ezberden değil şekilden çözülüyor. Havuz tutulmadı, sorular **üretiliyor**:
 * kural sayısı az, sayı sonsuz — sabit bir liste birkaç turda ezberlenirdi.
 *
 * Şekil de aynı sayılardan kuruluyor (`sekil.ts`): ekrandaki yay gerçekten
 * yazan açı kadar. Böylece öğrenci şekli okuyarak da tahmin edebiliyor, ki
 * sınavda yaptığı da bu.
 */

export type AciKurali =
  | 'z'
  | 'u'
  | 'm'
  | 'ucgen'
  | 'disaci'
  | 'ikizkenar-taban'
  | 'ikizkenar-tepe'

export const TUM_ACI_KURALLARI: AciKurali[] = [
  'z',
  'u',
  'm',
  'ucgen',
  'disaci',
  'ikizkenar-taban',
  'ikizkenar-tepe',
]

export const ACI_KURALI_ADI: Record<AciKurali, string> = {
  z: 'Z kuralı',
  u: 'U kuralı',
  m: 'M kuralı',
  ucgen: 'İç açılar toplamı',
  disaci: 'Dış açı',
  'ikizkenar-taban': 'İkizkenar üçgen',
  'ikizkenar-tepe': 'İkizkenar üçgen',
}

/** Tur sonunda yanlışın altında çıkan kural. MEB kazanımlarının diliyle. */
export const ACI_ACIKLAMASI: Record<AciKurali, string> = {
  z: 'Paralel iki doğru bir kesenle kesildiğinde iç ters açılar eşittir.',
  u: 'Paralel iki doğruda kesenin aynı yanındaki iç açıların toplamı 180°dir.',
  m: 'Paralellerin arasındaki köşede oluşan açı, iki yandaki açıların toplamına eşittir.',
  ucgen: 'Bir üçgenin iç açıları toplamı 180°dir.',
  disaci: 'Bir dış açı, kendisine komşu olmayan iki iç açının toplamına eşittir.',
  'ikizkenar-taban': 'İkizkenar üçgende eş kenarların karşısındaki taban açıları eşittir.',
  'ikizkenar-tepe': 'İkizkenar üçgende taban açıları eşittir; üçünün toplamı 180°dir.',
}

/**
 * Bir soru: kural ve verilen açı(lar).
 *
 * Şekli taşımıyor — şekil bu üç sayıdan `aciSekli` ile her seferinde yeniden
 * kuruluyor. Sebebi Oyun Bankası: kayıt localStorage'a yazılıyor ve onlarca
 * koordinat taşıyan bir nesne kotayı boşa yerdi.
 */
export type AciSorusu = {
  kural: AciKurali
  /** Şekilde yazan birinci açı. */
  a: number
  /** İkinci açı; tek açı verilen kurallarda null. */
  b: number | null
  /** x'in değeri, derece. */
  cevap: number
}

/** Kuralın gerektirdiği hesap — soru kurulurken ve testte tek kaynak. */
export function aciCevabi(kural: AciKurali, a: number, b: number | null): number {
  switch (kural) {
    case 'z':
      return a
    case 'u':
      return 180 - a
    case 'm':
      return a + (b ?? 0)
    case 'ucgen':
      return 180 - a - (b ?? 0)
    case 'disaci':
      return a + (b ?? 0)
    case 'ikizkenar-taban':
      return (180 - a) / 2
    case 'ikizkenar-tepe':
      return 180 - 2 * a
  }
}

function soruKur(kural: AciKurali, a: number, b: number | null): AciSorusu {
  return { kural, a, b, cevap: aciCevabi(kural, a, b) }
}

// ---------------------------------------------------------------------------
// Şekiller
// ---------------------------------------------------------------------------

/** Paralel doğruların y'leri ve kenar boşluğu. */
const UST = 48
const ALT = 138
const KENAR = 14

/**
 * Paralel iki doğru ve bir kesen (Z ve U kuralları).
 *
 * Kesenin eğimi verilen açının kendisi: `a` = 40 ise çizgi gerçekten 40 derece
 * yatıyor. Kesişim noktaları tuvalin ortasına göre yerleştiriliyor, yoksa dar
 * açılarda çizgi tuvalden taşardı.
 */
function paralelSekli(kural: 'z' | 'u', a: number): Sekil {
  const derece = a * (Math.PI / 180)
  const boy = (ALT - UST) / Math.sin(derece)
  // Kesen yukarıdan aşağı inerken x'te kayıyor; dar açıda sola, geniş açıda sağa.
  const kayma = -boy * Math.cos(derece)

  const ustNokta: Nokta = { x: TUVAL_GENISLIK / 2 - kayma / 2, y: UST }
  const altNokta: Nokta = { x: ustNokta.x + kayma, y: ALT }

  const parcalar: SekilParcasi[] = [
    { tur: 'cizgi', bas: { x: KENAR, y: UST }, son: { x: TUVAL_GENISLIK - KENAR, y: UST } },
    { tur: 'cizgi', bas: { x: KENAR, y: ALT }, son: { x: TUVAL_GENISLIK - KENAR, y: ALT } },
    // Kesen kesişimlerin biraz ötesine taşıyor: ucu tam köşede biten bir çizgi
    // "burada bitiyor" gibi duruyordu.
    { tur: 'cizgi', bas: yonde(ustNokta, a, 34), son: yonde(altNokta, a + 180, 34) },
    ...paralelIsareti({ x: TUVAL_GENISLIK - 42, y: UST }),
    ...paralelIsareti({ x: TUVAL_GENISLIK - 42, y: ALT }),
    // Verilen açı: üstteki kesişimin sol altı.
    ...aciEtiketi(ustNokta, 180, 180 + a, `${a}°`),
  ]

  // Z'de aranan açı çaprazda (iç ters), U'da aynı yanda (yan yana iç açı).
  parcalar.push(
    ...(kural === 'z'
      ? aciEtiketi(altNokta, 0, a, 'x', true)
      : aciEtiketi(altNokta, a, 180, 'x', true)),
  )

  return { genislik: TUVAL_GENISLIK, yukseklik: TUVAL_YUKSEKLIK, parcalar }
}

/** M kuralı: paralellerin arasında bir köşe. */
function mSekli(a: number, b: number): Sekil {
  const kose: Nokta = { x: 74, y: 96 }
  const ustHedef = kose.y - UST
  const altHedef = ALT + 8 - kose.y

  const ustNokta = yonde(kose, a, ustHedef / Math.sin(a * (Math.PI / 180)))
  const altNokta = yonde(kose, -b, altHedef / Math.sin(b * (Math.PI / 180)))

  return {
    genislik: TUVAL_GENISLIK,
    yukseklik: TUVAL_YUKSEKLIK,
    parcalar: [
      { tur: 'cizgi', bas: { x: KENAR, y: UST }, son: { x: TUVAL_GENISLIK - KENAR, y: UST } },
      { tur: 'cizgi', bas: { x: KENAR, y: ALT + 8 }, son: { x: TUVAL_GENISLIK - KENAR, y: ALT + 8 } },
      { tur: 'cizgi', bas: ustNokta, son: kose },
      { tur: 'cizgi', bas: kose, son: altNokta },
      ...paralelIsareti({ x: TUVAL_GENISLIK - 34, y: UST }),
      ...paralelIsareti({ x: TUVAL_GENISLIK - 34, y: ALT + 8 }),
      ...aciEtiketi(ustNokta, 180, 180 + a, `${a}°`),
      ...aciEtiketi(altNokta, 180 - b, 180, `${b}°`),
      ...aciEtiketi(kose, -b, a, 'x', true),
    ],
  }
}

/**
 * Verilen iki açıdan üçgenin köşeleri.
 *
 * Önce birim tabanla matematiksel olarak kuruluyor, sonra tuvale sığacak kadar
 * ölçekleniyor: açıları doğru olan bir üçgeni doğrudan piksel cinsinden kurmaya
 * çalışmak, geniş açılı üçgenlerde tuvalden taşırdı.
 */
function ucgenNoktalari(
  alfa: number,
  beta: number,
  hedefGenislik: number,
  hedefYukseklik: number,
  merkezX: number,
): [Nokta, Nokta, Nokta] {
  const kenar = Math.sin(beta * (Math.PI / 180)) / Math.sin((alfa + beta) * (Math.PI / 180))
  const tepeX = kenar * Math.cos(alfa * (Math.PI / 180))
  const tepeY = kenar * Math.sin(alfa * (Math.PI / 180))

  const enSol = Math.min(0, tepeX)
  const enSag = Math.max(1, tepeX)
  const olcek = Math.min(hedefGenislik / (enSag - enSol), hedefYukseklik / tepeY)

  const solKenar = merkezX - ((enSag - enSol) * olcek) / 2
  const taban = (TUVAL_YUKSEKLIK + tepeY * olcek) / 2
  const cevir = (x: number, y: number): Nokta => ({
    x: solKenar + (x - enSol) * olcek,
    y: taban - y * olcek,
  })

  return [cevir(0, 0), cevir(1, 0), cevir(tepeX, tepeY)]
}

/** İç açılar toplamı: iki açı verili, tepe noktasındaki x aranıyor. */
function ucgenSekliIcAci(alfa: number, beta: number): Sekil {
  const [a, b, c] = ucgenNoktalari(alfa, beta, 200, 100, TUVAL_GENISLIK / 2)
  const tepe = koseYayi(c, a, b)

  return {
    genislik: TUVAL_GENISLIK,
    yukseklik: TUVAL_YUKSEKLIK,
    parcalar: [
      { tur: 'cizgi', bas: a, son: b },
      { tur: 'cizgi', bas: b, son: c },
      { tur: 'cizgi', bas: c, son: a },
      ...koseEtiketi(a, b, c, `${alfa}°`, false, 22),
      ...koseEtiketi(b, c, a, `${beta}°`, false, 22),
      ...koseEtiketi(c, a, b, 'x', true, 22),
    ],
  }
}

/** Dış açı: taban sağa uzatılıyor, x uzantıyla kenar arasındaki açı. */
function disAciSekli(alfa: number, gama: number): Sekil {
  const beta = 180 - alfa - gama
  const [a, b, c] = ucgenNoktalari(alfa, beta, 176, 96, 112)
  const uzanti: Nokta = { x: b.x + 46, y: b.y }
  const tepe = koseYayi(c, a, b)

  return {
    genislik: TUVAL_GENISLIK,
    yukseklik: TUVAL_YUKSEKLIK,
    parcalar: [
      { tur: 'cizgi', bas: a, son: b },
      { tur: 'cizgi', bas: b, son: c },
      { tur: 'cizgi', bas: c, son: a },
      { tur: 'cizgi', bas: b, son: uzanti, sonuk: true },
      ...koseEtiketi(a, b, c, `${alfa}°`, false, 22),
      ...koseEtiketi(c, a, b, `${gama}°`, false, 22),
      // Dış açı: uzantı ile kenar arasında, üçgenin dışında kalıyor.
      ...aciEtiketi(b, 0, 180 - beta, 'x', true, 22),
    ],
  }
}

/**
 * İkizkenar üçgen. Eş kenarlar çentikle gösteriliyor — onsuz "ikizkenar"
 * bilgisi şekilde hiçbir yerde yazmazdı ve soru çözülemezdi.
 */
function ikizkenarSekli(tabanAcisi: number, aranan: 'taban' | 'tepe'): Sekil {
  const [a, b, c] = ucgenNoktalari(tabanAcisi, tabanAcisi, 190, 104, TUVAL_GENISLIK / 2)
  const tepe = koseYayi(c, a, b)
  const tepeAcisi = 180 - 2 * tabanAcisi

  return {
    genislik: TUVAL_GENISLIK,
    yukseklik: TUVAL_YUKSEKLIK,
    parcalar: [
      { tur: 'cizgi', bas: a, son: b },
      { tur: 'cizgi', bas: b, son: c },
      { tur: 'cizgi', bas: c, son: a },
      kenarTiki(a, c),
      kenarTiki(b, c),
      ...(aranan === 'taban'
        ? [
            ...koseEtiketi(c, a, b, `${tepeAcisi}°`, false, 22),
            ...koseEtiketi(a, b, c, 'x', true, 22),
          ]
        : [
            ...koseEtiketi(a, b, c, `${tabanAcisi}°`, false, 22),
            ...koseEtiketi(c, a, b, 'x', true, 22),
          ]),
    ],
  }
}

/** Sorunun şekli. Saf: aynı soru her zaman aynı çizimi verir. */
export function aciSekli(soru: AciSorusu): Sekil {
  const { kural, a, b } = soru
  switch (kural) {
    case 'z':
    case 'u':
      return paralelSekli(kural, a)
    case 'm':
      return mSekli(a, b ?? 0)
    case 'ucgen':
      return ucgenSekliIcAci(a, b ?? 0)
    case 'disaci':
      return disAciSekli(a, b ?? 0)
    case 'ikizkenar-taban':
      return ikizkenarSekli(soru.cevap, 'taban')
    case 'ikizkenar-tepe':
      return ikizkenarSekli(a, 'tepe')
  }
}

// ---------------------------------------------------------------------------
// Üretim
// ---------------------------------------------------------------------------

/**
 * Üçgenin iki taban açısının toplayabileceği en büyük değer.
 *
 * Şekil ölçekli çizildiği için geometrik bir kısıt: ikisi de büyük olan bir
 * üçgen ince ve uzun oluyor, tuvalin yüksekliğine sığdırmak için de daralıyor.
 * 135°'de üçgen okunur kalıyor.
 */
const TABAN_TOPLAMI = 135

/** Beşin katı açılar, iki uç dahil. Sınavdaki şekiller de yuvarlak değerlerle kuruluyor. */
function besinKatlari(enAz: number, enCok: number): number[] {
  const liste: number[] = []
  for (let aci = enAz; aci <= enCok; aci += 5) liste.push(aci)
  return liste
}

/**
 * Bir kuralın üretebileceği **bütün** sorular.
 *
 * Üreteç eskiden açıyı yerinde rastgele seçiyordu; liste hâline getirilmesinin
 * sebebi test: şeklin okunur olduğu ancak bütün kombinasyonlar taranarak
 * doğrulanabiliyor. Rastgele örneklemeyle bozuk tek bir kombinasyon
 * (25°-25°-130° üçgeninde "x" tabanın üstüne biniyordu) aylarca gözden kaçtı ve
 * testi ara sıra kırılan bir teste çevirdi. Liste toplam birkaç yüz soru,
 * hepsini taramak milisaniye sürüyor.
 */
export function kuralinSorulari(kural: AciKurali): AciSorusu[] {
  switch (kural) {
    // Tam 90 alınmıyor: dik kesende Z ile U aynı sonucu verir, soru kuralı
    // ayırt etmez olurdu.
    case 'z':
      return besinKatlari(30, 150)
        .filter((a) => a !== 90)
        .map((a) => soruKur('z', a, null))
    case 'u':
      return besinKatlari(30, 150)
        .filter((a) => a !== 90)
        .map((a) => soruKur('u', a, null))
    case 'm':
      return besinKatlari(20, 70).flatMap((a) =>
        besinKatlari(20, 70).map((b) => soruKur('m', a, b)),
      )
    // İki taban açısının toplamı sınırlı: ikisi de büyük olduğunda üçgen uzayıp
    // inceliyor, tuvale sığması için de daralıyor ve açılar okunmaz oluyor.
    case 'ucgen':
      return besinKatlari(25, 105).flatMap((a) =>
        besinKatlari(25, Math.min(105, TABAN_TOPLAMI - a)).map((b) => soruKur('ucgen', a, b)),
      )
    // Dış açı şeklinde taban açıları alfa ile (180 − alfa − gama); aynı incelme
    // sınırı gamanın alt sınırına dönüşüyor.
    case 'disaci':
      return besinKatlari(25, 85).flatMap((a) =>
        besinKatlari(180 - TABAN_TOPLAMI, Math.min(95, 145 - a)).map((b) =>
          soruKur('disaci', a, b),
        ),
      )
    // Tepe açısı çift seçiliyor: taban açısı (180 − tepe) / 2 tam sayı çıksın
    // diye. Alt sınır yine incelme yüzünden: 20°lik tepe, tuvale sığmayacak
    // kadar dar bir üçgen demek.
    case 'ikizkenar-taban': {
      const tepeler: number[] = []
      for (let tepe = 50; tepe <= 120; tepe += 10) tepeler.push(tepe)
      return tepeler.map((tepe) => soruKur('ikizkenar-taban', tepe, null))
    }
    case 'ikizkenar-tepe':
      return besinKatlari(30, 65).map((a) => soruKur('ikizkenar-tepe', a, null))
  }
}

/** Kural başına hazır liste — her soruda yeniden kurulmasın. */
const KURAL_SORULARI: Record<AciKurali, AciSorusu[]> = Object.fromEntries(
  TUM_ACI_KURALLARI.map((kural) => [kural, kuralinSorulari(kural)]),
) as Record<AciKurali, AciSorusu[]>

/** Oyunun üretebileceği bütün sorular — testler bunun tamamını tarıyor. */
export const TUM_ACI_SORULARI: AciSorusu[] = TUM_ACI_KURALLARI.flatMap(
  (kural) => KURAL_SORULARI[kural],
)

/** Aynı sorunun kaç soru içinde tekrarlanmayacağı. */
const TEKRAR_PENCERESI = 10

/**
 * Bir turun soruları.
 *
 * Son `TEKRAR_PENCERESI` soruda görülen aynı kural+açı ikilisi yeniden
 * üretilmiyor: arka arkaya gelen aynı şekil hesap değil hatırlama olurdu.
 */
export function aciTuruHazirla(
  adet: number,
  rastgele: () => number = Math.random,
): AciSorusu[] {
  const sorular: AciSorusu[] = []
  const sonGorulen: string[] = []

  for (let deneme = 0; deneme < adet * 20 && sorular.length < adet; deneme++) {
    // Önce kural, sonra o kuralın soruları arasından biri: kurallar eşit
    // olasılıkla geliyor, yoksa çok kombinasyonlu üçgen ötekileri bastırırdı.
    const soru = sec(KURAL_SORULARI[sec(TUM_ACI_KURALLARI, rastgele)], rastgele)
    const kimlik = `${soru.kural}:${soru.a}:${soru.b ?? ''}`
    if (sonGorulen.includes(kimlik)) continue

    sorular.push(soru)
    sonGorulen.push(kimlik)
    if (sonGorulen.length > TEKRAR_PENCERESI) sonGorulen.shift()
  }

  return sorular
}
