package com.fluxifyinteractive.rabi.odak

import android.app.AppOpsManager
import android.app.NotificationManager
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
     * Rahatsız Etme erişimi — tur boyunca telefonu susturmak için.
     *
     * Ötekilerden farkı **isteğe bağlı** olması: verilmezse kilit çalışmaya
     * devam ediyor, yalnızca telefon susmuyor. `hepsiVar` bu yüzden bunu
     * saymıyor.
     */
    fun rahatsizEtmeVar(baglam: Context): Boolean = try {
        val yonetici =
            baglam.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        yonetici?.isNotificationPolicyAccessGranted == true
    } catch (hata: Exception) {
        false
    }

    fun hepsiVar(baglam: Context): Boolean = kullanimVerisiVar(baglam) && katmanVar(baglam)

    fun kullanimVerisiEkraniniAc(baglam: Context): Boolean =
        ekraniAc(baglam, Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))

    /**
     * Rahatsız Etme erişimi ekranı.
     *
     * Doğrudan Rabi'nin satırına götüren bir niyet yok; liste ekranı açılıyor
     * ve kullanıcı uygulamayı kendisi buluyor. Arayüz bu yüzden ne arayacağını
     * yazıyor.
     */
    fun rahatsizEtmeEkraniniAc(baglam: Context): Boolean =
        ekraniAc(baglam, Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS))

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
