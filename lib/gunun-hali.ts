/**
 * Ana sayfada selamlamanın altındaki tek cümle: günün hâli.
 *
 * **Cümleyi artık doğrudan bu dosya seçmiyor**: `ana-baslik.ts` önce tavşanı
 * seçiyor, cümleyi tavşanın kuralından kuruyor ve buradaki öneri listesine
 * (`gununHali`) yalnızca tavşan çalışırken başvuruyor. Ayrı seçildiklerinde
 * tavşan dans ederken cümle başka bir işe yönlendirebiliyordu.
 *
 * Bu cümle bir süre kendi kartıydı (`GununHali`, `gunun-hali-karti.tsx`):
 * 72 piksellik bir tavşan, "BUGÜN" etiketi, kalın bir başlık, altında ikinci
 * bir cümle ve bir ok. Kullanıcı kartı kökten kaldırttı ve yerine
 * "Merhaba"nın altında tek bir cümle istedi. Kart hedef kartının hemen
 * altında, aynı sayıyı ikinci kez yorumlayan ayrı bir yüzeydi; selamlamanın
 * altındaki satır ise Rabi'nin kendisinin söylediği söz gibi okunuyor — maskot
 * zaten orada. Başlık + açıklama ikilisi tek cümleye indi: noktalı virgülle
 * bağlanan iki yarım, ilki durum, ikincisi öneri. Dokunulmuyor; öneri
 * gidilecek yeri adıyla söylüyor.
 *
 * Kurallar kartın kurallarıyla aynı: seri kırılmak üzere mi, bankada bekleyen
 * soru var mı, bugün tek derse mi yığıldı, hangi derse uzun süredir
 * dokunulmadı, son deneme ne zamandı, sınava kaç gün kaldı.
 *
 * ## Kurallar sıralı, ilk tutan kazanır
 *
 * Öncelik sabit ve aşağıdaki `KURALLAR` dizisinin sırası: sınava yakınlık
 * her şeyin önünde (o dönemde başka öneri gürültü), sonra seri (kırılan
 * alışkanlık en pahalı kayıp), sonra bankadaki bekleyen yanlışlar, ders
 * dengesi, ihmal edilen ders, deneme (bu dördü tutuyorsa gün gün dönüşümlü);
 * hiçbiri tutmazsa eski üç hâl. Puanla
 * ağırlıklandırma yok — kullanıcının "neden bunu söyledi" sorusuna sıralı
 * listeyle cevap verilebiliyor, puanla verilemiyor.
 *
 * ## Cümleler günden güne değişiyor ama gün içinde sabit
 *
 * Bir kuralın birden çok cümlesi var ve seçim **günün tarihinden** türeyen
 * bir sayıyla yapılıyor (`secim`). Rastgele olsaydı satır her yeniden çizimde
 * başka cümle söyler, kullanıcı "az önce başka bir şey yazıyordu" derdi.
 *
 * Saf ve React'ten bağımsız; `gunun-hali.test.ts` kuralları tek tek
 * denetliyor.
 */

import type { GunlukKayit } from './types'
import { gunOzeti } from './hesap'
import { gunFarki } from './sinav-tarihi'
import { tariheCevir, tariheYaz } from './utils'

/** Selamlamanın altındaki tek cümle. */
export type GununHali = string

export type GununHaliGirdisi = {
  /** 'YYYY-AA-GG' — cümle kendi saatini okumuyor, ana sayfa veriyor. */
  bugun: string
  /** Günlük soru hedefi; 0 ise cümle yok. */
  hedef: number
  gunlukKayitlar: GunlukKayit[]
  /** Yanlış soru bankasında henüz "çözdüm" denmemiş soru sayısı. */
  bekleyenYanlis: number
  /** En yeni denemenin tarihi; hiç deneme yoksa null. */
  sonDenemeTarihi: string | null
  /** Sınava kalan gün. */
  kalanGun: number
}

