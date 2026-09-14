/**
 * Ana sayfadaki "Bugün" kartının söylediği cümle.
 *
 * Kart bir süre yalnızca üç şey diyordu: hiç soru yok / başladın / hedef
 * tuttu. Üçü de doğruydu ama her gün aynıydı ve "başladın" hâli hiçbir şey
 * önermiyordu. Şimdi kart, ana sayfanın zaten bildiği veriden bir **öneri**
 * çıkarıyor: seri kırılmak üzere mi, bankada bekleyen soru var mı, bugün tek
 * derse mi yığıldı, hangi derse uzun süredir dokunulmadı, son deneme ne
 * zamandı, sınava kaç gün kaldı.
 *
 * ## Kurallar sıralı, ilk tutan kazanır
 *
 * Öncelik sabit ve aşağıdaki `KURALLAR` dizisinin sırası: sınava yakınlık
 * her şeyin önünde (o dönemde başka öneri gürültü), sonra seri (kırılan
 * alışkanlık en pahalı kayıp), sonra bankadaki bekleyen yanlışlar, ders
 * dengesi, ihmal edilen ders, deneme; hiçbiri tutmazsa eski üç hâl. Puanla
 * ağırlıklandırma yok — kullanıcının "neden bunu söyledi" sorusuna sıralı
 * listeyle cevap verilebiliyor, puanla verilemiyor.
 *
 * ## Cümleler günden güne değişiyor ama gün içinde sabit
 *
 * Bir kuralın birden çok cümlesi var ve seçim **günün tarihinden** türeyen
 * bir sayıyla yapılıyor (`secim`). Rastgele olsaydı kart her yeniden çizimde
 * başka cümle söyler, kullanıcı "az önce başka bir şey yazıyordu" derdi.
 *
 * Saf ve React'ten bağımsız; `gunun-hali.test.ts` kuralları tek tek
 * denetliyor.
 */

import type { GunlukKayit } from './types'
import type { Ekran } from './gezinme'
import { gunOzeti } from './hesap'
import { gunFarki } from './sinav-tarihi'
import { tariheCevir, tariheYaz } from './utils'

export type GununHaliPozu = 'ziplayan' | 'okuyan' | 'uzgun'
export type GununHaliDurumu = 'kutlama' | 'calisiyor' | 'uzgun'

export type GununHali = {
  poz: GununHaliPozu
  durum: GununHaliDurumu
  baslik: string
  alt: string
  /** Dokununca açılacak ekran; öneri neyi işaret ediyorsa orası. */
  ekran: Ekran
}

export type GununHaliGirdisi = {
  /** 'YYYY-AA-GG' — kart kendi saatini okumuyor, ana sayfa veriyor. */
  bugun: string
  /** Günlük soru hedefi; 0 ise kart çizilmiyor. */
  hedef: number
  gunlukKayitlar: GunlukKayit[]
  /** Yanlış soru bankasında henüz "çözdüm" denmemiş soru sayısı. */
  bekleyenYanlis: number
  /** En yeni denemenin tarihi; hiç deneme yoksa null. */
  sonDenemeTarihi: string | null
  /** Sınava kalan gün. */
  kalanGun: number
}

/** Sınava bu kadar gün kalınca kart yalnızca sınavı konuşuyor. */
export const SINAV_YAKIN_GUN = 30
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

type Baglam = {
  g: GununHaliGirdisi
  toplam: number
  /** Dünle biten, hedefin tutturulduğu ardışık gün sayısı (bugün hariç). */
  seri: number
  /** Günün tarihinden türeyen seçici; `secim(n)` 0..n-1 arası sabit bir sayı. */
  secim: (n: number) => number
}

type Kural = (b: Baglam) => GununHali | null

function tuttu(b: Baglam): boolean {
  return b.toplam >= b.g.hedef
}

function sec<T>(b: Baglam, secenekler: T[]): T {
  return secenekler[b.secim(secenekler.length)]
}

// --- Kurallar ---------------------------------------------------------------

