import { program, tema } from '../tip'
import { onBirinciSinifKonusu, type OnBirinciSinifKonusu } from './11-yardimci'

/**
 * 11. sınıf Türk Dili ve Edebiyatı. MEB bu derste içerik çerçevesini konu
 * listesi yerine becerilerle verir; metin türleri temaların açıklamasındadır.
 */
const taslaklar: OnBirinciSinifKonusu[][] = [
  [
    {
      id: 'trk11-karagoz', ad: 'Karagöz ve Geleneksel Tiyatro',
      kartlar: [
        ['Gölge oyunu', 'Karagöz, tasvirlerin ışıkla perdeye yansıtıldığı geleneksel oyundur.\nGörsel hareket ve söz birlikte işler.'],
        ['İki ana tip', 'Karagöz halkın konuşma diliyle, Hacivat daha süslü dille konuşur.\nYanlış anlamalar mizah yaratır.'],
        ['Oyunun bölümleri', 'Mukaddime, muhavere, fasıl ve bitiş sırayla gelir.\nFasıl asıl olayların işlendiği bölümdür.'],
        ['Yardımcı tipler', 'Çelebi, Tiryaki ve başka tipler farklı toplumsal çevreleri yansıtır.\nTipin sözü kişiliğini tanıtır.'],
        ['Çatışmayı oku', 'Kimin ne istediğini ve yanlış anlamanın nereden çıktığını belirle.\nSöz oyunu olayın yönünü değiştirebilir.'],
        ['Dil ve işlev', 'Günlük söz ile süslü sözün karşılaşması yalnız güldürmez.\nİletişimde ortak anlam kurma ihtiyacını gösterir.'],
      ],
      not: 'Karagöz’de sözü kimin, hangi amaçla söylediğini izle; mizah çoğu kez yanlış anlamadan doğar.',
      iddialar: [
        ['Karagöz bir gölge oyunudur.', true, 'Tasvirler perdeye yansıtılır.'],
        ['Fasıl oyunun kapanış dileklerini içerir.', false, 'Fasıl asıl olayların işlendiği bölümdür.'],
        ['Karagöz ile Hacivat’ın farklı dil kullanımı mizah yaratır.', true, 'Sözler sık sık yanlış anlaşılır.'],
        ['Oyundaki bütün tipler aynı söz varlığını kullanır.', false, 'Tiplerin dili çevre ve kişilik farkı taşır.'],
      ],
      secimler: [
        ['Asıl olayların işlendiği bölüm?', 'Fasıl', 'Mukaddime', 'Fasıl oyunun ana bölümüdür.'],
        ['Daha süslü konuşan ana tip?', 'Hacivat', 'Karagöz', 'Hacivat’ın dili daha ağdalıdır.'],
        ['Karagöz’de mizahı sık doğuran şey?', 'Yanlış anlama', 'Sabit dekor', 'Dil farkı söz oyunlarına yol açar.'],
      ],
      kontrol: ['Karagöz ile Hacivat arasındaki belirgin fark?', 'Dil kullanımı', 'Perdenin rengi', 'Konuşma biçimleri çatışmayı kurar.'], kontrolKarti: 2,
    },
    {
      id: 'trk11-mektup', ad: 'Mektup ve Dilekçe',
      kartlar: [
        ['Mektubun amacı', 'Mektup belirli bir alıcıya haber, duygu veya düşünce iletir.\nAlıcıya göre dil ve içtenlik değişir.'],
        ['Yapı', 'Yer ve tarih, hitap, gövde, kapanış ve imza düzeni kurulabilir.\nAmaç okunurken bu parçaların işlevine bak.'],
        ['Özel ve resmî', 'Özel mektupta kişisel ses öne çıkar.\nResmî yazışmada açık ve ölçülü dil gerekir.'],
        ['Dilekçe', 'Bir kuruma talep veya şikâyet iletmek için yazılır.\nKurum adı, istek, tarih, imza ve iletişim bilgileri önemlidir.'],
        ['Gerekçe yazma', 'Dilekçede isteğin ne olduğu ve neden istendiği açık olmalıdır.\nBelirsiz sözler işlemi zorlaştırır.'],
        ['Metni çözümleme', 'Kimin kime, hangi amaçla yazdığını belirle.\nSöz varlığı ve hitap amaca uyuyor mu diye değerlendir.'],
      ],
      not: 'Mektup ile dilekçeyi alıcı ve amaç ayırır; dilekçede duygudan önce açık talep gerekir.',
      iddialar: [
        ['Mektubun dili alıcıya göre değişebilir.', true, 'Yakın arkadaş ile kurum aynı üslupla yazılmaz.'],
        ['Dilekçede talep belirsiz bırakılmalıdır.', false, 'İstek açıkça yazılmalıdır.'],
        ['Hitap ve imza mektubun yapısında işlev taşır.', true, 'Alıcı ve göndereni belirginleştirir.'],
        ['Özel mektup yalnız resmî kurumlara yazılır.', false, 'Kişisel alıcıya yöneliktir.'],
      ],
      secimler: [
        ['Kuruma talep ileten metin?', 'Dilekçe', 'Masal', 'Dilekçe kuruma başvuru biçimidir.'],
        ['Yakın arkadaşa yazılan mektupta ne öne çıkar?', 'Kişisel ses', 'Resmî kalıp', 'Alıcıyla ilişki üslubu belirler.'],
        ['Dilekçede temel bilgi hangisidir?', 'Açık istek', 'Olay örgüsü', 'Kurum ne istendiğini anlamalıdır.'],
      ],
      kontrol: ['Dilekçede istek nasıl yazılmalı?', 'Açık ve ölçülü', 'Kapalı ve dolaylı', 'Başvuru amacının anlaşılması gerekir.'], kontrolKarti: 4,
    },
    {
      id: 'trk11-eposta', ad: 'E-posta ve İletişim',
      kartlar: [
        ['Alıcı ve amaç', 'E-postayı yazmadan önce kime, neden yazdığını belirle.\nDil bu iki karara göre seçilir.'],
        ['Konu satırı', 'Kısa konu satırı iletinin amacını gösterir.\n“Merhaba” tek başına çoğu iş iletisi için belirsizdir.'],
        ['Gövde düzeni', 'Hitap, kısa bağlam, asıl istek ve kapanış sırası kur.\nUzun paragraf yerine anlaşılır satırlar kullan.'],
        ['İletişim engeli', 'Eksik bağlam, belirsiz sözcük ve uygun olmayan ton yanlış anlamaya yol açar.\nAlıcıdan geri bildirim isteyebilirsin.'],
        ['Düşünceyi geliştirme', 'Gerektiğinde örnek veya gerekçe ekle.\nİlgisiz ayrıntı ana mesajı gizler.'],
        ['Son kontrol', 'Alıcı, ek, tarih ve yazımı gönderimden önce denetle.\nYanlış adrese giden ileti geri alınamayabilir.'],
      ],
      not: 'E-postanın hızı açık anlatımın yerini tutmaz; eksik bağlam hızlı yanlış anlaşılır.',
      iddialar: [
        ['Konu satırı iletinin amacını gösterebilir.', true, 'Alıcı ne bekleyeceğini anlar.'],
        ['İletinin tonu alıcıdan bağımsız seçilir.', false, 'Alıcı ve amaç üslubu etkiler.'],
        ['Göndermeden önce ekleri kontrol etmek yararlıdır.', true, 'Unutulan ek iletiyi eksik bırakır.'],
        ['Belirsiz sözler iletişimi her zaman kolaylaştırır.', false, 'Yanlış anlamaya yol açabilir.'],
      ],
      secimler: [
        ['E-postanın amacını ilk gösteren yer?', 'Konu satırı', 'İmza rengi', 'Konu satırı içeriği özetler.'],
        ['İletişim engeli örneği?', 'Eksik bağlam', 'Açık istek', 'Bağlam eksikse alıcı farklı anlayabilir.'],
        ['Gönderim öncesi ne denetlenir?', 'Alıcı ve ekler', 'Yalnız yazı tipi', 'Yanlış alıcı ve eksik ek sorun yaratır.'],
      ],
      kontrol: ['E-postada üslubu ne belirler?', 'Alıcı ve amaç', 'Ekran boyu', 'İletinin tonu yazılan kişiye ve amaca uyar.'], kontrolKarti: 1,
    },
  ],
  [
    {
      id: 'trk11-turk-dunyasi-hikaye', ad: 'Türk Dünyasından Hikâye',
      kartlar: [
        ['Ortak ve farklı', 'Türk dünyası metinleri ortak kültür izleri taşıyabilir.\nHer yörenin dili ve yaşamı yine de kendine özgüdür.'],
        ['Hikâyenin yapısı', 'Olay, kişi, zaman ve mekânı ayır.\nAnlatıcının olaylara yakınlığını da belirle.'],
        ['Kültürel iz', 'Yemek, tören, aile ve yer adları kültürü gösterebilir.\nTek bir sözcükten bütün toplum hakkında hüküm verme.'],
        ['Söz varlığı', 'Yerel sözcükler ve deyimler metnin dünyasını kurar.\nBağlam, bilmediğin sözcüğün anlamını düşündürür.'],
        ['Tema ve çatışma', 'Kahramanın amacı ile engeli olayın merkezini oluşturur.\nKültürel değer bu çatışmada görünür olabilir.'],
        ['Karşılaştırma', 'Aynı temayı iki metnin nasıl işlediğine bak.\nBenzerliği ve farkı metinden kanıtla göster.'],
      ],
      not: 'Ortak kültür izi ararken bütün Türk topluluklarını tek ve aynı yaşam biçimi sayma.',
      iddialar: [
        ['Yerel sözcükler hikâyenin kültürel çevresini gösterebilir.', true, 'Söz varlığı metnin geçtiği çevreyle ilişkilidir.'],
        ['Türk dünyasındaki bütün hikâyelerin dili aynıdır.', false, 'Bölgelerin dil özellikleri farklıdır.'],
        ['Anlatıcı ile kahraman aynı kavram değildir.', true, 'Anlatıcı olayı aktaran sestir.'],
        ['İki metni karşılaştırırken metinden kanıt aramak gereksizdir.', false, 'Yorum somut örnekle desteklenir.'],
      ],
      secimler: [
        ['Hikâyenin yapı unsuru hangisi?', 'Mekân', 'Yazı tipi', 'Olayın geçtiği yer yapı unsurudur.'],
        ['Kültür izini hangi ayrıntı taşıyabilir?', 'Tören ve deyim', 'Sayfa numarası', 'Yaşam biçimi dilde ve olayda görünür.'],
        ['Metinleri karşılaştırmada ne gerekir?', 'Metinden kanıt', 'Yalnız izlenim', 'Yorum ayrıntıyla temellendirilir.'],
      ],
      kontrol: ['Hikâyede olayı aktaran ses?', 'Anlatıcı', 'Okur', 'Anlatıcı olayları okura aktarır.'], kontrolKarti: 2,
    },
    {
      id: 'trk11-orhun', ad: 'Orhun Yazıtları',
      kartlar: [
        ['Yazıt nedir?', 'Taşa yazılmış metin tarihî belge ve edebî söyleyiş taşıyabilir.\nOrhun Yazıtları eski Türkçenin önemli örnekleridir.'],
        ['Üç önemli yazıt', 'Tonyukuk, Kül Tigin ve Bilge Kağan yazıtları öne çıkar.\nYazıtlarda devlet ve toplum üzerine sesleniş vardır.'],
        ['Hitap ve öğüt', 'Metin halka seslenir; geçmişten ders çıkarır.\nYönetim, birlik ve bağımsızlık üzerinde durur.'],
        ['Tarihî bağlam', 'Olayları yazıldığı dönemin koşullarıyla oku.\nBugünkü kavramları metne doğrudan taşıma.'],
        ['Dil ve anlatım', 'Seslenme ve yineleme düşünceyi vurgular.\nYazıt yalnız tarih sıralaması değildir.'],
        ['İnceleme yolu', 'Konuşanı, hedef kitleyi ve verilen öğüdü belirle.\nBir cümleyi bütün metnin bağlamında yorumla.'],
      ],
      not: 'Orhun metnini yalnız ezber tarih gibi okuma; halka nasıl ve neden seslendiğini incele.',
      iddialar: [
        ['Orhun Yazıtları taşa yazılmış metinlerdir.', true, 'Yazıtlar tarihî ve edebî değer taşır.'],
        ['Yazıtlarda devlet ve birlik fikri hiç geçmez.', false, 'Halka verilen öğütlerde önemli yer tutar.'],
        ['Metni tarihî bağlamında okumak anlamayı kolaylaştırır.', true, 'Dönemin koşulları sözün anlamını etkiler.'],
        ['Yazıtlarda halka seslenme bulunmaz.', false, 'Doğrudan hitap belirgin anlatım özelliğidir.'],
      ],
      secimler: [
        ['Orhun Yazıtları hangi yüzeye yazıldı?', 'Taşa', 'Kâğıt gazeteye', 'Anıt taşlar üzerindedir.'],
        ['Yazıtlarda öne çıkan düşünce?', 'Birlik ve yönetim', 'Yalnız moda', 'Halka devlet ve birlik üzerine seslenilir.'],
        ['Metni yorumlarken neye bakılır?', 'Tarihî bağlama', 'Yalnız bugünkü kullanıma', 'Olay ve söz kendi döneminde değerlendirilir.'],
      ],
      kontrol: ['Orhun’da metnin hedef kitlesi kimdir?', 'Türk halkı', 'Yalnız yabancı elçiler', 'Yazıtlar halka ve yöneticilere öğüt verir.'], kontrolKarti: 3,
    },
    {
      id: 'trk11-divan-ani', ad: 'Dîvânu Lugâti’t-Türk ve Anı',
      kartlar: [
        ['Sözlükten fazlası', 'Kâşgarlı Mahmud’un eseri Türkçenin söz varlığını tanıtır.\nŞiir ve atasözü örnekleri kültürel bilgi de taşır.'],
        ['Yazılış amacı', 'Eser Türkçeyi öğretme ve tanıtma amacıyla hazırlandı.\nKelimeyi bağlamı içinde okumak gerekir.'],
        ['Anı', 'Yazar yaşadığı ya da tanık olduğu olayları sonradan anlatır.\nBellek ve bakış açısı anlatıyı etkiler.'],
        ['Tanıklık ve sınır', 'Anı tarih için kaynak olabilir.\nTek bir kişinin bakışı bütün olayı temsil etmez.'],
        ['İki metin türü', 'Sözlük sözcüğü açıklar, anı yaşantıyı anlatır.\nİkisi de dönemin dil ve kültürüne iz bırakır.'],
        ['Metin karşılaştırma', 'Eserdeki bilgi ile anlatıcının yorumunu ayır.\nKaynak, dönem ve amaç farkını belirt.'],
      ],
      not: 'Anı yaşanmış olaya dayanır ama bellek seçicidir; onu tek ve tarafsız kayıt sayma.',
      iddialar: [
        ['Dîvânu Lugâti’t-Türk söz varlığı yanında kültür izleri taşır.', true, 'Atasözü ve şiir örnekleri vardır.'],
        ['Anı olay yaşanırken hiç zaman geçmeden yazılmak zorundadır.', false, 'Çoğunlukla olaydan sonra yazılır.'],
        ['Anlatıcının bakış açısı anıyı etkileyebilir.', true, 'Hatırlama ve seçim anlatıda rol oynar.'],
        ['Sözlük ve anı aynı yazılış amacına sahiptir.', false, 'Biri sözcüğü açıklar, diğeri yaşantıyı anlatır.'],
      ],
      secimler: [
        ['Dîvânu Lugâti’t-Türk’ün yazarı?', 'Kâşgarlı Mahmud', 'Bilge Kağan', 'Eseri Kâşgarlı Mahmud hazırladı.'],
        ['Yaşanmış olayı sonradan anlatan tür?', 'Anı', 'Dilekçe', 'Anı geçmiş yaşantıya döner.'],
        ['Anıyı incelerken neyi sorgularız?', 'Bakış açısını', 'Yalnız kâğıt rengini', 'Anlatıcı olayları seçerek aktarır.'],
      ],
      kontrol: ['Sözlükte atasözü ne gösterir?', 'Kültür ve dil ilişkisini', 'Yalnız sayfa sayısını', 'Atasözü kullanım ve kültür hakkında ipucu verir.'], kontrolKarti: 1,
    },
    {
      id: 'trk11-asik', ad: 'Âşık Geleneği ve Atışma',
      kartlar: [
        ['Âşık kimdir?', 'Saz eşliğinde şiir söyleyen halk sanatçısıdır.\nSözlü aktarım geleneğin parçasıdır.'],
        ['Atışma', 'İki âşık belirlenen konuda karşılıklı şiir söyler.\nYalnız hız değil, anlam ve uyum önemlidir.'],
        ['Biçim', 'Hece ölçüsü, dörtlük ve uyak sık görülür.\nHer şiirin aynı kalıpta olduğunu varsayma.'],
        ['Mahlas', 'Şair şiirinde kendine özgü adı kullanabilir.\nSon dörtlükte mahlas görülmesi yaygındır.'],
        ['Dinleyerek çözümleme', 'Soru-cevap, tekrar ve sözcük oyunlarını izle.\nSes ile jest de anlam kurar.'],
        ['Kültürel aktarım', 'Âşıklar olayları ve duyguları kuşaktan kuşağa taşır.\nSözlü icra metni canlı tutar.'],
      ],
      not: 'Atışmada yalnız uyağı sayma; karşı tarafın sözüne nasıl yanıt verildiğini de izle.',
      iddialar: [
        ['Âşık atışmasında karşılıklı söyleyiş vardır.', true, 'İki sanatçı birbirine cevap verir.'],
        ['Mahlas şiirdeki ölçü biriminin adıdır.', false, 'Mahlas şairin kullandığı addır.'],
        ['Hece ölçüsü halk şiirinde sık kullanılır.', true, 'Âşık şiirinde de yaygındır.'],
        ['Âşık geleneği yalnız yazılı kitaplarla aktarılır.', false, 'Sözlü icra temel bir yoldur.'],
      ],
      secimler: [
        ['Şairin şiirde kullandığı takma ad?', 'Mahlas', 'Redif', 'Mahlas şairin adıdır.'],
        ['Atışmanın ayırt edici yanı?', 'Karşılıklı söyleyiş', 'Tek kişinin sessiz okuması', 'Âşıklar birbirine yanıt verir.'],
        ['Halk şiirinde sık ölçü?', 'Hece', 'Metre', 'Hece ölçüsü yaygındır.'],
      ],
      kontrol: ['Atışmada neyi izlemek gerekir?', 'Karşılıklı yanıtı', 'Yalnız sahne boyunu', 'Anlam soru-cevap ilişkisiyle ilerler.'], kontrolKarti: 2,
    },
    {
      id: 'trk11-muze', ad: 'Müze İzlenimi ve Kültürel Anlatım',
      kartlar: [
        ['İzlenim nedir?', 'Gezilen yerde görülenlerle kişisel değerlendirme bir araya gelir.\nSalt eser listesi izlenim yazısı değildir.'],
        ['Gözlem kaydı', 'Eserin adı, malzemesi ve dönemi gibi bilgileri kaydet.\nDoğrulanmış bilgi ile duygunu ayır.'],
        ['Çevrim içi müze', 'Görseli büyüt, açıklamayı oku ve kaynağı not al.\nEkranda görülmeyen ayrıntıyı varmış gibi yazma.'],
        ['Yazı düzeni', 'Girişte müzeyi tanıt, gelişmede seçilen eserleri anlat.\nSonuçta ne öğrendiğini değerlendir.'],
        ['Kültürel bağ', 'Bir nesnenin geçmişteki kullanımını ve bugünkü anlamını karşılaştır.\nYalnız yaşını söylemek yetmez.'],
        ['Kaynağa saygı', 'Müzenin verdiği bilgiyi kendi sözlerinle özetle.\nAlıntı ve görsel kullanırsan kaynağını belirt.'],
      ],
      not: '“Güzeldi” tek başına izlenim değil; hangi ayrıntının sende o etkiyi bıraktığını yaz.',
      iddialar: [
        ['İzlenim yazısında gözlem ve kişisel değerlendirme bulunabilir.', true, 'Görülen şeyin kişideki etkisi anlatılır.'],
        ['Çevrim içi müzede görülmeyen ayrıntı tahminle kesin bilgi sayılır.', false, 'Doğrulanmamış ayrıntı yazılmamalıdır.'],
        ['Eserin kaynak bilgisini belirtmek gerekir.', true, 'Bilgi ve görselin kaynağı görünür olmalıdır.'],
        ['Eser adlarını sıralamak tek başına izlenim yazısıdır.', false, 'Seçim ve değerlendirme gerekir.'],
      ],
      secimler: [
        ['İzlenim yazısında hangi ikili gerekir?', 'Gözlem ve yorum', 'Yalnız eser sayısı', 'Görülenle etkisi birlikte anlatılır.'],
        ['Doğrulanmış bilgi nereden alınır?', 'Müze açıklamasından', 'Rastgele tahminden', 'Kaynak açıklaması kullanılmalıdır.'],
        ['Sonuç bölümünde ne yapılır?', 'Öğrenilen değerlendirilir', 'Yeni konu açılır', 'Gezinin anlamı sonuçta toplanır.'],
      ],
      kontrol: ['İzlenimi eser listesinden ne ayırır?', 'Kişisel değerlendirme', 'Daha çok sayı', 'Yazar gördüğünü neden önemli bulduğunu açıklar.'], kontrolKarti: 1,
    },
  ],
  [
    {
      id: 'trk11-roman', ad: 'Roman ve Sanatçı-Yaşam İlişkisi',
      kartlar: [
        ['Romanın yapısı', 'Roman uzun kurmaca anlatıdır.\nOlay örgüsü, kişiler, zaman ve mekân birlikte kurulur.'],
        ['Anlatıcı', 'Olayı kim anlatıyor sorusunu yazardan ayrı tut.\nBirinci veya üçüncü kişi bakışı bilgiyi sınırlar.'],
        ['Kişi çözümleme', 'Kahramanın amacı, çatışması ve değişimini izle.\nYalnız dış görünüş karakteri açıklamaz.'],
        ['Sanatçıdan izler', 'Yazarın yaşantısı esere konu veya üslup olarak yansıyabilir.\nRomanı doğrudan öz yaşamöyküsü sayma.'],
        ['Dil ve üslup', 'Sözcük seçimi, cümle ritmi ve bakış açısı anlatımı oluşturur.\nAynı olay farklı üslupla başka etki bırakır.'],
        ['Kanıtlı yorum', 'Yaşamla eser arasında bağ kurarken metinden örnek ver.\nBiyografideki her olay romanda bulunmak zorunda değildir.'],
      ],
      not: 'Romandaki “ben” otomatik olarak yazar değildir; anlatıcı kurmaca metnin sesidir.',
      iddialar: [
        ['Anlatıcı ile yazar her zaman aynı kişi değildir.', true, 'Anlatıcı metin içindeki sestir.'],
        ['Roman kahramanını yalnız dış görünüşü açıklar.', false, 'Amaç ve çatışma da gerekir.'],
        ['Yazarın yaşamı romanın üslubunu etkileyebilir.', true, 'Deneyimler anlatıma yansıyabilir.'],
        ['Her roman doğrudan yazarının anısıdır.', false, 'Roman kurmaca bir anlatıdır.'],
      ],
      secimler: [
        ['Roman olayını aktaran ses?', 'Anlatıcı', 'Okur', 'Anlatıcı metnin içindeki sestir.'],
        ['Kişi çözümlemesinde ne aranır?', 'Amaç ve çatışma', 'Yalnız saç rengi', 'Davranışı yönlendiren etkenler incelenir.'],
        ['Yaşam-eser bağını ne destekler?', 'Metin örneği', 'Yalnız söylenti', 'Yorum metinle kanıtlanır.'],
      ],
      kontrol: ['Romandaki “ben” kimdir?', 'Anlatıcı', 'Her zaman yazar', 'Birinci kişi anlatıcı yazar olmak zorunda değildir.'], kontrolKarti: 2,
    },
    {
      id: 'trk11-biyografi', ad: 'Biyografi ve Tezkire',
      kartlar: [
        ['Biyografi', 'Bir kişinin yaşamı araştırma ve kaynaklarla anlatılır.\nOlaylar seçilirken kişi ve dönem ilişkisi kurulur.'],
        ['Kaynak kullanımı', 'Mektup, belge ve tanıklık karşılaştırılabilir.\nDoğrulanmayan ayrıntı kesin bilgi gibi sunulmaz.'],
        ['Kronoloji', 'Yaşam olaylarını zaman sırasıyla izlemek değişimi gösterir.\nYalnız tarih dizmek anlatım kurmaz.'],
        ['Tezkire', 'Özellikle şair ve yazarlar hakkında bilgi veren eski derlemelerdir.\nDil ve değerlendirme biçimi döneminin izini taşır.'],
        ['Karşılaştırma', 'Biyografi ile tezkire kişinin yaşamını anlatabilir.\nKaynak, amaç ve üslup bakımından farklılaşırlar.'],
        ['Sanatçı ve eser', 'Bir dönüm noktasının eserdeki temayla ilişkisini incele.\nBenzerlik varsa bile doğrudan özdeşlik kurma.'],
      ],
      not: 'Tezkireyi modern biyografiyle aynı kalıp sanma; yazar seçimi ve üslubu farklıdır.',
      iddialar: [
        ['Biyografide kaynakları karşılaştırmak güvenilirliği artırır.', true, 'Belgeler birbirini sınayabilir.'],
        ['Tezkire yalnız bilimsel deney raporudur.', false, 'Şair ve yazarlar hakkında bilgi veren derlemedir.'],
        ['Kronoloji yaşamın değişimini görmeye yardım eder.', true, 'Olayların sırası anlam kurar.'],
        ['Biyografi ile tezkire tamamen aynı üslupla yazılmak zorundadır.', false, 'Dönem ve amaçları farklıdır.'],
      ],
      secimler: [
        ['Şairler hakkında eski derleme türü?', 'Tezkire', 'Dilekçe', 'Tezkire edebiyat kişilerini tanıtır.'],
        ['Biyografide güvenilirliği ne artırır?', 'Kaynak karşılaştırma', 'Tahmini kesinleştirme', 'Farklı belgeler bilgiyi sınar.'],
        ['Yaşam olaylarını sıraya koymak?', 'Kronoloji', 'Mahlas', 'Kronoloji zaman düzenidir.'],
      ],
      kontrol: ['Tezkirelerde kimler tanıtılır?', 'Şair ve yazarlar', 'Yalnız sporcular', 'Edebiyat kişileri hakkında bilgi verir.'], kontrolKarti: 4,
    },
    {
      id: 'trk11-radyo', ad: 'Radyo Tiyatrosu',
      kartlar: [
        ['Sese dayalı oyun', 'Radyo tiyatrosunda sahne görünmez.\nKişi, yer ve olay sesle kurulur.'],
        ['Diyalog', 'Konuşmalar çatışmayı ve kişiyi tanıtır.\nOyuncunun tonlaması anlamı değiştirebilir.'],
        ['Ses efekti', 'Kapı, yağmur veya adım sesi mekânı düşündürür.\nEfekt sözü tekrarlamak yerine bilgi taşır.'],
        ['Sessizlik', 'Duraksama gerilim veya düşünme gösterebilir.\nHer boşluk teknik hata değildir.'],
        ['Dinleyerek çözümleme', 'Kimin konuştuğunu, olayın nerede geçtiğini not et.\nYalnız seslerden çıkardığın sonucu kanıtla.'],
        ['Tür değiştirme', 'Diyaloğu öyküye çevirirken sesin verdiği bilgiyi betimlemeye taşı.\nYeni olayı kaynaksız ekleme.'],
      ],
      not: 'Radyo tiyatrosunda görünmeyen sahneyi ses kurar; ses efekti süs değil anlatım aracıdır.',
      iddialar: [
        ['Radyo tiyatrosunda mekân seslerle kurulabilir.', true, 'Efekt ve konuşma dinleyene yer düşündürür.'],
        ['Ses efekti olayla ilgili bilgi taşıyamaz.', false, 'Kapı veya yağmur sesi olay çevresini kurar.'],
        ['Tonlama aynı cümlenin anlamını etkileyebilir.', true, 'Vurgu ve ses rengi yorum değiştirir.'],
        ['Radyo tiyatrosunda konuşmaların işlevi yoktur.', false, 'Diyalog çatışmayı taşır.'],
      ],
      secimler: [
        ['Görünmeyen sahneyi ne kurar?', 'Ses ve diyalog', 'Kamera açısı', 'Radyo tiyatrosu işitseldir.'],
        ['Yağmur sesi ne olabilir?', 'Mekân ipucu', 'Dipnot numarası', 'Efekt olay çevresini kurar.'],
        ['Diyaloğu öyküye çevirirken ne korunur?', 'Olayın anlamı', 'Yalnız ses dosyası', 'Biçim değişir, temel olay korunur.'],
      ],
      kontrol: ['Radyo tiyatrosunun temel anlatım aracı?', 'Ses', 'Sahne dekoru', 'Dinleyici sahneyi sesle kurar.'], kontrolKarti: 1,
    },
    {
      id: 'trk11-mulakat', ad: 'Roman Kişisiyle Hayalî Mülakat',
      kartlar: [
        ['Kişiyi seç', 'Roman kişisinin amacı ve çatışmasını belirle.\nSorularını olayların bağlamına yerleştir.'],
        ['Soru kur', 'Açık uçlu soru kişinin nedenlerini konuşturur.\nYalnız “evet/hayır” soruları sınırlı bilgi verir.'],
        ['Ses uyumu', 'Yanıtlar kişinin diline ve yaşadığı döneme uymalı.\nYazarın kendi görüşünü kişiye zorla söyletme.'],
        ['Metinden kanıt', 'Kişinin kararını bir sahneyle ilişkilendir.\nRomanda olmayan olayı olmuş gibi sunma.'],
        ['Görüşme düzeni', 'Kısa giriş, sorular, yanıtlar ve kapanış kur.\nHer soru öncekinin yanıtını ilerletsin.'],
        ['Değerlendirme', 'Mülakat sonunda kişiyi daha iyi anlayıp anlamadığını sorgula.\nBoşluk varsa sorunu yeniden kur.'],
      ],
      not: 'Hayalî mülakat kurmaca olabilir ama roman kişisinin bilmediği bir olayı ona bildirme.',
      iddialar: [
        ['Mülakat soruları romanın bağlamına dayanmalıdır.', true, 'Kişinin deneyimleri metinden çıkarılır.'],
        ['Hayalî mülakatta romanda olmayan her olay gerçekmiş gibi yazılır.', false, 'Kurgu metne uygun kalmalıdır.'],
        ['Açık uçlu soru kişinin gerekçesini anlatmasını sağlayabilir.', true, 'Neden ve nasıl soruları yanıtı açar.'],
        ['Kişinin dili ve dönemi yanıtları hiç etkilemez.', false, 'Karakterin sesi inandırıcılığı kurar.'],
      ],
      secimler: [
        ['Daha açıklayıcı soru hangisi?', 'Neden böyle karar verdin?', 'Evet mi?', 'Neden sorusu gerekçe ister.'],
        ['Kişi yanıtı neye uymalı?', 'Roman bağlamına', 'Yalnız okurun isteğine', 'Kişinin bilgisi ve dönemi sınır çizer.'],
        ['Kişi yorumunu ne destekler?', 'Metindeki sahne', 'Rastgele tahmin', 'Karar romandan örnekle açıklanır.'],
      ],
      kontrol: ['Hayalî mülakatın dayanağı?', 'Roman metni', 'Yazarın fotoğrafı', 'Kişinin söz ve eylemi romanda aranır.'], kontrolKarti: 4,
    },
  ],
  [
    {
      id: 'trk11-tiyatro', ad: 'Tiyatro Metnini Çözümleme',
      kartlar: [
        ['Sahnelenen metin', 'Tiyatro metni oyuncu, söz ve hareket için yazılır.\nOlay sahnede seyirciye gösterilir.'],
        ['Diyalog ve çatışma', 'Kişilerin karşılıklı sözleri amaçlarını açığa çıkarır.\nÇatışma dramatik hareketi sürdürür.'],
        ['Perde ve sahne', 'Perde büyük bölümü, sahne yer veya kişi değişimini gösterebilir.\nMetnin akışını izlemeye yarar.'],
        ['Sahne yönergesi', 'Parantez içi yönlendirme yer, hareket veya tonu belirtir.\nOyuncunun söylediği replik değildir.'],
        ['Canlandırma', 'Vurgu, duraklama ve beden dili karakterin duygusunu taşır.\nMetnin bağlamından kopmamalı.'],
        ['Yaşamla bağ', 'Metindeki bir çatışmayı günlük yaşamla karşılaştır.\nBenzer durum, aynı sonuç demek değildir.'],
      ],
      not: 'Sahne yönergesini replik diye okuma; oyuncuya nasıl davranacağını söyler.',
      iddialar: [
        ['Sahne yönergesi oyuncunun hareketini gösterebilir.', true, 'Yer ve ton bilgisi verebilir.'],
        ['Diyalog tiyatroda işlevsiz bir süstür.', false, 'Kişi ve çatışma diyalogla kurulur.'],
        ['Canlandırmada beden dili anlamı etkileyebilir.', true, 'Söz dışı ifade önemlidir.'],
        ['Tiyatro metni sahnede hiç oynanamaz.', false, 'Sahnelenmek için yazılır.'],
      ],
      secimler: [
        ['Oyuncuya hareketi bildiren bölüm?', 'Sahne yönergesi', 'Kaynakça', 'Yönerge oyun bilgisini verir.'],
        ['Kişilerin karşılıklı sözleri?', 'Diyalog', 'Lejant', 'Diyalog çatışmayı taşır.'],
        ['Canlandırmada hangi öge anlamı destekler?', 'Beden dili', 'Yalnız sayfa sayısı', 'Hareket ve vurgu sözü tamamlar.'],
      ],
      kontrol: ['Parantez içindeki “kapıya yönelir” ne?', 'Sahne yönergesi', 'Karakterin repliği', 'Oyuncunun hareketini belirtir.'], kontrolKarti: 4,
    },
    {
      id: 'trk11-kucurek', ad: 'Küçürek Hikâye',
      kartlar: [
        ['Kısa ama yoğun', 'Küçürek hikâye az sözle bir durum veya kırılma kurar.\nKısalık tek başına türü tanımlamaz.'],
        ['Boşluk bırakır', 'Bazı olaylar açıkça söylenmez.\nOkur ipuçlarından anlamı tamamlar.'],
        ['Tek odak', 'Çoğunlukla bir an, görüntü ya da çatışma öne çıkar.\nUzun yan olaylara yer verilmez.'],
        ['Dil seçimi', 'Her sözcük anlam yükü taşır.\nGereksiz açıklama etkisini azaltabilir.'],
        ['Başlık', 'Başlık metni yönlendirebilir veya yeni bir anlam katabilir.\nOkumadan önce ve sonra yeniden değerlendir.'],
        ['Yorum yapma', 'Çıkarımını metindeki ayrıntıya bağla.\nBirden çok yorum mümkün olabilir, kanıtsız yorum olmaz.'],
      ],
      not: 'Küçürek hikâyede eksik anlatılanı rastgele doldurma; ipucu metnin içinde olmalı.',
      iddialar: [
        ['Küçürek hikâye okura bazı anlam boşlukları bırakabilir.', true, 'Okur ipuçlarıyla çıkarım yapar.'],
        ['Her kısa yazı otomatik olarak küçürek hikâyedir.', false, 'Yoğun bir anlatı ve kurmaca yapı gerekir.'],
        ['Başlık metne ek anlam katabilir.', true, 'Okurun yorumunu yönlendirebilir.'],
        ['Metinden kanıt göstermeden her yorum eşit derecede geçerlidir.', false, 'Yorum ayrıntıyla desteklenmelidir.'],
      ],
      secimler: [
        ['Küçürek hikâyede okurun görevi?', 'İpuçlarından çıkarım', 'Yalnız kelime saymak', 'Söylenmeyeni metne dayanarak tamamlar.'],
        ['Metnin odağı genelde nedir?', 'Bir an veya kırılma', 'Çok sayıda yan olay', 'Kısa yapı tek odak kurar.'],
        ['Yorumu ne güçlendirir?', 'Metin ayrıntısı', 'Rastgele tahmin', 'Kanıtlı çıkarım gerekir.'],
      ],
      kontrol: ['Küçürek hikâyede boşluğu kim tamamlar?', 'Okur', 'Yalnız yayıncı', 'Okur metnin ipuçlarından anlam kurar.'], kontrolKarti: 2,
    },
    {
      id: 'trk11-belgesel', ad: 'Belgesel ve Afiş',
      kartlar: [
        ['Belgeselin amacı', 'Belgesel gerçek bir konuya ilişkin bilgi ve bakış açısı sunar.\nGörüntü seçimi de anlatımı etkiler.'],
        ['Kaynağı sorgula', 'Kim çekmiş, hangi veri kullanılmış, ne zaman yayımlanmış?\nBu sorular güvenilirliği tarttırır.'],
        ['Görsel ve ses', 'Arşiv görüntüsü, anlatıcı ve müzik duygu yaratabilir.\nDuygu verinin yerine geçmez.'],
        ['Ana mesaj', 'Belgeselin temel düşüncesini bir cümlede kur.\nDestekleyici örnekleri ana düşünceden ayır.'],
        ['Afişin yapısı', 'Başlık, kısa çağrı, görsel ve gerekli bilgi dengelenir.\nKalabalık yazı mesajı gizler.'],
        ['Türe dönüştürme', 'Belgeselin doğrulanmış mesajını afişe taşı.\nBağlamı koparan çarpıcı görsel yanıltabilir.'],
      ],
      not: 'Belgeselde güçlü müzik kanıt değildir; afişe taşıdığın iddianın kaynağını kontrol et.',
      iddialar: [
        ['Belgeselin yayım tarihi güvenilirlik değerlendirmesinde önemlidir.', true, 'Bilginin güncelliği görülebilir.'],
        ['Duygusal müzik bir iddiayı tek başına kanıtlar.', false, 'Kanıt veri ve kaynak gerektirir.'],
        ['Afişte kısa ve açık mesaj okunmayı kolaylaştırır.', true, 'Görsel hiyerarşi anlaşılmayı sağlar.'],
        ['Afiş belgeselde olmayan bilgiyi kesin gerçek diye eklemelidir.', false, 'Mesaj doğrulanmış içeriğe dayanmalıdır.'],
      ],
      secimler: [
        ['Belgeselde güvenilirlik için ne sorulur?', 'Kaynak ve tarih', 'Yalnız müzik türü', 'Kaynak bilgi değerini belirler.'],
        ['Afişte ilk okunacak öge?', 'Açık başlık', 'Uzun dipnot', 'Başlık ana mesajı verir.'],
        ['Belgesel afişe nasıl aktarılır?', 'Doğrulanmış mesajla', 'Rastgele iddiayla', 'İçerik çarpıtılmamalıdır.'],
      ],
      kontrol: ['Belgeselde müzik ne değildir?', 'Tek başına kanıt', 'Anlatım aracı', 'Duyguyu etkiler ama iddiayı kanıtlamaz.'], kontrolKarti: 3,
    },
  ],
]

let sira = 0
export const turkce11 = program('turkce', 11, 'Sözden kültüre, yaşamdan sahneye', [
  tema('trk11-t1', 'Bir Diyeceğim Var!', taslaklar[0].map((t) => onBirinciSinifKonusu(t, sira++))),
  tema('trk11-t2', 'Kültür Yolculuğu', taslaklar[1].map((t) => onBirinciSinifKonusu(t, sira++))),
  tema('trk11-t3', 'Yaşamın İzinde', taslaklar[2].map((t) => onBirinciSinifKonusu(t, sira++))),
  tema('trk11-t4', 'Hayatın Aynası', taslaklar[3].map((t) => onBirinciSinifKonusu(t, sira++))),
])
