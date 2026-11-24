import { SpeechRecognition } from '@capgo/capacitor-speech-recognition'
import type { PluginListenerHandle } from '@capacitor/core'
import { cihazdaMi } from './kamera'
import { enIyiAdayiSec, sayilariRakamaCevir, TANIMA_IPUCLARI } from './sesli-giris'

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

/**
 * 'guvensiz-adres': tarayıcı mikrofonu yalnız HTTPS ya da localhost'ta verir;
 * `npm run dev`e telefondan LAN IP'siyle girince izin hiç sorulmadan reddedilir.
 */
export type SesDurumu = 'yok' | 'izin-yok' | 'guvensiz-adres' | 'hazir'

export type SesHataKodu =
  | 'izin'
  | 'servis-yok'
  | 'mikrofon-yok'
  | 'ag'
  | 'dil'
  | 'mesgul'
  | 'baslatilamadi'
  | 'sessizlik'

/** Arayüz hatayı metninden değil `kod`undan tanır; metin yalnız kullanıcıya gösterilir. */
export class SesHatasi extends Error {
  constructor(readonly kod: SesHataKodu) {
    super(SES_HATA_METNI[kod])
    this.name = 'SesHatasi'
  }
}

const SES_HATA_METNI: Record<SesHataKodu, string> = {
  izin: 'Mikrofon izni yok. Yazarak anlatabilirsin.',
  'servis-yok': 'Burada ses tanıma çalışmıyor. Yazarak anlatabilirsin.',
  'mikrofon-yok': 'Mikrofon bulunamadı ya da başka bir uygulama kullanıyor.',
  ag: 'Ses tanıma servisine ulaşılamadı. İnterneti kontrol et ya da yazarak anlat.',
  dil: 'Ses tanıma burada Türkçe desteklemiyor. Yazarak anlatabilirsin.',
  mesgul: 'Ses servisi meşgul, birazdan tekrar dene.',
  baslatilamadi: 'Mikrofon başlatılamadı, tekrar dene.',
  sessizlik: 'Duyamadım. Tekrar söyle ya da yaz.',
}

/** En uzun dinleme tavanı. Gün anlatımı için 60 saniye yeterlidir. */
const EN_UZUN_SURE_MS = 60_000

/**
 * Eklenti kesin sonucu `stop()`tan sonra 2 saniyeye kadar bekliyor. Üst sınır
 * ondan uzun olmazsa geç gelen kesin sonuç atılır ve yerli oturum hâlâ açıkken
 * yeni `start` "already running" ile reddedilir.
 */
const DURDURMA_ZAMAN_ASIMI_MS = 3_000

/** `forceStop`tan sonra yerli kapanış olayı gelmezse kilit en çok bu kadar tutulur. */
const KILIT_ZAMAN_ASIMI_MS = 1_500

/** Hata olayından sonra kapanış olayı gelmezse yerli oturum zorla kapatılır. */
const HATA_SONRASI_KAPANIS_MS = 2_500

const YENIDEN_BASLATMA_MS = 120
const YAVAS_YENIDEN_BASLATMA_MS = 300

/** Geçici hatalarda (meşgul, servis koptu) art arda en çok bu kadar yeniden denenir. */
const GECICI_DENEME_SINIRI = 3

/**
 * Sessizlik olağandır ve 60 saniyeye kadar sürer; ama servis hiç dinlemeden
 * boş dönüyorsa (segment 1 saniyeden kısa) döngü pil ve mikrofonu yakar.
 */
const HIZLI_BOS_MS = 1_000
const HIZLI_BOS_SINIRI = 5
const BOS_SEGMENT_SINIRI = 20

/** Bu kadar duraklamadan önce gelen ara metin değişikliği her zaman revizyon sayılır. */
const SIFIRLANMA_DURAKLAMASI_MS = 1_000

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
 * önlemek için önceki oturumun yerli kapanışını tutan zincir.
 */
let oncekiOturumKapanisi: Promise<void> = Promise.resolve()

/** Tarayıcıda çakışan iki tanıma oturumunu önlemek için etkin oturumun kapatıcısı. */
let aktifTarayiciOturumunuKapat: (() => void) | null = null

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
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: (() => void) | null
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
 * - 'guvensiz-adres': Tarayıcı bu adreste (HTTPS/localhost dışı) mikrofonu vermez.
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
  if (window.isSecureContext === false) {
    return 'guvensiz-adres'
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

  // Tarayıcıda izni `SpeechRecognition.start()` kendisi sorar. Önceden
  // `getUserMedia` ile sormak Safari'de iki ayrı pencere açıyor, bırakılan akış
  // tanımanın mikrofonu almasını bozuyor, mikrofonsuz cihazı da "izin yok" gösteriyordu.
  return tarayiciSesSinifi() !== null
}

