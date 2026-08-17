/**
 * Haftalık özet — Rabi'nin "yıllık özet" tarzı hafta kapanışı.
 *
 * Burada yalnızca **hesap** var; nasıl gösterileceği
 * `components/ekranlar/haftalik-ozet.tsx` içinde. Ayrı durmasının sebebi bu
 * dosyanın tamamen saf olması: haftalar, sınırlar ve sıralama kuralları
 * test edilebilir kalıyor, ekran yalnızca çiziyor.
 *
 * Hafta **pazartesi–pazar**. Özet pazar günü çıkıyor, yani biten haftanın son
 * gününde: kullanıcı haftayı kapatırken görsün diye. Geçmiş haftalar da
 * görüntülenebiliyor (`haftaKaydir`).
 */

import type {
  Deneme,
  Devamsizlik,
  GunlukKayit,
  OyunId,
  OyunTurKaydi,
  PomodoroSeans,
  Sablon,
  YanlisSoru,
} from './types'
import { denemeOzeti, gunOzeti, hedefSerisi, kayitHaritasi, yuvarla } from './hesap'
import { haftaBasi, tariheCevir, tariheYaz } from './utils'

// ---------------------------------------------------------------------------
// Hafta aralığı
// ---------------------------------------------------------------------------

export type HaftaAraligi = {
  /** Pazartesi, 'YYYY-AA-GG' */
  baslangic: string
  /** Pazar, 'YYYY-AA-GG' */
  bitis: string
  /** Pazartesiden pazara yedi gün. */
  gunler: string[]
}

/** Verilen günün ait olduğu haftanın pazartesi–pazar aralığı. */
export function haftaAraligi(iso: string): HaftaAraligi {
  const baslangic = haftaBasi(iso)
  const gunler: string[] = []
  const gun = tariheCevir(baslangic)

  for (let i = 0; i < 7; i++) {
    gunler.push(tariheYaz(gun))
    gun.setDate(gun.getDate() + 1)
  }

  return { baslangic, bitis: gunler[6], gunler }
}

/** Hafta başını `adim` hafta ileri/geri kaydırır. Geçmiş haftalara bakmak için. */
export function haftaKaydir(haftaBasiIso: string, adim: number): string {
  const gun = tariheCevir(haftaBasiIso)
  gun.setDate(gun.getDate() + adim * 7)
  return tariheYaz(gun)
}

/** Bugün pazar mı — özetin çıkma günü. `getDay()`: 0 = pazar. */
export function pazarMi(iso: string): boolean {
  return tariheCevir(iso).getDay() === 0
}

/**
 * Özet gösterilmeye hazır mı.
 *
 * Yalnızca pazar günü bakılsaydı, o gün uygulamayı açmayan kullanıcı özeti
 * tamamen kaçırırdı. Bu yüzden özet pazar günü **doğuyor** ve sonraki pazara
 * kadar duruyor: içinde bulunulan haftanın özeti "henüz bitmedi" diye
 * gösterilmiyor, biten haftanınki bekliyor.
 */
export function bekleyenOzetHaftasi(bugunIso: string): string {
  // Pazar günü, biten hafta **bugünü de kapsıyor** (pazartesi–pazar); diğer
  // günlerde bir önceki hafta. İkisi de "en son tamamlanmış hafta"yı veriyor.
  if (pazarMi(bugunIso)) return haftaBasi(bugunIso)
  return haftaKaydir(haftaBasi(bugunIso), -1)
}

// ---------------------------------------------------------------------------
// Özet
// ---------------------------------------------------------------------------

export type HedefDurumu = 'asti' | 'tutturdu' | 'geride'

export type DersToplami = {
  ders: string
  soru: number
  /** Haftanın toplam sorusundaki payı, 0–1. */
  oran: number
}

export type DenemeNeti = {
  ad: string
  tarih: string
  net: number
}

