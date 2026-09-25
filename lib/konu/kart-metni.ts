/**
 * Bilgi kartı metninin küçük biçim dili.
 *
 * Kart metni bir süre düz bir paragraftı ve dört-beş bilgi aynı satırda,
 * noktalarla ayrılarak akıyordu ("sin: 30° → 1/2, 45° → √2/2 … cos tersi
 * sırayla. tan: …"). Telefonda o paragraf okunmuyor, taranmıyordu; kullanıcı
 * "karmakarışık" dedi. Kart artık satırlara ve maddelere bölünüyor.
 *
 * Dil kasten üç kuraldan ibaret — Markdown değil, çünkü başlık, bağlantı,
 * iç içe liste gibi şeylerin kartta karşılığı yok ve desteklenen her ek
 * biçim, içerik yazarken yanlış kullanılacak bir kapı:
 *
 * - Her satır (`\n`) ayrı bir blok. Madde olmayan satır bir paragraf.
 * - `- ` ile başlayan satır bir madde; art arda gelen maddeler tek liste.
 * - `**…**` vurgu: maddenin başındaki ad ("**Ekvator:** 0° enlemi") ya da
 *   cümlenin anahtar kavramı. Tek satırın içinde açılıp kapanmalı.
 *
 * Saf ve React'e bağlı değil: çizen `components/konu/kart-metni.tsx`,
 * düzeni denetleyen `icerik.test.ts`. İkisi aynı ayrıştırıcıyı kullanıyor —
 * testin gördüğü yapı ekranın çizdiği yapıyla aynı olmalı.
 */

/** Satırın içindeki parça: düz yazı ya da vurgulu yazı. */
export type MetinParcasi = { yazi: string; vurgu: boolean }

export type MetinBlogu =
  | { tur: 'paragraf'; parcalar: MetinParcasi[] }
  | { tur: 'liste'; maddeler: MetinParcasi[][] }

const MADDE = '- '

/** `**…**` işaretlerini ayırır. Kapanmayan işaret düz yazı sayılır. */
export function satiriParcala(satir: string): MetinParcasi[] {
  const parcalar: MetinParcasi[] = []
  const kalip = /\*\*(.+?)\*\*/g
  let son = 0
  for (const eslesme of satir.matchAll(kalip)) {
    const bas = eslesme.index ?? 0
    if (bas > son) parcalar.push({ yazi: satir.slice(son, bas), vurgu: false })
    parcalar.push({ yazi: eslesme[1], vurgu: true })
    son = bas + eslesme[0].length
  }
  if (son < satir.length) parcalar.push({ yazi: satir.slice(son), vurgu: false })
  return parcalar
}

export function metniAyristir(metin: string): MetinBlogu[] {
  const bloklar: MetinBlogu[] = []
  for (const hamSatir of metin.split('\n')) {
    const satir = hamSatir.trim()
    // Boş satır yalnızca ayraç; kart zaten her bloğun arasına pay koyuyor.
    if (!satir) continue
    if (satir.startsWith(MADDE)) {
      const madde = satiriParcala(satir.slice(MADDE.length).trim())
      const onceki = bloklar[bloklar.length - 1]
      if (onceki?.tur === 'liste') onceki.maddeler.push(madde)
      else bloklar.push({ tur: 'liste', maddeler: [madde] })
    } else {
      bloklar.push({ tur: 'paragraf', parcalar: satiriParcala(satir) })
    }
  }
  return bloklar
}

/**
 * Ekranda görünen yazı — işaretler (`- `, `**`, satır sonu) düşülmüş.
 *
 * Kart uzunluğu sınırı buna bakıyor: madde imi okunacak bir karakter değil
 * ve metni maddelere bölmek, aynı bilgiyi sınıra daha yakın yazmak olmamalı.
 */
export function gorunenMetin(metin: string): string {
  return metniAyristir(metin)
    .flatMap((blok) => (blok.tur === 'paragraf' ? [blok.parcalar] : blok.maddeler))
    .map((parcalar) => parcalar.map((p) => p.yazi).join(''))
    .join(' ')
}

/** Her satırın ekranda görünen hâli (madde imi ve vurgu işareti düşülmüş). */
export function gorunenSatirlar(metin: string): string[] {
  return metniAyristir(metin)
    .flatMap((blok) => (blok.tur === 'paragraf' ? [blok.parcalar] : blok.maddeler))
    .map((parcalar) => parcalar.map((p) => p.yazi).join(''))
}
