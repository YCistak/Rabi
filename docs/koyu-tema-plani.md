# Koyu tema — uygulama planı

Durum: **plan** (2026-10-28). Emre "yap" deyince başlanır. Renk takımı onaylı
(sıcak koyu kahve); taslak `Downloads/rabi-koyu-tema-taslak.html`, ilk değerler
`Downloads/rabi-koyu-tema-renkler.css`.

## Kararlar (verildi)

- Zemin sıcak koyu kahve `#1A1612`, kart `#25201B`, soluk yüzey `#312A24`, yazı
  `#F2EBE4`, soluk yazı `#AB9F94`.
- Turuncu dolgu aynı (`#D9622F`); turuncu **yazı** koyuda bir kademe açık (`#F08B5C`).
- Ders renkleri her iki temada aynı ailede; yalnız tonlar koyuya uyarlanır.
- **Üç seçenek: Telefona uy · Açık · Koyu** (Emre, 2026-10-28). "Telefona uy"
  telefonun açık/koyu modunu izler ve telefon değişince Rabi de anında değişir
  (Instagram'ın iPhone'daki davranışı). **Varsayılan "Telefona uy"**; tema hiçbir
  yerde sorulmaz, yalnız Ayarlar'dan değiştirilir. Android ve iOS'ta aynı.
- Neden üç: iPhone'un yerli açılış ekranı uygulamanın ayarını okuyamıyor, telefonun
  modunu izliyor. "Telefona uy" seçen hiç yanlış renk görmez; kısa an yalnız
  telefonundan **farklı** temayı bilerek seçende kalır (Faz 6).
- Tercih ile görünen tema ayrı şeylerdir: kayıtta **tercih** (`'sistem' | 'acik' |
  'koyu'`), `<html data-tema>`'da her zaman **çözülmüş** tema (`'acik' | 'koyu'`).
  CSS yalnız çözülmüş temayı bilir.

Emre'nin cevapları (2026-10-28):

1. **Açılış ekranı temayı izler:** koyu görünen kullanıcı koyu açılış görür
   (yerli açılış + ders makarası). İlk yükleme dahil: kayıt yokken tercih
   "Telefona uy" sayılır, telefon koyuysa ilk açılış da koyu.
2. **Tema hiç sorulmaz** (Emre, 2026-10-28 — önceki "kurulumda sor" kararının
   yerine): uygulama "Telefona uy" ile gelir; Ayarlar → Görünüm'den **Telefona uy ·
   Açık · Koyu** seçilir. Kurulum akışı değişmez (karşılama → isim → tanışma → …).
   Android ve iOS'ta birebir aynı davranış.
3. **Yanlış soru fotoğrafları kısılmaz**, olduğu gibi görünür.
4. **iOS klavyesi** koyu temada koyu.
5. **Aylık özet şimdilik arayüzden kaldırılır** (ayrı PR, koyu temadan bağımsız —
   Faz 0). Kod, tasarım ve arka planda toplanan veri yerinde kalır; ileride açılır.
   Bu yüzden paylaşım afişi koyu tema kapsamı dışında (gizli, dokunulmaz).

---

## Genel ilkeler (her PR'da geçerli)

- `dark:` sınıfı **kullanılmaz**. Her renk tema değişkeninden gelir; koyu tema
  yalnız değişkenlerin ikinci değer takımıdır (`:root[data-tema='koyu']`).
- **Yazı rengi ile dolgu rengi ayrı değişkendir.** Açık temada aynı ton ikisine de
  yetiyordu (`--primary`, `-koyu` ders tonları, `--success`); koyuda yazı açık,
  dolgu koyu olmalı. Dolgu olarak kullanılan her yer `-dolgu` / `-dolu` adını alır.
- **`color-mix` ve `min()` yeni değişkende kullanılmaz** (eski WebView'de düşüyor);
  her ton elle yazılır.
- Dolgu üstündeki beyaz yazı/ikon `--dolgu-yazi` (iki temada da beyaz) olur, `#fff`
  yazılmaz.
- Kontrast: gövde yazısı ≥ 4.5:1, büyük yazı ve ikon ≥ 3:1 — **iki temada da**.
- Yeni renk eklerken **iki bloğa birden** değer yazılır (kural dosyasına girer).
- Kayıtlı anahtarlar yeniden adlandırılmaz. **`rabi-tema` anahtarı kullanılmaz**:
  `ESKI_ANAHTARLAR`da, açılışta silinir.
- Puan/sıralama tahmin uyarısı koyuda da görünür ve kapatılamaz kalır.

## PR sırası

Her PR ayrı branch, master'dan; commit öncesi pull; her PR tek konu.

| PR | Konu | Görünüm değişir mi | Risk |
| --- | --- | --- | --- |
| 0 | Aylık özeti arayüzden gizle (koyu temadan ayrı) | Evet (şerit/ekran kalkar) | Düşük |
| 1 | Sabit renk temizliği + renk denetimi testi | Hayır | Düşük |
| 2 | Tema altyapısı + genel koyu takım (seçenek gizli) | Yalnız gizli bayrakla | Orta |
| 3 | Ders renkleri + 22 oyun | Yalnız koyuda | Orta |
| 4 | Harita + Konu Anlatımı (deste, yoklama, kapanış, kart görselleri) | Yalnız koyuda | Yüksek |
| 5 | Kalan ekranlar, pencereler, turlar + **Ayarlar'da seçeneği açma, varsayılanı "Telefona uy" yapma** | Evet | Orta |
| 6 | Yerli taraf: koyu açılış, durum çubuğu, odak engel katmanı, iOS klavye | Evet | Yüksek |

PR 0 ötekilerden bağımsız; ilk o açılabilir. PR 5 ile PR 6 **aynı sürümde** çıkmalı:
koyu seçen kullanıcı açılışta beyaz yerli ekran görmesin.

Seçenek kullanıcıya **PR 5'te** açılır; o zamana kadar koyu tema yalnız geliştirici
bayrağıyla (`localStorage` → `rabi-ayarlar.tema = 'koyu'`) görülür. Yarım kalmış
koyu ekran kullanıcıya hiç gitmez.

---

## Faz 0 — Aylık özeti arayüzden gizle (PR 0, ayrı konu)

Amaç: kullanıcı aylık özeti hiçbir yerde görmesin; kod, tasarım ve veri toplama
dursun, tek bir bayrakla geri açılabilsin.

- `lib/ozet.ts`'e tek bayrak: `AYLIK_OZET_ACIK = false` (yorumda: kullanıcı
  kaldırttı, 2026-10-28; geri açmak için `true`).
