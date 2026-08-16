import type {
  Deneme,
  DersSonuc,
  Devamsizlik,
  OkulYili,
  GunlukKayit,
  OsymTest,
  Sablon,
  SablonDers,
} from './types'
import { haftaBasi } from './utils'

/** Ondalık gösterimde kayan nokta artıklarını temizler (0.30000000000000004 gibi). */
export function yuvarla(sayi: number, basamak = 2): number {
  const carpan = 10 ** basamak
  return Math.round(sayi * carpan) / carpan
}

/** Tek dersin neti: doğru − yanlış / katsayı. */
export function net(dogru: number, yanlis: number, yanlisKatsayi = 4): number {
  if (yanlisKatsayi <= 0) return yuvarla(dogru)
  return yuvarla(dogru - yanlis / yanlisKatsayi)
}

/**
 * Şablonun yanlış cezasını okunur biçimde yazar: "4 yanlış 1 doğruyu götürür".
 * Katsayı 0 veya altındaysa net = doğru olur, yani yanlışın cezası yoktur.
 */
export function katsayiYaz(yanlisKatsayi: number): string {
  if (yanlisKatsayi <= 0) return 'yanlış net düşürmez'
  return `${netYaz(yanlisKatsayi, yanlisKatsayi % 1 === 0 ? 0 : 2)} yanlış 1 doğruyu götürür`
}

/** Netleri "12,25" gibi Türkçe biçimde yazar. */
export function netYaz(deger: number, basamak = 2): string {
  return deger.toLocaleString('tr-TR', {
    minimumFractionDigits: basamak,
    maximumFractionDigits: basamak,
  })
}

