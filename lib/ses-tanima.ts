import { SpeechRecognition } from '@capgo/capacitor-speech-recognition'
import type { PluginListenerHandle } from '@capacitor/core'
import { cihazdaMi } from './kamera'
import { enIyiAdayiSec, TANIMA_IPUCLARI } from './sesli-giris'

/**
 * Ses tanıma köprüsü (cihaz ve tarayıcı).
 *
 * Neden var:
 * Kullanıcı gün içinde çözdüğü soru sayılarını ve deneme netlerini sesle
 * anlatabilmeli; konuşma metne çevrilip ayrıştırıcıya (`sesli-giris`) iletilir.
 *
 * Ortam farkları:
 * - Cihazda (`cihazdaMi()`): `@capgo/capacitor-speech-recognition` eklentisi.
 *   Android ve iOS'un yerli ses tanıma servislerini (Google Speech / Apple Speech)
 *   kullanır.
 * - Tarayıcıda: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
 *   Geliştirme ortamında (`npm run dev`) ve tarayıcı testlerinde denemeyi sağlar.
 */

export type SesDurumu = 'yok' | 'izin-yok' | 'hazir'

/** En uzun dinleme tavanı. Gün anlatımı için 60 saniye yeterlidir. */
const EN_UZUN_SURE_MS = 60_000

/**
 * Android'de `stop()` promise'i bazı cihazlarda dönmeyebilir.
 * Arayüzün asılı kalmaması için en çok 1,5 saniye beklenir.
 */
const DURDURMA_ZAMAN_ASIMI_MS = 1_500

/** Yerli konuşma tanıyıcı başlatma seçenekleri (iOS `contextualStrings`i, Android `maxResults`ı kullanır). */
const BASLATMA_SECENEKLERI = {
  language: 'tr-TR',
  partialResults: true,
  popup: false,
  maxResults: 5,
  contextualStrings: TANIMA_IPUCLARI,
}

/**
 * Peş peşe başlatmalarda yerli ses servisinin "busy" (meşgul) hatası vermesini
 * önlemek için önceki oturumun kapanışını tutan zincir.
 */
let oncekiOturumKapanisi: Promise<void> = Promise.resolve()

/**
 * Bu hata kodları alındığında servis/donanım kullanılamaz durumdadır;
 * sessizlik döngüsü oturumu tekrar başlatmamalıdır.
 */
const YENIDEN_BASLATILMAYACAK_HATALAR = new Set([
  'network',
  'not-allowed',
  'service-not-allowed',
  'audio-capture',
])

/** Tarayıcıda çakışan iki tanıma oturumunu önlemek için etkin tanıma nesnesi. */
let aktifTarayiciTanima: TarayiciSpeechRecognition | null = null

/* -------------------------------------------------------------------------- */
/* Tarayıcı Web Speech API Tip Tanımları (any kullanılmaz)                    */
/* -------------------------------------------------------------------------- */

interface TarayiciKonusmaAlternatifi {
  readonly transcript: string
  readonly confidence: number
}

interface TarayiciKonusmaSonucu {
  readonly isFinal: boolean
  readonly length: number
  readonly [index: number]: TarayiciKonusmaAlternatifi
}

interface TarayiciKonusmaSonucListesi {
  readonly length: number
  readonly [index: number]: TarayiciKonusmaSonucu
}

interface TarayiciKonusmaSonucOlayi {
  readonly resultIndex: number
  readonly results: TarayiciKonusmaSonucListesi
}

interface TarayiciKonusmaHataOlayi {
  readonly error: string
  readonly message?: string
}

interface TarayiciSpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((olay: TarayiciKonusmaSonucOlayi) => void) | null
  onerror: ((olay: TarayiciKonusmaHataOlayi) => void) | null
  onend: (() => void) | null
}

interface TarayiciSpeechRecognitionSinifi {
  new (): TarayiciSpeechRecognition
}

