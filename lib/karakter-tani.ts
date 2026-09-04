/**
 * Karakter tanıyıcı — saf hesap, eğitim yok.
 *
 * ## Neden kendi ağımız
 *
 * ML Kit'in Latin modeli el yazısında boş dönüyor ve onu değiştiremiyoruz.
 * Ama deneme kâğıdında okumamız gereken alfabe çok küçük: **0-9 rakamları ve
 * B, D, Y harfleri**. Ders adını uygulamada kullanıcı seçiyor, onu okumaya
 * gerek yok. Bu kadar dar bir tanıyıcı, genel el yazısı OCR'ının yanında
 * küçücük bir problem ve tümüyle cihazda çalışıyor — ağa çıkmıyor, `AGENTS.md`
 * kuralı korunuyor, Data Safety beyanı değişmiyor.
 *
 * ## Ağın biçimi
 *
 * LeNet'in küçültülmüş hâli:
 *
 * ```
 * 1×28×28  girdi
 * → 16 süzgeç 5×5, ReLU       → 16×24×24
 * → 2×2 en büyük havuzlama    → 16×12×12
 * → 32 süzgeç 5×5, ReLU       → 32×8×8
 * → 2×2 en büyük havuzlama    → 32×4×4
 * → tam bağlı 512 → 14
 * ```
 *
 * 20.430 parametre, yani 80 KB. Daha büyüğü APK'yı şişirir ve 14 sınıf için
 * gereksiz; daha küçüğü "5" ile "S"yi ayırt edemiyordu.
 *
 * Ağırlıklar `lib/karakter-agirliklari.ts` içinde; `scripts/taniyici-egit.mjs`
 * üretiyor. Eğitim bu dosyada **yok**: eğitim geliştirme makinesinde bir kez
 * çalışıyor, telefonda yalnızca ileri geçiş var.
 */

import { KARE } from './karakter-ayir'

/**
 * Sınıfların sırası; ağın çıkış katmanı bu sırayla eğitildi.
 *
 * Sonuncusu bir karakter değil, bir **karar**: "bunlardan hiçbiri". Ders
 * adının harfleri de tanıyıcıya geliyor ve o sınıf olmasaydı ağ onlara zorla
 * bir rakam demek zorunda kalırdı — ölçüldü, "Türk Dili" satırının başı
 * "7661B" diye okunuyor ve ortaya olmayan sayılar çıkıyordu.
 */
export const SINIFLAR = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'B', 'D', 'Y',
  'diğer',
] as const

/** Metne yazılmayan sınıf. */
export const YAZI_DISI = 'diğer'

export type Sinif = (typeof SINIFLAR)[number]

export type Tahmin = {
  sinif: Sinif
  /** 0-1 arası olasılık; şüphedeyken karakteri atmak için gerekiyor. */
  guven: number
  /**
   * Bütün sınıfların olasılığı, `SINIFLAR` sırasıyla.
   *
   * En büyüğü almak yetmiyor: bir kümenin sonunda **harf olmak zorunda** olan
   * bir kutu için "en olası harf hangisi" sorusunun cevabı gerekiyor ve o
   * bilgi tek bir sınıfa indirgenirse kayboluyor (`lib/kagit-oku.ts`).
   */
  olasilik: Float32Array
}

/** Ağın katman ölçüleri; eğitim betiği aynı sayıları kullanıyor. */
export const OLCULER = {
  konv1Suzgec: 16,
  konv2Suzgec: 32,
  cekirdek: 5,
} as const

/** Ağın taşıdığı toplam ağırlık sayısı; okuma sırası `agirliklariCoz` içinde. */
export const PARAMETRE_SAYISI =
  OLCULER.konv1Suzgec * OLCULER.cekirdek * OLCULER.cekirdek +
  OLCULER.konv1Suzgec +
  OLCULER.konv2Suzgec * OLCULER.konv1Suzgec * OLCULER.cekirdek * OLCULER.cekirdek +
  OLCULER.konv2Suzgec +
  SINIFLAR.length * OLCULER.konv2Suzgec * 16 +
  SINIFLAR.length

export type Agirliklar = {
  k1: Float32Array
  b1: Float32Array
  k2: Float32Array
  b2: Float32Array
  w: Float32Array
  b: Float32Array
}

/**
 * Base64'ten ağırlıkları açar.
 *
 * Ağırlıklar metin olarak gömülü çünkü Capacitor'ın statik dışa aktarımında
 * ikili dosya taşımak ek bir yol ve ek bir hata kaynağı; 80 KB'lık bir dizgi
 * paketin içinde sorunsuz gidiyor.
 */
