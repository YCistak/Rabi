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

### Pomodoro'da sınav provası

Pomodoro'nun tepesindeki **Deneme provası** çipleri turu ÖSYM'nin süresine
çeviriyor: TYT 165, AYT 180, YDT 120 dakika (`lib/sinav-provasi.ts`). Amaç
denemeyi uygulamanın içinde çözdürmek değil, kâğıdı çözerken süreyi buradan
tutturmak — öğrenci zaten telefonun kronometresini açıyordu ve o süre hiçbir
yere yazılmıyordu.

Prova **aşama değil ayrı bir kip**. `Asama`ya dördüncü bir değer olarak
eklenseydi `sonrakiAsama` her provanın arkasına mola koyardı; 165 dakikanın
sonunda beş dakikalık kısa mola vermek provayı prova olmaktan çıkarır. Seçili
provada:

- Süre `ayar.calisma` değil provanın süresi, o yüzden **Süreler kartı hiç
  çizilmiyor** — kilitli bir kutu, kullanılıyormuş izlenimi verir. Ayarlar
  kaybolmuyor, prova kapatılınca aynı değerlerle geri geliyor.
- Ders çipleri yok: seans `PROVA_DERSI` ("Deneme Çözümü") ile kaydediliyor.
  Ad uydurulmadı — istatistik seansları ders adına göre topluyor ve listede
  (`CALISMA_DERSLERI`) olmayan bir ad orada tek başına bir dilim olurdu.
- Tur sayacı ilerlemiyor, arkasından mola gelmiyor; sayaç dolunca sıradan
  çalışma turuna dönüyor. Dönmeseydi bir sonraki "Başlat" yeniden 165 dakika
  verirdi.
- Yarıda "atla"mak provadan çıkmak demek ve seans **yazılmıyor** — sayaç
  dolmadı. Oyunlardaki "yarım tur da bir tur" kuralının tersi: orada kayıt
  bankaya düşüyor, burada ölçülen şey sürenin kendisi.

Soru sayıları elle yazılmıyor, `OSYM_TEST_SORU`dan toplanıyor: aynı sayı
`sablonlar.ts`te zaten duruyor ve iki yere yazılan bir sayı dağılım
değiştiğinde birinde eski kalırdı. Süreler ise elle yazılı — ÖSYM'nin kararı,
soru sayısından türetilemez.

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
itiyorlardı. Yeri değişmedi (sayacın üstünde) çünkü gerekçe değişmedi — karar
her turda değişiyor ve turu başlatmadan önce görülmeyen bir ayar, o turda
yanlış kurulmuş bir ayardır.

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
1'den 0.42'ye indi (çok gürdü). **Sayıların eşit olması gürlüğün eşit olması
demek değil**: efektler ustalanmış mp3, dalgaları baştan sona tepeye yakın;
parçalar sıfırdan sentezlenmiş ince dalgalar ve aralarında sessizlik var. Bu
yüzden müzik sayıca efektin üstünde duruyor. Birine dokunursan ötekine de bak;
sıralamayı `mod-muzigi.test.ts` denetliyor.

**Ana seviye yanlış koldu.** Müzik üç kez yükseltildi (0.09 → 0.26 → 0.5) ve
kullanıcı üçünde de "duyulmuyor" dedi. Sebep şu: ana seviye karışımdaki her
şeyi birlikte kaldırıyor ve karışımın en yükseği vuruştu (`tepe` 0.9) — ezgi
notaları onun altıda biri kadardı (0.07–0.11), yani seviye arttıkça duyulan
şey davul oluyordu. "Müzik" diye duyulan şey ezgi. Düzeltme parçaların **kendi
dengesinde**: vuruş indi, ezgi ve bas çıktı, çıkışa bir sınırlayıcı kondu
(`RitimMotoru.kur`) ve ana seviye onun arkasında 0.85'e çıkabildi. Bir daha
"duyulmuyor" gelirse önce tepelere bak, ana seviyeye değil.

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

Ses dengesi iki katmanlı ve **ikisi birlikte** okunmalı:

- **Parçanın içi.** Duyulan şeyi ezgi belirliyor, ana seviye değil: nota
  tepeleri (`nota`'nın `tepe`'si) vuruşun (`vurus`) altında ama ondan kopuk
  değil. Vuruş 0.9'dan ~0.5'e indi, ezgi ve bas iki katına çıktı; ters oran
  parçayı davul soloya çeviriyordu.
- **Ana seviye.** `MUZIK_SEVIYESI` (0.85) efekt dosyalarının seviyesinin
  (`DOSYA_SEVIYESI`, 0.42) sayıca üstünde ama kulakta hizasında — sentezlenmiş
  dalga, ustalanmış mp3'le aynı sayıda daha kısık duyuluyor. Bu kadar
  yükselebilmesi çıkıştaki sınırlayıcıya bağlı (`RitimMotoru.kur`);
  sınırlayıcı olmadan üst sınırı kırpılma koyuyordu ve kırpılan parça yüksek
  değil bozuk duyuluyor.

