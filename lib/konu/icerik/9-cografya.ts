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
        'Üç temel soru',
        'Nerede, neden orada, sonucu ne? Coğrafyayı öteki bilimlerden ayıran şey ikinci ve üçüncü sorudur.',
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
        'Doğu ile batı arasında yaklaşık 76 dakikalık yerel saat farkı vardır; ülke tek saat dilimi kullanır.',
      ),
      kart(
        'Özel konum',
        'Üç kıtanın kesiştiği yerde, boğazlara sahip; Asya ile Avrupa arasındaki geçiş konumu stratejik değer taşır.',
      ),
      kart(
        'Yükselti etkisi',
        'Ortalama yükseltisi fazladır ve doğuya doğru artar; bu, iklimi ve tarımı doğrudan etkiler.',
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
        'CBS veriyi katmanlar hâlinde üst üste bindirir: yol, akarsu, nüfus. Çözümleme bu bindirmeden çıkar.',
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
        'Günlük etkiler',
        'Tarım, ulaşım, enerji ve sağlık hava olaylarına bağlıdır; don ve dolu bir yılın ürününü götürebilir.',
      ),
    ]),
    konu('cog9-iklim-sistem', 'İklim Sisteminin Bileşen ve Değişkenleri', [
      kart(
        'Beş bileşen',
        'Atmosfer, hidrosfer, litosfer, biyosfer ve buzküre. İklim bu beşinin etkileşiminden doğar.',
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
        'Yükselti ve karasallık',
        'Her 100 metrede sıcaklık yaklaşık 0,5 °C düşer; denizden uzaklaştıkça sıcaklık farkları büyür.',
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
        'Türkiye’nin iklimleri',
        'Kıyılarda Akdeniz ve Karadeniz iklimi, iç kesimlerde karasal iklim görülür.',
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
      ),
      kart(
        'Bugün',
        'Artış hızı yavaşlıyor; bazı ülkelerde nüfus azalmaya başladı.',
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
        'Göç türleri',
        'İç-dış, sürekli-mevsimlik, gönüllü-zorunlu göç. Çoğu göçün sebebi ekonomiktir.',
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
        'Doğa olayı afet değildir',
        'İnsan ve yapı yoksa deprem yalnızca bir doğa olayıdır. Afet, olayın toplumla karşılaşmasıyla oluşur.',
      ),
    ]),
    konu('cog9-afet-tur', 'Afet Türleri', [
      kart(
        'Jeolojik afetler',
        'Deprem, volkanik patlama, heyelan ve tsunami.',
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
        'Türkiye’de en sık',
        'Deprem, heyelan ve sel. Ülkenin büyük bölümü etkin fay kuşakları üzerindedir.',
      ),
    ]),
    konu('cog9-afet-yonetim', 'Bütüncül Afet Yönetimi', [
      kart(
        'Dört aşama',
        'Zarar azaltma, hazırlık, müdahale ve iyileştirme. Döngü hiç kapanmaz, iyileştirme yeniden zarar azaltmaya bağlanır.',
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
        'Müdahale ve iyileştirme',
        'Arama-kurtarma ve acil yardım; sonrasında barınma, altyapı ve psikososyal destek.',
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
        'Türkiye’nin coğrafi bölgeleri',
        'Yedi bölge 1941’de belirlendi ve ölçütü büyük ölçüde doğal koşullardı; idari birim değildir.',
      ),
    ]),
  ]),
])
