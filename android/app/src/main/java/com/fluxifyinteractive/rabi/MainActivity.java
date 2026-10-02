package com.fluxifyinteractive.rabi;

import android.app.ActivityManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.BackEventCompat;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.fluxifyinteractive.rabi.cokme.CokmeEklentisi;
import com.fluxifyinteractive.rabi.cokme.RaporlayanWebChromeClient;
import com.fluxifyinteractive.rabi.cokme.RaporlayanWebViewClient;
import com.fluxifyinteractive.rabi.guncelleme.GuncellemeEklentisi;
import com.fluxifyinteractive.rabi.odak.OdakKilidiEklentisi;

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
        registerPlugin(CokmeEklentisi.class);
        registerPlugin(GuncellemeEklentisi.class);
        SplashScreen.installSplashScreen(this);
        // Android 15'te zorunlu olan uçtan uca görünümü eski sürümlerde de
        // aynı davranacak şekilde aç. WebView'ın sistem çubuklarının altında
        // kalmaması gereken içeriği Capacitor'ın SystemBars eklentisinin
        // sağladığı güvenli alan CSS değişkenleri koruyor.
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        webHatalariniRaporla();
        gorevTaniminiAyarla();
        geriKaydirmayiBagla();
    }

    /**
     * Soldan kaydırarak geri: Android 14+'ın öngörülü geri hareketi
     * (predictive back) sayfaya bağlanıyor.
     *
     * Hareket kenarı sistemin; WebView'da JS ile kenar dokunuşu tanımak
     * sistemin geri hareketiyle yarışırdı. Sistem hareketi tanıyıp ilerlemesini
     * bu geri çağrıya veriyor (`handleOnBackStarted/Progressed/Cancelled`),
     * buradan iOS'un (`AnaDenetleyici.swift`) çağırdığı aynı JS arayüzüne
     * iletiliyor: `window.rabiGeriKaydirma.basla/ilerle/iptal/bitir`
     * (`lib/geri-kaydirma.ts`). Bırakılınca geri mi vazgeç mi kararını sistem
     * veriyor (konum ve fırlatma hızı).
     *
     * Bu çağrılar yalnızca Android 14+'ta ve manifest'te etkinliğe
     * `android:enableOnBackInvokedCallback="true"` konunca geliyor. Daha eski
     * sürümlerde, 3 düğmeli gezinmede ve sağ kenardan kaydırmada yalnızca
     * `handleOnBackPressed` geliyor ve iş olduğu gibi Capacitor'ın App
     * eklentisine devrediliyor: JS'teki `backButton` dinleyicisi
     * (`app-shell.tsx`) — katmanlar, çıkış onayları, uygulamadan çıkış
     * eskisi gibi.
     *
     * Bu geri çağrı Capacitor'ınkinden sonra ekleniyor (eklentiler
     * `super.onCreate` içinde yükleniyor), yani önce bu çalışıyor.
     */
    private void geriKaydirmayiBagla() {
        final float yogunluk = getResources().getDisplayMetrics().density;
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            /** Soldan başlamış ve JS'e `basla` gitmiş bir hareket sürüyor. */
            private boolean suruyor = false;
            private float baslangicX = 0f;

            @Override
            public void handleOnBackStarted(@NonNull BackEventCompat olay) {
                suruyor = olay.getSwipeEdge() == BackEventCompat.EDGE_LEFT;
                if (!suruyor) return;
                baslangicX = olay.getTouchX();
                js("window.rabiGeriKaydirma&&window.rabiGeriKaydirma.basla()", null);
            }

            @Override
            public void handleOnBackProgressed(@NonNull BackEventCompat olay) {
                if (!suruyor) return;
                // Ekran pikselinden CSS pikseline.
                int dx = Math.round(Math.max(0f, olay.getTouchX() - baslangicX) / yogunluk);
                js("window.rabiGeriKaydirma&&window.rabiGeriKaydirma.ilerle(" + dx + ")", null);
            }

            @Override
            public void handleOnBackCancelled() {
                if (!suruyor) return;
                suruyor = false;
                js("window.rabiGeriKaydirma&&window.rabiGeriKaydirma.iptal()", null);
            }

            @Override
            public void handleOnBackPressed() {
                if (!suruyor) {
                    capacitoraDevret();
                    return;
                }
                suruyor = false;
                // Sayfa dışarı kayıp geri gidiyor (gidecek yer yoksa JS
                // uygulamadan çıkıyor). Arayüz yoksa (sayfa yüklenmemiş)
                // sıradan geri tuşu.
                js(
                    "(function(){var k=window.rabiGeriKaydirma;if(!k||!k.bitir)return false;k.bitir();return true})()",
                    sonuc -> {
                        if (!"true".equals(sonuc)) capacitoraDevret();
                    }
                );
            }

            /** Geri tuşunu bu geri çağrı yokmuş gibi Capacitor'a ilet. */
            private void capacitoraDevret() {
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
                setEnabled(true);
            }
        });
    }

    private void js(String betik, android.webkit.ValueCallback<String> sonuc) {
        WebView web = bridge != null ? bridge.getWebView() : null;
        if (web == null) {
            if (sonuc != null) sonuc.onReceiveValue("false");
            return;
        }
        web.evaluateJavascript(betik, sonuc);
    }


    /**
     * WebView hatalarını Crashlytics'e bağlar.
     *
     * `super.onCreate` sonrasında çağrılmak **zorunda**: köprü (bridge) ve
     * WebView orada kuruluyor (`Bridge.java:280-281`), öncesinde ikisi de
     * null olurdu.
     *
     * `WebViewClient` için Capacitor'ın kendi setter'ı var
     * (`Bridge.java:1456`) ve iç alanı da güncellediği için tercih ediliyor.
     * `WebChromeClient` için böyle bir setter yok, doğrudan WebView'e
     * veriliyor — Capacitor o referansı kendisi saklamıyor, sorun çıkarmıyor.
     */
    private void webHatalariniRaporla() {
        if (bridge == null || bridge.getWebView() == null) return;
        bridge.setWebViewClient(new RaporlayanWebViewClient(bridge));
        bridge.getWebView().setWebChromeClient(new RaporlayanWebChromeClient(bridge));
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
        // Kart başlığının rengi markanın amberi: ikonun zeminiyle aynı ve
        // tema değişse de aynı, yani kart her koşulda aynı görünüyor. Açılış
        // ekranının zemini (acilis_zemin) bilerek kullanılmıyor — o bir
        // ekran rengi, bu ise markanın rengi.
        int renk = ContextCompat.getColor(this, R.color.marka_amber);
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
