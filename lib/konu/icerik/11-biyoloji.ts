import { kart, konu, program, tema } from '../tip'

/**
 * 11. sınıf Biyoloji — Maarif Modeli.
 *
 * İki tema: Tepki (bitkilerde ve hayvanlarda uyarana cevap, sinir sistemi,
 * duyu organları, destek ve hareket, bağışıklık) ve Homeostazi (iç ortamın
 * dengesi ve onu kuran sistemler). Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski (2018) programda 11. sınıf "insan fizyolojisi" sistem sistem
 * işleniyordu; Maarif sistemleri iki soru etrafında topluyor: canlı uyarana
 * nasıl cevap verir, iç dengesini nasıl korur. Sindirim sistemi ve üreme bu
 * sınıfta ayrı konu değil. Dolaşım, solunum ve boşaltım yalnızca
 * homeostazideki payıyla anlatılıyor.
 *
 * Sorular (turuncu kitaplar) henüz yazılmadı; destelerin ortasındaki hızlı
 * kontroller var.
 */
export const biyoloji11 = program('biyoloji', 11, 'Uyarandan tepkiye, dengeye', [
  tema('byl11-t1', 'Tepki', [
    konu('byl11-uyaran-tepki', 'Canlıların Uyaranlara Tepkileri', [
      kart(
        'Uyaran ve tepki',
        '- **Uyaran:** canlıda değişikliğe yol açan iç ya da dış etki; ışık, ses, sıcaklık, kimyasal madde, dokunma\n- **Tepki:** canlının uyarana verdiği cevap\nUyarana tepki vermek bütün canlıların ortak özelliğidir.',
      ),
      kart(
        'İç ve dış uyaranlar',
        '- **Dış uyaranlar:** ışık, yer çekimi, sıcaklık, ses, dokunma\n- **İç uyaranlar:** kan şekerinin düşmesi, kandaki CO₂’nin artması, vücut sıcaklığının değişmesi',
      ),
      kart(
        'Tepkinin üç basamağı',
        'Canlı hangisi olursa olsun tepki aynı sırayla oluşur.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Algılama', alt: 'reseptör' },
            { ad: 'Bütünleştirme', alt: 'karar verilir', renk: 'ikincil' },
            { ad: 'Tepki', alt: 'kas ya da bez' },
          ],
        },
      ),
      kart(
        'Tek hücrelilerde',
        '- **Öglena:** göz lekesiyle ışığı algılar, ışığa doğru yüzer.\n- **Paramesyum:** zararlı kimyasaldan geri geri kaçar.\n- **Bakteriler:** besine doğru hareket eder.\nSinir sistemi yoktur; tepkiyi hücrenin kendisi verir.',
      ),
      kart(
        'Bitkilerde',
        'Bitkilerde sinir ve kas yoktur.\n- **Hormonlar:** büyümeyi bir yöne çevirerek yavaş tepki verir.\n- **Turgor değişimi:** hücrelerdeki su basıncıyla hızlı tepki verir.\nKüstüm otunun yaprağı bir saniyede kapanır.',
      ),
      kart(
        'Mantarlarda',
        'Mantar hifleri besin kaynağına doğru büyür.\nBazı mantarların spor keseleri ışığa yönelir ve sporları ışıklı tarafa fırlatır.',
      ),
      kart(
        'Hayvanlarda',
        'Hayvanlarda duyu organları, sinir sistemi ve kaslar birlikte çalışır.\nTepki genellikle **hızlı** ve hedefe yöneliktir: tavşan tilkiyi görür görmez kaçar.',
      ),
      kart(
        'Hareketin türleri',
        'Uyaran yönüne bağlılık hareketleri ayırır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Kimde?', 'Özellik'],
          satirlar: [
            ['Taksi', 'Serbest hareketli canlı', 'Yer değiştirir, yöne bağlı'],
            ['Tropizma', 'Bitki organı', 'Büyüme, yöne bağlı'],
            ['Nasti', 'Bitki organı', 'Yönden bağımsız'],
          ],
        },
      ),
      kart(
        'Tepki neden önemli?',
        '- Yırtıcıdan kaçmak\n- Besin ve su bulmak\n- Eş bulmak ve üremek\n- Uygun sıcaklık ve ışık ortamını seçmek\nUyarana cevap veremeyen canlı değişen ortamda yaşayamaz.',
      ),
      kart(
        'İlginç algılar',
        '- **Yarasa:** ses dalgalarının yankısıyla yön bulur.\n- **Göçmen kuşlar:** Dünya’nın manyetik alanını algılar.\n- **Arı:** morötesi ışığı görür.\n- **Yılan:** avının vücut ısısını kızılötesi olarak algılar.',
      ),
      kart(
        'Ortak örüntü',
        '- **Ortak olan:** her canlı algılar, bilgiyi işler ve cevap verir.\n- **Farklı olan:** kullanılan yapı ve tepkinin hızı\nBitki saatlerce, hayvan milisaniyeler içinde tepki verir.',
        undefined,
        { not: 'Canlıları karşılaştırırken "tepki var mı" diye değil "hangi yapıyla ve ne hızla" diye sor.' },
      ),
    ], [], [
      {
        soru: 'Kandaki CO₂’nin artması nasıl bir uyarandır?',
        siklar: ['İç uyaran', 'Dış uyaran'],
        dogru: 0,
        aciklama: {
          dogru: 'Değişim vücudun içinde: CO₂ artışı iç uyarandır ve solunumu hızlandırır.',
          yanlis: 'Dış uyaranlar ortamdan gelir (ışık, ses). Kandaki CO₂ değişimi iç uyarandır.',
        },
        kart: 2,
      },
      {
        soru: 'Uyaran yönünden bağımsız bitki hareketi hangisidir?',
        siklar: ['Tropizma', 'Nasti'],
        dogru: 1,
        aciklama: {
          dogru: 'Nasti yönden bağımsızdır; küstüm otu nereden dokunulsa kapanır.',
          yanlis: 'Tropizma uyaranın yönüne göre büyümedir. Yönden bağımsız hareket nasti.',
        },
        kart: 8,
      },
    ]),
    konu('byl11-bitki-hormon', 'Bitkilerde Hormonlar', [
      kart(
        'Bitki hormonu',
        'Bitkide çok az miktarda üretilip başka bölgelere taşınan ve büyüme-gelişmeyi düzenleyen organik maddelerdir.\nHayvanlardaki gibi özel hormon bezleri yoktur; birçok hücre hormon üretebilir.',
      ),
      kart(
        'Oksin',
        'Sürgün ucunda ve genç yapraklarda üretilir.\n- Hücrelerin **boyuna uzamasını** sağlar.\n- Işığa yönelmede gölge tarafta birikir.\n- Tepe tomurcuğunun yan tomurcukları baskılamasını (tepe baskınlığı) sağlar.\n- Kök oluşumunu uyarır.',
      ),
      kart(
        'Oksinde doz önemli',
        'Gövdede uzamayı artıran oksin derişimi, kökte büyümeyi **engeller**.\nKök oksine gövdeden çok daha duyarlıdır.\nAynı hormon, derişimine ve organa göre zıt etki yapabilir.',
        undefined,
        { not: 'Oksin "büyütür" diye ezberleme: gövdede hızlandıran derişim kökte yavaşlatır.' },
      ),
      kart(
        'Gibberellin',
        '- Gövdenin boyca uzamasını sağlar; bodur bitkileri uzatır.\n- Tohumun çimlenmesini başlatır, uyku hâlini bozar.\n- Meyvelerin büyümesini sağlar; çekirdeksiz üzüm iri yetiştirilir.',
      ),
      kart(
        'Sitokinin',
        'Kökte üretilir ve yukarı taşınır.\n- Hücre bölünmesini **uyarır**.\n- Yaprakların yaşlanmasını geciktirir; kesme çiçek uzun süre taze kalır.\n- Yan tomurcukların gelişmesini sağlar; bu konuda oksine zıttır.',
      ),
      kart(
        'Absisik asit (ABA)',
        '**Stres hormonudur.**\n- Kuraklıkta stomaları kapatıp su kaybını önler.\n- Tohum ve tomurcukları uykuda tutar; kötü mevsimde çimlenmeyi engeller.',
      ),
      kart(
        'Etilen',
        'Gaz hâlinde bir hormondur.\n- Meyve olgunlaşmasını **hızlandırır**.\n- Yaprak ve meyve dökülmesini sağlar.\nBir sepetteki çürük elma, çıkardığı etilenle ötekileri de olgunlaştırır.',
      ),
      kart(
        'Hormonların özeti',
        'Her hormonun başlıca işi:',
        {
          tur: 'tablo',
          basliklar: ['Hormon', 'Başlıca etkisi'],
          satirlar: [
            ['Oksin', 'Hücre uzaması, yönelme'],
            ['Gibberellin', 'Gövde uzaması, çimlenme'],
            ['Sitokinin', 'Hücre bölünmesi'],
            ['Absisik asit', 'Stoma kapatma, uyku hâli'],
            ['Etilen', 'Olgunlaşma, dökülme'],
          ],
        },
      ),
      kart(
        'Hormonlar birlikte çalışır',
        '- **Oksin/sitokinin oranı:** doku kültüründe oksin fazlaysa kök, sitokinin fazlaysa sürgün oluşur.\n- **Gibberellin/ABA dengesi:** gibberellin ağır basınca tohum çimlenir, ABA ağır basınca uyur.',
      ),
      kart(
        'Koleoptil deneyleri',
        '- **Darwin:** ucu kesilen ya da kapatılan filiz ışığa eğilmedi.\n- **Went:** filiz ucu jelatin bloğa kondu, blok ucu kesilmiş filizin bir yanına yerleştirildi.\nFiliz karanlıkta öteki yana eğildi: uçta üretilen bir **madde** (oksin) vardı.',
      ),
      kart(
        'Tarımda kullanım',
        '- **Köklendirme tozu:** oksinle çeliklerin kök salması hızlanır.\n- **Yabani ot ilacı:** yapay oksin geniş yapraklı otları aşırı büyütüp öldürür.\n- **Olgunlaştırma:** ham koparılan muz depoda etilenle olgunlaştırılır.\n- **İri üzüm:** gibberellin uygulanır.',
      ),
    ], [], [
      {
        soru: 'Meyvenin olgunlaşmasını hızlandıran gaz hormon hangisidir?',
        siklar: ['Etilen', 'Sitokinin'],
        dogru: 0,
        aciklama: {
          dogru: 'Etilen gaz hâlinde yayılır ve olgunlaşmayı hızlandırır.',
          yanlis: 'Sitokinin hücre bölünmesini uyarır ve yaşlanmayı geciktirir. Olgunlaştıran etilen.',
        },
        kart: 7,
      },
      {
        soru: 'Kuraklıkta stomaları kapatan hormon hangisidir?',
        siklar: ['Gibberellin', 'Absisik asit'],
        dogru: 1,
        aciklama: {
          dogru: 'Absisik asit stres hormonudur; stomaları kapatıp su kaybını önler.',
          yanlis: 'Gibberellin büyüme ve çimlenme hormonu. Stomaları kapatan absisik asit.',
        },
        kart: 6,
      },
    ]),
    konu('byl11-bitki-tepki', 'Bitkilerde Tepki Mekanizmaları', [
      kart(
        'İki tür hareket',
        '- **Tropizma (yönelim):** organ uyaranın yönüne göre büyür; yavaş, kalıcı\n- **Nasti (irkilme):** uyaranın yönünden bağımsız; çoğu hızlı ve geri dönüşümlü',
      ),
      kart(
        'Pozitif ve negatif',
        '- **Pozitif yönelim:** organ uyarana **doğru** büyür.\n- **Negatif yönelim:** organ uyarandan **uzağa** büyür.\nAynı bitkide gövde ve kök aynı uyarana zıt yönelebilir.',
      ),
      kart(
        'Işığa yönelme',
        'Işık yandan gelince oksin gövdenin **gölge** tarafına geçer.\nGölge taraftaki hücreler daha çok uzar ve gövde ışığa doğru eğilir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Işık yandan gelir' },
            { ad: 'Oksin gölge yana geçer', renk: 'ikincil' },
            { ad: 'Gölge taraf fazla uzar' },
            { ad: 'Gövde ışığa eğilir' },
          ],
        },
        { not: 'Oksin ışık tarafında değil gölge tarafında birikir; eğilme o tarafın fazla uzamasından olur.' },
      ),
      kart(
        'Yer çekimine yönelme',
        '- **Kök:** yer çekimi yönünde büyür, pozitif.\n- **Gövde:** yer çekimine karşı büyür, negatif.\nYatırılan fidede oksin alt tarafta birikir.\nGövdede alt taraf uzar ve gövde kalkar; kökte alt taraf yavaşlar ve kök aşağı kıvrılır.',
      ),
      kart(
        'Suya ve kimyasala yönelme',
        '- **Hidrotropizma:** kökler nemli toprağa doğru büyür.\n- **Kemotropizma:** polen tüpü, yumurtalığın salgıladığı maddelere doğru uzar.\nKök borulara bu yüzden sızar: içerideki suya yönelir.',
      ),
      kart(
        'Dokunmaya yönelme',
        '**Tigmotropizma:** sarılıcı bitkilerin filizleri desteğe değdiği yerde yön değiştirir.\nDeğen taraf yavaş, karşı taraf hızlı büyür ve filiz desteğe sarılır.\nFasulye ve asma bu yolla tırmanır.',
      ),
      kart(
        'Nasti nasıl olur?',
        'Çoğu nasti büyümeyle değil, hücrelerin **su basıncı (turgor)** değişimiyle olur.\nHücrelerden su çıkınca doku gevşer, su girince gerilir.\nBu yüzden hızlı ve geri dönüşümlüdür.',
      ),
      kart(
        'Dokunmaya irkilme',
        '**Sismonasti:** küstüm otunun (Mimosa) yaprakları dokununca kapanır.\nYaprak sapının dibindeki hücrelerden su hızla çıkar, yaprak aşağı düşer.\nBirkaç dakika sonra su geri girer, yaprak açılır.',
      ),
      kart(
        'Işık ve sıcaklığa irkilme',
        '- **Fotonasti:** bazı çiçekler gündüz açılır, akşam kapanır.\n- **Termonasti:** lale ve çiğdem sıcaklık artınca açılır.\n- **Niktinasti:** fasulye yaprakları gece aşağı kapanır.',
      ),
      kart(
        'Böcekçil bitkiler',
        'Sinek kapan bitkisinin yaprağındaki tetik tüylere kısa sürede **iki kez** dokunulunca yaprak kapanır.\nTek dokunuşta kapanmaması, yağmur damlası için boşuna kapanmayı önler.\nKapanan yaprak böceği sindirip azot kazanır.',
      ),
      kart(
        'Yönelim tablosu',
        'Aynı bitkide organa göre yön değişebilir.',
        {
          tur: 'tablo',
          basliklar: ['Uyaran', 'Gövde', 'Kök'],
          satirlar: [
            ['Işık', 'Pozitif', 'Negatif ya da yok'],
            ['Yer çekimi', 'Negatif', 'Pozitif'],
            ['Su', '—', 'Pozitif'],
          ],
        },
      ),
      kart(
        'Deney tasarlama',
        'Soru: "Fide ışığın geldiği yöne mi büyür?"\n- **Bağımsız değişken:** ışığın geldiği yön\n- **Bağımlı değişken:** fidenin eğilme açısı\n- **Kontrol grubu:** her yönden eşit ışık alan fide\n- **Sabit tutulanlar:** su, toprak, sıcaklık',
      ),
    ], [], [
      {
        soru: 'Işığa yönelmede oksin gövdenin hangi tarafında birikir?',
        siklar: ['Işık alan tarafta', 'Gölge tarafta'],
        dogru: 1,
        aciklama: {
          dogru: 'Oksin gölge tarafa geçer; o taraf fazla uzar ve gövde ışığa eğilir.',
          yanlis: 'Işık alan taraf daha az uzar. Oksin gölge tarafta birikir ve orayı uzatır.',
        },
        kart: 3,
      },
      {
        soru: 'Küstüm otunun yapraklarının kapanması neyle olur?',
        siklar: ['Turgor değişimiyle', 'Hücre büyümesiyle'],
        dogru: 0,
        aciklama: {
          dogru: 'Hücrelerden su çıkınca turgor düşer ve yaprak hızla kapanır.',
          yanlis: 'Büyüme saatler sürer. Bir saniyelik kapanma su basıncının (turgor) değişmesiyle olur.',
        },
        kart: 8,
      },
    ]),
    konu('byl11-uyarti-alma', 'Uyartıların Alınması', [
      kart(
        'Uyaran ve uyartı',
        '- **Uyaran:** ortamdaki değişim; ışık, ses, basınç\n- **Uyartı (impuls):** uyaranın reseptörde dönüştüğü elektriksel sinyal\nSinir sistemi uyaranın kendisini değil, uyartıyı taşır.',
      ),
      kart(
        'Reseptör',
        'Uyaranı algılayıp elektriksel sinyale çeviren özelleşmiş hücre ya da yapıdır.\nBir tür **çevirmen** gibi çalışır: ışık, ses ya da kimyasal enerjiyi sinir sisteminin diline çevirir.',
      ),
      kart(
        'Reseptör çeşitleri',
        'Algıladıkları uyarana göre adlandırılır.',
        {
          tur: 'tablo',
          basliklar: ['Reseptör', 'Uyaran', 'Örnek yer'],
          satirlar: [
            ['Mekanoreseptör', 'Dokunma, basınç, ses', 'Deri, iç kulak'],
            ['Kemoreseptör', 'Kimyasal madde', 'Dil, burun, damarlar'],
            ['Fotoreseptör', 'Işık', 'Retina'],
            ['Termoreseptör', 'Sıcak, soğuk', 'Deri'],
            ['Ağrı reseptörü', 'Doku hasarı', 'Hemen her yer'],
          ],
        },
      ),
      kart(
        'Her reseptörün bir uyaranı var',
        'Reseptör, **uygun uyaranına** çok duyarlı, ötekilere az duyarlıdır.\nKapalı göze bastırınca ışık çakmaları görülür.\nBasınç fotoreseptörleri uyarır, beyin de sinyali "ışık" diye yorumlar.',
      ),
      kart(
        'Eşik değer',
        'Uyartı oluşması için gereken en düşük uyaran şiddetidir.\n- Eşiğin altındaki uyaran hissedilmez.\n- Eşiği aşan uyaran sinyal başlatır.\nKolundaki tek bir toz tanesini hissetmezsin; eşiğin altındadır.',
      ),
      kart(
        'Şiddet nasıl anlaşılır?',
        'Güçlü uyaranda sinyalin büyüklüğü değişmez.\n- Reseptör daha **sık** sinyal gönderir.\n- Daha **çok** reseptör uyarılır.\nBeyin şiddeti bu sıklıktan ve sayıdan çıkarır.',
        undefined,
        { not: 'Sert dokunuş daha büyük değil daha sık sinyal üretir; tek bir uyartının boyu hep aynıdır.' },
      ),
      kart(
        'Duyusal uyum',
        'Sürekli ve değişmeyen uyarana reseptörler giderek daha az cevap verir.\n- Kolundaki saati bir süre sonra hissetmezsin.\n- Odaya girince fark ettiğin koku kaybolur.\nAğrı reseptörleri çok yavaş uyum sağlar; bu, korunmamızı sağlar.',
      ),
      kart(
        'İç reseptörler',
        '- **Basınç reseptörleri:** aort ve şah damarında kan basıncını ölçer.\n- **Kemoreseptörler:** kandaki CO₂ ve pH’ı ölçer.\n- **Kas iği:** kasın gerilmesini ölçer, vücudun konumunu bildirir.',
      ),
      kart(
        'Uyaran çeşitleri',
        '- **Mekanik:** dokunma, ses titreşimi, yer çekimi\n- **Kimyasal:** tat, koku, kan şekeri\n- **Işık:** görünür ışık, bazı canlılarda morötesi\n- **Isı:** sıcaklık değişimi\n- **Elektrik ve manyetik:** bazı balıklar ve kuşlar',
      ),
      kart(
        'Reseptör sıklığı',
        'Parmak ucunda ve dudakta dokunma reseptörleri çok sıktır, sırtta seyrektir.\nParmak ucu birbirine 2 mm yakın iki iğneyi ayırt eder, sırt ancak birkaç santimetreyi.',
      ),
      kart(
        'Hayvanlar farklı algılar',
        'Her türün reseptörleri kendi yaşamına göredir.\n- Arı çiçeklerdeki morötesi desenleri görür.\n- Köpeğin koku reseptörü insanınkinin on binlerce katıdır.\n- Kedi loş ışıkta insandan çok daha iyi görür.',
      ),
    ], [], [
      {
        soru: 'Dildeki tat reseptörleri hangi gruptandır?',
        siklar: ['Mekanoreseptör', 'Kemoreseptör'],
        dogru: 1,
        aciklama: {
          dogru: 'Tat, çözünmüş kimyasal maddelerle algılanır: kemoreseptör.',
          yanlis: 'Mekanoreseptör dokunma ve basınç içindir. Tat kimyasal bir uyaran, reseptörü kemoreseptör.',
        },
        kart: 3,
      },
      {
        soru: 'Güçlü bir uyaranda reseptör ne yapar?',
        siklar: ['Daha sık sinyal gönderir', 'Daha büyük sinyal gönderir'],
        dogru: 0,
        aciklama: {
          dogru: 'Sinyalin büyüklüğü sabit; şiddet sinyal sıklığı ve reseptör sayısıyla kodlanır.',
          yanlis: 'Tek bir uyartının büyüklüğü değişmez. Şiddet sinyal sıklığıyla anlatılır.',
        },
        kart: 6,
      },
    ]),
    konu('byl11-noron', 'Nöronların Yapısı', [
      kart(
        'Nöron',
        'Sinir sisteminin temel birimidir; uyartıyı alır, işler ve iletir.\n- Olgun nöronların çoğu bölünmez.\n- Çok oksijen ve glikoz tüketir; birkaç dakikalık oksijensizlik kalıcı hasar bırakır.',
      ),
      kart(
        'Nöronun bölümleri',
        '- **Dendrit:** uyartıyı alan kısa, dallı uzantılar\n- **Hücre gövdesi:** çekirdek ve organellerin bulunduğu yer\n- **Akson:** uyartıyı gövdeden uzağa ileten uzun uzantı\n- **Akson uçları:** sinyali sonraki hücreye aktaran uçlar',
      ),
      kart(
        'Uyartının yönü',
        'Uyartı nöronda hep aynı yönde ilerler.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Dendrit', alt: 'alır' },
            { ad: 'Hücre gövdesi', alt: 'işler' },
            { ad: 'Akson', alt: 'iletir', renk: 'ikincil' },
            { ad: 'Akson ucu', alt: 'aktarır' },
          ],
        },
      ),
      kart(
        'Miyelin kılıf',
        'Birçok aksonun çevresi yağlı bir kılıfla sarılıdır.\n- İletimi **hızlandırır** ve yalıtır.\n- Kılıfın aralıklarına **Ranvier boğumu** denir.\n- Çevresel sinirlerde Schwann hücreleri, beyin ve omurilikte başka glia hücreleri yapar.',
      ),
      kart(
        'Beyaz ve gri madde',
        '- **Beyaz madde:** miyelinli aksonların toplandığı yer\n- **Gri madde:** hücre gövdelerinin ve miyelinsiz uzantıların toplandığı yer\nBeyinde gri madde dışta, omurilikte içte bulunur.',
      ),
      kart(
        'Görevine göre nöronlar',
        'Üç nöron türü bir zincir oluşturur.',
        {
          tur: 'tablo',
          basliklar: ['Nöron', 'Nerede?', 'Görevi'],
          satirlar: [
            ['Duyu nöronu', 'Reseptörden merkeze', 'Bilgiyi getirir'],
            ['Ara nöron', 'Beyin ve omurilik', 'Bağlar, değerlendirir'],
            ['Motor nöron', 'Merkezden kasa, beze', 'Emri götürür'],
          ],
        },
      ),
      kart(
        'Yapısına göre nöronlar',
        '- **Tek kutuplu:** gövdeden tek uzantı çıkar; duyu nöronları\n- **Çift kutuplu:** biri dendrit biri akson iki uzantı; retina, koku epiteli\n- **Çok kutuplu:** çok dendrit, tek akson; motor ve ara nöronlar',
      ),
      kart(
        'Glia hücreleri',
        'Sinir dokusunun nöron olmayan hücreleridir; sayıca nöronlardan fazladır.\n- Nöronları besler ve destekler.\n- Miyelin kılıfı yapar.\n- Mikroplara ve artıklara karşı savunma yapar.',
      ),
      kart(
        'Sinir nedir?',
        'Çok sayıda aksonun bağ dokusuyla sarılıp demet oluşturmasıdır.\n- **Duyu siniri:** yalnızca duyu nöronu aksonları\n- **Motor sinir:** yalnızca motor nöron aksonları\n- **Karışık sinir:** ikisi birden; omurilik sinirleri böyledir',
      ),
      kart(
        'Nöronun ömrü ve onarımı',
        'Nöronlar ömür boyu yaşar ama çoğu yenilenmez.\n- Çevresel sinirlerde kesilen akson yavaşça onarılabilir.\n- Beyin ve omurilikte onarım çok sınırlıdır.\nOmurilik yaralanmaları bu yüzden çoğu zaman kalıcıdır.',
        undefined,
        { not: 'Kask ve emniyet kemeri bu yüzden hayatidir: merkezî sinir sisteminde kaybedilen nöron geri gelmez.' },
      ),
      kart(
        'Uzunluk rekoru',
        'Omurilikten ayak başparmağına giden bir motor nöronun aksonu **1 metreyi** aşabilir.\nTek bir hücre, vücudun yarısı boyunca uzanır.',
      ),
    ], [], [
      {
        soru: 'Uyartıyı hücre gövdesinden uzağa ileten kısım hangisidir?',
        siklar: ['Akson', 'Dendrit'],
        dogru: 0,
        aciklama: {
          dogru: 'Akson uyartıyı gövdeden akson uçlarına taşır.',
          yanlis: 'Dendrit uyartıyı alır ve gövdeye getirir. Gövdeden uzağa ileten akson.',
        },
        kart: 2,
      },
      {
        soru: 'Beyin ile omurilikte bulunan, iki nöronu bağlayan nöron hangisidir?',
        siklar: ['Motor nöron', 'Ara nöron'],
        dogru: 1,
        aciklama: {
          dogru: 'Ara nöronlar merkezî sinir sistemindedir ve duyu ile motor nöronu bağlar.',
          yanlis: 'Motor nöron emri kasa götürür. İki nöronu merkezde bağlayan ara nöron.',
        },
        kart: 6,
      },
    ]),
    konu('byl11-sinaps', 'Nöronlarda Sinyal İletimi ve Sinaps', [
      kart(
        'Dinlenme potansiyeli',
        'Uyarılmamış nöronda zarın içi dışına göre **negatiftir**: yaklaşık −70 mV.\nZarın bu hâline **polarizasyon** denir.\nDışarıda Na⁺, içeride K⁺ fazladır.',
      ),
      kart(
        'Sodyum-potasyum pompası',
        'Zardaki pompa ATP harcayarak her seferinde:\n- 3 Na⁺’u hücre dışına\n- 2 K⁺’u hücre içine taşır.\nBu fark dinlenme potansiyelini korur; nöron enerjisinin büyük kısmı buraya gider.',
      ),
      kart(
        'Depolarizasyon',
        'Uyaran zarı **eşik değere** (yaklaşık −55 mV) ulaştırınca Na⁺ kanalları açılır.\nNa⁺ hücreye akar ve zarın içi kısa süre **pozitif** olur (≈ +30 mV).',
      ),
      kart(
        'Repolarizasyon',
        'Na⁺ kanalları kapanır, K⁺ kanalları açılır.\nK⁺ dışarı çıkar ve zarın içi yeniden negatif olur.\nKısa bir süre −70’in de altına iner, sonra pompa dengeyi yeniden kurar.',
      ),
      kart(
        'Aksiyon potansiyeli',
        'Zar potansiyelinin milisaniyeler içindeki değişimi:',
        {
          tur: 'koordinat',
          pencere: [0, 5, -90, 45],
          eksenler: true,
          xAd: 'zaman (ms)',
          yAd: 'mV',
          egriler: [
            {
              noktalar: [
                [0, -70],
                [1, -70],
                [1.3, -55],
                [1.7, 30],
                [2.2, -30],
                [2.6, -80],
                [3.3, -72],
                [5, -70],
              ],
            },
            {
              noktalar: [
                [0, -55],
                [5, -55],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
              ad: 'eşik',
            },
          ],
          etiketler: [
            { x: 1.2, y: 15, ad: 'Na⁺ girer' },
            { x: 3.1, y: -20, ad: 'K⁺ çıkar' },
          ],
        },
      ),
      kart(
        'Ya hep ya hiç',
        'Eşik aşılırsa aksiyon potansiyeli **tam büyüklükte** oluşur; aşılmazsa hiç oluşmaz.\nUyaranın eşiği ne kadar aştığı sinyalin büyüklüğünü değiştirmez.',
      ),
      kart(
        'Dirençli dönem',
        'Aksiyon potansiyelinden hemen sonra zar kısa süre yeniden uyarılamaz.\nBu yüzden uyartı geri dönemez, akson boyunca **tek yönde** ilerler.',
      ),
      kart(
        'İletim hızı',
        '- **Miyelinli akson:** uyartı boğumdan boğuma sıçrar, 100 m/s’yi aşabilir.\n- **Miyelinsiz akson:** uyartı adım adım ilerler, ≈ 1 m/s\n- **Kalın akson:** inceden daha hızlı iletir.',
      ),
      kart(
        'Sinaps',
        'Bir nöronun akson ucu ile sonraki hücre arasındaki bağlantı noktasıdır.\nİki hücre birbirine değmez; arada **sinaptik aralık** denen çok dar bir boşluk vardır.',
      ),
      kart(
        'Sinapsta iletim',
        'Elektrik sinyali aralıkta kimyasal sinyale dönüşür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Uyartı akson ucuna gelir' },
            { ad: 'Ca²⁺ akson ucuna girer' },
            { ad: 'Nörotransmitter çıkar', renk: 'ikincil' },
            { ad: 'Reseptöre bağlanır', alt: 'karşı hücrede' },
            { ad: 'Uyarı ya da ketleme' },
          ],
        },
      ),
      kart(
        'Nörotransmitterler',
        '- **Asetilkolin:** kasların kasılması\n- **Dopamin:** hareket, ödül ve motivasyon\n- **Serotonin:** duygu durumu, uyku\n- **GABA:** ketleyici, sinyali baskılar\nİş biten nörotransmitter parçalanır ya da geri alınır.',
      ),
      kart(
        'Sinaps tek yönlüdür',
        'Nörotransmitter kesecikleri yalnızca akson ucunda, reseptörler yalnızca karşı hücrededir.\nBu yüzden sinapsta ileti **yalnızca** akson ucundan sonraki hücreye geçer.',
        undefined,
        { not: 'İletimin tek yönlü olmasının iki sebebi var: aksonda dirençli dönem, sinapsta yalnızca bir yanda kesecik olması.' },
      ),
      kart(
        'Maddelerin sinapsa etkisi',
        '- Kafein uyanıklığı artırır.\n- Nikotin asetilkolin reseptörlerine bağlanır.\n- Bağımlılık yapan maddeler dopamin sistemini bozar.\n- Bazı böcek ilaçları asetilkolinin parçalanmasını engeller.',
      ),
    ], [], [
      {
        soru: 'Depolarizasyonda hangi iyon hücreye girer?',
        siklar: ['K⁺', 'Na⁺'],
        dogru: 1,
        aciklama: {
          dogru: 'Na⁺ kanalları açılır, Na⁺ içeri akar ve zarın içi pozitif olur.',
          yanlis: 'K⁺ repolarizasyonda dışarı çıkar. Depolarizasyonda içeri giren Na⁺.',
        },
        kart: 3,
      },
      {
        soru: 'Sinapsta ileti neden tek yönlüdür?',
        siklar: ['Kesecikler yalnızca akson ucunda', 'Aralık çok geniş'],
        dogru: 0,
        aciklama: {
          dogru: 'Nörotransmitter yalnızca akson ucundan salgılanır, reseptörler karşı hücrededir.',
          yanlis: 'Aralık çok dardır. Tek yönlülüğün sebebi keseciklerin yalnızca akson ucunda olması.',
        },
        kart: 12,
      },
    ]),
    konu('byl11-duyu-organ', 'Duyu Organları', [
      kart(
        'Duyu organı',
        'Reseptörlerin, onları koruyan ve uyaranı toplayan yapılarla birlikte oluşturduğu organdır.\nGöz, kulak, burun, dil ve deri beş temel duyu organıdır.',
      ),
      kart(
        'Gözün katmanları',
        'Göz küresi dıştan içe üç katmandır.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Sert tabaka', alt: 'önde saydam kornea' },
            { ad: 'Damar tabaka', alt: 'önde renkli iris' },
            { ad: 'Ağ tabaka (retina)', alt: 'ışık reseptörleri', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Işığın yolu',
        'Görüntü retinada ters ve küçük oluşur; beyin onu düz yorumlar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Kornea', alt: 'ışığı kırar' },
            { ad: 'Göz bebeği', alt: 'ışık miktarını ayarlar' },
            { ad: 'Göz merceği', alt: 'odaklar' },
            { ad: 'Camsı cisim' },
            { ad: 'Retina', alt: 'uyartıya çevirir', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Çomaklar ve koniler',
        '- **Çomak:** loş ışıkta görür, renk ayırmaz; retinanın kenarlarında çok\n- **Koni:** renkleri ve ayrıntıyı görür; sarı benekte yoğun\n- **Kör nokta:** görme sinirinin çıktığı yer, reseptör yok',
        undefined,
        { not: 'Gece renkleri seçememenin sebebi çomakların renk ayırmaması; konilere yetecek ışık yok.' },
      ),
      kart(
        'Gözün ayarları',
        '- **Işık ayarı:** iris kasları göz bebeğini parlakta küçültür, loşta büyütür.\n- **Uzaklık ayarı:** mercek yakına bakarken kalınlaşır, uzağa bakarken incelir.',
      ),
      kart(
        'Kulağın bölümleri',
        '- **Dış kulak:** kulak kepçesi, kulak yolu, kulak zarı\n- **Orta kulak:** çekiç, örs, üzengi kemikçikleri ve östaki borusu\n- **İç kulak:** salyangoz (işitme), yarım daire kanalları ve dehliz (denge)',
      ),
      kart(
        'İşitmenin yolu',
        'Ses dalgası iç kulakta sıvı titreşimine dönüşür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Kulak zarı titrer' },
            { ad: 'Kemikçikler güçlendirir' },
            { ad: 'Oval pencere' },
            { ad: 'Salyangoz sıvısı', alt: 'dalgalanır' },
            { ad: 'Tüylü hücreler uyarılır', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Denge',
        '- **Yarım daire kanalları:** başın dönme hareketlerini algılar.\n- **Dehliz:** başın duruşunu ve düz çizgide hızlanmayı algılar.\nAraba tutması, gözden ve iç kulaktan gelen bilgilerin çelişmesiyle olur.',
      ),
      kart(
        'Burun',
        'Burun boşluğunun üstündeki koku epitelinde kemoreseptörler vardır.\n- Kokunun algılanması için madde havada ve mukusta çözünmelidir.\n- Koku reseptörleri çabuk uyum sağlar.\nYemeğin "tadı" sandığımız şeyin büyük kısmı kokudur.',
      ),
      kart(
        'Dil',
        'Tat tomurcukları dil üstündeki kabarcıklarda (papilla) bulunur.\n- Beş temel tat: tatlı, tuzlu, ekşi, acı, umami\n- Her bölge beş tadı da algılar; "dil haritası" bir yanlış bilgidir.',
      ),
      kart(
        'Deri',
        'Deride dokunma, basınç, sıcak, soğuk ve ağrı reseptörleri bulunur.\nParmak ucu, dudak ve dil reseptörce en zengin bölgelerdir.\nDeri aynı zamanda vücudun en büyük duyu organıdır.',
      ),
      kart(
        'Duyu organlarını korumak',
        '- **Kulak:** 85 dB üstü sesten uzak dur, kulaklığı kısık kullan, kulağa çubuk sokma.\n- **Göz:** morötesi korumalı güneş gözlüğü, ekrana uygun uzaklık ve mola\n- **Deri:** güneş kremi, yanıklardan korunma',
      ),
    ], [], [
      {
        soru: 'Loş ışıkta görmeyi sağlayan reseptörler hangileridir?',
        siklar: ['Koniler', 'Çomaklar'],
        dogru: 1,
        aciklama: {
          dogru: 'Çomaklar az ışığa çok duyarlıdır ama renk ayırmaz.',
          yanlis: 'Koniler renk ve ayrıntı için bol ışık ister. Loşta gören çomaklar.',
        },
        kart: 4,
      },
      {
        soru: 'Dengeyi algılayan yapılar kulağın neresindedir?',
        siklar: ['İç kulak', 'Orta kulak'],
        dogru: 0,
        aciklama: {
          dogru: 'Yarım daire kanalları ve dehliz iç kulaktadır.',
          yanlis: 'Orta kulakta kemikçikler ve östaki borusu vardır. Denge yapıları iç kulakta.',
        },
        kart: 8,
      },
    ]),
    konu('byl11-yorumlama', 'Uyarıların Yorumlanması', [
      kart(
        'Duyu ve algı',
        '- **Duyu:** reseptörün uyartı üretmesi\n- **Algı:** beynin bu uyartıya anlam vermesi\nGözümüz görmez, beynimiz görür; göz yalnızca sinyali üretir.',
      ),
      kart(
        'Beyinde duyu alanları',
        'Her duyu, beyin kabuğunun belli bir bölgesinde yorumlanır.',
        {
          tur: 'tablo',
          basliklar: ['Duyu', 'Beyin bölgesi'],
          satirlar: [
            ['Görme', 'Art kafa lobu'],
            ['İşitme', 'Şakak lobu'],
            ['Dokunma, sıcaklık, ağrı', 'Yan kafa lobu'],
            ['Tat', 'Yan kafa lobu tabanı'],
            ['Koku', 'Şakak lobunun iç yüzü'],
          ],
        },
      ),
      kart(
        'Sinyal adresini taşır',
        'Bütün uyartılar aynı tür elektrik sinyalidir.\nBeyin neyin algılandığını sinyalin **geldiği yola** göre anlar.\nGöze gelen darbe ışık çakması, kulağa gelen darbe çınlama olarak algılanır.',
        undefined,
        { not: 'Işığı ışık yapan uyaran değil, sinyalin görme merkezine ulaşması; bu yüzden darbe de "ışık" olur.' },
      ),
      kart(
        'Talamus bir santraldir',
        'Koku dışındaki bütün duyular önce **talamusa** gelir.\nTalamus onları süzer ve ilgili kabuk bölgesine yönlendirir.\nKoku doğrudan duygu ve bellek merkezlerine gider; kokunun anıları canlandırması bundandır.',
      ),
      kart(
        'Çapraz yerleşim',
        'Vücudun sağ yanından gelen duyular beynin **sol** yarımküresinde, sol yanından gelenler sağında yorumlanır.\nHareket emirleri de çaprazdır: sol beyindeki hasar sağ tarafı etkiler.',
      ),
      kart(
        'Beyin boşlukları doldurur',
        '- Kör noktadaki boşluğu fark etmeyiz; beyin çevreden tamamlar.\n- Eşit iki çizgi, uçlarındaki okların yönüne göre farklı uzunlukta görünür.\nGörsel yanılsamalar algının yorum olduğunun kanıtıdır.',
      ),
      kart(
        'Dikkat ve deneyim',
        '- **Seçici dikkat:** kalabalık bir ortamda yalnızca konuştuğun kişiyi duyarsın.\n- **Deneyim:** usta bir müzisyen, dinleyenin kaçırdığı notayı duyar.\nAynı uyaran, iki kişide farklı algılanabilir.',
      ),
      kart(
        'Duyular birleşir',
        'Lezzet; tat, koku, doku ve sıcaklığın birleşik yorumudur.\nBurnu tıkalı biri elma ile soğanı tadından ayırt etmekte zorlanır.',
      ),
      kart(
        'Yansıyan ağrı',
        'İç organlardan ve deriden gelen sinirler omurilikte aynı bölgeye girebilir.\nBeyin ağrının kaynağını karıştırır: kalp krizinde ağrı **sol kolda** hissedilebilir.',
      ),
      kart(
        'Hayalet uzuv',
        'Kesilmiş kolu olan kişi o kolda ağrı ya da kaşıntı hissedebilir.\nReseptör yoktur ama beyindeki "kol haritası" çalışmaya devam eder.\nAlgının beyinde oluştuğunun çarpıcı bir örneğidir.',
      ),
      kart(
        'Algının hızı',
        'Bir uyaranın bilinçli algılanması yaklaşık **0,1–0,3 saniye** sürer.\nSıcak bir cisme dokununca el çekme refleksi bundan önce gerçekleşir.\nAğrıyı elini çektikten sonra hissedersin.',
      ),
    ], [], [
      {
        soru: 'Görme hangi beyin lobunda yorumlanır?',
        siklar: ['Art kafa lobu', 'Alın lobu'],
        dogru: 0,
        aciklama: {
          dogru: 'Görme merkezi beynin arka kısmında, art kafa lobundadır.',
          yanlis: 'Alın lobu karar ve hareket planlamasıyla ilgili. Görme art kafa lobunda.',
        },
        kart: 2,
      },
      {
        soru: 'Sol elinden gelen dokunma duyusu nerede yorumlanır?',
        siklar: ['Sol yarımküre', 'Sağ yarımküre'],
        dogru: 1,
        aciklama: {
          dogru: 'Duyu yolları çaprazlanır: vücudun solu beynin sağında yorumlanır.',
          yanlis: 'Yollar çaprazlanır; sol elden gelen bilgi sağ yarımküreye ulaşır.',
        },
        kart: 5,
      },
    ]),
    konu('byl11-hayvan-sinir', 'Hayvanlarda Sinir Sistemleri', [
      kart(
        'Genel eğilim',
        'Basitten karmaşığa doğru:\n- Dağınık ağ → sinir düğümü zinciri → merkezî sinir sistemi\n- Sinir hücreleri giderek **baş bölgesinde** toplanır.\nBaşın beyin ve duyu organlarıyla gelişmesine **sefalizasyon** denir.',
      ),
      kart(
        'Süngerler',
        'Gerçek sinir hücresi yoktur.\nHer hücre çevresindeki değişime tek başına ve yavaş tepki verir.\nSüngerin bütün vücudu koordineli bir hareket yapmaz.',
      ),
      kart(
        'Sinir ağı',
        '**Hidra, denizanası:** sinir hücreleri vücuda ağ gibi dağılmıştır.\n- Merkez yoktur.\n- Bir noktadaki uyarı her yöne yayılır.\nDokunulan hidra bütün vücuduyla büzülür.',
      ),
      kart(
        'Merdiven tipi',
        '**Planarya (yassı solucan):** başta iki sinir düğümü (gangliyon) ve iki boyuna sinir kordonu vardır.\nKordonlar enine bağlarla merdiven gibi birleşir.\nBaşta göz lekeleri bulunur; ilk basit "baş" budur.',
      ),
      kart(
        'Sinir düğümü zinciri',
        '**Toprak solucanı, böcekler:** karın tarafında bir sinir kordonu ve her halkada bir sinir düğümü vardır.\nBaşta daha büyük bir beyin düğümü bulunur.\nBöceklerin beyni öğrenme ve karmaşık davranış için yeterlidir.',
      ),
      kart(
        'Yumuşakçalar',
        'Salyangozda sinir düğümleri dağınıktır.\n**Ahtapot** ise omurgasızların en gelişmiş beynine sahiptir.\nLabirent çözer, kavanoz kapağı açar, gözlemle öğrenir.',
      ),
      kart(
        'Omurgalılar',
        'Sinir sistemi **sırt tarafında**, içi boş bir tüp hâlindedir.\n- Beyin kafatasıyla, omurilik omurgayla korunur.\n- Merkezî ve çevresel sinir sistemi olarak ikiye ayrılır.',
      ),
      kart(
        'Omurgalılarda beyin',
        'Balıktan memeliye doğru ön beyin (beyin yarımküreleri) belirgin şekilde büyür.\n- Kuşlarda uçuş dengesi için beyincik gelişmiştir.\n- Memelilerde beyin kabuğu kıvrımlı ve geniştir.',
      ),
      kart(
        'Karşılaştırma',
        'Sinir sisteminin tipi, hayvanın yaşayışına uyar.',
        {
          tur: 'tablo',
          basliklar: ['Hayvan', 'Sinir sistemi'],
          satirlar: [
            ['Sünger', 'Yok'],
            ['Hidra', 'Sinir ağı'],
            ['Planarya', 'Merdiven tipi'],
            ['Böcek, solucan', 'Karında düğüm zinciri'],
            ['Omurgalılar', 'Sırtta sinir tüpü'],
          ],
        },
      ),
      kart(
        'Benzetmeyle düşünmek',
        '- **Sinir ağı:** merkezsiz bir köy yolları ağı; haber her yöne yavaşça yayılır.\n- **Merkezî sistem:** şehrin kontrol merkezi; bilgi toplanır, karar verilir, emir gönderilir.\nBenzetme yardımcıdır ama her ayrıntıyı karşılamaz.',
      ),
      kart(
        'Yapı ve yaşayış',
        'Denizanası gibi her yönden gelen uyarana açık canlılarda ağ yeterlidir.\nAktif hareket eden avcılarda ise duyu organları öne, beyin başa toplanır.\nHareket yönü, sinir sisteminin nerede yoğunlaştığını belirler.',
        undefined,
        { not: 'Karşılaştırma sorularında "hangisi daha gelişmiş" yerine "yaşayışına nasıl uyuyor" diye düşün.' },
      ),
    ], [], [
      {
        soru: 'Hidranın sinir sistemi nasıldır?',
        siklar: ['Sinir ağı', 'Merdiven tipi'],
        dogru: 0,
        aciklama: {
          dogru: 'Hidrada merkezi olmayan dağınık bir sinir ağı vardır.',
          yanlis: 'Merdiven tipi planaryada. Hidrada sinir hücreleri ağ gibi dağılmıştır.',
        },
        kart: 3,
      },
      {
        soru: 'Omurgalıların sinir kordonu nerededir?',
        siklar: ['Karın tarafında', 'Sırt tarafında'],
        dogru: 1,
        aciklama: {
          dogru: 'Omurgalılarda sinir tüpü sırt tarafındadır ve omurgayla korunur.',
          yanlis: 'Karın tarafındaki kordon böcek ve solucanlarda. Omurgalılarınki sırtta.',
        },
        kart: 7,
      },
    ]),
    konu('byl11-insan-sinir', 'İnsan Sinir Sisteminin Yapısı', [
      kart(
        'İki bölüm',
        '- **Merkezî sinir sistemi:** beyin ve omurilik\n- **Çevresel sinir sistemi:** beyin ve omurilikten çıkan sinirler ile sinir düğümleri',
      ),
      kart(
        'Koruyucu yapılar',
        '- **Kemik:** kafatası beyni, omurga omuriliği korur.\n- **Beyin zarları:** sert zar, örümceksi zar, ince zar\n- **Beyin-omurilik sıvısı:** darbeleri emer, besin ve atık taşır.',
      ),
      kart(
        'Büyük beyin',
        'İki yarımküreden oluşur; dıştaki kıvrımlı gri madde **beyin kabuğudur**.\n- **Alın lobu:** düşünme, karar, istemli hareket, konuşma\n- **Yan kafa lobu:** dokunma, sıcaklık, ağrı\n- **Şakak lobu:** işitme, dili anlama, bellek\n- **Art kafa lobu:** görme',
      ),
      kart(
        'Ara beyin',
        '- **Talamus:** duyuları süzüp kabuğa ileten santral\n- **Hipotalamus:** vücut sıcaklığı, açlık, susuzluk, uyku düzeni; hipofizi yönetir\nHipotalamus sinir sistemi ile hormon sistemi arasındaki köprüdür.',
      ),
      kart(
        'Beyincik',
        'Büyük beynin arka altında bulunur.\n- Dengeyi sağlar.\n- Kasların uyum içinde çalışmasını düzenler.\n- İnce ve öğrenilmiş hareketleri (bisiklet sürme) yürütür.\nAlkol beyinciği etkilediği için dengeyi bozar.',
      ),
      kart(
        'Beyin sapı',
        '- **Orta beyin:** göz ve kulakla ilgili refleksler\n- **Pons (köprü):** beyin bölümlerini bağlar, solunumu ayarlar\n- **Soğancık:** kalp atışı, solunum, kan basıncı, yutma, öksürme merkezleri\nSoğancık hasarı hayati tehlike yaratır.',
      ),
      kart(
        'Omurilik',
        'Omurga kanalının içinde uzanır.\n- **Dışta beyaz madde:** beyinle bilgi alışverişi yapan yollar\n- **İçte gri madde:** kelebek biçimli, refleks merkezleri\nOmurilik hem iletim yolu hem refleks merkezidir.',
      ),
      kart(
        'Çevresel sinirler',
        '- **12 çift kafa siniri:** göz, kulak, yüz, dil…\n- **31 çift omurilik siniri:** gövde, kollar, bacaklar\nDuyu yolu bilgiyi merkeze getirir, motor yol emri kaslara ve bezlere götürür.',
      ),
      kart(
        'Somatik ve otonom',
        '- **Somatik sinir sistemi:** iskelet kaslarını yönetir, çoğu isteğe bağlıdır.\n- **Otonom sinir sistemi:** kalp, damarlar, iç organlar ve bezler; istem dışı çalışır.',
      ),
      kart(
        'Sempatik ve parasempatik',
        'Otonom sistemin iki kolu aynı organa zıt etki yapar.',
        {
          tur: 'tablo',
          basliklar: ['Organ', 'Sempatik', 'Parasempatik'],
          satirlar: [
            ['Kalp atışı', 'Hızlanır', 'Yavaşlar'],
            ['Göz bebeği', 'Büyür', 'Küçülür'],
            ['Bronşlar', 'Genişler', 'Daralır'],
            ['Sindirim', 'Yavaşlar', 'Hızlanır'],
          ],
        },
        { not: 'Sempatik "savaş ya da kaç", parasempatik "dinlen ve sindir". Tablodaki her satır bu ikisinden çıkar.' },
      ),
      kart(
        'Sinir sisteminin haritası',
        'Bütün bölümler tek bir ağaçta:',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Sinir sistemi' },
            { ad: 'Merkezî', alt: 'beyin ve omurilik', renk: 'ikincil' },
            { ad: 'Çevresel', alt: 'somatik ve otonom' },
            { ad: 'Otonom', alt: 'sempatik, parasempatik', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Sinir sistemini korumak',
        '- Bisiklette ve motorda kask, araçta emniyet kemeri\n- Yeterli uyku: beyin gün içindeki bilgiyi uykuda düzenler.\n- Alkol, sigara ve uyuşturucudan uzak durmak\n- Dengeli beslenme; B vitaminleri ve omega-3',
      ),
    ], [], [
      {
        soru: 'Kalp atışı ve solunum merkezleri hangi yapıdadır?',
        siklar: ['Beyincik', 'Soğancık'],
        dogru: 1,
        aciklama: {
          dogru: 'Soğancık kalp atışı, solunum ve kan basıncını yönetir.',
          yanlis: 'Beyincik denge ve hareket uyumunu sağlar. Hayati merkezler soğancıkta.',
        },
        kart: 6,
      },
      {
        soru: 'Sempatik sistem göz bebeğini ne yapar?',
        siklar: ['Büyütür', 'Küçültür'],
        dogru: 0,
        aciklama: {
          dogru: 'Tehlike anında daha çok ışık almak için göz bebeği büyür.',
          yanlis: 'Küçülme parasempatik etkidir. Sempatik "savaş ya da kaç" göz bebeğini büyütür.',
        },
        kart: 10,
      },
    ]),
    konu('byl11-refleks', 'Refleksler', [
      kart(
        'Refleks',
        'Bir uyarana karşı **istem dışı, hızlı ve kendiliğinden** verilen tepkidir.\nTepki kararı çoğu zaman beyin kabuğu değil omurilik ya da beyin sapı verir.',
      ),
      kart(
        'Refleks yayı',
        'Uyartının refleks boyunca izlediği yol:',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Reseptör', alt: 'uyaranı algılar' },
            { ad: 'Duyu nöronu', alt: 'omuriliğe taşır' },
            { ad: 'Ara nöron', alt: 'omurilikte bağlar', renk: 'ikincil' },
            { ad: 'Motor nöron', alt: 'emri götürür' },
            { ad: 'Efektör', alt: 'kas kasılır' },
          ],
        },
      ),
      kart(
        'Neden bu kadar hızlı?',
        'Uyartı beyne gidip dönmez; yol kısadır.\nOmurilik tepkiyi başlatırken bilgi beyne de gider.\nBu yüzden eli çektikten **sonra** acıyı fark ederiz.',
      ),
      kart(
        'Omurilik refleksleri',
        '- **Sıcak sobadan eli çekme:** duyu, ara ve motor nöron\n- **Diz kapağı refleksi:** ara nöron yoktur, duyu nöronu doğrudan motor nöronla bağlanır\n- **Çiviye basınca ayağı çekme**',
      ),
      kart(
        'Beyin sapı refleksleri',
        '- Göze bir şey yaklaşınca göz kırpma\n- Öksürme, hapşırma, yutma\n- Işıkta göz bebeğinin küçülmesi\n- Kusma\nBunların merkezi omurilik değil, beyin sapıdır.',
      ),
      kart(
        'Doğuştan ve sonradan',
        '- **Doğuştan (koşulsuz) refleks:** öğrenilmez; göz kırpma, bebeğin emmesi ve kavraması\n- **Şartlı refleks:** tekrarla öğrenilir; zil sesiyle ağzın sulanması',
      ),
      kart(
        'Pavlov’un köpekleri',
        'Pavlov köpeğe her yemek verişinde zil çaldı.\nBir süre sonra köpeğin ağzı yalnızca zil sesiyle sulanmaya başladı.\nNötr bir uyaran (zil), doğuştan bir refleksi başlatır hâle geldi: **şartlı refleks**.',
      ),
      kart(
        'Refleks ve istemli hareket',
        'İkisini ayıran, kararın nerede verildiğidir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Refleks', 'İstemli hareket'],
          satirlar: [
            ['Karar yeri', 'Omurilik, beyin sapı', 'Beyin kabuğu'],
            ['Hız', 'Çok hızlı', 'Daha yavaş'],
            ['Bilinç', 'Gerekmez', 'Gerekir'],
            ['Aynı uyarana', 'Hep aynı tepki', 'Değişebilir'],
          ],
        },
      ),
      kart(
        'Refleksler neden var?',
        '- Dokuyu hasardan korur: yanık, kesik\n- Solunum yolunu temiz tutar: öksürük, hapşırık\n- Dengeyi ve duruşu korur: kaydığında kolların açılması',
      ),
      kart(
        'Beyin refleksi bastırabilir',
        'Sıcak ama değerli bir tabağı düşürmemek ya da iğne olurken kolu çekmemek mümkündür.\nBeyinden inen yollar omurilikteki refleksi baskılayabilir.',
        undefined,
        { not: 'Refleks istem dışıdır ama beyin kabuğu devreye girerse bazen durdurulabilir; nefesini tutmak gibi.' },
      ),
      kart(
        'Refleks muayenesi',
        'Doktor çekiçle diz kapağının altına vurur, bacağın sıçramasına bakar.\nRefleksin olmaması ya da aşırı olması sinir yolundaki bir sorunun işareti olabilir.\nYeni doğanlarda emme ve kavrama refleksleri de kontrol edilir.',
      ),
    ], [], [
      {
        soru: 'Diz kapağı refleksinde hangi nöron yoktur?',
        siklar: ['Ara nöron', 'Motor nöron'],
        dogru: 0,
        aciklama: {
          dogru: 'Diz refleksinde duyu nöronu doğrudan motor nöronla bağlanır; ara nöron yok.',
          yanlis: 'Motor nöron olmadan kas kasılamaz. Diz refleksinde eksik olan ara nöron.',
        },
        kart: 4,
      },
      {
        soru: 'Zil sesiyle ağzın sulanması nasıl bir reflekstir?',
        siklar: ['Doğuştan', 'Şartlı'],
        dogru: 1,
        aciklama: {
          dogru: 'Zil ile yemek eşleştirilerek öğrenildi: şartlı refleks.',
          yanlis: 'Doğuştan refleks öğrenilmez. Zile tepki tekrarla öğrenildiği için şartlı.',
        },
        kart: 7,
      },
    ]),
    konu('byl11-kemik', 'Kemik Dokusu', [
      kart(
        'İskeletin görevleri',
        '- **Destek:** vücuda şekil verir.\n- **Koruma:** kafatası beyni, kaburgalar kalbi ve akciğerleri korur.\n- **Hareket:** kaslar kemikleri çeker.\n- **Kan yapımı:** kırmızı kemik iliği\n- **Depo:** kalsiyum ve fosfor',
      ),
      kart(
        'Kemik dokusu',
        'Bir bağ dokusudur: hücreler ve sert bir ara madde.\n- **Kolajen lifleri:** esneklik ve dayanıklılık verir.\n- **Kalsiyum fosfat:** sertlik verir.\nSadece mineral olsaydı kemik tebeşir gibi kırılırdı.',
      ),
      kart(
        'Kemik hücreleri',
        '- **Osteoblast:** yeni kemik yapar.\n- **Osteosit:** olgun kemik hücresi, dokuyu sürdürür.\n- **Osteoklast:** eski kemiği yıkar.\nKemik ömür boyu yıkılıp yeniden yapılır; birkaç yılda iskelet büyük ölçüde yenilenir.',
      ),
      kart(
        'Sık ve süngerimsi kemik',
        '- **Sık kemik:** kemiklerin dış kısmı; sert, halkalar ve Havers kanalları içerir.\n- **Süngerimsi kemik:** uçlarda ve yassı kemiklerin içinde; boşlukları kırmızı ilikle dolu',
      ),
      kart(
        'Uzun kemiğin yapısı',
        'Dıştan içe:',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Kemik zarı', alt: 'enine büyüme, onarım' },
            { ad: 'Sık kemik', alt: 'sert gövde' },
            { ad: 'Süngerimsi kemik', alt: 'uçlarda, kırmızı ilik' },
            { ad: 'İlik boşluğu', alt: 'sarı ilik (yağ)', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Kemik şekilleri',
        '- **Uzun:** uyluk, kol kemikleri\n- **Kısa:** el ve ayak bileği kemikleri\n- **Yassı:** kafatası, kürek kemiği, kaburgalar\n- **Düzensiz:** omurlar',
      ),
      kart(
        'Kıkırdak',
        'Esnek bir destek dokusudur.\n- Burun ucu, kulak kepçesi, eklem yüzeyleri, omurlar arası diskler\n- Kan damarı yoktur; bu yüzden yavaş beslenir ve yavaş iyileşir.',
      ),
      kart(
        'Boy nasıl uzar?',
        'Kemikler önce kıkırdak olarak şekillenir, sonra kemikleşir.\nUzun kemiklerin uçlarındaki **büyüme kıkırdağı** kemiği boyca uzatır.\nErgenliğin sonunda bu kıkırdak kemikleşir ve boy uzaması durur.',
        undefined,
        { not: 'Boy, kemiğin ortasından değil uçlarındaki büyüme kıkırdağından uzar; enine büyüme kemik zarından olur.' },
      ),
      kart(
        'İskeletin bölümleri',
        'Yetişkin iskeletinde **206** kemik vardır.\n- **Eksen iskeleti:** kafatası, omurga, göğüs kafesi\n- **Üye iskeleti:** kollar, bacaklar, omuz ve kalça kemerleri',
      ),
      kart(
        'Kemik sağlığı',
        '- **Kalsiyum:** süt ürünleri, yeşil yapraklı sebzeler\n- **D vitamini:** güneş ışığı; kalsiyumun emilmesini sağlar\n- **Egzersiz:** yük taşıyan hareket kemiği güçlendirir.\n- **Kemik erimesi (osteoporoz):** yaşla ve hareketsizlikle artar.',
      ),
      kart(
        'Kırık nasıl iyileşir?',
        '- Kırık yerde kan pıhtısı oluşur.\n- Kıkırdak bir köprü (nasır) iki ucu birleştirir.\n- Nasır kemikleşir.\n- Kemik yıkıp yapan hücreler fazlalığı yontar.\nAlçı, uçların bu süreçte kıpırdamamasını sağlar.',
      ),
    ], [], [
      {
        soru: 'Kemiğe sertlik veren madde hangisidir?',
        siklar: ['Kolajen', 'Kalsiyum fosfat'],
        dogru: 1,
        aciklama: {
          dogru: 'Mineral olan kalsiyum fosfat sertlik, kolajen esneklik verir.',
          yanlis: 'Kolajen esneklik sağlayan protein. Sertliği kalsiyum fosfat verir.',
        },
        kart: 2,
      },
      {
        soru: 'Kemiğin boyca uzaması nerede olur?',
        siklar: ['Büyüme kıkırdağında', 'Kemik zarında'],
        dogru: 0,
        aciklama: {
          dogru: 'Uçlardaki büyüme kıkırdağı boyu uzatır; ergenlikte kemikleşir.',
          yanlis: 'Kemik zarı enine büyümeyi ve onarımı sağlar. Boy uzaması büyüme kıkırdağında.',
        },
        kart: 8,
      },
    ]),
    konu('byl11-eklem-kas', 'Eklem ve Kasların Hareketteki Rolü', [
      kart(
        'Eklem',
        'İki ya da daha fazla kemiğin birleştiği yerdir.\nHareket eklemlerde olur; eklemin yapısı hareketin yönünü ve genişliğini belirler.',
      ),
      kart(
        'Eklem türleri',
        '- **Oynamaz eklem:** kafatası kemikleri arasındaki dikişler\n- **Yarı oynar eklem:** omurlar arası, kaburga-göğüs kemiği\n- **Oynar eklem:** diz, dirsek, omuz, kalça',
      ),
      kart(
        'Oynar eklemin yapısı',
        '- **Eklem kıkırdağı:** kemik uçlarını kaplar, sürtünmeyi azaltır.\n- **Eklem kapsülü:** eklemi saran kılıf\n- **Eklem sıvısı:** kayganlaştırır ve besler.\n- **Bağlar:** kemiği kemiğe bağlayan sağlam şeritler',
      ),
      kart(
        'Oynar eklem çeşitleri',
        'Eklemin şekli hareketin yönünü belirler.',
        {
          tur: 'tablo',
          basliklar: ['Eklem', 'Örnek', 'Hareket'],
          satirlar: [
            ['Menteşe', 'Dirsek, diz', 'Tek düzlemde'],
            ['Top-çukur', 'Omuz, kalça', 'Her yöne'],
            ['Eksen', 'İlk iki boyun omuru', 'Kendi çevresinde'],
            ['Kayma', 'El ve ayak bileği', 'Kısa kaymalar'],
          ],
        },
      ),
      kart(
        'Kas türleri',
        'Üç kas türü yapısı ve kontrolüyle ayrılır.',
        {
          tur: 'tablo',
          basliklar: ['Kas', 'Görünüm', 'Kontrol'],
          satirlar: [
            ['İskelet kası', 'Çizgili', 'İstemli'],
            ['Düz kas', 'Çizgisiz', 'İstemsiz'],
            ['Kalp kası', 'Çizgili, dallı', 'İstemsiz'],
          ],
        },
      ),
      kart(
        'İskelet kası',
        'Kemiklere **kiriş (tendon)** ile bağlanır.\nKas kasılınca kısalır ve kemiği çeker.\nKas yalnızca **çekebilir, itemez**; bu yüzden hareketler kas çiftleriyle yapılır.',
      ),
      kart(
        'Kiriş ve bağ',
        '- **Kiriş (tendon):** kası kemiğe bağlar.\n- **Bağ (ligament):** kemiği kemiğe bağlar, eklemi sağlamlaştırır.\nAşil kirişi baldır kasını topuk kemiğine bağlar.',
        undefined,
        { not: 'Kiriş kas–kemik, bağ kemik–kemik. Burkulmada genellikle bağlar zorlanır.' },
      ),
      kart(
        'Kaldıraç sistemi',
        'Hareket bir kaldıraç gibi çalışır:\n- **Kaldıraç kolu:** kemik\n- **Destek noktası:** eklem\n- **Kuvvet:** kasın çekmesi',
      ),
      kart(
        'Kasların öteki görevleri',
        '- **Isı üretimi:** üşüyünce titreme\n- **Duruş:** sırt kasları omurgayı dik tutar.\n- **Kan pompalama:** kalp kası\n- **Besinleri ilerletme:** sindirim kanalının düz kasları',
      ),
      kart(
        'Eklem sorunları',
        '- **Burkulma:** bağların aşırı gerilmesi ya da yırtılması\n- **Çıkık:** kemiğin eklem yuvasından çıkması\n- **Menisküs yırtığı:** dizdeki kıkırdak yastığın zedelenmesi\n- **Kireçlenme:** eklem kıkırdağının aşınması',
      ),
      kart(
        'Merdiven çıkarken',
        'Kalça, diz ve ayak bileği eklemleri sırayla bükülüp açılır.\nUyluk, baldır ve kalça kasları sırayla kasılıp gevşer.\nBasit bir basamak bile onlarca kasın uyumuyla çıkılır.',
      ),
    ], [], [
      {
        soru: 'Omuz eklemi hangi türdendir?',
        siklar: ['Menteşe', 'Top-çukur'],
        dogru: 1,
        aciklama: {
          dogru: 'Omuzda top biçimli kemik ucu çukura oturur; kol her yöne döner.',
          yanlis: 'Menteşe eklem (dirsek) tek düzlemde hareket eder. Omuz top-çukur eklem.',
        },
        kart: 4,
      },
      {
        soru: 'Kası kemiğe bağlayan yapı hangisidir?',
        siklar: ['Kiriş (tendon)', 'Bağ (ligament)'],
        dogru: 0,
        aciklama: {
          dogru: 'Kiriş kas ile kemiği bağlar; bağ ise kemik ile kemiği.',
          yanlis: 'Bağ kemiği kemiğe bağlar. Kas ile kemik arasındaki yapı kiriş.',
        },
        kart: 7,
      },
    ]),
    konu('byl11-kemik-kas-birlikte', 'Kemik ve Kasların Birlikte Çalışması', [
      kart(
        'Kaslar çift çalışır',
        'Kas yalnızca çekebildiği için eklemin iki yanında zıt iş yapan kaslar bulunur.\nBiri kasılırken öteki gevşer.\nBu kaslara **karşıt (antagonist) kaslar** denir.',
      ),
      kart(
        'Kolu bükmek ve açmak',
        '- **Kol bükülürken:** ön koldaki pazı (biseps) kasılır, arka koldaki kas (triseps) gevşer.\n- **Kol açılırken:** triseps kasılır, biseps gevşer.',
        {
          tur: 'tablo',
          basliklar: ['Hareket', 'Biseps', 'Triseps'],
          satirlar: [
            ['Bükme', 'Kasılır', 'Gevşer'],
            ['Açma', 'Gevşer', 'Kasılır'],
          ],
        },
      ),
      kart(
        'Bükücü ve açıcı',
        '- **Bükücü kas:** eklemi büker, açıyı küçültür.\n- **Açıcı kas:** eklemi açar, açıyı büyütür.\nDizde uyluğun arka kasları büker, ön kasları açar.',
      ),
      kart(
        'Dirsek bir kaldıraçtır',
        '- **Destek:** dirsek eklemi\n- **Kuvvet:** bisepsin önkola tutunduğu nokta, eklemin çok yakınında\n- **Yük:** eldeki ağırlık, eklemden uzakta\nKuvvetten kaybedilir ama elin hızından ve hareket genişliğinden kazanılır.',
      ),
      kart(
        'Uyumu sinir sistemi sağlar',
        'Bir kas kasılırken karşıtının gevşemesi omurilikteki sinir bağlantılarıyla otomatik olur.\nBeyincik de hareketin zamanlamasını ve gücünü ayarlar.\nUyum bozulursa iki kas birbirine karşı çalışır, hareket kasılır.',
        undefined,
        { not: 'Karşıt kaslar birbirini "itmez"; biri kasılıp çekerken ötekini sinir sistemi gevşetir.' },
      ),
      kart(
        'Duruş',
        'Ayakta dururken sırt, karın ve bacak kasları hafifçe kasılı kalır.\nBu sürekli kasılmaya **kas tonusu** denir.\nKarşıt kaslar birlikte omurgayı ve eklemleri dengede tutar.',
      ),
      kart(
        'Yürüme',
        '- Bir bacak yeri iterken öteki öne salınır.\n- Kalça, diz ve ayak bileğinde bükücü ve açıcı kaslar sırayla çalışır.\n- Kollar dengeyi korumak için zıt yönde sallanır.',
      ),
      kart(
        'Biri olmadan öteki olmaz',
        '- Kas olmadan iskelet hareketsiz bir çatıdır.\n- İskelet olmadan kasın çekmesi bir yere iletilemez.\n- Eklem olmadan kemikler bükülemez.',
      ),
      kart(
        'Egzersizin etkisi',
        '- Kas lifleri kalınlaşır, kas güçlenir.\n- Yük taşıyan hareket kemik yoğunluğunu artırır.\n- Eklemler esnek kalır, bağlar güçlenir.\n- Kaslardaki kılcal damar sayısı artar.',
      ),
      kart(
        'Hareketsizliğin etkisi',
        '- Kaslar incelir ve zayıflar.\n- Kemik mineral kaybeder.\n- Eklemler sertleşir.\nUzayda aylarca kalan astronotlar bu yüzden her gün saatlerce egzersiz yapar.',
      ),
      kart(
        'Robot kolda karşıt kaslar',
        'Protez ve robot kolların birçoğu kasların çalışma ilkesini taklit eder: bir motor çekerken karşıtı gevşer.\nKastaki elektrik sinyalini algılayan protezler kullanıcının niyetini okuyabilir.',
      ),
    ], [], [
      {
        soru: 'Kol bükülürken triseps ne yapar?',
        siklar: ['Kasılır', 'Gevşer'],
        dogru: 1,
        aciklama: {
          dogru: 'Bükmede biseps kasılır, karşıtı triseps gevşer.',
          yanlis: 'Triseps kolu açarken kasılır. Bükme sırasında gevşer.',
        },
        kart: 2,
      },
      {
        soru: 'Dirsek kaldıracında biseps neyi kazandırır?',
        siklar: ['Hız ve hareket genişliği', 'Kuvvet'],
        dogru: 0,
        aciklama: {
          dogru: 'Kas eklemin çok yakınına tutunur: kuvvetten kaybedilir, elin hızından kazanılır.',
          yanlis: 'Kas eklemin yakınında çeker, yük ise uzakta: kuvvet kaybedilir, hız kazanılır.',
        },
        kart: 4,
      },
    ]),
    konu('byl11-kasilma-kontrol', 'Kaslarda Kasılmanın Kontrolü', [
      kart(
        'Motor birim',
        'Bir motor nöron ile onun uyardığı bütün kas lifleridir.\n- **Küçük motor birim:** birkaç lif; göz ve parmaklarda ince hareket\n- **Büyük motor birim:** yüzlerce lif; bacakta güçlü, kaba hareket',
      ),
      kart(
        'Sinir-kas kavşağı',
        'Motor nöronun ucu ile kas lifi arasındaki sinapstır.\nBurada nörotransmitter olarak **asetilkolin** salınır ve kas lifinin zarını uyarır.',
      ),
      kart(
        'Uyarıdan kasılmaya',
        'Sinyal kasın içinde kalsiyuma dönüşür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Motor nöron uyarılır' },
            { ad: 'Asetilkolin salınır' },
            { ad: 'Kas zarı uyarılır' },
            { ad: 'Depodan Ca²⁺ çıkar', renk: 'ikincil' },
            { ad: 'Kas lifi kasılır' },
          ],
        },
      ),
      kart(
        'Kalsiyumun rolü',
        'Kas lifi içindeki özel depo (sarkoplazmik retikulum) kalsiyumu saklar.\n- **Ca²⁺ serbest kalınca:** aktin üzerindeki bağlanma yerleri açılır, kasılma başlar.\n- **Ca²⁺ geri pompalanınca:** yerler kapanır, kas gevşer; bu pompa ATP harcar.',
        undefined,
        { not: 'Kasılmayı başlatan anahtar kalsiyumdur; gevşeme de kalsiyumun ATP ile geri toplanmasıyla olur.' },
      ),
      kart(
        'Kas kuvveti nasıl ayarlanır?',
        'Tek kas lifi uyarılınca ya tam kasılır ya hiç kasılmaz.\nKasın bütün olarak kuvveti iki yolla artar:\n- Daha çok motor birimin uyarılması\n- Uyarıların daha sık gönderilmesi',
      ),
      kart(
        'Seğirme ve sürekli kasılma',
        '- **Tek uyarı:** kısa bir kasılma ve gevşeme, seğirme\n- **Sık uyarılar:** kasılmalar üst üste biner, kas gevşemeden kasılı kalır\nGünlük hareketlerimizin çoğu bu sürekli kasılmayla yapılır.',
      ),
      kart(
        'Kas tonusu',
        'Dinlenirken bile kaslarda birkaç motor birim sırayla uyarılır.\nKas hafifçe gergin kalır; duruş korunur ve kas harekete hazır olur.\nUyurken tonus azalır.',
      ),
      kart(
        'Kasın enerjisi',
        'Kasılmanın doğrudan enerjisi ATP’dir ve kasta az bulunur.',
        {
          tur: 'tablo',
          basliklar: ['Kaynak', 'Süre', 'Örnek'],
          satirlar: [
            ['Hazır ATP', 'Birkaç saniye', 'Tek sıçrama'],
            ['Kreatin fosfat', '≈ 10 saniye', '100 m koşusu'],
            ['Oksijensiz solunum', '1–2 dakika', '400 m koşusu'],
            ['Oksijenli solunum', 'Saatlerce', 'Maraton'],
          ],
        },
      ),
      kart(
        'Kas yorgunluğu',
        'Uzun ve şiddetli çalışmada ATP ve glikojen azalır, oksijen yetmez.\nOksijensiz solunumla laktik asit birikir, kas gücünü kaybeder.\nDinlenirken fazladan alınan oksijen bu borcu kapatır.',
      ),
      kart(
        'Kramp',
        'Kasın istem dışı, ağrılı ve uzun süren kasılmasıdır.\nAşırı yorgunluk, su ve tuz kaybı sık nedenlerdir.\nKası yavaşça germek ve sıvı almak rahatlatır.',
      ),
      kart(
        'Yavaş ve hızlı lifler',
        '- **Yavaş lifler:** kırmızı, miyoglobin ve mitokondrice zengin, yorulmaz; duruş ve maraton\n- **Hızlı lifler:** açık renkli, güçlü ama çabuk yorulur; sprint ve sıçrama\nAntrenman liflerin özelliklerini bir ölçüde değiştirir.',
      ),
    ], [], [
      {
        soru: 'Kas liflerinde kasılmayı başlatan iyon hangisidir?',
        siklar: ['Ca²⁺', 'Cl⁻'],
        dogru: 0,
        aciklama: {
          dogru: 'Depodan salınan Ca²⁺ aktin üzerindeki bağlanma yerlerini açar.',
          yanlis: 'Anahtar kalsiyumdur: depodan Ca²⁺ salınınca kasılma başlar.',
        },
        kart: 4,
      },
      {
        soru: 'Maraton koşucusunun kasları enerjiyi çoğunlukla nereden alır?',
        siklar: ['Kreatin fosfattan', 'Oksijenli solunumdan'],
        dogru: 1,
        aciklama: {
          dogru: 'Saatler süren iş için yalnızca oksijenli solunum yetecek ATP üretir.',
          yanlis: 'Kreatin fosfat yalnızca birkaç saniye yeter. Uzun koşu oksijenli solunumla sürer.',
        },
        kart: 8,
      },
    ]),
    konu('byl11-kasilma-mekanizma', 'Kasların Kasılma Mekanizması', [
      kart(
        'İskelet kasının yapısı',
        'Kas, iç içe geçmiş demetlerden oluşur.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Kas', alt: 'organ' },
            { ad: 'Kas demeti' },
            { ad: 'Kas lifi', alt: 'tek hücre' },
            { ad: 'Miyofibril' },
            { ad: 'Sarkomer', alt: 'kasılma birimi', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Kas lifi',
        'Uzun, silindir biçimli, **çok çekirdekli** bir hücredir.\n- Sitoplazması miyofibrillerle doludur.\n- Bol mitokondri ATP üretir.\n- Özel depo kalsiyum saklar.',
      ),
      kart(
        'Aktin ve miyozin',
        '- **Aktin:** ince iplik\n- **Miyozin:** kalın iplik, üzerinde hareketli başlar\nİki ipliğin düzenli dizilişi kasa mikroskopta **çizgili** görüntü verir.',
      ),
      kart(
        'Sarkomer',
        'İki Z çizgisi arasındaki bölümdür; kasılmanın birimidir.\n- **A bandı:** miyozinin boyu kadar koyu bölge\n- **I bandı:** yalnızca aktin bulunan açık bölge\n- **H bölgesi:** A bandının ortasında yalnızca miyozin bulunan kısım',
      ),
      kart(
        'Kayan iplikler modeli',
        'Kasılmada miyozin başları aktine tutunur ve onu sarkomerin ortasına doğru çeker.\nAktin iplikleri miyozinin üstünde **kayar**, Z çizgileri birbirine yaklaşır.\nİpliklerin kendi boyu değişmez.',
      ),
      kart(
        'Kasılmada ne değişir?',
        'Kayma, yalnızca ipliklerin üst üste binmediği bölgeleri kısaltır.',
        {
          tur: 'tablo',
          basliklar: ['Bölüm', 'Kasılmada'],
          satirlar: [
            ['Sarkomer', 'Kısalır'],
            ['I bandı', 'Kısalır'],
            ['H bölgesi', 'Daralır, kaybolabilir'],
            ['A bandı', 'Değişmez'],
            ['Aktin ve miyozin boyu', 'Değişmez'],
          ],
        },
        { not: 'A bandı miyozinin boyudur ve miyozin kısalmaz; bu yüzden A bandı sabit kalır.' },
      ),
      kart(
        'Çapraz köprü döngüsü',
        'Her miyozin başı saniyede defalarca bu döngüyü yapar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Baş ATP’yi parçalar', alt: 'enerjiyle gerilir' },
            { ad: 'Aktine bağlanır', alt: 'çapraz köprü' },
            { ad: 'Güç vuruşu', alt: 'aktini çeker', renk: 'ikincil' },
            { ad: 'Yeni ATP bağlanır', alt: 'baş aktinden ayrılır' },
          ],
          donguSel: true,
        },
      ),
      kart(
        'ATP’nin üç işi',
        '- Miyozin başını güç vuruşuna hazırlar.\n- Başın aktinden **ayrılmasını** sağlar.\n- Kalsiyumu depoya geri pompalayıp gevşemeyi sağlar.',
      ),
      kart(
        'Ölüm katılığı',
        'Ölümden sonra ATP üretimi durur.\nMiyozin başları aktine bağlı kalır, ayrılamaz.\nKaslar kaskatı kesilir; buna ölüm katılığı denir.',
      ),
      kart(
        'Gevşeme',
        '- Motor nörondan uyarı gelmez.\n- Kalsiyum depoya geri çekilir.\n- Aktin üzerindeki bağlanma yerleri kapanır.\n- İplikler geri kayar, sarkomer eski boyuna döner.',
      ),
      kart(
        'Model kur',
        'İki tarağın dişlerini birbirine geçirip kaydırarak kayan iplikleri canlandırabilirsin.\n- **Taraklar:** aktin ve miyozin\n- **Sınırı:** model başların tutunup çekmesini ve ATP’yi göstermez\nHer model bir şeyi açıklar, bir şeyi dışarıda bırakır.',
      ),
    ], [], [
      {
        soru: 'Kasılmada boyu değişmeyen bölge hangisidir?',
        siklar: ['I bandı', 'A bandı'],
        dogru: 1,
        aciklama: {
          dogru: 'A bandı miyozinin boyudur ve miyozin kısalmaz.',
          yanlis: 'I bandı aktin kaydıkça kısalır. Sabit kalan A bandı.',
        },
        kart: 6,
      },
      {
        soru: 'Miyozin başının aktinden ayrılması için ne gerekir?',
        siklar: ['ATP', 'Kalsiyum'],
        dogru: 0,
        aciklama: {
          dogru: 'Başa yeni ATP bağlanınca aktinden ayrılır; ATP yoksa ölüm katılığı olur.',
          yanlis: 'Kalsiyum bağlanma yerlerini açar. Başın ayrılmasını sağlayan ATP.',
        },
        kart: 8,
      },
    ]),
    konu('byl11-dogal-bagisiklik', 'Doğal Bağışıklık', [
      kart(
        'Bağışıklık',
        'Vücudun hastalık yapıcı mikroplara (patojen) ve yabancı maddelere karşı savunmasıdır.\n- **Doğal bağışıklık:** doğuştan gelir.\n- **Kazanılmış bağışıklık:** sonradan, karşılaşılan mikroba göre gelişir.',
      ),
      kart(
        'Doğal bağışıklığın özellikleri',
        '- **Köken:** doğuştan vardır.\n- **Özgül değildir:** her mikroba aynı şekilde cevap verir.\n- **Hız:** dakikalar ya da saatler içinde başlar.\n- **Bellek:** yoktur; ikinci karşılaşmada daha güçlü olmaz.',
      ),
      kart(
        'Birinci savunma hattı',
        'Mikrobun vücuda girmesini engelleyen engeller:\n- **Deri:** ölü hücre katmanı, asidik ter\n- **Mukus ve siller:** mikrobu yakalayıp dışarı süpürür.\n- **Gözyaşı ve tükürük:** bakteri parçalayan enzim\n- **Mide asidi:** besinle gelen mikrobu öldürür.',
      ),
      kart(
        'İkinci savunma hattı',
        'Engeli aşan mikroba karşı:\n- Mikrop yiyen hücreler (fagositoz)\n- İltihap tepkisi\n- Ateş\n- Doğal öldürücü hücreler\n- Mikrop öldüren proteinler',
      ),
      kart(
        'Fagositoz',
        'Akyuvarlar mikrobu yutup sindirir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Mikrobu tanır' },
            { ad: 'Sarıp yutar' },
            { ad: 'Sindirir', alt: 'lizozomla', renk: 'ikincil' },
            { ad: 'Artığı atar' },
          ],
        },
      ),
      kart(
        'İltihap',
        'Hasarlı dokudaki hücreler **histamin** salgılar; damarlar genişler ve geçirgenleşir.\nBelirtiler: kızarıklık, sıcaklık, şişlik, ağrı\nBölgeye bol kan ve akyuvar gelir, mikrop orada sınırlanır.',
        undefined,
        { not: 'Kızarıklık ve şişlik hastalığın kendisi değil savunmanın işaretidir: bölgeye kan ve akyuvar taşınıyor.' },
      ),
      kart(
        'Ateş',
        'Hipotalamus vücut sıcaklığının ayar noktasını yükseltir.\n- Birçok mikrobun üremesi yavaşlar.\n- Akyuvarlar daha etkin çalışır.\nÇok yüksek ateş (40 °C’nin üstü) ise vücudun kendi proteinlerine zarar verebilir.',
      ),
      kart(
        'Doğal öldürücü hücreler',
        'Virüs bulaşmış ya da kanserleşmiş vücut hücrelerini tanıyıp **öldüren** akyuvarlardır.\nMikrobun kendisini değil, bozulmuş vücut hücresini hedef alırlar.',
      ),
      kart(
        'İnterferon',
        'Virüs bulaşmış hücre ölmeden önce interferon adlı protein salgılar.\nKomşu hücreler bu uyarıyla virüse karşı direnç kazanır.\nVirüsün yayılması yavaşlar.',
      ),
      kart(
        'Akyuvar türleri',
        'Her akyuvarın savunmada ayrı bir işi var.',
        {
          tur: 'tablo',
          basliklar: ['Akyuvar', 'Görevi'],
          satirlar: [
            ['Nötrofil', 'Yutar; en kalabalık akyuvar'],
            ['Makrofaj', 'Büyük yiyici, mikrobu tanıtır'],
            ['Eozinofil', 'Parazit, alerji'],
            ['Bazofil', 'Histamin salgılar'],
            ['Lenfosit', 'Kazanılmış bağışıklık'],
          ],
        },
      ),
      kart(
        'Bağışıklık organları',
        '- **Kırmızı kemik iliği:** bütün kan hücrelerini üretir.\n- **Timus:** T lenfositlerini olgunlaştırır.\n- **Lenf düğümleri:** lenfi süzer; hastalıkta şişer.\n- **Dalak:** kanı süzer, yaşlı alyuvarları yıkar.\n- **Bademcikler:** ağızdan girişi korur.',
      ),
    ], [], [
      {
        soru: 'Doğal bağışıklığın özelliği hangisidir?',
        siklar: ['Belleği vardır', 'Her mikroba aynı cevabı verir'],
        dogru: 1,
        aciklama: {
          dogru: 'Doğal bağışıklık özgül değildir ve belleği yoktur.',
          yanlis: 'Bellek kazanılmış bağışıklığın özelliği. Doğal bağışıklık her mikroba aynı cevabı verir.',
        },
        kart: 2,
      },
      {
        soru: 'İltihapta damarları genişleten madde hangisidir?',
        siklar: ['Histamin', 'İnterferon'],
        dogru: 0,
        aciklama: {
          dogru: 'Histamin damarları genişletip geçirgenliği artırır; kızarıklık ve şişlik yapar.',
          yanlis: 'İnterferon virüse karşı komşu hücreleri uyarır. Damarları genişleten histamin.',
        },
        kart: 6,
      },
    ]),
    konu('byl11-kazanilmis', 'Kazanılmış Bağışıklık', [
      kart(
        'Kazanılmış bağışıklık',
        '- **Köken:** sonradan, karşılaşılan mikroba göre gelişir.\n- **Özgüldür:** yalnızca o mikroba cevap verir.\n- **Belleği vardır:** ikinci karşılaşmada hızlı ve güçlü cevap verir.\nLenfositler tarafından yürütülür.',
      ),
      kart(
        'Antijen ve antikor',
        '- **Antijen:** bağışıklık cevabını başlatan yabancı molekül; mikrobun yüzey proteini gibi\n- **Antikor:** B lenfositlerinin ürettiği, Y biçimli protein; yalnızca kendi antijenine kilit-anahtar gibi bağlanır',
      ),
      kart(
        'B ve T lenfositleri',
        'İkisi de kırmızı kemik iliğinde üretilir.\n- **B lenfositleri:** kemik iliğinde olgunlaşır, antikor üretir.\n- **T lenfositleri:** timusta olgunlaşır, hücrelere doğrudan saldırır ya da cevabı yönetir.',
      ),
      kart(
        'Antikorla savunma',
        'B lenfositi antijenini tanıyınca çoğalır.\nBir kısmı **plazma hücresine** dönüşür ve saniyede binlerce antikor salgılar.\nKan ve lenfteki serbest mikroplara ve zehirlere karşı etkilidir.',
      ),
      kart(
        'Hücresel savunma',
        '- **Öldürücü T hücresi:** virüs bulaşmış ve kanserli hücreleri yok eder.\n- **Yardımcı T hücresi:** B ve T hücrelerini uyarıp cevabı yönetir.\nHIV yardımcı T hücrelerini hedef aldığı için bütün savunmayı çökertir.',
      ),
      kart(
        'Antikor ne yapar?',
        '- Virüsün hücreye tutunacağı yeri kapatır.\n- Mikropları birbirine yapıştırıp kümeler.\n- Zehirleri etkisiz hâle getirir.\n- Mikrobu yiyici hücreler için işaretler.',
      ),
      kart(
        'Bellek hücreleri',
        'İlk karşılaşmada cevap yavaş ve zayıftır; geride **bellek hücreleri** kalır.\nİkinci karşılaşmada cevap çok daha hızlı ve güçlüdür; çoğu zaman hastalık hiç görülmez.',
        {
          tur: 'koordinat',
          pencere: [0, 60, 0, 10],
          eksenler: true,
          xAd: 'gün',
          yAd: 'antikor miktarı',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5, 0.3],
                [10, 1.6],
                [15, 2],
                [22, 0.9],
                [30, 0.4],
              ],
            },
            {
              noktalar: [
                [30, 0.4],
                [33, 3],
                [38, 8.6],
                [44, 8],
                [58, 5],
              ],
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 13, y: 3, ad: 'ilk karşılaşma' },
            { x: 49, y: 9.3, ad: 'ikinci karşılaşma', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Aktif bağışıklık',
        'Vücut antikorunu **kendisi** üretir; bellek oluşur, uzun sürer.\n- **Doğal aktif:** hastalığı geçirmek\n- **Yapay aktif:** aşı olmak\nKorunma birkaç hafta sonra başlar.',
      ),
      kart(
        'Pasif bağışıklık',
        '**Hazır antikor** alınır; hemen etki eder ama bellek oluşmaz, kısa sürer.\n- **Doğal pasif:** anneden bebeğe plasenta ve sütle\n- **Yapay pasif:** serum; yılan sokması, tetanoz tehlikesi',
      ),
      kart(
        'Aktif mi pasif mi?',
        'Aradaki fark, antikoru kimin ürettiğidir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Aktif', 'Pasif'],
          satirlar: [
            ['Antikoru üreten', 'Kişinin kendisi', 'Başkası'],
            ['Etki başlangıcı', 'Haftalar sonra', 'Hemen'],
            ['Süre', 'Uzun, bellekli', 'Kısa, belleksiz'],
            ['Örnek', 'Aşı', 'Serum, anne sütü'],
          ],
        },
        { not: 'Aşı aktif, serum pasif bağışıklıktır. Acil durumda serum verilir çünkü hemen etki eder.' },
      ),
      kart(
        'Aşı nasıl çalışır?',
        'Aşı hastalık yapmayan bir antijen sunar.\nBu; zayıflatılmış ya da ölü mikrop, mikrobun bir parçası ya da onu üreten bir tarif (mRNA) olabilir.\nVücut bellek hücreleri oluşturur.\nToplum aşılanınca mikrop yayılamaz, aşılanamayanlar da korunur.',
      ),
      kart(
        'Organ nakli ve kan grubu',
        'Bağışıklık sistemi yabancı hücrelerin yüzey antijenlerini de tanır.\n- Uyumsuz kan nakli kümeleşmeye yol açar.\n- Nakledilen organ reddedilebilir; doku uyumu aranır ve bağışıklığı baskılayan ilaç kullanılır.',
      ),
    ], [], [
      {
        soru: 'Antikoru hangi hücreler üretir?',
        siklar: ['T lenfositleri', 'B lenfositleri'],
        dogru: 1,
        aciklama: {
          dogru: 'B lenfositleri plazma hücresine dönüşüp antikor salgılar.',
          yanlis: 'T lenfositleri hücrelere doğrudan saldırır ya da cevabı yönetir. Antikor B lenfositlerinden gelir.',
        },
        kart: 3,
      },
      {
        soru: 'Yılan sokmasında verilen serum hangi bağışıklığı sağlar?',
        siklar: ['Yapay pasif', 'Yapay aktif'],
        dogru: 0,
        aciklama: {
          dogru: 'Serum hazır antikor içerir: hemen etkili ama kısa süreli, yapay pasif.',
          yanlis: 'Yapay aktif aşıdır ve haftalar sonra koruma sağlar. Hazır antikor verildiği için pasif.',
        },
        kart: 10,
      },
    ]),
    konu('byl11-alerji', 'Alerji', [
      kart(
        'Alerji nedir?',
        'Bağışıklık sisteminin **zararsız** bir maddeye aşırı tepki vermesidir.\nSorun maddenin kendisinde değil, vücudun ona gösterdiği cevaptadır.',
      ),
      kart(
        'Alerjenler',
        '- Polen, ev tozu akarı, küf\n- Kedi ve köpeğin tüyü, salyası\n- Yer fıstığı, yumurta, süt, kabuklu deniz ürünleri\n- Arı zehri, bazı ilaçlar, lateks',
      ),
      kart(
        'İlk karşılaşma',
        'Kişi alerjenle ilk karşılaştığında belirti yoktur.\nVücut alerjene karşı özel antikorlar üretir; bunlar dokulardaki **mast hücrelerine** yapışır.\nBu hazırlık aşamasına **duyarlılaşma** denir.',
      ),
      kart(
        'Sonraki karşılaşma',
        'Belirtiler ikinci karşılaşmada başlar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Alerjen bağlanır', alt: 'antikora' },
            { ad: 'Mast hücresi uyarılır' },
            { ad: 'Histamin salgılanır', renk: 'ikincil' },
            { ad: 'Damar genişler', alt: 'mukus artar' },
            { ad: 'Belirtiler başlar' },
          ],
        },
        { not: 'İlk temasta alerji belirtisi görülmez; vücut o sırada hazırlanır, tepki sonraki karşılaşmada gelir.' },
      ),
      kart(
        'Belirtiler',
        '- **Burun:** hapşırma, akıntı, tıkanıklık\n- **Göz:** kaşıntı, sulanma, kızarıklık\n- **Deri:** kaşıntılı kabarıklıklar (kurdeşen)\n- **Akciğer:** hırıltı, nefes darlığı, astım krizi',
      ),
      kart(
        'Anafilaksi',
        'Tüm vücudu saran, hayatı tehdit eden şiddetli alerjik tepkidir.\n- Kan basıncı hızla düşer, hava yolu daralır.\n- Dakikalar içinde gelişebilir.\nAcil adrenalin iğnesi gerekir; ağır alerjisi olan kişi yanında taşır.',
      ),
      kart(
        'Tanı',
        '- **Deri testi:** kola az miktarda alerjen damlatılıp kabarıklığa bakılır.\n- **Kan testi:** alerjene özgü antikor ölçülür.\n- **Belirti günlüğü:** ne zaman, nerede başladığı not edilir.',
      ),
      kart(
        'Tedavi ve korunma',
        '- **Kaçınma:** alerjenden uzak durmak en etkili yoldur.\n- **Antihistaminik:** histaminin etkisini engeller.\n- **Burun spreyi:** iltihabı azaltır.\n- **Alerji aşısı:** küçük dozlarla vücudu alerjene alıştırır.',
      ),
      kart(
        'Alerji mi soğuk algınlığı mı?',
        'Belirtiler benzer ama sebepleri farklıdır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Alerji', 'Soğuk algınlığı'],
          satirlar: [
            ['Sebep', 'Zararsız alerjen', 'Virüs'],
            ['Ateş', 'Yok', 'Olabilir'],
            ['Süre', 'Alerjen oldukça', '7–10 gün'],
            ['Göz kaşıntısı', 'Sık', 'Nadir'],
          ],
        },
      ),
      kart(
        'Neden artıyor?',
        'Alerjiler son yüzyılda belirgin biçimde arttı.\n- Çocuklukta daha az mikroba maruz kalmak bağışıklığı "boşta" bırakabilir.\n- Hava kirliliği de bir etken olarak görülüyor.\nKonu hâlâ araştırılıyor.',
      ),
      kart(
        'Alerji ve otoimmün hastalık',
        '- **Alerji:** dışarıdan gelen zararsız bir maddeye aşırı tepki\n- **Otoimmün hastalık:** bağışıklığın vücudun kendi dokusuna saldırması; tip 1 diyabet gibi\nİkisi de bağışıklığın yanlış hedefe yönelmesidir.',
      ),
    ], [], [
      {
        soru: 'Alerji belirtilerine yol açan madde hangisidir?',
        siklar: ['İnsülin', 'Histamin'],
        dogru: 1,
        aciklama: {
          dogru: 'Mast hücrelerinden salınan histamin damar genişlemesi ve kaşıntı yapar.',
          yanlis: 'İnsülin kan şekeri hormonudur. Alerji belirtilerini histamin yapar.',
        },
        kart: 4,
      },
      {
        soru: 'Alerjenle ilk karşılaşmada ne olur?',
        siklar: ['Duyarlılaşma, belirti yok', 'Şiddetli belirtiler'],
        dogru: 0,
        aciklama: {
          dogru: 'İlk temasta antikor üretilip mast hücrelerine yapışır; belirtiler sonra gelir.',
          yanlis: 'İlk karşılaşma hazırlıktır; belirtiler ikinci ve sonraki karşılaşmalarda başlar.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('byl11-t2', 'Homeostazi', [
    konu('byl11-homeo-canli', 'Canlılarda Homeostatik Sistemler', [
      kart(
        'Homeostazi',
        'Dış ortam değişse de iç ortamın (sıcaklık, su, pH, şeker, iyonlar) **dar sınırlar içinde** tutulmasıdır.\nİç ortam hiç kıpırdamaz değildir; sürekli ayarlanan bir **dinamik dengedir**.',
      ),
      kart(
        'Neden gerekli?',
        'Enzimler belli bir sıcaklık ve pH aralığında çalışır.\nHücreler belli bir su ve tuz yoğunluğunda yaşayabilir.\nBu aralıklar aşılırsa metabolizma durur.',
      ),
      kart(
        'Tek hücrelilerde',
        'Tatlı suda yaşayan terliksi hayvana (paramesyum) osmozla sürekli su girer.\n**Kasılabilen koful** fazla suyu toplayıp dışarı pompalar.\nOlmasaydı hücre şişip patlardı.',
      ),
      kart(
        'Bitkilerde',
        '- **Stomalar:** su kaybı ile gaz alışverişini dengeler.\n- **Terleme:** yaprağı serinletir.\n- **Absisik asit:** kuraklıkta stomaları kapatır.\n- **Kök basıncı ve kılcallık:** suyu yukarı taşır.',
      ),
      kart(
        'Balıklarda tuz ve su',
        'Balığın vücudu ile yaşadığı suyun tuzluluğu farklıdır.\n- **Tatlı su balığı:** su girer; az su içer, bol ve seyreltik idrar yapar, solungaçla tuz alır.\n- **Deniz balığı:** su kaybeder; deniz suyu içer, az idrar yapar, fazla tuzu solungaçla atar.',
        undefined,
        { not: 'Balığın yaptığı her şey suyun ters yönde akmasını dengelemek için; önce suyun nereye aktığını bul.' },
      ),
      kart(
        'Isıyı nereden alıyor?',
        '- **Ektoterm (değişken sıcaklıklı):** balık, kurbağa, sürüngen; ısıyı çevreden alır, davranışla ayarlar\n- **Endoterm (sabit sıcaklıklı):** kuş, memeli; ısıyı metabolizmayla üretir\nKertenkele sabah güneşlenerek ısınır.',
      ),
      kart(
        'Soğuğa uyum',
        '- Kürk ve tüy kabartma, kalın yağ tabakası\n- Titreyerek ısı üretme\n- Kış uykusu, sıcak bölgeye göç\n- Penguen ayağında sıcak ve soğuk damarların yan yana geçip ısıyı geri kazanması',
      ),
      kart(
        'Sıcağa uyum',
        '- **İnsan:** terler, deri damarları genişler.\n- **Köpek:** dilini çıkarıp hızlı soluyarak serinler.\n- **Fil ve çöl tilkisi:** büyük kulaklarıyla ısı atar.\n- **Çöl hayvanları:** gündüz yuvada, gece dışarıda',
      ),
      kart(
        'Çölde su tasarrufu',
        '- **Kanguru faresi:** hiç su içmeden besinlerinin yıkımından çıkan suyla yaşar, çok yoğun idrar yapar.\n- **Deve:** vücut sıcaklığının gün içinde oynamasına izin vererek terlemeyi azaltır.',
      ),
      kart(
        'İnsanda kontrol merkezleri',
        '- **Hipotalamus:** sıcaklık, susuzluk, açlık\n- **Pankreas:** kan şekeri\n- **Böbrekler:** su, tuz, pH\n- **Akciğerler:** O₂, CO₂ ve pH',
      ),
      kart(
        'Karşılaştırma',
        'Farklı canlılar aynı sorunu farklı yapılarla çözer.',
        {
          tur: 'tablo',
          basliklar: ['Canlı', 'Yapı', 'Düzenlediği'],
          satirlar: [
            ['Paramesyum', 'Kasılabilen koful', 'Su miktarı'],
            ['Bitki', 'Stoma', 'Su kaybı, gaz'],
            ['Deniz balığı', 'Solungaç', 'Tuz'],
            ['Memeli', 'Hipotalamus, böbrek', 'Isı, su, tuz'],
          ],
        },
      ),
    ], [], [
      {
        soru: 'Tatlı su balığı nasıl bir idrar yapar?',
        siklar: ['Az ve yoğun', 'Bol ve seyreltik'],
        dogru: 1,
        aciklama: {
          dogru: 'Vücuduna sürekli su girer; fazlasını bol ve seyreltik idrarla atar.',
          yanlis: 'Az ve yoğun idrar su kaybeden deniz balığında. Tatlı su balığı fazla suyu atmak zorunda.',
        },
        kart: 5,
      },
      {
        soru: 'Kertenkele vücut ısısını nasıl yükseltir?',
        siklar: ['Güneşlenerek', 'Titreyerek'],
        dogru: 0,
        aciklama: {
          dogru: 'Kertenkele ektotermdir; ısıyı çevreden, güneşlenerek alır.',
          yanlis: 'Titreme endotermlerin yoludur. Ektoterm kertenkele güneşlenerek ısınır.',
        },
        kart: 6,
      },
    ]),
    konu('byl11-homeo-surec', 'Homeostatik Süreçler', [
      kart(
        'Düzenlenen değerler',
        'Bazı değişkenler ve sağlıklı aralıkları:',
        {
          tur: 'tablo',
          basliklar: ['Değişken', 'Yaklaşık aralık'],
          satirlar: [
            ['Vücut sıcaklığı', '36,5–37,5 °C'],
            ['Açlık kan şekeri', '70–100 mg/dL'],
            ['Kan pH’ı', '7,35–7,45'],
            ['Kan basıncı', '≈ 120/80 mmHg'],
          ],
        },
      ),
      kart(
        'Ayar noktası',
        'Her değişkenin vücudun hedeflediği bir değeri vardır.\nDeğer bu noktanın çevresinde küçük dalgalanmalar yapar; sapma büyüdükçe düzeltme devreye girer.\nAteşte hipotalamus ayar noktasını geçici olarak yükseltir.',
      ),
      kart(
        'Kontrol halkası',
        'Her homeostatik süreç aynı basamakları izler.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Değişim', alt: 'uyaran' },
            { ad: 'Reseptör', alt: 'değişimi algılar' },
            { ad: 'Kontrol merkezi', alt: 'karar verir', renk: 'ikincil' },
            { ad: 'Efektör', alt: 'kas ya da bez' },
            { ad: 'Yanıt', alt: 'değer geri döner' },
          ],
          donguSel: true,
        },
      ),
      kart(
        'Sıcakta',
        'Hipotalamus vücut ısısının arttığını algılar.\n- Deri damarları genişler, ısı dışarı verilir; yüz kızarır.\n- Ter bezleri çalışır; ter buharlaşırken serinletir.\n- İnsan hareketini azaltıp gölgeye geçer.',
      ),
      kart(
        'Soğukta',
        '- Deri damarları daralır, ısı içeride tutulur; deri solar.\n- Kaslar titrer, ısı üretilir.\n- Tüyler dikleşir (tavuk derisi).\n- Tiroit ve böbrek üstü hormonları metabolizmayı hızlandırır.',
      ),
      kart(
        'Su dengesi',
        'Su kaybedilince kan yoğunlaşır.\n- Hipotalamus bunu algılar, **susama** hissi doğar.\n- Hipofizden **ADH** salınır.\n- Böbrekler suyu geri emer, idrar azalır ve koyulaşır.',
      ),
      kart(
        'Kan şekeri',
        '- **Şeker yükselince:** pankreas **insülin** salgılar; hücreler glikoz alır, karaciğer glikojen depolar.\n- **Şeker düşünce:** pankreas **glukagon** salgılar; karaciğer glikojeni yıkıp kana glikoz verir.',
        undefined,
        { not: 'İnsülin kan şekerini düşüren tek hormon; yükseltenler birden fazla (glukagon, adrenalin, kortizol).' },
      ),
      kart(
        'pH dengesi',
        'Kan pH’ı üç yolla korunur:\n- **Tamponlar:** bikarbonat sistemi ani değişimi söndürür.\n- **Solunum:** CO₂ atılarak asitlik azaltılır, dakikalar içinde.\n- **Böbrekler:** H⁺ atılır, bikarbonat geri emilir; saatler, günler içinde.',
      ),
      kart(
        'İyon dengesi',
        'Na⁺, K⁺ ve Ca²⁺ sinir ve kas çalışması için belli derişimlerde tutulmalıdır.\n- **Aldosteron:** böbrekte Na⁺ tutulmasını sağlar.\n- **Parathormon ve kalsitonin:** kan kalsiyumunu ayarlar.\nAşırı terlemede tuz kaybı kramplara yol açabilir.',
      ),
      kart(
        'Enerji dengesi',
        'Uzun vadede alınan enerji harcanan enerjiye eşit olmalıdır.\n- **Grelin:** mideden salınır, açlık hissettirir.\n- **Leptin:** yağ dokusundan salınır, tokluk hissettirir.\nDenge bozulursa kilo artar ya da azalır.',
      ),
      kart(
        'Kan basıncı',
        'Aort ve şah damarındaki reseptörler basıncı sürekli ölçer.\n- **Basınç düşünce:** kalp hızlanır, damarlar daralır.\n- **Basınç yükselince:** kalp yavaşlar, damarlar genişler.\nAyağa hızlı kalkınca kısa bir baş dönmesi bu ayarın gecikmesidir.',
      ),
    ], [], [
      {
        soru: 'Kan şekeri düşünce pankreas hangi hormonu salgılar?',
        siklar: ['İnsülin', 'Glukagon'],
        dogru: 1,
        aciklama: {
          dogru: 'Glukagon karaciğerdeki glikojeni yıktırıp kan şekerini yükseltir.',
          yanlis: 'İnsülin şekeri düşürür. Şeker düşükken salgılanan glukagon.',
        },
        kart: 7,
      },
      {
        soru: 'Soğukta deri damarları ne yapar?',
        siklar: ['Daralır', 'Genişler'],
        dogru: 0,
        aciklama: {
          dogru: 'Damarlar daralır, deriye az kan gider ve ısı içeride kalır.',
          yanlis: 'Genişleme ısı atmak içindir, sıcakta olur. Soğukta damarlar daralır.',
        },
        kart: 5,
      },
    ]),
    konu('byl11-geri-bildirim', 'Pozitif ve Negatif Geri Bildirim', [
      kart(
        'Geri bildirim',
        'Bir sürecin sonucunun, sürecin kendisini etkilemesidir.\n- **Negatif geri bildirim:** sonuç süreci yavaşlatır.\n- **Pozitif geri bildirim:** sonuç süreci hızlandırır.',
      ),
      kart(
        'Negatif geri bildirim',
        'Değişimi **tersine çevirir** ve değeri ayar noktasına döndürür.\nHomeostazinin temel mekanizmasıdır; vücuttaki düzenlemelerin çoğu böyle çalışır.',
      ),
      kart(
        'Kombi benzetmesi',
        'Oda soğur → termostat algılar → kombi yanar → oda ısınır → kombi söner.\nSonuç (sıcaklık), kendisini oluşturan süreci durdurur.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Oda soğur' },
            { ad: 'Kombi yanar', renk: 'ikincil' },
            { ad: 'Oda ısınır' },
            { ad: 'Kombi söner', renk: 'ikincil' },
          ],
          donguSel: true,
        },
      ),
      kart(
        'Örnek: kan şekeri',
        '- Yemekten sonra kan şekeri yükselir.\n- Pankreas insülin salgılar.\n- Hücreler glikozu alır, şeker düşer.\n- Şeker düşünce insülin salgısı da azalır.',
      ),
      kart(
        'Örnek: tiroit',
        '- Hipotalamus hipofizi uyarır, hipofiz tiroidi uyarır.\n- Tiroit tiroksin salgılar.\n- Kanda tiroksin çoğalınca hipotalamus ve hipofiz baskılanır.\nHormon kendi üretimini frenler.',
      ),
      kart(
        'Pozitif geri bildirim',
        'Değişimi **büyütür** ve ayar noktasından uzaklaştırır.\nBir olay tamamlanana kadar sürer ve olayın bitişiyle kendiliğinden durur.\nVücutta sayısı azdır ve kısa sürelidir.',
      ),
      kart(
        'Örnek: doğum',
        '- Bebeğin başı rahim ağzına baskı yapar.\n- Hipofizden oksitosin salınır.\n- Rahim kasları kasılır, baskı artar.\n- Daha çok oksitosin salınır.\nDöngü bebeğin doğmasıyla sona erer.',
        undefined,
        { not: 'Pozitif geri bildirimde döngünün sonunu dışarıdaki bir olay getirir: doğumda bebeğin çıkması gibi.' },
      ),
      kart(
        'Örnek: kanın pıhtılaşması',
        'Yaralı damara yapışan kan pulcukları (trombositler) kimyasal sinyal salgılar.\nSinyal daha çok kan pulcuğunu çağırır, onlar da daha çok sinyal salgılar.\nPıhtı yarayı kapatınca süreç durur.',
      ),
      kart(
        'Örnek: emzirme',
        'Bebek emdikçe anneden süt salgılatan hormonlar artar.\nSüt salgısı arttıkça bebek emmeye devam eder.\nBebek doyunca emme ve döngü durur.',
      ),
      kart(
        'Karşılaştırma',
        'İki mekanizma zıt yönde çalışır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Negatif', 'Pozitif'],
          satirlar: [
            ['Değişime etkisi', 'Tersine çevirir', 'Büyütür'],
            ['Amaç', 'Dengeyi korumak', 'Olayı tamamlamak'],
            ['Süre', 'Sürekli', 'Kısa, olay bitince durur'],
            ['Örnek', 'Kan şekeri, ısı', 'Doğum, pıhtılaşma'],
          ],
        },
      ),
      kart(
        'Kontrolsüz pozitif döngü',
        'Pozitif geri bildirim kontrolden çıkarsa tehlikelidir.\nÇok yüksek ateş metabolizmayı hızlandırır, metabolizma daha çok ısı üretir.\nŞokta düşen kan basıncı kalbe giden kanı azaltır, basınç daha da düşer.',
      ),
    ], [], [
      {
        soru: 'Homeostazinin temel mekanizması hangisidir?',
        siklar: ['Negatif geri bildirim', 'Pozitif geri bildirim'],
        dogru: 0,
        aciklama: {
          dogru: 'Negatif geri bildirim sapmayı tersine çevirip dengeyi korur.',
          yanlis: 'Pozitif geri bildirim değişimi büyütür ve dengeden uzaklaştırır. Dengeyi koruyan negatif.',
        },
        kart: 2,
      },
      {
        soru: 'Doğum sırasında oksitosin salgısı hangi mekanizmayla artar?',
        siklar: ['Negatif geri bildirim', 'Pozitif geri bildirim'],
        dogru: 1,
        aciklama: {
          dogru: 'Kasılma baskıyı, baskı oksitosini artırır: kendini büyüten pozitif döngü.',
          yanlis: 'Oksitosin kendi salgısını frenlemiyor, artırıyor. Bu pozitif geri bildirim.',
        },
        kart: 7,
      },
    ]),
    konu('byl11-sinir-homeo', 'Sinir Sistemi ve Homeostazi', [
      kart(
        'Sinir sisteminin rolü',
        'İç ortamı reseptörlerle sürekli izler ve sapmaları **saniyeler içinde** düzeltir.\nUzun süreli ayarlarda hormon sistemiyle birlikte çalışır.',
      ),
      kart(
        'Hipotalamus',
        'Homeostazinin ana kontrol merkezidir.\n- Vücut sıcaklığı, açlık-tokluk, susama\n- Uyku-uyanıklık düzeni\n- Hipofiz bezini yöneterek hormon sistemini kontrol eder\nSinir sistemi ile hormon sistemi arasındaki köprüdür.',
      ),
      kart(
        'Otonom sinir sistemi',
        'İç organları, damarları ve bezleri **istem dışı** yönetir.\nKalp atışını, sindirimi ya da göz bebeğini bilinçli olarak ayarlamayız; otonom sistem bunu bizim için yapar.',
      ),
      kart(
        'Sempatik sistem',
        '**"Savaş ya da kaç"** durumunda devreye girer.\n- Kalp hızlanır, kan basıncı yükselir.\n- Bronşlar genişler, soluk hızlanır.\n- Kan şekeri yükselir.\n- Sindirim yavaşlar.',
      ),
      kart(
        'Parasempatik sistem',
        '**"Dinlen ve sindir"** durumunda baskındır.\n- Kalp yavaşlar.\n- Sindirim ve salgılar artar.\n- Göz bebeği küçülür.\nEnerji depolanır, vücut toparlanır.',
      ),
      kart(
        'İki kol dengede',
        'Organların çoğuna iki kol da ulaşır ve zıt etki yapar.\nKalp hızı, iki sistemin o anki dengesiyle belirlenir.\nDenge, arabanın gaz ve fren pedalına benzer.',
        undefined,
        { not: 'Sempatik her zaman "artırır" değil: sindirimi yavaşlatır. Etkiyi durumdan çıkar, ezberleme.' },
      ),
      kart(
        'Soğancığın merkezleri',
        '- **Solunum merkezi:** kanda CO₂ artınca soluğu hızlandırır.\n- **Kalp merkezi:** kalp hızını ayarlar.\n- **Damar merkezi:** damar çapıyla kan basıncını ayarlar.',
      ),
      kart(
        'Isı ayarının yolu',
        '- Deri ve kandaki ısı reseptörleri değişimi algılar.\n- Hipotalamus değeri ayar noktasıyla karşılaştırır.\n- Ter bezlerine, deri damarlarına ve kaslara emir gider.',
      ),
      kart(
        'Susama',
        'Kan yoğunlaşınca hipotalamustaki reseptörler bunu algılar.\n- Susama hissi doğar, su içilir.\n- ADH salgılanır, böbrek su tutar.\nDavranış ve hormon aynı amaca birlikte çalışır.',
      ),
      kart(
        'Sinir ve hormon farkı',
        'İki düzenleme yolu birbirini tamamlar.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Sinirsel', 'Hormonal'],
          satirlar: [
            ['Hız', 'Milisaniyeler', 'Saniyeler, saatler'],
            ['Süre', 'Kısa', 'Uzun'],
            ['Hedef', 'Belirli hücre', 'Kanla yaygın'],
            ['Taşıyıcı', 'Uyartı, sinaps', 'Kan'],
          ],
        },
      ),
      kart(
        'Uzun süreli stres',
        'Sempatik sistemin sürekli açık kalması vücudu yıpratır.\n- Yüksek tansiyon\n- Uyku ve sindirim sorunları\n- Bağışıklığın zayıflaması\nDüzenli uyku ve hareket parasempatik dengeyi geri kazandırır.',
      ),
    ], [], [
      {
        soru: 'Sindirimi hızlandıran sistem hangisidir?',
        siklar: ['Sempatik', 'Parasempatik'],
        dogru: 1,
        aciklama: {
          dogru: 'Parasempatik "dinlen ve sindir" sistemidir; sindirimi hızlandırır.',
          yanlis: 'Sempatik tehlike anında sindirimi yavaşlatır. Hızlandıran parasempatik.',
        },
        kart: 5,
      },
      {
        soru: 'Hangisi sinirsel düzenlemenin özelliğidir?',
        siklar: ['Hızlı ve kısa süreli', 'Yavaş ve uzun süreli'],
        dogru: 0,
        aciklama: {
          dogru: 'Uyartı milisaniyelerle iletilir, etki kısa sürer.',
          yanlis: 'Yavaş ve uzun süreli olan hormonal düzenleme. Sinirsel düzenleme hızlı ve kısa.',
        },
        kart: 10,
      },
    ]),
    konu('byl11-endokrin', 'Endokrin Sistem ve Homeostazi', [
      kart(
        'Endokrin sistem',
        'Salgılarını (hormon) doğrudan **kana** veren kanalsız bezlerden oluşur.\nHormon kanla bütün vücudu dolaşır ama yalnızca reseptörü olan **hedef hücreyi** etkiler.',
      ),
      kart(
        'Hormonların özellikleri',
        '- Çok az miktarda etkilidir.\n- Etkisi yavaş başlar ama uzun sürer.\n- Hedefe özgüdür.\n- Kimyasal yapısı protein ya da steroid (yağ benzeri) olabilir.',
      ),
      kart(
        'Hipofiz: yönetici bez',
        'Hipotalamusun altında, nohut büyüklüğündedir.\n- **Ön hipofiz:** büyüme hormonu, süt hormonu ve öteki bezleri uyaran hormonlar\n- **Arka hipofiz:** ADH ve oksitosini depolar ve salar',
      ),
      kart(
        'Tiroit',
        '- **Tiroksin:** metabolizma hızını ayarlar; yapımı için iyot gerekir.\n- **Kalsitonin:** kan kalsiyumunu düşürür, kemiğe depolatır.\nİyot eksikliğinde bez büyür: guatr.',
      ),
      kart(
        'Paratiroit',
        'Tiroidin arkasındaki dört küçük bezdir.\n**Parathormon** kan kalsiyumunu yükseltir.\nKemikten kalsiyum çeker; bağırsak ve böbrekte kalsiyum tutulmasını artırır.',
      ),
      kart(
        'Pankreas',
        'Hem sindirim enzimi hem hormon üretir.\nLangerhans adacıklarında:\n- **İnsülin:** kan şekerini düşürür.\n- **Glukagon:** kan şekerini yükseltir.',
      ),
      kart(
        'Böbrek üstü bezleri',
        '- **Kabuk – kortizol:** uzun süreli strese uyum, kan şekerini yükseltir\n- **Kabuk – aldosteron:** Na⁺ ve su tutar, kan basıncını korur\n- **Öz – adrenalin:** ani tehlikede kalbi hızlandırır, şekeri yükseltir',
      ),
      kart(
        'Eşey bezleri ve ötekiler',
        '- **Testis:** testosteron\n- **Yumurtalık:** östrojen ve progesteron\n- **Epifiz:** melatonin, uyku ritmi\n- **Timus:** T lenfositlerinin olgunlaşması',
      ),
      kart(
        'Hormon tablosu',
        'Homeostazide öne çıkanlar:',
        {
          tur: 'tablo',
          basliklar: ['Hormon', 'Bez', 'Etkisi'],
          satirlar: [
            ['İnsülin', 'Pankreas', 'Kan şekerini düşürür'],
            ['Glukagon', 'Pankreas', 'Kan şekerini yükseltir'],
            ['ADH', 'Arka hipofiz', 'Böbrekte su tutar'],
            ['Aldosteron', 'Böbrek üstü', 'Na⁺ tutar'],
            ['Tiroksin', 'Tiroit', 'Metabolizmayı hızlandırır'],
          ],
        },
      ),
      kart(
        'Zıt çalışan çiftler',
        '- **Kan şekeri:** insülin düşürür, glukagon yükseltir.\n- **Kan kalsiyumu:** kalsitonin düşürür, parathormon yükseltir.\nİki zıt hormon, değeri iki yönden de ayar noktasında tutar.',
        undefined,
        { not: 'Zıt çiftleri birlikte öğren: biri değeri düşürüyorsa öteki yükseltiyor ve ikisi aynı değişkeni koruyor.' },
      ),
      kart(
        'Hipotalamus-hipofiz ekseni',
        '- Hipotalamus hipofize "salgıla" ya da "dur" sinyali gönderir.\n- Hipofiz öteki bezleri uyarır.\n- Bezlerin hormonları kanda artınca hipotalamus ve hipofiz frenlenir.\nEndokrin sistemin çoğu bu negatif geri bildirimle çalışır.',
      ),
      kart(
        'Hormon bozuklukları',
        '- **Büyüme hormonu fazlası:** devlik; **eksikliği:** cücelik\n- **Tiroksin azlığı:** yorgunluk, üşüme, kilo alma\n- **Tiroksin fazlalığı:** çarpıntı, kilo kaybı, göz çıkıklığı\n- **ADH eksikliği:** çok miktarda seyreltik idrar',
      ),
    ], [], [
      {
        soru: 'Kan kalsiyumunu yükselten hormon hangisidir?',
        siklar: ['Kalsitonin', 'Parathormon'],
        dogru: 1,
        aciklama: {
          dogru: 'Parathormon kemikten kalsiyum çekerek kan kalsiyumunu yükseltir.',
          yanlis: 'Kalsitonin kalsiyumu düşürür. Yükselten paratiroidin parathormonu.',
        },
        kart: 5,
      },
      {
        soru: 'Tiroksin yapımı için hangi element gereklidir?',
        siklar: ['İyot', 'Demir'],
        dogru: 0,
        aciklama: {
          dogru: 'Tiroksin iyot içerir; iyot eksikliğinde guatr görülür.',
          yanlis: 'Demir hemoglobin için gerekli. Tiroksin yapımında iyot şart.',
        },
        kart: 4,
      },
    ]),
    konu('byl11-dolasim-homeo', 'Dolaşım Sistemi ve Homeostazi', [
      kart(
        'Dolaşımın homeostatik işleri',
        '- O₂, besin ve hormonları hücrelere taşır.\n- CO₂ ve atıkları uzaklaştırır.\n- Isıyı vücuda dağıtır.\n- Bağışıklık hücrelerini taşır.\n- Kan tamponlarıyla pH’ı korur.',
      ),
      kart(
        'Kalp',
        'Dört odacıklı bir pompadır.\n- **Sağ taraf:** vücuttan gelen CO₂’li kanı akciğere gönderir.\n- **Sol taraf:** akciğerden gelen O₂’li kanı vücuda gönderir.\nKapakçıklar kanın geri akmasını önler.',
      ),
      kart(
        'İki dolaşım',
        '- **Küçük dolaşım:** sağ karıncık → akciğer → sol kulakçık; kan O₂ alır.\n- **Büyük dolaşım:** sol karıncık → aort → vücut → sağ kulakçık; kan O₂ bırakır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Sol karıncık' },
            { ad: 'Vücut', alt: 'O₂ bırakır' },
            { ad: 'Sağ karıncık' },
            { ad: 'Akciğer', alt: 'O₂ alır', renk: 'ikincil' },
          ],
          donguSel: true,
        },
      ),
      kart(
        'Damarlar',
        '- **Atardamar:** kalpten çıkan kanı taşır; kalın, esnek duvarlı, yüksek basınçlı\n- **Toplardamar:** kalbe dönen kanı taşır; ince duvarlı, kapakçıklı\n- **Kılcal damar:** tek hücre kalınlığında; madde alışverişi burada olur',
      ),
      kart(
        'Kılcalda alışveriş',
        '- **Atardamar ucunda:** kan basıncı sıvıyı dokuya iter; O₂ ve besin çıkar.\n- **Toplardamar ucunda:** kandaki proteinlerin çekimi sıvıyı geri alır; CO₂ ve atık girer.\nGeri dönmeyen az miktardaki sıvıyı lenf toplar.',
        undefined,
        { not: 'Kılcalda iki kuvvet yarışır: başta basınç dışarı iter, sonda proteinlerin çekimi içeri alır.' },
      ),
      kart(
        'Kan basıncının ayarı',
        '- **Hızlı ayar:** basınç reseptörleri → soğancık → kalp hızı ve damar çapı\n- **Yavaş ayar:** ADH ve aldosteron → böbrekte su ve tuz tutulması → kan hacmi\nİki yol birlikte basıncı sabit tutar.',
      ),
      kart(
        'Isı dağıtımı',
        '- **Sıcakta:** deri damarlarına çok kan gider, ısı dışarı verilir; yüz kızarır.\n- **Soğukta:** deriye az kan gider, ısı iç organlarda tutulur; parmaklar üşür.',
      ),
      kart(
        'Egzersizde dolaşım',
        '- Kalp hızı ve bir atımda pompalanan kan artar.\n- Kan çalışan kaslara yönlendirilir.\n- Sindirim organlarına giden kan azalır.\nYemekten hemen sonra ağır egzersiz bu yüzden rahatsız eder.',
      ),
      kart(
        'Lenf sistemi',
        '- Dokulardaki fazla sıvıyı toplayıp kana geri verir.\n- Bağırsakta emilen yağları taşır.\n- Lenf düğümlerinde mikropları süzer.\nLenf akışı bozulursa dokuda sıvı birikir, şişlik (ödem) olur.',
      ),
      kart(
        'Kanın bileşenleri',
        '- **Plazma:** su, proteinler, iyonlar, besinler, hormonlar\n- **Alyuvar:** hemoglobinle O₂ taşır.\n- **Akyuvar:** savunma\n- **Kan pulcuğu:** pıhtılaşma',
      ),
      kart(
        'Kalp ve damar sağlığı',
        '- Düzenli egzersiz kalbi güçlendirir.\n- Fazla tuz kan basıncını yükseltir.\n- Sigara damarları daraltır ve sertleştirir.\n- Yüksek kolesterol damar duvarında birikir.',
      ),
    ], [], [
      {
        soru: 'Madde alışverişi hangi damarlarda olur?',
        siklar: ['Atardamarlarda', 'Kılcal damarlarda'],
        dogru: 1,
        aciklama: {
          dogru: 'Kılcalların duvarı tek hücre kalınlığındadır; alışveriş burada olur.',
          yanlis: 'Atardamarın duvarı kalındır, madde geçmez. Alışveriş kılcal damarlarda.',
        },
        kart: 4,
      },
      {
        soru: 'Sıcakta deri damarlarına giden kan ne olur?',
        siklar: ['Artar', 'Azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Deriye çok kan gelir ve ısı dışarı verilir; yüz kızarır.',
          yanlis: 'Deriye kanın azalması soğukta olur. Sıcakta ısı atmak için artar.',
        },
        kart: 7,
      },
    ]),
    konu('byl11-solunum-homeo', 'Solunum Sistemi ve Homeostazi', [
      kart(
        'Solunumun homeostatik işi',
        '- Kana O₂ verir.\n- Kandan CO₂’yi uzaklaştırır.\n- CO₂ miktarını ayarlayarak kan pH’ını korur.\n- Bir miktar su ve ısı atar.',
      ),
      kart(
        'Hava yolları',
        'Hava ısınır, nemlenir ve süzülerek ilerler.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Burun', alt: 'ısıtır, süzer' },
            { ad: 'Yutak ve gırtlak' },
            { ad: 'Soluk borusu', alt: 'mukus ve siller' },
            { ad: 'Bronş ve bronşçuklar' },
            { ad: 'Alveoller', alt: 'gaz alışverişi', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Alveolde gaz alışverişi',
        'Gazlar yüksek derişimden düşüğe **difüzyonla** geçer.\n- O₂ alveolden kana\n- CO₂ kandan alveole\nİnce duvar, 70 m²’ye yakın yüzey ve çevresindeki sık kılcal ağ alışverişi hızlandırır.',
      ),
      kart(
        'Soluk alma ve verme',
        '- **Alma:** diyafram kasılıp aşağı iner, kaburgalar kalkar; göğüs hacmi artar, basınç düşer, hava girer.\n- **Verme:** kaslar gevşer, hacim azalır, hava çıkar.\nDinlenirken soluk verme kendiliğinden olur.',
      ),
      kart(
        'Soluğu ne ayarlar?',
        'Soğancıktaki solunum merkezi soluğun hızını ve derinliğini ayarlar.\nAsıl uyaran kanda **CO₂’nin artması** ve pH’ın düşmesidir; O₂ azlığı daha zayıf bir uyarandır.',
        undefined,
        { not: 'Nefesini tutunca seni soluğa zorlayan O₂ azlığı değil, biriken CO₂’dir.' },
      ),
      kart(
        'CO₂ ve pH',
        '**CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻**\n- CO₂ birikince H⁺ artar, kan asitleşir.\n- Hızlı soluk CO₂’yi atar, pH yükselir.\nSolunum pH’ı dakikalar içinde düzeltebilir.',
      ),
      kart(
        'Gazların taşınması',
        '- **O₂:** büyük kısmı alyuvardaki hemoglobine bağlı\n- **CO₂:** çoğu plazmada bikarbonat (HCO₃⁻) olarak, bir kısmı hemoglobine bağlı, azı çözünmüş hâlde',
      ),
      kart(
        'Egzersizde solunum',
        'Kaslar daha çok CO₂ üretir.\nSolunum merkezi soluğu hızlandırır ve derinleştirir; dakikada alınan hava birkaç katına çıkar.\nEgzersiz bitince soluk bir süre hızlı kalır, biriken borç kapanır.',
      ),
      kart(
        'Yüksek rakım',
        'Yükseklerde havadaki O₂’nin basıncı düşüktür.\n- **Kısa sürede:** soluk ve kalp hızlanır.\n- **Haftalar içinde:** böbrekler alyuvar yapımını uyaran hormon salgılar, alyuvar sayısı artar.\nSporcuların yüksek irtifa kampı bu yüzdendir.',
      ),
      kart(
        'Karbon monoksit',
        'Karbon monoksit hemoglobine O₂’den yaklaşık **200 kat** güçlü bağlanır.\nKan O₂ taşıyamaz hâle gelir; renksiz ve kokusuz olduğu için fark edilmez.\nSoba, şofben ve kombi bacalarının bakımı hayat kurtarır.',
      ),
      kart(
        'Solunum sağlığı',
        '- **Sigara:** silleri felç eder, alveolleri tahrip eder.\n- **Hava kirliliği:** astım ve bronşiti artırır.\n- **Egzersiz:** solunum kaslarını güçlendirir.\n- **Burundan solumak:** havayı süzer ve ısıtır.',
      ),
    ], [], [
      {
        soru: 'Solunum merkezini en güçlü uyaran hangisidir?',
        siklar: ['Kanda O₂ azalması', 'Kanda CO₂ artması'],
        dogru: 1,
        aciklama: {
          dogru: 'CO₂ artışı kan pH’ını düşürür ve soğancığı güçlü biçimde uyarır.',
          yanlis: 'O₂ azlığı daha zayıf bir uyarandır. Asıl uyaran biriken CO₂.',
        },
        kart: 5,
      },
      {
        soru: 'Hızlı solumak kan pH’ını nasıl etkiler?',
        siklar: ['Yükseltir', 'Düşürür'],
        dogru: 0,
        aciklama: {
          dogru: 'Fazla CO₂ atılır, H⁺ azalır ve pH yükselir.',
          yanlis: 'CO₂ atıldıkça kan asitliği azalır; pH yükselir.',
        },
        kart: 6,
      },
    ]),
    konu('byl11-bosaltim-homeo', 'Boşaltım Sistemi ve Homeostazi', [
      kart(
        'Boşaltımın işi',
        '- Üre, ürik asit gibi atıkları uzaklaştırır.\n- Su ve tuz miktarını ayarlar.\n- Kan pH’ını korur.\n- Kan hacmi yoluyla kan basıncını etkiler.',
      ),
      kart(
        'Boşaltıma katılan organlar',
        '- **Böbrekler:** idrar\n- **Deri:** ter; su, tuz ve az miktarda üre\n- **Akciğerler:** CO₂ ve su buharı\n- **Karaciğer:** amonyağı üreye çevirir, safrayla bazı atıkları atar',
      ),
      kart(
        'İdrarın yolu',
        'İdrar böbrekte oluşur ve depolanıp dışarı atılır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Böbrek', alt: 'süzer' },
            { ad: 'Üreter', alt: 'taşır' },
            { ad: 'İdrar kesesi', alt: 'depolar', renk: 'ikincil' },
            { ad: 'Üretra', alt: 'dışarı atar' },
          ],
        },
      ),
      kart(
        'Nefron',
        'Böbreğin süzme birimidir; her böbrekte yaklaşık bir milyon tane vardır.\n- **Yumak (glomerul):** kılcal damar yumağı\n- **Bowman kapsülü:** süzüntüyü toplar.\n- **Kanalcıklar ve Henle kulpu:** geri emilim\n- **Toplama kanalı:** idrarı son hâline getirir.',
      ),
      kart(
        'İdrar üç adımda oluşur',
        '- **Süzülme:** kan basıncıyla su, glikoz, tuz ve üre kapsüle geçer; kan hücreleri ve proteinler geçmez.\n- **Geri emilim:** glikozun tamamı, suyun ve tuzun çoğu kana geri alınır.\n- **Salgılama:** H⁺, K⁺ ve bazı ilaçlar kandan kanalcığa verilir.',
      ),
      kart(
        'Süzülen ve atılan',
        'Böbrekler günde yaklaşık **180 L** sıvı süzer.\nBunun yalnızca **1,5 L** kadarı idrar olur; %99’u geri emilir.\nİşin asıl yükü süzmek değil geri almaktır.',
        undefined,
        { not: 'Böbrek önce neredeyse her şeyi süzer, sonra işine yarayanı geri alır; atık kalanıdır.' },
      ),
      kart(
        'ADH ile su ayarı',
        '- **Su azsa:** ADH artar, toplama kanalları suyu geri emer, idrar az ve koyu olur.\n- **Su fazlaysa:** ADH azalır, idrar bol ve açık renkli olur.\nAlkol ADH’yi baskıladığı için sık idrara çıkartır.',
      ),
      kart(
        'Aldosteron ile tuz ayarı',
        'Aldosteron böbrekte Na⁺’un geri emilmesini artırır.\nSu da tuzun peşinden gelir; kan hacmi ve basıncı yükselir.\nKan basıncı düşünce böbrekler bu hormonun salgılanmasını uyarır.',
      ),
      kart(
        'pH ayarı',
        'Kan asitleşince böbrekler:\n- H⁺’yı idrara salgılar.\n- Bikarbonatı (HCO₃⁻) kana geri alır.\nBu ayar yavaştır ama güçlüdür; solunumun yetmediği yerde devreye girer.',
      ),
      kart(
        'İdrar tahlili ne söyler?',
        '- **Glikoz:** kan şekeri çok yüksek, şeker hastalığı işareti\n- **Protein:** süzme zarı hasarlı\n- **Kan:** taş, enfeksiyon ya da hasar\n- **Çok yoğun idrar:** yetersiz su',
      ),
      kart(
        'Böbrek sağlığı',
        '- Yeterli su içmek taş oluşumunu azaltır.\n- Fazla tuz ve bilinçsiz ağrı kesici kullanımı böbreği yorar.\n- Böbrek yetmezliğinde kanı makine süzer (diyaliz) ya da böbrek nakli yapılır.',
      ),
    ], [], [
      {
        soru: 'Sağlıklı bir böbrekte glikoz idrara geçer mi?',
        siklar: ['Evet, atılır', 'Hayır, tamamı geri emilir'],
        dogru: 1,
        aciklama: {
          dogru: 'Glikoz süzülür ama kanalcıklarda tamamı geri emilir.',
          yanlis: 'Glikoz süzülür ama tamamı geri alınır; idrarda glikoz şeker hastalığı işaretidir.',
        },
        kart: 5,
      },
      {
        soru: 'Vücut su kaybedince ADH ne olur?',
        siklar: ['Artar', 'Azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'ADH artar, böbrek suyu geri emer ve idrar koyulaşır.',
          yanlis: 'ADH azalması su fazlasında olur. Susuz kalınca ADH artar.',
        },
        kart: 7,
      },
    ]),
    konu('byl11-es-gudum', 'Sistemlerin Eş Güdümlü Çalışması', [
      kart(
        'Tek sistem yetmez',
        'Homeostazi bir organın değil sistemlerin iş birliğinin sonucudur.\nSinir ve hormon sistemi yönetir; dolaşım, solunum, boşaltım ve sindirim uygular.',
      ),
      kart(
        'Egzersiz sırasında',
        'Tek bir koşuda birçok sistem birlikte değişir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Kaslar çalışır', alt: 'O₂ ihtiyacı, CO₂ artar' },
            { ad: 'Solunum hızlanır', alt: 'soğancık' },
            { ad: 'Kalp hızlanır', alt: 'kan kaslara yönelir' },
            { ad: 'Vücut ısınır', alt: 'terleme', renk: 'ikincil' },
            { ad: 'Su kaybı', alt: 'ADH, susama' },
          ],
        },
      ),
      kart(
        'Kan şekeri düşünce',
        '- **Pankreas:** glukagon salgılar.\n- **Böbrek üstü bezleri:** adrenalin ve kortizol salgılar.\n- **Karaciğer:** glikojeni yıkıp kana glikoz verir.\n- **Sinir sistemi:** açlık hissettirir, yemek yeriz.',
      ),
      kart(
        'Susuz kalınca',
        '- **Hipotalamus:** susama hissi ve ADH\n- **Böbrekler:** suyu geri emer, idrar azalır.\n- **Böbrek üstü bezi:** aldosteronla tuz tutar.\n- **Dolaşım:** damarlar daralır, kan basıncı korunur.',
      ),
      kart(
        'Soğukta',
        '- **Sinir sistemi:** titreme, deri damarlarının daralması\n- **Hormon sistemi:** tiroksin ve adrenalinle metabolizmanın hızlanması\n- **Dolaşım:** kanın iç organlarda tutulması\n- **Davranış:** kalın giyinmek, sıcak yere geçmek',
      ),
      kart(
        'Ani tehlike',
        'Sempatik sinir sistemi ve adrenalin birlikte çalışır.\n- Kalp ve solunum hızlanır.\n- Kan şekeri yükselir.\n- Kan kaslara yönlendirilir, sindirim durur.\nVücut saniyeler içinde kaçmaya ya da savunmaya hazırlanır.',
      ),
      kart(
        'Yemekten sonra',
        '- **Parasempatik sistem:** sindirimi hızlandırır.\n- **Pankreas:** insülin salgılar.\n- **Karaciğer:** glikozu glikojen olarak depolar.\n- **Dolaşım:** besinleri hücrelere taşır.',
      ),
      kart(
        'İş bölümü',
        'Sinir sistemi hızlı ve kısa süreli, hormon sistemi yavaş ve kalıcı düzenleme yapar.\nHipotalamus ikisini birbirine bağlar: sinir sinyalini hormon salgısına çevirir.',
      ),
      kart(
        'Bir halka kopunca',
        'Böbrek yetmezliğinde yalnızca idrar değil:\n- Su ve tuz birikir, kan basıncı yükselir.\n- Kan asitleşir.\n- Alyuvar yapımını uyaran hormon azalır, kansızlık gelişir.\nSistemler bağlı olduğu için bozulma zincirleme yayılır.',
      ),
      kart(
        'Sistemlerin payı',
        'Her sistem dengeye farklı bir şey katar.',
        {
          tur: 'tablo',
          basliklar: ['Sistem', 'Homeostazideki payı'],
          satirlar: [
            ['Sinir', 'Hızlı algı ve düzeltme'],
            ['Endokrin', 'Uzun süreli ayar'],
            ['Dolaşım', 'Taşıma, ısı dağıtımı'],
            ['Solunum', 'O₂, CO₂, pH'],
            ['Boşaltım', 'Su, tuz, atık, pH'],
          ],
        },
      ),
      kart(
        '"En önemli sistem" hangisi?',
        'Soru yanıltıcıdır: sistemler birbirine bağlıdır ve biri durursa öteki de çalışamaz.\nBir değişkeni doğru yorumlamak için onu etkileyen bütün sistemlere bakmak gerekir.',
        undefined,
        { not: 'Homeostazi sorusunda tek bir organ arama; değişkeni hangi sistemlerin birlikte ayarladığını sor.' },
      ),
    ], [], [
      {
        soru: 'Sinir sistemi ile hormon sistemini birbirine bağlayan yapı hangisidir?',
        siklar: ['Hipotalamus', 'Beyincik'],
        dogru: 0,
        aciklama: {
          dogru: 'Hipotalamus sinir sinyalini hipofiz üzerinden hormon salgısına çevirir.',
          yanlis: 'Beyincik denge ve hareket uyumunu sağlar. İki sistemi bağlayan hipotalamus.',
        },
        kart: 8,
      },
      {
        soru: 'Egzersizde vücut ısınınca hangi süreç başlar?',
        siklar: ['Titreme', 'Terleme'],
        dogru: 1,
        aciklama: {
          dogru: 'Isınan vücut terleyerek serinler; bu da su kaybına ve ADH artışına yol açar.',
          yanlis: 'Titreme ısı üretmek içindir, soğukta olur. Isınan vücut terler.',
        },
        kart: 2,
      },
    ]),
    konu('byl11-homeo-bozulma', 'Homeostazinin Sağlanamadığı Durumlar', [
      kart(
        'Denge bozulunca',
        'Bir değişken uzun süre ayar noktasından uzak kalırsa hastalık ortaya çıkar.\nHastalık çoğu zaman kontrol halkasındaki bir bozukluktur.\nBozulan halka reseptör, merkez, hormon ya da hedef organ olabilir.',
      ),
      kart(
        'Şeker hastalığı',
        '**Diabetes mellitus:** kan şekeri sürekli yüksektir.\n- **Tip 1:** pankreas insülin üretemez; bağışıklık sistemi insülin yapan hücreleri yok etmiştir.\n- **Tip 2:** insülin vardır ama hücreler ona yeterince cevap vermez.',
      ),
      kart(
        'Diyabetin belirtileri',
        '- Çok su içme ve sık idrara çıkma\n- İdrarda şeker\n- Sürekli açlık ve yorgunluk\n- Yaraların geç iyileşmesi\nUzun vadede göz, böbrek, sinir ve damarlar zarar görür.',
      ),
      kart(
        'Tip 1 ve tip 2',
        'İki tür farklı sebeplerle ortaya çıkar.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Tip 1', 'Tip 2'],
          satirlar: [
            ['Sebep', 'İnsülin yok', 'İnsüline direnç'],
            ['Başlangıç', 'Çoğu çocuklukta', 'Çoğu yetişkinlikte'],
            ['Risk', 'Bağışıklık, kalıtım', 'Kilo, hareketsizlik'],
            ['Tedavi', 'İnsülin iğnesi', 'Beslenme, egzersiz, ilaç'],
          ],
        },
      ),
      kart(
        'Şekersiz diyabet',
        '**Diabetes insipidus:** ADH eksiktir ya da böbrek ADH’ye cevap vermez.\n- Günde 10 litreyi bulabilen, çok seyreltik idrar\n- Aşırı susama\n- İdrarda **şeker yoktur**; kan şekeri normaldir.',
        undefined,
        { not: 'İki diyabet de "çok idrar" yapar ama sebepleri ayrı: biri insülin, öteki ADH sorunu.' },
      ),
      kart(
        'Yüksek tansiyon',
        'Kan basıncının sürekli 140/90 mmHg ve üstünde olmasıdır.\n- Çoğu zaman belirti vermez: "sessiz katil"\n- Kalp krizi, inme ve böbrek hasarı riskini artırır.\n- Fazla tuz, fazla kilo, stres ve hareketsizlik artırır.',
      ),
      kart(
        'Düşük tansiyon',
        'Kan basıncının normalin belirgin altında olmasıdır.\n- Baş dönmesi, göz kararması, bayılma\n- Ani ayağa kalkınca, sıvı kaybında ya da uzun süre ayakta kalınca görülebilir.',
      ),
      kart(
        'Obezite',
        'Alınan enerjinin uzun süre harcanandan fazla olmasıyla yağ dokusunun aşırı artmasıdır.\n- Tip 2 diyabet, yüksek tansiyon ve kalp hastalığı riskini artırır.\n- Eklemlere ve omurgaya yük bindirir.',
      ),
      kart(
        'Beden kütle indeksi',
        '**BKİ = kütle (kg) / boy² (m²)**\n90 kg, 1,75 m → 90 / 3,06 ≈ **29,4**\n- 18,5–25: normal\n- 25–30: fazla kilolu\n- 30 ve üstü: obez',
      ),
      kart(
        'Korunma',
        '- Dengeli beslenme; şeker ve tuzu azaltmak\n- Haftada en az 150 dakika hareket\n- Yeterli uyku ve stresle başa çıkma\n- Düzenli sağlık kontrolü; tansiyon ve şeker ölçümü',
      ),
      kart(
        'Hipotez kur',
        '"Günlük tuz tüketimi arttıkça kan basıncı yükselir."\n- **Bağımsız değişken:** günlük tuz miktarı\n- **Bağımlı değişken:** ölçülen kan basıncı\n- **Sabit tutulanlar:** yaş, kilo, egzersiz, uyku',
      ),
    ], [], [
      {
        soru: 'Diabetes insipidusta hangi hormon eksiktir?',
        siklar: ['İnsülin', 'ADH'],
        dogru: 1,
        aciklama: {
          dogru: 'ADH eksik olunca böbrek su tutamaz; çok seyreltik idrar çıkar.',
          yanlis: 'İnsülin eksikliği şeker hastalığında (mellitus). Şekersiz diyabette eksik olan ADH.',
        },
        kart: 5,
      },
      {
        soru: 'Kütlesi 81 kg, boyu 1,80 m olan kişinin BKİ’si yaklaşık kaçtır?',
        siklar: ['25', '45'],
        dogru: 0,
        aciklama: {
          dogru: '81 / (1,8 · 1,8) = 81 / 3,24 = 25.',
          yanlis: '45 = 81 / 1,8; boyun karesini almayı unutma: 81 / 3,24 = 25.',
        },
        kart: 9,
      },
    ]),
  ]),
])
