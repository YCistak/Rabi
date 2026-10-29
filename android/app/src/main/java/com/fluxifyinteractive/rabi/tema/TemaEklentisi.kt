package com.fluxifyinteractive.rabi.tema

import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Web'in tema tercihini yerli tarafa taşıyan köprü (`lib/tema-yerli.ts`).
 * iOS'taki karşılığı `AnaDenetleyici.swift` → `TemaEklentisi`.
 */
@CapacitorPlugin(name = "Tema")
class TemaEklentisi : Plugin() {

    @PluginMethod
    fun ayarla(cagri: PluginCall) {
        val tercih = cagri.getString("tercih")
        if (tercih != "sistem" && tercih != "acik" && tercih != "koyu") {
            cagri.reject("tanınmayan tema: $tercih")
            return
        }
        TemaAyari.yaz(context, tercih)
        // Gece modu ana iş parçacığında değişmeli; AppCompat etkinliği
        // bilgilendiriyor (uiMode manifestte, yeniden kurulum yok).
        activity.runOnUiThread {
            TemaAyari.uygula(context, tercih)
            cagri.resolve()
        }
    }
}
