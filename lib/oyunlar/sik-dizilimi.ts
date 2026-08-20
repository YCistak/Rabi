import { karistir } from './tur'

/**
 * Şıkların ekrandaki yeri — aynı soru tekrar geldiğinde aynı yere düşmesin.
 *
 * Şıklar her kuruluşta zaten karıştırılıyor ama karıştırma hafızasız: iki
 * şıklı bir soruda aynı dizilimin yeniden çıkma ihtimali yarı yarıya, dört
 * şıkta da yirmi dörtte bir. Sorular ise tekrar geliyor — tur sınırsız ve
 * havuz bitince başa dönüyor, Oyun Bankası zaten aynı soruyu üç kez doğru
 * bilinene kadar soruyor, Periyodik Tablo'nun zor seviyesinde havuz yedi
 * element. Tekrar eden soru şıkları da aynı yerdeyse artık soru değil:
 * oyuncu metni okumadan geçen sefer dokunduğu yeri hatırlıyor.
 *
 * Burada tutulan tek şey her şık kümesinin **en son hangi sırayla**
 * gösterildiği; yeni dizilim ondan farklı olmak zorunda.
 *
 * Hafıza küme bazında, soru bazında değil. Ses Olayları'nda onlarca sorunun
 * şıkları aynı beş olaydan geliyor; soru bazında tutulsaydı arka arkaya gelen
 * iki farklı soru yine aynı dizilimi gösterirdi. Küme bazında tutmak daha
 * sıkı bir söz veriyor: aynı şıklar üst üste hiç aynı sırayla gelmiyor.
 *
 * Bu bir bilgi sızıntısı değil: değişen yalnızca dizilim, hangisinin doğru
 * olduğu değil. Önceki dizilimi hatırlayan biri zaten cevabı da hatırlıyor.
 */

/** Küme kimliği → o kümenin en son gösterilen dizilimi. */
export type DizilimHafizasi = Map<string, string>

export function hafizaKur(): DizilimHafizasi {
  return new Map()
}

/**
 * Hafızanın üst sınırı.
 *
 * Kayıtlar uygulama açık kaldığı sürece birikiyor. Beş yüz küme bütün
 * oyunların bir oturumda göstereceğinden fazlası; dolunca en eski kayıt
 * siliniyor ve unutulan kümenin bedeli en fazla bir tekrar oluyor.
 */
const HAFIZA_SINIRI = 500

/**
 * Uygulama boyunca tek hafıza.
 *
 * Modül düzeyinde duruyor çünkü tekrarı yakalamak için turdan ve ekrandan
 * uzun ömürlü olması gerekiyor — bileşen state'i her turda sıfırlanırdı.
 * Saflık `hafiza` parametresiyle korunuyor: testler kendi haritalarını verip
 * ortak durumdan bağımsız çalışıyor.
 */
const HAFIZA = hafizaKur()

/** Şık metinlerinde geçmeyecek ayraç — kimlikleri birleştirirken. */
const AYRAC = ''

/** Dizilimin kimliği; sıraya duyarlı. */
function imza<T>(siklar: readonly T[], kimlik: (sik: T) => string): string {
  return siklar.map(kimlik).join(AYRAC)
}

/**
 * Şıkları karıştırır, ama aynı kümeyi bir önceki gösterimindeki sırayla
 * bırakmaz.
 */
export function siklariDiz<T>(
  siklar: readonly T[],
  kimlik: (sik: T) => string,
  rastgele: () => number = Math.random,
  hafiza: DizilimHafizasi = HAFIZA,
): T[] {
  if (siklar.length < 2) return [...siklar]

  // Anahtar sıraya duyarsız: aynı küme hangi sırayla gelirse gelsin aynı
  // kaydı bulmalı.
  const anahtar = siklar.map(kimlik).sort().join(AYRAC)
  const onceki = hafiza.get(anahtar)

  let dizilim = karistir(siklar, rastgele)
  // Karıştırma yine aynı sırayı verdiyse dizi elle kaydırılıyor: kimlikleri
  // farklı bir diziyi bir adım kaydırmak her zaman başka bir sıra veriyor.
  // Yeniden karıştırmak yerine kaydırma, çünkü "farklı olacak" bir ihtimal
  // değil, verilen söz.
  if (imza(dizilim, kimlik) === onceki) {
    dizilim = [dizilim[dizilim.length - 1], ...dizilim.slice(0, -1)]
  }

  if (!hafiza.has(anahtar) && hafiza.size >= HAFIZA_SINIRI) {
    // Map ekleme sırasını koruyor; ilk anahtar en eskisi.
    const enEski = hafiza.keys().next().value
    if (enEski !== undefined) hafiza.delete(enEski)
  }
  hafiza.set(anahtar, imza(dizilim, kimlik))

  return dizilim
}
