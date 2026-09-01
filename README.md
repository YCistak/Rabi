# Rabi

Lise öğrencileri için YKS çalışma asistanı. Tamamen çevrimdışı çalışır; veri
telefondan çıkmaz (localStorage + fotoğraflar için IndexedDB), sunucu ve hesap yoktur.

**Yığın:** Next.js 16 (statik export) · React 19 · TypeScript · Tailwind v4 · Capacitor 8

## Kurulum

```bash
npm install
```

Android SDK gerekiyor (`ANDROID_HOME=~/Android/Sdk`).

## Geliştirme

```bash
npm run dev        # tarayıcıda, http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run test       # vitest — hesap/puan/sıralama/oyun birim testleri

node scripts/havuz-dogrula.mjs   # yazım oyunu havuzunu TDK sözlüğüne sorar (ağ gerekir)
```

Tarayıcıda test ederken mobil görünüme geç (390×844). Arayüz `max-w-md` tek sütun.

## APK

> **JDK 21 şart.** Sistem varsayılanı JDK 25 ise Gradle 8.14.3 onu kabul etmez ve
> derleme `Unsupported class file major version` ile düşer.

```bash
# fish
set -x JAVA_HOME /usr/lib/jvm/java-21-openjdk
npm run apk

# bash
JAVA_HOME=/usr/lib/jvm/java-21-openjdk npm run apk
```

Çıktı: `android/app/build/outputs/apk/debug/app-debug.apk`

Cihaza kurmak için:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

`npm run apk`, önce `next build` + `cap sync android` çalıştırır — web tarafındaki
değişiklikler otomatik aktarılır.

## İmzalı sürüm

`v*` etiketi atıldığında GitHub Actions imzalı APK üretip Release'e yükler
(`.github/workflows/android.yml`). Gereken secret'lar: `KEYSTORE_BASE64`,
`KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`. Yoksa imzasız derler, iş çökmez.

Yerelde imzalı derleme için `android/keystore.properties` oluştur (depoya girmez):

```properties
storeFile=/mutlak/yol/rabi.jks
storePassword=...
keyAlias=rabi
keyPassword=...
```

## Klasörler

| Yol | İçerik |
|---|---|
| `app/` | Next.js router, tema, kök yerleşim |
| `components/ekranlar/` | Ekranlar (ana sayfa, pomodoro, soru takibi…) |
| `components/maskot/` | Rabi maskotu (tek SVG, altı ruh hâli) |
| `components/ui.tsx` | Tasarım sistemi — Kart, Buton, Alan, Halka, Cip… |
| `lib/hesap.ts` | Net, OBP, soru takibi, devamsızlık — **saf fonksiyonlar** |
| `lib/puan.ts` | Netlerden yaklaşık YKS puanı |
| `lib/siralama.ts` | Puandan tahmini sıralama |
| `lib/veri/` | ÖSYM katsayıları ve puan-sıralama tabloları |
| `lib/depo.ts` | localStorage hook'u, yedekleme |
| `lib/oyunlar/` | Mini oyunlar — ortak tur mantığı (`tur.ts`), tanım listesi, oyun havuzları |
| `lib/oyunlar/banka.ts` | Oyun Bankası — karıştırılan soruların biriktiği havuz, **saf** |
| `lib/konu/` | Konu Anlatımı — Maarif müfredatı içeriği (`icerik/`), ilerleme ve bilinmeyenler bankası (`ilerleme.ts`, **saf**) |
| `lib/ozet.ts` | Haftalık özet hesabı — **saf fonksiyonlar** |
| `lib/ozet-gorsel.ts` | Özetin paylaşılabilir PNG'si (tuvale çizim) |
| `lib/paylas.ts` | Capacitor Share / `navigator.share` sarmalayıcısı |
| `lib/ses.ts` | Pomodoro müziği — `public/ses/` altındaki CC0 lo-fi parçalar |
| `lib/oyunlar/oyun-muzigi.ts` | Mini oyunların üretilen arcade döngüsü (dosyasız) |
| `lib/gorunurluk.ts` | Uygulama önde mi — arka planda müzik ve özet sayacı duruyor |
| `public/ses/` | Lo-fi parçalar (CC0) + `LISANS.md`, `oyun/` altında ses efektleri |
| `components/acilis.tsx` | Uygulamanın açılış ekranı (zıplayan tavşan + Rabi + çark) |

## Sıralama tahmini nasıl çalışıyor

Uygulamanın verdiği sıralama **tahmindir** — ama uydurma katsayılara değil, ÖSYM'nin
kendi yöntemine ve kendi yayınlarına dayanıyor.

**Puan hesabı** (`lib/puan.ts`), 2026-YKS Kılavuzu madde 3.10.1'deki yolu izler:

1. Ham puan = doğru − yanlış/4
2. Standart puan = 50 + 10 × (ham − ortalama) / standart sapma
   Ortalama ve standart sapma, ÖSYM'nin her yıl yayınladığı *Sayısal Bilgiler*
   belgesinden geliyor (son sınıfta okuyan adaylar).
3. Ağırlıklı puan = Σ (ağırlık × standart puan). Ağırlıklar kılavuzdaki
   **Tablo 1C** (TYT) ve **Tablo 1E** (SAY/EA/SÖZ/DİL) tablolarının aynısı.
4. Ağırlıklı puan 100–500 aralığına doğrusal ölçeklenir.

**Sıralama** (`lib/siralama.ts`), ÖSYM'nin *Yerleştirme Puanlarının Yığınsal Dağılımı*
tablosundan okunur: her 20 puanlık eşik için o puanın üstündeki aday sayısı. Ara
değerler logaritmik iç değerle bulunur (aday sayısı puanla üstel değiştiği için
doğrusal iç değer üst uçlarda sırayı kat kat şişiriyor).