export function tarihYaz(isoTarih: string): string {
  const [yil, ay, gun] = isoTarih.split('-').map(Number)
  if (!yil || !ay || !gun) return isoTarih
  return new Date(yil, ay - 1, gun).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Doğru + yanlış, dersin soru sayısını aşamaz; negatif değer de kabul edilmez. */
export function sonucGecerliMi(sonuc: DersSonuc, ders: SablonDers): boolean {
  if (sonuc.dogru < 0 || sonuc.yanlis < 0) return false
  if (!Number.isInteger(sonuc.dogru) || !Number.isInteger(sonuc.yanlis)) return false
  return sonuc.dogru + sonuc.yanlis <= ders.soruSayisi
}

export type DenemeOzeti = {
  dersNetleri: Record<string, number>
  toplamNet: number
  toplamDogru: number
  toplamYanlis: number
  toplamBos: number
  toplamSoru: number
}

/** Bir denemenin ders bazlı netleri ve toplamı. */
export function denemeOzeti(deneme: Deneme, sablon: Sablon): DenemeOzeti {
  const dersNetleri: Record<string, number> = {}
  let toplamNet = 0
  let toplamDogru = 0
  let toplamYanlis = 0
  let toplamSoru = 0

  for (const ders of sablon.dersler) {
    const sonuc = deneme.sonuclar.find((s) => s.dersId === ders.id)
    const dogru = sonuc?.dogru ?? 0
    const yanlis = sonuc?.yanlis ?? 0
    const dersNeti = net(dogru, yanlis, sablon.yanlisKatsayi)

    dersNetleri[ders.id] = dersNeti
    toplamNet += dersNeti
    toplamDogru += dogru
    toplamYanlis += yanlis
    toplamSoru += ders.soruSayisi
  }

  return {
    dersNetleri,
    toplamNet: yuvarla(toplamNet),
    toplamDogru,
    toplamYanlis,
    toplamBos: toplamSoru - toplamDogru - toplamYanlis,
    toplamSoru,
  }
}

/** Denemeleri tarihe göre eskiden yeniye sıralar (eşitlikte kayıt sırası korunur). */
export function tarihSirala(denemeler: Deneme[]): Deneme[] {
  return [...denemeler].sort((a, b) => a.tarih.localeCompare(b.tarih))
}

export type DersIstatistigi = {
  ders: SablonDers
  ortalama: number
  /** Son 3 denemenin ortalaması — yakın dönemdeki gidişat. */
  sonOrtalama: number
  /** sonOrtalama − ortalama: pozitifse yükselişte. */
  fark: number
  enIyi: number
  enKotu: number
  /** Ortalama netin soru sayısına oranı (%) — dersleri kıyaslamayı sağlar. */
  yuzde: number
}

/** Belirli bir şablonun denemeleri için ders bazlı ortalama ve gidişat. */
export function dersIstatistikleri(denemeler: Deneme[], sablon: Sablon): DersIstatistigi[] {
  const sirali = tarihSirala(denemeler)
  if (sirali.length === 0) return []

  const ozetler = sirali.map((d) => denemeOzeti(d, sablon))
  const sonKac = Math.min(3, ozetler.length)
  const sonOzetler = ozetler.slice(-sonKac)

  return sablon.dersler.map((ders) => {
    const netler = ozetler.map((o) => o.dersNetleri[ders.id] ?? 0)
    const sonNetler = sonOzetler.map((o) => o.dersNetleri[ders.id] ?? 0)
    const ortalama = yuvarla(netler.reduce((a, b) => a + b, 0) / netler.length)
    const sonOrtalama = yuvarla(sonNetler.reduce((a, b) => a + b, 0) / sonNetler.length)

    return {
      ders,
      ortalama,
      sonOrtalama,
      fark: yuvarla(sonOrtalama - ortalama),
      enIyi: yuvarla(Math.max(...netler)),
      enKotu: yuvarla(Math.min(...netler)),
      yuzde: ders.soruSayisi > 0 ? yuvarla((ortalama / ders.soruSayisi) * 100, 1) : 0,
    }
  })
}

export type TrendNoktasi = { deneme: Deneme; toplamNet: number }

/** Toplam net serisi — grafik bunu çizer. */
export function trendSerisi(denemeler: Deneme[], sablon: Sablon): TrendNoktasi[] {
  return tarihSirala(denemeler).map((deneme) => ({
    deneme,
    toplamNet: denemeOzeti(deneme, sablon).toplamNet,
  }))
}

/**
 * Denemenin netlerini ÖSYM test bloklarına toplar — puan hesabının girdisi.
 * Birden çok ders aynı bloğa bağlıysa (TYT Sosyal = Tarih + Coğrafya + Felsefe + Din)
 * netleri toplanır. `osymTesti` verilmemiş dersler dışarıda kalır.
 */
export function osymNetleri(deneme: Deneme, sablon: Sablon): Partial<Record<OsymTest, number>> {
  const ozet = denemeOzeti(deneme, sablon)
  const netler: Partial<Record<OsymTest, number>> = {}

  for (const ders of sablon.dersler) {
    if (!ders.osymTesti) continue
    const dersNeti = ozet.dersNetleri[ders.id] ?? 0
    netler[ders.osymTesti] = yuvarla((netler[ders.osymTesti] ?? 0) + dersNeti)
  }

  return netler
}

// ---------------------------------------------------------------------------
// Okul notları / OBP
// Kaynak: MEB Ortaöğretim Kurumları Yönetmeliği MADDE 51, 53, 54, 55 ve 65.
// ---------------------------------------------------------------------------

/** Yönetmelik: puan hesaplarında bölme işlemi virgülden sonra dört basamak yürütülür. */
const MEB_BASAMAK = 4

/** Ortaöğretim dört yıldır; diploma notu bu dört yılın ortalamasıdır (MADDE 65). */
export const ORTAOGRETIM_YIL_SAYISI = 4

export const ILK_SINIF = 9
export const SON_SINIF = 12
export const SINIFLAR = [9, 10, 11, 12]

/**
 * Verilen tarihin ait olduğu eğitim-öğretim yılı, başladığı takvim yılıyla:
 * 2025-2026 ders yılı → 2025. Yeni ders yılı eylülde başladığı kabul edilir.
 */
export function egitimYili(tarih: Date = new Date()): number {
  return tarih.getMonth() >= 8 ? tarih.getFullYear() : tarih.getFullYear() - 1
}

/**
 * Kayıtlı sınıfı aradan geçen ders yılı kadar ilerletir: 10. sınıf bir sonraki
 * eylülde 11 olur. 12'de durur, geriye gitmez (telefon saati şaşarsa diye).
 */
export function ilerlemisSinif(sinif: number, kayitliYil: number, buYil: number): number {
  const gecen = buYil - kayitliYil
  if (gecen <= 0) return sinif
  return Math.min(SON_SINIF, sinif + gecen)
}

/** "4 yılın üçü" gibi ifadelerde sayının Türkçe belirtme eki: 3 → "üçü". */
export function yilSayisiYaz(sayi: number): string {
  const yaziyla: Record<number, string> = { 1: 'biri', 2: 'ikisi', 3: 'üçü', 4: 'dördü' }
  return yaziyla[sayi] ?? `${sayi} tanesi`
}

export type ObpSonucu = {
  /** Mezuniyet puanı = diploma notu (MADDE 65). */
  diplomaNotu: number
  obp: number
  /** Verisi girilmiş yıl sayısı (en fazla 4). */
  girilenYil: number
  /** Diploma notunun dayandığı yıl sayısı — her zaman 4. */
  toplamYil: number
  /**
   * Sonuç kesin mi: dört yıl da girili **ve** hiçbiri dönem sonu notuna dayanmıyor.
   * Aksi hâlde eksik ya da yarım veriye dayanan bir tahmindir.
   */
  tamMi: boolean
  /** Kaç yılın notu 1. dönem sonundan geliyor (yıl sonu değil). */
  tahminiYil: number
}

/**
 * OBP tahmini = diploma notu × 5, 250–500 aralığına kırpılır (ÖSYM).
 *
 * Diploma notu **dört yılın** (9, 10, 11, 12) yıl sonu başarı puanlarının aritmetik
 * ortalamasıdır — MEB Ortaöğretim Kurumları Yönetmeliği MADDE 65. Dört yılın hepsi
 * girilmediyse eksik yılların, girilmiş yılların ortalamasıyla aynı olacağı varsayılır;
 * bu durumda `tamMi` false döner ve arayüz sonucun eksik veriye dayandığını yazar.
 *
 * İçinde bulunulan yılın notu 1. dönem sonu notu olabilir (`donemSonu`); o da yılın
 * tamamı için tahmin sayılır, bu yüzden `tahminiYil` ile ayrıca bildiriliyor.
 */
export function obpTahmini(yillar: OkulYili[]): ObpSonucu | null {
  const gecerli = yillar.filter((y) => Number.isFinite(y.ortalama))
  if (gecerli.length === 0) return null

  const toplam = gecerli.reduce((a, y) => a + y.ortalama, 0)
  // Eksik yıl varsa girilenlerin ortalaması o yıllara da yazılır; dört yıla bölmek
  // matematiksel olarak girilenlerin ortalamasına eşittir.
  const diplomaNotu = yuvarla(toplam / gecerli.length, MEB_BASAMAK)
  const obp = Math.min(500, Math.max(250, yuvarla(diplomaNotu * 5)))

  return {
    diplomaNotu,
    obp,
    girilenYil: Math.min(gecerli.length, ORTAOGRETIM_YIL_SAYISI),
    toplamYil: ORTAOGRETIM_YIL_SAYISI,
    tamMi: gecerli.length >= ORTAOGRETIM_YIL_SAYISI && !gecerli.some((y) => y.donemSonu),
    tahminiYil: gecerli.filter((y) => y.donemSonu).length,
  }
}

// ---------------------------------------------------------------------------
// Soru takibi
// ---------------------------------------------------------------------------

export type GunOzeti = {
  toplam: number
  dogru: number
  yanlis: number
  bos: number
  net: number
}

/**
 * Bir günün soru dökümü. Kullanıcı toplam / doğru / yanlış girer; **boş hesaplanır**.
 * Doğru + yanlış toplamı aşarsa boş negatife düşmesin diye sıfırda tutulur.
 */
export function gunOzeti(kayit: GunlukKayit | undefined): GunOzeti {
  const bos: GunOzeti = { toplam: 0, dogru: 0, yanlis: 0, bos: 0, net: 0 }
  if (!kayit) return bos

  for (const satir of kayit.kayitlar) {
    bos.toplam += satir.toplam
    bos.dogru += satir.dogru
    bos.yanlis += satir.yanlis
  }
  bos.bos = Math.max(0, bos.toplam - bos.dogru - bos.yanlis)
  bos.net = net(bos.dogru, bos.yanlis)
  return bos
}

/** Tek bir ders satırının boş sayısı — girişin hemen altında gösterilir. */
export function bosSayisi(satir: { toplam: number; dogru: number; yanlis: number }): number {
  return Math.max(0, satir.toplam - satir.dogru - satir.yanlis)
}

/** Tarihten kayda hızlı erişim için indeks. */
export function kayitHaritasi(kayitlar: GunlukKayit[]): Map<string, GunlukKayit> {
  return new Map(kayitlar.map((k) => [k.tarih, k]))
}

/** Belirli bir günün toplam soru sayısı. */
export function gunlukToplam(kayitlar: GunlukKayit[], tarih: string): number {
  return gunOzeti(kayitlar.find((k) => k.tarih === tarih)).toplam
}

/** Hafta başı ('YYYY-AA-GG', pazartesi) → o hafta çözülen toplam soru. */
export function haftalikToplamlar(kayitlar: GunlukKayit[]): Map<string, number> {
  const haftalar = new Map<string, number>()
  for (const kayit of kayitlar) {
    const anahtar = haftaBasi(kayit.tarih)
    haftalar.set(anahtar, (haftalar.get(anahtar) ?? 0) + gunOzeti(kayit).toplam)
  }
  return haftalar
}

/**
 * Bugünden geriye doğru hedefin tutturulduğu kesintisiz gün sayısı.
 * Bugün henüz tutturulmadıysa seri dünden sayılır — gün ortasında sıfıra düşmesin.
 */
export function hedefSerisi(kayitlar: GunlukKayit[], hedef: number, bugunIso: string): number {
  if (hedef <= 0) return 0
  const harita = kayitHaritasi(kayitlar)
  const gun = new Date(
    Number(bugunIso.slice(0, 4)),
    Number(bugunIso.slice(5, 7)) - 1,
    Number(bugunIso.slice(8, 10)),
  )

  const iso = (t: Date) =>
    `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`

  // Bugün hedefi tutturulmadıysa seriyi kırmadan dünden başla.
  if (gunOzeti(harita.get(iso(gun))).toplam < hedef) gun.setDate(gun.getDate() - 1)

  let seri = 0
  while (gunOzeti(harita.get(iso(gun))).toplam >= hedef) {
    seri++
    gun.setDate(gun.getDate() - 1)
  }
  return seri
}

// ---------------------------------------------------------------------------
// Devamsızlık
// MEB Ortaöğretim Kurumları Yönetmeliği MADDE 36: özürsüz 10, özürlü dahil
// toplam 20 gün devamsızlık hakkı. Aşılırsa öğrenci başarısız sayılır.
// ---------------------------------------------------------------------------

export const OZURSUZ_SINIR = 10
export const OZURLU_SINIR = 20

/** Uyarının sarıya döndüğü oran — sınırın %70'i. */
export const DEVAMSIZLIK_UYARI_ORANI = 0.7

export type DevamsizlikOzeti = {
  ozurlu: number
  ozursuz: number
  ozurluKalan: number
  ozursuzKalan: number
  /** Herhangi bir sınır aşıldı mı. */
  asildi: boolean
  /** Sınıra yaklaşıldı mı (henüz aşılmadı). */
  uyari: boolean
}

export function devamsizlikOzeti(kayitlar: Devamsizlik[]): DevamsizlikOzeti {
  let ozurlu = 0
  let ozursuz = 0

  for (const kayit of kayitlar) {
    const gun = kayit.yarimGun ? 0.5 : 1
    if (kayit.tur === 'ozurlu') ozurlu += gun
    else ozursuz += gun
  }

  const ozurluKalan = yuvarla(OZURLU_SINIR - ozurlu, 1)
  const ozursuzKalan = yuvarla(OZURSUZ_SINIR - ozursuz, 1)
  const asildi = ozurluKalan < 0 || ozursuzKalan < 0

  return {
    ozurlu: yuvarla(ozurlu, 1),
    ozursuz: yuvarla(ozursuz, 1),
    ozurluKalan,
    ozursuzKalan,
    asildi,
    uyari:
      !asildi &&
      (ozurlu >= OZURLU_SINIR * DEVAMSIZLIK_UYARI_ORANI ||
        ozursuz >= OZURSUZ_SINIR * DEVAMSIZLIK_UYARI_ORANI),
  }
}
