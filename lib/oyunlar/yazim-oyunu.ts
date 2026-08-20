import type { YazimSorusu } from './yazim-havuzu'
import { YAZIM_HAVUZU } from './yazim-havuzu'
import type { NoktalamaSorusu } from './noktalama-havuzu'
import { ISARET_ADI, ISARET_SIMGESI, NOKTALAMA_HAVUZU } from './noktalama-havuzu'
import { siklariDiz } from './sik-dizilimi'
import { karistir } from './tur'

/**
 * Yazım Ustası'na özgü mantık. Süre, ceza, rekor gibi bütün oyunlarda ortak
 * olan her şey `tur.ts` içinde.
 */

/**
 * Turda hangi soruların çıkacağı.
 *
 * İkisi de tek oyunun içinde: ikisi de aynı şeyi ölçüyor (cümleyi doğru yazmak)
 * ve ikisi de iki şıklı. Ayrı oyun olsalardı rekorlar bölünür, "Yazım Ustası"
 * yarım kalırdı.
 */
export type SoruTuru = 'yazim' | 'noktalama'

export const TUM_SORU_TURLERI: SoruTuru[] = ['yazim', 'noktalama']

export const SORU_TURU_ADI: Record<SoruTuru, string> = {
  yazim: 'Yazım hatası',
  noktalama: 'Noktalama hatası',
}

/** Seçim çiplerinin altında görünen örnek. */
export const SORU_TURU_ORNEGI: Record<SoruTuru, string> = {
  yazim: 'yalnız / yanlız',
  noktalama: 'Ali, ve Ayşe geldi.',
}

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

/**
 * İki havuzu sırayla harmanlar.
 *
 * Düz birleştirip karıştırmak olmazdı: yazım havuzu noktalamanınkinin birkaç
 * katı, rastgele karışımda 60 saniyelik tura bir iki noktalama sorusu düşerdi.
 * Sırayla alınca iki tür de eşit görünüyor. Hangisinin başlayacağı her turda
 * ayrıca atılıyor — sabit olsaydı oyuncu ilk soruyu görmeden ne geleceğini
 * bilirdi.
 */
function harmanla<T>(bir: readonly T[], iki: readonly T[], rastgele: () => number): T[] {
  const [ilk, ikinci] = rastgele() < 0.5 ? [bir, iki] : [iki, bir]
  const sonuc: T[] = []
  const uzunluk = Math.max(ilk.length, ikinci.length)
  for (let i = 0; i < uzunluk; i++) {
    if (i < ilk.length) sonuc.push(ilk[i])
    if (i < ikinci.length) sonuc.push(ikinci[i])
  }
  return sonuc
}

/** Yazım sorusu: iki yazılıştan doğrusuna dokunuluyor. */
function yazimdanSoru(soru: YazimSorusu, rastgele: () => number): OyunSorusu {
  const dogruSik: Sik = { metin: soru.dogru, dogruMu: true }
  const yanlisSik: Sik = { metin: soru.yanlis, dogruMu: false }
  const [ilk, ikinci] = siklariDiz([dogruSik, yanlisSik], (s) => s.metin, rastgele)
  return { tur: 'yazim', soru, siklar: [ilk, ikinci] }
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
  const [ilk, ikinci] = siklariDiz([aranan, celdirici], (s) => s.metin, rastgele)
  return { tur: 'noktalama', soru, siklar: [ilk, ikinci] }
}

/**
 * Bir turun soru sırası.
 *
 * Havuzlar baştan bir kez karıştırılıp sırayla tüketiliyor; her soruda rastgele
 * çekilseydi aynı kelime tur içinde iki kez çıkabilirdi. Doğru şıkkın hangi
 * tarafa düşeceği de her soruda ayrıca atılıyor — sabit olsaydı oyuncu birkaç
 * soruda konumu ezberler, soruya bakmayı bırakırdı.
 */
/**
 * Şıkları yeniden kurar.
 *
 * `bossYerlestir` sıra havuzun sonuna gelince başa dönüyor ve aynı soru
 * nesnesini olduğu gibi tekrar veriyor; şıklar soruyla birlikte bir kez
 * kurulduğu için ikinci gösterimde aynı yerde kalırlardı. Sıra örüldükten
 * sonra her soru buradan geçiriliyor.
 */
export function siklariYenile(
  soru: OyunSorusu,
  rastgele: () => number = Math.random,
): OyunSorusu {
  return soru.tur === 'yazim'
    ? yazimdanSoru(soru.soru, rastgele)
    : noktalamadanSoru(soru.soru, rastgele)
}

export function turHazirla(
  havuzlar: Havuzlar = VARSAYILAN_HAVUZLAR,
  rastgele: () => number = Math.random,
): OyunSorusu[] {
  const yazim = karistir(havuzlar.yazim, rastgele).map((soru) => yazimdanSoru(soru, rastgele))
  const noktalama = karistir(havuzlar.noktalama, rastgele).map((soru) =>
    noktalamadanSoru(soru, rastgele),
  )
  return harmanla(yazim, noktalama, rastgele)
}
