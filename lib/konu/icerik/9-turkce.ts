import { kart, konu, program, tema } from '../tip'

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
    ]),
  ]),
])
