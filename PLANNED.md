# Planlanan işler

## Crashlytics Entegrasyonu

**Durum: onaylandı ve uygulandı (5 Eylül 2026).** Kararlar §9'da, plandan
sapmalar §10'da. Kalan tek adım `google-services.json`'ın yerine konması ve
cihazda doğrulama (§8).

---

### 0. Önce: bu entegrasyon AGENTS.md'deki bir kuralla çatışıyor

`AGENTS.md:13-21`:

> **Sunucu yok.** Statik export; her şey istemcide çalışır. Dış servise çıkma, veri
> toplamaya çalışma.
> — **Tek istisna: hatalı soru bildirimi.** … Ağa çıkan tek dosya `lib/hata-gonder.ts`
> … **Bu istisnayı genişletme — başka hiçbir yerden ağa çıkılmıyor.**

Crashlytics tanımı gereği bu istisnayı genişletir: çökme anında yığın izi (stack
trace), cihaz modeli, Android sürümü, uygulama sürümü ve Firebase'in ürettiği bir
**kurulum kimliği (FID)** Google sunucularına gider. Ek olarak Play Console'daki
**Data Safety** formunda "Crash logs" ve "Device or other IDs" kalemlerinin
işaretlenmesi gerekir; uygulama şu an "veri toplamıyor" beyanına yakın duruyor
ve `AGENTS.md:782` ile `AGENTS.md:891` OCR/tanıma tarafında bu beyanı korumak
için bilinçli tasarım kararları verildiğini yazıyor.

Bu yüzden plan, Crashlytics'i **sessizce açılan** bir SDK olarak değil, mevcut
`bildirimIzni` desenini birebir tekrarlayan **onaya bağlı** bir özellik olarak
kuruyor (§4). Onaylarsan `AGENTS.md`'deki mimari maddesi de "ikinci istisna"
olarak güncellenmeli — aksi halde doküman ile kod çelişir.

**Karar gereken:** bu istisna açılsın mı, açılacaksa varsayılan kapalı mı olsun?

---

### 1. Mevcut yapı — tespit

Plan bu tespitlerin üstüne kuruldu; hiçbiri varsayım değil, hepsi dosyadan okundu.

| Konu | Durum | Dayanak |
|---|---|---|
| Application sınıfı | **Yok.** Manifest'te `android:name` yok | `android/app/src/main/AndroidManifest.xml:5-12`; `grep "extends Application"` boş döndü |
| Activity | Tek activity, `BridgeActivity`'den türüyor | `android/app/src/main/java/com/fluxifyinteractive/rabi/MainActivity.java:13` |
| Özel `WebViewClient` | **Yok** — Capacitor kuruyor | `Bridge.java:280-281` (`setWebChromeClient` / `setWebViewClient`) |
| `WebViewClient` değiştirilebilir mi | Evet, `bridge.setWebViewClient(BridgeWebViewClient)` public | `Bridge.java:1456` |
| `WebChromeClient` değiştirilebilir mi | Setter yok; `bridge.getWebView().setWebChromeClient(...)` ile | `Bridge.java:511` |
| `onRenderProcessGone` | Capacitor zaten override ediyor, listener'lara dağıtıyor | `BridgeWebViewClient.java:92-105` |
| `onConsoleMessage` | Capacitor override ediyor, sadece logcat'e yazıyor | `BridgeWebChromeClient.java:426-448` |
| `google-services` eklentisi | Classpath'te **zaten var** (4.4.4), `google-services.json` varsa koşullu uygulanıyor | `android/build.gradle:11`, `android/app/build.gradle` son blok |
| `google-services.json` | **Şu an yok** (sen koyacaksın) | `ls android/app/google-services.json` → yok |
| `minifyEnabled` | **false** (release dahil) | `android/app/build.gradle`, `buildTypes.release` |
| NDK sembolleri | `debugSymbolLevel = 'SYMBOL_TABLE'` zaten açık | `android/app/build.gradle`, `defaultConfig.ndk` |
| minSdk / compileSdk / AGP / Gradle | 26 / 36 / 8.13.0 / 8.14.3 | `variables.gradle`, `android/build.gradle:10`, `gradle-wrapper.properties` |
| JS tarafı global hata yakalama | **Yok** — `window.onerror` / `unhandledrejection` / ErrorBoundary hiçbiri yok | `grep` boş döndü |
| Mevcut onay deseni | `bildirimIzni: 'sorulmadi' \| 'verildi' \| 'reddedildi'` | `lib/hata-kuyrugu.ts` |

