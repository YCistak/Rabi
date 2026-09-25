import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 9. sınıf Türk Dili ve Edebiyatı — Maarif Modeli.
 *
 * Dört tema: **Sözün İnceliği**, **Anlam Arayışı**, **Anlamın Yapı
 * Taşları**, **Dilin Zenginliği**. Eski programın tür temelli
 * ünitelendirmesi (Hikâye, Şiir, Roman, Tiyatro…) kullanılmıyor; türler
 * temaların içinde geçiyor.
 *
 * Konu listesi bu derste `maarif.test.ts` tarafından **denetlenmiyor**
 * (`KONU_LISTESI_DENETLENMEYEN`): programın İçerik Çerçevesi burada konu
 * değil beceri sayıyor ve dört temanın dördünde de aynı dördü yazıyor.
 */
export const turkce9 = program('turkce', 9, 'Sözün inceliğinden dilin zenginliğine', [
  tema('trk9-t1', 'Sözün İnceliği', [
    konu('trk9-edebiyat', 'Edebiyat ve Güzel Sanatlar', [
      kart(
        'Edebiyatın malzemesi dildir',
        '- **Ressam:** boyayla çalışır.\n- **Besteci:** sesle çalışır.\n- **Yazar:** dille çalışır.\nEdebiyat, güzel sanatların dille yapılan koludur.',
      ),
      kart(
        'Kurmaca nedir?',
        'Edebî metin gerçeği aktarmaz, yeniden kurar.\nAnlatılan yaşanmış olsa bile metindeki hâli kurmacadır.',
        undefined,
        { not: 'Çalıkuşu\'ndaki Feride yaşamadı ama Anadolu öğretmeninin gerçeği orada. Kurmaca yalan değil, yeniden kurma.' },
      ),
      kart(
        'Edebî ve öğretici metin',
        '- **Edebî metin:** çağrıştırır, çok anlamlıdır.\n- **Öğretici metin:** bilgi verir, tek anlamlı olmayı hedefler.',
        {
          tur: 'tablo',
          basliklar: ['Edebî metin', 'Öğretici metin'],
          satirlar: [
            ['Kurmaca', 'Gerçek'],
            ['Çok anlamlı', 'Tek anlamlı'],
            ['Sezdirir', 'Bilgi verir'],
            ['Sanatsal dil', 'Açık dil'],
          ],
        },
      ),
      kart(
        'Üç gerçeklik',
        '- **Yaşanan gerçeklik:** dış dünyada olan, belgelenebilen\n- **Kurmaca gerçeklik:** metnin içinde inandırıcı olan; yaşanmış olması gerekmez\n- **Fantastik gerçeklik:** olağanüstü olan; masal, efsane, bilim kurgu',
      ),
      kart(
        'Metinler dört kümede',
        '- **Anlatmaya bağlı:** olay bir anlatıcı ağzından aktarılır.\n- **Göstermeye bağlı:** olay sahnede oynanır.\n- **Coşku ve heyecana bağlı:** şiir\n- **Öğretici:** bilgi ya da düşünce aktarır.',
      ),
      kart(
        'Anlatmaya bağlı türler',
        '- **Masal:** olağanüstü, "bir varmış bir yokmuş"\n- **Fabl:** hayvanlarla ders veren anlatı\n- **Destan:** toplumu derinden etkileyen olay\n- **Halk hikâyesi:** âşık anlatır, nazım-nesir karışık\n- **Hikâye, roman:** yazılı, gerçekçi kurmaca',
      ),
      kart(
        'Göstermeye bağlı türler',
        'Anlatıcı yoktur; olay diyalogla ve oyunla gösterilir.\n- **Batılı:** trajedi, komedi, dram\n- **Geleneksel:** karagöz, orta oyunu, meddah, köy seyirlik oyunları',
      ),
      kart(
        'Şiir türleri (konuya göre)',
        '- **Lirik:** duygu ve coşku\n- **Epik:** kahramanlık\n- **Didaktik:** öğüt, bilgi\n- **Pastoral:** doğa ve kır hayatı\n- **Satirik:** yergi\n- **Dramatik:** şiir biçiminde oyun',
      ),
      kart(
        'Öğretici metin: düşünce yazıları',
        '- **Makale:** kanıtla savunur.\n- **Deneme:** kişisel düşünce, kanıtsız\n- **Fıkra:** güncel konu, kısa köşe yazısı\n- **Sohbet:** okurla konuşur gibi\n- **Eleştiri:** eseri değerlendirir.',
      ),
      kart(
        'Öğretici metin: yaşamdan',
        '- **Anı:** yaşananı yıllar sonra anlatır.\n- **Günlük:** o günü, tarih atarak yazar.\n- **Gezi yazısı:** görülen yerleri anlatır.\n- **Biyografi:** başkasının hayatı\n- **Otobiyografi:** kendi hayatı\n- **Mektup:** birine yazılır.',
      ),
      kart(
        'Öğretici metin: basın',
        '- **Haber:** 5N1K sorularına cevap verir, yorum katmaz.\n- **Röportaj:** yazar bir yeri ya da kişiyi yerinde inceler.\n- **Mülakat:** soru-cevapla bir kişinin görüşü alınır.',
      ),
      kart(
        'Dilin işlevleri',
        '- **Göndergesel:** bilgi verir (öğretici metin).\n- **Şiirsel:** dilin kendisi öne çıkar (edebî metin).\n- **Heyecana bağlı:** duygu bildirir.\n- **Alıcıyı harekete geçirme:** emir, rica\n- **Kanalı kontrol:** "Duyuyor musun?"',
      ),
      kart(
        'Sanat için mi, toplum için mi?',
        '- **Toplum için sanat:** eser topluma bir fikir iletir (Tanzimat I, Millî Edebiyat).\n- **Sanat için sanat:** güzellik amaçtır (Servetifünun, Fecriâti).',
      ),
      kart(
        'Edebiyatın öteki bilimlerle ilişkisi',
        'Edebî metne başvuran bilimler:\n- **Tarih:** dönemin olaylarını anlamak için\n- **Sosyoloji:** toplumu anlamak için\n- **Psikoloji:** insanı anlamak için',
      ),
      kart(
        'Güzel sanatlarda edebiyatın yeri',
        'Sanatlar malzemesine göre ayrılır:\n- **Fonetik (ses):** edebiyat, müzik\n- **Plastik (madde):** resim, heykel\n- **Dramatik (hareket):** tiyatro, dans',
      ),
    ], [
      soru('Edebiyatın malzemesi dildir.', true, 'Ressamın boyası neyse yazarın dili odur.'),
      soru('Kurmaca metinlerde anlatılanların gerçekte yaşanmış olması gerekir.', false, 'Kurmaca gerçeğe benzeyebilir ama gerçek olmak zorunda değil.'),
      soru('Öğretici metinlerde amaç bilgi vermektir.', true, 'Edebî metinde amaç estetik bir etki bırakmak.'),
      soru('Edebiyat güzel sanatların içinde yer almaz.', false, 'Dille yapılan bir güzel sanat dalıdır.'),
      sikli('Edebiyat malzemesine göre hangi sanat grubundadır?', ['Fonetik', 'Plastik'], 0, 'Dille yapılan sanat.'),
      sikli('Deneme ve makale hangi metin grubudur?', ['Düşünce ağırlıklı', 'Olay çevresinde gelişen'], 0, 'Hikâye ve roman olay çevresinde.'),
      soru('Edebî metinler tarih ve sosyoloji gibi bilimlere kaynak olabilir.', true, 'Bir dönemin olaylarını ve toplumunu anlamak için edebî metne başvurulur.'),
      soru('Fantastik gerçeklikte olağanüstü olaylar yer alabilir.', true, 'Masal, efsane ve bilim kurgu bu gerçekliği kullanır.'),
      soru('Tiyatro anlatmaya bağlı bir türdür.', false, 'Göstermeye bağlıdır: anlatıcı yok, olay sahnede oynanır.'),
      soru('Fabl, hayvanları konuşturarak ders veren bir anlatıdır.', true, 'La Fontaine\'in masalları bilinen örnekler.'),
      soru('Anı, yaşananların o gün tarih atılarak yazılmasıdır.', false, 'O günlük. Anı, yaşanandan yıllar sonra geriye bakarak yazılır.'),
      soru('Haber metninde yazar olaya kendi yorumunu katar.', false, 'Haber 5N1K sorularına nesnel cevap verir; yorum köşe yazısının işi.'),
      sikli('Kişinin kendi hayatını anlattığı tür?', ['Biyografi', 'Otobiyografi'], 1, 'Biyografi başkasının hayatını anlatır.'),
      sikli('Doğayı ve kır hayatını işleyen şiir türü?', ['Pastoral', 'Epik'], 0, 'Epik kahramanlık şiiri.'),
      sikli('Servetifünun hangi anlayışı benimser?', ['Toplum için sanat', 'Sanat için sanat'], 1, 'Tanzimat\'ın ilk kuşağı ve Millî Edebiyat toplum için sanatı savunur.'),
      sikli('Öğretici metinde dilin öne çıkan işlevi?', ['Göndergesel', 'Şiirsel'], 0, 'Şiirsel işlevde dilin kendisi öne çıkar; o edebî metnin işi.'),
      sikli('Karagöz ve orta oyunu hangi kümededir?', ['Anlatmaya bağlı', 'Göstermeye bağlı'], 1, 'Geleneksel Türk tiyatrosu; olay oynanarak gösterilir.'),
    ], [
      {
        soru: 'Yaşanmış bir olayı anlatan romandaki olaylar ne sayılır?',
        siklar: ['Belge', 'Kurmaca'],
        dogru: 1,
        aciklama: {
          dogru: 'Edebî metin gerçeği aktarmaz, yeniden kurar; metindeki hâli kurmacadır.',
          yanlis: 'Belge öğretici metnin işi. Roman yaşanmışı bile yeniden kurar; metindeki olay artık kurmacadır.',
        },
        kart: 2,
      },
      {
        soru: 'Yaşadıklarını o gün, tarih atarak yazan hangi türü yazar?',
        siklar: ['Anı', 'Günlük'],
        dogru: 1,
        aciklama: {
          dogru: 'Günlük o günün yazısıdır; anı yıllar sonra geriye bakarak yazılır.',
          yanlis: 'Anı yıllar sonra hatırlanarak yazılır. Tarih atılıp aynı gün yazılan tür günlük.',
        },
        kart: 10,
      },
    ]),
    konu('trk9-siir', 'Şiir Bilgisi', [
      kart(
        'Nazım birimi',
        'Şiirin yapı taşıdır: dize (mısra), beyit, dörtlük\n- **Halk şiiri:** dörtlük\n- **Divan şiiri:** beyit',
      ),
      kart(
        'Ölçü',
        '- **Hece ölçüsü:** dizelerin hece sayısı eşit\n- **Aruz ölçüsü:** hecelerin uzunluk-kısalığı esas\n- **Serbest şiir:** ölçü aranmaz',
      ),
      kart(
        'Durak',
        'Hece ölçüsünde dizenin bölündüğü yerdir.\nDurak sözcüğü ortadan bölmez; sözcüğü kesen bölüm durak sayılmaz.',
      ),
      kart(
        'Hece ölçüsünün kalıpları',
        'Ölçü, dizedeki hece sayısıyla adlandırılır.\n- **7’li:** 4+3 (mani)\n- **8’li:** 4+4 (semai, varsağı)\n- **11’li:** 6+5 ya da 4+4+3 (koşma)\nHalk arasında "parmak hesabı" da denir.',
      ),
      kart(
        'Aruz nasıl işler?',
        'Heceler sayılmaz, açık-kapalı diye dizilir:\n- **Açık hece (.):** kısa ünlüyle biter (ba).\n- **Kapalı hece (–):** ünsüzle ya da uzun ünlüyle biter (bak, bâ).\nKalıp örneği: Fâ-i-lâ-tün / Fâ-i-lâ-tün / Fâ-i-lün',
      ),
      kart(
        'Uyak ve redif',
        '- **Redif:** dize sonundaki aynı görevli ek ya da sözcük\n- **Uyak:** redifin önündeki ses benzerliği',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Önce redifi bul' },
            { ad: 'Kalanı karşılaştır' },
            { ad: 'Uyak türünü söyle' },
          ],
        },
      ),
      kart(
        'Uyak çeşitleri',
        'Redif atıldıktan sonra kalan ses benzerliği sayılır.\nTabloda üç tür var.',
        {
          tur: 'tablo',
          basliklar: ['Uyak', 'Benzerlik'],
          satirlar: [
            ['Yarım', '1 ses'],
            ['Tam', '2 ses'],
            ['Zengin', '2’den çok ses'],
          ],
        },
      ),
      kart(
        'Uyak düzeni',
        '- **Düz:** aaab\n- **Çapraz:** abab\n- **Sarma:** abba\n- **Mesnevi:** aa, bb, cc',
      ),
      kart(
        'İmge',
        'Şair sözcükleri alışılmadık biçimde birleştirip zihinde yeni bir görüntü kurar.\nŞiiri düzyazıdan ayıran asıl şey budur.',
      ),
      kart(
        'Ahenk ögeleri',
        'Ölçü, uyak ve redif şiirin sesini kurar. Bunlara iki öge daha eklenir:\n- **Aliterasyon:** ünsüz yinelemesi\n- **Asonans:** ünlü yinelemesi',
      ),
      kart(
        'Konu, tema, ileti',
        '- **Konu:** şiirde neden söz edildiği\n- **Tema:** şiire egemen duygu (ölüm, aşk, gurbet)\n- **İleti:** okura verilmek istenen mesaj\nTema tek sözcükle söylenir; ileti bir yargıdır.',
      ),
      kart(
        'Nazım şekli ve nazım türü',
        '- **Nazım şekli:** dış yapı; ölçü, uyak düzeni, birim (koşma, gazel)\n- **Nazım türü:** konu (güzelleme, ağıt, taşlama)\nAynı koşma biçimiyle hem ağıt hem taşlama yazılabilir.',
      ),
      kart(
        'Halk şiirinin nazım şekilleri',
        '- **Mani:** tek dörtlük, 7’li, aaxa\n- **Koşma:** 3-5 dörtlük, 11’li, xaxa bbba\n- **Semai:** 8’li, kendine özgü ezgiyle okunur.\n- **Varsağı:** 8’li, "bre, hey" gibi ünlemlerle',
      ),
      kart(
        'Koşmanın türleri',
        'Koşma konusuna göre ad alır:\n- **Güzelleme:** sevgili ve doğa\n- **Koçaklama:** yiğitlik, savaş\n- **Ağıt:** ölüm acısı\n- **Taşlama:** yergi\n- **Nasihat:** öğüt',
      ),
      kart(
        'Divan şiirinin nazım şekilleri',
        '- **Gazel:** 5-15 beyit, aşk; aa ba ca\n- **Kaside:** 33-99 beyit, övgü\n- **Rubai:** 4 dize, aaxa, felsefi\n- **Mesnevi:** her beyit kendi içinde uyaklı, uzun anlatı',
      ),
      kart(
        'Uyak sorusunda yol',
        '- Önce dize sonundaki redifi at.\n- Kalan ses benzerliğini say: 1 ses yarım, 2 ses tam, 3+ zengin.\nÖrnek: gözlerim / sözlerim → -lerim redif, "öz" tam uyak',
        undefined,
        { not: '\'gözlerim / sözlerim\': -lerim redif, kalan \'öz\' iki ses → tam uyak. Önce redifi at, sonra say.' },
      ),
    ], [
      soru('Redif, dize sonlarında görevi ve anlamı aynı olan ek ya da sözcüklerin tekrarıdır.', true, 'Uyaktan sonra gelir ve uyakla karıştırılmamalı.'),
      soru('Hece ölçüsünde dizelerdeki hece sayısı eşittir.', true, 'Ölçü, dizenin hece sayısıyla adlandırılıyor: 7 li, 11 li gibi.'),
      soru('Nazım birimi dörtlük olan bir şiirde her bölüm iki dizeden oluşur.', false, 'Dörtlük dört dizeden oluşur; iki dizelik birim beyittir.'),
      soru('İmge, sözcüğün sözlükteki ilk anlamıdır.', false, 'İmge, şairin sözcüklerle kurduğu yeni ve özgün tasarım.'),
      sikli('abab uyak düzenine ne denir?', ['Çapraz', 'Sarma'], 0, 'Sarma abba.'),
      sikli('Divan şiirinin nazım birimi?', ['Beyit', 'Dörtlük'], 0, 'Halk şiirinde dörtlük.'),
      sikli('Ünsüz yinelemesine ne denir?', ['Aliterasyon', 'Asonans'], 0, 'Asonans ünlü.'),
      sikli('"Gözlerim / sözlerim" dizelerinde uyak türü?', ['Tam uyak', 'Zengin uyak'], 0, '-lerim redif, "öz" iki ses.'),
      sikli('Hece ölçüsünde sözcüğü ortadan bölen bölüm?', ['Durak sayılır', 'Durak sayılmaz'], 1, 'Hece tutsa bile.'),
      soru('Serbest şiirde ölçü aranmaz.', true, 'Ahenk başka araçlarla kurulur.'),
      soru('Aruz ölçüsünde hecelerin sayısı değil uzunluğu ve kısalığı esastır.', true, 'Hece ölçüsü heceleri sayar; aruz açık ve kapalı heceleri dizer.'),
      soru('Koşma genellikle 11’li hece ölçüsüyle yazılır.', true, 'Duraklar 6+5 ya da 4+4+3.'),
      soru('Aruzda ünsüzle biten hece açık hecedir.', false, 'Ünsüzle biten hece kapalıdır; açık hece kısa ünlüyle biter.'),
      soru('Nazım türü şiirin konusuna göre belirlenir.', true, 'Biçimi belirleyen nazım şekli; ağıt, taşlama gibi adlar konudan gelir.'),
      soru('Gazel, dörtlüklerle yazılan bir halk şiiri biçimidir.', false, 'Gazel beyitlerle yazılan divan şiiri biçimidir.'),
      soru('Mani tek dörtlükten oluşur.', true, '7’li hece ölçüsüyle ve çoğunlukla aaxa uyaklı.'),
      sikli('Yiğitlik ve savaşı işleyen koşma türü?', ['Güzelleme', 'Koçaklama'], 1, 'Güzelleme sevgiliyi ve doğayı işler.'),
      sikli('Şiire egemen olan duyguya ne denir?', ['Tema', 'Nazım şekli'], 0, 'Nazım şekli şiirin dış yapısı.'),
      sikli('Dört dizelik, aaxa uyaklı divan şiiri biçimi?', ['Rubai', 'Kaside'], 0, 'Kaside 33-99 beyitlik övgü şiiri.'),
    ], [
      {
        soru: '"Dağlara / bağlara" dizelerinde "-lara" nedir?',
        siklar: ['Redif', 'Uyak'],
        dogru: 0,
        aciklama: {
          dogru: 'Aynı görevdeki ek redif; önündeki "ağ" sesleri tam uyak.',
          yanlis: 'Uyak, redifin önündeki ses benzerliği ("ağ"). Aynı görevdeki ek olan "-lara" rediftir.',
        },
        kart: 6,
      },
      {
        soru: 'Tek dörtlükten oluşan, 7’li hece ölçüsüyle yazılan halk şiiri?',
        siklar: ['Koşma', 'Mani'],
        dogru: 1,
        aciklama: {
          dogru: 'Mani tek dörtlük ve 7’li; koşma 3-5 dörtlük ve 11’li.',
          yanlis: 'Koşma birkaç dörtlükten oluşur ve 11’lidir. Tek dörtlüklü 7’li biçim mani.',
        },
        kart: 13,
      },
    ]),
    konu('trk9-sanat', 'Söz Sanatları', [
      kart(
        'Benzetme (teşbih)',
        'Bir şeyi ortak yönü olan başka bir şeye benzetmektir.\nDört ögesi vardır.',
      ),
      kart(
        'Benzetmenin ögeleri',
        'İki temel öge **benzeyen** ile **kendisine benzetilendir**; ötekiler düşebilir.\n"Aslan gibi güçlü çocuk" dört ögeyi de taşır.',
        {
          tur: 'tablo',
          basliklar: ['Öge', 'Örnek'],
          satirlar: [
            ['Benzeyen', 'Çocuk'],
            ['Benzetilen', 'Aslan'],
            ['Yön', 'Güçlü'],
            ['Edat', 'Gibi'],
          ],
        },
      ),
      kart(
        'Benzetmenin türleri',
        '- **Tam benzetme:** dört öge de var ("aslan gibi güçlü çocuk").\n- **Kısaltılmış:** yön ya da edat düşer ("aslan gibi çocuk").\n- **Güçlü benzetme:** yalnız iki temel öge ("aslan çocuk").',
      ),
      kart(
        'İstiare',
        'Benzetmenin iki temel ögesinden **yalnız biri** söylenirse istiare olur.\n"Aslanım geldi" derken benzeyen (kişi) söylenmemiştir.',
      ),
      kart(
        'Açık ve kapalı istiare',
        '- **Açık istiare:** yalnız benzetilen söylenir.\n- **Kapalı istiare:** yalnız benzeyen söylenir, benzetilene ait bir özellik verilir.',
      ),
      kart(
        'Kişileştirme',
        'İnsana özgü nitelikleri başka varlıklara vermektir: "Rüzgâr fısıldıyordu."\nKişileştirme varsa kapalı istiare de vardır.',
      ),
      kart(
        'Mecaz-ı mürsel',
        'Benzetme amacı olmadan bir sözü başka bir söz yerine kullanmaktır.\n"Ankara açıklama yaptı" (hükûmet yerine şehir)',
      ),
      kart(
        'Tezat ve tevriye',
        '- **Tezat:** karşıt kavramları bir arada kullanmak\n- **Tevriye:** iki anlamlı sözü, uzak anlamını kastederek söylemek',
      ),
      kart(
        'Abartma ve konuşturma',
        '- **Abartma (mübalağa):** bir niteliği olduğundan çok göstermek\n- **Konuşturma (intak):** insan dışı varlıkları konuşturmak',
      ),
      kart(
        'Kinaye ve tariz',
        '- **Kinaye:** söz hem gerçek hem mecaz düşünülür, mecaz kastedilir ("Saçına ak düştü").\n- **Tariz:** söylenenin tersi kastedilir, iğneler ("Aferin, yine geç kaldın").',
      ),
      kart(
        'Hüsn-i talil ve tecahül-i arif',
        '- **Hüsn-i talil:** gerçek bir olaya hayalî, güzel bir neden bulmak\n- **Tecahül-i arif:** bilip de bilmezlikten gelmek\n"Gökyüzü ağlıyor senin gidişine" hüsn-i talildir.',
      ),
      kart(
        'Telmih ve irsal-i mesel',
        '- **Telmih:** bilinen bir olaya, kişiye ya da hikâyeye gönderme ("Ferhat’ın dağı delişi")\n- **İrsal-i mesel:** sözü bir atasözüyle desteklemek',
      ),
      kart(
        'Cinas ile tevriye',
        'İkisinde de eş sesli sözcük vardır:\n- **Cinas:** eş sesli sözcükler iki ayrı anlamıyla birlikte kullanılır.\n- **Tevriye:** tek sözcük kullanılır, uzak anlamı kastedilir.',
      ),
      kart(
        'Nida, istifham, tekrir',
        '- **Nida:** coşkuyla seslenme ("Ey vatan!")\n- **İstifham:** cevap beklemeden soru sorup anlamı güçlendirme\n- **Tekrir:** etkiyi artırmak için sözcük yineleme',
      ),
      kart(
        'Sanatı tanımada kısayol',
        '- **"Gibi, kadar" varsa:** benzetme\n- **Temel ögelerden biri yoksa:** istiare\n- **Varlık insan gibi davranıyorsa:** kişileştirme\n- **Parça-bütün, yer-insan ilişkisi:** mecaz-ı mürsel',
        undefined,
        { not: '\'Aslan gibi adam\' benzetme; \'Aslanım geldi\' açık istiare (benzeyen yok); \'Rüzgâr ağlıyor\' kişileştirme.' },
      ),
    ], [
      soru('Benzetmede benzeyen, kendisine benzetilen, benzetme yönü ve benzetme edatı bulunur.', true, 'Dördü de kullanılırsa tam benzetme olur.'),
      soru('İstiarede benzetmenin temel ögelerinden yalnızca biri kullanılır.', true, 'Yalnız benzeyen varsa kapalı, yalnız kendisine benzetilen varsa açık istiare.'),
      soru('Kişileştirme yapılan her dizede konuşturma da vardır.', false, 'Konuşturma kişileştirmenin ileri adımı; her kişileştirmede bulunmaz.'),
      soru('Mecaz-ı mürselde benzetme amacı vardır.', false, 'Benzetme yoktur; parça-bütün, iç-dış gibi bir ilgi kurulur.'),
      sikli('"Rüzgâr fısıldıyordu" cümlesindeki sanat?', ['Abartma', 'Kişileştirme'], 1, 'Kapalı istiare de var.'),
      sikli('"Rüzgâr gibi koştu" cümlesinde benzetme yönü hangisidir?', ['Hız (koşmak)', 'Rüzgâr'], 0, 'Rüzgâr kendisine benzetilen; ortak nitelik hız.'),
      sikli('"Aslanım geldi" ifadesinde ne var?', ['Benzetme', 'Açık istiare'], 1, 'Yalnız benzetilen söylenmiş.'),
      sikli('İki anlamlı sözü uzak anlamıyla kastetmek?', ['Tezat', 'Tevriye'], 1, 'Tezat karşıt kavramlar.'),
      sikli('İnsan dışı varlıkları konuşturmak?', ['İntak', 'Mübalağa'], 0, 'Mübalağa abartma.'),
      soru('"Ağlarım hatıra geldikçe güldüğüm günler" dizesinde tezat vardır.', true, 'Ağlamak ile gülmek karşıt kavramlar bir arada.'),
      soru('"Aslan çocuk" ifadesinde güçlü benzetme vardır.', true, 'Yalnız iki temel öge var; yön ve edat düşmüş.'),
      soru('Tariz, söylenenin olduğu gibi kastedildiği bir sanattır.', false, 'Tariz söylenenin tersini kastederek iğneler.'),
      soru('Telmih, bilinen bir olaya ya da kişiye gönderme yapmaktır.', true, 'Okur o olayı bildiği için söz kısa kalır ama çok şey anlatır.'),
      soru('Cinasta eş sesli sözcüklerden yalnızca biri kullanılır.', false, 'Cinasta eş sesliler birlikte kullanılır; tek sözcükle uzak anlamı kastetmek tevriyedir.'),
      sikli('Bilip de bilmezlikten gelmeye ne denir?', ['Hüsn-i talil', 'Tecahül-i arif'], 1, 'Hüsn-i talil güzel bir neden bulmaktır.'),
      sikli('"Ey vatan!" seslenmesindeki sanat?', ['Nida', 'İstifham'], 0, 'İstifham cevap beklemeden soru sormak.'),
      sikli('Sözü bir atasözüyle desteklemek?', ['Telmih', 'İrsal-i mesel'], 1, 'Telmih bilinen bir olaya gönderme.'),
    ], [
      {
        soru: '"Bütün sınıf ayağa kalktı" cümlesindeki sanat?',
        siklar: ['Mecaz-ı mürsel', 'Benzetme'],
        dogru: 0,
        aciklama: {
          dogru: '"Sınıf" yer adı, kastedilen öğrenciler; benzetme amacı yok.',
          yanlis: 'Benzetmede iki şey arasında ortak yön kurulur. Burada yer adı içindeki insanların yerine kullanılmış: mecaz-ı mürsel.',
        },
        kart: 7,
      },
      {
        soru: 'Yağmurun yağışını sevgilinin gidişine bağlamak hangi sanat?',
        siklar: ['Hüsn-i talil', 'Tariz'],
        dogru: 0,
        aciklama: {
          dogru: 'Gerçek bir olaya (yağmur) hayalî, güzel bir neden bulunmuş.',
          yanlis: 'Tariz söylenenin tersini kastedip iğneler. Doğa olayına güzel bir neden bulmak hüsn-i talil.',
        },
        kart: 11,
      },
    ]),
    konu('trk9-deneme', 'Deneme ve Düşünce Yazıları', [
      kart(
        'Deneme',
        'Yazar bir konudaki kendi düşüncelerini samimi bir dille anlatır.\nKanıtlama kaygısı gütmez. Türün kurucusu **Montaigne**’dir.',
      ),
      kart(
        'Denemenin dili',
        '- Konu sınırı yoktur; her şey deneme konusu olabilir.\n- "Ben" diliyle, samimi ve içten yazılır.\n- Kesin yargıya varmaz, okuru düşünmeye çağırır.',
      ),
      kart(
        'Makale',
        'Bir düşünceyi kanıtlarla savunur.\nNesnel dil kullanılır, kaynak gösterilir.',
      ),
      kart(
        'Makalenin yapısı',
        '- **Giriş:** savunulan düşünce (tez) ortaya konur.\n- **Gelişme:** tez kanıt, örnek ve veriyle desteklenir.\n- **Sonuç:** varılan yargı özetlenir.\nAçıklayıcı ve tartışmacı anlatım ağır basar.',
      ),
      kart(
        'Fıkra (köşe yazısı)',
        'Güncel bir konuyu kısa ve kişisel bir üslupla ele alır.\nKanıtlama zorunluluğu yoktur.',
      ),
      kart(
        'Fıkranın yeri',
        '- Gazete ve dergilerin köşesinde yayımlanır.\n- Güncel konu kısa ve esprili bir dille işlenir.\n- Yazar kendi görüşünü söyler, kanıt aramaz.\nTemsilciler: Ahmet Rasim, Falih Rıfkı Atay',
      ),
      kart(
        'Söyleşi ve eleştiri',
        '- **Söyleşi:** karşısında biri varmış gibi yazılır.\n- **Eleştiri:** bir eserin değerini ölçütlerle değerlendirir.',
      ),
      kart(
        'Sohbet (söyleşi)',
        'Yazar okurla konuşuyormuş gibi yazar; "siz, biz" hitapları sıktır.\nKonu derinleştirilmez, dil samimi ve akıcıdır.\nTemsilciler: Ahmet Rasim, Hasan Âli Yücel',
      ),
      kart(
        'Eleştirinin türleri',
        '- **Nesnel eleştiri:** ölçütlere ve kanıta dayanarak değerlendirir.\n- **Öznel (izlenimci) eleştiri:** eserin eleştirmende bıraktığı izlenimi anlatır.\nİlk örneklerden: Namık Kemal, Tahrib-i Harabat',
      ),
      kart(
        'Nerede ayrışırlar?',
        'Dört türü ayıran şey konu değildir.\nAyıran şey kanıt ve dil tercihidir.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Kanıt', 'Dil'],
          satirlar: [
            ['Makale', 'Şart', 'Nesnel'],
            ['Deneme', 'Yok', 'Öznel'],
            ['Fıkra', 'Yok', 'Samimi'],
            ['Eleştiri', 'Ölçüt', 'Karma'],
          ],
        },
        { not: 'Aynı konu: makale kaynak gösterip kanıtlar, deneme \'bence\' der, fıkra güncel ve kısa, eleştiri eseri tartar.' },
      ),
      kart(
        'Türk edebiyatında',
        'Fıkra Tanzimat’ta gazeteyle gelişti; deneme Cumhuriyet’te olgunlaştı.\nDenemenin öne çıkan adları: Nurullah Ataç, Suut Kemal Yetkin',
      ),
    ], [
      soru('Denemede yazar düşüncesini kanıtlama kaygısı gütmez.', true, 'Kendi kendine konuşur gibi yazar; okuru ikna etme zorunluluğu yok.'),
      soru('Makale, bir düşünceyi kanıtlarla savunan öğretici metindir.', true, 'Bilimsel veriye ve kaynağa dayanır.'),
      soru('Fıkra, uzun uzun kanıt sunan bilimsel bir yazı türüdür.', false, 'Kısa, günlük dille yazılır ve kanıtlama kaygısı taşımaz.'),
      soru('Deneme ile makale arasında bir fark yoktur.', false, 'Makale kanıtlar, deneme düşündürür; üslupları da ayrı.'),
      sikli('Denemenin kurucusu kimdir?', ['Ataç', 'Montaigne'], 1, 'Nurullah Ataç Türk edebiyatında.'),
      sikli('Karşısında biri varmış gibi yazılan düşünce yazısı?', ['Makale', 'Söyleşi'], 1, 'Söyleşide yazar okurla sohbet eder gibi yazar.'),
      soru('Eleştiri bir eseri ölçütlerle değerlendirir.', true, 'Söyleşi karşısında biri varmış gibi.'),
      soru('Denemede her konu işlenebilir.', true, 'Denemenin konu sınırı yok; sınırlayan yazarın bakışı.'),
      soru('Denemede yazar kesin bir yargıya varmak zorundadır.', false, 'Deneme sonuç bağlamak zorunda değil; okuru düşünmeye çağırır.'),
      soru('Makalenin giriş bölümünde savunulacak düşünce ortaya konur.', true, 'Gelişmede kanıtlanır, sonuçta toparlanır.'),
      soru('Öznel eleştiri, eseri yalnızca belirli ölçütlere dayanarak değerlendirir.', false, 'Ölçüte dayanan nesnel eleştiri; öznel eleştiri izlenimi anlatır.'),
      soru('Sohbette yazar okurla karşılıklı konuşuyormuş gibi yazar.', true, '"Siz, biz" hitapları bu yüzden sık.'),
      sikli('Fıkralar genellikle nerede yayımlanır?', ['Gazete köşesinde', 'Bilimsel dergide'], 0, 'Bilimsel dergide makale yayımlanır.'),
      sikli('Tahrib-i Harabat hangi türün ilk örneklerindendir?', ['Sohbet', 'Eleştiri'], 1, 'Namık Kemal, Ziya Paşa\'nın Harabat\'ını eleştirir.'),
    ], [
      {
        soru: 'Kaynak gösterip kanıtla savunan düşünce yazısı?',
        siklar: ['Makale', 'Deneme'],
        dogru: 0,
        aciklama: {
          dogru: 'Makale nesnel dil ve kanıt ister; deneme kanıtlama kaygısı gütmez.',
          yanlis: 'Deneme kişisel ve kanıtsızdır. Kanıt ve kaynak gösteren tür makale.',
        },
        kart: 3,
      },
      {
        soru: 'Eserin eleştirmende bıraktığı izlenimi anlatan eleştiri?',
        siklar: ['Nesnel eleştiri', 'Öznel eleştiri'],
        dogru: 1,
        aciklama: {
          dogru: 'İzlenimci eleştiri kişiseldir; nesnel eleştiri ölçütlere dayanır.',
          yanlis: 'Nesnel eleştiri ölçüt ve kanıtla çalışır. İzlenimi anlatan öznel (izlenimci) eleştiri.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('trk9-t2', 'Anlam Arayışı', [
    konu('trk9-sozcuk', 'Sözcükte Anlam', [
      kart(
        'Gerçek anlam',
        'Sözcüğün akla ilk gelen, sözlükteki temel anlamıdır.\nÖrnek: soğuk su',
      ),
      kart(
        'Mecaz anlam',
        'Sözcüğün gerçek anlamından tümüyle uzaklaşarak kazandığı anlamdır.\nÖrnek: soğuk davranış',
      ),
      kart(
        'Yan anlam',
        'Gerçek anlamla bağı sürerken kazanılan yeni anlamdır.\nÖrnek: masanın ayağı\nMecazla karıştırılır; yan anlamda benzerlik bağı durur.',
      ),
      kart(
        'Üçünü ayırmak',
        'Sorulacak soru: gerçek anlamla bağ tümüyle koptu mu?\nBir benzerlik hâlâ duruyorsa yan anlamdır.',
        {
          tur: 'tablo',
          basliklar: ['Anlam', 'Örnek'],
          satirlar: [
            ['Gerçek', 'Ağaç dalı'],
            ['Yan', 'Bilim dalı'],
            ['Mecaz', 'Dalına basmak'],
          ],
        },
        { not: '\'Masanın ayağı\' yan anlam (taşıma işlevi sürüyor), \'işin ayağı\' mecaz (bağ kopmuş). Bağ var mı sor.' },
      ),
      kart(
        'Terim anlam',
        'Bir bilim, sanat ya da meslek alanına özgü anlamdır.\n"Kök" matematikte, dil bilgisinde ve biyolojide ayrı şeydir.',
      ),
      kart(
        'Somut ve soyut',
        '- **Somut:** duyularla algılanır (ağır çanta).\n- **Soyut:** duyularla algılanamaz (ağır söz).',
      ),
      kart(
        'Genel ve özel anlam',
        'Kapsamı geniş olan genel, dar olan özeldir.\nvarlık → bitki → ağaç → çam\nSıra daraldıkça anlam özelleşir.',
      ),
      kart(
        'Nitel ve nicel',
        '- **Nicel:** ölçülebilir (üç metre)\n- **Nitel:** niteleme bildirir (güzel manzara)',
      ),
      kart(
        'Soru kalıbı',
        '"Hangisinde mecaz anlamda?" sorusunda sözcüğü somut karşılığıyla düşün.\n- **Somut karşılık tümüyle kaybolmuşsa:** mecaz\n- **Benzerlik bağı duruyorsa:** yan anlam',
      ),
      kart(
        'Dolaylama ve yansıma',
        '- **Dolaylama:** kavramı birden çok sözcükle anlatmak ("beyaz altın" = pamuk)\n- **Yansıma:** doğadaki sesi taklit eden sözcük ("şırıl şırıl")',
      ),
      kart(
        'Aktarmalar',
        '- **Ad aktarması:** bir ad, ilgili başka şeyin yerine ("Bütün köy toplandı")\n- **Deyim aktarması:** insana ait özellik başka varlığa ("Güneş gülümsüyor")\n- **Duyu aktarması:** bir duyu başka duyuyla anlatılır ("acı ses")',
      ),
      kart(
        'Güzel adlandırma ve örtmece',
        '- **Güzel adlandırma:** benzerlikten yola çıkarak ad vermek (hanımeli, aslanağzı, kuşburnu)\n- **Örtmece:** kaba ya da kötü sayılan sözün yerine hafifini kullanmak ("ölmek" yerine "vefat etmek")',
      ),
      kart(
        'Eş, zıt ve eş sesli',
        '- **Eş anlamlı:** yazılışı farklı, anlamı aynı (siyah – kara)\n- **Zıt anlamlı:** karşıt anlamlı (ak – kara)\n- **Eş sesli:** yazılışı aynı, anlamı farklı (yüz, gül, çay)\nEş sesliyi ayıran, cümledeki kullanımıdır.',
      ),
    ], [
      soru('Bir sözcüğün akla ilk gelen anlamına gerçek anlam denir.', true, 'Temel anlam da denir.'),
      soru('"Ağır bir soru" ifadesinde "ağır" gerçek anlamıyla kullanılmıştır.', false, 'Burada "zor" anlamında; mecaz anlam.'),
      soru('Terim anlam, bir bilim ya da sanat dalına özgü anlamdır.', true, '"Kök" sözcüğünün matematikteki karşılığı buna örnek.'),
      soru('Somut anlamlı sözcükler duyu organlarıyla algılanamayan kavramları karşılar.', false, 'Tersi: somut olan algılanabilir, algılanamayan soyuttur.'),
      sikli('"Kitabın sırtı yırtıldı" cümlesinde "sırt" hangi anlamda?', ['Mecaz', 'Yan anlam'], 1, 'Gövdenin arka yüzüyle benzerlik bağı sürüyor.'),
      sikli('Hangisinde terim anlamlı bir sözcük var?', ['Futbolda "ofsayt"', '"Soğuk bakış"'], 0, 'Ofsayt yalnızca futbol alanına özgü bir kavram.'),
      sikli('"Ağır söz" hangi kullanımdır?', ['Soyut', 'Somut'], 0, 'Ağır çanta somut.'),
      sikli('varlık → bitki → ağaç → çam sırası?', ['Genelden özele', 'Özelden genele'], 0, 'Kapsam daralıyor.'),
      sikli('"Beyaz altın" (pamuk) ne örneğidir?', ['Yansıma', 'Dolaylama'], 1, 'Yansıma ses taklidi.'),
      sikli('"Üç metre" hangi anlamdır?', ['Nitel', 'Nicel'], 1, 'Ölçülebilir.'),
      soru('"İşin ayağı" ifadesinde "ayak" yan anlamda kullanılmıştır.', false, 'Gerçek anlamla bağ kopmuş; mecaz anlam.'),
      soru('"Acı bir ses" ifadesinde duyu aktarması vardır.', true, 'Tat duyusuna ait "acı" işitmeyi anlatıyor.'),
      soru('"Vefat etmek" ifadesi "ölmek" sözünün örtmecesidir.', true, 'Kaba ya da ağır sayılan söz yumuşatılmış.'),
      soru('Eş anlamlı sözcüklerin yazılışları aynıdır.', false, 'Yazılışı aynı olan eş sesli; eş anlamlılar farklı yazılır.'),
      soru('"Güneş gülümsüyor" cümlesinde ad aktarması vardır.', false, 'Gülümsemek insana özgü: deyim aktarması, yani kişileştirme.'),
      sikli('"Aslanağzı" çiçeğinin adı nasıl oluşmuştur?', ['Güzel adlandırma', 'Yansıma'], 0, 'Benzerlikten yola çıkılarak ad verilmiş.'),
    ], [
      {
        soru: '"Masanın ayağı kırıldı" cümlesinde "ayak" hangi anlamda?',
        siklar: ['Yan anlam', 'Mecaz anlam'],
        dogru: 0,
        aciklama: {
          dogru: 'Gerçek anlamla benzerlik bağı duruyor: taşıma işlevi ve konum.',
          yanlis: 'Mecazda gerçek anlamla bağ tümüyle kopar ("ayağını kesmek"). Masanın ayağı hâlâ ayak gibi taşıyor: yan anlam.',
        },
        kart: 3,
      },
      {
        soru: '"Bütün köy toplandı" cümlesindeki aktarma?',
        siklar: ['Duyu aktarması', 'Ad aktarması'],
        dogru: 1,
        aciklama: {
          dogru: '"Köy" adı köydeki insanların yerine kullanılmış.',
          yanlis: 'Duyu aktarmasında bir duyu başka duyuyla anlatılır ("acı ses"). Yer adının insanların yerine geçmesi ad aktarması.',
        },
        kart: 11,
      },
    ]),
    konu('trk9-soz', 'Deyim, Atasözü ve Söz Öbekleri', [
      kart(
        'Deyim',
        'En az iki sözcükten oluşan, kalıplaşmış, çoğunlukla mecazlı anlatımdır.\nÖğüt vermez, bir durumu anlatır.',
      ),
      kart(
        'Deyimin biçimleri',
        '- **Sözcük öbeği:** "göze girmek", "etekleri zil çalmak"\n- **Cümle:** "Atı alan Üsküdar’ı geçti."\nCümle biçiminde olsa da öğüt vermez; yine bir durumu anlatır.',
      ),
      kart(
        'Atasözü',
        'Uzun deneyimden çıkmış, kalıplaşmış sözdür.\nÖğüt verir ya da genel bir kural bildirir; deyimden ayıran budur.',
        {
          tur: 'tablo',
          basliklar: ['Deyim', 'Atasözü'],
          satirlar: [
            ['Durum anlatır', 'Öğüt verir'],
            ['Yargı bildirmez', 'Yargı bildirir'],
            ['Göze girmek', 'Damlaya damlaya göl olur'],
          ],
        },
      ),
      kart(
        'Atasözünde gerçek ve mecaz',
        '- **Gerçek anlamlı:** "Sakla samanı, gelir zamanı."\n- **Mecazlı:** "Damlaya damlaya göl olur."\nİkisi de genel bir yargı bildirir; ayıran sözcüklerin anlamıdır.',
      ),
      kart(
        'Özdeyiş (vecize)',
        'Söyleyeni belli olan, öğüt veren kısa sözdür.\n"Hayatta en hakiki mürşit ilimdir." (Atatürk)\nAtasözünün söyleyeni belli değildir, halkın ortak malıdır.',
      ),
      kart(
        'İkileme',
        'Anlamı güçlendirmek için sözcüklerin yinelenmesidir.\nÖrnek: yavaş yavaş, eğri büğrü\nArasına noktalama girmez.',
      ),
      kart(
        'İkilemenin türleri',
        '- **Aynı sözcükle:** yavaş yavaş\n- **Eş anlamlılarla:** eş dost\n- **Zıt anlamlılarla:** az çok\n- **Biri anlamsız:** eğri büğrü\n- **Yansımayla:** şırıl şırıl',
      ),
      kart(
        'Kalıp sözler',
        'Belirli durumlarda söylenen hazır ifadelerdir.\nÖrnek: "geçmiş olsun", "kolay gelsin"\nDeyimden farkı, bir toplumsal duruma bağlı olmalarıdır.',
      ),
      kart(
        'Terim mi deyim mi?',
        'Deyimde sözcükler kendi anlamlarından uzaklaşır.\n- **"Göze girmek":** deyim\n- **"Göz kapağı":** deyim değil',
        undefined,
        { not: '\'Göz kapağı\' terim (sözcükler gerçek), \'göze girmek\' deyim (mecaz). Deyimde sözcük kendi anlamını bırakır.' },
      ),
      kart(
        'Kalıplaşma bozulmaz',
        'Deyim ve atasözlerinin sözcükleri değiştirilemez, sırası bozulamaz.\n"Ağaç yaşken eğilir" başka türlü söylenemez.',
      ),
    ], [
      soru('Atasözleri kalıplaşmıştır; sözcükleri değiştirilemez.', true, 'Eş anlamlısıyla değiştirilen bir atasözü artık atasözü sayılmaz.'),
      soru('Deyimler öğüt verir, atasözleri vermez.', false, 'Öğüt veren atasözüdür; deyim bir durumu anlatır.'),
      soru('İkilemeler anlatımı pekiştirmek için kullanılır.', true, '"Yavaş yavaş", "irili ufaklı" gibi kalıplar anlamı güçlendiriyor.'),
      soru('"Güle güle", "geçmiş olsun" gibi sözler deyim sayılır.', false, 'Bunlar kalıp söz: belirli durumlarda söylenen hazır ifadeler.'),
      sikli('İkilemelerin arasına ne konmaz?', ['Noktalama işareti', 'Boşluk'], 0, '"Yavaş yavaş" ayrı yazılır ama virgülle ayrılmaz.'),
      sikli('"Göze girmek" deyimi ne anlama gelir?', ['Beğenilmek, sevilmek', 'Gözüne bir şey kaçmak'], 0, 'Deyimde sözcükler gerçek anlamlarından uzaklaşır.'),
      soru('"Göz kapağı" bir deyimdir.', false, 'Sözcükler gerçek anlamında; bir organın adı, deyim değil.'),
      soru('Deyimler cümle biçiminde de olabilir.', true, '"Atı alan Üsküdar\'ı geçti" cümle biçiminde bir deyim.'),
      soru('Özdeyişin söyleyeni belli değildir.', false, 'Söyleyeni belli olan özdeyiştir; atasözü anonim.'),
      soru('Atasözleri yalnızca mecazlı sözcüklerle kurulur.', false, '"Sakla samanı, gelir zamanı" gerçek anlamlı bir atasözü.'),
      sikli('"Eş dost" ikilemesi nasıl kurulmuştur?', ['Zıt anlamlılarla', 'Eş anlamlılarla'], 1, 'Zıt anlamlılarla kurulan: az çok.'),
      sikli('Söyleyeni belli, öğüt veren kısa söz?', ['Özdeyiş', 'Atasözü'], 0, 'Atasözünün söyleyeni belli değil.'),
    ], [
      {
        soru: '"Damlaya damlaya göl olur" hangisidir?',
        siklar: ['Atasözü', 'Deyim'],
        dogru: 0,
        aciklama: {
          dogru: 'Genel bir kural ve öğüt bildiriyor; deyim durum anlatır, öğüt vermez.',
          yanlis: 'Deyim bir durumu anlatır ("göze girmek"). Öğüt veren ve genel kural bildiren kalıplaşmış söz atasözü.',
        },
        kart: 3,
      },
    ]),
    konu('trk9-cumle', 'Cümlede Anlam', [
      kart(
        'Neden-sonuç',
        'Bir yargı ötekinin gerekçesidir.\nÖrnek: "Yağmur yağdığı için maç ertelendi."\nBağlayan sözler: için, -dığından, ile',
      ),
      kart(
        'Amaç-sonuç',
        'Eylemin niyetini bildirir.\nÖrnek: "Sınavı kazanmak için çalıştı."\nNeden-sonuçtan farkı: sonuç henüz gerçekleşmemiştir.',
      ),
      kart(
        'Koşul',
        'Bir yargı ötekine bağlıdır.\nÖrnek: "Erken gelirsen görüşürüz."\nKoşul gerçekleşmezse öteki yargı da gerçekleşmez.',
      ),
      kart(
        'Öznellik ve nesnellik',
        '- **Nesnel:** doğruluğu kanıtlanabilir ("Roman 300 sayfa").\n- **Öznel:** kişiden kişiye değişir ("Roman sıkıcı").',
      ),
      kart(
        'Örtülü anlam',
        'Söylenmediği hâlde cümleden çıkarılan yargıdır.\n"Bu yıl da kazanamadı" cümlesi önceki yılları da anlatır.',
      ),
      kart(
        'Karşılaştırma',
        'İki varlık ya da durum bir yönüyle kıyaslanır.\nKarşılaştırmada üstünlük olmak zorunda değildir.',
      ),
      kart(
        'Tanım cümlesi',
        '"Nedir?" sorusuna cevap veren cümledir.\nYargı bildirmeyen bir betimleme tanım sayılmaz.',
      ),
      kart(
        'Üslup ve içerik',
        '- **Üslup:** nasıl anlatıldığı (kısa cümleler, sade dil)\n- **İçerik:** ne anlatıldığı\nSorularda ikisi sık karıştırılır.',
      ),
      kart(
        'Doğrudan ve dolaylı anlatım',
        '- **Doğrudan:** söz tırnak içinde, olduğu gibi aktarılır ("Yarın gelirim," dedi.).\n- **Dolaylı:** söz anlatanın ağzından aktarılır (Yarın geleceğini söyledi.).',
      ),
      kart(
        'Kesinlik, olasılık, tahmin',
        '- **Kesinlik:** "Mutlaka gelecek."\n- **Olasılık:** "Gelebilir." (-ebil-, belki)\n- **Tahmin:** "Yüz kişi vardı herhâlde."\nSorular çoğunlukla ek ve belirteç üzerinden sorulur.',
      ),
      kart(
        'Tutum bildiren cümleler',
        '- **Pişmanlık:** "Keşke dinleseydim."\n- **Sitem:** "Bir kez de sen arasan."\n- **Özlem:** "Nerede o eski bayramlar!"\n- **Yakınma:** "Bu gürültü beni bitirdi."\n- **Varsayım:** "Diyelim ki kazandın."',
      ),
      kart(
        'Öneri, eleştiri, ön yargı',
        '- **Öneri:** "Bu kitabı mutlaka oku." (-meli, -sın)\n- **Eleştiri:** bir eserin ya da davranışın iyi-kötü yanını söyler.\n- **Ön yargı:** tanımadan verilen yargı ("Okumadım ama sıkıcıdır.")',
      ),
      kart(
        'Neden mi amaç mı?',
        '- **"Hasta olduğu için gelmedi":** neden, gerçekleşmiş sebep\n- **"Görüşmek için geldi":** amaç, henüz olmamış niyet\n"İçin" ikisinde de var; bakılacak şey sebebin gerçekleşip gerçekleşmediği.',
        undefined,
        { not: '\'Hasta olduğu için gelmedi\' → neden (olmuş). \'Görüşmek için geldi\' → amaç (niyet). \'için\' ikisinde de var.' },
      ),
    ], [
      soru('"Yağmur yağdığı için maç ertelendi." cümlesinde neden-sonuç ilişkisi vardır.', true, 'Ertelenmenin sebebi doğrudan belirtilmiş.'),
      soru('Nesnel yargılar kişiden kişiye değişir.', false, 'Nesnel yargı doğrulanabilir; değişen öznel yargıdır.'),
      soru('"Sınavı kazanmak için çok çalıştı." cümlesinde amaç-sonuç ilişkisi vardır.', true, '"için" burada amacı bildiriyor.'),
      soru('Karşılaştırma cümlelerinde her zaman biri üstün gösterilir.', false, 'Karşılaştırma benzerlik ya da eşitlik için de yapılabilir.'),
      sikli('"Erken gelirsen görüşürüz" hangi anlam ilişkisi?', ['Koşul', 'Amaç'], 0, 'Koşul gerçekleşmezse öteki de gerçekleşmez.'),
      sikli('"Dünya, Güneş\'in çevresinde dönen bir gezegendir." nasıl bir cümle?', ['Tanım', 'Karşılaştırma'], 0, '"Dünya nedir?" sorusunun cevabı.'),
      sikli('"Bu yıl da kazanamadı" cümlesindeki örtülü anlam?', ['Önceki yıllarda da kazanamadı', 'Gelecek yıl kazanacak'], 0, 'Söylenmeden çıkarılan yargı.'),
      sikli('"Roman sıkıcı" nasıl bir yargı?', ['Öznel', 'Nesnel'], 0, 'Kişiye göre değişir.'),
      sikli('Kısa cümle ve sade dil neyi anlatır?', ['İçeriği', 'Üslubu'], 1, 'Nasıl anlatıldığı.'),
      soru('"Ali de kardeşi kadar çalışkan." cümlesinde karşılaştırma vardır.', true, 'İki kişi bir yönüyle kıyaslanıyor; üstünlük değil eşitlik.'),
      soru('"Yarın geleceğini söyledi." cümlesi dolaylı anlatımdır.', true, 'Söz tırnaksız, anlatanın ağzından aktarılmış.'),
      soru('"Keşke erken yatsaydım." cümlesinde özlem vardır.', false, 'Yapılmamış bir işe hayıflanma: pişmanlık.'),
      soru('"Okumadım ama sıkıcıdır." cümlesinde ön yargı vardır.', true, 'Tanımadan, denemeden yargı verilmiş.'),
      sikli('"Gelebilir" hangi anlamı taşır?', ['Kesinlik', 'Olasılık'], 1, '-ebil- eki olasılık bildirir.'),
      sikli('"Diyelim ki kazandın" cümlesi?', ['Varsayım', 'Tahmin'], 0, 'Gerçekleşmemiş bir durum varmış gibi düşünülüyor.'),
    ], [
      {
        soru: '"Bu roman 320 sayfa" cümlesi nasıl bir yargıdır?',
        siklar: ['Nesnel', 'Öznel'],
        dogru: 0,
        aciklama: {
          dogru: 'Sayfa sayısı ölçülebilir, kanıtlanabilir.',
          yanlis: 'Öznel yargı kişiye göre değişir ("sıkıcı"). Sayfa sayısı herkes için aynı: nesnel.',
        },
        kart: 4,
      },
      {
        soru: '"Bir kez de sen arasan." cümlesindeki tutum?',
        siklar: ['Pişmanlık', 'Sitem'],
        dogru: 1,
        aciklama: {
          dogru: 'Karşıdakine kırgınlık bildiriliyor: sitem.',
          yanlis: 'Pişmanlık kişinin kendi yaptığına hayıflanması ("keşke"). Burada karşıdakine kırgınlık var: sitem.',
        },
        kart: 11,
      },
    ]),
    konu('trk9-paragraf', 'Paragrafta Anlam', [
      kart(
        'Ana düşünce',
        'Paragrafın yazılma amacı, verilmek istenen asıl mesajdır.\nTek cümleyle özetlenebilir ve paragrafın tamamını kapsar.',
      ),
      kart(
        'Yardımcı düşünce',
        'Ana düşünceyi destekleyen ara yargılardır.\n"Değinilmemiştir" soruları bu yargıları arar.',
      ),
      kart(
        'Konu ile ana düşünce farkı',
        '- **Konu:** "Neden söz ediyor?" sorusunun cevabı, bir sözcük\n- **Ana düşünce:** "Ne demek istiyor?" sorusunun cevabı, bir yargı',
      ),
      kart(
        'Anlatım biçimleri',
        'Dört biçim, yazarın metne aldığı tavrı gösterir.\nTabloda her birinin ne yaptığı yazıyor.',
        {
          tur: 'tablo',
          basliklar: ['Biçim', 'Ne yapar?'],
          satirlar: [
            ['Açıklayıcı', 'Bilgi verir'],
            ['Tartışmacı', 'Karşı görüşü çürütür'],
            ['Betimleyici', 'Gösterir'],
            ['Öyküleyici', 'Olayı anlatır'],
          ],
        },
      ),
      kart(
        'Betimleme ve öyküleme',
        '- **Betimleme:** duyular ve sıfatlarla bir görüntü çizer; zaman akmaz.\n- **Öyküleme:** olay, kişi ve zaman vardır; fiiller öne çıkar.\nHareketli betimlemede de olay değil görüntü anlatılır.',
      ),
      kart(
        'Açıklama ve tartışma',
        '- **Açıklayıcı:** bilgi verir, okuru ikna etmeye çalışmaz.\n- **Tartışmacı:** bir görüşü savunur, karşı görüşü çürütür.\nTartışmacı anlatımda "bazıları … oysa" kalıbı sıktır.',
      ),
      kart(
        'Düşünceyi geliştirme yolları',
        'Tanımlama, örneklendirme, karşılaştırma, tanık gösterme, sayısal veri.\n- **Tanık göstermede:** söyleyenin adı geçer.\n- **Örneklendirmede:** geçmez.',
      ),
      kart(
        'Geliştirme yollarını tanımak',
        '- **Tanımlama:** "… nedir" sorusuna cevap\n- **Örneklendirme:** "örneğin, mesela"\n- **Karşılaştırma:** "daha, göre, oysa"\n- **Tanık gösterme:** ünlü birinin sözü\n- **Sayısal veri:** oran, yüzde\n- **Benzetme:** "gibi"',
      ),
      kart(
        'Paragrafın yapısı',
        '- **Giriş:** bağımsız bir cümleyle başlar.\n- **Gelişme:** konuyu açar.\n- **Sonuç:** toparlar.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Giriş', alt: 'bağımsız cümle' },
            { ad: 'Gelişme', alt: 'açar' },
            { ad: 'Sonuç', alt: 'toparlar' },
          ],
        },
      ),
      kart(
        'Paragraf kurmak ve bölmek',
        '- **İlk cümle:** bağlaç ya da zamirle ("Bu, ama") başlamaz.\n- **Sıralama:** her cümle bir öncekine bir sözcükle bağlanır.\n- **İkiye bölme:** konunun ya da bakışın değiştiği yerden yapılır.',
      ),
      kart(
        'Akışı bozan cümle',
        'Paragrafın konusundan sapan ya da bağlantı kurulamayan cümledir.\nÇıkarıldığında anlam bütünlüğü bozulmaz.',
      ),
      kart(
        'Boşluk doldurma',
        'Boşluğa gelecek cümleyi önceki ve sonraki cümle birlikte belirler.\n- **Boşluk başta:** konuyu açan genel cümle\n- **Boşluk sonda:** paragrafı toparlayan yargı\n- **Boşluk ortada:** iki yanı bağlayan cümle',
      ),
      kart(
        'Soruya göre strateji',
        '- **Ana düşünce:** son cümleye ve tekrar eden fikre bak.\n- **Konu:** "Neden söz ediyor?" diye sor.\n- **Değinilmemiştir:** şıkları tek tek metinle eşleştir.\n- **Akışı bozan:** önceki ve sonraki cümleyle bağ ara.',
        undefined,
        { not: 'Ana düşünce: son cümle + tekrar eden fikir. \'Değinilmemiştir\': şıkları paragrafta tek tek ara, bulamadığın cevap.' },
      ),
    ], [
      soru(
        'Paragrafın ana düşüncesi yalnızca giriş bölümünde bulunur.',
        false,
        'Ana düşünce paragrafın herhangi bir yerinde verilebilir, hatta hiç yazılmadan sezdirilebilir.',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Giriş' }, { ad: 'Gelişme' }, { ad: 'Sonuç' }],
        },
      ),
      soru('Konu "neyden söz ediliyor", ana düşünce "ne anlatılmak isteniyor" sorusuna cevap verir.', true, 'Konu geniş, ana düşünce o konuda söylenen sözdür.'),
      soru('Paragrafın akışını bozan cümle, konuyla ilgisi olmayan cümledir.', true, 'Anlam bütünlüğünü kırdığı için çıkarılması gerekir.'),
      soru('Bir paragrafta yalnızca tek bir anlatım biçimi kullanılabilir.', false, 'Açıklama, tartışma, öyküleme ve betimleme bir arada bulunabilir.'),
      sikli('"Paragrafta değinilmemiştir" sorusu nerede aranır?', ['Başlıkta', 'Yardımcı düşüncelerde'], 1, 'Ara yargılar.'),
      sikli('Tanık göstermeyi örnekten ayıran nedir?', ['Sayı verilir', 'Söyleyenin adı geçer'], 1, 'Sayısal veri ayrı yol.'),
      sikli('Ana düşünceyi bulmada ilk bakılacak yerlerden biri?', ['Son cümle ve tekrar eden fikir', 'İlk sözcük'], 0, 'Ana düşünce çoğu zaman sonda toparlanır ya da paragraf boyunca yinelenir.'),
      sikli('Paragrafın hangi bölümü bağımsız cümleyle başlar?', ['Sonuç', 'Giriş'], 1, 'Gelişme açar, sonuç toparlar.'),
      soru('Tartışmacı anlatımda yazar karşı görüşü çürütmeye çalışır.', true, 'Açıklayıcı anlatım bilgi verir; tartışmacı anlatım ikna etmeye çalışır.'),
      soru('Betimlemede zaman akar ve olaylar sıralanır.', false, 'Olay ve zaman öykülemenin işi; betimleme bir görüntü çizer.'),
      soru('Paragrafın ilk cümlesi "Bu" gibi bir zamirle başlamaz.', true, 'Zamir önceki bir cümleye gönderme yapar; ilk cümlenin öncesi yok.'),
      soru('"Örneğin" sözü tanık göstermenin işaretidir.', false, 'Örneklendirmenin işareti. Tanık göstermede ünlü birinin sözü aktarılır.'),
      sikli('Paragraf ikiye nereden bölünür?', ['Konunun değiştiği yerden', 'En uzun cümleden'], 0, 'Konu ya da bakış değişince yeni paragraf başlar.'),
      sikli('"Bazıları … oysa" kalıbı hangi anlatımda sık?', ['Açıklayıcı', 'Tartışmacı'], 1, 'Karşı görüş anılıp çürütülüyor.'),
      sikli('Sondaki boşluğa ne tür cümle gelir?', ['Konuyu açan cümle', 'Paragrafı toparlayan yargı'], 1, 'Konuyu açan genel cümle başta olur.'),
    ], [
      {
        soru: '"Yazar bu parçada neden söz ediyor?" sorusu neyi sorar?',
        siklar: ['Konuyu', 'Ana düşünceyi'],
        dogru: 0,
        aciklama: {
          dogru: 'Konu "neden söz ediyor", ana düşünce "ne demek istiyor" sorusudur.',
          yanlis: 'Ana düşünce yargıdır ve "ne demek istiyor" diye sorulur. "Neden söz ediyor" konunun sorusu.',
        },
        kart: 3,
      },
      {
        soru: 'Hangi sözcükle başlayan cümle paragrafın ilk cümlesi olamaz?',
        siklar: ['"Bu yüzden"', '"Kitaplar"'],
        dogru: 0,
        aciklama: {
          dogru: '"Bu yüzden" önceki bir cümleye bağlanır; ilk cümlenin öncesi yok.',
          yanlis: '"Kitaplar" bağımsız bir başlangıç. "Bu yüzden" önceki cümleye bağlandığı için ilk cümle olamaz.',
        },
        kart: 10,
      },
    ]),
  ]),
  tema('trk9-t3', 'Anlamın Yapı Taşları', [
    konu('trk9-yapi', 'Anlatmaya Bağlı Metinlerin Yapısı', [
      kart(
        'Dört yapı ögesi',
        'Anlatmaya bağlı her metin dört ögeden kurulur.\nBiri eksikse metin anlatı olmaz.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Olay örgüsü' },
            { ad: 'Kişiler' },
            { ad: 'Mekân' },
            { ad: 'Zaman' },
          ],
        },
      ),
      kart(
        'Olay örgüsü',
        'Olayların metindeki diziliş biçimidir.\nGerçek zaman sırası değil, yazarın kurduğu sıradır.',
      ),
      kart(
        'Olay örgüsünün aşamaları',
        '- **Serim:** kişiler, yer ve durum tanıtılır.\n- **Düğüm:** çatışma büyür, merak en üste çıkar.\n- **Çözüm:** düğüm çözülür, olay bağlanır.\nDurum hikâyesinde bu sıra belirgin değildir.',
      ),
      kart(
        'Kişiler',
        'Metni ilerleten kişilerdir.\n- **Karakter:** değişir ve gelişir.\n- **Tip:** tek bir özelliğin temsilcisidir (cimri tipi).',
      ),
      kart(
        'Başkişi ve ötekiler',
        '- **Başkişi (kahraman):** olayın merkezindeki kişi\n- **Karşıt kişi:** başkişinin önüne engel çıkaran\n- **Yardımcı kişiler:** olayı ilerletir, arka planı doldurur.',
      ),
      kart(
        'Mekân',
        'Mekân yalnızca dekor değildir.\nKişinin ruh hâlini ve toplumsal konumunu da anlatır.',
      ),
      kart(
        'Mekân türleri',
        '- **Açık / kapalı:** sokak, köy / oda, zindan\n- **Gerçek / hayalî:** İstanbul / Kaf Dağı\nKapalı mekân çoğu zaman sıkışmışlığı, açık mekân özgürlüğü sezdirir.',
      ),
      kart(
        'Zaman',
        'Olayın geçtiği süre ile anlatılma süresi farklı olabilir.\nGeri dönüşle geçmişe gidilebilir.',
      ),
      kart(
        'Zaman nasıl verilir?',
        '- **Belirli zaman:** tarih, mevsim ya da gün adı geçer ("1919 kışı").\n- **Belirsiz zaman:** masal ve destanda ("Evvel zaman içinde")\n- **Doğrusal anlatım:** olaylar oluş sırasıyla verilir.',
      ),
      kart(
        'Çatışma',
        'Anlatıyı ilerleten çatışmadır. Kişi şunlarla çatışabilir:\n- Başka biriyle ya da toplumla\n- Doğayla\n- Kendisiyle',
        undefined,
        { not: 'Kişi–toplum (Yaban\'daki aydın), kişi–kendisi (Suç ve Ceza), kişi–doğa (Yaşlı Adam ve Deniz). Çatışma yoksa anlatı yok.' },
      ),
      kart(
        'Anlatım teknikleri',
        '- **Özetleme:** uzun bir süreyi birkaç cümlede geçmek\n- **Diyalog:** kişileri konuşturmak\n- **Geriye dönüş:** geçmişe sıçramak\n- **Montaj:** metne gazete haberi, mektup gibi başka bir metin eklemek',
      ),
      kart(
        'İç konuşma ve bilinç akışı',
        '- **İç konuşma (iç monolog):** kişi kendi kendine, düzenli biçimde konuşur.\n- **Bilinç akışı:** düşünceler sırasız, çağrışımla akar; noktalama bile gevşer.',
      ),
    ], [
      soru('Anlatmaya bağlı metinlerin yapı ögeleri olay örgüsü, kişiler, mekân ve zamandır.', true, 'Dördü birlikte kurmacanın iskeletini oluşturuyor.'),
      soru('Olay örgüsü, olayların yaşandıkları sırayla anlatılması demektir.', false, 'Olaylar geri dönüşlerle de verilebilir; olay örgüsü kurgunun düzeni.'),
      soru('Çatışma yalnızca iki kişi arasında yaşanır.', false, 'Kişinin kendi içinde ya da doğayla, toplumla da çatışması olabilir.'),
      soru('Mekân, kişiler hakkında da ipucu verebilir.', true, 'Yaşanılan yerin anlatımı çoğu zaman kişinin durumunu da anlatıyor.'),
      sikli('Anlatıyı ilerleten şey nedir?', ['Mekân', 'Çatışma'], 1, 'Kişinin başkasıyla, toplumla, doğayla ya da kendisiyle.'),
      sikli('Karakteri tipten ayıran nedir?', ['Değişip gelişmesi', 'Adının olması'], 0, 'Tip tek bir özelliği temsil eder ve değişmez.'),
      soru('Anlatıda olayın yaşandığı süre ile anlatılma süresi aynı olmak zorundadır.', false, 'Yıllar bir cümlede geçebilir, bir an sayfalarca anlatılabilir.'),
      soru('Olay örgüsünde merakın en yüksek olduğu bölüm düğümdür.', true, 'Serimde tanıtılan çatışma düğümde büyür.'),
      soru('Karşıt kişi, başkişiye yardım eden kişidir.', false, 'Karşıt kişi başkişinin önüne engel çıkarır.'),
      soru('"Evvel zaman içinde" ifadesi belirsiz zamana örnektir.', true, 'Masal ve destanlar zamanı belirsiz bırakır.'),
      soru('Bilinç akışında düşünceler düzenli ve sıralı verilir.', false, 'Düzenli olan iç konuşma; bilinç akışında düşünceler çağrışımla, sırasız akar.'),
      sikli('Metne mektup ya da haber eklemeye ne denir?', ['Montaj', 'Özetleme'], 0, 'Özetleme uzun süreyi kısa geçmektir.'),
      sikli('Kişilerin, yerin ve durumun tanıtıldığı bölüm?', ['Düğüm', 'Serim'], 1, 'Düğümde çatışma büyür.'),
      sikli('Zindan hangi mekân türüdür?', ['Açık mekân', 'Kapalı mekân'], 1, 'Kapalı mekân çoğu zaman sıkışmışlığı sezdirir.'),
    ], [
      {
        soru: 'Tek bir özelliğin temsilcisi olan kişiye ne denir?',
        siklar: ['Karakter', 'Tip'],
        dogru: 1,
        aciklama: {
          dogru: 'Tip değişmez (cimri tipi); karakter metin boyunca gelişir.',
          yanlis: 'Karakter çok yönlüdür ve değişir. Tek özellikle tanımlanan, değişmeyen kişi tip.',
        },
        kart: 4,
      },
      {
        soru: 'Metne gazete haberi eklemek hangi tekniktir?',
        siklar: ['Geriye dönüş', 'Montaj'],
        dogru: 1,
        aciklama: {
          dogru: 'Başka bir metnin anlatıya eklenmesi montajdır.',
          yanlis: 'Geriye dönüş anlatının geçmişe sıçramasıdır. Başka bir metni eklemek montaj.',
        },
        kart: 11,
      },
    ]),
    konu('trk9-anlatici', 'Anlatıcı ve Bakış Açısı', [
      kart(
        'İlahi (hâkim) bakış açısı',
        'Anlatıcı her şeyi bilir; kişilerin aklından geçeni bile aktarır.\nÜçüncü kişi ağzından anlatılır.',
      ),
      kart(
        'Kahraman bakış açısı',
        'Anlatıcı olayın içindeki kişidir, yalnız kendi bildiğini anlatır.\n"Ben" ağzıyla yazılır.',
      ),
      kart(
        'Gözlemci bakış açısı',
        'Anlatıcı yalnızca dışarıdan görüleni aktarır, iç dünyaya giremez.\nBir kamera gibi davranır.',
      ),
      kart(
        'Üçünü ayırmak',
        'Tek ölçü var:\n- Anlatıcı ne kadarını biliyor?\n- Hangi kişi ağzından konuşuyor?',
        {
          tur: 'tablo',
          basliklar: ['Bakış açısı', 'Bilgisi'],
          satirlar: [
            ['İlahi', 'Her şeyi bilir'],
            ['Kahraman', 'Kendi bildiğini'],
            ['Gözlemci', 'Yalnız görüneni'],
          ],
        },
      ),
      kart(
        'Anlatıcının kişisi',
        '- **1. kişi ("ben"):** kahraman anlatıcı\n- **3. kişi ("o"):** ilahi ya da gözlemci anlatıcı\n- **2. kişi ("sen"):** seyrek; okuru olayın içine çeker.',
      ),
      kart(
        'Metindeki ipuçları',
        '- **"Düşünüyordu, içinden geçirdi":** iç dünya biliniyor → ilahi\n- **"Sanki, galiba, belli ki":** yalnız dış görünüş → gözlemci\n- **"Ben, bana, benim":** kahraman',
      ),
      kart(
        'Anlatıcı yazar değildir',
        'Anlatıcı da kurmacanın bir parçasıdır.\n"Ben" diyen anlatıcıyı yazarla karıştırmamak gerekir.',
        undefined,
        { not: 'Sait Faik \'ben\' diyen hikâye yazar ama anlatıcı Sait Faik değildir; sınav \'yazar anlatıcıdır\' derse yanlış.' },
      ),
      kart(
        'Güvenilmez anlatıcı',
        'Anlatıcı yanılıyor ya da bir şey gizliyor olabilir.\nOkur, anlatılanla ima edilen arasındaki farkı kendisi kurar.',
      ),
      kart(
        'Birden çok anlatıcı',
        'Bazı romanlarda bölümleri farklı kişiler anlatır.\nOrhan Pamuk’un Benim Adım Kırmızı’sında her bölümün anlatıcısı ayrıdır.\nAynı olay böylece birkaç gözden görülür.',
      ),
      kart(
        'Romanlardan örnekler',
        '- **İnce Memed:** ilahi anlatıcı\n- **Kuyucaklı Yusuf:** ilahi anlatıcı\n- **Yaban:** kahraman anlatıcı, Ahmet Celal’in defteri',
      ),
    ], [
      soru('İlahi bakış açısındaki anlatıcı kişilerin iç dünyasını bilir.', true, 'Her şeyi bilen anlatıcı geçmişi ve geleceği de aktarabilir.'),
      soru('Kahraman bakış açısında anlatıcı "ben" diliyle konuşur.', true, 'Anlatan, olayın içindeki kişilerden biri.'),
      soru('Anlatıcı ile yazar aynı kişidir.', false, 'Anlatıcı kurmacanın içindeki ses; yazar onu kuran kişi.'),
      soru('Gözlemci bakış açısındaki anlatıcı kişilerin aklından geçenleri aktarır.', false, 'Yalnızca dışarıdan görüp duyduklarını aktarabilir.'),
      sikli('Bakış açılarını ayırmadaki temel ölçü?', ['Anlatıcının ne kadarını bildiği', 'Metnin uzunluğu'], 0, 'İlahi her şeyi, kahraman kendi bildiğini, gözlemci görüneni bilir.'),
      sikli('Anlatıcının yanılıyor ya da gizliyor olması?', ['Gözlemci anlatıcı', 'Güvenilmez anlatıcı'], 1, 'Okur farkı kendi kurar.'),
      soru('İlahi bakış açısıyla yazılan metin çoğunlukla üçüncü kişi ağzından anlatılır.', true, 'Anlatıcı olayın dışında; "o" diye anlatır.'),
      soru('"Sanki çok yorgundu" diyen anlatıcı kişinin iç dünyasını kesin olarak bilir.', false, '"Sanki" tahmin bildirir; anlatıcı yalnız dışarıdan görüleni aktarıyor.'),
      soru('Bir romanda birden çok anlatıcı bulunabilir.', true, 'Bölümleri farklı kişiler anlatabilir; aynı olay birkaç gözden görülür.'),
      soru('Yaban romanı ilahi bakış açısıyla yazılmıştır.', false, 'Ahmet Celal\'in kendi defteri: kahraman anlatıcı.'),
      sikli('"İçinden, yarın gideceğim diye geçirdi." hangi bakış açısı?', ['Gözlemci', 'İlahi'], 1, 'Kişinin içinden geçen biliniyor.'),
      sikli('İnce Memed\'in anlatıcısı?', ['İlahi', 'Kahraman'], 0, 'Yaşar Kemal üçüncü kişi ağzından, her şeyi bilerek anlatır.'),
    ], [
      {
        soru: 'Kişilerin aklından geçeni de anlatan anlatıcı?',
        siklar: ['İlahi bakış açısı', 'Gözlemci bakış açısı'],
        dogru: 0,
        aciklama: {
          dogru: 'Her şeyi bilen anlatıcı üçüncü kişi ağzıyla iç dünyaya girer.',
          yanlis: 'Gözlemci yalnızca dışarıdan görüleni aktarır, kamera gibi. İçten geçeni bilen ilahi bakış açısı.',
        },
        kart: 1,
      },
    ]),
    konu('trk9-hikaye', 'Hikâye ve Roman', [
      kart(
        'Hikâye',
        '- **Hikâye:** tek olay, az kişi, kısa zaman\n- **Roman:** çok olay, çok kişi, geniş zaman',
        {
          tur: 'tablo',
          basliklar: ['Hikâye', 'Roman'],
          satirlar: [
            ['Tek olay', 'Çok olay'],
            ['Az kişi', 'Çok kişi'],
            ['Kısa zaman', 'Geniş zaman'],
          ],
        },
      ),
      kart(
        'Olay hikâyesi',
        '**Maupassant tarzı:** serim, düğüm ve çözüm vardır; sonu bağlanır.\nTürk edebiyatında temsilcisi **Ömer Seyfettin**.',
      ),
      kart(
        'Durum hikâyesi',
        '**Çehov tarzı:** belirgin bir olay ve çözüm yoktur; bir an ve izlenim anlatılır.\nTürk edebiyatında temsilcisi **Sait Faik**.',
        undefined,
        { not: 'Ömer Seyfettin olay (Kaşağı: sonu var), Sait Faik durum (Hişt Hişt: olay yok, an var). İkisini örnekle tut.' },
      ),
      kart(
        'Türk hikâyesinin yolu',
        '- **Tanzimat:** Ahmet Mithat, Letaif-i Rivayat (ilk denemeler)\n- **Servetifünun:** Halit Ziya, Batılı teknik\n- **Millî Edebiyat:** Ömer Seyfettin, Refik Halit\n- **Cumhuriyet:** Sait Faik, Sabahattin Ali, Memduh Şevket',
      ),
      kart(
        'Roman türleri',
        'Tarihî, sosyal, psikolojik, macera, polisiye.\nAyrım, romanın ağırlık verdiği konuya göre yapılır.',
      ),
      kart(
        'Roman türlerine örnekler',
        '- **Tarihî:** Devlet Ana (Kemal Tahir)\n- **Sosyal:** Yaban (Yakup Kadri)\n- **Psikolojik:** Dokuzuncu Hariciye Koğuşu (Peyami Safa)\n- **Macera:** Hasan Mellah (Ahmet Mithat)\n- **Köy romanı:** İnce Memed (Yaşar Kemal)',
      ),
      kart(
        'Türk romanının başlangıcı',
        '- **İlk yerli roman:** Taaşşuk-ı Talat ve Fitnat (Şemsettin Sami)\n- **İlk edebî roman:** İntibah (Namık Kemal)',
      ),
      kart(
        'Romanda ilkler',
        '- **İlk tarihî roman:** Cezmi (Namık Kemal)\n- **İlk realist roman:** Araba Sevdası (Recaizade Mahmut Ekrem)\n- **İlk köy romanı:** Karabibik (Nabizade Nazım)\n- **İlk psikolojik roman:** Zehra (Nabizade Nazım)',
      ),
      kart(
        'Akımlar ve roman',
        '- **Romantizm:** duygu, tesadüf, idealize kişiler (Tanzimat)\n- **Realizm:** gözleme dayanır, gerçekçi (Servetifünun, Halit Ziya)\n- **Natüralizm:** kalıtımın ve çevrenin etkisi, bilimsel gözlem',
      ),
      kart(
        'Yakın dönemden romancılar',
        '- **Yakup Kadri:** Yaban, Kiralık Konak\n- **Halide Edip:** Sinekli Bakkal\n- **Reşat Nuri:** Çalıkuşu\n- **Sabahattin Ali:** Kuyucaklı Yusuf\n- **Tanpınar:** Huzur',
      ),
      kart(
        'Modern anlatı',
        '20. yüzyılda olay örgüsü gevşedi; iç konuşma ve bilinç akışı öne çıktı.\nAnlatı olayı değil, bilinci izlemeye başladı.',
      ),
    ], [
      soru('Durum hikâyesinde serim-düğüm-çözüm sıralaması belirgin değildir.', true, 'Bir anı ve durumu aktarır; olay örgüsü zayıftır.'),
      soru('Durum hikâyesinin öncüsü Maupassant tır.', false, 'Maupassant olay hikâyesinin, Çehov durum hikâyesinin öncüsü.'),
      soru('Türk edebiyatının ilk romanı Taaşşuk-ı Talat ve Fitnat kabul edilir.', true, 'Şemsettin Sami nin bu eseri ilk yerli roman sayılıyor.'),
      soru('Roman ile hikâye arasındaki tek fark uzunluktur.', false, 'Roman daha çok kişiyi, mekânı ve olayı daha geniş bir zamanda işler.'),
      sikli('İlk edebî roman sayılan İntibah kimindir?', ['Şemsettin Sami', 'Namık Kemal'], 1, 'Şemsettin Sami ilk yerli roman Taaşşuk-ı Talat ve Fitnat\'ın yazarı.'),
      sikli('Türk edebiyatında olay hikâyesinin temsilcisi?', ['Sait Faik', 'Ömer Seyfettin'], 1, 'Sait Faik durum hikâyesinin temsilcisi.'),
      soru('Modern anlatıda olay örgüsü gevşedi, bilinç akışı öne çıktı.', true, '20. yüzyıl.'),
      soru('Araba Sevdası ilk realist Türk romanı sayılır.', true, 'Recaizade Mahmut Ekrem\'in eseri; alafranga züppeyi eleştirir.'),
      soru('Karabibik ilk tarihî roman kabul edilir.', false, 'Karabibik ilk köy romanı; ilk tarihî roman Namık Kemal\'in Cezmi\'si.'),
      soru('Romantizmde tesadüfler ve idealize kişiler öne çıkar.', true, 'Realizm ise gözleme dayanır, kişileri olduğu gibi çizer.'),
      soru('Servetifünun hikâyecileri Batılı teknikten uzak durmuştur.', false, 'Halit Ziya Batılı hikâye tekniğini yerleştiren addır.'),
      sikli('Huzur romanının yazarı?', ['Tanpınar', 'Yakup Kadri'], 0, 'Yakup Kadri\'nin romanı Yaban.'),
      sikli('Kalıtım ve çevrenin etkisini öne çıkaran akım?', ['Romantizm', 'Natüralizm'], 1, 'Romantizm duyguyu öne çıkarır.'),
    ], [
      {
        soru: 'Sait Faik hangi hikâye tarzının temsilcisidir?',
        siklar: ['Durum (Çehov) hikâyesi', 'Olay (Maupassant) hikâyesi'],
        dogru: 0,
        aciklama: {
          dogru: 'Belirgin olay ve çözüm yok, bir an ve izlenim var.',
          yanlis: 'Olay hikâyesinin Türk temsilcisi Ömer Seyfettin. Sait Faik durum hikâyesi yazar.',
        },
        kart: 3,
      },
      {
        soru: 'İlk köy romanı sayılan eser hangisidir?',
        siklar: ['Cezmi', 'Karabibik'],
        dogru: 1,
        aciklama: {
          dogru: 'Nabizade Nazım\'ın Karabibik\'i ilk köy romanı sayılır.',
          yanlis: 'Cezmi ilk tarihî roman (Namık Kemal). İlk köy romanı Nabizade Nazım\'ın Karabibik\'i.',
        },
        kart: 8,
      },
    ]),
    konu('trk9-tiyatro', 'Tiyatro', [
      kart(
        'Sahnelenmek için yazılır',
        'Tiyatro metni okunmak için değil, oynanmak için yazılır.\nAnlatıcı yoktur; her şey diyalogla verilir.',
        undefined,
        { not: 'Tiyatroda anlatıcı yok, her şey konuşma (replik) ve sahne notu; \'anlatıcı bakış açısı\' sorusu tiyatroya sorulmaz.' },
      ),
      kart(
        'Perde, sahne, replik',
        '- **Perde:** büyük bölüm\n- **Sahne:** kişilerin değişmesiyle oluşan alt bölüm\n- **Replik:** oyuncunun söylediği söz',
      ),
      kart(
        'Metnin öteki ögeleri',
        '- **Sahne yönergesi:** ayraç içinde; dekor, ışık, hareket bilgisi\n- **Monolog:** tek kişinin uzun konuşması\n- **Diyalog:** karşılıklı konuşma\n- **Dekor, kostüm, ışık:** sahneye ait ögeler',
      ),
      kart(
        'Trajedi ve komedi',
        '- **Trajedi:** soylu kişiler, acı son, yüksek üslup\n- **Komedi:** güldürerek düşündürür, halktan kişileri konu alır',
        {
          tur: 'tablo',
          basliklar: ['Trajedi', 'Komedi'],
          satirlar: [
            ['Soylu kişiler', 'Halktan kişiler'],
            ['Acı son', 'Mutlu son'],
            ['Yüksek üslup', 'Günlük dil'],
          ],
        },
      ),
      kart(
        'Üç birlik kuralı',
        'Klasik trajedide üç birlik aranırdı:\n- **Olay birliği:** tek olay\n- **Yer birliği:** tek mekân\n- **Zaman birliği:** bir gün',
      ),
      kart(
        'Dram',
        'Hayatı acı ve gülünç yanlarıyla birlikte verir; üslup sınırı yoktur.\nModern tiyatronun temelidir.',
      ),
      kart(
        'Geleneksel Türk tiyatrosu',
        'Karagöz, orta oyunu, meddah ve köy seyirlik oyunları.\nYazılı metne değil doğaçlamaya dayanır.',
      ),
      kart(
        'Karagöz',
        'Perdeye yansıtılan tasvirlerle oynanır.\n- **Karagöz:** halkı, sağduyuyu temsil eder.\n- **Hacivat:** medrese görmüş, süslü konuşan kişi\nBölümleri: mukaddime, muhavere, fasıl, bitiş',
      ),
      kart(
        'Orta oyunu ve meddah',
        '- **Orta oyunu:** perdesiz, açık alanda oynanır; Kavuklu ile Pişekâr başkişidir.\n- **Meddah:** tek kişi anlatır ve taklit eder; elinde mendil ve sopa vardır.',
      ),
      kart(
        'Türk tiyatrosunda ilkler',
        'Batılı anlamda ilk tiyatro eseri **Şinasi**’nin **Şair Evlenmesi**’dir.\nTanzimat’la birlikte sahnelenmeye başlandı.',
      ),
      kart(
        'Tanzimat’ta tiyatro',
        '- **Namık Kemal:** Vatan yahut Silistre (vatan sevgisi)\n- **Ahmet Vefik Paşa:** Molière uyarlamaları\n- **Güllü Agop:** Gedikpaşa Tiyatrosu\nTiyatro halkı eğitmenin aracı sayıldı.',
      ),
      kart(
        'Cumhuriyet’te tiyatro',
        '- **Haldun Taner:** Keşanlı Ali Destanı, epik tiyatro\n- **Necip Fazıl:** Bir Adam Yaratmak\n- **Cevat Fehmi Başkut:** Paydos\nDevlet tiyatroları ve konservatuvar bu dönemde kuruldu.',
      ),
    ], [
      soru('Tiyatro metinleri sahnelenmek üzere yazılır.', true, 'Bu yüzden metinde sahne yönergeleri de bulunur.'),
      soru('Trajedide kahramanlar halktan sıradan kişilerdir.', false, 'Trajedide soylu ve tanınmış kişiler; sıradan kişiler komedinin konusu.'),
      soru('Karagöz ve orta oyunu geleneksel Türk tiyatrosu içinde yer alır.', true, 'Meddah da bu geleneğin parçası.'),
      soru('Üç birlik kuralı yer, zaman ve olay birliğinin bozulmasını ister.', false, 'Tersine, üçünün de korunmasını ister.'),
      sikli('Oyuncunun söylediği söze ne denir?', ['Perde', 'Replik'], 1, 'Perde büyük bölüm.'),
      sikli('Kişilerin değişmesiyle oluşan alt bölüme ne denir?', ['Perde', 'Sahne'], 1, 'Perde büyük bölüm; sahne onun içindeki alt bölüm.'),
      sikli('Karagöz ve meddah neye dayanır?', ['Yazılı metin', 'Doğaçlama'], 1, 'Geleneksel Türk tiyatrosu.'),
      sikli('Hayatı acı ve gülünç yanlarıyla birlikte veren tür?', ['Komedi', 'Dram'], 1, 'Dram trajedi ile komediyi birleştirir; modern tiyatronun temeli.'),
      soru('Tiyatro metninde anlatıcı vardır.', false, 'Her şey diyalogla verilir.'),
      soru('Karagöz oyununda Hacivat medrese görmüş, süslü konuşan kişidir.', true, 'Karagöz ise halkın sağduyusunu temsil eder.'),
      soru('Orta oyunu perde arkasında tasvirlerle oynanır.', false, 'Perdeli oyun karagöz; orta oyunu açık alanda, perdesiz oynanır.'),
      soru('Sahne yönergeleri ayraç içinde verilir.', true, 'Dekor, ışık ve oyuncunun hareketi bu yönergelerde yazar.'),
      sikli('Vatan yahut Silistre kimindir?', ['Şinasi', 'Namık Kemal'], 1, 'Şinasi\'nin oyunu Şair Evlenmesi.'),
      sikli('Tek kişinin anlatıp taklit ettiği gösteri?', ['Meddah', 'Orta oyunu'], 0, 'Orta oyununda Kavuklu ile Pişekâr vardır.'),
    ], [
      {
        soru: 'Batılı anlamda ilk Türk tiyatro eseri?',
        siklar: ['Şair Evlenmesi', 'İntibah'],
        dogru: 0,
        aciklama: {
          dogru: 'Şinasi\'nin eseri; Tanzimat\'la sahnelenmeye başlandı.',
          yanlis: 'İntibah Namık Kemal\'in romanı. İlk tiyatro eseri Şinasi\'nin Şair Evlenmesi.',
        },
        kart: 10,
      },
      {
        soru: 'Perdeye yansıtılan tasvirlerle oynanan geleneksel oyun?',
        siklar: ['Orta oyunu', 'Karagöz'],
        dogru: 1,
        aciklama: {
          dogru: 'Karagöz perde ve tasvirle oynanır; orta oyunu perdesizdir.',
          yanlis: 'Orta oyunu açık alanda, perdesiz oynanır. Perde ve tasvir karagözün.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('trk9-t4', 'Dilin Zenginliği', [
    konu('trk9-ses', 'Ses Bilgisi', [
      kart(
        'Türkçenin sesleri',
        'Alfabede 29 harf var: 8 ünlü, 21 ünsüz.\n- **Ünlüler:** a, e, ı, i, o, ö, u, ü\n- **Hece:** her hecede tek ünlü var; hece sayısı ünlü sayısına eşittir.',
      ),
      kart(
        'Ünlülerin özellikleri',
        'Ünlü uyumlarının kuralları bu üç ayrıma dayanır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Ünlüler'],
          satirlar: [
            ['Kalın', 'a ı o u'],
            ['İnce', 'e i ö ü'],
            ['Düz', 'a e ı i'],
            ['Yuvarlak', 'o ö u ü'],
            ['Geniş', 'a e o ö'],
            ['Dar', 'ı i u ü'],
          ],
        },
      ),
      kart(
        'Sert ve yumuşak ünsüzler',
        'Sert ünsüzler: f, s, t, k, ç, ş, h, p\nAkılda tutmak için: "FıSTıKÇı ŞaHaP"\nÖteki ünsüzler yumuşaktır; benzeşme ve yumuşama bu ayrıma dayanır.',
      ),
      kart(
        'Büyük ünlü uyumu',
        'Sözcüğün ünlüleri ya hep kalın ya hep incedir:\n- **Kalın:** a, ı, o, u\n- **İnce:** e, i, ö, ü\nUymayanlar: kardeş, anne, kitap',
      ),
      kart(
        'Uyuma uymayan ekler',
        'Bazı ekler büyük ünlü uyumuna hiç girmez:\n- **-ken:** okurken\n- **-leyin:** sabahleyin\n- **-yor:** okuyor\n- **-ki:** akşamki\n- **-mtırak:** yeşilimtırak\n- **-gil:** halamgil',
      ),
      kart(
        'Küçük ünlü uyumu',
        '- **Düz ünlüden sonra:** düz ünlü\n- **Yuvarlak ünlüden sonra:** dar yuvarlak ya da düz geniş ünlü',
      ),
      kart(
        'Ünsüz benzeşmesi',
        'Sert ünsüzle biten sözcüğe c, d, g ile başlayan ek gelirse ek sertleşir.\nÖrnek: kitap + cı → kitapçı',
        undefined,
        { not: 'kitap-cı → kitapçı (ek sertleşti, sözcük aynı); kitap-ı → kitabı (sözcük yumuşadı). Ek mi sözcük mü değişiyor, bak.' },
      ),
      kart(
        'Ünsüz yumuşaması',
        'p, ç, t, k ile biten sözcüğe ünlüyle başlayan ek gelince b, c, d, ğ olur.\nÖrnek: kitap → kitabı\nTek heceli sözcüklerin çoğu yumuşamaz.',
        {
          tur: 'tablo',
          basliklar: ['Sert', 'Yumuşak'],
          satirlar: [
            ['p', 'b'],
            ['ç', 'c'],
            ['t', 'd'],
            ['k', 'ğ'],
          ],
        },
      ),
      kart(
        'Ünlü düşmesi',
        'İki heceli bazı sözcükler ünlüyle başlayan ek alınca bir ünlüsünü kaybeder.\nÖrnek: burun → burnu, oğul → oğlu',
      ),
      kart(
        'Ünsüz düşmesi',
        'Sözcük sonundaki k, bazı ekler gelince düşer:\n- küçük → küçücük\n- ufak → ufacık\n- yüksek → yükselmek',
      ),
      kart(
        'Ünlü türemesi',
        'Sözcüğe bir ünlü eklenir.\nPekiştirmede görülür: sapasağlam, güpegündüz',
      ),
      kart(
        'Ünsüz türemesi',
        'Bazı alıntı sözcükler ek alınca ünsüz ikizleşir.\nÖrnek: his → hissi, af → affı',
      ),
      kart(
        'Kaynaştırma harfleri',
        'İki ünlü yan yana gelmesin diye araya **y, ş, s, n** girer.\nÖrnek: araba-y-ı, iki-ş-er, kapı-s-ı, kapı-n-ın',
      ),
      kart(
        'Ünlü daralması',
        '"-yor" eki önündeki a, e ünlüsünü daraltır.\n- bekle-yor → bekliyor\n- anla-yor → anlıyor\n"De-, ye-" fiilleri de daralır: diyor, yiyor',
      ),
    ], [
      soru('"Kitabı" sözcüğünde ünsüz yumuşaması vardır.', true, 'Sözcük sonundaki "p" ünlüyle başlayan ek alınca "b" ye dönmüş.'),
      soru('Büyük ünlü uyumuna göre bir sözcükte kalın ve ince ünlüler bir arada bulunmaz.', true, 'Alıntı sözcükler bu kurala uymayabilir.'),
      soru('"Gitti" sözcüğünde ünsüz yumuşaması vardır.', false, 'Burada benzeşme var: sert ünsüzden sonra gelen "d" sertleşip "t" olmuş.'),
      soru('Alıntı sözcükler büyük ünlü uyumuna her zaman uyar.', false, '"Kitap", "televizyon" gibi sözcükler kurala uymuyor.'),
      sikli('"Burun → burnu" hangi ses olayı?', ['Ünlü türemesi', 'Ünlü düşmesi'], 1, 'Hece kaybı.'),
      sikli('"His → hissi" hangi olay?', ['Ünsüz yumuşaması', 'Ünsüz türemesi'], 1, 'Alıntı sözcükte ikizleşme.'),
      sikli('"Araba-y-ı" sözcüğündeki y nedir?', ['Ek', 'Kaynaştırma harfi'], 1, 'İki ünlü yan yana gelmesin.'),
      sikli('"Bekliyor" sözcüğünde ne oldu?', ['Ünlü düşmesi', 'Ünlü daralması'], 1, '-yor eki e\'yi daralttı.'),
      sikli('"Okullar" sözcüğü küçük ünlü uyumuna uyar mı?', ['Uyar', 'Uymaz'], 0, 'o\'dan sonra dar yuvarlak u, u\'dan sonra düz geniş a gelmiş.'),
      soru('"Sapasağlam" sözcüğünde pekiştirme sırasında ünlü türemesi vardır.', true, 'sap + a + sağlam: araya bir ünlü eklenmiş.'),
      soru('Türkçede her hecede yalnızca bir ünlü bulunur.', true, 'Hece sayısını ünlü sayısı verir.'),
      soru('"Sabahleyin" sözcüğü büyük ünlü uyumuna uyar.', false, '-leyin eki büyük ünlü uyumuna girmez.'),
      soru('"Küçücük" sözcüğünde ünsüz düşmesi vardır.', true, 'küçük → küçücük: sondaki k düşmüş.'),
      soru('"o, ö, u, ü" düz ünlülerdir.', false, 'Bunlar yuvarlak ünlüler; düz ünlüler a, e, ı, i.'),
      sikli('Hangisi sert ünsüzdür?', ['ş', 'd'], 0, '"FıSTıKÇı ŞaHaP" sert ünsüzleri sayar; d yumuşak.'),
      sikli('"Okurken" neden büyük ünlü uyumuna uymaz?', ['-ken eki uyuma girmez', 'Alıntı sözcüktür'], 0, '"Okumak" Türkçe; uyumu bozan ek.'),
      sikli('"Kalemlik" sözcüğü kaç hecelidir?', ['4', '3'], 1, 'ka-lem-lik: üç ünlü, üç hece.'),
    ], [
      {
        soru: '"Kitap → kitabı" değişimi hangi ses olayıdır?',
        siklar: ['Ünsüz benzeşmesi', 'Ünsüz yumuşaması'],
        dogru: 1,
        aciklama: {
          dogru: 'Sert p, ünlüyle başlayan ek gelince b oldu.',
          yanlis: 'Benzeşmede ek sertleşir (kitap-çı). Burada sözcüğün sonundaki sert ünsüz yumuşadı.',
        },
        kart: 8,
      },
      {
        soru: 'Hangi ek büyük ünlü uyumuna girmez?',
        siklar: ['-ler', '-ken'],
        dogru: 1,
        aciklama: {
          dogru: '-ken tek biçimlidir: okurken, gelirken.',
          yanlis: '-ler uyuma girer (-lar/-ler). Tek biçimli ve uyuma girmeyen -ken.',
        },
        kart: 5,
      },
    ]),
    konu('trk9-yazim', 'Yazım Kuralları', [
      kart(
        '"de" ayrı mı bitişik mi?',
        '- **Bulunma eki -de:** bitişik yazılır.\n- **Bağlaç de:** ayrı yazılır.\nCümleden çıkarınca anlam bozulmuyorsa bağlaçtır.',
      ),
      kart(
        '"ki" kuralı',
        'Bağlaç olan "ki" ayrı yazılır.\nKalıplaşmış olanlar bitişik: hâlbuki, mademki, sanki, oysaki, çünkü',
      ),
      kart(
        'Soru eki mi',
        'Her zaman ayrı yazılır, önündeki sözcüğe uyar.\nÖrnek: "geldi mi", "güzel mi güzel"',
      ),
      kart(
        'Üç ek, tek sınama',
        'Üçünde de aynı soru sorulur:\nsözcükten çıkarılınca cümle bozuluyor mu?\nBozuluyorsa ektir, bitişik yazılır.',
        {
          tur: 'tablo',
          basliklar: ['Yapı', 'Yazım'],
          satirlar: [
            ['Hâl eki -de', 'Bitişik'],
            ['Bağlaç de', 'Ayrı'],
            ['Sıfat -ki', 'Bitişik'],
            ['Bağlaç ki', 'Ayrı'],
          ],
        },
        { not: '\'Sen de gel\' (çıkar: \'Sen gel\' ✓ → ayrı). \'Evde kaldı\' (çıkar: \'Ev kaldı\' ✗ → bitişik). Çıkarınca bozuluyorsa ek.' },
      ),
      kart(
        'Büyük harf',
        'Özel adlar büyük harfle başlar.\n- **Çekim eki:** kesmeyle ayrılır (Ankara’ya).\n- **Yapım eki:** ayrılmaz (Türkçe).',
      ),
      kart(
        'Unvan, akrabalık, yön adları',
        '- **Unvan ve akrabalık adı özel adla:** büyük (Mustafa Kemal Paşa, Ayşe Teyze)\n- **Yön adı özel adın parçasıysa:** büyük (Doğu Anadolu)\n- **Yön bildirmek için:** küçük (Anadolu’nun doğusu)',
      ),
      kart(
        'Tarih, gün ve ay adları',
        '- **Belirli tarihte:** büyük harf (29 Ekim 1923 Pazartesi)\n- **Tarih belirtmeyince:** küçük harf ("Her pazartesi toplanırız.")\nRakamla tarih: 29.10.1923 ya da 29/10/1923',
      ),
      kart(
        'Birleşik sözcükler',
        '- **Anlamca kaynaşmışsa:** bitişik (hanımeli)\n- **Kaynaşmamışsa:** ayrı (deniz kabuğu)\n- **Ses düşmesi varsa:** bitişik (kaynana)',
      ),
      kart(
        'Birleşik fiiller',
        '- **Ses olayı varsa:** bitişik (affetmek, hissetmek, kaybolmak)\n- **Ses olayı yoksa:** ayrı (yardım etmek, mahcup olmak)\n- **-ı ver-, -a bil-, -a gel-:** bitişik (yapıverdi, gelebilir)',
      ),
      kart(
        'Pekiştirme ve ikileme',
        '- **Pekiştirme:** bitişik (masmavi, sapsarı, güpegündüz)\n- **İkileme:** ayrı (yavaş yavaş, eğri büğrü)\n- **"mi" ile ikileme:** ayrı (güzel mi güzel)',
      ),
      kart(
        'Sayıların yazımı',
        'Metinde geçen sayılar genellikle yazıyla yazılır.\nSaat, tarih, ölçü ve istatistik bilgilerinde rakam kullanılır.',
      ),
      kart(
        'Kısaltmalar',
        '- **Büyük harfli kısaltmaya ek:** son harfin okunuşuna göre (TDK’ye, THY’de)\n- **Ölçü kısaltmaları:** nokta almaz (cm, kg).\n- **Küçük harfli kısaltmalar:** noktalı yazılır (vb., bkz., Prof.).',
      ),
    ], [
      soru('Bağlaç olan "de" ayrı yazılır.', true, 'Cümleden çıkarıldığında anlam bozulmuyorsa bağlaçtır.'),
      soru('Soru eki olan "mi" her zaman ayrı yazılır.', true, 'Kendinden sonra gelen ekler ona bitişik yazılır.'),
      soru('"Bilmem ki ne yapsam" cümlesinde "ki" bitişik yazılır.', false, 'Bağlaç olan "ki" ayrı yazılır; bitişik olan yalnızca kalıplaşmış sözcükler.'),
      soru('Sayılar metin içinde her zaman rakamla yazılır.', false, 'Metin içinde çoğunlukla yazıyla yazılır; ölçü ve tarihlerde rakam kullanılır.'),
      sikli('"Sanki" nasıl yazılır?', ['Ayrı', 'Bitişik'], 1, 'Kalıplaşmış: hâlbuki, mademki, oysaki, çünkü.'),
      sikli('Özel ada gelen yapım eki nasıl yazılır?', ['Kesme ile', 'Kesme olmadan (Türkçe)'], 1, 'Çekim eki ayrılır: Ankara\'ya.'),
      sikli('"Hanımeli" neden bitişik?', ['Kısa olduğu için', 'Anlamca kaynaşmış'], 1, 'Deniz kabuğu ayrı.'),
      sikli('"Evdeki" sözcüğündeki -ki nasıl yazılır?', ['Ayrı', 'Bitişik'], 1, 'Sıfat yapan -ki ektir, bitişik yazılır.'),
      soru('"Kaynana" ses düşmesi olduğu için bitişik yazılır.', true, 'Kayın ana.'),
      soru('Büyük harfli kısaltmalara gelen ek, kısaltmanın okunuşuna uyar.', true, 'TDK\'ye: son harf "ke" diye okunuyor.'),
      soru('"Hissetmek" ayrı yazılır.', false, 'His + etmek birleşirken ünsüz türemiş; ses olayı olduğu için bitişik.'),
      soru('Belirli bir tarih bildiren gün ve ay adları küçük harfle başlar.', false, 'Belirli tarihte büyük harfle başlar: 29 Ekim 1923 Pazartesi.'),
      sikli('"Masmavi" nasıl yazılır?', ['Bitişik', 'Ayrı'], 0, 'Pekiştirmeler bitişik; ikilemeler ayrı yazılır.'),
      sikli('"Anadolu’nun doğusu" ifadesinde "doğu" nasıl yazılır?', ['Büyük harfle', 'Küçük harfle'], 1, 'Özel adın parçası değil, yön bildiriyor.'),
    ], [
      {
        soru: '"Sen de gel" cümlesinde "de" nasıl yazılır?',
        siklar: ['Ayrı, çünkü bağlaç', 'Bitişik, çünkü ek'],
        dogru: 0,
        aciklama: {
          dogru: 'Çıkarınca cümle bozulmuyor ("sen gel"): bağlaç, ayrı yazılır.',
          yanlis: 'Bulunma eki olsaydı çıkarınca cümle bozulurdu ("evde"). "Sen gel" hâlâ cümle; bu bağlaç, ayrı yazılır.',
        },
        kart: 1,
      },
      {
        soru: '"Affetmek" neden bitişik yazılır?',
        siklar: ['Ses olayı olduğu için', 'Kısa olduğu için'],
        dogru: 0,
        aciklama: {
          dogru: 'Af + etmek birleşirken ünsüz türemiş (ff); ses olayı bitişik yazdırır.',
          yanlis: 'Uzunluk ölçü değil. Af + etmek birleşirken ünsüz türemiş; ses olayı olduğu için bitişik.',
        },
        kart: 9,
      },
    ]),
    konu('trk9-noktalama', 'Noktalama İşaretleri', [
      kart(
        'Nokta',
        'Cümleyi bitirir. Ayrıca kullanıldığı yerler:\n- Kısaltmalar\n- Tarihler (12.09.2025)\n- Sıra sayıları (3. sınıf)',
      ),
      kart(
        'Virgül',
        'Eş görevli sözcükleri, sıralı cümleleri ve uzun özneyi ayırır.\n"Ve" bağlacından önce virgül konmaz.',
      ),
      kart(
        'Virgülün öteki görevleri',
        '- **Hitaptan sonra:** "Arkadaşlar, başlıyoruz."\n- **Evet, hayır, peki sözlerinden sonra:** "Evet, geliyorum."\n- **Ara sözün başına ve sonuna:** "Ali, komşumuz, geldi."',
      ),
      kart(
        'Virgül anlamı değiştirir',
        'Yer değiştiren tek bir virgül cümlenin öznesini değiştirebilir.\nVirgül süs değil, anlam işaretidir.',
        undefined,
        { not: '\'Yaşlı, adamı gördü\' (yaşlı olan gören) / \'Yaşlı adamı gördü\' (yaşlı olan görülen). Tek virgül özneyi değiştirir.' },
      ),
      kart(
        'Noktalı virgül',
        '- İçinde virgül bulunan sıralı cümleleri ayırır.\n- Aynı türden öbekleri gruplar.',
      ),
      kart(
        'İki nokta',
        'Açıklama, örnek ya da alıntıdan önce konur.\n- **Sonrası cümleyse:** büyük harfle başlar.\n- **Sonrası öbekse:** küçük harfle başlar.',
      ),
      kart(
        'Kesme işareti',
        'Özel adlara gelen çekim eklerini ayırır.\nKurum adlarına gelen ekler ayrılmaz: "Türk Dil Kurumuna"',
      ),
      kart(
        'Kesmenin öteki görevleri',
        '- **Sayılara gelen ekler:** 1923’te, 5’inci\n- **Büyük harfli kısaltmalar:** TBMM’ye\n- **Şiirde düşen ses:** "N’oldu" (ne oldu)',
      ),
      kart(
        'Üç nokta',
        '- Sözün bitirilmediğini gösterir.\n- Alıntıda atlanan yeri gösterir.\n- Kaba sayılan sözleri gizler.',
      ),
      kart(
        'Tırnak ve kısa çizgi',
        '- **Tırnak:** alıntıyı ve özel vurguyu gösterir.\n- **Kısa çizgi:** satır sonunda hece böler, dil bilgisinde ekleri ayırır.',
      ),
      kart(
        'Uzun çizgi ve eğik çizgi',
        '- **Uzun çizgi (—):** diyalogda konuşanın sözünü başlatır.\n- **Eğik çizgi (/):** yan yana yazılan dizeleri ayırır; adres ve tarihte de kullanılır.',
      ),
      kart(
        'Ayraç',
        '- Açıklama ya da ek bilgi için: "Yunus Emre (1240-1320)"\n- Tiyatroda sahne yönergesi için: "(Kapıyı açar.)"\n- Şüphe için (?), alay için (!)',
      ),
      kart(
        'Soru ve ünlem işareti',
        '- **Soru işareti:** soru bildiren cümlenin sonuna konur.\n- **Ünlem:** coşku, korku ve seslenmeden sonra konur.\nAyraç içinde (?) bilinmezlik, (!) alay bildirir.',
      ),
    ], [
      soru('Virgülün yeri cümlenin anlamını değiştirebilir.', true, '"Genç, adama baktı." ile "Genç adama baktı." aynı cümle değil.'),
      soru('İki nokta, açıklama ya da örnek verileceğinde kullanılır.', true, 'Ayrıca alıntıdan önce de konur.'),
      soru('Kesme işareti özel adlara gelen yapım eklerini de ayırır.', false, 'Yapım ekleri ayrılmaz; kesme yalnızca çekim eklerini ayırıyor.'),
      soru('Noktalı virgül, birbirine bağlı cümleleri ayırmak için kullanılmaz.', false, 'Aralarında ilişki olan bağımsız cümleleri ayırmak onun işlerinden biri.'),
      sikli('"ve" bağlacından önce virgül?', ['Konmaz', 'Konur'], 0, 'Eş görevlileri virgül ayırır ama ve\'den önce değil.'),
      sikli('Sözün yarım bırakıldığını gösteren işaret?', ['Üç nokta', 'İki nokta'], 0, 'İki nokta açıklama ve örnekten önce konur.'),
      sikli('İki noktadan sonra gelen cümle nasıl başlar?', ['Büyük harfle', 'Küçük harfle'], 0, 'Öbekse küçük.'),
      sikli('Sıra sayısında ne kullanılır?', ['Nokta (3.)', 'Kesme'], 0, 'Tarihte de.'),
      soru('Üç nokta alıntıda atlama yapıldığını gösterebilir.', true, 'Kaba sözlerin gizlenmesi de.'),
      sikli('Bilinmeyen ya da şüpheli bir bilgiden sonra ayraç içinde hangisi konur?', ['(?)', '(!)'], 0, '(!) alay ya da küçümseme bildirir.'),
      soru('Hitap sözlerinden sonra virgül konur.', true, '"Arkadaşlar, başlıyoruz." gibi.'),
      soru('Sayılara gelen ekler kesme işaretiyle ayrılmaz.', false, 'Ayrılır: 1923\'te, 5\'inci.'),
      soru('Eğik çizgi, yan yana yazılan dizeleri ayırmak için kullanılır.', true, 'Adres ve tarih yazımında da kullanılır.'),
      sikli('Diyalogda konuşanın sözünü başlatan işaret?', ['Kısa çizgi', 'Uzun çizgi'], 1, 'Kısa çizgi hece böler, ekleri ayırır.'),
      sikli('Tiyatroda sahne yönergesi hangi işaretle verilir?', ['Ayraç', 'Tırnak'], 0, 'Tırnak alıntıyı gösterir.'),
    ], [
      {
        soru: '"Türk Dil Kurumu" adına gelen "-na" eki nasıl yazılır?',
        siklar: ['Kesme işaretiyle', 'Kesme işareti olmadan'],
        dogru: 1,
        aciklama: {
          dogru: 'Kurum adlarına gelen ekler ayrılmaz: Türk Dil Kurumuna.',
          yanlis: 'Kesme kişi ve yer adlarında (Ankara\'ya). Kurum adlarına gelen ek ayrılmaz: Türk Dil Kurumuna.',
        },
        kart: 7,
      },
      {
        soru: '"1923 te" yazımında eksik olan nedir?',
        siklar: ['Kesme işareti', 'Virgül'],
        dogru: 0,
        aciklama: {
          dogru: 'Sayılara gelen ekler kesmeyle ayrılır: 1923\'te.',
          yanlis: 'Virgül burada görev almaz. Sayılara gelen ek kesmeyle ayrılır: 1923\'te.',
        },
        kart: 8,
      },
    ]),
    konu('trk9-varlik', 'Türkçenin Söz Varlığı', [
      kart(
        'Söz varlığı nedir?',
        'Bir dilin bütün sözcükleri, deyimleri, atasözleri ve kalıp sözleridir.\nDilin zenginliği sözcük sayısıyla değil, anlatım gücüyle ölçülür.',
      ),
      kart(
        'Dil aileleri ve Türkçe',
        'Köken bakımından Türkçe **Altay dil ailesindedir**.\nYapı bakımından diller üçe ayrılır:\n- **Tek heceli:** Çince\n- **Eklemeli (bitişken):** Türkçe, Macarca\n- **Çekimli (bükümlü):** Arapça, Almanca',
      ),
      kart(
        'Türkçenin tarihî dönemleri',
        '- **Eski Türkçe:** Göktürk ve Uygur dönemi\n- **Orta Türkçe:** Karahanlı, Harezm, Kıpçak\n- **Batı Türkçesi:** Eski Anadolu, Osmanlı ve Türkiye Türkçesi',
      ),
      kart(
        'İlk yazılı belgeler',
        '- **Göktürk (Orhun) Yazıtları:** 8. yüzyıl, bilinen ilk büyük Türkçe metinler\n- **Kutadgu Bilig:** Yusuf Has Hacip, 11. yüzyıl\n- **Divanü Lügati’t-Türk:** Kaşgarlı Mahmut, ilk Türkçe sözlük',
      ),
      kart(
        'Türetme gücü',
        'Türkçe eklemeli bir dildir.\nTek kökten bir aile üretilebilir: göz, gözlük, gözlemci, gözetmek',
      ),
      kart(
        'Yeni sözcük kazanma yolları',
        '- **Türetme:** göz → gözlük\n- **Birleştirme:** hanım + eli → hanımeli\n- **Alıntı:** kitap (Arapça), pencere (Farsça)\n- **Yeni anlam yükleme:** fare (bilgisayar faresi)',
      ),
      kart(
        'Alıntı sözcükler',
        'Her dil başka dillerden sözcük alır.\nSorun alıntı değil, karşılığı varken kullanılan gereksiz alıntıdır.',
      ),
      kart(
        'Anlam ilişkileri',
        '- **Eş anlamlı:** kara – siyah\n- **Zıt anlamlı:** uzun – kısa\n- **Eş sesli:** yüz (sayı / surat / eylem)',
      ),
      kart(
        'Dil kültürü taşır',
        'Bir toplumun önem verdiği alanda sözcük çoğalır.\nTürkçede akrabalık adları ayrıntılıdır: amca, dayı, hala, teyze, enişte, yenge.\nAtasözü ve deyimler de toplumun deneyimini saklar.',
      ),
      kart(
        'Ağız, şive, lehçe',
        'Ayrım, ayrılmanın derinliğine göre yapılır:\n- **Ağız:** aynı dilin bölgesel söyleyişi\n- **Şive:** yakın zamanda ayrılmış kol\n- **Lehçe:** çok eski bir ayrılma',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ağız', alt: 'bölgesel' },
            { ad: 'Şive', alt: 'yakın ayrılma' },
            { ad: 'Lehçe', alt: 'eski ayrılma' },
          ],
        },
        { not: 'Ağız: Ege–Karadeniz (aynı dil). Şive: Azerice (anlaşılır). Lehçe: Yakutça, Çuvaşça (anlaşılmaz). Uzaklık sırası.' },
      ),
      kart(
        'Türk dilinin lehçeleri',
        '- **Lehçe (en erken ayrılan):** Yakutça, Çuvaşça\n- **Şive (yakın kollar):** Azerice, Kazakça, Özbekçe',
      ),
    ], [
      soru('Türkçe yeni sözcükleri çoğunlukla türetme yoluyla kazanır.', true, 'Yapım ekleri sayesinde tek kökten çok sözcük üretilebiliyor.'),
      soru('Lehçe, bir dilin çok eski dönemlerde ayrılmış koludur.', true, 'Yakutça ve Çuvaşça Türkçenin lehçelerinden.'),
      soru('Ağız, ayrı bir dil sayılır.', false, 'Ağız aynı dilin bir bölgedeki söyleyiş farkı; yazı dili ortak.'),
      soru('Türkçeye başka dillerden hiç sözcük girmemiştir.', false, 'Arapça, Farsça ve Fransızcadan geçen çok sayıda sözcük var.'),
      sikli('Azerice, Türkiye Türkçesine göre ne sayılır?', ['Şive', 'Lehçe'], 0, 'Yakın zamanda ayrılmış, büyük ölçüde anlaşılan bir kol.'),
      sikli('"Kara-siyah" hangi ilişki?', ['Eş anlamlı', 'Eş sesli'], 0, 'Yüz eş sesli.'),
      soru('"Yüz" sözcüğünün sayı, surat ve eylem anlamları eş sesliliğe örnektir.', true, 'Yazılışları aynı, anlamları ayrı sözcükler.'),
      soru('Türkçe yapı bakımından eklemeli bir dildir.', true, 'Kök sabit kalır, ekler arkasına eklenir.'),
      soru('Göktürk Yazıtları 15. yüzyılda dikilmiştir.', false, 'Göktürk (Orhun) Yazıtları 8. yüzyıldan.'),
      soru('Divanü Lügati\'t-Türk, Kaşgarlı Mahmut\'un eseridir.', true, 'Türkçenin ilk sözlüğü sayılır, 11. yüzyıl.'),
      soru('Arapça eklemeli diller arasındadır.', false, 'Arapça çekimli (bükümlü) dil; kök içindeki ünlüler değişir.'),
      sikli('Osmanlı Türkçesi hangi dönemin içindedir?', ['Orta Türkçe', 'Batı Türkçesi'], 1, 'Orta Türkçe Karahanlı ve Harezm dönemleri.'),
      sikli('"Hanımeli" hangi yolla oluşmuştur?', ['Birleştirme', 'Türetme'], 0, 'Türetmede köke yapım eki gelir: göz → gözlük.'),
    ], [
      {
        soru: 'Yakutça ve Çuvaşça Türkçenin nesi sayılır?',
        siklar: ['Lehçe', 'Ağız'],
        dogru: 0,
        aciklama: {
          dogru: 'Çok eski bir ayrılma; anlaşılması güç.',
          yanlis: 'Ağız aynı dilin bölgesel söyleyişi (Ege ağzı). Çok erken ayrılan Yakutça ve Çuvaşça lehçe.',
        },
        kart: 11,
      },
      {
        soru: 'Kutadgu Bilig\'in yazarı kimdir?',
        siklar: ['Kaşgarlı Mahmut', 'Yusuf Has Hacip'],
        dogru: 1,
        aciklama: {
          dogru: 'Yusuf Has Hacip, 11. yüzyıl; Kaşgarlı Mahmut Divanü Lügati\'t-Türk\'ü yazdı.',
          yanlis: 'Kaşgarlı Mahmut sözlüğü (Divanü Lügati\'t-Türk) yazdı. Kutadgu Bilig Yusuf Has Hacip\'in.',
        },
        kart: 4,
      },
    ]),
  ]),
])
