'use client'

/**
 * Mini oyun ses efektleri.
 *
 * Doğru ve yanlış sesleri `public/ses/oyun/` altındaki kısa mp3'ler (ikisi
 * birlikte ~35 KB). Önceden üretilmiş tonlar kullanılıyordu; kullanıcı
 * "cılız kalıyor" dedi — sentetik sinüs tonu, telefonun hoparlöründe gerçek
 * bir efektin yanında hep zayıf duyulur.
 *
 * Dosyalar `decodeAudioData` ile **bir kez** çözülüp bellekte tutuluyor:
 * `new Audio()` ile her çalışta yeni bir eleman kurmak Android WebView'da
 * gözle görülür bir gecikme yaratıyor ve arka arkaya gelen cevaplarda ses
 * kırpılıyordu. Çözülmüş tampon (buffer) her seferinde anında ve üst üste
 * çalabiliyor.
 *
 * Tur bitiş sesi hâlâ üretiliyor: kullanıcı bunun için bir dosya vermedi ve
 * turda yalnızca bir kez çalıyor.
 *
 * `AudioContext` tarayıcı kuralı gereği kullanıcı etkileşimi olmadan
 * başlatılamıyor; oyunda ilk ses zaten bir dokunuştan sonra çaldığı için sorun
 * çıkmıyor, yine de başarısız olursa sessizce geçiliyor — ses efekti oyunun
 * çalışmasının şartı değil.
 */

/** Dosyaların ses seviyesi. Dosyalar tepe noktası −1 dB olacak şekilde
 *  ayarlandı; burada 1'in altına inmek onları yeniden kısmak olur. */
const DOSYA_SEVIYESI = 1

const DOSYALAR = {
  dogru: './ses/oyun/dogru.mp3',
  yanlis: './ses/oyun/yanlis.mp3',
} as const

type DosyaliSes = keyof typeof DOSYALAR

let baglam: AudioContext | null = null
const tamponlar = new Map<DosyaliSes, AudioBuffer>()
/** Aynı dosya için ikinci bir indirme başlatmamak üzere tutuluyor. */
const yuklemeler = new Map<DosyaliSes, Promise<void>>()

function baglamAl(): AudioContext | null {
  if (baglam) return baglam
  if (typeof window === 'undefined') return null
  try {
    const Yapici =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Yapici) return null
    baglam = new Yapici()
  } catch {
    return null
  }
  return baglam
}

function yukle(tur: DosyaliSes): Promise<void> {
  const mevcut = yuklemeler.get(tur)
  if (mevcut) return mevcut

  const is = (async () => {
    const ctx = baglamAl()
    if (!ctx) return
    try {
      const cevap = await fetch(DOSYALAR[tur])
      const veri = await cevap.arrayBuffer()
      tamponlar.set(tur, await ctx.decodeAudioData(veri))
    } catch {
      // Dosya okunamadıysa üretilen ton devreye giriyor; sessiz kalmıyoruz.
      yuklemeler.delete(tur)
    }
  })()

  yuklemeler.set(tur, is)
  return is
}

/**
 * Oyun başlarken çağrılır: dosyaları önceden çözer, böylece ilk cevabın sesi
 * gecikmez. Ses kapalıysa hiçbir şey yapmaz — `AudioContext` bile kurulmaz.
 */
export function sesleriHazirla(acik: boolean) {
  if (!acik) return
  void yukle('dogru')
  void yukle('yanlis')
}

function tamponCal(tur: DosyaliSes): boolean {
  const ctx = baglamAl()
  const tampon = tamponlar.get(tur)
  if (!ctx || !tampon) return false

  void ctx.resume().catch(() => {})
  const kaynak = ctx.createBufferSource()
  const kazanc = ctx.createGain()
  kaynak.buffer = tampon
  kazanc.gain.value = DOSYA_SEVIYESI
  kaynak.connect(kazanc)
  kazanc.connect(ctx.destination)
  kaynak.start()
  return true
}

type Nota = {
  frekans: number
  /** Saniye cinsinden, sesin başından itibaren. */
  gecikme: number
  sure: number
  /** Tepe ses seviyesi, 0–1. */
  seviye?: number
  bicim?: OscillatorType
  /** Verilirse ton bu frekansa doğru kayar (düşen "yanlış" sesi için). */
  hedefFrekans?: number
}

function cal(notalar: Nota[]) {
  const ctx = baglamAl()
  if (!ctx) return
  void ctx.resume().catch(() => {})

  for (const nota of notalar) {
    const osilator = ctx.createOscillator()
    const zarf = ctx.createGain()
    const baslangic = ctx.currentTime + nota.gecikme
    const bitis = baslangic + nota.sure
    const seviye = nota.seviye ?? 0.45

    osilator.type = nota.bicim ?? 'sine'
    osilator.frequency.setValueAtTime(nota.frekans, baslangic)
    if (nota.hedefFrekans) {
      osilator.frequency.exponentialRampToValueAtTime(nota.hedefFrekans, bitis)
    }

    // Ani başlangıç/bitiş "tık" sesi çıkarıyor; kısa bir zarf onu yumuşatıyor.
    zarf.gain.setValueAtTime(0.0001, baslangic)
    zarf.gain.exponentialRampToValueAtTime(seviye, baslangic + 0.012)
    zarf.gain.exponentialRampToValueAtTime(0.0001, bitis)

    osilator.connect(zarf)
    zarf.connect(ctx.destination)
    osilator.start(baslangic)
    osilator.stop(bitis + 0.02)
  }
}

/** Doğru cevap dosyası okunamazsa çalan yedek ton. */
function dogruTonu() {
  cal([
    { frekans: 880, gecikme: 0, sure: 0.09 },
    { frekans: 1318, gecikme: 0.075, sure: 0.13 },
  ])
}

/** Yanlış cevap dosyası okunamazsa çalan yedek ton. */
function yanlisTonu() {
  cal([
    { frekans: 320, hedefFrekans: 150, gecikme: 0, sure: 0.26, bicim: 'triangle', seviye: 0.5 },
  ])
}

/** Tur bitişi: üç notalık küçük bir kapanış. */
export function bitisSesi() {
  cal([
    { frekans: 784, gecikme: 0, sure: 0.14 },
    { frekans: 988, gecikme: 0.12, sure: 0.14 },
    { frekans: 1318, gecikme: 0.24, sure: 0.34, seviye: 0.5 },
  ])
}

/** Doğru cevap: mp3 hazırsa o, değilse yedek ton. */
export function dogruSesi() {
  if (tamponCal('dogru')) return
  void yukle('dogru')
  dogruTonu()
}

/** Yanlış cevap: mp3 hazırsa o, değilse yedek ton. */
export function yanlisSesi() {
  if (tamponCal('yanlis')) return
  void yukle('yanlis')
  yanlisTonu()
}

/**
 * Ayardaki açık/kapalı durumuna göre çalan sarmalayıcı.
 *
 * Kapalıyken hiçbir şey yapılmıyor — `AudioContext` bile kurulmuyor, sesi
 * kapatan kullanıcı ses altyapısının açılmasını da beklemez.
 */
export function oyunSesiCal(tur: 'dogru' | 'yanlis' | 'bitis', acik: boolean) {
  if (!acik) return
  if (tur === 'dogru') dogruSesi()
  else if (tur === 'yanlis') yanlisSesi()
  else bitisSesi()
}