**Dikkat:** `android/app/build.gradle` şu an **commit'lenmemiş** bir değişiklik
taşıyor (versionCode 53→55, versionName 1.21.2→1.21.4). Bu dosyaya
dokunulacağı için önce o değişiklik commit'lenmeli, yoksa iki iş tek diff'e
karışır.

---

### 2. Hangi dosyalar değişecek

**Yeni dosyalar**
- `android/app/src/main/java/com/fluxifyinteractive/rabi/RabiUygulamasi.kt` — Application sınıfı
- `android/app/src/main/java/com/fluxifyinteractive/rabi/cokme/CokmeRaporu.kt` — Crashlytics'e yazan tek sarmalayıcı
- `android/app/src/main/java/com/fluxifyinteractive/rabi/cokme/RaporlayanWebViewClient.kt` — `BridgeWebViewClient` alt sınıfı
- `android/app/src/main/java/com/fluxifyinteractive/rabi/cokme/RaporlayanWebChromeClient.kt` — `BridgeWebChromeClient` alt sınıfı
- `android/app/src/main/java/com/fluxifyinteractive/rabi/cokme/CokmeEklentisi.kt` — Capacitor eklentisi (JS→native köprü)
- `lib/cokme.ts` — JS tarafı: global hata yakalayıcı + eklenti çağrıları

**Değişecek dosyalar**
- `android/build.gradle` — `firebase-crashlytics-gradle` classpath'i
- `android/app/build.gradle` — eklenti uygulama, BoM + bağımlılıklar, buildType ayarları
- `android/app/src/main/AndroidManifest.xml` — `android:name=".RabiUygulamasi"` + otomatik toplamayı kapatan meta-data
- `android/app/src/main/java/com/fluxifyinteractive/rabi/MainActivity.java` — eklenti kaydı, client takası
- `components/app-shell.tsx` — JS hata yakalayıcının kurulumu (tek yerden)
- `components/ekranlar/ayarlar.tsx` — onay anahtarı (§4)
- `AGENTS.md` — "ikinci istisna" maddesi

**Yeni dosya, git'e girmeyecek:** `android/app/google-services.json`. Bu dosya
API anahtarı içeriyor (Android için kısıtlı anahtar, gizli sayılmaz ama depoda
tutulması gereksiz). `.gitignore`'a eklenmesi öneriliyor — **ama** o zaman CI
derlemesi kırılır; CI'da secret olarak enjekte edilmeli. Karar gerekiyor.

---

### 3. Gradle konfigürasyonu

Sürümler bugün (2026-09-05) Google Maven `maven-metadata.xml` üzerinden
doğrulandı, ezberden yazılmadı:

- `com.google.firebase:firebase-crashlytics-gradle` → **3.0.8** (latest)
- `com.google.firebase:firebase-bom` → **34.18.0** (latest)
- `com.google.gms:google-services` → 4.5.0 mevcut, ama projede **4.4.4** kurulu ve
  çalışıyor; Crashlytics 3.0.8 ile uyumlu. **Dokunmamayı öneriyorum** — sürüm
  yükseltmesi bu işin kapsamı değil, ayrı bir commit olmalı.

**`android/build.gradle`** — mevcut `buildscript.dependencies` bloğuna tek satır:

```
classpath 'com.google.firebase:firebase-crashlytics-gradle:3.0.8'
```

**`android/app/build.gradle`** — üç ayrı yere dokunulacak:

*(a) Bağımlılıklar.* BoM ile sürüm yönetimi, tekil sürüm yazılmıyor:

