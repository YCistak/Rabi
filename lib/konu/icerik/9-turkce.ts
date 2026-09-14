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
        'Ressamın boyası, bestecinin sesi neyse yazarın da dili odur. Edebiyat, güzel sanatların "dille yapılan" koludur.',
      ),
      kart(
        'Kurmaca nedir?',
        'Edebî metin gerçeği aktarmaz, yeniden kurar. Anlatılan yaşanmış olsa bile metindeki hâli kurmacadır.',
      ),
      kart(
        'Edebî ve öğretici metin',
        'Edebî metin çağrıştırır ve çok anlamlıdır; öğretici metin bilgi verir ve tek anlamlı olmayı hedefler.',
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
        'Tarih dönemin olaylarını, sosyoloji toplumu, psikoloji insanı anlamak için edebî metne başvurur.',
      ),
      kart(
        'Metin türleri',
        'Olay çevresinde gelişen (hikâye, roman, tiyatro), duygu ağırlıklı (şiir) ve düşünce ağırlıklı (deneme, makale, fıkra) metinler.',
      ),
      kart(
        'Güzel sanatlarda edebiyatın yeri',
        'Sanatlar malzemesine göre ayrılır: fonetik (ses), plastik (madde), dramatik (hareket). Edebiyat fonetik sanatlardandır.',
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
        'Şiirin yapı taşı: dize (mısra), beyit (iki dize), dörtlük. Halk şiirinde dörtlük, divan şiirinde beyit kullanılır.',
      ),
      kart(
        'Ölçü',
        'Hece ölçüsünde dizelerin hece sayısı eşittir. Aruzda hecelerin uzunluk-kısalığı esastır. Serbest şiirde ölçü aranmaz.',
      ),
      kart(
        'Durak',
        'Hece ölçüsünde dizenin bölündüğü yer. Durak sözcüğü ortadan bölmez; hece sayısı tutsa bile sözcüğü kesen bölüm durak sayılmaz.',
      ),
      kart(
        'Uyak ve redif',
        'Redif dize sonundaki aynı görevdeki ek ya da sözcüktür. Redifin önündeki ses benzerliği uyaktır.',
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
        'Yarım uyak tek ses, tam uyak iki ses, zengin uyak ikiden çok ses benzerliğidir.',
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
        'Düz (aaab), çapraz (abab), sarma (abba) ve mesnevi (aabb) düzenleri vardır. Düzen, nazım biçimini tanımaya yarar.',
      ),
      kart(
        'İmge',
        'Şairin sözcükleri alışılmadık biçimde birleştirip zihinde yeni bir görüntü kurmasıdır. Şiiri düzyazıdan ayıran asıl şey.',
      ),
      kart(
        'Ahenk ögeleri',
        'Ölçü, uyak, redif, aliterasyon (ünsüz yinelemesi) ve asonans (ünlü yinelemesi) şiirin sesini kurar.',
      ),
      kart(
        'Uyak sorusunda yol',
        'Önce dize sonlarındaki ortak eki/sözcüğü (redif) at, kalan ses benzerliğini say: 1 ses yarım, 2 ses tam, 3+ zengin. "Gözlerim / sözlerim": -lerim redif, öz tam uyak.',
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
        'Bir şeyi ortak yönü olan başka bir şeye benzetme. Dört ögesi vardır: benzeyen, kendisine benzetilen, benzetme yönü, benzetme edatı.',
      ),
      kart(
        'Benzetmenin ögeleri',
        'İki temel öge benzeyen ile kendisine benzetilendir; ötekiler düşebilir. "Aslan gibi güçlü çocuk" dördünü de taşır.',
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
        'Benzetmenin iki temel ögesinden yalnız biri söylenirse istiare olur. "Aslanım geldi" derken benzeyen (kişi) söylenmemiştir.',
      ),
      kart(
        'Açık ve kapalı istiare',
        'Yalnız benzetilen söylenirse açık, yalnız benzeyen söylenip benzetilene ait bir özellik verilirse kapalı istiare olur.',
      ),
      kart(
        'Kişileştirme',
        'İnsana özgü nitelikleri başka varlıklara vermek: "Rüzgâr fısıldıyordu." Kişileştirme varsa kapalı istiare de vardır.',
      ),
      kart(
        'Mecaz-ı mürsel',
        'Benzetme amacı olmadan bir sözü başka bir sözün yerine kullanma: "Ankara açıklama yaptı" (hükûmet yerine şehir).',
      ),
      kart(
        'Tezat ve tevriye',
        'Tezat karşıt kavramları bir arada kullanmak; tevriye ise iki anlamlı bir sözü uzak anlamını kastederek söylemektir.',
      ),
      kart(
        'Abartma ve konuşturma',
        'Abartma (mübalağa) bir niteliği olduğundan çok göstermek; intak ise insan dışı varlıkları konuşturmaktır.',
      ),
      kart(
        'Sanatı tanımada kısayol',
        '"Gibi, kadar" varsa benzetme; benzeyen ya da benzetilenden yalnız biri varsa istiare; insan dışı varlık insan gibi davranıyorsa kişileştirme; parça-bütün, yer-insan ilişkisi varsa mecaz-ı mürsel.',
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
        'Yazarın bir konuda kendi düşüncelerini, kanıtlama kaygısı gütmeden, samimi bir dille anlattığı yazı. Kurucusu Montaigne.',
      ),
      kart(
        'Makale',
        'Bir düşünceyi kanıtlarla savunur. Nesnel dil kullanılır, kaynak gösterilir.',
      ),
      kart(
        'Fıkra (köşe yazısı)',
        'Güncel bir konuyu kısa ve kişisel bir üslupla ele alır; kanıtlama zorunluluğu yoktur.',
      ),
      kart(
        'Söyleşi ve eleştiri',
        'Söyleşi karşısında biri varmış gibi yazılır. Eleştiri bir eserin değerini ölçütlerle değerlendirir.',
      ),
      kart(
        'Nerede ayrışırlar?',
        'Dört türü ayıran şey konusu değil, kanıt ve dil tercihi.',
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
      ),
      kart(
        'Türk edebiyatında',
        'Deneme ve fıkra Tanzimat’la gazeteyle birlikte gelişti; Nurullah Ataç ve Suut Kemal Yetkin deneme türünün öne çıkan adlarıdır.',
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
        'Sözcüğün akla ilk gelen, sözlükteki temel anlamı. "Soğuk su" gerçek anlamdır.',
      ),
      kart(
        'Mecaz anlam',
        'Sözcüğün gerçek anlamından tamamen uzaklaşarak kazandığı anlam: "soğuk davranış".',
      ),
      kart(
        'Yan anlam',
        'Gerçek anlamla bağı sürerken kazanılan yeni anlam: "masanın ayağı". Mecazla karıştırılır; yan anlamda benzerlik bağı durur.',
      ),
      kart(
        'Üçünü ayırmak',
        'Sorulacak soru şu: gerçek anlamla bağ tümüyle koptu mu, yoksa bir benzerlik hâlâ duruyor mu?',
        {
          tur: 'tablo',
          basliklar: ['Anlam', 'Örnek'],
          satirlar: [
            ['Gerçek', 'Ağaç dalı'],
            ['Yan', 'Bilim dalı'],
            ['Mecaz', 'Dalına basmak'],
          ],
        },
      ),
      kart(
        'Terim anlam',
        'Bir bilim, sanat ya da meslek alanına özgü anlam: "kök" matematikte, dil bilgisinde ve biyolojide ayrı şey demektir.',
      ),
      kart(
        'Somut ve soyut',
        'Duyularla algılanabilen somut, algılanamayan soyuttur. "Ağır çanta" somut, "ağır söz" soyut kullanımdır.',
      ),
      kart(
        'Genel ve özel anlam',
        'Kapsamı geniş olan genel, dar olan özeldir: varlık → bitki → ağaç → çam. Sıra daraldıkça anlam özelleşir.',
      ),
      kart(
        'Nitel ve nicel',
        'Ölçülebilen anlam niceldir (üç metre), niteleme bildiren anlam niteldir (güzel manzara).',
      ),
      kart(
        'Soru kalıbı',
        '"Altı çizili sözcük hangisinde mecaz anlamda?" → sözcüğü somut karşılığıyla düşün; somut karşılık tümüyle kaybolmuşsa mecaz, benzerlik bağı duruyorsa yan anlam.',
      ),
      kart(
        'Dolaylama ve yansıma',
        'Dolaylama bir kavramı birden çok sözcükle anlatma ("beyaz altın" = pamuk); yansıma doğadaki sesi taklit eden sözcük ("şırıl şırıl").',
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
        'En az iki sözcükten oluşan, kalıplaşmış, çoğunlukla mecazlı anlatım. Öğüt vermez, bir durumu anlatır.',
      ),
      kart(
        'Atasözü',
        'Uzun deneyimden çıkmış, öğüt veren ya da genel kural bildiren kalıplaşmış söz. Deyimden ayıran şey budur.',
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
        'Anlamı güçlendirmek için sözcüklerin yinelenmesi: "yavaş yavaş", "eğri büğrü". Arasına noktalama girmez.',
      ),
      kart(
        'Kalıp sözler',
        'Belirli durumlarda söylenen hazır ifadeler: "geçmiş olsun", "kolay gelsin". Deyimden farkı, bir toplumsal duruma bağlı olmalarıdır.',
      ),
      kart(
        'Terim mi deyim mi?',
        'Deyimde sözcükler kendi anlamlarından uzaklaşır. "Göze girmek" deyim, "göz kapağı" değildir.',
      ),
      kart(
        'Kalıplaşma bozulmaz',
        'Deyim ve atasözlerinin sözcükleri değiştirilemez, sırası bozulamaz: "ağaç yaşken eğilir" başka türlü söylenemez.',
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
        'Bir yargı ötekinin gerekçesidir: "Yağmur yağdığı için maç ertelendi." "İçin, -dığından, ile" bağlar.',
      ),
      kart(
        'Amaç-sonuç',
        'Eylemin niyetini bildirir: "Sınavı kazanmak için çalıştı." Neden-sonuçtan ayıran şey, sonucun henüz gerçekleşmemiş olmasıdır.',
      ),
      kart(
        'Koşul',
        'Bir yargı ötekine bağlıdır: "Erken gelirsen görüşürüz." Koşul gerçekleşmezse öteki yargı da gerçekleşmez.',
      ),
      kart(
        'Öznellik ve nesnellik',
        'Doğruluğu kanıtlanabiliyorsa nesnel, kişiden kişiye değişiyorsa özneldir. "Roman 300 sayfa" nesnel, "roman sıkıcı" özneldir.',
      ),
      kart(
        'Örtülü anlam',
        'Söylenmediği hâlde cümleden çıkarılan yargı: "Bu yıl da kazanamadı" cümlesi önceki yılları da anlatır.',
      ),
      kart(
        'Karşılaştırma',
        'İki varlık ya da durum bir yönüyle kıyaslanır. Karşılaştırmada üstünlük olmak zorunda değildir.',
      ),
      kart(
        'Tanım cümlesi',
        '"Nedir?" sorusuna cevap veren cümledir. Yargı bildirmeyen bir betimleme tanım sayılmaz.',
      ),
      kart(
        'Üslup ve içerik',
        'Üslup nasıl anlatıldığıdır (kısa cümleler, sade dil); içerik ise ne anlatıldığı. Sorularda ikisi sık karıştırılır.',
      ),
      kart(
        'Neden mi amaç mı?',
        '"Hasta olduğu için gelmedi" neden (gerçekleşmiş sebep). "Görüşmek için geldi" amaç (henüz olmamış niyet). "İçin" ikisinde de var; bakılacak şey sebebin olup olmadığı.',
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
        'Paragrafın yazılma amacı, verilmek istenen asıl mesaj. Tek cümleyle özetlenebilir ve paragrafın tamamını kapsar.',
      ),
      kart(
        'Yardımcı düşünce',
        'Ana düşünceyi destekleyen ara yargılar. "Paragrafta değinilmemiştir" sorularının aradığı yer burasıdır.',
      ),
      kart(
        'Konu ile ana düşünce farkı',
        'Konu "neden söz ediyor" sorusunun cevabı, ana düşünce "ne demek istiyor" sorusunun. Konu bir sözcük, ana düşünce bir yargıdır.',
      ),
      kart(
        'Anlatım biçimleri',
        'Dört biçim, yazarın metne aldığı tavrı gösterir.',
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
        'Tanımlama, örneklendirme, karşılaştırma, tanık gösterme, sayısal veri. Tanık göstermede söyleyenin adı geçer, örnekte geçmez.',
      ),
      kart(
        'Paragrafın yapısı',
        'Giriş bağımsız cümleyle başlar, gelişme açar, sonuç toparlar.',
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
        'Paragrafın konusundan sapan ya da bağlantı kurulamayan cümledir. Çıkarıldığında anlam bütünlüğü bozulmaz.',
      ),
      kart(
        'Soruya göre strateji',
        'Ana düşünce için son cümleye ve tekrar eden fikre bak; konu için "neden söz ediyor" de; "değinilmemiştir" için şıkları tek tek metinle eşleştir; akışı bozan cümle için önceki-sonraki cümleyle bağ ara.',
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
        'Anlatmaya bağlı her metin bu dördünden kurulur; biri eksikse metin anlatı olmaz.',
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
        'Olayların metindeki diziliş biçimi. Gerçek zaman sırası değil, yazarın kurduğu sıradır.',
      ),
      kart(
        'Kişiler',
        'Metni ilerleten kişiler. Karakter değişip gelişir, tip ise tek bir özelliğin temsilcisidir (cimri tipi).',
      ),
      kart(
        'Mekân',
        'Yalnızca dekor değildir; kişinin ruh hâlini ve toplumsal konumunu da anlatır.',
      ),
      kart(
        'Zaman',
        'Olayın geçtiği süre ile anlatılma süresi farklı olabilir. Geri dönüşle geçmişe gidilebilir.',
      ),
      kart(
        'Çatışma',
        'Anlatıyı ilerleten şey çatışmadır: kişinin başka biriyle, toplumla, doğayla ya da kendisiyle çatışması.',
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
        'Anlatıcı her şeyi bilir; kişilerin aklından geçeni bile aktarır. Üçüncü kişi ağzından anlatılır.',
      ),
      kart(
        'Kahraman bakış açısı',
        'Anlatıcı olayın içindeki kişidir, yalnız kendi bildiğini anlatır. "Ben" ağzıyla yazılır.',
      ),
      kart(
        'Gözlemci bakış açısı',
        'Anlatıcı yalnızca dışarıdan görüleni aktarır, iç dünyaya giremez. Kamera gibi davranır.',
      ),
      kart(
        'Üçünü ayırmak',
        'Ölçü tek: anlatıcı ne kadarını biliyor ve hangi kişi ağzından konuşuyor?',
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
        'Anlatıcı da kurmacanın bir parçasıdır. "Ben" diyen anlatıcıyı yazarla karıştırmamak gerekir.',
      ),
      kart(
        'Güvenilmez anlatıcı',
        'Anlatıcı yanılıyor ya da gizliyor olabilir. Okur, anlatılanla ima edilen arasındaki farkı kendi kurar.',
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
        'Tek bir olay çevresinde, az kişiyle, kısa sürede geçen anlatı. Roman ise çok olaylı ve geniş zamanlıdır.',
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
        'Maupassant tarzı: serim-düğüm-çözüm vardır, sonu bağlanır. Türk edebiyatında Ömer Seyfettin.',
      ),
      kart(
        'Durum hikâyesi',
        'Çehov tarzı: belirgin bir olay ve çözüm yoktur, bir an ve izlenim anlatılır. Türk edebiyatında Sait Faik.',
      ),
      kart(
        'Roman türleri',
        'Tarihî, sosyal, psikolojik, macera, polisiye. Ayrım, romanın ağırlık verdiği konuya göre yapılır.',
      ),
      kart(
        'Türk romanının başlangıcı',
        'İlk yerli roman Şemsettin Sami’nin Taaşşuk-ı Talat ve Fitnat’ı; ilk edebî roman ise Namık Kemal’in İntibah’ı sayılır.',
      ),
      kart(
        'Modern anlatı',
        '20. yüzyılda olay örgüsü gevşedi, iç konuşma ve bilinç akışı öne çıktı; anlatı olayı değil bilinci izlemeye başladı.',
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
        'Tiyatro metni okunmak için değil oynanmak için yazılır. Bu yüzden anlatıcı yoktur, her şey diyalogla verilir.',
      ),
      kart(
        'Perde, sahne, replik',
        'Perde büyük bölüm, sahne kişilerin değişmesiyle oluşan alt bölüm, replik oyuncunun söylediği sözdür.',
      ),
      kart(
        'Trajedi ve komedi',
        'Trajedide soylu kişiler ve acı son, yüksek üslup vardır. Komedi güldürerek düşündürür, halktan kişileri konu alır.',
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
        'Klasik trajedide olay, yer ve zaman birliği aranırdı: tek olay, tek mekân ve bir gün içinde geçen bir eylem.',
      ),
      kart(
        'Dram',
        'Hayatı acı ve gülünç yanlarıyla birlikte verir, üslup sınırı yoktur. Modern tiyatronun temeli.',
      ),
      kart(
        'Geleneksel Türk tiyatrosu',
        'Karagöz, orta oyunu, meddah ve köy seyirlik oyunları. Yazılı metne değil doğaçlamaya dayanır.',
      ),
      kart(
        'Türk tiyatrosunda ilkler',
        'Batılı anlamda ilk tiyatro eseri Şinasi’nin Şair Evlenmesi’dir; Tanzimat’la birlikte sahnelenmeye başlandı.',
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
        'Bir sözcüğün ünlüleri ya hep kalın (a, ı, o, u) ya hep incedir (e, i, ö, ü). "Kardeş, anne, kitap" gibi sözcükler kurala uymaz.',
      ),
      kart(
        'Küçük ünlü uyumu',
        'Düz ünlüden sonra düz; yuvarlak ünlüden sonra ya dar yuvarlak ya düz-geniş ünlü gelir.',
      ),
      kart(
        'Ünsüz benzeşmesi',
        'Sert ünsüzle biten sözcüğe "c, d, g" ile başlayan ek gelirse ek sertleşir: "kitap-cı" değil kitapçı.',
      ),
      kart(
        'Ünsüz yumuşaması',
        'p, ç, t, k ile biten sözcüğe ünlüyle başlayan ek gelince b, c, d, ğ olur: kitap → kitabı. Tek heceli sözcüklerin çoğu yumuşamaz.',
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
        'İki heceli bazı sözcükler ünlüyle başlayan ek alınca bir hecesini kaybeder: burun → burnu, oğul → oğlu.',
      ),
      kart(
        'Ünlü türemesi',
        'Araya bir ses girer: "bir" sözcüğü sıra sayısı yapılırken "birinci" olur; pekiştirmede de görülür (sapasağlam).',
      ),
      kart(
        'Ünsüz türemesi',
        'Bazı alıntı sözcükler ek alınca ünsüz ikizleşir: his → hissi, af → affı.',
      ),
      kart(
        'Kaynaştırma harfleri',
        'İki ünlü yan yana gelmesin diye araya y, ş, s, n girer: "araba-y-ı", "iki-ş-er", "kapı-s-ı".',
      ),
      kart(
        'Ünlü daralması',
        '"-yor" eki a, e ünlüsünü daraltır: bekle-yor → bekliyor, anla-yor → anlıyor. "De, ye" fiilleri de "diyor, yiyor" olur.',
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
        'Bulunma eki "-de" bitişik, bağlaç "de" ayrı yazılır. Cümleden çıkarıldığında anlam bozulmuyorsa bağlaçtır, ayrı yazılır.',
      ),
      kart(
        '"ki" kuralı',
        'Bağlaç olan "ki" ayrı yazılır. Yalnız "hâlbuki, mademki, sanki, oysaki, çünkü" kalıplaşmıştır, bitişiktir.',
      ),
      kart(
        'Soru eki mi',
        'Her zaman ayrı yazılır, kendinden önceki sözcüğe uyar: "geldi mi", "güzel mi güzel".',
      ),
      kart(
        'Üç ek, tek sınama',
        'Üçünde de aynı soru sorulur: sözcükten çıkarılınca cümle bozuluyor mu?',
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
      ),
      kart(
        'Büyük harf',
        'Özel adlar büyük harfle başlar. Özel ada gelen çekim ekleri kesme ile ayrılır: "Ankara’ya". Yapım eki ayrılmaz: "Türkçe".',
      ),
      kart(
        'Birleşik sözcükler',
        'Anlamca kaynaşmışsa bitişik yazılır (hanımeli), kaynaşmamışsa ayrı (deniz kabuğu). Ses düşmesi varsa bitişiktir (kaynana).',
      ),
      kart(
        'Sayıların yazımı',
        'Metinde geçen küçük sayılar yazıyla yazılır. Büyük harfle başlayan yerlerde ve resmî belgelerde rakam kullanılır.',
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
        'Cümleyi bitirir; ayrıca kısaltmalarda, tarihlerde ve sıra sayılarında kullanılır: "3. sınıf", "12.09.2025".',
      ),
      kart(
        'Virgül',
        'Eş görevli sözcükleri, sıralı cümleleri ve uzun özneyi ayırır. Ancak "ve" bağlacından önce virgül konmaz.',
      ),
      kart(
        'Virgül anlamı değiştirir',
        'Yer değiştiren tek bir virgül cümlenin öznesini değiştirebilir; bu yüzden virgül süs değil, anlam işaretidir.',
      ),
      kart(
        'Noktalı virgül',
        'İçinde virgül bulunan sıralı cümleleri ayırır; ayrıca aynı türden öbekleri gruplar.',
      ),
      kart(
        'İki nokta',
        'Açıklama, örnek ya da alıntı gelecekse kullanılır. Sonrası cümleyse büyük, öbekse küçük harfle başlar.',
      ),
      kart(
        'Kesme işareti',
        'Özel adlara gelen çekim eklerini ayırır. Kurum adlarına gelen ekler ayrılmaz: "Türk Dil Kurumuna".',
      ),
      kart(
        'Üç nokta',
        'Sözün bittirilmediğini, alıntıda atlama yapıldığını ya da kaba sayılan sözlerin gizlendiğini gösterir.',
      ),
      kart(
        'Tırnak ve kısa çizgi',
        'Tırnak alıntıyı ve özel vurguyu gösterir; kısa çizgi satır sonunda hece böler ve dil bilgisinde ekleri ayırır.',
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
        'Bir dilin bütün sözcükleri, deyimleri, atasözleri ve kalıp sözleri. Dilin zenginliği sözcük sayısıyla değil, anlatım gücüyle ölçülür.',
      ),
      kart(
        'Türetme gücü',
        'Türkçe eklemeli bir dildir: tek kökten "göz, gözlük, gözlemci, gözetmek" gibi bir aile üretilebilir.',
      ),
      kart(
        'Alıntı sözcükler',
        'Her dil başka dillerden sözcük alır. Sorun alıntı değil, karşılığı varken kullanılan gereksiz alıntıdır.',
      ),
      kart(
        'Anlam ilişkileri',
        'Eş anlamlı (kara-siyah), zıt anlamlı (uzun-kısa), eş sesli (yüz: sayı / surat / eylem) sözcükler.',
      ),
      kart(
        'Ağız, şive, lehçe',
        'Ayrım ayrılma derinliğine göredir: ağız aynı dilin bölgesel söyleyişi, lehçe ise çok eski bir ayrılmadır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ağız', alt: 'bölgesel' },
            { ad: 'Şive', alt: 'yakın ayrılma' },
            { ad: 'Lehçe', alt: 'eski ayrılma' },
          ],
        },
      ),
      kart(
        'Türk dilinin lehçeleri',
        'Yakutça ve Çuvaşça en erken ayrılan lehçelerdir; Azerice, Kazakça ve Özbekçe ise şive sayılan yakın kollardır.',
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
