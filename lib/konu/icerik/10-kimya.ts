import { kart, konu, program, soru, tema } from '../tip'

/**
 * 10. sınıf Kimya — Maarif Modeli.
 *
 * Konu adları ve sırası programın İçerik Çerçevesi'nden
 * (`maarif/iskelet.json`); `maarif.test.ts` denetliyor.
 *
 * **Mol burada.** Eski programda 9. sınıfta olan mol kavramı ve
 * stokiyometri Maarif'te 10. sınıfın ilk temasına taşındı; 9. sınıf
 * dosyasında bu yüzden yok.
 */
export const kimya10 = program('kimya', 10, 'Tepkimelerden çözeltilere', [
  tema('kim10-t1', 'Etkileşim', [
    konu('kim10-gosterge', 'Kimyasal Değişimin Göstergeleri', [
      kart(
        'Fiziksel mi kimyasal mı?',
        'Fiziksel değişimde madde aynı kalır, yalnızca hâli ya da şekli değişir. Kimyasal değişimde yeni madde oluşur.',
      ),
      kart(
        'Gözle görülen kanıtlar',
        'Beş gösterge kimyasal değişimi işaret eder ama hiçbiri tek başına kesin kanıt değildir.',
        {
          tur: 'tablo',
          basliklar: ['Gösterge', 'Örnek'],
          satirlar: [
            ['Renk değişimi', 'Paslanma'],
            ['Gaz çıkışı', 'Kabartma tozu'],
            ['Çökelek', 'Kireçlenme'],
            ['Isı / ışık', 'Yanma'],
            ['Koku', 'Bozulan süt'],
          ],
        },
      ),
      kart(
        'Aldatıcı olabilir',
        'Kaynayan suda da kabarcık çıkar ama bu kimyasal değişim değil. Tek bir gösterge kanıt sayılmaz.',
      ),
      kart(
        'Kesin ölçüt',
        'Sorulacak soru şu: ortaya yeni özellikleri olan bir madde çıktı mı? Çıkmadıysa değişim fizikseldir.',
      ),
      kart(
        'Geri dönüşümlü mü?',
        'Buzun erimesi kolayca geri alınır; yanmış kâğıt geri gelmez. Kimyasal değişimi geri almak yeni bir tepkime ister.',
      ),
      kart(
        'Çözünme hangisi?',
        'Tuzun suda çözünmesi fizikseldir: su buharlaştırıldığında tuz geri alınır ve kimliği değişmemiştir.',
      ),
    ], [
      soru('Kimyasal değişimin kesin ölçütü yeni bir maddenin oluşmasıdır.', true, 'Gözle görülen belirtiler ipucu; kesin ölçüt bu.'),
      soru('Renk değişimi her zaman kimyasal değişimin göstergesidir.', false, 'Boya karıştırmak gibi fiziksel olaylarda da renk değişebiliyor.'),
      soru('Şekerin suda çözünmesi kimyasal bir değişimdir.', false, 'Şeker şeker olarak kalıyor; bu fiziksel bir değişim.'),
      soru('Gaz çıkışı ve çökelek oluşumu kimyasal değişim belirtilerindendir.', true, 'İkisi de yeni bir maddenin oluştuğuna işaret ediyor.'),
    ]),
    konu('kim10-olusum', 'Kimyasal Tepkimelerin Oluşumu', [
      kart(
        'Bağlar kopar, yenisi kurulur',
        'Tepkimede atomlar yok olmaz; yalnızca aralarındaki bağlar kopar ve atomlar yeniden düzenlenir.',
      ),
      kart(
        'Kütle korunur',
        'Girenlerin toplam kütlesi ürünlerin toplam kütlesine eşittir. Atom sayısı iki tarafta da aynıdır.',
      ),
      kart(
        'Enerji alışverişi',
        'Bağ kırmak enerji ister, bağ kurmak enerji verir. Farkı pozitifse ortam soğur, negatifse ısınır.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'tepkime yolu',
          yAd: 'enerji',
          egriler: [
            {
              noktalar: [
                [0.5, 3],
                [2, 3.4],
                [4, 5.2],
                [6, 1.6],
                [7.5, 1.4],
              ],
            },
          ],
          etiketler: [
            { x: 4, y: 5.8, ad: 'aktivasyon', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Ekzotermik ve endotermik',
        'Ekzotermik tepkime ısı verir ve ortam ısınır; endotermik tepkime ısı alır ve ortam soğur.',
      ),
      kart(
        'Çarpışma gerekir',
        'Tanecikler yeterli enerjiyle ve uygun yönde çarpışmazsa tepkime olmaz. Isıtmak bu yüzden hızlandırır.',
      ),
      kart(
        'Aktivasyon enerjisi',
        'Tepkimenin başlaması için aşılması gereken eşik. Katalizör bu eşiği düşürür, tepkimeyi değiştirmez.',
      ),
      kart(
        'Hızı etkileyen etmenler',
        'Sıcaklık, derişim, temas yüzeyi ve katalizör. Dördü de çarpışma sayısını ya da başarısını artırır.',
      ),
    ], [
      soru(
        'Şemadaki tepkime endotermiktir.',
        false,
        'Ürünlerin enerjisi girenlerden düşük; tepkime ısı veriyor, yani ekzotermik.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 8],
          xAd: 'tepkime yolu',
          yAd: 'enerji',
          egriler: [
            {
              noktalar: [
                [0.3, 4],
                [1, 4],
                [2, 7],
                [3, 1.5],
                [4.5, 1.5],
              ],
            },
          ],
        },
      ),
      soru('Kimyasal tepkimelerde toplam kütle korunur.', true, 'Atomlar yok olmuyor, yalnızca yeniden diziliyor.'),
      soru('Tepkimenin gerçekleşmesi için taneciklerin uygun yönde ve yeterli enerjiyle çarpışması gerekir.', true, 'Her çarpışma tepkimeye yol açmıyor.'),
      soru('Katalizör aktivasyon enerjisini artırarak tepkimeyi hızlandırır.', false, 'Aktivasyon enerjisini düşürerek hızlandırır.'),
    ]),
    konu('kim10-tur', 'Kimyasal Tepkime Türleri', [
      kart(
        'Yanma tepkimeleri',
        'Madde oksijenle birleşir, ısı ve ışık açığa çıkar. Organik yanmada ürünler karbondioksit ve sudur.',
      ),
      kart(
        'Tam ve eksik yanma',
        'Oksijen yeterliyse CO₂ çıkar; yetersizse zehirli karbonmonoksit ve is oluşur. Soba zehirlenmelerinin sebebi budur.',
      ),
      kart(
        'Asit-baz tepkimesi',
        'Asit ile baz birleşerek tuz ve su verir. Nötrleşme de denir; mide ilacı bu ilkeyle çalışır.',
      ),
      kart(
        'Çökelme tepkimesi',
        'İki çözelti karışınca suda çözünmeyen bir katı oluşur. Oluşan katıya çökelek denir.',
      ),
      kart(
        'Redoks tepkimesi',
        'Elektron alışverişi vardır: elektron veren yükseltgenir, alan indirgenir. Paslanma ve pil tepkimeleri böyledir.',
      ),
      kart(
        'Sentez ve analiz',
        'Sentezde birden çok madde birleşip tek ürün verir; analizde tek madde parçalanır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Kalıp'],
          satirlar: [
            ['Sentez', 'A + B → AB'],
            ['Analiz', 'AB → A + B'],
            ['Yer değiştirme', 'A + BC → AC + B'],
          ],
        },
      ),
      kart(
        'Yer değiştirme',
        'Aktif bir element, bileşikteki daha az aktif elementin yerini alır. Aktiflik sırası hangi yönde olacağını söyler.',
      ),
    ], [
      soru('Yanma tepkimeleri ekzotermiktir.', true, 'Isı ve ışık açığa çıkıyor.'),
      soru('Eksik yanmada karbon monoksit ve is oluşabilir.', true, 'Oksijen yetersizse yanma tamamlanmıyor.'),
      soru('Nötrleşme tepkimesinde her zaman gaz açığa çıkar.', false, 'Asit ile bazın tepkimesinden tuz ve su oluşur; gaz her durumda çıkmaz.'),
      soru('Redoks tepkimelerinde elektron alışverişi olmaz.', false, 'Tanımı tam da elektron alışverişine dayanıyor.'),
    ]),
    konu('kim10-mol', 'Mol Kavramı', [
      kart(
        'Mol nedir?',
        'Tanecik saymanın birimi. 1 mol, 6,02×10²³ tanecik demektir; bu sayıya Avogadro sayısı denir.',
      ),
      kart(
        'Neden gerekli?',
        'Atomlar tek tek tartılamaz. Mol, laboratuvarda tartılan gramı tanecik sayısına çeviren köprüdür.',
      ),
      kart(
        'Molar kütle',
        '1 molün gram cinsinden kütlesi. Sayıca atom ya da molekül kütlesine eşittir: su için 18 g/mol.',
      ),
      kart(
        'Gazlarda molar hacim',
        'Normal şartlarda (0 °C, 1 atm) her ideal gazın 1 molü 22,4 litre yer kaplar; gazın cinsi fark etmez.',
      ),
      kart(
        'Üç yönlü çevrim',
        'Kütle, mol ve tanecik sayısı arasında gidip gelmenin tek bir yolu var: her zaman önce mole çevrilir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Kütle (g)' },
            { ad: 'Mol', renk: 'ikincil' },
            { ad: 'Tanecik' },
          ],
        },
      ),
      kart(
        'Formülden mol',
        '1 mol H₂SO₄ içinde 2 mol H, 1 mol S ve 4 mol O atomu bulunur. Alt indisler mol oranını verir.',
      ),
      kart(
        'Mol bir sayıdır',
        'Düzine gibi düşünülebilir: 1 düzine 12 tane, 1 mol 6,02×10²³ tane demek. Farkı yalnızca büyüklüğü.',
      ),
    ], [
      soru('1 mol madde 6,02 · 10²³ tanecik içerir.', true, 'Bu sayıya Avogadro sayısı deniyor.'),
      soru('Normal koşullarda 1 mol gaz 22,4 litre hacim kaplar.', true, 'Gazın cinsi değişse de bu hacim aynı.'),
      soru('Mol bir kütle birimidir.', false, 'Mol bir sayı birimi: belirli sayıda tanecik demek.'),
      soru('Farklı iki maddenin birer molünün kütleleri eşittir.', false, 'Tanecik sayıları eşit ama tanecik kütleleri farklı.'),
    ]),
    konu('kim10-denklestirme', 'Kimyasal Tepkime Denklemlerinin Denkleştirilmesi', [
      kart(
        'Neden denkleştirilir?',
        'Atom yoktan var olmaz. İki tarafta her elementin atom sayısı eşit olmalıdır.',
      ),
      kart(
        'Katsayı değişir, indis değişmez',
        'Formülün alt indisine dokunulmaz — değiştirmek maddeyi değiştirir. Yalnızca önündeki katsayı büyütülür.',
      ),
      kart(
        'İzlenecek sıra',
        'Sıra keyfî değil: en sona bırakılan elementler birden çok bileşikte geçtiği için en esnek olanlardır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tek bileşikte geçenler' },
            { ad: 'Metaller ve ametaller' },
            { ad: 'Hidrojen' },
            { ad: 'Oksijen' },
            { ad: 'Katsayıları sadeleştir', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Hâl gösterimi',
        'Denklemde (k) katı, (s) sıvı, (g) gaz, (suda) sulu çözelti demektir. Çökelek ve gaz çıkışı buradan okunur.',
      ),
      kart(
        'Denetleme',
        'Bittiğinde her element için iki tarafın atom sayısı tek tek sayılır. Bir tanesi tutmuyorsa denklem denk değildir.',
      ),
      kart(
        'Kesirli katsayı',
        'Ara adımda kesir kullanılabilir; sonunda tüm denklem uygun sayıyla çarpılarak tam sayıya çevrilir.',
      ),
    ], [
      soru('Denkleştirme yapılırken formüllerdeki indisler değiştirilebilir.', false, 'İndis değişirse madde değişir; yalnızca katsayılar değiştirilir.'),
      soru('Denkleştirme, kütlenin korunumu yasasının bir gereğidir.', true, 'İki tarafta her elementin atom sayısı eşit olmalı.'),
      soru('Denklemdeki (k), (s), (g) gösterimleri maddenin fiziksel hâlini belirtir.', true, 'Katı, sıvı ve gaz hâlleri böyle yazılıyor.'),
      soru('Denkleştirmede kesirli katsayı hiçbir şekilde kullanılamaz.', false, 'Ara adımda kullanılabilir; sonunda tamamı genişletilip tam sayıya çevrilir.'),
    ]),
    konu('kim10-hesap', 'Kimyasal Hesaplamalar', [
      kart(
        'Katsayılar oran verir',
        'Denkleştirilmiş denklemdeki katsayılar mol oranıdır. Bütün hesaplar bu orandan yürür.',
      ),
      kart(
        'Hesabın yolu',
        'Her stokiyometri sorusu aynı üç adımdan geçer; ortadaki adım atlanamaz.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Verileni mole çevir' },
            { ad: 'Katsayı oranını uygula' },
            { ad: 'İstenen birime dön' },
          ],
        },
      ),
      kart(
        'Sınırlayıcı bileşen',
        'Önce biten madde tepkimeyi durdurur; ürün miktarını o belirler. Artan maddenin fazlası tepkimeye giremez.',
      ),
      kart(
        'Nasıl bulunur?',
        'Her giren madde için katsayıya bölünmüş mol sayısı hesaplanır; en küçük değeri veren madde sınırlayıcıdır.',
      ),
      kart(
        'Yüzde verim',
        'Gerçekte elde edilen ürünün, teorik olarak beklenene oranı. Kayıplar yüzünden pratikte %100’e ulaşılmaz.',
      ),
      kart(
        'Neden verim düşük?',
        'Yan tepkimeler, geri dönüşlü tepkimeler ve aktarma sırasındaki kayıplar. Hepsi teorik değeri aşağı çeker.',
      ),
    ], [
      soru('Denklemdeki katsayılar maddeler arasındaki mol oranını verir.', true, 'Hesaplar bu orandan yürüyor.'),
      soru('Sınırlayıcı bileşen, tepkime bittiğinde artan maddedir.', false, 'Sınırlayıcı bileşen önce tükenen maddedir; tepkimeyi o durdurur.'),
      soru('Yüzde verim, gerçekte elde edilenin teorik miktara oranıdır.', true, 'Yüz ile çarpılarak yüzde olarak yazılıyor.'),
      soru('Yüzde verim %100 ün üzerinde olabilir.', false, 'Teorik miktardan fazlası elde edilemez; fazlası ölçüm hatası ya da safsızlık demek.'),
    ]),
    konu('kim10-gaz-ozellik', 'Gazların Özellikleri ve Kinetik Moleküler Teori', [
      kart(
        'Gazın dört değişkeni',
        'Basınç, hacim, sıcaklık ve mol sayısı. Gaz yasalarının tamamı bu dördü arasındaki ilişkidir.',
      ),
      kart(
        'Kinetik moleküler teori',
        'Tanecikler sürekli ve rastgele hareket eder, aralarındaki hacim taneciklerin yanında çok büyüktür, çarpışmalar esnektir.',
      ),
      kart(
        'Basınç nereden gelir?',
        'Taneciklerin kap çeperine çarpmasından. Tanecik sayısı ya da hızı arttıkça basınç artar.',
      ),
      kart(
        'Sıcaklık ve hız',
        'Mutlak sıcaklık, taneciklerin ortalama kinetik enerjisiyle doğru orantılıdır. Hesaplarda Kelvin kullanılır.',
      ),
      kart(
        'Gazın üç özelliği',
        'Gaz bulunduğu kabın hacmini tümüyle doldurur, kolayca sıkıştırılır ve her yöne aynı basıncı uygular.',
      ),
      kart(
        'Neden sıkışır?',
        'Tanecikler arasındaki boşluk taneciklerin kendi hacminden çok büyük. Katı ve sıvıda bu boşluk yok denecek kadar azdır.',
      ),
    ], [
      soru('Bir gazın durumunu basınç, hacim, sıcaklık ve mol sayısı belirler.', true, 'Dördü birbirine bağlı olarak değişiyor.'),
      soru('Gaz basıncı, taneciklerin kabın çeperlerine çarpmasından kaynaklanır.', true, 'Çarpışma sayısı ve şiddeti arttıkça basınç artıyor.'),
      soru('Sıcaklık arttıkça gaz taneciklerinin ortalama hızı azalır.', false, 'Sıcaklık taneciklerin ortalama kinetik enerjisinin ölçüsü; hız artar.'),
      soru('Gazlar sıkıştırılamaz.', false, 'Tanecikler arasındaki boşluk büyük olduğu için kolayca sıkışırlar.'),
    ]),
    konu('kim10-gaz-yasa', 'Gaz Yasaları', [
      kart(
        'Boyle yasası',
        'Sabit sıcaklıkta basınç ile hacim ters orantılıdır. Şırıngayı sıkıştırmak bunun günlük örneği.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'hacim',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [1, 5],
                [1.5, 3.3],
                [2, 2.5],
                [3, 1.7],
                [4, 1.25],
                [5, 1],
              ],
            },
          ],
        },
      ),
      kart(
        'Charles yasası',
        'Sabit basınçta hacim ile mutlak sıcaklık doğru orantılıdır. Isınan balon şişer.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık (K)',
          yAd: 'hacim',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5.5, 5.5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'Gay-Lussac yasası',
        'Sabit hacimde basınç ile mutlak sıcaklık doğru orantılıdır. Isınan kapalı kap patlayabilir.',
      ),
      kart(
        'Avogadro yasası',
        'Aynı sıcaklık ve basınçta eşit hacimli gazlarda eşit sayıda tanecik vardır.',
      ),
      kart(
        'Dördünün özeti',
        'Her yasa bir değişkeni sabit tutup kalan ikisi arasındaki ilişkiyi söyler.',
        {
          tur: 'tablo',
          basliklar: ['Yasa', 'Sabit', 'İlişki'],
          satirlar: [
            ['Boyle', 'T', 'P ile V ters'],
            ['Charles', 'P', 'V ile T doğru'],
            ['Gay-Lussac', 'V', 'P ile T doğru'],
            ['Avogadro', 'P, T', 'V ile n doğru'],
          ],
        },
      ),
      kart(
        'Neden Kelvin?',
        'Santigratta sıfır keyfî bir noktadır; orantı ancak mutlak sıfırdan başlayan ölçekte doğru çalışır.',
      ),
    ], [
      soru(
        'Grafiğe göre sabit sıcaklıkta hacim arttıkça basınç da artar.',
        false,
        'Eğri düşüyor: Boyle yasasına göre sabit sıcaklıkta basınç ile hacim ters orantılı.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 5],
          xAd: 'hacim',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [0.8, 4.5],
                [1.2, 3],
                [1.8, 2],
                [2.5, 1.4],
                [4.5, 0.8],
              ],
            },
          ],
        },
      ),
      soru('Charles yasasına göre sabit basınçta hacim, mutlak sıcaklıkla doğru orantılıdır.', true, 'Isıtılan gaz genişliyor.'),
      soru('Gaz yasalarında sıcaklık Celsius cinsinden kullanılır.', false, 'Kelvin kullanılır; sıfır noktası farklı olduğu için Celsius ile orantı bozulur.'),
      soru('Avogadro yasasına göre aynı koşullarda eşit hacimli gazlar eşit sayıda tanecik içerir.', true, 'Gazın cinsi sonucu değiştirmiyor.'),
    ]),
    konu('kim10-ideal', 'İdeal Gaz Yasası', [
      kart(
        'PV = nRT',
        'Dört değişkeni tek denklemde birleştirir. R gaz sabitidir; birim seçimine göre değeri değişir.',
      ),
      kart(
        'Öteki yasaları içerir',
        'İki değişken sabit tutulunca denklem sırayla Boyle, Charles ve Gay-Lussac yasalarına dönüşür.',
      ),
      kart(
        'Sıcaklık Kelvin',
        'Denklemde sıcaklık mutlak olmalıdır. Santigrat kullanmak sonucu doğrudan yanlış çıkarır.',
      ),
      kart(
        'İdeallikten sapma',
        'Yüksek basınç ve düşük sıcaklıkta tanecik hacmi ve çekimler önemli hâle gelir; gaz ideal davranmaz.',
      ),
      kart(
        'Ne zaman ideale yakın?',
        'Düşük basınç ve yüksek sıcaklıkta. Bu koşullarda tanecikler birbirinden uzak ve hızlıdır.',
      ),
      kart(
        'Kısmi basınç',
        'Gaz karışımında toplam basınç, her gazın tek başına yapacağı basınçların toplamıdır.',
      ),
      kart(
        'Kısmi basınç ve mol oranı',
        'Bir gazın kısmi basıncı, toplam basıncın mol kesri kadarıdır. Havadaki oksijenin payı bu şekilde hesaplanır.',
      ),
    ], [
      soru('PV = nRT bağıntısında T mutlak sıcaklıktır.', true, 'Kelvin cinsinden yazılmak zorunda.'),
      soru('Gazlar yüksek basınç ve düşük sıcaklıkta ideale yaklaşır.', false, 'Tersi: düşük basınç ve yüksek sıcaklıkta ideale yakın davranırlar.'),
      soru('Bir gaz karışımında toplam basınç, kısmi basınçların toplamına eşittir.', true, 'Dalton un kısmi basınçlar yasası.'),
      soru('Bir gazın kısmi basıncı, karışımdaki kütlesiyle doğru orantılıdır.', false, 'Mol oranıyla orantılıdır; kütle değil tanecik sayısı belirleyici.'),
    ]),
    konu('kim10-graham', 'Graham Difüzyon ve Efüzyon Yasası', [
      kart(
        'Difüzyon ve efüzyon',
        'Difüzyon gazın başka bir gaz içinde yayılması, efüzyon küçük bir delikten dışarı sızmasıdır.',
      ),
      kart(
        'Graham yasası',
        'Yayılma hızı, molar kütlenin kareköküyle ters orantılıdır. Hafif gaz daha hızlı yayılır.',
      ),
      kart(
        'Neden böyle?',
        'Aynı sıcaklıkta bütün gazların ortalama kinetik enerjisi eşittir; eşit enerjide hafif tanecik daha hızlı hareket eder.',
      ),
      kart(
        'Günlük karşılığı',
        'Mutfakta doğal gaz kaçağı, ağır kokulardan daha çabuk hissedilir; hidrojen balonu heliumdan hızlı söner.',
      ),
      kart(
        'Karşılaştırma',
        'İki gazın hız oranı, molar kütlelerinin ters oranının kareköküdür; sayı vermeden bile hangisinin hızlı olduğu söylenir.',
      ),
    ], [
      soru('Graham yasasına göre molekül kütlesi küçük olan gaz daha hızlı yayılır.', true, 'Hafif tanecik aynı sıcaklıkta daha hızlı hareket ediyor.'),
      soru('Efüzyon, gazın küçük bir delikten dışarı sızmasıdır.', true, 'Difüzyon ise gazın başka bir gaz içinde yayılması.'),
      soru('İki gazın yayılma hızlarının oranı, molar kütlelerinin oranına eşittir.', false, 'Molar kütlelerin kareköküyle ters orantılıdır.'),
      soru('Odada açılan parfümün kokusunun yayılması efüzyona örnektir.', false, 'Bu difüzyona örnek; efüzyonda gaz küçük bir delikten geçiyor.'),
    ]),
  ]),
  tema('kim10-t2', 'Çeşitlilik', [
    konu('kim10-cozunme', 'Çözünme Süreci', [
      kart(
        'Çözelti nedir?',
        'Bir maddenin başka bir madde içinde tanecik boyutunda ve homojen biçimde dağılmasıyla oluşan karışım.',
      ),
      kart(
        'Çözen ve çözünen',
        'Miktarca çok olan çözücü, az olan çözünendir. Sulu çözeltilerde su her zaman çözücü sayılır.',
      ),
      kart(
        'Üç adım',
        'İlk iki adım enerji ister, üçüncüsü enerji verir. Toplam işaret çözeltinin ısınıp soğumasını belirler.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Çözünen ayrılır', alt: 'enerji ister' },
            { ad: 'Çözücü aralanır', alt: 'enerji ister' },
            { ad: 'Sarma', alt: 'enerji verir', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Isı alan mı veren mi?',
        'Sarma adımında açığa çıkan enerji, ayırma adımlarının istediğinden büyükse çözelti ısınır; küçükse soğur.',
      ),
      kart(
        'Günlük örnekler',
        'Soğutucu jel paketleri ısı alan çözünmeyi, ısıtıcı el paketleri ısı veren çözünmeyi kullanır.',
      ),
      kart(
        'Çözünme hızı',
        'Karıştırmak, ısıtmak ve maddeyi ufalamak çözünmeyi hızlandırır ama ne kadar çözüneceğini değiştirmez.',
      ),
    ], [
      soru('Bir çözeltide miktarı çok olan bileşen çözücüdür.', true, 'Az olan çözünen.'),
      soru('Çözünme sırasında hem enerji harcanır hem de enerji açığa çıkar.', true, 'Bağları koparmak enerji ister, yeni etkileşimler kurulurken enerji açığa çıkar.'),
      soru('Bütün çözünme olayları ısı verir.', false, 'Bazıları ısı alır; amonyum nitratın suda çözünmesi ortamı soğutuyor.'),
      soru('Çözünen maddenin tanecik boyutunu küçültmek çözünürlüğü artırır.', false, 'Çözünme hızını artırır; çözünürlük değişmez.'),
    ]),
    konu('kim10-cozunebilirlik', 'Maddelerin Birbiri İçindeki Çözünebilirliği', [
      kart(
        'Benzer benzeri çözer',
        'Polar madde polar çözücüde, apolar madde apolar çözücüde çözünür. Tuz suda, yağ benzinde çözünür.',
      ),
      kart(
        'Su neden iyi çözücü?',
        'Polar ve hidrojen bağı yapabildiği için iyonları ve polar molekülleri kolayca sarar.',
      ),
      kart(
        'Yağ ile su',
        'Su molekülleri birbirini yağdan güçlü çeker; yağ dışarı itilir ve iki faz ayrı kalır.',
      ),
      kart(
        'Sabun ikisini birleştirir',
        'Sabun molekülünün bir ucu polar, öteki ucu apolardır; yağı kavrar ve su tarafına taşır.',
      ),
      kart(
        'Kısmen çözünenler',
        'Alkol hem polar hem apolar uç taşıdığı için hem suda hem yağlı maddelerde bir ölçüde çözünür.',
      ),
      kart(
        'Zincir uzadıkça',
        'Alkolün karbon zinciri uzadıkça apolar kısmı ağır basar ve suda çözünürlüğü düşer.',
      ),
    ], [
      soru('Polar maddeler polar çözücülerde iyi çözünür.', true, '"Benzer benzeri çözer" kuralı.'),
      soru('Yağ suda çözünmez çünkü apolar bir maddedir.', true, 'Su polar; aralarında yeterli çekim kurulmuyor.'),
      soru('Sabun molekülünün iki ucu da polardır.', false, 'Bir ucu polar, öteki ucu apolar; yağ ile suyu bu yüzden birleştirebiliyor.'),
      soru('Karbon zinciri uzadıkça alkollerin sudaki çözünürlüğü artar.', false, 'Azalır; apolar kısım büyüdükçe su ile uyum bozuluyor.'),
    ]),
    konu('kim10-siniflandirma', 'Çözünme Olayının Sınıflandırılması', [
      kart(
        'İyonik çözünme',
        'Madde suda iyonlarına ayrılır. Çözelti elektrik akımını iletir; tuz ve asitler böyledir.',
      ),
      kart(
        'Moleküler çözünme',
        'Madde molekül hâlinde dağılır, iyon oluşmaz. Şeker çözeltisi elektriği iletmez.',
      ),
      kart(
        'Elektrolit çözelti',
        'İçinde serbest iyon bulunduran ve akımı ileten çözelti. İyon sayısı arttıkça iletkenlik artar.',
      ),
      kart(
        'Kuvvetli ve zayıf elektrolit',
        'Tamamı iyonlaşan madde kuvvetli, bir kısmı iyonlaşan zayıf elektrolittir. Lambanın parlaklığı bunu gösterir.',
        {
          tur: 'tablo',
          basliklar: ['Çözelti', 'İletkenlik'],
          satirlar: [
            ['Tuzlu su', 'Yüksek'],
            ['Sirke', 'Düşük'],
            ['Şekerli su', 'Yok'],
          ],
        },
      ),
      kart(
        'Nasıl anlaşılır?',
        'Basit bir devreye lamba bağlanır: çözeltiye daldırıldığında lamba yanıyorsa çözünme iyoniktir.',
      ),
      kart(
        'Saf su iletmez',
        'Saf su neredeyse yalıtkandır; musluk suyunu iletken yapan şey içindeki çözünmüş iyonlardır.',
      ),
    ], [
      soru('İyonik çözünmede oluşan çözelti elektrik akımını iletir.', true, 'Serbest iyonlar yükü taşıyor.'),
      soru('Şekerin suda çözünmesi moleküler çözünmedir.', true, 'Moleküller dağılıyor ama iyonlara ayrılmıyor.'),
      soru('Saf su elektriği iyi iletir.', false, 'Saf suda serbest iyon yok denecek kadar az; ileten şey içindeki çözünmüş tuzlar.'),
      soru('Zayıf elektrolitler suda tümüyle iyonlaşır.', false, 'Kısmen iyonlaşırlar; tümüyle iyonlaşan kuvvetli elektrolittir.'),
    ]),
    konu('kim10-cozunurluk', 'Çözünürlük', [
      kart(
        'Tanımı',
        'Belirli sıcaklıkta 100 g çözücüde çözünebilen en fazla madde miktarı. Maddenin ayırt edici özelliğidir.',
      ),
      kart(
        'Doymuş çözelti',
        'Daha fazla madde çözemeyen çözelti. Eklenen fazlalık dibe çöker.',
      ),
      kart(
        'Aşırı doymuş çözelti',
        'Kararsız biçimde sınırın üstünde madde taşır. Küçük bir sarsıntı ya da kristal fazlalığı çökertir.',
      ),
      kart(
        'Çözünürlük eğrisi',
        'Sıcaklığa karşı çözünürlüğü gösteren grafik. Eğrinin üstü aşırı doymuş, altı doymamış bölgedir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık',
          yAd: 'çözünürlük',
          egriler: [
            {
              noktalar: [
                [0, 0.6],
                [2, 1.6],
                [3.5, 3],
                [5, 5],
              ],
              ad: 'katı',
            },
            {
              noktalar: [
                [0, 3],
                [2, 2],
                [3.5, 1.3],
                [5.5, 0.8],
              ],
              renk: 'ikincil',
              ad: 'gaz',
            },
          ],
        },
      ),
      kart(
        'Eğriden ne okunur?',
        'Belirli bir sıcaklıkta en çok ne kadar çözüneceği, ne kadarının çökeceği ve çözeltinin doymuş olup olmadığı.',
      ),
      kart(
        'Kristallendirme',
        'Sıcakken doyurulan çözelti soğutulunca fazlalık kristal hâlinde ayrılır. Şeker ve tuz bu yolla saflaştırılır.',
      ),
    ], [
      soru(
        'Grafiğe göre sıcaklık arttıkça bu katının çözünürlüğü azalır.',
        false,
        'Eğri yükseliyor: sıcaklık arttıkça çözünürlük de artıyor.',
        {
          tur: 'koordinat',
          pencere: [0, 100, 0, 120],
          xAd: 'sıcaklık (°C)',
          yAd: 'çözünürlük',
          egriler: [
            {
              noktalar: [
                [0, 15],
                [20, 30],
                [40, 55],
                [60, 80],
                [80, 100],
              ],
            },
          ],
        },
      ),
      soru('Doymuş çözelti, o sıcaklıkta çözebileceği en çok maddeyi çözmüş çözeltidir.', true, 'Eklenen fazla madde dibe çöküyor.'),
      soru('Aşırı doymuş çözelti kararsızdır.', true, 'Küçük bir sarsıntı bile fazlalığın kristalleşmesine yol açabiliyor.'),
      soru('Çözünürlük sıcaklıktan etkilenmeyen sabit bir değerdir.', false, 'Sıcaklığa bağlı; her sıcaklık için ayrı bir çözünürlük değeri var.'),
    ]),
    konu('kim10-etkileyen', 'Çözünürlüğe Etki Eden Faktörler', [
      kart(
        'Madde cinsi',
        'Çözünürlük öncelikle çözücü ile çözünenin türüne bağlıdır. Aynı koşulda her madde farklı çözünür.',
      ),
      kart(
        'Sıcaklık — katılar',
        'Çoğu katının çözünürlüğü sıcaklıkla artar. Sıcak çayda şekerin çabuk çözünmesi bundan.',
      ),
      kart(
        'Sıcaklık — gazlar',
        'Gazların çözünürlüğü sıcaklıkla azalır. Isınan gazoz köpürür, ısınan suda balık için oksijen azalır.',
      ),
      kart(
        'Basınç',
        'Yalnızca gazları etkiler ve çözünürlüğü artırır. Gazoz şişesi açılınca basınç düşer ve gaz kaçar.',
      ),
      kart(
        'Etkilemeyenler',
        'Bu üçü çözünürlüğü değil yalnızca çözünme hızını değiştirir; ayrımı karıştırmak sık yapılan bir hatadır.',
        {
          tur: 'tablo',
          basliklar: ['Etken', 'Neyi değiştirir?'],
          satirlar: [
            ['Karıştırma', 'Hız'],
            ['Ufalama', 'Hız'],
            ['Çözücü miktarı', 'Hiçbiri'],
            ['Sıcaklık', 'İkisi de'],
          ],
        },
      ),
      kart(
        'Ortak iyon etkisi',
        'Çözeltide zaten bulunan bir iyonu eklemek, o iyonu içeren tuzun çözünürlüğünü düşürür.',
      ),
    ], [
      soru('Katıların çözünürlüğü genellikle sıcaklık arttıkça artar.', true, 'Şekerin sıcak suda daha çok çözünmesi buna örnek.'),
      soru('Gazların çözünürlüğü sıcaklık arttıkça azalır.', true, 'Isınan gazlı içeceğin gazının kaçması bu yüzden.'),
      soru('Basınç, katıların çözünürlüğünü belirgin biçimde etkiler.', false, 'Basıncın belirgin etkisi gazlarda görülür.'),
      soru('Karıştırmak çözünürlüğü artırır.', false, 'Çözünme hızını artırır; çözünürlük aynı kalır.'),
    ]),
    konu('kim10-cozelti-sinif', 'Çözeltilerin Sınıflandırılması', [
      kart(
        'Derişik ve seyreltik',
        'Aynı çözücüde çok çözünen varsa derişik, az varsa seyreltiktir. Göreli bir karşılaştırmadır.',
      ),
      kart(
        'Doymuş, doymamış, aşırı doymuş',
        'Çözünürlük sınırına göre yapılan sınıflama. Derişik olmakla doymuş olmak aynı şey değildir.',
      ),
      kart(
        'İkisi neden farklı?',
        'Çözünürlüğü düşük bir madde az miktarda bile doymuş çözelti verir; o çözelti doymuştur ama seyreltiktir.',
      ),
      kart(
        'Hâline göre',
        'Çözelti sıvı olmak zorunda değil: hava gaz çözeltisi, alaşımlar katı çözeltidir.',
        {
          tur: 'tablo',
          basliklar: ['Hâl', 'Örnek'],
          satirlar: [
            ['Gaz', 'Hava'],
            ['Sıvı', 'Tuzlu su'],
            ['Katı', 'Çelik'],
          ],
        },
      ),
      kart(
        'İletkenliğine göre',
        'Elektrolit çözeltiler akımı iletir, elektrolit olmayanlar iletmez.',
      ),
      kart(
        'Homojen olmak şart',
        'Çözelti her noktasında aynı özelliği taşır. Tanecikler görünür boyuttaysa o bir çözelti değil süspansiyondur.',
      ),
    ], [
      soru('Derişik ve seyreltik ayrımı, çözünen madde miktarına göre yapılır.', true, 'Göreli bir ayrım; kesin bir sınır yok.'),
      soru('Doymuş bir çözelti aynı zamanda seyreltik olabilir.', true, 'Çözünürlüğü düşük bir maddede doymuş çözelti az madde içeriyor.'),
      soru('Çözeltiler heterojen karışımlardır.', false, 'Homojen olmak çözelti olmanın şartı.'),
      soru('Alaşımlar çözelti sayılmaz.', false, 'Katı hâldeki çözeltilere örnek.'),
    ]),
    konu('kim10-derisim', 'Derişim Birimleri', [
      kart(
        'Molarite',
        '1 litre çözeltide çözünen madde mol sayısı. Birimi mol/L ve sembolü M’dir.',
      ),
      kart(
        'Dikkat: çözelti hacmi',
        'Molarite çözücünün değil çözeltinin hacmine bölünür. Katıyı eklemek hacmi değiştirir.',
      ),
      kart(
        'Kütlece yüzde',
        'Çözünenin kütlesinin, çözeltinin toplam kütlesine oranı. Etiketlerde en sık görülen derişim birimidir.',
      ),
      kart(
        'ppm',
        'Milyonda bir kısım. Çok seyreltik derişimlerde kullanılır: içme suyundaki kurşun sınırı ppm ile verilir.',
      ),
      kart(
        'Seyreltme',
        'Su eklemek mol sayısını değiştirmez, yalnızca hacmi büyütür. Bu yüzden derişim küçülür.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Mol sayısı', alt: 'değişmez' },
            { ad: 'Hacim', alt: 'büyür' },
            { ad: 'Derişim', alt: 'küçülür', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Karıştırma',
        'İki çözelti karışınca toplam mol ve toplam hacim toplanır; yeni derişim ikisinin bölümüdür.',
      ),
    ], [
      soru('Molarite, çözünen maddenin mol sayısının çözelti hacmine bölünmesidir.', true, 'Birimi mol/L.'),
      soru('Molarite hesabında çözücünün değil çözeltinin hacmi kullanılır.', true, 'Katı eklenince toplam hacim değişebiliyor.'),
      soru('Seyreltme sırasında çözünen maddenin mol sayısı değişir.', false, 'Mol sayısı aynı kalır; değişen hacim, dolayısıyla derişim.'),
      soru('Kütlece yüzde derişim, çözünenin kütlesinin çözücü kütlesine oranıdır.', false, 'Çözelti kütlesine oranıdır; çözelti çözücü ile çözünenin toplamı.'),
    ]),
    konu('kim10-koligatif', 'Koligatif Özellikler', [
      kart(
        'Neye bağlı?',
        'Çözünenin cinsine değil, çözeltideki tanecik sayısına bağlı özelliklerdir.',
      ),
      kart(
        'Kaynama noktası yükselmesi',
        'Çözünen eklenince çözeltinin kaynama sıcaklığı saf çözücününkinden yüksek olur.',
      ),
      kart(
        'Donma noktası düşmesi',
        'Çözelti saf çözücüden daha düşük sıcaklıkta donar. Kışın yollara tuz atılmasının sebebi budur.',
      ),
      kart(
        'Buhar basıncı düşmesi',
        'Yüzeydeki çözünen tanecikleri buharlaşmayı engeller; buhar basıncı düşer. Öteki iki özellik bundan türer.',
      ),
      kart(
        'İyonik çözünen daha etkili',
        'NaCl suda iki iyona ayrıldığı için aynı moldeki şekerin iki katı etki yapar.',
        {
          tur: 'tablo',
          basliklar: ['1 mol madde', 'Tanecik'],
          satirlar: [
            ['Şeker', '1 mol'],
            ['NaCl', '2 mol'],
            ['CaCl₂', '3 mol'],
          ],
        },
      ),
      kart(
        'Osmotik basınç',
        'Yarı geçirgen zardan su geçişini durdurmak için gereken basınç. Hücrelerin su dengesi buna bağlıdır.',
      ),
    ], [
      soru('Koligatif özellikler, çözünen taneciklerin sayısına bağlıdır.', true, 'Taneciğin cinsi değil sayısı belirleyici.'),
      soru('Tuzlu suyun kaynama noktası saf sudan yüksektir.', true, 'Çözünen tanecikler buharlaşmayı zorlaştırıyor.'),
      soru('Yollara tuz atılması suyun donma noktasını yükseltir.', false, 'Donma noktasını düşürür; buz bu yüzden erir.'),
      soru('Aynı derişimdeki şeker ve tuz çözeltileri kaynama noktasını aynı ölçüde yükseltir.', false, 'Tuz iyonlarına ayrıldığı için daha çok tanecik verir ve etkisi büyüktür.'),
    ]),
  ]),
  tema('kim10-t3', 'Sürdürülebilirlik', [
    konu('kim10-mikro', 'Makro ve Mikro Ölçekli Deneyler', [
      kart(
        'Fark nedir?',
        'Mikro ölçekli deney aynı sonucu çok daha az madde ve küçük düzenekle verir.',
      ),
      kart(
        'Üç kazanç',
        'Daha az atık, daha az maliyet, daha az risk. Az miktarda kimyasal daha az zarar verir.',
      ),
      kart(
        'Atom ekonomisi',
        'Girenlerdeki atomların ne kadarının ürüne geçtiğinin ölçüsü. Yüksek atom ekonomisi az atık demektir.',
      ),
      kart(
        'Verim ile farkı',
        'Verim ne kadar ürün elde edildiğini söyler; atom ekonomisi ise kaç atomun boşa gittiğini. İkisi ayrı ölçülerdir.',
      ),
      kart(
        'Sınırı',
        'Her deney küçültülemez: bazı ölçümler görünür miktarda madde ister. Ölçek, doğruluğu bozmadan küçültülür.',
      ),
    ], [
      soru('Mikro ölçekli deneylerde daha az kimyasal kullanılır.', true, 'Maliyet de risk de düşüyor.'),
      soru('Mikro ölçekli çalışmak oluşan atık miktarını azaltır.', true, 'Yeşil kimyanın atık önleme ilkesiyle örtüşüyor.'),
      soru('Mikro ölçekli deneylerin sonuçları her zaman daha kesindir.', false, 'Küçük miktarlarda ölçüm hatasının payı büyüyebiliyor.'),
      soru('Atom ekonomisi ile yüzde verim aynı şeyi ölçer.', false, 'Verim ne kadar elde edildiğini, atom ekonomisi girenlerin ne kadarının ürüne geçtiğini ölçer.'),
    ]),
    konu('kim10-atmosfer', 'Atmosferdeki Tepkimeler ve Küresel Sorunlar', [
      kart(
        'Sera etkisi',
        'Karbondioksit ve metan gibi sera gazları yerden yayılan ısıyı tutar. Doğal hâli yaşamı mümkün kılar.',
      ),
      kart(
        'Küresel ısınma',
        'Fosil yakıtların yakılması sera gazı derişimini artırdı; tutulan ısı arttıkça ortalama sıcaklık yükseliyor.',
      ),
      kart(
        'Asit yağmurları',
        'Kükürt ve azot oksitleri suyla birleşip asit oluşturur. Toprağı, ormanı ve yapıları aşındırır.',
      ),
      kart(
        'Ozon azalımı',
        'Ozon tabakası morötesi ışınları süzer. Kloroflorokarbonlar ozonu parçaladığı için üretimleri kısıtlandı.',
      ),
      kart(
        'Üç sorun karıştırılıyor',
        'Sera etkisi, ozon azalımı ve asit yağmuru ayrı gazlardan kaynaklanır ve ayrı sonuçlar üretir.',
        {
          tur: 'tablo',
          basliklar: ['Sorun', 'Sorumlu gaz'],
          satirlar: [
            ['Küresel ısınma', 'CO₂, CH₄'],
            ['Ozon azalımı', 'CFC’ler'],
            ['Asit yağmuru', 'SO₂, NOₓ'],
          ],
        },
      ),
      kart(
        'Ozon iki yüzlü',
        'Yüksekteki ozon koruyucudur, yer seviyesindeki ozon ise solunumu bozan bir kirleticidir.',
      ),
      kart(
        'Ayak izleri',
        'Karbon, su ve emisyon ayak izi bir etkinliğin doğaya bindirdiği yükü ölçer; azaltmanın ilk adımı ölçmektir.',
      ),
      kart(
        'Çözüm de kimya',
        'Karbon yakalama, katalitik konvertör ve CFC yerine geçen gazlar, aynı bilimin sorunu geri çevirme çabası.',
      ),
    ], [
      soru('Sera etkisi doğal bir olaydır ve Dünya yı yaşanabilir sıcaklıkta tutar.', true, 'Sorun etkinin kendisi değil, insan kaynaklı gazlarla güçlenmesi.'),
      soru('Stratosferdeki ozon tabakası zararlı morötesi ışınları süzer.', true, 'İncelmesi cilt kanseri riskini artırıyor.'),
      soru('Asit yağmurlarının sebebi ozon tabakasının incelmesidir.', false, 'Sebep kükürt ve azot oksitlerinin havada aside dönüşmesi; iki sorun ayrı.'),
      soru('Ozon bulunduğu her yükseklikte yararlıdır.', false, 'Yer seviyesinde kirletici; yararlı olan stratosferdeki ozon.'),
    ]),
  ]),
])
