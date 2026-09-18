import { kart, konu, program, sikli, soru, tema } from '../tip'

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
        'Her hücre işi enerji ister',
        'Koşarken kasların kasılır, yaran iyileşirken yeni hücre yapılır, sinirlerin mesaj taşır. Hiçbiri bedava değil; hepsi enerji ister. Enerji kesilirse hücre düzenini koruyamaz ve ölür.',
      ),
      kart(
        'ATP, hücrenin hazır enerjisidir',
        'Yediğin ekmekteki enerjiyi kas doğrudan kullanamaz; önce ATP\'ye çevrilir. ATP, yani hücrenin her işte harcadığı küçük enerji paketi. Üç parçası var: adenin, riboz şekeri ve üç fosfat.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Enerji son fosfatın bağında saklıdır',
        'Üç fosfat yan yana duruyor; aralarındaki bağlar gergin bir yay gibi. Son fosfat koptuğunda bağdaki enerji açığa çıkar, hücre onu iş yapmakta kullanır. Yani enerji şekerde değil, fosfat bağında.',
      ),
      kart(
        'ATP kullanılınca ADP olur, geri döner',
        'Son fosfat kopunca elinde iki fosfatlı molekül kalır: ADP. Hücre solunumla ADP\'ye yeniden fosfat takar ve ATP geri gelir. Bu döngü sen uyurken bile durmaz.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'ATP', alt: 'enerji hazır' },
            { ad: 'ADP + P', alt: 'enerji kullanıldı' },
          ],
        },
      ),
      kart(
        'Hücre ATP biriktirmez, gerektikçe üretir',
        'Vücudundaki ATP birkaç saniyelik işe yeter; ama sürekli yenilendiği için bitmez. Depo ATP değil, besindir: glikojen ve yağ. ATP\'yi cüzdanındaki bozuk para gibi düşün: harcanır, biriktirilmez.',
        undefined,
        { not: '"Enerji deposu ATP\'dir" diyen bir şık görürsen dur: depo besin, ATP anlık harcanan bozuk para.' },
      ),
      kart(
        'Besin büyük, ATP küçük paketlidir',
        'Bir glikozda çok enerji var; tek seferde salınsa hücre onu kullanamaz, ısı olarak kaybolur. Bu yüzden glikozun enerjisi onlarca küçük ATP paketine bölünür. Her iş kendine yetecek paketi alır.',
      ),
    ], [
      soru('ATP, hücrenin doğrudan kullanabildiği enerji molekülüdür.', true, 'Besindeki enerji önce ATP ye çevriliyor.'),
      soru('Hücre, ihtiyaç duyacağı ATP yi büyük miktarlarda depolar.', false, 'ATP depolanmaz; ihtiyaç oldukça üretiliyor.'),
      soru('Besinlerdeki enerji kimyasal bağlarda saklıdır.', true, 'Bağlar koparıldıkça enerji açığa çıkıyor.'),
      soru('ATP kullanıldığında geri dönüşü olmayacak biçimde yok olur.', false, 'ADP ye dönüşür ve yeniden ATP ye çevrilir; süreç bir döngü.'),
      sikli('ATP kaç fosfat taşır?', ['3', '2'], 0, 'Adenin, riboz, üç fosfat.'),
      sikli('Hücre ATP\'yi ne yapar?', ['İhtiyaç oldukça üretir', 'Biriktirir'], 0, 'Depo besinin kendisi.'),
      soru('ATP parçalanınca ADP oluşur.', true, 'Solunumla yeniden ATP.'),
    ], [
      {
        soru: 'ATP\'de enerji nerede saklıdır?',
        siklar: ['Fosfatlar arasındaki bağlarda', 'Riboz şekerinde'],
        dogru: 0,
        aciklama: {
          dogru: 'Son fosfat koparken açığa çıkan enerji hücrenin işine harcanır.',
          yanlis: 'Riboz yalnızca iskelet. Kullanılan enerji fosfatlar arasındaki bağın kopmasından gelir.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-fotosentez', 'Işık Enerjisiyle Besin Sentezi: Fotosentez', [
      kart(
        'Bitki besinini ışıkla kendi yapar',
        'Saksıdaki bitki hiç yemek yemez ama büyür. Havadan karbondioksit, kökten su alır; güneş ışığıyla bunlardan glikoz, yani şeker yapar. Yan ürün olarak oksijen çıkar. Buna fotosentez denir; yaprak hücresindeki kloroplastta olur.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fotosentez iki evrede yürür',
        'Önce ışık yakalanır, sonra şeker yapılır. Işıklı evre ışığın enerjisini ATP ve NADPH\'a çevirir; NADPH, yani elektron taşıyan bir molekül. İkinci evre bu ikisiyle şekeri kurar. Sıra bozulmaz: ikincisi birincinin ürününü bekler.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Işıklı evre', alt: 'tilakoit' },
            { ad: 'ATP + NADPH', renk: 'ikincil' },
            { ad: 'Calvin döngüsü', alt: 'stroma' },
          ],
        },
      ),
      kart(
        'Işıklı evre suyu parçalar, enerji toplar',
        'Kloroplastın içindeki tilakoit zarlarda ışık suyu parçalar; buna fotoliz denir. Sudan çıkan oksijen havaya verilir. Işığın enerjisi ATP ve NADPH\'ta saklanır. Bu evrede henüz şeker yok.',
      ),
      kart(
        'Calvin döngüsü CO₂\'yi şekere çevirir',
        'İkinci evre stromada, yani kloroplastın sıvı iç kısmında geçer. Havadan alınan karbondioksit, ışıklı evrenin ATP ve NADPH\'ıyla glikoza bağlanır. Işık burada doğrudan kullanılmaz; adı bu yüzden "ışıktan bağımsız evre".',
      ),
      kart(
        'Çıkan oksijen CO₂\'den değil, sudan gelir',
        'Bitki CO₂ alıp O₂ veriyor; oksijen CO₂\'den çıkıyor sanırsın. Yanlış. Bilim insanları suya işaretli oksijen koydu, havaya işaretli oksijen çıktı. O₂ suyun parçalanmasından gelir. CO₂\'nin oksijeni şekere gider.',
        undefined,
        { etiket: 'Sık hata', not: '"O₂ karbondioksitten çıkar" şıkkını gördüğünde dur: oksijenin kaynağı fotolizle parçalanan su.' },
      ),
      kart(
        'Klorofil yeşili yansıtır, kırmızıyı emer',
        'Yaprak neden yeşil? Klorofil, yani ışığı yakalayan pigment, kırmızı ve mavi ışığı soğurur, yani emer. Yeşili emmez, geri yansıtır; gözüne gelen o yansıyan yeşil. Yeşil ışık fotosentezde en az işe yarar.',
      ),
      kart(
        'Işık arttıkça hız artar, sonra durur',
        'Bitkiye lambayı yaklaştır: fotosentez hızlanır. Biraz daha yaklaştır: yine hızlanır. Bir noktadan sonra ne kadar ışık verirsen ver hız değişmez, grafik yatay çizer. CO₂ ve sıcaklık için de aynı eğri geçerli.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'ışık şiddeti',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 0.2],
                [1, 2],
                [2, 3.6],
                [3.5, 4.6],
                [5.5, 4.8],
              ],
            },
          ],
        },
      ),
      kart(
        'Hız en kıt olan etmene takılır',
        'Grafiğin yataylaştığı yerde ışık artık bol; hızı başka bir şey tutuyor, örneğin havadaki karbondioksit. En az bulunan etmene sınırlayıcı etmen denir. Serada ışığı artırmak yerine CO₂ vermek çoğu zaman daha çok işe yarar.',
      ),
      kart(
        'Fotosentez olmasa nefes de yemek de yok',
        'Soluduğun oksijenin neredeyse tamamı bitkiler ve alglerden, yani su yosunlarından çıktı. Yediğin her şeyin enerjisi de bir yaprakta yakalanan güneş ışığından geliyor. Et yesen bile o hayvan bitki yemişti.',
      ),
      kart(
        'Işıktan bağımsız evre gece uzun sürmez',
        'Calvin döngüsü ışığa doğrudan bakmaz; gece de çalışabilir. Ama ATP ve NADPH\'ı ışıklı evre üretir. Işık kesilince elde kalanlar birkaç dakikada biter, döngü durur. "Karanlık evre gece olur" demek sık hata.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru(
        'Grafiğe göre ışık şiddeti arttıkça fotosentez hızı sınırsız olarak artar.',
        false,
        'Eğri bir noktadan sonra yataylaşıyor: başka bir etmen sınırlayıcı hâle geliyor.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 10],
          xAd: 'ışık şiddeti',
          yAd: 'fotosentez hızı',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [2, 4],
                [4, 6.5],
                [6, 7.6],
                [8, 8],
                [9.5, 8.1],
              ],
            },
          ],
        },
      ),
      soru('Fotosentezde açığa çıkan oksijen sudan gelir.', true, 'Su parçalanırken oksijen serbest kalıyor.'),
      soru('Işığın kullanılmadığı tepkimeler yalnızca gece gerçekleşir.', false, 'Işık gerekmiyor ama gündüz de sürüyor; adı yanıltıcı.'),
      soru('Klorofil, ışığın yeşil dalga boylarını en çok soğurur.', false, 'Yeşili yansıtır; yaprakların yeşil görünmesinin sebebi bu.'),
      sikli('Işık tepkimeleri nerede olur?', ['Tilakoit zarda', 'Stromada'], 0, 'Calvin döngüsü stromada.'),
      sikli('Calvin döngüsünde CO₂ neyle glikoza bağlanır?', ['ATP ve NADPH ile', 'Oksijenle'], 0, 'Işık tepkimelerinin ürünleri.'),
      sikli('Klorofil hangi ışığı yansıtır?', ['Yeşil', 'Kırmızı'], 0, 'Kırmızı ve maviyi soğurur.'),
      sikli('Işık artırılıp CO₂ azsa hız ne olur?', ['Artmaz', 'Artar'], 0, 'Sınırlayıcı etmen.'),
      sikli('Suyun parçalanmasına ne denir?', ['Hidroliz', 'Fotoliz'], 1, 'Oksijen açığa çıkar.'),
      sikli('Karanlık tepkimeleri gece neden uzun sürmez?', ['Sıcaklık düşer', 'ATP ve NADPH biter'], 1, 'Işık tepkimeleri beslemez.'),
      soru('Atmosferdeki oksijenin kaynağı büyük ölçüde fotosentezdir.', true, 'Besin zincirindeki enerji de.'),
    ], [
      {
        soru: 'Fotosentezde açığa çıkan oksijen nereden gelir?',
        siklar: ['Parçalanan sudan', 'Karbondioksitten'],
        dogru: 0,
        aciklama: {
          dogru: 'Fotoliz suyu parçalar; izotoplu deneyler oksijenin kaynağının su olduğunu gösterdi.',
          yanlis: 'CO₂\'nin oksijeni glikoza ve suya gider. Havaya salınan O₂ suyun parçalanmasından çıkar.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-kemosentez', 'Işık Kullanılmadan Besin Sentezi: Kemosentez', [
      kart(
        'Bazı bakteriler ışıksız besin yapar',
        'Okyanusun dibinde, güneşin hiç ulaşmadığı yerde bakteriler yaşıyor ve besin üretiyor. Işık yok; enerjiyi kimyasal maddelerden alıyorlar. Kemosentez, yani ışık yerine kimyasal enerjiyle karbondioksitten besin yapmak.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Enerji, maddeyi yükseltgemekten gelir',
        'Nitrit bakterisi toprakta amonyağı alır, onu oksijenle tepkimeye sokar, yani yükseltger. Bu tepkime enerji verir; bakteri o enerjiyle şeker kurar. Kükürt bakterisi kükürtle, demir bakterisi demirle aynı işi yapar.',
      ),
      kart(
        'Kemosentezi yalnızca prokaryotlar yapar',
        'Kemosentez yapanlar bazı bakteriler ve arkeler, yani çekirdeksiz hücreli canlılar (prokaryotlar). Hiçbir bitki, hayvan ya da mantar, yani ökaryot, kemosentez yapamaz. "Bitki kemosentez yapar" şıkkına kanma.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Fotosentezden farkı enerjinin kaynağı',
        'İkisi de CO₂\'den besin üretir; yani ikisi de üreticidir. Ayrıldıkları yer: fotosentez ışıkla, kemosentez kimyasal tepkimeyle çalışır. Bir fark daha: kemosentezde su parçalanmadığı için oksijen çıkmaz.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fotosentez', 'Kemosentez'],
          satirlar: [
            ['Enerji', 'Işık', 'Kimyasal bağ'],
            ['Yapan', 'Bitki, alg', 'Bakteri'],
            ['Oksijen', 'Çıkar', 'Çıkmaz'],
          ],
        },
        { not: 'Soru "üretici" diyorsa aklına yalnızca bitki gelmesin; kemosentez bakterisi de üretici.' },
      ),
      kart(
        'Hidrotermal bacada zincir bakteriyle başlar',
        'Okyanus tabanındaki sıcak su bacalarından kükürtlü su fışkırır. Kükürt bakterileri bununla besin yapar; kurtlar ve yengeçler bakterileri yer. Işık olmadan koca bir besin zinciri kurulur. Zincirin üreticisi bitki değil, bakteri.',
      ),
      kart(
        'Toprağı verimli yapan da kemosentezdir',
        'Toprakta amonyağı nitrite, nitriti nitrata çeviren bakteriler kemosentez yapar. Bitki azotu ancak nitrat olarak alabilir. Bu bakteriler olmasa gübre bile işe yaramazdı. Azot döngüsünde bu adıma nitrifikasyon denir.',
      ),
    ], [
      soru('Kemosentez yapan canlılar enerjiyi kimyasal maddeleri yükseltgeyerek sağlar.', true, 'Işığa ihtiyaç duymuyorlar.'),
      soru('Kemosentezi bazı bakteri ve arkeler yapar.', true, 'Bitkiler kemosentez yapmaz.'),
      soru('Kemosentezin gerçekleşmesi için ışık gereklidir.', false, 'Işık gerekmez; okyanus tabanındaki karanlıkta da yapılıyor.'),
      soru('Azot döngüsünde kemosentetik bakterilerin bir rolü yoktur.', false, 'Nitrifikasyon bakterileri bu döngünün temel halkası.'),
      sikli('Kemosentez hangi canlılarda görülür?', ['Bazı prokaryotlarda', 'Bitkilerde'], 0, 'Ökaryotta yok.'),
      sikli('Kemosentez ile fotosentezin ortak noktası?', ['CO₂\'den besin üretmek', 'Oksijen çıkarmak'], 0, 'İkisi de üretici.'),
      soru('Hidrotermal bacalarda besin zincirini fotosentez başlatır.', false, 'Işık ulaşmaz; kemosentez başlatır.'),
    ], [
      {
        soru: 'Kemosentez yapan canlılar enerjiyi nereden alır?',
        siklar: ['Kimyasal tepkimelerden', 'Güneş ışığından'],
        dogru: 0,
        aciklama: {
          dogru: 'Amonyak, kükürt ya da demir bileşiklerini yükseltgeyerek enerji elde ederler.',
          yanlis: 'Işık fotosentezin enerjisi. Kemosentez ışıksız ortamda, inorganik maddelerin oksidasyonundan enerji alır.',
        },
        kart: 2,
      },
    ]),
    konu('byl10-sindirim', 'Sindirim', [
      kart(
        'Büyük besin hücreye sığmaz',
        'Ekmekteki nişasta binlerce glikozdan kurulu dev bir molekül. Hücre zarından geçemez; kapı küçük, o büyük. Sindirim, yani büyük besin moleküllerini zarı geçecek küçük yapı taşlarına ayırmak. Nişasta glikoza, protein amino aside iner.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Mekanik sindirim yalnızca küçültür',
        'Ekmeği dişlerinle ufalıyorsun. Parçalar küçüldü ama hâlâ nişasta; molekül değişmedi. Buna mekanik sindirim denir: besini fiziksel olarak parçalamak. Midenin çalkalaması da mekanik. Kimyasal yapı aynı kalır.',
      ),
      kart(
        'Kimyasal sindirim bağları koparır',
        'Tükürükteki amilaz, yani nişastayı parçalayan enzim, glikozlar arasındaki bağı koparır. Artık elde nişasta değil glikoz var; molekül değişti. Buna kimyasal sindirim denir ve her zaman bir enzim iş başındadır.',
      ),
      kart(
        'Kimyasal sindirim su harcar: hidroliz',
        'Enzim bağı koparırken araya bir su molekülü sokar. Su ikiye bölünür; yarısı bir parçaya, yarısı öbürüne takılır. Buna hidroliz denir: su ile parçalama. Sindirimde su hep harcanır, açığa çıkmaz.',
      ),
      kart(
        'Ufalamak enzimin işini kolaylaştırır',
        'Şekeri suda erit: küp şeker yavaş, toz şeker hızlı erir; toz şekerin yüzeyi daha geniş. Enzim de yalnızca yüzeye dokunabilir. Mekanik sindirim yüzeyi büyütür, kimyasal sindirim hızlanır. Lokmayı iyi çiğnemek bu yüzden işe yarar.',
        undefined,
        { not: 'Mekanik sindirimi "yalnızca çiğneme" diye geçme; enzimin dokunacağı yüzeyi o hazırlıyor.' },
      ),
      kart(
        'Sindirim hücre içinde ya da dışında olur',
        'Amip besini hücresine alır; lizozom, yani enzim dolu kese, onu içeride parçalar: hücre içi sindirim. Sen ise enzimi mideye salgılarsın; besin hücrenin dışında, kanalda parçalanır: hücre dışı sindirim. Mantar da enzimi dışarı salar.',
      ),
    ], [
      soru('Sindirim, büyük moleküllerin hücre zarından geçebilecek küçüklüğe getirilmesidir.', true, 'Bu olmadan besin hücreye giremiyor.'),
      soru('Kimyasal sindirim hidroliz tepkimeleriyle gerçekleşir.', true, 'Bağların koparılmasında su kullanılıyor.'),
      soru('Mekanik sindirimde besinin kimyasal yapısı değişir.', false, 'Yalnızca parçalara ayrılır; yapı aynı kalır.'),
      soru('Hücre içi sindirim yalnızca çok hücreli canlılarda görülür.', false, 'Tek hücrelilerin temel sindirim yolu bu.'),
      sikli('Amip nasıl sindirim yapar?', ['Hücre dışı', 'Hücre içi'], 1, 'Lizozom enzimleriyle.'),
      sikli('Kimyasal sindirime hidroliz denmesinin sebebi?', ['Su çıkarılır', 'Su eklenerek bağ koparılır'], 1, 'Hidroliz su ile parçalama.'),
      soru('Büyük besin molekülleri hücre zarından geçebilir.', false, 'Yapı taşlarına ayrılmalı.'),
    ], [
      {
        soru: 'Mekanik sindirimin kimyasal sindirime katkısı nedir?',
        siklar: ['Yüzey alanını büyütür', 'Bağları koparır'],
        dogru: 0,
        aciklama: {
          dogru: 'Enzim yüzeyde çalışır; ufalanan besinde enzimin ulaştığı yüzey artar.',
          yanlis: 'Bağ koparan kimyasal sindirim (enzim). Mekanik sindirim yalnızca küçültüp yüzeyi büyütür.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-sindirim-yapi', 'Canlılarda Sindirim Yapıları', [
      kart(
        'Tek hücrelide sindirim kofulda olur',
        'Amipin ağzı yok. Besini hücre zarıyla sarıp içine alır; bu keseye besin kofulu denir. Lizozom, yani enzim dolu kese, kofulla birleşir ve besini içeride parçalar. Sindirim sistemi yok; tek hücre her işi yapıyor.',
      ),
      kart(
        'Hidrada ağız hem giriş hem çıkıştır',
        'Hidra ve denizanası, yani sölenterler, torba gibi bir sindirim boşluğu taşır. Torbanın tek deliği var. Besin oradan girer, artık yine oradan çıkar. Eski artık çıkmadan yeni lokma giremez; verim düşük.',
      ),
      kart(
        'Solucanda kanal iki açıklıklıdır',
        'Toprak solucanında besin ağızdan girer, anüsten çıkar; arada bir boru var. Besin tek yönde ilerlediği için borunun her bölümü ayrı işe uzmanlaşır: biri öğütür, biri sindirir, biri emer. Yemekle atık karışmaz.',
      ),
      kart(
        'Sindirim yapıları basitten karmaşığa gider',
        'Sırayı mantıkla tut. Tek hücrede koful. Hidrada tek delikli torba. Solucanda iki delikli boru. Omurgalıda borunun üstüne mide ve karaciğer gibi uzman organlar. Her adım daha çok besini daha verimli işler.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Koful' },
            { ad: 'Tek açıklık' },
            { ad: 'İki açıklık' },
            { ad: 'Uzman organlar' },
          ],
        },
        { not: 'Yapıları tek tek ezberleme; "tek delikten iki deliğe geçiş" cümlesini tut, gerisi sıralanır.' },
      ),
      kart(
        'Otçulun bağırsağı uzundur',
        'Ot selüloz dolu; selüloz, yani bitki hücre duvarını kuran sert karbonhidrat, zor sindirilir. Bu yüzden inek gibi otçulların bağırsağı uzun ve bakteri dolu. Et kolay sindirilir; aslan gibi etçilin bağırsağı kısa.',
      ),
      kart(
        'Selülozu inek değil, bakterileri sindirir',
        'Hiçbir hayvanda selülozu parçalayan enzim yok; inekte de yok. İneğin dört bölmeli midesindeki bakteriler selülozu parçalar, inek onların ürününü kullanır. Geviş getirmek, yani otu geri çıkarıp yeniden çiğnemek, bakteriye yardım eder.',
      ),
    ], [
      soru('Sölenterelerde sindirim boşluğunun tek açıklığı vardır.', true, 'Ağız aynı zamanda atık çıkışı olarak kullanılıyor.'),
      soru('Toprak solucanında ağızdan anüse uzanan tam bir sindirim kanalı bulunur.', true, 'Besin tek yönde ilerliyor.'),
      soru('Otçul hayvanlarda sindirim kanalı etçillere göre kısadır.', false, 'Selüloz zor sindirildiği için otçullarda kanal daha uzun.'),
      soru('Geviş getirenler selülozu kendi enzimleriyle sindirir.', false, 'Midelerindeki mikroorganizmalar sindiriyor.'),
      sikli('İki açıklıklı sindirim kanalı ilk hangi grupta gelişir?', ['Solucanlar', 'Sölenterler'], 0, 'Besin tek yönde ilerler.'),
      sikli('Otçulların bağırsağı etçillere göre nasıldır?', ['Uzun', 'Kısa'], 0, 'Selüloz sindirimi için mikroplu.'),
      soru('Amip besini hücre dışında parçaladıktan sonra içeri alır.', false, 'Koful ile lizozom birleşir; sindirim hücrenin içinde.'),
    ], [
      {
        soru: 'Sölenterelerde sindirim sistemi kaç açıklıklıdır?',
        siklar: ['Bir', 'İki'],
        dogru: 0,
        aciklama: {
          dogru: 'Ağız hem giriş hem çıkış; iki açıklık solucanlarla başlar.',
          yanlis: 'İki açıklıklı kanal solucanlarda gelişir. Sölenterelerde tek açıklık hem ağız hem anüs işi görür.',
        },
        kart: 2,
      },
    ]),
    konu('byl10-insan-sindirim', 'İnsanda Sindirim', [
      kart(
        'Besin ağızdan anüse bir borudan geçer',
        'Yediğin lokma ağız, yemek borusu, mide, ince bağırsak, kalın bağırsak, anüs yolunu izler; toplam yaklaşık 9 metre. Karaciğer ve pankreas bu borunun dışında; salgılarını boruya kanalla dökerler. Besin onların içine girmez.',
      ),
      kart(
        'Ağızda nişasta sindirimi başlar',
        'Ekmeği uzun süre çiğne: tatlılaşır. Tükürükteki amilaz nişastayı şekere çevirmeye başladı. Dişler mekanik, amilaz kimyasal sindirim yapar. Ağızda yalnızca karbonhidrat sindirimi başlar; protein ve yağa dokunulmaz.',
      ),
      kart(
        'Midede protein sindirimi başlar',
        'Mide asit dolu bir torba. Asit, pepsin adlı enzimi çalıştırır; pepsin proteinleri parçalamaya başlar. Amilaz asitte çalışamaz; bu yüzden nişasta sindirimi midede durur. Yağa da mide dokunmaz.',
      ),
      kart(
        'Mukus mideyi kendi asidinden korur',
        'Mide et sindiriyor, kendi duvarı da et; neden erimiyor? İç yüzeyi kalın bir mukus, yani sümüksü tabaka, kaplar ve asidi duvara değdirmez. Pepsin de etkisiz hâlde salgılanır, ancak asitle aktifleşir. Mukus azalırsa ülser olur.',
      ),
      kart(
        'İnce bağırsakta üçü de biter',
        'İnce bağırsak sindirimin son durağı. Pankreas, yani karnının arkasındaki bez, buraya amilaz, tripsin ve lipaz yollar. Karbonhidrat, protein ve yağ, hangi organda başlamış olursa olsun burada yapı taşına iner.',
        {
          tur: 'tablo',
          basliklar: ['Besin', 'Başlar', 'Biter'],
          satirlar: [
            ['Karbonhidrat', 'Ağız', 'İnce bağırsak'],
            ['Protein', 'Mide', 'İnce bağırsak'],
            ['Yağ', 'İnce bağırsak', 'İnce bağırsak'],
          ],
        },
        { not: 'Başlangıçlar üç ayrı organ, bitiş hep ince bağırsak; tabloyu kapatıp kendin çiz.' },
      ),
      kart(
        'Safra enzim değil, yağı damlacığa böler',
        'Karaciğer safra yapar, safra kesesi depolar, ince bağırsağa döker. Safra yağ damlasını deterjan gibi minik damlacıklara ayırır: emülsiyon. Bağ koparmaz, yani kimyasal sindirim yapmaz; lipazın ulaşacağı yüzeyi büyütür.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Enzimin adı hangi besini kestiğini söyler',
        'Amilaz nişastayı keser (ağız, ince bağırsak). Pepsin proteini (mide), tripsin proteini (pankreastan ince bağırsağa). Lipaz yağı (ince bağırsak). Akılda tutmak için: lipaz–lipit, yani yağ; pepsin ve tripsin ikisi de protein.',
      ),
      kart(
        'Kalın bağırsak sindirmez, su emer',
        'İnce bağırsaktan çıkan artık sulu bir bulamaç. Kalın bağırsak bundan suyu ve mineralleri geri alır; dışkı böyle katılaşır. Burada enzim yok, sindirim yok. İçindeki bakteriler, yani bağırsak florası, K vitamini gibi bazı vitaminleri üretir.',
      ),
    ], [
      soru('Karbonhidratların kimyasal sindirimi ağızda başlar.', true, 'Tükürükteki amilaz nişastayı parçalamaya başlıyor.'),
      soru('Proteinlerin kimyasal sindirimi midede başlar.', true, 'Pepsin asidik ortamda çalışıyor.'),
      soru('Safra, yağları kimyasal olarak sindirir.', false, 'Safra enzim değil; yağı küçük damlacıklara ayırarak mekanik sindirim yapıyor.'),
      soru('Sindirimin tamamlandığı yer kalın bağırsaktır.', false, 'Sindirim ince bağırsakta tamamlanır; kalın bağırsakta su ve mineral emiliyor.'),
      sikli('Nişastanın sindirimi nerede başlar?', ['Ağızda', 'Midede'], 0, 'Tükürükteki amilaz.'),
      sikli('Pepsin neyi parçalar?', ['Proteinleri', 'Yağları'], 0, 'Midede, asidik ortamda.'),
      sikli('Sindirimin tamamlandığı yer?', ['İnce bağırsak', 'Kalın bağırsak'], 0, 'Pankreas enzimleri ve safra buraya dökülür.'),
      sikli('Kalın bağırsakta ne olur?', ['Su ve mineral emilimi', 'Protein sindirimi'], 0, 'Sindirim olmaz.'),
      sikli('Mide kendini neden sindirmez?', ['Asit zayıftır', 'Mukus tabakası'], 1, 'Pepsin de etkisiz öncül olarak salgılanır.'),
      soru('Karbonhidrat sindirimi midede devam eder.', false, 'Asit yüzünden durur.'),
    ], [
      {
        soru: 'Safra ne yapar?',
        siklar: ['Yağı emülsiyon hâline getirir', 'Yağı kimyasal olarak sindirir'],
        dogru: 0,
        aciklama: {
          dogru: 'Safra enzim değil; yağ damlalarını küçültüp lipazın çalışacağı yüzeyi artırır.',
          yanlis: 'Kimyasal sindirimi lipaz yapar. Safra enzim içermez, yalnızca yağı küçük damlalara ayırır.',
        },
        kart: 6,
      },
    ]),
    konu('byl10-emilim', 'Emilim ve Taşınma', [
      kart(
        'Sindirilen besin bağırsaktan kana geçer',
        'Glikoz artık yeterince küçük; ama hâlâ bağırsağın içinde, vücudun "dışında" sayılır. Bağırsak duvarından geçip kana karışmasına emilim denir. Emilimin büyük kısmı ince bağırsakta olur; kalın bağırsak yalnızca su ve mineral alır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Villuslar emilim yüzeyini büyütür',
        'İnce bağırsağın iç yüzü düz değil; parmak gibi çıkıntılarla kaplı. Bunlara villus denir; her villusun üstünde daha ince mikrovilluslar var. Havlu düz bezden çok su emer; bağırsak da yüzeyi katlayıp yüzlerce kat büyütür.',
      ),
      kart(
        'Glikoz ve amino asit kana gider',
        'Villusun içinde iki tür damar var: kan kılcalı ve lenf kılcalı. Glikoz ve amino asitler kan kılcalına geçer. Suda çözünen vitaminler ve mineraller de kana gider. Bu yol kapı toplardamarıyla karaciğere çıkar.',
      ),
      kart(
        'Yağ ürünleri önce lenfe geçer',
        'Yağ asitleri ve gliserol villusun içinde yeniden yağa birleşir; bu paket kan kılcalına sığmaz. Lenf kılcalına geçer; lenf, yani damarlarda dolaşan renksiz sıvı. Göğüste kana katılır. Yağda çözünen A, D, E, K vitaminleri de bu yoldan.',
        undefined,
        { etiket: 'Sık hata', not: '"Hepsi kana geçer" diye ezberleme; yağ ve A, D, E, K vitaminleri lenften dolanıp kana katılır.' },
      ),
      kart(
        'Emilen kan önce karaciğere uğrar',
        'Yemekten sonra bağırsaktan gelen kan doğrudan kalbe gitmez; kapı toplardamarıyla karaciğere girer. Karaciğer fazla glikozu glikojen olarak depolar, zararlı maddeleri süzer. Kan şekerin öğün sonrası fırlamıyorsa sebebi bu.',
      ),
      kart(
        'Su ince bağırsakta emilir, kalanı kalında',
        'Günde yaklaşık 9 litre sıvı bağırsağa girer: içtiğin su artı salgılar. Çoğunu ince bağırsak geri alır, kalın bağırsak son litreyi emer. Kalın bağırsak suyu alamazsa dışkı sulu kalır: ishal.',
      ),
    ], [
      soru('Emilimin büyük kısmı ince bağırsakta gerçekleşir.', true, 'Yüzeyi villuslarla katlanarak genişletilmiş durumda.'),
      soru('Villuslar emilim yüzeyini artırır.', true, 'Aynı uzunlukta çok daha geniş bir yüzey elde ediliyor.'),
      soru('Yağların emilen ürünleri doğrudan kan damarlarına geçer.', false, 'Önce lenf damarlarına geçiyor, oradan kana karışıyor.'),
      soru('Emilen besinler karaciğere uğramadan doğrudan hücrelere gider.', false, 'Kapı toplardamarı ile önce karaciğere uğruyorlar.'),
      sikli('Villus ve mikrovillus ne yapar?', ['Enzim salgılar', 'Emilim yüzeyini artırır'], 1, 'Yüzey yüzlerce kat büyür.'),
      sikli('Bağırsaktan gelen kan önce nereye uğrar?', ['Kalbe', 'Karaciğere'], 1, 'Fazla glikoz glikojen olur.'),
      soru('Suyun büyük kısmı kalın bağırsakta emilir.', false, 'İnce bağırsakta; kalanı kalın bağırsakta.'),
    ], [
      {
        soru: 'Yağ asitleri emildikten sonra önce nereye geçer?',
        siklar: ['Lenf sistemine', 'Doğrudan kana'],
        dogru: 0,
        aciklama: {
          dogru: 'Glikoz ve amino asitler kana, yağ ürünleri önce lenfe geçer.',
          yanlis: 'Doğrudan kana geçenler glikoz ve amino asitler. Yağ asidi ve gliserol lenf yoluyla dolaşıma katılır.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-solunum', 'Hücresel Solunum', [
      kart(
        'Solunum besindeki enerjiyi ATP\'ye çevirir',
        'Glikozun enerjisi hücreye ATP olarak lazım. Hücresel solunum, yani glikozu adım adım parçalayıp enerjisini ATP\'ye aktarmak. Oksijenli solunumda glikoz sonuna kadar parçalanır; geriye CO₂ ve su kalır. Nefes almak değil; hücrenin içinde olur.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Solunum üç evrede yürür',
        'Glikoz tek hamlede yakılmaz; üç durak var. Glikoliz sitoplazmada; sitrik asit döngüsü mitokondri matriksinde, yani iç sıvısında; elektron taşıma sistemi mitokondrinin iç zarında. ATP\'nin büyük kısmı en sonda çıkar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Glikoliz', alt: 'sitoplazma' },
            { ad: 'Sitrik asit döngüsü', alt: 'matriks' },
            { ad: 'Elektron taşıma', alt: 'iç zar', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Glikoliz glikozu ikiye böler',
        'İlk durak sitoplazmada. Altı karbonlu glikoz, üçer karbonlu iki piruvata bölünür. Oksijen gerekmez; bu yüzden oksijensiz canlılar da glikoliz yapar. Az miktarda ATP çıkar, elektron taşıyıcılar yüklenmeye başlar.',
      ),
      kart(
        'Sitrik asit döngüsü karbonu CO₂ olarak atar',
        'Piruvat mitokondriye girer ve matriksteki döngüye katılır. Her turda karbon atomları CO₂ olarak ayrılır; nefesinle verdiğin CO₂ buradan çıkıyor. Asıl kazanç ATP değil, elektronla yüklenen taşıyıcılar (NADH gibi).',
      ),
      kart(
        'ATP\'nin çoğu elektron taşıma sisteminde',
        'Yüklü taşıyıcılar elektronlarını iç zardaki zincire bırakır. Elektron zincirde ilerlerken enerjisiyle bol ATP üretilir. Zincirin sonunda elektronu oksijen alır ve su oluşur. Glikoliz birkaç ATP verir; asıl kazanç burada.',
      ),
      kart(
        'Oksijen olmazsa zincir tıkanır',
        'Oksijen, zincirin sonundaki son elektron alıcısı. Elektronları alacak kimse yoksa zincir dolar ve durur; ATP üretimi kesilir. Oksijeni bu yüzden soluyorsun: yakmak için değil, elektronları boşaltmak için.',
      ),
      kart(
        'Oksijenli solunum çok, fermantasyon az verir',
        'Bir glikozdan oksijenli solunumla yaklaşık 30 ATP çıkar. Aynı glikoz oksijensiz parçalanırsa (fermantasyon) yalnızca 2 ATP. Fark, glikozun sonuna kadar parçalanıp parçalanmamasında.',
      ),
      kart(
        'Solunum fotosentezin geri sarılması değil',
        'Fotosentez: CO₂ + su → glikoz + O₂. Solunum: glikoz + O₂ → CO₂ + su. Girenler ve çıkanlar birbirinin tersi; ama içerideki yol farklı. Fotosentez kloroplastta ışıkla, solunum mitokondride. "Biri ötekinin tersi" yalnızca denklem için doğru.',
      ),
      kart(
        'Her evreyi yeriyle eşle',
        'Sınav çoğu zaman evreyi değil yerini sorar. Glikoliz: sitoplazma. Sitrik asit döngüsü: matriks. Elektron taşıma: iç zar. CO₂ döngüde, su zincirin sonunda oluşur. Oksijen yalnızca son evrede kullanılır.',
        undefined,
        { not: 'Üç evre, üç yer: sitoplazma, matriks, iç zar. Şıkta "mitokondride glikoliz" görürsen çiz.' },
      ),
    ], [
      soru('Glikoliz sitoplazmada gerçekleşir ve oksijen gerektirmez.', true, 'Solunumun ortak ilk basamağı.'),
      soru('Oksijenli solunumda son elektron alıcısı oksijendir.', true, 'Elektronlar sonunda oksijenle birleşip su oluşturuyor.'),
      soru('Oksijenli solunumun tamamı mitokondride gerçekleşir.', false, 'İlk evre olan glikoliz sitoplazmada oluyor.'),
      soru('Oksijenli solunum, fermantasyona göre daha az ATP üretir.', false, 'Çok daha fazla üretir; glikoz tümüyle parçalanıyor.'),
      sikli('Glikoliz için oksijen gerekir mi?', ['Hayır', 'Evet'], 0, 'Sitoplazmada, oksijensiz.'),
      sikli('Sitrik asit döngüsü nerede olur?', ['Mitokondri matriksinde', 'İç zarda'], 0, 'CO₂ burada ayrılır.'),
      sikli('Elektron taşıma sisteminin son elektron alıcısı?', ['Oksijen', 'Karbondioksit'], 0, 'Su oluşur.'),
      sikli('Glikozun iki piruvata ayrılması hangi evredir?', ['Glikoliz', 'Sitrik asit döngüsü'], 0, 'Az ATP üretilir.'),
      sikli('Oksijen yoksa ATP üretimi neden durur?', ['Glikoz biter', 'Taşıma zinciri tıkanır'], 1, 'Elektronları alacak kimse kalmaz.'),
      soru('Solunum, fotosentezin aynı yolun geri sarılmasıdır.', false, 'Girenler-çıkanlar ters ama ayrı süreçler.'),
    ], [
      {
        soru: 'Oksijenli solunumda ATP\'nin büyük kısmı nerede üretilir?',
        siklar: ['Elektron taşıma sisteminde', 'Glikolizde'],
        dogru: 0,
        aciklama: {
          dogru: 'İç zardaki zincir en büyük ATP kaynağı; glikoliz yalnızca birkaç ATP verir.',
          yanlis: 'Glikoliz az ATP üretir ve oksijen istemez. Büyük kazanç mitokondri iç zarındaki elektron taşıma sisteminde.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-katilma', 'Besinlerin Solunuma Katılma Yolları', [
      kart(
        'Hücre önce karbonhidratı yakar',
        'Koşmaya başladın: kasların önce kandaki glikozu, sonra karaciğerdeki glikojeni yakar. Yağa ancak dakikalar sonra sıra gelir. Protein en son; hücre ona ancak açlıkta başvurur. Sıra: karbonhidrat → yağ → protein.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Karbonhidrat', alt: 'ilk' },
            { ad: 'Yağ' },
            { ad: 'Protein', alt: 'son çare', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Karbonhidrat en hızlı yakıttır',
        'Ekmek, pirinç, şeker: hepsi sindirimde glikoza iner. Glikoz doğrudan glikolize girer; hazırlık gerekmez. Bu yüzden şeker yiyince enerji hemen gelir. Depo hâli glikojen; karaciğer ve kasta bekler.',
      ),
      kart(
        'Yağ gramda en çok enerji verir',
        'Bir gram yağ, bir gram karbonhidratın iki katından fazla enerji taşır. Bu yüzden vücut uzun süreli depoyu yağ olarak tutar. Ama yağ önce gliserol ve yağ asidine ayrılmalı; kullanımı yavaş. Uzun yürüyüşte yağ, kısa koşuda glikoz yanar.',
      ),
      kart(
        'Protein yakılmadan önce azotu atılır',
        'Protein amino asitlere ayrılır. Amino asit yakıt olmadan önce azotlu kısmı koparılır; bu kısım amonyağa, sonra üreye dönüp idrarla atılır. Kalan iskelet solunum döngüsüne katılır. Azot yalnızca proteinde var; karbonhidrat ve yağda yok.',
      ),
      kart(
        'Protein son çare, çünkü yapı malzemesi',
        'Kas, enzim, saç, antikor: hepsi protein. Hücre proteini yakarsa kendi tuğlasını yakmış olur. Uzun açlıkta kasların erimesi tam bu. O yüzden vücut proteini ancak karbonhidrat ve yağ bitince yakıt yapar.',
        undefined,
        { not: 'Sıralamayı değil sebebini tut: protein yakıt değil, malzeme; yakılması dokunun erimesi demek.' },
      ),
      kart(
        'Üç yol aynı döngüde birleşir',
        'Glikoz, yağ asidi ve amino asit farklı kapılardan girer ama hepsi mitokondrideki aynı döngüye ulaşır. Yollar ortak olduğu için tersine de çevrilir: fazla yediğin ekmek yağa dönüp depolanır. "Yağ yemedim, kilo almam" yanlış.',
      ),
    ], [
      soru('Solunumda öncelikle karbonhidratlar kullanılır.', true, 'En hızlı ve kolay parçalanan besin grubu.'),
      soru('Yağlar gram başına karbonhidratlardan daha çok enerji verir.', true, 'Bu yüzden uzun süreli enerji deposu olarak kullanılıyorlar.'),
      soru('Proteinler enerji için ilk tercih edilen besin grubudur.', false, 'Son sırada; yapı maddesi oldukları için ancak zorunlu hâlde yakılıyorlar.'),
      soru('Yağlar ve proteinler solunuma katılmadan önce hiçbir dönüşüme uğramaz.', false, 'Ortak yola girebilmek için önce ara moleküllere dönüştürülüyorlar.'),
      sikli('Amino asitler solunuma katılırken ne ayrılır?', ['Azot', 'Karbon'], 0, 'Boşaltımla atılır.'),
      sikli('Fazla alınan karbonhidrat ne olur?', ['Yağa çevrilip depolanır', 'Boşaltımla atılır'], 0, 'Ortak yol sayesinde.'),
      soru('Gliserol ve yağ asitleri en hızlı kullanılan yakıttır.', false, 'En hızlı glikoz; yağ yavaş ama çok enerjili.'),
    ], [
      {
        soru: 'Hücre enerji için en son hangi besini kullanır?',
        siklar: ['Karbonhidrat', 'Protein'],
        dogru: 1,
        aciklama: {
          dogru: 'Protein yapı malzemesi; yakılması dokuların eritilmesi demek, o yüzden en son.',
          yanlis: 'Karbonhidrat ilk kullanılan yakıt. Sıra karbonhidrat → yağ → protein.',
        },
        kart: 1,
      },
    ]),
    konu('byl10-fermantasyon', 'Fermantasyon', [
      kart(
        'Oksijen yoksa hücre fermantasyona geçer',
        'Yüz metre koşuyorsun; kas oksijeni yetiştiremiyor. Elektron taşıma zinciri durur ama glikoliz sürebilir. Fermantasyon, yani glikolizden sonra oksijen kullanmadan devam eden kısa yol. Amaç: glikolizi çalışır tutmak.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fermantasyon dolu taşıyıcıyı boşaltır',
        'Glikoliz sürsün diye elektronla dolan taşıyıcı (NADH) boşaltılmalı. Oksijen yokken elektron piruvata verilir. Piruvat bu elektronu alınca laktik aside ya da etil alkole dönüşür. Ürün bir "çöp kutusu"; asıl iş taşıyıcıyı boşaltmak.',
      ),
      kart(
        'Laktik asit: yoğurt, turşu ve kas',
        'Sütü mayalarsın; bakteriler sütteki şekeri laktik aside çevirir, yoğurt bu yüzden ekşi. Turşuda da aynı bakteriler. Kasın da oksijen yetmeyince laktik asit yapar; yanma ve yorgunluk o yüzden. Gaz çıkmaz.',
      ),
      kart(
        'Etil alkol: maya, hamur ve CO₂',
        'Maya mantarı piruvatı etil alkol ve karbondioksite çevirir. Hamur bu CO₂ kabarcıklarıyla kabarır, alkol fırında uçar. İnsan hücresi etil alkol fermantasyonu yapamaz; kasında alkol oluşmaz.',
      ),
      kart(
        'İki yol piruvatta ayrılır',
        'Başlangıç ikisinde de aynı: glikoliz, 2 piruvat, 2 ATP. Ayrılma piruvattan sonra: bakteri ve kas laktik asit, maya alkol + CO₂ yapar. Ürün ne olursa olsun kazanılan ATP aynı: yalnızca glikolizden gelen 2.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Ürün', 'Yapan'],
          satirlar: [
            ['Laktik asit', 'Laktik asit', 'Bakteri, kas'],
            ['Alkol', 'Etanol + CO₂', 'Maya'],
          ],
        },
        { not: 'Ayrılma noktası piruvat; öncesi aynı, sonrası ürün. ATP sayısı iki yolda da eşit.' },
      ),
      kart(
        'Az ATP, hiç ATP\'den iyidir',
        'Bir glikozdan oksijenli solunum yaklaşık 30 ATP verir, fermantasyon 2. Enerjinin çoğu laktik asit ya da alkolün içinde kalır. Yine de oksijensiz ortamda tek seçenek bu ve çok hızlı işler; sprintte kasını bu kurtarır.',
      ),
    ], [
      soru('Fermantasyon, oksijenin yetersiz olduğu durumlarda gerçekleşir.', true, 'Glikoliz sonrası yol oksijensiz devam ediyor.'),
      soru('Etil alkol fermantasyonunda karbondioksit açığa çıkar.', true, 'Hamurun kabarmasının sebebi bu.'),
      soru('Fermantasyonda glikoz tümüyle parçalanır.', false, 'Kısmen parçalanır; bu yüzden elde edilen ATP çok az.'),
      soru('İnsanın kas hücrelerinde etil alkol fermantasyonu görülür.', false, 'İnsanda laktik asit fermantasyonu olur.'),
      sikli('Yoğurt hangi fermantasyonla yapılır?', ['Laktik asit', 'Etil alkol'], 0, 'Turşu da.'),
      sikli('Fermantasyonda ATP nereden gelir?', ['Yalnızca glikolizden', 'Elektron taşıma sisteminden'], 0, 'Verimi bu yüzden düşük.'),
      soru('Laktik asit ve etil alkol fermantasyonunda kazanılan ATP sayısı aynıdır.', true, 'Ayrılma piruvattan sonra.'),
    ], [
      {
        soru: 'Hamurun kabarmasını sağlayan gaz hangi fermantasyondan çıkar?',
        siklar: ['Laktik asit fermantasyonu', 'Etil alkol fermantasyonu'],
        dogru: 1,
        aciklama: {
          dogru: 'Maya piruvatı etil alkol ve CO₂\'ye çevirir; kabartan gaz CO₂.',
          yanlis: 'Laktik asit fermantasyonu gaz çıkarmaz (yoğurt, turşu). Hamurdaki CO₂ mayanın etil alkol fermantasyonundan.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-metabolizma', 'Enerji-Metabolizma İlişkisi', [
      kart(
        'Metabolizma, hücredeki tepkimelerin toplamı',
        'Şu an vücudunda binlerce kimyasal tepkime yürüyor: bir kısmı besini parçalıyor, bir kısmı yeni protein kuruyor. Bu tepkimelerin tamamına metabolizma denir. İkiye ayrılır: yıkım (katabolizma) ve yapım (anabolizma).',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Katabolizma yıkar, anabolizma kurar',
        'Solunum glikozu parçalar ve ATP verir: katabolizma, yani yıkım. Amino asitlerden kas proteini yapmak ATP harcar: anabolizma, yani yapım. Yıkım enerji verir, yapım enerji ister. İkisi aynı anda sürer.',
        {
          tur: 'tablo',
          basliklar: ['', 'Katabolizma', 'Anabolizma'],
          satirlar: [
            ['İş', 'Parçalar', 'Kurar'],
            ['Enerji', 'Verir', 'Harcar'],
            ['Örnek', 'Solunum', 'Protein sentezi'],
          ],
        },
      ),
      kart(
        'Uyurken bile enerji harcanır',
        'Yatakta hiç kıpırdamadan yat: kalbin atar, akciğerin çalışır, hücrelerin iyon pompalar, vücut sıcaklığın korunur. Hepsi ATP harcar. "Dinlenirken enerji harcamam" yanlış; hücrenin düzenini korumak bile iş.',
        undefined,
        { not: '"Dinlenirken harcamıyorum" yanılgısını kır: kalp, solunum ve pompalar uykuda da ATP yer.' },
      ),
      kart(
        'Bazal metabolizma, dinlenmenin faturası',
        'Sabah aç karnına, hareketsiz, ılık odada harcadığın enerjiye bazal metabolizma denir: yaşamı sürdürmenin en düşük faturası. Günlük enerjinin yarıdan fazlası buna gider. Yaşla düşer; erkekte genelde kadından yüksek.',
      ),
      kart(
        'Kas, yağdan çok enerji yakar',
        'Aynı kiloda iki kişi: birinin kası çok, ötekinin yağı. Kaslı olan otururken bile daha çok enerji harcar; kas dokusu dinlenirken de aktif, yağ dokusu neredeyse hiç harcamaz. Bazal metabolizmayı en çok kas kütlesi belirler.',
      ),
      kart(
        'Fazla enerji yağa gider, açık depodan çıkar',
        'Yediğin enerji harcadığından fazlaysa fark glikojen ve yağ olarak depolanır; kilo alırsın. Azsa vücut depoyu yakar; kilo verirsin. Tiroit hormonu bu harcamanın hızını ayarlar; insülin ve glukagon kan şekerini dengede tutar.',
      ),
    ], [
      soru('Anabolizma yapım, katabolizma yıkım tepkimelerini kapsar.', true, 'İkisinin toplamı metabolizmayı oluşturuyor.'),
      soru('Bazal metabolizma, dinlenme hâlinde harcanan en az enerji miktarıdır.', true, 'Solunum ve kalp atışı gibi zorunlu işler için harcanıyor.'),
      soru('Kas kütlesi arttıkça bazal metabolizma hızı düşer.', false, 'Kas dokusu enerji harcadığı için metabolizma hızı artar.'),
      soru('Uyku sırasında vücut enerji harcamaz.', false, 'Zorunlu yaşamsal işler sürdüğü için enerji harcanmaya devam ediyor.'),
      sikli('Alınan enerji harcanandan fazlaysa?', ['Atılır', 'Depolanır'], 1, 'Enerji dengesi.'),
      sikli('Metabolizma hızını hangi hormonlar belirler?', ['İnsülin', 'Tiroit hormonları'], 1, 'İnsülin kan şekeri.'),
      soru('Solunum bir anabolizma örneğidir.', false, 'Solunum parçalar ve enerji verir; katabolizma.'),
    ], [
      {
        soru: 'Bazal metabolizmayı en çok etkileyen etken hangisidir?',
        siklar: ['Kas kütlesi', 'Boy'],
        dogru: 0,
        aciklama: {
          dogru: 'Kas dinlenirken bile yağdan çok enerji harcar.',
          yanlis: 'Boy tek başına belirleyici değil; dinlenirken enerji harcayan doku kas. Kas kütlesi bazal metabolizmayı belirler.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('byl10-t2', 'Ekoloji', [
    konu('byl10-bilesen', 'Ekosistemin Bileşenleri', [
      kart(
        'Ekosistem canlı ve cansızdan kurulur',
        'Bir gölü düşün: balık, kurbağa, saz, bakteri var; bir de su, ışık, sıcaklık, çamur var. Canlılar ve cansız çevre birbirini etkiler. Ekosistem, yani bir alandaki canlılar ile cansız çevrenin kurduğu bütün. İki tür bileşen: canlı ve cansız.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Işık ve sıcaklık kimin yaşayacağını seçer',
        'Kaktüs çölde, kutup ayısı buzda. Bunu seçen şey ışık, sıcaklık, su, toprak, mineral ve pH gibi cansız etmenler. Bunlara abiyotik etmenler denir. Bir yerde hangi canlının yaşayacağını önce bunlar belirler.',
      ),
      kart(
        'Canlılar üretici, tüketici, ayrıştırıcıdır',
        'Gölde saz güneşle kendi besinini yapar: üretici. Balık sazı ya da başka balığı yer: tüketici. Ölen balığı bakteri ve mantar çürütür: ayrıştırıcı. Ayrıştırıcı olmasa ölüler yığılır, mineraller toprağa dönmez, üretici aç kalırdı.',
      ),
      kart(
        'Aynı türün bireyleri popülasyondur',
        'Gölde 400 sazan yaşıyor: bu bir popülasyon, yani aynı alanda yaşayan aynı türden bireyler. Gölün sazanı, kurbağası, sazı, bakterisi, yani bütün popülasyonlar bir arada komüniteyi kurar. Komünitede yalnızca canlılar var.',
      ),
      kart(
        'Basamaklar bireyden biyosfere büyür',
        'Bir sazan: birey. Gölün sazanları: popülasyon. Gölün bütün canlıları: komünite. Komünite artı su, ışık, çamur: ekosistem. Dünyadaki bütün ekosistemler: biyosfer. Her basamak öncekini içine alır.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Biyosfer' },
            { ad: 'Ekosistem' },
            { ad: 'Komünite' },
            { ad: 'Popülasyon' },
            { ad: 'Birey' },
          ],
        },
      ),
      kart(
        'Habitat adres, niş meslektir',
        'Sazanın habitatı, yani yaşadığı yer, gölün dibi. Nişi ise orada ne yediği, ne zaman avlandığı, kime yem olduğu: yani mesleği. İki tür aynı adreste yaşayabilir ama aynı mesleği uzun süre paylaşamaz; biri ötekini iter.',
        undefined,
        { not: 'Adres ile meslek; bu benzetme kalırsa niş sorusu bir daha yanıltmaz.' },
      ),
      kart(
        'Yayılışı en kıt kaynak sınırlar',
        'Bir tarlada ışık bol, su bol ama azot az; bitki azotun izin verdiği kadar büyür. En az bulunan kaynağa sınırlayıcı etmen denir. Bolluk değil, kıtlık sınır çizer. Fotosentez hızındaki kural burada tür yayılışına uygulanıyor.',
      ),
    ], [
      soru('Popülasyon, belirli bir alanda yaşayan aynı türden bireylerin oluşturduğu topluluktur.', true, 'Farklı popülasyonlar bir araya gelince komünite oluşuyor.'),
      soru('Habitat canlının adresi, niş ise o canlının yaptığı iştir.', true, 'İki tür aynı habitatta farklı nişlerde yaşayabiliyor.'),
      soru('Komünite, bir bölgedeki cansız etmenlerin tamamıdır.', false, 'Komünite canlı topluluklarının tamamı; cansızlar abiyotik bileşen.'),
      soru('Biyosfer, ekosistemden daha küçük bir organizasyon basamağıdır.', false, 'Biyosfer en geniş basamak; bütün ekosistemleri kapsıyor.'),
      sikli('Canlının ekosistemdeki "mesleği" nedir?', ['Habitat', 'Niş'], 1, 'Habitat adresi.'),
      sikli('Bir canlının yayılışını ne belirler?', ['En bol kaynak', 'En az bulunan kaynak'], 1, 'Sınırlayıcı etmen.'),
      sikli('Ayrıştırıcılar olmasa ne olurdu?', ['Enerji akışı dururdu', 'Madde döngüsü kapanmazdı'], 1, 'Ölü madde toprağa dönmezdi.'),
      soru('İki tür aynı nişi uzun süre paylaşabilir.', false, 'Biri ötekini dışlar ya da niş ayrışır.'),
    ], [
      {
        soru: 'Aynı alandaki bütün popülasyonların toplamına ne denir?',
        siklar: ['Komünite', 'Ekosistem'],
        dogru: 0,
        aciklama: {
          dogru: 'Komünite yalnızca canlıları sayar; cansız çevre eklenince ekosistem olur.',
          yanlis: 'Ekosistem canlılar + cansız çevre. Yalnızca popülasyonların toplamı komünite.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-etkilesim', 'Tür İçi ve Türler Arası Etkileşimler', [
      kart(
        'En sert rekabet aynı türün içinde',
        'İki aslan aynı ceylanı, aynı gölgeyi, aynı dişiyi ister; ihtiyaçları birebir aynı. Bu yüzden en şiddetli rekabet tür içinde olur. Aslan ile akbaba da leş için yarışır ama ihtiyaçları tam örtüşmez; o rekabet daha hafif.',
      ),
      kart(
        'Av ve avcı birbirini izler',
        'Tavşan çoğalınca tilki bol yer ve çoğalır. Tilki çoğalınca tavşan azalır. Tavşan azalınca tilki aç kalır ve azalır; tavşan yine çoğalır. Grafikte iki dalga var: avcı, avı biraz geriden takip eder.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'zaman',
          yAd: 'birey',
          egriler: [
            {
              noktalar: [
                [0, 2],
                [1.5, 4.6],
                [3, 2],
                [4.5, 4.6],
                [6, 2],
                [7.5, 4.6],
              ],
              ad: 'av',
            },
            {
              noktalar: [
                [0, 1],
                [1.5, 2],
                [3, 3.4],
                [4.5, 2],
                [6, 3.4],
                [7.5, 2],
              ],
              renk: 'ikincil',
              ad: 'avcı',
            },
          ],
        },
      ),
      kart(
        'İlişkiyi iki işaretle oku: kim kazanır',
        'Türler arası ilişkiyi adıyla değil işaretle düşün. Her taraf için sor: kazanıyor mu (+), kaybediyor mu (−), etkilenmiyor mu (0)? İki artı mutualizm, artı sıfır kommensalizm, artı eksi parazitlik, iki eksi rekabet.',
        {
          tur: 'tablo',
          basliklar: ['İlişki', 'A', 'B'],
          satirlar: [
            ['Mutualizm', '+', '+'],
            ['Kommensalizm', '+', '0'],
            ['Parazitlik', '+', '−'],
            ['Rekabet', '−', '−'],
          ],
        },
        { not: 'Her ilişkiyi iki işaretle yaz: kim kazanıyor, kim kaybediyor. Adlar sonra gelir.' },
      ),
      kart(
        'Mutualizmde iki taraf da kazanır',
        'Arı çiçekten bal özü alır, çiçek arı sayesinde tozlaşır: ikisi de kazandı. Baklagilin kökündeki bakteri bitkiye azot verir, bitki bakteriye şeker. Liken, yani mantar ile algin ortak yaşamı, aynı ilişki.',
      ),
      kart(
        'Kommensalizmde biri kazanır, öteki nötr',
        'Köpek balığının altında yüzen küçük balık artıkları yer; köpek balığı bundan ne kazanır ne kaybeder. Ağaç dalına tutunan orkide de öyle: ışığa yaklaşır, ağaca zarar vermez. Artı ve sıfır.',
      ),
      kart(
        'Parazit konağı yavaş yavaş sömürür',
        'Bağırsak solucanı sende yaşar, senin besininle beslenir; sen zayıflarsın, o kazanır. Parazit konağını genelde öldürmez: konak ölürse parazitin evi ve yemeği biter. Bit, kene ve tenya bu yüzden "az az" zarar verir.',
      ),
      kart(
        'Aynı nişte iki tür kalamaz',
        'İki tür aynı böceği aynı saatte aynı ağaçta avlıyorsa biri er geç kaybeder ve o alandan silinir: rekabetçi dışlama. Ya da biri gündüz, öteki gece avlanmaya başlar; niş ayrışır ve ikisi de kalır.',
      ),
    ], [
      soru('Mutualizmde iki taraf da yarar görür.', true, 'Likendeki alg ve mantar ilişkisi buna örnek.'),
      soru('Kommensalizmde bir taraf yarar görür, öteki etkilenmez.', true, 'Zarar gören taraf yok.'),
      soru('Parazit, konağını hemen öldürerek beslenir.', false, 'Konağın yaşaması parazitin de yararına; genelde yavaş zarar verir.'),
      soru('Tür içi rekabet, türler arası rekabetten daha zayıftır.', false, 'Aynı türün bireyleri aynı kaynağı istediği için tür içi rekabet daha şiddetli.'),
      sikli('Bir taraf kazanır, öteki etkilenmez: hangisi?', ['Kommensalizm', 'Parazitlik'], 0, 'Parazitlikte zarar var.'),
      sikli('En şiddetli rekabet nerededir?', ['Tür içinde', 'Türler arasında'], 0, 'Aynı kaynağı isterler.'),
      sikli('Baklagil ile azot bakterisi ilişkisi?', ['Mutualizm', 'Rekabet'], 0, 'İkisi de kazanır.'),
      soru('Parazit konağını genellikle öldürür.', false, 'Öldürürse kendi yaşamı biter.'),
    ], [
      {
        soru: 'Arı ile çiçek arasındaki ilişki hangi türdendir?',
        siklar: ['Kommensalizm', 'Mutualizm'],
        dogru: 1,
        aciklama: {
          dogru: 'Arı besin alır, çiçek tozlaşır; iki taraf da kazanır.',
          yanlis: 'Kommensalizmde bir taraf etkilenmez. Burada arı da çiçek de kazanıyor: mutualizm.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-suksesyon', 'Süksesyon', [
      kart(
        'Terk edilen tarla yavaşça ormana döner',
        'Bir tarlayı ekmeyi bırak. İlk yıl otlar, birkaç yıl sonra çalılar, on yıllar sonra ağaçlar gelir. Alandaki canlı topluluğu zamanla düzenli biçimde değişir; buna süksesyon denir. Rastgele değil, sıralı bir değişim.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Birincil süksesyon çıplak kayada başlar',
        'Volkan soğudu, ortada yalnızca kaya var; toprak yok. İlk gelen likenler, yani mantar ile algin ortak canlısı. Liken kayayı ufalar, ölünce ilk toprağı yapar. Sonra yosun, ot, çalı, ağaç. Öncü tür: liken.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Çıplak kaya' },
            { ad: 'Likenler', alt: 'öncü tür' },
            { ad: 'Otlar ve çalılar' },
            { ad: 'Ağaçlar' },
            { ad: 'Klimaks', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'İkincil süksesyon toprağın üstünde başlar',
        'Orman yandı ama toprak yerinde. Toprakta tohumlar, kökler, bakteriler zaten var. Yangın ya da terk edilmiş tarladan başlayan süksesyona bu yüzden ikincil denir. Sıfırdan değil, yarıdan başlar.',
      ),
      kart(
        'Toprak hazırsa süksesyon hızlı gider',
        'Birincil süksesyonda en uzun iş kayadan toprak yapmak; yüzyıllar sürer. İkincil süksesyon bu adımı atlar; on yıllarda orman geri gelir. Soruda önce şunu sor: toprak var mı? Varsa ikincil ve hızlı, yoksa birincil ve yavaş.',
        undefined,
        { not: 'Toprak var mı? Süksesyon sorularının çoğu bu tek soruya iniyor.' },
      ),
      kart(
        'Klimaks, değişimin durduğu son topluluk',
        'Sonunda öyle bir topluluk gelir ki türler artık yerini bırakmaz; orman ormana dönüşür. Bu kararlı son aşamaya klimaks denir. Büyük bir yangın ya da sel olmadıkça tür bileşimi sabit kalır.',
      ),
      kart(
        'Klimaksı iklim belirler',
        'Her yerde son durak orman değil. Yağış azsa bozkır, yani ot çayırı; daha da azsa çalılık ya da çöl bitkileri klimaks olur. Aynı süksesyon, farklı iklimde farklı yerde biter.',
      ),
    ], [
      soru('Birincil süksesyon, daha önce canlı barındırmamış bir alanda başlar.', true, 'Kayalık ya da yeni soğumuş lav alanı buna örnek.'),
      soru('İkincil süksesyon birincilden daha hızlı ilerler.', true, 'Toprak zaten var; sıfırdan oluşması gerekmiyor.'),
      soru('Klimaks, süksesyonun en başındaki topluluktur.', false, 'En sonda ulaşılan kararlı topluluk.'),
      soru('Klimaks topluluğu her bölgede aynıdır.', false, 'İklime göre orman, bozkır ya da çöl bitki örtüsü olabiliyor.'),
      sikli('Çıplak kayada öncü tür çoğunlukla nedir?', ['Liken', 'Ağaç'], 0, 'Birincil süksesyon.'),
      sikli('Süksesyonun kararlı son aşaması?', ['Klimaks', 'Öncü'], 0, 'Tür bileşimi değişmez.'),
      soru('Klimaks her yerde ormandır.', false, 'İklime göre çayır ya da çalılık da olabilir.'),
    ], [
      {
        soru: 'Yangından sonra başlayan süksesyon hangi türdendir?',
        siklar: ['İkincil', 'Birincil'],
        dogru: 0,
        aciklama: {
          dogru: 'Toprak duruyor, tohum ve kök kalıntısı var; hızlı ilerler.',
          yanlis: 'Birincil süksesyon toprağın hiç olmadığı çıplak kayada başlar. Yangın toprağı bırakır; bu ikincil süksesyon.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-populasyon', 'Popülasyon Dinamikleri', [
      kart(
        'Doğum ve göç sayıyı değiştirir',
        'Bir adada 100 geyik var. Yıl içinde 20 doğdu, 5 öldü, 3 yüzerek geldi, 2 gitti: yeni sayı 116. Doğum ve içe göç artırır, ölüm ve dışa göç azaltır. Popülasyon büyüklüğü bu dört sayıyla değişir.',
      ),
      kart(
        'Ortam ancak belli sayıda bireyi besler',
        'Adadaki ot ancak 300 geyiği doyurur. Geyik sayısı 300\'e yaklaştıkça büyüme yavaşlar, grafik yataylaşır. Bu sınıra taşıma kapasitesi denir. Aşılırsa ot biter, geyikler açlıktan ölür ve sayı çöker.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'zaman',
          yAd: 'birey',
          egriler: [
            {
              noktalar: [
                [0, 0.3],
                [2, 1],
                [3.5, 2.6],
                [5, 4.2],
                [7.5, 4.7],
              ],
            },
            {
              noktalar: [
                [0, 4.9],
                [7.5, 4.9],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'taşıma kap.',
            },
          ],
        },
      ),
      kart(
        'Çevre direnci büyümeyi frenler',
        'Geyik neden sonsuza kadar çoğalmıyor? Ot azalıyor, kurt artıyor, hastalık yayılıyor, kış geliyor. Büyümeyi frenleyen bu etkenlerin toplamına çevre direnci denir. Taşıma kapasitesi bu direncin çizdiği sınırdır.',
      ),
      kart(
        'Bazı etkenler kalabalıkla sertleşir',
        'Geyik çoğaldıkça ot daha çabuk biter, hastalık daha hızlı bulaşır: bunlar yoğunluğa bağlı etkenler. Kuraklık, don ve sel ise 10 geyiği de 1000 geyiği de aynı vurur: yoğunluktan bağımsız etkenler.',
        undefined,
        { not: 'Etkeni gördüğünde sor: kalabalık artınca etkisi artıyor mu? Evetse yoğunluğa bağlı.' },
      ),
      kart(
        'Yaş piramidi geleceği gösterir',
        'Popülasyonu yaşlara göre çiz: altta gençler, üstte yaşlılar. Taban genişse çok genç var, yakında üreyecekler; popülasyon büyür. Taban darsa yaşlı ağırlıklı; küçülür. Türkiye\'nin nüfus piramidi de böyle okunur.',
      ),
      kart(
        'Sayı, işaretle-yakala ile tahmin edilir',
        'Göldeki balığı tek tek sayamazsın. 50 balık yakala, işaretle, bırak. Ertesi hafta 100 balık yakala; 10\'u işaretli çıksın. İşaretli oranı onda bir; demek ki gölde yaklaşık 500 balık var. Buna işaretle-yakala yöntemi denir.',
      ),
    ], [
      soru(
        'Grafiğe göre popülasyon taşıma kapasitesine yaklaştıkça büyümesi yavaşlar.',
        true,
        'Eğri kesikli çizgiye yaklaşırken yataylaşıyor; çevre direnci artıyor.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 10],
          xAd: 'zaman',
          yAd: 'birey sayısı',
          egriler: [
            {
              noktalar: [
                [0, 0.5],
                [2, 1.2],
                [4, 3.5],
                [6, 6.5],
                [8, 7.6],
                [10, 7.9],
              ],
            },
            {
              noktalar: [
                [0, 8],
                [10, 8],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'taşıma kapasitesi',
            },
          ],
        },
      ),
      soru('Çevre direnci, popülasyonun sınırsız büyümesini engelleyen etmenlerin toplamıdır.', true, 'Besin, yer ve avcılar bu etmenlerden.'),
      soru('Salgın hastalıklar yoğunluğa bağlı olmayan bir etmendir.', false, 'Yoğunluk arttıkça bulaşma da artıyor; yoğunluğa bağlı bir etmen.'),
      soru('Geniş tabanlı yaş piramidi, küçülen bir popülasyonu gösterir.', false, 'Genç birey sayısı fazla demek; popülasyon büyüme eğiliminde.'),
      sikli('Ortamın besleyebileceği en büyük birey sayısı?', ['Çevre direnci', 'Taşıma kapasitesi'], 1, 'Aşılırsa çöker.'),
      sikli('Genç birey oranı yüksek piramit ne söyler?', ['Küçülecek', 'Popülasyon büyüyecek'], 1, 'Yaşlı ağırlıklıysa küçülür.'),
      soru('Popülasyon büyüklüğü işaretle-yakala yöntemiyle tahmin edilebilir.', true, 'Tek tek saymak çoğu zaman imkânsız.'),
    ], [
      {
        soru: 'Kuraklık popülasyonu hangi tür etkendir?',
        siklar: ['Yoğunluğa bağlı', 'Yoğunluktan bağımsız'],
        dogru: 1,
        aciklama: {
          dogru: 'Popülasyon büyük ya da küçük, kuraklık aynı şiddetle vurur.',
          yanlis: 'Yoğunluğa bağlı etkenler kalabalıkla şiddetlenir: rekabet, hastalık. Kuraklık ve don sayıya bakmaz.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-madde-enerji', 'Ekosistemde Madde ve Enerji Akışı', [
      kart(
        'Besin zinciri enerjinin izlediği yol',
        'Ot güneşle şeker yapar, çekirge otu yer, kurbağa çekirgeyi, yılan kurbağayı. Enerji üreticiden tüketiciye ok yönünde, tek yönde geçer. Besin zinciri, yani "kim kimi yer" sırası. Ayrıştırıcılar her halkanın ölüsünü çürütür.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Üretici' },
            { ad: '1. tüketici' },
            { ad: '2. tüketici' },
            { ad: 'Ayrıştırıcı', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Gerçek doğa zincir değil ağdır',
        'Kurbağa yalnız çekirge yemez; sinek de yer. Yılan kurbağa da fare de yer. Zincirler birbirine dolanınca besin ağı çıkar. Bir tür yok olunca ağ yırtılmaz ama gerilir; ağ ne kadar çok halkalıysa o kadar dayanıklı.',
      ),
      kart(
        'Her basamağa enerjinin onda biri geçer',
        'Otta 1000 birim enerji var. Çekirge bunu yer ama çoğunu hareket ve ısıya harcar; vücudunda 100 birim kalır. Kurbağa çekirgeden 10, yılan kurbağadan 1 birim alır. Her basamakta yaklaşık %10 aktarılır, %90 ısı olarak kaybolur.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Üreticiler', alt: '%100' },
            { ad: '1. tüketici', alt: '%10' },
            { ad: '2. tüketici', alt: '%1' },
            { ad: '3. tüketici', alt: '%0,1' },
          ],
        },
      ),
      kart(
        'Zincir bu yüzden 4–5 halkada biter',
        'Yılana 1 birim kaldı; onu yiyecek kartala 0,1 birim. Kartalı yiyecek bir canlıya enerji kalmaz. Basamak sayısını enerji kaybı sınırlar; zincirler dört beş halkayı geçmez. Tepedeki avcı sayısı bu yüzden hep azdır.',
      ),
      kart(
        'Enerji akar, madde döner',
        'Güneşten gelen enerji zincirde ilerler ve ısı olarak çıkar; geri dönmez. Ama karbon, azot, su gibi maddeler geri döner: ölen yılanı bakteri çürütür, karbon toprağa ve havaya geçer, ot yeniden kullanır. Enerji tek yön, madde döngü.',
        undefined,
        { not: 'Bu cümle bütün konunun özeti: enerji "döner" diyen şık yanlış, madde "akar ve tükenir" diyen şık yanlış.' },
      ),
      kart(
        'Zehir zincirde yukarı çıktıkça birikir',
        'Suya karışan cıva parçalanmıyor. Plankton azıcık alır; küçük balık binlerce plankton yer, cıvası artar; ton balığı yüzlerce küçük balık yer. Zincirin tepesindeki canlıda zehir en yoğun. Buna biyolojik birikim denir.',
      ),
      kart(
        'Bitki yemek daha çok enerji taşır',
        'Aynı tarladaki mısırı sen yersen 100 birim alırsın. Mısırı ineğe verip ineği yersen inekte yalnızca 10 birim kalmıştır. Bir basamak atlamak enerjinin %90\'ını kaybettirir; bitkisel beslenme aynı alandan on kat çok insan doyurur.',
      ),
    ], [
      soru(
        'Bir besin zincirinde enerjinin yaklaşık %10 u bir üst basamağa aktarılır.',
        true,
        'Kalanı solunum ve ısı olarak kaybediliyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Üretici' },
            { ad: 'Otçul' },
            { ad: 'Etçil' },
          ],
        },
      ),
      soru('Besin zincirinde basamak sayısının az olmasının sebebi enerji kaybıdır.', true, 'Yukarı çıkıldıkça taşınacak enerji kalmıyor.'),
      soru('Ekosistemde madde akar, enerji döner.', false, 'Tersi geçerli: enerji akar ve tükenir, madde döngülerle geri döner.'),
      soru('Biyolojik birikimde zararlı maddeler zincirin alt basamaklarında yoğunlaşır.', false, 'Üst basamaklarda yoğunlaşır; her basamakta birikerek artıyor.'),
      sikli('Ekosistemde enerji nasıl hareket eder?', ['Tek yönlü akar', 'Döngüyle döner'], 0, 'Madde döner, enerji akar.'),
      sikli('Parçalanmayan zehir zincirde ne yapar?', ['Her basamakta derişir', 'Seyrelir'], 0, 'Biyolojik birikim.'),
      sikli('Aynı alandan en çok enerjiyi kim alır?', ['Doğrudan bitkiyi tüketen', 'Etçil'], 0, 'On kat fark.'),
      soru('Gerçek ekosistemler zincir değil ağ biçimindedir.', true, 'Zincirler birbirine bağlı.'),
    ], [
      {
        soru: 'Enerji piramidinde bir basamaktan diğerine enerjinin ne kadarı geçer?',
        siklar: ['Yaklaşık %90', 'Yaklaşık %10'],
        dogru: 1,
        aciklama: {
          dogru: 'Kalan %90 ısı ve atık olarak kaybolur; bu yüzden basamak sayısı azdır.',
          yanlis: '%90 kaybolan kısım. Aktarılan yalnızca onda biri; beşinci basamağa enerji kalmamasının sebebi bu.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-dongu', 'Madde Döngüleri', [
      kart(
        'Su döngüsünü güneş çevirir',
        'Güneş denizi ısıtır, su buharlaşır. Buhar yükselince soğur ve yoğuşur, yani damlaya döner: bulut. Yağmur olarak yağar, dere olarak denize akar, yine buharlaşır. Su tükenmez, yalnızca yer ve hâl değiştirir. Motoru güneş.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Buharlaşma' },
            { ad: 'Yoğuşma' },
            { ad: 'Yağış' },
            { ad: 'Akış' },
          ],
        },
      ),
      kart(
        'Karbon havadan yaprağa, yapraktan havaya',
        'Havadaki CO₂\'yi bitki fotosentezle alır ve şekere bağlar. Sen bitkiyi yer, solunumla karbonu CO₂ olarak havaya geri verirsin. Odun yanınca da karbon havaya döner. Fotosentez alır, solunum ve yanma verir: karbon döngüsü.',
      ),
      kart(
        'Fosil yakıt gömülü karbonu havaya saldı',
        'Kömür ve petrol, milyonlarca yıl önce gömülmüş canlıların karbonu; toprağın altında kilitli duruyordu. İnsan bunları yakınca kilitli karbon CO₂ olarak havaya çıktı. Havadaki CO₂ arttı; sera etkisi ve küresel ısınma bu artıştan.',
      ),
      kart(
        'Havadaki azotu canlılar doğrudan kullanamaz',
        'Soluduğun havanın %78\'i azot; ama ne sen ne bitki onu kullanabilir. Azot molekülündeki iki atom üçlü bağla kenetli; koparmak çok zor. Bunu yalnızca bazı bakteriler ve yıldırım yapar. Buna azot bağlama denir.',
      ),
      kart(
        'Azot döngüsünü bakteriler döndürür',
        'Bağlanan azot amonyağa, sonra nitrite ve nitrata çevrilir: nitrifikasyon. Bitki nitratı alır ve protein yapar; sen bitkiyi yersin. Ölüler çürüyünce azot toprağa döner. Başka bakteriler nitratı gaza çevirip havaya yollar: denitrifikasyon.',
      ),
      kart(
        'Fosfor havaya hiç çıkmaz',
        'Karbon ve azot bir ara gaz olup havada dolaşır; fosfor olmaz. Fosfor kayada durur, kaya aşındıkça toprağa ve suya sızar, bitki alır. Gaz evresi yok; bu yüzden en yavaş döngü. Fosfor çoğu ekosistemde en kıt kaynak, yani sınırlayıcı etmen.',
        undefined,
        { not: 'Gaz evresi olmayan tek döngü fosfor; öteki döngülerden ayrıldığı yer bu ve sınav bunu soruyor.' },
      ),
      kart(
        'Dünyaya dışarıdan madde gelmez',
        'Vücudundaki karbon atomları bir zamanlar bir dinozorun, bir ağacın, bir bulutun içindeydi. Dünyaya uzaydan yeni madde gelmiyor; elimizdeki atomlar milyarlarca yıldır dönüp duruyor. Döngü olmasaydı madde ölülerde kilitlenir, yaşam dururdu.',
      ),
    ], [
      soru(
        'Su döngüsünde su tüketilir ve yeryüzündeki toplam su miktarı azalır.',
        false,
        'Döngüde su tükenmez, yalnızca hâl ve yer değiştirir.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Buharlaşma' },
            { ad: 'Yoğunlaşma' },
            { ad: 'Yağış' },
            { ad: 'Akış' },
          ],
        },
      ),
      soru('Azot, canlıların çoğu tarafından havadaki hâliyle doğrudan kullanılamaz.', true, 'Önce bakteriler tarafından bağlanması gerekiyor.'),
      soru('Fosfor döngüsünün gaz hâlinde bir aşaması yoktur.', true, 'Kayaçlardan toprağa ve suya geçerek dolaşıyor.'),
      soru('Fotosentez ve solunum karbon döngüsünün parçası değildir.', false, 'İkisi döngünün temel iki halkası.'),
      sikli('Su döngüsünü çeviren enerji?', ['Yer çekimi', 'Güneş'], 1, 'Buharlaşmayı güneş sağlar.'),
      sikli('Havadaki azotu canlılar için bağlayan?', ['Bitkiler', 'Bakteriler'], 1, 'Yıldırım da.'),
      sikli('Fosil yakıt neyi bozdu?', ['Su döngüsünü', 'Karbon dengesini'], 1, 'Kilitli karbon havaya çıktı.'),
      soru('Dünyaya dışarıdan sürekli madde gelir.', false, 'Aynı atomlar yeniden kullanılır.'),
    ], [
      {
        soru: 'Hangi döngünün gaz evresi yoktur?',
        siklar: ['Fosfor', 'Karbon'],
        dogru: 0,
        aciklama: {
          dogru: 'Fosfor kayadan toprağa geçer; bu yüzden en yavaş döngü.',
          yanlis: 'Karbon atmosferde CO₂ olarak dolaşır. Gaz evresi olmayan ve kayaların aşınmasına bağlı olan fosfor.',
        },
        kart: 6,
      },
    ]),
    konu('byl10-surdurulebilirlik', 'Ekolojik Sürdürülebilirliğin Önemi', [
      kart(
        'Kestiğin ağaç kadar ağaç büyüsün',
        'Ormandan yılda 100 ağaç kesiyorsun, orman yılda 100 ağaç büyütüyor: orman hep yerinde. 500 kesersen otuz yıla orman biter. Sürdürülebilirlik, yani kaynağı gelecek kuşaklara da kalacak biçimde, yenilenme hızını aşmadan kullanmak.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Doğa sana bedava hizmet veriyor',
        'Arı meyve ağacını tozlaştırır, orman havayı temizler, toprak suyu süzer, bakteri atığı çürütür. Bunlara ekosistem hizmetleri denir. Fatura gelmediği için bedava sanılır; ama arı yok olursa tozlaşmayı elle yapmak milyarlar tutar.',
      ),
      kart(
        'Yenilenmeden hızlı tüketince açık büyür',
        'Bankadaki paranın yalnızca faizini harcarsan para hiç bitmez; anaparayı yemeye başlarsan gitgide azalır. Balık, orman, temiz su da böyle: tüketim yenilenmeyi geçince "anapara" erir ve geri gelmesi her yıl zorlaşır.',
      ),
      kart(
        'Eşik geçilince değişim kendini hızlandırır',
        'Buzul beyazdır, güneşi yansıtır. Biraz eriyince koyu deniz açılır, deniz ısıyı emer, daha çok buz erir, daha çok deniz açılır. Belli bir eşikten sonra bu kendi kendine hızlanır ve durdurulamaz: devrilme noktası.',
        undefined,
        { not: 'Doğrusal düşünme; eşik geçilince küçük bir değişim büyük ve geri dönmez bir sonuç doğurur.' },
      ),
      kart(
        'Sürdürülebilirlik üretimi durdurmak değil',
        'Balıkçıyı yasaklamak değil, balığın çoğaldığı kadar avlatmak. Fabrikayı kapatmak değil, atığını arıtmak. Sürdürülebilirlik üretimi doğanın yenilenme hızına uydurmaktır; ekonomi ile çevre karşı karşıya değil.',
      ),
      kart(
        'Üç ayağı var: çevre, ekonomi, toplum',
        'Bir masa üç ayakta durur. Çevreyi korurken insanlar işsiz kalırsa toplum ayağı kırılır; ekonomi büyürken nehir kirlenirse çevre ayağı kırılır. Sürdürülebilirlik üçünü birlikte gözetir; biri eksikse öteki ikisi de tutmaz.',
      ),
    ], [
      soru('Ekosistem hizmetleri, doğanın insana sağladığı yararlardır.', true, 'Temiz su, tozlaşma ve iklim düzenlemesi bunlardan.'),
      soru('Devrilme noktası, geri dönüşü çok zor olan bir eşiktir.', true, 'Eşik aşılınca sistem eski hâline kolayca dönemiyor.'),
      soru('Ekolojik sürdürülebilirliğin ekonomiyle ilgisi yoktur.', false, 'Üretim doğal kaynaklara dayanıyor; kaynak tükenince ekonomi de etkileniyor.'),
      soru('Sürdürülebilirlik yalnızca çevrenin korunması demektir.', false, 'Çevre, ekonomi ve toplum olmak üzere üç ayağı var.'),
      sikli('Tozlaşma ve temiz hava nedir?', ['Ekonomik kaynak', 'Ekosistem hizmeti'], 1, 'Bedava sanılan, yerine konulamayan.'),
      sikli('Eşiği geçince kendini hızlandıran değişim?', ['Süksesyon', 'Devrilme noktası'], 1, 'Durdurmak çok zorlaşır.'),
      soru('Sürdürülebilirlik yalnızca çevreyi gözetir.', false, 'Çevre, ekonomi ve toplumsal adalet.'),
    ], [
      {
        soru: 'Sürdürülebilirlik ne demektir?',
        siklar: ['Kaynağı yenilenme hızını aşmadan kullanmak', 'Kaynağı hiç kullanmamak'],
        dogru: 0,
        aciklama: {
          dogru: 'Kullanım serbest, sınır yenilenme hızı; gelecek kuşağa da kalsın diye.',
          yanlis: 'Üretimi durdurmak değil, doğanın yenilenme hızına uydurmak. Kaynak kullanılır ama yenilenme hızı aşılmaz.',
        },
        kart: 1,
      },
    ]),
    konu('byl10-kisitlayan', 'Sürdürülebilirliği Kısıtlayan Durumlar', [
      kart(
        'Tür kaybının ilk sebebi habitat kaybı',
        'Bir orman kesilip tarla yapıldı: oradaki sincap, baykuş, mantar gidecek yer bulamaz. Habitat, yani canlının yaşadığı yer, yok olunca canlı da yok olur. Türlerin yok oluşunda bir numaralı sebep bu; avlanma değil.',
      ),
      kart(
        'Habitat bölününce popülasyon kopar',
        'Ormanın ortasından otoyol geçti. Orman hâlâ orada ama iki parça. Bir taraftaki geyik öbür tarafa geçemez; iki küçük sürü birbirinden yalıtılır. Küçük sürüde akraba çiftleşmesi artar, gen çeşitliliği düşer. Buna habitat parçalanması denir.',
      ),
      kart(
        'Işık ve gürültü de kirliliktir',
        'Fabrika dumanı havayı, atık su nehri, plastik toprağı kirletir. Ama şehir ışıkları da kirliliktir: deniz kaplumbağası yavruları ay yerine otel ışığına gider ve ölür. Gürültü kuşların ötüşünü, balinanın yönünü bozar.',
      ),
      kart(
        'Gübre suya karışınca oksijen biter',
        'Tarladaki gübre yağmurla göle iner. Göl besinle dolar, yosun patlar. Yosunlar ölür; bakteriler çürütürken suyun oksijenini tüketir. Balıklar boğulur. Buna ötrofikasyon denir: çok besinden ölen göl.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Gübre suya karışır' },
            { ad: 'Yosun patlaması' },
            { ad: 'Yosunlar ölür' },
            { ad: 'Oksijen tükenir', renk: 'ikincil' },
          ],
        },
        { not: '"Gübre iyi bir şey" diye düşünme; suya karışınca zinciri oksijenden başlatıp bozar.' },
      ),
      kart(
        'Düşmansız yabancı tür yerliyi siler',
        'Avustralya\'ya av için tavşan getirildi; orada tavşanı yiyen yoktu. Tavşan milyonlara ulaştı, otlakları bitirdi, yerli türleri açlığa itti. Doğal düşmanı olmayan yabancı türe istilacı tür denir.',
      ),
      kart(
        'Az tür, kırılgan ekosistem',
        'Bir ağda halka azaldıkça ağ zayıflar. Bir gölde beş balık türü varken biri ölürse ötekiler açığı kapatır; tek tür varken o ölürse göl çöker. Biyoçeşitlilik, yani tür sayısı, ekosistemin şoka dayanma gücüdür. Yok olan tür geri gelmez.',
      ),
      kart(
        'İklim ısınınca türler yerinden kayar',
        'Sıcaklık artınca dağdaki bitki daha yükseğe, denizdeki balık daha kuzeye kaçar. Kaçamayan, mercan gibi yerinde kalan türler ölür. Yağış düzeni değişince kuraklık ve yangın artar. İklim değişikliği bütün habitatları aynı anda değiştirir.',
      ),
    ], [
      soru('Ötrofikasyon, sulara karışan aşırı besin maddeleri yüzünden oluşur.', true, 'Aşırı üreyen algler suyun oksijenini tüketiyor.'),
      soru('İstilacı türler yerli türlerle rekabete girerek biyoçeşitliliği azaltır.', true, 'Doğal düşmanları olmadığı için hızla yayılıyorlar.'),
      soru('Habitat parçalanması, toplam alan aynı kaldığı sürece zararsızdır.', false, 'Parçalar arası geçiş kesiliyor; küçük popülasyonlar yalnız kalıp risk altına giriyor.'),
      soru('Biyoçeşitlilik kaybının başlıca sebebi doğal afetlerdir.', false, 'Başta gelen sebep habitat kaybı gibi insan kaynaklı etkiler.'),
      sikli('Tür kayıplarının en büyük sebebi?', ['Işık kirliliği', 'Habitat kaybı'], 1, 'Yaşam alanı bölünür.'),
      sikli('Yol ve yerleşimin alanı bölmesi?', ['Ötrofikasyon', 'Habitat parçalanması'], 1, 'Gen çeşitliliği düşer.'),
      sikli('Doğal düşmanı olmayan yabancı tür?', ['Endemik tür', 'İstilacı tür'], 1, 'Yerli türleri dışlar.'),
      soru('Biyoçeşitlilik kaybı geri alınabilir.', false, 'Kayıp geri alınamaz.'),
    ], [
      {
        soru: 'Gübrenin suya karışmasıyla oksijenin tükenmesine ne denir?',
        siklar: ['Habitat parçalanması', 'Ötrofikasyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Aşırı besin yosunu çoğaltır, çürüyen yosun oksijeni bitirir.',
          yanlis: 'Habitat parçalanması yol ve yerleşimle alanın bölünmesi. Sudaki besin patlaması ve oksijen kaybı ötrofikasyon.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-saglanmasi', 'Ekolojik Sürdürülebilirliğin Sağlanması', [
      kart(
        'Ayak izi, doğaya yükünü alanla ölçer',
        'Yediğin ekmek için tarla, içtiğin su için havza, attığın çöp için alan gerekir. Bunların toplamına ekolojik ayak izi denir: senin yaşamını karşılamak için gereken doğa alanı. Herkes ortalama bir Avrupalı gibi yaşasa üç Dünya gerekirdi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ayak izi günlük seçimlerle küçülür',
        'Duşu kısa tut, ışığı söndür, otobüse bin, mevsiminde ve yakından gelen sebzeyi al, kullanmayacağın şeyi alma. Her seçim tarla, su ve enerji demek. Küçültmenin ilk adımı ölçmek: kendi izini hesaplayan siteler var.',
      ),
      kart(
        'Atıkta sıra: azalt, yeniden kullan, dönüştür',
        'Plastik şişe için üç yol var. En iyisi hiç almamak: azalt. İkincisi aynı şişeyi tekrar doldurmak: yeniden kullan. En sonuncusu eritip yeni şişe yapmak: geri dönüştür. Geri dönüşüm enerji ve su ister; o yüzden en sonda.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Azalt' },
            { ad: 'Yeniden kullan' },
            { ad: 'Geri dönüştür' },
          ],
        },
        { not: 'Sırayı ezberleme, mantığını tut: hiç üretmemek, geri dönüştürmekten her zaman ucuz.' },
      ),
      kart(
        'Millî park habitatı bütün olarak korur',
        'Yalnız kaplanı korumak yetmez; kaplanın ormanı, avı, suyu da kalmalı. Millî parklar ve tabiat koruma alanları habitatı bütün hâlinde korur. Tohum bankaları ise bitki tohumlarını dondurup gen çeşitliliğini saklar; tür yok olursa yedeği var.',
      ),
      kart(
        'Koridor, bölünmüş habitatı bağlar',
        'Otoyolun böldüğü iki orman parçasını, üstünden geçen ağaçlı bir köprü ya da altından geçen tünel birleştirir. Buna ekolojik koridor denir. Geyik öbür tarafa geçer, iki sürü karışır, gen akışı sürer. Parçalanmanın panzehri.',
      ),
      kart(
        'Toprağı yormadan üretmek mümkün',
        'Her yıl aynı tarlaya buğday ekersen toprak yorulur. Bir yıl buğday, bir yıl baklagil ekersen (nöbetleşe ekim) baklagil toprağa azot katar. Damla sulama suyu doğrudan köke verir. Zararlıyı ilaç yerine avcı böcekle yenmek: biyolojik mücadele.',
      ),
      kart(
        'Bireysel çaba gerekli ama yetmez',
        'Sen duşu kısaltırken bir fabrika bir dakikada bin duşluk su harcıyor. Bireysel çaba önemli; ama enerjinin nereden geldiğini ve fabrikaların nasıl üreteceğini politikalar belirler. Asıl fark üretim ve enerji politikalarında çıkar.',
      ),
    ], [
      soru('Ekolojik ayak izi, doğaya bindirdiğimiz yükün ölçüsüdür.', true, 'Tükettiğimizi karşılamak için gereken alanı gösteriyor.'),
      soru('Ekolojik koridorlar, parçalanmış habitatlar arasında geçiş sağlar.', true, 'Popülasyonların birbirine karışmasını sürdürüyor.'),
      soru('Atık yönetiminde ilk basamak geri dönüşümdür.', false, 'İlk basamak atığı hiç oluşturmamak; geri dönüşüm sonra geliyor.'),
      soru('Bireysel önlemler tek başına ekolojik sürdürülebilirliği sağlar.', false, 'Bireysel çaba gerekli ama üretim ve politika düzeyinde karar alınmadan yetmiyor.'),
      sikli('Parçalanmış habitatları bağlayan şerit?', ['Ekolojik koridor', 'Tohum bankası'], 0, 'Gen akışını sürdürür.'),
      sikli('Nöbetleşe ekim ve damla sulama neye örnektir?', ['Sürdürülebilir tarım', 'Atık yönetimi'], 0, 'Toprağı yormadan üretim.'),
      sikli('Asıl fark nerede ortaya çıkar?', ['Üretim ve enerji politikalarında', 'Bireysel çabada'], 0, 'Bireysel çaba önemli ama yetmez.'),
      soru('Ekolojik ayak izini küçültmenin ilk adımı ölçmektir.', true, 'Ölçmeden azaltılamaz.'),
    ], [
      {
        soru: 'Atık yönetiminde ilk sırada ne gelir?',
        siklar: ['Azaltmak', 'Geri dönüştürmek'],
        dogru: 0,
        aciklama: {
          dogru: 'Oluşmayan atığın maliyeti sıfır; geri dönüşüm son çare.',
          yanlis: 'Geri dönüşüm enerji ve su ister, sıranın en sonunda. Önce azalt, sonra yeniden kullan, en son geri dönüştür.',
        },
        kart: 3,
      },
    ]),
  ]),
])
