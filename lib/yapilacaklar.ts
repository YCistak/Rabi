/**
 * Yapılacaklar — günün görevleri, tek liste; görevin saati isteğe bağlı.
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
 * Sonraki tasarım gruplamayı konuma değil zamana bağladı: sabah, öğle,
 * akşam. Kullanıcı dilimleri istemedi ("saatler olsun, kullanıcı isterse"):
 * üç kaba bölüm her işi bir kutuya sokmayı zorunlu kılıyordu, saati bilen
 * kullanıcıya da bir şey söyletmiyordu. Şimdi günün görevleri **tek liste**
 * ve her görevin **isteğe bağlı** bir saati var (`saat`, 'SS:DD'). Saatliler
 * saate göre üstte, saatsizler altta (`gununSiraliGorevleri`).
 *
 * Eski kayıtların konumu (`x`/`y`) ve dilimi (`dilim`) taşınırken atılıyor
 * (`gorevleriNormalize`). Dilim saate **çevrilmiyor**: "sabah" 09:00 demek
 * değildi ve kullanıcının vermediği bir saati onun adına yazmak olurdu.
 *
 * ## Yedi günlük şerit neden duruyor, ay neden durmuyor
 *
 * Tahta **günlükti**: gün dönünce kâğıtlar siliniyordu, gerekçe de "dün
 * yazdığını bugün de gören kullanıcı biriken ve hiç bitmeyen bir listeye
 * bakıyor" idi. Gerekçe hâlâ geçerli, ama yedi günlük şerit geliyor:
 * kullanıcı yakın günlere bakıyor ve ileriye plan yazabiliyor, yani
 * "bugün" tek başına yetmiyor.
 *
 * Kayıt bugün çevresindeki şeritle kayar: bugünden üç günden eski görevler
 * elenir. Gelecek günlere yazılanlar korunur; pazar günü sonraki haftanın
 * planı yapılabilir.
 *
 * Geçmiş günler **salt okunur** (ekran tarafında): dün yapılmamış işi bugün
 * işaretlemek geçmişi düzeltmek olur, o iş yapılmadı. Erteleme varken buna
 * gerek de yok.
 */

import { gunKaydir } from './utils'

/**
 * Görevin saati: 'SS:DD', 24 saat. Yerel `<input type="time">` bu biçimi
 * veriyor; bazı platformlar saniye de ekleyebiliyor ('14:30:00'), o yüzden
 * kayda girmeden `saatKirp` ile beş karaktere iniyor.
 */
const SAAT_DESENI = /^([01]\d|2[0-3]):[0-5]\d$/

/** Geçerli bir 'SS:DD' ise onu, değilse `null` döner. */
export function saatKirp(ham: unknown): string | null {
  if (typeof ham !== 'string') return null
  const saat = ham.trim().slice(0, 5)
  return SAAT_DESENI.test(saat) ? saat : null
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
  /**
   * Görevin saati ('SS:DD') ya da `null` — saat isteğe bağlı.
   *
   * Eski kayıtlarda alan yok, `sabah`/`ogle`/`aksam` dilimi var; taşınırken
   * dilim atılıyor ve görev saatsiz kalıyor (bkz. dosya başı).
   */
  saat: string | null
  kategori: GorevKategorisi
  /**
   * "Diğer" seçilince kullanıcının yazdığı kendi kategori adı.
   *
   * Yalnızca `kategori === 'diger'` iken anlamlı. Ekleme sayfası artık onu
   * **zorunlu** tutuyor (kullanıcı istedi: "Diğer" tek başına görevin ne
   * olduğunu söylemiyordu); tipte isteğe bağlı kalıyor çünkü eski kayıtlarda
   * yok ve onlar "Diğer" olarak görünmeye devam ediyor.
   */
  ozelKategori?: string
  renk: GorevRengi
  /**
   * Ortalama kaç dakika süreceği — kullanıcının tahmini.
   *
   * `null` "süre verilmedi" demek: ekleme sayfasında süre isteğe bağlı ve
   * alan gelmeden önce yazılmış eski görevler de süresiz. İkisine de bir süre
   * uydurmak, günün toplamını kullanıcının hiç söylemediği bir sayıyla
   * şişirirdi.
   */
  sure: number | null
  bitti: boolean
  /** Öncelikli — aynı saatteki ya da saatsiz görevler içinde üstte duruyor. */
  yildiz: boolean
}