```
implementation platform('com.google.firebase:firebase-bom:34.18.0')
implementation 'com.google.firebase:firebase-crashlytics'
implementation 'com.google.firebase:firebase-analytics'   // — bkz. not
implementation 'com.google.firebase:firebase-crashlytics-ndk'  // — bkz. not
```

> **`firebase-analytics` notu:** Crashlytics onsuz da çalışır, ama Firebase
> Console'daki "crash-free users" oranı ve breadcrumb (kullanıcının çökmeden
> önceki adımları) Analytics'e bağlı. Analytics ise Data Safety formunda çok
> daha geniş bir beyan demek. **Önerim: eklememek.** Çökme raporu için gereken
> her şey Crashlytics'te var; breadcrumb yerine kendi `log()` çağrılarımızı
> kullanırız (§5). Sen istersen eklenir.

> **`firebase-crashlytics-ndk` notu:** ML Kit ve CameraX dört ABI'de native
> kütüphane getiriyor (`android/app/build.gradle` yorumunda "Vitals eşiği
> çökme %1,09" diye geçiyor — yani native çökme gerçekten yaşanmış bir sorun).
> NDK modülü olmadan bu çökmeler Crashlytics'e **hiç düşmez**, sadece Play
> Console'da görünür. **Önerim: eklemek.** APK'yı ~1 MB büyütür.

*(b) Eklenti uygulaması.* Kritik sıra: Crashlytics eklentisi `google-services`
eklentisinden **sonra** uygulanmalı. Dosyanın sonundaki mevcut koşullu blok
buna göre genişletilecek — `google-services.json` yoksa Crashlytics de
uygulanmayacak, böylece dosyayı koymadan da `npm run apk` çalışmaya devam eder:

```
try {
    def servicesJSON = file('google-services.json')
    if (servicesJSON.text) {
        apply plugin: 'com.google.gms.google-services'
        apply plugin: 'com.google.firebase.crashlytics'
    }
} catch(Exception e) {
    logger.info("google-services.json yok; Firebase eklentileri uygulanmadı.")
}
```

*(c) buildType ayarları.* `debug` bloğu şu an **hiç yok**, eklenecek:

```
debug {
    firebaseCrashlytics {
        mappingFileUploadEnabled false   // debug'da R8 yok, yükleme zaman kaybı
        nativeSymbolUploadEnabled false
    }
}
release {
    firebaseCrashlytics {
        mappingFileUploadEnabled true
        nativeSymbolUploadEnabled true
        unstrippedNativeLibsDir file("build/intermediates/merged_native_libs/release/out/lib")
    }
}
```

---

### 4. ProGuard/R8 mapping — sorunun cevabı: şu an gereksiz

**`minifyEnabled` release'de `false`.** Yani R8 kod karartması yapmıyor, yığın
izleri zaten okunabilir sınıf/metot adlarıyla geliyor. Mapping dosyası
üretilmiyor bile.

Bu yüzden: *"crashlytics gradle plugin mapping'i otomatik yükler mi?"* → **Evet,
otomatik yapar** ve manuel adım gerekmez. Eklenti `assembleRelease` /
`bundleRelease` görevine kendini bağlayıp `uploadCrashlyticsMappingFileRelease`
görevini çalıştırır. Ama **bu projede yükleyecek bir mapping yok**, çünkü minify
kapalı. `mappingFileUploadEnabled true` yazmak zararsız — dosya yoksa görev
sessizce geçer.

İleride `minifyEnabled true` yapılırsa hiçbir ek iş gerekmez; ayar zaten hazır
olur. **Bu planda minify'ı açmıyorum** — ayrı ve riskli bir iş (Capacitor
eklentileri ve ML Kit için keep kuralları gerekir).

Native semboller: plan bunu açacağını yazıyordu, **uygulamada kapatıldı** —
sebep §10'da. `npm` scriptlerine sembol yükleme görevi eklenmedi.

---

### 5. Native / JVM çökme ve ANR yakalama

**Otomatik olan, ek kod istemeyen kısım:**
- Yakalanmamış JVM istisnaları → Crashlytics kendi
  `Thread.UncaughtExceptionHandler`'ını kurar, uygulama açılışında devralır.
  **Kendi handler'ımızı kurmayacağız** — Crashlytics'inkini zincirden düşürme
  riski var. Bunun yerine ihtiyacımız olan yerde `recordException()` çağıracağız.
