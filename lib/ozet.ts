/**
 * Aylık özet — Rabi'nin "yıllık özet" tarzı ay kapanışı.
 *
 * Burada yalnızca **hesap** var; nasıl gösterileceği
 * `components/ekranlar/aylik-ozet.tsx` içinde. Ayrı durmasının sebebi bu
 * dosyanın tamamen saf olması: ay sınırları, hafta dilimleri ve sıralama
 * kuralları test edilebilir kalıyor, ekran yalnızca çiziyor.
 *
 * Özet bir süre **haftalıktı** ve kurulum gününe yaslı yedi günlük dönemlerle
 * geliyordu. Aylığa geçti: haftada bir gelen hikâye kendini tekrar ediyordu ve
 * yedi günün sayıları tek bir kötü günle kolayca bozuluyordu. Ay takvim ayı —
 * kuruluma yaslanmıyor, çünkü "Eylül özeti" dediğinde herkes aynı şeyi
 * anlamalı ve ileride yıllık özet bu kayıtları ay ay toplayacak.
 *
 * Özet ayın kapanışından sonraki **ilk gün** ve yalnızca o gün görülüyor
 * (`bekleyenOzetAyi`); kaçırılan ay bir daha çıkmıyor ama hesabı arşive
 * yazılıyor (`AylikOzetArsivi`) — silinseydi yıllık özetin dayanacağı bir
 * şey kalmazdı.
 */

import type {
  Deneme,
  GunlukKayit,
  OyunId,
  OyunTurKaydi,
  PomodoroSeans,
  Sablon,
} from './types'
import type { KonuIlerlemeleri } from './konu/ilerleme'
import type { OkumaSeansi } from './konu/okuma-suresi'
import { denemeOzeti, gunOzeti, kayitHaritasi, yuvarla } from './hesap'
import { tariheCevir, tariheYaz } from './utils'

// ---------------------------------------------------------------------------
// Ay
// ---------------------------------------------------------------------------

/** Ayın anahtarı — 'YYYY-AA'. Arşivin ve "izlendi" listesinin kimliği. */
export type AyAnahtari = string

export type AyAraligi = {
  /** 'YYYY-AA' */
  anahtar: AyAnahtari
  yil: number
  /** 1–12 */
  ay: number
  /** Ayın ilk günü, 'YYYY-AA-GG' */
  baslangic: string
  /** Ayın son günü, 'YYYY-AA-GG' */
  bitis: string
  /** Baştan sona bütün günler. */
  gunler: string[]
}

/** Türkçe ay adları; `toLocaleDateString` yerine sabit — statik dışa aktarımda cihaz yereli değişebiliyor. */
export const AY_ADLARI = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

/** 'YYYY-AA' anahtarından ay aralığı. */
export function ayAraligi(anahtar: AyAnahtari): AyAraligi {
  const [yil, ay] = anahtar.split('-').map(Number)
  const gunSayisi = new Date(yil, ay, 0).getDate()
  const gunler: string[] = []
  for (let g = 1; g <= gunSayisi; g++) gunler.push(tariheYaz(new Date(yil, ay - 1, g)))
  return { anahtar, yil, ay, baslangic: gunler[0], bitis: gunler[gunSayisi - 1], gunler }
}

/** Günün ait olduğu ayın anahtarı. */
export function ayAnahtari(iso: string): AyAnahtari {
  return iso.slice(0, 7)
}