/**
 * Ekleme sayfasındaki hazır süreler, dakika.
 *
 * Çoğu tahmin bunlardan biri ve çip dokunuşla seçiliyor, sayı klavyesi
 * açılmıyor. 90 bir süre listede duruyordu; kullanıcı çıkarılmasını istedi.
 * Hazır sürelerin dışındaki her değer yanlarındaki kutuya elle yazılıyor
 * (`elleSure`) — "37 dakika" diyen de, üç saatlik bir iş yazan da orada.
 */
export const SURE_SECENEKLERI: readonly number[] = [15, 30, 45, 60, 120]

/** Kayıtta kabul edilen en uzun süre; kurcalanmış kayıt günü aşamasın. */
export const EN_UZUN_SURE = 24 * 60

/**
 * Elle yazılan dakika: rakam olmayan her şey atılıyor, sıfır ve boş "süre
 * yok" sayılıyor, üst sınır `EN_UZUN_SURE`.
 *
 * Kutu `inputMode="numeric"` ama klavye yapıştırmayı engellemiyor; "45 dk"
 * yapıştıran kullanıcıdan 45 alınıyor.
 */
export function elleSure(metin: string): number | null {
  const rakamlar = metin.replace(/\D/g, '')
  if (rakamlar === '') return null
  const dakika = Number(rakamlar)
  return dakika > 0 ? Math.min(dakika, EN_UZUN_SURE) : null
}

/** "45 dk", "1 sa", "1 sa 30 dk". */
export function sureYaz(dakika: number): string {
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  if (saat === 0) return `${kalan} dk`
  return kalan === 0 ? `${saat} sa` : `${saat} sa ${kalan} dk`
}

/**
 * Bitmemiş görevlerin toplam süresi — liste başlığındaki sayı.
 *
 * Biten görev düşüyor: sayı "bugün daha ne kadar işim var" diyor.
 * Süresi olmayan eski görevler sayılmıyor, tahmin edilmiyor.
 */
export function kalanSure(gorevler: readonly Gorev[]): number {
  return gorevler.reduce((t, g) => (g.bitti || g.sure === null ? t : t + g.sure), 0)
}

/**
 * Bir güne girilebilecek en fazla görev.
 *
 * Eskiden sınır dilim başına ondu (üç dilim, günde otuz). Dilimler kalkınca
 * sınır güne taşındı ve **otuz** kaldı: daha düşük bir sayı, dilimli dönemde
 * yazılmış dolu bir günün görevlerini taşırken eleyip kaybederdi.
 */
export const EN_COK_GOREV = 30

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

/**
 * Özel kategori adının en fazla karakteri.
 *
 * Ad, görev satırında kategorinin yerinde büyük harfle ve süreyle yan yana
 * (`TEKRAR · 45 dk`) çiziliyor; satır tek ve dar. On dört karakter büyük
 * harfle de süreyle birlikte telefonda sığıyor.
 */
export const EN_UZUN_OZEL_KATEGORI = 14

/** Özel kategori adını sınıra indirir; boşluklar atılır, boş kalırsa `undefined`. */
export function ozelKategoriKirp(metin: string | undefined): string | undefined {
  const temiz = (metin ?? '').trim().slice(0, EN_UZUN_OZEL_KATEGORI).trim()
  return temiz === '' ? undefined : temiz
}

/** Satırda görünen kategori adı: "Diğer"de kullanıcının yazdığı, yoksa "Diğer". */
export function kategoriAdiGoster(gorev: Pick<Gorev, 'kategori' | 'ozelKategori'>): string {
  if (gorev.kategori === 'diger') return ozelKategoriKirp(gorev.ozelKategori) ?? KATEGORI_ADI.diger
  return KATEGORI_ADI[gorev.kategori]
}

