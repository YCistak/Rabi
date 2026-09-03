/**
 * Fotoğrafı metin tanımaya hazırlar — saf piksel işi.
 *
 * ## Neden gerekiyor
 *
 * ML Kit'in Latin modeli **basılı metin** için eğitildi: koyu harf, açık zemin,
 * keskin kenar. Kurşun kalemle yazılmış bir kâğıt bunların hiçbirini vermiyor —
 * grafit gri, kâğıt gri, aradaki fark yer yer birkaç ton. Ham fotoğrafı
 * modele vermek, ona okuyamayacağı bir görüntü vermek oluyordu; aynı yazı
 * tükenmezle yazılınca okunuyor, kurşun kalemle yazılınca okunmuyordu.
 *
 * Çözüm modeli değiştirmek değil, **girdiyi** düzeltmek: görüntü siyah-beyaza
 * indiriliyor ve kalem türü aradan kalkıyor. Soluk grafit de, mavi tükenmez de
 * eşikten sonra aynı şey — siyah piksel.
 *
 * ## Eşik neden yerel
 *
 * Tek bir eşik ("128'den koyusu siyah") işe yaramıyor: telefonla çekilen
 * kâğıtta bir köşe gölgede, öteki köşe parlak. Gölgedeki beyaz kâğıt, aydınlık
 * yerdeki grafitten koyu çıkıyor ve sabit eşik yarım sayfayı siyaha boyuyor.
 *
 * Bradley–Roth yöntemi her pikseli **kendi çevresinin ortalamasıyla**
 * karşılaştırıyor: çevresinden belirgin biçimde koyuysa yazı, değilse zemin.
 * Böylece aydınlatma farkı hesaptan düşüyor. Ortalama, integral görüntüyle
 * sabit zamanda okunuyor — pencere ne kadar büyük olursa olsun piksel başına
 * dört toplama.
 *
 * Saf tutuldu: `ImageData` değil düz dizi alıyor, tarayıcı API'si çağırmıyor.
 * Tuval ve dosya işleri `lib/deneme-ocr.ts` tarafında.
 */

/** Tek kanallı gri görüntü. */
export type Gri = {
  veri: Uint8ClampedArray
  en: number
  boy: number
}

/**
 * RGBA'dan gri tona.
 *
 * Katsayılar gözün duyarlılığına göre (Rec. 601): yeşil en ağır, mavi en
 * hafif. Üç kanalın düz ortalaması mavi tükenmezi olduğundan açık gösteriyor
 * ve zayıf yazıyı eşiğin yanlış tarafına düşürüyordu.
 */
export function grilestir(rgba: Uint8ClampedArray, en: number, boy: number): Gri {
  const veri = new Uint8ClampedArray(en * boy)
  for (let i = 0; i < veri.length; i++) {
    const k = i * 4
    veri[i] = (rgba[k] * 299 + rgba[k + 1] * 587 + rgba[k + 2] * 114) / 1000
  }
  return { veri, en, boy }
}

/**
 * Pencere kenarı, görüntü genişliğinin bu kadarı.
 *
 * Pencere bir harften belirgin biçimde büyük, bir gölge lekesinden küçük
 * olmalı. Küçük pencere kalın harflerin **içini** zemin sanıp harfleri
 * içi boş çıkarıyor; büyük pencere gölgeyi hesaba katamıyor ve sabit eşiğe
 * dönüyor.
 */
const PENCERE_ORANI = 8

/** En küçük pencere; dar fotoğrafta oran tek başına anlamsız kalıyor. */
const EN_KUCUK_PENCERE = 16

/**
 * Piksel, çevre ortalamasının yüzde kaçının altındaysa yazı sayılıyor.
 *
 * Sıfır olsaydı düz beyaz zemindeki gürültü de yazı olurdu: ortalamanın azıcık
 * altında kalan her piksel siyaha döner, sayfa kar taneleriyle dolardı. Yüksek
 * olsaydı soluk grafit elenirdi — çözmeye çalıştığımız şeyin ta kendisi.
 *
 * Belgeler için yaygın değer 15; burası 8. Sebebi ölçüldü: 200 tonluk kâğıda
 * 170 tonluk grafitle yazılmış bir satırda çevre ortalaması 193 çıkıyor ve 15
 * payla eşik 164'e iniyor — yazı **kılpayı** eleniyordu. Kurşun kalemin
 * kâğıttan farkı çoğu zaman bu kadar az.
 */
const ESIK_PAYI = 8

/**
 * Yerel ortalamaya göre siyah-beyaz.
 *
 * Çıktı yine gri kanal ama yalnızca 0 ve 255 taşıyor.
 */
export function uyarlamaliEsik(gri: Gri): Gri {
  const { veri, en, boy } = gri
  const cikti = new Uint8ClampedArray(en * boy)

  const toplam = integral(gri)
  const pencere = Math.max(EN_KUCUK_PENCERE, Math.round(en / PENCERE_ORANI))
  const yari = pencere >> 1

  for (let y = 0; y < boy; y++) {
    const y1 = Math.max(0, y - yari)
    const y2 = Math.min(boy - 1, y + yari)

    for (let x = 0; x < en; x++) {
      const x1 = Math.max(0, x - yari)
      const x2 = Math.min(en - 1, x + yari)

      const adet = (x2 - x1 + 1) * (y2 - y1 + 1)
      const alan = alanToplami(toplam, en, x1, y1, x2, y2)

      // Bölme yerine çarpma: piksel başına bir bölme, büyük fotoğrafta
      // ölçülebilir bir fark yapıyor.
      const yazi = veri[y * en + x] * adet * 100 <= alan * (100 - ESIK_PAYI)
      cikti[y * en + x] = yazi ? 0 : 255
    }
  }

  return { veri: cikti, en, boy }
}