/** Anahtarı `adim` ay ileri/geri kaydırır. */
export function ayKaydir(anahtar: AyAnahtari, adim: number): AyAnahtari {
  const [yil, ay] = anahtar.split('-').map(Number)
  const t = new Date(yil, ay - 1 + adim, 1)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Bugün gösterilmeyi bekleyen özetin ayı; bugün ayın 1'i değilse `null`.
 *
 * Özet **yalnızca** ayın ilk günü görülüyor: Ağustos'un özeti 1 Eylül'de
 * çıkıyor, 2 Eylül'de kapanıyor. Kullanıcının kararı — hikâye bir kapanış
 * ânı, haftalarca duran bir kart değil. O gün açmayan kullanıcı o ayın
 * hikâyesini kaçırıyor; sayıları arşivde duruyor.
 */
export function bekleyenOzetAyi(bugunIso: string): AyAnahtari | null {
  if (tariheCevir(bugunIso).getDate() !== 1) return null
  return ayKaydir(ayAnahtari(bugunIso), -1)
}

/**
 * Bir sonraki özetin açılacağı gün — pasif kartın üstündeki tarih.
 *
 * Bugün ayın 1'iyse bugünü **değil** bir sonraki ayı veriyor: kart o gün ya
 * aktif (özet bekliyor) ya da izlenmiş/boş, iki hâlde de "bugün açılır"
 * yazmak anlamsız.
 */
export function sonrakiOzetGunu(bugunIso: string): string {
  return ayAraligi(ayKaydir(ayAnahtari(bugunIso), 1)).baslangic
}

/**
 * Kapanmış ama arşivde olmayan aylar, eskiden yeniye.
 *
 * Arşiv özet **görülsün görülmesin** doluyor: kaçırılan ay da yıllık özete
 * girmeli. `ilkVeriIso`dan (en eski kaydın günü) önceki aylar taranmıyor —
 * hiç veri olmayan ay için boş kayıt yazmanın anlamı yok.
 */
export function arsivdeEksikAylar(
  arsiv: AylikOzetArsivi,
  ilkVeriIso: string | null,
  bugunIso: string,
): AyAnahtari[] {
  if (!ilkVeriIso) return []
  const buAy = ayAnahtari(bugunIso)
  const eksik: AyAnahtari[] = []
  // En fazla 24 ay geriye: sonsuz döngü kalkanı ve zaten ondan eskisi kimseyi ilgilendirmiyor.
  for (let ay = ayAnahtari(ilkVeriIso), i = 0; ay < buAy && i < 24; ay = ayKaydir(ay, 1), i++) {
    if (!arsiv[ay]) eksik.push(ay)
  }
  return eksik
}

// ---------------------------------------------------------------------------
// Özet
// ---------------------------------------------------------------------------

export type DersToplami = {
  ders: string
  soru: number
  /** Ayın toplam sorusundaki payı, 0–1. */
  oran: number
  dogru: number
  yanlis: number
  bos: number
  /** Doğru / (doğru + yanlış), 0–1; hiç işaretli soru yoksa null. */
  basari: number | null
  /** Bu derste soru çözülen gün sayısı. */
  gunSayisi: number
}

export type DenemeNeti = {
  ad: string
  tarih: string
  net: number
  /** Şablonun toplam soru sayısı — halkadaki "/ 120 NET". */
  toplamSoru: number
}

/** Soru kartındaki çubuklardan biri — ayın bir haftası. */
export type HaftaToplami = {
  /** "1-7 Eyl" */
  ad: string
  baslangic: string
  bitis: string
  soru: number
}

export type OyunToplami = {
  oyun: OyunId
  soru: number
  tur: number
}

export type AylikOzet = {
  ay: AyAraligi

  /** 2 — Konu haritası */
  okunanKonu: number
  /** Herhangi bir kayıt (soru, pomodoro, oyun) girilen gün sayısı. */
  calisilanGun: number
  /** Ay içinde art arda çalışılan en uzun gün dizisi. */
  enUzunSeri: number
  /** Konu destesinde geçen dakika — "geçen süre". Pomodoro ve oyun ayrı. */
  okumaDakika: number

  /** 3 — Çözülen soru */
  toplamSoru: number
  haftalar: HaftaToplami[]

  /** 4 — Ayın en iyi denemeleri; o türden deneme yoksa null. */
  enIyiTyt: DenemeNeti | null
  enIyiAyt: DenemeNeti | null
  denemeSayisi: number

  /** 5 — Pomodoro */
  pomodoroDakika: number
  pomodoroSeans: number
  /** Ayın toplam dakikasındaki payı, 0–1. */
  pomodoroOrani: number
  enUzunGunDakika: number
  /** Art arda pomodoro yapılan en uzun gün dizisi. */
  pomodoroSeri: number

  /** 6 — Mini oyunlar */
  oyunSoru: number
  oyunTur: number
  oyunDakika: number
  /** En çok soru çözülen dört oyun, çoktan aza. */
  enCokOynananlar: OyunToplami[]

  /** 7–9 — En çok soru çözülen dersler, çoktan aza, en fazla üç */
  ilkUcDers: DersToplami[]

  /** 10 — Gelecek ayın hedefi (günlük hedef × gün sayısı); hedef yoksa 0. */
  sonrakiAyHedefi: number

  /** Hiçbir alanda veri yoksa özet gösterilmez. */
  bosMu: boolean
}

/** Arşiv: ay anahtarı → o ayın özeti. Yıllık özet buradan okuyacak. */
export type AylikOzetArsivi = Record<AyAnahtari, AylikOzet>

export type OzetGirdisi = {
  ay: AyAnahtari
  gunlukKayitlar: GunlukKayit[]
  gunlukHedef: number
  pomodoroGecmis: PomodoroSeans[]
  oyunGecmisi: OyunTurKaydi[]
  denemeler: Deneme[]
  sablonlar: Sablon[]
  konuIlerleme: KonuIlerlemeleri
  okumaGecmisi: OkumaSeansi[]
}

export function aylikOzet(girdi: OzetGirdisi): AylikOzet {
  const ay = ayAraligi(girdi.ay)
  const gunKumesi = new Set(ay.gunler)
  const harita = kayitHaritasi(girdi.gunlukKayitlar)
  /** Herhangi bir şey yapılan günler — "gün çalıştın" ve seri buradan. */
  const aktifGunler = new Set<string>()

  // --- Soru sayıları ve dersler ---
  let toplamSoru = 0
  const gunSorulari = new Map<string, number>()
  const dersler = new Map<string, { soru: number; dogru: number; yanlis: number; gunler: Set<string> }>()

  for (const gun of ay.gunler) {
    const kayit = harita.get(gun)
    const ozet = gunOzeti(kayit)
    toplamSoru += ozet.toplam
    gunSorulari.set(gun, ozet.toplam)
    if (ozet.toplam > 0) aktifGunler.add(gun)

    for (const satir of kayit?.kayitlar ?? []) {
      if (satir.toplam <= 0) continue
      const d = dersler.get(satir.ders) ?? { soru: 0, dogru: 0, yanlis: 0, gunler: new Set() }
      d.soru += satir.toplam
      d.dogru += satir.dogru
      d.yanlis += satir.yanlis
      d.gunler.add(gun)
      dersler.set(satir.ders, d)
    }
  }

  // Haftalar 1–7, 8–14, 15–21, 22–son: takvim haftasına değil ayın kendi
  // sayısına yaslı, yoksa ilk ve son dilim iki üç günlük kırıntı olurdu.
  // Son dilim 7–10 gün; dörde bölünen bir ay okunur, beşe bölünen sıkışır.
  const haftalar: HaftaToplami[] = []
  for (let bas = 0; bas < ay.gunler.length; bas += 7) {
    const sonDilim = bas + 14 > ay.gunler.length
    const son = sonDilim ? ay.gunler.length : bas + 7
    const dilim = ay.gunler.slice(bas, son)
    haftalar.push({
      ad: `${bas + 1}-${son} ${AY_ADLARI[ay.ay - 1].slice(0, 3)}`,
      baslangic: dilim[0],
      bitis: dilim[dilim.length - 1],
      soru: dilim.reduce((t, g) => t + (gunSorulari.get(g) ?? 0), 0),
    })
    if (sonDilim) break
  }

  // --- Pomodoro ---
  let pomodoroDakika = 0
  let pomodoroSeans = 0
  const gunDakikalari = new Map<string, number>()

  for (const seans of girdi.pomodoroGecmis) {
    /*
      `baslangic` UTC bir zaman damgası (`toISOString`); ilk on karakteri
      kesmek **yanlış gün** verir. Türkiye'de gece 01.30'da başlayan bir seans
      UTC'de bir önceki günde görünür — ayın ilk gecesi çalışan biri o seansı
      geçen ayın özetinde bulurdu. Yerel tarihe çevriliyor.
    */
    const gun = tariheYaz(new Date(seans.baslangic))
    if (!gunKumesi.has(gun)) continue
    pomodoroDakika += seans.dakika
    pomodoroSeans++
    gunDakikalari.set(gun, (gunDakikalari.get(gun) ?? 0) + seans.dakika)
    aktifGunler.add(gun)
  }

  // --- Mini oyunlar ---
  let oyunSaniye = 0
  let oyunTur = 0
  let oyunSoru = 0
  const oyunlar = new Map<OyunId, OyunToplami>()

  for (const kayit of girdi.oyunGecmisi) {
    if (!gunKumesi.has(kayit.tarih)) continue
    // Yanlış sayısı eski kayıtlarda yok; o turlarda yalnızca doğru sayılıyor —
    // uydurma bir yanlış eklemek soru sayısını şişirirdi.
    const soru = kayit.dogru + (kayit.yanlis ?? 0)
    oyunSaniye += kayit.saniye
    oyunTur++
    oyunSoru += soru
    aktifGunler.add(kayit.tarih)
    const o = oyunlar.get(kayit.oyun) ?? { oyun: kayit.oyun, soru: 0, tur: 0 }
    o.soru += soru
    o.tur++
    oyunlar.set(kayit.oyun, o)
  }

  // --- Denemeler ---
  const sablonHaritasi = new Map(girdi.sablonlar.map((s) => [s.id, s]))
  let enIyiTyt: DenemeNeti | null = null
  let enIyiAyt: DenemeNeti | null = null
  let denemeSayisi = 0

  for (const deneme of girdi.denemeler) {
    if (!gunKumesi.has(deneme.tarih)) continue
    const sablon = sablonHaritasi.get(deneme.sablonId)
    // Şablonu silinmiş deneme netlenemiyor; atlanıyor.
    if (!sablon) continue
    denemeSayisi++
    const neti: DenemeNeti = {
      ad: deneme.ad,
      tarih: deneme.tarih,
      net: yuvarla(denemeOzeti(deneme, sablon).toplamNet),
      toplamSoru: sablon.dersler.reduce((t, d) => t + d.soruSayisi, 0),
    }
    // Eşitlikte **ilk** deneme kalıyor (`>`): aynı veride her açılışta aynı tarih.
    if (sablon.tur === 'tyt' && (!enIyiTyt || neti.net > enIyiTyt.net)) enIyiTyt = neti
    if (sablon.tur === 'ayt' && (!enIyiAyt || neti.net > enIyiAyt.net)) enIyiAyt = neti
  }

  // --- Konu haritası ---
  // Bitiş günü tutulmuyor, son okuma günü tutuluyor (`tarih`): bitirilmiş bir
  // konu bu ay yeniden okunduysa bu aya sayılıyor. Ayrı bir bitiş damgası
  // eklemek eski kayıtları öksüz bırakırdı.
  const okunanKonu = Object.values(girdi.konuIlerleme).filter(
    (k) => k.bitti && gunKumesi.has(k.tarih),
  ).length

  // --- Konu okuma süresi ---
  let okumaSaniye = 0
  for (const seans of girdi.okumaGecmisi) {
    if (!gunKumesi.has(seans.tarih)) continue
    okumaSaniye += seans.saniye
    aktifGunler.add(seans.tarih)
  }

  // --- Dersler ---
  const ilkUcDers: DersToplami[] = [...dersler.entries()]
    // Eşitlikte ders adına göre: sıralama her açılışta aynı çıksın, kart değişmesin.
    .sort((a, b) => b[1].soru - a[1].soru || a[0].localeCompare(b[0], 'tr'))
    .slice(0, 3)
    .map(([ders, d]) => ({
      ders,
      soru: d.soru,
      oran: toplamSoru > 0 ? d.soru / toplamSoru : 0,
      dogru: d.dogru,
      yanlis: d.yanlis,
      bos: Math.max(0, d.soru - d.dogru - d.yanlis),
      basari: d.dogru + d.yanlis > 0 ? d.dogru / (d.dogru + d.yanlis) : null,
      gunSayisi: d.gunler.size,
    }))

  const sonrakiAy = ayAraligi(ayKaydir(ay.anahtar, 1))

  return {
    ay,
    okunanKonu,
    calisilanGun: aktifGunler.size,
    enUzunSeri: enUzunSeri(ay.gunler, aktifGunler),
    okumaDakika: Math.round(okumaSaniye / 60),
    toplamSoru,
    haftalar,
    enIyiTyt,
    enIyiAyt,
    denemeSayisi,
    pomodoroDakika,
    pomodoroSeans,
    pomodoroOrani: pomodoroDakika / (ay.gunler.length * 24 * 60),
    enUzunGunDakika: Math.max(0, ...gunDakikalari.values()),
    pomodoroSeri: enUzunSeri(ay.gunler, new Set(gunDakikalari.keys())),
    oyunSoru,
    oyunTur,
    oyunDakika: Math.round(oyunSaniye / 60),
    enCokOynananlar: [...oyunlar.values()]
      .sort((a, b) => b.soru - a.soru || b.tur - a.tur || a.oyun.localeCompare(b.oyun))
      .slice(0, 4),
    ilkUcDers,
    sonrakiAyHedefi: Math.max(0, girdi.gunlukHedef) * sonrakiAy.gunler.length,
    bosMu:
      toplamSoru === 0 &&
      pomodoroDakika === 0 &&
      oyunTur === 0 &&
      denemeSayisi === 0 &&
      okunanKonu === 0 &&
      okumaSaniye === 0,
  }
}

/** Sıralı gün listesinde kümeye ait art arda en uzun dizi. */
function enUzunSeri(gunler: string[], kume: Set<string>): number {
  let enUzun = 0
  let simdiki = 0
  for (const gun of gunler) {
    simdiki = kume.has(gun) ? simdiki + 1 : 0
    if (simdiki > enUzun) enUzun = simdiki
  }
  return enUzun
}

// ---------------------------------------------------------------------------
// Yazı yardımcıları
// ---------------------------------------------------------------------------

/** "Eylül" — kapaktaki büyük başlık için ay adı. */
export function ayAdi(ay: AyAraligi): string {
  return AY_ADLARI[ay.ay - 1]
}

/** "1 — 30 Eylül" gibi tarih aralığı. */
export function ayAraligiYaz(ay: AyAraligi): string {
  return `1 — ${ay.gunler.length} ${ayAdi(ay)}`
}

/*
  Ayın bulunma hâli: ünsüz uyumu ve ünlü uyumuna göre "-de/-da/-te/-ta".
  Tabloya yazıldı — kural üretmek on iki ad için gereksiz.
*/
const AY_DE = [
  "Ocak'ta", "Şubat'ta", "Mart'ta", "Nisan'da", "Mayıs'ta", "Haziran'da",
  "Temmuz'da", "Ağustos'ta", "Eylül'de", "Ekim'de", "Kasım'da", "Aralık'ta",
]

/** "Ekim'de" — 1–12 arası ay numarasından bulunma hâli. */
export function ayDe(ay: number): string {
  return AY_DE[ay - 1]
}

/** "1 Ekim'de" — bir günün bulunma hâli; ekran "… açılır" diye tamamlıyor. */
export function gunDe(iso: string): string {
  const t = tariheCevir(iso)
  return `${t.getDate()} ${ayDe(t.getMonth() + 1)}`
}

/** "14 Eylül" — deneme tarihi. */
export function gunAyYaz(iso: string): string {
  const t = tariheCevir(iso)
  return `${t.getDate()} ${AY_ADLARI[t.getMonth()]}`
}

/** Dakikayı "1 sa 20 dk" biçiminde yazar; bir saatin altında sadece dakika. */
export function dakikaYaz(dakika: number): string {
  if (dakika < 60) return `${dakika} dk`
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  return kalan === 0 ? `${saat} sa` : `${saat} sa ${kalan} dk`
}

/** Tasarımın sıkışık biçimi: "48sa 20dk". Kutulara sığması için boşluksuz. */
export function dakikaKisa(dakika: number): string {
  const d = Math.max(0, Math.round(dakika))
  if (d < 60) return `${d}dk`
  return `${Math.floor(d / 60)}sa ${String(d % 60).padStart(2, '0')}dk`
}

/** Binlik ayraçlı tam sayı: 3860 → "3.860". */
export function tamYaz(n: number): string {
  return Math.round(n).toLocaleString('tr-TR')
}

/*
  Yüzdenin ardına gelen iyelik eki, sayının **okunuşundaki son sözcüğe** göre
  değişiyor: %49 "kırk dokuz" okunduğu için "%49'u", %40 "kırk" olduğu için
  "%40'ı", %100 "yüz" olduğu için "%100'ü". Ünlüyle biten sözcükler ("iki",
  "altı", "yedi", "yirmi", "elli") kaynaştırma harfi de alıyor: "%42'si".
  Sabit bir ek yazmak ("%49'i") hepsinde yanlış olur.
*/
const BIRLER_EKI: Record<number, string> = {
  1: 'i', 2: 'si', 3: 'ü', 4: 'ü', 5: 'i', 6: 'sı', 7: 'si', 8: 'i', 9: 'u',
}
const ONLAR_EKI: Record<number, string> = {
  10: 'u', 20: 'si', 30: 'u', 40: 'ı', 50: 'si', 60: 'ı', 70: 'i', 80: 'i', 90: 'ı',
}

/** Sayının okunuşuna uyan iyelik eki: 49 → "u", 40 → "ı", 42 → "si", 100 → "ü". */
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

/** "%6,7'si" — tek ondalıklı yüzde; ondalık sıfırsa tam sayı gibi ("%7'si"). */
export function ondalikYuzdeYaz(oran: number): string {
  const yuzde = Math.round(oran * 1000) / 10
  const ondalik = Math.round((yuzde % 1) * 10)
  if (ondalik === 0) return yuzdeYaz(Math.round(yuzde) / 100)
  return `%${yuzde.toFixed(1).replace('.', ',')}'${BIRLER_EKI[ondalik]}`
}
