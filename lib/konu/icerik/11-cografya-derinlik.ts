import type { KonuDerinligi } from './11-yardimci'

export const cografyaDerinligi: Record<string, KonuDerinligi> = {
  'cog11-mekansal-sorun': {
    kartlar: [
      ['Örnek: sel haritası', 'İki mahallede yağış aynı olabilir.\nGeçirimsiz zemin ve dere yatağına yapılaşma hasarı farklılaştırır.'],
      ['Veri seçimi', 'Sel için eğim, yağış, zemin ve nüfus katmanları gerekir.\nYalnız su baskını fotoğrafı dağılışı göstermez.'],
      ['Zamandaki değişim', 'Yeni yol veya yapılaşma eskiden güvenli alanı riskli kılabilir.\nMekânsal sorun durağan değildir.'],
      ['Öneriyi sınama', '“Dereyi temizlemek yeter” demeden önce yukarı havzayı incele.\nÇözüm sorunun nedeni ile eşleşmeli.'],
    ],
    iddialar: [
      ['Aynı yağışta iki mahallenin farklı su baskını yaşaması arazi kullanımını incelemeyi gerektirir.', true, 'Geçirimsiz yüzey ve yapılaşma fark yaratabilir.'],
      ['Mahalle ölçeğinde çözüm için ülke ortalaması tek başına yeterli ayrıntıyı verir.', false, 'Yerel eğim ve yapılaşma verisi gerekir.'],
    ],
    secimler: [
      ['Aynı yağışa rağmen farklı sel hasarı varsa önce ne karşılaştırılır?', 'Zemin ve yapılaşma', 'Yalnız mevsim adı', 'Yerel kırılganlık değişmiş olabilir.'],
      ['Yeni yol açıldıktan sonra taşkın artmışsa hangi veri gerekir?', 'Önce-sonra arazi kullanımı', 'Yalnız yeni yolun uzunluğu', 'Geçirimsiz yüzey değişimi incelenir.'],
      ['Yerel taşkın için hangi ölçek daha yararlı?', 'Mahalle haritası', 'Kıta haritası', 'Risk noktaları yerel ayrıntı ister.'],
      ['Bir çözümü coğrafi yapan nedir?', 'Nedenin konumuyla eşleşmesi', 'Her yere aynı öneriyi vermek', 'Mekânsal farklılık hesaba katılmalı.'],
      ['Haritadaki riskli alanı açıklamak için ne yeterli değildir?', 'Yalnız fotoğraf', 'Eğim ve zemin verisi', 'Fotoğraf dağılışı ve nedeni açıklamaz.'],
    ],
    kontrol: ['İki mahallede yağış aynıysa sel farkı neyle açıklanabilir?', 'Zemin ve yapılaşmayla', 'Yalnız takvimle', 'Yağış dışındaki mekânsal etkenlere bakılır.'], kontrolKarti: 7,
  },
  'cog11-cbs': {
    kartlar: [
      ['Nokta, çizgi, alan', 'Okul nokta, yol çizgi, taşkın bölgesi alan olarak işlenebilir.\nHer veri türü başka sorgu sağlar.'],
      ['Yakınlık yeterli mi?', 'Okulun dereye yakınlığı risk için ipucudur.\nKot ve taşkın sınırı olmadan kesin karar verilmez.'],
      ['Veri uyumu', 'Katmanlar aynı koordinat düzeninde olmalı.\nKaymış katman yanlış çakışma üretir.'],
      ['Sınıflandırma tuzağı', 'Harita renk aralıkları değişirse aynı veri farklı görünebilir.\nLejant ve birim okunmadan yorum yapma.'],
    ],
    iddialar: [
      ['Nüfus yoğunluğu haritasında sınıf aralığı değişirse görsel yorum da değişebilir.', true, 'Lejant verinin nasıl gruplanacağını belirler.'],
      ['İki katmanın üst üste görünmesi aralarında zorunlu neden-sonuç bağı kurar.', false, 'Çakışma ilişki sorusu üretir, kanıtı tamamlamaz.'],
    ],
    secimler: [
      ['Okul dereye yakın ama yüksekteyse yalnız mesafe ne yapar?', 'Riski abartabilir', 'Riski kesin kanıtlar', 'Kot ve taşkın sınırı da gerekir.'],
      ['Aynı nüfus verisi iki haritada farklı görünüyorsa ne kontrol edilir?', 'Lejant aralıkları', 'Yalnız nüfusun toplamı', 'Sınıflandırma görsel etkiyi değiştirir.'],
      ['Yol verisi CBS’de genellikle hangi biçimde?', 'Çizgi', 'Nokta', 'Yolun uzanışı çizgiyle gösterilir.'],
      ['Katmanlar kayık duruyorsa önce ne sınanır?', 'Koordinat uyumu', 'Veri toplama tarihi', 'Farklı koordinat düzeni hatalı çakıştırır.'],
      ['İki katmanın birlikte görülmesi ne sağlar?', 'İlişkiyi sorgulama', 'Nedenselliği otomatik ispat', 'Ek kanıtla değerlendirme gerekir.'],
    ],
    kontrol: ['Haritanın renk aralıklarını nereden okursun?', 'Lejanttan', 'Ölçek çubuğundan', 'Lejant aralıkların anlamını açıklar.'], kontrolKarti: 10,
  },
  'cog11-su-kaynaklari': {
    kartlar: [
      ['Akifer ve beslenme', 'Yağışın bir bölümü yer altına süzülür.\nGeçirimsiz yüzey artarsa akiferin beslenmesi azalabilir.'],
      ['Akarsu rejimi', 'Akış yıl içinde yağış ve kar erimesine göre değişir.\nYıllık toplam aynı olsa da mevsimsel kullanım farklıdır.'],
      ['Gölün dengesi', 'Göl su alır, buharlaştırır ve bazen dışarı akıtır.\nAlınan su artarsa seviye düşebilir.'],
      ['Kullanılabilir su', 'Toplam tatlı su ile kolay erişilen su aynı değildir.\nBuz ve derin akifer pratik erişimi sınırlar.'],
    ],
    iddialar: [
      ['İki akarsuyun yıllık toplamı eşitken yaz debileri farklı olabilir.', true, 'Rejim mevsimlik dağılışı gösterir.'],
      ['Yer altı suyuna erişilmesi onu yenilenme hızından bağımsız kılar.', false, 'Çekim beslenmeyi aşabilir.'],
    ],
    secimler: [
      ['Yıllık akış eşit ama yaz suyu farklıysa hangi ölçüye bakılır?', 'Akarsu rejimine', 'Yalnız uzunluğa', 'Mevsimsel akış farkı rejimde görünür.'],
      ['Kent asfaltlandıkça akifer için olası etki?', 'Beslenme azalabilir', 'Sızma zorunlu artar', 'Geçirimsiz yüzey sızmayı azaltır.'],
      ['Göl seviyesi düşüyorsa hangisi incelenir?', 'Giriş ve çekim dengesi', 'Yalnız göl adı', 'Su bütçesi değişmiş olabilir.'],
      ['Tatlı su çok görünse de erişim niçin sınırlı?', 'Buz ve derin depolar', 'Bütün suyun tuzlu olması', 'Tatlı suyun bir kısmı kolay kullanılamaz.'],
      ['Yer altı suyunda sürdürülebilir sınır neye bağlı?', 'Yenilenme ve çekime', 'Yalnız kuyu sayısına', 'İkisi arasındaki denge önemlidir.'],
    ],
    kontrol: ['Akiferin beslenmesini ne azaltabilir?', 'Geçirimsiz yüzey', 'Sızmaya açık zemin', 'Asfalt suyun toprağa geçişini sınırlar.'], kontrolKarti: 7,
  },
  'cog11-turkiye-su': {
    kartlar: [
      ['Barajın iki yüzü', 'Depolama sulama ve enerji sağlar.\nAkış değişimi aşağı kesimde canlı yaşamını etkileyebilir.'],
      ['Yanlış sulama zinciri', 'Fazla sulama ve yetersiz drenaj tuzu yüzeye çıkarabilir.\nKısa vadeli verim uzun vadeli kayba dönüşür.'],
      ['Havza bağlantısı', 'Yukarı kesimdeki kirlilik aşağı kesimin içme suyuna ulaşabilir.\nSınır ve il ayrımı akışı durdurmaz.'],
      ['Kurak yılda öncelik', 'Tarımsal, kentsel ve ekolojik ihtiyaç çatışabilir.\nKarar yalnız üretim miktarına göre verilmez.'],
    ],
    iddialar: [
      ['Bir barajın enerji yararı, aşağı kesimdeki akış etkisini değerlendirmeyi gereksiz kılmaz.', true, 'Yarar ve ekolojik etki birlikte tartılır.'],
      ['Yukarı havzadaki kirlilik aşağı havzanın su kalitesinden bağımsızdır.', false, 'Akış kirleticiyi taşıyabilir.'],
    ],
    secimler: [
      ['Baraj değerlendirmesinde hangi ikili gerekir?', 'Enerji ve ekosistem etkisi', 'Yalnız gövde yüksekliği', 'Akış değişiminin yararı ve bedeli vardır.'],
      ['Tuzlanma riski hangi durumda artar?', 'Fazla su ve kötü drenaj', 'Ölçülü sulama ve drenaj', 'Buharlaşma tuzu yüzeyde bırakabilir.'],
      ['Yukarı havzada atık dökülürse kim etkilenebilir?', 'Aşağı kesimdeki kullanıcılar', 'Yalnız atık noktasındaki kişi', 'Akarsu maddeyi taşır.'],
      ['Kurak yılda su paylaştırma neyi birlikte gözetir?', 'İnsan ve ekosistem ihtiyacını', 'Yalnız tek ürünün gelirini', 'Kaynak birden çok işlev taşır.'],
      ['Yağış dağılışı farklı iki bölge için hangi yaklaşım uygun?', 'Yerel su bütçesi', 'Tek tip çekim kotası', 'Koşullar bölgeye göre değişir.'],
    ],
    kontrol: ['Barajın aşağı kesime olası etkisi?', 'Akış rejimini değiştirmesi', 'Enlemi değiştirmesi', 'Depolama doğal akışı etkileyebilir.'], kontrolKarti: 7,
  },
  'cog11-yerlesme': {
    kartlar: [
      ['Örnek: kavşak kenti', 'Yol kavşağı ticaret ve hizmeti çekebilir.\nAma su ve arazi kısıtı büyümeyi sınırlayabilir.'],
      ['Yoğunluk farkı', 'Merkezde erişim artarken kira da yükselebilir.\nİşlevler kenara taşınabilir.'],
      ['İşlev çatışması', 'Konut ile ağır sanayi yan yana olduğunda gürültü ve kirlilik sorunu doğar.\nPlanlama bu çatışmayı azaltır.'],
      ['Zamansal katman', 'Eski çekirdek ile yeni çevre aynı yolla oluşmaz.\nHaritada büyüme yönü izlenebilir.'],
    ],
    iddialar: [
      ['Yol kavşağında büyüyen bir kentte ulaşım, beşerî yer seçimi etkenidir.', true, 'Erişim mal ve insan akışını artırır.'],
      ['Kent merkezinde arazi pahalıysa bütün işlevler zorunlu olarak merkezde kalır.', false, 'Bazı işlevler çevreye kayabilir.'],
    ],
    secimler: [
      ['Konut-sanayi çatışmasını azaltan planlama?', 'İşlevleri uygun yerde ayırma', 'Her tesisi konut içine koyma', 'Gürültü ve kirlilik dikkate alınır.'],
      ['Yol kavşağı kenti neden büyüyebilir?', 'Erişim ve ticaret', 'Sadece enlem', 'Akışlar hizmeti çeker.'],
      ['Kent merkezinde kira yükselirse ne olabilir?', 'Bazı işlevler çevreye kayar', 'Tüm ulaşım durur', 'Arazi maliyeti yer seçimini etkiler.'],
      ['Eski çekirdek ile yeni çevreyi ne gösterir?', 'Büyüme yönü haritası', 'Yalnız nüfus toplamı', 'Mekânsal yayılım zamanla incelenir.'],
      ['Riskli fay alanında yeni konut planı neyi gerektirir?', 'Afet verisini', 'Yalnız işyeri sayısını', 'Yer seçimi tehlike ve zeminle yapılmalı.'],
    ],
    kontrol: ['Kentte konut ve sanayi çatışması hangi etkiyi doğurur?', 'Gürültü ve kirlilik', 'Daha çok yağış', 'İşlevlerin yakınlığı yaşam kalitesini etkiler.'], kontrolKarti: 9,
  },
  'cog11-etki-alani': {
    kartlar: [
      ['Eşik nüfus', 'Bazı hizmetler ancak yeterli kullanıcı varsa açılır.\nUzman hastane için ihtiyaç mahalle bakkalından büyüktür.'],
      ['Mesafe ve süre', 'Dağ arkasındaki yakın kent, hızlı trenle ulaşılan uzak kentten zor erişilebilir olabilir.\nUlaşım süresi belirleyicidir.'],
      ['Akış verisi', 'Hasta sevki veya öğrenci yolculuğu etki alanını gösterir.\nİdari sınıra bakmak tek başına yetmez.'],
      ['Çekim değişebilir', 'Yeni hastane ya da yol açıldığında bölgesel çekim değişir.\nEtki alanı sabit bir halka değildir.'],
    ],
    iddialar: [
      ['Yeni hızlı yol, merkezin etki alanını idari sınır değişmeden genişletebilir.', true, 'Erişim süresi kısalır.'],
      ['Etki alanı yalnız nüfusla belirlenir; hizmetin türü önemsizdir.', false, 'Nadir hizmet daha uzak kullanıcı çekebilir.'],
    ],
    secimler: [
      ['İki kent aynı uzaklıkta ama süre farklıysa ne karşılaştırılır?', 'Ulaşılabilirlik', 'Yalnız düz çizgi mesafesi', 'Gerçek seyahat süresi önemlidir.'],
      ['Uzman hastanenin etki alanı niçin geniş?', 'Nadir hizmet sunduğu için', 'Her sokakta bulunduğu için', 'Daha uzak yerlerden hasta gelir.'],
      ['Yeni yol sonrası etki alanı nasıl ölçülür?', 'Yolculuk akışlarıyla', 'Yalnız belediye sınırıyla', 'Kullanıcıların nereden geldiği gösterir.'],
      ['Bakkalın açılması için gereken eşik nüfus, hastaneye göre?', 'Daha düşük olabilir', 'Zorunlu olarak aynıdır', 'Günlük hizmet daha dar çevreye sunulur.'],
      ['Bir ilçe başka ilin hastanesine gidiyorsa ne çıkarılır?', 'Etki alanı sınır aşabilir', 'İl sınırı değişmiştir', 'Hizmet ilişkisi idari sınırdan farklıdır.'],
    ],
    kontrol: ['Etki alanını doğrudan gösteren veri?', 'Hizmet için yolculuklar', 'Yalnız idari alan', 'Kullanıcı akışı çekim çevresini gösterir.'], kontrolKarti: 9,
  },
  'cog11-gida': {
    kartlar: [
      ['Dört boyutu örnekle', 'Depoda buğday var ama pahalıysa erişim sorunudur.\nSalgın yüzünden dağıtım durursa süreklilik bozulur.'],
      ['Beslenme niteliği', 'Kalori miktarı yeterli olsa da tek tip beslenme sağlıklı değildir.\nGüvenli kullanım da gerekir.'],
      ['Kayıp zinciri', 'Hasat, depolama ve taşımada kayıp oluşabilir.\nÜretim hesabında sofraya ulaşan miktarı ayır.'],
      ['Yerel kırılganlık', 'Tek ürüne bağımlı bölge kuraklıkta daha çok etkilenir.\nÇeşitlilik riski azaltabilir.'],
    ],
    iddialar: [
      ['Üretim artarken fiyat da artıyorsa gıda güvencesinin erişim boyutu yine bozulabilir.', true, 'Miktar ve satın alma gücü farklıdır.'],
      ['Yeterli kalori almak, beslenmenin güvenli ve dengeli olduğunu tek başına kanıtlar.', false, 'Çeşit ve sağlık koşulları da gerekir.'],
    ],
    secimler: [
      ['Depoda ürün var, aile satın alamıyor: hangi boyut aksıyor?', 'Erişim', 'Bulunabilirlik', 'Ürün mevcut ama ekonomik engel var.'],
      ['Ürün üretiliyor ama yolda bozuluyor: sorun nerede?', 'Dağıtım ve depolamada', 'Yalnız toprak veriminde', 'Sofraya ulaşan miktar düşer.'],
      ['Tek ürüne bağlı köy için kuraklık riski nasıl azalır?', 'Ürün çeşitlendirerek', 'Tek ürünü daha da artırarak', 'Risk farklı ürünlere dağılır.'],
      ['Gıda güvencesinde “sürekli” neyi anlatır?', 'Zaman boyunca erişimi', 'Bir gün dolu rafı', 'Krizlerde de erişim korunmalıdır.'],
      ['Üretim rekoru tek başına neden yeterli değil?', 'Fiyat ve dağıtım bilinmiyor', 'Verim hesaplanamıyor', 'Gıdanın kime ulaştığı önemlidir.'],
    ],
    kontrol: ['Ürün var ama pahalı: hangi sorun?', 'Erişim', 'Yokluk', 'Gıda bulunuyor; satın alınamıyor.'], kontrolKarti: 7,
  },
  'cog11-surdurulebilir-tarim': {
    kartlar: [
      ['Damlama sınırı', 'Damlama suyu hedefe verir; ancak genişleyen ekim alanı toplam tüketimi artırabilir.\nYöntem ve toplam hacim birlikte izlenir.'],
      ['Toprak örtüsü', 'Anız veya bitki örtüsü toprağı yağmur ve rüzgâra karşı korur.\nÇıplak toprak daha kolay taşınır.'],
      ['İlaç ve ekosistem', 'Aşırı ilaç zararlıyla birlikte yararlı canlıları da etkileyebilir.\nHedefli uygulama riski azaltır.'],
      ['Gelir boyutu', 'Çiftçi geçinemiyorsa yöntem uzun süre sürdürülemez.\nÇevre ve geçim birlikte değerlendirilir.'],
    ],
    iddialar: [
      ['Damlama yöntemi birim alanda tasarruf sağlasa da toplam alan büyürse su tüketimi artabilir.', true, 'Toplam hacim ayrıca ölçülmelidir.'],
      ['Verim artışı varsa toprak ve çiftçi geliri için ayrıca ölçüm gerekmez.', false, 'Sürdürülebilirlik birden çok ölçüt ister.'],
    ],
    secimler: [
      ['Damlama sonrası toplam su artmışsa önce neye bakılır?', 'Ekim alanının değişimine', 'Yalnız birim alan tüketimine', 'Toplam kullanım alanla birlikte değişir.'],
      ['Eğimli yerde çıplak toprak hangi riski artırır?', 'Erozyonu', 'Toprak oluşum hızını', 'Yağış toprağı daha kolay taşır.'],
      ['Aşırı ilaç hangi canlıları etkileyebilir?', 'Yararlı böcekleri', 'Yalnız hedef zararlıyı', 'Seçici olmayan kullanım ekosistemi etkiler.'],
      ['Çiftçi geliri sürekli düşüyorsa ne sorgulanır?', 'Yöntemin ekonomik sürekliliği', 'Yalnız bir yıllık verim artışı', 'Geçim olmazsa uygulama kalıcı olamaz.'],
      ['İki tarlanın verimi eşit, su tüketimi farklı: hangisi üstün?', 'Kaynağı daha verimli kullanan', 'Daima daha çok su kullanan', 'Aynı üründe daha az su baskısı yararlıdır.'],
    ],
    kontrol: ['Damlama için hangi iki ölçü birlikte izlenir?', 'Birim alan ve toplam su', 'Yalnız boru sayısı', 'Alan genişlerse toplam tüketim artabilir.'], kontrolKarti: 7,
  },
  'cog11-maden': {
    kartlar: [
      ['Darboğaz', 'Maden çok ülkede bulunsa da işleme birkaç ülkede toplanabilir.\nArz riski yalnız rezervle ölçülmez.'],
      ['Kritiklik değişir', 'Yeni teknoloji bir madene talebi artırabilir.\nGeri dönüşüm veya ikame riskini azaltabilir.'],
      ['Hamdan ürüne', 'Cevheri çıkarmak ile batarya bileşeni üretmek farklı beceri ve yatırım ister.\nKatma değer aşamaya göre değişir.'],
      ['Maden sahasının sonu', 'Üretim bitince atık ve arazi için iyileştirme gerekir.\nGerçek maliyet bu aşamayı da içerir.'],
    ],
    iddialar: [
      ['Bir ülkede büyük rezerv bulunması işleme kapasitesinin de yüksek olduğunu kanıtlamaz.', true, 'Değer zincirinin aşamaları ayrıdır.'],
      ['İşleme tek ülkede toplanırsa maden çok yerde bulunsa bile tedarik kırılgan olabilir.', true, 'Darboğaz işleme aşamasında oluşabilir.'],
    ],
    secimler: [
      ['Rezerv yaygın ama rafine üretim tek yerdeyse risk nerede?', 'İşleme aşamasında', 'Yalnız harita ölçeğinde', 'Tedarik zincirinin dar halkası işleme olur.'],
      ['Yeni batarya teknolojisi bir madeni nasıl etkiler?', 'Talebini değiştirebilir', 'Jeolojik oluşumunu anında değiştirir', 'Teknoloji kullanım talebini etkiler.'],
      ['Ham cevher ihracı ile işlenmiş ürün arasındaki fark?', 'Katma değer', 'Yalnız taşın rengi', 'İşleme bilgi ve emek ekler.'],
      ['Maden sahası kapanırken maliyete ne katılır?', 'Arazi iyileştirmesi', 'Yalnız açılış gideri', 'Atık ve habitat etkisi sürer.'],
      ['Bir madenin kritikliği hangi değişkenle artabilir?', 'Arz kesintisi riskiyle', 'Yalnız rezerv miktarıyla', 'Tedarik güvenliği belirleyicidir.'],
    ],
    kontrol: ['Rezerv ve işleme kapasitesi arasında nasıl ilişki var?', 'Birbirini garanti etmez', 'Daima aynıdır', 'Madeni bulmak ayrı, ürüne çevirmek ayrıdır.'], kontrolKarti: 7,
  },
  'cog11-enerji': {
    kartlar: [
      ['Güç ve üretim', 'Kurulu güç santralin azami kapasitesidir.\nGerçek üretim hava, bakım ve çalışma süresine bağlıdır.'],
      ['Depolama ihtiyacı', 'Güneş akşam üretmez, rüzgâr her an aynı esmez.\nDepolama veya esnek kaynak arzı dengeler.'],
      ['Yer seçiminin etkisi', 'Rüzgâr türbini, baraj ve kömür santrali farklı arazi ve çevre etkisi yaratır.\nKaynağın adı tek başına karar verdirmez.'],
      ['Talebi azaltma', 'Yalıtım ve verimli cihazlar aynı hizmeti daha az enerjiyle sağlar.\nEn ucuz yeni kaynak bazen tasarruftur.'],
    ],
    iddialar: [
      ['İki santralin kurulu gücü aynıysa yıllık üretimleri mutlaka eşittir.', false, 'Çalışma koşulları ve süre farklıdır.'],
      ['Güneş ve rüzgârın değişkenliği şebeke planlamasını önemli kılar.', true, 'Arz-talep her an dengelenmelidir.'],
    ],
    secimler: [
      ['İki eş güçlü santral farklı enerji üretiyor: olası neden?', 'Çalışma süresi farklı', 'Güç birimleri farklı olmak zorunda', 'Kurulu güç gerçek üretim değildir.'],
      ['Güneşin geceki eksikliğini ne karşılayabilir?', 'Depolama veya esnek kaynak', 'Yalnız daha yüksek kurulu güç', 'Arz sürekliliği planlanır.'],
      ['Enerji güvenliğinde önce hangi ikili tartılır?', 'Çeşitlilik ve verimlilik', 'Yalnız santral sayısı', 'Kaynak riski ve talep birlikte yönetilir.'],
      ['Kömür ile rüzgârı yalnız kurulu güçle kıyaslamak neyi gizler?', 'Emisyon ve üretim farkını', 'Kurulu güç toplamını', 'Çevre etkisi ve çalışma süresi farklıdır.'],
      ['Bina yalıtımı hangi enerji stratejisidir?', 'Talebi azaltma', 'Yeni fosil rezerv bulma', 'Aynı ısınma için daha az enerji gerekir.'],
    ],
    kontrol: ['Kurulu güç neyi tek başına göstermez?', 'Yıllık gerçek üretimi', 'Azami kapasiteyi', 'Üretim koşulları kapasiteden ayrıdır.'], kontrolKarti: 7,
  },
  'cog11-sanayi-mekan': {
    kartlar: [
      ['Aynı sektör, farklı yer', 'Bir tesis ham maddeye, diğeri büyük pazara yakın kurulur.\nTaşıma maliyeti ikisinde farklı hesaplanır.'],
      ['Kümelenmenin bedeli', 'Ortak işgücü ve tedarik yarar sağlar.\nYoğun trafik ve kira artışı maliyeti de büyütebilir.'],
      ['Sanayi ve konut', 'İşe yakınlık ulaşımı kısaltabilir.\nFakat gürültü ve emisyon yer seçimini sınırlar.'],
      ['Eski alanın dönüşümü', 'Kapanan fabrika arazisi konut veya hizmete dönüşebilir.\nKirli zemin temizlenmeden yeni kullanıma geçilmez.'],
    ],
    iddialar: [
      ['Sanayi kümelenmesi tedarik yararı sağlarken kira ve trafik baskısı da yaratabilir.', true, 'Yarar ve maliyet birlikte değerlendirilir.'],
      ['Kapanan sanayi alanı temizlenmeden her kullanım için güvenlidir.', false, 'Toprak kirliliği denetlenmelidir.'],
    ],
    secimler: [
      ['Ağır ham madde kullanan tesiste hangi yakınlık önemli olabilir?', 'Ham madde kaynağına', 'Yalnız turistik alana', 'Girdi taşıma maliyeti etkiler.'],
      ['Kümelenmede iki zıt sonuç hangisi?', 'Tedarik kolaylığı ve trafik', 'Yalnız üretim maliyetinin düşmesi', 'Yoğunluk yarar ve baskı birlikte getirir.'],
      ['Eski fabrika arsası konuta dönüşmeden önce ne incelenir?', 'Toprak kirliliği', 'Yalnız imar yoğunluğu', 'Önce çevresel güvenlik sağlanır.'],
      ['Konut-sanayi yakınlığı neden her zaman iyi değildir?', 'Emisyon ve gürültü', 'İşçinin eve yakınlığı', 'Sağlık etkisi erişim yararını sınırlayabilir.'],
      ['Sanayinin bölgesel etkisi hangi veride görünür?', 'Göç ve istihdamda', 'Yalnız tesis adında', 'İş olanakları nüfusu ve kenti değiştirir.'],
    ],
    kontrol: ['Sanayi kümelenmesinin iki yönü?', 'Paylaşılan girdi ve artan baskı', 'Yalnız tek maliyet', 'Yakınlık hem kolaylık hem yoğunluk getirir.'], kontrolKarti: 8,
  },
  'cog11-gezegen-siniri': {
    kartlar: [
      ['Sistem bağlantısı', 'Ormansızlaşma karbon tutmayı azaltır ve canlı yaşamını daraltır.\nTek eylem birden çok süreci etkileyebilir.'],
      ['Eşik ve belirsizlik', 'Sınır, riskin arttığı güvenli işleyiş çerçevesidir.\nTek bir gün veya olayla “gezegen bitti” sonucu çıkarılmaz.'],
      ['Yerel ve küresel', 'Bir havzadaki aşırı su çekimi yerel görünür.\nBenzer baskılar yaygınlaşınca küresel süreçler etkilenir.'],
      ['Ölçü seçimi', 'İklim, tür, su ve arazi göstergeleri ayrı izlenir.\nTek emisyon grafiği tüm sınırları anlatmaz.'],
    ],
    iddialar: [
      ['Orman kaybı hem iklim hem canlı çeşitliliği üzerinde baskı yaratabilir.', true, 'Süreçler birbirine bağlıdır.'],
      ['Gezegen sınırları tek bir çevre göstergesiyle eksiksiz ölçülebilir.', false, 'Birden çok süreç ve gösterge vardır.'],
    ],
    secimler: [
      ['Ormansızlaşmayı yalnız karbonla incelemek neyi kaçırır?', 'Habitat kaybını', 'Ağaç sayısını', 'Canlıların yaşam alanı da etkilenir.'],
      ['Bir sınırın zorlanması neyi anlatır?', 'Sistem riskinin artmasını', 'Anlık zorunlu çöküşü', 'Risk kademeli ve bağlantılıdır.'],
      ['Su çekimi yerelde artıyorsa hangi ikili izlenir?', 'Yenilenme ve ekosistem', 'Yalnız çekim miktarı', 'Kaynağın işleyişi ve canlılar etkilenir.'],
      ['İklim verisi niçin tek başına yeterli değil?', 'Diğer sınırlar da var', 'İklim hiç önemli değil', 'Arazi ve canlı çeşitliliği ayrı süreçlerdir.'],
      ['Azot taşınımı hangi sistemi etkileyebilir?', 'Su ekosistemini', 'Yalnız atmosfer dolaşımını', 'Besin yükü suyu bozabilir.'],
    ],
    kontrol: ['Orman kaybı hangi iki sürece dokunur?', 'İklim ve canlı çeşitliliği', 'Yalnız enlem ve boylam', 'Karbon ve habitat birlikte etkilenir.'], kontrolKarti: 7,
  },
  'cog11-iklim': {
    kartlar: [
      ['Zinciri ayır', 'Emisyon → ısınma → tehlike → zarar bir zincirdir.\nAzaltım başı, uyum son halkadaki kırılganlığı hedefler.'],
      ['Şehirde sıcaklık', 'Ağaç ve gölge sıcak dalgasında zararı azaltabilir.\nBu uyumdur; emisyonu azaltmanın yerini tutmaz.'],
      ['Tarımda çift yol', 'Daha verimli enerji azaltıma katkı verir.\nKuraklığa uygun ürün seçimi uyum sağlar.'],
      ['Adalet ve kapasite', 'Aynı sıcak dalgası yalıtımlı ve yalıtımsız evde farklı zarar verir.\nKırılgan gruplar daha çok desteğe ihtiyaç duyar.'],
    ],
    iddialar: [
      ['Kentte gölgelik alan artırmak sıcak dalgasına uyum sağlayabilir.', true, 'Maruziyet ve zarar azalır.'],
      ['Uyum yapılması, sera gazı azaltımını gereksiz kılar.', false, 'Uyum etkileri yönetir; azaltım nedeni sınırlar.'],
    ],
    secimler: [
      ['Çatılarda yalıtım enerji tüketimini düşürüyorsa hangi yol?', 'Azaltım', 'Yalnız uyum', 'Daha az enerji emisyonu azaltabilir.'],
      ['Sel erken uyarısı hangi halkayı hedefler?', 'Zararı', 'Sera gazı kaynağını', 'Uyum tehlikeye hazırlıktır.'],
      ['Aynı sıcaklıkta iki mahallenin zararı farklıysa ne incelenir?', 'Kırılganlık', 'Yalnız enlem', 'Konut ve sosyal koşullar fark yaratır.'],
      ['Kuraklığa dayanıklı ürün seçimi ne yapar?', 'Etkilere uyum sağlar', 'Fosil yakıtı doğrudan bitirir', 'Tarım kuraklık riskine hazırlanır.'],
      ['Azaltım ve uyumun birlikte gerekmesi neden?', 'Neden ve zararı ayrı hedefler', 'Aynı işi iki kez yapar', 'İkisi zincirin farklı halkalarına müdahale eder.'],
    ],
    kontrol: ['Sel erken uyarısı ile temiz enerji arasındaki fark?', 'Uyum ve azaltım', 'İkisi de yalnız uyum', 'Biri zararı, diğeri emisyonu hedefler.'], kontrolKarti: 7,
  },
  'cog11-su-surdurulebilir': {
    kartlar: [
      ['Yıllık ortalama yanılgısı', 'Yıllık su miktarı yeterli görünse bile yaz ayları kurak olabilir.\nMevsimsel talep ayrıca ölçülür.'],
      ['Kayıp suyun hesabı', 'Şebekeye verilen ile musluğa ulaşan su farkı kaybı gösterir.\nBakım yeni baraj ihtiyacını azaltabilir.'],
      ['Akiferin gecikmesi', 'Yer altı deposu çekime hemen tepki vermeyebilir.\nSeviye eğilimi yıllarca izlenmelidir.'],
      ['Atık suyun değeri', 'Uygun arıtılan su bazı kullanımlarda yeniden değerlendirilebilir.\nİçme suyu standardı ayrı gerekliliktir.'],
    ],
    iddialar: [
      ['Bir havzanın yıllık su bütçesi yeterli olsa bile yazın kıtlık yaşanabilir.', true, 'Mevsimlik arz ve talep değişir.'],
      ['Arıtılmış atık su her durumda doğrudan içme suyudur.', false, 'Kullanım standardına göre ek işlem gerekir.'],
    ],
    secimler: [
      ['Yıllık su yeterli, yazın kısıntı varsa hangi veri eksik?', 'Mevsimsel su bütçesi', 'Yalnız havza adı', 'Yaz talebi ve akışı ayrı incelenir.'],
      ['Şebekeye giren suyun azı musluğa varıyorsa ilk adım?', 'Kayıp-kaçak onarımı', 'Yeni çekimi artırmak', 'Mevcut kaybı azaltmak yararlıdır.'],
      ['Akifer çekimi için hangi veri izlenir?', 'Yıllara göre seviye', 'Yalnız kuyu sayısı', 'Seviye eğilimi yenilenme dengesini gösterir.'],
      ['Arıtılmış suyun kullanımı neye bağlı?', 'Arıtım düzeyi ve amaca', 'Yalnız berrak görünmesine', 'Sağlık standardı kullanım türüne göre değişir.'],
      ['Havza yönetiminde neden yukarı kesim de gerekir?', 'Akış aşağıyı etkiler', 'İl sınırı suyu durdurur', 'Kirlilik ve çekim bağlantılıdır.'],
    ],
    kontrol: ['Yıllık ortalama neyi gizleyebilir?', 'Yaz kıtlığını', 'Havzanın adını', 'Mevsimsel dengesizlik ortalamada görünmeyebilir.'], kontrolKarti: 7,
  },
  'cog11-kulturel-hinterland': {
    kartlar: [
      ['Sınır aşan ilişki', 'Aile göçü ve ortak eserler bugünkü sınırları aşabilir.\nBu, yönetim yetkisinin de aşıldığı anlamına gelmez.'],
      ['Tek yönlü değil', 'Eğitim ve medya aracılığıyla iki toplum birbirinden etkilenir.\nKültürel ağ karşılıklıdır.'],
      ['Ortaklık ve çeşitlilik', 'Dil akrabalığı aynı yaşam biçimi demek değildir.\nYerel tarih farklı kültürel özellikler yaratır.'],
      ['Kanıt türü', 'Öğrenci değişimi, kültür kurumu ve dil kullanımı ilişkileri gösterebilir.\nHarita tek başına yoğunluğu kanıtlamaz.'],
    ],
    iddialar: [
      ['Kültürel etkileşimin siyasi sınıra sığmaması egemenlik sınırının değiştiğini göstermez.', true, 'Kültür ağı ve devlet yetkisi ayrıdır.'],
      ['Dil yakınlığı iki toplumun tüm geleneklerini bire bir aynı kılar.', false, 'Tarih ve çevre farklılaşma yaratır.'],
    ],
    secimler: [
      ['Sınır ötesi aile bağı neyi gösterir?', 'Kültürel ilişkiyi', 'Siyasi yönetim yetkisini', 'Aile ve göç ağı egemenlik değildir.'],
      ['İki ülkede öğrenci değişimi artıyorsa hangi bağ güçlenir?', 'Eğitimsel etkileşim', 'Yalnız kara sınırı', 'İnsan hareketi kültürel teması artırır.'],
      ['Türk dünyasını incelerken hangi yaklaşım doğru?', 'Ortaklık ve farklılık birlikte', 'Hepsini aynı saymak', 'Akrabalık çeşitliliği kaldırmaz.'],
      ['Kültürel etkiyi yalnız haritadaki yakınlıkla niçin ölçemeyiz?', 'Gerçek akış verisi gerekir', 'Yakınlık daima etkileşimdir', 'Eğitim ve göç akışına bakılır.'],
      ['Hinterlandın zamanla değişmesine hangi olay yol açabilir?', 'Yeni göç ve iletişim ağı', 'Yalnız coğrafi yakınlık', 'İlişki ağı dinamik yapıdır.'],
    ],
    kontrol: ['Kültürel bağ neyi zorunlu olarak değiştirmez?', 'Siyasi sınırı', 'Toplumlar arası etkileşimi', 'Etkileşim egemenlikle aynı kavram değildir.'], kontrolKarti: 7,
  },
  'cog11-tarim-ulke': {
    kartlar: [
      ['Toplam ve verim', 'Bir ülke geniş arazisiyle çok üretip düşük verimli olabilir.\nBaşka ülke az alanda yüksek verim sağlayabilir.'],
      ['Ürün deseni', 'İklim hangi ürüne uygun sorusunu açar; fiyat ve su politikası ne ekildiğini etkiler.\nDoğa tek belirleyici değildir.'],
      ['Ticaret dengesi', 'Buğday ihraç eden ülke meyve ithal edebilir.\nTarımda “ihracatçı” tek bir ürün kararı değildir.'],
      ['Kişi başı üretim', 'Toplam hasadı nüfusa bölmek kaba bir ölçüdür.\nDağılım, kayıp ve erişimi yine göstermez.'],
    ],
    iddialar: [
      ['Geniş alanda yüksek toplam üretim, birim alan veriminin yüksek olduğunu kanıtlamaz.', true, 'Alan büyüklüğü toplamı yükseltir.'],
      ['Bir üründe ihracatçı ülke başka bir üründe ithalatçı olamaz.', false, 'Ürün bazında denge farklıdır.'],
    ],
    secimler: [
      ['A ülkesinin alanı büyük, verimi düşükse ne mümkün?', 'Toplam üretimi yine yüksek olabilir', 'Üretimi zorunlu sıfırdır', 'Alan toplam miktarı etkiler.'],
      ['Ürün deseni değişmişse iklim dışında ne incelenir?', 'Fiyat ve su politikası', 'Yalnız enlem çizgisi', 'Ekonomik kararlar ekimi etkiler.'],
      ['Buğday ihraç edip meyve ithal eden ülke için doğru yorum?', 'Ürün dengeleri farklı', 'Tarım yapmıyor', 'Ticaret ürün bazında değişir.'],
      ['Kişi başı üretim yeterli görünse de ne bilinmez?', 'Gıdanın dağılımı', 'Nüfusun varlığı', 'Erişim ayrı bir sorudur.'],
      ['İki ülkeyi karşılaştırırken hangi veri aynı yıldan olmalı?', 'Üretim ve nüfus', 'Üretim ve farklı yılın nüfusu', 'Zaman farkı oranları bozar.'],
    ],
    kontrol: ['Büyük alan yüksek toplam ürün, düşük verim yaratabilir mi?', 'Evet, ölçüler farklı', 'Hayır, aynı ölçü', 'Verim birim alan, toplam üretim bütün alandır.'], kontrolKarti: 7,
  },
  'cog11-sanayi-ulke': {
    kartlar: [
      ['Erken ve geç başlayan', 'Erken başlayan ülke kömürlü ağır sanayide güçlenmiş olabilir.\nGeç başlayan teknoloji yoğun alan seçebilir.'],
      ['Kaynak yetmez', 'Maden zenginliği sermaye ve eğitim yoksa tek başına sanayi kurmaz.\nKurumlar ve ticaret ağı da gerekir.'],
      ['Değer zinciri', 'Parça üretimi ile tasarım ve marka aynı gelir sağlamaz.\nÜlkelerin zincirdeki yeri karşılaştırılmalıdır.'],
      ['Eşit refah yanılgısı', 'Yüksek ihracat kentler arasında eşit gelir demek değildir.\nİstihdam ve ücret verisi de okunur.'],
    ],
    iddialar: [
      ['Maden zengini bir ülke, eğitim ve sermaye yetersizse sanayide geri kalabilir.', true, 'Kaynak tek koşul değildir.'],
      ['İki ülkenin ihracat tutarı eşitse sanayi yapıları da aynıdır.', false, 'Sektör ve katma değer farklı olabilir.'],
    ],
    secimler: [
      ['Kaynağı az ama yüksek teknoloji üretimi olan ülke için ne etkili?', 'Eğitim ve teknoloji yatırımı', 'Maden rezervi zorunluluğu', 'Sanayi yalnız doğal kaynağa dayanmaz.'],
      ['Aynı ihracat geliri farklı sanayi yapısını nasıl gizler?', 'Sektör ve katma değer farkıyla', 'Yalnız para birimiyle', 'Ürünün işlenme aşaması önemlidir.'],
      ['Erken sanayi ile geç sanayiyi kıyaslamak için?', 'Başlama dönemi ve sektör', 'Yalnız ülke büyüklüğü', 'Yol ve ürün yapısı farklı olabilir.'],
      ['Liman erişimi hangi maliyeti doğrudan etkiler?', 'Taşıma', 'Nüfus sayımı', 'Girdi ve ürün pazara taşınır.'],
      ['İhracat yüksek ama bölgesel eşitsizlik sürüyorsa ne incelenir?', 'Ücret ve istihdam dağılımı', 'Yalnız toplam değer', 'Refahın bölüşümü ayrı ölçülür.'],
    ],
    kontrol: ['Sanayiyi yalnız madenle açıklamak neyi atlar?', 'Eğitim ve sermayeyi', 'Rezervin varlığını', 'Üretim bilgi ve yatırım da ister.'], kontrolKarti: 7,
  },
  'cog11-madencilik-ulke': {
    kartlar: [
      ['Pay ve miktar', 'Madenin üretim payı artabilir ama toplam üretim düşebilir.\nYüzdeyi mutlak miktarla birlikte oku.'],
      ['Rezerv süresi', 'Rezervi yıllık üretime bölmek kaba tahmindir.\nYeni keşif, fiyat ve teknoloji süreyi değiştirir.'],
      ['Fiyat etkisi', 'Çıkarılan ton sabitken dünya fiyatı düşerse ihracat geliri azalabilir.\nMiktar ve gelir ayrı grafiktir.'],
      ['Yerel bedel', 'İş yaratılırken su ve arazi üzerinde baskı doğabilir.\nYarar ve maliyet aynı bölgede bile eşit dağılmaz.'],
    ],
    iddialar: [
      ['Madenin ihracat geliri düşerken çıkarılan miktarı sabit kalabilir.', true, 'Fiyat değişimi geliri etkiler.'],
      ['Üretim payının artması toplam üretimin de zorunlu arttığını gösterir.', false, 'Diğer madenler daha çok düşmüş olabilir.'],
    ],
    secimler: [
      ['Ton aynı, gelir azaldı: en olası veri değişimi?', 'Dünya fiyatı düştü', 'Rezerv bir anda tükendi', 'Aynı miktarın birim fiyatı azalabilir.'],
      ['Bir madenin payı büyüdü; toplam üretim hakkında ne denir?', 'Ek veri gerekir', 'Kesin arttı', 'Oran tek başına miktar vermez.'],
      ['Rezerv/üretim hesabı niçin kesin bitiş tarihi değildir?', 'Keşif ve teknoloji değişir', 'Birimler daima yanlış', 'Koşullar zamanla değişir.'],
      ['Madenin yerel etkisinde hangi ikili tartılır?', 'İş ve su kullanımı', 'Yalnız işletme adı', 'Ekonomik yarar ve çevresel bedel vardır.'],
      ['Zaman grafiğine ne yazılmalı?', 'Yıl ve ölçü birimi', 'Yalnız değişim yüzdesi', 'Değişim ancak eksenler anlaşılırsa yorumlanır.'],
    ],
    kontrol: ['Çıkarım sabit, gelir düştü: hangi değişken?', 'Fiyat', 'Enlem', 'Birim satış fiyatı toplam geliri değiştirir.'], kontrolKarti: 9,
  },
  'cog11-enerji-ulke': {
    kartlar: [
      ['Elektrik ve enerji', 'Elektrik üretim karması, ısınma ve ulaşım dahil toplam enerji karması değildir.\nKarşılaştırmada kapsamı belirt.'],
      ['Kapasite yanılgısı', 'Ülke çok güneş kapasitesi kurabilir; bulutlu yılda üretim daha düşük kalır.\nKurulu güç ve üretimi ayır.'],
      ['İthalat etkisi', 'Fosil yakıt ithal eden ülke fiyat şokuna açıktır.\nYerli yenilenebilir kaynak bu bağımlılığı azaltabilir.'],
      ['Yıl seçimi', 'Kurak bir yılda hidroelektrik payı düşebilir.\nTek yıl kalıcı politika değişikliği sayılmaz.'],
    ],
    iddialar: [
      ['Kurak yılda hidroelektrik üretiminin düşmesi, kurulu gücün azaldığını kanıtlamaz.', true, 'Su akışı azalmış olabilir.'],
      ['Elektrik üretim payı, ulaşım yakıtlarını da eksiksiz gösterir.', false, 'Elektrik ve toplam enerji farklı kapsamdır.'],
    ],
    secimler: [
      ['Güneş kapasitesi arttı ama üretim az: hangi veri bakılır?', 'Işınım ve çalışma süresi', 'Yalnız kurulu güç', 'Kurulu güç gerçek üretimden ayrıdır.'],
      ['Hidroelektrik payı bir yılda düştü: önce ne kontrol edilir?', 'O yılın yağışı', 'Yalnız santral sayısı', 'Su akışı üretimi etkiler.'],
      ['Ulaşım yakıtını elektrik grafiğinden çıkarabilir miyiz?', 'Hayır, kapsam farklı', 'Evet, tüm enerji dahil', 'Elektrik yalnız toplam enerjinin bir bölümüdür.'],
      ['Fosil ithalat fiyatı artarsa hangi ülke daha kırılgan?', 'İthalata bağımlı olan', 'Kaynağı çeşitlendiren', 'Fiyat şoku dışa bağımlı ülkeyi etkiler.'],
      ['Ülkelerin kaynak paylarını karşılaştırırken hangi ölçü aynı olmalı?', 'Yıl ve enerji türü', 'Yalnız renk skalası', 'Farklı kapsam yanlış kıyas yaratır.'],
    ],
    kontrol: ['Elektrik karması toplam enerjinin tamamı mı?', 'Hayır, ayrı kapsam', 'Evet, ulaşım da içinde', 'Elektrik, enerji kullanımının yalnız bir bölümüdür.'], kontrolKarti: 7,
  },
}
