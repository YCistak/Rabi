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
import android.graphics.drawable.Icon
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.widget.RemoteViews
import com.rabi.app.PomodoroKapanis
import com.rabi.app.R
import java.util.Locale
import kotlin.math.max

/**
 * Çalışma turu boyunca yaşayan ön plan servisi.
 *
 * Neden ön plan servisi: arka planda periyodik çalışma başka türlü mümkün değil,
 * Android sıradan bir servisi dakikalar içinde öldürüyor.
 *
 * Bir süre servisin tek gerekçesi odak kilidiydi ve bildirim onun **bedeliydi**
 * — sistem zorunlu kıldığı için katlanılan bir satır. Artık tersi: bildirim
 * özelliğin kendisi. Sayaç telefon kilitliyken de okunabilmeli, çünkü pomodoro
 * turunun büyük kısmı telefona bakılmadan geçiyor ve kalan süreyi öğrenmek için
 * uygulamayı açmak, tam da açılmaması gereken şeyi açtırıyordu. Servis bu yüzden
 * **her** turda kuruluyor: kilit ve Rahatsız Etme artık üstüne binen iki
 * seçenek, servisin varlık sebebi değil.
 *
 * Molada da yaşıyor (eskiden durduruluyordu): molanın da bir sayacı var ve
 * "kaç dakika sonra masaya dönüyorum" sorusunun cevabı da orada. Engelleme
 * molada devreye girmiyor — o karar web tarafında, servise boş liste geçiliyor.
 */
class OdakServisi : Service() {

    private val elciler = Handler(Looper.getMainLooper())
    private var katman: EngelKatmani? = null
    private var yasakli: Set<String> = emptySet()
    private var bitisZamani = 0L
    /**
     * Turun başladığı an — bildirimdeki ve engel katmanındaki çubuk bununla
     * doluyor.
     *
     * Web tarafından geçmiyor, servis kurulurken damgalanıyor: kilit turla
     * birlikte başlıyor ve duraklat/devam et her seferinde yeni bir bitişle
     * servisi yeniden kuruyor. Yani çubuk her zaman **içinde bulunulan**
     * kesintisiz çalışma parçasını ölçüyor.
     */
    private var baslangicZamani = 0L
    /** Aşamanın toplam uzunluğu; duraklamadan sonra çubuğun ölçüsü bozulmasın diye. */
    private var toplamSureMs = 0L
    private var ders: String? = null
    /** "Çalışma", "Kısa mola"… — bildirimin ilk satırı. */
    private var asamaAdi = VARSAYILAN_ASAMA
    private var ekranAcik = true
    private var sonYazilanSaniye = -1L
    private var sonSorgu = 0L

    /**
     * Sayaç duraklatıldı mı — bildirimdeki düğmeden.
     *
     * Duraklamış turda ne kalan süre işliyor ne de öne gelen uygulama
     * sorgulanıyor: duraklatan kullanıcı zaten telefonuna bakmak için
     * duraklatmıştır, o sırada engel katmanı çıkarmak duraklatmayı anlamsız
     * kılardı.
     */
    private var duraklatildi = false
    private var duraklamaKalanMs = 0L

    /**
     * Tur başlamadan önceki Rahatsız Etme süzgeci — bitince buraya dönülüyor.
     * `0` "susturma yapılmadı" demek (`INTERRUPTION_FILTER_UNKNOWN`).
     */
    private var oncekiSuzgec = 0

