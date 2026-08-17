import type { EdebiyatDonemi, EdebiyatEsi } from './edebiyat-havuzu'
import { EDEBIYAT_HAVUZU } from './edebiyat-havuzu'
import { karistir, sec } from './tur'

/**
 * Edebiyat eşleştirme oyununun el (hand) kurucusu.
 *
 * Bir "el" altı eser ve onların altı yazarı. İki kural bu kurucunun tamamını
 * belirliyor:
 *
 * 1. **Bir elde aynı yazardan iki eser olamaz.** Olsaydı o yazarın tuşu iki
 *    esere birden uyar, oyuncunun doğru cevabı yanlış sayılırdı.
 * 2. **Mümkünse el tek dönemden kurulur.** Dönemler karışsaydı öğrenci esere
 *    değil çağrışıma bakardı ("bu isim eski duruyor"); aynı dönemden altı isim
 *    ise gerçekten bilmeyi gerektiriyor. Yeterli yazar kalmayınca karışık ele
 *    düşülüyor — oyun soru bulamayıp durmasın.
 */

/** Bir eldeki eser sayısı. */
export const EL_BOYUTU = 6

export type EdebiyatEli = {
  /** El tek dönemden kurulduysa o dönem; karışıksa null. */
  donem: EdebiyatDonemi | null
  esler: EdebiyatEsi[]
  /** Ekrandaki sıraya göre karıştırılmış eser ve yazar adları. */
  eserler: string[]
  yazarlar: string[]
}

/** Farklı yazar sayısı — bir dönemin el kurmaya yetip yetmediğini söyler. */
function farkliYazar(esler: readonly EdebiyatEsi[]): number {
  return new Set(esler.map((e) => e.yazar)).size
}

/** Yazarı tekrarlamadan `adet` kadar eş seçer; yetmezse kısa liste döner. */
function tekYazarlaSec(
  esler: readonly EdebiyatEsi[],
  adet: number,
  rastgele: () => number,
): EdebiyatEsi[] {
  const secilen: EdebiyatEsi[] = []
  const yazarlar = new Set<string>()

  for (const es of karistir(esler, rastgele)) {
    if (secilen.length >= adet) break
    if (yazarlar.has(es.yazar)) continue
    yazarlar.add(es.yazar)
    secilen.push(es)
  }
  return secilen
}

/**
 * Sıradaki el.
 *
 * `kullanilan`, tur boyunca daha önce sorulmuş eser adları — aynı eser bir turda
 * iki kez sorulmasın diye. Havuz tükenince `null` dönüyor ve tur erken bitiyor.
 */
export function elHazirla(
  kullanilan: ReadonlySet<string> = new Set(),
  havuz: readonly EdebiyatEsi[] = EDEBIYAT_HAVUZU,
  rastgele: () => number = Math.random,
): EdebiyatEli | null {
  const kalan = havuz.filter((e) => !kullanilan.has(e.eser))
  if (farkliYazar(kalan) < EL_BOYUTU) return null

  // Tek dönemden kurulabilecek dönemler; hiçbiri yetmezse karışık el.
  const donemler = new Map<EdebiyatDonemi, EdebiyatEsi[]>()
  for (const es of kalan) {
    const liste = donemler.get(es.donem)
    if (liste) liste.push(es)
    else donemler.set(es.donem, [es])
  }

  const uygunDonemler = [...donemler.entries()].filter(
    ([, esler]) => farkliYazar(esler) >= EL_BOYUTU,
  )

  const [donem, kaynak] =
    uygunDonemler.length > 0
      ? sec(uygunDonemler, rastgele)
      : ([null, kalan] as [null, EdebiyatEsi[]])

  const esler = tekYazarlaSec(kaynak, EL_BOYUTU, rastgele)
  if (esler.length < EL_BOYUTU) return null

  return {
    donem,
    esler,
    // İki sütun ayrı karıştırılıyor: aynı sırada dursalardı eşleştirme
    // okumadan, konuma bakarak yapılırdı.
    eserler: karistir(esler.map((e) => e.eser), rastgele),
    yazarlar: karistir(esler.map((e) => e.yazar), rastgele),
  }
}

/** Seçilen eser ile yazar aynı eşe mi ait. */
export function eslesiyorMu(el: EdebiyatEli, eser: string, yazar: string): boolean {
  return el.esler.some((e) => e.eser === eser && e.yazar === yazar)
}

/** Bir eserin doğru yazarı — yanlış eşleştirmede doğrusunu göstermek için. */
export function yazariniBul(el: EdebiyatEli, eser: string): string | null {
  return el.esler.find((e) => e.eser === eser)?.yazar ?? null
}
