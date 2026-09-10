'use client'

/**
 * Deneme kâğıdındaki yazıyı okuma — cihaza bağlı taraf.
 *
 * Ayrıştırma `lib/deneme-okuma.ts`, piksel işi `lib/goruntu-esikle.ts`; ikisi
 * de saf ve telefonsuz test ediliyor. Burası yalnızca kamerayı açıp, görüntüyü
 * hazırlayıp metni alıyor.
 *
 * ## Fotoğraf modele ham gitmiyor
 *
 * ML Kit'in Latin modeli basılı metin için eğitildi. Kurşun kalemle yazılmış
 * kâğıtta grafit ile kâğıt arasındaki fark yer yer birkaç ton ve model hiçbir
 * şey döndürmüyordu — aynı yazı tükenmezle yazılınca okunuyordu. Görüntü
 * önce siyah-beyaza indiriliyor; eşikten sonra kalem türü aradan kalkıyor.
 *
 * ## Üç deneme yapılıyor, iyisi alınıyor
 *
 * Hazırlık her fotoğrafta kazandırmıyor: iyi ışıkta, keskin çekilmiş bir
 * kâğıtta ham görüntü zaten okunuyor ve sert eşik ince kalemi yer yer koparıp
 * sonucu **kötüleştirebiliyor**. O yüzden ham, sert eşik ve yumuşak kontrast
 * üçü de tanınıyor; okunabilir sonuç sayısı yüksek olan dönüyor
 * (`okumaPuani`). Bedeli iki tanıma daha — cihazda birkaç yüz milisaniye;
 * kazancı, hangi kalemle ve hangi ışıkta yazılırsa yazılsın kâğıdın
 * okunması.
 *
 * ## Ağa çıkmıyor
 *
 * ML Kit'in Latin metin modeli **APK'ya gömülü**; tanıma tümüyle cihazda
 * oluyor, uçak modunda da çalışıyor. Hazırlık da öyle: tuval işi WebView'in
 * içinde. `AGENTS.md`'deki "dış servise çıkma" kuralı bu yüzden korunuyor ve
 * Data Safety beyanı değişmiyor — bulut OCR (Vision API vb.) baştan elendi.
 *
 * ## Tarayıcıda yok
 *
 * Eklentinin web karşılığı yok. `npm run dev` sırasında düğme gizleniyor;
 * çalışmayan bir düğme göstermek, bozuk bir uygulama göstermektir.
 */

import { Capacitor } from '@capacitor/core'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Script, TextRecognition } from '@capacitor-mlkit/text-recognition'
import { cihazdanKagit, type Kaynak } from './kamera'
import { okumaPuani } from './deneme-okuma'
import { grilestir, olcek, rgbaYaz, uyarlamaliEsik, yerelKontrast, type Gri } from './goruntu-esikle'
import { ceyrekDondur, kagidaKirp } from './kagit-kirp'
import { satirlariOku, type SatirOkuma } from './kagit-oku'
import { adlariEsle, type MetinSatiri } from './satir-esle'
import { agirliklariCoz } from './karakter-tani'
import { AGIRLIKLAR } from './karakter-agirliklari'

/**
 * Okuma sonucu.
 *
 * Dört hâl ayrı ayrı duruyor çünkü arayüzün her birine söyleyecek başka bir
 * şeyi var: vazgeçene hiçbir şey denmiyor, hata alana "bir daha dene",
 * desteklenmeyen ortamda düğme hiç görünmüyor.
 */
export type OkumaCiktisi =
  | {
      durum: 'metin'
      /** ML Kit'in okuduğu ham metin; ders adları buradan çıkıyor. */
      metin: string
      /**
       * Kendi tanıyıcımızın satır satır okuduğu sayılar.
       *
       * `metin`den ayrı duruyor çünkü ikisi ayrı şeyi biliyor: ML Kit ders
       * adını okuyabiliyor ama el yazısı sayıları göremiyor, bizim tanıyıcı
       * tersi. Birleştirme kararı arayüzün.
       */
      satirlar: SatirOkuma[]
      /**
       * Her sayı satırının ders adı; okunamayanda boş.
       *
       * Sıra değil **hiza** eşleştiriyor (`lib/satir-esle.ts`): kâğıtta ad ile
       * sayı aynı satırda duruyor, ama satırların sırası şablonun sırası
       * değil ve taşan bir satır listeyi kaydırıyor.
       */
      adlar: string[]
    }
  | { durum: 'vazgecildi' }
  | { durum: 'desteklenmiyor' }
  | { durum: 'hata' }

/** Düğmenin gösterilip gösterilmeyeceği. */
export function okumaVarMi(): boolean {
  return Capacitor.isNativePlatform()
}

