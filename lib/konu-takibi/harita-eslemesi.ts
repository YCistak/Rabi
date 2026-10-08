/**
 * YKS konusu → konu haritasındaki Maarif konuları.
 *
 * Konu Takibi'ndeki "Haritada çalıştım" aşaması elle işaretlenmiyor, buradan
 * hesaplanıyor: bir YKS konusunun karşılığı olan harita konularının hepsi
 * tamamlanmışsa (`lib/konu/ilerleme.ts` → `konuTamam`) aşama dolu, bir kısmı
 * okunmuşsa yarım görünüyor.
 *
 * **Eşleme yalnızca emin olunan yerde.** Yanlış bir eşleme hiç eşlememekten
 * kötü: öğrenciye "haritada çalıştın" deyip hiç okumadığı bir konuyu
 * çalışılmış göstermek, ya da tersine okuduğu konuyu boş göstermek takibin
 * kendisine güveni bitirir. Ölçü şu: harita konusunun kartları YKS
 * başlığının **asıl içeriğini** anlatıyor mu? Tek bir kartta değinip geçmek
 * yetmiyor — `mat9-denklem-esitsizlik` destesinde bir "Yaş problemleri"
 * kartı var ama "Yaş Problemleri" konusu ona eşlenmedi.
 *
 * Bir YKS konusu birden çok harita konusuna gidebilir (Basınç: dört konu)
 * ve bir harita konusu birden çok YKS konusuna (Sözcük Türleri destesi beş
 * ayrı YKS başlığını birlikte anlatıyor). Tabloda olmayan konunun haritada
 * karşılığı yok; o konuda aşama hiç gösterilmiyor.
 *
 * 12. sınıfta yalnız Matematik'in kartları yazıldı (2018 programı,
 * `lib/konu/icerik/12-matematik.ts`); AYT Matematik'in diziler, toplam-fark,
 * limit, türev, integral ve çemberin analitiği başlıkları `mat12-*`
 * destelerine bağlı; AYT Kimya'nın 12. sınıf başlıkları `kim12-*`
 * destelerine (`lib/konu/icerik/12-kimya.ts`). Öteki derslerin 12. sınıf
 * başlıkları (Cumhuriyet edebiyatı…) kartları yazılınca eklenir. `mat12-*` desteleri
 * Maarif öğrencisinin sınıf atamasını değiştirmez (`sinif.ts` →
 * `eslemeSinifi` yalnız 9–11 öneklerini okur): o konular Maarif'te yine
 * "henüz yok".
 *
 * Fizik 12 (`lib/konu/icerik/12-fizik.ts`, `fzk12-*`): AYT Fizik'in dönerek
 * öteleme, Kepler, dalga mekaniği, atom, modern fizik ve teknoloji
 * başlıkları; BHH ayrıca `fzk12-bhh`ye bağlı. Düzgün çembersel hareket
 * 11'deki desteyle kalıyor.
 *
 * AYT'de TYT ile içeriği örtüşen konular da aynı harita konularına bağlı
 * (AYT Enerji ve Hareket ↔ TYT İş, Güç ve Enerji): kayıt tek, harita
 * konusu TYT'den ya da AYT'den gidilerek bitirilmiş olsun iki satırda da
 * dolu görünüyor. Bakılıp **eşlenmeyenler**: İkinci Dereceden Denklemler
 * (Karesel Fonksiyon destesi diskriminant ve kök-katsayıya yalnızca birer
 * kartla değiniyor), Divan ve Geçiş Dönemi Edebiyatı (Mesnevi ve Dîvânu
 * Lugâti't-Türk desteleri konunun bir parçası), Sığa ve Alternatif Akım
 * (birer kart), Coğrafya'nın Türkiye'de tarım, sanayi ve çevre konuları
 * (11. sınıf desteleri Türkiye'ye özgü değil, genel kavramlar), Eşlik ve
 * Benzerlik ↔ Tales-Öklid-Pisagor destesi (Tales üç kart, gerisi dik üçgen),
 * Şiir Bilgisi ↔ Şiirde İmge (konu nazım biçimi, ölçü, uyak; imge şiir
 * çözümlemesi), Klasik Çağda Osmanlı Toplum Düzeni ve Değişim Çağında Avrupa
 * (Sömürgecilik, İsyanlar ve 1453-1683 Bilim-Kültür desteleri bu başlıkların
 * asıl içeriği değil; sınırları tartışmalı).
 *
 * `takip.test.ts` her iki uçtaki kimliklerin gerçekten var olduğunu
 * denetliyor: harita içeriği değişip bir konu kimliği kayarsa test kırılır,
 * aşama sessizce boş kalmaz.
 */
