package com.rabi.app.odak

import android.content.Context
import android.graphics.PixelFormat
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ProgressBar
import android.widget.TextView
import java.util.Locale
import com.rabi.app.R

/**
 * Yasaklı uygulama öne geldiğinde üstüne konan tam ekran katman.
 *
 * Bu bir kilit değil, engel: kullanıcı ana ekrana çıkabilir, kilidi kapatabilir,
 * izni geri alabilir. Amaç refleksle açmayı zorlaştırmak — elini uzatınca
 * karşısına Rabi çıksın yeter.
 */
class EngelKatmani(private val baglam: Context) {

    private val pencereYonetici =
        baglam.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    private val elciler = Handler(Looper.getMainLooper())

    private var gorunum: View? = null
    private var bitisZamani = 0L
    /** Turun başladığı an — çubuk "ne kadarı geçti"yi bununla çiziyor. */
    private var baslangicZamani = 0L

    private val geriSayim = object : Runnable {
        override fun run() {
            sureyiYaz()
            elciler.postDelayed(this, 1000L)
        }
    }

    fun goster(baslangic: Long, bitis: Long, ders: String?) {
        baslangicZamani = baslangic
        bitisZamani = bitis
        // Katman zaten duruyorsa yeniden eklenmemeli: her döngü adımında
        // eklenirse ekran görünür biçimde titriyor.
        if (gorunum != null) return

        val yeni = LayoutInflater.from(baglam).inflate(R.layout.engel_katmani, null)
        yeni.isFocusableInTouchMode = true
        // Geri tuşu katmanı kapatmasın; çıkış yolu "Rabi'ye dön" ya da
        // "kilidi kapat" olmalı. Ana ekran tuşu zaten engellenemiyor, gerek de yok.
        yeni.setOnKeyListener { _, kod, _ -> kod == KeyEvent.KEYCODE_BACK }

        /*
          Çip ekranın ilk satırı ve tek işi nerede olunduğunu söylemek. Ders
          biliniyorsa onun adını yazıyor — "MATEMATİK", ekranın geri kalanı
          zaten kilidin ne olduğunu anlatıyor. Ders yoksa çip **kalıyor**:
          gizlendiğinde ekranın tepesi bir satır boşalıyor ve maskot yukarı
          kayıyordu.

          Büyütme Türkçe yerelle: varsayılan yerelde "İstanbul"un i'si
          noktasız İ oluyor ve ders adı yanlış yazılmış gibi duruyor.
        */
        yeni.findViewById<TextView>(R.id.odak_ders).text =
            if (ders.isNullOrBlank()) "DERS MODU AÇIK"
            else ders.uppercase(Locale("tr", "TR"))

        yeni.findViewById<View>(R.id.odak_don).setOnClickListener {
            baglam.packageManager.getLaunchIntentForPackage(baglam.packageName)?.let {
                it.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
                baglam.startActivity(it)
            }
            gizle()
        }

        val onay = yeni.findViewById<View>(R.id.odak_onay)
        val ana = yeni.findViewById<View>(R.id.odak_ana)
        yeni.findViewById<View>(R.id.odak_kapat).setOnClickListener {
            ana.visibility = View.GONE
            onay.visibility = View.VISIBLE
        }
        yeni.findViewById<View>(R.id.odak_vazgec).setOnClickListener {
            onay.visibility = View.GONE
            ana.visibility = View.VISIBLE
        }
        yeni.findViewById<View>(R.id.odak_kapat_onay).setOnClickListener {
            // Turun iptali web tarafının işi; burada yalnızca haber veriliyor.
            OdakKilidiEklentisi.kilitKapatildiBildir()
            OdakServisi.durdur(baglam)
        }

        try {
            pencereYonetici.addView(yeni, parametreler())
        } catch (hata: Exception) {
            // Katman izni kullanıcı tarafından geri alınmış olabilir.
            return
        }
        gorunum = yeni
        sureyiYaz()
        elciler.postDelayed(geriSayim, 1000L)
    }

    fun gizle() {
        elciler.removeCallbacks(geriSayim)
        val acik = gorunum ?: return
        gorunum = null
        try {
            pencereYonetici.removeView(acik)
        } catch (hata: Exception) {
            // zaten kaldırılmışsa yoksay
        }
    }

    /**
     * Kalan süreyi ve çubuğu tazeler.
     *
     * Sayı ile çubuk ayrı sorulara cevap veriyor: sayı "ne kadar kaldı",
     * çubuk "ne kadarı geçti" diyor ve turun ortasında mı sonunda mı
     * olunduğunu sayıya bakıp hesaplamak gerekiyordu.
     *
     * Dakika da iki basamağa dolduruluyor (`%02d`): sayı 44sp ve tek
     * basamaktan iki basamağa geçerken bütün satır yana kayıyordu.
     */
    private fun sureyiYaz() {
        val acik = gorunum ?: return
        val simdi = System.currentTimeMillis()
        val kalanSaniye = ((bitisZamani - simdi) / 1000L).coerceAtLeast(0L)
        acik.findViewById<TextView>(R.id.odak_sure).text =
            String.format(Locale.US, "%02d:%02d", kalanSaniye / 60, kalanSaniye % 60)

        /*
          Toplam süre bilinmiyorsa çubuk boş kalıyor.

          Yanlış bir dolulukla çizmek, kullanıcıya turun nerede olduğu
          konusunda uydurma bir bilgi vermek olurdu — sayı zaten doğruyu
          söylüyor.
        */
        val toplam = bitisZamani - baslangicZamani
        val cubuk = acik.findViewById<ProgressBar>(R.id.odak_cubuk)
        cubuk.progress =
            if (toplam <= 0L) 0
            else (((simdi - baslangicZamani) * 1000L) / toplam).coerceIn(0L, 1000L).toInt()
    }

    private fun parametreler(): WindowManager.LayoutParams = WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.MATCH_PARENT,
        // TYPE_APPLICATION_OVERLAY API 26+ — minSdk bu yüzden 26'ya çıkarıldı,
        // böylece eski TYPE_PHONE dalı hiç yazılmadı.
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
        // Odaklanabilir kalıyor: düğmeler tıklanabilsin ve geri tuşu bize gelsin.
        // Çentik/kenar boşluklarını da kaplasın diye ekran sınırları aşılıyor.
        WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
        PixelFormat.OPAQUE,
    )
}
