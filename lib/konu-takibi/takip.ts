import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from '../konu'
import type { Konu, KonuDersId, KonuSinifi } from '../konu/tip'
import { konuBitti, konuTamam, type KonuIlerlemeleri } from '../konu/ilerleme'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import type { YksDers, YksKonu } from './liste'
import { asamaYaz, type ElleAsama, type YksKonuKaydi, type YksTakip } from './kayit'

export { BOS_TAKIP, asamaYaz, takibiCoz } from './kayit'
export type { ElleAsama, YazilanAlan, YksKonuKaydi, YksTakip } from './kayit'

/** Ekrandaki dört aşama; `harita` hesaplanıyor, ötekiler kayıtta. */
export type AsamaId = 'harita' | ElleAsama

/*
  Konu Takibi'nin hesapları: haritadan türeyen aşama, konu/ders özetleri ve
  sıradaki konu. Kaydın kendisi ve aşamaların anlamı `kayit.ts`te; o dosya
  konu içeriğini yüklemiyor, depo (`lib/depo.ts`) yalnızca onu okuyor.
*/

// ---------------------------------------------------------------------------
// Harita bağı
// ---------------------------------------------------------------------------

/** Bir Maarif konusunun haritadaki yeri — "haritaya git" buraya açıyor. */
export type HaritaKonumu = { ders: KonuDersId; sinif: KonuSinifi; konu: Konu }

let dizin: Map<string, HaritaKonumu> | null = null

/**
 * Maarif konu kimliğinden haritadaki yeri.
 *
 * Dizin ilk soruda bir kez kuruluyor: programlar sabit, her çizimde bütün
 * içeriği taramak gereksiz.
 */
export function haritaKonumu(konuId: string): HaritaKonumu | null {
  if (dizin === null) {
    dizin = new Map()
    for (const sinif of KONU_SINIFLARI) {
      for (const d of KONU_DERSLERI) {
        const program = programBul(d.id, sinif)
        if (!program) continue
        for (const konu of tumKonular(program)) dizin.set(konu.id, { ders: d.id, sinif, konu })
      }
    }
  }
  return dizin.get(konuId) ?? null
}

export type HaritaDurumu = {
  /**
   * `tamam`: karşılık gelen bütün harita konuları tamamlandı (kartlar okundu,
   * sorusu varsa geçildi — haritadaki yeşil kitapla aynı ölçü).
   * `basladi`: en az birine başlandı. `yok`: hiçbirine dokunulmadı.
   */
  durum: 'yok' | 'basladi' | 'tamam'
  /** Tamamlanan harita konusu sayısı. */
  biten: number
  /**
   * Kartları sonuna kadar okunmuş konu sayısı (sorusu geçilmemiş olsa da).
   * `biten`den büyükse ekran "sorular bekliyor" diyor: öğrenciye neyin
   * eksik kaldığını söylemek, yalnızca "bitmedi" demekten iyi.
   */
  okunan: number
  toplam: number
  /**
   * "Haritaya git" düğmesinin açacağı konu: tamamlanmamış ilk karşılık;
   * hepsi bittiyse ilki (tekrar için).
   */
  hedef: HaritaKonumu
}

/** Harita kaydında konuya dokunulmuş mu — bir kart okunmuş ya da deste bitmiş. */
function haritadaBasladi(ilerlemeler: KonuIlerlemeleri, konuId: string): boolean {
  const kayit = ilerlemeler[konuId]
  if (!kayit) return false
  // Kilidi elle açılmış ama hiç okunmamış kayıt (`acildi`) başlanmış sayılmıyor.
  return kayit.bitti === true || (kayit.okunan ?? 0) > 0
}

/**
 * YKS konusunun haritadaki durumu; haritada karşılığı yoksa `null`.
 *
 * Eşleme tablosundaki bir kimlik içerikte bulunamazsa (içerik değişmiş)
 * o kimlik atlanıyor; hiçbiri bulunamazsa `null` — aşama boş bir halka
 * olarak değil hiç çizilmiyor. Test bu durumu zaten kırıyor
 * (`takip.test.ts`), bu yalnızca çalışma anındaki emniyet.
 */
export function haritaDurumu(yksKonuId: string, ilerlemeler: KonuIlerlemeleri): HaritaDurumu | null {
  const kimlikler = HARITA_ESLEMESI[yksKonuId]
  if (!kimlikler) return null
  const konumlar = kimlikler.map(haritaKonumu).filter((k): k is HaritaKonumu => k !== null)
  if (konumlar.length === 0) return null

  const tamamlar = konumlar.map((k) => konuTamam(ilerlemeler, k.konu))
  const biten = tamamlar.filter(Boolean).length
  const okunan = konumlar.filter((k) => konuBitti(ilerlemeler, k.konu.id)).length
  const basladi = konumlar.some((k) => haritadaBasladi(ilerlemeler, k.konu.id))
  const durum = biten === konumlar.length ? 'tamam' : biten > 0 || basladi ? 'basladi' : 'yok'
  const ilkEksik = konumlar.find((_, i) => !tamamlar[i])
  return { durum, biten, okunan, toplam: konumlar.length, hedef: ilkEksik ?? konumlar[0] }
}