export const HARITA_ESLEMESI: Readonly<Record<string, readonly string[]>> = {
  // --- TYT Türkçe --------------------------------------------------------
  'tyt-trk-sozcukte-anlam': ['trk9-sozcuk'],
  'tyt-trk-soz-yorumu': ['trk9-soz'],
  'tyt-trk-cumlede-anlam': ['trk9-cumle'],
  'tyt-trk-paragraf': ['trk9-paragraf'],
  'tyt-trk-ses': ['trk9-ses'],
  'tyt-trk-yazim': ['trk9-yazim'],
  'tyt-trk-noktalama': ['trk9-noktalama'],
  // Sözcük Türleri destesi isim, sıfat, zamir, zarf ve edat-bağlaç-ünlemi
  // ayrı ayrı kartlarla anlatıyor.
  'tyt-trk-isim': ['trk10-sozcuk-turleri'],
  'tyt-trk-sifat': ['trk10-sozcuk-turleri'],
  'tyt-trk-zamir': ['trk10-sozcuk-turleri'],
  'tyt-trk-zarf': ['trk10-sozcuk-turleri'],
  'tyt-trk-edat': ['trk10-sozcuk-turleri'],
  // Fiiller destesi kip, kişi, yapı, çatı, ek fiil ve fiilimsiyi kapsıyor.
  'tyt-trk-fiil': ['trk10-fiil'],
  'tyt-trk-ek-fiil': ['trk10-fiil'],
  'tyt-trk-fiilimsi': ['trk10-fiil'],
  'tyt-trk-cati': ['trk10-fiil'],

  // --- TYT Matematik -----------------------------------------------------
  'tyt-mat-temel-kavramlar': ['mat9-sayi-kumeleri'],
  // Asal çarpanlara ayırma ve bölen sayısı YKS listelerinde Bölünebilme'nin
  // içinde. EBOB – EKOK asal çarpanları yalnızca araç olarak kullanıyor; ona
  // eklenmedi.
  'tyt-mat-bolunebilme': ['mat10-bolunebilme', 'mat10-asal-carpan'],
  'tyt-mat-ebob-ekok': ['mat10-ebob-ekok'],
  'tyt-mat-esitsizlik': ['mat9-denklem-esitsizlik'],
  'tyt-mat-mutlak-deger': ['mat9-mutlak-deger'],
  'tyt-mat-uslu': ['mat9-uslu-koklu'],
  'tyt-mat-koklu': ['mat9-uslu-koklu'],
  'tyt-mat-denklem': ['mat9-denklem-esitsizlik'],
  'tyt-mat-mantik': ['mat9-mantik'],
  'tyt-mat-fonksiyon': ['mat10-fonksiyon-sart', 'mat10-ters-fonksiyon'],
  // Sayma Stratejileri destesi permütasyon ve kombinasyonu anlatıyor;
  // binom açılımı yok (yalnızca Pascal üçgeni), o yüzden Binom eşlenmedi.
  'tyt-mat-permutasyon': ['mat10-sayma'],
  'tyt-mat-kombinasyon': ['mat10-sayma'],
  'tyt-mat-olasilik': ['mat9-deneysel', 'mat9-teorik'],
  'tyt-mat-istatistik': ['mat9-veri-dagilim'],
  'tyt-geo-ucgende-aci': ['mat9-ucgen-ozellik'],
  'tyt-geo-aci-kenar': ['mat9-ucgen-ozellik'],
  'tyt-geo-dik-ucgen': ['mat9-teoremler'],
  'tyt-geo-trigonometri': ['mat10-trigonometri'],
  'tyt-geo-aciortay-kenarortay': ['mat10-yardimci'],
  'tyt-geo-eslik-benzerlik': ['mat9-eslik-kosul', 'mat9-benzer-ucgen', 'mat9-benzerlik-problem'],
  'tyt-geo-ucgende-alan': ['mat10-alan'],
  'tyt-geo-cokgen': ['mat11-cokgen-sinif', 'mat11-disbukey', 'mat11-cokgen-problem'],
  'tyt-geo-dortgen': ['mat11-dortgen'],
  'tyt-geo-ozel-dortgen': ['mat11-ozel-dortgen'],

  // --- TYT Fizik ---------------------------------------------------------
  'tyt-fiz-giris': ['fzk9-bilim', 'fzk9-altdal', 'fzk9-nicelik', 'fzk9-skaler-vektorel'],
  'tyt-fiz-hareket-kuvvet': ['fzk9-hareket', 'fzk9-temel-kuvvet', 'fzk10-sabit-hiz'],
  'tyt-fiz-is-enerji': ['fzk10-is-guc', 'fzk10-enerji-bicim', 'fzk10-mekanik', 'fzk10-kaynak'],
  'tyt-fiz-isi': [
    'fzk9-ic-enerji',
    'fzk9-oz-isi',
    'fzk9-hal-degisim',
    'fzk9-isil-denge',
    'fzk9-aktarim',
    'fzk9-iletim-hizi',
  ],
  'tyt-fiz-elektrik': [
    'fzk10-devre',
    'fzk10-akim',
    'fzk10-ohm',
    'fzk10-direnc-baglama',
    'fzk10-uretec-baglama',
  ],
  'tyt-fiz-basinc': ['fzk9-basinc', 'fzk9-sivi-basinc', 'fzk9-acik-hava', 'fzk9-bernoulli'],
  'tyt-fiz-kaldirma': ['fzk9-kaldirma'],
  'tyt-fiz-dalgalar': [
    'fzk10-dalga-kavram',
    'fzk10-dalga-sinif',
    'fzk10-yayilma-surati',
    'fzk10-yansima-kirilma',
  ],
  // Maarif'te optik 11. sınıfta; YKS'de TYT konusu.
  'tyt-fiz-optik': [
    'fzk11-aydinlanma',
    'fzk11-duzlem-ayna',
    'fzk11-kuresel-ayna',
    'fzk11-kirilma',
    'fzk11-gorunur-derinlik',
    'fzk11-prizma',
    'fzk11-mercek',
  ],

  // --- TYT Kimya ---------------------------------------------------------
  'tyt-kim-bilim': ['kim9-gunluk', 'kim9-guvenlik', 'kim9-altdal'],
  'tyt-kim-atom-periyodik': ['kim9-atom-teori', 'kim9-periyodik-yer', 'kim9-periyodik-ozellik'],
  'tyt-kim-etkilesim': [
    'kim9-metalik',
    'kim9-iyonik',
    'kim9-kovalent',
    'kim9-lewis',
    'kim9-polarlik',
    'kim9-adlandirma',
    'kim9-molekuller-arasi',
  ],
  'tyt-kim-haller': ['kim9-katilar', 'kim9-sivilar'],
  // Sera etkisi, asit yağmuru, ozon: TYT'deki "Doğa ve Kimya"nın çevre kısmı.
  'tyt-kim-doga': ['kim10-atmosfer'],
  'tyt-kim-mol': ['kim10-mol'],
  'tyt-kim-tepkimeler': ['kim10-gosterge', 'kim10-olusum', 'kim10-tur', 'kim10-denklestirme'],
  'tyt-kim-hesaplamalar': ['kim10-hesap'],
  'tyt-kim-karisimlar': ['kim10-cozunme', 'kim10-cozunebilirlik', 'kim10-cozelti-sinif'],

  // --- TYT Biyoloji ------------------------------------------------------
  'tyt-biy-ortak-ozellik': ['byl9-ortak-ozellik'],
  'tyt-biy-bilesenler': ['byl9-inorganik', 'byl9-organik'],
  'tyt-biy-hucre': ['byl9-hucre-tur', 'byl9-zar', 'byl9-sitoplazma', 'byl9-sitoplazmik', 'byl9-organel'],
  'tyt-biy-madde-gecisi': ['byl9-madde-gecis'],
  'tyt-biy-siniflandirma': ['byl9-siniflandirma', 'byl9-uc-alem', 'byl9-biyocesitlilik'],
  'tyt-biy-ekosistem': ['byl10-bilesen', 'byl10-madde-enerji', 'byl10-dongu'],
  'tyt-biy-cevre': ['byl10-kisitlayan', 'byl10-saglanmasi'],

  // --- TYT Tarih ---------------------------------------------------------
  'tyt-tar-tarih-zaman': ['trh9-fayda', 'trh9-doga', 'trh9-uretim', 'trh9-dijital'],
  'tyt-tar-ilk-donemler': ['trh9-tarim', 'trh9-yonetim', 'trh9-hukuk', 'trh9-inanc'],
  'tyt-tar-orta-cag': ['trh9-goc', 'trh9-devletler', 'trh9-ticaret', 'trh9-medeniyet'],
  'tyt-tar-turk-dunyasi': ['trh9-konargocer'],
  // Teşkilat destesi (divan, ikta, gulam, Nizamülmülk, atabeylik) ilk
  // Türk-İslam devletlerinin düzenini anlatıyor; Bilim-Kültür destesi
  // Karahanlı eserleri, medrese ve Yesevi'den Mevlânâ'ya, kümbete uzanıyor —
  // iki konuya da ait. Askerî mücadeleler (Malazgirt'ten Kösedağ'a) ve sosyal
  // yaşam (ahilik, vakıf, kervansaray) Selçuklu Türkiyesi'nin.
  'tyt-tar-ilk-turk-islam': ['trh10-teskilat', 'trh10-turk-islam'],
  'tyt-tar-selcuklu': ['trh10-mucadele', 'trh10-sosyal', 'trh10-turk-islam'],
  'tyt-tar-osmanli-siyaset': ['trh10-kurulus', 'trh10-anadolu-rumeli'],
  'tyt-tar-savascilar': ['trh10-devletlesme'],
  'tyt-tar-osmanli-medeniyet': ['trh10-kalicilik', 'trh10-ilim-irfan'],
  'tyt-tar-dunya-gucu': ['trh10-siyasi'],
  'tyt-tar-merkez-teskilat': ['trh10-yonetim-degisim'],
  'tyt-tar-degisen-dengeler': ['trh11-mucadele'],
  'tyt-tar-devrimler-cagi': ['trh11-ihtilal', 'trh11-donusum'],
  'tyt-tar-sermaye-emek': ['trh11-sanayi', 'trh11-sanayilesme'],
  'tyt-tar-xx-yuzyil': ['trh11-siyasi', 'trh11-goc'],

  // --- TYT Coğrafya ------------------------------------------------------
  'tyt-cog-doga-insan': ['cog9-konu-bolum', 'cog9-nicin', 'cog9-gelisim'],
  'tyt-cog-konum': ['cog9-konum'],
  'tyt-cog-harita': ['cog9-harita'],
  'tyt-cog-iklim-bilgisi': ['cog9-hava-olay', 'cog9-iklim-sistem'],
  'tyt-cog-iklim-tipleri': ['cog9-iklim-tur'],
  'tyt-cog-ic-kuvvet': ['cog10-tektonik'],
  'tyt-cog-dis-kuvvet': ['cog10-asinma', 'cog10-asinim-birikim'],
  'tyt-cog-nufus': ['cog9-nufus-degisim', 'cog9-demografik', 'cog9-nufus-politika'],
  // "Nüfusun Dağılışı ve Hareketleri" göç türlerini, itici-çekici güçleri ve
  // Türkiye'de iç göçü anlatıyor.
  'tyt-cog-goc': ['cog9-nufus-dagilis'],
  'tyt-cog-yerlesme': ['cog10-yerlesme-kurulus', 'cog10-yerlesme-fonksiyon'],
  'tyt-cog-ekonomik': ['cog9-ekonomi-faktor', 'cog10-ekonomi-ozellik', 'cog10-sektor-gelismislik'],
  'tyt-cog-bolgeler': ['cog9-bolge'],
  'tyt-cog-afetler': ['cog9-tehlike-risk', 'cog9-afet-tur', 'cog9-afet-yonetim'],

  // --- AYT Matematik -----------------------------------------------------
  'ayt-mat-fonksiyon': ['mat11-bileske', 'mat11-dort-islem'],
  'ayt-mat-parabol': ['mat10-karesel'],
  // Deste ikinci derece eşitsizliği işaret tablosu ve çift katlı kökle
  // anlatıyor — AYT Eşitsizlikler'in asıl içeriği. Birinci derece
  // eşitsizlik (`mat9-denklem-esitsizlik`) TYT'nin.
  'ayt-mat-esitsizlik': ['mat10-denklem-problem'],
  'ayt-mat-kosullu-olasilik': ['mat10-kosullu', 'mat10-bayes'],
  'ayt-mat-trig-fonksiyon': ['mat11-trig-fonk'],
  'ayt-mat-trig-denklem': ['mat11-trig-denklem'],
  'ayt-mat-sinus-kosinus': ['mat10-sinus-kosinus'],
  'ayt-mat-logaritma': ['mat11-ustel', 'mat11-ustel-ters', 'mat11-log', 'mat11-ustel-log-denklem'],
  'ayt-geo-analitik': ['mat10-nokta', 'mat10-dogru'],
  'ayt-geo-donusum': ['mat9-donusum'],
  // 12. sınıf (2018 programı) desteleri.
  'ayt-mat-trig-formul': ['mat12-toplam-fark'],
  'ayt-mat-diziler': ['mat12-dizi', 'mat12-aritmetik', 'mat12-geometrik'],
  'ayt-mat-limit': ['mat12-limit'],
  'ayt-mat-turev': ['mat12-turev', 'mat12-turev-uygulama'],
  'ayt-mat-integral': ['mat12-belirsiz-integral', 'mat12-belirli-integral'],
  'ayt-geo-cember-analitik': ['mat12-cember'],
  // 12. sınıf Tarih (2018 programı): Millî Mücadele'den küreselleşmeye.
  'tyt-tar-milli-mucadele': ['trh12-mondros', 'trh12-hazirlik', 'trh12-tbmm', 'trh12-dogu-guney', 'trh12-bati', 'trh12-diplomasi'],
  'tyt-tar-ataturkculuk': ['trh12-ilkeler', 'trh12-siyasi', 'trh12-hukuk', 'trh12-egitim', 'trh12-toplumsal', 'trh12-ekonomi'],
  'ayt-tar-iki-savas-arasi': ['trh12-ic-politika', 'trh12-dis-politika', 'trh12-iki-savas-dunya'],
  'ayt-tar-ikinci-dunya': ['trh12-ikinci-seyir', 'trh12-ikinci-turkiye', 'trh12-ikinci-sonuc'],
  'ayt-tar-soguk-savas': ['trh12-bloklar', 'trh12-sogukdogu', 'trh12-tr-1945-1960'],
  'ayt-tar-toplumsal-devrim': ['trh12-yumusama', 'trh12-ortadogu-petrol', 'trh12-tr-1960-1980'],
  'ayt-tar-xxi-yuzyil': ['trh12-sscb', 'trh12-asya-kuresel', 'trh12-balkan-ortadogu', 'trh12-ab-turkiye', 'trh12-tr-1980-sonrasi'],

  // --- AYT Fizik ---------------------------------------------------------
  'ayt-fiz-vektor': ['fzk9-vektor'],
  'ayt-fiz-newton': ['fzk11-newton', 'fzk11-surtunme'],
  'ayt-fiz-sabit-ivme': ['fzk10-sabit-ivme', 'fzk11-serbest'],
  // AYT'nin iş, enerji ve korunumu (yay enerjisi dahil) TYT'deki İş, Güç ve
  // Enerji ile aynı desteler; haritada okunmuşsa iki satırda da dolu.
  'ayt-fiz-enerji-hareket': ['fzk10-is-guc', 'fzk10-mekanik'],
  // Periyodik Hareketler basit ve yay sarkacının periyodunu anlatıyor
  // (T = 2π√(L/g), T = 2π√(m/k)) — AYT'de BHH sorularının çekirdeği.
  'ayt-fiz-bhh': ['fzk10-periyodik', 'fzk12-bhh'],
  'ayt-fiz-iki-boyut': ['fzk11-iki-boyut'],
  'ayt-fiz-elektrik-alan': ['fzk11-elektrik-alan'],
  'ayt-fiz-induksiyon': ['fzk11-manyetik', 'fzk11-induksiyon'],
  'ayt-fiz-transformator': ['fzk11-transformator'],
  'ayt-fiz-cembersel': ['fzk11-cembersel'],
  // 12. sınıf (2018 programı) desteleri. Düzgün çembersel hareket 11'de.
  'ayt-fiz-donerek-oteleme': ['fzk12-donerek-oteleme', 'fzk12-acisal-momentum'],
  'ayt-fiz-kepler': ['fzk12-kutle-cekim', 'fzk12-kepler'],
  'ayt-fiz-dalga-mekanigi': ['fzk12-su-girisim', 'fzk12-isik-girisim', 'fzk12-doppler', 'fzk12-em-dalga'],
  'ayt-fiz-atom': [
    'fzk12-atom-model',
    'fzk12-uyarilma',
    'fzk12-buyuk-patlama',
    'fzk12-radyoaktivite',
    'fzk12-nukleer',
  ],
  'ayt-fiz-modern': ['fzk12-gorelilik', 'fzk12-siyah-cisim', 'fzk12-fotoelektrik', 'fzk12-compton'],
  'ayt-fiz-modern-teknoloji': [
    'fzk12-goruntuleme',
    'fzk12-yari-iletken',
    'fzk12-super-iletken',
    'fzk12-nano',
    'fzk12-laser',
  ],

  // --- AYT Kimya ---------------------------------------------------------
  'ayt-kim-modern-atom': ['kim9-orbital'],
  'ayt-kim-gazlar': ['kim10-gaz-ozellik', 'kim10-gaz-yasa', 'kim10-ideal', 'kim10-graham'],
  'ayt-kim-cozeltiler': ['kim10-cozunurluk', 'kim10-etkileyen', 'kim10-derisim', 'kim10-koligatif'],
  'ayt-kim-enerji': [
    'kim11-enerji-degisim',
    'kim11-enerji-kaynagi',
    'kim11-bag-entalpi',
    'kim11-olusum-entalpisi',
  ],
  'ayt-kim-hiz': ['kim11-hiz-sartlar', 'kim11-ortalama-hiz', 'kim11-hiz-faktor', 'kim11-hiz-denklemi'],
  'ayt-kim-denge': [
    'kim11-tersinir',
    'kim11-fiziksel-denge',
    'kim11-denge-sabiti',
    'kim11-tepkime-orani',
    'kim11-denge-faktor',
  ],
  'ayt-kim-asit-baz': [
    'kim11-otoiyonizasyon',
    'kim11-asit-baz-teori',
    'kim11-asit-kuvvet',
    'kim11-ph',
    'kim11-notrallesme',
    'kim11-titrasyon',
  ],
  'ayt-kim-cozunurluk': ['kim11-molar-cozunurluk', 'kim11-kcc', 'kim11-cozunurluk-faktor'],
  // 12. sınıf (2018 programı) desteleri. Enerji Kaynakları'nın nanoteknoloji ve
  // sürdürülebilirlik kısmı 9–11 destelerinde; o desteler eklenmedi (Maarif
  // sınıfını 11'e çekerdi), fosil ve alternatif destesi asıl içeriği anlatıyor.
  'ayt-kim-elektrik': [
    'kim12-redoks',
    'kim12-hucre',
    'kim12-potansiyel',
    'kim12-pil',
    'kim12-elektroliz',
    'kim12-korozyon',
  ],
  'ayt-kim-karbon': ['kim12-organik', 'kim12-formul', 'kim12-allotrop', 'kim12-hibrit'],
  'ayt-kim-organik': [
    'kim12-alkan',
    'kim12-alken',
    'kim12-alkin',
    'kim12-aromatik',
    'kim12-fonksiyonel',
    'kim12-alkol',
    'kim12-karbonil',
    'kim12-karboksilik',
    'kim12-ester',
  ],
  'ayt-kim-enerji-kaynaklari': ['kim12-fosil', 'kim12-alternatif'],

  // --- AYT Biyoloji ------------------------------------------------------
  'ayt-biy-sinir': ['byl11-noron', 'byl11-sinaps', 'byl11-insan-sinir', 'byl11-refleks'],
  'ayt-biy-endokrin': ['byl11-endokrin'],
  'ayt-biy-duyu': ['byl11-uyarti-alma', 'byl11-duyu-organ', 'byl11-yorumlama'],
  'ayt-biy-destek-hareket': [
    'byl11-kemik',
    'byl11-eklem-kas',
    'byl11-kemik-kas-birlikte',
    'byl11-kasilma-kontrol',
    'byl11-kasilma-mekanizma',
  ],
  'ayt-biy-sindirim': ['byl10-sindirim', 'byl10-sindirim-yapi', 'byl10-insan-sindirim', 'byl10-emilim'],
  'ayt-biy-dolasim': ['byl11-dolasim-homeo'],
  'ayt-biy-bagisiklik': ['byl11-dogal-bagisiklik', 'byl11-kazanilmis'],
  'ayt-biy-solunum': ['byl11-solunum-homeo'],
  'ayt-biy-uriner': ['byl11-bosaltim-homeo'],
  'ayt-biy-komunite': ['byl10-etkilesim', 'byl10-suksesyon', 'byl10-populasyon'],
  'ayt-biy-enerji': ['byl10-fotosentez', 'byl10-kemosentez', 'byl10-solunum', 'byl10-fermantasyon'],
  // 12. sınıf (2018 programı) desteleri. Enerji ünitesi 10'un destelerinde kaldı.
  'ayt-biy-genden-proteine': [
    'byl12-nukleik-kesif',
    'byl12-nukleik-yapi',
    'byl12-genetik-organizasyon',
    'byl12-dna-eslenme',
    'byl12-transkripsiyon',
    'byl12-translasyon',
    'byl12-biyoteknoloji',
    'byl12-biyotek-uygulama',
  ],
  'ayt-biy-bitki': [
    'byl12-bitki-doku',
    'byl12-kok-govde-yaprak',
    'byl12-su-emilim',
    'byl12-ksilem',
    'byl12-floem',
    'byl12-cicek',
    'byl12-dollenme',
    'byl12-cimlenme',
  ],
  'ayt-biy-canlilar-cevre': ['byl12-cevre-genetik', 'byl12-yapay-secilim'],

  // --- AYT Edebiyat ------------------------------------------------------
  'ayt-edb-guzel-sanatlar': ['trk9-edebiyat'],
  'ayt-edb-siir-bilgisi': ['trk9-siir', 'trk10-ahenk'],
  'ayt-edb-soz-sanatlari': ['trk9-sanat'],
  'ayt-edb-anlatmaya-bagli': ['trk9-yapi', 'trk9-anlatici', 'trk9-hikaye'],
  'ayt-edb-masal-fabl': ['trk10-masal'],
  'ayt-edb-ogretici': ['trk9-deneme', 'trk11-mektup', 'trk11-biyografi'],
  'ayt-edb-tiyatro': ['trk9-tiyatro', 'trk11-karagoz', 'trk11-tiyatro'],
  'ayt-edb-islamiyet-oncesi': ['trk10-destan', 'trk11-orhun'],
  'ayt-edb-halk': ['trk10-anonim'],
  'ayt-edb-halk-asik': ['trk11-asik'],
  'ayt-edb-milli': ['trk10-milli', 'trk10-milli-turler'],

  // --- AYT Coğrafya ------------------------------------------------------
  'ayt-cog-nufus-politika': ['cog9-nufus-politika'],
  'ayt-cog-sehirler': ['cog11-yerlesme', 'cog11-etki-alani'],
  'ayt-cog-turkiye-ekonomi': ['cog10-turkiye-ekonomi'],
  'ayt-cog-maden-enerji': ['cog11-maden', 'cog11-enerji'],
  'ayt-cog-kultur': ['cog10-turk-kultur'],
  // 9. sınıfın destesi sera etkisi, Kyoto ve Türkiye'ye etkileri; 11.'nin
  // azaltım, uyum ve iklim adaleti. İkisi birlikte konunun tamamı.
  'ayt-cog-iklim-degisimi': ['cog9-iklim-degisim', 'cog11-iklim'],
  // 12. sınıf (2018 programı) desteleri. Küresel ve Bölgesel Örgütler eşlenmedi:
  // 12 destelerinde BM/NATO/AB örgütleri ayrı bir deste değil (AB ve KEİ birer kart).
  'ayt-cog-ulasim-ticaret': ['cog12-ulasim-faktor', 'cog12-ulasim-turkiye', 'cog12-turkiye-ticaret', 'cog12-turizm-sembol', 'cog12-turizm-ekonomi'],
  'ayt-cog-jeopolitik': ['cog12-konum-etki', 'cog12-turkiye-jeopolitik', 'cog12-jeopolitik-bolge'],
  'ayt-cog-ekstrem': ['cog12-ekstrem'],
  'ayt-cog-cevre': ['cog12-cevre-sinir', 'cog12-cevre-politika', 'cog12-orgut-anlasma'],
}
