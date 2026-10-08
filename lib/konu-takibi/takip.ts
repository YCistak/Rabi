import { KONU_DERSLERI, KONU_SINIFLARI, programBul, tumKonular } from '../konu'
import type { Konu, KonuDersId, KonuSinifi } from '../konu/tip'
import { konuBitti, konuTamam, type KonuIlerlemeleri } from '../konu/ilerleme'
import { HARITA_ESLEMESI } from './harita-eslemesi'
import type { PuanTuru } from '../types'
import { asamaYaz, type ElleAsama, type YazilanAlan, type YksKonuKaydi, type YksTakip } from './kayit'
import { satirKimlikleri, sinifDersleri, type TakipSatiri } from './okul-dersleri'
import { HARITASIZ_SINIF, YKS_SINIFLARI, ogrenciMufredati, type YksSinif } from './sinif'

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
  return birlesikHaritaDurumu([yksKonuId], ilerlemeler)
}

/**
 * Birden çok YKS konusunun (birleşen satır) haritadaki ortak durumu: eşli
 * harita konularının birleşimi, her biri bir kez.
 */
export function birlesikHaritaDurumu(yksKonuIdleri: readonly string[], ilerlemeler: KonuIlerlemeleri): HaritaDurumu | null {
  const kimlikler = [...new Set(yksKonuIdleri.flatMap((id) => HARITA_ESLEMESI[id] ?? []))]
  if (kimlikler.length === 0) return null
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
  return satirDurumu({ id: konuId, ad: '' }, takip, ilerlemeler)
}

/**
 * Birleşen satırın tek kaydı: her alan, kimliklerden **herhangi birinde**
 * varsa var, günü en erkeni. "Hepsinde" sayılsaydı yalnız TYT yarısı eski
 * sürümde işaretlenmiş satır boş görünür, işaret kaybolmuş sanılırdı.
 */
export function birlesikKayit(kimlikler: readonly string[], takip: YksTakip): YksKonuKaydi {
  const sonuc: YksKonuKaydi = {}
  for (const id of kimlikler) {
    const kayit = takip.konular[id]
    if (!kayit) continue
    for (const alan of ['okul', 'soru', 'bitti'] as const) {
      const gun = kayit[alan]
      if (gun && (sonuc[alan] === undefined || gun < sonuc[alan]!)) sonuc[alan] = gun
    }
  }
  return sonuc
}

