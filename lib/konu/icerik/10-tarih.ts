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
        'Dandanakan (1040)',
        'Selçuklular Gaznelileri yendi.\n- Büyük Selçuklu Devleti kuruldu.\n- Türklerin batıya yönelişi hızlandı.',
      ),
      kart(
        'Malazgirt (1071)',
        'Alparslan Bizans ordusunu yendi.\nAnadolu Türk yerleşimine açıldı; kapı bir daha kapanmadı.',
      ),
      kart(
        'Dönemin çizgisi',
        'Anadolu’nun Türkleşmesi tek bir savaşla olmadı.\nİki yüzyıla yayılan bir dizi dönüm noktasıyla oldu.',
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
        { not: '1071 Malazgirt kapıyı açtı, 1176 Miryokefalon Bizans\'ın umudunu bitirdi, 1243 Kösedağ beylikleri doğurdu.' },
      ),
      kart(
        'Miryokefalon (1176)',
        'Bizans’ın Anadolu’yu geri alma umudu bitti.\nAnadolu’nun Türk yurdu olduğu kabul edildi.',
      ),
      kart(
        'Haçlı Seferleri',
        'Anadolu ve Suriye üzerinden gelen seferler Türk devletlerini zorladı.\nSonuçta doğu ile batı arasındaki temas arttı.',
      ),
      kart(
        'Haçlıların sonuçları',
        '- Avrupa kâğıt, pusula ve barutla tanıştı.\n- Doğu Akdeniz ticareti canlandı.\n- İtalyan şehirleri zenginleşti.',
      ),
      kart(
        'Kösedağ (1243)',
        'Moğollar Türkiye Selçuklularını yendi.\nMerkezî otorite çöktü, beylikler dönemi başladı.',
      ),
      kart(
        'Neden Anadolu?',
        '- Otlakları bol, iklimi elverişliydi.\n- Bizans sınırı gevşekti.\nGöç eden boylar için hem geçim hem güvenlik alanıydı.',
      ),
      kart(
        'Pasinler (1048)',
        'Selçuklular ile Bizans arasındaki ilk büyük savaştır.\nSelçuklular kazandı; Anadolu’ya akınlar yoğunlaştı.',
      ),
      kart(
        'İlk Türk beylikleri',
        '- **Danişmentliler:** Sivas, Tokat\n- **Saltuklular:** Erzurum\n- **Mengücekliler:** Erzincan, Divriği\n- **Artuklular:** Diyarbakır, Mardin\n- **Çaka Beyliği:** İzmir; ilk Türk donanması',
      ),
      kart(
        'Türkiye Selçukluları',
        'Süleyman Şah tarafından kuruldu; ilk başkent İznik’ti.\nI. Haçlı Seferi’nden sonra başkent Konya’ya taşındı.',
      ),
      kart(
        'En parlak dönem',
        'I. Alaaddin Keykubat döneminde (1220-1237) devlet en güçlü hâline ulaştı.\nAlanya ve Suğdak alındı, Kubadabad Sarayı yapıldı.',
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
      sikli('Dandanakan Savaşı\'nın sonucu nedir?', ['Beylikler dönemi başladı', 'Büyük Selçuklu Devleti kuruldu'], 1, 'Beylikler dönemini 1243 Kösedağ başlattı.'),
      sikli('Haçlı Seferleri\'nden en çok hangi şehirler zenginleşti?', ['İskandinav şehirleri', 'İtalyan şehirleri'], 1, 'Doğu Akdeniz ticareti canlandı; Venedik ve Cenova kazandı.'),
      sikli('Haçlı Seferleri\'nden Avrupa neyle tanıştı?', ['Kâğıt, pusula, barut', 'Demir işçiliği'], 0, 'Doğu Akdeniz ticareti canlandı.'),
      sikli('Göç eden boylar Anadolu\'yu neden seçti?', ['Otlak, iklim ve gevşek sınır', 'Deniz ticareti'], 0, 'Geçim ve güvenlik alanı.'),
      soru('Anadolu tek bir savaşla Türkleşti.', false, 'İki yüzyıla yayılan dönüm noktaları.'),
      soru('Pasinler Savaşı Selçuklular ile Bizans arasındaki ilk büyük savaştır.', true, '1048.'),
      soru('Türkiye Selçuklularının ilk başkenti Konya\'dır.', false, 'İlk başkent İznik; Konya sonra.'),
      soru('Çaka Bey ilk Türk donanmasını kurdu.', true, 'İzmir merkezli.'),
      sikli('Türkiye Selçuklularının en parlak dönemi?', ['II. Kılıçarslan', 'I. Alaaddin Keykubat'], 1, 'Kılıçarslan Miryokefalon\'u kazandı.'),
      sikli('Artukluların merkezi?', ['Diyarbakır-Mardin', 'Sivas-Tokat'], 0, 'Sivas-Tokat Danişmentliler.'),
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
      {
        soru: 'İlk Türk donanmasını kuran beylik?',
        siklar: ['Saltuklular', 'Çaka Beyliği'],
        dogru: 1,
        aciklama: {
          dogru: 'Çaka Bey İzmir\'de donanma kurdu.',
          yanlis: 'Saltuklular Erzurum\'daydı, denize çıkmadı. Donanma Çaka Bey\'in.',
        },
        kart: 10,
      },
    ]),
    konu('trh10-teskilat', 'Türk Devlet ve Ordu Teşkilatındaki Değişim', [
      kart(
        'Bozkırdan devlete',
        'Boy birliğine dayalı yapı, İslam ve İran devlet geleneğiyle birleşti.\nSonuç merkezî bir bürokrasi oldu.',
      ),
      kart(
        'Divan teşkilatı',
        '**Büyük Divan** yönetimin merkeziydi.\nMaliye, yazışma ve ordu işleri ayrı divanlara bölündü.',
      ),
      kart(
        'İkta sistemi',
        'Toprağın geliri, hizmet karşılığı komutan ve askerlere verildi.\nHazineden para çıkmadan ordu beslendi.',
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
        '- Ordu beslendi.\n- Toprak boş kalmadı.\n- Taşrada düzen sağlandı.',
        undefined,
        { not: 'İkta: hazineden maaş çıkmadan ordu, toprağın işlenmesi, taşrada güvenlik. Osmanlı\'daki adı tımar.' },
      ),
      kart(
        'Ordu unsurları',
        '- Gulam askerleri\n- İkta askerleri\n- Boy kuvvetleri\nFarklı kaynaklar orduyu hem büyütüyor hem çeşitlendiriyordu.',
      ),
      kart(
        'Ülke hanedanın malı',
        'Eski Türk anlayışında ülke hanedanın ortak malıydı.\nBu anlayış taht kavgalarının ve bölünmenin kaynağıydı.',
      ),
      kart(
        'Atabeylik',
        'Şehzadelerin yanına deneyimli bir devlet adamı verilirdi.\nMerkez zayıflayınca bu atabeyler kendi devletlerini kurdu.',
      ),
      kart(
        'Selçuklu divanları',
        '- **Divan-ı İstifa:** maliye\n- **Divan-ı Tuğra:** yazışma\n- **Divan-ı Arz:** ordu işleri\n- **Divan-ı İşraf:** denetim\nHepsi Büyük Divan’a bağlıydı.',
      ),
      kart(
        'Nizamülmülk',
        'Alparslan ve Melikşah’ın veziriydi.\nNizamiye medreselerini kurdu, Siyasetname’de devlet yönetimini anlattı.',
      ),
      kart(
        'Gulam sistemi',
        'Küçük yaşta alınan çocuklar sarayda eğitilip asker ve yönetici yapılırdı.\nBoylara değil yalnız hükümdara bağlıydılar; Osmanlı devşirmesinin öncüsüdür.',
      ),
    ], [
      soru('İkta sisteminde toprağın mülkiyeti devlette kalır.', true, 'Verilen şey mülk değil, toprağın geliri.'),
      soru('Divan, devlet işlerinin görüşüldüğü kuruldur.', true, 'Hükümdar başkanlığında toplanıyordu.'),
      soru('İkta sisteminde askerlerin maaşı hazineden nakit olarak ödenirdi.', false, 'İkta tam da bunu ortadan kaldırıyor: asker toprağın gelirinden geçiniyordu.'),
      soru('Türk devletlerinde ülke, hükümdarın kişisel mülkü sayılırdı.', false, 'Hanedanın ortak malı sayılıyordu; bu anlayış taht kavgalarına yol açtı.'),
      sikli('Şehzadelerin yanına verilen deneyimli devlet adamı?', ['Gulam', 'Atabey'], 1, 'Merkez zayıflayınca kendi devletlerini kurdular.'),
      sikli('İktanın Osmanlı\'daki karşılığı nedir?', ['Tımar', 'İltizam'], 0, 'İltizam vergi toplama hakkının satılması.'),
      sikli('Saraya bağlı, maaşlı, köle kökenli askerlere ne denir?', ['Gulam', 'Sipahi'], 0, 'Gulamlar ordunun merkeze bağlı çekirdeğiydi.'),
      soru('Boy birliği yapısı İslam ve İran geleneğiyle merkezî bürokrasiye dönüştü.', true, 'Bozkırdan devlete.'),
      soru('Selçuklularda maliye işlerine Divan-ı İstifa bakardı.', true, 'Gelir ve giderler.'),
      soru('Siyasetname\'yi Alparslan yazdı.', false, 'Veziri Nizamülmülk yazdı.'),
      soru('Gulamlar yalnız hükümdara bağlıydı.', true, 'Boy bağı yoktu.'),
      sikli('Ordu işlerine bakan Selçuklu divanı?', ['Divan-ı Tuğra', 'Divan-ı Arz'], 1, 'Tuğra yazışmaları yürütür.'),
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
        'Yerleşiklik arttı',
        'Anadolu’ya gelen Türkler zamanla köy ve şehirlere yerleşti.\nKonargöçerlik azaldı ama tümüyle bitmedi.',
      ),
      kart(
        'Ahilik',
        'Esnaf ve zanaatkârların birliğidir.\nBirlikte yürüttüğü işler: kalite denetimi, fiyat düzeni, mesleki eğitim',
      ),
      kart(
        'Ahiliğin işleyişi',
        'Çırak → kalfa → usta basamakları hem mesleği hem ahlakı kapsardı.\nKötü mal üreten esnaf birlikten atılırdı.',
      ),
      kart(
        'Vakıf sistemi',
        'Hayır kurumlarını finanse eden yapıdır.\nCami, medrese, imaret, hastane ve köprüler vakıflarla yaşadı.',
      ),
      kart(
        'Vakıf neden kalıcı?',
        'Gelir getiren bir mülk, süresiz olarak bir hizmete bağlanır.\nKurucusu ölse de kurum kendi geliriyle yaşamaya devam eder.',
        undefined,
        { not: 'Bir han vakfedilir, kirası medreseyi besler; kurucu ölse de kira gelir, medrese açık kalır.' },
      ),
      kart(
        'Ticaret ve kervansaray',
        'Selçuklular yol boyunca kervansaraylar kurdu.\nYolcular üç gün ücretsiz konaklardı.',
      ),
      kart(
        'Tarım ve hayvancılık',
        'Ekonominin temeliydi.\nİkta sistemi toprağın boş kalmamasını da güvenceye alıyordu.',
      ),
      kart(
        'Darüşşifalar',
        'Selçuklular hastaneler kurdu; en eskilerinden biri Kayseri’deki Gevher Nesibe Darüşşifası’dır (1206).\nTedavi ile birlikte tıp eğitimi de verilirdi.',
      ),
      kart(
        'Bacıyan-ı Rum',
        'Anadolu’da kadınların kurduğu teşkilattır; Fatma Bacı ile anılır.\nDokumacılık gibi zanaatlarla ekonomiye katıldılar.',
      ),
      kart(
        'Devlet güvenceli ticaret',
        'Selçuklu topraklarında malı yağmalanan tüccarın zararı devlet hazinesinden ödenirdi.\nBu uygulama devlet sigortasının ilk örneklerinden sayılır.',
      ),
      kart(
        'Toplumun kesimleri',
        '- **Yönetenler:** hanedan, devlet adamları, askerler\n- **Yönetilenler:** şehirliler, köylüler, konargöçerler\nHer kesimin vergi ve hizmet yükü farklıydı.',
      ),
    ], [
      soru('Ahilik, esnaf ve zanaatkârları bir araya getiren bir teşkilattır.', true, 'Hem meslek eğitimi hem ahlak eğitimi veriyordu.'),
      soru('Vakıflar, gelir getiren mülkleriyle kendi giderlerini karşıladığı için kalıcı olabilmiştir.', true, 'Han ve hamam gelirleri vakfın hizmetlerini ayakta tutuyordu.'),
      soru('Ahilikte kalitesiz mal üreten esnafa herhangi bir yaptırım uygulanmazdı.', false, 'Meslekten çıkarmaya kadar giden yaptırımlar vardı.'),
      soru('Kervansaraylar yalnızca askerî amaçla kullanılırdı.', false, 'Tüccarların konakladığı, yol güvenliğini sağlayan yapılardı.'),
      sikli('Kervansarayda yolcular kaç gün ücretsiz konaklardı?', ['Bir', 'Üç'], 1, 'Selçuklu uygulaması.'),
      sikli('Hangisi vakıflarla yaşayan kurumlardandır?', ['Şifahane', 'Divan'], 0, 'Divan devletin yönetim organı; şifahane vakıf geliriyle çalışırdı.'),
      sikli('Ahilikte meslek basamakları hangi sıradadır?', ['Kalfa → çırak → usta', 'Çırak → kalfa → usta'], 1, 'Basamaklar hem mesleği hem ahlakı kapsardı.'),
      soru('Anadolu\'ya gelen Türklerde konargöçerlik tümüyle bitti.', false, 'Azaldı ama bitmedi.'),
      soru('Gevher Nesibe Darüşşifası Kayseri\'dedir.', true, '1206.'),
      soru('Bacıyan-ı Rum erkek esnafın teşkilatıdır.', false, 'Kadınların teşkilatı.'),
      soru('Selçuklular yağmalanan tüccarın zararını hazineden öderdi.', true, 'Devlet sigortasının ilk örneklerinden.'),
      sikli('Bacıyan-ı Rum ile anılan kişi?', ['Fatma Bacı', 'Ahi Evran'], 0, 'Ahi Evran erkek esnaf teşkilatı.'),
      sikli('Darüşşifa ne demektir?', ['Kütüphane', 'Hastane'], 1, 'Şifa evi.'),
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
      {
        soru: 'Anadolu Selçuklularında kadınların teşkilatı?',
        siklar: ['Bacıyan-ı Rum', 'Ahilik'],
        dogru: 0,
        aciklama: {
          dogru: 'Bacıyan-ı Rum, Fatma Bacı ile anılan kadın teşkilatıdır.',
          yanlis: 'Ahilik erkek esnafın teşkilatı. Kadınlarınki Bacıyan-ı Rum.',
        },
        kart: 9,
      },
    ]),
    konu('trh10-turk-islam', 'Türk-İslam Medeniyetinde Bilim, Kültür ve Sanat', [
      kart(
        'Medreseler',
        '**Nizamiye medreseleri** Nizamülmülk tarafından kuruldu.\nDönemin en düzenli yükseköğretim kurumlarıydı.',
      ),
      kart(
        'Bilim insanları',
        'Bu bilginlerin çalışmaları çevirilerle Avrupa’da da okundu.\nTabloda kimin hangi alanda öne çıktığı yazıyor.',
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
        'İki eser, Türkçenin bir kültür dili olarak yazıya geçişini gösterir:\n- Kutadgu Bilig\n- Divânu Lugâti’t-Türk',
      ),
      kart(
        'Kutadgu Bilig',
        '**Yusuf Has Hacib**’in eseridir.\nYöneticiye nasıl davranması gerektiğini anlatan bir siyasetnamedir.',
      ),
      kart(
        'Tasavvuf',
        'Anadolu’nun kültürel dokusunu biçimlendiren üç ad:\n- Mevlânâ\n- Yunus Emre\n- Hacı Bektaş Veli',
      ),
      kart(
        'Neden tasavvuf yayıldı?',
        '- Sade bir dille anlatıyordu.\n- Farklı inançlara açık duruyordu.\nGöç ve savaş görmüş bir toplumda geniş karşılık buldu.',
        undefined,
        { not: 'Yunus Emre Türkçe ve sade söyledi; Moğol istilasından bunalan halk derviş tekkesinde sığınak buldu.' },
      ),
      kart(
        'Mimari',
        '- Kümbet, medrese, kervansaray\n- Çini süsleme ve taş işçiliği\nAnadolu Selçuklu üslubu bu yapılarda belirginleşti.',
      ),
      kart(
        'Ahmet Yesevi',
        'Türkistan’da yaşadı; Divan-ı Hikmet’te İslam’ı sade Türkçeyle anlattı.\nYesevi dervişleri Anadolu’nun İslamlaşmasında rol oynadı.',
      ),
      kart(
        'Mevlânâ ve Yunus Emre',
        '- **Mevlânâ:** Mesnevi’yi Farsça yazdı; Konya’da yaşadı.\n- **Yunus Emre:** şiirlerini sade Türkçeyle söyledi; Türkçenin şiir dili oluşunda önemlidir.',
      ),
      kart(
        'Mimariden örnekler',
        '- **Divriği Ulu Camii ve Darüşşifası:** UNESCO Dünya Mirası\n- **Sultanhanı:** büyük kervansaray\n- **Karatay Medresesi:** çini süsleme\n- **Döner Kümbet:** Kayseri',
      ),
      kart(
        'Kümbet',
        'Önemli kişiler için yapılan anıt mezardır.\nBiçimi, göçebe dönemin çadırını taşa aktarır.',
      ),
    ], [
      soru('Kutadgu Bilig, Yusuf Has Hacip tarafından yazılmıştır.', true, 'Türkçe yazılmış ilk siyasetname sayılıyor.'),
      soru('Karahanlılar döneminde Türkçe yazı dili olarak kullanılmıştır.', true, 'Bu dönemin eserleri Türkçenin yazılı mirasının temeli.'),
      soru('Medreselerde yalnızca dinî ilimler okutulurdu.', false, 'Matematik, astronomi ve tıp da okutuluyordu.'),
      soru('Tasavvufun Anadolu nun Türkleşmesinde bir etkisi olmamıştır.', false, 'Tekke ve zaviyeler hem iskânda hem kültürel kaynaşmada rol oynadı.'),
      sikli('Ömer Hayyam hangi alanda öne çıktı?', ['Takvim ve cebir', 'Tıp'], 0, 'Tıpta İbn Sina öne çıktı.'),
      sikli('Divânu Lugâti\'t-Türk kimin eseridir?', ['Yusuf Has Hacib', 'Kâşgarlı Mahmud'], 1, 'Yusuf Has Hacib Kutadgu Bilig\'in yazarı.'),
      sikli('Anadolu Selçuklu mimarisinde öne çıkan?', ['Cam vitray', 'Taş işçiliği ve çini'], 1, 'Kümbet, medrese, kervansaray.'),
      soru('Nizamiye medreseleri dönemin en düzenli yükseköğretim kurumlarıydı.', true, 'Nizamülmülk kurdu.'),
      soru('Divriği Ulu Camii ve Darüşşifası UNESCO Dünya Mirası listesindedir.', true, 'Taş işçiliğiyle ünlü.'),
      soru('Mevlânâ Mesnevi\'yi Türkçe yazdı.', false, 'Farsça yazdı.'),
      soru('Kümbetin biçimi göçebe çadırını andırır.', true, 'Çadır taşa aktarılmış.'),
      sikli('Divan-ı Hikmet\'in yazarı?', ['Ahmet Yesevi', 'Yunus Emre'], 0, 'Türkistan\'da.'),
      sikli('Şiirlerini sade Türkçeyle söyleyen mutasavvıf?', ['Mevlânâ', 'Yunus Emre'], 1, 'Mevlânâ Farsça yazdı.'),
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
      {
        soru: 'Mesnevi hangi dille yazıldı?',
        siklar: ['Türkçe', 'Farsça'],
        dogru: 1,
        aciklama: {
          dogru: 'Mevlânâ dönemin edebiyat dili Farsçayla yazdı.',
          yanlis: 'Sade Türkçe Yunus Emre\'nin. Mesnevi Farsçadır.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('trh10-t2', 'Beylikten Devlete Osmanlı (1299-1453)', [
    konu('trh10-kurulus', 'Osmanlı Devleti’nin Kuruluşuna Dair Görüşler', [
      kart(
        'Gaza ve cihat görüşü',
        'Osmanlı’yı uç bölgesindeki gaza ruhunun büyüttüğünü savunur.\nSınır boyundaki savaşçılar devlete katıldı.',
      ),
      kart(
        'Aşiret görüşü',
        'Kayı boyuna dayanan aşiret yapısının devletin çekirdeği olduğunu ileri sürer.',
      ),
      kart(
        'Ahilik ve tasavvuf etkisi',
        'Ahi teşkilatının ve dervişlerin örgütleyici rolüne dikkat çeker.',
      ),
      kart(
        'Dört görüş yan yana',
        'Görüşler birbirini dışlamaz.\nHer biri sürecin farklı bir yanını öne çıkarır.',
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
        { not: 'Gaza (Wittek), aşiret (Lindner), ahilik, coğrafya: sınav \'hangisi doğru\' değil \'hangi görüş ne der\' diye sorar.' },
      ),
      kart(
        'Coğrafi konum',
        'Bizans sınırında, Balkanlara açılan bir uçta kuruldu.\nBu konum Osmanlı’ya büyüme alanı verdi.',
      ),
      kart(
        'Neden farklı görüşler?',
        'Kuruluş dönemine ait yazılı kaynak çok azdır.\nİlk kronikler olaylardan yaklaşık yüz yıl sonra yazıldı.',
      ),
      kart(
        'Öteki beylikler neden büyümedi?',
        '- **Çoğu beylik:** Anadolu’nun içinde, komşuları da Türk beylikleri\n- **Osmanlı:** genişleyebileceği bir sınırda',
      ),
      kart(
        'Koyunhisar (1302)',
        'Osman Bey’in Bizans’a karşı kazandığı ilk büyük zaferdir (Bafeus).\nOsmanlı’nın bölgede bir güç olarak tanınmasını sağladı.',
      ),
      kart(
        'Orhan Bey’in ilkleri',
        '- Bursa başkent yapıldı (1326).\n- İlk Osmanlı parası (akçe) basıldı.\n- İlk medrese İznik’te açıldı.\n- İlk düzenli ordu: yaya ve müsellem',
      ),
      kart(
        'Uç beyliği',
        'Osmanlı, Selçuklu-Bizans sınırındaki uç bölgesinde kuruldu.\nUçlarda merkezden bağımsız hareket eden savaşçı beyler vardı.',
      ),
      kart(
        'Kayı boyu',
        'Osmanlı hanedanı Oğuzların Kayı boyuna dayanır.\nSöğüt ve Domaniç çevresi ilk yurdudur.',
      ),
    ], [
      soru('Osmanlı nın kuruluşuyla ilgili tek bir görüş üzerinde uzlaşılmıştır.', false, 'Gaza, aşiret ve tasavvuf temelli birden çok görüş yan yana duruyor.'),
      soru('Gaza ve cihat görüşü, beyliğin sınır boyundaki konumunu öne çıkarır.', true, 'Uç beyliği olmak sürekli bir hareket alanı sağlıyordu.'),
      soru('Osmanlı Beyliği nin Bizans sınırında bulunması büyümesini kolaylaştırmıştır.', true, 'Genişleyeceği yönde başka bir Türk beyliği yoktu.'),
      soru('Anadolu daki öteki beylikler de Osmanlı ile aynı sınır konumuna sahipti.', false, 'Çoğu Anadolu içindeydi; genişleyecekleri yönde başka Türk beylikleri vardı.'),
      sikli('Kayı boyunu çekirdek sayan görüş?', ['Gaza görüşü', 'Aşiret görüşü'], 1, 'Gaza görüşü uç savaşçılarını öne çıkarır.'),
      sikli('Ahilik görüşü neyin rolüne dikkat çeker?', ['Ahi ve dervişlerin örgütleyici rolüne', 'Deniz ticaretine'], 0, 'Görüşler birbirini dışlamaz; her biri bir yanı öne çıkarır.'),
      sikli('Gaza görüşünü öne süren tarihçi kimdir?', ['Köprülü', 'Wittek'], 1, 'Paul Wittek uç bölgesindeki gaza ruhunu öne çıkardı.'),
      soru('Osmanlı\'nın ilk kronikleri olaylardan yaklaşık yüz yıl sonra yazıldı.', true, 'Kuruluş dönemine ait yazılı kaynak çok az.'),
      soru('Koyunhisar Savaşı Osman Bey döneminde yapıldı.', true, '1302.'),
      soru('İlk Osmanlı medresesi Bursa\'da açıldı.', false, 'İznik\'te açıldı (1331).'),
      soru('İlk düzenli Osmanlı ordusu yaya ve müsellemlerdir.', true, 'Orhan Bey döneminde.'),
      sikli('Osmanlı hanedanı hangi Oğuz boyuna dayanır?', ['Kayı', 'Kınık'], 0, 'Kınık Selçukluların boyu.'),
      sikli('Bursa\'yı başkent yapan?', ['Osman Bey', 'Orhan Bey'], 1, '1326.'),
    ], [
      {
        soru: 'Osmanlı\'nın kuruluşu hakkında neden farklı görüşler var?',
        siklar: ['Görüşler birbiriyle çelişiyor', 'Döneme ait yazılı kaynak çok az'],
        dogru: 1,
        aciklama: {
          dogru: 'İlk kronikler olaylardan yüz yıl sonra yazıldı; boşluğu yorumlar dolduruyor.',
          yanlis: 'Görüşler birbirini dışlamıyor, her biri bir yanı anlatıyor. Çokluğun sebebi kuruluş dönemine ait belgelerin azlığı.',
        },
        kart: 6,
      },
      {
        soru: 'İlk Osmanlı parası hangi dönemde basıldı?',
        siklar: ['Orhan Bey', 'I. Murat'],
        dogru: 0,
        aciklama: {
          dogru: 'Orhan Bey akçe bastırdı.',
          yanlis: 'I. Murat dönemi Rumeli fetihleriyle öne çıkar. İlk para Orhan Bey\'in.',
        },
        kart: 9,
      },
    ]),
    konu('trh10-anadolu-rumeli', 'Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Rumeli’ye geçiş',
        '**Çimpe Kalesi**’nin alınmasıyla (1353) Osmanlı Balkanlara ayak bastı.\nGenişleme buradan hızlandı.',
      ),
      kart(
        'Balkan zaferleri',
        'Balkanlardaki Osmanlı varlığını kalıcılaştıran savaşlar:\n- Sırpsındığı\n- I. Kosova\n- Niğbolu',
      ),
      kart(
        'Anadolu Türk birliği',
        'Beylikler savaş, satın alma ve evlilik yoluyla Osmanlı’ya katıldı.\nAmaç Anadolu’da tek otoriteydi.',
      ),
      kart(
        'Ankara Savaşı (1402)',
        'Timur karşısında alınan yenilgi devleti dağıttı.\nAnadolu Türk birliği bozuldu.',
      ),
      kart(
        'Fetret Devri',
        'Şehzadeler arasında on bir yıl süren taht mücadelesidir.\nDevlet, Balkanlardaki düzen sayesinde ayakta kaldı.',
      ),
      kart(
        'Neden Balkanlar tutundu?',
        'İskân ve istimalet politikası yerel halkı yabancılaştırmamıştı.\nMerkez dağılırken bile bölge elden çıkmadı.',
        undefined,
        { not: 'Ankara yenilgisinden sonra Anadolu beylikleri ayrıldı, Balkan halkı ayrılmadı: istimalet vergiyi hafifletmişti.' },
      ),
      kart(
        'İstanbul’un Fethi (1453)',
        '- Orta Çağ kapandı.\n- Osmanlı toprak bütünlüğünü sağladı.\n- Devlet imparatorluğa dönüştü.',
      ),
      kart(
        'Fethin sonuçları',
        '- Boğazlar tek elde toplandı.\n- Bizans sona erdi.\n- Avrupa’ya giden bilginler Rönesans’a katkı sundu.',
      ),
      kart(
        'Timur’dan sonra',
        'Timur Ankara’dan sonra Osmanlı’ya katılmış beylikleri yeniden kurdu.\nAnadolu birliği bozuldu; yeniden kurulması yarım yüzyıl sürdü.',
      ),
      kart(
        'Çelebi Mehmet',
        'Fetret Devri’ni kazanarak devleti yeniden birleştirdi (1413).\nBu yüzden "ikinci kurucu" sayılır.',
      ),
      kart(
        'Varna (1444)',
        'Haçlı ordusu II. Murat karşısında yenildi.\nAvrupa’nın Türkleri Balkanlardan çıkarma umudu büyük ölçüde sona erdi.',
      ),
      kart(
        'II. Kosova (1448)',
        'Haçlıların son büyük girişimi de yenilgiyle bitti.\nBalkanlarda Osmanlı üstünlüğü kesinleşti; İstanbul’un fethine zemin hazırlandı.',
      ),
    ], [
      soru('Ankara Savaşı ndan sonra Osmanlı Devleti Fetret Devri ne girmiştir.', true, 'Şehzadeler arasındaki mücadele yaklaşık on bir yıl sürdü.'),
      soru('İstanbul un fethi Orta Çağ ın sonu kabul edilir.', true, 'Surların top ateşiyle yıkılması çağ değiştiren bir gelişme sayılıyor.'),
      soru('Fetret Devri nde Balkanlardaki topraklar tümüyle kaybedilmiştir.', false, 'İskân ve istimalet politikaları sayesinde Balkanlardaki düzen ayakta kaldı.'),
      soru('Osmanlı, Rumeli ye Ankara Savaşı ndan sonra geçmiştir.', false, 'Rumeli ye geçiş 14. yüzyıl ortasında, Ankara Savaşı ndan çok önce oldu.'),
      sikli('Osmanlı Rumeli\'ye hangi kalenin alınmasıyla geçti?', ['Çimpe (1353)', 'Niğbolu'], 0, 'Balkanlara ilk adım.'),
      sikli('Ankara Savaşı\'nda Osmanlı kime yenildi?', ['Timur', 'Bizans'], 0, '1402; Anadolu birliği bozuldu.'),
      sikli('Balkanlardaki varlığı kalıcılaştıran savaşlardan biri?', ['Ankara', 'I. Kosova'], 1, 'Ankara Savaşı (1402) Timur\'a karşı alınan yenilgi.'),
      sikli('İstanbul\'un fethinin sonuçlarından biri?', ['Osmanlı Balkanlara ilk kez geçti', 'Boğazlar tek elde toplandı'], 1, 'Balkanlara geçiş 1353\'te Çimpe ile olmuştu.'),
      soru('Beylikler yalnızca savaşla Osmanlı\'ya katıldı.', false, 'Satın alma ve evlilik de.'),
      soru('Çelebi Mehmet Osmanlı\'nın "ikinci kurucusu" sayılır.', true, 'Fetret Devri\'ni bitirdi.'),
      soru('Varna Savaşı\'nda Haçlılar kazandı.', false, 'II. Murat kazandı.'),
      soru('Timur, Ankara Savaşı\'ndan sonra beylikleri yeniden kurdu.', true, 'Anadolu birliği bozuldu.'),
      sikli('Fetret Devri\'ni bitiren?', ['Çelebi Mehmet', 'II. Murat'], 0, '1413.'),
      sikli('Haçlıların son büyük girişiminin yenildiği savaş?', ['I. Kosova', 'II. Kosova'], 1, '1448.'),
    ], [
      {
        soru: 'Fetret Devri\'nde Balkanların elde kalmasını sağlayan neydi?',
        siklar: ['İskân ve istimalet politikası', 'Güçlü donanma'],
        dogru: 0,
        aciklama: {
          dogru: 'Yerel halk yabancılaştırılmamıştı; merkez dağılırken bölge ayaklanmadı.',
          yanlis: 'Donanma o dönemde güçlü değildi. Bölgeyi tutan şey halkın Osmanlı düzenine bağlılığıydı: iskân ve istimalet.',
        },
        kart: 6,
      },
      {
        soru: 'Balkanlarda Osmanlı üstünlüğünü kesinleştiren 1448 savaşı?',
        siklar: ['Ankara', 'II. Kosova'],
        dogru: 1,
        aciklama: {
          dogru: 'II. Kosova\'da Haçlıların son büyük girişimi yenildi.',
          yanlis: 'Ankara (1402) Timur\'a karşı yenilgidir. 1448 II. Kosova.',
        },
        kart: 12,
      },
    ]),
    konu('trh10-devletlesme', 'Devletleşme Süreci: Ordu, Hukuk ve Toprak', [
      kart(
        'Tımar sistemi',
        'Toprağın vergi geliri sipahiye bırakıldı.\nSipahi hem üretimi denetledi hem asker yetiştirdi.',
      ),
      kart(
        'Toprak kimin?',
        '**Miri arazide** mülkiyet devletindir.\nKöylüye yalnızca işleme hakkı verilir; boş bırakılan toprak geri alınır.',
      ),
      kart(
        'Devşirme ve yeniçeri',
        'Devşirilen çocuklar eğitilerek kapıkulu ordusuna alındı.\nMerkeze bağlı, sürekli bir ordu doğdu.',
      ),
      kart(
        'İki ordu, iki kaynak',
        '- **Kapıkulu:** maaşlı, merkeze bağlı\n- **Eyalet askeri:** toprak gelirinden geçinir, taşrada durur',
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
        'Şer’i hukukun yanında padişahın koyduğu kanunlardır.\nKanunnameler devlet düzenini yazılı hâle getirdi.',
      ),
      kart(
        'Divan-ı Hümayun',
        'Devletin en yüksek karar organıdır.\nHer tebaanın şikâyetini götürebildiği bir merci sayılırdı.',
      ),
      kart(
        'Üçü birbirini besledi',
        '- Toprak düzeni orduyu besledi.\n- Ordu güvenliği sağladı.\n- Güvenlik üretimi ayakta tuttu.\nBiri bozulunca hepsi sarsıldı.',
        undefined,
        { not: 'Tımar sipahiyi besler, sipahi güvenliği sağlar, güvenlik üretimi artırır, üretim tımarı besler. Halka.' },
      ),
      kart(
        'Dirlik türleri',
        'Gelirine göre üçe ayrılırdı:\n- **Has:** en büyük; padişah, sadrazam, beylerbeyi\n- **Zeamet:** orta; sancakbeyi, ileri gelenler\n- **Tımar:** en küçük; sipahi',
      ),
      kart(
        'Divan-ı Hümayun üyeleri',
        '- **Sadrazam:** padişahın vekili\n- **Kazasker:** hukuk ve eğitim\n- **Defterdar:** maliye\n- **Nişancı:** yazışma ve tuğra',
      ),
      kart(
        'Kanunnameler',
        'Fatih’in Teşkilat Kanunnamesi devletin yapısını ve teşrifatı yazılı hâle getirdi.\nKanuni döneminde kanunnameler sistemleşti.',
      ),
      kart(
        'Şer’i ve örfi hukuk',
        '- **Şer’i:** İslam hukukuna dayanır; aile, miras.\n- **Örfi:** padişahın koyduğu kurallar; vergi, toprak, teşkilat.\nÖrfi hukuk şer’i hukuka aykırı olamazdı.',
      ),
    ], [
      soru('Tımar sisteminde toprağın mülkiyeti devlete aittir.', true, 'Sipahiye bırakılan şey toprağın vergi geliri.'),
      soru('Devşirme sistemiyle alınan çocuklar eğitilerek devlet hizmetine alınırdı.', true, 'Kimileri yeniçeri oldu, kimileri saray görevlerine yükseldi.'),
      soru('Tımarlı sipahiler maaşlarını hazineden nakit olarak alırdı.', false, 'Geçimlerini kendilerine bırakılan toprağın gelirinden sağlıyorlardı.'),
      soru('Divan-ı Hümayun un kararları padişahın onayına sunulmazdı.', false, 'Son söz padişahındı; divan kararları onun onayıyla yürürlüğe giriyordu.'),
      sikli('Miri arazide köylüye ne verilir?', ['İşleme hakkı', 'Mülkiyet'], 0, 'Boş bırakılan toprak geri alınır.'),
      sikli('Padişahın koyduğu kanunlara ne denir?', ['Örfi hukuk', 'Şer\'i hukuk'], 0, 'Kanunnameler.'),
      sikli('Kapıkulu ordusu nasıl beslenirdi?', ['Maaşla, merkeze bağlı', 'Toprak geliriyle'], 0, 'Eyalet askeri toprak gelirinden.'),
      soru('Devletin en yüksek karar organı Divan-ı Hümayun\'du.', true, 'Her tebaanın şikâyet götürebildiği merci.'),
      soru('Has, dirliklerin en büyüğüdür.', true, 'Padişah ve üst yöneticilere verilir.'),
      soru('Divan-ı Hümayun\'da maliyeden kazasker sorumluydu.', false, 'Maliye defterdarın; kazasker hukuk ve eğitimin.'),
      soru('Örfi hukuk şer\'i hukuka aykırı olamazdı.', true, 'Sınır buydu.'),
      sikli('Tuğrayı çeken ve yazışmaları yürüten?', ['Nişancı', 'Defterdar'], 0, 'Defterdar maliyeci.'),
      sikli('Teşkilat Kanunnamesi kimin dönemine ait?', ['Orhan Bey', 'Fatih'], 1, 'Devletin yapısını yazıya geçirdi.'),
    ], [
      {
        soru: 'Tımar sisteminde sipahi karşılığında ne yapar?',
        siklar: ['Hazineye nakit vergi öder', 'Asker yetiştirir ve üretimi denetler'],
        dogru: 1,
        aciklama: {
          dogru: 'Toprağın vergisi sipahide kalır, sipahi cebelü besler.',
          yanlis: 'Nakit hazineye gitmez, sipahide kalır. Karşılığı asker yetiştirmek ve toprağın işlenmesini sağlamak.',
        },
        kart: 1,
      },
      {
        soru: 'Sipahiye verilen en küçük dirlik?',
        siklar: ['Tımar', 'Has'],
        dogru: 0,
        aciklama: {
          dogru: 'Tımar dirliklerin en küçüğü; has en büyüğü.',
          yanlis: 'Has en büyük dirliktir. Sipahinin dirliği tımar.',
        },
        kart: 8,
      },
    ]),
    konu('trh10-kalicilik', 'Fethettiği Topraklarda Kalıcı Olma Politikaları', [
      kart(
        'İskân politikası',
        'Fethedilen bölgelere Anadolu’dan nüfus yerleştirildi.\nBölge hem şenlendirildi hem güvenceye alındı.',
      ),
      kart(
        'Kimler yerleştirildi?',
        '- Konargöçerler\n- Kalabalık aileler\n- Huzursuzluk çıkaran gruplar\nBöylece iki sorun birden çözülürdü.',
      ),
      kart(
        'İstimalet',
        'Yerli halka hoşgörülü davranma siyasetidir.\n- Can, mal ve inanç güvenliği verildi.\n- Vergi yükü hafifletildi.',
      ),
      kart(
        'Mevcut düzeni koruma',
        'Yerel vergi ve toprak düzeni çoğu zaman korundu.\nAni değişiklik direnç üretiyordu.',
      ),
      kart(
        'İmar faaliyetleri',
        'Cami, han, hamam ve köprüyle şehirler yeniden canlandırıldı.\nBunlar aynı zamanda kalıcılığın işaretiydi.',
      ),
      kart(
        'Millet sistemi',
        'Gayrimüslim topluluklar kendi dinî liderleri altında iç işlerinde serbestti.\nBu, uzun süre bir arada yaşamayı kolaylaştırdı.',
      ),
      kart(
        'Neden işe yaradı?',
        'Bizans yönetiminde köylü ağır vergi altındaydı.\nOsmanlı düzeni çoğu zaman daha katlanılırdı.',
        undefined,
        { not: 'Bizans köylüsü ağır vergi + angarya öderdi; Osmanlı düzeninde vergi hafifledi, kilise kaldı. Direniş azaldı.' },
      ),
      kart(
        'Yörükler',
        'Anadolu’dan Balkanlara geçirilen konargöçer Türkmenlerdir.\nHem nüfus sağladılar hem askerî hizmet gördüler.',
      ),
      kart(
        'Sürgün',
        'Devletin bir bölgeden başka bölgeye zorunlu nüfus nakli yapmasıdır.\nFetih sonrası İstanbul’un şenlendirilmesi de sürgünle oldu.',
      ),
      kart(
        'Vakıf şehirleri',
        'Fethedilen şehirde önce bir külliye yapılır, çevresinde mahalle kurulurdu.\nVakıf gelirleri şehrin hizmetlerini yıllarca sürdürürdü.',
      ),
      kart(
        'Kalıcılığın sonucu',
        'Balkanlarda Osmanlı varlığı beş yüzyıl sürdü.\nBugün bölgedeki camiler, köprüler ve Türkçe sözcükler bu dönemin izidir.',
      ),
    ], [
      soru('İstimalet, fethedilen yerdeki halka hoşgörüyle yaklaşma politikasıdır.', true, 'Vergi kolaylıkları ve inanç serbestliği bunun parçasıydı.'),
      soru('İskân politikasıyla Anadolu dan Rumeli ye nüfus yerleştirilmiştir.', true, 'Konargöçerler ve dervişler bu iskânda öne çıkıyordu.'),
      soru('Fethedilen yerlerdeki bütün yerel düzenler hemen kaldırılırdı.', false, 'Uygun görülen vergi ve toprak uygulamaları bir süre korunuyordu.'),
      soru('Millet sistemi, gayrimüslimlerin kendi hukukî işlerini yürütmesine izin vermezdi.', false, 'Cemaatler kendi inanç ve hukuk işlerinde serbestti.'),
      sikli('İskân için kimler tercih edilirdi?', ['Yalnızca askerler', 'Konargöçerler ve huzursuzluk çıkaranlar'], 1, 'İki sorun birden çözülürdü.'),
      sikli('İstimalet politikasıyla halka ne güvence verilirdi?', ['Can, mal ve inanç güvenliği', 'Vergiden tam muafiyet'], 0, 'Vergi kaldırılmaz, hafifletilirdi.'),
      sikli('Osmanlı düzeni Bizans köylüsü için neden katlanılırdı?', ['Toprak bedava verildi', 'Vergi yükü daha hafifti'], 1, 'Neden işe yaradı.'),
      soru('Fethedilen şehirlerde yapılan cami, han ve hamam kalıcılığın işaretiydi.', true, 'İmar hem şehri canlandırıyor hem kalıcılığı gösteriyordu.'),
      soru('Yörükler Anadolu\'dan Balkanlara geçirildi.', true, 'İskân politikasının parçası.'),
      soru('Sürgün, halkın kendi isteğiyle göç etmesidir.', false, 'Devletin zorunlu nüfus naklidir.'),
      soru('Fetihten sonra İstanbul\'a başka bölgelerden nüfus getirildi.', true, 'Şehir şenlendirildi.'),
      sikli('Fethedilen şehirde çoğunlukla ilk yapılan?', ['Külliye', 'Kale yıkımı'], 0, 'Mahalle çevresinde kurulur.'),
      sikli('Balkanlara geçirilen konargöçer Türkmenler?', ['Yeniçeriler', 'Yörükler'], 1, 'Yeniçeriler kapıkulu askeri.'),
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
      {
        soru: 'Devletin zorunlu nüfus nakline ne denir?',
        siklar: ['İstimalet', 'Sürgün'],
        dogru: 1,
        aciklama: {
          dogru: 'Sürgünle nüfus bir bölgeden ötekine taşınırdı.',
          yanlis: 'İstimalet yerli halka hoşgörü siyasetidir. Zorunlu nakil sürgün.',
        },
        kart: 9,
      },
    ]),
    konu('trh10-ilim-irfan', 'İlim ve İrfan Geleneğinin Oluşması', [
      kart(
        'İlk medrese',
        'İlk Osmanlı medresesi **İznik**’te açıldı (1331).\nDevletin ihtiyaç duyduğu kadı ve müderrisler burada yetişti.',
      ),
      kart(
        'Külliye',
        'Cami çevresindeki yapı topluluğudur:\nmedrese, imaret, hamam, şifahane\nKülliye şehrin çekirdeğiydi.',
      ),
      kart(
        'Külliye ne işe yarardı?',
        'Eğitim, sağlık, ibadet ve yemek tek bir vakfın geliriyle yürürdü.\nYeni fethedilen şehir böyle canlandırılırdı.',
        undefined,
        { not: 'Süleymaniye Külliyesi: cami + 4 medrese + hastane + imaret + hamam; hepsi tek vakfın gelirinden.' },
      ),
      kart(
        'Öne çıkan adlar',
        '- **Molla Fenari:** ilk şeyhülislam\n- **Davud-i Kayseri:** ilk medresenin başmüderrisi',
      ),
      kart(
        'Tekke ve zaviyeler',
        'Dervişler uç bölgelerde yol güvenliği ve yerleşim sağladı.\nTekkeler kültürel kaynaşmanın merkezleriydi.',
      ),
      kart(
        'Mekân ve kişi',
        'Gelenek yalnızca kitapla sürmüyordu.\nKitabın okutulduğu mekân ve onu okutan kişi de geleneğin parçasıydı.',
      ),
    ], [
      soru('Külliye, cami çevresinde toplanan yapıların oluşturduğu bir yapı topluluğudur.', true, 'Medrese, imaret ve hamam da bu topluluğun parçası.'),
      soru('Tekke ve zaviyeler yalnızca ibadet için kullanılan yapılardı.', false, 'Konaklama, iskân ve eğitim gibi işlevleri de vardı.'),
      soru('İlk Osmanlı medresesi İznik te kurulmuştur.', true, 'Orhan Bey döneminde açıldı.'),
      soru('Kitabın okutulduğu mekân ve okutan kişi de ilim geleneğinin parçasıydı.', true, 'Gelenek yalnızca kitapla sürmüyordu.'),
      sikli('Külliyedeki hizmetler neyle finanse edilirdi?', ['Tek bir vakfın geliriyle', 'Hazineden maaşla'], 0, 'Eğitim, sağlık ve yemek aynı vakfın gelirinden yürürdü.'),
      sikli('İlk şeyhülislam olarak anılan?', ['Davud-i Kayseri', 'Molla Fenari'], 1, 'Davud-i Kayseri ilk medresenin başmüderrisi.'),
      soru('Süleymaniye Külliyesi\'nde bir hastane de bulunur.', true, 'Cami, medreseler, hastane, imaret ve hamam tek vakfın gelirinden.'),
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
        'Doğuda',
        '- **Çaldıran (1514):** Safeviler durduruldu.\n- **Ridaniye (1517):** Memlük toprakları alındı, halifelik geçti.',
      ),
      kart(
        'Batıda',
        '- **Mohaç (1526):** Macaristan alındı.\n- **Preveze (1538):** Akdeniz’de üstünlük kazanıldı.',
      ),
      kart(
        'İki yüzyılın çizgisi',
        'Yükseliş ile duraklama arasındaki dönüm noktaları birkaç tarihte toplanır.',
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
        { not: '1453 fetih, 1517 halifelik, 1538 Preveze (zirve), 1571 İnebahtı (ilk büyük deniz yenilgisi), 1683 Viyana.' },
      ),
      kart(
        'Üç kıtaya yayılma',
        'Kanuni döneminde devlet üç kıtaya yayıldı; Akdeniz bir Osmanlı denizi oldu.\nEn geniş sınırlara 17. yüzyılda, Bucaş Antlaşması’yla (1672) ulaşıldı.',
      ),
      kart(
        'Cihanşümul iddia',
        'Fatih ve Kanuni dönemlerinde padişah kendini dünyanın hükümdarı olarak konumlandırdı.\nYalnızca bir bölgenin değil.',
      ),
      kart(
        'Dönüm noktaları',
        '- **İnebahtı (1571):** donanmanın yenildiği ilk büyük çarpışma\n- **II. Viyana (1683):** batıya ilerleyişin sonu',
      ),
      kart(
        'Uzun savaşlar',
        'İran ve Avusturya ile yıllarca süren savaşlar yaşandı.\nHazine ve tımar düzeni yıprandı.',
      ),
      kart(
        'Koloni yarışının dışında',
        'Avrupa okyanus ötesinde koloniler kurarken Osmanlı kara imparatorluğu olarak kaldı.\nGelir kaynakları çeşitlenmedi.',
      ),
    ], [
      soru('Osmanlı Devleti en geniş sınırlarına 17. yüzyılda ulaşmıştır.', true, 'Bu yüzyıldan sonra topraklar genişlemek yerine korunmaya çalışıldı.'),
      soru('Uzun süren savaşlar hazineyi zorlamıştır.', true, 'Sürekli asker beslemek gider yükünü büyütüyordu.'),
      soru('Osmanlı, Avrupa devletleriyle birlikte okyanus ötesi koloni yarışına girmiştir.', false, 'Osmanlı bu yarışın dışında kaldı; genişlemesi kara üzerinden sürdü.'),
      soru('1683 teki II. Viyana Kuşatması Osmanlı için zaferle sonuçlanmıştır.', false, 'Kuşatma bozgunla bitti ve uzun savaşlar dönemini başlattı.'),
      sikli('Çaldıran Savaşı kime karşı yapıldı?', ['Memlükler', 'Safeviler'], 1, '1514.'),
      sikli('Akdeniz\'de üstünlük hangi savaşla kazanıldı?', ['İnebahtı (1571)', 'Preveze (1538)'], 1, 'İnebahtı donanmanın yenildiği ilk büyük çarpışma.'),
      sikli('Mohaç Savaşı\'nın sonucu nedir?', ['Macaristan alındı', 'Safeviler durduruldu'], 0, 'Safevileri Çaldıran (1514) durdurdu.'),
      sikli('Cihanşümul iddia ne demektir?', ['Bir bölgeye hükmetme', 'Padişahın dünyanın hükümdarı olma iddiası'], 1, 'Fatih ve Kanuni kendilerini bir bölgenin değil dünyanın hükümdarı sayıyordu.'),
      soru('Kanuni döneminde devlet üç kıtaya yayıldı.', true, 'Akdeniz bir Osmanlı denizi hâline geldi.'),
    ], [
      {
        soru: 'Halifeliğin Osmanlı\'ya geçmesini sağlayan savaş?',
        siklar: ['Ridaniye (1517)', 'Çaldıran (1514)'],
        dogru: 0,
        aciklama: {
          dogru: 'Memlük toprakları alındı, halifelik Osmanlı\'ya geçti.',
          yanlis: 'Çaldıran Safevilere karşı; halifelik Memlüklerin yenildiği Ridaniye ile geçti.',
        },
        kart: 1,
      },
    ]),
    konu('trh10-yonetim-degisim', 'Yönetim ve Ordu Yapısındaki Değişim', [
      kart(
        'Sancağa çıkma kalktı',
        'Şehzadelerin taşrada yönetim öğrenmesi son buldu, yerine kafes usulü geldi.\nDeneyimsiz padişahların sayısı arttı.',
      ),
      kart(
        'Ekber ve erşed',
        'Tahta hanedanın **en yaşlı ve olgun** üyesi geçer.\nBu kural kardeş katlinin yerini aldı.',
      ),
      kart(
        'Tımarın çözülmesi',
        'Ateşli silahlar öne çıkınca sipahi önemini yitirdi.\nTımarlar iltizama döndü, köylünün yükü arttı.',
      ),
      kart(
        'İltizam nedir?',
        'Verginin toplanma hakkı peşin parayla satılırdı.\nMültezim ödediğinden fazlasını toplamak istediği için köylü ezildi.',
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
        '- Devşirme kuralı gevşedi.\n- Sayı arttı, disiplin düştü.\nYeniçeriler siyasete karışan bir güce dönüştü.',
      ),
      kart(
        'Sadrazamların ağırlığı',
        'Padişahlar geri çekilince yönetim sadrazamlara kaydı.\nEn belirgin örneği **Köprülüler** dönemidir.',
      ),
      kart(
        'Islahat girişimleri',
        'Kuyucu Murat Paşa, II. Osman ve IV. Murat düzeni zorla toparlamaya çalıştı.\nÇabalar kalıcı bir kurum bırakmadı.',
      ),
      kart(
        'Neden ıslahatlar tutmadı?',
        'Girişimler eski düzeni onarmayı hedefliyordu.\nSorunun kaynağı olan yapının kendisi tartışılmıyordu.',
        undefined,
        { not: 'IV. Murat düzeni zorla kurdu, ölünce bozuldu: sebebe (tımarın çöküşü, para) değil sonuca müdahale edilmişti.' },
      ),
    ], [
      soru('Ekber ve erşed sistemiyle tahta hanedanın en yaşlı ve olgun üyesi geçmeye başlamıştır.', true, 'Taht kavgalarını azaltmak için getirildi.'),
      soru('İltizam usulünde vergi toplama hakkı açık artırmayla kişilere devredilirdi.', true, 'Devlet peşin gelir elde ediyor, halk daha ağır vergiyle karşılaşıyordu.'),
      soru('Tımar sisteminin bozulması ordunun güçlenmesini sağlamıştır.', false, 'Tersine, tımarlı sipahi sayısı azaldı ve ordunun gücü zayıfladı.'),
      soru('Islahatlar toplumun her alanını kapsadığı için kalıcı sonuçlar vermiştir.', false, 'Çoğu askerî alanla sınırlı kaldı ve köklü olmadığı için kalıcı olmadı.'),
      sikli('Sancağa çıkmanın yerini ne aldı?', ['Devşirme', 'Kafes usulü'], 1, 'Deneyimsiz padişahlar arttı.'),
      sikli('Islahat yapan padişahlardan biri?', ['IV. Murat', 'Kanuni'], 0, 'IV. Murat düzeni zorla toparlamaya çalıştı.'),
      sikli('Tımarın çözülmesinin sebebi?', ['Toprak tükendi', 'Ateşli silahlar sipahiyi önemsizleştirdi'], 1, 'Tımarlar iltizama döndü.'),
      sikli('Köprülüler dönemi neyin örneğidir?', ['Kafes usulünün', 'Yönetimin sadrazama kayması'], 1, 'Padişahlar geri çekildi.'),
      soru('Devşirme kuralı gevşeyince yeniçeri ocağında disiplin düştü.', true, 'Sayı arttı, yeniçeriler siyasete karışan bir güce dönüştü.'),
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
        'Coğrafi keşifler',
        'Yeni deniz yolları bulununca ticaret okyanuslara kaydı.\nİpek ve Baharat yolları önemini yitirdi.',
      ),
      kart(
        'Sömürgecilik nedir?',
        'Bir devletin uzak toprakları ele geçirip kaynaklarını kendi ekonomisine aktarmasıdır.\nAvrupa zenginliğinin bir kaynağı budur.',
      ),
      kart(
        'Gümrük geliri düştü',
        'Osmanlı’nın transit ticaretten aldığı pay azaldı.\nHazinenin en güvenilir gelirlerinden biri zayıfladı.',
      ),
      kart(
        'Fiyat devrimi',
        'Amerika’dan gelen gümüş Avrupa’ya, oradan Osmanlı’ya aktı.\nAkçe değer kaybetti, enflasyon yükseldi.',
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
        { not: 'Amerika gümüşüyle akçe değer kaybetti, sabit maaşlı yeniçeri ve tımarlı fakirleşti: Celali isyanlarının ekonomik kökü.' },
      ),
      kart(
        'Kapitülasyonlar',
        'Başlangıçta ticareti canlandırmak için verilen ayrıcalıklardı.\nZamanla yerli üreticiyi zorlayan bir yüke dönüştü.',
      ),
      kart(
        'Sanayi dengesi',
        'Avrupa ucuz ve bol mal üretmeye başladı.\nOsmanlı loncaları bu rekabette geriledi.',
      ),
      kart(
        'Neden lonca yetişemedi?',
        'Lonca kaliteyi ve fiyatı denetleyip üretimi sınırlıyordu.\nBu düzen az ve iyi üretmek için kurulmuştu, çok üretmek için değil.',
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
      sikli('Coğrafi keşiflerle ticaret nereye kaydı?', ['Karadeniz\'e', 'Okyanuslara'], 1, 'İpek ve Baharat yolları önemini yitirdi.'),
      sikli('Fiyat devrimine yol açan kaynak nedir?', ['Anadolu bakırı', 'Amerika gümüşü'], 1, 'Gümüş Avrupa\'ya, oradan Osmanlı\'ya aktı; akçe değer kaybetti.'),
      sikli('Fiyat devrimi hangi isyanların ekonomik köküdür?', ['Celali isyanları', 'Haçlı Seferleri'], 0, 'Sabit gelirli yeniçeri ve tımarlı fakirleşti.'),
      soru('Sömürgecilik, uzak toprakların kaynaklarını kendi ekonomisine aktarmaktır.', true, 'Avrupa zenginliğinin kaynaklarından biri.'),
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
        'Celali isyanları',
        'Anadolu’da çıktı. Sebepleri: ağır vergi, iltizam baskısı, işsiz sekbanlar\nKöyler boşaldı, üretim düştü.',
      ),
      kart(
        'Büyük kaçgun',
        'Celali baskısından kaçan köylüler toprağı bırakıp şehirlere göç etti.\nTarımsal üretim uzun süre toparlanamadı.',
      ),
      kart(
        'İstanbul isyanları',
        'Yeniçeri ve kapıkulu ayaklanmalarıdır; ulufe ve cülus talepleriyle çıktı.\nZamanla padişah değiştirecek güce ulaştı.',
      ),
      kart(
        'Eyalet isyanları',
        'Merkezden uzak valilerin ayaklanmasıdır.\nOtoritenin zayıfladığı yerlerde yerel güçler öne çıktı.',
      ),
      kart(
        'Üç isyan, üç kaynak',
        'Üçünün de çıktığı yer ve kişiler farklıdır.\nArkalarındaki mali bozulma ise aynıdır.',
        {
          tur: 'tablo',
          basliklar: ['İsyan', 'Kim?'],
          satirlar: [
            ['Celali', 'Anadolu halkı'],
            ['İstanbul', 'Kapıkulu'],
            ['Eyalet', 'Valiler'],
          ],
        },
        { not: 'Celali: Anadolu köylü ve sekban. Kapıkulu: İstanbul yeniçeri. Eyalet: taşra valisi. Hepsinin altında para bozulması.' },
      ),
      kart(
        'Ortak sebep',
        '- Uzun savaşlar\n- Bozulan para ve artan vergi\n- Tımar düzeninin çöküşü\nİsyanlar sebep değil sonuçtu.',
      ),
      kart(
        'Sonuçları',
        '- Can ve mal kaybı\n- Göç ve tarımsal üretimde düşüş\n- Merkezî otoritenin daha da zayıflaması',
      ),
    ], [
      soru('Celali isyanları Anadolu da tarımsal üretimin azalmasına yol açmıştır.', true, 'Köylü toprağını bırakıp göç etti.'),
      soru('Büyük kaçgun, köylülerin topraklarını bırakıp göç etmesidir.', true, 'Vergi baskısı ve güvensizlik bunun sebebiydi.'),
      soru('İstanbul isyanlarının kaynağı taşradaki köylülerdi.', false, 'Kaynağı kapıkulu askerleri ve saray çevresiydi.'),
      soru('İsyanların devletin vergi düzeni üzerinde bir etkisi olmamıştır.', false, 'Üretim düşünce vergi geliri de azaldı ve yeni vergiler kondu.'),
      sikli('Celali isyanlarının sebeplerinden biri?', ['Dış işgal', 'İltizam baskısı ve işsiz sekbanlar'], 1, 'Ağır vergi de sebepler arasında.'),
      sikli('Padişah değiştirecek güce ulaşan ayaklanmalar?', ['Eyalet isyanları', 'İstanbul isyanları'], 1, 'Yeniçeri ve kapıkulu.'),
      sikli('Üç isyan türünün ortak arka planı?', ['Dış işgal', 'Mali bozulma'], 1, 'İsyanlar sebep değil sonuç.'),
      soru('Eyalet isyanlarını merkezden uzak valiler çıkarırdı.', true, 'Otoritenin zayıfladığı yerlerde yerel güçler öne çıktı.'),
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
        'Sahn-ı Seman',
        'Fatih’in kurduğu sekiz medresedir.\nDönemin en üst düzey eğitim kurumuydu.',
      ),
      kart(
        'Coğrafya ve denizcilik',
        '**Piri Reis**’in iki eseri Osmanlı denizcilik bilgisinin düzeyini gösterir:\n- Dünya haritası\n- Kitab-ı Bahriye',
      ),
      kart(
        'Rasathane',
        '**Takiyüddin**, İstanbul’da dönemin ileri gözlem merkezlerinden birini kurdu.\nRasathane kısa süre sonra kapatıldı.',
      ),
      kart(
        'Tarih ve düşünce',
        '**Kâtip Çelebi** coğrafya ve bibliyografya alanında yazdı.\nDevletin sorunlarını da eleştirel biçimde ele aldı.',
      ),
      kart(
        'Mimar Sinan',
        'Osmanlı klasik mimarisinin doruğunu kurdu.\nÜç büyük eseri: Şehzade, Süleymaniye ve Selimiye camileri',
      ),
      kart(
        'Sinan’ın üç dönemi',
        '- **Şehzade:** çıraklık eseri\n- **Süleymaniye:** kalfalık eseri\n- **Selimiye:** ustalık eseri',
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
        '- **Divan edebiyatı:** Fuzuli, Baki\n- **Süsleme sanatları:** minyatür, hat, çini',
      ),
      kart(
        'Matbaanın gecikmesi',
        'Basılı kitaba geçiş Osmanlı’da geç oldu.\nBilgi çoğaltma hızındaki bu fark, Avrupa ile arayı açan etkenlerden biri sayılır.',
        undefined,
        { not: 'Gutenberg 1450, İbrahim Müteferrika 1727: yaklaşık 280 yıl. Avrupa\'da kitap ucuzlarken Osmanlı\'da el yazması kaldı.' },
      ),
    ], [
      soru('Sahn-ı Seman medreseleri Fatih döneminde kurulmuştur.', true, 'Dönemin en üst düzey eğitim kurumlarıydı.'),
      soru('Piri Reis in haritaları dönemin denizcilik bilgisini yansıtır.', true, 'Kitab-ı Bahriye kıyı bilgilerini toplayan bir eser.'),
      soru('İstanbul Rasathanesi kurulduktan sonra uzun yıllar çalışmalarını sürdürmüştür.', false, 'Kuruluşundan kısa süre sonra yıktırıldı.'),
      soru('Matbaa Osmanlı\'da Avrupa ile aynı dönemde yaygınlaşmıştır.', false, 'Gutenberg 1450, İbrahim Müteferrika 1727: Türkçe basım yaklaşık 280 yıl sonra başladı.'),
      sikli('Kâtip Çelebi hangi alanlarda eser verdi?', ['Mimari', 'Coğrafya ve bibliyografya'], 1, 'Devletin sorunlarını da eleştirel biçimde ele aldı.'),
      sikli('Divan edebiyatının öne çıkan şairlerinden biri?', ['Mimar Sinan', 'Fuzuli'], 1, 'Fuzuli ve Baki dönemin büyük şairleri.'),
      sikli('Takiyüddin\'in İstanbul\'da kurduğu?', ['Rasathane', 'Matbaa'], 0, 'Kısa süre sonra kapatıldı.'),
      sikli('Süleymaniye\'yi Sinan hangi dönemine sayar?', ['Kalfalık', 'Ustalık'], 0, 'Ustalık Selimiye.'),
      soru('Selimiye Camii Edirne\'dedir.', true, 'Mimar Sinan\'ın ustalık eseri.'),
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
