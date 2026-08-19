import { karistir } from './tur'

/**
 * Çoktan seçmeli oyunların ortak mantığı.
 *
 * Ses Olayları ve Cümlenin Ögeleri aynı işi yapıyor: bir soru gösterip sabit
 * bir seçenek kümesinden doğrusunu seçtiriyor. İkinci oyunda aynı kırk satır
 * kopyalanacaktı; listede bu mekanikle yapılacak başka oyunlar da var
 * (Deyim Avı, Noktalama), o yüzden ortak yer buraya kuruldu.
 *
 * Seçenek kümesi **sabit** olmalı: şıklar bütün olası cevaplardan çekiliyor,
 * sorunun kendi içinden değil.
 */

/** Bir soruda gösterilen şık sayısı. */
export const SIK_SAYISI = 4

export type Sik<T> = {
  deger: T
  metin: string
  dogruMu: boolean
}

export type CoktanSecmeliSoru<S, T> = {
  soru: S
  siklar: Sik<T>[]
}

/**
 * Bir sorunun şıkları: doğru cevap + üç çeldirici.
 *
 * Çeldiriciler rastgele seçiliyor ve dizilim de her soruda yeniden atılıyor:
 * doğru şık hep aynı yerde olsaydı oyuncu birkaç soruda konumu ezberler,
 * soruya bakmayı bırakırdı.
 */
export function siklariKur<T>(
  dogru: T,
  tumSecenekler: readonly T[],
  ad: (deger: T) => string,
  rastgele: () => number = Math.random,
  /**
   * Bir adayın çeldirici olmaya uygun olup olmadığı.
   *
   * Sabit seçenekli oyunlarda (Ses Olayları, Cümlenin Ögeleri) "doğru olmasın"
   * yetiyor. Ama şıklar havuzun kendisinden geliyorsa yetmiyor: iki deyimin
   * anlamı aynı olabilir ve o zaman iki şık birden doğru olur. Deyimler
   * oyununda bu yüzden "farklı konudan olsun" kuralı geçiliyor.
   */
  celdiriciUygunMu: (aday: T, dogru: T) => boolean = (aday, d) => aday !== d,
): Sik<T>[] {
  const uygunlar = tumSecenekler.filter((s) => s !== dogru && celdiriciUygunMu(s, dogru))
  let celdiriciler = karistir(uygunlar, rastgele).slice(0, SIK_SAYISI - 1)

  // Uygun aday üçe yetmezse şık sayısı düşerdi; kalanı elemeye takılanlardan
  // tamamlanıyor. Dar bir havuzda dört şık, kusursuz çeldiriciden önemli.
  if (celdiriciler.length < SIK_SAYISI - 1) {
    const secilen = new Set(celdiriciler)
    const yedek = karistir(
      tumSecenekler.filter((s) => s !== dogru && !secilen.has(s)),
      rastgele,
    )
    celdiriciler = [...celdiriciler, ...yedek].slice(0, SIK_SAYISI - 1)
  }

  return karistir([dogru, ...celdiriciler], rastgele).map((deger) => ({
    deger,
    metin: ad(deger),
    dogruMu: deger === dogru,
  }))
}

/**
 * Bir turun soru sırası.
 *
 * Havuz baştan bir kez karıştırılıp sırayla tüketiliyor; her soruda rastgele
 * çekilseydi aynı soru tur içinde iki kez çıkabilirdi.
 *
 * `karistirilsin` yalnızca sıra **dışarıda** kurulduğunda kapatılıyor:
 * `ritim.ts` boss sorularını belirli konumlara yerleştiriyor, burada yeniden
 * karıştırmak o yerleşimi bozardı.
 */
export function turHazirla<S, T>(
  havuz: readonly S[],
  dogruyuAl: (soru: S) => T,
  tumSecenekler: readonly T[],
  ad: (deger: T) => string,
  rastgele: () => number = Math.random,
  celdiriciUygunMu?: (aday: T, dogru: T) => boolean,
  karistirilsin = true,
): CoktanSecmeliSoru<S, T>[] {
  const sira = karistirilsin ? karistir(havuz, rastgele) : havuz
  return sira.map((soru) => ({
    soru,
    siklar: siklariKur(dogruyuAl(soru), tumSecenekler, ad, rastgele, celdiriciUygunMu),
  }))
}
