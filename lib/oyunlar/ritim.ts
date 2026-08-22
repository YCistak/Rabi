/**
 * Turun ritmi — soru başına süre, boss soruları ve eleme kuralları.
 *
 * Buradaki süreler **soru** başına ve yalnızca Ani Ölüm modunda işliyor; öteki
 * modlarda saat tura ait ya da hiç yok (`mod.ts`). İkisi ayrı dosyada çünkü
 * ayrı sorular: burası "bu soru ne kadar sürer", orası "tur ne zaman biter".
 *
 * `tur.ts` puanlama ve rekor mantığını tutuyor, burası zamanlama ve eleme;
 * ikisi ayrı çünkü ritim oyundan oyuna değişiyor, puanlama değişmiyor.
 */

import type { OyunId } from '../types'
import { MODLAR, type OyunModu } from './mod'
import { karistir } from './tur'

export type Zorluk = 'kolay' | 'orta' | 'zor'

export const ZORLUKLAR: readonly Zorluk[] = ['kolay', 'orta', 'zor'] as const

export const ZORLUK_ADI: Record<Zorluk, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
}

/**
 * Boss sorusunun zorluğu.
 *
 * Kural: seçilenin **bir üstü**. `zor` seçildiğinde üstü kalmadığı için soru
 * yine `zor` havuzundan geliyor ama `cetin` işaretiyle: süresi kısalıyor ve
 * çoktan seçmelide bir şık daha ekleniyor. Havuza dördüncü bir zorluk sınıfı
 * uydurmaktansa bunu tercih ettim — "çetin ses olayı" diye bir kategori yok,
 * ama az süreyle beş şık arasından seçmek gerçekten daha zor.
 */
export type BossZorlugu = { zorluk: Zorluk; cetin: boolean }

export function bossZorlugu(secilen: Zorluk): BossZorlugu {
  if (secilen === 'kolay') return { zorluk: 'orta', cetin: false }
  if (secilen === 'orta') return { zorluk: 'zor', cetin: false }
  return { zorluk: 'zor', cetin: true }
}

/** Kaç soruda bir boss geliyor. */
export const BOSS_ARALIGI = 10

/**
 * Edebiyat'ta boss ne zaman geliyor.
 *
 * Orada "soru" bir eşleştirme ama sorular altılı ellerde dağıtılıyor; on
 * soruda bir eli ortasından bölmek mümkün değil. Kural şuna dönüşüyor: her on
 * eşleştirme tamamlandığında **sıradaki el** boss oluyor. Altılı ellerde bu
 * yaklaşık iki elde bir demek.
 */
export function bossElMi(gecilenSoru: number, verilenBoss: number): boolean {
  return Math.floor(gecilenSoru / BOSS_ARALIGI) > verilenBoss
}

/**
 * Sıradaki soru boss mu? `sira` 1'den başlıyor.
 *
 * Bosssuz oyunlarda (matematik) hiçbir zaman boss gelmiyor.
 */
export function bossMu(oyun: OyunId, sira: number): boolean {
  if (!bossluMu(oyun)) return false
  return sira > 0 && sira % BOSS_ARALIGI === 0
}

/**
 * Boss'suz oyunlar.
 *
 * Matematik dışarıda: oradaki sorular havuzdan değil üretiliyor, "bir üst
 * zorluk" karşılığı yok — 43828'i 9'a bölmenin zor hâli, sayıyı büyütmekten
 * ibaret kalırdı.
 *
 * Liste burada elle duruyor, `tanim.ts`'ten `ders === 'matematik'` diye
 * okunmuyor: `tanim.ts` bu dosyadaki süreleri kendi tanıtım metinlerinde
 * kullanıyor ve iki dosya birbirini import edince döngü çıkıyor. Listenin
 * derse uygun kaldığını `ritim.test.ts` denetliyor — matematiğe yeni bir oyun
 * eklenip buraya yazılmazsa test kırılıyor.
 */
export const BOSSSUZ_OYUNLAR: readonly OyunId[] = [
  'islem',
  'bolunme',
  'aci',
  'ucgen',
  'koklu',
  'tuzak',
]

/** Bu oyunda boss var mı. */
export function bossluMu(oyun: OyunId): boolean {
  return !BOSSSUZ_OYUNLAR.includes(oyun)
}

/**
 * Soru başına süre, saniye.
 *
 * Şıkka dokunmakla klavyeden cevap yazmak aynı süreyi almıyor; sözel oyunlar
 * okuyup seçmek, matematik oyunları hesaplayıp yazmak üzerine kurulu. Sayılar
 * burada tek yerde duruyor ki oynatmak kolay olsun.
 */