// ---------------------------------------------------------------------------
// Konu ve ders hesapları
// ---------------------------------------------------------------------------

export type KonuDurumu = {
  kayit: YksKonuKaydi
  /** Haritada karşılığı yoksa `null` — aşama gösterilmiyor. */
  harita: HaritaDurumu | null
  bitti: boolean
  /** Dolu aşama sayısı (bitirdim hariç). Yarım harita dolu sayılmıyor. */
  dolu: number
  /** Bu konuda gösterilen aşama sayısı: haritalıda 3, haritasızda 2. */
  asamaToplam: number
}

export function konuDurumu(
  konuId: string,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): KonuDurumu {
  const kayit = takip.konular[konuId] ?? {}
  const harita = haritaDurumu(konuId, ilerlemeler)
  const dolu =
    (harita?.durum === 'tamam' ? 1 : 0) + (kayit.okul ? 1 : 0) + (kayit.soru ? 1 : 0)
  return {
    kayit,
    harita,
    bitti: kayit.bitti !== undefined,
    dolu,
    asamaToplam: harita ? 3 : 2,
  }
}

/**
 * "Bitirdim"e basarken hatırlatılacak eksik aşamalar.
 *
 * Yalnızca **hatırlatma**: konu yine de bitiyor, ekran eksikleri kısa ve
 * kendiliğinden kaybolan bir bildirimde ("Bitti · eksik: okul, soru · Geri
 * al") söylüyor. Bir süre onay penceresiydi; art arda işaretlemede her konu
 * fazladan bir dokunuş istiyordu. Haritada karşılığı olmayan konuda harita
 * eksik sayılmıyor — orada yapılabilecek bir şey yok.
 */
export function eksikAsamalar(durum: KonuDurumu): AsamaId[] {
  const eksik: AsamaId[] = []
  if (durum.harita && durum.harita.durum !== 'tamam') eksik.push('harita')
  if (!durum.kayit.okul) eksik.push('okul')
  if (!durum.kayit.soru) eksik.push('soru')
  return eksik
}

export type DersOzeti = {
  toplam: number
  biten: number
  /** Aşama dağılımı: o aşaması dolu konu sayısı (bitmişler dahil). */
  okul: number
  soru: number
  harita: number
  /** Haritada karşılığı olan konu sayısı — harita sayısının paydası. */
  haritali: number
  /**
   * Segmentli çubuğun dilimleri — her konu **en ileri** aşamasına göre tek
   * dilimde: bitti › soru çözüldü › okulda işlendi › kalan. Yukarıdaki
   * sayılar örtüşüyor (soru çözülen konu çoğunlukla okulda da işlendi);
   * çubuk örtüşen sayılarla çizilseydi dilimlerin toplamı konu sayısını
   * aşardı.
   */
  soruda: number
  okulda: number
}

const BOS_OZET: DersOzeti = { toplam: 0, biten: 0, okul: 0, soru: 0, harita: 0, haritali: 0, soruda: 0, okulda: 0 }

export function dersOzeti(
  ders: YksDers,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): DersOzeti {
  const ozet: DersOzeti = { ...BOS_OZET }
  for (const konu of ders.konular) {
    const d = konuDurumu(konu.id, takip, ilerlemeler)
    ozet.toplam += 1
    if (d.bitti) ozet.biten += 1
    else if (d.kayit.soru) ozet.soruda += 1
    else if (d.kayit.okul) ozet.okulda += 1
    if (d.kayit.okul) ozet.okul += 1
    if (d.kayit.soru) ozet.soru += 1
    if (d.harita) {
      ozet.haritali += 1
      if (d.harita.durum === 'tamam') ozet.harita += 1
    }
  }
  return ozet
}

/** Birden çok dersin toplamı — sekmenin üstündeki özet çubuğu. */
export function toplamOzet(ozetler: readonly DersOzeti[]): DersOzeti {
  const toplam: DersOzeti = { ...BOS_OZET }
  for (const o of ozetler) {
    for (const alan of Object.keys(toplam) as (keyof DersOzeti)[]) toplam[alan] += o[alan]
  }
  return toplam
}

// ---------------------------------------------------------------------------
// Öneri: yarım kalan konu önde
// ---------------------------------------------------------------------------

/** Konunun en son işaretlendiği gün (okul, soru ya da bitti); hiç yoksa `null`. */
export function sonIsaretGunu(kayit: YksKonuKaydi): string | null {
  let son: string | null = null
  for (const gun of [kayit.okul, kayit.soru, kayit.bitti]) {
    // 'YYYY-AA-GG' metin olarak da tarih sırasında karşılaştırılıyor.
    if (gun && (son === null || gun > son)) son = gun
  }
  return son
}

