package com.fluxifyinteractive.rabi.guncelleme

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability

/**
 * Play'deki yeni sürümü uygulamanın içinden haber veren köprü.
 *
 * Play güncellemeyi kendiliğinden itmiyor, bildirim de göndermiyor:
 * otomatik güncelleme açık telefonlarda bir iki gün içinde sessizce
 * kuruyor, kapalı olanlarda kullanıcı Play'de uygulamanın sayfasını açmadıkça
 * hiç öğrenmiyor. Kapalı betada bu, düzeltilmiş bir hatanın haftalarca eski
 * sürümde yaşanması demekti.
 *
 * `AGENTS.md`'deki "ağa çıkılmıyor" kuralının **üçüncü** istisnası ve
 * ötekilerden farklı: ağa çıkan bizim kodumuz değil, telefondaki Play Store
 * uygulaması. Buradan Play'e giden tek şey "bu paketin kurulu sürümü kaç"
 * — Play'in zaten bildiği bir bilgi. Kullanıcıya ait hiçbir veri geçmiyor.
 *
 * Kip **esnek** (`AppUpdateType.FLEXIBLE`): indirme arkada sürüyor,
 * kullanıcı uygulamayı kullanmaya devam ediyor ve yeniden başlatmaya kendisi
 * karar veriyor. Zorunlu kip (`IMMEDIATE`) uygulamayı tam ekran bir Play
 * penceresiyle kesiyor; onu hak eden bir sürüm henüz olmadı.
 *
 * Play'den kurulmamış kopyalarda (elden APK, derleme çıktısı) `appUpdateInfo`
 * hata döndürüyor; her yöntem bunu yutup "güncelleme yok" diyor. Çökme
 * eklentisindeki kural: bir yan hizmet uygulamayı düşüremez.
 */
@CapacitorPlugin(name = "Guncelleme")
class GuncellemeEklentisi : Plugin() {

    private val yonetici: AppUpdateManager by lazy { AppUpdateManagerFactory.create(context) }

    /**
     * İndirmenin durumu web'e olay olarak geçiyor; web tarafı şeridi ona göre
     * "indiriliyor" → "yeniden başlat" diye değiştiriyor.
     *
     * Dinleyici `baslat`ta kaydediliyor ve `INSTALLED`/`FAILED`/`CANCELED`
     * gelince kaldırılıyor: `DOWNLOADED`de kaldırılmıyor çünkü ondan sonra
     * `completeUpdate` ile `INSTALLING` de gelebiliyor.
     */
    private val dinleyici: InstallStateUpdatedListener = InstallStateUpdatedListener { durum ->
        val ad = when (durum.installStatus()) {
            InstallStatus.DOWNLOADING -> "indiriliyor"
            InstallStatus.DOWNLOADED -> "indirildi"
            InstallStatus.INSTALLING -> "kuruluyor"
            InstallStatus.INSTALLED -> "kuruldu"
            InstallStatus.FAILED, InstallStatus.CANCELED -> "basarisiz"
            else -> return@InstallStateUpdatedListener
        }
        val veri = JSObject()
        veri.put("durum", ad)
        notifyListeners("durum", veri)
        if (ad == "kuruldu" || ad == "basarisiz") {
            runCatching { yonetici.unregisterListener(dinleyici) }
        }
    }

    /**
     * Play'de yeni sürüm var mı — açılışta bir kez soruluyor.
     *
     * `indirildi`: bir önceki oturumda indirilmiş ama kurulmamış güncelleme.
     * Kullanıcı indirme sürerken uygulamayı kapatmış olabiliyor; bir sonraki
     * açılışta şerit doğrudan "yeniden başlat" hâliyle çıkmalı, yoksa Play'e
     * ikinci kez aynı paketi indirtiriz.
     */
    @PluginMethod
    fun kontrol(cagri: PluginCall) {
        val sonuc = JSObject()
        sonuc.put("var", false)
        sonuc.put("indirildi", false)
        runCatching {
            yonetici.appUpdateInfo
                .addOnSuccessListener { bilgi ->
                    if (bilgi.installStatus() == InstallStatus.DOWNLOADED) {
                        sonuc.put("var", true)
                        sonuc.put("indirildi", true)
                    } else if (
                        bilgi.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
                        bilgi.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)
                    ) {
                        sonuc.put("var", true)
                    }
                    cagri.resolve(sonuc)
                }
                .addOnFailureListener { cagri.resolve(sonuc) }
        }.onFailure { cagri.resolve(sonuc) }
    }

    /**
     * Kullanıcı "Güncelle" dedi: Play'in kendi onay penceresi açılıyor,
     * indirme arkada başlıyor.
     *
     * Çağrı pencere açılır açılmaz çözülüyor, indirme bitince değil: sonuç
     * `durum` olayından geliyor. Kullanıcı Play'in penceresinde "Hayır" derse
     * hiçbir olay gelmiyor ve şerit olduğu yerde duruyor — bir sonraki açılışta
     * yeniden sorulur.
     *
     * `appUpdateInfo` **yeniden** alınıyor; `kontrol`daki nesne tek kullanımlık
     * ve ikinci kez `startUpdateFlowForResult`a verilemiyor.
     */
    @PluginMethod
    fun baslat(cagri: PluginCall) {
        val etkinlik = activity
        if (etkinlik == null) {
            cagri.resolve()
            return
        }
        runCatching {
            yonetici.registerListener(dinleyici)
            yonetici.appUpdateInfo
                .addOnSuccessListener { bilgi ->
                    runCatching {
                        yonetici.startUpdateFlowForResult(
                            bilgi,
                            etkinlik,
                            AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build(),
                            ISTEK_KODU,
                        )
                    }
                    cagri.resolve()
                }
                .addOnFailureListener { cagri.resolve() }
        }.onFailure { cagri.resolve() }
    }

    /** Kullanıcı "Yeniden başlat" dedi: indirilen paket kuruluyor, uygulama yeniden açılıyor. */
    @PluginMethod
    fun tamamla(cagri: PluginCall) {
        runCatching { yonetici.completeUpdate() }
        cagri.resolve()
    }

    override fun handleOnDestroy() {
        runCatching { yonetici.unregisterListener(dinleyici) }
        super.handleOnDestroy()
    }

    private companion object {
        /** Sonuç `onActivityResult`a düşüyor ama okunmuyor; durum dinleyiciden geliyor. */
        const val ISTEK_KODU = 7261
    }
}
