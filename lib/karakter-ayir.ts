/**
 * Eşiklenmiş kâğıttan tek tek karakterleri çıkarır — saf piksel işi.
 *
 * ## Neden kendi tanıyıcımız
 *
 * ML Kit'in Latin modeli basılı metin için eğitildi ve el yazısında —
 * tükenmezle bile — boş dönüyor. Girdiyi parlatmak (bkz.
 * `lib/goruntu-esikle.ts`) modelin göremediğini gösteremedi.
 *
 * Ama okumamız gereken şey **genel el yazısı değil**: deneme kâğıdında
 * rakamlar (0-9) ile D, Y, B harfleri var, hepsi bu — on üç sınıf. On üç
 * sınıflık bir tanıyıcı, genel OCR'ın yanında çok küçük bir problem ve
 * tümüyle cihazda çalışabiliyor.
 *
 * ## Bu dosyanın işi
 *
 * Tanıma iki adım: önce **nereye bakacağını bilmek**, sonra **ne olduğunu
 * söylemek**. Burası birincisi. Siyah-beyaz görüntüdeki bitişik siyah
 * lekeler bulunuyor, gürültü eleniyor, lekeler satırlara diziliyor ve her
 * biri modelin beklediği 28×28 kareye oturtuluyor. Sınıflandırma
 * `lib/rakam-tani.ts` tarafında.
 *
 * Saf tutuldu: tarayıcı API'si yok, düz dizi alıp düz dizi veriyor. Gerçek
 * fotoğraflarla test ediliyor.
 */

import type { Gri } from './goruntu-esikle'

/** Bir lekenin sınırlayıcı kutusu. */
export type Kutu = {
  x: number
  y: number
  en: number
  boy: number
  /** Kutunun içindeki siyah piksel sayısı; doluluk gürültü elemede gerekiyor. */
  piksel: number
}

/** Modele verilmeye hazır tek karakter. */
export type Karakter = {
  kutu: Kutu
  /** 28×28, 0 (zemin) ile 1 (mürekkep) arası. Satır satır dizili. */
  nokta: Float32Array
}

/** Aynı yazı satırındaki karakterler, soldan sağa. */
export type Satir = {
  karakterler: Karakter[]
  ustY: number
  altY: number
}

/** Modelin beklediği kare kenarı. */
export const KARE = 28

/**
 * Karakterin kare içinde kapladığı kenar.
 *
 * 28 değil 20: MNIST böyle hazırlandı — rakam 20×20'ye sığdırılıp 28×28'in
 * ortasına konuyor, kenarda 4 piksel boşluk kalıyor. Eğitim verisiyle aynı
 * çerçeveyi kullanmak, modelin öğrendiği şeyle aynı şeyi görmesi demek.
 */
const IC_KENAR = 20

/**
 * Sekiz komşuluk kullanılıyor.
 *
 * Dört komşulukta çapraz giden ince bir kalem izi kopuyor ve tek bir "7"
 * iki ayrı lekeye bölünüyordu. Sekiz komşulukta bitişik sayılıyorlar.
 */
const KOMSU_X = [-1, 0, 1, -1, 1, -1, 0, 1]
const KOMSU_Y = [-1, -1, -1, 0, 0, 1, 1, 1]

/**
 * Bitişik siyah lekeleri bulur.
 *
 * Özyineleme yerine kendi yığını: 2000 piksellik bir fotoğrafta tek bir
 * gölge lekesi milyonlarca piksel olabiliyor ve özyinelemeli taşma
 * kaçınılmazdı.
 */
export function bilesenleriBul(gri: Gri): Kutu[] {
  const { veri, en, boy } = gri
  const gorulen = new Uint8Array(en * boy)
  const kutular: Kutu[] = []
  const yigin: number[] = []

  for (let bas = 0; bas < veri.length; bas++) {
    if (gorulen[bas] === 1 || veri[bas] !== 0) continue

    gorulen[bas] = 1
    yigin.push(bas)

    let solX = en
    let sagX = -1
    let ustY = boy
    let altY = -1
    let sayac = 0

    while (yigin.length > 0) {
      const i = yigin.pop() as number
      const x = i % en
      const y = (i - x) / en

      sayac++
      if (x < solX) solX = x
      if (x > sagX) sagX = x
      if (y < ustY) ustY = y
      if (y > altY) altY = y

      for (let k = 0; k < 8; k++) {
        const kx = x + KOMSU_X[k]
        const ky = y + KOMSU_Y[k]
        if (kx < 0 || ky < 0 || kx >= en || ky >= boy) continue
        const j = ky * en + kx
        if (gorulen[j] === 1 || veri[j] !== 0) continue
        gorulen[j] = 1
        yigin.push(j)
      }
    }

    kutular.push({
      x: solX,
      y: ustY,
      en: sagX - solX + 1,
      boy: altY - ustY + 1,
      piksel: sayac,
    })
  }

  return kutular
}

