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
- `yuz`, "normal maskot"un ölçülmüş kırpımı ve **ikonun, Android engel katmanının ve
  pomodoro bildiriminin de kaynağı**. Kırpma değişirse: `maskot-uret.mjs`in yazdığı
  sayılarla `ikon-uret.mjs` → `MASKOT` güncellenir ve `tavsan-yuz.png` kopyaları
  yenilenir: `android/.../drawable-nodpi/tavsan_yuz.png` ve
  `ios/App/KalkanGorunumu/tavsan_yuz.png` (yerli taraf `public/`i okuyamıyor).
- **Pozlar paletli PNG (256 renk, `uret`'in varsayılanı `sikistir: true`), `yuz`
  hariç**: ~60 kB yerine ~15–20 kB; `public/tavsan-*.png` toplamı ~0,93 MB. Bedeli
  yalnız üç kat büyütmede kürkte ince kumlanma.
- **`yuz` düz PNG kalır** (`sikistir: false`) ve betik onu baytı baytına aynı üretir:
  baytları değişirse ikon yeniden üretilmeli, Android ve iOS kopyaları yenilenmeli.
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
  | `cantali` | çanta kapatan | "Uygulaman hazırlanıyor" |
  | `fotografci` | fotoğraf çeken | Denemeler › kayıt yok (kâğıt fotoğrafla okunuyor) |
  | `buyutecli` | büyüteçle inceleyen | Yanlış Soru Bankası › boş |
  | `supuren` | yaprak süpüren | Oyun Bankası › boş ("iyi haber") |
  | `bitkili` | bitki sulayan | İstatistik › veri yok |
  | `haritali` | haritadan yol bulan | Harita › dersin kartları hazırlanıyor |
  | `kitapli` | kitabı inceleyen | Harita › anlatım kartı (`okuyan`ın yerine) |
  | `tahtali` | tahtaya yazan | oyun tanıtımı (nasıl oynanır) |
  | `laptoplu` | laptopta çalışan | odak daveti (Pomodoro) |
  | `kucak-acan` | kucak açan | ana sayfa › hedef tuttu (dönüşümlü) |
  | `saatli` | saate bakan | odak kilidi kurulumu |
  | `basparmak` | başparmak kaldıran | hızlı kontrol › doğru; kapanış › iyi |
  | `damgali` | onay damgası basan | kapanış › iyi |
  | `alkislayan`, `dans`, `takla` | alkışlayan, dans eden, takla atan | kapanış › harika (`sevinen` ile dönüşümlü) |
  | `gerinen`, `esneyen`, `bagdas`, `uzanan` | gerinen, ayak parmaklarına uzanan, bağdaş kuran, uzanan | deste molası (dönüşümlü) |
  | `selamlayan` | eğilerek selamlayan | aylık özetin kapanışı ("Yarın yine buradayım") |
  | `kahkaha` | kahkaha atan | yalnızca durum kafası |
  | `yapboz` | yapboz tamamlayan | bütün mini oyunlar (kullanıcı istedi): yer olan yerde sorunun üstünde ortada 96 px; dar şekilli/tuşlu oyunlarda kartın sol üst köşesinde 68 px, kulaklar kartın dışına taşar (`KoseRabisi`, `oyun-kabuk.tsx`) |
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
  - Anlamı belirsiz ruh hâlleri: çömelen, koşan, parmak ucunda yürüyen,
    emekleyen, tek ayakta denge, yüzüstü ayak sallayan, utangaç, şaşırıp sıçrayan,
    çiçek tutan, silgiyle silen. Ekran bulununca kaynağı kopyalayıp
    betiğe eklemek yeter; boşta duran poz paketi şişirir.

## Uygulama ikonu

- Tek kaynak `scripts/ikon-uret.mjs` (`sharp`, `devDependencies`te); `public/icon-*.png`
  ve `android/.../mipmap-*` oradan. Çıktılar depoda, **elle düzenlenmez**.
- Maskot `public/tavsan-yuz.png`; ölçüler kenar uzunluğuna **oran** (her yoğunluk +
  108 birimlik uyarlanabilir tuval). `icon-maskelenebilir-512.png` köşesiz, ikon
  ortadaki %80'de. Uyarlanabilir zemin PNG (`mipmap-*/ic_launcher_background.png`).
  `public/icon.svg` yok. iOS ikonu `AppIcon-512@2x.png` (1024) köşesiz ve **alfasız**.