Rahat modun pad'i ana seviyeden türeyen `RAHAT_SEVIYESI` ile altta kalıyor:
vuruşsuz ve sürekli olduğu için aynı sayıda daha çok fark ediliyor — kullanıcı
Rahat turda pad'i "rahatsız edici" buldu. Ana seviye yükselince oran 0.35'ten
0.22'ye indi ki **çarpım yerinde kalsın**; yükseltilen şey ritmik parçaların
ezgisiydi, pad'in öyle bir sorunu yok. Sürekli çalan bir seste ölçü "duyuluyor
mu" değil "farkında olmadan dinlenebiliyor mu". `mod-muzigi.test.ts` iki
sınırı da denetliyor.

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

## Ana sayfadaki dört kutucuk

İki bölüm de (Araçlar, Oyunlar) dört kutucuk gösteriyor ve ikisi aynı koddan
besleniyor (`lib/son-kullanilan.ts`). İki kural üst üste duruyor:

- **Sabitlenenler önde.** Kullanıcı kalem tuşundan en fazla dört tane seçiyor
  (`components/kisayol-duzenle.tsx`, kayıt `rabi-sabit-araclar` /
  `rabi-sabit-dersler`). "En son kullanılan" iyi bir varsayılan ama bir tercih
  değil: sıra her turda değişiyor ve kullanıcı aradığı kutucuğu her seferinde
  okumak zorunda kalıyordu.
- **Kalan yerler son kullanılanlarla doluyor.** Sabitleme listeyi kapatmıyor;
  tek bir aracı sabitlemek ötekilerin üçünü birden gizleseydi kalem tuşu
  kutucukları eksiltmenin yolu olurdu. Hiç sabit yoksa davranış eskisinin
  birebir aynısı.

Sabitler son kullanılanlardan **ayrı** anahtarda: biri tercih, öteki her turda
değişen bir sıra. Tek listede tutulsalardı bir oyunu açmak kullanıcının kurduğu
düzeni bozardı. İkisi de yedeğe girmiyor — bu cihazdaki yerleşim.

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

### Kilit yok, sıra var

Konular sırayla açılmıyor. Sınav hazırlığındaki öğrenci yarın işlenecek
konuya bugün bakmak ister ve kilitli bir harita onu kendi müfredatından uzak
tutar. Patika sırayı **gösteriyor**, dayatmıyor; sıradaki konunun düğümündeki
halka aynı işi zorlamadan yapıyor.

Haritanın tepesinde bir süre "Kaldığın yer" kısayolu duruyordu; kaldırıldı.
Ekranın işi seçtirmek ve seçilecek yer zaten patikanın kendisi — kısayol,
haritanın gösterdiği sırayı ikinci kez ve tek bir konuya indirgeyerek
anlatıyordu.

Tamamlanma destenin sonuna gelmekle kazanılıyor. Yarıda çıkılan destede
işaretlenen kartlar bankaya düşüyor ama konu bitmiş sayılmıyor — yoksa ilk
kartı işaretleyip çıkmak konuyu tamamlamanın yolu olurdu.

### Ana sayfada kısayol değil kendi bölümü

Ana sayfada bölümün adı **Bilgi Kartları** (kod tarafı `konu` kalıyor):
ekranın kendisi kart gösteriyor, ders anlatmıyor. Bölüm `KARTLAR` listesinde
**yok** — Araçlar şeridine bir kutucuk
olarak konsaydı son kullanılanlarla birlikte sıraya girip kayardı ve hemen
altındaki kutuda ikinci bir kopyası dururdu. Buradaki iş "aç ve oku", her gün
aynı yerde durması gerekiyor. Bilmediklerim de ayrı bir araç değil, haritanın
içinde: kartlar oraya buradan düşüyor.

### Patikanın şeritleri

Düğümler üç şeride yayılıyor (`SERITLER = [1, 2, 1, 0]`) ve aralarındaki eğri
`preserveAspectRatio="none"` bir SVG. Şerit konumları yüzde olarak biliniyor
ama piksel karşılığı ekran genişliğine bağlı; yatayda esneyen bir kutu bunu
**ölçüm yapmadan** çözüyor. Düğüm daire değil yuvarlatılmış kare — uygulamanın
geri kalanı (ana sayfa kutucukları, kartlar) bu dili konuşuyor.

Ders zeminleri `AILE_ZEMIN` / `AILE_YAZI` tablolarında **tam yazılı**;
`bg-${aile}-kart` gibi birleştirilen bir ad Tailwind'in taramasından düşer ve
şerit renksiz kalır.

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
