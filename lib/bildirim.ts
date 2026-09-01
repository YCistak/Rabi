'use client'

import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import { hatirlatmaPlani } from './hatirlatma'

/**
 * Yerel bildirimler. Tarayıcıda (npm run dev) eklenti yok; bütün çağrılar
 * sessizce boşa düşer ki geliştirme sırasında hata fırlamasın.
 */

/** Pomodoro seans bitişi. Her seans yeniden planlandığı için tek kimlik yeter. */
const POMODORO_ID = 1

/**
 * Günlük hatırlatma. Aynı kimlik yeniden kullanılıyor: her planlama öncekini
 * eziyor, böylece ortada asla birden fazla bekleyen hatırlatma olmuyor.
 */
const HATIRLATMA_ID = 2

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
 * Bildirimin görünüşü — iki planlayıcı da bunu yayıyor.
 *
 * `smallIcon` şart: verilmezse eklenti uygulama ikonunu kullanıyor ve Android
 * durum çubuğunda **yalnızca alfa kanalını** okuduğu için renkli ikon orada
 * beyaz bir lekeye dönüşüyor — bildirimin hangi uygulamadan geldiği
 * anlaşılmıyordu. `ic_bildirim` bunun için üretilmiş beyaz siluet
 * (`scripts/ikon-uret.mjs`).
 *
 * `largeIcon` ise bildirim panelinde sağda duran **renkli** ikon: siluet
 * uygulamayı tanıtmaya yetmiyor, asıl logo orada görünüyor.
 *
 * `iconColor` siluetin arkasındaki noktayı markanın tonuna boyuyor; Android
 * onu varsayılan olarak sistemin vurgu rengiyle çiziyor.
 */
const GORUNUS = {
  smallIcon: 'ic_bildirim',
  largeIcon: 'ic_launcher',
  iconColor: '#D9622F',
} as const

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
          ...GORUNUS,
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

/**
 * Günlük hatırlatmayı kurar.
 *
 * **Günde en fazla bir bildirim** kuralı buradan geliyor: tekrarlayan bildirim
 * kurulmuyor, her seferinde yalnızca **bir sonraki** hatırlatma planlanıyor ve
 * eskisi iptal ediliyor. Uygulama her açıldığında yeniden çağrıldığı için,
 * kullanıcı o gün soru girdiyse bekleyen bildirim silinip yarına kayıyor.
 *
 * `Local Notifications` eklentisinin `repeats: true` seçeneği kullanılmadı:
 * tekrarlayan bir bildirimin yalnızca **bugünkü** örneğini iptal etmenin yolu
 * yok, dolayısıyla "bugün girdiysen sesini çıkarma" davranışı kurulamazdı.
 */
export async function hatirlatmaPlanla({
  saat,
  dakika,
  bugunGirdiVar,
  simdi = new Date(),
}: {
  saat: number
  dakika: number
  bugunGirdiVar: boolean
  simdi?: Date
}) {
  if (!(await izinVarMi())) return

  const { zaman, baslik, metin } = hatirlatmaPlani(simdi, saat, dakika, bugunGirdiVar)

  try {
    await LocalNotifications.cancel({ notifications: [{ id: HATIRLATMA_ID }] })
    await LocalNotifications.schedule({
      notifications: [
        {
          id: HATIRLATMA_ID,
          title: baslik,
          body: metin,
          ...GORUNUS,
          schedule: {
            at: zaman,
            // Tam saatli alarm istenmiyor: günlük hatırlatmada dakika hassasiyeti
            // gereksiz, karşılığında SCHEDULE_EXACT_ALARM gerekçesi gerekiyor.
            allowWhileIdle: false,
          },
        },
      ],
    })
  } catch {
    // Bildirim kurulamasa da uygulama çalışmaya devam etsin.
  }
}

export async function hatirlatmaIptal() {
  if (!eklentiVar()) return
  try {
    await LocalNotifications.cancel({ notifications: [{ id: HATIRLATMA_ID }] })
  } catch {
    // yoksay
  }
}
