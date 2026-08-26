/**
 * Kural Tuzağı — ekrandaki eşitlik doğru mu, yanlış mı?
 *
 * Cevap kaydırarak veriliyor: sağa atmak "doğru", sola atmak "yanlış". Şıkka
 * dokunmakla aynı bilgiyi taşıyor ama ritmi bambaşka — karar tek hareket, ve
 * hareket yarım bırakılabiliyor. Bu oyunun ölçtüğü şey zaten hız: kuralı
 * bilen öğrenci bir saniyede karar veriyor, bilmeyen sağlamasını yapmaya
 * çalışıyor ve süre yetmiyor.
 *
 * Sorular havuzdan hazır gelmiyor, **çiftten üretiliyor**: her kuralın doğru ve
 * yanlış hâli havuzda yan yana duruyor, hangisinin gösterileceği her soruda
 * yeniden seçiliyor. İki sonucu var: (1) aynı kural iki turda iki farklı soru
 * olabiliyor, ezberlenecek bir liste yok; (2) cevap dağılımı yarı yarıya
 * kuruluyor — Bölünebilme oyunundaki gibi, "hep aynı cevabı ver" stratejisi
 * çalışmıyor.
 *
 * Saf: React'e bağlı hiçbir şey yok, hepsi test edilebilir.
 */

import type { TuzakKurali } from './tuzak-havuzu'
import { TUZAK_HAVUZU } from './tuzak-havuzu'
import type { Zorluk } from './ritim'
import { karistir } from './tur'

export type TuzakSorusu = {
  kural: TuzakKurali
  /**
   * Ekranda kuralın doğru hâli mi duruyor.
   *
   * Doğru cevap doğrudan bu: `true` ise oyuncunun "Doğru" demesi gerekiyor.
   * Ayrı bir `cevap` alanı tutulmadı — ikisi aynı bilgi ve çelişebilirlerdi.
   */
  dogruHali: boolean
}

/** Ekranda görünen eşitlik. */
export function ifade(soru: TuzakSorusu): string {
  return soru.dogruHali ? soru.kural.dogru : soru.kural.yanlis
}

/** Oyuncunun kaydırmasıyla verilen cevap doğru mu. */
export function cevapDogruMu(soru: TuzakSorusu, dogruDedi: boolean): boolean {
  return dogruDedi === soru.dogruHali
}

/**
 * Yanlış cevaptan sonra gösterilen düzeltme.
 *
 * İki durum ayrı: yanlış hâle "doğru" diyen öğrenciye kuralın doğrusu
 * gösteriliyor, doğru hâle "yanlış" diyene ise gösterilecek bir düzeltme yok —
 * ekrandaki zaten doğruydu.
 */
export function duzeltme(soru: TuzakSorusu): string | null {
  return soru.dogruHali ? null : soru.kural.dogru
}

/**
 * Soruyu kimlikleyen metin.
 *
 * Kuralın doğru hâlinden üretiliyor, ekrandakinden değil: aynı kuralın iki
 * yüzü aynı bilgi ve bankada tek kayıt olmaları gerekiyor. Ayrı kayıt
 * açsalardı öğrenci aynı kuralı iki kez öğrenmek zorunda kalırdı.
 */
export function soruKimligi(soru: TuzakSorusu): string {
  return soru.kural.dogru
}

/**
 * Kuraldan soru kurar: yazı tura ile doğru ya da yanlış hâl.
 *
 * `rastgele` dışarıdan geliyor ki testler sabit bir üreteçle çalışabilsin.
 */
export function soruKur(kural: TuzakKurali, rastgele: () => number = Math.random): TuzakSorusu {
  return { kural, dogruHali: rastgele() < 0.5 }
}

/**
 * Turun soruları.
 *
 * Havuz zorluğa göre süzülüp karıştırılıyor, sonra sırayla tüketiliyor;
 * `adet` havuzdan büyükse başa dönülüyor. Aynı kural bir turda iki kez
 * çıkabiliyor ama ancak havuzun tamamı bittikten sonra — ve ikinci gelişinde
 * öbür yüzüyle gelmesi muhtemel.
 *
 * Seçilen zorlukta hiç kural yoksa havuzun tamamına düşülüyor (`ritim.ts`'teki
 * kuralın aynısı).
 */
export function tuzakTuruHazirla(
  adet: number,
  zorluk: Zorluk,
  havuz: readonly TuzakKurali[] = TUZAK_HAVUZU,
  rastgele: () => number = Math.random,
): TuzakSorusu[] {
  const suzulmus = havuz.filter((k) => k.zorluk === zorluk)
  const kaynak = karistir(suzulmus.length > 0 ? suzulmus : havuz, rastgele)
  if (kaynak.length === 0) return []

  const sorular: TuzakSorusu[] = []
  for (let i = 0; i < adet; i++) {
    sorular.push(soruKur(kaynak[i % kaynak.length], rastgele))
  }
  return sorular
}

/** Banka kayıtlarındaki kurallardan tur soruları. */
export function bankadanSorular(
  kurallar: readonly TuzakKurali[],
  rastgele: () => number = Math.random,
): TuzakSorusu[] {
  return karistir(kurallar, rastgele).map((kural) => soruKur(kural, rastgele))
}
