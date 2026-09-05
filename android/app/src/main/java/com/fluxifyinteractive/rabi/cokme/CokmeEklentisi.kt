package com.fluxifyinteractive.rabi.cokme

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Çökme raporlamasının web tarafıyla köprüsü.
 *
 * İki iş yapıyor: (1) bekleyen raporların sorulup gönderilmesi ya da
 * silinmesi, (2) JS'te yakalanan hataları yığın iziyle birlikte Crashlytics'e
 * geçirmek.
 *
 * Odak kilidi eklentisindeki kural burada da geçerli: hiçbir yöntem istisna
 * fırlatmıyor. Raporlama çalışmasa da uygulama çalışmalı — çökme raporu bir
 * özellik değil, bir yan hizmet.
 */
@CapacitorPlugin(name = "Cokme")
class CokmeEklentisi : Plugin() {

    /**
     * Bekleyen rapor var mı — açılışta bir kez soruluyor.
     *
     * Cevap asenkron geliyor (`checkForUnsentReports` bir Task döndürüyor), o
     * yüzden `cagri.resolve` geri çağrının içinde.
     */
    @PluginMethod
    fun bekleyen(cagri: PluginCall) {
        CokmeRaporu.bekleyenleriSor { bekleyen, oncekiCokme ->
            val sonuc = JSObject()
            sonuc.put("bekleyen", bekleyen)
            sonuc.put("cokme", oncekiCokme)
            cagri.resolve(sonuc)
        }
    }

    /** Kullanıcı "gönder" dedi. */
    @PluginMethod
    fun gonder(cagri: PluginCall) {
        CokmeRaporu.bekleyenleriGonder()
        cagri.resolve()
    }

    /** Kullanıcı "gönderme" dedi. */
    @PluginMethod
    fun sil(cagri: PluginCall) {
        CokmeRaporu.bekleyenleriSil()
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
}