### Nerede tahmin devreye giriyor

Tek bilinmeyen 4. adımdaki ölçeğin uçları: ÖSYM o yılın gerçek en küçük/en büyük
ağırlıklı puanını kullanıyor ama bunlar yayınlanmıyor. Rabi üst ucu "tam net yapan
aday" kabul ediyor, alt ucu ise yayınlanmış puan dağılımının ortalamasına oturtarak
çözüyor. SAY, EA ve SÖZ için bağımsız çözüldüğünde birbirine çok yakın değerler
çıkması (2026: 35,2 – 35,9) modelin tutarlı olduğunu gösteriyor; `lib/puan.test.ts`
bunu test olarak da kilitliyor.

Bunun üstüne, gerçek YKS puanı sınav yılının istatistiklerine bağlı — o veri sınavdan
önce yok. Bu yüzden ekranda tek sayı değil **üç yılın bandı** gösteriliyor ve uyarı
kapatılamıyor.

### Veriyi güncelleme

ÖSYM yeni yılın *Sayısal Bilgiler* belgesini yayınladığında:

```bash
# PDF'i indir (dokuman.osym.gov.tr referer istiyor)
curl -L -A "Mozilla/5.0" -e "https://www.osym.gov.tr/" <pdf-adresi> -o sb2027.pdf
pdftotext -layout sb2027.pdf sb2027.txt
python3 scripts/veri-uret.py lib/veri/yks-veri.json
```

`scripts/veri-uret.py` içindeki yıl listesini genişletmeyi unutma. Betik eksik test
istatistiği bulursa hata verip durur — sessizce yarım veri üretmez.

## Açılış ekranı animasyonu

Android 12+ sistemin kendi açılış ekranını çizmek zorunda; kapatılamıyor. Uygulama artık
oradan **hiçbir şey** göstermiyor: `windowSplashScreenAnimatedIcon` saydam bir şekle
(`acilis_bos.xml`) bağlı, animasyon yok. Geriye yalnızca `acilis_zemin` (`#6D3FE0`) kalıyor.

Sebep: sistem ekranında maskot, hemen arkasından uygulamanın kendi açılış ekranında yine
maskot çıkınca arka arkaya iki açılış ekranı izleniyordu. Önceki maskot animasyonu
(`acilis_maskot_animasyon.xml` ve `animator/` altındaki iki animatör) bu yüzden silindi.

Görünen açılış **uygulamanın kendi ekranı** (`components/acilis.tsx`): aynı mor
zeminde zıplayan beyaz çizgi tavşan, altında "Rabi" yazısı, altında dönen çark. Sistem
ekranıyla aynı zemin rengi kullanıldığı için ikisi arasındaki geçiş görünmüyor.

Süre veri okumasına bağlanmadı (`ACILIS_SURESI`, 1,6 sn): localStorage neredeyse anında
dönüyor, bağlansaydı ekran bir kare görünüp kaybolurdu.

Tavşan burada uygulamanın dolu maskotu değil, ayrı bir **çizgi** çizim: mor zeminde
açık renkli dolgular birbirine karışıp bulanık bir leke gibi duruyordu. Aynı yollar
paylaşılan özet görselinin alt imzasında da kullanılıyor (`tavsanCiz`).

> **`position: fixed` uyarısı.** Uygulamanın kök `div`ine giriş animasyonu **konulmamalı**.
> `.acilis-girisi` içinde `transform` var ve `both` dolgusuyla animasyon bittikten sonra
> bile hesaplanan değer `none` değil birim matris kalıyor. Transformlu bir öğe, içindeki
> `position: fixed` katmanların kapsayıcı bloğu olur: alt menü, oyun katmanı ve haftalık
> özet ekrana değil o `div`e göre konumlanır. `min-h-dvh` içerikle büyüdüğü için alt menü
> sayfanın en üstündeyken ekranın altından taşıyor, yarısı görünmez oluyordu. Sınıfın
> dolgusu bu yüzden `backwards`.

## Uygulama arka plana geçince

Android'de ana tuşa basıldığında WebView **durdurulmuyor**: `<audio>` çalmaya, `setTimeout`
işlemeye devam ediyor. Uygulama görev listesinden silinene kadar arkadan müzik geliyor ve
haftalık özet kimse bakmazken kart kart ilerleyip bitiyordu.

`lib/gorunurluk.ts` iki kaynağı birlikte dinliyor: `visibilitychange` (ekran kilidinde de
tetikleniyor) ve Capacitor'ın `appStateChange` olayı (bazı Android sürümlerinde
`visibilitychange` gecikmeli geliyor). Kullananlar: haftalık özet (müzik + kart sayacı +
ilerleme çubuğu) ve mini oyun müziği.

**Pomodoro bilerek bunu kullanmıyor.** Orada müziğin ekran kapalıyken de sürmesi isteniyor;
sayaç zaten hedef zaman damgasıyla çalıştığı için arka planda doğru kalıyor.

## Kurulum sihirbazı

Beş adım: sınıf → **tema** → alan → günlük hedef → hatırlatma.

Tema adımı, uygulama telefonun tercihine bakıp sessizce koyu başladığı için eklendi.
Seçim dokunulduğu anda uygulanıyor (`useTema`), "Başlayalım"da ekranda görünen seçenek
kaydediliyor — adıma hiç dokunulmasa bile. Yazılmasaydı uygulama sistem temasını izlemeye
devam eder, kullanıcı gece telefonu koyuya alınca Rabi de habersiz kararırdı.