/** Sınava ≤ 30 gün: üç hâlin de sınav cümlesi var. */
const sinavaYakin: Kural = (b) => {
  const n = b.g.kalanGun
  if (n < 0 || n > SINAV_YAKIN_GUN) return null
  const gun = n === 0 ? 'Sınav günü' : `Sınava ${n} gün`
  if (tuttu(b)) {
    return {
      poz: 'ziplayan',
      durum: 'kutlama',
      baslik: sec(b, ['Hedef tamam, sınav yaklaşıyor', 'Son düzlükte hedefteysin']),
      alt: `${gun} — bugünkü ${b.toplam} soru yerini buldu.`,
      ekran: 'soru',
    }
  }
  if (b.toplam > 0) {
    return {
      poz: 'okuyan',
      durum: 'calisiyor',
      baslik: `${gun} kaldı`,
      alt: sec(b, [
        `Hedefe ${b.g.hedef - b.toplam} soru var; bugün altında kalma.`,
        `${b.g.hedef - b.toplam} soru daha, sonra dinlen.`,
      ]),
      ekran: 'soru',
    }
  }
  return {
    poz: 'uzgun',
    durum: 'uzgun',
    baslik: `${gun} kaldı, bugün boş`,
    alt: sec(b, ['Şimdi başlamanın tam zamanı.', 'On soru bile günü kurtarır.']),
    ekran: 'soru',
  }
}

/** Dün (ve öncesinde) hedef tutmuş, bugün henüz sıfır: seri kırılmak üzere. */
const seriKiriliyor: Kural = (b) => {
  if (b.toplam > 0 || b.seri < 1) return null
  return {
    poz: 'uzgun',
    durum: 'uzgun',
    baslik: b.seri === 1 ? 'Dünkü seri seni bekliyor' : `${b.seri} günlük seri kırılmasın`,
    alt: sec(b, ['Bugün de hedefi tuttur, zincir sürsün.', 'Bir soru gir, zincire halka ekle.']),
    ekran: 'soru',
  }
}

/** Bugün hedef tuttu ve dün de tutmuştu: seri sürüyor. */
const seriSuruyor: Kural = (b) => {
  if (!tuttu(b) || b.seri < 1) return null
  const gun = b.seri + 1
  return {
    poz: 'ziplayan',
    durum: 'kutlama',
    baslik: `${gun} gündür hedefteysin`,
    alt: sec(b, ['Zinciri kırma, yarın da görüşürüz.', `${b.toplam} soru — bugünlük iş tamam.`]),
    ekran: 'soru',
  }
}

/** Bankada bekleyen yanlış var ve bugün çalışılmış: bir tanesine bak. */
const bankaBekliyor: Kural = (b) => {
  const n = b.g.bekleyenYanlis
  if (n < 1 || b.toplam === 0) return null
  return {
    poz: tuttu(b) ? 'ziplayan' : 'okuyan',
    durum: tuttu(b) ? 'kutlama' : 'calisiyor',
    baslik: n === 1 ? 'Bankada bir soru bekliyor' : `Bankada ${n} soru bekliyor`,
    alt: sec(b, [
      n === 1 ? 'Bugün ona bir bak.' : 'Bugün birine bak, yarın bir tane daha.',
      'Yanlışa dönmek yeni soru kadar değerli.',
    ]),
    ekran: 'yanlis-banka',
  }
}

/** Günün sorularının çoğu tek dersten. */
const tekDerseYigilma: Kural = (b) => {
  if (b.toplam < YIGILMA_EN_AZ) return null
  const kayit = b.g.gunlukKayitlar.find((k) => k.tarih === b.g.bugun)
  if (!kayit) return null
  const dersler = new Map<string, number>()
  for (const s of kayit.kayitlar) dersler.set(s.ders, (dersler.get(s.ders) ?? 0) + s.toplam)
  let enCok = ''
  let enCokSayi = 0
  for (const [ders, sayi] of dersler) {
    if (sayi > enCokSayi) {
      enCok = ders
      enCokSayi = sayi
    }
  }
  if (enCokSayi / b.toplam < YIGILMA_ORANI) return null
  return {
    poz: tuttu(b) ? 'ziplayan' : 'okuyan',
    durum: tuttu(b) ? 'kutlama' : 'calisiyor',
    baslik: dersler.size === 1 ? `Hepsi ${enCok}` : `Çoğu ${enCok}`,
    alt: sec(b, ['Bir de başka bir dersten birkaç soru?', 'Diğer dersler de sırada bekliyor.']),
    ekran: 'soru',
  }
}

