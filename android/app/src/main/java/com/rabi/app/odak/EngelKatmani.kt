package com.rabi.app.odak

import android.content.Context
import android.graphics.PixelFormat
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
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

    private val geriSayim = object : Runnable {
        override fun run() {
            sureyiYaz()
            elciler.postDelayed(this, 1000L)
        }
    }

    fun goster(bitis: Long, ders: String?) {
        bitisZamani = bitis
        // Katman zaten duruyorsa yeniden eklenmemeli: her döngü adımında
        // eklenirse ekran görünür biçimde titriyor.
        if (gorunum != null) return

        val yeni = LayoutInflater.from(baglam).inflate(R.layout.engel_katmani, null)
        yeni.isFocusableInTouchMode = true
        // Geri tuşu katmanı kapatmasın; çıkış yolu "Rabi'ye dön" ya da
        // "kilidi kapat" olmalı. Ana ekran tuşu zaten engellenemiyor, gerek de yok.
        yeni.setOnKeyListener { _, kod, _ -> kod == KeyEvent.KEYCODE_BACK }

        yeni.findViewById<TextView>(R.id.odak_ders).apply {
            text = if (ders.isNullOrBlank()) "" else ders + " çalışıyorsun"
            visibility = if (ders.isNullOrBlank()) View.GONE else View.VISIBLE
        }

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

    private fun sureyiYaz() {
        val alan = gorunum?.findViewById<TextView>(R.id.odak_sure) ?: return
        val kalanSaniye = ((bitisZamani - System.currentTimeMillis()) / 1000L).coerceAtLeast(0L)
        val dakika = kalanSaniye / 60
        val saniye = kalanSaniye % 60
        alan.text = String.format("%d:%02d kaldı", dakika, saniye)
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