/* -------------------------------------------------------------------------- */
/* Dinleme (Cihaz ve Tarayıcı)                                                */
/* -------------------------------------------------------------------------- */

type DinlemeSecenegi = {
  onKismi: (metin: string) => void
  /** Mikrofon gerçekten dinlemeye başlayınca bir kez çağrılır. */
  onBasladi?: () => void
}

type Dinleme = { bitti: Promise<string>; durdur: () => void }

function metinBirlestir(onceki: string, simdiki: string): string {
  const o = onceki.trim()
  const s = simdiki.trim()
  if (!o) return s
  if (!s) return o
  return `${o} ${s}`
}

/**
 * Dinler; ara metni `onKismi`ye akıtır; kullanıcı durdurunca ya da süre dolunca
 * son metni döndürür. Hiç söz yokken hata olursa `SesHatasi` ile reddeder.
 */
export function dinle(secenek: DinlemeSecenegi): Dinleme {
  return cihazdaMi() ? cihazdaDinle(secenek) : tarayicidaDinle(secenek)
}

type SegmentKarari = { tur: 'hata'; kod: SesHataKodu } | { tur: 'surdur'; gecikmeMs: number }
type SegmentHatasi = { kod: SesHataKodu; gecici: boolean }

/** Bir tanıma segmenti bitince oturumun süreceğine karar veren, iki ortamın paylaştığı sayaçlar. */
function segmentSayaci() {
  let gecici = 0
  let bos = 0
  let hizliBos = 0
  return (segment: { hata: SegmentHatasi | null; sozGeldi: boolean; sureMs: number }): SegmentKarari => {
    if (segment.sozGeldi) gecici = bos = hizliBos = 0
    if (segment.hata && segment.hata.kod !== 'sessizlik') {
      if (!segment.hata.gecici) return { tur: 'hata', kod: segment.hata.kod }
      gecici += 1
      if (gecici > GECICI_DENEME_SINIRI) return { tur: 'hata', kod: segment.hata.kod }
      return { tur: 'surdur', gecikmeMs: YAVAS_YENIDEN_BASLATMA_MS * gecici }
    }
    if (segment.sozGeldi) return { tur: 'surdur', gecikmeMs: YENIDEN_BASLATMA_MS }
    bos += 1
    hizliBos = segment.sureMs < HIZLI_BOS_MS ? hizliBos + 1 : 0
    if (hizliBos > HIZLI_BOS_SINIRI || bos > BOS_SEGMENT_SINIRI) return { tur: 'hata', kod: 'sessizlik' }
    return { tur: 'surdur', gecikmeMs: hizliBos > 0 ? YAVAS_YENIDEN_BASLATMA_MS : YENIDEN_BASLATMA_MS }
  }
}

/** Eklenti kodunu (Android sabitleri, iOS'ta "ALAN_KOD") arayüz koduna çevirir. */
function yerliHatayiCoz(hamKod: string | undefined): SegmentHatasi {
  const kod = (hamKod ?? '').toUpperCase()
  // iOS 1110 "No speech detected", 301 iptal edilen istek: ikisi de olağan sessiz bitiş.
  if (/^(?:NO_MATCH|SPEECH_TIMEOUT|KAFASSISTANTERRORDOMAIN_1110|KLSRERRORDOMAIN_301)$/.test(kod)) return { kod: 'sessizlik', gecici: true }
  if (/PERMISSION|^KAFASSISTANTERRORDOMAIN_1700$/.test(kod)) return { kod: 'izin', gecici: false }
  if (/^NETWORK|^NSURLERRORDOMAIN_/.test(kod)) return { kod: 'ag', gecici: false }
  // Android 13'ün 12 ve 13 numaralı dil hatalarını eklenti adlandırmıyor.
  if (/^(?:UNSUPPORTED_LOCALE|UNKNOWN_1[23])$/.test(kod)) return { kod: 'dil', gecici: false }
  // 201: iOS'ta Siri ve Dikte kapalı.
  if (/^KLSRERRORDOMAIN_201$/.test(kod)) return { kod: 'servis-yok', gecici: false }
  if (/^(?:RECOGNIZER_BUSY|RECOGNIZER_UNAVAILABLE|UNKNOWN_10)$/.test(kod)) return { kod: 'mesgul', gecici: true }
  return { kod: 'baslatilamadi', gecici: true }
}

