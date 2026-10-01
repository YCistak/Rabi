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
 * dengesi, ihmal edilen ders, deneme (bu dördü tutuyorsa gün gün dönüşümlü);
 * hiçbiri tutmazsa eski üç hâl. Puanla
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

/**
 * Sınava ≤ 30 gün: üç hâlin de sınav cümlesi var.
 *
 * Son haftada her gün; 8–30 gün arasında **gün aşırı**. Otuz gün boyunca her
 * sabah aynı "sınava N gün" cümlesi, kartı bir takvime çevirirdi ve öteki
 * öneriler (banka, ihmal edilen ders) tam da en gerekli oldukları dönemde
 * hiç görünmezdi. Seçim tarihten (`secim`) — gün içinde sabit.
 */
const sinavaYakin: Kural = (b) => {
  const n = b.g.kalanGun
  if (n < 0 || n > SINAV_YAKIN_GUN) return null
  if (n > SINAV_SON_HAFTA && b.secim(2) === 1) return null
  const gun = n === 0 ? 'Sınav günü' : `Sınava ${n} gün`
  if (n === 0) {
    return {
      poz: 'okuyan',
      durum: 'calisiyor',
      baslik: gun,
      alt: sec(b, [
        'Bugün kendine dinlenmek için zaman ayır. Sınavda başarılar!',
        'Hazırlıklarını kontrol et ve dinlen. Sınavda başarılar!',
      ]),
      ekran: 'soru',
    }
  }
  if (tuttu(b)) {
    return {
      poz: 'ziplayan',
      durum: 'kutlama',
      baslik: sec(b, ['Bugünkü hedefini tamamladın', 'Hedefine ulaştın']),
      alt: `${gun}. Bugün ${b.toplam} soru kaydettin; şimdi kısa bir mola verebilirsin.`,
      ekran: 'soru',
    }
  }
  if (b.toplam > 0) {
    return {
      poz: 'okuyan',
      durum: 'calisiyor',
      baslik: `${gun} kaldı`,
      alt: sec(b, [
        `Günlük hedefine ulaşmak için ${b.g.hedef - b.toplam} soru daha çözebilirsin.`,
        `Hedefine ${b.g.hedef - b.toplam} soru kaldı. Kalan soruları kısa çalışma aralıklarına bölebilirsin.`,
      ]),
      ekran: 'soru',
    }
  }
  return {
    poz: 'uzgun',
    durum: 'uzgun',
    baslik: `${gun} kaldı`,
    alt: sec(b, ['Bugünkü çalışmana kısa bir tekrarla başlayabilirsin.', 'Önce zorlandığın bir konuyu seçip birkaç soru çözebilirsin.']),
    ekran: 'soru',
  }
}

