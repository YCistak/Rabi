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
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar. Derlemeye girmiyorlar,
  uygulama onlardan hiçbir şey import etmiyor — ekran değiştirirken oraya bak.
- Sütun hâlindeki sayılara `rakam` sınıfı (tabular-nums), başlıklara `font-display`.
- Alt menünün altında kalan içerik için `guvenli-alt`.

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

Adım noktaları bu ikisini **saymıyor** (`noktaAdimlari`); nokta "kaç soru
kaldı"yı anlatıyor ve ikisi de soru sormuyor. Sayının ayrı bir listeden çıkması
şart: dizinin kendisinden çıkarılsalardı `ilerle` onları atlardı.

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
(`poz="el-sallayan"` → `public/tavsan-el-sallayan.png`); karşılamadaki duran
yüzle aynı görsel olsaydı ekran ileri gitmiş gibi durmazdı. Poz `durum`dan
ayrı bir prop: `durum` yalnızca ekran okuyucu etiketini belirliyor, poz
gerçekten başka bir dosya gösteriyor. Görsel eksikse `Rabi` yüze düşüyor —
kırık görsel simgesi, ekranın ortasında dururken eksik bir dosyadan çok bozuk
bir uygulama gibi görünüyor. Yeni bir poz eklerken dosyayı `public/` altına
koy ve kare oranı koru; ölçü `Rabi` içinde 130/120 kutusuna oturuyor —
`tavsan-el-sallayan.png` de bu yüzden kaynağındaki 247×236'dan 256×256 kare
tuvale taşındı, yoksa `object-contain` onu yüzden farklı ölçeklerdi.

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


## Haftalık özet kapalı

Ekran (`components/ekranlar/haftalik-ozet.tsx`), hesabı (`lib/ozet.ts`) ve
paylaşılan görseli üreten `lib/ozet-gorsel.ts` **dosya olarak duruyor** ama
uygulamadan açılamıyor: Araçlar listesinde kartı yok (`gezinme.ts`), ana
sayfadaki "Haftalık özetin hazır" daveti kalktı ve `AppShell` katmanı hiç
kurmuyor.

Geri açmak istenirse üçü birden gerekiyor: `Ekran` tipine ve `KARTLAR`'a
`haftalik-ozet`, kart menüsündeki "Motivasyon" bölümüne giriş, `AppShell`'e
özet hesabı + katman + `ozetGorulen` işaretlemesi. Depodaki `ozetGorulen`
anahtarı silinmedi; okunmuyor ama duruyor.

## Rozet değil başarım

Arayüzde bölümün adı **Başarımlar**: Araçlar satırı, ekran başlığı ve kutlama
penceresi böyle diyor. Kod tarafı `rozet` kalıyor — `lib/rozetler.ts`, `Ekran`
kimliği `rozetler`, depo anahtarı `rabi-rozetler` ve yedekteki `rozetler`
alanı. Kimliği değiştirmek kazanılmış rozetleri kayıtta öksüz bırakırdı; ad
yalnızca görünen yüzde değişti.

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

Dört efekt var ve hepsi **ortak koddan** çıkıyor: ses `lib/oyunlar/oyun-sesi.ts`,
görsel olanlar `components/oyun-kabuk.tsx` ile `app/globals.css`. Oyun
dosyalarına hiç dokunmuyorlar.

| Efekt | Ne zaman | Nerede |
| --- | --- | --- |
| Sarsıntı | yanlış cevap | kabuk + `oyun-sarsinti` |
| Süre nabzı + tek uyarı | kalan süre toplamın ¼'ünün altına inince | kabuk + `sure-nabzi` |
| Boss parlaması | boss sorusu bilinerek kapanınca | kabuk + `boss-parlama` |
| Kart kalkması | bankada tike basınca | `oyun-bankasi.tsx` + `banka-kalkiyor` |
| Konfeti | yalnızca yeni rekorda | `TurSonu` + `konfeti` |

Kabuk olayları **sayaçtan türetiyor**, oyunlardan geri çağrı almıyor: `dogru`,
`yanlis`, `boss` ve `kalan` zaten props olarak geliyor ve bir sayının artması
"bir şey oldu" demek. 18 oyuna kanca eklemek aynı kuralı 18 kez yazmak olurdu;
böyle yazınca yeni bir oyun hiçbir şey yapmadan efektlere kavuşuyor.

Boss parlamasında tek incelik şu: oyunlar cevabı **hemen** sayıyor ama soruyu
geri bildirim bittikten sonra değiştiriyor. Yani doğru sayısı boss hâlâ
ekrandayken artıyor, boss kapandığı çizimde artmış olmuyor. O yüzden bir bayrak
(`bossVuruldu`) iki anı birbirine bağlıyor; "kapanırken sayı arttı mı" diye
bakan bir kural hiç çalışmaz.

**Doğru sesinin perdesi sabit.** Bir süre ardışık doğrularda kademe kademe
yükseliyordu: önce yarım ton, sonra "çok belirgin" diye çeyrek tona indirildi,
sonunda tümüyle kaldırıldı. İkisi de kulakta iyi durmadı ve sebebi kademenin
büyüklüğü değil yöntemin kendisi: perde `playbackRate` ile değişiyor, yani ses
hem tizleşiyor hem kısalıyor ve kaydedilmiş efekt kendi kimliğinden uzaklaşıyor
— kullanıcı bunu "ses bozuluyor" diye duyuyor. Seriyi ödüllendiren şey zaten
ekranda duruyor; efektin işi yalnızca "doğru" demek. Geri getirmek istersen
perdeyi oynatma, ayrı bir ses ekle.

