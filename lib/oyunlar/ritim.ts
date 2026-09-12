/**
 * Turun ritmi — soru başına süre, zorluk şeritleri ve eleme kuralları.
 *
 * Buradaki süreler **soru** başına ve yalnızca Ani Ölüm modunda işliyor; öteki
 * modlarda saat tura ait ya da hiç yok (`mod.ts`). İkisi ayrı dosyada çünkü
 * ayrı sorular: burası "bu soru ne kadar sürer", orası "tur ne zaman biter".
 *
 * `tur.ts` puanlama ve rekor mantığını tutuyor, burası zamanlama ve eleme;
 * ikisi ayrı çünkü ritim oyundan oyuna değişiyor, puanlama değişmiyor.
 * Sorunun hangi seviyeden geleceğine karar veren yer ise `uyum.ts` — burası
 * yalnızca üç seviyenin şeridini hazırlıyor.
 *
 * ## Boss soruları kaldırıldı
 *
 * Her onuncu soru bir üst seviyeden gelen, ekranı kırmızıya çeviren ve tek
 * yanlışta turu bitiren bir "boss"tu. Zorluk artık turun içinde
 * kendiliğinden kayıyor (`uyum.ts`) ve boss o kuralın üstünde ikinci,
 * habersiz bir zorluk sıçraması oluyordu: oyuncu iyi gittiği için zaten zor
 * sorulardayken onuncu soruda bir de "bir üst seviye" geliyordu — zorun üstü
 * olmadığı için de aynı soru daha kısa süreyle. Ölçülen şey bilgi olmaktan
 * çıkıp sayaca yetişmek oluyordu.
 */

import type { OyunId } from '../types'
import { MODLAR, type OyunModu } from './mod'
import { karistir } from './tur'
import { yakinlariSonaAt, type Anahtar } from './gecmis'

export type Zorluk = 'kolay' | 'orta' | 'zor'

export const ZORLUKLAR: readonly Zorluk[] = ['kolay', 'orta', 'zor'] as const

export const ZORLUK_ADI: Record<Zorluk, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
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
  /**
   * İklimde süre haritayı okumaya gidiyor.
   *
   * Şık okumak beş saniye sürüyor; işaretli bölgeyi dünya haritasında bulmak
   * ve enlemini görmek daha uzun — sorunun asıl işi o.
   */
  iklim: 18,
  /**
   * İzohipste süre en uzunu: eğrilerin biçimine bakmak yetmiyor, yükselti
   * sayılarını da okumak gerekiyor. Tepe ile kapalı çukuru ayıran tek şey o
   * sayılar; okumadan verilen cevap yazı turadan farksız.
   */
  izohips: 22,
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
   * İpuçları sürenin ilk dörtte üçünü eşit üçe bölüyor (`hucre.ts`): on iki
   * saniye, ipucu başına üç saniye ve sonda üç saniyelik karar payı demek.
   * Dokuzdu; ipucular bir buçuk saniyede bir geliyor ve okunamıyordu.
   * Süre değişirse ipucu ritmi de değişir.
   */
  hucre: 12,
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
  /**
   * Periyodik tabloda süre göz taramasına gidiyor.
   *
   * Soruyu okumak bir saniye, 18 sütunluk tabloda hücreyi bulmak on saniye —
   * Harita Avı'ndaki hesabın aynısı.
   */
  periyodik: 16,
  /** Formül'de süre **el** başına: oyun altılı eşleştirme dağıtıyor. */
  formul: 40,
}

/**
 * Sorunun süresi.
 *
 * Zorluk **süreyi değiştirmiyor**: seviye sorunun kendisini seçiyor, üstüne
 * bir de saati kısaltmak aynı kararı iki kez uygulamak olurdu. (Boss
 * sorularında öyleydi ve tam bu sebeple kaldırıldı.)
 */
export function soruSuresi(oyun: OyunId): number {
  return SORU_SURESI[oyun]
}

/*
  Tur uzunluğu hiçbir oyunda sabit soru sayısıyla ölçülmüyor.

  Eskiden yirmi soruluk turlar vardı ve rekor yirmide tavan yapıyordu: yirmi
  doğruyu bir kez çıkaran oyuncunun kıracak rekoru kalmıyor, ilerlemeyi ölçen
  sayı ölü bir sayıya dönüyordu. Artık turu bitiren şey moda göre süre ya da
  eleme; soru listesi yalnızca sonsuz dizi üretilemediği için sınırlı
  (`TUR_SORU_SINIRI`).
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
 * bilinmiş olanlar ve turun amacı hepsini bir kez daha görmek; ilk
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
 * Tur sınırsız ama sonsuz bir dizi üretilemez. İki yüz soru, süresi ya da tek
 * yanlışla biten bir turda kimsenin ulaşamayacağı bir sayı; ulaşan olursa da
 * tur burada biter.
 */
export const TUR_SORU_SINIRI = 200

/**
 * Turun üç zorluk şeridi.
 *
 * Zorluk tur başlamadan seçilmiyor, tur içinde kayıyor (`uyum.ts`) — yani
 * sıradaki sorunun hangi havuzdan geleceği ancak o soruya gelindiğinde belli
 * oluyor. Tek bir liste önceden kurulamaz.
 *
 * Şeritler bunu çözüyor: üç seviyenin **her biri** için ayrı, karıştırılmış ve
 * tur sınırına kadar döndürülmüş bir liste hazırlanıyor. Oyun `akis[zorluk]`
 * şeridini aynı `sira` numarasıyla okuyor, yani seviye değişince yalnızca
 * şerit değişiyor; ekranın soru sayacı, tur sonu koşulu ve sırayı tutan state
 * olduğu gibi kalıyor.
 *
 * Şeritler birbirinden bağımsız karıştığı için seviye değiştirmek soruyu
 * atlamıyor ya da tekrar ettirmiyor: havuzlar `zorluk` alanına göre ayrık.
 */
