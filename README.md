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
npm run test       # vitest — hesap/puan/sıralama birim testleri
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
| `lib/ses.ts` | Pomodoro ortam sesleri — Web Audio ile üretilir, dosya yok |
| `public/ses/` | Lo-fi parçalar (CC0) + `LISANS.md` |

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

## Fotoğraf deposu

Yanlış soru fotoğrafları **IndexedDB**'de (`rabi-resimler` veritabanı), ikili blob olarak
duruyor. localStorage'a base64 yazılmıyor: kota ~5 MB ve base64 boyutu %33 şişirir; birkaç
fotoğrafta kota dolar ve o andan sonra **bütün** localStorage yazmaları (denemeler, notlar,
ayarlar) sessizce başarısız olurdu.

Kayıt ile blob iki ayrı depoda olduğu için ayrık düşebiliyorlar. İki koruma var:

- Kaydetmede önce blob yazılır, sonra kayıt eklenir — ters sırada, yazma başarısız olursa
  galeride görüntüsüz kart kalırdı.
- Banka ekranı her açılışında, kaydı olmayan blob'lar (`oksuzResimleriSil`) temizlenir.

Fotoğraflar boyutları yüzünden yedeğe **girmiyor**; yedek dosyası paylaşılabilir kalsın diye.
Telefon değiştirirken fotoğraflar taşınmaz, bu bilinçli.

Bilinen sınır: Android, kamera ekranı açıkken belleği daraltıp uygulamayı öldürürse çekilen
fotoğraf kaybolur (Capacitor'ın `appRestoredResult` akışı kurulmadı). Kullanıcı açısından
sonucu, fotoğrafın tekrar çekilmesi.