export type HaftalikOzet = {
  hafta: HaftaAraligi

  /** 1 — Haftalık soru hedefi */
  toplamSoru: number
  haftalikHedef: number
  hedefFarki: number
  hedefDurumu: HedefDurumu
  /** Hedefin ne kadarı tamamlandı, 0–1 arasına kırpılmamış (aşınca 1'i geçer). */
  hedefOrani: number
  /** Hafta içinde günlük hedefin tutturulduğu gün sayısı. */
  hedefliGun: number

  /** Seri — hafta sonunda geçerli olan kesintisiz gün sayısı */
  seri: number

  /** 2 — Devamsızlık */
  devamsizlikOzurlu: number
  devamsizlikOzursuz: number
  devamsizlikToplam: number

  /** 3–4 — Pomodoro */
  pomodoroDakika: number
  pomodoroSeans: number
  pomodoroDers: { ders: string; dakika: number } | null

  /** 5 — Mini oyunlar */
  oyunDakika: number
  oyunTur: number
  oyunDogru: number
  enCokOynanan: OyunId | null

  /** 6 — Yanlış soru bankası */
  bankaCozulen: number

  /** 7–8 — Denemeler */
  denemeSayisi: number
  denemeEnYuksek: DenemeNeti | null
  denemeEnDusuk: DenemeNeti | null
  denemeOrtalama: number | null

  /** 9 — En çok soru çözülen dersler, çoktan aza, en fazla üç */
  ilkUcDers: DersToplami[]

  /** Hiçbir alanda veri yoksa özet gösterilmez. */
  bosMu: boolean
}

export type OzetGirdisi = {
  haftaBasiIso: string
  gunlukKayitlar: GunlukKayit[]
  gunlukHedef: number
  devamsizlik: Devamsizlik[]
  pomodoroGecmis: PomodoroSeans[]
  oyunGecmisi: OyunTurKaydi[]
  yanlisSorular: YanlisSoru[]
  denemeler: Deneme[]
  sablonlar: Sablon[]
}

