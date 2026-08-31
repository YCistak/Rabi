package com.rabi.app.odak

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import com.rabi.app.PomodoroKapanis
import kotlin.math.max

/**
 * Çalışma turu boyunca yaşayan ön plan servisi.
 *
 * Neden ön plan servisi: arka planda periyodik çalışma başka türlü mümkün değil,
 * Android sıradan bir servisi dakikalar içinde öldürüyor. Bedeli kalıcı bir
 * bildirim — sistem zorunlu kılıyor, kaçışı yok. Bildirimde kalan süre yazıyor,
 * en azından işe yarıyor.
 *
 * Servis yalnızca **çalışma** turunda yaşar; molada durdurulur — mola molaysa
 * telefona bakabilmeli.
 */
class OdakServisi : Service() {

    private val elciler = Handler(Looper.getMainLooper())
    private var katman: EngelKatmani? = null
    private var yasakli: Set<String> = emptySet()
    private var bitisZamani = 0L
    private var ders: String? = null
    private var ekranAcik = true
    private var sonYazilanDakika = -1
    private var sonSorgu = 0L

    /** Ekran kapalıyken hiçbir uygulama öne gelemez; sorgu boşuna pil yakmasın. */
    private val ekranAlicisi = object : BroadcastReceiver() {
        override fun onReceive(baglam: Context?, niyet: Intent?) {
            when (niyet?.action) {
                Intent.ACTION_SCREEN_OFF -> {
                    ekranAcik = false
                    katman?.gizle()
                }
                Intent.ACTION_SCREEN_ON -> {
                    ekranAcik = true
                    // Ekran kapalıyken biriken olaylar atlanmalı: telefon yeniden
                    // açıldığında ekranda ne varsa öndeki odur.
                    sonSorgu = System.currentTimeMillis()
                }
            }
        }
    }

    private val dongu = object : Runnable {
        override fun run() {
            adim()
            elciler.postDelayed(this, ARALIK_MS)
        }
    }

    override fun onBind(niyet: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        katman = EngelKatmani(this)
        registerReceiver(
            ekranAlicisi,
            IntentFilter().apply {
                addAction(Intent.ACTION_SCREEN_OFF)
                addAction(Intent.ACTION_SCREEN_ON)
            },
        )
    }

    override fun onStartCommand(niyet: Intent?, bayraklar: Int, baslatmaId: Int): Int {
        yasakli = niyet?.getStringArrayListExtra(EK_PAKETLER)?.toSet() ?: emptySet()
        bitisZamani = niyet?.getLongExtra(EK_BITIS, 0L) ?: 0L
        ders = niyet?.getStringExtra(EK_DERS)
        sonSorgu = System.currentTimeMillis()

        onPlanaGec()
        calisiyor = true
        // Bildirim susturma isteğe bağlı: izin yoksa dinleyici hiç bağlanmıyor
        // ve buradaki çağrı sessizce boşa düşüyor, kilit çalışmaya devam ediyor.
        BildirimSusturucu.baslat(yasakli)

        elciler.removeCallbacks(dongu)
        elciler.post(dongu)
        // Sistem servisi öldürürse yeniden başlatmasın: tur bilgisi elde kalmıyor,
        // boş bir kilit kullanıcıyı uygulamadan soğutur.
        return START_NOT_STICKY
    }

    /**
     * Uygulama görev listesinden silinince kilit kalkar.
     *
     * Ön plan servisi görev silinmesinden sağ çıkıyor: kullanıcı Rabi'yi
     * kapattıktan sonra da uygulamalar engelli kalıyor, bildirimde dakika saymaya
     * devam ediyordu. Kapalı bir uygulamanın telefonu kilitli tutması kabul
     * edilemez — kilit, açık bir uygulamanın verdiği sözdür.
     *
     * `stopWithTask` bayrağı bilerek kullanılmadı: o bayrakla sistem servisi
     * doğrudan öldürüyor ve bu geri çağrı hiç gelmiyor, bekleyen seans bildirimi
     * de iptal edilemiyordu.
     */
    override fun onTaskRemoved(kokNiyet: Intent?) {
        PomodoroKapanis.temizle(this)
        durdurKendini()
        super.onTaskRemoved(kokNiyet)
    }

    override fun onDestroy() {
        calisiyor = false
        // Tur bitti: bildirimler yeniden normal düşsün. Molada susmaya devam
        // eden bir telefon, molayı mola olmaktan çıkarırdı.
        BildirimSusturucu.durdur()
        elciler.removeCallbacks(dongu)
        katman?.gizle()
        katman = null
        try {
            unregisterReceiver(ekranAlicisi)
        } catch (hata: IllegalArgumentException) {
            // kaydı yoksa yoksay
        }
        super.onDestroy()
    }

