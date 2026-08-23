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
  Tailwind `text-primary`). Tek palet var, kullanıcıya renk seçtirilmiyor.
  Vurgu mor: koyu temada lavanta (`--primary` #A78BFA), açık temada koyulaşmış
  hâli (#6D3FE0). İkinci kimlik rengi fuşya (`--ikincil` #F472B6 / #DB2777).
  Zemin koyuda neredeyse siyah mor (`--background` #0F0B1C), açıkta morumsu
  kâğıt (#F5F3FF). Renk **derse** ait, oyuna değil: `yzm` (Türkçe, gül) ·
  `isl` (Matematik, amber) · `edb` (Edebiyat, lavanta) · `cog` (Coğrafya, yeşil) ·
  `trh` (Tarih, deniz mavisi) · `byl` (Biyoloji, yaprak yeşili), her biri `-koyu`
  ve `-ok` tonuyla.
  Kart yüzeyi `golge-kart` sınıfıyla: açık temada gölge, koyu temada hiçbiri —
  orada kart zeminden zaten bir tık açık.
- **Koyu tema asıl tema.** Tasarım gece çalışan öğrenci için çizildi; açık tema
  aynı paletin gündüz hâli. Yeni bir renk eklerken önce koyuda bak.
- **İki mor var, karıştırma.** `--primary` (koyu temada lavanta) *yazı* rengi
  ve açık dolgular için: `text-primary`, `bg-primary-soft`, halkalar, çubuklar;
  dolu hâlinde üstüne `text-primary-foreground` (neredeyse siyah) geliyor.
  `--primary-dolu` (doygun mor) *eylem* yüzeyleri için: dolu düğme, seçili çip,
  açık anahtar — üstündeki yazı her iki temada da beyaz. Lavantanın üstüne beyaz
  okunmuyor, doygun morun üstüne koyu yazı okunmuyor; her biri kendi eşiyle
  gidiyor (`bg-primary text-primary-foreground` / `bg-primary-dolu text-white`).
- Yazı tipi tek: **Plus Jakarta Sans**. Başlık ayrı aile değil ayrı kalınlık —
  `font-display` hâlâ var ama aynı aileye çözülüyor; başlıklar `font-extrabold`,
  gövde `font-medium`. Ailenin en kalını **800**: `font-black` (900) kullanma,
  tarayıcı onu 800'e düşürüp sahte kalınlık üretir.
- Marka moru (#6D3FE0) üç yerde daha yazılı ve hepsi birbirini tutmak zorunda:
  `values/colors.xml` → `marka_mor` (son uygulamalar kartı, odak kilidi
  düğmeleri) ve uygulama ikonunun arka planı (`ic_launcher_background.xml`,
  `public/icon.svg`, `assets/icon-*.svg`). `mipmap-*/ic_launcher*.png`
  (Android 8 öncesi yedek ikon) elle üretiliyor, renk değişince yeniden
  üretilmesi gerekiyor. Açılış ekranının zemini bu listede **değil** — o ayrı
  bir kural, aşağıda.
- Tasarım kaynağı `tasarim/` altındaki HTML mockup'lar. Derlemeye girmiyorlar,
  uygulama onlardan hiçbir şey import etmiyor — ekran değiştirirken oraya bak.
- Sütun hâlindeki sayılara `rakam` sınıfı (tabular-nums), başlıklara `font-display`.
- Alt menünün altında kalan içerik için `guvenli-alt`.

### Ana sayfanın düzeni

Sıra tesadüf değil, "önce ben, sonra hedef, sonra bugün" diye okunuyor:

1. **Selamlama** — maskot, "Merhaba", altında seviye · unvan · havuç. Seviye
   eskiden ayrı bir karttı; sayfanın en değerli yerini üç sayı için harcıyordu.
   Satırın tamamı mağazaya gidiyor.
2. **Geri sayım + hedef** — tek kart. "Kaç gün kaldı" ile "ne için" aynı sorunun
   iki yarısı; hedef ayrı kart olsaydı aradaki bağ görünmezdi. Hedef eskiden
   sayfanın en altındaydı ve hedefini hiç yazmamış kullanıcı oraya inmediği için
   özelliği hiç görmüyordu.
3. **Günlük hedef + yedi günlük seri** — tek kart. İkisi de aynı soruyu farklı
   ölçekte cevaplıyor. Halkanın içinde yalnızca çözülen sayı var ("/300" yok):
   hedef zaten yanındaki cümlede yazıyor ve iki sayı halkaya sığmıyordu.
4. **Araç kısayolları** — kartsız, doğrudan zeminin üstünde dört kutucuk. Bunlar
   bir bölüm değil kısayol; başlıkları da yok, çünkü kutucuğun içindeki ad zaten
   ne olduğunu söylüyor.
5. **Oyunlar** — kartın içinde, çünkü bir bölüm.
6. **Günün sözü** — sessiz tek satır.

Sayfada bilerek **olmayan** üç şey var; üçü de bir kez eklenip tasarıma bakılarak
geri alındı: seviye ilerleme çubuğu (sayı zaten yazıyor), geri sayımın içindeki
uzun sınav sözü (rozetteki kelime aynı havuzdan geliyor ve altta günün sözü zaten
var) ve "Bütün araçlar" bağlantısı (alt menüdeki "Daha" sekmesi aynı yere
gidiyor). Yeniden ekleyeceksen önce neyi ittiklerine bak.

Hedef panelinde üniversite kısaltılıyor (`universiteKisaAdi`): "Bilgisayar
Mühendisliği · Orta Doğu Teknik Üniversitesi" hiçbir telefonda tek satıra
sığmıyor ve kırpılan yer tam da üniversitenin adı oluyordu. Satır yine taşarsa
kırpılan taraf **bölüm**; üniversite `shrink-0`, çünkü hedefin hangi okulda
olduğu kaybolmamalı.

### Açılış ekranı tek ekran olmak zorunda

Uygulamaya girerken kullanıcı üç ekran görüyordu: mor sistem ekranı, siyah bir
kare, sonra mor açılış ekranı. Üçü ayrı yüzey ve **zeminleri aynı olmadıkça**
üç ekran gibi görünüyorlar:

1. sistemin açılış ekranı — `values/styles.xml` → `windowSplashScreenBackground`
2. WebView ilk kareyi boyayana kadar görünen pencere zemini — aynı dosyada
   `AppTheme.NoActionBar` → `android:windowBackground`
3. uygulamanın kendi açılış ekranı — `components/acilis.tsx` → `ACILIS_ZEMINI`

Üçü de `#0D0C16`. Ortadakinin temayı izlemesi (eski hâli) tam da siyah karenin
sebebiydi. Birini değiştirirsen üçünü birden değiştir.

Renk, ekranın gradyanının **dış** durağı; ortası daha açık. Düz renkten
gradyana geçişte kenarlarda oynama olmuyor, yalnızca ortadaki ışık beliriyor —
sistem ekranı gradyan gösteremediği için tek çözüm bu.

Ekran temadan bağımsız olarak hep koyu: bu bir marka anı, uygulamanın ekranı
değil. Maskotun renkleri de o yüzden `acilis.tsx` içinde sabitleniyor; tema
değişkenlerinden gelseydi açık temada beyaz kürk koyu zeminde kaybolurdu.

Ekran 4,6 saniye duruyor (`ACILIS_SURESI`) çünkü kullanıcı izlenecek kadar
durmasını istedi. Sayı keyfi değil: hâlenin bir turu (4,6 sn) ve yükleme
yazılarının üç durumu (3 × 1,5 sn) tam bu sürede tamamlanıyor. Tasarımın kendi
yazı turu 10,5 saniyeydi ve o süreyle üçüncü yazı hiç görünmüyordu — süreyi
değiştirirsen `.rb-durum` ile birlikte değiştir.

Hareketler `prefers-reduced-motion` altında susuyor ama ekran **eksilmiyor**:
`opacity: 0` ile başlayan üç parça (kıvılcımlar, slogan harfleri, yükleme
yazıları) orada görünüre çekiliyor, yoksa animasyon kapanınca ekranda hiç
çıkmazlardı. Çark istisna, duruyor değil yavaşlıyor: dönmeyen bir bekleme
göstergesi "donmuş" izlenimi veriyor.

### Ayarlar satırları kapalı açılıyor

Seçenek çipleri satırın altında sürekli açık dururken ekran üç ekran boyundaydı.
Şimdi satır kapalı: solda ad, sağda seçili değer, uçta ok. Tek satır açık kalıyor
(`acikSatir`), ikincisini açmak birincisini kapatıyor. Tema istisna — uygulamayı
ilk açanın aradığı ayar o ve tasarımda da açık çizilmiş. Anahtarlı satırlar
(hatırlatma, müzik) açılamaz: satıra dokunmak anahtarı çeviriyor, aynı satır hem
anahtar hem liste olamaz — hatırlatma saati o yüzden **ayrı** bir satır.

## Seviye ve havuç

Seviye **türetilmiş**: kayıtta XP sayacı yok, her açılışta mevcut veriden yeniden
hesaplanıyor (`lib/seviye.ts`). Böylece aylardır veri girmiş kullanıcı sistemi ilk
gördüğünde hak ettiği seviyede başlıyor. `rabi-seviye` altında yalnızca **ulaşılan
en yüksek seviye** duruyor; o sayı hem seviyenin geri gitmesini hem aynı ödülün
ikinci kez dağıtılmasını engelliyor.

XP'nin kuralı rozetlerinkiyle aynı (`lib/rozetler.ts`): soru sayısı elle giriliyor,
o yüzden soru XP'sinin hem günlük hem ömür boyu tavanı var. Zaman isteyen ölçüler
(pomodoro dakikası, seri günü, bankadan düşen soru) tavansız ve seviyenin omurgası;
oyun XP'sinin de ayrı bir toplam tavanı var — oyun mola aktivitesi, ana yol değil.
Yeni bir XP kaynağı eklerken önce "bu uydurulabilir mi" diye sor; uydurulabiliyorsa
tavanla.

Havucun akışları sayılıdır ve hepsi `lib/seviye.ts` ile `lib/havuc.ts` içinde:

- **Artar:** seviye atlayınca (`birikenOdul`) ve Oyun Bankası'ndan soru düşünce
  (`bankaOdulu`). İkincisinin ömür boyu tavanı var — bankaya bilerek yanlış
  düşürüp düzelten biri yavaş ama sınırsız havuç basabilirdi. Ödül yalnızca
  **kazanılan** düşüşün karşılığı: bankadaki tikle elle kaldırma `bankadanDustu`
  yoluna hiç uğramıyor, yoksa havuç bir tuşa basmanın bedeli olurdu.
- **Azalır:** mağaza ve **odak cezası** (`cezaDus`). Pomodoro sırasında odak
  kilidini kıran kullanıcıdan en ucuz jokerin fiyatı kadar havuç gider. Kilit
  kırılabilir olmak zorunda; caydırıcılığı o yüzden bedelin taşıması gerekiyor.
  Bakiye eksiye inmiyor — borç yok.

Ömür boyu kazanılabilecek toplam `TOPLAM_KAZANC` ile sabit (≈10.800) ve joker
fiyatları ona oranla konuldu. `lib/magaza/jokerler.test.ts` ile `lib/havuc.test.ts`
içindeki `denge` testleri bu oranı koruyor: bütün havuç toplansa bile çantayı her
jokerden dokuzar tane doldurmaya yetmiyor. Fiyatı, XP eğrisini ya da ödül tavanını
değiştirirsen o testler kırılır; kırılmaları doğru, sayıyı güncellemeden geçme.

Yeni bir havuç kaynağı eklerken tavan sorusunu sor: kaynak tavansızsa mağaza bir
süre sonra anlamsızlaşıyor.

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
turlarda üst üste `DUSME_ESIGI` kez doğru bilinince kendiliğinden düşüyor; havucu
veren yol bu. **Elle kaldırma**: karttaki tik kaydı havuçsuz siliyor. İkincisi
sonradan eklendi çünkü banka bir borç listesi — öğrendiğine kullanıcının kendisi
karar veremiyorsa liste yalnızca büyüyor ve bir yerden sonra hiç açılmıyor.

Tik havuç vermiyor; ölçtüğü tek şey kullanıcının tuşa basması. Bankaya yeni bir
çıkış yolu eklersen aynı soruyu sor: bu yol uydurulabiliyor mu, uydurulabiliyorsa
ödülü olmamalı.

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

## Havuç Mağazası

Satılan tek şey joker; tavşan özelleştirmesi kaldırıldı. Katalog
`lib/magaza/jokerler.ts`, çanta `rabi-jokerler` anahtarında kimlik başına adet
tutuyor. Hiçbir joker doğru cevabı söylemiyor — sahayı daraltıyor, süreye ya da
hakka dokunuyor. Cevabı veren bir joker rekoru da Oyun Bankası'nı da
anlamsızlaştırırdı. Güçlü jokerlerin ayrıca seviye şartı var (`enAzSeviye`);
kilitli joker gizlenmiyor, kilitli gösteriliyor.

Jokerlerin tur içinde kullanılması henüz yazılmadı: stok yalnızca `jokerKullan`
üzerinden eksilmeli, oyun tarafı geldiğinde de o tek kapı kalmalı.

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
