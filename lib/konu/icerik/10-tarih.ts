import { kart, konu, program, soru, tema } from '../tip'

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
        'Dandanakan (1040)',
        'Selçuklular Gaznelileri yendi ve Büyük Selçuklu Devleti kuruldu. Türklerin batıya yönelişi hızlandı.',
      ),
      kart(
        'Malazgirt (1071)',
        'Alparslan Bizans ordusunu yendi. Anadolu Türk yerleşimine açıldı; kapı bir daha kapanmadı.',
      ),
      kart(
        'Dönemin çizgisi',
        'Anadolu’nun Türkleşmesi tek bir savaşla değil, iki yüzyıla yayılan bir dizi dönüm noktasıyla oldu.',
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
      ),
      kart(
        'Miryokefalon (1176)',
        'Bizans’ın Anadolu’yu geri alma umudu bitti. Artık Anadolu’nun Türk yurdu olduğu kabul edildi.',
      ),
      kart(
        'Haçlı Seferleri',
        'Anadolu ve Suriye üzerinden gelen seferler Türk beyliklerini zorladı; sonuçta doğu-batı teması arttı.',
      ),
      kart(
        'Haçlıların sonuçları',
        'Avrupa kâğıt, pusula ve barutla tanıştı; Doğu Akdeniz ticareti canlandı ve İtalyan şehirleri zenginleşti.',
      ),
      kart(
        'Kösedağ (1243)',
        'Moğollar Türkiye Selçuklularını yendi. Merkezî otorite çöktü ve beylikler dönemi başladı.',
      ),
      kart(
        'Neden Anadolu?',
        'Otlakları bol, iklimi elverişli ve Bizans sınırı gevşekti. Göç eden boylar için hem geçim hem güvenlik alanıydı.',
      ),
    ], [
      soru(
        'Şemaya göre Malazgirt Savaşı, Dandanakan Savaşı ndan önce yapılmıştır.',
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
      soru('Malazgirt Savaşı ndan sonra Anadolu ya Türk göçleri hızlanmıştır.', true, 'Anadolu nun kapıları Türklere açıldı.'),
      soru('Miryokefalon Savaşı, Anadolu nun Türk yurdu olduğunu kesinleştirmiştir.', true, 'Bizans ın Anadolu yu geri alma umudu bitti.'),
      soru('Kösedağ Savaşı ndan sonra Anadolu Selçuklu Devleti güçlenmiştir.', false, 'Devlet dağılma sürecine girdi ve Anadolu da beylikler kuruldu.'),
    ]),
    konu('trh10-teskilat', 'Türk Devlet ve Ordu Teşkilatındaki Değişim', [
      kart(
        'Bozkırdan devlete',
        'Boy birliğine dayalı yapı, İslam ve İran devlet geleneğiyle birleşerek merkezî bir bürokrasiye dönüştü.',
      ),
      kart(
        'Divan teşkilatı',
        'Büyük Divan yönetimin merkezi oldu; maliye, yazışma ve ordu işleri ayrı divanlara bölündü.',
      ),
      kart(
        'İkta sistemi',
        'Toprağın geliri hizmet karşılığı komutan ve askerlere verildi. Hazineden para çıkmadan ordu beslendi.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Toprak geliri' },
            { ad: 'Komutan' },
            { ad: 'Asker' },
          ],
        },
      ),
      kart(
        'İktanın üç kazancı',
        'Ordu beslendi, toprak boş kalmadı ve taşrada düzen sağlandı. Tek bir düzenleme üç işi birden gördü.',
      ),
      kart(
        'Ordu unsurları',
        'Gulam askerleri, ikta askerleri ve boy kuvvetleri. Farklı kaynaklar orduyu hem büyütüyor hem çeşitlendiriyordu.',
      ),
      kart(
        'Ülke hanedanın malı',
        'Eski Türk anlayışında ülke hanedanın ortak malıydı; bu anlayış taht kavgalarının ve bölünmenin kaynağıydı.',
      ),
      kart(
        'Atabeylik',
        'Şehzadelerin yanına deneyimli devlet adamı verilirdi. Merkez zayıflayınca bu atabeyler kendi devletlerini kurdu.',
      ),
    ], [
      soru('İkta sisteminde toprağın mülkiyeti devlette kalır.', true, 'Verilen şey mülk değil, toprağın geliri.'),
      soru('Divan, devlet işlerinin görüşüldüğü kuruldur.', true, 'Hükümdar başkanlığında toplanıyordu.'),
      soru('İkta sisteminde askerlerin maaşı hazineden nakit olarak ödenirdi.', false, 'İkta tam da bunu ortadan kaldırıyor: asker toprağın gelirinden geçiniyordu.'),
      soru('Türk devletlerinde ülke, hükümdarın kişisel mülkü sayılırdı.', false, 'Hanedanın ortak malı sayılıyordu; bu anlayış taht kavgalarına yol açtı.'),
    ]),
    konu('trh10-sosyal', 'Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri', [
      kart(
        'Yerleşiklik arttı',
        'Anadolu’ya gelen Türkler zamanla köy ve şehirlere yerleşti; konargöçerlik azaldı ama tümüyle bitmedi.',
      ),
      kart(
        'Ahilik',
        'Esnaf ve zanaatkâr birliği. Kalite denetimi, fiyat düzeni ve mesleki eğitimi birlikte yürütüyordu.',
      ),
      kart(
        'Ahiliğin işleyişi',
        'Çırak, kalfa ve usta basamakları hem mesleği hem ahlaki eğitimi kapsıyordu; kötü mal üreten esnaf birlikten atılırdı.',
      ),
      kart(
        'Vakıf sistemi',
        'Hayır kurumlarını finanse eden yapı: cami, medrese, imaret, hastane ve köprüler vakıflarla yaşadı.',
      ),
      kart(
        'Vakıf neden kalıcı?',
        'Gelir getiren bir mülk süresiz olarak bir hizmete bağlanır; kurucusu ölse de kurum kendi geliriyle yaşamaya devam eder.',
      ),
      kart(
        'Ticaret ve kervansaray',
        'Selçuklular yol boyunca kervansaray kurdu; yolcular üç gün ücretsiz konaklardı.',
      ),
      kart(
        'Tarım ve hayvancılık',
        'Ekonominin temeliydi. İkta sistemi toprağın boş kalmamasını da güvence altına alıyordu.',
      ),
    ], [
      soru('Ahilik, esnaf ve zanaatkârları bir araya getiren bir teşkilattır.', true, 'Hem meslek eğitimi hem ahlak eğitimi veriyordu.'),
      soru('Vakıflar, gelir getiren mülkleriyle kendi giderlerini karşıladığı için kalıcı olabilmiştir.', true, 'Han ve hamam gelirleri vakfın hizmetlerini ayakta tutuyordu.'),
      soru('Ahilikte kalitesiz mal üreten esnafa herhangi bir yaptırım uygulanmazdı.', false, 'Meslekten çıkarmaya kadar giden yaptırımlar vardı.'),
      soru('Kervansaraylar yalnızca askerî amaçla kullanılırdı.', false, 'Tüccarların konakladığı, yol güvenliğini sağlayan yapılardı.'),
    ]),
    konu('trh10-turk-islam', 'Türk-İslam Medeniyetinde Bilim, Kültür ve Sanat', [
      kart(
        'Medreseler',
        'Nizamülmülk’ün kurduğu Nizamiye medreseleri dönemin en düzenli yükseköğretim kurumlarıydı.',
      ),
      kart(
        'Bilim insanları',
        'Bu adların çalışmaları yalnızca İslam dünyasında değil, çeviriler yoluyla Avrupa’da da okundu.',
        {
          tur: 'tablo',
          basliklar: ['Ad', 'Alan'],
          satirlar: [
            ['Ömer Hayyam', 'Takvim, cebir'],
            ['Harezmî', 'Cebir'],
            ['İbn Sina', 'Tıp'],
            ['Birunî', 'Astronomi'],
          ],
        },
      ),
      kart(
        'Türkçenin yazı dili olması',
        'Kutadgu Bilig ve Divânu Lugâti’t-Türk, Türkçenin bir kültür dili olarak yazıya geçişini gösterir.',
      ),
      kart(
        'Kutadgu Bilig',
        'Yusuf Has Hacib’in eseri; yöneticiye nasıl davranması gerektiğini anlatan bir siyasetname niteliğindedir.',
      ),
      kart(
        'Tasavvuf',
        'Mevlânâ, Yunus Emre ve Hacı Bektaş Veli’nin öğretisi Anadolu’nun kültürel dokusunu biçimlendirdi.',
      ),
      kart(
        'Neden tasavvuf yayıldı?',
        'Sade dille anlatması ve farklı inançlara açık durması, göç ve savaş görmüş bir toplumda geniş karşılık buldu.',
      ),
      kart(
        'Mimari',
        'Kümbet, medrese, kervansaray ve çini süsleme; taş işçiliğinde Anadolu Selçuklu üslubu belirginleşti.',
      ),
    ], [
      soru('Kutadgu Bilig, Yusuf Has Hacip tarafından yazılmıştır.', true, 'Türkçe yazılmış ilk siyasetname sayılıyor.'),
      soru('Karahanlılar döneminde Türkçe yazı dili olarak kullanılmıştır.', true, 'Bu dönemin eserleri Türkçenin yazılı mirasının temeli.'),
      soru('Medreselerde yalnızca dinî ilimler okutulurdu.', false, 'Matematik, astronomi ve tıp da okutuluyordu.'),
      soru('Tasavvufun Anadolu nun Türkleşmesinde bir etkisi olmamıştır.', false, 'Tekke ve zaviyeler hem iskânda hem kültürel kaynaşmada rol oynadı.'),
    ]),
  ]),
  tema('trh10-t2', 'Beylikten Devlete Osmanlı (1299-1453)', [
    konu('trh10-kurulus', 'Osmanlı Devleti’nin Kuruluşuna Dair Görüşler', [
      kart(
        'Gaza ve cihat görüşü',
        'Osmanlı’yı uç bölgesindeki gaza ruhunun büyüttüğünü savunur. Sınır boyu savaşçıları devlete katıldı.',
      ),
      kart(
        'Aşiret görüşü',
        'Kayı boyuna dayanan aşiret yapısının çekirdek olduğunu ileri sürer.',
      ),
      kart(
        'Ahilik ve tasavvuf etkisi',
        'Ahi teşkilatının ve dervişlerin örgütleyici rolüne dikkat çeker.',
      ),
      kart(
        'Dört görüş yan yana',
        'Görüşler birbirini dışlamıyor; her biri sürecin farklı bir yanını öne çıkarıyor.',
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
      ),
      kart(
        'Coğrafi konum',
        'Bizans sınırında, Balkanlara açılan bir uçta olması Osmanlı’ya büyüme alanı verdi.',
      ),
      kart(
        'Neden farklı görüşler?',
        'Kuruluş dönemine ait yazılı kaynak çok az; ilk kronikler olaylardan yaklaşık yüz yıl sonra yazıldı.',
      ),
      kart(
        'Öteki beylikler neden büyümedi?',
        'Çoğu Anadolu’nun içinde ve komşuları da Türk beylikleriydi; Osmanlı ise genişleyebileceği bir sınırda duruyordu.',
      ),
    ], [
      soru('Osmanlı nın kuruluşuyla ilgili tek bir görüş üzerinde uzlaşılmıştır.', false, 'Gaza, aşiret ve tasavvuf temelli birden çok görüş yan yana duruyor.'),
      soru('Gaza ve cihat görüşü, beyliğin sınır boyundaki konumunu öne çıkarır.', true, 'Uç beyliği olmak sürekli bir hareket alanı sağlıyordu.'),
      soru('Osmanlı Beyliği nin Bizans sınırında bulunması büyümesini kolaylaştırmıştır.', true, 'Genişleyeceği yönde başka bir Türk beyliği yoktu.'),
      soru('Anadolu daki öteki beylikler de Osmanlı ile aynı sınır konumuna sahipti.', false, 'Çoğu Anadolu içindeydi; genişleyecekleri yönde başka Türk beylikleri vardı.'),
    ]),
    konu('trh10-anadolu-rumeli', 'Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Rumeli’ye geçiş',
        'Çimpe Kalesi’nin alınmasıyla (1353) Osmanlı Balkanlara ayak bastı; genişleme buradan hızlandı.',
      ),
      kart(
        'Balkan zaferleri',
        'Sırpsındığı, I. Kosova ve Niğbolu ile Balkanlardaki Osmanlı varlığı kalıcılaştı.',
      ),
      kart(
        'Anadolu Türk birliği',
        'Beylikler savaş, satın alma ve evlilik yoluyla Osmanlı’ya katıldı; amaç Anadolu’da tek otoriteydi.',
      ),
      kart(
        'Ankara Savaşı (1402)',
        'Timur karşısında alınan yenilgi devleti dağıttı; Anadolu birliği bozuldu.',
      ),
      kart(
        'Fetret Devri',
        'Şehzadeler arasındaki on bir yıllık taht mücadelesi. Devlet Balkanlardaki düzen sayesinde ayakta kaldı.',
      ),
      kart(
        'Neden Balkanlar tutundu?',
        'İskân ve istimalet politikası yerel halkı yabancılaştırmamıştı; merkez dağılırken bile bölge elden çıkmadı.',
      ),
      kart(
        'İstanbul’un Fethi (1453)',
        'Orta Çağ kapandı. Osmanlı toprak bütünlüğünü sağladı ve imparatorluğa dönüştü.',
      ),
      kart(
        'Fethin sonuçları',
        'Boğazlar tek elde toplandı, Bizans sona erdi, Avrupa’ya giden bilginler Rönesans’a katkı sundu.',
      ),
    ], [
      soru('Ankara Savaşı ndan sonra Osmanlı Devleti Fetret Devri ne girmiştir.', true, 'Şehzadeler arasındaki mücadele yaklaşık on bir yıl sürdü.'),
      soru('İstanbul un fethi Orta Çağ ın sonu kabul edilir.', true, 'Surların top ateşiyle yıkılması çağ değiştiren bir gelişme sayılıyor.'),
      soru('Fetret Devri nde Balkanlardaki topraklar tümüyle kaybedilmiştir.', false, 'İskân ve istimalet politikaları sayesinde Balkanlardaki düzen ayakta kaldı.'),
      soru('Osmanlı, Rumeli ye Ankara Savaşı ndan sonra geçmiştir.', false, 'Rumeli ye geçiş 14. yüzyıl ortasında, Ankara Savaşı ndan çok önce oldu.'),
    ]),
    konu('trh10-devletlesme', 'Devletleşme Süreci: Ordu, Hukuk ve Toprak', [
      kart(
        'Tımar sistemi',
        'Toprağın vergi geliri sipahiye bırakıldı; sipahi hem üretimi denetledi hem asker yetiştirdi.',
      ),
      kart(
        'Toprak kimin?',
        'Miri arazide mülkiyet devletindir; köylüye yalnızca işleme hakkı verilir. Boş bırakılan toprak geri alınır.',
      ),
      kart(
        'Devşirme ve yeniçeri',
        'Devşirilen çocuklar eğitilerek kapıkulu ordusuna alındı; merkeze bağlı sürekli bir ordu doğdu.',
      ),
      kart(
        'İki ordu, iki kaynak',
        'Kapıkulu maaşlı ve merkeze bağlıydı; eyalet askeri toprak gelirinden geçinir ve taşrada dururdu.',
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
        'Örfi hukuk',
        'Şer’i hukukun yanında padişahın koyduğu kanunlar. Kanunnameler devlet düzenini yazılı hâle getirdi.',
      ),
      kart(
        'Divan-ı Hümayun',
        'Devletin en yüksek karar organı. Her tebaanın şikâyetini götürebildiği bir merci sayılırdı.',
      ),
      kart(
        'Üçü birbirini besledi',
        'Toprak düzeni orduyu, ordu güvenliği, güvenlik de üretimi ayakta tuttu. Biri bozulunca hepsi sarsıldı.',
      ),
    ], [
      soru('Tımar sisteminde toprağın mülkiyeti devlete aittir.', true, 'Sipahiye bırakılan şey toprağın vergi geliri.'),
      soru('Devşirme sistemiyle alınan çocuklar eğitilerek devlet hizmetine alınırdı.', true, 'Kimileri yeniçeri oldu, kimileri saray görevlerine yükseldi.'),
      soru('Tımarlı sipahiler maaşlarını hazineden nakit olarak alırdı.', false, 'Geçimlerini kendilerine bırakılan toprağın gelirinden sağlıyorlardı.'),
      soru('Divan-ı Hümayun un kararları padişahın onayına sunulmazdı.', false, 'Son söz padişahındı; divan kararları onun onayıyla yürürlüğe giriyordu.'),
    ]),
    konu('trh10-kalicilik', 'Fethettiği Topraklarda Kalıcı Olma Politikaları', [
      kart(
        'İskân politikası',
        'Fethedilen bölgelere Anadolu’dan nüfus yerleştirildi; bölge hem şenlendirildi hem güvenceye alındı.',
      ),
      kart(
        'Kimler yerleştirildi?',
        'Konargöçerler, kalabalık aileler ve huzursuzluk çıkaran gruplar tercih edilirdi; böylece iki sorun birden çözülürdü.',
      ),
      kart(
        'İstimalet',
        'Yerli halka hoşgörülü davranma siyaseti: can, mal ve inanç güvenliği verildi, vergi yükü hafifletildi.',
      ),
      kart(
        'Mevcut düzeni koruma',
        'Yerel vergi ve toprak düzeni çoğu zaman korundu; ani değişiklik direnç üretiyordu.',
      ),
      kart(
        'İmar faaliyetleri',
        'Cami, han, hamam ve köprü ile şehirler yeniden canlandırıldı; bunlar aynı zamanda kalıcılığın işaretiydi.',
      ),
      kart(
        'Millet sistemi',
        'Gayrimüslim topluluklar kendi dinî liderleri altında iç işlerinde serbestti; bu, uzun süreli bir arada yaşamayı kolaylaştırdı.',
      ),
      kart(
        'Neden işe yaradı?',
        'Bizans yönetiminde ağır vergi altındaki köylü için Osmanlı düzeni çoğu zaman daha katlanılırdı.',
      ),
    ], [
      soru('İstimalet, fethedilen yerdeki halka hoşgörüyle yaklaşma politikasıdır.', true, 'Vergi kolaylıkları ve inanç serbestliği bunun parçasıydı.'),
      soru('İskân politikasıyla Anadolu dan Rumeli ye nüfus yerleştirilmiştir.', true, 'Konargöçerler ve dervişler bu iskânda öne çıkıyordu.'),
      soru('Fethedilen yerlerdeki bütün yerel düzenler hemen kaldırılırdı.', false, 'Uygun görülen vergi ve toprak uygulamaları bir süre korunuyordu.'),
      soru('Millet sistemi, gayrimüslimlerin kendi hukukî işlerini yürütmesine izin vermezdi.', false, 'Cemaatler kendi inanç ve hukuk işlerinde serbestti.'),
    ]),
    konu('trh10-ilim-irfan', 'İlim ve İrfan Geleneğinin Oluşması', [
      kart(
        'İlk medrese',
        'İznik’te açıldı (1331). Devletin ihtiyaç duyduğu kadı ve müderrisler burada yetişti.',
      ),
      kart(
        'Külliye',
        'Cami çevresinde medrese, imaret, hamam ve şifahaneden oluşan yapı topluluğu; şehrin çekirdeğiydi.',
      ),
      kart(
        'Külliye ne işe yarardı?',
        'Eğitim, sağlık, ibadet ve yemek tek bir vakfın geliriyle yürürdü. Yeni fethedilen şehir böyle canlandırılırdı.',
      ),
      kart(
        'Öne çıkan adlar',
        'Molla Fenari ilk şeyhülislam, Davud-i Kayseri ilk medresenin başmüderrisi olarak anılır.',
      ),
      kart(
        'Tekke ve zaviyeler',
        'Dervişler uç bölgelerde hem yol güvenliği hem yerleşim sağladı; kültürel kaynaşmanın merkezleriydi.',
      ),
      kart(
        'Mekân ve kişi',
        'Gelenek yalnızca kitapla değil, o kitabın okutulduğu mekân ve onu okutan kişiyle sürüyordu.',
      ),
    ], [
      soru('Külliye, cami çevresinde toplanan yapıların oluşturduğu bir yapı topluluğudur.', true, 'Medrese, imaret ve hamam da bu topluluğun parçası.'),
      soru('Tekke ve zaviyeler yalnızca ibadet için kullanılan yapılardı.', false, 'Konaklama, iskân ve eğitim gibi işlevleri de vardı.'),
      soru('İlk Osmanlı medresesi İznik te kurulmuştur.', true, 'Orhan Bey döneminde açıldı.'),
      soru('Külliyeler yalnızca eğitim veren yapılar olduğu için halkın günlük hayatına dokunmazdı.', false, 'İmaretiyle, hamamıyla, çarşısıyla mahallenin merkezini oluşturuyorlardı.'),
    ]),
  ]),
  tema('trh10-t3', 'Cihan Devleti Osmanlı (1453-1683)', [
    konu('trh10-siyasi', '1453-1683 Arasındaki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Doğuda',
        'Çaldıran (1514) ile Safeviler durduruldu; Ridaniye (1517) ile Memlük toprakları alındı ve halifelik geçti.',
      ),
      kart(
        'Batıda',
        'Mohaç (1526) ile Macaristan, Preveze (1538) ile Akdeniz’de üstünlük kazanıldı.',
      ),
      kart(
        'İki yüzyılın çizgisi',
        'Zirveye çıkış ve duraklama arasındaki dönüm noktaları birkaç tarihte toplanır.',
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
      ),
      kart(
        'En geniş sınırlar',
        'Kanuni döneminde devlet üç kıtaya yayıldı; Akdeniz bir Osmanlı denizi hâline geldi.',
      ),
      kart(
        'Cihanşümul iddia',
        'Fatih ve Kanuni dönemlerinde padişah kendini yalnızca bir bölgenin değil, dünyanın hükümdarı olarak konumlandırdı.',
      ),
      kart(
        'Dönüm noktaları',
        'İnebahtı (1571) donanmanın yenildiği ilk büyük çarpışma; II. Viyana Kuşatması (1683) batıya ilerleyişin sonu.',
      ),
      kart(
        'Uzun savaşlar',
        'İran ve Avusturya ile yıllarca süren savaşlar hazineyi ve tımar düzenini yıprattı.',
      ),
      kart(
        'Koloni yarışının dışında',
        'Avrupa okyanus ötesinde koloniler kurarken Osmanlı kara imparatorluğu olarak kaldı; gelir kaynakları çeşitlenmedi.',
      ),
    ], [
      soru('Osmanlı Devleti en geniş sınırlarına 17. yüzyılda ulaşmıştır.', true, 'Bu yüzyıldan sonra topraklar genişlemek yerine korunmaya çalışıldı.'),
      soru('Uzun süren savaşlar hazineyi zorlamıştır.', true, 'Sürekli asker beslemek gider yükünü büyütüyordu.'),
      soru('Osmanlı, Avrupa devletleriyle birlikte okyanus ötesi koloni yarışına girmiştir.', false, 'Osmanlı bu yarışın dışında kaldı; genişlemesi kara üzerinden sürdü.'),
      soru('1683 teki II. Viyana Kuşatması Osmanlı için zaferle sonuçlanmıştır.', false, 'Kuşatma bozgunla bitti ve uzun savaşlar dönemini başlattı.'),
    ]),
    konu('trh10-yonetim-degisim', 'Yönetim ve Ordu Yapısındaki Değişim', [
      kart(
        'Sancağa çıkma kalktı',
        'Şehzadelerin taşrada yönetim öğrenmesi son buldu; yerine kafes usulü geldi ve deneyimsiz padişahlar arttı.',
      ),
      kart(
        'Ekber ve erşed',
        'Tahta hanedanın en yaşlı ve olgun üyesinin geçmesi kuralı; kardeş katlinin yerini aldı.',
      ),
      kart(
        'Tımarın çözülmesi',
        'Ateşli silahlar öne çıkınca sipahi önemini yitirdi; tımarlar iltizama döndü ve köylünün yükü arttı.',
      ),
      kart(
        'İltizam nedir?',
        'Verginin toplanma hakkı peşin parayla satılırdı. Mültezim yatırdığından fazlasını almak istediği için köylü ezildi.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Tımar', alt: 'sipahi asker besler' },
            { ad: 'İltizam', alt: 'vergi satılır' },
            { ad: 'Köylü yükü artar', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Yeniçerinin bozulması',
        'Devşirme kuralı gevşedi, sayı arttı, disiplin düştü. Yeniçeriler siyasete karışan bir güce dönüştü.',
      ),
      kart(
        'Sadrazamların ağırlığı',
        'Padişahlar geri çekilince yönetim sadrazamlara kaydı; Köprülüler dönemi bunun en belirgin örneğidir.',
      ),
      kart(
        'Islahat girişimleri',
        'Kuyucu Murat Paşa, II. Osman ve IV. Murat düzeni zorla toparlamaya çalıştı; çabalar kalıcı bir kurum bırakmadı.',
      ),
      kart(
        'Neden ıslahatlar tutmadı?',
        'Girişimler eski düzeni onarmayı hedefliyordu; sorunun kaynağı olan yapının kendisi tartışılmıyordu.',
      ),
    ], [
      soru('Ekber ve erşed sistemiyle tahta hanedanın en yaşlı ve olgun üyesi geçmeye başlamıştır.', true, 'Taht kavgalarını azaltmak için getirildi.'),
      soru('İltizam usulünde vergi toplama hakkı açık artırmayla kişilere devredilirdi.', true, 'Devlet peşin gelir elde ediyor, halk daha ağır vergiyle karşılaşıyordu.'),
      soru('Tımar sisteminin bozulması ordunun güçlenmesini sağlamıştır.', false, 'Tersine, tımarlı sipahi sayısı azaldı ve ordunun gücü zayıfladı.'),
      soru('Islahatlar toplumun her alanını kapsadığı için kalıcı sonuçlar vermiştir.', false, 'Çoğu askerî alanla sınırlı kaldı ve köklü olmadığı için kalıcı olmadı.'),
    ]),
    konu('trh10-somurge', 'Avrupa’nın Sömürgeci Politikalarının Etkileri', [
      kart(
        'Coğrafi keşifler',
        'Yeni deniz yolları bulununca ticaret okyanuslara kaydı; İpek ve Baharat yolları önemini yitirdi.',
      ),
      kart(
        'Sömürgecilik nedir?',
        'Bir devletin uzak toprakları ele geçirip kaynaklarını kendi ekonomisine aktarması. Avrupa zenginliğinin bir kaynağı budur.',
      ),
      kart(
        'Gümrük geliri düştü',
        'Osmanlı’nın transit ticaretten aldığı pay azaldı. Hazinenin en güvenilir gelirlerinden biri zayıfladı.',
      ),
      kart(
        'Fiyat devrimi',
        'Amerika’dan gelen gümüş Avrupa’ya, oradan Osmanlı’ya aktı; para değer kaybetti ve enflasyon yükseldi.',
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
      ),
      kart(
        'Kapitülasyonlar',
        'Başlangıçta ticareti canlandırmak için verilen ayrıcalıklar, zamanla yerli üreticiyi zorlayan bir yüke dönüştü.',
      ),
      kart(
        'Sanayi dengesi',
        'Avrupa ucuz ve bol mal üretmeye başlayınca Osmanlı loncaları rekabette geriledi.',
      ),
      kart(
        'Neden lonca yetişemedi?',
        'Lonca kaliteyi ve fiyatı denetleyip üretimi sınırlıyordu; bu düzen az ve iyi üretmek için kurulmuştu, çok üretmek için değil.',
      ),
    ], [
      soru(
        'Şemadaki fiyat devrimi, Osmanlı da sabit gelirli kesimi zenginleştirmiştir.',
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
      soru('Ticaret yollarının yön değiştirmesi Osmanlı nın gümrük gelirlerini azaltmıştır.', true, 'Kervan yollarının yerini okyanus yolları aldı.'),
      soru('Kapitülasyonlar başlangıçta Osmanlı nın kendi isteğiyle verdiği ayrıcalıklardı.', true, 'Sonradan sürekli hâle gelip ekonomiyi zorlayan bir yüke dönüştü.'),
      soru('Lonca düzeni, Avrupa daki fabrika üretimiyle rekabet edebilmiştir.', false, 'Ucuz ve seri üretilen mallar karşısında lonca üretimi yetişemedi.'),
    ]),
    konu('trh10-isyan', 'Önemli İsyanların Neden ve Sonuçları', [
      kart(
        'Celali isyanları',
        'Anadolu’da ağır vergi, iltizam baskısı ve işsiz sekbanlar yüzünden çıktı. Köyler boşaldı, üretim düştü.',
      ),
      kart(
        'Büyük kaçgun',
        'Celali baskısından kaçan köylülerin toprağı bırakıp şehirlere göç etmesi; tarımsal üretim uzun süre toparlanamadı.',
      ),
      kart(
        'İstanbul isyanları',
        'Yeniçeri ve kapıkulu ayaklanmaları; ulufe ve cülus talepleriyle çıkıp padişah değiştirecek güce ulaştı.',
      ),
      kart(
        'Eyalet isyanları',
        'Merkezden uzak valilerin ayaklanması. Otoritenin zayıfladığı yerlerde yerel güçler öne çıktı.',
      ),
      kart(
        'Üç isyan, üç kaynak',
        'Üçünün de çıktığı yer farklı ama arkalarındaki mali bozulma aynı.',
        {
          tur: 'tablo',
          basliklar: ['İsyan', 'Kim?'],
          satirlar: [
            ['Celali', 'Anadolu halkı'],
            ['İstanbul', 'Kapıkulu'],
            ['Eyalet', 'Valiler'],
          ],
        },
      ),
      kart(
        'Ortak sebep',
        'Uzun savaşlar, bozulan para, artan vergi ve tımar düzeninin çöküşü. İsyanlar sebep değil sonuçtu.',
      ),
      kart(
        'Sonuçları',
        'Can ve mal kaybı, göç, tarımsal üretimde düşüş ve merkezî otoritenin daha da zayıflaması.',
      ),
    ], [
      soru('Celali isyanları Anadolu da tarımsal üretimin azalmasına yol açmıştır.', true, 'Köylü toprağını bırakıp göç etti.'),
      soru('Büyük kaçgun, köylülerin topraklarını bırakıp göç etmesidir.', true, 'Vergi baskısı ve güvensizlik bunun sebebiydi.'),
      soru('İstanbul isyanlarının kaynağı taşradaki köylülerdi.', false, 'Kaynağı kapıkulu askerleri ve saray çevresiydi.'),
      soru('İsyanların devletin vergi düzeni üzerinde bir etkisi olmamıştır.', false, 'Üretim düşünce vergi geliri de azaldı ve yeni vergiler kondu.'),
    ]),
    konu('trh10-bilim-kultur', '1453-1683 Arasında Bilim, Kültür ve Sanat', [
      kart(
        'Sahn-ı Seman',
        'Fatih’in kurduğu sekiz medrese, dönemin en üst düzey eğitim kurumuydu.',
      ),
      kart(
        'Coğrafya ve denizcilik',
        'Piri Reis’in haritası ve Kitab-ı Bahriye’si, Osmanlı denizcilik bilgisinin düzeyini gösterir.',
      ),
      kart(
        'Rasathane',
        'Takiyüddin’in İstanbul’da kurduğu rasathane dönemin ileri gözlem merkezlerindendi; kısa süre sonra kapatıldı.',
      ),
      kart(
        'Tarih ve düşünce',
        'Kâtip Çelebi hem coğrafya hem bibliyografya alanında yazdı; devletin sorunlarını da eleştirel biçimde ele aldı.',
      ),
      kart(
        'Mimar Sinan',
        'Şehzade, Süleymaniye ve Selimiye ile Osmanlı klasik mimarisinin doruğunu kurdu.',
      ),
      kart(
        'Sinan’ın üç dönemi',
        'Kendisi Şehzade’yi çıraklık, Süleymaniye’yi kalfalık, Selimiye’yi ustalık eseri saymıştır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Şehzade', alt: 'çıraklık' },
            { ad: 'Süleymaniye', alt: 'kalfalık' },
            { ad: 'Selimiye', alt: 'ustalık' },
          ],
        },
      ),
      kart(
        'Edebiyat ve sanat',
        'Divan edebiyatında Fuzuli ve Baki; minyatür, hat ve çini kendi ekollerini oluşturdu.',
      ),
      kart(
        'Matbaanın gecikmesi',
        'Basılı kitaba geçiş Osmanlı’da geç oldu; bilgi çoğaltma hızındaki bu fark, Avrupa ile arayı açan etkenlerden biri sayılır.',
      ),
    ], [
      soru('Sahn-ı Seman medreseleri Fatih döneminde kurulmuştur.', true, 'Dönemin en üst düzey eğitim kurumlarıydı.'),
      soru('Piri Reis in haritaları dönemin denizcilik bilgisini yansıtır.', true, 'Kitab-ı Bahriye kıyı bilgilerini toplayan bir eser.'),
      soru('İstanbul Rasathanesi kurulduktan sonra uzun yıllar çalışmalarını sürdürmüştür.', false, 'Kuruluşundan kısa süre sonra yıktırıldı.'),
      soru('Matbaa Osmanlı da Avrupa ile aynı dönemde yaygınlaşmıştır.', false, 'Türkçe basım yaklaşık iki yüzyıl sonra başladı.'),
    ]),
  ]),
])
