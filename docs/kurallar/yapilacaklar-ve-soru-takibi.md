# Yapılacaklar ve Soru Takibi

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

## Yapılacaklar

`lib/yapilacaklar.ts`, `components/ekranlar/yapilacaklar.tsx`, tasarım
`tasarim/yapilacaklar-v3.dc.html` (dilimli hâli). Yedi günlük şerit + günün **tek
listesi**.
- Konum (`x`, `y`) yok, **Sabah / Öğle / Akşam dilimleri yok** (kullanıcı kaldırttı:
  "saatler olsun kullanıcı isterse"). Eski kayıtları `gorevleriNormalize` taşır:
  konum ve `dilim` atılır, görev **saatsiz** kalır — dilim saate çevrilmez
  ("sabah" 09:00 demek değildi).
- **Saat isteğe bağlı** (`Gorev.saat`, 'SS:DD' ya da `null`). Sıra
  `gununSiraliGorevleri`: saatliler saate göre üstte, saatsizler altta; aynı saatte
  ve saatsizler içinde yıldızlı üstte, yıldız saatin önüne **geçmez**. Ekleme
  sayfasında kapalı "Saat ekle" düğmesi → `<input type="time">` + `showPicker`
  (yoksa kutu odakta açık); açık boş kutu zorunlu alan gibi görünürdü. Çarpı saati
  siler. Satırda saat kategori satırının başında, renk noktasının yerinde, ön plan
  renginde.
