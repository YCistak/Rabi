# Soru Bankası

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Veri ve kayıt

- Her konu ayrı, girintisiz JSON dosyasıdır; soru sırası kalıcı kayıt dizinine dayandığı için yalnızca sona eklenir.
- Kayıt `rabi-soru-bankasi`: konu kimliği → `-`/`d`/`y` dizisi; ilk cevap kalıcı (yanlışları tekrar
  çözerken doğru, yanlışı düzeltir). Bozuk değer okunurken atılır; yedeğe isteğe bağlı girer.
- Kayıt `rabi-soru-bankasi-testler`: konu → test no (**1'den**, ekrandaki "Test 3") → son bitirilişin
  `{ sure (sn), dogru, yanlis, bos, tarih }`'i (`lib/soru-bankasi/testler.ts`, `testleriCoz` süzer).
  Yalnız "Bitir"de yazılır; yanlış tekrarı yazmaz. Yedeğe isteğe bağlı (`soruBankasiTestleri`);
  eski yedek mevcut sonuçlara dokunmaz.
- `rabi-soru-bankasi-tercih` (son mod, sayaç gizli mi, eleme ipucu görüldü mü, şık düzeni) cihaz
  tercihidir, yedeğe girmez. İçindeki `yarimSureler` eski sürümün; yalnız okunur.
- Kayıt `rabi-soru-bankasi-oturumlar` (yarım test): `konu#test` → mod, son bakılan soru ve görünüm,
  seçilen/elenen şıklar, sonra bak, pas, soru başına süre (`lib/soru-bankasi/oturum-kaydi.ts`,
  `oturumlariCoz` süzer, en çok 40, en eskisi düşer). Bitince ve "baştan başlat"ta silinir; yanlış tekrarı
  kaydedilmez; yedeğe girmez. Bir şey yapılmadan (< 15 sn, işaret yok) çıkılan test yarım sayılmaz.
- Karalamalar IndexedDB'de, **ayrı** veritabanında (`rabi-soru-bankasi-cizim`, `cizim-depo.ts`): fotoğraf
  deposu açılışta kaydı olmayanı öksüz sayıp siliyor. Yalnız son çizgiler (geçmiş değil), bir ondalık;
  test sıfırdan açılınca ve bitince silinir; "Tüm verileri sil" temizler. localStorage'a çizgi yazılmaz.
- Sorular 12'şerli testlere bölünür; zorluk sırası aktarma betiğinde kararlı biçimde kolaydan zora kurulur.
- Veri olmayan program konuları listede "yakında" görünür ve açılamaz; ad/tema sınıf
  programından türetilir, dizin yalnız veri eşlemesini taşır.
- Yeni soru partisi `scripts/soru-bankasi-aktar.mjs` ile doğrulanarak aktarılır. Her soru kod denetimi ve bağımsız kör çözümden geçmeden yayımlanmaz.

- Aktarma betiğinin dizini bütün `veri/` klasöründen kurulur; tek dersi aktarmak ötekileri düşürmez.

### Kimya ve hazır SVG şekiller

- Biyoloji de hazır SVG şekil kullanır; dosyalar `public/soru-bankasi/biyoloji/<sınıf>/`.
- Kimya önce `scripts/kimya-donustur.mjs <ham> <ara>`, sonra `soru-bankasi-aktar.mjs <ara>`. Konu kimliği ham dosyada
  yazan kimliktir ve programda birebir bulunmalıdır, tahmin edilmez. Kaynak/kazanım alanları uygulamaya girmez.
- `scripts/kimya-onay.json`: kör çözüm ve denetimden geçen **hâlin** özeti (kök, şıklar, cevap, çözüm, şekil). Soru ya da
  şekli değişirse özet tutmaz, dışarıda kalır; yeniden kör çözülmeden özet güncellenmez.
- Öncüller (I, II, III) kökte kalır, `onculler`e ayrılmaz: soru cümlesi öncüllerden sonra geliyor.
- Şekil türü `svg` (`{ yol, aciklama, en, boy }`): dosya `public/soru-bankasi/<ders>/<sınıf>/`, ekranda `<img>` (satır içi
  SVG/`dangerouslySetInnerHTML` yok). Yol deseni `gorsel-denetim.ts`te, dosya içeriği izin listesiyle `svg-denetim.ts`te
  denetlenir (betik, olay, bağlantı, dış url, varlık kodu yok); sahipsiz dosya testten geçmez.
- Renkleri anlamlı olduğundan koyu temada çevrilmez: `.sekil-kagidi` açık zemin, koyuda kısılmış parlaklık. Yazı okunsun
  diye sayfada 18rem sınırı uygulanmaz, soru görünümünde kenar boşluğuna taşar.

## Test ekranı (`components/soru-bankasi/soru-sayfasi.tsx` → `TestOturumu`)

Kullanıcı isteği (2026-11): önce kitap sayfası, oradan soruyu büyütüp çözmek. Üç görünüm: **sayfa** →
(Çöz) **soru** → **sonuç**. Geri: soru → sayfa → (bitmemişse) testten çık / (bitmişse) sonuç → konu.

- **Kitap sayfası** (`kitap-sayfasi.tsx`): kâğıt kart, üstte "MATEMATİK · konu" ve turuncu çerçeveli
  TEST kutusu, altta "— 2 —". Sayfa başına 3–4 soru: `testSayfalari` (`lib/soru-bankasi/sayfa.ts`) soru
  yüksekliğini tahmin eder (15 px yazı, 326 px metin genişliği) ve sırayı bozmadan bölen en ucuz
  dizilişi seçer (bütçe 1150 px; kısa sorular dörder, şekilliler üçer; 5 soru 3 + 2). Yazı 15 px'ten
  küçülmez; sayfa kendi içinde aşağı kayar, sayfalar yana kaydırma yakalamalı çevrilir, altta ‹ · nokta
  göstergesi "Sayfa 2 / 4" · › · Bitir. Son sayfanın altında "Testin sonu" kartı.
- Sayfada şıklar "A) …" kabarcıklı kitap düzeni (beş sütun yalnız ≤ 3 karakter, ≤ 13 iki sütun);
  dokunuş işaretler (alıştırmada doğru/yanlış hemen boyanır), uzun basış/sağ tık eler. Şekil (çizim)
  sayfada en çok 18rem; tablo ve akış küçültülmez. Soru başında numara, ★ sonra bak, Pas, ✎ çizim var.
- **"Çöz"** soruyu tam ekrana büyütür: `soru-buyume` (clip-path sorunun kutusundan ekrana, 240 ms,
  yalnız giriş). Sayfa altta kurulu kalır (`inert`): geçişte arkada görünür, dönüşte kaydırma yerinde
  bekler; dönülen soru 1,1 sn halkayla vurgulanır.
- **Soru görünümü:** üstte geri · "Soru 5" · kronometre · ☆ sonra bak · ⋮ görünüm · hata bayrağı;
  altında 12'lik numara şeridi (boş gri, cevaplı turuncu / alıştırmada yeşil-kırmızı, pas kesik
  kenarlı, sonra bak yıldızlı; 12 hücre 360 px'e sığar, uzun listede yana kayar). Altta araç çubuğu ve
  ‹ · − %100 + · tek ana düğme: cevapsızda **Pas geç** (işaretleyip sonrakine), cevaplıda Sonraki,
  sonda Bitir/Sonuç. El aracında %100'de yana çekmek soru değiştirir (`yatayGecis`, sınırda lastik).
- ⋮ menüsü: şık düzeni **Kitap / Tek sütun / İki sütun** (`sikDuzeniSec`, sayfaya da uygulanır; iki
  sütuna sığmayan uzun şık yine alt alta), süreyi göster, testi baştan başlat (onaylı).
- **Kronometre** test açılınca sayar; dokununca durur ve sorular "Süre durdu" perdesiyle örtülür.
  Süre soru soru tutulur (`lib/soru-bankasi/sure.ts`); sayfa görünümünde sayfanın ilk boş ya da en son
  dokunulan sorusuna yazılır; uygulama arka plana geçince durur. Bitince donuk gösterilir.
- Modlar konu ekranında seçilir. **Alıştırma**: şık seçilince doğru/yanlış, sonuç bandı ve çözüm.
  **Deneme**: seçim değişir/boşa döner, kayda "Bitir"de yazılır. Çıkış sormaz (yarım test kayıtlı);
  yalnız kaydedilmeyen yanlış tekrarı denemesinde cevap varken `useKapatmaOnayi` sorar.
- Eleme: liste düzeninde ✕, uzun basış/sağ tık ya da "Şık ele" modu (dokunuş eler). Denemede elenen
  seçili şık seçimden düşer.
- Test sonu: d/y/b, süre, soru başına ortalama, net, **Gözden geçir** (yanlışlar · boş ve pas ·
  sonra bak — açılan soru yalnız o listede gezilir; sayfa sayfa incele), ızgara, en çok vakit alan 3
  soru, "Yanlışları tekrar çöz", "Sonraki test", "Konuya dön". Çizimler incelemede durur.
- Masaüstü klavye: sayfada ← → sayfa; soruda ← → soru, 1–5 / A–E şık, ↑ ↓ PageUp/PageDown/Boşluk,
  Ctrl+Z / Ctrl+Y.
- Hesap makinesi yok (sınavda yok).

## Karalama ve görünüm (`karalama-katmani.tsx`)

- Sayfa yerli kaydırmayla değil tek CSS dönüşümüyle kayar/büyür (`lib/soru-bankasi/gorunum.ts`):
  kalem seçiliyken tek parmak çizip iki parmak kaydırmanın başka yolu yok. Şıkların altında en az bir
  ekran boyu ızgarasız karalama boşluğu var; ayrı karalama kutusu yok.
- Çizgiler içerik pikselinde (`SayfaCizgisi`, `lib/cizim.ts`), görüş alanı boyundaki iki tuvalde
  `devicePixelRatio` ile çizilir; görünüm değişince yeniden çizilir. Canlı çizgi yalnız yeni parçasını
  ekler (`yolParcasi`), çizim sırasında React state değişmez; bırakınca seyreltilip (RDP) bir kez kaydedilir.
  Mürekkep değer değil ad: `--murekkep-<ad>` (iki temada); kurşun koyuda açık ton.
- **Girdi kuralları:** dokunmatikte kalem/vurgulayıcı/silgi seçiliyken tek parmak çizer, iki parmak her
  zaman kaydırır + kıstırır, El'de tek parmak kaydırır (bırakınca atalet). Kalem (stylus) görülünce
  yalnız kalem çizer, parmak kaydırır. Fare: tekerlek her zaman kaydırır, Ctrl+tekerlek yakınlaştırır,
  sol tuş araca göre, orta tuş kaydırır, sağ tık menü açmaz (şıkta eler). Kısa ve hareketsiz dokunuş
  (≤ 8 px, ≤ 300 ms) alttaki düğmeye gider; düğmedeki hareketsiz dokunuş nokta bırakmaz; sürükleme
  başlayınca işaretçi yakalanır, ardından gelen tıklama yutulur (şık üstünde başlayan çizgi şık seçmez).
- Yakınlık %100–%400, odak parmak/imleç altında; El'de çift dokunma %100 ↔ 2x. − / %(sıfırla) / +
  (0,5x adım) gezinme çubuğunda hep görünür; gösterge `onOlcek` ile yalnız kendini yeniler. Sayfanın
  üstünde yüzen balon/hap yok (soru kökünü örtüyordu). Soru değişince en üst ve %100; 180 ms yatay kayma
  (`soru-gecis-*`, azaltılmış harekette yok). Üst ve alt çubuklar yakınlaşmaz.
- Yüzey `overflow: hidden`; odaklanan düğmeyi tarayıcı görünür yapmak için kutuyu yerli kaydırıyordu
  (kayma sonraki soruya taşınıyordu): her yerli kayma anında sıfırlanır.
- Silgi çizgiyi bütün siler (`silgiDegiyorMu`); bir sürüş tek geri al adımı. Geri al / ileri al /
  hepsini temizle (onaylı, yine geri alınabilir) `KaralamaGecmisi` ile, soru başına; geçmiş oturumluk,
  son çizgiler IndexedDB'ye yazılır (yukarıda).
- Araç çubuğu: Kalem · Vurgulayıcı · Silgi · El · Geri al · İleri al · renk/kalınlık/temizle. Dar
  ekranda (< 25rem) son üçü tek "kalem ayarı" balonunda (44 px hedefle 9 düğme 375 px'e sığmıyor).
  Soldaki tutamak küçültür; küçükken yalnız etkin araç simgesi sol altta yüzer. Varsayılan araç
  dokunmatikte El, ince işaretçide (fare) Kalem; öğrenci araç seçmediyse ilk fare/kalem girdisi Kalem'e geçirir.
- Yanlış soru fotoğraf çizimi (`components/soru-cizimi.tsx`) ayrı yüzeydir, bu kurallar ona uygulanmaz.
