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
    kimliği, oyun, soru metni, doğru sanılan cevap, sebep, sürüm, cihaz alanı —
    telefon modeli ve ada bağlı olmayan okunur bir ad). Ne gönderildiği hem ilk
    bildirimde çıkan izin kartında hem Gizlilik ve Koşullar ekranında yazıyor;
    kart "Gönder" denmeden hiçbir şey ağa çıkmıyor. Ayarlarda ayrıca bir
    açma/kapama anahtarı vardı, kaldırıldı: bildirim bayrağa basıp sebep
    seçmeden zaten oluşmuyor ve aynı karar iki ayrı yerde tutuluyordu.
    Aynı dosyadan çıkan ikinci kayıt türü **öneri/hata bildirimi**
    (`lib/geri-bildirim.ts` saf mantık, `lib/geri-bildirim-kolu.ts` kuyruk,
    `components/ekranlar/geri-bildirim.tsx` ekran). Play yorumları bunun yerini
    tutmuyordu: yorumda sürüm ve telefon yazmıyor, cevap da verilemiyor.
    Giden beş alan `geriBildirimFormVerisi()` içinde sayılı; biri serbest
    metin ve ekran kullanıcıya kişisel bilgi yazmamasını söylüyor. İzin kartı
    yok — kullanıcı metni yazıp "Gönder"e basıyor, liste düğmenin üstünde.
    İki kayıt türü de **Firestore**'a gidiyor (`lib/veri/firestore-adresi.ts`,
    koleksiyonlar `hatali-sorular` ve `geri-bildirimler`), SDK ile değil
    REST ile — yeni yerli bağımlılık yok. Önce iki Google Form'du; formun
    `entry` numaralarını elle kopyalamak ve yanıtların Firebase'den ayrı bir
    Sheets'te durması yüzünden bırakıldı. Güvenlik API anahtarında değil
    kuralda: kural yalnızca `create`e izin veriyor, alan adları ve boyları
    sayılı (`PLANNED.md` → "Firestore kuralları"). Bu istisnayı bu iki kayıt
    türünün ötesine genişletme; alan eklersen kural, ekrandaki liste,
    `public/gizlilik/index.html`, `public/gizlilik/veri-ozeti.html` ve Play'in
    Data Safety beyanı birlikte değişmeli.
  - **İkinci istisna: çökme raporları.** WebView uygulamasında çökmenin sebebi
    çoğu zaman uygulamanın kendi kodu değil, cihazdaki Android System WebView
    sürümü oluyor; bunu kullanıcıdan öğrenmenin yolu yok. Firebase Crashlytics
    kullanılıyor. Ağa çıkan tek yer `lib/cokme.ts` (köprü) ve yerli taraftaki
    `CokmeRaporu.kt`; başka hiçbir dosya `FirebaseCrashlytics` import etmiyor.
    Crashlytics'in otomatik gönderimi **hiçbir zaman açılmıyor**
    (`AndroidManifest.xml` → `firebase_crashlytics_collection_enabled=false`
    kalıcı): çökme cihazda saklanıyor ve uygulama yeniden açıldığında
    gönderilsin mi diye **her seferinde soruluyor**. Ayarlarda soruyu kapatan
    bir anahtar vardı, kaldırıldı: soru zaten çökmeden sonra çıkıyor ve
    "Gönderme" raporu siliyor. `firebase-analytics` bilerek eklenmedi.
  - **Üçüncü istisna, öteki ikisinden ayrı türde: Play'in güncelleme
    denetimi.** Play güncellemeyi itmiyor, haber de vermiyor; otomatik
    güncellemesi kapalı kullanıcı düzeltilmiş bir hatayı haftalarca eski
    sürümde yaşıyordu. Açılışta bir kez Play In-App Updates ile soruluyor
    (`lib/guncelleme.ts` köprü, `lib/guncelleme-kolu.ts` state,
    `components/guncelleme-seridi.tsx` şerit, yerli taraf
    `guncelleme/GuncellemeEklentisi.kt`). Ağa çıkan bizim kodumuz değil
    telefondaki Play Store; giden tek şey paket adı ve kurulu sürüm — Play'in
    zaten bildiği bilgi. Kip **esnek**: indirme ancak "Güncelle" denince ve
    Play'in kendi onay penceresinden geçerek başlıyor, yeniden başlatmaya
    kullanıcı karar veriyor. Şerit ekranın üstünde, pencere değil — kullanıcı
    uygulamayı bir iş için açtı, güncelleme onun önüne geçmemeli. Kapatma
    oturumluk ve kayda girmiyor: kalıcı "bir daha sorma", eski sürümde kalmak
    demek. Elden kurulan APK'da `appUpdateInfo` hata döndürüyor ve her yöntem
    bunu yutup "güncelleme yok" diyor. Zorunlu kipe (`IMMEDIATE`) geçmeden
    önce sor: bu sürüm kullanıcıyı turun ortasında durdurmayı hak ediyor mu?
    Bu üç istisnanın dışında ağa çıkılmıyor.
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
- Zemin rengi üç yerde birden yazılı ve **birlikte** değişmeli:
  `--background` (globals.css), `acilis.tsx`'teki `ZEMIN` ve Android'in
  `acilis_zemin` / `uygulama_zemin` renkleri. Ayrılırlarsa açılışta renk
  sıçraması olur.
- Yazı tipi tek: **Nunito**. Tek istisna açılış ekranı: orası Manrope
  (`font-marka`), çünkü tasarım o ekranı Manrope ile çizdi ve "RABİ" 50
  pikselde iki ailede belirgin biçimde farklı duruyor. `font-marka` başka
  hiçbir yerde kullanılmıyor; yeni bir yerde kullanmadan önce bu istisnanın
  neden açıldığına bak. Başlık ayrı aile değil ayrı kalınlık — `font-display`
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar. Derlemeye girmiyorlar,
  uygulama onlardan hiçbir şey import etmiyor — ekran değiştirirken oraya bak.
- Sütun hâlindeki sayılara `rakam` sınıfı (tabular-nums), başlıklara `font-display`.
- Alt menünün altında kalan içerik için `guvenli-alt`.
- **Yazı seçimi kapalı** (`user-select: none`, `globals.css`). Uygulama bir
  belge değil: kopyalanacak metin yok, ama dokunmatikte basılı tutmak seçim
  tutamaklarını ve "Kopyala / Web'de ara" çubuğunu çıkarıyordu — oyunda şıkka
  biraz uzun basmak ya da kaydırırken parmağın bir başlıkta takılması buna
  yetiyor ve çubuk turu keserek açılıyor. `touch-callout` da kapalı: seçim
  olmadan da uzun basışta görsellerin üstünde sistemin kendi menüsü açılıyor.
  Tek istisna giriş alanları (`input`, `textarea`, `contenteditable`) — orada
  seçim, yazılanı düzeltmenin tek yolu.

### Maskotun pozları

Rabi bir süre **emojiydi**: `public/tavsan-yuz.png` 🐰'nin, `tavsan-el-sallayan.png`
🙋'nin PNG'ye alınmış hâliydi. Uygulamanın kendi maskotu değildi — telefonun
yazı tipinden gelen bir simgeydi ve ikonda, bildirimde, engel katmanında da
o duruyordu. Yerini maskotun kendi çizimleri aldı.

Pozlar elle konmuyor, üretiliyor: kaynak `assets/maskot/*.png`, betik
`scripts/maskot-uret.mjs`, çıktı `public/tavsan-*.png`. Çıktılar depoya
giriyor ama **elle düzenlenmemeli** — `ikon-uret.mjs` ile aynı gerekçe.
Kaynaklar zemini kesilmiş, gerçek alfa taşıyan 2048'lik PNG; betik saydamlığı
kaynaktan okuyor ve tek işi ölçü: bütün pozları aynı tuvalde **aynı
yükseklikte** vermek. Boy eşitliği şart: `Rabi` ölçüyü tek bir sayı olarak
biliyor, eşit olmasalardı maskot poz değiştirdiğinde büyüyüp küçülürdü.

Kaynaklar bir süre siyah zeminli JPEG'di ve betik zemini kenardan taşırarak
siliyordu. O yol maskotu bozdu: taşma gövdedeki koyu geçişlere sızıyor, kürkün
yanında düz bir kesik bırakıyordu. Zemin silme işi artık depoya girmeden,
kaynağın kendisinde bitiyor.

**`durum` ile `poz` ayrı kalıyor.** `durum` yalnızca ekran okuyucu etiketi,
çizilecek dosyayı `poz` seçiyor. İkisini birleştirmek — durumdan doğrudan
dosya türetmek — denenebilir görünüyor ve açılışı bozuyor: açılıştaki uçan
tavşan ana sayfadaki maskotun tam üstüne konuyor, ikisi farklı boyutta (110'a
karşı 58) ama **aynı görseli** taşımak zorunda. Durumdan türeyen bir görsel,
katman kalkarken tavşanı başka bir tavşana çevirirdi.

**İki baş çekimi var: `yuz` ve `kafa`.** Tam boy pozlar 70 pikselin altında
lekeye dönüşüyor (gövde, kollar ve tutulan nesne tek bir şey oluyor), o yüzden
küçük yerlerde baş kullanılıyor: oyun başlıkları (26–54) `yuz`de, ana sayfanın
selamlaması ve açılışın iniş yuvası `kafa`da.

İkisi ayrı duruyor çünkü kaynakları ve işleri ayrı. `yuz`, "normal maskot"un
elle ölçülmüş bir kırpımı ve aynı zamanda uygulama ikonunun (`ikon-uret.mjs`),
Android'in engel katmanının ve pomodoro bildiriminin kaynağı — onu değiştirmek
ikon üretimini de dokundurur. Kırpımın kutusu göz kararı değil ölçülerek
bulundu: alt kenar gövdenin en dar satırı, yan kenarlar yanakların en geniş
satırı. `kafa` ise kendi kaynağından ("kafası gözüken maskot") geliyor,
kırpılmıyor ve yalnızca arayüzde kullanılıyor.

**İniş yuvası ile uçan tavşan aynı pozda olmak zorunda.** Ana sayfanın
selamlaması `kafa` olunca açılış ekranındaki uçan tavşan (`acilis.tsx`),
kurulum sonrası geçiş (`MaskotGecisi`) ve kurulumun karşılama ekranındaki yuva
da `kafa`ya geçti. Biri geride kalsaydı katman kalkarken tavşan başka bir
tavşana dönüşürdü — yukarıdaki `durum`/`poz` kuralının aynı sebebi.

`ikon-uret.mjs` yüzün tuvaldeki kutusunu **sabit sayılarla** biliyor.
`maskot-uret.mjs` çalışınca o sayıları ekrana yazıyor; kırpma değişirse ikon
betiğindeki `MASKOT` da değişmeli ve `public/tavsan-yuz.png`
`android/.../drawable-nodpi/tavsan_yuz.png`e yeniden kopyalanmalı — yerli
taraf `public/` altını okuyamıyor.

**Zıplayan sevinç ayrı bir poz.** `sevinen` ("sevinen maskot 2") ile
`ziplayan` ("sevinen maskot 3") aynı ruh hâlinin iki çizimi ve ikisi de
kullanılıyor: `ziplayan` ana sayfada günlük hedefi tutturan kullanıcıya
çıkıyor, `sevinen` başka yerlerde duruyor. Tek poza indirilseydi aynı görsel
iki ayrı bağlamda tekrarlanırdı.

**Bütün pozlar saydam PNG'den geliyor.** `kafa` ve `ziplayan` bir süre siyah
zeminli JPEG'den geliyordu ve betik yalnızca o ikisi için zemini kenardan
taşırarak siliyordu; kulak ve pati kenarlarında koyu bir hare bırakıyordu.
Temiz kaynakları gelince JPEG dalı betikten tümüyle silindi — yeni bir poz
eklerken kaynak saydam PNG olmak zorunda, betikte zemin silecek bir şey yok.

Kaynak klasöründeki her kaynak kullanılmıyor. Dışarıda kalan "sinirli" bilerek
kaldı: uygulamada karşılığı olan bir ruh hâli değil — Rabi yanlış cevapta
kullanıcıya kızmıyor, efekt zaten sarsıntıyla "yanlış" diyor.

### Açılışın son hareketi ana sayfaya bağlanıyor

Ekran 4,2 saniye sürüyor (`ACILIS_SURESI`) ve bütün parçalar **tek** bir zaman
çizgisini paylaşıyor: %0–30 iniş, %30–68 duruş, %68–100 çıkış. Süreler bu
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
- **Varış noktası ölçülüyor, yazılmıyor — yedeği de yok.** Tasarım
  `translate(-147px, -224px) scale(0.33)` diyor ama o sayılar 360×720lik
  prototip çerçevesine ait. Bir süre uygulamada da yazılıydı (`VARIS` tablosu,
  `calc()` ile) ve tam da beklendiği gibi bozuldu: düzen değişti, sayılar
  kaldı, tavşan yuvanın 93 piksel altına indi. Tablo yalnızca ölçüm
  yetişmediğinde devreye girdiği için hata da **arada bir** görünüyordu —
  telefonun o açılışta ne kadar hızlı olduğuna bağlıydı. Tablo silindi: ölçüm
  tutmazsa tavşan hiç uçmuyor, olduğu yerde sönüyor. Yuva yoksa konacak maskot
  da yok; tahmin edilen bir köşeye inmek hareketi kurtarmıyor, yanlış yere
  inen bir tavşan gösteriyor.
- **Ölçüm tek seferlik değil.** Uçuş %68'de başlıyor ve ölçüm o ana kadar
  yenilenip orada donuyor. İki sebebi var: yuva geç doğabiliyor (eskiden 60
  deneme ≈ 1 saniyelik bir hak vardı ve yavaş telefonda ana sayfa ona
  yetişmiyordu) ve düzen bir kez daha oynayabiliyor — güvenli alan
  (`--guvenli-ust`) yerli köprüden gecikmeli geliyor, yazı tipi sonradan takas
  oluyor. Donma şart: uçuş başladıktan sonra varış noktasını değiştirmek
  tavşanı yolun ortasında ışınlar. Ölçü `window.innerHeight`ten değil ekranın
  kendi kutusundan alınıyor; WebView açılırken ikisi bir süre ayrı düşüyor.
- **Yuva tek.** Ekranda ya ana sayfanın başlığı vardır ya kurulum sihirbazı,
  o yüzden ikisinde de aynı kimlik duruyor ve ölçüm hangisi varsa onu buluyor.
  Kurulumun ilk ekranı (karşılama) kendi düzenini çizdiği için yuva orada
  ekranın **ortasında** duruyor; varış noktası yazılmayıp ölçüldüğü için uçuş
  kendiliğinden oraya iniyor. Karşılama ekranına ikinci bir maskot eklersen
  aynı kimlikten iki tane olur ve `getElementById` hangisini önce bulursa
  tavşan oraya iner.
- **Ölçüm zamanlayıcıyla yineleniyor, `requestAnimationFrame` ile değil.**
  Sayfa görünür değilken rAF hiç çağrılmıyor ve ölçüm sonsuza kadar bekliyor.

Ayrı bir solma adımı yok: ekran kendi çıkışını kendi yapıyor (`acilis-son`,
`acilis-zemin-son`), üstüne bir de opaklık geçişi koymak biten bir geçişin
üstüne ikincisini koymak olurdu.

### Android'de uçtan uca ekran bütün sürümlerde açık

`MainActivity`, `super.onCreate`ten önce `EdgeToEdge.enable(this)` çağırıyor.
Android 15 bunu hedef SDK 35 ve üstünde zaten zorluyor; çağrı daha eski Android
sürümlerindeki davranışı da aynı yapıyor ve Play Console'un kısmi uçtan uca
ekran uyarısını önlüyor. Play'in Java için önerdiği yüksek seviye AndroidX
API'si bu; yerine eski `setStatusBarColor`, `setNavigationBarColor` veya
`layoutInDisplayCutoutMode` API'lerini elle çağırma; AndroidX uyumluluk katmanı
güncel sürüme göre doğru yolu seçiyor.

WebView içeriğinin sistem çubuklarının altında kalmaması
`viewport-fit=cover`, Capacitor `SystemBars` eklentisinin enjekte ettiği
`--safe-area-inset-*` değerleri ve `app/globals.css` içindeki
`--guvenli-ust` / `--guvenli-alt` değişkenleriyle çözülüyor. Yerli tarafta
ayrıca dolgu eklemek aynı boşluğu iki kez uygular.

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
geri kalanı (aylık özet, harita, kurulum sonrası geçiş) tercihi izlemeye
devam ediyor. Bu istisnayı geri almadan önce yukarıdaki sebebe bak.

### Kurulum soru sormayan iki ekranla açılıyor