function tarayiciSesSinifi(): TarayiciSpeechRecognitionSinifi | null {
  if (typeof window === 'undefined') return null
  const pencere = window as unknown as {
    SpeechRecognition?: TarayiciSpeechRecognitionSinifi
    webkitSpeechRecognition?: TarayiciSpeechRecognitionSinifi
  }
  return pencere.SpeechRecognition || pencere.webkitSpeechRecognition || null
}

/* -------------------------------------------------------------------------- */
/* Durum ve İzin Kontrolleri                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Cihazda veya tarayıcıda ses tanımanın kullanılabilirlik durumunu döndürür.
 *
 * - 'yok': Donanım/servis desteği yok veya Android'de RecognitionService bulunamadı.
 * - 'izin-yok': Servis var ancak mikrofon/tanıma izni henüz verilmedi.
 * - 'hazir': Hem servis mevcut hem de gerekli izinler verilmiş.
 */
export async function sesTanimaDurumu(): Promise<SesDurumu> {
  if (cihazdaMi()) {
    try {
      const uygunluk = await SpeechRecognition.available()
      if (!uygunluk.available) {
        return 'yok'
      }
      const izin = await SpeechRecognition.checkPermissions()
      if (izin.speechRecognition === 'granted') {
        return 'hazir'
      }
      return 'izin-yok'
    } catch {
      return 'yok'
    }
  }

  const TarayiciSinif = tarayiciSesSinifi()
  if (!TarayiciSinif) {
    return 'yok'
  }

  // Tarayıcı Permissions API destekliyorsa mikrofon iznini sorgula
  try {
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      const izin = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      if (izin.state === 'granted') {
        return 'hazir'
      }
      return 'izin-yok'
    }
  } catch {
    // Bazı tarayıcılar microphone sorgusunu desteklemez, izin isteğine düşülür.
  }

  return 'izin-yok'
}

/**
 * Mikrofon ve konuşma tanıma izinlerini ister.
 * İzin verildiyse `true`, reddedildiyse `false` döner.
 */
export async function sesIzniIste(): Promise<boolean> {
  if (cihazdaMi()) {
    try {
      const sonuc = await SpeechRecognition.requestPermissions()
      return sonuc.speechRecognition === 'granted'
    } catch {
      return false
    }
  }

  const TarayiciSinif = tarayiciSesSinifi()
  if (!TarayiciSinif) {
    return false
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      // Tarayıcıda mikrofon istemi penceresini tetikler
      const akis = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Dinlemeyi SpeechRecognition yapacağı için geçici akışı hemen serbest bırakıyoruz
      akis.getTracks().forEach((iz) => iz.stop())
      return true
    }
  } catch {
    return false
  }

  return false
}

/* -------------------------------------------------------------------------- */
/* Dinleme (Cihaz ve Tarayıcı)                                                */
/* -------------------------------------------------------------------------- */

function metinBirlestir(onceki: string, simdiki: string): string {
  const o = onceki.trim()
  const s = simdiki.trim()
  if (!o) return s
  if (!s) return o
  return `${o} ${s}`
}

/**
 * Dinler; ara metni `onKismi`ye akıtır; kullanıcı durdurunca ya da sessizlikte son metni döndürür.
 */
export function dinle(secenek: { onKismi: (metin: string) => void }): {
  bitti: Promise<string>
  durdur: () => void
} {
  if (cihazdaMi()) {
    return cihazdaDinle(secenek)
  }
  return tarayicidaDinle(secenek)
}

/**
 * Cihazda ses dinleme oturumu.
 */