/** Gri kanalı tuvale geri yazılabilir RGBA'ya çevirir. */
export function rgbaYaz(gri: Gri, hedef: Uint8ClampedArray): void {
  for (let i = 0; i < gri.veri.length; i++) {
    const k = i * 4
    hedef[k] = gri.veri[i]
    hedef[k + 1] = gri.veri[i]
    hedef[k + 2] = gri.veri[i]
    hedef[k + 3] = 255
  }
}

/**
 * İşlenecek görüntünün uzun kenarı.
 *
 * Eşikleme piksel başına sabit iş yapıyor ama 12 megapikselde bu 12 milyon
 * kez demek ve telefonda saniyeler sürüyor. 2000 piksel el yazısını okunur
 * tutuyor; tanıma zaten bundan büyüğünden ek bilgi çıkarmıyor.
 *
 * **Fotoğrafın kendisi küçültülmüyor** — yalnızca tanımaya giden kopya.
 */
export const ISLEME_KENARI = 2000

/** Uzun kenarı verilen sınıra indiren ölçek; büyütme yok. */
export function olcek(en: number, boy: number, kenar: number = ISLEME_KENARI): number {
  return Math.min(1, kenar / Math.max(en, boy))
}

/**
 * Yerel kontrast düzeltme — eşiklemenin yumuşak karşılığı.
 *
 * Eşikleme her fotoğrafta doğru seçim değil: ince uçlu kalemle yazılmış
 * satırlarda harfin gövdesi zaten birkaç piksel ve sert eşik onu yer yer
 * koparıyor, "5"i "S" yapıyor. Bu işlev aynı yerel ortalamayı kullanıyor ama
 * ikiye ayırmak yerine **geriyor**: piksel çevresinden ne kadar koyuysa o
 * kadar siyaha, ne kadar açıksa o kadar beyaza gidiyor. Gölge yine hesaptan
 * düşüyor, harflerin gri tonları duruyor.
 *
 * Hangisinin iyi olduğu fotoğrafa bağlı; `lib/deneme-ocr.ts` ikisini de
 * tanıyıp iyisini alıyor.
 */
export function yerelKontrast(gri: Gri): Gri {
  const { veri, en, boy } = gri
  const cikti = new Uint8ClampedArray(en * boy)
  const ortalamalar = yerelOrtalama(gri)

  for (let i = 0; i < veri.length; i++) {
    // Ortalamadan sapma GERME_GUCU katıyla büyütülüp orta griye oturtuluyor.
    const sapma = veri[i] - ortalamalar[i]
    cikti[i] = 128 + sapma * GERME_GUCU
  }

  return { veri: cikti, en, boy }
}

/**
 * Sapmanın kaç katı alınacağı.
 *
 * 1 olsaydı görüntü yalnızca gölgesizleşirdi, kontrast artmazdı. Çok yüksek
 * olsaydı sert eşikten farkı kalmazdı ve onun kusurlarını devralırdı.
 */
const GERME_GUCU = 3

/** Her piksel için çevre ortalaması; iki işlev de aynı pencereyi kullanıyor. */
function yerelOrtalama(gri: Gri): Float64Array {
  const { veri, en, boy } = gri
  const toplam = integral(gri)
  const cikti = new Float64Array(en * boy)

  const pencere = Math.max(EN_KUCUK_PENCERE, Math.round(en / PENCERE_ORANI))
  const yari = pencere >> 1

  for (let y = 0; y < boy; y++) {
    const y1 = Math.max(0, y - yari)
    const y2 = Math.min(boy - 1, y + yari)

    for (let x = 0; x < en; x++) {
      const x1 = Math.max(0, x - yari)
      const x2 = Math.min(en - 1, x + yari)
      const adet = (x2 - x1 + 1) * (y2 - y1 + 1)
      cikti[y * en + x] = alanToplami(toplam, en, x1, y1, x2, y2) / adet
    }
  }

  return cikti
}

/**
 * Integral görüntü: bir satır ve bir sütun fazla, böylece kenarlarda eksi
 * indis denetimi gerekmiyor. Float64 çünkü büyük fotoğrafta toplam 32 bit tam
 * sayıyı aşıyor (255 × 4000 × 3000 ≈ 3,1 milyar).
 */
function integral(gri: Gri): Float64Array {
  const { veri, en, boy } = gri
  const toplam = new Float64Array((en + 1) * (boy + 1))

  for (let y = 0; y < boy; y++) {
    let satirToplami = 0
    for (let x = 0; x < en; x++) {
      satirToplami += veri[y * en + x]
      toplam[(y + 1) * (en + 1) + (x + 1)] = toplam[y * (en + 1) + (x + 1)] + satirToplami
    }
  }

  return toplam
}

/** Dikdörtgenin toplamı — integral görüntüde dört okuma. */
function alanToplami(
  toplam: Float64Array,
  en: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return (
    toplam[(y2 + 1) * (en + 1) + (x2 + 1)] -
    toplam[y1 * (en + 1) + (x2 + 1)] -
    toplam[(y2 + 1) * (en + 1) + x1] +
    toplam[y1 * (en + 1) + x1]
  )
}
