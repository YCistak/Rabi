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
        'Coğrafya insanla doğanın ilişkisine bakar',
        'Karadeniz\'de evlerin çatısı dik, çünkü çok yağıyor. İnsan doğaya göre yaşar, doğayı da değiştirir. Coğrafya bu karşılıklı ilişkiyi inceler. Ülke ve başkent ezberi değil; olayın yerle bağı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fizikî coğrafya doğal ortama bakar',
        'Dağ, ova, yağmur, akarsu, toprak, orman: bunları insan yapmadı. İnsan yapmadan var olan her şeye doğal ortam denir. Fizikî coğrafya doğal ortamı inceler: yer şekilleri, iklim, sular, toprak ve canlılar.',
      ),
      kart(
        'Beşerî coğrafya insanın izine bakar',
        'Şehir, yol, fabrika, tarla: bunları insan yaptı. Beşerî, yani insanla ilgili. Beşerî coğrafya insanın mekândaki izini inceler: nüfus, yerleşme, ekonomi, ulaşım ve kültür.',
      ),
      kart(
        'Her bölüm kendi içinde dallara ayrılır',
        'Yalnızca iklimi inceleyene klimatoloji, yalnızca yer şekillerini inceleyene jeomorfoloji denir. Fizikî ve beşerî coğrafyanın her biri böyle uzman dallara bölünür. Tabloda en bilinen dallar var.',
        {
          tur: 'tablo',
          basliklar: ['Dal', 'Bölüm', 'İnceler'],
          satirlar: [
            ['Jeomorfoloji', 'Fizikî', 'Yer şekilleri'],
            ['Klimatoloji', 'Fizikî', 'İklim'],
            ['Hidrografya', 'Fizikî', 'Sular'],
            ['Nüfus coğrafyası', 'Beşerî', 'Nüfus'],
            ['Ekonomik coğrafya', 'Beşerî', 'Ekonomi'],
          ],
        },
      ),
      kart(
        'Coğrafya her olaya üç soru sorar',
        'Fındık nerede yetişir? Karadeniz\'de. Neden orada? Yağış bol, yaz serin. Sonucu ne? Bölge halkı fındıkla geçiniyor. Coğrafya her olaya bu üçünü sorar: nerede, neden orada, sonucu ne? Son ikisi coğrafyayı öteki bilimlerden ayırır.',
        undefined,
        { not: '"Nerede" ile durma. "Neden orada" ve "sonucu ne" cevaplanmadıysa konu bitmemiş demek.' },
      ),
      kart(
        'Dağılış: tek olaya değil, yayılışa bak',
        'Bir depremi tek başına değil, ülkedeki bütün depremlerle birlikte düşün. Hepsini haritaya koyunca fay hattı ortaya çıkar. Buna dağılış ilkesi denir: olayı yeryüzüne yayılışıyla incelemek. Dağılış haritası coğrafyanın temel aracı.',
      ),
    ], [
      soru('Coğrafya, insan ile doğal çevre arasındaki karşılıklı ilişkiyi inceler.', true, 'Yalnızca doğayı ya da yalnızca insanı değil, ikisinin etkileşimini ele alıyor.'),
      soru('Nüfus ve yerleşme fizikî coğrafyanın konusudur.', false, 'İkisi de beşerî coğrafyanın konusu; fizikî coğrafya yer şekilleri ve iklimle ilgilenir.'),
      soru('Dağılış ilkesi, bir olayı yeryüzüne yayılışıyla birlikte inceler.', true, 'Olayları haritaya koyunca düzen ortaya çıkıyor: depremler fay hattını gösterir.'),
      soru('Coğrafyada "neden orada" sorusu sorulmaz.', false, 'Nerede, neden orada ve sonucu ne; üçü birden coğrafyanın temel soruları.'),
      sikli('İklim ve toprağı inceleyen bölüm?', ['Beşerî coğrafya', 'Fizikî coğrafya'], 1, 'Doğal ortam.'),
      sikli('Coğrafyanın temel aracı nedir?', ['Takvim', 'Dağılış haritası'], 1, 'Olay yeryüzüne yayılışıyla incelenir.'),
      soru('Coğrafyayı öteki bilimlerden ayıran soru "nerede"dir.', false, '"Neden orada" ve "sonucu ne" ayırır; "nerede" adres sorusu.'),
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
        'Aynı olay yerine göre farklı sonuç verir',
        '7 büyüklüğünde deprem Japonya\'da birkaç can alır, hazırlıksız bir şehirde binlerce. Olay aynı, yer farklı. Olayı yeriyle birlikte düşünmeye mekânsal düşünme denir. Coğrafya sana bunu öğretir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ev seçerken de coğrafya kullanırsın',
        'Dere yatağına ev alan, sel basınca şaşırır. Nereye ev alacağın, hangi yoldan gideceğin, tarlaya ne ekeceğin coğrafi kararlar. Her gün fark etmeden coğrafya kullanıyorsun.',
      ),
      kart(
        'Fayı bilmek hayat kurtarır',
        '1999\'da Gölcük\'te fay hattının üstündeki binalar yıkıldı. Fay hattı, yani yer kabuğunun kırıldığı ve depremin çıktığı çizgi. Fayı, taşkın ovasını ve heyelan alanını bilen oraya ev yapmaz. Bu bilgi doğrudan can güvenliği.',
      ),
      kart(
        'Suyun nerede olduğunu bilmeden paylaşamazsın',
        'Konya Ovası\'nda kuyular kurudu; çünkü ne kadar su olduğu bilinmeden çekildi. Su, toprak ve enerji sınırlı. Nerede ne kadar olduğunu bilmeden ne paylaşabilir ne koruyabilirsin. Buna kaynak yönetimi denir.',
      ),
      kart(
        'Bir yerdeki olay başka yeri etkiler',
        'Suriye\'deki savaş Türkiye\'ye milyonlarca göçmen getirdi. İklim değişikliği, göç ve kaynak paylaşımı ülke sınırı tanımaz. Bu sorunları anlamak için dünyaya bütün olarak bakman gerekir; buna küresel bakış denir.',
      ),
      kart(
        'Coğrafi soru: başka yerde neden olmuyor?',
        '"Fındık nerede yetişir" tek başına coğrafi soru değil, adres sorusu. "Neden Konya\'da yetişmiyor" dediğin an coğrafya başlar. Cevap yerle birlikte değişiyorsa soru coğrafidir.',
        undefined,
        { not: 'Bir soruyu coğrafi yapan şey "nerede" değil; "başka yerde neden olmuyor" diye sorabilmen.' },
      ),
    ], [
      soru('Mekânsal düşünme, bir olayı yerle ilişkisi içinde değerlendirmektir.', true, 'Aynı olay farklı yerlerde farklı sonuçlar doğurabiliyor.'),
      soru('Coğrafya bilgisi afet risklerinin azaltılmasında kullanılır.', true, 'Fay ve taşkın alanını bilmek yerleşim yeri seçimini değiştiriyor.'),
      soru('Yer seçimiyle ilgili günlük kararlarda coğrafi bilginin bir yararı yoktur.', false, 'Ev, iş yeri ya da tatil yeri seçmek doğrudan mekânsal bir karar.'),
      soru('Coğrafya, ülke ve başkent ezberlemekten ibarettir.', false, 'Yer adları yalnızca bir araç; asıl konu olayların yerle ilişkisi.'),
      sikli('Bir depremin sonucunun yere göre değişmesi hangi düşünmeyi öğretir?', ['Kaynak yönetimi', 'Mekânsal düşünme'], 1, 'Olayı yerle birlikte düşünmek.'),
      sikli('Su ve enerjiyi paylaşmak için önce ne gerekir?', ['Yasa çıkarmak', 'Nerede ne kadar olduğunu bilmek'], 1, 'Kaynak yönetimi.'),
      soru('İklim değişikliği tek bir ülkeye bakarak anlaşılabilir.', false, 'Sınır tanımaz; dünyaya bütün olarak bakmak gerekir.'),
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
        'Eratosthenes dünyanın çevresini ölçtü',
        'MÖ 3. yüzyılda Eratosthenes iki şehirde öğle güneşinin gölgesini karşılaştırdı. Gölge açısından dünyanın çevresini hesapladı; sonuç bugünkü değere çok yakın. "Coğrafya" kelimesini ilk kullanan da o.',
      ),
      kart(
        'Batlamyus haritaya sayılı ağ çizdi',
        'Bir yeri tarif etmek için "Nil\'in batısında" demek yetmez. Batlamyus haritaya enlem ve boylam çizgileri, yani sayılı bir ağ çizdi; her yerin adresi oldu. Eseri bin yıldan uzun süre hem İslam dünyasında hem Avrupa\'da kullanıldı.',
      ),
      kart(
        'İslam bilginleri ölçtü ve haritaladı',
        'Birunî dünyanın yarıçapını hesapladı. İdrisî 12. yüzyılda dönemin en ayrıntılı dünya haritasını çizdi. Batlamyus\'un bilgisi İslam dünyasında hem korundu hem geliştirildi.',
      ),
      kart(
        'Piri Reis Amerika kıyısını çizdi',
        '1513\'te Piri Reis bir dünya haritası çizdi; üstünde Amerika kıyıları var. Amerika\'nın bulunmasından yalnızca 21 yıl sonra. Kitab-ı Bahriye adlı kitabında Akdeniz limanlarını tek tek anlatır.',
      ),
      kart(
        'Keşifler haritayı tamamladı',
        'Kolomb ve Macellan gibi denizciler okyanusları geçti; bilinmeyen kıyılar haritaya işlendi. Coğrafya artık yalnızca anlatmıyor, ölçüyordu: kıyı boyu, enlem, derinlik. Betimleme, yani sözle tarif etme, yerini ölçmeye bıraktı.',
        undefined,
        { not: 'Sınavda "betimlemeden ölçmeye geçiş" görürsen Keşifler Çağı\'nı düşün; coğrafyanın bilim olma anı orası.' },
      ),
      kart(
        'Bugün uydu bakıyor, bilgisayar hesaplıyor',
        'Telefonundaki harita her saniye uydudan veri alıyor. Modern coğrafya uydu görüntüsü ve coğrafi bilgi sistemleriyle çalışır; sel olmadan nereyi basacağını hesaplar. Buna modelleme denir: geleceği veriyle tahmin etmek.',
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
    ], [
      soru('Batlamyus haritaya enlem ve boylam ağı çizmiştir.', true, 'Her yere sayılı bir adres verdi; eseri bin yıldan uzun kullanıldı.'),
      soru('Coğrafi Keşifler haritacılığın gelişmesini hızlandırmıştır.', true, 'Yeni kıyılar haritalara işlendi, ölçüm yöntemleri gelişti.'),
      soru('İslam dünyasındaki coğrafyacıların haritacılığa katkısı olmamıştır.', false, 'İdrisî gibi adlar döneminin en ayrıntılı haritalarını çizdi.'),
      soru('Modern coğrafya, yalnızca yerlerin adlarını listeleyen bir bilimdir.', false, 'Modern coğrafya uydu verisiyle hesaplıyor ve geleceği modelliyor.'),
      sikli('Eseri yüzyıllarca hem İslam dünyasında hem Avrupa\'da kullanılan haritacı?', ['İdrisî', 'Batlamyus'], 1, 'Enlem-boylam ağı.'),
      sikli('Coğrafya betimlemeden ölçmeye ne zaman geçti?', ['İlk Çağ\'da', 'Keşifler çağında'], 1, 'Uzun deniz yolculukları.'),
      soru('Piri Reis\'in 1513 haritası Amerika kıyılarını gösterir.', true, 'Amerika\'nın bulunmasından 21 yıl sonra.'),
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
    ]),
  ]),
  tema('cog9-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog9-harita', 'Mekânın Aynası Haritalar', [
      kart(
        'Harita, yeryüzünün küçültülmüş resmidir',
        'Şehrin tamamını bir kâğıda sığdırmak için her şeyi aynı oranda küçültürsün. Harita, yeryüzünün bir bölümünün belli bir oranda küçültülüp düzleme çizilmiş hâli. Bu küçültme oranına ölçek denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ölçek, ne kadar küçülttüğünü söyler',
        '1/100.000 ölçek şu demek: haritada 1 cm, gerçekte 100.000 cm, yani 1 km. Ölçek, haritadaki uzunluğun gerçekteki uzunluğa oranı. Payda ne kadar büyükse harita o kadar çok küçültülmüş.',
      ),
      kart(
        'Ölçek hesabı: çarp, beş sıfır at',
        '1/500.000 ölçekli haritada iki şehir arası 3 cm. Gerçek uzaklık 3 × 500.000 = 1.500.000 cm. cm\'yi km\'ye çevirmek için beş sıfır at: 15 km. Kural: gerçek uzunluk = harita uzunluğu × payda.',
      ),
      kart(
        'Payda büyüyünce ölçek küçülür',
        '1/5.000 ile 1/500.000\'i karşılaştır. İkincinin paydası büyük, yani daha çok küçültülmüş; geniş alanı az ayrıntıyla gösterir. Paydası büyük olan küçük ölçek. 1/500.000\'i "daha büyük ölçek" sanma.',
        {
          tur: 'tablo',
          basliklar: ['Ölçek', 'Alan', 'Ayrıntı'],
          satirlar: [
            ['1/5.000', 'Dar', 'Çok'],
            ['1/500.000', 'Geniş', 'Az'],
          ],
        },
        { etiket: 'Sık hata', not: 'Payda büyük, ölçek küçük. 1/500.000 gördüğünde "geniş alan, az ayrıntı" de; ters düşünürsen her soru gider.' },
      ),
      kart(
        'Şehir planı büyük ölçek ister',
        'Sokak adlarını görmek istiyorsan 1/25.000 gibi büyük ölçek gerekir: az yer, çok ayrıntı. Dünya haritası 1/50.000.000: çok yer, az ayrıntı. Amaç ayrıntıysa büyük ölçek, genel görünümse küçük ölçek.',
      ),
      kart(
        'Beş parça eksikse harita okunmaz',
        'Yön oku yoksa kuzeyi bulamazsın. Lejant, yani işaretlerin anlamını gösteren kutu, yoksa sembolleri çözemezsin. Bir haritada başlık, ölçek, lejant, yön oku ve koordinat olmalı.',
      ),
      kart(
        'Küreyi düzleştirince bir şey bozulur',
        'Portakal kabuğunu soyup masaya yaymayı dene: ya yırtılır ya gerilir. Dünya küre, harita düz. Aktarırken alan, açı ya da uzunluktan biri mutlaka bozulur. Üçünü birden koruyan harita yok.',
      ),
      kart(
        'İzohips aynı yükseklikteki yerleri bağlar',
        'Bir tepeyi 100, 200, 300 m yüksekliklerden yatay dilimle. Her dilimin kenarı bir eğri verir. İzohips, yani eş yükselti eğrisi, aynı yükseklikteki noktaları birleştirir. En içteki halka en yüksek yer.',
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
        'Eğriler sıksa yamaç diktir',
        'İki izohips birbirine çok yakınsa kısa yolda çok yükseliyorsun demek: dik yamaç. Eğriler seyrekse yamaç yatık. İzohipsler birbirini kesmez; bir nokta aynı anda iki yükseklikte olamaz.',
      ),
      kart(
        'Renk yükseklik aralığı gösterir',
        'Fizikî haritada yeşil alçak ovaları, sarı ve kahverengi yükselen araziyi gösterir. Yeşil orman demek değil; deniz seviyesine yakın demek. Her renk bir yükselti aralığı.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Profil, arazinin yandan görünüşüdür',
        'İzohips haritasında bir çizgi çek. Çizginin kestiği her eğrinin yükseltisini yan yana işaretle, noktaları birleştir. Çıkan şekil arazinin yandan görünüşü, yani profil.',
      ),
    ], [
      soru('Ölçeğin paydası büyüdükçe haritadaki ayrıntı azalır.', true, 'Küçük ölçekli harita geniş alanı, az ayrıntıyla gösterir.'),
      soru('İzohips eğrileri aynı yükseltideki noktaları birleştirir.', true, 'Bu yüzden iki izohips birbirini kesmez.'),
      soru('Birbirine yakın geçen izohipsler arazinin eğiminin az olduğunu gösterir.', false, 'Sık izohips dik yamaç demek; seyrek geçenler eğimin azaldığını gösterir.'),
      soru('Bir haritada alan, açı ve uzunluk aynı anda hatasız gösterilebilir.', false, 'Küre düzleme aktarılırken bozulma kaçınılmaz; hangisinin korunacağı seçilir.'),
      sikli('1/500.000 ölçekli haritada 1 cm gerçekte kaç km?', ['5', '50'], 0, 'Beş sıfır at.'),
      sikli('Şehir planı için hangi ölçek uygundur?', ['1/25.000 (büyük)', '1/5.000.000 (küçük)'], 0, 'Az yer, çok ayrıntı.'),
      sikli('Payda büyüdükçe ölçek?', ['Küçülür', 'Büyür'], 0, 'Ayrıntı azalır.'),
      sikli('Renkli haritada yeşil neyi gösterir?', ['Alçak ovayı', 'Dağı'], 0, 'Kahverengi yükselen arazi.'),
      sikli('Küre düzleme aktarılırken ne olur?', ['Hiçbir şey bozulmaz', 'Bir bozulma kaçınılmazdır'], 1, 'Alan, açı ya da uzunluktan biri bozulur.'),
      soru('İzohips haritasından arazinin profili çıkarılabilir.', true, 'Hat boyunca yükseltiler işaretlenip birleştirilir.'),
      soru('Fizikî haritada yeşil renk orman alanlarını gösterir.', false, 'Yeşil, deniz seviyesine yakın alçak arazi; renk yükselti aralığı gösterir.'),
      soru('İki izohips eğrisi birbirini kesebilir.', false, 'Bir nokta aynı anda iki yükseklikte olamaz.'),
    ], [
      {
        soru: 'İzohipsler sıklaştıkça arazi nasıl olur?',
        siklar: ['Eğim azalır', 'Eğim dikleşir'],
        dogru: 1,
        aciklama: {
          dogru: 'Kısa mesafede çok yükselti değişiyor demek.',
          yanlis: 'Seyrek izohips yatık yamaç demek. Sık izohips kısa yolda büyük yükselti farkı, yani dik yamaç.',
        },
        kart: 9,
      },
      {
        soru: 'Fizikî haritada yeşil boyalı yer neyi gösterir?',
        siklar: ['Alçak ova', 'Orman'],
        dogru: 0,
        aciklama: {
          dogru: 'Renk yükselti aralığı; yeşil deniz seviyesine yakın demek.',
          yanlis: 'Renk bitki örtüsünü değil yükseltiyi gösterir. Yeşil alçak ova, kahverengi yüksek arazi.',
        },
        kart: 10,
      },
    ]),
    konu('cog9-konum', 'Türkiye’nin Coğrafi Konumu', [
      kart(
        'Matematik konum, yerin sayılı adresi',
        'Bir yeri enlem ve boylam sayısıyla göstermeye matematik konum denir. Enlem ekvatora uzaklık, boylam başlangıç meridyenine uzaklık. Türkiye 36°–42° kuzey enlemleri ile 26°–45° doğu boylamları arasında.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Orta kuşak dört mevsim demek',
        'Ekvatorda hep yaz, kutupta hep kış. Türkiye ikisinin arasında, orta kuşakta; bu yüzden dört mevsim belirgin yaşanır. Kuzeye gittikçe sıcaklık düşer: Antalya, Sinop\'tan sıcak.',
      ),
      kart(
        'Doğuda güneş önce doğar',
        'Dünya batıdan doğuya döner; doğudaki yer güneşi önce görür. Iğdır\'da güneş Edirne\'den önce doğar. Her boylam 4 dakika fark yaratır: dünya 24 saatte 360 boylam dönüyor, 1440 ÷ 360 = 4.',
      ),
      kart(
        'Yerel saat farkı: boylam farkı × 4',
        'Türkiye\'nin doğusu 45°, batısı 26°. Fark 45 − 26 = 19 boylam. 19 × 4 = 76 dakika. Iğdır\'da yerel saat Edirne\'den 76 dakika ileride. Önce hangisi doğuda diye bak, sonra çarp.',
        undefined,
        { not: 'Hesaba başlamadan yönü belirle: doğudaki ileride. Hata sayıda değil, hep yönde çıkıyor.' },
      ),
      kart(
        'Ülke tek ortak saat kullanır',
        'Iğdır ile Edirne arasında 76 dakika yerel saat farkı var. Ama ikisinde de saatler aynı: Türkiye tek ortak saat kullanır. Okul, tren ve televizyon aynı anda başlasın diye. Buna ulusal saat denir.',
      ),
      kart(
        'Özel konum çevreyi anlatır',
        'Matematik konum sayı verir; özel konum komşuları, denizleri, yolları anlatır. Türkiye üç tarafı denizle çevrili, Asya ile Avrupa arasında, boğazlara sahip. Karadeniz\'e çıkan her gemi İstanbul Boğazı\'ndan geçer. Bu konum stratejik.',
      ),
      kart(
        'Yükselti doğuya doğru artar',
        'Türkiye\'nin ortalama yükseltisi yaklaşık 1130 m; Avrupa\'nın iki katından fazla. Batıdan doğuya gittikçe artar: İzmir deniz kıyısında, Erzurum 1850 m\'de. Bu yüzden Erzurum\'da kış uzun, tarım kısa.',
      ),
      kart(
        'Konum ticaret yolu getirir',
        'Hazar petrolü Avrupa\'ya Türkiye üzerinden boru hattıyla gidiyor; Asya–Avrupa yükü de öyle. Kesişme noktasında olmak transit geçiş, yani malın senin üstünden geçmesi, geliri sağlar. Turizm de bu konumdan besleniyor.',
      ),
    ], [
      soru('Türkiye 36°–42° kuzey enlemleri arasında yer alır.', true, 'Bu enlemler ülkeyi orta kuşakta tutuyor.'),
      soru('Türkiye doğu-batı arasındaki 76 dakikalık fark yüzünden iki ayrı saat kullanır.', false, 'Yerel saat farkı var ama ülkenin tamamında tek ortak saat uygulanıyor.'),
      soru('Enlem, Türkiye\'de dört mevsimin belirgin yaşanmasında etkilidir.', true, 'Orta kuşakta olmak mevsim farklarını belirginleştiriyor.'),
      soru('Yükseltinin iklim üzerinde bir etkisi yoktur.', false, 'Erzurum yüksek olduğu için kış uzun, tarım kısa.'),
      sikli('Türkiye\'nin doğusu ile batısı arasında kaç boylam farkı var?', ['19', '76'], 0, '45 − 26.'),
      sikli('Bir boylam kaç dakika eder?', ['4', '15'], 0, '76 dakika toplam.'),
      sikli('Güneş nerede önce doğar?', ['Iğdır', 'Edirne'], 0, 'Doğu önde.'),
      sikli('Türkiye\'nin ortalama yükseltisi doğuya doğru?', ['Artar', 'Azalır'], 0, 'İklimi ve tarımı etkiler.'),
      soru('Türkiye tek ortak saat kullanır.', true, 'Ortak çalışma düzeni için.'),
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
    ]),
    konu('cog9-mbt', 'Mekânsal Bilgi Teknolojilerinin Bileşenleri', [
      kart(
        'CBS, konumu olan veriyi haritaya döker',
        'Belediye her hastaneyi, okulu ve yolu haritada konumuyla saklıyor. Yeni hastane nereye? Bilgisayar hepsini üst üste koyup söylüyor. CBS, yani Coğrafi Bilgi Sistemi: konumlu veriyi toplayan, saklayan, çözümleyen ve haritaya döken sistem.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'CBS beş parçadan oluşur',
        'Bilgisayar (donanım), program (yazılım), haritaya girecek bilgi (veri), programı kullanan kişi (insan) ve işin nasıl yapılacağı (yöntem). En pahalı ve en önemli parça veri: toplaması yıllar sürer.',
      ),
      kart(
        'Uydu dokunmadan ölçer',
        'Orman yangınında uydu, yanan alanın fotoğrafını uzaydan çeker; kimse ormana girmez. Uzaktan algılama, yani yere dokunmadan uydu ya da uçakla veri toplama. Kuraklık ve buzul erimesi de böyle izlenir.',
      ),
      kart(
        'GPS konumunu uydudan bulur',
        'Telefonun haritada seni mavi noktayla gösteriyor; bunu GPS yapıyor. Uydular sinyal yollar, alıcı sinyalin geliş süresinden uzaklığı hesaplar. Tek uydu yalnız uzaklık verir; yerini üç boyutlu bulmak için en az dört uydu gerekir.',
      ),
      kart(
        'Katmanlar üst üste gelince cevap çıkar',
        'Yollar bir şeffaf kâğıtta, akarsular başka kâğıtta, nüfus üçüncüde. Kâğıtları üst üste koy: "suya yakın, yolu olan, kalabalık yer" hemen görünür. CBS her veriyi ayrı katmanda tutar; çözümleme bindirmeden çıkar.',
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
        'Salgın haritası da CBS ile çizildi',
        'Covid günlerinde il il vaka haritası CBS\'den çıkıyordu. Kent planı, afet yönetimi, tarla takibi, kargo rotası, ambulansa en kısa yol: konumu olan her iş CBS\'nin işi.',
      ),
      kart(
        'Yanlış veriyle de güzel harita çıkar',
        'On yıl önceki yol verisini girersen CBS yine düzgün, renkli bir harita çizer; ama yeni yolları göstermez. Program veriyi sorgulamaz. Haritanın güzel görünmesi doğru olduğunu göstermez; veriye bak.',
        undefined,
        { etiket: 'Sık hata', not: 'Düzgün görünen haritaya güvenmeden önce sor: veri ne zaman toplandı? CBS eski veriyi de güzel çizer.' },
      ),
    ], [
      soru('CBS, konumla ilişkili verileri toplayan, saklayan ve çözümleyen bir sistemdir.', true, 'Veriyi katmanlar hâlinde üst üste koyup ilişkilendiriyor.'),
      soru('Uzaktan algılama, yeryüzüne ait bilginin temas etmeden toplanmasıdır.', true, 'Uydu ve hava fotoğrafları bu yolla elde ediliyor.'),
      soru('GPS, konum belirlemek için yeryüzündeki radyo istasyonlarını kullanır.', false, 'Uydulardan gelen sinyallerin geliş sürelerini kullanıyor.'),
      soru('CBS\'ye girilen veri hatalı olsa bile çıkan sonuç doğru olur.', false, 'Sonuç girilen verinin doğruluğu kadar güvenilir.'),
      sikli('CBS\'nin en kritik ve pahalı bileşeni?', ['Veri', 'Yazılım'], 0, 'Donanım, yazılım, veri, insan, yöntem.'),
      sikli('Uydu ile temas etmeden veri toplamak?', ['Uzaktan algılama', 'GPS'], 0, 'Orman yangını takibi.'),
      sikli('CBS veriyi nasıl çözümler?', ['Katmanları üst üste bindirerek', 'Tablo hâlinde'], 0, 'Katman mantığı.'),
      soru('Güzel görünen bir CBS haritası doğruluk kanıtıdır.', false, 'Eski veriyle de düzgün görünen harita üretir.'),
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
    ]),
  ]),
  tema('cog9-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog9-hava-olay', 'Hava Olayları ve Günlük Hayata Etkileri', [
      kart(
        'Hava durumu bugün, iklim yıllardır',
        '"Bugün İstanbul yağmurlu" hava durumu: kısa süreli, günlük. "İstanbul\'da kışlar yağışlı geçer" iklim: uzun yılların ortalaması. Bir günün yağmuru iklimi değiştirmez.',
        undefined,
        { not: 'Cümlede "bugün", "yarın" varsa hava durumu; "genellikle", "her yıl" varsa iklim.' },
      ),
      kart(
        'Hava olayları en alt katmanda olur',
        'Uçak 10 km\'ye çıkınca bulutların üstündedir; orada yağmur yok. Atmosfer, yani dünyayı saran hava tabakası, katmanlardan oluşur. Yağmur, kar ve rüzgâr en alttaki troposferde; çünkü su buharı orada. Yukarı çıktıkça hava seyrelir.',
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
        'Isınan hava yükselir, basınç düşer',
        'Balonun içindeki havayı ısıtınca balon yükselir. Yer ısınınca hava da yükselir; yerde hava azalır, basınç düşer. Buna alçak basınç denir. Soğuyan hava ağırlaşıp çöker, yerde birikir: yüksek basınç.',
      ),
      kart(
        'Rüzgâr yüksek basınçtan alçağa eser',
        'Şişirilmiş balonun ağzını aç: hava içeriden dışarı, yani çoktan aza kaçar. Rüzgâr da öyle: yüksek basınçtan alçak basınca doğru esen hava. İki yer arasındaki basınç farkı büyüdükçe rüzgâr hızlanır.',
      ),
      kart(
        'Su buharı soğuyunca bulut olur',
        'Buzdolabından çıkan şişe terler: havadaki görünmez su buharı soğuk yüzeyde damlaya döner. Buna yoğuşma denir. Yükselen hava soğur, buharı yoğuşur, bulut olur. Damlalar büyüyüp ağırlaşınca yağış düşer.',
      ),
      kart(
        'Hava neden yükseldiyse yağış o adı alır',
        'Hava ancak yükselince soğur ve yağış bırakır. Dağa çarpıp yükselirse yamaç yağışı. Isınıp kendiliğinden yükselirse yükselim yağışı. Sıcak hava soğuk havayla karşılaşıp üstüne tırmanırsa cephe yağışı.',
        {
          tur: 'tablo',
          basliklar: ['Yağış', 'Sebep', 'Örnek'],
          satirlar: [
            ['Yamaç (orografik)', 'Dağa çarpar', 'Rize'],
            ['Yükselim (konveksiyonel)', 'Isınıp yükselir', 'Yaz sağanağı'],
            ['Cephe (frontal)', 'Sıcak-soğuk karşılaşır', 'Kış yağmuru'],
          ],
        },
      ),
      kart(
        'Bir gece don, bir yılın ürününü alır',
        'Nisanda bir gece don olur, çiçek açmış kayısı ağaçları yanar; Malatya o yıl kayısı satamaz. Kar yolu kapatır, sis uçağı indirmez, sıcak dalgası elektriği patlatır. Tarım, ulaşım, enerji, sağlık: hepsi havaya bağlı.',
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
      soru('Havadaki su buharı ısınınca yoğuşup bulut oluşturur.', false, 'Tersine, soğuyunca yoğuşur; yükselen hava soğuduğu için bulut oluşur.'),
      sikli('Hava olayları hangi katmanda gerçekleşir?', ['Troposfer', 'Stratosfer'], 0, 'En alt katman.'),
      sikli('"Yazları kurak" ifadesi neyi anlatır?', ['İklimi', 'Hava durumunu'], 0, 'Uzun yılların ortalaması.'),
      sikli('Isınan hava ne oluşturur?', ['Alçak basınç', 'Yüksek basınç'], 0, 'Yükselir, yerde hava azalır.'),
      sikli('Dağa çarpıp yükselen havanın yağışı?', ['Yamaç (orografik)', 'Cephe (frontal)'], 0, 'Rize örneği.'),
      soru('Basınç farkı büyüdükçe rüzgâr hızlanır.', true, 'Yüksekten alçağa, fark ne kadar büyükse o kadar hızlı.'),
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
    ]),
    konu('cog9-iklim-sistem', 'İklim Sisteminin Bileşen ve Değişkenleri', [
      kart(
        'İklim beş kürenin ortak işidir',
        'Deniz buharlaşır, hava buharı taşır, dağ havayı yükseltir, orman nemi tutar, buzul güneşi yansıtır. İklim bu beşinin etkileşimi: atmosfer (hava), hidrosfer (su küre), litosfer (taş küre), biyosfer (canlı küre), kriyosfer (buz küre).',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Atmosfer', alt: 'hava' },
            { ad: 'Hidrosfer', alt: 'su' },
            { ad: 'Litosfer', alt: 'taş' },
            { ad: 'Biyosfer', alt: 'canlı' },
            { ad: 'Kriyosfer', alt: 'buz' },
          ],
        },
      ),
      kart(
        'İklimi altı ölçümle anlatırsın',
        'Bir yerin iklimini anlatmak için ölçülen şeyler: sıcaklık, basınç, nem, yağış, rüzgâr ve güneşlenme süresi. Bunlara iklim değişkenleri denir. Hava durumu sunucusu her akşam bunları okuyor.',
      ),
      kart(
        'Ekvatordan uzaklaştıkça soğur',
        'El fenerini kâğıda dik tut: küçük, parlak bir daire. Eğik tut: geniş, soluk bir leke. Güneş ışını ekvatora dik, kutuplara eğik gelir. Eğik ışın aynı enerjiyi geniş alana yayar, az ısıtır. Enlem büyüdükçe sıcaklık düşer.',
      ),
      kart(
        'Her 100 metrede 0,5 °C düşer',
        'Antalya\'da 30 °C iken 2000 m\'deki yaylada yaklaşık 20 °C olur: 20 × 0,5 = 10 derece düşük. Yükseldikçe hava seyrelir, ısıyı tutamaz. Aynı enlemde dağ ile ova bu yüzden farklı.',
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
        'Kara çabuk ısınır, çabuk soğur',
        'Yazın kumsalda kum yakar, deniz serindir; gece kum soğur, deniz ılık kalır. Deniz ısıyı yavaş alır, yavaş verir. Denizden uzaklaştıkça bu denge kaybolur: gece-gündüz ve yaz-kış farkı büyür. Buna karasallık denir.',
        undefined,
        { not: 'Karasallık iki farkı birden büyütür: gece-gündüz ve yaz-kış. Soru birini verirse öteki de doğru.' },
      ),
      kart(
        'Güneye bakan yamaç daha sıcaktır',
        'Kuzey yarım küredeyiz, güneş gökyüzünde güneyden geçer. Güneye bakan yamaç ışığı dik alır, ısınır; kuzeye bakan gölgede kalır. Buna bakı denir. Köyler ve bağlar güney yamaçta toplanır; kar kuzey yamaçta geç erir.',
      ),
      kart(
        'Akıntı kıyının sıcaklığını değiştirir',
        'Londra, Sinop\'tan kuzeyde ama kışı daha ılık: Gulf Stream sıcak akıntısı kıyıyı ısıtır. Okyanus akıntısı, yani deniz suyunun düzenli akışı. Sıcak akıntı kıyıyı ılıtır; soğuk akıntı serinletir, nemi düşürüp kuraklaştırır.',
      ),
    ], [
      soru('Ekvator\'dan kutuplara gidildikçe sıcaklık azalır.', true, 'Güneş ışınlarının geliş açısı küçülüyor.'),
      soru('Kuzey Yarım Küre\'de güneye bakan yamaçlar daha sıcaktır.', true, 'Bakı etkisi: güneş ışınları o yamaca daha dik geliyor.'),
      soru('Karasallık, denizden uzak yerlerde günlük ve yıllık sıcaklık farkını azaltır.', false, 'Tersine artırır; sıcaklığı dengeleyen deniz uzakta kalıyor.'),
      soru('Okyanus akıntılarının kıyı iklimleri üzerinde etkisi yoktur.', false, 'Sıcak akıntılar kıyıyı ılıtır, soğuk akıntılar serinletir ve kuraklaştırır.'),
      sikli('Denizden uzaklaştıkça sıcaklık farkı?', ['Büyür', 'Küçülür'], 0, 'Karasallık.'),
      sikli('Kuzey yarım kürede güneye bakan yamaçlar?', ['Daha çok ısınır', 'Daha az ısınır'], 0, 'Bakı.'),
      sikli('Sıcak akıntı kıyıyı nasıl etkiler?', ['Ilıtır', 'Kuraklaştırır'], 0, 'Soğuk akıntı serinletir ve kuraklaştırır.'),
      sikli('Ekvatordan kutba gidildikçe sıcaklık?', ['Düşer', 'Yükselir'], 0, 'Işınların geliş açısı.'),
      soru('Buz küre iklim sisteminin bileşenlerinden biridir.', true, 'Beş küreden biri: kriyosfer.'),
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
    ]),
    konu('cog9-iklim-tur', 'İklim Türleri', [
      kart(
        'Enlem dünyayı üç kuşağa böler',
        'Ekvator çevresi yıl boyu sıcak, kutuplar yıl boyu soğuk, arası ılıman. Dönenceler (23,5°) sıcak kuşağı, kutup daireleri (66,5°) soğuk kuşağı sınırlar. Her kuşağın kendi iklim türleri var.',
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
        'Sıcak kuşakta fark yağışta',
        'Sıcak kuşakta her yer sıcak; iklimleri yağış ayırır. Ekvatoral: yıl boyu yağış, Amazon. Savan: yalnız yaz yağışlı, Afrika otlakları. Çöl: yağış yok, Sahra. Muson: yazın denizden gelen rüzgârla sağanak, Hindistan.',
      ),
      kart(
        'Ilıman kuşakta fark yağışın mevsiminde',
        'Akdeniz: yaz kurak, kış yağışlı. Okyanusal: her mevsim yağışlı ve ılık, Batı Avrupa. Karasal: yaz sıcak, kış çok soğuk, az yağış. Step: karasalın kurak hâli, bozkır. Türkiye bu kuşakta.',
      ),
      kart(
        'Soğuk kuşakta bitki büyümez',
        'Tundra: yaz kısa, toprak yalnız yüzeyde çözülür; yosun ve cılız çalı, Sibirya\'nın kuzeyi. Kutup: yıl boyu buz, bitki yok, Antarktika. İkisi de soğuk kuşak iklimi.',
      ),
      kart(
        'Türkiye\'de üç iklim var',
        'Akdeniz ve Ege kıyısı: yaz kurak, kış ılık; Akdeniz iklimi. Karadeniz kıyısı: her mevsim yağış; Karadeniz iklimi. İç kesimler ve doğu: yaz sıcak, kış soğuk, az yağış; karasal iklim. Kıyıdan içeri girdikçe karasallaşır.',
      ),
      kart(
        'Bitki örtüsü iklimin imzasıdır',
        'Antalya\'da kısa boylu, sert yapraklı çalı: maki, Akdeniz iklimi. Rize\'de gür orman: bol yağış, Karadeniz iklimi. Konya\'da ilkbaharda yeşerip yazın sararan ot: bozkır, karasal iklim. Bitkiyi görünce iklimi söyleyebilirsin.',
      ),
      kart(
        'Grafikte sütun yağış, çizgi sıcaklık',
        'İklim grafiğinde her ay bir sütun: yağış. Üstteki çizgi: sıcaklık. Önce yaz aylarına bak. Sıcaklık tepede, sütunlar dipteyse yaz kurak: Akdeniz. Sütunlar her ay yüksekse Karadeniz. Kış sıcaklığı sıfırın altındaysa karasal.',
        undefined,
        { not: 'Grafik sorusunda önce temmuz-ağustos sütununa bak: yağış dibe vurmuşsa Akdeniz, her ay yüksekse Karadeniz.' },
      ),
    ], [
      soru('Ekvatoral iklimde yıl boyunca yağış görülür.', true, 'Sıcaklık ve nem yıl boyu yüksek kalıyor.'),
      soru('Akdeniz ikliminde yazlar sıcak ve kurak, kışlar ılık ve yağışlıdır.', true, 'Bitki örtüsü olan maki bu düzene uyum sağlamış durumda.'),
      soru('İklim kuşakları enlemden bağımsız olarak dağılır.', false, 'Kuşakların sınırını dönenceler ve kutup daireleri, yani enlem çizer.'),
      soru('Tundra iklimi sıcak kuşakta görülür.', false, 'Soğuk kuşakta, kutuplara yakın alanlarda görülüyor.'),
      sikli('Türkiye hangi iklim kuşağındadır?', ['Sıcak', 'Ilıman'], 1, 'Akdeniz, karasal, Karadeniz.'),
      sikli('Akdeniz ikliminin bitki örtüsü?', ['Bozkır', 'Maki'], 1, 'Karadeniz orman, iç kesim bozkır.'),
      sikli('Yıl boyu sıcak ve yağışlı iklim?', ['Savan', 'Ekvatoral'], 1, 'Savanda yalnız yaz yağışlı.'),
      sikli('İklim grafiğinde sütunlar neyi gösterir?', ['Sıcaklığı', 'Yağışı'], 1, 'Çizgi sıcaklık.'),
      soru('Tundra ikliminde bitki örtüsü gürdür.', false, 'Yosun ve cılız çalı; toprak yalnız yüzeyde çözülür.'),
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
    ]),
    konu('cog9-iklim-degisim', 'İklim Sisteminde Yaşanan Değişiklikler', [
      kart(
        'İklim insandan önce de değişti',
        'Yirmi bin yıl önce Avrupa\'nın yarısı buzla kaplıydı; sonra buzlar çekildi. Dünyanın yörüngesi biraz kayar, büyük bir volkan patlar, güneşin etkinliği değişir. Bunlar doğal sebepler; etkisi binlerce yılda görülür.',
      ),
      kart(
        'Sera etkisi dünyayı sıcak tutar',
        'Serada cam güneşi içeri alır, ısıyı dışarı bırakmaz; kışın bile içerisi sıcak. Atmosferdeki karbondioksit ve su buharı aynı işi yapar: yerden yükselen ısıyı tutar. Bu doğal sera etkisi olmasa dünya ortalaması −18 °C olurdu.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fosil yakıt sera gazını artırdı',
        'Kömür, petrol ve doğal gaz yanınca karbondioksit çıkar. Sanayi devriminden beri fabrika, araba ve santral yakıyor; atmosferdeki karbondioksit 150 yılda yarı yarıya arttı. Battaniye kalınlaştı, dünya 1 °C\'den fazla ısındı.',
      ),
      kart(
        'Isınma buzulu eritir, denizi yükseltir',
        '1 derece az görünür ama Grönland buzulları eriyor, su denize karışıyor; deniz seviyesi 20 cm yükseldi. Sıcak hava daha çok buhar taşır: seller şiddetlendi, kuraklıklar uzadı. Aşırı hava olayları arttı.',
      ),
      kart(
        'Türkiye en riskli bölgelerden birinde',
        'Akdeniz havzası, yani Akdeniz\'i çevreleyen ülkeler, dünyada en hızlı kuruyan yerlerden. Türkiye bu havzada. Yaz yangınları çoğaldı, barajlar boşaldı, göller çekildi. Su sıkıntısı artık yaz haberi değil, yıl boyu.',
      ),
      kart(
        'Azaltım sebebi, uyum sonucu hedefler',
        'Kömür santrali yerine güneş paneli kurmak azaltım: sera gazını, yani sebebi azaltır. Kuraklığa dayanıklı tohum ekmek uyum: değişen iklimle yaşamayı öğrenir, sonucu hedefler. İkisi birlikte gerekir.',
        {
          tur: 'tablo',
          basliklar: ['Azaltım', 'Uyum'],
          satirlar: [
            ['Yenilenebilir enerji', 'Damla sulama'],
            ['Toplu taşıma', 'Sel önleme'],
            ['Ağaçlandırma', 'Kuraklığa dayanıklı tohum'],
          ],
        },
        { not: 'Soruda önce sor: bu iş sera gazını mı azaltıyor, sıcak dünyaya mı alıştırıyor? İlki azaltım, ikincisi uyum.' },
      ),
      kart(
        'Paris Anlaşması ısınmaya sınır koydu',
        '2015\'te ülkeler Paris\'te söz verdi: ısınma sanayi öncesine göre 2 °C\'yi, mümkünse 1,5 °C\'yi geçmesin. Her ülke ne kadar salım azaltacağını kendisi bildiriyor. Türkiye 2021\'de katıldı.',
      ),
    ], [
      soru('Sera gazlarının artması yeryüzü sıcaklığının yükselmesine yol açar.', true, 'Battaniye kalınlaşıyor: yerden yükselen ısı daha çok tutuluyor.'),
      soru('İklim değişikliğinin tek sebebi insan etkinlikleridir.', false, 'Volkanlar ve güneş etkinliği gibi doğal sebepler de var; bugünkü hızlı ısınmada insan etkisi baskın.'),
      soru('Azaltım salımı düşürmeyi, uyum ise değişimin etkileriyle baş etmeyi hedefler.', true, 'İkisi birbirinin yerine geçmiyor, birlikte yürütülüyor.'),
      soru('Türkiye kuraklıktan etkilenmeyecek bir konumdadır.', false, 'Akdeniz havzası kuraklık riski en yüksek bölgelerden biri.'),
      sikli('İnsan kaynaklı iklim değişimi ne zamandan beri hızlandı?', ['Tarım devriminden', 'Sanayi devriminden'], 1, 'Fosil yakıt.'),
      sikli('Sera etkisi hiç olmasaydı dünya nasıl olurdu?', ['Çok sıcak', 'Yaşanmayacak kadar soğuk'], 1, 'Ortalama −18 °C.'),
      sikli('Kuraklığa dayanıklı tohum kullanmak nedir?', ['Azaltım', 'Uyum'], 1, 'Değişen koşula göre düzenleme.'),
      sikli('Paris Anlaşması ne ister?', ['Fosil yakıtı yasaklamak', 'Sıcaklık artışını sınırlamak'], 1, '2 °C, mümkünse 1,5 °C.'),
      soru('Akdeniz havzası iklim değişikliğinde risk bölgesidir.', true, 'Kuraklık ve yangın artıyor.'),
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
    ]),
  ]),
  tema('cog9-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog9-nufus-degisim', 'Nüfusun Tarihsel Değişimi ve Geleceği', [
      kart(
        'Tarım öncesi nüfus hep azdı',
        'İnsanlar avcı ve toplayıcıyken çevrede ne kadar yiyecek varsa o kadar kişi doyardı; besin sınırlı, nüfus az. Tarım devrimiyle yiyecek arttı, köyler kuruldu; nüfus arttı ama yine yavaş. Doğum çok, ölüm de çoktu.',
      ),
      kart(
        'Sanayi devrimiyle nüfus fırladı',
        '1800\'de dünya 1 milyardı; 2 milyara ulaşmak 130 yıl sürdü. Sonra 8 milyara yalnız 90 yılda çıktı. Sanayi devrimi ve tıptaki ilerleme ölümü azalttı; grafikteki eğri bu yüzden birden dikleşiyor.',
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
        'Artışın sebebi ölümün azalması',
        'Eskiden beş çocuktan ikisi büyümeden ölürdü. Temiz su, kanalizasyon, aşı ve antibiyotik geldi; çocuklar yaşadı. Doğum sayısı artmadı, zaten yüksekti. Nüfus patlamasının sebebi ölümün düşmesi, doğumun artması değil.',
        undefined,
        { etiket: 'Sık hata', not: '"Nüfus neden arttı" sorusunda aklına doğum geliyorsa dur: doğum zaten çoktu, değişen şey ölümün azalması.' },
      ),
      kart(
        'Bugün artış yavaşlıyor',
        'Dünya nüfusu hâlâ artıyor ama eskisinden yavaş. Japonya, İtalya ve Almanya\'da nüfus azalmaya başladı bile: doğan çocuk ölenden az. Türkiye\'de artış sürüyor ama hızı düşüyor.',
      ),
      kart(
        'İnsanların yarısından çoğu şehirde',
        '1950\'de her üç kişiden biri şehirde yaşıyordu; bugün ikisi. Köyden şehre taşınmaya kentleşme denir. Oran yükselmeye devam ediyor: iş, okul ve hastane şehirde.',
      ),
      kart(
        'Nüfus yüzyılın sonunda duracak',
        'Tahminler dünya nüfusunun 2100\'e doğru 10–11 milyarda durmasını söylüyor. Avrupa ve Doğu Asya küçülecek; artışın büyük kısmı Afrika\'dan gelecek, çünkü orada doğum hâlâ yüksek.',
      ),
    ], [
      soru('Dünya nüfusunun hızlı artışında ölüm oranlarının düşmesi etkili olmuştur.', true, 'Temiz su, aşı ve antibiyotikle çocuklar yaşadı.'),
      soru('Sanayi Devrimi\'ne kadar dünya nüfusu yavaş artmıştır.', true, 'Yüksek doğumu yüksek ölüm dengeliyordu.'),
      soru('Bugün dünya nüfusunun büyük kısmı kırsal alanda yaşamaktadır.', false, 'Nüfusun yarısından fazlası kentlerde yaşıyor.'),
      soru('Nüfus artış hızı bugün bütün ülkelerde aynıdır.', false, 'Bazı ülkelerde nüfus hızla artarken Japonya gibi ülkelerde azalıyor.'),
      sikli('Dünya nüfusunun yarısından fazlası nerede yaşıyor?', ['Kırda', 'Şehirlerde'], 1, 'Oran artıyor.'),
      sikli('Gelecekteki artış büyük ölçüde nereden gelecek?', ['Avrupa', 'Afrika'], 1, 'Orada doğum hâlâ yüksek.'),
      soru('Tarım devrimine kadar nüfus hızla artıyordu.', false, 'Besin sınırlıydı; nüfus az ve yavaş artıyordu.'),
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
        'İnsan ılık ve düz yeri seçer',
        'Çukurova\'da her köşede köy var, Ağrı Dağı\'nın yamacında kimse yok. Ilıman iklim, düz arazi, su ve verimli toprak insanı çeker. Bunlara nüfus dağılışının doğal faktörleri denir: doğanın sunduğu şartlar.',
      ),
      kart(
        'İş olan yer nüfus çeker',
        'Kocaeli\'nin iklimi Sinop\'tan iyi değil ama fabrikaları var; nüfusu birkaç kat fazla. Sanayi, ticaret, ulaşım ve turizm iş demek. Bunlar beşerî faktörler: insanın kendi yarattığı çekim.',
      ),
      kart(
        'Kutup, çöl, dağ, balta girmemiş orman',
        'Kutuplar çok soğuk, çöller çok kurak. Yüksek dağlar dik ve soğuk, ekvatoral ormanlar boğucu nemli ve hastalıklı. Bu dört yer seyrek nüfuslu. Ekvatoral ormanı "sıcak ve yağışlı, kalabalıktır" sanma.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Aritmetik yoğunluk: nüfus bölü alan',
        'Mısır\'da 100 milyon kişi 1 milyon km²\'de: aritmetik yoğunluk 100 kişi/km². Ama ülkenin %95\'i çöl; herkes Nil kıyısında sıkışmış, orada yoğunluk 1000\'i geçer. Aritmetik yoğunluk çölü de sayar, bu yüzden yanıltır.',
      ),
      kart(
        'Göçün türleri ikişer ikişer',
        'İzmir\'den Ankara\'ya taşınmak iç göç, Almanya\'ya gitmek dış göç. Fındık toplamaya gidip dönmek mevsimlik, kalmak sürekli. İsteyerek gidiyorsan gönüllü, savaştan kaçıyorsan zorunlu göç. Göçlerin çoğunun sebebi iş, yani ekonomik.',
      ),
      kart(
        'Bir şey iter, bir şey çeker',
        'Köyde iş yok, bu iter. Şehirde fabrika var, bu çeker. Göç iki uçtan beslenir: bulunduğun yerde tutunamamak ve gideceğin yerde daha iyisini ummak. Tabloda karşılıklı örnekler var.',
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
        { not: 'Göç sorusunda tek sebeple yetinme; hep bir iten, bir çeken var. Yalnızca birini yazmak yarım cevap.' },
      ),
      kart(
        'Göç iki tarafı da değiştirir',
        'Gençler gidince köyde yaşlılar kalır, okul kapanır: veren yer küçülür ve yaşlanır. Şehirde ise ev yetmez, gecekondu çıkar, yol ve su sıkışır, işsizlik artar: alan yer kalabalık baskısı yaşar.',
      ),
    ], [
      soru('Yüksek ve engebeli alanlar genellikle seyrek nüfusludur.', true, 'Dik ve soğuk; tarım ve ulaşım zor.'),
      soru('Aritmetik nüfus yoğunluğu, toplam nüfusun yüz ölçüme bölünmesiyle bulunur.', true, 'Kişi/km² olarak yazılıyor.'),
      soru('İtici güçler, insanları göç ettikleri yere çeken sebeplerdir.', false, 'İtici güç bulunulan yerden uzaklaştırır; çeken sebeplere çekici güç denir.'),
      soru('Göç yalnızca göç alan yeri etkiler.', false, 'Göç veren yerde genç nüfus azalıyor, okul kapanıyor; etki iki taraflı.'),
      sikli('Hangisi seyrek nüfuslu alandır?', ['Ekvatoral ormanlar', 'Ilıman ovalar'], 0, 'Kutup, çöl, yüksek dağ da.'),
      sikli('Göçlerin çoğunun sebebi?', ['Ekonomik', 'Dinî'], 0, 'İş imkânı.'),
      sikli('Göç alan yerde ne artar?', ['Konut ve altyapı baskısı', 'Yaşlı nüfus'], 0, 'Veren yer yaşlanır.'),
      soru('Sanayi ve ticaret nüfus çeken beşerî faktörlerdir.', true, 'İş olan yer nüfus çeker.'),
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
    ]),
    konu('cog9-demografik', 'Demografik Dönüşüm ve Nüfus Piramitleri', [
      kart(
        'Ülkeler dört aşamadan geçer',
        'Bir ülkede önce doğum da ölüm de çok: nüfus durgun. Sonra ölüm düşer, doğum hâlâ yüksek: nüfus fırlar. Sonra doğum da düşer: artış yavaşlar. Sonunda ikisi de az: durağan. Bu geçişe demografik dönüşüm denir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: '1. Yüksek doğum', alt: 'yüksek ölüm' },
            { ad: '2. Ölüm düşer', alt: 'hızlı artış' },
            { ad: '3. Doğum düşer' },
            { ad: '4. Durağan' },
          ],
        },
        { etiket: 'Tanım' },
      ),
      kart(
        'Piramit nüfusu yaşa göre dizer',
        'Nüfus piramidi bir grafik: en altta 0–4 yaş, üstünde 5–9, en tepede 85 ve üstü. Sol taraf erkek, sağ taraf kadın. Her çubuğun uzunluğu o yaştaki kişi sayısı. Şekline bakarak ülkeyi tanırsın.',
      ),
      kart(
        'Geniş taban çok çocuk demek',
        'Alt çubuklar uzun, tepe sivriyse çocuk çok, yaşlı az: doğum yüksek. Nijer ve Afganistan gibi gelişmekte olan ülkelerin piramidi böyle. Taban genişse nüfus genç.',
      ),
      kart(
        'Dar taban yaşlanan ülke demek',
        'Alt çubuklar kısa, orta ve üst genişse çocuk az, yaşlı çok: doğum düşmüş. Japonya ve Almanya gibi gelişmiş ülkelerin piramidi böyle. Taban daralıyorsa nüfus yaşlanıyor.',
      ),
      kart(
        'Piramitteki çentik bir olayın izi',
        'Almanya\'nın piramidinde 1940\'larda doğanların çubuğu kısa: savaş yıllarında az çocuk doğdu. Bir yaş grubunda ani daralmaya çentik denir. Savaş, salgın ya da büyük göç piramitte iz bırakır.',
        undefined,
        { not: 'Piramidi okurken önce çentiklere bak; her çentik "o yıllarda ne oldu" sorusunun cevabı.' },
      ),
      kart(
        'Türkiye genç ama yaşlanıyor',
        'Türkiye\'nin piramidinde taban daralıyor, orta kısım geniş: çocuk azalıyor, çalışma çağı kalabalık. Nüfus hâlâ genç ama hızla yaşlanıyor. Yirmi yıl sonra bugünkü orta kısım tepeye çıkacak.',
      ),
    ], [
      soru('Geniş tabanlı nüfus piramidi, doğum oranının yüksek olduğunu gösterir.', true, 'Genç nüfus payı büyük demek.'),
      soru('Dar tabanlı piramit yaşlanan bir nüfusa işaret eder.', true, 'Doğum düşmüş, üst yaş grupları kalabalıklaşmış.'),
      soru('Nüfus piramidinden yalnızca toplam nüfus okunabilir.', false, 'Yaş grupları ve cinsiyet dağılımı da okunuyor.'),
      soru('Demografik dönüşümde önce doğum oranı, sonra ölüm oranı düşer.', false, 'Önce ölüm düşer; doğum sonra iner ve arada nüfus hızla artar.'),
      sikli('Piramitteki ani daralma (çentik) neyin izidir?', ['Doğum artışı', 'Savaş, salgın ya da göç'], 1, 'Bir yaş grubu eksik.'),
      sikli('Türkiye\'nin piramidi için ne söylenir?', ['Çok yaşlı', 'Genç ama hızla yaşlanıyor'], 1, 'Taban daralıyor.'),
      soru('Demografik dönüşümün ikinci aşamasında nüfus hızla artar.', true, 'Ölüm düştü, doğum henüz yüksek.'),
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
        'Fırsat penceresi: çalışan çok, bakılan az',
        'Türkiye\'de bugün her 100 kişiden yaklaşık 68\'i çalışma çağında (15–64). Çocuk azaldı, yaşlı henüz çoğalmadı. Çalışanın bol, bakılanın az olduğu bu döneme demografik fırsat penceresi denir. Güney Kore bu dönemde zenginleşti.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Bağımlılık oranı yükü ölçer',
        'Bir evde iki çalışan, üç çocuk ve bir dede varsa dört bağımlıya iki kişi bakıyor. Bağımlılık oranı, çalışma çağı dışındaki nüfusun çalışma çağındakine oranı. Çocuk da yaşlı da bu orana girer; ikisi de çoksa yük artar.',
      ),
      kart(
        'İş yoksa fırsat işsizliğe döner',
        'Pencere kendiliğinden zenginlik getirmez. Gençler okuyacak okul ve girecek iş bulamazsa milyonlarca işsiz genç olur. Fırsat, ancak eğitim ve istihdam yetişirse fırsattır; yetişmezse sorun.',
        undefined,
        { not: '"Fırsat" kelimesine aldanma: pencere açıkken iş yaratılmazsa aynı gençler işsizlik sorunu olur.' },
      ),
      kart(
        'Yaşlanınca çalışan başına yük artar',
        'Japonya\'da bugün her yaşlıya iki çalışan düşüyor; 1970\'te sekizdi. Emekli maaşı ve hastane parası çalışanın vergisinden çıkar. Yaşlı çoğaldıkça harcama artar, ödeyen azalır.',
      ),
      kart(
        'Politika artırıcı da azaltıcı da olur',
        'Nüfus politikası, devletin doğum sayısını etkileme çabası. Çin tek çocuk kuralıyla azalttı. Türkiye 1965–1983 arasında azaltıcı politika uyguladı: nüfus hızla artıyordu, aile planlaması yaygınlaştırıldı.',
      ),
      kart(
        'Bugün Türkiye doğumu artırmak istiyor',
        'Nüfusun yerinde kalması için kadın başına ortalama 2,1 çocuk gerekir; buna yenilenme düzeyi denir. Türkiye\'de sayı bunun altına indi. Bu yüzden politika artırıcı yöne döndü: doğum yardımı, uzun izin.',
      ),
    ], [
      soru('Demografik fırsat penceresi, çalışma çağındaki nüfusun payının yüksek olduğu dönemdir.', true, 'Doğru politikalarla ekonomik büyümeye çevrilebiliyor.'),
      soru('Bağımlılık oranı, çalışma çağı dışındaki nüfusun çalışma çağındakilere oranıdır.', true, 'Hem çocuklar hem yaşlılar bu orana giriyor.'),
      soru('Nüfus politikaları yalnızca nüfusu artırmak amacıyla uygulanır.', false, 'Azaltıcı politika da var; Türkiye 1965–1983 arasında uyguladı.'),
      soru('Yaşlanan nüfus, sağlık ve emeklilik harcamalarını azaltır.', false, 'Tersine artırır; çalışan başına düşen yük büyür.'),
      sikli('Çalışma çağı nüfusunun en yüksek olduğu dönem?', ['Demografik fırsat penceresi', 'Yaşlanma'], 0, 'Doğru kullanılırsa kalkınma.'),
      sikli('Türkiye 1965-1983 arasında hangi politikayı uyguladı?', ['Azaltıcı', 'Artırıcı'], 0, 'Bugün artırıcı.'),
      soru('Eğitim ve istihdam yetişmezse genç nüfus işsizlik sorununa dönüşür.', true, 'Fırsat sorun olur.'),
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
        'Doğa neyin nerede yapılacağını söyler',
        'Zonguldak\'ta maden var çünkü yer altında kömür var; Rize\'de çay var çünkü yağmur bol. İklim, yer şekli, toprak, su ve yer altı kaynağı doğal faktörler: doğanın önceden verdiği şartlar.',
      ),
      kart(
        'Her bitkinin istediği hava farklı',
        'Çay bol yağış ve serin yaz ister: Doğu Karadeniz. Pamuk sıcak ve kurak yaz ister: Çukurova. Yerlerini değiştirsen ikisi de olmaz. Sıcaklık ve yağış, nerede ne yetişeceğini belirler.',
      ),
      kart(
        'Engebe her işi pahalılaştırır',
        'Dağlık yerde tarlalar küçük ve dik, traktör giremez. Yol tünel ve viyadük ister, maliyet katlanır. Fabrika düz ve geniş alan ister; sanayi bu yüzden ovalarda ve kıyılarda toplanır.',
      ),
      kart(
        'Doğa yetmez, para ve insan da gerekir',
        'Sibirya\'nın yer altı zengin ama az işletiliyor: sermaye, yani yatırım parası, ve işçi yok, pazar uzak. Sermaye, iş gücü, teknoloji, pazar ve ulaşım beşerî faktörler. Doğa uygun olsa da bunlar yoksa iş gelişmez.',
      ),
      kart(
        'Üç sektör: üret, işle, hizmet ver',
        'Çiftçi buğdayı yetiştirir: birincil sektör, doğadan doğrudan alır. Fabrika buğdayı una ve ekmeğe çevirir: ikincil sektör, sanayi. Market ekmeği satar, öğretmen ders verir: üçüncül sektör, hizmet.',
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
        'Ekonomi de doğayı değiştirir',
        'Aral Gölü\'nün suyu pamuk tarlalarına çekildi; göl kurudu. Baraj vadiyi göle çevirir, maden dağı oyar, aşırı sulama toprağı tuzlar. Doğa ekonomiyi biçimliyor ama ok ters yönde de işliyor.',
        undefined,
        { not: 'Bu konuda ok tek yönlü değil: doğa ekonomiyi kurar, ekonomi doğayı bozar. Soruda iki yönü de düşün.' },
      ),
    ], [
      soru('Tarım faaliyetleri iklim koşullarından doğrudan etkilenir.', true, 'Sıcaklık ve yağış, yetişecek ürünü belirliyor.'),
      soru('Sanayi ikincil, hizmet ise üçüncül sektör sayılır.', true, 'Birincil sektör doğrudan doğadan üretim yapan tarım ve madencilik.'),
      soru('Yer şekillerinin ulaşım ağının kurulmasında etkisi yoktur.', false, 'Dağlık alanda yol tünel ve viyadük ister; maliyet katlanır.'),
      soru('Ekonomik faaliyetleri yalnızca doğal faktörler belirler.', false, 'Sermaye, iş gücü, teknoloji ve pazar gibi beşerî faktörler de belirleyici.'),
      sikli('Pamuk hangi ovada yetişir?', ['Doğu Karadeniz', 'Çukurova'], 1, 'Sıcak ve kurak yaz ister.'),
      sikli('Düz ovalar hangi faaliyeti çeker?', ['Hayvancılık', 'Sanayi'], 1, 'Fabrika düz ve geniş alan ister.'),
      soru('Doğal koşullar elverişliyse sermaye olmadan da sanayi gelişir.', false, 'Beşerî faktörler yoksa gelişmez; Sibirya örneği.'),
    ], [
      {
        soru: 'Çayın Doğu Karadeniz\'de yetişmesini belirleyen faktör?',
        siklar: ['Sermaye', 'İklim'],
        dogru: 1,
        aciklama: {
          dogru: 'Bol yağış ve serin yaz çayın isteği; başka yerde para da yetmez.',
          yanlis: 'Sermaye beşerî faktör; iklim uygun değilse çay yetişmez. Belirleyen bol yağışlı, serin iklim.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('cog9-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog9-tehlike-risk', 'Tehlike, Risk ve Afet', [
      kart(
        'Tehlike, zarar verebilecek olaydır',
        'Evinin altından fay geçiyor. Deprem henüz olmadı ama olabilir ve zarar verebilir. Tehlike, yani zarar verme ihtimali taşıyan olay. Deprem, sel, fabrika kazası: hepsi tehlike.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Risk: olursa ne kaybedersin',
        'Aynı fay, iki bina. Biri çelik, deprem yönetmeliğine uygun; öteki kaçak katlı. Tehlike ikisinde aynı, risk farklı. Risk, tehlike gerçekleşirse beklenen kayıp. Hazırlık riski düşürür, tehlikeyi değil.',
      ),
      kart(
        'Afet: baş edilemeyen kayıp',
        'Deprem oldu, binalar yıkıldı, hastane yetmiyor, şehir dışarıdan yardım bekliyor. Afet, toplumun kendi imkânıyla baş edemediği, can ve mal kaybına yol açan olay. Küçük bir sarsıntı afet değil; yıkım afet.',
      ),
      kart(
        'Üçü aynı olayın üç aşaması',
        'Tehlike: deprem olabilir. Risk: olursa şu kadar bina yıkılır. Afet: oldu, yıkıldı. Karıştırırsan yanlış yere para harcarsın: tehlikeyi yok edemezsin ama riski düşürebilirsin.',
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
        'Kimsenin olmadığı yerde afet olmaz',
        'Boş bir çölde 7 büyüklüğünde deprem: kimse ölmedi, hiçbir şey yıkılmadı. Bu yalnızca bir doğa olayı. Afet, olayın insanla ve yapıyla karşılaşmasıdır. Deprem afet değil, hazırlıksız şehir afet.',
        undefined,
        { etiket: 'Sık hata', not: 'Sınavda "deprem afettir" cümlesi gelirse dur: deprem tehlike, yıkım afet. Ayrım her soruda geçiyor.' },
      ),
      kart(
        'Yoksul ve çürük yer daha çok kaybeder',
        'Aynı büyüklükte deprem Şili\'de az, Haiti\'de çok can aldı: Haiti\'de binalar çürük, sağlık sistemi zayıf. Kırılganlık, yani bir toplumun zarar görmeye açıklığı. Yapı kalitesi ve gelir düştükçe kırılganlık artar.',
      ),
    ], [
      soru('Bir doğa olayı, insana ve yapılara zarar verdiğinde afet hâline gelir.', true, 'Afeti tanımlayan şey olayın kendisi değil sonucu.'),
      soru('Issız bir çölde meydana gelen büyük bir deprem afet sayılır.', false, 'Zarar görecek insan ya da yapı yoksa olay afete dönüşmez.'),
      soru('Risk, bir tehlike gerçekleşirse beklenen kayıptır.', true, 'Tehlike olabilecek olay; risk onun bize vereceği zarar.'),
      soru('Kırılganlık, bir toplumun afete karşı direncini artıran özelliklerdir.', false, 'Tam tersi: kırılganlık zarar görme ihtimalini artıran özellikler.'),
      sikli('Hazırlıklı şehirde deprem için hangisi düşer?', ['Risk', 'Tehlike'], 0, 'Tehlike aynı, beklenen kayıp düşük.'),
      sikli('Toplumun kendi imkânıyla baş edemediği olay?', ['Afet', 'Tehlike'], 0, 'Can ve mal kaybı.'),
      soru('Aynı olay yapı kalitesi düşük yerlerde daha büyük kayıp verir.', true, 'Kırılganlık; Haiti örneği.'),
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
        'Afetler kaynağına göre dört grup',
        'Deprem yerin altından gelir, sel gökten, salgın canlıdan, fabrika patlaması insandan. Afetler nereden geldiğine göre gruplanır: jeolojik, meteorolojik, biyolojik, beşerî. Tablo her gruba örnek veriyor.',
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
        'Jeolojik: yerin altından gelir',
        'Jeoloji yer kabuğunun bilimi; jeolojik afet yer kabuğunun hareketinden doğar. Deprem, volkan patlaması, heyelan (toprağın yamaçtan kayması) ve tsunami (deniz altı depremin dev dalgası). Heyelanı yağmur tetikler ama kayan şey yer kütlesi.',
      ),
      kart(
        'Meteorolojik: havadan gelir',
        'Meteoroloji hava olaylarının bilimi. Sel, kuraklık, fırtına, dolu, çığ ve sıcak hava dalgası: hepsi atmosferden gelen afetler. Çığ karın kaymasıdır; kar hava olayı olduğu için meteorolojik sayılır.',
      ),
      kart(
        'Biyolojik: canlıdan gelir',
        'Covid salgınında virüs, çekirge istilasında böcek, orman yangınında yanan ağaç: kaynak canlı. Salgın hastalık, orman yangını ve zararlı böcek istilası biyolojik afet.',
      ),
      kart(
        'Beşerî: insanın kendi yaptığı',
        '1986\'da Çernobil nükleer santrali patladı; kimse doğayı suçlayamadı. Fabrika kazası, nükleer sızıntı, savaş: kaynağı doğrudan insan. Bunlara beşerî afet denir. Dördüncü grup öteki üçünden bununla ayrılır.',
      ),
      kart(
        'Bir afet ötekini tetikler',
        '2011\'de Japonya\'da deprem oldu; deprem tsunamiyi, tsunami nükleer sızıntıyı tetikledi. Deprem heyelanı, heyelan dereyi tıkayıp taşkını, taşkın salgını doğurabilir. Buna zincirleme afet denir.',
        undefined,
        { not: 'Afet sorusunda olayı tek başına düşünme; "peki bu ne tetikler" diye sor. Zincirin ikinci halkası sık soruluyor.' },
      ),
      kart(
        'Türkiye\'de üçü sık: deprem, heyelan, sel',
        'Kuzey Anadolu ve Doğu Anadolu fay hatları ülkeyi boydan boya geçer; büyük depremler bu yüzden. Karadeniz\'in dik ve yağışlı yamaçları heyelan, dere yataklarına kurulan mahalleler sel getirir.',
      ),
    ], [
      soru('Deprem ve heyelan jeolojik afetler arasında yer alır.', true, 'Kaynağı yer kabuğundaki hareketler.'),
      soru('Kuraklık ve sel meteorolojik afetlerdendir.', true, 'İkisinin de kaynağı atmosfer olayları.'),
      soru('Salgın hastalıklar beşerî afet sayılır.', false, 'Kaynağı canlı (virüs, bakteri); biyolojik afet grubunda.'),
      soru('Bir afet başka bir afeti tetikleyemez.', false, 'Japonya 2011: deprem tsunamiyi, tsunami nükleer sızıntıyı tetikledi.'),
      sikli('Tsunami hangi gruptadır?', ['Jeolojik', 'Meteorolojik'], 0, 'Deniz altı depremin dalgası.'),
      sikli('Orman yangını hangi gruptadır?', ['Biyolojik', 'Beşerî'], 0, 'Salgın ve böcek istilası da.'),
      sikli('Depremin heyelanı tetiklemesine ne denir?', ['Zincirleme afet', 'Beşerî afet'], 0, 'Heyelan taşkını doğurabilir.'),
      soru('Türkiye\'de en sık görülen afetler deprem, heyelan ve seldir.', true, 'Fay hatları, dik yamaçlar, dere yatağına kurulan mahalleler.'),
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
    ]),
    konu('cog9-afet-yonetim', 'Bütüncül Afet Yönetimi', [
      kart(
        'Afet yönetimi dört aşamalı döngü',
        'Afet yönetimi yalnızca enkazdan insan çıkarmak değil. Afet olmadan zarar azaltma ve hazırlık, olurken müdahale, sonra iyileştirme. İyileştirme bitince sıradaki afet için yine zarar azaltmaya dönülür: döngü kapanmaz.',
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
        'Zarar azaltma: sağlam bina, doğru yer',
        'Dere yatağına ev yapma, binayı yönetmeliğe uygun kur, kaçak katı denetle. Zarar azaltma, afet olmadan yapılan bu işler. En ucuz ve en etkili aşama: binayı sağlam yapmak, yıkıldıktan sonra kurtarmaktan ucuz.',
      ),
      kart(
        'Hazırlık: gelince ne yapacağını bil',
        'Okuldaki deprem tatbikatı, evdeki afet çantası (su, fener, ilaç). Mahalledeki toplanma alanı, telefona gelen erken uyarı. Hazırlık, afet anında paniklememek için önceden prova etmek.',
      ),
      kart(
        'Müdahale: ilk 72 saat',
        'Enkaz altındaki insan susuz ancak üç gün dayanır; ilk 72 saat bu yüzden kritik. Arama-kurtarma, yaralı tedavisi, çadır ve sıcak yemek müdahale aşamasının işi. Afet olurken yürütülür.',
      ),
      kart(
        'İyileştirme en uzun sürer',
        'Çadırdan kalıcı konuta geçmek yıllar alır. Yol, su, elektrik onarımı; dükkânını kaybedene destek; travma yaşayan çocuğa psikolojik yardım. İyileştirme, hayatı afet öncesine döndürme; en uzun aşama.',
      ),
      kart(
        'Yalnız müdahale eden hep baştan başlar',
        'Sadece kurtarmaya para ayıran şehir her depremde aynı enkazı kaldırır. Bütüncül yönetim dört aşamayı birlikte yürütür: iyileştirmede öğrenilen, sonraki zarar azaltmaya girer. Asıl kazanç afet olmadan alınır.',
        undefined,
        { not: 'Adları ezberlemek yetmez; "döngü neden kapanmaz" sorusunun cevabı: iyileştirmede öğrenilen, zarar azaltmayı besler.' },
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
      soru('Zarar azaltma aşaması afetten önce yapılan çalışmaları kapsar.', true, 'Sağlam bina, doğru yer seçimi, imar denetimi bu aşamada.'),
      soru('İyileştirme aşaması yalnızca yıkılan binaların onarılmasıdır.', false, 'Ekonomik destek ve psikolojik yardım da bu aşamanın işi.'),
      soru('Bütüncül afet yönetimi aşamaları birbirine bağlı bir döngü olarak ele alır.', true, 'İyileştirmede öğrenilen, sonraki zarar azaltmayı besliyor.'),
      sikli('İlk 72 saatin kritik olduğu aşama?', ['İyileştirme', 'Müdahale'], 1, 'Arama-kurtarma.'),
      sikli('En uzun süren aşama?', ['Hazırlık', 'İyileştirme'], 1, 'Kalıcı konut, altyapı.'),
      soru('Afet yönetimi döngüsü müdahaleyle biter.', false, 'Müdahaleden sonra iyileştirme gelir, o da zarar azaltmaya bağlanır.'),
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
    ]),
  ]),
  tema('cog9-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog9-bolge', 'Bölge ve Bölge Sınırı', [
      kart(
        'Bölge: bir ölçüte göre benzeşen alan',
        'Konya, Aksaray, Karaman: hepsinde bozkır, az yağış, buğday. Bu ortak özellik onları çevreden ayırır; birlikte bir bölge oluştururlar. Bölge, seçilen bir ölçüte göre benzer özellik gösteren, çevresinden ayrılan alan.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ölçütü değiştir, bölge değişir',
        'İklime göre çizersen Kocaeli Karadeniz iklim bölgesinde. Sanayiye göre çizersen Marmara sanayi bölgesinde. Aynı şehir, iki ayrı bölge. Bölge yerin kendi özelliği değil, senin seçtiğin ölçütün sonucu.',
        undefined,
        { not: 'Soru "bu yer hangi bölgede" diyorsa önce ölçütü bul: iklim mi, ekonomi mi? Ölçüt değişince cevap da değişir.' },
      ),
      kart(
        'Doğal sınır çizgi değil, geçiş kuşağı',
        'Karadeniz iklimi bir il sınırında bitmez; orman yavaş yavaş seyrelir, bozkıra döner. Doğal bölgelerin sınırı kilometrelerce genişlikte geçiş kuşağı. İl sınırı ise keskin: bir adımda öteki ildesin. O sınırı insan çizdi.',
      ),
      kart(
        'Bölgeler ölçütüne göre üç türdür',
        'Ölçüt doğaysa doğal bölge: iklim, bitki, yer şekli. Ölçüt insansa beşerî bölge: dil, nüfus, kültür. Ölçüt ekonomiyse ekonomik bölge: sanayi, tarım, turizm. Büyüklük de değişir: kıta parçası, ülke ya da bir ilçe.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Ölçüt', 'Örnek'],
          satirlar: [
            ['Doğal', 'İklim, bitki', 'Bozkır bölgesi'],
            ['Beşerî', 'Dil, nüfus', 'Yoğun nüfuslu alan'],
            ['Ekonomik', 'Sanayi, tarım', 'Sanayi bölgesi'],
          ],
        },
      ),
      kart(
        'Koşul değişince sınır kayar',
        'Ölçüt aynı kalsın: "buğday ekilen alan". Kuraklık gelir, kenardaki tarlalar ekilmez olur; tarım bölgesinin sınırı geriye çekilir. Baraj kurulur, kuru arazi sulanır; sınır ilerler. Bölge sınırı sabit değil.',
      ),
      kart(
        'Yedi bölge doğaya göre çizildi',
        'Türkiye\'nin yedi coğrafi bölgesi 1941\'deki Coğrafya Kongresi\'nde belirlendi. Ölçüt iklim, yer şekli ve bitki örtüsü, yani doğal koşullar. İdari birim değil: bölgenin valisi yok, bir il iki bölgeye bölünebilir.',
      ),
    ], [
      soru('Bölge sınırları, seçilen ölçüte göre değişir.', true, 'İklime göre çizilen bölge ile sanayiye göre çizilen bölge aynı olmuyor.'),
      soru('Türkiye\'nin coğrafi bölgeleri il sınırlarıyla birebir örtüşür.', false, 'Bazı iller iki bölgeye birden dağılıyor; bölge idari birim değil.'),
      soru('Doğal bölge sınırları keskin çizgiler değildir; geçiş kuşakları vardır.', true, 'Orman yavaş yavaş seyrelip bozkıra döner; sınır bir kuşak hâlinde.'),
      soru('Bir yer aynı anda birden çok bölgenin içinde yer alamaz.', false, 'Farklı ölçütlerle çizilen bölgeler üst üste binebilir: Kocaeli örneği.'),
      sikli('Doğal bölgelerin sınırı nasıldır?', ['Keskin çizgi', 'Geçiş kuşağı'], 1, 'İdari sınır keskin.'),
      sikli('Kuraklık tarım bölgesinin sınırını ne yapar?', ['Genişletir', 'Geriye çeker'], 1, 'Koşul değişince sınır kayar.'),
      soru('Aynı yer farklı ölçütlere göre farklı bölgelerde olabilir.', true, 'Ölçüt bölgeyi değiştirir.'),
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
