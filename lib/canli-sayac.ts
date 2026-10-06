import { registerPlugin } from '@capacitor/core'
import type { PomodoroKomutu } from './odak-kilidi'
import { iosMu } from './platform'

/**
 * iOS'ta Pomodoro sayacının kilit ekranı ve Dynamic Island hâli (Live
 * Activity). Yerli taraf `ios/App/App/CanliSayacEklentisi.swift`, çizim
 * `ios/App/KilitSayaci`.
 *
 * Android'de aynı işi odak kilidinin ön plan servisi yapıyor ve o servis her
 * turda zaten kuruluyor; iOS'ta ön plan servisi yok, sayaç ayrı bir eklenti.
 * Çağıran yer de o yüzden `lib/odak-kilidi.ts`: Pomodoro iki platform için
 * aynı üç fonksiyonu çağırıyor.
 *
 * Hatalar yutuluyor: kilit ekranındaki kart yalnızca gösterim, tur ona bağlı
 * değil. Kullanıcı Rabi'nin canlı etkinliklerini Ayarlar'dan kapattıysa da tur
 * çalışıyor.
 */

type Eklenti = {
  baslat(secenekler: {
    bitisZamani: number
    toplamSaniye?: number
    asama?: string
    ders?: string
    mola: boolean
    kilitAcik: boolean
  }): Promise<{ basladi: boolean }>
  duraklat(): Promise<void>
  bitir(): Promise<void>
  addListener(
    olay: 'pomodoroKomutu',
    dinleyici: (veri: PomodoroKomutu) => void,
  ): Promise<{ remove: () => Promise<void> }>
}

const eklenti = registerPlugin<Eklenti>('CanliSayac')

export async function canliSayacBaslat(secenekler: {
  bitisZamani: number
  toplamSaniye?: number
  asama?: string
  ders?: string
  mola: boolean
  kilitAcik: boolean
}): Promise<void> {
  if (!iosMu()) return
  try {
    await eklenti.baslat(secenekler)
  } catch {
    // Kart çıkmadı; sayaç uygulamada çalışıyor.
  }
}

/** Kart kalmıyor, donuyor: duraklatılmış tur da kilit ekranında görünmeli. */
export async function canliSayacDuraklat(): Promise<void> {
  if (!iosMu()) return
  try {
    await eklenti.duraklat()
  } catch {
    // Kart zaten yok.
  }
}

export async function canliSayacBitir(): Promise<void> {
  if (!iosMu()) return
  try {
    await eklenti.bitir()
  } catch {
    // Kart zaten yok.
  }
}

/** Kilit ekranındaki düğmeye basıldı — Android'deki bildirim düğmesinin eşi. */
export async function canliSayacKomutuGelince(
  dinleyici: (veri: PomodoroKomutu) => void,
): Promise<() => void> {
  if (!iosMu()) return () => {}
  try {
    const kayit = await eklenti.addListener('pomodoroKomutu', dinleyici)
    return () => {
      void kayit.remove()
    }
  } catch {
    return () => {}
  }
}
