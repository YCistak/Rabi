# iOS

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

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
- **Kayan kutu ekranla birlikte sökülmeli:** denetçi ekran değişimini kutunun
  `isConnected`ından anlar; yalnız gizlenen `[data-geri-sayfa]` "değişmedi" sayılır ve
  önizleme yeni ekranın üstünde kalır (Pomodoro yuvası bu yüzden koşullu kuruluyor).
- **Çizerken kenar kaydırması yok sayılır** (`geriKaydirmayiKilitle`); parmağın sayfayı
  sürüklediği yeni yüzey aynı kilidi kullanır.
- Android 14+'da aynı arayüz: `MainActivity.geriKaydirmayiBagla`
  (`OnBackPressedCallback`), yalnız sol kenar; `enableOnBackInvokedCallback` yalnız
  `MainActivity`de (odak katmanının `KEYCODE_BACK`i bozulmasın).
- **Sekmeler arası yana kaydırma yok** (iki platform; kullanıcı kaldırttı, 2026-10):
  sekme yalnız alt menüden değişir. Kenardan geri kaydırma bundan ayrı, durur.
- Ses oturumu `.playback` + `.mixWithOthers` (`AppDelegate.swift`): sessizde de çalar,
  arkadaki müziği kesmez. Sayfa ve iç kutularda kaydırma çubuğu yok
  (`showsVerticalScrollIndicator`, `globals.css`).
- **1.0.0 yalnız iPhone** (`TARGETED_DEVICE_FAMILY = 1`, ana hedef ve uzantılar;
  kullanıcı kararı, 2026-10): iPad desteği sonra eklenebilir (tersi App Store'da yasak:
  iPad'i bir kez destekleyen uygulama geri çekemez). iPhone yalnız dikey. iPad'e özgü
  kalıntılar (`--olcek` zoom, Info.plist'te `~ipad` yönleri) zararsız, iPad açılırsa
  oradan devam edilir.
- **Windows'ta derlenmez:** CI `.github/workflows/ios.yml`. `npm run sync:ios` (Windows
  yollarını `scripts/ios-yol-duzelt.mjs` düzeltir), çıplak `cap sync ios` değil.
- **Yayın:** `v*` etiketi Play'e (varsayılan kapalı test) otomatik yükler (kurulum ve
  akış `RELEASE.md` › "Otomatik yayın") ve `ios-testflight.yml` ile TestFlight'a; sürüm `android/app/build.gradle`dan
  (`versionName`, `versionCode` + çalıştırma sayısı). Mağazaya App Store Connect'ten
  elle gönderilir.
