/**
 * Fotoğraftaki kâğıdı bulup gerisini atar — saf piksel işi.
 *
 * ## Neden gerekiyor
 *
 * Kâğıt masada çekiliyor ve karede masa da kalıyor. Ahşap masanın damarları
 * uyarlamalı eşikten geçince yüzlerce siyah leke üretiyor: her damar, kendi
 * çevresinden koyu. Bu lekeler yazı değil ama ayırma katmanı bunu bilmiyor;
 * ölçüldü, tek fotoğrafta 970 lekenin 700'ü masadan geliyordu ve **gerçek
 * harfler bunların arasında eleniyordu** — gürültü filtresi karakter boyunu
 * lekelerin ortancasından çıkarıyor, ortanca da damar boyuna kayıyordu.
 *
 * Çözüm eşiklemeden **önce** kâğıdı kırpmak. Kâğıt karedeki en büyük parlak
 * yüzey; masa, gölge ve kenarlar ondan koyu.
 *
 * ## Eşik neden burada genel
 *
 * `lib/goruntu-esikle.ts` yerel eşik kullanıyor çünkü orada aranan şey
 * grafitle kâğıt arasındaki birkaç tonluk fark. Burada aranan şey başka:
 * kâğıtla masa arasındaki büyük fark. Otsu yöntemi tüm parlaklık dağılımına
 * bakıp iki yığını en iyi ayıran tek eşiği buluyor — tam da bu iş için.
 */

import type { Gri } from './goruntu-esikle'

/**
 * Kâğıt aranırken görüntü bu kadar küçültülüyor.
 *
 * Kâğıdın nerede olduğunu bulmak için ayrıntıya gerek yok ve küçük
 * görüntüde harfler eriyip kayboluyor — istediğimiz de bu, yazıyı değil
 * yüzeyi arıyoruz.
 */
const ARAMA_KENARI = 200

/**
 * Bulunan kâğıttan içeri alınan pay.
 *
 * Kâğıdın kenarında hep bir gölge şeridi oluyor ve tam sınırdan kırpmak onu
 * içeride bırakıyor; şerit de eşiklemeden siyah çıkıp uzun bir leke oluyor.
 */
const KENAR_PAYI = 0.01

/** Kâğıt karenin bu kadarından küçükse bulunmuş sayılmıyor. */
const EN_AZ_ALAN = 0.15

export type Alan = { x: number; y: number; en: number; boy: number }

/**
 * İki yığını en iyi ayıran parlaklık eşiği (Otsu).
 *
 * Her eşik için "sınıflar arası varyans" hesaplanıyor ve en büyüğü
 * seçiliyor: iki grubun ortalamaları birbirinden en uzak, kendi içlerinde en
 * derli toplu olduğu yer. Histogram üzerinden tek geçişte yapılıyor.
 */
export function otsuEsigi(gri: Gri): number {
  const sayim = new Float64Array(256)
  for (const t of gri.veri) sayim[t]++

  const toplamAdet = gri.veri.length
  let toplamAgirlik = 0
  for (let t = 0; t < 256; t++) toplamAgirlik += t * sayim[t]

  let arkaAdet = 0
  let arkaAgirlik = 0
  let enIyi = 0
  let enIyiVaryans = -1

  for (let t = 0; t < 256; t++) {
    arkaAdet += sayim[t]
    if (arkaAdet === 0) continue
    const onAdet = toplamAdet - arkaAdet
    if (onAdet === 0) break

    arkaAgirlik += t * sayim[t]
    const fark = arkaAgirlik / arkaAdet - (toplamAgirlik - arkaAgirlik) / onAdet
    const varyans = arkaAdet * onAdet * fark * fark

    if (varyans > enIyiVaryans) {
      enIyiVaryans = varyans
      enIyi = t
    }
  }

  return enIyi
}

/**
 * Karedeki en büyük parlak yüzeyin sınırları; bulunamazsa `null`.
 *
 * `null` dönmesi bir hata değil: kâğıt kareyi tümüyle dolduruyorsa ortada
 * kırpılacak bir şey yok ve çağıran görüntüyü olduğu gibi kullanıyor.
 */
export function kagidiBul(gri: Gri): Alan | null {
  const kucultme = Math.max(1, Math.ceil(Math.max(gri.en, gri.boy) / ARAMA_KENARI))
  const kucuk = kucult(gri, kucultme)
  const esik = otsuEsigi(kucuk)

  // Kâğıt = eşikten parlak. Bayrak dizisi 0 (masa) / 1 (kâğıt).
  const parlak = new Uint8Array(kucuk.veri.length)
  for (let i = 0; i < kucuk.veri.length; i++) parlak[i] = kucuk.veri[i] > esik ? 1 : 0

  const alan = enBuyukBolge(parlak, kucuk.en, kucuk.boy)
  if (alan === null) return null

  const kaplanan = (alan.en * alan.boy) / (kucuk.en * kucuk.boy)
  if (kaplanan < EN_AZ_ALAN) return null

  const pay = Math.round(Math.min(gri.en, gri.boy) * KENAR_PAYI)
  const x = Math.min(gri.en - 1, alan.x * kucultme + pay)
  const y = Math.min(gri.boy - 1, alan.y * kucultme + pay)
  return {
    x,
    y,
    en: Math.max(1, Math.min(gri.en - x, alan.en * kucultme - 2 * pay)),
    boy: Math.max(1, Math.min(gri.boy - y, alan.boy * kucultme - 2 * pay)),
  }
}

