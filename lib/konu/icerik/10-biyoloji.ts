import { kart, konu, program, soru, tema } from '../tip'

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
        'Neden ATP, doğrudan besin değil?',
        'Besindeki enerji büyük ve kullanışsız bir paketti. ATP, hücrenin her işine yetecek büyüklükte bozuk paradır.',
      ),
    ], [
      soru('ATP, hücrenin doğrudan kullanabildiği enerji molekülüdür.', true, 'Besindeki enerji önce ATP ye çevriliyor.'),
      soru('Hücre, ihtiyaç duyacağı ATP yi büyük miktarlarda depolar.', false, 'ATP depolanmaz; ihtiyaç oldukça üretiliyor.'),
      soru('Besinlerdeki enerji kimyasal bağlarda saklıdır.', true, 'Bağlar koparıldıkça enerji açığa çıkıyor.'),
      soru('ATP kullanıldığında geri dönüşü olmayacak biçimde yok olur.', false, 'ADP ye dönüşür ve yeniden ATP ye çevrilir; süreç bir döngü.'),
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
        'Özet denklem',
        'Karbondioksit ve su, ışık enerjisiyle glikoz ve oksijene dönüşür. Kloroplastta gerçekleşir.',
      ),
      kart(
        'İki evre',
        'Fotosentez iki basamakta yürür ve ikincisi doğrudan birincinin ürünleriyle çalışır.',
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
        'Işığın kullanıldığı tepkimeler',
        'Tilakoit zarda olur. Su parçalanır (fotoliz), oksijen açığa çıkar, ATP ve NADPH üretilir.',
      ),
      kart(
        'Işığın kullanılmadığı tepkimeler',
        'Stromada geçen Calvin döngüsü. Karbondioksit, ışık tepkimelerinin ürettiği enerjiyle glikoza bağlanır.',
      ),
      kart(
        'Oksijen sudan gelir',
        'Açığa çıkan oksijenin kaynağı karbondioksit değil, parçalanan sudur. Bu, izotoplu deneylerle gösterildi.',
      ),
      kart(
        'Pigmentler',
        'Klorofil ışığın kırmızı ve mavisini soğurur, yeşili yansıtır. Yaprakların yeşil görünmesi bundandır.',
      ),
      kart(
        'Hızını etkileyen etmenler',
        'Işık, karbondioksit ve sıcaklık artarken hız bir noktaya kadar yükselir, sonra sabitlenir.',
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
        'Sınırlayıcı etmen',
        'Hız her zaman en yetersiz olan etmene takılır. Işığı artırmak, karbondioksit azsa hızı artırmaz.',
      ),
      kart(
        'Neden hayati?',
        'Atmosferdeki oksijenin ve besin zincirindeki enerjinin neredeyse tamamının kaynağı fotosentezdir.',
      ),
      kart(
        'Sık sorulan kalıp',
        'Işık tepkimeleri gündüz, karanlık tepkimeleri ışığa doğrudan bağlı değil ama ATP ve NADPH bitince durur; yani gece uzun sürmez.',
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
        'İki süreç de üretici; ayrıldıkları yer enerji kaynağı ve yan üründür.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fotosentez', 'Kemosentez'],
          satirlar: [
            ['Enerji', 'Işık', 'Kimyasal bağ'],
            ['Yapan', 'Bitki, alg', 'Bakteri'],
            ['Oksijen', 'Çıkar', 'Çıkmaz'],
          ],
        },
      ),
      kart(
        'Döngülerdeki rolü',
        'Azot döngüsündeki nitrit ve nitrat bakterileri kemosentez yapar; toprağın verimliliği buna bağlıdır.',
      ),
      kart(
        'Ortak nokta',
        'Kemosentez de fotosentez gibi CO₂\'yi organik besine çevirir; fark yalnızca enerjinin ışıktan değil inorganik maddenin oksidasyonundan gelmesi.',
      ),
    ], [
      soru('Kemosentez yapan canlılar enerjiyi kimyasal maddeleri yükseltgeyerek sağlar.', true, 'Işığa ihtiyaç duymuyorlar.'),
      soru('Kemosentezi bazı bakteri ve arkeler yapar.', true, 'Bitkiler kemosentez yapmaz.'),
      soru('Kemosentezin gerçekleşmesi için ışık gereklidir.', false, 'Işık gerekmez; okyanus tabanındaki karanlıkta da yapılıyor.'),
      soru('Azot döngüsünde kemosentetik bakterilerin bir rolü yoktur.', false, 'Nitrifikasyon bakterileri bu döngünün temel halkası.'),
    ], [
      {
        soru: 'Kemosentez yapan canlılar enerjiyi nereden alır?',
        siklar: ['Kimyasal tepkimelerden', 'Güneş ışığından'],
        dogru: 0,
        aciklama: {
          dogru: 'Amonyak, kükürt ya da demir bileşiklerini yükseltgeyerek enerji elde ederler.',
          yanlis: 'Işık fotosentezin enerjisi. Kemosentez ışıksız ortamda, inorganik maddelerin oksidasyonundan enerji alır.',
        },
        kart: 1,
      },
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
      kart(
        'Neden ikisi birden?',
        'Enzim yalnızca yüzeyde çalışır. Mekanik sindirim yüzeyi büyütmeseydi kimyasal sindirim çok yavaş kalırdı.',
      ),
      kart(
        'Hidroliz',
        'Kimyasal sindirimin tamamı su eklenerek bağ koparmadır; bu yüzden sindirime hidroliz de denir.',
      ),
    ], [
      soru('Sindirim, büyük moleküllerin hücre zarından geçebilecek küçüklüğe getirilmesidir.', true, 'Bu olmadan besin hücreye giremiyor.'),
      soru('Kimyasal sindirim hidroliz tepkimeleriyle gerçekleşir.', true, 'Bağların koparılmasında su kullanılıyor.'),
      soru('Mekanik sindirimde besinin kimyasal yapısı değişir.', false, 'Yalnızca parçalara ayrılır; yapı aynı kalır.'),
      soru('Hücre içi sindirim yalnızca çok hücreli canlılarda görülür.', false, 'Tek hücrelilerin temel sindirim yolu bu.'),
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
        'Gelişim çizgisi',
        'Sindirim yapıları basitten karmaşığa doğru uzmanlaşır; her adımda daha çok besin daha verimli işlenir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Koful' },
            { ad: 'Tek açıklık' },
            { ad: 'İki açıklık' },
            { ad: 'Uzman organlar' },
          ],
        },
      ),
      kart(
        'Otçul ve etçillerde',
        'Otçulların bağırsağı uzun ve selüloz sindirimi için mikroplu; etçillerin bağırsağı kısadır.',
      ),
      kart(
        'Geviş getirenler',
        'Dört bölmeli midede bakteriler selülozu parçalar. Hayvan selülozu kendi enzimiyle sindiremez.',
      ),
    ], [
      soru('Sölenterelerde sindirim boşluğunun tek açıklığı vardır.', true, 'Ağız aynı zamanda atık çıkışı olarak kullanılıyor.'),
      soru('Toprak solucanında ağızdan anüse uzanan tam bir sindirim kanalı bulunur.', true, 'Besin tek yönde ilerliyor.'),
      soru('Otçul hayvanlarda sindirim kanalı etçillere göre kısadır.', false, 'Selüloz zor sindirildiği için otçullarda kanal daha uzun.'),
      soru('Geviş getirenler selülozu kendi enzimleriyle sindirir.', false, 'Midelerindeki mikroorganizmalar sindiriyor.'),
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
        'Nerede ne sindirilir?',
        'Üç besin grubunun sindirimi farklı yerlerde başlar ama üçü de ince bağırsakta biter.',
        {
          tur: 'tablo',
          basliklar: ['Besin', 'Başlar', 'Biter'],
          satirlar: [
            ['Karbonhidrat', 'Ağız', 'İnce bağırsak'],
            ['Protein', 'Mide', 'İnce bağırsak'],
            ['Yağ', 'İnce bağırsak', 'İnce bağırsak'],
          ],
        },
      ),
      kart(
        'Safranın işi',
        'Enzim değildir; yağ damlalarını küçültüp (emülsiyon) enzimlerin ulaşacağı yüzeyi artırır.',
      ),
      kart(
        'Mide kendini neden sindirmez?',
        'Mukus tabakası asidi yüzeyden uzak tutar ve pepsin etkisiz bir öncül olarak salgılanır.',
      ),
      kart(
        'Kalın bağırsakta',
        'Sindirim olmaz. Su ve mineral emilir; bağırsak florası bazı vitaminleri üretir.',
      ),
      kart(
        'Enzim tablosu',
        'Amilaz nişasta (ağız, ince bağırsak); pepsin protein (mide); lipaz yağ (ince bağırsak); tripsin protein (pankreastan ince bağırsağa).',
      ),
    ], [
      soru('Karbonhidratların kimyasal sindirimi ağızda başlar.', true, 'Tükürükteki amilaz nişastayı parçalamaya başlıyor.'),
      soru('Proteinlerin kimyasal sindirimi midede başlar.', true, 'Pepsin asidik ortamda çalışıyor.'),
      soru('Safra, yağları kimyasal olarak sindirir.', false, 'Safra enzim değil; yağı küçük damlacıklara ayırarak mekanik sindirim yapıyor.'),
      soru('Sindirimin tamamlandığı yer kalın bağırsaktır.', false, 'Sindirim ince bağırsakta tamamlanır; kalın bağırsakta su ve mineral emiliyor.'),
    ], [
      {
        soru: 'Safra ne yapar?',
        siklar: ['Yağı emülsiyon hâline getirir', 'Yağı kimyasal olarak sindirir'],
        dogru: 0,
        aciklama: {
          dogru: 'Safra enzim değil; yağ damlalarını küçültüp lipazın çalışacağı yüzeyi artırır.',
          yanlis: 'Kimyasal sindirimi lipaz yapar. Safra enzim içermez, yalnızca yağı küçük damlalara ayırır.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-emilim', 'Emilim ve Taşınma', [
      kart(
        'Nerede olur?',
        'Büyük ölçüde ince bağırsakta. Villus ve mikrovilluslar emilim yüzeyini kat kat artırır.',
      ),
      kart(
        'Neden yüzey önemli?',
        'Emilim yüzeyde olur. Kıvrımlar, villuslar ve mikrovilluslar bağırsağın iç yüzeyini yüzlerce kat büyütür.',
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
      kart(
        'Su nerede emilir?',
        'Suyun büyük kısmı ince bağırsakta, kalanı kalın bağırsakta emilir. Emilim bozulursa ishal görülür.',
      ),
    ], [
      soru('Emilimin büyük kısmı ince bağırsakta gerçekleşir.', true, 'Yüzeyi villuslarla katlanarak genişletilmiş durumda.'),
      soru('Villuslar emilim yüzeyini artırır.', true, 'Aynı uzunlukta çok daha geniş bir yüzey elde ediliyor.'),
      soru('Yağların emilen ürünleri doğrudan kan damarlarına geçer.', false, 'Önce lenf damarlarına geçiyor, oradan kana karışıyor.'),
      soru('Emilen besinler karaciğere uğramadan doğrudan hücrelere gider.', false, 'Kapı toplardamarı ile önce karaciğere uğruyorlar.'),
    ], [
      {
        soru: 'Yağ asitleri emildikten sonra önce nereye geçer?',
        siklar: ['Lenf sistemine', 'Doğrudan kana'],
        dogru: 0,
        aciklama: {
          dogru: 'Glikoz ve amino asitler kana, yağ ürünleri önce lenfe geçer.',
          yanlis: 'Doğrudan kana geçenler glikoz ve amino asitler. Yağ asidi ve gliserol lenf yoluyla dolaşıma katılır.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-solunum', 'Hücresel Solunum', [
      kart(
        'Ne yapar?',
        'Besindeki kimyasal enerjiyi ATP’ye çevirir. Oksijenli solunumda son ürünler karbondioksit ve sudur.',
      ),
      kart(
        'Üç evre',
        'Her evre farklı yerde geçer ve ATP’nin büyük kısmı sonuncusunda üretilir.',
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
        'Oksijen neden şart?',
        'Elektronları en sonda alacak biri yoksa taşıma zinciri tıkanır ve ATP üretimi durur.',
      ),
      kart(
        'Verim',
        'Bir glikozdan oksijenli solunumla çok sayıda ATP elde edilir; fermantasyonda bu sayı çok küçüktür.',
      ),
      kart(
        'Fotosentezin tersi mi?',
        'Girenler ve çıkanlar birbirinin tersi ama tepkimeler aynı yolun geri sarılması değil, ayrı süreçlerdir.',
      ),
      kart(
        'Nerede ne oluyor?',
        'Glikoliz sitoplazmada, sitrik asit döngüsü matrikste, elektron taşıma iç zarda. CO₂ döngüde, H₂O zincirin sonunda oluşur.',
      ),
    ], [
      soru('Glikoliz sitoplazmada gerçekleşir ve oksijen gerektirmez.', true, 'Solunumun ortak ilk basamağı.'),
      soru('Oksijenli solunumda son elektron alıcısı oksijendir.', true, 'Elektronlar sonunda oksijenle birleşip su oluşturuyor.'),
      soru('Oksijenli solunumun tamamı mitokondride gerçekleşir.', false, 'İlk evre olan glikoliz sitoplazmada oluyor.'),
      soru('Oksijenli solunum, fermantasyona göre daha az ATP üretir.', false, 'Çok daha fazla üretir; glikoz tümüyle parçalanıyor.'),
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
        'Öncelik sırası',
        'Hücre önce karbonhidratı kullanır, sonra yağı; protein en son başvurulan kaynaktır.',
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
      kart(
        'Neden protein son?',
        'Protein aynı zamanda yapı ve enzim malzemesidir; yakıt olarak kullanılması dokuların eritilmesi demektir.',
      ),
      kart(
        'Ortak yol',
        'Üç besin de sonunda aynı döngüye girer. Bu yüzden fazla alınan karbonhidrat da yağa çevrilip depolanabilir.',
      ),
    ], [
      soru('Solunumda öncelikle karbonhidratlar kullanılır.', true, 'En hızlı ve kolay parçalanan besin grubu.'),
      soru('Yağlar gram başına karbonhidratlardan daha çok enerji verir.', true, 'Bu yüzden uzun süreli enerji deposu olarak kullanılıyorlar.'),
      soru('Proteinler enerji için ilk tercih edilen besin grubudur.', false, 'Son sırada; yapı maddesi oldukları için ancak zorunlu hâlde yakılıyorlar.'),
      soru('Yağlar ve proteinler solunuma katılmadan önce hiçbir dönüşüme uğramaz.', false, 'Ortak yola girebilmek için önce ara moleküllere dönüştürülüyorlar.'),
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
        'İkisinin karşılaştırması',
        'Başlangıç aynı, ayrılma piruvattan sonra. Ürün ne olursa olsun kazanılan ATP sayısı değişmez.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Ürün', 'Yapan'],
          satirlar: [
            ['Laktik asit', 'Laktik asit', 'Bakteri, kas'],
            ['Alkol', 'Etanol + CO₂', 'Maya'],
          ],
        },
      ),
      kart(
        'Verimi düşük',
        'Yalnızca glikolizden gelen az sayıda ATP üretilir; besindeki enerjinin çoğu ürün içinde kalır.',
      ),
      kart(
        'Neden hâlâ yapılır?',
        'Az ATP hiç ATP’den iyidir. Oksijensiz ortamda tek seçenek budur ve çok hızlı işler.',
      ),
    ], [
      soru('Fermantasyon, oksijenin yetersiz olduğu durumlarda gerçekleşir.', true, 'Glikoliz sonrası yol oksijensiz devam ediyor.'),
      soru('Etil alkol fermantasyonunda karbondioksit açığa çıkar.', true, 'Hamurun kabarmasının sebebi bu.'),
      soru('Fermantasyonda glikoz tümüyle parçalanır.', false, 'Kısmen parçalanır; bu yüzden elde edilen ATP çok az.'),
      soru('İnsanın kas hücrelerinde etil alkol fermantasyonu görülür.', false, 'İnsanda laktik asit fermantasyonu olur.'),
    ], [
      {
        soru: 'Hamurun kabarmasını sağlayan gaz hangi fermantasyondan çıkar?',
        siklar: ['Laktik asit fermantasyonu', 'Etil alkol fermantasyonu'],
        dogru: 1,
        aciklama: {
          dogru: 'Maya piruvatı etil alkol ve CO₂\'ye çevirir; kabartan gaz CO₂.',
          yanlis: 'Laktik asit fermantasyonu gaz çıkarmaz (yoğurt, turşu). Hamurdaki CO₂ mayanın etil alkol fermantasyonundan.',
        },
        kart: 3,
      },
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
      kart(
        'Kas kütlesi ve metabolizma',
        'Kas dokusu dinlenirken bile yağ dokusundan çok enerji harcar; bazal metabolizmayı en çok etkileyen etken budur.',
      ),
      kart(
        'Metabolizma hormonlarla ayarlanır',
        'Tiroit hormonları hızı belirler; insülin ve glukagon kan şekerini dengede tutar.',
      ),
    ], [
      soru('Anabolizma yapım, katabolizma yıkım tepkimelerini kapsar.', true, 'İkisinin toplamı metabolizmayı oluşturuyor.'),
      soru('Bazal metabolizma, dinlenme hâlinde harcanan en az enerji miktarıdır.', true, 'Solunum ve kalp atışı gibi zorunlu işler için harcanıyor.'),
      soru('Kas kütlesi arttıkça bazal metabolizma hızı düşer.', false, 'Kas dokusu enerji harcadığı için metabolizma hızı artar.'),
      soru('Uyku sırasında vücut enerji harcamaz.', false, 'Zorunlu yaşamsal işler sürdüğü için enerji harcanmaya devam ediyor.'),
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
        'Cansız bileşenler',
        'Işık, sıcaklık, su, toprak, mineraller ve pH. Hangi canlının nerede yaşayacağını büyük ölçüde bunlar belirler.',
      ),
      kart(
        'Canlı bileşenler',
        'Üreticiler, tüketiciler ve ayrıştırıcılar. Ayrıştırıcılar olmasa madde döngüsü kapanmazdı.',
      ),
      kart(
        'Organizasyon basamakları',
        'Ekoloji bireyden başlayıp biyosfere kadar iç içe basamaklarda çalışır.',
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
      kart(
        'Sınırlayıcı etmen',
        'Bir canlının yayılışını, en az bulunan kaynak belirler. Bolluk değil, kıtlık sınırı çizer.',
      ),
    ], [
      soru('Popülasyon, belirli bir alanda yaşayan aynı türden bireylerin oluşturduğu topluluktur.', true, 'Farklı popülasyonlar bir araya gelince komünite oluşuyor.'),
      soru('Habitat canlının adresi, niş ise o canlının yaptığı iştir.', true, 'İki tür aynı habitatta farklı nişlerde yaşayabiliyor.'),
      soru('Komünite, bir bölgedeki cansız etmenlerin tamamıdır.', false, 'Komünite canlı topluluklarının tamamı; cansızlar abiyotik bileşen.'),
      soru('Biyosfer, ekosistemden daha küçük bir organizasyon basamağıdır.', false, 'Biyosfer en geniş basamak; bütün ekosistemleri kapsıyor.'),
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
        'Tür içi rekabet',
        'Aynı türün bireyleri aynı kaynağı istediği için en şiddetli rekabet tür içinde olur.',
      ),
      kart(
        'Av-avcı ilişkisi',
        'Avcı av popülasyonunu dengeler; av azalınca avcı da azalır. İki popülasyon birbirini izler.',
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
        'Etkileşimlerin haritası',
        'Türler arası ilişkiler, iki tarafın kazanıp kaybetmesine göre adlandırılır.',
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
      kart(
        'Rekabetçi dışlama',
        'Aynı nişi paylaşan iki türden biri ötekini eninde sonunda o alandan uzaklaştırır ya da niş ayrışır.',
      ),
    ], [
      soru('Mutualizmde iki taraf da yarar görür.', true, 'Likendeki alg ve mantar ilişkisi buna örnek.'),
      soru('Kommensalizmde bir taraf yarar görür, öteki etkilenmez.', true, 'Zarar gören taraf yok.'),
      soru('Parazit, konağını hemen öldürerek beslenir.', false, 'Konağın yaşaması parazitin de yararına; genelde yavaş zarar verir.'),
      soru('Tür içi rekabet, türler arası rekabetten daha zayıftır.', false, 'Aynı türün bireyleri aynı kaynağı istediği için tür içi rekabet daha şiddetli.'),
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
        'Tanımı',
        'Bir alandaki canlı topluluğunun zamanla düzenli biçimde değişmesi.',
      ),
      kart(
        'Birincil süksesyon',
        'Toprağın hiç olmadığı yerde başlar: lav akıntısı ya da çıplak kaya. Öncü tür çoğunlukla likenlerdir.',
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
        'İkincil süksesyon',
        'Toprak varken başlar: yangın ya da terk edilmiş tarla. Birincilden çok daha hızlı ilerler.',
      ),
      kart(
        'Neden ikincisi hızlı?',
        'Toprak zaten var ve içinde tohum ile kök kalıntıları duruyor; en uzun adım olan toprak oluşumu atlanmış olur.',
      ),
      kart(
        'Klimaks',
        'Süksesyonun kararlı son aşaması. Tür bileşimi artık büyük ölçüde değişmez.',
      ),
      kart(
        'Klimaks bölgeye göre değişir',
        'Aynı süksesyon ormanla değil, iklime göre çayır ya da çalılıkla da bitebilir. Son durağı iklim belirler.',
      ),
    ], [
      soru('Birincil süksesyon, daha önce canlı barındırmamış bir alanda başlar.', true, 'Kayalık ya da yeni soğumuş lav alanı buna örnek.'),
      soru('İkincil süksesyon birincilden daha hızlı ilerler.', true, 'Toprak zaten var; sıfırdan oluşması gerekmiyor.'),
      soru('Klimaks, süksesyonun en başındaki topluluktur.', false, 'En sonda ulaşılan kararlı topluluk.'),
      soru('Klimaks topluluğu her bölgede aynıdır.', false, 'İklime göre orman, bozkır ya da çöl bitki örtüsü olabiliyor.'),
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
        'Büyümeyi belirleyenler',
        'Doğum ve içe göç sayıyı artırır; ölüm ve dışa göç azaltır.',
      ),
      kart(
        'Taşıma kapasitesi',
        'Ortamın sürekli besleyebileceği en büyük birey sayısı. Aşılırsa popülasyon çöker.',
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
        'Çevre direnci',
        'Büyümeyi sınırlayan etkenlerin tamamı: besin kıtlığı, rekabet, avcı, hastalık.',
      ),
      kart(
        'Yoğunluğa bağlı ve bağımsız',
        'Rekabet ve hastalık kalabalıkla şiddetlenir; kuraklık ve don ise popülasyon büyüklüğünden bağımsız etkiler.',
      ),
      kart(
        'Yaş piramidi',
        'Genç birey oranı yüksekse popülasyon büyüyecek, yaşlı ağırlıklıysa küçülecek demektir.',
      ),
      kart(
        'Popülasyon büyüklüğü nasıl ölçülür?',
        'Tek tek saymak çoğu zaman imkânsız; işaretle-yakala yöntemiyle örneklemden tahmin edilir.',
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
        'Besin zinciri',
        'Üreticiden tüketiciye doğru tek yönlü enerji aktarımı. Ayrıştırıcılar her basamağa bağlanır.',
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
        'Besin ağı',
        'Zincirlerin birbirine bağlanmış hâli. Gerçek ekosistemler zincir değil ağ biçimindedir.',
      ),
      kart(
        'Enerji piramidi',
        'Her basamakta enerjinin yaklaşık onda biri aktarılır; kalanı ısı olarak kaybolur.',
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
        'Neden basamak azdır?',
        'Her adımda enerjinin çoğu kaybolduğu için beşinci basamağa yetecek enerji kalmaz.',
      ),
      kart(
        'Enerji akar, madde döner',
        'Enerji güneşten gelir ve ısı olarak çıkar; madde ise döngülerle sürekli yeniden kullanılır.',
      ),
      kart(
        'Biyolojik birikim',
        'Parçalanmayan zehirler her basamakta derişir. En büyük zararı zincirin tepesindeki tür görür.',
      ),
      kart(
        'Neden bitkisel beslenme verimli?',
        'Aynı alandan doğrudan bitki tüketmek, o bitkiyle beslenen hayvanı tüketmekten on kat çok enerji sağlar.',
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
        'Su döngüsü',
        'Buharlaşma, yoğuşma, yağış ve akış. Güneş enerjisi döngüyü çeviren motordur.',
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
        'Karbon döngüsü',
        'Fotosentez karbonu havadan alır, solunum ve yanma geri verir. Fosil yakıtlar dengeyi bozdu.',
      ),
      kart(
        'Karbon depoları',
        'Atmosfer, okyanuslar, canlılar, toprak ve fosil yakıtlar. Fosil yakıt milyonlarca yıl kilitli kalmış karbondur.',
      ),
      kart(
        'Azot döngüsü',
        'Havadaki azotu canlılar doğrudan kullanamaz; bakteriler bağlar, nitrifikasyon ve denitrifikasyon çevrimi tamamlar.',
      ),
      kart(
        'Neden azot bağlanmalı?',
        'Atmosferin dörtte üçü azot ama moleküldeki üçlü bağ çok güçlü; onu koparabilen yalnızca bazı bakteriler ve yıldırımdır.',
      ),
      kart(
        'Fosfor döngüsü',
        'Gaz evresi yoktur; kayaların aşınmasıyla toprağa geçer. Bu yüzden en yavaş döngüdür ve çoğu zaman sınırlayıcıdır.',
      ),
      kart(
        'Neden döngü şart?',
        'Dünyaya dışarıdan madde gelmiyor. Elimizdeki atomlar sürekli yeniden kullanılıyor.',
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
        'Devrilme noktası',
        'Bazı değişimler belirli bir eşiği geçince kendini hızlandırır; o noktadan sonra durdurmak çok daha zordur.',
      ),
      kart(
        'Ekonomiyle ilişkisi',
        'Sürdürülebilirlik üretimi durdurmak değil, üretimi doğanın yenilenme hızına uydurmaktır.',
      ),
      kart(
        'Üç ayak',
        'Sürdürülebilirlik çevre, ekonomi ve toplumsal adaleti birlikte gözetir; biri gözetilmezse öteki ikisi de tutmaz.',
      ),
    ], [
      soru('Ekosistem hizmetleri, doğanın insana sağladığı yararlardır.', true, 'Temiz su, tozlaşma ve iklim düzenlemesi bunlardan.'),
      soru('Devrilme noktası, geri dönüşü çok zor olan bir eşiktir.', true, 'Eşik aşılınca sistem eski hâline kolayca dönemiyor.'),
      soru('Ekolojik sürdürülebilirliğin ekonomiyle ilgisi yoktur.', false, 'Üretim doğal kaynaklara dayanıyor; kaynak tükenince ekonomi de etkileniyor.'),
      soru('Sürdürülebilirlik yalnızca çevrenin korunması demektir.', false, 'Çevre, ekonomi ve toplum olmak üzere üç ayağı var.'),
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
        'Habitat kaybı',
        'Tür kayıplarının en büyük sebebi. Yaşam alanı bölününce popülasyonlar birbirinden kopar ve küçülür.',
      ),
      kart(
        'Habitat parçalanması',
        'Yol ve yerleşim bir alanı böldüğünde küçük popülasyonlar birbirinden yalıtılır ve gen çeşitliliği düşer.',
      ),
      kart(
        'Kirlilik',
        'Hava, su ve toprak kirliliği; ayrıca ışık ve gürültü kirliliği canlıların davranışını bozar.',
      ),
      kart(
        'Ötrofikasyon',
        'Sulara karışan gübre yosunu aşırı çoğaltır; ölen yosunlar çürürken oksijen tükenir ve balıklar ölür.',
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
      ),
      kart(
        'İstilacı türler',
        'Doğal düşmanı olmayan bir tür yeni ortamda hızla çoğalır ve yerli türleri dışlar.',
      ),
      kart(
        'Biyoçeşitlilik kaybı',
        'Tür azaldıkça ekosistemin şoklara dayanma gücü düşer. Kayıp geri alınamaz.',
      ),
      kart(
        'İklim değişikliği',
        'Sıcaklık ve yağış düzeni değişince türlerin yayılış alanı kayar; uyum sağlayamayanlar yok olur.',
      ),
    ], [
      soru('Ötrofikasyon, sulara karışan aşırı besin maddeleri yüzünden oluşur.', true, 'Aşırı üreyen algler suyun oksijenini tüketiyor.'),
      soru('İstilacı türler yerli türlerle rekabete girerek biyoçeşitliliği azaltır.', true, 'Doğal düşmanları olmadığı için hızla yayılıyorlar.'),
      soru('Habitat parçalanması, toplam alan aynı kaldığı sürece zararsızdır.', false, 'Parçalar arası geçiş kesiliyor; küçük popülasyonlar yalnız kalıp risk altına giriyor.'),
      soru('Biyoçeşitlilik kaybının başlıca sebebi doğal afetlerdir.', false, 'Başta gelen sebep habitat kaybı gibi insan kaynaklı etkiler.'),
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
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Azalt' },
            { ad: 'Yeniden kullan' },
            { ad: 'Geri dönüştür' },
          ],
        },
      ),
      kart(
        'Korunan alanlar',
        'Millî parklar ve tabiat koruma alanları habitatı bütün hâlinde korur; tohum bankaları gen çeşitliliğini saklar.',
      ),
      kart(
        'Ekolojik koridorlar',
        'Parçalanmış habitatları birbirine bağlayan şeritler; popülasyonların karışmasını ve gen akışını sürdürür.',
      ),
      kart(
        'Sürdürülebilir tarım',
        'Nöbetleşe ekim, damla sulama ve biyolojik mücadele toprağı yormadan üretim yapmanın yolları.',
      ),
      kart(
        'Bireysel katkının sınırı',
        'Bireysel çaba önemlidir ama yeterli değil; asıl fark üretim ve enerji politikalarında ortaya çıkar.',
      ),
    ], [
      soru('Ekolojik ayak izi, doğaya bindirdiğimiz yükün ölçüsüdür.', true, 'Tükettiğimizi karşılamak için gereken alanı gösteriyor.'),
      soru('Ekolojik koridorlar, parçalanmış habitatlar arasında geçiş sağlar.', true, 'Popülasyonların birbirine karışmasını sürdürüyor.'),
      soru('Atık yönetiminde ilk basamak geri dönüşümdür.', false, 'İlk basamak atığı hiç oluşturmamak; geri dönüşüm sonra geliyor.'),
      soru('Bireysel önlemler tek başına ekolojik sürdürülebilirliği sağlar.', false, 'Bireysel çaba gerekli ama üretim ve politika düzeyinde karar alınmadan yetmiyor.'),
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
