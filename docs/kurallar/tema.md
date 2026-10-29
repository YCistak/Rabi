# Tema (açık / koyu)

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).
Yol haritası ve kalan işler: [koyu-tema-plani.md](../koyu-tema-plani.md).

- **Tercih üç, tema iki.** `Ayarlar.tema`: `'sistem'` (Telefona uy) · `'acik'` · `'koyu'`;
  `<html data-tema>`da her zaman çözülmüş `acik`/`koyu`. Kural tek yerde: `temaCoz`
  (`lib/tema.ts`). Kurulumda **sorulmaz** (kullanıcı kararı, 2026-10-28); varsayılan ve
  alanı olmayan eski kayıt `'sistem'` — eski kullanıcı da (kullanıcı kararı).
- Seçim yalnız **Ayarlar → Görünüm → Tema** (Telefona uy · Açık · Koyu çipleri).
- **`KOYU_TEMA_ACIK`** (`lib/tema.ts`) açık. Kapatılırsa "Telefona uy" açık çizer,
  açıkça `'koyu'` tercihi yine koyu: koyu temada büyük kırık çıkarsa acil geri dönüş.
- **İlk kare:** `layout.tsx`teki satır içi betik (`ilkKareTemaBetigi`) React'ten önce
  `data-tema` ve `theme-color` yazar; `useTema` (`lib/tema-kancasi.ts`) yedeği ve
  çalışırken telefon modu değişikliğini (`matchMedia` + öne gelişte yeniden okuma)
  izler. Tema değişirken `tema-degisiyor` sınıfı geçişleri bir iki kare kapatır.
- Viewport `colorScheme: 'light dark'`: Android WebView gece modunda sayfayı kendi
  kendine karartmasın. Hangi temanın çizildiğini CSS'teki `color-scheme` söyler.
- **Renk yalnız değişkenden.** Koyu takım `globals.css` → `:root[data-tema='koyu']`.
  Yeni değişkene **iki takıma birden** değer yaz. `dark:` kullanma.
- **Yazı tonu dolgu olmaz:** koyuda yazı tonları açılıyor. Dolgu için
  `--primary-derin`, `--ikincil-dolu`, `--success-dolu`, `--danger-dolu`,
  `--warning-dolu`, `--konu-<ders>-dolgu`; turuncu dolgu `--primary-parlak`/`-dolu`.
  Rabi balonu ve kısa bildirim `--ters`/`--ters-yazi`; perde `--perde`, tanıtım
  karartması `--karartma`; kart `bg-card`.
- Dolgu üstündeki `text-white` ve yarı saydam beyazlar (`bg-white/20`), siyah perdeler
  ve gölgeler serbest: iki temada da doğru.
- **Denetim:** `lib/renk-denetimi.test.ts` bileşende onaltılık renk, düz `bg-white`,
  dolgu olarak yazı tonu, `bg-foreground` yakalar (muaf/izinli satırlar gerekçeli).
  `lib/tema-kontrast.test.ts` iki takımda yazı/zemin çiftlerini ölçer (4,5; büyük
  yazı/ikon/dolgu 3).
- **Emoji ve canlı dolgular koyuda kısılır:** `.emoji` ve `OlcekliEmoji` koyuda
  `filter: saturate(.78) brightness(.88)` alır (`globals.css`); yeni emoji kutusu
  bu iki yoldan birini kullanır. Haritadaki soru kitabı `--patika-kitap-soru` /
  `-derin` okur, `--primary-parlak` değil: koyuda düğme turuncusu kitapta bağırıyordu.
- **Ders zemininin içi:** koyuda `.bg-konu-<ders>` içindeki `--card`, `--muted`,
  `--border` o dersin tonuna döner (`--konu-<ders>-kart`, `-kenar`; yalnız koyu
  takımda). Oyun tuşları, şıklar, soru kartı bu yüzden ayrıca boyanmaz; ders zeminli
  yeni ekran da kendiliğinden uyar.
- Konu Anlatımı: deste zemini `zeminSinifi` (`lib/konu/harita-temasi.ts`) ile ders kuralına girer; yoklama `.sahne` ve kapanış `.kapanis` koyuda kendi koyu kâğıt değerlerini alır.
- **Yerli taraf:** tercih web'den `lib/tema-yerli.ts` ile yazılır (Android
  `tema/TemaEklentisi.kt` → `SharedPreferences`, iOS `AnaDenetleyici.swift` →
  `TemaEklentisi` → `UserDefaults`); kayıt yoksa "Telefona uy".
  - Android: gece modu uygulamanın tercihinden (`TemaAyari.uygula`, `RabiUygulamasi`
    açılışta; 12+ `setApplicationNightMode`). Tema `DayNight` olmalı (Light kalırsa
    WebView hep açık bildirir). `values-night/colors.xml` = koyu takım; bildirim
    renkleri iki dosyada aynı. Manifest `uiMode`u karşılar (yeniden kurulum yok),
    `onConfigurationChanged` sistem çubuklarını yeniler. Odak engel katmanı
    servisten açıldığı için `TemaAyari.baglam` ile şişirilir.
  - iOS: `Info.plist`te görünüm zorlaması yok; pencereye tercih yazılır
    (`overrideUserInterfaceStyle`; "Telefona uy" `.unspecified`). Durum çubuğu
    `.default`. Açılış ekranı telefonun modunu izler: farklı tema seçende soğuk
    açılışta bir kesir an telefonun rengi görünür (bilinen sınır).
  - Cam menü koyu temada hep koyu cam (`--cam-*` koyu takımı).