    /**
     * Yasaklı uygulamanın sesini kesmek için alınan ses odağı.
     *
     * `null` değilse odak elimizde ve tur bitene kadar bırakılmıyor —
     * bırakıldığı anda duraklattığımız oynatıcı kaldığı yerden devam ediyor.
     */
    private var sesOdagi: AudioFocusRequest? = null

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
                    // Kilit ekranındaki sayaç, ekran kapalıyken donmuş kalıyordu:
                    // bildirim ancak yazılan saniye değişince tazeleniyor ve ekran
                    // kapalıyken hiç yazılmıyor. Açılışta bir kez zorlanıyor.
                    sonYazilanSaniye = -1L
                }
            }
        }
    }

    private val dongu = object : Runnable {
        override fun run() {
            adim()
            elciler.postDelayed(this, if (yasakli.isEmpty()) BILDIRIM_ARALIGI_MS else ARALIK_MS)
        }
    }

    override fun onBind(niyet: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        katman = EngelKatmani(this)
        // Düzen şimdiden şişiriliyor: yasaklı uygulama öne geldiğinde katmanın
        // ekrana gelmesi ile aradaki tek iş `addView` kalsın. Şişirme ilk
        // gösterimde yapıldığında katman gözle görülür biçimde geç geliyordu.
        katman?.hazirla()
        registerReceiver(
            ekranAlicisi,
            IntentFilter().apply {
                addAction(Intent.ACTION_SCREEN_OFF)
                addAction(Intent.ACTION_SCREEN_ON)
            },
        )
    }

    override fun onStartCommand(niyet: Intent?, bayraklar: Int, baslatmaId: Int): Int {
        // Bildirim düğmeleri de buraya düşüyor: ayrı bir BroadcastReceiver
        // kurmak yerine PendingIntent doğrudan servise geliyor, böylece komut
        // ile onu işleyecek durum aynı nesnede.
        /*
          Aynı üç eylem iki yerden geliyor: bildirimin düğmelerinden ve web
          tarafının kendi düğmelerinden. Fark yalnızca haberin hangi yöne
          gittiği — bildirimden gelen komut web'e bildiriliyor, web'den gelen
          bildirilmiyor. Bildirilseydi web kendi gönderdiği komutu geri alır ve
          sayacı ikinci kez kurardı.
        */
        val bildir = niyet?.getBooleanExtra(EK_BILDIR, false) == true
        when (niyet?.action) {
            EYLEM_DURAKLAT -> {
                duraklat(bildir)
                return START_NOT_STICKY
            }
            EYLEM_DEVAM -> {
                devamEt()
                return START_NOT_STICKY
            }
            EYLEM_BITIR -> {
                if (bildir) OdakKilidiEklentisi.pomodoroKomutuBildir(KOMUT_BITIR, 0L)
                durdurKendini()
                return START_NOT_STICKY
            }
        }

        yasakli = niyet?.getStringArrayListExtra(EK_PAKETLER)?.toSet() ?: emptySet()
        bitisZamani = niyet?.getLongExtra(EK_BITIS, 0L) ?: 0L
        baslangicZamani = System.currentTimeMillis()
        toplamSureMs = max(0L, bitisZamani - baslangicZamani)
        ders = niyet?.getStringExtra(EK_DERS)
        asamaAdi = niyet?.getStringExtra(EK_ASAMA)?.takeIf { it.isNotBlank() } ?: VARSAYILAN_ASAMA
        duraklatildi = false
        duraklamaKalanMs = 0L
        sonYazilanSaniye = -1L
        sonSorgu = System.currentTimeMillis()

        onPlanaGec()
        calisiyor = true
        if (niyet?.getBooleanExtra(EK_RAHATSIZ_ETME, false) == true) sustur()
        // Tur başlamadan önce açılmış bir video hâlâ çalıyor olabilir; kilidin
        // ilk işi onu susturmak.
        if (yasakli.isNotEmpty()) baslarkenCalaniSustur()

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
        // Tur bitti: telefon eski hâline dönsün. Molada susmaya devam eden bir
        // telefon, molayı mola olmaktan çıkarırdı.
        sesiGeriVer()
        sesOdaginiBirak()
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

    /**
     * Bildirimdeki "Duraklat".
     *
     * Kalan süre donduruluyor, bitiş zamanı unutuluyor: devam edildiğinde yeni
     * bir bitiş hesaplanacak. Web tarafına da haber gidiyor — sayacın iki
     * kopyası var ve biri ötekinden habersiz kalırsa uygulamaya dönen kullanıcı
     * duraklattığı turu işlerken buluyordu.
     */
    private fun duraklat(bildir: Boolean) {
        if (duraklatildi) return
        duraklamaKalanMs = max(0L, bitisZamani - System.currentTimeMillis())
        duraklatildi = true
        katman?.gizle()
        sonYazilanSaniye = -1L
        bildirimiGuncelle()
        if (bildir) OdakKilidiEklentisi.pomodoroKomutuBildir(KOMUT_DURAKLAT, 0L)
    }

    /**
     * Bildirimdeki "Devam et".
     *
     * Yalnızca bildirimden geliyor: uygulamanın kendi Başlat düğmesi servisi
     * baştan kuruyor (`baslat`), ayrı bir "devam" yoluna ihtiyacı yok.
     *
     * Yeni bitiş zamanı web tarafına da geçiyor: orada sayaç mutlak zaman
     * damgasından okunuyor (`lib/pomodoro.ts`), yani "devam ettim" demek
     * yetmiyor, **hangi ana kadar** olduğu söylenmeli.
     *
     * Başlangıç da bitişe göre geri sarılıyor; yoksa duraklamada geçen süre
     * çubuğa "geçmiş süre" diye yazılır ve tur yarısında duraklatan kullanıcı
     * dolmuş bir çubukla karşılaşırdı.
     */
    private fun devamEt() {
        if (!duraklatildi) return
        val simdi = System.currentTimeMillis()
        bitisZamani = simdi + duraklamaKalanMs
        baslangicZamani = bitisZamani - toplamSureMs
        duraklatildi = false
        sonYazilanSaniye = -1L
        sonSorgu = simdi
        bildirimiGuncelle()
        OdakKilidiEklentisi.pomodoroKomutuBildir(KOMUT_DEVAM, bitisZamani)
    }

    private fun adim() {
        val simdi = System.currentTimeMillis()

        if (duraklatildi) return

        /*
          Güvenlik ağı: web tarafı `bitir` diyemeden öldürülürse (uygulama zorla
          durdurulmuş olabilir) kilit sonsuza kadar takılı kalmasın.

          Bitişten `GERI_ALMA_PAYI` kadar **önce** kapanıyor: seans bitimi
          bildirimi tam bitiş anında düşüyor ve Rahatsız Etme o an hâlâ açıksa
          zil duyulmuyordu — uygulama arka plandayken kullanıcının turun
          bittiğini öğrenmesinin tek yolu o bildirim. Birkaç saniye erken
          kalkan bir engelin bedeli yok; duyulmayan bir zilin var.
        */
        if (bitisZamani in 1..(simdi + GERI_ALMA_PAYI)) {
            durdurKendini()
            return
        }

        val kalan = kalanSaniye(simdi)
        if (kalan != sonYazilanSaniye) {
            sonYazilanSaniye = kalan
            // Ekran kapalıyken bildirimi saniyede bir yeniden çizmek boşuna:
            // görecek kimse yok, ekran açılınca `ekranAlicisi` zorluyor.
            if (ekranAcik) bildirimiGuncelle()
        }

        if (!ekranAcik) return
        // Yalnızca Rahatsız Etme istenmişse ya da tur molaysa engellenecek
        // uygulama yok; öne gelen uygulamayı sorgulamak boşuna pil yakardı.
        if (yasakli.isEmpty()) return

        val ondeki = ondekiPaket(simdi) ?: return
        if (yasakli.contains(ondeki)) {
            katman?.goster(baslangicZamani, bitisZamani, ders)
            /*
              Yasaklı uygulama bir kez öne geldiyse sesi tur boyunca elimizde
              kalıyor. Katman ekrandan çekilince (kullanıcı ana ekrana çıkınca)
              uygulama arka planda ya da mini oynatıcıda çalmaya devam
              edebiliyor ve odağı orada bırakmak, sesin geri gelmesi demek.
            */
            sesOdaginiAl()
        } else {
            katman?.gizle()
        }
    }

    /**
     * Son olaylara bakıp öne gelen paketi bulur.
     *
     * Pencere son sorgudan bu yana geçen süre (en az `PENCERE_MS`): tam döngü
     * aralığı kadar sorulursa olay gecikmeli düştüğünde geçiş kaçıyor ve katman
     * hiç çıkmıyor. Pencerede hiç olay yoksa null dönülür; "önceki neyse odur"
     * demek, boş pencereyi "başka uygulama öne geldi" sanıp katmanı kapatmaktan
     * doğru.
     */
    private fun ondekiPaket(simdi: Long): String? {
        val baslangic = minOf(sonSorgu, simdi - PENCERE_MS)
        sonSorgu = simdi
        return sonOndeki(baslangic, simdi)
    }

    /** Verilen aralıkta öne gelmiş **son** paket; olay yoksa null. */
    private fun sonOndeki(baslangic: Long, bitis: Long): String? {
        val yonetici = getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return null
        return try {
            val olaylar = yonetici.queryEvents(baslangic, bitis)
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

    /**
     * Tur başlarken zaten çalmakta olan sesi keser.
     *
     * Şikâyetin geldiği yer tam olarak burası: kullanıcı YouTube'da bir video
     * açıp Rabi'ye dönüyor ve turu başlatıyor. Yasaklı uygulama artık **önde
     * değil** — ana ekranda ya da mini oynatıcıda — yani öne gelen uygulamayı
     * izleyen döngü onu hiç görmüyor, ses de tur boyunca arkadan gelmeye devam
     * ediyordu.
     *
     * Kural iki koşulun kesişimi: son bir dakika içinde yasaklı bir uygulama
     * önde olacak **ve** şu anda bir şey çalıyor olacak. İkisi birden olmadan
     * ses alınmıyor; `isMusicActive` tek başına hangi uygulamanın çaldığını
     * söylemiyor ve engellenmemiş bir çalar (öğrencinin kendi çalışma müziği)
     * boş yere susturulurdu.
     */
    private fun baslarkenCalaniSustur() {
        val yonetici = getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return
        if (!yonetici.isMusicActive) return
        val simdi = System.currentTimeMillis()
        val onceki = sonOndeki(simdi - GERIYE_BAKIS_MS, simdi) ?: return
        if (yasakli.contains(onceki)) sesOdaginiAl()
    }

    /**
     * Ses odağını alır ve tur bitene kadar bırakmaz.
     *
     * `TRANSIENT_EXCLUSIVE`: odağı kaybeden oynatıcı duraklıyor ve odak geri
     * verilene kadar kendiliğinden devam edemiyor. Mini oynatıcıyı ekrandan
     * **kaldırmıyor** — bunun için genel bir API yok, pencere sistemin
     * elinde — ama sesini kesiyor ve pratikte şikâyet edilen şey oydu.
     *
     * Rabi'nin kendi lo-fi'ı bundan etkilenmiyor: odak uygulama başına
     * veriliyor ve WebView odağı kendi adına yeniden isteyince yasaklı uygulama
     * değil biz alıyoruz.
     */
    private fun sesOdaginiAl() {
        if (sesOdagi != null) return
        val yonetici = getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return
        val istek = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE)
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build(),
            )
            // Odağı kaybetsek de bir şey yapmıyoruz: servisin kendisi ses
            // çalmıyor, tek işi odağı yasaklı uygulamadan almaktı.
            .setOnAudioFocusChangeListener {}
            .build()
        try {
            yonetici.requestAudioFocus(istek)
            sesOdagi = istek
        } catch (hata: Exception) {
            // Ses odağı alınamazsa kilit görsel olarak çalışmaya devam ediyor.
        }
    }

    private fun sesOdaginiBirak() {
        val istek = sesOdagi ?: return
        sesOdagi = null
        try {
            val yonetici = getSystemService(Context.AUDIO_SERVICE) as? AudioManager ?: return
            yonetici.abandonAudioFocusRequest(istek)
        } catch (hata: Exception) {
            // Bırakılamazsa kullanıcı oynatıcıyı kendisi başlatabiliyor.
        }
    }

    /**
     * Telefonu Rahatsız Etme'ye alır.
     *
     * `PRIORITY` seçildi, `NONE` değil: kullanıcının kendi istisnaları (alarm,
     * kişilerden gelen arama, üst üste arayan) yürürlükte kalıyor. Her şeyi
     * susturan bir odak modu, iki saat çalışan öğrencinin telefonunu ulaşılmaz
     * yapardı — kimse böyle bir özelliği ikinci kez açmaz.
     *
     * Önceki süzgeç saklanıyor: kullanıcı tur başlamadan önce zaten Rahatsız
     * Etme'deyse tur bitince "kapalı"ya çekmek, onun kendi ayarını bozmak
     * olurdu.
     */
    private fun sustur() {
        if (!Izinler.rahatsizEtmeVar(this)) return
        try {
            val yonetici = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            oncekiSuzgec = yonetici.currentInterruptionFilter
            yonetici.setInterruptionFilter(NotificationManager.INTERRUPTION_FILTER_PRIORITY)
        } catch (hata: Exception) {
            // İzin tur ortasında geri alınmış olabilir; kilit bundan etkilenmiyor.
            oncekiSuzgec = 0
        }
    }

    private fun sesiGeriVer() {
        val onceki = oncekiSuzgec
        oncekiSuzgec = 0
        if (onceki == 0 || !Izinler.rahatsizEtmeVar(this)) return
        try {
            val yonetici = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            yonetici.setInterruptionFilter(onceki)
        } catch (hata: Exception) {
            // Geri alınamazsa kullanıcı Rahatsız Etme'yi kendisi kapatabiliyor;
            // çökmek sessiz kalmış bir telefondan daha kötü.
        }
    }

    /** Kalan saniye. Duraklamışsa donmuş değer. */
    private fun kalanSaniye(simdi: Long): Long {
        if (duraklatildi) return duraklamaKalanMs / 1000L
        if (bitisZamani <= 0L) return 0L
        return max(0L, (bitisZamani - simdi) / 1000L)
    }

    private fun onPlanaGec() {
        val yonetici = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (yonetici.getNotificationChannel(KANAL_ID) == null) {
            yonetici.createNotificationChannel(
                NotificationChannel(
                    KANAL_ID,
                    "Pomodoro sayacı",
                    // Düşük önem: ses çıkarmaz, ekranda belirmez. Kullanıcı zaten
                    // çalışıyor, bildirimin kendisi de dikkat dağıtmamalı. Kilit
                    // ekranında görünmesi bundan etkilenmiyor; onu `VISIBILITY_PUBLIC`
                    // belirliyor.
                    NotificationManager.IMPORTANCE_LOW,
                ).apply { setShowBadge(false) },
            )
        }
        val bildirim = bildirimYap()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(BILDIRIM_ID, bildirim, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        } else {
            startForeground(BILDIRIM_ID, bildirim)
        }
    }

    private fun bildirimiGuncelle() {
        val yonetici = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        yonetici.notify(BILDIRIM_ID, bildirimYap())
    }

    /** "24:05" — kilit ekranındaki sayının biçimi uygulamadakiyle aynı. */
    private fun sureMetni(): String {
        val kalan = kalanSaniye(System.currentTimeMillis())
        return String.format(Locale.US, "%02d:%02d", kalan / 60, kalan % 60)
    }

    /**
     * "Çalışma · Matematik" — aşama, sonra ders. Ders bilinmiyorsa yalnız
     * aşama; duraklamışsa aşamanın yerine durumun kendisi yazıyor, çünkü
     * donmuş bir sayının yanında "Çalışma" yazması sayacın bozulduğunu
     * düşündürüyor.
     */
    private fun baslikMetni(): String {
        if (duraklatildi) return "Duraklatıldı"
        val dersAdi = ders
        return if (dersAdi.isNullOrBlank()) asamaAdi else "$asamaAdi · $dersAdi"
    }

    /** Aşamanın ne kadarının geçtiği, 0-1000. Toplam bilinmiyorsa boş çubuk. */
    private fun ilerleme(): Int {
        if (toplamSureMs <= 0L) return 0
        val gecen =
            if (duraklatildi) toplamSureMs - duraklamaKalanMs
            else System.currentTimeMillis() - baslangicZamani
        return ((gecen * 1000L) / toplamSureMs).coerceIn(0L, 1000L).toInt()
    }

    private fun bildirimYap(): Notification {
        val sure = sureMetni()
        val baslik = baslikMetni()
        val oran = ilerleme()

        val kucuk = RemoteViews(packageName, R.layout.pomodoro_bildirim)
        kucuk.setTextViewText(R.id.bildirim_asama, baslik)
        kucuk.setTextViewText(R.id.bildirim_sure, sure)
        kucuk.setProgressBar(R.id.bildirim_cubuk, 1000, oran, false)

        val genis = RemoteViews(packageName, R.layout.pomodoro_bildirim_genis)
        genis.setTextViewText(R.id.bildirim_genis_asama, baslik)
        genis.setTextViewText(R.id.bildirim_genis_sure, sure)
        genis.setProgressBar(R.id.bildirim_genis_cubuk, 1000, oran, false)

        val ac = packageManager.getLaunchIntentForPackage(packageName)
        val dokunma = PendingIntent.getActivity(
            this,
            0,
            ac ?: Intent(),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )

        val yapici = Notification.Builder(this, KANAL_ID)
            /*
              Simge sistemin asma kilidi değil Rabi'nin kendi silueti
              (`scripts/ikon-uret.mjs`): durum çubuğunda asma kilit gören
              kullanıcı bildirimin telefonun kendi güvenlik uyarısı olduğunu
              sanıyordu. Durum çubuğu yalnızca alfa kanalını okuyor, o yüzden
              renkli ikon değil beyaz siluet; rengi `setColor` veriyor.
            */
            .setSmallIcon(R.drawable.ic_bildirim)
            .setColor(getColor(R.color.marka_amber))
            .setColorized(false)
            .setContentIntent(dokunma)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            // Kilit ekranı gizli bildirimlerde yalnızca uygulama adını yazıyor;
            // sayacın orada okunabilmesi bu satıra bağlı.
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            /*
              Özel düzen sistemin çerçevesinin **içine** konuyor
              (DecoratedCustomViewStyle): uygulama adı, saat ve düğmeler sistemin
              kendi çizimi, ortadaki içerik bizim. Tümüyle özel bir bildirim her
              üreticinin gölgesinde başka türlü duruyor ve düğmeleri de elle
              çizmek gerekiyordu.
            */
            .setStyle(Notification.DecoratedCustomViewStyle())
            .setCustomContentView(kucuk)
            .setCustomBigContentView(genis)
            // Özel düzeni çizemeyen yerler için (saat, araç arayüzü, bazı kilit
            // ekranları) düz karşılığı da yazılıyor.
            .setContentTitle(baslik)
            .setContentText("$sure kaldı")

        if (duraklatildi) {
            yapici.addAction(eylem(android.R.drawable.ic_media_play, "Devam et", EYLEM_DEVAM))
        } else {
            yapici.addAction(eylem(android.R.drawable.ic_media_pause, "Duraklat", EYLEM_DURAKLAT))
        }
        yapici.addAction(
            eylem(android.R.drawable.ic_menu_close_clear_cancel, "Turu bitir", EYLEM_BITIR),
        )
        return yapici.build()
    }

    /**
     * Bildirim düğmesi.
     *
     * `getService` kullanılıyor, `getBroadcast` değil: komutu işleyecek durum
     * (kalan süre, duraklama) zaten serviste ve araya bir alıcı koymak, aynı
     * bilgiyi bir kez daha taşımak olurdu. Bildirim eyleminden servis
     * başlatmak arka plan kısıtlarına takılmıyor — servis zaten ön planda.
     *
     * Her eylemin kendi istek kodu var; aynı kodla kurulan iki PendingIntent
     * birbirini eziyor ve iki düğme de sonuncunun işini yapıyordu.
     */
    private fun eylem(simge: Int, yazi: String, eylemAdi: String): Notification.Action {
        val niyet = Intent(this, OdakServisi::class.java)
            .setAction(eylemAdi)
            .putExtra(EK_BILDIR, true)
        val bekleyen = PendingIntent.getService(
            this,
            eylemAdi.hashCode(),
            niyet,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        return Notification.Action.Builder(
            Icon.createWithResource(this, simge),
            yazi,
            bekleyen,
        ).build()
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
        private const val EK_ASAMA = "asama"
        private const val EK_RAHATSIZ_ETME = "rahatsizEtme"
        /** Komut bildirimden mi geldi — öyleyse web tarafına haber gidiyor. */
        private const val EK_BILDIR = "bildir"
        private const val BILDIRIM_ID = 4211
        private const val KANAL_ID = "odak-kilidi"
        private const val VARSAYILAN_ASAMA = "Çalışma"

        private const val EYLEM_DURAKLAT = "com.rabi.app.ODAK_DURAKLAT"
        private const val EYLEM_DEVAM = "com.rabi.app.ODAK_DEVAM"
        private const val EYLEM_BITIR = "com.rabi.app.ODAK_BITIR"

        /** Web tarafının dinlediği komut adları (`lib/odak-kilidi.ts`). */
        const val KOMUT_DURAKLAT = "duraklat"
        const val KOMUT_DEVAM = "devam"
        const val KOMUT_BITIR = "bitir"

        /**
         * Öne gelen uygulamanın sorgulanma sıklığı.
         *
         * Bir buçuk saniyeydi ve engel katmanı yasaklı uygulama açıldıktan
         * ancak iki üç saniye sonra geliyordu: aradaki fark döngünün beklediği
         * süre ile kullanım olayının sisteme düşme gecikmesinin toplamı.
         * İkincisi elimizde değil, birincisi elimizdeydi. Üçte biri kadar bir
         * aralık, açılan uygulamayı kullanılmadan yakalıyor.
         *
         * Sorgunun kendisi ucuz (son birkaç saniyenin olay listesi) ama
         * bedava değil, o yüzden yalnızca engellenecek uygulama varken bu
         * sıklıkta dönülüyor.
         */
        private const val ARALIK_MS = 350L

        /** Engellenecek uygulama yokken döngünün tek işi bildirimdeki saniye. */
        private const val BILDIRIM_ARALIGI_MS = 1000L

        private const val PENCERE_MS = 5000L

        /** Tur başlarken "az önce hangi uygulamadaydı" sorusunun baktığı süre. */
        private const val GERIYE_BAKIS_MS = 60_000L

        /** Kilit bitişten bu kadar önce kalkıyor — seans zili duyulabilsin diye. */
        private const val GERI_ALMA_PAYI = 4000L

        fun baslat(
            baglam: Context,
            paketler: ArrayList<String>,
            bitisZamani: Long,
            ders: String?,
            asama: String?,
            rahatsizEtme: Boolean,
        ) {
            val niyet = Intent(baglam, OdakServisi::class.java)
                .putStringArrayListExtra(EK_PAKETLER, paketler)
                .putExtra(EK_BITIS, bitisZamani)
                .putExtra(EK_DERS, ders)
                .putExtra(EK_ASAMA, asama)
                .putExtra(EK_RAHATSIZ_ETME, rahatsizEtme)
            baglam.startForegroundService(niyet)
        }

        /**
         * Web tarafındaki Duraklat düğmesi.
         *
         * Servis durdurulmuyor, donduruluyor: durdurulsaydı bildirim ekrandan
         * kalkardı ve duraklatılmış tur, kilit ekranında hiç var olmamış gibi
         * görünürdü. Duraklatmak turdan çıkmak değil.
         */
        fun duraklat(baglam: Context) {
            if (!calisiyor) return
            baglam.startService(
                Intent(baglam, OdakServisi::class.java).setAction(EYLEM_DURAKLAT),
            )
        }

        fun durdur(baglam: Context) {
            baglam.stopService(Intent(baglam, OdakServisi::class.java))
        }
    }
}
