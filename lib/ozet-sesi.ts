'use client'

/**
 * Haftalık özetin sesleri.
 *
 * Hepsi Web Audio ile üretiliyor. Mini oyunun doğru/yanlış sesleri dosyaya
 * çevrilmişti çünkü orada ses **geri bildirim** — cevabın doğru mu yanlış mı
 * olduğunu anlatıyor ve net duyulması gerekiyor. Burada ses **ritim**: kart
 * geçişini işaretliyor, kısa ve arka planda kalmalı. Dosya kullanmak hem
 * gereksiz yer kaplar hem de her geçişte aynı sesin çalınması sıkıcı olur —
 * üretilen ton, kart sırasına göre yükselebiliyor.
 */

let baglam: AudioContext | null = null

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

type Nota = {
  frekans: number
  gecikme: number
  sure: number
  seviye?: number
  bicim?: OscillatorType
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

    osilator.type = nota.bicim ?? 'sine'
    osilator.frequency.setValueAtTime(nota.frekans, baslangic)

    zarf.gain.setValueAtTime(0.0001, baslangic)
    zarf.gain.exponentialRampToValueAtTime(nota.seviye ?? 0.32, baslangic + 0.014)
    zarf.gain.exponentialRampToValueAtTime(0.0001, bitis)

    osilator.connect(zarf)
    zarf.connect(ctx.destination)
    osilator.start(baslangic)
    osilator.stop(bitis + 0.02)
  }
}

/** Pentatonik dizi: hangi ikisi arka arkaya çalarsa çalsın kulağa hoş geliyor. */
const DIZI = [523, 587, 659, 784, 880, 1046, 1174, 1318]

/**
 * Kart geçişi. `basamak` kartın sırası: özet ilerledikçe ton yükseliyor, böylece
 * sonuna doğru yaklaşıldığı duyuluyor. Dizinin sonuna gelince başa dönüyor.
 */
export function kartSesi(basamak: number) {
  cal([{ frekans: DIZI[basamak % DIZI.length], gecikme: 0, sure: 0.16, seviye: 0.26 }])
}

/**
 * Geri sayım vuruşu — 3., 2., 1. ders kartları.
 * `sira` 3'ten 1'e iner; ton her adımda yükselerek gerilim kuruyor.
 */
export function geriSayimSesi(sira: 3 | 2 | 1) {
  const temel = { 3: 523, 2: 659, 1: 880 }[sira]
  cal([
    { frekans: temel, gecikme: 0, sure: 0.13, seviye: 0.3 },
    { frekans: temel * 1.5, gecikme: 0.09, sure: 0.22, seviye: 0.3 },
  ])
}

/** Birinciliğin açılışı: yükselen dört nota. */
export function zaferSesi() {
  cal([
    { frekans: 523, gecikme: 0, sure: 0.13 },
    { frekans: 659, gecikme: 0.11, sure: 0.13 },
    { frekans: 784, gecikme: 0.22, sure: 0.15 },
    { frekans: 1046, gecikme: 0.35, sure: 0.5, seviye: 0.36 },
  ])
}

/** Özetin kapanışı — zafer sesinin daha geniş hâli. */
export function kapanisSesi() {
  cal([
    { frekans: 784, gecikme: 0, sure: 0.16 },
    { frekans: 988, gecikme: 0.14, sure: 0.16 },
    { frekans: 1174, gecikme: 0.28, sure: 0.16 },
    { frekans: 1568, gecikme: 0.42, sure: 0.7, seviye: 0.34 },
  ])
}

/** Ayardaki ses tercihine bakan sarmalayıcı — kapalıyken hiç bağlam kurulmuyor. */
export function ozetSesiCal(calAn: () => void, acik: boolean) {
  if (!acik) return
  calAn()
}