export async function kagidiOku(kaynak: Kaynak = 'kamera'): Promise<OkumaCiktisi> {
  if (!okumaVarMi()) return { durum: 'desteklenmiyor' }

  const kagit = await cihazdanKagit(kaynak)
  // Vazgeçme ve izin reddi aynı yoldan geliyor; ikisi de hata değil.
  if (kagit === null) return { durum: 'vazgecildi' }

  try {
    /*
      Önce sayılar, sonra adlar. Sıra bu çünkü kâğıdın **yönünü** sayı okuması
      buluyor (`satirlariOku`, üç yönü de deneyip en çok küme vereni seçiyor)
      ve ML Kit'e giden kopyanın aynı yöne çevrilmesi gerekiyor: ölçüldü, yan
      duran kâğıtta basılı-metin tanıyıcısı tek bir ders adı bile okumuyor,
      çıktı tümüyle çöp. Üstelik iki tanıyıcının kutuları ancak aynı uzayda
      karşılaştırılabiliyor.
    */
    const esikGri = await hazirla(kagit.webYol, 'esik')
    const okuma =
      esikGri === null
        ? { ceyrek: 0, satirlar: [] as SatirOkuma[] }
        : satirlariOku(esikGri, agirliklariCoz(AGIRLIKLAR))

    const kontrastGri = await hazirla(kagit.webYol, 'kontrast')
    const esik = await donduruleniTani(esikGri, okuma.ceyrek, 'esik')
    const kontrast = await donduruleniTani(kontrastGri, okuma.ceyrek, 'kontrast')

    /*
      Üç görüntü, üç tanıma, en iyisi kazanıyor. Hangi hazırlığın işe
      yarayacağı fotoğrafa bağlı ve önceden bilinmiyor:

      - **Ham**: iyi ışıkta, koyu kalemle yazılmış keskin kâğıtta zaten
        okunuyor ve hiçbir hazırlık onu iyileştirmiyor.
      - **Sert eşik**: soluk kurşun kalemi kurtaran şey; grafit ile kâğıt
        arasındaki birkaç tonluk farkı siyah-beyaza çeviriyor.
      - **Yumuşak kontrast**: ince uçlu kalemde sert eşik harfin gövdesini
        koparıp "5"i "S" yapabiliyor; bu varyant gölgeyi yine düşürüyor ama
        harfin gri tonlarını bırakıyor.

      Denemek ölçmekten ucuz: seçimi kullanıcıya sormak ya da fotoğraftan
      kestirmeye çalışmak yerine üçü de tanınıyor.
    */
    const adaylar = [await tani(kagit.yol), esik.metin, kontrast.metin]

    // Eşitlikte sıradaki öne geçmiyor: ham metin listenin başında ve aynı
    // puanda ona güveniliyor, hazırlık yalnızca kazandırdığında devreye
    // giriyor.
    let metin = adaylar[0]
    for (const aday of adaylar.slice(1)) {
      if (okumaPuani(aday) > okumaPuani(metin)) metin = aday
    }

    /*
      Ad eşlemesi için ham metin kullanılamıyor: onun kutuları fotoğrafın
      kendi uzayında, sayı satırlarınınki ise kırpılmış ve döndürülmüş
      kopyada. Geriye iki hazırlanmış varyant kalıyor ve hangisinin adları
      okuduğu fotoğrafa bağlı — ikisi de eşleştirilip **çok ad çözen**
      alınıyor. İkisi karıştırılmıyor: aynı hizadaki iki ayrı kutu aynı sayı
      satırı için yarışır ve kazananın hangisi olduğu rastlantıya kalırdı.
    */
    const adAdaylari = [
      adlariEsle(okuma.satirlar, esik.satirlar),
      adlariEsle(okuma.satirlar, kontrast.satirlar),
    ]
    const adlar = adAdaylari.reduce((a, b) => (cozulen(b) > cozulen(a) ? b : a))

    return { durum: 'metin', metin, satirlar: okuma.satirlar, adlar }
  } catch {
    return { durum: 'hata' }
  }
}

/** Adı çözülmüş satır sayısı. */
function cozulen(adlar: string[]): number {
  return adlar.filter((ad) => ad !== '').length
}

/** Verilen yoldaki görüntüyü tanır; tanınamazsa boş metin döner. */
async function tani(yol: string): Promise<string> {
  return (await taniAyrintili(yol)).metin
}

/**
 * Tanınan metni **ve** satırların yerini döndürür.
 *
 * Satır kutuları ders adını sayı satırına bağlamak için gerekiyor
 * (`lib/satir-esle.ts`); ML Kit'in düz metni satırların hizasını anlatmıyor.
 */