- **Gizlenen giriş noktaları** (bayrak kapalıyken çizilmez/çalışmaz):
  - Ana Sayfa'daki özet şeridi/kartı: `app-shell.tsx` → `AnaSayfa`'ya giden
    `ozetHazir`, `ozetYetersiz`, `sonrakiOzet`, `onOzetAc` (bayrak kapalıyken
    `false`/`null`; `ana-sayfa.tsx` zaten boş değerde çizmiyorsa ona dokunulmaz).
  - Açılışta kendiliğinden açılan özet katmanı: `AylikOzetEkrani` (`ozetAcik`),
    bekleyen ay mantığı (`bekleyenAy` → bayrak kapalıyken `null`).
  - Başka giriş varsa (Ayarlar, bildirim, rozet, tanıtım turu `data-tanitim`
    hedefi, hatırlatma metni) taranıp aynı bayrağa bağlanır.
- **Yerinde kalanlar:** `components/ekranlar/aylik-ozet.tsx`, `lib/ozet.ts`,
  `lib/ozet-gorsel.ts`, `lib/paylas.ts`, tasarım dosyaları, testler
  (`lib/ozet.test.ts` geçmeye devam eder).
- **Veri toplanmaya devam eder:** `aylikOzetler` arşivinin her ay kapanışta
  doldurulması (`arsivdeEksikAylar` etkisi) bayrağa bağlanmaz; `ozetGorulen` de
  durur. Yedeğe girmeye devam eder (`Yedek.aylikOzetler`). Anahtarlar silinmez,
  `ESKI_ANAHTARLAR`a taşınmaz.
- `ozetGorulen` bayrak kapalıyken **yazılmaz**: özet geri açıldığında görülmemiş
  aylar doğru hesaplansın.
- Kurallar: `docs/kurallar/aylik-ozet.md` başına "Arayüzden gizli (kullanıcı
  istedi, 2026-10-28); kod ve veri duruyor, bayrak `AYLIK_OZET_ACIK`" yazılır;
  `hareket-ve-gecisler.md`'deki "aylık özet" anışı yerinde kalır.
- Doğrulama: typecheck + test; ay başı tarihiyle (saat taklidi) uygulama açılır,
  özet katmanı ve şerit çıkmaz; `rabi-aylik-ozetler` kaydının yine yazıldığına
  bakılır.

---

## Faz 1 — Sabit renk temizliği (PR 1)

**Uygulandı (2026-10-29), plandan farkları:**
- `--dolgu-yazi` açılmadı: dolgu üstündeki `text-white` ve yarı saydam beyazlar
  (`bg-white/20`…) iki temada da doğru, serbest bırakıldı. Siyah perdeler
  (`bg-black/40`) ve gölgeler de öyle.
- Açılan adlar: `--primary-derin`, `--ikincil-dolu`, `--success-dolu`,
  `--danger-dolu`, `--warning-dolu`, `--konu-<ders>-dolgu`, `--ters`/`--ters-yazi`
  (Rabi balonu, kısa bildirimler), `--perde`, `--karartma`, `--yuzey-saydam`,
  `--maskot-hale(-dis)`, `--nokta-desen`, `--nokta-pasif`, `--patika-hale`,
  `--kapanis-kart`, `--primary-soft-yari/-sifir`, `--sahne-cerceve-soluk`,
  `--sahne-kapat-cizgi`.
