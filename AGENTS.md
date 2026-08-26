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

### Kurulum bir karşılama ekranıyla açılıyor

İlk kurulumda soru sorulmadan önce tek bir ekran duruyor: ortada maskot,
altında "Rabi seni tanısın" ve tek satırlık bir söz, en altta yalnızca
**Başlayalım**. Sebep, ilk ekranın eskiden doğrudan "Bu yıl kaçıncı
sınıftasın?" diye sorması: uygulamayı ilk açan kişi kendini tanıtan bir şey
görmeden forma düşüyordu.

Karşılama `adimlar` dizisinin ilk elemanı ama ötekilerle aynı düzeni
kullanmıyor — `Kurulum` onun için erken dönüyor. Kart, geri düğmesi ve adım
noktaları orada yok: ekranda yapılabilecek tek bir şey varken üçü de gürültü.
Adım noktaları zaten karşılamayı **saymıyor** (`adimlar.slice(1)`); nokta
"kaç soru kaldı"yı anlatıyor ve karşılama soru sormuyor.

Son adımın düğmesi bu yüzden "Başlayalım" değil **"Hazırım"**: aynı akışta iki
kez "Başlayalım" yazan düğme, kullanıcıya başa döndüğünü düşündürüyordu.

### Ayarlar satırları kapalı açılıyor

Seçenek çipleri satırın altında sürekli açık dururken ekran üç ekran boyundaydı.
Şimdi satır kapalı: solda ad, sağda seçili değer, uçta ok. Tek satır açık kalıyor
(`acikAyar`), ikincisini açmak birincisini kapatıyor. Anahtarlı satırlar
(hatırlatma, müzik) açılamaz: satıra dokunmak anahtarı çeviriyor, aynı satır hem
anahtar hem liste olamaz — hatırlatma saati o yüzden **ayrı** bir satır.

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

Beş efekt var ve hepsi **ortak koddan** çıkıyor: ses `lib/oyunlar/oyun-sesi.ts`,
görsel olanlar `components/oyun-kabuk.tsx` ile `app/globals.css`. Oyun
dosyalarına hiç dokunmuyorlar.

| Efekt | Ne zaman | Nerede |
| --- | --- | --- |
| Perde yükselmesi | her ardışık doğru, sekiz çeyrek tona kadar | `oyun-sesi.ts` |
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

Perde sayacı da oyunlarda değil modülün içinde: seriyi 18 dosyadan parametre
olarak geçirmek yerine `oyun-sesi.ts` ardışık `dogru` çağrılarını kendi sayıyor,
yanlış ve tur bitişi sıfırlıyor. Tavan (`EN_COK_KADEME`) şart — sınırsız yükselen
bir ses ödül olmaktan çıkıp rahatsız ediyor.

Kademe **çeyrek ton** (`KADEME`), yarım ton değil. Yarım tonken kulakta bir tam
ton gibi duyuluyordu: art arda gelen doğrularda basamaklar tek tek değil topluca
işitiliyor ve üçüncü doğruda ses başkalaşıyordu.

Efekt seviyesiyle oyun müziğinin seviyesi (`oyunlar.tsx`, `sesSeviyesi`) tek bir
dengenin iki ucu: efekt 1'den 0.42'ye inince müzik altta kaldı ve o kadar geri
verildi. Birine dokunursan ötekine de bak.

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

Hepsi `prefers-reduced-motion` altında susuyor. Yeni bir efekt eklersen o
medya sorgusuna da ekle: buradaki hareketlerin hiçbiri bilgi taşımıyor, bilgi
sayıda ve renkte duruyor.

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

Veri iki dosyada, mantık üçüncüde: `lib/veri/universiteler.ts` (205 üniversite),
`lib/veri/bolumler.ts` (77 bölüm), `lib/hedef-katalog.ts` (saf, test edilebilir).

### Katalogda sıra yazıyor, puan yazmıyor

Her bölüm satırında **başarı sırası** var, taban puan yok. Puan `siralama.ts`
içindeki `siralamadanPuan` ile o yılın gerçek ÖSYM yerleştirme dağılımından geri
hesaplanıyor. Sebep: sıralama yıldan yıla neredeyse yerinde duruyor, puan
sınavın zorluğuyla oynuyor. Böylece tahminin elle tutulan kısmı en yavaş
bayatlayan sayıya iniyor ve puan yeni yıl verisi gelince kendiliğinden
güncelleniyor.

`siralamadanPuan` ile `yilSiralamasi` birbirinin **tersi** olmak zorunda; ikisi
de logaritmik iç değer kullanıyor ve `hedef-katalog.test.ts` gidip gelen
çevrimin başladığı puana döndüğünü denetliyor. Birine dokunursan ötekine de bak.

### Kademe

Her üniversitenin 1–5 arası bir kademesi var; bölümün iki ucu (`ustSira`,
`altSira`) arasında **geometrik** iç değerle o kademenin sırası bulunuyor.
Sıralamalar kademe kademe doğrusal değil katlanarak büyüyor (Tıp: 400 → 60.000)
— doğrusal iç değer ortadaki kademeleri tek bir yere yığardı.

200 × 77 satırlık gerçek YÖK Atlas tablosu bilerek taşınmıyor: hem uygulamayı
şişirirdi hem her ağustos elde güncellenirdi. Model tek boyutlu olduğunu kabul
ediyor — Tıp'ta önde olan üniversite Hukuk'ta da genelde önde.

Vakıf üniversitelerinde kademe **tam burslu** kontenjanı anlatıyor; ücretliyle
burslunun arası uçurum ve hedef koyan öğrencinin kovaladığı sayı burslununki.

### İki ayrı süzgeç

Bölüm listesi iki şeye birden bakıyor ve ikisi farklı soru: `alanlar`
üniversitede o fakülte var mı, `sonKademe` o bölüm bu kademede açılıyor mu. Tıp
fakültesi olmayan bir üniversitede Tıp seçtirmek tahminden çok daha kaba bir
yanlış olurdu; Havacılık ve Uzay Mühendisliği'ni mühendislik fakültesi olan her
üniversitede listelemek de ikinci soruyu atlamak olur.

`hedef-katalog.test.ts` her üniversitenin **en az bir** bölüm açtığını
denetliyor: boş liste, kullanıcıyı seçtiği üniversitede çıkmaz sokağa sokar.

### Elle giriş kipi kalıyor

Ekranın serbest metin kipi silinmedi. Katalog dışı bir hedef kayıtlıysa ekran o
kiple açılıyor (`universiteBul` null dönüyor), çünkü eski sürümde herkes iki adı
elle yazıyordu ve o kayıtlar duruyor. `Hedef` tipi de kimlik değil **ad**
tutmaya devam ediyor — kimliğe geçmek o kayıtları geçersiz kılardı.

Seçim ekranda ayrı bir state'te durmuyor, iki addan türetiliyor: iki kaynak
olsaydı elle yazılan ad ile seçili kayıt birbiriyle çelişebilirdi.

Çıkan sayılar tahmin ve aşağıdaki **Doğruluk** kuralına tabi: kutular
düzenlenebilir, uyarı kaldırılamaz.

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