/** Sınava bu kadar gün kalınca sınav cümlesi gün aşırı öne geçiyor. */
export const SINAV_YAKIN_GUN = 30
/** Bu kadar gün kalınca her gün sınav cümlesi. */
export const SINAV_SON_HAFTA = 7
/** Bir dersin "ihmal edildi" sayılması için son kayıttan bu yana geçen gün. */
export const IHMAL_GUNU = 7
/** İhmal bakılırken geriye bu kadar gün taranıyor; daha eskisi zaten bırakılmış ders. */
export const IHMAL_PENCERESI = 30
/** Günün sorularının bu oranı tek dersten geliyorsa "yığılma". */
export const YIGILMA_ORANI = 0.8
/** Yığılma uyarısı için günün en az soru sayısı — 5 soruda oran anlamsız. */
export const YIGILMA_EN_AZ = 20
/** Son denemeden bu kadar gün geçince hatırlatma. */
export const DENEME_GUNU = 10

export type Baglam = {
  g: GununHaliGirdisi
  toplam: number
  /** Dünle biten, hedefin tutturulduğu ardışık gün sayısı (bugün hariç). */
  seri: number
  /** Günün tarihinden türeyen seçici; `secim(n)` 0..n-1 arası sabit bir sayı. */
  secim: (n: number) => number
}

type Kural = (b: Baglam) => string | null

function tuttu(b: Baglam): boolean {
  return b.toplam >= b.g.hedef
}

function sec<T>(b: Baglam, secenekler: T[]): T {
  return secenekler[b.secim(secenekler.length)]
}

/// --- Kurallar ---------------------------------------------------------------

/**
 * Sınava ≤ 30 gün: üç hâlin de sınav cümlesi var.
 *
 * Son haftada her gün; 8–30 gün arasında **gün aşırı**. Otuz gün boyunca her
 * sabah aynı "sınava N gün" cümlesi, satırı bir takvime çevirirdi ve öteki
 * öneriler (banka, ihmal edilen ders) tam da en gerekli oldukları dönemde
 * hiç görünmezdi. Seçim tarihten (`secim`) — gün içinde sabit.
 */
const sinavaYakin: Kural = (b) => {
  const n = b.g.kalanGun
  if (n < 0 || n > SINAV_YAKIN_GUN) return null
  if (n > SINAV_SON_HAFTA && b.secim(2) === 1) return null
  return sinavCumlesi(b)
}

/**
 * Sınav cümlesi, gün aşırı süzgeci olmadan. Ana sayfa başlığı sınava 30 günden
 * az kalınca tavşanı her gün saate baktırıyor (`ana-baslik.ts`); cümle de o
 * gün sınavı söylemek zorunda.
 */
export function sinavCumlesi(b: Baglam): string {
  const n = b.g.kalanGun
  if (n === 0) {
    return sec(b, [
      'Bugün sınav günü; dinlen, kendine güven ve başarılar!',
      'Bugün sınav günü; hazırlığını gözden geçir ve dinlen, başarılar!',
    ])
  }
  if (tuttu(b)) {
    return sec(b, [
      `Sınava ${n} gün kaldı ve bugünkü hedefini tamamladın.`,
      `Hedefine ulaştın; sınava ${n} gün kaldı.`,
    ])
  }
  if (b.toplam > 0) return `Sınava ${n} gün kaldı; hedefine ${b.g.hedef - b.toplam} soru var.`
  return sec(b, [
    `Sınava ${n} gün kaldı; güne kısa bir tekrarla başlayabilirsin.`,
    `Sınava ${n} gün kaldı; zorlandığın bir konudan birkaç soruyla başla.`,
  ])
}

/** Dün (ve öncesinde) hedef tutmuş, bugün henüz sıfır: seri kırılmak üzere. */
export const seriKiriliyor: Kural = (b) => {
  if (b.toplam > 0 || b.seri < 1) return null
  return b.seri === 1
    ? 'Dün hedefini tamamladın; bugün de devam edelim.'
    : `${b.seri} günlük serin var; bugün de hedefini tamamla.`
}

