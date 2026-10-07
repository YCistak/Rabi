# Konu Takibi

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

Araçlar › Çalışma › **Konu Takibi** (`components/ekranlar/konu-takibi.tsx`, mantık
`lib/konu-takibi/`): YKS konuları aşama aşama işaretlenir — Haritada çalıştım,
Okulda öğrendim, Soru çözdüm ve ayrı bir Bitirdim.

- **Ekran sınıf → okul dersi → o sınıfın konuları; TYT/AYT ayrımı yok** (kullanıcı
  istedi, 2026-10: "TYT AYT diye hiç ayırma… 9 10 11 12 diye ayıracaksın, sadece o
  yılın konuları olacak"). En üstte tek seviye `9 · 10 · 11 · 12` sekmesi; "Tümü"
  ve TYT/AYT sekmesi yok, geri getirme. Ders listesi seçili sınıfın okul dersleri;
  ders ekranında sınıf sekmesi yok, yalnız o sınıfın konuları.
- **Okul dersi birleştirmesi** (`okul-dersleri.ts` → `OKUL_DERSLERI`): Türk Dili ve
  Edebiyatı ← TYT Türkçe ("Dil ve Anlatım" bölümü) + AYT Edebiyat ("Edebiyat"
  bölümü); Matematik ← TYT + AYT Matematik, Geometri ayrı ders değil bölüm (okulda
  Matematik'in üniteleri); Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Din Kültürü ←
  aynı adlı TYT + AYT; Felsefe ← TYT Felsefe + AYT Felsefe Grubu (Psikoloji,
  Sosyoloji, Mantık bölüm); Yabancı Dil ← YDT. Bölümsüz konular başta, bölüm içinde
  önce TYT sonra AYT. Ekranda "TYT"/"AYT" etiketi yazılmaz.
- **Aynı içerik tek satır** (`BIRLESEN_KONULAR`): TYT–AYT çifti aynı sınıfta yan
  yana düşerse tek satır olur (Fonksiyonlar, Polinomlar, İş-Güç-Enerji ↔ Enerji ve
  Hareket, Manyetizma ↔ İndüksiyon). Satır iki kimliği birlikte yazar (`satirYaz`),
  okurken alan **herhangi birinde** varsa dolu sayılır, günü en erkeni
  (`birlesikKayit`) — yarısı eski sürümde işaretlenmiş satır boş görünmesin. Farklı
  sınıfa düşen ya da AYT yarısı alan dışı çift birleşmez. Kayıt şeması değişmedi.
- **Liste haritadan ayrı ve YKS'nin diliyle** (`liste.ts`, yayınevlerinin ortak YKS
  listesinden; ÖSYM konu listesi yayımlamıyor). **AYT'de TYT konuları tekrar
  yazılmaz.** Konu kimliği kayıt anahtarı: adı değiştir, kimliğe dokunma. Okul dersi
  kimlikleri (`matematik`, `edebiyat`…) yalnız oturumluk, kayıtta yok.
- **Alan süzgeci** (`kaynakGorunur`): TYT konuları herkese. AYT dersi alanın
  testindeyse: Sayısal → Mat, Fiz, Kim, Biyo; EA → Mat, Edebiyat, Tarih, Coğrafya;
  Sözel → Edebiyat, Tarih, Coğrafya, Felsefe Grubu, Din; Dil → YDT. Alan `null` ise
  bütün AYT dersleri görünür (alan uydurulmaz), **YDT hariç**: YDT yalnız Dil'de.
  Alan seçilmemişse listenin altında alan sorulur, cevap `Ayarlar.puanTuru`na
  yazılır.
- **Sınıf ataması öğrencinin müfredatına göre** (kullanıcı istedi, 2026-10;
  `sinif.ts` → `sinifAtamasi(konu, buYilSinif)`):
  - **12. sınıf ve mezun** (2018 programı): `ESKI_SINIF`, her konu için 9–12. Harita
    eşlemesine bakılmaz. 12 sekmesi açık, "harita yok"; 12'de harita aşaması yok.
  - **9–11 ve bilinmeyen** (Maarif): eşliyse destelerin önekinden (çoğunluk, eşitlikte
    en erken), değilse `MAARIF_SINIF`. Maarif 9–11'de karşılığı olmayan konu
    `HENUZ_YOK`: **hiçbir sekmede görünmez** ("Tümü" kalktığı için; Maarif 12
    yayımlanınca `MAARIF_SINIF`ta sınıf alır). 12 sekmesi haritadaki gibi pasif,
    "Yakında" rozetli. YDT bu yüzden Maarif öğrencisinde hiç çıkmaz. Felsefe/Din
    iskelette yok; 2018 sınıflarıyla durur.
  - Varsayılan sekme öğrencinin sınıfı, mezun 12, bilinmeyen 9 (`varsayilanSinif`);
    oturumdan dönen sekme pasifse varsayılan, o da pasifse ilk açık sekme.
- **Sınıf sekmesi** haritanın sınıf sekmesinin dili: yüzde = o sınıftaki görünen
  bütün satırların dairelerinin ortalaması (`sinifSekmeleri`), kendi sınıfında "sen".
- **"Haritada çalıştım" elle işaretlenmez:** `harita-eslemesi.ts`teki açık tablo YKS
  konusunu harita konularına bağlar; aşama haritanın kaydından (`konuTamam`) hesaplanır,
  "Haritaya git" o konunun kartıyla açar (`acilacakKonu`, sınıf farklı olsa da).
  Birleşen satırda iki konunun eşlemesinin birleşimi sayılır. Eşleme yalnız kartlar
  konunun **asıl içeriğini** anlatıyorsa; tek kartta değinmek yetmez. Karşılığı
  olmayan konuda aşama hiç gösterilmez. 12. sınıf kartları yazılınca tabloya eklenir;
  `takip.test.ts` iki uçtaki kimlikleri denetler.
- **İşaret satırda:** solda ilerleme dairesi (aşama sayısına göre yay; dokununca
  Bitirdim aç/kapa), sağda sabit genişlikte üç yuva — harita (salt okunur, boşken kesik
  kenarlı; karşılığı yoksa boş ama yer tutar), okul, soru (44 piksel dokunma alanı).
  Simgeler lucide, emoji değil; dolu hâl ders renginde dolgu, boş hâl kenarlık. Ada
  dokunmak kompakt ayrıntıyı açar (harita durumu + "Haritaya git", toplu eylem, işaret
  günleri). Bir konu en çok üç dokunuş.
- **Bitirdim engellenmez ve sormaz:** eksik aşamada pencere değil Geri al'lı bildirim
  ("Bitti · eksik: okul, soru"). Konfeti yalnız dersin **o sınıftaki** son konusu
  bitince.
- **"Bu ve önceki konuları okulda işlendi say"** (`oncekiOkulsuzlar`): görünen liste
  (seçili sınıf, o ders), yalnız aynı bölüm, yalnız okul aşaması, bildirimde Geri al.
- **Özet tek segmentli çubuk** (bitti › soru › okul › kalan, her konu en ileri
  aşamasında) + tek satır sayı, seçili sınıfa göre ("10. sınıf · …"); yüzde ve büyük
  halka yok. **Tempo satırı kaldırıldı:** sınıf görünümü sınav takvimiyle konuşmuyor
  (10. sınıfın kalan konusunu YKS'ye kalan güne bölmek anlamsız).
- **Öneri müfredat sırasında, seçili sınıfın içinde** (`siradakiKonu`,
  `devamKonusu`): ders içi Sıradaki, bitmemiş **ve** aşamaları tamamlanmamış ilk satır
  (harita karşılığı yoksa harita sayılmaz). Girişteki tek "Devam et" kartı seçili
  sınıfta en son dokunulan dersin (bitirmek de dokunuş) Sıradaki'si. "En son
  işaretlenen yarım konu" kuralına dönme: öneri takılıyor ve zıplıyordu (TestFlight
  geri bildirimi). Aşamaları tamam ama bitmemiş konu (`bitirmeyeHazir`) öneri olmaz;
  dairesi dolu, ortada ders renginde soluk tik. Hiç işaret yokken ipucu ve lejant —
  ayar değil, kayıt boşluğundan türetilir.
- **Hızlı başlangıç** (yalnız 12/mezun): seçili sınıfta hiç işaret yokken bir kez "N.
  sınıfta neredeyim?"; seçenek o sınıfın her dersinde ilk ⌊n × oran⌋ satırı okulda
  işlendi yazar. Bayrak `rabi-konu-takibi-hizli-baslangic` sürüm 2, sınıf tutar;
  sürüm 1'de (TYT/AYT) kartı görmüş öğrenciye yeniden sorulmaz.
- **Tek geri:** ders ekranının kendi geri düğmesi yok; kabuğun "Geri"si önce dersi
  kapatır (Android geri tuşu, iOS kenar kaydırmasıyla aynı sıra). Seçili sınıf
  (`rabi-konu-takibi-sekme`), açık ders ve liste kaydırması `sessionStorage`'da
  (oturumluk).
- **Tanıtım turu** "Konu konu işaretle" adımı `data-tanitim="konu-takibi"` bloğunu
  aydınlatır: sınıf sekmesi + Devam et + ilk kullanım ipucu. Turda ekran öğrencinin
  sınıfında, ders kapalı açılır.
- **Binom AYT'de**, kimliği `tyt-mat-binom` kalır; taşınan konu kimliğini korur
  (`TASINAN_KONULAR`, `takip.test.ts`).
- **Kaba başlıklar Maarif başlıklarıyla bölünür** (`BOLUNEN_KONULAR`, `kayit.ts`): Halk
  Edebiyatı → Anonim / Âşık / Dinî-Tasavvufi; Dolaşım ve Bağışıklık → Dolaşım /
  Bağışıklık. Eski kimlik parçalardan biri kalır, kaydı sürüm 1 → 2 göçünde **bir kez**
  kopyalanır. Maarif'te karşılığı olmayanlar (Cumhuriyet Dönemi, Edebî Akımlar, Divan,
  Genden Proteine) bölünmez; uydurma alt başlık yok.
- **Kayıt** `rabi-yks-konu-takibi`, sürümlü (`{ surum: 2, konular }`), işaret yerine gün
  tutar; okurken `takibiCoz` süzer. Yedeğe girer (`Yedek.yksKonuTakibi`; eski yedekte
  yoksa mevcut kayda dokunulmaz). `kayit.ts` konu içeriğini yüklemez, depo yalnız onu
  okur.
- Renk derse ait: haritada karşılığı olan ders haritadaki rengini taşır, ortak düğmelere
  `dersVurgusu` ile geçer; Felsefe ve Din, Yanlış Soru Bankası'ndaki gibi nötr.
- Testler: `okul-dersleri.test.ts` (eski programda her konu tam bir kez, Maarif'te
  "henüz yok" dışı her konu tam bir kez, alan süzgeci, birleşen satırın okuma/yazması),
  `sinif.test.ts` (tablolar, sekmeler, varsayılan sınıf), `takip.test.ts`.