/** Dün (ve öncesinde) hedef tutmuş, bugün henüz sıfır: seri kırılmak üzere. */
const seriKiriliyor: Kural = (b) => {
  if (b.toplam > 0 || b.seri < 1) return null
  return {
    poz: 'uzgun',
    durum: 'uzgun',
    baslik: b.seri === 1 ? 'Dün hedefini tamamladın' : `${b.seri} günlük seri kırılmasın`,
    alt: sec(b, ['Serini sürdürmek için bugün de günlük hedefine ulaşmalısın.', 'Birkaç soruyla başlayıp günlük hedefine doğru ilerleyebilirsin.']),
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
    alt: sec(b, ['Bugünkü hedefin tamamlandı. Yarın da aynı düzeni sürdürebilirsin.', `Bugün ${b.toplam} soru kaydettin. Kısa bir mola verebilirsin.`]),
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
    baslik: n === 1 ? 'Yanlış bankanda bir soru var' : `Yanlış bankanda ${n} soru var`,
    alt: sec(b, [
      n === 1 ? 'Yanlış yaptığın soruyu yeniden çözmeyi deneyebilirsin.' : 'Yanlış yaptığın sorulardan birini seçip yeniden çözebilirsin.',
      'Çözümü inceleyip hangi adımda hata yaptığını bulmaya çalışabilirsin.',
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
  return {
    poz: tuttu(b) ? 'ziplayan' : 'okuyan',
    durum: tuttu(b) ? 'kutlama' : 'calisiyor',
    baslik: dersler.size === 1 ? `Bugün tek ders: ${enCok}` : `Bugün ağırlık ${enCok} dersinde`,
    alt: sec(b, ['Planında başka bir ders varsa ondan da birkaç soru çözebilirsin.', 'Bir sonraki çalışma aralığında başka bir derse geçebilirsin.']),
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
    // Ada ek getirilmiyor ("Kimya'ya", "Fizik'e" ünlü uyumu ister); ad "ders" sözcüğüyle
    // birlikte kullanılıyor, ek o sözcüğe geliyor. İki nokta kullanılmıyor.
    baslik: sec(b, [
      `${ders} dersine ${gun} gündür soru girmedin`,
      `${ders} dersi ${gun} gündür bekliyor`,
      `${ders} dersinde ${gun} gündür kayıt yok`,
    ]),
    alt: sec(b, ['Bu dersten kısa bir tekrar yapıp birkaç soru çözebilirsin.', 'Çalışma planına bu dersten küçük bir tekrar ekleyebilirsin.']),
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
      baslik: 'Henüz deneme kaydın yok',
      alt: 'Çözdüğün bir denemenin sonuçlarını ekleyerek gelişimini takip edebilirsin.',
      ekran: 'deneme',
    }
  }
  const gun = gunFarki(t, b.g.bugun)
  if (gun < DENEME_GUNU) return null
  return {
    poz: tuttu(b) ? 'ziplayan' : b.toplam > 0 ? 'okuyan' : 'uzgun',
    durum: tuttu(b) ? 'kutlama' : b.toplam > 0 ? 'calisiyor' : 'uzgun',
    baslik: `Son deneme ${gun} gün önceydi`,
    alt: sec(b, ['Yeni bir deneme çözdüysen sonuçlarını ekleyebilirsin.', 'Çalışma planında uygunsa bu hafta bir denemeye zaman ayırabilirsin.']),
    ekran: 'deneme',
  }
}

/** Hiçbir öneri tutmadı: eski üç hâl. */
const temel: Kural = (b) => {
  if (tuttu(b)) {
    return {
      poz: 'ziplayan',
      durum: 'kutlama',
      baslik: sec(b, ['Günlük hedefin tamamlandı', 'Bugünkü hedefine ulaştın']),
      alt: `Bugün ${b.toplam} soru kaydettin. Mola verebilir ya da yanlışlarını gözden geçirebilirsin.`,
      ekran: 'soru',
    }
  }
  if (b.toplam > 0) {
    return {
      poz: 'okuyan',
      durum: 'calisiyor',
      baslik: sec(b, ['Hedefine doğru ilerliyorsun', 'Bugünkü çalışman başladı']),
      alt: `Hedefine ${b.g.hedef - b.toplam} soru kaldı.`,
      ekran: 'soru',
    }
  }
  return {
    poz: 'uzgun',
    durum: 'uzgun',
    baslik: 'Bugün henüz soru kaydın yok',
    alt: sec(b, ['Kısa bir çalışma aralığı seçip birkaç soruyla başlayabilirsin.', 'Soru çözdüysen kaydını ekle; henüz başlamadıysan küçük bir hedef seç.']),
    ekran: 'soru',
  }
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
  for (const kural of ONCELIKLI) {
    const hal = kural(b)
    if (hal) return hal
  }
  const oneriler = ONERILER.map((kural) => kural(b)).filter((h): h is GununHali => h !== null)
  if (oneriler.length > 0) return oneriler[gun % oneriler.length]
  return temel(b)
}