/** Bugün hedef tuttu ve dün de tutmuştu: seri sürüyor. */
const seriSuruyor: Kural = (b) => {
  if (!tuttu(b) || b.seri < 1) return null
  return `${b.seri + 1} gündür hedeftesin; bugünü de tamamladın.`
}

/** Bankada bekleyen yanlış var ve bugün çalışılmış: bir tanesine bak. */
const bankaBekliyor: Kural = (b) => {
  const n = b.g.bekleyenYanlis
  if (n < 1 || b.toplam === 0) return null
  return n === 1
    ? 'Yanlış bankanda bir soru seni bekliyor.'
    : `Yanlış bankanda ${n} soru seni bekliyor.`
}

/** Günün sorularının çoğu tek dersten. */
const tekDerseYigilma: Kural = (b) => {
  if (b.toplam < YIGILMA_EN_AZ) return null
  const kayit = b.g.gunlukKayitlar.find((k) => k.tarih === b.g.bugun)
  if (!kayit) return null
  const dersler = new Map<string, number>()
  for (const s of kayit.kayitlar) {
    if (s.toplam > 0) dersler.set(s.ders, (dersler.get(s.ders) ?? 0) + s.toplam)
  }
  let enCok = ''
  let enCokSayi = 0
  for (const [ders, sayi] of dersler) {
    if (sayi > enCokSayi) {
      enCok = ders
      enCokSayi = sayi
    }
  }
  if (enCokSayi / b.toplam < YIGILMA_ORANI) return null
  return dersler.size === 1
    ? `Bugün yalnızca ${enCok} dersi çalıştın; başka bir derse de göz at.`
    : `Bugün ağırlık ${enCok} dersinde; başka bir derse de geçebilirsin.`
}

/** Son 30 günde çalışılmış ama 7+ gündür dokunulmamış ders; yoksa null. */
export function ihmalBul(b: Baglam): { ders: string; gun: number } | null {
  const sonKayit = new Map<string, string>()
  for (const k of b.g.gunlukKayitlar) {
    const yas = gunFarki(k.tarih, b.g.bugun)
    if (yas < 0 || yas > IHMAL_PENCERESI) continue
    for (const s of k.kayitlar) {
      if (s.toplam <= 0) continue
      const onceki = sonKayit.get(s.ders)
      if (!onceki || onceki < k.tarih) sonKayit.set(s.ders, k.tarih)
    }
  }
  // En uzun süredir bekleyen ders; eşitlikte ad sırası, gün içinde sabit kalsın.
  let ders = ''
  let gun = 0
  for (const [ad, tarih] of [...sonKayit].sort()) {
    const fark = gunFarki(tarih, b.g.bugun)
    if (fark > gun) {
      ders = ad
      gun = fark
    }
  }
  if (!ders || gun < IHMAL_GUNU) return null
  return { ders, gun }
}

const ihmalEdilenDers: Kural = (b) => {
  const ihmal = ihmalBul(b)
  if (!ihmal) return null
  const { ders, gun } = ihmal
  // Ada ek getirilmiyor ("Kimya'ya", "Fizik'e" ünlü uyumu ister); ad "ders"
  // sözcüğüyle birlikte kullanılıyor, ek o sözcüğe geliyor.
  return sec(b, [
    `${ders} dersine ${gun} gündür soru girmedin.`,
    `${ders} dersi ${gun} gündür bekliyor.`,
    `${ders} dersinde ${gun} gündür kayıt yok.`,
  ])
}

/** Son deneme 10+ gün önce (ya da hiç yok ama düzenli çalışılıyor). */
const denemeZamani: Kural = (b) => {
  const t = b.g.sonDenemeTarihi
  if (t === null) {
    // Hiç deneme girilmemiş: en az bir haftalık soru geçmişi varsa hatırlat.
    const enEski = b.g.gunlukKayitlar.reduce<string | null>(
      (e, k) => (e === null || k.tarih < e ? k.tarih : e),
      null,
    )
    if (enEski === null || gunFarki(enEski, b.g.bugun) < IHMAL_GUNU) return null
    return 'Henüz deneme kaydın yok; çözdüğün ilk denemeyi ekleyebilirsin.'
  }
  const gun = gunFarki(t, b.g.bugun)
  if (gun < DENEME_GUNU) return null
  return `Son denemen ${gun} gün önceydi; yenisine zaman ayırabilirsin.`
}