- `EN_COK_GOREV` (30) **gün başına** (dilimli dönemde 3 × 10 yazılmış günü eleme
  diye); `gorevEkle` engeller (dolu günün `+`'sı pasif), `gorevleriNormalize`
  fazlasını eler.
- `EN_UZUN_GOREV` 24 karakter, satır ayrıca `truncate`; sınır satırdaki düğmelerle
  **birlikte** değişir. Satırda yalnız yıldız ve "⋯"; düzenle/ertele/sil "⋯"nün alt
  sayfasında (`GorevEylemleri`, sil en altta kırmızı). Bitmiş görevde yalnız sil.
  Düzenleme (`gorevDuzenle`) günü değiştirmez, saati değiştirebilir.
- Bugün şeridin dördüncü günü; `gorevleriTarihtenItibaren` üç günden eskiyi eler,
  etkiyle kayıttan da siler. Gün dönümü türetmeyle (`AppShell`), `setTimeout` değil.
  Geçmiş günler salt okunur. Ay takvimi yok.
- Ekleme sayfasının başlığında gün etiketi ("Bugün"). Erteleme ertesi güne **aynı
  saate**, önce `Onay` (kırmızı değil); hedef gün doluysa `gorevErtele` `null` →
  toast. "Diğer" kategorisinde ad zorunlu, ≤ 14 (`EN_UZUN_OZEL_KATEGORI`).
- Süre isteğe bağlı (`Gorev.sure`, `SURE_SECENEKLERI` 15·30·45·60·120 + `elleSure`
  kutusu, çip ile kutu tek cevap); varsayılan seçili gelmez; süresiz `null`, liste
  başlığındaki toplamda (`kalanSure`) sayılmaz.
- **Görevden Pomodoro:** ekleme/düzenlemede kapalı gelen "Pomodoro ile çalış"
  anahtarı (`Gorev.pomodoro`, yalnız `true` iken yazılır; eski kayıtlar düğmesiz).
  Açık görevde yıldızın solunda lucide `Timer` düğmesi; Pomodoro'yu açıp turu
  başlatır. Süre görevinki, süresizse Pomodoro'nun çalışma süresi; yalnız o tur
  için, ayara yazılmaz. Yeni sayaç yok: `baslatIstegi` → `turuBaslat`. Tur zaten
  başlamışsa (duraklatılmış da) yalnız ekranı açar; odak kilidi tanıtımı açıksa
  kapanmasını bekler. Düğme yalnız işaretli görevde (iş adı daralmasın).
- **Görev hatırlatması:** saatli, bitmemiş görevde saatten **5 dk önce** yerel
  bildirim (`lib/gorev-bildirimi.ts` saf + test, `gorevBildirimleriniEsitle` in
  `lib/bildirim.ts`). Tek tek güncellenmez: `AppShell` görev imzası, ayar ya da öne
  gelişte bekleyen görev bildirimlerini kimlik aralığıyla (1.000.000+) silip kayıttan
  yeniden kurar. Kimlik görev kimliğinden FNV özeti — Pomodoro (1), günlük
  hatırlatma (2–8), odak servisi (4211) aralık dışında kalmalı. Geçmiş an
  planlanmaz (Android hemen gösterir); 00:00–00:04 önceki güne düşer. iOS 64
  bekleyen sınırı için en çok `GOREV_BILDIRIM_EN_COK`. Metin emojisiz. Dokunuş:
  kayıtta Pomodoro'lu ve bitmemişse `pomodoroIstegi`, değilse Yapılacaklar. İzin
  saat girilince formda sorulur, açılışta değil; red → saatin altında not. Ayar
  `Ayarlar.gorevHatirlatma` (varsayılan açık), günlük hatırlatmadan bağımsız.
- Renkler ayrı palet (`--gorev-*`), ders aileleri değil; beyaz kartta en az 4,6:1 —
  yeni tonda kontrastı ölç. Kayıtta rengin **adı**.
- **Mini tur** görevi kullanıcıya **gerçekten ekletir** (kullanıcı istedi, 2026-10;
  yalnız gösteren eski hâli "yazı yazılamıyor" diye bozuk bulundu): sayfa ve ⋯
  menüsü turda adıma bağlı, form serbest, tur Kaydet'i bekler; görev gerçek listeye
  yazılır ve tur bitince kalır (ayrıntı: `docs/tanitim-rehberi.md`). Turun
  hedefleri (`gorev-formu`, `gorev-satir-pomodoro`, `gorev-eylem-ac`,
  `gorev-eylemleri`) ve `YAPILACAKLAR_ADIMLARI` birlikte değişir; forma otomatik
  odak verme (turda klavye açılıp spotu bozar).
- Dosya adı `notlar.*` **olamaz**: `.gitignore` deseni yakalar (depoya ve Tailwind
  taramasına girmez). Yeniden adlandırmadan sonra `npm run build`'i tekrar çalıştır.

## Soru Takibi

- Bugün ve yalnız bir önceki gün düzenlenebilir (`gunKaydir(bugunIso, -1)`); eski
  günler salt okunur, gelecek seçilemez.
- "Soru ekle" sayfası ortak `DersSeridi`ni kullanır; sıra geçmiş kayıtlardaki toplam
  soru sayısına göre (`calismaSirasi`). Kaydet ders seçilmeden, Toplam 0 iken ya da
  doğru + yanlış toplamı aşarken açılmaz. **Boş sayı kutusu 0 sayılır**
  (`lib/bos-sifir.ts`: "60 soru, 60 doğru"da yanlışa 0 yazdırılmaz); Soru Takibi,
  deneme formu ve tanıtım turu aynı kuralı kullanır. Hiçbir sayı girilmemiş form
  yine kaydedilmez.

## Takvim tek bileşen

- Gün seçen her takvim `components/takvim.tsx`ten: yedi günlük `HaftaSeridi` (bugün
  ortada) ve açılır ay `Takvim`i, ikisi aynı `GunHucresi`. Ekrana kendi takvimini
  yazma; kurallar prop'la: `enGecIso` (sonrası kapalı), `solukMu` (salt okunur),
  `isaretler` (`doluluk` zemini, `nokta`: görev / devamsızlık türü). Ana sayfadaki
  hedef hapları gün seçmediği için ayrı kalır.
- Pazartesi hücresinin üstünde ince çizgi hafta başını gösterir
  (`haftaBasiIsaretiMi`, `lib/utils.ts`); bugün pazartesiyse işaretsiz. Çizgi üstte,
  noktalar altta.
