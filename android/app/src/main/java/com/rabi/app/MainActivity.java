package com.rabi.app;

import android.os.Bundle;
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
    }
}
