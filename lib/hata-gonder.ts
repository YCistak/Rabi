/**
 * Bildirimlerin gönderimi — uygulamanın ağa çıkan **tek** yeri.
 *
 * `AGENTS.md` "sunucu yok, dış servise çıkma" diyor; burası o kuralın bilinçli
 * ve dar istisnası. İki tür kayıt buradan çıkıyor, ikisi de birer Google
 * Form'a: hatalı soru bildirimi (`formVerisi()`, yedi alan: soru kimliği,
 * oyun, soru metni, uygulamanın doğru sandığı cevap, sebep, sürüm ve cihaz
 * alanı) ve öneri/hata bildirimi (`geriBildirimFormVerisi()`, beş alan: tür,
 * kullanıcının yazdığı metin, sürüm, cihaz alanı, tarih). Cihaz alanı telefon
 * modeli + ada bağlı olmayan okunur bir ad. Ad, e-posta, puan,
 * deneme/okul/fotoğraf verisi buradan geçmiyor.
 *
 * `CapacitorHttp` kullanılıyor, `fetch` değil: istek native tarafta atıldığı
 * için CORS devreye girmiyor ve **gerçek durum kodu** dönüyor. `fetch` ile
 * `mode: 'no-cors'` gerekirdi, o da yanıtı okunamaz yapardı — gönderimin
 * başarılı olup olmadığını hiç bilemezdik. Yeni bağımlılık yok, `CapacitorHttp`
 * `@capacitor/core` içinde geliyor.
 */

import { App } from '@capacitor/app'
import { Device } from '@capacitor/device'
import { Capacitor, CapacitorHttp } from '@capacitor/core'
import { ANAHTARLAR, depo } from './depo'
import { formVerisi, type HataBildirimi } from './hata-bildirimi'
import { geriBildirimFormVerisi, type GeriBildirim } from './geri-bildirim'
import { ALANLAR, adresHazirMi, formAdresi } from './veri/bildirim-adresi'
import {
  GERI_BILDIRIM_ALANLARI,
  geriBildirimAdresiHazirMi,
  geriBildirimFormAdresi,
} from './veri/geri-bildirim-adresi'
import { yeniCihazAdi } from './cihaz-adi'

export interface GonderimSonucu {
  gonderilen: string[]
  basarisiz: string[]
}

const BOS: GonderimSonucu = { gonderilen: [], basarisiz: [] }

/**
 * Cihaza verilen okunur ad — `mavi-tavsan-42`.
 *
 * Kime ait olduğu bilinemiyor; işi aynı kişiden gelen bildirimleri tabloda
 * gruplamak ve düğmeye dayanan birini ayırt edebilmek. İlk gerekişinde bir kez
 * üretiliyor, sonra saklanıyor.
 *
 * Önce `yeniId()` kullanılıyordu (`mtoptoc2-1zvbcy`) ve tabloda gözle ayırt
 * edilemiyordu; oysa "bu satırlar aynı kişiden mi" sorusu gözle cevaplanıyor.
 */
export function cihazKimligi(): string {
  const mevcut = depo.oku<string>(ANAHTARLAR.cihazKimligi, '')
  if (mevcut) return mevcut
  const yeni = yeniCihazAdi()
  depo.yaz(ANAHTARLAR.cihazKimligi, yeni)
  return yeni
}

/**
 * Bildirimle giden cihaz alanı: `Samsung SM-A536B (mavi-tavsan-42)`.
 *
 * Model **neden gerekiyor:** bildirimlerin bir kısmı sorunun kendisiyle değil
 * ekranla ilgili çıkıyor (metin taşıyor, seçenek görünmüyor) ve o tür bir
 * arıza her telefonda değil belirli ekran ölçülerinde oluyor. Model olmadan
 * "bende öyle görünmüyor" deyip kapanan bir yol.
 *
 * Model kişiyi tanımlamıyor — aynı modelden milyonlarca cihaz var — ama yine de
 * **cihaz bilgisi**: Ayarlar'daki açıklama, `AGENTS.md` ve Play'in Data Safety
 * formu bunu sayıyor. Alan eklenirse o üç yer de güncellenmeli.
 *
 * Tarayıcıda model yok; orada yalnızca ad dönüyor.
 */
export async function cihazAlani(): Promise<string> {
  const ad = cihazKimligi()
  if (!Capacitor.isNativePlatform()) return `web (${ad})`
  try {
    const bilgi = await Device.getInfo()
    const model = [bilgi.manufacturer, bilgi.model].filter(Boolean).join(' ').trim()
    return model ? `${model} (${ad})` : ad
  } catch {
    return ad
  }
}