- **ANR:** Android 11+ (`ApplicationExitInfo`) üzerinden otomatik toplanır.
  minSdk 26 olduğu için 26-30 arası cihazlarda ANR raporu **gelmez** —
  yapılabilecek bir şey yok, sınırlama Android tarafında.
- **Native (NDK) çökmeler:** `firebase-crashlytics-ndk` eklenirse otomatik.

**`RabiUygulamasi.kt` ne yapacak:**
1. Onay durumunu okuyup `FirebaseCrashlytics.setCrashlyticsCollectionEnabled(...)`
   ile toplamayı açar/kapatır (§0 gereği).
2. Sabit anahtarları yazar: WebView paket sürümü (`WebViewCompat` /
   `WebView.getCurrentWebViewPackage()`), yüklü web varlıklarının sürümü,
   `Capacitor.isNativePlatform` bilgisi. Bir WebView uygulamasında çökmenin
   sebebi çoğu zaman cihazın Android System WebView sürümüdür; bu anahtar
   olmadan rapor okunamaz.

**Manifest'e eklenecek** (otomatik toplamayı kapatan anahtar):

```xml
<application android:name=".RabiUygulamasi" ...>
    <meta-data
        android:name="firebase_crashlytics_collection_enabled"
        android:value="false" />
```

Bu `false` "asla toplama" demek değil; "kod açıkça izin verene kadar toplama"
demek. `setCrashlyticsCollectionEnabled(true)` çağrısı kalıcıdır (cihazda
saklanır), her açılışta tekrar çağrılması şart değil ama biz yine de onay
state'inden okuyup senkron tutacağız.

---

### 6. WebView'e özgü hata yakalama

Bu, işin asıl kısmı — hiçbiri Crashlytics tarafından kendiliğinden yakalanmaz.
Dört ayrı kanal var ve **hepsi non-fatal** olarak düşecek:

| # | Olay | Nerede yakalanır | Neden gerekli |
|---|---|---|---|
| 1 | `onRenderProcessGone` | `RaporlayanWebViewClient` | WebView render süreci çöktüğünde **uygulama süreci çökmez** — ekran beyaz kalır, kullanıcı "donuyor" der, Crashlytics'te hiçbir iz olmaz |
| 2 | JS `console.error` | `RaporlayanWebChromeClient.onConsoleMessage` | React'in yakaladığı hatalar, third-party JS hataları |
| 3 | JS `window.onerror` + `unhandledrejection` | `lib/cokme.ts` → `CokmeEklentisi` | Gerçek yığın izi buradan gelir; console mesajı gelmez |
| 4 | `onReceivedError` / `onReceivedHttpError` / `onReceivedSslError` | `RaporlayanWebViewClient` | Yerel varlık yüklenemezse (bozuk `assets/public`) uygulama boş açılır |

**Neden `WebViewListener` yetmiyor:** Capacitor'ın `addWebViewListener()`
mekanizması var (`Bridge.java:1485`) ve subclass'sız çalışır — ama callback'ler
hata detayını **taşımıyor**: `onReceivedError(WebView webView)`, hepsi bu
(`WebViewListener.java:20-27`). Hangi URL, hangi hata kodu, hangi açıklama —
hiçbiri yok. `onRenderProcessGone` tek istisna, `detail` parametresi geliyor.
Ayrıca `onReceivedSslError` `BridgeWebViewClient`'ta hiç override edilmemiş,
listener'ı da yok.

Bu yüzden: **`BridgeWebViewClient` alt sınıfı + `bridge.setWebViewClient()`**.
`WebViewListener` yolu daha temiz görünüyor ama işe yaramıyor; bu tercih koda
yorum olarak yazılacak.

**`MainActivity.onCreate` içinde**, `super.onCreate()` sonrasında (bridge o
noktada kurulmuş olur):

```java
bridge.setWebViewClient(new RaporlayanWebViewClient(bridge));
bridge.getWebView().setWebChromeClient(new RaporlayanWebChromeClient(bridge));
```