Hatırlatma adımındaki saat listesi Ayarlar ekranıyla **aynı** (`HATIRLATMA_SAATLERI`) ve
yanında `<input type="time">` var; kurulumda beş saatlik kısa bir liste vardı, 08.00'i
seçmek isteyen kullanıcı önce kurulumu bitirip Ayarlar'a girmek zorunda kalıyordu.

## Android izinleri

Capacitor eklentileri kendi manifestlerini birleştiriyor; `android/app/src/main/AndroidManifest.xml`
elle düzenlenmiyor. Derlenen APK'da şunlar var:

| İzin | Nereden | Ne için |
|---|---|---|
| `POST_NOTIFICATIONS` | local-notifications | Android 13+ bildirim izni |
| `WAKE_LOCK` | keep-awake | Pomodoro sırasında ekranı açık tutma |
| `VIBRATE` | haptics | Rozet kutlamasında titreşim |
| `SCHEDULE_EXACT_ALARM` | local-notifications | Pomodoro bitişinin dakikası şaşmasın |
| `RECEIVE_BOOT_COMPLETED` | local-notifications | Yeniden başlatmadan sonra planlı bildirim |
| `INTERNET` | Capacitor şablonu | **Kullanılmıyor** — uygulama tamamen çevrimdışı |

Üç not:

- `SCHEDULE_EXACT_ALARM`, Google Play'e yüklenecek olursa gerekçe ister. Kişisel kullanımda
  sorun değil; yayınlanacaksa ya gerekçe yazılmalı ya da manifestten `tools:node="remove"`
  ile çıkarılıp pomodoro bildiriminin birkaç dakika gecikebileceği kabul edilmeli.
- `INTERNET` Capacitor şablonundan geliyor ve hiçbir yerde kullanılmıyor. Çıkarılabilir ama
  önce cihazda denenmeli.
- **`CAMERA` izni listede yok ve olmamalı.** Yanlış soru bankası fotoğrafı sistemin kendi
  kamera ekranını (`IMAGE_CAPTURE`) ve fotoğraf seçicisini açarak alıyor, kameraya kendisi
  erişmiyor. Android'in kuralı ters yönde işliyor: izni manifestte **tanımlayan**
  uygulamalardan `IMAGE_CAPTURE` için çalışma anında izin istenir. İzni eklemek fotoğraf
  çekmeyi düzeltmez, gereksiz bir izin ekranı ekler.

## Sistem çubukları (güvenli alan)

Android 15'ten (SDK 35) sonra uygulama pencereleri **zorunlu olarak** sistem çubuklarının
arkasına çiziliyor; `targetSdk` 36 olduğu için Rabi de öyle. Bu, alt menünün yazılarının
gezinme çubuğunun altında kalmasına yol açıyordu — ekranda sadece simgeler görünüyordu.

Çözüm iki parçalı:

1. `app/layout.tsx` içindeki viewport tanımına **`viewportFit: 'cover'`**. Bu olmadan WebView
   `env(safe-area-inset-*)` değerlerini 0 bildiriyor; boşluk vermek isteseniz de veremezsiniz.
2. `app/globals.css` içinde iki değişken:

   ```css
   --guvenli-ust: max(var(--safe-area-inset-top, 0px), env(safe-area-inset-top, 0px));
   --guvenli-alt: max(var(--safe-area-inset-bottom, 0px), env(safe-area-inset-bottom, 0px));
   ```

   İki kaynak birleştiriliyor çünkü hangisinin dolu geleceği cihaza göre değişiyor:
   `--safe-area-inset-*` Capacitor'ın yerel taraftan enjekte ettiği değerler (bkz.
   `SystemBars.java`), `env(...)` ise WebView'ın kendi bildirdiği değer. Capacitor pencereyi
   yerel tarafta zaten boşukladığı durumlarda **kendi değişkenlerini sıfırlıyor**, o yüzden
   `max()` iki kez boşluk eklemiyor.

Kullanımı: yalnızca güvenli alan gerekiyorsa `guvenli-ust` / `guvenli-alt` sınıfları; başka
bir boşlukla birleşiyorsa Tailwind'in serbest değeri —
`pt-[calc(1.25rem+var(--guvenli-ust))]`. Ekleneceği yerler `position: fixed` olan her yüzey
(alt menü, oyun katmanı, onay/kutlama kutuları, fotoğraf görüntüleyici) ve sayfa gövdesi.

Masaüstü tarayıcıda iki değişken de 0 çıkar, yani geliştirmede hiçbir şey değişmez; cihazda
doğrulamak için tarayıcı konsolundan `document.documentElement.style.setProperty(
'--safe-area-inset-bottom', '48px')` verip alt menünün yükselip yükselmediğine bakılabilir.

## Okul notları ve OBP

Her lise yılı için **tek bir ortalama** giriliyor — karnedeki sayı. Ders ders yazılı/sözlü/proje
girme sistemi kaldırıldı: öğrenci o sayıyı zaten biliyor, on beş dersin notunu tek tek girmek
aynı sonucu daha çok emekle veriyor ve yarım kalırsa yanlış veriyordu.

- **Bitmiş yıllar** → yıl sonu notu.
- **İçinde bulunulan yıl** → 1. dönem sonu notu (`donemSonu: true`). Yıl bitmediği için o
  yılın tamamı adına tahmin sayılıyor; arayüz bunu ayrıca yazıyor.

OBP = diploma notu × 5, `[250, 500]` aralığına kırpılır. Diploma notu dört yılın aritmetik
ortalamasıdır (MEB Ortaöğretim Kurumları Yönetmeliği MADDE 65); eksik yıllarda girilenlerin
ortalaması varsayılır. `tamMi` yalnızca **dört yıl da girili ve hiçbiri dönem sonu notu değilse**
true döner — yani "tahmin değil" demek için iki koşul birden aranıyor.

