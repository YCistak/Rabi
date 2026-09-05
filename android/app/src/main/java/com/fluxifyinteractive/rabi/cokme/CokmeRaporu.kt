package com.fluxifyinteractive.rabi.cokme

import android.content.Context
import android.os.Build
import android.webkit.WebView
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.fluxifyinteractive.rabi.BuildConfig

/**
 * Crashlytics'e dokunan **tek** yer.
 *
 * Firebase çağrıları uygulamanın geri kalanına dağılmasın diye her şey burada
 * toplandı; başka hiçbir dosya `FirebaseCrashlytics` import etmiyor. Sebebi
 * `AGENTS.md`'deki "dış servise çıkma" kuralı: ağa çıkan yerin tek ve
 * gözden geçirilebilir olması gerekiyor (`lib/hata-gonder.ts` de aynı sebeple
 * tek dosya).
 *
 * **Her çağrı sessizce başarısız olabilmeli.** `google-services.json` depoda
 * yok (`.gitignore`'da); dosyasız derlenen bir APK'da Firebase hiç
 * ilklenmemiş olur ve `getInstance()` istisna fırlatır. O durumda uygulama
 * çalışmaya devam etmeli, yalnızca raporlama olmamalı — bu yüzden her şey
 * `runCatching` içinde.
 */
object CokmeRaporu {

    /**
     * Bir oturumda gönderilecek en fazla web hatası.
     *
     * Bozuk bir render döngüsü saniyede yüzlerce `console.error` üretebiliyor.
     * Crashlytics'in kendi oturum başına 64 non-fatal sınırı var ama o sınıra
     * dayanmak, gerçek hatanın gürültüyle dolmuş bir kotanın arkasında
     * kalması demek. Kendi sınırımız daha erken devreye giriyor.
     */
    private const val OTURUM_SINIRI = 32

    /** Aynı hatanın tekrarları — ilk kaydından sonra sayılıyor, gönderilmiyor. */
    private val gorulenler = HashSet<String>()

    @Volatile
    private var sayac = 0

    private fun crashlytics(): FirebaseCrashlytics? =
        runCatching { FirebaseCrashlytics.getInstance() }.getOrNull()

    /**
     * Açılışta bir kez: raporun okunabilmesi için gereken sabit bilgiler.
     *
     * WebView paket sürümü burada en kritik anahtar. Bu bir WebView
     * uygulaması; çökmelerin önemli bir kısmının sebebi uygulamanın kendi
     * kodu değil, cihazdaki Android System WebView sürümü oluyor. O sürüm
     * raporda yazmazsa "bazı cihazlarda çöküyor" deyip kalırız.
     */
    fun hazirla(context: Context) {
        val c = crashlytics() ?: return
        runCatching {
            c.setCustomKey("derleme", BuildConfig.BUILD_TYPE)
            c.setCustomKey("webview_surumu", webViewSurumu(context))
            c.setCustomKey("android_sdk", Build.VERSION.SDK_INT)
            c.setCustomKey("cihaz", "${Build.MANUFACTURER} ${Build.MODEL}")
        }
    }

    /**
     * Gönderilmeyi bekleyen rapor var mı — ve önceki oturum çökmeyle mi bitti.
     *
     * Otomatik toplama **hiçbir zaman açılmıyor** (manifest'teki
     * `firebase_crashlytics_collection_enabled=false` kalıcı). Crashlytics bu
     * durumda çökmeyi yine yakalayıp cihazda saklıyor ama yüklemiyor; karar
     * kullanıcıya kalıyor. Akış budur:
     *
     *   çökme → uygulama yeniden açılır → burası "bekleyen var" der →
     *   kullanıcıya sorulur → [gonder] ya da [sil]
     *
     * `didCrashOnPreviousExecution` ayrıca soruluyor çünkü bekleyen rapor
     * yalnızca çökmeden gelmiyor: WebView kanallarının yazdığı non-fatal
     * kayıtlar da kuyruğa giriyor. Soruyu "uygulama çöktü" diye sormak ancak
     * gerçekten çöktüyse doğru.
     */
    fun bekleyenleriSor(cevap: (bekleyen: Boolean, oncekiCokme: Boolean) -> Unit) {
        val c = crashlytics()
        if (c == null) {
            cevap(false, false)
            return
        }
        val cokmeyleBitti = runCatching { c.didCrashOnPreviousExecution() }.getOrDefault(false)
        runCatching {
            c.checkForUnsentReports().addOnCompleteListener { gorev ->
                cevap(gorev.isSuccessful && gorev.result == true, cokmeyleBitti)
            }
        }.onFailure { cevap(false, cokmeyleBitti) }
    }