**`onRenderProcessGone` davranışı — dikkat:** `super`'i çağırıp `true`
dönmezsek sistem uygulamayı öldürür. Capacitor'ın kendi implementasyonu
listener yoksa `false` döner, yani şu an render çökmesi = uygulama ölümü.
Uygulanan: raporla, sonra **etkinliği yeniden kur** ve `true` dön.
`webView.reload()` bilinçli olarak kullanılmadı — sebep §10'da.

**`onConsoleMessage` filtresi:** Capacitor'ın `isValidMsg()` filtresi
(`BridgeWebChromeClient.java:449`) korunacak. Yalnız `messageLevel() == ERROR`
raporlanacak. Ek olarak **oran sınırı** şart: bir render döngüsündeki hata
saniyede yüzlerce console mesajı üretebilir; Crashlytics non-fatal'lerde
oturum başına 64 kayıt sınırı zaten var ama biz kendi tarafımızda aynı mesajı
tekrar göndermeyeceğiz (mesaj metninin hash'i ile).

**Yığın izi sorunu:** `onConsoleMessage`'tan gelen bilgi yalnızca
`sourceId + lineNumber + message`. Bu Crashlytics'te "sahte" bir istisna olarak
kaydedilir ve gruplama zayıf olur. Gerçek JS yığın izi ancak §3 numaralı
kanaldan (`window.onerror`'ın `error.stack` alanı) gelir. Bu yüzden ikisi de
gerekli — biri diğerinin yerine geçmiyor. Native tarafta iki kanal ayrı
anahtarla etiketlenecek (`kaynak: console` / `kaynak: window.onerror`).

**`lib/cokme.ts`:** `window.addEventListener('error')` ve
`'unhandledrejection'` kurulumu, `AppShell` içinde bir kez. Yakalanan hata
`CokmeEklentisi.bildir({ mesaj, yigin, kaynak })` ile native'e geçer. Kurulum
`Capacitor.isNativePlatform()` kontrolüyle — tarayıcıda `npm run dev` sırasında
hiçbir şey yapmaz.

---

### 7. Debug'da test çökmesi tetikleme

**Öneri: evet, ekleyelim — ama gizli buton olarak değil.**

Gizli buton (ör. sürüm numarasına 7 kez dokunma) release'e sızma riski taşıyor
ve kodda `if (BuildConfig.DEBUG)` kontrolü web tarafından görülemez.

Bunun yerine: `CokmeEklentisi`'ne iki metot eklenecek —
`testCokmesi()` (JVM çökmesi) ve `testKayit()` (non-fatal). İkisi de ilk
satırda `if (!BuildConfig.DEBUG) { call.unavailable(...); return }` kontrolü
yapar. Ayrıca eklenti `hazirMi()` ile debug olup olmadığını web'e söyler;
Ayarlar ekranındaki geliştirici bölümü yalnız `true` dönerse çizilir.

Böylece release APK'da metot **çağrılsa bile çalışmaz** — güvenlik koda
gömülü, arayüzün gizliliğine bağlı değil. Kod release'de de derlenir ama iki
satırlık ölü koddur.

---

### 8. Doğrulama — adım adım

Crashlytics raporu **çökme anında değil, uygulamanın bir sonraki açılışında**
gönderir. Bu ikisini karıştırmak en sık yapılan hata.

**Ön koşul:** `android/app/google-services.json` yerinde ve içindeki
`package_name` = `com.fluxifyinteractive.rabi`. Yanlışsa google-services eklentisi derleme
sırasında hata verir — sessizce geçmez.

**A) Debug derlemesinde**

1. `npm run apk` → `android/app/build/outputs/apk/debug/app-debug.apk`
2. Cihaza kur, uygulamayı aç, **Ayarlar'dan çökme raporu onayını ver**
   (onay yoksa hiçbir şey gönderilmez — §5'teki manifest anahtarı yüzünden).
3. `adb logcat -s FirebaseCrashlytics` açık tut. "Initializing Firebase
   Crashlytics" satırını gör; görmüyorsan entegrasyon çalışmıyor demektir.
4. Ayarlar > geliştirici > "Test çökmesi" → uygulama kapanır.
5. **Uygulamayı yeniden aç.** Rapor bu açılışta yüklenir. Logcat'te
   "Crashlytics report upload complete" bekle.
6. Firebase Console > Crashlytics. İlk rapor için **5 dakikaya kadar** gecikme
   normaldir; ayrıca ilk raporda Console "Crashlytics'i etkinleştir" ekranından
   çıkıp veri göstermeye geçer.

> Debug'a özgü farklar: mapping yüklenmez (§4), yığın izi zaten okunabilir
> olduğu için sorun değil. Debug derlemesi Console'da `versionName` sonuna
> ayrı bir işaret koymaz — release ile aynı sürümde görünür, karışmasın diye
> `setCustomKey("derleme", BuildConfig.BUILD_TYPE)` yazılacak.

**B) Release derlemesinde**

1. `npm run apk:imzali` (imzalı, tek ABI) veya `npm run aab`.
2. `./gradlew uploadCrashlyticsSymbolFileRelease` — NDK modülü eklendiyse
   ve script'e henüz eklenmediyse elle (§4).
3. Kur, aç, onay ver.
4. Test çökmesi düğmesi **release'de görünmez ve çalışmaz** (§7). Bu yüzden
   release doğrulaması gerçek bir hatayla yapılır. Üç yol:
   - **WebView hatası:** cihaz Ayarlar'ından Android System WebView'i devre dışı
     bırak → uygulama açılışında render hatası → §6/kanal 1 veya 4 tetiklenir.
   - **Non-fatal doğrulaması:** `adb shell am start` ile uygulamayı açıp
     `chrome://inspect` üzerinden konsola `throw new Error('release testi')`
     yaz → §6/kanal 3 tetiklenir, non-fatal olarak düşer. (Debug WebView
     inceleme yalnız debug derlemede açık; release'de
     `WebView.setWebContentsDebuggingEnabled` kapalı olduğu için bu yol
     release'de **çalışmaz** — aşağıdaki üçüncü yola bak.)
   - **Kalıcı yol:** geçici bir dalda gerçekten çöken bir kod satırı bırakıp
     imzalı APK almak. Tek kesin yöntem bu; dal sonra silinir.
5. Console'da rapor gelince **"Native" ve "Non-fatals" sekmelerini ayrı ayrı**
   kontrol et — WebView kanalları non-fatal sekmesine düşer, ana çökme
   listesinde görünmez. Buraya bakmayı unutmak "çalışmıyor" sanılmasının
   en yaygın sebebi.
6. Yığın izinin okunabilirliğini kontrol et. `minifyEnabled false` olduğu için
   sınıf adları açık gelmeli; `a.b.c()` gibi bir şey görüyorsan mapping
   yüklenmemiş demektir ve §4 yeniden gözden geçirilmeli.

**Doğrulama tamamlanmadan iş bitmiş sayılmayacak.** Sadece "derleniyor" yeterli
değil; Console'da hem bir fatal hem bir non-fatal görülmeli.

---

### 9. Kararlar (5 Eylül 2026'da verildi)

1. **AGENTS.md istisnası açılsın mı?** → **Evet.** `AGENTS.md` "İkinci istisna:
   çökme raporları" maddesiyle güncellendi. Varsayılan kapalı, onaya bağlı.
2. **`firebase-analytics`?** → **Eklenmedi.**
3. **`firebase-crashlytics-ndk`?** → **Eklendi.**
4. **`google-services.json` `.gitignore`'a?** → **Evet** (depo herkese açık).
   CI için `GOOGLE_SERVICES_JSON` secret'ı eklendi — bu **yapılması gereken bir
   iş**, aşağı bak.
5. **`onRenderProcessGone` sonrası?** → **Toparlanmayı dene** (nasıl olduğu §10).
6. **versionCode değişikliği önce commit'lensin mi?** → **Hayır.** Bu iş o
   commit'lenmemiş değişiklikle aynı çalışma ağacında duruyor.

---

### 10. Plandan sapmalar

Kod yazılırken planın üç maddesi yanlış çıktı. Değişiklikler ve sebepleri:

**a) Native sembol yüklemesi açılmadı (`nativeSymbolUploadEnabled false`).**
Plan açılacağını yazıyordu. Kod yazarken projede **kendi C/C++ kaynağımız
olmadığı** görüldü — ne `CMakeLists.txt` ne `jni/` dizini var. Paketteki bütün
`.so` dosyaları ML Kit ve CameraX'ten geliyor ve satıcı tarafından zaten
soyulmuş (stripped); yükleyecek sembolümüz yok. Ayrıca
`unstrippedNativeLibsDir` yolu AGP sürümleri arasında değişiyor ve yanlış yol
sessizce boş yükleme yapıyor — çalıştığı sanılan ama çalışmayan bir ayar.
Native çökmeler yine yakalanıyor (`firebase-crashlytics-ndk`), Play Console
tarafındaki okunabilirlik de mevcut `debugSymbolLevel = 'SYMBOL_TABLE'` ile
zaten sağlanmış durumda.

**b) `onRenderProcessGone`'da `reload()` değil, etkinliği yeniden kurma.**
İstenen "reload denensin"di. Android belgeleri render süreci öldükten sonra
`WebView` örneğinin **kullanılamaz** olduğunu, görünüm ağacından çıkarılıp yok
edilmesi gerektiğini söylüyor; ölü bir WebView'de `reload()` ya sessizce hiçbir
şey yapmıyor ya da ikinci bir çökme üretiyor. İstenen sonuç ("beyaz ekranda
kalma, toparlan") doğru yoldan alındı: `activity.recreate()` çağrılıyor,
Capacitor köprüsü sıfırdan yeni bir WebView kuruyor. Süreç ömrü boyunca en
fazla **iki** kez — sürekli çöken bir render'da sonsuz döngü, bir kez ölmekten
kötü.

**c) `buildFeatures { buildConfig true }` eklenmesi gerekti.**
Planda yoktu. AGP 8'den beri `BuildConfig` varsayılan olarak üretilmiyor ve
derleme `Unresolved reference 'BuildConfig'` ile kırıldı. `BuildConfig.DEBUG`
test yöntemlerini release'de kapatmanın tek yolu, `BuildConfig.BUILD_TYPE` de
raporun hangi derlemeden geldiğini söylüyor.

