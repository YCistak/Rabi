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
        'İnsan ile doğal ortam arasındaki karşılıklı etkileşimi, dağılış ve yer göstererek inceler.',
      ),
      kart(
        'Fizikî coğrafya',
        'Doğal ortamı inceler: yer şekilleri, iklim, su, toprak ve canlılar.',
      ),
      kart(
        'Beşerî coğrafya',
        'İnsanın mekândaki izini inceler: nüfus, yerleşme, ekonomi, ulaşım ve kültür.',
      ),
      kart(
        'Alt dallar',
        'İki ana bölümün her biri kendi içinde uzmanlaşmış dallara ayrılır.',
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
        'Nerede, neden orada, sonucu ne? Coğrafyayı öteki bilimlerden ayıran şey ikinci ve üçüncü sorudur.',
        undefined,
        { not: 'Her konuda bu üç soruyu sor; "neden orada" cevaplanmıyorsa öğrenmemişsin.' },
      ),
      kart(
        'Dağılış ilkesi',
        'Coğrafya bir olayı tek başına değil, yeryüzüne yayılışıyla inceler. Dağılış haritası coğrafyanın temel aracıdır.',
      ),
    ], [
      soru('Coğrafya, insan ile doğal çevre arasındaki karşılıklı ilişkiyi inceler.', true, 'Yalnızca doğayı ya da yalnızca insanı değil, ikisinin etkileşimini ele alıyor.'),
      soru('Nüfus ve yerleşme fizikî coğrafyanın konusudur.', false, 'İkisi de beşerî coğrafyanın konusu; fizikî coğrafya yer şekilleri ve iklimle ilgilenir.'),
      soru('Dağılış ilkesi, bir olayın nerede ve nasıl yayıldığını sorar.', true, 'Coğrafyanın olayları yere bağlayan temel ilkelerinden biri.'),
      soru('Coğrafyada "neden orada" sorusu sorulmaz.', false, 'Nerede, neden orada ve nasıl sorularının üçü birden coğrafyanın temel soruları.'),
      sikli('İklim ve toprağı inceleyen bölüm?', ['Beşerî coğrafya', 'Fizikî coğrafya'], 1, 'Doğal ortam.'),
      sikli('Coğrafyanın temel aracı nedir?', ['Takvim', 'Dağılış haritası'], 1, 'Olay yeryüzüne yayılışıyla incelenir.'),
      soru('Coğrafyayı öteki bilimlerden ayıran soru "nerede"dir.', false, '"Neden orada" ve "sonucu ne" ayırır.'),
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
        'Olayları yerle birlikte düşünmeyi öğretir: bir depremin sonucu, olduğu yere göre değişir.',
      ),
      kart(
        'Günlük kararlar',
        'Nerede oturulacağı, hangi ürünün nerede yetişeceği, hangi yolun seçileceği coğrafi kararlardır.',
      ),
      kart(
        'Afet ve risk',
        'Fay hattını, taşkın ovasını ve heyelan alanını bilmek doğrudan can güvenliğiyle ilgilidir.',
      ),
      kart(
        'Kaynak yönetimi',
        'Su, toprak ve enerji sınırlıdır. Nerede ne kadar olduğunu bilmeden paylaşım da koruma da yapılamaz.',
      ),
      kart(
        'Küresel bakış',
        'İklim değişikliği, göç ve kaynak paylaşımı gibi sorunlar coğrafi düşünmeden anlaşılmaz.',
      ),
      kart(
        'Coğrafi düşünmenin ölçütü',
        'Bir olayı "nerede" diye sormakla kalmayıp "neden orada" ve "başka yerde nasıl olurdu" diye sormak; cevap yerle birlikte değişiyorsa coğrafi bir sorudur.',
        undefined,
        { not: '"Nerede" ile yetinme; "başka yerde neden olmuyor" asıl soru.' },
      ),
    ], [
      soru('Mekânsal düşünme, bir olayı yerle ilişkisi içinde değerlendirmektir.', true, 'Aynı olay farklı yerlerde farklı sonuçlar doğurabiliyor.'),
      soru('Coğrafya bilgisi afet risklerinin azaltılmasında kullanılır.', true, 'Yerleşim yeri seçimi ve risk haritaları doğrudan coğrafi bilgiye dayanıyor.'),
      soru('Yer seçimiyle ilgili günlük kararlarda coğrafi bilginin bir yararı yoktur.', false, 'Ev, iş yeri ya da tatil yeri seçmek doğrudan mekânsal bir karar.'),
      soru('Coğrafya, ülke ve başkent ezberlemekten ibarettir.', false, 'Yer adları yalnızca bir araç; asıl konu olayların yerle ilişkisi.'),
      sikli('Bir depremin sonucunun yere göre değişmesi hangi düşünmeyi öğretir?', ['Kaynak yönetimi', 'Mekânsal düşünme'], 1, 'Olayı yerle birlikte düşünmek.'),
      sikli('Su ve enerjiyi paylaşmak için önce ne gerekir?', ['Yasa çıkarmak', 'Nerede ne kadar olduğunu bilmek'], 1, 'Kaynak yönetimi.'),
      soru('İklim değişikliği coğrafi düşünmeden anlaşılabilir.', false, 'Küresel bakış gerektirir.'),
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
        'Eratosthenes dünyanın çevresini şaşırtıcı bir yaklaşıklıkla hesapladı; "coğrafya" sözcüğü de ona dayanır.',
      ),
      kart(
        'Batlamyus',
        'Enlem ve boylam ağıyla harita çizdi. Eseri yüzyıllar boyunca hem İslam dünyasında hem Avrupa’da kullanıldı.',
      ),
      kart(
        'İslam dünyasında',
        'Birunî, İdrisî ve Piri Reis harita ve seyahat bilgisiyle coğrafyayı ilerletti.',
      ),
      kart(
        'Piri Reis haritası',
        '1513 tarihli dünya haritası Amerika kıyılarını gösteren en eski haritalardandır; Kitab-ı Bahriye Akdeniz limanlarını tek tek anlatır.',
      ),
      kart(
        'Keşifler çağı',
        'Uzun deniz yolculukları dünya haritasını tamamladı; coğrafya betimlemeden ölçmeye geçti.',
        undefined,
        { not: 'Betimlemeden ölçmeye geçiş; bu tek cümle coğrafyanın bilim olma anı.' },
      ),
      kart(
        'Modern coğrafya',
        'Bugün uydu görüntüsü ve coğrafi bilgi sistemleriyle çalışıyor; veri artık gerçek zamanlı.',
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
      soru('Batlamyus, Dünya yı evrenin merkezine koyan bir model kurmuştur.', true, 'Bu model yüzyıllarca kabul gördü.'),
      soru('Coğrafi Keşifler haritacılığın gelişmesini hızlandırmıştır.', true, 'Yeni kıyılar haritalara işlendi, ölçüm yöntemleri gelişti.'),
      soru('İslam dünyasındaki coğrafyacıların haritacılığa katkısı olmamıştır.', false, 'İdrisi gibi adlar döneminin en ayrıntılı haritalarını çizdi.'),
      soru('Modern coğrafya, yalnızca yerlerin adlarını listeleyen bir bilimdir.', false, 'Modern coğrafya olayların sebeplerini ve dağılışını açıklamaya çalışıyor.'),
      sikli('Eseri yüzyıllarca hem İslam dünyasında hem Avrupa\'da kullanılan haritacı?', ['İdrisî', 'Batlamyus'], 1, 'Enlem-boylam ağı.'),
      sikli('Coğrafya betimlemeden ölçmeye ne zaman geçti?', ['İlk Çağ\'da', 'Keşifler çağında'], 1, 'Uzun deniz yolculukları.'),
      soru('Piri Reis\'in 1513 haritası Amerika kıyılarını gösterir.', true, 'En eski haritalardan.'),
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
        'Harita nedir?',
        'Yeryüzünün tamamının ya da bir bölümünün, ölçek kullanılarak düzleme aktarılmış küçültülmüş çizimi.',
      ),
      kart(
        'Ölçek',
        'Haritadaki uzunluğun gerçekteki uzunluğa oranı. Payda büyüdükçe ölçek küçülür ve ayrıntı azalır.',
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
        '1/500.000 ölçekli haritada 1 cm gerçekte 5 km. Gerçek uzunluk = harita uzunluğu × ölçek paydası; cm\'yi km\'ye çevirmek için beş sıfır at.',
      ),
      kart(
        'Bileşenleri',
        'Başlık, ölçek, lejant, yön oku ve koordinat. Biri eksikse harita okunamaz.',
      ),
      kart(
        'Bozulma kaçınılmaz',
        'Küre düzleme aktarılırken alan, açı ya da uzunluktan biri mutlaka bozulur; hiçbir izdüşüm üçünü birden koruyamaz.',
      ),
      kart(
        'İzohips',
        'Aynı yükseltideki noktaları birleştiren eğri. Sıklaştıkça eğim dikleşir.',
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
        'Renkli haritada yeşil ovayı, sarı ve kahverengi yükselen araziyi gösterir; renk bir yükselti aralığıdır.',
      ),
      kart(
        'Profil çıkarma',
        'İzohips haritasında bir hat boyunca yükseltiler işaretlenip birleştirilirse arazinin yandan görünüşü çıkar.',
      ),
      kart(
        'Büyük mü küçük mü?',
        '1/25.000 büyük ölçek: az yer, çok ayrıntı (şehir planı). 1/5.000.000 küçük ölçek: çok yer, az ayrıntı (dünya haritası).',
        undefined,
        { not: 'Payda büyük, ölçek küçük; bu ters ilişkiyi bir kez sindir, her soruda lazım.' },
      ),
    ], [
      soru('Ölçeğin paydası büyüdükçe haritadaki ayrıntı azalır.', true, 'Küçük ölçekli harita geniş alanı, az ayrıntıyla gösterir.'),
      soru('İzohips eğrileri aynı yükseltideki noktaları birleştirir.', true, 'Bu yüzden iki izohips birbirini kesmez.'),
      soru('Birbirine yakın geçen izohipsler arazinin eğiminin az olduğunu gösterir.', false, 'Sık izohips dik yamaç demek; seyrek geçenler eğimin azaldığını gösterir.'),
      soru('Bir haritada alan, açı ve uzunluk aynı anda hatasız gösterilebilir.', false, 'Küre düzleme aktarılırken bozulma kaçınılmaz; hangisinin korunacağı seçilir.'),
      sikli('1/500.000 ölçekli haritada 1 cm gerçekte kaç km?', ['5', '50'], 0, 'Beş sıfır at.'),
      sikli('Şehir planı için hangi ölçek uygundur?', ['1/25.000 (büyük)', '1/5.000.000 (küçük)'], 0, 'Az yer, çok ayrıntı.'),
      sikli('Payda büyüdükçe ölçek?', ['Küçülür', 'Büyür'], 0, 'Ayrıntı azalır.'),
      sikli('Renkli haritada yeşil neyi gösterir?', ['Ovayı', 'Dağı'], 0, 'Kahverengi yükselen arazi.'),
      sikli('Küre düzleme aktarılırken ne olur?', ['Hiçbir şey bozulmaz', 'Bir bozulma kaçınılmazdır'], 1, 'Alan, açı ya da uzunluktan biri bozulur.'),
      soru('İzohips haritasından arazinin profili çıkarılabilir.', true, 'Hat boyunca yükseltiler birleştirilir.'),
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
    ]),
    konu('cog9-konum', 'Türkiye’nin Coğrafi Konumu', [
      kart(
        'Matematik konum',
        'Yaklaşık 36°-42° kuzey enlemleri ile 26°-45° doğu boylamları arasında.',
      ),
      kart(
        'Enlemin sonuçları',
        'Orta kuşakta olduğu için dört mevsim belirgin yaşanır; güneyden kuzeye sıcaklık azalır.',
      ),
      kart(
        'Boylamın sonuçları',
        'Doğu ile batı arasında 19 boylam farkı vardır; her boylam 4 dakika ettiği için yerel saat farkı 76 dakikadır.',
      ),
      kart(
        'Yerel saat hesabı',
        'Doğudaki yer önde: 45° ile 26° arasındaki fark 19 boylam × 4 dk = 76 dk. Iğdır\'da güneş Edirne\'den 76 dakika önce doğar.',
        undefined,
        { not: 'Doğudaki önde; hesabı yapmadan önce yönü belirle, hata hep işarette.' },
      ),
      kart(
        'Tek saat dilimi',
        'Ülke doğu-batı boyunca 76 dakikalık fark taşısa da tek saat kullanır; bu, ortak bir çalışma düzeni sağlar.',
      ),
      kart(
        'Özel konum',
        'Üç kıtanın kesiştiği yerde, boğazlara sahip; Asya ile Avrupa arasındaki geçiş konumu stratejik değer taşır.',
      ),
      kart(
        'Yükselti etkisi',
        'Ortalama yükseltisi fazladır ve doğuya doğru artar; bu, iklimi ve tarımı doğrudan etkiler.',
      ),
      kart(
        'Konumun ekonomiye etkisi',
        'Enerji hatlarının ve ticaret yollarının kesiştiği yerde olmak, transit geçiş ve turizm avantajı sağlar.',
      ),
    ], [
      soru('Türkiye 36°–42° kuzey enlemleri arasında yer alır.', true, 'Bu enlemler ülkeyi orta kuşakta tutuyor.'),
      soru('Türkiye üç saat dilimine yayıldığı için üç ayrı saat kullanır.', false, 'Üç saat dilimine girse de ülkenin tamamında tek saat uygulanıyor.'),
      soru('Enlem, Türkiye de dört mevsimin belirgin yaşanmasında etkilidir.', true, 'Orta kuşakta olmak mevsim farklarını belirginleştiriyor.'),
      soru('Yükseltinin sıcaklık üzerinde bir etkisi yoktur.', false, 'Her 200 metrede sıcaklık yaklaşık 1 °C düşüyor.'),
      sikli('Türkiye\'nin doğusu ile batısı arasında kaç boylam farkı var?', ['19', '76'], 0, '45 − 26.'),
      sikli('Bir boylam kaç dakika eder?', ['4', '15'], 0, '76 dakika toplam.'),
      sikli('Güneş nerede önce doğar?', ['Iğdır', 'Edirne'], 0, 'Doğu önde.'),
      sikli('Türkiye\'nin ortalama yükseltisi doğuya doğru?', ['Artar', 'Azalır'], 0, 'İklimi ve tarımı etkiler.'),
      soru('Türkiye tek saat dilimi kullanır.', true, 'Ortak çalışma düzeni.'),
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
        'CBS nedir?',
        'Coğrafi Bilgi Sistemleri; konumlu veriyi toplayan, saklayan, çözümleyen ve haritaya döken sistem.',
      ),
      kart(
        'Bileşenler',
        'Donanım, yazılım, veri, insan ve yöntem. En kritik ve en pahalı bileşen veridir.',
      ),
      kart(
        'Uzaktan algılama',
        'Uydu ve hava araçlarıyla temas etmeden veri toplama. Orman yangını ve kuraklık takibinde kullanılır.',
      ),
      kart(
        'GPS',
        'Uydularla konum belirleme. En az dört uydudan gelen sinyal, alıcının yerini üç boyutlu olarak verir.',
      ),
      kart(
        'Katman mantığı',
        'CBS veriyi katmanlar hâlinde üst üste bindirir; çözümleme bu bindirmeden çıkar.',
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
        'Kent planlaması, afet yönetimi, tarım, lojistik ve sağlık; salgın haritaları da bu sistemlerle üretiliyor.',
      ),
      kart(
        'Veri doğruysa sonuç doğru',
        'CBS eski ya da hatalı veriyle de düzgün görünen bir harita üretir. Çıktının güzelliği doğruluk kanıtı değildir.',
        undefined,
        { not: 'Düzgün görünen harita doğru harita değil; veriyi sorgulamayı bırakma.' },
      ),
    ], [
      soru('CBS, konumla ilişkili verileri toplayan, saklayan ve çözümleyen bir sistemdir.', true, 'Veriyi katmanlar hâlinde üst üste koyup ilişkilendiriyor.'),
      soru('Uzaktan algılama, yeryüzüne ait bilginin temas etmeden toplanmasıdır.', true, 'Uydu ve hava fotoğrafları bu yolla elde ediliyor.'),
      soru('GPS, konum belirlemek için yeryüzündeki radyo istasyonlarını kullanır.', false, 'Uydulardan gelen sinyallerin ulaşma sürelerini kullanıyor.'),
      soru('CBS ye girilen veri hatalı olsa bile çıkan sonuç doğru olur.', false, 'Sonuç girilen verinin doğruluğu kadar güvenilir.'),
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
        'Hava durumu ve iklim',
        'Hava durumu kısa süreli, iklim ise uzun yılların ortalaması. "Bugün yağmurlu" hava, "yazları kurak" iklimdir.',
        undefined,
        { not: 'Bir cümlede "bugün" geçiyorsa hava, "yıllardır" geçiyorsa iklim.' },
      ),
      kart(
        'Atmosferin katmanları',
        'Hava olaylarının tamamı en alttaki troposferde gerçekleşir; yukarı çıkıldıkça hava seyrelir.',
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
        'Isınan hava yükselir ve alçak basınç oluşur; soğuyan hava alçalır ve yüksek basınç oluşur.',
      ),
      kart(
        'Rüzgâr',
        'Yüksek basınçtan alçak basınca doğru esen hava. Basınç farkı büyüdükçe hızı artar.',
      ),
      kart(
        'Nem ve yağış',
        'Havadaki su buharı yoğuşunca bulut, bulut damlaları büyüyünce yağış olur.',
      ),
      kart(
        'Yağış türleri',
        'Yükselme sebebine göre üçe ayrılır: yamaç (orografik), cephe (frontal) ve yükselim (konveksiyonel).',
      ),
      kart(
        'Günlük etkiler',
        'Tarım, ulaşım, enerji ve sağlık hava olaylarına bağlıdır; don ve dolu bir yılın ürününü götürebilir.',
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
      sikli('Hava olayları hangi katmanda gerçekleşir?', ['Troposfer', 'Stratosfer'], 0, 'En alt katman.'),
      sikli('"Yazları kurak" ifadesi neyi anlatır?', ['İklimi', 'Hava durumunu'], 0, 'Uzun yılların ortalaması.'),
      sikli('Isınan hava ne oluşturur?', ['Alçak basınç', 'Yüksek basınç'], 0, 'Yükselir.'),
      sikli('Yamaca çarpıp yükselen havanın yağışı?', ['Orografik', 'Frontal'], 0, 'Yamaç yağışı.'),
      soru('Basınç farkı büyüdükçe rüzgâr hızlanır.', true, 'Yüksekten alçağa.'),
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
        'Beş bileşen',
        'Atmosfer, su küre (hidrosfer), taş küre (litosfer), canlı küre (biyosfer) ve buz küre.',
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
        'Sıcaklık, basınç, nem, yağış, rüzgâr ve güneşlenme süresi.',
      ),
      kart(
        'Enlem etkisi',
        'Güneş ışınlarının geliş açısı enlemle değişir; ekvatordan kutuplara gidildikçe sıcaklık düşer.',
      ),
      kart(
        'Yükselti etkisi',
        'Her 100 metrede sıcaklık yaklaşık 0,5 °C düşer. Aynı enlemde bile dağ ile ova arasında büyük fark oluşur.',
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
        'Denizden uzaklaştıkça gece-gündüz ve yaz-kış sıcaklık farkları büyür; kara çabuk ısınıp çabuk soğur.',
        undefined,
        { not: 'Denizden uzaklık gece-gündüz farkını da yaz-kış farkını da büyütür; ikisini birlikte tut.' },
      ),
      kart(
        'Bakı',
        'Kuzey yarım kürede güneye bakan yamaçlar daha çok ısınır; yerleşme ve tarım bu yamaçlarda yoğunlaşır.',
      ),
      kart(
        'Okyanus akıntıları',
        'Sıcak akıntılar kıyıyı ılıtır, soğuk akıntılar serinletir ve kuraklaştırır.',
      ),
    ], [
      soru('Ekvator dan kutuplara gidildikçe sıcaklık azalır.', true, 'Güneş ışınlarının geliş açısı küçülüyor.'),
      soru('Kuzey Yarım Küre de güneye bakan yamaçlar daha sıcaktır.', true, 'Bakı etkisi: güneş ışınları o yamaca daha dik geliyor.'),
      soru('Karasallık, denizden uzak yerlerde günlük ve yıllık sıcaklık farkını azaltır.', false, 'Tersine artırır; sıcaklığı dengeleyen su kütlesi uzakta kalıyor.'),
      soru('Okyanus akıntılarının kıyı iklimleri üzerinde etkisi yoktur.', false, 'Sıcak akıntılar kıyıyı ılıtır, soğuk akıntılar serinletir ve kuraklaştırır.'),
      sikli('Denizden uzaklaştıkça sıcaklık farkı?', ['Büyür', 'Küçülür'], 0, 'Karasallık.'),
      sikli('Kuzey yarım kürede güneye bakan yamaçlar?', ['Daha çok ısınır', 'Daha az ısınır'], 0, 'Bakı.'),
      sikli('Sıcak akıntı kıyıyı nasıl etkiler?', ['Ilıtır', 'Kuraklaştırır'], 0, 'Soğuk akıntı serinletir ve kuraklaştırır.'),
      sikli('Ekvatordan kutba gidildikçe sıcaklık?', ['Düşer', 'Yükselir'], 0, 'Işınların geliş açısı.'),
      soru('Buz küre iklim sisteminin bileşenlerinden biridir.', true, 'Beş bileşenden biri.'),
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
        'Sıcak kuşak iklimleri',
        'Ekvatoral (yıl boyu sıcak ve yağışlı), savan (yazı yağışlı), çöl ve muson iklimleri.',
      ),
      kart(
        'Ilıman kuşak iklimleri',
        'Akdeniz, okyanusal, karasal ve step iklimleri. Türkiye bu kuşaktadır.',
      ),
      kart(
        'Soğuk kuşak iklimleri',
        'Tundra ve kutup iklimi. Bitki örtüsü cılızdır ya da hiç yoktur.',
      ),
      kart(
        'Kuşaklar enleme bağlı',
        'Dönenceler ve kutup daireleri, iklim kuşaklarının sınırlarını çizer.',
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
        'Kıyılarda Akdeniz ve Karadeniz iklimi, iç kesimlerde karasal iklim görülür.',
      ),
      kart(
        'Bitki örtüsü izler',
        'Akdeniz ikliminde maki, Karadeniz’de orman, iç kesimlerde bozkır. Bitki, iklimin görünen yüzüdür.',
      ),
      kart(
        'İklim grafiği okuma',
        'Sütunlar yağışı, çizgi sıcaklığı gösterir. Yaz kuraklığı belirginse Akdeniz iklimi akla gelir.',
        undefined,
        { not: 'Grafikte önce yaz aylarına bak: yağış düşüyorsa Akdeniz ihtimali baştan güçlü.' },
      ),
    ], [
      soru('Ekvatoral iklimde yıl boyunca yağış görülür.', true, 'Sıcaklık ve nem yıl boyu yüksek kalıyor.'),
      soru('Akdeniz ikliminde yazlar sıcak ve kurak, kışlar ılık ve yağışlıdır.', true, 'Bitki örtüsü olan maki bu düzene uyum sağlamış durumda.'),
      soru('İklim kuşakları enlemden bağımsız olarak dağılır.', false, 'Kuşakların temel belirleyicisi enlem; yükselti ve karasallık onu değiştiriyor.'),
      soru('Tundra iklimi sıcak kuşakta görülür.', false, 'Soğuk kuşakta, kutuplara yakın alanlarda görülüyor.'),
      sikli('Türkiye hangi iklim kuşağındadır?', ['Sıcak', 'Ilıman'], 1, 'Akdeniz, karasal, Karadeniz.'),
      sikli('Akdeniz ikliminin bitki örtüsü?', ['Bozkır', 'Maki'], 1, 'Karadeniz orman, iç kesim bozkır.'),
      sikli('Yıl boyu sıcak ve yağışlı iklim?', ['Savan', 'Ekvatoral'], 1, 'Savanda yaz yağışlı.'),
      sikli('İklim grafiğinde sütunlar neyi gösterir?', ['Sıcaklığı', 'Yağışı'], 1, 'Çizgi sıcaklık.'),
      soru('Tundra ikliminde bitki örtüsü gürdür.', false, 'Cılız ya da yok.'),
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
        'Doğal değişimler',
        'Yörünge değişiklikleri, volkanik patlamalar ve güneş etkinliği iklimi jeolojik zaman ölçeğinde değiştirdi.',
      ),
      kart(
        'İnsan kaynaklı değişim',
        'Sanayi devriminden bu yana fosil yakıt kullanımı sera gazlarını hızla artırdı.',
      ),
      kart(
        'Sera etkisi',
        'Atmosferdeki gazlar yeryüzünden yansıyan ısıyı tutar. Doğal sera etkisi olmasaydı dünya yaşanmayacak kadar soğuk olurdu.',
      ),
      kart(
        'Sonuçları',
        'Ortalama sıcaklık artışı, buzul erimesi, deniz seviyesinin yükselmesi ve aşırı hava olaylarında artış.',
      ),
      kart(
        'Türkiye’ye etkisi',
        'Akdeniz havzası risk bölgesinde; kuraklık, orman yangını ve su sıkıntısı artıyor.',
      ),
      kart(
        'Azaltım ve uyum',
        'Azaltım salımı düşürmek, uyum ise değişen koşullara göre yaşamı yeniden düzenlemektir.',
        {
          tur: 'tablo',
          basliklar: ['Azaltım', 'Uyum'],
          satirlar: [
            ['Yenilenebilir enerji', 'Damla sulama'],
            ['Toplu taşıma', 'Sel önleme'],
            ['Ağaçlandırma', 'Kuraklığa dayanıklı tohum'],
          ],
        },
        { not: 'İki kelime iki ayrı iş: biri sebebi, öteki sonucu hedefliyor.' },
      ),
      kart(
        'Küresel anlaşmalar',
        'Paris Anlaşması ülkeleri sıcaklık artışını sınırlamaya çağırıyor; salım azaltımı hedefleri ulusal olarak bildiriliyor.',
      ),
    ], [
      soru('Sera gazlarının artması yeryüzü sıcaklığının yükselmesine yol açar.', true, 'Atmosferden çıkan uzun dalgalı ışınım tutuluyor.'),
      soru('İklim değişikliğinin tek sebebi insan etkinlikleridir.', false, 'Volkanlar ve güneş etkinliği gibi doğal sebepler de var; bugünkü hızlı ısınmada insan etkisi baskın.'),
      soru('Azaltım salımı düşürmeyi, uyum ise değişimin etkileriyle baş etmeyi hedefler.', true, 'İkisi birbirinin yerine geçmiyor, birlikte yürütülüyor.'),
      soru('Türkiye kuraklıktan etkilenmeyecek bir konumdadır.', false, 'Akdeniz havzası kuraklık riski en yüksek bölgelerden biri.'),
      sikli('İnsan kaynaklı iklim değişimi ne zamandan beri hızlandı?', ['Tarım devriminden', 'Sanayi devriminden'], 1, 'Fosil yakıt.'),
      sikli('Sera etkisi hiç olmasaydı dünya nasıl olurdu?', ['Çok sıcak', 'Yaşanmayacak kadar soğuk'], 1, 'Doğal sera etkisi gerekli.'),
      sikli('Kuraklığa dayanıklı tohum kullanmak nedir?', ['Azaltım', 'Uyum'], 1, 'Değişen koşula göre düzenleme.'),
      sikli('Paris Anlaşması ne ister?', ['Fosil yakıtı yasaklamak', 'Sıcaklık artışını sınırlamak'], 1, 'Salım hedefleri ulusal bildiriliyor.'),
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
        'Yavaş başlangıç',
        'Tarım devrimine kadar dünya nüfusu çok azdı ve yavaş artıyordu; besin miktarı sınırdı.',
      ),
      kart(
        'Hızlanma',
        'Sanayi devrimi ve tıptaki ilerlemeyle ölüm oranı düştü, nüfus hızla arttı.',
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
        'Temiz su, kanalizasyon, aşı ve antibiyotik; nüfus artışının sebebi doğum patlaması değil ölümün azalmasıdır.',
        undefined,
        { not: 'Artışı doğuma bağlama; düşen ölüm oranı, sebep orada.' },
      ),
      kart(
        'Bugün',
        'Artış hızı yavaşlıyor; bazı ülkelerde nüfus azalmaya başladı.',
      ),
      kart(
        'Kentleşme',
        'Dünya nüfusunun yarısından fazlası artık şehirlerde yaşıyor; bu oran yükselmeye devam ediyor.',
      ),
      kart(
        'Geleceğe bakış',
        'Nüfusun yüzyılın sonuna doğru durağanlaşması bekleniyor; artış büyük ölçüde Afrika kaynaklı olacak.',
      ),
    ], [
      soru('Dünya nüfusunun hızlı artışında ölüm oranlarının düşmesi etkili olmuştur.', true, 'Sağlık ve beslenme koşulları düzelince ortalama yaşam süresi uzadı.'),
      soru('Sanayi Devrimi ne kadar dünya nüfusu yavaş artmıştır.', true, 'Yüksek doğum oranını yüksek ölüm oranı dengeliyordu.'),
      soru('Bugün dünya nüfusunun büyük kısmı kırsal alanda yaşamaktadır.', false, 'Nüfusun yarısından fazlası kentlerde yaşıyor.'),
      soru('Nüfus artış hızı bugün bütün ülkelerde aynıdır.', false, 'Bazı ülkelerde nüfus hızla artarken bazılarında azalıyor.'),
      sikli('Dünya nüfusunun yarısından fazlası nerede yaşıyor?', ['Kırda', 'Şehirlerde'], 1, 'Oran artıyor.'),
      sikli('Gelecekteki artış büyük ölçüde nereden gelecek?', ['Avrupa', 'Afrika'], 1, 'Bazı ülkelerde nüfus azalıyor.'),
      soru('Tarım devrimine kadar nüfus hızla artıyordu.', false, 'Çok az ve yavaştı.'),
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
        'İklim, yer şekilleri, su kaynakları ve toprak verimliliği. Ilıman ve düz alanlar yoğun nüfusludur.',
      ),
      kart(
        'Beşerî faktörler',
        'Sanayi, ticaret, ulaşım ve turizm. İş imkânı olan yer nüfus çeker.',
      ),
      kart(
        'Seyrek nüfuslu alanlar',
        'Kutuplar, çöller, yüksek dağlar ve ekvatoral ormanlar.',
      ),
      kart(
        'Aritmetik nüfus yoğunluğu',
        'Toplam nüfusun toplam alana bölümü. Kullanılamayan alanları da saydığı için tek başına yanıltıcıdır.',
      ),
      kart(
        'Göç türleri',
        'İç-dış, sürekli-mevsimlik, gönüllü-zorunlu göç. Çoğu göçün sebebi ekonomiktir.',
      ),
      kart(
        'İtici ve çekici güçler',
        'Göç iki uçtan birden beslenir: bir yerde tutunamamak ve başka yerde daha iyisini ummak.',
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
        { not: 'Göçü tek sebeple açıklama; hep bir iten, bir çeken var.' },
      ),
      kart(
        'Göçün sonuçları',
        'Veren yerde nüfus azalır ve yaşlanır; alan yerde konut, altyapı ve işsizlik baskısı artar.',
      ),
    ], [
      soru('Yüksek ve engebeli alanlar genellikle seyrek nüfusludur.', true, 'Tarım ve ulaşım koşulları elverişsiz.'),
      soru('Aritmetik nüfus yoğunluğu, toplam nüfusun yüz ölçüme bölünmesiyle bulunur.', true, 'Kişi/km² olarak yazılıyor.'),
      soru('İtici güçler, insanları göç ettikleri yere çeken sebeplerdir.', false, 'İtici güç bulunulan yerden uzaklaştırır; çeken sebeplere çekici güç denir.'),
      soru('Göç yalnızca göç alan yeri etkiler.', false, 'Göç veren yerde iş gücü ve genç nüfus azalıyor; etki iki taraflı.'),
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
        'Demografik dönüşüm',
        'Yüksek doğum-yüksek ölümden, düşük doğum-düşük ölüme geçiş süreci. Aradaki dönemde nüfus hızla artar.',
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
        'Yaş gruplarını ve cinsiyet dağılımını. Şekli ülkenin gelişmişliği hakkında doğrudan bilgi verir.',
      ),
      kart(
        'Geniş tabanlı piramit',
        'Doğum oranı yüksek, genç nüfus çok. Gelişmekte olan ülkelerde görülür.',
      ),
      kart(
        'Dar tabanlı piramit',
        'Doğum oranı düşük, yaşlı nüfus fazla. Gelişmiş ülkelerde görülür.',
      ),
      kart(
        'Piramitteki çentikler',
        'Bir yaş grubundaki ani daralma savaş, salgın ya da büyük göç gibi bir olayın izidir.',
        undefined,
        { not: 'Piramidin şeklinden önce çentiklerine bak; her biri bir olayın izi.' },
      ),
      kart(
        'Türkiye’nin piramidi',
        'Tabanı daralıyor, orta kısmı genişliyor: nüfus hâlâ genç ama hızla yaşlanıyor.',
      ),
    ], [
      soru('Geniş tabanlı nüfus piramidi, doğum oranının yüksek olduğunu gösterir.', true, 'Genç nüfus payı büyük demek.'),
      soru('Dar tabanlı piramit yaşlanan bir nüfusa işaret eder.', true, 'Doğum oranı düşmüş, üst yaş grupları kalabalıklaşmış.'),
      soru('Nüfus piramidinden yalnızca toplam nüfus okunabilir.', false, 'Yaş grupları ve cinsiyet dağılımı da okunuyor.'),
      soru('Demografik dönüşümde önce doğum oranı, sonra ölüm oranı düşer.', false, 'Önce ölüm oranı düşer; doğum oranının inmesi gecikir ve arada nüfus hızla artar.'),
      sikli('Piramitteki ani daralma (çentik) neyin izidir?', ['Doğum artışı', 'Savaş, salgın ya da göç'], 1, 'Bir yaş grubu eksik.'),
      sikli('Türkiye\'nin piramidi için ne söylenir?', ['Çok yaşlı', 'Genç ama hızla yaşlanıyor'], 1, 'Taban daralıyor.'),
      soru('Demografik dönüşümün ara döneminde nüfus hızla artar.', true, 'Ölüm düştü, doğum henüz yüksek.'),
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
        'Çalışma çağındaki nüfusun oranı en yüksek olduğu dönem. Doğru kullanılırsa hızlı kalkınma sağlar.',
        undefined,
        { not: '"Fırsat" kelimesi aldatmasın: pencere kullanılmazsa sorun olur.' },
      ),
      kart(
        'Bağımlılık oranı',
        'Çalışma çağı dışındaki nüfusun çalışma çağındakine oranı. Hem çok genç hem çok yaşlı nüfus bu oranı yükseltir.',
      ),
      kart(
        'Genç nüfusun sorunu',
        'Eğitim ve istihdam yetişmezse fırsat, işsizlik sorununa dönüşür.',
      ),
      kart(
        'Yaşlanmanın sorunu',
        'Çalışan başına düşen bağımlı sayısı artar; emeklilik ve sağlık harcamaları yükselir.',
      ),
      kart(
        'Nüfus politikaları',
        'Artırıcı ve azaltıcı olmak üzere iki yönlü olabilir; Türkiye 1965-1983 arasında azaltıcı politika uyguladı.',
      ),
      kart(
        'Bugünkü yönelim',
        'Doğurganlık yenilenme düzeyinin altına indiği için politikalar artırıcı yöne döndü.',
      ),
    ], [
      soru('Demografik fırsat penceresi, çalışma çağındaki nüfusun payının yüksek olduğu dönemdir.', true, 'Doğru politikalarla ekonomik büyümeye çevrilebiliyor.'),
      soru('Bağımlılık oranı, çalışma çağı dışındaki nüfusun çalışma çağındakilere oranıdır.', true, 'Hem çocuklar hem yaşlılar bu orana giriyor.'),
      soru('Nüfus politikaları yalnızca nüfusu artırmak amacıyla uygulanır.', false, 'Nüfusu azaltmaya ya da dağılımını değiştirmeye yönelik politikalar da var.'),
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
        'Doğal faktörler',
        'İklim, yer şekilleri, toprak, su ve yer altı kaynakları hangi faaliyetin nerede yapılacağını belirler.',
      ),
      kart(
        'İklimin belirleyiciliği',
        'Çay Doğu Karadeniz’de, pamuk Çukurova’da yetişir; sıcaklık ve yağış isteği bunu zorunlu kılar.',
      ),
      kart(
        'Yer şekillerinin etkisi',
        'Engebeli arazi tarımı ve ulaşımı zorlaştırır, maliyeti artırır; düz ovalar sanayiyi çeker.',
      ),
      kart(
        'Beşerî faktörler',
        'Sermaye, iş gücü, teknoloji, pazar ve ulaşım. Doğal koşullar elverişli olsa da bunlar yoksa faaliyet gelişmez.',
      ),
      kart(
        'Üç sektör',
        'Ekonomik faaliyetler doğaya olan uzaklıklarına göre üç basamakta toplanır.',
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
        'Ekonomik faaliyet de doğayı değiştirir: baraj, madencilik ve aşırı sulama çevreyi dönüştürür.',
        undefined,
        { not: 'Ok tek yönlü değil: doğa ekonomiyi, ekonomi doğayı biçimliyor.' },
      ),
    ], [
      soru('Tarım faaliyetleri iklim koşullarından doğrudan etkilenir.', true, 'Sıcaklık ve yağış, yetişecek ürünü belirliyor.'),
      soru('Sanayi ikincil, hizmet ise üçüncül sektör sayılır.', true, 'Birincil sektör doğrudan doğadan üretim yapan tarım ve madencilik.'),
      soru('Yer şekillerinin ulaşım ağının kurulmasında etkisi yoktur.', false, 'Dağlık alanda yol yapımı hem zor hem pahalı; ağ buna göre şekilleniyor.'),
      soru('Ekonomik faaliyetleri yalnızca doğal faktörler belirler.', false, 'Sermaye, iş gücü, teknoloji ve pazar gibi beşerî faktörler de belirleyici.'),
      sikli('Pamuk hangi ovada yetişir?', ['Doğu Karadeniz', 'Çukurova'], 1, 'Sıcaklık ve yağış isteği.'),
      sikli('Düz ovalar hangi faaliyeti çeker?', ['Hayvancılık', 'Sanayi'], 1, 'Engebe maliyeti artırır.'),
      soru('Doğal koşullar elverişliyse sermaye olmadan da sanayi gelişir.', false, 'Beşerî faktörler yoksa gelişmez.'),
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
        'Zarar verme potansiyeli olan doğal ya da beşerî olay. Deprem başlı başına bir tehlikedir.',
      ),
      kart(
        'Risk',
        'Tehlikenin gerçekleşmesi hâlinde beklenen kayıp. Aynı deprem, hazırlıklı bir şehirde daha düşük risk taşır.',
      ),
      kart(
        'Afet',
        'Toplumun kendi imkânlarıyla baş edemediği, can ve mal kaybına yol açan olay.',
      ),
      kart(
        'Üçü arasındaki fark',
        'Üç kavram aynı olayın farklı aşamalarını anlatır; karıştırıldığında korunma da yanlış yere yatırılır.',
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
        'İnsan ve yapı yoksa deprem yalnızca bir doğa olayıdır. Afet, olayın toplumla karşılaşmasıyla oluşur.',
        undefined,
        { not: 'Deprem afet değil, hazırlıksız şehir afet; ayrımı bu cümleyle tut.' },
      ),
      kart(
        'Kırılganlık',
        'Aynı şiddetteki olay, yapı kalitesi ve gelir düzeyi düşük yerlerde daha büyük kayıp verir.',
      ),
    ], [
      soru('Bir doğa olayı, insana ve yapılara zarar verdiğinde afet hâline gelir.', true, 'Afeti tanımlayan şey olayın kendisi değil sonucu.'),
      soru('Issız bir çölde meydana gelen büyük bir deprem afet sayılır.', false, 'Zarar görecek insan ya da yapı yoksa olay afete dönüşmez.'),
      soru('Risk, bir tehlikenin zarara yol açma olasılığıdır.', true, 'Tehlike var olan bir olasılık; risk onun bizi etkileme ihtimali.'),
      soru('Kırılganlık, bir toplumun afete karşı direncini artıran özelliklerdir.', false, 'Tam tersi: kırılganlık zarar görme ihtimalini artıran özellikler.'),
      sikli('Hazırlıklı şehirde deprem için hangisi düşer?', ['Risk', 'Tehlike'], 0, 'Tehlike aynı, beklenen kayıp düşük.'),
      sikli('Toplumun kendi imkânıyla baş edemediği olay?', ['Afet', 'Tehlike'], 0, 'Can ve mal kaybı.'),
      soru('Aynı olay yapı kalitesi düşük yerlerde daha büyük kayıp verir.', true, 'Kırılganlık.'),
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
        'Afetler kaynağına göre gruplanır; son grubun kaynağı doğrudan insandır.',
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
        'Deprem, volkanik patlama, heyelan ve tsunami. Kaynağı yer kabuğunun hareketidir.',
      ),
      kart(
        'Meteorolojik afetler',
        'Sel, kuraklık, fırtına, dolu, çığ ve aşırı sıcaklar.',
      ),
      kart(
        'Biyolojik afetler',
        'Salgın hastalıklar, orman yangınları ve zararlı böcek istilaları.',
      ),
      kart(
        'Beşerî afetler',
        'Endüstriyel kazalar, nükleer sızıntılar ve savaşlar; kaynağı insandır.',
      ),
      kart(
        'Zincirleme afet',
        'Bir afet ötekini tetikler: deprem heyelanı, heyelan taşkını, taşkın salgını doğurabilir.',
        undefined,
        { not: 'Afeti tek başına düşünme; sonrasında neyi tetiklediğini de sor.' },
      ),
      kart(
        'Türkiye’de en sık',
        'Deprem, heyelan ve sel. Ülkenin büyük bölümü etkin fay kuşakları üzerindedir.',
      ),
    ], [
      soru('Deprem ve heyelan jeolojik afetler arasında yer alır.', true, 'Kaynağı yer kabuğundaki hareketler.'),
      soru('Kuraklık ve sel meteorolojik afetlerdendir.', true, 'İkisinin de kaynağı atmosfer olayları.'),
      soru('Salgın hastalıklar beşerî afet sayılır.', false, 'Biyolojik afet grubunda yer alıyor.'),
      soru('Bir afet başka bir afeti tetikleyemez.', false, 'Deprem sonrası çıkan yangın ve tsunami zincirleme afete örnek.'),
      sikli('Tsunami hangi gruptadır?', ['Jeolojik', 'Meteorolojik'], 0, 'Yer kabuğu hareketi.'),
      sikli('Orman yangını hangi gruptadır?', ['Biyolojik', 'Beşerî'], 0, 'Salgın ve böcek istilası da.'),
      sikli('Depremin heyelanı tetiklemesine ne denir?', ['Zincirleme afet', 'Beşerî afet'], 0, 'Heyelan taşkını doğurabilir.'),
      soru('Türkiye\'de en sık görülen afetler deprem, heyelan ve seldir.', true, 'Etkin fay kuşakları.'),
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
        'Dört aşama',
        'Döngü hiç kapanmaz: iyileştirme, bir sonraki afet için zarar azaltmaya bağlanır.',
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
        'En ucuz ve en etkili aşama: doğru yer seçimi, sağlam yapı, imar denetimi.',
      ),
      kart(
        'Hazırlık',
        'Tatbikat, afet çantası, toplanma alanı ve erken uyarı sistemleri.',
      ),
      kart(
        'Müdahale',
        'İlk 72 saat kritiktir. Arama-kurtarma, sağlık hizmeti ve acil barınma bu aşamada yürütülür.',
      ),
      kart(
        'İyileştirme',
        'Kalıcı konut, altyapı onarımı, ekonomik destek ve psikososyal destek. En uzun süren aşamadır.',
      ),
      kart(
        'Neden bütüncül?',
        'Yalnızca müdahaleye odaklanan yönetim, her afette baştan başlar. Asıl kazanç afet olmadan alınır.',
        undefined,
        { not: 'Aşamaları sırayla ezberleme; döngünün neden kapanmadığını anla.' },
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
      soru('Afet yönetimi döngüsü müdahaleyle biter.', false, 'İyileştirme zarar azaltmaya bağlanır.'),
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
        'Bölge nedir?',
        'Belirli bir ölçüte göre benzer özellik gösteren, çevresinden ayrılan alan.',
      ),
      kart(
        'Ölçüt bölgeyi değiştirir',
        'Aynı yer, iklime göre başka bir bölgede, sanayiye göre başka bir bölgede yer alabilir.',
        undefined,
        { not: 'Bölge yerin özelliği değil, seçtiğin ölçütün sonucu.' },
      ),
      kart(
        'Sınırlar keskin değildir',
        'Doğal bölgelerin sınırı bir çizgi değil geçiş kuşağıdır; idari sınırlar ise keskin ve yapaydır.',
      ),
      kart(
        'Bölge türleri',
        'Doğal, beşerî ve ekonomik bölgeler; ayrıca büyüklüğüne göre kıta altı, ülke ve yerel ölçekler.',
      ),
      kart(
        'Bölge sınırı değişir',
        'Ölçüt değişmese bile koşullar değişirse sınır kayar: kuraklık, tarım bölgesinin sınırını geriye çeker.',
      ),
      kart(
        'Türkiye’nin coğrafi bölgeleri',
        'Yedi bölge 1941’de belirlendi ve ölçütü büyük ölçüde doğal koşullardı; idari birim değildir.',
      ),
    ], [
      soru('Bölge sınırları, seçilen ölçüte göre değişir.', true, 'İklime göre çizilen bölge ile tarıma göre çizilen bölge aynı olmuyor.'),
      soru('Türkiye nin coğrafi bölgeleri il sınırlarıyla birebir örtüşür.', false, 'Bazı iller iki bölgeye birden dağılıyor.'),
      soru('Bölge sınırları keskin çizgiler değildir; geçiş alanları vardır.', true, 'Doğadaki değişim kademeli olduğu için sınır bir kuşak hâlinde.'),
      soru('Bir yer aynı anda birden çok bölgenin içinde yer alamaz.', false, 'Farklı ölçütlerle çizilen bölgeler üst üste binebilir.'),
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
