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
        'Kimya neyi inceler?',
        'Maddenin yapısını, özelliklerini ve değişimini inceler. Yediğimiz ilaçtan giydiğimiz kumaşa kadar her şey kimyanın konusu.',
      ),
      kart(
        'Fiziksel ve kimyasal değişim',
        'Fiziksel değişimde madde kimliğini korur (buzun erimesi); kimyasal değişimde yeni madde oluşur (demirin paslanması).',
      ),
      kart(
        'Değişimi nasıl ayırt edersin?',
        'Renk, koku ve gaz çıkışı, çökelek oluşması ya da geri döndürülememe kimyasal değişimin işaretidir. Erime, çözünme ve kırılma fizikseldir.',
        undefined,
        { not: 'Belirtileri ezberleme; tek soru sor: madde geri döndürülebiliyor mu?' },
      ),
      kart(
        'Temizlik ürünleri',
        'Sabun ve deterjan, bir ucu suyu seven bir ucu yağı seven moleküllerdir. Yağı kavrayıp suya taşıdıkları için kir çözülür.',
      ),
      kart(
        'Asit ve baz evde',
        'Limon suyu, sirke ve kola asit; sabun, çamaşır suyu ve kabartma tozu bazdır. Kireç çözücüler asit, yağ çözücüler baz içerir.',
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
      sikli('Demirin paslanması hangi tür değişimdir?', ['Fiziksel', 'Kimyasal'], 1, 'Yeni madde (pas) oluşuyor.'),
      sikli('Hamuru kabartan gaz hangisidir?', ['Oksijen', 'Karbondioksit'], 1, 'Kabartma tozu ısınınca CO₂ verir.'),
      sikli('Kireç çözücüler hangi sınıftandır?', ['Baz', 'Asit'], 1, 'Yağ çözücüler bazdır.'),
      sikli('Sabunun yağı çözmesinin sebebi?', ['Yağı buharlaştırır', 'Bir ucu suyu, bir ucu yağı sever'], 1, 'Yağı kavrayıp suya taşır.'),
      soru('Doğal kaynaklı bir madde her zaman zararsızdır.', false, 'Zehirliliği belirleyen kaynak değil doz ve yapı.'),
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
        'Sık görülen işaretler',
        'Alev: yanıcı. Kafatası: zehirli. Sıçrayan damla ve el: aşındırıcı. Patlama: patlayıcı. Ağaç ve balık: çevreye zararlı.',
      ),
      kart(
        'Asidi suya ekle',
        'Suyu aside dökmek şiddetli ısı açığa çıkarır ve sıvı sıçrar. Doğrusu asidi yavaşça suya eklemektir.',
        undefined,
        { not: 'Sırayı kafiyeyle tut: "asit suya, su aside değil". Sınavda değil laboratuvarda lazım.' },
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
      kart(
        'Yangında ne yapılır?',
        'Yağ ve elektrik yangınına su dökülmez; yağ sıçrar, su elektrik iletir. Kapak ya da yangın battaniyesiyle hava kesilir.',
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
      soru('Kimyasal atık lavaboya dökülerek uzaklaştırılır.', false, 'Türüne göre ayrı kaplarda toplanır.'),
    ], [
      {
        soru: 'Derişik asit seyreltilirken doğru yol hangisidir?',
        siklar: ['Su aside dökülür', 'Asit yavaşça suya eklenir'],
        dogru: 1,
        aciklama: {
          dogru: 'Açığa çıkan ısı büyük su kütlesine dağılır, sıçrama olmaz.',
          yanlis: 'Su aside dökülürse ısı küçük su damlasında toplanır, kaynayıp asit sıçratır. Asit suya, yavaşça.',
        },
        kart: 3,
      },
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
      kart(
        'Hangi dal hangi soruyu sorar?',
        '"Bu madde ne?" analitik, "nasıl ve neden tepkir?" fizikokimya, "canlıda ne olur?" biyokimya, "karbon bileşiği mi?" organik kimyanın sorusu.',
        undefined,
        { not: 'Dalları adıyla değil sorduğu soruyla ayır; soru aklında daha uzun kalır.' },
      ),
    ], [
      soru('Organik kimya, karbon bileşiklerini inceleyen alt disiplindir.', true, 'Yakıtlar, plastikler ve ilaçların çoğu bu alanın konusu.'),
      soru('Analitik kimya, bir örnekte hangi maddenin ne kadar bulunduğunu belirler.', true, 'Nitel ve nicel analiz bu alanın işi.'),
      soru('Canlılardaki tepkimeleri inceleyen alt disiplin biyokimya değildir.', false, 'Tam da biyokimyadır; canlıdaki kimyasal süreçleri inceler.'),
      soru('Plastiklerin yapısını fizikokimya inceler.', false, 'Polimer kimyası inceler; fizikokimya tepkime hızı ve enerji ilişkilerine bakar.'),
      sikli('Plastik ve ilaçların neredeyse tamamı hangi dalın konusudur?', ['Organik kimya', 'Anorganik kimya'], 0, 'Karbon bileşikleri.'),
      sikli('Tepkimenin hızını ve enerjisini inceleyen dal?', ['Fizikokimya', 'Biyokimya'], 0, 'Biyokimya canlıdaki tepkimeleri inceler.'),
      soru('Polimer kimyası küçük birimlerin uzun zincir kurmasını inceler.', true, 'Lastikten naylona her şey polimer.'),
      soru('Enzim ve DNA anorganik kimyanın konusudur.', false, 'Biyokimyanın.'),
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
        'Nerede çalışılır?',
        'İlaç, gıda, boya, kozmetik, enerji, arıtma ve tekstil sektörleri; ayrıca kalite kontrol laboratuvarları.',
      ),
      kart(
        'Hangi bölümler?',
        'Kimya, kimya mühendisliği, kimya öğretmenliği, eczacılık, gıda mühendisliği ve malzeme bilimi kimya bilgisinin üstüne kurulu bölümlerdir.',
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
        undefined,
        { not: 'Laboratuvar ile fabrika; iki mesleği bu tek çizgi ayırıyor.' },
      ),
      kart(
        'Çevre ve arıtma',
        'Atık su arıtma tesisi ve hava kalitesi ölçümü kimyagerin işidir; belediyeler ve çevre laboratuvarları bu alanda çalışan istihdam eder.',
      ),
    ], [
      soru('Adli kimya, suç kanıtlarının çözümlenmesinde kimya bilgisini kullanır.', true, 'Kan, boya ve toz örneklerinin analizi bu alanın işi.'),
      soru('Kimyager ile kimya mühendisinin işi tümüyle aynıdır.', false, 'Kimyager maddeyi ve tepkimeyi, mühendis üretimin büyük ölçekte kurulmasını ele alır.'),
      soru('İlaç geliştirme sürecinde kimyacılara ihtiyaç duyulmaz.', false, 'Etken maddenin tasarımı ve sentezi doğrudan kimyanın işi.'),
      soru('Kalite kontrol laboratuvarları kimya mezunlarının çalıştığı yerlerdendir.', true, 'Ürünün istenen bileşimde olup olmadığı orada ölçülüyor.'),
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
        { not: 'Modelleri sırayla değil, her birinin hangi deneyle çürüdüğünü sorarak oku.' },
      ),
      kart(
        'Dalton\'dan Thomson\'a',
        'Dalton atomu bölünmez içi dolu küre saydı; Thomson elektronu keşfedip "üzümlü kek" modelini kurdu: pozitif hamurda gömülü elektronlar.',
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
      kart(
        'Gösterim',
        'Elementin sol üstüne kütle numarası, sol altına atom numarası yazılır. Nötron sayısı = kütle numarası − proton sayısı.',
      ),
      kart(
        'İyonda sayılar',
        'Katyonda elektron sayısı proton sayısından yük kadar az, anyonda yük kadar fazla: Na⁺ 11 proton 10 elektron, Cl⁻ 17 proton 18 elektron.',
      ),
    ], [
      soru('Rutherford un deneyi, atom kütlesinin büyük kısmının küçük bir çekirdekte toplandığını gösterdi.', true, 'Işınların çok azının geri sekmesi bunun kanıtıydı.'),
      soru('İzotop atomların proton sayıları farklıdır.', false, 'Proton sayıları aynı, nötron sayıları farklıdır; proton değişseydi element değişirdi.'),
      soru('Bir elementin kimliğini kütle numarası belirler.', false, 'Kimliği atom numarası, yani proton sayısı belirler.'),
      soru('Elektron üst enerji seviyesinden alt seviyeye inerken ışık yayar.', true, 'Aradaki enerji farkı ışık olarak salınıyor; emisyon spektrumu böyle oluşuyor.'),
      sikli('"Üzümlü kek" modelini kuran kimdir?', ['Dalton', 'Thomson'], 1, 'Dalton içi dolu bölünmez küre dedi.'),
      sikli('Elektronun belirli enerjili katmanlarda döndüğünü söyleyen model?', ['Modern atom teorisi', 'Bohr'], 1, 'Modern teoride yörünge değil olasılık bulutu var.'),
      sikli('Atomun kimliğini ne belirler?', ['Nötron sayısı', 'Proton sayısı'], 1, 'Proton değişirse element değişir.'),
      sikli('Proton sayısı aynı, nötron sayısı farklı atomlar?', ['İyon', 'İzotop'], 1, 'Kimyasal özellikleri aynı, kütleleri farklı.'),
      sikli('Elektron üst katmana çıkarken ne olur?', ['Enerji soğurur', 'Enerji salar'], 0, 'İnerken salar (emisyon).'),
      sikli('Cl⁻ iyonunda kaç elektron vardır? (Cl: 17)', ['18', '16'], 0, 'Anyonda yük kadar fazla.'),
      sikli('Kütlenin neredeyse tamamı nerededir?', ['Çekirdekte', 'Elektron bulutunda'], 0, 'Hacmi elektronlar belirler.'),
      soru('Elektronun kütlesi kütle numarasına katılır.', false, 'Çok küçük; kütle numarası proton + nötron.'),
      soru('Her elementin emisyon çizgileri kendine özgüdür.', true, 'Parmak izi gibi.'),
    ], [
      {
        soru: 'Rutherford\'un altın levha deneyi neyi gösterdi?',
        siklar: ['Atomun çoğu boşluk, kütle küçük çekirdekte', 'Elektronlar sabit yörüngelerde döner'],
        dogru: 0,
        aciklama: {
          dogru: 'Parçacıkların çoğu levhayı geçti, birkaçı geri sekti: içi boş, ortası yoğun.',
          yanlis: 'Yörünge fikri Bohr\'un. Rutherford deneyinde parçacıkların çoğunun geçmesi atomun içinin boş, kütlenin çekirdekte olduğunu gösterdi.',
        },
        kart: 3,
      },
      {
        soru: 'Kütle numarası 23, atom numarası 11 olan atomun nötron sayısı?',
        siklar: ['12', '23'],
        dogru: 0,
        aciklama: {
          dogru: 'Nötron = kütle numarası − proton = 23 − 11 = 12.',
          yanlis: '23 kütle numarası, yani proton + nötron toplamı. Nötron için proton sayısını çıkar: 23 − 11 = 12.',
        },
        kart: 8,
      },
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
        'Katman kapasitesi',
        'Her katman en çok 2n² elektron alır: 1. katman 2, 2. katman 8, 3. katman 18. Alt katmanlar: s 2, p 6, d 10, f 14.',
      ),
      kart(
        'Neden 4s, 3d’den önce?',
        'Sıralamayı katman numarası değil enerji belirler ve 4s orbitalinin enerjisi 3d’den düşüktür.',
        undefined,
        { not: 'Katman numarasına bakıp aldanma; sırayı enerji belirliyor.' },
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
      kart(
        'Dizilim örnekleri',
        'Na (11): 1s² 2s² 2p⁶ 3s¹. Cl (17): 1s² 2s² 2p⁶ 3s² 3p⁵. Son katmandaki elektron sayısı Na\'da 1, Cl\'de 7.',
      ),
      kart(
        'Kısaltılmış gösterim',
        'Bir önceki soy gaz köşeli ayraçla yazılır: Na için [Ne] 3s¹, Ca için [Ar] 4s². Sınavda zaman kazandırır.',
      ),
    ], [
      soru('Aufbau ilkesine göre elektronlar önce en düşük enerjili orbitali doldurur.', true, 'Sistem en kararlı, yani en düşük enerjili düzeni seçiyor.'),
      soru('Aynı orbitaldeki iki elektronun spinleri aynı yöndedir.', false, 'Pauli dışlama ilkesi zıt spin şartı koyuyor.'),
      soru('4s orbitalinin enerjisi 3d den düşük olduğu için önce dolar.', true, 'Doldurma sırasını baş kuantum sayısı değil enerji belirliyor.'),
      soru('Hund kuralına göre eş enerjili orbitallere elektronlar önce çiftler hâlinde yerleşir.', false, 'Önce her orbitale birer elektron girer, ancak hepsi dolunca eşleşme başlar.'),
      sikli('Bir orbital en fazla kaç elektron alır?', ['2', '8'], 0, 'Pauli: iki elektron, zıt spin.'),
      sikli('2. katman en fazla kaç elektron alır?', ['8', '18'], 0, '2n² = 8.'),
      sikli('p alt katmanı en fazla kaç elektron alır?', ['6', '10'], 0, 's 2, p 6, d 10, f 14.'),
      sikli('Na (11) için kısaltılmış dizilim?', ['[Ne] 3s¹', '[He] 3s¹'], 0, 'Bir önceki soy gaz Ne.'),
      sikli('Kimyasal davranışı pratikte belirleyen elektronlar?', ['İç katman elektronları', 'Valans (en dış) elektronlar'], 1, 'En dıştakiler bağ kurar.'),
      sikli('Cr ve Cu\'nun diziliminin şaşırtmasının sebebi?', ['Pauli ilkesi', 'Küresel simetri'], 1, 'Yarı ya da tam dolu alt katman ek kararlılık verir.'),
      soru('Cl (17) atomunun son katmanında 7 elektron vardır.', true, '3s² 3p⁵.'),
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
        kart: 4,
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
        'Periyot ve grup',
        'Periyot numarası en yüksek katman sayısıdır; grup numarası valans elektron sayısıyla belirlenir.',
      ),
      kart(
        'Dizilimden yer bulma',
        'Son katman numarası periyot, s ve p bloğunda son katmandaki elektron sayısı grup numarasını verir: 3s² 3p⁵ → 3. periyot, 7A (17. grup).',
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
      kart(
        'Örnek',
        'Ca (20): [Ar] 4s² → 4. periyot, 2A. Al (13): [Ne] 3s² 3p¹ → 3. periyot, 3A. Ar (18): 3s² 3p⁶ → 8A, soy gaz.',
        undefined,
        { not: 'Üç örneği kendin dizilimden çıkar; formülü ezberlemek yerine bir kez yap.' },
      ),
      kart(
        'Yükü tahmin etme',
        '1A +1, 2A +2, 3A +3 katyon; 6A −2, 7A −1 anyon yapar. 4A çoğu zaman elektron paylaşır. Grup numarası iyon yükünü söyler.',
      ),
      kart(
        'Geçiş metalleri',
        '3–12. gruplar, d bloğu. Birden çok yük alabilirler (Fe²⁺ ve Fe³⁺); adlarında Roma rakamı bu yüzden gerekir.',
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
      sikli('Metaller tabloda nerededir?', ['Sağda', 'Solda'], 1, 'Ametaller sağda, yarı metaller basamakta.'),
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
        kart: 2,
      },
      {
        soru: 'Elektron veren atom ne olur?',
        siklar: ['Katyon (+)', 'Anyon (−)'],
        dogru: 0,
        aciklama: {
          dogru: 'Negatif yük gitti, proton fazlası kaldı; yük pozitif.',
          yanlis: 'Anyon elektron alan atom. Elektron veren atomda proton sayısı elektronu geçer ve yük pozitif olur.',
        },
        kart: 6,
      },
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
        undefined,
        { not: 'Dört eğilimin dördü de aynı iki güçten çıkar; yönleri ezberleme, çekim ile perdelemeyi düşün.' },
      ),
      kart(
        'Metalik ve ametalik karakter',
        'Metalik özellik soldan sağa azalır, aşağı doğru artar; ametalik özellik tam tersi. En metalik köşe sol alt (Fr), en ametalik sağ üst (F).',
      ),
      kart(
        'Elektron ilgisi',
        'Gaz atomunun bir elektron alırken saldığı enerji. Halojenlerde en yüksek; soy gazlarda anlamlı değil, elektron almazlar.',
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
      soru('İkinci iyonlaşma enerjisi her zaman birinciden büyüktür.', true, 'Değerlik elektronları bitince sıçrama çok büyür.'),
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
        kart: 2,
      },
    ]),
  ]),
  tema('kim9-t2', 'Çeşitlilik', [
    konu('kim9-metalik', 'Metalik Bağ', [
      kart(
        'Elektron denizi',
        'Metal atomları valans elektronlarını ortak bir havuza bırakır. Pozitif çekirdekler bu elektron denizinde yüzer.',
        undefined,
        { not: 'Bu tek benzetme metallerin dört özelliğini birden açıklıyor; önce bunu otur.' },
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
      kart(
        'Alaşımlar',
        'Metaller elektron denizini paylaştığı için birbiriyle kolay karışır; çelik ve pirinç bu yüzden mümkün. Alaşım çoğu zaman saf metalden serttir.',
      ),
    ], [
      soru('Metallerin elektriği iletmesi, serbestçe hareket eden değerlik elektronlarındandır.', true, 'Elektron denizi modeli bunu anlatıyor.'),
      soru('Metaller darbe aldığında iyonik katılar gibi kırılır.', false, 'Elektron denizi katmanların kaymasına izin verdiği için metal şekil değiştirir.'),
      soru('Metalik bağ güçlendikçe erime noktası yükselir.', true, 'Taneciği ayırmak için daha çok enerji gerekiyor.'),
      soru('Metallerin parlaklığı yüzeydeki oksit tabakasından gelir.', false, 'Serbest elektronların ışığı yansıtmasından gelir; oksit tabakası tersine matlaştırır.'),
      sikli('Metalin parlak görünmesinin sebebi?', ['Serbest elektronların ışığı geri salması', 'Yüzeyinin pürüzsüz olması'], 0, 'Elektron denizi ışığı soğurup geri verir.'),
      sikli('Metallerin tel çekilebilmesinin sebebi?', ['Katmanlar kayınca bağ kopmaz', 'İyonlar birbirini iter'], 0, 'Elektron denizi yeni düzeni sarar.'),
      soru('Valans elektron sayısı arttıkça metalik bağ güçlenir.', true, 'Erime noktası da yükselir.'),
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
        'Nasıl oluşur?',
        'Metal elektron verir, ametal alır; zıt yüklü iyonlar arasındaki elektriksel çekim iyonik bağdır.',
      ),
      kart(
        'Formül nasıl bulunur?',
        'Yükler çaprazlanır: Al³⁺ ile O²⁻ → Al₂O₃; Ca²⁺ ile Cl⁻ → CaCl₂. Toplam yük sıfır olmalı; oran sadeleşiyorsa sadeleştir (Mg²⁺ + O²⁻ → MgO).',
        undefined,
        { not: 'Çaprazladıktan sonra hep kontrol et: toplam yük sıfır mı?' },
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
      kart(
        'Suda çözünme',
        'Su polar molekül; iyonları zıt uçlarından sararak örgüden koparır. Çözelti iyon içerdiği için elektriği iletir.',
      ),
    ], [
      soru('İyonik bağ, metal ile ametal arasında elektron aktarımıyla oluşur.', true, 'Metal verir, ametal alır; zıt yüklü iyonlar birbirini çeker.'),
      soru('İyonik katılar katı hâlde elektriği iyi iletir.', false, 'İyonlar örgüde sabit; iletim ancak erimiş hâlde ya da sulu çözeltide olur.'),
      soru('İyonik bileşikler hem sert hem kırılgandır.', true, 'Örgü kayınca aynı yüklü iyonlar karşılaşıyor ve kristal çatlıyor.'),
      soru('İyonik bileşiklerin erime noktaları düşüktür.', false, 'Örgüdeki çekim güçlü olduğu için erime noktaları yüksektir.'),
      sikli('Al³⁺ ile O²⁻ hangi formülü verir?', ['AlO', 'Al₂O₃'], 1, 'Yükler çaprazlanır.'),
      sikli('NaCl formülü ne söyler?', ['Bir molekülün yapısını', 'İyonların oranını'], 1, 'İyonik bileşikte molekül yok, örgü var.'),
      sikli('Sofra tuzu hangi durumda elektriği iletir?', ['Katı', 'Eriyik ya da çözelti'], 1, 'İyonlar serbest olmalı.'),
      soru('İyonik katılar sert ama kırılgandır.', true, 'Katmanlar kayınca aynı yükler karşılaşır.'),
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
        'Ortak kullanılan elektron',
        'İki ametal elektronlarını ortaklaşa kullanır. Alışveriş değil paylaşım olduğu için iyon oluşmaz.',
      ),
      kart(
        'Kaç bağ kurar?',
        'Atom, oktetine kaç elektron eksikse o kadar bağ kurar: H 1, O 2, N 3, C 4. Su bu yüzden H₂O, amonyak NH₃, metan CH₄.',
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
        { not: 'Metal-ametal iyonik, ametal-ametal kovalent; ilk soru bu, gerisi sonra.' },
      ),
      kart(
        'Bağ enerjisi',
        'Bağı koparmak için gereken enerji. Bağ ne kadar kısa ve katlıysa enerji o kadar büyük; C≡C > C=C > C−C.',
      ),
    ], [
      soru('Kovalent bağda elektronlar ortaklaşa kullanılır.', true, 'Ametaller elektron almak istediği için aktarım yerine ortaklık kuruluyor.'),
      soru('İki farklı ametal arasında oluşan bağ polar kovalenttir.', true, 'Elektronegatiflik farkı elektronları bir tarafa yaklaştırıyor.'),
      soru('H₂ molekülündeki bağ polar kovalenttir.', false, 'Aynı iki atom arasında elektronegatiflik farkı yok; bağ apolar.'),
      soru('Kovalent bağ yalnızca metal atomları arasında oluşur.', false, 'Ametaller arasında oluşur; metaller arasındaki bağ metalik bağdır.'),
      sikli('Karbon atomu kaç kovalent bağ kurar?', ['2', '4'], 1, 'Oktetine 4 elektron eksik: CH₄.'),
      sikli('H₂ molekülündeki bağ türü?', ['Polar kovalent', 'Apolar kovalent'], 1, 'Aynı atomlar, eşit paylaşım.'),
      sikli('En güçlü bağ hangisidir?', ['C−C', 'C≡C'], 1, 'Katlı bağ kısa ve güçlü.'),
      soru('N₂ molekülünün üçlü bağı kolay kopar.', false, 'Çok zor kopar; azot gazı bu yüzden tepkimeye isteksiz.'),
      soru('Su molekülünde oksijen iki bağ kurar.', true, 'O\'nun oktetine 2 elektron eksik.'),
    ], [
      {
        soru: 'HCl molekülündeki bağ hangi türdür?',
        siklar: ['İyonik', 'Polar kovalent'],
        dogru: 1,
        aciklama: {
          dogru: 'İki ametal elektron paylaşıyor; Cl daha elektronegatif olduğu için paylaşım eşit değil.',
          yanlis: 'İyonik bağ metal ile ametal arasında olur. H ve Cl ikisi de ametal, elektron paylaşırlar; farklı elektronegatiflik bağı polar yapar.',
        },
        kart: 3,
      },
    ]),
    konu('kim9-lewis', 'Lewis Nokta Yapısı', [
      kart(
        'Ne gösterir?',
        'Valans elektronları nokta ile, ortaklaşılan çiftleri çizgi ile gösteren basit bir şema.',
      ),
      kart(
        'Valans elektron sayısı',
        'A grubu elementlerinde valans elektron sayısı grup numarasına eşittir: C 4, N 5, O 6, F 7. Lewis yapısı bu sayıyla başlar.',
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
        { not: 'Çizmeden önce toplam valans elektronunu say; çoğu hata sayım atlanınca oluyor.' },
      ),
      kart(
        'Ortaklanmamış çift',
        'Bağa katılmayan elektron çiftleri de çizilir. Molekülün şeklini ve polarlığını bunlar belirler.',
      ),
      kart(
        'Oktete uymayanlar',
        'BeCl₂ ve BF₃ oktetin altında, PCl₅ ve SF₆ üstünde kalır. Kural her zaman geçerli bir yasa değil, güçlü bir eğilimdir.',
      ),
      kart(
        'Örnekler',
        'H₂O: O\'nun çevresinde iki bağ, iki ortaklanmamış çift. NH₃: üç bağ, bir çift. CO₂: iki ikili bağ, her O\'da iki çift.',
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
        { not: 'Bağa değil şekle bak; CO₂ örneği bu ayrımın kendisi.' },
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
        'Hızlı kural',
        'Merkez atomda ortaklanmamış çift yoksa ve bağlı atomlar aynıysa molekül apolar (CO₂, CH₄, BF₃); çift varsa ya da atomlar farklıysa polar (H₂O, NH₃, CHCl₃).',
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
      sikli('H₂O molekülünün polar olmasının sebebi?', ['Bağlarının apolar olması', 'Açısal şekil'], 1, 'Dipoller toplanır, birbirini götürmez.'),
      sikli('CH₄ molekülü nasıldır?', ['Polar', 'Apolar'], 1, 'Merkezde çift yok, bağlı atomlar aynı.'),
      soru('Yağın suda çözünmemesi "benzer benzeri çözer" kuralının sonucudur.', true, 'Apolar yağ, polar su.'),
    ], [
      {
        soru: 'CO₂ molekülü neden apolardır?',
        siklar: ['Bağları apolar olduğu için', 'Dipoller ters yönde, birbirini götürür'],
        dogru: 1,
        aciklama: {
          dogru: 'C=O bağları polar ama molekül doğrusal; iki eşit dipol zıt yönde toplanınca sıfır.',
          yanlis: 'C=O bağı polardır. Molekülü apolar yapan bağ değil geometri: doğrusal dizilişte iki dipol birbirini götürür.',
        },
        kart: 1,
      },
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
        { not: 'Poliatomik iyonları bir kâğıda yaz, birkaç gün gözünün önünde dursun.' },
      ),
      kart(
        'Yaygın adlar',
        'Bazı bileşikler sistematik adıyla anılmaz: H₂O su, NH₃ amonyak, NaCl sofra tuzu, CaCO₃ kireç taşı.',
      ),
      kart(
        'Sık çıkan örnekler',
        'Fe₂O₃ demir(III) oksit, FeO demir(II) oksit, SO₂ kükürt dioksit, PCl₅ fosfor pentaklorür, MgCl₂ magnezyum klorür, Na₂SO₄ sodyum sülfat.',
      ),
    ], [
      soru('CO₂ bileşiğinin adı karbon dioksittir.', true, 'İki ametal; ikinci elemente atom sayısını gösteren ön ek geliyor.'),
      soru('İyonik bileşikler adlandırılırken önce ametal yazılır.', false, 'Önce metal (katyon), sonra ametal yazılır.'),
      soru('CuSO₄ bileşiği bakır(II) sülfat diye adlandırılır.', true, 'Bakır birden çok değerlik aldığı için değerliği Roma rakamıyla belirtiliyor.'),
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
          yanlis: 'Roma rakamı metallerin değerliği için kullanılır. İki ametalin bileşiğinde atom sayıları ön ekle söylenir: diazot tetraoksit.',
        },
        kart: 3,
      },
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
      kart(
        'Kaynama noktasını tahmin etme',
        'Önce hidrojen bağına bak, sonra polarlığa, sonra molekül kütlesine. HF > HCl\'yi hidrojen bağı, I₂ > Br₂ > Cl₂\'yi molekül büyüklüğü açıklar.',
        undefined,
        { not: 'Sıralama sorusunda üç adımı hep aynı sırayla uygula: hidrojen bağı, polarlık, kütle.' },
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
      soru('Suyu kaynatmak molekül içindeki bağı koparır.', false, 'Moleküller arası çekimi koparır.'),
      soru('Van der Waals, London ve dipol-dipol etkileşimlerinin ortak adıdır.', true, 'Maddenin hâlini belirler.'),
    ], [
      {
        soru: 'Suyun kaynama noktasının benzer moleküllerden çok yüksek olmasının sebebi?',
        siklar: ['Hidrojen bağı', 'London kuvvetleri'],
        dogru: 0,
        aciklama: {
          dogru: 'H, O\'ya bağlı; moleküller arasında güçlü hidrojen bağları var ve onları koparmak enerji ister.',
          yanlis: 'London kuvvetleri her molekülde var ve zayıf. Suyu ayıran şey H–O bağının yarattığı güçlü hidrojen bağı.',
        },
        kart: 5,
      },
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
        { not: 'Katının türü belliyse özellikleri tek tek ezberleme; tutan etkileşimden türet.' },
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
      sikli('Cam hangi tür katıdır?', ['Kristal', 'Amorf'], 1, 'Yumuşayarak erir, keskin erime noktası yok.'),
      sikli('Kuru buz hangi katı türüdür?', ['Kovalent ağ', 'Moleküler'], 1, 'Yumuşak, düşük erime noktalı.'),
      sikli('Elmas ile grafiti ayıran nedir?', ['Element türü', 'Atom dizilimi'], 1, 'İkisi de karbon.'),
      soru('Kovalent ağ katıları çok yüksek erime noktalıdır.', true, 'Elmas ve kuvars.'),
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
        undefined,
        { not: 'Kaynama bir sıcaklık değil, iki basıncın eşitlendiği an; rakım sorusu buradan çıkar.' },
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
      sikli('Su damlasının yuvarlak olmasının sebebi?', ['Yüzey gerilimi', 'Viskozite'], 0, 'Yüzey moleküller içeri çekilir.'),
      sikli('Adezyon kohezyondan güçlüyse ince boruda sıvı?', ['Yükselir', 'Alçalır'], 0, 'Kılcallık.'),
      sikli('Sıcaklık artınca viskozite?', ['Azalır', 'Artar'], 0, 'Bal ısınınca akıcılaşır.'),
      soru('Buhar basıncı sıcaklık arttıkça büyür.', true, 'Moleküller arası çekim zayıfladıkça da.'),
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
        undefined,
        { not: 'Küpü bölme örneğini kendin yap: neden nano daha tepkin, sayıyla gör.' },
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
      sikli('1 nanometre metrenin kaçta biridir?', ['Milyarda', 'Milyonda'], 0, '10⁻⁹ m.'),
      sikli('Gümüş nanoparçacık tekstilde ne için kullanılır?', ['Mikrop öldürücü', 'Renk verici'], 0, 'Altın nanoparçacık tanı testlerinde.'),
      soru('Nanoparçacıkların sağlık etkileri tümüyle bilinmektedir.', false, 'Hâlâ araştırılıyor; hücre zarını geçebilirler.'),
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
        { not: 'Az miktar zararsız değil; zincirin sonunda kimin olduğunu unutma.' },
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
      sikli('Çelik neyin alaşımıdır?', ['Bakır ve çinko', 'Demir ve karbon'], 1, 'Bakır-çinko pirinç.'),
      sikli('Metalin çevreyle tepkimeye girip aşınmasına ne denir?', ['Ötrofikasyon', 'Korozyon'], 1, 'Paslanma en yaygın örnek.'),
      soru('Metal geri kazanımı ekolojik ayak izini azaltır.', true, 'Cevherden üretime göre çok daha az yük.'),
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
        { not: 'Sıra ters çevrilemez; "geri dönüşüm" en iyisi değil, üçüncüsü.' },
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
      sikli('Girenlerin ne kadarının ürüne dönüştüğünün ölçüsü?', ['Atom ekonomisi', 'Kimyasal ayak izi'], 0, 'Yüksek verim az atık.'),
      sikli('Atık hiyerarşisinde en kötü seçenek?', ['Depolamak', 'Yeniden kullanmak'], 0, 'En iyisi hiç üretmemek.'),
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