/** `start()` reddi kod taşımıyor; eklentinin sabit İngilizce metinleri yalnız burada okunur. */
function baslatmaReddiniCoz(hata: unknown): SegmentHatasi {
  const metin = (hata instanceof Error ? hata.message : String(hata)).toLowerCase()
  if (metin.includes('permission') || metin.includes('denied')) return { kod: 'izin', gecici: false }
  if (metin.includes('already running') || metin.includes('unavailable')) return { kod: 'mesgul', gecici: true }
  if (metin.includes('locale')) return { kod: 'dil', gecici: false }
  return { kod: 'baslatilamadi', gecici: true }
}

function karsilastirmaSozcukleri(metin: string): string[] {
  return sayilariRakamaCevir(metin).toLocaleLowerCase('tr-TR').match(/[\p{L}\p{N}]+/gu) ?? []
}

/**
 * Yerli tanıyıcı uzun duraklamadan sonra ara metni sıfırlayıp yalnız yeni sözü
 * verebiliyor. Revizyonu sıfırlanma sanmak sayıları çiftler, bu yüzden yalnız
 * kesin ayırt edilen hâl kabul edilir: duraklama var, eski söz en az üç
 * sözcük ve en az biri sayı değil, yenisi en çok yarısı kadar ve hiçbir sözcüğü
 * eskisine benzemiyor. Belirsiz kalan her değişiklik revizyondur.
 */
function araMetinSifirlandiMi(eski: string, yeni: string, duraklamaMs: number): boolean {
  if (duraklamaMs < SIFIRLANMA_DURAKLAMASI_MS) return false
  const e = karsilastirmaSozcukleri(eski)
  const y = karsilastirmaSozcukleri(yeni)
  if (e.length < 3 || y.length === 0 || y.length * 2 > e.length) return false
  if (e.every((k) => /^\d+$/.test(k)) || y.every((k) => /^\d+$/.test(k))) return false
  return y.every((a) => e.every((b) => a.slice(0, 3) !== b.slice(0, 3)))
}

