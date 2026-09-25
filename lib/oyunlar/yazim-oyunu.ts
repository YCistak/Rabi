import type { YazimSorusu } from './yazim-havuzu'
import { YAZIM_HAVUZU } from './yazim-havuzu'
import type { NoktalamaSorusu } from './noktalama-havuzu'
import { ISARET_ADI, ISARET_SIMGESI, NOKTALAMA_HAVUZU } from './noktalama-havuzu'
import { karistir } from './tur'
import { yakinlariSonaAt, type Anahtar } from './gecmis'

/**
 * Yazım Ustası ile Noktalama İşaretleri'ne özgü mantık. Süre, ceza, rekor gibi
 * bütün oyunlarda ortak olan her şey `tur.ts` içinde.
 */

/**
 * Sorunun türü — aynı zamanda oyunun kimliği.
 *
 * İkisi bir süre tek oyundu ("Yazım Ustası") ve sorular sırayla
 * harmanlanıyordu. Ayrıldılar: biri kelimeye bakıp doğruya, öteki cümleye
 * bakıp yanlışa dokunduruyor ve art arda gelince oyuncu her soruda yönergeyi
 * yeniden okuyordu. Mantık ortak kaldı çünkü iki soru da iki şıklı.
 */
export type SoruTuru = 'yazim' | 'noktalama'

export type Sik = {
  metin: string
  /** Noktalamada işaretin adı ("noktalı virgül"); yazımda yok. */
  altYazi?: string
  /** Bu şıkka dokunmak doğru cevap mı. */
  dogruMu: boolean
}

/**
 * Sorunun kendisi, şıklardan bağımsız.
 *
 * Tur sonunda yanlışlar bu tiple listeleniyor, o yüzden şıkları taşımıyor:
 * şıkların sırası ekrana özgü, öğrenilecek olan sorunun içeriği.
 */
export type SoruIcerigi =
  | { tur: 'yazim'; soru: YazimSorusu }
  | { tur: 'noktalama'; soru: NoktalamaSorusu }

/** Ekrana gelen tek soru: içerik + karıştırılmış iki şık. */
export type OyunSorusu = SoruIcerigi & { siklar: [Sik, Sik] }

export type Havuzlar = {
  yazim: readonly YazimSorusu[]
  noktalama: readonly NoktalamaSorusu[]
}

export const VARSAYILAN_HAVUZLAR: Havuzlar = {
  yazim: YAZIM_HAVUZU,
  noktalama: NOKTALAMA_HAVUZU,
}

/** Seçilmeyen türün havuzu boşalıyor; tur kurulumu tek yerden okunuyor. */
export function havuzlariSec(
  secili: readonly SoruTuru[],
  tumu: Havuzlar = VARSAYILAN_HAVUZLAR,
): Havuzlar {
  return {
    yazim: secili.includes('yazim') ? tumu.yazim : [],
    noktalama: secili.includes('noktalama') ? tumu.noktalama : [],
  }
}

/** Yazım sorusu: iki yazılıştan doğrusuna dokunuluyor. */
function yazimdanSoru(soru: YazimSorusu, rastgele: () => number): OyunSorusu {
  const dogruSik: Sik = { metin: soru.dogru, dogruMu: true }
  const yanlisSik: Sik = { metin: soru.yanlis, dogruMu: false }
  return {
    tur: 'yazim',
    soru,
    siklar: rastgele() < 0.5 ? [dogruSik, yanlisSik] : [yanlisSik, dogruSik],
  }
}

/**
 * Noktalama sorusu: cümledeki **yanlış** işarete dokunuluyor.
 *
 * `dogruMu` şıkkın kendisiyle değil dokunuşla ilgili: aranan şık, cümlede
 * yanlış kullanılmış işaret. Çeldirici, aynı cümlede doğru kullanılmış bir
 * işaret — uydurma bir işaret konsaydı cümleyi okumadan elenirdi.
 */
function noktalamadanSoru(soru: NoktalamaSorusu, rastgele: () => number): OyunSorusu {
  const aranan: Sik = {
    metin: ISARET_SIMGESI[soru.yanlisIsaret],
    altYazi: ISARET_ADI[soru.yanlisIsaret],
    dogruMu: true,
  }
  const celdirici: Sik = {
    metin: ISARET_SIMGESI[soru.dogruIsaret],
    altYazi: ISARET_ADI[soru.dogruIsaret],
    dogruMu: false,
  }
  return {
    tur: 'noktalama',
    soru,
    siklar: rastgele() < 0.5 ? [aranan, celdirici] : [celdirici, aranan],
  }
}

/**
 * Bir turun soru sırası.
 *
 * Havuzlar baştan bir kez karıştırılıp sırayla tüketiliyor; her soruda rastgele
 * çekilseydi aynı kelime tur içinde iki kez çıkabilirdi. Doğru şıkkın hangi
 * tarafa düşeceği de her soruda ayrıca atılıyor — sabit olsaydı oyuncu birkaç
 * soruda konumu ezberler, soruya bakmayı bırakırdı.
 */
export function turHazirla(
  havuzlar: Havuzlar = VARSAYILAN_HAVUZLAR,
  rastgele: () => number = Math.random,
  /**
   * Yakın turlarda görülenler sona atılıyor (`gecmis.ts`). İki havuzun
   * kimliği ayrı üretildiği için anahtar da ikiye ayrı.
   */
  gecmis?: {
    gorulenler: readonly string[]
    yazim: Anahtar<YazimSorusu>
    noktalama: Anahtar<NoktalamaSorusu>
  },
): OyunSorusu[] {
  const yazimSirasi = karistir(havuzlar.yazim, rastgele)
  const noktalamaSirasi = karistir(havuzlar.noktalama, rastgele)
  const yazim = (
    gecmis ? yakinlariSonaAt(yazimSirasi, gecmis.gorulenler, gecmis.yazim) : yazimSirasi
  ).map((soru) => yazimdanSoru(soru, rastgele))
  const noktalama = (
    gecmis
      ? yakinlariSonaAt(noktalamaSirasi, gecmis.gorulenler, gecmis.noktalama)
      : noktalamaSirasi
  ).map((soru) => noktalamadanSoru(soru, rastgele))
  // Oyunlar ayrı olduğu için havuzlardan biri hep boş; ikisi de doluysa
  // (yalnızca testlerde) sırayla ekleniyorlar.
  return [...yazim, ...noktalama]
}
