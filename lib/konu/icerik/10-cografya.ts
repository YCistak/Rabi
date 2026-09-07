import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Coğrafya — Maarif Modeli.
 *
 * 9. sınıftaki yedi temanın aynısı; program konuları sınıf sınıf
 * derinleştiriyor. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Eski programın "Jeolojik Zamanlar" başlığı bu programda yok; yer şekilleri
 * doğrudan tektonik ve dış süreçler üzerinden işleniyor.
 *
 * Programın kendi terimleri kullanılıyor: Türk kültürünün yayılış alanı
 * "Orta Asya" değil **Türkistan**, afet bölümünün hedefi "bilinçli toplum"
 * değil **afete dirençli toplum**. Bir süre ikisi de gündelik karşılıklarıyla
 * yazılıydı ve öğrenci programda geçen terimi hiç görmüyordu.
 */
export const cografya10 = program('cografya', 10, 'Yer şekillerinden ekonomiye', [
  tema('cog10-t1', 'Coğrafyanın Doğası', [
    konu('cog10-bakis', 'Coğrafi Bakış', [
      kart(
        'Coğrafi bakış nedir?',
        'Bir olayı yalnızca kendisiyle değil, olduğu yerle ve çevresiyle birlikte düşünmek.',
      ),
      kart(
        'Temel kavramlar',
        'Coğrafi çözümleme beş kavram üzerinden yürür ve her biri ayrı bir soruya karşılık gelir.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Sorusu'],
          satirlar: [
            ['Konum', 'Nerede?'],
            ['Dağılış', 'Nasıl yayılmış?'],
            ['Etkileşim', 'Neyi etkiliyor?'],
            ['Bölge', 'Nereye benziyor?'],
            ['Ölçek', 'Ne kadar geniş?'],
          ],
        },
      ),
      kart(
        'Ölçek meselesi',
        'Aynı olay yerel, bölgesel ve küresel ölçekte farklı görünür. Ölçeği değiştirmek sonucu da değiştirir.',
      ),
      kart(
        'Etkileşim',
        'Hiçbir yer yalıtık değildir; bir bölgedeki kuraklık başka bir kıtadaki gıda fiyatını etkileyebilir.',
      ),
      kart(
        'Neden-sonuç aramak',
        'Coğrafi bakış "nerede" ile yetinmez, "neden orada" diye sorar. Dağılışın arkasındaki sebebi bulmak asıl iştir.',
      ),
      kart(
        'Doğa mı belirler insan mı?',
        'Doğa sınırları çizer, insan o sınırlar içinde seçim yapar. Bugünkü coğrafya bu karşılıklı ilişkiyi esas alır.',
      ),
    ]),
  ]),
  tema('cog10-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog10-cbs-uygulama', 'CBS ve Uzaktan Algılamanın Uygulama Alanları', [
      kart(
        'Afet yönetiminde',
        'Risk haritaları, hasar tespiti ve tahliye planlaması CBS ile yapılır; uydu görüntüsü ilk saatlerde hayat kurtarır.',
      ),
      kart(
        'Şehir planlamada',
        'İmar, altyapı ve ulaşım planları katman katman çözümlenir; yeni yatırımın yeri buna göre seçilir.',
      ),
      kart(
        'Tarım ve ormanda',
        'Ürün deseni, verim tahmini, kuraklık ve yangın takibi uzaktan algılamayla yürütülür.',
      ),
      kart(
        'Çevre izlemede',
        'Buzul erimesi, kıyı değişimi ve ormansızlaşma yıllar arası uydu görüntüleri karşılaştırılarak ölçülür.',
      ),
      kart(
        'Sağlıkta',
        'Salgın haritaları hastalığın nerede yoğunlaştığını gösterir; müdahale kaynakları bu haritaya göre dağıtılır.',
      ),
      kart(
        'Günlük hayatta',
        'Navigasyon, kargo takibi ve teslimat rotaları aynı teknolojinin ürünüdür.',
      ),
      kart(
        'Zaman boyutu',
        'Uzaktan algılamanın asıl gücü karşılaştırma: aynı yerin on yıl arayla görüntüsü değişimi doğrudan ölçülebilir kılar.',
      ),
    ]),
    konu('cog10-veri-harita', 'Mekânsal Verilerin Haritalara Aktarılması', [
      kart(
        'Altlık harita',
        'Üzerine veri işlenecek temel harita. Doğru altlık seçilmezse veri yanlış yere düşer.',
      ),
      kart(
        'Veri türleri',
        'Vektör veri nokta, çizgi ve alan olarak; raster veri piksel olarak saklanır.',
        {
          tur: 'tablo',
          basliklar: ['Vektör', 'Raster'],
          satirlar: [
            ['Nokta, çizgi, alan', 'Piksel'],
            ['Yol, sınır, bina', 'Uydu görüntüsü'],
            ['Ölçek bozulmaz', 'Yakınlaşınca bozulur'],
          ],
        },
      ),
      kart(
        'Adımlar',
        'Her harita üretimi aynı sırayı izler ve ilk adım atlanırsa geri kalanı da amaçsız kalır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Amaç belirle' },
            { ad: 'Veri topla' },
            { ad: 'Sınıflandır' },
            { ad: 'Haritaya işle' },
            { ad: 'Lejant ve ölçek', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Sınıflandırma önemlidir',
        'Aynı veri farklı aralıklarla sınıflandırılırsa harita bambaşka bir izlenim verir.',
      ),
      kart(
        'Renk seçimi',
        'Artan bir değer için tek rengin tonları, karşıt iki değer için iki ayrı renk kullanılır; keyfî renk haritayı okunmaz yapar.',
      ),
      kart(
        'Konum doğruluğu',
        'Verinin hangi koordinat sisteminde toplandığı bilinmezse katmanlar birbirine oturmaz ve harita sessizce kayar.',
      ),
    ]),
  ]),
  tema('cog10-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog10-tektonik', 'Tektonik Süreçler', [
      kart(
        'Levha tektoniği',
        'Yer kabuğu levhalara bölünmüştür ve manto hareketleriyle sürüklenir.',
      ),
      kart(
        'Yerin katmanları',
        'Kabuk ince ve katı, manto akışkan, çekirdek ise en sıcak bölümdür. Levhaları hareket ettiren mantonun ısı akımlarıdır.',
        {
          tur: 'katman',
          eksenAdi: 'DERİNLİK',
          katmanlar: [
            { ad: 'Yer kabuğu', alt: 'ince, katı' },
            { ad: 'Manto', alt: 'akışkan' },
            { ad: 'Dış çekirdek', alt: 'sıvı' },
            { ad: 'İç çekirdek', alt: 'katı' },
          ],
        },
      ),
      kart(
        'Levha sınırları',
        'Uzaklaşan sınırda yeni kabuk oluşur, yaklaşan sınırda dalma-batma olur, yanal sınırda levhalar sürtünür.',
        {
          tur: 'tablo',
          basliklar: ['Sınır', 'Sonuç'],
          satirlar: [
            ['Uzaklaşan', 'Okyanus sırtı'],
            ['Yaklaşan', 'Dağ, volkan'],
            ['Yanal', 'Deprem, fay'],
          ],
        },
      ),
      kart(
        'İç kuvvetler',
        'Orojenez (dağ oluşumu), epirojenez (kıta oluşumu), volkanizma ve depremler. Enerjisi yerin içinden gelir.',
      ),
      kart(
        'Türkiye neden depremsel?',
        'Anadolu levhası, Avrasya ile Arap levhaları arasında sıkışıyor ve batıya doğru itiliyor.',
      ),
      kart(
        'Fay hatları',
        'Kuzey Anadolu ve Doğu Anadolu fay hatları ülkenin en etkin kırık kuşaklarıdır.',
      ),
      kart(
        'Deprem nasıl oluşur?',
        'Levhalar sürtünürken enerji birikir; kayaç dayanma sınırını aşınca kırılır ve biriken enerji dalgalar hâlinde yayılır.',
      ),
    ]),
    konu('cog10-asinma', 'İklim ve Kayaç Yapısının Aşınmaya Etkisi', [
      kart(
        'Fiziksel ayrışma',
        'Kayaç kimyasal olarak değişmeden parçalanır. Donma-çözülme ve sıcaklık farkı başlıca etkendir.',
      ),
      kart(
        'Kimyasal çözünme',
        'Su ve asitler kayacın yapısını değiştirir. Sıcak ve nemli iklimlerde hızlıdır.',
      ),
      kart(
        'İkisinin karşılaştırması',
        'Hangisinin baskın olduğunu iklim belirler; kurakta parçalanma, nemlide çözünme öne çıkar.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fiziksel', 'Kimyasal'],
          satirlar: [
            ['İklim', 'Kurak, soğuk', 'Sıcak, nemli'],
            ['Değişim', 'Şekil', 'Yapı'],
            ['Örnek', 'Donma-çözülme', 'Karstlaşma'],
          ],
        },
      ),
      kart(
        'Kayaç türü belirleyici',
        'Kireç taşı kolay çözünür ve karstik şekiller verir; granit fiziksel ayrışmaya daha açıktır.',
      ),
      kart(
        'İklim belirleyici',
        'Kurak bölgelerde fiziksel, nemli bölgelerde kimyasal süreçler öne çıkar.',
      ),
      kart(
        'Karstik şekiller',
        'Lapya, dolin, obruk, mağara ve sarkıt-dikit. Türkiye’de Taşeli ve Toroslar bu şekiller bakımından zengindir.',
      ),
      kart(
        'Bitki örtüsünün rolü',
        'Örtü toprağı tutar ve aşınmayı yavaşlatır; örtüsüz yamaçta aynı yağmur kat kat çok toprak taşır.',
      ),
    ]),
    konu('cog10-asinim-birikim', 'Aşınım ve Birikim Süreçlerinin Etkisi', [
      kart(
        'Dış kuvvetler',
        'Akarsu, rüzgâr, buzul, dalga ve yer altı suyu. Enerjisini güneşten alır, yüksek yeri aşındırıp çukuru doldurur.',
      ),
      kart(
        'İç ve dış kuvvet yarışı',
        'İç kuvvetler yükseltir, dış kuvvetler tıraşlar. Yer şekilleri bu iki yönün o andaki dengesidir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'İç kuvvet', alt: 'yükseltir' },
            { ad: 'Dış kuvvet', alt: 'aşındırır' },
            { ad: 'Birikim', alt: 'doldurur' },
          ],
        },
      ),
      kart(
        'Akarsu şekilleri',
        'Vadi, menderes, delta ve birikinti konisi. Türkiye’de en etkili dış kuvvet akarsulardır.',
      ),
      kart(
        'Menderes nasıl oluşur?',
        'Eğim azalınca akarsu yavaşlar; dış kıyıyı aşındırıp iç kıyıya biriktirerek kıvrımlarını büyütür.',
      ),
      kart(
        'Rüzgâr şekilleri',
        'Mantar kaya, kumul ve tafoni. Bitki örtüsünün zayıf olduğu kurak alanlarda etkilidir.',
      ),
      kart(
        'Buzul şekilleri',
        'Sirk, buzul vadisi (U vadi) ve moren. Türkiye’de yalnızca yüksek dağlarda görülür.',
      ),
      kart(
        'Kıyı şekilleri',
        'Falez, kumsal, kıyı oku ve lagün. Dalga ve akıntı aşındırıp biriktirir.',
      ),
      kart(
        'Vadi biçimi anlatır',
        'V biçimli vadi akarsuyun, U biçimli vadi buzulun izidir. Şekil, onu oluşturan kuvveti ele verir.',
      ),
    ]),
    konu('cog10-saha', 'Yeryüzü Şekilleri ile İlgili Saha Çalışması', [
      kart(
        'Saha çalışması nedir?',
        'Coğrafi olayı yerinde gözlemleyip veri toplama. Coğrafyanın laboratuvarı arazidir.',
      ),
      kart(
        'Hazırlık',
        'Amaç belirlenir, harita ve hava fotoğrafı incelenir, ölçüm araçları ve güvenlik planı hazırlanır.',
      ),
      kart(
        'Arazide',
        'Gözlem yapılır, ölçüm alınır, fotoğraf ve eskiz çizilir; her kayda yer ve saat yazılır.',
      ),
      kart(
        'Neden yer ve saat?',
        'Konumu ve zamanı yazılmayan bir gözlem, sonradan hiçbir haritaya oturtulamaz ve veri olmaktan çıkar.',
      ),
      kart(
        'Sanal saha çalışması',
        'Uydu görüntüsü ve panoramik haritalarla araziye gitmeden inceleme. Erişilemeyen alanlar için elverişlidir.',
      ),
      kart(
        'Raporlama',
        'Toplanan veri çözümlenir ve bulgular haritayla birlikte sunulur. Ham gözlem tek başına sonuç değildir.',
      ),
    ]),
    konu('cog10-beseri-etkilesim', 'Yeryüzü Şekilleri ile Beşerî Faaliyetler', [
      kart(
        'Yerleşmeye etkisi',
        'Düz ve su kaynağına yakın alanlar yerleşme çeker; dik yamaçlar ve bataklıklar caydırır.',
      ),
      kart(
        'Ulaşıma etkisi',
        'Dağlık alanda yol maliyeti artar; geçitler ve vadiler tarih boyunca güzergâhı belirlemiştir.',
      ),
      kart(
        'Tarıma etkisi',
        'Eğim arttıkça makineli tarım zorlaşır ve erozyon riski büyür; teraslama bir uyum yöntemidir.',
      ),
      kart(
        'Yükselti ve tarım',
        'Her 100 metrede sıcaklık düştüğü için yüksek yerlerde yetişme süresi kısalır ve ürün deseni değişir.',
      ),
      kart(
        'İnsanın araziyi değiştirmesi',
        'Tünel, baraj, dolgu ve maden ocakları yer şekillerini doğrudan dönüştürür.',
      ),
      kart(
        'Değiştirmenin bedeli',
        'Dere yatağını daraltmak taşkını, yamacı kesmek heyelanı davet eder. Araziye yapılan müdahale hep bir karşılık üretir.',
      ),
      kart(
        'Karşılıklı ilişki',
        'Arazi insanı sınırlar, insan da araziyi dönüştürür; coğrafyanın baktığı şey bu çift yönlü etkidir.',
      ),
    ]),
  ]),
  tema('cog10-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog10-yerlesme-kurulus', 'Yerleşmelerin Kuruluşu ve Gelişimi', [
      kart(
        'Yer seçiminde doğal etkenler',
        'Su kaynağı, iklim, yer şekli, toprak verimliliği ve güvenlik.',
      ),
      kart(
        'Savunma kaygısı',
        'Eski şehirler çoğu zaman tepe ya da yarımada gibi savunulabilir yerlere kuruldu.',
      ),
      kart(
        'Beşerî etkenler',
        'Ticaret yolları, sanayi, maden ve idari kararlar. Ankara’nın başkent olması şehri hızla büyüttü.',
      ),
      kart(
        'Kırsal ve kentsel yerleşme',
        'Ayrım nüfus, ekonomik faaliyet ve hizmet çeşitliliğine göre yapılır.',
      ),
      kart(
        'Yerleşme dokusu',
        'Toplu yerleşme su kıtlığı ve güvenlik gerektiren yerlerde, dağınık yerleşme su ve arazi bol olan yerlerde görülür.',
      ),
      kart(
        'Neden değişir?',
        'Kuruluş sebebi ortadan kalksa da şehir kalabilir: savunma için kurulan bir kale şehri bugün turizmle yaşıyor olabilir.',
      ),
      kart(
        'Geçici yerleşmeler',
        'Yayla, oba ve dam mevsimlik kullanılır. Konargöçer geleneğin bugüne kalan izleridir.',
      ),
    ]),
    konu('cog10-yerlesme-fonksiyon', 'Yerleşmelerin Fonksiyonları', [
      kart(
        'Fonksiyon nedir?',
        'Bir yerleşmenin öne çıkan temel işlevi; şehri besleyen ana faaliyet.',
      ),
      kart(
        'Başlıca türler',
        'Tarım, sanayi, ticaret, liman, turizm, maden, idari, askerî ve üniversite şehirleri.',
      ),
      kart(
        'Türkiye’den örnekler',
        'Bir şehrin adı çoğu zaman öne çıkan işleviyle birlikte anılır.',
        {
          tur: 'tablo',
          basliklar: ['Şehir', 'Fonksiyon'],
          satirlar: [
            ['Bursa, Kocaeli', 'Sanayi'],
            ['Antalya', 'Turizm'],
            ['Zonguldak', 'Maden'],
            ['Ankara', 'İdari'],
            ['Mersin', 'Liman'],
          ],
        },
      ),
      kart(
        'Fonksiyon değişebilir',
        'Maden tükenince ya da yol değişince şehir küçülebilir ya da yeni bir işleve geçebilir.',
      ),
      kart(
        'Çok fonksiyonlu şehirler',
        'Büyük şehirlerde tek bir işlev baskın değildir; İstanbul ticaret, sanayi, turizm ve kültürü birlikte taşır.',
      ),
      kart(
        'Fonksiyon ve nüfus',
        'İşlev çeşitlendikçe şehir daha çok insanı besler; tek işleve bağlı şehirler o işlev sarsıldığında hızla göç verir.',
      ),
    ]),
  ]),
  tema('cog10-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog10-ekonomi-ozellik', 'Ekonomik Faaliyetlerin Özellikleri', [
      kart(
        'Beş sektör',
        'Faaliyetler doğaya olan uzaklıklarına göre basamaklanır; yukarı çıktıkça katma değer artar.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Birincil', alt: 'tarım, maden' },
            { ad: 'İkincil', alt: 'sanayi' },
            { ad: 'Üçüncül', alt: 'hizmet' },
            { ad: 'Dördüncül', alt: 'bilgi, Ar-Ge' },
            { ad: 'Beşincil', alt: 'üst yönetim' },
          ],
        },
      ),
      kart(
        'Birincil faaliyetler',
        'Doğadan doğrudan ürün alma: tarım, hayvancılık, ormancılık, balıkçılık ve madencilik.',
      ),
      kart(
        'İkincil faaliyetler',
        'Ham maddeyi işleyip ürüne çevirme: sanayi, imalat ve inşaat.',
      ),
      kart(
        'Üçüncül faaliyetler',
        'Hizmet üretimi: ticaret, ulaşım, turizm, sağlık ve eğitim.',
      ),
      kart(
        'Dördüncül ve beşincil',
        'Bilgi işleme ve araştırma-geliştirme; üst düzey karar ve yönetim. Gelişmiş ekonomilerde payları artıyor.',
      ),
      kart(
        'Sektörler birbirine bağlı',
        'Tarım olmadan gıda sanayii, sanayi olmadan lojistik olmaz. Zincirin bir halkası ötekini besler.',
      ),
      kart(
        'Katma değer',
        'Ham maddenin işlenerek kazandığı ek değer. Aynı pamuk, kumaşa ve giysiye dönüştükçe kat kat değerlenir.',
      ),
    ]),
    konu('cog10-sektor-gelismislik', 'Ekonomik Sektörler ve Gelişmişlik', [
      kart(
        'Gelişmişlik göstergesi',
        'Sektör dağılımı ülkenin gelişmişliğini gösterir: birincil sektörün payı azaldıkça gelişmişlik artar.',
      ),
      kart(
        'Az gelişmiş ülkelerde',
        'Nüfusun büyük kısmı tarımda çalışır ama üretilen katma değer düşüktür.',
      ),
      kart(
        'Gelişmiş ülkelerde',
        'Hizmet sektörü hem istihdamda hem millî gelirde başı çeker; tarımın payı yüzde birkaçtır.',
      ),
      kart(
        'İstihdam ve gelir farkı',
        'Bir sektörde çok kişi çalışması, o sektörün çok gelir ürettiği anlamına gelmez.',
        {
          tur: 'tablo',
          basliklar: ['Ülke', 'Tarım payı', 'Hizmet payı'],
          satirlar: [
            ['Az gelişmiş', 'Yüksek', 'Düşük'],
            ['Gelişmiş', 'Çok düşük', 'Yüksek'],
          ],
        },
      ),
      kart(
        'Göstergeler',
        'Kişi başına gelir, İnsani Gelişme Endeksi, okuryazarlık ve bebek ölüm hızı birlikte okunur.',
      ),
      kart(
        'Neden tek gösterge yetmez?',
        'Kişi başına gelir ortalamadır ve dağılımı göstermez; yanına eğitim ve sağlık göstergeleri konmadan yanıltıcı olur.',
      ),
    ]),
    konu('cog10-turkiye-ekonomi', 'Türkiye Ekonomisinin Sektörel Dağılımı', [
      kart(
        'Genel görünüm',
        'Tarımın payı azaldı, sanayi ve özellikle hizmet sektörü büyüdü. Yapı gelişmiş ülkelere yaklaşıyor.',
      ),
      kart(
        'Tarım',
        'İstihdamdaki payı hâlâ dikkat çekici ama millî gelirdeki payı düşük; verimlilik temel sorun.',
      ),
      kart(
        'Neden verim düşük?',
        'Küçük ve parçalı araziler makineli tarımı zorlaştırıyor; sulama ve modern yöntemlerin yaygınlığı bölgeden bölgeye değişiyor.',
      ),
      kart(
        'Sanayi',
        'Otomotiv, tekstil, beyaz eşya ve gıda öne çıkıyor. Marmara bölgesinde yoğunlaşmış durumda.',
      ),
      kart(
        'Sanayi neden Marmara’da?',
        'Liman, pazar, iş gücü ve ulaşım ağı orada toplanmış durumda; sanayi kendini besleyen bir yığılma üretiyor.',
      ),
      kart(
        'Hizmetler',
        'Turizm, ticaret ve ulaştırma başı çekiyor; turizm döviz girdisinde önemli bir kalem.',
      ),
      kart(
        'Bölgesel dengesizlik',
        'Sanayi batıda yoğun, doğuda tarım ve hayvancılık ağırlıkta. Teşvik politikaları bu farkı azaltmayı hedefler.',
      ),
    ]),
  ]),
  tema('cog10-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog10-iyi-uygulama', 'Afetlerle Mücadelede İyi Uygulama Örnekleri', [
      kart(
        'Japonya’nın deneyimi',
        'Katı yapı denetimi, erken uyarı sistemi ve düzenli tatbikat; okullarda afet eğitimi zorunlu.',
      ),
      kart(
        'Erken uyarı',
        'Deprem dalgasının hızlı ve yavaş bileşenleri arasındaki fark, saniyeler kazandırıp treni durdurabiliyor.',
      ),
      kart(
        'Yapısal önlemler',
        'Sismik izolatör, güçlendirme ve zemin iyileştirme; yeni yapıda maliyeti düşük, sonradan yüksektir.',
      ),
      kart(
        'Hollanda ve su',
        'Ülkenin büyük kısmı deniz seviyesinin altında; setler, kapaklar ve suya yer bırakan planlama taşkını yönetiyor.',
      ),
      kart(
        'Toplum temelli hazırlık',
        'Mahalle ölçeğinde gönüllü ekipler ilk saatlerde en etkili müdahaleyi yapar.',
      ),
      kart(
        'Türkiye’de',
        'AFAD koordinasyonu, zorunlu deprem sigortası ve kentsel dönüşüm başlıca uygulamalar.',
      ),
      kart(
        'Ortak nokta',
        'Başarılı örneklerin hepsinde önlem afetten önce alınmış ve bir kurumun sürekli sorumluluğuna bağlanmış.',
      ),
    ]),
    konu('cog10-dirençli-alan', 'Afetlere Karşı Dirençli Yaşam Alanları', [
      kart(
        'Dirençlilik nedir?',
        'Afeti önlemek değil, afetten sonra hızla toparlanabilme kapasitesi.',
      ),
      kart(
        'Yer seçimi',
        'Fay hattı, taşkın ovası, heyelan alanı ve gevşek zemin üzerine yapı yapılmaması ilk koşuldur.',
      ),
      kart(
        'Zemin önemli',
        'Gevşek ve suya doygun zemin deprem dalgasını büyütür; aynı bina sağlam kayada çok daha az zorlanır.',
      ),
      kart(
        'Açık alanlar',
        'Park ve meydanlar hem toplanma alanı hem yangın engeli olarak çalışır; yoğun dokuda bunlar yoktur.',
      ),
      kart(
        'Altyapı yedekliliği',
        'Su, elektrik ve iletişimin alternatif hatları olması gerekir; tek hat koparsa şehir felç olur.',
      ),
      kart(
        'Ulaşılabilirlik',
        'Geniş ve birbirine bağlı yollar müdahale ekiplerinin ulaşmasını sağlar.',
      ),
      kart(
        'Dirençli şehrin ögeleri',
        'Beş başlık birlikte çalışır; biri eksikse ötekilerin sağladığı kazanç da düşer.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Doğru yer seçimi' },
            { ad: 'Sağlam yapı' },
            { ad: 'Açık alan' },
            { ad: 'Yedekli altyapı' },
            { ad: 'Hazırlıklı toplum', renk: 'ikincil' },
          ],
        },
      ),
    ]),
    konu('cog10-korunma', 'Afetlerden Korunma', [
      kart(
        'Mekâna göre değişir',
        'Deprem bölgesindeki önlemle sel havzasındaki önlem aynı olamaz; korunma yerin özelliğine göre planlanır.',
      ),
      kart(
        'Depremde',
        'Sağlam yapı, eşya sabitleme, çök-kapan-tutun davranışı ve afet çantası.',
      ),
      kart(
        'Selde',
        'Dere yatağına yapı yapmamak, drenaj, erken uyarı ve yüksek yere tahliye.',
      ),
      kart(
        'Yangında',
        'Orman-yerleşim arasında güvenlik şeridi, erken müdahale ve yanıcı madde temizliği.',
      ),
      kart(
        'Heyelanda',
        'Yamaç eğimini bozmamak, drenajla suyu uzaklaştırmak ve bitki örtüsünü korumak.',
      ),
      kart(
        'Ortak nokta',
        'Korunmanın en etkili adımı afetten önce alınır; sonrasında yapılan her şey daha pahalı ve daha az etkilidir.',
      ),
    ]),
    konu('cog10-afet-bilinci', 'Afet Bilinci', [
      kart(
        'Ne demek?',
        'Riski bilmek, önlemi bilmek ve afet anında ne yapacağını önceden kararlaştırmış olmak.',
      ),
      kart(
        'Neden bilgi yetmiyor?',
        'Bilgi davranışa dönüşmezse işe yaramaz; tatbikat, bilgiyi refleks hâline getirir.',
      ),
      kart(
        'Aile afet planı',
        'Buluşma noktası, iletişim kişisi, afet çantasının yeri ve vana kapatma önceden konuşulmalıdır.',
      ),
      kart(
        'Afet çantası',
        'Su, uzun ömürlü gıda, ilk yardım malzemesi, el feneri, düdük, pil ve kimlik fotokopisi; kapıya yakın tutulur.',
      ),
      kart(
        'Afete dirençli toplum',
        'Program bunu hedef olarak koyuyor: yalnızca bilen değil, imar denetimini ve yapı kalitesini talep eden bir toplum.',
      ),
      kart(
        'Risk algısı sorunu',
        'Uzun süre afet yaşanmayan yerde tehlike unutulur. Hazırlık, en çok da sakin dönemlerde gevşer.',
      ),
    ]),
  ]),
  tema('cog10-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog10-turk-kultur', 'Türk Kültürünün Mekânsal Özellikleri', [
      kart(
        'Yayılış alanı',
        'Balkanlardan Türkistan’a, Sibirya’dan Anadolu’ya uzanan geniş bir kuşak.',
      ),
      kart(
        'Türkistan neresi?',
        'Türk topluluklarının tarihsel yurdu olan geniş İç Asya bölgesi. Program bu adı kullanıyor; "Orta Asya" onun bir bölümünü anlatır.',
      ),
      kart(
        'Ortak unsurlar',
        'Dil ailesi, sözlü gelenek, destanlar, mutfak, halı-kilim dokumacılığı ve müzik.',
      ),
      kart(
        'Konargöçer mirası',
        'Taşınabilir sanat, at kültürü ve otağ geleneği; bu miras yerleşik hayata geçildikten sonra da sürdü.',
      ),
      kart(
        'Coğrafyanın etkisi',
        'Bozkır kuşağı benzer yaşam biçimleri üretti; ortak kültürün coğrafi bir zemini var.',
      ),
      kart(
        'Kültür bölgesi',
        'Sınırları devlet sınırlarıyla çakışmayan, ortak dil ve gelenekle tanımlanan alan. Geçiş kuşakları keskin değildir.',
      ),
      kart(
        'Bugünkü bağlar',
        'Türk Devletleri Teşkilatı gibi yapılar kültürel yakınlığı ekonomik ve siyasi iş birliğine çeviriyor.',
      ),
      kart(
        'Yeşil Vatan',
        'Ormanların vatanın bir parçası sayıldığı yaklaşım; ağaçlandırma ve yangınla mücadele bu kavramla anılıyor.',
      ),
    ]),
  ]),
])