    /** Kullanıcı "gönder" dedi. */
    fun bekleyenleriGonder() {
        crashlytics()?.let { runCatching { it.sendUnsentReports() } }
    }

    /** Kullanıcı "gönderme" dedi — kayıtlar cihazdan siliniyor, bir daha sorulmuyor. */
    fun bekleyenleriSil() {
        crashlytics()?.let { runCatching { it.deleteUnsentReports() } }
    }

    /**
     * Web tarafından gelen bir hatayı non-fatal olarak kaydeder.
     *
     * `kaynak` raporun nereden geldiğini söylüyor (`console`, `window.onerror`,
     * `render-process`, `kaynak-yuklenemedi`, `ssl`). Crashlytics gruplamayı
     * istisnanın türü ve yığınının tepesine göre yapıyor; kaynağı ayrı bir
     * istisna sınıfına değil özel anahtara koyduk ki tek bir "web hatası"
     * başlığı altında toplanıp kaynağa göre süzülebilsin.
     */
    fun kaydet(kaynak: String, mesaj: String, yigin: String? = null, ek: Map<String, String> = emptyMap()) {
        val c = crashlytics() ?: return
        val imza = "$kaynak|$mesaj"

        synchronized(gorulenler) {
            if (sayac >= OTURUM_SINIRI) return
            if (!gorulenler.add(imza)) return
            sayac++
        }

        runCatching {
            c.setCustomKey("hata_kaynagi", kaynak)
            for ((ad, deger) in ek) c.setCustomKey(ad, deger)
            c.log("[$kaynak] $mesaj")
            c.recordException(WebHatasi(mesaj).also { it.stackTrace = yiginCoz(yigin, kaynak) })
        }
    }

    /**
     * JS yığınını Java yığınına çevirir.
     *
     * Bu dönüşüm olmadan Crashlytics'e düşen her web hatası aynı Kotlin
     * satırını (yani `kaydet`'in kendisini) tepe kare olarak görür ve
     * **hepsi tek bir gruba** düşer — beş farklı hata tek satır gibi görünür.
     * Kareleri JS yığınından üretince gruplama gerçek hataya göre oluyor.
     *
     * Beklenen biçimler (V8):
     *   `    at fnAdi (https://localhost/_next/static/chunks/abc.js:1:234)`
     *   `    at https://localhost/_next/static/chunks/abc.js:1:234`
     */
    private fun yiginCoz(yigin: String?, kaynak: String): Array<StackTraceElement> {
        if (yigin.isNullOrBlank()) {
            return arrayOf(StackTraceElement("web", kaynak, null, -1))
        }
        val kareler = yigin.lineSequence()
            .mapNotNull { KARE.find(it.trim()) }
            .map { eslesme ->
                val (fn, dosya, satir) = eslesme.destructured
                StackTraceElement(
                    dosyaAdi(dosya),
                    fn.ifBlank { "(anonim)" },
                    dosyaAdi(dosya),
                    satir.toIntOrNull() ?: -1,
                )
            }
            .take(32)
            .toList()

        return if (kareler.isEmpty()) arrayOf(StackTraceElement("web", kaynak, null, -1))
        else kareler.toTypedArray()
    }

    /** `https://localhost/_next/static/chunks/abc.js` → `abc.js` */
    private fun dosyaAdi(url: String): String =
        url.substringBefore('?').substringAfterLast('/').ifBlank { "web" }

    private fun webViewSurumu(context: Context): String = runCatching {
        WebView.getCurrentWebViewPackage()?.let { "${it.packageName} ${it.versionName}" } ?: "bilinmiyor"
    }.getOrDefault("bilinmiyor")

    private val KARE = Regex("""^at\s+(?:([^\s(]+)\s+\()?(\S+?):(\d+):(\d+)\)?$""")
}

/**
 * Web tarafından gelen hataların istisna türü.
 *
 * Ayrı bir sınıf olması Crashlytics'te "Non-fatals" listesinde tek başlık
 * altında toplanmasını sağlıyor. Yığın izi JS'ten geldiği için bu sınıfın
 * kendi `fillInStackTrace`'i işe yaramaz — zaten `kaydet` içinde
 * `stackTrace` elle yazılıyor.
 */
class WebHatasi(mesaj: String) : RuntimeException(mesaj)
