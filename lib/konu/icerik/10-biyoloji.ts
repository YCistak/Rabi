import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Biyoloji — Maarif Modeli.
 *
 * İki tema: **Enerji** ve **Ekoloji**. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski programda 10. sınıfta olan **kalıtım** Maarif'te burada yok; bu
 * sınıfın tamamı enerji dönüşümleri ve ekoloji üzerine.
 */
export const biyoloji10 = program('biyoloji', 10, 'Enerjiden ekosisteme', [
  tema('byl10-t1', 'Enerji', [
    konu('byl10-enerji-onem', 'Canlılık İçin Enerjinin Önemi', [
      kart(
        'Neden enerji gerekir?',
        'Büyüme, onarım, madde taşınması ve hareket enerji ister. Enerji kesilirse hücre düzenini koruyamaz.',
      ),
      kart(
        'ATP nedir?',
        'Hücrenin kullanıma hazır enerji birimi. Adenin, riboz ve üç fosfattan oluşur.',
      ),
      kart(
        'Enerji nerede saklı?',
        'Fosfatlar arasındaki bağlarda. Son fosfat koptuğunda açığa çıkan enerji hücre işlerinde kullanılır.',
      ),
      kart(
        'ATP depolanmaz',
        'Hücre ATP’yi biriktirmez, ihtiyaç oldukça üretir. Depo, besin moleküllerinin kendisidir.',
      ),
      kart(
        'Döngü',
        'ATP parçalanıp ADP olur, solunumla yeniden ATP’ye çevrilir. Bu döngü hiç durmaz.',
      ),
    ]),
    konu('byl10-fotosentez', 'Işık Enerjisiyle Besin Sentezi: Fotosentez', [
      kart(
        'Özet denklem',
        'Karbondioksit ve su, ışık enerjisiyle glikoz ve oksijene dönüşür. Kloroplastta gerçekleşir.',
      ),
      kart(
        'Işığın kullanıldığı tepkimeler',
        'Tilakoit zarda olur. Su parçalanır (fotoliz), oksijen açığa çıkar, ATP ve NADPH üretilir.',
      ),
      kart(
        'Işığın kullanılmadığı tepkimeler',
        'Stromada geçen Calvin döngüsü. Karbondioksit, ışık tepkimelerinin ürettiği enerjiyle glikoza bağlanır.',
      ),
      kart(
        'Pigmentler',
        'Klorofil ışığın kırmızı ve mavisini soğurur, yeşili yansıtır. Yaprakların yeşil görünmesi bundandır.',
      ),
      kart(
        'Hızını etkileyen etmenler',
        'Işık şiddeti, karbondioksit derişimi ve sıcaklık. Biri sınırlayıcı olursa ötekiler artsa da hız artmaz.',
      ),
      kart(
        'Neden hayati?',
        'Atmosferdeki oksijenin ve besin zincirindeki enerjinin neredeyse tamamının kaynağı fotosentezdir.',
      ),
    ]),
    konu('byl10-kemosentez', 'Işık Kullanılmadan Besin Sentezi: Kemosentez', [
      kart(
        'Tanımı',
        'Bazı bakterilerin, ışık yerine kimyasal tepkimelerden aldıkları enerjiyle besin üretmesi.',
      ),
      kart(
        'Kimler yapar?',
        'Nitrit, kükürt ve demir bakterileri gibi bazı prokaryotlar. Ökaryotlarda görülmez.',
      ),
      kart(
        'Nerede önemli?',
        'Işığın ulaşmadığı okyanus tabanındaki hidrotermal bacalarda besin zincirini kemosentez başlatır.',
      ),
      kart(
        'Fotosentezden farkı',
        'Enerji kaynağı ışık değil kimyasal bağdır; oksijen açığa çıkmaz. Ürün yine organik besindir.',
      ),
    ]),
    konu('byl10-sindirim', 'Sindirim', [
      kart(
        'Neden gerekli?',
        'Büyük besin molekülleri hücre zarından geçemez; yapı taşlarına ayrılmaları gerekir.',
      ),
      kart(
        'Hücre içi sindirim',
        'Besin hücre içine alınır ve lizozom enzimleriyle parçalanır. Amip ve terliksi hayvan böyle beslenir.',
      ),
      kart(
        'Hücre dışı sindirim',
        'Enzimler dışarı salgılanır, besin dışarıda parçalanıp sonra emilir. Mantarlar ve çok hücreliler böyle yapar.',
      ),
      kart(
        'Mekanik ve kimyasal',
        'Mekanik sindirim besini küçültür ve yüzey alanını artırır; kimyasal sindirim enzimlerle bağları koparır.',
      ),
    ]),
    konu('byl10-sindirim-yapi', 'Canlılarda Sindirim Yapıları', [
      kart(
        'Tek hücrelilerde',
        'Ayrı bir sistem yoktur; besin kofulu ile lizozom birleşir ve sindirim hücre içinde tamamlanır.',
      ),
      kart(
        'Sölenterelerde',
        'Tek açıklıklı bir sindirim boşluğu vardır; ağız hem giriş hem çıkıştır.',
      ),
      kart(
        'Solucanlarda',
        'İki açıklıklı sindirim kanalı gelişir; besin tek yönde ilerler ve bölümler uzmanlaşır.',
      ),
      kart(
        'Otçul ve etçillerde',
        'Otçulların bağırsağı uzun ve selüloz sindirimi için mikroplu; etçillerin bağırsağı kısadır.',
      ),
    ]),
    konu('byl10-insan-sindirim', 'İnsanda Sindirim', [
      kart(
        'Ağızda',
        'Dişler mekanik olarak parçalar; tükürükteki amilaz nişastanın kimyasal sindirimini başlatır.',
      ),
      kart(
        'Midede',
        'Asidik ortamda pepsin proteinleri parçalar. Karbonhidrat sindirimi asit yüzünden burada durur.',
      ),
      kart(
        'İnce bağırsakta',
        'Sindirimin tamamlandığı yer. Pankreas enzimleri ve safra buraya dökülür.',
      ),
      kart(
        'Safranın işi',
        'Enzim değildir; yağ damlalarını küçültüp (emülsiyon) enzimlerin ulaşacağı yüzeyi artırır.',
      ),
      kart(
        'Kalın bağırsakta',
        'Sindirim olmaz. Su ve mineral emilir; bağırsak florası bazı vitaminleri üretir.',
      ),
    ]),
    konu('byl10-emilim', 'Emilim ve Taşınma', [
      kart(
        'Nerede olur?',
        'Büyük ölçüde ince bağırsakta. Villus ve mikrovilluslar emilim yüzeyini kat kat artırır.',
      ),
      kart(
        'Neyin nereye gittiği',
        'Glikoz ve amino asitler kana; yağ asitleri ve gliserol önce lenf sistemine geçer.',
      ),
      kart(
        'Karaciğerin rolü',
        'Bağırsaktan gelen kan önce karaciğere uğrar; fazla glikoz glikojen olarak depolanır, zararlılar süzülür.',
      ),
      kart(
        'Taşıma',
        'Dolaşım sistemi besinleri hücrelere ulaştırır; hücreye giriş difüzyon ve aktif taşımayla olur.',
      ),
    ]),
    konu('byl10-solunum', 'Hücresel Solunum', [
      kart(
        'Ne yapar?',
        'Besindeki kimyasal enerjiyi ATP’ye çevirir. Oksijenli solunumda son ürünler karbondioksit ve sudur.',
      ),
      kart(
        'Glikoliz',
        'Sitoplazmada olur, oksijen gerekmez. Glikoz iki piruvata ayrılır ve az miktarda ATP üretilir.',
      ),
      kart(
        'Sitrik asit döngüsü',
        'Mitokondri matriksinde. Karbon atomları karbondioksit olarak ayrılır, elektron taşıyıcılar yüklenir.',
      ),
      kart(
        'Elektron taşıma sistemi',
        'İç zarda. ATP’nin büyük kısmı burada üretilir; son elektron alıcısı oksijendir ve su oluşur.',
      ),
      kart(
        'Verim',
        'Bir glikozdan oksijenli solunumla çok sayıda ATP elde edilir; fermantasyonda bu sayı çok küçüktür.',
      ),
    ]),
    konu('byl10-katilma', 'Besinlerin Solunuma Katılma Yolları', [
      kart(
        'Öncelik sırası',
        'Hücre önce karbonhidratı kullanır, sonra yağı; protein en son başvurulan kaynaktır.',
      ),
      kart(
        'Karbonhidratlar',
        'Glikoza çevrilip doğrudan glikolize girer. En hızlı kullanılan yakıttır.',
      ),
      kart(
        'Yağlar',
        'Gliserol ve yağ asitlerine ayrılır; gram başına en çok enerjiyi verirler ama kullanımı yavaştır.',
      ),
      kart(
        'Proteinler',
        'Amino asitlerin azotu ayrılır (bu atık boşaltımla atılır), kalan kısım döngüye katılır.',
      ),
    ]),
    konu('byl10-fermantasyon', 'Fermantasyon', [
      kart(
        'Ne zaman olur?',
        'Oksijen yetersizken. Glikoliz sürsün diye elektron taşıyıcılar başka yolla boşaltılır.',
      ),
      kart(
        'Laktik asit fermantasyonu',
        'Piruvat laktik aside dönüşür. Yoğurt ve turşu bununla yapılır; kaslarda da yorgunlukla ilişkilidir.',
      ),
      kart(
        'Etil alkol fermantasyonu',
        'Mayalarda piruvat etil alkol ve karbondioksite dönüşür. Hamurun kabarması bu gazdandır.',
      ),
      kart(
        'Verimi düşük',
        'Yalnızca glikolizden gelen az sayıda ATP üretilir; besindeki enerjinin çoğu ürün içinde kalır.',
      ),
    ]),
    konu('byl10-metabolizma', 'Enerji-Metabolizma İlişkisi', [
      kart(
        'Anabolizma ve katabolizma',
        'Anabolizma enerji harcayarak yapar, katabolizma parçalayıp enerji verir. Metabolizma ikisinin toplamıdır.',
      ),
      kart(
        'Bazal metabolizma',
        'Dinlenme hâlinde yaşamı sürdürmek için harcanan en az enerji. Yaş, cinsiyet ve kas kütlesiyle değişir.',
      ),
      kart(
        'Enerji dengesi',
        'Alınan enerji harcanandan fazlaysa depolanır, azsa depolar kullanılır.',
      ),
      kart(
        'Neden hep enerji harcanır?',
        'Uyurken bile kalp, solunum ve iyon pompaları çalışır. Düzeni korumak sürekli enerji ister.',
      ),
    ]),
  ]),
  tema('byl10-t2', 'Ekoloji', [
    konu('byl10-bilesen', 'Ekosistemin Bileşenleri', [
      kart(
        'Cansız bileşenler',
        'Işık, sıcaklık, su, toprak, mineraller ve pH. Hangi canlının nerede yaşayacağını büyük ölçüde bunlar belirler.',
      ),
      kart(
        'Canlı bileşenler',
        'Üreticiler, tüketiciler ve ayrıştırıcılar. Ayrıştırıcılar olmasa madde döngüsü kapanmazdı.',
      ),
      kart(
        'Popülasyon ve komünite',
        'Popülasyon aynı türden bireyler; komünite aynı alandaki tüm popülasyonlar.',
      ),
      kart(
        'Ekosistem ve biyosfer',
        'Komünite ile cansız çevre birlikte ekosistemi kurar. Tüm ekosistemlerin toplamı biyosferdir.',
      ),
      kart(
        'Habitat ve niş',
        'Habitat canlının adresi, niş ise oradaki mesleğidir; iki tür aynı nişi uzun süre paylaşamaz.',
      ),
    ]),
    konu('byl10-etkilesim', 'Tür İçi ve Türler Arası Etkileşimler', [
      kart(
        'Tür içi rekabet',
        'Aynı türün bireyleri aynı kaynağı istediği için en şiddetli rekabet tür içinde olur.',
      ),
      kart(
        'Av-avcı ilişkisi',
        'Avcı av popülasyonunu dengeler; av azalınca avcı da azalır. İki popülasyon birbirini izler.',
      ),
      kart(
        'Mutualizm',
        'İki tür de kazanır: arı ile çiçek, baklagil ile azot bakterisi.',
      ),
      kart(
        'Kommensalizm',
        'Biri kazanır, öteki etkilenmez. Ağaç dalında yaşayan bir bitki buna örnektir.',
      ),
      kart(
        'Parazitlik',
        'Biri kazanır, öteki zarar görür. Parazit konağını genellikle öldürmez; öldürürse kendi yaşamı da biter.',
      ),
    ]),
    konu('byl10-suksesyon', 'Süksesyon', [
      kart(
        'Tanımı',
        'Bir alandaki canlı topluluğunun zamanla düzenli biçimde değişmesi.',
      ),
      kart(
        'Birincil süksesyon',
        'Toprağın hiç olmadığı yerde başlar: lav akıntısı ya da çıplak kaya. Öncü tür çoğunlukla likenlerdir.',
      ),
      kart(
        'İkincil süksesyon',
        'Toprak varken başlar: yangın ya da terk edilmiş tarla. Birincilden çok daha hızlı ilerler.',
      ),
      kart(
        'Klimaks',
        'Süksesyonun kararlı son aşaması. Tür bileşimi artık büyük ölçüde değişmez.',
      ),
    ]),
    konu('byl10-populasyon', 'Popülasyon Dinamikleri', [
      kart(
        'Büyümeyi belirleyenler',
        'Doğum ve içe göç sayıyı artırır; ölüm ve dışa göç azaltır.',
      ),
      kart(
        'Taşıma kapasitesi',
        'Ortamın sürekli besleyebileceği en büyük birey sayısı. Aşılırsa popülasyon çöker.',
      ),
      kart(
        'Çevre direnci',
        'Büyümeyi sınırlayan etkenlerin tamamı: besin kıtlığı, rekabet, avcı, hastalık.',
      ),
      kart(
        'Yaş piramidi',
        'Genç birey oranı yüksekse popülasyon büyüyecek, yaşlı ağırlıklıysa küçülecek demektir.',
      ),
    ]),
    konu('byl10-madde-enerji', 'Ekosistemde Madde ve Enerji Akışı', [
      kart(
        'Besin zinciri',
        'Üreticiden tüketiciye doğru tek yönlü enerji aktarımı. Ayrıştırıcılar her basamağa bağlanır.',
      ),
      kart(
        'Besin ağı',
        'Zincirlerin birbirine bağlanmış hâli. Gerçek ekosistemler zincir değil ağ biçimindedir.',
      ),
      kart(
        'Enerji piramidi',
        'Her basamakta enerjinin yaklaşık onda biri aktarılır; kalanı ısı olarak kaybolur.',
      ),
      kart(
        'Enerji akar, madde döner',
        'Enerji güneşten gelir ve ısı olarak çıkar; madde ise döngülerle sürekli yeniden kullanılır.',
      ),
      kart(
        'Biyolojik birikim',
        'Parçalanmayan zehirler her basamakta derişir. En büyük zararı zincirin tepesindeki tür görür.',
      ),
    ]),
    konu('byl10-dongu', 'Madde Döngüleri', [
      kart(
        'Su döngüsü',
        'Buharlaşma, yoğuşma, yağış ve akış. Güneş enerjisi döngüyü çeviren motordur.',
      ),
      kart(
        'Karbon döngüsü',
        'Fotosentez karbonu havadan alır, solunum ve yanma geri verir. Fosil yakıtlar dengeyi bozdu.',
      ),
      kart(
        'Azot döngüsü',
        'Havadaki azotu canlılar doğrudan kullanamaz; bakteriler bağlar, nitrifikasyon ve denitrifikasyon çevrimi tamamlar.',
      ),
      kart(
        'Neden döngü şart?',
        'Dünyaya dışarıdan madde gelmiyor. Elimizdeki atomlar sürekli yeniden kullanılıyor.',
      ),
    ]),
    konu('byl10-surdurulebilirlik', 'Ekolojik Sürdürülebilirliğin Önemi', [
      kart(
        'Tanımı',
        'Doğal kaynakları, gelecek kuşakların da kullanabileceği biçimde ve yenilenme hızını aşmadan kullanmak.',
      ),
      kart(
        'Ekosistem hizmetleri',
        'Temiz hava, su döngüsü, tozlaşma ve toprak verimliliği. Bedava sanılan bu hizmetler yerine konulamaz.',
      ),
      kart(
        'Neden acil?',
        'Kaynak tüketim hızı yenilenme hızını geçtiğinde açık büyür ve geri dönüş giderek zorlaşır.',
      ),
      kart(
        'Ekonomiyle ilişkisi',
        'Sürdürülebilirlik üretimi durdurmak değil, üretimi doğanın yenilenme hızına uydurmaktır.',
      ),
    ]),
    konu('byl10-kisitlayan', 'Sürdürülebilirliği Kısıtlayan Durumlar', [
      kart(
        'Habitat kaybı',
        'Tür kayıplarının en büyük sebebi. Yaşam alanı bölününce popülasyonlar birbirinden kopar ve küçülür.',
      ),
      kart(
        'Kirlilik',
        'Hava, su ve toprak kirliliği; ayrıca ışık ve gürültü kirliliği canlıların davranışını bozar.',
      ),
      kart(
        'Ötrofikasyon',
        'Sulara karışan gübre yosunu aşırı çoğaltır; ölen yosunlar çürürken oksijen tükenir ve balıklar ölür.',
      ),
      kart(
        'Biyoçeşitlilik kaybı',
        'Tür azaldıkça ekosistemin şoklara dayanma gücü düşer. Kayıp geri alınamaz.',
      ),
      kart(
        'İklim değişikliği',
        'Sıcaklık ve yağış düzeni değişince türlerin yayılış alanı kayar; uyum sağlayamayanlar yok olur.',
      ),
    ]),
    konu('byl10-saglanmasi', 'Ekolojik Sürdürülebilirliğin Sağlanması', [
      kart(
        'Ekolojik ayak izi',
        'Bir kişinin ya da toplumun doğaya bindirdiği yükün alan cinsinden ölçüsü. Küçültmenin ilk adımı ölçmektir.',
      ),
      kart(
        'Nasıl küçültülür?',
        'Enerji ve su tasarrufu, toplu taşıma, yerel ve mevsiminde beslenme, gereksiz tüketimi azaltma.',
      ),
      kart(
        'Atık yönetimi',
        'Sıra önemlidir: önce azalt, sonra yeniden kullan, en son geri dönüştür.',
      ),
      kart(
        'Korunan alanlar',
        'Millî parklar ve tabiat koruma alanları habitatı bütün hâlinde korur; tohum bankaları gen çeşitliliğini saklar.',
      ),
      kart(
        'Bireysel katkının sınırı',
        'Bireysel çaba önemlidir ama yeterli değil; asıl fark üretim ve enerji politikalarında ortaya çıkar.',
      ),
    ]),
  ]),
])