Ayrıca planda olmayan bir **düzeltme**: test çökmesi eklenti yönteminin içinden
atılamıyor. Capacitor eklenti çağrılarını `try/catch` içinde işliyor
(`MessageHandler.java:37`), yani doğrudan atılan istisna çökmeye dönüşmüyor —
yutulup reddedilmiş bir söze (promise) çevriliyor ve hiçbir şey olmuyor. Çökme
ana looper'a gönderiliyor.

---

### 11. Senin yapacakların — adım adım

Kod tarafı bitti. Aşağıdakiler sadece senin yapabileceğin şeyler (hesap açmak,
dosya indirmek, telefonda denemek).

#### Adım 1 — Firebase projesi aç ve dosyayı indir  *(~10 dakika)*

1. https://console.firebase.google.com adresine git, Google hesabınla gir.
2. **"Create a project"** → proje adı: `Rabi` → **Create**.
   - "Enable Google Analytics?" diye sorarsa **kapat (Disable)**. Analytics
     bilerek kullanılmıyor (§3).
3. Proje açılınca ortadaki **Android simgesine** tıkla.
4. **Android package name** kutusuna tam olarak şunu yaz:
   ```
   com.fluxifyinteractive.rabi
   ```
   > Bir harf bile farklı olursa Crashlytics hiç çalışmaz ve derleme hata
   > verir. Kopyala-yapıştır yap.
