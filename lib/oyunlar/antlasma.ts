import type { AntlasmaMaddesi, TarihDonemi } from './antlasma-havuzu'
import { ANTLASMA_HAVUZU } from './antlasma-havuzu'
import { karistir, sec } from './tur'

/**
 * Antlaşma eşleştirme oyununun el (hand) kurucusu.
 *
 * Bir "el" dört madde ve o maddelerin ait olduğu dört antlaşma. Edebiyat
 * oyunuyla aynı iki kural geçerli:
 *
 * 1. **Bir elde aynı antlaşmadan iki madde olamaz.** Olsaydı o antlaşmanın
 *    tuşu iki maddeye birden uyar, oyuncunun doğru cevabı yanlış sayılırdı.
 * 2. **Mümkünse el tek dönemden kurulur.** Dönemler karışsaydı öğrenci maddeyi
 *    okumadan tarihe bakarak eşleştirirdi ("bu eski duruyor"); aynı dönemden
 *    dört antlaşma ise gerçekten bilmeyi gerektiriyor.
 *
 * El altı değil **dört**: madde metinleri bir cümlelik: altı madde ile altı
 * antlaşma telefon ekranına okunur boyutta sığmıyor.
 */

/** Bir eldeki madde sayısı. */
export const EL_BOYUTU = 4

export type AntlasmaEli = {
  /** El tek dönemden kurulduysa o dönem; karışıksa null. */
  donem: TarihDonemi | null
  esler: AntlasmaMaddesi[]
  /** Ekrandaki sıraya göre karıştırılmış madde ve antlaşma listeleri. */
  maddeler: string[]
  antlasmalar: string[]
}

/** Farklı antlaşma sayısı — bir dönemin el kurmaya yetip yetmediğini söyler. */
function farkliAntlasma(esler: readonly AntlasmaMaddesi[]): number {
  return new Set(esler.map((e) => e.antlasma)).size
}

/** Antlaşmayı tekrarlamadan `adet` kadar madde seçer; yetmezse kısa liste döner. */
function tekAntlasmaylaSec(
  esler: readonly AntlasmaMaddesi[],
  adet: number,
  rastgele: () => number,
): AntlasmaMaddesi[] {
  const secilen: AntlasmaMaddesi[] = []
  const antlasmalar = new Set<string>()

  for (const es of karistir(esler, rastgele)) {
    if (secilen.length >= adet) break
    if (antlasmalar.has(es.antlasma)) continue
    antlasmalar.add(es.antlasma)
    secilen.push(es)
  }
  return secilen
}

/**
 * Sıradaki el.
 *
 * `kullanilan`, tur boyunca daha önce sorulmuş madde metinleri — aynı madde bir
 * turda iki kez sorulmasın diye. Havuz tükenince `null` dönüyor ve tur erken
 * bitiyor.
 */
export function elHazirla(
  kullanilan: ReadonlySet<string> = new Set(),
  havuz: readonly AntlasmaMaddesi[] = ANTLASMA_HAVUZU,
  rastgele: () => number = Math.random,
): AntlasmaEli | null {
  const kalan = havuz.filter((e) => !kullanilan.has(e.madde))
  if (farkliAntlasma(kalan) < EL_BOYUTU) return null

  const donemler = new Map<TarihDonemi, AntlasmaMaddesi[]>()
  for (const es of kalan) {
    const liste = donemler.get(es.donem)
    if (liste) liste.push(es)
    else donemler.set(es.donem, [es])
  }

  const uygunDonemler = [...donemler.entries()].filter(
    ([, esler]) => farkliAntlasma(esler) >= EL_BOYUTU,
  )

  const [donem, kaynak] =
    uygunDonemler.length > 0
      ? sec(uygunDonemler, rastgele)
      : ([null, kalan] as [null, AntlasmaMaddesi[]])

  const esler = tekAntlasmaylaSec(kaynak, EL_BOYUTU, rastgele)
  if (esler.length < EL_BOYUTU) return null

  return {
    donem,
    esler,
    // İki sütun ayrı karıştırılıyor: aynı sırada dursalardı eşleştirme
    // okumadan, konuma bakarak yapılırdı.
    maddeler: karistir(esler.map((e) => e.madde), rastgele),
    antlasmalar: karistir(esler.map((e) => e.antlasma), rastgele),
  }
}

/** Seçilen madde ile antlaşma aynı eşe mi ait. */
export function eslesiyorMu(el: AntlasmaEli, madde: string, antlasma: string): boolean {
  return el.esler.some((e) => e.madde === madde && e.antlasma === antlasma)
}

/** Bir maddenin doğru antlaşması — yanlış eşleştirmede doğrusunu göstermek için. */
export function antlasmasiniBul(el: AntlasmaEli, madde: string): string | null {
  return el.esler.find((e) => e.madde === madde)?.antlasma ?? null
}
