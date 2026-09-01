/**
 * Periyodik Tablo Avı'nın element havuzu.
 *
 * Veri elle yazıldı ve **bilerek eksik**: tabloda 118 element var, burada 38
 * tane. Ölçüt tek — TYT'de karşılığı olan element. Havuz bir kez bütün tabloyu
 * taşıdı ve oyun oynanmaz hâle geldi: "Praseodim'i bul" diye bir soru, bilgiyi
 * değil sabrı ölçüyor ve öğrenci turu kapatıyordu. Eksik bir havuz, cevaplanan
 * bir soru demek.
 *
 * Tablonun **çizimi** yine tam: iskelet 18 grup × 7 periyot ve havuzda olmayan
 * hücreler boş kutu olarak duruyor. Konum bilgisi ancak gerçek tabloda
 * öğreniliyor — kırpılmış bir tabloda "Ca, K'nin sağında" demek başka bir
 * tablodan bahsetmek olurdu. Lantanit ve aktinit blokları çizime hiç girmiyor:
 * havuzda oradan tek element yok ve iki fazladan satır tabloyu telefonda
 * yarıya indiriyordu.
 *
 * Sembol, ad, grup ve periyot ölçüm; kimsenin verisi değil, kopyalanmış bir
 * kaynak yok.
 */

import type { Zorluk } from './ritim'

/**
 * Elementin ait olduğu sınıf.
 *
 * Yalnızca TYT'de adıyla anılan aileler var. `metal` bilerek bir "aile" değil
 * artçı bir etiket: Al, Sn ve Pb'yi kapsıyor ve bu üçü sınıf sorusuna hiç
 * girmiyor (`sinifSorulurMu`). Sebebi cevabın tekliği — kalsiyum hem toprak
 * alkali hem metaldir ve şıklarda ikisi birden dururken doğru cevap iki tane
 * olurdu.
 */
export type ElementSinifi =
  | 'alkali'
  | 'toprak-alkali'
  | 'halojen'
  | 'soy-gaz'
  | 'gecis'
  | 'ametal'
  | 'yari-metal'
  | 'metal'

export const SINIF_ADI: Record<ElementSinifi, string> = {
  alkali: 'Alkali metal',
  'toprak-alkali': 'Toprak alkali metal',
  halojen: 'Halojen',
  'soy-gaz': 'Soy gaz',
  gecis: 'Geçiş metali',
  ametal: 'Ametal',
  'yari-metal': 'Yarı metal',
  metal: 'Metal',
}

export type Element = {
  /** Atom numarası — tur sonu listesinde sembolün yanında duruyor. */
  numara: number
  sembol: string
  ad: string
  /** 1–18. Tablodaki sütun; çizim de çeldirici seçimi de buradan. */
  grup: number
  /** 1–7. Tablodaki satır. */
  periyot: number
  sinif: ElementSinifi
  zorluk: Zorluk
}

/** Tablonun iskeleti; ızgara bu ölçülerle kuruluyor. */
export const GRUP_SAYISI = 18

/**
 * Çizilen periyot sayısı — gerçek tabloda yedi var, burada altı.
 *
 * 7. periyottan havuza tek element girmiyor ve tümüyle boş bir satır tablonun
 * **şeklini** değil boşluğunu gösteriyor: kullanıcı orada okunacak bir şey
 * arıyor, bulamıyor. Boş hücrenin bilgi taşıdığı yer dolu satırların içi —
 * bor grubunun 2. periyotta başlaması gibi.
 */
export const PERIYOT_SAYISI = 6

/**
 * Bu grup–periyot kesişiminde gerçekten bir element var mı.
 *
 * İskelet bu kuraldan çiziliyor, elementlerin kendisinden değil: havuz eksik
 * ve boş bırakılan hücreler tablonun **şeklini** taşıyor. Bor grubunun 2.
 * periyotta başlaması, geçiş metallerinin 4. periyotta açılması — soru
 * sorulmayan hücreler de bunu anlatıyor.
 */
export function hucreVarMi(grup: number, periyot: number): boolean {
  if (periyot === 1) return grup === 1 || grup === GRUP_SAYISI
  // 2. ve 3. periyotta geçiş metali bloğu (3–12) henüz açılmıyor.
  if (periyot <= 3) return grup <= 2 || grup >= 13
  return true
}

