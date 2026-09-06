import { kart, konu, program, tema } from '../tip'

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
        'Temizlik ürünleri',
        'Sabun ve deterjan, bir ucu suyu seven bir ucu yağı seven moleküllerdir. Yağı kavrayıp suya taşıdıkları için kir çözülür.',
      ),
      kart(
        'Mutfakta kimya',
        'Kabartma tozu ısınınca karbondioksit verir ve hamuru kabartır. Ekmeğin kızarması da şeker ile proteinin tepkimesi.',
      ),
      kart(
        'Kimya olmadan olmazdı',
        'Gübre olmasa tarım bugünkü nüfusu besleyemezdi; antibiyotik olmasa basit bir enfeksiyon öldürücü kalırdı.',
      ),
    ]),
    konu('kim9-guvenlik', 'Kimyasal Maddelerin Kullanımı ve Güvenlik', [
      kart(
        'Uyarı işaretleri',
        'Kaplardaki eşkenar dörtgen işaretler tehlikeyi söyler: alev yanıcı, kafatası zehirli, aşındırıcı işareti cildi ve gözü yakar.',
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
        'Karıştırılmayan ikili',
        'Çamaşır suyu ile tuz ruhu birlikte klor gazı verir. Ev temizliğinde ürünleri karıştırmak zehirlenmenin en sık sebebi.',
      ),
    ]),
    konu('kim9-altdal', 'Kimyanın Alt Disiplinleri', [
      kart(
        'Organik ve anorganik',
        'Organik kimya karbon bileşiklerine bakar; anorganik kimya geri kalan elementlere, özellikle metallere ve minerallere.',
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
        'Kimya mühendisi ile farkı',
        'Kimyager tepkimeyi laboratuvarda bulur, kimya mühendisi onu fabrika ölçeğinde ve ekonomik biçimde üretir.',
      ),
    ]),
    konu('kim9-atom-teori', 'Atom Teorileri ve Atomun Yapısı', [
      kart(
        'Modeller neden değişti?',
        'Dalton atomu dolu bir küre sandı; Thomson üzümlü keke benzetti; Rutherford çekirdeği buldu. Her yeni deney modeli değiştirdi.',
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
        'Proton (+) ve nötron (yüksüz) çekirdekte, elektron (−) çevresinde. Kütlenin neredeyse tamamı çekirdektedir.',
      ),
      kart(
        'Atom numarası kimliktir',
        'Proton sayısı elementi belirler; değişirse element değişir. Nötr atomda proton sayısı elektron sayısına eşittir.',
      ),
      kart(
        'İzotop',
        'Proton sayısı aynı, nötron sayısı farklı atomlar. Kimyasal özellikleri aynı, kütleleri farklıdır.',
      ),
      kart(
        'Emisyon ve absorbsiyon',
        'Elektron üst katmana çıkarken enerji soğurur (absorbsiyon), inerken salar (emisyon). Her elementin çizgileri kendine özgüdür.',
      ),
    ]),
    konu('kim9-orbital', 'Atom Orbitalleri ve Elektron Dizilimi', [
      kart(
        'Orbital nedir?',
        'Elektronun bulunma olasılığının en yüksek olduğu bölge. s küresel, p sekiz şeklinde; kesin bir yörünge değil.',
      ),
      kart(
        'Aufbau ilkesi',
        'Elektronlar en düşük enerjili orbitalden başlayarak yerleşir. Sıra 1s, 2s, 2p, 3s, 3p, 4s, 3d diye gider.',
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
    ]),
    konu('kim9-periyodik-ozellik', 'Periyodik Özellikler', [
      kart(
        'Atom yarıçapı',
        'Soldan sağa küçülür (çekirdek yükü artar, aynı katman çekilir), yukarıdan aşağı büyür (katman sayısı artar).',
      ),
      kart(
        'İyonlaşma enerjisi',
        'Gaz hâlindeki atomdan bir elektron koparmak için gereken enerji. Soldan sağa artar, aşağı doğru azalır.',
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
        'Bağın gücü',
        'Valans elektron sayısı arttıkça ve atom küçüldükçe metalik bağ güçlenir; erime noktası da yükselir.',
      ),
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
        'Ne zaman iletir?',
        'Katı hâlde iletmez, iyonlar yerinde sabittir. Eriyince ya da suda çözününce iyonlar serbest kalır ve iletir.',
      ),
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
        'Ortaklanmamış çift',
        'Bağa katılmayan elektron çiftleri de çizilir. Molekülün şeklini ve polarlığını bunlar belirler.',
      ),
      kart(
        'Oktete uymayanlar',
        'BeCl₂ ve BF₃ oktetin altında, PCl₅ ve SF₆ üstünde kalır. Kural her zaman geçerli bir yasa değil, güçlü bir eğilimdir.',
      ),
    ]),
    konu('kim9-polarlik', 'Molekül Polarlığı ve Apolarlığı', [
      kart(
        'Bağ polar, molekül apolar olabilir',
        'CO₂’de iki bağ da polardır ama molekül doğrusal olduğu için dipoller birbirini götürür ve molekül apolardır.',
      ),
      kart(
        'Dipol moment',
        'Yük ayrımının büyüklüğü ve yönü. Vektörlerin toplamı sıfırdan farklıysa molekül polardır.',
      ),
      kart(
        'Suyun açısı',
        'H₂O açısal olduğu için dipoller toplanır ve su güçlü bir polar moleküldür. Çözücü gücü buradan gelir.',
      ),
      kart(
        'Benzer benzeri çözer',
        'Polar maddeler polar çözücüde, apolar maddeler apolar çözücüde çözünür. Yağın suda çözünmemesi bu yüzden.',
      ),
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
        'Sık geçen kökler',
        'SO₄²⁻ sülfat, NO₃⁻ nitrat, CO₃²⁻ karbonat, PO₄³⁻ fosfat, OH⁻ hidroksit. Bunlar ezberlenince adlandırma kolaylaşır.',
      ),
    ]),
    konu('kim9-molekuller-arasi', 'Moleküller Arası Etkileşimler', [
      kart(
        'Bağdan zayıftır',
        'Moleküller arası çekimler molekülün içindeki bağlardan çok daha zayıftır. Suyu kaynatmak bağı değil çekimi kırar.',
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
    ]),
    konu('kim9-katilar', 'Katılar ve Özellikleri', [
      kart(
        'Amorf ve kristal',
        'Kristal katıda tanecikler düzenli bir örgüdedir ve keskin bir erime noktası vardır; amorf katı (cam) yumuşayarak erir.',
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
    ]),
    konu('kim9-sivilar', 'Sıvılar ve Özellikleri', [
      kart(
        'Buhar basıncı',
        'Kapalı kapta sıvı ile dengedeki buharın basıncı. Sıcaklık arttıkça ve moleküller arası çekim zayıfladıkça büyür.',
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
        'Kullanım alanları',
        'Gümüş nanoparçacık mikrop öldürücü olarak tekstilde, altın nanoparçacık tanı testlerinde kullanılır.',
      ),
      kart(
        'Evsel atıktan elde',
        'Bitki özütleri metal iyonlarını indirgeyerek nanoparçacığa çevirebilir; çay ve meyve kabuğu bu amaçla kullanılır.',
      ),
    ]),
    konu('kim9-cevresel', 'Metal ve Alaşımların Çevresel Etkileri', [
      kart(
        'Ağır metal',
        'Kurşun, cıva ve kadmiyum gibi yoğunluğu yüksek metaller. Düşük derişimde bile zehirlidir ve vücuttan kolay atılmaz.',
      ),
      kart(
        'Besin zincirinde birikme',
        'Ağır metal parçalanmaz; her basamakta derişimi artar. En çok zararı zincirin tepesindeki canlı görür.',
      ),
      kart(
        'Alaşım nedir?',
        'Bir metalin başka element(ler)le karışımı. Çelik demir ile karbon, pirinç bakır ile çinko karışımıdır.',
      ),
      kart(
        'Ekolojik ayak izi',
        'Bir üretimin doğaya bindirdiği yükün ölçüsü. Metal geri kazanımı, cevherden üretime göre bu yükü belirgin biçimde azaltır.',
      ),
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
        'Kimyasal ayak izi',
        'Bir ürünün üretiminde kullanılan ve açığa çıkan kimyasalların toplam yükü. Küçük ölçekli deney bu yükü düşürür.',
      ),
      kart(
        'Okulda karşılığı',
        'Mikro ölçekli deney aynı sonucu daha az madde ile verir: hem daha az atık hem daha az risk.',
      ),
    ]),
  ]),
])