5. App nickname: `Rabi` · SHA-1: **boş bırak** (Crashlytics için gerekmiyor).
6. **Register app** → **google-services.json** dosyasını indir.
7. İndirilen dosyayı şuraya koy:
   ```
   ~/rabi/android/app/google-services.json
   ```
   Terminalde:
   ```bash
   mv ~/Downloads/google-services.json ~/rabi/android/app/
   ```
8. Firebase'deki kalan adımları (SDK ekleme talimatları) **atla** — hepsi
   kodda zaten yapıldı. "Next → Next → Continue to console" de.

Dosya `.gitignore`'da, yani depoya gitmez. Kaybedersen Firebase Console'dan
tekrar indirebilirsin.

#### Adım 2 — Telefonda dene  *(~15 dakika)*

```bash
cd ~/rabi
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
npm run apk
```

APK şurada olur: `android/app/build/outputs/apk/debug/app-debug.apk`

1. APK'yı telefona kur, uygulamayı aç.
2. **Ayarlar → Çökme raporları** bölümünü bul, anahtarı **aç**.
   (Açmazsan hiçbir rapor gitmez — bu bilerek böyle.)
3. Aynı bölümün altında **"Test kaydı"** ve **"Test çökmesi"** düğmeleri
   görünüyor olmalı. (Yalnızca debug APK'da görünürler.)
4. **"Test çökmesi"** düğmesine bas → uygulama kapanır. Bu normal.
5. **Uygulamayı yeniden aç.** Rapor tam olarak bu açılışta gönderiliyor.
6. 5 dakika bekle, sonra Firebase Console → **Crashlytics** bölümüne bak.
   Raporun orada görünmesi lazım.
7. **"Test kaydı"** düğmesi için aynı şeyi yap, ama o rapor Crashlytics'te
   **"Non-fatals"** sekmesinde çıkar — ana listede değil. WebView hataları da
   hep oraya düşecek, bakman gereken sekme orası.

Bunlar görünmezse bir şey yanlış demektir; bana söyle, birlikte bakarız.

#### Adım 3 — GitHub secret ekle  *(~5 dakika)*

CI (GitHub Actions) Play'e giden paketleri üretiyor ama `google-services.json`
depoda olmadığı için ona ayrıca vermek gerekiyor. Vermezsen **yayınlanan
uygulamada çökme raporu hiç çalışmaz.**

1. `cat ~/rabi/android/app/google-services.json` → çıktının **tamamını** kopyala.
2. GitHub → depo → **Settings** → **Secrets and variables** → **Actions**.
3. **New repository secret**:
   - Name: `GOOGLE_SERVICES_JSON`
   - Secret: kopyaladığın JSON'un tamamı (base64'e çevirme, düz yapıştır)
