import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from '../konu'
import type { Konu, KonuDersId, KonuSinifi } from '../konu/tip'
import { konuTamam, type KonuIlerlemeleri } from '../konu/ilerleme'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import type { YksDers, YksKonu } from './liste'

/**
 * Konu Takibi'nin kaydı ve hesapları — saf mantık, React'e bağlı değil.
 *
 * Her YKS konusunun dört aşaması var:
 *
 * - **Haritada çalıştım** — elle işaretlenmiyor, konu haritasının kendi
 *   kaydından (`rabi-konu-ilerleme`) hesaplanıyor (`haritaDurumu`). Elle bir
 *   kutu olsaydı haritayla çelişebilirdi: kartları okumuş öğrenci kutuyu boş,
 *   hiç açmamış öğrenci dolu görebilirdi. Haritada karşılığı olmayan
 *   konularda aşama hiç yok; elle bir "haritada çalıştım" kutusu, olmayan bir
 *   haritayı çalışılmış saymak olurdu.
 * - **Okulda öğrendim** ve **Soru çözdüm** — elle.
 * - **Bitirdim** — ayrı ve ağır bir eylem. Aşamalar sıralı ya da zorunlu
 *   değil: öğrenci bir konuyu dershanede öğrenip yalnızca soru çözmüş
 *   olabilir, bitirdiğine o karar veriyor. Ekran eksik aşamayı hatırlatıyor
 *   ama engellemiyor (`eksikAsamalar`).
 *
 * Kayıtta işaret yerine **gün** duruyor ('YYYY-AA-GG'): bugün yalnızca var/yok
 * olarak okunuyor, ama "bu ay kaç konu bitirdin" gibi bir soru ileride
 * geriye dönük cevaplanabilsin. Konu haritasındaki `bitisTarihi` ile aynı
 * gerekçe.
 */

export type ElleAsama = 'okul' | 'soru'
/** Ekrandaki dört aşama; `harita` hesaplanıyor, ötekiler kayıtta. */
export type AsamaId = 'harita' | ElleAsama
export type YazilanAlan = ElleAsama | 'bitti'

export type YksKonuKaydi = {
  /** Okulda/derste öğrendiğini işaretlediği gün. */
  okul?: string
  /** Soru çözdüğünü işaretlediği gün. */
  soru?: string
  /** "Bitirdim" dediği gün. */
  bitti?: string
}

/**
 * Depodaki biçim. Sürüm alanı şema değişirse eski kaydı tanıyıp taşımak için:
 * bilinmeyen bir sürüm boş kayıt sayılıyor (`takibiCoz`), yani yeni bir
 * uygulamanın yazdığı kaydı eski sürüm okuyup bozmuyor — yalnızca görmüyor.
 */
export type YksTakip = {
  surum: 1
  konular: Record<string, YksKonuKaydi>
}

export const BOS_TAKIP: YksTakip = { surum: 1, konular: {} }

const GUN = /^\d{4}-\d{2}-\d{2}$/

function gunMu(deger: unknown): deger is string {
  return typeof deger === 'string' && GUN.test(deger)
}

/**
 * Depodan ya da yedekten gelen değeri güvenli bir kayda çevirir.
 *
 * Yalnızca bilinen alanlar ve geçerli günler kalıyor; bozuk bir kayıt
 * ekranı çökertmiyor, boş görünüyor. Listede artık olmayan konu kimlikleri
 * **atılmıyor**: bir konu listeden geçici olarak düşüp geri gelirse
 * öğrencinin işareti yerinde dursun.
 */
export function takibiCoz(ham: unknown): YksTakip {
  if (typeof ham !== 'object' || ham === null) return BOS_TAKIP
  const nesne = ham as Record<string, unknown>
  if (nesne.surum !== 1) return BOS_TAKIP
  if (typeof nesne.konular !== 'object' || nesne.konular === null) return BOS_TAKIP

  const konular: Record<string, YksKonuKaydi> = {}
  for (const [id, kayitHam] of Object.entries(nesne.konular as Record<string, unknown>)) {
    if (typeof kayitHam !== 'object' || kayitHam === null) continue
    const kayit = kayitHam as Record<string, unknown>
    const temiz: YksKonuKaydi = {}
    if (gunMu(kayit.okul)) temiz.okul = kayit.okul
    if (gunMu(kayit.soru)) temiz.soru = kayit.soru
    if (gunMu(kayit.bitti)) temiz.bitti = kayit.bitti
    if (Object.keys(temiz).length > 0) konular[id] = temiz
  }
  return { surum: 1, konular }
}

