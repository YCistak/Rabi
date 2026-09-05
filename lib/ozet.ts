/**
 * Haftalık özet — Rabi'nin "yıllık özet" tarzı hafta kapanışı.
 *
 * Burada yalnızca **hesap** var; nasıl gösterileceği
 * `components/ekranlar/haftalik-ozet.tsx` içinde. Ayrı durmasının sebebi bu
 * dosyanın tamamen saf olması: haftalar, sınırlar ve sıralama kuralları
 * test edilebilir kalıyor, ekran yalnızca çiziyor.
 *
 * Dönem **kurulum gününe** yaslı, takvim haftasına değil: ilk özet uygulamanın
 * kurulmasından yedi gün sonra doğuyor ve sonra her hafta aynı gün yenileniyor
 * (`bekleyenOzetDonemi`). Pazartesi–pazar'a yaslansaydı çarşamba günü
 * uygulamayı kuran kullanıcı ilk özetini dört gün sonra ve yalnızca dört
 * günlük veriyle görürdü — "haftalık" demeyen bir haftalık özet.
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
  /** Dönemin ilk günü, 'YYYY-AA-GG' */
  baslangic: string
  /** Dönemin son günü, 'YYYY-AA-GG' */
  bitis: string
  /** Baştan sona yedi gün. */
  gunler: string[]
}

/** Verilen günden başlayan yedi günlük dönem. Takvim haftasına yaslanmıyor. */
export function donem(baslangicIso: string): HaftaAraligi {
  const gunler: string[] = []
  const gun = tariheCevir(baslangicIso)

  for (let i = 0; i < 7; i++) {
    gunler.push(tariheYaz(gun))
    gun.setDate(gun.getDate() + 1)
  }

  return { baslangic: gunler[0], bitis: gunler[6], gunler }
}

/** Verilen günün ait olduğu takvim haftası (pazartesi–pazar). */
export function haftaAraligi(iso: string): HaftaAraligi {
  return donem(haftaBasi(iso))
}

/** Dönem başını `adim` hafta ileri/geri kaydırır. Geçmiş dönemlere bakmak için. */
export function haftaKaydir(haftaBasiIso: string, adim: number): string {
  const gun = tariheCevir(haftaBasiIso)
  gun.setDate(gun.getDate() + adim * 7)
  return tariheYaz(gun)
}

/** İki gün arasındaki tam gün farkı. Negatif olabilir. */
export function gunFarki(baslangicIso: string, bitisIso: string): number {
  const bir = tariheCevir(baslangicIso).getTime()
  const iki = tariheCevir(bitisIso).getTime()
  // Yerel gece yarısından yerel gece yarısına: yaz saati geçişlerinde arada
  // 23 ya da 25 saat olabiliyor, yuvarlama o günü de tam gün sayıyor.
  return Math.round((iki - bir) / 86_400_000)
}

/**
 * Gösterilmeyi bekleyen özetin dönem başlangıcı; henüz bir hafta dolmadıysa
 * `null`.
 *
 * Özet kurulumdan yedi gün sonra **doğuyor** ve bir sonraki döneme kadar
 * duruyor: o gün uygulamayı açmayan kullanıcı özeti kaçırmıyor, izlenmemiş
 * dönem bekliyor. İçinde bulunulan dönemin özeti "henüz bitmedi" diye
 * gösterilmiyor — yarım bir haftanın sayıları haftalık hedefin altında kalır
 * ve iyi geçen bir haftayı kötü gösterirdi.
 */
