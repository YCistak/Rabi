# Ağ istisnaları ve yasal metinler

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Ağa çıkan dört istisna

**1. Hatalı soru bildirimi ve öneri/hata bildirimi.** Soru havuzları elle yazıldı;
hataları öğrenmenin başka yolu yok.
- Ağa çıkan tek dosya `lib/hata-gonder.ts`. İkisi de **Firestore**'a, SDK değil REST
  ile (`lib/veri/firestore-adresi.ts`, koleksiyonlar `hatali-sorular`,
  `geri-bildirimler`). Güvenlik anahtarda değil kuralda: yalnız `create`, alan adları
  ve boyları sayılı (`firestore.rules`; konsolda elle yayınlanır, talimat `docs/firestore-kurallari.md`).
- Hatalı soru: `formVerisi()` içindeki yedi alan (soru kimliği, oyun, soru metni,
  doğru sanılan cevap, sebep, sürüm, cihaz alanı). "Başka" sebebinin notu (en çok 32
  harf) yeni alan değil, `sebep` içinde ("Başka: …") — kural `sebep`e 40 harf veriyor,
  yeni alan her bildirimi 403 ile düşürür. İlk bildirimde izin kartı; "Gönder"
  denmeden ağa çıkılmaz. Ayarlarda ayrı açma/kapama anahtarı yok (kaldırıldı).
- Öneri/hata bildirimi: `lib/geri-bildirim.ts` (saf), `lib/geri-bildirim-kolu.ts`
  (kuyruk), `components/ekranlar/geri-bildirim.tsx`. Beş alan
  `geriBildirimFormVerisi()` içinde; biri serbest metin, ekran kişisel bilgi
  yazılmamasını söylüyor. İzin kartı yok, liste düğmenin üstünde.
- **Alan eklersen birlikte değişir:** Firestore kuralı, ekrandaki liste,
  `public/gizlilik/index.html`, `public/gizlilik/veri-ozeti.html`, Play Data Safety,
  `ios/App/App/PrivacyInfo.xcprivacy`, App Store Connect App Privacy.

**2. Çökme raporları (Firebase Crashlytics).** Çökme çoğu zaman cihazdaki WebView
sürümünden; kullanıcıdan öğrenilemiyor.
- Ağa çıkan tek yer `lib/cokme.ts` ve yerli `CokmeRaporu.kt`; başka dosya
  `FirebaseCrashlytics` import etmez.
- Otomatik gönderim **hiçbir zaman açılmaz** (`AndroidManifest.xml` →
  `firebase_crashlytics_collection_enabled=false`). Çökme cihazda saklanır, uygulama
  yeniden açılınca **her seferinde sorulur**; "Gönderme" raporu siler. Ayarlarda
  soruyu kapatan anahtar yok (kaldırıldı). `firebase-analytics` bilerek yok.
- Pencere **yalnız gerçek çökmede** açılır (`didCrashOnPreviousExecution`; kullanıcı
  istedi, 2026-10). WebView kanallarının non-fatal kayıtları (`console.error`,
  `window.onerror`, `unhandledrejection`, kaynak yükleme) için soru sorulmaz; kalıcı
  "gönder" izni olmadığından **gönderilmeden silinir** (`deleteUnsentReports`), yoksa
  birikir. Karar saf ve testli: `lib/cokme-karari.ts`. Cevaplanmadan kapatılan çökme
  `rabi-cokme-cevapsiz-v1` bayrağıyla bir sonraki açılışta yeniden sorulur.