/** Bu kadar az pikselli leke toz sayılıyor. */
const EN_AZ_PIKSEL = 12

/** Kenarı görüntünün bu kadarını aşan leke yazı değil. */
const EN_BUYUK_ORAN = 0.5

/**
 * Gürültüyü ve yazı olmayan lekeleri eler.
 *
 * Üç ayrı şeyi atıyor:
 *
 * - **Toz**: eşiklemeden geçen birkaç piksellik lekeler. Kâğıdın dokusu,
 *   sıkışma izleri, defterin çizgisi.
 * - **Devasa lekeler**: sayfa kıvrımı, gölge sınırı, kırpmadan artan kenar.
 * - **Boydan sapanlar**: yazının tipik boyunun çok altında ya da üstünde
 *   kalanlar.
 *
 * Tipik boy **mürekkebe göre tartılmış ortancadan** çıkıyor, düz ortancadan
 * değil. Sebebi ölçüldü: kalın kalemle yazılmış bir kâğıtta 200 lekenin
 * 190'ı tozdu ve düz ortanca toz boyuna oturunca gerçek harflerin **tamamı**
 * "çok büyük" diye elendi. Bir toz zerresi 5 piksel, bir harf 3000: mürekkebe
 * göre tartınca ortanca harflere oturuyor ve toz kararı etkileyemiyor.
 */
export function gurultuyuEle(kutular: Kutu[], gri: Gri): Kutu[] {
  const enBuyukEn = gri.en * EN_BUYUK_ORAN
  const enBuyukBoy = gri.boy * EN_BUYUK_ORAN

  const kalan = kutular.filter(
    (k) => k.piksel >= EN_AZ_PIKSEL && k.en <= enBuyukEn && k.boy <= enBuyukBoy,
  )
  if (kalan.length === 0) return []

  const tipikBoy = tartiliOrtancaBoy(kalan)
  return kalan.filter((k) => k.boy >= tipikBoy * 0.35 && k.boy <= tipikBoy * 3)
}

/** Mürekkebin yarısının hangi boyun altında kaldığı. */
function tartiliOrtancaBoy(kutular: Kutu[]): number {
  const sirali = [...kutular].sort((a, b) => a.boy - b.boy)
  const yari = sirali.reduce((t, k) => t + k.piksel, 0) / 2

  let birikim = 0
  for (const kutu of sirali) {
    birikim += kutu.piksel
    if (birikim >= yari) return kutu.boy
  }
  return sirali[sirali.length - 1].boy
}

/**
 * Lekeleri yazı satırlarına ayırır.
 *
 * Yalnızca y merkezine bakmak yetmiyor: aynı satırdaki "1" ile "2" birkaç
 * piksel kayık olabiliyor, alt alta iki satır ise yakın durabiliyor. Onun
 * yerine **dikey örtüşme** ölçülüyor — iki kutu birbirinin yarısından
 * fazlasını paylaşıyorsa aynı satırdalar.
 */
export function satirlaraAyir(kutular: Kutu[]): Kutu[][] {
  const sirali = [...kutular].sort((a, b) => a.y + a.boy / 2 - (b.y + b.boy / 2))
  const satirlar: Kutu[][] = []

  for (const kutu of sirali) {
    const son = satirlar[satirlar.length - 1]
    if (son !== undefined && ortusuyorMu(son, kutu)) son.push(kutu)
    else satirlar.push([kutu])
  }

  return satirlar.map((satir) => satir.sort((a, b) => a.x - b.x))
}

function ortusuyorMu(satir: Kutu[], kutu: Kutu): boolean {
  const ust = Math.min(...satir.map((k) => k.y))
  const alt = Math.max(...satir.map((k) => k.y + k.boy))
  const kesisim = Math.min(alt, kutu.y + kutu.boy) - Math.max(ust, kutu.y)
  return kesisim > Math.min(alt - ust, kutu.boy) / 2
}

