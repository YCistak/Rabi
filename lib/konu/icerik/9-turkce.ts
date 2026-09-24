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
        'Edebiyatın öteki bilimlerle ilişkisi',
        'Edebî metne başvuran bilimler:\n- **Tarih:** dönemin olaylarını anlamak için\n- **Sosyoloji:** toplumu anlamak için\n- **Psikoloji:** insanı anlamak için',
      ),
      kart(
        'Metin türleri',
        '- **Olay çevresinde:** hikâye, roman, tiyatro\n- **Duygu ağırlıklı:** şiir\n- **Düşünce ağırlıklı:** deneme, makale, fıkra',
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
      soru('Öğretici metin çok anlamlı olmayı hedefler.', false, 'Tek anlamlı olmayı hedefler; edebî metin çağrıştırır.'),
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
        'Şairin sözcükleri alışılmadık biçimde birleştirip zihinde yeni bir görüntü kurmasıdır.\nŞiiri düzyazıdan ayıran asıl şey budur.',
      ),
      kart(
        'Ahenk ögeleri',
        'Ölçü, uyak ve redif şiirin sesini kurar. Bunlara iki öge daha eklenir:\n- **Aliterasyon:** ünsüz yinelemesi\n- **Asonans:** ünlü yinelemesi',
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
      soru('İmge, şiiri düzyazıdan ayıran asıl şeydir.', true, 'Sözcüklerin alışılmadık birleşimi.'),
    ], [
      {
        soru: '"Dağlara / bağlara" dizelerinde "-lara" nedir?',
        siklar: ['Redif', 'Uyak'],
        dogru: 0,
        aciklama: {
          dogru: 'Aynı görevdeki ek redif; önündeki "ağ" sesleri tam uyak.',
          yanlis: 'Uyak, redifin önündeki ses benzerliği ("ağ"). Aynı görevdeki ek olan "-lara" rediftir.',
        },
        kart: 4,
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
      sikli('Benzetmenin iki temel ögesi?', ['Yön ve edat', 'Benzeyen ve kendisine benzetilen'], 1, 'Ötekiler düşebilir.'),
      sikli('"Aslanım geldi" ifadesinde ne var?', ['Benzetme', 'Açık istiare'], 1, 'Yalnız benzetilen söylenmiş.'),
      sikli('İki anlamlı sözü uzak anlamıyla kastetmek?', ['Tezat', 'Tevriye'], 1, 'Tezat karşıt kavramlar.'),
      sikli('İnsan dışı varlıkları konuşturmak?', ['İntak', 'Mübalağa'], 0, 'Mübalağa abartma.'),
      soru('"Ankara açıklama yaptı" cümlesinde benzetme amacı vardır.', false, 'Mecaz-ı mürsel: benzetme amacı yok.'),
    ], [
      {
        soru: '"Bütün sınıf ayağa kalktı" cümlesindeki sanat?',
        siklar: ['Mecaz-ı mürsel', 'Benzetme'],
        dogru: 0,
        aciklama: {
          dogru: '"Sınıf" yer adı, kastedilen öğrenciler; benzetme amacı yok.',
          yanlis: 'Benzetmede iki şey arasında ortak yön kurulur. Burada yer adı içindeki insanların yerine kullanılmış: mecaz-ı mürsel.',
        },
        kart: 6,
      },
    ]),
    konu('trk9-deneme', 'Deneme ve Düşünce Yazıları', [
      kart(
        'Deneme',
        'Yazar bir konudaki kendi düşüncelerini samimi bir dille anlatır.\nKanıtlama kaygısı gütmez. Türün kurucusu **Montaigne**’dir.',
      ),
      kart(
        'Makale',
        'Bir düşünceyi kanıtlarla savunur.\nNesnel dil kullanılır, kaynak gösterilir.',
      ),
      kart(
        'Fıkra (köşe yazısı)',
        'Güncel bir konuyu kısa ve kişisel bir üslupla ele alır.\nKanıtlama zorunluluğu yoktur.',
      ),
      kart(
        'Söyleşi ve eleştiri',
        '- **Söyleşi:** karşısında biri varmış gibi yazılır.\n- **Eleştiri:** bir eserin değerini ölçütlerle değerlendirir.',
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
        'Deneme ve fıkra, Tanzimat’ta gazeteyle birlikte gelişti.\nDenemenin öne çıkan adları: Nurullah Ataç, Suut Kemal Yetkin',
      ),
    ], [
      soru('Denemede yazar düşüncesini kanıtlama kaygısı gütmez.', true, 'Kendi kendine konuşur gibi yazar; okuru ikna etme zorunluluğu yok.'),
      soru('Makale, bir düşünceyi kanıtlarla savunan öğretici metindir.', true, 'Bilimsel veriye ve kaynağa dayanır.'),
      soru('Fıkra, uzun uzun kanıt sunan bilimsel bir yazı türüdür.', false, 'Kısa, günlük dille yazılır ve kanıtlama kaygısı taşımaz.'),
      soru('Deneme ile makale arasında bir fark yoktur.', false, 'Makale kanıtlar, deneme düşündürür; üslupları da ayrı.'),
      sikli('Denemenin kurucusu kimdir?', ['Ataç', 'Montaigne'], 1, 'Nurullah Ataç Türk edebiyatında.'),
      sikli('Güncel bir konuyu kısa ve kişisel üslupla ele alan?', ['Makale', 'Fıkra'], 1, 'Köşe yazısı.'),
      soru('Eleştiri bir eseri ölçütlerle değerlendirir.', true, 'Söyleşi karşısında biri varmış gibi.'),
    ], [
      {
        soru: 'Kaynak gösterip kanıtla savunan düşünce yazısı?',
        siklar: ['Makale', 'Deneme'],
        dogru: 0,
        aciklama: {
          dogru: 'Makale nesnel dil ve kanıt ister; deneme kanıtlama kaygısı gütmez.',
          yanlis: 'Deneme kişisel ve kanıtsızdır. Kanıt ve kaynak gösteren tür makale.',
        },
        kart: 2,
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
    ], [
      soru('Bir sözcüğün akla ilk gelen anlamına gerçek anlam denir.', true, 'Temel anlam da denir.'),
      soru('"Ağır bir soru" ifadesinde "ağır" gerçek anlamıyla kullanılmıştır.', false, 'Burada "zor" anlamında; mecaz anlam.'),
      soru('Terim anlam, bir bilim ya da sanat dalına özgü anlamdır.', true, '"Kök" sözcüğünün matematikteki karşılığı buna örnek.'),
      soru('Somut anlamlı sözcükler duyu organlarıyla algılanamayan kavramları karşılar.', false, 'Tersi: somut olan algılanabilir, algılanamayan soyuttur.'),
      sikli('"Soğuk davranış" ifadesinde "soğuk" hangi anlamda?', ['Mecaz', 'Gerçek'], 0, 'Gerçek anlamdan tümüyle uzak.'),
      sikli('"Kök" sözcüğü matematik ve biyolojide farklı anlamdaysa?', ['Terim anlam', 'Yan anlam'], 0, 'Alana özgü.'),
      sikli('"Ağır söz" hangi kullanımdır?', ['Soyut', 'Somut'], 0, 'Ağır çanta somut.'),
      sikli('varlık → bitki → ağaç → çam sırası?', ['Genelden özele', 'Özelden genele'], 0, 'Kapsam daralıyor.'),
      sikli('"Beyaz altın" (pamuk) ne örneğidir?', ['Yansıma', 'Dolaylama'], 1, 'Yansıma ses taklidi.'),
      sikli('"Üç metre" hangi anlamdır?', ['Nitel', 'Nicel'], 1, 'Ölçülebilir.'),
      soru('Yan anlamda gerçek anlamla benzerlik bağı sürer.', true, 'Masanın ayağı.'),
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
    ]),
    konu('trk9-soz', 'Deyim, Atasözü ve Söz Öbekleri', [
      kart(
        'Deyim',
        'En az iki sözcükten oluşan, kalıplaşmış, çoğunlukla mecazlı anlatımdır.\nÖğüt vermez, bir durumu anlatır.',
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
        'İkileme',
        'Anlamı güçlendirmek için sözcüklerin yinelenmesidir.\nÖrnek: yavaş yavaş, eğri büğrü\nArasına noktalama girmez.',
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
      sikli('"Yavaş yavaş" nedir?', ['İkileme', 'Deyim'], 0, 'Arasına noktalama girmez.'),
      sikli('"Kolay gelsin" nedir?', ['Kalıp söz', 'Atasözü'], 0, 'Toplumsal duruma bağlı.'),
      soru('Deyimin sözcükleri değiştirilebilir.', false, 'Kalıplaşma bozulmaz.'),
    ], [
      {
        soru: '"Damlaya damlaya göl olur" hangisidir?',
        siklar: ['Atasözü', 'Deyim'],
        dogru: 0,
        aciklama: {
          dogru: 'Genel bir kural ve öğüt bildiriyor; deyim durum anlatır, öğüt vermez.',
          yanlis: 'Deyim bir durumu anlatır ("göze girmek"). Öğüt veren ve genel kural bildiren kalıplaşmış söz atasözü.',
        },
        kart: 2,
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
      sikli('"Sınavı kazanmak için çalıştı" hangi ilişki?', ['Amaç-sonuç', 'Neden-sonuç'], 0, 'Sonuç henüz gerçekleşmemiş.'),
      sikli('"Bu yıl da kazanamadı" cümlesindeki örtülü anlam?', ['Önceki yıllarda da kazanamadı', 'Gelecek yıl kazanacak'], 0, 'Söylenmeden çıkarılan yargı.'),
      sikli('"Roman sıkıcı" nasıl bir yargı?', ['Öznel', 'Nesnel'], 0, 'Kişiye göre değişir.'),
      sikli('Kısa cümle ve sade dil neyi anlatır?', ['İçeriği', 'Üslubu'], 1, 'Nasıl anlatıldığı.'),
      soru('Karşılaştırmada mutlaka üstünlük olmalıdır.', false, 'Olmak zorunda değil.'),
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
        'Düşünceyi geliştirme yolları',
        'Tanımlama, örneklendirme, karşılaştırma, tanık gösterme, sayısal veri.\n- **Tanık göstermede:** söyleyenin adı geçer.\n- **Örneklendirmede:** geçmez.',
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
        'Akışı bozan cümle',
        'Paragrafın konusundan sapan ya da bağlantı kurulamayan cümledir.\nÇıkarıldığında anlam bütünlüğü bozulmaz.',
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
      sikli('Konu nasıl ifade edilir?', ['Bir yargıyla', 'Bir sözcük ya da öbekle'], 1, 'Ana düşünce yargı.'),
      sikli('Paragrafın hangi bölümü bağımsız cümleyle başlar?', ['Sonuç', 'Giriş'], 1, 'Gelişme açar, sonuç toparlar.'),
      soru('Akışı bozan cümle çıkarılınca anlam bütünlüğü bozulur.', false, 'Bozulmaz; zaten konudan sapıyor.'),
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
        'Kişiler',
        'Metni ilerleten kişilerdir.\n- **Karakter:** değişir ve gelişir.\n- **Tip:** tek bir özelliğin temsilcisidir (cimri tipi).',
      ),
      kart(
        'Mekân',
        'Mekân yalnızca dekor değildir.\nKişinin ruh hâlini ve toplumsal konumunu da anlatır.',
      ),
      kart(
        'Zaman',
        'Olayın geçtiği süre ile anlatılma süresi farklı olabilir.\nGeri dönüşle geçmişe gidilebilir.',
      ),
      kart(
        'Çatışma',
        'Anlatıyı ilerleten çatışmadır. Kişi şunlarla çatışabilir:\n- Başka biriyle ya da toplumla\n- Doğayla\n- Kendisiyle',
        undefined,
        { not: 'Kişi–toplum (Yaban\'daki aydın), kişi–kendisi (Suç ve Ceza), kişi–doğa (Yaşlı Adam ve Deniz). Çatışma yoksa anlatı yok.' },
      ),
    ], [
      soru('Anlatmaya bağlı metinlerin yapı ögeleri olay örgüsü, kişiler, mekân ve zamandır.', true, 'Dördü birlikte kurmacanın iskeletini oluşturuyor.'),
      soru('Olay örgüsü, olayların yaşandıkları sırayla anlatılması demektir.', false, 'Olaylar geri dönüşlerle de verilebilir; olay örgüsü kurgunun düzeni.'),
      soru('Çatışma yalnızca iki kişi arasında yaşanır.', false, 'Kişinin kendi içinde ya da doğayla, toplumla da çatışması olabilir.'),
      soru('Mekân, kişiler hakkında da ipucu verebilir.', true, 'Yaşanılan yerin anlatımı çoğu zaman kişinin durumunu da anlatıyor.'),
      sikli('Anlatıyı ilerleten şey nedir?', ['Mekân', 'Çatışma'], 1, 'Kişinin başkasıyla, toplumla, doğayla ya da kendisiyle.'),
      sikli('Olay örgüsü neyi gösterir?', ['Gerçek zaman sırasını', 'Yazarın kurduğu sırayı'], 1, 'Geri dönüşle geçmişe gidilebilir.'),
      soru('Mekân yalnızca dekordur.', false, 'Ruh hâlini ve toplumsal konumu da anlatır.'),
    ], [
      {
        soru: 'Tek bir özelliğin temsilcisi olan kişiye ne denir?',
        siklar: ['Karakter', 'Tip'],
        dogru: 1,
        aciklama: {
          dogru: 'Tip değişmez (cimri tipi); karakter metin boyunca gelişir.',
          yanlis: 'Karakter çok yönlüdür ve değişir. Tek özellikle tanımlanan, değişmeyen kişi tip.',
        },
        kart: 3,
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
        'Anlatıcı yazar değildir',
        'Anlatıcı da kurmacanın bir parçasıdır.\n"Ben" diyen anlatıcıyı yazarla karıştırmamak gerekir.',
        undefined,
        { not: 'Sait Faik \'ben\' diyen hikâye yazar ama anlatıcı Sait Faik değildir; sınav \'yazar anlatıcıdır\' derse yanlış.' },
      ),
      kart(
        'Güvenilmez anlatıcı',
        'Anlatıcı yanılıyor ya da bir şey gizliyor olabilir.\nOkur, anlatılanla ima edilen arasındaki farkı kendisi kurar.',
      ),
    ], [
      soru('İlahi bakış açısındaki anlatıcı kişilerin iç dünyasını bilir.', true, 'Her şeyi bilen anlatıcı geçmişi ve geleceği de aktarabilir.'),
      soru('Kahraman bakış açısında anlatıcı "ben" diliyle konuşur.', true, 'Anlatan, olayın içindeki kişilerden biri.'),
      soru('Anlatıcı ile yazar aynı kişidir.', false, 'Anlatıcı kurmacanın içindeki ses; yazar onu kuran kişi.'),
      soru('Gözlemci bakış açısındaki anlatıcı kişilerin aklından geçenleri aktarır.', false, 'Yalnızca dışarıdan görüp duyduklarını aktarabilir.'),
      sikli('"Ben" ağzıyla yalnız kendi bildiğini anlatan?', ['İlahi bakış açısı', 'Kahraman bakış açısı'], 1, 'Olayın içindeki kişi.'),
      sikli('Anlatıcının yanılıyor ya da gizliyor olması?', ['Gözlemci anlatıcı', 'Güvenilmez anlatıcı'], 1, 'Okur farkı kendi kurar.'),
      soru('"Ben" diyen anlatıcı yazarın kendisidir.', false, 'Anlatıcı da kurmacanın parçası.'),
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
        'Roman türleri',
        'Tarihî, sosyal, psikolojik, macera, polisiye.\nAyrım, romanın ağırlık verdiği konuya göre yapılır.',
      ),
      kart(
        'Türk romanının başlangıcı',
        '- **İlk yerli roman:** Taaşşuk-ı Talat ve Fitnat (Şemsettin Sami)\n- **İlk edebî roman:** İntibah (Namık Kemal)',
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
      sikli('İlk yerli roman hangisidir?', ['İntibah', 'Taaşşuk-ı Talat ve Fitnat'], 1, 'İntibah ilk edebî roman.'),
      sikli('Serim-düğüm-çözüm olan, sonu bağlanan hikâye?', ['Durum hikâyesi', 'Olay hikâyesi'], 1, 'Maupassant tarzı.'),
      soru('Modern anlatıda olay örgüsü gevşedi, bilinç akışı öne çıktı.', true, '20. yüzyıl.'),
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
        'Türk tiyatrosunda ilkler',
        'Batılı anlamda ilk tiyatro eseri **Şinasi**’nin **Şair Evlenmesi**’dir.\nTanzimat’la birlikte sahnelenmeye başlandı.',
      ),
    ], [
      soru('Tiyatro metinleri sahnelenmek üzere yazılır.', true, 'Bu yüzden metinde sahne yönergeleri de bulunur.'),
      soru('Trajedide kahramanlar halktan sıradan kişilerdir.', false, 'Trajedide soylu ve tanınmış kişiler; sıradan kişiler komedinin konusu.'),
      soru('Karagöz ve orta oyunu geleneksel Türk tiyatrosu içinde yer alır.', true, 'Meddah da bu geleneğin parçası.'),
      soru('Üç birlik kuralı yer, zaman ve olay birliğinin bozulmasını ister.', false, 'Tersine, üçünün de korunmasını ister.'),
      sikli('Oyuncunun söylediği söze ne denir?', ['Perde', 'Replik'], 1, 'Perde büyük bölüm.'),
      sikli('Tek olay, tek mekân, bir gün: hangi kural?', ['Dram', 'Üç birlik'], 1, 'Klasik trajedi.'),
      sikli('Karagöz ve meddah neye dayanır?', ['Yazılı metin', 'Doğaçlama'], 1, 'Geleneksel Türk tiyatrosu.'),
      sikli('Soylu kişiler, acı son, yüksek üslup?', ['Komedi', 'Trajedi'], 1, 'Komedi halktan kişiler.'),
      soru('Tiyatro metninde anlatıcı vardır.', false, 'Her şey diyalogla verilir.'),
    ], [
      {
        soru: 'Batılı anlamda ilk Türk tiyatro eseri?',
        siklar: ['Şair Evlenmesi', 'İntibah'],
        dogru: 0,
        aciklama: {
          dogru: 'Şinasi\'nin eseri; Tanzimat\'la sahnelenmeye başlandı.',
          yanlis: 'İntibah Namık Kemal\'in romanı. İlk tiyatro eseri Şinasi\'nin Şair Evlenmesi.',
        },
        kart: 7,
      },
    ]),
  ]),
  tema('trk9-t4', 'Dilin Zenginliği', [
    konu('trk9-ses', 'Ses Bilgisi', [
      kart(
        'Büyük ünlü uyumu',
        'Sözcüğün ünlüleri ya hep kalın ya hep incedir:\n- **Kalın:** a, ı, o, u\n- **İnce:** e, i, ö, ü\nUymayanlar: kardeş, anne, kitap',
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
      sikli('"Kitapçı" sözcüğündeki ç neyin sonucu?', ['Ünsüz benzeşmesi', 'Ünsüz yumuşaması'], 0, 'Sert ünsüzden sonra ek sertleşti.'),
      soru('"Kardeş" sözcüğü büyük ünlü uyumuna uyar.', false, 'a kalın, e ince.'),
    ], [
      {
        soru: '"Kitap → kitabı" değişimi hangi ses olayıdır?',
        siklar: ['Ünsüz benzeşmesi', 'Ünsüz yumuşaması'],
        dogru: 1,
        aciklama: {
          dogru: 'Sert p, ünlüyle başlayan ek gelince b oldu.',
          yanlis: 'Benzeşmede ek sertleşir (kitap-çı). Burada sözcüğün sonundaki sert ünsüz yumuşadı.',
        },
        kart: 4,
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
        'Birleşik sözcükler',
        '- **Anlamca kaynaşmışsa:** bitişik (hanımeli)\n- **Kaynaşmamışsa:** ayrı (deniz kabuğu)\n- **Ses düşmesi varsa:** bitişik (kaynana)',
      ),
      kart(
        'Sayıların yazımı',
        'Metinde geçen sayılar genellikle yazıyla yazılır.\nSaat, tarih, ölçü ve istatistik bilgilerinde rakam kullanılır.',
      ),
    ], [
      soru('Bağlaç olan "de" ayrı yazılır.', true, 'Cümleden çıkarıldığında anlam bozulmuyorsa bağlaçtır.'),
      soru('Soru eki olan "mi" her zaman ayrı yazılır.', true, 'Kendinden sonra gelen ekler ona bitişik yazılır.'),
      soru('Bulunma durumu eki olan "-de" ayrı yazılır.', false, 'Ek olan "-de" bitişik yazılır; ayrı yazılan bağlaç olandır.'),
      soru('Sayılar metin içinde her zaman rakamla yazılır.', false, 'Metin içinde çoğunlukla yazıyla yazılır; ölçü ve tarihlerde rakam kullanılır.'),
      sikli('"Sanki" nasıl yazılır?', ['Ayrı', 'Bitişik'], 1, 'Kalıplaşmış: hâlbuki, mademki, oysaki, çünkü.'),
      sikli('Özel ada gelen yapım eki nasıl yazılır?', ['Kesme ile', 'Kesme olmadan (Türkçe)'], 1, 'Çekim eki ayrılır: Ankara\'ya.'),
      sikli('"Hanımeli" neden bitişik?', ['Kısa olduğu için', 'Anlamca kaynaşmış'], 1, 'Deniz kabuğu ayrı.'),
      sikli('"Güzel mi güzel" ifadesinde mi nasıl yazılır?', ['Bitişik', 'Ayrı'], 1, 'Soru eki her zaman ayrı.'),
      soru('"Kaynana" ses düşmesi olduğu için bitişik yazılır.', true, 'Kayın ana.'),
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
        'Üç nokta',
        '- Sözün bitirilmediğini gösterir.\n- Alıntıda atlanan yeri gösterir.\n- Kaba sayılan sözleri gizler.',
      ),
      kart(
        'Tırnak ve kısa çizgi',
        '- **Tırnak:** alıntıyı ve özel vurguyu gösterir.\n- **Kısa çizgi:** satır sonunda hece böler, dil bilgisinde ekleri ayırır.',
      ),
    ], [
      soru('Virgülün yeri cümlenin anlamını değiştirebilir.', true, '"Genç, adama baktı." ile "Genç adama baktı." aynı cümle değil.'),
      soru('İki nokta, açıklama ya da örnek verileceğinde kullanılır.', true, 'Ayrıca alıntıdan önce de konur.'),
      soru('Kesme işareti özel adlara gelen yapım eklerini de ayırır.', false, 'Yapım ekleri ayrılmaz; kesme yalnızca çekim eklerini ayırıyor.'),
      soru('Noktalı virgül, birbirine bağlı cümleleri ayırmak için kullanılmaz.', false, 'Aralarında ilişki olan bağımsız cümleleri ayırmak onun işlerinden biri.'),
      sikli('"ve" bağlacından önce virgül?', ['Konmaz', 'Konur'], 0, 'Eş görevlileri virgül ayırır ama ve\'den önce değil.'),
      sikli('İçinde virgül olan sıralı cümleleri ayıran?', ['Noktalı virgül', 'İki nokta'], 0, 'Gruplar.'),
      sikli('İki noktadan sonra gelen cümle nasıl başlar?', ['Büyük harfle', 'Küçük harfle'], 0, 'Öbekse küçük.'),
      sikli('Sıra sayısında ne kullanılır?', ['Nokta (3.)', 'Kesme'], 0, 'Tarihte de.'),
      soru('Üç nokta alıntıda atlama yapıldığını gösterebilir.', true, 'Kaba sözlerin gizlenmesi de.'),
    ], [
      {
        soru: '"Türk Dil Kurumu" adına gelen "-na" eki nasıl yazılır?',
        siklar: ['Kesme işaretiyle', 'Kesme işareti olmadan'],
        dogru: 1,
        aciklama: {
          dogru: 'Kurum adlarına gelen ekler ayrılmaz: Türk Dil Kurumuna.',
          yanlis: 'Kesme kişi ve yer adlarında (Ankara\'ya). Kurum adlarına gelen ek ayrılmaz: Türk Dil Kurumuna.',
        },
        kart: 6,
      },
    ]),
    konu('trk9-varlik', 'Türkçenin Söz Varlığı', [
      kart(
        'Söz varlığı nedir?',
        'Bir dilin bütün sözcükleri, deyimleri, atasözleri ve kalıp sözleridir.\nDilin zenginliği sözcük sayısıyla değil, anlatım gücüyle ölçülür.',
      ),
      kart(
        'Türetme gücü',
        'Türkçe eklemeli bir dildir.\nTek kökten bir aile üretilebilir: göz, gözlük, gözlemci, gözetmek',
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
      sikli('"Göz, gözlük, gözlemci" neyi gösterir?', ['Türetme gücünü', 'Alıntıyı'], 0, 'Eklemeli dil.'),
      sikli('"Kara-siyah" hangi ilişki?', ['Eş anlamlı', 'Eş sesli'], 0, 'Yüz eş sesli.'),
      soru('Alıntı sözcüğün kendisi sorundur.', false, 'Sorun karşılığı varken kullanılan gereksiz alıntı.'),
    ], [
      {
        soru: 'Yakutça ve Çuvaşça Türkçenin nesi sayılır?',
        siklar: ['Lehçe', 'Ağız'],
        dogru: 0,
        aciklama: {
          dogru: 'Çok eski bir ayrılma; anlaşılması güç.',
          yanlis: 'Ağız aynı dilin bölgesel söyleyişi (Ege ağzı). Çok erken ayrılan Yakutça ve Çuvaşça lehçe.',
        },
        kart: 6,
      },
    ]),
  ]),
])
