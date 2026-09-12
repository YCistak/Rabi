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

    /** MIUI/HyperOS mu — `ro.miui.ui.version.name` yalnızca Xiaomi'de dolu. */
    private val miui: Boolean by lazy { sistemOzelligi("ro.miui.ui.version.name").isNotBlank() }

    /**
     * Xiaomi'nin kendi izni: "Arka planda çalışırken açılır pencere göster".
     *
     * MIUI/HyperOS'ta üste çizme izni tek başına yetmiyor. Uygulama önde
     * değilken — kilit için tam da o an — `TYPE_APPLICATION_OVERLAY`
     * penceresi bu izin olmadan **sessizce** görünmüyor: `addView` hata
     * fırlatmıyor, pencere ekrana gelmiyor. Sonuç, izinleri vermiş kullanıcının
     * Rabi'yi alta alıp yasaklı uygulamayı engelsiz açabilmesiydi.
     *
     * Bu bir AOSP izni değil, `AppOpsManager`'da sayısı 10021 olan MIUI'ye özgü
     * bir işlem; sabitin adı olmadığı için yansımayla soruluyor. Xiaomi
     * olmayan cihazda ve sorgu başarısız olursa "var" dönülüyor: yanlış bir
     * "yok", her cihazda gereksiz bir izin satırı çıkarırdı.
     */
    fun arkaPlanPencereVar(baglam: Context): Boolean {
        if (!miui) return true
        val ops = baglam.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager ?: return true
        return try {
            val sorgu = AppOpsManager::class.java.getMethod(
                "checkOpNoThrow",
                Int::class.javaPrimitiveType,
                Int::class.javaPrimitiveType,
                String::class.java,
            )
            sorgu.invoke(ops, MIUI_ARKA_PLAN_PENCERE, Process.myUid(), baglam.packageName) ==
                AppOpsManager.MODE_ALLOWED
        } catch (hata: Exception) {
            true
        }
    }

    /**
     * Xiaomi'nin uygulama izin düzenleyicisi; satır orada "Arka planda çalışırken
     * açılır pencere göster" diye geçiyor. Etkinlik adı sürümden sürüme
     * değişebildiği için açılamazsa uygulama bilgi sayfasına düşülüyor —
     * oradan da "Diğer izinler" ile aynı yere gidiliyor.
     */
    fun arkaPlanPencereEkraniniAc(baglam: Context): Boolean {
        val duzenleyici = Intent("miui.intent.action.APP_PERM_EDITOR").apply {
            setClassName(
                "com.miui.securitycenter",
                "com.miui.permcenter.permissions.PermissionsEditorActivity",
            )
            putExtra("extra_pkgname", baglam.packageName)
        }
        if (ekraniAc(baglam, duzenleyici)) return true
        return ekraniAc(
            baglam,
            Intent(
                Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.parse("package:${baglam.packageName}"),
            ),
        )
    }

    /** `android.os.SystemProperties` gizli; yansımayla okunuyor, okunamazsa boş. */
    private fun sistemOzelligi(ad: String): String = try {
        val sinif = Class.forName("android.os.SystemProperties")
        sinif.getMethod("get", String::class.java).invoke(null, ad) as? String ?: ""
    } catch (hata: Exception) {
        ""
    }

    /** MIUI'nin `OP_BACKGROUND_START_ACTIVITY` işlemi — arka planda pencere açma. */
    private const val MIUI_ARKA_PLAN_PENCERE = 10021

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
