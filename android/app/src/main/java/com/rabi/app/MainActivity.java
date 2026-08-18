package com.rabi.app;

import android.app.ActivityManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /**
     * Açılış ekranı, sistemin kendi ekranını kullanıyor (Android 12+) ve
     * androidx uyumluluk katmanı sayesinde eski sürümlerde de aynı görünüyor.
     *
     * `installSplashScreen` çağrısı `super.onCreate`'ten **önce** olmalı;
     * sonrasında çağrılırsa etkinlik zaten oluşmuş olur ve açılış ekranı hiç
     * görünmez. Çağrı ayrıca `postSplashScreenTheme`'i uyguluyor — bu olmadan
     * açılış bittikten sonra etkinlik açılış temasında kalıyordu.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        gorevTaniminiAyarla();
    }

    /**
     * Son uygulamalar (recents) ekranındaki kartın kimliği.
     *
     * Kartın ikonunu, adını ve rengini Android `TaskDescription`'dan okuyor.
     * Capacitor şablonu bunu hiç ayarlamıyor, sistemin varsayılan çözümlemesine
     * bırakıyordu — uygulama simgesi uyarlanabilir (adaptive) bir ikon olduğu
     * için o çözümleme her cihazda tutmuyor ve kartta hiç logo çıkmıyordu.
     * Burada açıkça veriliyor.
     */
    private void gorevTaniminiAyarla() {
        // Kart başlığının rengi marka mavisi: ikonun zeminiyle aynı ve açık/koyu
        // temada değişmiyor, yani kart her koşulda aynı görünüyor.
        int renk = ContextCompat.getColor(this, R.color.acilis_zemin);
        String ad = getString(R.string.app_name);

        ActivityManager.TaskDescription tanim;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            tanim = new ActivityManager.TaskDescription.Builder()
                .setLabel(ad)
                .setIcon(R.mipmap.ic_launcher)
                .setPrimaryColor(renk)
                .build();
        } else {
            // Android 12L ve öncesi yalnızca hazır bir Bitmap kabul ediyor.
            tanim = new ActivityManager.TaskDescription(ad, ikonBitmap(), renk);
        }
        setTaskDescription(tanim);
    }

    /**
     * Uygulama simgesini bitmap'e çizer.
     *
     * `BitmapFactory.decodeResource` burada **çalışmaz**: `ic_launcher` API 26
     * ve üstünde bir XML uyarlanabilir ikon, PNG değil; çözümleyici null döner
     * ve kart yine ikonsuz kalırdı. Drawable'ı tuvale çizmek her iki biçimde de
     * çalışan tek yol.
     */
    private Bitmap ikonBitmap() {
        Drawable simge = ContextCompat.getDrawable(this, R.mipmap.ic_launcher);
        if (simge == null) return null;

        int en = Math.max(1, simge.getIntrinsicWidth());
        int boy = Math.max(1, simge.getIntrinsicHeight());
        Bitmap bitmap = Bitmap.createBitmap(en, boy, Bitmap.Config.ARGB_8888);
        Canvas tuval = new Canvas(bitmap);
        simge.setBounds(0, 0, en, boy);
        simge.draw(tuval);
        return bitmap;
    }
}
