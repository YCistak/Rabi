# Rabi — R8 kuralları.
#
# `minifyEnabled true` (release) ile birlikte geçerli. Buradaki kuralların
# hepsi **yansıma (reflection) ile bulunan** ya da **yığın izinde okunması
# gereken** şeyler için; doğrudan çağrılan kodun kuralı yok, onu R8 kendisi
# görüyor.
#
# Kütüphanelerin kendi kuralları AAR'lardan (consumerProguardFiles) otomatik
# geliyor ve burada tekrarlanmıyor:
#   - Capacitor: `@CapacitorPlugin` sınıflarını ve `@PluginMethod`
#     yöntemlerini koruyan kurallar `@capacitor/android` içinde
#     (node_modules/@capacitor/android/capacitor/proguard-rules.pro).
#     `OdakKilidiEklentisi` ve `CokmeEklentisi` bu sayede zaten korunuyor.
#   - ML Kit, CameraX, Firebase: kendi AAR'larıyla gelen kurallar yeterli.

# --- Yığın izlerinin okunabilirliği -----------------------------------------
#
# R8 satır numaralarını atar ve yığın izinde yalnız yöntem adı kalır.
# Crashlytics'e giden rapor bu olmadan "hangi satır" sorusunu yanıtlayamıyor.
# `SourceFile` sahte bir adla ezilip asıl ad eşleme (mapping) dosyasında
# kalıyor — dosya `mappingFileUploadEnabled true` ile Firebase'e yükleniyor,
# yani Console'da izler açık adlarla çözülüyor.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# İstisna zincirini koruyan öznitelikler. `CokmeRaporu` yakaladığı hatayı
# `cause`'uyla birlikte gönderiyor; bunlar atılırsa asıl sebep kayboluyor.
-keepattributes Exceptions,InnerClasses,Signature,*Annotation*

# --- WebView köprüsü ---------------------------------------------------------
#
# Kendi `@JavascriptInterface`'imiz yok (köprüyü Capacitor kuruyor), ama
# ileride eklenirse R8 yöntemi kullanılmıyor sanıp siler ve JS tarafı sessizce
# `undefined` alır — hata bile vermez. Kural şimdiden duruyor.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# --- Manifest'ten bağlanan bileşenler ---------------------------------------
#
# `RabiUygulamasi`, `MainActivity`, `OdakServisi` ve `BildirimSusturucu`
# manifest'te adıyla yazılı; AGP bunları eşleme dosyasıyla birlikte yeniden
# adlandırıp manifest'i de günceller, ayrı kurala gerek yok.
#
# `BildirimSusturucu` **istisna**: sistem onu `NotificationListenerService`
# olarak bağlıyor ve geri çağırdığı yöntemler (`onNotificationPosted` vb.)
# bizim kodumuzdan hiç çağrılmıyor. R8 "kimse çağırmıyor" deyip gövdelerini
# boşaltabilir; servis bağlanır ama hiçbir bildirimi susturmaz.
-keep class com.fluxifyinteractive.rabi.odak.BildirimSusturucu { *; }

# --- Kotlin ------------------------------------------------------------------
#
# `kotlin.jvm.internal.Intrinsics` null denetimlerini `-assumenosideeffects`
# ile eletmek yaygın bir kazanç (birkaç yüz KB) ama **bilerek yapılmıyor**:
# denetim kalkınca Java tarafından (Capacitor köprüsü, Android geri çağrıları)
# gelen bir null hemen patlamak yerine ilerideki rastgele bir satırda
# patlıyor ve çökme raporu yanlış yeri gösteriyor. Boyut sorunumuz yok,
# raporun doğruluğu daha değerli.
