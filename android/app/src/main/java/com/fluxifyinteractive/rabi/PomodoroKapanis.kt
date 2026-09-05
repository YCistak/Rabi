package com.fluxifyinteractive.rabi

import android.app.AlarmManager
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.capacitorjs.plugins.localnotifications.TimedNotificationPublisher
import com.fluxifyinteractive.rabi.odak.OdakServisi

/**
 * Uygulama **kapatılınca** pomodoro turundan geriye kalanları toplar.
 *
 * Aşağıya alınca sayaç devam etmeli — ekran kapalıyken de çalışabilmek
 * pomodoronun bütün anlamı. Ama görev listesinden silinince (ya da geri tuşuyla
 * çıkılınca) tur bitmiş sayılır: web tarafındaki sayaç zaten süreçle birlikte
 * ölüyor, geriye iki şey kalıyordu ve ikisi de kullanıcıya "sayaç arkadan
 * işlemeye devam ediyor" gibi görünüyordu:
 *
 * - Bekleyen "seans bitti" bildirimi. `AlarmManager`'a kurulu; süreç ölse de
 *   saati gelince çalıyor.
 * - Odak kilidinin ön plan servisi. Uygulama kapalıyken bile uygulamaları
 *   engellemeye ve kalan dakikayı yazmaya devam ediyordu.
 *
 * Çağrı noktaları: `MainActivity.onDestroy` (geri tuşu, görev silme) ve
 * `OdakServisi.onTaskRemoved` (servis ayaktayken görev silme — etkinlik
 * `onDestroy` almadan öldürülebiliyor, bu ikinci yol garantisi).
 */
object PomodoroKapanis {

    /**
     * `lib/bildirim.ts` içindeki `POMODORO_ID` ile aynı olmak zorunda; iki taraf
     * da aynı bildirimi kastediyor.
     */
    private const val BILDIRIM_ID = 1

    @JvmStatic
    fun temizle(baglam: Context) {
        bekleyenBildirimiIptalEt(baglam)
        OdakServisi.durdur(baglam)
    }

    /**
     * Capacitor'ın kurduğu alarmı iptal eder.
     *
     * Eklentinin kendi `cancel` yolu JavaScript'ten geçiyor, süreç ölürken orası
     * çalışmıyor. Bu yüzden eklentinin `cancelTimerForNotification` işlevi
     * birebir tekrarlanıyor: aynı `requestCode` ve aynı hedef sınıfla kurulan
     * `PendingIntent` bulunup iptal ediliyor. Eklenti yükseltilirse bu sınıf adı
     * değişebilir — o zaman derleme hata verir, sessizce bozulmaz.
     */
    private fun bekleyenBildirimiIptalEt(baglam: Context) {
        val niyet = Intent(baglam, TimedNotificationPublisher::class.java)
        var bayraklar = PendingIntent.FLAG_NO_CREATE
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            bayraklar = bayraklar or PendingIntent.FLAG_MUTABLE
        }
        val bekleyen = PendingIntent.getBroadcast(baglam, BILDIRIM_ID, niyet, bayraklar)
        if (bekleyen != null) {
            val alarm = baglam.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            alarm?.cancel(bekleyen)
            bekleyen.cancel()
        }
        // Bildirim çoktan düşmüşse gölgeden de kaldırılıyor: kapalı uygulamanın
        // bildirimi ekranda durmasın.
        val bildirimler = baglam.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        bildirimler?.cancel(BILDIRIM_ID)
    }
}
