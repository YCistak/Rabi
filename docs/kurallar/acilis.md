# Açılış ekranı (ders makarası)

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Süre `ACILIS_SURESI` (2,08 sn); tasarım `tasarim/acilis-arsiv.html` → 3. tur,
  Yazı C · 2. Makaralar R·A·B·I'ya kilitlenir, RABI ~600 ms durur, sonra katman
  bütün olarak opaklıkla söner (400 ms, ease-in-out). Zaman çizgisi `globals.css`teki
  açılış bloğunun başında; süreyi değiştirirsen oradaki gecikmeler de değişir.
- **Şeritli kalkış yok, solma var** (kullanıcı istedi; geri getirmeden sor).
- Kullanıcının açılış şartları: tavşan köşeye (özellikle sol üste) uçmaz; yuvadan
  zıplayan tavşan ve yerden fırlayan harf yok; ışın saçan zemin yok; defter dokusu ve
  yazı altı kıvrık çizgi yok; ekran kısa kalır.
- Makara genişliğini içindeki görünmez son harf (`acilis-olcu`) verir (eşit pencere
  "RAB I" okutuyordu); kırpma pencerede değil `acilis-kuyu`da.
- **Katman tek parça söner**: zemin, kelime ve kuyu gölgeleri aynı opaklıkla gider
  (ayrı gitselerdi gölgeler ana sayfada iz bırakırdı). Katman zemini `ZEMIN`, renk
  sıçraması yok.
- Katmanı katmanın kendi `animationend`i (`acilis-katman-son`) kaldırır — hedef ve
  adla süzülür, makaraların olayları da kabarıyor; zamanlayıcı emniyet. Katman sonuna
  kadar dokunuş yutar (sönerken altındaki düğmeler basılmamalı).
- **Tuzak 1:** ekran `acilis-bekliyor` ile duraklatılmış başlar (sunucu HTML'inde de),
  iki `requestAnimationFrame` sonra salınır; `visibilitychange` dinlenir, emniyet
  zamanlayıcısı var. Yoksa animasyon Android açılış ekranının arkasında biter. Sayaç
  bu yüzden `acilis.tsx` içinde, `AppShell`de değil.
- **Tuzak 2:** açılış `prefers-reduced-motion` altında **susmaz** (kullanıcı kararı;
  Android'de tercih çoğu zaman pil tasarrufundan geliyor). Uygulamanın geri kalanı
  tercihi izler.
- Kurulumdan ana sayfaya geçiş uçmaz, **soluyor** (`KurulumGecisi`). Uçuşu geri
  getirirsen varış noktası **ölçülür**, yazılmaz.
