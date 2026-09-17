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
        'Ressam tuvale boya sürer, besteci notaları dizer. Yazar ne yapar? Sözcükleri dizer. Edebiyat, yani dille yapılan güzel sanat. Bir şiir de bir roman da aynı malzemeden, dilden yapılır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yaşanmış olay bile metinde kurmacadır',
        'Bir yazar dedesinin savaş anısını romana çevirdi. Olay yaşanmış; ama romandaki hâli yazarın sözcükleriyle yeniden kurulmuş. Kurmaca, yani yazarın hayal gücüyle kurduğu dünya. Edebî metne "gerçek mi" diye sorma; "nasıl kurulmuş" diye sor.',
        undefined,
        { not: 'Soruda "yaşanmış olay" geçince şaşırma: romana girdiği anda o olay artık kurmacadır.' },
      ),
      kart(
        'Edebî metin sezdirir, öğretici bilgi verir',
        '"Gözlerin bir deniz" ile "Göz, ışığı algılayan organdır" aynı şeyi anlatmıyor. İlki edebî: seni düşündürür, herkeste ayrı bir şey çağrıştırır. İkincisi öğretici: bilgi verir, tek anlam taşır. Şiir edebî, ansiklopedi öğreticidir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Edebî metin', 'Öğretici metin'],
          satirlar: [
            ['Amaç', 'Sezdirir', 'Bilgi verir'],
            ['Anlam', 'Çok anlamlı', 'Tek anlamlı'],
            ['Dünya', 'Kurmaca', 'Gerçek'],
            ['Örnek', 'Şiir', 'Ansiklopedi'],
          ],
        },
      ),
      kart(
        'Metin olay, duygu ya da düşünce anlatır',
        'Hikâye okurken "sonra ne oldu" dersin: olay çevresinde gelişen metin (hikâye, roman, tiyatro). Şiirde bir duygu sana geçer: duygu ağırlıklı metin. Denemede yazar bir fikri açar: düşünce ağırlıklı metin (deneme, makale, fıkra).',
      ),
      kart(
        'Edebiyat ses sanatlarındandır',
        'Sanatlar malzemesine göre ayrılır. Heykel taştan, resim boyadan: plastik, yani maddeyle yapılan sanat. Tiyatro ve dans hareketle: dramatik sanat. Müzik ve edebiyat sesle: fonetik sanat. Dil sesten kurulduğu için edebiyat fonetik sanattır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Malzeme', 'Örnek'],
          satirlar: [
            ['Fonetik', 'Ses', 'Müzik, edebiyat'],
            ['Plastik', 'Madde', 'Resim, heykel'],
            ['Dramatik', 'Hareket', 'Tiyatro, dans'],
          ],
        },
      ),
      kart(
        'Tarihçi de romana bakar',
        'Tanzimat dönemini merak eden tarihçi o dönemin romanlarını okur; sokak, ev, konuşma orada. Psikolog kıskançlığı Othello\'da görür. Edebiyat; tarih, sosyoloji (toplum bilimi) ve psikolojiyle böyle bağlanır: metin, çağının aynası.',
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
        'Dize, beyit, dörtlük: şiirin yapı taşları',
        'Şiirin bir satırına dize (mısra) denir. İki dize bir araya gelince beyit, dört dize dörtlük olur. Bunlara nazım birimi, yani şiirin yapı taşı denir. Halk şiiri (Karacaoğlan) dörtlükle, divan şiiri (Fuzuli) beyitle yazılır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Hece ölçüsünde her dize eşit hecelidir',
        '"İncecikten bir kar yağar" dizesini hecele: sekiz hece. Şiirin öteki dizeleri de sekizse bu hece ölçüsü, yani her dizede eşit hece sayısı. Aruz ölçüsünde sayı değil hecelerin uzun-kısa oluşu sayılır. Serbest şiirde ölçü yoktur.',
      ),
      kart(
        'Durak sözcüğü ortadan bölmez',
        '"İncecikten bir kar yağar" sekiz heceli; okurken "İncecikten / bir kar yağar" diye 4+4 durursun. Durak, yani dizenin nefes aldığı yer. Durak sözcüğün ortasına gelmez: "İnceci / kten bir kar" olmaz, hece sayısı tutsa bile.',
      ),
      kart(
        'Redif dize sonundaki aynı ektir',
        '"Gözlerim / sözlerim" dizelerine bak. İkisinde de "-lerim" eki var, görevi aynı. Bu redif, yani dize sonunda tekrarlanan aynı görevdeki ek ya da sözcük. Redif ses benzerliği değildir; aynı ek ya da aynı sözcük olması şart.',
      ),
      kart(
        'Redifi at, kalan ses uyaktır',
        '"Gözlerim / sözlerim"de "-lerim"i at: "göz" ve "söz" kalır. Ortak ses "öz". İşte bu uyak (kafiye), yani redifin önündeki ses benzerliği. Sırayı bozma: önce redifi bul, sonra uyağa bak. Redifi atmadan uyağa bakmak en sık hata.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Önce redifi bul' },
            { ad: 'Kalanı karşılaştır' },
            { ad: 'Uyak türünü söyle' },
          ],
        },
        { etiket: 'Sık hata', not: 'Dize sonlarını gördüğünde önce aynı eki ayır; uyağı ancak kalan kısımda ara.' },
      ),
      kart(
        'Uyak ses sayısına göre ad alır',
        '"Göz / söz"de ortak ses "öz": iki ses, tam uyak. "Gel / al"da yalnız "l": tek ses, yarım uyak. "Gölge / bölge"de "ölge": dört ses, zengin uyak. Kural: bir ses yarım, iki ses tam, üç ve daha çok ses zengin uyak.',
        {
          tur: 'tablo',
          basliklar: ['Uyak', 'Benzerlik', 'Örnek'],
          satirlar: [
            ['Yarım', '1 ses', 'gel / al'],
            ['Tam', '2 ses', 'göz / söz'],
            ['Zengin', '3 ve üstü', 'gölge / bölge'],
          ],
        },
      ),
      kart(
        'Uyak düzeni harflerle yazılır',
        'Dörtlüğün dize sonlarına harf ver; uyaklı dizeler aynı harfi alır. 1. ile 3., 2. ile 4. uyaklıysa abab: çapraz. Dıştakiler ve içtekiler kendi arasında uyaklıysa abba: sarma. Hepsi uyaklıysa aaaa ya da aaab: düz. İkişerli aabb: mesnevi.',
      ),
      kart(
        'Ses tekrarı şiire ahenk verir',
        '"Sessiz sessiz süzülür sular"da "s" sesi tekrarlanıyor: aliterasyon, yani ünsüz tekrarı. "Karşı yatan kara dağlar"da "a" tekrarlanıyor: asonans, yani ünlü tekrarı. Ölçü, uyak, redif ve bu tekrarlar birlikte ahengi, yani ses uyumunu kurar.',
      ),
      kart(
        'İmge zihinde yeni bir görüntü kurar',
        '"Saçların bir yaz akşamı" dersen saçla akşamı ilk kez yan yana getirmiş olursun. Okuyanın zihninde yeni bir resim belirir. İmge, yani sözcüklerin alışılmadık birleşimiyle kurulan görüntü. Şiiri düzyazıdan ayıran asıl şey bu.',
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
        'Benzetme iki şeyi ortak yönle bağlar',
        '"Aslan gibi güçlü çocuk" dersin. Çocuğu aslana benzettin; ortak yön güç. Benzetme (teşbih), yani bir şeyi ortak yönü olan başka bir şeye benzetmek. Zayıf olanı güçlü olana benzetirsin: çocuk aslana, aslan çocuğa değil.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Benzetmenin dört ögesi vardır',
        '"Aslan gibi güçlü çocuk"ta dört parça var: benzeyen (çocuk), kendisine benzetilen (aslan), benzetme yönü (güçlü), benzetme edatı (gibi). Benzeyen ile benzetilen temel ögeler; yön ve edat düşebilir: "Aslan çocuk."',
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
        'Tek temel öge kalınca istiare olur',
        '"Aslanım geldi" dersin; aslan var, çocuk yok. Yani benzetilen söylenmiş, benzeyen söylenmemiş. Temel ögelerden yalnız biri varsa buna istiare (eğretileme) denir. İki temel öge de varsa benzetme, biri yoksa istiare.',
        undefined,
        { not: '"Aslanım" gördüğünde sor: benzeyen söylenmiş mi, benzetilen mi? İkisi de varsa benzetme, biri varsa istiare.' },
      ),
      kart(
        'Açık istiarede benzetilen söylenir',
        '"Aslanım geldi": yalnız benzetilen (aslan) var, açık istiare. "Çocuk kükredi": yalnız benzeyen (çocuk) var, aslana ait bir özellik (kükremek) ona verilmiş, kapalı istiare. Benzetilen söylendiyse açık, benzeyen söylendiyse kapalı.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Söylenen', 'Örnek'],
          satirlar: [
            ['Açık', 'Benzetilen', 'Aslanım geldi'],
            ['Kapalı', 'Benzeyen', 'Çocuk kükredi'],
          ],
        },
      ),
      kart(
        'Kişileştirme: insan olmayan insan gibi',
        '"Rüzgâr fısıldıyordu." Fısıldamak insana özgü; rüzgâra verilmiş. Kişileştirme (teşhis), yani insan dışı varlığa insan özelliği vermek. Rüzgâr insana benzetilmiş ama insan söylenmemiş; bu yüzden her kişileştirmede kapalı istiare de var.',
      ),
      kart(
        'Mecaz-ı mürselde benzetme yoktur',
        '"Ankara açıklama yaptı." Açıklamayı şehir değil hükûmet yaptı; şehir, içindeki kurumun yerine geçmiş. Benzetme yok, yalnız bir ilgi var: yer-insan, parça-bütün, iç-dış. Buna mecaz-ı mürsel (ad aktarması) denir. "Bardağı içti": aslında su.',
      ),
      kart(
        'Tezat karşıt iki kavramı buluşturur',
        '"Ağlarım hatıra geldikçe gülüştüklerimiz." Ağlamak ve gülmek aynı cümlede. Tezat, yani karşıt anlamlı iki kavramı bir arada kullanmak. Yalnızca zıt sözcük geçmesi yetmez; ikisi de aynı düşünceye bağlanmalı.',
      ),
      kart(
        'Tevriye: iki anlam, uzak olanı kastet',
        '"Beyaz gerdanında bir de ben gerek." "Ben" hem "vücuttaki nokta" hem "kişi" demek. Yakın anlam söylenmiş, uzak olan da kastedilmiş. Tevriye, yani iki anlamlı bir sözü uzak anlamını düşünerek kullanmak. İki anlam da cümleye uyar.',
      ),
      kart(
        'Abartma olduğundan çok gösterir',
        '"Bir ah çeksem dağı taşı eritir." Bir ah dağı eritmez; duygu büyütülmüş. Abartma (mübalağa), yani bir şeyi olduğundan çok ya da az gösterme. Sık hata: her büyük sayıyı abartma sanmak; gerçekte olamayacak bir şey olmalı.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'İntak: konuşan hayvan, konuşan eşya',
        '"Karga dedi ki: Bu peynir benim." Karga konuşmuş. İntak (konuşturma), yani insan dışı bir varlığı konuşturmak. Konuşan varlık zaten insan gibi davranır; bu yüzden her intakta kişileştirme vardır. Ama her kişileştirmede intak yoktur.',
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
      soru('Tezatta karşıt anlamlı iki kavram bir arada kullanılır.', true, 'Ağlamak ile gülmek aynı cümlede.'),
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
        'Deneme yazarın kendiyle konuşmasıdır',
        'Bir yazar "Yalnızlık iyi midir?" diye düşünüp aklından geçenleri yazıyor; kanıt getirmiyor, seni ikna etmeye çalışmıyor. Bu deneme: yazarın bir konuda kendi düşüncelerini samimi bir dille anlattığı yazı. Türün kurucusu Fransız Montaigne.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Makale düşünceyi kanıtla savunur',
        'Aynı konuyu bir bilim insanı yazıyor: anket sonuçları, kaynaklar, rakamlar. "Bence" yok, "araştırmalara göre" var. Bu makale: bir düşünceyi kanıtlarla savunan yazı. Dili nesnel, yani kişisel duygudan arınmış; kaynak gösterilir.',
      ),
      kart(
        'Fıkra güncel konuyu kısa ve kişisel yazar',
        'Gazetenin köşesinde dünkü maç ya da zam hakkında kısa, kişisel bir yazı görürsün. Bu fıkra (köşe yazısı): güncel bir konuyu kısa ve kişisel üslupla ele alır, kanıt zorunlu değil. Güldürü fıkrasıyla karıştırma; bu bir gazete yazısı.',
      ),
      kart(
        'Söyleşi seninle konuşur gibi yazılır',
        '"Sen de fark etmişsindir, değil mi?" diye yazan bir yazar düşün. Sanki karşısında sen varsın. Söyleşi (sohbet), yani yazarın okurla konuşur gibi, sorular sorarak yazdığı yazı. Konu günlük, dil rahat.',
      ),
      kart(
        'Eleştiri eseri ölçütlerle tartar',
        'Bir yazar yeni bir romanı okuyup "kişiler inandırıcı, ama olay örgüsü dağınık" diye yazıyor. Bu eleştiri (tenkit): bir eserin iyi ve zayıf yanlarını ölçütlerle değerlendiren yazı. "Beğendim" demek eleştiri değil; gerekçe ister.',
      ),
      kart(
        'Türü konudan değil kanıt ve dilden tanı',
        '"Yalnızlık" konusu makalede de denemede de fıkrada da yazılabilir. Ayıran konu değil. Şunu sor: kanıt var mı? Dil nesnel mi, kişisel mi? İki cevap türü verir.',
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
        { not: 'Türü soran soruda konuya bakma; "kanıt var mı, dil kişisel mi" diye iki soru sor, tür ortaya çıkar.' },
      ),
      kart(
        'Deneme bize gazeteyle geldi',
        'Tanzimat\'ta (1839 sonrası) gazete çıkmaya başladı; deneme ve fıkra o sayfalarda doğdu. Türk denemesinin öne çıkan adları Nurullah Ataç ve Suut Kemal Yetkin. Sorulunca aklına önce Ataç gelsin.',
      ),
    ], [
      soru('Denemede yazar düşüncesini kanıtlama kaygısı gütmez.', true, 'Kendi kendine konuşur gibi yazar; okuru ikna etme zorunluluğu yok.'),
      soru('Makale, bir düşünceyi kanıtlarla savunan öğretici metindir.', true, 'Bilimsel veriye ve kaynağa dayanır.'),
      soru('Fıkra, uzun uzun kanıt sunan bilimsel bir yazı türüdür.', false, 'Kısa, günlük dille yazılır ve kanıtlama kaygısı taşımaz.'),
      soru('Deneme ile makale arasında bir fark yoktur.', false, 'Makale kanıtlar, deneme düşündürür; üslupları da ayrı.'),
      sikli('Denemenin kurucusu kimdir?', ['Ataç', 'Montaigne'], 1, 'Nurullah Ataç Türk edebiyatında.'),
      sikli('Güncel bir konuyu kısa ve kişisel üslupla ele alan?', ['Makale', 'Fıkra'], 1, 'Köşe yazısı.'),
      soru('Eleştiri bir eseri ölçütlerle değerlendirir.', true, 'Söyleşi karşısında biri varmış gibi.'),
      sikli('Bir eserin iyi ve zayıf yanlarını gerekçeyle tartan yazı?', ['Eleştiri', 'Söyleşi'], 0, 'Söyleşi okurla konuşur gibi yazılır.'),
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
        'Gerçek anlam sözlükteki ilk anlamdır',
        '"Soğuk su" dediğinde soğuk, sıcaklığı düşük demek; sözlükte ilk yazan anlam bu. Gerçek (temel) anlam, yani sözcüğün akla ilk gelen anlamı. Sözcüğü tek başına duyunca aklına gelen resim gerçek anlamdır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yan anlam gerçek anlama benzer',
        '"Masanın ayağı" dersin. Masa canlı değil ama ayağı masayı taşıyor, tıpkı senin ayağın gibi. Benzerlik bağı duruyor. Yan anlam, yani gerçek anlamla bağı kopmadan kazanılan yeni anlam. "Dağın eteği", "iğnenin gözü" de yan anlam.',
      ),
      kart(
        'Mecaz anlamda gerçekle bağ kopar',
        '"Soğuk davranış" dedin. Davranışın sıcaklığı yok; "soğuk" burada "ilgisiz" demek. Gerçek anlamla bağ tümüyle kopmuş. Mecaz anlam, yani sözcüğün gerçek anlamından uzaklaşarak kazandığı anlam. "Ağır söz", "boş konuşma" da mecaz.',
      ),
      kart(
        'Tek soru üçünü ayırır: bağ koptu mu',
        '"Ağaç dalı" gerçek. "Bilim dalı": ağaçtan kola ayrılma benzerliği sürüyor, yan. "Dalına basmak": dalla ilgi yok, "sinirlendirmek" demek, mecaz. Sınavda sözcüğü somut resmiyle düşün; resim tümüyle kayboldu mu, mecaz.',
        {
          tur: 'tablo',
          basliklar: ['Anlam', 'Örnek'],
          satirlar: [
            ['Gerçek', 'Ağaç dalı'],
            ['Yan', 'Bilim dalı'],
            ['Mecaz', 'Dalına basmak'],
          ],
        },
        { etiket: 'Sık hata', not: 'Gerçek anlamla bağ koptu mu? Koptuysa mecaz, benzerlik hâlâ duruyorsa yan anlam.' },
      ),
      kart(
        'Terim anlam bir alana özgüdür',
        '"Kök" matematikte √ işareti, biyolojide bitkinin toprak altı, dil bilgisinde sözcüğün eksiz hâli. Her alanda ayrı, kesin bir anlam. Terim anlam, yani bir bilim, sanat ya da meslek dalına özgü anlam. Alan söylenince anlaşılır.',
      ),
      kart(
        'Somut dokunulur, soyut dokunulmaz',
        '"Ağır çanta": çantayı kaldırır, ağırlığını hissedersin; somut. "Ağır söz": sözü tartamazsın; soyut. Somut, yani beş duyuyla algılanan; soyut, yani algılanamayan (sevgi, korku, hız). Aynı sözcük bir yerde somut, bir yerde soyut olabilir.',
      ),
      kart(
        'Genelden özele kapsam daralır',
        'Varlık → bitki → ağaç → çam. "Varlık" her şeyi kapsar, "çam" tek bir türü. Kapsamı geniş olan genel anlamlı, dar olan özel anlamlı. Sıralama sorusunda "hangisi ötekinin içinde" diye sor; içteki daha özel.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Varlık' },
            { ad: 'Bitki' },
            { ad: 'Ağaç' },
            { ad: 'Çam' },
          ],
        },
      ),
      kart(
        'Nicel sayılır, nitel niteler',
        '"Üç metre kumaş": ölçebilirsin, sayıya vurulur; nicel anlam. "Güzel manzara": güzelliği ölçemezsin, niteliyorsun; nitel anlam. Nicel, yani miktar bildiren; nitel, yani nasıl olduğunu bildiren. "Ağır çanta" nicel, "ağır adam" nitel.',
      ),
      kart(
        'Dolaylama tek şeyi birkaç sözle anlatır',
        'Pamuk yerine "beyaz altın", aslan yerine "ormanların kralı", İstanbul yerine "yedi tepeli şehir". Tek sözcükle söylenecek şey birkaç sözcükle söylenmiş. Dolaylama, yani bir kavramı birden çok sözcükle anlatmak.',
      ),
      kart(
        'Yansıma doğadaki sesi taklit eder',
        '"Şırıl şırıl", "çat", "miyav", "gürül gürül". Bu sözcükler bir sesi taklit ediyor. Yansıma, yani doğadaki sesten türemiş sözcük. "Miyavlamak", "çatırdamak" da yansımadan türemiş. "Parıl parıl" ses değil ışık taklidi; yansıma sayılmaz.',
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
        kart: 2,
      },
    ]),
    konu('trk9-soz', 'Deyim, Atasözü ve Söz Öbekleri', [
      kart(
        'Deyim bir durumu kısa yoldan anlatır',
        '"Göze girmek" dediğinde kimse gözün içine girmiyor; "beğenilmek" demek. Deyim, yani en az iki sözcükten oluşan, kalıplaşmış, çoğu mecazlı anlatım. Deyim öğüt vermez; bir durumu, bir duyguyu anlatır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Atasözü öğüt verir, deyim vermez',
        '"Damlaya damlaya göl olur." Bu söz sana bir şey öğütlüyor: biriktir. Atasözü, yani uzun deneyimden çıkmış, öğüt ya da genel kural bildiren kalıplaşmış söz. Ayırt etmek için sor: cümle bana bir ders veriyor mu?',
        {
          tur: 'tablo',
          basliklar: ['Deyim', 'Atasözü'],
          satirlar: [
            ['Durum anlatır', 'Öğüt verir'],
            ['Yargı bildirmez', 'Yargı bildirir'],
            ['Göze girmek', 'Damlaya damlaya göl olur'],
          ],
        },
        { not: 'Sözü gördüğünde "bana ders veriyor mu" diye sor; veriyorsa atasözü, yalnız bir durumu anlatıyorsa deyim.' },
      ),
      kart(
        'İkileme sözcüğü tekrarlayıp güçlendirir',
        '"Yavaş yavaş yürüdü" derken "yavaş"ı iki kez söyledin; anlam güçlendi. "Eğri büğrü", "irili ufaklı", "aşağı yukarı" da ikileme. İkileme, yani anlamı pekiştirmek için sözcük tekrarı. İki sözcük ayrı yazılır, arasına virgül konmaz.',
      ),
      kart(
        'Kalıp söz belli durumda söylenir',
        'Hasta birine "geçmiş olsun", çalışana "kolay gelsin", yemekte "afiyet olsun" dersin. Bunlar kalıp söz: belirli durumlarda söylenen hazır ifadeler. Deyimden farkı, mecaz anlatmaması ve bir toplumsal duruma bağlı olması.',
      ),
      kart(
        'Her iki sözcüklü öbek deyim değildir',
        '"Göze girmek" deyim; "göz" gerçek anlamından çıkmış. "Göz kapağı" deyim değil; iki sözcük de kendi anlamında, bir organ adı, yani terim. Sık hata: içinde "göz, el, baş" geçen her öbeği deyim sanmak. Anlamdan uzaklaştı mı diye bak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Kalıplaşan söz değiştirilemez',
        '"Ağaç yaşken eğilir"i "ağaç tazeyken bükülür" diye söyleyemezsin; artık atasözü olmaz. Deyim de öyle: "göze girmek" var, "göze dalmak" yok. Kalıplaşma, yani sözcüklerin ve sıranın sabit olması. Yalnız çekim eki değişir: girdi, girecek.',
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
        'Neden cümlesinde sebep zaten olmuş',
        '"Yağmur yağdığı için maç ertelendi." Yağmur yağdı, bu oldu; sonucu maçın ertelenmesi. Neden-sonuç, yani bir yargının ötekinin gerekçesi olması. "İçin, -dığından, -den dolayı, çünkü" bunu kurar. Sebep gerçekleşmiş bir olaydır.',
      ),
      kart(
        'Amaç cümlesinde niyet henüz olmamış',
        '"Sınavı kazanmak için çalıştı." Sınavı kazanmak bir niyet, daha olmadı. Amaç-sonuç, yani eylemin ne için yapıldığını söylemek. "İçin, amacıyla, üzere, diye" amaç kurar. Sık hata: her "için"i neden sanmak.',
      ),
      kart(
        '"İçin" hem neden hem amaç kurar',
        '"Hasta olduğu için gelmedi": hastalık oldu, neden. "Görüşmek için geldi": görüşme henüz olmadı, amaç. Şu sınamayı yap: "için"in önündeki şeyi -mak/-mek ile söyleyebiliyorsan amaç, olmuş bir olaysa neden.',
        {
          tur: 'tablo',
          basliklar: ['Cümle', '"İçin" önü', 'İlişki'],
          satirlar: [
            ['Hasta olduğu için gelmedi', 'Olmuş olay', 'Neden'],
            ['Görüşmek için geldi', 'Niyet', 'Amaç'],
          ],
        },
        { etiket: 'Sık hata', not: '"için" gördüğünde durma; öncesindeki şey olmuş bir olay mı, yoksa istenen bir şey mi diye sor.' },
      ),
      kart(
        'Koşul: biri olmadan öteki olmaz',
        '"Erken gelirsen görüşürüz." Görüşme, erken gelmene bağlı. Gelmezsen görüşme yok. Koşul, yani bir yargının gerçekleşmesinin ötekine bağlı olması. "-se/-sa, -ince, -dıkça, ancak … -se" koşul kurar: "Çalışırsan kazanırsın."',
      ),
      kart(
        'Nesnel kanıtlanır, öznel kişiye göre değişir',
        '"Roman 300 sayfa": sayar, kanıtlarsın; herkes için aynı. Nesnel yargı, yani doğruluğu ölçülebilen. "Roman sıkıcı": sana sıkıcı, bana değil. Öznel yargı, yani kişiden kişiye değişen. "Güzel, en iyi, sıkıcı" gibi sözler öznellik işareti.',
      ),
      kart(
        'Örtülü anlam satır arasında saklıdır',
        '"Bu yıl da kazanamadı." Cümlede "geçen yıl" geçmiyor ama "da" sana önceki yılları da söylüyor. Örtülü anlam, yani cümlede yazılmadığı hâlde çıkarılan yargı. "Artık, bile, da, hâlâ, en azından" sözcükleri örtülü anlam taşır.',
      ),
      kart(
        'Karşılaştırmada üstünlük şart değil',
        '"Ali, Ayşe\'den uzun": üstünlük var. "Ali de Ayşe kadar çalışkan": eşitlik var; bu da karşılaştırma. Karşılaştırma, yani iki şeyi bir yönüyle kıyaslamak. Sık hata: "kadar, gibi" geçen eşitlik cümlesini karşılaştırma saymamak.',
      ),
      kart(
        'Tanım "bu nedir" sorusuna cevaptır',
        '"Deyim, kalıplaşmış söz öbeğidir." Sor: deyim nedir? Cevap cümlede. Bu bir tanım cümlesi. "Deyimler güzeldir" ise tanım değil; ne olduğunu değil nasıl olduğunu söylüyor. Tanımda "X, … -dır" kalıbı sık görülür.',
      ),
      kart(
        'Üslup "nasıl", içerik "ne" sorusudur',
        '"Yazar kısa cümleler kurmuş, sade bir dil seçmiş." Bu üslup: nasıl anlattığı. "Yazar köy hayatını anlatmış." Bu içerik: ne anlattığı. Sınavda "anlatım özelliği" üslubu, "konu" içeriği sorar. İkisini karıştırma.',
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
        kart: 5,
      },
    ]),
    konu('trk9-paragraf', 'Paragrafta Anlam', [
      kart(
        'Konu: paragraf neden söz ediyor',
        'Bir paragraf okudun; baştan sona kitap okumaktan bahsediyor. Konu "kitap okuma". Konu, yani paragrafın üzerinde durduğu şey. Bir sözcük ya da öbekle söylenir: "kitap okuma", "çevre kirliliği". Konu bir yargı değil, bir addır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ana düşünce: yazar ne demek istiyor',
        'Aynı paragrafta yazar "kitap okumak insanı yalnızlıktan kurtarır" diyor. Bu ana düşünce, yani yazarın paragrafı yazma amacı. Tek bir yargı cümlesidir ve bütün paragrafı kapsar. Çoğu zaman son cümlede ya da tekrarlanan fikirde saklıdır.',
      ),
      kart(
        'Konu bir ad, ana düşünce bir yargıdır',
        'Konu: kitap okuma. Ana düşünce: kitap okumak yalnızlıktan kurtarır. İlki "neden söz ediyor", ikincisi "ne demek istiyor" sorusunun cevabı. Şık bir sözcükse konu, cümleyse ana düşünce. Sık hata: konuyu ana düşünce sanmak.',
        {
          tur: 'tablo',
          basliklar: ['Soru', 'Cevap', 'Biçim'],
          satirlar: [
            ['Neden söz ediyor?', 'Kitap okuma', 'Ad'],
            ['Ne demek istiyor?', 'Okumak kurtarır', 'Yargı'],
          ],
        },
        { etiket: 'Sık hata' },
      ),
      kart(
        'Yardımcı düşünce ana fikri destekler',
        '"Kitap kelime dağarcığını genişletir, hayal gücünü besler" cümleleri ana düşünceyi desteklemek için var. Yardımcı düşünce, yani ana düşünceyi açan ara yargılar. "Paragrafta değinilmemiştir" sorusu bunları arar: şıkları metinle eşleştir.',
        undefined,
        { not: '"Değinilmemiştir" sorusunda ana düşünceye değil cümlelere bak; her şıkkı metindeki bir cümleyle eşleştir.' },
      ),
      kart(
        'Paragraf giriş, gelişme, sonuçtan kurulur',
        'İlk cümle konuyu açar; kendinden önce bir şey olmadığı bellidir, bu giriş. Ortadaki cümleler konuyu örnekle, sebeple genişletir; gelişme. Son cümle toparlar, ana düşünceyi verir; sonuç. Giriş cümlesi "bu yüzden, ama" ile başlamaz.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Giriş', alt: 'konuyu açar' },
            { ad: 'Gelişme', alt: 'genişletir' },
            { ad: 'Sonuç', alt: 'toparlar' },
          ],
        },
      ),
      kart(
        'Akışı bozan cümle konudan sapar',
        'Kitap okuma paragrafında birden "Kütüphane binası 1970\'te yapıldı" cümlesi geliyor. Konuyla bağı yok; çıkarınca paragraf bozulmuyor. Bu akışı bozan cümle. Bulmak için her cümleye "öncekiyle sonrakine bağlı mı" diye sor.',
      ),
      kart(
        'Anlatım biçimi yazarın tavrını gösterir',
        'Yazar bilgi veriyorsa açıklayıcı; bir görüşü çürütüp kendi görüşünü savunuyorsa tartışmacı; bir yeri resim gibi çiziyorsa betimleyici; olay anlatıyorsa öyküleyici. Anlatım biçimi, yani yazarın metne yaklaşma tarzı. Birkaçı bir arada olur.',
        {
          tur: 'tablo',
          basliklar: ['Biçim', 'Ne yapar?', 'İpucu'],
          satirlar: [
            ['Açıklayıcı', 'Bilgi verir', 'Ansiklopedi'],
            ['Tartışmacı', 'Görüş çürütür', '"Oysa…"'],
            ['Betimleyici', 'Gösterir', 'Renk, koku'],
            ['Öyküleyici', 'Olay anlatır', '"Sonra ne oldu"'],
          ],
        },
      ),
      kart(
        'Yazar düşüncesini beş yolla geliştirir',
        'Ana düşünceyi güçlendirmek için: tanımlar ("Deyim, … -dır"), örnek verir ("Mesela göze girmek"), karşılaştırır ("Roman hikâyeden uzun"), tanık gösterir ("Ataç der ki: …"), sayı verir ("%40\'ı"). Tanıkta ad geçer, örnekte geçmez.',
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
      sikli('Paragrafın hangi bölümü konuyu açan bağımsız cümledir?', ['Sonuç', 'Giriş'], 1, 'Gelişme genişletir, sonuç toparlar.'),
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
        'Her anlatı dört ögeden kurulur',
        'Bir hikâye düşün: bir şey olur (olay), birilerinin başına gelir (kişiler), bir yerde (mekân) ve bir zamanda geçer. Anlatmaya bağlı metin, yani hikâye, roman, masal gibi olay anlatan metin. Dördünden biri eksikse anlatı yoktur.',
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
        'Olay örgüsü yazarın seçtiği sıradır',
        'Bir film cenazeyle başlar, sonra ölenin gençliğine döner. Gerçekte önce gençlik, sonra ölüm vardı; yazar sırayı değiştirdi. Olay örgüsü, yani olayların metindeki dizilişi. Yaşandığı sıra değil, yazarın kurduğu sıra.',
      ),
      kart(
        'Tip tek özellik, karakter çok yönlü',
        'Bir hikâyede "cimri amca" hep cimri; başka bir yanı yok. Bu tip, yani tek bir özelliğin temsilcisi. Roman kahramanı ise korkar, cesaret bulur, değişir: karakter, yani çok yönlü ve gelişen kişi. Sorularda "değişiyor mu" diye bak.',
        undefined,
        { not: 'Kişi soruda "değişmiyor, hep aynı" diye anlatılıyorsa tip; metin boyunca değişiyorsa karakter.' },
      ),
      kart(
        'Mekân kişiyi de anlatır',
        'Kahraman rutubetli, karanlık bir bodrumda yaşıyor. Bu yalnızca yer bilgisi değil; yoksulluğunu ve sıkışmışlığını da söylüyor. Mekân, yani olayın geçtiği yer, kişinin ruh hâlini ve toplumsal durumunu da anlatır. Dekor sanma.',
      ),
      kart(
        'Olayın süresi ile anlatma süresi ayrı',
        '"On yıl geçti" cümlesi on yılı tek satırda anlatır. Bir gün de yüz sayfada anlatılabilir. Olayın gerçek süresi ile anlatımın süresi ayrıdır. Geri dönüş, yani anlatının geçmişe gitmesi, zaman sırasını kırar.',
      ),
      kart(
        'Çatışma anlatıyı ilerletir',
        'Kahraman bir şey istiyor, biri ya da bir şey engelliyor: işte çatışma. Başka bir kişiyle (düşman), toplumla (gelenek), doğayla (fırtına) ya da kendisiyle (vicdan) olabilir. Çatışma yoksa gerilim yok; anlatacak bir şey de yok.',
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
        'İlahi anlatıcı her şeyi bilir',
        '"Ali korkuyordu; Ayşe onun korktuğunu bilmeden gülümsedi." Anlatıcı, yani hikâyeyi anlatan ses, ikisinin de içini biliyor. İlahi (hâkim) bakış açısı, yani anlatıcının her şeyi bilmesi: geçmişi, geleceği, akıldan geçeni. "O" diliyle anlatır.',
      ),
      kart(
        'Kahraman anlatıcı "ben" der',
        '"Kapıyı açtım, içeride kimse yoktu; ne düşündüklerini bilemedim." Anlatan, olayın içindeki kişi; yalnız kendi gördüğünü ve düşündüğünü bilir. Kahraman bakış açısı, yani anlatıcının hikâyenin bir kişisi olması. "Ben" diliyle yazılır.',
      ),
      kart(
        'Gözlemci anlatıcı kamera gibidir',
        '"Adam pencereye baktı, uzun süre kıpırdamadı." Ne düşündüğü yazmıyor; yalnız görünen anlatılıyor. Gözlemci bakış açısı, yani anlatıcının dışarıdan görüleni aktarması. İç dünyaya giremez. "O" diliyle ama sınırlı bilgiyle.',
      ),
      kart(
        'Ölçü tek: anlatıcı ne kadar biliyor',
        'Üçünü ayırmak için iki soru sor: "Ben" mi "o" mu diyor? Kişilerin aklından geçeni biliyor mu? "Ben" diyorsa kahraman. "O" deyip iç dünyayı biliyorsa ilahi, bilmiyorsa gözlemci.',
        {
          tur: 'tablo',
          basliklar: ['Bakış açısı', 'Kişi', 'Bilgisi'],
          satirlar: [
            ['İlahi', 'O', 'Her şeyi bilir'],
            ['Kahraman', 'Ben', 'Kendi bildiğini'],
            ['Gözlemci', 'O', 'Yalnız görüneni'],
          ],
        },
      ),
      kart(
        'Anlatıcı yazar değildir',
        'Bir yazar romanda "Ben bir katilim" diye yazsa kendisi katil olmaz. "Ben" diyen anlatıcı, yazarın kurduğu kurmaca bir kişi. Yazar gerçek, anlatıcı metnin içindeki ses. Sorularda "anlatıcı" yerine "yazar" diyen şıkka dikkat.',
        undefined,
        { etiket: 'Sık hata', not: '"Ben" diyen anlatıcıyı gördüğünde bunu yazar sanma; o da hikâyenin kurgulanmış bir parçası.' },
      ),
      kart(
        'Güvenilmez anlatıcı yanıltabilir',
        'Bir çocuk anlatıcı "babam çok iyi bir adam" der; ama anlattığı olaylar babanın kötü olduğunu gösterir. Anlatıcı yanılıyor ya da gizliyor. Güvenilmez anlatıcı, yani sözüne tam güvenilmeyen anlatıcı. Okur gerçeği satır arasından kendi kurar.',
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
        'Hikâye tek olay, roman çok olay',
        'Bir hikâye bir günde, iki kişiyle, tek bir olayla biter: bir gencin ilk iş günü. Roman yıllara yayılır, onlarca kişi, iç içe olaylar. Fark yalnız uzunluk değil: olay, kişi ve zaman genişliği. Kısa roman yine romandır.',
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
        'Olay hikâyesinde düğüm çözülür',
        'Ömer Seyfettin\'in "Kaşağı"sı: çocuk kaşağıyı kırar, suçu kardeşine atar, kardeşi ölür, pişmanlık. Serim (tanıtma), düğüm (sorun), çözüm (sonuç) sırayla gelir, son bağlanır. Olay hikâyesi, yani Fransız yazar Maupassant tarzı.',
      ),
      kart(
        'Durum hikâyesinde büyük bir şey olmaz',
        'Sait Faik\'in bir hikâyesinde adam sahilde oturur, balıkçıları izler, hikâye biter. Büyük olay yok, çözüm yok; bir an ve bir duygu var. Durum hikâyesi, yani Rus yazar Çehov tarzı. "Olay örgüsü zayıf, izlenim ağır" derse budur.',
        {
          tur: 'tablo',
          basliklar: ['Tarz', 'Öncü', 'Bizde'],
          satirlar: [
            ['Olay', 'Maupassant', 'Ömer Seyfettin'],
            ['Durum', 'Çehov', 'Sait Faik'],
          ],
        },
        { not: '"Bir şey olmuyor" diye şaşırma; o hikâye sana olayı değil bir anın duygusunu vermek istiyor.' },
      ),
      kart(
        'Roman ağırlık verdiği konuya göre adlanır',
        'Kurtuluş Savaşı\'nı anlatıyorsa tarihî, köy sorunlarını anlatıyorsa sosyal, bir kişinin iç dünyasını anlatıyorsa psikolojik, cinayet çözüyorsa polisiye, tehlikeli yolculuksa macera romanı. Ayrım konudan; bir roman iki türe de girebilir.',
      ),
      kart(
        'İlk yerli roman ile ilk edebî roman ayrı',
        'Şemsettin Sami\'nin Taaşşuk-ı Talat ve Fitnat\'ı (1872) Türkçe yazılmış ilk roman: ilk yerli roman. Namık Kemal\'in İntibah\'ı (1876) sanat değeri taşıyan ilk roman: ilk edebî roman. Sık hata: ikisini karıştırmak; "ilk"in yanına bak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Modern romanda olay değil bilinç izlenir',
        'Eski romanda "sonra ne oldu" diye okurdun. 20. yüzyıl romanında kahramanın kafasından geçenler sayfalarca akar, olay neredeyse yok. Bilinç akışı, yani düşüncelerin düzensizce, olduğu gibi yazılması. İç konuşma da bu dönemin aracı.',
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
        'Tiyatro oynanmak için yazılır',
        'Bir romanı koltukta okursun; tiyatro metni sahnede oyuncular tarafından oynanır. Bu yüzden anlatıcı yoktur: kimse "Ali içeri girdi" demez, Ali sahneye girer. Her şey diyalog (karşılıklı konuşma) ve hareketle verilir.',
        undefined,
        { not: 'Metni okurken sahneyi gözünde canlandır; parantez içindeki yönergeler oyuncuya, konuşmalar sana.' },
      ),
      kart(
        'Perde, sahne, replik: büyükten küçüğe',
        'Oyunun büyük bölümleri perde: perde kapanır, dekor değişir. Perdenin içinde kişiler girip çıktıkça sahne değişir. Bir oyuncunun tek seferde söylediği söz replik. Uzun, tek başına söylenen replik tirat.',
      ),
      kart(
        'Trajedi acıyla, komedi gülmeyle biter',
        'Kral Oidipus: soylu bir kral, kader, acı son; ağır bir dil. Bu trajedi. Molière\'in Cimri\'si: sıradan bir adamın huyu, gülünç durumlar, mutlu son. Bu komedi. Komedi güldürürken toplumun kusurunu gösterir.',
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
        'Üç birlik: tek olay, tek yer, tek gün',
        'Klasik trajedide oyun tek bir olayı, tek bir mekânda, 24 saat içinde anlatır. Bu üç birlik kuralı: olay, yer ve zaman birliği. Kişi bir sahnede İstanbul\'da, sonrakinde Paris\'te olamazdı. Modern tiyatro bu kuralı bıraktı.',
      ),
      kart(
        'Dram acıyı ve gülüncü birlikte verir',
        'Gerçek hayatta bir günde hem ağlarsın hem gülersin. Dram bunu sahneye taşır: soylu-sıradan ayrımı yok, dil serbest, son acı da mutlu da olabilir. Üç birlik kuralına uymaz. Modern tiyatronun temeli dramdır.',
      ),
      kart(
        'Geleneksel tiyatromuz doğaçlamadır',
        'Karagöz perde arkasında deriden figürlerle, orta oyunu meydanda Kavuklu ile Pişekâr\'la, meddah tek kişiyle anlatarak oynanır. Köy seyirlik oyunları da bu ailede. Ortak özellik: yazılı metin yok, doğaçlama, yani o an uydurma.',
      ),
      kart(
        'İlk Batılı oyunumuz Şair Evlenmesi',
        '1860\'ta Şinasi, Şair Evlenmesi\'ni yazdı: görücü usulü evliliği eleştiren tek perdelik komedi. Batılı anlamda, yani yazılı metne dayanan, ilk Türk tiyatro eseri. Tanzimat\'la birlikte sahnede oynanmaya başlandı.',
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
        'Büyük ünlü uyumu: hep kalın ya da hep ince',
        '"Okul"da o ve u; ikisi de kalın. "Kelebek"te üç e; hepsi ince. Büyük ünlü uyumu, yani sözcükteki ünlülerin ya hep kalın (a, ı, o, u) ya hep ince (e, i, ö, ü) olması. "Kardeş, anne, kitap" uymaz: kalın ve ince karışmış.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Küçük ünlü uyumu bir önceki ünlüye bakar',
        '"Kapı"da a düz, sonra ı düz: uyar. "Okul"da o yuvarlak, sonra u dar yuvarlak: uyar. "Yorgan"da o yuvarlak, sonra a düz geniş: uyar. "Çamur"da a düz, sonra u yuvarlak: uymaz. Kural: düzden sonra düz; yuvarlaktan sonra u, ü ya da a, e.',
        {
          tur: 'tablo',
          basliklar: ['Önceki ünlü', 'Sonra gelen', 'Örnek'],
          satirlar: [
            ['Düz (a, e, ı, i)', 'Düz', 'kapı, kelebek'],
            ['Yuvarlak (o, ö, u, ü)', 'u, ü / a, e', 'okul, yorgan'],
          ],
        },
      ),
      kart(
        'Yumuşama: p, ç, t, k ünlü gelince yumuşar',
        '"Kitap" + ı → kitabı: p, b oldu. "Ağaç" + a → ağaca: ç, c oldu. Sözcük sonundaki sert ünsüz (p, ç, t, k), ünlüyle başlayan ek gelince yumuşar (b, c, d, ğ). Tek heceli sözcüklerin çoğu yumuşamaz: "top" → topu, "at" → atı.',
        {
          tur: 'tablo',
          basliklar: ['Sert', 'Yumuşak', 'Örnek'],
          satirlar: [
            ['p', 'b', 'kitap → kitabı'],
            ['ç', 'c', 'ağaç → ağaca'],
            ['t', 'd', 'kanat → kanadı'],
            ['k', 'ğ', 'ekmek → ekmeği'],
          ],
        },
      ),
      kart(
        'Benzeşme: sert sese gelen ek sertleşir',
        '"Kitap" + cı → kitapçı: ekin c\'si ç oldu. "Git" + di → gitti. Ünsüz benzeşmesi (sertleşme), yani sert ünsüzle (f, s, t, k, ç, ş, h, p) biten sözcüğe gelen c, d, g\'nin ç, t, k olması. Yumuşamada sözcüğün sonu, benzeşmede ek değişir.',
        undefined,
        { etiket: 'Sık hata', not: 'Sertleşme mi yumuşama mı? Değişen ses ekte ise benzeşme, sözcüğün sonunda ise yumuşama.' },
      ),
      kart(
        'Ünlü düşmesinde bir hece kaybolur',
        '"Burun" + u → burnu: ikinci hecedeki u düştü. "Oğul" → oğlu, "ağız" → ağzı, "şehir" → şehri. İki heceli organ ve akrabalık adları ünlüyle başlayan ek alınca çoğu zaman böyle. "Ne" + için → niçin de ünlü düşmesi.',
      ),
      kart(
        'Ünlü türemesinde araya ünlü girer',
        '"Bir" + -inci → birinci: r ile n arasına i girdi. "Az" + -cık → azıcık, "genç" + -cik → gencecik. Pekiştirmede de olur: sap-a-sağlam, güp-e-gündüz. Ünlü türemesi, yani sözcükte olmayan bir ünlünün ek alınca ortaya çıkması.',
      ),
      kart(
        'Ünsüz türemesinde ses ikizleşir',
        '"His" + i → hissi: tek s, çift s oldu. "Af" + ı → affı, "hak" + ı → hakkı, "zan" + ı → zannı. Bunlar Arapçadan alıntı, aslında çift sesli; ek alınca ikinci ses geri geliyor. Ünsüz türemesi, yani ek alınca yeni bir ünsüzün belirmesi.',
      ),
      kart(
        'Kaynaştırma harfi iki ünlüyü ayırır',
        '"Araba" + ı dersen iki ünlü yan yana gelir: "arabaı" olmaz. Araya y girer: arabayı. "İki" + er → ikişer, "kapı" + ı → kapısı, "evi" + de → evinde. Kaynaştırma harfleri y, ş, s, n; iki ünlü çarpışmasın diye araya girer, anlamı yok.',
      ),
      kart(
        'Daralma: -yor eki a ve e\'yi daraltır',
        '"Bekle" + yor → bekliyor: e daralıp i oldu. "Anla" + yor → anlıyor: a, ı oldu. Ünlü daralması, yani -yor eki önündeki geniş ünlünün (a, e) dar ünlüye (ı, i, u, ü) dönmesi. "De" ve "ye" fiilleri y ile de daralır: diyor, yiyor.',
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
        kart: 3,
      },
    ]),
    konu('trk9-yazim', 'Yazım Kuralları', [
      kart(
        'Bağlaç "de" ayrı, ek "-de" bitişik',
        '"Sen de gel." "de"yi at: "Sen gel." Cümle hâlâ düzgün; bu bağlaç, ayrı yazılır. "Evde kaldım." "-de"yi at: "Ev kaldım." Bozuldu; bu bulunma eki, bitişik yazılır. Sınama: çıkarınca cümle bozuluyor mu? Bozulmuyorsa ayrı.',
        undefined,
        { not: 'de/da gördüğünde onu cümleden çıkar; cümle yürüyorsa ayrı yaz, yürümüyorsa bitişik.' },
      ),
      kart(
        'Bağlaç "ki" ayrı, sıfat "-ki" bitişik',
        '"Duydum ki gelmişsin." Buradaki "ki" iki cümleyi bağlıyor, ayrı yazılır. "Masadaki kitap." Buradaki "-ki" sıfat yapıyor, "hangi kitap" sorusuna cevap veriyor; bitişik. Beşi kalıplaşmış, hep bitişik: hâlbuki, mademki, sanki, oysaki, çünkü.',
      ),
      kart(
        'Soru eki "mi" her zaman ayrı yazılır',
        '"Geldi mi?", "Güzel mi güzel.", "Bakar mısın?" Üçünde de "mi" ayrı. Soru eki, yani mi/mı/mu/mü, her zaman ayrı yazılır; önceki sözcüğe göre ünlüsü değişir. Kendinden sonra gelen ekler ona bitişir: "geldin mi", "gelecek misin".',
      ),
      kart(
        'Tek sınama üç kuralı çözer',
        'de, ki ve mi\'de aynı soru: sözcüğü çıkarınca cümle bozuluyor mu? "Sen gel" bozulmadı, bağlaç, ayrı. "Ev kaldım" bozuldu, ek, bitişik. "Duydum gelmişsin" bozulmadı, bağlaç ki ayrı. "Masa kitap" bozuldu, -ki bitişik.',
        {
          tur: 'tablo',
          basliklar: ['Yapı', 'Yazım', 'Örnek'],
          satirlar: [
            ['Hâl eki -de', 'Bitişik', 'evde'],
            ['Bağlaç de', 'Ayrı', 'sen de'],
            ['Sıfat -ki', 'Bitişik', 'masadaki'],
            ['Bağlaç ki', 'Ayrı', 'duydum ki'],
          ],
        },
      ),
      kart(
        'Özel ada gelen çekim eki kesmeyle ayrılır',
        '"Ankara\'ya gittim." Ankara özel ad, büyük harfle başlar; -ya çekim eki kesmeyle ayrılır. "Türkçe"de Türk özel ad ama -çe yapım eki: kesme yok. Çekim eki (-ya, -da, -yı) ayrılır, yapım eki (-çe, -li, -lı) ayrılmaz: "Ankaralı".',
      ),
      kart(
        'Birleşik sözcük kaynaştıysa bitişik',
        '"Hanımeli" bir çiçek; ne hanım var ne el. Sözcükler kendi anlamını yitirmiş, kaynaşmış: bitişik. "Deniz kabuğu": deniz de kabuk da kendi anlamında: ayrı. Ses düşmesi olduysa yine bitişik: kayın ana → kaynana, pazar ertesi → pazartesi.',
      ),
      kart(
        'Metinde sayı yazıyla, ölçüde rakamla',
        '"Sınıfta üç öğrenci kaldı": metin içinde küçük sayı yazıyla. "Saat 14.30", "25 kg", "1923" gibi saat, ölçü, tarih ve para rakamla. Yazıyla yazılan sayı ayrı yazılır: "yirmi beş". Yalnız çek ve senette bitişik: "yirmibeş".',
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
        'Nokta cümleyi bitirir, sayıyı sıralar',
        '"Ders bitti." Nokta cümleyi bitirdi. "3. sınıf": sıra sayısı, "üçüncü" demek. "12.09.2025": tarihte gün, ay ve yılı ayırıyor. "Dr., vb.": kısaltmalarda da nokta. Sıra sayısı gördüğünde noktayı "-ıncı" diye oku.',
      ),
      kart(
        'Virgül eş görevlileri ayırır',
        '"Elma, armut, kiraz aldım." Üç eş görevli sözcük virgülle ayrıldı. "Geldi, oturdu, konuştu." Sıralı cümleler de virgülle. Uzun özneden sonra da virgül gelir. Ama "ve, veya, ya da" bağlacından önce virgül konmaz: "elma ve armut".',
      ),
      kart(
        'Virgülün yeri anlamı değiştirir',
        '"Genç, adama baktı": bakan kişi genç. "Genç adama baktı": bakılan kişi genç. Tek bir virgül özneyi değiştirdi. Virgül süs değil; yeri değişince cümlenin anlamı değişir. Sorularda virgülü kaldırıp cümleyi yeniden oku.',
        undefined,
        { not: 'Virgül sorusunda önce virgülü sil, cümleyi tekrar oku; anlam değiştiyse virgül orada anlam işareti.' },
      ),
      kart(
        'Noktalı virgül virgüllüleri ayırır',
        '"Elma, armut, kiraz; havuç, ıspanak aldım." İçinde zaten virgül olan iki öbek noktalı virgülle ayrıldı: meyveler; sebzeler. "Hava soğuktu, kar yağıyordu; yine de çıktık." Virgüllü sıralı cümleleri de noktalı virgül ayırır.',
      ),
      kart(
        'İki noktadan sonra açıklama gelir',
        '"Üç şey aldım: defter, kalem, silgi." İki nokta "şimdi sayıyorum" der. Alıntıdan önce de: Öğretmen sordu: "Hazır mısınız?" Kural: iki noktadan sonra cümle geliyorsa büyük, yalnız sözcükler geliyorsa küçük harfle başlar.',
      ),
      kart(
        'Kesme kişi ve yer adının ekini ayırır',
        '"Ali\'ye", "Ankara\'ya", "Türkiye\'nin": kişi ve yer adlarına gelen çekim eki kesmeyle ayrılır. Kurum adlarında ayrılmaz: "Türk Dil Kurumuna", "Millî Eğitim Bakanlığına". Yapım ekinde de kesme yok: "Ankaralı". Sık hata: kurum adına kesme.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Üç nokta bitmemiş sözü gösterir',
        '"Bunu sana nasıl anlatsam…" Söz yarım kaldı, üç nokta. Alıntıdan bir kısmı atladıysan da üç nokta: "Ne mutlu … diyene!" Kaba bir sözü gizlemek için de: "Seni a…" Üç noktadan sonra ayrıca nokta konmaz; toplam üç.',
      ),
      kart(
        'Tırnak alıntıyı, kısa çizgi eki gösterir',
        'Ataç\'ın sözü: "Okumak düşünmektir." Başkasının sözü tırnağa alınır; vurgulanan bir sözcük de. Kısa çizgi satır sonunda sözcüğü böler (kitap-), dil bilgisinde eki gösterir (-lık) ve "İstanbul-Ankara" gibi aralık bildirir.',
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
        'Söz varlığı dilin bütün sözleridir',
        'Sözlükteki sözcükler, "göze girmek" gibi deyimler, "damlaya damlaya…" gibi atasözleri, "kolay gelsin" gibi kalıp sözler: hepsi Türkçenin söz varlığı. Zenginlik sözcük sayısıyla değil, bir şeyi kaç türlü söyleyebildiğinle ölçülür.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Türkçe tek kökten aile üretir',
        '"Göz" kökünü al: gözlük, gözcü, gözlem, gözetmek, gözlükçü. Bir kökten bir aile çıktı. Türkçe eklemeli dil, yani kök sabit kalır, ekler arka arkaya eklenir. Bu türetme gücü yeni sözcük ihtiyacını çoğunlukla kendi içinden karşılar.',
      ),
      kart(
        'Alıntı sorun değil, gereksiz alıntı sorun',
        '"Kitap" Arapçadan, "pencere" Farsçadan, "kanepe" Fransızcadan geldi; hepsi Türkçenin malı oldu. Sorun bu değil. Sorun "toplantı" varken "meeting" demek: karşılığı olan sözcüğü dışarıdan almak. Buna gereksiz alıntı denir.',
      ),
      kart(
        'Eş anlamlı, zıt anlamlı, eş sesli',
        '"Kara" ile "siyah" aynı şeyi söyler: eş anlamlı. "Uzun" ile "kısa" karşıt: zıt anlamlı. "Yüz" sayı, surat ve yüzmek: yazılışı aynı, anlamı bambaşka: eş sesli (sesteş). Eş seslide anlamlar birbirine bağlı değil; yan anlamla karıştırma.',
        {
          tur: 'tablo',
          basliklar: ['İlişki', 'Örnek'],
          satirlar: [
            ['Eş anlamlı', 'kara - siyah'],
            ['Zıt anlamlı', 'uzun - kısa'],
            ['Eş sesli', 'yüz: sayı / surat'],
          ],
        },
      ),
      kart(
        'Ağız yakın, lehçe çok eski ayrılma',
        'Egeli "geliyom" der: ağız, yani aynı dilin bölgesel söyleyişi; yazı dili aynı. Azerice "gelirem": şive, yani yakın zamanda ayrılmış kol; anlaşılır. Yakutça: lehçe, yani çok eski ayrılma; anlamak güç. Ayıran şey ayrılmanın derinliği.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ağız', alt: 'bölgesel' },
            { ad: 'Şive', alt: 'yakın ayrılma' },
            { ad: 'Lehçe', alt: 'eski ayrılma' },
          ],
        },
        { not: 'Üçünü ayırırken adı değil dereceyi düşün: anlaşılıyorsa ağız ya da şive, anlaşılmıyorsa lehçe.' },
      ),
      kart(
        'Yakutça ve Çuvaşça lehçe sayılır',
        'Türkçeden en erken ayrılan kollar Yakutça (Sibirya) ve Çuvaşça (Volga): Türkiye Türkü bunları anlamaz, lehçe. Azerice, Kazakça, Özbekçe, Türkmence daha geç ayrıldı, kısmen anlaşılır: şive. Sınavda "lehçe" sorulursa Yakutça ve Çuvaşça.',
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
