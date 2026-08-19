/**
 * Hatalı soru bildirimlerinin gönderimi — uygulamanın ağa çıkan **tek** yeri.
 *
 * `AGENTS.md` "sunucu yok, dış servise çıkma" diyor; burası o kuralın bilinçli
 * ve dar istisnası. Dışarı çıkan veri `formVerisi()` içinde tek tek sayılı
 * yedi alandan ibaret: soru kimliği, oyun, soru metni, uygulamanın doğru
 * sandığı cevap, sebep, sürüm ve anonim bir cihaz numarası. Ad, e-posta, puan,
 * deneme/okul/fotoğraf verisi buradan geçmiyor.
 *
 * `CapacitorHttp` kullanılıyor, `fetch` değil: istek native tarafta atıldığı
 * için CORS devreye girmiyor ve **gerçek durum kodu** dönüyor. `fetch` ile
 * `mode: 'no-cors'` gerekirdi, o da yanıtı okunamaz yapardı — gönderimin
 * başarılı olup olmadığını hiç bilemezdik. Yeni bağımlılık yok, `CapacitorHttp`
 * `@capacitor/core` içinde geliyor.
 */

import { App } from '@capacitor/app'
import { Capacitor, CapacitorHttp } from '@capacitor/core'
import { ANAHTARLAR, depo } from './depo'
import { formVerisi, type HataBildirimi } from './hata-bildirimi'
import { ALANLAR, adresHazirMi, formAdresi } from './veri/bildirim-adresi'
import { yeniId } from './utils'

export interface GonderimSonucu {
  gonderilen: string[]
  basarisiz: string[]
}

const BOS: GonderimSonucu = { gonderilen: [], basarisiz: [] }

/**
 * Cihazı temsil eden anonim numara.
 *
 * Kime ait olduğu bilinemiyor; işi aynı kişiden gelen bildirimleri tabloda
 * gruplamak ve düğmeye dayanan birini ayırt edebilmek. İlk gerekişinde bir kez
 * üretiliyor, sonra saklanıyor.
 */
export function cihazKimligi(): string {
  const mevcut = depo.oku<string>(ANAHTARLAR.cihazKimligi, '')
  if (mevcut) return mevcut
  const yeni = yeniId()
  depo.yaz(ANAHTARLAR.cihazKimligi, yeni)
  return yeni
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

function gonderilebilirMi(): boolean {
  // Tarayıcıda gönderilmiyor: `npm run dev` sırasında her bildirim tabloya
  // düşerse gerçek bildirimler test satırları arasında kaybolur.
  if (!Capacitor.isNativePlatform()) return false
  if (!adresHazirMi()) return false
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false
  return true
}

/** Alan adlarını formun `entry` numaralarına çeviriyor. */
function govde(veri: Record<string, string>): Record<string, string> {
  const cikti: Record<string, string> = {}
  for (const [alan, deger] of Object.entries(veri)) {
    const numara = ALANLAR[alan]
    if (numara) cikti[numara] = deger
  }
  return cikti
}

/**
 * Bekleyen bildirimleri sırayla gönderir.
 *
 * Hata hiçbir zaman kullanıcıya gösterilmiyor — bildiren kişi zaten işinin
 * bittiğini sanıyor ve haklı: kayıt cihazda duruyor, bir sonraki fırsatta
 * yeniden denenecek.
 */
export async function bildirimleriGonder(bekleyen: HataBildirimi[]): Promise<GonderimSonucu> {
  if (bekleyen.length === 0 || !gonderilebilirMi()) return BOS

  const cihaz = cihazKimligi()
  const surum = await surumAl()
  const sonuc: GonderimSonucu = { gonderilen: [], basarisiz: [] }

  for (const bildirim of bekleyen) {
    try {
      const yanit = await CapacitorHttp.post({
        url: formAdresi(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: govde(formVerisi(bildirim, cihaz, surum)),
      })
      // Google Forms başarılı gönderimde 200 dönüyor. 4xx/5xx büyük ihtimalle
      // form ayarı bozuk demek; kayıt kuyrukta kalıyor, düzeltilince gidecek.
      if (yanit.status >= 200 && yanit.status < 300) sonuc.gonderilen.push(bildirim.kimlik)
      else sonuc.basarisiz.push(bildirim.kimlik)
    } catch {
      sonuc.basarisiz.push(bildirim.kimlik)
      // Ağ koptuysa kalanları denemenin anlamı yok.
      break
    }
  }

  return sonuc
}
