# Maskot ve uygulama ikonu

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Maskot

- Pozlar üretilir: kaynak `assets/maskot/*.png` (zemini kesilmiş, **saydam** PNG —
  zorunlu, betikte zemin silme yok; ilk takım 2048'lik, ikinci takım 1254'lük, betik
  ölçüyü kaynaktan okur), betik `scripts/maskot-uret.mjs`, çıktı `public/tavsan-*.png`.
  Çıktılar depoda ama **elle düzenlenmez**. Bütün pozlar aynı tuvalde **aynı
  yükseklikte** (`Rabi` ölçüyü tek sayı olarak biliyor). Kaynak PNG'ler pakete girmez.
- Poz listesi `lib/maskot.ts`te (`MASKOT_POZLARI`, dosya adı `tavsan-<poz>.png`),
  bileşende değil (`lib/` karar fonksiyonu bileşene bağımlı olmasın).
  `maskot.test.ts` her pozun dosyasını denetler: listeye eklenip betikte üretilmeyen
  poz testi düşürür.
- **`durum` ile `poz` ayrı kalır.** `durum` yalnız ekran okuyucu etiketi, dosyayı
  `poz` seçer. Durumdan dosya türetme: `KurulumMaskotu` iki adımda aynı görseli
  taşımak zorunda.
- Küçük yerlerde (≈70 px altı tam boy leke olur) baş: oyun başlıkları (26–54) `yuz`,
  kurulum karşılaması `kafa`. Ana sayfa selamlaması tam boy pozda, 84 px
  ([ana-sayfa.md](ana-sayfa.md)).
- `yuz`, "normal maskot"un ölçülmüş kırpımı ve **Android engel katmanının ve
  pomodoro bildiriminin kaynağı** (uygulama ikonunun kaynağı değil, bkz. aşağıdaki
  "Uygulama ikonu"). Kırpma değişirse `tavsan-yuz.png` kopyaları yenilenir: `android/.../drawable-nodpi/tavsan_yuz.png` ve
  `ios/App/KalkanGorunumu/tavsan_yuz.png` (yerli taraf `public/`i okuyamıyor).