/**
 * Tek lekeyi 28×28 kareye oturtur.
 *
 * İki adım, ikisi de MNIST'in hazırlığıyla aynı:
 *
 * 1. **En-boy oranı korunarak** 20×20'ye küçültülüyor. Kareye yaymak "1"i
 *    "0" gibi geniş gösterirdi.
 * 2. Kareye **kütle merkezinden** yerleştiriliyor, kutu merkezinden değil.
 *    "7"nin ağırlığı üstte, "J"ninki altta; ortalarını hizalamak ikisini de
 *    eğitim verisindeki hâlinden kaydırırdı.
 *
 * Ölçekleme alan ortalamasıyla: hedef göz, kaynakta karşılık geldiği
 * dikdörtgenin mürekkep oranını alıyor. En yakın komşu seçmek ince kalem
 * izini yer yer yok ediyordu.
 */
export function kareyeOturt(gri: Gri, kutu: Kutu): Float32Array {
  const oran = IC_KENAR / Math.max(kutu.en, kutu.boy)
  const kEn = Math.max(1, Math.round(kutu.en * oran))
  const kBoy = Math.max(1, Math.round(kutu.boy * oran))

  // Ters eşleme: hedef gözden kaynağa bakılıyor, kaynaktan hedefe değil.
  // Kaynaktan yazmak küçültmede doğru ama **büyütmede** bazı hedef gözlere
  // hiç piksel düşmüyor ve onlar sıfıra bölünüp NaN oluyordu — küçük yazılmış
  // bir harf 20×20'ye büyütülünce tanıyıcıya çöp gidiyordu.
  const kucuk = new Float32Array(kEn * kBoy)
  for (let y = 0; y < kBoy; y++) {
    const kY1 = (y * kutu.boy) / kBoy
    const kY2 = ((y + 1) * kutu.boy) / kBoy
    for (let x = 0; x < kEn; x++) {
      const kX1 = (x * kutu.en) / kEn
      const kX2 = ((x + 1) * kutu.en) / kEn

      let toplamMurekkep = 0
      let adet = 0
      // Aralık bir pikselden darsa (büyütme) yine de içine düşen tek piksel
      // okunuyor; `Math.floor` ile `Math.max` bunu garanti ediyor.
      const y1 = Math.floor(kY1)
      const y2 = Math.max(y1 + 1, Math.ceil(kY2))
      const x1 = Math.floor(kX1)
      const x2 = Math.max(x1 + 1, Math.ceil(kX2))

      for (let ky = y1; ky < y2 && ky < kutu.boy; ky++) {
        for (let kx = x1; kx < x2 && kx < kutu.en; kx++) {
          adet++
          if (gri.veri[(kutu.y + ky) * gri.en + (kutu.x + kx)] === 0) toplamMurekkep++
        }
      }
      kucuk[y * kEn + x] = adet === 0 ? 0 : toplamMurekkep / adet
    }
  }

  let toplam = 0
  let mx = 0
  let my = 0
  for (let y = 0; y < kBoy; y++) {
    for (let x = 0; x < kEn; x++) {
      const d = kucuk[y * kEn + x]
      toplam += d
      mx += d * x
      my += d * y
    }
  }

  // Tümüyle boş bir leke buraya gelmemeli ama gelirse sıfıra bölünmesin.
  const merkezX = toplam > 0 ? mx / toplam : kEn / 2
  const merkezY = toplam > 0 ? my / toplam : kBoy / 2
  // Karenin gerçek ortası 14 değil 13,5: 0'dan 27'ye giden bir ızgaranın
  // orta noktası. 14 almak her karakteri yarım piksel sağa aşağı kaydırıyor.
  const orta = (KARE - 1) / 2
  const kaydirX = Math.round(orta - merkezX)
  const kaydirY = Math.round(orta - merkezY)

  const kare = new Float32Array(KARE * KARE)
  for (let y = 0; y < kBoy; y++) {
    const hy = y + kaydirY
    if (hy < 0 || hy >= KARE) continue
    for (let x = 0; x < kEn; x++) {
      const hx = x + kaydirX
      if (hx < 0 || hx >= KARE) continue
      kare[hy * KARE + hx] = kucuk[y * kEn + x]
    }
  }

  return kare
}

/** Eşiklenmiş görüntüden satır satır karakterler. */
export function karakterleriCikar(gri: Gri): Satir[] {
  const kutular = gurultuyuEle(bilesenleriBul(gri), gri)

  return satirlaraAyir(kutular).map((satir) => ({
    karakterler: satir.map((kutu) => ({ kutu, nokta: kareyeOturt(gri, kutu) })),
    ustY: Math.min(...satir.map((k) => k.y)),
    altY: Math.max(...satir.map((k) => k.y + k.boy)),
  }))
}
