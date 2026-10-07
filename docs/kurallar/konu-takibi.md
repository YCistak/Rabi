# Konu Takibi

Rabi proje kurallarının bir parçası — dizin ve genel kurallar: [AGENTS.md](../../AGENTS.md).

Araçlar › Çalışma › **Konu Takibi** (`components/ekranlar/konu-takibi.tsx`, mantık
`lib/konu-takibi/`): TYT/AYT konuları aşama aşama işaretlenir — Haritada çalıştım,
Okulda öğrendim, Soru çözdüm ve ayrı bir Bitirdim.

- **Liste haritadan ayrı ve YKS'nin diliyle** (`liste.ts`, yayınevlerinin ortak YKS
  listesinden; ÖSYM konu listesi yayımlamıyor): banka ve deneme karnesi sınavın
  başlıklarıyla konuşuyor. **AYT'de TYT konuları tekrar yazılmaz** (iki kez
  işaretletmek takibi uzatır; ekran bunu notla söyler). Konu kimliği kayıt anahtarı:
  adı değiştir, kimliğe dokunma.
- **AYT alana göre süzülür** (`oturumDersleri`): Sayısal → Mat, Fiz, Kim, Biyo; EA →
  Mat, Edebiyat, Tarih, Coğrafya; Sözel → Edebiyat, Tarih, Coğrafya, Felsefe Grubu,
  Din; Dil → YDT. Alan `Ayarlar.puanTuru`; `null` ise AYT sekmesi alanı sorar ve
  ayarlara yazar (varsayılan alan uydurulmaz). Tarih-1/2 ve Coğrafya-1/2 tek ders; adı
  alana göre "Tarih-1" ya da "Tarih-1 ve 2".
- **"Haritada çalıştım" elle işaretlenmez:** `harita-eslemesi.ts`teki açık tablo YKS
  konusunu harita konularına bağlar; aşama haritanın kaydından (`konuTamam`) hesaplanır,
  "Haritaya git" o konunun kartıyla açar (`acilacakKonu`, sınıf farklı olsa da).
  Eşleme yalnız kartlar konunun **asıl içeriğini** anlatıyorsa; tek kartta değinmek
  yetmez. Karşılığı olmayan konuda aşama hiç gösterilmez. AYT'de TYT ile örtüşen konu
  aynı harita konusuna bağlanır (AYT Enerji ve Hareket ↔ TYT İş, Güç ve Enerji; kayıt
  tek). 12. sınıf kartları yazılınca tabloya eklenir; `takip.test.ts` iki uçtaki
  kimlikleri denetler.
- **İşaret satırda:** solda ilerleme dairesi (aşama sayısına göre yay; dokununca
  Bitirdim aç/kapa), sağda sabit genişlikte üç yuva — harita (salt okunur, boşken kesik
  kenarlı; karşılığı yoksa boş ama yer tutar), okul, soru (44 piksel dokunma alanı).
  Simgeler lucide, emoji değil; dolu hâl ders renginde dolgu, boş hâl kenarlık. Ada
  dokunmak kompakt ayrıntıyı açar (harita durumu + "Haritaya git", toplu eylem, işaret
  günleri). Bir konu en çok üç dokunuş.
- **Bitirdim engellenmez ve sormaz:** eksik aşamada pencere değil Geri al'lı bildirim
  ("Bitti · eksik: okul, soru"). Konfeti yalnız dersin son konusu bitince.
- **"Bu ve önceki konuları okulda işlendi say"** (`oncekiOkulsuzlar`): yalnız aynı
  bölümde, yalnız okul aşaması, bildirimde Geri al.
- **Özet tek segmentli çubuk** (bitti › soru › okul › kalan, her konu en ileri
  aşamasında) + tek satır sayı; yüzde ve büyük halka yok (yalnız Bitirdim'i sayan halka
  okulda işaretleyene %0 gösteriyordu).
- **Öneri müfredat sırasında** (`siradakiKonu`, `devamKonusu`): ders içi Sıradaki,
  bitmemiş **ve** aşamaları tamamlanmamış ilk konu (harita karşılığı yoksa harita
  sayılmaz). Girişteki tek "Devam et" kartı en son dokunulan dersin (bitirmek de
  dokunuş) Sıradaki'si. "En son işaretlenen yarım konu" kuralına dönme: öneri takılıyor
  ve zıplıyordu (TestFlight geri bildirimi). Aşamaları tamam ama bitmemiş konu
  (`bitirmeyeHazir`) öneri olmaz; dairesi dolu, ortada ders renginde soluk tik. Hiç
  işaret yokken ipucu ve lejant — ayar değil, kayıt boşluğundan türetilir.
- **Tek geri:** ders ekranının kendi geri düğmesi yok; kabuğun "Geri"si önce dersi
  kapatır (Android geri tuşu, iOS kenar kaydırmasıyla aynı sıra). Seçili sekme, açık
  ders ve liste kaydırması `sessionStorage`'da (oturumluk).
- **Binom AYT'de**, kimliği `tyt-mat-binom` kalır; taşınan konu kimliğini korur
  (`TASINAN_KONULAR`, `takip.test.ts`).
- **Kaba başlıklar Maarif başlıklarıyla bölünür** (`BOLUNEN_KONULAR`, `kayit.ts`): Halk
  Edebiyatı → Anonim / Âşık / Dinî-Tasavvufi; Dolaşım ve Bağışıklık → Dolaşım /
  Bağışıklık. Eski kimlik parçalardan biri kalır, kaydı sürüm 1 → 2 göçünde **bir kez**
  kopyalanır. Maarif'te karşılığı olmayanlar (Cumhuriyet Dönemi, Edebî Akımlar, Divan,
  Genden Proteine) bölünmez; uydurma alt başlık yok.
- **Ders ekranı sınıf sınıf süzülür** (`lib/konu-takibi/sinif.ts`): `9 · 10 · 11 · 12 ·
  Tümü`, haritanın sınıf sekmesinin dili (yüzde = satır dairelerinin ortalaması, kendi
  sınıfında "sen"). Konunun sınıfı eşliyse destelerin önekinden (çoğunluk, eşitlikte en
  erken), değilse `ELLE_SINIFLAR`dan (Maarif 9–11, yoksa 2018 programı). 12 haritasız:
  sekme açık, harita aşaması yok (`sinif.test.ts`). Varsayılan öğrencinin sınıfı;
  12/mezun ya da sınıfında konusu olmayan derste "Tümü". Süzgeç yalnız liste: özet,
  tempo, Sıradaki, Devam et, hızlı başlangıç bütün dersi sayar; Devam et/Sıradaki
  konunun sekmesini açar, "bu ve öncekiler" görünen listeyle sınırlı. Maarif 12
  yayımlanınca elle tablodaki "2018" satırlarına yeniden bakılmalı.
- **Kayıt** `rabi-yks-konu-takibi`, sürümlü (`{ surum: 2, konular }`), işaret yerine gün
  tutar; okurken `takibiCoz` süzer. Yedeğe girer (`Yedek.yksKonuTakibi`; eski yedekte
  yoksa mevcut kayda dokunulmaz). `kayit.ts` konu içeriğini yüklemez, depo yalnız onu
  okur.
- Renk derse ait: haritada karşılığı olan ders haritadaki rengini taşır, ortak düğmelere
  `dersVurgusu` ile geçer; Felsefe ve Din, Yanlış Soru Bankası'ndaki gibi nötr.
