'use client'

import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import { PLANLANAN_GUN, hatirlatmaPlanlari } from './hatirlatma'
import { gorevBildirimPlanlari, gorevBildirimiMi } from './gorev-bildirimi'
import type { Gorev } from './yapilacaklar'

/**
 * Yerel bildirimler. Tarayıcıda (npm run dev) eklenti yok; bütün çağrılar
 * sessizce boşa düşer ki geliştirme sırasında hata fırlamasın.
 */

/** Pomodoro seans bitişi. Her seans yeniden planlandığı için tek kimlik yeter. */
const POMODORO_ID = 1

/**
 * Günlük hatırlatmaların kimlikleri: 2'den başlayıp her güne bir tane.
 *
 * Kimlikler sabit bir aralıkta: her planlama bütün aralığı silip yeniden
 * kuruyor, böylece aynı güne iki hatırlatma düşmüyor. İlk kimlik 2 kalıyor —
 * eski sürümün tek hatırlatması o kimlikteydi ve ilk planlamada o da siliniyor.
 */
const HATIRLATMA_ILK_ID = 2
const HATIRLATMA_IDLERI = Array.from({ length: PLANLANAN_GUN }, (_, i) => ({
  id: HATIRLATMA_ILK_ID + i,
}))

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
            ? 'Hazırsan bir tur daha? 🐰'
            : 'Biraz ara ver. 🐰',
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
 * Günlük hatırlatmaları kurar.
 *
 * **Günde en fazla bir bildirim** kuralı buradan geliyor: tekrarlayan bildirim
 * kurulmuyor, önümüzdeki her güne ayrı bir bildirim planlanıyor ve eskileri
 * iptal ediliyor. Uygulama her açıldığında yeniden çağrıldığı için, kullanıcı
 * o gün soru girdiyse bugünkü bildirim düşüyor.
 *
 * `Local Notifications` eklentisinin `repeats: true` seçeneği kullanılmadı:
 * tekrarlayan bir bildirimin yalnızca **bugünkü** örneğini iptal etmenin yolu
 * yok, dolayısıyla "bugün girdiysen sesini çıkarma" davranışı kurulamazdı.
 * Günleri ayrı ayrı planlamak aynı işi görüyor ve bugünkünü silebiliyor.
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

  const planlar = hatirlatmaPlanlari(simdi, saat, dakika, bugunGirdiVar)

  try {
    await LocalNotifications.cancel({ notifications: HATIRLATMA_IDLERI })
    await LocalNotifications.schedule({
      notifications: planlar.map(({ zaman, baslik, metin }, i) => ({
        id: HATIRLATMA_ILK_ID + i,
        title: baslik,
        body: metin,
        ...GORUNUS,
        schedule: {
          at: zaman,
          // Tam saatli alarm istenmiyor: günlük hatırlatmada dakika hassasiyeti
          // gereksiz, karşılığında SCHEDULE_EXACT_ALARM gerekçesi gerekiyor.
          allowWhileIdle: false,
        },
      })),
    })
  } catch {
    // Bildirim kurulamasa da uygulama çalışmaya devam etsin.
  }
}

export async function hatirlatmaIptal() {
  if (!eklentiVar()) return
  try {
    await LocalNotifications.cancel({ notifications: HATIRLATMA_IDLERI })
  } catch {
    // yoksay
  }
}

/** Yerel bildirim bu ortamda var mı — tarayıcıda (geliştirme, web) yok. */
export function bildirimDestekleniyor(): boolean {
  return eklentiVar()
}

/**
 * Görev hatırlatmalarını kayıttan baştan kurar: telefonda bekleyen bütün görev
 * bildirimleri silinip `gorevBildirimPlanlari`nın listesi yazılıyor.
 *
 * Silinecekler bekleyen listeden **kimlik aralığıyla** bulunuyor
 * (`gorevBildirimiMi`), bellekteki eski planla değil: uygulama kapanıp
 * açıldığında bellek boş, ama telefonda silinmiş bir görevin bildirimi
 * duruyor olabilir. Pomodoro ve günlük hatırlatma aralığın dışında kalıyor.
 *
 * Çağrılar sıraya giriyor: üst üste iki değişiklikte ikinci eşitleme
 * birincinin silmesiyle yazması arasına girseydi, eski listenin bildirimi
 * yenisinin üstüne yazılıp silinmiş bir görevi hatırlatabilirdi.
 */
let gorevSirasi: Promise<void> = Promise.resolve()

export function gorevBildirimleriniEsitle(
  gorevler: readonly Gorev[],
  acik: boolean,
  simdi: () => Date = () => new Date(),
): Promise<void> {
  if (!eklentiVar()) return Promise.resolve()
  gorevSirasi = gorevSirasi.then(() => gorevleriEsitle(gorevler, acik, simdi()))
  return gorevSirasi
}

async function gorevleriEsitle(gorevler: readonly Gorev[], acik: boolean, simdi: Date) {
  try {
    const bekleyen = await LocalNotifications.getPending()
    const eskiler = bekleyen.notifications
      .map((b) => Number(b.id))
      .filter(gorevBildirimiMi)
      .map((id) => ({ id }))
    if (eskiler.length > 0) await LocalNotifications.cancel({ notifications: eskiler })

    // İzin yoksa sistem penceresi burada açılmıyor: izin, saat girilen
    // görevde soruluyor (`gorevIzniIste`), arka planda değil.
    if (!acik || !(await izinVarMi())) return
    const planlar = gorevBildirimPlanlari(gorevler, simdi)
    if (planlar.length === 0) return
    await LocalNotifications.schedule({
      notifications: planlar.map(({ id, gorevId, zaman, baslik, metin }) => ({
        id,
        title: baslik,
        body: metin,
        ...GORUNUS,
        // Dokununca hangi göreve gidileceği (`AppShell`). Pomodoro işareti
        // burada değil kayıtta okunuyor: bildirim kurulduktan sonra
        // değişmiş olabilir.
        extra: { gorevId },
        schedule: {
          at: zaman,
          // Günlük hatırlatmadan farklı olarak dakika önemli: "5 dakika
          // sonra" diyen bildirim telefon uykudayken yarım saat gecikirse
          // anlamını yitirir. Bu bayrak ek izin istemiyor.
          allowWhileIdle: true,
        },
      })),
    })
  } catch {
    // Bildirim kurulamasa da görev listesi çalışmaya devam etsin.
  }
}

/**
 * Saat girilen görevde bildirim izni. `null`: bu ortamda bildirim yok (web),
 * form hiçbir şey göstermiyor. `false`: izin verilmedi, formda küçük bir not.
 */
export async function gorevIzniIste(): Promise<boolean | null> {
  if (!eklentiVar()) return null
  return izinIste()
}

/** Bildirime dokunuş: görev bildirimiyse görevin kimliğini verir. */
export function bildirimDokunusunuDinle(
  gorevBildirimi: (gorevId: string) => void,
): () => void {
  if (!eklentiVar()) return () => {}
  const dinleyici = LocalNotifications.addListener('localNotificationActionPerformed', (olay) => {
    const gorevId = (olay.notification.extra as { gorevId?: unknown } | undefined)?.gorevId
    if (typeof gorevId === 'string' && gorevId !== '') gorevBildirimi(gorevId)
  })
  return () => {
    void dinleyici.then((d) => d.remove())
  }
}