**3. Güncelleme denetimi (Play In-App Updates, iOS'ta App Store araması).** Ağa çıkan
Play Store / Apple; giden yalnız paket adı (Android'de sürüm de).
- `lib/guncelleme.ts` köprü, `lib/guncelleme-kolu.ts` state,
  `components/guncelleme-seridi.tsx` şerit, yerli `guncelleme/GuncellemeEklentisi.kt`.
  Açılışta bir kez sorulur.
- Kip **esnek**: indirme "Güncelle" + Play'in onayıyla başlar, yeniden başlatmaya
  kullanıcı karar verir. Şerit ekranın üstünde, pencere değil. Kapatma oturumluk,
  kayda girmez (kalıcı "bir daha sorma" yok).
- Elden kurulan APK'da `appUpdateInfo` hata döner; her yöntem yutup "güncelleme yok"
  der. Zorunlu kipe (`IMMEDIATE`) geçmeden önce sor.
- **iOS** aynı şeridi kullanır: `appStoreKontrol` (`lib/guncelleme.ts`)
  `itunes.apple.com/lookup`a `CapacitorHttp` ile yalnız paket kimliğini sorar (fetch
  CORS'ta düşer), sürümü `surumYeniMi` (`lib/surum-karsilastir.ts`) karşılaştırır;
  "Güncelle" App Store sayfasını açar, indirme hâlleri yok. Uygulama mağazada
  değilse (yalnız TestFlight) şerit çıkmaz.

**4. Sesli giriş (konuşmayı yazıya çevirme).** Soru Takibi'nde öğrencinin gününü
konuşarak anlatması ("80 matematik, 65 kimya sorusu çözdüm, TYT denemesinde 87 net yaptım").
- Paket `@capgo/capacitor-speech-recognition` (MPL-2.0). Köprü `lib/ses-tanima.ts`, saf
  çözücü `lib/sesli-giris.ts`, onay arayüzü `components/sesli-giris.tsx`.
- Konuşmayı yazıya **telefonun kendi işletim sistemi servisi** çevirir: Android'de
  Google'ın ses tanıma hizmeti, iOS'ta Apple'ın Konuşma Tanıma'sı (Speech framework). Bu
  servisler sesi çözümlemek için Google'a veya Apple'a gönderebilir.
- **Rabi sesi veya metni hiçbir yere kendisi göndermez:** Rabi'nin bir sunucusu yoktur;
  ses verisi ya da üretilen metin Rabi tarafından kaydedilmez, saklanmaz, hiçbir sunucuya
  veya üçüncü tarafa aktarılmaz. Ses yalnız işletim sisteminin servisine gider.
- **Onay ekranı zorunludur:** Yazıya dönüştürülen metin telefonda saf mantıkla
  sayılara ayrılır (`lib/sesli-giris.ts`). Çıkarılan sonuçlar onay ekranında kullanıcıya
  gösterilmeden doğrudan kaydedilemez. Kullanıcı "Kaydet" demeden hiçbir şey saklanmaz.
  Kaydedilen veri de yalnızca ders, soru sayısı ve doğru/yanlış değerleridir (normal elle
  girişle aynı yerel kayıt).
- Mikrofon izni yalnız kullanıcı düğmeye ilk bastığında istenir. Google ses tanıması
  olmayan Android cihazlarda düğme görünmez (`AndroidManifest.xml` içinde `<queries>`
  RecognitionService girdisi bu yüzden silinmez).
- **Birlikte değişenler:** `ios/App/App/Info.plist` izin metinleri
  (`NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`), gizlilik
  sayfaları (`public/gizlilik/index.html`, `public/gizlilik/veri-ozeti.html`), Play
  Console Data Safety, App Store Connect App Privacy.

## Yasal metinler

- Gizlilik, sözleşme ve veri özeti `public/gizlilik/` (`index.html`, `sozlesme.html`,
  `veri-ozeti.html`), `.github/workflows/gizlilik.yml` ile
  `https://ycistak.github.io/Rabi/`. Uygulama içi ekran (`components/ekranlar/yasal.tsx`)
  yalnız bağlantı verir (adresler `lib/veri/yasal.ts`); metnin uygulamada kopyası
  tutulmaz.
- **Gizlilik adresi değişmez** (`YASAL_SITE` Play Console'da kayıtlı); `index.html`
  yerinden oynamaz.
- Bağlantılar düz `<a target="_blank">` (Capacitor sistem tarayıcısına verir).
