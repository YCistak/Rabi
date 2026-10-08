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
  "Haritada pekiştir" o konunun kartıyla açar (`acilacakKonu`, sınıf farklı olsa da).
  Birleşen satırda iki konunun eşlemesinin birleşimi sayılır. Eşleme yalnız kartlar
  konunun **asıl içeriğini** anlatıyorsa; tek kartta değinmek yetmez. Karşılığı
  olmayan konuda aşama hiç gösterilmez. 12. sınıf kartları yazılınca tabloya eklenir;
  `takip.test.ts` iki uçtaki kimlikleri denetler.
- **Ders içi liste ve konu kartı** (tasarım D/K1a, kullanıcı onayladı 2026-10): satır tek
  dokunuşluk bir düğme; solda **dilimli halka** (harita · okul · soru üç dilim, haritasız
  konuda iki; dolu dilim ders renginde, yarım harita açık ton, bitince tam yeşil halka + tik,
  aşamalar tamamsa ortada soluk tik), ortada ad + **tek satır durum** ("Okulda gördün · soru
  çözdün", "Bitti · 20 Eyl", "Aşamalar tamam · bitirmeye hazır", "Başlamadın"), sağda ok.
  Başlıkta ders halkası + "N. sınıf · b/n bitti"; bölüm başlığında "b/n bitti" + ince çubuk;
  altta halka açıklaması. Satıra dokunmak alttan **konu kartı** açar: bölüm · sıra, konu adı,
  önceki/sonraki/kapat, yan yana üç karo **Okul · Soru · Bitti**. İşaretli karo ders renginde
  dolu (Bitti yeşil), içinde tik ve işaret günü ("8 Eki"), boşta "Dokun"; dokununca zıplar
  (`.karo-pop`). Aşamalar bağımsız, kayıt şeması aynı. Kart açıkken bildirim üstte çıkar.
  Her karo dokunuşu Geri al'lı bildirim verir ("Okulda öğrendim · bugün", "X işareti kaldırıldı").
  Haritası olan konuda kartta **"Haritada pekiştir"** (eski "Haritaya git"/"Tekrar et" yerine).
  Eski satırdaki ilerleme dairesi + sağdaki okul/soru yuvaları ve ayrıntı satırı kalktı,
  geri getirme.
- **Bitirdim engellenmez ve sormaz:** eksik aşamada pencere değil Geri al'lı bildirim
  ("Bitti · eksik: okul, soru"). Konfeti yalnız dersin **o sınıftaki** son konusu
  bitince.
- **Toplu "bu ve önceki konuları okulda işlendi say" kalktı:** kullanıcı 2026-10'da
  kaldırttı, geri getirme (`oncekiOkulsuzlar` ve testi silindi). Toplu okul yazımı yalnız
  hızlı başlangıçta (`okuluTopluYaz`).
- **Giriş ekranı (tasarım C):** sınıf sekmesi, altında iki sütunlu ders kartları (`DersKarti`: ders
  simgeli ilerleme halkası, ad, "x/y bitti"). **Girişte öneri kutusu ("Bugün sırada"/"Devam et") yok:**
  kullanıcı 2026-10'da kaldırttı, geri getirme. Girişte sınıf özeti çubuğu ve kartta
  "Sıradaki" satırı da yok: ilerleme sekmede yüzde, kartta halka + sayı olarak bir kez
  yazılır; tekrar ekleme. Halka dolumu bitti 1, soru 0,66, okul 0,33 ağırlıklı (yalnız görsel).
- **Ders ekranında özet başlıkta:** ders halkası + "N. sınıf · b/n bitti"; yüzde ve segmentli
  çubuk yok. **Tempo satırı kaldırıldı:** sınıf görünümü sınav takvimiyle konuşmuyor.
- **Ders içinde öneri ("Sıradaki") kartı yok:** kullanıcı 2026-10'da kaldırttı (girişteki
  "Bugün sırada" gibi), geri getirme. `siradakiKonu`/`devamKonusu` lib'de duruyor ama ekranda
  kullanılmıyor. Aşamaları tamam ama bitmemiş konu (`bitirmeyeHazir`) satırda soluk tikle
  ve "bitirmeye hazır" yazısıyla belli olur. Halka açıklaması her zaman altta.
- **Hızlı başlangıç** (yalnız 12/mezun): seçili sınıfta hiç işaret yokken bir kez "N.
  sınıfta neredeyim?"; seçenek o sınıfın her dersinde ilk ⌊n × oran⌋ satırı okulda
  işlendi yazar. Bayrak `rabi-konu-takibi-hizli-baslangic` sürüm 2, sınıf tutar;
  sürüm 1'de (TYT/AYT) kartı görmüş öğrenciye yeniden sorulmaz.
- **Tek geri:** ders ekranının kendi geri düğmesi yok; kabuğun "Geri"si önce dersi
  kapatır (Android geri tuşu, iOS kenar kaydırmasıyla aynı sıra). Seçili sınıf
  (`rabi-konu-takibi-sekme`), açık ders ve liste kaydırması `sessionStorage`'da
  (oturumluk).
- **Tanıtım turu** "Konu konu işaretle" adımı `data-tanitim="konu-takibi"` bloğunu
  aydınlatır: sınıf sekmesi + ilk kullanım ipucu. Turda ekran öğrencinin
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
