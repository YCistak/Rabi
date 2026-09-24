/**
 * Yapılacaklar — günün görevleri, üç zaman dilimine bölünmüş.
 *
 * ## Tahta neden listeye döndü
 *
 * Buradaki şey bir süre **tahtaydı**: not kâğıtları istenen yere sürükleniyor,
 * konum da kullanıcının verdiği bilgi sayılıyordu ("bunlar okul, şunlar ev").
 * Fikir kâğıt üstünde iyiydi, telefonda değil — 390 piksellik bir tahtada on
 * kâğıt, okunmak için yerleştirilmesi gereken on kâğıt demek ve kullanıcı
 * yapılacak işini yazmak yerine tahtayı düzenliyordu. Üstelik gruplama
 * konumdan okunmuyordu: iki kâğıdın yan yana durması ancak onu koyan kişiye
 * bir şey söylüyor, ertesi gün ona da söylemiyor.
 *
 * Yeni tasarım gruplamayı konuma değil **zamana** bağlıyor: sabah, öğle,
 * akşam. Bu, günün kendisinde gerçekten var olan tek sıra — "akşam etüt" ile
 * "sabah 40 soru" arasındaki fark keyfî bir yerleşim değil. `x`/`y` alanları
 * bu yüzden kalktı; eski kayıtlar taşınırken konumları atılıyor (`normalize`).
 *
 * ## Hafta neden duruyor, ay neden durmuyor
 *
 * Tahta **günlükti**: gün dönünce kâğıtlar siliniyordu, gerekçe de "dün
 * yazdığını bugün de gören kullanıcı biriken ve hiç bitmeyen bir listeye
 * bakıyor" idi. Gerekçe hâlâ geçerli, ama tasarım hafta şeridiyle geliyor:
 * kullanıcı haftanın günlerine bakıyor ve ileriye plan yazabiliyor, yani
 * "bugün" tek başına yetmiyor.
 *
 * Kayıt bu yüzden **haftalık**: içinde bulunulan haftanın pazartesisinden
 * eskisi eleniyor (`haftaninGorevleri`). Hafta şeridi zaten o haftayı
 * gösteriyor, daha eskisine ulaşan bir yol yok; tutulsaydı görünmeyen bir
 * birikim olurdu. Her pazartesi liste sıfırlanıyor — bitmemiş işler de
 * gidiyor, tıpkı eskiden her gece gittikleri gibi, yalnızca daha yavaş.
 *
 * Geçmiş günler **salt okunur** (ekran tarafında): dün yapılmamış işi bugün
 * işaretlemek geçmişi düzeltmek olur, o iş yapılmadı. Erteleme varken buna
 * gerek de yok.
 */

import { gunKaydir } from './utils'

/** Günün üç dilimi. Sıra anlamlı: ekran da bu sırayla çiziyor. */
export type GorevDilimi = 'sabah' | 'ogle' | 'aksam'

export const DILIMLER: readonly GorevDilimi[] = ['sabah', 'ogle', 'aksam']

export const DILIM_ADI: Record<GorevDilimi, string> = {
  sabah: 'Sabah',
  ogle: 'Öğle',
  aksam: 'Akşam',
}

/**
 * Görevin türü.
 *
 * Beş tane ve uygulamanın kendi işlerine göre seçildi: dört tanesi bu
 * uygulamada karşılığı olan çalışma biçimleri, beşincisi geri kalan her şey.
 * Ders listesi (`lib/dersler.ts`) kullanılmadı — bir görev "Kimya" değil
 * "Kimya tekrarı" oluyor ve on beş dersli bir seçim, tek satırlık bir işi
 * yazmanın önüne on beş çipli bir ekran koyardı.
 */
export type GorevKategorisi = 'deneme' | 'soru' | 'tekrar' | 'odev' | 'diger'

export const KATEGORILER: readonly GorevKategorisi[] = [
  'deneme',
  'soru',
  'tekrar',
  'odev',
  'diger',
]

export const KATEGORI_ADI: Record<GorevKategorisi, string> = {
  deneme: 'Deneme',
  soru: 'Soru',
  tekrar: 'Tekrar',
  odev: 'Ödev',
  diger: 'Diğer',
}

/**
 * Görev mürekkebi.
 *
 * Kimlik, renk değil: değerler `--gorev-*` değişkenlerinde (`globals.css`),
 * kayıtta yalnızca adı duruyor. Palet değişirse eski görevler de yeni tonu
 * alıyor — kayda hex yazılsaydı uygulama iki paletle birden yaşardı.
 */
