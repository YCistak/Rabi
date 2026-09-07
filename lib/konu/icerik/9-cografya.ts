import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Coğrafya — Maarif Modeli.
 *
 * Yedi tema; ikisi (Ekonomik Faaliyetler, Bölgeler) 9. sınıfta yalnızca
 * dörder saat ve tek konu. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Aynı yedi tema 10. sınıfta da var — program konuları temalara **yayarak**
 * ilerletiyor, tema başlıkları sınıf değiştirmiyor.
 */
export const cografya9 = program('cografya', 9, 'Mekânı okumaya başlangıç', [
  tema('cog9-t1', 'Coğrafyanın Doğası', [
    konu('cog9-konu-bolum', 'Coğrafya Biliminin Konusu ve Bölümleri', [
      kart(
        'Coğrafya neyi inceler?',
        'İnsan ile doğal ortam arasındaki karşılıklı etkileşimi, dağılış ve yer göstererek inceler.',
      ),
      kart(
        'Fizikî coğrafya',
        'Doğal ortamı inceler: yer şekilleri, iklim, su, toprak ve canlılar.',
      ),
      kart(
        'Beşerî coğrafya',
        'İnsanın mekândaki izini inceler: nüfus, yerleşme, ekonomi, ulaşım ve kültür.',
      ),
      kart(
        'Alt dallar',
        'İki ana bölümün her biri kendi içinde uzmanlaşmış dallara ayrılır.',
        {
          tur: 'tablo',
          basliklar: ['Fizikî', 'Beşerî'],
          satirlar: [
            ['Jeomorfoloji', 'Nüfus coğrafyası'],
            ['Klimatoloji', 'Yerleşme coğ.'],
            ['Hidrografya', 'Ekonomik coğ.'],
            ['Biyocoğrafya', 'Siyasi coğrafya'],
          ],
        },
      ),
      kart(
        'Üç temel soru',
        'Nerede, neden orada, sonucu ne? Coğrafyayı öteki bilimlerden ayıran şey ikinci ve üçüncü sorudur.',
      ),
      kart(
        'Dağılış ilkesi',
        'Coğrafya bir olayı tek başına değil, yeryüzüne yayılışıyla inceler. Dağılış haritası coğrafyanın temel aracıdır.',
      ),
    ]),
    konu('cog9-nicin', 'Niçin Coğrafya Öğrenmeliyiz?', [
      kart(
        'Mekânsal düşünme',
        'Olayları yerle birlikte düşünmeyi öğretir: bir depremin sonucu, olduğu yere göre değişir.',
      ),
      kart(
        'Günlük kararlar',
        'Nerede oturulacağı, hangi ürünün nerede yetişeceği, hangi yolun seçileceği coğrafi kararlardır.',
      ),
      kart(
        'Afet ve risk',
        'Fay hattını, taşkın ovasını ve heyelan alanını bilmek doğrudan can güvenliğiyle ilgilidir.',
      ),
      kart(
        'Kaynak yönetimi',
        'Su, toprak ve enerji sınırlıdır. Nerede ne kadar olduğunu bilmeden paylaşım da koruma da yapılamaz.',
      ),
      kart(
        'Küresel bakış',
        'İklim değişikliği, göç ve kaynak paylaşımı gibi sorunlar coğrafi düşünmeden anlaşılmaz.',
      ),
    ]),
    konu('cog9-gelisim', 'Coğrafya Biliminin Gelişimi', [
      kart(
        'İlk Çağ',
        'Eratosthenes dünyanın çevresini şaşırtıcı bir yaklaşıklıkla hesapladı; "coğrafya" sözcüğü de ona dayanır.',
      ),
      kart(
        'Batlamyus',
        'Enlem ve boylam ağıyla harita çizdi. Eseri yüzyıllar boyunca hem İslam dünyasında hem Avrupa’da kullanıldı.',
      ),
      kart(
        'İslam dünyasında',
        'Birunî, İdrisî ve Piri Reis harita ve seyahat bilgisiyle coğrafyayı ilerletti.',
      ),
      kart(
        'Keşifler çağı',
        'Uzun deniz yolculukları dünya haritasını tamamladı; coğrafya betimlemeden ölçmeye geçti.',
      ),
      kart(
        'Modern coğrafya',
        'Bugün uydu görüntüsü ve coğrafi bilgi sistemleriyle çalışıyor; veri artık gerçek zamanlı.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Anlatma' },
            { ad: 'Haritalama' },
            { ad: 'Ölçme' },
            { ad: 'Modelleme' },
          ],
        },
      ),
    ]),
  ]),
  tema('cog9-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog9-harita', 'Mekânın Aynası Haritalar', [
      kart(
        'Harita nedir?',
        'Yeryüzünün tamamının ya da bir bölümünün, ölçek kullanılarak düzleme aktarılmış küçültülmüş çizimi.',
      ),
      kart(
        'Ölçek',
        'Haritadaki uzunluğun gerçekteki uzunluğa oranı. Payda büyüdükçe ölçek küçülür ve ayrıntı azalır.',
        {
          tur: 'tablo',
          basliklar: ['Ölçek', 'Alan', 'Ayrıntı'],
          satirlar: [
            ['1/5.000', 'Dar', 'Çok'],
            ['1/500.000', 'Geniş', 'Az'],
          ],
        },
      ),
      kart(
        'Bileşenleri',
        'Başlık, ölçek, lejant, yön oku ve koordinat. Biri eksikse harita okunamaz.',
      ),
      kart(
        'Bozulma kaçınılmaz',
        'Küre düzleme aktarılırken alan, açı ya da uzunluktan biri mutlaka bozulur; hiçbir izdüşüm üçünü birden koruyamaz.',
      ),
      kart(
        'İzohips',
        'Aynı yükseltideki noktaları birleştiren eğri. Sıklaştıkça eğim dikleşir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [3, 3],
                [4.6, 4],
                [5.2, 3],
                [4.6, 2],
                [3, 3],
              ],
              kapali: true,
            },
            {
              noktalar: [
                [2, 3],
                [4.8, 4.9],
                [6.2, 3],
                [4.8, 1.1],
                [2, 3],
              ],
              kapali: true,
            },
            {
              noktalar: [
                [1, 3],
                [5, 5.6],
                [7.4, 3],
                [5, 0.4],
                [1, 3],
              ],
              kapali: true,
            },
          ],
          etiketler: [{ x: 8.7, y: 3, ad: 'tepe', renk: 'ikincil' }],
        },
      ),
      kart(
        'Yükselti basamağı',
        'Renkli haritada yeşil ovayı, sarı ve kahverengi yükselen araziyi gösterir; renk bir yükselti aralığıdır.',
      ),
      kart(
        'Profil çıkarma',
        'İzohips haritasında bir hat boyunca yükseltiler işaretlenip birleştirilirse arazinin yandan görünüşü çıkar.',
      ),
    ]),
    konu('cog9-konum', 'Türkiye’nin Coğrafi Konumu', [
      kart(
        'Matematik konum',
        'Yaklaşık 36°-42° kuzey enlemleri ile 26°-45° doğu boylamları arasında.',
      ),
      kart(
        'Enlemin sonuçları',
        'Orta kuşakta olduğu için dört mevsim belirgin yaşanır; güneyden kuzeye sıcaklık azalır.',
      ),
      kart(
        'Boylamın sonuçları',
        'Doğu ile batı arasında 19 boylam farkı vardır; her boylam 4 dakika ettiği için yerel saat farkı 76 dakikadır.',
      ),
      kart(
        'Tek saat dilimi',
        'Ülke doğu-batı boyunca 76 dakikalık fark taşısa da tek saat kullanır; bu, ortak bir çalışma düzeni sağlar.',
      ),
      kart(
        'Özel konum',
        'Üç kıtanın kesiştiği yerde, boğazlara sahip; Asya ile Avrupa arasındaki geçiş konumu stratejik değer taşır.',
      ),
      kart(
        'Yükselti etkisi',
        'Ortalama yükseltisi fazladır ve doğuya doğru artar; bu, iklimi ve tarımı doğrudan etkiler.',
      ),
      kart(
        'Konumun ekonomiye etkisi',
        'Enerji hatlarının ve ticaret yollarının kesiştiği yerde olmak, transit geçiş ve turizm avantajı sağlar.',
      ),
    ]),
    konu('cog9-mbt', 'Mekânsal Bilgi Teknolojilerinin Bileşenleri', [
      kart(
        'CBS nedir?',
        'Coğrafi Bilgi Sistemleri; konumlu veriyi toplayan, saklayan, çözümleyen ve haritaya döken sistem.',
      ),
      kart(
        'Bileşenler',
        'Donanım, yazılım, veri, insan ve yöntem. En kritik ve en pahalı bileşen veridir.',
      ),
      kart(
        'Uzaktan algılama',
        'Uydu ve hava araçlarıyla temas etmeden veri toplama. Orman yangını ve kuraklık takibinde kullanılır.',
      ),
      kart(
        'GPS',
        'Uydularla konum belirleme. En az dört uydudan gelen sinyal, alıcının yerini üç boyutlu olarak verir.',
      ),
      kart(
        'Katman mantığı',
        'CBS veriyi katmanlar hâlinde üst üste bindirir; çözümleme bu bindirmeden çıkar.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Nüfus' },
            { ad: 'Yollar' },
            { ad: 'Akarsular' },
            { ad: 'Arazi kullanımı' },
          ],
        },
      ),
      kart(
        'Nerede kullanılır?',
        'Kent planlaması, afet yönetimi, tarım, lojistik ve sağlık; salgın haritaları da bu sistemlerle üretiliyor.',
      ),
      kart(
        'Veri doğruysa sonuç doğru',
        'CBS eski ya da hatalı veriyle de düzgün görünen bir harita üretir. Çıktının güzelliği doğruluk kanıtı değildir.',
      ),
    ]),
  ]),
  tema('cog9-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog9-hava-olay', 'Hava Olayları ve Günlük Hayata Etkileri', [
      kart(
        'Hava durumu ve iklim',
        'Hava durumu kısa süreli, iklim ise uzun yılların ortalaması. "Bugün yağmurlu" hava, "yazları kurak" iklimdir.',
      ),
      kart(
        'Atmosferin katmanları',
        'Hava olaylarının tamamı en alttaki troposferde gerçekleşir; yukarı çıkıldıkça hava seyrelir.',
        {
          tur: 'katman',
          eksenAdi: 'YÜKSEKLİK',
          katmanlar: [
            { ad: 'Ekzosfer' },
            { ad: 'Termosfer' },
            { ad: 'Mezosfer' },
            { ad: 'Stratosfer', alt: 'ozon' },
            { ad: 'Troposfer', alt: 'hava olayları' },
          ],
        },
      ),
      kart(
        'Sıcaklık ve basınç',
        'Isınan hava yükselir ve alçak basınç oluşur; soğuyan hava alçalır ve yüksek basınç oluşur.',
      ),
      kart(
        'Rüzgâr',
        'Yüksek basınçtan alçak basınca doğru esen hava. Basınç farkı büyüdükçe hızı artar.',
      ),
      kart(
        'Nem ve yağış',
        'Havadaki su buharı yoğuşunca bulut, bulut damlaları büyüyünce yağış olur.',
      ),
      kart(
        'Yağış türleri',
        'Yükselme sebebine göre üçe ayrılır: yamaç (orografik), cephe (frontal) ve yükselim (konveksiyonel).',
      ),
      kart(
        'Günlük etkiler',
        'Tarım, ulaşım, enerji ve sağlık hava olaylarına bağlıdır; don ve dolu bir yılın ürününü götürebilir.',
      ),
    ]),
    konu('cog9-iklim-sistem', 'İklim Sisteminin Bileşen ve Değişkenleri', [
      kart(
        'Beş bileşen',
        'Atmosfer, su küre (hidrosfer), taş küre (litosfer), canlı küre (biyosfer) ve buz küre.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Atmosfer' },
            { ad: 'Su küre' },
            { ad: 'Taş küre' },
            { ad: 'Canlı küre' },
          ],
        },
      ),
      kart(
        'Değişkenler',
        'Sıcaklık, basınç, nem, yağış, rüzgâr ve güneşlenme süresi.',
      ),
      kart(
        'Enlem etkisi',
        'Güneş ışınlarının geliş açısı enlemle değişir; ekvatordan kutuplara gidildikçe sıcaklık düşer.',
      ),
      kart(
        'Yükselti etkisi',
        'Her 100 metrede sıcaklık yaklaşık 0,5 °C düşer. Aynı enlemde bile dağ ile ova arasında büyük fark oluşur.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık',
          yAd: 'yükselti',
          egriler: [
            {
              noktalar: [
                [5.5, 0.3],
                [0.5, 5.5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'Karasallık',
        'Denizden uzaklaştıkça gece-gündüz ve yaz-kış sıcaklık farkları büyür; kara çabuk ısınıp çabuk soğur.',
      ),
      kart(
        'Bakı',
        'Kuzey yarım kürede güneye bakan yamaçlar daha çok ısınır; yerleşme ve tarım bu yamaçlarda yoğunlaşır.',
      ),
      kart(
        'Okyanus akıntıları',
        'Sıcak akıntılar kıyıyı ılıtır, soğuk akıntılar serinletir ve kuraklaştırır.',
      ),
    ]),
    konu('cog9-iklim-tur', 'İklim Türleri', [
      kart(
        'Sıcak kuşak iklimleri',
        'Ekvatoral (yıl boyu sıcak ve yağışlı), savan (yazı yağışlı), çöl ve muson iklimleri.',
      ),
      kart(
        'Ilıman kuşak iklimleri',
        'Akdeniz, okyanusal, karasal ve step iklimleri. Türkiye bu kuşaktadır.',
      ),
      kart(
        'Soğuk kuşak iklimleri',
        'Tundra ve kutup iklimi. Bitki örtüsü cılızdır ya da hiç yoktur.',
      ),
      kart(
        'Kuşaklar enleme bağlı',
        'Dönenceler ve kutup daireleri, iklim kuşaklarının sınırlarını çizer.',
        {
          tur: 'katman',
          eksenAdi: 'KUZEYDEN GÜNEYE',
          katmanlar: [
            { ad: 'Soğuk kuşak' },
            { ad: 'Ilıman kuşak' },
            { ad: 'Sıcak kuşak', alt: 'dönenceler arası' },
            { ad: 'Ilıman kuşak' },
            { ad: 'Soğuk kuşak' },
          ],
        },
      ),
      kart(
        'Türkiye’nin iklimleri',
        'Kıyılarda Akdeniz ve Karadeniz iklimi, iç kesimlerde karasal iklim görülür.',
      ),
      kart(
        'Bitki örtüsü izler',
        'Akdeniz ikliminde maki, Karadeniz’de orman, iç kesimlerde bozkır. Bitki, iklimin görünen yüzüdür.',
      ),
      kart(
        'İklim grafiği okuma',
        'Sütunlar yağışı, çizgi sıcaklığı gösterir. Yaz kuraklığı belirginse Akdeniz iklimi akla gelir.',
      ),
    ]),
    konu('cog9-iklim-degisim', 'İklim Sisteminde Yaşanan Değişiklikler', [
      kart(
        'Doğal değişimler',
        'Yörünge değişiklikleri, volkanik patlamalar ve güneş etkinliği iklimi jeolojik zaman ölçeğinde değiştirdi.',
      ),
      kart(
        'İnsan kaynaklı değişim',
        'Sanayi devriminden bu yana fosil yakıt kullanımı sera gazlarını hızla artırdı.',
      ),
      kart(
        'Sera etkisi',
        'Atmosferdeki gazlar yeryüzünden yansıyan ısıyı tutar. Doğal sera etkisi olmasaydı dünya yaşanmayacak kadar soğuk olurdu.',
      ),
      kart(
        'Sonuçları',
        'Ortalama sıcaklık artışı, buzul erimesi, deniz seviyesinin yükselmesi ve aşırı hava olaylarında artış.',
      ),
      kart(
        'Türkiye’ye etkisi',
        'Akdeniz havzası risk bölgesinde; kuraklık, orman yangını ve su sıkıntısı artıyor.',
      ),
      kart(
        'Azaltım ve uyum',
        'Azaltım salımı düşürmek, uyum ise değişen koşullara göre yaşamı yeniden düzenlemektir.',
        {
          tur: 'tablo',
          basliklar: ['Azaltım', 'Uyum'],
          satirlar: [
            ['Yenilenebilir enerji', 'Damla sulama'],
            ['Toplu taşıma', 'Sel önleme'],
            ['Ağaçlandırma', 'Kuraklığa dayanıklı tohum'],
          ],
        },
      ),
      kart(
        'Küresel anlaşmalar',
        'Paris Anlaşması ülkeleri sıcaklık artışını sınırlamaya çağırıyor; salım azaltımı hedefleri ulusal olarak bildiriliyor.',
      ),
    ]),
  ]),
  tema('cog9-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog9-nufus-degisim', 'Nüfusun Tarihsel Değişimi ve Geleceği', [
      kart(
        'Yavaş başlangıç',
        'Tarım devrimine kadar dünya nüfusu çok azdı ve yavaş artıyordu; besin miktarı sınırdı.',
      ),
      kart(
        'Hızlanma',
        'Sanayi devrimi ve tıptaki ilerlemeyle ölüm oranı düştü, nüfus hızla arttı.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'nüfus',
          egriler: [
            {
              noktalar: [
                [0, 0.3],
                [2, 0.6],
                [3.5, 1.2],
                [4.5, 3],
                [5.5, 5.4],
              ],
            },
          ],
        },
      ),
      kart(
        'Neden ölüm oranı düştü?',
        'Temiz su, kanalizasyon, aşı ve antibiyotik; nüfus artışının sebebi doğum patlaması değil ölümün azalmasıdır.',
      ),
      kart(
        'Bugün',
        'Artış hızı yavaşlıyor; bazı ülkelerde nüfus azalmaya başladı.',
      ),
      kart(
        'Kentleşme',
        'Dünya nüfusunun yarısından fazlası artık şehirlerde yaşıyor; bu oran yükselmeye devam ediyor.',
      ),
      kart(
        'Geleceğe bakış',
        'Nüfusun yüzyılın sonuna doğru durağanlaşması bekleniyor; artış büyük ölçüde Afrika kaynaklı olacak.',
      ),
    ]),
    konu('cog9-nufus-dagilis', 'Nüfusun Dağılışı ve Hareketleri', [
      kart(
        'Doğal faktörler',
        'İklim, yer şekilleri, su kaynakları ve toprak verimliliği. Ilıman ve düz alanlar yoğun nüfusludur.',
      ),
      kart(
        'Beşerî faktörler',
        'Sanayi, ticaret, ulaşım ve turizm. İş imkânı olan yer nüfus çeker.',
      ),
      kart(
        'Seyrek nüfuslu alanlar',
        'Kutuplar, çöller, yüksek dağlar ve ekvatoral ormanlar.',
      ),
      kart(
        'Aritmetik nüfus yoğunluğu',
        'Toplam nüfusun toplam alana bölümü. Kullanılamayan alanları da saydığı için tek başına yanıltıcıdır.',
      ),
      kart(
        'Göç türleri',
        'İç-dış, sürekli-mevsimlik, gönüllü-zorunlu göç. Çoğu göçün sebebi ekonomiktir.',
      ),
      kart(
        'İtici ve çekici güçler',
        'Göç iki uçtan birden beslenir: bir yerde tutunamamak ve başka yerde daha iyisini ummak.',
        {
          tur: 'tablo',
          basliklar: ['İtici', 'Çekici'],
          satirlar: [
            ['İşsizlik', 'İş imkânı'],
            ['Savaş', 'Güvenlik'],
            ['Kuraklık', 'Verimli toprak'],
            ['Hizmet yetersizliği', 'Eğitim ve sağlık'],
          ],
        },
      ),
      kart(
        'Göçün sonuçları',
        'Veren yerde nüfus azalır ve yaşlanır; alan yerde konut, altyapı ve işsizlik baskısı artar.',
      ),
    ]),
    konu('cog9-demografik', 'Demografik Dönüşüm ve Nüfus Piramitleri', [
      kart(
        'Demografik dönüşüm',
        'Yüksek doğum-yüksek ölümden, düşük doğum-düşük ölüme geçiş süreci. Aradaki dönemde nüfus hızla artar.',
        {
          tur: 'akis',
          adimlar: [
            { ad: '1. Yüksek doğum', alt: 'yüksek ölüm' },
            { ad: '2. Ölüm düşer', alt: 'hızlı artış' },
            { ad: '3. Doğum düşer' },
            { ad: '4. Durağan' },
          ],
        },
      ),
      kart(
        'Piramit ne gösterir?',
        'Yaş gruplarını ve cinsiyet dağılımını. Şekli ülkenin gelişmişliği hakkında doğrudan bilgi verir.',
      ),
      kart(
        'Geniş tabanlı piramit',
        'Doğum oranı yüksek, genç nüfus çok. Gelişmekte olan ülkelerde görülür.',
      ),
      kart(
        'Dar tabanlı piramit',
        'Doğum oranı düşük, yaşlı nüfus fazla. Gelişmiş ülkelerde görülür.',
      ),
      kart(
        'Piramitteki çentikler',
        'Bir yaş grubundaki ani daralma savaş, salgın ya da büyük göç gibi bir olayın izidir.',
      ),
      kart(
        'Türkiye’nin piramidi',
        'Tabanı daralıyor, orta kısmı genişliyor: nüfus hâlâ genç ama hızla yaşlanıyor.',
      ),
    ]),
    konu('cog9-nufus-politika', 'Nüfusla İlgili Fırsat, Sorun ve Politikalar', [
      kart(
        'Demografik fırsat penceresi',
        'Çalışma çağındaki nüfusun oranı en yüksek olduğu dönem. Doğru kullanılırsa hızlı kalkınma sağlar.',
      ),
      kart(
        'Bağımlılık oranı',
        'Çalışma çağı dışındaki nüfusun çalışma çağındakine oranı. Hem çok genç hem çok yaşlı nüfus bu oranı yükseltir.',
      ),
      kart(
        'Genç nüfusun sorunu',
        'Eğitim ve istihdam yetişmezse fırsat, işsizlik sorununa dönüşür.',
      ),
      kart(
        'Yaşlanmanın sorunu',
        'Çalışan başına düşen bağımlı sayısı artar; emeklilik ve sağlık harcamaları yükselir.',
      ),
      kart(
        'Nüfus politikaları',
        'Artırıcı ve azaltıcı olmak üzere iki yönlü olabilir; Türkiye 1965-1983 arasında azaltıcı politika uyguladı.',
      ),
      kart(
        'Bugünkü yönelim',
        'Doğurganlık yenilenme düzeyinin altına indiği için politikalar artırıcı yöne döndü.',
      ),
    ]),
  ]),
  tema('cog9-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog9-ekonomi-faktor', 'Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler', [
      kart(
        'Doğal faktörler',
        'İklim, yer şekilleri, toprak, su ve yer altı kaynakları hangi faaliyetin nerede yapılacağını belirler.',
      ),
      kart(
        'İklimin belirleyiciliği',
        'Çay Doğu Karadeniz’de, pamuk Çukurova’da yetişir; sıcaklık ve yağış isteği bunu zorunlu kılar.',
      ),
      kart(
        'Yer şekillerinin etkisi',
        'Engebeli arazi tarımı ve ulaşımı zorlaştırır, maliyeti artırır; düz ovalar sanayiyi çeker.',
      ),
      kart(
        'Beşerî faktörler',
        'Sermaye, iş gücü, teknoloji, pazar ve ulaşım. Doğal koşullar elverişli olsa da bunlar yoksa faaliyet gelişmez.',
      ),
      kart(
        'Üç sektör',
        'Ekonomik faaliyetler doğaya olan uzaklıklarına göre üç basamakta toplanır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Birincil', alt: 'tarım, madencilik' },
            { ad: 'İkincil', alt: 'sanayi' },
            { ad: 'Üçüncül', alt: 'hizmet' },
          ],
        },
      ),
      kart(
        'Karşılıklı etki',
        'Ekonomik faaliyet de doğayı değiştirir: baraj, madencilik ve aşırı sulama çevreyi dönüştürür.',
      ),
    ]),
  ]),
  tema('cog9-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog9-tehlike-risk', 'Tehlike, Risk ve Afet', [
      kart(
        'Tehlike',
        'Zarar verme potansiyeli olan doğal ya da beşerî olay. Deprem başlı başına bir tehlikedir.',
      ),
      kart(
        'Risk',
        'Tehlikenin gerçekleşmesi hâlinde beklenen kayıp. Aynı deprem, hazırlıklı bir şehirde daha düşük risk taşır.',
      ),
      kart(
        'Afet',
        'Toplumun kendi imkânlarıyla baş edemediği, can ve mal kaybına yol açan olay.',
      ),
      kart(
        'Üçü arasındaki fark',
        'Üç kavram aynı olayın farklı aşamalarını anlatır; karıştırıldığında korunma da yanlış yere yatırılır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Tehlike', alt: 'olabilir' },
            { ad: 'Risk', alt: 'beklenen kayıp' },
            { ad: 'Afet', alt: 'gerçekleşti' },
          ],
        },
      ),
      kart(
        'Doğa olayı afet değildir',
        'İnsan ve yapı yoksa deprem yalnızca bir doğa olayıdır. Afet, olayın toplumla karşılaşmasıyla oluşur.',
      ),
      kart(
        'Kırılganlık',
        'Aynı şiddetteki olay, yapı kalitesi ve gelir düzeyi düşük yerlerde daha büyük kayıp verir.',
      ),
    ]),
    konu('cog9-afet-tur', 'Afet Türleri', [
      kart(
        'Dört grup',
        'Afetler kaynağına göre gruplanır; son grubun kaynağı doğrudan insandır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Örnek'],
          satirlar: [
            ['Jeolojik', 'Deprem, heyelan'],
            ['Meteorolojik', 'Sel, kuraklık'],
            ['Biyolojik', 'Salgın, yangın'],
            ['Beşerî', 'Sanayi kazası'],
          ],
        },
      ),
      kart(
        'Jeolojik afetler',
        'Deprem, volkanik patlama, heyelan ve tsunami. Kaynağı yer kabuğunun hareketidir.',
      ),
      kart(
        'Meteorolojik afetler',
        'Sel, kuraklık, fırtına, dolu, çığ ve aşırı sıcaklar.',
      ),
      kart(
        'Biyolojik afetler',
        'Salgın hastalıklar, orman yangınları ve zararlı böcek istilaları.',
      ),
      kart(
        'Beşerî afetler',
        'Endüstriyel kazalar, nükleer sızıntılar ve savaşlar; kaynağı insandır.',
      ),
      kart(
        'Zincirleme afet',
        'Bir afet ötekini tetikler: deprem heyelanı, heyelan taşkını, taşkın salgını doğurabilir.',
      ),
      kart(
        'Türkiye’de en sık',
        'Deprem, heyelan ve sel. Ülkenin büyük bölümü etkin fay kuşakları üzerindedir.',
      ),
    ]),
    konu('cog9-afet-yonetim', 'Bütüncül Afet Yönetimi', [
      kart(
        'Dört aşama',
        'Döngü hiç kapanmaz: iyileştirme, bir sonraki afet için zarar azaltmaya bağlanır.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Zarar azaltma' },
            { ad: 'Hazırlık' },
            { ad: 'Müdahale' },
            { ad: 'İyileştirme' },
          ],
        },
      ),
      kart(
        'Zarar azaltma',
        'En ucuz ve en etkili aşama: doğru yer seçimi, sağlam yapı, imar denetimi.',
      ),
      kart(
        'Hazırlık',
        'Tatbikat, afet çantası, toplanma alanı ve erken uyarı sistemleri.',
      ),
      kart(
        'Müdahale',
        'İlk 72 saat kritiktir. Arama-kurtarma, sağlık hizmeti ve acil barınma bu aşamada yürütülür.',
      ),
      kart(
        'İyileştirme',
        'Kalıcı konut, altyapı onarımı, ekonomik destek ve psikososyal destek. En uzun süren aşamadır.',
      ),
      kart(
        'Neden bütüncül?',
        'Yalnızca müdahaleye odaklanan yönetim, her afette baştan başlar. Asıl kazanç afet olmadan alınır.',
      ),
    ]),
  ]),
  tema('cog9-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog9-bolge', 'Bölge ve Bölge Sınırı', [
      kart(
        'Bölge nedir?',
        'Belirli bir ölçüte göre benzer özellik gösteren, çevresinden ayrılan alan.',
      ),
      kart(
        'Ölçüt bölgeyi değiştirir',
        'Aynı yer, iklime göre başka bir bölgede, sanayiye göre başka bir bölgede yer alabilir.',
      ),
      kart(
        'Sınırlar keskin değildir',
        'Doğal bölgelerin sınırı bir çizgi değil geçiş kuşağıdır; idari sınırlar ise keskin ve yapaydır.',
      ),
      kart(
        'Bölge türleri',
        'Doğal, beşerî ve ekonomik bölgeler; ayrıca büyüklüğüne göre kıta altı, ülke ve yerel ölçekler.',
      ),
      kart(
        'Bölge sınırı değişir',
        'Ölçüt değişmese bile koşullar değişirse sınır kayar: kuraklık, tarım bölgesinin sınırını geriye çeker.',
      ),
      kart(
        'Türkiye’nin coğrafi bölgeleri',
        'Yedi bölge 1941’de belirlendi ve ölçütü büyük ölçüde doğal koşullardı; idari birim değildir.',
      ),
    ]),
  ]),
])