/** Görev adını sınıra indirir ve baştaki/sondaki boşluğu atar. */
export function metniKirp(metin: string): string {
  return metin.trim().slice(0, EN_UZUN_GOREV)
}

/**
 * Kayıttan okunan listeyi güncel şemaya uydurur.
 *
 * Üç iş birden yapıyor: `localStorage` elle kurcalanabildiği için bozuk
 * kayıtları eliyor, **eski kayıtları** taşıyor ve gün sınırını uyguluyor.
 *
 * Göç (kayıt sürümsüz bir dizi; şemayı okurken burası çeviriyor, eski
 * yedekler de aynı yoldan geçiyor):
 *  - tahta dönemi kâğıdı: konum atılıyor, kategorisi yoksa "Diğer";
 *  - dilim dönemi görevi: `dilim` atılıyor, görev **saatsiz** kalıyor —
 *    dilimden saat uydurulmuyor;
 *  - saat bozuksa (`saatKirp` geçmiyorsa) saatsiz.
 *
 * Uzun metin de sınıra kırpılıyor: satır tek satır ve kırpılmamış metnin
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
  /** Gün başına kaç görev yazıldı — sınır burada tutuluyor. */
  const sayac = new Map<string, number>()
  for (const kayit of ham) {
    if (typeof kayit !== 'object' || kayit === null) continue
    const g = kayit as Partial<Gorev>
    if (typeof g.id !== 'string' || g.id === '') continue
    // Günü olmayan kayıt hiçbir güne ait değil; haftalık eleme onu atıyor.
    if (typeof g.gun !== 'string') continue

    const yazilan = sayac.get(g.gun) ?? 0
    if (yazilan >= EN_COK_GOREV) continue
    sayac.set(g.gun, yazilan + 1)

    gorevler.push({
      id: g.id,
      metin: typeof g.metin === 'string' ? metniKirp(g.metin) : '',
      gun: g.gun,
      saat: saatKirp(g.saat),
      kategori: KATEGORILER.includes(g.kategori as GorevKategorisi)
        ? (g.kategori as GorevKategorisi)
        : 'diger',
      ...(g.kategori === 'diger' && ozelKategoriKirp(g.ozelKategori)
        ? { ozelKategori: ozelKategoriKirp(g.ozelKategori) }
        : {}),
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
 * Listeyi görünen en eski günden itibaren tutar.
 *
 * Alt sınır dışarıdan geliyor: takvim saatine bakan
 * bir mantık test edilemez ve gece yarısını beklemek gerekirdi. İleri günler
 * elenmiyor — pazar günü ertelenen iş gelecek pazartesiye düşüyor ve o iş
 * kullanıcının kendi kararı.
 */
export function gorevleriTarihtenItibaren(
  gorevler: readonly Gorev[],
  enEskiGunIso: string,
): Gorev[] {
  return gorevler.filter((g) => g.gun >= enEskiGunIso)
}

/** Bir günün görevleri. */
export function gununGorevleri(gorevler: readonly Gorev[], gun: string): Gorev[] {
  return gorevler.filter((g) => g.gun === gun)
}

/**
 * Bir günün görevleri ekrandaki sırayla.
 *
 * Saatliler saate göre üstte, saatsizler altta: saat bir sıra bildiriyor,
 * saatsiz görev "gün içinde bir ara" demek ve saatlilerin arasına
 * yerleştirilemez. Aynı saatte ve saatsizlerin içinde yıldızlılar üstte —
 * yıldız saatin önüne geçmiyor, 18:00'deki öncelikli iş 09:00'dan önce
 * yapılmıyor.
 *
 * Biten görev yerinde kalıyor, sona atılmıyor: bir işi bitirmek ötekilerin
 * yerini oynatmıyor. Sıralama kararlı (`sort` modern JS'te kararlı), yani
 * eşitler arasında eklenme sırası bozulmuyor.
 */
export function gununSiraliGorevleri(gorevler: readonly Gorev[], gun: string): Gorev[] {
  return gorevler
    .filter((g) => g.gun === gun)
    .sort((a, b) => {
      if (a.saat !== b.saat) {
        if (a.saat === null) return 1
        if (b.saat === null) return -1
        return a.saat < b.saat ? -1 : 1
      }
      return Number(b.yildiz) - Number(a.yildiz)
    })
}

/** O gün yer kaldı mı. */
export function gunuYerVarMi(gorevler: readonly Gorev[], gun: string): boolean {
  return gorevler.filter((g) => g.gun === gun).length < EN_COK_GOREV
}

/**
 * Yeni görev.
 *
 * Gün doluysa ya da metin boşsa `null`: çağıran taraf "olmadı" durumunu tek
 * yerden okusun, sessizce en eski görev silinmesin. Görev silmek kullanıcının
 * kararı.
 */
export function gorevEkle(
  gorevler: readonly Gorev[],
  yeni: Omit<Gorev, 'bitti' | 'yildiz'>,
): Gorev[] | null {
  const metin = metniKirp(yeni.metin)
  if (metin === '') return null
  if (!gunuYerVarMi(gorevler, yeni.gun)) return null
  const { ozelKategori: ham, saat: hamSaat, ...gerisi } = yeni
  // Özel ad yalnızca "Diğer"de saklanıyor; başka kategoriye sızmasın.
  const ozelKategori = yeni.kategori === 'diger' ? ozelKategoriKirp(ham) : undefined
  return [
    ...gorevler,
    {
      ...gerisi,
      saat: saatKirp(hamSaat),
      ...(ozelKategori ? { ozelKategori } : {}),
      metin,
      bitti: false,
      yildiz: false,
    },
  ]
}

/** Düzenlemede değişebilen alanlar: gün ve durum yerinde kalıyor. */
export type GorevDuzeni = Pick<
  Gorev,
  'metin' | 'saat' | 'kategori' | 'ozelKategori' | 'renk' | 'sure'
>

/**
 * Görevin adını, saatini, kategorisini, rengini ve süresini değiştirir.
 *
 * Görev bir süre düzenlenemiyordu ("silip yeniden yazmak daha hızlı" diye);
 * kullanıcı düzenleme düğmesi istedi — yeniden yazmak yıldızı ve bitti
 * işaretini de götürüyordu. Gün burada değişmiyor: taşımanın yolu erteleme. Metin boşsa ya da görev yoksa `null`,
 * `gorevEkle` ile aynı kural.
 */
export function gorevDuzenle(
  gorevler: readonly Gorev[],
  id: string,
  duzen: GorevDuzeni,
): Gorev[] | null {
  const metin = metniKirp(duzen.metin)
  if (metin === '' || !gorevler.some((g) => g.id === id)) return null
  const ozelKategori = duzen.kategori === 'diger' ? ozelKategoriKirp(duzen.ozelKategori) : undefined
  return gorevDegistir(gorevler, id, (g) => {
    // Eski özel ad, kategori değişince geride kalmasın.
    const { ozelKategori: _eski, ...gerisi } = g
    return {
      ...gerisi,
      metin,
      saat: saatKirp(duzen.saat),
      kategori: duzen.kategori,
      ...(ozelKategori ? { ozelKategori } : {}),
      renk: duzen.renk,
      sure: duzen.sure,
    }
  })
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
 * Görevi ertesi güne, aynı saate taşır.
 *
 * Hedef gün doluysa `null`: erteleme sessizce yutulursa kullanıcı
 * işi ertelediğini sanıp ekrandan kaybolmasını izler. Bitmiş görev de
 * ertelenmiyor — yapılmış bir işi yarına taşımak anlamsız.
 */
export function gorevErtele(gorevler: readonly Gorev[], id: string): Gorev[] | null {
  const gorev = gorevler.find((g) => g.id === id)
  if (!gorev || gorev.bitti) return null
  const yarin = gunKaydir(gorev.gun, 1)
  if (!gunuYerVarMi(gorevler, yarin)) return null
  return gorevDegistir(gorevler, id, (g) => ({ ...g, gun: yarin }))
}

/** Bitmemiş görev sayısı — başlıktaki sayı. */
export function bekleyenGorev(gorevler: readonly Gorev[]): number {
  return gorevler.filter((g) => !g.bitti).length
}