- Koruma: `lib/renk-denetimi.test.ts` (izinli satırlar ve muaf dosyalar içinde).
- Ekran karşılaştırma betiği depoya girmedi; 12 ekran önce/sonra piksel piksel aynı.
- Bilinen tek fark: Yanlış Banka'nın koyu "tekrar" düğmesinde yazı `#fff` →
  `--ters-yazi` (#f8f8f7), gözle seçilmez.

Amaç: koyu temaya dokunmadan, doğrudan yazılmış her rengi değişkene bağlamak.
Açık temada **tek piksel değişmemeli**.

### Yeni değişkenler (açık değerleri bugünküyle birebir)

- `--dolgu-yazi` (#fff) — dolgu üstündeki yazı/ikon.
- `--yuzey-saydam` — `bg-white/80` ve benzeri yarı saydam beyaz kutular
  (oyun ders kartlarındaki emoji kutuları).
- `--ikincil-dolu` — `bg-ikincil` dolguları (Oyun Bankası "Oyna").
- `--success-dolu`, `--danger-dolu`, `--warning-dolu` — semantik dolgular
  (haritadaki yeşil kitap `--success` ile boyanıyor).
- `--konu-<ders>-dolgu` (8 ders) — bugün `bg-konu-<ders>-koyu` ile yapılan dolgular
  (oyunlardaki Onayla gibi). Açıkta değeri `-koyu` ile aynı.
- `--perde` — pencere arkasındaki karartma (`bg-black/40` vb.).
- `--hale` — haritadaki kitabın beyaz halesi ve benzeri beyaz parıltılar.

### Dosyalar (tarama sonucu, adet = sabit renk sayısı)

Tailwind sabitleri (`bg-white`, `text-gray-…`, `bg-black/…`, `text-red-…`):
`soru-cizimi` 18, `geri-sayim` 14, `yanlis-banka` 11, `konu/hizli-kontrol` 9,
`ui` 8, `konu/soru-sahnesi` 8, `oyunlar` 6, `oyun-ornekleri` 5, `yapilacaklar` 5,
`oyun-periyodik` 5, `oyun-bolunme` 5, `kaynak-takibi` 5, `takvim` 4,
`oyun-tanitim` 4, `hata-bildir` 4, `konu-haritasi` 4, `istatistik` 4,
`ana-sayfa` 4, `oyun-tus-takimi` 3, `oyun-sikki` 3, `oyun-kabuk` 3,
`konu/konu-ozeti` 3, `oyun-koklu` 3, `konu-takibi` 3, `aylik-ozet` 3, ve 1–2
adetlik ~15 dosya (`oyun-surukle-sirala`, `oyun-kaydirma-karti`, `kurulum-hazir`,
`kisa-mola`, `kart-destesi`, `harita-secimi`, `oyun-harita`, `oyun-bankasi`,
`ayarlar`, `tarih-secici`, `tanitim-sorusu`, `oyun-geri-sayim`, `odak-daveti`,
`kurulum`, `deste-basligi`).

Elle yazılmış hex/rgba (`.tsx/.ts`): `aylik-ozet` 63, `lib/ozet-gorsel` 17,
`konu-haritasi` 13, `yanlis-banka` 6, `secici` 4, `kart-destesi` 4,
`hizli-kontrol` 4, `harita-secimi` 4, `soru-cizimi` 3, `pomodoro` 3,
`ana-sayfa` 3, `kisa-mola` 2, `bottom-nav` 2, `acilis` 2, `layout` 2, ve tekli
~12 dosya.

`globals.css` içindeki sabitler: `.sahne` (`--sahne-*`), kapanış (`--kapanis-*`),
`.deste-*`, cam menü (`--cam-*`), noktalı zeminler (`radial-gradient(rgba(24,23,22,…))`),
gölgeler (`rgba(27,26,25,…)`, `rgba(58,38,28,…)`).

### Bilerek sabit kalanlar (izin listesi)

- `components/ekranlar/aylik-ozet.tsx` ve `lib/ozet-gorsel.ts` — Faz 0 ile gizli;
  koyu tema kapsamı dışında, olduğu gibi kalır (geri açılınca ayrıca ele alınır).
- `soru-cizimi` **kalem paleti** ve yanlış soru **fotoğrafı** — temadan bağımsız,
  fotoğraf kısılmaz.
- `acilis.tsx` → `ZEMIN` sabiti kalkar, `ZEMIN_ACIK` / `ZEMIN_KOYU` olur (Faz 6).
- `lib/kamera.ts`, `lib/ocr-isci.ts` — görüntü işleme, renk değil.
- Konfeti renkleri — her zeminde okunur.

### Koruma: renk denetimi testi

`lib/renk-denetimi.test.ts`: `components/` ve `app/` altında `bg-white`,
`text-black`, `text-gray-*`, `#xxxxxx`, `rgba(` arar; izin listesindeki dosya/satır
dışında bulursa düşer. Yeni sabit renk sessizce geri gelemez.

### Doğrulama

- Önce/sonra ekran görüntüsü karşılaştırması (taslakta kullanılan puppeteer betiği
  `scripts/tema-ekranlari.cjs` olarak dev aracı yapılır, derlemeye girmez): ~30
  ekran, piksel farkı **sıfır** olmalı.
- `npm run typecheck`, `npm run test`.

---

## Faz 2 — Tema altyapısı (PR 2)

### Kayıt

- `Ayarlar.tema: 'sistem' | 'acik' | 'koyu'` (`lib/types.ts`).
- `ayarlariNormalize`: alan yoksa ya da tanınmıyorsa `'sistem'` — yeni kurulum,
  bozuk değer, eski yedek **ve eski kullanıcı** (Emre, 2026-10-28: eskiler de
  "Telefona uy"a geçer). Telefonu koyu modda olan eski kullanıcı güncellemeden sonra
  Rabi'yi koyu görür; bu **sürüm notuna** ve `CHANGELOG.md`'ye yazılır ("Koyu tema
  geldi: Rabi artık telefonunun temasına uyar; Ayarlar → Görünüm'den
  değiştirebilirsin"). Normalize tek kural, `kurulumTamamlandi`'ya bakmaz.
- Saf çözümleyici `lib/tema.ts` → `temaCoz(tercih, telefonKoyuMu): 'acik' | 'koyu'`
  ve testi (üç tercih × iki telefon modu).
- Yedek: `Ayarlar` içinde olduğu için kendiliğinden girer; eski yedeği yükleyen
  açık temaya düşer. Test eklenir.
- "Tüm verileri sil" → "Telefona uy"a döner (beklenen).

### İlk kare (renk sıçraması olmasın)

- `app/layout.tsx` içindeki mevcut erken betik (`data-platform`'u yazan) genişler:
  `rabi-ayarlar`ı okur; tercih `'koyu'` ise ya da `'sistem'` ve
  `matchMedia('(prefers-color-scheme: dark)')` doğruysa `<html data-tema="koyu">`
  yazar. React'ten önce çalışır; kayıt yoksa ya da JSON bozuksa tercih `'sistem'` sayılır
  (telefonu izler); `try/catch` içinde.
- `AppShell` yedek olarak aynı özniteliği ayardan yazar (tercih değişince de).
- **Telefonun modu uygulama açıkken değişirse:** tercih `'sistem'` iken
  `matchMedia(...).addEventListener('change')` dinlenir, `data-tema`, `themeColor`,
  durum çubuğu stili anında güncellenir. Arka plandan dönüşte (`App` `resume`)
  bir kez daha okunur (bazı WebView'ler arka planda olay kaçırıyor).
- **WebView'in `prefers-color-scheme`'i doğru bildirmesi şart:** Android'de
  WebView bunu uygulamanın gece moduna göre bildirir — `'sistem'`de yerli taraf
  `MODE_NIGHT_FOLLOW_SYSTEM`'de olmalı (Faz 6), yoksa telefon koyuyken bile açık
  der. iOS'ta pencereye `'sistem'`de stil zorlanmaz (`.unspecified`), WKWebView
  telefonu izler.
- Viewport `colorScheme: 'light'` kalkar; `color-scheme` CSS'te temaya göre
  (`light` / `dark`) — form denetimleri, kaydırma çubuğu, tarih alanı uyar.
- `themeColor` meta etiketi tema değişince betikle güncellenir.

### Renk takımı

- `globals.css`'e `:root[data-tema='koyu'] { … }` bloğu: genel, semantik, gölge,
  Faz 1'de açılan bütün yeni değişkenler. Başlangıç değerleri onaylı taslaktan.
- **Gölge:** koyu zeminde gölge görünmüyor; `--shadow-kart` koyulaşır ve
  `golge-kart` koyuda 1 px `--kart-kenar` (çok ince, zeminden bir tık açık) alır.
  Önce kenarsız denenir, kartlar seçilmiyorsa eklenir.
- Tema değişirken bütün `transition-colors` aynı anda oynamasın: geçiş anında
  `<html>`e kısa süreli `tema-degisiyor` sınıfı (geçişleri kapatır), bir kare sonra
  kalkar.

### Kontrast testi

`lib/tema-kontrast.test.ts`: `globals.css`'in iki bloğunu okur, belli çiftlerin
(yazı/zemin, yazı/kart, soluk yazı/kart, turuncu yazı/kart, dolgu-yazı/dolgu,
her ders `-koyu`/zemin ve `-koyu`/kart, `-dolgu`/`--dolgu-yazi`) kontrastını
iki temada hesaplar; eşik altını düşürür.

### Kurallar (bu PR'da güncellenir)

- `AGENTS.md` Tasarım: "Tek tema" maddesi → "İki tema, renkler yalnız değişkenden;
  yeni renk iki bloğa birden; yazı/dolgu ayrı değişken; `dark:` yok".
- Yeni `docs/kurallar/tema.md` (dizine eklenir): değişken adlandırma, izin listesi,
  ilk kare betiği, kontrast eşikleri, yerli taraf.
- `CONTRIBUTING.md`: "koyu tema yok" cümlesi.
- `globals.css` başlık yorumu ("Koyu tema yok — bilerek"), `--yzm`/`--yzm-kart`
  yorumu (ayrım yeniden anlam kazanır), `values-night/colors.xml` yorumu,
  `layout.tsx` viewport yorumu.

---

## Faz 3 — Ders renkleri ve oyunlar (PR 3)

### Ders tonları

- 8 ders × 6 ton (zemin, kenar, koyu, çubuk, ok, dolgu) = 48 değer; taslaktaki
  değerlerden başlanır, kontrast testinden geçer.
- Her ders koyuda da **tek bakışta tanınmalı**: Türkçe sarı ile Tarih kahve, Kimya
  turuncu ile Rabi turuncusu, Coğrafya turkuaz ile İngilizce yeşil-mavi yan yana
  konup karışmadığına bakılır.
- Eski aileler (`yzm`, `isl`, `edb`, `cog`, `trh`, `byl`, `fzk`, `dil`) ve `-kart`
  karşılıkları: koyuda `-kart` zeminden bir tık açık olur (bugün aynı değere
  çözülüyor; koyuda ayrım anlam kazanır).
- `--ayar-*` (Ayarlar simge kutuları) 6 çift.
- `--gorev-*` (Yapılacaklar 12 ton): koyuda bir kademe açık. **Kontrol:** görev
  kaydında rengin adı mı (`'mavi'`) yoksa hex mi tutuluyor? Ad ise sorun yok; hex
  ise okurken eşleme tablosu gerekir (kayıt değişmez).

### Oyun kabuğu

- Ders zemininde genel kahve kart çamurlaşıyor: `oyun-kabuk` (ve ders zeminli tam
  ekranlar) `--card`, `--muted`, `--border`'ı o dersin tonlarıyla **yerel olarak**
  ezer (`style` ile değişken; yeni sınıf değil). Böylece tuşlar, soru kartı, cevap
  kutusu kendiliğinden doğru renge döner.
- Ortak parçalar: `oyun-tus-takimi`, `oyun-sikki` (doğru/yanlış/seçili hâlleri),
  `oyun-kaydirma-karti`, `oyun-surukle-sirala`, `oyun-geri-sayim`, `oyun-tanitim`,
  `mod-secimi`, `oyun-ornekleri`, tur sonu ekranı, Oyun Bankası, `oyunlar` listesi.
- Doğru/yanlış geri bildirimi (yeşil/kırmızı parlama, sarsıntı) koyu zeminde
  yeterince belirgin mi — semantik `-soft` tonları ayarlanır.

### Tek tek oyunlar (22) — çizimli olanlara ayrı bakılır

- **SVG/çizim içerenler (en riskli):** `oyun-harita` (Türkiye haritası, il dolguları,
  `.isaretli-il`), `oyun-izohips` (eş yükselti çizgileri), `oyun-ucgen`,
  `oyun-aci`, `oyun-trigonometri` (geometri çizgileri), `oyun-periyodik` (tablo
  hücreleri, grup renkleri), `oyun-hucre` (hücre çizimi), `oyun-iklim` (grafik).
  Çizgi/dolgu renkleri değişkene bağlanır; harita/hücre gibi "gerçek renkli"
  çizimler koyuda da okunur kalmalı.
- **Metin ağırlıklılar:** `oyun-islem`, `oyun-koklu`, `oyun-bolunme`, `oyun-formul`,
  `oyun-tepkime`, `oyun-biyoloji`, `oyun-edebiyat`, `oyun-yazim`, `oyun-ses`,
  `oyun-soz`, `oyun-oge`, `oyun-kavram`, `oyun-sirala`, `oyun-tuzak`,
  `oyun-antlasma`, `oyun-anlatim` — kabuk düzelince çoğu kendiliğinden düzelir;
  her birine bir kez bakılır.

---

## Faz 4 — Harita ve Konu Anlatımı (PR 4)

### Harita (`konu-haritasi.tsx`, `lib/konu/harita-temasi.ts`)

- Sayfa zemini zaten derse göre değişmiyor; derse göre değişen: üst kartın simge
  dairesi, bölüm bandı, zemine serpili simgeler — hepsi `--konu-<ders>`'ten, Faz 3
  ile düzelir.
- Patika (`--patika-*` 14 değişken): yol, geçilen yol, kilitli kitap, şerit, sandık
  ve altın, simge mürekkebi — koyu değerler taslaktan.
- Kitap içi sabitler (13 adet): beyaz hale `rgba(255,255,255,.5)` → `--hale`;
  sırt gölgesi `rgba(0,0,0,.22)`; kapak parlaması `color-mix(… #fff)` ve
  `color-mix(… #9dd08a)` → elle yazılmış `--kitap-*` tonları (color-mix kalkar);
  kitap numarası `#fff` → `--dolgu-yazi`.
- Pusula, sınıf/ders seçici (`harita-secimi`), konu kartı penceresi (`KonuKarti`),
  kilit onayı (`Onay`).

### Konu Anlatımı

- Deste (`.deste-zemin`, `.deste-karti`, `.deste-not`, `kart-destesi.tsx`): kart
  "kâğıt" görünüyor; koyuda kâğıt hissi korunur ama parlak beyaz olmaz.
- **Kart görselleri** (`Gorsel` türleri: grafik, tablo, şema, molekül, harita…):
  çizim renklerinin envanteri çıkarılır; sabit siyah çizgi/yazı varsa değişkene
  bağlanır. İçerik dosyalarına (`lib/konu/...`) renk yazılmışsa ayrıca listelenir.
  **En geniş tarama bu fazda.**
- Yoklama sahnesi (`.sahne`, `--sahne-*`, `soru-sahnesi.tsx`): amber çerçeve,
  doğru/yanlış gölgeleri.
- Kapanış/özet (`--kapanis-*`, `ozet-zemin` kareli defter, `konu-ozeti.tsx`):
  dersin rengiyle; çizgi katmanı koyuda daha soluk.
- `kisa-mola`, `hizli-kontrol`, `deste-basligi`.

---

## Faz 5 — Kalan ekranlar ve seçeneği açma (PR 5)

Her ekran koyuda açılıp bakılır; liste:

- **Ana Sayfa:** `geri-sayim` (14 sabit), başlık tavşanı (kırpılmaz), günün hâli,
  kutucuklar, Araçlar/Oyunlar ızgarası.
- **Araçlar** listesi, `olcekli-emoji` kutuları.
- **Pomodoro:** saat halkası (`pomodoro-saati`), deneme provası, `odak-kurulum`,
  `odak-daveti`.
- **Yapılacaklar** + ortak `takvim` + `tarih-secici`.
- **Soru Takibi** (`SayiKutusu`).
- **Denemeler**, `yeni-deneme`, şablonlar, seviye tespit.
- **Yanlış Banka** + `soru-cizimi`: araç çubuğu temaya uyar, kalem paleti ve
  fotoğraf olduğu gibi kalır.
- **İstatistik:** grafik çizgileri, ızgara (`--grid`), eksen yazıları.
- **Konu Takibi**, **Kaynak Takibi** (öneri listesi açılır kutusu).
- **Okul / Devamsızlık**, **Hedef / Sıralama** (tahmin uyarısı görünür).
- **Rozetler** (kademe renkleri, kilitli rozet, `rozet-bildirimi`, hale).
- **Aylık özet:** Faz 0 ile gizli, bakılmaz.
- **Ayarlar**, **Yasal**, **Geri bildirim / hata bildir** formları.
- **Kurulum** ve `kurulum-hazir`: telefonu koyu olan yeni kullanıcı kurulumu
  **koyuda** görür — bütün adımlar (karşılama, isim, tanışma, soru adımları, hazır
  ekranı, tanıtım sorusu) koyuda gezilir. Kurulumda tema adımı **yok**.
- **Tanıtım turları:** vurgu deliği ve karartma perdesi — koyu zeminde karartma
  vurguyu ayırmıyor; perde ve vurgu halkası koyuda ayarlanır.
- Ortak parçalar: pencereler/onay (`--perde`), alt sayfa, bildirim balonu,
  `secici` tekerleği (kenar soluklaştırma gradyanı zemine bağlanır), boş durumlar,
  yükleniyor iskeletleri.
- **Alt menü:** Android donuk menü; **iOS cam menü** (`--cam-*`, `lib/cam-menu.ts`
  arkayı örnekleyip `data-koyu` yazıyor — koyu temada hep koyu cam değerleri
  devreye girer mi, test ve iPhone'da deneme).
- **Maskot görselleri:** her `tavsan-*.png` pozu koyu zeminde bir kez açılır; kenarda
  açık hale (beyaz kırpıntı) olan varsa listelenir, `maskot-ve-ikon.md` kuralına
  göre yeniden kesilir.

### Ayarlar'da seçenek

- "Görünüm" satırı: **Telefona uy · Açık · Koyu** üç parçalı seçici (yanındaki
  satırlarla aynı dil, sade). Değişince anında uygulanır, kayda ve yerliye yazılır.
  "Telefona uy" seçiliyken altında soluk küçük not: o an hangisinin görüldüğü
  ("Şu an: Koyu").
- `kurulum-ve-ayarlar.md` güncellenir.

## Kurulumda tema sorulmaz

Emre'nin son kararı: kurulumda tema adımı **eklenmez**. `components/kurulum.tsx`
ve `kurulum-ve-ayarlar.md`'deki "Sıra" maddesi değişmez. Uygulama ilk açılıştan
itibaren telefonun modunda gelir; kullanıcı istemezse Ayarlar → Görünüm'den
değiştirir.

---

## Faz 6 — Yerli taraf (PR 6)

### Açılış ekranı temayı izler (Emre'nin kararı)

Koyu görünen kullanıcı açılışı baştan sona koyu görür; ilk yükleme dahil (kayıt
yokken tercih "Telefona uy"). Açılış zemini artık **iki takım**, her takım dört yerde birlikte değişir
(AGENTS.md kuralı iki takıma genişler):

| Yer | Açık | Koyu |
| --- | --- | --- |
| `globals.css` `--background` | `:root` | `:root[data-tema='koyu']` |
| `acilis.tsx` | `ZEMIN_ACIK` | `ZEMIN_KOYU`, `data-tema`'ya göre seçilir |
| Android | `values/colors.xml` `acilis_zemin`, `uygulama_zemin` | `values-night/colors.xml` (bugün bilerek açığın kopyası → koyu değerler) |
| iOS | `LaunchScreen.storyboard` + `ios.backgroundColor` | renk varlığının koyu varyantı + yerli pencere zemini |

Ayrıca açılıştaki "RABI" yazısı ve makara renkleri koyu zeminde okunacak tonları
alır (`acilis.md` kurallarına uyarak; varış noktası ölçülür, yazılmaz).

**Seçimin yerliye ulaşması:** web `ayarlar.tema` değişince (kurulum adımı,
Ayarlar, yedek yükleme, "verileri sil") mevcut yerli eklenti üstünden
`SharedPreferences` (Android) / `UserDefaults` (iOS) içine `tema` yazılır. Yerli
taraf açılışta **bunu** okur — web kaydını okuyamaz.

**Android:**
- `MainActivity`'de `super.onCreate`'ten **önce** (EdgeToEdge ile aynı yerde):
  kayıttaki tercihe göre Android 12+ `UiModeManager.setApplicationNightMode`
  (sistem açılış ekranı da bunu izler, sonraki soğuk açılıştan itibaren), altında
  `AppCompatDelegate.setDefaultNightMode`:
  - `'acik'` → `MODE_NIGHT_NO`, `'koyu'` → `MODE_NIGHT_YES`,
  - `'sistem'` → `MODE_NIGHT_AUTO` / `MODE_NIGHT_FOLLOW_SYSTEM`,
  - kayıt yok → `MODE_NIGHT_FOLLOW_SYSTEM` (ilk yükleme telefonu izler).
- Böylece `values-night` yalnız uygulamanın tercihiyle devreye girer; "Açık"
  seçende telefonun gece modu etkilemez, "Telefona uy"da etkiler.
- **Telefon modu değişince aktivite yeniden kurulmamalı** (WebView yeniden yüklenir,
  açılış tekrar oynar, oyun turu kaybolur): manifestte `MainActivity`
  `android:configChanges` içinde `uiMode` olduğu doğrulanır (Capacitor şablonunda
  genelde var); `onConfigurationChanged`'de yalnız sistem çubukları güncellenir,
  web tarafı `matchMedia` olayıyla kendini çevirir.
- **WebView kendi kendine karartmasın:** gece modunda Android WebView sayfayı
  "algoritmik karartma" ile otomatik koyultabiliyor — renklerimizin üstüne ikinci
  bir karartma biner. `WebSettingsCompat.setAlgorithmicDarkeningAllowed(false)`
  (eski sürümlerde `FORCE_DARK_OFF`) açıkça kapatılır; `prefers-color-scheme`
  yine doğru bildirilir.
- Tema değişince `setApplicationNightMode` aktiviteyi yeniden kurabilir — WebView
  yeniden yüklenip açılış tekrar oynamamalı. Önce denenir; yeniden kuruyorsa
  çalışırken yalnız kayıt yazılır, yerli tema **bir sonraki açılışta** uygulanır
  (web zaten anında değişti). `configChanges="uiMode"` manifestte varsa kontrol.
- Odak engel katmanı ve bildirim aynı `values-night` takımını görür — engel
  katmanı koyuda kendiliğinden koyu olur (aşağıda).

**iOS:**
- `LaunchScreen.storyboard` durağan; uygulamanın kaydını okuyamaz, yalnız sistemin
  görünümünü izler. Çözüm: `Info.plist`'teki `UIUserInterfaceStyle = Light`
  kaldırılır, açılış zemini açık/koyu varyantlı **renk varlığı** olur; uygulama
  açılınca `AnaDenetleyici` pencereye tercihe göre `overrideUserInterfaceStyle`
  yazar: `'acik'` → `.light`, `'koyu'` → `.dark`, `'sistem'` → `.unspecified`
  (telefonu izler). Klavye de buradan doğru renkte açılır. Kayıt yoksa `.unspecified`.
- **"Telefona uy"da boşluk yok:** yerli açılış, WebView ve uygulama üçü de telefonu
  izler — Instagram gibi.
- **Kalan küçük boşluk** yalnız telefonundan farklı temayı **bilerek** seçende:
  uygulama tamamen kapalıyken açılırsa yerli açılışın ilk kesrinde telefonun rengi
  görünür, hemen ardından ders makarası doğru temada başlar. Arka plandan dönüşte
  olmaz (iOS son ekran görüntüsünü gösterir). Emre kabul etti; gerekirse sonradan
  turuncu (temasız) yerli açılışla kapatılabilir.
- `capacitor.config.ts` → `ios.backgroundColor` WebView arkası; koyuda yerli kodla
  pencere/WebView zemini koyuya çekilir (beyaz kenar görünmesin).

**Doğrulama (cihazda şart):** ilk yükleme telefon açık ve koyuyken (açılış ve
kurulum telefonun modunda), her tercihi
seçip uygulamayı öldürüp açma, Ayarlar'dan tercih değiştirip yeniden açma, arka
plandan dönüş, telefon gece modu açık/kapalı × tercih Telefona uy/Açık/Koyu
(6 durum), **uygulama açıkken** telefonun gece modunu değiştirme (oyun turu
ortasında — tur kaybolmamalı), arka plandayken değiştirip geri dönme, "verileri
sil" sonrası. Android 12 altı ve üstü ayrı.

### Durum ve gezinme çubuğu ikonları

Koyu zeminde saat/pil ikonları koyu kalırsa görünmez. Tema değişince ve açılışta
Capacitor `SystemBars`/`StatusBar` stili açık/koyu yapılır (Android + iOS).
`MainActivity`'deki `EdgeToEdge` düzenine dokunulmaz.

### Android odak engel katmanı

Engel katmanı yerli çiziliyor (`odak_zemin`, `odak_metin`, `odak_soluk`,
`odak_cip`, `odak_cizgi`). Koyu temada uygulamanın devamı gibi görünmesi için:
seçim yerli tarafa (mevcut eklenti üstünden) yazılır; servis katmanı kurarken
koyu ise koyu değer takımını kullanır. Uygulamanın gece modu (yukarıda) servis
bağlamına geçmeyebilir; geçmiyorsa servis kayıttaki temayla
`createConfigurationContext` (gece `uiMode`) üzerinden `values-night`'ı okur.
`values-night/colors.xml`'e `odak_*` koyu değerleri yazılır. `pomodoro.md`'deki
sahipsiz bildirim tuzağına dikkat; yalnız renk değişir.

### Dokunulmayanlar

- Kilit ekranı bildirimi: zaten sistem renkleri + `bildirim_amber` (iki zemine
  seçilmiş). `values-night`'a koyu takım yazılırken `bildirim_*` değerleri
  **aynı kalır** (bildirim telefonun temasında çizilir, uygulamanınkinde değil).
- iOS Live Activity / Ekran Süresi: sistem görünümünü izliyor.
- Uygulama ikonu.

### iOS klavye (karar 4: koyu temada koyu)

Açılış bölümündeki `overrideUserInterfaceStyle` ile birlikte gelir: pencere koyu
olunca klavye, yerli tarih/saat seçicileri ve paylaşım sayfası koyu açılır. Tema
çalışırken değişince pencereye anında yeniden yazılır (iOS'ta yeniden kurulum
gerekmez). Web tarafında `color-scheme: dark` giriş alanlarının da koyu
klavye istemesine yardım eder.

---

## Doğrulama (her PR sonunda + en sonda)

1. `npm run typecheck`, `npm run test` (kontrast + renk denetimi testleri dahil).
2. `scripts/tema-ekranlari.cjs` ile ~30 ekranın açık ve koyu görüntüsü; açık
   tarafta Faz 1'den beri fark sıfır.
3. Tarayıcıda 390 px telefon boyunda elle gezinti: her ekran, her pencere, bir
   oyun turu baştan sona, bir konu destesi + yoklama + kapanış.
4. Cihaz: Android APK (Emre isteyince), iOS TestFlight (sürüm yükseltilerek). Bakılacak:
   ilk yükleme telefon koyuyken (açılış + kurulum koyu), koyu açılış, durum
   çubuğu, cam menü, odak engel katmanı, klavye.
5. Tablet yerleşimi bir kez.

## Bilinen riskler ve çözümleri (özet)

| Risk | Çözüm |
| --- | --- |
| Koyu seçende açılışta beyaz parlama | Seçim yerliye yazılır; Android gece modu uygulamaya göre, iOS renk varlığı + pencere zorlaması |
| iOS yerli açılışı sistemin temasını izler | Varsayılan "Telefona uy", onda boşluk yok; Ayarlar'dan farklı tema seçende kısa an kabul |
| Telefon modu değişince aktivite yeniden kurulur | Manifest `configChanges` içinde `uiMode`, web `matchMedia` ile döner |
| Android WebView sayfayı kendi karartır | Algoritmik karartma açıkça kapatılır |
| WebView "Telefona uy"da hep açık der | Android'de `MODE_NIGHT_FOLLOW_SYSTEM`, iOS'ta `.unspecified` |
| Eski kullanıcının uygulaması güncellemeyle birden kararır | Bilerek "Telefona uy"a geçer (Emre'nin kararı); sürüm notu + CHANGELOG'da duyurulur |
| Android tema değişince aktivite yeniden kurulur | Denenir; gerekirse yerli tema sonraki açılışta |
| "Açık" seçende telefon gece modu uygulamayı karartır | Gece modu uygulamanın tercihiyle (`NO/YES/FOLLOW_SYSTEM`) |
| İlk yüklemede kayıt yok | Kayıt yoksa her yerde (betik, Android, iOS) "Telefona uy" |
| Aylık özet veri kaybı | Faz 0'da yalnız arayüz gizlenir, arşiv dolmaya devam eder |
| İlk karede yanlış tema | `layout.tsx` erken betiği `data-tema`yı React'ten önce yazar |
| Aynı renk hem yazı hem dolgu | `-dolgu`/`-dolu` değişkenleri (Faz 1) |
| Ders zemininde kahve kartlar | Oyun kabuğu `--card`'ı derse göre yerel ezer |
| Gölgeyle ayrılan kartlar seçilmez | Koyu gölge + gerekirse 1 px kenar |
| `color-mix` eski WebView | Yeni tonlar elle yazılır |
| Sabit renk geri sızar | Renk denetimi testi |
| Kontrast düşer | Kontrast testi, iki tema |
| `rabi-tema` anahtarı silinir | Tema `rabi-ayarlar` içinde |
| Eski yedek / bozuk ayar | Normalize → "Telefona uy" |
| Tema değişiminde renkler kayar | `tema-degisiyor` sınıfı geçişleri kapatır |
| Saat/pil ikonları görünmez | Durum çubuğu stili temaya göre |
| Engel katmanı açık kalır | Seçim yerliye yazılır, koyu takım |
| Tavşan kenarında beyaz hale | Pozlar tek tek kontrol, gerekirse yeniden kesim |
| Yarım koyu ekran kullanıcıya gider | Seçenek yalnız PR 5'te açılır |
| Yanlış soru fotoğrafı koyuda parlak | Bilerek kısılmaz (Emre'nin kararı) |

## Çalışma biçimi

- Alt ajanlar (AGENTS.md): PR 1'in mekanik değişimleri ve taramalar **Sonnet**,
  renk seçimi / çizim envanteri / inceleme **Opus**; efor en çok high.
- PR 1 dosya grupları birbirine dokunmadığı için paralel ajanlara bölünebilir
  (ör. oyunlar / konu / araç ekranları / ortak parçalar).
- Her PR sonunda Emre'ye taslak değil gerçek ekran görüntüsü (açık + koyu) gösterilir.