/** `[numara, sembol, ad, grup, periyot, sinif, zorluk]` */
const HAM: [number, string, string, number, number, ElementSinifi, Zorluk][] = [
  [1, 'H', 'Hidrojen', 1, 1, 'ametal', 'kolay'],
  [2, 'He', 'Helyum', 18, 1, 'soy-gaz', 'kolay'],
  [3, 'Li', 'Lityum', 1, 2, 'alkali', 'kolay'],
  [4, 'Be', 'Berilyum', 2, 2, 'toprak-alkali', 'zor'],
  [5, 'B', 'Bor', 13, 2, 'yari-metal', 'orta'],
  [6, 'C', 'Karbon', 14, 2, 'ametal', 'kolay'],
  [7, 'N', 'Azot', 15, 2, 'ametal', 'kolay'],
  [8, 'O', 'Oksijen', 16, 2, 'ametal', 'kolay'],
  [9, 'F', 'Flor', 17, 2, 'halojen', 'orta'],
  [10, 'Ne', 'Neon', 18, 2, 'soy-gaz', 'orta'],
  [11, 'Na', 'Sodyum', 1, 3, 'alkali', 'kolay'],
  [12, 'Mg', 'Magnezyum', 2, 3, 'toprak-alkali', 'kolay'],
  [13, 'Al', 'Alüminyum', 13, 3, 'metal', 'kolay'],
  [14, 'Si', 'Silisyum', 14, 3, 'yari-metal', 'kolay'],
  [15, 'P', 'Fosfor', 15, 3, 'ametal', 'kolay'],
  [16, 'S', 'Kükürt', 16, 3, 'ametal', 'kolay'],
  [17, 'Cl', 'Klor', 17, 3, 'halojen', 'kolay'],
  [18, 'Ar', 'Argon', 18, 3, 'soy-gaz', 'orta'],
  [19, 'K', 'Potasyum', 1, 4, 'alkali', 'kolay'],
  [20, 'Ca', 'Kalsiyum', 2, 4, 'toprak-alkali', 'kolay'],
  [24, 'Cr', 'Krom', 6, 4, 'gecis', 'zor'],
  [25, 'Mn', 'Mangan', 7, 4, 'gecis', 'orta'],
  [26, 'Fe', 'Demir', 8, 4, 'gecis', 'kolay'],
  [27, 'Co', 'Kobalt', 9, 4, 'gecis', 'zor'],
  [28, 'Ni', 'Nikel', 10, 4, 'gecis', 'orta'],
  [29, 'Cu', 'Bakır', 11, 4, 'gecis', 'kolay'],
  [30, 'Zn', 'Çinko', 12, 4, 'gecis', 'kolay'],
  [35, 'Br', 'Brom', 17, 4, 'halojen', 'orta'],
  [36, 'Kr', 'Kripton', 18, 4, 'soy-gaz', 'zor'],
  [47, 'Ag', 'Gümüş', 11, 5, 'gecis', 'kolay'],
  [50, 'Sn', 'Kalay', 14, 5, 'metal', 'zor'],
  [53, 'I', 'İyot', 17, 5, 'halojen', 'orta'],
  [54, 'Xe', 'Ksenon', 18, 5, 'soy-gaz', 'zor'],
  [56, 'Ba', 'Baryum', 2, 6, 'toprak-alkali', 'zor'],
  [78, 'Pt', 'Platin', 10, 6, 'gecis', 'zor'],
  [79, 'Au', 'Altın', 11, 6, 'gecis', 'kolay'],
  [80, 'Hg', 'Cıva', 12, 6, 'gecis', 'orta'],
  [82, 'Pb', 'Kurşun', 14, 6, 'metal', 'orta'],
]

export const ELEMENTLER: Element[] = HAM.map(
  ([numara, sembol, ad, grup, periyot, sinif, zorluk]) => ({
    numara,
    sembol,
    ad,
    grup,
    periyot,
    sinif,
    zorluk,
  }),
)

/**
 * Bu elementin sınıfı sorulabilir mi.
 *
 * `metal` etiketi bir aile değil; sorulsaydı doğru cevabın yanında "Geçiş
 * metali" de duracak ve ikisi de metal olacaktı.
 */
export function sinifSorulurMu(element: Element): boolean {
  return element.sinif !== 'metal'
}