export type GorevRengi =
  | 'turuncu'
  | 'kirmizi'
  | 'gul'
  | 'mor'
  | 'lacivert'
  | 'mavi'
  | 'deniz'
  | 'yesil'
  | 'zeytin'
  | 'hardal'
  | 'kahve'
  | 'gri'

/** Renk seçicideki sıra ve adlar. On iki ton, altılı iki satır. */
export const GOREV_RENKLERI: readonly { id: GorevRengi; ad: string }[] = [
  { id: 'turuncu', ad: 'Turuncu' },
  { id: 'kirmizi', ad: 'Kırmızı' },
  { id: 'gul', ad: 'Gül' },
  { id: 'mor', ad: 'Mor' },
  { id: 'lacivert', ad: 'Lacivert' },
  { id: 'mavi', ad: 'Mavi' },
  { id: 'deniz', ad: 'Deniz' },
  { id: 'yesil', ad: 'Yeşil' },
  { id: 'zeytin', ad: 'Zeytin' },
  { id: 'hardal', ad: 'Hardal' },
  { id: 'kahve', ad: 'Kahve' },
  { id: 'gri', ad: 'Gri' },
]

const RENK_KIMLIKLERI: readonly string[] = GOREV_RENKLERI.map((r) => r.id)

/** Rengin CSS karşılığı. Sınıf değil değişken: Tailwind dinamik ad üretemiyor. */
export function gorevRengi(renk: GorevRengi): string {
  return `var(--gorev-${renk})`
}

export type Gorev = {
  id: string
  /** Tek satıra sığan iş adı; en çok `EN_UZUN_GOREV` karakter. */
  metin: string
  /**
   * Görevin günü ('YYYY-AA-GG', **yerel** saat).
   *
   * ISO damgası değil yerel gün: "bugün" kullanıcının takvimindeki gün ve
   * `toISOString` UTC'ye kaydırdığı için gece yarısına yakın yazılan görev
   * daha yazıldığı anda dünün görevi sayılırdı.
   */
  gun: string
  dilim: GorevDilimi
  kategori: GorevKategorisi
  renk: GorevRengi
  /**
   * Ortalama kaç dakika süreceği — kullanıcının tahmini.
   *
   * `null` yalnızca alan gelmeden önce yazılmış eski görevlerde: onlara bir
   * süre uydurmak, dilimin toplamını kullanıcının hiç söylemediği bir sayıyla
   * şişirirdi. Yeni görev süresiz kaydedilemiyor.
   */
  sure: number | null
  bitti: boolean
  /** Öncelikli — dilimin içinde yıldızlılar üstte duruyor. */
  yildiz: boolean
}

/**
 * Ekleme sayfasındaki süre seçenekleri, dakika.
 *
 * Serbest sayı kutusu değil çip: sorulan şey bir tahmin ve "37 dakika"
 * kimsenin vereceği bir cevap değil. Çip dokunuşla seçiliyor, sayı klavyesi
 * açılmıyor. İki saatin üstü tek bir görev değil — bölünmesi gereken bir iş.
 */
export const SURE_SECENEKLERI: readonly number[] = [15, 30, 45, 60, 90, 120]

/** Kayıtta kabul edilen en uzun süre; kurcalanmış kayıt günü aşamasın. */
const EN_UZUN_SURE = 24 * 60

/** "45 dk", "1 sa", "1 sa 30 dk". */
export function sureYaz(dakika: number): string {
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  if (saat === 0) return `${kalan} dk`
  return kalan === 0 ? `${saat} sa` : `${saat} sa ${kalan} dk`
}

/**
 * Bitmemiş görevlerin toplam süresi — dilim başlığındaki sayı.
 *
 * Biten görev düşüyor: sayı "bu dilimde daha ne kadar işim var" diyor.
 * Süresi olmayan eski görevler sayılmıyor, tahmin edilmiyor.
 */
export function kalanSure(gorevler: readonly Gorev[]): number {
  return gorevler.reduce((t, g) => (g.bitti || g.sure === null ? t : t + g.sure), 0)
}

/**
 * Bir dilime bir günde girilebilecek en fazla görev.
 *
 * Sınır **dilim başına**, gün başına değil: on işi sabaha yığmak da bir plan
 * değil, bir istek listesi. Üç dilim çarpı on, bir güne otuz iş demek ki o da
 * kimsenin yapacağı bir gün değil — ama sınırı günde ona indirmek üç dilimi
 * anlamsızlaştırırdı, çünkü sabahı dolduran akşama hiç yazamazdı.
 */
export const EN_COK_GOREV = 10