export type SoruAkisi<T> = Record<Zorluk, T[]>

/** Havuzu zorluğa göre süzer. */
export function zorluktaSuz<T extends { zorluk: Zorluk }>(
  havuz: readonly T[],
  zorluk: Zorluk,
): T[] {
  return havuz.filter((s) => s.zorluk === zorluk)
}

/**
 * Önceki turlardan devralınan geçmiş: hangi sorular yakınlarda soruldu ve
 * havuzdaki bir soru o kayıtta hangi kimlikle anılıyor (`gecmis.ts`).
 */
export type TurGecmisi<T> = {
  gorulenler: readonly string[]
  anahtar: Anahtar<T>
}

/**
 * Turun soru şeritleri.
 *
 * Her şerit karıştırılıp sırayla tüketiliyor; tükenirse baştan dönülüyor —
 * sınırsız turda kaçınılmaz, ama tekrar ancak havuzun tamamı bittikten sonra
 * başlıyor.
 *
 * `gecmis` verilirse yakın turlarda görülen sorular şeridin sonuna atılıyor;
 * karıştırma yine yapılıyor, geçmiş yalnızca görülmeyenleri öne alıyor.
 *
 * Bir zorlukta hiç soru yoksa (küçük havuzlarda olabilir) o şerit tüm havuzdan
 * kuruluyor: oyunun ortasında durmak, bir soru fazla kolay gelmesinden kötü.
 */
export function turSirasi<T extends { zorluk: Zorluk }>(
  havuz: readonly T[],
  rastgele: () => number = Math.random,
  sinir: number = TUR_SORU_SINIRI,
  gecmis?: TurGecmisi<T>,
): SoruAkisi<T> {
  return {
    kolay: serit(zorluktaSuz(havuz, 'kolay'), havuz, rastgele, sinir, gecmis),
    orta: serit(zorluktaSuz(havuz, 'orta'), havuz, rastgele, sinir, gecmis),
    zor: serit(zorluktaSuz(havuz, 'zor'), havuz, rastgele, sinir, gecmis),
  }
}

/**
 * Hazır tek bir listeden şerit kümesi.
 *
 * Oyun Bankası turunda zorluk yok: sorular kullanıcının kendi yanlışları ve
 * hepsi bir kez sorulacak. Üç şerit de aynı listeye bakıyor, yani uyum
 * kayarsa da soru sırası değişmiyor.
 */
export function tekAkis<T>(sorular: readonly T[]): SoruAkisi<T> {
  const liste = [...sorular]
  return { kolay: liste, orta: liste, zor: liste }
}

/**
 * Üretilen sorulardan şerit kümesi.
 *
 * Soruları havuzdan değil üreterek kuran oyunlar (izohips, kural tuzağı, zaman
 * şeridi) için: `uret` her seviye için bir kez çağrılıyor. Havuzlu oyunlardaki
 * `turSirasi`'nın karşılığı.
 */
export function akisUret<T>(uret: (zorluk: Zorluk) => T[]): SoruAkisi<T> {
  return { kolay: uret('kolay'), orta: uret('orta'), zor: uret('zor') }
}

/**
 * Şeritlerin her birini dönüştürür.
 *
 * Oyunlar havuzdaki ham soruya şıklarını burada ekliyor. Şerit başına
 * çağrılıyor çünkü şıkların üretimi listeyi yeniden karıştırabiliyor ve
 * şeritler birbirinden bağımsız.
 */
export function akisiEsle<T, U>(
  akis: SoruAkisi<T>,
  donustur: (sorular: T[]) => U[],
): SoruAkisi<U> {
  return {
    kolay: donustur(akis.kolay),
    orta: donustur(akis.orta),
    zor: donustur(akis.zor),
  }
}

/**
 * Turun kaç soru sürebileceği.
 *
 * En **kısa** şerit belirliyor: `sira` üç şeritte de aynı sayı ve daha uzun
 * bir şeridin sonuna kadar gitmek, kısa şeride geçildiğinde tanımsız soru
 * demek olurdu.
 */
export function akisUzunlugu<T>(akis: SoruAkisi<T>): number {
  return Math.min(akis.kolay.length, akis.orta.length, akis.zor.length)
}

/**
 * Süzülmüş havuz boşsa tamamına düşer; karıştırıp sınıra kadar döndürür.
 *
 * Geçmiş karıştırmadan **sonra** uygulanıyor: görülmeyenlerin kendi arasındaki
 * sıra karışık kalmalı, geçmiş yalnızca görülenleri arkaya itmeli.
 */
function serit<T>(
  suzulmus: readonly T[],
  tamami: readonly T[],
  rastgele: () => number,
  sinir: number,
  gecmis?: TurGecmisi<T>,
): T[] {
  const karisik = karistir(suzulmus.length > 0 ? suzulmus : tamami, rastgele)
  const kaynak = gecmis ? yakinlariSonaAt(karisik, gecmis.gorulenler, gecmis.anahtar) : karisik
  if (kaynak.length === 0) return []
  return Array.from({ length: sinir }, (_, i) => kaynak[i % kaynak.length])
}