export function haftalikOzet(girdi: OzetGirdisi): HaftalikOzet {
  const hafta = haftaAraligi(girdi.haftaBasiIso)
  const gunKumesi = new Set(hafta.gunler)
  const harita = kayitHaritasi(girdi.gunlukKayitlar)

  // --- Soru sayıları ve dersler ---
  let toplamSoru = 0
  let hedefliGun = 0
  const dersToplamlari = new Map<string, number>()

  for (const gun of hafta.gunler) {
    const kayit = harita.get(gun)
    const ozet = gunOzeti(kayit)
    toplamSoru += ozet.toplam
    if (girdi.gunlukHedef > 0 && ozet.toplam >= girdi.gunlukHedef) hedefliGun++

    for (const satir of kayit?.kayitlar ?? []) {
      dersToplamlari.set(satir.ders, (dersToplamlari.get(satir.ders) ?? 0) + satir.toplam)
    }
  }

  const haftalikHedef = Math.max(0, girdi.gunlukHedef) * 7
  const hedefFarki = toplamSoru - haftalikHedef

  // --- Devamsızlık ---
  let devamsizlikOzurlu = 0
  let devamsizlikOzursuz = 0
  for (const kayit of girdi.devamsizlik) {
    if (!gunKumesi.has(kayit.tarih)) continue
    const gun = kayit.yarimGun ? 0.5 : 1
    if (kayit.tur === 'ozurlu') devamsizlikOzurlu += gun
    else devamsizlikOzursuz += gun
  }

  // --- Pomodoro ---
  let pomodoroDakika = 0
  let pomodoroSeans = 0
  const dersDakikalari = new Map<string, number>()

  for (const seans of girdi.pomodoroGecmis) {
    /*
      `baslangic` UTC bir zaman damgası (`toISOString`); ilk on karakteri
      kesmek **yanlış gün** verir. Türkiye'de gece 01.30'da başlayan bir seans
      UTC'de bir önceki günde görünür — pazartesi gecesi çalışan biri o seansı
      geçen haftanın özetinde bulurdu. Yerel tarihe çevriliyor.
    */
    if (!gunKumesi.has(tariheYaz(new Date(seans.baslangic)))) continue
    pomodoroDakika += seans.dakika
    pomodoroSeans++
    const ders = seans.ders?.trim()
    if (ders) dersDakikalari.set(ders, (dersDakikalari.get(ders) ?? 0) + seans.dakika)
  }

  // --- Mini oyunlar ---
  let oyunSaniye = 0
  let oyunTur = 0
  let oyunDogru = 0
  const oyunTurlari = new Map<OyunId, number>()

  for (const kayit of girdi.oyunGecmisi) {
    if (!gunKumesi.has(kayit.tarih)) continue
    oyunSaniye += kayit.saniye
    oyunDogru += kayit.dogru
    oyunTur++
    oyunTurlari.set(kayit.oyun, (oyunTurlari.get(kayit.oyun) ?? 0) + 1)
  }

  // --- Yanlış soru bankası ---
  const bankaCozulen = girdi.yanlisSorular.filter(
    (s) => s.cozuldu && s.cozulmeTarihi !== undefined && gunKumesi.has(s.cozulmeTarihi),
  ).length

  // --- Denemeler ---
  const sablonHaritasi = new Map(girdi.sablonlar.map((s) => [s.id, s]))
  const netler: DenemeNeti[] = []

  for (const deneme of girdi.denemeler) {
    if (!gunKumesi.has(deneme.tarih)) continue
    const sablon = sablonHaritasi.get(deneme.sablonId)
    // Şablonu silinmiş deneme netlenemiyor; ortalamayı 0 ile bozmasın diye atlanıyor.
    if (!sablon) continue
    netler.push({
      ad: deneme.ad,
      tarih: deneme.tarih,
      net: denemeOzeti(deneme, sablon).toplamNet,
    })
  }

  const sirali = [...netler].sort((a, b) => b.net - a.net)
  const denemeOrtalama =
    netler.length > 0 ? yuvarla(netler.reduce((t, n) => t + n.net, 0) / netler.length) : null

  // --- İlk üç ders ---
  const ilkUcDers: DersToplami[] = [...dersToplamlari.entries()]
    .filter(([, soru]) => soru > 0)
    // Eşitlikte ders adına göre: sıralama her açılışta aynı çıksın, kart değişmesin.
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'))
    .slice(0, 3)
    .map(([ders, soru]) => ({
      ders,
      soru,
      oran: toplamSoru > 0 ? soru / toplamSoru : 0,
    }))

  return {
    hafta,
    toplamSoru,
    haftalikHedef,
    hedefFarki,
    hedefDurumu: hedefDurumuBul(toplamSoru, haftalikHedef),
    hedefOrani: haftalikHedef > 0 ? toplamSoru / haftalikHedef : 0,
    hedefliGun,
    // Seri haftanın **son gününden** geriye sayılıyor: özet o haftayı kapatıyor,
    // bugünden sayılsaydı geçmiş bir haftanın özeti bugünkü seriyi gösterirdi.
    seri: hedefSerisi(girdi.gunlukKayitlar, girdi.gunlukHedef, hafta.bitis),
    devamsizlikOzurlu,
    devamsizlikOzursuz,
    devamsizlikToplam: devamsizlikOzurlu + devamsizlikOzursuz,
    pomodoroDakika,
    pomodoroSeans,
    pomodoroDers: enBuyuk(dersDakikalari),
    oyunDakika: Math.round(oyunSaniye / 60),
    oyunTur,
    oyunDogru,
    enCokOynanan: enCokOynananBul(oyunTurlari),
    bankaCozulen,
    denemeSayisi: netler.length,
    denemeEnYuksek: sirali[0] ?? null,
    denemeEnDusuk: sirali.length > 1 ? sirali[sirali.length - 1] : (sirali[0] ?? null),
    denemeOrtalama,
    ilkUcDers,
    bosMu:
      toplamSoru === 0 &&
      pomodoroDakika === 0 &&
      oyunTur === 0 &&
      bankaCozulen === 0 &&
      netler.length === 0 &&
      devamsizlikOzurlu + devamsizlikOzursuz === 0,
  }
}

