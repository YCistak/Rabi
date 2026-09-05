package com.fluxifyinteractive.rabi.cokme

import android.net.http.SslError
import android.webkit.RenderProcessGoneDetail
import android.webkit.SslErrorHandler
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import com.getcapacitor.Bridge
import com.getcapacitor.BridgeWebViewClient

/**
 * Capacitor'ın `BridgeWebViewClient`'ına raporlama ekler.
 *
 * **Neden alt sınıf, neden `WebViewListener` değil?** Capacitor'ın
 * `bridge.addWebViewListener()` mekanizması alt sınıf gerektirmeyen daha temiz
 * bir yol gibi duruyor, ama geri çağrılar hata **detayını taşımıyor**:
 * `WebViewListener.onReceivedError(webView: WebView)` — imzanın tamamı bu
 * (`WebViewListener.java:20-27`). Hangi URL, hangi hata kodu, hangi açıklama:
 * hiçbiri gelmiyor, yani raporlanacak bir şey kalmıyor. Ayrıca
 * `onReceivedSslError` `BridgeWebViewClient`'ta hiç override edilmemiş ve
 * listener'ı da yok. Bu yüzden alt sınıf + `bridge.setWebViewClient()`
 * (`Bridge.java:1456`) tek yol.
 *
 * Her override önce `super`'i çağırıyor: Capacitor'ın kendi işi (hata
 * sayfasına yönlendirme, listener dağıtımı, `bridge.reset()`) bozulmamalı.
 */
class RaporlayanWebViewClient(private val bridge: Bridge) : BridgeWebViewClient(bridge) {

    /**
     * Render süreci öldü.
     *
     * Bu, bir WebView uygulamasında **en sinsi** çökme türü: uygulama süreci
     * hayatta kalır, Crashlytics hiçbir şey görmez, kullanıcı beyaz bir ekrana
     * bakar ve "donuyor" der. Varsayılan Capacitor davranışında bu metot
     * `false` dönüyor (`BridgeWebViewClient.java:92-105`, dinleyici yoksa) ve
     * sistem uygulamayı öldürüyor.
     *
     * **`reload()` neden çağrılmıyor:** Android belgeleri render süreci
     * öldükten sonra `WebView` örneğinin **kullanılamaz** olduğunu söylüyor —
     * görünüm ağacından çıkarılıp yok edilmesi gerekiyor. Ölü bir WebView'de
     * `reload()` çağırmak sessizce hiçbir şey yapmıyor ya da ikinci bir çökme
     * üretiyor. İstenen sonuç ("ölüp beyaz ekranda kalma, kendini toparla")
     * doğru yoldan alınıyor: Activity yeniden kuruluyor, Capacitor köprüsü
     * sıfırdan yeni bir WebView yaratıyor.
     *
     * Yeniden kurma **sınırlı**: sürekli çöken bir render'da sonsuz döngüye
     * girip pil yakmak, bir kez ölmekten kötü. Sınır aşılınca `false` dönüp
     * eski davranışa (sistem uygulamayı öldürür) bırakılıyor.
     */
    override fun onRenderProcessGone(view: WebView?, detail: RenderProcessGoneDetail?): Boolean {
        super.onRenderProcessGone(view, detail)

        val cokme = detail?.didCrash() ?: false
        CokmeRaporu.kaydet(
            kaynak = "render-process",
            mesaj = if (cokme) {
                "WebView render süreci çöktü"
            } else {
                // Süreç çökmedi, sistem belleği geri almak için öldürdü.
                // Ayrımı kaybetmemek önemli: ilki bizim hatamız olabilir,
                // ikincisi cihazın dar bellekte olduğunu söylüyor.
                "WebView render sürecini sistem sonlandırdı (bellek)"
            },
            ek = mapOf(
                "render_cokme" to cokme.toString(),
                "render_oncelik" to (detail?.rendererPriorityAtExit()?.toString() ?: "bilinmiyor"),
                "yeniden_kurma" to yenidenKurma.toString(),
            ),
        )

        if (yenidenKurma >= YENIDEN_KURMA_SINIRI) return false

        yenidenKurma++
        bridge.activity?.let { etkinlik ->
            // Ölü WebView görünüm ağacında; `recreate()` etkinliği yıkarken
            // onu da yok ediyor ve Capacitor yeni bir tane kuruyor.
            etkinlik.runOnUiThread { runCatching { etkinlik.recreate() } }
        } ?: return false

        return true
    }