/** Cihazda ses dinleme oturumu. */
function cihazdaDinle(secenek: DinlemeSecenegi): Dinleme {
  const baslamaKilidi = oncekiOturumKapanisi
  let kilidiAc: () => void = () => {}
  oncekiOturumKapanisi = new Promise<void>((coz) => {
    kilidiAc = coz
  })

  let coz: (metin: string) => void = () => {}
  let reddet: (hata: SesHatasi) => void = () => {}
  const bitti = new Promise<string>((c, r) => {
    coz = c
    reddet = r
  })

  const dinleyiciler: PluginListenerHandle[] = []
  const segmentKarari = segmentSayaci()
  let kullaniciDurdurdu = false
  let kapandi = false
  let basladi = false
  let birikmis = ''
  let ara = ''
  let sonAraZamani = 0
  /** Sıfırlanma sayılıp `birikmis`e aktarılan son söz; bütünüyle geri gelirse geri alınır. */
  let korunan = ''

  /** `start` çağrıldı ve yerli kapanış (stopped/ready) henüz gelmedi. */
  let yerliAktif = false
  /** Etkin yerli oturumun kimliği; `startingListening`e kadar `null`. */
  let yerliKimlik: number | null = null
  let segmentHatasi: SegmentHatasi | null = null
  let segmentBasi = 0
  let segmentSozu = false
  let yerliKapaninca: (() => void) | null = null

  let durdurmaZamanlayici: ReturnType<typeof setTimeout> | undefined
  let tavanZamanlayici: ReturnType<typeof setTimeout> | undefined
  let yenidenZamanlayici: ReturnType<typeof setTimeout> | undefined
  let hataZamanlayici: ReturnType<typeof setTimeout> | undefined

  const tavaniKur = () => {
    clearTimeout(tavanZamanlayici)
    tavanZamanlayici = setTimeout(durdur, EN_UZUN_SURE_MS)
  }

  const basladiBildir = () => {
    if (basladi || kapandi) return
    basladi = true
    tavaniKur()
    secenek.onBasladi?.()
  }

  const oturumuKapat = (kod?: SesHataKodu) => {
    if (kapandi) return
    kapandi = true
    for (const z of [durdurmaZamanlayici, tavanZamanlayici, yenidenZamanlayici, hataZamanlayici]) clearTimeout(z)
    const metin = metinBirlestir(birikmis, ara)
    if (kod && !metin) reddet(new SesHatasi(kod))
    else coz(metin)
    void yerliyiBirak()
  }

  /** Metin arayüze hemen verilir; kilit ise yerli oturum gerçekten kapanınca açılır. */
  const yerliyiBirak = async () => {
    if (yerliAktif) {
      const kapanis = new Promise<void>((tamam) => {
        yerliKapaninca = tamam
        setTimeout(tamam, KILIT_ZAMAN_ASIMI_MS)
      })
      SpeechRecognition.forceStop({ timeout: 0 }).catch(() => {})
      await kapanis
    }
    for (const dinleyici of dinleyiciler) await dinleyici.remove().catch(() => {})
    kilidiAc()
  }

  const segmentBitti = (kimlik: number | undefined) => {
    if (!yerliAktif) return
    if (kimlik !== undefined && kimlik !== yerliKimlik) return
    yerliAktif = false
    yerliKimlik = null
    clearTimeout(hataZamanlayici)
    yerliKapaninca?.()
    if (kapandi) return

    birikmis = metinBirlestir(birikmis, ara)
    ara = ''
    if (kullaniciDurdurdu) {
      oturumuKapat()
      return
    }
    const karar = segmentKarari({ hata: segmentHatasi, sozGeldi: segmentSozu, sureMs: Date.now() - segmentBasi })
    if (karar.tur === 'hata') oturumuKapat(karar.kod)
    else yenidenZamanlayici = setTimeout(() => void segmentBaslat(), karar.gecikmeMs)
  }

  const segmentBaslat = async () => {
    if (kapandi) return
    segmentHatasi = null
    segmentSozu = false
    korunan = ''
    segmentBasi = Date.now()
    yerliAktif = true
    yerliKimlik = null
    try {
      await SpeechRecognition.start(BASLATMA_SECENEKLERI)
    } catch (hata) {
      // Aynı hata olay olarak da gelmişse segment zaten kapanmıştır.
      if (!yerliAktif) return
      segmentHatasi ??= baslatmaReddiniCoz(hata)
      segmentBitti(undefined)
    }
  }

  const araYaz = (adaylar: string[]) => {
    const yeni = enIyiAdayiSec(adaylar.filter((a) => a.trim()))
    if (!yeni.trim()) return
    const simdi = Date.now()
    if (araMetinSifirlandiMi(ara, yeni, simdi - sonAraZamani)) {
      birikmis = metinBirlestir(birikmis, ara)
      korunan = ara
    } else if (korunan) {
      // Tanıyıcı sıfırladığı sözü sonradan bütünüyle geri verirse çift yazılmasın.
      const k = karsilastirmaSozcukleri(korunan)
      const y = karsilastirmaSozcukleri(yeni)
      if (k.every((sozcuk, i) => sozcuk === y[i])) {
        birikmis = birikmis.slice(0, birikmis.length - korunan.trim().length).trim()
        korunan = ''
      }
    }
    ara = yeni
    sonAraZamani = simdi
    segmentSozu = true
    secenek.onKismi(metinBirlestir(birikmis, ara))
  }

  function durdur() {
    if (kullaniciDurdurdu || kapandi) return
    kullaniciDurdurdu = true
    if (!yerliAktif) {
      oturumuKapat()
      return
    }
    durdurmaZamanlayici = setTimeout(() => oturumuKapat(), DURDURMA_ZAMAN_ASIMI_MS)
    // Android'de stop() promise'i dönmeyebilir; kapanış olayı ya da zaman aşımı sonlandırır.
    SpeechRecognition.stop().catch(() => {})
  }

  void (async () => {
    await baslamaKilidi
    if (kapandi) return
    try {
      const uygunluk = await SpeechRecognition.available()
      if (!uygunluk.available) {
        oturumuKapat('servis-yok')
        return
      }
      dinleyiciler.push(
        await SpeechRecognition.addListener('partialResults', (olay) => {
          if (kapandi || !yerliAktif) return
          if (olay.matches) araYaz(olay.matches)
        }),
      )
      dinleyiciler.push(
        await SpeechRecognition.addListener('listeningState', (olay) => {
          if (olay.state === 'startingListening' || olay.state === 'started') {
            if (!yerliAktif) return
            if (olay.state === 'startingListening') yerliKimlik = olay.sessionId ?? null
            else if (olay.sessionId === undefined || olay.sessionId === yerliKimlik) basladiBildir()
          } else if (olay.state === 'stopped' || olay.status === 'stopped') {
            segmentBitti(olay.sessionId)
          }
        }),
      )
      dinleyiciler.push(
        await SpeechRecognition.addListener('readyForNextSession', (olay) => segmentBitti(olay.sessionId)),
      )
      dinleyiciler.push(
        await SpeechRecognition.addListener('error', (olay) => {
          if (kapandi || !yerliAktif) return
          if (olay.sessionId !== undefined && olay.sessionId !== yerliKimlik) return
          // Segmenti hata değil ardından gelen kapanış bitirir; yoksa yerli oturum
          // hâlâ açıkken yeniden başlatılırdı.
          segmentHatasi = yerliHatayiCoz(olay.code)
          clearTimeout(hataZamanlayici)
          hataZamanlayici = setTimeout(() => {
            SpeechRecognition.forceStop({ timeout: 0 }).catch(() => {})
            segmentBitti(undefined)
          }, HATA_SONRASI_KAPANIS_MS)
        }),
      )
      if (kapandi) {
        for (const dinleyici of dinleyiciler) await dinleyici.remove().catch(() => {})
        return
      }
      tavaniKur()
      await segmentBaslat()
    } catch {
      oturumuKapat('baslatilamadi')
    }
  })()

  return { bitti, durdur }
}

