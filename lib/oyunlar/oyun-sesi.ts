'use client'

/**
 * Mini oyun ses efektleri.
 *
 * Sesler dosyadan değil **Web Audio ile üretiliyor**: üçü de birkaç yüz
 * milisaniyelik basit tonlar, mp3 karşılıkları APK'ya boşuna yüz kilobayt
 * eklerdi (uygulama zaten lo-fi müzikle 23 MB). Üretilen ton ayrıca gecikmesiz
 * çalıyor — dosya ilk çalışta yükleneceği için ilk doğru cevabın sesi geç gelirdi.
 *
 * `AudioContext` tarayıcı kuralı gereği kullanıcı etkileşimi olmadan
 * başlatılamıyor; oyunda ilk ses zaten bir dokunuştan sonra çaldığı için sorun
 * çıkmıyor, yine de başarısız olursa sessizce geçiliyor — ses efekti oyunun
 * çalışmasının şartı değil.
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
    const seviye = nota.seviye ?? 0.18

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

/** Doğru cevap: kısa, yukarı çıkan iki nota. */
export function dogruSesi() {
  cal([
    { frekans: 880, gecikme: 0, sure: 0.09 },
    { frekans: 1318, gecikme: 0.075, sure: 0.13 },
  ])
}

/**
 * Yanlış cevap: aşağı kayan tek, boğuk ton.
 *
 * Bilerek kısa ve alçak: sert bir "hata" sesi, sürekli çalışılan bir uygulamada
 * kısa sürede rahatsız edici olur ve oyuncuyu denemekten caydırır.
 */
export function yanlisSesi() {
  cal([
    { frekans: 320, hedefFrekans: 150, gecikme: 0, sure: 0.26, bicim: 'triangle', seviye: 0.2 },
  ])
}

/** Tur bitişi: üç notalık küçük bir kapanış. */
export function bitisSesi() {
  cal([
    { frekans: 784, gecikme: 0, sure: 0.14 },
    { frekans: 988, gecikme: 0.12, sure: 0.14 },
    { frekans: 1318, gecikme: 0.24, sure: 0.34, seviye: 0.2 },
  ])
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
