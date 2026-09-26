import type { KonuDerinligi } from './11-yardimci'

/** Her ek kart ayrı bir neden, sonuç veya kaynak okuma becerisini açar. */
export const tarihDerinligi: Record<string, KonuDerinligi> = {
  'trh11-mucadele': {
    kartlar: [
      ['Karlofça’nın anlamı', 'Karlofça yalnız toprak kaybı değildi.\nOsmanlı diplomaside geniş bir koalisyonla aynı masaya oturdu.'],
      ['Rusya’nın hedefi', 'Rusya sıcak denizlere inmek için Karadeniz çevresinde güç aradı.\nAzak ve Kırım bu yüzden önemliydi.'],
      ['Belgrad neden iki kez?', 'Belgrad 1718’de kaybedildi, 1739’da geri alındı.\nAynı kentin iki antlaşmada farklı tarafta olması dönemin dengesini gösterir.'],
      ['Kırım’ın üç aşaması', '1774: bağımsızlık kabul edildi.\n1783: Rusya ilhak etti.\n1792: Osmanlı Yaş Antlaşması’yla ilhakı tanıdı.'],
    ],
    iddialar: [
      ['Belgrad’ın 1739’da geri alınması, 1718’deki kaybın kalıcı olmadığını gösterir.', true, 'İki antlaşmanın sonucu birlikte okunmalı.'],
      ['1774 antlaşması Kırım üzerindeki Rus etkisini artırsa da ilhak 1783’te gerçekleşti.', true, 'Bağımsızlık kararı ile ilhak ayrı aşamalardır.'],
    ],
    secimler: [
      ['Belgrad’ın 1718 ve 1739’daki durumu neyi gösterir?', 'Askerî dengenin değiştiğini', 'Sınırın hiç değişmediğini', 'Kent kaybedildi, sonra geri alındı.'],
      ['Rusya açısından Azak ve Kırım’ın ortak önemi?', 'Karadeniz’e erişim', 'Akdeniz adalarına doğrudan hâkimiyet', 'İki bölge Karadeniz çevresindedir.'],
      ['1774 için hangi ifade daha doğru?', 'Kırım bağımsız sayıldı', 'Kırım Rusya’ya ilhak edildi', 'İlhak dokuz yıl sonra oldu.'],
      ['Osmanlı, Kırım’ın ilhakını hangi aşamada tanıdı?', 'Yaş Antlaşması’nda', 'Prut Antlaşması’nda', '1792 Yaş Antlaşması ilhakı kabul etti.'],
      ['Karlofça’yı dönüm noktası yapan ne?', 'Koalisyona karşı büyük kayıp', 'Tek cephede kazanılan zafer', 'Avrupa’da geniş toprak kaybı kabul edildi.'],
    ],
    kontrol: ['Kırım’ın bağımsız sayılması ile ilhakı arasındaki ilişki?', 'Ayrı tarihlerde yaşandı', 'Aynı antlaşmada tamamlandı', '1774 kararını 1783 ilhakı izledi.'], kontrolKarti: 10,
  },
  'trh11-lale': {
    kartlar: [
      ['Sefaretnâme', 'Elçinin gözlemleri yazıya geçirildi.\nAvrupa’yı yalnız savaş rakibi değil, kurumları incelenecek bir çevre olarak görme arttı.'],
      ['Basımın etkisi', 'Türkçe basım kitapların çoğaltılmasını hızlandırdı.\nEl yazması üretim bir anda ortadan kalkmadı.'],
      ['Yeniliğin sınırı', 'Yenilikler özellikle saray ve kent çevresinde görünürdü.\nToplumun tüm kesimlerinde aynı hızla yayılmadı.'],
      ['İsyanı anlamak', 'Patrona Halil İsyanı yalnız lale bahçelerine tepki değildi.\nEkonomik ve siyasal hoşnutsuzluk da etkiliydi.'],
    ],
    iddialar: [
      ['Sefaretnâmeler Avrupa kurumlarının gözlemlenmesine aracılık etti.', true, 'Elçi gördüklerini yazıyla aktardı.'],
      ['Patrona Halil İsyanı’nı yalnız eğlenceye bağlamak dönemin sosyal tepkilerini eksik açıklar.', true, 'Siyasal ve ekonomik hoşnutsuzluk da vardı.'],
    ],
    secimler: [
      ['Paris elçiliğinin yenilikler açısından işlevi?', 'Kurumları gözlemlemek', 'Fransa’yı yönetmek', 'Gözlemler sefaretnâmeye yansıdı.'],
      ['Matbaa hakkında hangi çıkarım güvenli?', 'Türkçe basımı hızlandırdı', 'Bütün el yazmalarını bitirdi', 'İki üretim biçimi bir süre birlikte yaşadı.'],
      ['Lale Devri yenilikleri için hangi sınır var?', 'Yayılımı toplumsal olarak eşitsizdi', 'Bütün köylere aynı anda ulaştı', 'Saray ve kent çevresinde daha görünürdü.'],
      ['Patrona Halil İsyanı nasıl açıklanmalı?', 'Birden çok hoşnutsuzlukla', 'Yalnız yenileşme karşıtlığıyla', 'Ekonomik ve siyasal tepkiler de etkiliydi.'],
      ['Sefaretnâme ile matbaa arasındaki ortak yön?', 'Bilgi dolaşımını artırmaları', 'Askerî ocak olmaları', 'Gözlem ve basım bilginin yayılmasını etkiledi.'],
    ],
    kontrol: ['Sefaretnâme hangi bilginin kaynağıdır?', 'Elçinin gözlemlerinin', 'Vergi cetvelinin', 'Elçi ziyaretinde gördüklerini aktarır.'], kontrolKarti: 7,
  },
  'trh11-depremler': {
    kartlar: [
      ['Aynı tehlike, farklı etki', 'Deprem tehlikesi doğaldır; yıkım yapı ve hazırlıkla değişir.\nİki kentin sonuçları bu yüzden doğrudan eşitlenmez.'],
      ['Kıyı farkı', 'Lizbon’un okyanus kıyısı tsunami etkisini büyüttü.\nİstanbul’da hasar değerlendirmesi başka yerel koşullara bakar.'],
      ['Onarım önceliği', 'Gıda, su, barınma ve ulaşım ilk günlerde gerekir.\nAnıtların onarımı daha uzun bir süreçtir.'],
      ['Kaynak karşılaştırma', 'Yıkılan yapı sayısı ile kişisel tanıklık farklı bilgi verir.\nİkisini birlikte okumak afetin toplumsal boyutunu açar.'],
    ],
    iddialar: [
      ['Aynı büyüklükte iki deprem, yapıların niteliği farklıysa aynı hasarı vermeyebilir.', true, 'Kırılganlık hasarı etkiler.'],
      ['Lizbon’daki tsunami, iki kentin afet sonuçlarını karşılaştırırken dikkate alınmalıdır.', true, 'İkincil tehlike toplam etkiyi büyüttü.'],
    ],
    secimler: [
      ['İki depremi karşılaştırırken hangi ikili gerekir?', 'Tehlike ve kırılganlık', 'Yalnız tarih ve saat', 'Yıkım yerleşim koşullarıyla değişir.'],
      ['Lizbon’da kıyı konumu hangi sonucu büyüttü?', 'Tsunami etkisini', 'Artçı sarsıntı sayısını', 'Kıyıdaki dalgalar hasarı artırdı.'],
      ['Afetin ilk günlerinde hangisi önceliklidir?', 'Güvenli barınma', 'Kalıcı yeniden imar planı', 'Yaşam gereksinimleri önce gelir.'],
      ['Tanıklık ile hasar sayısı nasıl kullanılır?', 'Birbirini tamamlayan kaynaklar', 'Birbirini her zaman geçersiz kılar', 'Nitel ve nicel bilgi birlikte okunabilir.'],
      ['Yalnız deprem büyüklüğüne bakmak neyi gizler?', 'Yapı ve hazırlık farkını', 'Yer sarsıntısını', 'Aynı tehlikenin farklı toplumsal etkileri olabilir.'],
    ],
    kontrol: ['Depremde kırılganlığı artıran nedir?', 'Dayanıksız yapı', 'Güçlendirilmiş yapı', 'Yapının niteliği hasarı etkiler.'], kontrolKarti: 7,
  },
  'trh11-sanayi': {
    kartlar: [
      ['Atölyeden fabrikaya', 'Atölyede üretim küçük ölçekte ve ustaya bağlıydı.\nFabrika makineleri işin hızını ve düzenini değiştirdi.'],
      ['Üretim zinciri', 'Ham madde, enerji, emek, taşıma ve pazar birlikte gerekir.\nZincirin bir halkası aksarsa üretim yavaşlar.'],
      ['İşçi sorunu', 'Fabrika büyürken güvenli çalışma ve ücret tartışmaları doğdu.\nSendika ve iş hukuku arayışı bu zeminde güçlendi.'],
      ['Yeni eşitsizlikler', 'Üretim artışı herkese aynı refahı sağlamadı.\nKentte gelir ve yaşam koşulları arasında büyük farklar oluştu.'],
    ],
    iddialar: [
      ['Ulaşımın hızlanması fabrikanın uzak pazarlara satışını kolaylaştırdı.', true, 'Demiryolu taşıma maliyetini ve süresini etkiledi.'],
      ['Fabrika üretimindeki artış, işçi hakları tartışmalarını gereksiz kıldı.', false, 'Çalışma koşulları hak arayışlarını artırdı.'],
    ],
    secimler: [
      ['Buharlı tren üretim zincirinin hangi halkasını etkiledi?', 'Taşıma', 'Toprağın oluşumu', 'Mal ve ham maddeyi hızlı taşıdı.'],
      ['Atölyeden fabrikaya geçişin temel farkı?', 'Makineyle büyük ölçek', 'Aynı hızda el üretimi', 'Makine üretim miktarını artırdı.'],
      ['Kentte işçi sayısı artarken hangi ihtiyaç büyüdü?', 'Konut ve sağlık', 'Feodal ayrıcalık', 'Göç kent hizmetlerine talebi artırdı.'],
      ['Sanayi devletlerinin ham madde arayışı hangi ilişkiyi güçlendirdi?', 'Sömürge rekabetini', 'Kapalı yerel pazarı', 'Üretim girdisi dış kaynak arayışını artırdı.'],
      ['Üretim artıp işçi yoksulluğu sürüyorsa hangi sonuç çıkar?', 'Refah eşit dağılmadı', 'Üretim hiç artmadı', 'Toplam üretim ile dağılım ayrı ölçüdür.'],
    ],
    kontrol: ['Fabrikanın sürekliliği için hangisi gerekir?', 'Ham madde ve pazar', 'Yalnız üretim kapasitesi', 'Üretim zincirinin girdisi ve alıcısı olmalı.'], kontrolKarti: 8,
  },
  'trh11-ihtilal': {
    kartlar: [
      ['Eski düzenin yükü', 'Vergi yükünün eşitsizliği ve temsil eksikliği tepki doğurdu.\nMali kriz bu gerilimi artırdı.'],
      ['Yurttaşlık fikri', 'Hakların hanedan üyeliğine değil yurttaşlığa bağlanması tartışıldı.\nBu ilke uygulamada zamanla genişledi.'],
      ['İki farklı sonuç', 'Özgürlük ve eşitlik fikri reform talebini besledi.\nMilliyetçilik ise çok uluslu yapılarda ayrılık talebini büyüttü.'],
      ['Osmanlıcılık yanıtı', 'Farklı toplulukları ortak yurttaşlıkta tutma düşüncesi gelişti.\nBu, milliyetçilik baskısına verilen yanıtlardan biriydi.'],
    ],
    iddialar: [
      ['Eşit yurttaşlık fikri ile milliyetçilik Osmanlı’da aynı sonucu doğurmadı.', true, 'Biri birleştirme, diğeri ayrılık talebine yol açabildi.'],
      ['Mali kriz siyasal temsil tartışmalarından tamamen bağımsızdı.', false, 'Vergi ve temsil sorunu birlikte yaşandı.'],
    ],
    secimler: [
      ['Vergi yüküne itiraz hangi daha geniş soruya bağlandı?', 'Siyasal temsile', 'Verginin tamamen kaldırılmasına', 'Vergi verenlerin söz hakkı tartışıldı.'],
      ['Osmanlıcılığın milliyetçilik karşısındaki hedefi?', 'Ortak yurttaşlık', 'Her topluluğa ayrı devlet', 'Dağılmayı önlemeye çalıştı.'],
      ['İhtilal fikirleri çok uluslu devlette hangi gerilimi yaratabilir?', 'Birlik ile ayrılık gerilimi', 'Yalnız vergi toplama sorunu', 'Hak ve milliyet talepleri farklı yönlere gidebildi.'],
      ['Hak bildirgesi için hangi yorum daha temkinli?', 'İlke ile uygulama ayrılmalı', 'Herkes hemen eşit hak aldı', 'Hakların yayılması zaman aldı.'],
      ['Napolyon savaşları fikirlerin yayılmasını nasıl etkiledi?', 'Avrupa’ya taşıdı', 'Fransa içinde hapsetti', 'Savaşlar ve yönetim değişimi fikirleri yaydı.'],
    ],
    kontrol: ['Osmanlıcılık hangi soruna yanıt aradı?', 'Toplulukları bir arada tutmaya', 'Toplulukların bağımsızlığını hızlandırmaya', 'Ortak yurttaşlıkla birliği korumak istedi.'], kontrolKarti: 10,
  },
  'trh11-donusum': {
    kartlar: [
      ['Merkezîleşme', 'II. Mahmud taşradaki güç odaklarını sınırlamaya çalıştı.\nYeni kurumlarla kararları merkezden yürütme arttı.'],
      ['Ferman ile anayasa', 'Tanzimat ve Islahat fermanları hak düzenlemeleridir.\nKanun-ı Esasi meclisli anayasal düzenin belgesidir.'],
      ['Temsilin sınırı', '1876’da meclis açıldı ama padişahın geniş yetkileri sürdü.\nAnayasa ilanı tam demokratik yönetim demek değildi.'],
      ['Dış baskı ve iç ihtiyaç', 'Reformlar yalnız dış devletlerin isteğiyle açıklanamaz.\nVergi, ordu ve yönetim sorunları içeride de değişim gerektirdi.'],
    ],
    iddialar: [
      ['1839 ve 1876 belgeleri aynı işlevi görmedi; biri hak güvencesini, diğeri meclisli düzeni öne çıkardı.', true, 'Tanzimat ile Kanun-ı Esasi farklı aşamalardır.'],
      ['Meclisin 1876’da açılması padişahın bütün yetkilerinin kaldırıldığı anlamına gelir.', false, 'Padişahın yetkileri sürdü.'],
    ],
    secimler: [
      ['Bir reformun meclis açtığı söyleniyorsa hangisiyle ilişkili?', 'I. Meşrutiyet', 'Tanzimat Fermanı', '1876 anayasa ve meclis dönemidir.'],
      ['Yeniçeri Ocağı’nın kaldırılması hangi ihtiyaca bağlıydı?', 'Ordu ve merkezî yönetim reformu', 'Meclisli yönetime geçiş', 'II. Mahmud askerî ve idarî düzeni yeniledi.'],
      ['Islahat Fermanı’nın Tanzimat’tan belirgin odağı?', 'Gayrimüslim tebaanın hakları', 'İlk anayasanın yazılması', '1856 düzenlemesi bu haklara odaklandı.'],
      ['Reformların nedenini açıklarken hangi ikili gerekir?', 'İç sorunlar ve dış baskı', 'Yalnız dış devletlerin talepleri', 'İki etken birlikte çalıştı.'],
      ['1908’deki değişim 1876’ya göre ne yaptı?', 'Meclisi yeniden açtı', 'İlk anayasayı yazdı', 'Kanun-ı Esasi 1876’da ilan edilmişti.'],
    ],
    kontrol: ['Ferman ile anayasa arasındaki fark?', 'Meclisli düzen anayasa ile kuruldu', 'Her ikisi de meclisi ilk kez açtı', 'Kanun-ı Esasi meclisi açan anayasal belgedir.'], kontrolKarti: 8,
  },
  'trh11-bilim': {
    kartlar: [
      ['Okuldan mesleğe', 'Modern okul teknik bilgiyle memur, hekim ve mühendis yetiştirdi.\nYeni meslekler yönetimi de değiştirdi.'],
      ['Telgrafın siyaseti', 'Haberin hızlanması kriz ve savaş kararlarını etkiledi.\nMerkez taşradan daha çabuk bilgi alabildi.'],
      ['Demiryolunun ekonomisi', 'Ürün pazara daha kolay taşındı; hat çevresinde yeni ilişkiler kuruldu.\nBütün bölgeler eşit yararlanmadı.'],
      ['Basında tartışma', 'Gazete yalnız haber vermedi; yeni fikirlerin tartışıldığı alan oldu.\nOkur ve yazar ilişkisi değişti.'],
    ],
    iddialar: [
      ['Telgrafın etkisi yalnız mesaj sayısında değil, yönetimin karar hızında da görüldü.', true, 'Merkez-taşra haberleşmesi hızlandı.'],
      ['Demiryolu hattı geçen ve geçmeyen bölgeleri aynı ölçüde etkiledi.', false, 'Erişim farkı ekonomik sonucu değiştirdi.'],
    ],
    secimler: [
      ['Taşradan merkeze hızlı haber ulaşıyorsa hangi araç etkili?', 'Telgraf', 'Demiryolu', 'Demiryolu taşıma, telgraf haberleşme aracıdır.'],
      ['Yeni teknik okulun doğrudan sonucu?', 'Uzman işgücü', 'Geleneksel eğitimin hemen bitmesi', 'Mesleki uzmanlık kurumsallaştı.'],
      ['Ürünlerin iç pazara daha hızlı gitmesi neyle ilgili?', 'Demiryolu', 'Gazete', 'Demiryolu mal taşımayı hızlandırdı.'],
      ['Gazetenin fikir hayatındaki rolü?', 'Tartışma alanı açması', 'Sadece devlet vergisi toplaması', 'Yeni görüşler okura ulaştı.'],
      ['Romanın yayılmasında hangi ikili etkiliydi?', 'Çeviri ve basın', 'Telgraf ve gümrük', 'Yeni türler çeviri ve yayınla tanındı.'],
    ],
    kontrol: ['Telgrafın merkezî yönetim için değeri?', 'Hızlı haber', 'Yük taşıma', 'Karar için bilgi daha hızlı ulaştı.'], kontrolKarti: 8,
  },
  'trh11-sanayilesme': {
    kartlar: [
      ['Rekabetin dengesizliği', 'Avrupa fabrikası büyük miktarı ucuza üretebildi.\nKüçük atölyenin aynı fiyatta yarışması zordu.'],
      ['Koruma sorunu', 'Ticaret koşulları yerli üreticiyi korumayı güçleştirdi.\nGümrük kararı sanayi politikasıyla ilişkilidir.'],
      ['Devletin denemesi', 'Fabrika açmak üretimi başlatır ama makine bakımı ve uzman gerekir.\nSüreklilik bunlara bağlıdır.'],
      ['Katma değer', 'Ham maddeyi işlenmiş mala dönüştürmek daha çok beceri ister.\nYalnız kaynak satışı sanayi kurmak değildir.'],
    ],
    iddialar: [
      ['Yerli üretim için fabrika binası yanında pazar ve uzmanlık da gerekir.', true, 'Üretim bir zincirdir.'],
      ['Düşük gümrükler ithal malların yerli atölyelerle rekabetini etkileyebilir.', true, 'Fiyat dengesi değişebilir.'],
    ],
    secimler: [
      ['Yerel atölye neden baskı altında kaldı?', 'Ucuz seri üretimle yarıştı', 'Üretim maliyeti sıfırlandı', 'Fabrika ölçeği fiyat avantajı yarattı.'],
      ['Devlet fabrikasının kalıcı olması için ne gerekir?', 'Uzman, sermaye ve pazar', 'Yalnız başlangıç sermayesi', 'Üretimin girdisi ve alıcısı olmalı.'],
      ['Ham pamuk satmakla kumaş üretmek arasındaki fark?', 'İşleme ve katma değer', 'Yalnız satılan miktar', 'İşleme yeni değer ekler.'],
      ['Düyun-ı Umumiye sanayi yatırımını nasıl dolaylı etkiler?', 'Mali hareket alanını daraltır', 'Bedava sermaye sağlar', 'Gelir denetimi bütçeyi sınırlar.'],
      ['İthalata karşı yerliyi koruma aracı hangisi?', 'Gümrük politikası', 'İthalat vergisini azaltmak', 'İthal malın fiyatını ticaret koşulları etkiler.'],
    ],
    kontrol: ['Ucuz ithal malın etkisi hangi üreticide görülür?', 'Yerli atölyede', 'Yalnız ithalatçı tüccarda', 'Atölye fabrika malıyla fiyat rekabetine girer.'], kontrolKarti: 7,
  },
  'trh11-siyasi': {
    kartlar: [
      ['1908 ve 1909 farkı', '1908’de meclis yeniden açıldı.\n1909’da 31 Mart Olayı bastırıldı ve II. Abdülhamid tahttan indirildi.'],
      ['Trablusgarp bağlantısı', 'Osmanlı deniz gücü zayıf olduğu için bölgeye düzenli ordu taşıyamadı.\nSubaylar yerel direnişi örgütledi.'],
      ['Balkan kaybının etkisi', 'Toprak kaybı büyük göç doğurdu ve orduda yenilenme ihtiyacını artırdı.\nEdirne ikinci savaşta geri alındı.'],
      ['Savaşın kapanışı', 'Mondros bir ateşkesti; barış antlaşması değildi.\nSilah bırakma ve işgallere uzanan bir dönem başlattı.'],
    ],
    iddialar: [
      ['Trablusgarp’ta yerel direnişin örgütlenmesi, Osmanlı’nın düzenli ordu gönderme güçlüğüyle ilişkilidir.', true, 'Deniz ulaşımındaki zorluk belirleyiciydi.'],
      ['Mondros, savaş sonunda imzalanan bir barış antlaşmasıydı.', false, '1918’de imzalanan ateşkesti.'],
    ],
    secimler: [
      ['1908 ve 1909 olayları nasıl ayrılır?', 'Meclisin açılması ve isyanın bastırılması', 'İkisi de aynı savaşın iki cephesi', 'II. Meşrutiyet ile 31 Mart farklı olaydır.'],
      ['Trablusgarp’ta yerel direniş neden öne çıktı?', 'Düzenli ordu taşıma güçlüğü', 'Bölgenin Osmanlı başkenti olması', 'Deniz gücü ve uzaklık sevki zorlaştırdı.'],
      ['Edirne hangi Balkan Savaşı’nda geri alındı?', 'İkinci', 'Birinci', 'Balkan devletlerinin çatışması fırsat yarattı.'],
      ['Mondros için hangi niteleme doğru?', 'Ateşkes', 'Kalıcı barış', '1918’de silah bırakma koşulları belirlendi.'],
      ['Balkan kaybıyla hangi toplumsal sonuç bağlantılı?', 'Rumeli’den göç', 'Lizbon’dan göç', 'Savaş bölgeden Anadolu’ya göç doğurdu.'],
    ],
    kontrol: ['1918’de savaşın bitiş belgesi?', 'Mondros Ateşkesi', 'Uşi Antlaşması', 'Uşi 1912 Trablusgarp sonudur.'], kontrolKarti: 10,
  },
  'trh11-goc': {
    kartlar: [
      ['Göç tek nedenli değil', 'Savaş, güvenlik kaybı ve geçim sorunu birlikte etkili oldu.\nAynı aile farklı nedenlerle yer değiştirmiş olabilir.'],
      ['Nüfusun yeniden dağılışı', 'Gelenlerin yerleşimi konut ve tarım alanı ihtiyacını artırdı.\nKent ile kırsal farklı tepkiler verdi.'],
      ['Salgın zinciri', 'Temiz su eksikliği ve kalabalık barınma bulaşmayı kolaylaştırır.\nSağlık hizmetine erişim koruyucu etkendir.'],
      ['Kaynakların sınırı', 'Resmî kayıt sayıyı, anı yaşantıyı gösterir.\nİki kaynak da eksik veya yanlı olabilir; karşılaştırılmalıdır.'],
    ],
    iddialar: [
      ['Göç kaydındaki nüfus sayısı, göçmenin yaşadığı sağlık sorununu tek başına açıklamaz.', true, 'Nitel tanıklık da gerekir.'],
      ['Salgın riskini değerlendirmek için yalnız gelen kişi sayısı yeterlidir.', false, 'Su ve barınma koşulları da önemlidir.'],
    ],
    secimler: [
      ['Aynı göçü iki aile farklı anlatıyorsa ne yapılır?', 'Kaynakları karşılaştırmak', 'Birini sebepsiz silmek', 'Bakış açısı ve kayıt koşulları incelenir.'],
      ['Kente yoğun göçün ilk baskısı hangi alanda?', 'Konut ve sağlık', 'Yalnız nüfus kayıtları', 'Barınma ve hizmet talebi artar.'],
      ['Kalabalık göç yolunda salgın riskini ne düşürür?', 'Temiz su ve sağlık hizmeti', 'Ortak suyu kirletmek', 'Bulaşma koşullarını azaltır.'],
      ['Göçün nedenini açıklarken hangi ifade güçlü?', 'Savaş ve güvenlik kaybı birlikte', 'Yalnız ekonomik fırsat arayışı', 'Birden çok itici etken vardı.'],
      ['Resmî kayıt ile anı arasındaki fark?', 'Sayı ve yaşantı vurgusu', 'İkisinin de aynı tür tanıklık olması', 'Kaynak türleri farklı bilgi sunar.'],
    ],
    kontrol: ['Göçte salgın riskini artıran iki koşul?', 'Kalabalık ve temiz su eksikliği', 'Sağlık hizmeti ve temiz su', 'Bulaşma kalabalık ve yetersiz hijyenle artar.'], kontrolKarti: 9,
  },
  'trh11-katki': {
    kartlar: [
      ['Külliye ilişkisi', 'Cami çevresinde eğitim, aşevi ve sağlık birimleri bulunabilir.\nBir yapı toplumsal hizmet ağına bağlanır.'],
      ['Vakıfın sürekliliği', 'Vakfedilen gelir hizmetin yıllarca işlemesini hedefler.\nTek seferlik bağıştan farkı sürekliliktir.'],
      ['Haritanın kanıtı', 'Pîrî Reis haritası dönemin denizcilik birikimini gösterir.\nBugünkü ölçüm doğruluğuyla yargılanmamalıdır.'],
      ['Katkıyı ölçmek', 'Bir eserin kime hizmet ettiği ve başka yere nasıl yayıldığına bak.\nYalnız adını saymak tarihsel etkiyi açıklamaz.'],
    ],
    iddialar: [
      ['Vakıf geliri, toplumsal hizmetin sürekliliğini sağlamaya yöneliktir.', true, 'Gelir hizmetin devamına ayrılır.'],
      ['Külliyeyi yalnız ibadet yapısı olarak görmek eğitim ve sağlık işlevini gizler.', true, 'Birden çok hizmet bir aradadır.'],
    ],
    secimler: [
      ['Külliyenin çok işlevli yapısı neyi gösterir?', 'Hizmetlerin birlikte örgütlendiğini', 'Yapının yalnız saray olduğunu', 'Eğitim ve yardım birimleri bulunabilir.'],
      ['Vakıfı tek seferlik yardımdan ne ayırır?', 'Gelire dayalı süreklilik', 'Yardımın tek bir günle sınırlanması', 'Gelir düzeni hizmeti sürdürür.'],
      ['Pîrî Reis haritasını nasıl değerlendirmeli?', 'Döneminin denizcilik bilgisiyle', 'Bugünkü uydu çözünürlüğüyle', 'Tarihî kaynak kendi koşulunda okunur.'],
      ['Bir eserin toplumsal katkısı nasıl açıklanır?', 'İşlev ve kullanıcıyla', 'Yalnız kurucunun adıyla', 'Etki kullanımda görünür.'],
      ['Darüşşifa ile vakıf arasındaki ilişki?', 'Vakıf sağlık hizmetini destekleyebilir', 'Darüşşifa yalnız ticaret yoludur', 'Vakıf gelirleri sağlık kurumunu finanse edebilir.'],
    ],
    kontrol: ['Külliyenin eğitim birimi hangisi olabilir?', 'Medrese', 'Gümrük', 'Medrese eğitim işlevi taşır.'], kontrolKarti: 7,
  },
}
