# Konu Anlatımı

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

- Müfredat **Türkiye Yüzyılı Maarif Modeli**; eski (2018) program adları kullanılmaz.
  İçerik `lib/konu/icerik/<sınıf>-<ders>.ts`; dosya başındaki yorum eski programdan
  neyin taşınmadığını yazar — yeni konu eklemeden oku. 9–11'de yedi ders tam, 11'de
  ayrıca İngilizce; 9–10 İngilizce yok. `icerik.test.ts` ders/sınıf çiftlerini
  denetler. Sekizinci ders `KonuDersId` + ders rengi ister. 11. sınıf soruları ayrı
  `11-<ders>-sorular.ts` (`sorulariBagla`), Edebiyat/Tarih/Coğrafya içerikte.
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
  ekran içi sınıf değişimi o ziyaretlik; mezunda son seçim kalır; 12. sınıf öğrencisi
  11'de açılır. `sinifDersleri` boş programları haritada gizler.
- **Sınıf ve ders tek kart + alt pencere** (kullanıcı seçti, 2026-10;
  `components/konu/harita-secimi.tsx`, tasarım "Tek başlık + alt sayfa"): patikanın
  üstünde yalnız "10. sınıf · Kimya" kartı (ders emojisi, ilerleme, turuncu ok);
  basınca alttan pencere. Pencerede önce `SINIF` (seçili turuncu dolgu, yüzde =
  sınıfın ders ortalaması `sinifOrtalamasi`), sonra o sınıfın dersleri gri grupta
  beyaz satırlar; seçili ders turuncu kenar + `--primary-soft`. Sınıfa basmak yalnız
  listeyi değiştirir, seçim derse basınca biter; bakılan sınıfta seçili ders yoksa
  `pencereBilgisi` satırı. **"sen" işareti yok** (kullanıcı kaldırttı). Emojiler
  `OlcekliEmoji` ile (kullanıcı istedi; hizalı satırda ham emoji telefona göre kayar).
- **12 pencerede pasif** (`sinifPasifMi`: hiçbir dersi yazılmamış sınıf), "Yakında"
  rozetli, boş ekrana götürmez. `KonuSinifi` 9–11; 12 yalnız `HaritaSinifi`; kartlar
  yazılınca `KONU_SINIFLARI`na eklenir, hücre kendiliğinden açılır. Kilitli "yapım aşamasında" kartı yalnız eski kayıtta seçim 12 kaldıysa diye
  duruyor.
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