    /**
     * Bir kaynak yüklenemedi.
     *
     * Uygulamanın web varlıkları APK'nın içinden (`assets/public`) geliyor,
     * yani buradaki bir hata neredeyse her zaman ağ sorunu değil **bozuk
     * paket** demek: `cap sync` eksik çalışmış ya da dosya APK'ya girmemiş.
     * Ana çerçevedeki hata kullanıcının boş ekran görmesi anlamına geliyor;
     * alt kaynaklar (görsel, yazı tipi) daha sessiz. İkisi ayrı etiketleniyor.
     */
    override fun onReceivedError(
        view: WebView?,
        request: WebResourceRequest?,
        error: WebResourceError?,
    ) {
        super.onReceivedError(view, request, error)

        val anaCerceve = request?.isForMainFrame ?: false
        CokmeRaporu.kaydet(
            kaynak = if (anaCerceve) "kaynak-yuklenemedi-ana" else "kaynak-yuklenemedi",
            mesaj = "${error?.errorCode ?: 0}: ${error?.description ?: "bilinmiyor"}",
            ek = mapOf(
                "istek_url" to (request?.url?.toString() ?: "bilinmiyor"),
                "ana_cerceve" to anaCerceve.toString(),
            ),
        )
    }

    /**
     * HTTP durum kodu hatası (4xx/5xx).
     *
     * Yerel varlıklarda beklenmez; çıkarsa `CapacitorHttp` üzerinden giden
     * hatalı soru bildirimi ya da bir plugin isteğidir. Yalnızca ana çerçeve
     * raporlanıyor — alt istekler için `lib/hata-gonder.ts` zaten kendi
     * durum kodunu okuyor, ikinci kez raporlamak gürültü olur.
     */
    override fun onReceivedHttpError(
        view: WebView?,
        request: WebResourceRequest?,
        errorResponse: WebResourceResponse?,
    ) {
        super.onReceivedHttpError(view, request, errorResponse)
        if (request?.isForMainFrame != true) return

        CokmeRaporu.kaydet(
            kaynak = "http-hatasi",
            mesaj = "HTTP ${errorResponse?.statusCode ?: 0}",
            ek = mapOf("istek_url" to (request.url?.toString() ?: "bilinmiyor")),
        )
    }

    /**
     * SSL hatası.
     *
     * `super` çağrılıyor ve **kesinlikle `handler.proceed()` çağrılmıyor**:
     * varsayılan davranış isteği iptal etmek, doğrusu da bu. Buradaki tek iş
     * raporlamak. Bir gün "sertifika hatası alıyoruz" diye bir sorun çıkarsa
     * hangi hata kodu olduğu raporda yazsın diye duruyor.
     */
    override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
        CokmeRaporu.kaydet(
            kaynak = "ssl",
            mesaj = "SSL hatası: ${error?.primaryError ?: -1}",
            ek = mapOf("ssl_url" to (error?.url ?: "bilinmiyor")),
        )
        super.onReceivedSslError(view, handler, error)
    }

    private companion object {
        /**
         * Süreç ömrü boyunca kaç kez yeniden kurulacağı.
         *
         * İki, "bir kez şansızlık" ile "bu cihazda sürekli çöküyor" arasını
         * ayırmaya yetiyor. Sayaç `companion object`'te çünkü etkinlik yeniden
         * kurulunca client de yeniden yaratılıyor — örnek alanı olsaydı sayaç
         * her seferinde sıfırlanır, sınır hiç devreye girmezdi.
         */
        const val YENIDEN_KURMA_SINIRI = 2

        @Volatile
        var yenidenKurma = 0
    }
}
