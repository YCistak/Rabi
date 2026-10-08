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
- **12. sınıf Fizik (2018 programı):** `12-fizik.ts` + `12-fizik-sorular.ts`, 6 ünite
  23 deste (`fzk12-*`). Düzgün çembersel hareket `fzk11-cembersel`de, 12'de yazılmaz;
  BHH destesi `fzk10-periyodik`le örtüşür ama 2018'in konum-hız-ivme ve yay bağlama
  kazanımlarını taşır. Programın "hesaplamaya girilmez" dediği yerde (görelilik,
  Compton, girişim, eylemsizlik momenti) bağıntı yalnız değişken ilişkisi için verilir.
- **12. sınıf Kimya** (`12-kimya.ts`, 2018'in dört ünitesi): Lewis (`kim9-lewis`),
  nanoteknoloji (`kim9/11-nano`), sürdürülebilirlik/yeşil kimya (`kim9-yesil`,
  `kim11-mikroplastik`) ve hidrojen üretimi (`kim11-yesil-hidrojen`) 9–11'de var,
  12'de yazılmaz; Nernst hesabı ve yakıt pili (Fen Lisesi) yok.
- **Biyoloji 12** (`12-biyoloji.ts`): Genden Proteine, Bitki Biyolojisi, Canlılar ve
    Çevre. Enerji ünitesi (10'da) ile bitki hormonları/hareketleri (11'de) tekrar
    yazılmaz; `icerik.test.ts` bunu konu adlarından denetler.
- **12. sınıf Tarih (2018 programı):** `12-tarih.ts` (+ `12-tarih-t1/t2/t3/t5/t7.ts`,
  kalıp `12-tarih-yardimci.ts`); 30 deste, tema adları 2018 ünitelerinden (Millî
  Mücadele … XXI. Yüzyılın Eşiği). 1. ünite (1908-1918) 11'de kartlı, tekrar yok;
  Çağdaş Türk ve Dünya Tarihi ünitelerinin 20. yüzyıl konuları aynı destelerde
  birleşik. Tarihler ve olay sırası kartlarda tek tek doğrulandı; emin olunmayan
  ayrıntı yazılmadı. `icerik.test.ts` `beklenenMi` 12'de Matematik + Tarih.
- **12. sınıf Coğrafya (2018 programı):** `12-cografya.ts` (+ `12-cografya-t1…t4.ts`,
  kalıp `12-cografya-yardimci.ts`); 4 ünite, 29 deste (Doğal Sistemler, Beşerî
  Sistemler, Küresel Ortam: Bölgeler ve Ülkeler, Çevre ve Toplum). Tema adları ve
  kazanımlar (12.1.1 … 12.4.4) MEB ölçme-değerlendirme tablosundan. Rakam, yıl ve
  anlaşma tarihleri tek tek doğrulandı; emin olunmayan ayrıntı yazılmadı. Örgütler
  (BM, NATO, AB) ayrı deste değil. `icerik.test.ts` `beklenenMi` 12'de Coğrafya'yı da sayar.
- **12. sınıf İngilizce (2018 programı):** `12-ingilizce-1…4.ts` (+ `-sorular`), MEB
  Ortaöğretim İngilizce 9–12 programının 12th Grade bölümündeki on tema
  (Music … Manners), temada iki konu = 20 deste. Tema adı programın İngilizcesi;
  konu kapsamı programın Functions sütunundan. 11 (Maarif) desteleriyle çakışan
  dil bilgisi (edilgen, gelecek, ikinci koşul, wish + past) tekrar yazılmadı;
  past perfect yalnız haber anlatımı, wish + had V3 / would ise pişmanlık
  bağlamında yeniden geçiyor. YDT'ye bağlanan harita eşlemesi yok (kartlar
  işlev odaklı).
- **12. sınıf Türk Dili ve Edebiyatı** (`12-turkce*.ts`, ders kimliği `turkce`, konu
  kimlikleri `trk12-*`, 2018 programı): temalar programın ünite adları (Giriş, Hikâye,
  Şiir, Roman, Tiyatro, Deneme, Söylev). Kalıp 12-Matematik'ten farklı: kartlar ve hızlı
  kontrol `edebiyatKonusu` (`12-turkce-yardimci.ts`) ile, sorular `*-sorular.ts`
  dosyalarında `sorular()` ile. **Yazar–eser–yıl eşleşmesi yalnız emin olunandan yazılır**;
  program metni doğrulanamadığından makale, eleştiri ve röportaj desteleri yok. 11'de
  kartı olan Orhun, Âşık geleneği ve Küçürek Hikâye tekrarlanmaz (`icerik.test.ts`).
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
- **Sınıf ve ders tek kart + alt pencere** (kullanıcı seçti, 2026-10;
  `components/konu/harita-secimi.tsx`, tasarım "Tek başlık + alt sayfa"): patikanın
  üstünde yalnız "10. sınıf · Kimya" kartı (ders emojisi, ilerleme, turuncu ok);
  basınca alttan pencere. Pencerede önce `SINIF` (seçili turuncu dolgu, yüzde =
  sınıfın ders ortalaması `sinifOrtalamasi`), sonra o sınıfın dersleri gri grupta
  beyaz satırlar; seçili ders turuncu kenar + `--primary-soft`. Sınıfa basmak yalnız
  listeyi değiştirir, seçim derse basınca biter; bakılan sınıfta seçili ders yoksa
  `pencereBilgisi` satırı. **"sen" işareti yok** (kullanıcı kaldırttı). Emojiler
  `OlcekliEmoji` ile (kullanıcı istedi; hizalı satırda ham emoji telefona göre kayar).
- **Pasif sınıf** (`sinifPasifMi`: hiçbir dersi yazılmamış sınıf) pencerede "Yakında"
  rozetli, boş ekrana götürmez. 12, 8 dersle (2018 programı) `KONU_SINIFLARI`na girdi ve
  hücre kendiliğinden açıldı; `HaritaSinifi` artık `KonuSinifi`nin eşi. Kilitli "yapım
  aşamasında" kartı yalnız içeriği boşalan sınıf ya da eski kayıt için duruyor.
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