Kurulum üç ekranla başlıyor: **karşılama** ("Rabi seni tanısın"), **isim**
("Sana nasıl sesleneyim?") ve **tanışma** ("Seni tanıdığıma memnun oldum,
Emre"). Sebep, ilk ekranın eskiden doğrudan "Bu yıl kaçıncı sınıftasın?" diye
sorması: uygulamayı ilk açan kişi kendini tanıtan bir şey görmeden forma
düşüyordu. Tanışma ekranı da yazılan adın gerçekten alındığını gösteren tek
yer — kurulumun geri kalanı sınıf, alan ve hedef soruyor ve ad bir daha
görünmüyordu.

Karşılama ile tanışma `adimlar` dizisinde duruyor (sıra onlardan geçiyor) ama
ötekilerin düzenini kullanmıyor: `Kurulum` ikisi için de erken dönüyor. Kart,
geri düğmesi ve soru noktaları orada yok — ekranda yapılabilecek tek bir şey
varken üçü de gürültü.

İkisi bir süre tek bir `TekIsliEkran` bileşenini paylaştı; tanışma tasarıma
göre yeniden çizilince paylaşım bitti ve bileşen kaldırıldı. Karşılama sakin
bir giriş, tanışma ise adı öğrendikten sonraki karşılama anı: süzülen süsler,
el sallayan poz ve üç noktalı gösterge yalnızca tanışmada. İkisini tek
bileşende tutmak, yarısı kullanılmayan bir sürü propla biten bir bileşen
olurdu.

İlerleme göstergesi bu ikisini **saymıyor** (`noktaAdimlari`); gösterge "kaç
soru kaldı"yı anlatıyor ve ikisi de soru sormuyor. Sayının ayrı bir listeden
çıkması şart: dizinin kendisinden çıkarılsalardı `ilerle` onları atlardı.
Payda da bu listenin **boyu**: notlar adımı herkeste yok ve sabit bir yediliğe
göre dolan bir çubuk, o adımı görmeyen kullanıcıda hiç dolmadan biterdi.

### Soruyu Rabi soruyor

Soru soran ekranların düzeni üç şeyde tasarımın son hâline döndü:

- **İlerleme üstte, ince bir çubuk.** Alttaki nokta şeridi kalktı. Nokta sayısı
  arttıkça "ne kadar kaldı" sayılmadan okunmuyordu ve şerit Devam düğmesinin de
  altında, gözün en son gittiği yerde duruyordu.
- **Maskot 110'dan 76'ya inip sola geçti**, soru da onun **konuşma balonunda**
  ve sola hizalı. Ortalanmış başlık ekranın başlığı gibi duruyordu; balondaki
  soru Rabi'nin sorusu gibi duruyor ve satır okunduğu yerde başlıyor.
  Hatırlatma adımının başlığı bu yüzden "Hatırlatma" değil **"Saat kaçta
  hatırlatayım?"**: soru balona çıkınca kartın içindeki aynı cümleli etiket
  ikinci bir başlık oluyordu, o etiket kaldırıldı.
- **Kazanılan yükseklik içeriğe gidiyor.**

Alttaki esneyen boşluk (`flex-1`) yalnızca isim ve bölüm adımlarında var.
Ötekilerde içerik kendi `my-auto`suyla ortalanıyor ve otomatik kenar boşluğu
ancak **artan** yeri paylaşıyor: orada duran bir `flex-1` artanı önce kendi
alıyor, liste de ekranın tepesine yapışıp altında kocaman bir boşluk
bırakıyordu.

### Boş kutuyla ilerlenmiyor

Devam düğmesi eksik cevapta **pasif**. Dört adımın kuralı var: ad geçerli
olacak, alan kartlarından birine dokunulacak, bölüm adımında üniversite+bölüm
seçili olacak, notlar adımında en az bir sayı yazılacak. Ötekiler
(sınıf, hedef, hatırlatma) varsayılanla geliyor — varsayılan da bir cevap.

Boş bırakılabilen iki adımın (bölüm, notlar) atlama yolu düğmenin hemen
üstündeki **"daha sonra seçeceğim"** onay kutusu (`SonraSec`). Onay kutusu,
düğme değil: düğme ekranı ileri götürür, bu ise adımın cevabını "şimdilik yok"
yapıyor — ileri götüren şey yine Devam. İşaret konduğunda o adımda yazılmış
olanlar da temizleniyor; üç yılı girip sonra işareti koyan kullanıcının kararı
sonuncusudur ve yarım bir OBP tahmini sessizce bozardı.

Eskiden ikisi de sessizce boş geçilebiliyordu ve sonucu ana sayfada
görünüyordu: hedef paneli boş açılıyor, oraya kimse geri dönmüyordu. Notlar
adımındaki eski "Şimdilik atla" düğmesi de kalktı — Devam'ın yanında ikinci bir
düğme, hangisinin ileri götürdüğünü belirsiz bırakıyordu.

Alan adımı bir süre "Karar vermedim"i **seçili** gösteriyordu (`puanTuru ?? ALANSIZ`):
hiçbir şeye dokunmamış kullanıcı, kendi adına verilmiş bir cevap görüyordu.
Artık hiçbiri seçili gelmiyor; "Karar vermedim" o adımın açık atlama yolu ve
seçilmesi de bir dokunuş istiyor.

Ad adımında uyarı eskiden yalnızca Devam'a basılınca çıkıyordu; düğme pasif
olduğu için o an hiç gelmiyor. İpucu bu yüzden iki yüzlü: boş alanda soluk bir
yönerge, kısa yazılmış adda kırmızı bir uyarı. Pasif bir düğmenin yanında
sebebi yazmayan ekran, kullanıcıyı kurulumda kilitler.

### Maskot adımdan adıma uçuyor

Tavşan üç düzende üç ayrı yerde duruyor: karşılamada ortada 150 pikselde, soru
ekranlarında sol üstte 76'da, tanışmada yine ortada. Ekranlar ayrı ağaçlar
olduğu için maskot her adımda sökülüp yeniden kuruluyor ve kullanıcı onu bir
karede oradan oraya **ışınlanırken** görüyordu.

`KurulumMaskotu` aradaki farkı ölçüp uçarak kapatıyor: her yerleştiğinde kendi
kutusunu `Kurulum`daki ref'e yazıyor, bir sonraki adımda yeni kutusunu ölçüp
farkı bir kare boyunca **ters** dönüşüm olarak uyguluyor, sonra dönüşümü
kaldırıyor. Varış noktası açılış ekranındaki kuralın aynısıyla ölçülüyor,
yazılmıyor. Dört incelik:

- Ref `Kurulum`da duruyor, bileşenin içinde değil — bileşen adım değişince
  sökülüyor ve kendi içinde tuttuğu değer o sırada kayboluyor.
- Ters dönüşüm `useLayoutEffect` içinde konuyor; boyamadan sonra konsaydı
  tavşan bir kare varış noktasında görünür, uçuş oradan başlardı.
- İki `requestAnimationFrame` şart (tarayıcı ters dönüşümlü hâli bir kez
  boyamalı) ama tek başına yetmiyor: rAF sayfa görünür değilken hiç
  çağrılmıyor ve tavşan eski yerinde asılı kalırdı. Arkasında bir emniyet
  zamanlayıcısı var — açılış ekranındaki kuralın aynısı.
- Ölçmeden **önce** eski dönüşüm siliniyor: Devam'a arka arkaya basılırsa bir
  önceki uçuş sürüyor olabiliyor ve `getBoundingClientRect` o sırada tavşanın
  durduğu yeri değil yolun ortasını döndürür.

Hareket bilgi taşımıyor — nerede olduğunu düzen zaten söylüyor — o yüzden
`prefers-reduced-motion` altında uçuş yok, maskot doğrudan yerine geçiyor.

Tanışma ekranının başlığı `ADIM_BILGISI` tablosunda **yok**, `tanismaBasligi`
kuruyor: içinde kullanıcının adı geçiyor ve ad boş bırakılabiliyor. Adsızken
virgül de düşüyor — "Seni tanıdığıma memnun oldum," diye biten bir cümle, adı
yazmayı unutmuş gibi duruyordu.

Son adımın düğmesi bu yüzden "Başlayalım" değil **"Hazırım"**: aynı akışta iki
kez "Başlayalım" yazan düğme, kullanıcıya başa döndüğünü düşündürüyordu.

**Tanışma ekranının tek süsü bir hat.** Ekran bir süre sekiz emojiyi (🐾 ✨ 🥕
…) zemine serpiyordu; hepsi kaldırıldı. Sebep hareket değil kalabalık: ekranda
tek bir cümle var — adın geri söylendiği cümle — ve etrafına serpilen simgeler
o cümleyi taşımıyor, ondan dikkat çalıyordu.

Yerine adın altına çekilen tek bir kalem hattı kondu (`tanisma-hat`,
`globals.css`). Çizilerek beliriyor ve **bitiyor**: sürekli oynayan bir süs göz
ucunda kalıcı bir kıpırtı bırakır, bir kez çizilen hat cümleyi gösterip susar.
Çizim `stroke-dasharray` ile — kesik deseni yolun gerçek uzunluğundan uzun
tutuldu, kısa kalsaydı hat tek parça yerine tekrarlayan kesikler olurdu.
Gecikmesi de kasıtlı: altını çizdiği yazıdan önce belirirse neyi işaret ettiği
anlaşılmıyor. `prefers-reduced-motion` altında hat duruyor, çizilmesi susuyor.

Yeni bir süs eklemeden önce soru şu: eklenen şey adı öne mi çıkarıyor, yoksa
onunla mı yarışıyor?

**Zemin ayrı değil.** Ekran bir süre degrade bir zemin, altın halkalı bir
madalyon ve "Aramıza hoş geldin" rozeti taşıyordu; üçü de kaldırıldı ve
`--kutlama-*` renkleri silindi. Ekranın tek işi adı geri söylemek ve o
katmanların her biri o cümleyi bastırıyordu. Maskot da karşılamadakiyle **aynı
ölçüde** (150): iki ekran arka arkaya geliyor, tavşanın ekrandan ekrana büyüyüp
küçülmesi geçişi kesiyordu.

Alttaki üç nokta kurulumun soru sormayan üç ekranını sayıyor ve **sonuncusu**
dolu. Tasarımda ilk nokta doluydu; bu ekran üçüncü sırada olduğu için "1/3"
diyen bir gösterge kullanıcıya yolun daha yeni başladığını söylerdi. Bu üç
nokta, soru adımlarının `noktaAdimlari` şeridiyle karışmasın: ikisi ayrı
şeyler sayıyor ve aynı anda hiç görünmüyorlar.

**Maskotun pozu.** Tanışma ekranında tavşan el sallıyor
(`poz="el-sallayan"`); karşılamadaki duran yüzle aynı görsel olsaydı ekran
ileri gitmiş gibi durmazdı. Pozların kendisi için aşağıdaki
**Maskotun pozları** bölümüne bak.

Tasarımda maskotun sağ üstünde ayrıca bir 👋 duruyordu; alınmadı — maskot
zaten el sallıyor ve iki el aynı anda iki selam gibi okunuyordu.

### Ayarlar satırları kapalı açılıyor

Seçenek çipleri satırın altında sürekli açık dururken ekran üç ekran boyundaydı.
Şimdi satır kapalı: solda ad, sağda seçili değer, uçta ok. Tek satır açık kalıyor
(`acikAyar`), ikincisini açmak birincisini kapatıyor. Anahtarlı satırlar
(hatırlatma, müzik) açılamaz: satıra dokunmak anahtarı çeviriyor, aynı satır hem
anahtar hem liste olamaz — hatırlatma saati o yüzden **ayrı** bir satır.

### Ayarlarda şablon yok

"Varsayılan deneme türü" ve "Deneme şablonları" satırları kaldırıldı: ayarlar
ekranının yarısı bir şablon düzenleyicisiydi (ders ekle/çıkar, soru sayısı,
yanlış katsayısı, kopyala, sil) ve o düzenleyici bir ayardan çok kendi başına
bir ekrandı.

Şablonların kendisi duruyor (`lib/sablonlar.ts`): hazır TYT/AYT/YDT şablonları
yeni deneme ekranında hâlâ seçiliyor ve kullanıcının kayıtlı şablonları
yedeğe girmeye devam ediyor — kayıt silinmedi, yalnızca düzenleme kapısı kapandı.
`ayarlar.varsayilanSablonId` de kayıtta duruyor; yeni deneme onu okumaya devam
ediyor, artık ayarlardan değiştirilmiyor.

### Pomodoro'da sınav provası

Süreler kartındaki **Deneme provası** çipleri turu ÖSYM'nin süresine
çeviriyor: TYT 165, AYT 180, YDT 120 dakika (`lib/sinav-provasi.ts`). Amaç
denemeyi uygulamanın içinde çözdürmek değil, kâğıdı çözerken süreyi buradan
tutturmak — öğrenci zaten telefonun kronometresini açıyordu ve o süre hiçbir
yere yazılmıyordu.

Prova **aşama değil ayrı bir kip**. `Asama`ya dördüncü bir değer olarak
eklenseydi `sonrakiAsama` her provanın arkasına mola koyardı; 165 dakikanın
sonunda beş dakikalık kısa mola vermek provayı prova olmaktan çıkarır. Seçili
provada:

- Süre `ayar.calisma` değil provanın süresi, o yüzden **çalışma ve mola
  satırları çizilmiyor** — kilitli bir kutu, kullanılıyormuş izlenimi verir.
  Ayarlar kaybolmuyor, prova kapatılınca aynı değerlerle geri geliyor.
- Ders çipleri yok: seans `PROVA_DERSI` ("Deneme Çözümü") ile kaydediliyor.
  Ad uydurulmadı — istatistik seansları ders adına göre topluyor ve listede
  (`CALISMA_DERSLERI`) olmayan bir ad orada tek başına bir dilim olurdu.
- Tur sayacı ilerlemiyor, arkasından mola gelmiyor; sayaç dolunca sıradan
  çalışma turuna dönüyor. Dönmeseydi bir sonraki "Başlat" yeniden 165 dakika
  verirdi.
- Yarıda "atla"mak provadan çıkmak demek ve seans **yazılmıyor** — sayaç
  dolmadı. Oyunlardaki "yarım tur da bir tur" kuralının tersi: orada kayıt
  bankaya düşüyor, burada ölçülen şey sürenin kendisi.

**Prova ekranın kipi, Süreler'in bir satırı değil.** Bir süre sayacın
üstünde kendi kartındaydı, sonra Süreler kartının ilk satırı oldu; şimdi
başlığın altındaki **kip anahtarı** (Pomodoro · Deneme provası,
`tasarim/pomodoro-2a.html`). Prova seçmek çalışma/mola sürelerinin **yerine**
ÖSYM'nin süresini koymak demek ve o karar sürelerin bir satırı gibi değil
ekranın hâli gibi duruyor: kip değişince sayacın altındaki soru da değişiyor
("Hangi derse?" → "Hangi denemeyi çözüyorsun?"). Provaya geçmek TYT'yi
seçiyor — boş bir prova kipi yok, kitapçık seçilmeden sayacın süresi de yok.
Süreler satırı provada çizilmiyor; ayarlar kaybolmuyor, Pomodoro'ya dönünce
aynı değerlerle geri geliyor.

Prova çiplerinin altındaki açıklama yok: soru ve dakika sayısı sayacın
altında yazıyor ve mola olmadığı zaten tur noktalarının gizlenmesinden
görülüyor.

### Başlat'a basınca sayaç tam ekrana çıkıyor

Sayaç ayarların arasında bir karttı; tur boyunca ekranda Süreler, Ses ve alt
menü de duruyordu. Şimdi Başlat, sayacı tam ekran bir **sahneye**
(`CalismaSahnesi`) çıkarıyor: üstte tur ve aşama, ortada ders adı, büyük
halka ve bitiş saati, altta üç düğme (turu bitir · duraklat/devam · atla).
Alt menü ve ayarlar arkada kalıyor — turun içindeyken yapılacak tek iş sayaç.
Katman `tam-katman-girisi` ile geliyor ve geri tuşu (donanım dahil) turu
**bitirmiyor**: sahneyi kapatıp turu duraklatıyor; hazırlık ekranı kalan
süreyi ve "Devam et"i gösteriyor, oradan basınca sahne aynı yerden açılıyor.

Sahne `calisiyor`dan ayrı bir state (`sahne`): duraklatmak sahneyi kapatmıyor
ve aşama bitince de açık kalıyor — mola sahnedeki Başlat ile başlıyor.
Kapatan üç şey var: geri oku, "Turu bitir" ve provadan çıkış (bitmesi ya da
atlanması; "prova bitti" notu hazırlık ekranında).

Sahnenin altında bir süre "Ekran kapalıyken de sayıyor · alt menü kapandı"
yazıyordu; kaldırıldı — kullanıcı istedi, sayaç kendini açıklamak zorunda
değil.

Hazırlık ekranında süre, prova ve kip **tur içinde** (`turIcinde`, yani
duraklatılmış tur dahil) kilitli: başlamış bir turun uzunluğu değişmemeli.
Süreler bir çekmecede (`Cekmece`, alttan açılır), ders listesinin tamamı da
öyle: hazırlıkta yalnızca üç ders ve "Diğer" var, bütün çipler sayacın altında
birkaç satır kaplayıp Başlat'ı aşağı itiyordu. "Çalışırken ekran açık kalsın"
anahtarı çekmecede değil ayar kartının kendi satırında ve her iki kipte de
duruyor: provada da geçerli ve çekmeceye konsaydı prova kipinde ona hiç
ulaşılamazdı. Tur içinde ona da ulaşılmıyor (sahne her şeyi örtüyor); sonraki
turda geçerli oluyor.

Başlat düğmesi sayfanın dibine **yapışık** (`sticky`, alt menünün hemen
üstünde): ayarlar uzadıkça düğme kaydırmanın sonuna gitmesin.

Soru sayıları elle yazılmıyor, `OSYM_TEST_SORU`dan toplanıyor: aynı sayı
`sablonlar.ts`te zaten duruyor ve iki yere yazılan bir sayı dağılım
değiştiğinde birinde eski kalırdı. Süreler ise elle yazılı — ÖSYM'nin kararı,
soru sayısından türetilemez.

### Oyunda müzik yok

Mini oyunların arka plan müziği **kaldırıldı**: `mod-muzigi.ts`,
`oyun-muzigi.ts` ve tur sonunu müziğe haber veren `tur-durumu.ts` silindi,
Ayarlar'daki "Mini oyun müziği" anahtarı da gitti. Soru okurken arkada müzik
dikkati dağıtıyordu ve kullanıcılar kapatıyordu. Efektler (`oyun-sesi.ts`)
duruyor: doğru/yanlış geri bildirimi müzik değil, "Mini oyun sesleri" anahtarı
onları yönetiyor. Aylık özetin sesi de artık o anahtara bakıyor.

`Ayarlar.oyunMuzigi` ve `Ayarlar.oyunMuzikTuru` kayıtta ve yedekte duruyor
ama hiçbir yerden okunmuyor; alanları silmek eski yedekleri geçersiz kılardı
(`varsayilanSablonId` ile aynı gerekçe). Lo-fi çalarının kendisi duruyor:
aşağıdaki ses paneli **Pomodoro'nun** paneli ve orada seçim hâlâ anlamlı.

### Müzik seçilmeden önce dinleniyor

Ses panelindeki on iki lo-fi parçanın arasından "Glow on the Overpass"i **ada
bakarak** seçmek seçim değil kura. Dinlemenin tek yolu parçayı seçip turu
başlatmaktı ve beğenilmeyen parça, başlamış bir turun ortasında değiştiriliyordu.

Her satırın kendi önizleme düğmesi var: üçgene dokunmak dinletiyor, ada dokunmak
seçiyor. İki ayrı iş, iki ayrı dokunuş hedefi — çip bulutu bu yüzden satır
listesine döndü, iç içe düğme yazılamıyor.

Dinlemek seçmek değil: `onizlenen` seçimden ayrı bir state ve panel üç parçayı
dinleyip hiçbirini seçmeden kapatılabiliyor. Dinlenen parçayı seçili saymak,
kararı kullanıcının yerine vermek olurdu.

Çalar tek (`SesCalar`) ve önizleme onu **ödünç alıyor**: iki ses kaynağı üst üste
binseydi önizlenen parça çalmakta olanın üstüne karışırdı. Tur sürerken bir
başka parçayı dinlemek çalanı susturuyor, önizleme bitince seçili parça geri
geliyor — bunu `onizle`nin `onBitti` geri çağrısı yapıyor.

Önizleme yirmi saniye sonra kendiliğinden bitiyor: sonu gelmeyen bir önizleme,
önizleme değil çalan müzik. Sonunda kesilmiyor **kısılıyor** (`kis`) — mp3'ün
ortasında aniden kesilen ses, parçanın değil uygulamanın bozuk olduğunu
düşündürüyor.

### Sayaç kilit ekranında da duruyor

Turun büyük kısmı telefona bakılmadan geçiyor ve "kaç dakika kaldı"yı öğrenmenin
tek yolu uygulamayı açmaktı — tam da açılmaması gereken şey. Sayaç artık bir
bildirim olarak kilit ekranında duruyor: maskot, aşama + ders, büyük geri sayım,
ilerleme çubuğu ve iki düğme (**Duraklat/Devam et**, **Turu bitir**).

Bildirimi çizen yer ön plan servisi (`OdakServisi`). Sınıfın adı odak
kilidinden kalma ve öyle kalıyor — kimliği değiştirmek manifest'i, eklentiyi ve
`PomodoroKapanis`i birden dokundururdu — ama işi tersine döndü: bildirim eskiden
servisin **bedeliydi** (sistem ön plan servisinden kalıcı bildirim istiyor),
şimdi varlık sebebi. Servis bu yüzden **her turda** kuruluyor; kilit ve Rahatsız
Etme üstüne binen iki seçenek. Eskiden ikisi de kapalıyken servis hiç kurulmuyordu
ve odak kilidini açmamış kullanıcı — yani çoğunluk — sayacı hiç görmüyordu.

Molada da yaşıyor: molanın da bir sayacı var. Engelleme molada devreye girmiyor,
o karar web tarafında — servise boş liste ve kapalı susturma geçiliyor.

Dört incelik:

- **Düzen özel, çerçeve sistemin** (`DecoratedCustomViewStyle`). Uygulama adı,
  saat ve düğmeler sistemin çizimi; ortadaki içerik bizim. Tümüyle özel bir
  bildirim her üreticinin gölgesinde başka türlü duruyor ve düğmeleri de elle
  çizmek gerekiyordu.
- **Renkler tema değişkenlerinden gelmiyor, gelemiyor.** Bildirim uygulamanın
  içinde değil sistemin gölgesinde çiziliyor ve o zemin telefonun gece moduna
  göre açık ya da koyu. Yazılar bu yüzden `?android:attr/textColorPrimary`,
  vurgu da iki zeminde birden okunan ayrı bir ton (`bildirim_amber`,
  `marka_amber`den bir tık açık). Katmanın renkleri burada kullanılamaz.
- **Sayacın iki kopyası var** — biri serviste, biri web'de — ve bildirimin
  düğmesi yalnızca ilkine dokunuyor. Komut `pomodoroKomutu` olayıyla web'e
  geçiyor; geçmeseydi uygulamaya dönen kullanıcı, bildirimden duraklattığı turu
  hâlâ işlerken bulurdu. `devam` komutu yeni **bitiş zamanını** da taşıyor:
  web'deki sayaç mutlak zaman damgasından okunuyor (`lib/pomodoro.ts`), "devam
  ettim" demek yetmiyor.
- **Duraklatmak servisi durdurmuyor**, donduruyor (`odakKilidiniDuraklat`).
  Durdurulsaydı bildirim ekrandan kalkar ve duraklatılmış tur kilit ekranında
  hiç var olmamış gibi görünürdü. Turdan gerçekten çıkan yollar (sıfırla, atla,
  aşama sonu) `odakKilidiniBitir` çağırıyor.

Uygulamanın kendi Devam düğmesinin ayrı bir yerli karşılığı **yok**: Başlat
servisi `baslat` ile baştan kuruyor ve o zaten duraklamayı sıfırlıyor. Devam
yalnızca bildirimin kendi düğmesinden geliyor.

İzin turu başlatırken isteniyor (`izinIste`), Ayarlar'daki bildirim anahtarına
bağlanmadan: Android 13'ten beri POST_NOTIFICATIONS olmadan ön plan servisinin
bildirimi de gösterilmiyor, yani izinsiz kullanıcıda özellik sessizce yok. O
anahtar "seans bitince haber ver" demek; buradaki bildirim sayacın kendisi ve
anahtar kapalıyken de gerekiyor.

### Odak kilidi yalnızca Pomodoro'da

Odak kilidi ve Rahatsız Etme anahtarları bir süre **iki yerde** duruyordu: hem
Ayarlar'da hem Pomodoro'nun tepesinde. İki kopya zamanla birbirinden ayrıldı
(biri uygulama listesini açıyordu, öteki açmıyordu). Ayarlar'daki kaldırıldı;
ikisi de yalnızca çalışma turu boyunca yaşıyor ve turdan bağımsız bir anlamları
yok — Ayarlar'dan açılan bir koruma, turu başlatan ekranda hiç görünmüyordu.

Tek yerleri artık Pomodoro'daki **"Odak koruması"** satırı; içeriği
`components/odak/odak-ayarlari.tsx`, iki ekran arasında paylaşılmıyor çünkü
ikinci ekran kalmadı. Satır **kapalı** başlıyor ve açık korumaları altında
yazıyor: sayaç ekranın asıl işi, iki anahtar sürekli açık dururken sayacı aşağı
itiyorlardı. Satır sayacın **altındaki** ayar kartında (Süreler ve Ses ile
yan yana) ama hâlâ hazırlık ekranında, sahnede değil, çünkü gerekçe
değişmedi — karar her turda değişiyor ve turu başlatmadan önce görülmeyen bir
ayar, o turda yanlış kurulmuş bir ayardır.

Anahtarın kilidi doğrudan açmadığı kural duruyor: önce davet penceresi
(`odak-daveti.tsx`), kilit ancak "İstiyorum" denince açılıyor ve izin ekranı
yalnızca adı yazılı düğmeye basılınca gidiyor.

### Engel katmanı uygulamanın devamı gibi görünüyor

Odak kilidi sırasında yasaklı bir uygulama öne gelince üstüne konan tam ekran
katman (`android/.../EngelKatmani.kt`, `res/layout/engel_katmani.xml`) yerli
Android düzeni — WebView değil, çünkü uygulamanın kendisi o an ekranda yok.
Buna rağmen uygulamanın diliyle konuşuyor:

- **Maskot emoji değil, uygulamanın kendi görseli.** Katman bir süre 🐰
  yazıyordu; sistem yazı tipinden gelen emoji telefondan telefona başka
  çiziliyor ve kullanıcının tanıdığı tavşandan başka bir tavşan çıkıyordu.
  Artık `res/drawable-nodpi/tavsan_yuz.png` — `public/tavsan-yuz.png`in
  kopyası. Görseli değiştirirsen **ikisini birden** değiştir; yerli taraf
  `public/` altını okuyamıyor.
- **Renkler `values/colors.xml`den**, doğrudan yazılmıyor, ve
  `values-night/` karşılıkları birebir aynı — Rabi'nin koyu teması yok,
  o dosya sistemin gece modunda kaynakları kendi varsayılanlarına
  düşürmesini engelliyor.
- **Kalan süre ekranın en büyük ögesi** ve altında bir çubuk var. Sayı "ne
  kadar kaldı", çubuk "ne kadarı geçti" diyor; ikisi ayrı sorular ve turun
  ortasında mı sonunda mı olunduğunu sayıya bakıp hesaplamak gerekiyordu.
  Çubuğun toplamı web tarafından geçmiyor, servis kurulurken damgalanıyor
  (`OdakServisi.baslangicZamani`): kilit turla birlikte başlıyor ve
  duraklat/devam et her seferinde yeni bir bitişle servisi yeniden kuruyor,
  yani çubuk her zaman içinde bulunulan kesintisiz parçayı ölçüyor. Toplam
  bilinmiyorsa çubuk **boş** kalıyor — uydurma bir doluluk, sayı doğruyu
  söylerken yanlış bir yer gösterirdi.
- **Çip hep duruyor.** Ders biliniyorsa adını yazıyor ("MATEMATİK", Türkçe
  yerelle büyütülüyor — varsayılan yerelde i noktasız İ oluyor), bilinmiyorsa
  "DERS MODU AÇIK". Gizlenseydi ekranın tepesi bir satır boşalır, maskot
  yukarı kayardı.

Onay ekranı (`odak_onay`) ayrı duruyor: kilidi kapatmanın bedeli var — tur
iptal olur, seri kırılır. Bedeli olmayan engel engel değildir.

### Katman iki üç saniye geç geliyordu

Yasaklı uygulama açılıyor, kullanıcı ekranı görüyor, engel ondan sonra
düşüyordu. Gecikme iki parçadan oluşuyor ve yalnızca biri elimizde:

- **Döngünün beklediği süre.** Öne gelen uygulama bir buçuk saniyede bir
  sorulanıyordu; `ARALIK_MS` üçte birine indi (350 ms). Sorgunun kendisi ucuz
  (son birkaç saniyenin olay listesi) ama bedava değil, o yüzden bu sıklıkta
  yalnızca engellenecek uygulama varken dönülüyor — sayaç bildirimi için
  saniyede bir yetiyor (`BILDIRIM_ARALIGI_MS`).
- **Katmanın kurulma süresi.** Düzen her gösterimde baştan şişiriliyordu.
  Artık servis ayağa kalkarken bir kez şişiriliyor (`EngelKatmani.hazirla`) ve
  gösterim anında geriye yalnızca `addView` kalıyor. Bunun bedeli görünümün
  gösterimler arasında yaşaması: düğmelerin dinleyicileri bu yüzden `duzenKur`
  içinde bağlanıyor, `goster` içinde değil — her gösterimde yeniden bağlanan
  bir dinleyici aynı düğmeye üst üste binerdi. `goster` yalnızca ders çipini ve
  ana/onay görünürlüğünü tazeliyor, çünkü ikisi de tur içinde değişebiliyor.

Üçüncü parça kullanım olayının sisteme düşme gecikmesi ve o elimizde değil.

### Arkadan gelen ses ve mini oynatıcı

Kullanıcı bir video açıp Rabi'ye dönüyor ve turu başlatıyordu: yasaklı uygulama
artık **önde değil** — ana ekranda ya da mini oynatıcıda — yani öne gelen
uygulamayı izleyen döngü onu hiç görmüyor, ses tur boyunca arkadan gelmeye devam
ediyordu.

Çözüm ses odağı: servis `AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE` alıyor ve **tur
bitene kadar bırakmıyor**. Odağı kaybeden oynatıcı duraklıyor ve odak geri
verilene kadar kendiliğinden devam edemiyor; bırakılsaydı video kaldığı yerden
sürerdi. Rabi'nin kendi lo-fi'ı bundan etkilenmiyor — odak uygulama başına
veriliyor ve WebView onu kendi adına yeniden isteyince yasaklı uygulama değil
biz alıyoruz.

Odak iki yerde alınıyor ve ikisi de **koşullu**:

- Tur başlarken, yalnızca son bir dakika içinde yasaklı bir uygulama önde
  olduysa **ve** o an bir şey çalıyorsa (`baslarkenCalaniSustur`). İki koşul
  birden şart: `isMusicActive` hangi uygulamanın çaldığını söylemiyor ve tek
  başına bakılsaydı engellenmemiş bir çalar — öğrencinin kendi çalışma müziği —
  boş yere susturulurdu.
- Tur içinde, yasaklı uygulama bir kez öne geldiğinde. Katman ekrandan
  çekildikten sonra da uygulama arka planda çalmaya devam edebiliyor.

**Mini oynatıcının penceresi kapatılamıyor.** Sesi kesiliyor ama küçük pencere
ekranda kalabiliyor: pencere sistemin elinde ve sıradan bir uygulamanın onu
kaldırmasının yolu yok (erişilebilirlik API'si Play politikası yüzünden zaten
kullanılmıyor, bkz. manifest). Şikâyet edilen şey sesti ve o çözüldü; pencerenin
kendisi için yeni bir fikir gerekiyor.

### Play Store engelin yan kapısıydı

Oyunları engelleyen öğrenci aynı oyunu mağazanın "Aç" düğmesinden
başlatabiliyordu; üstelik mağaza kendi başına bir keşif akışı — engellenenin
yerine yenisi bir dokunuş uzakta. `com.android.vending` ve Play Games artık
manifest'teki `<queries>` listesinde adıyla yazılı: MAIN/LAUNCHER sorgusu bu
paketleri görüyor olmalı ama bazı cihazlarda mağazanın başlatıcı etkinliği o
sorgudan dönmüyor ve uygulama listede hiç çıkmıyordu.

Öneri listesinde de duruyorlar (`ONERILENLER`) ama **zorunlu değiller**: kutu
işaretli geliyor, kullanıcı kaldırabiliyor. Mağaza sosyal medya değil ve tur
sırasında ders uygulaması kuran öğrenci var.

### Uygulama ikonu üretiliyor, elle çizilmiyor

İkonun tek kaynağı `scripts/ikon-uret.mjs`; `public/icon-*.png` ile
`android/.../mipmap-*` altındaki bütün PNG'ler oradan çıkıyor. Üretilen dosyalar
depoya giriyor (Capacitor `cap sync` sırasında silmiyor) ama **elle
düzenlenmemeli** — ikon değişecekse betikteki sayılar düzeltilip betik yeniden
çalıştırılmalı.

**Maskot artık çizilmiyor, uygulamanınki kullanılıyor.** Eski betik
(`ikon-uret.sh` + `assets/icon-*.svg`) tavşanı elle yazılmış elipslerden
kuruyordu ve uygulamanın kendi tavşanına benzemiyordu: ikondaki yüz ile açılış
ekranındaki yüz iki ayrı tavşandı. Üstelik ikisi ayrı ayrı güncelleniyordu —
uygulama amber temaya geçtiğinde `public/icon.svg` düzeltildi, Android ikonları
mor (#6D3FE0) kaldı ve kimse fark etmedi. Artık hepsi `public/tavsan-yuz.png`
kullanıyor.

Bedeli: kaynak saf vektör değil, o yüzden `rsvg-convert` + ImageMagick yerine
`sharp` ile üretiliyor. `sharp` bu yüzden `devDependencies`e yazıldı; Next'in
bağımlılığı olarak zaten kuruluydu ama betiğin ona dolaylı yoldan güvenmesi,
Next bir gün bırakınca sessizce bozulmak demekti.

Ölçüler (degrade, üst soldaki açık daire, köşe eğrisi, maskotun yeri) tasarımın
verdiği 179 piksellik ikondan ölçüldü ve hepsi kenar uzunluğuna **oran** olarak
yazılı: aynı geometri 48 pikselden 512 piksele kadar her yoğunlukta ve ayrıca
Android'in 108 birimlik uyarlanabilir tuvalinde yeniden kuruluyor. Köşe daire
değil "squircle"; eğri ölçülen ikona oturtuldu.

**`public/icon.svg` silindi.** Maskot bir PNG olduğu için SVG sürümü de onu
base64 gömmek zorundaydı: 107 KB'lık, içi tek bir rasterden ibaret bir "vektör".
PNG'lerin üstüne hiçbir şey katmıyordu.

**Maskelenebilir ikon ayrı dosya** (`icon-maskelenebilir-512.png`): köşeleri
yuvarlatılmamış, zemin kenara kadar sürüyor ve ikon karesi ortadaki %80'e
oturuyor. Yuvarlatılmış olan verilseydi işletim sistemi kendi maskesini
uygularken köşelerde saydam boşluk kalırdı.

**Uyarlanabilir ikonun zemini artık düz renk değil** bir PNG
(`mipmap-*/ic_launcher_background.png`), çünkü yeni ikonun zemini degrade.
`values/ic_launcher_background.xml` bu yüzden silindi.


## Yanlış soru, deneme formunun içinden ekleniyor

Yeni deneme ekranında Kaydet'in hemen üstünde **"Yanlış soru ekle"** düğmesi
var ve açtığı şey tam ekran bir **katman**, ayrı bir ekran değil.

Sebep girilen netler: ekran `AppShell` içindeki `denemeFormu` state'ine bağlı
ve başka bir ekrana geçmek onu söküyor. Yanlış Soru Bankası'na gidip dönen
kullanıcı, sekiz dersin doğru/yanlışını yazdıktan sonra boş bir form buluyordu.
Katman üstte açılıyor, form altında olduğu gibi duruyor.

Düğmenin yeri de bundan: yanlışlar kâğıttan tam da sayılar yazılırken
çekiliyor ve kaydettikten sonra ekran kapandığı için "sonra eklerim" pratikte
"hiç eklemem" oluyordu.

Fotoğraf alma ve kaydetme mantığı iki ekranda **paylaşılıyor**
(`components/yanlis-soru-ekle.tsx`: `useYanlisSoruEkleme`, `EklemeFormu`,
`FotografDugmeleri`). Kopyalansaydı iki ekran zamanla ayrışırdı — biri
fotoğrafı küçültürken ötekinin küçültmemesi gibi. Kayıt tek yoldan gidiyor:
önce blob IndexedDB'ye, sonra liste kaydı; ters sırada yazma başarısız olsa
galeride görüntüsü olmayan bir kart kalırdı.

Katman kayıttan sonra kapanıyor: asıl iş deneme formuna dönmek, art arda çekim
isteyen kullanıcı düğmeye yeniden basıyor.

### Ders seçiliyor, yazılmıyor

Ekleme formundaki ders alanı serbest metindi (önerili); "matematik", "Mat",
"mat." aynı dersin üç ayrı süzgeç çipi oluyordu. Artık on çipten biri
seçiliyor (`YANLIS_SORU_DERSLERI`, `lib/dersler.ts`) ve Kaydet ancak bir
ders seçilince açılıyor. Liste `CALISMA_DERSLERI`den **ayrı**: o liste soru
takibi ve Pomodoro'nun ve seans türlerini ("Tekrar") de taşıyor. Türkçe ile
Edebiyat tek ders (Türk Dili ve Edebiyatı), Geometri yok (Matematik'in
içinde), diller tek "Yabancı Dil"; uymayan her şey "Diğer". Eski kayıtlardaki
adlar yeniden adlandırılmıyor — süzgeç ve renk onları da tanıyor.

Konu 30, not 60 harfle sınırlı (`YANLIS_SORU_KONU_SINIRI`,
`YANLIS_SORU_NOT_SINIRI`): ikisi de küçük karede ve görüntüleyicinin
başlığında tek satırda duruyor. Alanın altında sayaç var, sınır sessizce
kesmesin; yapıştırılan metin `maxLength`i aşabildiği için kayıtta da
kırpılıyor.

## Yanlış sorunun fotoğrafına çiziliyor

Görüntüleyicide alttaki düğmelerin üstünde yuvarlak bir **kalem** düğmesi var
(yazısız; adı ekran okuyucuya `aria-label` ile söyleniyor); basınca
Çözdüm, çöp ve atla düğmeleri kalkıyor, yerlerine yalnızca araç çubuğu
geliyor (kalem, silgi, el, kalınlık, yakınlaştırma, geri al, temizle, dört
renk). Vazgeç/Kaydet araç çubuğunun **hemen üstünde**, yan yana ve tam
genişlikte iki dikdörtgen düğme; bir süre üst köşede küçük düğmelerdi ve
başparmaktan uzaktı (`components/soru-cizimi.tsx`, hesaplar `lib/cizim.ts`).

- **Yalnızca fotoğrafın üstüne.** Tuval ekranı kaplamıyor, fotoğrafın
  `object-contain` kutusu hesaplanıp (`fotografKutusu`) tam oraya oturuyor;
  altındaki ve üstündeki siyah boşluk yüzeyin dışında. Dışarı taşan nokta
  kenara **kısılmıyor** — kısılsaydı fotoğraftan çıkan parmak kenar boyunca
  bir çizgi sürüklerdi; taşan parçayı tuval kendisi kesiyor.
- **Fotoğrafa dokunulmuyor.** Çizim ayrı bir saydam PNG, aynı IndexedDB
  deposunda `cizimAnahtari(resimId)` altında. Kayda alan eklenmedi: eski
  yedekler ve kayıt doğrulaması olduğu gibi çalışıyor. Öksüz temizliği,
  silme ve yedek bu anahtarı da biliyor — yeni bir yere fotoğraf kimliği
  listesi yazarsan çizimi de ekle, yoksa öksüz sayılıp silinir.
- **Çizgiler oran olarak tutuluyor**, kalınlık da genişliğin oranı; kayıt
  fotoğrafın asıl çözünürlüğünde (uzun kenar en fazla 1600) yeniden
  kuruluyor. Çizim fotoğrafla aynı en-boy oranında olduğu için küçük karede
  `object-cover` ikisini aynı yerden kırpıyor.
- **Kalınlık tek düğme + dikey çubuk**, üç sabit seçenek değil: ince bir
  cevap yazısı ile kalın bir altı çizme arasında üç basamak yetmiyordu. Çubuk
  karesel (ince uçta hassas). `<input type="range">` değil, elle yazılı:
  dikey sürgü WebView sürümüne göre ya yatay kalıyor ya ters çalışıyordu.
  Kalem ve silginin kalınlığı ayrı tutuluyor.
- **Yakınlaştırma kutuyu büyütmüyor**, fotoğrafı kutunun içinde büyütüyor
  (%100–%400). Seçimi kalınlıkla **aynı dikey çubuk** (`DikeyCubuk`): bir
  süre +/− basamaklarıydı; iki araç aynı biçimde durunca ikincisi
  öğretilmeden anlaşılıyor. Çubuk logaritmik (ortası iki kat) ve dibe yakın
  bırakılan değer tam %100'e oturuyor. Kutu `overflow: hidden`, siyah boşluk yine çizilemiyor.
  Tek parmak çizdiği için fotoğrafı gezdirmenin ayrı bir aracı var (**el**,
  yalnızca yakınlaştırılmışken açık, zoom düğmesinin hemen yanında — ikisi
  aynı işin iki yarısı). Kalınlık ekrandaki boy: yakınken
  çizilen çizgi fotoğrafa göre o oranda ince kaydediliyor
  (`cizgiKalinligi`) — yakınlaştırmanın sebebi ince iş. Çizimden çıkınca
  fotoğraf yeniden sığdırılıyor.
- **Silginin halkası.** Silgi seçiliyken parmağın/imlecin altında Paint'teki
  gibi beyaz bir halka duruyor, çapı silginin ekrandaki genişliği. Silgi
  saydam iz bıraktığı için basmadan ne kadar yer götüreceği görünmüyordu.
  Halka ölçeklenen katmanın dışında (yakınlaştırmada kalınlaşmasın) ve
  konumu state'e değil öğenin stiline yazılıyor — her harekette yeniden
  çizim, çizerken takılmak demekti.
- **Geri tuşu kaydediyor**, atmıyor: yanlışlıkla basılan geri çizilen her
  şeyi sessizce silerdi. Atmanın yolu Vazgeç. Çizerken kapatma düğmesi yok.

## Soru Takibi bir günlük telafi kabul ediyor

Soru Takibi'nde bugün ve yalnızca bir önceki gün düzenlenebilir. Daha eski
günler geçmişi incelemek için seçilebilir fakat salt okunur kalır; gelecek
günler seçilemez. Önceki gün `gunKaydir(bugunIso, -1)` ile yerel takvimden
hesaplanır; böylece ay, yıl ve artık yıl sınırlarında da aynı kural geçerlidir.

## Aylık özet ayın 1'inde, yalnızca o gün

Özet (`components/ekranlar/aylik-ozet.tsx`, hesabı `lib/ozet.ts`, afişi
`lib/ozet-gorsel.ts`, tasarımı `tasarim/aylik-ozet.dc.html`) Araçlar
listesinde **yok** ve olmayacak: aranıp açılan bir araç değil, ayda bir
kendiliğinden gelen bir kapanış. Bir süre **haftalıktı** ve kurulum gününe
yaslı yedi günlük dönemlerle geliyordu; aylığa çevrildi — haftada bir gelen
hikâye kendini tekrar ediyordu ve yedi günün sayısı tek bir kötü günle
bozuluyordu. Ay takvim ayı, kuruluma yaslanmıyor: "Eylül özeti" herkes için
aynı şey ve ileride yıllık özet bu kayıtları ay ay toplayacak.

### Tek gün açık, kaçıran kaçırıyor

Ağustos'un özeti **yalnızca 1 Eylül'de** görülüyor (`bekleyenOzetAyi`); 2
Eylül'de kart pasife dönüyor ve o ay bir daha açılmıyor. Kullanıcının
kararı: hikâye bir kapanış ânı, haftalarca duran bir kart değil. Ana
sayfadaki kart bu yüzden **hep var**, iki hâlde:

- **Aktif** — özet bekliyor: sayfanın en üstünde, renkli (`OzetDaveti`).
  Selamlamanın altına konsaydı görülmeden kaydırılıp geçilirdi; o gün
  kaçırılınca telafisi yok.
- **Pasif** — beklemiyor: sayfanın en altında, gri, üstünde bir sonraki
  açılış günü ("1 Ekim'de açılır", `OzetBekliyor`). Kart ortada hiç
  görünmeseydi ilk çıktığında nereden geldiği anlaşılmazdı.

Kapatma düğmesi yok — kart zaten gün dönünce kalkıyor.

### Yedi etkin günden azı aylık hikâye değil

Ortak takvim korunuyor ama her kayıt özet olarak gösterilmiyor: kapanan ayda
en az **7 farklı etkin gün** varsa hikâye ayın 1'inde açılıyor
(`ozetGosterilebilirMi`). Bir gün önce kurup tek kayıt giren kullanıcıya on
sayfalık “aylık” özet göstermek, aylık olmayan veriyi aylıkmış gibi sunardı.

Etkin gün uygulamayı yalnızca açmak değil; soru, Pomodoro, mini oyun, deneme,
konu bitirme veya konu okuma kaydı bulunan gün. Yedi gün oluşmadıysa pasif kart
sebebi ve bir sonraki ortak tarihi söylüyor. Ay yine arşive yazılıyor: gösterim
eşiği yıllık toplamdan veri silmiyor, yalnızca aylık hikâyeyi bastırıyor.

### Arşiv silinmiyor

Kapanmış her ayın özeti, görülsün görülmesin, bir kez hesaplanıp
`rabi-aylik-ozetler` altında saklanıyor (`AylikOzetArsivi`,
`arsivdeEksikAylar`). Ekranda yalnızca bir gün duran hikâyenin sayıları
kalıcı: ham kayıtlar zamanla budanıyor (çözülen yanlış sorular düşüyor, oyun
geçmişi kısalıyor) ve ileride yıllık özetin dayanacağı tek yer burası.
Arşiv **yedeğe giriyor** ve geri yüklemede cihazdakiyle birleştiriliyor,
üstüne yazılmıyor. Kayıt ay kapandıktan sonra yazıldığı için bir daha ele
alınmıyor; hesap veri depodan okunmadan yazılmasın diye hazır bayrakları
bekleniyor — boş bir ay arşive geçseydi bir daha düzelmezdi.

### Okunan konu ilk bitiş gününe göre sayılıyor

Konu sayfasındaki sayı, o ay **ilk kez** bitirilen desteler.
`KonuIlerlemesi.bitisTarihi` yalnızca ilk bitişte damgalanıyor
(`ilerlemeyiYaz`), sonraki okumalar oynatmıyor; son okuma günü (`tarih`)
ayrı yaşamaya devam ediyor. Sayım bir süre `tarih`e bakıyordu ve Temmuz'da
bitirilip Ağustos'ta tekrar açılan konu Ağustos'a sayılıyordu. Alan sonradan
geldi: eski kayıtlarda yok, o konular hiçbir aya sayılmıyor — uydurma bir
gün yazmak yanlış aya yazmak olurdu.

### Konu okuma süresi arkadan ölçülüyor

Konu sayfasındaki "GEÇEN SÜRE" kutusu destede geçen süre — pomodoro ve
oyun süresi değil, onlar ayrı ölçüler. Ölçüm `KartDestesi` içinde ve
kullanıcıya **gösterilmiyor**: kart okurken akan bir kronometre okumayı
yarışa çevirirdi. Yalnızca uygulama **öndeyken** akıyor (`useUygulamaGorunur`);
ana tuşa basılınca deste açık kalıyor ve o dakikalar okuma değil. Seans
`rabi-okuma-gecmisi`ne konu + gün + saniye olarak düşüyor
(`lib/konu/okuma-suresi.ts`); konu kaydına yazılmadı çünkü orada gün tek ve
aynı konu iki ayda da okunabiliyor. Tek seans iki saatte kırpılıyor —
masada unutulan telefon özete "14 saat okudun" yazdırmasın. Yedeğe giriyor.

### Veri olmayan sayfa üretilmiyor

Sayfa sayısı sabit değil. Kapak ve kapanış her zaman var; konu, soru, deneme,
pomodoro, oyun ve ders sayfaları yalnızca o ay veri varsa üretiliyor. Üstteki
şeridin dilim sayısı da sayfa sayısından geliyor. Aynı kuralın büyüğü: hiç
veri olmayan ayda (`bosMu`) kart aktif olmuyor.

Sayfalar **kendiliğinden ilerlemiyor**, dokunarak çevriliyor (tasarım "SAĞA
DOKUN →" diyor). Haftalık özet zamanlayıcıyla akıyordu; okunacak sayı
çoğalınca beş saniye ya kısa ya uzun geliyordu.

### Ay açılınca izlendi sayılıyor

`ozetGorulen` ay anahtarlarının ('YYYY-AA') listesi ve işaret katman
**açılırken** konuyor, kapanırken değil: kapanışta işaretlenseydi uygulamayı
özet açıkken kapatan kullanıcı aynı hikâyeyi bir dahaki açılışta yeniden
bulurdu. `AppShell` açık ayı ayrı bir state'te (`ozetAcik`) tutuyor ve hesap
`ozetAcik ?? bekleyenAy` üstünden yapılıyor — yalnızca `bekleyenAy`e bağlı
olsaydı katman açıldığı karede boşalırdı.

### Renkler tema değişkenlerinden gelmiyor

Ekran kâğıt zeminli (krem, defter çizgili, çift amber çerçeve) ve renkler
bileşenin içinde yazılı. Sebep paylaşılan görsel: afiş tuvale çiziliyor ve
tuval `var(--primary)` metnini çözemiyor. Aynı renkler `ozet-gorsel.ts`
içinde de duruyor; ikisi **birlikte** değişmeli. Tek koyu sayfa ayın dersi
(kızıl zemin, altın vurgu): geri sayımın sonu, ötekilerden ayrılmalı.

Kapaktaki ay adı **Manrope** (`font-marka`): açılış ekranındaki "RABİ" ile
aynı gerekçe — tasarım o başlığı 66 pikselde Manrope ile çizdi. Üçüncü bir
yerde kullanmadan önce yukarıdaki yazı tipi istisnasına bak.

Punto ve kalınlıklar Tailwind sınıfı değil `yz()` yardımcısıyla satır içi.
CSS'in `font` kısayolu kullanılamıyor: aile adı zorunlu ve oraya `inherit`
yazmak geçersiz bir bildirim üretiyor, tarayıcı satırın tamamını atıyor.

### Afişte harf aralığı elle çiziliyor

Paylaşım afişi 1080×1920 ve büyük harfli etiketlerin hepsi aralıklı. Tuvalin
`letterSpacing`i her WebView sürümünde yok, o yüzden `aralikliYaz` harfleri
tek tek çiziyor; kutuya sığdırma da `harfAraliginaGore` ile ölçülüyor.
Etiket önce **küçülüyor**, sonra kısalıyor: kesilen etiketten geriye kutunun
ne anlattığını söylemeyen bir baş kalıyordu.

### Oyun kaydı yanlışı da tutuyor

`OyunTurKaydi.yanlis` ve `hatasiz` **isteğe bağlı**: eski kayıtlarda yoklar.
Aylık özet oyun sorusunu doğru + yanlış diye sayıyor; yanlışı olmayan eski
turda yalnızca doğru sayılıyor — uydurma bir yanlış eklemek sayıyı şişirirdi.

## Yasal metinler tek yerde — GitHub Pages'te

Gizlilik politikası, kullanıcı sözleşmesi ve "cihazından ne çıkıyor" özeti
`public/gizlilik/` altında üç HTML sayfa (`index.html`, `sozlesme.html`,
`veri-ozeti.html`) ve `.github/workflows/gizlilik.yml` ile
`https://ycistak.github.io/Rabi/` adresine yayınlanıyor. Uygulama içindeki
Gizlilik ve Koşullar ekranı (`components/ekranlar/yasal.tsx`, Ayarlar › Yasal
satırından açılıyor) metni **göstermiyor**, üç bağlantı veriyor; adresler
`lib/veri/yasal.ts` içinde.

Bir süre metinlerin uygulama içinde düz metin kopyası da vardı ve iki kopyanın
birlikte güncellenmesi gerekiyordu. Kopya kopyayı unutturuyor: sitede güncellenen
bir alan uygulamada eski kalıyor ve Play'in "içerideki metin ile mağazadaki
bağlantı aynı şeyi söylemeli" şartı sessizce bozuluyordu. Tek kaynak kaldı.

**Gizlilik politikasının adresi değişmez.** `YASAL_SITE` Play Console'da kayıtlı
ve Data Safety formundan bağlanıyor; dosya adı ya da klasör değişirse mağaza
kaydı ölü bağlantıya düşer. Yeni bir belge eklenirse yanına yeni bir HTML
gelir, `index.html` yerinden oynamaz.

Bağlantılar düz `<a target="_blank">`: Capacitor'ın WebView'i yabancı bir
adrese gidilmek istenince sayfayı içinde yüklemiyor, sistem tarayıcısına
veriyor (`Bridge.launchIntent`). `@capacitor/browser` eklemeye gerek kalmadı.

## Rozet değil başarım

Arayüzde bölümün adı **Başarımlar**: Araçlar satırı, ekran başlığı ve kutlama
penceresi böyle diyor. Kod tarafı `rozet` kalıyor — `lib/rozetler.ts`, `Ekran`
kimliği `rozetler`, depo anahtarı `rabi-rozetler` ve yedekteki `rozetler`
alanı. Kimliği değiştirmek kazanılmış rozetleri kayıtta öksüz bırakırdı; ad
yalnızca görünen yüzde değişti.

### Ekran dört özet değil bir liste

Başarımlar ekranı bir süre dört katmandı: sıradaki hedefi gösteren maskot
kartı, kademe sayacı (bronz/gümüş/altın/efsane), altı ölçülük istatistik
ızgarası ve türe göre **on sekiz** başlık altında iki sütunlu kart ızgarası.
Dört ayrı özet, hepsi aynı kırk rozeti başka bir şekilde sayıyordu; listenin
kendisi ancak üçüncü ekranda başlıyordu.

Şimdi tek sayaç (12/40 ve çubuğu), tek süzgeç (Tümü · Kazanılan · Kilitli) ve
iki bölüm var. Türe göre gruplama kalktı: on sekiz başlık, aradığı rozeti bilen
için bile uzun bir kaydırmaydı ve rozetler zaten adlarıyla kendilerini
anlatıyor. Kartlar da ızgaradan tam genişlik satıra geçti — iki sütunda ad,
açıklama, çubuk ve tarih 170 piksele sığmak zorundaydı.

**İstatistik ızgarası bilerek gitti**: en uzun seri, odak saati, deneme sayısı,
bankadan düşen, yanlış çözülen, oyun rekoru. Hiçbiri başarımla ilgili değil,
hepsi İstatistik ekranının işi. Geri koymadan önce sorulacak soru şu: bu sayı
kullanıcının hangi rozete ne kadar kaldığını mı söylüyor, yoksa başka bir
ekranın özetini burada mı tekrarlıyor?

`kademeSayimi` ve `KADEME_SIRASI` `lib/rozetler.ts`te duruyor; ekran artık
kullanmıyor ama testleri ve kutlama bildirimi kullanıyor.

**Tarih kısa yazılıyor** ("9 May"), `tarihYaz` ile değil. Uzun yazım sağ sütunu
genişletiyor ve ortadaki açıklamayı iki satıra kırıyordu. Yıl yalnızca içinde
bulunulan yıl değilse ekleniyor — tümüyle atılsaydı geçen öğretim yılında
kazanılmış rozet bu yılkiyle aynı görünürdü.

## Başarım kutlaması pencere değil, bildirim

Kutlama ekranın ortasına bir pencere açıyordu (`RozetKutlama`) ve kapatılmayı
bekliyordu. Başarım çoğu zaman bir turun ya da bir günün ortasında geliyor;
orada durmak istemeyen kullanıcıyı durduruyordu. Şimdi yukarıdan bir şerit
iniyor (`components/rozet-bildirimi.tsx`), birkaç saniye durup kendiliğinden
çekiliyor. Katman dokunuşu geçiriyor — altındaki sayfa kullanılabilir kalıyor;
kesmeyen bir bildirimin tek şartı bu. Pencere bileşeni silindi.

**Kilit açılışın kendisi.** Madalyon gri ve kilitli iniyor; kilit sarsılıp
kalkıyor, altından kademe rengi ve rozetin simgesi çıkıyor. Bildirim üç saniye
duruyor ve o üç saniyeyi dolduracak bir şey gerekiyordu — ödülü bir yazıyla
duyurmak yerine olurken göstermek. Sarsıntı açılıştan **önce** geliyor:
"denendi, açılmadı" ânı olmadan kalkan bir halka açılma gibi değil kaybolma
gibi okunuyor. Tasarım kaynağı `tasarim/basarim-bildirim.html`.

Süreler iki yerde birden yazılı ve **eşleşmeli**: `BILDIRIM_SURESI` (4820 ms)
ile `globals.css`'teki gecikmeler. Küçültülürse şerit çıkış animasyonu bitmeden
sökülür ve yerinde silinmiş gibi görünür; büyütülürse çekildikten sonra boş bir
katman ekranda kalır.

Kademe rengi **ayrı bir katman** (`rozet-yuz`) olarak açılıyor. Gri zeminden
renkli zemine geçiş bir keyframe içine yazılsaydı renkler tema
değişkenlerinden değil CSS'ten gelirdi ve `rozet-renk.ts` ile ikiye ayrılırdı.

### Aynı anda gelen rozetlerin yalnızca en değerlisi bildiriliyor

Bir eşik geçildiğinde altındakiler de birlikte geliyor: kurulumda 97 diploma
notu yazan öğrenci `diploma-85` (bronz), `diploma-90` (altın) ve `diploma-95`
(efsane) rozetlerinin üçünü birden kazanıyor. Üçünü de duyurmak aynı haberi üç
kez vermek ve en değerlisini ötekilerin arasında kaybetmek — "Diploma 95+"
aldığını bilen kullanıcıya "Diploma 85+" bir haber değil.

`bildirilecekler` (`lib/rozetler.ts`) her **türden** yalnızca en değerlisini
geçiriyor; kademe eşitse yüksek eşikli olan kazanıyor. Türler
birleştirilmiyor: aynı anda gelen bir seri rozeti ile bir diploma rozeti ayrı
iki başarı ve biri ötekinin alt basamağı değil.

Eleme yalnızca **bildirimde**. `yeniRozetler` hepsini döndürmeye devam ediyor
ve hepsi kayda giriyor — kazanılmış bir rozeti duyurmamak başka, vermemek
başka; Başarımlar ekranında üçü de duruyor.

Ekranda hep tek bildirim var. Kuyruğun sahibi `AppShell`, bileşen tek rozet
çiziyor: üst üste inen iki şerit ikisini de okunmaz yapardı. Bileşene `key`
olarak rozet kimliği veriliyor, yoksa React aynı düğümü yeniden kullanır ve
ikinci bildirim animasyonsuz, yerinde beliriyormuş gibi görünür.

## Seviye, havuç ve mağaza kaldırıldı

Uygulamada bir XP/seviye sistemi (`lib/seviye.ts`), havuç para birimi
(`lib/havuc.ts`) ve joker satan Havuç Mağazası (`lib/magaza/`) vardı; üçü de
tümüyle silindi. Geriye yalnızca eski kurulumlardaki `rabi-havuc`,
`rabi-seviye` ve `rabi-jokerler` anahtarlarının temizlenmesi kaldı
(`ESKI_ANAHTARLAR`, `lib/depo.ts`).

**Geri getirme.** Uygulamanın ölçtüğü şeylerin çoğu elle giriliyor — soru
sayısı, deneme neti, devamsızlık. Puanlanan ve harcanabilen bir para birimi,
elle girilen sayıyı bir ödülün bedeli hâline getiriyor ve kullanıcının kendi
verisini şişirmesi için sebep üretiyor. Ölçü doğruluğunu bozmayan tek ilerleme
göstergesi rozetler (`lib/rozetler.ts`): eşik geçmenin karşılığı bir rozet,
harcanabilir bir bakiye değil. Yeni bir ödül sistemi düşünüyorsan önce bu
soruyu geç: kullanıcı ödülü, veriyi uydurarak alabiliyor mu?

## Tur içi efektler

Üç efekt var ve hepsi **ortak koddan** çıkıyor: ses `lib/oyunlar/oyun-sesi.ts`,
görsel olanlar `components/oyun-kabuk.tsx` ile `app/globals.css`. Oyun
dosyalarına hiç dokunmuyorlar.

| Efekt | Ne zaman | Nerede |
| --- | --- | --- |
| Sarsıntı | yanlış cevap | kabuk + `oyun-sarsinti` |
| Süre nabzı + tek uyarı | kalan süre toplamın ¼'ünün altına inince | kabuk + `sure-nabzi` |
| Kart kalkması | bankada tike basınca | `oyun-bankasi.tsx` + `banka-kalkiyor` |
| Konfeti | yalnızca yeni rekorda | `TurSonu` + `konfeti` |

Kabuk olayları **sayaçtan türetiyor**, oyunlardan geri çağrı almıyor: `dogru`,
`yanlis` ve `kalan` zaten props olarak geliyor ve bir sayının artması "bir şey
oldu" demek. 22 oyuna kanca eklemek aynı kuralı 22 kez yazmak olurdu; böyle
yazınca yeni bir oyun hiçbir şey yapmadan efektlere kavuşuyor.

Dördüncü bir efekt vardı — boss sorusu bilinerek kapanınca patlayan bir ışık
(`boss-parlama`). Boss soruları kaldırılınca o da gitti; CSS'i, sesi
(`bossSesi`) ve tetikleyen bayrağı silindi.

**Doğru sesinin perdesi sabit.** Bir süre ardışık doğrularda kademe kademe
yükseliyordu: önce yarım ton, sonra "çok belirgin" diye çeyrek tona indirildi,
sonunda tümüyle kaldırıldı. İkisi de kulakta iyi durmadı ve sebebi kademenin
büyüklüğü değil yöntemin kendisi: perde `playbackRate` ile değişiyor, yani ses
hem tizleşiyor hem kısalıyor ve kaydedilmiş efekt kendi kimliğinden uzaklaşıyor
— kullanıcı bunu "ses bozuluyor" diye duyuyor. Seriyi ödüllendiren şey zaten
ekranda duruyor; efektin işi yalnızca "doğru" demek. Geri getirmek istersen
perdeyi oynatma, ayrı bir ses ekle.

Efekt seviyesi (`DOSYA_SEVIYESI`, 0.42) telefonda dinlenerek ayarlandı: 1'den
indi, çok gürdü. Bir zamanlar bu sayı oyun müziğiyle dengeleniyordu; müzik
kaldırıldı, efekt tek başına kaldı.

## Tur öncesi geri sayım

"Başla" ve tur sonundaki "Tekrar" turu hemen açmıyor: araya 3 · 2 · 1 · Başla
giriyor (`components/oyun-geri-sayim.tsx`, sesi `geriSayimSesi`). Düğmeye basar
basmaz ilk soru geliyordu ve süreli modlarda ilk saniye parmağı ekrana
götürmekle geçiyordu.

Katman **iki ortak bileşenin içinde** duruyor (`oyun-tanitim.tsx` ve
`TurSonu`); 18 oyun dosyasının hiçbiri geri sayımdan haberdar değil. Tur, sayım
bitince başlıyor — yani `onBasla`/`onTekrar` çağrıldığı an. Tanıtım penceresi
sayım sürerken gizleniyor ama sökülmüyor: sayımı ayrı bir katmana taşımak, onu
her oyuna ayrı ayrı eklemek demekti.

CSS süreleri (`geri-sayim-rakam`, `geri-sayim-basla`) bileşendeki `ADIM` ve
`BASLANGIC` ile eşleşmeli; animasyon adımdan uzun olursa rakamlar üst üste biner.

Katman **donuk beyaz**, rakamlar markanın dolgu tonunda
(`--primary-parlak`). Önce yarı saydam bir karartmaydı ve altındaki soru okunur
kalıyordu: göz sayımdan çok ona kaçıyordu. Sayım turun başladığı an, oyunun
üstüne düşen bir uyarı değil.

Üç rakamın tonu **aynı** (`RAKAM_TONU`); perde yalnızca sonda, "Başla!"
akorunda tırmanıyor. Rakamlarda da yükseliyordu ve kullanıcı "kötü duyuluyor"
dedi — sayımın işi metronom gibi, aynı tonun eşit aralıkla vurması sayının
indiğini zaten anlatıyor. Sayım sesi efekt dosyalarından belirgin biçimde
yüksek (`SAYIM_SEVIYESI` 0.8): oyunun ilk sesi, öncesinde duyulmuş bir şey yok
ve tek bir triangle tonu kaydedilmiş efektin gövdesini taşımıyor; 0.5'te
kullanıcı telefonda hâlâ duymadı. "Başla!" akorunun üç notası ise bunun altında
(`AKOR_SEVIYESI`) çünkü kuyrukları üst üste biniyor — üçü de sayım seviyesinde
çalsaydı çıkış 1'i aşar, akor yüksek değil **kırpılmış** duyulurdu.

## Ekranlar ve katmanlar bağlanarak geliyor

Sekme değiştirmek, bir araç açmak, bir onay penceresi çıkarmak tek bir karede
oluyordu: içerik "tak" diye yerine oturuyor, kullanıcı ekranın kurulduğunu
değil sıçradığını görüyordu. Altı ortak sınıf o anı bir hareketle bağlıyor
(`app/globals.css`): `sayfa-girisi` (sekme/araç ekranı), `katman-zemin`
(pencerelerin karartması), `pencere-girisi` (ortada açılan pencere),
`alt-pencere-girisi` (alttan gelen sayfa), `tam-katman-girisi` (tam ekran
katman), `acilir-giris` (yerinde açılan satır).

Hepsi **giriş** animasyonu, çıkış yok: gelen şeyin nereden geldiğini anlatan
bir hareket, gidenin nereye gittiğinden çok iş görüyor ve çıkış animasyonu her
çağrı yerine bir "kapanıyor" durumu eklemek demek — on ayrı katmanın hepsinde
ikinci bir state. Süreler 160–260 ms: hareketlerin hiçbiri bilgi taşımıyor,
uzun bir geçiş ikinci kez izlendiğinde beklemeye dönüşüyor.

Üç kural, üçü de bir kez düşülen tuzaktan:

- **Ekranları saran kutunun dolgusu `backwards`, `both` değil** — bütün mesele
  bu. O kutunun içinden `position: fixed` katmanlar çıkıyor; transformlu bir
  öğe onların *kapsayıcı bloğu* olur (katman ekrana değil kutuya göre
  konumlanır) ve opaklığı ya da konumu canlandıran bir öğe kendi *yığın
  bağlamını* kurar (içerideki `z-50` katman, dışarıdaki `z-40` alt menünün
  altında kalır). İkisi de yalnızca animasyon **yürürlükteyken** oluyor;
  `backwards` dolgu animasyon biter bitmez etkiyi tümüyle kaldırıyor, `both`
  ise hiç bitirmiyor. `AppShell`in kök `div`inde bir kez `both` ile yazıldı ve
  alt menü sayfanın altından taştı; onay penceresi de bir kez alt menünün
  arkasında açıldı.
- **Geçiş yalnızca solma olamaz.** İlk hâli 190 ms'lik bir opaklık geçişiydi ve
  telefonda hiç fark edilmedi: aynı yerde duran iki ekran arasındaki solma,
  geçiş gibi değil ekranın geç çizilmesi gibi görünüyor. Hareket eden bir şey
  yoksa geçiş de yok.
- **Geçiş duraklatılmış başlıyor** (`SayfaGecisi`, `.sayfa-bekliyor`). CSS
  animasyonu öğenin ilk çizildiği karede başlıyor ve o kare, yeni ekranın
  kurulduğu en pahalı kare; orada başlayan animasyonun ilk kareleri düşüyor ve
  hareket kasıyor gibi görünüyor. İki `rAF` sonra salınıyor, arkasında emniyet
  zamanlayıcısı var — açılış ekranındaki `acilis-bekliyor` ile aynı kural.
  Duraklatma alt öğelere de iniyor: kartların sıralı girişi de aynı pahalı
  karede başlıyordu, artık hepsi tek bir hareket hâlinde salınıyor.

Alt menünün zemini bu yüzden **donuk** ve `backdrop-blur` taşımıyor: menü
sayfanın üstünde duruyor ve altındaki içerik her kıpırdadığında WebView arkayı
yeniden bulanıklaştırıyor. Görsel katkısı yoktu (zemin zaten %95 donuktu),
bedeli takılan bir geçişti. Sayfanın üstünde duran yeni bir çubuk eklersen
aynı soruyu sor.
- **Tam ekran katmanlar `clip-path` ile yükseliyor**, `transform` ile değil —
  yukarıdaki ilk sebep. `sahne-iner` ile aynı yöntem, ters yönde: bu katmanlar
  alttan geliyor.

Ekran geçişini oynatan şey `AppShell`deki `key`: sınıf tek başına verilseydi
React aynı düğümü koruduğu için animasyon yalnızca ilk açılışta çalışırdı.

Yeni bir pencere ya da katman eklersen sınıflardan birini kullan; yenisini
yazmadan önce listedekilerden hangisinin karşılığı olduğuna bak. Altısı da
`prefers-reduced-motion` altında susuyor: hangi ekranda olunduğu başlıkta,
pencerenin neye ait olduğu metninde yazılı — hareket yalnızca bağlıyor.

## Kartlar sırayla beliriyor

Izgaralar (ana sayfanın Araçlar/Oyunlar kutucukları, Oyunlar sekmesinin ders ve
oyun kartları, tur sonundaki puan kartı ile kutular) tek bir karede tam
hâlleriyle çıkıyordu: sekmeler arasında gidip gelen kullanıcı ekranın
kurulduğunu değil sıçradığını görüyordu. Kartlar artık aşağıdan ve sırayla
geliyor — hareket gözü ızgaranın başına, okumanın başlaması gereken yere
koyuyor.

Sınıf tek (`kart-girisi`, `globals.css`), gecikmeyi `kartGirisi(sıra)` veriyor
(`components/ui.tsx`). Gecikmenin **tavanı JS'te**, CSS'te değil: aynı sınırı
CSS'te yazmanın yolu `min()` ve eski WebView sürümlerinde o bildirim sessizce
düşünce gecikmeyle birlikte animasyonun tamamı gidiyordu. Tavan sekizinci
kartta — ondan sonrası hareketten uzun süren bir bekleme oluyor ve ekran
açılmıyormuş gibi duruyor.

Hareket bilgi taşımıyor (kaçıncı kart olduğu ızgaradaki yerinde yazılı), o
yüzden `prefers-reduced-motion` altında susuyor.

## Tur sonunda isabet ve hatasız tur

İki ekleme, ikisi de aynı soruya cevap veriyor: rekor kırmayan iyi turun
karşılığı yoktu.

- **İsabet oranı** (`isabetYuzdesi`, `oyun-kabuk.tsx`) kutuların ilkinde. Orada
  bir süre "Doğru" duruyordu ve hemen üstündeki 38 piksellik sayıyı tekrar
  ediyordu; isabet ise turun tek yeni bilgisi — 12 doğru, 3 yanlışın yanında
  başka bir tur, 12 yanlışın yanında başka. Hiç cevap verilmemiş turda oran
  **yok** ("—"): sıfır yazmak, hiç denemeyeni hepsini yanlış yapmış gibi
  gösterirdi.
- **Hatasız tur şeridi.** Ölçü `lib/oyunlar/tur.ts`teki `hatasiz` ile aynı,
  üstüne eleme dışarıda: süresi biten ya da yanlışta elenen turda "hatasız"
  demek, turu bitiren şeyi görmezden gelmek olurdu. Karşılığı konfeti
  **değil** — konfeti yeni rekora ait ve iki olay aynı kutlamayı paylaşırsa
  rekorun karşılığı sıradanlaşır.

Puan çubuğu da dolarak geliyor (`tur-cubugu`). Genişlik değil `transform`
oynatılıyor: genişlik her karede yeniden yerleşim demek ve rekor çizgisi
çubuğun üstünde durduğu için o da her karede kayardı.

## Yarıda bırakılan tur da bir tur

Oyundan çıkmak her modda turu **bitiriyor**: tur sonu ekranı çıkıyor ve o turun
yanlışları Oyun Bankası'na düşüyor. Eskiden bu yalnızca Rahat modda böyleydi,
ötekilerde çıkış turu sessizce siliyordu — oyuncu ne yaptığını görmeden ekrandan
atılıyor ve öğrenmesi gereken sorular kaydedilmiyordu.

Yarım tur `yarim` bayrağıyla bildiriliyor (`onTurBitti`'nin dördüncü
parametresi) ve rekora, istatistiğe, oyun geçmişine **yazılmıyor**: eleme
`oyunlar.tsx` içindeki `turBitti`'de, Rahat ve banka turlarıyla aynı satırda.
Sayılsaydı yarısında çıkılan turlar hem "oynanan tur" sayısını hem ortalama
süreyi bozardı. Tur sonu ekranındaki rekor rozeti de bu yüzden yarım turda
kutlamıyor.

## Mod müzikleri (kaldırıldı)

Dört modun dört ayrı sentezlenmiş parçası vardı (`mod-muzigi.ts`, Rahat'ınki
`oyun-muzigi.ts`), tempo turun gerginliğini izliyordu, ses dengesi efektlerle
birlikte kurulmuştu. Hepsi silindi — bkz. "Oyunda müzik yok". Geri getirmek
istersen tarihçe `git log -- lib/oyunlar/mod-muzigi.ts`; oradaki iki ders hâlâ
geçerli: ana seviyeyi değil parçanın kendi dengesini oynat, ve sürekli çalan
sesin ölçüsü "duyuluyor mu" değil "farkında olmadan dinlenebiliyor mu".

## Oyun Bankası

Bir kayıt iki yoldan çıkıyor ve ikisi aynı şey değil. **Kazanılan çıkış**: soru
genel testte doğru bilinince düşüyor; "bankadan düşen" sayacını ilerleten ve
rozete sayılan yol bu. **Elle kaldırma**: karttaki tik kaydı sayaca dokunmadan
siliyor. İkincisi sonradan eklendi çünkü banka bir borç listesi — öğrendiğine
kullanıcının kendisi karar veremiyorsa liste yalnızca büyüyor ve bir yerden
sonra hiç açılmıyor.

Tik sayacı ilerletmiyor; ölçtüğü tek şey kullanıcının tuşa basması. Bankaya yeni
bir çıkış yolu eklersen aynı soruyu sor: bu yol uydurulabiliyor mu,
uydurulabiliyorsa sayaca yazılmamalı.

### Çıkışın tek kazanılan yolu genel test

Bir kayıt eskiden turlarda **üst üste üç kez** doğru bilinince kendiliğinden
düşüyordu (`DUSME_ESIGI`, `ardisikDogru`); ikisi de kaldırıldı ve turdaki doğru
cevap artık bankaya hiç dokunmuyor. Sayaç ölçtüğü şeyi ölçmüyordu: soru turun
kendi havuzunda kayboluyor, üç doğru haftalara yayılıyor ve aynı oyunun
turunda gelen soru şıklarından tanınabiliyordu.

Yerine **genel test** var (`lib/oyunlar/banka-testi.ts`,
`components/ekranlar/banka-testi.tsx`): bankadaki bütün yanlışlar oyun ayrımı
olmadan, karışık sırayla ve tek bir ortak biçimde soruluyor. Ortak biçim şıklı
soru olmak zorunda — on sekiz oyunun kendi ekranını tek turda toplamak mümkün
değil, ama her kaydın zaten bir soru metni ile bir cevap metni var
(`bankaSorusuMetni`, `bankaCevabiMetni`).

Testin iki ucu **eşit değil**: doğru bilinen kayıt düşüyor (`testiIsle`), yanlış
bilinen olduğu gibi kalıyor — sayacı artmıyor, ikinci kez eklenmiyor. Test yeni
bir hata üretmiyor, hâlâ öğrenilmemiş olanı gösteriyor; `bankayiGuncelle` bu
yüzden kullanılmıyor, o oyun turundan gelen yeni hatayı sayıyor.

Çeldiriciler bankanın kendisinden geliyor ve **aynı oyun** öncelikli: bir eser
sorusunun şıklarına element adı karışsaydı soru, cevabı bilmeden elenirdi.
Çeldirici bulunamayan kayıt teste hiç girmiyor — tek şıklı bir soru
cevaplanmadan doğru sayılır ve o kayıt hak etmeden düşerdi.

### Karta dokunmak soruyu açmıyor

Kartın gövdesi bir süre tıklanabilirdi ve dokunuş o soruyla tek soruluk bir tur
açıyordu; kaldırıldı. Sebep kartın kendisi: doğru cevap sorunun hemen altında
yazıyor ve okuduktan saniyeler sonra çözülen soru bilmeyi değil hatırlamayı bile
ölçmüyor. Aynı soru genel testte cevabı görünmeden ve karışık sırada soruluyor.

`BankaTuru` bu yüzden yalnızca oyun kimliği taşıyor (`kayit` alanı silindi) ve
"sadece bunlardan bir tur" düğmesi duruyor: soruları kendi oyununun ekranında
tekrar çözmek hâlâ mümkün, ama o tur kaydı düşürmüyor. Havuzu süzen yer
`oyunlar.tsx` içindeki `bankaSorulari`; oyun dosyalarının hiçbiri değişmedi,
çünkü hepsi zaten "havuz boş değilse banka turu" kuralıyla çalışıyor.

## Oyun modları

Turun nasıl işleyeceğini **mod** belirliyor (`lib/oyunlar/mod.ts`).

**Mod tur başlamadan seçiliyor** (`ModSecimi`, "Turu ayarla" penceresinde)
ve dördü de açık. Seçim bütün oyunlarda ortak ve saklanıyor
(`ANAHTARLAR.oyunModu`): mod turun nasıl işleyeceğini söylüyor, oyunun ne
sorduğunu değil — "Turbo sevdim" diyen kullanıcı bunu her oyunda yeniden
seçmemeli.

Seçim bir süre kaldırılmıştı: oyunu ilk açan öğrenciye sorulan üç sorunun
(mod, zorluk, soru türü) cevabı ancak oynayarak öğrenilebiliyor ve "Başla" o
üç sorunun arkasında, bir ekran ötede duruyordu. Geri gelirken sorun seçimin
kendisinde değil **zorunluluğunda** olduğu görüldü: iki soru da varsayılanıyla
geliyor (Sıradan · Orta), hiçbir şeye dokunmayan kullanıcı tek dokunuşla
adımı geçiyor. Soru türü seçimi geri gelmedi — havuzun tamamı soruluyor.

| Mod | Saat | Yanlış | Kayıt |
| --- | --- | --- | --- |
| Sıradan | tura ait, 60 sn | süreden 3 sn götürür | var |
| Turbo | tura ait, 30 sn | süreden 3 sn götürür | var |
| Ani Ölüm | soruya ait (`SORU_SURESI`) | tur biter | var |
| Rahat | yok | hiçbir şey | **yok** |

Dördü de seçilebiliyor. Rekora yazılmama kuralının (`kayitliMi`) kapısı
`oyunlar.tsx` içindeki `turBitti` ve seçimi okuyor — Rahat turda sayı hiçbir
yere yazılmıyor. Seçim ekranı bunu seçildiği anda sarı bir şeritle söylüyor:
turun sonunda öğrenilen bir kural, o turu boşa harcatır.

**Oyun Bankası turu** modu dinlemiyor (`etkinMod`): oradaki sorular zaten bir
kez yanlış bilinmiş olanlar ve turun amacı hepsini bir kez daha görmek — tur
saatli bir mod o işi yarıda keser. Ayarlar adımı o turda hiç çıkmıyor
(`secilebilir`): sunulup dinlenmeyen bir seçim, yalan söyleyen bir arayüzdür.

**Seçim tam ekran bir adım değil, oyunun üstünde açılan bir pencere**
(`AyarPenceresi`, `tasarim/oyun-modu-secimi.dc.html`): ayar turu değiştiriyor,
oyunu değil, ve bulanık zeminin altında hangi oyuna girildiği görünüyor. Arkada
soru **yok** — oyun ekranı tahtayı ancak `asama === 'oynaniyor'` olunca
çiziyor, tanıtım aşamasında yalnızca kabuk duruyor. Pencere kendi içinde
kayıyor: dört mod kutusu, zorluk şeridi ve Rahat'ın uyarı şeridi kısa
telefonlarda taşıyor ve düğme ekranın dışında kalıyordu.

**Pencereden sonra tanıtım yok.** "Başlat" doğrudan 3 · 2 · 1 sayımını
açıyor. Bir süre arada nasıl oynandığını anlatan tam ekran tanıtım vardı
("Devam" → kurallar → "Başla"); kullanıcı kaldırılmasını istedi — tura girmek
iki ekran ve iki dokunuş sürüyordu. Kural kaybolmadı: tur sırasındaki "?"
tanıtımı açıyor. Tur başında tanıtım yalnızca ayar penceresi çıkmayan turda
(Oyun Bankası turu) görünüyor.

Mod kutularındaki ikonlar çizgi ikon (lucide), `ModTanimi.simge`deki emoji
değil: dört kutunun dördü de aynı ailede olmalı ve emoji telefondan telefona
başka çiziliyor. Emoji duruyor, tur içindeki mod rozetinde
(`oyun-kabuk.tsx`) hâlâ o çiziliyor — orası tek bir simge, hizalanacak
kardeşi yok.

Zorluk ızgara değil **şeritli seçici**: üç seviye tek bir eksende sıralı ve
ızgara o sıralamayı anlatmıyordu. Kayan gösterge iki katman — dıştaki ray
düğmelerin kapladığı alanın aynısı, içteki gösterge o rayın tam üçte biri.
Ray olmadan (`calc((100% - 0.75rem) / 3)`) her adımda yarım piksellik bir
kayma birikiyor ve üçüncü seviyede gösterge şeridin kenarına yapışıyordu.

**Seçim prop'la değil bağlamla iniyor** (`components/tur-ayari-baglami.tsx`,
`genel-test-baglami.tsx` ile aynı kalıp). Seçtiren yer tek (`oyun-tanitim.tsx`)
ama tanıtım penceresini çizen ve ayarı kullanan yer yirmi iki oyun dosyasının
her biri; prop olsaydı aynı dört satır yirmi iki kez yazılacaktı ve yeni bir
oyun eklendiğinde unutulan satır, seçimi sessizce yok sayan bir oyun demekti.
Oyun dosyaları saf fonksiyonları değil `useEtkinMod` / `useUyarlananZorluk`
sarmallarını çağırıyor; `etkinMod` ile `uyumBasla` saf kalıyor ve testlerde
seçim elle veriliyor.

**Çıkış turu bitiriyor**, doğrudan kapatmıyor; yoksa o turda öğrenilen
yanlışlar bankaya hiç düşmezdi.

Sayaç tek yerde: `lib/oyunlar/tur-sayaci.ts`. Toplamı sıfır dönmesi "sayaç yok"
demek ve arayüz halkayı ona bakarak gizliyor. Yeni bir mod eklersen saatin tura
mı soruya mı ait olduğuna karar ver — ikisi birden olmaz, `mod.test.ts` bunu
denetliyor.

## Zorluk seçiliyor, sonra turun içinde kayıyor

İki kural üst üste duruyor ve ikisi ayrı soruya cevap veriyor: **seçim**
(`ZorlukSecimi`) turun nereden başlayacağını, **uyum** (`lib/oyunlar/uyum.ts`)
nereye gideceğini söylüyor.

İkisi sırayla denendi ve ikisi de tek başına eksik kaldı. Yalnızca seçim
varken **seçim tur boyunca donuyordu**: kolayda arka arkaya on doğru yapana
oyun kolay soru vermeye devam ediyordu. Yalnızca uyum varken **seviyesini
bilen oyuncu her turu ortadan başlamak zorunda** kalıyordu. Şimdi seçim
başlangıcı veriyor, uyum onun üstünde çalışmaya devam ediyor.

Uyum kuralı saf: üç ardışık doğru bir üst seviyeye çıkarıyor, iki ardışık
yanlış bir alt seviyeye indiriyor. Düşme yükselmeden hızlı — yanlış
zorlandığının doğrudan işareti, doğru ise şıklı soruda tahminle de gelebiliyor.
Seçim yapılmamışsa (Oyun Bankası turu, eski kayıt) başlangıç **orta**:
oradan uyum iki yöne de aynı hızda gidebiliyor.

Seçim oyun başına saklanıyor (`ANAHTARLAR.oyunZorlugu`, tek anahtarda bir
tablo): biri edebiyatta kolayda kalırken sesi zorda oynayabiliyor. Tuttuğu şey
turun **başlangıcı**; seviyenin kaydığı yer kayda yazılmıyor — o, kullanıcının
kararı değil turun sonucu. `uyum.test.ts` ikisinin birlikte yaşadığını
denetliyor: kolay seçilse de yükselebiliyor, zor seçilse de düşebiliyor.

Kaymanın kendisi kullanıcıya **söylenmiyor**: ekranda bir "seviye atladın"
bildirimi, ölçülen şeyi (bilgi) bir ödüle çevirir ve oyuncu seviyeyi
kovalamaya başlar.

### Şeritler: seviye değişince soru sırası bozulmuyor

Seviye tur içinde kaydığı için sıradaki sorunun hangi havuzdan geleceği ancak
oraya gelindiğinde belli oluyor; tek bir liste önceden kurulamaz. `turSirasi`
bu yüzden **üç şerit** döndürüyor (`SoruAkisi`): her seviye için ayrı,
karıştırılmış ve tur sınırına kadar döndürülmüş bir liste. Oyun `akis[zorluk]`
şeridini aynı `sira` numarasıyla okuyor — yani seviye değişince yalnızca şerit
değişiyor, soru sayacı ve tur sonu koşulu olduğu gibi kalıyor. Üç şerit de
**aynı boyda** olmak zorunda (`ritim.test.ts` denetliyor): kısa bir şeride
geçmek turu tanımsız bir soruya düşürürdü.

Havuzu olmayan oyunlar (izohips, kural tuzağı, zaman şeridi) şeritlerini
`akisUret` ile kuruyor; Oyun Bankası turunda zorluk olmadığı için üç şerit de
aynı listeye bakıyor (`tekAkis`).

**Uyum ilerlerken işleniyor, cevap verilirken değil.** Ekrandaki soru
`sorular[zorluk][sira]` ile okunuyor; seviye cevap anında kaysaydı soru,
oyuncu geri bildirimi okurken değişirdi. `zorlukKaydet` bu yüzden `ilerle`nin
zamanlayıcısında, `setSira` ile aynı karede çağrılıyor.

Eşleştirme oyunlarında (edebiyat, antlaşma, kavram, formül) el bir
zamanlayıcının içinde kuruluyor ve orada seviye `zorlukRef.current`'tan
okunuyor: zamanlayıcı kurulurken yakalanan `zorluk`, cevabın seviyeyi
kaydırmasından önceki değer olurdu.

### Boss soruları kaldırıldı

Her onuncu soru bir üst seviyeden gelen, ekranı kırmızıya çeviren ve tek
yanlışta turu bitiren bir "boss"tu. Uyum geldikten sonra ikinci ve habersiz bir
zorluk sıçraması oluyordu: oyuncu iyi gittiği için zaten zor sorulardayken
onuncu soruda bir de "bir üst seviye" geliyor, zorun üstü olmadığı için de aynı
soru daha kısa süreyle veriliyordu. Ölçülen şey bilgi olmaktan çıkıp sayaca
yetişmek oluyordu.

Kaldırılanlar: `bossZorlugu`, `bossMu`, `bossElMi`, `bossluMu`,
`bossYerlestir`, `BOSS_ARALIGI`, süre çarpanları, `Eleme`'deki `'boss'` değeri,
kabuktaki kırmızı zemin/rozet/parlama, `bossSesi` ve `boss-*` CSS sınıfları.
`soruSuresi` artık tek argüman alıyor: zorluk **süreyi değiştirmiyor**, seviye
sorunun kendisini seçiyor — üstüne bir de saati kısaltmak aynı kararı iki kez
uygulamak olurdu.

## Trigonometrik Oranlar

Matematiğin ilk 10. sınıf oyunu (`lib/oyunlar/trigonometri.ts`, ekran
`components/ekranlar/oyun-trigonometri.tsx`) ve Geometri Ustası bölümünün
üçüncü oyunu — Özel Üçgenler'in dik üçgeninin üstüne kuruluyor. Konu Maarif
programının "Dik Üçgende Trigonometrik Oranlar ve Özdeşlikler"i: program bu
sınıfta birim çembere geçmiyor, oyun da dar açıyla dik üçgenin içinde kalıyor.

Sorular havuzdan değil **üretilerek** geliyor ve zorluk soru biçimini seçiyor:
kolayda tanım (üç kenarı yazılı üçgende sin/cos/tan, özel açılarda sin/cos),
ortada cot, eksik kenar ve dört oranlı özel açılar, zorda şekil kalkıyor —
bir oran verilip öteki (`donusum`) ya da tümler açınınki (`tumler`) soruluyor.
Eksik kenarlı soruda yazılmayan kenar sorulan oranın içinde olmak zorunda;
olmasaydı Pisagor'a hiç gerek kalmazdı.

**Çeldiriciler aynı üçgenin öteki oranları**, rastgele kesir değil: sin
sorulduğunda cos, tan, cot ve 1/sin şıkta duruyor. Oyunun ölçtüğü hata tam bu
— karşıyla komşuyu, payla paydayı karıştırmak. Tümler soruda aynı adlı oran
(tan α = 3/4 verilip tan β sorulunca 3/4) bu yüzden kendiliğinden tuzak
oluyor. Değeri doğruya eşit hiçbir şık olamıyor (`degerSayisi` ile
karşılaştırılıyor) ve şıklar hep sade: 6-8-10 üçgeninde sin α yine 3/5 — oran
açıya bağlı, boya değil.

Özel açılarda tan 30° "√3/3" yazılıyor, "1/√3" değil: iki yazılış yan yana şık
olsaydı aynı değer iki kez sorulurdu. Kesirler ekranda üst üste çiziliyor
(`components/kesir-yazisi.tsx`); eğik çizgiyle "√3/2" ile "√(3/2)"
ayırt edilmiyordu.

7-24-25 çizilmiyor, yalnızca metin sorularında var: dar açısı 16° ve α o
köşeye düşünce etiket kenarların arasına sığmıyordu (`sekil.test.ts`).
Banka kaydı sorunun kendisini taşıyor, cevabı değil — cevap kenarlardan her
açılışta yeniden hesaplanıyor.

## Coğrafyanın iki harita oyunu

Harita Avı'nın yanına iki oyun daha geldi ve ikisi de 9. sınıf konularına
çalışıyor: **İklim Kuşakları** (yeryüzünde iklim tipleri) ve **İzohips Okuma**
(eş yükselti eğrilerinden yer şekli). Üçünün de haritası ayrı: Türkiye illeri,
dünya ülkeleri, üretilen izohips haritası.

### Dünya haritası da Natural Earth'ten üretiliyor

`lib/oyunlar/dunya-havuzu.ts` elle yazılmadı: `scripts/dunya-uret.mjs` Natural
Earth 1:110m admin-0 verisini indirip izdüşüme sokuyor, sadeleştiriyor ve
1000×389'luk bir kutuya oturtuyor (176 ülke, 62 KB). Türkiye haritasındaki
(`harita-havuzu.ts`) boru hattının aynısı; dosyayı elle düzenleme, betiği
yeniden çalıştır.

İzdüşüm **eşdikdörtgen** ve bu bir tercih: oyunun sorduğu şeyin çoğu enleme
bağlı ve eşdikdörtgende enlem düşey eksende doğrusal, yani ekvatorun iki
yanındaki kuşaklar haritada da simetrik duruyor. Robinson gibi bir izdüşümde
kuşaklar eğrilir ve "aynı enlemde aynı kuşak" sezgisi bozulurdu. Antarktika ile
84° kuzeyin üstü kesildi: eşdikdörtgende kutuplar yatay olarak uzuyor ve
haritanın üçte birini yiyorlar.

Harita **yakınlaştırılmıyor** (Harita Avı'ndan ayrıldığı yer burası): orada
oyuncu haritaya dokunup il seçiyor ve küçük illere sokulabilmesi gerekiyor,
burada haritaya yalnızca bakılıyor. İşaretli yer hem halka hem boyalı sınırla
gösteriliyor; ikisi birden olduğu için Hollanda kadar küçük bir ülke de
kaybolmuyor.

Ekvator, dönenceler ve Kuzey Kutup Dairesi haritanın üstünde çizili. Süs
değiller, sorunun yarısı: "bu bölge hangi kuşakta" bağını kuran şey onlar.
Adları haritanın **altında** yazıyor — 1000 birimlik kutuda okunabilir bir yazı
ülkelerin yarısını kapatıyor.

### İklim soruları ülkeye değil bölgeye ait

Havuzun ölçütü tek: bir yer ancak **tek bir iklim tipiyle** anılabiliyorsa soru
oluyor. Brezilya bu yüzden ülke olarak yok — kuzeyi ekvatoral, ortası savan,
güneyi ılıman; "Brezilya'da hangi iklim görülür" sorusunun tek doğru cevabı
olmazdı. Yerine Amazon Havzası ve Brezilya'nın orta kesimi ayrı ayrı, birer
nokta olarak duruyor. Havuzun iki tür kaydı olmasının sebebi bu: bazı sorular
bir ülkeyi işaretliyor (sınırı boyanıyor), bazıları bir bölgeyi (yalnızca halka
konuyor). Çölün, havzanın, kuşağın sınırı yok — ortası var.

Çeldiriciler de rastgele değil, `KARISTIRILAN` tablosundan: gerçekten
karıştırılan iklimler. Grönland sorulup şıklara Ekvatoral, Muson ve Savan
konsaydı haritaya bakan herkes kutbu seçerdi; iş sorunun cevabını bilmeye değil
şıkları elemeye dönerdi.

Ülke kodu ile koordinat ayrı ayrı elle yazılıyor ve ikisinin birbirini tutması
şart — `iklim.test.ts` her kodun haritada karşılığı olduğunu ve halkanın o
ülkenin üstüne düştüğünü denetliyor. Tutmazsa soru "Kenya" yazıp Peru'yu
işaretler ve bunu kimse fark etmez.

### İzohips haritaları çiziliyor değil, üretiliyor

Haritalar bir görsel havuzundan gelmiyor: tohumdan bir yükselti alanı
kuruluyor, marching squares ile eğrilere çevriliyor
(`lib/oyunlar/izohips.ts`). İki gerekçe var ve ikincisi asıl olan:

1. **Telif.** Deneme ve sınav kitaplarındaki izohips haritaları o yayınların;
   kopyalanamaz. Üretilen harita özgün.
2. **Cevabın doğruluğu.** Hazır bir görselde "daire içindeki şekil nedir"
   sorusunun cevabı elle yazılır ve yanlış yazılabilir. Burada daire, tepeyi
   oraya koyan kodun bildiği yere konuyor.

Kayıtta harita değil **tohum** duruyor (`banka.ts`): Oyun Bankası turunda aynı
harita birebir yeniden çiziliyor. Bu yüzden üreteç `Math.random` değil,
tohumdan türeyen bir mulberry32 — öğrencinin bir kez yanlış bildiği harita
tekrar karşısına çıktığında başka bir harita olsaydı banka öğretmezdi.

**Doğruluk testle tutuluyor.** `izohips.test.ts` çizime değil, çizimin çıktığı
yükselti alanına bakıyor (`yukseltiAlani`): tepede halkanın merkezi her yönden
yüksek mi, kapalı çukurda alçak mı, boyunda iki yön yukarı iki yön aşağı mı,
adanın çevresi deniz mi, platonun halkası içinde tek bir izohips bile geçmiyor
mu, dik yamaç haritanın en dik yeri mi. Testler altmış tohumla dönüyor ve
üretimdeki her ayar (dekorların uzaklığı, çan eğrilerinin genişliği, bölgesel
eğimin şiddeti) bu testler kırıldığı için bugünkü değerinde: sayıları
oynatırsan testler hangi soruyu bozduğunu söyler.

Üretimde bir kez düşülüp testle yakalanan tuzaklar:

- **Serit katmanlar uzağa taşıyor.** Vadi ve sırt bir doğru parçası boyunca
  uzanıyor; merkezleri uzak olsa bile uçları başka bir şeklin halkasına
  giriyordu. Uzunluk kısaldı, dekorların en az uzaklığı büyüdü.
- **Basamak katmanı yerel değil.** Dik/yatık yamacın geçiş kuşağı bir çizgi ve
  haritayı baştan başa geçiyor. İki yamacın merkezi arasındaki uzaklık eğime
  **dik** yöndeyse kuşaklar üst üste biniyor ve dik kuşak yatık yamacın
  halkasından geçiyordu; karşıt yamaç bu yüzden eğim ekseni boyunca kaydırılıyor.
  Yamaç sorularında haritada dekor da yok — tepelerin yamacı ikisinden de dik
  oluyor ve "en sık izohipsler" oraya kaçıyordu.
- **Bölgesel eğim her soruda iyi değil.** Vadi ile sırt ancak bir yamaç
  üzerinde ayrışıyor (düz zeminde ikisi de kapalı halkaya döner), ama aynı eğim
  platonun düz tepesini izohipsle kesiyor ve boynun eyerini yana yatırıyordu.
  Şiddet bu yüzden şekle göre değişiyor.
- **Deniz sütun sütun taranıyor.** Kıyı çizgisi her sütunda yukarıdan aşağı
  inip suya ilk girilen yerden bulunuyor; genel bir çokgen kesme algoritması
  yok çünkü zemin kıyıdan aşağı tek yönde iniyor. Bunun bedeli: denizli
  haritada karada deniz seviyesinin altına inen bir çukur (göl) olamaz, yoksa
  tarama gölü denizin devamı sanıp aradaki karayı suya boğar. Denizli
  haritaların dekorları bu yüzden yalnızca tepe ve boyun.

**Sayılar şeklin yanında duruyor.** Yükselti yazıları önce halkadan
olabildiğince uzağa konuyordu ve soru cevaplanamaz hâle geliyordu: tepe ile
kapalı çukurun çizimi birebir aynı, ayıran tek şey yükseltinin içe doğru artıp
azalması. Halkanın çevresindeki eğrilerde sayı yoksa öğrenci ekranın öbür
ucundan başlayıp halkaları saymak zorunda kalıyor. Artık her seviyenin sayısı
işarete **en yakın** eğrisine konuyor; yazılar yalnızca birbirinden uzak
duruyor.

Denizin mavisi tarih dersinin renk ailesinden (`trh`) geliyor ve bu, "renk
derse aittir" kuralının bilinçli istisnası: buradaki renk bir ders kimliği
değil harita göstergesi, coğrafyanın yeşiline boyanmış bir deniz karadan ayırt
edilemiyordu. Aynı sebeple dünya haritasının okyanusu da o aileden.

## Kimyanın iki oyunu

Kimya dersi iki oyunla açıldı: **Periyodik Tablo Avı** (element, yer, aile) ve
**Formül Eşleştirme** (formül–ad). Ders renk ailesi olarak lavantayı (`edb`)
alıyor; o aile Türkçe ile Edebiyat birleştiğinde boşta kalmıştı ve renk
değişkenleri (`--edb-*`) rozetlerde kullanıldığı için adı değişmedi. Yani
`edb` artık "edebiyat" değil "Kimya'nın rengi" demek.

### Tablo eksik yazılı, iskeleti tam

Havuzda 118 element değil 38 element var (`periyodik-havuzu.ts`) ve ölçüt tek:
TYT'de karşılığı olan element. Havuz bir kez bütün tabloyu taşıdı ve oyun
oynanmaz hâle geldi — "Praseodim'i bul" sorusu bilgiyi değil sabrı ölçüyor,
öğrenci turu kapatıyordu. Eksik bir havuz, cevaplanan bir soru demek. Test
(`periyodik.test.ts`) iki ucu birden tutuyor: ilk yirmi element **şart**
(müfredatın çekirdeği), toplam sayı da bir üst sınırın altında kalıyor.

Buna karşılık tablonun **çizimi** kırpılmadı: 18 grup çiziliyor ve havuzda
karşılığı olmayan hücreler boş kutu olarak duruyor. Boş kutular süs değil,
sorunun yarısı: grupların nerede başlayıp bittiğini — bor grubunun 2. periyotta
açılmasını, geçiş metallerinin 4. periyotta gelmesini — onlar anlatıyor.
Kırpılmış bir tabloda "Ca, K'nin sağında" demek başka bir tablodan bahsetmek
olurdu. Kural `hucreVarMi` içinde ve elementlerden **bağımsız**; havuz
değişince tablonun şekli değişmiyor.

**7. periyot çizilmiyor** (`PERIYOT_SAYISI` 6). Oradan havuza tek element
girmiyor ve tümüyle boş bir satır tablonun şeklini değil boşluğunu gösteriyor:
kullanıcı orada okunacak bir şey arıyor, bulamıyor. Lantanit/aktinit blokları
da yok, aynı sebeple.

Yakınlaştırma **yok** — Harita Avı'ndan ayrıldığı yer burası. Orada Yalova 390
piksellik ekranda altı piksel kalıyor ve haritaya sokulabilmek gerekiyor;
burada her hücre aynı boyda ve on sekiz sütun sığıyor. Izgara Tailwind sınıfı
değil satır içi ölçü: on sekiz sütunluk bir `grid-cols-*` sınıfı taramadan
düşerse tablo tek sütuna iner ve oyun ekranda hiç olmaz.

### Üç soru tipi, üç ayrı beceri

`bul` yeri (tabloda dokun), `sec` sembolü (yanıp sönen hücrenin adı),
`sinif` tablonun anlamını (hangi aile) soruyor. TYT'de sorulan çoğunlukla
üçüncüsü, ama ilk ikisi olmadan üçüncüsü ezberden ibaret kalıyor.

Çeldiriciler tabloda **komşu** hücrelerden (`enYakinlar`) — Harita Avı'nın
kuralının aynısı: işaretli hücre 2. periyotta dururken şıklara Altın konsaydı
tabloya bakmadan elenirdi.

Sınıf sorusunun şıklarına **"Metal" hiç girmiyor** ve Al, Sn, Pb'ye sınıf
sorusu hiç sorulmuyor (`sinifSorulurMu`). Sebep cevabın tekliği: kalsiyum hem
toprak alkali hem metaldir, ikisi birden şıkta dururken doğru cevap iki tane
olurdu.

Banka kaydında sembol ile **tip** birlikte duruyor: aynı elementin yerini
bilmekle ailesini bilmek ayrı şeyler, tek kayıt olsalardı biri ötekini
düşürürdü. Şıklar kayda **girmiyor**, her açılışta yeniden kuruluyor —
ezberlenmiş bir şık dizilimi soruyu cevaplamadan geçirtirdi.

### Formülün alt indisi çizim tarafında

Havuzda `H2SO4` yazıyor, ekranda H₂SO₄ duruyor (`formulParcalari`).
Unicode'un alt indis rakamları kullanılmadı: Nunito'da yoklar ve tarayıcı eksik
karakteri başka bir aileden çiziyor, formülün yarısı başka yazı tipinde
kalıyordu. Kural basit tutulabiliyor çünkü havuzdaki formüllerde **her** rakam
bir alt indis; değerlik gösteren Roma rakamları formülde değil adda duruyor
("Bakır(II) sülfat") ve testi bunu denetliyor.

### Zorluk elin türünü değil içindekileri seçiyor

Eller Edebiyat Eşleştirme'deki gibi mümkün oldukça **tek türden** kuruluyor
(altı asit, altı tuz): karışık elde öğrenci formüle değil biçime bakıp eliyor
— "OH ile bitiyorsa bazdır" altı çiftin altısını da bulduruyor.

Öteki oyunlarda havuz önce zorluğa göre süzülüyor (`zorluktaSuz`); burada
süzülemiyor. Kolay bileşiklerin sayısı tür başına altıya ulaşmıyor ve süzülmüş
havuzda hiçbir tür el kuramıyordu — yani Kolay seviyede **her el karışık**
kuruluyor, oyunun asıl zorluğu kolay seviyede hiç yaşanmıyordu. Tür bu yüzden
bütün havuzdan seçiliyor, seçilen zorluk o türün içinde öne alınıyor: istenen
seviyeden yeterince bileşik varsa el tümüyle oradan çıkıyor, yoksa aynı türün
öteki seviyeleri tamamlıyor. `formul.test.ts` üç zorlukta da elin tek türden
kurulduğunu denetliyor.

## Geri sayım öğrencinin kendi sınavına

Ana sayfadaki YKS geri sayımı bir süre herkese bugünden sonraki ilk sınavı
sayıyordu; 11. sınıftaki öğrenci girmeyeceği bir sınava "273 gün kaldı" diye
bakıyordu. Artık `geriSayim(bugun, sinif)` (`lib/sinav-tarihi.ts`) sınıfa
bakıyor: sınav, öğrencinin 12. sınıfı bitirdiği ders yılının haziranı
(`sinavYili`) — 12 ve mezun sıradaki hazirana, 11 bir sonrakine, 9 üç
sonrakine. Ders yılı eylülde döndüğü için temmuzda hâlâ "11" kayıtlı öğrenci
sıradaki hazirana sayıyor; kayıtlı sınıf eylülde `ilerlemisSinif` ile
kendiliğinden ilerliyor, burada ikinci kez ilerletilmiyor.

İlerleme çubuğu **geçen son sınavdan** başlıyor, "bir önceki yılın
sınavından" değil: 11. sınıf için o sınav henüz yapılmadı ve çubuk bütün yıl
sıfırda dururdu. Yani 11. sınıfta çubuk iki yıllık yolu gösteriyor ve ilk
yılın sonunda yarıda; bu kasıtlı — çubuğun sorusu "hazırlığın neresindeyim".

## Ana sayfada günün hâli

Soru hedefi kartının hemen altında bir kart daha var (`GununHali`,
`components/ekranlar/ana-sayfa.tsx`): "bugün çalıştın mı" sorusuna Rabi'nin
pozuyla cevap veriyor. Cümleyi ve pozu `lib/gunun-hali.ts` seçiyor — saf,
`gunun-hali.test.ts` her kuralı ayrı denetliyor.

Kart bir süre yalnızca üç şey diyordu: hiç soru yok / başladın / hedef tuttu.
Doğruydu ama her gün aynıydı ve "başladın" hâli hiçbir şey önermiyordu. Şimdi
ana sayfanın zaten bildiği veriden bir **öneri** çıkıyor ve kurallar sıralı,
ilk tutan kazanıyor:

| Sıra | Kural | Koşul | Dokunuş |
| --- | --- | --- | --- |
| 1 | Sınava yakın | kalan gün ≤ 7 her gün; 8–30 gün aşırı | soru |
| 2 | Seri kırılıyor | dün hedef tuttu, bugün 0 | soru |
| 3 | Seri sürüyor | bugün ve dün hedef tuttu | soru |
| 4 | Banka bekliyor | çözülmemiş yanlış var, bugün çalışılmış | yanlış bankası |
| 5 | Tek derse yığılma | ≥ 20 soru ve %80'i tek dersten | soru |
| 6 | İhmal edilen ders | son 30 günde çalışılmış, 7+ gündür yok | soru |
| 7 | Deneme zamanı | son deneme 10+ gün önce (ya da hiç yok, 7+ günlük geçmiş var) | denemeler |
| 8 | Temel | eski üç hâl | soru |

Sıra puanla değil listeyle: "neden bunu söyledi" sorusuna sıralı liste cevap
verebiliyor, puan veremiyor. Sınav en önde ama son hafta dışında **gün aşırı**: otuz gün her sabah aynı
"sınava N gün" cümlesi kartı takvime çevirir ve öteki öneriler tam en gerekli
dönemde hiç görünmezdi. Seri ondan sonra çünkü kırılan alışkanlık en pahalı
kayıp.

Her kuralın birden çok cümlesi var ve seçim **günün tarihinden** türeyen bir
sayıyla yapılıyor: kart gün içinde sabit, günden güne değişiyor. Rastgele
olsaydı her yeniden çizimde başka cümle söylerdi.

Ders adına **ek getirilmiyor** ("Kimya 9 gündür bekliyor", "Kimya'ya … " değil):
ünlü uyumu ders adına göre değişiyor ve yanlış ek, yanlış bilgiden daha çok
göze batıyor.

Sayının kendisi kartta **yazmıyor**: halka zaten sayıyı üç kez söylüyor ve
kartın işi onu tekrar etmek değil, ona bir yüz vermek. Günlük hedef sıfırken
kart çizilmiyor: ölçülecek bir eşik yokken "ulaştın" da "ulaşmadın" da
anlamsız.

## Ana sayfadaki dört kutucuk

İki bölüm de (Araçlar, Oyunlar) dört kutucuk gösteriyor ve ikisi aynı koddan
besleniyor (`lib/son-kullanilan.ts`): sıra **en son kullanılan** başta.

**Sabitleme kaldırıldı, geri gelmiyor.** Bir süre kutucukların altında bir
"Düzenle" düğmesi vardı; açtığı pencereden en fazla dört kutucuk sabitleniyordu
(`kisayol-duzenle.tsx`, `sabitliKisayollar`, `rabi-sabit-araclar` /
`rabi-sabit-dersler`). Hepsi silindi, iki anahtar da `ESKI_ANAHTARLAR`a taşındı.

Gerekçe: kutucuk zaten bir kısayol, kısayolun kısayolu yok. Sekiz aracın
dördünü elle seçmek, "Tümü"nün arkasındaki listeden bir tane daha kurmaktı;
üstelik seçim yapan kullanıcının ana sayfası donuyordu — sabitlenen dört kutucuk
hiç değişmediği için son kullanılanların girecek yeri kalmıyordu. Sıralamayı
kullanımın kendisi belirliyor, ayrıca kurulacak bir tercih yok.

Yeniden bir düzenleme kapısı eklemeden önce sorulacak soru şu: dört kutucuğu
kullanıcıya seçtirmek, kullanmakla belirlenen sıradan daha mı iyi bir sıra
üretiyor?

### Oyun kutucukları oyunu değil dersi gösteriyor

Kutucuklar bir süre oyunların adını yazıyordu ve iki sorun birden vardı:
"Anlatım Bozukluğu" 64 piksellik bir kutunun altında üç satıra iniyordu, ve
dokunuş zaten oyunu açmıyor Oyunlar sekmesini açıyordu — yani kutucuk gidilecek
yerin değil, orada bulunabilecek bir şeyin adını taşıyordu.

Artık kutucuk dersin kendisi: adı kısa, rengi `DersTanimi.aile`den ("renk derse
aittir" kuralının doğrudan karşılığı) ve dokunuşun karşılığı tam olarak o
dersin ızgarası — `onOyunlaraGit(ders)` sekmeyi açarken `acilacakDers`i de
geçiyor. İstek `oyunlar.tsx` içinde bir kez tüketiliyor; prop doğrudan
okunsaydı geri tuşu dersi kapatır, bir sonraki çizim aynı dersi yeniden açardı.

Ders kutucuklarının geçmişi ayrı tutulmuyor, oynanan oyunlardan türetiliyor
(`oyunlarinDersleri`): ikinci bir "son açılan ders" listesi aynı bilgiyi ikinci
kez saklamak olurdu ve iki liste zamanla birbirinden ayrılırdı.

## Yapılacaklar: günün üç dilimi

Araçlardaki görev listesi (`lib/yapilacaklar.ts`, ekran
`components/ekranlar/yapilacaklar.tsx`, tasarım
`tasarim/yapilacaklar-v3.dc.html`). Üstte haftanın yedi günü, altında noktalı
kâğıt üstünde **Sabah / Öğle / Akşam** bölümleri, görev eklemek alttan açılan
bir sayfada.

Burası bir süre **tahtaydı**: not kâğıtları sürükleniyor, konum da kullanıcının
verdiği bilgi sayılıyordu ("bunlar okul, şunlar ev"). 390 piksellik bir tahtada
on kâğıt, okunmak için yerleştirilmesi gereken on kâğıt demekti — kullanıcı işini
yazmak yerine tahtayı düzenliyordu. Gruplama da konumdan okunmuyordu: iki kâğıdın
yan yana durması ancak onu koyan kişiye bir şey söylüyor, ertesi gün ona da
söylemiyor. Yeni düzen gruplamayı konuma değil **zamana** bağlıyor; günün
kendisinde gerçekten var olan tek sıra bu. Konum alanları (`x`, `y`) kalktı,
eski kayıtlar `gorevleriNormalize` ile taşınıyor (kâğıtlar kalıyor, konumları
atılıyor).

### Sınır dilim başına on

`EN_COK_GOREV` **bir günün bir dilimi** için geçerli, gün için değil: on işi
sabaha yığmak bir plan değil istek listesi, ama sınırı günde ona indirmek üç
dilimi anlamsızlaştırırdı — sabahı dolduran akşama hiç yazamazdı. Sınır iki
yerde birden duruyor: `gorevEkle` eklemeyi engelliyor (ve dolu dilimin `+`
düğmesi pasif), `gorevleriNormalize` de kayıttan okurken fazlasını eliyor —
kurcalanmış bir kayıt yüzünden ekranda "11/10" yazmasın diye.

### Metin tek satır, sınır ölçüyle konuyor

`EN_UZUN_GOREV` = 24 karakter ve bu sayı tasarımdan değil **satırın
kendisinden** geliyor: solda tik yuvarlağı, sağda yıldız ve erteleme düğmeleri
varken metne kalan yer 375 piksellik telefonda ~198 piksel, Nunito 700/14,5'te
Türkçe küçük harfli metin de karakter başına ~7,4 piksel. Satır ayrıca
`truncate` ile kırpılıyor: büyük harfli metin karakter başına ~9,6 piksel
tutuyor ve karakter sınırı tek başına yetmiyor.

İkisi **birlikte** değişir: sınırı büyütmek isteyen önce satırdaki düğmelere yer
bulmalı. Yeni bir düğme eklemek de metni daraltır, yani sınırı düşürür.

Görev metni **düzenlenemiyor**, silinip yeniden yazılıyor: satır tek satırlık bir
iş adı taşıyor ve yirmi dört karakteri düzeltmek, her satıra ikinci bir kalem
düğmesi koymaktan hızlı.

### Kayıt haftalık, geçmiş salt okunur

Tahta **günlükti**, gün dönünce kâğıtlar siliniyordu; gerekçe "dün yazdığını
bugün de gören kullanıcı biriken ve hiç bitmeyen bir listeye bakıyor" idi.
Gerekçe duruyor ama hafta şeridi ileriye plan yazdırıyor, yani "bugün" tek başına
yetmiyor. Kayıt bu yüzden **haftalık**: `haftaninGorevleri` içinde bulunulan
haftanın pazartesisinden eskisini eliyor. Şerit zaten o haftayı gösteriyor, daha
eskisine ulaşan bir yol yok — tutulsaydı görünmeyen bir birikim olurdu. Her
pazartesi liste sıfırlanıyor, bitmemiş işler de gidiyor.

Hafta dönümü zamanlayıcıyla değil **türetmeyle** yakalanıyor (`AppShell`):
uygulama kapalıyken çalışmayan bir `setTimeout`'a güvenilmez. Elenen görevler bir
etkiyle kayıttan da siliniyor, yoksa yedeğe girerlerdi.

Geçmiş günler salt okunur: ekleme, işaretleme, yıldız ve erteleme düğmeleri
orada hiç çizilmiyor. Dün yapılmamış işi bugün işaretlemek geçmişi düzeltmek
olur — o iş yapılmadı, ve erteleme varken buna gerek de yok.

Ay takvimi **yok**. Soru Takibi'nde var çünkü orada eski günlere bakmanın bir
karşılığı var; burada kayıt bir haftadan eskisini tutmuyor, açılan takvim boş
günler gösterirdi.

### Ekleme düğmesi her bölümde

Tasarım `+` düğmesini yalnızca içinde bulunulan dilime koyuyor; o zaman dolu ama
sırası geçmiş bir bölüme ikinci bir görev yazmanın yolu kalmıyor (boş bölümün
kesikli düğmesi de yalnızca boşken çıkıyor). Düğme bu yüzden her bölümde;
tasarımın vurgusu duruyor — şimdiki dilimin düğmesi dolu turuncu, ötekiler
sessiz. Hangi dilimde olunduğu `simdikiDilim` ile saatten çıkıyor ve saat
dışarıdan veriliyor, yoksa saf kalmazdı.

Erteleme görevi **ertesi güne, aynı dilime** taşıyor ve hedef dilim doluysa
`gorevErtele` `null` dönüyor: sessizce yutulan bir erteleme, kullanıcıya işin
ekrandan kaybolduğunu gösterirdi. Ekran bu yüzden bir toast taşıyor — ertelenen
görev bulunduğu günden çıkıyor ve nereye gittiğini söyleyen tek yer o cümle.

Ekleme sayfası **"Ne zaman?" diye sormuyor**: dilim, basılan `+` düğmesinin
bölümünden geliyor. Sayfada bir süre üç dilimlik bir seçici de vardı; kullanıcı
kaldırılmasını istedi — "Akşam"ın düğmesine basan kullanıcı cevabı zaten
vermişti. Dilimin adı sayfanın başlığında gün etiketinin yanında yazıyor
("Bugün · Akşam"), görev nereye gideceği görünmeden kaydedilmiyor. Başka bir
dilime yazmak isteyen o bölümün düğmesine basıyor.

### Görevin süresi soruluyor

Ekleme sayfası "Ortalama kaç dakika sürer?" diye soruyor (`Gorev.sure`,
çipler `SURE_SECENEKLERI`: 15–120). Dilim başlığı bitmemiş görevlerin toplamını
yazıyor (`kalanSure`), satırda süre kategorinin yanında duruyor — iş adının
satırı tek satırlık ve genişliği sayılı, oraya sığmazdı. Plan, işlerin ne kadar
süreceği bilinince plan oluyor; "akşama beş iş" ile "akşama dört saat" ayrı
şeyler.

Çip, serbest sayı değil: sorulan bir tahmin ve "37 dakika" kimsenin vereceği
bir cevap değil. Varsayılan seçili gelmiyor — seçili bir "30 dk", kullanıcının
hiç vermediği bir tahmini onun adına kaydederdi. İki saatin üstü yok: o tek bir
görev değil, bölünmesi gereken bir iş.

Alan sonradan geldi: eski görevlerde `sure` `null` ve toplamda sayılmıyor.
Uydurma bir süre, dilimin toplamını kullanıcının söylemediği bir sayıyla
şişirirdi.

### Renkler ayrı bir palette

Görev rengi kullanıcının seçtiği on iki tondan biri (`--gorev-*`,
`globals.css`). Ders aileleri kullanılamıyor: `--edb-koyu` "bu Kimya" demek ve
bir görevi mor yapmak onu Kimya görevi yapmaz. Tonlar uygulamanın kendi
sıcak-mat ailesinden ama hepsi beyaz kartın üstünde **en az 4,6:1** veriyor;
şart, çünkü renk yalnızca noktada değil 10,5 piksellik kategori yazısında da
kullanılıyor. Yeni ton eklerken kontrastı ölç.

Kayıtta rengin **adı** duruyor, hex değil: palet değişirse eski görevler de yeni
tonu alıyor, yoksa uygulama iki paletle birden yaşardı.

### Depo anahtarı ve yedek alanı `notlar` kalıyor

`rabi-notlar` ve `Yedek.notlar` adları tahta döneminden kalma ve öyle kalıyor —
kimliği değiştirmek kullanıcının kayıtlı görevlerini öksüz bırakır, eski
yedeklerin o alanını da okunmaz yapardı (rozet/başarım ile aynı kural). Şemayı
`gorevleriNormalize` çeviriyor, yani tahta dönemindeki yedekler de geri
yükleniyor.

> Dosya adı `notlar.ts` **olamaz**: `.gitignore` kişisel notlar için `notlar.*`
> deseni taşıyor ve desen tüm ağaçta geçerli. Öyle adlandırılan bir kaynak dosya
> hem depoya girmiyor hem Tailwind'in tarayıcısından düşüyor. Bir dosyayı yeniden
> adlandırdıktan sonra `npm run build`'i **tekrar çalıştır**: Tailwind kaynak
> listesini derleme başında kuruyor, eski çıktı hatasız ama sınıfsız kalıyor.

## Konu Anlatımı Maarif müfredatına bağlı

Müfredat **Türkiye Yüzyılı Maarif Modeli** — eski (2018) programın ünite
adları hiçbir yerde geçmiyor. Tema adları programın kendi adları; içerik
dosyalarının başındaki yorumlar, eski programdan **neyin taşınmadığını** da
yazıyor (Kimya 9'da mol yok, Biyoloji 10'da kalıtım yok, Matematik 10'da
polinom yok). Yeni bir konu eklemeden önce o yorumu oku: eski müfredattan
hatırladığın bir başlık, bu programda başka sınıfta olabilir.

İçerik `lib/konu/icerik/<sınıf>-<ders>.ts`. Yedi ders × iki sınıf; sekizinci
bir ders eklemek `KonuDersId` ile birlikte yeni bir renk ailesi de gerektirir
(Fizik'in `fzk` ailesi bu yüzden açıldı — oyunlarda Fizik yok).

### Konu listesi yazılmıyor, çekiliyor

Konu adları ve sıraları bir süre hafızadan yazıldı ve program tutmadı: eski
(2018) programın başlıkları karıştı, tema sırası kaydı (Matematik 9'da
Algoritma üçüncü, Geometrik Şekiller dördüncü duruyordu; programda tersi).
Hata **arada bir** değil sürekliydi ama kimse fark etmedi, çünkü karşılaştırma
yapan bir şey yoktu.

Ölçü artık `lib/konu/maarif/iskelet.json`: `scripts/maarif-cek.mjs` bunu
tymm.meb.gov.tr'deki İçerik Çerçevesi'nden çekiyor (ders → sınıf → tema →
konu, ayrıca anahtar kavramlar ve öğrenme çıktıları). Dosyayı **elle
düzenleme**; müfredat değişince betiği yeniden çalıştır. Hedef kataloğundaki
ETL ile aynı gerekçe: yazılan ölçü bayatlıyor, çekilen ölçü bayatlamıyor.

`maarif.test.ts` tema ve konu listelerini bu iskelete göre denetliyor. Dört
incelik:

- **Eşitlik değil örtüşme aranıyor.** Programın kendi başlıkları haritada
  gösterilemeyecek kadar uzun ("Türkistan'dan Türkiye'ye Uzanan Süreçte Türk
  Devlet ve Ordu Teşkilatında Meydana Gelen Değişim" 95 karakter). Uygulama
  kısaltılmış adı yazıyor, test o adın programdaki karşılığıyla kelime
  örtüşmesini ölçüyor. Kısaltırken konuyu tanıtan kelimeleri atma — test iki
  kez tam da bunu yakaladı.
- **Türk Dili ve Edebiyatı konu listesi denetlenmiyor**
  (`KONU_LISTESI_DENETLENMEYEN`). O dersin İçerik Çerçevesi konu değil
  **beceri** sayıyor: dört temanın dördünde de yalnızca "Okuma, Yazma,
  Dinleme/İzleme, Konuşma" yazıyor. Bunları konu yapmak haritaya on altı
  düğüm koyup dördünü tekrar etmek olurdu. Tema adları ve sırası bu derste de
  denetleniyor.
- **Sınıf sayfasının adresindeki sayı ders başına kayıyor.** Kimya'da 11
  dokuzuncu sınıf, Türk Dili ve Edebiyatı'nda 11 dokuzuncu ama 10 hazırlık.
  Betik sınıfı adresten türetmiyor, sayfanın `<title>`'ından okuyor.
- **İçerik Çerçevesi'nin biçimi derse göre değişiyor** ve dördü de
  destekleniyor: Kimya kalın başlık + virgüllü liste, Biyoloji kalın başlık +
  bir alt satırda liste, Matematik tamamı kalın maddeler + açıklama cümleleri,
  Fizik/Tarih/Coğrafya ayraçsız satırlar. Ayrıştırıcıdaki her kural bu
  biçimlerden birinin bozduğu bir çıktıyı düzeltmek için var; birini
  değiştirmeden önce `scripts/maarif-cek.mjs` içindeki yorumları oku.

### Kart uzunluğu kuralın kendisi

Kartlar ders notu değil, bir konuda akılda kalması gereken birkaç şey.
Uzunluk `icerik.test.ts` ile denetleniyor (başlık 44, metin 240 karakter;
konu başına en fazla 8 kart) ve bu sayılar keyfî değil: kart telefonda
kaydırmadan okunacak kadar olmalı. Sınırı aşan kart, ikiye bölünmesi gereken
karttır — sınırı büyütmeden önce kartı böl.

### Kayıt kartın metnini de saklıyor

Kart kimliği `${konuId}-${sıra}`; ortaya kart eklemek sonraki kartların
kimliğini kaydırır. Bu yüzden bilinmeyenler bankasındaki kayıt kartın
**başlığını ve metnini kendi içinde** taşıyor. Kimlik yalnızca aynı kartın
iki kez eklenmesini önlüyor; içerik güncellendiğinde kullanıcının kaydettiği
bilgi yerinde kalıyor. Yeni bir kart alanı eklersen (görsel, formül) onu da
kayda koy, kimliğe güvenme.

### Kilit var, anahtarı kullanıcıda

Konular sırayla açılıyor: bir konu, bir öncekinin kartları okunup soruları
geçilmeden (`GECME_ORANI`, %50) açılmıyor (`konuKilitli`, `lib/konu/ilerleme.ts`)
ve kitabı haritada renksiz duruyor. Sorusu olan konuda **cevaplanmamış**
yoklama geçilmiş sayılmıyor (`konuTamam`) — `soruOrani`nin `null`ü "soru yok"
ile "girilmedi"yi ayırt etmiyor, ayrım soru sayısından yapılıyor.

Kilitli kitabın kartındaki düğme **"Kilidi aç"** ve doğrudan açmıyor: önce
onay penceresi uyarıyor (önceki konuları okuyup sorularını geçerek gelmek
daha sağlıklı, kartlar onların üstüne kuruluyor) ama kararı kullanıcıya
bırakıyor. Kapı bir ara tümüyle kapatıldı ve geri açıldı: sınav
hazırlığındaki öğrenci yarın işlenecek konuya bugün bakabilmeli. Kartın
içinde ayrıca sarı bir uyarı paragrafı vardı, kaldırıldı — uyarıyı onay
penceresi söylüyor. Açılan kilit kayda giriyor (`acildi`), uyarı aynı konuda
ikinci kez çıkmıyor.

Eşik %80'den %50'ye indi: destede üç-altı iddia var ve seksen demek altı
sorunun beşi demekti; tek yanlış konuyu kilitliyor, öğrenci aynı yoklamayı
üst üste veriyordu.

Haritanın tepesinde bir süre "Kaldığın yer" kısayolu duruyordu; kaldırıldı.
Ekranın işi seçtirmek ve seçilecek yer zaten patikanın kendisi — kısayol,
haritanın gösterdiği sırayı ikinci kez ve tek bir konuya indirgeyerek
anlatıyordu.

Tamamlanma destenin sonuna gelmekle kazanılıyor. Yarıda çıkılan destede
işaretlenen kartlar bankaya düşüyor ama konu bitmiş sayılmıyor — yoksa ilk
kartı işaretleyip çıkmak konuyu tamamlamanın yolu olurdu.

### Destenin arasına mola ve hızlı kontrol giriyor

Deste yalnızca kart değil (`tasarim/bilgi-karti.html`, akış
`lib/konu/deste-akisi.ts`): kartların arasına bir **kısa mola** (Rabi
zıplıyor, okunan kartların adları listeleniyor) ve bir–iki **hızlı kontrol**
(okunmuş bir karttan iki şıklı soru) giriyor. Üç ekranın başlığı ortak
(`deste-basligi.tsx`), zemin dersin rengi, vurgu dersin mürekkebi
(`bicim.murekkep`) — mockup Fizik'in mavisiyle çizildi, o mavi burada derse
göre değişiyor.

- **Yer rastgele, kenarlar yasak.** Ara ekran ilk iki ve son iki kartın
  arasına girmiyor: ikinci karttan sonraki mola okuma başlamadan verilen bir
  mola, son karttan önceki kontrol soru sahnesiyle üst üste biniyor. Yer
  yoksa (üç kartlık deste) ara ekran hiç yok. Rastgelelik deste açılırken
  bir kez atılıyor ve `Math.random` `desteAkisi`nin **dışından** geliyor —
  test aynı yerleşimi görebilmeli.
- **Ara ekranlar kart sayılmıyor.** `okunan` ve bölmeli çubuk yalnızca
  kartları sayıyor; Geri ara ekranı atlayıp bir önceki karta dönüyor.
- **Kontrol sayısı kartla orantılı**: on karttan uzun destede iki, kısasında
  bir (`icerik.test.ts`). Her kontrol dayandığı kartı (`kart`) söylüyor; o
  kart okunmadan sorulmuyor ve "Tekrar oku" oraya dönüyor. Yanlışta "Devam
  et" önce uyarıyor ("Kartı atlıyorsun") ama engellemiyor — kilitli kitabın
  onay penceresiyle aynı kural.
- **Mola metni beş varyasyondan biri** (`MOLA_METINLERI`), destede bir kez
  seçiliyor. Konfeti yok: mockup'ta vardı, ama her destede patlayan kutlama
  oyunlardaki rekor konfetisini sıradanlaştırırdı. "+10 puan" satırı da
  alınmadı — puan sistemi yok (bkz. **Seviye, havuç ve mağaza kaldırıldı**).
- **Kartın etiketi ve Rabi'nin notu** (`BilgiKarti.etiket`, `not`) isteğe
  bağlı: etiket yoksa "Kart 3/7" yazıyor, not yoksa balon da maskot da
  çizilmiyor. Boş balonun yanındaki tavşan söyleyecek sözü olmayan bir
  rehber gibi durur. Not **her konuda bir kartta** var, her kartta değil:
  konunun en çok tuzak barındıran kartına "nasıl okunmalı" cümlesi. Her
  karta yazılsaydı tavşan destenin her sayfasında konuşur, sözü değerini
  yitirirdi. Yeni konuya da tek not; 120 karakter sınırı testte.

### Kart sayısı konunun genişliğine göre: 6–16

Konu başına kart sayısı bir süre en fazla sekiz, sonra on'du ve konunun
genişliğine bakmıyordu. Aralık artık 6–16 (`icerik.test.ts`): taban
"konuyu anlatmaya yetmeyen deste", tavan "yarıda bırakılan deste" sınırı.
Tavan hedef değil — tavanı doldurmak için kart yazmak desteyi uzatır. Kartın
ölçütü şu: öğrencinin sınavda ya da konuyu anlamada **işine yarayan** bir
şey söylüyor mu? Söylemiyorsa yazılmıyor; kart uzunluğu sınırı da aynı
sebeple duruyor.

### Deste bitince doğru/yanlış soruluyor

Her konunun sonunda üç-altı **iddia** geliyor ve iki düğme var: Doğru, Yanlış
(`components/konu/soru-sahnesi.tsx`). Soru cümlesi kurulmuyor — `icerik.test.ts`
soru işaretini reddediyor — çünkü ekranda "evet/hayır" değil "doğru/yanlış"
yazıyor ve ikisi aynı şey değil.

Biçim kasten dar: deste okunduktan sonra gelen ekran ikinci bir ders değil bir
yoklama. Üzerinde düşünülen, hesaplanan ya da şıkları elenen bir soru, okumanın
arkasına bir sınav ekliyor ve destenin sonu "bitti" değil "şimdi de bu var"
oluyordu.

Ekran bir süre **çevrilen** bir kart gösteriyordu: bir yüzünde soru, öteki
yüzünde cevap ve kararı kullanıcı kendi veriyordu ("bildim / bilmedim"). O sayı
bilmeyi değil beyanı ölçüyordu — cevabı gördükten sonra "bildim" demek serbest.
Cevap artık `SoruKarti.dogru` içinde ve ekran kararı kendisi tartıyor.

**Karar pencere açmıyor, sıradaki soru kendiliğinden geliyor** (tasarımın 3a
yönü, `tasarim/soru-sahnesi.html`). Bir süre karardan sonra kartın altında
gerekçe şeridi çıkıyor ve "Devam" bekliyordu; her soruda bir dokunuş daha,
yoklamayı okumanın arkasına eklenen ikinci bir ekran gibi uzatıyordu. Şimdi
kararın karşılığı kartın kendisinde: amber paspartu yeşile ya da kırmızıya
dönüyor, köşeye ✓/✕ rozeti düşüyor, doğru şık her hâlde yeşile, seçilen
yanlış kırmızıya boyanıyor ve `BEKLEME` (850 ms) sonra sıradaki soru
geliyor. Gerekçe (`aciklama`) içerikte **duruyor** ve testi hâlâ zorunlu
tutuyor — ekranda gösterilmiyor; geri getirilecekse 3b/3c'deki gibi bir
katman gerekir, kartın altına sığmaz.

Sahne aydınlık: krem, ince çizgili kâğıt zemin; sayfanın kenarında amber çift
çerçeve; kartın çevresinde amber paspartu. Bir süre uygulamanın tek koyu
yüzeyiydi ("aydınlık zeminde kart zeminle aynı renkte kalıyor" diye); tasarım
o işi renkle değil işlemeyle çözdü. Renkler `globals.css`teki `.sahne`
bloğunda; #d09b34 Matematik'in `--isl-ok`u ile aynı sayı ama o değişkene
bağlanmadı — burada ders rengi değil, işlemenin rengi.

Testler içeriği değil **dengeyi** denetliyor, çünkü biçimin kendi tuzağı var:
yazı tura atan da yarısını tutturur. Her destede iki cevap da bulunmak zorunda
ve uygulamanın tamamındaki doğru oranı %40–60 arasında kalıyor — tek yönlü bir
deste, cevabı içeriğe bakmadan verdiriyor.

Sorular da bilgi kartlarındaki `Gorsel` türlerini kullanıyor ve ayrı bir çizim
dili açılmadı. Görselli soruda iddia **çizime bakılarak** tartılabilmeli:
grafiğin fonksiyon olup olmadığı, eğrinin hangi yöne gittiği, şemadaki sıra.
İddiayı olduğu gibi tekrar eden bir çizim cevabı okumadan verdiriyor — bu
yüzden tablo görsellerinin iddiası çoğunlukla **yanlış** olan iddia: okuyan onu
tabloyla karşılaştırıyor.

Kararın rengi kartın çerçevesinde değil **paspartusunda**: kart, çevresindeki
7 piksellik amber dolgunun içinde duruyor ve renklenen o dolgu. Eskiden kartın
kendi `outline`ı boyanıyordu (`ring` gölge olarak uygulandığı için `golge-kart`
onu eziyordu). Rozet paspartunun dışına taşıyor; kaydırma kutusunun üstünde ve
yanlarında pay var, paysız `overflow` rozeti kırpıyordu.

### Yoklamada iki soru biçimi, sayısı kart sayısına bağlı

Sahne bir süre yalnızca doğru/yanlış iddia soruyordu; "hangisi" diye
sormak mümkün değildi (Pisagor üçlüsü hangisi, hangi organel ATP üretir).
`SoruKarti` artık iki biçimden biri: **iddia** (`soru()`, Doğru/Yanlış) ya da
**iki şıklı soru** (`sikli()`, A/B). Şık sayısı ikide kalıyor — dört şıklı
soru okumanın arkasına bir sınav ekler; hızlı kontrolle aynı kalıp. Sahne iki
biçimi tek koddan çiziyor: karar bir sayıya iniyor (`secim`/`beklenen`),
rozet, paspartu ve düğme tonu ikisinde de aynı.

Soru sayısı **kart sayısıyla orantılı** (`icerik.test.ts`): en az kart+1,
en çok kart×1,3+1 — altı kartlık konuda yedi–sekiz, on altı kartlıkta yirmiye
yakın. Sabit dört soru kısa konuyu sınava çeviriyor, uzun konunun yarısını
yoklamadan bırakıyordu. Her konuda iki biçimden en az ikişer tane var; A/B
ve doğru/yanlış dengesi bütünde %40–60 arasında tutuluyor — tek yönlü deste
cevabı içeriğe bakmadan verdirir.

### Deste bir biletle kapanıyor

Üç ekran var: destenin kapanışı — **yoklama bileti**
(`components/konu/yoklama-bileti.tsx`, `tasarim/yoklama-bileti.html`) —,
soruların kendisi ve yoklamanın kapanışı (ikisi `soru-sahnesi.tsx` içinde,
`Kapanis`). Kapanış bir kez gidip geldi: koyu sahnedeki ilk hâli (`Sonuc`:
maskot, iki sayı, "Haritaya dön") kullanıcı isteğiyle kaldırılmış, son
sorudan sonra sahne doğrudan haritaya dönüyordu; tasarım gelince kâğıt
zeminli yeni hâliyle geri geldi (aşağıda **Kapanış kâğıt zeminde**).

Bilet bir süre yoktu ve yokluğu bilinçliydi — "arada duran bir 'deste
bitti' ekranı, okumayla soruyu birbirinden ayıran fazladan bir dokunuş".
Fazladan dokunuşun bedeli doğruydu, ayrılmayan iki işin bedeli hesaba
katılmamıştı: son kartta "İlerle"ye basan kullanıcı dersin aydınlık
destesinden koyu sahnedeki bir **iddianın üstüne** düşüyordu. Okumayı
bitirdiğini sanan kullanıcı kendini cevaplayacağı bir şeyin karşısında
buluyordu; aradaki dokunuş gecikme değil, sonraki ekranın ne olduğunu
söyleyen tek yer.

Önce koyu sahnenin kendi ilk ekranıydı (`Giris`); tasarım onu destenin
**aydınlık** tarafına aldı: bembeyaz zemin, ortada koyu bir bilet, kupayı
kaldıran Rabi biletin arkasından çıkıyor, sağ üste "BİTTİ" damgası
basılıyor, koçanda üç sayı (kart, soru, ~dakika) ve dolan bir %100 halkası.
Perde (`sahne-iner`; sahne o zaman koyuydu, şimdi krem) "Yoklamaya başla"
denince iniyor; iki kök ayrı `key` taşıyor, yoksa React aynı `div`i yeniden
kullanır ve perde hiç oynamazdı.

- **Bilet dersin değil uygulamanın rengi.** Mockup Fizik'in lacivertiyle
  çizildi ve üstte dersin rengine boyalı noktalı bir bant vardı; uygulama
  bir süre yedi derse yedi bilet taşıdı (şarap+nane, mor+limon, kahve+
  turkuaz…), sonra tek bir koyu kızıl kahve + altın bilete indi
  (`--bilet*`). Kullanıcı onu da geri aldı: bilet artık uygulamanın kendi
  paletinde — zemin `--background`, bilet `--card`, yazı ve damga
  `--primary`, dolgular (üst şerit, halka, tik) `--primary-parlak`. Ayrı
  bir bilet paleti yok; koyu bilet açık zeminli uygulamada tek koyu
  yüzeydi. Bileşen bu yüzden `bicim` almıyor ve `SoruSahnesi` de
  almıyor — koyu sahne zaten derse göre renk almıyordu, bilet de almıyor.
- **Koçan çentiği gerçek bir satırda.** Mockup çentiği `mask-image` ile 177
  piksele kesiyordu; konu adı iki satıra kırılınca çizgi kayar, çentik
  kalırdı. Çentik kesik çizginin kendi satırındaki iki daire, `overflow`
  dış yarısını kırpıyor.
- **Halka hep %100**: bilet yalnızca deste sonuna kadar okununca geliyor.
- **Bilet destenin ucundan gelince var, turuncu kitaptan girince yok**
  (`SoruSahnesi.biletli`). Bilet destenin kapanışı, yoklamanın girişi
  değil; haritadan doğrudan soruya giren kullanıcı bir şey okumadı ve
  "okundu" diyen bir bilet ona yalan söylerdi. Oradan sahne ilk soruyla
  açılıyor.
- **Üç efekt, üçü de damgaya bağlı** (kullanıcı seçti): koçandaki sayılar
  sıfırdan sayarak doluyor, damga basılırken kısa bir titreşim
  (`lib/titresim.ts`, manifestte VIBRATE izni), ardından biletin üstünden
  bir kez altın toz süzülüyor (`bilet-toz`). Damganın sesi de vardı (alçak
  bir "tak", oyun sesleri anahtarına bağlı); kullanıcı kaldırdı, titreşim
  tek başına yetiyor. Konfeti değil — konfeti oyunlardaki rekora ait.
  Bileşendeki `DAMGA_MS`/`TOZ_MS`, `globals.css`teki damga ve basınç
  gecikmeleriyle eşleşmeli; titreşim görüntüden önce gelirse neyi
  doğruladığı anlaşılmıyor. `prefers-reduced-motion` altında sayılar dolu,
  damga basılı, toz yok; titreşim hareket olmadığı için kalıyor.
- **"Bu destede öğrendiklerin" alt sayfa**, biletin içinde liste değil: on
  altı kartlık konuda liste bileti taşırırdı.
- **"Haritaya dön" düğme değil yazı.** Deste zaten okundu ve kaydı yazıldı;
  yoklamayı vermemek konuyu okunmamış yapmıyor. İki dolu düğme yan yana
  dursaydı hangisinin ileri götürdüğü okunmazdı — kurulumdaki "Şimdilik
  atla" kuralı. Yazı bir süre "Şimdi değil"di; nereye gidildiğini
  söylemiyordu. Çıkış da kapanış ekranındaki perdeyle (`kapanis-cikar`,
  `cikiyor` bayrağı `SoruSahnesi`den geliyor): bilet tek karede sökülünce
  kullanıcı haritaya döndüğünü değil atıldığını görüyordu.

`SahneSonucu.bitti` bu yüzden var: yarıda bırakılan yoklama ilerlemeye sayı
**yazdırmıyor** (`konu-haritasi.tsx`), destenin kuralının aynısı. Bayraksız
hâlde bilette "Haritaya dön" diyen kullanıcının kaydına, hiç verilmemiş bir
yoklamanın "0 doğru"su geçiyordu.

### Kapanış kâğıt zeminde

Kapanış (`Kapanis`, tasarımı `tasarim/soru-kapanis.dc.html` → 2a) koyu
sahnede **değil**: krem kâğıt, defter çizgisi, altın etiketler
(`globals.css` → `.kapanis`). Yoklamanın sonu bir sınav sonucu değil
çevrilen bir sayfa. Koyu sahne giriş ve sorularda kalıyor; iki yüzeyin sınırı
"Bitir"e basılan an. Kapanış bir süre hiç yoktu (kullanıcı "şimdilik bitiş
ekranı yok" demişti); bu ekran o boşluğa tasarımla geldi — kaldırılan koyu
özetin geri dönüşü değil.

Ekranda dört şey var: sıfırdan dolan isabet halkası, üç kutu (doğru · yanlış
· süre), yanlış bilinen soruların listesi ve tek düğme. Halkanın rengi ile
başlık **kademeden** geliyor (`lib/konu/kapanis.ts`: harika ≥ %90, iyi ≥
geçme sınırı, altı tekrar) ve eşikler haritadaki yıldızlarla **aynı** — iki
ekran aynı sonucu iki ölçekle okumasın. Süre ilk soruya geçilince başlıyor,
girişteki okuma sayılmıyor; "Bitir"de donuyor. Yanlış listesi üçle kesiliyor,
kalanı sayılıyor — altı yanlış düğmeyi ekranın altına itiyordu. Maskot
kademeye göre seviniyor ya da düşünüyor; tasarım tek pozla çizildi ama
yarısı yanlış çıkan yoklamanın üstünde zıplayan bir tavşan sonucu değil
ekranı kutlardı.

### Alt menüde kendi sekmesi

Bölüm kapalı betada bir süre bayrakla gizliydi (`KONU_ANLATIMI_ACIK`,
`lib/beta.ts`): sürüm planı (#82) onu 0.7.0'a ayırmıştı. 0.7.0 ile açıldı ve
bayrak `beta.ts`'in kendi kuralına göre dosyadan düştü.

Harita alt menüdeki beşinci sekme (**Harita**, Araçlar ile Oyunlar
arasında, menünün ortasında; kod tarafı `konu` kalıyor). Önce ana sayfada "Bilgi Kartları"
başlıklı kendi kartıyla açılıyordu — Araçlar şeridine kutucuk olarak
konsaydı son kullanılanlarla sıraya girip kayacaktı — sonra kullanıcı onu
alt menüye istedi ve ana sayfadaki kart kalktı: iki kapı aynı yere
açılıyordu. Bölüm `KARTLAR` listesinde **yok**. Bilmediklerim de ayrı bir
araç değil, haritanın içinde: kartlar oraya buradan düşüyor.

Sekme açılırken ayrıca bir karşılama yok. Bir süre Rabi bir buçuk saniye
ekranın ortasında beliriyor, harita arkasında kararıyordu; kullanıcı
kaldırdı — her açılışta beklenen bir buçuk saniye, haritaya giden yolu
uzatıyordu.

### Patika kitaplı bir yol

Harita (`components/ekranlar/konu-haritasi.tsx`) bir oyun dünyası gibi
çiziliyor (`tasarim/konu-haritasi.html`): kitapların altından geçen kıvrımlı
bir yol, geçilen kısmı bir tık koyu; her basamak bir **kitap** — yeşil
kapaklı tek kitap anlatıma, turuncu kapaklı eğik kitap çifti sorulara
açılıyor; kilitli kitap gri. Yol son kitapta bitmiyor, biraz daha sürüp bir
**hazine sandığında** duruyor (`Sandik`, elle çizilmiş SVG; kilitli kitap
gibi gri, bütün konular bitip testleri geçilince renklenip kapağı açılıyor) — eskiden bayraklı bir bitiş dairesi vardı. Kitabın
rengi **işe** ait ve derse göre
değişmiyor: yedi derste yedi kitap rengi, "yeşile bas, oku" kuralını her
derste yeniden öğretmek olurdu. Yeşil `--success`, turuncu `--primary-parlak`;
ayrı bir kitap paleti yok.

**Derse ait olan iki şey var**: tema bandının rengi ve zemine serpilen
simgeler (`lib/konu/harita-temasi.ts`). Matematik pembe ve kareköklü, Tarih
kahverengi ve tüylü, Coğrafya gök mavisi ve pusulalı. Renkler
`globals.css`teki `--konu-<ders>-*` değişkenlerinde; oyunların ders
aileleriyle (`--isl`, `--trh`…) **aynı değil** — o aileler rozetlerde ve oyun
kartlarında, yediye ancak yetiyor ve Tarih'in deniz mavisi kâğıt zeminli bir
haritada tarih gibi durmuyordu. Kart destesinin zemini de bu renkten
(`zeminRengi`): haritadan desteye geçerken renk değişmemeli.

Simgeler ya serif italik yazı (`√x`, `MÖ`) ya lucide'den çizgi ikon (tüy,
parşömen). Emoji değil: emoji telefondan telefona başka çiziliyor ve %8
opaklıkta renkli bir emoji soluk bir leke oluyor. Opaklık tek ve yedi derste
aynı (`--patika-simge`); düğüm başına bir simge, kitabın **karşı** yanında.
Süs, bilgi değil — okuyucudan gizli, dokunuşu geçiriyor.

**Yol ölçülmüyor, hesaplanıyor.** Kitaplar mutlak konumda, sekizlik bir
kayma çevrimiyle (`KAYMA`) diziliyor ve yol SVG'si aynı sayılardan kübik
Bezier ile kuruluyor; teğetler düşey, yol her kitaba yukarıdan girip aşağıdan
çıkıyor. SVG sabit 400 px ve ortalanmış — kayma piksel cinsinden olduğu için
yatayda esneyen bir kutu işe yaramazdı; taşan kısmı bölüm kutusu
`overflow: clip` ile kırpıyor (`hidden` değil: kaydırma kabı olur, yapışkan
bandın hesabını bozar). Bölüm kutusu bandın altına `BANT_PAYI` kadar
sokuluyor ki yol bölümden bölüme bandın **altından** geçsin; sokulmasaydı
bandın iki yanında düz kesilirdi. Sınırı geçen parça iki kutuda da çiziliyor
(kuyruk ve baş) ve ikisi aynı eğri olmak zorunda: sanal uçlar komşu kitabın
gerçekten durduğu yerde (`BOLUM_ARASI`, düzenden türüyor). Yapışkan bandın
sarmalında zemin degradesi yok — donuk üst yarısı yolu kesiyordu.

Sıradaki kitabı ayıran şey renk değil boy, altındaki ışık ve genişleyen halka
(`patika-halka`) — bitmiş kitaplar da aynı yeşil. "Başla" balonu kaldırıldı:
başlık zaten "N. konu sırada" diyor.

**Numara yalnızca yeşil kitapta ve konuyu sayıyor** (1, 2, 3…). Bir süre
basamaklar sayılıyordu — yeşiller 1, 3, 5 diye gidiyordu ve "3. kitap"
dendiğinde ikinci konu anlaşılıyordu. Turuncu kitabın kapağında numara değil
liste simgesi var: sorular sayılmıyor, çözülüyor.

**Kitaba basınca ortada bir kart açılıyor** (`KonuKarti`), alttan gelen bir
sayfa değil. Yeşil kitap anlatım kartını, turuncu kitap soru kartını açıyor:
aynı düzen, ayrı ton (yeşil / turuncu kurdele ve düğme), ayrı maskot pozu
(okuyan / düşünen), yıldızlar ayrı şeyi sayıyor (okuma: bitti 3, başlandı 1;
soru: %90 üç, geçme sınırı iki, altı bir) ve düğmenin yazısı ayrı ("Anlatımı
oku" / "Soruları çöz"). Eskiden iki basamağı alt alta listeleyen tek bir konu
sayfası vardı ve hangi kitaba basıldığı sayfada görünmüyordu. Kilitli
konunun kartında düğme "Kilidi aç" ve önce onay penceresi çıkıyor (bkz.
**Kilit var, anahtarı kullanıcıda**).

## Hedef kataloğu

Kullanıcı eskiden hedef ekranında dört kutuyu da elle dolduruyordu: bölüm,
üniversite, taban puan, başarı sırası. Son iki sayıyı bilen kimse yoktu — hedef
ya boş kalıyordu ya rastgele bir sayıyla kaydediliyordu ve "hedefine ne kadar
kaldı" cümlesi ölçtüğü şeyi kaybediyordu. Artık **arayıp seçiliyor**, sayıları
katalog dolduruyor.

Veri `lib/veri/hedef-katalog-2025.json`, tipler ve erişim `lib/veri/katalog.ts`,
mantık `lib/hedef-katalog.ts` (saf, test edilebilir).

### Sıra artık tahmin değil, ÖSYM'nin kendi sayısı

Eskiden burada elle yazılmış 205 üniversite ve 77 bölüm vardı. Her
üniversitenin 1–5 arası bir **kademesi**, her bölümün iki sıra ucu tutuluyor ve
hedefin sırası ikisi arasında geometrik iç değerle tahmin ediliyordu. Model tek
boyutluydu: Tıp'ta önde olan üniversite Hukuk'ta da önde sayılıyordu. Gerçek
tablo o zaman bilerek taşınmamıştı — "hem uygulamayı şişirir hem her ağustos
elle güncellenir" diye.

İki gerekçe de artık geçerli değil:

- **Elle güncelleme yok.** Veri, ÖSYM'nin *Yükseköğretim Programları ve
  Kontenjanları Kılavuzu* PDF'inden bir ETL ile çıkıyor (ayrı depo:
  `Asaf Belge/files`, `src/etl_kilavuz.py` → `src/uygulama_profili.py`). Yeni
  kılavuz çıktığında ETL yeniden çalışıyor, JSON değişiyor.
- **Şişirmiyor.** Profil yalnızca uygulamanın kullandığı alanlara indirilmiş:
  225 üniversite, 9.304 lisans programı, 250 KB. Adlar bir sözlükte bir kez
  yazılıp programlar indekse döndüğü için düz nesne dizisinin dörtte biri
  kadar yer tutuyor.

`kademe`, `alanlar`, `ustSira`, `altSira`, `sonKademe` alanlarının hepsi
kalktı; onlarla birlikte `tahminiSira` ve iki süzgeç de gitti. Bir üniversitede
listelenen her bölüm artık o üniversitede **gerçekten açık**.

### Puan hâlâ sıradan hesaplanıyor

Kılavuzda taban puan da yazıyor ama kataloğa **girmiyor**. Puan
`siralama.ts`'teki `siralamadanPuan` ile o yılın yerleştirme dağılımından geri
hesaplanıyor. Gerekçe kademe döneminden beri aynı: sıra yıldan yıla neredeyse
yerinde duruyor, puan sınavın zorluğuyla oynuyor. Yeni yılın dağılımı gelince
puan kendiliğinden güncelleniyor — kataloğa yazılmış olsaydı bir yıl eskimiş
sayıyı göstermeye devam ederdi.

`siralamadanPuan` ile `yilSiralamasi` birbirinin **tersi** olmak zorunda; ikisi
de logaritmik iç değer kullanıyor ve `hedef-katalog.test.ts` gidip gelen
çevrimin başladığı puana döndüğünü denetliyor. Birine dokunursan ötekine de bak.

### Sıra artık yuvarlanmıyor

Kademe döneminde çıkan sayı kabalaştırılıyordu: "47.213" gibi kesin görünen bir
sayı, tahmini olduğundan daha güvenilir gösteriyordu. Artık sayı ÖSYM'nin
yayımladığı değer; yuvarlamak onu dürüst değil yalnızca yanlış yapardı.
Arayüzdeki belirsizlik bandı `bantYaz`ın işi ve orada duruyor.

### Bölüm artık üniversiteye ait

`bolumBul` üniversite parametresi alıyor. Aynı bölümün sırası üniversiteden
üniversiteye değişiyor (Tıp: Hacettepe 1.836, Van 20.882); üniversitesiz bir
arama "Tıp"ın sırasını rastgele bir kayıttan okurdu.

### Profilin dışarıda bıraktıkları

- **Önlisans (TYT).** `PuanTuru` say/ea/soz/dil; önlisans hedefi uygulamada hiç
  olmadı. Eklemek tip değişikliğinden deneme şablonlarına kadar giden ayrı bir
  iş.
- **"KKTC Uyruklu" kontenjanları.** Türkiye'deki öğrenci başvuramıyor;
  listelemek seçilemeyecek bir hedef göstermek olurdu.
- **Puanı olmayan programlar.** Kontenjanı dolmamış ya da yeni açılmış
  programlarda taban puan/sıra yok, dolayısıyla hedef sayısı da yok.

Aynı üniversitede aynı adla birden çok program varsa (bölüm ayrı fakültelerde
açılıyorsa) ada fakülte ekleniyor: "Turizm İşletmeciliği (Manavgat Turizm
Fakültesi)". Kılavuzun kendisi aynı adı iki kez listeliyorsa (Türk-Alman
Üniversitesi'nde Hukuk'un 80 ve 16 kontenjanlı iki satırı) ana kontenjan olan,
sırası daha iyi kayıt tutuluyor — ikisini de göstermek seçim ekranında aynı
satırı iki kez çıkarırdı.

### Liste öğrencinin alanına göre süzülüyor

Sözel bir öğrenciye Bilgisayar Mühendisliği çıkıyordu. Giremeyeceği bir bölümü
hedef olarak kaydeden öğrencide "hedefine ne kadar kaldı" cümlesi ölçtüğü şeyi
kaybediyor. Artık liste `Ayarlar.puanTuru`ya göre süzülüyor
(`bolumleriGetir(universite, alan)` ve `bolumAra(..., alan)`).

Üç kural bu süzgecin etrafında duruyor:

- **`bolumBul` süzgece takılmıyor.** Kayıtlı hedef alan dışındaysa — alan
  sonradan değiştiyse ya da eski sürümde seçildiyse — bulunamaz olur ve ekran
  onu silinmiş gibi gösterirdi. Üniversite değiştirilirken yapılan "bu bölüm
  burada var mı" denetimi de süzgeçsiz listeye bakıyor.
- **Süzgecin bir kapısı var.** Her iki ekranda da "Alanım dışındaki bölümleri
  de göster" anahtarı duruyor: alan değiştirmeyi düşünen ya da alanını yanlış
  işaretlemiş öğrenci aradığını hiç bulamaz ve listeyi bozuk sanardı. Anahtar
  yalnızca alan seçiliyken görünüyor.
- **Süzgeç öğrencinin alanından geliyor, seçilen bölümün türünden değil.**
  Hedefim ekranında ikisi ayrı: `varsayilanTur` öğrencinin kendi alanı,
  `puanTuru` state'i seçilen bölümün türü. İkincisine bakan bir süzgeç kendi
  kuyruğunu kovalardı — seçilen bölüm süzgeci değiştirir, süzgeç de listeyi.

### Alan seçilmemiş olabilir

`Ayarlar.puanTuru` artık `PuanTuru | null`. `null` "karar vermedim" demek ve bir
varsayılanla doldurulmuyor: kurulumda bir alan **seçilmiş gibi** kaydetmek,
sıralama ekranında kullanıcının hiç söylemediği bir türe göre hesaplanmış bir
sayı göstermek olurdu — o sayı tahmin değil uydurma olurdu. Kararsızken
`guncelTahmin` `null` dönüyor, sıralama ekranı boş durum çiziyor ve hedef
listesi süzülmüyor.

**Dil de soruluyor.** Kurulumdaki kart listesinde ve Ayarlar › Alanım'daki
çiplerde (`SECILEBILIR_TURLER`) dört tür de var. Dil bir süre ikisinden de
çıkarılmıştı ("azınlıkta, listeyi uzatıyor") ve yalnızca ayarı zaten 'dil'
olan eski kullanıcıya gösteriliyordu; sonucu Dil öğrencisinin kurulumda
"Karar vermedim" demek zorunda kalması, hedef listesinin süzülmemesi ve YDT
şablonunun önerilmemesiydi. Azınlık olmak yok sayılmak değil; bedeli bir
satır daha.

### Elle giriş kipi kalıyor

Ekranın serbest metin kipi silinmedi. Katalog dışı bir hedef kayıtlıysa ekran o
kiple açılıyor (`universiteBul` null dönüyor), çünkü eski sürümde herkes iki adı
elle yazıyordu ve o kayıtlar duruyor. `Hedef` tipi de kimlik değil **ad**
tutmaya devam ediyor — kimliğe geçmek o kayıtları geçersiz kılardı.

Seçim ekranda ayrı bir state'te durmuyor, iki addan türetiliyor: iki kaynak
olsaydı elle yazılan ad ile seçili kayıt birbiriyle çelişebilirdi.

Çıkan sayılar tahmin ve aşağıdaki **Doğruluk** kuralına tabi: kutular
düzenlenebilir, uyarı kaldırılamaz.

### Kurulumda da bir bölüm adımı var

Aynı seçim kurulumda, alan adımından hemen sonra bir kez soruluyor: uygulamayı
ilk açan öğrenci hedefini Araçlar'a girmeyi akıl etmeden ana sayfada boş bir
"HEDEFİM" paneli görüyordu.

Adım **atlanabilir** — hedefini henüz bilmeyeni kurulumda tutmak, uygulamayı hiç
açamamak demek. Seçim yapılmazsa `KurulumSonucu.hedef` `null` geliyor ve kayda
dokunulmuyor.

Kurulum kendi listesini çizmiyor: arama alanı, liste ve seçilen satır
`components/hedef-secici.tsx`ten geliyor ve Hedefim ekranı da aynı parçaları
kullanıyor. İkinci bir kopya, iki listenin zamanla birbirinden ayrılması demekti.

Taban puan ve sıra kurulumda **sorulmuyor**, katalogdan hesaplanıyor
(`tahminEt`); kullanıcı sonradan Hedefim ekranından düzeltebiliyor. Kaydedilen
puan türü de seçilen bölümün türü, kurulumdaki "Hangi alandasın?" cevabı değil:
o soru öğrencinin kendi alanını soruyor ve hedef bölümünkiyle aynı olmak zorunda
değil.

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