export const SORU_SURESI: Record<OyunId, number> = {
  yazim: 12,
  ses: 12,
  soz: 12,
  /**
   * Edebiyat'ta süre **el başına**, soru başına değil: oyun tek tek soru değil
   * altılı eşleştirme dağıtıyor. Kırk saniye, altı eşleşmeye rahat rahat yeten
   * ama boşa oyalanmaya izin vermeyen aralık.
   */
  edebiyat: 40,
  // Öge sorularında önce cümleyi okumak gerekiyor, iki saniye fazla.
  oge: 14,
  islem: 20,
  bolunme: 20,
  aci: 20,
  // Üçgende kenar hesabı en uzun süren iş.
  ucgen: 22,
  /**
   * Haritada gözle taramak okumaktan uzun sürüyor: soruyu anlamak bir saniye,
   * ili bulmak on saniye.
   */
  harita: 16,
  /**
   * Tarih oyunlarında da süre el/tahta başına.
   *
   * Antlaşma'da dört madde okunuyor ve maddeler bir cümlelik: altı kısa eser
   * adından uzun sürüyor, o yüzden edebiyattan fazla. Kavram'da üç eşleştirme
   * var ama beş tanım okunuyor — iki tanesi boşuna.
   */
  antlasma: 45,
  kavram: 35,
  // Anlatım bozukluğunda önce cümleyi okumak, sonra sebebi seçmek gerekiyor;
  // şıklar da kısa değil. Öge sorusundan iki saniye fazla.
  anlatim: 16,
  // Köklü sayıda cevap çubuğu daraltarak veriliyor: düşünmek kadar sürüklemek
  // de vakit alıyor.
  koklu: 20,
  ortak: 14,
  siniflandirma: 14,
  /**
   * Organel Kartı'nın süresi mekaniğin kendisi.
   *
   * Üç ipucu süreyi eşit üçe bölüyor (`hucre.ts`): dokuz saniye, ipucu başına
   * üç saniye demek. Süre değişirse ipucu ritmi de değişir.
   */
  hucre: 9,
  /**
   * Zaman Şeridi'nde süre **soru** başına ama soru beş kart.
   *
   * Okumak, karar vermek ve sürüklemek üst üste biniyor: beş olayı okumak
   * tek başına on saniye, dizmek bir o kadar. Eşleştirme oyunlarının el
   * süresine (35–45 sn) yakın durması tesadüf değil — orada da tek "soru"
   * birden çok karar demek.
   */
  sirala: 40,
  /**
   * Kural Tuzağı'nın süresi kısa, çünkü oyunun ölçtüğü şey **hız**.
   *
   * Kuralı bilen öğrenci bir saniyede karar veriyor; sekiz saniye sağlama
   * yapmaya yetmiyor ama okumaya rahat rahat yetiyor. Uzun olsaydı oyun kural
   * bilgisini değil, sayı tutup deneme becerisini ölçerdi.
   */
  tuzak: 8,
}

/** Boss sorusuna verilen ek süre çarpanı. */
export const BOSS_SURE_CARPANI = 2

/**
 * Çetin boss'ta çarpan daha düşük.
 *
 * Zorluğun bir kısmı buradan geliyor: soru zaten `zor` havuzundan, üstüne bir
 * de rahat rahat düşünecek vakit yok.
 */
export const CETIN_SURE_CARPANI = 1.4

export function soruSuresi(oyun: OyunId, boss: BossZorlugu | null): number {
  const taban = SORU_SURESI[oyun]
  if (boss === null) return taban
  return Math.round(taban * (boss.cetin ? CETIN_SURE_CARPANI : BOSS_SURE_CARPANI))
}

/*
  Tur uzunluğu hiçbir oyunda sabit soru sayısıyla ölçülmüyor.

  Eskiden bosssuz oyunlar yirmi soru sürerdi ve rekor yirmide tavan yapıyordu:
  yirmi doğruyu bir kez çıkaran oyuncunun kıracak rekoru kalmıyor, ilerlemeyi
  ölçen sayı ölü bir sayıya dönüyordu. Artık turu bitiren şey moda göre süre ya
  da eleme; soru listesi yalnızca sonsuz dizi üretilemediği için sınırlı
  (`TUR_SORU_SINIRI`). Matematiği ötekilerden ayıran tek şey boss'un olmaması —
  sorular üretiliyor, "bir üst zorluk havuzu" diye bir karşılığı yok.
  (`bossluMu`)
*/

