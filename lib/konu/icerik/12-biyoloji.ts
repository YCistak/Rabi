import { kart, konu, program, tema } from '../tip'

/**
 * 12. sınıf Biyoloji — **2018 programı** (MEB Ortaöğretim Biyoloji).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor. Tema adları 2018 ünitelerinden:
 * Genden Proteine, Bitki Biyolojisi, Canlılar ve Çevre. `maarif.test.ts`
 * bu programı denetlemiyor (iskelette 12 yok).
 *
 * 2018'in 12. sınıf konularından haritada **zaten kartı olanlar** burada
 * tekrar yazılmadı:
 * - Canlılarda Enerji Dönüşümleri ünitesinin tamamı (ATP, fotosentez,
 *   kemosentez, hücresel solunum, fermantasyon) → `byl10-enerji-onem` …
 *   `byl10-metabolizma`
 * - Bitki hormonları ve bitki hareketleri (12.3.1.2–3) →
 *   `byl11-bitki-hormon`, `byl11-bitki-tepki`
 *
 * Konu sonu soruları ayrı dosyada (`12-biyoloji-sorular.ts`); hızlı
 * kontroller destelerin içinde.
 */
export const biyoloji12 = program('biyoloji', 12, 'Genden proteine, bitkiden yapay seçilime', [
  tema('byl12-t1', 'Genden Proteine', [
    konu('byl12-nukleik-kesif', 'Nükleik Asitlerin Keşfi', [
      kart(
        'Nüklein',
        'Friedrich Miescher 1869’da irin hücrelerinin çekirdeğinden fosforca zengin bir madde ayırdı.\nÇekirdekten geldiği için adını **nüklein** koydu; bugünkü adı nükleik asit.',
      ),
      kart(
        'Nükleotit',
        'Phoebus Levene nükleik asitlerin **nükleotit** denen birimlerden oluştuğunu gösterdi.\nHer nükleotit: fosfat + beş karbonlu şeker + azotlu organik baz',
      ),
      kart(
        'Griffith deneyi (1928)',
        'Zatürre bakterisinin kapsüllü **S** suşu öldürücü, kapsülsüz **R** suşu zararsızdır.',
        {
          tur: 'tablo',
          basliklar: ['Fareye verilen', 'Sonuç'],
          satirlar: [
            ['Canlı S', 'Ölür'],
            ['Canlı R', 'Yaşar'],
            ['Isıyla öldürülmüş S', 'Yaşar'],
            ['Öldürülmüş S + canlı R', 'Ölür'],
          ],
        },
      ),
      kart(
        'Dönüşüm (transformasyon)',
        'Son grupta ölen farenin kanında canlı S bakterisi bulundu.\nÖlü S’den gelen bir madde, R’yi kalıtsal olarak S’ye dönüştürmüştü.',
      ),
      kart(
        'Avery ve arkadaşları (1944)',
        'Ölü S özütündeki maddeleri enzimlerle tek tek yıktılar.\n- Protein ya da RNA yıkılınca dönüşüm sürdü.\n- DNA yıkılınca dönüşüm durdu.\nDönüştüren madde DNA’ydı.',
      ),
      kart(
        'Hershey ve Chase (1952)',
        'Bakteriyofajın proteini ³⁵S ile, DNA’sı ³²P ile işaretlendi.\nBakterinin içine yalnızca ³²P girdi ve yeni fajlar oluştu.\nKalıtım maddesi protein değil DNA’dır.',
        undefined,
        { not: 'Kükürt proteinde var, DNA’da yok; fosfor DNA’da bol. İşaretler bu yüzden seçildi, içeri giren ³²P.' },
      ),
      kart(
        'Chargaff kuralları',
        '- A = T ve G = C\n- Pürinler (A + G) = pirimidinler (T + C)\n(A + T)/(G + C) oranı türden türe değişir; DNA türe özgüdür.',
      ),
      kart(
        'X-ışını görüntüsü',
        'Rosalind Franklin ve Maurice Wilkins DNA’yı X-ışınıyla görüntüledi.\nGörüntü, molekülün düzenli bir sarmal olduğunu gösterdi.',
      ),
      kart(
        'Çift sarmal modeli (1953)',
        'Watson ve Crick, Chargaff ve Franklin’in verileriyle modeli kurdu.\nİki zincir karşılıklı bazlarla bağlı, birbirine sarılı bir merdivendir.',
      ),
      kart(
        'Keşfin sırası',
        'Önce madde bulundu, sonra kalıtımdaki rolü, en son yapısı çözüldü.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Miescher · 1869', alt: 'nüklein' },
            { ad: 'Griffith · 1928', alt: 'dönüşüm' },
            { ad: 'Avery · 1944', alt: 'dönüştüren DNA' },
            { ad: 'Hershey-Chase · 1952', alt: 'fajda kalıtım DNA' },
            { ad: 'Watson-Crick · 1953', alt: 'çift sarmal', renk: 'ikincil' },
          ],
        },
      ),
    ], [], [
      {
        soru: 'Hershey-Chase deneyinde bakterinin içine giren işaret hangisidir?',
        siklar: ['³²P', '³⁵S'],
        dogru: 0,
        aciklama: {
          dogru: '³²P DNA’yı işaretliyordu; bakteriye giren DNA oldu.',
          yanlis: '³⁵S fajın protein kılıfındaydı ve dışarıda kaldı. İçeri giren ³²P’li DNA.',
        },
        kart: 6,
      },
    ]),
    konu('byl12-nukleik-yapi', 'DNA ve RNA’nın Yapısı', [
      kart(
        'Nükleotidin parçaları',
        'Her nükleotit üç parçadan oluşur:\n- Fosfat grubu\n- Beş karbonlu şeker (pentoz)\n- Azotlu organik baz\nNükleotitleri birbirinden ayıran bazlarıdır.',
      ),
      kart(
        'Bazlar',
        'Pürinler büyük, pirimidinler küçük bazlardır.\nTimin yalnız DNA’da, urasil yalnız RNA’da bulunur.',
        {
          tur: 'tablo',
          basliklar: ['Grup', 'Bazlar', 'Halka'],
          satirlar: [
            ['Pürin', 'Adenin, guanin', 'Çift'],
            ['Pirimidin', 'Sitozin, timin, urasil', 'Tek'],
          ],
        },
      ),
      kart(
        'DNA ile RNA',
        'İkisi de nükleotit dizisidir; şeker, baz ve zincir sayısında ayrılırlar.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'DNA', 'RNA'],
          satirlar: [
            ['Şeker', 'Deoksiriboz', 'Riboz'],
            ['Bazlar', 'A, T, G, C', 'A, U, G, C'],
            ['Zincir', 'Çift', 'Tek'],
            ['Görev', 'Bilgiyi saklar', 'Bilgiyi kullanır'],
          ],
        },
      ),
      kart(
        'Zincirin omurgası',
        'Bir nükleotidin şekeri, sonrakinin fosfatına **fosfodiester bağıyla** bağlanır.\nOmurga şeker-fosfattır; bazlar içe bakar.',
      ),
      kart(
        'Karşılıklı bazlar',
        '- **A = T:** iki hidrojen bağı\n- **G ≡ C:** üç hidrojen bağı\nBir pürin hep bir pirimidinle eşleşir; sarmalın çapı bu yüzden her yerde aynıdır.',
      ),
      kart(
        'Zincirler ters yönlü',
        'İki zincir **antiparaleldir**: biri 5’→3’, karşısındaki 3’→5’ yönündedir.\nUçlar, şekerin karbon numaralarından adını alır.',
      ),
      kart(
        'Sayma kuralları',
        'Çift zincirli doğrusal DNA’da:\n- A = T ve G = C\n- Hidrojen bağı = 2 · (A–T çifti) + 3 · (G–C çifti)\n- Fosfodiester bağı = nükleotit sayısı − 2',
        undefined,
        { not: 'G–C oranı yüksek DNA’da hidrojen bağı çoktur; zincirleri ayırmak için daha çok ısı gerekir.' },
      ),
      kart(
        'RNA çeşitleri',
        '- **mRNA:** DNA’daki şifreyi ribozoma taşır.\n- **tRNA:** aminoasidi ribozoma getirir, antikodon taşır.\n- **rRNA:** proteinlerle birlikte ribozomu kurar.',
      ),
      kart(
        'RNA nereden gelir?',
        'Hücredeki bütün RNA’lar DNA’dan kopyalanarak (transkripsiyonla) üretilir.\nHücrede RNA kendini eşlemez; DNA bölünmeden önce kendini eşler.',
      ),
      kart(
        'Nerede bulunur?',
        '- **DNA:** çekirdek, mitokondri, kloroplast\n- **RNA:** çekirdek, sitoplazma, ribozom, mitokondri, kloroplast\nProkaryotta ikisi de sitoplazmadadır.',
      ),
    ], [], [
      {
        soru: 'Urasil bazı hangi molekülde bulunur?',
        siklar: ['DNA', 'RNA'],
        dogru: 1,
        aciklama: {
          dogru: 'Urasil yalnız RNA’da bulunur; DNA’da onun yerinde timin vardır.',
          yanlis: 'DNA’da urasil yok, timin var. Urasil RNA’ya özgüdür.',
        },
        kart: 2,
      },
    ]),
    konu('byl12-genetik-organizasyon', 'Genetik Materyalin Organizasyonu', [
      kart(
        'Parçadan bütüne',
        'Genetik materyal küçükten büyüğe beş basamakta düzenlenir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Nükleotit', alt: 'yapı birimi' },
            { ad: 'Gen', alt: 'bir ürünün şifresi' },
            { ad: 'DNA molekülü', alt: 'binlerce gen' },
            { ad: 'Kromozom', alt: 'DNA + protein' },
            { ad: 'Genom', alt: 'hücredeki tüm DNA', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Gen',
        'Bir protein ya da RNA’nın şifresini taşıyan DNA bölümüdür.\nAynı DNA molekülü üzerinde binlerce gen sıralanır.',
      ),
      kart(
        'Uzun DNA, küçük çekirdek',
        'Bir insan hücresindeki DNA uç uca eklense yaklaşık 2 metre tutar.\nBu uzunluk, birkaç mikrometrelik çekirdeğe paketlenerek sığar.',
      ),
      kart(
        'Nükleozom',
        '**Histon** proteinleri DNA’nın sarıldığı makaralardır.\nDNA’nın sekiz histondan oluşan bir öbeğe sarılmasıyla **nükleozom** oluşur.',
      ),
      kart(
        'Kromatin ve kromozom',
        '- **Kromatin:** bölünmeyen hücrede gevşek DNA-protein ipliği\n- **Kromozom:** bölünmede kısalıp kalınlaşmış hâli\nİkisi aynı maddedir; farkı paketlenme derecesidir.',
      ),
      kart(
        'Kromatitler',
        'Eşlenmiş kromozom iki **kardeş kromatitten** oluşur.\nKromatitler **sentromer** bölgesinden birbirine tutunur.',
      ),
      kart(
        'Prokaryot ve ökaryot',
        'Bakterilerde ayrıca küçük halkasal DNA’lar (plazmitler) bulunabilir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Bakteri', 'Ökaryot'],
          satirlar: [
            ['DNA biçimi', 'Halkasal', 'Doğrusal'],
            ['Kromozom', 'Genelde tek', 'Çok sayıda'],
            ['Histon', 'Yok', 'Var'],
            ['Yeri', 'Sitoplazma', 'Çekirdek'],
          ],
        },
      ),
      kart(
        'Çekirdek dışındaki DNA',
        'Mitokondri ve kloroplastın kendi halkasal DNA’sı vardır.\nİnsanda mitokondri DNA’sı anneden kalıtılır: zigotun sitoplazması yumurtadan gelir.',
      ),
      kart(
        'Kromozom sayısı',
        '- **İnsan vücut hücresi:** 46 kromozom (23 çift)\n- **İnsan üreme hücresi:** 23 kromozom\nKromozom sayısı gelişmişliği göstermez; patateste 48 kromozom vardır.',
      ),
      kart(
        'Genom',
        'Bir hücredeki tüm DNA’ya **genom** denir.\nÇekirdekli vücut hücrelerinin hepsi aynı genomu taşır; farklı hücreler farklı genleri çalıştırır.',
        undefined,
        { not: 'Karaciğer ve sinir hücresinin DNA’sı aynıdır; farklı olan, hangi genlerin kullanıldığı.' },
      ),
    ], [], [
      {
        soru: 'DNA’nın histon proteinlerine sarılmasıyla oluşan birim hangisidir?',
        siklar: ['Nükleozom', 'Sentromer'],
        dogru: 0,
        aciklama: {
          dogru: 'DNA sekiz histonluk öbeğe sarılarak nükleozomu oluşturur.',
          yanlis: 'Sentromer kardeş kromatitlerin tutunduğu bölgedir. Histona sarılmış birim nükleozom.',
        },
        kart: 4,
      },
    ]),
    konu('byl12-dna-eslenme', 'DNA’nın Kendini Eşlemesi', [
      kart(
        'Ne zaman?',
        'DNA, hücre bölünmeden önce interfazın **S evresinde** eşlenir.\nBöylece oluşacak iki hücrenin her biri tam bir kopya alır.',
      ),
      kart(
        'Yarı korunumlu eşlenme',
        'Eşlenmede iki zincir ayrılır, her biri kalıp olur.\nYeni DNA’ların her birinde **bir eski, bir yeni** zincir bulunur.',
      ),
      kart(
        'Eşlenmenin basamakları',
        'Her basamağı ayrı bir enzim yürütür; süreç enerji harcar.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Helikaz', alt: 'zincirleri açar' },
            { ad: 'DNA polimeraz', alt: 'nükleotit ekler', renk: 'ikincil' },
            { ad: 'DNA ligaz', alt: 'parçaları birleştirir' },
          ],
        },
      ),
      kart(
        'Helikaz',
        'Bazlar arasındaki **hidrojen bağlarını** koparıp iki zinciri fermuar gibi açar.\nAçılan her zincir yeni zincire kalıp olur.',
      ),
      kart(
        'DNA polimeraz',
        'Kalıptaki baza uygun serbest nükleotidi getirip yeni zincire bağlar.\nYeni zincir yalnızca **5’→3’** yönünde uzar.\nYanlış eklenen nükleotidi fark edip düzeltebilir.',
      ),
      kart(
        'Öncü ve geri kalan zincir',
        '- **Öncü zincir:** çatalın açıldığı yönde kesintisiz sentezlenir.\n- **Geri kalan zincir:** ters yönde, kısa parçalar (Okazaki) hâlinde sentezlenir.\nParçaları **DNA ligaz** birleştirir.',
      ),
      kart(
        'Meselson-Stahl deneyi',
        'Bakteriler önce ağır ¹⁵N, sonra hafif ¹⁴N ortamında çoğaltıldı.\nBir eşlenme sonra bütün DNA’lar **orta** ağırlıktaydı: yarı korunumlu model doğrulandı.',
      ),
      kart(
        'Kuşaklar boyunca',
        'Bir ¹⁵N’li DNA ¹⁴N ortamında eşlendikçe orta DNA sayısı hep **2** kalır.',
        {
          tur: 'tablo',
          basliklar: ['Eşlenme', 'Orta (¹⁵N–¹⁴N)', 'Hafif (¹⁴N–¹⁴N)'],
          satirlar: [
            ['1', '2', '0'],
            ['2', '2', '2'],
            ['3', '2', '6'],
          ],
        },
        { not: 'Kaç eşlenme olursa olsun iki eski zincir iki ayrı DNA’da kalır: orta DNA hep 2.' },
      ),
      kart(
        'Gereken nükleotit',
        'N nükleotitlik DNA bir kez eşlenince N yeni nükleotit kullanılır.\nn kez eşlenirse 2ⁿ DNA oluşur ve N · (2ⁿ − 1) nükleotit harcanır.',
      ),
      kart(
        'Neden önemli?',
        '- Bölünen hücreler aynı genetik bilgiyi taşır.\n- Kalıtım bilgisi kuşaktan kuşağa aktarılır.\n- Düzeltilemeyen eşlenme hatası **mutasyona** yol açabilir.',
      ),
    ], [], [
      {
        soru: 'Zincirler arasındaki hidrojen bağlarını koparan enzim hangisidir?',
        siklar: ['DNA ligaz', 'Helikaz'],
        dogru: 1,
        aciklama: {
          dogru: 'Helikaz hidrojen bağlarını koparıp iki zinciri ayırır.',
          yanlis: 'Ligaz DNA parçalarını birleştirir. Zincirleri açan helikaz.',
        },
        kart: 4,
      },
    ]),
    konu('byl12-transkripsiyon', 'Genetik Şifre ve Transkripsiyon', [
      kart(
        'Genden proteine',
        'Bilgi DNA’dan RNA’ya, oradan proteine akar.\nBu akışa moleküler biyolojinin **merkezi dogması** denir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'DNA', alt: 'gen' },
            { ad: 'mRNA', alt: 'transkripsiyon' },
            { ad: 'Protein', alt: 'translasyon', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Transkripsiyon',
        '- **Yeri:** ökaryotta çekirdek (ayrıca mitokondri, kloroplast), prokaryotta sitoplazma\n- **Enzim:** RNA polimeraz\n- **Kalıp:** genin yalnızca bir zinciri\n- **Ürün:** mRNA, tRNA ve rRNA',
      ),
      kart(
        'Eşleşme kuralı',
        'Kalıpta A varsa RNA’ya **U** gelir; RNA’da timin yoktur.',
        {
          tur: 'tablo',
          basliklar: ['Kalıp DNA', 'RNA'],
          satirlar: [
            ['A', 'U'],
            ['T', 'A'],
            ['G', 'C'],
            ['C', 'G'],
          ],
        },
      ),
      kart(
        'Genetik şifre üçlüdür',
        'mRNA üzerindeki her üç bazlık diziye **kodon** denir.\nDört baz üçlü dizilerle 4³ = 64 kodon kurar; 20 aminoasidi karşılamaya yeter.',
      ),
      kart(
        'Neden üçlü?',
        'İkili kod 4² = 16 seçenek verir; 20 aminoasit için yetmez.\nÜçlü kod, yetecek en kısa koddur.',
      ),
      kart(
        'Başla ve dur',
        '- **Başlatma kodonu:** AUG; metiyonini de kodlar.\n- **Durdurma kodonları:** UAA, UAG, UGA; aminoasit kodlamaz.\n64 kodonun 61’i aminoasit kodlar.',
      ),
      kart(
        'Şifrenin özellikleri',
        '- Bir aminoasidi birden çok kodon kodlayabilir.\n- Bir kodon yalnızca tek bir aminoasidi kodlar.\n- Kodonlar arada boşluk bırakmadan, örtüşmeden okunur.',
      ),
      kart(
        'Şifre evrenseldir',
        'Bakteriden insana hemen bütün canlılar aynı şifreyi kullanır.\nBakteriye aktarılan insan geni bu yüzden aynı proteini üretir.',
        undefined,
        { not: 'Evrensellik biyoteknolojinin temeli: insülin geni bakteride de insülin yaptırır.' },
      ),
      kart(
        'Kodondan antikodona',
        '- **DNA kalıbı:** 3’-TAC-5’\n- **mRNA kodonu:** 5’-AUG-3’\n- **tRNA antikodonu:** 3’-UAC-5’\nAntikodon, kodonun tamamlayıcısıdır.',
      ),
      kart(
        'Prokaryot ve ökaryot farkı',
        'Prokaryotta çekirdek zarı yoktur; mRNA sentezlenirken ribozom okumaya başlar.\nÖkaryotta mRNA önce çekirdekten çıkar, protein sitoplazmada yapılır.',
      ),
    ], [], [
      {
        soru: 'Kalıp DNA’daki A’nın karşısına RNA’da hangi baz gelir?',
        siklar: ['T', 'U'],
        dogru: 1,
        aciklama: {
          dogru: 'RNA’da timin yok; A’nın karşısına urasil gelir.',
          yanlis: 'T, DNA’ya özgü. RNA sentezinde A’nın karşısına U konur.',
        },
        kart: 3,
      },
    ]),
    konu('byl12-translasyon', 'Translasyon: Proteinin Kurulması', [
      kart(
        'Translasyon nedir?',
        'mRNA’daki kodon dizisinin aminoasit dizisine çevrilmesidir.\nSitoplazmadaki ribozomlarda gerçekleşir.',
      ),
      kart(
        'Görevli moleküller',
        '- **mRNA:** kodonları taşır.\n- **tRNA:** antikodonuna uygun aminoasidi getirir.\n- **Ribozom:** mRNA’yı okur, peptit bağını kurar.\n- **Enerji:** aminoasidin tRNA’ya bağlanması ATP harcar.',
      ),
      kart(
        'Ribozom',
        'Küçük ve büyük iki alt birimden oluşur; rRNA ve proteinden yapılmıştır.\nZarla çevrili değildir; bütün canlılarda bulunur.',
      ),
      kart(
        'Başlama',
        'Küçük alt birim mRNA’ya bağlanır; AUG kodonuna metiyonin taşıyan tRNA yerleşir.\nArdından büyük alt birim katılır.',
      ),
      kart(
        'Uzama',
        'Sıradaki kodona uygun tRNA gelir.\nRibozom iki aminoasit arasında **peptit bağı** kurar ve bir kodon ilerler.\nBoşalan tRNA ayrılıp yeni aminoasit almaya gider.',
      ),
      kart(
        'Bitiş',
        'Ribozom durdurma kodonuna gelince ona uyan tRNA yoktur.\nPolipeptit serbest kalır, alt birimler ayrılır.',
      ),
      kart(
        'Üç evre',
        'Her yeni peptit bağında bir su molekülü açığa çıkar.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Başlama', alt: 'AUG' },
            { ad: 'Uzama', alt: 'peptit bağı', renk: 'ikincil' },
            { ad: 'Bitiş', alt: 'durdurma kodonu' },
          ],
        },
      ),
      kart(
        'Sayı ilişkileri',
        'n aminoasitlik protein için:\n- mRNA’da en az n + 1 kodon (durdurma dahil), 3(n + 1) nükleotit\n- Peptit bağı ve açığa çıkan su: n − 1\n- Gende (çift zincir) en az 6(n + 1) nükleotit',
        undefined,
        { not: 'Durdurma kodonunu unutma: 100 aminoasit için 101 kodon, 303 mRNA nükleotidi.' },
      ),
      kart(
        'Polizom',
        'Bir mRNA’yı aynı anda birden çok ribozom okuyabilir.\nBöylece aynı proteinden kısa sürede çok sayıda üretilir.',
      ),
      kart(
        'Mutasyon proteini nasıl bozar?',
        '- **Yer değiştirme:** tek kodon değişir; aminoasit değişebilir ya da aynı kalabilir.\n- **Ekleme/eksilme:** okuma çerçevesi kayar; sonraki bütün kodonlar bozulur.',
      ),
    ], [], [
      {
        soru: '150 aminoasitlik bir proteinde kaç peptit bağı vardır?',
        siklar: ['149', '150'],
        dogru: 0,
        aciklama: {
          dogru: 'Bağ, iki aminoasit arasındadır: n − 1 = 149.',
          yanlis: '150 aminoasidi zincir hâlinde bağlamak 149 bağ ister; uçtaki aminoasitlerin bir yanı boştur.',
        },
        kart: 8,
      },
    ]),
    konu('byl12-biyoteknoloji', 'Genetik Mühendisliği ve Biyoteknoloji', [
      kart(
        'İki kavram',
        '- **Biyoteknoloji:** canlıları ya da parçalarını ürün ve hizmet elde etmek için kullanma\n- **Genetik mühendisliği:** canlının genlerini değiştirme, başka canlıya gen aktarma',
      ),
      kart(
        'Eski ve yeni',
        '- **Geleneksel:** yoğurt, peynir, ekmek, sirke; mikroorganizma fermantasyonu\n- **Modern:** gen aktarımı, rekombinant DNA, PCR\nGenetik mühendisliği modern biyoteknolojinin bir aracıdır.',
      ),
      kart(
        'Restriksiyon enzimi',
        'DNA’yı belirli bir baz dizisini tanıyıp o noktadan keser.\nKesilen uçlar çoğu zaman tek zincirli kalır; bu **yapışkan uçlar** başka DNA ile eşleşir.',
      ),
      kart(
        'DNA ligaz',
        'Yapışkan uçları eşleşen DNA parçalarını kalıcı olarak birleştirir.\nFarklı canlılardan gelen DNA’nın birleşmesiyle **rekombinant DNA** oluşur.',
      ),
      kart(
        'Vektör',
        'Genin hedef hücreye taşınmasını sağlayan araçtır.\n- **Plazmit:** bakterideki küçük halkasal DNA\n- **Virüs:** genetik materyalini hücreye sokabilir',
      ),
      kart(
        'Gen klonlama: insülin',
        'Gen ve plazmit aynı restriksiyon enzimiyle kesilir; uçlar böylece eşleşir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Geni kes', alt: 'restriksiyon enzimi' },
            { ad: 'Plazmidi aç', alt: 'aynı enzim' },
            { ad: 'Birleştir', alt: 'DNA ligaz' },
            { ad: 'Bakteriye aktar', alt: 'rekombinant plazmit' },
            { ad: 'Çoğalt', alt: 'insülin üretimi', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'PCR',
        'Az miktardaki DNA’yı laboratuvarda milyonlarca kez çoğaltır.\nIsıtma zincirleri ayırır, soğutma eşleşmeyi sağlar; ısıya dayanıklı DNA polimeraz kopyalar.',
      ),
      kart(
        'PCR’da çoğalma',
        'Her döngüde DNA miktarı iki katına çıkar: n döngüde 1 DNA’dan 2ⁿ DNA olur.\n10 döngüde 1024, 30 döngüde bir milyardan fazla kopya elde edilir.',
        undefined,
        { not: 'PCR enzimi kaplıcada yaşayan bir bakteriden alındı; kaynamaya yakın ısıda bozulmaz.' },
      ),
      kart(
        'Jel elektroforezi',
        'DNA parçalarını boylarına göre ayırır.\nDNA eksi yüklüdür, artı kutba gider; **küçük parçalar daha hızlı** ilerler.',
      ),
      kart(
        'Neden bakteri?',
        '- Hızlı çoğalır; kısa sürede çok ürün verir.\n- Plazmit taşır, dışarıdan DNA alabilir.\n- Kolay ve ucuz üretilir.\nŞifre evrensel olduğu için insan genini okuyabilir.',
      ),
    ], [], [
      {
        soru: 'DNA’yı belirli bir diziden kesen enzim hangisidir?',
        siklar: ['DNA ligaz', 'Restriksiyon enzimi'],
        dogru: 1,
        aciklama: {
          dogru: 'Restriksiyon enzimi belirli bir diziyi tanıyıp DNA’yı oradan keser.',
          yanlis: 'Ligaz keser değil birleştirir. Kesen restriksiyon enzimi.',
        },
        kart: 3,
      },
    ]),
    konu('byl12-biyotek-uygulama', 'Biyoteknoloji Uygulamaları ve Etkileri', [
      kart(
        'Tıpta üretim',
        'Rekombinant bakteri ve mayalarla üretilenler:\n- İnsülin\n- Büyüme hormonu\n- Hepatit B aşısı\nİlk rekombinant ilaç insan insülinidir (1982).',
      ),
      kart(
        'Gen tedavisi',
        'Hatalı geni olan hücreye sağlam genin kopyasını aktarma yöntemidir.\nGen genellikle zararsız hâle getirilmiş bir virüsle taşınır.',
      ),
      kart(
        'DNA parmak izi',
        'Tek yumurta ikizleri dışında her insanın DNA’sı kendine özgüdür.\nKesilen DNA parçalarının jeldeki bant deseni karşılaştırılır.\n- **Adli tıp:** suç yerindeki örnek\n- **Akrabalık:** babalık testi',
      ),
      kart(
        'Babalık testinde mantık',
        'Çocuğun her bandı anneden ya da babadan gelmiş olmalıdır.\nAnnede olmayan bantlar, olası babada bulunmalıdır.',
        undefined,
        { not: 'Çocuğun anneden gelmeyen bir bandı adayda yoksa o kişi baba olamaz; bantları eleyerek çöz.' },
      ),
      kart(
        'Tarımda GDO',
        '- **Bt mısırı:** bakteriden alınan genle kendi böcek zehrini üretir.\n- **Altın pirinç:** A vitamininin öncüsü beta karoteni taşır.\n- **Herbisite dayanıklı soya:** yabani ot ilacından etkilenmez.',
      ),
      kart(
        'Klonlama',
        'Dolly koyunu (1996), bir koyunun meme hücresi çekirdeğinin çekirdeksiz yumurtaya aktarılmasıyla doğdu.\nDolly, çekirdeği veren koyunun genetik kopyasıdır.',
      ),
      kart(
        'Kök hücre',
        'Farklılaşmamış, bölünerek farklı hücre tiplerine dönüşebilen hücrelerdir.\nKaynakları: embriyo, kemik iliği, göbek kordonu kanı\nLösemide kemik iliği nakli bir kök hücre tedavisidir.',
      ),
      kart(
        'Olumlu etkiler',
        '- Ucuz ve bol ilaç, aşı\n- Kalıtsal hastalıklara erken tanı\n- Verimi yüksek, hastalığa dayanıklı ürün\n- Petrol ve atık temizleyen bakteriler',
      ),
      kart(
        'Kaygılar',
        '- **Ekolojik:** aktarılan genin yabani türlere geçmesi, biyoçeşitliliğin azalması\n- **Sağlık:** alerji gibi öngörülemeyen etkiler\n- **Etik:** genetik bilginin gizliliği, insan klonlama',
      ),
      kart(
        'Biyogüvenlik',
        'Türkiye’de 2010 tarihli Biyogüvenlik Kanunu GDO’lu bitkilerin üretimini yasaklar.\nGDO’lu ürünlerin ithalatı izne bağlıdır.',
      ),
    ], [], [
      {
        soru: 'Bt mısırına bakteriden aktarılan gen ne sağlar?',
        siklar: ['Böceğe dayanıklılık', 'A vitamini'],
        dogru: 0,
        aciklama: {
          dogru: 'Gen, böcekleri öldüren bir protein ürettirir.',
          yanlis: 'A vitamini öncüsü altın pirinçte. Bt mısırı böcek zehri üretir.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('byl12-t2', 'Bitki Biyolojisi', [
    konu('byl12-bitki-doku', 'Bitki Dokuları', [
      kart(
        'İki büyük grup',
        '- **Bölünür doku (meristem):** sürekli bölünen, farklılaşmamış hücreler\n- **Değişmez doku:** bölünme yeteneğini yitirmiş, görev almış hücreler',
      ),
      kart(
        'Meristemler',
        '- **Uç meristem:** kök ve gövde ucunda; boyca büyüme\n- **Yanal meristem (kambiyum):** gövde ve kökte; enine kalınlaşma',
      ),
      kart(
        'Kambiyum ve yıllık halka',
        'Kambiyum içe ksilem, dışa floem üretir.\nİlkbahar ve yaz odunu farklı görünür; ağaç halkaları bu yüzden yaşı gösterir.',
      ),
      kart(
        'Örtü doku',
        '- **Epidermis:** tek sıra hücre; üstü mumsu kutikulayla örtülü\n- **Mantar (periderm):** kalınlaşan gövde ve kökte epidermisin yerini alır\nEpidermiste stoma ve tüyler, kökte emici tüyler bulunur.',
      ),
      kart(
        'Parankima',
        'Canlı, ince çeperli hücrelerdir; işine göre adlanır.\n- **Özümleme:** yaprakta fotosentez\n- **Depo:** patates yumrusunda nişasta\n- **Havalandırma:** su bitkilerinde hava boşlukları',
      ),
      kart(
        'Destek dokular',
        'Kollenkima esnek, sklerenkima sert destek verir.',
        {
          tur: 'tablo',
          basliklar: ['Doku', 'Hücre', 'Nerede?'],
          satirlar: [
            ['Kollenkima', 'Canlı, köşeleri kalın', 'Genç gövde, yaprak sapı'],
            ['Sklerenkima', 'Ölü, lignin kaplı', 'Lifler, armut taş hücresi'],
          ],
        },
      ),
      kart(
        'Ksilem (odun borusu)',
        'Su ve mineralleri kökten yapraklara taşır; akış **tek yönlü** ve yukarı doğrudur.\nTrake ve trakeitleri ölü, çeperi lignin kaplı hücrelerdir.',
      ),
      kart(
        'Floem (soymuk borusu)',
        'Fotosentez ürünlerini taşır; akış **iki yönlü** olabilir.\nKalburlu boru hücreleri canlıdır ama çekirdekleri yoktur; arkadaş hücreler onları destekler.',
      ),
      kart(
        'İletim demeti',
        'Ksilem ve floem yan yana durup iletim demetini oluşturur.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Ksilem', 'Floem'],
          satirlar: [
            ['Hücreler', 'Ölü', 'Canlı'],
            ['Taşıdığı', 'Su, mineral', 'Organik madde'],
            ['Yön', 'Tek yönlü', 'İki yönlü'],
          ],
        },
        { not: 'Ksilem ölü, floem canlı: halkalama ve zehir sorularının anahtarı bu.' },
      ),
      kart(
        'Tek ve çift çenekliler',
        'Buğday ve mısır tek, fasulye ve meşe çift çeneklidir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Tek çenekli', 'Çift çenekli'],
          satirlar: [
            ['Gövdede demet', 'Dağınık', 'Halka şeklinde'],
            ['Kambiyum', 'Genelde yok', 'Var'],
            ['Yaprak damarı', 'Paralel', 'Ağsı'],
            ['Kök', 'Saçak', 'Kazık'],
          ],
        },
      ),
    ], [], [
      {
        soru: 'Gövdenin enine kalınlaşmasını sağlayan doku hangisidir?',
        siklar: ['Uç meristem', 'Kambiyum'],
        dogru: 1,
        aciklama: {
          dogru: 'Kambiyum yanal meristemdir; içe ksilem, dışa floem üreterek gövdeyi kalınlaştırır.',
          yanlis: 'Uç meristem boyca uzamayı sağlar. Kalınlaşma kambiyumla olur.',
        },
        kart: 2,
      },
    ]),
    konu('byl12-kok-govde-yaprak', 'Kök, Gövde ve Yaprak', [
      kart(
        'Çiçekli bitkinin kısımları',
        'Bitki toprak altındaki kök ve toprak üstündeki sürgün sisteminden oluşur.',
        {
          tur: 'tablo',
          basliklar: ['Kısım', 'Başlıca görev'],
          satirlar: [
            ['Kök', 'Tutunma, su ve mineral alma'],
            ['Gövde', 'Destek, iletim'],
            ['Yaprak', 'Fotosentez, terleme'],
            ['Çiçek', 'Eşeyli üreme'],
          ],
        },
      ),
      kart(
        'Kökün bölgeleri',
        'Yukarıdan kök ucuna doğru dört bölge sıralanır.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Olgunlaşma bölgesi', alt: 'emici tüyler' },
            { ad: 'Uzama bölgesi', alt: 'hücreler boyca uzar' },
            { ad: 'Bölünme bölgesi', alt: 'uç meristem', renk: 'ikincil' },
            { ad: 'Kaliptra', alt: 'kök ucunu korur' },
          ],
        },
      ),
      kart(
        'Kökün enine kesiti',
        'Dıştan merkeze doğru:',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Epidermis', alt: 'emici tüyler' },
            { ad: 'Korteks', alt: 'depo, su geçişi' },
            { ad: 'Endodermis', alt: 'kaspari şeridi' },
            { ad: 'Perisikl', alt: 'yan kökler buradan çıkar' },
            { ad: 'İletim demeti', alt: 'ksilem, floem', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Kök çeşitleri',
        '- **Kazık kök:** belirgin bir ana kök; çift çeneklilerde (havuç)\n- **Saçak kök:** eşit kalınlıkta çok sayıda kök; tek çeneklilerde (buğday)\nHavuç ve pancarın kökü besin depolar.',
      ),
      kart(
        'Gövde',
        'Yaprak ve çiçekleri taşır; kök ile yaprak arasında taşıma yapar.\nYaprağın gövdeye bağlandığı yere **boğum** denir; koltuğunda tomurcuk bulunur.',
      ),
      kart(
        'Değişikliğe uğramış gövdeler',
        '- **Yumru:** patates; gözleri tomurcuktur\n- **Rizom:** zencefil, ayrık otu; toprak altında yatay uzanır\n- **Soğan:** gövde çok kısadır, etli yapraklar besin depolar',
        undefined,
        { not: 'Patates kök değil gövdedir: üzerinde tomurcuk (göz) var. Havuç ise köktür.' },
      ),
      kart(
        'Yaprağın yapısı',
        'Yaprak ayası ve yaprak sapından oluşur.\nAyadaki damarlar iletim demetleridir; su getirir, fotosentez ürününü götürür.',
      ),
      kart(
        'Yaprağın enine kesiti',
        'Fotosentez en çok palizat parankimasında olur.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Kutikula', alt: 'su kaybını azaltır' },
            { ad: 'Üst epidermis', alt: 'renksiz, ışık geçer' },
            { ad: 'Palizat parankiması', alt: 'sık, çok kloroplast', renk: 'ikincil' },
            { ad: 'Sünger parankiması', alt: 'hava boşluklu' },
            { ad: 'Alt epidermis', alt: 'stomalar' },
          ],
        },
      ),
      kart(
        'Stoma',
        'İki **bekçi hücresi** arasındaki açıklıktır; gaz alışverişi ve terleme buradan olur.\nBekçi hücreleri kloroplast taşır, öteki epidermis hücreleri genelde taşımaz.',
      ),
      kart(
        'Ortama uyan yapraklar',
        '- **Kurak ortam:** kalın kutikula, az ve çukurda stoma, iğne yaprak (kaktüs)\n- **Su yüzeyi:** ince kutikula, stomalar üst yüzde (nilüfer)',
      ),
    ], [], [
      {
        soru: 'Kökte emici tüyler hangi bölgede bulunur?',
        siklar: ['Uzama bölgesi', 'Olgunlaşma bölgesi'],
        dogru: 1,
        aciklama: {
          dogru: 'Emici tüyler, uzaması bitmiş olgunlaşma bölgesindeki epidermis hücrelerinden çıkar.',
          yanlis: 'Uzama bölgesindeki hücreler henüz uzuyor. Emici tüyler olgunlaşma bölgesinde.',
        },
        kart: 2,
      },
    ]),
    konu('byl12-su-emilim', 'Köklerde Su ve Mineral Emilimi', [
      kart(
        'Emici tüyler',
        'Kök epidermis hücrelerinin ince uzantılarıdır.\nKökün yüzey alanını çok artırır; su ve minerallerin çoğu buradan alınır.',
      ),
      kart(
        'Su osmozla girer',
        'Kök hücrelerinde çözünen derişimi topraktakinden yüksektir.\nSu, derişimi düşük topraktan köke **osmozla** geçer; enerji harcanmaz.',
      ),
      kart(
        'Mineraller aktif taşınır',
        'Mineral iyonları kök hücrelerinde topraktakinden çok daha derişiktir.\nBu yüzden çoğu **aktif taşımayla**, ATP harcanarak alınır.',
      ),
      kart(
        'Oksijen gerekir',
        'Aktif taşıma ATP, ATP de oksijenli solunum ister.\nSu basmış, havasız toprakta mineral alımı azalır, bitki zarar görür.',
        undefined,
        { not: 'Saksıyı sürekli sulamak kökü havasız bırakır: mineral alımı düşer, kök çürür.' },
      ),
      kart(
        'İki yol',
        'Su ve mineraller korteksi iki yoldan geçer.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Nereden geçer?'],
          satirlar: [
            ['Apoplast', 'Çeperler, hücre araları'],
            ['Simplast', 'Sitoplazma, plazmodezm'],
          ],
        },
      ),
      kart(
        'Kaspari şeridi',
        'Endodermis hücrelerinin çeperindeki **suberinli** şerit apoplast yolunu kapatır.\nMadde burada zarı geçmek zorundadır; bitki neyi alacağını seçer.',
      ),
      kart(
        'Kök basıncı',
        'Ksileme pompalanan iyonlar oradaki derişimi artırır.\nSu osmozla ksileme girer; oluşan basınç suyu yukarı iter.',
      ),
      kart(
        'Gutasyon',
        'Gece ve nemli havada terleme azalır; kök basıncı suyu yaprak kenarından damla hâlinde çıkarır.\nSabah yapraklardaki damlaların bir kısmı çiy değil gutasyondur.',
      ),
      kart(
        'Yardımcı ortaklıklar',
        '- **Mikoriza:** mantar hifleri kökün emme alanını genişletir.\n- **Kök nodülü:** baklagillerde Rhizobium bakterisi havadaki azotu bağlar.',
      ),
      kart(
        'Fazla gübre',
        'Toprağa çok gübre verilirse toprak suyunun derişimi kök hücrelerininkini aşar.\nSu kökten toprağa geçer, bitki solar.',
      ),
    ], [], [
      {
        soru: 'Endodermiste apoplast yolunu kesen yapı hangisidir?',
        siklar: ['Kaspari şeridi', 'Kutikula'],
        dogru: 0,
        aciklama: {
          dogru: 'Suberinli kaspari şeridi çeperden geçişi kapatır; madde zarı geçmek zorunda kalır.',
          yanlis: 'Kutikula yaprak ve gövdenin dış yüzündedir. Kökte yolu kesen kaspari şeridi.',
        },
        kart: 6,
      },
    ]),
    konu('byl12-ksilem', 'Su ve Minerallerin Taşınması', [
      kart(
        'Su nasıl yükselir?',
        'Ağaçta su onlarca metre yukarı, hiçbir pompa olmadan çıkar.\nÜç kuvvet birlikte çalışır: terleme çekimi, kök basıncı, kılcallık.',
      ),
      kart(
        'Terleme',
        'Yapraklardaki suyun büyük kısmı **stomalardan** buhar olarak kaybolur.\nBitki aldığı suyun %90’dan fazlasını terlemeyle kaybeder.',
      ),
      kart(
        'Kohezyon-gerilim',
        'Ksilemde su, terlemenin oluşturduğu çekimle kesintisiz bir sütun hâlinde yükselir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Terleme', alt: 'yaprakta buharlaşma' },
            { ad: 'Gerilim', alt: 'su yukarı çekilir', renk: 'ikincil' },
            { ad: 'Kökten giriş', alt: 'yeni su alınır' },
          ],
        },
      ),
      kart(
        'Kohezyon ve adezyon',
        '- **Kohezyon:** su moleküllerinin hidrojen bağlarıyla birbirini çekmesi\n- **Adezyon:** suyun ksilem çeperine tutunması\nİkisi su sütununun kopmasını önler.',
      ),
      kart(
        'Kılcallık ve kök basıncı',
        '- **Kılcallık:** ince borularda suyun kendiliğinden biraz yükselmesi\n- **Kök basıncı:** aşağıdan itme; etkisi gece ve ilkbaharda belirgin\nUzun ağaçta asıl kuvvet terleme çekimidir.',
      ),
      kart(
        'Stoma nasıl açılır?',
        'Bekçi hücrelerine K⁺ iyonları pompalanır, su osmozla girer.\nTurgoru artan bekçi hücreleri kıvrılır ve stoma açılır.\nSu çıkınca stoma kapanır.',
      ),
      kart(
        'Stomayı etkileyenler',
        'Stoma, su kaybı ile CO₂ alımı arasında denge kurar.',
        {
          tur: 'tablo',
          basliklar: ['Etken', 'Stoma'],
          satirlar: [
            ['Işık', 'Açılır'],
            ['Su eksikliği, absisik asit', 'Kapanır'],
            ['Yaprakta CO₂ artışı', 'Kapanır'],
            ['Aşırı sıcaklık', 'Kapanır'],
          ],
        },
      ),
      kart(
        'Terlemeyi etkileyenler',
        'Terleme, yaprağın içi ile hava arasındaki nem farkına bağlıdır.',
        {
          tur: 'tablo',
          basliklar: ['Etken artarsa', 'Terleme'],
          satirlar: [
            ['Işık şiddeti', 'Artar'],
            ['Sıcaklık', 'Artar'],
            ['Rüzgâr', 'Artar'],
            ['Havanın nemi', 'Azalır'],
          ],
        },
        { not: 'Nemli havada terleme düşer ama gutasyon artar; ikisini aynı soruda karşılaştırırlar.' },
      ),
      kart(
        'Terleme ve gutasyon',
        'Gutasyon suyuyla mineraller de çıkar; yaprak kenarında tuz izi kalabilir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Terleme', 'Gutasyon'],
          satirlar: [
            ['Su hâli', 'Buhar', 'Sıvı damla'],
            ['Çıktığı yer', 'Stoma', 'Su açıklığı'],
            ['Zaman', 'Gündüz', 'Gece, nemli hava'],
            ['Kuvvet', 'Buharlaşma', 'Kök basıncı'],
          ],
        },
      ),
      kart(
        'Terlemenin yararları',
        '- Su ve mineralleri yukarı çeker.\n- Buharlaşma yaprağı serinletir.\n- Ksilemdeki akış mineralleri bitkiye dağıtır.\nBedeli: kurak günde fazla su kaybı.',
      ),
    ], [], [
      {
        soru: 'Su moleküllerinin birbirini çekmesine ne denir?',
        siklar: ['Adezyon', 'Kohezyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Kohezyon su molekülleri arasındaki çekimdir; sütunun kopmasını önler.',
          yanlis: 'Adezyon suyun çepere tutunmasıdır. Moleküllerin birbirini çekmesi kohezyon.',
        },
        kart: 4,
      },
    ]),
    konu('byl12-floem', 'Fotosentez Ürünlerinin Taşınması', [
      kart(
        'Ne taşınır?',
        'Floemde başlıca **sakkaroz** taşınır.\nAyrıca aminoasitler, hormonlar ve bazı mineraller de taşınır.',
      ),
      kart(
        'Kaynak ve havuz',
        '- **Kaynak:** şekeri üreten ya da veren organ; olgun yaprak, ilkbaharda depo kökü\n- **Havuz:** şekeri kullanan ya da depolayan organ; kök, meyve, büyüyen uç',
      ),
      kart(
        'Yön değişebilir',
        'Bir depo organı yazın havuz, ilkbaharda kaynak olur.\nPancar kökü ilk yıl şeker depolar, ertesi yıl çiçek için şekeri yukarı verir.',
      ),
      kart(
        'Basınç akış modeli',
        'Kaynakta basınç yüksek, havuzda düşüktür; özsu bu farkla akar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Yükleme', alt: 'kaynakta şeker floeme' },
            { ad: 'Su girer', alt: 'ksilemden osmozla' },
            { ad: 'Akış', alt: 'basınç farkıyla', renk: 'ikincil' },
            { ad: 'Boşaltma', alt: 'havuzda şeker çıkar' },
          ],
        },
      ),
      kart(
        'Yükleme enerji ister',
        'Sakkaroz kaynakta kalburlu borulara **aktif taşımayla** yüklenir.\nArkadaş hücreler bu iş için gereken ATP’yi sağlar.',
      ),
      kart(
        'Suyun rolü',
        'Floeme giren su ksilemden gelir; havuzda şeker çıkınca su ksileme döner.\nKsilem ve floem bu yüzden birbirine bağlı çalışır.',
      ),
      kart(
        'Halkalama deneyi',
        'Gövdenin kabuğu halka şeklinde soyulursa floem kesilir, ksilem sağlam kalır.\nHalkanın üstü şişer; kökler şeker alamaz, bitki zamanla ölür.',
        undefined,
        { not: 'Halkalamadan sonra yaprak hemen solmaz: ksilem sağlam, su gitmeye devam eder.' },
      ),
      kart(
        'Yaprak biti deneyi',
        'Yaprak biti hortumunu tek bir kalburlu boruya sokar.\nHortum kesilince damlayan sıvıyla floem özsuyu incelendi.',
      ),
      kart(
        'İki taşıma karşılaştırması',
        'İki sistem aynı demette ama farklı kuvvetlerle çalışır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Ksilem', 'Floem'],
          satirlar: [
            ['İtici kuvvet', 'Terleme çekimi', 'Basınç farkı'],
            ['Enerji', 'Hücreler harcamaz', 'Yüklemede ATP'],
            ['Yön', 'Kökten yukarı', 'Kaynaktan havuza'],
          ],
        },
      ),
      kart(
        'Meyveler şekeri çeker',
        'Gelişen meyve güçlü bir havuzdur.\nSeyreltme yapılan ağaçta kalan meyveler daha çok şeker alır, iri olur.',
      ),
    ], [], [
      {
        soru: 'Floemde başlıca taşınan şeker hangisidir?',
        siklar: ['Glikoz', 'Sakkaroz'],
        dogru: 1,
        aciklama: {
          dogru: 'Fotosentez ürünü floemde sakkaroz olarak taşınır.',
          yanlis: 'Glikoz yaprakta sakkaroza çevrilip öyle taşınır.',
        },
        kart: 1,
      },
    ]),
    konu('byl12-cicek', 'Çiçeğin Yapısı', [
      kart(
        'Çiçeğin görevi',
        'Çiçek, kapalı tohumlu bitkilerin eşeyli üreme organıdır.\nGamet oluşumu, tozlaşma ve döllenme burada olur.',
      ),
      kart(
        'Çiçeğin kısımları',
        'Hepsi çiçek tablasına bağlıdır.',
        {
          tur: 'tablo',
          basliklar: ['Kısım', 'Görev'],
          satirlar: [
            ['Çanak yaprak', 'Tomurcukta çiçeği korur'],
            ['Taç yaprak', 'Tozlaşmacıyı çeker'],
            ['Erkek organ', 'Polen üretir'],
            ['Dişi organ', 'Tohum taslağını taşır'],
          ],
        },
      ),
      kart(
        'Erkek organ',
        '- **Başçık (anter):** polenin üretildiği kese\n- **Sapçık:** başçığı taşıyan ince sap',
      ),
      kart(
        'Dişi organ',
        '- **Tepecik:** yapışkan uç; polen buraya konar\n- **Dişicik borusu:** polen tüpünün ilerlediği yol\n- **Yumurtalık:** içinde tohum taslakları bulunur',
      ),
      kart(
        'Tam ve eksik çiçek',
        '- **Tam çiçek:** çanak, taç, erkek ve dişi organın dördü de var\n- **Eksik çiçek:** bu kısımlardan en az biri yok\nRüzgârla tozlaşan çiçeklerde taç yaprak çoğu zaman yoktur.',
      ),
      kart(
        'Erdişi ve tek eşeyli',
        '- **Erdişi çiçek:** erkek ve dişi organ aynı çiçekte (lale, elma)\n- **Tek eşeyli çiçek:** yalnız erkek ya da yalnız dişi organ\nTek eşeyli çiçek her zaman eksik çiçektir.',
      ),
      kart(
        'Bir evcikli, iki evcikli',
        '- **Bir evcikli:** erkek ve dişi çiçek aynı bitkide (mısır)\n- **İki evcikli:** erkek ve dişi çiçek ayrı bitkilerde (söğüt, hurma)\nİki evciklide kendi kendine tozlaşma olmaz.',
        undefined,
        { not: 'Erdişi tek çiçeği, bir evcikli tek bitkiyi anlatır: mısırda çiçekler ayrı, bitki aynı.' },
      ),
      kart(
        'Polen oluşumu',
        'Olgun polende iki çekirdek vardır: tüp çekirdeği ve üreme (generatif) çekirdeği.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ana hücre', alt: '2n, başçıkta' },
            { ad: 'Mayoz', alt: '4 mikrospor (n)', renk: 'ikincil' },
            { ad: 'Mitoz', alt: 'iki çekirdekli polen' },
          ],
        },
      ),
      kart(
        'Embriyo kesesi',
        'Kesedeki **yumurta hücresi** ve iki **kutup çekirdeği** döllenmede rol alır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ana hücre', alt: '2n, tohum taslağında' },
            { ad: 'Mayoz', alt: '4 megaspordan 3’ü ölür', renk: 'ikincil' },
            { ad: '3 kez mitoz', alt: '8 çekirdekli kese' },
          ],
        },
      ),
      kart(
        'Tozlaşma',
        'Polenin tepeciğe taşınmasıdır.\n- **Böcekle:** renkli, kokulu, nektarlı çiçek; iri ve yapışkan polen\n- **Rüzgârla:** gösterişsiz çiçek, bol ve hafif polen, tüysü tepecik (buğday)',
      ),
    ], [], [
      {
        soru: 'Polen hangi yapıda üretilir?',
        siklar: ['Başçık', 'Tepecik'],
        dogru: 0,
        aciklama: {
          dogru: 'Polen erkek organın başçığında (anterinde) oluşur.',
          yanlis: 'Tepecik dişi organın polen tutan ucudur. Polen başçıkta üretilir.',
        },
        kart: 3,
      },
    ]),
    konu('byl12-dollenme', 'Döllenme, Tohum ve Meyve', [
      kart(
        'Polen tüpü',
        'Tepeciğe konan polen çimlenir ve dişicik borusunda bir tüp uzatır.\nÜreme çekirdeği mitozla bölünerek iki sperm çekirdeği oluşturur.',
      ),
      kart(
        'Çift döllenme',
        'Kapalı tohumlularda iki sperm çekirdeği iki ayrı döllenme yapar.',
        {
          tur: 'tablo',
          basliklar: ['Birleşen', 'Ürün'],
          satirlar: [
            ['Sperm + yumurta', 'Zigot (2n) → embriyo'],
            ['Sperm + 2 kutup çekirdeği', 'Endosperm (3n)'],
          ],
        },
      ),
      kart(
        'Zigot ve embriyo',
        'Zigot (2n) mitozla bölünerek **embriyoyu** oluşturur.\nEmbriyo kökçük, gövdecik ve çenek(ler)den oluşur.',
      ),
      kart(
        'Endosperm',
        'Üç kromozom takımlı (3n) besin dokusudur.\nÇimlenen embriyo bu besini kullanır; buğday ununun büyük kısmı endospermdir.',
      ),
      kart(
        'Neyden ne olur?',
        '- **Tohum taslağı:** tohuma dönüşür.\n- **Taslağın örtüleri:** tohum kabuğuna dönüşür.\n- **Yumurtalık duvarı:** meyveye dönüşür.\nTohum kabuğu ve meyve ana bitkinin dokusudur (2n).',
      ),
      kart(
        'Kromozom sayıları',
        'Endospermde iki takım anneden (kutup çekirdekleri), bir takım babadan gelir.',
        {
          tur: 'tablo',
          basliklar: ['Yapı', 'Takım', '2n = 24 ise'],
          satirlar: [
            ['Tüp çekirdeği', 'n', '12'],
            ['Embriyo', '2n', '24'],
            ['Endosperm', '3n', '36'],
            ['Tohum kabuğu, meyve', '2n', '24'],
          ],
        },
        { not: 'Tohum kabuğu ve meyve babanın genini taşımaz: ikisi de ana bitkinin kendi dokusu.' },
      ),
      kart(
        'Besin nerede?',
        '- **Fasulye:** besin çeneklerde depolanır; olgun tohumda endosperm çok azdır.\n- **Mısır, buğday:** endosperm büyüktür; tek çenek besini emip embriyoya verir.',
      ),
      kart(
        'Meyve',
        'Döllenmeden sonra yumurtalık büyüyüp meyveye dönüşür.\nMeyve tohumu korur ve yayılmasına yardım eder.',
      ),
      kart(
        'Yalancı meyve, partenokarpi',
        '- **Yalancı meyve:** meyveye çiçek tablası gibi başka kısımlar katılır (elma, çilek).\n- **Partenokarpi:** döllenme olmadan çekirdeksiz meyve oluşur (muz).',
      ),
      kart(
        'Tohumun yayılması',
        '- **Rüzgâr:** kanatlı ya da tüylü tohum (akçaağaç, karahindiba)\n- **Hayvan:** etli meyve yenir, tohum dışkıyla yayılır\n- **Su:** hindistan cevizi\nYayılma, yavrunun ana bitkiyle rekabetini azaltır.',
      ),
    ], [], [
      {
        soru: 'Endosperm kaç kromozom takımı taşır?',
        siklar: ['2n', '3n'],
        dogru: 1,
        aciklama: {
          dogru: 'İki kutup çekirdeği (n + n) ve bir sperm (n) birleşir: 3n.',
          yanlis: '2n zigot ve embriyodur. Endosperm üç çekirdeğin birleşmesinden: 3n.',
        },
        kart: 4,
      },
    ]),
    konu('byl12-cimlenme', 'Tohum Çimlenmesi ve Dormansi', [
      kart(
        'Çimlenme',
        'Tohumdaki embriyonun uygun koşullarda büyümeye başlayıp fideye dönüşmesidir.\nİlk çıkan yapı **kökçüktür**; fide önce suya ve toprağa tutunur.',
      ),
      kart(
        'Gerekli koşullar',
        '- **Su:** tohumun şişmesi, enzimlerin çalışması\n- **Oksijen:** solunumla enerji\n- **Uygun sıcaklık:** enzimlerin çalışma aralığı\nBazı tohumlar ışık ister, bazıları karanlıkta çimlenir.',
      ),
      kart(
        'Şişme',
        'Kuru tohum suyu hızla emer ve şişer; kabuk yırtılır.\nBu ilk su alımı ölü tohumda da olur; canlılığı göstermez.',
      ),
      kart(
        'Depo besin çözülür',
        'Tahıllarda depo nişasta, enzimlerle embriyonun kullanacağı şekere çevrilir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Su alımı', alt: 'şişme' },
            { ad: 'Gibberellin', alt: 'embriyodan' },
            { ad: 'Amilaz', alt: 'nişastayı parçalar', renk: 'ikincil' },
            { ad: 'Şeker', alt: 'solunuma' },
          ],
        },
      ),
      kart(
        'Ağırlık değişimi',
        '- **Yaş ağırlık:** su alındıkça artar.\n- **Kuru ağırlık:** solunumla azalır; yapraklar fotosenteze başlayınca artar.',
        undefined,
        { not: 'Çimlenen tohumda organik madde fotosentez başlayana kadar azalır: grafik sorusu buradan.' },
      ),
      kart(
        'Toprak üstü ve altı',
        '- **Toprak üstü çimlenme:** çenekler toprak yüzüne çıkar (fasulye).\n- **Toprak altı çimlenme:** çenekler toprakta kalır (bezelye, mısır).',
      ),
      kart(
        'Dormansi',
        'Canlı tohumun uygun koşullarda bile çimlenmemesidir; tohumun uyku hâlidir.\nÇimlenmeyi kötü mevsimden sonraya erteler.',
      ),
      kart(
        'Dormansinin nedenleri',
        '- **Sert kabuk:** su ve oksijen geçirmez\n- **Absisik asit:** büyümeyi baskılar\n- **Olgunlaşmamış embriyo:** gelişmesini tamamlamamıştır\n- **Engelleyici maddeler:** kabukta ya da meyvede bulunur',
      ),
      kart(
        'Dormansi nasıl kırılır?',
        '- **Soğuklama:** nemli ve soğukta bekletme; kış geçmiş gibi\n- **Kabuğu aşındırma:** zımparalama ya da hayvanın sindirim kanalı\n- **Yıkama:** yağmurun engelleyici maddeleri gidermesi',
      ),
      kart(
        'Çimlenme deneyi',
        'Her kapta tek koşul değişir; 1. kap kontroldür.',
        {
          tur: 'tablo',
          basliklar: ['Kap', 'Koşul', 'Sonuç'],
          satirlar: [
            ['1', 'Nem, hava, 25 °C', 'Çimlenir'],
            ['2', 'Kuru', 'Çimlenmez'],
            ['3', 'Suyun altında (havasız)', 'Çimlenmez'],
            ['4', 'Buzdolabı (4 °C)', 'Gecikir'],
          ],
        },
      ),
    ], [], [
      {
        soru: 'Çimlenen tohumdan ilk çıkan yapı hangisidir?',
        siklar: ['Gövdecik', 'Kökçük'],
        dogru: 1,
        aciklama: {
          dogru: 'Önce kökçük çıkar; fide suya ve toprağa tutunur.',
          yanlis: 'Gövdecik kökçükten sonra çıkar. İlk yapı kökçük.',
        },
        kart: 1,
      },
    ]),
  ]),
  tema('byl12-t3', 'Canlılar ve Çevre', [
    konu('byl12-cevre-genetik', 'Çevre Şartları ve Genetik Değişim', [
      kart(
        'Fenotip',
        'Bir özelliğin görünüşü, genotip ve çevrenin birlikte etkisiyle oluşur.\nFenotip = genotip + çevre',
      ),
      kart(
        'Modifikasyon',
        'Çevrenin etkisiyle fenotipte oluşan, **kalıtsal olmayan** değişimdir.\nDNA değişmez; özellik yavruya aktarılmaz.',
      ),
      kart(
        'Modifikasyon örnekleri',
        '- **Ortanca:** asitli toprakta mavi, bazik toprakta pembe çiçek\n- **Himalaya tavşanı:** soğuk kalan kulak ve burun uçlarında siyah kıl\n- **Bronzlaşma:** güneşte deride melanin artışı',
      ),
      kart(
        'Mutasyon',
        'DNA’nın baz dizisinde ya da kromozomlarda oluşan kalıcı değişimdir.\nKendiliğinden de olur; bazı etmenler sıklığını artırır.',
      ),
      kart(
        'Mutasyona yol açanlar',
        '- Morötesi (UV), X ve gama ışınları\n- Bazı kimyasallar; tütün dumanındaki maddeler\n- Bazı virüsler\nYüksek sıcaklık da mutasyon sıklığını artırabilir.',
      ),
      kart(
        'Hangi mutasyon kalıtılır?',
        '- **Üreme hücresinde:** yavruya geçer.\n- **Vücut hücresinde:** yalnız o bireyi etkiler, yavruya geçmez; kanser bir örnektir.',
        undefined,
        { not: 'Güneşin deri hücresinde yaptığı mutasyon çocuğa geçmez; yalnız üreme hücresindeki geçer.' },
      ),
      kart(
        'Adaptasyon',
        'Canlının belirli bir ortamda yaşama ve üreme şansını artıran **kalıtsal** özelliğidir.\nÇöl tilkisinin büyük kulakları vücut ısısını atmayı kolaylaştırır.',
      ),
      kart(
        'Doğal seçilim',
        'Çevre yeni özellik yaratmaz; var olan çeşitlilik içinden seçer.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Varyasyon', alt: 'bireyler farklıdır' },
            { ad: 'Rekabet', alt: 'kaynaklar sınırlı' },
            { ad: 'Seçilim', alt: 'uyumlu olan çoğalır', renk: 'ikincil' },
            { ad: 'Değişim', alt: 'özellik yayılır' },
          ],
        },
      ),
      kart(
        'Antibiyotik direnci',
        'Bakteri popülasyonunda dirençli birkaç birey zaten vardır.\nAntibiyotik duyarlıları öldürür; dirençliler çoğalır, popülasyon dirençli olur.',
      ),
      kart(
        'Sanayi melanizmi',
        'İngiltere’de isle kararan ağaçlarda koyu renkli güveler kuşlardan daha iyi saklandı.\nKoyu güvelerin oranı arttı; hava temizlenince yeniden azaldı.',
      ),
    ], [], [
      {
        soru: 'Ortancanın toprağa göre çiçek rengi değiştirmesi hangisidir?',
        siklar: ['Mutasyon', 'Modifikasyon'],
        dogru: 1,
        aciklama: {
          dogru: 'DNA değişmeden çevreyle değişen fenotip modifikasyondur.',
          yanlis: 'Mutasyon DNA’da kalıcı değişimdir. Toprakla gelip giden renk modifikasyon.',
        },
        kart: 3,
      },
    ]),
    konu('byl12-yapay-secilim', 'Tarım ve Hayvancılıkta Yapay Seçilim', [
      kart(
        'Yapay seçilim',
        'İnsanın istediği özellikteki bireyleri seçip yalnız onları çoğaltmasıdır.\nKuşaklar boyunca o özellik popülasyonda artar.',
      ),
      kart(
        'Doğal ve yapay',
        'İkisi de var olan kalıtsal çeşitlilikten seçer.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Doğal seçilim', 'Yapay seçilim'],
          satirlar: [
            ['Seçen', 'Çevre', 'İnsan'],
            ['Ölçüt', 'Yaşama, üreme', 'İnsanın yararı'],
            ['Hız', 'Çok yavaş', 'Daha hızlı'],
          ],
        },
      ),
      kart(
        'Yabani lahanadan sebzelere',
        'Tek bir yabani türden farklı organlar seçilerek:\n- **Lahana:** tepe tomurcuğu\n- **Brokoli, karnabahar:** çiçek kümesi\n- **Brüksel lahanası:** yan tomurcuklar\n- **Alabaş:** gövde',
      ),
      kart(
        'Tahıllar',
        'Mısır, Orta Amerika’daki yabani **teosinte** bitkisinden binlerce yılda seçilerek geliştirildi.\nBuğdayda dökülmeyen başak ve iri tane seçildi.',
      ),
      kart(
        'Hayvancılık',
        '- **Süt ineği:** çok süt veren inekler çiftleştirilir.\n- **Merinos koyunu:** ince ve bol yün\n- **Etlik piliç:** hızlı kilo alma',
      ),
      kart(
        'Köpek ırkları',
        'Bütün köpek ırkları kurttan evcilleştirilen atalardan seçilerek türedi.\nÇivava ile Danua aynı türdür; çiftleşip verimli yavru verebilir.',
      ),
      kart(
        'Melezleme',
        'İki farklı çeşidin üstün özellikleri çaprazlamayla bir araya getirilir.\nHibrit mısır ana ve babasından daha verimli olabilir (melez azmanlığı).',
      ),
      kart(
        'Seçilim gen aktarmaz',
        'Yapay seçilim türün kendi genlerini kullanır; başka türden gen eklenmez.\nGDO’da ise başka canlıdan gen aktarılır.',
        undefined,
        { not: 'Seçilim var olanı seçer, GDO yeni gen ekler; "ıslah = GDO" diyen şık yanlış.' },
      ),
      kart(
        'Bedeli: çeşitlilik azalır',
        'Hep aynı çeşidi ekmek genetik çeşitliliği azaltır.\nİrlanda’da 1845’te tek tip patates aynı hastalıkla çöktü, büyük kıtlık yaşandı.',
      ),
      kart(
        'Gen bankaları',
        'Yerel çeşitlerin tohumları ileride ıslahta kullanılmak üzere saklanır.\nTürkiye’nin tohum gen bankası Ankara’dadır.',
      ),
    ], [], [
      {
        soru: 'Brokoli ile lahananın ortak atası hangisidir?',
        siklar: ['Yabani lahana', 'Teosinte'],
        dogru: 0,
        aciklama: {
          dogru: 'İkisi de aynı yabani lahana türünden, farklı organları seçilerek elde edildi.',
          yanlis: 'Teosinte mısırın atasıdır. Brokoli ve lahana yabani lahanadan geldi.',
        },
        kart: 3,
      },
    ]),
  ]),
])
