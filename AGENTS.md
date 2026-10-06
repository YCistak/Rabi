# Rabi — proje kuralları

Bu dosya **kuralları ve tuzakları** tutar, tarihçeyi değil. Her madde: ne yapılır /
yapılmaz, birlikte değişmesi gerekenler ve tek cümlelik sebep. Bir kararın uzun
gerekçesi ya da "bir süre şöyleydi" anlatısı gerekirse: `git log -p -- AGENTS.md`
(uzun sürüm Ekim 2026'ya kadar orada). Yeni madde eklerken de bu biçimde yaz.

"Kullanıcı kaldırttı / istedi" yazan maddeler kullanıcının kararıdır: geri almadan
önce sor.

## Dil

**Kod dahil her şey Türkçe.** Değişken, fonksiyon, tip, dosya ve klasör adları Türkçe;
yorumlar Türkçe. İstisna: çerçevenin dayattığı adlar (`page.tsx`, `layout.tsx`,
`useState`, React prop'ları) ve npm paket adları.

Yorumlar **neden**i anlatır, **ne**yi değil. Yönetmelik/ÖSYM kaynaklı bir kural
uyguluyorsan madde numarasını veya kaynağı yorumda belirt (`lib/hesap.ts` örnek).

## Mimari

- **Sunucu yok.** Statik export; her şey istemcide çalışır. Dış servise çıkma, veri
  toplamaya çalışma. Yalnızca aşağıdaki üç istisna var; genişletme.
- **Durum kütüphanesi yok.** `AppShell` üst düzey state'in sahibi, props ile aşağı
  geçer. Yeni global state gerekirse önce prop ile çözmeyi dene.
- **Saf mantık `lib/` altında.** React'e bağlı olmayan her hesap `lib/`'e; bileşenler
  yalnızca çizer. `hesap.ts`, `puan.ts`, `siralama.ts`, `rozetler.ts` saf ve testli kalır.
- **localStorage küçük veri için.** Fotoğraflar IndexedDB'de (`lib/resim-depo.ts`).
  localStorage'a asla base64 görüntü yazma — kota birkaç fotoğrafta dolar.
- **Kayıtlı kimlikler ve depo anahtarları yeniden adlandırılmaz** (ör. `rozet`,
  `rabi-notlar`, `Yedek.notlar`, kullanılmayan `Ayarlar` alanları): kullanıcı
  verisini öksüz bırakır, eski yedekleri bozar. Kullanılmayan alan kayıtta durur.
  Silinen özelliklerin anahtarları `ESKI_ANAHTARLAR`a (`lib/depo.ts`) taşınır.

### Ağa çıkan üç istisna

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

## Tasarım

- Mobil öncelikli, `max-w-md` tek sütun. Hover yerine `active:`.
- Renkler doğrudan yazılmaz, tema değişkenlerinden gelir (`var(--primary)` /
  `text-primary`). **Tek tema**: `dark:` kullanma, Ayarlar'da tema seçeneği yok.
  - `--primary` #B3491F **yazı ve ikon**, `--primary-parlak` #D9622F **dolgu** (halka,
    çubuk, düğme, büyük sayı). İkincil tuğla `--ikincil` #A8432B, zemin `--background`
    #F8F8F7. Kart yüzeyi `golge-kart`.
  - Renk **derse** aittir ve bir ders **her yerde aynı renkte** (harita, oyunlar,
    kutucuklar): `--konu-<ders>` (`bg-konu-turkce`, `text-konu-tarih-koyu`,
    `bg-konu-kimya-ok`…). Matematik mavi, Türkçe/Edebiyat sarı, Fizik mor, Kimya
    turuncu, Biyoloji yeşil, Tarih kahverengi, Coğrafya turkuaz.
  - Eski aileler (`yzm`, `isl`, `edb`, `cog`, `trh`, `byl`, `fzk`) ders kimliği değil,
    genel pastel: araç kutucukları, rozet kademeleri, harita göstergeleri (deniz, kara).
- **Zemin rengi dört yerde, birlikte değişir:** `--background` (globals.css),
  `acilis.tsx` → `ZEMIN`, Android `acilis_zemin` / `uygulama_zemin`, iOS
  `LaunchScreen.storyboard` + `capacitor.config.ts` → `ios.backgroundColor`.
  Ayrılırsa açılışta renk sıçrar.
- Yazı tipi tek: **Nunito**; başlık ayrı aile değil kalınlık (`font-display`). İki
  istisna, ikisi de tek başlık: açılıştaki "RABI" **Rubik** (`font-acilis`), aylık
  özet kapağındaki ay adı **Manrope** (`font-marka`). Başka yerde kullanma.
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar; derlemeye girmez, uygulama
  oradan import etmez.
- Sütundaki sayılara `rakam` (tabular-nums). Alt menünün altında kalan içerik için
  `guvenli-alt`.
- **Yazı seçimi ve `touch-callout` kapalı** (`globals.css`): uzun basış oyunda
  "Kopyala" çubuğu açıp turu kesiyordu. Tek istisna giriş alanları (`input`,
  `textarea`, `contenteditable`).
- Çizgi ikon lucide; hizalanan kardeşleri olan yerde emoji kullanma (telefondan
  telefona başka çiziliyor).

### Maskot

- Pozlar üretilir: kaynak `assets/maskot/*.png` (zemini kesilmiş, **saydam** 2048 PNG
  — zorunlu, betikte zemin silme yok), betik `scripts/maskot-uret.mjs`, çıktı
  `public/tavsan-*.png`. Çıktılar depoda ama **elle düzenlenmez**. Bütün pozlar aynı
  tuvalde **aynı yükseklikte** (`Rabi` ölçüyü tek sayı olarak biliyor).
- **`durum` ile `poz` ayrı kalır.** `durum` yalnız ekran okuyucu etiketi, dosyayı
  `poz` seçer. Durumdan dosya türetme: `KurulumMaskotu` iki adımda aynı görseli
  taşımak zorunda.
- Küçük yerlerde (≈70 px altı) baş: oyun başlıkları `yuz`, ana sayfa selamlaması ve
  kurulum karşılaması `kafa`.
- `yuz`, "normal maskot"un ölçülmüş kırpımı ve **ikonun, Android engel katmanının ve
  pomodoro bildiriminin de kaynağı**. Kırpma değişirse: `maskot-uret.mjs`in yazdığı
  sayılarla `ikon-uret.mjs` → `MASKOT` güncellenir ve `tavsan-yuz.png` kopyaları
  yenilenir: `android/.../drawable-nodpi/tavsan_yuz.png` ve
  `ios/App/KalkanGorunumu/tavsan_yuz.png` (yerli taraf `public/`i okuyamıyor).
- `sevinen` ve `ziplayan` ikisi de kullanılıyor (`ziplayan` günlük hedefi tutturana).
  "sinirli" kaynağı bilerek kullanılmıyor: Rabi yanlışta kullanıcıya kızmaz.

### Açılış ekranı (ders makarası)

- Süre `ACILIS_SURESI` (2,26 sn); tasarım `tasarim/acilis-arsiv.html` → 3. tur,
  Yazı C · 2. Zaman çizgisi `globals.css`teki açılış bloğunun başında; süreyi
  değiştirirsen oradaki gecikmeler de değişir.
- Kullanıcının açılış şartları: tavşan köşeye (özellikle sol üste) uçmaz; yuvadan
  zıplayan tavşan ve yerden fırlayan harf yok; ışın saçan zemin yok; defter dokusu ve
  yazı altı kıvrık çizgi yok; ekran kısa kalır.
- Makara genişliğini içindeki görünmez son harf (`acilis-olcu`) verir (eşit pencere
  "RAB I" okutuyordu); kırpma pencerede değil `acilis-kuyu`da. Kelime şeritlerden önce
  söner (kuyu gölgeleri iz bırakmasın).
- Katmanı son şeridin `animationend`i (`acilis-serit-kalk`) kaldırır, zamanlayıcı
  emniyet. Katman sonuna kadar dokunuş yutar.
- **Tuzak 1:** ekran `acilis-bekliyor` ile duraklatılmış başlar (sunucu HTML'inde de),
  iki `requestAnimationFrame` sonra salınır; `visibilitychange` dinlenir, emniyet
  zamanlayıcısı var. Yoksa animasyon Android açılış ekranının arkasında biter. Sayaç
  bu yüzden `acilis.tsx` içinde, `AppShell`de değil.
- **Tuzak 2:** açılış `prefers-reduced-motion` altında **susmaz** (kullanıcı kararı;
  Android'de tercih çoğu zaman pil tasarrufundan geliyor). Uygulamanın geri kalanı
  tercihi izler.
- Kurulumdan ana sayfaya geçiş uçmaz, **soluyor** (`KurulumGecisi`). Uçuşu geri
  getirirsen varış noktası **ölçülür**, yazılmaz.

### Android uçtan uca ekran

`MainActivity`, `super.onCreate`ten önce `EdgeToEdge.enable(this)` çağırır; eski
`setStatusBarColor` / `setNavigationBarColor` / `layoutInDisplayCutoutMode`'u elle
çağırma. Boşluklar `viewport-fit=cover`, `SystemBars`'ın `--safe-area-inset-*`
değerleri ve `--guvenli-ust` / `--guvenli-alt` ile çözülür; yerli tarafta ayrıca dolgu
ekleme (iki kez uygulanır).

### Kurulum

- Sıra: **karşılama** → **isim** → **tanışma** → soru adımları. Karşılama ile tanışma
  `adimlar`da ama `Kurulum` ikisi için erken döner (kart, geri, ilerleme yok).
  İlerleme onları **saymaz** (`noktaAdimlari`, ayrı liste — diziden çıkarılsalar
  `ilerle` atlardı); payda bu listenin **boyu** (notlar adımı herkeste yok).
- Soru adımları: üstte ince ilerleme çubuğu; maskot 76 px solda, soru onun konuşma
  balonunda, sola hizalı. Alttaki `flex-1` yalnız isim ve bölüm adımlarında;
  ötekilerde içerik `my-auto` ile ortalanır (`flex-1` artan yeri yer).
- **Devam eksik cevapta pasif:** ad geçerli, alan kartına dokunulmuş, bölüm adımında
  üniversite+bölüm, notlar adımında en az bir sayı. Sınıf, hedef, hatırlatma
  varsayılanla gelir. Bölüm ve notların atlama yolu "daha sonra seçeceğim" onay
  kutusu (`SonraSec`); işaretlenince o adımda yazılanlar temizlenir. Alan adımında
  hiçbir kart (Karar vermedim dahil) seçili gelmez. Ad ipucu: boşken soluk yönerge,
  kısayken kırmızı uyarı.
- **`KurulumMaskotu` adımdan adıma uçar:** kutusunu `Kurulum`daki ref'e yazar (bileşen
  sökülüyor); ters dönüşüm `useLayoutEffect`te; iki rAF + emniyet zamanlayıcısı;
  ölçmeden önce eski dönüşüm silinir. Reduced-motion'da uçmaz.
- Tanışma: başlık `tanismaBasligi` kurar (ad boşsa virgül düşer); son düğme
  "Hazırım". Tek süs adın altındaki çizilen hat (`tanisma-hat`, bir kez çizilir);
  emoji serpme, degrade zemin, madalyon, rozet yok. Maskot 150 px (karşılamayla
  aynı), `poz="el-sallayan"`, yanında ayrıca 👋 yok. Alttaki üç noktanın
  **sonuncusu** dolu. Yeni süs eklemeden sor: adı öne mi çıkarıyor, yarışıyor mu?

### Ayarlar

- Satırlar kapalı açılır, tek satır açık (`acikAyar`). Anahtarlı satırlar açılmaz;
  hatırlatma saati ayrı satır.
- Şablon düzenleme ayarlarda yok. `lib/sablonlar.ts` duruyor (yeni denemede seçiliyor,
  yedeğe giriyor); `ayarlar.varsayilanSablonId` okunuyor ama ayarlardan değişmiyor.

## Pomodoro

### Deneme provası

- Kip anahtarı başlığın altında (Pomodoro · Deneme provası,
  `tasarim/pomodoro-2a.html`). Süreler `lib/sinav-provasi.ts`: TYT 165, AYT 180,
  YDT 120, STS 40 dk (MEB, kullanıcı istedi). Soru sayıları `OSYM_TEST_SORU`dan
  toplanır, elle yazılmaz; süreler elle (ÖSYM kararı). Provaya geçmek TYT'yi seçer.
- Prova **`Asama` değil ayrı kip** (yoksa `sonrakiAsama` arkasına mola koyar):
  çalışma/mola satırları çizilmez (ayarlar kaybolmaz), ders çipi yok, seans
  `PROVA_DERSI` ("Deneme Çözümü", seçilebilir ders değil) ile yazılır, tur sayacı
  ilerlemez, mola gelmez, dolunca sıradan çalışma turuna döner. Yarıda atlamak seansı
  **yazmaz**.

### Sahne ve kalıcı tur

- Başlat sayacı tam ekran `CalismaSahnesi`ne çıkarır (`tam-katman-girisi`). Geri tuşu
  turu bitirmez, duraklatmaz da: sayaç işliyorsa ekrandan çıkılır, tur sürer;
  duraklatılmış turda yalnız sahne kapanır.
- **Bileşen kalıcı:** `AppShell` onu kökte kurar, tur canlıyken
  (`PomodoroDurumu.canli`) sökmez. Sabit, ayrık bir `div`e (portal kabı) çizilir, kap
  ekran açıkken sayfadaki yuvaya taşınır. Kap **hiç değişmemeli** (React portalı
  yeniden kurar).
- Gizliyken sahne yok (`gorunur`): açık sahne başka ekranda geri tuşunu yutardı.
- Saat `components/pomodoro-saati.tsx`: alt menünün üstünde sağda; kalan süreyi
  bitiş zamanından **kendisi** sayar (her tikte durum göndermek `AppShell`i
  çizdirirdi). Dokununca Pomodoro.
- Sahnenin geri oku `onArkaPlan` → `setEkran(null)`, `geriGit` değil (o sahneyi kapatıp
  kendini çağırırdı). `sahne` state'i `calisiyor`dan ayrı; kapatan: geri oku, "Turu
  bitir", provadan çıkış. Sahnede açıklama satırı yok (kullanıcı kaldırttı).
- Hazırlık ekranında süre, prova ve kip `turIcinde` kilitli. Süreler `Cekmece`de.
  Dersler tek satırlık yatay şerit; başta en çok çalışılan üç ders (`calismaSirasi`),
  sıra ekran açılınca bir kez kurulur. "Diğer" düğmesi ve ders çekmecesi yok
  (kullanıcı kaldırttı). "Ekran açık kalsın" ayar kartında, iki kipte de. Başlat
  `sticky`, alt menünün üstünde.

### Müzik yok

- Oyun müziği ve Pomodoro lo-fi'ı kaldırıldı (kullanıcı). `Ayarlar.oyunMuzigi`,
  `oyunMuzikTuru`, `ses`, `sesSeviyesi` kayıtta duruyor, okunmuyor. `lib/ses.ts` ve
  `lib/lofi.ts` dosyada. Aşama sonu **zili** ve oyun efektleri (`oyun-sesi.ts`, "Mini
  oyun sesleri" anahtarı; aylık özet de ona bakar) duruyor. Geri getirilirse tarihçe:
  `git log -- components/ekranlar/pomodoro.tsx`, `lib/oyunlar/mod-muzigi.ts`.

### Kilit ekranı bildirimi (Android)

- Ön plan servisi `OdakServisi` (ad odak kilidinden kalma, değiştirme — manifest,
  eklenti, `PomodoroKapanis` dokunur) **her turda** ve molada da kurulur; kilit ve
  Rahatsız Etme üstüne binen seçenekler. Molada engelleme yok (web servise boş liste
  geçer).
- Düzen `DecoratedCustomViewStyle`. Renkler tema değişkeni değil:
  `?android:attr/textColorPrimary` ve `bildirim_amber` (iki zeminde okunan ton).
- Sayacın iki kopyası var (servis + web); bildirim düğmesi `pomodoroKomutu` ile web'e
  geçer, `devam` yeni **bitiş zamanını** taşır (web sayacı mutlak zaman damgasından
  okur, `lib/pomodoro.ts`).
- Duraklatmak servisi durdurmaz, dondurur (`odakKilidiniDuraklat`); turdan çıkan
  yollar `odakKilidiniBitir`. Uygulamanın Devam'ının yerli karşılığı yok (`baslat`
  baştan kurar).
- Bildirim izni tur başlarken `izinIste` ile istenir, Ayarlar'daki bildirim
  anahtarından bağımsız (Android 13+ izinsiz ön plan bildirimi görünmez).

### Odak kilidi (Android)

- Yalnız Pomodoro'daki **"Odak koruması"** satırında
  (`components/odak/odak-ayarlari.tsx`); Ayarlar'da kopyası yok. Satır kapalı başlar,
  Süreler'in hemen altında, hazırlık ekranında.
- Anahtar kilidi doğrudan açmaz: önce `odak-daveti.tsx`, "İstiyorum" denince kilit;
  izin ekranı yalnız adı yazılı düğmeyle.
- **Engel katmanı** (`EngelKatmani.kt`, `res/layout/engel_katmani.xml`) yerli düzen.
  Maskot `drawable-nodpi/tavsan_yuz.png` (üç kopya, bkz. Maskot). Renkler
  `values/colors.xml`, `values-night/` birebir aynı. Kalan süre en büyük öge; çubuğun
  toplamı servis kurulurken damgalanır (`OdakServisi.baslangicZamani`), bilinmiyorsa
  çubuk boş. Çip hep durur (ders adı Türkçe yerelle büyütülür, yoksa "DERS MODU
  AÇIK"). Onay ekranı (`odak_onay`) kilidi kapatmanın bedelini söyler.
- Gecikme: `ARALIK_MS` 350 yalnız engellenecek uygulama varken; sayaç için
  `BILDIRIM_ARALIGI_MS`. Katman bir kez şişirilir (`EngelKatmani.hazirla`);
  dinleyiciler `duzenKur`da, `goster` değil (üst üste binerdi).
- Ses odağı: `AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE`, tur bitene kadar bırakılmaz. İki
  koşullu yerde alınır: başlarken son bir dakikada yasaklı uygulama önde olduysa
  **ve** bir şey çalıyorsa (`baslarkenCalaniSustur`); tur içinde yasaklı uygulama öne
  gelince. Mini oynatıcı penceresi kapatılamıyor (erişilebilirlik API'si Play
  politikası yüzünden kullanılmıyor).
- `com.android.vending` ve Play Games manifest `<queries>`de adıyla; `ONERILENLER`de
  işaretli gelir ama zorunlu değil.

## Uygulama ikonu

- Tek kaynak `scripts/ikon-uret.mjs` (`sharp`, `devDependencies`te); `public/icon-*.png`
  ve `android/.../mipmap-*` oradan. Çıktılar depoda, **elle düzenlenmez**.
- Maskot `public/tavsan-yuz.png`; ölçüler kenar uzunluğuna **oran** (her yoğunluk +
  108 birimlik uyarlanabilir tuval). `icon-maskelenebilir-512.png` köşesiz, ikon
  ortadaki %80'de. Uyarlanabilir zemin PNG (`mipmap-*/ic_launcher_background.png`).
  `public/icon.svg` yok. iOS ikonu `AppIcon-512@2x.png` (1024) köşesiz ve **alfasız**.

## Yanlış soru

- Deneme formundaki **"Yanlış soru ekle"** tam ekran **katman** açar, ekran değil:
  başka ekrana geçmek `denemeFormu`nu söker. Kayıttan sonra katman kapanır.
- Mantık paylaşılır (`components/yanlis-soru-ekle.tsx`: `useYanlisSoruEkleme`,
  `EklemeFormu`, `FotografDugmeleri`), kopyalanmaz. Yazma sırası: önce blob
  IndexedDB'ye, sonra liste kaydı.
- Ders on çipten seçilir, Kaydet ancak seçilince açılır. **Ders listesi on ders ve
  tek** (`CALISMA_DERSLERI`, `lib/dersler.ts`; Pomodoro, Soru Takibi, yanlış soru):
  Türkçe, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Yabancı Dil, Felsefe,
  Din Kültürü. Yeni ders eklemeden sor. Eski kayıtlardaki adlar yeniden
  adlandırılmaz; süzgeç, renk, istatistik onları da tanır.
- Konu 30, not 60 harf (`YANLIS_SORU_KONU_SINIRI`, `YANLIS_SORU_NOT_SINIRI`); sayaç
  var, kayıtta da kırpılır.

### Fotoğrafa çizim

`components/soru-cizimi.tsx`, hesaplar `lib/cizim.ts`.
- Tuval yalnız fotoğrafın `object-contain` kutusunda (`fotografKutusu`); dışarı
  taşan nokta kenara **kısılmaz**, tuval keser.
- Fotoğrafa dokunulmaz: çizim ayrı saydam PNG, aynı IndexedDB'de
  `cizimAnahtari(resimId)` altında; kayda alan eklenmedi. **Fotoğraf kimliği listesi
  tutan yeni bir yer yazarsan çizimi de ekle**, yoksa öksüz sayılıp silinir (öksüz
  temizliği, silme, yedek zaten biliyor).
- Çizgiler ve kalınlık oran olarak; kayıt fotoğrafın çözünürlüğünde (uzun kenar ≤
  1600). Kalınlık ve yakınlaştırma aynı elle yazılmış dikey çubuk (`DikeyCubuk`;
  `input type="range"` WebView'de bozuk). Yakınlaştırma %100–%400, logaritmik;
  kalınlık ekrandaki boy (`cizgiKalinligi`). El aracı yalnız yakınlaştırılmışken.
- Silgi halkası ölçeklenen katmanın dışında, konumu state'e değil stile yazılır.
- Geri tuşu **kaydeder**; atmanın yolu Vazgeç. Vazgeç/Kaydet araç çubuğunun hemen
  üstünde, tam genişlik.

## Soru Takibi

Bugün ve yalnız bir önceki gün düzenlenebilir (`gunKaydir(bugunIso, -1)`); eski günler
salt okunur, gelecek seçilemez.

## Aylık özet

`components/ekranlar/aylik-ozet.tsx`, `lib/ozet.ts`, afiş `lib/ozet-gorsel.ts`, tasarım
`tasarim/aylik-ozet.dc.html`. Araçlar listesinde **yok**. Ay takvim ayı.
- Bir ayın özeti **yalnız sonraki ayın 1'inde** açılır (`bekleyenOzetAyi`; kullanıcı
  kararı). Ana sayfa kartı hep var: aktifken en üstte renkli (`OzetDaveti`),
  değilken en altta gri ve sonraki açılış tarihiyle (`OzetBekliyor`). Kapatma düğmesi
  yok.
- Kapanan ayda en az **7 farklı etkin gün** yoksa hikâye açılmaz
  (`ozetGosterilebilirMi`); etkin gün = soru, Pomodoro, oyun, deneme, konu bitirme ya
  da okuma kaydı. Hiç veri yoksa (`bosMu`) kart aktif olmaz.
- Kapanan her ay `rabi-aylik-ozetler` arşivine bir kez yazılır (`AylikOzetArsivi`,
  `arsivdeEksikAylar`), silinmez; yedeğe girer, geri yüklemede **birleştirilir**.
  Yazmadan önce hazır bayrakları beklenir (boş ay bir daha düzelmez).
- Okunan konu `KonuIlerlemesi.bitisTarihi`ne (yalnız ilk bitişte damgalanır) göre
  sayılır; alanı olmayan eski kayıt hiçbir aya sayılmaz.
- Okuma süresi `KartDestesi`te, yalnız uygulama öndeyken (`useUygulamaGorunur`),
  kullanıcıya gösterilmeden ölçülür; `rabi-okuma-gecmisi`ne (`lib/konu/okuma-suresi.ts`)
  konu + gün + saniye, seans iki saatte kırpılır, yedeğe girer.
- Sayfalar yalnız veri varsa üretilir (kapak ve kapanış hep); dokunarak çevrilir,
  kendiliğinden akmaz.
- `ozetGorulen` ay **açılırken** işaretlenir; hesap `ozetAcik ?? bekleyenAy`.
- Renkler bileşende yazılı (tuval `var()` çözemez) ve `ozet-gorsel.ts` ile **birlikte**
  değişir. Punto/kalınlık `yz()` ile satır içi; CSS `font` kısayolu kullanma.
- Afişte harf aralığı `aralikliYaz` ile elle çizilir; etiket önce küçülür
  (`harfAraliginaGore`), sonra kısalır.
- `OyunTurKaydi.yanlis` ve `hatasiz` isteğe bağlı; yanlışı olmayan eski turda yalnız
  doğru sayılır.

## Yasal metinler

- Gizlilik, sözleşme ve veri özeti `public/gizlilik/` (`index.html`, `sozlesme.html`,
  `veri-ozeti.html`), `.github/workflows/gizlilik.yml` ile
  `https://ycistak.github.io/Rabi/`. Uygulama içi ekran (`components/ekranlar/yasal.tsx`)
  yalnız bağlantı verir (adresler `lib/veri/yasal.ts`); metnin uygulamada kopyası
  tutulmaz.
- **Gizlilik adresi değişmez** (`YASAL_SITE` Play Console'da kayıtlı); `index.html`
  yerinden oynamaz.
- Bağlantılar düz `<a target="_blank">` (Capacitor sistem tarayıcısına verir).

## Başarımlar (kodda `rozet`)

- Arayüzde ad **Başarımlar**; kod, `Ekran` kimliği `rozetler`, depo anahtarı
  `rabi-rozetler`, yedek alanı `rozetler` kalır.
- Ekran: tek sayaç, süzgeç (Tümü · Kazanılan · Kilitli), tam genişlik satırlar; türe
  göre gruplama ve istatistik ızgarası yok. İstatistik eklemeden sor: bu sayı hangi
  rozete ne kadar kaldığını mı söylüyor? `kademeSayimi`, `KADEME_SIRASI` testler ve
  bildirim için duruyor. Tarih kısa ("9 May"), yıl yalnız bu yıl değilse.
- Kutlama pencere değil yukarıdan inen şerit (`components/rozet-bildirimi.tsx`,
  tasarım `tasarim/basarim-bildirim.html`); dokunuşu geçirir. Kilit sarsılıp kalkar,
  renk ayrı katman (`rozet-yuz`; renkler `rozet-renk.ts`ten, keyframe'e yazılmaz). `BILDIRIM_SURESI` (4820 ms) `globals.css`teki
  gecikmelerle **eşleşmeli**.
- `bildirilecekler` her türden yalnız en değerlisini bildirir; kayda hepsi girer
  (`yeniRozetler`). Kuyruk `AppShell`de, ekranda tek bildirim, `key` = rozet kimliği.

## Seviye, havuç, mağaza yok

Üçü silindi; eski anahtarlar `ESKI_ANAHTARLAR`ta. Geri getirme: veriler elle
giriliyor ve harcanabilir ödül, veriyi şişirmeye sebep olur. Yeni ödül sistemi
düşünüyorsan sor: kullanıcı ödülü veriyi uydurarak alabiliyor mu?

## Hareket ve geçişler

- **Altı ortak sınıf** (`globals.css`): `sayfa-girisi`, `katman-zemin`,
  `pencere-girisi`, `alt-pencere-girisi`, `tam-katman-girisi`, `acilir-giris`. Yeni
  pencere/katman bunlardan birini kullanır. Yalnız giriş, çıkış animasyonu yok;
  160–260 ms.
- **Ekranları saran kutunun dolgusu `backwards`, `both` değil:** transform/opaklık
  animasyonu yürürlükteyken `fixed` katmanların kapsayıcısı ve yığın bağlamı değişir
  (alt menü taştı, onay penceresi menünün arkasında kaldı).
- Geçiş yalnız solma olamaz (fark edilmiyor). Geçiş duraklatılmış başlar
  (`SayfaGecisi`, `.sayfa-bekliyor`, iki rAF + emniyet). Animasyonu `AppShell`deki
  `key` oynatır. Tam ekran katmanlar `clip-path` ile yükselir, `transform` değil.
- Alt sayfalar aşağı çekilince kapanır (`useAsagiKaydirKapat`, `lib/asagi-kaydir.ts`);
  yeni alt sayfa kancayı `ref` olarak alır. Kapatılması karar olan sonuç sayfaları
  almaz.
- Izgara kartları sırayla gelir (`kart-girisi`, `components/ui.tsx` → `kartGirisi(sıra)`);
  gecikme tavanı JS'te (CSS `min()` eski WebView'de düşüyor), sekizinci kartta.
- Bilgi taşımayan bütün hareketler `prefers-reduced-motion` altında susar (açılış
  ekranı hariç).
- **Alt menü Android'de donuk, `backdrop-blur` yok** (her kıpırtıda yeniden
  bulanıklaştırma geçişi takıltıyordu). Sayfanın üstünde duran yeni çubuk eklersen
  aynı soruyu sor.
- **iOS'ta menü camdan** (tek istisna, kullanıcı istedi): yüzen kapsül, kayan mercek
  (`alt-menu`, `alt-menu-mercek`, `globals.css` → "Camdan alt menü"; hesaplar
  `lib/cam-menu.ts`). Sürüklenir (6 px eşikten sonra işaretçi yakalanır), arkasının
  rengini örnekler (`elementsFromPoint`, koyu zeminde `data-koyu`). Titreşim yok.
  Mercek konumu yerleşim pikselinde: `seritOlcusu` `offsetWidth` ile oran ölçer
  (tablette `body` `zoom`lu). Android'e taşımadan önce telefonda dene.
- Platform `<html data-platform>`e `layout.tsx` betiğinde yazılır (ilk kare cam
  olsun), `AppShell` yedek. Cam kuralları katman dışında (Tailwind'i ezsin).

## Oyunlar

### Ortak kurallar

- **Efektler ortak koddan**, oyun dosyalarına kanca yok: kabuk olayları sayaçtan
  türetir (`dogru`, `yanlis`, `kalan` props). Ses `lib/oyunlar/oyun-sesi.ts`, görsel
  `components/oyun-kabuk.tsx` + `globals.css`.

  | Efekt | Ne zaman | Nerede |
  | --- | --- | --- |
  | Sarsıntı | yanlış cevap | kabuk + `oyun-sarsinti` |
  | Süre nabzı + tek uyarı | kalan süre toplamın ¼'ünün altında | kabuk + `sure-nabzi` |
  | Kart kalkması | bankada tik | `oyun-bankasi.tsx` + `banka-kalkiyor` |
  | Konfeti | yalnız yeni rekor | `TurSonu` + `konfeti` |

- Doğru sesinin perdesi sabit (`playbackRate` sesi bozuyor); seriyi ödüllendirmek
  istersen ayrı ses ekle. `DOSYA_SEVIYESI` 0.42 telefonda ayarlandı.
- **Geri sayım** 3 · 2 · 1 · Başla (`components/oyun-geri-sayim.tsx`,
  `geriSayimSesi`) yalnız `oyun-tanitim.tsx` ve `TurSonu` içinde; oyun dosyaları
  bilmez. CSS süreleri (`geri-sayim-rakam`, `geri-sayim-basla`) `ADIM`, `BASLANGIC`
  ile eşleşir. Katman donuk beyaz, rakamlar `--primary-parlak`. Rakamların tonu aynı
  (`RAKAM_TONU`); `SAYIM_SEVIYESI` 0.8, `AKOR_SEVIYESI` altında (kırpılma).
- Tur sonu: isabet (`isabetYuzdesi`), hiç cevap yoksa "—". Hatasız tur şeridi
  (`lib/oyunlar/tur.ts` → `hatasiz`, süresi biten/elenen turda yok), konfeti değil.
  Puan çubuğu `transform` ile dolar (`tur-cubugu`).
- **Çarpı önce sorar** (`Onay`): oyun turu sürerken, deste ilk ekrandan sonra,
  yoklama ilk cevaptan sonra, Pomodoro "Turu bitir" başlamış turda. Kaybedilecek şey
  yoksa sormaz; geri tuşu/kenar kaydırma sormaz.
- **Yarıda çıkılan tur da bitirilir:** tur sonu çıkar, yanlışlar bankaya düşer. `yarim`
  bayrağı (`onTurBitti` 4. parametre) ile rekora, istatistiğe, geçmişe yazılmaz
  (`oyunlar.tsx` → `turBitti`); rekor rozeti kutlamaz.

### Oyun Bankası

- İki çıkış: **kazanılan** (genel testte doğru → düşer, "bankadan düşen" sayacı ve
  rozet) ve **elle tik** (sayaca dokunmaz). Yeni çıkış yolu uydurulabiliyorsa sayaca
  yazılmaz.
- Kazanılan tek yol **genel test** (`lib/oyunlar/banka-testi.ts`,
  `components/ekranlar/banka-testi.tsx`); turdaki doğru bankaya dokunmaz. Biçim şıklı
  soru (`bankaSorusuMetni`, `bankaCevabiMetni`). Yanlış bilinen kayıt olduğu gibi
  kalır (`testiIsle`; `bankayiGuncelle` kullanılmaz). Çeldiriciler bankadan, aynı oyun
  öncelikli; çeldiricisi olmayan kayıt teste girmez.
- Karta dokunmak soru açmaz. `BankaTuru` yalnız oyun kimliği (+ `ilk`) taşır; "sadece
  bunlardan bir tur" kaydı düşürmez. Süzme `oyunlar.tsx` → `bankaSorulari`.

### Modlar (`lib/oyunlar/mod.ts`)

| Mod | Saat | Yanlış | Kayıt |
| --- | --- | --- | --- |
| Sıradan | tura ait, 60 sn | süreden 3 sn götürür | var |
| Turbo | tura ait, 30 sn | süreden 3 sn götürür | var |
| Sıfır Tolerans | soruya ait (`SORU_SURESI`) | tur biter | var |
| Rahat | yok | hiçbir şey | **yok** |

- Mod ve başlangıç zorluğu tur öncesi tam ekranda (`TurAyariEkrani`, `ModSecimi`,
  `ZorlukSecimi`), varsayılan Sıradan · Orta. Mod bütün oyunlarda ortak, saklanır
  (`ANAHTARLAR.oyunModu`). Soru türü seçimi yok. Rahat seçilince sarı şerit kayda
  geçmediğini söyler; kapı `kayitliMi` / `turBitti`.
- **Ayarlardan sonra tanıtım yok** (kullanıcı kaldırttı): "Başlat" doğrudan sayıma
  gider; kurallar turdaki "?"te. Tanıtım yalnız ayar çıkmayan turda (banka).
- Oyun Bankası turu hep **Rahat** (`etkinMod`), ayar adımı yok (`secilebilir`), sayım
  yalnız ilk oyunda (`BankaTuru.ilk`).
- Mod kutularında lucide ikon; tur içi mod rozetinde emoji kalır.
- Zorluk şeritli seçici: dıştaki ray düğmelerin alanı, gösterge rayın üçte biri
  (`calc` ile yarım piksel kayıyordu).
- Seçim prop değil **bağlamla** iner (`components/tur-ayari-baglami.tsx`); oyunlar
  `useEtkinMod` / `useUyarlananZorluk` çağırır, `etkinMod` ve `uyumBasla` saf kalır.
- Sayaç tek yerde `lib/oyunlar/tur-sayaci.ts` (toplam 0 = sayaç yok). Saat ya tura ya
  soruya ait, ikisi birden olmaz (`mod.test.ts`).

### Zorluk

- Seçim başlangıcı, uyum (`lib/oyunlar/uyum.ts`) gidişi belirler: 3 ardışık doğru bir
  üst, 2 ardışık yanlış bir alt seviye. Seçim yoksa başlangıç orta. Seçim oyun başına
  saklanır (`ANAHTARLAR.oyunZorlugu`), kayan seviye saklanmaz. Kayma kullanıcıya
  **söylenmez**.
- `turSirasi` üç **eşit boylu** şerit döndürür (`SoruAkisi`, `ritim.test.ts`); oyun
  `akis[zorluk][sira]` okur. Havuzsuz oyunlar `akisUret`, banka turu `tekAkis`.
- Uyum `ilerle`nin zamanlayıcısında işlenir (`zorlukKaydet`, `setSira` ile aynı
  karede), cevap anında değil. Eşleştirme oyunlarında seviye `zorlukRef.current`'tan.
- Boss soruları kaldırıldı; `soruSuresi` tek argüman, zorluk süreyi değiştirmez.

### Oyunlara özel

- **Trigonometrik Oranlar** gizli (`OyunTanimi.kapali`, listeler süzer), silinmedi;
  geri açmak için `tanim.ts`teki `kapali: true`yi sil. Çeldiriciler aynı üçgenin öteki
  oranları; değeri doğruya eşit şık olmaz (`degerSayisi`). tan 30° "√3/3". Kesirler
  `components/kesir-yazisi.tsx` ile üst üste. 7-24-25 çizilmez (`sekil.test.ts`).
- **Dünya haritası** `scripts/dunya-uret.mjs` ile Natural Earth'ten üretilir
  (`lib/oyunlar/dunya-havuzu.ts`), elle düzenlenmez. İzdüşüm eşdikdörtgen (enlem
  doğrusal), Antarktika ve 84°K üstü kesik. Yakınlaştırma yok. Ekvator/dönenceler
  çizili, adları haritanın altında.
- **İklim Kuşakları:** yer ancak **tek** iklim tipiyle anılabiliyorsa soru olur (çok
  iklimli ülke yerine bölge noktası). Çeldiriciler `KARISTIRILAN`dan. Ülke kodu ve
  koordinat birbirini tutmalı (`iklim.test.ts`).
- **İzohips** haritaları tohumdan üretilir (`lib/oyunlar/izohips.ts`, mulberry32,
  `Math.random` değil); bankada tohum saklanır. Doğruluk `izohips.test.ts` ile
  (`yukseltiAlani`, 60 tohum); üretim sayılarını oynatırsan testler hangi soruyu
  bozduğunu söyler. Denizli haritada göl olamaz (sütun taraması), dekorlar yalnız
  tepe ve boyun; yamaç sorularında dekor yok. Yükselti sayısı işarete en yakın
  eğriye konur.
- Harita renkleri (deniz `trh`, kara `cog`, okyanus, iller) "renk derse aittir"
  kuralının bilinçli istisnası: gösterge.
- **Periyodik Tablo:** havuz TYT'lik 38 element (`periyodik-havuzu.ts`); ilk yirmi
  şart, üst sınır var (`periyodik.test.ts`). Çizim 18 grup, boş hücreler duruyor
  (`hucreVarMi`, havuzdan bağımsız); `PERIYOT_SAYISI` 6, lantanit/aktinit yok.
  Yakınlaştırma yok; ızgara satır içi ölçü (18 sütunlu Tailwind sınıfı düşebilir).
  Çeldiriciler komşu hücreler (`enYakinlar`). Sınıf sorusunda "Metal" şıkkı yok, Al,
  Sn, Pb'ye sınıf sorulmaz (`sinifSorulurMu`). Banka kaydı sembol + tip; şıklar kayda
  girmez.
- **Formül Eşleştirme:** alt indis `formulParcalari` ile çizilir, Unicode alt indis
  değil (Nunito'da yok); havuzda her rakam alt indis, Roma rakamı adda. El tek türden;
  tür bütün havuzdan seçilir, zorluk tür içinde öne alınır (`formul.test.ts`).
- **Tepkime Türü** (`tepkime-havuzu.ts`, her türden ≥10, toplam ≥100): `ayrica`daki
  türler çeldirici olamaz; tek istisna `N2 + O2 → 2NO`da yanma şıkkı. Cevaptan sonra
  `ayrica` söylenir. `tepkime.test.ts` yapıdan çıkan türleri, atom/yük dengesini,
  sade katsayıları denetler — denklem eklerken çalıştır. Hâl her denklemde yazılı.
  Yazım `2Fe^3+(suda)`, çizen `components/denklem-yazisi.tsx` (terim ortasından
  kırılmaz). Yanlıştan sonra uzun bekleme (`CEVAP_BEKLEMESI`), sayaç durur. Banka
  kaydı yalnız denklem.

## Ana sayfa

- **YKS geri sayımı** öğrencinin sınavına: `geriSayim(bugun, sinif)`, `sinavYili`
  (`lib/sinav-tarihi.ts`); sınıf eylülde `ilerlemisSinif` ile ilerler, burada ikinci
  kez ilerletilmez. Çubuk geçen son sınavdan başlar.
- **Günün hâli** selamlamanın altında **tek cümle** (`lib/gunun-hali.ts`,
  `gunun-hali.test.ts`); kart yok (kullanıcı kaldırttı), dokunulmaz. Kurallar sıralı,
  ilk tutan kazanır:

  | Sıra | Kural | Koşul |
  | --- | --- | --- |
  | 1 | Sınava yakın | kalan gün ≤ 7 her gün; 8–30 gün aşırı |
  | 2 | Seri kırılıyor | dün hedef tuttu, bugün 0 |
  | 3 | Seri sürüyor | bugün ve dün hedef tuttu |
  | 4 | Banka bekliyor | çözülmemiş yanlış var, bugün çalışılmış |
  | 5 | Tek derse yığılma | ≥ 20 soru ve %80'i tek dersten |
  | 6 | İhmal edilen ders | son 30 günde çalışılmış, 7+ gündür yok |
  | 7 | Deneme zamanı | son deneme 10+ gün önce (ya da hiç yok, 7+ günlük geçmiş var) |
  | 8 | Temel | hiç kayıt yok / başladın / hedef tuttu |

  4–7 aynı anda tutarsa günden güne dönüşümlü. Cümle günün tarihinden türeyen sayıyla
  seçilir (gün içinde sabit). Ders adına ek getirilmez. Günlük hedef sıfırsa cümle
  yok; sınav günü dinlenme cümlesi; kayıt yoksa "henüz soru kaydın yok".
- **Dört kutucuk** (Araçlar, Oyunlar) en son kullanılan başta (`lib/son-kullanilan.ts`).
  Sabitleme/"Düzenle" yok (kaldırıldı, anahtarları `ESKI_ANAHTARLAR`ta). Oyun
  kutucukları **dersi** gösterir (ders rengi), dokunuş `onOyunlaraGit(ders)` →
  `acilacakDers`, `oyunlar.tsx`te bir kez tüketilir. Ders geçmişi oyunlardan türetilir
  (`oyunlarinDersleri`).

## Yapılacaklar

`lib/yapilacaklar.ts`, `components/ekranlar/yapilacaklar.tsx`, tasarım
`tasarim/yapilacaklar-v3.dc.html`. Yedi günlük şerit + Sabah / Öğle / Akşam.
- Gruplama zamana göre; konum (`x`, `y`) yok, eski kayıtları `gorevleriNormalize`
  taşır.
- `EN_COK_GOREV` (10) **dilim başına**; `gorevEkle` engeller, `gorevleriNormalize`
  fazlasını eler.
- `EN_UZUN_GOREV` 24 karakter, satır ayrıca `truncate`; sınır satırdaki düğmelerle
  **birlikte** değişir. Satırda yalnız yıldız ve "⋯"; düzenle/ertele/sil "⋯"nün alt
  sayfasında (`GorevEylemleri`, sil en altta kırmızı). Bitmiş görevde yalnız sil.
  Düzenleme gün ve dilimi değiştirmez.
- Bugün şeridin dördüncü günü; `gorevleriTarihtenItibaren` üç günden eskiyi eler,
  etkiyle kayıttan da siler. Gün dönümü türetmeyle (`AppShell`), `setTimeout` değil.
  Geçmiş günler salt okunur. Ay takvimi yok.
- `+` her bölümde; ekleme sayfası dilimi sormaz, başlıkta yazar ("Bugün · Akşam").
  Erteleme ertesi gün aynı dilime, önce `Onay` (kırmızı değil); hedef doluysa
  `gorevErtele` `null` → toast. "Diğer" kategorisinde ad zorunlu, ≤ 14
  (`EN_UZUN_OZEL_KATEGORI`).
- Süre isteğe bağlı (`Gorev.sure`, `SURE_SECENEKLERI` 15·30·45·60·120 + `elleSure`
  kutusu, çip ile kutu tek cevap); varsayılan seçili gelmez; süresiz `null`, toplamda
  (`kalanSure`) sayılmaz.
- Renkler ayrı palet (`--gorev-*`), ders aileleri değil; beyaz kartta en az 4,6:1 —
  yeni tonda kontrastı ölç. Kayıtta rengin **adı**.
- Dosya adı `notlar.*` **olamaz**: `.gitignore` deseni yakalar (depoya ve Tailwind
  taramasına girmez). Yeniden adlandırmadan sonra `npm run build`'i tekrar çalıştır.

## Konu Anlatımı

- Müfredat **Türkiye Yüzyılı Maarif Modeli**; eski (2018) program adları kullanılmaz.
  İçerik `lib/konu/icerik/<sınıf>-<ders>.ts`; dosya başındaki yorum eski programdan
  neyin taşınmadığını yazar — yeni konu eklemeden oku. 9–11'de yedi ders tam, 11'de
  ayrıca İngilizce; 9–10 İngilizce yok. `icerik.test.ts` ders/sınıf çiftlerini
  denetler. Sekizinci ders `KonuDersId` + ders rengi ister. 11. sınıf soruları ayrı
  `11-<ders>-sorular.ts` (`sorulariBagla`), Edebiyat/Tarih/Coğrafya içerikte.
- Konu ölçüsü `lib/konu/maarif/iskelet.json`, `scripts/maarif-cek.mjs` ile
  tymm.meb.gov.tr'den çekilir; **elle düzenlenmez**. `maarif.test.ts` kelime
  örtüşmesiyle denetler (kısaltırken konuyu tanıtan kelimeyi atma); Türk Dili ve
  Edebiyatı konu listesi denetlenmez (`KONU_LISTESI_DENETLENMEYEN`). Ayrıştırıcıyı
  değiştirmeden önce betikteki yorumları oku.
- **Kart:** başlık 44, metin 240 karakter (görünen metin); konu başına 6–16 kart. Sınırı
  aşan kart bölünür, sınır büyütülmez; tavanı doldurmak için kart yazılmaz.
- **Kart metni biçimi** (`lib/konu/kart-metni.ts`, `components/konu/kart-metni.tsx`;
  kullanıcı düz paragrafı iki kez geri çevirdi): her `\n` blok; `- ` madde; `**…**`
  vurgu. Önce tanım/formül, sonra maddeler, gerekirse tek satır sonuç. Testte: satır ≤
  110 karakter, satırda ≤ 2 cümle, liste ≥ 2 madde, maddeler ya hep adlı ya hiç.
- Banka kaydı kartın **başlığını ve metnini** taşır (kimlik `${konuId}-${sıra}` kayar).
  Yeni kart alanı eklenirse kayda da konur.
- **Kilit:** önceki konu okunup soruları geçilmeden (`GECME_ORANI` %50) açılmaz
  (`konuKilitli`, `lib/konu/ilerleme.ts`); cevaplanmamış yoklama geçilmiş sayılmaz
  (`konuTamam`). "Kilidi aç" onay penceresiyle açar, `acildi` kayda girer. Yarıda
  çıkılan deste konuyu bitirmez.
- **Deste akışı** (`lib/konu/deste-akisi.ts`, `tasarim/bilgi-karti.html`): kartlar
  arasına mola ve hızlı kontrol; kısa destede kontrol → mola, uzunda kontrol → mola →
  kontrol; ara ekranlar kart sayılmaz. On karttan uzun destede iki kontrol, kısada
  bir; kontrol dayandığı kart (`kart`) okunmadan sorulmaz, "Tekrar oku" oraya döner;
  yanlışta "Devam et" uyarır ama engellemez. Başlık ortak (`deste-basligi.tsx`), zemin
  dersin rengi, vurgu `bicim.murekkep`. Mola metni
  `MOLA_METINLERI`; konfeti ve puan yok. `BilgiKarti.etiket` / `not` isteğe bağlı;
  not **konu başına bir kartta**, ≤ 120 karakter.
- **Yoklama** (`components/konu/soru-sahnesi.tsx`): iddia (`soru()`, Doğru/Yanlış, soru
  işareti yok) ya da iki şıklı (`sikli()`). Soru sayısı kart+1 ile kart×1,3+1 arası;
  iki biçimden en az ikişer; doğru/yanlış ve A/B dengesi bütünde %40–60, her destede
  iki cevap da var. Karar pencere açmaz, `BEKLEME` (850 ms) sonra sıradaki soru;
  `aciklama` içerikte zorunlu ama gösterilmez. Görselli iddia çizime bakılarak
  tartılabilmeli (tablo görsellerinde iddia çoğunlukla yanlış olan); sorular
  kartlardaki `Gorsel` türlerini kullanır, yeni çizim dili açılmaz. Renkler `.sahne` (`globals.css`), karar rengi paspartuda.
- **Özet** (`components/konu/konu-ozeti.tsx`): ne bitti, ne kadar (`okumaSaniyesi`),
  kart başlıkları + Rabi'nin notu, sırada ne var (`GECME_ORANI` yazılı). Süs ve ders
  rengi yok. Yalnız desteden gelince (`SoruSahnesi.ozetli`). "Haritaya dön" yazı,
  üstte çarpı yok. Yoklama bileti kaldırıldı, yeniden uygulanmaz. Titreşim ve ses yok
  (kullanıcı); VIBRATE izni oyun haptiği (`@capacitor/haptics`) için duruyor. Yarıda bırakılan yoklama sayı
  yazmaz (`SahneSonucu.bitti`).
- **Kapanış** (`Kapanis`, `tasarim/soru-kapanis.dc.html` → 2a) kâğıt zeminde
  (`.kapanis`). Kademe `lib/konu/kapanis.ts` (≥ %90, ≥ geçme sınırı, altı), haritadaki
  yıldızlarla aynı eşik. Süre ilk sorudan "Bitir"e. Yanlış listesi üçle kesilir.
- **Harita sekmesi** alt menüde (kod `konu`), `KARTLAR`da yok; açılış karşılaması yok.
  Ayarlardaki sınıfla açılır (`haritaSinifiBul`). 12. sınıf seçicide kilitli kart
  (`HARITA_SINIFLARI`, `HaritaSinifi`); `KonuSinifi` 9–11, kartlar yazılınca 12
  `KONU_SINIFLARI`na eklenir. `sinifDersleri` boş programları haritada gizler.
- **Patika** (`components/ekranlar/konu-haritasi.tsx`, `tasarim/konu-haritasi.html`):
  yeşil kitap anlatım, turuncu kitap çifti sorular, gri kilitli; sonda `Sandik`.
  Kitap rengi işe ait (`--success`, `--primary-parlak`), derse göre değişmez; derse
  ait olan tema bandı ve simgeler (`lib/konu/harita-temasi.ts`, emoji değil, opaklık
  `--patika-simge`). Deste zemini `zeminRengi`. Yol hesaplanır (`KAYMA`, kübik
  Bezier, SVG 400 px); bölüm kutusu `overflow: clip` (`hidden` değil), `BANT_PAYI`,
  `BOLUM_ARASI`. Numara yalnız yeşil kitapta, konuyu sayar. Kitaba basınca ortada
  `KonuKarti`.

## Hedef kataloğu

- Hedef aranıp seçilir; veri `lib/veri/hedef-katalog-2025.json` (ÖSYM kılavuzundan ETL:
  ayrı depo `Asaf Belge/files`, `src/etl_kilavuz.py` → `src/uygulama_profili.py`;
  elle güncellenmez). Erişim `lib/veri/katalog.ts`, mantık `lib/hedef-katalog.ts`.
- Sıra ÖSYM'nin değeri, yuvarlanmaz; belirsizlik `bantYaz`ta. **Puan katalogda
  tutulmaz**, `siralamadanPuan` ile hesaplanır; `siralamadanPuan` ve `yilSiralamasi`
  birbirinin **tersi** (`hedef-katalog.test.ts`).
- `bolumBul` üniversite parametresi alır. Önlisans, KKTC uyruklu kontenjanlar ve
  puansız programlar dışarıda. Aynı adlı programa fakülte eklenir; kılavuz aynı adı
  iki kez veriyorsa sırası iyi olan tutulur.
- Liste `Ayarlar.puanTuru`ya göre süzülür (`bolumleriGetir`, `bolumAra`); `bolumBul` ve
  "bu bölüm burada var mı" denetimi süzgeçsiz. "Alanım dışındakileri de göster"
  anahtarı yalnız alan seçiliyken. Süzgeç öğrencinin alanından (`varsayilanTur`),
  seçilen bölümün türünden değil.
- `Ayarlar.puanTuru` `PuanTuru | null`; `null` varsayılanla doldurulmaz,
  `guncelTahmin` `null` döner. Kurulum ve Ayarlar'da dört tür (Dil dahil,
  `SECILEBILIR_TURLER`).
- Elle giriş kipi kalır (katalog dışı kayıtta `universiteBul` null → ekran o kiple açılır); `Hedef` kimlik değil **ad** tutar; seçim
  iki addan türetilir.
- Kurulumdaki bölüm adımı atlanabilir (`KurulumSonucu.hedef` `null`); liste
  `components/hedef-secici.tsx` ile paylaşılır; puan/sıra `tahminEt` ile; kaydedilen
  puan türü seçilen bölümünkü.

## Doğruluk

Puan ve sıralama hesabı **tahmindir** ve arayüzde her zaman böyle sunulur. Tahmini
kesin sayı gibi gösteren bir arayüz yazma; uyarıyı kapatılabilir yapma.

## iOS

Aynı statik derleme Capacitor iOS kabuğunda (`ios/`). Yeniden yazım (RN, Swift)
reddedildi.

- **Platform `isNativePlatform()` ile sorulmaz** (iOS'ta da `true`); `androidMu()` /
  `iosMu()` (`lib/platform.ts`). Yeni yerli eklentinin hangi platformda olduğunu oradan
  söyle.
- iOS'ta yok: Rahatsız Etme, ses odağı, Play güncellemesi, çökme raporu (Crashlytics
  köprüsü yazılmadı, soru hiç çıkmıyor).
- **Uygulamada başka platform/mağaza adı geçmez** (App Store 2.3.10): "Android",
  "Play" diyen metin ya yalnız Android'de çizilir ya platform adı olmadan yazılır.
- **Live Activity sayaç:** köprü `lib/canli-sayac.ts`, Pomodoro onu `lib/odak-kilidi.ts`
  üzerinden çağırır; yerli `ios/App/App/CanliSayacEklentisi.swift`, çizim
  `ios/App/KilitSayaci` (iOS 16.2+), önizleme `tasarim/ios-kilit-sayaci.html`.
  `PomodoroEtkinligi.swift` iki hedefte derlenir. Sayı `Text(timerInterval:)` ile akar;
  bayatlama tarihi bitiş. Düğmeler iOS 17 (`LiveActivityIntent`): sayacı dondurur,
  kalkanı ve zili yönetir, sonra `pomodoroKomutu`. Zil metni `lib/bildirim.ts` ve
  `CanliSayacEklentisi.swift`te iki kez yazılı. Eklenti Screen Time'a dokunmaz.
- **Odak kilidi Screen Time ile** ("Family Controls (Distribution)" yetkisi; uygulama,
  `OdakIzleyici`, `KalkanGorunumu` için ayrı onaylı). Yeni eklenti kimliği için ayrı
  başvuru **ve** portalda Identifiers › Additional Capabilities › Family Controls
  (Distribution) kutusu elle işaretlenmeli (API'de ve `scripts/app-store-hazirla.py`'de
  yok, yalnız hesap sahibi/Admin); yoksa dışa aktarma "profile doesn't include the
  Family Controls capability" ile düşer.
  - `ios/App/App/EkranSuresiEklentisi.swift` (köprü `lib/ekran-suresi.ts`),
    `ios/App/OdakIzleyici` (DeviceActivity; tur sonunda kalkanı kaldırır, en az 15 dk
    aralık — kısa turda başı geçmişe çekilir), `ios/App/KalkanGorunumu` (renkler ve
    `tavsan_yuz.png` kopyalı; kalan süre `rabiTur` zamanlayıcısından),
    `components/odak/ios-odak-ayarlari.tsx`.
  - Tek anahtar (kalkan bildirimi de keser). Seçim Apple'ın seçicisinden, opak
    belirteçler; liste satırlarını yerli `EngelListesi` çizer, web yer ayırır,
    pencere açılınca gizler (`katmanlariIzle`). **Sayfaya yüzen yeni çubuk eklersen
    `data-yuzen` ver.**
  - Duraklatmak kalkanı kaldırır, devam yeniden kurar.
- **Xcode hedefleri betikle** (`scripts/ios-eklenti-hedefleri.rb`); `project.pbxproj`i
  elle yazma. Betik değişince `.github/workflows/ios-proje.yml` macOS'ta çalıştırıp
  dala commit'ler.
- **İmza:** arşiv otomatik imzalı, dışa aktarma dağıtım imzasıyla
  (`ios-testflight.yml`); imzasız arşiv yetkiyi düşürür, ad-hoc'u iOS 26 SDK reddeder.
  Hesapta kayıtlı bir iPhone gerekir. Yüklemeden önce üç parçada yetki denetlenir.
  Apple bulut imzalaması (Admin API anahtarı); depoda sertifika/profil yok.
- **Geri hareketi** yerli tarafta (`AnaDenetleyici.swift`,
  `UIScreenEdgePanGestureRecognizer` → `rabiGeri` → `geriGit`); uygulama kendini
  kapatmaz. Parmağı izleyen geri kaydırma `window.rabiGeriKaydirma`
  (`lib/geri-kaydirma.ts`, `[data-geri-sayfa]`), durum makinesi
  `lib/geri-kaydirma-denetci.ts`, hesap `lib/geri-kaydirma-hesap.ts`. Altında önceki
  ekranın DOM kopyası (`ekranGoruntusuKaydet`, `.geri-onizleme`, `PARALAKS`); kopyadan
  `fixed` öğeler ve kimlikler (`id`, `data-geri-sayfa`, `data-yuzen`, `data-tanitim`)
  atılır. Kayan sayfa donuk zemin alır (`zeminKur`); bırakınca gerçek ekran
  hareketsiz kurulur (`.sayfa-yerinde`). Kurallar: sürüklerken `animation-name: none`; ekran `flushSync` ile aynı
  görevde; geri yönü `.sayfa-geri` sınıfı; çıkış hızı parmağın hızı; tanıtım ve alt
  menü sürüklenirken kaymaz.
- **Çizerken kenar kaydırması yok sayılır** (`geriKaydirmayiKilitle`); parmağın sayfayı
  sürüklediği yeni yüzey aynı kilidi kullanır.
- Android 14+'da aynı arayüz: `MainActivity.geriKaydirmayiBagla`
  (`OnBackPressedCallback`), yalnız sol kenar; `enableOnBackInvokedCallback` yalnız
  `MainActivity`de (odak katmanının `KEYCODE_BACK`i bozulmasın).
- **Sekmeler arası yana kaydırma** (iki platform, `lib/sekme-kaydirma.ts`, hesap
  `lib/sekme-kaydirma-hesap.ts` → `birakmaKarari`): sıra `SEKME_SIRASI`; sayfa parmağı
  izler, karar ekranın üçte biri ya da hızlı savrulma; kilitlenince `touchmove`
  engellenir (pasif olmayan dinleyici). Yalnız yatay kayan şerit önce kendini kaydırır.
  Sayılmaz: kenardan başlayan, yazı alanı, alt menü, araç/form/genel test/tanıtım ya da
  açık katman varken.
- Ses oturumu `.playback` + `.mixWithOthers` (`AppDelegate.swift`): sessizde de çalar,
  arkadaki müziği kesmez. Sayfa ve iç kutularda kaydırma çubuğu yok
  (`showsVerticalScrollIndicator`, `globals.css`).
- iPhone + iPad (`TARGETED_DEVICE_FAMILY = "1,2"`); iPad'de `--olcek` zoom,
  `UIRequiresFullScreen` yok, dört yön açık; iPhone yalnız dikey.
- **Windows'ta derlenmez:** CI `.github/workflows/ios.yml`. `npm run sync:ios` (Windows
  yollarını `scripts/ios-yol-duzelt.mjs` düzeltir), çıplak `cap sync ios` değil.
- **Yayın** `v*` etiketiyle TestFlight'a; sürüm `android/app/build.gradle`dan
  (`versionName`, `versionCode` + çalıştırma sayısı). Mağazaya App Store Connect'ten
  elle gönderilir.

## Derleme

APK için **JDK 21 şart** — sistem varsayılanı JDK 25, Gradle 8.14.3 desteklemiyor.
`JAVA_HOME=/usr/lib/jvm/java-21-openjdk npm run apk`.

Değişiklikten sonra en az `npm run typecheck`, saf mantığa dokunduysan `npm run test`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
