/**
 * Formül–Ad Eşleştirme'nin el (hand) kurucusu.
 *
 * Edebiyat Eşleştirme'nin (`edebiyat.ts`) kardeşi ama daha basit: orada bir
 * yazarın birden çok eseri var ve el kurulurken yazar tekrarı ayıklanıyor,
 * burada formül ile ad birebir eşleşiyor — aynı ada iki formül düşmüyor.
 * Ortak kalan tek kural el mümkünse **tek türden** kuruluyor: karışık bir elde
 * öğrenci formüle değil biçime bakıp eliyor.
 */

import { FORMUL_HAVUZU, type FormulEsi, type FormulTuru } from './formul-havuzu'
import type { Zorluk } from './ritim'
import { karistir, sec } from './tur'

/** Bir eldeki bileşik sayısı — eşleştirme oyunlarında ortak. */
export const EL_BOYUTU = 6

export type FormulEli = {
  /** El tek türden kurulduysa o tür; karışıksa null. */
  tur: FormulTuru | null
  esler: FormulEsi[]
  /** Ekrandaki sıraya göre karıştırılmış formüller ve adlar. */
  formuller: string[]
  adlar: string[]
}

/**
 * Formülün çizim parçaları.
 *
 * Rakamlar alt indise iniyor: `H2SO4` ekranda H₂SO₄ olarak duruyor. Unicode'un
 * alt indis rakamları kullanılmadı — Nunito'da yoklar ve tarayıcı eksik
 * karakteri başka bir aileden çiziyor, formülün yarısı başka yazı tipinde
 * kalıyordu (`formul-havuzu.ts`).
 *
 * Kural basit tutulabiliyor çünkü havuzdaki formüllerde **her** rakam bir alt
 * indis: değerlik gösteren Roma rakamları formülde değil adda duruyor
 * ("Bakır(II) sülfat").
 */
export function formulParcalari(formul: string): { metin: string; alt: boolean }[] {
  const parcalar: { metin: string; alt: boolean }[] = []
  for (const karakter of formul) {
    const alt = karakter >= '0' && karakter <= '9'
    const son = parcalar[parcalar.length - 1]
    if (son && son.alt === alt) son.metin += karakter
    else parcalar.push({ metin: karakter, alt })
  }
  return parcalar
}

/**
 * Sıradaki el.
 *
 * `kullanilan`, tur boyunca daha önce sorulmuş formüller — aynı bileşik bir
 * turda iki kez sorulmasın diye. Havuz tükenince `null` dönüyor ve tur erken
 * bitiyor.
 *
 * **Zorluk elin türünü değil içindekileri belirliyor.** Öteki oyunlarda havuz
 * önce zorluğa göre süzülüyor (`zorluktaSuz`); burada süzülseydi Kolay'da tek
 * bir tür bile altıya ulaşamaz ve her el karışık kurulurdu — karışık elde ise
 * öğrenci formüle değil biçime bakıp eliyor ("OH ile bitiyorsa bazdır"). Tür
 * bu yüzden bütün havuzdan seçiliyor, seçilen zorluk da o türün içinde
 * **öne alınıyor**: istenen seviyeden yeterince bileşik varsa el tümüyle
 * oradan çıkıyor, yoksa aynı türün öteki seviyeleri tamamlıyor.
 */
export function elHazirla(
  kullanilan: ReadonlySet<string> = new Set(),
  zorluk: Zorluk | null = null,
  havuz: readonly FormulEsi[] = FORMUL_HAVUZU,
  rastgele: () => number = Math.random,
): FormulEli | null {
  const kalan = havuz.filter((e) => !kullanilan.has(e.formul))
  if (kalan.length < EL_BOYUTU) return null

  // Tek türden kurulabilecek türler; hiçbiri yetmezse karışık el.
  const turler = new Map<FormulTuru, FormulEsi[]>()
  for (const es of kalan) {
    const liste = turler.get(es.tur)
    if (liste) liste.push(es)
    else turler.set(es.tur, [es])
  }

  const uygunTurler = [...turler.entries()].filter(([, esler]) => esler.length >= EL_BOYUTU)

  const [turAdi, kaynak] =
    uygunTurler.length > 0
      ? sec(uygunTurler, rastgele)
      : ([null, kalan] as [null, FormulEsi[]])

  const istenen = zorluk === null ? [] : karistir(kaynak.filter((e) => e.zorluk === zorluk), rastgele)
  const gerisi = karistir(
    zorluk === null ? kaynak : kaynak.filter((e) => e.zorluk !== zorluk),
    rastgele,
  )
  const esler = [...istenen, ...gerisi].slice(0, EL_BOYUTU)

  return {
    tur: turAdi,
    esler,
    // İki sütun ayrı karıştırılıyor: aynı sırada dursalardı eşleştirme
    // okumadan, konuma bakarak yapılırdı.
    formuller: karistir(esler.map((e) => e.formul), rastgele),
    adlar: karistir(esler.map((e) => e.ad), rastgele),
  }
}

/** Seçilen formül ile ad aynı eşe mi ait. */
export function eslesiyorMu(el: FormulEli, formul: string, ad: string): boolean {
  return el.esler.some((e) => e.formul === formul && e.ad === ad)
}

/** Bir formülün doğru adı — yanlış eşleştirmede doğrusunu göstermek için. */
export function adiniBul(el: FormulEli, formul: string): string | null {
  return el.esler.find((e) => e.formul === formul)?.ad ?? null
}
