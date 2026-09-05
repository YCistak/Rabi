package com.fluxifyinteractive.rabi.cokme

import android.os.Handler
import android.os.Looper
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.fluxifyinteractive.rabi.BuildConfig

/**
 * Çökme raporlamasının web tarafıyla köprüsü.
 *
 * İki iş yapıyor: (1) kullanıcının onayını yerli tarafa taşımak, (2) JS'te
 * yakalanan hataları yığın iziyle birlikte Crashlytics'e geçirmek.
 *
 * Odak kilidi eklentisindeki kural burada da geçerli: hiçbir yöntem istisna
 * fırlatmıyor. Raporlama çalışmasa da uygulama çalışmalı — çökme raporu bir
 * özellik değil, bir yan hizmet.
 */
@CapacitorPlugin(name = "Cokme")
class CokmeEklentisi : Plugin() {

    /**
     * Arayüzün bilmesi gerekenler.
     *
     * `test` yalnızca debug derlemede `true`; Ayarlar'daki geliştirici bölümü
     * buna bakıp kendini çiziyor. Arayüzün gizliliğine güvenilmiyor — test
     * yöntemleri release'de çağrılsa bile çalışmıyor (aşağı bak).
     */
    @PluginMethod
    fun durum(cagri: PluginCall) {
        val sonuc = JSObject()
        sonuc.put("firebase", CokmeRaporu.kullanilabilir())
        sonuc.put("test", BuildConfig.DEBUG)
        cagri.resolve(sonuc)
    }

    /**
     * Kullanıcının kararı.
     *
     * `true` gelene kadar hiçbir şey ağa çıkmıyor (manifest'teki
     * `firebase_crashlytics_collection_enabled=false` varsayılanı sayesinde).
     * Firebase kararı cihazda saklıyor, yani bu çağrının her açılışta
     * tekrarlanması gerekmiyor — web tarafı yalnızca karar değişince çağırıyor.
     */
    @PluginMethod
    fun izinAyarla(cagri: PluginCall) {
        val acik = cagri.getBoolean("acik") ?: false
        CokmeRaporu.izinAyarla(acik)
        cagri.resolve()
    }

    /**
     * JS'te yakalanan bir hata.
     *
     * `yigin` `Error.stack`'in kendisi; yerli taraf onu Java yığın karelerine
     * çeviriyor (`CokmeRaporu.yiginCoz`). Yığın olmadan Crashlytics bütün web
     * hatalarını tek gruba koyuyor, o yüzden gönderilmesi önemli.
     */
    @PluginMethod
    fun bildir(cagri: PluginCall) {
        val mesaj = cagri.getString("mesaj")
        if (mesaj.isNullOrBlank()) {
            cagri.resolve()
            return
        }
        CokmeRaporu.kaydet(
            kaynak = cagri.getString("kaynak") ?: "web",
            mesaj = mesaj,
            yigin = cagri.getString("yigin"),
        )
        cagri.resolve()
    }

    /**
     * Test çökmesi — **yalnızca debug**.
     *
     * Gizli bir düğmeye değil, derleme türüne bağlı. Gizli düğme yaklaşımı
     * (sürüm numarasına yedi kez dokunma gibi) release APK'da da çalışan bir
     * kod yolu bırakıyor; buradaki kontrol arayüz ne yaparsa yapsın release'de
     * geçit vermiyor. Release'de bu iki yöntem iki satırlık ölü kod.
     */
    @PluginMethod
    fun testCokmesi(cagri: PluginCall) {
        if (!BuildConfig.DEBUG) {
            cagri.unavailable("Test çökmesi yalnızca debug derlemede çalışır.")
            return
        }
        cagri.resolve()
        // Çökme **eklenti çağrısının dışında** atılmak zorunda: Capacitor
        // eklenti yöntemlerini `try/catch` içinde çağırıyor
        // (`MessageHandler.java:37`), yani buradan doğrudan atılan istisna
        // çökmeye dönüşmüyor — yutulup JS tarafında reddedilmiş bir söze
        // (promise) çevriliyor ve hiçbir şey olmuyor. Ana looper'a
        // gönderilen istisna ise yakalanmamış sayılıyor ve Crashlytics'in
        // devraldığı `UncaughtExceptionHandler`'a düşüyor.
        Handler(Looper.getMainLooper()).post {
            throw RuntimeException("Rabi test çökmesi (debug)")
        }
    }

    /** Test non-fatal kaydı — yalnızca debug. */
    @PluginMethod
    fun testKayit(cagri: PluginCall) {
        if (!BuildConfig.DEBUG) {
            cagri.unavailable("Test kaydı yalnızca debug derlemede çalışır.")
            return
        }
        CokmeRaporu.kaydet(
            kaynak = "test",
            mesaj = "Rabi test kaydı (debug)",
            yigin = "at testKayit (test.js:1:1)",
        )
        cagri.resolve()
    }
}
