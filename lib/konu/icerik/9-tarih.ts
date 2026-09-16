import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 9. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema: Geçmişin İnşa Sürecinde Tarih, Eski Çağ Medeniyetleri, Orta Çağ
 * Medeniyetleri. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Program konuları **medeniyet ekseninde** kuruyor: eski programdaki
 * "Mezopotamya", "Anadolu Medeniyetleri" gibi coğrafya başlıkları yok;
 * yerine yönetim, hukuk, inanç gibi karşılaştırmalı başlıklar var.
 */
export const tarih9 = program('tarih', 9, 'Tarihin doğasından Orta Çağ’a', [
  tema('trh9-t1', 'Geçmişin İnşa Sürecinde Tarih', [
    konu('trh9-fayda', 'Tarih Öğrenmenin Faydaları', [
      kart(
        'Tarih bugünün nereden geldiğini gösterir',
        'Türkiye ile Yunanistan\'ın sınırı neden Meriç\'te? Cevap 1923\'teki Lozan Antlaşması\'nda. Bugünkü sınırlar, kurumlar ve tartışmalar geçmişte kuruldu. Tarih, bugünü anlamak için geriye bakmak demek.',
      ),
      kart(
        'Ortak geçmiş insanları birbirine bağlar',
        'Çanakkale\'yi hiç görmemiş biri bile 18 Mart\'ta aynı şeyi hisseder. Çünkü o hikâyeyi herkes bilir. Ortak geçmiş bilgisi bir toplumu bir arada tutar. Buna aidiyet, yani bir yere ait olma duygusu denir.',
      ),
      kart(
        'Tarih sana kaynağı sorgulamayı öğretir',
        'Savaşı kazanan taraf kendi kitabında kayıplarını küçük gösterir. Tarih okurken üç soru sor: kim yazmış, neden yazmış, neyi atlamış? Bu alışkanlık haber ve reklam okurken de işine yarar.',
      ),
      kart(
        'Geçmişteki insanı kendi çağıyla anla',
        'Orta Çağ\'da hastalanan köylü doktora değil büyücüye giderdi. Ona "cahil" deme; mikrop bilgisi yoktu. Geçmişteki insanı kendi koşullarıyla anlamaya tarihî empati denir. Bugünün ölçüsüyle yargılamak tarih değil.',
      ),
      kart(
        'Tarih aynen tekrarlanmaz, benzer',
        'Roma da Osmanlı da çok genişleyince sınırlarını koruyamadı. Aynı olay değil ama benzer bir örüntü, yani tekrar eden desen. Tarihten ders almak olayı ezberlemek değil, örüntüyü fark etmek.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Geçmiş seçilerek anlatılınca yanıltır',
        'Bir ülke eski haritayı gösterip "burası bizimdi" der. Ama o toprağı kimden aldığını söylemez. İşine geleni seçip gerisini atlamak tarihin kötüye kullanımı. Tarih bilen kişi atlananı fark eder.',
        undefined,
        { not: 'Bir anlatı sana çok net ve tek taraflı geliyorsa dur; neyi atlamış olabilir diye bak.' },
      ),
    ], [
      soru('Tarih, geçmişteki olayların birebir tekrar edeceğini gösterir.', false, 'Olaylar aynen tekrarlanmaz; benzer koşullar benzer sonuçlar üretebilir.'),
      soru('Tarih bilgisi, kişinin ait olduğu topluluğu tanımasına katkı sağlar.', true, 'Ortak geçmiş, kimlik ve aidiyet duygusunun kaynaklarından biri.'),
      soru('Tarihî empati, geçmişteki insanları kendi dönemlerinin koşulları içinde anlamaktır.', true, 'Bugünün ölçüleriyle yargılamak, olayı anlamayı engelliyor.'),
      soru('Tarih hiçbir zaman siyasi amaçlarla kullanılmaz.', false, 'Seçilmiş olaylarla kurulan anlatılar tarihin kötüye kullanımına örnek.'),
      sikli('"Kim yazmış, neden yazmış, neyi atlamış?" soruları neyi öğretir?', ['Kaynağı sorgulamayı', 'Aidiyeti'], 0, 'Eleştirel düşünme; kaynak sorgulama.'),
      sikli('Seçilerek anlatılan geçmişte atlananı fark etmeni sağlayan nedir?', ['Tarih bilgisi', 'Takvim'], 0, 'Kötüye kullanımı fark ettirir.'),
      soru('Tarih birebir tekrarlanır.', false, 'Benzer koşullar benzer sonuç; kalıp değil örüntü.'),
    ], [
      {
        soru: 'Geçmişteki insanı kendi çağının koşullarıyla anlamaya ne denir?',
        siklar: ['Empati', 'Nesnellik'],
        dogru: 0,
        aciklama: {
          dogru: 'Bugünün ölçüleriyle yargılamak tarih değil ahlak dersi olur.',
          yanlis: 'Nesnellik kaynağa sadakat ve yöntem disiplini. Geçmişin insanını kendi koşullarında anlamak empati.',
        },
        kart: 4,
      },
    ]),
    konu('trh9-doga', 'Tarihin Doğası', [
      kart(
        'Tarih geçmişi yer ve zamanla anlatır',
        'Malazgirt Savaşı: 1071\'de, Muş yakınında, Selçuklu ile Bizans arasında. Tarih işte bu: geçmişteki insan topluluklarını yer ve zaman göstererek inceleyen bilim. Sebep ve sonucu da bağlar: neden oldu, ne getirdi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yeri ve zamanı yoksa tarih değildir',
        '"Bir zamanlar bir kral vardı, büyük bir savaş kazandı." Bu tarih değil, masal. Hangi kral, ne zaman, nerede? Tarihî bilginin çerçevesi yer ve zamandır; ikisi olmadan olayı yerine oturtamazsın.',
      ),
      kart(
        'Tarih deney yapamaz, kaynağa bakar',
        'Fizikçi bir deneyi yüz kez tekrar eder. Tarihçi Malazgirt\'i bir daha yaptıramaz; olay bir kez yaşandı ve bitti. Bu yüzden tarih deneye değil kaynağa, yani geçmişten kalan belge ve kalıntılara dayanır.',
        undefined,
        { not: 'Tarihi "deneyi yok, o zaman bilim değil" diye küçümseme; deneyi olmayan bilimin yöntemi kaynaktır.' },
      ),
      kart(
        'Tarihçi tarafsız olmaya çalışır',
        'Aynı savaşı anlatan iki tarihçi düşün; biri Türk, biri Yunan. İkisi de kendi ülkesinin ve çağının insanı. Nesnellik, yani tarafsızlık, "önyargım yok" demek değil. Kaynağa sadık kalmak ve yöntemden şaşmamak demek.',
      ),
      kart(
        'Çağ sınırlarını tarihçiler koydu',
        'Kimse 476\'da "Orta Çağ başladı" diye uyanmadı. Tarihçiler binlerce yılı kolay incelemek için büyük dönüm noktalarından böldü. Çağ, yani bu bölmelerin her biri. Sınırları cetvel gibi düşün, doğa yasası gibi değil.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'İlk Çağ', alt: 'yazı → 375' },
            { ad: 'Orta Çağ', alt: '375 → 1453' },
            { ad: 'Yeni Çağ', alt: '1453 → 1789' },
            { ad: 'Yakın Çağ', alt: '1789 →' },
          ],
        },
      ),
      kart(
        'Yazı, tarih öncesini tarihten ayırır',
        'Göbeklitepe\'yi yapanların adını bilmiyoruz; yazı yoktu. Sümer krallarının adını biliyoruz; tablete yazdılar. Yazının bulunması sınır: öncesi tarih öncesi çağlar, sonrası tarihî çağlar. Öncesi kalıntıyla, sonrası belgeyle incelenir.',
      ),
      kart(
        'Her takvim bir başlangıç seçer',
        'Miladî takvim Hz. İsa\'nın doğumunu başlangıç alır. Hicrî takvim 622\'deki hicreti, yani Hz. Muhammed\'in Mekke\'den Medine\'ye göçünü alır. Miladî takvim güneş yılını (365 gün), Hicrî takvim ay yılını (354 gün) sayar.',
      ),
      kart(
        'Hicrî yılı Miladî\'ye kabaca çevirebilirsin',
        'Ay yılı 11 gün kısa; her 33 yılda bir yıllık fark açılır. Çevirme: Hicrî yıldan 33\'te birini çıkar, 622 ekle. Örnek: Hicrî 1000 → 1000 − 30 + 622 = 1592. Sınav için bu kadarı yeter.',
      ),
    ], [
      soru('Tarihî olaylar laboratuvarda deney yapılarak sınanabilir.', false, 'Olay bir kez yaşandı ve tekrarlanamıyor; tarihçi kaynaklara dayanmak zorunda.'),
      soru('Tarihî bir olay incelenirken yer ve zaman belirtilmek zorundadır.', true, 'Yeri ve zamanı olmayan bir anlatı tarih değil.'),
      soru('Yazının bulunuşu, tarih öncesi çağların sonu kabul edilir.', true, 'Yazılı kaynakla birlikte tarihî çağlar başlıyor.'),
      soru('Tarihçi kaynakları seçerken kendi bakış açısından hiç etkilenmez.', false, 'Nesnellik hedeftir ama hangi kaynağın öne çıkacağı bir seçim.'),
      sikli('Tarih neden deney yapamaz?', ['Olaylar tek seferlik', 'Belge yoktur'], 0, 'Geri döndürülemez; kaynağa dayanır.'),
      sikli('Hicrî takvim neye dayanır?', ['Ay yılına', 'Güneş yılına'], 0, 'Miladî güneş yılı.'),
      sikli('Hicret hangi yıldır?', ['622', '1453'], 0, 'Hicrî takvimin başlangıcı.'),
      sikli('Tarihçinin nesnelliği ne demektir?', ['Kaynağa sadakat ve yöntem', 'Hiç önyargısı olmaması'], 0, 'Tarihçi kendi çağının insanı.'),
      soru('İnsanlar 476\'da Orta Çağ\'ın başladığını hemen fark etti.', false, 'Çağ sınırı tarihçilerin kolaylık için koyduğu ölçü.'),
    ], [
      {
        soru: 'Tarih öncesi ile tarihî çağları ayıran nedir?',
        siklar: ['Ateşin bulunması', 'Yazının bulunması'],
        dogru: 1,
        aciklama: {
          dogru: 'Yazıdan öncesi kalıntıyla, sonrası belgeyle incelenir.',
          yanlis: 'Ateş tarih öncesinin kendi içinde bir dönüm noktası. Çağları ayıran ölçüt yazının bulunması.',
        },
        kart: 6,
      },
    ]),
    konu('trh9-uretim', 'Tarihsel Bilginin Üretim Süreci', [
      kart(
        'Olayın çağından kalan kaynak birinci elden',
        'Kanuni\'nin mührünü taşıyan bir ferman birinci elden kaynak; olayın kendi çağından geliyor. O fermanı anlatan bugünkü tarih kitabı ikinci elden kaynak; olayı sonradan yorumluyor. Kaynak, yani geçmişten bilgi veren her şey.',
      ),
      kart(
        'Kaynak yazılı da olur, yazısız da',
        'Ferman, mektup ve kitabe (taşa kazınmış yazı) yazılı kaynak. Sikke (eski para), sur kalıntısı ve mezar eşyası yazısız kaynak. Yazısız kaynak konuşmaz ama çok şey söyler: sikkedeki isim hangi kralın hüküm sürdüğünü gösterir.',
      ),
      kart(
        'Dış eleştiri: belge gerçek mi',
        'Elinde "Fatih\'in mektubu" diye bir kâğıt var. Önce kâğıda bak: mürekkep, mühür, yazı o çağa uyuyor mu? Buna dış eleştiri denir; belgenin kendisi gerçek mi diye sorar. Sahte belge, içi ne kadar güzel olsa da kaynak değil.',
      ),
      kart(
        'İç eleştiri: içerik doğru mu',
        'Belge gerçek çıktı. Şimdi içine bak: Fatih mektupta "yüz bin askerim var" diyor. Abartmış olabilir mi? Buna iç eleştiri denir; belgenin içindeki bilgi güvenilir mi diye sorar. Gerçek belge de yalan söyleyebilir.',
        undefined,
        { not: 'Sınav ikisini ayrı sorar: "sahte mi" dış eleştiri, "doğru mu" iç eleştiri. Kâğıt dışta, bilgi içte.' },
      ),
      kart(
        'Tarihçi başka bilimlerden yardım alır',
        'Bir sikke buldun; üstündeki yazı eski, para hakkında bir şey bilmiyorsun. Parayı inceleyen bilim nümizmatik, eski yazıyı okuyan paleografya. Tarihin tek başına çözemediği kaynağı bu yardımcı bilimler çözer.',
        {
          tur: 'tablo',
          basliklar: ['Bilim', 'Neyi inceler?', 'Örnek'],
          satirlar: [
            ['Arkeoloji', 'Kalıntı', 'Sur, tapınak'],
            ['Paleografya', 'Eski yazı', 'Osmanlıca ferman'],
            ['Nümizmatik', 'Para', 'Sikke'],
            ['Epigrafya', 'Kitabe', 'Taş yazıt'],
            ['Kronoloji', 'Zaman', 'Olayları sıralama'],
          ],
        },
      ),
      kart(
        'Tarihçi beş adımda bilgi üretir',
        'Önce kaynakları toplarsın (tarama), sonra türüne göre ayırırsın (tasnif). Her birini çözümlersin (tahlil), güvenilir mi diye eleştirirsin (tenkit). Son adımda parçaları birleştirip bir anlatı kurarsın (terkip).',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tarama', alt: 'kaynak toplanır' },
            { ad: 'Tasnif', alt: 'sınıflanır' },
            { ad: 'Tahlil', alt: 'çözümlenir' },
            { ad: 'Tenkit', alt: 'eleştirilir' },
            { ad: 'Terkip', alt: 'birleştirilir' },
          ],
        },
      ),
      kart(
        'Yeni belge bulununca tarih yeniden yazılır',
        'Göbeklitepe kazılmadan önce kitaplar "tapınağı yerleşik toplumlar yaptı" diyordu. Kazı bunu tersine çevirdi. Yeni belge ya da yeni soru çıkınca aynı dönem yeniden yazılır. Tarih bilgisi bitmiş değil, güncellenen bir şey.',
      ),
    ], [
      soru('Olayın yaşandığı dönemden kalan belgelere birinci elden kaynak denir.', true, 'Sonradan yazılanlar ikinci elden kaynak sayılıyor.'),
      soru('Kaynak eleştirisi, belgenin gerçekliğini ve güvenilirliğini sorgular.', true, 'Belge sahte olabilir ya da yazan taraflı olabilir.'),
      soru('Sikkeleri inceleyen yardımcı bilim paleografyadır.', false, 'Sikkeleri nümizmatik inceler; paleografya eski yazıların bilimi.'),
      soru('Bir olay hakkındaki tarih yazımı, yeni belgeler bulunsa da değişmez.', false, 'Yeni kaynak, kurulmuş anlatıyı değiştirebiliyor.'),
      sikli('Kanuni\'nin mührünü taşıyan bir ferman hangi kaynak türüdür?', ['İkinci elden', 'Birinci elden'], 1, 'Onu anlatan kitap ikinci elden.'),
      sikli('Sikke ve mezar eşyası hangi kaynak türüdür?', ['Yazılı', 'Yazısız'], 1, 'Kitabe yazılı.'),
      sikli('Tarihsel bilgi üretiminin son adımı?', ['Tasnif', 'Terkip'], 1, 'Parçalar bütün anlatıya dönüşür.'),
      soru('Aynı dönem yeni belge bulununca yeniden yazılabilir.', true, 'Tarih yazımı değişir.'),
    ], [
      {
        soru: 'Belgenin sahte olup olmadığını sorgulamak hangi eleştiridir?',
        siklar: ['İç eleştiri', 'Dış eleştiri'],
        dogru: 1,
        aciklama: {
          dogru: 'Dış eleştiri belgenin kendisine (kâğıt, mühür, yazı) bakar.',
          yanlis: 'İç eleştiri içeriğin güvenilirliğini sorgular. Belgenin gerçekliği dış eleştirinin konusu.',
        },
        kart: 3,
      },
    ]),
    konu('trh9-dijital', 'Tarih Araştırma ve Yazımında Dijitalleşme', [
      kart(
        'Arşiv belgesine artık evden ulaşırsın',
        'Eskiden bir Osmanlı belgesini görmek için İstanbul\'daki arşive gidip beklerdin. Şimdi Devlet Arşivleri belgeleri tarayıp internete koydu. Sayısallaştırma, yani kâğıdı dijital dosyaya çevirme, aramayı haftalardan dakikalara indirdi.',
      ),
      kart(
        'Bilgisayar tarihçiye harita ve sayı verir',
        'Bir vergi defterindeki bin köyü tek tek okumak yıllar sürer. Bilgisayar hepsini haritaya döker: Coğrafi Bilgi Sistemi (CBS), yani veriyi harita üstünde gösteren yazılım. Büyük veri de nüfus ve ticaret sayılarını hızla çözümler.',
      ),
      kart(
        'Gidemediğin harabeyi ekranda gezersin',
        'Efes\'e gidemiyorsan üç boyutlu taramasında dolaşabilirsin. Müzeler eserleri tarayıp dijital sergi kuruyor. Erişim genişledi; ama ekrandaki kopya eserin yerini tutmaz, boyutunu ve dokusunu tam vermez.',
      ),
      kart(
        'İnternette gördüğün her belge kaynak değil',
        'Sosyal medyada "hiç görülmemiş fotoğraf" diye dolaşan görsellerin bir kısmı montaj. Erişim kolaylaştı, doğrulama zorlaştı. Dijital ortamda kaynak eleştirisi, yani belgenin gerçek ve güvenilir olup olmadığını sorgulamak, daha da gerekli.',
        undefined,
        { not: 'İnternette bir belgeye rastlayınca önce sor: aslı hangi arşivde? Cevap yoksa kaynak sayma.' },
      ),
      kart(
        'Yapay zekâ okur ama tarihçi doğrular',
        'Yapay zekâ yıpranmış bir Osmanlıca el yazmasını dakikalar içinde okuyabiliyor; bu büyük kolaylık. Ama aynı program olmayan bir belgeyi de uydurabilir. Ürettiği metin gerçek bir kaynakla doğrulanmadan tarihsel bilgi sayılmaz.',
      ),
      kart(
        'Kâğıt yüzyıl dayanır, dosya on yıl',
        'Bin yıllık bir Sümer tableti hâlâ okunuyor. 1990\'da diskete kaydedilmiş dosyayı bugün açacak bilgisayar bulmak zor. Dosya biçimleri eskiyor, diskler bozuluyor, siteler kapanıyor. Dijital bilgi bakım ister; yoksa kaybolur.',
      ),
    ], [
      soru('Dijitalleşme, arşiv belgelerine uzaktan erişimi kolaylaştırmıştır.', true, 'Başka ülkedeki bir arşiv artık ekrandan taranabiliyor.'),
      soru('İnternette bulunan her tarihî görsel ve belge doğrudur.', false, 'Kaynağı belirsiz ya da üretilmiş içerikler de dolaşımda; doğrulama şart.'),
      soru('Dijital ortamdaki veriler hiçbir zaman kaybolmaz.', false, 'Kapanan siteler ve eskiyen dosya biçimleri yüzünden dijital kayıp gerçek bir sorun.'),
      soru('Dijital sergiler, müzeye gidemeyenlerin esere ulaşmasını sağlar.', true, 'Erişimi genişletiyor ama eserin kendisinin yerini tutmuyor.'),
      sikli('Kâğıt ile dijital dosyayı kalıcılıkta ayıran nedir?', ['Dosya biçimleri okunamaz hâle gelebilir', 'Kâğıt çabuk çürür'], 0, 'Kâğıt yüzyıllar dayanır.'),
      sikli('Coğrafi bilgi sistemleri tarihçiye ne verir?', ['Haritalama', 'Doğrulama'], 0, 'Ticaret ve nüfus analizi de büyük veriyle.'),
      soru('İnternetteki her metin tarihsel kaynak sayılır.', false, 'Kaynak eleştirisi dijitalde daha gerekli.'),
    ], [
      {
        soru: 'Yapay zekânın ürettiği bir metin ne zaman tarihsel bilgi sayılır?',
        siklar: ['Kaynakla doğrulandığında', 'Yeterince ayrıntılıysa'],
        dogru: 0,
        aciklama: {
          dogru: 'Dijital ortam kaynak eleştirisini kaldırmıyor, daha da gerekli kılıyor.',
          yanlis: 'Ayrıntı doğruluğun ölçüsü değil. Üretilen metin kaynağa dayanıp doğrulanmadan tarihsel bilgi olmaz.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('trh9-t2', 'Eski Çağ Medeniyetleri', [
    konu('trh9-tarim', 'Tarım Devrimi’nin Yerleşmeye ve Ekonomiye Etkisi', [
      kart(
        'İnsan 12 bin yıl önce üretmeye başladı',
        'Ondan önce insan yiyeceğini toplar ve avlardı; bulduğu kadarını yerdi. Yaklaşık 12 bin yıl önce buğdayı ekmeyi, koyunu beslemeyi öğrendi. Bitki ve hayvanı evcilleştirmeye, toplayıcılıktan üretime geçmeye Tarım Devrimi denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Tarla insanı bir yere bağladı',
        'Ektiğin buğdayı sulaman, koruman ve biçmen gerekir; başında durmalısın. Bu yüzden tarımla insan göçmeyi bıraktı, yerleşti. Tarlanın yanında köy, köylerin büyümesiyle şehir doğdu. Yerleşik hayat tarımın ilk sonucu.',
      ),
      kart(
        'Fazla ürün başka meslekleri doğurdu',
        'Bir köy yediğinden fazla buğday üretince ambar doldu. Buna artı ürün, yani ihtiyaçtan fazla üretim denir. Herkesin tarlada çalışması gerekmeyince çömlekçi, asker ve rahip çıktı; onları tarlada çalışanlar besledi.',
      ),
      kart(
        'Sonuçlar zincir gibi birbirinden çıkar',
        'Tarım yerleşmeyi, yerleşme artı ürünü, artı ürün iş bölümünü, yani işlerin meslekler arasında paylaşılmasını getirdi. Meslekler çoğalınca düzen kuracak şehir ve devlet doğdu. Her halka bir öncekinden çıkıyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tarım' },
            { ad: 'Yerleşik hayat' },
            { ad: 'Artı ürün' },
            { ad: 'İş bölümü' },
            { ad: 'Şehir ve devlet' },
          ],
        },
        { not: 'Sonuçları liste gibi değil zincir gibi oku; sınav "hangisi hangisinden sonra" diye sorar.' },
      ),
      kart(
        'Ambar dolunca "kimin" sorusu çıktı',
        'Ambarda 100 çuval buğday var. Kimin? Tarlayı kim ekti, kime kalacak? Mülkiyet, yani bir şeyin birine ait olması, bu soruyla doğdu. Çok toprağı olan güçlendi, olmayan onun yanında çalıştı: eşitsizlik böyle başladı.',
      ),
      kart(
        'Yazı ambar kaydı tutmak için bulundu',
        'Sümer tapınağına yüz köylü buğday getiriyor; kim ne kadar verdi? Rahip aklında tutamaz, kile işaret koyar. İlk yazı böyle doğdu. İlk tabletler şiir ya da destan değil, "falanca 5 çuval verdi" türü muhasebe kaydı.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Göbeklitepe ve Çatalhöyük Anadolu\'da',
        'Şanlıurfa\'daki Göbeklitepe 12 bin yıllık tapınak; tarımın tam eşiğinde yapıldı. Konya\'daki Çatalhöyük 9 bin yıllık, tarım yapan büyük bir köy. İkisi de tarıma geçişin dünyadaki en önemli merkezlerinden.',
      ),
    ], [
      soru(
        'Şemaya göre yazı, artı ürün ortaya çıkmadan önce bulunmuştur.',
        false,
        'Sıra tersine: artı ürün kayıt tutmayı gerektirdi ve yazı bu ihtiyaçtan doğdu.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Tarım' },
            { ad: 'Yerleşik hayat' },
            { ad: 'Artı ürün' },
            { ad: 'Yazı' },
          ],
        },
      ),
      soru('Tarım devrimiyle insanlar avcı-toplayıcı yaşamdan yerleşik yaşama geçti.', true, 'Ekilen toprağın başında kalmak gerekiyordu.'),
      soru('Artı ürün, ticaretin ve meslek çeşitliliğinin ortaya çıkmasını sağladı.', true, 'Herkesin besin üretmesi gerekmeyince başka işler doğdu.'),
      soru('Tarıma geçişle birlikte özel mülkiyet kavramı ortadan kalktı.', false, 'Toprak ve ürün üzerindeki mülkiyet tam da bu dönemde doğdu.'),
      sikli('İhtiyaçtan fazla üretime ne denir?', ['Mülkiyet', 'Artı ürün'], 1, 'Zanaatkâr, asker ve rahip sınıfını mümkün kıldı.'),
      sikli('Toplumsal eşitsizlik hangi kökten çıktı?', ['Yazı', 'Mülkiyet'], 1, '"Kimin" sorusu.'),
      sikli('Göbeklitepe ve Çatalhöyük neyin merkezidir?', ['Roma dönemi', 'Tarıma geçiş dönemi'], 1, 'Anadolu\'dan izler.'),
      soru('Tarım devrimi yaklaşık 12 bin yıl önce başladı.', true, 'Bitki ve hayvan evcilleştirildi.'),
    ], [
      {
        soru: 'Yazının doğmasına yol açan ihtiyaç neydi?',
        siklar: ['Artı ürünün kaydını tutmak', 'Destan yazmak'],
        dogru: 0,
        aciklama: {
          dogru: 'İlk tabletler muhasebe kaydı; edebiyat çok sonra geldi.',
          yanlis: 'Destanlar sözlüydü. Yazıyı doğuran şey depolanan ürünün ve vergilerin kaydını tutma ihtiyacı.',
        },
        kart: 6,
      },
    ]),
    konu('trh9-yonetim', 'Eski Çağ Medeniyetlerinde Yönetim ve Ordu', [
      kart(
        'Toprak büyüdükçe yönetim merkeze toplandı',
        'Sümer\'de her şehir kendi kralıyla ayrı bir devletti; buna site devleti denir. Mısır\'da Nil boyunca tek kral vardı: krallık. Persler onlarca halkı tek merkezden yönetti: imparatorluk. Toprak büyüdükçe karar tek merkezde toplandı.',
      ),
      kart(
        'Mısır\'da kral aynı zamanda tanrıydı',
        'Mısırlı köylü firavuna vergi verirken bir tanrıya sunu yaptığını düşünürdü. Firavun tanrı-kral sayılırdı. Yöneticinin gücünü tanrıdan aldığı, din ile devletin ayrılmadığı yönetime teokratik yönetim denir. Eski Çağ\'da yaygındı.',
      ),
      kart(
        'Demiri işleyen savaşı kazandı',
        'Tunç kılıç demir kılıca çarpınca bükülür. Demiri ilk işleyen Hititler bu yüzden öne çıktı. Savaş arabası ve at da hız getirdi. Eski Çağ\'da orduların gücünü silah teknolojisi belirledi.',
      ),
      kart(
        'Atina\'da yurttaşlar kendileri karar verdi',
        'Atina\'da "savaşa girelim mi" sorusunu meydanda toplanan yurttaşlar el kaldırıp oyladı. Buna doğrudan demokrasi denir; aracı yok. Ama yurttaş sayılan yalnızca özgür erkeklerdi. Kadınlar, köleler ve yabancılar oy kullanamazdı.',
        undefined,
        { not: '"Demokrasi" kelimesini bugünkü anlamıyla okuma; sınav kimin dışarıda kaldığını sorar.' },
      ),
      kart(
        'Sparta çocuğu asker olsun diye yetiştirdi',
        'Spartalı erkek çocuk yedi yaşında ailesinden alınıp asker kampına gönderilirdi. Bütün eğitim savaşçı yetiştirmeye ayarlıydı. Yönetim iki kral ve dar bir yaşlılar kurulunun elindeydi; halk karar vermezdi.',
      ),
      kart(
        'Roma üç yönetim biçimi denedi',
        'Roma önce krallıktı. Sonra kralı kovup cumhuriyet kurdu: seçilmiş iki konsül ve Senato, yani soylulardan oluşan danışma meclisi yönetti. En sonunda tek adam yönetimine, imparatorluğa geçti. Senato o zaman bile kaldı.',
      ),
      kart(
        'Ordu ambardan beslenir',
        'On bin askeri düşün; hiçbiri tarlada çalışmıyor ama her gün yemek yiyor. Onları köylünün artı ürünü, yani vergi besler. Vergi düzeni bozulan devletin ordusu kısa sürede dağılırdı. Sürekli ordu ancak düzenli vergiyle yaşar.',
      ),
    ], [
      soru('Teokratik yönetimde siyasi güç dinî inanışa dayandırılır.', true, 'Yönetenin yetkisi tanrısal bir kaynaktan geliyor sayılıyordu.'),
      soru('Atina daki doğrudan demokraside kadınlar ve köleler de oy kullanırdı.', false, 'Yalnızca yurttaş sayılan özgür erkekler katılabiliyordu.'),
      soru('Sparta askerî temele dayanan bir toplum ve yönetim düzeni kurmuştur.', true, 'Eğitim de yönetim de asker yetiştirmeye göre kurulmuştu.'),
      soru('Roma tarihi boyunca yalnızca cumhuriyetle yönetilmiştir.', false, 'Krallık, cumhuriyet ve imparatorluk dönemlerinden geçti.'),
      sikli('Firavunun tanrı-kral sayıldığı yönetim?', ['Demokratik', 'Teokratik'], 1, 'Din ile devlet ayrılmaz.'),
      sikli('Demiri işleyerek öne çıkan uygarlık?', ['Mısırlılar', 'Hititler'], 1, 'Savaş teknolojisi güç dengesini belirledi.'),
      sikli('Eğitimi savaşçı yetiştirmeye ayarlı şehir?', ['Atina', 'Sparta'], 1, 'Yönetim dar bir grupta.'),
      soru('Roma krallıktan cumhuriyete, sonra imparatorluğa geçti.', true, 'Senato kalıcı bir gelenek bıraktı.'),
    ], [
      {
        soru: 'Atina demokrasisinde kimler yurttaş sayılmıyordu?',
        siklar: ['Kadınlar, köleler ve yabancılar', 'Toprak sahipleri'],
        dogru: 0,
        aciklama: {
          dogru: 'Doğrudan demokrasi vardı ama katılım dar bir gruba açıktı.',
          yanlis: 'Toprak sahipleri tam da yurttaş olanlar. Dışarıda kalanlar kadınlar, köleler ve yabancılardı.',
        },
        kart: 4,
      },
    ]),
    konu('trh9-hukuk', 'Eski Çağ Medeniyetlerinde Hukuk', [
      kart(
        'İlk yazılı yasa güçlüyü sınırlamak için',
        'Sümer şehri Lagaş\'ta memurlar köylünün eşeğine el koyuyordu. Kral Urgakina bunu yasaklayan kuralları yazdırdı. Bilinen ilk yazılı yasalar böyle çıktı. Amaç güçlünün zayıfı ezmesine sınır koymaktı.',
      ),
      kart(
        'Hammurabi göze göz cezasını yazdırdı',
        'Babil Kralı Hammurabi\'nin yasasında şöyle yazar: "Biri birinin gözünü çıkarırsa onun da gözü çıkarılır." Buna kısas, yani suça aynısıyla karşılık denir. Sert ama yazılı: kral canı istediği cezayı veremezdi.',
      ),
      kart(
        'Hititler ceza yerine tazminat istedi',
        'Aynı suç Hitit ülkesinde başka biterdi: gözü çıkaran kişi gümüş öderdi. Buna tazminat, yani zararı para ya da malla ödeme denir. Hitit cezaları daha yumuşaktı; kadınların hakları da o çağın ötesindeydi.',
      ),
      kart(
        'İki ceza anlayışı yan yana yaşadı',
        'Kısas ile tazminat aynı çağda, komşu ülkelerde yan yana yaşadı. Bugünkü hukukta da ikisinin izi var: ceza davası ve tazminat davası. Sınav "hangisi hangi uygarlıkta" diye sorar; tabloyu aklında tut.',
        {
          tur: 'tablo',
          basliklar: ['Anlayış', 'Uygarlık', 'Örnek'],
          satirlar: [
            ['Kısas', 'Babil', 'Göze göz'],
            ['Tazminat', 'Hitit', 'Gümüş ödeme'],
          ],
        },
      ),
      kart(
        'Avrupa hukukunun kökü Roma\'da',
        'Roma\'da halk "yasalar sözlü, yalnız soylular biliyor" diye ayaklandı. Yasalar on iki tunç levhaya yazılıp meydana asıldı: On İki Levha Kanunları. Roma hukuku buradan gelişti. Bugünkü Avrupa hukuk sistemlerinin temeli o.',
      ),
      kart(
        'Yazılı yasa keyfî cezayı bitirir',
        'Yasa yazılı değilse ceza kralın o günkü keyfine kalır. Yazılıysa herkes önceden bilir: şunu yapan şu cezayı alır. İçerikleri ne kadar farklı olsa da Urgakina, Hammurabi ve Roma\'nın ortak yönü bu.',
        undefined,
        { not: 'Yasaların içeriği uygarlıktan uygarlığa değişiyor; yazılı olmanın anlamı hiç değişmiyor.' },
      ),
    ], [
      soru('Bilinen ilk yazılı kanunlar Mezopotamya da ortaya çıkmıştır.', true, 'Urgakina kanunları bilinen en eski örneklerden.'),
      soru('Hammurabi kanunları kısasa kısas anlayışını benimsemiştir.', true, 'Ceza, işlenen suçun aynısıyla karşılık buluyordu.'),
      soru('Hitit kanunları, Hammurabi kanunlarına göre daha ağır cezalar içerir.', false, 'Hitit hukuku daha çok tazminat esaslı, yani daha yumuşak.'),
      soru('Roma hukuku günümüz hukuk sistemlerini etkilememiştir.', false, 'Avrupa hukukunun temel kavramlarının çoğu oradan geliyor.'),
      sikli('Kısasa dayalı sert yasalar hangisinde?', ['Hammurabi', 'Hitit'], 0, 'Hitit cezaları tazminat ağırlıklı.'),
      sikli('Avrupa hukukunun temelinde hangi hukuk vardır?', ['Roma', 'Sümer'], 0, 'On İki Levha ile başladı.'),
      soru('Yazılı yasa hukuku hükümdarın ağzından çıkarıp herkesin bilebileceği ölçüye çevirdi.', true, 'Ortak yön: keyfî ceza biter.'),
    ], [
      {
        soru: 'Bilinen ilk yazılı yasalar hangi uygarlıkta çıktı?',
        siklar: ['Romalılar', 'Sümerler'],
        dogru: 1,
        aciklama: {
          dogru: 'Urgakina kanunları; Hammurabi ve Roma sonra geldi.',
          yanlis: 'Roma hukuku On İki Levha ile çok sonra başladı. İlk yazılı yasalar Sümerlerde Urgakina kanunları.',
        },
        kart: 1,
      },
    ]),
    konu('trh9-inanc', 'Eski Çağ’da İnançlar, Bilim ve Sanat', [
      kart(
        'Doğa olayı tanrıyla açıklanıyordu',
        'Mezopotamyalı çiftçi kuraklık olunca "fırtına tanrısı kızdı" derdi. Yağmur, güneş, nehir: her birinin bir tanrısı vardı. Buna çok tanrılı inanç denir. Tapınak yalnız ibadet yeri değildi; tahıl ambarı ve vergi dairesi de oradaydı.',
      ),
      kart(
        'Tek tanrı fikri az yerde tutundu',
        'Mısır firavunu Akhenaton bütün tanrıları kaldırıp yalnız güneşe tapılmasını istedi; ölünce eski düzen geri geldi. Museviler ise tek tanrı inancını kalıcı kıldı. Musevilik bu çağda doğan tek tanrılı din.',
      ),
      kart(
        'Öbür dünya inancı piramidi yaptırdı',
        'Mısırlılar ölümden sonra yaşamın süreceğine inanırdı. Bedenin bozulmaması için mumyaladılar, yani kuruttular. Firavuna öbür dünyada ev olsun diye piramit diktiler. Bir inanç, koca bir mimariyi doğurdu.',
      ),
      kart(
        'Bilim ihtiyaçtan doğdu',
        'Babilliler ekim zamanını bilmek için gökyüzünü izledi; astronomi ve matematik ilerledi. Mısırlılar Nil\'in taşma tarihini bilmek için takvim yaptı. Kimse merak için başlamadı; önce ihtiyaç, sonra bilgi geldi.',
      ),
      kart(
        'Nil taşınca sınır silindi, geometri doğdu',
        'Nil her yıl taşar, tarlaların sınır taşlarını çamura gömerdi. Su çekilince "benim tarlam nerede bitiyor" kavgası başlardı. Memurlar araziyi iple yeniden ölçtü. Geometri, yani ölçme bilgisi, Mısır\'da bu yüzden gelişti.',
        undefined,
        { not: 'Bilimi "kim buldu" diye değil "hangi ihtiyaçtan doğdu" diye oku; sınav sebebi sorar.' },
      ),
      kart(
        'Yunanlılar olayı tanrısız açıkladı',
        'Thales "depremi Poseidon yapar" demedi; "dünya suyun üstünde yüzüyor, sallanıyor" dedi. Yanlış ama tanrısız, akılla kurulmuş bir açıklama. Felsefe, yani olayları akılla açıklama çabası, Yunan dünyasında böyle başladı.',
      ),
      kart(
        'Anıt yapı hem inancı hem gücü gösterir',
        'Piramit, zigurat (Mezopotamya\'nın basamaklı tapınağı), Yunan tapınağı. Hepsi tanrı için yapıldı; ama kilometrelerce öteden görünen yapı krala da "bak ne güçlüyüm" dedirtir. Eski Çağ sanatı inançla gücün ortak diliydi.',
      ),
    ], [
      soru('Mısır da geometrinin gelişmesinde Nil taşkınlarından sonra tarla sınırlarının yeniden ölçülmesi etkili olmuştur.', true, 'İhtiyaç, bilgiyi doğuran sebeplerden biri.'),
      soru('Eski Çağ da bütün toplumlar tek tanrılı inanca sahipti.', false, 'Çok tanrılı inançlar yaygındı; tek tanrılı inanışlar daha sınırlı topluluklardaydı.'),
      soru('Ölümden sonraki yaşam inancı Mısır da mumyalama geleneğine yol açmıştır.', true, 'Bedenin korunması, sonraki yaşam için gerekli görülüyordu.'),
      soru('Eski Çağ da bilim ile din birbirinden tümüyle ayrılmıştı.', false, 'Gök gözlemleri ve takvim gibi bilgiler çoğu zaman tapınakların işiydi.'),
      sikli('Mumyalamayı ve anıt mezarları doğuran inanç?', ['Çok tanrıcılık', 'Öbür dünya inancı'], 1, 'İnanç mimariyi biçimlendirdi.'),
      sikli('Olayları tanrılarla değil akılla açıklama nerede başladı?', ['Mısır\'da', 'Yunan dünyasında'], 1, 'Felsefe.'),
      sikli('Astronomi ve matematikte ilerleyen uygarlık?', ['Hititler', 'Babilliler'], 1, 'Mısırlılar geometri ve takvim.'),
      soru('Tapınaklar yalnızca ibadet yeriydi.', false, 'Tahıl ambarı ve vergi dairesi de oradaydı.'),
    ], [
      {
        soru: 'Geometrinin Mısır\'da gelişmesinin sebebi?',
        siklar: ['Nil taşkınları tarla sınırlarını siliyordu', 'Piramit yapmak isteniyordu'],
        dogru: 0,
        aciklama: {
          dogru: 'Her yıl arazi yeniden ölçülmek zorundaydı; ihtiyaç bilimi doğurdu.',
          yanlis: 'Piramit sonuç, sebep değil. Nil her yıl sınırları silince arazi ölçme zorunluluğu geometriyi geliştirdi.',
        },
        kart: 5,
      },
    ]),
    konu('trh9-konargocer', 'Türklerde Konargöçer Yaşam', [
      kart(
        'Konargöçer başıboş değil, plana göre göçer',
        'Yazın sürüyü serin yaylaya çıkarırsın, kışın sıcak ovaya inersin. Her yıl aynı iki yer, aynı mevsimde. Konargöçerlik bu: yaylak ile kışlak arasında düzenli göç. Başıboş dolaşmak değil, takvimi belli bir yaşam.',
        undefined,
        { not: '"Göçebe" kelimesi seni yanıltmasın: sınavda "düzensiz" diyen şık yanlış, "planlı" diyen doğru.' },
      ),
      kart(
        'Bozkırda tarla olmaz, sürü olur',
        'Orta Asya bozkırı: az yağmur, sert kış, uçsuz ot. Buğday ekemezsin ama koyun ve at besleyebilirsin. Sürü otu bitirince yeni otlak gerekir. Türkler tarımı bilmediği için değil, toprak elvermediği için göçtü.',
      ),
      kart(
        'Aile birleşe birleşe devlet olur',
        'Oguş, yani aile en küçük halka. Aileler birleşir urug (sülale) olur, uruglar boy, boylar budun (millet), budunlar il, yani devlet. Halkalar iç içe: devlet aslında büyümüş bir aile gibi düşünülür.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'İl (devlet)' },
            { ad: 'Budun (millet)' },
            { ad: 'Boy' },
            { ad: 'Urug' },
            { ad: 'Oguş (aile)' },
          ],
        },
      ),
      kart(
        'Herkes hem çoban hem asker',
        'Konargöçer çocuk yürümeden ata biner, ok atmayı sürü güderken öğrenir. Savaş çıkınca ayrı bir ordu toplanmaz; halk zaten ordudur. Buna ordu-millet denir. At ve demir işçiliği bu orduya hız ve silah verdi.',
      ),
      kart(
        'Yönetme hakkı Tanrı\'dan gelirdi: kut',
        'Kağan "beni Tanrı seçti" derdi; halk da öyle inanırdı. Bu yönetme yetkisine kut denir. Kut hanedanın kanında sayıldı; kağanın bütün oğulları hak iddia edebildi. Bu yüzden Türk devletlerinde taht kavgası sıktı.',
      ),
      kart(
        'Sanat da göçe uyar: taşınabilir olur',
        'Yaylaya giderken taş saray taşıyamazsın; halı, at koşumu ve madenî kemer tokası taşırsın. Konargöçer sanatı bu yüzden küçük ve taşınabilir. Anıtsal mimari yerine sözlü kültür gelişti: destanlar ezbere saklandı.',
      ),
      kart(
        'Bozkır ile tarım ülkesi alışveriş yaptı',
        'Bozkır atı ve koyunu verdi, Çin buğdayı ve ipeği verdi. İki taraf da ötekinin ürününe muhtaçtı. Savaş yalnızca bir yüzü; çoğu zaman sınırda pazar kuruldu. Konargöçerle yerleşik birbirini besledi.',
      ),
    ], [
      soru('Konargöçer yaşamda temel geçim kaynağı hayvancılıktır.', true, 'Sürünün otlak ihtiyacı yaşam biçimini belirliyordu.'),
      soru('Konargöçerlik, yılın her mevsimini aynı yerde geçirmek demektir.', false, 'Yaylak ve kışlak arasında belirli bir düzenle gidip geliniyor; başıboş bir gezinme değil.'),
      soru('Kut anlayışına göre yönetme yetkisi Tanrı tarafından verilir.', true, 'Yetki hükümdara verilmiş sayılıyor, hanedanın erkek üyelerine geçiyordu.'),
      soru('Konargöçer toplumda ordu ayrı bir meslek grubudur.', false, 'Halkın tamamı gerektiğinde asker; ordu-millet anlayışı buradan geliyor.'),
      sikli('Yönetme yetkisinin Tanrı\'dan geldiği inancı?', ['Kut', 'İkta'], 0, 'Kan yoluyla geçtiği için taht kavgaları sık.'),
      sikli('Konargöçerlerde hangi sanat gelişti?', ['Taşınabilir sanat', 'Anıtsal mimari'], 0, 'Halı, madenî eşya, at koşumu.'),
      sikli('Bozkır ile tarım havzası nasıl ilişkideydi?', ['Birbirini besledi', 'Hiç temas etmedi'], 0, 'At ve hayvan karşılığında tahıl ve kumaş.'),
      soru('Konargöçerlik başıboş dolaşmaktır.', false, 'Yaylak-kışlak arasında planlı göç.'),
    ], [
      {
        soru: 'Türklerde konargöçerlik neden yaygındı?',
        siklar: ['Bozkır tarıma elverişsizdi', 'Tarım bilinmiyordu'],
        dogru: 0,
        aciklama: {
          dogru: 'Hayvancılık otlak takibini zorunlu kıldı; göç planlıydı, başıboş değil.',
          yanlis: 'Tarım biliniyordu ama bozkır iklimi ona elverişli değildi. Hayvancılık yaylak-kışlak göçünü zorunlu kıldı.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('trh9-t3', 'Orta Çağ Medeniyetleri', [
    konu('trh9-goc', 'Orta Çağ’da Yaşanan Kitlesel Göçler', [
      kart(
        'Hunlar itti, Germenler Roma\'ya yığıldı',
        'Hunlar 375\'te Karadeniz\'in kuzeyine geldi. Orada yaşayan Germen kavimleri korkup batıya, Roma sınırına kaçtı. Bir kavmin ötekini itmesiyle Avrupa\'nın haritası değişti. Buna Kavimler Göçü denir.',
      ),
      kart(
        'Göçün dört sebebi var',
        'Kuraklık otlağı kurutur: iklim. Sürü büyüyünce ot yetmez: otlak yetersizliği. Nüfus artınca yer daralır: nüfus baskısı. Komşu saldırır: dış saldırı. Hunlar dördünü de yaşadı; dördü birden bir kavmi yola çıkarır.',
      ),
      kart(
        'Batı Roma yıkıldı, Orta Çağ başladı',
        'Germen kavimleri Roma\'yı içeriden kemirdi; 476\'da Batı Roma yıkıldı. Merkez çökünce toprak sahipleri kendi başına kaldı; feodalite, yani derebeylik düzeni doğdu. Bugünkü Fransa ve Almanya\'nın temelini bu kavimler attı.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Hun baskısı', alt: '375' },
            { ad: 'Germen göçü' },
            { ad: 'Batı Roma yıkıldı', alt: '476' },
            { ad: 'Feodalite' },
          ],
        },
      ),
      kart(
        'Türkler üç yöne yayıldı',
        'Orta Asya\'dan çıkan Türk boyları batıda Anadolu\'ya, güneyde İran\'a, güneydoğuda Hindistan\'a gitti. Gittikleri yerde yönetimi, dili ve orduyu değiştirdiler. Anadolu\'nun bugün Türkçe konuşması bu göçün sonucu.',
      ),
      kart(
        'Göç eden, gittiği yerin dinini alabilir',
        'Türkler İran ve Maveraünnehir\'e, yani Müslüman topraklara gelince İslam\'la tanıştı. Ticaret, evlilik ve devlet ilişkisiyle bir iki yüzyılda çoğunluk Müslüman oldu. Türklerin İslamlaşması göçün bir sonucu.',
      ),
      kart(
        'Göçte iki taraf da değişir',
        'Germenler Roma\'ya kendi dillerini ve savaşçı geleneklerini getirdi; ama Roma\'nın dinini, Hristiyanlığı aldılar. Gelen yerleşiği değiştirir, kendisi de değişir. Kültür alışverişi hep iki yönlü.',
        undefined,
        { not: 'Göç sorularında iki tarafı da düşün; "yalnızca gelen değişti" ya da "yalnızca yerli değişti" diyen şık yanlış.' },
      ),
    ], [
      soru('Kavimler Göçü, Avrupa nın siyasi haritasının değişmesine yol açtı.', true, 'Yeni krallıklar kuruldu, Batı Roma yıkıldı.'),
      soru('Göçlerin sebepleri arasında iklim değişiklikleri ve otlak yetersizliği vardır.', true, 'Nüfus baskısı ve dış saldırılar da göçü tetikleyen sebepler.'),
      soru('Kavimler Göçü sonucunda Roma İmparatorluğu güçlenmiştir.', false, 'Tersine, Batı Roma nın yıkılışında etkili oldu.'),
      soru('Göç eden topluluklar gittikleri yerin kültürünü etkilemez.', false, 'Etkileşim iki yönlü: hem etkilerler hem etkilenirler.'),
      sikli('Kavimler Göçü hangi yılda başladı?', ['375', '1071'], 0, 'Hun baskısı.'),
      sikli('Kavimler Göçü\'nün sonuçlarından biri?', ['Feodalitenin doğuşu', 'Rönesans'], 0, 'Batı Roma yıkıldı, Orta Çağ başladı.'),
      soru('Göçte yalnızca gelen topluluk değişir.', false, 'Kültür alışverişi iki yönlü.'),
    ], [
      {
        soru: 'Kavimler Göçü\'nü başlatan olay nedir?',
        siklar: ['Batı Roma\'nın yıkılması', 'Hunların batıya ilerlemesi'],
        dogru: 1,
        aciklama: {
          dogru: '375\'te Hun baskısı Germen kavimlerini yerinden etti.',
          yanlis: 'Batı Roma\'nın yıkılması göçün sonucu, sebebi değil. Başlatan Hunların batıya ilerlemesi.',
        },
        kart: 1,
      },
    ]),
    konu('trh9-devletler', 'Orta Çağ Devletlerinde Yönetim ve Ordu', [
      kart(
        'Kral zayıflayınca toprak sahibi güçlendi',
        'Batı Roma yıkılınca yolları koruyacak ordu kalmadı. Köylü "beni kim korur" diye toprak sahibine sığındı. Senyör, yani toprak beyi koruma verdi, karşılığında hizmet ve ürün aldı. Bu düzene feodalite denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Toprak aşağı iner, hizmet yukarı çıkar',
        'Kral toprağı soyluya verir, soylu şövalyeye. En altta serf, yani toprağa bağlı köylü, herkes için çalışır. Toprak yukarıdan aşağı dağıtılır; hizmet, asker ve ürün aşağıdan yukarı akar. Kral tepede ama gücü soylulara bağımlı.',
        {
          tur: 'katman',
          daralan: false,
          katmanlar: [
            { ad: 'Kral' },
            { ad: 'Soylular' },
            { ad: 'Şövalyeler' },
            { ad: 'Serfler' },
          ],
        },
      ),
      kart(
        'Bizans Roma\'yı bin yıl daha yaşattı',
        'Batı Roma 476\'da yıkıldı; doğu yarısı Bizans adıyla 1453\'e kadar sürdü. Sırrı düzenli memurlar ve tema sistemi: ülke askerî bölgelere, yani temalara bölündü, askere toprak verildi. Asker hem çiftçi hem savaşçıydı.',
      ),
      kart(
        'Halife hem din hem devlet başkanı',
        'Hz. Muhammed\'in vefatından sonra Müslümanları yöneten kişiye halife denir. Halife hem namaz kıldırır hem ordu gönderir; din ve devlet başkanlığı tek kişide. Günlük işleri divan, yani bakanlar kurulu gibi çalışan meclis yürütür.',
      ),
      kart(
        'Türk-İslam devleti orduyu ikta ile kurdu',
        'Karahanlılar, Gazneliler ve Selçuklular askere hazineden maaş vermek yerine toprak geliri verdi. Buna ikta denir. Toprak devletin kaldı; geliri komutana geçti. Böylece hem ordu beslendi hem toprak boş kalmadı.',
      ),
      kart(
        'İkta: toprak vergisi asker besler',
        'Bir köyün yıllık vergisi 1000 altın olsun. Devlet bunu toplamak yerine komutana bırakır. Komutan 1000 altınla 50 asker besler. Savaşta o 50 askerle gelir. Devlet hazinesinden para çıkmadan ordu kurmuş olur.',
        undefined,
        { not: 'Feodaliteyle farkı: iktada toprak devletin, geliri komutanın; feodalitede toprak soylunun kendi malı.' },
      ),
      kart(
        'Her devletin askeri başka türlü beslendi',
        'Avrupa\'da şövalye kendi toprağının geliriyle at ve zırh alır. Bizans\'ta tema askeri kendi tarlasını eker. İslam dünyasında ikta askerini komutan besler; gulam, yani küçükken alınıp yetiştirilen köle asker ise saraydan beslenir.',
      ),
    ], [
      soru(
        'Feodal düzende toprağı işleyen köylüler piramidin en üstünde yer alır.',
        false,
        'Köylüler en altta; üstte kral ve toprağı ondan alan soylular bulunuyor.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Kral' },
            { ad: 'Soylular' },
            { ad: 'Şövalyeler' },
            { ad: 'Köylüler' },
          ],
        },
      ),
      soru('İkta sisteminde toprağın geliri, karşılığında asker yetiştirmek üzere görevlilere bırakılır.', true, 'Toprağın mülkiyeti devlette kalıyor.'),
      soru('Bizans ta imparator hem siyasi hem dinî otoriteye sahiptir.', true, 'Kilise üzerinde de söz sahibiydi.'),
      soru('Feodalitede kralın merkezî otoritesi güçlüdür.', false, 'Toprak ve askerî güç soyluların elinde; kralın otoritesi zayıftır.'),
      sikli('Feodalitede koruma karşılığında ne verilirdi?', ['Hizmet ve ürün', 'Vergi muafiyeti'], 0, 'Senyör korur, köylü çalışır.'),
      sikli('Bizans\'ın ordu düzeni?', ['Tema sistemi', 'İkta'], 0, 'Askere toprak verildi; hem çiftçi hem savaşçı.'),
      sikli('İslam devletlerinde günlük işleri yürüten kurum?', ['Divan', 'Senato'], 0, 'Halifelik din ve devlet başkanlığını birleştirdi.'),
      soru('Avrupa\'da şövalye, İslam dünyasında gulam askerleri vardı.', true, 'Her devletin askeri başka türlü beslendi.'),
    ], [
      {
        soru: 'İkta sisteminde devlet ne kazanır?',
        siklar: ['Merkezde toplanan vergi', 'Nakit ödemeden ordu'],
        dogru: 1,
        aciklama: {
          dogru: 'Toprağın vergisi komutana bırakılır, o asker besler; hazineden para çıkmaz.',
          yanlis: 'Vergi merkeze gitmez, komutanda kalır. Devletin kazancı hazineden para çıkmadan beslenen ordu.',
        },
        kart: 6,
      },
    ]),
    konu('trh9-ticaret', 'Orta Çağ’daki Ticaret Yolları', [
      kart(
        'İpek Yolu Çin\'i Akdeniz\'e bağladı',
        'Çin\'de dokunan ipek, deve sırtında Orta Asya ve İran üzerinden Akdeniz limanlarına geldi. Bu güzergâha İpek Yolu denir. Yalnız ipek değil; kâğıt, barut ve pusula da bu yolla batıya geçti.',
      ),
      kart(
        'Baharat Yolu Hindistan\'dan başlar',
        'Karabiber ve tarçın Hindistan ile Güneydoğu Asya\'da yetişir. Gemiyle Kızıldeniz\'e, oradan Mısır\'a taşınırdı. Baharat neden bu kadar pahalıydı? Yemeğe tat verir ve buzdolabı yokken eti bozulmaktan korur.',
      ),
      kart(
        'Kürk Yolu kuzeyden iner',
        'Sibirya ormanlarında samur ve tilki avlanır. Kürkler Karadeniz\'in kuzeyinden Doğu Avrupa\'ya, oradan Bizans ve İslam pazarlarına gider. Bu yol soğuk kuzeyin ürününü, kürk ve balı, sıcak güneye taşır.',
      ),
      kart(
        'Üç yolun adı yükünden gelir',
        'Yolun adı en çok taşıdığı maldan gelir ama yalnız onu taşımaz. Tüccar deveye ipeği, kafasına dinini ve fikrini yükler. Budizm Çin\'e, İslam Endonezya\'ya bu yollarla gitti.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Güzergâh', 'Yük'],
          satirlar: [
            ['İpek', 'Çin → Akdeniz', 'İpek, kâğıt'],
            ['Baharat', 'Hindistan → Mısır', 'Karabiber'],
            ['Kürk', 'Sibirya → Avrupa', 'Kürk, bal'],
          ],
        },
      ),
      kart(
        'Yolu tutan devlet zenginleşir',
        'Yoldan geçen her kervan gümrük, yani sınırda alınan vergi öder. Yolu elinde tutan devlet bu parayı toplar ve komşularına söz geçirir. Orta Çağ savaşlarının çoğu toprak için değil, yolun kontrolü için yapıldı.',
        undefined,
        { not: 'Yolların ne taşıdığından çok kimin elinde olduğuna bak; savaş soruları oradan çıkar.' },
      ),
      kart(
        'Selçuklu kervanı korudu ve sigortaladı',
        'Selçuklular yol üstüne bir günlük yürüyüş arayla kervansaray, yani kervanların konakladığı korunaklı han kurdu. Soyulan tüccarın zararını devlet ödedi; bilinen ilk sigorta uygulamalarından. Güvenli yola tüccar gelir.',
      ),
      kart(
        'Yol hastalığı da taşıdı',
        '1347\'de Kırım\'dan kalkan Ceneviz gemileri İtalya\'ya ipekle birlikte veba mikrobunu getirdi. Salgın kervan yollarını izleyerek yayıldı; Avrupa nüfusunun üçte birini öldürdü. Yol ne bulursa taşır: mal, fikir ve hastalık.',
      ),
    ], [
      soru('İpek Yolu, Çin den Avrupa ya uzanan bir ticaret ağıdır.', true, 'Tek bir yol değil, birbirine bağlanan güzergâhlardan oluşuyordu.'),
      soru('Ticaret yolları yalnızca mal taşımış, düşünce ve inançların yayılmasında rol oynamamıştır.', false, 'Kervanlarla birlikte din, teknoloji ve hastalıklar da yayıldı.'),
      soru('Kervansaraylar tüccarların konaklamasını ve güvenliğini sağlardı.', true, 'Yol güvenliği ticaretin sürmesinin şartıydı.'),
      soru('Baharat Yolu, kürk ticareti için kullanılan kuzey güzergâhıdır.', false, 'Kürk Yolu kuzeyde; Baharat Yolu Hindistan ve Güneydoğu Asya ya uzanıyordu.'),
      sikli('Baharatın değerli olmasının sebebi?', ['Lezzet ve koruyuculuk', 'Nadir bulunması'], 0, 'Buzdolabı yokken eti bozulmaktan koruyordu.'),
      sikli('Selçukluların yol güvenliği için kurduğu yapı?', ['Kervansaray', 'Medrese'], 0, 'Sigorta benzeri tazmin de vardı.'),
      sikli('14. yüzyılda ticaret yollarıyla yayılan salgın?', ['Veba', 'Kolera'], 0, 'Avrupa nüfusunun üçte birini öldürdü.'),
      soru('Ticaret yollarını denetleyen devlet gümrük geliri kazanırdı.', true, 'Savaşların sebebi çoğu zaman buydu.'),
    ], [
      {
        soru: 'Kâğıt, barut ve pusula batıya hangi yolla geçti?',
        siklar: ['Kürk Yolu', 'İpek Yolu'],
        dogru: 1,
        aciklama: {
          dogru: 'Çin\'den Akdeniz\'e uzanan yol yalnızca ipek taşımadı.',
          yanlis: 'Kürk Yolu kuzey ormanlarından kürk ve bal taşıdı. Çin buluşları İpek Yolu\'yla batıya geçti.',
        },
        kart: 1,
      },
    ]),
    konu('trh9-medeniyet', 'Orta Çağ’da Bilim, Kültür ve Sanat', [
      kart(
        'Bağdat\'ta Yunan kitapları Arapçaya çevrildi',
        'Abbasi halifesi Bağdat\'ta Beytü\'l-Hikme, yani Bilgelik Evi kurdu. Yunan ve Hint kitapları burada Arapçaya çevrildi. Çeviriyle yetinilmedi, üstüne kondu. Matematik, tıp ve astronomi o yüzyıllarda en çok burada ilerledi.',
      ),
      kart(
        'Dört bilgin Avrupa\'ya ders kitabı yazdı',
        'Bugün "algoritma" dediğin kelime Harezmî\'nin adından geliyor. İbn Sina\'nın tıp kitabı Avrupa üniversitelerinde 600 yıl okutuldu. Bu adlar İslam dünyasının bilim yıldızları; eserleri Latinceye çevrildi.',
        {
          tur: 'tablo',
          basliklar: ['Bilgin', 'Alanı', 'Ne yaptı?'],
          satirlar: [
            ['Harezmî', 'Cebir', 'Bilinmeyeni çözme'],
            ['İbn Sina', 'Tıp', 'El-Kanun kitabı'],
            ['Birunî', 'Astronomi', 'Dünya\'nın çapı'],
            ['İbn Heysem', 'Optik', 'Göz nasıl görür'],
          ],
        },
      ),
      kart(
        'Kâğıt Çin\'den çıktı, Avrupa\'da bitti',
        'Kâğıt Çin\'de bulundu. 751\'de Talas Savaşı\'nda esir düşen Çinli ustalar Semerkant\'ta kâğıt yaptı. Oradan Bağdat\'a, Endülüs\'e, sonra Avrupa\'ya geçti. Deri parşömene göre çok ucuzdu; kitap çoğaldı, bilgi ucuzladı.',
      ),
      kart(
        'Avrupa\'da kitabı keşişler kopyaladı',
        'Batı Roma yıkılınca okullar kapandı. Kitaplar manastırlarda, yani keşişlerin yaşadığı dinî yapılarda saklandı; keşişler elle kopyaladı. İlk üniversiteler ancak 11. yüzyıldan sonra kuruldu: Bologna, Paris, Oxford.',
      ),
      kart(
        'Endülüs ve Sicilya bilgiyi Avrupa\'ya taşıdı',
        'Endülüs, yani İslam yönetimindeki İspanya\'da, Toledo şehrinde Arapça kitaplar Latinceye çevrildi. Sicilya\'da da aynı iş yapıldı. Avrupalı öğrenci Aristo\'yu ve İbn Sina\'yı bu çevirilerden okudu. İki bölge köprü oldu.',
        undefined,
        { not: 'Bilgi kaybolmadı, yer değiştirdi: Yunan → Bağdat → Endülüs → Avrupa. Endülüs\'ü köprü olarak hatırla.' },
      ),
      kart(
        'Nizamiye medresesi düzenli okul demek',
        'Selçuklu veziri Nizamülmülk 1067\'de Bağdat\'ta Nizamiye Medresesi\'ni kurdu; ardından büyük şehirlere birer tane. Medrese, yani İslam dünyasının yüksekokulu. Öğrenciye burs vardı; din bilimleriyle birlikte matematik ve tıp okutuldu.',
      ),
      kart(
        'Orta Çağ sanatı inanç için yapıldı',
        'İslam mimarisi kubbe, kemer ve çiniyle cami yaptı; Selçuklu çinileri Konya\'da hâlâ ayakta. Avrupa önce kalın duvarlı romanesk, sonra sivri kemerli, yüksek gotik katedral yaptı. İki tarafta da sanatın konusu inançtı.',
      ),
    ], [
      soru('Kâğıt üretimi Çin den İslam dünyasına, oradan Avrupa ya yayılmıştır.', true, 'Bilginin çoğaltılması bu yolculukla ucuzladı.'),
      soru('Medreseler Orta Çağ İslam dünyasının eğitim kurumlarıdır.', true, 'Dinî bilimlerin yanında matematik ve tıp da okutuluyordu.'),
      soru('İbn Sina ve Biruni nin eserleri Avrupa da hiç tanınmamıştır.', false, 'Latinceye çevrildiler ve yüzyıllarca ders kitabı olarak okutuldular.'),
      soru('Orta Çağ da bilgi tek bir merkezde üretilmiş, aktarım yaşanmamıştır.', false, 'Çeviri hareketleri ve ticaret yollarıyla bilgi sürekli yer değiştirdi.'),
      sikli('Beytü\'l-Hikme neredeydi?', ['Bağdat', 'Endülüs'], 0, 'Yunan ve Hint eserleri çevrildi.'),
      sikli('Kâğıt Avrupa\'ya hangi yolla ulaştı?', ['Çin → Semerkant → İslam dünyası → Avrupa', 'Doğrudan Çin\'den'], 0, 'Bilgi ucuzladı.'),
      sikli('Nizamiye medreselerini kuran devlet?', ['Selçuklular', 'Bizans'], 0, 'Din ve pozitif bilim okutuluyordu.'),
      soru('Avrupa üniversiteleri 11. yüzyıldan sonra kuruldu.', true, 'Öncesinde bilgi manastırlarda korundu.'),
    ], [
      {
        soru: 'İslam dünyasındaki bilgi Avrupa\'ya hangi köprülerden geçti?',
        siklar: ['Bağdat ve Semerkant', 'Endülüs ve Sicilya'],
        dogru: 1,
        aciklama: {
          dogru: 'İki bölge de Avrupa ile İslam dünyasının fiziksel temas noktasıydı.',
          yanlis: 'Bağdat ve Semerkant üretim ve çeviri merkezleri. Avrupa\'ya aktaran köprüler Endülüs ve Sicilya.',
        },
        kart: 5,
      },
    ]),
  ]),
])
