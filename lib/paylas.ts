'use client'

/**
 * Görsel paylaşma.
 *
 * Cihazda ve tarayıcıda iki ayrı yol var:
 *
 * - **Cihaz (Capacitor):** blob önce önbellek klasörüne yazılıyor, sonra dosya
 *   adresi Android'in paylaş penceresine veriliyor. Android'in paylaşımı
 *   `data:` adresi kabul etmiyor, dosya yazmadan bu iş olmuyor.
 * - **Tarayıcı:** `navigator.share` dosya destekliyorsa o, desteklemiyorsa
 *   görsel indiriliyor. Geliştirmede özeti gözle görebilmek için gerekli.
 */

import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

export type PaylasimSonucu = 'paylasildi' | 'indirildi' | 'iptal' | 'hata'

/**
 * Blob'u `data:` adresine çevirir.
 *
 * `FileReader` kullanılıyor: Capacitor'ın `Filesystem.writeFile` çağrısı base64
 * bekliyor ve blob'u kendisi çözemiyor.
 */
function base64Cevir(blob: Blob): Promise<string> {
  return new Promise((coz, reddet) => {
    const okuyucu = new FileReader()
    okuyucu.onerror = () => reddet(new Error('Görsel okunamadı'))
    okuyucu.onload = () => {
      const sonuc = String(okuyucu.result)
      // "data:image/png;base64,XXXX" → yalnızca XXXX kısmı isteniyor.
      coz(sonuc.slice(sonuc.indexOf(',') + 1))
    }
    okuyucu.readAsDataURL(blob)
  })
}

export async function gorseliPaylas(
  blob: Blob,
  dosyaAdi: string,
  baslik: string,
  /**
   * Görselin yanında gidecek yazı. Ayrı veriliyor çünkü paylaşım penceresinde
   * bazı uygulamalar (mesajlaşma, not) görseli değil yalnızca yazıyı alıyor;
   * o durumda "rabi-haftalik-ozet-2026-08-17.png" yerine haftanın özeti gitsin.
   */
  metin: string = baslik,
): Promise<PaylasimSonucu> {
  if (Capacitor.isNativePlatform()) {
    try {
      const yazma = await Filesystem.writeFile({
        path: dosyaAdi,
        data: await base64Cevir(blob),
        // Önbellek klasörü: paylaşılan görselin kalıcı olması gerekmiyor,
        // sistem yer açtığında silebilir. Belgeler klasörü olsaydı kullanıcının
        // galerisi her hafta bir dosyayla dolardı.
        directory: Directory.Cache,
      })
      await Share.share({ title: baslik, text: metin, files: [yazma.uri] })
      return 'paylasildi'
    } catch (hata) {
      // Kullanıcı paylaş penceresini kapattığında da hata fırlıyor; ayırt
      // edilemediği için "iptal" sayılıyor, ekranda hata gösterilmiyor.
      return iptalMi(hata) ? 'iptal' : 'hata'
    }
  }

  const dosya = new File([blob], dosyaAdi, { type: 'image/png' })
  if (navigator.canShare?.({ files: [dosya] })) {
    try {
      await navigator.share({ files: [dosya], title: baslik, text: metin })
      return 'paylasildi'
    } catch (hata) {
      return iptalMi(hata) ? 'iptal' : 'hata'
    }
  }

  try {
    const adres = URL.createObjectURL(blob)
    const bag = document.createElement('a')
    bag.href = adres
    bag.download = dosyaAdi
    bag.click()
    URL.revokeObjectURL(adres)
    return 'indirildi'
  } catch {
    return 'hata'
  }
}

function iptalMi(hata: unknown): boolean {
  const metin = hata instanceof Error ? `${hata.name} ${hata.message}` : String(hata)
  return /abort|cancel|iptal|dismiss/i.test(metin)
}
