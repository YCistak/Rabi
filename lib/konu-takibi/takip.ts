import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from '../konu'
import type { Konu, KonuDersId, KonuSinifi } from '../konu/tip'
import { konuBitti, konuTamam, type KonuIlerlemeleri } from '../konu/ilerleme'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import type { YksDers, YksKonu, YksOturum } from './liste'
import { geriSayim, gunFarki } from '../sinav-tarihi'
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
// Öneri: müfredat sırasında ilk eksik konu
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
 * Bitirmeye hazır: bitmemiş ama gösterilen bütün aşamaları dolu (haritada
 * karşılığı yoksa harita sayılmıyor). Öneri bu konuyu atlıyor; satır onu
 * dairedeki ince bir işaretle belli ediyor, öğrenci emin olunca daireye
 * basıp bitiriyor.
 */
export function bitirmeyeHazir(durum: KonuDurumu): boolean {
  return !durum.bitti && durum.dolu >= durum.asamaToplam
}

/**
 * Derste sıradaki önerilen konu: müfredat sırasında, bitmemiş **ve**
 * aşamaları tamamlanmamış ilk konu. Hepsi bittiyse ya da bitirmeye hazırsa
 * `null`.
 *
 * Bir süre "önce yarım kalan, en son işaretlenen önde" kuralıydı. Bütün
 * aşamaları dolu ama "Bitirdim"i basılmamış konu da yarım sayılıyordu ve
 * öneride takılı kalıyordu: Sözcükte Anlam'da harita, okul ve soru dolu
 * olan öğrenciye sıradaki hâlâ Sözcükte Anlam'dı; başka konuda bir yuvaya
 * dokununca öneri oraya zıplıyordu. Öğrenci öneriyi müfredatta ilerleyen,
 * öngörülebilir bir şey olarak bekliyor. (Daha önce de "en çok aşaması dolu
 * konu" kuralı vardı; o da hep dersin ilk konusunu öneriyordu.)
 */
export function siradakiKonu(
  ders: YksDers,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): YksKonu | null {
  for (const konu of ders.konular) {
    const d = konuDurumu(konu.id, takip, ilerlemeler)
    if (!d.bitti && !bitirmeyeHazir(d)) return konu
  }
  return null
}

/**
 * Giriş ekranının "Devam et" kartı: **en son dokunulan dersin** sıradaki
 * konusu (`siradakiKonu`). Dokunulan ders, elle işaretlenmiş (günü olan)
 * konulardan bulunuyor — bitirmek de dokunuş. Kayıtta saat değil gün var;
 * aynı gün dokunulan derslerde **listede sonra gelen** konunun dersi önde:
 * öğrenci listeyi yukarıdan aşağı işaretliyor, aynı gündeki en alttaki
 * büyük olasılıkla en son dokunulanı.
 *
 * En son dokunulan dersin önerisi kalmadıysa (her konu bitti ya da bitirmeye
 * hazır) bir önceki dokunulan derse bakılıyor. Hiç işaret yoksa `null` ve
 * kart çizilmiyor.
 */