/**
 * Bu cevap turu bitirir mi.
 *
 * Kural artık moda ait (`mod.ts`): eleme yalnızca **Ani Ölüm**'de var. Bir
 * süre bütün turlar öyle işledi ve tasarımın gerekçesi hâlâ geçerli —
 * bilmediğin soruyu rastgele işaretleyip geçmek bedava olmamalı. Ama tek kural
 * olarak kaldığında oyun yeni öğrenene öğretmeyi bırakıp onu eliyordu; süreli
 * modlarda yanlışın bedeli süreden ödeniyor, elemeden.
 *
 * Süre dolması da yanlış sayılıyor: beklemek de bilmemek.
 *
 * **Oyun Bankası turu** modun üstünde: orada sorular zaten bir kez yanlış
 * bilinmiş olanlar ve turun amacı onları üç kez doğru bilip düşürmek; ilk
 * yanlışta kapanan bir tur o işi imkânsız kılardı.
 */
export function elerMi(
  dogruMu: boolean,
  bankaTuru = false,
  mod: OyunModu = 'ani-olum',
): boolean {
  return !dogruMu && !bankaTuru && MODLAR[mod].elerMi
}

// ---------------------------------------------------------------------------
// Tur sırası
// ---------------------------------------------------------------------------

/**
 * Hazırlanan en fazla soru.
 *
 * Tur sınırsız ama sonsuz bir dizi üretilemez. İki yüz soru, on soruda bir
 * eleyici boss geçen bir turda kimsenin ulaşamayacağı bir sayı; ulaşan olursa
 * da tur burada biter.
 */
export const TUR_SORU_SINIRI = 200

export type SiradakiSoru<T> = {
  soru: T
  /** Bu soru boss mu — eleyici olan ve tasarımı değişen. */
  boss: boolean
}

/** Havuzu zorluğa göre süzer. */
export function zorluktaSuz<T extends { zorluk: Zorluk }>(
  havuz: readonly T[],
  zorluk: Zorluk,
): T[] {
  return havuz.filter((s) => s.zorluk === zorluk)
}

/**
 * Turun soru sırası.
 *
 * Normal sorular seçilen zorluktan, her `BOSS_ARALIGI`'ncı soru bir üst
 * zorluktan geliyor. Havuz karıştırılıp sırayla tüketiliyor; tükenirse baştan
 * dönülüyor — sınırsız turda kaçınılmaz, ama tekrar ancak havuzun tamamı
 * bittikten sonra başlıyor.
 *
 * Seçilen zorlukta hiç soru yoksa (küçük havuzlarda olabilir) tüm havuza
 * düşülüyor: oyunun hiç açılmaması, kolay bir soru fazla çıkmasından kötü.
 */
export function turSirasi<T extends { zorluk: Zorluk }>(
  havuz: readonly T[],
  oyun: OyunId,
  zorluk: Zorluk,
  rastgele: () => number = Math.random,
  sinir: number = TUR_SORU_SINIRI,
): SiradakiSoru<T>[] {
  return bossYerlestir(
    dongu(zorluktaSuz(havuz, zorluk), havuz, rastgele),
    dongu(zorluktaSuz(havuz, bossZorlugu(zorluk).zorluk), havuz, rastgele),
    oyun,
    sinir,
  )
}

/**
 * Hazır iki listeyi tek sıraya örer: normal sorular ile boss soruları.
 *
 * `turSirasi` tek havuzdan çalışıyor; Yazım Ustası ise iki havuzu (yazım ve
 * noktalama) harmanlayarak kendi sırasını kuruyor. Yerleştirme kuralı ikisinde
 * de aynı olmalı, o yüzden burada ayrı duruyor.
 *
 * İki liste de sonuna gelince başa dönüyor — sınırsız turda kaçınılmaz, ama
 * tekrar ancak listenin tamamı bittikten sonra başlıyor.
 */
export function bossYerlestir<T>(
  normal: readonly T[],
  boss: readonly T[],
  oyun: OyunId,
  sinir: number = TUR_SORU_SINIRI,
): SiradakiSoru<T>[] {
  if (normal.length === 0) return []
  const bossListesi = boss.length > 0 ? boss : normal

  const sira: SiradakiSoru<T>[] = []
  let n = 0
  let b = 0
  for (let i = 1; i <= sinir; i++) {
    if (bossMu(oyun, i)) {
      sira.push({ soru: bossListesi[b % bossListesi.length], boss: true })
      b++
    } else {
      sira.push({ soru: normal[n % normal.length], boss: false })
      n++
    }
  }
  return sira
}

/** Süzülmüş havuz boşsa tamamına düşer; her hâlükârda karıştırır. */
function dongu<T>(suzulmus: readonly T[], tamami: readonly T[], rastgele: () => number): T[] {
  return karistir(suzulmus.length > 0 ? suzulmus : tamami, rastgele)
}
