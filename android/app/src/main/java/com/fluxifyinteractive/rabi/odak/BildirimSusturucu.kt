package com.fluxifyinteractive.rabi.odak

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * Çalışma turu sürerken **yalnızca kilitli uygulamaların** bildirimlerini siler.
 *
 * Engel katmanı uygulamayı açmayı zorlaştırıyordu ama dikkati dağıtan şey çoğu
 * zaman uygulamanın kendisi değil, tepeden düşen bildirim: kullanıcı zaten
 * telefona bakmıyorken "biri seni etiketledi" yazısı ekrana geliyor ve tur
 * orada bitiyor. Katmanı görmek için önce uygulamayı açmaya karar vermek
 * gerekiyor; bildirim ise karar vermeden geliyor.
 *
 * **Neden "Rahatsız Etme" değil:** DND bütün bildirimleri birden susturur —
 * annenin araması da, alarm da. Kullanıcı seçtiği beş uygulamayı kapatmak
 * isterken telefonunun tamamını sessize alamaz; o zaman özelliği hiç açmaz.
 * Bildirim dinleyicisi paket başına çalışan tek yol.
 *
 * **Sınırı var ve gizlenmiyor:** bildirim önce sisteme düşüyor, biz sonra
 * siliyoruz. Yani bir an için tepede belirebiliyor ve telefonun ses ayarına
 * göre kısa bir ses çıkabiliyor. Silinen bildirim geri gelmiyor; tur bitince
 * uygulama yeni bildirimlerini normal gönderiyor. Bunu "bildirim gelmez" diye
 * yazmak yanlış olurdu.
 *
 * İzin verilmezse sınıf hiç çalışmıyor ve kilidin geri kalanı etkilenmiyor:
 * bildirim susturma **isteğe bağlı** bir ek, kilidin şartı değil.
 */
class BildirimSusturucu : NotificationListenerService() {

    override fun onListenerConnected() {
        super.onListenerConnected()
        ornek = this
        // Bağlantı tur başladıktan sonra da kurulabiliyor (sistem servisi kendi
        // zamanlamasıyla bağlıyor); o ana kadar birikmiş olanlar da silinsin.
        birikenleriSil()
    }

    override fun onListenerDisconnected() {
        if (ornek === this) ornek = null
        super.onListenerDisconnected()
    }

    override fun onNotificationPosted(bildirim: StatusBarNotification?) {
        val paket = bildirim?.packageName ?: return
        if (!aktif || !yasakli.contains(paket)) return
        sil(bildirim)
    }

    /**
     * Silinemeyecek bildirimler var: sistemin kendi kalıcı bildirimleri
     * (`FLAG_ONGOING_EVENT`) ve müzik çalar gibi silinemez işaretlenmiş olanlar.
     * Denemek çökertmiyor ama boşuna; yine de kontrol açık yazıldı, çünkü
     * "neden bu bildirim gitmedi" sorusunun cevabı burada.
     */
    private fun sil(bildirim: StatusBarNotification) {
        if (!bildirim.isClearable) return
        try {
            cancelNotification(bildirim.key)
        } catch (hata: Exception) {
            // Bağlantı o an kopmuş olabilir; tur bundan etkilenmemeli.
        }
    }

    private fun birikenleriSil() {
        if (!aktif) return
        try {
            activeNotifications?.forEach { bildirim ->
                if (yasakli.contains(bildirim.packageName)) sil(bildirim)
            }
        } catch (hata: Exception) {
            // Servis henüz hazır değilse liste okunamıyor; sonraki bildirimler
            // yine de yakalanacak.
        }
    }

    companion object {
        /**
         * Tur sürüyor mu ve hangi paketler susturulacak.
         *
         * Statik tutuluyor çünkü dinleyici servisini **sistem** başlatıyor ve
         * ne zaman bağlanacağına o karar veriyor; ona doğrudan `Intent` yollamak
         * güvenilir değil. `OdakServisi` turu başlatırken buraya yazıyor,
         * bitirirken temizliyor.
         */
        @Volatile
        private var yasakli: Set<String> = emptySet()

        @Volatile
        private var aktif = false

        @Volatile
        private var ornek: BildirimSusturucu? = null

        fun baslat(paketler: Set<String>) {
            yasakli = paketler
            aktif = true
            ornek?.birikenleriSil()
        }

        fun durdur() {
            aktif = false
            yasakli = emptySet()
        }
    }
}