Efekt seviyesiyle oyun müziğinin seviyesi (`mod-muzigi.ts`, `MUZIK_SEVIYESI`)
tek bir dengenin iki ucu ve ikisi de telefonda dinlenerek ayarlandı: efekt
1'den 0.42'ye indi (çok gürdü), müzik iki kez yükseldi — 0.09, sonra 0.26,
şimdi 0.5. **Sayıların eşit olması gürlüğün eşit olması demek değil**: efektler
ustalanmış mp3, dalgaları baştan sona tepeye yakın; parçalar sıfırdan
sentezlenmiş ince dalgalar ve aralarında sessizlik var. Bu yüzden müzik sayıca
efektin üstünde durup kulakta onun hizasına geliyor — 0.26'da kullanıcı
"telefonun sesini sonuna kadar açmadıkça duyulmuyor" dedi. Birine dokunursan
ötekine de bak; sıralamayı `mod-muzigi.test.ts` denetliyor.

Boss parlaması ilk denemede yerinde duran bir altın radyaldi ve iyi durmadı:
boss zemini açık bir renk ve onun üstünde sabit bir sarı daire ışık gibi değil
leke gibi görünüyor. Göz parlaklığı değil **yayılmayı** ışık sanıyor — şimdi
dışa açılan bir halka ve onun arkasında büyüyen bir hâle var, halka ötekinden
hızlı gidiyor. Yeni bir parlama eklersen aynı kural: büyümeyen ışık, ışık değil.