Eski kurulumlardaki `rabi-gecmis-yillar` kaydı `rabi-okul-yillari`ne bir kez taşınıyor
(`okulNotlariniTasi`), kullanıcı 9–11. sınıf notlarını yeniden girmek zorunda kalmasın diye.
Eski anahtar silinmiyor: taşıma yanlış giderse veri elde kalsın.

## Haftalık özet

Hafta kapanışı, "yıllık özet" tarzı kart destesi: `lib/ozet.ts` (saf hesap) +
`components/ekranlar/haftalik-ozet.tsx` (14 kart) + `lib/ozet-gorsel.ts` (paylaşılabilir
PNG) + `lib/paylas.ts` (Capacitor Share).

**Hafta pazartesi–pazar.** Özet pazar günü doğuyor ve sonraki pazara kadar duruyor —
yalnızca pazar gösterilseydi o gün uygulamayı açmayan kullanıcı özeti tamamen kaçırırdı.
`bekleyenOzetHaftasi` her iki durumda da "en son tamamlanmış hafta"yı veriyor. İzlenen
haftalar `rabi-ozet-gorulen` altında; ana sayfadaki davet kartı yalnızca izlenmemiş ve
**boş olmayan** bir özet varsa çıkıyor.

Kart sırası sabit: giriş → haftalık soru hedefi → seri → devamsızlık → pomodoro dakikası →
pomodoro dersi → mini oyun → yanlış soru bankası → deneme sayısı → deneme netleri →
3. ders → 2. ders → 1. ders → kapanış. Üç dersin **geri sayımla** verilmesi bilinçli:
hepsi tek kartta gösterilseydi hiçbir merak uyandırmazdı.

**Hikâye (story) davranışı.** Üstteki çubuk kartın süresince doluyor (`.ozet-cubuk`,
süresi `style` ile veriliyor); dolu/boş iki durum varken kartın ne zaman geçeceği belli
olmuyordu. Ekrana **basılı tutmak** kartı bekletiyor, parmağı kaldırınca kaldığı yerden
devam ediyor — kalan süre `kalanRef` içinde tutulduğu için kart baştan başlamıyor.
Basılı tutmayı dokunuştan ayıran tek şey süre (`BASILI_ESIGI`, 220 ms); eşiğin
üstündeki basıştan sonra gelen tıklama yutuluyor, yoksa parmağı kaldırınca kart hem devam
eder hem bir sonrakine atlardı. Uygulama arka plana geçtiğinde de aynı bekleme uygulanıyor
(`lib/gorunurluk.ts`).

Kartın sesi **yalnızca kart değişince** çalıyor. Efektin bağımlılığında `sesli` de olsaydı
hoparlör düğmesine her dokunuşta o kartın sesi baştan çalardı.

Veri boşlukları bu iş için kapatıldı:

- **Mini oyun süresi.** `OyunIstatistigi` her şeyi toplayarak tuttuğu için "bu hafta ne
  kadar oynadın" sorusuna cevap veremiyordu. Turlar artık `rabi-oyun-gecmisi` altında
  tarihiyle tutuluyor (son `OYUN_GECMIS_SINIRI` = 400 kayıt). Turun süresi için ayrı
  kronometre yok: tur `TUR_SURESI` saniyelik bir hedef damgayla başlıyor ve her yanlış
  cevap damgadan `YANLIS_CEZASI` düşüyor, yani süre tam olarak
  `TUR_SURESI − YANLIS_CEZASI × yanlış`. Tur bitmeden çıkılırsa kayıt düşmüyor.
- **Yanlış soru çözülme tarihi.** `cozuldu` tek başına yetmiyordu; `cozulmeTarihi` eklendi.
  Bu alan gelmeden önce işaretlenmiş kayıtlar hiçbir haftaya sayılmaz — geçmişe dönük
  uydurulmuş bir tarihten iyidir.

**Pomodoro seansları yerel tarihe çevriliyor.** `baslangic` UTC bir damga; ilk on
karakterini kesmek yanlış gün verir. Türkiye'de gece 01.30'da başlayan seans UTC'de bir
önceki günde görünür ve pazartesi gecesi çalışan biri o seansı geçen haftanın özetinde
bulurdu.

**İki ayrı paylaşım var.** Başlıktaki paylaş düğmesi **açık kartın** görselini üretiyor
(`kartGorseliUret`), son karttaki düğme haftanın tamamını tek afişte
(`ozetGorseliUret`). Kart paylaşımı sonradan eklendi: hikâyede ne bakıyorsan onu
paylaşırsın, tek bir toplu afiş "gördüğüm şey bu değil" duygusu veriyordu. Her kart
`paylasim: OzetKartVerisi` alanıyla kendi görselini tarif ediyor — zemin renkleri de
`ZEMINLER` içinde CSS metni olarak değil **çift** olarak duruyor, çünkü tuval
`linear-gradient(...)` metnini ayrıştıramıyor.

Görsel **ekran görüntüsü değil, yeniden çizim** (1080×1920). Ekran görüntüsü alan
kütüphaneler birkaç yüz KB geliyor ve CSS'in yarısını yanlış yorumluyor; ayrıca paylaşılan
görselin telefonun ekran oranından bağımsız olması gerekiyor. Yazı tipi adları sayfadan
okunuyor — `next/font` üretilen aile adını rastgele bir sınıfın arkasına sakladığı için
elle "Plus Jakarta Sans" yazmak tutmuyordu.

`gorseliPaylas` görselin yanına ayrı bir **metin** de veriyor: paylaşım penceresinde bazı
uygulamalar görseli değil yalnızca yazıyı alıyor, o durumda dosya adı yerine haftanın
özeti gitsin.

