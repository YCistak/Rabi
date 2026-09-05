package com.fluxifyinteractive.rabi.odak

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * Odak kilidinin web tarafıyla köprüsü.
 *
 * Kilit bir **engel**, kilit değil: kullanıcı izinleri geri alabilir,
 * uygulamayı zorla durdurabilir. Root olmadan gerçek kilit yazılamıyor.
 * Bu yüzden buradaki her yöntem, izin yoksa hata fırlatmak yerine "kapalı"
 * bilgisini döner — özellik çalışmasa da uygulama çalışmaya devam etmeli.
 */
@CapacitorPlugin(name = "OdakKilidi")
class OdakKilidiEklentisi : Plugin() {

    /** İki özel iznin durumu; arayüz eksik olanı gösterip düzeltme sunuyor. */
    @PluginMethod
    fun durum(cagri: PluginCall) {
        val sonuc = JSObject()
        sonuc.put("kullanimVerisi", Izinler.kullanimVerisiVar(context))
        sonuc.put("katman", Izinler.katmanVar(context))
        sonuc.put("rahatsizEtme", Izinler.rahatsizEtmeVar(context))
        sonuc.put("calisiyor", OdakServisi.calisiyor)
        cagri.resolve(sonuc)
    }

    /**
     * İzin ekranını açar. Sistem ayarlarına götürüyor; kullanıcı geri
     * döndüğünde sonucu öğrenmek için arayüz `durum`u yeniden sorar.
     */
    @PluginMethod
    fun izinEkraniniAc(cagri: PluginCall) {
        val hangi = cagri.getString("izin") ?: ""
        val acildi = when (hangi) {
            "kullanimVerisi" -> Izinler.kullanimVerisiEkraniniAc(context)
            "katman" -> Izinler.katmanEkraniniAc(context)
            "rahatsizEtme" -> Izinler.rahatsizEtmeEkraniniAc(context)
            else -> false
        }
        cagri.resolve(JSObject().put("acildi", acildi))
    }

    /** Kilitlenebilecek uygulamalar — ikonlarıyla birlikte. */
    @PluginMethod
    fun uygulamalar(cagri: PluginCall) {
        cagri.resolve(JSObject().put("uygulamalar", UygulamaListesi.listele(context)))
    }

    /**
     * Çalışma turu başladı. `bitisZamani` epoch milisaniye; katmandaki geri
     * sayım buradan besleniyor, süre web tarafında tutulmuyor — uygulama
     * arka plandayken JS zamanlayıcıları durabiliyor.
     */
    @PluginMethod
    fun baslat(cagri: PluginCall) {
        val paketler = cagri.getArray("paketler")?.toList<String>() ?: emptyList()
        val bitisZamani = cagri.getLong("bitisZamani") ?: 0L
        val ders = cagri.getString("ders")
        val asama = cagri.getString("asama")
        val rahatsizEtmeIstendi = cagri.getBoolean("rahatsizEtme", false) == true

        /*
          İki iş birbirinden ayrı: uygulamaları engellemek ve telefonu
          susturmak. Kullanıcı ikisini pomodoro ekranından tek tek açıp
          kapatabiliyor ve her birinin kendi izni var — biri eksikken öteki
          çalışmaya devam etmeli.

          Servis artık ikisi de kapalıyken de kuruluyor: asıl işi kilit değil
          kilit ekranındaki sayaç ve o sayaç hiçbir izin istemiyor. Eskiden
          burada bir "hiçbiri yoksa başlatma" dalı vardı ve odak kilidini hiç
          açmamış kullanıcı — yani çoğunluk — bildirimi hiç görmezdi.
        */
        val kilitVar = paketler.isNotEmpty() && Izinler.hepsiVar(context)
        val susturmaVar = rahatsizEtmeIstendi && Izinler.rahatsizEtmeVar(context)

        OdakServisi.baslat(
            context,
            // Kilit kurulamıyorsa liste boş gidiyor: servis o zaman öne gelen
            // uygulamayı hiç sorgulamıyor, yalnızca sayacı ve susturmayı yönetiyor.
            if (kilitVar) ArrayList(paketler) else ArrayList(),
            bitisZamani,
            ders,
            asama,
            susturmaVar,
        )
        cagri.resolve(JSObject().put("basladi", true))
    }

    /**
     * Sayaç duraklatıldı — uygulamanın kendi düğmesinden.
     *
     * Servis durdurulmuyor: duraklatmak turdan çıkmak değil ve bildirim
     * ekrandan kalksaydı duraklatılmış tur kilit ekranında yok olurdu.
     */
    @PluginMethod
    fun duraklat(cagri: PluginCall) {
        OdakServisi.duraklat(context)
        cagri.resolve()
    }

    /*
      "Devam" için eş bir yöntem yok: uygulamanın kendi Başlat düğmesi servisi
      `baslat` ile baştan kuruyor ve o zaten duraklamayı sıfırlıyor. Devam
      yalnızca bildirimin kendi düğmesinden geliyor, yani servisin içinde
      kalıyor.
    */

    /** Tur bitti, mola başladı ya da kullanıcı kilidi kapattı. */
    @PluginMethod
    fun bitir(cagri: PluginCall) {
        OdakServisi.durdur(context)
        cagri.resolve()
    }

    override fun load() {
        ornek = this
    }

    override fun handleOnDestroy() {
        if (ornek === this) ornek = null
        super.handleOnDestroy()
    }

    companion object {
        /**
         * Katmandaki "kilidi kapat" düğmesi web tarafına haber verebilsin diye.
         * Uygulama o sırada arka planda; olay kullanıcı Rabi'ye döndüğünde
         * işleniyor. Süreç bu arada öldüyse arayüz durum() ile toparlıyor.
         */
        @Volatile
        private var ornek: OdakKilidiEklentisi? = null

        fun kilitKapatildiBildir() {
            ornek?.notifyListeners("kilitKapatildi", JSObject())
        }

        /**
         * Bildirimdeki düğmeye basıldı.
         *
         * Sayacın iki kopyası var — biri serviste, biri web'de — ve düğme
         * yalnızca birine dokunuyor. Haber gitmezse uygulamaya dönen kullanıcı,
         * bildirimden duraklattığı turu hâlâ işlerken buluyor.
         *
         * `bitisZamani` yalnızca "devam" komutunda dolu: web'deki sayaç mutlak
         * bir zaman damgasından okunuyor, "devam ettim" demek yetmiyor, hangi
         * ana kadar olduğu söylenmeli.
         *
         * Uygulama süreci ölmüşse dinleyici yok ve komut yalnızca serviste
         * kalıyor; bu bir kayıp değil, web'deki sayaç zaten süreçle birlikte
         * ölmüştü.
         */
        fun pomodoroKomutuBildir(komut: String, bitisZamani: Long) {
            val veri = JSObject().put("komut", komut).put("bitisZamani", bitisZamani)
            ornek?.notifyListeners("pomodoroKomutu", veri)
        }
    }
}