/** Son 30 günde çalışılmış ama 7+ gündür dokunulmamış ders. */
const ihmalEdilenDers: Kural = (b) => {
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
  return {
    poz: tuttu(b) ? 'ziplayan' : b.toplam > 0 ? 'okuyan' : 'uzgun',
    durum: tuttu(b) ? 'kutlama' : b.toplam > 0 ? 'calisiyor' : 'uzgun',
    // Ada ek getirilmiyor ("Kimya'ya", "Fizik'e" ünlü uyumu ister); ad yalın kalıyor.
    baslik: `${ders} ${gun} gündür bekliyor`,
    alt: sec(b, ['Bugün birkaç soru oradan olsun.', 'Unutmadan bir tur dön.']),
    ekran: 'soru',
  }
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
    return {
      poz: tuttu(b) ? 'ziplayan' : b.toplam > 0 ? 'okuyan' : 'uzgun',
      durum: tuttu(b) ? 'kutlama' : b.toplam > 0 ? 'calisiyor' : 'uzgun',
      baslik: 'Henüz deneme girmedin',
      alt: 'Bir deneme gir, sıralamanı görelim.',
      ekran: 'deneme',
    }
  }
  const gun = gunFarki(t, b.g.bugun)
  if (gun < DENEME_GUNU) return null
  return {
    poz: tuttu(b) ? 'ziplayan' : b.toplam > 0 ? 'okuyan' : 'uzgun',
    durum: tuttu(b) ? 'kutlama' : b.toplam > 0 ? 'calisiyor' : 'uzgun',
    baslik: `Son deneme ${gun} gün önceydi`,
    alt: sec(b, ['Bu hafta bir tane çözsen?', 'Sıralama tahmini taze deneme ister.']),
    ekran: 'deneme',
  }
}

/** Hiçbir öneri tutmadı: eski üç hâl. */
const temel: Kural = (b) => {
  if (tuttu(b)) {
    return {
      poz: 'ziplayan',
      durum: 'kutlama',
      baslik: sec(b, ['Hedefini tutturdun!', 'Bugünlük tamam!']),
      alt: `${b.toplam} soru — bugünlük iş tamam.`,
      ekran: 'soru',
    }
  }
  if (b.toplam > 0) {
    return {
      poz: 'okuyan',
      durum: 'calisiyor',
      baslik: sec(b, ['Çalışmaya başladın', 'İyi gidiyor']),
      alt: `Hedefine ${b.g.hedef - b.toplam} soru kaldı.`,
      ekran: 'soru',
    }
  }
  return {
    poz: 'uzgun',
    durum: 'uzgun',
    baslik: 'Bugün hiç soru çözmedin',
    alt: sec(b, ['Birkaç soruyla başlasak?', 'On soru, on dakika — başla.']),
    ekran: 'soru',
  }
}

const KURALLAR: Kural[] = [
  sinavaYakin,
  seriKiriliyor,
  seriSuruyor,
  bankaBekliyor,
  tekDerseYigilma,
  ihmalEdilenDers,
  denemeZamani,
  temel,
]

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

export function gununHali(g: GununHaliGirdisi): GununHali | null {
  if (g.hedef <= 0) return null
  const toplam = gunOzeti(g.gunlukKayitlar.find((k) => k.tarih === g.bugun)).toplam
  const gun = gunSayisi(g.bugun)
  const b: Baglam = {
    g,
    toplam,
    seri: hedefSerisi(g.gunlukKayitlar, g.bugun, g.hedef),
    secim: (n) => gun % n,
  }
  for (const kural of KURALLAR) {
    const hal = kural(b)
    if (hal) return hal
  }
  return null
}