function cihazdaDinle(secenek: { onKismi: (metin: string) => void }): {
  bitti: Promise<string>
  durdur: () => void
} {
  let kullaniciDurdurdu = false
  let durdurulduMu = false
  let durdurmaZamanlayici: ReturnType<typeof setTimeout> | null = null
  let tavanZamanlayici: ReturnType<typeof setTimeout> | null = null

  let birikmisMetin = ''
  let gecerliAraMetin = ''

  let oturumuKapat: (hataMesaji?: string) => Promise<void> = async () => {}

  // Önceki oturumun kapanışını bekleyen kilit
  const baslamaKilidi = oncekiOturumKapanisi
  let buOturumuKapat: () => void = () => {}
  oncekiOturumKapanisi = new Promise<void>((coz) => {
    buOturumuKapat = coz
  })

  const bitti = new Promise<string>((coz, reddet) => {
    void (async () => {
      // Önceki oturum henüz tamamen sonlanmadıysa bekle
      await baslamaKilidi

      const dinleyiciler: PluginListenerHandle[] = []

      oturumuKapat = async (hataMesaji?: string) => {
        if (durdurulduMu) return
        durdurulduMu = true

        if (durdurmaZamanlayici) clearTimeout(durdurmaZamanlayici)
        if (tavanZamanlayici) clearTimeout(tavanZamanlayici)

        for (const dinleyici of dinleyiciler) {
          await dinleyici.remove().catch(() => {})
        }
        await SpeechRecognition.removeAllListeners().catch(() => {})

        const sonMetin = metinBirlestir(birikmisMetin, gecerliAraMetin)
        buOturumuKapat()

        if (hataMesaji && !sonMetin) {
          reddet(new Error(hataMesaji))
        } else {
          coz(sonMetin)
        }
      }

      try {
        const uygunluk = await SpeechRecognition.available()
        if (!uygunluk.available) {
          await oturumuKapat('Cihazda ses tanıma hizmeti bulunamadı.')
          return
        }

        // Dinleyicileri temizle
        await SpeechRecognition.removeAllListeners().catch(() => {})

        const baslangicZamani = Date.now()

        // Ara sonuçlar dinleyicisi
        const partialDinleyici = await SpeechRecognition.addListener('partialResults', (olay) => {
          if (durdurulduMu) return
          if (olay.matches && olay.matches.length > 0) {
            gecerliAraMetin = enIyiAdayiSec(olay.matches)
            const toplam = metinBirlestir(birikmisMetin, gecerliAraMetin)
            secenek.onKismi(toplam)
          }
        })
        dinleyiciler.push(partialDinleyici)

        let sonHataKodu: string | null = null

        // Oturum durumu dinleyicisi
        const durumDinleyici = await SpeechRecognition.addListener('listeningState', async (olay) => {
          if (durdurulduMu) return
          if (olay.state === 'stopped' || olay.status === 'stopped') {
            const gecenSure = Date.now() - baslangicZamani

            const hataVar =
              sonHataKodu !== null &&
              (YENIDEN_BASLATILMAYACAK_HATALAR.has(sonHataKodu) ||
                sonHataKodu.includes('network') ||
                sonHataKodu.includes('permission'))

            // Kullanıcı durdurduysa, kurtarılamaz hata oluştuysa veya 60 sn tavanı aşıldıysa oturumu bitir
            if (kullaniciDurdurdu || hataVar || gecenSure >= EN_UZUN_SURE_MS) {
              await oturumuKapat()
              return
            }

            // Android sessizlikte kendiliğinden durduysa ve henüz 60 sn dolmadıysa:
            // Metni biriktirip oturumu yeniden başlatıyoruz
            birikmisMetin = metinBirlestir(birikmisMetin, gecerliAraMetin)
            gecerliAraMetin = ''

            try {
              // Servisin donanımı serbest bırakması için kısa bir bekleme
              await new Promise((r) => setTimeout(r, 120))
              if (durdurulduMu || kullaniciDurdurdu) return

              await SpeechRecognition.start(BASLATMA_SECENEKLERI)
            } catch {
              // Yeniden başlatılamazsa mevcut metinle oturumu bitir
              await oturumuKapat()
            }
          }
        })
        dinleyiciler.push(durumDinleyici)

        // Hata dinleyicisi
        const hataDinleyici = await SpeechRecognition.addListener('error', async (olay) => {
          if (durdurulduMu) return
          sonHataKodu = olay.code?.toLowerCase() || ''
          if (kullaniciDurdurdu) {
            await oturumuKapat()
            return
          }

          const hataKodu = sonHataKodu
          let mesaj = 'Ses anlaşılamadı, tekrar dene.'
          if (hataKodu.includes('permission')) {
            mesaj = 'Mikrofon izni verilmedi.'
          } else if (hataKodu.includes('busy')) {
            mesaj = 'Ses servisi meşgul, lütfen tekrar dene.'
          } else if (hataKodu.includes('network')) {
            mesaj = 'Ses tanıma için internet gerekiyor. Yazarak anlatabilirsin.'
          }

          const sonMetin = metinBirlestir(birikmisMetin, gecerliAraMetin)
          if (sonMetin) {
            await oturumuKapat()
          } else {
            await oturumuKapat(mesaj)
          }
        })
        dinleyiciler.push(hataDinleyici)

        // 60 saniye tavan zamanlayıcısı
        tavanZamanlayici = setTimeout(() => {
          if (!durdurulduMu) {
            durdurucu()
          }
        }, EN_UZUN_SURE_MS)

        // Kullanıcı start çağrılmadan önce "durdur" dediyse başlatma
        if (kullaniciDurdurdu) {
          await oturumuKapat()
          return
        }

        await SpeechRecognition.start(BASLATMA_SECENEKLERI)
      } catch {
        await oturumuKapat('Mikrofon başlatılamadı. İzinleri kontrol edip tekrar dene.')
      }
    })()
  })

  const durdurucu = () => {
    if (kullaniciDurdurdu || durdurulduMu) return
    kullaniciDurdurdu = true

    // Android'de stop() promise'i dönmeyebilir; 1,5 sn zaman aşımıyla garantiye alıyoruz
    durdurmaZamanlayici = setTimeout(() => {
      void oturumuKapat()
    }, DURDURMA_ZAMAN_ASIMI_MS)

    SpeechRecognition.stop().catch(() => {
      // stop() başarısız olsa bile zaman aşımı veya listeningState sonlandırır
    })
  }

  return {
    bitti,
    durdur: durdurucu,
  }
}

