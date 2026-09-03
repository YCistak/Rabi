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
import { kagidaKirp } from './kagit-kirp'
import { satirlariOku, type SatirOkuma } from './kagit-oku'
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
    const esik = await hazirlanmisiTani(kagit.webYol, 'esik')
    const adaylar = [
      await tani(kagit.yol),
      esik.metin,
      (await hazirlanmisiTani(kagit.webYol, 'kontrast')).metin,
    ]

    // Eşitlikte sıradaki öne geçmiyor: ham metin listenin başında ve aynı
    // puanda ona güveniliyor, hazırlık yalnızca kazandırdığında devreye
    // giriyor.
    let metin = adaylar[0]
    for (const aday of adaylar.slice(1)) {
      if (okumaPuani(aday) > okumaPuani(metin)) metin = aday
    }

    /*
      Sayıları kendi tanıyıcımız okuyor (`lib/karakter-tani.ts`), ML Kit
      değil. Sebebi ölçüldü: ML Kit'in Latin modeli basılı metin için eğitildi
      ve el yazısı kâğıtta hiçbir sayı döndürmüyor. Kendi ağımız yalnızca
      0-9, B, D, Y biliyor — ders adını okuyamıyor, ama zor olan kısım o değil.

      Girdisi sert eşiklenmiş görüntü: tanıyıcı siyah-beyaz lekelerle
      çalışıyor ve yumuşak kontrast varyantı ona bir şey katmıyor.
    */
    const satirlar = esik.gri === null ? [] : satirlariOku(esik.gri, agirliklariCoz(AGIRLIKLAR))

    return { durum: 'metin', metin, satirlar }
  } catch {
    return { durum: 'hata' }
  }
}

/** Verilen yoldaki görüntüyü tanır; tanınamazsa boş metin döner. */
async function tani(yol: string): Promise<string> {
  try {
    /*
      Yalnızca Latin. Bu bir seçenek değil, elimizdeki tek model: eklenti beş
      betik modelini birden paketliyor ve dördü AAB'de kullanıcıya 8,5 MB'a
      mal oluyordu. `patches/@capacitor-mlkit+text-recognition+8.2.0.patch`
      onları söküyor; `Script` tipinde ötekiler hâlâ görünüyor ama yamalı
      eklenti hangisi istenirse istensin Latin döndürüyor.
    */
    const sonuc = await TextRecognition.processImage({ path: yol, script: Script.Latin })
    return sonuc.text
  } catch {
    // Bir yol tanınamazsa öteki hâlâ deneniyor; ikisi de boşsa arayüz zaten
    // "okuyamadım" diyor.
    return ''
  }
}

type Hazirlik = 'esik' | 'kontrast'

/**
 * Fotoğrafı hazırlayıp önbelleğe yazar, sonra tanır.
 *
 * Hazırlanmış görüntü de dönüyor: kendi tanıyıcımız aynı piksellerle
 * çalışıyor ve onu ikinci kez üretmek işi boşuna iki katına çıkarırdı.
 */
async function hazirlanmisiTani(
  webYol: string,
  hazirlik: Hazirlik,
): Promise<{ metin: string; gri: Gri | null }> {
  const hazir = await hazirla(webYol, hazirlik)
  if (hazir === null) return { metin: '', gri: null }

  // Her varyant ayrı dosyaya: aynı ada yazmak, ikinci tanıma birincinin
  // dosyasını hâlâ açıkken üstüne yazma riski demek.
  const yazilan = await Filesystem.writeFile({
    path: `rabi-okuma-${hazirlik}.png`,
    data: hazir.base64,
    directory: Directory.Cache,
  })
  return { metin: await tani(yazilan.uri), gri: hazir.gri }
}

/**
 * Fotoğrafı eşikleyip base64 PNG döndürür.
 *
 * PNG çünkü çıktı iki renkli: JPEG harflerin kenarına halka atıyor ve
 * eşiklemeyle kazanılan keskinliği geri alıyor. Sıkışma da PNG'de daha iyi —
 * iki renkli görüntü onun en sevdiği girdi.
 */
async function hazirla(
  webYol: string,
  hazirlik: Hazirlik,
): Promise<{ base64: string; gri: Gri } | null> {
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

    /*
      Kâğıt önce bulunup kırpılıyor (`lib/kagit-kirp.ts`). Fotoğrafta masa da
      var ve ahşabın damarları uyarlamalı eşikten yüzlerce siyah leke olarak
      geçiyor: ölçüldü, tek fotoğrafta 970 lekenin 700'ü masadandı ve gerçek
      harfler onların arasında eleniyordu.
    */
    const piksel = cizim.getImageData(0, 0, en, boy)
    const kagit = kagidaKirp(grilestir(piksel.data, en, boy))
    const islenmis = hazirlik === 'esik' ? uyarlamaliEsik(kagit) : yerelKontrast(kagit)

    // Kırpma tuvali küçültüyor; yazmadan önce ölçüsü de değişmeli.
    tuval.width = islenmis.en
    tuval.height = islenmis.boy
    const kirpilmis = cizim.createImageData(islenmis.en, islenmis.boy)
    rgbaYaz(islenmis, kirpilmis.data)
    cizim.putImageData(kirpilmis, 0, 0)

    // `data:image/png;base64,` başlığı Filesystem'e verilmiyor.
    const base64 = tuval.toDataURL('image/png').split(',')[1]
    return base64 === undefined ? null : { base64, gri: islenmis }
  } catch {
    return null
  }
}