- **Pozlar paletli PNG (256 renk, `uret`'in varsayılanı `sikistir: true`), `yuz`
  hariç**: ~60 kB yerine ~15–20 kB; `public/tavsan-*.png` toplamı ~0,93 MB. Bedeli
  yalnız üç kat büyütmede kürkte ince kumlanma.
- **`yuz` düz PNG kalır** (`sikistir: false`) ve betik onu baytı baytına aynı üretir:
  baytları değişirse Android ve iOS kopyaları yenilenmeli.
- `sevinen` ve `ziplayan` ikisi de kullanılıyor (`ziplayan` aylık özette, `sevinen`
  başka yerlerde) — tek poz iki bağlamda tekrarlanırdı. "sinirli" kaynağı bilerek
  kullanılmıyor: Rabi yanlışta kullanıcıya kızmaz.

### İkinci takım (v2): poz ekranın işini yapar

- Kural: boş ekrandaki tavşan oranın ne için olduğunu gösteren bir **eylem** yapar,
  ruh hâli değil (ruh hâlini durum etiketi söylüyor). 63 pozluk takımdan 28'i
  alındı (kullanıcı çeşit istedi):

  | Poz | Kaynak | Nerede |
  | --- | --- | --- |
  | `defterli` | defter tutan | kurulum › sınıf adımı |
  | `abakuslu` | abaküsle sayan | kurulum › notlar; Sıralama › deneme yok |
  | `durbunlu` | dürbünle bakan | kurulum › bölüm |
  | `elleri-belde` | elleri belde | kurulum › günlük hedef |
  | `megafonlu` | megafonla konuşan | kurulum › hatırlatma |
  | `cantali` | çanta kapatan | ana sayfa › bugünkü görevler bitti |
  | `fotografci` | fotoğraf çeken | Denemeler › kayıt yok (kâğıt fotoğrafla okunuyor) |
  | `buyutecli` | büyüteçle inceleyen | Yanlış Soru Bankası › boş |
  | `supuren` | yaprak süpüren | Oyun Bankası › boş ("iyi haber") |
  | `bitkili` | bitki sulayan | İstatistik › veri yok |
  | `haritali` | haritadan yol bulan | Harita › dersin kartları hazırlanıyor |
  | `kitapli` | kitabı inceleyen | Harita › anlatım kartı (`okuyan`ın yerine) |
  | `tahtali` | tahtaya yazan | oyun tanıtımı (nasıl oynanır) |
  | `laptoplu` | laptopta çalışan | odak daveti (Pomodoro) |
  | `kucak-acan` | kucak açan | ana sayfa › hedef tuttu (dönüşümlü); kurulum › "uygulaman hazır" |
  | `saatli` | saate bakan | odak kilidi kurulumu |
  | `basparmak` | başparmak kaldıran | hızlı kontrol › doğru; kapanış › iyi |
  | `damgali` | onay damgası basan | kapanış › iyi |
  | `alkislayan`, `dans`, `takla` | alkışlayan, dans eden, takla atan | kapanış › harika (`sevinen` ile dönüşümlü) |
  | `gerinen`, `esneyen`, `bagdas`, `uzanan` | gerinen, ayak parmaklarına uzanan, bağdaş kuran, uzanan | deste molası (dönüşümlü) |
  | `selamlayan` | eğilerek selamlayan | aylık özetin kapanışı ("Yarın yine buradayım") |
  | `kahkaha` | kahkaha atan | yalnızca durum kafası |
  | `yapboz` | yapboz tamamlayan | bütün mini oyunlar (kullanıcı istedi): yer olan yerde sorunun üstünde ortada 96 px; dar şekilli/tuşlu oyunlarda kartın sol üst köşesinde 56 px, kartın içinde kalır — kulakları dışarı taşırmak kısa ekranda kutudan fırlamış gibi duruyordu (`KoseRabisi`, `oyun-kabuk.tsx`) |
  | `oturan` | oturan (kaynak `oturan.png`, kullanıcı verdi) | oyun modu penceresinin başı, 80 px: tur başlamadan oyuncuyu bekliyor |

- **Dönüşüm rastgele değil.** Aynı yere düşen pozlar `gununPozu` (`lib/maskot.ts`)
  ile günün tarihinden seçilir (gün içinde sabit, `gunun-hali.ts`teki cümle kuralı);
  mola pozları mola metniyle aynı `secim` sayısından. Rastgele seçim her çizimde başka
  tavşan demekti.
- **Mola zıplamaz**: mola kutlama değil nefes; dört dinlenen poz döner.
- Kaynaklardaki "esneme yapan" esnemiyor (oturmuş, gülümseyen tavşan); kaynağın adına
  güvenme.
- **Dışarıda kalanlar** (eklemeden önce gerekçeye bak):
  - Müzik aletleri (flüt, davul, tef): uygulamada müzik yok (oyun ve Pomodoro'dan
    bilerek kaldırıldı); olmayan özelliği vaat eder.
  - Havuç tutan ve hediye tutan: havuç/ödül mekaniği kaldırıldı, onu çağrıştırır.
  - Oyun/el işi (top sektiren, top yuvarlayan, satranç, blok kule, kâğıt
    kesen/katlayan, yapıştırıcı, fırça, kâğıt uçak, seksek): bir işe karşılık
    gelmiyor (satranç aday olabilirdi; yapboz sonradan oyun ekranına alındı).
  - Eşi olanlar: büyüteç tutan, kupadan içen (`kahveli`), çenesine dokunan
    (`dusunen`), cetvelle çizen (abaküs), kitap ayracı ve kutuya kitap
    (okuyan/kitaplı), deftere yazan (yalnız durum kafası), teleskop (dürbün; Hedefim
    maskotu 64 px, tam boy okunmaz).
  - Çubuk tutan üç poz (eski `isaretci`): kullanıcı kaldırttı (2026-10); kart
    notunda `megafonlu`, tanıtımın dokunma adımında `el-sallayan` aldı. Geri koymadan sor.
  - Anlamı belirsiz ruh hâlleri: çömelen, koşan, parmak ucunda yürüyen,
    emekleyen, tek ayakta denge, yüzüstü ayak sallayan, utangaç, şaşırıp sıçrayan,
    çiçek tutan, silgiyle silen. Ekran bulununca kaynağı kopyalayıp
    betiğe eklemek yeter; boşta duran poz paketi şişirir.

## Rabi'yi Giydir (3D katmanlar)

- Ekran `components/ekranlar/rabi-giydir.tsx`, kurallar `lib/giydir.ts`, kayıt
  `rabi-giydir`. Kaynak model Blender'da (`rabi8_iskelet.blend` + eşyalar,
  `rabi_giydir3.blend`; kurulum `kur3.py`, katmanlar `katman3.py`; kep ve kepli
  Rabi `secenek.py buku` ile alınır (sonucu `rabi_giydir_buku.blend`). Betikler
  `giydir-betikleri/` içinde; depoda değil, `Desktop\rabi_tavsan_model`).
