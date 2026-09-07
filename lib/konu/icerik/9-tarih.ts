import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema: Geçmişin İnşa Sürecinde Tarih, Eski Çağ Medeniyetleri, Orta Çağ
 * Medeniyetleri. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Program konuları **medeniyet ekseninde** kuruyor: eski programdaki
 * "Mezopotamya", "Anadolu Medeniyetleri" gibi coğrafya başlıkları yok;
 * yerine yönetim, hukuk, inanç gibi karşılaştırmalı başlıklar var.
 */
export const tarih9 = program('tarih', 9, 'Tarihin doğasından Orta Çağ’a', [
  tema('trh9-t1', 'Geçmişin İnşa Sürecinde Tarih', [
    konu('trh9-fayda', 'Tarih Öğrenmenin Faydaları', [
      kart(
        'Neden tarih?',
        'Bugünkü kurumların, sınırların ve sorunların nereden geldiğini anlatır. Bugünü açıklayan şey çoğu zaman dündür.',
      ),
      kart(
        'Kimlik ve aidiyet',
        'Ortak geçmiş bilgisi bir toplumu birbirine bağlar; kendini tanımanın bir yolu da geçmişini bilmektir.',
      ),
      kart(
        'Eleştirel düşünme',
        'Tarih, kaynak sorgulamayı öğretir: kim söylemiş, neden söylemiş, neyi atlamış?',
      ),
      kart(
        'Empati kurmak',
        'Geçmişteki insanı kendi çağının koşullarıyla anlamak; bugünün ölçüleriyle yargılamak tarih değil, ahlak dersi olur.',
      ),
      kart(
        'Tekrarlamaz ama benzer',
        'Tarih birebir tekrarlanmaz; benzer koşullar benzer sonuçlar üretir. Ders alınan şey kalıp değil örüntüdür.',
      ),
      kart(
        'Kötüye kullanımı',
        'Geçmiş, bugünün siyasi iddiasını haklı çıkarmak için seçilerek anlatılabilir. Tarih bilgisi bunun panzehiridir.',
      ),
    ]),
    konu('trh9-doga', 'Tarihin Doğası', [
      kart(
        'Tarih nedir?',
        'Geçmişteki insan topluluklarını, yer ve zaman göstererek, sebep-sonuç ilişkisi içinde inceleyen bilim.',
      ),
      kart(
        'Neden deney yapılamaz?',
        'Olaylar tek seferliktir ve geri döndürülemez. Bu yüzden tarih deneye değil kaynağa dayanır.',
      ),
      kart(
        'Nesnellik sorunu',
        'Tarihçi kendi çağının insanıdır. Nesnellik, önyargısızlık iddiası değil, kaynağa sadakat ve yöntem disiplinidir.',
      ),
      kart(
        'Yer ve zaman şart',
        'Yeri ve zamanı belirsiz bir anlatı tarih değildir. İkisi tarihsel bilginin çerçevesidir.',
      ),
      kart(
        'Çağlara ayırma',
        'Çağ sınırları tarihçilerin kolaylık için koyduğu ölçülerdir; insanlar 476’da "Orta Çağ başladı" diye uyanmadı.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'İlk Çağ', alt: 'yazı → 375' },
            { ad: 'Orta Çağ', alt: '375 → 1453' },
            { ad: 'Yeni Çağ', alt: '1453 → 1789' },
            { ad: 'Yakın Çağ', alt: '1789 →' },
          ],
        },
      ),
      kart(
        'Tarih öncesi ve tarihî çağlar',
        'Ayıran şey yazının bulunmasıdır. Yazıdan öncesi kalıntılarla, sonrası belgelerle incelenir.',
      ),
      kart(
        'Takvimler',
        'Toplumlar kendi başlangıç noktalarını seçti: Hicrî takvim ay yılına, Miladî takvim güneş yılına dayanır.',
      ),
    ]),
    konu('trh9-uretim', 'Tarihsel Bilginin Üretim Süreci', [
      kart(
        'Kaynak türleri',
        'Birinci elden kaynak olayın çağından gelir (belge, kalıntı); ikinci elden kaynak onu yorumlar.',
      ),
      kart(
        'Yazılı ve yazısız',
        'Yazılı kaynak belge, kitabe ve ferman; yazısız kaynak kalıntı, sikke, mimari ve mezar buluntusudur.',
      ),
      kart(
        'Kaynak eleştirisi',
        'Dış eleştiri belgenin gerçek olup olmadığını, iç eleştiri içeriğinin güvenilirliğini sorgular.',
      ),
      kart(
        'Yardımcı bilimler',
        'Tarihin tek başına okuyamadığı kaynakları bu bilimler çözer.',
        {
          tur: 'tablo',
          basliklar: ['Bilim', 'Neyi inceler?'],
          satirlar: [
            ['Arkeoloji', 'Kalıntı'],
            ['Paleografya', 'Eski yazı'],
            ['Nümizmatik', 'Para'],
            ['Epigrafya', 'Kitabe'],
            ['Kronoloji', 'Zaman'],
          ],
        },
      ),
      kart(
        'Adımlar',
        'Kaynak tarama, tasnif, tahlil, tenkit ve terkip. Son adımda parçalar bütünlüklü bir anlatıya dönüşür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tarama', alt: 'kaynak toplanır' },
            { ad: 'Tasnif', alt: 'sınıflanır' },
            { ad: 'Tahlil', alt: 'çözümlenir' },
            { ad: 'Tenkit', alt: 'eleştirilir' },
            { ad: 'Terkip', alt: 'birleştirilir' },
          ],
        },
      ),
      kart(
        'Tarih yazımı değişir',
        'Yeni belge bulunduğunda ya da yeni sorular sorulduğunda aynı dönem yeniden yazılır.',
      ),
    ]),
    konu('trh9-dijital', 'Tarih Araştırma ve Yazımında Dijitalleşme', [
      kart(
        'Arşivler açıldı',
        'Devlet arşivleri belgeleri sayısallaştırdı; eskiden yıllar alan tarama artık uzaktan yapılabiliyor.',
      ),
      kart(
        'Yeni yöntemler',
        'Coğrafi bilgi sistemleriyle haritalama, büyük veriyle nüfus ve ticaret analizi tarihçinin araç setine girdi.',
      ),
      kart(
        'Dijital sergiler',
        'Müze koleksiyonları ve harabeler üç boyutlu taranıyor; ulaşılamayan bir yapı ekranda gezilebiliyor.',
      ),
      kart(
        'Doğrulama sorunu',
        'İnternetteki her metin kaynak değildir. Dijital ortamda kaynak eleştirisi daha da gerekli hâle geldi.',
      ),
      kart(
        'Yapay zekâ ve tarih',
        'Eski el yazmalarını okumada yardımcı oluyor; ama ürettiği metin doğrulanmadan tarihsel bilgi sayılamaz.',
      ),
      kart(
        'Dijital kaybolma',
        'Kâğıt yüzyıllar dayanır; dosya biçimleri ve diskler onlarca yılda okunamaz hâle gelebilir.',
      ),
    ]),
  ]),
  tema('trh9-t2', 'Eski Çağ Medeniyetleri', [
    konu('trh9-tarim', 'Tarım Devrimi’nin Yerleşmeye ve Ekonomiye Etkisi', [
      kart(
        'Tarım devrimi',
        'Yaklaşık 12 bin yıl önce insanlar bitkiyi ve hayvanı evcilleştirdi. Toplayıcılıktan üretime geçildi.',
      ),
      kart(
        'Zincirleme sonuç',
        'Tek bir değişiklik, birbirini doğuran bir dizi sonuç üretti; şehir ve devlet bu zincirin sonunda duruyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tarım' },
            { ad: 'Yerleşik hayat' },
            { ad: 'Artı ürün' },
            { ad: 'İş bölümü' },
            { ad: 'Şehir ve devlet' },
          ],
        },
      ),
      kart(
        'Yerleşik hayat',
        'Tarla bakım istediği için insan yerleşti. Köyler, sonra şehirler bu zorunluluktan doğdu.',
      ),
      kart(
        'Artı ürün',
        'İhtiyaçtan fazla üretim; tarımla uğraşmayan zanaatkâr, asker ve rahip sınıfını mümkün kıldı.',
      ),
      kart(
        'Mülkiyet ve sınıf',
        'Toprak ve depolanan ürün "kimin" sorusunu doğurdu; toplumsal eşitsizlik ve hukuk aynı kökten çıktı.',
      ),
      kart(
        'Yazının doğuşu',
        'Artı ürünün kaydını tutma ihtiyacı yazıyı doğurdu. İlk tabletler edebiyat değil, muhasebe kaydıdır.',
      ),
      kart(
        'Anadolu’dan izler',
        'Göbeklitepe ve Çatalhöyük, bu geçiş döneminin dünyaca önemli merkezleridir.',
      ),
    ]),
    konu('trh9-yonetim', 'Eski Çağ Medeniyetlerinde Yönetim ve Ordu', [
      kart(
        'Yönetim biçimleri',
        'Site devletleri, krallıklar ve imparatorluklar. Toprak büyüdükçe yönetim de merkezîleşti.',
      ),
      kart(
        'Teokratik yönetim',
        'Mısır’da firavun tanrı-kral sayılırdı. Din ile devletin ayrılmadığı bu yapı yaygındı.',
      ),
      kart(
        'Ordu ve teknoloji',
        'Tunç ve demir silahlar, savaş arabası ve at, güç dengesini belirledi. Demiri işleyen Hititler öne çıktı.',
      ),
      kart(
        'Atina ve demokrasi',
        'Atina’da yurttaşlar doğrudan karar veriyordu; ama kadınlar, köleler ve yabancılar yurttaş sayılmıyordu.',
      ),
      kart(
        'Sparta',
        'Askerî bir düzen kurulmuştu: eğitim savaşçı yetiştirmeye ayarlıydı ve yönetim dar bir gruptaydı.',
      ),
      kart(
        'Roma’nın yönetimi',
        'Krallıktan cumhuriyete, oradan imparatorluğa geçti. Senato ve konsüllük kalıcı bir yönetim geleneği bıraktı.',
      ),
      kart(
        'Ordunun beslenmesi',
        'Sürekli ordu artı ürüne bağlıdır. Vergi düzeni bozulan devletin ordusu da kısa sürede çözülürdü.',
      ),
    ]),
    konu('trh9-hukuk', 'Eski Çağ Medeniyetlerinde Hukuk', [
      kart(
        'Urgakina kanunları',
        'Bilinen ilk yazılı yasalar Sümerlerde çıktı; amaç güçlünün zayıfı ezmesini sınırlamaktı.',
      ),
      kart(
        'Hammurabi kanunları',
        'Babil’de sert ve kısasa dayalı yasalar. Yazılı olması, keyfî cezayı sınırlaması bakımından ileri bir adımdı.',
      ),
      kart(
        'Hitit hukuku',
        'Cezalar daha yumuşak ve tazminat ağırlıklıydı; kadınların hukuki durumu çağdaşlarına göre iyiydi.',
      ),
      kart(
        'İki ceza anlayışı',
        'Aynı çağda iki yaklaşım yan yana yaşadı ve ikisi de bugünkü hukuka iz bıraktı.',
        {
          tur: 'tablo',
          basliklar: ['Anlayış', 'Örnek'],
          satirlar: [
            ['Kısas', 'Hammurabi'],
            ['Tazminat', 'Hitit'],
          ],
        },
      ),
      kart(
        'Roma hukuku',
        'On İki Levha ile başladı; bugünkü Avrupa hukuk sistemlerinin temelinde Roma hukuku vardır.',
      ),
      kart(
        'Ortak yön',
        'Yasanın yazılı olması, hukuku hükümdarın ağzından çıkarıp herkesin bilebileceği bir ölçüye çevirdi.',
      ),
    ]),
    konu('trh9-inanc', 'Eski Çağ’da İnançlar, Bilim ve Sanat', [
      kart(
        'Çok tanrılı inançlar',
        'Doğa olayları tanrılarla açıklanıyordu. Tapınaklar aynı zamanda ekonomik ve idari merkezlerdi.',
      ),
      kart(
        'Tek tanrılı inanışlar',
        'Musevilik bu çağda ortaya çıktı; Mısır’da Akhenaton’un girişimi kısa sürdü.',
      ),
      kart(
        'Ölümden sonra',
        'Mısır’da öbür dünya inancı mumyalamayı ve anıt mezarları doğurdu; inanç mimariyi doğrudan biçimlendirdi.',
      ),
      kart(
        'Bilim',
        'Mısırlılar geometri ve takvimde, Babilliler astronomi ve matematikte ilerledi. İhtiyaç bilimi doğurdu.',
      ),
      kart(
        'Neden geometri Mısır’da?',
        'Nil her yıl taşıp tarla sınırlarını siliyordu; arazi yeniden ölçülmek zorundaydı.',
      ),
      kart(
        'Felsefe',
        'Yunan dünyasında olaylar tanrılarla değil akılla açıklanmaya başladı; bilimsel düşüncenin kökü buradadır.',
      ),
      kart(
        'Sanat',
        'Anıtsal yapılar (piramit, zigurat, tapınak) hem inancın hem gücün gösterisiydi.',
      ),
    ]),
    konu('trh9-konargocer', 'Türklerde Konargöçer Yaşam', [
      kart(
        'Konargöçerlik nedir?',
        'Mevsime göre yaylak ve kışlak arasında düzenli göç. Başıboş dolaşmak değil, planlı bir yaşam biçimidir.',
      ),
      kart(
        'Neden bu yaşam?',
        'Orta Asya’nın bozkır iklimi tarıma elverişsizdi; hayvancılık otlak takibini zorunlu kılıyordu.',
      ),
      kart(
        'Toplum yapısı',
        'Örgütlenme aileden başlayıp devlete kadar iç içe halkalar hâlinde büyür.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'İl (devlet)' },
            { ad: 'Budun (millet)' },
            { ad: 'Boy' },
            { ad: 'Urug' },
            { ad: 'Oguş (aile)' },
          ],
        },
      ),
      kart(
        'Askerî güç',
        'At ve demir işçiliği; herkesin savaşçı olduğu ordu-millet yapısı hareket üstünlüğü sağlıyordu.',
      ),
      kart(
        'Kut anlayışı',
        'Yönetme yetkisinin Tanrı tarafından verildiğine inanılırdı. Kut kan yoluyla geçtiği için taht kavgaları sıktı.',
      ),
      kart(
        'Kültüre etkisi',
        'Taşınabilir sanat (at koşumu, halı, madenî eşya) gelişti; anıtsal mimari yerine sözlü kültür öne çıktı.',
      ),
      kart(
        'Yerleşiklerle ilişki',
        'Bozkır ile tarım havzası birbirini besledi: göçebe hayvan ve at, yerleşik tahıl ve kumaş verdi.',
      ),
    ]),
  ]),
  tema('trh9-t3', 'Orta Çağ Medeniyetleri', [
    konu('trh9-goc', 'Orta Çağ’da Yaşanan Kitlesel Göçler', [
      kart(
        'Kavimler Göçü',
        'Hunların batıya ilerlemesi Germen kavimlerini yerinden etti; 375’te başlayan bu dalga Avrupa’yı yeniden şekillendirdi.',
      ),
      kart(
        'Göçün sebepleri',
        'İklim değişikliği, otlak yetersizliği, nüfus baskısı ve dış saldırılar.',
      ),
      kart(
        'Sonuçları',
        'Batı Roma yıkıldı, feodalite doğdu, Avrupa’da bugünkü ulusların temeli atıldı. İlk Çağ kapandı.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Hun baskısı', alt: '375' },
            { ad: 'Germen göçü' },
            { ad: 'Batı Roma yıkıldı', alt: '476' },
            { ad: 'Feodalite' },
          ],
        },
      ),
      kart(
        'Türk göçleri',
        'Türk boyları Orta Asya’dan Anadolu, İran ve Hindistan’a yayıldı; gittikleri yerlerin kültürünü de dönüştürdüler.',
      ),
      kart(
        'Göç ve din',
        'Göç eden topluluklar gittikleri yerin dinini benimseyebiliyordu; Türklerin İslamlaşması bu sürecin sonucudur.',
      ),
      kart(
        'Göç tek yönlü değil',
        'Gelen topluluk yerleşiği değiştirdiği kadar kendisi de değişir. Kültür alışverişi her zaman iki yönlüdür.',
      ),
    ]),
    konu('trh9-devletler', 'Orta Çağ Devletlerinde Yönetim ve Ordu', [
      kart(
        'Feodalite',
        'Merkezî otorite zayıflayınca toprak sahibi senyörler güçlendi. Koruma karşılığı hizmet ilişkisi kuruldu.',
      ),
      kart(
        'Feodal piramit',
        'Yetki ve toprak yukarıdan aşağı dağıtılır, hizmet ve ürün aşağıdan yukarı akardı.',
        {
          tur: 'katman',
          daralan: false,
          katmanlar: [
            { ad: 'Kral' },
            { ad: 'Soylular' },
            { ad: 'Şövalyeler' },
            { ad: 'Serfler' },
          ],
        },
      ),
      kart(
        'Bizans',
        'Roma’nın doğu mirasını sürdürdü; güçlü bürokrasi ve tema sistemiyle uzun süre ayakta kaldı.',
      ),
      kart(
        'İslam devletlerinde yönetim',
        'Halifelik makamı din ve devlet başkanlığını birleştirdi; divan teşkilatı yönetimi yürüttü.',
      ),
      kart(
        'Türk-İslam devletleri',
        'Karahanlılar, Gazneliler ve Selçuklularda ikta sistemi hem orduyu besledi hem toprağı işletti.',
      ),
      kart(
        'İkta nasıl işler?',
        'Toprağın vergisi bir komutana bırakılır, o da karşılığında asker besler. Devlet nakit ödemeden ordu kurmuş olur.',
      ),
      kart(
        'Ordu yapıları',
        'Avrupa’da şövalye, Bizans’ta tema askeri, İslam dünyasında gulam ve ikta askerleri.',
      ),
    ]),
    konu('trh9-ticaret', 'Orta Çağ’daki Ticaret Yolları', [
      kart(
        'İpek Yolu',
        'Çin’den Akdeniz’e uzanırdı. Yalnızca ipek değil; kâğıt, barut ve pusula da bu yolla batıya geçti.',
      ),
      kart(
        'Baharat Yolu',
        'Hindistan ve Güneydoğu Asya’dan baharatı taşıyordu. Baharat hem lezzet hem koruyucu olduğu için çok değerliydi.',
      ),
      kart(
        'Kürk Yolu',
        'Kuzey bozkırlarından Doğu Avrupa’ya uzanan yol; kürk ve orman ürünleri taşıyordu.',
      ),
      kart(
        'Üç yol, üç yük',
        'Yolların adı taşıdıkları başlıca maldan gelir ama hepsi aynı zamanda fikir ve hastalık da taşıdı.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Güzergâh'],
          satirlar: [
            ['İpek', 'Çin → Akdeniz'],
            ['Baharat', 'Hindistan → Mısır'],
            ['Kürk', 'Sibirya → Avrupa'],
          ],
        },
      ),
      kart(
        'Yol denetimi güçtür',
        'Yolları elinde tutan devlet gümrük geliri ve siyasi ağırlık kazanırdı. Savaşların sebebi çoğu zaman buydu.',
      ),
      kart(
        'Kervansaraylar',
        'Selçuklular yol güvenliği için kervansaray kurdu ve sigorta benzeri bir tazmin uygulaması geliştirdi.',
      ),
      kart(
        'Yolun taşıdığı başka şeyler',
        'Veba salgını da ticaret yollarını izleyerek yayıldı; 14. yüzyılda Avrupa nüfusunun büyük kısmını yok etti.',
      ),
    ]),
    konu('trh9-medeniyet', 'Orta Çağ’da Bilim, Kültür ve Sanat', [
      kart(
        'İslam bilim havzası',
        'Bağdat’taki Beytü’l-Hikme’de Yunan ve Hint eserleri çevrildi; matematik, tıp ve astronomi ilerledi.',
      ),
      kart(
        'Öne çıkan adlar',
        'Bu adların eserleri Avrupa üniversitelerinde yüzyıllarca ders kitabı olarak okutuldu.',
        {
          tur: 'tablo',
          basliklar: ['Bilgin', 'Katkısı'],
          satirlar: [
            ['Harezmî', 'Cebir'],
            ['İbn Sina', 'Tıp'],
            ['Birunî', 'Astronomi'],
            ['İbn Heysem', 'Optik'],
          ],
        },
      ),
      kart(
        'Kâğıdın yolculuğu',
        'Çin’de bulunan kâğıt Semerkant üzerinden İslam dünyasına, oradan Avrupa’ya geçti ve bilgi ucuzladı.',
      ),
      kart(
        'Avrupa’da manastırlar',
        'Bilgi manastırlarda korundu. Üniversiteler 11. yüzyıldan sonra kuruldu.',
      ),
      kart(
        'Bilgi aktarımı',
        'Endülüs ve Sicilya, İslam dünyasındaki birikimin Avrupa’ya geçtiği köprülerdi.',
      ),
      kart(
        'Medreseler',
        'Selçuklularda Nizamiye medreseleri düzenli bir eğitim ağı kurdu; hem din hem pozitif bilim okutuluyordu.',
      ),
      kart(
        'Sanat',
        'Mimaride kubbe, kemer ve çini; Avrupa’da romanesk ve gotik üsluplar. İnanç, sanatın başlıca konusuydu.',
      ),
    ]),
  ]),
])
