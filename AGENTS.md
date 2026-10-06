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
    telefon modeli ve ada bağlı olmayan okunur bir ad). "Başka" sebebinin
    kısa notu (en çok 32 harf) yeni bir alan değil, `sebep` alanının içinde
    ("Başka: …") gidiyor — kural `sebep`e 40 harf veriyor ve yeni alan,
    kural konsolda değişene kadar her bildirimi 403 ile düşürürdü. Ne gönderildiği hem ilk
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
    `public/gizlilik/index.html`, `public/gizlilik/veri-ozeti.html`, Play'in
    Data Safety beyanı, `ios/App/App/PrivacyInfo.xcprivacy` ve App Store
    Connect'teki App Privacy beyanı birlikte değişmeli.
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
  (`--background` #F8F8F7). Renk **derse** ait, oyuna değil, ve bir ders
  **her yerde aynı renkte**: konu haritası ile mini oyunlar aynı paleti
  okuyor, `--konu-<ders>` (Tailwind `bg-konu-turkce`, `text-konu-tarih-koyu`,
  `bg-konu-kimya-ok`…). Matematik mavi, Türkçe/Edebiyat sarı, Fizik mor, Kimya
  turuncu, Biyoloji yeşil, Tarih kahverengi, Coğrafya turkuaz. Oyunlar bir
  süre kendi ailelerindeydi ve Türkçe haritada hardal, oyunlarda pembeydi.
  Eski aileler (`yzm`, `isl`, `edb`, `cog`, `trh`, `byl`, `fzk`) duruyor ama
  artık ders kimliği değil, genel pastel: araç kutucukları, rozet kademeleri
  ve harita göstergeleri (deniz, kara).
  Kart yüzeyi `golge-kart` sınıfıyla: beyaz kart, sıcak gölge.
- Zemin rengi dört yerde birden yazılı ve **birlikte** değişmeli:
  `--background` (globals.css), `acilis.tsx`'teki `ZEMIN`, Android'in
  `acilis_zemin` / `uygulama_zemin` renkleri ve iOS'un
  `LaunchScreen.storyboard` + `capacitor.config.ts` → `ios.backgroundColor`.
  Ayrılırlarsa açılışta renk sıçraması olur.
- Yazı tipi tek: **Nunito**. İki istisna var, ikisi de tek bir başlık:
  açılış ekranındaki "RABI" **Rubik** (`font-acilis`, tasarım 2d ismi
  Rubik 800 ile çizdi, ders makarası korudu; ekranda tek şey isim ve Nunito'nun yuvarlak uçları
  orada başka bir marka gibi duruyor) ve aylık özetin kapağındaki ay adı
  **Manrope** (`font-marka`). Açılış bir süre Manrope'tu, 2a ile Outfit'e,
  2d ile Rubik'e geçti. İkisi de başka hiçbir yerde kullanılmıyor; yeni bir yerde
  kullanmadan önce istisnanın neden açıldığına bak. Başlık ayrı aile değil ayrı kalınlık — `font-display`
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
Kaynaklar zemini kesilmiş, gerçek alfa taşıyan PNG (ilk takım 2048'lik, ikinci
takım 1254'lük; betik ölçüyü kaynaktan okuyor); betik saydamlığı
kaynaktan okuyor ve tek işi ölçü: bütün pozları aynı tuvalde **aynı
yükseklikte** vermek. Boy eşitliği şart: `Rabi` ölçüyü tek bir sayı olarak
biliyor, eşit olmasalardı maskot poz değiştirdiğinde büyüyüp küçülürdü.

Kaynaklar bir süre siyah zeminli JPEG'di ve betik zemini kenardan taşırarak
siliyordu. O yol maskotu bozdu: taşma gövdedeki koyu geçişlere sızıyor, kürkün
yanında düz bir kesik bırakıyordu. Zemin silme işi artık depoya girmeden,
kaynağın kendisinde bitiyor.

**`durum` ile `poz` ayrı kalıyor.** `durum` yalnızca ekran okuyucu etiketi,
çizilecek dosyayı `poz` seçiyor. İkisini birleştirmek — durumdan doğrudan
dosya türetmek — denenebilir görünüyor ama bir ekranın görselini başka bir
ekranın durumuna bağlar: kurulumda adımdan adıma uçan tavşan (`KurulumMaskotu`)
iki adımda **aynı görseli** taşımak zorunda, durumdan türeyen bir görsel onu
yolun ortasında başka bir tavşana çevirirdi.

**Kurulumdan ana sayfaya geçiş uçmuyor, soluyor** (`KurulumGecisi`,
`acilis.tsx`). Tavşan bir süre "Hazırlanıyor" ekranından sonra kurulumun üst
ortasında belirip ana sayfa başlığına süzülüyordu; telefonda "ortaya ışınlanıp
sol üste kayıyor" diye okundu ve kullanıcı solma istedi. Zemin renginde bir
örtü ana sayfanın üstünde kısa bir süre durup sönüyor. Açılış ekranında da
artık uçan tavşan yok (tasarım 2d, aşağıda).

**İki baş çekimi var: `yuz` ve `kafa`.** Tam boy pozlar 70 pikselin altında
lekeye dönüşüyor (gövde, kollar ve tutulan nesne tek bir şey oluyor), o yüzden
küçük yerlerde baş kullanılıyor: oyun başlıkları (26–54) `yuz`de, kurulumun
karşılama ekranı `kafa`da. Ana sayfanın selamlaması artık durum kafalarında
(`kafa-*`, aşağıda).

İkisi ayrı duruyor çünkü kaynakları ve işleri ayrı. `yuz`, "normal maskot"un
elle ölçülmüş bir kırpımı ve aynı zamanda uygulama ikonunun (`ikon-uret.mjs`),
Android'in engel katmanının ve pomodoro bildiriminin kaynağı — onu değiştirmek
ikon üretimini de dokundurur. Kırpımın kutusu göz kararı değil ölçülerek
bulundu: alt kenar gövdenin en dar satırı, yan kenarlar yanakların en geniş
satırı. `kafa` ise kendi kaynağından ("kafası gözüken maskot") geliyor,
kırpılmıyor ve yalnızca arayüzde kullanılıyor.

`ikon-uret.mjs` yüzün tuvaldeki kutusunu **sabit sayılarla** biliyor.
`maskot-uret.mjs` çalışınca o sayıları ekrana yazıyor; kırpma değişirse ikon
betiğindeki `MASKOT` da değişmeli ve `public/tavsan-yuz.png`
`android/.../drawable-nodpi/tavsan_yuz.png`e yeniden kopyalanmalı — yerli
taraf `public/` altını okuyamıyor.

**Zıplayan sevinç ayrı bir poz.** `sevinen` ("sevinen maskot 2") ile
`ziplayan` ("sevinen maskot 3") aynı ruh hâlinin iki çizimi ve ikisi de
kullanılıyor: `ziplayan` aylık özette, `sevinen` başka yerlerde duruyor. Tek
poza indirilseydi aynı görsel iki ayrı bağlamda tekrarlanırdı.

**Bütün pozlar saydam PNG'den geliyor.** `kafa` ve `ziplayan` bir süre siyah
zeminli JPEG'den geliyordu ve betik yalnızca o ikisi için zemini kenardan
taşırarak siliyordu; kulak ve pati kenarlarında koyu bir hare bırakıyordu.
Temiz kaynakları gelince JPEG dalı betikten tümüyle silindi — yeni bir poz
eklerken kaynak saydam PNG olmak zorunda, betikte zemin silecek bir şey yok.

Kaynak klasöründeki her kaynak kullanılmıyor. Dışarıda kalan "sinirli" bilerek
kaldı: uygulamada karşılığı olan bir ruh hâli değil — Rabi yanlış cevapta
kullanıcıya kızmıyor, efekt zaten sarsıntıyla "yanlış" diyor.

**İkinci takım (v2, 2026 ekimi) çeşit için geldi.** Uygulamada on iki poz
vardı ve boş durumların beşi aynı uyuyan, kahve içen tavşandı; kullanıcı
çeşidi artırmak istedi. 63 pozluk takımdan 28'i alındı. Kural: **poz ekranın
işini yapıyor.** Boş bir ekranda duran tavşan oranın ne için olduğunu
gösteriyor — yanlış bankasında büyüteçle inceliyor, istatistikte bitki
suluyor (veri girdikçe büyüyor), oyun bankası boşken yaprak süpürüyor
("temizlendi"). Ruh hâli değil eylem; durum etiketi ruh hâlini zaten
ekran okuyucuya söylüyor.

| Poz | Kaynak | Nerede |
| --- | --- | --- |
| `defterli` | defter tutan | kurulum › sınıf adımı |
| `abakuslu` | abaküsle sayan | kurulum › notlar; Sıralama › deneme yok |
| `durbunlu` | dürbünle bakan | kurulum › bölüm |
| `elleri-belde` | elleri belde | kurulum › günlük hedef |
| `megafonlu` | megafonla konuşan | kurulum › hatırlatma |
| `cantali` | çanta kapatan | "Uygulaman hazırlanıyor" |
| `fotografci` | fotoğraf çeken | Denemeler › kayıt yok (kâğıt fotoğrafla okunuyor) |
| `buyutecli` | büyüteçle inceleyen | Yanlış Soru Bankası › boş |
| `supuren` | yaprak süpüren | Oyun Bankası › boş ("iyi haber") |
| `bitkili` | bitki sulayan | İstatistik › veri yok |
| `haritali` | haritadan yol bulan | Harita › dersin kartları hazırlanıyor |
| `kitapli` | kitabı inceleyen | Harita › anlatım kartı (`okuyan`ın yerine) |
| `tahtali` | tahtaya yazan | oyun tanıtımı (nasıl oynanır) |
| `laptoplu` | laptopta çalışan | odak daveti (Pomodoro) |
| `saatli` | saate bakan | odak kilidi kurulumu |
| `basparmak` | başparmak kaldıran | hızlı kontrol › doğru; kapanış › iyi |
| `damgali` | onay damgası basan | kapanış › iyi |
| `alkislayan`, `dans`, `takla` | alkışlayan, dans eden, takla atan | kapanış › harika (`sevinen` ile dönüşümlü) |
| `gerinen`, `esneyen`, `bagdas`, `uzanan` | gerinen, ayak parmaklarına uzanan, bağdaş kuran, uzanan | deste molası (dönüşümlü) |
| `selamlayan` | eğilerek selamlayan | aylık özetin kapanışı ("Yarın yine buradayım") |
| `kahkaha` | kahkaha atan | yalnızca durum kafası |

**Dönüşüm tarihten ya da destenin seçiminden, rastgele değil.** Aynı yere
birden çok poz düşüyorsa (`gununPozu`, `lib/maskot.ts`) seçim günün
tarihinden türüyor — `gunun-hali.ts`teki cümle kuralı: gün içinde sabit,
günden güne değişiyor. Mola pozları mola metniyle aynı `secim` sayısından.
Rastgele seçim, ekran her yeniden çizildiğinde başka bir tavşan demekti.

**Mola zıplamıyor.** Deste molasında tavşan bir süre zıplıyordu; mola bir
kutlama değil, kartların arasında nefes. Dört dinlenen poz dönüyor.

**Dışarıda kalanlar ve nedeni:**

- **Müzik aletleri** (flüt, davul, tef): uygulamada müzik yok ve kaldırılışı
  bilinçli (bkz. **Oyunda müzik yok**, **Pomodoro'da müzik yok**). Müzik
  çalan tavşan olmayan bir özelliği vaat ederdi.
- **Havuç tutan**: havuç para birimi kaldırıldı (bkz. **Seviye, havuç ve
  mağaza kaldırıldı**); havuç kaldıran tavşan onu çağrıştırıyor.
- **Hediye tutan**: ödül/hediye mekaniği yok, aynı gerekçe.
- **Oyun/el işi** (top sektiren, top yuvarlayan, satranç, yapboz, blok kule,
  kâğıt kesen/katlayan, yapıştırıcı, fırça, kâğıt uçak, seksek): uygulamanın
  bir işine karşılık gelmiyor. Yapboz ve satranç aday olabilirdi; konu
  bitişi ve oyun tanıtımı zaten başka pozla dolu.
- **Eşi olanlar**: büyüteç tutan (büyüteçle inceleyen seçildi), kupadan içen
  (`kahveli` var), düşünerek çenesine dokunan (`dusunen` var), cetvelle çizen
  (abaküsle aynı işi anlatıyor), kitap ayracı ve kutuya kitap (okuyan/kitaplı
  var), deftere yazan (yalnızca durum kafası olarak alındı), teleskop
  (dürbün aynı "uzaktaki hedef"i anlatıyor ve Hedefim'in maskotu 64 piksel —
  tam boy orada okunmuyor).
- **Anlamı belirsiz ruh hâlleri**: oturan, çömelen, koşan, parmak ucunda
  yürüyen, emekleyen, tek ayakta denge, yüzüstü ayak sallayan, utangaç,
  şaşırıp sıçrayan, kucak açan, çiçek tutan, silgiyle silen. Yerleştirilecek bir ekran bulunduğunda kaynağı
  kopyalayıp betiğe eklemek yeterli; boşta duran poz paketi şişiriyor.

**Pozlar paletli PNG, `yuz` hariç.** Bütün pozlar 256 renge indirilip
yazılıyor (`uret`'in varsayılanı `sikistir: true`): ~60 kB yerine ~15–20 kB.
Önce yalnızca ikinci takım sıkıştırılıyordu (38 yeni dosya ~670 kB, düz
PNG'yle iki megabaytı aşardı); sonra ilk takımın 11 pozu da aynı yola alındı
ve 671 kB'tan 176 kB'a indi. `public/tavsan-*.png` toplamı 1,42 MB'tan
0,93 MB'a düştü. Fark yalnızca üç kat büyütmede kürkte ince bir kumlanma.

**`yuz` düz PNG kalıyor** (`sikistir: false`) ve betik onu baytı baytına aynı
üretiyor: uygulama ikonunun (`ikon-uret.mjs`), Android
`drawable-nodpi/tavsan_yuz.png` ve iOS `KalkanGorunumu/tavsan_yuz.png`
kopyalarının kaynağı. Baytları değişirse ikon yeniden üretilmeli ve iki
kopya yenilenmeli. Kaynak PNG'ler (`assets/maskot/`) pakete girmiyor.

### Başlıktaki tavşan günü gösteriyor

Ana sayfa selamlamasının yanındaki baş bir süre her durumda aynı çizimdi
(`kafa`); durum yalnızca ekran okuyucu etiketini değiştiriyordu. Kullanıcı
tavşanın günü göstermesini istedi — örneği "o gün hiç soru girilmediyse
uyusun". Karar `lib/ana-maskot.ts`te, saf ve testli; saat ana sayfadan
geliyor.

| Sıra | Koşul | Poz |
| --- | --- | --- |
| 1 | Pomodoro çalışma turu işliyor | `kafa-laptoplu` |
| 2 | Pomodoro molası işliyor | `kafa-kahveli` |
| 3 | Devamsızlık hakkı aşıldı | `kafa-uzgun` |
| 4 | Sınav günü | `kafa-bagdas` |
| 5 | Günlük hedef tuttu | `kafa-dans` / `kafa-alkislayan` / `kafa-kahkaha` (günden güne) |
| 6 | Bugün başlandı, hedefte değil | `kafa-yazan` / `kafa-kitapli` (günden güne) |
| 7 | Kayıt yok, gece (22:00–04:59) | `kafa-uyuyan` |
| 8 | Kayıt yok, sabah (05:00–10:59) | `kafa-gerinen` |
| 9 | Kayıt yok, seri kırılmak üzere | `kafa-elleri-belde` |
| 10 | Kayıt yok | `kafa-uyuyan` |

**Sabah uyumuyor, geriniyor.** Sabah sekizde uyuyan bir tavşan "bugün bir şey
yapmadın" gibi okunuyor; oysa yapılacak bir şey için daha vakit olmadı.
Gerinen tavşan güne birlikte başlıyor. On birden sonra kayıtsız gün
kullanıcının istediği gibi uyuyan tavşan.

Seri kuralı `gunun-hali.ts`teki "seri kırılıyor"un aynısı ve seri hesabı
oradan (`hedefSerisi`); günlük hedef sıfırken "tuttu" yok, aynı kural.
Duraklatılmış Pomodoro işleyen sayılmıyor: tur durmuş, laptopta çalışan
tavşan yalan olurdu.

**Durum kafaları kırpım, alan büyütülmedi.** Başlıktaki yer 58 piksel ve tam
boy poz orada lekeye dönüyor. Alanı büyütmek selamlama cümlesini ve geri
sayımı aşağı iterdi; onun yerine pozun **üst kısmı** kırpılıyor
(`maskot-uret.mjs` → `KAFALAR`): baş, kollar ve tutulan nesnenin görünen
kısmı — durumu anlatan yer orası. Kırpım oranları pozun saydamlıktan
bulunan kutusuna oran (`alt: 0.62` = kutunun üst %62'si); nesnesi aşağıda
duran pozlarda (laptop, defter, kitap) daha uzun, kıvrılıp uyuyan ve bağdaş
kuran tavşanda tam. Oranı değiştirirsen çıktıyı 58 pikselde aç.

Poz değişince öğe yeniden kuruluyor (`key`) ve kısa bir solmayla geliyor
(`ana-maskot-gecis`, `prefers-reduced-motion` altında yok). Ekran okuyucu
etiketi duruma özel (`Rabi.etiket`: "uyuyor, bugün henüz kayıt yok",
"Pomodoro turunda çalışıyor"); `durum` yine ayrı ve ruh hâlini taşıyor.

Poz listesi `lib/maskot.ts`te (`MASKOT_POZLARI`, dosya adı kuralı
`tavsan-<poz>.png`), bileşen değil — `lib/` altındaki karar fonksiyonu bir
bileşen dosyasına bağımlı olmasın diye. `maskot.test.ts` her pozun dosyası
olduğunu denetliyor: listeye eklenip betikte üretilmeyen poz test düşürür.

### Açılış bir ders makarası

Ekran 2,26 saniye sürüyor (`ACILIS_SURESI`) ve tasarımı "Ders makarası"
(`tasarim/acilis-arsiv.html` → 3. tur, Yazı C · 2): dört makara harf yerine
derslerin simgelerini çeviriyor (√x, 1453, DNA, H₂O, MÖ, Ω, Fe…), her simge
kendi dersinin `--konu-<ders>-koyu` renginde, ve soldan sağa R·A·B·I'ya
kilitleniyor. Kelime bir an duruyor, harfler bir tık daha dönüp çıkıyor ve
zemin dört şerit hâlinde yukarı kalkarak ana sayfayı açıyor. Zaman çizgisi
`globals.css`teki açılış bloğunun başında yazılı; süreyi değiştirirsen
oradaki gecikmeleri birlikte değiştir.

Arşiv dosyası üç tasarım turunun bütün taslaklarını taşıyor (13 sayfa,
görseller gömülü, sunucusuz açılıyor). Kullanıcının o turlarda koyduğu
şartlar yeni bir açılış tasarlarken de geçerli: tavşan köşeye (özellikle sol
üste) kayıp uçmuyor; yuvadan zıplayan tavşan ve yerden fırlayan harf yok;
ışın saçan "güneş" zemin yok; defter dokusu ve yazının altına kıvrık çizgi
yok. Ekran kısa kalıyor — 2d 4,65 saniyeydi ve günde birkaç kez açılan bir
uygulamada beklemeye dönüşüyordu.

**Pencere genişliği harften ölçülüyor.** Her makaranın genişliğini içindeki
görünmez son harf (`acilis-olcu`) veriyor. Taslağın ilk hâlinde pencereler
eşit genişlikteydi ve dar I geniş bir kutunun ortasında kalınca kelime
"RAB I" diye okunuyordu. Simgeler harften geniş olabildiği için kırpma
pencerede değil iki yana taşan kuyuda (`acilis-kuyu`).

**Kelime şeritlerden önce sönüyor.** Kuyuların üst ve alt kenarındaki
zemin renkli gölgeler, şeritler kalkarken ana sayfanın üstünde iz
bırakırdı.

**Tavşan uçmuyor.** 2a'da tavşan ana sayfadaki maskotun tam üstüne uçarak
bitiyordu; 2d ile kalktı ve uçuşla birlikte varış noktasının ölçümü
(`useVaris`), maskot yuvası (`MASKOT_YUVASI`, `yuvaMi`) ve açılış boyunca
maskotu gizleyen `gizli`/`maskotGizli` zinciri de silindi. Ders makarasında
tavşan yalnızca son makaranın bir simgesi. Uçuşu geri getirmek istersen
tarihçe `git log -- components/acilis.tsx`; oradaki ana ders hâlâ geçerli:
varış noktası **ölçülür**, yazılmaz.

Katmanı kaldıran şey son şeridin kendi `animationend`i
(`acilis-serit-kalk`, adla süzülüyor); zamanlayıcı yalnızca emniyet kemeri.
Katman sonuna kadar dokunuşları yutuyor: şeritler kalkarken altındaki
düğmeler görünür ama basılabilir olmamalı.

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
isim dağılmadan katman silinirdi.

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

Devam düğmesi eksik cevapta **pasif**. Beş adımın kuralı var: ad geçerli
olacak, sınıf kartlarından birine dokunulacak, alan kartlarından birine
dokunulacak, bölüm adımında üniversite+bölüm seçili olacak, notlar adımında
en az bir sayı yazılacak. Ötekiler (hedef, hatırlatma) varsayılanla geliyor —
orada varsayılan da bir cevap, çünkü çubuk ve saat her değerde anlamlı.

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

Sınıf adımı da bir süre **12'yi seçili** getiriyordu (`useState(12)`). Kurulumu
hızlı geçen 10. sınıf öğrencisi kendini 12'de kaydediyor; geri sayım, harita
ve OBP adımı o yanlış yıldan açılıyordu. Artık hiçbiri seçili gelmiyor ve
Devam seçim yapılana kadar pasif. `null` yalnızca kurulumun yerel state'inde
yaşıyor — kayda giden `Ayarlar.buYilSinif` yine `number`, çünkü adım seçimsiz
geçilemiyor; `bitir` de `null` görürse kayıt yazmadan dönüyor. Sınıf seçilmeden
notlar adımı da listede yok: hangi yılların sorulacağı seçimle belli oluyor.

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
kaldırıyor. Varış noktası ölçülüyor,
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
çeviriyor: TYT 165, AYT 180, YDT 120 dakika (`lib/sinav-provasi.ts`), ayrıca
MEB'in Seviye Tespit Sınavı (**STS**) 40 dakika / 20 soru — ÖSYM sınavı değil,
ders başına tek oturum; kullanıcı istedi ve süresi Pomodoro turundan kısa olsa
da mola döngüsünün dışında kesintisiz bir sınav oturumu. Amaç
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
  Seçilebilen derslerden biri değil (ders listesi on dersle sınırlı, bkz.
  **Ders listesi on ders**); ad, liste kısalmadan önceki seanslarla aynı
  dilime düşsün diye eskisi gibi kaldı.
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
**bitirmiyor**, **duraklatmıyor da**: sayaç işliyorsa Pomodoro ekranından
çıkılıyor ve tur sürüyor (aşağıda **Pomodoro ekrandan çıkınca sürüyor**).
Duraklatılmış turda geri yalnızca sahneyi kapatıyor; hazırlık ekranı kalan
süreyi ve "Devam et"i gösteriyor.

### Pomodoro ekrandan çıkınca sürüyor

Tur bir süre ekrandan çıkınca bitiyordu: `PomodoroEkrani` ekranla birlikte
sökülüyor, sayaç, bildirim ve odak kilidi onunla gidiyordu; sahnenin geri oku
da turu duraklatıyordu. Kullanıcı Android'deki gibi turun sürmesini ve
sayacın uygulamanın sağ altında bir saat olarak görünmesini istedi.

- **Bileşen kalıcı.** `AppShell` onu ekranın içinde değil kökte kuruyor ve
  tur canlıyken (`PomodoroDurumu.canli`: başlamış ya da bir aşaması bitmiş
  tur) ekran değişince sökmüyor. Çizildiği yer sabit, ayrık bir `div`
  (portalın kabı) ve o div ekran açıkken sayfadaki yuvaya taşınıyor. Kap
  **hiç değişmemeli**: React kabı değişen portalı söküp yeniden kurar.
  Deneme formu gibi bütün sayfa ağacını değiştiren bir ekran yuvayı
  söktüğünde kap yalnızca DOM'dan düşüyor, bileşen yaşıyor.
- **Gizliyken sahne yok** (`gorunur`): açık bir sahne geri katmanı kurar,
  başka ekranda geri tuşunu ve sekme kaydırmayı yutardı. Tur sürerken
  ekrana dönülünce sahne kendiliğinden açılıyor.
- **Saat** (`components/pomodoro-saati.tsx`): alt menünün hemen üstünde
  sağda, halkalı, kalan süre ve ODAK/MOLA ya da duraklat işareti. Kalan
  süreyi bitiş zamanından **kendisi** sayıyor; Pomodoro her tikte durum
  gönderseydi `AppShell` saniyede iki kez çizilirdi. Dokununca Pomodoro.
- Sahnenin geri oku `onArkaPlan` ile doğrudan `setEkran(null)` çağırıyor,
  `geriGit` değil: o önce üstteki katmanı kapatıyor ve o katman sahnenin
  kendisi — kendini yeniden çağırırdı.

Sahne `calisiyor`dan ayrı bir state (`sahne`): duraklatmak sahneyi kapatmıyor
ve aşama bitince de açık kalıyor — mola sahnedeki Başlat ile başlıyor.
Kapatan üç şey var: geri oku, "Turu bitir" ve provadan çıkış (bitmesi ya da
atlanması; "prova bitti" notu hazırlık ekranında).

Sahnenin altında bir süre "Ekran kapalıyken de sayıyor · alt menü kapandı"
yazıyordu; kaldırıldı — kullanıcı istedi, sayaç kendini açıklamak zorunda
değil.

Hazırlık ekranında süre, prova ve kip **tur içinde** (`turIcinde`, yani
duraklatılmış tur dahil) kilitli: başlamış bir turun uzunluğu değişmemeli.
Süreler bir çekmecede (`Cekmece`, alttan açılır). Dersler ise **yana kayan
tek bir şeritte** ve sıranın başında öğrencinin **en çok çalıştığı üç ders**
var (`calismaSirasi`, `lib/dersler.ts`: toplam dakikaya göre; hiç
çalışılmamış ders öne alınmıyor). Bir süre dört kutuluk bir ızgaraydı — listenin
ilk üç dersi ve bir "Diğer" düğmesi, gerisi alttan açılan bir çekmecede;
kullanıcı "Diğer"i kaldırttı: ders seçmek için yeni bir ekran açılmamalı. Bütün
çipler alt alta dizilse sayacın altında birkaç satır kaplayıp Başlat'ı aşağı
iterdi; şerit tek satır. Sıra ekran açılınca bir kez kuruluyor — seans bitince
yeniden sıralansaydı seçili ders parmağın altından kayardı. "Çalışırken ekran açık kalsın"
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
(`varsayilanSablonId` ile aynı gerekçe).

### Pomodoro'da müzik yok

Hazırlık ekranında bir **Ses** satırı vardı: on iki lo-fi parça, her birinin
önizleme düğmesi ve ses seviyesi. Kullanıcı kaldırttı; tur sessiz.
`Ayarlar.ses` ve `sesSeviyesi` kayıtta ve yedekte duruyor ama artık çalmıyor
(`oyunMuzigi` ile aynı gerekçe). Aşama sonundaki **zil** duruyor — o müzik
değil, haber. Çalar (`lib/ses.ts`) ve parça listesi (`lib/lofi.ts`) dosyada
duruyor; geri getirilirse önizlemenin dersleri tarihçede
(`git log -- components/ekranlar/pomodoro.tsx`): dinlemek seçmek değil, tek
çalar ödünç alınıyor, önizleme kesilmiyor kısılıyor.

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
itiyorlardı. Satır sayacın **altındaki** ayar kartında, **Süreler'in hemen
altında** (ekran anahtarı kartın en altında; kullanıcının sırası) ama hâlâ
hazırlık ekranında, sahnede değil, çünkü gerekçe
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
  kopyası; iOS kalkan ekranında da bir kopyası var
  (`ios/App/KalkanGorunumu/tavsan_yuz.png`). Görseli değiştirirsen **üçünü
  birden** değiştir; yerli taraf
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
seçiliyor ve Kaydet ancak bir ders seçilince açılıyor.

**Ders listesi on ders** ve uygulamada tek (`CALISMA_DERSLERI`,
`lib/dersler.ts`): Pomodoro, Soru Takibi ve yanlış soru aynı listeyi
gösteriyor — Türkçe, Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya,
Yabancı Dil, Felsefe, Din Kültürü. Kullanıcının kararı, "fazlası olmasın".
Yanlış sorunun bir süre ayrı, "Diğer"li bir listesi vardı ve Pomodoro'nunki
seans türlerini ("Tekrar", "Soru Çözümü") de taşıyordu; aynı ders iki ekranda
iki adla duruyordu. Geometri Matematik'in, Edebiyat Türkçe'nin içinde. Eski
kayıtlardaki adlar yeniden adlandırılmıyor — süzgeç, renk ve istatistik
onları da tanıyor. Yeni bir ders eklemeden önce kullanıcıya sor.

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

Kapaktaki ay adı **Manrope** (`font-marka`): tasarım o başlığı 66 pikselde
Manrope ile çizdi. Açılış bir süre aynı aileyi paylaşıyordu, sonra Outfit'e
ve Rubik'e geçti; Manrope artık yalnızca burada. Başka bir yerde kullanmadan önce
yukarıdaki yazı tipi istisnasına bak.

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

**iOS'ta menü camdan** ve bu kuralın tek istisnası. Kullanıcı Instagram'ın
iOS 26 çubuğu gibi bir "liquid glass" istedi: kenarlardan içeri çekilmiş,
altta yüzen bir kapsül; arkası bulanık ve doygun, seçili sekmenin arkasında
sekmeden sekmeye kayan bir cam mercek (`alt-menu`, `alt-menu-mercek`,
`globals.css` → "Camdan alt menü"). Takılma Android WebView'ın bedeliydi;
WKWebView arkayı GPU'da bulanıklaştırıyor ve camdan çubuk iOS'un kendi dili.
Android bu yüzden donuk kaldı — Android'e taşımadan önce orada ekran
geçişini telefonda dene.

**Kapsül sürükleniyor ve arkasının rengini alıyor** (App Store'un çubuğu
gibi). Parmak kapsülde kayınca mercek parmağı izliyor, büyüyüp "kalkıyor",
bırakılan sekme açılıyor; parmak altı pikseli geçmeden işaretçi yakalanmıyor,
yoksa kısa dokunuşun `click`i hiç gelmezdi. Renk: kapsülün arkasındaki ilk
dolu zemin örnekleniyor (`elementsFromPoint`, kaydırmada kare başına bir kez,
ekran değişimi için seyrek bir zamanlayıcıyla) ve cam o tona bürünüyor; koyu
bir zeminin üstünde yazılar açığa dönüyor (`data-koyu`). Hesaplar
`lib/cam-menu.ts`te, saf ve testli. Seçili sekmeyi gösteren titreşim **yok**:
kullanıcı titreşimi istemiyor (bkz. "Deste bir özetle kapanıyor").

**Merceğin konumu yerleşim pikselinde.** Tablette `<body>` `zoom`lu
(`--olcek`); `getBoundingClientRect` ve `clientX` büyütülmüş pikseli veriyor,
`translateX` ise büyütülmüş kutunun içinde yeniden büyüyor. Bölünmeden
yazılınca iPad'de mercek parmaktan ileri gidiyor ve en sağa çekilince
kapsülden taşıyordu. `seritOlcusu` oranı ölçüyor (`offsetWidth` büyütülmemiş
genişlik); `--olcek` okunmuyor.

**iOS'ta kaydırma çubuğu yok.** Sayfanınki yerli tarafta
(`showsVerticalScrollIndicator`, `AnaDenetleyici.swift`), iç kutularınki
`globals.css`te kapalı. Android'e dokunulmadı.

Platform `<html data-platform>`e yerleşim betiğinde (`layout.tsx`) yazılıyor,
React beklenmiyor: menü ilk karede cam çizilmeli, yoksa bir kare donuk görünüp
cama döner. `AppShell` aynı işareti yüklendikten sonra yeniden koyuyor; köprü
geç kalırsa yedek o. Cam kuralları katman dışında yazılı, çünkü menünün donuk
hâlini veren Tailwind sınıflarını ancak katmansız bir kural ezebiliyor.
- **Tam ekran katmanlar `clip-path` ile yükseliyor**, `transform` ile değil —
  yukarıdaki ilk sebep. `sahne-iner` ile aynı yöntem, ters yönde: bu katmanlar
  alttan geliyor.

Ekran geçişini oynatan şey `AppShell`deki `key`: sınıf tek başına verilseydi
React aynı düğümü koruduğu için animasyon yalnızca ilk açılışta çalışırdı.

Yeni bir pencere ya da katman eklersen sınıflardan birini kullan; yenisini
yazmadan önce listedekilerden hangisinin karşılığı olduğuna bak. Altısı da
`prefers-reduced-motion` altında susuyor: hangi ekranda olunduğu başlıkta,
pencerenin neye ait olduğu metninde yazılı — hareket yalnızca bağlıyor.

**Alttan açılan sayfalar aşağı çekilerek kapanıyor** (`useAsagiKaydirKapat`,
`lib/asagi-kaydir.ts`). Hepsinin tepesinde bir tutamak vardı ama sayfa yalnızca
zemine ya da Kapat'a dokununca kapanıyordu; kullanıcı tutamağı çekti, bir şey
olmadı. Yeni bir alt sayfa eklersen kancayı kutusuna `ref` olarak ver.
Sürükleme yalnızca içerik en üstteyken başlıyor ve `alt-pencere-girisi`nin
`both` dolgusu satır içi transformu ezdiği için kanca sürüklerken animasyonu
kaldırıyor. Sonucu bildiren, kapatılması bir karar olan sayfalar (hızlı
kontrolün sonucu) kancayı almıyor.

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

## Çarpı önce soruyor

Turun, destenin ya da yoklamanın ortasında çarpıya basmak doğrudan çıkmıyor,
`Onay` penceresi açılıyor: oyun turu (`OyunKabugu`, tur sürerken), konu
destesi (ilk ekrandan sonra), yoklama (en az bir cevaptan sonra) ve
Pomodoro'nun "Turu bitir"i (başlamış turda). Çarpı yanlışlıkla
dokunuluyordu ve arkasındaki iş geri gelmiyordu. Kaybedilecek bir şey
yokken (başlamamış tur, ilk kart) sormuyor. Geri tuşu ve kenardan kaydırma
sormuyor — orada niyet belli, Pomodoro'nun geri oku da yalnızca duraklatıyor.

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

**Mod tur başlamadan seçiliyor** (`ModSecimi`, tur ayarları ekranında)
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
| Sıfır Tolerans | soruya ait (`SORU_SURESI`) | tur biter | var |
| Rahat | yok | hiçbir şey | **yok** |

Dördü de seçilebiliyor. Rekora yazılmama kuralının (`kayitliMi`) kapısı
`oyunlar.tsx` içindeki `turBitti` ve seçimi okuyor — Rahat turda sayı hiçbir
yere yazılmıyor. Seçim ekranı bunu seçildiği anda sarı bir şeritle söylüyor:
turun sonunda öğrenilen bir kural, o turu boşa harcatır.

**Oyun Bankası turu** (genel test) modu dinlemiyor ve hep **Rahat**
(`etkinMod`): oradaki sorular zaten bir kez yanlış bilinmiş olanlar ve turun
amacı hepsini bir kez daha görmek — saatli bir mod o işi yarıda keser. Bir
süre soru başına süreyle işliyordu; kullanıcı Rahat istedi. Test 3 · 2 · 1
sayımıyla açılıyor ama yalnızca **ilk** oyunda (`BankaTuru.ilk`): oyunlar arka
arkaya geliyor ve her birinin başında bir sayım testi parçalara bölerdi. Ayarlar adımı o turda hiç çıkmıyor
(`secilebilir`): sunulup dinlenmeyen bir seçim, yalan söyleyen bir arayüzdür.

**Seçim tam ekran açılıyor** (`TurAyariEkrani`): dört mod kısa satırlar,
başlangıç zorluğu üç düğme olarak gösteriliyor. Geri ve Başlat sabit;
aralarındaki seçim alanı kısa telefonlarda kayıyor. Oyun adı başlıkta,
rekor varsa altında sade bir satırda duruyor.

**Ayarlardan sonra tanıtım yok.** "Başlat" doğrudan 3 · 2 · 1 sayımını
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

> **Kaldırıldı, silinmedi.** Oyun `OyunTanimi.kapali` ile listelerden
> gizlendi (`dersinOyunlari`, `bolumunOyunlari`, `bolumsuzOyunlar` süzüyor);
> tanımı, ekranı ve soru üreteci yerinde duruyor — soruları ileride başka bir
> yerde kullanılabilir. Bankada bu oyundan kalmış kayıtlar okunmaya devam
> ediyor. Geri açmak için `tanim.ts`teki `kapali: true` satırını sil.

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

Denizin mavisi (`trh`) ve karanın yeşili (`cog`) genel pastel ailelerden
geliyor, Coğrafya'nın gök mavisinden değil. Bu, "renk derse aittir"
kuralının bilinçli istisnası: buradaki renk bir ders kimliği değil harita
göstergesi, dersin rengine boyanmış bir kara denizden ayırt edilemezdi. Aynı
sebeple dünya haritasının okyanusu ve Harita Avı'nın illeri de bu ailelerden.

## Kimyanın oyunları

Kimya dersi iki oyunla açıldı: **Periyodik Tablo Avı** (element, yer, aile) ve
**Formül Eşleştirme** (formül–ad); üçüncüsü **Tepkime Türü** (aşağıda) ve
dersin ilk 10. sınıf oyunu. Rengi konu haritasındaki Kimya lavantası
(`--konu-kimya`).

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

### Tepkime Türü: bir denklem birden çok türe girer

10. sınıf Maarif programının "Kimyasal Tepkime Türleri" konusu
(KİM.10.1.3): denklem gösteriliyor, türü dört şıktan seçiliyor. Yedi tür
var — yanma, sentez, analiz, asit-baz, çökelme, yer değiştirme, redoks — ve
havuz (`tepkime-havuzu.ts`) her türden en az on, toplamda en az yüz denklem
taşıyor (şu an 139).

Oyunun asıl sorunu cevabın tekliği: metan yanması aynı zamanda redoks, Zn +
HCl hem yer değiştirme hem redoks. Her kaydın bir asıl türü (`tur`) ve
girdiği öteki türlerin listesi (`ayrica`) var; `ayrica`daki türler
**çeldirici olamıyor**. Kuşkulu durumda tür `ayrica`ya yazılıyor — bu yalnızca
bir çeldiriciyi eliyor, yanlış bir şey öğretmiyor. Tek bilinçli istisna azot:
`N2 + O2 → 2NO` tepkimesinin şıklarında yanma duruyor, çünkü azot yanmaz ve
sınavın bilinen tuzağı bu. Cevaptan sonra `ayrica` da söyleniyor ("Ayrıca
redoks."): şıklardan elenen tür, öğrenciye hiç görünmeyen bir tür oluyordu.

`ayrica` elle yazılıyor ama `tepkime.test.ts` denklemin **yapısından**
çıkarılabilen kısmını denetliyor: serbest element giren ya da çıkan her
tepkime redoks, tek ürünlü her tepkime sentez kalıbında, oksijenle giren her
tepkime (azot dışında) yanma, çözeltiden katı çıkaran her tepkime çökelme.
Atom ve yük dengesi ile katsayıların sadeliği de testte; denklem eklerken
testi çalıştır, dengesiz bir denklem sessizce öğretilmiş olur.

Hâl (k, s, g, suda) **her** denklemde yazılı. Yalnızca çökelmede yazılsaydı
"(k)" türün kalıbı değil cevabın işareti olurdu.

Denklem düz yazıyla duruyor (`2Fe^3+(suda)`: baştaki sayı katsayı, formüldeki
sayılar alt indis, `^` yük) ve `components/denklem-yazisi.tsx` çiziyor.
Terimler satır sonunda bölünmüyor, satır terimlerin arasından kırılıyor:
formülün ortasından kırılan satır, alt indisi bir sonraki satıra atıyordu.

Yanlıştan sonraki bekleme doğrudakinden uzun (`CEVAP_BEKLEMESI`): geri bildirim
bir cümle ve bir saniyede okunmuyor. Sayaç o sırada durduğu için süre
yemiyor. Banka kaydı yalnızca denklemi saklıyor, tür havuzdan okunuyor —
periyodik tablodaki sembol kaydının gerekçesi.

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

## Ana sayfada günün hâli tek cümle

Selamlamanın ("Merhaba Emre 👋") hemen altında tek bir cümle var: günlük
çalışma durumu ve bir öneri, noktalı virgülle bağlanan iki yarım ("Yanlış
bankanda 4 soru seni bekliyor.", "Sınava 12 gün kaldı; hedefine 30 soru
var."). Cümleyi `lib/gunun-hali.ts` seçiyor — saf, `gunun-hali.test.ts` her
kuralı ve cümlenin **tek** cümle olduğunu denetliyor.

**Kart kaldırıldı, geri gelmiyor.** Bu cümle bir süre hedef kartının altında
kendi kartıydı (`GununHali`, `gunun-hali-karti.tsx`): 72 piksellik bir
tavşan, zemin gölgesi, dikey ayraç, "BUGÜN" etiketi, kalın bir başlık, altında
ikinci bir cümle ve bir ok. Kullanıcı kartı kökten kaldırttı ve "Merhaba"nın
altında tek bir cümle istedi. Kart, hedef kartının sayısını ikinci bir
yüzeyde yorumluyordu; selamlamanın altındaki satır ise Rabi'nin söylediği söz
gibi okunuyor — maskot zaten orada. Satır dokunulmuyor: öneri gidilecek yeri
adıyla söylüyor ("yanlış bankan", "deneme").

Kurallar sıralı, ilk tutan kazanıyor:

| Sıra | Kural | Koşul |
| --- | --- | --- |
| 1 | Sınava yakın | kalan gün ≤ 7 her gün; 8–30 gün aşırı |
| 2 | Seri kırılıyor | dün hedef tuttu, bugün 0 |
| 3 | Seri sürüyor | bugün ve dün hedef tuttu |
| 4 | Banka bekliyor | çözülmemiş yanlış var, bugün çalışılmış |
| 5 | Tek derse yığılma | ≥ 20 soru ve %80'i tek dersten |
| 6 | İhmal edilen ders | son 30 günde çalışılmış, 7+ gündür yok |
| 7 | Deneme zamanı | son deneme 10+ gün önce (ya da hiç yok, 7+ günlük geçmiş var) |
| 8 | Temel | hiç kayıt yok / başladın / hedef tuttu |

4–7 aynı anda tutuyorsa günden güne dönüşümlü. Sıra puanla değil listeyle:
"neden bunu söyledi" sorusuna sıralı liste cevap verebiliyor, puan veremiyor.
Sınav en önde ama son hafta dışında **gün aşırı**: otuz gün her sabah aynı
"sınava N gün" cümlesi satırı takvime çevirir ve öteki öneriler tam en gerekli
dönemde hiç görünmezdi. Seri ondan sonra çünkü kırılan alışkanlık en pahalı
kayıp.

Her kuralın birden çok cümlesi var ve seçim **günün tarihinden** türeyen bir
sayıyla yapılıyor: cümle gün içinde sabit, günden güne değişiyor. Rastgele
olsaydı her yeniden çizimde başka cümle söylerdi.

Ders adına **ek getirilmiyor** ("Kimya dersi 9 gündür bekliyor", "Kimya'ya …"
değil): ünlü uyumu ders adına göre değişiyor ve yanlış ek, yanlış bilgiden
daha çok göze batıyor.

Günlük hedef sıfırken cümle yok: ölçülecek bir eşik yokken "ulaştın" da
"ulaşmadın" da anlamsız. Sınav gününde soru sayısından bağımsız olarak
dinlenme cümlesi geliyor. Kayıt bulunmaması "soru çözmedin" diye sunulmaz
("henüz soru kaydın yok"); serinin sürmesi için günlük hedefin tamamlanması
gerekir.

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

Artık kutucuk dersin kendisi: adı kısa, rengi konu haritasındaki dersin rengi
(`--konu-<ders>`, "renk derse aittir" kuralının doğrudan karşılığı) ve dokunuşun karşılığı tam olarak o
dersin ızgarası — `onOyunlaraGit(ders)` sekmeyi açarken `acilacakDers`i de
geçiyor. İstek `oyunlar.tsx` içinde bir kez tüketiliyor; prop doğrudan
okunsaydı geri tuşu dersi kapatır, bir sonraki çizim aynı dersi yeniden açardı.

Ders kutucuklarının geçmişi ayrı tutulmuyor, oynanan oyunlardan türetiliyor
(`oyunlarinDersleri`): ikinci bir "son açılan ders" listesi aynı bilgiyi ikinci
kez saklamak olurdu ve iki liste zamanla birbirinden ayrılırdı.

## Yapılacaklar: günün listesi, saat isteğe bağlı

Araçlardaki görev listesi (`lib/yapilacaklar.ts`, ekran
`components/ekranlar/yapilacaklar.tsx`, tasarım
`tasarim/yapilacaklar-v3.dc.html` — dilimli hâli). Üstte haftanın yedi günü,
altında günün **tek listesi**, görev eklemek alttan açılan bir sayfada.

Burası bir süre **tahtaydı**: not kâğıtları sürükleniyor, konum da kullanıcının
verdiği bilgi sayılıyordu ("bunlar okul, şunlar ev"). 390 piksellik bir tahtada
on kâğıt, okunmak için yerleştirilmesi gereken on kâğıt demekti — kullanıcı işini
yazmak yerine tahtayı düzenliyordu. Gruplama da konumdan okunmuyordu: iki kâğıdın
yan yana durması ancak onu koyan kişiye bir şey söylüyor, ertesi gün ona da
söylemiyor. Konum alanları (`x`, `y`) kalktı, eski kayıtlar
`gorevleriNormalize` ile taşınıyor (kâğıtlar kalıyor, konumları atılıyor).

### Dilimler kalktı, saat isteğe bağlı

Sonra gruplama zamana bağlandı: **Sabah / Öğle / Akşam** bölümleri, ekleme
düğmesi her bölümde. Kullanıcı istemedi ("sabah öğle akşam olmasın, saatler
olsun kullanıcı isterse"): üç kaba kutu her işi bir bölüme sokmayı zorunlu
kılıyordu, saati bilen kullanıcıya da bir şey söyletmiyordu.

Şimdi her görevin **isteğe bağlı** saati var (`Gorev.saat`, 'SS:DD' ya da
`null`). Liste `gununSiraliGorevleri` ile: saatliler saate göre üstte,
saatsizler altta — saatsiz görev "gün içinde bir ara" demek ve saatlilerin
arasına yerleştirilemez. Aynı saatte ve saatsizler içinde yıldızlılar üstte;
yıldız saatin önüne **geçmiyor** (18:00'deki öncelikli iş 09:00'dan önce
yapılmıyor).

Ekleme sayfasında saat **kapalı** bir "Saat ekle" düğmesi; tek dokunuş
telefonun kendi seçicisini açıyor (`<input type="time">` + `showPicker`,
yoksa kutu odakta açık kalıyor). Açık duran boş bir saat kutusu her eklemede
doldurulması gereken bir alan gibi görünürdü. Çarpı saati siliyor.
Düzenlemede saat değişebiliyor; erteleme saati koruyor. Satırda saat,
kategori satırının başında renk noktasının yerinde ve ön plan renginde
duruyor — iş adının tek satırına sığmazdı.

**Göç:** kayıt sürümsüz bir dizi ve şemayı okurken `gorevleriNormalize`
çeviriyor (tahta göçüyle aynı yol, eski yedekler de buradan geçiyor). Eski
görevin `dilim`i atılıyor, görev **saatsiz** kalıyor. Dilim saate
çevrilmiyor: "sabah" 09:00 demek değildi ve kullanıcının vermediği bir saati
onun adına yazmak olurdu.

### Sınır gün başına otuz

`EN_COK_GOREV` artık **gün** başına ve otuz. Dilimli dönemde dilim başına
ondu (günde 3 × 10); daha düşük bir sayı, o dönemde dolu yazılmış bir günü
taşırken görev elerdi. Sınır iki yerde birden duruyor: `gorevEkle` eklemeyi
engelliyor (ve dolu günün `+` düğmesi pasif), `gorevleriNormalize` de
kayıttan okurken fazlasını eliyor — kurcalanmış bir kayıt yüzünden ekranda
"31/30" yazmasın diye.

### Metin tek satır, sınır ölçüyle konuyor

`EN_UZUN_GOREV` = 24 karakter ve bu sayı tasarımdan değil **satırın
kendisinden** geliyor: solda tik yuvarlağı, sağda yıldız ve "⋯" düğmeleri
varken metne kalan yer 375 piksellik telefonda ~200 piksel, Nunito 700/14,5'te
Türkçe küçük harfli metin de karakter başına ~7,4 piksel. Satır ayrıca
`truncate` ile kırpılıyor: büyük harfli metin karakter başına ~9,6 piksel
tutuyor ve karakter sınırı tek başına yetmiyor.

İkisi **birlikte** değişir: sınırı büyütmek isteyen önce satırdaki düğmelere yer
bulmalı. Yeni bir düğme eklemek de metni daraltır, yani sınırı düşürür.

Görev **düzenleniyor** (`gorevDuzenle`, aynı ekleme sayfası dolu açılıyor) ve
her satırda silme düğmesi var. Bir süre ikisi de yoktu — "yirmi dört karakteri
silip yeniden yazmak, kalem düğmesinden hızlı" diye — ama yeniden yazmak yıldızı,
bitti işaretini de götürüyordu; kullanıcı tik gibi görünür düğmeler istedi.
Düzenleme günü değiştirmiyor, taşımanın yolu erteleme.
**Satırda yalnızca iki düğme var: yıldız ve "⋯".** Dört düğme (yıldız,
ertele, düzenle, sil) bir süre kategorinin satırında, iş adının **üstünde**
yan yana duruyordu: 32 piksellik hedefler, simgeden anlaşılmayan eylemler (ok
"ertele" demiyordu), kaleme yapışık bir çöp kutusu; kullanıcı dizilimi kötü
buldu. Yıldız satırda kaldı çünkü bir eylem değil görevin **hâli** — bakınca
görülmeli. Düzenle, yarına ertele ve sil "⋯"nün açtığı alt sayfada adlarıyla
(`GorevEylemleri`); sil orada en altta ve kırmızı. Bitmiş görevde yalnızca
sil var. Ertele ve sil hâlâ kendi onay penceresinden geçiyor.

### Kayıt yedi günlük şeritle kayar, geçmiş salt okunur

Tahta **günlükti**, gün dönünce kâğıtlar siliniyordu; gerekçe "dün yazdığını
bugün de gören kullanıcı biriken ve hiç bitmeyen bir listeye bakıyor" idi.
Gerekçe duruyor ama yedi günlük şerit ileriye plan yazdırıyor, yani "bugün" tek
başına yetmiyor. Bugün şeridin dördüncü günü; üç geçmiş ve üç gelecek gün
görünüyor. `gorevleriTarihtenItibaren` bugünden üç günden eski kayıtları eliyor.
Gelecek günlere yazılanlar hafta sınırında da korunuyor.

Gün dönümü zamanlayıcıyla değil **türetmeyle** yakalanıyor (`AppShell`):
uygulama kapalıyken çalışmayan bir `setTimeout`'a güvenilmez. Elenen görevler bir
etkiyle kayıttan da siliniyor, yoksa yedeğe girerlerdi.

Geçmiş günler salt okunur: ekleme, işaretleme, yıldız ve erteleme düğmeleri
orada hiç çizilmiyor. Dün yapılmamış işi bugün işaretlemek geçmişi düzeltmek
olur — o iş yapılmadı, ve erteleme varken buna gerek de yok.

Ay takvimi **yok**. Soru Takibi'nde var çünkü orada eski günlere bakmanın bir
karşılığı var; burada eski kayıtlar üç gün sonra eleniyor, açılan takvim boş
günler gösterirdi.

### Erteleme

Erteleme görevi **ertesi güne, aynı saate** taşıyor ve hedef gün doluysa
`gorevErtele` `null` dönüyor: sessizce yutulan bir erteleme, kullanıcıya işin
ekrandan kaybolduğunu gösterirdi. Ekran bu yüzden bir toast taşıyor — ertelenen
görev bulunduğu günden çıkıyor ve nereye gittiğini söyleyen tek yer o cümle.
Erteleme önce **soruyor** (`Onay`, kırmızı değil — geri alınabilen bir iş):
tek dokunuşla ertelenen görev ekrandan kayboluyor, yanlışlıkla basan kullanıcı
onu yarının listesinde arıyordu.

"Diğer" seçilince kendi kategori adı **zorunlu** ve en çok
`EN_UZUN_OZEL_KATEGORI` (14) harf, sayacı alanın üstünde. Bir süre isteğe
bağlıydı; listede yalnızca "DİĞER" yazan bir görev ne olduğunu söylemiyordu.

Ekleme sayfasının başlığında gün etiketi yazıyor ("Bugün"): görev nereye
gideceği görünmeden kaydedilmiyor.

### Görevin süresi soruluyor

Ekleme sayfası "Ortalama kaç dakika sürer?" diye soruyor (`Gorev.sure`,
çipler `SURE_SECENEKLERI` ve elle yazma kutusu). Liste başlığı bitmemiş görevlerin toplamını
yazıyor (`kalanSure`), satırda süre kategorinin yanında duruyor — iş adının
satırı tek satırlık ve genişliği sayılı, oraya sığmazdı. Plan, işlerin ne kadar
süreceği bilinince plan oluyor; "akşama beş iş" ile "akşama dört saat" ayrı
şeyler.

Hazır süreler çip (15 · 30 · 45 · 60 · 120, 90 kullanıcı isteğiyle çıktı),
en sonda elle dakika yazılan bir kutu (`elleSure`, üç haneye kadar). Bir süre
yalnızca çip vardı ("37 dakika kimsenin vereceği bir cevap değil" diye) ve
iki saatin üstü yoktu; kullanıcı kutuyu istedi — hazır sürelere uymayan işi
yazmanın yolu olmayınca en yakın çip seçiliyor, tahmin yalan oluyordu. Çip ile
kutu tek cevap: birine dokunmak ötekini temizliyor.

**Süre isteğe bağlı.** Bir süre zorunluydu (Kaydet süresiz basılınca alan
kırmızıya dönüyordu); kullanıcı kaldırılmasını istedi — kısa bir iş için tahmin
uydurmak eklemeyi uzatıyordu. Varsayılan seçili gelmiyor (seçili bir "30 dk",
kullanıcının vermediği bir tahmini onun adına kaydederdi) ve seçili çipe
yeniden dokunmak seçimi kaldırıyor.

Süresiz görevin `sure`'u `null` ve toplamda sayılmıyor; eski görevler de öyle.
Uydurma bir süre, günün toplamını kullanıcının söylemediği bir sayıyla
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

İçerik `lib/konu/icerik/<sınıf>-<ders>.ts`. 9, 10 ve 11. sınıfta yedi
dersin tamamı var; 11. sınıfta ayrıca İngilizce var (sekiz tema, 17 konu).
İngilizce 9–10'da henüz yazılmadı ve ders seçiminde gösterilmiyor.
`icerik.test.ts` beklenen ders/sınıf çiftlerinin varlığını
ve `sinifDersleri`nin tamamını gösterdiğini denetliyor; eksik programlar
testten süzülmez. `sinifDersleri`, ileride kısmi bir sınıf eklenirse boş
programları haritada gizlemeye devam eder. Sekizinci bir ders eklemek
`KonuDersId` ile birlikte ders rengi tanımlamayı gerektirir.

**11. sınıfın soru basamakları da hazır.** Matematik, Fizik, Kimya ve
Biyoloji soruları ayrı `11-<ders>-sorular.ts` havuzlarından `sorulariBagla`
ile bağlanıyor; İngilizce de dört parçalı soru havuzundan aynı işleve bağlanıyor.
Edebiyat, Tarih ve Coğrafya soruları kendi içeriklerinde.
Soru testleri bütün sınıflarda denge ve sayı kurallarını denetliyor.
Destenin ortasındaki hızlı kontroller de bütün derslerde yazılı.

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

### Kart metni satırlara ve maddelere bölünüyor

Kart metni bir süre düz bir paragraftı ve dört-beş bilgi aynı satırda,
noktalarla ayrılarak akıyordu ("sin: 30° → 1/2, 45° → √2/2 … cos tersi
sırayla. tan: …"). Kullanıcı bunu iki kez "karmakarışık" diye geri
çevirdi; bütün desteler (9 ve 10, yedi ders, ~1.900 kart) yeniden yazıldı.

Biçim dili üç kuraldan ibaret (`lib/konu/kart-metni.ts`, çizen
`components/konu/kart-metni.tsx`) — Markdown değil, başka işaret yok:

- Her satır (`\n`) ayrı bir blok; madde olmayan satır bir paragraf.
- `- ` ile başlayan satır bir madde; art arda maddeler tek liste.
- `**…**` vurgu: maddenin başındaki ad ("**Ekvator:** 0° enlemi"), bir
  formül satırı ya da cümlenin anahtar kavramı.

Yazım alışkanlığı: önce bir satırlık tanım ya da formül, ardından
maddeler, en sonda gerekiyorsa tek satırlık bir sonuç. Sayılan şeyler
(türler, adımlar, örnekler) maddeye; karşılaştırmalar adlı maddeye
("**Katı:** … / **Gaz:** …"). Görselin zaten gösterdiği tabloyu metinde
yeniden yazma.

`icerik.test.ts` ("kart düzeni") bunu denetliyor: satır en çok 110
karakter, satırda en çok iki cümle, liste en az iki madde, bir listede
maddelerin ya hepsi adlı ya hiçbiri. Uzunluk sınırı (240) görünen metne
bakıyor; madde imi ve `**` sayılmıyor.

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
dinleniyor, okunan kartların adları listeleniyor) ve bir–iki **hızlı kontrol**
(okunmuş bir karttan iki şıklı soru) giriyor. Üç ekranın başlığı ortak
(`deste-basligi.tsx`), zemin dersin rengi, vurgu dersin mürekkebi
(`bicim.murekkep`) — mockup Fizik'in mavisiyle çizildi, o mavi burada derse
göre değişiyor.

- **Sıra sabit.** Kısa destede kontrol → mola, uzun destede kontrol → mola →
  kontrol gelir. İlk kontrol ve mola kenarlardan uzak durur. Son kontrolün
  sorusu son karta dayanıyorsa kontrol o kart okunduktan sonra gelir.
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

### Deste bir özetle kapanıyor

Üç ekran var: destenin kapanışı — **konunun özeti**
(`components/konu/konu-ozeti.tsx`) —, soruların kendisi ve yoklamanın
kapanışı (ikisi `soru-sahnesi.tsx` içinde, `Kapanis`).

Kapanış ekranı şart: son kartta "İlerle"ye basan kullanıcı bir süre doğrudan
yoklamanın ilk **iddiasının üstüne** düşüyordu — okumayı bitirdiğini sanan
kullanıcı kendini cevaplayacağı bir şeyin karşısında buluyordu. Aradaki
dokunuş gecikme değil, sonraki ekranın ne olduğunu söyleyen tek yer.

**Yoklama bileti kaldırıldı.** Bu ekran bir süre bir biletti
(`tasarim/yoklama-bileti.html`): kupayı kaldıran Rabi biletin arkasından
çıkıyor, "BİTTİ" damgası basılıyor, çentikli koçanda üç sayı sayarak
doluyor, damgayla altın toz süzülüyordu. Kullanıcı ekranı kötü buldu ve
**tasarımdan değil koddan** yeniden yazılmasını istedi; istediği şey de
açıktı: ders sonunda gerekli bilgiyi ver. Biletin bilgisi üç sayıdan
ibaretti ve süslerin arasında okunmuyordu. Bilet bileşeni, `bilet-*` CSS'i
ve animasyonları silindi; mockup `tasarim/` altında tarih olarak duruyor,
yeniden uygulanmamalı.

Özet yukarıdan aşağı üç soruya cevap veriyor:

1. **Ne bitti?** Konunun adı, ders ve tema.
2. **Ne kadar?** Okunan kart ve destede geçen süre (`DesteSonucu.saniye`,
   `konu-haritasi.tsx` sahneye `okumaSaniyesi` olarak geçiriyor). Destede
   süre gösterilmiyor — okumayı yarışa çevirmesin diye — ama okuma
   bittikten sonra söylemek bir şey yarıştırmıyor.
3. **Neyi aklında tutmalı?** Kartların başlıkları sırayla (konunun
   iskeleti) ve varsa Rabi'nin notu — her konuda tek kartta duran, konunun en
   çok tuzak barındıran yeri. Kart metinleri yazılmıyor: özet destenin ikinci
   kopyası olurdu.

- **"Sırada yoklama var" kartı yok** (kullanıcı kaldırttı): sıradakini
  "Yoklamaya başla" düğmesi söylüyor.
- **Renk dersin rengi** (`dersVurgusu`, `SoruSahnesi.ders`; kullanıcı istedi).
  Hareket hafif ve tek seferlik: ders renkli bant yükselir, içindeki çubuk
  dolar, sayı kutuları sırayla gelir, Rabi süzülür (`ozet-bandi*`,
  `ozet-sayi`, `kapanis-suzul`). Konfeti, damga, ses ekleme.
- **Özet destenin ucundan gelince var, turuncu kitaptan girince yok**
  (`SoruSahnesi.ozetli`). Haritadan doğrudan soruya giren kullanıcı bir şey
  okumadı; "konu bitti" diyen bir özet ona yalan söylerdi. Oradan sahne ilk
  soruyla açılıyor.
- **"Haritaya dön" düğme değil yazı.** Deste zaten okundu ve kaydı yazıldı;
  yoklamayı vermemek konuyu okunmamış yapmıyor. İki dolu düğme yan yana
  dursaydı hangisinin ileri götürdüğü okunmazdı. Üstte çarpı yok: destenin
  çarpısıyla aynı yerde duran bir düğme alışkanlıkla basılıyordu. Çıkış
  kapanış ekranındaki perdeyle (`kapanis-cikar`, `cikiyor` bayrağı
  `SoruSahnesi`den geliyor).
- **Titreşim ve ses yok.** Biletin damgasında önce bir ses, sonra bir
  titreşim vardı; kullanıcı ikisini de kaldırttı (`lib/titresim.ts` silindi).
  Geri getirmeden önce sor. Manifestteki VIBRATE izni duruyor: oyunlardaki
  dokunuş geri bildirimi (`@capacitor/haptics`) ona bağlı.

`SahneSonucu.bitti` bu yüzden var: yarıda bırakılan yoklama ilerlemeye sayı
**yazdırmıyor** (`konu-haritasi.tsx`), destenin kuralının aynısı. Bayraksız
hâlde özette "Haritaya dön" diyen kullanıcının kaydına, hiç verilmemiş bir
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

### Harita öğrencinin sınıfıyla açılıyor, 12 kapalı

Sekme her açıldığında sınıf seçici ayarlardaki sınıfa geçiyor
(`haritaSinifiBul`); bir süre en son bakılan sınıfta kalıyordu ve 10. sınıf
öğrencisi her açılışta 9. sınıfın haritasını görüyordu. Ekranın içinde başka
sınıfa geçmek o ziyaret boyunca geçerli. Mezunun tek bir sınıfı yok, onda son
seçim kalıyor.

Seçicide **12. sınıf** da var (`HARITA_SINIFLARI`) ama içeriği yok: seçilince
ders çipleri kalkıyor ve harita yerine kilitli bir "yapım aşamasında" kartı
duruyor. `KonuSinifi` 9–11 kalıyor; 12 yalnızca seçicinin tipi
(`HaritaSinifi`). Kartlar yazılınca `KONU_SINIFLARI`na eklenir ve kart kalkar.

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
simgeler (`lib/konu/harita-temasi.ts`). Matematik mavi ve kareköklü, Tarih
kahverengi ve tüylü, Coğrafya turkuaz ve pusulalı. Renkler
`globals.css`teki `--konu-<ders>-*` değişkenlerinde ve mini oyunlar da aynı
değişkenleri okuyor: bir süre oyunların kendi aileleri vardı (`--isl`,
`--trh`…) ve aynı ders iki ekranda iki renkteydi. Kart destesinin zemini de bu renkten
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

## Konu Takibi YKS'nin diliyle konuşuyor

Araçlar › Çalışma'daki **Konu Takibi** (`components/ekranlar/konu-takibi.tsx`,
mantık `lib/konu-takibi/`): öğrenci TYT ve AYT konularını aşama aşama
işaretliyor — Haritada çalıştım, Okulda öğrendim, Soru çözdüm ve ayrı bir
Bitirdim.

- **Liste haritadan ayrı.** Harita Maarif'in ders → sınıf → tema → konu
  yapısında; YKS sınıf değil sınav soruyor ve öğrencinin bankası, deneme
  karnesi sınavın başlıklarıyla konuşuyor ("Üslü Sayılar", "Fiilimsiler").
  Liste (`liste.ts`) yayınevlerinin ortak YKS konu listesinden derlendi;
  ÖSYM konu konu liste yayımlamıyor. **AYT'de TYT konuları tekrar
  yazılmıyor** — aynı konuyu iki kez işaretletmek takibi iki kat uzatırdı;
  ekran bunu bir notla söylüyor. Konu kimliği kayıt anahtarı: adı değiştir,
  kimliğe dokunma.
- **AYT alana göre süzülüyor** (`oturumDersleri`): Sayısal → Mat, Fiz, Kim,
  Biyo; EA → Mat, Edebiyat, Tarih, Coğrafya; Sözel → Edebiyat, Tarih,
  Coğrafya, Felsefe Grubu, Din; Dil → YDT. Alan `Ayarlar.puanTuru`dan;
  `null` ise AYT sekmesi alanı soruyor ve cevabı ayarlara yazıyor (bkz.
  **Alan seçilmemiş olabilir** — varsayılan alan uydurulmuyor). Tarih-1/2 ve
  Coğrafya-1/2'nin kapsamı konu konu ayrılmadığı için tek ders; adı alana
  göre "Tarih-1" ya da "Tarih-1 ve 2".
- **"Haritada çalıştım" elle işaretlenmiyor.** `harita-eslemesi.ts`teki açık
  tablo YKS konusunu harita konularına bağlıyor; aşama haritanın kendi
  kaydından (`konuTamam`) hesaplanıyor ve "Haritaya git" haritayı o konunun
  kartıyla açıyor (`acilacakKonu`, sınıf kendi sınıfından farklı olsa da).
  Eşleme **yalnızca kartlar konunun asıl içeriğini anlatıyorsa** var; tek
  kartta değinip geçmek yetmiyor. Karşılığı olmayan konuda aşama hiç
  gösterilmiyor — elle bir kutu, olmayan bir haritayı çalışılmış saymak
  olurdu. AYT'de TYT ile içeriği örtüşen konu da aynı harita konusuna
  bağlı (AYT Enerji ve Hareket ↔ TYT İş, Güç ve Enerji): kayıt tek, iki
  satırda da dolu. 12. sınıf kartları yazılınca tabloya eklenir;
  `takip.test.ts` iki uçtaki kimliklerin varlığını denetliyor.
- **İşaret satırın kendisinde.** Solda ilerleme dairesi (aşama sayısına göre
  dolan yay; dokununca Bitirdim aç/kapa), sağda sabit genişlikte üç yuva:
  harita (salt okunur, küçük ve boşken kesik kenarlı; karşılığı olmayan
  konuda yuva boş ama yer tutuyor), okul, soru (44 piksel dokunma alanı).
  Simgeler lucide çizgi ikon, emoji değil; dolu hâl ders renginde dolgu,
  boş hâl kenarlık. Ada dokunmak kompakt ayrıntıyı açıyor: harita durumu ve
  "Haritaya git", toplu eylem, işaret günleri. Eskiden bir konu dört-beş
  dokunuştu (aç → okul → soru → Bitirdim → onay), şimdi en çok üç.
- **Bitirdim engellenmiyor ve sormuyor.** Eksik aşama varsa pencere değil
  Geri al'lı kısa bir bildirim ("Bitti · eksik: okul, soru"). Konfeti
  yalnızca dersin son konusu bitince; art arda işaretlemede her konuda
  patlayan kutlama listeyi kapatıyordu.
- **"Bu ve önceki konuları okulda işlendi say"** (`oncekiOkulsuzlar`):
  ilk kullanımda okulda işlenmiş yirmi-kırk konuyu tek dokunuşla girmenin
  yolu. Yalnızca aynı bölümde, yalnızca okul aşaması, bildirimde Geri al.
- **Özet tek segmentli çubuk** (bitti › soru › okul › kalan, her konu en
  ileri aşamasında) ve tek satır sayı; yüzde yok. Büyük halka yalnızca
  Bitirdim'i sayıyordu ve okulda işaretleyen öğrenci haftalarca %0
  görüyordu.
- **Öneri müfredat sırasında ilerliyor** (`siradakiKonu`, `devamKonusu`):
  ders içi Sıradaki, müfredat sırasında bitmemiş **ve** aşamaları
  tamamlanmamış ilk konu (haritada karşılığı yoksa harita sayılmıyor).
  Girişteki dersler arası tek "Devam et" kartı, en son dokunulan dersin
  (bitirmek de dokunuş) Sıradaki'si. Bir süre "önce en son işaretlenen
  yarım konu" kuralıydı: aşamaları dolu ama Bitirdim basılmamış konu yarım
  sayılıp öneride takılı kalıyordu, başka bir yuvaya dokununca öneri oraya
  zıplıyordu (TestFlight geri bildirimi). Aşamaları tamam ama bitmemiş konu
  (`bitirmeyeHazir`) öneri olmuyor; dairesinde yay dolu ve ortada ders
  renginde soluk bir tik — bitirmek yine öğrencinin dokunuşu. Hiç işaret
  yokken ipucu ve lejant — ayrı bir ayar değil, kayıt boş mu diye türetiliyor.
- **Tek geri.** Ders ekranının kendi geri düğmesi yok; kabuğun "Geri"si
  önce açık katmanı (dersi) kapatıyor, Android geri tuşu ve iOS kenar
  kaydırmasıyla aynı sıra. Seçili sekme, açık ders ve liste kaydırması
  `sessionStorage`'da (oturumluk, kalıcı ayar değil).
- **Binom AYT'de** ama kimliği `tyt-mat-binom`: TYT'lerde soru çıkmıyor,
  AYT'lerde her yıl bir soru var. Taşınan konu kimliğini korur
  (`TASINAN_KONULAR`, `takip.test.ts`).
- **Kayıt** `rabi-yks-konu-takibi`, sürümlü (`{ surum: 1, konular }`), işaret
  yerine gün tutuyor; okurken `takibiCoz` süzüyor ve yedeğe giriyor
  (`Yedek.yksKonuTakibi`, eski yedekte yoksa mevcut kayda dokunulmuyor).
  `kayit.ts` konu içeriğini yüklemiyor, depo yalnızca onu okuyor.
- Renk derse ait: haritada karşılığı olan ders haritadaki rengini taşıyor ve
  ortak düğmelere `dersVurgusu` ile geçiyor; Felsefe ve Din, Yanlış Soru
  Bankası'ndaki gibi nötr.

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

## iOS aynı kabuk, eksik parçalarla

iOS sürümü ayrı bir uygulama değil: aynı statik derleme Capacitor'ın iOS
kabuğunda (`ios/`) çalışıyor. Mimariyi değiştirmek (React Native, Swift)
tartışıldı ve reddedildi — App Store WebView'i değil, bir web sitesini
paketlemekten ibaret uygulamayı reddediyor (4.2) ve Rabi'nin kodu da içeriği
de paketin içinde, çevrimdışı çalışıyor. Yeniden yazım aylar, `lib/` ise
olduğu gibi taşınıyor.

**Platform `isNativePlatform()` ile sorulmaz.** O iOS'ta da `true` dönüyor ve
yalnızca Android'de yazılmış eklentiler (odak kilidi, Play güncellemesi, çökme
raporu) iOS'ta "UNIMPLEMENTED" ile reddediliyor; çağrılar yutulduğu için
çökme yok ama arayüz, çalışmayan bir özelliği çiziyordu. Özellik varsa
`androidMu()` / `iosMu()` (`lib/platform.ts`) ile soruluyor. Yeni bir yerli
eklenti yazarsan iki platformdan hangisinde var olduğunu oradan söyle.

iOS'ta **olmayanlar** ve sebepleri:

- **Rahatsız Etme ve ses odağı.** Uygulamalar Odak modunu açamıyor, başka
  bir uygulamanın sesine dokunamıyor. Odak kilidi ise var, başka yoldan —
  aşağıda.
- **Kilit ekranındaki sayaç.** Ön plan servisi yok; karşılığı Live
  Activity (ActivityKit + widget eklentisi). Tur sonu bildirimi planlı yerel
  bildirimle geliyor ve sayaç mutlak zamandan okunduğu için uygulama
  arkadayken de doğru kalıyor.
- **Play güncellemesi.** Güncellemeyi App Store dağıtıyor.
- **Çökme raporu.** Crashlytics'in iOS köprüsü henüz yazılmadı; o gelene kadar
  soru iOS'ta hiç çıkmıyor.

### iOS'ta odak kilidi Screen Time'la

Android'in odak kilidi (katman + kullanım verisi) iOS'ta yapılamıyor: başka
uygulamanın üstüne çizilemiyor, önde hangi uygulamanın olduğu okunamıyor.
Karşılığı Apple'ın Screen Time API'si (FamilyControls + ManagedSettings +
DeviceActivity) ve bu API **Apple'ın ayrıca verdiği bir yetkiyle** çalışıyor:
"Family Controls (Distribution)", üç bundle ID için ayrı ayrı başvuruldu ve
onaylandı (uygulama, `OdakIzleyici`, `KalkanGorunumu`). Yeni bir eklenti
eklenirse onun kimliği için de başvuru gerekiyor; yetkisiz eklenti TestFlight
imzasında düşer.

Parçalar:

- `ios/App/App/EkranSuresiEklentisi.swift` — Capacitor eklentisi: izin,
  Apple'ın uygulama seçicisi, kalkanı koymak ve kaldırmak. Köprüsü
  `lib/ekran-suresi.ts`; Pomodoro'nun çağırdığı `lib/odak-kilidi.ts`
  fonksiyonları iOS'ta buraya yönleniyor, sayaç kodu iki platform için ayrı
  yazılmadı.
- `ios/App/OdakIzleyici` — DeviceActivity eklentisi. iOS arka plandaki Rabi'yi
  uyutuyor; tur sonunda kalkanı sistemin zamanlayıcısıyla uyanan bu eklenti
  kaldırıyor. Olmasaydı Instagram, Rabi açılana kadar kilitli kalırdı.
  DeviceActivity en az 15 dakikalık aralık istiyor: kısa turda aralığın başı
  geçmişe çekiliyor, sonu yine turun sonu.
- `ios/App/KalkanGorunumu` — engellenen uygulama açılınca çıkan ekran;
  metni ve renkleri Android'in engel katmanından ("Odaktasın.", kalan süre).
  Apple düzeni kendisi çiziyor, neyin taşınamadığı dosyanın başında yazılı.
  Renkler ve `tavsan_yuz.png` orada yeniden yazılı/kopyalı: eklenti ayrı bir
  süreç. Kalan süreyi `rabiTur` zamanlayıcısının sonundan okuyor.
- `components/odak/ios-odak-ayarlari.tsx` — Pomodoro'nun "Odak koruması"
  satırının iOS içi.

Android'den üç farkı var ve üçü de bilerek:

- **Tek anahtar.** Kalkanlanan uygulama hem açılmıyor hem bildirim
  göndermiyor; Screen Time ikisini birlikte yapıyor. Android'in ayrı Rahatsız
  Etme anahtarı iOS'ta çizilmiyor.
- **Liste Apple'ın.** Seçim Apple'ın seçicisinden yapılıyor, Rabi seçilen
  uygulamaların adını bile görmüyor (opak belirteçler, yalnızca cihazda,
  `UserDefaults`); önerilen uygulama işaretlenemiyor. Seçilenler Pomodoro'da
  ikon ve adıyla görünüyor ama o satırları **yerli taraf** çiziyor
  (`EngelListesi`, WKWebView'ın kaydırma görünümünün içinde): web sayfası
  yalnızca yer ayırıyor, pencere açılınca listeyi gizliyor
  (`katmanlariIzle`) ve yüzen öğelerin (`data-yuzen`) altına taşmasın diye
  görünür bandı bildiriyor. Sayfaya yüzen yeni bir çubuk eklersen
  `data-yuzen` ver.
- **Duraklatmak kalkanı kaldırıyor.** Android'de servis donuyor ve kilit
  sürüyor; iOS'ta donacak bir servis yok ve duraklatılıp unutulan tur
  uygulamaları süresiz kapalı bırakırdı. Devam edilince kalkan yeniden kuruluyor.

**Xcode hedefleri betikle ekleniyor** (`scripts/ios-eklenti-hedefleri.rb`,
`xcodeproj` gem'i). Windows'ta ne Xcode ne Ruby var ve `project.pbxproj`i elle
yazmak tek kimlik hatasında projeyi açılmaz yapıyor. Betik değişince
`.github/workflows/ios-proje.yml` onu macOS'ta çalıştırıp proje dosyasını dala
geri commit'liyor.

**Arşiv otomatik imzalı** (`ios-testflight.yml`), dışa aktarma onu dağıtım
imzasıyla yeniden imzalıyor. İmzasız arşiv derleniyordu ama yetkiler imzaya
girmiyor, Screen Time yetkisi sessizce düşüyordu; ad-hoc imzayı iOS 26 SDK'sı
reddediyor. Otomatik imzanın bedeli hesapta kayıtlı bir iPhone (geliştirme
profili cihazsız kurulmuyor). Yüklemeden önce bir adım paketin üç parçasında
da yetkiyi denetliyor — eksikse yükleme yok.

**Onay yetkiyi kendiliğinden açmıyor.** Apple'ın "Family Controls
(Distribution)" onayından sonra üç App ID'nin her birinde Identifiers ›
Additional Capabilities › Family Controls (Distribution) elle işaretlenmeli;
işaretlenmezse App Store profili yetkiyi taşımıyor ve dışa aktarma "profile
doesn't include the Family Controls capability" ile düşüyor. Bu kutu API'de
yok (`scripts/app-store-hazirla.py` yalnızca geliştirme türünü görüyor) ve
yalnızca hesap sahibi/Admin portaldan açabiliyor. Yeni eklenti kimliği
eklenirse ona da aynı kutu.

**Uygulamanın içinde başka platform adı geçmez.** App Store 2.3.10 başka bir
mobil platformun ya da mağazanın adını kabul etmiyor. "Android", "Play" diyen
metin ya yalnızca Android'de çizilen bir ekranda durmalı ya da platform adı
olmadan yazılmalı.

**Geri hareketi yerli tarafta tanınıyor.** iOS'ta geri tuşu yok; soldan
kaydırma `AnaDenetleyici.swift`te `UIScreenEdgePanGestureRecognizer` ile
yakalanıp `rabiGeri` olayıyla `AppShell`e geçiyor ve Android'in geri tuşuyla
aynı `geriGit`ten geçiyor. JS'te dokunuşla tanımak kaydırmayla yarışıyordu;
sistemin kendi tanıyıcısı hareketi kaydırmadan ayırmayı biliyor. Gidecek yer
kalmayınca uygulama kapanmıyor — iOS'ta uygulama kendini kapatmaz.

**Çizerken kenardan kaydırma yok sayılıyor** (`geriKaydirmayiKilitle`,
`lib/geri-kaydirma.ts`). Yanlış soru fotoğrafına sol kenardan başlayan bir
çizgi geri hareketi olarak da tanınıyor ve çizimi kaydedip kapatıyordu.
Tanımayı yerli tarafta kapatmak çözüm değil — parmak sayfaya da ulaşmalı,
çizgi o — tanınan burada yok sayılıyor. Parmağın sayfayı kaydırdığı ya da
sürüklediği yeni bir yüzey eklersen aynı kilidi kullan. Android'in geri tuşu
kilide bakmıyor.

**Ses sessiz tuşuna uymuyor** (`AppDelegate.swift`, ses oturumu `.playback`).
WKWebView'ın sesi varsayılan olarak sessizde susuyordu; kullanıcı oyun
seslerinin ve lo-fi'ın sessizde de çalmasını istedi. `.mixWithOthers` şart:
o olmadan bir oyun efekti öğrencinin arkada dinlediği müziği keserdi. Sesleri
susturmanın yolu Ayarlar'daki anahtarlar.

**Bilet damgasında titreşim yok.** iOS'a bir süre Taptic Engine ile titreşim eklenmişti (bilet
damgası); kullanıcı iki platformda da kaldırttı. Oyunlardaki doğru/yanlış
dokunuşu (`@capacitor/haptics`) bu kararın dışında ve duruyor.

**Windows'ta derlenmiyor.** Swift kodu ve Xcode projesi yalnızca CI'da
(`.github/workflows/ios.yml`, macOS, imzasız simülatör derlemesi) deneniyor;
`ios/` altına dokunan her PR onu çalıştırıyor. `cap sync ios` Windows'ta
Package.swift'e ters eğik çizgili yollar yazıyor ve macOS o yolları
bulamıyor; `npm run sync:ios` arkasından `scripts/ios-yol-duzelt.mjs`i
çalıştırıyor.

iPhone + iPad (`TARGETED_DEVICE_FAMILY = "1,2"`). Eskiden `1` idi ve iPad'de
uygulama iPhone uyumluluk kipinde, telefon boyutunda dar bir pencerede (köşede
yeniden boyutlandırma tutamacıyla) açılıyordu. Şimdi iPad'de tam pencere:
düzen Android tabletle aynı yolu izliyor — `max-w-md` sütun + `app/layout.tsx`
betiğinin `--olcek` ile yaptığı `zoom`; ayrıca bir `max-width` konmadı.
`UIRequiresFullScreen` **yok**: iPad'de Split View / Stage Manager'ın çalışması
için dört yön de açık (`Info.plist`, `UISupportedInterfaceOrientations~ipad`)
ve Apple bu anahtarı kullanımdan kaldırıyor. iPhone yalnızca dikey.

**Sekmeler arasında yana kaydırılıyor** (iOS ve Android, `lib/sekme-kaydirma.ts`).
Ana menünün beş sekmesinin ekranındayken parmak sağa giderse soldaki sekme,
sola giderse sağdaki açılıyor (Araçlar → sağa: Ana Sayfa, sola: Harita);
sıra `SEKME_SIRASI`, alt menü de onu çiziyor.

Kullanıcı bunu üç kez istedi. İlk sürüm yalnızca parmak kalkınca karar
veriyordu (70 pikselden uzun, 0,7 saniyeden kısa, neredeyse düz) ve sayfa
parmağı izlemiyordu: yavaş ya da hafif eğik kaydırma hiçbir şey yapmıyor,
kullanıcı hareketin tanınıp tanınmadığını göremiyordu ve özellik "yok"
sanıldı. Şimdi Instagram'daki gibi: yön yataya kilitlenince sayfa **parmakla
birlikte kayıyor**, komşu sekme yandan görünüyor (daha önce açıldıysa
görüntüsüyle, `ekranGoruntusu` — geri kaydırmanın kopyaları; açılmadıysa boş
zemin) ve bırakınca karar mesafe ya da hızla (`birakmaKarari`,
`lib/sekme-kaydirma-hesap.ts`): ekranın üçte biri ya da hızlı savrulma.
Görüntü yerine oturduysa yeni sekme hareketsiz geliyor (`.sayfa-yerinde`),
görüntü yoksa o yandan kayarak. Uçtaki sekmede sayfa direnerek az kayıp geri
dönüyor. Kilitlenince `touchmove` engelleniyor (dinleyici pasif değil): sayfa
aynı anda dikeyde kaymasın.

Yatay kayan bir şeridin içinden başlayan hareket önce şeridi kaydırıyor; şerit
o yönde sonuna gelmişse sekme kayıyor. İlk sürüm şeridin içini tümüyle
yasaklıyordu ve dikey kayan bir kabı da (`overflow-y: auto` olan öğenin
`overflow-x`i `auto` hesaplanıyor) şerit sayabiliyordu; artık yalnızca
yatayda kayan kutular şerit. Sayılmayanlar: kenardan başlayan hareket (iOS'ta
geri kaydırma, Android'de sistemin geri hareketi), yazı alanı, alt menü, ve
araç, form, genel test, tanıtım ya da açık bir katman (ders ızgarası, deste,
oyun, pencere, Harita'nın ilk açılış ipucu) varken her şey.

**Geri kaydırma parmağı izliyor.** Yerli taraf hareketi tanırken
(`.began/.changed/.ended`) `window.rabiGeriKaydirma`yı çağırıyor
(`lib/geri-kaydirma.ts`); ekran içeriği (`[data-geri-sayfa]`) parmakla kayıyor,
bırakılınca dışarı çıkıp `geriGit`i çağırıyor ya da yerine dönüyor. Alt
ekranlar iOS'ta sağdan kayarak açılıyor (`data-platform="ios"`, globals.css);
Android'in aşağıdan gelen geçişi aynı. Bir süre (ilk sürümü boş kareler
bıraktığı için) kaldırılıp parmak kalkınca değişen ekrana dönüldü; boş kare
hataları giderilince geri geldi.

**Altında önceki ekran görünüyor.** Kayan sayfanın altında bir süre yalnızca
sayfa zemini vardı ve önceki ekran ancak bırakınca soldan beliriyordu;
kullanıcı geçişi bozuk buldu. Şimdi her ekran sökülürken DOM'unun bir kopyası
alınıyor (`ekranGoruntusuKaydet`, `SayfaGecisi`) ve kaydırma başlayınca o kopya
sayfanın altına seriliyor (`.geri-onizleme`): ekranın %30 solundan, sayfadan
yavaş kayarak geliyor (`PARALAKS`) ve yalnızca sayfanın solunda görünüyor
(iPad'de sütunun dışına taşmasın diye kırpılıyor). Kayan sayfa kabın
boşluklarıyla birlikte donuk bir zemin alıyor (`zeminKur`), yoksa altındaki
kopya içinden görünürdü. Bırakınca gerçek ekran kopyanın yerine hareketsiz
kuruluyor (`.sayfa-yerinde`). Kopya canlı değil: dokunulmuyor, animasyonları
kapalı, `fixed` öğeleri ve kimlikleri (`id`, `data-geri-sayfa`, `data-yuzen`,
`data-tanitim`) atılmış — kalsaydı `querySelector` gerçek öğe yerine kopyayı
bulurdu. Kopyası olmayan ekranda eski davranış sürüyor.

Durum makinesi `lib/geri-kaydirma-denetci.ts`, hız/süre/eğri hesapları
`lib/geri-kaydirma-hesap.ts` (ikisinin de birim testi var). Kurallar,
ölçülerek bulunmuş hatalardan: sürükleme başlayınca kutunun giriş animasyonu
kapanıyor (`animation-name: none`, yoksa transform'u animasyon eziyor); ekran
`flushSync` ile aynı görevde değişiyor; geri yönü kutuya kurulurken bir kez
okunan `.sayfa-geri` sınıfı (kökte bir öznitelik çıkan sayfanın da
animasyonunu değiştiriyordu); çıkış hızı parmağın hızıyla başlıyor; yaylanma
yeni bir hareketle kesilebiliyor; tanıtım turunda ve alt menü sürüklenirken
sayfa kaymıyor.

**Android'de de var (Android 14+).** `MainActivity.geriKaydirmayiBagla`
sistemin öngörülü geri hareketini (`OnBackPressedCallback`,
`handleOnBackStarted/Progressed/Cancelled`) aynı arayüze iletiyor; bırakınca
`rabiGeriKaydirma.bitir()`. Yalnızca sol kenardan başlayan hareket; sağ kenar,
3 düğmeli gezinme ve eski sürümler Capacitor'ın `backButton` yoluna olduğu
gibi gidiyor. `enableOnBackInvokedCallback` yalnızca `MainActivity`de
(uygulama düzeyinde odak kilidi katmanının `KEYCODE_BACK` yutması bozulurdu).

İkon `ikon-uret.mjs`ten geliyor (`AppIcon-512@2x.png`, 1024): köşesiz ve
**alfa kanalı atılmış** — App Store saydamlık taşıyan ikonu yüklemede
reddediyor.

**Yayın Android'le aynı etiketle.** `v*` etiketi Play'e (varsayılan kapalı test) otomatik
yükleniyor (kurulum ve sürüm akışı `RELEASE.md` › "Otomatik yayın") ve `ios-testflight.yml`i de
tetikliyor ve derleme TestFlight'a düşüyor; mağazaya çıkması App Store
Connect'ten elle incelemeye göndermekle oluyor. Sürüm iOS projesine yazılmıyor,
`android/app/build.gradle`dan okunuyor (`versionName` → sürüm, `versionCode` →
derleme numarasının başı): iki mağazada aynı derleme aynı numarayı taşımalı.
Derleme numarasının sonundaki çalıştırma sayısı, App Store'un aynı numarayı
ikinci kez reddetmesi yüzünden — yarıda kalan yükleme aynı etiketle yeniden
denenebilsin. İmza Apple'ın bulut imzalaması (Admin yetkili API anahtarı); depoda
sertifika ya da profil yok.

## Derleme

APK için **JDK 21 şart** — sistem varsayılanı JDK 25, Gradle 8.14.3 desteklemiyor.
`JAVA_HOME=/usr/lib/jvm/java-21-openjdk npm run apk`.

Değişiklikten sonra en az `npm run typecheck`, saf mantığa dokunduysan `npm run test`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