/** Verilen alanı kesip yeni bir görüntü olarak döndürür. */
export function kirp(gri: Gri, alan: Alan): Gri {
  const veri = new Uint8ClampedArray(alan.en * alan.boy)
  for (let y = 0; y < alan.boy; y++) {
    const kaynak = (alan.y + y) * gri.en + alan.x
    veri.set(gri.veri.subarray(kaynak, kaynak + alan.en), y * alan.en)
  }
  return { veri, en: alan.en, boy: alan.boy }
}

/** Kâğıdı bulup kırpar; bulunamazsa görüntüyü olduğu gibi verir. */
export function kagidaKirp(gri: Gri): Gri {
  const alan = kagidiBul(gri)
  return alan === null ? gri : kirp(gri, alan)
}

/** Kutu ortalamasıyla küçültme; tek piksellik parıltılar böylece eriyor. */
function kucult(gri: Gri, kat: number): Gri {
  const en = Math.max(1, Math.floor(gri.en / kat))
  const boy = Math.max(1, Math.floor(gri.boy / kat))
  const veri = new Uint8ClampedArray(en * boy)

  for (let y = 0; y < boy; y++) {
    for (let x = 0; x < en; x++) {
      let toplam = 0
      for (let ky = 0; ky < kat; ky++) {
        const satir = (y * kat + ky) * gri.en + x * kat
        for (let kx = 0; kx < kat; kx++) toplam += gri.veri[satir + kx]
      }
      veri[y * en + x] = toplam / (kat * kat)
    }
  }

  return { veri, en, boy }
}

/** Bayrak dizisindeki en büyük 1 bölgesinin sınırlayıcı kutusu. */
function enBuyukBolge(parlak: Uint8Array, en: number, boy: number): Alan | null {
  const gorulen = new Uint8Array(parlak.length)
  const yigin: number[] = []
  let enIyi: Alan | null = null
  let enIyiAdet = 0

  for (let bas = 0; bas < parlak.length; bas++) {
    if (gorulen[bas] === 1 || parlak[bas] === 0) continue

    gorulen[bas] = 1
    yigin.push(bas)
    let solX = en
    let sagX = -1
    let ustY = boy
    let altY = -1
    let adet = 0

    while (yigin.length > 0) {
      const i = yigin.pop() as number
      const x = i % en
      const y = (i - x) / en
      adet++
      if (x < solX) solX = x
      if (x > sagX) sagX = x
      if (y < ustY) ustY = y
      if (y > altY) altY = y

      // Dört komşuluk yetiyor: aranan şey geniş bir yüzey, ince bir çizgi
      // değil; çaprazdan bağlanması gereken bir şey yok.
      if (x > 0) ekle(i - 1)
      if (x < en - 1) ekle(i + 1)
      if (y > 0) ekle(i - en)
      if (y < boy - 1) ekle(i + en)
    }

    if (adet > enIyiAdet) {
      enIyiAdet = adet
      enIyi = { x: solX, y: ustY, en: sagX - solX + 1, boy: altY - ustY + 1 }
    }
  }

  return enIyi

  function ekle(j: number): void {
    if (gorulen[j] === 1 || parlak[j] === 0) return
    gorulen[j] = 1
    yigin.push(j)
  }
}

/**
 * Görüntüyü çeyrek tur saat yönünde döndürür.
 *
 * Kâğıt her zaman düz tutulmuyor: elimizdeki dokuz gerçek fotoğrafın dördünde
 * kâğıt yan duruyor ve yazı dikey akıyor. Satır gruplama yatay yazı
 * varsaydığı için o kâğıtlardan tek satır bile çıkmıyordu.
 */
export function ceyrekDondur(gri: Gri, ceyrek: number): Gri {
  let sonuc = gri
  for (let i = 0; i < (((ceyrek % 4) + 4) % 4); i++) sonuc = birCeyrek(sonuc)
  return sonuc
}

function birCeyrek(gri: Gri): Gri {
  const { veri, en, boy } = gri
  const yeni = new Uint8ClampedArray(veri.length)

  // Saat yönü: kaynağın sol üstü hedefin sağ üstüne gidiyor.
  for (let y = 0; y < boy; y++) {
    for (let x = 0; x < en; x++) yeni[x * boy + (boy - 1 - y)] = veri[y * en + x]
  }

  return { veri: yeni, en: boy, boy: en }
}