export function bekleyenOzetDonemi(kurulumIso: string, bugunIso: string): string | null {
  const gecen = gunFarki(kurulumIso, bugunIso)
  if (gecen < 7) return null
  // Tamamlanmış dönem sayısı; sonuncusunun başlangıcı döndürülüyor.
  const tamamlanan = Math.floor(gecen / 7)
  return haftaKaydir(kurulumIso, tamamlanan - 1)
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

/** Hedef kartındaki yedi çubuktan biri. */
export type GunToplami = {
  /** 'YYYY-AA-GG' */
  iso: string
  /** Çubuğun altındaki üç harf — "PZT", "SAL"… */
  ad: string
  soru: number
}

/**
 * Çubukların altındaki gün adları.
 *
 * `toLocaleDateString` yerine sabit liste: statik dışa aktarımda cihazın
 * yereli farklıysa kısaltmalar değişir ve yedi çubuğun genişliği bozulurdu —
 * ana sayfadaki `GUN_ADLARI` ile aynı gerekçe. `getDay()` sırasında, yani
 * pazar başta.
 */
const GUN_KISALTMALARI = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT']

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
  /** Yedi günün soru sayıları — hedef kartındaki çubuklar. */
  gunler: GunToplami[]
  /** Haftanın en çok soru çözülen günü; hiç soru yoksa null. */
  enIyiGun: GunToplami | null

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
  /** "Haftanın masası" kutusundaki üç ders, çoktan aza. */
  pomodoroDersleri: { ders: string; dakika: number }[]

  /** 5 — Mini oyunlar */
  oyunDakika: number
  oyunTur: number
  oyunDogru: number
  /**
   * İsabet oranı (0–1) ve hatasız tur sayısı; ölçülemiyorsa `null`/0.
   *
   * Yanlış sayısını taşımayan eski turlar hesaba **girmiyor**: sıfır yanlış
   * saymak onları %100 isabetli gösterirdi.
   */
  oyunIsabet: number | null
  oyunHatasiz: number
  enCokOynanan: OyunId | null
  /** En çok oynanan oyunun bu haftaki tur sayısı. */
  enCokOynananTur: number

  /** 6 — Yanlış soru bankası */
  bankaCozulen: number
  /** Bankada hâlâ bekleyen (çözülmemiş) kayıt sayısı — kartın ızgarası. */
  bankaBekleyen: number

  /** 7–8 — Denemeler */
  denemeSayisi: number
  /** Haftanın denemeleri, tarih sırasıyla — net kartındaki çubuklar. */
  denemeNetleri: DenemeNeti[]
  denemeEnYuksek: DenemeNeti | null
  denemeEnDusuk: DenemeNeti | null
  denemeOrtalama: number | null
  /** Bir önceki dönemin ortalama neti — "GEÇEN HF." çubuğu; deneme yoksa null. */
  oncekiDonemOrtalama: number | null
  /** Ortalamanın geçen döneme göre farkı; iki dönemden biri boşsa null. */
  denemeArtis: number | null

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
  // `haftaBasiIso` dönemin **ilk günü**; pazartesiye çekilmiyor, çünkü dönem
  // kurulum gününe yaslı (`bekleyenOzetDonemi`).
  const hafta = donem(girdi.haftaBasiIso)
  const gunKumesi = new Set(hafta.gunler)
  const harita = kayitHaritasi(girdi.gunlukKayitlar)

  // --- Soru sayıları ve dersler ---
  let toplamSoru = 0
  let hedefliGun = 0
  const dersToplamlari = new Map<string, number>()
  const gunler: GunToplami[] = []

  for (const gun of hafta.gunler) {
    const kayit = harita.get(gun)
    const ozet = gunOzeti(kayit)
    toplamSoru += ozet.toplam
    if (girdi.gunlukHedef > 0 && ozet.toplam >= girdi.gunlukHedef) hedefliGun++
    gunler.push({ iso: gun, ad: GUN_KISALTMALARI[tariheCevir(gun).getDay()], soru: ozet.toplam })

    for (const satir of kayit?.kayitlar ?? []) {
      dersToplamlari.set(satir.ders, (dersToplamlari.get(satir.ders) ?? 0) + satir.toplam)
    }
  }

  // Eşitlikte **ilk** gün kazanıyor (`>`), böylece "en iyi gün" etiketi aynı
  // veride her açılışta aynı günü gösteriyor.
  const enIyiGun = gunler.reduce<GunToplami | null>(
    (enIyi, gun) => (gun.soru > 0 && (!enIyi || gun.soru > enIyi.soru) ? gun : enIyi),
    null,
  )

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
  // İsabet yalnızca yanlış sayısını taşıyan turlardan hesaplanıyor; ikisi bu
  // yüzden ayrı sayaçta birikiyor.
  let olculenDogru = 0
  let olculenYanlis = 0
  let oyunHatasiz = 0
  const oyunTurlari = new Map<OyunId, number>()

  for (const kayit of girdi.oyunGecmisi) {
    if (!gunKumesi.has(kayit.tarih)) continue
    oyunSaniye += kayit.saniye
    oyunDogru += kayit.dogru
    oyunTur++
    if (typeof kayit.yanlis === 'number') {
      olculenDogru += kayit.dogru
      olculenYanlis += kayit.yanlis
    }
    if (kayit.hatasiz) oyunHatasiz++
    oyunTurlari.set(kayit.oyun, (oyunTurlari.get(kayit.oyun) ?? 0) + 1)
  }

  const olculenToplam = olculenDogru + olculenYanlis
  const enCokOynanan = enCokOynananBul(oyunTurlari)

  // --- Yanlış soru bankası ---
  const bankaCozulen = girdi.yanlisSorular.filter(
    (s) => s.cozuldu && s.cozulmeTarihi !== undefined && gunKumesi.has(s.cozulmeTarihi),
  ).length
  // Bekleyen, haftaya değil **bugüne** ait: kart "bankanın hâli"ni gösteriyor.
  const bankaBekleyen = girdi.yanlisSorular.filter((s) => !s.cozuldu).length

  // --- Denemeler ---
  const sablonHaritasi = new Map(girdi.sablonlar.map((s) => [s.id, s]))
  const netler: DenemeNeti[] = []
  const oncekiNetler: number[] = []
  const oncekiDonem = new Set(donem(haftaKaydir(hafta.baslangic, -1)).gunler)

  for (const deneme of girdi.denemeler) {
    const sablon = sablonHaritasi.get(deneme.sablonId)
    // Şablonu silinmiş deneme netlenemiyor; ortalamayı 0 ile bozmasın diye atlanıyor.
    if (!sablon) continue
    if (oncekiDonem.has(deneme.tarih)) {
      oncekiNetler.push(denemeOzeti(deneme, sablon).toplamNet)
      continue
    }
    if (!gunKumesi.has(deneme.tarih)) continue
    netler.push({
      ad: deneme.ad,
      tarih: deneme.tarih,
      net: denemeOzeti(deneme, sablon).toplamNet,
    })
  }

  // Çubuklar soldan sağa zamanla ilerliyor; kaynak liste sıralı gelmiyor.
  netler.sort((a, b) => a.tarih.localeCompare(b.tarih))
  const sirali = [...netler].sort((a, b) => b.net - a.net)
  const denemeOrtalama =
    netler.length > 0 ? yuvarla(netler.reduce((t, n) => t + n.net, 0) / netler.length) : null
  const oncekiDonemOrtalama =
    oncekiNetler.length > 0
      ? yuvarla(oncekiNetler.reduce((t, n) => t + n, 0) / oncekiNetler.length)
      : null

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
    gunler,
    enIyiGun,
    // Seri haftanın **son gününden** geriye sayılıyor: özet o haftayı kapatıyor,
    // bugünden sayılsaydı geçmiş bir haftanın özeti bugünkü seriyi gösterirdi.
    seri: hedefSerisi(girdi.gunlukKayitlar, girdi.gunlukHedef, hafta.bitis),
    devamsizlikOzurlu,
    devamsizlikOzursuz,
    devamsizlikToplam: devamsizlikOzurlu + devamsizlikOzursuz,
    pomodoroDakika,
    pomodoroSeans,
    pomodoroDers: enBuyuk(dersDakikalari),
    pomodoroDersleri: [...dersDakikalari.entries()]
      // Eşitlikte ders adına göre: kutu her açılışta aynı sırayla çizilsin.
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'))
      .slice(0, 3)
      .map(([ders, dakika]) => ({ ders, dakika })),
    oyunDakika: Math.round(oyunSaniye / 60),
    oyunTur,
    oyunDogru,
    oyunIsabet: olculenToplam > 0 ? olculenDogru / olculenToplam : null,
    oyunHatasiz,
    enCokOynanan,
    enCokOynananTur: enCokOynanan ? (oyunTurlari.get(enCokOynanan) ?? 0) : 0,
    bankaCozulen,
    bankaBekleyen,
    denemeSayisi: netler.length,
    denemeNetleri: netler,
    denemeEnYuksek: sirali[0] ?? null,
    denemeEnDusuk: sirali.length > 1 ? sirali[sirali.length - 1] : (sirali[0] ?? null),
    denemeOrtalama,
    oncekiDonemOrtalama,
    denemeArtis:
      denemeOrtalama !== null && oncekiDonemOrtalama !== null
        ? yuvarla(denemeOrtalama - oncekiDonemOrtalama)
        : null,
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