async function taniAyrintili(yol: string): Promise<{ metin: string; satirlar: MetinSatiri[] }> {
  try {
    /*
      Yalnızca Latin. Bu bir seçenek değil, elimizdeki tek model: eklenti beş
      betik modelini birden paketliyor ve dördü AAB'de kullanıcıya 8,5 MB'a
      mal oluyordu. `patches/@capacitor-mlkit+text-recognition+8.2.0.patch`
      onları söküyor; `Script` tipinde ötekiler hâlâ görünüyor ama yamalı
      eklenti hangisi istenirse istensin Latin döndürüyor.
    */
    const sonuc = await TextRecognition.processImage({ path: yol, script: Script.Latin })
    const satirlar: MetinSatiri[] = []
    for (const blok of sonuc.blocks) {
      for (const satir of blok.lines) {
        // Kutusu olmayan satır eşlemeye giremiyor: yeri bilinmeyen bir adı
        // bir sayı satırına yazmak, sıraya bakmakla aynı hatayı yapmak olurdu.
        if (satir.boundingBox === undefined) continue
        satirlar.push({
          metin: satir.text,
          ustY: satir.boundingBox.top,
          altY: satir.boundingBox.bottom,
        })
      }
    }
    return { metin: sonuc.text, satirlar }
  } catch {
    // Bir yol tanınamazsa öteki hâlâ deneniyor; ikisi de boşsa arayüz zaten
    // "okuyamadım" diyor.
    return { metin: '', satirlar: [] }
  }
}

type Hazirlik = 'esik' | 'kontrast'

/**
 * Hazırlanmış görüntüyü okumanın yönüne çevirip önbelleğe yazar, sonra tanır.
 *
 * Döndürme burada yapılıyor çünkü yönü sayı okuması buluyor ve ML Kit ona
 * bağlı: yan duran kâğıtta ham yönde tek ders adı bile okunmuyor.
 */
async function donduruleniTani(
  gri: Gri | null,
  ceyrek: number,
  hazirlik: Hazirlik,
): Promise<{ metin: string; satirlar: MetinSatiri[] }> {
  if (gri === null) return { metin: '', satirlar: [] }

  const yazilan = await griyiYaz(ceyrekDondur(gri, ceyrek), hazirlik)
  if (yazilan === null) return { metin: '', satirlar: [] }
  return taniAyrintili(yazilan)
}

/**
 * Griyi PNG olarak önbelleğe yazar, dosya yolunu döndürür.
 *
 * PNG çünkü çıktı iki renkli: JPEG harflerin kenarına halka atıyor ve
 * eşiklemeyle kazanılan keskinliği geri alıyor. Sıkışma da PNG'de daha iyi —
 * iki renkli görüntü onun en sevdiği girdi.
 */
async function griyiYaz(gri: Gri, hazirlik: Hazirlik): Promise<string | null> {
  try {
    const tuval = document.createElement('canvas')
    tuval.width = gri.en
    tuval.height = gri.boy
    const cizim = tuval.getContext('2d')
    if (cizim === null) return null

    const piksel = cizim.createImageData(gri.en, gri.boy)
    rgbaYaz(gri, piksel.data)
    cizim.putImageData(piksel, 0, 0)

    // Her varyant ayrı dosyaya: aynı ada yazmak, ikinci tanıma birincinin
    // dosyasını hâlâ açıkken üstüne yazma riski demek.
    const yazilan = await Filesystem.writeFile({
      // `data:image/png;base64,` başlığı Filesystem'e verilmiyor.
      path: `rabi-okuma-${hazirlik}.png`,
      data: tuval.toDataURL('image/png').split(',')[1] ?? '',
      directory: Directory.Cache,
    })
    return yazilan.uri
  } catch {
    return null
  }
}

/**
 * Fotoğrafı kırpıp hazırlar; piksel işi buradan sonra saf.
 *
 * Kırpma şart: fotoğrafta masa da var ve ahşabın damarları uyarlamalı
 * eşikten yüzlerce siyah leke olarak geçiyor — ölçüldü, tek fotoğrafta 970
 * lekenin 700'ü masadandı ve gerçek harfler onların arasında eleniyordu
 * (`lib/kagit-kirp.ts`).
 */
async function hazirla(webYol: string, hazirlik: Hazirlik): Promise<Gri | null> {
  try {
    const cevap = await fetch(webYol)
    const resim = await createImageBitmap(await cevap.blob(), { imageOrientation: 'from-image' })

    const oran = olcek(resim.width, resim.height)
    const en = Math.round(resim.width * oran)
    const boy = Math.round(resim.height * oran)

    const tuval = document.createElement('canvas')
    tuval.width = en
    tuval.height = boy
    const cizim = tuval.getContext('2d', { willReadFrequently: true })
    if (cizim === null) {
      resim.close()
      return null
    }

    cizim.drawImage(resim, 0, 0, en, boy)
    resim.close()

    const piksel = cizim.getImageData(0, 0, en, boy)
    const kagit = kagidaKirp(grilestir(piksel.data, en, boy))
    return hazirlik === 'esik' ? uyarlamaliEsik(kagit) : yerelKontrast(kagit)
  } catch {
    return null
  }
}
