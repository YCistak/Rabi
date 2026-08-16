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
