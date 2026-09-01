'use client'

/**
 * Deneme kâğıdındaki yazıyı okuma — cihaza bağlı taraf.
 *
 * Ayrıştırma `lib/deneme-okuma.ts` içinde ve saf; burası yalnızca kamerayı
 * açıp metni alıyor. Ayrım bilerek: asıl hata ayrıştırmadan çıkıyor ve o
 * telefon olmadan test edilebilmeli.
 *
 * ## Ağa çıkmıyor
 *
 * ML Kit'in Latin metin modeli **APK'ya gömülü**; tanıma tümüyle cihazda
 * oluyor, uçak modunda da çalışıyor. `AGENTS.md`'deki "dış servise çıkma"
 * kuralı bu yüzden korunuyor ve Data Safety beyanı değişmiyor — bulut OCR
 * (Vision API vb.) baştan elendi.
 *
 * ## Tarayıcıda yok
 *
 * Eklentinin web karşılığı yok. `npm run dev` sırasında düğme gizleniyor;
 * çalışmayan bir düğme göstermek, bozuk bir uygulama göstermektir.
 */

import { Capacitor } from '@capacitor/core'
import { Script, TextRecognition } from '@capacitor-mlkit/text-recognition'
import { cihazdanFotografYolu, type Kaynak } from './kamera'

/**
 * Okuma sonucu.
 *
 * Dört hâl ayrı ayrı duruyor çünkü arayüzün her birine söyleyecek başka bir
 * şeyi var: vazgeçene hiçbir şey denmiyor, hata alana "bir daha dene",
 * desteklenmeyen ortamda düğme hiç görünmüyor.
 */
export type OkumaCiktisi =
  | { durum: 'metin'; metin: string }
  | { durum: 'vazgecildi' }
  | { durum: 'desteklenmiyor' }
  | { durum: 'hata' }

/** Düğmenin gösterilip gösterilmeyeceği. */
export function okumaVarMi(): boolean {
  return Capacitor.isNativePlatform()
}

export async function kagidiOku(kaynak: Kaynak = 'kamera'): Promise<OkumaCiktisi> {
  if (!okumaVarMi()) return { durum: 'desteklenmiyor' }

  const yol = await cihazdanFotografYolu(kaynak)
  // Vazgeçme ve izin reddi aynı yoldan geliyor; ikisi de hata değil.
  if (yol === null) return { durum: 'vazgecildi' }

  try {
    /*
      Yalnızca Latin. Bu bir seçenek değil, elimizdeki tek model: eklenti beş
      betik modelini birden paketliyor ve dördü AAB'de kullanıcıya 8,5 MB'a
      mal oluyordu. `patches/@capacitor-mlkit+text-recognition+8.2.0.patch`
      onları söküyor; `Script` tipinde ötekiler hâlâ görünüyor ama yamalı
      eklenti hangisi istenirse istensin Latin döndürüyor.
    */
    const sonuc = await TextRecognition.processImage({ path: yol, script: Script.Latin })
    return { durum: 'metin', metin: sonuc.text }
  } catch {
    return { durum: 'hata' }
  }
}
