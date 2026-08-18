/**
 * Geometri oyunlarının şekil modeli.
 *
 * Şekiller SVG olarak elle yazılmıyor, **veri olarak üretiliyor**: soruyu kuran
 * kod açıyı zaten biliyor, aynı açıdan çizimi de kurabiliyor. Böylece etiket ile
 * çizim ayrışmıyor — ekranda "65°" yazan yay gerçekten 65 derece, üçgenin
 * kenarları gerçekten oranında. Şekli elle çizip yanına sayı yazsaydık soru
 * "şekil ölçekli değildir" notuna muhtaç kalırdı.
 *
 * Buradaki her şey saf; ekrana çizen bileşen `components/oyun-sekil.tsx`.
 */

export type Nokta = { x: number; y: number }

/**
 * Açılar matematikteki gibi: derece cinsinden, saat yönünün tersinde, 0° sağa
 * bakar. SVG'de y aşağı doğru büyüdüğü için çevirimde y **çıkarılıyor**; bu tek
 * yerde kalsın diye bütün şekil hesabı buradaki yardımcılardan geçiyor.
 */
export const DERECE = Math.PI / 180

/** `merkez`den `aci` yönünde `uzaklik` kadar gidilen nokta. */
export function yonde(merkez: Nokta, aci: number, uzaklik: number): Nokta {
  return {
    x: merkez.x + uzaklik * Math.cos(aci * DERECE),
    y: merkez.y - uzaklik * Math.sin(aci * DERECE),
  }
}

/** `bas`tan `son`a bakan yönün açısı (0–360 derece). */
export function aciDerece(bas: Nokta, son: Nokta): number {
  const ham = Math.atan2(-(son.y - bas.y), son.x - bas.x) / DERECE
  return (ham + 360) % 360
}

export function ortaNokta(a: Nokta, b: Nokta): Nokta {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export type SekilParcasi =
  /** Düz çizgi. `sonuk` olanlar yardımcı çizgiler (uzatılmış kenar gibi). */
  | { tur: 'cizgi'; bas: Nokta; son: Nokta; sonuk?: boolean }
  /** Açı yayı. `ilk`ten `son`a saat yönünün tersinde çizilir. */
  | { tur: 'yay'; merkez: Nokta; ilk: number; son: number; yaricap: number; vurgu?: boolean }
  /** Dik açı köşesindeki küçük kare. */
  | { tur: 'dikAci'; kose: Nokta; ilk: number; son: number }
  /** Eş kenar çentiği — kenarın ortasına dik atılan kısa çizgi. */
  | { tur: 'tik'; orta: Nokta; aci: number }
  | { tur: 'yazi'; konum: Nokta; metin: string; vurgu?: boolean; sonuk?: boolean }

export type Sekil = {
  genislik: number
  yukseklik: number
  parcalar: SekilParcasi[]
}

/** Şekil tuvalinin ölçüsü. Bileşen `viewBox` ile ölçekliyor, birim önemli değil. */
export const TUVAL_GENISLIK = 280
export const TUVAL_YUKSEKLIK = 175

/** Açı yayının yarıçapı ve etiketin yaydan ne kadar dışarıda durduğu. */
export const YAY_YARICAPI = 26
const ETIKET_UZAKLIGI = 20

/**
 * Bir köşedeki iç açı yayı.
 *
 * İki ışın arasındaki **küçük** açıyı alır: üçgenin köşesinde iç açı her zaman
 * 180°'den küçük olduğu için doğru olan bu. Yönü ayrıca vermek gerekseydi her
 * çağıran yerde köşenin şekle göre neresi olduğu hesaplanırdı.
 */
export function koseYayi(
  kose: Nokta,
  uc1: Nokta,
  uc2: Nokta,
): { ilk: number; son: number } {
  const bir = aciDerece(kose, uc1)
  const iki = aciDerece(kose, uc2)
  const fark = (iki - bir + 360) % 360
  return fark <= 180 ? { ilk: bir, son: bir + fark } : { ilk: iki, son: iki + (360 - fark) }
}

/** Yay + ortasına düşen etiket: açı yazan her yerde ikisi birlikte gerekiyor. */
export function aciEtiketi(
  merkez: Nokta,
  ilk: number,
  son: number,
  metin: string,
  vurgu = false,
  yaricap = YAY_YARICAPI,
): SekilParcasi[] {
  return [
    { tur: 'yay', merkez, ilk, son, yaricap, vurgu },
    {
      tur: 'yazi',
      konum: yonde(merkez, (ilk + son) / 2, yaricap + ETIKET_UZAKLIGI),
      metin,
      vurgu,
    },
  ]
}

/**
 * Kenarın ortasına, kenardan dışarı kaçmış etiket.
 *
 * `disari` kenarın hangi tarafına yazılacağını söylüyor: yazı kenarın üstüne
 * binseydi çizgi rakamın ortasından geçerdi.
 */
export function kenarEtiketi(
  bas: Nokta,
  son: Nokta,
  metin: string,
  disari: number,
  vurgu = false,
  uzaklik = 16,
): SekilParcasi {
  return {
    tur: 'yazi',
    konum: yonde(ortaNokta(bas, son), disari, uzaklik),
    metin,
    vurgu,
  }
}

/** Eş kenarları gösteren çentik. */
export function kenarTiki(bas: Nokta, son: Nokta): SekilParcasi {
  return { tur: 'tik', orta: ortaNokta(bas, son), aci: aciDerece(bas, son) }
}

/**
 * Paralellik çentiği — doğrunun üstüne çizilen küçük ok ucu.
 *
 * Şekilde iki doğrunun paralel olduğu yazmıyor; standart gösterim bu ok. Onsuz
 * soru eksik olurdu: paralel olmayan iki doğruda Z de U de işlemez.
 */
export function paralelIsareti(konum: Nokta): SekilParcasi[] {
  const boy = 6
  return [
    { tur: 'cizgi', bas: yonde(konum, 145, boy), son: konum },
    { tur: 'cizgi', bas: yonde(konum, 215, boy), son: konum },
  ]
}
