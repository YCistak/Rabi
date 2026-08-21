import type { Zorluk } from './ritim'

/**
 * Periyodik tablo havuzu.
 *
 * İki liste var ve ikisi bilerek ayrı:
 *
 * - `ELEMENTLER`: 118 elementin tamamı. Tablo eksiksiz çiziliyor, çünkü oyunun
 *   asıl öğrettiği şey **konum**: 17 numaranın 3. periyodun sonunda, soy
 *   gazlardan hemen önce durduğunu görmek "Klor" cevabını ezberlemekten daha
 *   çok işe yarıyor. Yarım bir tablo bu çıkarımı bozardı.
 * - `SORU_HAVUZU`: bunlardan yalnızca TYT'de sorulanlar. Oganesson tabloda
 *   duruyor ama hiç sorulmuyor.
 *
 * Tabloda **sembol ve ad yazmıyor**, yalnızca atom numarası: yazsaydı oyunun
 * cevabı ekranda dururdu.
 */

export type ElementBolgesi =
  | 'alkali'
  | 'toprak-alkali'
  | 'gecis'
  | 'lantanit'
  | 'aktinit'
  | 'zayif-metal'
  | 'yari-metal'
  | 'ametal'
  | 'halojen'
  | 'soy-gaz'

export const BOLGE_ADI: Record<ElementBolgesi, string> = {
  alkali: 'Alkali metal',
  'toprak-alkali': 'Toprak alkali',
  gecis: 'Geçiş metali',
  lantanit: 'Lantanit',
  aktinit: 'Aktinit',
  'zayif-metal': 'Zayıf metal',
  'yari-metal': 'Yarı metal',
  ametal: 'Ametal',
  halojen: 'Halojen',
  'soy-gaz': 'Soy gaz',
}

/** Açıklama şeridindeki bölge sırası — tabloda soldan sağa gidişi izliyor. */
export const BOLGELER: readonly ElementBolgesi[] = [
  'alkali',
  'toprak-alkali',
  'gecis',
  'zayif-metal',
  'yari-metal',
  'ametal',
  'halojen',
  'soy-gaz',
  'lantanit',
  'aktinit',
]

export type Element = {
  /** Atom numarası; aynı zamanda kimlik. */
  numara: number
  sembol: string
  ad: string
  bolge: ElementBolgesi
}

/**
 * Sembol ve Türkçe ad, atom numarası sırasıyla.
 *
 * Bölge burada yazmıyor, `bolgeBul()` hesaplıyor: 118 satırın her birine elle
 * bölge yazmak, bir satırı yanlış yazmanın 118 fırsatı demekti.
 */
