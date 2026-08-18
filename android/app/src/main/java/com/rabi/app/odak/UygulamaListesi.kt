package com.rabi.app.odak

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import java.io.ByteArrayOutputStream

/**
 * Kilitlenebilecek uygulamalar.
 *
 * Liste `queryIntentActivities` ile alınıyor: başlatıcısı olan, yani kullanıcının
 * ekranda görüp açabildiği uygulamalar. `QUERY_ALL_PACKAGES` **kullanılmıyor** —
 * Play'in kısıtlı izinler listesinde ve gerekçe formu istiyor. Manifest'teki
 * <queries> bloğu görünürlüğü sağlıyor; MAIN/LAUNCHER sorgusu incelemede
 * çıkarılmak zorunda kalırsa oradaki hazır paket listesi devreye giriyor ve
 * özellik ölmüyor, yalnızca listeyle sınırlı kalıyor.
 */
object UygulamaListesi {

    /** İkonlar base64 olarak web tarafına geçiyor; bu boyut yeterli, veri de küçük kalıyor. */
    private const val IKON_BOYUTU = 96

    /**
     * Kurulumda önceden işaretli gelenler — dikkat dağıttığı en çok bilinenler.
     * Kullanıcı hepsini değiştirebiliyor; buradaki sıra yalnızca öneri.
     */
    private val ONERILENLER = setOf(
        "com.instagram.android",
        "com.zhiliaoapp.musically",
        "com.ss.android.ugc.trill",
        "com.google.android.youtube",
        "com.snapchat.android",
        "com.twitter.android",
        "com.facebook.katana",
        "com.reddit.frontpage",
        "com.netflix.mediaclient",
        "com.spotify.music",
        "tv.twitch.android.app",
        "com.discord",
    )

    fun listele(baglam: Context): JSArray {
        val paketYonetici = baglam.packageManager
        val niyet = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val bulunanlar = paketYonetici.queryIntentActivities(niyet, 0)

        val liste = ArrayList<JSObject>()
        val gorulen = HashSet<String>()
        for (bilgi in bulunanlar) {
            val paket = bilgi.activityInfo.packageName
            // Rabi'nin kendisi kilitlenemez; birden fazla başlatıcı etkinliği
            // olan uygulamalar da listede bir kez görünmeli.
            if (paket == baglam.packageName || !gorulen.add(paket)) continue
            val kayit = JSObject()
            kayit.put("paket", paket)
            kayit.put("ad", bilgi.loadLabel(paketYonetici).toString())
            kayit.put("ikon", ikonuKodla(bilgi.loadIcon(paketYonetici)))
            kayit.put("onerilen", ONERILENLER.contains(paket))
            liste.add(kayit)
        }

        // Öneriler üstte, gerisi ada göre — kullanıcı aradığını en başta bulsun.
        liste.sortWith(
            compareByDescending<JSObject> { it.getBoolean("onerilen", false) }
                .thenBy { it.getString("ad")?.lowercase() ?: "" },
        )

        val sonuc = JSArray()
        liste.forEach { sonuc.put(it) }
        return sonuc
    }

    /** Drawable → küçük PNG → base64 data URI. İkonu olmayan uygulamada boş dönülür. */
    private fun ikonuKodla(cizim: Drawable?): String {
        if (cizim == null) return ""
        return try {
            val resim = if (cizim is BitmapDrawable && cizim.bitmap != null) {
                Bitmap.createScaledBitmap(cizim.bitmap, IKON_BOYUTU, IKON_BOYUTU, true)
            } else {
                val yeni = Bitmap.createBitmap(IKON_BOYUTU, IKON_BOYUTU, Bitmap.Config.ARGB_8888)
                val tuval = Canvas(yeni)
                cizim.setBounds(0, 0, tuval.width, tuval.height)
                cizim.draw(tuval)
                yeni
            }
            val akis = ByteArrayOutputStream()
            resim.compress(Bitmap.CompressFormat.PNG, 100, akis)
            "data:image/png;base64," + Base64.encodeToString(akis.toByteArray(), Base64.NO_WRAP)
        } catch (hata: Exception) {
            ""
        }
    }
}