Yüzdelerin eki `sayiEki` ile seçiliyor: %49 "kırk dokuz" okunduğu için "%49'u", %40
"kırk" olduğu için "%40'ı". Sabit bir ek hepsinde yanlış olurdu.

## Rozetler ve bildirim

**Rozet bir kez kazanılınca kalıcı.** Deneme silinip sayı eşiğin altına düşse bile rozet geri
alınmaz — kazanılmış bir şeyin elden gitmesi cezalandırıcı olurdu. Kazanılanlar tarihiyle
`rabi-rozetler` altında duruyor; ekrandaki ilerleme çubukları güncel veriyi gösterir.

Günlük ve haftalık eşiklerde **en iyi** değer kullanılıyor, güncel değil: rozet "bir gün 500
soru çözdün" diyor, "bugün 500 soru çözüyorsun" değil.

Diploma rozetleri: istek "OBP 90 ve 95" diyordu ama OBP 250–500 aralığında bir sayı; 90/95
ancak **diploma notu** ölçeğinde anlamlı. Rozet diploma notu üzerine kuruldu, açıklamasında
OBP karşılığı da yazıyor (diploma × 5 → 450+ / 475+).

Kutlama penceresi, veri **durulduktan** ~1,2 sn sonra çıkıyor. Anında çıksaydı soru sayısı
yazılırken araya girerdi: "420" yazarken 4 → 42 → 420 geçilir ve pencere daha alan
doldurulmadan ekranı kapatırdı.

### Mini oyun rozetleri

Mini oyun rozetleri tek bir oyuna değil **bütün oyunların toplamına** bakıyor (oynanan tur,
tek tur rekoru, hatasız tur, toplam doğru, tur bitirilen farklı oyun sayısı). Yeni bir oyun
`lib/oyunlar/tanim.ts` içindeki listeye eklenip bir ekran yazıldığında rozetler onu
kendiliğinden sayar; rozet mantığına dokunmak gerekmez.

## Konu Anlatımı

Ana sayfadaki **Konu Anlatımı** bölümü ders haritasını açıyor: üstte sınıf
(9/10) ve ders seçiliyor, altında o programın temaları **patika** hâlinde
diziliyor. Konular üç şeride yayılıp eğri çizgilerle bağlanıyor; düz bir liste
tema içindeki sırayı ve "nerede kaldım"ı göstermiyordu.

Müfredat **Türkiye Yüzyılı Maarif Modeli**ne göre — eski (2018) programın ünite
adları kullanılmıyor. Yedi ders (Matematik, Türkçe, Fizik, Kimya, Biyoloji,
Tarih, Coğrafya) × iki sınıf = 14 program, 60 tema, 177 konu, 759 bilgi kartı.
İçerik `lib/konu/icerik/` altında `<sınıf>-<ders>.ts` dosyalarında; kimlik
çakışması ve kart uzunluğu `lib/konu/icerik.test.ts` ile denetleniyor.

### Kart yukarı mı aşağı mı

Konuya dokununca bilgi kartları tek tek geliyor. Kart **aşağı** kaydırılırsa
"biliyorum", **yukarı** kaydırılırsa "bilmiyorum". Yukarısı kırmızı, aşağısı
yeşil; iki bölge kart sürüklenmeden de görünüyor ki hareket keşfedilebilsin.
Aynı iki karar için altta düğme de var — kaydırma keşfedilmesi gereken bir
hareket ve düğmeler ekran okuyucunun tek tutamağı.

"Bilmiyorum" denen kart **Bilmediklerim** bankasına düşüyor
(`components/konu/bilinmeyenler.tsx`). Kayıt kartın **metnini kendi içinde**
taşıyor, yalnızca kimliğini değil: içerik güncellenip kart kimlikleri kaysa
bile kullanıcının kaydettiği bilgi yerinde kalıyor.

### Kilit yok

Konular sırayla açılmıyor, hepsi her zaman açık. Sınav hazırlığındaki öğrenci
yarın işlenecek konuya bugün bakmak ister; kilitli bir harita onu kendi
müfredatından uzak tutardı. Sıra bilgisi yine duruyor — patikanın kendisi
sırayı gösteriyor, dayatmıyor.

Tamamlanma destenin **sonuna gelmekle** kazanılıyor. Yarıda çıkılan destede
işaretlenen kartlar yine bankaya düşüyor ama konu haritada bitmiş görünmüyor.

## Mini oyunlar

Her oyunun istatistiği `rabi-oyunlar` altında oyun kimliğine göre tutuluyor; tek tek turlar
saklanmıyor, yalnızca özet (rekor, oynanan tur, toplam doğru/yanlış, hatasız tur).

### Oyun Bankası

Mini oyunlarda **yanlış bilinen** sorular `lib/oyunlar/banka.ts` altındaki havuza düşüyor
ve Oyunlar sekmesinden yeniden oynanabiliyor. Fotoğraflı Yanlış Soru Bankası'ndan
(`lib/resim-depo.ts`) bilerek ayrı: oradaki kayıt bakılacak bir görüntü, buradaki
çözülecek bir soru. Adları, ikonları ve yerleri de ayrı tutuldu.

Kayıt, soruyu yeniden kurmak için gereken her şeyi kendi içinde taşıyor — havuzdaki
sıraya bağlanmadı, çünkü havuza yeni soru eklenince bütün banka kayardı.

Bir kayıt ancak **genel testte** doğru bilinince düşüyor: banka ekranındaki bu test
bütün yanlışları oyun ayrımı olmadan, karışık sırayla ve ortak bir şıklı biçimde
soruyor (`lib/oyunlar/banka-testi.ts`). Doğru bilinen düşüyor, yanlış bilinen olduğu
gibi kalıyor — sayacı artmıyor, ikinci kez eklenmiyor. Banka en fazla
`BANKA_SINIRI` (100) kayıt tutuyor; sınır aşılınca en eskisi düşüyor.