export function agirliklariCoz(base64: string): Agirliklar {
  const ham = tabandanCoz(base64)
  const sayilar = new Float32Array(ham.buffer, ham.byteOffset, ham.byteLength / 4)

  /*
    Sayı uymuyorsa hata veriliyor, kırpılmış katmanlarla devam edilmiyor.

    Bu ancak bir derleme hatasıyla olur — ağın ölçüsü değişip ağırlıklar
    yenilenmezse. Ölçüldü ve sessizliği tehlikeli: katmanlar kayınca ağ
    çökmüyor, **kendinden emin saçmalıyor**. Yanlış dolmuş bir kutu boş
    kutudan kötü; `kagidiOku` bunu yakalayıp "okuyamadım" diyor.
  */
  if (sayilar.length !== PARAMETRE_SAYISI) {
    throw new Error(
      `Tanıyıcı ağırlıkları ağa uymuyor: ${sayilar.length} sayı var, ${PARAMETRE_SAYISI} bekleniyor.`,
    )
  }

  const { konv1Suzgec: s1, konv2Suzgec: s2, cekirdek: c } = OLCULER
  let yer = 0
  const al = (adet: number): Float32Array => {
    const dilim = sayilar.subarray(yer, yer + adet)
    yer += adet
    return dilim
  }

  return {
    k1: al(s1 * c * c),
    b1: al(s1),
    k2: al(s2 * s1 * c * c),
    b2: al(s2),
    w: al(SINIFLAR.length * s2 * 4 * 4),
    b: al(SINIFLAR.length),
  }
}

function tabandanCoz(base64: string): Uint8Array {
  // Node'da `atob` var, WebView'de de var; ikisinde de aynı çalışıyor.
  const metin = atob(base64)
  const bayt = new Uint8Array(metin.length)
  for (let i = 0; i < metin.length; i++) bayt[i] = metin.charCodeAt(i)
  return bayt
}

/**
 * Tek karakteri tanır.
 *
 * `nokta` 28×28, 0 (zemin) ile 1 (mürekkep) arası — `kareyeOturt` çıktısı.
 */
export function tani(nokta: Float32Array, a: Agirliklar): Tahmin {
  const c1 = evrisim(nokta, 1, KARE, a.k1, a.b1, OLCULER.konv1Suzgec)
  const h1 = havuzla(c1, OLCULER.konv1Suzgec, 24)
  const c2 = evrisim(h1, OLCULER.konv1Suzgec, 12, a.k2, a.b2, OLCULER.konv2Suzgec)
  const h2 = havuzla(c2, OLCULER.konv2Suzgec, 8)

  const puan = new Float32Array(SINIFLAR.length)
  for (let s = 0; s < SINIFLAR.length; s++) {
    let toplam = a.b[s]
    for (let i = 0; i < h2.length; i++) toplam += a.w[s * h2.length + i] * h2[i]
    puan[s] = toplam
  }

  const olasilik = yumusakEnBuyuk(puan)
  let enIyi = 0
  for (let s = 1; s < olasilik.length; s++) if (olasilik[s] > olasilik[enIyi]) enIyi = s
  return { sinif: SINIFLAR[enIyi], guven: olasilik[enIyi], olasilik }
}

/** Evrişim + ReLU. Dolgu yok, adım 1: çıkış kenarı girişten 4 eksik. */
function evrisim(
  girdi: Float32Array,
  kanal: number,
  kenar: number,
  cekirdekler: Float32Array,
  yanlilik: Float32Array,
  suzgec: number,
): Float32Array {
  const c = OLCULER.cekirdek
  const cikisKenar = kenar - c + 1
  const cikti = new Float32Array(suzgec * cikisKenar * cikisKenar)

  for (let s = 0; s < suzgec; s++) {
    for (let y = 0; y < cikisKenar; y++) {
      for (let x = 0; x < cikisKenar; x++) {
        let toplam = yanlilik[s]
        for (let k = 0; k < kanal; k++) {
          const cekirdekYeri = (s * kanal + k) * c * c
          const kanalYeri = k * kenar * kenar
          for (let cy = 0; cy < c; cy++) {
            for (let cx = 0; cx < c; cx++) {
              toplam += cekirdekler[cekirdekYeri + cy * c + cx] * girdi[kanalYeri + (y + cy) * kenar + (x + cx)]
            }
          }
        }
        // ReLU yerinde: eksiler sıfırlanıyor.
        cikti[s * cikisKenar * cikisKenar + y * cikisKenar + x] = toplam > 0 ? toplam : 0
      }
    }
  }

  return cikti
}

/** 2×2 en büyük havuzlama; kenar çift olmak zorunda (24 ve 8). */
function havuzla(girdi: Float32Array, kanal: number, kenar: number): Float32Array {
  const yeni = kenar >> 1
  const cikti = new Float32Array(kanal * yeni * yeni)

  for (let k = 0; k < kanal; k++) {
    for (let y = 0; y < yeni; y++) {
      for (let x = 0; x < yeni; x++) {
        const yer = k * kenar * kenar + y * 2 * kenar + x * 2
        cikti[k * yeni * yeni + y * yeni + x] = Math.max(
          girdi[yer],
          girdi[yer + 1],
          girdi[yer + kenar],
          girdi[yer + kenar + 1],
        )
      }
    }
  }

  return cikti
}

/** Puanları olasılığa çevirir; en büyük çıkarılıyor ki üstel taşmasın. */
function yumusakEnBuyuk(puan: Float32Array): Float32Array {
  let enBuyuk = puan[0]
  for (const p of puan) if (p > enBuyuk) enBuyuk = p

  const cikti = new Float32Array(puan.length)
  let toplam = 0
  for (let i = 0; i < puan.length; i++) {
    cikti[i] = Math.exp(puan[i] - enBuyuk)
    toplam += cikti[i]
  }
  for (let i = 0; i < cikti.length; i++) cikti[i] /= toplam

  return cikti
}
