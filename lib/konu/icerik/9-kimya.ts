import { kart, konu, program, sikli, soru, tema } from '../tip'

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
        'Kimya maddeyi ve değişimini inceler',
        'Sabah içtiğin çayın demlenmesi, telefonunun pili, üstündeki kumaş: hepsi kimya. Kimya, yani maddenin yapısını, özelliklerini ve değişimini inceleyen bilim. Çevrende gördüğün her nesne bir madde.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fiziksel değişimde madde aynı kalır',
        'Buz erir, su olur; ama hâlâ su. Kâğıdı yırtarsın; parçalar hâlâ kâğıt. Fiziksel değişim, yani maddenin kimliği değişmeden görünüşünün değişmesi. Erime, donma, kırılma, çözünme hep fiziksel.',
      ),
      kart(
        'Kimyasal değişimde yeni madde oluşur',
        'Demir çivi yağmurda kalır, üstü pasa döner. Pas demir değil; başka bir madde. Kimyasal değişim, yani eski maddenin gidip yerine yeni maddenin gelmesi. Yanma, paslanma ve çürüme kimyasal.',
      ),
      kart(
        'Geri dönüyorsa fiziksel, dönmüyorsa kimyasal',
        'Eriyen buzu dondurursan buz geri gelir. Yanan kâğıdı geri getiremezsin. Renk değişimi, gaz çıkışı ve koku da kimyasal değişimin işareti. Ama en sağlam soru şu: madde eski hâline dönebiliyor mu?',
        undefined,
        { etiket: 'Sık hata', not: 'Şekerin suda çözünmesini kimyasal sanma: suyu buharlaştırınca aynı şeker geri gelir.' },
      ),
      kart(
        'Sabun yağı kavrar, suya taşır',
        'Yağlı tabağı yalnız suyla yıkarsan yağ kalır. Sabun eklersen çıkar. Çünkü sabun molekülünün bir ucu suyu sever, öbür ucu yağı. Yağı kavrar, suya taşır; kir böyle çözülür.',
      ),
      kart(
        'Limon asit, sabun bazdır',
        'Limon, sirke ve kola ekşidir; bunlar asit. Sabun ve kabartma tozu kaygandır; bunlar baz. Kireç çözücü asit içerir, çünkü kireci asit eritir. Yağ çözücü baz içerir, çünkü yağı baz parçalar.',
      ),
      kart(
        'Kabartma tozu gaz çıkarır, kek kabarır',
        'Kekin hamuru fırında büyür. Sebebi kabartma tozu: ısınınca karbondioksit gazı verir. Gaz kabarcıkları hamuru içeriden şişirir. Ekmeğin kızarması da kimya: şeker ile protein ısıyla tepkimeye girer.',
      ),
      kart(
        'Doğal olan da zehirli olabilir',
        'Bazı mantarlar ormanda kendiliğinden yetişir ve insanı öldürür. Yılan zehri de doğal. Zararı belirleyen şey kaynağı değil; maddenin yapısı ve miktarı, yani dozu. "Doğal" etiketi güvenlik garantisi değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Kâğıdın yanması kimyasal, yırtılması fiziksel bir değişimdir.', true, 'Yanmada yeni maddeler oluşuyor, yırtılmada kâğıt kâğıt olarak kalıyor.'),
      soru('Doğal olan her madde insan için zararsızdır.', false, 'Yılan zehri de doğal; zararı doğallığı değil yapısı ve miktarı belirliyor.'),
      soru('Buzun erimesi kimyasal bir değişimdir.', false, 'Madde yine su; yalnızca hâli değişiyor.'),
      soru('Sirkenin ekşi tadı yapısındaki asitten gelir.', true, 'Ekşi tat asidin işareti; limon ve kola da öyle.'),
      sikli('Demirin paslanması hangi tür değişimdir?', ['Fiziksel', 'Kimyasal'], 1, 'Pas yeni bir madde; demir geri gelmez.'),
      sikli('Hamuru kabartan gaz hangisidir?', ['Oksijen', 'Karbondioksit'], 1, 'Kabartma tozu ısınınca CO₂ verir.'),
      sikli('Kireç çözücüler hangi sınıftandır?', ['Baz', 'Asit'], 1, 'Kireci asit eritir; yağ çözücüler bazdır.'),
      sikli('Sabunun yağı çözmesinin sebebi?', ['Yağı buharlaştırır', 'Bir ucu suyu, bir ucu yağı sever'], 1, 'Yağı kavrayıp suya taşır.'),
      soru('Yanan kâğıt soğutulunca eski hâline döner.', false, 'Kimyasal değişim geri dönmez; kül kâğıt olmaz.'),
    ], [
      {
        soru: 'Şekerin suda çözünmesi hangi tür değişimdir?',
        siklar: ['Kimyasal', 'Fiziksel'],
        dogru: 1,
        aciklama: {
          dogru: 'Şeker kimliğini korur; su buharlaşınca aynı şeker geri kalır.',
          yanlis: 'Yeni madde oluşmadı, şeker su içinde dağıldı; buharlaştırınca geri alınır. Bu fiziksel bir değişim.',
        },
        kart: 2,
      },
    ]),
    konu('kim9-guvenlik', 'Kimyasal Maddelerin Kullanımı ve Güvenlik', [
      kart(
        'Kaptaki işaret tehlikeyi söyler',
        'Çamaşır suyunun şişesine bak: üstünde eşkenar dörtgen içinde bir işaret var. Bu işaret sana "bu madde ne yapar" der. Alev yanıcı, kafatası zehirli demek. Etiketi okumadan hiçbir kaba elini sürme.',
        {
          tur: 'tablo',
          basliklar: ['İşaret', 'Anlamı', 'Örnek'],
          satirlar: [
            ['Alev', 'Yanıcı', 'Kolonya'],
            ['Kafatası', 'Zehirli', 'Fare zehri'],
            ['Damla ve el', 'Aşındırıcı', 'Tuz ruhu'],
            ['Ünlem', 'Tahriş edici', 'Deterjan'],
            ['Ölü balık', 'Çevreye zararlı', 'Böcek ilacı'],
          ],
        },
      ),
      kart(
        'Asidi suya ekle, suyu aside değil',
        'Derişik aside su döktüğünde su bir anda kaynar ve asit yüzüne sıçrar. Sebebi: karışırken çok ısı çıkar ve o ısı küçük su damlasında toplanır. Doğrusu asidi yavaş yavaş bol suya eklemek; ısı suya dağılır.',
        undefined,
        { etiket: 'Sık hata', not: 'Sırayı şöyle tut: "önce su, sonra asit". Sınavda değil, laboratuvarda hayat kurtarır.' },
      ),
      kart(
        'Koklamak için yelpazele, asla tatma',
        'Bir şişenin kokusuna bakman gerekiyor. Burnunu şişeye sokma; buhar ciğerini yakabilir. Elinle havayı yüzüne doğru yelpazele, koku sana gelsin. Tatmak ise hiçbir koşulda yapılmaz; bir damla yeter.',
      ),
      kart(
        'Gözlük, eldiven, önlük: üçü de şart',
        'Deney tüpünden bir damla sıçradı ve gözüne geldi. Gözlüğün varsa hiçbir şey olmaz; yoksa görme kaybı. Laboratuvarda gözlük, eldiven ve önlük seçenek değil, kural. Saçın uzunsa topla, açık ayakkabı giyme.',
      ),
      kart(
        'Çamaşır suyu ile tuz ruhunu karıştırma',
        'İkisi de ayrı ayrı temizlik ürünü. Ama birlikte kullanınca klor gazı çıkar; bu gaz ciğeri yakar ve öldürebilir. Ev zehirlenmelerinin en sık sebebi bu. Kural: temizlik ürünlerini birbirine hiç karıştırma.',
        undefined,
        { etiket: 'Dikkat' },
      ),
      kart(
        'Kimyasal atık lavaboya dökülmez',
        'Deney bitti, kabın dibinde kalan sıvıyı lavaboya döktün. O sıvı borudan akarsu ve toprağa karışır. Doğrusu: her atık kendi türüne göre ayrı kaba. Karışan iki atık beklenmedik bir tepkime de verebilir.',
      ),
      kart(
        'Yağ ve elektrik yangınına su dökme',
        'Tavadaki yağ tutuştu. Su dökersen su bir anda buhara döner ve yanan yağı etrafa saçar. Elektrik yangınında ise su akımı iletir, seni çarpar. Doğrusu: kapak ya da yangın battaniyesiyle havayı kes.',
      ),
    ], [
      soru('Asit sulandırılırken su, asidin üzerine yavaşça dökülür.', false, 'Tersi yapılır: asit suya eklenir; su üstüne dökülen asit sıçrayabilir.'),
      soru('Çamaşır suyu ile tuz ruhu birlikte kullanılmamalıdır.', true, 'Karışımdan zehirli klor gazı açığa çıkıyor.'),
      soru('Laboratuvarda bir kimyasalın kokusu doğrudan burna çekilerek denenir.', false, 'Koklama elle yelpazeleyerek yapılır; tatma hiç yapılmaz.'),
      soru('Kimyasal atıklar lavaboya değil, ayrılmış atık kaplarına dökülür.', true, 'Lavaboya dökülen atık suyla birlikte çevreye karışıyor.'),
      sikli('Kaptaki alev işareti ne anlatır?', ['Aşındırıcı', 'Yanıcı'], 1, 'Aşındırıcı için sıçrayan damla ve el işareti.'),
      sikli('Kimyasalın kokusu nasıl alınır?', ['Doğrudan koklanarak', 'Elle yüze doğru yelpazelenerek'], 1, 'Doğrudan koklamak ve tatmak yasak.'),
      sikli('Yağ yangınına ne yapılmaz?', ['Kapak kapatılmaz', 'Su dökülmez'], 1, 'Su yağı sıçratır; hava kesilir.'),
      soru('Çamaşır suyu ile tuz ruhu karıştırılınca klor gazı çıkar.', true, 'Ev zehirlenmelerinin en sık sebebi.'),
      soru('Laboratuvarda gözlük yalnızca asitle çalışırken takılır.', false, 'Her deneyde takılır; sıçrayan tek damla göze zarar verir.'),
    ], [
      {
        soru: 'Derişik asit seyreltilirken doğru yol hangisidir?',
        siklar: ['Su aside dökülür', 'Asit yavaşça suya eklenir'],
        dogru: 1,
        aciklama: {
          dogru: 'Açığa çıkan ısı büyük su kütlesine dağılır, sıçrama olmaz.',
          yanlis: 'Su aside dökülürse ısı küçük su damlasında toplanır, kaynayıp asit sıçratır. Asit suya, yavaşça.',
        },
        kart: 2,
      },
    ]),
    konu('kim9-altdal', 'Kimyanın Alt Disiplinleri', [
      kart(
        'Organik kimya karbon bileşiklerine bakar',
        'Plastik şişe, ağrı kesici hap, benzin, naylon poşet: hepsinin içinde karbon var. Organik kimya, yani karbon içeren bileşikleri inceleyen dal. Karbon dört bağ kurabildiği için milyonlarca bileşik yapar.',
      ),
      kart(
        'Anorganik kimya karbon dışına bakar',
        'Sofra tuzu, demir, seramik tabak, çimento: bunlarda karbon zinciri yok. Anorganik kimya, yani karbon dışı elementleri ve bileşiklerini inceleyen dal. Metaller ve mineraller onun konusu.',
      ),
      kart(
        'Analitik kimya "ne var, ne kadar var" sorar',
        'Musluk suyunda kurşun var mı? Varsa ne kadar? Sporcunun kanında doping var mı? Bu soruları analitik kimya cevaplar. Su tahlili, gıda denetimi ve doping kontrolü onun işi.',
      ),
      kart(
        'Fizikokimya tepkime hızına ve ısıya bakar',
        'Odun neden yanınca ısı verir? Demir neden yavaş, benzin neden hızlı yanar? Fizikokimya bu "neden ve ne hızla" sorularına bakar. Enerji, hız ve denge onun konusu.',
      ),
      kart(
        'Biyokimya canlının içindeki kimyayı inceler',
        'Yediğin ekmek midende nasıl parçalanır? Kasların enerjiyi nereden alır? Biyokimya bu tepkimelere bakar: enzimler, proteinler, DNA. Biyoloji ile kimyanın kesiştiği yer.',
      ),
      kart(
        'Polimer kimyası uzun zincirleri inceler',
        'Bir zincirin halkalarını düşün; her halka bir küçük molekül. Buna monomer denir. Binlerce monomer birbirine bağlanınca polimer olur. Lastik, naylon ve plastik hep polimer; bu dal onları inceler.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Dalı adıyla değil, sorusuyla tanı',
        'Sınavda bir iş tarif edilir, "hangi dal" diye sorulur. Kendine sor: "Bu madde ne?" diyorsa analitik. "Ne hızla, neden tepkir?" diyorsa fizikokimya. "Canlıda ne olur?" diyorsa biyokimya.',
        undefined,
        { not: 'Soruda "miktar" ya da "tespit" geçiyorsa aklına hemen analitik kimya gelsin.' },
      ),
    ], [
      soru('Organik kimya, karbon bileşiklerini inceleyen alt disiplindir.', true, 'Yakıtlar, plastikler ve ilaçların çoğu bu alanın konusu.'),
      soru('Analitik kimya, bir örnekte hangi maddenin ne kadar bulunduğunu belirler.', true, '"Ne var, ne kadar var" bu alanın sorusu.'),
      soru('Canlılardaki tepkimeleri inceleyen alt disiplin biyokimya değildir.', false, 'Tam da biyokimyadır; canlıdaki kimyasal süreçleri inceler.'),
      soru('Plastiklerin yapısını fizikokimya inceler.', false, 'Polimer kimyası inceler; fizikokimya tepkime hızı ve enerji ilişkilerine bakar.'),
      sikli('Plastik ve ilaçların neredeyse tamamı hangi dalın konusudur?', ['Organik kimya', 'Anorganik kimya'], 0, 'Karbon bileşikleri.'),
      sikli('Tepkimenin hızını ve enerjisini inceleyen dal?', ['Fizikokimya', 'Biyokimya'], 0, 'Biyokimya canlıdaki tepkimeleri inceler.'),
      soru('Polimer kimyası küçük birimlerin uzun zincir kurmasını inceler.', true, 'Lastikten naylona her şey polimer.'),
      soru('Enzim ve DNA anorganik kimyanın konusudur.', false, 'Biyokimyanın; anorganik kimya karbon dışı maddelere bakar.'),
    ], [
      {
        soru: 'İçme suyunda kurşun olup olmadığını hangi dal araştırır?',
        siklar: ['Polimer kimyası', 'Analitik kimya'],
        dogru: 1,
        aciklama: {
          dogru: '"Ne var, ne kadar var?" analitik kimyanın sorusu; su tahlili onun işi.',
          yanlis: 'Polimer kimyası uzun zincirli molekülleri inceler. Bir örnekte ne olduğunu ve miktarını analitik kimya bulur.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-kariyer', 'Kimya Alanında Kariyer Olanakları', [
      kart(
        'Kimyager ilaçtan boyaya her yerde çalışır',
        'Aldığın şampuan, içtiğin ağrı kesici, duvardaki boya, arabanın benzini: hepsini bir kimyager tasarladı. İlaç, gıda, kozmetik, boya, tekstil ve enerji şirketleri kimyager çalıştırır.',
      ),
      kart(
        'Kimya bilgisi altı bölümün temeli',
        'Üniversitede yalnız "kimya" bölümü yok. Kimya mühendisliği, eczacılık, gıda mühendisliği, malzeme bilimi ve kimya öğretmenliği de kimya bilgisinin üstüne kurulur. Kimyayı sevdiysen kapı çok.',
      ),
      kart(
        'Adli kimyager olay yerindeki izi çözer',
        'Bir silah ateşlendi; şüphelinin elinde barut izi var mı? Halıdaki leke kan mı? Adli kimyager bunu laboratuvarda çözer. Mahkemedeki delillerin bir kısmı bu analizden çıkar.',
      ),
      kart(
        'İlaç yıllarca denenir, kimyager ilk halka',
        'Yeni bir ağrı kesici önce kâğıtta tasarlanır, sonra laboratuvarda üretilir. Sonra hücrede, hayvanda, insanda denenir. Bu zincir on yıl sürebilir. Molekülü ilk kuran kişi kimyager.',
      ),
      kart(
        'Kalite kontrol her partiyi ölçer',
        'Fabrika bugün bin kutu ilaç üretti. Her kutuda etken madde tam mı? Bunu kalite kontrol laboratuvarı ölçer. Gıda ve ilaçta bu ölçüm yasal zorunluluk; ölçülmeyen ürün satılamaz.',
      ),
      kart(
        'Kimyager bulur, mühendis büyütür',
        'Kimyager laboratuvarda tüp içinde yeni bir boya bulur; 10 gram. Kimya mühendisi aynı boyayı fabrikada 10 ton, ucuz ve güvenli üretmenin yolunu kurar. İkisini ayıran şey ölçek: tüp mü, fabrika mı?',
        undefined,
        { not: 'Soruda "üretim, verim, maliyet, tesis" geçiyorsa cevap kimya mühendisi; "sentez, keşif" geçiyorsa kimyager.' },
      ),
      kart(
        'Arıtma tesisi ve hava ölçümü kimyagerin işi',
        'Şehrin atık suyu denize dökülmeden önce arıtılır; arıtmanın işleyip işlemediğini kimyager ölçer. Havadaki kirlilik ölçümü de öyle. Belediyeler ve çevre laboratuvarları bu iş için kimyager alır.',
      ),
    ], [
      soru('Adli kimya, suç kanıtlarının çözümlenmesinde kimya bilgisini kullanır.', true, 'Kan, barut ve boya izlerinin analizi bu alanın işi.'),
      soru('Kimyager ile kimya mühendisinin işi tümüyle aynıdır.', false, 'Kimyager laboratuvarda bulur, mühendis fabrika ölçeğinde üretir.'),
      soru('İlaç geliştirme sürecinde kimyacılara ihtiyaç duyulmaz.', false, 'Molekülü tasarlayan ve ilk üreten kişi kimyager.'),
      soru('Kalite kontrol laboratuvarları kimya mezunlarının çalıştığı yerlerdendir.', true, 'Her partide etken maddenin tam olup olmadığı orada ölçülüyor.'),
      sikli('Olay yerindeki barut artığını kim çözümler?', ['Adli kimyager', 'Kimya mühendisi'], 0, 'Mahkemedeki delil bu analizden çıkar.'),
      sikli('Gıda ve ilaçta yasal olarak zorunlu iş hangisidir?', ['Kalite kontrol', 'Polimer üretimi'], 0, 'Her partinin standarda uyduğunu ölçer.'),
      soru('Eczacılık ve gıda mühendisliği kimya bilgisinin üstüne kurulu bölümlerdir.', true, 'Malzeme bilimi de öyle.'),
      soru('Hava kalitesi ölçümü kimyagerin işi değildir.', false, 'Çevre laboratuvarları ve belediyeler kimyager çalıştırır.'),
    ], [
      {
        soru: 'Tepkimeyi fabrika ölçeğinde ekonomik üretmek kimin işidir?',
        siklar: ['Kimya mühendisi', 'Kimyager'],
        dogru: 0,
        aciklama: {
          dogru: 'Kimyager tepkimeyi laboratuvarda bulur, mühendis onu büyük ölçekte ve ucuza üretir.',
          yanlis: 'Kimyager laboratuvar ölçeğinde çalışır. Fabrika ölçeği, verim ve maliyet kimya mühendisinin alanı.',
        },
        kart: 6,
      },
    ]),
    konu('kim9-atom-teori', 'Atom Teorileri ve Atomun Yapısı', [
      kart(
        'Atom modeli her yeni deneyle değişti',
        'Atomu kimse gözüyle görmedi. Bilim insanları deney yaptı, sonuca uyan bir resim çizdi. Yeni bir deney o resme uymayınca resim yenilendi. Bu resimlere atom modeli denir; beş model sırayla geldi.',
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
        'Dalton: atom içi dolu, bölünmez bir küre',
        'Bir bilyeyi düşün: içi dolu, kırılmaz, daha küçüğe bölünmez. Dalton 1803\'te atomu böyle tarif etti. Ona göre bir elementin bütün atomları birbirinin aynısı. İçinde parça olduğu henüz bilinmiyordu.',
      ),
      kart(
        'Thomson elektronu buldu: üzümlü kek',
        'Thomson atomdan eksi yüklü küçük parçacıklar kopardı; bunlara elektron dedi. Demek ki atom bölünüyordu. Modeli üzümlü kek gibi: artı yüklü bir hamur, içine gömülü eksi yüklü elektronlar.',
      ),
      kart(
        'Rutherford: atomun içi boş, ortası yoğun',
        'Rutherford ince altın levhaya küçük artı yüklü parçacıklar fırlattı. Çoğu levhayı delip geçti; birkaçı geri sekti. Demek ki atomun çoğu boşluk, kütlesi ortada küçük bir noktada. O noktaya çekirdek dedi.',
        undefined,
        { not: 'Parçacıkların "çoğu geçti" boşluğu, "birkaçı geri sekti" yoğun çekirdeği kanıtlar; iki sonucu ayrı ayrı bil.' },
      ),
      kart(
        'Bohr: elektron belirli katmanlarda döner',
        'Merdiven basamaklarını düşün: iki basamağın arasında duramazsın. Bohr\'a göre elektron da çekirdeğin çevresinde belirli katmanlarda döner. Her katmanın kendi enerjisi var; ara değer yok.',
      ),
      kart(
        'Elektron katman inerken ışık salar',
        'Havai fişek renklerini düşün; her renk bir element. Elektron enerji alınca üst katmana çıkar; buna soğurma denir. Aşağı inerken enerjiyi ışık olarak geri verir; buna salma denir. Her elementin ışığı kendine özgü.',
      ),
      kart(
        'Modern model: elektron bulut gibi',
        'Pervane dönerken kanadın tam nerede olduğunu göremezsin; bir bulanıklık görürsün. Modern modelde elektron da öyle: yeri kesin bilinmez, yalnızca en çok nerede bulunduğu bilinir. Yörünge yok, bulut var.',
      ),
      kart(
        'Proton ve nötron ortada, elektron çevrede',
        'Çekirdekte iki parçacık var: artı yüklü proton, yüksüz nötron. Eksi yüklü elektron çevrede dolaşır. Kütlenin neredeyse tamamı çekirdekte; elektron çok hafif. Ama atomun büyüklüğünü elektronların bulutu belirler.',
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
        'Proton sayısı elementin kimliğidir',
        '6 protonlu her atom karbondur; 7 protonlu her atom azottur. Proton sayısına atom numarası denir. Bir proton eklesen element değişir. Nötr atomda elektron sayısı proton sayısına eşittir: karbonda 6 ve 6.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Kütle numarası proton artı nötron',
        'Sodyumun 11 protonu, 12 nötronu var. Kütle numarası 11 + 12 = 23. Elektron çok hafif olduğu için toplama katılmaz. Nötron sayısını bulmak için kütle numarasından proton sayısını çıkar: 23 − 11 = 12.',
      ),
      kart(
        'Sembolde üst kütle, alt atom numarası',
        'Sodyum şöyle yazılır: sol üstte 23, sol altta 11, yanında Na. Üstteki büyük sayı kütle numarası, alttaki küçük sayı atom numarası. Üstteki hep büyük ya da eşit; karıştırırsan büyüğe bak.',
      ),
      kart(
        'İzotop: aynı proton, farklı nötron',
        'Karbonun iki çeşidi var: biri 6 nötronlu (C-12), biri 8 nötronlu (C-14). İkisi de karbon; proton sayısı 6. İzotop, yani proton sayısı aynı, nötron sayısı farklı atomlar. Kimyası aynı, kütlesi farklı.',
      ),
      kart(
        'İyonda yalnız elektron sayısı değişir',
        'Na atomu bir elektron verdi, Na⁺ oldu: 11 proton, 10 elektron. Cl atomu bir elektron aldı, Cl⁻ oldu: 17 proton, 18 elektron. Proton sayısı hiç değişmez. Katyonda yük kadar az, anyonda yük kadar fazla elektron var.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Rutherford un deneyi, atom kütlesinin büyük kısmının küçük bir çekirdekte toplandığını gösterdi.', true, 'Parçacıkların çok azının geri sekmesi bunun kanıtıydı.'),
      soru('İzotop atomların proton sayıları farklıdır.', false, 'Proton sayıları aynı, nötron sayıları farklıdır; proton değişseydi element değişirdi.'),
      soru('Bir elementin kimliğini kütle numarası belirler.', false, 'Kimliği atom numarası, yani proton sayısı belirler.'),
      soru('Elektron üst enerji seviyesinden alt seviyeye inerken ışık yayar.', true, 'Aradaki enerji farkı ışık olarak salınıyor.'),
      sikli('"Üzümlü kek" modelini kuran kimdir?', ['Dalton', 'Thomson'], 1, 'Dalton içi dolu bölünmez küre dedi.'),
      sikli('Elektronun belirli enerjili katmanlarda döndüğünü söyleyen model?', ['Modern atom teorisi', 'Bohr'], 1, 'Modern modelde yörünge değil bulut var.'),
      sikli('Atomun kimliğini ne belirler?', ['Nötron sayısı', 'Proton sayısı'], 1, 'Proton değişirse element değişir.'),
      sikli('Proton sayısı aynı, nötron sayısı farklı atomlar?', ['İyon', 'İzotop'], 1, 'Kimyası aynı, kütlesi farklı.'),
      sikli('Elektron üst katmana çıkarken ne olur?', ['Enerji soğurur', 'Enerji salar'], 0, 'İnerken salar; ışık o zaman çıkar.'),
      sikli('Cl⁻ iyonunda kaç elektron vardır? (Cl: 17)', ['18', '16'], 0, 'Anyonda yük kadar fazla.'),
      sikli('Kütlenin neredeyse tamamı nerededir?', ['Çekirdekte', 'Elektron bulutunda'], 0, 'Büyüklüğü elektronlar belirler.'),
      soru('Elektronun kütlesi kütle numarasına katılır.', false, 'Çok küçük; kütle numarası proton + nötron.'),
      soru('Her elementin saldığı ışık çizgileri kendine özgüdür.', true, 'Parmak izi gibi; havai fişek renkleri bundan.'),
      soru('Na⁺ iyonunda 11 proton ve 10 elektron vardır.', true, 'Bir elektron verdi; proton sayısı değişmedi.'),
    ], [
      {
        soru: 'Rutherford\'un altın levha deneyi neyi gösterdi?',
        siklar: ['Atomun çoğu boşluk, kütle küçük çekirdekte', 'Elektronlar sabit yörüngelerde döner'],
        dogru: 0,
        aciklama: {
          dogru: 'Parçacıkların çoğu levhayı geçti, birkaçı geri sekti: içi boş, ortası yoğun.',
          yanlis: 'Yörünge fikri Bohr\'un. Rutherford deneyinde parçacıkların çoğunun geçmesi atomun içinin boş, kütlenin çekirdekte olduğunu gösterdi.',
        },
        kart: 4,
      },
      {
        soru: 'Kütle numarası 23, atom numarası 11 olan atomun nötron sayısı?',
        siklar: ['12', '23'],
        dogru: 0,
        aciklama: {
          dogru: 'Nötron = kütle numarası − proton = 23 − 11 = 12.',
          yanlis: '23 kütle numarası, yani proton + nötron toplamı. Nötron için proton sayısını çıkar: 23 − 11 = 12.',
        },
        kart: 10,
      },
    ]),
    konu('kim9-orbital', 'Atom Orbitalleri ve Elektron Dizilimi', [
      kart(
        'Orbital, elektronun en çok bulunduğu bölge',
        'Odada uçan sineğin yerini tam bilemezsin ama "çoğunlukla lambanın çevresinde" dersin. Orbital de bu: elektronun en çok bulunduğu bölge. s orbitali küre, p orbitali iki balon gibi. Kesin bir yol değil.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        's bir, p üç, d beş orbital taşır',
        'Her orbitale en çok 2 elektron sığar. s alt katmanında 1 orbital var: 2 elektron. p\'de 3 orbital: 6 elektron. d\'de 5: 10. f\'de 7: 14. Orbital sayısını ikiyle çarp, elektron sayısını bul.',
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
        'Her katman en çok 2n² elektron alır',
        '1. katman: 2·1² = 2 elektron. 2. katman: 2·2² = 8. 3. katman: 2·3² = 18. Katman, yani çekirdeğe aynı uzaklıktaki orbitallerin tümü. n katman numarası; büyüdükçe katman genişler, daha çok elektron sığar.',
      ),
      kart(
        'Elektron önce en düşük enerjili yere girer',
        'Otobüste boş koltuk varken kimse ayakta durmaz. Elektron da önce en düşük enerjili orbitale oturur. Sıra: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p. Buna Aufbau ilkesi denir; Almanca "inşa etmek" demek.',
      ),
      kart(
        '4s, 3d\'den önce dolar',
        'Sıraya bak: 3p\'den sonra 3d değil, 4s geliyor. Çünkü doldurma sırasını katman numarası değil enerji belirler. 4s orbitalinin enerjisi 3d\'den düşük; o yüzden önce dolar. K (19): ... 3p⁶ 4s¹, 3d¹ değil.',
        undefined,
        { etiket: 'Sık hata', not: '18 elektrondan sonra 3d\'ye geçme; 19. ve 20. elektron 4s\'ye gider, 3d ondan sonra dolar.' },
      ),
      kart(
        'Bir orbitale en çok iki elektron sığar',
        'Bir orbitalde üçüncü elektrona yer yok. İkisinin de dönüşü, yani spini zıt olmalı: biri ↑, öteki ↓. Buna Pauli ilkesi denir. Aynı orbitalde aynı spinli iki elektron olamaz.',
      ),
      kart(
        'Eş orbitallere önce birer birer gir',
        'Otobüste üç boş ikili koltuk var; üç kişi girince her biri ayrı koltuğa oturur. Elektron da öyle: p\'nin üç orbitaline önce birer birer, aynı spinle girer. Hepsi bir tane alınca eşleşme başlar. Buna Hund kuralı denir.',
      ),
      kart(
        'Na ve Cl dizilimi',
        'Na (11 elektron): 1s² 2s² 2p⁶ 3s¹. Toplam 2+2+6+1 = 11. Cl (17): 1s² 2s² 2p⁶ 3s² 3p⁵. Üstteki küçük sayılar elektron sayısı. Son katmanda Na\'da 1, Cl\'de 2+5 = 7 elektron var.',
        undefined,
        { etiket: 'Örnek' },
      ),
      kart(
        'Soy gazı köşeli ayraçla kısalt',
        'Cl\'nin 1s² 2s² 2p⁶ kısmı, 10 elektronlu neonun dizilimiyle aynı. Onu [Ne] diye yaz: Cl için [Ne] 3s² 3p⁵. Ca (20) için [Ar] 4s². Bir önceki soy gazı ayraca al, kalanı yaz. Sınavda zaman kazandırır.',
      ),
      kart(
        'En dıştaki elektronlar bağ kurar',
        'Na\'nın 11 elektronu var ama bağ kurarken yalnız en dıştaki 1 tanesi iş görür. En dış katmandaki elektronlara valans elektron denir. Elementin kimyasal davranışını pratikte yalnız bunlar belirler.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yarı dolu ve tam dolu alt katman kararlı',
        'Cr (24) beklenen 4s² 3d⁴ yerine 4s¹ 3d⁵ diziliyor. Çünkü d⁵ (yarı dolu) ve d¹⁰ (tam dolu) atoma ek kararlılık verir. Buna küresel simetri denir. Cu (29) da aynı sebeple 4s¹ 3d¹⁰. p³ ve p⁶ da küresel simetrik.',
      ),
    ], [
      soru('Aufbau ilkesine göre elektronlar önce en düşük enerjili orbitali doldurur.', true, 'Sistem en kararlı, yani en düşük enerjili düzeni seçiyor.'),
      soru('Aynı orbitaldeki iki elektronun spinleri aynı yöndedir.', false, 'Pauli ilkesi zıt spin şartı koyuyor.'),
      soru('4s orbitalinin enerjisi 3d den düşük olduğu için önce dolar.', true, 'Doldurma sırasını katman numarası değil enerji belirliyor.'),
      soru('Hund kuralına göre eş enerjili orbitallere elektronlar önce çiftler hâlinde yerleşir.', false, 'Önce her orbitale birer elektron girer, ancak hepsi dolunca eşleşme başlar.'),
      sikli('Bir orbital en fazla kaç elektron alır?', ['2', '8'], 0, 'Pauli: iki elektron, zıt spin.'),
      sikli('2. katman en fazla kaç elektron alır?', ['8', '18'], 0, '2n² = 8.'),
      sikli('p alt katmanı en fazla kaç elektron alır?', ['6', '10'], 0, 's 2, p 6, d 10, f 14.'),
      sikli('Na (11) için kısaltılmış dizilim?', ['[Ne] 3s¹', '[He] 3s¹'], 0, 'Bir önceki soy gaz Ne.'),
      sikli('Kimyasal davranışı pratikte belirleyen elektronlar?', ['İç katman elektronları', 'Valans (en dış) elektronlar'], 1, 'En dıştakiler bağ kurar.'),
      sikli('Cr ve Cu\'nun diziliminin şaşırtmasının sebebi?', ['Pauli ilkesi', 'Küresel simetri'], 1, 'Yarı ya da tam dolu alt katman ek kararlılık verir.'),
      soru('Cl (17) atomunun son katmanında 7 elektron vardır.', true, '3s² 3p⁵: 2 + 5 = 7.'),
      soru('Elektronlar önce en yüksek enerjili orbitale yerleşir.', false, 'Aufbau: en düşükten başlar.'),
    ], [
      {
        soru: '3d orbitalinden önce hangi orbital dolar?',
        siklar: ['4s', '4p'],
        dogru: 0,
        aciklama: {
          dogru: 'Sıralamayı enerji belirler; 4s\'nin enerjisi 3d\'den düşük, önce o dolar.',
          yanlis: '4p, 3d\'den sonra gelir. Sıra 3p → 4s → 3d → 4p; katman numarası değil enerji belirleyici.',
        },
        kart: 5,
      },
      {
        soru: 'Hund kuralına göre eş enerjili orbitallere elektron nasıl yerleşir?',
        siklar: ['Önce birer birer, aynı spinle', 'Önce bir orbital dolar, sonra ötekiler'],
        dogru: 0,
        aciklama: {
          dogru: 'Elektronlar itişmeyi azaltmak için önce ayrı orbitallere dağılır, sonra eşleşir.',
          yanlis: 'Bir orbitali doldurup ötekine geçmek Hund\'a aykırı. Eş enerjili orbitaller önce tek tek, aynı spinle dolar.',
        },
        kart: 7,
      },
    ]),
    konu('kim9-periyodik-yer', 'Periyodik Tabloda Yer Bulma', [
      kart(
        'Periyot yatay sıra, grup dikey sütun',
        'Periyodik tabloya bak: yatay 7 sıra, dikey 18 sütun var. Yatay sıraya periyot, dikey sütuna grup denir. Aynı gruptaki elementler benzer davranır; Li, Na ve K hep suyla şiddetle tepkir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Katman sayısı periyodu verir',
        'Na: 1s² 2s² 2p⁶ 3s¹. Elektronu olan en yüksek katman 3; Na 3. periyotta. Li: 1s² 2s¹, en yüksek katman 2; 2. periyotta. Kural: dizilimdeki en büyük katman numarası periyot numarasıdır.',
      ),
      kart(
        'Son katmandaki elektron sayısı grubu verir',
        'Cl: ... 3s² 3p⁵. Son katman 3; oradaki elektronlar 2 + 5 = 7. Cl 7A grubunda, yani 17. grupta. Kural: s ve p bloğunda son katmandaki elektron sayısı A grup numarasıdır. 1A ile 8A arası.',
      ),
      kart(
        'Son elektronun orbitali bloğu söyler',
        'Na\'nın son elektronu 3s\'ye girdi: s bloğu. Cl\'ninki 3p\'ye: p bloğu. s ve p bloğu A gruplarını, yani baş grupları oluşturur. Son elektronu d\'ye girenler d bloğu, geçiş metalleri. f bloğu tablonun altındaki iki sıra.',
      ),
      kart(
        'Dört grubun özel adı var',
        '1A grubu (Li, Na, K) alkali metaller; suyla patlarcasına tepkir. 2A toprak alkali metaller (Mg, Ca). 7A halojenler (F, Cl, Br); tuz yapıcı demek. 8A soy gazlar (He, Ne, Ar); hiçbir şeyle tepkimeye girmez.',
      ),
      kart(
        'Üç örnekle yer bul',
        'Ca (20): [Ar] 4s² → en yüksek katman 4, son katmanda 2 elektron: 4. periyot, 2A. Al (13): [Ne] 3s² 3p¹ → 3. periyot, 2+1 = 3A. Ar (18): ... 3s² 3p⁶ → 3. periyot, 8A, soy gaz.',
        undefined,
        { etiket: 'Örnek', not: 'Yer bulurken iki şeyi ayır: en büyük katman numarası periyot, o katmandaki elektron toplamı grup.' },
      ),
      kart(
        'Metaller solda, ametaller sağda',
        'Tablonun solunda ve ortasında metaller var: demir, bakır, sodyum. Sağ üstte ametaller: oksijen, klor, azot. İkisinin arasında merdiven gibi bir çizgi var; oradakiler yarı metal (Si, Ge). Yarı metal bazen iletir, bazen iletmez.',
      ),
      kart(
        'Atom soy gaza benzemek ister',
        'Soy gazların son katmanı dolu (8 elektron); o yüzden kararlı. Öteki atomlar da böyle olmak ister. Na son katmanındaki 1 elektronu verip Ne gibi olur. Cl bir elektron alıp Ar gibi olur. Metal verir, ametal alır.',
      ),
      kart(
        'Elektron veren katyon, alan anyon olur',
        'Na bir elektron verdi: 11 proton, 10 elektron. Artı yük fazla; Na⁺ oldu. Artı yüklü iyona katyon denir. Cl bir elektron aldı: 17 proton, 18 elektron; Cl⁻ oldu. Eksi yüklü iyona anyon denir. Proton sayısı değişmez.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Grup numarası iyon yükünü söyler',
        'Na 1A: 1 elektron verir, +1 olur. Mg 2A: +2. Al 3A: +3. Sağ tarafta ters: O 6A, 8\'e 2 eksik; 2 alır, −2 olur. Cl 7A: −1. Ortadaki 4A (C, Si) ne verir ne alır; elektron paylaşır.',
      ),
      kart(
        'İzoelektronik: elektron sayısı aynı',
        'Na⁺: 10 elektron. Ne: 10 elektron. F⁻: 10 elektron. Üçünün dizilimi aynı: 1s² 2s² 2p⁶. Elektron sayısı ve dizilimi aynı olan taneciklere izoelektronik denir. Proton sayıları farklı; o yüzden farklı tanecikler.',
      ),
      kart(
        'Geçiş metalleri birden çok yük alır',
        'Demir bazen Fe²⁺, bazen Fe³⁺ olur. Bakır Cu⁺ ya da Cu²⁺. Bunlar d bloğu, yani 3–12. gruplardaki geçiş metalleri. Yükleri tek değil; o yüzden adlarında Roma rakamı yazılır: demir(II), demir(III).',
      ),
    ], [
      soru('Periyot numarası, atomun elektron bulunan en yüksek enerji seviyesini verir.', true, 'Yatay sıralar bu seviyeye göre kuruluyor.'),
      soru('Aynı gruptaki elementlerin değerlik elektron sayıları aynıdır.', true, 'Benzer kimyasal davranışlarının sebebi bu.'),
      soru('Metaller elektron alarak negatif yüklü iyon oluşturur.', false, 'Metaller elektron verir ve pozitif iyon (katyon) olur.'),
      soru('Periyodik tablonun 1A grubuna soy gazlar denir.', false, '1A alkali metaller; soy gazlar 8A grubunda.'),
      sikli('Dizilimi 3s² 3p⁵ ile biten element hangi gruptadır?', ['7A (17)', '5A'], 0, '3s ve 3p\'deki elektronlar toplanır: 7.'),
      sikli('Ca (20) hangi periyottadır?', ['4', '2'], 0, '[Ar] 4s²; en yüksek katman 4.'),
      sikli('1A grubunun adı nedir?', ['Alkali metaller', 'Halojenler'], 0, 'Halojenler 17. grup.'),
      sikli('2A grubu elementi kaç yüklü iyon yapar?', ['+2', '−2'], 0, 'Grup numarası yükü söyler.'),
      sikli('Na⁺, Ne ve F⁻ için ne söylenir?', ['İzotop', 'İzoelektronik'], 1, 'Üçünde de 10 elektron.'),
      sikli('Metaller tabloda nerededir?', ['Sağda', 'Solda'], 1, 'Ametaller sağda, yarı metaller merdivende.'),
      sikli('d bloğu hangi grupları kapsar?', ['1–2', '3–12'], 1, 'Geçiş metalleri.'),
      soru('İyon oluşurken proton sayısı değişir.', false, 'Yalnızca elektron sayısı değişir.'),
      soru('Ametaller elektron alarak en yakın soy gaza benzer.', true, 'Metaller vererek benzer.'),
    ], [
      {
        soru: 'Elektron dizilimi 2s² 2p⁴ ile biten element hangi periyottadır?',
        siklar: ['2. periyot', '6. periyot'],
        dogru: 0,
        aciklama: {
          dogru: 'En yüksek katman numarası 2, periyot 2. Grup için elektronları topla: 6A.',
          yanlis: '6, son katmandaki elektron sayısı, yani grup. Periyodu en yüksek katman numarası verir: 2.',
        },
        kart: 3,
      },
      {
        soru: 'Elektron veren atom ne olur?',
        siklar: ['Katyon (+)', 'Anyon (−)'],
        dogru: 0,
        aciklama: {
          dogru: 'Negatif yük gitti, proton fazlası kaldı; yük pozitif.',
          yanlis: 'Anyon elektron alan atom. Elektron veren atomda proton sayısı elektronu geçer ve yük pozitif olur.',
        },
        kart: 9,
      },
    ]),
    konu('kim9-periyodik-ozellik', 'Periyodik Özellikler', [
      kart(
        'Sağa gittikçe atom küçülür',
        '2. periyotta Li büyük, F küçük. İkisinin de elektronları 2 katmanda; ama F\'nin çekirdeğinde 9 proton var, Li\'ninkinde 3. Daha çok proton elektronları daha güçlü çeker; atom büzülür. Aynı periyotta sağa doğru yarıçap azalır.',
      ),
      kart(
        'Aşağı indikçe atom büyür',
        'Li\'nin 2 katmanı var, Na\'nın 3, K\'nin 4. Her katman bir kat daha dışarıda; atom büyür. Aynı grupta aşağı indikçe yarıçap artar. En büyük atomlar sol altta, en küçükler sağ üstte.',
      ),
      kart(
        'Çekirdek çeker, iç katmanlar perdeler',
        'Dış elektronu iki şey etkiler. Çekirdekteki protonlar onu içeri çeker. Aradaki iç katmanlar ise çekimi keser; buna perdeleme denir. Sağa gidince çekim artar, katman aynı: küçülür. Aşağı inince katman eklenir: büyür.',
        undefined,
        { not: 'Dört eğilimin yönünü ezberlemek yerine hep bu iki şeyi sor: proton arttı mı, katman eklendi mi?' },
      ),
      kart(
        'İyonlaşma enerjisi: elektron koparma bedeli',
        'Na\'dan bir elektron koparmak kolay; dış elektron uzak ve zayıf çekiliyor. F\'den koparmak zor; çekirdek onu sıkı tutuyor. Gaz hâlindeki atomdan bir elektron koparmak için gereken enerjiye iyonlaşma enerjisi denir. Sağa artar, aşağı azalır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İkinci elektronu koparmak daha zordur',
        'Mg\'den ilk elektronu kopardın; atom artık Mg⁺, artı yüklü. Eksi yüklü elektronu artı iyondan koparmak daha zor. Üçüncü elektronda enerji birden fırlar; çünkü değerlik elektronları bitti, dolu katmana giriyorsun.',
      ),
      kart(
        'Elektronegatiflik: elektronu çekme gücü',
        'H ile F bağ kurdu; ortak elektronu F kendine daha çok çeker. Bu çekme gücüne elektronegatiflik denir. En yüksek F, en düşük Fr. Sağa artar, aşağı azalır. Soy gazlar bağ kurmadığı için onlara değer verilmez.',
      ),
      kart(
        'Katyon atomundan küçük, anyon büyüktür',
        'Na elektron verince Na⁺ oldu; son katmanı boşaldı, atom küçüldü. Cl elektron alınca Cl⁻ oldu; fazla elektron ötekileri itti, atom büyüdü. Kural: katyon kendi atomundan küçük, anyon büyük.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Metalik karakter sol altta en yüksek',
        'Metal, elektronunu kolay veren atom demek. Fr sol altta; elektronu uzak ve zayıf tutuluyor, en kolay verir. En metalik o. F sağ üstte; elektron vermek yerine alır, en ametalik o. Metalik özellik sağa azalır, aşağı artar.',
      ),
      kart(
        'Elektron ilgisi: elektron alınca çıkan ısı',
        'Cl bir elektron aldığında enerji açığa çıkar; çünkü Cl elektronu çok ister. Bu enerjiye elektron ilgisi denir. Halojenlerde en yüksek. Soy gazlar elektron almaz; onlarda anlamlı değil.',
      ),
      kart(
        'Dört eğilim tek tabloda',
        'Yarıçap ve metalik özellik aynı yönde: sağa azalır, aşağı artar. İyonlaşma enerjisi ve elektronegatiflik ters yönde: sağa artar, aşağı azalır. Hepsinin sebebi aynı: çekirdek çekimi ve perdeleme.',
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
      sikli('Elektronegatifliği en yüksek element?', ['Fransiyum', 'Flor'], 1, 'Fransiyum en düşük.'),
      sikli('Aynı grupta aşağı inildikçe iyonlaşma enerjisi?', ['Artar', 'Azalır'], 1, 'Katman arttıkça elektron uzaklaşır.'),
      sikli('Katyon kendi atomundan nasıldır?', ['Büyük', 'Küçük'], 1, 'Katman kaybeder; anyon büyür.'),
      sikli('En metalik element tabloda nerededir?', ['Sağ üst (F)', 'Sol alt (Fr)'], 1, 'Sağ üst en ametalik.'),
      sikli('Halojenlerde en yüksek olan özellik?', ['Elektron ilgisi', 'Metalik karakter'], 0, 'Elektron almaya en istekli grup.'),
      soru('İkinci iyonlaşma enerjisi her zaman birinciden büyüktür.', true, 'Artı iyondan elektron koparmak daha zor.'),
      soru('Soy gazlara elektronegatiflik değeri genelde verilmez.', true, 'Bağ kurmazlar.'),
    ], [
      {
        soru: 'Aynı periyotta soldan sağa gidildikçe atom yarıçapı?',
        siklar: ['Küçülür', 'Büyür'],
        dogru: 0,
        aciklama: {
          dogru: 'Çekirdek yükü artıyor, elektronlar aynı katmanda daha güçlü çekiliyor.',
          yanlis: 'Büyüme aşağı doğru olur (katman eklenir). Soldan sağa katman aynı, çekirdek yükü artar; yarıçap küçülür.',
        },
        kart: 1,
      },
    ]),
  ]),
  tema('kim9-t2', 'Çeşitlilik', [
    konu('kim9-metalik', 'Metalik Bağ', [
      kart(
        'Metal atomları elektronlarını havuza bırakır',
        'Bir demir parçasında milyarlarca demir atomu var. Her biri dış elektronlarını ortaya bırakır; elektronlar hiçbir atoma ait olmadan aralarda dolaşır. Buna elektron denizi denir. Artı iyonlar bu denizde durur; çekim onları bir arada tutar.',
        undefined,
        { etiket: 'Tanım', not: 'Metalin dört özelliği (iletir, dövülür, parlar, erimesi zor) hep bu denize dayanır; önce bu resmi otur.' },
      ),
      kart(
        'Serbest elektron akımı taşır',
        'Kablonun bir ucuna pil bağla; öteki uçta lamba yanar. Çünkü bakırın elektron denizi serbest: elektronlar bir uçtan girip öteki uçtan çıkar. Aynı elektronlar ısıyı da taşır; kaşık çayda hemen ısınır.',
      ),
      kart(
        'Metal kırılmaz, şekil alır',
        'Demirciye bak: kızgın demire çekiçle vurur, demir ezilir ama kırılmaz. Atom katmanları kayar; elektron denizi yeni düzeni hemen sarar, bağ kopmaz. Bu yüzden metal dövülür, tel ve levha yapılır.',
      ),
      kart(
        'Metal parlar, çünkü ışığı geri verir',
        'Aynanın arkasındaki gümüş tabaka ışığı yansıtır. Serbest elektronlar gelen ışığı yakalar ve hemen geri salar. Metal bu yüzden parlak görünür. Yüzey paslanınca elektronlar örtülür ve parlaklık gider.',
      ),
      kart(
        'Daha çok elektron, daha güçlü bağ',
        'Na 98 °C\'de erir, Mg 650 °C\'de, Al 660 °C\'de. Na denize 1 elektron bırakır, Mg 2, Al 3. Elektron arttıkça çekim büyür, bağ güçlenir, erime zorlaşır. Atom küçüldükçe de bağ güçlenir.',
      ),
      kart(
        'Alaşım: iki metal aynı denizi paylaşır',
        'Bakırın içine biraz çinko kat; pirinç çıkar. Demire karbon kat; çelik çıkar. Metaller birbirinin elektron denizine kolay karışır. Alaşım, yani bir metalin başka elementle karışımı. Alaşım çoğu zaman saf metalden sert.',
      ),
    ], [
      soru('Metallerin elektriği iletmesi, serbestçe hareket eden değerlik elektronlarındandır.', true, 'Elektron denizi modeli bunu anlatıyor.'),
      soru('Metaller darbe aldığında iyonik katılar gibi kırılır.', false, 'Elektron denizi katmanların kaymasına izin verdiği için metal şekil değiştirir.'),
      soru('Metalik bağ güçlendikçe erime noktası yükselir.', true, 'Taneciği ayırmak için daha çok enerji gerekiyor.'),
      soru('Metallerin parlaklığı yüzeydeki oksit tabakasından gelir.', false, 'Serbest elektronların ışığı yansıtmasından gelir; oksit tabakası tersine matlaştırır.'),
      sikli('Metalin parlak görünmesinin sebebi?', ['Serbest elektronların ışığı geri salması', 'Yüzeyinin pürüzsüz olması'], 0, 'Elektron denizi ışığı yakalayıp geri verir.'),
      sikli('Metallerin tel çekilebilmesinin sebebi?', ['Katmanlar kayınca bağ kopmaz', 'İyonlar birbirini iter'], 0, 'Elektron denizi yeni düzeni sarar.'),
      soru('Valans elektron sayısı arttıkça metalik bağ güçlenir.', true, 'Na 1, Mg 2, Al 3 elektron; erime noktası da bu sırayla yükselir.'),
    ], [
      {
        soru: 'Metallerin elektriği iletmesinin sebebi nedir?',
        siklar: ['Sabit iyon örgüsü', 'Serbest elektronlar'],
        dogru: 1,
        aciklama: {
          dogru: 'Elektron denizindeki elektronlar yükü taşır.',
          yanlis: 'Sabit iyon örgüsü iyonik katıya ait ve iletmez. Metali ilettiren, atomlar arasında serbestçe dolaşan elektronlar.',
        },
        kart: 2,
      },
    ]),
    konu('kim9-iyonik', 'İyonik Bağ', [
      kart(
        'Metal verir, ametal alır, zıt yükler çeker',
        'Na son katmandaki tek elektronu Cl\'ye verir. Na artık Na⁺, Cl artık Cl⁻. Artı ile eksi birbirini çeker; bu çekime iyonik bağ denir. Sofra tuzu böyle oluşur. İyonik bağ hep metal ile ametal arasında.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yükleri çaprazla, formülü bul',
        'Al³⁺ ile O²⁻ birleşecek. Yükleri çaprazla: Al\'ın altına 2, O\'nun altına 3 → Al₂O₃. Kontrol: 2·(+3) + 3·(−2) = 0. Toplam yük hep sıfır olmalı. Mg²⁺ ile O²⁻: Mg₂O₂ çıkar; sadeleştir, MgO.',
        undefined,
        { etiket: 'Sık hata', not: 'Çaprazladıktan sonra iki şeyi kontrol et: toplam yük sıfır mı, sayılar sadeleşiyor mu?' },
      ),
      kart(
        'İyonik bileşikte molekül yok, örgü var',
        'Bir tuz tanesinde tek bir NaCl molekülü aramak boşuna. Milyarlarca Na⁺ ve Cl⁻ sırayla dizilip üç boyutlu bir kafes kurar; buna kristal örgü denir. NaCl formülü yalnızca oranı söyler: her Na\'ya bir Cl.',
      ),
      kart(
        'Sert ama kırılgan',
        'Tuz kristali serttir; parmakla ezemezsin. Ama çekiçle vurunca paramparça olur. Vurunca katmanlar kayar, artı iyon artının karşısına gelir. Aynı yükler birbirini iter, kristal çatlar. Metal gibi ezilmez, kırılır.',
      ),
      kart(
        'Erimesi zor: 801 °C',
        'Tuzu tavada ısıt; erimez. Sofra tuzu 801 °C\'de erir. Çünkü örgüde her iyon çevresindeki altı zıt iyona bağlı. Hepsini birden koparmak gerekir; çok enerji ister. İyonik bileşiklerin erime noktası yüksek.',
      ),
      kart(
        'Katıyken iletmez, eriyince iletir',
        'Katı tuz elektriği iletmez; iyonlar örgüde kilitli, kıpırdayamaz. Tuzu erit ya da suda çöz: iyonlar serbest kalır, akımı taşır. Akım için yük taşıyan tanecik hareket etmeli. İyon var ama hareketsizse iletim yok.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Su iyonları örgüden koparır',
        'Tuzu suya at, kaybolur. Su molekülünün bir ucu artı, öteki ucu eksi; yani polar. Eksi ucu Na⁺\'yı, artı ucu Cl⁻\'yi sarar ve örgüden çeker. Çözelti iyon içerir; bu yüzden tuzlu su elektriği iletir.',
      ),
    ], [
      soru('İyonik bağ, metal ile ametal arasında elektron aktarımıyla oluşur.', true, 'Metal verir, ametal alır; zıt yüklü iyonlar birbirini çeker.'),
      soru('İyonik katılar katı hâlde elektriği iyi iletir.', false, 'İyonlar örgüde sabit; iletim ancak erimiş hâlde ya da sulu çözeltide olur.'),
      soru('İyonik bileşikler hem sert hem kırılgandır.', true, 'Örgü kayınca aynı yüklü iyonlar karşılaşıyor ve kristal çatlıyor.'),
      soru('İyonik bileşiklerin erime noktaları düşüktür.', false, 'Örgüdeki çekim güçlü olduğu için erime noktaları yüksektir.'),
      sikli('Al³⁺ ile O²⁻ hangi formülü verir?', ['AlO', 'Al₂O₃'], 1, 'Yükler çaprazlanır.'),
      sikli('NaCl formülü ne söyler?', ['Bir molekülün yapısını', 'İyonların oranını'], 1, 'İyonik bileşikte molekül yok, örgü var.'),
      sikli('Sofra tuzu hangi durumda elektriği iletir?', ['Katı', 'Eriyik ya da çözelti'], 1, 'İyonlar serbest olmalı.'),
      soru('Tuzlu suyun elektriği iletmesinin sebebi serbest iyonlardır.', true, 'Su iyonları örgüden koparır; iyonlar akımı taşır.'),
      soru('Mg²⁺ ile O²⁻ birleşince Mg₂O₂ oluşur.', false, 'Oran sadeleşir: MgO.'),
    ], [
      {
        soru: 'Katı sofra tuzu elektriği iletir mi?',
        siklar: ['Hayır, iyonlar sabit', 'Evet, iyon içeriyor'],
        dogru: 0,
        aciklama: {
          dogru: 'İyon var ama örgüde kilitli; yük taşıyan hareketli tanecik yok. Eriyince ya da suda iletir.',
          yanlis: 'İyon içermek yetmez, iyonların hareket etmesi gerekir. Katıda örgü sabittir; iletim ancak eriyik ya da çözeltide.',
        },
        kart: 6,
      },
    ]),
    konu('kim9-kovalent', 'Kovalent Bağ', [
      kart(
        'İki ametal elektronu paylaşır',
        'İki H atomu düşün; ikisi de elektron almak istiyor, ikisi de vermek istemiyor. Çözüm: elektronlarını ortak kullanırlar. Buna kovalent bağ denir. Alışveriş yok, paylaşım var; o yüzden iyon oluşmaz. Ametal-ametal arasında.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Eksik elektron kadar bağ kurar',
        'Oksijenin son katmanında 6 elektron var; 8 için 2 eksik. 2 bağ kurar: H₂O. Azotta 5 var, 3 eksik: NH₃. Karbonda 4 var, 4 eksik: CH₄. Hidrojen 1 eksik: hep 1 bağ. Kural: 8\'e kaç eksikse o kadar bağ.',
      ),
      kart(
        'Farklı atomlar eşit paylaşmaz: polar',
        'HCl\'de elektron ortak ama Cl onu daha güçlü çeker; elektron Cl\'ye daha yakın durur. Cl ucu biraz eksi, H ucu biraz artı olur. Buna polar kovalent bağ denir. Farklı iki ametal arasındaki bağ polar.',
      ),
      kart(
        'Aynı atomlar eşit paylaşır: apolar',
        'H₂\'de iki H aynı güçle çeker; elektron tam ortada durur. Uçlarda yük farkı yok. Buna apolar kovalent bağ denir. O₂, N₂, Cl₂ hep apolar. Kural: aynı iki atom apolar, farklı iki atom polar.',
      ),
      kart(
        'Bir, iki ya da üç çift paylaşılır',
        'H₂\'de bir çift elektron paylaşılır: tekli bağ (H−H). O₂\'de iki çift: ikili bağ (O=O). N₂\'de üç çift: üçlü bağ (N≡N). Bağ sayısı arttıkça atomlar yaklaşır ve bağ güçlenir. N₂ bu yüzden çok zor tepkimeye girer.',
      ),
      kart(
        'Bağ türünü metal-ametal sorusu belirler',
        'İki maddenin bağını soruyorlar. Önce sor: metal mi, ametal mi? Metal ile ametal iyonik, ametal ile ametal kovalent, metal ile metal metalik. NaCl iyonik, HCl kovalent, Cu-Zn metalik.',
        {
          tur: 'tablo',
          basliklar: ['Atomlar', 'Bağ', 'Örnek'],
          satirlar: [
            ['Metal + ametal', 'İyonik', 'NaCl'],
            ['Ametal + ametal', 'Kovalent', 'HCl'],
            ['Metal + metal', 'Metalik', 'Cu-Zn'],
          ],
        },
        { not: 'Bağ sorusunda ilk iş: tabloda ikisi de sağda mı (kovalent), biri solda biri sağda mı (iyonik)?' },
      ),
      kart(
        'Katlı bağı koparmak daha çok enerji ister',
        'C−C bağını koparmak 347 kJ ister, C=C 614, C≡C 839. Bağı koparmak için gereken enerjiye bağ enerjisi denir. Bağ ne kadar kısa ve katlıysa enerji o kadar büyük. Sıra: üçlü > ikili > tekli.',
      ),
    ], [
      soru('Kovalent bağda elektronlar ortaklaşa kullanılır.', true, 'Ametaller elektron almak istediği için aktarım yerine ortaklık kuruluyor.'),
      soru('İki farklı ametal arasında oluşan bağ polar kovalenttir.', true, 'Elektronegatiflik farkı elektronları bir tarafa yaklaştırıyor.'),
      soru('H₂ molekülündeki bağ polar kovalenttir.', false, 'Aynı iki atom eşit çeker; bağ apolar.'),
      soru('Kovalent bağ yalnızca metal atomları arasında oluşur.', false, 'Ametaller arasında oluşur; metaller arasındaki bağ metalik bağdır.'),
      sikli('Karbon atomu kaç kovalent bağ kurar?', ['2', '4'], 1, '8\'e 4 elektron eksik: CH₄.'),
      sikli('H₂ molekülündeki bağ türü?', ['Polar kovalent', 'Apolar kovalent'], 1, 'Aynı atomlar, eşit paylaşım.'),
      sikli('En güçlü bağ hangisidir?', ['C−C', 'C≡C'], 1, 'Katlı bağ kısa ve güçlü.'),
      soru('N₂ molekülünün üçlü bağı kolay kopar.', false, 'Çok zor kopar; azot gazı bu yüzden tepkimeye isteksiz.'),
      soru('Su molekülünde oksijen iki bağ kurar.', true, 'O\'nun 8\'e 2 elektronu eksik.'),
    ], [
      {
        soru: 'HCl molekülündeki bağ hangi türdür?',
        siklar: ['İyonik', 'Polar kovalent'],
        dogru: 1,
        aciklama: {
          dogru: 'İki ametal elektron paylaşıyor; Cl daha güçlü çektiği için paylaşım eşit değil.',
          yanlis: 'İyonik bağ metal ile ametal arasında olur. H ve Cl ikisi de ametal, elektron paylaşırlar; Cl daha güçlü çektiği için bağ polar.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-lewis', 'Lewis Nokta Yapısı', [
      kart(
        'Lewis yapısı dış elektronları nokta yapar',
        'Bir atomu çizmek için bütün elektronlarını çizmen gerekmez; bağ kuranlar zaten en dıştakiler. Lewis yapısı, yani sembolün çevresine valans elektronlarını nokta olarak koyan şema. Ortak çiftler çizgiyle gösterilir: H−H.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'A grubunda nokta sayısı grup numarası',
        'Karbon 4A: sembolün çevresine 4 nokta. Azot 5A: 5 nokta. Oksijen 6A: 6. Flor 7A: 7. Valans elektron sayısı A grup numarasına eşit; Lewis yapısı bu sayıyla başlar. Hidrojen 1A: tek nokta.',
      ),
      kart(
        'Atomlar sekize tamamlamak ister',
        'Soy gazların son katmanında 8 elektron var ve hiç bağ kurmazlar; çünkü zaten memnunlar. Öteki atomlar da 8\'e ulaşmak için bağ kurar. Buna oktet kuralı denir. Hidrojen ise ikiye tamamlar; tek katmanı 2 alır.',
      ),
      kart(
        'Üç adımda çiz: say, bağla, dağıt',
        'H₂O çizelim. Say: O 6, iki H 2, toplam 8 elektron. Bağla: O ile her H arasına bir çizgi; 4 elektron gitti. Dağıt: kalan 4 elektronu O\'nun çevresine iki çift olarak koy. Her atom kontrol: O 8, H\'ler 2.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Elektronları say' },
            { ad: 'Bağları kur' },
            { ad: 'Kalanı dağıt' },
          ],
        },
        { etiket: 'Örnek', not: 'Çizmeden önce toplam valans elektronunu mutlaka say; hataların çoğu sayım atlanınca oluyor.' },
      ),
      kart(
        'Bağa girmeyen çiftler de çizilir',
        'Sudaki O\'nun 8 elektronundan 4\'ü bağda, 4\'ü değil. Bağa girmeyen bu iki çifte ortaklanmamış çift denir. Onları çizmeyi unutma; molekülün şeklini ve polarlığını bunlar belirler. Su bu çiftler yüzünden açısal.',
      ),
      kart(
        'Bazı moleküller sekize uymaz',
        'BF₃\'te bor 3 bağ kurar, çevresinde 6 elektron var; 8 değil. BeCl₂\'de Be\'nin çevresinde 4. Bunlar oktetin altında. PCl₅ ve SF₆ ise 10 ve 12 ile oktetin üstünde. Oktet güçlü bir eğilim, kesin bir yasa değil.',
        undefined,
        { etiket: 'Dikkat' },
      ),
      kart(
        'NH₃ ve CO₂ örnekleri',
        'NH₃: N 5, üç H 3; toplam 8. Üç bağ (6 elektron), N\'de bir ortaklanmamış çift. CO₂: C 4, iki O 12; toplam 16. C ile her O arasında ikili bağ (8 elektron), her O\'da iki çift (8 elektron). Toplam tutuyor.',
        undefined,
        { etiket: 'Örnek' },
      ),
    ], [
      soru('Lewis yapısı atomun değerlik elektronlarını noktalarla gösterir.', true, 'İç katmanlar çizilmiyor; bağı kuran elektronlar değerlik elektronları.'),
      soru('Oktet kuralına göre atomlar son katmanlarında sekiz elektrona ulaşmaya çalışır.', true, 'Soy gaz düzenine benzemek kararlılık sağlıyor.'),
      soru('Hidrojen atomu da oktete ulaşmaya çalışır.', false, 'Hidrojen iki elektronla, yani dublet ile kararlı.'),
      soru('Bir molekülde ortaklanmamış elektron çifti bulunamaz.', false, 'Su molekülündeki oksijenin iki ortaklanmamış çifti var.'),
      sikli('Oksijenin valans elektron sayısı kaçtır?', ['6', '8'], 0, 'A grubunda grup numarasına eşit.'),
      sikli('NH₃ molekülünde N\'nin kaç ortaklanmamış çifti vardır?', ['1', '3'], 0, 'Üç bağ, bir çift.'),
      sikli('Hangisi oktetin üstünde kalır?', ['SF₆', 'BF₃'], 0, 'BF₃ oktetin altında.'),
      soru('Ortaklanmamış çiftler molekülün şeklini etkilemez.', false, 'Şekli ve polarlığı belirler.'),
      soru('Lewis yapısı çizilirken önce toplam valans elektron sayılır.', true, 'Sonra bağlar, sonra kalan çiftler.'),
    ], [
      {
        soru: 'Oktet kuralına göre hidrojen son katmanını kaça tamamlar?',
        siklar: ['2', '8'],
        dogru: 0,
        aciklama: {
          dogru: 'Hidrojenin tek katmanı var ve o katman iki elektronla dolar (He gibi).',
          yanlis: 'Sekiz, ikinci ve sonraki katmanlar için. Hidrojenin tek katmanı en çok iki elektron alır; tek bir bağla dolar.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-polarlik', 'Molekül Polarlığı ve Apolarlığı', [
      kart(
        'Polar molekülün artı ve eksi ucu var',
        'HCl\'de elektron Cl\'ye yakın durur: Cl ucu biraz eksi, H ucu biraz artı. Molekülün böyle iki ucu olmasına dipol denir; "iki kutup" demek. Dipolü olan molekül polar. Dipolün yönü ve büyüklüğüne dipol moment denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Su açısal, dipoller toplanır',
        'H₂O\'da iki O−H bağı polar; elektron hep O\'ya yakın. Molekül açısal, V gibi. İki bağın dipolü aynı tarafa bakıyor; toplanır, O tarafı eksi olur. Su bu yüzden güçlü bir polar molekül.',
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
        'CO₂: bağlar polar, molekül apolar',
        'CO₂\'de iki C=O bağı da polar. Ama molekül düz bir çizgi: O=C=O. İki dipol eşit büyüklükte ve zıt yönde; halat çekme gibi birbirini götürür. Toplam sıfır. Bağlar polar olsa da molekül apolar.',
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
        { etiket: 'Sık hata', not: '"Bağı polar, öyleyse molekül polar" deme; önce şekle bak. CO₂ bu tuzağın kendisi.' },
      ),
      kart(
        'Polarlığı formül değil şekil belirler',
        'CO₂ ile H₂O ikisi de üç atomlu, ikisinin de bağları polar. Biri apolar, biri polar. Fark yalnız şekilde: biri düz, biri açısal. Formüle bakarak karar veremezsin; molekülün şeklini bilmen gerekir.',
      ),
      kart(
        'Hızlı kural: merkezde çift var mı?',
        'Merkez atomda ortaklanmamış çift yoksa ve çevresindeki atomlar aynıysa molekül apolar: CO₂, CH₄, BF₃. Merkezde çift varsa (H₂O, NH₃) ya da çevredeki atomlar farklıysa (CHCl₃) molekül polar.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Benzer benzeri çözer',
        'Yağı suya dök; karışmaz, üstte durur. Yağ apolar, su polar. Şekeri suya at; çözünür, çünkü şeker de polar. Kural: polar madde polar çözücüde, apolar madde apolar çözücüde çözünür. Yağ lekesini bu yüzden su değil benzin çıkarır.',
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
      soru('Bağları polar olan bir molekül apolar olabilir.', true, 'CO₂ de olduğu gibi: düz şekilde bağ dipolleri birbirini götürüyor.'),
      soru('Polar bir madde apolar bir çözücüde iyi çözünür.', false, 'Benzer benzeri çözer: polar madde polar çözücüde çözünür.'),
      soru('Bir molekülün polar olup olmadığını yalnızca bağ türü belirler.', false, 'Molekülün şekli de belirleyici; düz bir molekülde polar bağlar birbirini götürebiliyor.'),
      sikli('H₂O molekülünün polar olmasının sebebi?', ['Bağlarının apolar olması', 'Açısal şekil'], 1, 'Dipoller toplanır, birbirini götürmez.'),
      sikli('CH₄ molekülü nasıldır?', ['Polar', 'Apolar'], 1, 'Merkezde çift yok, bağlı atomlar aynı.'),
      soru('Yağın suda çözünmemesi "benzer benzeri çözer" kuralının sonucudur.', true, 'Apolar yağ, polar su.'),
    ], [
      {
        soru: 'CO₂ molekülü neden apolardır?',
        siklar: ['Bağları apolar olduğu için', 'Dipoller ters yönde, birbirini götürür'],
        dogru: 1,
        aciklama: {
          dogru: 'C=O bağları polar ama molekül düz; iki eşit dipol zıt yönde toplanınca sıfır.',
          yanlis: 'C=O bağı polardır. Molekülü apolar yapan bağ değil şekil: düz dizilişte iki dipol birbirini götürür.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-adlandirma', 'Bileşiklerin Adlandırılması', [
      kart(
        'İyonik bileşikte önce metal, sonra ametal',
        'NaCl: sodyum klorür. MgO: magnezyum oksit. Önce metalin adı olduğu gibi, sonra ametalin adı. Ametalin sonuna -ür ya da -ir eki gelir: klor → klorür, oksijen → oksit, kükürt → sülfür. Sayı söylenmez.',
      ),
      kart(
        'Yükü değişen metale Roma rakamı',
        'Demir bazen +2, bazen +3. FeO: demir(II) oksit; Fe₂O₃: demir(III) oksit. Roma rakamı metalin o bileşikteki yükünü söyler. Na, Mg, Al gibi yükü tek olan metallere rakam yazılmaz; sodyum klorür yeter.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'İki ametalde atom sayısı ön ekle söylenir',
        'CO: karbon monoksit. CO₂: karbon dioksit. N₂O₄: diazot tetraoksit. İki ametalin bileşiğinde her atomun sayısı Yunanca ön ekle söylenir. İlk atomda "mono" yazılmaz: monokarbon değil, karbon monoksit.',
      ),
      kart(
        'Ön ekler: mono, di, tri, tetra, penta, heksa',
        'mono 1, di 2, tri 3, tetra 4, penta 5, heksa 6. PCl₅: fosfor pentaklorür. SF₆: kükürt heksaflorür. SO₃: kükürt trioksit. Ön ek yalnız kovalent bileşikte; iyonik bileşikte kullanılmaz.',
      ),
      kart(
        'Çok atomlu iyonların adı ezberlenir',
        'SO₄²⁻ tek bir iyon gibi davranır; adı sülfat. Na₂SO₄: sodyum sülfat. Bunlara çok atomlu iyon denir. Adlarını ezberlemekten başka yol yok; altı tanesi sınavda hep çıkar. NH₄⁺ tek artı yüklü olan.',
        {
          tur: 'tablo',
          basliklar: ['İyon', 'Adı', 'Örnek'],
          satirlar: [
            ['SO₄²⁻', 'Sülfat', 'Na₂SO₄'],
            ['NO₃⁻', 'Nitrat', 'KNO₃'],
            ['CO₃²⁻', 'Karbonat', 'CaCO₃'],
            ['PO₄³⁻', 'Fosfat', 'Na₃PO₄'],
            ['OH⁻', 'Hidroksit', 'NaOH'],
            ['NH₄⁺', 'Amonyum', 'NH₄Cl'],
          ],
        },
        { not: 'Altı iyonu bir kâğıda yaz, birkaç gün gözünün önünde dursun; adlandırmanın yarısı bu tabloyla biter.' },
      ),
      kart(
        'Bazı bileşiklerin günlük adı var',
        'H₂O\'ya kimse "dihidrojen monoksit" demez, su der. NH₃ amonyak, NaCl sofra tuzu, CaCO₃ kireç taşı, NaOH sud kostik. Bu adlar kural dışı; sınavda ikisi de kabul edilir ama bilmen gerekir.',
      ),
      kart(
        'Beş örnekle pekiştir',
        'SO₂: iki ametal, kükürt dioksit. MgCl₂: metal + ametal, magnezyum klorür; "di" yok. Fe₂O₃: yükü değişen metal, demir(III) oksit. Na₂SO₄: çok atomlu iyon, sodyum sülfat. N₂O₄: diazot tetraoksit.',
        undefined,
        { etiket: 'Örnek' },
      ),
    ], [
      soru('CO₂ bileşiğinin adı karbon dioksittir.', true, 'İki ametal; ikinci elemente atom sayısını gösteren ön ek geliyor.'),
      soru('İyonik bileşikler adlandırılırken önce ametal yazılır.', false, 'Önce metal (katyon), sonra ametal yazılır.'),
      soru('CuSO₄ bileşiği bakır(II) sülfat diye adlandırılır.', true, 'Bakır birden çok yük aldığı için yükü Roma rakamıyla belirtiliyor.'),
      soru('Kovalent bileşiklerin adlandırılmasında ön ek kullanılmaz.', false, 'mono, di, tri gibi ön ekler atom sayısını gösteriyor.'),
      sikli('FeO bileşiğinin adı?', ['Demir(II) oksit', 'Demir(III) oksit'], 0, 'Fe₂O₃ demir(III) oksit.'),
      sikli('PCl₅ bileşiğinin adı?', ['Fosfor pentaklorür', 'Fosfor(V) klorür'], 0, 'İki ametal: ön ek.'),
      sikli('"tetra" ön eki kaç demektir?', ['4', '6'], 0, 'heksa 6.'),
      soru('CO karbon monoksit, CO₂ karbon dioksittir.', true, 'İlk atomda mono yazılmaz.'),
      soru('Na₂SO₄\'ün adı disodyum sülfattır.', false, 'İyonik bileşikte ön ek kullanılmaz: sodyum sülfat.'),
    ], [
      {
        soru: 'N₂O₄ bileşiğinin adı nedir?',
        siklar: ['Azot(IV) oksit', 'Diazot tetraoksit'],
        dogru: 1,
        aciklama: {
          dogru: 'İki ametal: atom sayıları Yunanca ön ekle söylenir. di 2, tetra 4.',
          yanlis: 'Roma rakamı metallerin yükü için kullanılır. İki ametalin bileşiğinde atom sayıları ön ekle söylenir: diazot tetraoksit.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-molekuller-arasi', 'Moleküller Arası Etkileşimler', [
      kart(
        'Suyu kaynatmak bağı değil çekimi koparır',
        'Su kaynayınca buhar olur; ama buhar hâlâ H₂O. O−H bağları kopmadı. Kopan şey moleküllerin birbirini tutan çekimi. Moleküller arası çekim, molekülün içindeki bağdan çok daha zayıf. Bu yüzden su 100 °C\'de kaynar, ayrışmaz.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'London kuvveti her molekülde var',
        'Elektronlar bir an molekülün bir tarafında toplanır; o taraf anlık eksi olur. Bu anlık kutup komşu molekülü de kutuplar; ikisi çekişir. Buna London kuvveti denir. En zayıf çekim; ama her molekülde var. Molekül büyüdükçe güçlenir.',
      ),
      kart(
        'Polar moleküller uçlarından çekişir',
        'HCl polar: bir ucu artı, bir ucu eksi. Bir molekülün artı ucu ötekinin eksi ucunu çeker; mıknatıs gibi dizilirler. Buna dipol-dipol etkileşimi denir. Yalnız polar moleküllerde var; London\'dan güçlü.',
      ),
      kart(
        'Hidrojen bağı en güçlü çekim',
        'H atomu F, O ya da N\'ye bağlıysa çok güçlü bir dipol oluşur. Bu H, komşu molekülün F, O ya da N\'sine yapışır. Buna hidrojen bağı denir. Suyun 100 °C\'de kaynaması bundan; benzer H₂S ise −60 °C\'de kaynar.',
        undefined,
        { etiket: 'Tanım', not: 'H içeren her molekülde hidrojen bağı aramaya kalkma; H yalnızca F, O ya da N\'ye bağlıysa var.' },
      ),
      kart(
        'Güç sırası kaynama sırasıdır',
        'Üç çekim en zayıftan en güçlüye: London, dipol-dipol, hidrojen bağı. Çekim ne kadar güçlüyse molekülleri ayırmak o kadar zor; kaynama noktası o kadar yüksek. Sırayı bilirsen kaynama noktalarını sıralarsın.',
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
        'London ve dipol-dipol: van der Waals',
        'London kuvvetleri ile dipol-dipol etkileşiminin ortak adı van der Waals kuvvetleri. Bir soru "van der Waals" diyorsa bu ikisinden birini kastediyor. Hidrojen bağı ayrı sayılır; ondan söz etmez.',
      ),
      kart(
        'Su iyonu sarar: iyon-dipol',
        'Tuz suda çözünürken Na⁺\'yı su moleküllerinin eksi ucu, Cl⁻\'yi artı ucu sarar. İyon ile polar molekül arasındaki bu çekime iyon-dipol denir. Tuzun suda çözünmesini mümkün kılan şey bu.',
      ),
      kart(
        'Kaynama sıralamasında üç adım',
        'Önce sor: hidrojen bağı var mı? HF var, HCl yok; HF daha yüksek. Sonra polar mı? Sonra molekül büyük mü? I₂ > Br₂ > Cl₂; üçü de apolar, yalnız London var, büyük olan kazanır.',
        undefined,
        { etiket: 'Kural' },
      ),
    ], [
      soru('Moleküller arası etkileşimler kimyasal bağlardan zayıftır.', true, 'Suyu kaynatmak molekülleri ayırıyor, bağlarını koparmıyor.'),
      soru('Suyun kaynama sıcaklığının beklenenden yüksek olması hidrojen bağlarındandır.', true, 'Hidrojen bağı moleküller arası etkileşimlerin en güçlüsü.'),
      soru('London kuvvetleri yalnızca polar moleküllerde görülür.', false, 'Bütün moleküllerde var; apolar moleküllerde tek etkileşim odur.'),
      soru('Hidrojen bağı, hidrojen atomu bulunan her molekülde oluşur.', false, 'Hidrojenin flor, oksijen veya azota bağlı olması gerekiyor.'),
      sikli('Suda çözünen tuzda iyonları saran etkileşim?', ['İyon-dipol', 'Hidrojen bağı'], 0, 'Su molekülleri iyonları sarar.'),
      sikli('Bütün moleküllerde bulunan etkileşim?', ['London kuvvetleri', 'Hidrojen bağı'], 0, 'Anlık dipol her molekülde.'),
      sikli('I₂\'nin kaynama noktası Cl₂\'den neden yüksek?', ['Molekül daha büyük', 'Hidrojen bağı var'], 0, 'London kuvveti molekül büyüdükçe artar.'),
      sikli('Hidrojen bağı için H hangi atomlara bağlı olmalı?', ['F, O, N', 'C, S, P'], 0, 'Çok elektronegatif üç atom.'),
      soru('Suyu kaynatmak molekül içindeki bağı koparır.', false, 'Moleküller arası çekimi koparır; buhar hâlâ H₂O.'),
      soru('Van der Waals, London ve dipol-dipol etkileşimlerinin ortak adıdır.', true, 'Hidrojen bağı ayrı sayılır.'),
    ], [
      {
        soru: 'Suyun kaynama noktasının benzer moleküllerden çok yüksek olmasının sebebi?',
        siklar: ['Hidrojen bağı', 'London kuvvetleri'],
        dogru: 0,
        aciklama: {
          dogru: 'H, O\'ya bağlı; moleküller arasında güçlü hidrojen bağları var ve onları koparmak enerji ister.',
          yanlis: 'London kuvvetleri her molekülde var ve zayıf. Suyu ayıran şey H–O bağının yarattığı güçlü hidrojen bağı.',
        },
        kart: 4,
      },
    ]),
    konu('kim9-katilar', 'Katılar ve Özellikleri', [
      kart(
        'Kristal düzenli dizilir, amorf dağınık',
        'Tuz tanesine büyüteçle bak: küp şeklinde, köşeleri düzgün. Çünkü iyonları düzenli sıralı; buna kristal katı denir. Cam ise dağınık; buna amorf denir. Kristal tam bir sıcaklıkta erir, amorf yavaşça yumuşar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Katıyı tutan çekim, özelliğini belirler',
        'Dört tür katı var; farkları taneciklerini bir arada tutan şey. İyonları zıt yük tutar, ağ katısını kovalent bağ, metali elektron denizi, moleküler katıyı zayıf çekim. Tutan güç ne kadar güçlüyse erime o kadar zor.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Erime noktası', 'Örnek'],
          satirlar: [
            ['İyonik', 'Yüksek', 'NaCl'],
            ['Kovalent ağ', 'Çok yüksek', 'Elmas'],
            ['Metalik', 'Değişken', 'Demir'],
            ['Moleküler', 'Düşük', 'Buz'],
          ],
        },
        { not: 'Katının türünü bulunca özellikleri ezberleme; "onu ne tutuyor" diye sor, gerisi oradan çıkar.' },
      ),
      kart(
        'İyonik katı: sert, kırılgan, zor erir',
        'Sofra tuzu iyonik katı: Na⁺ ve Cl⁻ örgüsü. Zıt yükler güçlü çektiği için sert ve erimesi zor. Vurunca aynı yükler karşılaşıp iter; kırılır. Katıyken iyonlar kilitli, iletmez; eriyince iletir.',
      ),
      kart(
        'Kovalent ağ katısı: tek dev molekül',
        'Elmasta her karbon dört komşusuna kovalent bağlı; bütün kristal tek bir bağ ağı. Onu çizmek bağ koparmak demek. Bu yüzden elmas en sert madde ve 3500 °C üstünde erir. Kuvars (kum) da böyle.',
      ),
      kart(
        'Moleküler katı: yumuşak, kolay erir',
        'Buz, kuru buz (katı CO₂) ve iyot moleküler katı. Moleküllerin içi sağlam ama molekülleri birbirine tutan çekim zayıf. Az ısı yeter; buz 0 °C\'de erir, kuru buz −78 °C\'de doğrudan gaz olur.',
      ),
      kart(
        'Metalik katı: iletir, dövülür',
        'Demir, bakır, altın metalik katı; elektron denizi tutar. Serbest elektronlar akımı iletir, katmanlar kayınca kırılmaz. Erime noktası çok geniş: cıva oda sıcaklığında sıvı, tungsten 3400 °C\'de erir.',
      ),
      kart(
        'Elmas ve grafit ikisi de karbon',
        'Elmas en sert madde; grafit kalem ucu, kâğıda sürtünce dökülür. İkisi de yalnız karbon atomundan oluşur. Fark dizilimde: elmasta her atom dört yöne bağlı, grafitte tabakalar hâlinde ve tabakalar kayar.',
      ),
    ], [
      soru('Elmas ile grafit aynı elementten oluşur.', true, 'İkisi de karbon; farkı atomların dizilişinde.'),
      soru('Cam kristal bir katıdır.', false, 'Camın düzenli örgüsü yok; amorf katı.'),
      soru('Kovalent ağ katılarının erime noktaları çok yüksektir.', true, 'Eritmek için kovalent bağları koparmak gerekiyor.'),
      soru('Moleküler katılar sert ve yüksek erime noktalıdır.', false, 'Molekülleri zayıf etkileşimler tuttuğu için genelde yumuşak ve düşük erime noktalıdır.'),
      sikli('Cam hangi tür katıdır?', ['Kristal', 'Amorf'], 1, 'Yumuşayarak erir, keskin erime noktası yok.'),
      sikli('Kuru buz hangi katı türüdür?', ['Kovalent ağ', 'Moleküler'], 1, 'Yumuşak, düşük erime noktalı.'),
      sikli('Elmas ile grafiti ayıran nedir?', ['Element türü', 'Atom dizilimi'], 1, 'İkisi de karbon.'),
      soru('Metalik katıların erime noktası hep çok yüksektir.', false, 'Cıva oda sıcaklığında sıvı; aralık çok geniş.'),
      soru('İyonik katılar katı hâlde elektriği iletir.', false, 'Ancak eriyik ya da çözeltide.'),
    ], [
      {
        soru: 'Elmasın aşırı sert olmasının sebebi nedir?',
        siklar: ['Bütün kristal tek bir kovalent ağ', 'Güçlü iyonik çekim'],
        dogru: 0,
        aciklama: {
          dogru: 'Her karbon dört komşusuna kovalent bağlı; kristali çizmek bağ koparmak demek.',
          yanlis: 'Elmasta iyon yok, yalnızca karbon atomları. Sertlik bütün kristali saran kovalent bağ ağından geliyor.',
        },
        kart: 4,
      },
    ]),
    konu('kim9-sivilar', 'Sıvılar ve Özellikleri', [
      kart(
        'Kapalı kapta buhar bir basınç yapar',
        'Yarısı su dolu bir şişeyi kapat. Yüzeyden bazı moleküller kaçıp buhar olur; bir kısmı geri döner. Denge kurulunca üstteki buharın yaptığı basınca buhar basıncı denir. Isıtınca daha çok molekül kaçar; basınç artar.',
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
        'Buhar basıncı dış basınca ulaşınca kaynar',
        'Sıvı ısındıkça buhar basıncı yükselir. Dışarıdaki hava basıncına eşitlenince kabarcıklar oluşur: kaynama. Deniz kenarında su 100 °C\'de kaynar. Dağda hava basıncı düşük; su 90 °C\'de kaynar, yemek geç pişer.',
        undefined,
        { etiket: 'Tanım', not: 'Kaynama sabit bir sıcaklık değil, iki basıncın eşitlendiği an; "dağda kaç derecede kaynar" sorusu buradan çıkar.' },
      ),
      kart(
        'Viskozite: akmaya karşı direnç',
        'Balı dök, yavaş akar; suyu dök, hemen akar. Akmaya karşı bu dirence viskozite denir. Moleküller birbirini güçlü çekiyorsa ya da molekül büyükse viskozite yüksek. Balı ısıt; çekim gevşer, daha kolay akar.',
      ),
      kart(
        'Kohezyon kendine, adezyon yüzeye çekim',
        'Su damlası cam üstünde yayılır; cıva damlası top gibi durur. Su cama yapışır: adezyon, yani farklı yüzeye çekim. Cıva kendini tutar: kohezyon, yani aynı moleküllerin birbirini çekmesi. Hangisi güçlüyse o kazanır.',
      ),
      kart(
        'Yüzeydeki moleküller içeri çekilir',
        'Bir iğneyi suya yavaşça bırak; batmaz, yüzer. Yüzeydeki su molekülleri yalnız alttan ve yandan çekilir; yüzey gerilir ve zar gibi davranır. Buna yüzey gerilimi denir. Damlanın yuvarlak olması da bundan.',
      ),
      kart(
        'İnce boruda su yükselir, cıva alçalır',
        'Kâğıt havlunun ucunu suya değdir; su yukarı tırmanır. Adezyon kohezyondan güçlü: su boru çeperine yapışıp yükselir. Buna kılcallık denir. Cıvada kohezyon güçlü; ince boruda alçalır. Bitki suyu yaprağa böyle taşır.',
      ),
      kart(
        'Su donunca genleşir, buz yüzer',
        'Buzdolabına koyduğun dolu su şişesi patlar. Çünkü su donarken büyür. Hidrojen bağları buzda molekülleri boşluklu bir düzene sokar; buz sudan hafif kalır ve yüzer. Çoğu madde donunca büzülür; su tuhaf olan.',
      ),
    ], [
      soru('Bir sıvının buhar basıncı arttıkça kaynama sıcaklığı düşer.', true, 'Sıvı, dış basıncı daha erken karşılıyor.'),
      soru('Viskozitesi yüksek sıvılar daha zor akar.', true, 'Bal ile suyun farkı bu.'),
      soru('Yüzey gerilimi, sıvı taneciklerinin kabın çeperine yaptığı çekimden kaynaklanır.', false, 'Yüzey gerilimi kohezyondan, yani taneciklerin birbirini çekmesinden gelir.'),
      soru('Kılcal boruda cıva da su gibi yükselir.', false, 'Cıvada kohezyon adezyondan güçlü; seviye yükselmek yerine alçalır.'),
      sikli('Su damlasının yuvarlak olmasının sebebi?', ['Yüzey gerilimi', 'Viskozite'], 0, 'Yüzey moleküller içeri çekilir.'),
      sikli('Adezyon kohezyondan güçlüyse ince boruda sıvı?', ['Yükselir', 'Alçalır'], 0, 'Kılcallık.'),
      sikli('Sıcaklık artınca viskozite?', ['Azalır', 'Artar'], 0, 'Bal ısınınca akıcılaşır.'),
      soru('Buhar basıncı sıcaklık arttıkça büyür.', true, 'Daha çok molekül yüzeyden kaçar.'),
      soru('Buz suda batar.', false, 'Su donarken genleşir; buz yüzer.'),
    ], [
      {
        soru: 'Sıvı ne zaman kaynar?',
        siklar: ['Buhar basıncı dış basınca eşitlenince', 'Sıcaklığı 100 °C olunca'],
        dogru: 0,
        aciklama: {
          dogru: 'Tanım bu; 100 °C yalnızca deniz seviyesinde ve yalnızca su için.',
          yanlis: '100 °C suyun 1 atm\'deki kaynama noktası. Genel kural: buhar basıncı dış basınca eşitlenince kaynar; dağda daha erken.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('kim9-t3', 'Sürdürülebilirlik', [
    konu('kim9-nano', 'Metal Nanoparçacıklar', [
      kart(
        'Nanometre: metrenin milyarda biri',
        'Saç telinin kalınlığı yaklaşık 80 bin nanometre. Nanometre, yani metrenin milyarda biri (10⁻⁹ m). 1 ile 100 nanometre arasındaki parçacıklara nanoparçacık denir. Saç telini binlerce parçaya böl; işte o boyut.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Küpü böl: hacim aynı, yüzey büyür',
        'Kenarı 2 cm olan bir küp düşün: yüzeyi 24 cm². Onu 8 tane 1 cm\'lik küpe böl. Toplam hacim aynı ama yüzey artık 48 cm²; iki katı. Böldükçe yüzey büyür. Nano boyutta atomların çoğu yüzeyde kalır.',
        undefined,
        { etiket: 'Örnek', not: 'Küp hesabını bir kez kendin yap; "nano neden daha etkin" sorusunun cevabı bu iki sayıda.' },
      ),
      kart(
        'Yüzey büyüyünce tepkime hızlanır',
        'Kesme şeker suda yavaş, toz şeker hızlı çözünür; toz olanın yüzeyi daha çok. Tepkime yüzeyde olur. Nanoparçacığın yüzeyi hacmine göre çok büyük; aynı madde nano boyutta çok daha etkin tepkir.',
      ),
      kart(
        'Aynı madde nano boyutta başka görünür',
        'Külçe altın sarıdır; altın nanoparçacıkları kırmızı ya da mor görünür. Madde aynı, atomlar aynı; yalnız boyut değişti. Nano boyutta renk, erime noktası ve iletkenlik bile değişebilir. Bu yüzden ayrı bir alan.',
      ),
      kart(
        'Gümüş mikrop öldürür, altın hastalık bulur',
        'Kokmayan çorapların içinde gümüş nanoparçacık var; bakterileri öldürür. Gebelik testinin çizgisini altın nanoparçacığı boyar; tanı testlerinde kullanılır. Güneş kremindeki çinko oksit de nano boyutta.',
      ),
      kart(
        'Çay ve meyve kabuğu nanoparçacık üretir',
        'Metal iyonundan nanoparçacık yapmak için elektron vermek gerekir. Çay ve meyve kabuğu özütü bunu yapabiliyor; kimyasal yerine bitki kullanılır. Atıktan üretim ucuz ve temiz. Buna yeşil sentez denir.',
      ),
      kart(
        'Küçük olmak hücreye girebilmek demek',
        'Nanoparçacık öyle küçük ki hücre zarından geçebilir ve dokuda birikebilir. Sağlığa ve çevreye etkisi hâlâ araştırılıyor. Fayda büyük; ama "küçük, o yüzden zararsız" düşüncesi yanlış. Tersi de olabilir.',
        undefined,
        { etiket: 'Dikkat' },
      ),
    ], [
      soru('1 nanometre, metrenin milyarda biridir.', true, 'Bir insan saçı yaklaşık 80 bin nanometre kalınlığında.'),
      soru('Nanoparçacıklar, aynı maddenin iri hâliyle aynı özellikleri gösterir.', false, 'Yüzey/hacim oranı büyüdüğü için renk, erime noktası ve etkinlik değişebiliyor.'),
      soru('Nanoparçacıklarda yüzey alanının hacme oranı büyüktür.', true, 'Atomların büyük kısmı yüzeyde kalıyor; tepkime etkinliği bu yüzden yüksek.'),
      soru('Nanoteknoloji ürünlerinin çevresel ve sağlıkla ilgili bir riski yoktur.', false, 'Küçük boyut, canlı dokularda birikme ve hücrelere girme riski getiriyor.'),
      sikli('1 nanometre metrenin kaçta biridir?', ['Milyarda', 'Milyonda'], 0, '10⁻⁹ m.'),
      sikli('Gümüş nanoparçacık tekstilde ne için kullanılır?', ['Mikrop öldürücü', 'Renk verici'], 0, 'Altın nanoparçacık tanı testlerinde.'),
      soru('Bir küpü küçük küplere bölmek toplam yüzeyi artırır.', true, 'Hacim aynı kalır, yüzey büyür; nano etkinliğin sebebi.'),
      soru('Bitki özütüyle nanoparçacık üretilemez.', false, 'Çay ve meyve kabuğu özütü metal iyonunu indirger; yeşil sentez.'),
    ], [
      {
        soru: 'Madde nano boyuta inince neden daha etkin olur?',
        siklar: ['Atomları değişir', 'Yüzey/hacim oranı büyür'],
        dogru: 1,
        aciklama: {
          dogru: 'Tepkime yüzeyde olur; küçülen parçacığın hacmine göre yüzeyi çok büyür.',
          yanlis: 'Atomlar aynı kalır. Değişen şey yüzeyin hacme oranı: küçük parçacıkta atomların çoğu yüzeyde ve tepkimeye açık.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-cevresel', 'Metal ve Alaşımların Çevresel Etkileri', [
      kart(
        'Ağır metal az miktarda bile zehirler',
        'Eski boyalarda kurşun, kırık termometrede cıva, eski pillerde kadmiyum var. Bunlara ağır metal denir: yoğunluğu yüksek, vücuttan atılmayan metaller. Çok az miktarı bile sinir sistemine ve böbreğe zarar verir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ağır metal zincirde her basamakta birikir',
        'Denize karışan cıva çok seyrek. Plankton onu alır; küçük balık binlerce plankton yer, cıva birikir. Büyük balık yüzlerce küçük balık yer. En sonda insan. Metal parçalanmaz; en çok tepedeki canlıda toplanır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Su', alt: 'az' },
            { ad: 'Plankton' },
            { ad: 'Balık' },
            { ad: 'İnsan', alt: 'çok', renk: 'ikincil' },
          ],
        },
        { not: '"Suda çok az var, zararsız" deme; her basamakta katlanır, en çok zincirin sonundakine ulaşır.' },
      ),
      kart(
        'Alaşım: metale başka element katılır',
        'Saf demir yumuşaktır. İçine biraz karbon kat; çelik çıkar, çok daha sert. Bakır ile çinko: pirinç. Bakır ile kalay: bronz. Alaşım, yani bir metalin başka elementle karışımı. Tepkime yok; karışım var.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Alaşım saf metalden sert ve dayanıklı',
        'Saf altın o kadar yumuşak ki yüzük hemen çizilir; içine bakır katılır. Saf demir çabuk paslanır; içine krom katılır, paslanmaz çelik olur. Alaşım yapmanın amacı bu: sertlik ve dayanıklılık kazandırmak.',
      ),
      kart(
        'Korozyon: metalin çevreyle aşınması',
        'Dışarıda unuttuğun bisiklet paslanır. Demir havadaki oksijen ve nemle tepkir; pas oluşur. Metalin çevresiyle tepkimeye girip aşınmasına korozyon denir. Boya ve çinko kaplama (galvaniz) havayı keser, yavaşlatır.',
      ),
      kart(
        'Geri kazanım ayak izini küçültür',
        'Bir alüminyum kutuyu cevherden üretmek çok elektrik ister. Aynı kutuyu eski kutudan üretmek yüzde 95 daha az enerji ister. Bir üretimin doğaya yükü ekolojik ayak izi. Geri kazanım bu yükü belirgin azaltır.',
      ),
    ], [
      soru('Ağır metaller besin zincirinde birikerek üst basamaklarda yoğunlaşır.', true, 'Vücuttan atılmadıkları için her basamakta daha çok toplanıyorlar.'),
      soru('Alaşım, iki metalin kimyasal tepkimesiyle oluşan yeni bir bileşiktir.', false, 'Alaşım bir karışım; bileşenler kendi kimliğini koruyor.'),
      soru('Paslanmaz çelik, korozyona direnç kazandırmak için üretilmiş bir alaşımdır.', true, 'İçindeki krom yüzeyde koruyucu bir tabaka oluşturuyor.'),
      soru('Korozyon yalnızca demirde görülür.', false, 'Bakır ve alüminyum gibi metaller de yüzeyde oksitlenir; demirdeki adı pas.'),
      sikli('Çelik neyin alaşımıdır?', ['Bakır ve çinko', 'Demir ve karbon'], 1, 'Bakır-çinko pirinç.'),
      sikli('Metalin çevreyle tepkimeye girip aşınmasına ne denir?', ['Ötrofikasyon', 'Korozyon'], 1, 'Paslanma en yaygın örnek.'),
      soru('Metal geri kazanımı ekolojik ayak izini azaltır.', true, 'Cevherden üretime göre çok daha az enerji.'),
    ], [
      {
        soru: 'Ağır metal besin zincirinde nerede en yoğun bulunur?',
        siklar: ['Zincirin tepesindeki canlıda', 'Suda ve bitkide'],
        dogru: 0,
        aciklama: {
          dogru: 'Metal parçalanmaz, her basamakta birikir; en çok yiyen en çok toplar.',
          yanlis: 'Su ve bitkide derişim en düşük. Her basamak bir öncekini yediği için metal tepede birikir: büyük balık, yırtıcı kuş, insan.',
        },
        kart: 2,
      },
    ]),
    konu('kim9-yesil', 'Yeşil Kimyanın Atık Önleme İlkesi', [
      kart(
        'Atığı temizleme, hiç oluşturma',
        'Mutfakta yere yağ döküp silmek yerine hiç dökmemek daha kolay. Yeşil kimyanın ilk ilkesi de bu: atığı sonradan temizlemek yerine hiç oluşturmamak. Yeşil kimya, yani doğaya az zarar veren kimya. On iki ilkesi var; birincisi bu.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Oluşmayan atığın arıtma maliyeti sıfır',
        'Bir fabrika atık suyunu arıtıyor: arıtma tesisi, elektrik, kimyasal, işçi. Hepsi para ve enerji. Baştan az atık çıkaran bir yöntem seçseydi bunların hiçbiri gerekmezdi. Önlemek arıtmaktan hep ucuz.',
      ),
      kart(
        'Sıra: önle, azalt, kullan, dönüştür, at',
        'Plastik şişe için düşün. En iyisi hiç almamak (önle). Sonra daha az almak (azalt). Sonra doldurup yeniden kullanmak. Sonra geri dönüşüm kutusu. En kötüsü çöpe atmak. Geri dönüşüm ilk değil, dördüncü seçenek.',
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
        { etiket: 'Sık hata', not: '"En çevreci seçenek geri dönüşüm" sanma; sırada önle, azalt ve yeniden kullan ondan önce gelir.' },
      ),
      kart(
        'Kimyasal ayak izi: bir ürünün kimyasal yükü',
        'Bir tişört üretilirken boya, ağartıcı ve çözücü kullanılır; bir kısmı suya karışır. Kullanılan ve açığa çıkan bütün kimyasalların toplamına kimyasal ayak izi denir. Az kimyasalla yapılan üretimin izi küçük.',
      ),
      kart(
        'Atom ekonomisi: girenin ne kadarı ürün oldu',
        '100 gram madde koydun, 90 gramı istediğin ürün oldu, 10 gramı yan ürün. Atom ekonomisi yüksek: az atık. Başka bir yöntemde 40 gram ürün, 60 gram atık: düşük. Yeşil kimya yüksek atom ekonomili tepkimeyi seçer.',
      ),
      kart(
        'Okulda karşılığı: küçük ölçekli deney',
        'Deneyi 50 mL yerine 5 mL ile yap; sonuç aynı. On kat az kimyasal, on kat az atık, sıçrama riski de az. Buna mikro ölçekli deney denir. Yeşil kimya yalnız fabrikanın değil, senin laboratuvarının da işi.',
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
      sikli('Girenlerin ne kadarının ürüne dönüştüğünün ölçüsü?', ['Atom ekonomisi', 'Kimyasal ayak izi'], 0, 'Yüksek verim az atık.'),
      sikli('Atık hiyerarşisinde en kötü seçenek?', ['Çöpe atmak', 'Yeniden kullanmak'], 0, 'En iyisi hiç üretmemek.'),
      soru('Mikro ölçekli deney hem atığı hem riski azaltır.', true, 'Aynı sonuç, daha az madde.'),
    ], [
      {
        soru: 'Yeşil kimyanın ilk ilkesi nedir?',
        siklar: ['Atığı iyi arıtmak', 'Atığı hiç oluşturmamak'],
        dogru: 1,
        aciklama: {
          dogru: 'Önleme arıtmadan üstündür; oluşmayan atığın maliyeti sıfır.',
          yanlis: 'Arıtma sonradan gelen ve pahalı bir çözüm. İlk ilke atığı arıtmak değil hiç oluşturmamak.',
        },
        kart: 1,
      },
    ]),
  ]),
])
