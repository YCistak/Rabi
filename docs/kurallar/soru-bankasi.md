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
- `rabi-soru-bankasi-tercih` (son mod, sayaç gizli mi, eleme ipucu görüldü mü) cihaz tercihidir,
  yedeğe girmez.
- Sorular 12'şerli testlere bölünür; zorluk sırası aktarma betiğinde kararlı biçimde kolaydan zora kurulur.
- Veri olmayan program konuları listede "yakında" görünür ve açılamaz; ad/tema sınıf
  programından türetilir, dizin yalnız veri eşlemesini taşır.
- Yeni soru partisi `scripts/soru-bankasi-aktar.mjs` ile doğrulanarak aktarılır. Her soru kod denetimi ve bağımsız kör çözümden geçmeden yayımlanmaz.

## Çözme ekranı (`components/soru-bankasi/soru-sayfasi.tsx` → `TestOturumu`)

- Tam ekran sahne (z-50, alt menü ve masaüstü rayı görünmez). Üstte tek satır: geri · "Test 3" ·
  süre (dokununca gizlenir, tercihte kalır) · ☆ sonra bak · ▦ ızgara · hata bayrağı; altında ince
  ilerleme çizgisi. Soru numarası şeridi yok: ▦ ve alttaki "5 / 12" alttan açılan 12'lik ızgarayı açar.
- Altta her zaman: araç çubuğu ve ‹ Önceki · 5 / 12 · Sonraki ›. Kendiliğinden geçiş yok; cevaplanmış
  soruda Sonraki dolu, son soruda "Bitir" (bitmiş testte "Sonuç"). Boş soru varsa bitirmeden önce sorar.
- Modlar konu ekranında seçilir, son seçim hatırlanır. **Alıştırma**: şık seçilince doğru/yanlış,
  sonuç bandı ve çözüm (doğruda kapalı, yanlışta açık) ve bant yumuşakça görünür kaydırılır.
  **Deneme**: seçim değişir/boşa döner, doğruluk gösterilmez; kayda "Bitir"de toplu yazılır
  (`denemeyiKaydet`). Denemede cevap varken geri, `useKapatmaOnayi` ile sorar; alıştırma sormaz.
- Yarım kalan alıştırma testi konu ekranında "Kaldığın yerden devam et": önceki cevaplar sayılır
  (şık bilinmez, yalnız d/y), ilk boş sorudan açılır. Bitirilmiş test kartı son sonucu ve süresini gösterir.
- Şık düzeni `sikDuzeni` (`lib/soru-bankasi/duzen.ts`): görünür uzunluk ≤ 5 beş sütun, ≤ 12 iki
  sütun, değilse liste. Eleme: listede sağdaki ✕, her düzende uzun basış ya da sağ tık; elenmiş şıkka
  dokunmak geri getirir, seçmez. Eleme, işaret, çizim ve süre oturumluk.
- Süre soru soru tutulur (`lib/soru-bankasi/sure.ts`), sayfa gizlenince durur. Test sonu: d/y/b, süre,
  soru başına ortalama, net (4 yanlış 1 doğru), en çok vakit alan 3 soru, ızgara (dokununca çözümüyle),
  işaretliler, "Yanlışları tekrar çöz", "Sonraki test", "Konuya dön". Bitmiş testte gezinme sürer.
- Masaüstü klavye: ← → soru, 1–5 / A–E şık, ↑ ↓ PageUp/PageDown/Boşluk kaydırma, Ctrl+Z / Ctrl+Y.
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
- Yakınlık %100–%400, odak parmak/imleç altında; El'de çift dokunma %100 ↔ 2x; yakınken sağ üstte
  "%180 ✕" sıfırlar. Soru değişince en üst ve %100; 180 ms yatay kayma (`soru-gecis-*`, azaltılmış
  harekette yok). Üst ve alt çubuklar yakınlaşmaz.
- Silgi çizgiyi bütün siler (`silgiDegiyorMu`); bir sürüş tek geri al adımı. Geri al / ileri al /
  hepsini temizle (geri alınabilir) `KaralamaGecmisi` ile, soru başına, oturumluk; depoya yazılmaz.
- Araç çubuğu: Kalem · Vurgulayıcı · Silgi · El · Geri al · İleri al · renk/kalınlık/temizle. Dar
  ekranda (< 25rem) son üçü tek "kalem ayarı" balonunda (44 px hedefle 9 düğme 375 px'e sığmıyor).
  Soldaki tutamak küçültür; küçükken yalnız etkin araç simgesi sol altta yüzer. Varsayılan araç
  dokunmatikte El, ince işaretçide (fare) Kalem; öğrenci araç seçmediyse ilk fare/kalem girdisi Kalem'e geçirir.
- Yanlış soru fotoğraf çizimi (`components/soru-cizimi.tsx`) ayrı yüzeydir, bu kurallar ona uygulanmaz.