/**
 * Bir görev adının en fazla karakteri.
 *
 * Görev satırı **tek satır**: solda tik yuvarlağı, sağda yıldız ve erteleme
 * düğmeleri var, metne kalan yer 375 piksellik telefonda ~198 piksel (satırın
 * kendisinden ölçüldü, göz kararı değil). Nunito 700/14,5'te Türkçe küçük
 * harfli metin karakter başına ~7,4 piksel tutuyor; yirmi dört karakter o
 * yere sığan son uzunluk.
 *
 * Satır ayrıca taşmaya karşı kırpılıyor (`truncate`): büyük harfle yazılan
 * bir görev karakter başına ~9,6 piksel tutuyor ve sınır tek başına yetmezdi.
 * Sınırı büyütmek isteyen önce satırdaki düğmelere yer bulmalı — ikisi
 * birlikte değişen bir çift, ayrı ayrı değil.
 */
export const EN_UZUN_GOREV = 24

/** Görev adını sınıra indirir ve baştaki/sondaki boşluğu atar. */
export function metniKirp(metin: string): string {
  return metin.trim().slice(0, EN_UZUN_GOREV)
}

/**
 * Saate göre içinde bulunulan dilim.
 *
 * Saat dışarıdan alınıyor: `new Date()` okuyan bir mantık test edilemezdi.
 * Eşikler kaba ama kullanıcının günü de kaba — 12'ye kadar sabah, 17'ye kadar
 * öğle, sonrası akşam.
 */
export function simdikiDilim(saat: number): GorevDilimi {
  if (saat < 12) return 'sabah'
  if (saat < 17) return 'ogle'
  return 'aksam'
}

/**
 * Kayıttan okunan listeyi güncel şemaya uydurur.
 *
 * Üç iş birden yapıyor: `localStorage` elle kurcalanabildiği için bozuk
 * kayıtları eliyor, **eski tahta kayıtlarını** taşıyor ve dilim sınırını
 * uyguluyor.
 *
 * Eski kâğıtta dilim ile kategori yok; konumdan dilim çıkarılamıyor (tahtanın
 * üstü sabah demek değildi), o yüzden hepsi sabaha ve "Diğer"e düşüyor. Uzun
 * metin de sınıra kırpılıyor: yeni satır tek satır ve kırpılmamış metnin
 * görünmeyen kısmına ulaşmanın yolu olmazdı.
 *
 * Sınırı aşan görevler de burada eleniyor. `gorevEkle` zaten engelliyor ama
 * kayıt elle kurcalanabiliyor ve eski bir yedek başka bir sınırla yazılmış
 * olabiliyor; elenmeselerdi ekran "11/10" gibi kendi kuralını çiğneyen bir
 * sayı gösterirdi. Fazlalık **sondan** düşüyor: ilk yazılanlar kalıyor.
 */
export function gorevleriNormalize(ham: unknown): Gorev[] {
  if (!Array.isArray(ham)) return []
  const gorevler: Gorev[] = []
  /** Gün + dilim başına kaç görev yazıldı — sınır burada tutuluyor. */
  const sayac = new Map<string, number>()
  for (const kayit of ham) {
    if (typeof kayit !== 'object' || kayit === null) continue
    const g = kayit as Partial<Gorev>
    if (typeof g.id !== 'string' || g.id === '') continue
    // Günü olmayan kayıt hiçbir güne ait değil; haftalık eleme onu atıyor.
    if (typeof g.gun !== 'string') continue

    const dilim = DILIMLER.includes(g.dilim as GorevDilimi) ? (g.dilim as GorevDilimi) : 'sabah'
    const anahtar = `${g.gun}|${dilim}`
    const yazilan = sayac.get(anahtar) ?? 0
    if (yazilan >= EN_COK_GOREV) continue
    sayac.set(anahtar, yazilan + 1)

    gorevler.push({
      id: g.id,
      metin: typeof g.metin === 'string' ? metniKirp(g.metin) : '',
      gun: g.gun,
      dilim,
      kategori: KATEGORILER.includes(g.kategori as GorevKategorisi)
        ? (g.kategori as GorevKategorisi)
        : 'diger',
      renk: RENK_KIMLIKLERI.includes(g.renk as string) ? (g.renk as GorevRengi) : 'turuncu',
      sure:
        typeof g.sure === 'number' && Number.isFinite(g.sure) && g.sure > 0
          ? Math.min(Math.round(g.sure), EN_UZUN_SURE)
          : null,
      bitti: g.bitti === true,
      yildiz: g.yildiz === true,
    })
  }
  return gorevler
}