/** Hiçbir öneri tutmadı: eski üç hâl. */
export const temel: Kural = (b) => {
  if (tuttu(b)) {
    return sec(b, [
      `Günlük hedefini tamamladın; bugün ${b.toplam} soru çözdün.`,
      `Bugünkü hedefine ulaştın; ${b.toplam} soru kaydettin.`,
    ])
  }
  if (b.toplam > 0) return `Güzel gidiyorsun; hedefine ${b.g.hedef - b.toplam} soru kaldı.`
  return sec(b, [
    'Bugün henüz soru kaydın yok; birkaç soruyla başlayabilirsin.',
    'Bugün henüz soru kaydın yok; çözdüysen kaydını eklemeyi unutma.',
  ])
}

/** Sabit öncelikli kurallar: tutarlarsa her gün kazanırlar. */
const ONCELIKLI: Kural[] = [sinavaYakin, seriKiriliyor, seriSuruyor]

/**
 * Eşit ağırlıklı öneriler. Bir öneri günlerce geçerli kalabiliyor (bir ders
 * haftalarca ihmal edilmiş olabilir) ve ilk tutan hep kazansaydı kart aynı
 * cümleyi günlerce söylerdi. Tutan öneriler arasında gün sayısıyla dönülüyor.
 */
const ONERILER: Kural[] = [bankaBekliyor, tekDerseYigilma, ihmalEdilenDers, denemeZamani]

// --- Giriş -------------------------------------------------------------------

/** Dünle biten ardışık "hedef tuttu" günleri. */
export function hedefSerisi(kayitlar: GunlukKayit[], bugun: string, hedef: number): number {
  if (hedef <= 0) return 0
  const harita = new Map(kayitlar.map((k) => [k.tarih, k]))
  let seri = 0
  const gun = tariheCevir(bugun)
  for (;;) {
    gun.setDate(gun.getDate() - 1)
    if (gunOzeti(harita.get(tariheYaz(gun))).toplam < hedef) break
    seri += 1
  }
  return seri
}

/** 'YYYY-AA-GG' → gün içinde sabit, günden güne değişen küçük bir sayı. */
function gunSayisi(iso: string): number {
  return Math.round(tariheCevir(iso).getTime() / 86_400_000)
}

/** Kuralların ortak bağlamı; `ana-baslik.ts` de aynı bağlamla cümle kuruyor. */
export function baglamKur(g: GununHaliGirdisi): Baglam {
  const gun = gunSayisi(g.bugun)
  return {
    g,
    toplam: gunOzeti(g.gunlukKayitlar.find((k) => k.tarih === g.bugun)).toplam,
    seri: hedefSerisi(g.gunlukKayitlar, g.bugun, g.hedef),
    secim: (n) => gun % n,
  }
}

/**
 * Hedef tuttuğu günün cümlesi: sınav, seri ya da temel "tamamladın".
 *
 * Öneriler (banka, ihmal, deneme) burada yok: başlıktaki tavşan o gün dans
 * ediyor ve cümle de kutlamayı söylemeli, başka bir işe yönlendirmemeli.
 */
export function hedefTuttuCumlesi(b: Baglam): string {
  for (const kural of ONCELIKLI) {
    const hal = kural(b)
    if (hal) return hal
  }
  return temel(b)!
}

export function gununHali(g: GununHaliGirdisi): GununHali | null {
  if (g.hedef <= 0) return null
  const b = baglamKur(g)
  const gun = gunSayisi(g.bugun)
  for (const kural of ONCELIKLI) {
    const hal = kural(b)
    if (hal) return hal
  }
  const oneriler = ONERILER.map((kural) => kural(b)).filter((h): h is string => h !== null)
  if (oneriler.length > 0) return oneriler[gun % oneriler.length]
  return temel(b)
}