/** Yüklü APK'nın sürümü; tarayıcıda çalışırken `web`. */
async function surumAl(): Promise<string> {
  if (!Capacitor.isNativePlatform()) return 'web'
  try {
    const bilgi = await App.getInfo()
    return `${bilgi.version} (${bilgi.build})`
  } catch {
    return 'bilinmiyor'
  }
}

function gonderilebilirMi(adresHazir: boolean): boolean {
  // Tarayıcıda gönderilmiyor: `npm run dev` sırasında her bildirim tabloya
  // düşerse gerçek bildirimler test satırları arasında kaybolur.
  if (!Capacitor.isNativePlatform()) return false
  if (!adresHazir) return false
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false
  return true
}

/** Alan adlarını formun `entry` numaralarına çeviriyor. */
function govde(
  veri: Record<string, string>,
  alanlar: Record<string, string>,
): Record<string, string> {
  const cikti: Record<string, string> = {}
  for (const [alan, deger] of Object.entries(veri)) {
    const numara = alanlar[alan]
    if (numara) cikti[numara] = deger
  }
  return cikti
}

/**
 * Tek bir kaydı forma yollar; başarılıysa `true`.
 *
 * Ağ hatası fırlatılıyor ve çağıranın döngüsünü kırıyor: bağlantı koptuysa
 * kalanları denemenin anlamı yok. Google Forms başarılı gönderimde 200
 * dönüyor; 4xx/5xx büyük ihtimalle form ayarı bozuk demek, kayıt kuyrukta
 * kalıyor ve düzeltilince gidecek.
 */
async function formaYolla(url: string, veri: Record<string, string>): Promise<boolean> {
  const yanit = await CapacitorHttp.post({
    url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: veri,
  })
  return yanit.status >= 200 && yanit.status < 300
}

/**
 * Bekleyen bildirimleri sırayla gönderir.
 *
 * Hata hiçbir zaman kullanıcıya gösterilmiyor — bildiren kişi zaten işinin
 * bittiğini sanıyor ve haklı: kayıt cihazda duruyor, bir sonraki fırsatta
 * yeniden denenecek.
 */
export async function bildirimleriGonder(bekleyen: HataBildirimi[]): Promise<GonderimSonucu> {
  if (bekleyen.length === 0 || !gonderilebilirMi(adresHazirMi())) return BOS

  const cihaz = await cihazAlani()
  const surum = await surumAl()
  const sonuc: GonderimSonucu = { gonderilen: [], basarisiz: [] }

  for (const bildirim of bekleyen) {
    try {
      const gitti = await formaYolla(formAdresi(), govde(formVerisi(bildirim, cihaz, surum), ALANLAR))
      if (gitti) sonuc.gonderilen.push(bildirim.kimlik)
      else sonuc.basarisiz.push(bildirim.kimlik)
    } catch {
      sonuc.basarisiz.push(bildirim.kimlik)
      break
    }
  }

  return sonuc
}

/**
 * Bekleyen öneri/hata bildirimlerini sırayla gönderir.
 *
 * Hatalı sorudan farkı: burada kullanıcı bir "Gönder" düğmesine bastı ve
 * sonucu bekliyor; çağıran taraf başarısızlığı "internet gelince gidecek"
 * diye gösteriyor. Ayrı bir izin kartı yok — düğmenin üstünde ne
 * gönderileceği yazıyor ve düğmeye basmak iznin kendisi.
 */
export async function geriBildirimleriGonder(bekleyen: GeriBildirim[]): Promise<GonderimSonucu> {
  if (bekleyen.length === 0 || !gonderilebilirMi(geriBildirimAdresiHazirMi())) return BOS

  const cihaz = await cihazAlani()
  const surum = await surumAl()
  const sonuc: GonderimSonucu = { gonderilen: [], basarisiz: [] }

  for (const bildirim of bekleyen) {
    try {
      const gitti = await formaYolla(
        geriBildirimFormAdresi(),
        govde(geriBildirimFormVerisi(bildirim, cihaz, surum), GERI_BILDIRIM_ALANLARI),
      )
      if (gitti) sonuc.gonderilen.push(bildirim.kimlik)
      else sonuc.basarisiz.push(bildirim.kimlik)
    } catch {
      sonuc.basarisiz.push(bildirim.kimlik)
      break
    }
  }

  return sonuc
}