export function devamKonusu(
  dersler: readonly YksDers[],
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): { ders: YksDers; konu: YksKonu } | null {
  const dokunulan: { ders: YksDers; gun: string; sira: number }[] = []
  let sira = 0
  for (const ders of dersler) {
    let enSon: { gun: string; sira: number } | null = null
    for (const konu of ders.konular) {
      sira += 1
      const kayit = takip.konular[konu.id]
      const gun = kayit ? sonIsaretGunu(kayit) : null
      if (gun !== null && (enSon === null || gun >= enSon.gun)) enSon = { gun, sira }
    }
    if (enSon) dokunulan.push({ ders, ...enSon })
  }
  dokunulan.sort((a, b) => (a.gun !== b.gun ? (a.gun > b.gun ? -1 : 1) : b.sira - a.sira))
  for (const { ders } of dokunulan) {
    const konu = siradakiKonu(ders, takip, ilerlemeler)
    if (konu) return { ders, konu }
  }
  return null
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

// ---------------------------------------------------------------------------
// Tempo: kalan konu ve sınava kalan gün
// ---------------------------------------------------------------------------

export type Tempo = {
  /** Bitmemiş konu sayısı. */
  kalanKonu: number
  /** Sınava yetişmek için günde bitirilmesi gereken konu, yukarı yuvarlı. */
  gunluk: number
}

/**
 * Özet çubuğunun altındaki "Kalan N konu · günde ~k konu ile sınava
 * yetişir" satırının hesabı: k = ⌈kalan / kalan gün⌉.
 *
 * Kalan gün yoksa (sınav bugün ya da geçti) ya da bitmemiş konu kalmadıysa
 * `null` ve satır çizilmiyor: sıfıra bölmek ya da "günde 0 konu" demek bir
 * şey söylemiyor.
 */
export function tempoHesapla(kalanKonu: number, kalanGun: number): Tempo | null {
  if (kalanKonu <= 0 || kalanGun <= 0) return null
  return { kalanKonu, gunluk: Math.ceil(kalanKonu / kalanGun) }
}

/**
 * Oturumun sınavına kalan gün. TYT cumartesi, AYT ve YDT pazar
 * (`lib/sinav-tarihi.ts` → `geriSayim`); takvim öğrencinin **kendi**
 * sınavının yılı. Oturumun günü geçtiyse sayı eksi çıkıyor ve tempo
 * gösterilmiyor (`tempoHesapla`).
 */
export function oturumKalanGun(bugunIso: string, sinif: number, oturum: YksOturum): number {
  const { takvim } = geriSayim(bugunIso, sinif)
  return gunFarki(bugunIso, oturum === 'tyt' ? takvim.tyt : takvim.ayt)
}

// ---------------------------------------------------------------------------
// Hızlı başlangıç: "TYT'de neredeyim?"
// ---------------------------------------------------------------------------

/**
 * Hızlı başlangıç kartının seçenekleri ve her birinin "okulda işlendi"
 * sayılacak konu oranı. Bitti değil, yalnızca okul aşaması: öğrenci konuyu
 * okulda görmüş olabilir ama sorusunu çözmemiş.
 */
export const HIZLI_SECENEKLER = [
  { id: 'cogu', ad: 'Çoğunu bitirdim', oran: 0.8 },
  { id: 'yarisi', ad: 'Yarısı', oran: 0.5 },
  { id: 'yeni', ad: 'Yeni başlıyorum', oran: 0 },
] as const

export type HizliSecim = (typeof HIZLI_SECENEKLER)[number]['id']

/**
 * Kart kime gösteriliyor: 12. sınıf ve mezun. Daha alt sınıfta "çoğunu
 * bitirdim" cevabı okulun henüz işlemediği konuları işaretletirdi; onlar
 * konuları okulla birlikte tek tek işaretliyor.
 */
export function hizliBaslangicSinifi(sinif: number): boolean {
  return sinif >= 12
}

/** Oturumun derslerinde hiç işaret yok mu — kart yalnızca o zaman çıkıyor. */
export function oturumIsaretsiz(dersler: readonly YksDers[], takip: YksTakip): boolean {
  return dersler.every((d) => d.konular.every((k) => !takip.konular[k.id]))
}

/**
 * Seçilen orana göre okulda işlendi sayılacak konular: **her dersin**
 * müfredat sırasında ilk ⌊n × oran⌋ konusu, bölüm sınırı gözetmeden (TYT
 * Matematik'te Geometri de aynı sıranın devamı). Ders bazında, çünkü okul
 * bütün dersleri aynı takvimde ilerletiyor; tek bir toplam oran Türkçe'yi
 * bitirip Felsefe'ye hiç dokunmamış gibi bir dağılım üretirdi.
 */
export function hizliBaslangicKonulari(dersler: readonly YksDers[], oran: number): string[] {
  if (oran <= 0) return []
  return dersler.flatMap((d) => d.konular.slice(0, Math.floor(d.konular.length * oran)).map((k) => k.id))
}

/**
 * Hızlı başlangıç kartının gösterildiği oturumlar — kalıcı bayrak
 * (`rabi-konu-takibi-hizli-baslangic`, sürümlü). Kart her oturumda bir
 * kez: seçim yapıldı ya da "Atla"ya basıldıysa bir daha çıkmıyor.
 */
export type HizliBaslangicBayragi = { surum: 1; gosterilen: YksOturum[] }

export const BOS_HIZLI_BAYRAK: HizliBaslangicBayragi = { surum: 1, gosterilen: [] }

/** Depodaki bayrağı güvenli okur; bozuk ya da bilinmeyen sürüm boş sayılıyor. */
export function hizliBayragiCoz(ham: unknown): HizliBaslangicBayragi {
  if (typeof ham !== 'object' || ham === null) return BOS_HIZLI_BAYRAK
  const nesne = ham as Record<string, unknown>
  if (nesne.surum !== 1 || !Array.isArray(nesne.gosterilen)) return BOS_HIZLI_BAYRAK
  const gosterilen = (['tyt', 'ayt'] as const).filter((o) => (nesne.gosterilen as unknown[]).includes(o))
  return { surum: 1, gosterilen }
}