/** Web Speech hata adını arayüz koduna çevirir. */
function tarayiciHatasiniCoz(ad: string): SegmentHatasi {
  switch (ad) {
    case 'no-speech':
      return { kod: 'sessizlik', gecici: true }
    case 'not-allowed':
      return { kod: 'izin', gecici: false }
    // İzin verilmiş olsa da servis kapalı: Safari'de Siri/Dikte kapalı, Brave'de hiç yok.
    case 'service-not-allowed':
      return { kod: 'servis-yok', gecici: false }
    case 'audio-capture':
      return { kod: 'mikrofon-yok', gecici: false }
    case 'network':
      return { kod: 'ag', gecici: false }
    case 'language-not-supported':
      return { kod: 'dil', gecici: false }
    // Başka sekme/uygulama mikrofonu aldığında ve Safari'de yönlendirme değişince gelir.
    case 'aborted':
      return { kod: 'mesgul', gecici: true }
    default:
      return { kod: 'baslatilamadi', gecici: true }
  }
}

/** Tarayıcı sonuç listesini tek metne çevirir; `bilinen` her satırın son dolu hâlini tutar. */
function tarayiciSonucunuOku(liste: TarayiciKonusmaSonucListesi, bilinen: string[]): string {
  const androidMi = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent ?? '')
  const parcalar: { metin: string; kumulatif: boolean }[] = []
  for (let i = 0; i < liste.length; i++) {
    const sonuc = liste[i]
    if (!sonuc) continue
    const adaylar: string[] = []
    for (let j = 0; j < sonuc.length; j++) {
      const metin = sonuc[j]?.transcript.trim()
      if (metin) adaylar.push(metin)
    }
    // Safari satırı boş kesin sonuçla kapatabiliyor; eldeki ara metin silinmesin.
    const metin = enIyiAdayiSec(adaylar) || (bilinen[i] ?? '')
    if (!metin) continue
    bilinen[i] = metin
    // Android Chrome aynı sözün büyüyen hâllerini güveni 0 olan ayrı "kesin"
    // satırlar olarak yollar; birleştirilirse sayılar katlanır.
    const onceki = parcalar[parcalar.length - 1]
    if (onceki?.kumulatif && (metin === onceki.metin || metin.startsWith(`${onceki.metin} `))) parcalar.pop()
    parcalar.push({ metin, kumulatif: androidMi && sonuc.isFinal && sonuc[0]?.confidence === 0 })
  }
  return parcalar.map((p) => p.metin).join(' ')
}