/**
 * Yarım kalan konu: bitmemiş ama dokunulmuş — en az bir aşaması dolu ya da
 * haritada başlanmış. "Devam et" ve sıradaki öneri önce bunlara bakıyor:
 * öğrencinin elinde yarım kalan iş, hiç başlanmamış bir konudan önce gelir.
 */
export function yarimMi(durum: KonuDurumu): boolean {
  return !durum.bitti && (durum.dolu > 0 || durum.harita?.durum === 'basladi')
}

/**
 * İki yarım konudan hangisi önde: en son işaretlenen. Kayıtta saat değil
 * gün var; aynı gün işaretlenenlerde **listede sonra gelen** önde. Öğrenci
 * listeyi yukarıdan aşağı işaretliyor ve toplu "bu ve öncekiler" eylemi de
 * en alttaki konuda bitiyor — aynı gündeki en alttaki, büyük olasılıkla en
 * son dokunulanı. Haritada başlanmış ama elle işaretlenmemiş konunun günü
 * yok; o, günü olanların arkasında kalıyor.
 */
function dahaYeni(a: { gun: string | null; sira: number }, b: { gun: string | null; sira: number }): boolean {
  const ga = a.gun ?? ''
  const gb = b.gun ?? ''
  if (ga !== gb) return ga > gb
  return a.sira > b.sira
}

/**
 * Derste sıradaki önerilen konu.
 *
 * Önce **yarım kalan** konular, en son işaretlenen önde (`dahaYeni`); yarım
 * konu yoksa müfredat sırasındaki ilk dokunulmamış konu; hepsi bittiyse
 * `null`. Eski kural "en çok aşaması dolu" konuyu öneriyordu ve eşitlikte
 * ilk konu kazandığı için, birkaç konuyu okulda işaretleyen öğrenciye hep
 * dersin ilk konusu öneriliyordu.
 */
export function siradakiKonu(
  ders: YksDers,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): YksKonu | null {
  let enIyi: { konu: YksKonu; gun: string | null; sira: number } | null = null
  let ilkBos: YksKonu | null = null
  for (const [sira, konu] of ders.konular.entries()) {
    const d = konuDurumu(konu.id, takip, ilerlemeler)
    if (d.bitti) continue
    if (!yarimMi(d)) {
      ilkBos ??= konu
      continue
    }
    const aday = { konu, gun: sonIsaretGunu(d.kayit), sira }
    if (enIyi === null || dahaYeni(aday, enIyi)) enIyi = aday
  }
  return enIyi?.konu ?? ilkBos
}

/**
 * Giriş ekranının "Devam et" kartı: dersler arasında en son işaretlenen
 * yarım konu. Yalnızca elle işaretlenmiş (günü olan) konular aday — "en son
 * dokunulan" sorusunun cevabı ancak bir günle verilebiliyor. Aday yoksa
 * `null` ve kart çizilmiyor.
 */
export function devamKonusu(
  dersler: readonly YksDers[],
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): { ders: YksDers; konu: YksKonu } | null {
  let enIyi: { ders: YksDers; konu: YksKonu; gun: string; sira: number } | null = null
  let sira = 0
  for (const ders of dersler) {
    for (const konu of ders.konular) {
      sira += 1
      const kayit = takip.konular[konu.id]
      if (!kayit || kayit.bitti) continue
      const gun = sonIsaretGunu(kayit)
      if (gun === null) continue
      const aday = { ders, konu, gun, sira }
      if (enIyi === null || dahaYeni(aday, enIyi)) enIyi = aday
    }
  }
  return enIyi && { ders: enIyi.ders, konu: enIyi.konu }
}

// ---------------------------------------------------------------------------
// Toplu işaret
// ---------------------------------------------------------------------------

/**
 * "Bu ve önceki konuları okulda işlendi say"ın dokunacağı konular: aynı
 * bölümde (TYT Matematik'te Geometri ayrı) bu konuya kadar — bu konu dahil —
 * okul aşaması boş olanlar. İlk kullanımda okulda işlenmiş yirmi-kırk
 * konuyu tek tek girmek yerine tek dokunuş. Bölüm sınırı şart: Geometri'nin
 * ilk konusunda basan öğrenci, Matematik'in bütün konularını okulda
 * işlemiş olmayabilir.
 */
export function oncekiOkulsuzlar(ders: YksDers, konuId: string, takip: YksTakip): string[] {
  const sira = ders.konular.findIndex((k) => k.id === konuId)
  if (sira === -1) return []
  const bolum = ders.konular[sira].bolum
  return ders.konular
    .slice(0, sira + 1)
    .filter((k) => k.bolum === bolum && !takip.konular[k.id]?.okul)
    .map((k) => k.id)
}

/** Birden çok konunun okul aşamasını işaretler ya da kaldırır (toplu eylem ve geri alması). */
export function okuluTopluYaz(takip: YksTakip, konuIdleri: readonly string[], acik: boolean, bugun: string): YksTakip {
  return konuIdleri.reduce((t, id) => asamaYaz(t, id, 'okul', acik, bugun), takip)
}
