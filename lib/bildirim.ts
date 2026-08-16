'use client'

import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

/**
 * Yerel bildirimler. Tarayıcıda (npm run dev) eklenti yok; bütün çağrılar
 * sessizce boşa düşer ki geliştirme sırasında hata fırlamasın.
 */

/** Pomodoro seans bitişi. Her seans yeniden planlandığı için tek kimlik yeter. */
const POMODORO_ID = 1

function eklentiVar(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('LocalNotifications')
}

/**
 * Bildirim iznini ister. Android 13+ POST_NOTIFICATIONS izni olmadan bildirim
 * gösterilmiyor; izin verilmezse uygulama çalışmaya devam eder.
 */
export async function izinIste(): Promise<boolean> {
  if (!eklentiVar()) return false
  try {
    const mevcut = await LocalNotifications.checkPermissions()
    if (mevcut.display === 'granted') return true
    const sonuc = await LocalNotifications.requestPermissions()
    return sonuc.display === 'granted'
  } catch {
    return false
  }
}

export async function izinVarMi(): Promise<boolean> {
  if (!eklentiVar()) return false
  try {
    return (await LocalNotifications.checkPermissions()).display === 'granted'
  } catch {
    return false
  }
}

/**
 * Seans bitiminde çalacak bildirimi kurar. Uygulama arka plandayken de zil
 * çalsın diye; uygulama önde bitirirse `pomodoroIptal` ile geri alınır.
 */
export async function pomodoroPlanla(bitisZamani: number, mola: boolean) {
  if (!(await izinVarMi())) return
  // Geçmişe planlama Android'de anında tetiklenir; bir saniyelik pay bırakılıyor.
  if (bitisZamani - Date.now() < 1000) return

  try {
    await LocalNotifications.cancel({ notifications: [{ id: POMODORO_ID }] })
    await LocalNotifications.schedule({
      notifications: [
        {
          id: POMODORO_ID,
          title: mola ? 'Mola bitti' : 'Seans bitti',
          body: mola
            ? 'Molan doldu. Hazırsan bir tur daha? 🐰'
            : 'Bir pomodoro tamamlandı. Biraz ara ver. 🐰',
          schedule: { at: new Date(bitisZamani) },
        },
      ],
    })
  } catch {
    // Bildirim kurulamasa da sayaç çalışmaya devam etsin.
  }
}

export async function pomodoroIptal() {
  if (!eklentiVar()) return
  try {
    await LocalNotifications.cancel({ notifications: [{ id: POMODORO_ID }] })
  } catch {
    // yoksay
  }
}