`bankayiGuncelle` yalnızca **yanlışları** işliyor: turda verilen doğru cevap bankaya
dokunmuyor. Eskiden üst üste üç doğru kaydı düşürüyordu; o sayaç soruyu turun kendi
havuzunda kaybettiği için kaldırıldı.

Banka turları **rekora ve istatistiğe sayılmıyor** (`components/ekranlar/oyunlar.tsx`):
sorular zaten bir kez yanlış bilinip kenara ayrılmış sorular, sayılsaydı bankayı birkaç
kez oynayan herkesin rekoru şişer ve rekor "ne kadar biliyorum" ölçüsü olmaktan çıkardı.

Tur mantığı oyuna özgü olduğu için (yazımda iki şık, işlemde tuş takımı, edebiyatta
eşleştirme) bir banka turu tek oyundan kuruluyor; süzgeçte "Tümü" seçiliyken en çok
kaydı olan oyun açılıyor.

Süre (60 sn), yanlış cezası (3 sn), seri ve rekor kuralları `lib/oyunlar/tur.ts` içinde,
**tek yerde**: oyunlar farklı süreyle çalışsaydı rekorlar karşılaştırılamaz, ortak rozetler
de anlamını yitirirdi. Arayüzün üst bilgisi (kapat, süre halkası, çubuk, dört sayaç) de tek
bileşende — `components/oyun-kabuk.tsx`. Her oyun tam ekran bir katman olarak açılıyor
(`z-50`, alt menünün üstünde): süreli bir turda yanlışlıkla sekmeye basmak turu bitirirdi.

**Ses efektleri** (`lib/oyunlar/oyun-sesi.ts`): doğru ve yanlış sesleri `public/ses/oyun/`
altındaki kısa mp3'ler (toplam ~35 KB, kaynakları `KAYNAK.md`). Önce Web Audio ile ton
üretiliyordu; sentetik sinüs tonu telefon hoparlöründe gerçek bir efektin yanında hep cılız
kalıyor. Dosyalar `decodeAudioData` ile **bir kez** çözülüp bellekte tutuluyor — `new Audio()`
ile her çalışta yeni eleman kurmak Android WebView'da gecikme yaratıyor ve arka arkaya gelen
cevaplarda ses kırpılıyordu. Tampon (buffer) oyun kartına dokunulduğu anda hazırlanıyor
(`sesleriHazirla`), böylece ilk cevabın sesi gecikmiyor. Tur bitiş sesi hâlâ üretiliyor: turda
bir kez çalıyor ve onun için dosya yok. Ayarlardan kapatılabiliyor (`oyunSesi`); kapalıyken
`AudioContext` hiç kurulmuyor, dosya da indirilmiyor.

Dosyalar `ffmpeg` ile tepe noktası −1 dB'ye çekildi ve 1,0 kazançla çalınıyor: eski tonlar
0,18 seviyesindeydi ve kullanıcı "duyulmuyor" dedi.

**Arka plan müziği** yalnızca bir oyun açıkken ve uygulama öndeyken çalıyor — liste
ekranında başlaması menüde gezinen kullanıcıyı şaşırtırdı. Ayrı bir ayarı var
(`oyunMuzigi`) çünkü "müzik istemiyorum ama efekt istiyorum" makul bir tercih.

İki seçenek var (`oyunMuzikTuru`), varsayılan **Arcade**:

- **Arcade** — `lib/oyunlar/oyun-muzigi.ts`, koddan üretilen chiptune döngüsü. Önce
  pomodoro'nun lo-fi parçaları kullanılıyordu; oyunla hiç uyuşmadı. Lo-fi yavaş ve dikkat
  dağıtmamak için yapılmış, 60 saniyede olabildiğince çok soru çözdüren bir oyunun altında
  uyku getiriyor. 126 BPM'de on altılık arpej + bas + tepme/trampet/hi-hat: acele etme
  duygusunu müziğin kendisi veriyor. Dosya olmadığı için APK büyümüyor ve döngü dikişi
  duyulmuyor — parça bitip baştan başlamıyor, notalar sürekli üretiliyor.
- **Lo-fi** — `SesCalar` üzerinden pomodoro parçaları, 0,22 seviyesinde.

Zamanlama `setTimeout` ile **değil** AudioContext'in kendi saatiyle: JS zamanlayıcıları
arka planda kısılıyor, ritim ilk takılmada dağılırdı. Planlayıcı 30 ms'de bir uyanıp
sonraki 150 ms'lik dilimi önden yazıyor.

Ana seviye 0,42; ölçülen tepe −14 dB, ortalama −34 dB. Efektler −1 dB'de olduğu için
müzik onların yaklaşık 13 dB altında kalıyor: duyuluyor ama doğru/yanlış geri bildirimini
bastırmıyor.

**Seri puanı etkilemiyor.** Ardışık doğru sayısı ayrı bir ölçü olarak duruyor; seri çarpanı
olsaydı eski turlarda kurulan rekorlar yenileriyle karşılaştırılamaz hâle gelirdi.

Oynarken sorunun **kuralı/türü yazılmıyor**. Yazılıyordu ve cevabı ele veriyordu: "Bitişik
yazılır" notunun altında biri ayrı biri bitişik iki şık varsa okumaya gerek kalmıyor, "Bölme"
yazısı da köklü/üslü sorularda sorunun yarısını söylüyordu. Kural, tur bitince yanlışların
listesinde çıkıyor — öğretmesi gereken yer orası.

