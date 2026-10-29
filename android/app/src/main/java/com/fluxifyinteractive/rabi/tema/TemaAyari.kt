package com.fluxifyinteractive.rabi.tema

import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.os.Build
import androidx.appcompat.app.AppCompatDelegate

/**
 * Uygulamanın tema tercihi yerli tarafta (plan: docs/koyu-tema-plani.md).
 *
 * Web tercihi `localStorage`da tutuyor (`Ayarlar.tema`), ama yerli açılış
 * ekranı, sistem çubukları ve odak engel katmanı web yüklenmeden çiziliyor;
 * onlar web kaydını okuyamıyor. Web tercih değişince `TemaEklentisi` buraya da
 * yazıyor, açılışta `RabiUygulamasi` buradan okuyup gece modunu kuruyor.
 *
 * Gece modu **uygulamanın** tercihine bağlı: "Açık" seçen kullanıcıda telefonun
 * gece modu uygulamayı karartmıyor, "Telefona uy"da karartıyor. `values-night`
 * kaynakları (açılış zemini, engel katmanı) böylece yalnız koyu görünen
 * kullanıcıda devreye giriyor. Kayıt yoksa (ilk yükleme) "Telefona uy" —
 * web'deki varsayılanla aynı (`lib/tema.ts`).
 */
object TemaAyari {
    private const val DOSYA = "rabi_tema"
    private const val ANAHTAR = "tercih"

    fun oku(baglam: Context): String =
        baglam.getSharedPreferences(DOSYA, Context.MODE_PRIVATE).getString(ANAHTAR, null) ?: "sistem"

    fun yaz(baglam: Context, tercih: String) {
        baglam.getSharedPreferences(DOSYA, Context.MODE_PRIVATE).edit().putString(ANAHTAR, tercih).apply()
    }

    private fun appCompatModu(tercih: String): Int = when (tercih) {
        "acik" -> AppCompatDelegate.MODE_NIGHT_NO
        "koyu" -> AppCompatDelegate.MODE_NIGHT_YES
        else -> AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
    }

    /**
     * Kayıtlı tercihi uygular. Android 12+'ta `setApplicationNightMode`: sistemin
     * çizdiği açılış ekranı da bunu izliyor (bir sonraki soğuk açılıştan
     * itibaren). Altında AppCompat'in gece modu; etkinlik manifest'te `uiMode`
     * değişikliğini kendisi karşıladığı için yeniden kurulmuyor, WebView
     * yeniden yüklenmiyor.
     */
    fun uygula(baglam: Context, tercih: String = oku(baglam)) {
        AppCompatDelegate.setDefaultNightMode(appCompatModu(tercih))
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val yonetici = baglam.getSystemService(UiModeManager::class.java) ?: return
            yonetici.setApplicationNightMode(
                when (tercih) {
                    "acik" -> UiModeManager.MODE_NIGHT_NO
                    "koyu" -> UiModeManager.MODE_NIGHT_YES
                    else -> UiModeManager.MODE_NIGHT_AUTO
                },
            )
        }
    }

    /**
     * Servisten açılan pencereler (odak engel katmanı) için tercihe göre gece
     * yapılandırmalı bağlam. AppCompat'in gece modu yalnız etkinliklere
     * işliyor; servis kendi bağlamıyla şişirseydi koyu kullanıcıya açık katman
     * çıkardı.
     */
    fun baglam(baglam: Context): Context {
        val sistemKoyu = (baglam.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES
        val koyu = when (oku(baglam)) {
            "koyu" -> true
            "acik" -> false
            else -> sistemKoyu
        }
        val yapilandirma = Configuration(baglam.resources.configuration)
        yapilandirma.uiMode = (yapilandirma.uiMode and Configuration.UI_MODE_NIGHT_MASK.inv()) or
            (if (koyu) Configuration.UI_MODE_NIGHT_YES else Configuration.UI_MODE_NIGHT_NO)
        return baglam.createConfigurationContext(yapilandirma)
    }
}
