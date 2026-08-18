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
): Sik<T>[] {
  const celdiriciler = karistir(
    tumSecenekler.filter((s) => s !== dogru),
    rastgele,
  ).slice(0, SIK_SAYISI - 1)

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
 */
export function turHazirla<S, T>(
  havuz: readonly S[],
  dogruyuAl: (soru: S) => T,
  tumSecenekler: readonly T[],
  ad: (deger: T) => string,
  rastgele: () => number = Math.random,
): CoktanSecmeliSoru<S, T>[] {
  return karistir(havuz, rastgele).map((soru) => ({
    soru,
    siklar: siklariKur(dogruyuAl(soru), tumSecenekler, ad, rastgele),
  }))
}
