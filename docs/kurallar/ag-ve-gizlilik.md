# Ağ istisnaları ve yasal metinler

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Ağa çıkan üç istisna

**1. Hatalı soru bildirimi ve öneri/hata bildirimi.** Soru havuzları elle yazıldı;
hataları öğrenmenin başka yolu yok.
- Ağa çıkan tek dosya `lib/hata-gonder.ts`. İkisi de **Firestore**'a, SDK değil REST
  ile (`lib/veri/firestore-adresi.ts`, koleksiyonlar `hatali-sorular`,
  `geri-bildirimler`). Güvenlik anahtarda değil kuralda: yalnız `create`, alan adları
  ve boyları sayılı (`PLANNED.md` → "Firestore kuralları").
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

**3. Play güncelleme denetimi (In-App Updates).** Ağa çıkan Play Store; giden yalnız
paket adı ve sürüm.
- `lib/guncelleme.ts` köprü, `lib/guncelleme-kolu.ts` state,
  `components/guncelleme-seridi.tsx` şerit, yerli `guncelleme/GuncellemeEklentisi.kt`.
  Açılışta bir kez sorulur.
- Kip **esnek**: indirme "Güncelle" + Play'in onayıyla başlar, yeniden başlatmaya
  kullanıcı karar verir. Şerit ekranın üstünde, pencere değil. Kapatma oturumluk,
  kayda girmez (kalıcı "bir daha sorma" yok).
- Elden kurulan APK'da `appUpdateInfo` hata döner; her yöntem yutup "güncelleme yok"
  der. Zorunlu kipe (`IMMEDIATE`) geçmeden önce sor.

## Yasal metinler

- Gizlilik, sözleşme ve veri özeti `public/gizlilik/` (`index.html`, `sozlesme.html`,
  `veri-ozeti.html`), `.github/workflows/gizlilik.yml` ile
  `https://ycistak.github.io/Rabi/`. Uygulama içi ekran (`components/ekranlar/yasal.tsx`)
  yalnız bağlantı verir (adresler `lib/veri/yasal.ts`); metnin uygulamada kopyası
  tutulmaz.
- **Gizlilik adresi değişmez** (`YASAL_SITE` Play Console'da kayıtlı); `index.html`
  yerinden oynamaz.
- Bağlantılar düz `<a target="_blank">` (Capacitor sistem tarayıcısına verir).
