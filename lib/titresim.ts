import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { iosMu } from './platform'

/**
 * Kısa titreşim — yoklama biletinin damgası için.
 *
 * `navigator.vibrate` Android WebView'da çalışıyor ama manifestte VIBRATE
 * izni olmadan sessizce hiçbir şey yapmıyor; izin
 * `android/app/src/main/AndroidManifest.xml`te. Masaüstü tarayıcıda API yok,
 * o yüzden her çağrı korumalı. Süre kısa: uzun bir titreşim bildirim gibi
 * duyulur, buradaki bir dokunuşun karşılığı.
 *
 * iOS'ta `navigator.vibrate` hiç yok; orada Taptic Engine'in kendi "vuruşu"
 * çalıyor. Süre yerine şiddet seçiliyor (iOS süre kabul etmiyor) ve orta
 * vuruş bir damganın basılışına denk: hafifi dokunuş gibi, ağırı çarpma gibi
 * duyuluyor. Android'de ise titreşim telefonun motoruna göre ayarlanmıştı,
 * ona dokunulmadı.
 */
export function titret(ms = 30) {
  if (iosMu()) {
    void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
    return
  }
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(ms)
  } catch {
    // Tarayıcı reddederse (etkileşimsiz sayfa, kısıtlı bağlam) sessiz geçiliyor.
  }
}
