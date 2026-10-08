# Konu Anlatımı

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Müfredat **Türkiye Yüzyılı Maarif Modeli**; eski (2018) program adları kullanılmaz.
  İçerik `lib/konu/icerik/<sınıf>-<ders>.ts`; dosya başındaki yorum eski programdan
  neyin taşınmadığını yazar — yeni konu eklemeden oku. 9–11'de yedi ders tam, 11'de
  ayrıca İngilizce; 9–10 İngilizce yok. `icerik.test.ts` ders/sınıf çiftlerini
  denetler.
- **12. sınıf istisnası: 2018 programı.** Maarif'in 12'si yayımlanmadı; 12/mezun
  2018 programını görüyor. `12-matematik.ts` tema adlarını 2018 ünitelerinden alır,
  `maarif.test.ts` 12'yi denetlemez. 9–11 haritasında kartı olan 2018 konuları
  (üstel-logaritma, trigonometrik denklem, dönüşümler) 12'de tekrar yazılmaz. 12'de
  şimdilik yalnız Matematik; öteki dersler eklenince `beklenenMi` (`icerik.test.ts`)
  genişler. Sekizinci ders `KonuDersId` + ders rengi ister. 11. sınıf soruları ayrı
  `11-<ders>-sorular.ts` (`sorulariBagla`), Edebiyat/Tarih/Coğrafya içerikte.
- **12. sınıf İngilizce (2018 programı):** `12-ingilizce-1…4.ts` (+ `-sorular`), MEB
  Ortaöğretim İngilizce 9–12 programının 12th Grade bölümündeki on tema
  (Music … Manners), temada iki konu = 20 deste. Tema adı programın İngilizcesi;
  konu kapsamı programın Functions sütunundan. 11 (Maarif) desteleriyle çakışan
  dil bilgisi (edilgen, gelecek, ikinci koşul, wish + past) tekrar yazılmadı;
  past perfect yalnız haber anlatımı, wish + had V3 / would ise pişmanlık
  bağlamında yeniden geçiyor. YDT'ye bağlanan harita eşlemesi yok (kartlar
  işlev odaklı).
- Konu ölçüsü `lib/konu/maarif/iskelet.json`, `scripts/maarif-cek.mjs` ile
  tymm.meb.gov.tr'den çekilir; **elle düzenlenmez**. `maarif.test.ts` kelime
  örtüşmesiyle denetler (kısaltırken konuyu tanıtan kelimeyi atma); Türk Dili ve
  Edebiyatı konu listesi denetlenmez (`KONU_LISTESI_DENETLENMEYEN`). Ayrıştırıcıyı
  değiştirmeden önce betikteki yorumları oku.
- **Kart:** başlık 44, metin 240 karakter (görünen metin); konu başına 6–16 kart. Sınırı
  aşan kart bölünür, sınır büyütülmez; tavanı doldurmak için kart yazılmaz.
- **Kart metni biçimi** (`lib/konu/kart-metni.ts`, `components/konu/kart-metni.tsx`;
  kullanıcı düz paragrafı iki kez geri çevirdi): her `\n` blok; `- ` madde; `**…**`
  vurgu. Önce tanım/formül, sonra maddeler, gerekirse tek satır sonuç. Testte: satır ≤
  110 karakter, satırda ≤ 2 cümle, liste ≥ 2 madde, maddeler ya hep adlı ya hiç.
- Banka kaydı kartın **başlığını ve metnini** taşır (kimlik `${konuId}-${sıra}` kayar).
  Yeni kart alanı eklenirse kayda da konur.
- **Kilit:** önceki konu okunup soruları geçilmeden (`GECME_ORANI` %50) açılmaz
  (`konuKilitli`, `lib/konu/ilerleme.ts`); cevaplanmamış yoklama geçilmiş sayılmaz
  (`konuTamam`). "Kilidi aç" onay penceresiyle açar, `acildi` kayda girer. Yarıda
  çıkılan deste konuyu bitirmez.
- **Deste akışı** (`lib/konu/deste-akisi.ts`, `tasarim/bilgi-karti.html`): kartlar
  arasına mola ve hızlı kontrol; kısa destede kontrol → mola, uzunda kontrol → mola →
  kontrol; ara ekranlar kart sayılmaz. On karttan uzun destede iki kontrol, kısada
  bir; kontrol dayandığı kart (`kart`) okunmadan sorulmaz, "Tekrar oku" oraya döner;
  yanlışta "Devam et" uyarır ama engellemez. Başlık ortak (`deste-basligi.tsx`), zemin
  dersin rengi, vurgu `bicim.murekkep`. Molada Rabi dinleniyor (zıplamaz), okunan
  kartların adları listelenir; metin `MOLA_METINLERI`; konfeti ve puan yok. `BilgiKarti.etiket` / `not` isteğe bağlı;
  not **konu başına bir kartta**, ≤ 120 karakter.
- **Yoklama** (`components/konu/soru-sahnesi.tsx`): iddia (`soru()`, Doğru/Yanlış, soru
  işareti yok) ya da iki şıklı (`sikli()`). Soru sayısı kart+1 ile kart×1,3+1 arası;
  iki biçimden en az ikişer; doğru/yanlış ve A/B dengesi bütünde %40–60, her destede
  iki cevap da var. Karar pencere açmaz, `BEKLEME` (850 ms) sonra sıradaki soru;
  `aciklama` içerikte zorunlu ama gösterilmez. Görselli iddia çizime bakılarak
  tartılabilmeli (tablo görsellerinde iddia çoğunlukla yanlış olan); sorular
  kartlardaki `Gorsel` türlerini kullanır, yeni çizim dili açılmaz. Renkler `.sahne` (`globals.css`), karar rengi paspartuda.