`OyunIstatistigi`'ne alan eklerken `istatistigiTamamla()` üzerinden okuyun: kayıtlar
localStorage'dan ham JSON geliyor, eski kayıtta olmayan bir alan `Math.max(0, undefined)`
ile NaN üretiyor ve NaN bir kez toplama karışınca hem ekranda görünüyor hem de bütün rozet
eşiklerini sessizce sağlanamaz yapıyor.

**Yazım Ustası.** İki şıktan doğru yazılışı seçme. Doğru cevap süre kazandırmaz, yanlış cevap
3 saniye götürür: cezasız bir turda rastgele dokunmak da aynı puanı getirirdi (iki şık var,
%50 tutturulur).

**Zihinden İşlem.** Toplama, çıkarma, çarpma, bölme, köklü ve üslü sorularından istenenler
seçiliyor (seçim `rabi-islem-secimi` altında saklanıyor, son işlem kapatılamıyor). Cevap
ekrandaki tuş takımından giriliyor; gerçek bir `<input>` kullanılsaydı Android'de sistem
klavyesi açılıp hem soruyu hem tuşları örterdi.

Sorular kayıtlı bir havuzdan gelmiyor, **üretiliyor** (`lib/oyunlar/islem.ts`) — ezberlenecek
bir şey yok, sabit liste birkaç turda tekrara düşerdi. Bütün sonuçlar negatif olmayan tam
sayı: tuş takımında eksi ve virgül yok, yazılamayan bir cevap soruyu cevapsız bırakırdı.
Bölünen çarpımdan kuruluyor (kalanlı bölme hiç çıkmaz), kökler tam kare. Son 12 soruda
görülen bir ifade tekrar üretilmiyor; arka arkaya gelen aynı işlem hesap değil hatırlama
olurdu.

Testler ekrandaki ifadeyi **bağımsız olarak** hesaplayıp `sonuc` ile karşılaştırıyor: üreteç
metni ve cevabı ayrı ürettiği için ikisi ayrışırsa oyun sessizce yanlış cevap isterdi.

**Edebiyat Eşleştirme.** Altı eser, altı yazar; eşleşen çift yeşile döner ve **yerinde kalır**
— silinselerdi ızgara her eşleşmede yeniden dizilir, parmak gitmek istediği kutuyu kaybederdi.
Altısı bitince yeni altılı geliyor, arada ekran yok.

Bir elde aynı yazardan iki eser olmuyor: olsaydı o yazarın tuşu iki esere birden uyar, doğru
cevap yanlış sayılırdı. Eller mümkün oldukça **tek dönemden** kuruluyor; dönemler karışsaydı
öğrenci esere değil çağrışıma bakardı ("bu isim eski duruyor"). Yeterli yazar kalmayınca
karışık ele düşülüyor, oyun soru bulamayıp durmuyor.

Anonim eserler (Dede Korkut, Battalname, halk destanları) havuza **alınmadı**: karşılığında
bir yazar tuşu olmayan eser, cevabı olmayan soru demek. Ekranın altında tur boyunca kurulan
eşleşmeler birikiyor — boşluk doldurmak için değil, doğru bildiğin çifti dönemiyle bir kez
daha göstermek için.

Havuz (`lib/oyunlar/yazim-havuzu.ts`) TDK Yazım Kılavuzu ve ÖSYM'nin sık sorduğu başlıklardan
derlendi; tek kelimelik girişlerin tamamı `scripts/havuz-dogrula.mjs` ile sozluk.gov.tr'ye
karşı doğrulandı — doğru şık sözlükte olmalı, yanlış şık olmamalı. Betiğin `BEKLENEN` listesi
iki bilinen yanlış alarmı susturuyor: çekimli biçimler ("burada" madde başı değil) ve sözlük
aramasının düzeltme işaretini yok sayması ("kağıt" arayınca "kâğıt" gelir).

Belirsiz çiftler havuzdan **çıkarıldı**: "grup/gurup", "ekstra/ekstre", "böyle/böle" gibi
çiftlerde yanlış sanılan şık aslında başka bir kelime. Aynı sebeple "hâlâ" ve "bekâr" tek
kelime olarak değil cümle içinde soruluyor — şapkasız yazılışları da gerçek kelime.