Bankadaki tik kaydı anında silmiyor; kart önce onaylanıp süzülüyor
(`KALKMA_SURESI`, CSS'teki süreyle eşleşmeli). Anında silmek dokunuşun
karşılığını görünmez kılıyordu: liste kısalıyor ama hangi kartın gittiği
anlaşılmıyordu.

Efekt dosyalarının seviyesi 1 değil (`DOSYA_SEVIYESI`): tam seviyede çalıyorlardı
ve kullanıcı "çok fazla geliyor" dedi. Efekt oyunun içinden gelen bir işaret,
ortamı bastırması gerekmiyor; ama duyulmayan efekt de hiç olmamış demek, o yüzden
sessize yaklaşmıyor — kapatmak isteyene ayarda anahtar zaten var.

Doğru sesi bunun da altında (`DOGRU_SEVIYESI`, `DOSYA_SEVIYESI` × 0.72). Fark
sayıdan değil **sıklıktan**: doğru sesi bir turda onlarca kez çalıyor, yanlış
birkaç kez, ve çok tekrarlanan bir ses aynı seviyede daha gür duyuluyor. Yanlış
aşağı çekilmedi — turu kesen, dikkat isteyen olay o.

Hepsi `prefers-reduced-motion` altında susuyor. Yeni bir efekt eklersen o
medya sorgusuna da ekle: buradaki hareketlerin hiçbiri bilgi taşımıyor, bilgi
sayıda ve renkte duruyor.

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

## Mod müzikleri

Dört modun dört ayrı parçası var (`lib/oyunlar/mod-muzigi.ts`); üçü orada
sentezleniyor, Rahat'ınki eski pad (`oyun-muzigi.ts`).

| Mod | Parça | Tempo |
| --- | --- | --- |
| Rahat | vuruşsuz pad | yok |
| Sıradan | "Yürüyüş" (Am/F/C/G, marimba arpej) | 88 → 134, sürekli hızlanır |
| Turbo | "Koşu" (Dm/B♭/F/C, senkoplu kare bas) | 138, son çeyrekte 168 |
| Ani Ölüm | "Nefes yok" (Em pedal, inen kromatik) | 152 sabit |

Üçü **ayrı beste**, aynı ezginin hızlandırılmışı değil: farklı tonalite, farklı
enstrüman, farklı vuruş deseni. Aynı melodiyi hızlandırmak dört modu tek bir
modun dört ayarı gibi gösterirdi; aralarındaki fark tempo değil kural.

Tempo kuralı saf ve dışa açık (`tempo(mod, gerginlik)`, `mod-muzigi.test.ts`).
Gerginliği besleyen yer oyun kabuğu: `kalan / toplam` zaten orada ve
`muzikGerginligi` ile geçiyor — efektlerdeki kuralın aynısı, oyun dosyaları
müzikten habersiz. Sayacı olmayan modlarda oran sabit kalıyor, o parçalar zaten
gerginliğe bakmıyor.

Müzik modül düzeyinde **tekil**: parçayı kuran yer oyunlar ekranı, gerginliği
besleyen yer kabuk; ikisinin aynı nesneye ulaşması gerekiyordu.

Ayarlardaki seçim "Mod müziği" ya da "Lo-fi" (`OyunMuzikTuru`). Eski kurulumlarda
kayıtlı `'sakin'` değeri `ayarlariNormalize` içinde `'mod'`a çevriliyor.

Ses dengesi tek bir yerde: `MUZIK_SEVIYESI` (0.5) efekt dosyalarının
seviyesinin (`DOSYA_SEVIYESI`, 0.42) sayıca üstünde ama kulakta hizasında —
sentezlenmiş dalga, ustalanmış mp3'le aynı sayıda daha kısık duyuluyor. Üst
sınırı kırpılma koyuyor: nota tepeleri bu ana seviyede toplanıyor, 1'e yaklaşan
bir değer parçayı yüksek değil bozuk çalar. Rahat modun pad'i ondan türeyen
`RAHAT_SEVIYESI` ile altta kalıyor: vuruşsuz ve sürekli olduğu için aynı
sayıda daha çok fark ediliyor — oran 0.7'den 0.35'e indi, kullanıcı Rahat
turda pad'i "rahatsız edici" buldu. Sürekli çalan bir seste ölçü "duyuluyor
mu" değil "farkında olmadan dinlenebiliyor mu". `mod-muzigi.test.ts` iki
sınırı da denetliyor.

## Oyun Bankası

Bir kayıt iki yoldan çıkıyor ve ikisi aynı şey değil. **Kazanılan çıkış**: soru
turlarda üst üste `DUSME_ESIGI` kez doğru bilinince kendiliğinden düşüyor;
"bankadan düşen" sayacını ilerleten ve rozete sayılan yol bu. **Elle kaldırma**:
karttaki tik kaydı sayaca dokunmadan siliyor. İkincisi sonradan eklendi çünkü
banka bir borç listesi — öğrendiğine kullanıcının kendisi karar veremiyorsa liste
yalnızca büyüyor ve bir yerden sonra hiç açılmıyor.

Tik sayacı ilerletmiyor; ölçtüğü tek şey kullanıcının tuşa basması. Bankaya yeni
bir çıkış yolu eklersen aynı soruyu sor: bu yol uydurulabiliyor mu,
uydurulabiliyorsa sayaca yazılmamalı.

## Oyun modları

Turun nasıl işleyeceğini **mod** belirliyor (`lib/oyunlar/mod.ts`); seçim bütün
oyunlarda ortak (`rabi-oyun-modu`) ve tanıtım penceresinden yapılıyor. Zorluk
oyun başına ayrı duruyor çünkü seviyeler oyundan oyuna gerçekten değişiyor;
"bugün acele etmek istemiyorum" oyuna göre değişmiyor.

| Mod | Saat | Yanlış | Kayıt |
| --- | --- | --- | --- |
| Sıradan | tura ait, 60 sn | süreden 3 sn götürür | var |
| Turbo | tura ait, 30 sn | süreden 3 sn götürür | var |
| Ani Ölüm | soruya ait (`SORU_SURESI`) | tur biter | var |
| Rahat | yok | hiçbir şey | **yok** |

Dört mod olmasının sebebi tek kuralın iki kullanıcıyı birden idare edememesi:
her yanlışın turu bitirdiği tasarım bileni ödüllendiriyor ama yeni öğrenene
öğretmeyi bırakıp onu eliyor. Rahat modun karşılığı yok — süresiz bir turda "kaç
doğru yaptın" sabrı ölçer, bilgiyi değil; o yüzden rekora, istatistiğe ve oyun
geçmişine yazılmıyor (yanlışlar yine bankaya düşüyor). Bunun tek kapısı
`oyunlar.tsx` içindeki `turBitti`.

İki kural moddan bağımsız:

- **Oyun Bankası turu** modu dinlemiyor (`etkinMod`): süreli bir tur onu yarıda
  keser, eleyen bir tur "üç kez doğru bil" işini imkânsız kılardı.
- **Rahat turda çıkış turu bitiriyor**, doğrudan kapatmıyor; yoksa o turda
  öğrenilen yanlışlar bankaya hiç düşmezdi.

Sayaç tek yerde: `lib/oyunlar/tur-sayaci.ts`. Toplamı sıfır dönmesi "sayaç yok"
demek ve arayüz halkayı ona bakarak gizliyor. Yeni bir mod eklersen saatin tura
mı soruya mı ait olduğuna karar ver — ikisi birden olmaz, `mod.test.ts` bunu
denetliyor.

## Yapılacaklar tahtası

Araçlardaki not kâğıtları (`lib/yapilacaklar.ts`). Liste değil tahta: kâğıtlar
istenen yere sürükleniyor ve konum kullanıcının verdiği bilgi — bir listeye
düzleştirmek onu atmak olurdu. En fazla on kâğıt; sınır tahtanın kendisinden
geliyor, üst üste binen kâğıtlar okunmuyor.

Tahta **günlük**: her kâğıt yerel günüyle (`gun`) duruyor ve gün dönünce
`gununNotlari` onu eliyor. Dün yazdığını bugün de tahtada gören kullanıcı,
biriken ve hiç bitmeyen bir listeye bakıyor demektir. Gün dönümü zamanlayıcıyla
değil türetmeyle yakalanıyor — uygulama kapalıyken çalışmayan bir `setTimeout`'a
güvenilmez; elenen kâğıtlar bir etkiyle kayıttan da siliniyor, yoksa yedeğe
girerlerdi.

`yeniKonum` iki sütun × beş satırlık bir ızgara: on kâğıdın **hepsine** ayrı
yer. Önceki köşegen basamak beşte bir başa dönüyordu ve altıncı kâğıt birincinin
üstüne oturuyordu. Tahtanın yüksekliği de buna bağlı — satır aralığı kâğıdın
boyundan kısalırsa kâğıtlar daha ilk eklendikleri anda biner.

Konum piksel değil **oran** (0–1) ve kâğıdın sığdığı boşluğa göre ölçülüyor;
`left: X%` ile `translate(-X%)` eşleşmesi sayesinde çizim tarafı ekran ölçüsü
bilmek zorunda değil ve kâğıt hiçbir zaman tahtadan taşmıyor. Yedeğe giriyor:
başka telefona taşınan tahta aynı yerleşimi koruyor.

Kâğıtlar yalnızca o sekmede; uygulamanın üstünde yüzen bir katman değiller. Her
ekranda görünen bir yapılacak listesi kaygıyı hiç bırakmayan bir arayüz olurdu.

Tahtanın yüksekliği ve kâğıdın genişliği Tailwind sınıfı değil, satır içi ölçü.
Bu ikisi olmadan özellik ekranda **yok**: tahta sıfır yükseklikte, kâğıt sıfır
genişlikte kalıyor ve "yeni kâğıt" tuşu çalışıyormuş gibi görünüp hiçbir şey
göstermiyor. Görünüşe ait bir sınıfın taramadan düşmesi eksik bir gölge demek;
ölçüye ait olanınki boş bir ekran.

> Dosya adı `notlar.ts` **olamaz**: `.gitignore` kişisel notlar için `notlar.*`
> deseni taşıyor ve desen tüm ağaçta geçerli. Öyle adlandırılan bir kaynak dosya
> hem depoya girmiyor hem Tailwind'in tarayıcısından düşüyor. Bir dosyayı yeniden
> adlandırdıktan sonra `npm run build`'i **tekrar çalıştır**: Tailwind kaynak
> listesini derleme başında kuruyor, eski çıktı hatasız ama sınıfsız kalıyor.

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

**Dil hiçbir yerde sorulmuyor.** Ne kurulumdaki kart listesinde ne Ayarlar ›
Alanım'daki çiplerde var (`SECILEBILIR_TURLER`): Dil öğrencisi azınlıkta ve
dördüncü seçenek iki listeyi de uzatıyordu.

`PuanTuru` yine de dört değer taşımaya devam ediyor ve `PUAN_TURU_ADI`
tablosunda 'dil' duruyor. İki sebebi var:

- **Katalogdaki DİL programları yerinde.** Biri hedef olarak seçilirse
  `Hedef.puanTuru` 'dil' oluyor ve satırda adı yazılıyor. Alanı Dil olmayan
  kullanıcıya bu programlar listede süzülü görünmüyor; ulaşma yolu "Alanım
  dışındaki bölümleri de göster" anahtarı.
- **Ayarı 'dil' kalmış eski kullanıcı var.** Ona çip gösteriliyor, yoksa satırda
  "Dil" yazarken altındaki çiplerin hiçbiri seçili görünmez ve kullanıcı ayarını
  bozuk sanardı. Başka bir türe geçtiği anda çip listeden düşüyor; geri dönüşü
  yok, istenen de bu.

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

## Deneme kâğıdını okutma (OCR)

Öğrenci deneme kitapçığının üstüne "Matematik 38D 2Y" diye yazıyor; kamera
okuyor, kutular doluyor. İş üç dosyaya bölünmüş ve bölünme kasıtlı:

| Dosya | İşi | Telefon gerekir mi |
| --- | --- | --- |
| `lib/deneme-okuma.ts` | metin → ders sonuçları, **saf** | hayır |
| `lib/kagit-kirp.ts` | fotoğrafta kâğıdı bulup kırpar, **saf** | hayır |
| `lib/goruntu-esikle.ts` | siyah-beyaza indirir, **saf** | hayır |
| `lib/karakter-ayir.ts` | lekeleri bulup 28×28 kareye oturtur, **saf** | hayır |
| `lib/karakter-tani.ts` | karenin hangi karakter olduğunu söyler, **saf** | hayır |
| `lib/kagit-oku.ts` | satır satır sayı kümeleri üretir, **saf** | hayır |
| `lib/deneme-ocr.ts` | kamera + tuval + ML Kit sarmalayıcısı | evet |
| `components/ekranlar/yeni-deneme.tsx` | düğme, örnek kartı, satır eşleme, özet | hayır |

Asıl hata ayrıştırmadan çıkıyor ve o telefonsuz test edilebilmeli: eşleştirme
mantığı `deneme-okuma.test.ts` içinde fixture metinlerle denetleniyor.

**Ağa çıkmıyor.** ML Kit'in Latin metin modeli (`@capacitor-mlkit/text-recognition`)
APK'ya gömülü; tanıma tümüyle cihazda oluyor, uçak modunda da çalışıyor. Bulut
OCR baştan elendi — "sunucu yok, dış servise çıkma" kuralı ve Data Safety
beyanı ikisi birden buna bağlı.

**Okunan hiçbir şey kaydedilmiyor.** Sayılar kutulara **yazılıyor**, kullanıcı
görüp onaylıyor. Doğruluk kuralının aynısı; üstelik burada tahminin kaynağı el
yazısı ve model basılı metin için eğitildi.

### Şüphedeyken doldurmuyor

Yanlış dolmuş bir kutu boş kutudan kötü: boşu kullanıcı görüp yazar, yanlışı
fark etmeden kaydeder. Üç yerde satır atlanıp `atlananlar`a düşüyor:

- **Ders adı iki derse birden uyuyorsa.** AYT Sözel'de yalnızca "Tarih" yazan
  bir satır Tarih-1'e de Tarih-2'ye de uyuyor; birini seçmek yazı tura atmak.
- **Sayılardan yalnızca biri okunduysa.** "38D" tek başına yanlışın sıfır
  olduğunu söylemiyor — yazılmamış olabilir ve sıfır yazmak veriyi uydurmak.
- **Doğru + yanlış ders soru sayısını aşıyorsa.** Sayı yanlış tanınmış demektir.

Anahtar eşleşmesi **söz sınırına** bakıyor. İki hata bundan çıkmıştı: "mat"
kısaltması "otomat"ın içinde yakalanıyordu, ve "tarih 1" eşanlamlısı
"tarih 10d 2y" satırında "tarih 1" olarak eşleşip geriye "0d 2y" bırakıyordu.

### Boş da bir sayı (`B`)

Öğrenciler sonucu doğru/yanlış diye değil **doğru/boş** diye tutuyor: gerçek
kâğıtlarda "Coğ1: 2D 1B", "Temel Matematik: 15D 20B", "TDE: 5B 10Y" yazıyor.
`B` bilinmezken bu satırlar işaretsiz sanılıp ilk iki sayı doğru ve yanlış diye
okunuyordu — "2D 1B" **2 doğru 1 yanlış** oluyordu.

Üçü de aranıyor ve **sıraya bakılmıyor** ("3Y 2D" diye yazan var). İkisi
yazılmışsa üçüncüsü çıkarımla buluyor: doğru + yanlış + boş = soru sayısı. Bu
tahmin değil aritmetik, ama şablondaki soru sayısının doğru olmasına bağlı;
sonuç eksiye düşerse satır atlanıyor.

Tek işaret yine yetmiyor: "Coğ: 1B" doğrunun kaç olduğunu söylemiyor.

**Tek olasılık kalırsa dolduruluyor.** "Din K.: 5D" yazan öğrenci 5 soruluk
dersin hepsini doğru yapmış; yanlışa yer kalmıyor. "Tarih: Full" da öyle —
sayı yerine kelime yazan var. İkisi de çıkarım değil, tek olasılık; belirsizlik
kalan "Felsefe: 1Y" hâlâ atlanıyor.

### Tek harflik kısaltma çözülmüyor

Kâğıtlarda "T.E", "T.M", "Fi", "F", "K", "B" gibi kısaltmalar var ve bunlar
insan için de belirsiz: aynı fotoğrafta "F" Fizik'ken başka birinde Felsefe,
"B" hem Biyoloji hem boş işareti. En az üç harf kuralı bu yüzden duruyor
(`anahtarlar`) — bir harfi derse bağlamak yazı tura atmak olurdu. Örnek kartı
kullanıcıya bunu **söylüyor**; sessizce atlamak, okumanın bozuk olduğunu
düşündürüyordu.

### Sayı alt satıra taşabiliyor

Uzun ders adından sonra satır bitiyor ve sayı altına düşüyor ("Türk Dili ve
Edebiyat.: 36D" ⏎ "1B"). Yalnızca işaretli sayılardan ibaret satırlar bir
öncekine ekleniyor (`satirlar`). Ölçü dar: harf taşıyan satır kendi başına bir
kayıt olabilir ve onu yukarıdakine yapıştırmak iki dersin sayılarını
karıştırırdı.

### Fotoğraf modele ham gitmiyor

ML Kit'in Latin modeli **basılı metin** için eğitildi: koyu harf, açık zemin.
Kurşun kalemle yazılmış kâğıtta grafit ile kâğıt arasındaki fark yer yer birkaç
ton ve model hiçbir şey döndürmüyordu — aynı yazı tükenmezle yazılınca
okunuyordu. Çözüm modeli değiştirmek değil **girdiyi** düzeltmek: görüntü
tanımadan önce siyah-beyaza indiriliyor (`lib/goruntu-esikle.ts`) ve eşikten
sonra kalem türü aradan kalkıyor.

Eşik **yerel** (Bradley–Roth): her piksel kendi çevresinin ortalamasıyla
karşılaştırılıyor. Sabit eşik işe yaramıyor — telefonla çekilen kâğıtta bir
köşe gölgede kalıyor ve gölgedeki beyaz kâğıt, aydınlıktaki grafitten koyu
çıkıyor. Ortalama integral görüntüyle okunuyor, piksel başına dört toplama.

Eşik payı 8; belgeler için yaygın değer 15. Sebep ölçüldü: 200 tonluk kâğıda
170 tonluk grafitle yazılmış satırda çevre ortalaması 193 ve 15 payla yazı
kılpayı eleniyordu.

**Üç tanıma yapılıyor, iyisi alınıyor.** Ham görüntü, sert eşik ve yumuşak
yerel kontrast: eşikleme her fotoğrafta kazandırmıyor, iyi ışıkta çekilmiş
keskin bir kâğıtta ham görüntü zaten okunuyor ve sert eşik ince kalemi yer yer
koparabiliyor. `okumaPuani` metinleri karşılaştırıyor ve ölçüsü uzunluk
**değil**, işaretli sayı adedi
("38d", "2 y"): gürültü uzun ama anlamsız metin üretebiliyor ve uzunluğa
bakan bir ölçü onu seçerdi.

Piksel işi saf ve telefonsuz test ediliyor; tuval ve dosya yazma
`lib/deneme-ocr.ts` tarafında. Hazırlanan kopya önbelleğe PNG olarak
yazılıyor — JPEG iki renkli görüntüde harf kenarlarına halka atıp
eşiklemeyle kazanılan keskinliği geri alıyor.

### Sayıları ML Kit değil kendi ağımız okuyor

ML Kit'in Latin modeli **basılı metin** için eğitildi ve el yazısı kâğıtta
sayıları hiç döndürmüyor. Girdiyi düzeltmek (eşikleme, kontrast, üç varyant)
denendi ve yetmedi: modelin göremediği şey parlatılarak görünür olmuyor.

Ama okunması gereken alfabe çok küçük — **0-9 rakamları ile B, D, Y** — ve o
kadar dar bir tanıyıcı genel el yazısı OCR'ının yanında küçük bir problem.
`lib/karakter-tani.ts` içinde LeNet'in küçültülmüş hâli duruyor: iki evrişim
katmanı, 12.917 parametre, 50 KB. Ağırlıklar `lib/karakter-agirliklari.ts`
içinde base64 olarak gömülü ve **elle düzenlenmiyor** —
`scripts/taniyici-egit.mjs` üretiyor.

Eğitim betiği saf Node; ileri ve geri geçiş elle yazılı, makineye PyTorch
kurmak gerekmiyor. Veri EMNIST (NIST'in el yazısı derlemi): rakamlar
`emnist-digits`, harfler `emnist-letters`. Çalıştırmak için EMNIST'i indirip
klasörü betiğe vermek yeterli.

**Ağa çıkmıyor.** Tanıma tümüyle cihazda; "sunucu yok" kuralı ve Data Safety
beyanı korunuyor. Bulut OCR (Vision API vb.) bu yüzden baştan elendi.

ML Kit **kaldırılmadı**: ders adlarını okuma ihtimali duruyor ve iki okuma
birbirini tamamlıyor — ML Kit adları, kendi ağımız sayıları.

### On dördüncü sınıf: "bunlardan hiçbiri"

Ders adının harfleri de tanıyıcıya geliyor. On üç sınıf varken ağ onlara
zorunlu olarak bir rakam diyordu ve ortaya olmayan sayılar çıkıyordu — "Türk
Dili" satırının başı "7661B" diye okunuyordu. `diğer` sınıfı EMNIST'in B/D/Y
dışındaki harfleriyle eğitiliyor ve metne hiç yazılmıyor.

O sınıfa **her harf alınmıyor**: O ile 0, I ile 1, S ile 5, Z ile 2, G ile 6,
Q ile 2 elle yazıldığında ayırt edilemiyor ve onları "diğer"e atmak ağı gerçek
rakamları da oraya itmeye alıştırırdı.

### Yalnızca sayı + işaret kümeleri yazılıyor

Satırdan çıkan metin ham tahmin dizisi değil: bitişik rakamların ardından
bitişik bir B/D/Y gelen kümeler ("12D") alınıyor, gerisi atılıyor. Ölçüldü —
"Tar2: 5D 5Y" satırı "Y21 5D 5Y" diye çıkıyordu ve bu biçimde tek başına bir
harf ya da arkasında işaret olmayan bir sayı hiçbir şey söylemiyor.

Boşluk **kabul edilen** son karaktere göre ölçülüyor, kutu sırasına göre
değil: "12" ile "D" arasına düşüp elenen bir ders adı harfi ikisini bitişik
gösteriyor ve "122D" çıkıyordu.

### Kâğıt önce kırpılıyor

Fotoğrafta masa da var ve ahşabın damarları uyarlamalı eşikten yüzlerce siyah
leke olarak geçiyor. Ölçüldü: tek fotoğrafta 970 lekenin 700'ü masadandı ve
**gerçek harfler onların arasında eleniyordu** — gürültü filtresi karakter
boyunu lekelerin ortancasından çıkarıyor, ortanca da damar boyuna kayıyordu.
`lib/kagit-kirp.ts` karedeki en büyük parlak yüzeyi (Otsu eşiğiyle) bulup
kırpıyor; kırpmadan sonra aynı fotoğrafta 91 leke kalıyor.

Gürültü filtresi ayrıca boyu **mürekkebe göre tartılmış ortancadan** alıyor:
bir toz zerresi 5 piksel, bir harf 3000, ve sayıca baskın toz kararı böylece
etkileyemiyor.

### Bitişik yazılmış rakamlar bölünüyor

Elle yazarken "20"nin sıfırı ikiye değiyor ve tek leke oluyor; bölünmezse
tanıyıcıya iki rakam gösterip tek cevap istemiş oluyoruz. Boyunun 0,95'ini
aşan kutu, dikey mürekkep profilinin en incelttiği yerden bölünüyor. Kesim
eşit bölünmüş noktanın **çevresinde** aranıyor: profilin genel en düşüğü
kutunun ucuna kaçıyor ve orada bölmek karakteri kırpıyordu.

### Kâğıdın yönü okunarak bulunuyor

Kâğıt her zaman düz tutulmuyor: elimizdeki dokuz gerçek fotoğrafın dördünde
yan duruyor ve yazı dikey akıyor. Satır gruplama yatay yazı varsaydığı için o
kâğıtlardan tek satır bile çıkmıyordu.

İki ucuz yol denendi ve **ikisi de çalışmadı**:

- **Lekelerin dizilişine bakmak.** Düz duran bir kâğıtta doğru eksen 45,
  yanlış eksen 47 puan aldı; satır sayısı da satır uzunluğu da ayırt etmiyor.
- **Birkaç karakteri örnekleyip güvene bakmak.** Ters duran bir rakam yine bir
  rakama benziyor (6 ile 9) ve ağ ona da güveniyor.

Ayırt eden tek ölçü tam okumadan çıkan **geçerli küme sayısı**: ters yönde
sayılarla işaretler bir araya gelmiyor. Üç yön (0°, 90°, 270°) baştan sona
okunuyor, en çok küme veren kazanıyor; eşitlikte düz duruş.

180° denenmiyor — fotoğraf baş aşağı çekilmiyor ve EXIF yönü zaten uygulanmış
oluyor. Üç okumanın tamamı masaüstünde 275 ms.

### Eleme sınıfa değil, **biçime** bakıyor

Ders adından sızan lekeleri ayıklamanın doğru yolu "ağ ne kadar emin"i
sıkıştırmak değil; ölçüldü, o yol tıkalı. Ayıklamayı kâğıdın geometrisi
yapıyor ve üç kural birbirinden bağımsız:

| Kural | Neden | Ölçüm (27 etiketli satır) |
|---|---|---|
| Kutu satır boyunun 0,55'inden alçaksa atılıyor | Cevaplar tam boyda yazılıyor; "ğ"nin şapkası, iki noktanın noktası değil | 0,45 → 18 · **0,55 → 19** · 0,75 → 16 |
| Kutu boyunun 1,3 katından genişse atılıyor | Ne rakam ne B/D/Y enine yayılıyor; yatık leke ya birleşmiş iki harf ya altı çizgisi | 1,0 → 21 · **1,3 → 25** · 1,8 → 24 |
| Satır, sayfanın tipik yazı boyunun 0,7'sinden ufaksa hiç okunmuyor | Kâğıtta basılı şeyler de var | Puanı değiştirmiyor, **uydurma satırı kaldırıyor** |

Üçüncüsü puanı yükseltmiyor ama ilaç kutusunun logosunu "7D" diye okuyup
olmayan bir sonuç üretmeyi bitiriyor. Boş kutu, yanlış dolmuş kutudan iyi.

Bunlar yerine oturunca güven eşiği **düşürülebildi**: 0,60 → 20, 0,40 → 21,
0,25 → 22 satır. Yüksek eşik artık yalnızca doğru okunmuş ama çekingen
rakamları atıyor ve bir satırdan tek karakterin düşmesi o satırı kullanılamaz
yapıyor.

### Küme sonu harf olmak zorunda, ağa da öyle soruluyor

Kalın uçlu kalemde tanıyıcı için kalın bir "B" ile "3", kalın bir "D" ile "0"
arasındaki fark birkaç puan — ölçüldü, "1B" satırı "13", "4D 1Y" satırı
"40 1Y" diye çıkıyordu ve harfsiz kalan küme atılıyordu.

Kâğıdın biçimi bu belirsizliği çözüyor: küme her zaman sayıyla başlar ve bir
işaretle biter, "13" diye bir küme yoktur. O yüzden harfsiz biten bir diziye
son kutunun **en büyük sınıfı** değil, **en olası harfi** soruluyor (`tani`
artık bütün olasılıkları döndürüyor). Kutunun satır boyunda olması şart:
noktaya harf demek olmayan bir cevap uydurmak olurdu.

### Bir dizide iki küme varsa o bir sözcük

Gerçek cevaplar arasında her zaman boşluk var — kâğıda "12D 6Y" yazılıyor,
"12D6Y" değil. Bitişik bir kutu dizisinden iki küme çıkıyorsa o kutular bir
sözcüğün harfleridir: ölçüldü, "Edebiyat" harfleri "6D8B" diye okunup
"Türk Dili ve Edebiyat: 36D" satırını "6D 8B 36D" yapıyordu.

Satırın **son** dizisi bu kuralın dışında: ders adı solda, cevap sağda ve
sağında başka bir şey olmayan bir dizi sözcük olamaz. Sıkışık yazılmış
"3D 2B" ancak bu muafiyetle kurtuluyor.

### Boşluk eşiği yalnızca gerçek karakterlerden ölçülüyor

Tipik genişlik bütün lekelerin ortalaması alınınca bozuluyordu: ders adının
ufak parçaları onu aşağı, birbirine değmiş "oğ" gibi geniş lekeler yukarı
çekiyor. Ölçü yalnızca boy filtresini geçen kutulardan alınınca eşik anlamlı
hâle geldi — 0,55 → 20, **0,75 → 21**, 1,2 → 11 satır.

### Sınav anında çoğaltma denendi ve kötüleştirdi

**Sınav anında çoğaltma denendi ve kötüleştirdi** (aynı karakteri incelterek
ve kalınlaştırarak sorup olasılıkları ortalamak): o günün 13 satırlık taban ölçümü 8-10'a düştü.
İşi zaten eğitim yapıyor — `scripts/taniyici-egit.mjs` her örneği rastgele
kalınlıkta gösteriyor. Tekrar deneme.

### Ders adını kullanıcı eşliyor

Tanıyıcı ders adını okumuyor, o yüzden okuduğu satırlar ad olmadan geliyor ve
ekran her satırın yanında bir ders seçici gösteriyor. Sıraya bakıp tahmin
etmek — "birinci satır listenin ilk dersi" — kolay olurdu ama öğrenci kâğıda
istediği sırayla yazıyor ve **yanlış dolmuş bir kutu boş kutudan kötü**.

Eşlenen satırlar ayrı bir çözümleyiciden geçmiyor: `<ders adı> <sayılar>`
diye metin kurulup `denemeyiCoz`'e veriliyor, böylece D/Y/B kuralları,
çıkarım ve "soru sayısını aşan satırı atla" denetimi orada da geçerli oluyor.
Çakışırsa kullanıcının eşlemesi ML Kit'in okumasını eziyor: biri tercih,
öteki tahmin.

### Örnek kamera açılmadan gösteriliyor

"Kâğıdı okut"a basınca kamera değil önce **örnek yazım** çıkıyor
(`ORNEK_YAZIM`). Okuma o düzene göre ayarlandı ve düzeni bilmeden çekilen
fotoğraf okunmuyor; örneği kameradan sonra göstermek kullanıcıya kâğıdı
yeniden yazdırmak olurdu.

Düğme yalnızca cihazda görünüyor (`okumaVarMi`): eklentinin web karşılığı yok
ve çalışmayan bir düğme bozuk bir uygulama demek.

### Kutuların kaynağı okunan metin

Ekranda okunan **metin** duruyor (`okuma`), okunan sayılar değil: şablon
değişince metin yeni şablona göre yeniden çözülüyor. İki ayrı doldurma yolu
(biri okurken, biri şablon değişince) zamanla birbirinden ayrışırdı. Metnin
yanındaki `sayac` aynı kâğıdın iki kez okutulabilmesi için — metin aynı kalır,
kutuların yeniden dolması gerekir.

**Şablon önerisi sessizce uygulanmıyor.** Okunan metin başka bir şablona daha
çok uyuyorsa (`sablonOnerisi`) bir bağlantı çıkıyor; seçim kullanıcının kendi
kararı ve elinden alınmıyor. Eşitlikte öneri yok.

### Eklenti yamalı: yalnızca Latin

`@capacitor-mlkit/text-recognition` beş betik modelini birden paketliyor
(Latin, Çince, Devanagari, Japonca, Korece) ve README'si bunu kabul edip
dışlama yolu sunmuyor. Ölçtük: dört fazla model AAB'de kullanıcıya **8,5 MB**a
mal oluyor (arm64 telefonda 16,2 MB yerine 7,7 MB) ve hiçbiri bu uygulamada
kullanılmıyor — Türkçe Latin alfabesiyle yazılıyor.

Çözüm `patches/@capacitor-mlkit+text-recognition+8.2.0.patch`: `patch-package`
her `npm install`da uyguluyor (`postinstall` betiği). Yama iki şey yapıyor:

- `android/build.gradle`'dan dört bağımlılık satırı siliniyor.
- `TextRecognition.java`'daki `createRecognizerOptionsForScript` sabitleniyor.
  **İkincisi olmadan birincisi tehlikeli**: o yöntemin `switch`'i dört sınıfa
  referans veriyor ve sınıflar paketten çıkınca çalışma anında
  `NoClassDefFoundError` riski doğuyor.

Bedeli: eklenti sürümü yükselince yama tutmayabilir. `npm install` o zaman
**sesli** hata veriyor, sessizce geçmiyor. Yamayı kaldırmak için dosyayı silip
`npm install` yeter.

Fork edilmedi çünkü gereği yoktu: ayrı bir depo, sürüm ve yayınlama yükü
getirir, kazandırdığı şey iki dosyalık bir diff.

`Script` tipinde öteki betikler hâlâ görünüyor ama yamalı eklenti hangisi
istenirse istensin Latin döndürüyor. `lib/deneme-ocr.ts` zaten Latin geçiyor.

### Fotoğraf saklanmıyor

Yol yalnızca okuma sırasında kullanılıyor (`cihazdanKagit`), depoya
girmiyor. Yanlış soru fotoğrafları `resim-depo.ts`'e giriyor çünkü orada
fotoğraf verinin kendisi; burada araç. Küçültme de yok: `EN_BUYUK_KENAR`da el
yazısı rakamlar bulanıyor ve dosya zaten atılıyor.

## Doğruluk

Puan ve sıralama hesabı **tahmindir** ve arayüzde her zaman böyle sunulur. Tahmini
kesin sayı gibi gösteren bir arayüz yazma; uyarıyı kapatılabilir yapma.

## Derleme

### Elden kurulan APK'yı Play Protect engelliyor

"Uygulama, cihazınızı korumak için engellendi" — telefona kurulum hiç
başlamıyor. Sebep pakette **değil**: ML Kit, imza (debug ve release),
versionCode, ABI sayısı, izinler ve derleme tipi tek tek elendi; başka bir
cihazda kurulmuş eski bir APK'yla aynı sertifikayı, aynı dört ABI'yi ve daha
az izni taşıyan paket de engellendi. Play Protect kararı dosyanın içeriğine
değil, Google'ın o dosya özetini daha önce görüp görmediğine veriyor — yeni
derlenen her APK dünyada tek kopya.

Elde denemek için Play Store › profil › Play Protect › taramayı kurulum
süresince kapatmak gerekiyor. Kalıcı çözüm Play iç test kanalı: Play'in
imzalayıp dağıttığı paketi Protect sorgulamıyor.

**Bu teşhisi tekrar etme.** Yeni bir APK kurulmuyorsa önce Play Protect'i ele;
paket farklarını aramak saatler alıyor ve hiçbiri sebep değil.

APK için **JDK 21 şart** — sistem varsayılanı JDK 25, Gradle 8.14.3 desteklemiyor.
`JAVA_HOME=/usr/lib/jvm/java-21-openjdk npm run apk`.

Değişiklikten sonra en az `npm run typecheck`, saf mantığa dokunduysan `npm run test`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