/** Tarayıcıda ses dinleme oturumu (Web Speech API). */
function tarayicidaDinle(secenek: DinlemeSecenegi): Dinleme {
  let coz: (metin: string) => void = () => {}
  let reddet: (hata: SesHatasi) => void = () => {}
  const bitti = new Promise<string>((c, r) => {
    coz = c
    reddet = r
  })

  const Sinif = tarayiciSesSinifi()
  const segmentKarari = segmentSayaci()
  let kullaniciDurdurdu = false
  let kapandi = false
  let basladi = false
  let birikmis = ''
  let ara = ''
  let tanima: TarayiciSpeechRecognition | null = null
  let durdurmaZamanlayici: ReturnType<typeof setTimeout> | undefined
  let tavanZamanlayici: ReturnType<typeof setTimeout> | undefined
  let yenidenZamanlayici: ReturnType<typeof setTimeout> | undefined

  const tanimayiBirak = () => {
    const eski = tanima
    tanima = null
    if (!eski) return
    eski.onstart = eski.onresult = eski.onerror = eski.onend = null
    try {
      eski.abort()
    } catch {}
  }

  const oturumuKapat = (kod?: SesHataKodu) => {
    if (kapandi) return
    kapandi = true
    for (const z of [durdurmaZamanlayici, tavanZamanlayici, yenidenZamanlayici]) clearTimeout(z)
    if (aktifTarayiciOturumunuKapat === vazgec) aktifTarayiciOturumunuKapat = null
    tanimayiBirak()
    const metin = metinBirlestir(birikmis, ara)
    if (kod && !metin) reddet(new SesHatasi(kod))
    else coz(metin)
  }
  const vazgec = () => oturumuKapat()

  const tavaniKur = () => {
    clearTimeout(tavanZamanlayici)
    tavanZamanlayici = setTimeout(durdur, EN_UZUN_SURE_MS)
  }

  const segmentBaslat = () => {
    if (kapandi || !Sinif) return
    const segmentBasi = Date.now()
    const bilinen: string[] = []
    let hata: SegmentHatasi | null = null
    let sozGeldi = false
    let bittiMi = false

    const segmentBitti = () => {
      if (bittiMi || kapandi) return
      bittiMi = true
      tanimayiBirak()
      birikmis = metinBirlestir(birikmis, ara)
      ara = ''
      if (kullaniciDurdurdu) {
        oturumuKapat()
        return
      }
      const karar = segmentKarari({ hata, sozGeldi, sureMs: Date.now() - segmentBasi })
      if (karar.tur === 'hata') oturumuKapat(karar.kod)
      else yenidenZamanlayici = setTimeout(segmentBaslat, karar.gecikmeMs)
    }

    const basladiBildir = () => {
      if (basladi) return
      basladi = true
      // İzin penceresinde geçen süre dinleme süresinden sayılmaz.
      tavaniKur()
      secenek.onBasladi?.()
    }

    try {
      const yeni = new Sinif()
      tanima = yeni
      yeni.continuous = true
      yeni.interimResults = true
      yeni.lang = 'tr-TR'
      yeni.maxAlternatives = 5
      yeni.onstart = basladiBildir
      yeni.onresult = (olay) => {
        const metin = tarayiciSonucunuOku(olay.results, bilinen)
        if (!metin) return
        sozGeldi = true
        ara = metin
        secenek.onKismi(metinBirlestir(birikmis, ara))
      }
      // Hata tek başına oturumu kapatmaz: ardından `onend` gelir, karar orada verilir.
      yeni.onerror = (olay) => {
        hata = tarayiciHatasiniCoz(olay.error?.toLowerCase() ?? '')
        // Kalıcı hatada bazı tarayıcılar `onend` yollamaz; arayüz asılı kalmasın.
        if (!hata.gecici) segmentBitti()
      }
      yeni.onend = segmentBitti
      yeni.start()
    } catch {
      hata = { kod: 'baslatilamadi', gecici: true }
      segmentBitti()
    }
  }

  function durdur() {
    if (kullaniciDurdurdu || kapandi) return
    kullaniciDurdurdu = true
    if (!tanima) {
      oturumuKapat()
      return
    }
    durdurmaZamanlayici = setTimeout(() => oturumuKapat(), DURDURMA_ZAMAN_ASIMI_MS)
    try {
      tanima.stop()
    } catch {
      oturumuKapat()
    }
  }

  if (!Sinif) {
    oturumuKapat('servis-yok')
  } else {
    aktifTarayiciOturumunuKapat?.()
    aktifTarayiciOturumunuKapat = vazgec
    tavaniKur()
    segmentBaslat()
  }

  return { bitti, durdur }
}
