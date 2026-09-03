'use client'

import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

/**
 * Fotoğraf alma. İki ayrı yol var çünkü ortamlar farklı:
 *
 * - **Cihazda** Capacitor'ın kamera eklentisi kullanılır; kamera arayüzü,
 *   döndürme düzeltmesi ve küçültme işletim sisteminin işi.
 * - **Tarayıcıda** eklenti kendi `<input type="file">` yedeğine düşüyor ama o
 *   yolda küçültmeyi garanti etmiyor. Onun yerine dosya seçici doğrudan
 *   kullanılıp küçültme burada, tuval üzerinde yapılıyor — böylece iki ortamda
 *   da aynı boyutta fotoğraf kaydediliyor.
 *
 * İki yol da aynı şeyi döndürür: küçültülmüş bir JPEG blob'u.
 *
 * **İzin gerekmiyor.** Eklenti sistemin kamera (IMAGE_CAPTURE) ve fotoğraf
 * seçici ekranlarını açıyor, kameraya kendisi erişmiyor. Manifest'e CAMERA
 * izni yazmak işleri düzeltmez, tersine bozar: Android, izni **tanımlamış**
 * uygulamalardan IMAGE_CAPTURE için çalışma anında izin ister. Bu yüzden
 * manifest'e bilerek eklenmedi (`saveToGallery` da kullanılmıyor).
 */

export type Kaynak = 'kamera' | 'galeri'

/** Uzun kenar. 1280 px, soru fotoğrafında metni okunur tutmaya yetiyor. */
const EN_BUYUK_KENAR = 1280
const KALITE = 0.7

export function cihazdaMi(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * Cihazda kamera/galeri açar. Kullanıcı vazgeçerse `null` döner —
 * eklenti bu durumu hata fırlatarak bildiriyor, hata olarak göstermiyoruz.
 */
export async function cihazdanFotograf(kaynak: Kaynak): Promise<Blob | null> {
  try {
    const foto = await Camera.getPhoto({
      quality: Math.round(KALITE * 100),
      width: EN_BUYUK_KENAR,
      allowEditing: false,
      correctOrientation: true,
      resultType: CameraResultType.Uri,
      source: kaynak === 'kamera' ? CameraSource.Camera : CameraSource.Photos,
    })

    if (!foto.webPath) return null
    const cevap = await fetch(foto.webPath)
    return await cevap.blob()
  } catch {
    // Vazgeçme ve izin reddi aynı yoldan geliyor; ikisinde de sessizce çık.
    return null
  }
}

/** Okumaya giden fotoğrafın iki adresi. */
export type Kagit = {
  /** Native tarafın açacağı yerel yol; metin tanıma bunu istiyor. */
  yol: string
  /** WebView'in çizebileceği adres; eşikleme tuvale bununla yükleniyor. */
  webYol: string
}

/**
 * Cihazdaki fotoğrafın **iki adresi**.
 *
 * `cihazdanFotograf` blob döndürüyor çünkü onu çağıran taraf fotoğrafı
 * saklıyor. Metin tanıma ise yol istiyor: model native tarafta çalışıyor ve
 * dosyayı kendisi açıyor.
 *
 * İkisi birden gerekiyor çünkü fotoğraf modele **ham** gitmiyor: önce tuvalde
 * eşikleniyor (`lib/goruntu-esikle.ts`) ve o iş WebView'in çizebileceği bir
 * adres istiyor. Ham yol da elde tutuluyor — eşikleme kötü sonuç verirse
 * özgün fotoğrafa dönülüyor.
 *
 * Fotoğraf **saklanmıyor**: adresler yalnızca okuma sırasında kullanılıyor.
 * Yanlış soru fotoğrafları depoya giriyor çünkü orada fotoğraf verinin
 * kendisi; burada araç.
 */
export async function cihazdanKagit(kaynak: Kaynak): Promise<Kagit | null> {
  try {
    const foto = await Camera.getPhoto({
      quality: Math.round(KALITE * 100),
      // Küçültme yok: metin tanıma için çözünürlük iyi olmalı ve fotoğraf
      // zaten kaydedilmiyor. `EN_BUYUK_KENAR`da el yazısı rakamlar bulanıyor.
      allowEditing: false,
      correctOrientation: true,
      resultType: CameraResultType.Uri,
      source: kaynak === 'kamera' ? CameraSource.Camera : CameraSource.Photos,
    })
    if (!foto.path || !foto.webPath) return null
    return { yol: foto.path, webYol: foto.webPath }
  } catch {
    return null
  }
}

/**
 * Tarayıcıda seçilen dosyayı küçültür. Cihaz tarafında küçültmeyi eklenti
 * yaptığı için bu yalnızca web yolunda çağrılır.
 */
export async function dosyadanFotograf(dosya: File): Promise<Blob | null> {
  if (!dosya.type.startsWith('image/')) return null
  try {
    return await kucult(dosya)
  } catch {
    // Küçültme başarısızsa özgün dosya yine de saklanabilir.
    return dosya
  }
}

async function kucult(kaynak: Blob): Promise<Blob> {
  // `from-image`: telefon fotoğrafları EXIF'te "90° döndür" yazıp düz kaydedilir;
  // bu olmadan soru fotoğrafları yan yatmış görünür.
  const resim = await createImageBitmap(kaynak, { imageOrientation: 'from-image' })
  const oran = Math.min(1, EN_BUYUK_KENAR / Math.max(resim.width, resim.height))
  const en = Math.round(resim.width * oran)
  const boy = Math.round(resim.height * oran)

  const tuval = document.createElement('canvas')
  tuval.width = en
  tuval.height = boy
  const cizim = tuval.getContext('2d')
  if (!cizim) {
    resim.close()
    return kaynak
  }
  cizim.drawImage(resim, 0, 0, en, boy)
  resim.close()

  const blob = await new Promise<Blob | null>((coz) =>
    tuval.toBlob(coz, 'image/jpeg', KALITE),
  )
  return blob ?? kaynak
}