const ADLAR: readonly [sembol: string, ad: string][] = [
  ['H', 'Hidrojen'],
  ['He', 'Helyum'],
  ['Li', 'Lityum'],
  ['Be', 'Berilyum'],
  ['B', 'Bor'],
  ['C', 'Karbon'],
  ['N', 'Azot'],
  ['O', 'Oksijen'],
  ['F', 'Flor'],
  ['Ne', 'Neon'],
  ['Na', 'Sodyum'],
  ['Mg', 'Magnezyum'],
  ['Al', 'Alüminyum'],
  ['Si', 'Silisyum'],
  ['P', 'Fosfor'],
  ['S', 'Kükürt'],
  ['Cl', 'Klor'],
  ['Ar', 'Argon'],
  ['K', 'Potasyum'],
  ['Ca', 'Kalsiyum'],
  ['Sc', 'Skandiyum'],
  ['Ti', 'Titanyum'],
  ['V', 'Vanadyum'],
  ['Cr', 'Krom'],
  ['Mn', 'Mangan'],
  ['Fe', 'Demir'],
  ['Co', 'Kobalt'],
  ['Ni', 'Nikel'],
  ['Cu', 'Bakır'],
  ['Zn', 'Çinko'],
  ['Ga', 'Galyum'],
  ['Ge', 'Germanyum'],
  ['As', 'Arsenik'],
  ['Se', 'Selenyum'],
  ['Br', 'Brom'],
  ['Kr', 'Kripton'],
  ['Rb', 'Rubidyum'],
  ['Sr', 'Stronsiyum'],
  ['Y', 'İtriyum'],
  ['Zr', 'Zirkonyum'],
  ['Nb', 'Niyobyum'],
  ['Mo', 'Molibden'],
  ['Tc', 'Teknesyum'],
  ['Ru', 'Rutenyum'],
  ['Rh', 'Rodyum'],
  ['Pd', 'Paladyum'],
  ['Ag', 'Gümüş'],
  ['Cd', 'Kadmiyum'],
  ['In', 'İndiyum'],
  ['Sn', 'Kalay'],
  ['Sb', 'Antimon'],
  ['Te', 'Tellür'],
  ['I', 'İyot'],
  ['Xe', 'Ksenon'],
  ['Cs', 'Sezyum'],
  ['Ba', 'Baryum'],
  ['La', 'Lantan'],
  ['Ce', 'Seryum'],
  ['Pr', 'Praseodim'],
  ['Nd', 'Neodim'],
  ['Pm', 'Prometyum'],
  ['Sm', 'Samaryum'],
  ['Eu', 'Evropiyum'],
  ['Gd', 'Gadolinyum'],
  ['Tb', 'Terbiyum'],
  ['Dy', 'Disprosyum'],
  ['Ho', 'Holmiyum'],
  ['Er', 'Erbiyum'],
  ['Tm', 'Tulyum'],
  ['Yb', 'İterbiyum'],
  ['Lu', 'Lutesyum'],
  ['Hf', 'Hafniyum'],
  ['Ta', 'Tantal'],
  ['W', 'Volfram'],
  ['Re', 'Renyum'],
  ['Os', 'Osmiyum'],
  ['Ir', 'İridyum'],
  ['Pt', 'Platin'],
  ['Au', 'Altın'],
  ['Hg', 'Cıva'],
  ['Tl', 'Talyum'],
  ['Pb', 'Kurşun'],
  ['Bi', 'Bizmut'],
  ['Po', 'Polonyum'],
  ['At', 'Astatin'],
  ['Rn', 'Radon'],
  ['Fr', 'Fransiyum'],
  ['Ra', 'Radyum'],
  ['Ac', 'Aktinyum'],
  ['Th', 'Toryum'],
  ['Pa', 'Protaktinyum'],
  ['U', 'Uranyum'],
  ['Np', 'Neptünyum'],
  ['Pu', 'Plütonyum'],
  ['Am', 'Amerikyum'],
  ['Cm', 'Küriyum'],
  ['Bk', 'Berkelyum'],
  ['Cf', 'Kaliforniyum'],
  ['Es', 'Aynştaynyum'],
  ['Fm', 'Fermiyum'],
  ['Md', 'Mendelevyum'],
  ['No', 'Nobelyum'],
  ['Lr', 'Lavrensiyum'],
  ['Rf', 'Rutherfordyum'],
  ['Db', 'Dubniyum'],
  ['Sg', 'Seaborgiyum'],
  ['Bh', 'Bohriyum'],
  ['Hs', 'Hassiyum'],
  ['Mt', 'Meitneryum'],
  ['Ds', 'Darmstadtiyum'],
  ['Rg', 'Röntgenyum'],
  ['Cn', 'Kopernikyum'],
  ['Nh', 'Nihonyum'],
  ['Fl', 'Flerovyum'],
  ['Mc', 'Moskovyum'],
  ['Lv', 'Livermoryum'],
  ['Ts', 'Tennessin'],
  ['Og', 'Oganesson'],
]

const ALKALILER = [3, 11, 19, 37, 55, 87]
const TOPRAK_ALKALILER = [4, 12, 20, 38, 56, 88]
/** B, Si, Ge, As, Sb, Te — MEB kimya kitabının yarı metal listesi. */
const YARI_METALLER = [5, 14, 32, 33, 51, 52]
const AMETALLER = [1, 6, 7, 8, 15, 16, 34]
const HALOJENLER = [9, 17, 35, 53, 85, 117]
const SOY_GAZLAR = [2, 10, 18, 36, 54, 86, 118]

/** d bloku: 3B–2B sütunları, dört periyot. */
function gecisMi(numara: number): boolean {
  return (
    (numara >= 21 && numara <= 30) ||
    (numara >= 39 && numara <= 48) ||
    (numara >= 72 && numara <= 80) ||
    (numara >= 104 && numara <= 112)
  )
}

/**
 * Elementin bölgesi.
 *
 * Denetim sırası önemli: hidrojen 1A sütununda durur ama **alkali metal
 * değildir**, ametaldir — o yüzden ametal denetimi alkaliden önce geliyor.
 * Astatin de 7A'da bir yarı metal sayılabiliyor; burada halojen kabul edildi,
 * çünkü tabloda okunması istenen şey grubu.
 */
