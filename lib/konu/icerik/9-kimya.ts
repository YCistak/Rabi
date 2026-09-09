import { kart, konu, program, soru, tema } from '../tip'

/**
 * 9. sınıf Kimya — Maarif Modeli.
 *
 * Üç tema: **Etkileşim**, **Çeşitlilik**, **Sürdürülebilirlik**. Konu adları
 * ve sırası programın İçerik Çerçevesi'nden geliyor (`maarif/iskelet.json`,
 * `scripts/maarif-cek.mjs`) ve `icerik.test.ts` ikisini de denetliyor —
 * hafızadan yazılan sıra bir kez kaydı ve kimse fark etmedi.
 *
 * Eski programdaki "Kimyanın Temel Kanunları", mol kavramı, karışımlar ve
 * asit-baz hesabı 9. sınıfta **yok**; mol 10. sınıfa taşındı.
 */
export const kimya9 = program('kimya', 9, 'Atomdan maddenin hâllerine', [
  tema('kim9-t1', 'Etkileşim', [
    konu('kim9-gunluk', 'Günlük Hayatta Kimya', [
      kart(
        'Kimya neyi inceler?',
        'Maddenin yapısını, özelliklerini ve değişimini inceler. Yediğimiz ilaçtan giydiğimiz kumaşa kadar her şey kimyanın konusu.',
      ),
      kart(
        'Fiziksel ve kimyasal değişim',
        'Fiziksel değişimde madde kimliğini korur (buzun erimesi); kimyasal değişimde yeni madde oluşur (demirin paslanması).',
      ),
      kart(
        'Temizlik ürünleri',
        'Sabun ve deterjan, bir ucu suyu seven bir ucu yağı seven moleküllerdir. Yağı kavrayıp suya taşıdıkları için kir çözülür.',
      ),
      kart(
        'Mutfakta kimya',
        'Kabartma tozu ısınınca karbondioksit verir ve hamuru kabartır. Ekmeğin kızarması da şeker ile proteinin tepkimesi.',
      ),
      kart(
        'Doğal olan zararsız değildir',
        'Zehirliliği belirleyen şey kaynağı değil dozu ve yapısıdır. En güçlü zehirlerin bir kısmı bitki ve mantar kökenlidir.',
      ),
      kart(
        'Kimya olmadan olmazdı',
        'Gübre olmasa tarım bugünkü nüfusu besleyemezdi; antibiyotik olmasa basit bir enfeksiyon öldürücü kalırdı.',
      ),
    ], [
      soru('Kâğıdın yanması kimyasal, yırtılması fiziksel bir değişimdir.', true, 'Yanmada yeni maddeler oluşuyor, yırtılmada kâğıt kâğıt olarak kalıyor.'),
      soru('Doğal olan her madde insan için zararsızdır.', false, 'Yılan zehri de doğal; zararı doğallığı değil yapısı ve miktarı belirliyor.'),
      soru('Buzun erimesi kimyasal bir değişimdir.', false, 'Madde yine su; yalnızca hâli değişiyor.'),
      soru('Sirkenin ekşi tadı yapısındaki asitten gelir.', true, 'Sirkedeki asetik asit bu tadı veriyor.'),
    ]),
    konu('kim9-guvenlik', 'Kimyasal Maddelerin Kullanımı ve Güvenlik', [
      kart(
        'Uyarı işaretleri',
        'Kaplardaki eşkenar dörtgen işaretler tehlikenin türünü söyler ve etiket okunmadan hiçbir kaba dokunulmaz.',
        {
          tur: 'tablo',
          basliklar: ['İşaret', 'Anlamı'],
          satirlar: [
            ['Alev', 'Yanıcı'],
            ['Kafatası', 'Zehirli'],
            ['Aşındırıcı', 'Cildi ve gözü yakar'],
            ['Ünlem', 'Tahriş edici'],
            ['Ölü balık', 'Çevreye zararlı'],
          ],
        },
      ),
      kart(
        'Asidi suya ekle',
        'Suyu aside dökmek şiddetli ısı açığa çıkarır ve sıvı sıçrar. Doğrusu asidi yavaşça suya eklemektir.',
      ),
      kart(
        'Koklama, tatma',
        'Kimyasal koklanmaz; koku eli ile yüzüne doğru yelpazelenerek alınır. Tatmak hiçbir koşulda yapılmaz.',
      ),
      kart(
        'Kişisel koruyucular',
        'Gözlük, eldiven ve önlük laboratuvarda seçenek değil kuraldır. Göz, sıçrayan bir damlayı tolere etmiyor.',
      ),
      kart(
        'Karıştırılmayan ikili',
        'Çamaşır suyu ile tuz ruhu birlikte klor gazı verir. Ev temizliğinde ürünleri karıştırmak zehirlenmenin en sık sebebi.',
      ),
      kart(
        'Atık nereye?',
        'Kimyasal atık lavaboya dökülmez; türüne göre ayrı kaplarda toplanır. Karışan atıklar beklenmedik tepkime verebilir.',
      ),
    ], [
      soru('Asit sulandırılırken su, asidin üzerine yavaşça dökülür.', false, 'Tersi yapılır: asit suya eklenir; su üstüne dökülen asit sıçrayabilir.'),
      soru('Çamaşır suyu ile tuz ruhu birlikte kullanılmamalıdır.', true, 'Karışımdan zehirli klor gazı açığa çıkıyor.'),
      soru('Laboratuvarda bir kimyasalın kokusu doğrudan burna çekilerek denenir.', false, 'Koklama elle yelpazeleyerek yapılır; tatma hiç yapılmaz.'),
      soru('Kimyasal atıklar lavaboya değil, ayrılmış atık kaplarına dökülür.', true, 'Lavaboya dökülen atık suyla birlikte çevreye karışıyor.'),
    ]),
    konu('kim9-altdal', 'Kimyanın Alt Disiplinleri', [
      kart(
        'Organik kimya',
        'Karbon bileşiklerini inceler. Plastik, ilaç, boya ve yakıtların neredeyse tamamı bu dalın konusu.',
      ),
      kart(
        'Anorganik kimya',
        'Karbon dışı elementlere, özellikle metallere ve minerallere bakar. Katalizörler ve seramikler buradan çıkar.',
      ),
      kart(
        'Analitik kimya',
        'İki soruyu sorar: ne var, ne kadar var? Su tahlili, doping kontrolü ve gıda denetimi bu dalın işi.',
      ),
      kart(
        'Fizikokimya',
        'Tepkimenin neden ve ne hızla olduğunu inceler. Enerji, denge ve hız bu dalın konusu.',
      ),
      kart(
        'Biyokimya',
        'Canlıdaki tepkimeleri inceler: enzimler, proteinler, DNA. Biyoloji ile kimyanın kesiştiği yer.',
      ),
      kart(
        'Polimer kimyası',
        'Küçük birimlerin (monomer) uzun zincirler kurmasını inceler. Lastikten naylona kadar her şey polimerdir.',
      ),
    ], [
      soru('Organik kimya, karbon bileşiklerini inceleyen alt disiplindir.', true, 'Yakıtlar, plastikler ve ilaçların çoğu bu alanın konusu.'),
      soru('Analitik kimya, bir örnekte hangi maddenin ne kadar bulunduğunu belirler.', true, 'Nitel ve nicel analiz bu alanın işi.'),
      soru('Canlılardaki tepkimeleri inceleyen alt disiplin biyokimya değildir.', false, 'Tam da biyokimyadır; canlıdaki kimyasal süreçleri inceler.'),
      soru('Plastiklerin yapısını fizikokimya inceler.', false, 'Polimer kimyası inceler; fizikokimya tepkime hızı ve enerji ilişkilerine bakar.'),
    ]),
    konu('kim9-kariyer', 'Kimya Alanında Kariyer Olanakları', [
      kart(
        'Nerede çalışılır?',
        'İlaç, gıda, boya, kozmetik, enerji, arıtma ve tekstil sektörleri; ayrıca kalite kontrol laboratuvarları.',
      ),
      kart(
        'Adli kimya',
        'Olay yerindeki kalıntıyı çözümler: kan, barut artığı, uyuşturucu. Mahkemedeki delilin bir kısmı bu analizden çıkar.',
      ),
      kart(
        'İlaç geliştirme',
        'Bir molekülün etkili ve güvenli olduğunu göstermek yıllar süren bir süreç; kimyager bu zincirin ilk halkası.',
      ),
      kart(
        'Kalite kontrol',
        'Üretilen her partinin standarda uyduğunu ölçer. Gıda ve ilaçta yasal olarak zorunlu bir iştir.',
      ),
      kart(
        'Kimya mühendisi ile farkı',
        'Kimyager tepkimeyi laboratuvarda bulur, kimya mühendisi onu fabrika ölçeğinde ve ekonomik biçimde üretir.',
      ),
    ], [
      soru('Adli kimya, suç kanıtlarının çözümlenmesinde kimya bilgisini kullanır.', true, 'Kan, boya ve toz örneklerinin analizi bu alanın işi.'),
      soru('Kimyager ile kimya mühendisinin işi tümüyle aynıdır.', false, 'Kimyager maddeyi ve tepkimeyi, mühendis üretimin büyük ölçekte kurulmasını ele alır.'),
      soru('İlaç geliştirme sürecinde kimyacılara ihtiyaç duyulmaz.', false, 'Etken maddenin tasarımı ve sentezi doğrudan kimyanın işi.'),
      soru('Kalite kontrol laboratuvarları kimya mezunlarının çalıştığı yerlerdendir.', true, 'Ürünün istenen bileşimde olup olmadığı orada ölçülüyor.'),
    ]),
    konu('kim9-atom-teori', 'Atom Teorileri ve Atomun Yapısı', [
      kart(
        'Modeller neden değişti?',
        'Her yeni deney bir öncekinin açıklayamadığını gösterdi. Model çürütülmez, sınırı bulunur ve yerine daha genişi geçer.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Dalton', alt: 'bölünemez dolu küre' },
            { ad: 'Thomson', alt: 'üzümlü kek' },
            { ad: 'Rutherford', alt: 'çekirdek bulundu' },
            { ad: 'Bohr', alt: 'enerji katmanları' },
            { ad: 'Modern', alt: 'olasılık bulutu' },
          ],
        },
      ),
      kart(
        'Rutherford deneyi',
        'İnce altın levhaya gönderilen parçacıkların çoğu geçti, birkaçı geri sekti. Atomun içi boş, kütlesi küçük bir çekirdekte.',
      ),
      kart(
        'Bohr atom teorisi',
        'Elektron çekirdek çevresinde belirli enerjili katmanlarda döner. Katman değiştirirken ışık salar ya da soğurur.',
      ),
      kart(
        'Modern atom teorisi',
        'Elektronun yeri kesin bilinemez, yalnızca bulunma olasılığı bilinir. Yörünge değil, bulut gibi bir bölge vardır.',
      ),
      kart(
        'Tanecikler',
        'Kütlenin neredeyse tamamı çekirdektedir; hacmi belirleyen ise elektronlardır.',
        {
          tur: 'tablo',
          basliklar: ['Tanecik', 'Yük', 'Yer'],
          satirlar: [
            ['Proton', '+1', 'Çekirdek'],
            ['Nötron', '0', 'Çekirdek'],
            ['Elektron', '−1', 'Çevre'],
          ],
        },
      ),
      kart(
        'Atom numarası kimliktir',
        'Proton sayısı elementi belirler; değişirse element değişir. Nötr atomda proton sayısı elektron sayısına eşittir.',
      ),
      kart(
        'Kütle numarası',
        'Proton ile nötron sayısının toplamı. Elektronun kütlesi çok küçük olduğu için bu toplama katılmaz.',
      ),
      kart(
        'İzotop',
        'Proton sayısı aynı, nötron sayısı farklı atomlar. Kimyasal özellikleri aynı, kütleleri farklıdır.',
      ),
      kart(
        'Emisyon ve absorbsiyon',
        'Elektron üst katmana çıkarken enerji soğurur (absorbsiyon), inerken salar (emisyon). Her elementin çizgileri kendine özgüdür.',
      ),
    ], [
      soru('Rutherford un deneyi, atom kütlesinin büyük kısmının küçük bir çekirdekte toplandığını gösterdi.', true, 'Işınların çok azının geri sekmesi bunun kanıtıydı.'),
      soru('İzotop atomların proton sayıları farklıdır.', false, 'Proton sayıları aynı, nötron sayıları farklıdır; proton değişseydi element değişirdi.'),
      soru('Bir elementin kimliğini kütle numarası belirler.', false, 'Kimliği atom numarası, yani proton sayısı belirler.'),
      soru('Elektron üst enerji seviyesinden alt seviyeye inerken ışık yayar.', true, 'Aradaki enerji farkı ışık olarak salınıyor; emisyon spektrumu böyle oluşuyor.'),
    ]),
    konu('kim9-orbital', 'Atom Orbitalleri ve Elektron Dizilimi', [
      kart(
        'Orbital nedir?',
        'Elektronun bulunma olasılığının en yüksek olduğu bölge. s küresel, p sekiz şeklinde; kesin bir yörünge değil.',
      ),
      kart(
        'Orbital türleri',
        'Her orbital en çok iki elektron alır; sayıları alt katmanın kapasitesini belirler.',
        {
          tur: 'tablo',
          basliklar: ['Alt katman', 'Orbital', 'Elektron'],
          satirlar: [
            ['s', '1', '2'],
            ['p', '3', '6'],
            ['d', '5', '10'],
            ['f', '7', '14'],
          ],
        },
      ),
      kart(
        'Aufbau ilkesi',
        'Elektronlar en düşük enerjili orbitalden başlayarak yerleşir. Sıra 1s, 2s, 2p, 3s, 3p, 4s, 3d diye gider.',
      ),
      kart(
        'Neden 4s, 3d’den önce?',
        'Sıralamayı katman numarası değil enerji belirler ve 4s orbitalinin enerjisi 3d’den düşüktür.',
      ),
      kart(
        'Pauli dışlama ilkesi',
        'Bir orbitalde en fazla iki elektron bulunur ve bu ikisinin spinleri zıttır. Aynı dört sayıya sahip iki elektron olamaz.',
      ),
      kart(
        'Hund kuralı',
        'Eş enerjili orbitallere elektronlar önce birer birer ve aynı spinle yerleşir; ancak hepsi dolduktan sonra eşleşir.',
      ),
      kart(
        'Valans elektron',
        'En dış katmandaki elektronlar. Bir elementin kimyasal davranışını belirleyen tek şey pratikte bunlardır.',
      ),
      kart(
        'Küresel simetri',
        'Alt katmanın yarı ya da tam dolu olması (p³, p⁶, d⁵, d¹⁰) atoma ek kararlılık verir. Cr ve Cu dizilimi bu yüzden şaşırtır.',
      ),
    ], [
      soru('Aufbau ilkesine göre elektronlar önce en düşük enerjili orbitali doldurur.', true, 'Sistem en kararlı, yani en düşük enerjili düzeni seçiyor.'),
      soru('Aynı orbitaldeki iki elektronun spinleri aynı yöndedir.', false, 'Pauli dışlama ilkesi zıt spin şartı koyuyor.'),
      soru('4s orbitalinin enerjisi 3d den düşük olduğu için önce dolar.', true, 'Doldurma sırasını baş kuantum sayısı değil enerji belirliyor.'),
      soru('Hund kuralına göre eş enerjili orbitallere elektronlar önce çiftler hâlinde yerleşir.', false, 'Önce her orbitale birer elektron girer, ancak hepsi dolunca eşleşme başlar.'),
    ]),
    konu('kim9-periyodik-yer', 'Periyodik Tabloda Yer Bulma', [
      kart(
        'Periyot ve grup',
        'Periyot numarası en yüksek katman sayısıdır; grup numarası valans elektron sayısıyla belirlenir.',
      ),
      kart(
        'Bloklar',
        'Son elektronun girdiği orbital bloğu verir: s ve p bloğu baş gruplar, d bloğu geçiş metalleri, f bloğu lantanit ve aktinitler.',
      ),
      kart(
        'Grupların adları',
        '1. grup alkali metaller, 2. grup toprak alkali, 17. grup halojenler, 18. grup soy gazlar.',
      ),
      kart(
        'İyon oluşumu',
        'Elektron veren atom katyon (+), alan atom anyon (−) olur. Proton sayısı hiç değişmez, yalnızca elektron sayısı değişir.',
      ),
      kart(
        'İzoelektronik',
        'Elektron sayısı ve dizilimi aynı olan tanecikler izoelektroniktir. Na⁺, Ne ve F⁻ üçünde de 10 elektron vardır.',
      ),
      kart(
        'Soy gaza benzeme eğilimi',
        'Atomlar en yakın soy gazın diziliminde kararlı olur. Metaller elektron verir, ametaller alır.',
      ),
      kart(
        'Metal, ametal, yarı metal',
        'Metaller solda ve iletken, ametaller sağda ve yalıtkan; aradaki basamakta duran yarı metaller koşula göre iletir.',
      ),
    ], [
      soru('Periyot numarası, atomun elektron bulunan en yüksek enerji seviyesini verir.', true, 'Yatay sıralar bu seviyeye göre kuruluyor.'),
      soru('Aynı gruptaki elementlerin değerlik elektron sayıları aynıdır.', true, 'Benzer kimyasal davranışlarının sebebi bu.'),
      soru('Metaller elektron alarak negatif yüklü iyon oluşturur.', false, 'Metaller elektron verir ve pozitif iyon (katyon) olur.'),
      soru('Periyodik tablonun 1A grubuna soy gazlar denir.', false, '1A alkali metaller; soy gazlar 8A grubunda.'),
    ]),
    konu('kim9-periyodik-ozellik', 'Periyodik Özellikler', [
      kart(
        'Eğilimlerin özeti',
        'Dört özelliğin tamamı tabloda düzenli değişir; yönleri karıştırılmasın diye bir arada okunmalı.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Sağa', 'Aşağı'],
          satirlar: [
            ['Atom yarıçapı', 'Azalır', 'Artar'],
            ['İyonlaşma enerjisi', 'Artar', 'Azalır'],
            ['Elektronegatiflik', 'Artar', 'Azalır'],
            ['Metalik özellik', 'Azalır', 'Artar'],
          ],
        },
      ),
      kart(
        'Atom yarıçapı',
        'Soldan sağa küçülür (çekirdek yükü artar, aynı katman çekilir), yukarıdan aşağı büyür (katman sayısı artar).',
      ),
      kart(
        'İyonlaşma enerjisi',
        'Gaz hâlindeki atomdan bir elektron koparmak için gereken enerji. Soldan sağa artar, aşağı doğru azalır.',
      ),
      kart(
        'Ardışık iyonlaşma',
        'İkinci elektronu koparmak birinciden hep daha zordur. Değerlik elektronları bittiğinde sıçrama çok büyük olur.',
      ),
      kart(
        'Elektronegatiflik',
        'Bağdaki elektronu kendine çekme gücü. En yüksek flor, en düşük fransiyum; soy gazlara genelde değer verilmez.',
      ),
      kart(
        'İyon yarıçapı',
        'Katyon kendi atomundan küçüktür (katman kaybeder), anyon büyüktür (itme artar). Bu kural sınavda sık sorulur.',
      ),
      kart(
        'Neden bu yönde değişir?',
        'İki şey yarışır: çekirdek yükü elektronu çeker, iç katmanlar onu perdeler. Eğilimlerin tamamı bu yarışın sonucudur.',
      ),
    ], [
      soru(
        'Bir periyotta soldan sağa gidildikçe atom yarıçapı artar.',
        false,
        'Çekirdek yükü arttığı için elektronlar içe çekilir; yarıçap küçülür.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Soldan sağa'],
          satirlar: [
            ['Atom yarıçapı', 'Azalır'],
            ['İyonlaşma enerjisi', 'Artar'],
            ['Elektronegatiflik', 'Artar'],
          ],
        },
      ),
      soru('İyonlaşma enerjisi, grupta yukarıdan aşağı inildikçe artar.', false, 'Yarıçap büyüyüp değerlik elektronu uzaklaştıkça koparmak kolaylaşır, enerji azalır.'),
      soru('Ardışık iyonlaşma enerjilerindeki büyük bir sıçrama, değerlik elektronlarının bittiğini gösterir.', true, 'Sıçramadan önceki elektron sayısı grup numarasını veriyor.'),
      soru('Katyonun yarıçapı, oluştuğu nötr atomun yarıçapından büyüktür.', false, 'Elektron verildiği için küçülür; anyonda tersi olur.'),
    ]),
  ]),
  tema('kim9-t2', 'Çeşitlilik', [
    konu('kim9-metalik', 'Metalik Bağ', [
      kart(
        'Elektron denizi',
        'Metal atomları valans elektronlarını ortak bir havuza bırakır. Pozitif çekirdekler bu elektron denizinde yüzer.',
      ),
      kart(
        'Neden iletken?',
        'Serbest elektronlar yük ve ısıyı taşıyabildiği için metaller hem elektriği hem ısıyı iyi iletir.',
      ),
      kart(
        'Dövülebilir ve tel çekilebilir',
        'Katmanlar kayınca bağ kopmaz, elektron denizi yeni düzeni sarar. Bu yüzden metal kırılmaz, şekil alır.',
      ),
      kart(
        'Parlaklık',
        'Serbest elektronlar gelen ışığı soğurup hemen geri salar; metalin parlak görünmesinin sebebi budur.',
      ),
      kart(
        'Bağın gücü',
        'Valans elektron sayısı arttıkça ve atom küçüldükçe metalik bağ güçlenir; erime noktası da yükselir.',
      ),
    ], [
      soru('Metallerin elektriği iletmesi, serbestçe hareket eden değerlik elektronlarındandır.', true, 'Elektron denizi modeli bunu anlatıyor.'),
      soru('Metaller darbe aldığında iyonik katılar gibi kırılır.', false, 'Elektron denizi katmanların kaymasına izin verdiği için metal şekil değiştirir.'),
      soru('Metalik bağ güçlendikçe erime noktası yükselir.', true, 'Taneciği ayırmak için daha çok enerji gerekiyor.'),
      soru('Metallerin parlaklığı yüzeydeki oksit tabakasından gelir.', false, 'Serbest elektronların ışığı yansıtmasından gelir; oksit tabakası tersine matlaştırır.'),
    ]),
    konu('kim9-iyonik', 'İyonik Bağ', [
      kart(
        'Nasıl oluşur?',
        'Metal elektron verir, ametal alır; zıt yüklü iyonlar arasındaki elektriksel çekim iyonik bağdır.',
      ),
      kart(
        'Örgü yapısı',
        'İyonik bileşiklerde molekül yoktur; iyonlar üç boyutlu bir örgü kurar. NaCl formülü yalnızca oranı söyler.',
      ),
      kart(
        'Sert ama kırılgan',
        'Örgü katmanları kaydığında aynı yükler karşı karşıya gelir ve iterek kristali çatlatır.',
      ),
      kart(
        'Yüksek erime noktası',
        'Örgüyü çözmek için çok sayıda güçlü çekimi birden kırmak gerekir; sofra tuzu 801 °C’de erir.',
      ),
      kart(
        'Ne zaman iletir?',
        'Katı hâlde iletmez, iyonlar yerinde sabittir. Eriyince ya da suda çözününce iyonlar serbest kalır ve iletir.',
      ),
    ], [
      soru('İyonik bağ, metal ile ametal arasında elektron aktarımıyla oluşur.', true, 'Metal verir, ametal alır; zıt yüklü iyonlar birbirini çeker.'),
      soru('İyonik katılar katı hâlde elektriği iyi iletir.', false, 'İyonlar örgüde sabit; iletim ancak erimiş hâlde ya da sulu çözeltide olur.'),
      soru('İyonik bileşikler hem sert hem kırılgandır.', true, 'Örgü kayınca aynı yüklü iyonlar karşılaşıyor ve kristal çatlıyor.'),
      soru('İyonik bileşiklerin erime noktaları düşüktür.', false, 'Örgüdeki çekim güçlü olduğu için erime noktaları yüksektir.'),
    ]),
    konu('kim9-kovalent', 'Kovalent Bağ', [
      kart(
        'Ortak kullanılan elektron',
        'İki ametal elektronlarını ortaklaşa kullanır. Alışveriş değil paylaşım olduğu için iyon oluşmaz.',
      ),
      kart(
        'Polar kovalent',
        'Elektronegatiflikleri farklı iki atom arasında elektron eşit paylaşılmaz; bağ bir uçta kısmi negatif olur (HCl).',
      ),
      kart(
        'Apolar kovalent',
        'Aynı ya da çok yakın elektronegatiflikte atomlar arasında elektron eşit paylaşılır (H₂, O₂).',
      ),
      kart(
        'Bağ sayısı',
        'Tekli, ikili ve üçlü bağ vardır. Bağ sayısı arttıkça bağ kısalır ve güçlenir; N₂’nin üçlü bağı çok zor kopar.',
      ),
      kart(
        'Hangi bağ oluşur?',
        'Bağın türünü, birleşen atomların metal mi ametal mi olduğu belirler.',
        {
          tur: 'tablo',
          basliklar: ['Atomlar', 'Bağ'],
          satirlar: [
            ['Metal + ametal', 'İyonik'],
            ['Ametal + ametal', 'Kovalent'],
            ['Metal + metal', 'Metalik'],
          ],
        },
      ),
    ], [
      soru('Kovalent bağda elektronlar ortaklaşa kullanılır.', true, 'Ametaller elektron almak istediği için aktarım yerine ortaklık kuruluyor.'),
      soru('İki farklı ametal arasında oluşan bağ polar kovalenttir.', true, 'Elektronegatiflik farkı elektronları bir tarafa yaklaştırıyor.'),
      soru('H₂ molekülündeki bağ polar kovalenttir.', false, 'Aynı iki atom arasında elektronegatiflik farkı yok; bağ apolar.'),
      soru('Kovalent bağ yalnızca metal atomları arasında oluşur.', false, 'Ametaller arasında oluşur; metaller arasındaki bağ metalik bağdır.'),
    ]),
    konu('kim9-lewis', 'Lewis Nokta Yapısı', [
      kart(
        'Ne gösterir?',
        'Valans elektronları nokta ile, ortaklaşılan çiftleri çizgi ile gösteren basit bir şema.',
      ),
      kart(
        'Oktet kuralı',
        'Atomlar son katmanlarını sekize (hidrojen ikiye) tamamlayacak biçimde bağ kurma eğilimindedir.',
      ),
      kart(
        'Nasıl çizilir?',
        'Önce toplam valans elektron sayılır, sonra bağlar kurulur ve kalan elektronlar ortaklanmamış çift olarak dağıtılır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Elektronları say' },
            { ad: 'Bağları kur' },
            { ad: 'Kalanı dağıt' },
          ],
        },
      ),
      kart(
        'Ortaklanmamış çift',
        'Bağa katılmayan elektron çiftleri de çizilir. Molekülün şeklini ve polarlığını bunlar belirler.',
      ),
      kart(
        'Oktete uymayanlar',
        'BeCl₂ ve BF₃ oktetin altında, PCl₅ ve SF₆ üstünde kalır. Kural her zaman geçerli bir yasa değil, güçlü bir eğilimdir.',
      ),
    ], [
      soru('Lewis yapısı atomun değerlik elektronlarını noktalarla gösterir.', true, 'İç katmanlar çizilmiyor; bağı kuran elektronlar değerlik elektronları.'),
      soru('Oktet kuralına göre atomlar son katmanlarında sekiz elektrona ulaşmaya çalışır.', true, 'Soy gaz düzenine benzemek kararlılık sağlıyor.'),
      soru('Hidrojen atomu da oktete ulaşmaya çalışır.', false, 'Hidrojen iki elektronla, yani dublet ile kararlı.'),
      soru('Bir molekülde ortaklanmamış elektron çifti bulunamaz.', false, 'Su molekülündeki oksijenin iki ortaklanmamış çifti var.'),
    ]),
    konu('kim9-polarlik', 'Molekül Polarlığı ve Apolarlığı', [
      kart(
        'Bağ polar, molekül apolar olabilir',
        'CO₂’de iki bağ da polardır ama molekül doğrusaldır: eşit büyüklükte iki dipol ters yönde durur ve birbirini götürür.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [2, 3],
                [8, 3],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [5, 3],
                [2.6, 3],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [5, 3],
                [7.4, 3],
              ],
              kirik: true,
              ok: true,
            },
          ],
          etiketler: [
            { x: 2, y: 4, ad: 'O', renk: 'ikincil' },
            { x: 5, y: 4, ad: 'C', renk: 'ikincil' },
            { x: 8, y: 4, ad: 'O', renk: 'ikincil' },
            { x: 5, y: 1.4, ad: 'toplam sıfır', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Suyun açısı',
        'H₂O açısaldır; iki dipol birbirini götürmek yerine toplanır ve su güçlü bir polar molekül olur.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [2.5, 1.5],
                [5, 4.2],
                [7.5, 1.5],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [5, 1.2],
                [5, 3.4],
              ],
              kirik: true,
              ok: true,
            },
          ],
          etiketler: [
            { x: 5, y: 5, ad: 'O', renk: 'ikincil' },
            { x: 2, y: 1.1, ad: 'H', renk: 'ikincil' },
            { x: 8, y: 1.1, ad: 'H', renk: 'ikincil' },
            { x: 6.8, y: 2.6, ad: 'toplam dipol', renk: 'ana' },
          ],
        },
      ),
      kart(
        'Dipol moment',
        'Yük ayrımının büyüklüğü ve yönü. Vektörlerin toplamı sıfırdan farklıysa molekül polardır.',
      ),
      kart(
        'Şekil belirleyici',
        'Aynı atomlardan kurulu iki molekülün polarlığı geometrilerine göre değişir; formüle bakarak karar verilemez.',
      ),
      kart(
        'Benzer benzeri çözer',
        'Polar maddeler polar çözücüde, apolar maddeler apolar çözücüde çözünür. Yağın suda çözünmemesi bu yüzden.',
      ),
    ], [
      soru(
        'Şekildeki su molekülü doğrusal olduğu için apolardır.',
        false,
        'Molekül açılı: bağ polarlıkları birbirini götürmüyor ve su polar bir molekül.',
        {
          tur: 'koordinat',
          pencere: [-2.4, 2.4, -0.8, 2.4],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [-1.5, 0.2],
                [0, 1.4],
                [1.5, 0.2],
              ],
              kirik: true,
            },
          ],
          etiketler: [
            { x: 0, y: 1.9, ad: 'O' },
            { x: -1.8, y: 0.1, ad: 'H' },
            { x: 1.8, y: 0.1, ad: 'H' },
            { x: 0, y: 0.7, ad: '104,5°' },
          ],
        },
      ),
      soru('Bağları polar olan bir molekül apolar olabilir.', true, 'CO₂ de olduğu gibi: simetrik şekilde bağ polarlıkları birbirini götürüyor.'),
      soru('Polar bir madde apolar bir çözücüde iyi çözünür.', false, 'Benzer benzeri çözer: polar madde polar çözücüde çözünür.'),
      soru('Bir molekülün polar olup olmadığını yalnızca bağ türü belirler.', false, 'Molekülün şekli de belirleyici; simetrik bir molekülde polar bağlar birbirini götürebiliyor.'),
    ]),
    konu('kim9-adlandirma', 'Bileşiklerin Adlandırılması', [
      kart(
        'İyonik bileşikler',
        'Önce metal, sonra ametal yazılır: NaCl sodyum klorür. Ametalin sonuna -ür/-ır eki gelir.',
      ),
      kart(
        'Değerlik gösteren metaller',
        'Birden çok değerlik alan metalde değerlik Roma rakamıyla yazılır: CuSO₄ bakır(II) sülfat.',
      ),
      kart(
        'Kovalent bileşikler',
        'Atom sayısı Yunanca ön eklerle söylenir: CO karbon monoksit, CO₂ karbon dioksit, N₂O₄ diazot tetraoksit.',
      ),
      kart(
        'Ön ekler',
        'mono 1, di 2, tri 3, tetra 4, penta 5, heksa 6. İlk atomda "mono" genellikle yazılmaz.',
      ),
      kart(
        'Sık geçen kökler',
        'Poliatomik iyonlar ezberlenince adlandırmanın yarısı biter.',
        {
          tur: 'tablo',
          basliklar: ['İyon', 'Adı'],
          satirlar: [
            ['SO₄²⁻', 'Sülfat'],
            ['NO₃⁻', 'Nitrat'],
            ['CO₃²⁻', 'Karbonat'],
            ['PO₄³⁻', 'Fosfat'],
            ['OH⁻', 'Hidroksit'],
            ['NH₄⁺', 'Amonyum'],
          ],
        },
      ),
      kart(
        'Yaygın adlar',
        'Bazı bileşikler sistematik adıyla anılmaz: H₂O su, NH₃ amonyak, NaCl sofra tuzu, CaCO₃ kireç taşı.',
      ),
    ], [
      soru('CO₂ bileşiğinin adı karbon dioksittir.', true, 'İki ametal; ikinci elemente atom sayısını gösteren ön ek geliyor.'),
      soru('İyonik bileşikler adlandırılırken önce ametal yazılır.', false, 'Önce metal (katyon), sonra ametal yazılır.'),
      soru('CuSO₄ bileşiği bakır(II) sülfat diye adlandırılır.', true, 'Bakır birden çok değerlik aldığı için değerliği Roma rakamıyla belirtiliyor.'),
      soru('Kovalent bileşiklerin adlandırılmasında ön ek kullanılmaz.', false, 'mono, di, tri gibi ön ekler atom sayısını gösteriyor.'),
    ]),
    konu('kim9-molekuller-arasi', 'Moleküller Arası Etkileşimler', [
      kart(
        'Bağdan zayıftır',
        'Moleküller arası çekimler molekülün içindeki bağlardan çok daha zayıftır. Suyu kaynatmak bağı değil çekimi kırar.',
      ),
      kart(
        'Güç sırası',
        'Üç etkileşim türü aynı sırayla güçlenir ve kaynama noktası da bu sırayı izler.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'London', alt: 'en zayıf' },
            { ad: 'Dipol-dipol' },
            { ad: 'Hidrojen bağı', alt: 'en güçlü' },
          ],
        },
      ),
      kart(
        'London kuvvetleri',
        'Anlık elektron kayması geçici dipol yaratır. Bütün moleküllerde vardır; molekül büyüdükçe güçlenir.',
      ),
      kart(
        'Dipol-dipol',
        'Kalıcı dipolü olan polar moleküller birbirini zıt uçlarından çeker. London’dan güçlüdür.',
      ),
      kart(
        'Hidrojen bağı',
        'H atomu F, O ya da N’ye bağlıysa ortaya çıkan çok güçlü dipol-dipol. Suyun yüksek kaynama noktası bundan.',
      ),
      kart(
        'Van der Waals',
        'London ve dipol-dipol etkileşimlerinin ortak adı. Etkileşim türü, maddenin hâlini ve kaynama noktasını belirler.',
      ),
      kart(
        'İyon-dipol',
        'Suda çözünen tuzda su molekülleri iyonları sarar. Çözünmeyi mümkün kılan etkileşim budur.',
      ),
    ], [
      soru('Moleküller arası etkileşimler kimyasal bağlardan zayıftır.', true, 'Suyu kaynatmak molekülleri ayırıyor, bağlarını koparmıyor.'),
      soru('Suyun kaynama sıcaklığının beklenenden yüksek olması hidrojen bağlarındandır.', true, 'Hidrojen bağı moleküller arası etkileşimlerin en güçlüsü.'),
      soru('London kuvvetleri yalnızca polar moleküllerde görülür.', false, 'Bütün moleküllerde var; apolar moleküllerde tek etkileşim odur.'),
      soru('Hidrojen bağı, hidrojen atomu bulunan her molekülde oluşur.', false, 'Hidrojenin flor, oksijen veya azota bağlı olması gerekiyor.'),
    ]),
    konu('kim9-katilar', 'Katılar ve Özellikleri', [
      kart(
        'Amorf ve kristal',
        'Kristal katıda tanecikler düzenli bir örgüdedir ve keskin bir erime noktası vardır; amorf katı (cam) yumuşayarak erir.',
      ),
      kart(
        'Dört katı türü',
        'Katıyı bir arada tutan etkileşim, bütün özelliklerini birden belirler.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Erime noktası'],
          satirlar: [
            ['İyonik', 'Yüksek'],
            ['Kovalent ağ', 'Çok yüksek'],
            ['Metalik', 'Değişken'],
            ['Moleküler', 'Düşük'],
          ],
        },
      ),
      kart(
        'İyonik katı',
        'Zıt yüklü iyon örgüsü. Sert, kırılgan, yüksek erime noktalı; katı hâlde iletmez.',
      ),
      kart(
        'Kovalent ağ katısı',
        'Elmas ve kuvars gibi tüm kristal tek bir bağ ağıdır. Bu yüzden aşırı sert ve çok yüksek erime noktalıdır.',
      ),
      kart(
        'Moleküler katı',
        'Kuru buz ve iyot gibi moleküllerin zayıf çekimle tutunduğu katılar. Yumuşak ve düşük erime noktalıdır.',
      ),
      kart(
        'Metalik katı',
        'Elektron denizi ile tutunur. İletken, dövülebilir; erime noktası bağ gücüne göre çok geniş aralıkta değişir.',
      ),
      kart(
        'Aynı element, farklı katı',
        'Elmas ve grafit ikisi de karbondur; biri en sert maddelerden, öteki kalem ucu. Farkı yalnızca dizilim yaratıyor.',
      ),
    ], [
      soru('Elmas ile grafit aynı elementten oluşur.', true, 'İkisi de karbon; farkı atomların dizilişinde.'),
      soru('Cam kristal bir katıdır.', false, 'Camın düzenli örgüsü yok; amorf katı.'),
      soru('Kovalent ağ katılarının erime noktaları çok yüksektir.', true, 'Eritmek için kovalent bağları koparmak gerekiyor.'),
      soru('Moleküler katılar sert ve yüksek erime noktalıdır.', false, 'Molekülleri zayıf etkileşimler tuttuğu için genelde yumuşak ve düşük erime noktalıdır.'),
    ]),
    konu('kim9-sivilar', 'Sıvılar ve Özellikleri', [
      kart(
        'Buhar basıncı',
        'Kapalı kapta sıvı ile dengedeki buharın basıncı. Sıcaklık arttıkça ve moleküller arası çekim zayıfladıkça büyür.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık',
          yAd: 'buhar bas.',
          egriler: [
            {
              noktalar: [
                [0, 0.2],
                [2, 0.7],
                [3.5, 1.8],
                [4.5, 3.4],
                [5.2, 5.2],
              ],
            },
          ],
        },
      ),
      kart(
        'Kaynama sıcaklığı',
        'Buhar basıncı dış basınca eşitlendiğinde kaynar. Yüksek rakımda dış basınç düşük olduğu için su 100 °C’den önce kaynar.',
      ),
      kart(
        'Viskozite',
        'Akmaya karşı direnç. Moleküller arası çekim güçlüyse ve molekül büyükse artar; sıcaklık artınca azalır.',
      ),
      kart(
        'Adezyon ve kohezyon',
        'Kohezyon aynı tür moleküller arası çekim, adezyon farklı yüzeye yapışma. İkisinin yarışı menisküsün yönünü belirler.',
      ),
      kart(
        'Yüzey gerilimi',
        'Yüzeydeki moleküller içeri doğru çekildiği için sıvı yüzeyi zar gibi davranır. Su damlasının yuvarlak olması bundandır.',
      ),
      kart(
        'Kılcallık',
        'Adezyon kohezyondan güçlüyse sıvı ince boruda yükselir. Bitkinin suyu yapraklara taşımasının bir parçası budur.',
      ),
      kart(
        'Suyun tuhaflığı',
        'Su donarken genleşir ve buz yüzer. Hidrojen bağları katı hâlde molekülleri daha boşluklu bir düzene sokar.',
      ),
    ], [
      soru('Bir sıvının buhar basıncı arttıkça kaynama sıcaklığı düşer.', true, 'Sıvı, dış basıncı daha erken karşılıyor.'),
      soru('Viskozitesi yüksek sıvılar daha zor akar.', true, 'Bal ile suyun farkı bu.'),
      soru('Yüzey gerilimi, sıvı taneciklerinin kabın çeperine yaptığı çekimden kaynaklanır.', false, 'Yüzey gerilimi kohezyondan, yani taneciklerin birbirini çekmesinden gelir.'),
      soru('Kılcal boruda cıva da su gibi yükselir.', false, 'Cıvada kohezyon adezyondan güçlü; seviye yükselmek yerine alçalır.'),
    ]),
  ]),
  tema('kim9-t3', 'Sürdürülebilirlik', [
    konu('kim9-nano', 'Metal Nanoparçacıklar', [
      kart(
        'Nano ne kadar küçük?',
        'Nanometre metrenin milyarda biri. Nanoparçacık kabaca 1-100 nm arasıdır; bir saç telinin binde biri kadar.',
      ),
      kart(
        'Neden farklı davranır?',
        'Küçüldükçe yüzey alanının hacme oranı büyür. Aynı madde nano boyutta daha etkin, bazen bambaşka renkte olur.',
      ),
      kart(
        'Yüzey/hacim oranı',
        'Bir küpü ikiye bölmek hacmi değiştirmez ama yüzeyi büyütür. Tepkime yüzeyde olduğu için etkinlik artar.',
      ),
      kart(
        'Kullanım alanları',
        'Gümüş nanoparçacık mikrop öldürücü olarak tekstilde, altın nanoparçacık tanı testlerinde kullanılır.',
      ),
      kart(
        'Evsel atıktan elde',
        'Bitki özütleri metal iyonlarını indirgeyerek nanoparçacığa çevirebilir; çay ve meyve kabuğu bu amaçla kullanılır.',
      ),
      kart(
        'Riski de var',
        'Küçük olmak hücre zarını geçebilmek demek. Nanoparçacıkların sağlık ve çevre etkileri hâlâ araştırılıyor.',
      ),
    ], [
      soru('1 nanometre, metrenin milyarda biridir.', true, 'Bir insan saçı yaklaşık 80 bin nanometre kalınlığında.'),
      soru('Nanoparçacıklar, aynı maddenin iri hâliyle aynı özellikleri gösterir.', false, 'Yüzey/hacim oranı büyüdüğü için renk, erime noktası ve etkinlik değişebiliyor.'),
      soru('Nanoparçacıklarda yüzey alanının hacme oranı büyüktür.', true, 'Atomların büyük kısmı yüzeyde kalıyor; tepkime etkinliği bu yüzden yüksek.'),
      soru('Nanoteknoloji ürünlerinin çevresel ve sağlıkla ilgili bir riski yoktur.', false, 'Küçük boyut, canlı dokularda birikme ve hücrelere girme riski getiriyor.'),
    ]),
    konu('kim9-cevresel', 'Metal ve Alaşımların Çevresel Etkileri', [
      kart(
        'Ağır metal',
        'Kurşun, cıva ve kadmiyum gibi yoğunluğu yüksek metaller. Düşük derişimde bile zehirlidir ve vücuttan kolay atılmaz.',
      ),
      kart(
        'Besin zincirinde birikme',
        'Ağır metal parçalanmaz; her basamakta derişimi artar. En çok zararı zincirin tepesindeki canlı görür.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Su', alt: 'az' },
            { ad: 'Plankton' },
            { ad: 'Balık' },
            { ad: 'İnsan', alt: 'çok', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Alaşım nedir?',
        'Bir metalin başka element(ler)le karışımı. Çelik demir ile karbon, pirinç bakır ile çinko karışımıdır.',
      ),
      kart(
        'Neden alaşım yapılır?',
        'Saf metal çoğu zaman fazla yumuşak ya da fazla kolay paslanır; alaşım sertlik ve dayanıklılık kazandırır.',
      ),
      kart(
        'Korozyon',
        'Metalin çevreyle tepkimeye girip aşınması. Demirin paslanması en yaygın örneği; boya ve galvaniz bunu yavaşlatır.',
      ),
      kart(
        'Ekolojik ayak izi',
        'Bir üretimin doğaya bindirdiği yükün ölçüsü. Metal geri kazanımı, cevherden üretime göre bu yükü belirgin biçimde azaltır.',
      ),
    ], [
      soru('Ağır metaller besin zincirinde birikerek üst basamaklarda yoğunlaşır.', true, 'Vücuttan atılmadıkları için her basamakta daha çok toplanıyorlar.'),
      soru('Alaşım, iki metalin kimyasal tepkimesiyle oluşan yeni bir bileşiktir.', false, 'Alaşım bir karışım; bileşenler kendi kimliğini koruyor.'),
      soru('Paslanmaz çelik, korozyona direnç kazandırmak için üretilmiş bir alaşımdır.', true, 'İçindeki krom yüzeyde koruyucu bir tabaka oluşturuyor.'),
      soru('Korozyon yalnızca demirde görülür.', false, 'Bakır ve alüminyum gibi metaller de yüzeyde oksitlenir; demirdeki adı pas.'),
    ]),
    konu('kim9-yesil', 'Yeşil Kimyanın Atık Önleme İlkesi', [
      kart(
        'Temel ilke',
        'Atığı sonradan temizlemek yerine hiç oluşturmamak. Yeşil kimyanın on iki ilkesinin ilki budur.',
      ),
      kart(
        'Neden önce önleme?',
        'Oluşmuş atığı arıtmak enerji, su ve para harcar. Oluşmayan atığın arıtma maliyeti sıfırdır.',
      ),
      kart(
        'Atık hiyerarşisi',
        'Sıra bellidir ve tersine çevrilmez: en iyisi hiç üretmemek, en kötüsü depolamaktır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Önle', alt: 'en iyisi' },
            { ad: 'Azalt' },
            { ad: 'Yeniden kullan' },
            { ad: 'Geri dönüştür' },
            { ad: 'Bertaraf et', alt: 'son çare', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Kimyasal ayak izi',
        'Bir ürünün üretiminde kullanılan ve açığa çıkan kimyasalların toplam yükü. Küçük ölçekli deney bu yükü düşürür.',
      ),
      kart(
        'Atom ekonomisi',
        'Girenlerin ne kadarının ürüne dönüştüğünün ölçüsü. Yüksek verim, az atık demektir.',
      ),
      kart(
        'Okulda karşılığı',
        'Mikro ölçekli deney aynı sonucu daha az madde ile verir: hem daha az atık hem daha az risk.',
      ),
    ], [
      soru(
        'Şemaya göre atığı geri kazanmak, hiç oluşturmamaktan daha önceliklidir.',
        false,
        'Yeşil kimyanın ilk basamağı önleme; geri kazanım ancak atık oluştuysa devreye giriyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Önle' },
            { ad: 'Azalt' },
            { ad: 'Geri kazan' },
            { ad: 'Bertaraf et' },
          ],
        },
      ),
      soru('Atom ekonomisi yüksek bir tepkimede girenlerin büyük kısmı ürüne dönüşür.', true, 'Ürüne dönüşmeyen kısım atık demek.'),
      soru('Yeşil kimya yalnızca sanayiyi ilgilendirir, okul laboratuvarında karşılığı yoktur.', false, 'Deneyi küçük ölçekte yapmak ve az kimyasal kullanmak da aynı ilkenin uygulaması.'),
      soru('Atığı arıtmak, atığı hiç oluşturmamakla aynı değerdedir.', false, 'Arıtma da enerji ve kimyasal harcıyor; en ucuz atık hiç oluşmayan atık.'),
    ]),
  ]),
])