- Görseller `public/giydir/`: `rabi.png` + eşya başına tam tuval katman (900×1100,
  **aynı kamera**) ve 256'lık `-ikon.png`. Eşya katmanı Rabi "holdout" iken render
  alınır: Rabi görünmez ama önünde kaldığı yerde eşyayı keser, böylece katmanlar
  üst üste konunca kulak kepin içinden, sap başın arkasından geçer. Kamerayı ya da
  tuvali değiştirirsen **bütün** katmanlar yeniden alınır; tek katman ayrışırsa kayar.
- **Gölge katmanın içinde.** Eşyanın kafaya/yere düşürdüğü gölge, eşya kameraya
  görünmezken alınan render'ın çıplak Rabi'ye oranından (`1 − B/A`) çıkar ve eşya
  katmanının altına yarı saydam siyah olarak gömülür; gölgesiz eşya yapıştırılmış
  gibi duruyordu. Yer gölgesi ayağın altında elipse kırpılır: anahtar ışık gölgeyi
  sola uzun bir kama gibi atıyor, kartın köşesini karartıyordu.
- **Kepte "Bükük Kulak"** (kullanıcı seçti, 2026-10-31): kep küçülüp (0,7) sağa
  kayar ve o yana eğilir; sol kulak dik, kepin altındaki sağ kulak ortadan aşağı
  katlanır. Denenip beğenilmeyenler: kulak kepin içinden dik, kulaksız, iki yana
  sarkık, mini kep, geriye yatık, tahtada kulak yuvası. Kep giyiliyken alttaki Rabi
  `rabi-kep.png` (`Esya.taban`); kep katmanı da o pozla alınır. Dik kulak tahtaya
  değmeyene dek kep sağa itilir, kulak kökü tahtayı deliyorsa tahta yukarı itilir
  (yoksa beyaz çizik kalır).
- **Gözlük camı gözü kapağıyla birlikte içine alır:** küçük camda kapak çizgisi
  çerçevenin dışına taşıp çift çizgi gibi duruyordu. Saplar menteşeden hemen başa
  dalar (yanakta çubuk gibi görünüyordu), camda parıltı şeridi yok (çizik gibi
  okunuyordu). Konum ve açı yüzey ölçülerek bulunur (`gozluk_yerlesimi`).
- Gözlük camı yalnız kenarda yansır: beyaz dünyayı yansıtan cam gözlerin üstünde
  süt gibi bir tabaka bırakıyordu. Gözün koyu yerinde gömülü gölge sönümlenir:
  oran orada gürültüye boğulup camın altında hayalet leke bırakıyordu.
- Paletli PNG (maskot pozlarıyla aynı). Yeni eşya = Blender'da kemiğe bağlı nesne +
  aynı kamerayla katman + `ESYALAR`a satır; aynı yuvaya ikinci eşya ötekini çıkarır.
- **Eşyalar ve yuvalar** (2026-10-31): kafa (kep, bere, taç, kulaklık), yüz (güneş
  gözlüğü), boyun (papyon, atkı, Sigma); kulak ve ayak yuvaları boş. Kulakta kalem
  kullanıcı kaldırttı; geri getirme. Dördüncü tur eşyaları `kur4.py` kurar
  (`rabi_giydir5.blend`; ortak yardımcılar `ortak.py`, kulak pozları `sarkik.py`),
  `katman4.py` çizer; verilen eşyalar sahneden silinip yeniden kurulur.
  - Kulaklık: bant kulakların önünden geçer; kabuk kafanın **yüzey normaline** göre
    oturur (sabit açıyla yastık bir kenardan havada kalıyordu).
  - Bere: kulaklar **gizli** (kullanıcı istedi; yana sarkık ve içinden çıkan kulak
    denendi). Gövde kafadan değil elipsoitten: kafayı şişirince tepe sivri, şapka gibi
    duruyordu. Katlanmış fitilli ağız kafaya yapışık bant (simit kenar siper gibiydi),
    kabarık ponpon. Bere ve kep katmanında perçem gizlenir.
  - Taç: büyük halka kafanın tepesine oturur, kulaklar **içinden** çıkar (kullanıcı
    istedi); kulaklar biraz içe toplanıp incelir (`TAC_KULAK`). Tepeler uzun (kısa
    tepeli taç tasma gibiydi).
  - Taban ekli eşya her eklendiğinde Sigma birleşimi de çizilir (`katman_sigma2.py`).
