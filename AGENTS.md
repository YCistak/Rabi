# Rabi — proje kuralları

## Dil

**Kod dahil her şey Türkçe.** Değişken, fonksiyon, tip, dosya ve klasör adları Türkçe;
yorumlar Türkçe. İstisna: çerçevenin dayattığı adlar (`page.tsx`, `layout.tsx`,
`useState`, React prop'ları) ve npm paket adları.

Yorumlar **neden**i anlatır, **ne**yi değil. Yönetmelik/ÖSYM kaynaklı bir kural
uyguluyorsan madde numarasını veya kaynağı yorumda belirt (`lib/hesap.ts` örnek).

## Mimari

- **Sunucu yok.** Statik export; her şey istemcide çalışır. Dış servise çıkma, veri
  toplamaya çalışma.
  - **Tek istisna: hatalı soru bildirimi.** Soru havuzları elle yazıldı; içlerindeki
    hataları öğrenmenin başka yolu yok. Ağa çıkan tek dosya `lib/hata-gonder.ts`;
    gönderilen veri `formVerisi()` içinde tek tek sayılan yedi alandan ibaret (soru
    kimliği, oyun, soru metni, doğru sanılan cevap, sebep, sürüm, anonim cihaz
    numarası). Kullanıcı Ayarlar'dan kapatabiliyor, ne gönderildiği orada yazıyor.
    Bu istisnayı genişletme — başka hiçbir yerden ağa çıkılmıyor.
- **State kütüphanesi yok.** `AppShell` üst düzey state'in sahibi, props ile aşağı geçer.
  Yeni bir global state ihtiyacı çıkarsa önce prop ile çözmeyi dene.
- **Saf mantık `lib/` altında.** React'e bağlı olmayan her hesap `lib/`'e; bileşenler
  yalnızca çizer. `hesap.ts`, `puan.ts`, `siralama.ts`, `rozetler.ts` saf ve test edilebilir
  kalmalı.
- **localStorage küçük veri için.** Fotoğraflar IndexedDB'ye (`lib/resim-depo.ts`).
  localStorage'a asla base64 görüntü yazma — kota birkaç fotoğrafta dolar.

## Tasarım

- Mobil öncelikli, `max-w-md` tek sütun. Hover yerine `active:` — dokunmatik cihaz.
- Renkler doğrudan yazılmaz, tema değişkenlerinden gelir (`var(--primary)` /
  Tailwind `text-primary`). **Tek tema var** — koyu tema kaldırıldı, `dark:`
  sınıfı kullanma, Ayarlar'da tema seçeneği yok.
  Vurgu kavrulmuş amber: `--primary` #B3491F **yazı ve ikon** için,
  `--primary-parlak` #D9622F **dolgu** için (halka, çubuk, düğme, büyük sayı).
  İkinci kimlik rengi tuğla (`--ikincil` #A8432B), zemin kırık beyaz
  (`--background` #F8F8F7). Renk **derse** ait, oyuna değil:
  `yzm` (Türkçe, pembe) · `isl` (Matematik, krem) · `edb` (Edebiyat, lavanta) ·
  `trh` (Tarih, deniz mavisi) · `byl` (Biyoloji, yeşil), her biri `-koyu` ve
  `-ok` tonuyla.
  Kart yüzeyi `golge-kart` sınıfıyla: beyaz kart, sıcak gölge.
  Maskotun kürkü beyaz olduğu için `--maskot-hat` konturu şart; zemin de
  neredeyse beyaz, kontursuz siluet kayboluyor.
- Zemin rengi üç yerde birden yazılı ve **birlikte** değişmeli:
  `--background` (globals.css), `acilis.tsx`'teki `ZEMIN` ve Android'in
  `acilis_zemin` / `uygulama_zemin` renkleri. Ayrılırlarsa açılışta renk
  sıçraması olur.
- Yazı tipi tek: **Nunito**. Tek istisna açılış ekranı: orası Manrope
  (`font-marka`), çünkü tasarım o ekranı Manrope ile çizdi ve "RABİ" 50
  pikselde iki ailede belirgin biçimde farklı duruyor. `font-marka` başka
  hiçbir yerde kullanılmıyor; yeni bir yerde kullanmadan önce bu istisnanın
  neden açıldığına bak. Başlık ayrı aile değil ayrı kalınlık — `font-display`
  hâlâ var ama Nunito'ya çözülüyor; başlıklar `font-extrabold`, gövde `font-medium`.
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar. Derlemeye girmiyorlar,
  uygulama onlardan hiçbir şey import etmiyor — ekran değiştirirken oraya bak.
- Sütun hâlindeki sayılara `rakam` sınıfı (tabular-nums), başlıklara `font-display`.
- Alt menünün altında kalan içerik için `guvenli-alt`.

### Açılışın son hareketi ana sayfaya bağlanıyor

Ekran 4,2 saniye sürüyor (`ACILIS_SURESI`) ve bütün parçalar **tek** bir zaman
çizgisini paylaşıyor: %0–34 iniş, %34–68 duruş, %68–100 çıkış. Süreler bu
yüzden hepsinde aynı ve ayrı ayrı değiştirilemez — biri kayarsa yazılar
tavşandan önce ya da sonra gider.

Çıkışta tavşan varış noktasındaki maskotun **tam üstüne** süzülüyor; katman
kalktığında ekranda zaten yalnızca o maskot duruyor ve altındaki sayfa görünür
durumda, yani geçiş tek bir hareket gibi okunuyor. Dört şey buna bağlı:

- **Ekranda hep tek tavşan var.** Açılış sürerken varış noktasındaki maskot
  `visibility: hidden` (`Rabi` → `gizli`). Zemin son saniyede saydamlaşıyor ve
  altındaki sayfa görünür oluyor; gizlenmeseydi biri uçarken öteki yerinde
  dururken **iki** tavşan görünürdü. Katman kalkarken gizlilik de kalkıyor,
  ikisi aynı görsel olduğu için takas görünmüyor. `display: none` olamaz:
  varış noktası bu öğe ölçülerek bulunuyor ve düzenden çıkmış bir öğenin
  ölçüsü sıfırdır.
- **Varış noktası ölçülüyor, yazılmıyor.** Tasarım `translate(-147px, -224px)
  scale(0.33)` diyor ama o sayılar 360×720lik prototip çerçevesine ait. Bir
  süre uygulamada da yazılıydı (`VARIS` tablosu, `calc()` ile): o hesap
  başlığın yerini, güvenli alanı ve kabın genişliğini bilmek zorunda ve biri
  değişince tavşan yuvanın yanına düşüp katman kalkınca zıplıyor. Şimdi açılış
  ekranı `MASKOT_YUVASI` kimlikli öğeyi bulup mesafeyi kendi hesaplıyor;
  tablo yalnızca ölçüm hiç tutmazsa devreye giriyor.
- **Yuva tek.** Ekranda ya ana sayfanın başlığı vardır ya kurulum sihirbazı,
  o yüzden ikisinde de aynı kimlik duruyor ve ölçüm hangisi varsa onu buluyor.
- **Ölçüm zamanlayıcıyla yineleniyor, `requestAnimationFrame` ile değil.**
  Sayfa görünür değilken rAF hiç çağrılmıyor ve ölçüm sonsuza kadar bekliyor.

Ayrı bir solma adımı yok: ekran kendi çıkışını kendi yapıyor (`acilis-son`,
`acilis-zemin-son`), üstüne bir de opaklık geçişi koymak biten bir geçişin
üstüne ikincisini koymak olurdu.

### Açılış animasyonunu susturan iki tuzak

İkisi de bir kez uygulamaya girdi ve ekranı "animasyonsuz" gösterdi. Yeni bir
hareket eklerken ikisini de kontrol et.

**1. Zaman çizgisi pencere görünmeden başlıyordu.** CSS animasyonları sayfa
çizilir çizilmez başlıyor; uygulama açılırken ekranı o sırada hâlâ Android'in
kendi açılış ekranı kaplıyor olabiliyor. Animasyon arkada akıp bitiyor ve
pencere açıldığında kullanıcı yalnızca son karesini görüyor.

Ekran bu yüzden `acilis-bekliyor` ile **duraklatılmış** başlıyor (sınıf
sunucuda üretilen HTML'de de var, yani ilk boyanan karede zaten duruyor) ve
arka arkaya iki `requestAnimationFrame` geldiğinde salınıyor — bu, tarayıcının
gerçekten kare ürettiğinin kanıtı. rAF sayfa görünür değilken hiç çağrılmadığı
için `visibilitychange` de dinleniyor, üstüne bir emniyet zamanlayıcısı var:
kare hiç gelmezse ekran donuk kalır ve uygulama katmanın altında kilitlenirdi.

Ekranın sayacı da bu yüzden `acilis.tsx` içinde, `AppShell` içinde değil:
katman ancak animasyon başladıktan `ACILIS_SURESI` sonra kalkmalı. Dışarıda
tutulsaydı sayaç animasyondan önce işlemeye başlar, yavaş açılan bir telefonda
tavşan yuvasına varmadan katman silinirdi.

**2. `prefers-reduced-motion` ekranı tümüyle susturuyordu.** Tasarımın kendi
kuralı buydu ve uygulama bir süre öyle çıktı. Android'de bu tercih çoğu zaman
erişilebilirlik ayarından değil geliştirici seçeneklerindeki "animasyon
ölçeği" ya da pil tasarrufundan geliyor — yani hareketten rahatsız olduğu için
değil telefonu hızlansın diye kapatan kullanıcıda da açılış ekranı boş bir
kareye dönüyordu.

Karar kullanıcının: açılış animasyonu her koşulda oynuyor. Açılış ekranı o
yüzden `@media (prefers-reduced-motion: reduce)` bloğunda **yok**; uygulamanın
geri kalanı (haftalık özet, harita, kurulum sonrası geçiş) tercihi izlemeye
devam ediyor. Bu istisnayı geri almadan önce yukarıdaki sebebe bak.

## Havuç

Tek sayaç para birimi (`lib/havuc.ts`), ana sayfanın sağ üstünde duruyor.
Kazandıran ya da harcatan mekanik **yok**: havuç için kurulan mağaza ve
giydirilebilir avatar sistemi kaldırıldı, sayaç kaldı. Yeni bir harcama/kazanma
yolu eklerken bakiyeyi tek yerden değiştir.

## Doğruluk

Puan ve sıralama hesabı **tahmindir** ve arayüzde her zaman böyle sunulur. Tahmini
kesin sayı gibi gösteren bir arayüz yazma; uyarıyı kapatılabilir yapma.

## Derleme

APK için **JDK 21 şart** — sistem varsayılanı JDK 25, Gradle 8.14.3 desteklemiyor.
`JAVA_HOME=/usr/lib/jvm/java-21-openjdk npm run apk`.

Değişiklikten sonra en az `npm run typecheck`, saf mantığa dokunduysan `npm run test`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
