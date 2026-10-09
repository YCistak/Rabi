package com.fluxifyinteractive.rabi.odak

import android.app.AppOpsManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
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
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, paketAdresi(baglam)),
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

    /**
     * Kullanım erişimi ekranı.
     *
     * Android 10+ birçok cihazda `package:` adresli niyet doğrudan Rabi'nin
     * anahtar sayfasını açıyor; kullanıcı uzun listede uygulamayı aramıyor.
     * Desteklemeyen cihaz ya hata veriyor ya da adresi yok sayıp listeyi
     * açıyor — ikisi de eskisinden kötü değil. Hata verirse adressiz listeye
     * düşülüyor.
     */
    fun kullanimVerisiEkraniniAc(baglam: Context): Boolean =
        ilkAcilan(
            baglam,
            Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS, paketAdresi(baglam)),
            Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS),
        )

    /**
     * Rahatsız Etme erişimi ekranı.
     *
     * Sırayla:
     * 1. Android 11+ ayar uygulamasının uygulamaya özel detay sayfası
     *    (`NOTIFICATION_POLICY_ACCESS_DETAIL_SETTINGS` + `package:`). Sabit
     *    SDK'da gizli (`@hide`), bu yüzden adı elle yazılı; üretici kaldırmışsa
     *    hata verir ve bir sonrakine geçilir.
     * 2. Liste ekranı, Rabi'nin satırını vurgulayan argümanla: AOSP listesinde
     *    her satırın anahtarı paket adı, Android 10+ ayarlar bu anahtara
     *    kaydırıp satırı yanıp söndürüyor. Tanımayan cihaz argümanı yok sayıyor.
     */
    fun rahatsizEtmeEkraniniAc(baglam: Context): Boolean =
        ilkAcilan(
            baglam,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Intent(RAHATSIZ_ETME_DETAY, paketAdresi(baglam))
            } else {
                null
            },
            satiriVurgula(
                Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS),
                baglam.packageName,
            ),
        )

    /**
     * Üste çizme izni. `package:` adresiyle Android 11+'da doğrudan Rabi'nin
     * anahtarı, daha eskisinde liste açılıyor. Adresli niyet açılamazsa adressiz
     * listeye, o da yoksa uygulama bilgi sayfasına düşülüyor.
     */
    fun katmanEkraniniAc(baglam: Context): Boolean =
        ilkAcilan(
            baglam,
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, paketAdresi(baglam)),
            Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION),
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, paketAdresi(baglam)),
        )

    private fun paketAdresi(baglam: Context): Uri = Uri.parse("package:${baglam.packageName}")

    /**
     * Ayarlar listesinde bir satırı vurgulatan argümanlar. AOSP'de
     * `SettingsActivity` bunları liste parçasına geçiriyor; anahtar eşleşirse
     * satıra kaydırıp vurguluyor. Belgelenmemiş ama Android 10'dan beri
     * kararlı; tanınmazsa niyet olduğu gibi çalışıyor.
     */
    private fun satiriVurgula(niyet: Intent, anahtar: String): Intent = niyet.apply {
        putExtra(PARCA_ANAHTARI, anahtar)
        putExtra(PARCA_ARGUMANLARI, Bundle().apply { putString(PARCA_ANAHTARI, anahtar) })
    }

    /** Niyetleri sırayla dener, ilk açılanda durur; `null`lar atlanır. */
    private fun ilkAcilan(baglam: Context, vararg niyetler: Intent?): Boolean =
        niyetler.any { it != null && ekraniAc(baglam, it) }

    private const val RAHATSIZ_ETME_DETAY =
        "android.settings.NOTIFICATION_POLICY_ACCESS_DETAIL_SETTINGS"
    private const val PARCA_ANAHTARI = ":settings:fragment_args_key"
    private const val PARCA_ARGUMANLARI = ":settings:show_fragment_args"

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