- **Sigma Rabi** (kullanıcı istedi, 2026-10-31): boyun yuvası; katmanı altın Kuba
  zinciri + "R" kolye (`sigma.png`), yüz ve duruş tabanda (`taban: 'sigma'`).
  Gözler ve kaşlar renk dokusuna boyalı (önden düz yansıtma, `rest_pos` x/z →
  2048'lik doku); Sigma yüzü dokunun kopyasına çizilir (`sigma_doku.py`: yarı
  kapak, kirpik çizgisi, sol kaş çatık, sağ kalkık). Doku pikselleri **yerinde**
  değiştirilir: tüyler de aynı dokudan renk alıyor, yalnız yüz malzemesinde
  değiştirince kaş tüyün altında eski hâliyle kalıyordu. Ağız: `X` (kapalı) +
  `gulumse` yalnız sağ yarıda (sırıtış). Duruş (kullanıcı istedi, 2026-10-31):
  kameraya hafif dönük (kök +18°), sağ el çene hattının altında ("jawline"), baş
  22° yukarı; "eller belde" eli bozuk gösterdiği için bırakıldı. El bükülebilsin diye
  yalnız bu sahnede `bilek.R` kemiği var (`sigma_poz.py`: `cene_goster`, `bilek_ekle`).
  Duruş değiştiği için Sigma `durus: true`: öbür eşyalar `<id>-sigma.png`
  katmanını kullanır (`kep-sigma.png`…); yeni eşya eklenince onun Sigma katmanı da
  çizilir. Taban ekleri birleşir: kep + Sigma = `rabi-sigma-kep.png` (`tabanYolu`,
  `tumTabanlar`). Kaynak `rabi_sigma2.blend`, kurulum `sigma2_kur.py`, katmanlar
  `katman_sigma2.py`.
- **Gözlük ve bahçıvan botu yok** (kullanıcı kaldırttı, 2026-10-31: "sevmedim"); geri
  getirme. Kimlikleri (`gozluk`, `bot`) eski kayıtta kalabilir, `giyilenleriCoz` düşürür.
  Gözlük maddesindeki dersler güneş gözlüğü için de geçerli.
- Eşyalar ücretsiz, para birimi yok (kullanıcı denemek için istedi, 2026-10-30).
  Jeton eklenecekse önce [basarimlar.md](basarimlar.md) → "Seviye, havuç, mağaza yok".

## Uygulama ikonu

- Tek kaynak `assets/ikon/rabi-ikon-kaynak.png` (1024 kare, tavşanın kafası ve çene altındaki
  gövde şeridi dahil, düz turuncu zemin; 1. tur A adayı olduğu gibi: kullanıcının görselinden
  x300 y100, 1000 px kırpım, 1024'e ölçekli; gövde silinmedi, yeniden kırpılmadı). Üretici `scripts/ikon-uret.mjs` (`sharp`, `devDependencies`te);
  `public/icon-*.png`, `android/.../mipmap-*` ve iOS `AppIcon-512@2x.png` oradan.
  Çıktılar depoda, **elle düzenlenmez**; ikon değişecekse kaynak PNG değişir.
  İkon uygulama içindeki maskottan (`public/tavsan-*.png`) **bağımsız**: oradaki
  kırpım değişirse ikon etkilenmez.
- İkonda **gövde görünmez**: yalnız kafa. Yeni kaynakta da çene altı zemin rengi olmalı.
- Zemin rengi kaynağın köşelerinden örneklenir (≈ rgb(177, 80, 37)). Uyarlanabilir
  ikonda arka plan (`mipmap-*/ic_launcher_background.png`) bu düz renk, ön plan
  kaynak görsel; kaynağın kenarı zemin rengiyle aynı, dikiş görünmez.
- **Kadraj kuralı: küçültme yok.** Kaynak kadrajı (kulak uçları üst kenara, yanaklar yan
  kenarlara, çene alt kenara yakın) ikonun kendisidir; kullanıcı büyük kafa istiyor,
  "güvenli alan için küçültüp etrafına turuncu boşluk bırakma" reddedildi (2. tur).
  Kadraj kullanıcının referansına göre ölçüldü (kafa genişliği ~%63, kulak üstü boşluğu
  ~%2,5, çene alta ~%3 mesafede).
- Android uyarlanabilir: 108 birimlik katmanın ortadaki 72 birimi (%66,7) görünür;
  ön planda kaynak tuvalin %66,7'si boyunda ortalanır, yani görünen alan kaynağın
  **tamamı**. Daire maskeli launcher'larda kulak uçları ve yanak kenarları biraz
  kesilir (kabul edildi). Web `icon-maskelenebilir-512.png`: kaynak tuvalin %80'i
  boyunda zemin üstüne ortalanır (görünen alan %80).
- `ic_launcher.png` ve `ic_launcher_round.png` (daire maskeli) kaynağın tamamı.
  `icon-192/512.png` kaynağın tamamı, squircle maskeli, köşeler saydam. iOS ikonu
  `AppIcon-512@2x.png` (1024) köşesiz ve **alfasız**. `public/icon.svg` yok.
- Mağaza dosyaları (Play 512 32-bit, App Store 1024 alfasız) depoya girmez; aynı
  kaynaktan üretilir.