/**
 * Listeyi içinde bulunulan haftaya indirger.
 *
 * `haftaBasi` dışarıdan geliyor (bkz. `lib/utils.ts`): takvim saatine bakan
 * bir mantık test edilemez ve gece yarısını beklemek gerekirdi. İleri günler
 * elenmiyor — pazar günü ertelenen iş gelecek pazartesiye düşüyor ve o iş
 * kullanıcının kendi kararı.
 */
export function haftaninGorevleri(
  gorevler: readonly Gorev[],
  haftaBasiIso: string,
): Gorev[] {
  return gorevler.filter((g) => g.gun >= haftaBasiIso)
}

/** Bir günün görevleri. */
export function gununGorevleri(gorevler: readonly Gorev[], gun: string): Gorev[] {
  return gorevler.filter((g) => g.gun === gun)
}

/**
 * Bir günün bir dilimindeki görevler — yıldızlılar üstte.
 *
 * Biten görev yerinde kalıyor, sona atılmıyor: liste kullanıcının yazdığı
 * sırayı koruyor ve bir işi bitirmek ötekilerin yerini oynatmıyor. Sıralama
 * kararlı (`sort` modern JS'te kararlı), yani yıldızsızlar arasında eklenme
 * sırası bozulmuyor.
 */
export function dilimGorevleri(
  gorevler: readonly Gorev[],
  gun: string,
  dilim: GorevDilimi,
): Gorev[] {
  return gorevler
    .filter((g) => g.gun === gun && g.dilim === dilim)
    .sort((a, b) => Number(b.yildiz) - Number(a.yildiz))
}

/** O gün o dilimde yer kaldı mı. */
export function dilimeYerVarMi(
  gorevler: readonly Gorev[],
  gun: string,
  dilim: GorevDilimi,
): boolean {
  return gorevler.filter((g) => g.gun === gun && g.dilim === dilim).length < EN_COK_GOREV
}

/**
 * Yeni görev.
 *
 * Dilim doluysa ya da metin boşsa `null`: çağıran taraf "olmadı" durumunu tek
 * yerden okusun, sessizce en eski görev silinmesin. Görev silmek kullanıcının
 * kararı.
 */
export function gorevEkle(
  gorevler: readonly Gorev[],
  yeni: Omit<Gorev, 'bitti' | 'yildiz'>,
): Gorev[] | null {
  const metin = metniKirp(yeni.metin)
  if (metin === '') return null
  if (!dilimeYerVarMi(gorevler, yeni.gun, yeni.dilim)) return null
  return [...gorevler, { ...yeni, metin, bitti: false, yildiz: false }]
}

export function gorevSil(gorevler: readonly Gorev[], id: string): Gorev[] {
  return gorevler.filter((g) => g.id !== id)
}

/** Tek görevi günceller; kimlik tutmuyorsa liste olduğu gibi dönüyor. */
function gorevDegistir(
  gorevler: readonly Gorev[],
  id: string,
  degisiklik: (gorev: Gorev) => Gorev,
): Gorev[] {
  return gorevler.map((g) => (g.id === id ? degisiklik(g) : g))
}

export function gorevIsaretle(gorevler: readonly Gorev[], id: string): Gorev[] {
  return gorevDegistir(gorevler, id, (g) => ({ ...g, bitti: !g.bitti }))
}

export function gorevYildizla(gorevler: readonly Gorev[], id: string): Gorev[] {
  return gorevDegistir(gorevler, id, (g) => ({ ...g, yildiz: !g.yildiz }))
}

/**
 * Görevi ertesi güne, aynı dilime taşır.
 *
 * Hedef gün o dilimde doluysa `null`: erteleme sessizce yutulursa kullanıcı
 * işi ertelediğini sanıp ekrandan kaybolmasını izler. Bitmiş görev de
 * ertelenmiyor — yapılmış bir işi yarına taşımak anlamsız.
 */
export function gorevErtele(gorevler: readonly Gorev[], id: string): Gorev[] | null {
  const gorev = gorevler.find((g) => g.id === id)
  if (!gorev || gorev.bitti) return null
  const yarin = gunKaydir(gorev.gun, 1)
  if (!dilimeYerVarMi(gorevler, yarin, gorev.dilim)) return null
  return gorevDegistir(gorevler, id, (g) => ({ ...g, gun: yarin }))
}

/** Bitmemiş görev sayısı — başlıktaki sayı. */
export function bekleyenGorev(gorevler: readonly Gorev[]): number {
  return gorevler.filter((g) => !g.bitti).length
}
