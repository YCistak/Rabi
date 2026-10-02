/**
 * Kenardan geri kaydırmanın hesapları: parmağın hızı, bırakınca geri mi
 * gidileceği, çıkış ve yaylanma hareketinin süresi ile eğrisi.
 *
 * DOM'a dokunmuyor; `lib/geri-kaydirma-denetci.ts` ve birim testleri
 * kullanıyor. Birimler: konum px (görüntü alanı), zaman ms, hız px/ms.
 */

export type Ornek = { t: number; x: number }

/** Hız ölçülürken geriye bakılan pencere. Daha uzunu fırlatmayı yavaşlatır. */
export const HIZ_PENCERESI_MS = 60

/**
 * Parmak bundan uzun süre kıpırdamadıysa hız sıfır sayılıyor: dışarı kadar
 * çekip bekleyen parmak "fırlatmadı", sayfa duraktan kalkmalı.
 */
export const DURGUN_MS = 60

/** Sola doğru bu hızdan hızlı bir fırlatma vazgeçmek demek (px/ms). */
export const GERI_DONUS_HIZI = 0.5

export const CIKIS_EN_KISA_MS = 140
export const CIKIS_EN_UZUN_MS = 320
export const YAYLANMA_EN_KISA_MS = 160
export const YAYLANMA_EN_UZUN_MS = 300

/** Eğrinin ilk kontrol noktasının x'i; başlangıç eğimi y1/x1. */
const X1 = 0.25

/**
 * Son `HIZ_PENCERESI_MS` (yaklaşık dört kare) içindeki örneklerden hız. `simdi` bırakma anı:
 * parmak son örnekten beri durduysa hız 0.
 */
export function hizOlc(ornekler: readonly Ornek[], simdi: number): number {
  if (ornekler.length < 2) return 0
  const son = ornekler[ornekler.length - 1]
  if (simdi - son.t > DURGUN_MS) return 0
  let ilk = son
  for (let i = ornekler.length - 2; i >= 0; i--) {
    if (son.t - ornekler[i].t > HIZ_PENCERESI_MS) break
    ilk = ornekler[i]
  }
  const dt = son.t - ilk.t
  if (dt <= 0) return 0
  return (son.x - ilk.x) / dt
}

/**
 * Yerli taraf "geri" dedikten sonra son söz: parmak sola doğru fırlatıldıysa
 * kullanıcı vazgeçmiş demektir, sayfa yerine dönmeli.
 *
 * Eşik ve "yeterince çekildi mi" kararı yerli tarafta (iOS `yolEsigi` /
 * `hizEsigi`, Android'de sistemin kendi geri hareketi). Burada yalnızca
 * iOS'un `UINavigationController`ının yaptığı vazgeçme kontrolü var; yerli
 * tarafın eski kuralı (yol > 70 → geri) sola fırlatmayı da geri sayıyordu.
 */
export function geriGidilmeli(hiz: number): boolean {
  return hiz > -GERI_DONUS_HIZI
}

export type Hareket = { sure: number; egri: string }

function sinirla(v: number, alt: number, ust: number) {
  return Math.min(ust, Math.max(alt, v))
}

/**
 * `mesafe`yi parmağın `hiz`ıyla başlayıp yavaşlayarak katedecek hareket.
 *
 * Eğri `cubic-bezier(X1, y1, 0.4, 1)`: başlangıç eğimi `y1 / X1`, yani ilk
 * andaki hız `eğim × mesafe / süre`. Süre, ilk hız parmağınkine eşit ve
 * ortalamanın iki katı olacak şekilde seçiliyor (`2 × mesafe / hız`); sınıra
 * takılırsa eğim yeniden hesaplanıp ilk hız yine parmağa eşitleniyor. Eski
 * hâli sabit 200 ms ve sıfır eğimle başlayan bir eğriydi: hızlı fırlatılan
 * sayfa bırakıldığı an neredeyse duruyor, sonra yeniden hızlanıyordu.
 */
function hareket(mesafe: number, hiz: number, enKisa: number, enUzun: number): Hareket {
  if (mesafe < 1) return { sure: 0, egri: 'linear' }
  const v = Math.max(0, hiz)
  const sure = Math.round(v > 0 ? sinirla((2 * mesafe) / v, enKisa, enUzun) : enUzun)
  const egim = sinirla((v * sure) / mesafe, 0, 1 / X1)
  const y1 = +(X1 * egim).toFixed(3)
  return { sure, egri: `cubic-bezier(${X1}, ${y1}, 0.4, 1)` }
}

/** Sayfanın `konum`dan ekranın sağına çıkışı. */
export function cikisHareketi(konum: number, genislik: number, hiz: number, azaltilmis: boolean): Hareket {
  if (azaltilmis) return { sure: 0, egri: 'linear' }
  return hareket(genislik - konum, hiz, CIKIS_EN_KISA_MS, CIKIS_EN_UZUN_MS)
}

/** Vazgeçilince sayfanın `konum`dan yerine dönüşü. `hiz` sağa pozitif. */
export function yaylanmaHareketi(konum: number, hiz: number, azaltilmis: boolean): Hareket {
  if (azaltilmis) return { sure: 0, egri: 'linear' }
  return hareket(konum, -hiz, YAYLANMA_EN_KISA_MS, YAYLANMA_EN_UZUN_MS)
}

/** Eğrinin başlangıçtaki hızı (px/ms) — testler ve ölçüm için. */
export function baslangicHizi(h: Hareket, mesafe: number): number {
  const m = /cubic-bezier\(([\d.]+), ([\d.]+)/.exec(h.egri)
  if (!m || h.sure === 0) return 0
  return ((+m[2] / +m[1]) * mesafe) / h.sure
}
