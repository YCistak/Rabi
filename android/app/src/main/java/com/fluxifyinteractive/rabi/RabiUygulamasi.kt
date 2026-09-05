package com.fluxifyinteractive.rabi

import android.app.Application
import com.fluxifyinteractive.rabi.cokme.CokmeRaporu

/**
 * Uygulamanın Application sınıfı.
 *
 * Projede daha önce yoktu; Capacitor şablonu manifest'te `android:name`
 * vermiyor ve varsayılan `android.app.Application` kullanılıyordu. Çökme
 * raporlaması için gerekti: raporun okunabilmesini sağlayan sabit anahtarlar
 * (WebView sürümü, cihaz, derleme türü) **ilk etkinlik açılmadan önce**
 * yazılmalı, yoksa açılışta olan bir çökmede eksik kalıyorlar.
 *
 * Burada bilinçli olarak **yapılmayan** iki şey var:
 *
 * 1. Kendi `Thread.UncaughtExceptionHandler`'ımızı kurmuyoruz. Crashlytics
 *    kendi handler'ını kuruyor ve bir öncekini zincire alıyor; araya girmek
 *    zincirin kopmasına ve JVM çökmelerinin hiç raporlanmamasına yol açıyor.
 *    İhtiyaç olan yerde `CokmeRaporu.kaydet()` çağrılıyor.
 * 2. Toplamayı açmıyoruz. Varsayılan manifest'te kapalı; yalnızca kullanıcı
 *    Ayarlar'dan onay verince açılıyor (`CokmeEklentisi.izinAyarla`).
 */
class RabiUygulamasi : Application() {

    override fun onCreate() {
        super.onCreate()
        // Firebase'i ilkleyen ContentProvider `onCreate`'ten önce çalışıyor
        // (sistem sağlayıcıları `attachBaseContext` ile `onCreate` arasında
        // kuruyor), yani burada Crashlytics örneği hazır.
        CokmeRaporu.hazirla(this)
    }
}
