import { program, tema } from '../tip'
import { onBirinciSinifKonusu, type OnBirinciSinifKonusu } from './11-yardimci'
import { turkceDerinligi } from './11-turkce-derinlik'

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
        ['Karagöz oyununda süslü, Arapça ve Farsça sözcüklerle konuşan tip Karagöz’dür.', false, 'Süslü dille Hacivat konuşur; Karagöz halkın konuşma dilini kullanır.'],
      ],
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
        ['Dilekçede kurum adı ve imza bulunuyorsa isteğin gerekçesini yazmaya gerek kalmaz.', false, 'İsteğin ne olduğu kadar neden istendiği de açık yazılmalıdır.'],
        ['Hitap ve imza mektubun yapısında işlev taşır.', true, 'Alıcı ve göndereni belirginleştirir.'],
        ['Bir öğrencinin okul müdürlüğünden izin istemek için yazdığı metin özel mektuptur.', false, 'Kuruma talep iletmek için yazılan metin dilekçedir.'],
      ],
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
        ['E-postaya eklenen ilgisiz ayrıntılar ana mesajı daha görünür kılar.', false, 'İlgisiz ayrıntı ana mesajı gizler.'],
        ['Göndermeden önce ekleri kontrol etmek yararlıdır.', true, 'Unutulan ek iletiyi eksik bırakır.'],
        ['Yanlış adrese gönderilen bir e-posta her zaman geri alınabilir.', false, 'Yanlış adrese giden ileti geri alınamayabilir; alıcı gönderimden önce denetlenir.'],
      ],
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
        ['Hikâyede olayın merkezini kahramanın amacı ile önündeki engel oluşturmaz.', false, 'Kahramanın amacı ile engeli olayın merkezidir.'],
        ['Anlatıcı ile kahraman aynı kavram değildir.', true, 'Anlatıcı olayı aktaran sestir.'],
        ['Aynı temayı işleyen iki hikâye, çatışmayı aynı biçimde kurmak zorundadır.', false, 'Tema ortak olsa da kahramanın amacı ve engeli farklı işlenebilir.'],
      ],
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
        ['Kül Tigin ve Bilge Kağan yazıtları eski Türkçenin değil, Osmanlı Türkçesinin örnekleridir.', false, 'Orhun Yazıtları eski Türkçenin önemli örnekleridir.'],
        ['Metni tarihî bağlamında okumak anlamayı kolaylaştırır.', true, 'Dönemin koşulları sözün anlamını etkiler.'],
        ['Orhun Yazıtlarında bağımsızlık düşüncesi üzerinde durulmaz.', false, 'Yazıtlar yönetim, birlik ve bağımsızlık üzerinde durur.'],
      ],
    },
    {
      id: 'trk11-divan-ani', ad: 'Dîvânu Lugâti’t-Türk ve Anı',
      kartlar: [
        ['Sözlükten fazlası', 'Kâşgarlı Mahmud’un eseri Türkçenin söz varlığını tanıtır.\nŞiir ve atasözü örnekleri kültürel bilgi de taşır.\nKutadgu Bilig ise Yusuf Has Hacib’indir; ikisini karıştırma.'],
        ['Yazılış amacı', 'Eser Türkçeyi öğretme ve tanıtma amacıyla hazırlandı.\nKelimeyi bağlamı içinde okumak gerekir.'],
        ['Anı', 'Yazar yaşadığı ya da tanık olduğu olayları sonradan anlatır.\nBellek ve bakış açısı anlatıyı etkiler.'],
        ['Tanıklık ve sınır', 'Anı tarih için kaynak olabilir.\nTek bir kişinin bakışı bütün olayı temsil etmez.'],
        ['İki metin türü', 'Sözlük sözcüğü açıklar, anı yaşantıyı anlatır.\nİkisi de dönemin dil ve kültürüne iz bırakır.'],
        ['Metin karşılaştırma', 'Eserdeki bilgi ile anlatıcının yorumunu ayır.\nKaynak, dönem ve amaç farkını belirt.'],
      ],
      not: 'Anı yaşanmış olaya dayanır ama bellek seçicidir; onu tek ve tarafsız kayıt sayma.',
      iddialar: [
        ['Dîvânu Lugâti’t-Türk söz varlığı yanında kültür izleri taşır.', true, 'Atasözü ve şiir örnekleri vardır.'],
        ['Anıda yazar, yalnız başkalarından duyduğu ve tanık olmadığı olayları anlatır.', false, 'Anıda yazar yaşadığı ya da tanık olduğu olayları sonradan anlatır.'],
        ['Anlatıcının bakış açısı anıyı etkileyebilir.', true, 'Hatırlama ve seçim anlatıda rol oynar.'],
        ['Dîvânu Lugâti’t-Türk’ü Yusuf Has Hacib yazmıştır.', false, 'Eser Kâşgarlı Mahmud’undur; Yusuf Has Hacib Kutadgu Bilig’i yazdı.'],
      ],
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
        ['Âşık şiirinde mahlas çoğunlukla ilk dörtlükte söylenir.', false, 'Mahlas yaygın olarak son dörtlükte görülür.'],
      ],
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
        ['İzlenim yazısında ne öğrenildiğinin değerlendirmesi girişte yapılır; sonuç bölümü gerekmez.', false, 'Girişte müze tanıtılır; ne öğrenildiği sonuçta değerlendirilir.'],
        ['Eserin kaynak bilgisini belirtmek gerekir.', true, 'Bilgi ve görselin kaynağı görünür olmalıdır.'],
        ['Eser adlarını sıralamak tek başına izlenim yazısıdır.', false, 'Seçim ve değerlendirme gerekir.'],
      ],
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
        ['Birinci kişi ağzından anlatılan romanda anlatıcı, öbür kişilerin içinden geçeni doğrudan bilebilir.', false, 'Birinci kişi bakışı bilgiyi anlatıcının gördüğüyle sınırlar.'],
        ['Yazarın yaşamı romanın üslubunu etkileyebilir.', true, 'Deneyimler anlatıma yansıyabilir.'],
        ['Bir romanda yazarın yaşamından iz bulunması, romanı kurmaca olmaktan çıkarıp anı yapar.', false, 'Yaşantı esere yansıyabilir; roman yine kurmacadır.'],
      ],
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
        ['Şuara tezkireleri şairler hakkında değil, hükümdarların seferleri hakkında bilgi veren eserlerdir.', false, 'Şuara tezkireleri şairlerin hayatını anlatır, şiirlerinden örnek verir.'],
        ['Kronoloji yaşamın değişimini görmeye yardım eder.', true, 'Olayların sırası anlam kurar.'],
        ['Bir kişinin yaşamındaki olayları tarih sırasıyla dizmek, tek başına biyografi anlatımı kurar.', false, 'Kronoloji gerekir; olayları kişi ve dönemle ilişkilendirmek de gerekir.'],
      ],
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
        ['Radyo tiyatrosunda her sessizlik ya da duraksama teknik hata sayılır.', false, 'Duraksama gerilim veya düşünme gösterebilir.'],
        ['Tonlama aynı cümlenin anlamını etkileyebilir.', true, 'Vurgu ve ses rengi yorum değiştirir.'],
        ['Radyo tiyatrosunda kişiler arasındaki çatışma konuşmalarla tanıtılamaz.', false, 'Konuşmalar çatışmayı ve kişiyi tanıtır.'],
      ],
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
        ['Mülakatı hazırlayan, romanda dayanağı olmayan kendi görüşünü kişiye söyletebilir.', false, 'Yanıt kişinin diline, dönemine ve metindeki eylemlerine dayanmalı.'],
        ['Açık uçlu soru kişinin gerekçesini anlatmasını sağlayabilir.', true, 'Neden ve nasıl soruları yanıtı açar.'],
        ['Hayalî mülakat giriş ve kapanış olmadan, soruların art arda sıralanmasıyla kurulur.', false, 'Kısa giriş, sorular, yanıtlar ve kapanış düzeni kurulur.'],
      ],
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
        ['Metindeki çatışmaya benzeyen bir yaşam durumu da mutlaka aynı sonuçla biter.', false, 'Benzer durum aynı sonuç demek değildir.'],
        ['Canlandırmada beden dili anlamı etkileyebilir.', true, 'Söz dışı ifade önemlidir.'],
        ['Tiyatro metninde perde, sahneden daha küçük bir bölümdür.', false, 'Perde büyük bölümdür; sahne, perde içindeki yer ya da kişi değişimini gösterir.'],
      ],
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
        ['Küçürek hikâye, birden çok yan olayı ayrıntılı anlatarak etki kurar.', false, 'Tek bir an ya da çatışmaya odaklanır; yan olaylara yer vermez.'],
        ['Başlık metne ek anlam katabilir.', true, 'Okurun yorumunu yönlendirebilir.'],
        ['Küçürek hikâyede birden çok yorum mümkünse metindeki ipucuna dayanmayan yorum da kabul edilir.', false, 'Birden çok yorum olabilir ama kanıtsız yorum olmaz.'],
      ],
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
        ['Belgeseldeki destekleyici bir örnek, belgeselin ana mesajıyla aynı şeydir.', false, 'Ana düşünce tek cümlede kurulur; örnekler onu destekler.'],
        ['Afişte kısa ve açık mesaj okunmayı kolaylaştırır.', true, 'Görsel hiyerarşi anlaşılmayı sağlar.'],
        ['Belgeselde müzik ve anlatıcının yarattığı duygu, verinin yerine kanıt olarak geçer.', false, 'Duygu verinin yerine geçmez.'],
      ],
    },
  ],
]

export const turkce11 = program('turkce', 11, 'Sözden kültüre, yaşamdan sahneye', [
  tema('trk11-t1', 'Bir Diyeceğim Var!', taslaklar[0].map((t) => onBirinciSinifKonusu(t, turkceDerinligi[t.id]))),
  tema('trk11-t2', 'Kültür Yolculuğu', taslaklar[1].map((t) => onBirinciSinifKonusu(t, turkceDerinligi[t.id]))),
  tema('trk11-t3', 'Yaşamın İzinde', taslaklar[2].map((t) => onBirinciSinifKonusu(t, turkceDerinligi[t.id]))),
  tema('trk11-t4', 'Hayatın Aynası', taslaklar[3].map((t) => onBirinciSinifKonusu(t, turkceDerinligi[t.id]))),
])
