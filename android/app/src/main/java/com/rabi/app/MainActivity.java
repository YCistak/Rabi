package com.rabi.app;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.rabi.app.odak.OdakKilidiEklentisi;

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
        // Uygulamanın kendi eklentisi; npm paketi olmadığı için Capacitor onu
        // kendiliğinden bulamıyor, elle kaydedilmesi gerekiyor.
        registerPlugin(OdakKilidiEklentisi.class);
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
    }

    /**
     * Uygulama kapatılınca — geri tuşuyla çıkma ya da görev listesinden silme —
     * pomodoro turu biter: bekleyen seans bildirimi ve odak kilidi kaldırılır.
     * Aşağıya alma bu yoldan geçmiyor, orada sayaç çalışmaya devam ediyor.
     *
     * Ekran döndürme, tema ve dil değişimi manifest'teki `configChanges`
     * sayesinde etkinliği yeniden kurmuyor; yine de o listeden bir gün bir şey
     * çıkarsa diye ayar değişimi elenip geçiliyor.
     */
    @Override
    public void onDestroy() {
        if (!isChangingConfigurations()) {
            PomodoroKapanis.temizle(this);
        }
        super.onDestroy();
    }
}
