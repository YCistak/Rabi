package com.fluxifyinteractive.rabi.odak

import android.app.AppOpsManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings

/**
 * Odak kilidinin iki özel izni. İkisi de normal izin kutucuğu değil; kullanıcı
 * sistem ayarlarına gidip elle açıyor, bu yüzden istemek yerine "ekranı aç"
 * diyoruz ve sonucu geri dönüşte yeniden sorguluyoruz.
 */
object Izinler {

    /** Kullanım verisi erişimi (PACKAGE_USAGE_STATS) — hangi uygulama önde, onu okur. */
    @Suppress("DEPRECATION")
    fun kullanimVerisiVar(baglam: Context): Boolean {
        val ops = baglam.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager ?: return false
        val sonuc = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ops.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                baglam.packageName,
            )
        } else {
            @Suppress("DEPRECATION")
            ops.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                baglam.packageName,
            )
        }
        return sonuc == AppOpsManager.MODE_ALLOWED
    }

    /** Diğer uygulamaların üzerine çizme (SYSTEM_ALERT_WINDOW) — engel katmanı için. */
    fun katmanVar(baglam: Context): Boolean = Settings.canDrawOverlays(baglam)

    /**
     * Bildirim erişimi — kilitli uygulamaların bildirimlerini silmek için.
     *
     * Ötekilerden farkı **isteğe bağlı** olması: verilmezse kilit çalışmaya
     * devam ediyor, yalnızca bildirimler susmuyor. `hepsiVar` bu yüzden bunu
     * saymıyor.
     *
     * Verilen izinler `Settings.Secure`'da tek bir metinde iki nokta üst üste
     * ile ayrılmış duruyor; bileşen adı `paket/sınıf` biçiminde. Paket adını
     * aramak yetiyor: aynı pakette ikinci bir dinleyici yok.
     */
    fun bildirimErisimiVar(baglam: Context): Boolean = try {
        val izinli = Settings.Secure.getString(
            baglam.contentResolver,
            "enabled_notification_listeners",
        )
        izinli != null && izinli.split(':').any {
            ComponentName.unflattenFromString(it)?.packageName == baglam.packageName
        }
    } catch (hata: Exception) {
        false
    }

    fun hepsiVar(baglam: Context): Boolean = kullanimVerisiVar(baglam) && katmanVar(baglam)

    fun kullanimVerisiEkraniniAc(baglam: Context): Boolean =
        ekraniAc(baglam, Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))

    /**
     * Bildirim erişimi ekranı.
     *
     * Doğrudan Rabi'nin satırına götüren bir niyet yok; liste ekranı açılıyor
     * ve kullanıcı uygulamayı kendisi buluyor. Arayüz bu yüzden ne arayacağını
     * yazıyor.
     */
    fun bildirimErisimiEkraniniAc(baglam: Context): Boolean =
        ekraniAc(baglam, Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))

    fun katmanEkraniniAc(baglam: Context): Boolean =
        ekraniAc(
            baglam,
            Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${baglam.packageName}"),
            ),
        )

    /**
     * Bazı üreticiler (özellikle Xiaomi/Huawei) bu ayar ekranlarını hiç
     * taşımıyor; açılamazsa çökmek yerine false dönülüyor, arayüz kullanıcıya
     * "ayarlardan elle aç" diyor.
     */
    private fun ekraniAc(baglam: Context, niyet: Intent): Boolean = try {
        niyet.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        baglam.startActivity(niyet)
        true
    } catch (hata: Exception) {
        false
    }
}
