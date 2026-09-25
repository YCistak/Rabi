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
        'Maddenin yapısını, özelliklerini ve değişimini inceler.\nYediğimiz ilaçtan giydiğimiz kumaşa kadar her şey kimyanın konusudur.',
      ),
      kart(
        'Fiziksel ve kimyasal değişim',
        '- **Fiziksel:** madde kimliğini korur (buzun erimesi)\n- **Kimyasal:** yeni madde oluşur (demirin paslanması)',
      ),
      kart(
        'Değişimi nasıl ayırt edersin?',
        'Kimyasal değişimin işaretleri:\n- Renk ya da koku değişimi\n- Gaz çıkışı, çökelek oluşması\n- Geri döndürülememe\nErime, çözünme ve kırılma fizikseldir.',
        undefined,
        { not: 'Şeker suda çözünmesi fiziksel (buharlaştır, şeker geri gelir); şekerin karamelleşmesi kimyasal.' },
      ),
      kart(
        'Temizlik ürünleri',
        'Sabun ve deterjan molekülünün bir ucu suyu, öbür ucu yağı sever.\nYağı kavrayıp suya taşıdıkları için kir çözülür.',
      ),
      kart(
        'Asit ve baz evde',
        '- **Asit:** limon suyu, sirke, kola\n- **Baz:** sabun, çamaşır suyu, kabartma tozu\nKireç çözücüler asit, yağ çözücüler baz içerir.',
      ),
      kart(
        'Mutfakta kimya',
        '- **Kabartma tozu:** ısınınca CO₂ verir, hamuru kabartır.\n- **Ekmeğin kızarması:** şeker ile proteinin tepkimesidir.',
      ),
      kart(
        'Doğal olan zararsız değildir',
        'Zehirliliği kaynak değil, **doz ve yapı** belirler.\nEn güçlü zehirlerin bir kısmı bitki ve mantar kökenlidir.',
      ),
      kart(
        'Kimya olmadan olmazdı',
        '- **Gübre olmasa:** tarım bugünkü nüfusu besleyemezdi.\n- **Antibiyotik olmasa:** basit bir enfeksiyon öldürücü kalırdı.',
      ),
    ], [
      soru('Kâğıdın yanması kimyasal, yırtılması fiziksel bir değişimdir.', true, 'Yanmada yeni maddeler oluşuyor, yırtılmada kâğıt kâğıt olarak kalıyor.'),
      soru('Doğal olan her madde insan için zararsızdır.', false, 'Yılan zehri de doğal; zararı doğallığı değil yapısı ve miktarı belirliyor.'),
      soru('Buzun erimesi kimyasal bir değişimdir.', false, 'Madde yine su; yalnızca hâli değişiyor.'),
      soru('Sirkenin ekşi tadı yapısındaki asitten gelir.', true, 'Sirkedeki asetik asit bu tadı veriyor.'),
      sikli('Hangisi evde bulunan bir bazdır?', ['Sirke', 'Çamaşır suyu'], 1, 'Sirke asetik asit içerir; çamaşır suyu bazik.'),
      sikli('Hamuru kabartan gaz hangisidir?', ['Oksijen', 'Karbondioksit'], 1, 'Kabartma tozu ısınınca CO₂ verir.'),
      sikli('Kireç çözücüler hangi sınıftandır?', ['Baz', 'Asit'], 1, 'Yağ çözücüler bazdır.'),
      sikli('Sabunun yağı çözmesinin sebebi?', ['Yağı buharlaştırır', 'Bir ucu suyu, bir ucu yağı sever'], 1, 'Yağı kavrayıp suya taşır.'),
      soru('Ekmeğin kızarması kimyasal bir değişimdir.', true, 'Şeker ile protein tepkimeye girip yeni maddeler oluşturuyor.'),
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
        'Kaplardaki eşkenar dörtgen işaretler tehlikenin türünü söyler.\nEtiket okunmadan hiçbir kaba dokunulmaz.',
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
        '- **Alev:** yanıcı\n- **Kafatası:** zehirli\n- **Damla ve el:** aşındırıcı\n- **Patlama:** patlayıcı\n- **Ağaç ve balık:** çevreye zararlı',
      ),
      kart(
        'Asidi suya ekle',
        'Suyu aside dökmek şiddetli ısı açığa çıkarır, sıvı sıçrar.\nDoğrusu: **asidi yavaşça suya eklemek**.',
        undefined,
        { not: 'Derişik H₂SO₄ suya eklenir; tersi kaynar sıçrar. Ezber: \'Asit suya, su aside değil.\'' },
      ),
      kart(
        'Koklama, tatma',
        '- **Koklarken:** koku elle yüze doğru yelpazelenir.\n- **Tatmak:** hiçbir koşulda yapılmaz.',
      ),
      kart(
        'Kişisel koruyucular',
        'Gözlük, eldiven ve önlük laboratuvarda seçenek değil kuraldır.\nGöz, sıçrayan bir damlayı bile tolere etmez.',
      ),
      kart(
        'Karıştırılmayan ikili',
        'Çamaşır suyu ile tuz ruhu birlikte **klor gazı** verir.\nÜrünleri karıştırmak, evde zehirlenmenin en sık sebebidir.',
      ),
      kart(
        'Atık nereye?',
        'Kimyasal atık lavaboya dökülmez, türüne göre ayrı kaplarda toplanır.\nKarışan atıklar beklenmedik tepkime verebilir.',
      ),
      kart(
        'Yangında ne yapılır?',
        'Yağ ve elektrik yangınına su dökülmez:\n- **Yağ:** su ile sıçrar.\n- **Elektrik:** su akımı iletir.\nKapak ya da yangın battaniyesiyle hava kesilir.',
      ),
    ], [
      soru('Asit sulandırılırken su, asidin üzerine yavaşça dökülür.', false, 'Tersi yapılır: asit suya eklenir; su üstüne dökülen asit sıçrayabilir.'),
      soru('Çamaşır suyu ile tuz ruhu birlikte kullanılmamalıdır.', true, 'Karışımdan zehirli klor gazı açığa çıkıyor.'),
      soru('Laboratuvarda bir kimyasalın kokusu doğrudan burna çekilerek denenir.', false, 'Koklama elle yelpazeleyerek yapılır; tatma hiç yapılmaz.'),
      soru('Kimyasal atıklar lavaboya değil, ayrılmış atık kaplarına dökülür.', true, 'Lavaboya dökülen atık suyla birlikte çevreye karışıyor.'),
      sikli('Kaptaki alev işareti ne anlatır?', ['Aşındırıcı', 'Yanıcı'], 1, 'Aşındırıcı için sıçrayan damla ve el işareti.'),
      sikli('Kaptaki kafatası işareti ne anlatır?', ['Zehirli', 'Yanıcı'], 0, 'Yanıcı maddenin işareti alev.'),
      sikli('Yağ yangınına ne yapılmaz?', ['Kapak kapatılmaz', 'Su dökülmez'], 1, 'Su yağı sıçratır; hava kesilir.'),
      soru('Laboratuvarda koruyucu gözlük takmak isteğe bağlıdır.', false, 'Gözlük, eldiven ve önlük kuraldır; göz tek damlayı bile tolere etmez.'),
      soru('Elektrik yangınına su dökülmez.', true, 'Su akımı iletir; önce elektrik kesilir, sonra uygun söndürücü kullanılır.'),
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
        'Karbon bileşiklerini inceler.\nPlastik, ilaç, boya ve yakıtların neredeyse tamamı bu dalın konusudur.',
      ),
      kart(
        'Anorganik kimya',
        'Karbon dışı elementleri, özellikle metalleri ve mineralleri inceler.\nKatalizörler ve seramikler buradan çıkar.',
      ),
      kart(
        'Analitik kimya',
        'İki soruyu sorar: ne var, ne kadar var?\nÖrnek: su tahlili, doping kontrolü, gıda denetimi',
      ),
      kart(
        'Fizikokimya',
        'Tepkimenin neden ve ne hızla olduğunu inceler.\nEnerji, denge ve hız bu dalın konusudur.',
      ),
      kart(
        'Biyokimya',
        'Canlıdaki tepkimeleri inceler: enzimler, proteinler, DNA.\nBiyoloji ile kimyanın kesiştiği yerdir.',
      ),
      kart(
        'Polimer kimyası',
        'Küçük birimlerin (monomer) uzun zincirler kurmasını inceler.\nLastikten naylona kadar her şey polimerdir.',
      ),
      kart(
        'Hangi dal hangi soruyu sorar?',
        '- **"Bu madde ne?"** analitik\n- **"Nasıl ve neden tepkir?"** fizikokimya\n- **"Canlıda ne olur?"** biyokimya\n- **"Karbon bileşiği mi?"** organik',
        undefined,
        { not: 'Doping testi ve su tahlili analitik; ilaç molekülü organik; enzim biyokimya. Sınav örnekle sorar.' },
      ),
      kart(
        'Çevre kimyası',
        'Su, hava ve topraktaki kirleticileri ve dönüşümlerini inceler.\nAsit yağmuru, ağır metal kirliliği ve mikroplastik bu dalın konusudur.',
      ),
    ], [
      soru('Organik kimya, karbon bileşiklerini inceleyen alt disiplindir.', true, 'Yakıtlar, plastikler ve ilaçların çoğu bu alanın konusu.'),
      soru('Analitik kimya, bir örnekte hangi maddenin ne kadar bulunduğunu belirler.', true, 'Nitel ve nicel analiz bu alanın işi.'),
      soru('Canlılardaki tepkimeleri inceleyen alt disiplin biyokimya değildir.', false, 'Tam da biyokimyadır; canlıdaki kimyasal süreçleri inceler.'),
      soru('Anorganik kimya yalnızca karbon bileşiklerini inceler.', false, 'Karbon bileşikleri organik kimyanın; anorganik kimya karbon dışı elementlere bakar.'),
      sikli('Katalizör ve seramikler hangi dalın konusudur?', ['Anorganik kimya', 'Biyokimya'], 0, 'Anorganik kimya metalleri ve mineralleri inceler.'),
      sikli('Tepkimenin hızını ve enerjisini inceleyen dal?', ['Fizikokimya', 'Biyokimya'], 0, 'Biyokimya canlıdaki tepkimeleri inceler.'),
      soru('Polimer kimyası küçük birimlerin uzun zincir kurmasını inceler.', true, 'Lastikten naylona her şey polimer.'),
      soru('Asit yağmurunu inceleyen alt disiplin çevre kimyasıdır.', true, 'Çevre kimyası su, hava ve topraktaki kirleticileri inceler.'),
      sikli('Toprak ve sudaki kirleticileri inceleyen dal hangisidir?', ['Biyokimya', 'Çevre kimyası'], 1, 'Biyokimya canlıdaki tepkimeleri inceler.'),
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
        '- İlaç, gıda ve kozmetik\n- Boya ve tekstil\n- Enerji ve arıtma\n- Kalite kontrol laboratuvarları',
      ),
      kart(
        'Hangi bölümler?',
        'Kimya bilgisinin üstüne kurulu bölümler:\n- Kimya ve kimya mühendisliği\n- Kimya öğretmenliği ve eczacılık\n- Gıda mühendisliği ve malzeme bilimi',
      ),
      kart(
        'Adli kimya',
        'Olay yerindeki kalıntıyı çözümler: kan, barut artığı, uyuşturucu.\nMahkemedeki delillerin bir kısmı bu analizden çıkar.',
      ),
      kart(
        'İlaç geliştirme',
        'Bir molekülün etkili ve güvenli olduğunu göstermek yıllar sürer.\nKimyager bu zincirin ilk halkasıdır.',
      ),
      kart(
        'Kalite kontrol',
        'Üretilen her partinin standarda uyduğunu ölçer.\nGıda ve ilaçta yasal olarak zorunludur.',
      ),
      kart(
        'Kimya mühendisi ile farkı',
        '- **Kimyager:** tepkimeyi laboratuvarda bulur.\n- **Kimya mühendisi:** onu fabrika ölçeğinde, ekonomik biçimde üretir.',
        undefined,
        { not: 'Kimyager: \'bu tepkime olur mu?\' Kimya mühendisi: \'günde 10 ton nasıl üretiriz?\' Ölçek farkı.' },
      ),
      kart(
        'Çevre ve arıtma',
        'Atık su arıtma ve hava kalitesi ölçümü kimyagerin işidir.\nBelediyeler ve çevre laboratuvarları bu alanda istihdam eder.',
      ),
    ], [
      soru('Adli kimya, suç kanıtlarının çözümlenmesinde kimya bilgisini kullanır.', true, 'Kan, boya ve toz örneklerinin analizi bu alanın işi.'),
      soru('Kimyager ile kimya mühendisinin işi tümüyle aynıdır.', false, 'Kimyager maddeyi ve tepkimeyi, mühendis üretimin büyük ölçekte kurulmasını ele alır.'),
      soru('İlaç geliştirme sürecinde kimyacılara ihtiyaç duyulmaz.', false, 'Etken maddenin tasarımı ve sentezi doğrudan kimyanın işi.'),
      soru('Kalite kontrol laboratuvarları kimya mezunlarının çalıştığı yerlerdendir.', true, 'Ürünün istenen bileşimde olup olmadığı orada ölçülüyor.'),
      sikli('Kimyagerlerin çalıştığı sektörlerden biri hangisidir?', ['Boya ve tekstil', 'Yalnızca üniversite'], 0, 'İlaç, gıda, boya, enerji ve kalite kontrol de kimyager istihdam eder.'),
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
        'Her yeni deney, öncekinin açıklayamadığı bir şeyi gösterdi.\nModel çürütülmez; sınırı bulunur ve yerine daha genişi geçer.',
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
        { not: 'Sıra: Dalton (bölünmez) → Thomson (üzümlü kek) → Rutherford (çekirdek) → Bohr (katman) → Modern (orbital).' },
      ),
      kart(
        'Dalton\'dan Thomson\'a',
        '- **Dalton:** atom bölünmez, içi dolu bir küre\n- **Thomson:** elektronu keşfetti, "üzümlü kek" modeli\nThomson’da elektronlar pozitif bir hamura gömülüdür.',
      ),
      kart(
        'Rutherford deneyi',
        'İnce altın levhaya gönderilen parçacıkların çoğu geçti, birkaçı geri sekti.\nSonuç: atomun içi çoğunlukla boş, kütlesi küçük bir çekirdekte.',
      ),
      kart(
        'Bohr atom teorisi',
        'Elektron, çekirdek çevresinde belirli enerjili katmanlarda döner.\nKatman değiştirirken ışık salar ya da soğurur.',
      ),
      kart(
        'Modern atom teorisi',
        'Elektronun yeri kesin bilinemez, yalnızca bulunma olasılığı bilinir.\nYörünge yerine bulut gibi bir bölge vardır.',
      ),
      kart(
        'Tanecikler',
        '- **Kütle:** neredeyse tamamı çekirdekte\n- **Hacim:** elektronların kapladığı alan belirler',
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
        '**Proton sayısı** elementi belirler; değişirse element değişir.\nNötr atomda proton sayısı = elektron sayısı',
      ),
      kart(
        'Kütle numarası',
        '**Kütle numarası = proton + nötron**\nElektronun kütlesi çok küçük olduğu için sayılmaz.',
      ),
      kart(
        'İzotop',
        'Proton sayısı aynı, nötron sayısı farklı atomlardır.\nKimyasal özellikleri aynı, kütleleri farklıdır.',
      ),
      kart(
        'Emisyon ve absorbsiyon',
        '- **Absorbsiyon:** elektron üst katmana çıkarken enerji soğurur.\n- **Emisyon:** alt katmana inerken enerji salar.\nHer elementin çizgileri kendine özgüdür.',
      ),
      kart(
        'Gösterim',
        '- **Sol üst:** kütle numarası\n- **Sol alt:** atom numarası\nNötron sayısı = kütle numarası − proton sayısı',
      ),
      kart(
        'İyonda sayılar',
        '- **Katyon:** elektron, protondan yük kadar az (Na⁺: 11 p, 10 e)\n- **Anyon:** elektron, protondan yük kadar fazla (Cl⁻: 17 p, 18 e)',
      ),
    ], [
      soru('Rutherford un deneyi, atom kütlesinin büyük kısmının küçük bir çekirdekte toplandığını gösterdi.', true, 'Işınların çok azının geri sekmesi bunun kanıtıydı.'),
      soru('İzotop atomların proton sayıları farklıdır.', false, 'Proton sayıları aynı, nötron sayıları farklıdır; proton değişseydi element değişirdi.'),
      soru('Bir elementin kimliğini kütle numarası belirler.', false, 'Kimliği atom numarası, yani proton sayısı belirler.'),
      soru('Elektron üst enerji seviyesinden alt seviyeye inerken ışık yayar.', true, 'Aradaki enerji farkı ışık olarak salınıyor; emisyon spektrumu böyle oluşuyor.'),
      sikli('"Üzümlü kek" modelini kuran kimdir?', ['Dalton', 'Thomson'], 1, 'Dalton içi dolu bölünmez küre dedi.'),
      sikli('Elektronun belirli enerjili katmanlarda döndüğünü söyleyen model?', ['Modern atom teorisi', 'Bohr'], 1, 'Modern teoride yörünge değil olasılık bulutu var.'),
      sikli('Na⁺ iyonunda kaç elektron vardır? (Na: 11)', ['10', '12'], 0, 'Katyonda elektron, protondan yük kadar az: 11 − 1 = 10.'),
      sikli('Modern atom teorisinde elektronun konumu için ne söylenir?', ['Yalnızca bulunma olasılığı bilinir', 'Kesin yörüngesi bilinir'], 0, 'Kesin yörünge Bohr modelinindir; modern teori olasılık bulutu der.'),
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
        'Elektronun bulunma olasılığının en yüksek olduğu bölgedir.\n- **s orbitali:** küresel\n- **p orbitali:** sekiz şeklinde',
      ),
      kart(
        'Orbital türleri',
        'Her orbital en çok **iki elektron** alır.\nOrbital sayısı, alt katmanın kapasitesini belirler.',
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
        'Elektronlar en düşük enerjili orbitalden başlayarak yerleşir.\nSıra: 1s → 2s → 2p → 3s → 3p → 4s → 3d',
      ),
      kart(
        'Katman kapasitesi',
        'Her katman en çok **2n²** elektron alır:\n- **1. katman:** 2\n- **2. katman:** 8\n- **3. katman:** 18',
      ),
      kart(
        'Neden 4s, 3d’den önce?',
        'Sırayı katman numarası değil **enerji** belirler.\n4s orbitalinin enerjisi 3d’den düşüktür.',
        undefined,
        { not: 'K (19): [Ar] 4s¹, 3d¹ değil. Sıra: 1s 2s 2p 3s 3p 4s 3d 4p. Diyagonal kuralı çizmeden yazma.' },
      ),
      kart(
        'Pauli dışlama ilkesi',
        'Bir orbitalde en fazla iki elektron bulunur ve spinleri zıttır.\nDört kuantum sayısı aynı olan iki elektron olamaz.',
      ),
      kart(
        'Hund kuralı',
        'Eş enerjili orbitallere elektronlar önce **birer birer**, aynı spinle yerleşir.\nHepsi dolunca eşleşmeye başlarlar.',
      ),
      kart(
        'Valans elektron',
        'En dış katmandaki elektronlardır.\nElementin kimyasal davranışını pratikte bunlar belirler.',
      ),
      kart(
        'Küresel simetri',
        'Yarı ya da tam dolu alt katman (p³, p⁶, d⁵, d¹⁰) ek kararlılık verir.\nCr ve Cu’nun dizilimi bu yüzden şaşırtır.',
      ),
      kart(
        'Dizilim örnekleri',
        '- **Na (11):** 1s² 2s² 2p⁶ 3s¹\n- **Cl (17):** 1s² 2s² 2p⁶ 3s² 3p⁵\nSon katmandaki elektron: Na’da 1, Cl’de 7',
      ),
      kart(
        'Kısaltılmış gösterim',
        'Bir önceki soy gaz köşeli ayraçla yazılır:\n- **Na:** [Ne] 3s¹\n- **Ca:** [Ar] 4s²',
      ),
    ], [
      soru('Aufbau ilkesine göre elektronlar önce en düşük enerjili orbitali doldurur.', true, 'Sistem en kararlı, yani en düşük enerjili düzeni seçiyor.'),
      soru('Aynı orbitaldeki iki elektronun spinleri aynı yöndedir.', false, 'Pauli dışlama ilkesi zıt spin şartı koyuyor.'),
      soru('4s orbitalinin enerjisi 3d den düşük olduğu için önce dolar.', true, 'Doldurma sırasını baş kuantum sayısı değil enerji belirliyor.'),
      soru('Hund kuralına göre eş enerjili orbitallere elektronlar önce çiftler hâlinde yerleşir.', false, 'Önce her orbitale birer elektron girer, ancak hepsi dolunca eşleşme başlar.'),
      sikli('Bir orbital en fazla kaç elektron alır?', ['2', '8'], 0, 'Pauli: iki elektron, zıt spin.'),
      sikli('2. katman en fazla kaç elektron alır?', ['18', '8'], 1, '2n² = 2 · 4 = 8.'),
      sikli('p alt katmanı en fazla kaç elektron alır?', ['10', '6'], 1, 'Üç orbital × 2 elektron = 6. d alt katmanı 10 alır.'),
      sikli('Na (11) için kısaltılmış dizilim?', ['[Ne] 3s¹', '[He] 3s¹'], 0, 'Bir önceki soy gaz Ne.'),
      sikli('Kimyasal davranışı pratikte belirleyen elektronlar?', ['İç katman elektronları', 'Valans (en dış) elektronlar'], 1, 'En dıştakiler bağ kurar.'),
      sikli('Cr ve Cu\'nun diziliminin şaşırtmasının sebebi?', ['Pauli ilkesi', 'Küresel simetri'], 1, 'Yarı ya da tam dolu alt katman ek kararlılık verir.'),
      soru('Cl (17) atomunun son katmanında 7 elektron vardır.', true, '3s² 3p⁵.'),
      soru('p orbitali küresel şekillidir.', false, 's orbitali küresel, p orbitali sekiz şeklinde.'),
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
        'Periyot ve grup',
        '- **Periyot:** en yüksek katman numarası\n- **Grup:** valans elektron sayısı',
      ),
      kart(
        'Dizilimden yer bulma',
        '- **Son katman numarası:** periyot\n- **Son katmandaki elektron (s ve p bloğunda):** grup\nÖrnek: 3s² 3p⁵ → 3. periyot, 7A (17. grup)',
      ),
      kart(
        'Bloklar',
        'Son elektronun girdiği orbital bloğu verir:\n- **s ve p:** baş gruplar\n- **d:** geçiş metalleri\n- **f:** lantanit ve aktinitler',
      ),
      kart(
        'Grupların adları',
        '- **1A:** alkali metaller\n- **2A:** toprak alkali metaller\n- **7A:** halojenler\n- **8A:** soy gazlar',
      ),
      kart(
        'İyon oluşumu',
        '- **Elektron veren atom:** katyon (+)\n- **Elektron alan atom:** anyon (−)\nProton sayısı hiç değişmez.',
      ),
      kart(
        'İzoelektronik',
        'Elektron sayısı ve dizilimi aynı olan taneciklerdir.\nÖrnek: Na⁺, Ne ve F⁻, üçünde de 10 elektron',
      ),
      kart(
        'Soy gaza benzeme eğilimi',
        'Atomlar en yakın soy gazın diziliminde kararlı olur.\nMetaller elektron verir, ametaller alır.',
      ),
      kart(
        'Metal, ametal, yarı metal',
        '- **Metaller:** solda, iletken\n- **Ametaller:** sağda, yalıtkan\n- **Yarı metaller:** arada, koşula göre iletir',
      ),
      kart(
        'Örnek',
        '- **Ca (20):** [Ar] 4s² → 4. periyot, 2A\n- **Al (13):** [Ne] 3s² 3p¹ → 3. periyot, 3A\n- **Ar (18):** [Ne] 3s² 3p⁶ → 3. periyot, 8A',
        undefined,
        { not: 'Cl (17): 1s² 2s² 2p⁶ 3s² 3p⁵ → 3. periyot, 7A (son katmanda 7 e⁻). Periyot = katman, grup = valans.' },
      ),
      kart(
        'Yükü tahmin etme',
        '- **Katyon:** 1A +1, 2A +2, 3A +3\n- **Anyon:** 6A −2, 7A −1\n4A çoğu zaman elektron paylaşır.',
      ),
      kart(
        'Geçiş metalleri',
        '3–12. gruplar, yani d bloğudur.\nBirden çok yük alabilirler (Fe²⁺, Fe³⁺); adlarında Roma rakamı bu yüzden gerekir.',
      ),
    ], [
      soru('Periyot numarası, atomun elektron bulunan en yüksek enerji seviyesini verir.', true, 'Yatay sıralar bu seviyeye göre kuruluyor.'),
      soru('Aynı gruptaki elementlerin değerlik elektron sayıları aynıdır.', true, 'Benzer kimyasal davranışlarının sebebi bu.'),
      soru('Metaller elektron alarak negatif yüklü iyon oluşturur.', false, 'Metaller elektron verir ve pozitif iyon (katyon) olur.'),
      soru('Periyodik tablonun 1A grubuna soy gazlar denir.', false, '1A alkali metaller; soy gazlar 8A grubunda.'),
      sikli('Dizilimi 3s² 3p⁵ ile biten element hangi gruptadır?', ['7A (17)', '5A'], 0, '3s ve 3p\'deki elektronlar toplanır: 7.'),
      sikli('Ca (20) hangi periyottadır?', ['4', '2'], 0, '[Ar] 4s²; en yüksek katman 4.'),
      sikli('7A grubunun adı nedir?', ['Halojenler', 'Alkali metaller'], 0, 'Alkali metaller 1A grubunda.'),
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
        kart: 5,
      },
    ]),
    konu('kim9-periyodik-ozellik', 'Periyodik Özellikler', [
      kart(
        'Eğilimlerin özeti',
        'Dört özellik tabloda düzenli değişir.\nYönleri karışmasın diye tabloyu bir arada oku.',
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
        '- **Soldan sağa küçülür:** çekirdek yükü artar, elektronlar çekilir.\n- **Yukarıdan aşağı büyür:** katman sayısı artar.',
      ),
      kart(
        'İyonlaşma enerjisi',
        'Gaz hâlindeki atomdan bir elektron koparmak için gereken enerjidir.\n- **Soldan sağa:** artar\n- **Yukarıdan aşağı:** azalır',
      ),
      kart(
        'Ardışık iyonlaşma',
        'İkinci elektronu koparmak birinciden hep daha zordur.\nDeğerlik elektronları bitince sıçrama çok büyük olur.',
      ),
      kart(
        'Elektronegatiflik',
        'Bağdaki elektronu kendine çekme gücüdür.\n- **En yüksek:** flor\n- **En düşük:** fransiyum\nSoy gazlara genelde değer verilmez.',
      ),
      kart(
        'İyon yarıçapı',
        '- **Katyon:** kendi atomundan küçük (katman kaybeder)\n- **Anyon:** kendi atomundan büyük (itme artar)',
      ),
      kart(
        'Neden bu yönde değişir?',
        'İki şey yarışır:\n- Çekirdek yükü elektronu çeker.\n- İç katmanlar onu perdeler.\nBütün eğilimler bu yarışın sonucudur.',
        undefined,
        { not: 'Yarıçap: sağa küçülür, aşağı büyür. İyonlaşma enerjisi ve elektronegatiflik tam tersi: sağa ve yukarı artar.' },
      ),
      kart(
        'Metalik ve ametalik karakter',
        '- **Metalik:** soldan sağa azalır, aşağı doğru artar.\n- **Ametalik:** tam tersi.\nEn metalik köşe sol alt (Fr), en ametalik sağ üst (F).',
      ),
      kart(
        'Elektron ilgisi',
        'Gaz atomunun bir elektron alırken saldığı enerjidir.\n- **Halojenlerde:** en yüksek\n- **Soy gazlarda:** anlamlı değil, elektron almazlar',
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
      sikli('Periyodik eğilimleri belirleyen iki etken hangisidir?', ['Çekirdek yükü ve iç katmanların perdelemesi', 'Kütle ve hacim'], 0, 'Çekirdek elektronu çeker, iç katmanlar perdeler; eğilimler bu yarıştan çıkar.'),
      sikli('Cl⁻ iyonu Cl atomuna göre nasıldır?', ['Küçük', 'Büyük'], 1, 'Anyonda elektronlar arası itme artar, yarıçap büyür.'),
      sikli('En metalik element tabloda nerededir?', ['Sağ üst (F)', 'Sol alt (Fr)'], 1, 'Sağ üst en ametalik.'),
      sikli('Halojenlerde en yüksek olan özellik?', ['Elektron ilgisi', 'Metalik karakter'], 0, 'Elektron almaya en istekli grup.'),
      soru('Periyotta soldan sağa gidildikçe metalik özellik artar.', false, 'Sağa gidildikçe metalik özellik azalır, ametalik özellik artar.'),
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
        'Metal atomları valans elektronlarını ortak bir havuza bırakır.\nPozitif iyonlar bu **elektron denizinde** durur.',
        undefined,
        { not: 'Metal tele çekilir, tuz kırılır: denizde katmanlar kayar, iyonik örgüde aynı yükler karşılaşıp iter.' },
      ),
      kart(
        'Neden iletken?',
        'Serbest elektronlar yük ve ısıyı taşır.\nBu yüzden metaller elektriği ve ısıyı iyi iletir.',
      ),
      kart(
        'Dövülebilir ve tel çekilebilir',
        'Katmanlar kaysa da bağ kopmaz, elektron denizi yeni düzeni sarar.\nBu yüzden metal kırılmaz, şekil alır.',
      ),
      kart(
        'Parlaklık',
        'Serbest elektronlar gelen ışığı soğurup hemen geri salar.\nMetalin parlak görünmesinin sebebi budur.',
      ),
      kart(
        'Bağın gücü',
        'Metalik bağ güçlenir:\n- Valans elektron sayısı arttıkça\n- Atom küçüldükçe\nBağ güçlendikçe erime noktası yükselir.',
      ),
      kart(
        'Alaşımlar',
        'Metaller elektron denizini paylaştığı için birbiriyle kolay karışır.\nÖrnek: çelik, pirinç\nAlaşım çoğu zaman saf metalden serttir.',
      ),
    ], [
      soru('Metallerin elektriği iletmesi, serbestçe hareket eden değerlik elektronlarındandır.', true, 'Elektron denizi modeli bunu anlatıyor.'),
      soru('Metaller darbe aldığında iyonik katılar gibi kırılır.', false, 'Elektron denizi katmanların kaymasına izin verdiği için metal şekil değiştirir.'),
      soru('Metalik bağ güçlendikçe erime noktası yükselir.', true, 'Taneciği ayırmak için daha çok enerji gerekiyor.'),
      soru('Metallerin parlaklığı yüzeydeki oksit tabakasından gelir.', false, 'Serbest elektronların ışığı yansıtmasından gelir; oksit tabakası tersine matlaştırır.'),
      sikli('Alaşımlar saf metale göre çoğu zaman nasıldır?', ['Daha sert', 'Daha yumuşak'], 0, 'Çelik demirden, pirinç bakırdan serttir.'),
      sikli('Metalik bağda pozitif iyonlar neyin içinde durur?', ['Elektron denizinin', 'Proton bulutunun'], 0, 'Valans elektronları ortak bir havuza bırakılır.'),
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
        'Metal elektron verir, ametal alır.\nZıt yüklü iyonlar arasındaki elektriksel çekim **iyonik bağdır**.',
      ),
      kart(
        'Formül nasıl bulunur?',
        'Yükler çaprazlanır, toplam yük sıfır olmalı:\n- Al³⁺ + O²⁻ → Al₂O₃\n- Ca²⁺ + Cl⁻ → CaCl₂\nOran sadeleşiyorsa sadeleştir: MgO',
        undefined,
        { not: 'Al³⁺ + O²⁻ → Al₂O₃ (2·3 = 3·2 = 6). Mg²⁺ + O²⁻ → MgO, Mg₂O₂ değil; çaprazladıktan sonra sadeleştir.' },
      ),
      kart(
        'Örgü yapısı',
        'İyonik bileşiklerde molekül yoktur; iyonlar üç boyutlu bir örgü kurar.\nNaCl formülü yalnızca oranı söyler.',
      ),
      kart(
        'Sert ama kırılgan',
        'Örgü katmanları kayınca aynı yükler karşı karşıya gelir.\nBirbirini iterek kristali çatlatırlar.',
      ),
      kart(
        'Yüksek erime noktası',
        'Örgüyü çözmek için çok sayıda güçlü çekimi birden kırmak gerekir.\nSofra tuzu 801 °C’de erir.',
      ),
      kart(
        'Ne zaman iletir?',
        '- **Katı hâlde:** iletmez, iyonlar yerinde sabit\n- **Eriyik ya da çözelti:** iletir, iyonlar serbest',
      ),
      kart(
        'Suda çözünme',
        'Su polar bir moleküldür; iyonları zıt uçlarından sarıp örgüden koparır.\nÇözelti iyon içerdiği için elektriği iletir.',
      ),
    ], [
      soru('İyonik bağ, metal ile ametal arasında elektron aktarımıyla oluşur.', true, 'Metal verir, ametal alır; zıt yüklü iyonlar birbirini çeker.'),
      soru('İyonik katılar katı hâlde elektriği iyi iletir.', false, 'İyonlar örgüde sabit; iletim ancak erimiş hâlde ya da sulu çözeltide olur.'),
      soru('İyonik bileşikler hem sert hem kırılgandır.', true, 'Örgü kayınca aynı yüklü iyonlar karşılaşıyor ve kristal çatlıyor.'),
      soru('İyonik bileşiklerin erime noktaları düşüktür.', false, 'Örgüdeki çekim güçlü olduğu için erime noktaları yüksektir.'),
      sikli('Al³⁺ ile O²⁻ hangi formülü verir?', ['AlO', 'Al₂O₃'], 1, 'Yükler çaprazlanır.'),
      sikli('NaCl formülü ne söyler?', ['Bir molekülün yapısını', 'İyonların oranını'], 1, 'İyonik bileşikte molekül yok, örgü var.'),
      sikli('K⁺ ile O²⁻ hangi formülü verir?', ['K₂O', 'KO₂'], 0, 'İki K⁺ bir O²⁻\'yi dengeler: 2·(+1) + (−2) = 0.'),
      soru('Su, iyonları zıt uçlarıyla sarıp örgüden koparır.', true, 'Su polar; kısmi yükleri iyonları çeker.'),
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
        'İki ametal elektronlarını ortaklaşa kullanır.\nAlışveriş değil paylaşım olduğu için iyon oluşmaz.',
      ),
      kart(
        'Kaç bağ kurar?',
        'Atom, oktetine kaç elektron eksikse o kadar bağ kurar:\n- **H:** 1 bağ\n- **O:** 2 bağ\n- **N:** 3 bağ\n- **C:** 4 bağ\nBu yüzden H₂O, NH₃, CH₄',
      ),
      kart(
        'Polar kovalent',
        'Elektronegatiflikleri farklı atomlar arasında elektron eşit paylaşılmaz.\nBir uç kısmi negatif olur. Örnek: HCl',
      ),
      kart(
        'Apolar kovalent',
        'Aynı ya da çok yakın elektronegatiflikteki atomlar arasında elektron eşit paylaşılır.\nÖrnek: H₂, O₂',
      ),
      kart(
        'Bağ sayısı',
        'Tekli, ikili ve üçlü bağ vardır.\nBağ sayısı arttıkça bağ **kısalır ve güçlenir**; N₂’nin üçlü bağı zor kopar.',
      ),
      kart(
        'Hangi bağ oluşur?',
        'Bağın türünü, birleşen atomların metal mi ametal mi olduğu belirler.\nTablodaki üç eşleşmeyi karşılaştır.',
        {
          tur: 'tablo',
          basliklar: ['Atomlar', 'Bağ'],
          satirlar: [
            ['Metal + ametal', 'İyonik'],
            ['Ametal + ametal', 'Kovalent'],
            ['Metal + metal', 'Metalik'],
          ],
        },
        { not: 'NaCl iyonik (metal+ametal), HCl kovalent (ametal+ametal), Fe metalik. NH₄Cl iyonik ama içinde kovalent bağ var.' },
      ),
      kart(
        'Bağ enerjisi',
        'Bağı koparmak için gereken enerjidir.\nBağ kısa ve katlıysa enerji büyüktür: C≡C > C=C > C−C',
      ),
    ], [
      soru('Kovalent bağda elektronlar ortaklaşa kullanılır.', true, 'Ametaller elektron almak istediği için aktarım yerine ortaklık kuruluyor.'),
      soru('İki farklı ametal arasında oluşan bağ polar kovalenttir.', true, 'Elektronegatiflik farkı elektronları bir tarafa yaklaştırıyor.'),
      soru('H₂ molekülündeki bağ polar kovalenttir.', false, 'Aynı iki atom arasında elektronegatiflik farkı yok; bağ apolar.'),
      soru('Kovalent bağ yalnızca metal atomları arasında oluşur.', false, 'Ametaller arasında oluşur; metaller arasındaki bağ metalik bağdır.'),
      sikli('Karbon atomu kaç kovalent bağ kurar?', ['2', '4'], 1, 'Oktetine 4 elektron eksik: CH₄.'),
      sikli('Na ile Cl arasında hangi bağ oluşur?', ['Kovalent', 'İyonik'], 1, 'Metal + ametal: elektron aktarımı, iyonik bağ.'),
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
        'Basit bir şemadır:\n- **Nokta:** valans elektron\n- **Çizgi:** ortaklaşılan elektron çifti',
      ),
      kart(
        'Valans elektron sayısı',
        'A grubunda valans elektron sayısı = grup numarası\nÖrnek: C 4, N 5, O 6, F 7\nLewis yapısı bu sayıyla başlar.',
      ),
      kart(
        'Oktet kuralı',
        'Atomlar son katmanlarını sekize tamamlayacak biçimde bağ kurar.\nHidrojen ikiye tamamlar (dublet).',
      ),
      kart(
        'Nasıl çizilir?',
        '- Toplam valans elektron sayılır.\n- Bağlar kurulur.\n- Kalan elektronlar ortaklanmamış çift olarak dağıtılır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Elektronları say' },
            { ad: 'Bağları kur' },
            { ad: 'Kalanı dağıt' },
          ],
        },
        { not: 'CO₂: 4 + 6·2 = 16 elektron. O=C=O, her O\'da 2 ortaklanmamış çift. Toplamı saymadan çizersen elektron artar.' },
      ),
      kart(
        'Ortaklanmamış çift',
        'Bağa katılmayan elektron çiftleri de çizilir.\nMolekülün şeklini ve polarlığını bunlar belirler.',
      ),
      kart(
        'Oktete uymayanlar',
        '- **Oktetin altında:** BeCl₂, BF₃\n- **Oktetin üstünde:** PCl₅, SF₆\nKural bir yasa değil, güçlü bir eğilimdir.',
      ),
      kart(
        'Örnekler',
        '- **H₂O:** O’da iki bağ, iki ortaklanmamış çift\n- **NH₃:** N’de üç bağ, bir çift\n- **CO₂:** iki ikili bağ, her O’da iki çift',
      ),
    ], [
      soru('Lewis yapısı atomun değerlik elektronlarını noktalarla gösterir.', true, 'İç katmanlar çizilmiyor; bağı kuran elektronlar değerlik elektronları.'),
      soru('Oktet kuralına göre atomlar son katmanlarında sekiz elektrona ulaşmaya çalışır.', true, 'Soy gaz düzenine benzemek kararlılık sağlıyor.'),
      soru('Hidrojen atomu da oktete ulaşmaya çalışır.', false, 'Hidrojen iki elektronla, yani dublet ile kararlı.'),
      soru('Bir molekülde ortaklanmamış elektron çifti bulunamaz.', false, 'Su molekülündeki oksijenin iki ortaklanmamış çifti var.'),
      sikli('Oksijenin valans elektron sayısı kaçtır?', ['6', '8'], 0, 'A grubunda grup numarasına eşit.'),
      sikli('NH₃ molekülünde N\'nin kaç ortaklanmamış çifti vardır?', ['1', '3'], 0, 'Üç bağ, bir çift.'),
      sikli('Hangisi oktetin üstünde kalır?', ['BF₃', 'SF₆'], 1, 'SF₆\'da kükürdün çevresinde 12 elektron var; BF₃ oktetin altında.'),
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
        'CO₂’de iki bağ da polardır ama molekül doğrusaldır.\nEşit iki dipol ters yönde durur ve birbirini götürür.',
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
        { not: 'CO₂ doğrusal → apolar; H₂O açısal → polar. CCl₄ dört polar bağ, simetrik → apolar.' },
      ),
      kart(
        'Suyun açısı',
        'H₂O açısaldır; iki dipol birbirini götürmez, toplanır.\nBu yüzden su güçlü bir polar moleküldür.',
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
        'Yük ayrımının büyüklüğü ve yönüdür.\nVektörlerin toplamı sıfırdan farklıysa molekül polardır.',
      ),
      kart(
        'Şekil belirleyici',
        'Aynı atomlardan kurulu iki molekülün polarlığı geometriye göre değişir.\nYalnızca formüle bakarak karar verilemez.',
      ),
      kart(
        'Hızlı kural',
        '- **Apolar:** merkezde ortaklanmamış çift yok, bağlı atomlar aynı (CO₂, CH₄, BF₃)\n- **Polar:** merkezde çift var ya da atomlar farklı (H₂O, NH₃, CHCl₃)',
      ),
      kart(
        'Benzer benzeri çözer',
        '- **Polar madde:** polar çözücüde çözünür.\n- **Apolar madde:** apolar çözücüde çözünür.\nYağın suda çözünmemesi bu yüzdendir.',
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
      sikli('CCl₄ molekülü nasıldır?', ['Polar', 'Apolar'], 1, 'Dört polar bağ simetrik dizilir; dipoller birbirini götürür.'),
      sikli('NH₃ molekülü nasıldır?', ['Apolar', 'Polar'], 1, 'Merkezdeki azotta ortaklanmamış bir çift var; şekil simetrik değil.'),
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
        'Önce metal, sonra ametal okunur; ametal -ür, -it gibi bir ek alır.\nÖrnek: NaCl sodyum klorür',
      ),
      kart(
        'Değerlik gösteren metaller',
        'Birden çok değerlik alan metalde değerlik Roma rakamıyla yazılır.\nÖrnek: CuSO₄ bakır(II) sülfat',
      ),
      kart(
        'Kovalent bileşikler',
        'Atom sayıları Yunanca ön eklerle söylenir:\n- **CO:** karbon monoksit\n- **CO₂:** karbon dioksit\n- **N₂O₄:** diazot tetraoksit',
      ),
      kart(
        'Ön ekler',
        '- **mono:** 1, **di:** 2, **tri:** 3\n- **tetra:** 4, **penta:** 5, **heksa:** 6\nİlk atomda "mono" genellikle yazılmaz.',
      ),
      kart(
        'Sık geçen kökler',
        'Poliatomik iyonlar ezberlenince adlandırmanın yarısı biter.\nTablodaki altı iyon en sık sorulanlardır.',
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
        { not: 'NO₃⁻ nitrat, SO₄²⁻ sülfat, CO₃²⁻ karbonat, OH⁻ hidroksit, NH₄⁺ amonyum, PO₄³⁻ fosfat. Altı kök, çoğu soru.' },
      ),
      kart(
        'Yaygın adlar',
        'Bazı bileşikler sistematik adıyla anılmaz:\n- **H₂O:** su\n- **NH₃:** amonyak\n- **NaCl:** sofra tuzu\n- **CaCO₃:** kireç taşı',
      ),
      kart(
        'Sık çıkan örnekler',
        '- **Fe₂O₃:** demir(III) oksit\n- **FeO:** demir(II) oksit\n- **SO₂:** kükürt dioksit\n- **PCl₅:** fosfor pentaklorür\n- **Na₂SO₄:** sodyum sülfat',
      ),
    ], [
      soru('CO₂ bileşiğinin adı karbon dioksittir.', true, 'İki ametal; ikinci elemente atom sayısını gösteren ön ek geliyor.'),
      soru('İyonik bileşikler adlandırılırken önce ametal yazılır.', false, 'Önce metal (katyon), sonra ametal yazılır.'),
      soru('CuSO₄ bileşiği bakır(II) sülfat diye adlandırılır.', true, 'Bakır birden çok değerlik aldığı için değerliği Roma rakamıyla belirtiliyor.'),
      soru('Kovalent bileşiklerin adlandırılmasında ön ek kullanılmaz.', false, 'mono, di, tri gibi ön ekler atom sayısını gösteriyor.'),
      sikli('FeO bileşiğinin adı?', ['Demir(II) oksit', 'Demir(III) oksit'], 0, 'Fe₂O₃ demir(III) oksit.'),
      sikli('PCl₅ bileşiğinin adı?', ['Fosfor pentaklorür', 'Fosfor(V) klorür'], 0, 'İki ametal: ön ek.'),
      sikli('"tetra" ön eki kaç demektir?', ['6', '4'], 1, 'mono 1, di 2, tri 3, tetra 4, penta 5, heksa 6.'),
      soru('CaCO₃\'ün yaygın adı kireç taşıdır.', true, 'Sistematik adı kalsiyum karbonat.'),
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
        'Moleküller arası çekimler, molekül içindeki bağlardan çok daha zayıftır.\nSuyu kaynatmak bağı değil, çekimi kırar.',
      ),
      kart(
        'Güç sırası',
        'London < dipol-dipol < hidrojen bağı\nKaynama noktası da bu sırayı izler.',
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
        'Anlık elektron kayması geçici bir dipol yaratır.\nBütün moleküllerde vardır; molekül büyüdükçe güçlenir.',
      ),
      kart(
        'Dipol-dipol',
        'Kalıcı dipolü olan polar moleküller birbirini zıt uçlarından çeker.\nLondon kuvvetlerinden güçlüdür.',
      ),
      kart(
        'Hidrojen bağı',
        'H atomu **F, O ya da N**’ye bağlıysa oluşan çok güçlü dipol-dipol çekimidir.\nSuyun yüksek kaynama noktası bundandır.',
      ),
      kart(
        'Van der Waals',
        'London ve dipol-dipol etkileşimlerinin ortak adıdır.\nMaddenin hâlini ve kaynama noktasını belirler.',
      ),
      kart(
        'İyon-dipol',
        'Suda çözünen tuzun iyonlarını su molekülleri sarar.\nÇözünmeyi mümkün kılan etkileşim budur.',
      ),
      kart(
        'Kaynama noktasını tahmin etme',
        '- **Önce:** hidrojen bağı var mı?\n- **Sonra:** molekül polar mı?\n- **En son:** molekül kütlesi büyük mü?',
        undefined,
        { not: 'H₂O > HF > NH₃ (hidrojen bağı); HCl > F₂ (polar > apolar); I₂ > Br₂ > Cl₂ (kütle). Sıralama bu üç adım.' },
      ),
    ], [
      soru('Moleküller arası etkileşimler kimyasal bağlardan zayıftır.', true, 'Suyu kaynatmak molekülleri ayırıyor, bağlarını koparmıyor.'),
      soru('Suyun kaynama sıcaklığının beklenenden yüksek olması hidrojen bağlarındandır.', true, 'Hidrojen bağı moleküller arası etkileşimlerin en güçlüsü.'),
      soru('London kuvvetleri yalnızca polar moleküllerde görülür.', false, 'Bütün moleküllerde var; apolar moleküllerde tek etkileşim odur.'),
      soru('Hidrojen bağı, hidrojen atomu bulunan her molekülde oluşur.', false, 'Hidrojenin flor, oksijen veya azota bağlı olması gerekiyor.'),
      sikli('Suda çözünen tuzda iyonları saran etkileşim?', ['İyon-dipol', 'Hidrojen bağı'], 0, 'Su molekülleri iyonları sarar.'),
      sikli('Moleküller arası etkileşimlerin güç sırası?', ['London < dipol-dipol < hidrojen bağı', 'Hidrojen bağı < London < dipol-dipol'], 0, 'Kaynama noktası da bu sırayı izler.'),
      sikli('I₂\'nin kaynama noktası Cl₂\'den neden yüksek?', ['Molekül daha büyük', 'Hidrojen bağı var'], 0, 'London kuvveti molekül büyüdükçe artar.'),
      sikli('HCl ile F₂\'den hangisinin kaynama noktası yüksektir?', ['F₂', 'HCl'], 1, 'HCl polar: dipol-dipol var. F₂ apolar, yalnızca London.'),
      soru('Kalıcı dipolü olan polar moleküller birbirini zıt uçlarından çeker.', true, 'Bu dipol-dipol etkileşimidir; London kuvvetlerinden güçlü.'),
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
        '- **Kristal:** tanecikler düzenli, keskin erime noktası\n- **Amorf (cam):** düzensiz, yumuşayarak erir',
      ),
      kart(
        'Dört katı türü',
        'Katıyı bir arada tutan etkileşim, bütün özelliklerini belirler.\nTabloda dört türün erime noktaları var.',
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
        { not: 'NaCl iyonik, elmas kovalent ağ, buz moleküler, bakır metalik. Erime noktası: kovalent ağ > iyonik > metal > moleküler.' },
      ),
      kart(
        'İyonik katı',
        'Zıt yüklü iyonların örgüsüdür.\nSert, kırılgan ve yüksek erime noktalıdır; katı hâlde iletmez.',
      ),
      kart(
        'Kovalent ağ katısı',
        'Kristalin tamamı tek bir bağ ağıdır. Örnek: elmas, kuvars\nAşırı sert ve erime noktası çok yüksektir.',
      ),
      kart(
        'Moleküler katı',
        'Moleküller zayıf çekimle tutunur. Örnek: kuru buz, iyot\nYumuşak ve erime noktası düşüktür.',
      ),
      kart(
        'Metalik katı',
        'Elektron denizi ile tutunur; iletken ve dövülebilir.\nErime noktası bağ gücüne göre çok geniş aralıkta değişir.',
      ),
      kart(
        'Aynı element, farklı katı',
        'Elmas ve grafit ikisi de karbondur.\nBiri en sert maddelerden, öteki kalem ucu; farkı yalnızca dizilim yaratır.',
      ),
    ], [
      soru('Elmas ile grafit aynı elementten oluşur.', true, 'İkisi de karbon; farkı atomların dizilişinde.'),
      soru('Cam kristal bir katıdır.', false, 'Camın düzenli örgüsü yok; amorf katı.'),
      soru('Kovalent ağ katılarının erime noktaları çok yüksektir.', true, 'Eritmek için kovalent bağları koparmak gerekiyor.'),
      soru('Moleküler katılar sert ve yüksek erime noktalıdır.', false, 'Molekülleri zayıf etkileşimler tuttuğu için genelde yumuşak ve düşük erime noktalıdır.'),
      sikli('Keskin bir erime noktası olan katı hangisidir?', ['Kristal', 'Amorf'], 0, 'Amorf katı yumuşayarak erir.'),
      sikli('Kuru buz hangi katı türüdür?', ['Kovalent ağ', 'Moleküler'], 1, 'Yumuşak, düşük erime noktalı.'),
      sikli('Kuvars hangi tür katıdır?', ['Moleküler', 'Kovalent ağ'], 1, 'Bütün kristal tek bir Si–O bağ ağı.'),
      soru('Bakır metalik katıya örnektir.', true, 'Elektron denizi ile tutunur; iletken ve dövülebilir.'),
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
        'Kapalı kapta sıvıyla dengedeki buharın basıncıdır.\nBüyür:\n- Sıcaklık arttıkça\n- Moleküller arası çekim zayıfladıkça',
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
        'Sıvı, buhar basıncı dış basınca eşitlenince kaynar.\nYüksek rakımda dış basınç düşüktür; su 100 °C’den önce kaynar.',
        undefined,
        { not: 'Ağrı Dağı\'nda su ~85 °C\'de kaynar, düdüklüde ~120 °C. Dış basınç düşerse kaynama sıcaklığı düşer.' },
      ),
      kart(
        'Viskozite',
        'Akmaya karşı dirençtir.\n- **Artar:** çekim güçlü, molekül büyükse\n- **Azalır:** sıcaklık artınca',
      ),
      kart(
        'Adezyon ve kohezyon',
        '- **Kohezyon:** aynı tür moleküller arası çekim\n- **Adezyon:** farklı bir yüzeye yapışma\nİkisinin yarışı menisküsün yönünü belirler.',
      ),
      kart(
        'Yüzey gerilimi',
        'Yüzeydeki moleküller içeri doğru çekilir.\nSıvı yüzeyi zar gibi davranır; su damlası bu yüzden yuvarlaktır.',
      ),
      kart(
        'Kılcallık',
        'Adezyon kohezyondan güçlüyse sıvı ince boruda yükselir.\nBitkinin suyu yapraklara taşımasının bir parçası budur.',
      ),
      kart(
        'Suyun tuhaflığı',
        'Su donarken genleşir ve buz suda yüzer.\nHidrojen bağları katıda molekülleri daha boşluklu bir düzene sokar.',
      ),
    ], [
      soru('Bir sıvının buhar basıncı arttıkça kaynama sıcaklığı düşer.', true, 'Sıvı, dış basıncı daha erken karşılıyor.'),
      soru('Viskozitesi yüksek sıvılar daha zor akar.', true, 'Bal ile suyun farkı bu.'),
      soru('Yüzey gerilimi, sıvı taneciklerinin kabın çeperine yaptığı çekimden kaynaklanır.', false, 'Yüzey gerilimi kohezyondan, yani taneciklerin birbirini çekmesinden gelir.'),
      soru('Kılcal boruda cıva da su gibi yükselir.', false, 'Cıvada kohezyon adezyondan güçlü; seviye yükselmek yerine alçalır.'),
      sikli('Su damlasının yuvarlak olmasının sebebi?', ['Yüzey gerilimi', 'Viskozite'], 0, 'Yüzey moleküller içeri çekilir.'),
      sikli('Sıvının cam yüzeye yapışmasına ne denir?', ['Adezyon', 'Kohezyon'], 0, 'Kohezyon aynı tür moleküller arasındaki çekim.'),
      sikli('Sıcaklık artınca viskozite?', ['Artar', 'Azalır'], 1, 'Bal ısınınca akıcılaşır.'),
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
        '**1 nanometre = metrenin milyarda biri**\nNanoparçacık kabaca 1–100 nm arasıdır; saç telinden yaklaşık bin kat incedir.',
      ),
      kart(
        'Neden farklı davranır?',
        'Küçüldükçe yüzey alanının hacme oranı büyür.\nAynı madde nano boyutta daha etkin, bazen bambaşka renkte olur.',
      ),
      kart(
        'Yüzey/hacim oranı',
        'Bir küpü bölmek hacmi değiştirmez ama toplam yüzeyi büyütür.\nTepkime yüzeyde olduğu için etkinlik artar.',
        undefined,
        { not: '1 cm\'lik küpün yüzeyi 6 cm²; 1 mm\'lik 1000 küpe bölünce toplam yüzey 60 cm². Hacim aynı, yüzey 10 kat.' },
      ),
      kart(
        'Kullanım alanları',
        '- **Gümüş nanoparçacık:** tekstilde mikrop öldürücü\n- **Altın nanoparçacık:** tanı testlerinde',
      ),
      kart(
        'Evsel atıktan elde',
        'Bitki özütleri metal iyonlarını indirgeyerek nanoparçacığa çevirebilir.\nÇay ve meyve kabuğu bu amaçla kullanılır.',
      ),
      kart(
        'Riski de var',
        'Küçük olmak, hücre zarını geçebilmek demektir.\nSağlık ve çevre etkileri hâlâ araştırılıyor.',
      ),
    ], [
      soru('1 nanometre, metrenin milyarda biridir.', true, 'Bir insan saçı yaklaşık 80 bin nanometre kalınlığında.'),
      soru('Nanoparçacıklar, aynı maddenin iri hâliyle aynı özellikleri gösterir.', false, 'Yüzey/hacim oranı büyüdüğü için renk, erime noktası ve etkinlik değişebiliyor.'),
      soru('Nanoparçacıklarda yüzey alanının hacme oranı büyüktür.', true, 'Atomların büyük kısmı yüzeyde kalıyor; tepkime etkinliği bu yüzden yüksek.'),
      soru('Nanoteknoloji ürünlerinin çevresel ve sağlıkla ilgili bir riski yoktur.', false, 'Küçük boyut, canlı dokularda birikme ve hücrelere girme riski getiriyor.'),
      sikli('1 cm\'lik küp 1 mm\'lik küplere bölünürse toplam yüzey kaç katına çıkar?', ['10', '1000'], 0, '6 cm²\'den 1000 · 0,06 = 60 cm²\'ye; hacim aynı kalır.'),
      sikli('Gümüş nanoparçacık tekstilde ne için kullanılır?', ['Renk verici', 'Mikrop öldürücü'], 1, 'Altın nanoparçacık tanı testlerinde kullanılır.'),
      soru('Bitki özütleri metal iyonlarını nanoparçacığa çevirmekte kullanılabilir.', true, 'Özütteki maddeler metal iyonlarını indirger.'),
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
        'Kurşun, cıva, kadmiyum gibi yoğunluğu yüksek metallerdir.\nDüşük derişimde bile zehirlidir ve vücuttan kolay atılmaz.',
      ),
      kart(
        'Besin zincirinde birikme',
        'Ağır metal parçalanmaz; zincirin her basamağında derişimi artar.\nEn çok zararı zincirin tepesindeki canlı görür.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Su', alt: 'az' },
            { ad: 'Plankton' },
            { ad: 'Balık' },
            { ad: 'İnsan', alt: 'çok', renk: 'ikincil' },
          ],
        },
        { not: 'Cıva: plankton → küçük balık → ton balığı → insan. Her basamakta derişim artar; büyük balık daha riskli.' },
      ),
      kart(
        'Alaşım nedir?',
        'Bir metalin başka element(ler)le karışımıdır.\n- **Çelik:** demir + karbon\n- **Pirinç:** bakır + çinko',
      ),
      kart(
        'Neden alaşım yapılır?',
        'Saf metal çoğu zaman fazla yumuşaktır ya da kolay paslanır.\nAlaşım sertlik ve dayanıklılık kazandırır.',
      ),
      kart(
        'Korozyon',
        'Metalin çevreyle tepkimeye girip aşınmasıdır; en yaygını demirin paslanması.\nBoya ve galvaniz korozyonu yavaşlatır.',
      ),
      kart(
        'Ekolojik ayak izi',
        'Bir üretimin doğaya bindirdiği yükün ölçüsüdür.\nMetal geri kazanımı, cevherden üretime göre bu yükü belirgin azaltır.',
      ),
    ], [
      soru('Ağır metaller besin zincirinde birikerek üst basamaklarda yoğunlaşır.', true, 'Vücuttan atılmadıkları için her basamakta daha çok toplanıyorlar.'),
      soru('Alaşım, iki metalin kimyasal tepkimesiyle oluşan yeni bir bileşiktir.', false, 'Alaşım bir karışım; bileşenler kendi kimliğini koruyor.'),
      soru('Paslanmaz çelik, korozyona direnç kazandırmak için üretilmiş bir alaşımdır.', true, 'İçindeki krom yüzeyde koruyucu bir tabaka oluşturuyor.'),
      soru('Korozyon yalnızca demirde görülür.', false, 'Bakır ve alüminyum gibi metaller de yüzeyde oksitlenir; demirdeki adı pas.'),
      sikli('Çelik neyin alaşımıdır?', ['Bakır ve çinko', 'Demir ve karbon'], 1, 'Bakır-çinko pirinç.'),
      sikli('Pirinç hangi metallerin alaşımıdır?', ['Bakır ve çinko', 'Demir ve karbon'], 0, 'Demir ve karbon çeliği oluşturur.'),
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
        'Atığı sonradan temizlemek yerine **hiç oluşturmamak**.\nYeşil kimyanın on iki ilkesinin ilki budur.',
      ),
      kart(
        'Neden önce önleme?',
        'Oluşmuş atığı arıtmak enerji, su ve para harcar.\nOluşmayan atığın arıtma maliyeti sıfırdır.',
      ),
      kart(
        'Atık hiyerarşisi',
        'Sıra bellidir ve tersine çevrilmez.\nEn iyisi hiç üretmemek, en kötüsü depolamaktır.',
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
        { not: 'Sıra: önle > azalt > yeniden kullan > geri dönüştür > enerji elde et > depola. Geri dönüşüm ilk değil, dördüncü.' },
      ),
      kart(
        'Kimyasal ayak izi',
        'Ürünün üretiminde kullanılan ve açığa çıkan kimyasalların toplam yüküdür.\nKüçük ölçekli deney bu yükü düşürür.',
      ),
      kart(
        'Atom ekonomisi',
        'Girenlerin ne kadarının ürüne dönüştüğünün ölçüsüdür.\nYüksek atom ekonomisi, az atık demektir.',
      ),
      kart(
        'Okulda karşılığı',
        'Mikro ölçekli deney aynı sonucu daha az maddeyle verir.\nHem atık hem risk azalır.',
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
      soru('Kimyasal ayak izi, bir ürünün üretiminde kullanılan ve açığa çıkan kimyasalların toplam yüküdür.', true, 'Küçük ölçekli deney bu yükü düşürür.'),
      sikli('Atık hiyerarşisinde geri dönüştürme kaçıncı sıradadır?', ['Birinci', 'Dördüncü'], 1, 'Önle, azalt, yeniden kullan; ancak sonra geri dönüştür.'),
      sikli('Atık hiyerarşisinde en kötü seçenek?', ['Depolamak', 'Yeniden kullanmak'], 0, 'En iyisi hiç üretmemek.'),
      soru('Oluşmuş atığı arıtmak enerji ve su harcar.', true, 'Oluşmayan atığın arıtma maliyeti ise sıfırdır.'),
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
