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

Kaynak SVG'ler `assets/` altında, üretilen PNG'ler `android/app/src/main/res/` altında:

```
./scripts/ikon-uret.sh      # rsvg-convert + ImageMagick gerekir
```

Üretilen dosyalar depoya giriyor (`cap sync` onları silmiyor) ama **elle düzenlenmemeli** —
ikon değişecekse `assets/` içindeki SVG düzenlenip betik yeniden çalıştırılmalı.

Uyarlanabilir (adaptive) ikonun ön planında tavşan, 108 birimlik tuvalin ortadaki **72
birimlik** güvenli alanına sığdırıldı; dışarısını cihaz üreticisinin maskesi (daire, kare,
damla) kırpabiliyor. Arka plan `@color/ic_launcher_background` = `#C2622A`, uygulamanın vurgu
rengiyle aynı. Android 8 öncesi uyarlanabilir ikonu tanımadığı için `ic_launcher.png` ve
`ic_launcher_round.png` ayrıca üretiliyor — yuvarlak olana maskeyi sistem uygulamıyor, daire
görselin içinde.

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