4. **Add secret**.

#### Adım 4 — Play Console tarafı  *(yayına çıkarken)*

1. **Developer display name**: `Fluxify Interactive`. Bu paket adından ayrı bir
   alan, Console → Settings → Developer account → Account details altında.
   Sonradan değiştirilebilir.
2. **Data safety** formu: artık veri topluyorsun, beyan etmek zorunlu.
   - **Crash logs** → toplanıyor, isteğe bağlı (optional), kullanıcı kapatabilir
   - **Device or other IDs** → toplanıyor, isteğe bağlı
   - İkisi de "App functionality / Analytics" değil, **"Crash reporting"**
     amacıyla işaretlenir.
3. Uygulamayı Console'da oluştururken paket adı `com.fluxifyinteractive.rabi`
   olacak — **bu andan sonra bir daha değiştirilemez**.

#### Bilmen gereken iki şey

- **Arkadaşlarındaki eski APK'lar güncelleme almaz.** Paket adı değişti, yani
  Android için bu artık *başka bir uygulama*. Yeni APK'yı kuracakları zaman
  önce eskisini silmeleri gerekiyor. Verileri de eski uygulamayla birlikte
  gider — önemliyse Ayarlar'dan yedek alıp yeni kuruluma yüklesinler.
- **`reports/04-geri-donulemez.md` §3 ile kod çelişiyor.** Rapor ilk Play
  sürümünün `versionCode 10000` olacağını yazıyor, `android/app/build.gradle`
  ise `55` diyor. Bu Crashlytics işinin parçası değil, dokunmadım — ama Play'e
  yüklemeden önce hangisinin doğru olduğuna karar vermen gerekiyor.
