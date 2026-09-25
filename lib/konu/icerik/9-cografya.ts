import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 9. sınıf Coğrafya — Maarif Modeli.
 *
 * Yedi tema; ikisi (Ekonomik Faaliyetler, Bölgeler) 9. sınıfta yalnızca
 * dörder saat ve tek konu. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Aynı yedi tema 10. sınıfta da var — program konuları temalara **yayarak**
 * ilerletiyor, tema başlıkları sınıf değiştirmiyor.
 */
export const cografya9 = program('cografya', 9, 'Mekânı okumaya başlangıç', [
  tema('cog9-t1', 'Coğrafyanın Doğası', [
    konu('cog9-konu-bolum', 'Coğrafya Biliminin Konusu ve Bölümleri', [
      kart(
        'Coğrafya neyi inceler?',
        'İnsan ile doğal ortam arasındaki karşılıklı etkileşimi inceler.\nBunu yaparken dağılış ve yer gösterir.',
      ),
      kart(
        'Fizikî coğrafya',
        'Doğal ortamı inceler:\nyer şekilleri, iklim, su, toprak ve canlılar',
      ),
      kart(
        'Beşerî coğrafya',
        'İnsanın mekândaki izini inceler:\nnüfus, yerleşme, ekonomi, ulaşım ve kültür',
      ),
      kart(
        'Alt dallar',
        'İki ana bölümün her biri kendi içinde uzmanlaşmış dallara ayrılır.\nTabloda ikisinin dalları yan yana.',
        {
          tur: 'tablo',
          basliklar: ['Fizikî', 'Beşerî'],
          satirlar: [
            ['Jeomorfoloji', 'Nüfus coğrafyası'],
            ['Klimatoloji', 'Yerleşme coğ.'],
            ['Hidrografya', 'Ekonomik coğ.'],
            ['Biyocoğrafya', 'Siyasi coğrafya'],
          ],
        },
      ),
      kart(
        'Üç temel soru',
        '- Nerede?\n- Neden orada?\n- Sonucu ne?\nCoğrafyayı öteki bilimlerden ayıran, ikinci ve üçüncü sorudur.',
        undefined,
        { not: '\'Çay Rize\'de yetişir\' coğrafya değil; \'Rize\'de yetişir çünkü yağış 2000 mm ve don yok\' coğrafya.' },
      ),
      kart(
        'Dağılış ilkesi',
        'Coğrafya bir olayı tek başına değil, yeryüzüne yayılışıyla inceler.\nDağılış haritası coğrafyanın temel aracıdır.',
      ),
      kart(
        'Üç ilke',
        '- **Dağılış:** olayın yeryüzüne yayılışı\n- **Nedensellik:** neden orada olduğu\n- **Bağlantı:** başka olaylarla ilişkisi',
      ),
      kart(
        'Bölgesel coğrafya',
        'Belirli bir bölgenin fizikî ve beşerî özelliklerini birlikte inceler.\nİki ana bölümü tek bir mekânda buluşturur.',
      ),
      kart(
        'Komşu bilimler',
        '- **Jeoloji:** yer kabuğu\n- **Meteoroloji:** hava olayları\n- **Demografi:** nüfus istatistiği\nCoğrafya bunların verisini mekânla ilişkilendirir.',
      ),
      kart(
        'Coğrafyacının araçları',
        '- Harita ve atlas\n- Arazi gözlemi\n- İstatistik\n- Uydu görüntüsü ve CBS',
      ),
    ], [
      soru('Coğrafya, insan ile doğal çevre arasındaki karşılıklı ilişkiyi inceler.', true, 'Yalnızca doğayı ya da yalnızca insanı değil, ikisinin etkileşimini ele alıyor.'),
      soru('Nüfus ve yerleşme fizikî coğrafyanın konusudur.', false, 'İkisi de beşerî coğrafyanın konusu; fizikî coğrafya yer şekilleri ve iklimle ilgilenir.'),
      soru('Dağılış ilkesi, bir olayın nerede ve nasıl yayıldığını sorar.', true, 'Coğrafyanın olayları yere bağlayan temel ilkelerinden biri.'),
      soru('Coğrafyada "neden orada" sorusu sorulmaz.', false, 'Nerede, neden orada ve nasıl sorularının üçü birden coğrafyanın temel soruları.'),
      sikli('İklim ve toprağı inceleyen bölüm?', ['Beşerî coğrafya', 'Fizikî coğrafya'], 1, 'Doğal ortam.'),
      sikli('Jeomorfoloji neyi inceler?', ['Yer şekillerini', 'Nüfusu'], 0, 'Fizikî coğrafyanın dalı; nüfusu beşerî coğrafya inceler.'),
      soru('Klimatoloji fizikî coğrafyanın alt dalıdır.', true, 'İklimi inceler; hidrografya ve biyocoğrafya da fizikî dallar.'),
      soru('Bölgesel coğrafya fizikî ve beşerî özellikleri birlikte inceler.', true, 'Bir mekânda buluşturur.'),
      soru('Nüfus coğrafyası fizikî coğrafyanın dalıdır.', false, 'Beşerî coğrafyanın dalı.'),
      soru('Nedensellik ilkesi olayın neden orada olduğunu sorar.', true, 'Coğrafyayı ayıran sorulardan.'),
      sikli('Hava olaylarını inceleyen bilim?', ['Jeoloji', 'Meteoroloji'], 1, 'Jeoloji yer kabuğunu inceler.'),
      sikli('Olayın başka olaylarla ilişkisini inceleyen ilke?', ['Bağlantı', 'Dağılış'], 0, 'Dağılış yayılışa bakar.'),
    ], [
      {
        soru: 'Nüfus ve yerleşmeyi inceleyen coğrafya dalı hangisidir?',
        siklar: ['Beşerî coğrafya', 'Fizikî coğrafya'],
        dogru: 0,
        aciklama: {
          dogru: 'İnsanın mekândaki izi beşerî coğrafyanın konusu.',
          yanlis: 'Fizikî coğrafya doğal ortamı (iklim, yer şekli, su) inceler. Nüfus ve yerleşme beşerî coğrafyanın konusu.',
        },
        kart: 3,
      },
    ]),
    konu('cog9-nicin', 'Niçin Coğrafya Öğrenmeliyiz?', [
      kart(
        'Mekânsal düşünme',
        'Olayları yerle birlikte düşünmeyi öğretir.\nBir depremin sonucu, olduğu yere göre değişir.',
      ),
      kart(
        'Günlük kararlar',
        'Hepsi coğrafi kararlardır:\n- Nerede oturulacağı\n- Hangi ürünün nerede yetişeceği\n- Hangi yolun seçileceği',
      ),
      kart(
        'Afet ve risk',
        'Şu alanları bilmek doğrudan can güvenliğiyle ilgilidir:\n- Fay hattı\n- Taşkın ovası\n- Heyelan alanı',
      ),
      kart(
        'Kaynak yönetimi',
        'Su, toprak ve enerji sınırlıdır.\nNerede ne kadar olduğunu bilmeden ne paylaşım ne koruma yapılabilir.',
      ),
      kart(
        'Küresel bakış',
        'İklim değişikliği, göç ve kaynak paylaşımı küresel sorunlardır.\nCoğrafi düşünmeden anlaşılamazlar.',
      ),
      kart(
        'Coğrafi düşünmenin ölçütü',
        '"Nerede?" ile yetinmeyip şunları da sormak:\n- Neden orada?\n- Başka yerde nasıl olurdu?\nCevap yerle birlikte değişiyorsa soru coğrafidir.',
        undefined,
        { not: 'Benzer büyüklükte depremler Japonya\'da az, Haiti\'de (2010) 200 binden çok can aldı: aynı olay, farklı yer.' },
      ),
      kart(
        'Yer seçimi',
        'Hastane, okul, fabrika nereye yapılmalı?\nNüfus, ulaşım, afet riski ve arazi birlikte düşünülür.\nYanlış yer seçimi yıllarca süren bir maliyettir.',
      ),
      kart(
        'Coğrafi okuryazarlık',
        'Haritayı, grafiği ve uydu görüntüsünü okuyup yorumlayabilmektir.\nHaberlerdeki bir göç ya da kuraklık haritası bu beceriyle anlaşılır.',
      ),
      kart(
        'Coğrafyaya dayanan meslekler',
        '- Şehir ve bölge plancısı\n- Harita mühendisi\n- Meteorolog\n- Turizm ve lojistik uzmanı',
      ),
      kart(
        'Kültürleri anlamak',
        'Bir toplumun yemeği, mimarisi ve geçimi yaşadığı yerle ilgilidir.\nKaradeniz’de çatılar dik, İç Anadolu’da düzdür: yağış farkı.',
      ),
    ], [
      soru('Mekânsal düşünme, bir olayı yerle ilişkisi içinde değerlendirmektir.', true, 'Aynı olay farklı yerlerde farklı sonuçlar doğurabiliyor.'),
      soru('Coğrafya bilgisi afet risklerinin azaltılmasında kullanılır.', true, 'Yerleşim yeri seçimi ve risk haritaları doğrudan coğrafi bilgiye dayanıyor.'),
      soru('Yer seçimiyle ilgili günlük kararlarda coğrafi bilginin bir yararı yoktur.', false, 'Ev, iş yeri ya da tatil yeri seçmek doğrudan mekânsal bir karar.'),
      soru('Coğrafya, ülke ve başkent ezberlemekten ibarettir.', false, 'Yer adları yalnızca bir araç; asıl konu olayların yerle ilişkisi.'),
      sikli('Bir sorunun coğrafi olduğunu ne gösterir?', ['Cevabın yere göre değişmesi', 'Sayısal olması'], 0, '"Başka yerde nasıl olurdu" sorusu coğrafi düşünmenin ölçütü.'),
      sikli('Su ve enerjiyi paylaşmak için önce ne gerekir?', ['Yasa çıkarmak', 'Nerede ne kadar olduğunu bilmek'], 1, 'Kaynak yönetimi.'),
      soru('İklim değişikliği coğrafi düşünmeden anlaşılabilir.', false, 'Küresel bakış gerektirir.'),
      soru('Karadeniz\'de dik çatı yağışın bol olmasıyla ilgilidir.', true, 'Su ve kar kolay akar.'),
      soru('Yer seçiminde afet riski önemsizdir.', false, 'Can ve mal güvenliğini doğrudan etkiler.'),
      soru('Harita ve grafik okuyabilmek coğrafi okuryazarlığın parçasıdır.', true, 'Mekânsal bilgiyi yorumlama becerisi.'),
      sikli('Şehrin gelişimini planlayan meslek?', ['Meteorolog', 'Şehir plancısı'], 1, 'Meteorolog hava olaylarını inceler.'),
      sikli('İç Anadolu\'da çatıların düz olması neyle ilgili?', ['Az yağış', 'Bol yağış'], 0, 'Kurak iklim.'),
    ], [
      {
        soru: 'Fay hattını ve taşkın ovasını bilmek hangi faydaya girer?',
        siklar: ['Afet ve risk bilinci', 'Küresel bakış'],
        dogru: 0,
        aciklama: {
          dogru: 'Nerede yaşamanın tehlikeli olduğunu bilmek doğrudan can güvenliği.',
          yanlis: 'Küresel bakış iklim değişikliği ve göç gibi dünya ölçekli sorunlar. Fay ve taşkın alanı bilgisi afet ve risk konusu.',
        },
        kart: 3,
      },
    ]),
    konu('cog9-gelisim', 'Coğrafya Biliminin Gelişimi', [
      kart(
        'İlk Çağ',
        '**Eratosthenes**, dünyanın çevresini şaşırtıcı bir yaklaşıklıkla hesapladı.\n"Coğrafya" sözcüğü de ona dayanır.',
      ),
      kart(
        'Batlamyus',
        'Enlem ve boylam ağıyla harita çizdi.\nEseri yüzyıllarca hem İslam dünyasında hem Avrupa’da kullanıldı.',
      ),
      kart(
        'İslam dünyasında',
        'Harita ve seyahat bilgisiyle coğrafyayı ilerletenler:\n- Birunî\n- İdrisî\n- Piri Reis',
      ),
      kart(
        'Piri Reis haritası',
        '- **1513 dünya haritası:** Amerika kıyılarını gösteren en eski haritalardan\n- **Kitab-ı Bahriye:** Akdeniz limanlarını tek tek anlatır',
      ),
      kart(
        'Keşifler çağı',
        'Uzun deniz yolculukları dünya haritasını tamamladı.\nCoğrafya betimlemeden ölçmeye geçti.',
        undefined,
        { not: 'Piri Reis 1513\'te Amerika\'yı çizdi; Kolomb\'un 1492 seferinden 21 yıl sonra. Betimleme değil ölçüm çağı.' },
      ),
      kart(
        'Modern coğrafya',
        'Bugün uydu görüntüsü ve coğrafi bilgi sistemleriyle çalışıyor.\nVeri artık gerçek zamanlı.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Anlatma' },
            { ad: 'Haritalama' },
            { ad: 'Ölçme' },
            { ad: 'Modelleme' },
          ],
        },
      ),
      kart(
        'Heredot ve Strabon',
        '- **Heredot:** gezdiği ülkelerin insanını ve doğasını anlattı.\n- **Strabon:** Anadolu doğumlu (Amasya); Geographika’da bildiği dünyayı tanıttı.',
      ),
      kart(
        'Kaşgarlı Mahmut’un haritası',
        'Divanü Lügati’t-Türk’te 11. yüzyılda Türk dünyasını gösteren bir dünya haritası vardır.\nTürklerin yaşadığı yerleri merkeze alır.',
      ),
      kart(
        'Kâtip Çelebi',
        'Cihannüma adlı eserinde dünyayı Batı ve Doğu kaynaklarını birleştirerek anlattı.\nOsmanlı coğrafyacılığının önemli adıdır.',
      ),
      kart(
        'Humboldt ve Ritter',
        '19. yüzyılda modern coğrafyanın kurucuları sayılırlar.\nHumboldt doğayı ölçerek, Ritter insanla ilişkisi içinde inceledi.',
      ),
      kart(
        'Evliya Çelebi',
        'Seyahatname’de şehirlerin yerini, iklimini, ürünlerini ve halkını anlattı.\nBeşerî coğrafya için değerli bir kaynaktır.',
      ),
    ], [
      soru('Batlamyus, Dünya yı evrenin merkezine koyan bir model kurmuştur.', true, 'Bu model yüzyıllarca kabul gördü.'),
      soru('Coğrafi Keşifler haritacılığın gelişmesini hızlandırmıştır.', true, 'Yeni kıyılar haritalara işlendi, ölçüm yöntemleri gelişti.'),
      soru('İslam dünyasındaki coğrafyacıların haritacılığa katkısı olmamıştır.', false, 'İdrisi gibi adlar döneminin en ayrıntılı haritalarını çizdi.'),
      soru('Modern coğrafya, yalnızca yerlerin adlarını listeleyen bir bilimdir.', false, 'Modern coğrafya olayların sebeplerini ve dağılışını açıklamaya çalışıyor.'),
      sikli('Eseri yüzyıllarca hem İslam dünyasında hem Avrupa\'da kullanılan haritacı?', ['İdrisî', 'Batlamyus'], 1, 'Enlem-boylam ağı.'),
      sikli('Modern coğrafya hangi araçlarla çalışır?', ['Uydu görüntüsü ve CBS', 'Yalnızca gezi notları'], 0, 'Veri artık gerçek zamanlı toplanıyor.'),
      soru('Piri Reis\'in 1513 haritası Amerika kıyılarını gösterir.', true, 'En eski haritalardan.'),
      soru('Strabon Amasya doğumludur.', true, 'Geographika\'nın yazarı.'),
      soru('Cihannüma Kaşgarlı Mahmut\'un eseridir.', false, 'Kâtip Çelebi\'nin eseri.'),
      soru('Humboldt modern coğrafyanın kurucularından sayılır.', true, 'Ritter ile birlikte.'),
      sikli('Türk dünyası haritasını içeren eser?', ['Cihannüma', 'Divanü Lügati\'t-Türk'], 1, 'Kaşgarlı Mahmut, 11. yüzyıl.'),
      sikli('Seyahatname hangi coğrafya dalı için kaynaktır?', ['Beşerî coğrafya', 'Jeomorfoloji'], 0, 'Şehir ve halkları anlatır.'),
      soru('Heredot gezdiği ülkelerin insanını ve doğasını anlattı.', true, 'İlk Çağ\'ın gezgin tarihçisi.'),
    ], [
      {
        soru: 'Dünyanın çevresini İlk Çağ\'da hesaplayan bilgin kimdir?',
        siklar: ['Eratosthenes', 'Batlamyus'],
        dogru: 0,
        aciklama: {
          dogru: 'Gölge açılarından yola çıkıp şaşırtıcı bir yaklaşıklıkla buldu; "coğrafya" sözcüğü de ona dayanır.',
          yanlis: 'Batlamyus enlem-boylam ağıyla harita çizdi. Çevreyi hesaplayan ve coğrafya sözcüğünü kullanan Eratosthenes.',
        },
        kart: 1,
      },
      {
        soru: 'Cihannüma kimin eseridir?',
        siklar: ['Piri Reis', 'Kâtip Çelebi'],
        dogru: 1,
        aciklama: {
          dogru: 'Kâtip Çelebi Doğu ve Batı kaynaklarını birleştirdi.',
          yanlis: 'Piri Reis\'in eseri Kitab-ı Bahriye. Cihannüma Kâtip Çelebi\'nin.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('cog9-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog9-harita', 'Mekânın Aynası Haritalar', [
      kart(
        'Harita nedir?',
        'Yeryüzünün tamamının ya da bir bölümünün düzleme aktarılmış küçültülmüş çizimidir.\nKüçültme ölçekle yapılır.',
      ),
      kart(
        'Ölçek',
        'Haritadaki uzunluğun gerçek uzunluğa oranıdır.\nPayda büyüdükçe ölçek küçülür, ayrıntı azalır.',
        {
          tur: 'tablo',
          basliklar: ['Ölçek', 'Alan', 'Ayrıntı'],
          satirlar: [
            ['1/5.000', 'Dar', 'Çok'],
            ['1/500.000', 'Geniş', 'Az'],
          ],
        },
      ),
      kart(
        'Ölçek hesabı',
        '**Gerçek uzunluk = harita uzunluğu × ölçek paydası**\n1/500.000 ölçekte 1 cm → 500.000 cm = 5 km\ncm’yi km’ye çevirmek için beş sıfır atılır.',
      ),
      kart(
        'Bileşenleri',
        '- Başlık\n- Ölçek\n- Lejant\n- Yön oku ve koordinat\nBiri eksikse harita okunamaz.',
      ),
      kart(
        'Bozulma kaçınılmaz',
        'Küre düzleme aktarılırken alan, açı ya da uzunluktan biri mutlaka bozulur.\nHiçbir izdüşüm üçünü birden koruyamaz.',
      ),
      kart(
        'İzohips',
        'Aynı yükseltideki noktaları birleştiren eğridir.\nİzohipsler sıklaştıkça eğim dikleşir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [3, 3],
                [4.6, 4],
                [5.2, 3],
                [4.6, 2],
                [3, 3],
              ],
              kapali: true,
            },
            {
              noktalar: [
                [2, 3],
                [4.8, 4.9],
                [6.2, 3],
                [4.8, 1.1],
                [2, 3],
              ],
              kapali: true,
            },
            {
              noktalar: [
                [1, 3],
                [5, 5.6],
                [7.4, 3],
                [5, 0.4],
                [1, 3],
              ],
              kapali: true,
            },
          ],
          etiketler: [{ x: 8.7, y: 3, ad: 'tepe', renk: 'ikincil' }],
        },
      ),
      kart(
        'Yükselti basamağı',
        'Renkli haritada her renk bir yükselti aralığıdır.\n- **Yeşil:** ova\n- **Sarı, kahverengi:** yükselen arazi',
      ),
      kart(
        'Profil çıkarma',
        'İzohips haritasında bir hat boyunca yükseltiler işaretlenir ve birleştirilir.\nArazinin yandan görünüşü çıkar.',
      ),
      kart(
        'Büyük mü küçük mü?',
        '- **1/25.000, büyük ölçek:** az yer, çok ayrıntı (şehir planı)\n- **1/5.000.000, küçük ölçek:** çok yer, az ayrıntı (dünya haritası)',
        undefined,
        { not: '1/25.000 büyük ölçek (ayrıntı çok, alan az); 1/5.000.000 küçük ölçek. Payda büyüdükçe ölçek küçülür.' },
      ),
      kart(
        'Harita türleri',
        '- **Fizikî:** yer şekilleri, akarsular\n- **Siyasi:** ülke ve il sınırları\n- **Tematik (özel):** tek bir konu; nüfus, iklim, tarım',
      ),
      kart(
        'Mercator izdüşümü',
        'Açıları doğru gösterdiği için denizcilikte kullanıldı.\nKutuplara doğru alanlar büyür: Grönland, Afrika kadar görünür.',
      ),
      kart(
        'Kroki ve plan',
        '- **Kroki:** ölçeksiz, göz kararı çizim\n- **Plan:** çok büyük ölçekli çizim (bina, mahalle)\nHarita ise ölçekli ve koordinatlıdır.',
      ),
    ], [
      soru('Ölçeğin paydası büyüdükçe haritadaki ayrıntı azalır.', true, 'Küçük ölçekli harita geniş alanı, az ayrıntıyla gösterir.'),
      soru('İzohips eğrileri aynı yükseltideki noktaları birleştirir.', true, 'Bu yüzden iki izohips birbirini kesmez.'),
      soru('Birbirine yakın geçen izohipsler arazinin eğiminin az olduğunu gösterir.', false, 'Sık izohips dik yamaç demek; seyrek geçenler eğimin azaldığını gösterir.'),
      soru('Bir haritada alan, açı ve uzunluk aynı anda hatasız gösterilebilir.', false, 'Küre düzleme aktarılırken bozulma kaçınılmaz; hangisinin korunacağı seçilir.'),
      sikli('1/500.000 ölçekli haritada 1 cm gerçekte kaç km?', ['5', '50'], 0, 'Beş sıfır at.'),
      sikli('Şehir planı için hangi ölçek uygundur?', ['1/25.000 (büyük)', '1/5.000.000 (küçük)'], 0, 'Az yer, çok ayrıntı.'),
      sikli('Lejant haritada neyi açıklar?', ['Kullanılan işaret ve renkleri', 'Ölçeği'], 0, 'Lejantsız bir haritanın renkleri okunamaz.'),
      sikli('Renkli haritada yeşil neyi gösterir?', ['Ovayı', 'Dağı'], 0, 'Kahverengi yükselen arazi.'),
      sikli('1/200.000 ölçekli haritada 3 cm gerçekte kaç km?', ['60', '6'], 1, '3 × 200.000 = 600.000 cm = 6 km.'),
      soru('İzohips haritasından arazinin profili çıkarılabilir.', true, 'Hat boyunca yükseltiler birleştirilir.'),
      soru('Mercator izdüşümünde kutuplara yakın alanlar büyük görünür.', true, 'Grönland abartılı büyür.'),
      soru('Kroki ölçekli bir çizimdir.', false, 'Kroki ölçeksiz, göz kararıdır.'),
      soru('Nüfus yoğunluğu haritası tematik bir haritadır.', true, 'Tek bir konu gösterir.'),
      sikli('Ülke sınırlarını gösteren harita?', ['Fizikî', 'Siyasi'], 1, 'Fizikî yer şekillerini gösterir.'),
    ], [
      {
        soru: 'İzohipsler sıklaştıkça arazi nasıl olur?',
        siklar: ['Eğim azalır', 'Eğim dikleşir'],
        dogru: 1,
        aciklama: {
          dogru: 'Kısa mesafede çok yükselti değişiyor demek.',
          yanlis: 'Seyrek izohips yatık yamaç demek. Sık izohips kısa yolda büyük yükselti farkı, yani dik yamaç.',
        },
        kart: 6,
      },
      {
        soru: 'Mercator izdüşümünün hangi yönü doğrudur?',
        siklar: ['Alanlar', 'Açılar'],
        dogru: 1,
        aciklama: {
          dogru: 'Açıları korur; bu yüzden denizcilikte rota çizmeye yaradı.',
          yanlis: 'Alanlar kutuplara doğru büyür. Mercator açıları doğru gösterir.',
        },
        kart: 11,
      },
    ]),
    konu('cog9-konum', 'Türkiye’nin Coğrafi Konumu', [
      kart(
        'Matematik konum',
        'Türkiye yaklaşık şu aralıktadır:\n- **Enlem:** 36°–42° kuzey\n- **Boylam:** 26°–45° doğu',
      ),
      kart(
        'Enlemin sonuçları',
        'Orta kuşakta olduğu için dört mevsim belirgin yaşanır.\nGüneyden kuzeye gidildikçe sıcaklık azalır.',
      ),
      kart(
        'Boylamın sonuçları',
        'Doğu ile batı arasında 19 boylam fark vardır.\nHer boylam 4 dakika olduğundan yerel saat farkı **76 dakikadır**.',
      ),
      kart(
        'Yerel saat hesabı',
        '**Yerel saat farkı = boylam farkı × 4 dakika**\nDoğudaki yerin saati öndedir; güneş orada önce doğar.',
        undefined,
        { not: 'Iğdır (44°) ile Edirne (26°): 18 boylam × 4 dk = 72 dk. Doğudaki Iğdır\'da saat 72 dk ileridir.' },
      ),
      kart(
        'Tek saat dilimi',
        'Ülke doğu-batı boyunca 76 dakikalık fark taşır ama tek saat kullanır.\nBu, ortak bir çalışma düzeni sağlar.',
      ),
      kart(
        'Özel konum',
        '- Üç kıtanın kesiştiği yerde\n- Boğazlara sahip\nAsya ile Avrupa arasındaki geçiş konumu stratejik değer taşır.',
      ),
      kart(
        'Yükselti etkisi',
        'Ortalama yükselti fazladır ve doğuya doğru artar.\nBu, iklimi ve tarımı doğrudan etkiler.',
      ),
      kart(
        'Konumun ekonomiye etkisi',
        'Enerji hatlarının ve ticaret yollarının kesiştiği yerdedir.\nBu, transit geçiş ve turizm avantajı sağlar.',
      ),
      kart(
        'Komşular',
        '- **Batı:** Yunanistan, Bulgaristan\n- **Doğu:** Gürcistan, Ermenistan, Azerbaycan (Nahçıvan), İran\n- **Güney:** Irak, Suriye',
      ),
      kart(
        'Güneş hiç tepeye gelmez',
        'Türkiye Yengeç Dönencesi’nin kuzeyindedir.\nGüneş ışınları hiçbir zaman dik gelmez; öğle vakti gölge hep kuzeye düşer.',
      ),
      kart(
        'Üç tarafı deniz',
        'Kuzeyde Karadeniz, batıda Ege, güneyde Akdeniz; iç deniz Marmara.\nKıyı uzunluğu balıkçılık, turizm ve ulaşım için büyük olanak sağlar.',
      ),
      kart(
        'Uç noktalar',
        '- **En kuzey:** Sinop, İnceburun\n- **En güney:** Hatay\n- **En doğu:** Iğdır\n- **En batı:** Çanakkale, Gökçeada',
      ),
    ], [
      soru('Türkiye 36°–42° kuzey enlemleri arasında yer alır.', true, 'Bu enlemler ülkeyi orta kuşakta tutuyor.'),
      soru('Türkiye iki saat dilimine yayıldığı hâlde tek saat uygular.', true, '26°–45° doğu boylamları iki saat dilimine düşer; ortak çalışma düzeni için tek saat kullanılır.'),
      soru('Enlem, Türkiye de dört mevsimin belirgin yaşanmasında etkilidir.', true, 'Orta kuşakta olmak mevsim farklarını belirginleştiriyor.'),
      soru('Yükseltinin sıcaklık üzerinde bir etkisi yoktur.', false, 'Her 200 metrede sıcaklık yaklaşık 1 °C düşüyor.'),
      sikli('Türkiye\'nin doğusu ile batısı arasında kaç boylam farkı var?', ['19', '76'], 0, '45 − 26.'),
      sikli('Bir boylam kaç dakikalık yerel saat farkı eder?', ['15', '4'], 1, '360 boylam 24 saate (1440 dk) eşit: 1440 / 360 = 4.'),
      sikli('Güneş nerede önce doğar?', ['Edirne', 'Iğdır'], 1, 'Doğudaki yerin saati öndedir.'),
      sikli('Türkiye\'nin ortalama yükseltisi doğuya doğru?', ['Artar', 'Azalır'], 0, 'İklimi ve tarımı etkiler.'),
      soru('Türkiye Asya ile Avrupa arasında geçiş konumundadır.', true, 'Üç kıtanın kesiştiği yerde, boğazlara sahip.'),
      soru('Türkiye\'de öğle vakti gölge her zaman kuzeye düşer.', true, 'Dönencenin kuzeyindeyiz.'),
      soru('Türkiye\'nin en kuzey noktası Kırklareli\'ndedir.', false, 'Sinop, İnceburun.'),
      soru('Marmara bir iç denizdir.', true, 'Tümüyle Türkiye toprakları içinde.'),
      sikli('Nahçıvan hangi ülkenin parçasıdır?', ['İran', 'Azerbaycan'], 1, 'Azerbaycan\'ın özerk bölgesi.'),
    ], [
      {
        soru: 'Türkiye\'de dört mevsimin belirgin yaşanmasının sebebi?',
        siklar: ['Üç tarafının denizle çevrili olması', 'Orta kuşakta olması'],
        dogru: 1,
        aciklama: {
          dogru: '36°-42° kuzey enlemleri ılıman kuşak; güneş ışınlarının açısı yıl içinde belirgin değişir.',
          yanlis: 'Denizler iklimi yumuşatır ama mevsimleri yaratmaz. Dört mevsim orta kuşak enlemlerinin sonucu.',
        },
        kart: 2,
      },
      {
        soru: 'Türkiye\'de güneş ışınları neden hiç dik gelmez?',
        siklar: ['Dönencenin kuzeyinde olduğu için', 'Denize kıyısı olduğu için'],
        dogru: 0,
        aciklama: {
          dogru: 'Dik ışın yalnız dönenceler arasına düşer; Türkiye onun kuzeyinde.',
          yanlis: 'Deniz kıyısı ışın açısını değiştirmez. Belirleyen enlem: dönencenin kuzeyindeyiz.',
        },
        kart: 10,
      },
    ]),
    konu('cog9-mbt', 'Mekânsal Bilgi Teknolojilerinin Bileşenleri', [
      kart(
        'CBS nedir?',
        '**Coğrafi Bilgi Sistemleri**, konumlu veriyi:\n- toplar ve saklar,\n- çözümler,\n- haritaya döker.',
      ),
      kart(
        'Bileşenler',
        'Donanım, yazılım, veri, insan ve yöntem.\nEn kritik ve en pahalı bileşen **veridir**.',
      ),
      kart(
        'Uzaktan algılama',
        'Uydu ve hava araçlarıyla, temas etmeden veri toplamaktır.\nOrman yangını ve kuraklık takibinde kullanılır.',
      ),
      kart(
        'GPS',
        'Uydularla konum belirleme sistemidir.\nEn az dört uydudan gelen sinyal, yeri üç boyutlu olarak verir.',
      ),
      kart(
        'Katman mantığı',
        'CBS veriyi katmanlar hâlinde üst üste bindirir.\nÇözümleme bu bindirmeden çıkar.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Nüfus' },
            { ad: 'Yollar' },
            { ad: 'Akarsular' },
            { ad: 'Arazi kullanımı' },
          ],
        },
      ),
      kart(
        'Nerede kullanılır?',
        '- Kent planlaması\n- Afet yönetimi\n- Tarım ve lojistik\n- Sağlık (salgın haritaları)',
      ),
      kart(
        'Veri doğruysa sonuç doğru',
        'CBS eski ya da hatalı veriyle de düzgün görünen bir harita üretir.\nÇıktının güzelliği doğruluğun kanıtı değildir.',
        undefined,
        { not: '2010 nüfus verisiyle çizilen 2026 haritası kusursuz görünür ve yanlıştır; tarihe bak.' },
      ),
      kart(
        'Vektör ve raster veri',
        '- **Vektör:** nokta, çizgi ve alanla (okul, yol, il sınırı)\n- **Raster:** piksellerden oluşan görüntü (uydu fotoğrafı, yükselti modeli)',
      ),
      kart(
        'Çözünürlük',
        'Uydu görüntüsünde bir pikselin yerde kapladığı alandır.\n30 m çözünürlükte bir tarla seçilir ama bir araba seçilmez.',
      ),
      kart(
        'Analiz örneği',
        'Yeni bir okul için yer seçiliyor:\n- Nüfus katmanı\n- Yol ağı\n- Afet riski\nKatmanlar üst üste bindirilince en uygun alan ortaya çıkar.',
      ),
      kart(
        'Günlük hayatta',
        'Harita uygulamaları, trafik yoğunluğu ve kargo takibi CBS ile çalışır.\nTelefonun konumu GPS’ten, trafik verisi binlerce kullanıcıdan gelir.',
      ),
    ], [
      soru('CBS, konumla ilişkili verileri toplayan, saklayan ve çözümleyen bir sistemdir.', true, 'Veriyi katmanlar hâlinde üst üste koyup ilişkilendiriyor.'),
      soru('Uzaktan algılama, yeryüzüne ait bilginin temas etmeden toplanmasıdır.', true, 'Uydu ve hava fotoğrafları bu yolla elde ediliyor.'),
      soru('GPS, konum belirlemek için yeryüzündeki radyo istasyonlarını kullanır.', false, 'Uydulardan gelen sinyallerin ulaşma sürelerini kullanıyor.'),
      soru('CBS ye girilen veri hatalı olsa bile çıkan sonuç doğru olur.', false, 'Sonuç girilen verinin doğruluğu kadar güvenilir.'),
      sikli('CBS\'nin en kritik ve pahalı bileşeni?', ['Yazılım', 'Veri'], 1, 'Veri toplamak ve güncel tutmak en çok emeği ister.'),
      sikli('CBS\'nin kullanıldığı alanlardan biri?', ['Salgın haritaları', 'Şiir yazımı'], 0, 'Kent planlaması, afet yönetimi ve tarım da.'),
      sikli('CBS veriyi nasıl çözümler?', ['Katmanları üst üste bindirerek', 'Tablo hâlinde'], 0, 'Katman mantığı.'),
      soru('İnsan da CBS\'nin bileşenlerinden biridir.', true, 'Donanım, yazılım, veri, insan ve yöntem.'),
      soru('Uydu fotoğrafı raster veridir.', true, 'Piksellerden oluşur.'),
      soru('Yol ağı raster veriyle gösterilmek zorundadır.', false, 'Genellikle vektör (çizgi) veriyle gösterilir.'),
      soru('Çözünürlük arttıkça daha küçük nesneler seçilir.', true, 'Piksel yerde daha küçük alanı kaplar.'),
      sikli('Okul yerini seçerken katmanları üst üste bindirmek?', ['CBS analizi', 'Kroki çizimi'], 0, 'Katman mantığı.'),
      sikli('İl sınırı hangi veri türüyle gösterilir?', ['Raster', 'Vektör'], 1, 'Alan (poligon) verisi.'),
    ], [
      {
        soru: 'GPS alıcısı konum için en az kaç uydudan sinyal alır?',
        siklar: ['Bir', 'Dört'],
        dogru: 1,
        aciklama: {
          dogru: 'Üç uydu düzlemde yer, dördüncüsü yükseklik ve zaman düzeltmesi için.',
          yanlis: 'Tek uydu yalnızca uzaklık verir, yer vermez. Üç boyutlu konum için en az dört uydu gerekir.',
        },
        kart: 4,
      },
      {
        soru: 'Piksellerden oluşan veri türü?',
        siklar: ['Vektör', 'Raster'],
        dogru: 1,
        aciklama: {
          dogru: 'Raster veri piksel ızgarasıdır; uydu görüntüsü örnek.',
          yanlis: 'Vektör nokta, çizgi ve alanla çalışır. Piksel ızgarası raster.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('cog9-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog9-hava-olay', 'Hava Olayları ve Günlük Hayata Etkileri', [
      kart(
        'Hava durumu ve iklim',
        '- **Hava durumu:** kısa süreli ("bugün yağmurlu")\n- **İklim:** uzun yılların ortalaması ("yazları kurak")',
        undefined,
        { not: '\'Bugün 35 °C\' hava durumu; \'Antalya yazları sıcak ve kurak\' iklim (30+ yıl ortalaması).' },
      ),
      kart(
        'Atmosferin katmanları',
        'Hava olaylarının tamamı en alttaki **troposferde** gerçekleşir.\nYukarı çıkıldıkça hava seyrelir.',
        {
          tur: 'katman',
          eksenAdi: 'YÜKSEKLİK',
          katmanlar: [
            { ad: 'Ekzosfer' },
            { ad: 'Termosfer' },
            { ad: 'Mezosfer' },
            { ad: 'Stratosfer', alt: 'ozon' },
            { ad: 'Troposfer', alt: 'hava olayları' },
          ],
        },
      ),
      kart(
        'Sıcaklık ve basınç',
        '- **Isınan hava:** yükselir, alçak basınç oluşur.\n- **Soğuyan hava:** alçalır, yüksek basınç oluşur.',
      ),
      kart(
        'Rüzgâr',
        'Yüksek basınçtan alçak basınca doğru esen havadır.\nBasınç farkı büyüdükçe hızı artar.',
      ),
      kart(
        'Nem ve yağış',
        'Havadaki su buharı yoğuşunca bulut oluşur.\nBulut damlaları büyüyünce yağış olur.',
      ),
      kart(
        'Yağış türleri',
        'Havanın yükselme sebebine göre üçe ayrılır:\n- **Yamaç (orografik)**\n- **Cephe (frontal)**\n- **Yükselim (konveksiyonel)**',
      ),
      kart(
        'Günlük etkiler',
        'Tarım, ulaşım, enerji ve sağlık hava olaylarına bağlıdır.\nDon ve dolu bir yılın ürününü götürebilir.',
      ),
      kart(
        'Ölçüm aletleri',
        '- **Termometre:** sıcaklık\n- **Barometre:** basınç\n- **Higrometre:** nem\n- **Anemometre:** rüzgâr hızı\n- **Plüviyometre:** yağış miktarı',
      ),
      kart(
        'Türkiye’yi etkileyen basınç merkezleri',
        '- **Kışın Sibirya yüksek basıncı:** soğuk ve kuru hava\n- **Yazın Basra alçak basıncı:** sıcak ve kuru hava\n- **İzlanda alçak basıncı:** kışın yağış getirir.',
      ),
      kart(
        'Yerel rüzgârlar',
        '- **Poyraz:** kuzeydoğudan, soğuk\n- **Lodos:** güneybatıdan, ılık, fırtınalı\n- **Karayel:** kuzeybatıdan, kışın kar\n- **Keşişleme:** güneydoğudan',
      ),
      kart(
        'Sis ve kırağı',
        '- **Sis:** yere yakın havadaki yoğuşma\n- **Kırağı:** su buharının soğuk yüzeyde doğrudan donması\n- **Çiy:** soğuk yüzeyde su damlaları',
      ),
      kart(
        'Fön rüzgârı',
        'Dağı aşıp inen hava ısınır ve kurur.\nİndiği yamaçta ani sıcaklık artışı ve çığ tehlikesi oluşturabilir.',
      ),
    ], [
      soru(
        'Yağış ve rüzgâr gibi hava olayları termosferde gerçekleşir.',
        false,
        'Hava olayları en alttaki katmanda, troposferde olur; su buharı orada bulunuyor.',
        {
          tur: 'katman',
          eksenAdi: 'yükseklik',
          katmanlar: [
            { ad: 'Termosfer' },
            { ad: 'Mezosfer' },
            { ad: 'Stratosfer' },
            { ad: 'Troposfer' },
          ],
        },
      ),
      soru('Hava durumu kısa süreli, iklim ise uzun yılların ortalamasıdır.', true, 'Bir günün yağmuru iklimi değiştirmez.'),
      soru('Rüzgâr, yüksek basınç alanından alçak basınç alanına doğru eser.', true, 'Basınç farkı büyüdükçe rüzgâr hızlanıyor.'),
      soru('Bağıl nem arttıkça havadaki su buharı azalır.', false, 'Bağıl nem, havanın taşıyabileceği neme göre taşıdığı nemi gösterir; arttıkça nem de artar.'),
      sikli('Stratosferde hangi tabaka bulunur?', ['Ozon tabakası', 'Bulutların çoğu'], 0, 'Bulut ve yağış troposferde oluşur.'),
      sikli('Cephe (frontal) yağışında hava neden yükselir?', ['Sıcak ve soğuk hava kütleleri karşılaşır', 'Yamaca çarpar'], 0, 'Yamaca çarpan havanın yağışı orografik.'),
      sikli('Isınan hava ne oluşturur?', ['Alçak basınç', 'Yüksek basınç'], 0, 'Yükselir.'),
      sikli('Yamaca çarpıp yükselen havanın yağışı?', ['Frontal', 'Orografik'], 1, 'Frontal yağış cephelerde oluşur.'),
      soru('Don ve dolu bir yılın tarımsal ürününü yok edebilir.', true, 'Tarım hava olaylarına doğrudan bağlı.'),
      soru('Nem higrometreyle ölçülür.', true, 'Havadaki su buharı.'),
      soru('Lodos kuzeydoğudan esen soğuk rüzgârdır.', false, 'Lodos güneybatıdan, ılık; poyraz kuzeydoğudan.'),
      soru('Kışın Sibirya yüksek basıncı Türkiye\'ye soğuk hava getirir.', true, 'Kuru ve soğuk.'),
      sikli('Rüzgâr hızını ölçen alet?', ['Plüviyometre', 'Anemometre'], 1, 'Plüviyometre yağışı ölçer.'),
      sikli('Dağdan inerken ısınan kuru rüzgâr?', ['Fön', 'Poyraz'], 0, 'Poyraz kuzeydoğudan soğuk.'),
    ], [
      {
        soru: 'Rüzgâr hangi yöne eser?',
        siklar: ['Alçak basınçtan yüksek basınca', 'Yüksek basınçtan alçak basınca'],
        dogru: 1,
        aciklama: {
          dogru: 'Hava fazla olduğu yerden az olduğu yere akar; fark büyüdükçe hızlanır.',
          yanlis: 'Tersi: hava yüksek basınç alanından alçak basınç alanına doğru akar. Alçak basınç merkezleri havayı çeker.',
        },
        kart: 4,
      },
      {
        soru: 'Yazın Türkiye\'ye sıcak ve kuru hava getiren basınç merkezi?',
        siklar: ['Sibirya yüksek basıncı', 'Basra alçak basıncı'],
        dogru: 1,
        aciklama: {
          dogru: 'Basra alçak basıncı yaz kuraklığında etkilidir.',
          yanlis: 'Sibirya yüksek basıncı kışın soğuk hava getirir. Yaz sıcağı Basra kaynaklı.',
        },
        kart: 9,
      },
    ]),
    konu('cog9-iklim-sistem', 'İklim Sisteminin Bileşen ve Değişkenleri', [
      kart(
        'Beş bileşen',
        '- Atmosfer\n- Su küre (hidrosfer)\n- Taş küre (litosfer)\n- Canlı küre (biyosfer)\n- Buz küre',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Atmosfer' },
            { ad: 'Su küre' },
            { ad: 'Taş küre' },
            { ad: 'Canlı küre' },
          ],
        },
      ),
      kart(
        'Değişkenler',
        '- Sıcaklık ve basınç\n- Nem ve yağış\n- Rüzgâr\n- Güneşlenme süresi',
      ),
      kart(
        'Enlem etkisi',
        'Güneş ışınlarının geliş açısı enleme göre değişir.\nEkvatordan kutuplara gidildikçe sıcaklık düşer.',
      ),
      kart(
        'Yükselti etkisi',
        'Her 100 metrede sıcaklık yaklaşık **0,5 °C** düşer.\nAynı enlemde bile dağ ile ova arasında büyük fark oluşur.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık',
          yAd: 'yükselti',
          egriler: [
            {
              noktalar: [
                [5.5, 0.3],
                [0.5, 5.5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'Karasallık',
        'Denizden uzaklaştıkça sıcaklık farkları büyür:\n- Gece ile gündüz arasında\n- Yaz ile kış arasında\nKara çabuk ısınır, çabuk soğur.',
        undefined,
        { not: 'Rize\'de yaz-kış farkı ~15 °C, Erzurum\'da ~30 °C: denizden uzaklaştıkça sıcaklık farkı büyür.' },
      ),
      kart(
        'Bakı',
        'Kuzey yarım kürede **güneye bakan** yamaçlar daha çok ısınır.\nYerleşme ve tarım bu yamaçlarda yoğunlaşır.',
      ),
      kart(
        'Okyanus akıntıları',
        '- **Sıcak akıntı:** kıyıyı ılıtır.\n- **Soğuk akıntı:** kıyıyı serinletir ve kuraklaştırır.',
      ),
      kart(
        'Dağların uzanışı',
        'Türkiye’de dağlar kıyıya paralel uzanır.\nDeniz etkisi iç kesimlere ulaşamaz; kıyı ile iç kesim arasında iklim farkı büyür.',
      ),
      kart(
        'Nem çeşitleri',
        '- **Mutlak nem:** havadaki su buharının miktarı (g/m³)\n- **Bağıl nem:** havanın taşıyabileceğinin yüzde kaçını taşıdığı\nBağıl nem %100 olunca yoğuşma başlar.',
      ),
      kart(
        'Albedo',
        'Bir yüzeyin gelen güneş ışığını yansıtma oranıdır.\nKar ve buz çok yansıtır, orman ve deniz az yansıtıp çok ısınır.',
      ),
      kart(
        'Isı dağılımı',
        'Ekvator fazla ısı alır, kutuplar az.\nRüzgârlar ve okyanus akıntıları bu farkı taşıyarak dengeler.',
      ),
    ], [
      soru('Ekvator dan kutuplara gidildikçe sıcaklık azalır.', true, 'Güneş ışınlarının geliş açısı küçülüyor.'),
      soru('Kuzey Yarım Küre de güneye bakan yamaçlar daha sıcaktır.', true, 'Bakı etkisi: güneş ışınları o yamaca daha dik geliyor.'),
      soru('Karasallık, denizden uzak yerlerde günlük ve yıllık sıcaklık farkını azaltır.', false, 'Tersine artırır; sıcaklığı dengeleyen su kütlesi uzakta kalıyor.'),
      soru('Okyanus akıntılarının kıyı iklimleri üzerinde etkisi yoktur.', false, 'Sıcak akıntılar kıyıyı ılıtır, soğuk akıntılar serinletir ve kuraklaştırır.'),
      sikli('Denizden uzak Erzurum\'un yıllık sıcaklık farkı Rize\'ninkine göre?', ['Daha büyük', 'Daha küçük'], 0, 'Karasallık: Rize ~15 °C, Erzurum ~30 °C.'),
      sikli('Hangisi iklim sisteminin bileşenlerindendir?', ['Ay', 'Taş küre'], 1, 'Atmosfer, su küre, taş küre, canlı küre ve buz küre.'),
      sikli('Sıcak akıntı kıyıyı nasıl etkiler?', ['Ilıtır', 'Kuraklaştırır'], 0, 'Soğuk akıntı serinletir ve kuraklaştırır.'),
      sikli('Deniz seviyesinde 24 °C iken 1000 m yükseklikte sıcaklık yaklaşık?', ['14 °C', '19 °C'], 1, 'Her 100 m\'de ~0,5 °C: 1000 m\'de 5 °C düşüş.'),
      soru('Güneşlenme süresi iklimin değişkenlerindendir.', true, 'Sıcaklık, basınç, nem, yağış ve rüzgârla birlikte.'),
      soru('Kıyıya paralel dağlar deniz etkisinin iç kesime ulaşmasını engeller.', true, 'Türkiye\'de belirgindir.'),
      soru('Karın albedosu düşüktür.', false, 'Kar ışığı çok yansıtır; albedosu yüksektir.'),
      soru('Bağıl nem %100 olunca yoğuşma başlar.', true, 'Hava doymuştur.'),
      sikli('Havanın taşıyabileceğinin yüzdesi?', ['Mutlak nem', 'Bağıl nem'], 1, 'Mutlak nem miktarı gösterir.'),
    ], [
      {
        soru: 'Deniz seviyesinde 20 °C iken 2000 m yükseklikte sıcaklık yaklaşık kaç °C olur?',
        siklar: ['15 °C', '10 °C'],
        dogru: 1,
        aciklama: {
          dogru: 'Her 100 m\'de 0,5 °C: 2000 m\'de 10 °C düşer, 20 − 10 = 10.',
          yanlis: 'Her 100 metrede 0,5 °C düşer; 2000 m\'de düşüş 10 °C. Sonuç 20 − 10 = 10 °C.',
        },
        kart: 4,
      },
      {
        soru: 'Buzullar eriyince yeryüzünün albedosu?',
        siklar: ['Azalır', 'Artar'],
        dogru: 0,
        aciklama: {
          dogru: 'Beyaz yüzey kalkar, koyu yüzey açılır; daha çok ısı emilir.',
          yanlis: 'Buz en çok yansıtan yüzeylerdendir; eriyince yansıtma azalır.',
        },
        kart: 10,
      },
    ]),
    konu('cog9-iklim-tur', 'İklim Türleri', [
      kart(
        'Sıcak kuşak iklimleri',
        '- **Ekvatoral:** yıl boyu sıcak ve yağışlı\n- **Savan:** yazı yağışlı\n- **Çöl ve muson**',
      ),
      kart(
        'Ilıman kuşak iklimleri',
        'Akdeniz, okyanusal, karasal ve step iklimleri.\nTürkiye bu kuşaktadır.',
      ),
      kart(
        'Soğuk kuşak iklimleri',
        'Tundra ve kutup iklimi.\nBitki örtüsü cılızdır ya da hiç yoktur.',
      ),
      kart(
        'Kuşaklar enleme bağlı',
        'Dönenceler ve kutup daireleri kuşakların sınırını çizer:\n- **Dönenceler arası:** sıcak kuşak\n- **Dönence ile kutup dairesi arası:** ılıman kuşak\n- **Kutup dairesinin ötesi:** soğuk kuşak',
        {
          tur: 'katman',
          eksenAdi: 'KUZEYDEN GÜNEYE',
          katmanlar: [
            { ad: 'Soğuk kuşak' },
            { ad: 'Ilıman kuşak' },
            { ad: 'Sıcak kuşak', alt: 'dönenceler arası' },
            { ad: 'Ilıman kuşak' },
            { ad: 'Soğuk kuşak' },
          ],
        },
      ),
      kart(
        'Türkiye’nin iklimleri',
        '- **Güney ve batı kıyıları:** Akdeniz iklimi\n- **Kuzey kıyıları:** Karadeniz iklimi\n- **İç kesimler:** karasal iklim',
      ),
      kart(
        'Bitki örtüsü izler',
        '- **Akdeniz iklimi:** maki\n- **Karadeniz iklimi:** orman\n- **Karasal iklim:** bozkır\nBitki, iklimin görünen yüzüdür.',
      ),
      kart(
        'İklim grafiği okuma',
        '- **Sütunlar:** yağış\n- **Çizgi:** sıcaklık\nYaz kuraklığı belirginse Akdeniz iklimi akla gelir.',
        undefined,
        { not: 'Yaz aylarında yağış çubuğu dipteyse Akdeniz; her ay yağışlı ve ılıksa Karadeniz; yaz kurak + kış soğuksa karasal.' },
      ),
      kart(
        'Akdeniz iklimi',
        'Yazlar sıcak ve kurak, kışlar ılık ve yağışlıdır.\n- **Bitki örtüsü:** maki\n- **Ürünler:** zeytin, turunçgil, üzüm',
      ),
      kart(
        'Karadeniz iklimi',
        'Her mevsim yağışlıdır; yaz serin, kış ılıktır.\n- **Bitki örtüsü:** gür orman\n- **Ürünler:** çay, fındık',
      ),
      kart(
        'Karasal iklim',
        'Yazlar sıcak ve kurak, kışlar soğuk ve karlıdır; yağış azdır.\n- **Bitki örtüsü:** bozkır\n- **Ürünler:** buğday, arpa',
      ),
      kart(
        'Muson iklimi',
        'Yazın okyanustan esen rüzgârlar bol yağış getirir, kış kuraktır.\nHindistan ve Güneydoğu Asya’da görülür; pirinç yetiştirilir.',
      ),
    ], [
      soru('Ekvatoral iklimde yıl boyunca yağış görülür.', true, 'Sıcaklık ve nem yıl boyu yüksek kalıyor.'),
      soru('Akdeniz ikliminde yazlar sıcak ve kurak, kışlar ılık ve yağışlıdır.', true, 'Bitki örtüsü olan maki bu düzene uyum sağlamış durumda.'),
      soru('İklim kuşakları enlemden bağımsız olarak dağılır.', false, 'Kuşakların temel belirleyicisi enlem; yükselti ve karasallık onu değiştiriyor.'),
      soru('Tundra iklimi sıcak kuşakta görülür.', false, 'Soğuk kuşakta, kutuplara yakın alanlarda görülüyor.'),
      sikli('Türkiye hangi iklim kuşağındadır?', ['Ilıman', 'Sıcak'], 0, 'Akdeniz, karasal ve Karadeniz iklimleri ılıman kuşakta.'),
      sikli('Akdeniz ikliminin bitki örtüsü?', ['Bozkır', 'Maki'], 1, 'Karadeniz orman, iç kesim bozkır.'),
      sikli('Türkiye\'nin iç kesimlerinde hangi iklim görülür?', ['Karadeniz', 'Karasal'], 1, 'Karadeniz iklimi kuzey kıyılarda.'),
      sikli('İklim grafiğinde sütunlar neyi gösterir?', ['Sıcaklığı', 'Yağışı'], 1, 'Çizgi sıcaklık.'),
      soru('Dönenceler arasında sıcak kuşak yer alır.', true, 'Dönence ile kutup dairesi arası ılıman kuşak.'),
      soru('Karadeniz ikliminde her mevsim yağış görülür.', true, 'Yaz kuraklığı yoktur.'),
      soru('Akdeniz ikliminde en çok yağış yazın düşer.', false, 'Kışın düşer; yaz kuraktır.'),
      soru('Muson ikliminde yağış yaz mevsimindedir.', true, 'Okyanustan esen rüzgârlar.'),
      sikli('Bozkır hangi iklimin bitki örtüsüdür?', ['Akdeniz', 'Karasal'], 1, 'Akdeniz\'de maki.'),
      sikli('Çay ve fındık hangi iklimin ürünüdür?', ['Karadeniz', 'Muson'], 0, 'Doğu Karadeniz.'),
    ], [
      {
        soru: 'Yaz kuraklığı belirgin olan iklim grafiği hangi iklimi gösterir?',
        siklar: ['Karadeniz', 'Akdeniz'],
        dogru: 1,
        aciklama: {
          dogru: 'Akdeniz ikliminde yağış kışa toplanır, yaz kurak geçer; bitki örtüsü maki.',
          yanlis: 'Karadeniz ikliminde her mevsim yağış var, yaz kuraklığı yok. Kurak yaz Akdeniz\'in imzası.',
        },
        kart: 7,
      },
      {
        soru: 'Zeytin ve turunçgil hangi iklimde yetişir?',
        siklar: ['Karasal', 'Akdeniz'],
        dogru: 1,
        aciklama: {
          dogru: 'Kışı ılık Akdeniz iklimi bu ürünlere uygundur.',
          yanlis: 'Karasal iklimde kış soğuk; zeytin ve turunçgil dona dayanmaz.',
        },
        kart: 8,
      },
    ]),
    konu('cog9-iklim-degisim', 'İklim Sisteminde Yaşanan Değişiklikler', [
      kart(
        'Doğal değişimler',
        'İklimi jeolojik zaman ölçeğinde değiştirenler:\n- Yörünge değişiklikleri\n- Volkanik patlamalar\n- Güneş etkinliği',
      ),
      kart(
        'İnsan kaynaklı değişim',
        'Sanayi devriminden bu yana fosil yakıt kullanımı arttı.\nSera gazları da hızla arttı.',
      ),
      kart(
        'Sera etkisi',
        'Atmosferdeki gazlar yeryüzünün yaydığı ısıyı tutar.\nDoğal sera etkisi olmasaydı dünya yaşanmayacak kadar soğuk olurdu.',
      ),
      kart(
        'Sonuçları',
        '- Ortalama sıcaklık artışı\n- Buzul erimesi ve deniz seviyesinin yükselmesi\n- Aşırı hava olaylarında artış',
      ),
      kart(
        'Türkiye’ye etkisi',
        'Akdeniz havzası risk bölgesindedir.\nKuraklık, orman yangını ve su sıkıntısı artıyor.',
      ),
      kart(
        'Azaltım ve uyum',
        '- **Azaltım:** salımı düşürmek\n- **Uyum:** değişen koşullara göre yaşamı yeniden düzenlemek',
        {
          tur: 'tablo',
          basliklar: ['Azaltım', 'Uyum'],
          satirlar: [
            ['Yenilenebilir enerji', 'Damla sulama'],
            ['Toplu taşıma', 'Sel önleme'],
            ['Ağaçlandırma', 'Kuraklığa dayanıklı tohum'],
          ],
        },
        { not: 'Güneş paneli kurmak azaltım (salım düşer); kuraklığa dayanıklı tohum seçmek uyum (sonuca hazırlık).' },
      ),
      kart(
        'Küresel anlaşmalar',
        '**Paris Anlaşması** ülkeleri sıcaklık artışını sınırlamaya çağırıyor.\nSalım azaltma hedefleri ulusal olarak bildiriliyor.',
      ),
      kart(
        'Kanıtlar',
        '- Ölçülen küresel sıcaklık artışı\n- Dağ buzullarının geri çekilmesi\n- Deniz seviyesinin yükselmesi\n- Kutup buzlarının incelmesi',
      ),
      kart(
        'Kyoto Protokolü',
        '1997’de imzalandı; gelişmiş ülkelere sera gazı azaltma yükümlülüğü getirdi.\nParis Anlaşması (2015) bütün ülkeleri kapsayarak onun yerini aldı.',
      ),
      kart(
        'Türkiye’nin hedefi',
        'Türkiye 2053 için net sıfır salım hedefi açıkladı.\nYenilenebilir enerji ve enerji verimliliği bu hedefin temel araçlarıdır.',
      ),
      kart(
        'Bireysel katkı',
        '- Toplu taşıma ve bisiklet\n- Enerji ve su tasarrufu\n- Gıda israfını azaltmak\nTek başına küçük, toplumca büyük etki yapar.',
      ),
    ], [
      soru('Sera gazlarının artması yeryüzü sıcaklığının yükselmesine yol açar.', true, 'Atmosferden çıkan uzun dalgalı ışınım tutuluyor.'),
      soru('İklim değişikliğinin tek sebebi insan etkinlikleridir.', false, 'Volkanlar ve güneş etkinliği gibi doğal sebepler de var; bugünkü hızlı ısınmada insan etkisi baskın.'),
      soru('Azaltım salımı düşürmeyi, uyum ise değişimin etkileriyle baş etmeyi hedefler.', true, 'İkisi birbirinin yerine geçmiyor, birlikte yürütülüyor.'),
      soru('Türkiye kuraklıktan etkilenmeyecek bir konumdadır.', false, 'Akdeniz havzası kuraklık riski en yüksek bölgelerden biri.'),
      sikli('İnsan kaynaklı iklim değişimi ne zamandan beri hızlandı?', ['Tarım devriminden', 'Sanayi devriminden'], 1, 'Fosil yakıt.'),
      sikli('Sera etkisi hiç olmasaydı dünya nasıl olurdu?', ['Çok sıcak', 'Yaşanmayacak kadar soğuk'], 1, 'Doğal sera etkisi gerekli.'),
      sikli('Paris Anlaşması\'nda salım hedeflerini kim belirler?', ['Her ülke kendisi', 'BM tek başına'], 0, 'Hedefler ulusal olarak bildiriliyor.'),
      sikli('Paris Anlaşması ne ister?', ['Fosil yakıtı yasaklamak', 'Sıcaklık artışını sınırlamak'], 1, 'Salım hedefleri ulusal bildiriliyor.'),
      soru('Buzulların erimesi deniz seviyesini yükseltir.', true, 'Karadaki buz denize karışınca su hacmi artar.'),
      soru('Dağ buzullarının geri çekilmesi iklim değişikliğinin kanıtlarındandır.', true, 'Uzun süreli ölçümler.'),
      soru('Kyoto Protokolü 2015\'te imzalandı.', false, '1997\'de; 2015 Paris Anlaşması.'),
      soru('Türkiye 2053 için net sıfır salım hedefi açıkladı.', true, 'Yenilenebilir enerji temel araç.'),
      sikli('Bütün ülkeleri kapsayan iklim anlaşması?', ['Kyoto', 'Paris'], 1, 'Kyoto yalnız gelişmişlere yükümlülük getirdi.'),
    ], [
      {
        soru: 'Sera gazı salımını düşürmeye ne denir?',
        siklar: ['Azaltım', 'Uyum'],
        dogru: 0,
        aciklama: {
          dogru: 'Uyum, değişen koşullara göre yaşamı düzenlemek; azaltım sebebe yönelik.',
          yanlis: 'Uyum sonuçla yaşamayı öğrenmek (kuraklığa dayanıklı tohum). Salımı düşürmek sebebe yönelik: azaltım.',
        },
        kart: 6,
      },
      {
        soru: 'Türkiye\'nin açıkladığı net sıfır salım yılı?',
        siklar: ['2053', '2023'],
        dogru: 0,
        aciklama: {
          dogru: '2053 net sıfır hedefi.',
          yanlis: '2023 değil; hedef yıl 2053.',
        },
        kart: 10,
      },
    ]),
  ]),
  tema('cog9-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog9-nufus-degisim', 'Nüfusun Tarihsel Değişimi ve Geleceği', [
      kart(
        'Yavaş başlangıç',
        'Tarım devrimine kadar dünya nüfusu çok azdı ve yavaş artıyordu.\nBesin miktarı sınırdı.',
      ),
      kart(
        'Hızlanma',
        'Sanayi devrimi ve tıptaki ilerlemeyle ölüm oranı düştü.\nNüfus hızla arttı.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'nüfus',
          egriler: [
            {
              noktalar: [
                [0, 0.3],
                [2, 0.6],
                [3.5, 1.2],
                [4.5, 3],
                [5.5, 5.4],
              ],
            },
          ],
        },
      ),
      kart(
        'Neden ölüm oranı düştü?',
        'Temiz su, kanalizasyon, aşı ve antibiyotik sayesinde.\nNüfus artışının sebebi doğum patlaması değil, **ölümün azalmasıdır**.',
        undefined,
        { not: '1800\'de 1 milyar, 1930\'da 2, 2022\'de 8 milyar: hızlanma doğumdan değil, aşı ve temiz suyla düşen ölümden.' },
      ),
      kart(
        'Bugün',
        'Artış hızı yavaşlıyor.\nBazı ülkelerde nüfus azalmaya başladı.',
      ),
      kart(
        'Kentleşme',
        'Dünya nüfusunun yarısından fazlası artık şehirlerde yaşıyor.\nBu oran yükselmeye devam ediyor.',
      ),
      kart(
        'Geleceğe bakış',
        'Nüfusun yüzyılın sonuna doğru durağanlaşması bekleniyor.\nArtışın büyük kısmı Afrika’dan gelecek.',
      ),
      kart(
        'Milyarlık basamaklar',
        '- **≈ 1804:** 1 milyar\n- **≈ 1927:** 2 milyar\n- **2022:** 8 milyar\nİlk milyar binlerce yılda, son milyarlar birkaç on yılda eklendi.',
      ),
      kart(
        'Türkiye’de sayımlar',
        'İlk genel nüfus sayımı 1927’de yapıldı: yaklaşık 13,6 milyon.\n2007’den beri nüfus Adrese Dayalı Nüfus Kayıt Sistemi ile her yıl belirleniyor.',
      ),
      kart(
        'Doğurganlık hızı',
        'Bir kadının hayatı boyunca doğurduğu ortalama çocuk sayısıdır.\nNüfusun kendini yenilemesi için yaklaşık **2,1** gerekir.',
      ),
      kart(
        'Nüfus artış hızı',
        'Doğal artış = doğum − ölüm\nBinde (‰) olarak verilir; göç de hesaba katılınca toplam artış bulunur.',
      ),
    ], [
      soru('Dünya nüfusunun hızlı artışında ölüm oranlarının düşmesi etkili olmuştur.', true, 'Sağlık ve beslenme koşulları düzelince ortalama yaşam süresi uzadı.'),
      soru('Sanayi Devrimi ne kadar dünya nüfusu yavaş artmıştır.', true, 'Yüksek doğum oranını yüksek ölüm oranı dengeliyordu.'),
      soru('Bugün dünya nüfusunun büyük kısmı kırsal alanda yaşamaktadır.', false, 'Nüfusun yarısından fazlası kentlerde yaşıyor.'),
      soru('Nüfus artış hızı bugün bütün ülkelerde aynıdır.', false, 'Bazı ülkelerde nüfus hızla artarken bazılarında azalıyor.'),
      sikli('Dünya nüfusunun ne zaman durağanlaşması bekleniyor?', ['Yüzyılın sonuna doğru', '2030\'da'], 0, 'Artış yavaşlıyor; bazı ülkelerde nüfus azalmaya başladı.'),
      sikli('Gelecekteki artış büyük ölçüde nereden gelecek?', ['Avrupa', 'Afrika'], 1, 'Bazı ülkelerde nüfus azalıyor.'),
      soru('Dünya nüfusu 2022\'de 8 milyarı geçti.', true, '1800\'de 1 milyar, 1927\'de 2 milyar.'),
      soru('Türkiye\'de ilk genel nüfus sayımı 1927\'de yapıldı.', true, 'Yaklaşık 13,6 milyon.'),
      soru('Nüfusun kendini yenilemesi için doğurganlık hızı 1 yeterlidir.', false, 'Yaklaşık 2,1 gerekir.'),
      soru('Dünya nüfusu 2022\'de 8 milyara ulaştı.', true, 'BM verisi.'),
      sikli('Doğal artış nasıl bulunur?', ['Doğum − ölüm', 'Göç − ölüm'], 0, 'Göç doğal artışa girmez.'),
      sikli('2007\'den beri Türkiye nüfusu nasıl belirleniyor?', ['Beş yılda bir sayım', 'Adrese dayalı kayıt'], 1, 'Her yıl güncellenir.'),
    ], [
      {
        soru: 'Sanayi devriminden sonra nüfusun hızla artmasının asıl sebebi?',
        siklar: ['Ölüm oranının düşmesi', 'Doğum oranının artması'],
        dogru: 0,
        aciklama: {
          dogru: 'Temiz su, aşı ve antibiyotik ölümü azalttı; doğum zaten yüksekti.',
          yanlis: 'Doğum oranı zaten yüksekti ve sonra düştü. Artışı yaratan şey ölümün azalması: aşı, temiz su, antibiyotik.',
        },
        kart: 3,
      },
    ]),
    konu('cog9-nufus-dagilis', 'Nüfusun Dağılışı ve Hareketleri', [
      kart(
        'Doğal faktörler',
        '- İklim\n- Yer şekilleri\n- Su kaynakları\n- Toprak verimliliği\nIlıman ve düz alanlar yoğun nüfusludur.',
      ),
      kart(
        'Beşerî faktörler',
        'Sanayi, ticaret, ulaşım ve turizm.\nİş imkânı olan yer nüfus çeker.',
      ),
      kart(
        'Seyrek nüfuslu alanlar',
        '- Kutuplar\n- Çöller\n- Yüksek dağlar\n- Ekvatoral ormanlar',
      ),
      kart(
        'Aritmetik nüfus yoğunluğu',
        '**Toplam nüfus / toplam alan**\nKullanılamayan alanları da saydığı için tek başına yanıltıcıdır.',
      ),
      kart(
        'Göç türleri',
        '- İç ya da dış göç\n- Sürekli ya da mevsimlik göç\n- Gönüllü ya da zorunlu göç\nÇoğu göçün sebebi ekonomiktir.',
      ),
      kart(
        'İtici ve çekici güçler',
        'Göç iki uçtan birden beslenir:\n- **İtici:** bir yerde tutunamamak\n- **Çekici:** başka yerde daha iyisini ummak',
        {
          tur: 'tablo',
          basliklar: ['İtici', 'Çekici'],
          satirlar: [
            ['İşsizlik', 'İş imkânı'],
            ['Savaş', 'Güvenlik'],
            ['Kuraklık', 'Verimli toprak'],
            ['Hizmet yetersizliği', 'Eğitim ve sağlık'],
          ],
        },
        { not: 'Köyde iş yok (itici) + şehirde fabrika var (çekici) → göç. Şıkta \'yalnızca itici\' diyorsa eksik.' },
      ),
      kart(
        'Göçün sonuçları',
        '- **Göç veren yer:** nüfus azalır ve yaşlanır.\n- **Göç alan yer:** konut, altyapı ve işsizlik baskısı artar.',
      ),
      kart(
        'Fizyolojik ve tarımsal yoğunluk',
        '- **Fizyolojik:** toplam nüfus / tarım alanı\n- **Tarımsal:** tarımla geçinen nüfus / tarım alanı\nTarım alanı başına düşen baskıyı aritmetik yoğunluktan iyi gösterir.',
      ),
      kart(
        'Türkiye’de dağılış',
        '- **Yoğun:** Marmara, kıyı ovaları, büyük şehirler\n- **Seyrek:** Doğu Anadolu’nun yüksek alanları, Tuz Gölü çevresi\nSanayi ve iklim dağılışı birlikte belirler.',
      ),
      kart(
        'İç göç Türkiye’de',
        '1950’lerden sonra makineleşen tarım ve sanayileşme kırdan kente göçü hızlandırdı.\nBugün nüfusun büyük çoğunluğu şehirlerde yaşar.',
      ),
      kart(
        'Beyin göçü',
        'Eğitimli ve nitelikli kişilerin başka ülkelere gitmesidir.\nGeride kalan ülke yetiştirdiği insan gücünü kaybeder.',
      ),
    ], [
      soru('Yüksek ve engebeli alanlar genellikle seyrek nüfusludur.', true, 'Tarım ve ulaşım koşulları elverişsiz.'),
      soru('Aritmetik nüfus yoğunluğu, toplam nüfusun yüz ölçüme bölünmesiyle bulunur.', true, 'Kişi/km² olarak yazılıyor.'),
      soru('İtici güçler, insanları göç ettikleri yere çeken sebeplerdir.', false, 'İtici güç bulunulan yerden uzaklaştırır; çeken sebeplere çekici güç denir.'),
      soru('Göç yalnızca göç alan yeri etkiler.', false, 'Göç veren yerde iş gücü ve genç nüfus azalıyor; etki iki taraflı.'),
      sikli('Hangisi seyrek nüfuslu alandır?', ['Ekvatoral ormanlar', 'Ilıman ovalar'], 0, 'Kutup, çöl, yüksek dağ da.'),
      sikli('Göçlerin çoğunun sebebi?', ['Dinî', 'Ekonomik'], 1, 'İş imkânı olan yer nüfus çeker.'),
      sikli('Hangisi göçte çekici bir güçtür?', ['İş imkânı', 'Kuraklık'], 0, 'Kuraklık insanı bulunduğu yerden iten bir güç.'),
      soru('Sanayi ve ticaret nüfus çeken beşerî faktörlerdir.', true, 'İş olan yer nüfus çeker.'),
      soru('Fizyolojik yoğunlukta nüfus tarım alanına bölünür.', true, 'Tarım alanı üzerindeki baskıyı gösterir.'),
      soru('Doğu Anadolu\'nun yüksek alanları Türkiye\'nin en yoğun nüfuslu yerleridir.', false, 'Seyrek nüfusludur.'),
      soru('Türkiye\'de 1950 sonrası kırdan kente göç hızlandı.', true, 'Tarımda makineleşme ve sanayi.'),
      sikli('Nitelikli insanların başka ülkeye gitmesi?', ['Beyin göçü', 'Mevsimlik göç'], 0, 'Mevsimlik göç geçicidir.'),
      sikli('Tarımla geçinen nüfusun tarım alanına oranı?', ['Aritmetik yoğunluk', 'Tarımsal yoğunluk'], 1, 'Aritmetik yoğunluk toplam alana bakar.'),
    ], [
      {
        soru: 'Aritmetik nüfus yoğunluğu neden yanıltıcıdır?',
        siklar: ['Yalnızca kentleri sayar', 'Kullanılamayan alanları da sayar'],
        dogru: 1,
        aciklama: {
          dogru: 'Çöl ve dağ da paydaya girer; Mısır\'ın gerçek yoğunluğu Nil vadisinde çok daha yüksek.',
          yanlis: 'Toplam nüfus / toplam alan; kırı da sayar. Sorun çöl ve dağ gibi yaşanmayan yerlerin paydayı şişirmesi.',
        },
        kart: 4,
      },
      {
        soru: 'Toplam nüfusun tarım alanına oranı?',
        siklar: ['Aritmetik yoğunluk', 'Fizyolojik yoğunluk'],
        dogru: 1,
        aciklama: {
          dogru: 'Fizyolojik yoğunluk tarım alanı başına düşen nüfusu gösterir.',
          yanlis: 'Aritmetik yoğunluk toplam alanı kullanır. Tarım alanına bölünen fizyolojik.',
        },
        kart: 8,
      },
    ]),
    konu('cog9-demografik', 'Demografik Dönüşüm ve Nüfus Piramitleri', [
      kart(
        'Demografik dönüşüm',
        'Yüksek doğum-yüksek ölümden, düşük doğum-düşük ölüme geçiş sürecidir.\nAradaki dönemde nüfus hızla artar.',
        {
          tur: 'akis',
          adimlar: [
            { ad: '1. Yüksek doğum', alt: 'yüksek ölüm' },
            { ad: '2. Ölüm düşer', alt: 'hızlı artış' },
            { ad: '3. Doğum düşer' },
            { ad: '4. Durağan' },
          ],
        },
      ),
      kart(
        'Piramit ne gösterir?',
        'Yaş gruplarını ve cinsiyet dağılımını gösterir.\nŞekli, ülkenin gelişmişliği hakkında doğrudan bilgi verir.',
      ),
      kart(
        'Geniş tabanlı piramit',
        'Doğum oranı yüksek, genç nüfus çoktur.\nGelişmekte olan ülkelerde görülür.',
      ),
      kart(
        'Dar tabanlı piramit',
        'Doğum oranı düşük, yaşlı nüfus fazladır.\nGelişmiş ülkelerde görülür.',
      ),
      kart(
        'Piramitteki çentikler',
        'Bir yaş grubundaki ani daralma bir olayın izidir.\nÖrnek: savaş, salgın, büyük göç',
        undefined,
        { not: 'Almanya piramidinde 1945 doğumluların çentiği: savaş yılı az doğum. Çentik = o yıl bir olay.' },
      ),
      kart(
        'Türkiye’nin piramidi',
        'Tabanı daralıyor, orta kısmı genişliyor.\nNüfus hâlâ genç ama hızla yaşlanıyor.',
      ),
      kart(
        'Dönüşümün evreleri',
        '1. Doğum ve ölüm yüksek, nüfus durgun\n2. Ölüm hızla düşer, nüfus patlar.\n3. Doğum da düşer, artış yavaşlar.\n4. İkisi de düşük, nüfus durgunlaşır.',
      ),
      kart(
        'Piramit biçimleri',
        '- **Üçgen:** genç nüfus, yüksek doğum\n- **Arı kovanı:** doğum ve ölüm dengeli\n- **Kavanoz (ters):** tabanı dar, yaşlı nüfus fazla',
      ),
      kart(
        'Ortanca yaş',
        'Nüfusu iki eşit parçaya bölen yaştır.\nNijer’de 15’in altında, Japonya’da 48’in üstündedir.\nOrtanca yaş yükseldikçe nüfus yaşlanır.',
      ),
      kart(
        'Doğumda yaşam beklentisi',
        'Yeni doğan bir bebeğin ortalama kaç yıl yaşaması beklendiğidir.\nSağlık hizmetleri ve beslenme geliştikçe yükselir.',
      ),
    ], [
      soru('Geniş tabanlı nüfus piramidi, doğum oranının yüksek olduğunu gösterir.', true, 'Genç nüfus payı büyük demek.'),
      soru('Dar tabanlı piramit yaşlanan bir nüfusa işaret eder.', true, 'Doğum oranı düşmüş, üst yaş grupları kalabalıklaşmış.'),
      soru('Nüfus piramidinden yalnızca toplam nüfus okunabilir.', false, 'Yaş grupları ve cinsiyet dağılımı da okunuyor.'),
      soru('Demografik dönüşümde önce doğum oranı, sonra ölüm oranı düşer.', false, 'Önce ölüm oranı düşer; doğum oranının inmesi gecikir ve arada nüfus hızla artar.'),
      sikli('Piramitteki ani daralma (çentik) neyin izidir?', ['Doğum artışı', 'Savaş, salgın ya da göç'], 1, 'Bir yaş grubu eksik.'),
      sikli('Türkiye\'nin piramidi için ne söylenir?', ['Çok yaşlı', 'Genç ama hızla yaşlanıyor'], 1, 'Taban daralıyor.'),
      soru('Demografik dönüşümün ara döneminde nüfus hızla artar.', true, 'Ölüm düştü, doğum henüz yüksek.'),
      soru('Demografik dönüşümün ikinci evresinde nüfus hızla artar.', true, 'Ölüm düşer, doğum yüksek kalır.'),
      soru('Kavanoz biçimli piramit genç nüfusu gösterir.', false, 'Tabanı dar; yaşlı nüfus fazla.'),
      soru('Ortanca yaş yükseldikçe nüfus yaşlanır.', true, 'Nüfusun yarısı daha yaşlıdır.'),
      sikli('Doğum ve ölümün düşük olduğu evre?', ['Birinci', 'Dördüncü'], 1, 'Birincide ikisi de yüksek.'),
      sikli('Geniş tabanlı piramit hangi ülke grubunda?', ['Gelişmekte olan', 'Gelişmiş'], 0, 'Doğum oranı yüksek.'),
    ], [
      {
        soru: 'Geniş tabanlı nüfus piramidi neyi gösterir?',
        siklar: ['Yüksek doğum oranı', 'Yaşlı nüfus fazlalığı'],
        dogru: 0,
        aciklama: {
          dogru: 'Taban en genç yaş grubu; geniş taban çok çocuk demek.',
          yanlis: 'Yaşlı nüfus tepede görünür ve dar tabanlı piramitte fazladır. Geniş taban genç ve çok doğuran nüfus.',
        },
        kart: 3,
      },
    ]),
    konu('cog9-nufus-politika', 'Nüfusla İlgili Fırsat, Sorun ve Politikalar', [
      kart(
        'Demografik fırsat penceresi',
        'Çalışma çağındaki nüfusun oranının en yüksek olduğu dönemdir.\nDoğru kullanılırsa hızlı kalkınma sağlar.',
        undefined,
        { not: 'Türkiye\'nin penceresi 2030\'lara kadar açık; genç nüfusa iş bulunamazsa fırsat işsizlik olarak kapanır.' },
      ),
      kart(
        'Bağımlılık oranı',
        'Çalışma çağı dışındaki nüfusun, çalışma çağındakine oranıdır.\nHem çok genç hem çok yaşlı nüfus bu oranı yükseltir.',
      ),
      kart(
        'Genç nüfusun sorunu',
        'Eğitim ve istihdam yetişmezse fırsat işsizlik sorununa dönüşür.',
      ),
      kart(
        'Yaşlanmanın sorunu',
        'Çalışan başına düşen bağımlı sayısı artar.\nEmeklilik ve sağlık harcamaları yükselir.',
      ),
      kart(
        'Nüfus politikaları',
        'İki yönlü olabilir: artırıcı ya da azaltıcı.\nTürkiye 1965–1983 arasında azaltıcı politika uyguladı.',
      ),
      kart(
        'Bugünkü yönelim',
        'Doğurganlık yenilenme düzeyinin altına indi.\nBu yüzden politikalar artırıcı yöne döndü.',
      ),
      kart(
        'Türkiye’nin politikaları',
        '- **1923-1965:** artırıcı; savaşlarla azalan nüfusu çoğaltmak\n- **1965-1983:** azaltıcı; hızlı artışı dengelemek\n- **Bugün:** yeniden artırıcı yönde',
      ),
      kart(
        'Çin’in tek çocuk politikası',
        '1980-2015 arasında ailelerin çoğuna tek çocuk sınırı konuldu.\nArtış yavaşladı ama nüfus hızla yaşlandı ve erkek-kadın dengesi bozuldu.',
      ),
      kart(
        'Nitelikli nüfus',
        'Nüfusun sayısı kadar eğitim ve sağlık düzeyi de önemlidir.\nNitelikli nüfus üretkenliği ve kalkınmayı artırır.',
      ),
      kart(
        'Göç politikaları',
        'Yaşlanan ülkeler iş gücü açığını göçmenle kapatmaya çalışır.\nGöç, nüfus politikasının bir aracı olarak kullanılabilir.',
      ),
    ], [
      soru('Demografik fırsat penceresi, çalışma çağındaki nüfusun payının yüksek olduğu dönemdir.', true, 'Doğru politikalarla ekonomik büyümeye çevrilebiliyor.'),
      soru('Bağımlılık oranı, çalışma çağı dışındaki nüfusun çalışma çağındakilere oranıdır.', true, 'Hem çocuklar hem yaşlılar bu orana giriyor.'),
      soru('Nüfus politikaları yalnızca nüfusu artırmak amacıyla uygulanır.', false, 'Nüfusu azaltmaya ya da dağılımını değiştirmeye yönelik politikalar da var.'),
      soru('Yaşlanan nüfus, sağlık ve emeklilik harcamalarını azaltır.', false, 'Tersine artırır; çalışan başına düşen yük büyür.'),
      sikli('Doğurganlık yenilenme düzeyinin altına inince politikalar?', ['Azaltıcı oldu', 'Artırıcı yöne döndü'], 1, 'Türkiye 1965 sonrası azaltıcı politikadan bugün artırıcıya döndü.'),
      sikli('Türkiye 1965-1983 arasında hangi politikayı uyguladı?', ['Azaltıcı', 'Artırıcı'], 0, 'Bugün artırıcı.'),
      soru('Eğitim ve istihdam yetişmezse genç nüfus işsizlik sorununa dönüşür.', true, 'Fırsat sorun olur.'),
      soru('Türkiye 1923-1965 arasında nüfusu artırmaya çalıştı.', true, 'Savaş kayıpları sonrası.'),
      soru('Çin\'in tek çocuk politikası nüfusu gençleştirdi.', false, 'Nüfus hızla yaşlandı.'),
      soru('Nüfusun eğitim ve sağlık düzeyi kalkınmayı etkiler.', true, 'Nitelikli nüfus üretkendir.'),
      sikli('Yaşlanan ülkelerin iş gücü açığını kapatma yolu?', ['Göçmen kabulü', 'Doğum sınırlaması'], 0, 'Sınırlama açığı büyütür.'),
      sikli('Türkiye\'nin azaltıcı politika dönemi?', ['1923-1965', '1965-1983'], 1, 'Öncesi artırıcıydı.'),
    ], [
      {
        soru: 'Hem çok genç hem çok yaşlı nüfus hangi oranı yükseltir?',
        siklar: ['Doğurganlık oranı', 'Bağımlılık oranı'],
        dogru: 1,
        aciklama: {
          dogru: 'İkisi de çalışma çağı dışında; çalışan başına düşen yük artar.',
          yanlis: 'Doğurganlık yalnızca doğumla ilgili. Çalışmayan yaş gruplarının çalışanlara oranı bağımlılık oranı.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('cog9-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog9-ekonomi-faktor', 'Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler', [
      kart(
        'Doğal faktörler',
        'Hangi faaliyetin nerede yapılacağını belirler:\niklim, yer şekilleri, toprak, su ve yer altı kaynakları',
      ),
      kart(
        'İklimin belirleyiciliği',
        '- **Çay:** Doğu Karadeniz’de yetişir.\n- **Pamuk:** Çukurova’da yetişir.\nSıcaklık ve yağış isteği bunu zorunlu kılar.',
      ),
      kart(
        'Yer şekillerinin etkisi',
        '- **Engebeli arazi:** tarımı ve ulaşımı zorlaştırır, maliyeti artırır.\n- **Düz ovalar:** sanayiyi çeker.',
      ),
      kart(
        'Beşerî faktörler',
        'Sermaye, iş gücü, teknoloji, pazar ve ulaşım.\nDoğal koşullar elverişli olsa da bunlar yoksa faaliyet gelişmez.',
      ),
      kart(
        'Üç sektör',
        '- **Birincil:** tarım, madencilik\n- **İkincil:** sanayi\n- **Üçüncül:** hizmet',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Birincil', alt: 'tarım, madencilik' },
            { ad: 'İkincil', alt: 'sanayi' },
            { ad: 'Üçüncül', alt: 'hizmet' },
          ],
        },
      ),
      kart(
        'Karşılıklı etki',
        'Ekonomik faaliyet de doğayı değiştirir.\nBaraj, madencilik ve aşırı sulama çevreyi dönüştürür.',
        undefined,
        { not: 'Aral Gölü: pamuk sulaması için nehirler çevrildi, göl %90 küçüldü. Ekonomi doğayı değiştirdi.' },
      ),
      kart(
        'Hammaddeye yakınlık',
        'Bozulabilen ya da ağır hammadde kaynağında işlenir.\n- **Şeker fabrikası:** pancar alanında\n- **Demir-çelik:** Karabük, Ereğli, İskenderun',
      ),
      kart(
        'Enerji ve konum',
        'Fırat ve Dicle üzerindeki barajlar büyük hidroelektrik üretir.\nEnerji bol olan yer, çok enerji harcayan sanayiyi çeker.',
      ),
      kart(
        'Dördüncül sektör',
        'Bilgi üretimi, araştırma-geliştirme ve yazılım gibi işlerdir.\nGelişmiş ekonomilerde payı hızla büyür.',
      ),
      kart(
        'Sektörler ve gelişmişlik',
        '- **Gelişmemiş ülke:** çalışanların çoğu tarımda\n- **Gelişmiş ülke:** çalışanların çoğu hizmette\nKalkınma, iş gücünün tarımdan hizmete kaymasıdır.',
      ),
    ], [
      soru('Tarım faaliyetleri iklim koşullarından doğrudan etkilenir.', true, 'Sıcaklık ve yağış, yetişecek ürünü belirliyor.'),
      soru('Sanayi ikincil, hizmet ise üçüncül sektör sayılır.', true, 'Birincil sektör doğrudan doğadan üretim yapan tarım ve madencilik.'),
      soru('Yer şekillerinin ulaşım ağının kurulmasında etkisi yoktur.', false, 'Dağlık alanda yol yapımı hem zor hem pahalı; ağ buna göre şekilleniyor.'),
      soru('Ekonomik faaliyetleri yalnızca doğal faktörler belirler.', false, 'Sermaye, iş gücü, teknoloji ve pazar gibi beşerî faktörler de belirleyici.'),
      sikli('Pamuk hangi ovada yetişir?', ['Doğu Karadeniz', 'Çukurova'], 1, 'Sıcaklık ve yağış isteği.'),
      sikli('Düz ovalar hangi faaliyeti çeker?', ['Hayvancılık', 'Sanayi'], 1, 'Engebe maliyeti artırır.'),
      soru('Barajlar ve aşırı sulama çevreyi dönüştürebilir.', true, 'Aral Gölü, pamuk sulaması yüzünden %90 küçüldü.'),
      soru('Şeker fabrikaları pancar alanlarına yakın kurulur.', true, 'Pancar çabuk bozulur ve ağırdır.'),
      soru('Gelişmiş ülkelerde çalışanların çoğu tarımda çalışır.', false, 'Çoğu hizmet sektöründedir.'),
      soru('Yazılım geliştirme dördüncül sektöre girer.', true, 'Bilgi üretimi.'),
      sikli('Türkiye\'de büyük hidroelektrik santralleri hangi nehirlerde?', ['Fırat ve Dicle', 'Meriç ve Sakarya'], 0, 'Güneydoğu Anadolu Projesi.'),
      sikli('Demir-çelik tesislerinden biri nerede?', ['Rize', 'Karabük'], 1, 'Karabük, Ereğli, İskenderun.'),
    ], [
      {
        soru: 'Çayın Doğu Karadeniz\'de yetişmesini belirleyen faktör?',
        siklar: ['Sermaye', 'İklim'],
        dogru: 1,
        aciklama: {
          dogru: 'Bol yağış ve ılıman sıcaklık çayın isteği; başka yerde para da yetmez.',
          yanlis: 'Sermaye beşerî faktör; iklim uygun değilse çay yetişmez. Belirleyen bol yağışlı ılıman iklim.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('cog9-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog9-tehlike-risk', 'Tehlike, Risk ve Afet', [
      kart(
        'Tehlike',
        'Zarar verme potansiyeli olan doğal ya da beşerî olaydır.\nDeprem başlı başına bir tehlikedir.',
      ),
      kart(
        'Risk',
        'Tehlike gerçekleşirse beklenen kayıptır.\nAynı deprem, hazırlıklı bir şehirde daha düşük risk taşır.',
      ),
      kart(
        'Afet',
        'Toplumun kendi imkânlarıyla baş edemediği olaydır.\nCan ve mal kaybına yol açar.',
      ),
      kart(
        'Üçü arasındaki fark',
        '- **Tehlike:** olabilir\n- **Risk:** olursa beklenen kayıp\n- **Afet:** gerçekleşti ve baş edilemedi',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Tehlike', alt: 'olabilir' },
            { ad: 'Risk', alt: 'beklenen kayıp' },
            { ad: 'Afet', alt: 'gerçekleşti' },
          ],
        },
      ),
      kart(
        'Doğa olayı afet değildir',
        'İnsan ve yapı yoksa deprem yalnızca bir doğa olayıdır.\nAfet, olayın toplumla karşılaşmasıyla oluşur.',
        undefined,
        { not: 'Çölde 7 büyüklüğünde deprem doğa olayı; aynı deprem denetimsiz binaların altında afet.' },
      ),
      kart(
        'Kırılganlık',
        'Aynı şiddetteki olay her yerde aynı kaybı vermez.\nYapı kalitesi ve gelir düzeyi düşük yerlerde kayıp büyür.',
      ),
      kart(
        'Riski ne büyütür?',
        'Risk üç şeyin birleşimidir:\n- Tehlikenin şiddeti ve sıklığı\n- Kırılganlık (zayıf yapı, yoksulluk)\n- Baş etme kapasitesinin azlığı',
      ),
      kart(
        'Tehlike haritaları',
        'Deprem, sel ve heyelan tehlikesi haritalarla gösterilir.\nTürkiye Deprem Tehlike Haritası yapı yönetmeliğine esas alınır.',
      ),
      kart(
        'Kapasite',
        'Toplumun afete hazırlık ve toparlanma gücüdür.\nErken uyarı, eğitim, sağlam altyapı ve örgütlü kurumlar kapasiteyi artırır.',
      ),
      kart(
        'Afet ve kalkınma',
        'Büyük bir afet yılların kalkınmasını birkaç günde geri alabilir.\nAfete dayanıklı yatırım kalkınmanın parçasıdır.',
      ),
    ], [
      soru('Bir doğa olayı, insana ve yapılara zarar verdiğinde afet hâline gelir.', true, 'Afeti tanımlayan şey olayın kendisi değil sonucu.'),
      soru('Deprem, gerçekleşmeden önce tehlike sayılmaz.', false, 'Deprem başlı başına bir tehlikedir; gerçekleşir ve baş edilemezse afete dönüşür.'),
      soru('Risk, bir tehlikenin zarara yol açma olasılığıdır.', true, 'Tehlike var olan bir olasılık; risk onun bizi etkileme ihtimali.'),
      soru('Kırılganlık, bir toplumun afete karşı direncini artıran özelliklerdir.', false, 'Tam tersi: kırılganlık zarar görme ihtimalini artıran özellikler.'),
      sikli('Hazırlıklı şehirde deprem için hangisi düşer?', ['Risk', 'Tehlike'], 0, 'Tehlike aynı, beklenen kayıp düşük.'),
      sikli('Toplumun kendi imkânıyla baş edemediği olay?', ['Afet', 'Tehlike'], 0, 'Can ve mal kaybı.'),
      soru('Tehlike "olabilir", risk "beklenen kayıp", afet "gerçekleşti ve baş edilemedi" demektir.', true, 'Üçü aynı olayın farklı aşamaları.'),
      soru('Kırılganlık arttıkça afet riski artar.', true, 'Aynı tehlike daha çok kayıp verir.'),
      soru('Erken uyarı sistemleri baş etme kapasitesini azaltır.', false, 'Artırır.'),
      soru('Deprem tehlike haritası yapı yönetmeliğine esas alınır.', true, 'Yapılar bölgenin tehlikesine göre tasarlanır.'),
      sikli('Riski büyüten etken?', ['Zayıf yapı stoku', 'Güçlü kurumlar'], 0, 'Güçlü kurumlar kapasiteyi artırır.'),
      sikli('Toplumun afete hazırlanma ve toparlanma gücü?', ['Tehlike', 'Kapasite'], 1, 'Tehlike olayın kendisidir.'),
    ], [
      {
        soru: 'Boş bir çölde olan deprem nedir?',
        siklar: ['Afet', 'Doğa olayı'],
        dogru: 1,
        aciklama: {
          dogru: 'İnsan ve yapı yoksa kayıp yok; afet olayın toplumla karşılaşmasıdır.',
          yanlis: 'Afet için can ve mal kaybı gerekir. Kimsenin olmadığı yerdeki deprem yalnızca bir doğa olayı.',
        },
        kart: 5,
      },
    ]),
    konu('cog9-afet-tur', 'Afet Türleri', [
      kart(
        'Dört grup',
        'Afetler kaynağına göre gruplanır.\nSon grubun kaynağı doğrudan insandır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Örnek'],
          satirlar: [
            ['Jeolojik', 'Deprem, heyelan'],
            ['Meteorolojik', 'Sel, kuraklık'],
            ['Biyolojik', 'Salgın, yangın'],
            ['Beşerî', 'Sanayi kazası'],
          ],
        },
      ),
      kart(
        'Jeolojik afetler',
        'Deprem, volkanik patlama, heyelan ve tsunami.\nKaynağı yer kabuğunun hareketidir.',
      ),
      kart(
        'Meteorolojik afetler',
        '- Sel ve kuraklık\n- Fırtına ve dolu\n- Çığ ve aşırı sıcaklar\nKaynağı atmosferdeki olaylardır.',
      ),
      kart(
        'Biyolojik afetler',
        '- Salgın hastalıklar\n- Orman yangınları\n- Zararlı böcek istilaları',
      ),
      kart(
        'Beşerî afetler',
        'Endüstriyel kazalar, nükleer sızıntılar ve savaşlar.\nKaynağı insandır.',
      ),
      kart(
        'Zincirleme afet',
        'Bir afet ötekini tetikleyebilir:\ndeprem → heyelan → taşkın → salgın',
        undefined,
        { not: '2011 Japonya: deprem → tsunami → nükleer sızıntı. Üç afet tek olaydan, üçü ayrı gruptan.' },
      ),
      kart(
        'Türkiye’de en sık',
        '- Deprem\n- Heyelan\n- Sel\nÜlkenin büyük bölümü etkin fay kuşakları üzerindedir.',
      ),
      kart(
        'Heyelan',
        'Eğimli yamaçtaki toprağın kayarak yer değiştirmesidir.\nEn sık Karadeniz’de görülür: eğim + bol yağış + killi toprak + yanlış yol kazısı.',
      ),
      kart(
        'Çığ',
        'Eğimli, karlı yamaçlarda kar kütlesinin hızla kaymasıdır.\nDoğu Anadolu ve Doğu Karadeniz’in yüksek kesimlerinde görülür.',
      ),
      kart(
        'Tsunami',
        'Deniz tabanındaki deprem ya da heyelanla oluşan dev dalgalardır.\nAçık denizde fark edilmez, kıyıya yaklaştıkça yükselir.',
      ),
      kart(
        'Kuraklık',
        'Uzun süre ortalamanın altında yağış düşmesidir.\nYavaş gelişen, fark edilmesi geç olan bir afettir; tarım ve suyu vurur.',
      ),
      kart(
        'Orman yangınları',
        'Yaz kuraklığı ve rüzgâr yüzünden en çok Akdeniz ve Ege kıyılarında görülür.\nYangınların büyük kısmı insan kaynaklıdır.',
      ),
    ], [
      soru('Deprem ve heyelan jeolojik afetler arasında yer alır.', true, 'Kaynağı yer kabuğundaki hareketler.'),
      soru('Kuraklık ve sel meteorolojik afetlerdendir.', true, 'İkisinin de kaynağı atmosfer olayları.'),
      soru('Salgın hastalıklar beşerî afet sayılır.', false, 'Biyolojik afet grubunda yer alıyor.'),
      soru('Bir afet başka bir afeti tetikleyemez.', false, 'Deprem sonrası çıkan yangın ve tsunami zincirleme afete örnek.'),
      sikli('Sanayi kazası hangi afet grubundadır?', ['Meteorolojik', 'Beşerî'], 1, 'Kaynağı doğrudan insan.'),
      sikli('Orman yangını hangi gruptadır?', ['Biyolojik', 'Beşerî'], 0, 'Salgın ve böcek istilası da.'),
      sikli('Çığ hangi afet grubundadır?', ['Biyolojik', 'Meteorolojik'], 1, 'Kaynağı atmosfer olayları.'),
      soru('Türkiye\'de en sık görülen afetler deprem, heyelan ve seldir.', true, 'Etkin fay kuşakları.'),
      soru('Heyelan en sık Karadeniz Bölgesi\'nde görülür.', true, 'Eğim ve bol yağış.'),
      soru('Tsunami açık denizde çok yüksek dalga olarak görülür.', false, 'Açık denizde fark edilmez; kıyıda yükselir.'),
      soru('Kuraklık yavaş gelişen bir afettir.', true, 'Geç fark edilir.'),
      sikli('Orman yangınları en çok nerede?', ['Akdeniz ve Ege', 'Doğu Anadolu'], 0, 'Yaz kuraklığı.'),
      sikli('Karlı yamaçta kar kütlesinin kayması?', ['Heyelan', 'Çığ'], 1, 'Heyelan toprak kaymasıdır.'),
      soru('Orman yangınlarının büyük kısmı doğal sebeplidir.', false, 'Çoğu insan kaynaklıdır.'),
    ], [
      {
        soru: 'Heyelan hangi afet grubundadır?',
        siklar: ['Meteorolojik', 'Jeolojik'],
        dogru: 1,
        aciklama: {
          dogru: 'Kaynağı yer kabuğu ve kütle hareketi; yağış tetikleyebilir ama grup jeolojik.',
          yanlis: 'Yağış tetikler ama olay yer kütlesinin kaymasıdır; jeolojik afetlerden. Meteorolojik olanlar sel, fırtına, dolu.',
        },
        kart: 2,
      },
      {
        soru: 'Heyelanı en çok hangi koşullar birlikte tetikler?',
        siklar: ['Eğim ve bol yağış', 'Düz arazi ve kuraklık'],
        dogru: 0,
        aciklama: {
          dogru: 'Suya doygun toprak eğimli yamaçta kayar.',
          yanlis: 'Düz ve kurak arazide toprak kaymaz. Eğim ve yağış birlikte heyelan yapar.',
        },
        kart: 8,
      },
    ]),
    konu('cog9-afet-yonetim', 'Bütüncül Afet Yönetimi', [
      kart(
        'Dört aşama',
        'Döngü hiç kapanmaz.\nİyileştirme, bir sonraki afet için zarar azaltmaya bağlanır.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Zarar azaltma' },
            { ad: 'Hazırlık' },
            { ad: 'Müdahale' },
            { ad: 'İyileştirme' },
          ],
        },
      ),
      kart(
        'Zarar azaltma',
        '**En ucuz ve en etkili aşamadır.**\nDoğru yer seçimi, sağlam yapı ve imar denetimi.',
      ),
      kart(
        'Hazırlık',
        '- Tatbikat\n- Afet çantası\n- Toplanma alanı\n- Erken uyarı sistemleri',
      ),
      kart(
        'Müdahale',
        'İlk 72 saat kritiktir.\nArama-kurtarma, sağlık hizmeti ve acil barınma bu aşamadadır.',
      ),
      kart(
        'İyileştirme',
        'Kalıcı konut, altyapı onarımı, ekonomik ve psikososyal destek.\nEn uzun süren aşamadır.',
      ),
      kart(
        'Neden bütüncül?',
        'Yalnızca müdahaleye odaklanan yönetim her afette baştan başlar.\nAsıl kazanç afet olmadan alınır.',
        undefined,
        { not: 'Deprem öncesi 1 lira güçlendirme, sonrası 7 lira enkaz ve yeniden yapım: zarar azaltma en ucuz aşama.' },
      ),
      kart(
        'AFAD',
        'Afet ve Acil Durum Yönetimi Başkanlığı 2009’da kuruldu.\nAfetin bütün aşamalarında kurumları tek çatı altında koordine eder.',
      ),
      kart(
        'Afet çantası',
        '- Su ve dayanıklı yiyecek\n- İlk yardım malzemesi, ilaç\n- El feneri, pil, düdük\n- Kimlik ve önemli belgelerin kopyası',
      ),
      kart(
        'Deprem anında',
        '**Çök, kapan, tutun.**\n- Pencere ve devrilebilecek eşyadan uzak dur.\n- Asansör kullanma, merdivene koşma.\n- Sarsıntı bitince toplanma alanına git.',
      ),
      kart(
        'Toplanma alanı',
        'Afetten sonra güvenle beklenecek açık alandır.\nAdrese en yakın alan AFAD ve e-Devlet üzerinden öğrenilebilir.',
      ),
      kart(
        'Zorunlu deprem sigortası',
        'Konutlar için zorunlu deprem sigortası (DASK) 2000 yılında başladı.\nHasarın maliyetini devlete ve aileye bırakmak yerine paylaştırır.',
      ),
    ], [
      soru(
        'Afet yönetimi ancak afet gerçekleştikten sonra başlar.',
        false,
        'Döngü zarar azaltma ve hazırlıkla, yani afetten önce başlıyor.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Zarar azaltma' },
            { ad: 'Hazırlık' },
            { ad: 'Müdahale' },
            { ad: 'İyileştirme' },
          ],
        },
      ),
      soru('Zarar azaltma aşaması afetten önce yapılan çalışmaları kapsar.', true, 'Yapı denetimi ve risk haritaları bu aşamada.'),
      soru('İyileştirme aşaması yalnızca yıkılan binaların onarılmasıdır.', false, 'Ekonomik ve toplumsal hayatın yeniden kurulması da bu aşamanın işi.'),
      soru('Bütüncül afet yönetimi aşamaları birbirine bağlı bir döngü olarak ele alır.', true, 'İyileştirme sırasında alınan dersler yeni zarar azaltma çalışmalarını besliyor.'),
      sikli('İlk 72 saatin kritik olduğu aşama?', ['İyileştirme', 'Müdahale'], 1, 'Arama-kurtarma.'),
      sikli('En uzun süren aşama?', ['Hazırlık', 'İyileştirme'], 1, 'Kalıcı konut, altyapı.'),
      soru('Afet çantası ve tatbikat hazırlık aşamasının parçasıdır.', true, 'Toplanma alanı ve erken uyarı da hazırlığa girer.'),
      soru('AFAD 2009\'da kuruldu.', true, 'Kurumları tek çatı altında toplar.'),
      soru('Deprem anında asansörle çıkmak en güvenli yoldur.', false, 'Asansör kullanılmaz.'),
      soru('Toplanma alanı e-Devlet üzerinden öğrenilebilir.', true, 'AFAD verisiyle.'),
      sikli('Konutlar için zorunlu deprem sigortası?', ['DASK', 'SGK'], 0, 'SGK sosyal güvenlik kurumu.'),
      sikli('Deprem anındaki temel hareket?', ['Merdivene koşmak', 'Çök, kapan, tutun'], 1, 'Merdiven tehlikelidir.'),
      soru('Afet çantasında kimlik belgelerinin kopyası bulunmalıdır.', true, 'Kimlik kanıtı gerekebilir.'),
    ], [
      {
        soru: 'Afet yönetiminin en ucuz ve en etkili aşaması?',
        siklar: ['Zarar azaltma', 'Müdahale'],
        dogru: 0,
        aciklama: {
          dogru: 'Sağlam yapı ve doğru yer seçimi afet olmadan kazandırır.',
          yanlis: 'Müdahale en pahalı ve en geç aşama. Asıl kazanç afet olmadan önce: zarar azaltma.',
        },
        kart: 2,
      },
      {
        soru: 'Afetlerde kurumları koordine eden başkanlık?',
        siklar: ['AFAD', 'TÜİK'],
        dogru: 0,
        aciklama: {
          dogru: 'Afet ve Acil Durum Yönetimi Başkanlığı, 2009.',
          yanlis: 'TÜİK istatistik kurumudur. Afet koordinasyonu AFAD\'ın.',
        },
        kart: 7,
      },
    ]),
  ]),
  tema('cog9-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog9-bolge', 'Bölge ve Bölge Sınırı', [
      kart(
        'Bölge nedir?',
        'Belirli bir ölçüte göre benzer özellik gösteren alandır.\nBu özellikleriyle çevresinden ayrılır.',
      ),
      kart(
        'Ölçüt bölgeyi değiştirir',
        'Aynı yer, iklime göre bir bölgede, sanayiye göre başka bir bölgede olabilir.',
        undefined,
        { not: 'Antalya iklime göre Akdeniz bölgesi, ekonomiye göre turizm bölgesi; aynı şehir iki haritada iki bölgede.' },
      ),
      kart(
        'Sınırlar keskin değildir',
        '- **Doğal bölge sınırı:** bir çizgi değil, geçiş kuşağı\n- **İdari sınır:** keskin ve yapay',
      ),
      kart(
        'Bölge türleri',
        '- **Özelliğine göre:** doğal, beşerî, ekonomik\n- **Büyüklüğüne göre:** kıta altı, ülke, yerel',
      ),
      kart(
        'Bölge sınırı değişir',
        'Ölçüt aynı kalsa da koşullar değişirse sınır kayar.\nÖrnek: kuraklık, tarım bölgesinin sınırını geriye çeker.',
      ),
      kart(
        'Türkiye’nin coğrafi bölgeleri',
        'Yedi bölge **1941**’de belirlendi; ölçüt büyük ölçüde doğal koşullardı.\nCoğrafi bölgeler idari birim değildir.',
      ),
      kart(
        'Yedi coğrafi bölge',
        '- Marmara, Ege, Akdeniz\n- Karadeniz, İç Anadolu\n- Doğu Anadolu, Güneydoğu Anadolu\nEn büyüğü Doğu Anadolu, en küçüğü Güneydoğu Anadolu’dur.',
      ),
      kart(
        'Bölge, bölüm, yöre',
        '- **Bölge:** en geniş birim (Karadeniz)\n- **Bölüm:** bölgenin alt birimi (Doğu Karadeniz)\n- **Yöre:** daha küçük, kendine özgü alan (Çarşamba Ovası)',
      ),
      kart(
        'Fonksiyonel bölge',
        'Bir merkezin çevresini etkilediği alandır.\nBir şehrin çarşısına, hastanesine gelinen köyler onun fonksiyonel bölgesidir.',
      ),
      kart(
        'İstatistikî bölgeler',
        'Türkiye verilerin toplanması ve kalkınma planları için istatistikî bölge birimlerine (İBBS) ayrıldı.\nBu bölgeler yedi coğrafi bölgeden farklıdır.',
      ),
    ], [
      soru('Bölge sınırları, seçilen ölçüte göre değişir.', true, 'İklime göre çizilen bölge ile tarıma göre çizilen bölge aynı olmuyor.'),
      soru('Türkiye nin coğrafi bölgeleri il sınırlarıyla birebir örtüşür.', false, 'Bazı iller iki bölgeye birden dağılıyor.'),
      soru('Bölge sınırları keskin çizgiler değildir; geçiş alanları vardır.', true, 'Doğadaki değişim kademeli olduğu için sınır bir kuşak hâlinde.'),
      soru('Bir yer aynı anda birden çok bölgenin içinde yer alamaz.', false, 'Farklı ölçütlerle çizilen bölgeler üst üste binebilir.'),
      sikli('İdari sınırlar nasıldır?', ['Keskin ve yapay', 'Geçiş kuşağı'], 0, 'Doğal bölge sınırı ise bir geçiş kuşağıdır.'),
      sikli('Kuraklık tarım bölgesinin sınırını ne yapar?', ['Genişletir', 'Geriye çeker'], 1, 'Koşul değişince sınır kayar.'),
      soru('Türkiye\'nin yedi coğrafi bölgesi 1941\'de belirlendi.', true, 'Ölçüt büyük ölçüde doğal koşullardı.'),
      soru('Türkiye\'nin en büyük coğrafi bölgesi Doğu Anadolu\'dur.', true, 'Yüz ölçümü en büyük.'),
      soru('Bölüm, bölgeden daha geniş bir birimdir.', false, 'Bölüm bölgenin alt birimidir.'),
      soru('Bir şehrin etkilediği alan fonksiyonel bölgedir.', true, 'Hizmet alınan çevre.'),
      sikli('Türkiye\'nin en küçük coğrafi bölgesi?', ['Marmara', 'Güneydoğu Anadolu'], 1, 'Marmara ikinci en küçük.'),
      sikli('Doğu Karadeniz neyin örneğidir?', ['Bölüm', 'Yöre'], 0, 'Karadeniz bölgesinin alt birimi.'),
    ], [
      {
        soru: 'Türkiye\'nin yedi coğrafi bölgesi hangi ölçüte göre belirlendi?',
        siklar: ['Doğal koşullar', 'İdari sınırlar'],
        dogru: 0,
        aciklama: {
          dogru: '1941\'de iklim, yer şekli ve bitki örtüsü esas alındı; idari birim değiller.',
          yanlis: 'Bölgeler idari birim değil. 1941\'de büyük ölçüde doğal koşullara göre çizildi.',
        },
        kart: 6,
      },
    ]),
  ]),
])
