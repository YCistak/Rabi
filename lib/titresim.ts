/**
 * Kısa titreşim — yoklama biletinin damgası için.
 *
 * `navigator.vibrate` Android WebView'da çalışıyor ama manifestte VIBRATE
 * izni olmadan sessizce hiçbir şey yapmıyor; izin
 * `android/app/src/main/AndroidManifest.xml`te. Masaüstü tarayıcıda ve
 * iOS'ta API yok, o yüzden her çağrı korumalı. Süre kısa: uzun bir titreşim
 * bildirim gibi duyulur, buradaki bir dokunuşun karşılığı.
 */
export function titret(ms = 30) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(ms)
  } catch {
    // Tarayıcı reddederse (etkileşimsiz sayfa, kısıtlı bağlam) sessiz geçiliyor.
  }
}
