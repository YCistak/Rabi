# Soru Bankası

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Her konu ayrı, girintisiz JSON dosyasıdır; soru sırası kalıcı kayıt dizinine dayandığı için yalnızca sona eklenir.
- Kayıt `rabi-soru-bankasi`: konu kimliği → `-`/`d`/`y` dizisi; bozuk değer okunurken atılır ve yedeğe isteğe bağlı girer.
- Sorular 12'şerli testlere bölünür; zorluk sırası aktarma betiğinde kararlı biçimde kolaydan zora kurulur.
- Çizimler yalnız test oturumunda bellekte tutulur; depoya ya da yedeğe yazılmaz.
- Karalama yüzeyi vektör çizgiler tutar; kalem, silgi, el, renk, kalınlık, geri al ve
  temizle ortak yüzeydedir. İki parmak pinch/kaydırma yapar, çift dokunma yakınlığı sıfırlar;
  ölçek %100–%400 aralığındadır.
- Veri olmayan program konuları listede "yakında" görünür ve açılamaz; ad/tema sınıf
  programından türetilir, dizin yalnız veri eşlemesini taşır.
- Yeni soru partisi `scripts/soru-bankasi-aktar.mjs` ile doğrulanarak aktarılır. Her soru kod denetimi ve bağımsız kör çözümden geçmeden yayımlanmaz.