function hedefDurumuBul(toplam: number, hedef: number): HedefDurumu {
  if (hedef <= 0) return 'tutturdu'
  // "Tutturdu" bir aralık, tek bir sayı değil: hedefin %98'ini yapmış birine
  // "geride kaldın" demek, haftanın tamamını yok saymak olurdu.
  if (toplam >= hedef * 1.1) return 'asti'
  if (toplam >= hedef * 0.98) return 'tutturdu'
  return 'geride'
}

function enBuyuk(harita: Map<string, number>): { ders: string; dakika: number } | null {
  let enIyi: { ders: string; dakika: number } | null = null
  for (const [ders, dakika] of harita) {
    if (!enIyi || dakika > enIyi.dakika) enIyi = { ders, dakika }
  }
  return enIyi
}

function enCokOynananBul(harita: Map<OyunId, number>): OyunId | null {
  let enIyi: OyunId | null = null
  let enCok = 0
  for (const [oyun, adet] of harita) {
    if (adet > enCok) {
      enIyi = oyun
      enCok = adet
    }
  }
  return enIyi
}

// ---------------------------------------------------------------------------
// Yazı yardımcıları
// ---------------------------------------------------------------------------

/** "12–18 Ocak" gibi bir hafta başlığı. */
export function haftaYaz(hafta: HaftaAraligi): string {
  const bas = tariheCevir(hafta.baslangic)
  const son = tariheCevir(hafta.bitis)
  const ay = (t: Date) => t.toLocaleDateString('tr-TR', { month: 'long' })

  if (bas.getMonth() === son.getMonth()) {
    return `${bas.getDate()}–${son.getDate()} ${ay(son)}`
  }
  return `${bas.getDate()} ${ay(bas)} – ${son.getDate()} ${ay(son)}`
}

/** Dakikayı "1 sa 20 dk" biçiminde yazar; bir saatin altında sadece dakika. */
export function dakikaYaz(dakika: number): string {
  if (dakika < 60) return `${dakika} dk`
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  return kalan === 0 ? `${saat} sa` : `${saat} sa ${kalan} dk`
}

/*
  Yüzdenin ardına gelen iyelik eki, sayının **okunuşundaki son sözcüğe** göre
  değişiyor: %49 "kırk dokuz" okunduğu için "%49'u", %40 "kırk" olduğu için
  "%40'ı", %100 "yüz" olduğu için "%100'ü". Sabit bir ek yazmak ("%49'i")
  hepsinde yanlış olur.
*/
const BIRLER_EKI: Record<number, string> = {
  1: 'i', 2: 'i', 3: 'ü', 4: 'ü', 5: 'i', 6: 'ı', 7: 'i', 8: 'i', 9: 'u',
}
const ONLAR_EKI: Record<number, string> = {
  10: 'u', 20: 'i', 30: 'u', 40: 'ı', 50: 'i', 60: 'ı', 70: 'i', 80: 'i', 90: 'ı',
}

/** Sayının okunuşuna uyan iyelik eki: 49 → "u", 40 → "ı", 100 → "ü". */
export function sayiEki(sayi: number): string {
  const tam = Math.abs(Math.round(sayi))
  const birler = tam % 10
  if (birler !== 0) return BIRLER_EKI[birler]

  const onlar = tam % 100
  if (onlar !== 0) return ONLAR_EKI[onlar]

  // Yüz ve katları "yüz" ile bitiyor; sıfır "sıfır".
  return tam === 0 ? 'ı' : 'ü'
}

/** "%49'u" gibi, ekiyle birlikte yüzde yazar. */
export function yuzdeYaz(oran: number): string {
  const yuzde = Math.round(oran * 100)
  return `%${yuzde}'${sayiEki(yuzde)}`
}

/** Yarım günleri "1,5" gibi yazar; tam sayılarda virgül göstermez. */
export function gunYaz(gun: number): string {
  return Number.isInteger(gun) ? String(gun) : gun.toFixed(1).replace('.', ',')
}