/** Ekrandaki satırın durumu — tek konu ya da birleşen TYT–AYT çifti. */
export function satirDurumu(satir: TakipSatiri, takip: YksTakip, ilerlemeler: KonuIlerlemeleri): KonuDurumu {
  const kimlikler = satirKimlikleri(satir)
  const kayit = kimlikler.length === 1 ? (takip.konular[kimlikler[0]] ?? {}) : birlesikKayit(kimlikler, takip)
  const harita = birlesikHaritaDurumu(kimlikler, ilerlemeler)
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

/** Satırları olan her şey: okul dersi (`TakipDersi`) ya da YKS dersi. */
export type SatirliDers = { konular: readonly TakipSatiri[] }

/**
 * Satırı işaretler ya da kaldırır; birleşen satırda iki kimliğe birden
 * yazılıyor (zaten işaretli olanın ilk günü korunuyor — `asamaYaz`).
 */
export function satirYaz(takip: YksTakip, satir: TakipSatiri, alan: YazilanAlan, acik: boolean, bugun: string): YksTakip {
  return satirKimlikleri(satir).reduce((t, id) => asamaYaz(t, id, alan, acik, bugun), takip)
}

export function dersOzeti(
  ders: SatirliDers,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): DersOzeti {
  const ozet: DersOzeti = { ...BOS_OZET }
  for (const konu of ders.konular) {
    const d = satirDurumu(konu, takip, ilerlemeler)
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
export function siradakiKonu<S extends TakipSatiri>(
  ders: { konular: readonly S[] },
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): S | null {
  for (const konu of ders.konular) {
    const d = satirDurumu(konu, takip, ilerlemeler)
    if (!d.bitti && !bitirmeyeHazir(d)) return konu
  }
  return null
}

/**
 * Giriş ekranının "Devam et" kartı: seçili sınıfta **en son dokunulan
 * dersin** sıradaki konusu (`siradakiKonu`). Dokunulan ders, elle işaretlenmiş (günü olan)
 * konulardan bulunuyor — bitirmek de dokunuş. Kayıtta saat değil gün var;
 * aynı gün dokunulan derslerde **listede sonra gelen** konunun dersi önde:
 * öğrenci listeyi yukarıdan aşağı işaretliyor, aynı gündeki en alttaki
 * büyük olasılıkla en son dokunulanı.
 *
 * En son dokunulan dersin önerisi kalmadıysa (her konu bitti ya da bitirmeye
 * hazır) bir önceki dokunulan derse bakılıyor. Hiç işaret yoksa `null` ve
 * kart çizilmiyor.
 */
export function devamKonusu<D extends SatirliDers>(
  dersler: readonly D[],
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): { ders: D; konu: D['konular'][number] } | null {
  const dokunulan: { ders: D; gun: string; sira: number }[] = []
  let sira = 0
  for (const ders of dersler) {
    let enSon: { gun: string; sira: number } | null = null
    for (const konu of ders.konular) {
      sira += 1
      const gun = sonIsaretGunu(birlesikKayit(satirKimlikleri(konu), takip))
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
// Sınıf sekmesi (ekranın en üstü)
// ---------------------------------------------------------------------------

/**
 * Konunun yol oranı (0–1): bitmişse 1, değilse dolu aşama / gösterilen aşama
 * — satırdaki ilerleme dairesinin oranı.
 */
export function konuOrani(durum: KonuDurumu): number {
  if (durum.bitti) return 1
  return durum.asamaToplam > 0 ? durum.dolu / durum.asamaToplam : 0
}

export type SinifSekmesi = {
  sinif: YksSinif
  /**
   * O sınıfın bütün satırlarının (görünen bütün dersler) ortalama yol oranı,
   * yüzde (0–100) — satırlardaki dairelerin ortalaması. Yalnızca
   * "Bitirdim"i saymak, okulda işaretlemeye başlayan öğrenciye haftalarca
   * %0 gösterirdi. Sekmede konu yoksa ya da "Yakında"ysa `null`.
   */
  yuzde: number | null
  /** Sınıfta konu yok ya da sınıf "Yakında": sekme seçilemiyor. */
  pasif: boolean
  /** Öğrencinin kendi sınıfı — küçük "sen" işareti. */
  sen: boolean
  /**
   * Eski programda (12/mezun) 12, görünen satırlarından hiçbiri haritaya eşli
   * değilse: açık, "harita yok". Sabit "harita yok" yanlış olurdu: 12'nin AYT
   * Matematik'i `mat12-*` destelerine, 2018'de 12'de okunan bazı konular
   * (XX. yüzyıl başları) 9–11 destelerine eşli.
   */
  haritasiz: boolean
  /** Maarif öğrencisinde (9–11) 12: programı yayımlanmadı, pasif ve "Yakında". */
  yakinda: boolean
}

/** Ekranın en üstündeki sekmeler: `9 · 10 · 11 · 12`, haritanın sınıf sekmesinin dili. */
export function sinifSekmeleri(
  alan: PuanTuru | null,
  buYilSinif: number,
  takip: YksTakip,
  ilerlemeler: KonuIlerlemeleri,
): SinifSekmesi[] {
  const maarif = ogrenciMufredati(buYilSinif) === 'maarif'
  return YKS_SINIFLARI.map((sinif): SinifSekmesi => {
    const satirlar = sinifDersleri(sinif, alan, buYilSinif).flatMap((d) => d.konular)
    const yakinda = maarif && sinif === HARITASIZ_SINIF
    const toplam = satirlar.reduce((t, s) => t + konuOrani(satirDurumu(s, takip, ilerlemeler)), 0)
    const bos = satirlar.length === 0 || yakinda
    return {
      sinif,
      yuzde: bos ? null : Math.round((toplam / satirlar.length) * 100),
      pasif: bos,
      sen: sinif === buYilSinif,
      haritasiz:
        !maarif &&
        sinif === HARITASIZ_SINIF &&
        !satirlar.some((s) => satirKimlikleri(s).some((id) => HARITA_ESLEMESI[id] !== undefined)),
      yakinda,
    }
  })
}

/**
 * Ders ekranının blokları: bölüm bölüm (Matematik → Geometri, Türk Dili ve
 * Edebiyatı → Dil ve Anlatım / Edebiyat). Ekran her bloğu yapışkan bir
 * başlıkla çiziyor.
 */
export type KonuBlogu<S extends TakipSatiri = TakipSatiri> = { bolum: string | null; konular: S[] }

export function konuBloklari<S extends TakipSatiri>(ders: { konular: readonly S[] }): KonuBlogu<S>[] {
  const bloklar: KonuBlogu<S>[] = []
  for (const konu of ders.konular) {
    const bolum = konu.bolum ?? null
    const son = bloklar.at(-1)
    if (son && son.bolum === bolum) son.konular.push(konu)
    else bloklar.push({ bolum, konular: [konu] })
  }
  return bloklar
}

// ---------------------------------------------------------------------------
// Toplu işaret
// ---------------------------------------------------------------------------

/**
 * "Bu ve önceki konuları okulda işlendi say"ın dokunacağı satırlar: ekranda
 * bu satırın üstünde duran (liste zaten seçili sınıfın, o dersin
 * satırları), **aynı bölümdeki**, okul aşaması boş olanlar — bu satır dahil.
 * İlk kullanımda okulda işlenmiş yirmi-kırk konuyu tek tek girmek yerine
 * tek dokunuş. Bölüm sınırı şart: Geometri'nin ilk konusunda basan öğrenci,
 * Matematik'in bütün konularını okulda işlemiş olmayabilir.
 */
export function oncekiOkulsuzlar<S extends TakipSatiri>(ders: { konular: readonly S[] }, satirId: string, takip: YksTakip): S[] {
  const liste = ders.konular
  const sira = liste.findIndex((k) => k.id === satirId)
  if (sira === -1) return []
  const bolum = liste[sira].bolum
  return liste
    .slice(0, sira + 1)
    .filter((k) => k.bolum === bolum && !birlesikKayit(satirKimlikleri(k), takip).okul)
}

/** Satırların bütün kayıt kimlikleri — toplu yazımın girdisi. */
export function satirlarinKimlikleri(satirlar: readonly TakipSatiri[]): string[] {
  return satirlar.flatMap((s) => [...satirKimlikleri(s)])
}

/** Birden çok konunun okul aşamasını işaretler ya da kaldırır (toplu eylem ve geri alması). */
export function okuluTopluYaz(takip: YksTakip, konuIdleri: readonly string[], acik: boolean, bugun: string): YksTakip {
  return konuIdleri.reduce((t, id) => asamaYaz(t, id, 'okul', acik, bugun), takip)
}

// ---------------------------------------------------------------------------
// Hızlı başlangıç: "N. sınıfta neredeyim?"
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

/** Derslerde (seçili sınıfın dersleri) hiç işaret yok mu — kart yalnızca o zaman çıkıyor. */
export function dersleriIsaretsiz(dersler: readonly SatirliDers[], takip: YksTakip): boolean {
  return dersler.every((d) => d.konular.every((k) => satirKimlikleri(k).every((id) => !takip.konular[id])))
}

/**
 * Seçilen orana göre okulda işlendi sayılacak kimlikler: **her dersin**
 * (seçili sınıfta) sırasındaki ilk ⌊n × oran⌋ satırı, bölüm sınırı
 * gözetmeden. Ders bazında, çünkü okul bütün dersleri aynı takvimde
 * ilerletiyor; tek bir toplam oran Türk Dili'ni bitirip Felsefe'ye hiç
 * dokunmamış gibi bir dağılım üretirdi.
 */
export function hizliBaslangicKonulari(dersler: readonly SatirliDers[], oran: number): string[] {
  if (oran <= 0) return []
  return dersler.flatMap((d) => satirlarinKimlikleri(d.konular.slice(0, Math.floor(d.konular.length * oran))))
}

/**
 * Hızlı başlangıç kartının gösterildiği sınıflar — kalıcı bayrak
 * (`rabi-konu-takibi-hizli-baslangic`, sürümlü). Kart her sınıfta bir kez:
 * seçim yapıldı ya da "Atla"ya basıldıysa o sınıfta bir daha çıkmıyor.
 *
 * Sürüm 2 sınıf tutuyor; sürüm 1 TYT/AYT oturumu tutuyordu. Sürüm 1'de kartı
 * bir kez görmüş (cevaplamış ya da atlamış) öğrenciye yeniden sorulmuyor:
 * bütün sınıflar gösterilmiş sayılıyor.
 */
export type HizliBaslangicBayragi = { surum: 2; gosterilen: YksSinif[] }

export const BOS_HIZLI_BAYRAK: HizliBaslangicBayragi = { surum: 2, gosterilen: [] }

/** Depodaki bayrağı güvenli okur; bozuk ya da bilinmeyen sürüm boş sayılıyor. */
export function hizliBayragiCoz(ham: unknown): HizliBaslangicBayragi {
  if (typeof ham !== 'object' || ham === null) return BOS_HIZLI_BAYRAK
  const nesne = ham as Record<string, unknown>
  if (!Array.isArray(nesne.gosterilen)) return BOS_HIZLI_BAYRAK
  const liste = nesne.gosterilen as unknown[]
  if (nesne.surum === 1) {
    const goruldu = liste.includes('tyt') || liste.includes('ayt')
    return goruldu ? { surum: 2, gosterilen: [...YKS_SINIFLARI] } : BOS_HIZLI_BAYRAK
  }
  if (nesne.surum !== 2) return BOS_HIZLI_BAYRAK
  return { surum: 2, gosterilen: YKS_SINIFLARI.filter((s) => liste.includes(s)) }
}