function bolgeBul(numara: number): ElementBolgesi {
  if (SOY_GAZLAR.includes(numara)) return 'soy-gaz'
  if (HALOJENLER.includes(numara)) return 'halojen'
  if (AMETALLER.includes(numara)) return 'ametal'
  if (YARI_METALLER.includes(numara)) return 'yari-metal'
  if (numara >= 57 && numara <= 71) return 'lantanit'
  if (numara >= 89 && numara <= 103) return 'aktinit'
  if (ALKALILER.includes(numara)) return 'alkali'
  if (TOPRAK_ALKALILER.includes(numara)) return 'toprak-alkali'
  if (gecisMi(numara)) return 'gecis'
  // Geriye kalan metaller: Al, Ga, In, Sn, Tl, Pb, Bi, Po ve 113–116.
  return 'zayif-metal'
}

export const ELEMENTLER: readonly Element[] = ADLAR.map(([sembol, ad], sira) => ({
  numara: sira + 1,
  sembol,
  ad,
  bolge: bolgeBul(sira + 1),
}))

/** Tabloda kaç element var — yedek doğrulaması sınırı buradan okuyor. */
export const ELEMENT_SAYISI = ELEMENTLER.length

export function elementBul(numara: number): Element | undefined {
  return ELEMENTLER[numara - 1]
}

// ---------------------------------------------------------------------------
// Tablo yerleşimi
// ---------------------------------------------------------------------------

export const SUTUN_SAYISI = 18

/**
 * Satır sayısı yedi değil on.
 *
 * Yedi periyot, bir boşluk satırı, sonra lantanit ve aktinit sıraları. f bloku
 * ana gövdenin içine konsaydı tablo 32 sütun olurdu ve telefonda her hücre bir
 * piksele düşerdi; bu ayrık gösterim ders kitaplarının da kullandığı biçim.
 */
export const SATIR_SAYISI = 10

export const LANTANIT_SATIRI = 9
export const AKTINIT_SATIRI = 10

export type TabloKonumu = { sutun: number; satir: number }

/**
 * Elementin tablodaki yeri — 1'den başlayan sütun ve satır.
 *
 * Koordinatlar elle yazılmadı, atom numarasından hesaplanıyor: 118 satırlık
 * bir koordinat listesinde tek bir yanlış sayı tabloyu sessizce bozardı.
 */
export function tabloKonumu(numara: number): TabloKonumu {
  if (numara === 1) return { sutun: 1, satir: 1 }
  if (numara === 2) return { sutun: SUTUN_SAYISI, satir: 1 }
  // 2. ve 3. periyotta d bloku yok: 2A'dan sonra doğrudan 3A'ya atlanıyor.
  if (numara <= 4) return { sutun: numara - 2, satir: 2 }
  if (numara <= 10) return { sutun: numara + 8, satir: 2 }
  if (numara <= 12) return { sutun: numara - 10, satir: 3 }
  if (numara <= 18) return { sutun: numara, satir: 3 }
  if (numara <= 36) return { sutun: numara - 18, satir: 4 }
  if (numara <= 54) return { sutun: numara - 36, satir: 5 }
  if (numara <= 56) return { sutun: numara - 54, satir: 6 }
  if (numara <= 71) return { sutun: numara - 54, satir: LANTANIT_SATIRI }
  if (numara <= 86) return { sutun: numara - 68, satir: 6 }
  if (numara <= 88) return { sutun: numara - 86, satir: 7 }
  if (numara <= 103) return { sutun: numara - 86, satir: AKTINIT_SATIRI }
  return { sutun: numara - 100, satir: 7 }
}

/** Elementin periyodu — f bloku ayrı satırda duruyor ama 6 ve 7'ye ait. */
export function periyot(numara: number): number {
  if (numara >= 57 && numara <= 71) return 6
  if (numara >= 89 && numara <= 103) return 7
  return tabloKonumu(numara).satir
}

/**
 * Sütunun grup adı — Türkçe kaynakların A/B gösterimiyle.
 *
 * Lantanit ve aktinitler 3B sayılıyor; ders düzeyinde bu sütunlara ayrı grup
 * adı verilmiyor.
 */
export function grupAdi(numara: number): string {
  if ((numara >= 57 && numara <= 71) || (numara >= 89 && numara <= 103)) return '3B'
  const { sutun } = tabloKonumu(numara)
  if (sutun <= 2) return `${sutun}A`
  if (sutun >= 13) return `${sutun - 10}A`
  if (sutun >= 8 && sutun <= 10) return '8B'
  if (sutun === 11) return '1B'
  if (sutun === 12) return '2B'
  // Geriye 3–7. sütunlar kalıyor; onlarda grup numarası sütunla aynı.
  return `${sutun}B`
}

