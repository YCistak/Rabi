package com.fluxifyinteractive.rabi.degerlendirme

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.play.core.review.ReviewManagerFactory

/**
 * Mağazanın kendi değerlendirme penceresini isteyen köprü.
 *
 * Pencerenin gösterilmesi Play'in kotasına ve kararına bağlıdır; uygulama
 * değerlendirme vermeyi ya da vermemeyi burada hiçbir zaman öğrenmez. Bu
 * nedenle her sonuç web tarafına başarılı dönüyor, yan hizmet uygulamayı
 * düşüremiyor.
 */
@CapacitorPlugin(name = "Degerlendirme")
class DegerlendirmeEklentisi : Plugin() {

    private val yonetici by lazy { ReviewManagerFactory.create(context) }

    @PluginMethod
    fun iste(cagri: PluginCall) {
        val etkinlik = activity
        if (etkinlik == null) {
            cagri.resolve()
            return
        }

        runCatching {
            yonetici.requestReviewFlow()
                .addOnSuccessListener { bilgi ->
                    runCatching {
                        yonetici.launchReviewFlow(etkinlik, bilgi)
                            .addOnCompleteListener { cagri.resolve() }
                    }.onFailure { cagri.resolve() }
                }
                .addOnFailureListener { cagri.resolve() }
        }.onFailure { cagri.resolve() }
    }
}
