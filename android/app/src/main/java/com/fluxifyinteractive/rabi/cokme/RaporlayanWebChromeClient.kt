package com.fluxifyinteractive.rabi.cokme

import android.webkit.ConsoleMessage
import com.getcapacitor.Bridge
import com.getcapacitor.BridgeWebChromeClient

/**
 * `console.error` çıktısını Crashlytics'e taşır.
 *
 * Capacitor'ın kendi `onConsoleMessage`'ı mesajı yalnızca logcat'e yazıyor
 * (`BridgeWebChromeClient.java:426-448`) — yani cihazda USB kablosu takılı
 * değilse hiçbir yere. Kullanıcının telefonunda çıkan bir React hatası
 * bugüne kadar hiçbir iz bırakmıyordu.
 *
 * **Bu kanal tek başına yeterli değil.** Buradan gelen bilgi
 * `sourceId + lineNumber + message` üçlüsünden ibaret; gerçek JS yığın izi
 * yok. Yığın `lib/cokme.ts`'teki `window.onerror` kanalından geliyor ve
 * gruplaması çok daha iyi. İkisi birbirinin yedeği değil:
 * `window.onerror`'ın göremediği hataları (React'in kendi yakalayıp
 * `console.error`'a yazdıkları, üçüncü taraf kodun kendi yakaladıkları)
 * ancak burası görüyor.
 */
class RaporlayanWebChromeClient(bridge: Bridge) : BridgeWebChromeClient(bridge) {

    override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
        // Capacitor'ın logcat davranışı korunuyor — geliştirirken hâlâ
        // `adb logcat` ile bakılıyor.
        val sonuc = super.onConsoleMessage(consoleMessage)

        val mesaj = consoleMessage?.message()
        if (mesaj != null &&
            consoleMessage.messageLevel() == ConsoleMessage.MessageLevel.ERROR &&
            // Capacitor'ın kendi gürültü filtresi: köprünün `%cnative %c` gibi
            // biçimlendirilmiş iç mesajları hata değil.
            isValidMsg(mesaj)
        ) {
            CokmeRaporu.kaydet(
                kaynak = "console",
                mesaj = mesaj.take(SINIR),
                ek = mapOf(
                    "console_kaynak" to (consoleMessage.sourceId() ?: "bilinmiyor"),
                    "console_satir" to consoleMessage.lineNumber().toString(),
                ),
            )
        }

        return sonuc
    }

    private companion object {
        /**
         * Mesajın kesildiği uzunluk.
         *
         * Crashlytics özel anahtarlarda 1 KB sınırı koyuyor, istisna mesajında
         * daha cömert; ama uzun bir React hata mesajının tamamı (bileşen
         * ağacıyla birlikte) raporun başlığını okunmaz yapıyor. Gruplama da
         * mesaja bakıyor, yani uzun kuyruk aynı hatayı farklı gruplara böler.
         */
        const val SINIR = 400
    }
}