- **Özet** (`components/konu/konu-ozeti.tsx`) üç soruya cevap verir: ne bitti (konu,
  ders, tema), ne kadar (okunan kart + `okumaSaniyesi` / `DesteSonucu.saniye`), neyi
  aklında tutmalı (kart başlıkları + Rabi'nin notu; kart metni yazılmaz). "Sırada
  yoklama var" kartı yok (kullanıcı kaldırttı); sıradakini "Yoklamaya başla" söyler.
  - Görünüş yoklama kapanışının dili, **dersin renginde** (`tasarim/konu-bitti-v8.html`,
    kullanıcı seçti): renk `dersVurgusu` (`SoruSahnesi.ders`); zemin dersin açık tonu
    üstünde kareli defter (`ozet-zemin`, çizgi `--konu-<ders>-kenar` ayrı katmanda yarı
    saydam — `color-mix` eski WebView'de yok). Sıra: ders · tema ve konu adı, büyük
    Rabi, "Konu bitti!", Kart / Süre / Soru kutuları, kart başlıkları, not. Parçalar
    `kapanis-gel` ile bir kez gelir. Konfeti, damga, ses, dolan halka ekleme (halka
    kullanıcı isteğiyle kalktı).
  - Rabi kıpırdamaz; her açılışta `OZET_POZLARI` (sevinen, zıplayan, kupalı) arasından
    rastgele, bir öncekiyle aynı değil (`lib/konu/ozet-maskotu.ts`, kullanıcı). Listeye
    el sallayan, kitaplı, düşünen, kahveli gibi ekrana uymayan poz koyma.
  - Kart başlıkları kapalı gelir: ilk iki görünür, kalanı "Devamını gör" (`ozet-liste`,
    kullanıcı istedi).
  - Yalnız desteden gelince (`SoruSahnesi.ozetli`). "Haritaya dön" yazı, üstte çarpı
    yok. Yoklama bileti kaldırıldı, yeniden uygulanmaz. Titreşim ve ses yok
    (kullanıcı); VIBRATE izni oyun haptiği (`@capacitor/haptics`) için duruyor. Yarıda
    bırakılan yoklama sayı yazmaz (`SahneSonucu.bitti`).
- **Kapanış** (`Kapanis`, `tasarim/soru-kapanis.dc.html` → 2a) kâğıt zeminde
  (`.kapanis`). Kademe `lib/konu/kapanis.ts` (≥ %90, ≥ geçme sınırı, altı), haritadaki
  yıldızlarla aynı eşik. Süre ilk sorudan "Bitir"e. Yanlış listesi üçle kesilir.
- **Harita sekmesi** alt menüde (kod `konu`), `KARTLAR`da yok; açılış karşılaması yok.
  Her açılışta ayarlardaki sınıfla açılır (`haritaSinifiBul` → `haritaAcilisSinifi`);
  ekran içi sınıf değişimi o ziyaretlik; mezunda son seçim kalır; pasif sınıfın
  öğrencisi içeriği olan en büyük sınıfta açılır (12 artık açık, 12'de açılır). `sinifDersleri` boş programları haritada gizler.
- **Sınıf patikanın üstünde sekme** (`SinifSekmesi`, `lib/konu/sinif-sekmesi.ts`):
  `9 · 10 · 11 · 12` hep görünür, altında seçili dersin o sınıftaki ilerleme yüzdesi
  (ders yoksa çizgi), kendi sınıfında "sen" işareti; seçici içinde gizli sınıf fark
  edilmiyordu. "Çalıştığın program" kartı yalnız dersi seçtirir. Ders yeni sınıfta
  yoksa sınıfın ilk dersine geçilir ve bunu kısa bir satır söyler (`sinifDegisimi`).
- **Pasif sınıf** (`sinifPasifMi`: hiçbir dersi yazılmamış sınıf) sekmede "Yakında"
  rozetli, boş ekrana götürmez. 12, Matematik yazılınca `KONU_SINIFLARI`na girdi ve
  sekme kendiliğinden açıldı (Maarif öğrencisi için de: harita sınıfa göre, müfredata
  göre süzülmüyor). `HaritaSinifi` artık `KonuSinifi`nin eşi. 12'de ders şeridinde
  yalnız Matematik; başka dersten 12'ye geçen `sinifDegisimi` ile Matematik'e düşer.
  Kilitli "yapım aşamasında" kartı yalnız pasif sınıf seçili kalmışsa diye duruyor.
- **Konu Takibi yönlendirmesi şerit bırakır:** "Haritaya git" sınıfı değiştirir; kendi
  sınıfından farklıysa patikanın üstünde kapatılabilir şerit ("Trigonometri için 10.
  sınıfa geçildi · Kendi sınıfıma dön", `yonlendirmeMetni`); sınıf elle değişince
  kalkar.
- **Patika** (`components/ekranlar/konu-haritasi.tsx`, `tasarim/konu-haritasi.html`):
  yeşil kitap anlatım, turuncu kitap çifti sorular, gri kilitli; sonda `Sandik`.
  Kitap rengi işe ait (`--success`, `--primary-parlak`), derse göre değişmez; derse
  ait olan tema bandı ve simgeler (`lib/konu/harita-temasi.ts`, emoji değil, opaklık
  `--patika-simge`). Deste zemini `zeminRengi`. Yol hesaplanır (`KAYMA`, kübik
  Bezier, SVG 400 px); bölüm kutusu `overflow: clip` (`hidden` değil), `BANT_PAYI`,
  `BOLUM_ARASI`. Numara yalnız yeşil kitapta, konuyu sayar. Kitaba basınca ortada
  `KonuKarti`.