/**
 * Bir aşamayı işaretler ya da kaldırır.
 *
 * Kaldırılan alan kayıttan silinip boş kalan kayıt da atılıyor: depo yalnızca
 * işaretli konuları taşısın, "hiç dokunulmamış" ile "işaretlenip geri
 * alınmış" ayrı iki hâl olmasın. Zaten işaretli alan yeniden
 * işaretlendiğinde ilk gün korunuyor.
 */
export function asamaYaz(
  takip: YksTakip,
  konuId: string,
  alan: YazilanAlan,
  acik: boolean,
  bugun: string,
): YksTakip {
  const onceki = takip.konular[konuId] ?? {}
  const sonraki: YksKonuKaydi = { ...onceki }
  if (acik) sonraki[alan] = onceki[alan] ?? bugun
  else delete sonraki[alan]

  const konular = { ...takip.konular }
  if (Object.keys(sonraki).length === 0) delete konular[konuId]
  else konular[konuId] = sonraki
  return { surum: 1, konular }
}

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
  const basladi = konumlar.some((k) => haritadaBasladi(ilerlemeler, k.konu.id))
  const durum = biten === konumlar.length ? 'tamam' : biten > 0 || basladi ? 'basladi' : 'yok'
  const ilkEksik = konumlar.find((_, i) => !tamamlar[i])
  return { durum, biten, toplam: konumlar.length, hedef: ilkEksik ?? konumlar[0] }
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
 * Yalnızca **hatırlatma**: liste boş değilse ekran nazik bir onay soruyor,
 * öğrenci yine de bitirebiliyor. Haritada karşılığı olmayan konuda harita
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
  /** Aşama dağılımı: o aşaması dolu konu sayısı. */
  okul: number
  soru: number
  harita: number
  /** Haritada karşılığı olan konu sayısı — harita sayısının paydası. */
  haritali: number
}

export function dersOzeti(
  ders: YksDers,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): DersOzeti {
  const ozet: DersOzeti = { toplam: 0, biten: 0, okul: 0, soru: 0, harita: 0, haritali: 0 }
  for (const konu of ders.konular) {
    const d = konuDurumu(konu.id, takip, ilerlemeler)
    ozet.toplam += 1
    if (d.bitti) ozet.biten += 1
    if (d.kayit.okul) ozet.okul += 1
    if (d.kayit.soru) ozet.soru += 1
    if (d.harita) {
      ozet.haritali += 1
      if (d.harita.durum === 'tamam') ozet.harita += 1
    }
  }
  return ozet
}

/** Birden çok dersin toplamı — sekmenin üstündeki büyük halka. */
export function toplamOzet(ozetler: readonly DersOzeti[]): DersOzeti {
  return ozetler.reduce<DersOzeti>(
    (t, o) => ({
      toplam: t.toplam + o.toplam,
      biten: t.biten + o.biten,
      okul: t.okul + o.okul,
      soru: t.soru + o.soru,
      harita: t.harita + o.harita,
      haritali: t.haritali + o.haritali,
    }),
    { toplam: 0, biten: 0, okul: 0, soru: 0, harita: 0, haritali: 0 },
  )
}

/** Yüzde, aşağı yuvarlanmış: "%100" yalnızca gerçekten hepsi bitince yazılsın. */
export function yuzde(biten: number, toplam: number): number {
  return toplam > 0 ? Math.floor((biten / toplam) * 100) : 0
}

/**
 * Derste sıradaki önerilen konu.
 *
 * Bitmemiş konulardan **en çok aşaması dolu** olan: bitmeye en yakın konu,
 * öğrencinin elinde yarım kalan iş. Eşitlikte listedeki sıra kazanıyor
 * (müfredat sırası). Hiçbirine dokunulmamışsa ilk bitmemiş konu; hepsi
 * bittiyse `null`. Yarım harita, dolu aşama sayılmıyor ama eşitliği bozuyor:
 * haritada başlanmış konu, hiç başlanmamış olandan önce geliyor.
 */
export function siradakiKonu(
  ders: YksDers,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): YksKonu | null {
  let enIyi: { konu: YksKonu; puan: number } | null = null
  for (const konu of ders.konular) {
    const d = konuDurumu(konu.id, takip, ilerlemeler)
    if (d.bitti) continue
    const puan = d.dolu * 2 + (d.harita?.durum === 'basladi' ? 1 : 0)
    if (enIyi === null || puan > enIyi.puan) enIyi = { konu, puan }
  }
  return enIyi?.konu ?? null
}
