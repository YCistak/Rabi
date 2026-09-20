import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 10. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema, üçü de tarih aralığıyla adlandırılıyor. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Program konuları **başlık başlık olay** değil, dönem içindeki eksenler
 * olarak kuruyor: askerî mücadeleler, teşkilat, sosyal-ekonomik yaşam,
 * bilim-kültür. "İstanbul'un Fethi" ayrı bir konu değil, dönemin siyasi ve
 * askerî mücadeleleri içinde.
 */
export const tarih10 = program('tarih', 10, 'Türkistan’dan cihan devletine', [
  tema('trh10-t1', 'Türkistan’dan Türkiye’ye (1040-1299)', [
    konu('trh10-mucadele', 'Türkistan’dan Türkiye’ye Askerî Mücadeleler', [
      kart(
        'Dandanakan Selçuklu Devleti\'ni doğurdu',
        '1040\'ta Selçuklular, Gaznelilerle Dandanakan\'da savaştı ve kazandı. Selçuklu, yani Oğuz Türklerinden çıkan bir hanedan. Bu zaferle Büyük Selçuklu Devleti kuruldu. Devlet olunca yüzlerini batıya, Anadolu\'ya döndüler.',
      ),
      kart(
        'Malazgirt Anadolu\'nun kapısını açtı',
        '1071\'de Alparslan, Malazgirt\'te Bizans ordusunu yendi. Bizans, yani Anadolu\'nun o zamanki sahibi Doğu Roma İmparatorluğu. Yenilgiden sonra sınır açık kaldı. Türk boyları Anadolu\'ya akmaya başladı. Malazgirt devlet kurmadı, yol açtı.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Miryokefalon Anadolu\'yu Türk yurdu yaptı',
        '1176\'da Bizans, Anadolu\'yu geri almak için son büyük denemesini yaptı. Miryokefalon\'da Türkiye Selçuklularına yenildi. Bundan sonra Bizans bir daha Anadolu\'yu geri almayı denemedi. Anadolu artık Türk yurdu sayıldı.',
      ),
      kart(
        'Haçlılar Kudüs için Anadolu\'dan geçti',
        '1096\'dan itibaren Avrupalı şövalyeler Kudüs\'ü almak için yola çıktı. Bu yürüyüşlere Haçlı Seferleri denir. Yolları Anadolu\'dan geçiyordu. Türkiye Selçukluları ve beylikler bu ordularla yıllarca uğraştı.',
      ),
      kart(
        'Avrupa Doğu\'dan kâğıt ve pusulayla döndü',
        'Seferden dönen Avrupalılar kâğıt, pusula ve barutu öğrendi. Bunlar İslam dünyasında zaten kullanılıyordu. Ayrıca Doğu Akdeniz\'de ticaret canlandı. Venedik gibi İtalyan liman şehirleri bu ticaretle zenginleşti.',
      ),
      kart(
        'Kösedağ\'dan sonra beylikler dönemi başladı',
        '1243\'te Moğollar Kösedağ\'da Türkiye Selçuklularını ağır bir yenilgiye uğrattı. Devlet Moğollara bağlandı, merkez zayıfladı. Merkez zayıflayınca her bey kendi bölgesinde bağımsız davrandı. Buna beylikler dönemi denir.',
      ),
      kart(
        'Dört savaşı sonucuyla hatırla',
        'Anadolu tek bir savaşla Türkleşmedi; iki yüzyıl sürdü. Her savaşın bir sonucu var: devlet kuruldu, kapı açıldı, yurt oldu, otorite çöktü. Tarihi unutsan bile sonucu tut.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: '1040 Dandanakan', alt: 'devlet kuruldu' },
            { ad: '1071 Malazgirt', alt: 'Anadolu açıldı' },
            { ad: '1176 Miryokefalon', alt: 'yurt oldu' },
            { ad: '1243 Kösedağ', alt: 'beylikler', renk: 'ikincil' },
          ],
        },
        { not: 'Malazgirt\'e "Anadolu Türk yurdu oldu" dersen dur: kapıyı açan Malazgirt, yurt yapan Miryokefalon.' },
      ),
      kart(
        'Türk boyları neden Anadolu\'yu seçti',
        'Anadolu\'da otlak bol, iklim yumuşak, Bizans sınırı gevşekti. Otlak, hayvanla geçinen boyun ekmeği demek. Hem geçim hem güvenlik vardı. Bu yüzden göçler Anadolu\'ya yöneldi.',
      ),
    ], [
      soru(
        'Şemaya göre Malazgirt Savaşı, Dandanakan Savaşı\'ndan önce yapılmıştır.',
        false,
        'Dandanakan 1040, Malazgirt 1071; sıra tersine.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Dandanakan', alt: '1040' },
            { ad: 'Malazgirt', alt: '1071' },
            { ad: 'Miryokefalon', alt: '1176' },
            { ad: 'Kösedağ', alt: '1243' },
          ],
        },
      ),
      soru('Malazgirt Savaşı\'ndan sonra Anadolu\'ya Türk göçleri hızlanmıştır.', true, 'Anadolu\'nun kapıları Türklere açıldı.'),
      soru('Miryokefalon Savaşı, Anadolu\'nun Türk yurdu olduğunu kesinleştirmiştir.', true, 'Bizans\'ın Anadolu\'yu geri alma umudu bitti.'),
      soru('Kösedağ Savaşı\'ndan sonra Türkiye Selçuklu Devleti güçlenmiştir.', false, 'Devlet Moğollara bağlandı ve Anadolu\'da beylikler kuruldu.'),
      sikli('Bizans\'ın Anadolu\'yu geri alma umudunu bitiren savaş?', ['Miryokefalon (1176)', 'Dandanakan (1040)'], 0, 'Anadolu Türk yurdu kabul edildi.'),
      sikli('Kösedağ Savaşı\'nın sonucu?', ['Beylikler dönemi başladı', 'Anadolu Türkleşmeye başladı'], 0, 'Moğollar merkezî otoriteyi çökertti.'),
      sikli('Haçlı Seferleri\'nden Avrupa neyle tanıştı?', ['Kâğıt, pusula, barut', 'Demir işçiliği'], 0, 'Doğu Akdeniz ticareti canlandı.'),
      sikli('Göç eden boylar Anadolu\'yu neden seçti?', ['Otlak, iklim ve gevşek sınır', 'Deniz ticareti'], 0, 'Geçim ve güvenlik alanı.'),
      soru('Anadolu tek bir savaşla Türkleşti.', false, 'İki yüzyıla yayılan dönüm noktaları.'),
    ], [
      {
        soru: 'Malazgirt Savaşı\'nın en önemli sonucu nedir?',
        siklar: ['Anadolu Türk yerleşimine açıldı', 'Büyük Selçuklu Devleti kuruldu'],
        dogru: 0,
        aciklama: {
          dogru: '1071\'den sonra Türk boyları Anadolu\'ya akmaya başladı.',
          yanlis: 'Büyük Selçuklu\'nun kuruluşu Dandanakan\'ın (1040) sonucu. Malazgirt Anadolu\'nun kapısını açtı.',
        },
        kart: 2,
      },
    ]),
    konu('trh10-teskilat', 'Türk Devlet ve Ordu Teşkilatındaki Değişim', [
      kart(
        'Boy birliğinden merkezî devlete',
        'Bozkırda Türkler boy hâlinde yaşardı; her boyun kendi beyi vardı. Selçuklular İran\'a gelince oradaki devlet düzenini öğrendi. Boy yapısı, İslam ve İran geleneğiyle birleşti. Ortaya tek merkezden yönetilen bir devlet çıktı.',
      ),
      kart(
        'Divan devletin toplantı masasıdır',
        'Bugün bakanlar kurulu neyse Selçuklu\'da Büyük Divan oydu. Divan, yani devlet işlerinin görüşüldüğü kurul. Başında hükümdar ya da vezir oturur. Maliye, yazışma ve ordu işleri ayrı ayrı divanlara bölünmüştü.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İkta: maaş yerine toprağın geliri',
        'Devlet bir komutana para vermek yerine bir köyün vergisini bırakır. Komutan o gelirle kendini ve askerlerini besler. Buna ikta denir. Toprağın sahibi yine devlettir; komutana yalnızca geliri verilir.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Toprak geliri' },
            { ad: 'Komutan' },
            { ad: 'Asker' },
          ],
        },
        { not: 'İkta\'yı "toprak verildi" diye okursan dur: verilen şey toprağın geliri, sahibi hâlâ devlet.' },
      ),
      kart(
        'İkta üç işi birden gördü',
        'Hazineden para çıkmadan ordu beslendi. Komutan gelirini korumak için toprağı işletti; köy boş kalmadı. Komutan bölgesinde düzeni de sağladı. Sınav "ikta neyi sağladı" diye sorunca üçünü birden say.',
      ),
      kart(
        'Ordu üç kaynaktan toplanıyordu',
        'Gulam, yani küçük yaşta alınıp sarayda yetiştirilen asker. İkta askeri, yani komutanın toprak geliriyle beslediği asker. Boy kuvvetleri, yani savaşta çağrılan Türkmen boyları. Üç kaynak orduyu hem büyütüyor hem çeşitlendiriyordu.',
        {
          tur: 'tablo',
          basliklar: ['Asker', 'Kim besler?'],
          satirlar: [
            ['Gulam', 'Saray'],
            ['İkta askeri', 'Komutan'],
            ['Boy kuvveti', 'Boyun kendisi'],
          ],
        },
      ),
      kart(
        'Ülke hanedanın ortak malıydı',
        'Hükümdar ölünce ülke tek oğluna kalmazdı. Eski Türk anlayışında ülke bütün hanedanın, yani hükümdar ailesinin ortak malıydı. Her şehzade tahtta hak görüyordu. Bu yüzden taht kavgaları ve bölünmeler sık yaşandı.',
      ),
      kart(
        'Atabey şehzadeyi yetiştiren vezirdir',
        'Şehzade bir eyalete gönderilince yanına deneyimli bir devlet adamı verilirdi. Buna atabey denir. Atabey şehzadeye yönetmeyi öğretirdi. Merkez zayıflayınca bazı atabeyler bölgelerinde kendi devletlerini kurdu.',
      ),
    ], [
      soru('İkta sisteminde toprağın mülkiyeti devlette kalır.', true, 'Verilen şey mülk değil, toprağın geliri.'),
      soru('Divan, devlet işlerinin görüşüldüğü kuruldur.', true, 'Hükümdar başkanlığında toplanıyordu.'),
      soru('İkta sisteminde askerlerin maaşı hazineden nakit olarak ödenirdi.', false, 'İkta tam da bunu ortadan kaldırıyor: asker toprağın gelirinden geçiniyordu.'),
      soru('Türk devletlerinde ülke, hükümdarın kişisel mülkü sayılırdı.', false, 'Hanedanın ortak malı sayılıyordu; bu anlayış taht kavgalarına yol açtı.'),
      sikli('Şehzadelerin yanına verilen deneyimli devlet adamı?', ['Gulam', 'Atabey'], 1, 'Gulam sarayda yetiştirilen asker; merkez zayıflayınca atabeyler kendi devletlerini kurdu.'),
      sikli('İkta sistemi ne sağladı?', ['Merkezde toplanan vergi', 'Nakit ödemeden beslenen ordu'], 1, 'Toprak da boş kalmadı.'),
      sikli('Selçuklu yönetiminin merkezi?', ['Ahilik', 'Büyük Divan'], 1, 'Maliye, yazışma, ordu ayrı divanlarda.'),
      soru('Boy birliği yapısı İslam ve İran geleneğiyle merkezî bürokrasiye dönüştü.', true, 'Bozkırdan devlete.'),
    ], [
      {
        soru: 'Taht kavgalarının kaynağı olan anlayış hangisidir?',
        siklar: ['Ülke halkın malıdır', 'Ülke hanedanın ortak malıdır'],
        dogru: 1,
        aciklama: {
          dogru: 'Her şehzade hak sahibi sayıldığı için ölen hükümdarın ardından bölünme sık yaşandı.',
          yanlis: 'Eski Türk anlayışında ülke hanedan üyelerinin ortak malıydı; bu, her şehzadeye taht iddiası verdi.',
        },
        kart: 6,
      },
    ]),
    konu('trh10-sosyal', 'Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri', [
      kart(
        'Çadırdan köye: yerleşik hayat arttı',
        'Anadolu\'ya gelen Türklerin çoğu konargöçerdi. Konargöçer, yani yazın yaylaya kışın ovaya taşınan, sürüyle geçinen insan. Zamanla çoğu köy ve şehirlere yerleşti. Ama konargöçerlik tümüyle bitmedi; bazı boylar sürdürdü.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Ahilik esnafın birliğidir',
        'Bir çarşıda ayakkabıcılar, demirciler, dokumacılar var. Hepsi tek bir birliğe bağlı: Ahilik. Ahilik, yani esnaf ve zanaatkârları bir araya getiren teşkilat. Fiyatı düzenler, kaliteyi denetler ve meslek öğretir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Çırak kalfa olur, kalfa usta',
        'Ahiliğe çırak olarak girersin; ustanın yanında yıllarca çalışırsın. Sonra kalfa, en sonunda usta olursun. Bu basamaklarda yalnızca meslek değil, ahlak da öğretilir. Kötü mal üreten esnaf birlikten atılır.',
      ),
      kart(
        'Vakıf: hayır işine bağlanan gelir',
        'Zengin biri bir han yaptırıyor ve kirasını bir medreseye bağlıyor. Han kira getirdikçe medrese çalışıyor. Buna vakıf denir. Cami, imaret (yoksula yemek veren yer), hastane ve köprüler vakıflarla yaşadı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Vakıf kurucusu ölse de yaşar',
        'Devlet her yıl para göndermez; hanın kirası hep gelir. Bu yüzden vakıf kalıcıdır. Kurucu ölür, han durdukça medrese açık kalır. Vakfı hayır işi diye değil, sürekli gelir bağlanmış bir hizmet diye düşün.',
        undefined,
        { not: '"Vakıf neden kalıcı" sorusunda cevap kurucunun iyiliği değil: hizmete bağlanmış sürekli bir gelir.' },
      ),
      kart(
        'Kervansaray yolcuya üç gün bedava',
        'Kervan, yani develerle mal taşıyan tüccar topluluğu. Selçuklular yol boyunca bir günlük aralıklarla kervansaray kurdu. Yolcu orada üç gün ücretsiz kalır, yemek yerdi. Yol güvenli olunca ticaret canlandı.',
      ),
      kart(
        'Ekonominin temeli tarım ve hayvancılık',
        'Halkın çoğu köyde yaşıyor, toprağı ekiyor ve sürü besliyordu. Ekonomi bunlara dayanıyordu. İkta sistemi burada da işe yaradı: komutan gelirini korumak için toprağı boş bırakmazdı.',
      ),
    ], [
      soru('Ahilik, esnaf ve zanaatkârları bir araya getiren bir teşkilattır.', true, 'Hem meslek eğitimi hem ahlak eğitimi veriyordu.'),
      soru('Vakıflar, gelir getiren mülkleriyle kendi giderlerini karşıladığı için kalıcı olabilmiştir.', true, 'Han ve hamam gelirleri vakfın hizmetlerini ayakta tutuyordu.'),
      soru('Ahilikte kalitesiz mal üreten esnafa herhangi bir yaptırım uygulanmazdı.', false, 'Birlikten atılmaya kadar giden yaptırımlar vardı.'),
      soru('Kervansaraylar yalnızca askerî amaçla kullanılırdı.', false, 'Tüccarların konakladığı, yol güvenliğini sağlayan yapılardı.'),
      sikli('Kervansarayda yolcular kaç gün ücretsiz konaklardı?', ['Bir', 'Üç'], 1, 'Selçuklu uygulaması.'),
      sikli('Vakfı kalıcı kılan nedir?', ['Devletin her yıl ödeme yapması', 'Gelir getiren mülkün hizmete bağlanması'], 1, 'Kurucu ölse de kurum yaşar.'),
      sikli('Kötü mal üreten esnafa ne olurdu?', ['Vergisi artardı', 'Ahilikten atılırdı'], 1, 'Kalite denetimi.'),
      soru('Anadolu\'ya gelen Türklerde konargöçerlik tümüyle bitti.', false, 'Azaldı ama bitmedi.'),
    ], [
      {
        soru: 'Esnaf ve zanaatkârları örgütleyen, kaliteyi denetleyen kurum?',
        siklar: ['Vakıf', 'Ahilik'],
        dogru: 1,
        aciklama: {
          dogru: 'Çırak-kalfa-usta basamağı ve kötü mal üretene ceza ahiliğin işi.',
          yanlis: 'Vakıf hayır kurumlarını finanse eder. Esnafı örgütleyen ve kaliteyi denetleyen ahilik.',
        },
        kart: 2,
      },
    ]),
    konu('trh10-turk-islam', 'Türk-İslam Medeniyetinde Bilim, Kültür ve Sanat', [
      kart(
        'Medrese dönemin yüksekokuluydu',
        'Medrese, yani İslam dünyasının yüksekokulu. Selçuklu veziri Nizamülmülk Bağdat\'ta Nizamiye medresesini kurdu. Öğrenciler yatılı okudu, hocalara maaş ödendi. Din bilgisinin yanında matematik, astronomi ve tıp da okutuldu.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İbn Sina\'nın tıp kitabı Avrupa\'da okundu',
        'İbn Sina\'nın tıp kitabı Latinceye çevrildi ve Avrupa\'da yüzyıllarca ders kitabı oldu. Harezmî cebiri kurdu; "algoritma" kelimesi onun adından gelir. Birunî astronomi, Ömer Hayyam takvim ve cebir üstüne çalıştı.',
        {
          tur: 'tablo',
          basliklar: ['Ad', 'Alan', 'Örnek'],
          satirlar: [
            ['İbn Sina', 'Tıp', 'El-Kanun kitabı'],
            ['Harezmî', 'Cebir', '"Algoritma" adı'],
            ['Birunî', 'Astronomi', 'Dünya\'nın çapı'],
            ['Ömer Hayyam', 'Takvim', 'Celali takvimi'],
          ],
        },
      ),
      kart(
        'Türkçe ilk kez bilim dili olarak yazıldı',
        '11. yüzyıla kadar bilim ve edebiyat Arapça ve Farsça yazılıyordu. Karahanlılar döneminde iki büyük eser Türkçe yazıldı: Kutadgu Bilig ve Divânu Lugâti\'t-Türk. Bu ikisi Türkçenin de bilim ve sanat dili olabildiğini gösterdi.',
      ),
      kart(
        'Kutadgu Bilig hükümdara öğüt verir',
        'Yusuf Has Hacib 1070\'te Kutadgu Bilig\'i yazdı; adı "mutluluk veren bilgi" demek. Kitap hükümdara nasıl adil yönetileceğini anlatır. Böyle eserlere siyasetname, yani yöneticiye öğüt kitabı denir.',
      ),
      kart(
        'Divânu Lugâti\'t-Türk Türkçenin sözlüğü',
        'Kâşgarlı Mahmud 1072\'de Türkçe kelimeleri toplayıp Arapça açıklamalarıyla yazdı. Amacı Araplara Türkçe öğretmekti. İçinde Türk boylarının haritası, şiirleri ve atasözleri de var. Bu ilk Türkçe sözlüktür.',
      ),
      kart(
        'Tasavvuf: Allah\'a sevgiyle yaklaşmak',
        'Mevlânâ "Gel, ne olursan ol yine gel" dedi. Yunus Emre Türkçe şiirle sevgiyi anlattı. Bu anlayışa tasavvuf denir: Allah\'a kuralla değil sevgi ve gönülle yaklaşmak. Hacı Bektaş Veli de bu yolun öncülerinden.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Tasavvuf sade dille yayıldı',
        'Yunus Emre Arapça değil köylünün anladığı Türkçeyle yazdı. Dervişler, yani tasavvuf yolundaki kişiler, Hristiyan köylüyü de dışlamadı. Savaş ve göç görmüş halk bu sıcak dili benimsedi. Tekkeler Anadolu\'nun her yerine yayıldı.',
        undefined,
        { not: 'Tasavvufun yayılma sebebi sorulursa iki şey say: sade dil ve farklı inançlara açıklık.' },
      ),
      kart(
        'Selçuklu taşa ve çiniye işledi',
        'Konya\'daki İnce Minareli Medrese\'nin kapısına bak: taş, dantel gibi oyulmuş. Anadolu Selçuklu mimarisi taş işçiliği ve çiniyle tanınır. Çini, yani sırlı renkli seramik. Kümbet (kule biçimli mezar), medrese ve kervansaray başlıca yapılar.',
      ),
    ], [
      soru('Kutadgu Bilig, Yusuf Has Hacib tarafından yazılmıştır.', true, 'Türkçe yazılmış ilk siyasetname sayılıyor.'),
      soru('Karahanlılar döneminde Türkçe yazı dili olarak kullanılmıştır.', true, 'Bu dönemin eserleri Türkçenin yazılı mirasının temeli.'),
      soru('Medreselerde yalnızca dinî ilimler okutulurdu.', false, 'Matematik, astronomi ve tıp da okutuluyordu.'),
      soru('Tasavvufun Anadolu\'nun Türkleşmesinde bir etkisi olmamıştır.', false, 'Tekkeler hem yerleşimde hem kültürel kaynaşmada rol oynadı.'),
      sikli('Divânu Lugâti\'t-Türk nedir?', ['Siyasetname', 'Türkçenin sözlüğü'], 1, 'Kâşgarlı Mahmud, Araplara Türkçe öğretmek için yazdı.'),
      sikli('Tasavvufun Anadolu\'da yayılmasının sebebi?', ['Devlet zorlaması', 'Sade dil ve farklı inançlara açıklık'], 1, 'Göç ve savaş görmüş toplumda karşılık buldu.'),
      sikli('Anadolu Selçuklu mimarisinde öne çıkan?', ['Cam vitray', 'Taş işçiliği ve çini'], 1, 'Kümbet, medrese, kervansaray.'),
      soru('Nizamiye medreseleri dönemin en düzenli yükseköğretim kurumlarıydı.', true, 'Nizamülmülk kurdu.'),
      soru('"Algoritma" kelimesi Harezmî\'nin adından gelir.', true, 'Harezmî cebirin kurucusu sayılır.'),
    ], [
      {
        soru: 'Kutadgu Bilig hangi türde bir eserdir?',
        siklar: ['Siyasetname', 'Sözlük'],
        dogru: 0,
        aciklama: {
          dogru: 'Yusuf Has Hacib yöneticiye nasıl davranacağını anlatır.',
          yanlis: 'Sözlük olan Divânu Lugâti\'t-Türk (Kâşgarlı Mahmud). Kutadgu Bilig yöneticiye öğüt veren bir siyasetname.',
        },
        kart: 4,
      },
    ]),
  ]),
  tema('trh10-t2', 'Beylikten Devlete Osmanlı (1299-1453)', [
    konu('trh10-kurulus', 'Osmanlı Devleti’nin Kuruluşuna Dair Görüşler', [
      kart(
        'Kuruluş yıllarından az belge kaldı',
        'Osmanlı 1299\'da kuruldu ama o yıllardan kalan yazılı belge çok az. İlk Osmanlı tarihleri olaylardan yaklaşık yüz yıl sonra yazıldı. Boşluğu tarihçiler yorumla doldurdu. Bu yüzden kuruluşu açıklayan birden çok görüş var.',
      ),
      kart(
        'Gaza görüşü: sınır savaşçıları büyüttü',
        'Osmanlı, Bizans sınırında bir uç beyliğiydi. Uç, yani düşman sınırındaki en dış bölge. Gaza, yani din uğruna yapılan savaş. Bu görüşe göre gaza için sınıra gelen savaşçılar Osmanlı\'ya katıldı ve beyliği büyüttü.',
      ),
      kart(
        'Aşiret görüşü: Kayı boyu çekirdekti',
        'Osman Bey\'in ailesi Oğuzların Kayı boyundandı. Aşiret, yani akrabalık bağıyla birbirine bağlı boy. Bu görüşe göre devletin çekirdeği bu boy dayanışmasıydı: boyun bütün üyeleri beyin arkasında duruyordu.',
      ),
      kart(
        'Ahilik görüşü: esnaf ve derviş örgütledi',
        'Osman Bey\'in kayınpederi Şeyh Edebali bir ahi şeyhiydi. Ahiler şehirdeki esnafı, dervişler köylüyü örgütlüyordu. Bu görüşe göre kuruluşta ahilerin ve tasavvuf ehlinin desteği belirleyiciydi.',
      ),
      kart(
        'Coğrafya görüşü: doğru yerdeydi',
        'Osmanlı, Bizans\'a komşu ve Balkanlara açılan bir yerde kuruldu. Bizans o sırada zayıftı. Bu görüşe göre büyümenin asıl sebebi konum: genişleyebileceği bir düşman sınırı vardı.',
      ),
      kart(
        'Dört görüş birbirini tamamlar',
        'Sınavda "hangisi doğru" diye sorulmaz. Gaza savaşçıyı, aşiret boyu, ahilik örgütü, coğrafya konumu anlatır. Dördü aynı sürecin farklı yanlarını görüyor. Birini seçip ötekini atma.',
        {
          tur: 'tablo',
          basliklar: ['Görüş', 'Vurgu'],
          satirlar: [
            ['Gaza', 'Sınır savaşçıları'],
            ['Aşiret', 'Boy yapısı'],
            ['Ahilik', 'Örgütlenme'],
            ['Coğrafya', 'Uç konumu'],
          ],
        },
        { not: 'Soru "kuruluşu açıklayan görüş" derse dördü de doğru; "hangisi yanlış" derse ancak dışarıdan uydurma bir şık yanlış.' },
      ),
      kart(
        'Öteki beylikler neden büyüyemedi',
        'Karaman, Germiyan, Aydın gibi beylikler Anadolu\'nun içindeydi. Komşuları da Türk beylikleriydi; genişlemek için Müslüman komşuyla savaşmaları gerekiyordu. Osmanlı ise Bizans\'a komşuydu. Genişleme yönü açıktı.',
      ),
    ], [
      soru('Osmanlı\'nın kuruluşuyla ilgili tek bir görüş üzerinde uzlaşılmıştır.', false, 'Gaza, aşiret, ahilik ve coğrafya temelli birden çok görüş yan yana duruyor.'),
      soru('Gaza ve cihat görüşü, beyliğin sınır boyundaki konumunu öne çıkarır.', true, 'Uç beyliği olmak sürekli bir hareket alanı sağlıyordu.'),
      soru('Osmanlı Beyliği\'nin Bizans sınırında bulunması büyümesini kolaylaştırmıştır.', true, 'Genişleyeceği yönde başka bir Türk beyliği yoktu.'),
      soru('Anadolu\'daki öteki beylikler de Osmanlı ile aynı sınır konumuna sahipti.', false, 'Çoğu Anadolu içindeydi; genişleyecekleri yönde başka Türk beylikleri vardı.'),
      sikli('Kayı boyunu çekirdek sayan görüş?', ['Gaza görüşü', 'Aşiret görüşü'], 1, 'Gaza görüşü uç savaşçılarını öne çıkarır.'),
      sikli('Osmanlı\'nın büyümesinde coğrafi konumun rolü?', ['Deniz gücü', 'Balkanlara açılan bir uçta olması'], 1, 'Genişleme alanı verdi.'),
      sikli('Öteki beylikler neden büyüyemedi?', ['Nüfusları azdı', 'Komşuları da Türk beylikleriydi'], 1, 'Osmanlı genişleyebileceği sınırdaydı.'),
      soru('Kuruluş görüşleri birbirini dışlar.', false, 'Her biri sürecin farklı yanını anlatır.'),
    ], [
      {
        soru: 'Osmanlı\'nın kuruluşu hakkında neden farklı görüşler var?',
        siklar: ['Görüşler birbiriyle çelişiyor', 'Döneme ait yazılı kaynak çok az'],
        dogru: 1,
        aciklama: {
          dogru: 'İlk kronikler olaylardan yüz yıl sonra yazıldı; boşluğu yorumlar dolduruyor.',
          yanlis: 'Görüşler birbirini dışlamıyor, her biri bir yanı anlatıyor. Çokluğun sebebi kuruluş dönemine ait belgelerin azlığı.',
        },
        kart: 1,
      },
    ]),
    konu('trh10-anadolu-rumeli', 'Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Çimpe Kalesi\'yle Rumeli\'ye geçildi',
        'Rumeli, yani Osmanlı\'nın Balkanlardaki topraklarına verdiği ad. 1353\'te Orhan Bey\'in oğlu Süleyman Paşa Çanakkale Boğazı\'nı geçti ve Çimpe Kalesi\'ni aldı. Osmanlı ilk kez Avrupa yakasında toprak edindi. Genişleme buradan hızlandı.',
      ),
      kart(
        'Üç zaferle Balkanlar kalıcı oldu',
        'Sırpsındığı (1364) Balkan ordularının ilk ortak saldırısını kırdı. I. Kosova (1389) Sırpları, Niğbolu (1396) büyük Haçlı ordusunu yendi. Üçünden sonra Avrupa, Osmanlı\'yı Balkanlardan atamayacağını anladı.',
      ),
      kart(
        'Beylikler üç yolla katıldı',
        'Anadolu\'da onlarca Türk beyliği vardı; Osmanlı tek otorite olmak istedi. Karesi savaşla, Hamitoğulları\'nın toprağı satın almayla, Germiyan evlilik çeyiziyle alındı. Yani yalnızca savaş değil, para ve evlilik de kullanıldı.',
      ),
      kart(
        'Ankara Savaşı devleti dağıttı',
        '1402\'de Timur, Ankara yakınında Yıldırım Bayezid\'i yendi ve esir aldı. Timur, yani Orta Asya\'dan gelen Moğol asıllı hükümdar. Anadolu beylikleri yeniden bağımsız oldu. Osmanlı\'nın Anadolu birliği bozuldu.',
      ),
      kart(
        'Fetret: on bir yıllık kardeş kavgası',
        'Bayezid\'in dört oğlu tahta geçmek için birbiriyle savaştı. 1402\'den 1413\'e kadar devletin tek bir padişahı yoktu. Bu döneme Fetret Devri denir; fetret, yani ara dönem, boşluk. Çelebi Mehmet kazandı ve devleti yeniden birleştirdi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fetret\'te Balkanlar elde kaldı',
        'Anadolu\'da beylikler ayrıldı ama Balkanlar ayaklanmadı. Sebep: Osmanlı oradaki halka iyi davranmış, vergisini hafifletmişti. Buna istimalet, yani gönül alma politikası denir. Halk düzeninden memnunsa merkez dağılsa bile gitmez.',
        undefined,
        { not: '"Fetret\'te neden Balkanlar kaybedilmedi" sorusunun cevabı ordu değil, bir politikanın adı: istimalet.' },
      ),
      kart(
        '1453: İstanbul alındı, Bizans bitti',
        'II. Mehmet 53 gün süren kuşatmadan sonra 29 Mayıs 1453\'te İstanbul\'a girdi. Bin yıllık Bizans İmparatorluğu sona erdi. Anadolu ile Rumeli arasındaki Bizans engeli kalktı. Devlet artık bir imparatorluktu.',
      ),
      kart(
        'Fetih Orta Çağ\'ı kapattı',
        'Surları toplar yıktı; Avrupa kalelerin artık güvenli olmadığını gördü. Boğazlar Osmanlı\'nın eline geçti. İstanbul\'dan İtalya\'ya kaçan bilginler eski Yunanca eserleri götürdü; bu Rönesans\'ı besledi. Tarihçiler 1453\'ü Orta Çağ\'ın sonu sayar.',
      ),
    ], [
      soru('Ankara Savaşı\'ndan sonra Osmanlı Devleti Fetret Devri\'ne girmiştir.', true, 'Şehzadeler arasındaki mücadele yaklaşık on bir yıl sürdü.'),
      soru('İstanbul\'un fethi Orta Çağ\'ın sonu kabul edilir.', true, 'Surların top ateşiyle yıkılması çağ değiştiren bir gelişme sayılıyor.'),
      soru('Fetret Devri\'nde Balkanlardaki topraklar tümüyle kaybedilmiştir.', false, 'İstimalet politikası sayesinde Balkanlardaki düzen ayakta kaldı.'),
      soru('Osmanlı, Rumeli\'ye Ankara Savaşı\'ndan sonra geçmiştir.', false, 'Rumeli\'ye geçiş 1353\'te, Ankara Savaşı\'ndan yarım yüzyıl önce oldu.'),
      sikli('Osmanlı Rumeli\'ye hangi kalenin alınmasıyla geçti?', ['Çimpe (1353)', 'Niğbolu'], 0, 'Balkanlara ilk adım.'),
      sikli('Ankara Savaşı\'nda Osmanlı kime yenildi?', ['Timur', 'Bizans'], 0, '1402; Anadolu birliği bozuldu.'),
      sikli('Fetret Devri nedir?', ['Şehzadeler arası taht mücadelesi', 'Moğol işgali'], 0, 'On bir yıl.'),
      sikli('İstanbul\'un fethiyle hangi çağ kapandı?', ['Orta Çağ', 'İlk Çağ'], 0, '1453.'),
      soru('Beylikler yalnızca savaşla Osmanlı\'ya katıldı.', false, 'Satın alma ve evlilik de.'),
    ], [
      {
        soru: 'Fetret Devri\'nde Balkanların elde kalmasını sağlayan neydi?',
        siklar: ['İstimalet politikası', 'Güçlü donanma'],
        dogru: 0,
        aciklama: {
          dogru: 'Yerel halk gönlü alınmış, vergisi hafifletilmişti; merkez dağılırken bölge ayaklanmadı.',
          yanlis: 'Donanma o dönemde güçlü değildi. Bölgeyi tutan şey halkın Osmanlı düzeninden memnun olmasıydı: istimalet.',
        },
        kart: 6,
      },
    ]),
    konu('trh10-devletlesme', 'Devletleşme Süreci: Ordu, Hukuk ve Toprak', [
      kart(
        'Tımar: köyün vergisi sipahiye',
        'Devlet bir köyün vergisini bir atlı askere bırakır. Bu askere sipahi, sisteme tımar denir. Sipahi o gelirle geçinir, karşılığında savaşa kendi askerleriyle gelir. Selçuklu iktasının Osmanlı\'daki devamı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Sipahi asker besler, üretimi gözler',
        'Sipahi savaşa yanında cebelü, yani kendi beslediği zırhlı asker getirir. Geliri yüksekse daha çok cebelü besler. Barışta köyde durur; toprağın ekilmesini gözler. Hazineden bir akçe çıkmadan ordu hazır bekler.',
      ),
      kart(
        'Toprak devletin, köylü kiracı gibi',
        'Köylü tımar toprağını ekiyor ama sahibi değil. Buna miri arazi denir; miri, yani devlete ait. Köylü işleme hakkını babadan oğula geçirebilir. Toprağı üç yıl boş bırakırsa devlet geri alır. Sipahi de sahibi değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Devşirme: Hristiyan çocuktan yeniçeri',
        'Devlet Balkanlardaki Hristiyan köylerinden çocuk alırdı. Buna devşirme denir. Çocuklar Müslüman olur, Türkçe öğrenir, askerî eğitim alırdı. En iyileri saraya, çoğu yeniçeri ocağına giderdi. Yeniçeri, yani padişahın maaşlı yaya askeri.',
      ),
      kart(
        'İki ordu: kapıkulu ve eyalet',
        'Yeniçeriler kapıkulu ordusudur: İstanbul\'da durur, hazineden maaş alır, padişaha bağlıdır. Sipahiler eyalet ordusudur: taşrada yaşar, tımar geliriyle geçinir. Padişah birini ötekine karşı denge olarak tuttu.',
        {
          tur: 'tablo',
          basliklar: ['', 'Kapıkulu', 'Eyalet'],
          satirlar: [
            ['Geçim', 'Maaş', 'Tımar geliri'],
            ['Bağlı', 'Padişah', 'Sancakbeyi'],
            ['Bulunduğu yer', 'Merkez', 'Taşra'],
          ],
        },
      ),
      kart(
        'Örfi hukuk padişahın kanunudur',
        'Osmanlı\'da iki hukuk yan yana yaşıyordu. Şer\'i hukuk, yani İslam dininden gelen kurallar. Örfi hukuk, yani padişahın devlet düzeni için koyduğu kanunlar. Fatih bunları kanunnamede yazıya döktü; kurallar artık kâğıtta duruyordu.',
      ),
      kart(
        'Divan-ı Hümayun en yüksek kuruldur',
        'Vezirler, kadıaskerler ve defterdar haftada birkaç gün toplanırdı. Bu kurula Divan-ı Hümayun denir. Devletin bütün önemli kararları burada alınır, son sözü padişah söylerdi. Sıradan bir köylü de şikâyetini divana getirebilirdi.',
      ),
      kart(
        'Toprak, ordu ve hukuk tek çarktır',
        'Tımar orduyu besler. Ordu güvenliği sağlar. Güvenlik varsa köylü toprağı eker, tımar gelir getirir. Kanun bu düzeni yazıya bağlar. Biri bozulunca hepsi sarsılır; 17. yüzyılda tam bu oldu.',
        undefined,
        { not: 'Tımarı ayrı, orduyu ayrı ezberlersen 17. yüzyıl sorusunu çözemezsin: biri bozulunca öteki neden bozuldu, onu izle.' },
      ),
    ], [
      soru('Tımar sisteminde toprağın mülkiyeti devlete aittir.', true, 'Sipahiye bırakılan şey toprağın vergi geliri.'),
      soru('Devşirme sistemiyle alınan çocuklar eğitilerek devlet hizmetine alınırdı.', true, 'Kimileri yeniçeri oldu, kimileri saray görevlerine yükseldi.'),
      soru('Tımarlı sipahiler maaşlarını hazineden nakit olarak alırdı.', false, 'Geçimlerini kendilerine bırakılan toprağın gelirinden sağlıyorlardı.'),
      soru('Divan-ı Hümayun\'un kararları padişahın onayına sunulmazdı.', false, 'Son söz padişahındı; divan kararları onun onayıyla yürürlüğe giriyordu.'),
      sikli('Miri arazide toprağın sahibi kimdir?', ['Devlet', 'Köylü'], 0, 'Köylüye işleme hakkı verilir.'),
      sikli('Padişahın koyduğu kanunlara ne denir?', ['Örfi hukuk', 'Şer\'i hukuk'], 0, 'Kanunnameler.'),
      sikli('Kapıkulu ordusu nasıl beslenirdi?', ['Maaşla, merkeze bağlı', 'Toprak geliriyle'], 0, 'Eyalet askeri toprak gelirinden.'),
      soru('Devletin en yüksek karar organı Divan-ı Hümayun\'du.', true, 'Her tebaanın şikâyet götürebildiği merci.'),
      sikli('Sipahinin savaşa getirdiği, kendi beslediği askere ne denir?', ['Cebelü', 'Yeniçeri'], 0, 'Yeniçeri kapıkulu askeri; hazineden maaş alır.'),
    ], [
      {
        soru: 'Tımar sisteminde sipahi karşılığında ne yapar?',
        siklar: ['Hazineye nakit vergi öder', 'Asker yetiştirir ve üretimi denetler'],
        dogru: 1,
        aciklama: {
          dogru: 'Toprağın vergisi sipahide kalır, sipahi cebelü besler.',
          yanlis: 'Nakit hazineye gitmez, sipahide kalır. Karşılığı asker yetiştirmek ve toprağın işlenmesini sağlamak.',
        },
        kart: 2,
      },
    ]),
    konu('trh10-kalicilik', 'Fethettiği Topraklarda Kalıcı Olma Politikaları', [
      kart(
        'İskân: fethedilen yere nüfus taşımak',
        'Osmanlı Balkanlarda bir bölgeyi alınca Anadolu\'dan Türk aileleri oraya yerleştirdi. Buna iskân denir; iskân, yani yerleştirme. Boş köyler şenlendi. Türk nüfus artınca bölgeyi elde tutmak kolaylaştı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Konargöçer ve huzursuz olan taşındı',
        'Kimler götürüldü? Konargöçerler: sürüyle gezen boylar, yeni otlağa sevinirdi. Kalabalık aileler: bir kardeş kalır, biri gider. Anadolu\'da huzursuzluk çıkaranlar: gönderilince orası rahatlar. Tek hamleyle iki sorun çözülür.',
      ),
      kart(
        'İstimalet: yerli halkın gönlünü almak',
        'Fethedilen köyün Hristiyan halkına dokunulmaz. Canı, malı ve inancı güvence altındadır. Vergisi Bizans dönemine göre hafifletilir. Buna istimalet denir; istimalet, yani gönül alma. Halk memnun olunca ayaklanmaz.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Eski düzen bir anda değişmedi',
        'Bir köyde yüzyıllardır belli bir vergi var. Osmanlı bunu bir anda kaldırıp yenisini koymaz; çoğunu olduğu gibi tutar. Ani değişiklik direnç üretir. Eski düzeni koruyup yavaşça kendi düzenine çeker.',
      ),
      kart(
        'Cami ve köprü kalıcılığın işaretidir',
        'Osmanlı aldığı şehre cami, han, hamam ve köprü yaptırdı. Han, yani tüccarın konakladığı bina. Bu yapılar şehri canlandırırdı. Aynı zamanda halka bir mesaj verirdi: "Biz buradan gitmeyeceğiz."',
      ),
      kart(
        'Millet sistemi: her din kendi işinde',
        'Osmanlı\'da millet, ulus değil din topluluğu demek. Ortodoks Rumlar patriğin, Yahudiler hahambaşının altında kendi kilisesini, okulunu ve miras işini kendi yürütürdü. Devlet bu iç işlere karışmazdı. Bir arada yaşama böyle sürdü.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Köylü neden direnmedi',
        'Bizans köylüsü ağır vergi ödüyor, toprak beyi onu eziyordu. Osmanlı gelince vergi hafifledi, inancına dokunulmadı. Köylünün gözünden bak: yeni yönetim eskisinden daha katlanılırdı. Direnmeye sebebi yoktu.',
        undefined,
        { not: 'İskân ile istimaleti karıştırırsan şunu tut: iskân Türk\'ü taşır, istimalet yerliyi hoş tutar.' },
      ),
    ], [
      soru('İstimalet, fethedilen yerdeki halka hoşgörüyle yaklaşma politikasıdır.', true, 'Vergi kolaylıkları ve inanç serbestliği bunun parçasıydı.'),
      soru('İskân politikasıyla Anadolu\'dan Rumeli\'ye nüfus yerleştirilmiştir.', true, 'Konargöçerler ve kalabalık aileler bu iskânda öne çıkıyordu.'),
      soru('Fethedilen yerlerdeki bütün yerel düzenler hemen kaldırılırdı.', false, 'Uygun görülen vergi ve toprak uygulamaları bir süre korunuyordu.'),
      soru('Millet sistemi, gayrimüslimlerin kendi hukukî işlerini yürütmesine izin vermezdi.', false, 'Cemaatler kendi inanç ve hukuk işlerinde serbestti.'),
      sikli('İskân için kimler tercih edilirdi?', ['Yalnızca askerler', 'Konargöçerler ve huzursuzluk çıkaranlar'], 1, 'İki sorun birden çözülürdü.'),
      sikli('Gayrimüslimlerin kendi liderleri altında serbest olması?', ['İstimalet', 'Millet sistemi'], 1, 'Bir arada yaşamayı kolaylaştırdı.'),
      sikli('Osmanlı düzeni Bizans köylüsü için neden katlanılırdı?', ['Toprak bedava verildi', 'Vergi yükü daha hafifti'], 1, 'Köylünün gözünden bak.'),
      soru('Fethedilen yerde yerel vergi düzeni hemen değiştirilirdi.', false, 'Çoğu zaman korunurdu; ani değişiklik direnç üretir.'),
    ], [
      {
        soru: 'Fethedilen yerlerdeki halka hoşgörü siyasetine ne denir?',
        siklar: ['İskân', 'İstimalet'],
        dogru: 1,
        aciklama: {
          dogru: 'Can, mal ve inanç güvenliği verilip vergi hafifletildi.',
          yanlis: 'İskân, bölgeye Anadolu\'dan nüfus yerleştirmek. Yerli halka hoşgörü göstermek istimalet.',
        },
        kart: 3,
      },
    ]),
    konu('trh10-ilim-irfan', 'İlim ve İrfan Geleneğinin Oluşması', [
      kart(
        'İlk medrese 1331\'de İznik\'te açıldı',
        'Orhan Bey İznik\'i aldıktan sonra orada ilk Osmanlı medresesini kurdu (1331). Medrese, yani yüksekokul. Devletin kadıya (yargıç) ve müderrise (hoca) ihtiyacı vardı; ilk kadılar ve hocalar burada yetişti.',
      ),
      kart(
        'Davud-i Kayseri ilk hoca, Fenari ilk müftü',
        'İznik medresesinin başına Davud-i Kayseri getirildi; ilk başmüderris odur. Molla Fenari ise ilk şeyhülislam sayılır. Şeyhülislam, yani dinî konularda devletin en yüksek görevlisi. İkisi de Osmanlı ilim geleneğinin başındaki adlar.',
      ),
      kart(
        'Külliye: cami etrafında bir mahalle',
        'Bursa\'da Yeşil Cami\'nin yanında medrese, imaret, hamam ve türbe var. Hepsi tek bir topluluk: külliye. Külliye, yani cami çevresinde toplanan yapı grubu. İmaret yoksula yemek verir, hamam temizlik sağlar, medrese okutur.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Külliye tek vakıfla döner',
        'Bu yapıların masrafını kim öder? Yanlarındaki han ve dükkânların kirası. Kurucu bu gelirleri vakfeder; külliye o gelirle yüzyıllarca yaşar. Yeni alınan bir şehre külliye kurmak, şehri canlandırmanın en hızlı yoluydu.',
        undefined,
        { not: 'Külliyeyi "büyük cami" diye düşünme: tek vakıfla dönen, okulu ve aşevi olan bir şehir merkezi.' },
      ),
      kart(
        'Tekke ve zaviye uçları şenlendirdi',
        'Tekke, yani dervişlerin toplandığı yer; zaviye küçük tekke. Dervişler ıssız yol kenarlarına zaviye kurup yolcuyu ağırlardı. Etrafına köy kurulurdu. Böylece hem yol güvenliği hem yerleşim sağlandı. Yerli halk dervişle tanışıp kaynaştı.',
      ),
      kart(
        'İlim ve irfan ayrı şeylerdir',
        'İlim medresede öğrenilen bilgi: fıkıh, matematik, tıp. İrfan tekkede kazanılan gönül bilgisi: sabır, edep, sevgi. Osmanlı ikisini yan yana tuttu; medrese aklı, tekke gönlü eğitti. Konunun adı bu yüzden "ilim ve irfan".',
      ),
    ], [
      soru('Külliye, cami çevresinde toplanan yapıların oluşturduğu bir yapı topluluğudur.', true, 'Medrese, imaret ve hamam da bu topluluğun parçası.'),
      soru('Tekke ve zaviyeler yalnızca ibadet için kullanılan yapılardı.', false, 'Konaklama, yerleşim ve eğitim gibi işlevleri de vardı.'),
      soru('İlk Osmanlı medresesi İznik\'te kurulmuştur.', true, 'Orhan Bey döneminde, 1331\'de açıldı.'),
      soru('Külliyeler yalnızca eğitim veren yapılar olduğu için halkın günlük hayatına dokunmazdı.', false, 'İmaretiyle, hamamıyla, çarşısıyla mahallenin merkezini oluşturuyorlardı.'),
      sikli('Cami çevresindeki medrese, imaret ve hamam topluluğu?', ['Tekke', 'Külliye'], 1, 'Şehrin çekirdeği.'),
      sikli('İlk şeyhülislam olarak anılan?', ['Davud-i Kayseri', 'Molla Fenari'], 1, 'Davud-i Kayseri ilk medresenin başmüderrisi.'),
      soru('Tekke ve zaviyeler uç bölgelerde yol güvenliği sağladı.', true, 'Yerleşim ve kaynaşma merkezleri.'),
    ], [
      {
        soru: 'Osmanlı\'nın ilk medresesi nerede açıldı?',
        siklar: ['İznik', 'İstanbul'],
        dogru: 0,
        aciklama: {
          dogru: '1331\'de İznik\'te; İstanbul\'un fethi bir yüzyıl sonra.',
          yanlis: 'İstanbul 1453\'te fethedildi; Sahn-ı Seman ondan sonra. İlk medrese 1331\'de İznik\'te.',
        },
        kart: 1,
      },
    ]),
  ]),
  tema('trh10-t3', 'Cihan Devleti Osmanlı (1453-1683)', [
    konu('trh10-siyasi', '1453-1683 Arasındaki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Çaldıran\'da Safeviler durduruldu',
        'Safeviler, yani İran\'da kurulan Şii Türk devleti. Anadolu\'daki Türkmenleri kendi tarafına çekiyordu. Yavuz Sultan Selim 1514\'te Çaldıran\'da Şah İsmail\'i yendi. Doğu sınırı güvene alındı.',
      ),
      kart(
        'Ridaniye ile halifelik Osmanlı\'ya geçti',
        'Memlükler, yani Mısır ve Suriye\'ye hâkim devlet. Yavuz 1516 Mercidabık ve 1517 Ridaniye\'de onları yendi. Mısır alındı, Baharat Yolu Osmanlı\'ya geçti. Halifelik, yani bütün Müslümanların önderliği, Osmanlı padişahına geçti.',
      ),
      kart(
        'Mohaç iki saatte Macaristan\'ı verdi',
        'Kanuni 1526\'da Mohaç\'ta Macar ordusunu yaklaşık iki saatte dağıttı. Macaristan Osmanlı\'ya bağlandı. Yol Viyana\'ya kadar açıldı; 1529\'da Viyana ilk kez kuşatıldı ama alınamadı.',
      ),
      kart(
        'Preveze Akdeniz\'i Osmanlı gölü yaptı',
        '1538\'de Barbaros Hayrettin Paşa, Preveze\'de birleşik Haçlı donanmasını yendi. Akdeniz\'de üstünlük Osmanlı\'ya geçti. Bu tarihten sonra Akdeniz\'e "Osmanlı gölü" dendi.',
      ),
      kart(
        'Sınırlar üç kıtaya yayıldı',
        'Kanuni döneminde (1520–1566) devlet Avrupa, Asya ve Afrika\'da toprak sahibiydi; sınırlar 17. yüzyılda en geniş hâlini aldı. Padişah kendini dünyanın hükümdarı sayıyordu. Buna cihanşümul iddia denir; cihanşümul, yani bütün dünyayı kapsayan.',
      ),
      kart(
        'İnebahtı ilk büyük deniz yenilgisi',
        '1571\'de Haçlı donanması İnebahtı\'da Osmanlı donanmasını yaktı. Kayıp ağırdı ama donanma bir yılda yeniden kuruldu. Yine de Avrupa, Osmanlı\'nın denizde yenilebileceğini gördü.',
      ),
      kart(
        'II. Viyana: ilerleyişin sonu (1683)',
        'Merzifonlu Kara Mustafa Paşa 1683\'te Viyana\'yı ikinci kez kuşattı. Lehistan ordusu yetişince Osmanlı bozguna uğradı. Bundan sonra Avrupa\'da toprak alınmadı, kaybedildi. Tarihçiler 1683\'ü geri çekilişin başlangıcı sayar.',
      ),
      kart(
        'İki yüzyılı beş tarihle tut',
        'Tarihleri değil kırılmaları tut: 1453 imparatorluk oldu, 1517 halifelik geldi, 1538 denizde zirve. 1571 ilk büyük yenilgi, 1683 ilerleyiş bitti.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: '1453 İstanbul', alt: 'imparatorluk' },
            { ad: '1517 Ridaniye', alt: 'halifelik' },
            { ad: '1538 Preveze', alt: 'Akdeniz' },
            { ad: '1571 İnebahtı', alt: 'ilk büyük yenilgi' },
            { ad: '1683 II. Viyana', alt: 'ilerleyiş bitti', renk: 'ikincil' },
          ],
        },
        { not: 'Preveze ile İnebahtı\'yı karıştırırsan yılına bak: 1538 kazandık, 1571 kaybettik.' },
      ),
      kart(
        'Uzun savaşlar hazineyi tüketti',
        'İran\'la ve Avusturya\'yla savaşlar bazen on beş yıl sürdü. Asker beslemek, kale kurmak sürekli para istedi. Hazine boşaldı, tımar düzeni sarsıldı. Sonraki konuların çoğu buradan çıkıyor.',
      ),
      kart(
        'Osmanlı koloni yarışına girmedi',
        'İspanya Amerika\'dan altın, Portekiz Hindistan\'dan baharat getiriyordu. Koloni, yani uzak bir toprağı ele geçirip zenginliğini kendine akıtmak. Osmanlı kara imparatorluğu olarak kaldı; okyanuslara açılmadı. Gelir kaynakları çeşitlenmedi.',
      ),
    ], [
      soru('Osmanlı Devleti en geniş sınırlarına 17. yüzyılda ulaşmıştır.', true, 'Bu yüzyıldan sonra topraklar genişlemek yerine korunmaya çalışıldı.'),
      soru('Uzun süren savaşlar hazineyi zorlamıştır.', true, 'Sürekli asker beslemek gider yükünü büyütüyordu.'),
      soru('Osmanlı, Avrupa devletleriyle birlikte okyanus ötesi koloni yarışına girmiştir.', false, 'Osmanlı bu yarışın dışında kaldı; genişlemesi kara üzerinden sürdü.'),
      soru('1683\'teki II. Viyana Kuşatması Osmanlı için zaferle sonuçlanmıştır.', false, 'Kuşatma bozgunla bitti ve geri çekiliş başladı.'),
      sikli('Çaldıran Savaşı kime karşı yapıldı?', ['Memlükler', 'Safeviler'], 1, '1514; Memlükler Ridaniye\'de yenildi.'),
      sikli('Akdeniz\'de üstünlük hangi savaşla kazanıldı?', ['İnebahtı (1571)', 'Preveze (1538)'], 1, 'İnebahtı donanmanın yenildiği ilk büyük çarpışma.'),
      sikli('Batıya ilerleyişin sonu?', ['Mohaç (1526)', 'II. Viyana Kuşatması (1683)'], 1, 'Mohaç Macaristan\'ın alınması.'),
      sikli('Osmanlı neden koloni yarışına girmedi?', ['Denizciliği yoktu', 'Kara imparatorluğu olarak kaldı'], 1, 'Gelir kaynakları çeşitlenmedi.'),
      soru('Kanuni döneminde devlet üç kıtaya yayıldı.', true, 'Avrupa, Asya ve Afrika.'),
      sikli('Preveze\'de Osmanlı donanmasına kim komuta etti?', ['Barbaros Hayrettin Paşa', 'Piri Reis'], 0, 'Piri Reis haritacı ve denizci; Preveze\'nin komutanı Barbaros.'),
      soru('İnebahtı yenilgisinden sonra Osmanlı donanması bir daha kurulamadı.', false, 'Donanma bir yılda yeniden kuruldu; kaybedilen şey yenilmezlik izlenimiydi.'),
    ], [
      {
        soru: 'Halifeliğin Osmanlı\'ya geçmesini sağlayan savaş?',
        siklar: ['Ridaniye (1517)', 'Çaldıran (1514)'],
        dogru: 0,
        aciklama: {
          dogru: 'Memlük toprakları alındı, halifelik Osmanlı\'ya geçti.',
          yanlis: 'Çaldıran Safevilere karşı; halifelik Memlüklerin yenildiği Ridaniye ile geçti.',
        },
        kart: 2,
      },
    ]),
    konu('trh10-yonetim-degisim', 'Yönetim ve Ordu Yapısındaki Değişim', [
      kart(
        'Şehzade artık sancağa çıkmıyor',
        'Eskiden şehzade, yani padişahın oğlu, bir sancağa vali gönderilirdi; yönetimi orada öğrenirdi. 17. yüzyılda bu bitti. Şehzadeler sarayda kapalı bir dairede tutuldu; buna kafes usulü denir. Tahta çıkan padişah dışarıyı hiç görmemiş oluyordu.',
      ),
      kart(
        'Ekber ve erşed kardeş katlini bitirdi',
        'Fatih Kanunnamesi padişaha kardeşlerini öldürme izni veriyordu; amaç taht kavgasını önlemekti. I. Ahmet bunu bıraktı. Yeni kural ekber ve erşed: hanedanın en yaşlı ve en olgun üyesi tahta geçer. Kardeş katli bitti, kafes başladı.',
      ),
      kart(
        'Tüfek sipahiyi gereksiz kıldı',
        'Sipahi atlı ve kılıçlıydı. Avrupa orduları tüfekli piyadeye geçince at ve kılıç yetmedi. Devlet tüfekli asker istedi; tüfekli asker maaş ister. Tımar gelirleri sipahiden alınıp iltizama verildi. Tımar düzeni çözüldü.',
      ),
      kart(
        'İltizam: vergiyi peşin parayla satmak',
        'Devlet bir bölgenin vergisini toplama hakkını açık artırmayla satar. En yüksek parayı veren mültezim olur ve peşin öder. Sonra o parayı köylüden geri çıkarmaya çalışır. Ödediğinden fazlasını almak ister; köylü ezilir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Tımar', alt: 'sipahi asker besler' },
            { ad: 'İltizam', alt: 'vergi satılır' },
            { ad: 'Köylü yükü artar', renk: 'ikincil' },
          ],
        },
        { etiket: 'Tanım' },
      ),
      kart(
        'Yeniçeri ocağı bozuldu',
        'Devşirme kuralı gevşedi; para verenin oğlu da yeniçeri oldu. Sayı arttı, talim azaldı, çoğu esnaflık yapıyordu. Ama silahlıydılar. İstemedikleri padişahı tahttan indirecek kadar siyasete karıştılar.',
      ),
      kart(
        'Yönetim sadrazama kaydı',
        'Padişahlar sarayda büyüyüp deneyimsiz kalınca devleti sadrazam, yani padişahın baş veziri yönetmeye başladı. Köprülü Mehmet Paşa 1656\'da göreve gelirken tam yetki istedi ve aldı. Köprülüler dönemi bunun en açık örneğidir.',
      ),
      kart(
        'Islahatlar sopayla yapıldı',
        'Islahat, yani düzeltme, yenileme. Kuyucu Murat Paşa Celalileri kuyulara doldurdu. II. Osman yeniçeriyi kaldırmak isteyince öldürüldü. IV. Murat kahve ve tütünü yasaklayıp korkuyla düzen kurdu. Ölünce düzen de bozuldu.',
      ),
      kart(
        'Islahatlar neden tutmadı',
        'Üçünün de hedefi aynıydı: Kanuni dönemindeki eski düzeni geri getirmek. Ama dünya değişmişti; tüfek, gümüş ve okyanus ticareti eskiyi geri getirmeye izin vermiyordu. Eskiyi onarmak yerine yeniyi kurmak gerekiyordu.',
        undefined,
        { not: '17. yüzyıl ıslahatı sorulunca şunu tut: hedef yeniyi kurmak değil eskiyi onarmaktı, bu yüzden tutmadı.' },
      ),
    ], [
      soru('Ekber ve erşed sistemiyle tahta hanedanın en yaşlı ve olgun üyesi geçmeye başlamıştır.', true, 'Kardeş katlinin yerine getirildi.'),
      soru('İltizam usulünde vergi toplama hakkı açık artırmayla kişilere devredilirdi.', true, 'Devlet peşin gelir elde ediyor, köylü daha ağır vergiyle karşılaşıyordu.'),
      soru('Tımar sisteminin bozulması ordunun güçlenmesini sağlamıştır.', false, 'Tersine, tımarlı sipahi sayısı azaldı ve eyalet ordusu zayıfladı.'),
      soru('Islahatlar toplumun her alanını kapsadığı için kalıcı sonuçlar vermiştir.', false, 'Eski düzeni onarmayı hedefliyordu ve kalıcı olmadı.'),
      sikli('Sancağa çıkmanın yerini ne aldı?', ['Devşirme', 'Kafes usulü'], 1, 'Deneyimsiz padişahlar arttı.'),
      sikli('Kardeş katlinin yerini alan kural?', ['Kafes usulü', 'Ekber ve erşed'], 1, 'En yaşlı ve olgun üye.'),
      sikli('Tımarın çözülmesinin sebebi?', ['Toprak tükendi', 'Ateşli silahlar sipahiyi önemsizleştirdi'], 1, 'Tımarlar iltizama döndü.'),
      sikli('Köprülüler dönemi neyin örneğidir?', ['Kafes usulünün', 'Yönetimin sadrazama kayması'], 1, 'Padişahlar geri çekildi.'),
      soru('17. yüzyıl ıslahatları yeni bir düzen kurmayı hedefliyordu.', false, 'Eski düzeni onarmayı hedefliyordu.'),
    ], [
      {
        soru: 'İltizam sisteminde köylü neden ezildi?',
        siklar: ['Vergi devlete gitmedi', 'Mültezim ödediğinden fazlasını almak istedi'],
        dogru: 1,
        aciklama: {
          dogru: 'Vergi hakkını peşin parayla alan mültezim kârını köylüden çıkardı.',
          yanlis: 'Vergi devlete peşin gitti; sorun sonrasında: mültezim ödediğinden fazlasını köylüden toplamak istedi.',
        },
        kart: 4,
      },
    ]),
    konu('trh10-somurge', 'Avrupa’nın Sömürgeci Politikalarının Etkileri', [
      kart(
        'Keşifler ticareti okyanusa taşıdı',
        '1498\'de Vasco da Gama Afrika\'yı dolaşıp Hindistan\'a ulaştı. Baharat artık Osmanlı toprağından değil, gemiyle okyanustan geliyordu. İpek ve Baharat yolları boşaldı. Coğrafi keşifler, yani Avrupalıların yeni deniz yolları ve kıtalar bulması.',
      ),
      kart(
        'Sömürge: başkasının toprağını sağmak',
        'İspanya Amerika\'yı aldı; altın ve gümüşünü gemilerle İspanya\'ya taşıdı. Buna sömürgecilik denir: uzak bir toprağı ele geçirip kaynağını kendi ülkene aktarmak. Avrupa\'nın zenginliğinin bir kaynağı bu.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Gümrük geliri düştü',
        'Baharat Osmanlı toprağından geçerken her şehirde gümrük, yani geçiş vergisi ödüyordu. Bu hazinenin en sağlam gelirlerindendi. Ticaret okyanusa kayınca kervanlar azaldı. Gümrük geliri düştü; hazine bir kaynağını kaybetti.',
      ),
      kart(
        'Fiyat devrimi: gümüş bollaştı, para düştü',
        'Amerika\'nın gümüşü Avrupa\'ya, oradan Osmanlı\'ya aktı. Piyasada gümüş bollaşınca akçenin, yani Osmanlı gümüş parasının değeri düştü. Aynı ekmek daha çok akçe etti. Maaşı sabit olan asker ve memur yoksullaştı.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Amerika’dan gümüş' },
            { ad: 'Para bollaştı' },
            { ad: 'Akçe değer kaybetti' },
            { ad: 'Sabit gelir eridi', renk: 'ikincil' },
          ],
        },
        { not: 'Gümüş bollaştı deyince "zenginleşti" sanma: para çoğaldı, değeri düştü; maaşı sabit olan kaybetti.' },
      ),
      kart(
        'Kapitülasyon: yabancıya ticaret ayrıcalığı',
        'Kanuni 1535\'te Fransız tüccara düşük gümrük ve serbest ticaret hakkı verdi. Amaç ticareti Akdeniz\'e geri çekmekti. Buna kapitülasyon denir. Başta Osmanlı güçlüyken verilen bir lütuftu; sonra her devlet istedi ve yüke dönüştü.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ucuz Avrupa malı loncayı ezdi',
        'Avrupa atölyeleri bol ve ucuz kumaş üretmeye başladı. Kapitülasyonla düşük vergiyle içeri girdi. Osmanlı esnafı loncada örgütlüydü; lonca, yani ahiliğin devamı olan esnaf birliği. Lonca malı daha pahalıydı, satılamadı.',
      ),
      kart(
        'Lonca çok üretmek için kurulmamıştı',
        'Lonca her ustanın kaç tezgâh açacağını, malın fiyatını ve kalitesini belirlerdi. Amaç az ama iyi üretmek, herkese iş bırakmaktı. Böyle bir düzen büyüyemez. Avrupa\'nın seri üretimi karşısında yetişemedi.',
      ),
    ], [
      soru(
        'Şemadaki fiyat devrimi, Osmanlı\'da sabit gelirli kesimi zenginleştirmiştir.',
        false,
        'Fiyatlar artarken maaşlar aynı kaldı; sabit gelirlinin alım gücü eridi.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Sömürge gümüşü' },
            { ad: 'Para bollaştı' },
            { ad: 'Fiyatlar arttı' },
            { ad: 'Sabit gelir eridi' },
          ],
        },
      ),
      soru('Ticaret yollarının yön değiştirmesi Osmanlı\'nın gümrük gelirlerini azaltmıştır.', true, 'Kervan yollarının yerini okyanus yolları aldı.'),
      soru('Kapitülasyonlar başlangıçta Osmanlı\'nın kendi isteğiyle verdiği ayrıcalıklardı.', true, 'Sonradan her devlet istedi ve ekonomiyi zorlayan bir yüke dönüştü.'),
      soru('Lonca düzeni, Avrupa\'daki seri üretimle rekabet edebilmiştir.', false, 'Ucuz ve bol üretilen mallar karşısında lonca üretimi yetişemedi.'),
      sikli('Coğrafi keşiflerle ticaret nereye kaydı?', ['Karadeniz\'e', 'Okyanuslara'], 1, 'İpek ve Baharat yolları önemini yitirdi.'),
      sikli('Osmanlı\'nın transit ticaretten aldığı pay?', ['Arttı', 'Azaldı'], 1, 'Gümrük geliri düştü.'),
      sikli('Lonca neden rekabette geriledi?', ['Vergiden muaftı', 'Az ve iyi üretmek için kurulmuştu'], 1, 'Çok üretmek için değil.'),
      soru('Kapitülasyonlar başta ticareti canlandırmak için verildi.', true, 'Zamanla yüke dönüştü.'),
    ], [
      {
        soru: 'Fiyat devriminin Osmanlı\'ya etkisi ne oldu?',
        siklar: ['Para değer kaybetti, enflasyon yükseldi', 'Gümrük geliri arttı'],
        dogru: 0,
        aciklama: {
          dogru: 'Amerika gümüşü akçenin değerini düşürdü.',
          yanlis: 'Gümrük geliri keşifler yüzünden tam tersine düştü. Fiyat devrimi paranın değer kaybı ve enflasyon demek.',
        },
        kart: 4,
      },
    ]),
    konu('trh10-isyan', 'Önemli İsyanların Neden ve Sonuçları', [
      kart(
        'Celali: Anadolu\'da köylü ayaklandı',
        '16. yüzyıl sonunda Anadolu\'da vergi ağırlaştı, mültezim baskısı arttı. Savaştan dönen tüfekli sekbanlar, yani ücretli askerler, işsiz kaldı ve eşkıyalığa başladı. Köylü de onlara katıldı. Bu ayaklanmalara Celali isyanları denir.',
      ),
      kart(
        'Büyük kaçgun: köylü toprağını bıraktı',
        'Celali çeteleri köyleri basıyordu. Köylü canını kurtarmak için tarlasını bırakıp şehre ya da dağa kaçtı. Buna büyük kaçgun denir. Köyler boşaldı; tarım üretimi yıllarca toparlanamadı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İstanbul isyanı: yeniçeri ayaklandı',
        'Yeniçeriler ulufe, yani üç ayda bir aldıkları maaş, gecikince ya da değersiz paradan verilince ayaklandı. Cülus, yani tahta çıkış bahşişi, azsa da ayaklandı. II. Osman\'ı öldürdüler, başka padişahları indirdiler.',
      ),
      kart(
        'Eyalet isyanı: vali başkaldırdı',
        'Merkez zayıflayınca uzak eyaletlerdeki valiler emir dinlemez oldu. Bazıları ordu toplayıp başkaldırdı. Buna eyalet isyanı denir. Otoritenin ulaşamadığı yerde yerel güçler öne çıktı.',
      ),
      kart(
        'Üç isyan, üç yer, tek sebep',
        'Celali Anadolu\'da köylü ve sekban, İstanbul\'da yeniçeri, eyalette vali. Yerleri ve kişileri ayrı. Ama üçünün altında aynı şey var: bozulan para, artan vergi, uzun savaşlar.',
        {
          tur: 'tablo',
          basliklar: ['İsyan', 'Kim?'],
          satirlar: [
            ['Celali', 'Anadolu köylüsü'],
            ['İstanbul', 'Yeniçeri'],
            ['Eyalet', 'Valiler'],
          ],
        },
        { not: '"Celali kimdir" sorusunda İstanbul\'daki yeniçeriyi seçme: Celali Anadolu\'da, köylü ve sekban.' },
      ),
      kart(
        'İsyan sebep değil sonuçtu',
        'Sırayı karıştırma. Önce uzun savaşlar hazineyi boşalttı, akçe değer kaybetti, vergiler arttı, tımar çöktü. İsyanlar bunların sonucu olarak çıktı. Yani isyan devleti bozmadı; bozulan devlet isyanı doğurdu.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'İsyanların bıraktığı yara',
        'Köyler yandı, insanlar öldü, tarım düştü. Üretim düşünce vergi geliri de düştü; devlet yeni vergi koydu, bu yeni isyan doğurdu. Merkezî otorite her isyanda biraz daha zayıfladı.',
      ),
    ], [
      soru('Celali isyanları Anadolu\'da tarımsal üretimin azalmasına yol açmıştır.', true, 'Köylü toprağını bırakıp göç etti.'),
      soru('Büyük kaçgun, köylülerin topraklarını bırakıp göç etmesidir.', true, 'Celali baskısı ve güvensizlik bunun sebebiydi.'),
      soru('İstanbul isyanlarının kaynağı taşradaki köylülerdi.', false, 'Kaynağı yeniçeriler ve kapıkulu askerleriydi.'),
      soru('İsyanların devletin vergi düzeni üzerinde bir etkisi olmamıştır.', false, 'Üretim düşünce vergi geliri de azaldı ve yeni vergiler kondu.'),
      sikli('Celali isyanları nerede çıktı?', ['İstanbul', 'Anadolu'], 1, 'Ağır vergi, mültezim baskısı, işsiz sekbanlar.'),
      sikli('Padişah değiştirecek güce ulaşan ayaklanmalar?', ['Eyalet isyanları', 'İstanbul isyanları'], 1, 'Yeniçeri ve kapıkulu.'),
      sikli('Üç isyan türünün ortak arka planı?', ['Dış işgal', 'Mali bozulma'], 1, 'İsyanlar sebep değil sonuç.'),
      soru('Büyük kaçgun tarımsal üretimi hızla toparladı.', false, 'Yıllarca toparlanamadı.'),
    ], [
      {
        soru: 'Celali baskısıyla köylünün toprağı bırakıp kaçmasına ne denir?',
        siklar: ['Fetret', 'Büyük kaçgun'],
        dogru: 1,
        aciklama: {
          dogru: 'Köyler boşaldı, tarımsal üretim uzun süre toparlanamadı.',
          yanlis: 'Fetret, Ankara Savaşı sonrası taht mücadelesi dönemi. Köylünün toprağı bırakması büyük kaçgun.',
        },
        kart: 2,
      },
    ]),
    konu('trh10-bilim-kultur', '1453-1683 Arasında Bilim, Kültür ve Sanat', [
      kart(
        'Sahn-ı Seman: Fatih\'in sekiz medresesi',
        'Fatih, İstanbul\'da kendi camisinin iki yanına sekiz medrese yaptırdı. Sahn-ı Seman, yani sekiz avlu. Dönemin en yüksek eğitim kurumuydu; kadılar ve müderrisler buradan çıktı. Kanuni sonra Süleymaniye medreselerini ekledi.',
      ),
      kart(
        'Piri Reis dünya haritası çizdi',
        'Piri Reis 1513\'te Amerika kıyılarını gösteren bir dünya haritası çizdi. Kitab-ı Bahriye\'de Akdeniz limanlarını tek tek anlattı. Bahriye, yani denizcilik. Osmanlı denizciliği o dönemde Avrupa\'yla yarışıyordu.',
      ),
      kart(
        'Takiyüddin\'in rasathanesi yıkıldı',
        'Takiyüddin 1577\'de İstanbul\'da bir rasathane, yani gökyüzünü gözlem evi kurdu. Aletleri Avrupa\'dakilerle aynı düzeydeydi. Bir kuyruklu yıldızdan sonra "felaket getirdi" dendi; rasathane 1580\'de top ateşiyle yıkıldı.',
      ),
      kart(
        'Kâtip Çelebi devleti eleştirdi',
        'Kâtip Çelebi 17. yüzyılda yaşadı. Cihannüma\'da dünya coğrafyasını, Keşfü\'z-Zünun\'da on dört bin kitabı tanıttı. Bir başka eserinde devletin neden bozulduğunu açıkça yazdı. Sorunu görüp yazan ilk aydınlardan.',
      ),
      kart(
        'Mimar Sinan klasik üslubu kurdu',
        'Sinan doksan yıllık ömründe yüzlerce yapı dikti. Şehzade, Süleymaniye ve Selimiye camileri onun eseri. Kubbe, yani yarım küre çatı, onun elinde ustalaştı. Osmanlı klasik mimarisi denince Sinan anlaşılır.',
      ),
      kart(
        'Sinan\'ın çıraklık, kalfalık, ustalık eseri',
        'Sinan kendi üç eserini üç basamağa koydu: Şehzade çıraklık, Süleymaniye kalfalık, Edirne\'deki Selimiye ustalık eseri. Sınavda "ustalık eseri" diye sorulunca Süleymaniye\'yi değil Selimiye\'yi seç.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Şehzade', alt: 'çıraklık' },
            { ad: 'Süleymaniye', alt: 'kalfalık' },
            { ad: 'Selimiye', alt: 'ustalık' },
          ],
        },
        { not: 'Ustalık eseri deyince aklına Süleymaniye gelirse dur: o kalfalık, ustalık Edirne\'deki Selimiye.' },
      ),
      kart(
        'Fuzuli ve Baki divan şiirinin zirvesi',
        'Divan edebiyatı, yani saray çevresinde Arapça-Farsça kelimelerle yazılan şiir. Fuzuli aşkı ve acıyı, Baki İstanbul\'un ihtişamını yazdı. Aynı dönemde minyatür (küçük resim), hat (güzel yazı) ve çini kendi okullarını kurdu.',
      ),
      kart(
        'Matbaa Osmanlı\'ya 270 yıl geç geldi',
        'Gutenberg 1450\'lerde matbaayı kurdu. Osmanlı\'da ilk Türkçe kitap 1729\'da basıldı. Arada Avrupa\'da milyonlarca kitap çoğaltıldı; Osmanlı\'da kitaplar elle kopyalanıyordu. Bilginin yayılma hızındaki bu fark arayı açtı.',
      ),
    ], [
      soru('Sahn-ı Seman medreseleri Fatih döneminde kurulmuştur.', true, 'Dönemin en üst düzey eğitim kurumlarıydı.'),
      soru('Piri Reis\'in haritaları dönemin denizcilik bilgisini yansıtır.', true, 'Kitab-ı Bahriye Akdeniz limanlarını anlatan bir eser.'),
      soru('İstanbul Rasathanesi kurulduktan sonra uzun yıllar çalışmalarını sürdürmüştür.', false, 'Kuruluşundan üç yıl sonra yıktırıldı.'),
      soru('Matbaa Osmanlı\'da Avrupa ile aynı dönemde yaygınlaşmıştır.', false, 'İlk Türkçe kitap yaklaşık 270 yıl sonra, 1729\'da basıldı.'),
      sikli('Fatih\'in kurduğu sekiz medrese?', ['Sahn-ı Seman', 'Nizamiye'], 0, 'Nizamiye Selçuklu medresesi.'),
      sikli('Kitab-ı Bahriye kimin eseridir?', ['Piri Reis', 'Kâtip Çelebi'], 0, 'Kâtip Çelebi Cihannüma\'yı yazdı.'),
      sikli('Takiyüddin\'in İstanbul\'da kurduğu?', ['Rasathane', 'Matbaa'], 0, 'Kısa süre sonra yıkıldı.'),
      sikli('Süleymaniye\'yi Sinan hangi dönemine sayar?', ['Kalfalık', 'Ustalık'], 0, 'Ustalık Selimiye.'),
      soru('Matbaanın gecikmesi Avrupa ile arayı açan etkenlerden biridir.', true, 'Bilgi çoğaltma hızı.'),
    ], [
      {
        soru: 'Mimar Sinan\'ın ustalık eseri hangisidir?',
        siklar: ['Selimiye', 'Süleymaniye'],
        dogru: 0,
        aciklama: {
          dogru: 'Şehzade çıraklık, Süleymaniye kalfalık, Selimiye ustalık.',
          yanlis: 'Süleymaniye\'yi kalfalık eseri saymıştır. Ustalık eseri Edirne\'deki Selimiye.',
        },
        kart: 6,
      },
    ]),
  ]),
])