/**
 * Tarayıcıda ses dinleme oturumu (Web Speech API).
 */
function tarayicidaDinle(secenek: { onKismi: (metin: string) => void }): {
  bitti: Promise<string>
  durdur: () => void
} {
  let kullaniciDurdurdu = false
  let durdurulduMu = false
  let sonHataKodu: string | null = null
  let durdurmaZamanlayici: ReturnType<typeof setTimeout> | null = null
  let tavanZamanlayici: ReturnType<typeof setTimeout> | null = null
  let tanima: TarayiciSpeechRecognition | null = null

  let birikmisMetin = ''
  let gecerliAraMetin = ''

  let oturumuKapat: (hataMesaji?: string) => void = () => {}

  const bitti = new Promise<string>((coz, reddet) => {
    const TarayiciSinif = tarayiciSesSinifi()
    if (!TarayiciSinif) {
      reddet(new Error('Tarayıcıda ses tanıma özelliği desteklenmiyor.'))
      return
    }

    try {
      if (aktifTarayiciTanima) {
        try {
          aktifTarayiciTanima.abort()
        } catch {}
        aktifTarayiciTanima = null
      }
      tanima = new TarayiciSinif()
      aktifTarayiciTanima = tanima
    } catch {
      reddet(new Error('Ses tanıma başlatılamadı.'))
      return
    }

    tanima.continuous = true
    tanima.interimResults = true
    tanima.lang = 'tr-TR'

    const baslangicZamani = Date.now()

    oturumuKapat = (hataMesaji?: string) => {
      if (durdurulduMu) return
      durdurulduMu = true

      if (durdurmaZamanlayici) clearTimeout(durdurmaZamanlayici)
      if (tavanZamanlayici) clearTimeout(tavanZamanlayici)

      if (aktifTarayiciTanima === tanima) {
        aktifTarayiciTanima = null
      }

      if (tanima) {
        tanima.onresult = null
        tanima.onerror = null
        tanima.onend = null
        try {
          tanima.abort()
        } catch {}
      }

      const sonMetin = metinBirlestir(birikmisMetin, gecerliAraMetin)
      if (hataMesaji && !sonMetin) {
        reddet(new Error(hataMesaji))
      } else {
        coz(sonMetin)
      }
    }

    tanima.onresult = (olay: TarayiciKonusmaSonucOlayi) => {
      if (durdurulduMu) return
      let kesinMetin = ''
      let araMetin = ''

      for (let i = 0; i < olay.results.length; i++) {
        const sonuc = olay.results[i]
        const metin = sonuc[0]?.transcript || ''
        if (sonuc.isFinal) {
          kesinMetin = kesinMetin ? `${kesinMetin} ${metin}` : metin
        } else {
          araMetin = araMetin ? `${araMetin} ${metin}` : metin
        }
      }

      gecerliAraMetin = metinBirlestir(kesinMetin, araMetin)
      const toplam = metinBirlestir(birikmisMetin, gecerliAraMetin)
      secenek.onKismi(toplam)
    }

    tanima.onerror = (olay: TarayiciKonusmaHataOlayi) => {
      sonHataKodu = olay.error?.toLowerCase() || ''
      if (durdurulduMu) return
      if (kullaniciDurdurdu) {
        oturumuKapat()
        return
      }

      let mesaj = 'Ses anlaşılamadı, tekrar dene.'
      if (olay.error === 'not-allowed' || olay.error === 'service-not-allowed') {
        mesaj = 'Mikrofon izni verilmedi.'
      } else if (olay.error === 'network') {
        mesaj = 'Bu tarayıcıda ses tanıma çalışmıyor. Yazarak anlatabilirsin.'
      } else if (olay.error === 'audio-capture') {
        mesaj = 'Mikrofon bulunamadı ya da başlatılamadı.'
      } else if (olay.error === 'no-speech') {
        const sonMetin = metinBirlestir(birikmisMetin, gecerliAraMetin)
        if (sonMetin) {
          oturumuKapat()
          return
        }
      }

      oturumuKapat(mesaj)
    }

    tanima.onend = () => {
      if (durdurulduMu) return
      const gecenSure = Date.now() - baslangicZamani
      const baslatilamaz =
        sonHataKodu !== null && YENIDEN_BASLATILMAYACAK_HATALAR.has(sonHataKodu)
      if (kullaniciDurdurdu || baslatilamaz || gecenSure >= EN_UZUN_SURE_MS) {
        oturumuKapat()
        return
      }

      // Sessizlikte tarayıcı durduysa metni aktar ve oturumu yeniden başlat
      birikmisMetin = metinBirlestir(birikmisMetin, gecerliAraMetin)
      gecerliAraMetin = ''

      try {
        tanima?.start()
      } catch {
        oturumuKapat()
      }
    }

    // 60 saniye tavanı
    tavanZamanlayici = setTimeout(() => {
      durdurucu()
    }, EN_UZUN_SURE_MS)

    try {
      tanima.start()
    } catch {
      oturumuKapat('Mikrofon başlatılamadı.')
    }
  })

  const durdurucu = () => {
    if (kullaniciDurdurdu || durdurulduMu) return
    kullaniciDurdurdu = true

    durdurmaZamanlayici = setTimeout(() => {
      oturumuKapat()
    }, DURDURMA_ZAMAN_ASIMI_MS)

    if (tanima) {
      try {
        tanima.stop()
      } catch {}
    }
  }

  return {
    bitti,
    durdur: durdurucu,
  }
}