/** "3. periyot · 7A grubu" — cevaptan sonra gösterilen konum satırı. */
export function konumMetni(numara: number): string {
  return `${periyot(numara)}. periyot · ${grupAdi(numara)} grubu`
}

// ---------------------------------------------------------------------------
// Sorulan elementler
// ---------------------------------------------------------------------------

/**
 * "İlk 20 element" sınırı.
 *
 * Müfredatın ezberlenmesini istediği aralık bu ve oyunun soru biçimi de burada
 * değişiyor: ilk 20'de yalnızca atom numarası verilip **adı**, doğru bilinirse
 * hemen ardından **sembolü** soruluyor; sonrasında ad da verilip yalnızca
 * sembol soruluyor. Sebebi gerçekçilik: kimse 47'nin gümüş olduğunu
 * ezberlemez, ama gümüşün sembolünün Ag olduğunu bilmek gerekir.
 */
export const ILK_YIRMI = 20

export type SorulanElement = Element & { zorluk: Zorluk }

/**
 * TYT'de sorulan elementler.
 *
 * Liste bilerek dar: TYT Kimya'nın element geçen konularında (periyodik
 * sistem, atomun yapısı, bileşikler ve adlandırma, karışımlar, asit-baz)
 * gerçekten dönüp duran elementler bunlar. 118'in tamamı sorulsaydı oyun
 * sınavın ölçtüğü şeyi değil, ezber gücünü ölçerdi.
 *
 * Seviyeler:
 * - **kolay**: ilk 20 elementin tamamı. Müfredat bu aralığın hepsini istiyor
 *   ve iki aşamalı soru biçimi de buraya ait.
 * - **orta**: ilk 20'nin dışında kalıp sembolü Türkçe adından okunabilenler —
 *   Brom Br, Nikel Ni, Platin Pt, Uranyum U.
 * - **zor**: sembolü **Latince** adından gelenler. Demir Fe (ferrum), Bakır Cu
 *   (cuprum), Gümüş Ag (argentum), Kalay Sn (stannum), Altın Au (aurum), Cıva
 *   Hg (hydrargyrum), Kurşun Pb (plumbum). Türkçe adına bakarak bulunamayan
 *   tek küme bu; oyunun asıl öğrettiği yer de burası.
 *
 * Havuz on soruluk boss aralığından kısa olduğu için tur içinde elementler
 * tekrar geliyor. Tekrar eden soruda şıkların yeri değişiyor
 * (`sik-dizilimi.ts`) — yoksa ikinci gösterimde soru değil konum
 * hatırlanırdı.
 */
const SORULANLAR: readonly [numara: number, zorluk: Zorluk][] = [
  [1, 'kolay'],
  [2, 'kolay'],
  [3, 'kolay'],
  [4, 'kolay'],
  [5, 'kolay'],
  [6, 'kolay'],
  [7, 'kolay'],
  [8, 'kolay'],
  [9, 'kolay'],
  [10, 'kolay'],
  [11, 'kolay'],
  [12, 'kolay'],
  [13, 'kolay'],
  [14, 'kolay'],
  [15, 'kolay'],
  [16, 'kolay'],
  [17, 'kolay'],
  [18, 'kolay'],
  [19, 'kolay'],
  [20, 'kolay'],
  [24, 'orta'],
  [26, 'zor'],
  [28, 'orta'],
  [29, 'zor'],
  [30, 'orta'],
  [35, 'orta'],
  [47, 'zor'],
  [50, 'zor'],
  [53, 'orta'],
  [78, 'orta'],
  [79, 'zor'],
  [80, 'zor'],
  [82, 'zor'],
  [88, 'orta'],
  [92, 'orta'],
]

export const SORU_HAVUZU: readonly SorulanElement[] = SORULANLAR.map(([numara, zorluk]) => {
  const element = elementBul(numara)
  // Numaralar elle yazılıyor; tablonun dışına taşan bir satır sessiz bir
  // `undefined` yerine burada patlasın.
  if (!element) throw new Error(`Tabloda olmayan element: ${numara}`)
  return { ...element, zorluk }
})

export const PERIYODIK_BOYUTU = SORU_HAVUZU.length

/** Sorulan elementler arasından atom numarasıyla arama — banka kayıtları için. */
export function sorulanBul(numara: number): SorulanElement | undefined {
  return SORU_HAVUZU.find((e) => e.numara === numara)
}