Hatırlatma saati **dakikalı** girilebiliyor (`hatirlatmaSaati` + `hatirlatmaDakikasi`). Çipler
sık istenen tam saatler; "21.30" gibi bir saat için yanındaki `<input type="time">` kutusu var
— Android'de sistemin kendi saat seçicisini açıyor, elle rakam yazdırmıyor. Girilen değer
`saatiKirp`/`dakikayiKirp` ile kırpılıyor: bozuk bir sayı `setHours`'a girerse tarih sessizce
kayar (25 → ertesi günün 01'i) ve hatırlatma yanlış güne planlanırdı.

### Günde en fazla bir bildirim

Bu kural, tekrarlayan bildirim kurup sonra iptal etmeye çalışarak değil, her zaman **yalnızca
bir sonraki** hatırlatmayı planlayarak sağlanıyor (`lib/hatirlatma.ts` + `lib/bildirim.ts`).
Uygulama her açıldığında ve veri değiştikçe plan yeniden hesaplanıyor:

- Bugün soru girildiyse → bildirim yarına kayar, bugünkü hak harcanmaz.
- Girilmediyse ve saat henüz gelmediyse → bugüne planlanır.
- Saat geçtiyse → yarına. "Hemen gönder" yapılmıyor; kullanıcı 21'de uygulamayı açtığında
  20:00 hatırlatması, üstelik uygulama elindeyken patlardı.

`repeats: true` kullanılmadı: tekrarlayan bir bildirimin yalnızca **bugünkü** örneğini iptal
etmenin yolu yok, dolayısıyla "bugün girdiysen sesini çıkarma" davranışı kurulamazdı.

İzin, kurulum sihirbazının son adımında isteniyor — hatırlatma açıldıktan hemen sonra, ne
için sorulduğu belliyken. Reddedilirse uygulama çalışmaya devam eder; Ayarlar'daki anahtar
tekrar dener ve kalıcı ret durumunda ne yapılacağını yazar.

## İkonlar ve açılış ekranı

İkonun kaynağı **maskotun kendisi** — `public/tavsan-yuz.png`, uygulamanın içinde görünen
tavşanla aynı dosya. Bir süre kaynak elle çizilmiş bir SVG tavşandı ve telefonun ana
ekranındaki tavşan uygulamanın içindekine benzemiyordu; iki ayrı kaynak bunu kalıcı hâle
getiriyordu.

```
node scripts/ikon-uret.mjs   # tek bağımlılık: sharp (Next ile zaten kurulu)
```

Üretilen dosyalar depoya giriyor (`cap sync` onları silmiyor) ama **elle düzenlenmemeli** —
ikon değişecekse maskot değiştirilip betik yeniden çalıştırılmalı.

Betik dört şey üretiyor:

| Çıktı | Nerede | Ne |
|---|---|---|
| `ic_launcher_foreground.png` | `mipmap-*` | uyarlanabilir ikonun ön planı |
| `ic_launcher.png` / `_round.png` | `mipmap-*` | Android 8 öncesi için zemini basılmış ikon |
| `ic_bildirim.png` | `drawable-*` | bildirim çubuğunun beyaz silueti |
| `icon-512.png` / `icon-192.png` | `public/` | web (PWA) ikonu |

Kaynak görselin kenarında beyaz zeminden kalmış soluk pikseller var; uygulamanın kırık beyaz
zemininde görünmüyorlar ama turuncu ikonun üstünde hâle ve benek olarak çıkıyorlardı. Betik
alfası eşiğin altındaki pikselleri siliyor (`TOZ_ESIGI`).

Uyarlanabilir ikonun ön planında tavşan, 108 birimlik tuvalin ortadaki **72 birimlik** güvenli
alanına sığdırıldı; dışarısını cihaz üreticisinin maskesi (daire, kare, damla) kırpabiliyor.
Zemin `@drawable/ic_launcher_arka`: markanın iki tonu arasında köşegen bir geçiş. Bir süre
burada tek bir mor (`#6D3FE0`) duruyordu — mor tema kaldırıldığında uygulamanın her yeri
amber oldu ama ana ekrandaki ikon mor kaldı, çünkü zemin rengi ikonun kendi dosyasında ayrı
yazılı.

**Bildirim simgesi ayrı olmak zorunda.** Android durum çubuğunda yalnızca **alfa kanalını**
okuyor: renkli bir ikon orada beyaz bir lekeye dönüşüyor ve bildirimin hangi uygulamadan
geldiği anlaşılmıyor. `ic_bildirim` maskotun saydamlığından çıkarılmış beyaz siluet; rengini
`iconColor` (web tarafı) ve `setColor` (odak servisi) veriyor. Bildirim panelindeki renkli
logo ise `largeIcon` ile geliyor — siluet uygulamayı tanıtmaya yetmiyor.

## Fotoğraf deposu

Yanlış soru fotoğrafları **IndexedDB**'de (`rabi-resimler` veritabanı), ikili blob olarak
duruyor. localStorage'a base64 yazılmıyor: kota ~5 MB ve base64 boyutu %33 şişirir; birkaç
fotoğrafta kota dolar ve o andan sonra **bütün** localStorage yazmaları (denemeler, notlar,
ayarlar) sessizce başarısız olurdu.

Kayıt ile blob iki ayrı depoda olduğu için ayrık düşebiliyorlar. İki koruma var:

- Kaydetmede önce blob yazılır, sonra kayıt eklenir — ters sırada, yazma başarısız olursa
  galeride görüntüsüz kart kalırdı.
- Banka ekranı her açılışında, kaydı olmayan blob'lar (`oksuzResimleriSil`) temizlenir.

### Yedekte fotoğraflar

İki yedek düğmesi var:

| Düğme | İçerik | Boyut |
|---|---|---|
| **Yedeği indir** | Fotoğraflar hariç her şey | birkaç KB |
| **Fotoğraflarla yedekle** | Fotoğraflar dahil her şey | fotoğraf boyutu × ~1,33 |

Fotoğraflar `data:` adresi olarak gömülüyor; base64 boyutu üçte bir şişirdiği için ayrı
düğmede duruyor ve tahmini boyut düğmenin üstünde yazıyor.

Yanlış soru **kayıtları** her iki yedekte de var, ama geri yüklemede fotoğrafı bulunmayanlar
**eleniyor** (`elenenSoruSayisi` bunu sayıp kullanıcıya söylüyor). Elenmeselerdi galeride
görüntüsüz boş kareler kalırdı. Fotoğrafsız yedeği geri yüklersen banka boş gelir — düğmenin
altında bu da yazıyor.

Geri yüklemede fotoğraflar localStorage'dan **önce** yazılıyor: localStorage yazıldıktan
sonra sayfa yenilendiği için, sonraya bırakılsaydı yarısı yazılmadan yenilenebilirdi.

Bilinen sınır: Android, kamera ekranı açıkken belleği daraltıp uygulamayı öldürürse çekilen
fotoğraf kaybolur (Capacitor'ın `appRestoredResult` akışı kurulmadı). Kullanıcı açısından
sonucu, fotoğrafın tekrar çekilmesi.