    private fun adim() {
        val simdi = System.currentTimeMillis()

        // Güvenlik ağı: web tarafı `bitir` diyemeden öldürülürse (uygulama zorla
        // durdurulmuş olabilir) kilit sonsuza kadar takılı kalmasın.
        if (bitisZamani in 1..simdi) {
            durdurKendini()
            return
        }

        val kalan = kalanDakika(simdi)
        if (kalan != sonYazilanDakika) {
            sonYazilanDakika = kalan
            bildirimiGuncelle(kalan)
        }

        if (!ekranAcik) return

        val ondeki = ondekiPaket(simdi) ?: return
        if (yasakli.contains(ondeki)) {
            katman?.goster(bitisZamani, ders)
        } else {
            katman?.gizle()
        }
    }

    /**
     * Son olaylara bakıp öne gelen paketi bulur.
     *
     * Pencere son sorgudan bu yana geçen süre (en az 5 sn): tam 1,5 sn sorulursa
     * olay gecikmeli düştüğünde geçiş kaçıyor ve katman hiç çıkmıyor. Pencerede
     * hiç olay yoksa null dönülür; "önceki neyse odur" demek, boş pencereyi
     * "başka uygulama öne geldi" sanıp katmanı kapatmaktan doğru.
     */
    private fun ondekiPaket(simdi: Long): String? {
        val yonetici = getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return null
        val baslangic = minOf(sonSorgu, simdi - PENCERE_MS)
        sonSorgu = simdi
        return try {
            val olaylar = yonetici.queryEvents(baslangic, simdi)
            val olay = UsageEvents.Event()
            var sonPaket: String? = null
            while (olaylar.hasNextEvent()) {
                olaylar.getNextEvent(olay)
                // ACTIVITY_RESUMED, API 29'da MOVE_TO_FOREGROUND'un yerini aldı;
                // ikisi de 1 olduğu için eski sürümlerde de doğru çalışıyor.
                if (olay.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                    sonPaket = olay.packageName
                }
            }
            sonPaket
        } catch (hata: Exception) {
            // İzin geri alınmış olabilir; kilit sessizce işlevsizleşir, çökmez.
            null
        }
    }

    private fun kalanDakika(simdi: Long): Int {
        if (bitisZamani <= 0L) return 0
        return max(0, ((bitisZamani - simdi) / 60_000L).toInt() + 1)
    }

    private fun onPlanaGec() {
        val yonetici = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (yonetici.getNotificationChannel(KANAL_ID) == null) {
            yonetici.createNotificationChannel(
                NotificationChannel(
                    KANAL_ID,
                    "Odak modu",
                    // Düşük önem: ses çıkarmaz, ekranda belirmez. Kullanıcı zaten
                    // çalışıyor, bildirimin kendisi de dikkat dağıtmamalı.
                    NotificationManager.IMPORTANCE_LOW,
                ).apply { setShowBadge(false) },
            )
        }
        val bildirim = bildirimYap(kalanDakika(System.currentTimeMillis()))
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(BILDIRIM_ID, bildirim, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        } else {
            startForeground(BILDIRIM_ID, bildirim)
        }
    }

    private fun bildirimiGuncelle(kalan: Int) {
        val yonetici = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        yonetici.notify(BILDIRIM_ID, bildirimYap(kalan))
    }

    private fun bildirimYap(kalan: Int): Notification {
        val ac = packageManager.getLaunchIntentForPackage(packageName)
        val dokunma = PendingIntent.getActivity(
            this,
            0,
            ac ?: Intent(),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        return Notification.Builder(this, KANAL_ID)
            .setContentTitle("Rabi — odak modu")
            .setContentText(kalan.toString() + " dk kaldı")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setContentIntent(dokunma)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .build()
    }

    private fun durdurKendini() {
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    companion object {
        /** Web tarafı "kilit hâlâ ayakta mı" diye sorabilsin diye. */
        @Volatile
        var calisiyor = false
            private set

        private const val EK_PAKETLER = "paketler"
        private const val EK_BITIS = "bitisZamani"
        private const val EK_DERS = "ders"
        private const val BILDIRIM_ID = 4211
        private const val KANAL_ID = "odak-kilidi"
        private const val ARALIK_MS = 1500L
        private const val PENCERE_MS = 5000L

        fun baslat(baglam: Context, paketler: ArrayList<String>, bitisZamani: Long, ders: String?) {
            val niyet = Intent(baglam, OdakServisi::class.java)
                .putStringArrayListExtra(EK_PAKETLER, paketler)
                .putExtra(EK_BITIS, bitisZamani)
                .putExtra(EK_DERS, ders)
            baglam.startForegroundService(niyet)
        }

        fun durdur(baglam: Context) {
            baglam.stopService(Intent(baglam, OdakServisi::class.java))
        }
    }
}
