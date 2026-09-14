import { kart, konu, program, soru, tema } from '../tip'

/**
 * 9. sınıf Fizik — Maarif Modeli.
 *
 * Dört tema: Fizik Bilimi ve Kariyer Keşfi, Kuvvet ve Hareket, Akışkanlar,
 * Enerji. Konu adları ve sırası `maarif/iskelet.json`'dan; `maarif.test.ts`
 * denetliyor.
 *
 * Konu adları programdakinden **kısaltılabiliyor** — haritadaki düğüme
 * "Isı, Öz Isı, Isı Sığası ve Sıcaklık Farkı Arasındaki İlişki" sığmıyor.
 * Test eşitlik değil örtüşme arıyor; kısaltırken konuyu tanıtan kelimeleri
 * atma.
 */
export const fizik9 = program('fizik', 9, 'Fizik bilimi ve enerji', [
  tema('fzk9-t1', 'Fizik Bilimi ve Kariyer Keşfi', [
    /*
      Bu konu, kart etiketi / Rabi notu / hızlı kontrol alanlarının **örneği**:
      tasarım (`tasarim/bilgi-karti.html`) bu konu üstünden çizildi ve
      metinler oradan. Öteki konularda alanlar henüz boş.
    */
    konu('fzk9-bilim', 'Fizik Bilimi', [
      kart(
        'Fizik neyi inceler?',
        'Madde, enerji ve bunların uzay-zamandaki etkileşimini inceler. Doğanın kurallarını sayı ile ifade etmeye çalışır.',
        undefined,
        { etiket: 'Tanım', not: 'Bu kartı bir tanım olarak değil, dersin geri kalanının çerçevesi olarak oku.' },
      ),
      kart(
        'Bilimsel yöntem',
        'Fizik gözlemle başlar, hipotez kurar, deneyle sınar ve sonucu yeniden gözleme döner.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Gözlem' },
            { ad: 'Hipotez' },
            { ad: 'Deney' },
            { ad: 'Kuram' },
          ],
        },
        { etiket: 'Ölçme', not: 'Sıralamayı ezberleme; her okun neden o yöne baktığını sor.' },
      ),
      kart(
        'Deney ve model',
        'Model gerçeğin sadeleştirilmiş hâlidir. Deneyle çelişen model ne kadar zarif olursa olsun bırakılır.',
        undefined,
        { etiket: 'Yöntem', not: '"Sürtünmesiz ortam" bir yalan değil, bilinçli bir sadeleştirmedir.' },
      ),
      kart(
        'Hipotez, kuram, yasa',
        'Hipotez sınanmayı bekleyen öneri, kuram sınanmış açıklama, yasa ise gözlenen düzenliliğin kısa ifadesidir.',
        undefined,
        { etiket: 'Kavramlar', not: 'Üçünü bir merdiven gibi düşünme; yasa kuramın yukarısı değil, başka bir iş.' },
      ),
      kart(
        'Fizik ve matematik',
        'Matematik fiziğin dili. Bir yasa cümleyle anlatılabilir ama tahmin yapabilmesi için denkleme dönmesi gerekir.',
        undefined,
        { etiket: 'Dil', not: 'Formül bir cümlenin kısaltmasıdır; cümleyi anlamadan kısaltmayı hatırlamak işe yaramaz.' },
      ),
      kart(
        'Ölçme olmadan fizik olmaz',
        'Her ölçümün bir belirsizliği vardır. Sonucu belirsizliğiyle birlikte vermek, fiziğin dürüstlük kuralıdır.',
        undefined,
        { etiket: 'Birimler', not: 'Bir soruda birim tutmuyorsa işlem de tutmuyordur — önce birimi kontrol et.' },
      ),
      kart(
        'Fiziğin öteki bilimlerle bağı',
        'Kimya atomun elektron düzenine, biyoloji sinir hücresinin elektriğine dayanır. Sınır çizgileri idari, doğal değil.',
        undefined,
        { etiket: 'Kapanış', not: 'Desteyi bitirmeden önce bir kartı kendi cümlelerinle anlatmayı dene.' },
      ),
    ], [
      soru('Bir kuram yeterince kanıt toplayınca yasaya dönüşür.', false, 'Yasa olayın nasıl olduğunu tanımlar, kuram nedenini açıklar; biri ötekinin ileri hâli değil.'),
      soru('Bir deneyin başka araştırmacılar tarafından da tekrarlanabilmesi gerekir.', true, 'Tekrarlanamayan sonuç doğrulanamaz; bilimsel yöntemin şartı.'),
      soru('Model, gerçeğin bütün ayrıntılarını taşıyan birebir kopyasıdır.', false, 'Model gerçeği basitleştirir; yalnızca işe yarayacak ayrıntıları tutar.'),
      soru('Fizik, öteki doğa bilimlerinin dayandığı temel yasaları da inceler.', true, 'Kimyadaki bağ da biyolojideki sinir iletimi de fiziksel yasalarla açıklanıyor.'),
    ], [{
      soru: 'Bilimsel yöntemde deney neyi sınar?',
      siklar: ['Kurulan hipotezi', 'Ölçüm biriminin adını'],
      dogru: 0,
      aciklama: {
        dogru: 'Aynen öyle. Gözlem soruyu doğurur, hipotez bir tahmindir; deney o tahmini sınar ve tutmazsa zincir başa döner.',
        yanlis: 'Tam değil. Deney, kurulan hipotezi sınar. Birim seçimi ölçmeyi karşılaştırılabilir kılar ama sınanan şey tahmindir.',
      },
      kart: 2,
    }]),
    konu('fzk9-altdal', 'Fizik Biliminin Alt Dalları', [
      kart(
        'Mekanik',
        'Kuvvet, hareket ve dengeyi inceler. Köprüden gezegen yörüngesine kadar hareket eden her şey konusudur.',
      ),
      kart(
        'Termodinamik',
        'Isı ve enerji dönüşümlerini inceler. Motor, buzdolabı ve iklim modelleri bu dalın konusudur.',
      ),
      kart(
        'Optik',
        'Işığın yayılması, kırılması ve yansımasını inceler. Gözlük, kamera ve fiber optik kablo buradan çıkar.',
      ),
      kart(
        'Elektromanyetizma',
        'Elektrik ve manyetizmayı tek çatı altında toplar. Elektrik motorundan radyo dalgasına kadar her şey buradan çıkar.',
      ),
      kart(
        'Katıhâl fiziği',
        'Maddenin katı hâldeki davranışını inceler; yarı iletkenler ve dolayısıyla bütün elektronik bu dalın ürünü.',
      ),
      kart(
        'Modern fizik',
        'Atom altı ve ışık hızına yakın olaylar: kuantum fiziği ve görelilik. Klasik fiziğin yetmediği yerde başlar.',
      ),
      kart(
        'Klasik mi modern mi?',
        'Klasik fizik yanlış değil, sınırlıdır: günlük hız ve boyutlarda doğru sonuç verir, o sınırın dışında modern fizik gerekir.',
      ),
    ], [
      soru('Termodinamik, ısı ve sıcaklıkla ilgili olayları inceler.', true, 'Isı alışverişi, hâl değişimi ve enerji dönüşümleri bu alanın konusu.'),
      soru('Atom altı parçacıkların davranışı klasik fiziğin konusudur.', false, 'Modern fiziğin: kuantum kuramı ve görelilik burada devreye giriyor.'),
      soru('Yarı iletkenlerin davranışı katıhâl fiziğinin konusudur.', true, 'Katıhâl fiziği maddenin katı hâldeki yapısını ve elektriksel davranışını inceliyor.'),
      soru('Mekanik yalnızca hareketsiz cisimleri inceler.', false, 'Mekanik kuvvet ve hareketi inceler; durgunluk bunun özel bir hâli.'),
    ]),
    konu('fzk9-bilim-insanlari', 'Fizik Bilimine Yön Verenler', [
      kart(
        'Galileo',
        'Deneyi fiziğin merkezine koydu. Serbest düşmede farklı kütlelerin aynı ivmeyle düştüğünü savundu.',
      ),
      kart(
        'Newton',
        'Hareket yasalarını ve kütle çekimini tek çatı altında topladı. Gökteki ve yerdeki hareketin aynı yasaya uyduğunu gösterdi.',
      ),
      kart(
        'Faraday ve Maxwell',
        'Faraday elektrik ile manyetizmanın bağını deneyle gösterdi, Maxwell bunu dört denklemle yazdı.',
      ),
      kart(
        'Einstein',
        'Görelilik kuramıyla zaman ve uzayın mutlak olmadığını gösterdi. Enerji ile kütlenin bağını da o kurdu.',
      ),
      kart(
        'Marie Curie',
        'Radyoaktivite üzerine çalıştı, iki ayrı dalda Nobel alan ilk kişi oldu. Polonyum ve radyumu keşfetti.',
      ),
      kart(
        'İbn Heysem',
        'Optiğin kurucusu sayılır. Görmenin gözden çıkan ışınla değil, cisimden göze gelen ışıkla olduğunu gösterdi.',
      ),
      kart(
        'Türkiye’den bir ad',
        'Feza Gürsey parçacık fiziğinde simetri kuramlarıyla tanınır; adı uluslararası bir araştırma ödülünde yaşıyor.',
      ),
    ], [
      soru('Hareket yasalarını ve kütle çekim yasasını Newton ortaya koymuştur.', true, 'Üç hareket yasası ve evrensel çekim yasası ona ait.'),
      soru('İbn Heysem, görmenin gözden çıkan ışınlarla gerçekleştiğini savunmuştur.', false, 'Tersini gösterdi: görme, cisimden gelen ışığın göze ulaşmasıyla oluyor.'),
      soru('Marie Curie iki farklı bilim dalında Nobel Ödülü almıştır.', true, 'Biri fizik, öteki kimya alanında.'),
      soru('Galileo, ağır cisimlerin hafif cisimlerden daha hızlı düştüğünü göstermiştir.', false, 'Bunun tersini savundu: hava direnci yoksa iki cisim aynı anda düşer.'),
    ]),
    konu('fzk9-kariyer', 'Fizik Bilimi ile İlgili Kariyer Keşfi', [
      kart(
        'Nerede çalışılır?',
        'Enerji, savunma, sağlık (tıbbi görüntüleme), yarı iletken ve havacılık sektörleri; ayrıca araştırma merkezleri.',
      ),
      kart(
        'Medikal fizik',
        'Radyoterapi ve görüntüleme cihazlarının doğru dozla çalışmasını sağlar. Hastane ekibinin bir parçasıdır.',
      ),
      kart(
        'Malzeme ve yarı iletken',
        'Yeni malzeme geliştirmek fizik ve kimyanın kesiştiği yer; işlemci üretiminin temeli burada.',
      ),
      kart(
        'Araştırma merkezleri',
        'TÜBİTAK ve üniversite laboratuvarları; yurt dışında CERN gibi merkezler. Türkiye CERN’e ortak üye.',
      ),
      kart(
        'Meteoroloji ve jeofizik',
        'Atmosferin ve yer kabuğunun davranışı fiziksel modellerle tahmin edilir; deprem araştırmaları da bu alanda.',
      ),
      kart(
        'Beklenmedik alanlar',
        'Fizik eğitimi veri analizi ve modelleme öğrettiği için finans ve yazılım da fizikçi istihdam eder.',
      ),
    ], [
      soru('Medikal fizik uzmanı, hastanelerdeki ışın tedavisi cihazlarının doğru çalışmasıyla ilgilenir.', true, 'Doz hesabı ve cihaz denetimi bu uzmanlığın işi.'),
      soru('Fizik mezunları yalnızca üniversitede akademisyen olarak çalışabilir.', false, 'Sanayi, hastane, meteoroloji ve araştırma merkezleri de çalışma alanı.'),
      soru('Meteoroloji ve jeofizik, fizik bilgisinin kullanıldığı alanlardır.', true, 'Atmosfer olayları da yer kabuğu hareketleri de fiziksel yasalarla inceleniyor.'),
      soru('Yarı iletken üretimi fizikle ilgisi olmayan bir sanayi dalıdır.', false, 'Katıhâl fiziğinin doğrudan uygulama alanı.'),
    ]),
  ]),
  tema('fzk9-t2', 'Kuvvet ve Hareket', [
    konu('fzk9-nicelik', 'Temel ve Türetilmiş Nicelikler', [
      kart(
        'Nicelik nedir?',
        'Ölçülebilen her özellik bir niceliktir. Ölçüm, niceliği birimiyle karşılaştırmaktır.',
      ),
      kart(
        'Temel nicelikler',
        'SI’da yedi tane vardır ve hiçbiri başka bir nicelikten türetilmez.',
        {
          tur: 'tablo',
          basliklar: ['Nicelik', 'Birim'],
          satirlar: [
            ['Uzunluk', 'metre (m)'],
            ['Kütle', 'kilogram (kg)'],
            ['Zaman', 'saniye (s)'],
            ['Akım', 'amper (A)'],
            ['Sıcaklık', 'kelvin (K)'],
            ['Madde miktarı', 'mol'],
            ['Işık şiddeti', 'kandela (cd)'],
          ],
        },
      ),
      kart(
        'Türetilmiş nicelikler',
        'Temel niceliklerden çarpma ve bölme ile elde edilir: hız (m/s), kuvvet (kg·m/s²), enerji (joule).',
      ),
      kart(
        'Birim önemlidir',
        'Sayı tek başına bilgi değildir. 1999’da bir Mars sondası birim karışıklığı yüzünden kaybedildi.',
      ),
      kart(
        'Ön ekler',
        'kilo bin katı, santi yüzde biri, mili binde biri, mikro milyonda biri. Hesaba girmeden önce birimler eşitlenir.',
      ),
      kart(
        'Boyut denetimi',
        'Bir denklemin iki tarafının birimi aynı olmalıdır. Tutmuyorsa denklem kesin yanlıştır — hesabı yapmadan anlaşılır.',
      ),
    ], [
      soru('Kütlenin SI birimi gramdır.', false, 'SI temel birimi kilogram; gram onun ast katı.'),
      soru('Hız türetilmiş bir niceliktir.', true, 'Uzunluk ve zaman gibi temel niceliklerden türüyor.'),
      soru('1 nanometre, metrenin milyarda biridir.', true, 'nano ön eki 10⁻⁹ demek.'),
      soru('Bir denklemin iki tarafının birimleri farklı olabilir.', false, 'Boyut denetimi tutmuyorsa denklem yanlıştır.'),
    ]),
    konu('fzk9-skaler-vektorel', 'Skaler ve Vektörel Nicelikler', [
      kart(
        'Skaler nicelik',
        'Yalnızca büyüklükle tanımlanır: kütle, zaman, sıcaklık, sürat, enerji.',
      ),
      kart(
        'Vektörel nicelik',
        'Büyüklüğün yanında yön de gerekir: kuvvet, hız, ivme, yer değiştirme.',
        {
          tur: 'tablo',
          basliklar: ['Skaler', 'Vektörel'],
          satirlar: [
            ['Yol', 'Yer değiştirme'],
            ['Sürat', 'Hız'],
            ['Kütle', 'Ağırlık'],
            ['Enerji', 'Kuvvet'],
          ],
        },
      ),
      kart(
        'Yol ve yer değiştirme',
        'Yol gidilen toplam uzunluk (skaler), yer değiştirme başlangıçtan bitişe çizilen ok (vektörel).',
      ),
      kart(
        'Sürat ve hız',
        'Sürat yolun zamana oranı, hız yer değiştirmenin. Pistte bir tur atan araç için ortalama hız sıfırdır.',
      ),
      kart(
        'Kütle ve ağırlık',
        'Kütle madde miktarıdır ve her yerde aynıdır; ağırlık ise kütleye etkiyen çekim kuvvetidir ve Ay’da azalır.',
      ),
      kart(
        'İşaret yön demektir',
        'Tek boyutta yön, artı ve eksi işaretiyle gösterilir. −5 m/s hız, 5 m/s ile aynı süratte ters yönde demektir.',
      ),
    ], [
      soru('Yol skaler, yer değiştirme vektörel bir niceliktir.', true, 'Yol yalnızca büyüklük taşır, yer değiştirmenin ayrıca yönü var.'),
      soru(
        'Şekildeki hareketin yolu 7 birim, yer değiştirmesi 5 birimdir.',
        true,
        'Yol gidilen çizginin uzunluğu (4 + 3), yer değiştirme başlangıcı bitişe bağlayan vektör.',
        {
          tur: 'koordinat',
          pencere: [-1, 5, -1, 4],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 0],
                [4, 3],
              ],
              kirik: true,
            },
            {
              noktalar: [
                [0, 0],
                [4, 3],
              ],
              kirik: true,
              kesik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2, y: -0.4, ad: '4' },
            { x: 4.5, y: 1.5, ad: '3' },
          ],
        },
      ),
      soru('Kütle vektörel bir niceliktir.', false, 'Kütlenin yönü yok; yönü olan, kütleye etki eden ağırlık kuvveti.'),
      soru('Bir cismin sürati sabitse hızı da kesinlikle sabittir.', false, 'Yön değişirse hız değişir; çember üzerinde sabit süratli hareket buna örnek.'),
    ]),
    konu('fzk9-vektor', 'Vektörler', [
      kart(
        'Nasıl gösterilir?',
        'Ok ile: okun uzunluğu büyüklüğü, yönü ise vektörün yönünü verir.',
      ),
      kart(
        'Uç uca ekleme',
        'İlk vektörün ucuna ikincinin başı konur; ilkin başından sonuncunun ucuna çizilen ok bileşkedir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [6, 1],
              ],
              kirik: true,
              ok: true,
              ad: 'A',
            },
            {
              noktalar: [
                [6, 1],
                [8, 4.5],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
              ad: 'B',
            },
            {
              noktalar: [
                [1, 1],
                [8, 4.5],
              ],
              kirik: true,
              kesik: true,
              ok: true,
              renk: 'soluk',
            },
          ],
          etiketler: [{ x: 4, y: 3.3, ad: 'bileşke', renk: 'soluk' }],
        },
      ),
      kart(
        'Paralelkenar yöntemi',
        'İki vektör aynı noktadan çizilip paralelkenar tamamlanır; köşegen bileşkeyi verir. Uç uca eklemeyle aynı sonucu verir.',
      ),
      kart(
        'Bileşenlerine ayırma',
        'Bir vektör birbirine dik iki parçaya bölünebilir. Eğik düzlem problemleri bu yolla çözülür.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 5],
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5, 3.5],
              ],
              kirik: true,
              ok: true,
              ad: 'F',
            },
            {
              noktalar: [
                [0, 0],
                [5, 0],
              ],
              kirik: true,
              ok: true,
              kesik: true,
              renk: 'ikincil',
            },
            {
              noktalar: [
                [5, 0],
                [5, 3.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2.5, y: 0.5, ad: 'Fx', renk: 'ikincil' },
            { x: 5.7, y: 1.8, ad: 'Fy', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'En büyük, en küçük bileşke',
        'Aynı yönlüyse büyüklükler toplanır, zıt yönlüyse çıkarılır. Bileşke bu iki değer arasında kalır.',
      ),
      kart(
        'Dik vektörler',
        'İki vektör dikse bileşkenin büyüklüğü Pisagor ile bulunur: 3 ve 4 birimlik dik iki vektörün bileşkesi 5 birimdir.',
      ),
      kart(
        'Denge',
        'Bir cisme etkiyen vektörlerin bileşkesi sıfırsa cisim dengededir: ya durur ya sabit hızla gider.',
      ),
    ], [
      soru(
        'Şekildeki iki dik vektörün bileşkesi 5 birimdir.',
        true,
        'Dik vektörlerde bileşke Pisagor ile bulunuyor: 3² + 4² = 25.',
        {
          tur: 'koordinat',
          pencere: [-1, 5, -1, 4],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 0],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [0, 0],
                [0, 3],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2, y: -0.4, ad: '4 birim' },
            { x: 1, y: 3, ad: '3 birim' },
          ],
        },
      ),
      soru('Büyüklükleri 5 ve 3 olan iki vektörün bileşkesi 9 birim olabilir.', false, 'Bileşke en çok 8 (aynı yönde), en az 2 (zıt yönde) olur.'),
      soru('Bir cisme etki eden kuvvetlerin bileşkesi sıfırsa cisim dengededir.', true, 'Net kuvvet yoksa hareket durumu değişmiyor.'),
      soru('Vektörler uç uca eklenirken ekleme sırası bileşkeyi değiştirir.', false, 'Vektör toplaması değişmeli; sıra sonucu değiştirmez.'),
    ]),
    konu('fzk9-temel-kuvvet', 'Doğadaki Temel Kuvvetler', [
      kart(
        'Dört temel kuvvet',
        'Bütün etkileşimler dört kuvvete indirgenir; güç ve menzilleri birbirinden çok farklıdır.',
        {
          tur: 'tablo',
          basliklar: ['Kuvvet', 'Menzil'],
          satirlar: [
            ['Güçlü nükleer', 'Çekirdek boyu'],
            ['Elektromanyetik', 'Sonsuz'],
            ['Zayıf nükleer', 'Çekirdekten küçük'],
            ['Kütle çekim', 'Sonsuz'],
          ],
        },
      ),
      kart(
        'Kütle çekim',
        'En zayıfı ama menzili sonsuz ve hep çekicidir. Gezegenleri yörüngede tutan budur.',
      ),
      kart(
        'Elektromanyetik kuvvet',
        'Yükler arasında etkir, hem çeker hem iter. Sürtünme ve tepki gibi günlük kuvvetlerin kaynağı aslında budur.',
      ),
      kart(
        'Güçlü nükleer kuvvet',
        'Çekirdekteki protonlar birbirini iterken onları bir arada tutar. Menzili kısa ama şiddeti en büyüğüdür.',
      ),
      kart(
        'Zayıf nükleer kuvvet',
        'Radyoaktif bozunmadan sorumludur; Güneş’teki füzyon zincirinin başlaması da buna bağlıdır.',
      ),
      kart(
        'Neden en zayıfı baskın?',
        'Kütle çekim en zayıf olsa da yalnızca çekicidir ve birikir; elektrik kuvvetleri zıt yüklerle birbirini götürür.',
      ),
    ], [
      soru('Doğadaki dört temel kuvvetin en zayıfı kütle çekim kuvvetidir.', true, 'Bir mıknatıs, Dünya nın çekimine karşı toplu iğneyi kaldırabiliyor.'),
      soru('Çekirdekteki protonları bir arada tutan güçlü nükleer kuvvettir.', true, 'Aynı yüklü protonların itmesini yenen kuvvet o.'),
      soru('Zayıf nükleer kuvvet, sürtünmenin bir çeşididir.', false, 'Sürtünme elektromanyetik kökenli; zayıf kuvvet çekirdek bozunmalarında etkili.'),
      soru('Kütle çekim en zayıf kuvvet olduğu için evrenin büyük yapılarında etkisizdir.', false, 'Menzili sonsuz ve her zaman çekici; büyük kütlelerde baskın olan o.'),
    ]),
    konu('fzk9-hareket', 'Hareket ve Hareket Türleri', [
      kart(
        'Hareket görecelidir',
        'Bir cismin hareketli sayılması seçilen referans noktasına bağlıdır. Otobüsteki yolcu yere göre hareketli, koltuğa göre durgundur.',
      ),
      kart(
        'Öteleme hareketi',
        'Cismin tüm noktaları aynı yönde ve aynı miktarda yer değiştirir. Düz yolda giden araba böyledir.',
      ),
      kart(
        'Dönme hareketi',
        'Cisim bir eksen çevresinde döner; noktalar eksene uzaklığına göre farklı yol alır. Tekerlek ve pervane örnektir.',
      ),
      kart(
        'Titreşim hareketi',
        'Denge noktası çevresinde ileri geri gidiş. Sarkaç ve yay ucundaki kütle böyle hareket eder.',
      ),
      kart(
        'Düzgün doğrusal hareket',
        'Hız sabittir, ivme sıfırdır. Yol-zaman grafiği bir doğru, hız-zaman grafiği yatay bir çizgidir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'konum',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5.5, 5.5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'İvme',
        'Hızın zamana göre değişimi. Hızlanmak, yavaşlamak ve yön değiştirmek — üçü de ivmelidir.',
      ),
      kart(
        'İvmeli hareket',
        'Hız düzgün değişiyorsa konum-zaman grafiği eğrilir; sabit ivmede bu eğri bir paraboldür.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'konum',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 0.2],
                [2, 0.8],
                [3, 1.8],
                [4, 3.2],
                [5, 5],
              ],
            },
          ],
        },
      ),
      kart(
        'Serbest düşme',
        'Hava direnci yokken bütün cisimler aynı ivmeyle düşer: g ≈ 9,8 m/s². Kütle düşme süresini değiştirmez.',
      ),
    ], [
      soru(
        'Grafikteki hareket düzgün doğrusal harekettir.',
        true,
        'Konum eşit zaman aralıklarında eşit artıyor, yani hız sabit.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 10],
          xAd: 'zaman (s)',
          yAd: 'konum (m)',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 8],
              ],
              kirik: true,
            },
          ],
        },
      ),
      soru('Hareket görecelidir; seçilen referans noktasına göre değişir.', true, 'Otobüste oturan yolcu şoföre göre durgun, yoldaki ağaca göre hareketli.'),
      soru('Serbest düşmede cismin kütlesi büyüdükçe düşme süresi kısalır.', false, 'Hava direnci yokken bütün cisimler aynı ivmeyle düşer.'),
      soru('İvme, konumun zamana göre değişme hızıdır.', false, 'İvme hızın değişme hızı; konumun değişme hızı zaten hızın kendisi.'),
    ]),
  ]),
  tema('fzk9-t3', 'Akışkanlar', [
    konu('fzk9-basinc', 'Basınç', [
      kart(
        'Tanımı',
        'Birim yüzeye dik olarak etkiyen kuvvet: P = F / A. Aynı kuvvet küçük alana uygulanırsa basınç büyür.',
      ),
      kart(
        'Birimi',
        'Pascal (Pa) = N/m². Bir metrekareye bir newtonluk kuvvet uygulandığındaki basınçtır.',
      ),
      kart(
        'Alanla ters orantı',
        'Kuvvet sabitken alan yarıya inerse basınç iki katına çıkar. Basınç-alan grafiği bu yüzden hiperboldür.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'alan',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [1, 5],
                [1.5, 3.3],
                [2, 2.5],
                [3, 1.7],
                [4, 1.25],
                [5, 1],
              ],
            },
          ],
        },
      ),
      kart(
        'Günlük örnekler',
        'Bıçağın ince ağzı ve çivinin sivri ucu alanı küçültüp basıncı artırır; kar ayakkabısı alanı büyütüp azaltır.',
      ),
      kart(
        'Katı basıncı',
        'Katılar basıncı yalnızca temas yüzeyine ve aşağı doğru iletir. Sıvı ve gazlar her yöne iletir.',
      ),
      kart(
        'Ağırlıktan gelen basınç',
        'Yere konan bir cismin uyguladığı basınç, ağırlığının temas alanına bölümüdür; cisim yan yatırılırsa basınç değişir.',
      ),
    ], [
      soru('Basınç, kuvvetin uygulandığı yüzey alanıyla ters orantılıdır.', true, 'Aynı kuvvet küçük alana uygulanınca basınç büyüyor.'),
      soru('Kar ayakkabısı, kişinin ağırlığını azalttığı için batmayı önler.', false, 'Ağırlık aynı kalıyor; temas alanı büyüdüğü için basınç azalıyor.'),
      soru('Basıncın SI birimi pascaldır.', true, '1 Pa, 1 m² ye uygulanan 1 N luk kuvvet demek.'),
      soru('Bıçağın keskin olması uyguladığı kuvveti artırır.', false, 'Kuvvet aynı; alan küçüldüğü için basınç artıyor.'),
    ]),
    konu('fzk9-sivi-basinc', 'Sıvılarda Basınç', [
      kart(
        'Neye bağlı?',
        'Sıvının yoğunluğuna, derinliğe ve yer çekimi ivmesine bağlıdır. Kabın şekline ve sıvı miktarına bağlı değildir.',
      ),
      kart(
        'Derinlikle artar',
        'Üstteki sıvı sütununun ağırlığı arttığı için basınç derinlikle doğru orantılı büyür: P = h · d · g.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'derinlik',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5.5, 5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'Her yöne iletir',
        'Durgun sıvı basıncı her yöne aynı şiddette iletir. Barajın alt duvarı bu yüzden daha kalın yapılır.',
      ),
      kart(
        'Pascal ilkesi',
        'Kapalı kaptaki sıvıya uygulanan basınç her noktaya aynen iletilir. Hidrolik fren ve kriko bununla çalışır.',
      ),
      kart(
        'Hidrolik kazanç',
        'Küçük pistona uygulanan az kuvvet, büyük pistonda büyük kuvvet verir; kazanılan kuvvet kadar yol kaybedilir.',
      ),
      kart(
        'Bileşik kaplar',
        'Birbirine bağlı kaplarda aynı sıvı, kapların şekli ne olursa olsun aynı seviyede durur.',
      ),
      kart(
        'Farklı sıvılar',
        'Bileşik kapta karışmayan iki sıvı varsa seviyeler eşit olmaz: yoğunluğu küçük olan daha yüksekte durur.',
      ),
    ], [
      soru('Sıvı basıncı, kabın şekline ve içindeki sıvı miktarına bağlıdır.', false, 'Yalnızca derinliğe, sıvının yoğunluğuna ve yer çekimine bağlı.'),
      soru('Kapalı bir kaptaki sıvıya uygulanan basınç her yöne aynen iletilir.', true, 'Pascal ilkesi; hidrolik sistemler buna dayanıyor.'),
      soru('Hidrolik sistemde küçük pistona uygulanan kuvvet, büyük pistonda büyütülür.', true, 'Basınç aynı kaldığı için geniş yüzeyde daha büyük kuvvet oluşuyor.'),
      soru('Bileşik kaplarda aynı sıvının seviyesi, kolun genişliğine göre değişir.', false, 'Sıvı bütün kollarda aynı seviyede durur; belirleyen derinlik.'),
    ]),
    konu('fzk9-acik-hava', 'Açık Hava Basıncı', [
      kart(
        'Havanın da ağırlığı var',
        'Atmosferdeki hava sütunu yeryüzüne basınç uygular. Deniz seviyesinde yaklaşık 101.325 Pa’dır.',
      ),
      kart(
        'Torricelli deneyi',
        'Cıva dolu ters çevrilmiş boruda cıva 76 cm’de durur. Bu yükseklik açık hava basıncının ölçüsüdür.',
      ),
      kart(
        'Neden 76 cm?',
        'Cıva sütununun ağırlığı, dışarıdaki havanın basıncını dengeler. Su kullanılsaydı sütun yaklaşık 10 metre olurdu.',
      ),
      kart(
        'Yükseklikle azalır',
        'Yukarı çıkıldıkça üstteki hava sütunu kısalır ve basınç düşer. Uçakta kulak tıkanmasının sebebi budur.',
        {
          tur: 'katman',
          eksenAdi: 'YÜKSEKLİK',
          katmanlar: [
            { ad: 'Uçuş yüksekliği', alt: '~25.000 Pa' },
            { ad: 'Yüksek dağ', alt: '~50.000 Pa' },
            { ad: 'Deniz seviyesi', alt: '101.325 Pa' },
          ],
        },
      ),
      kart(
        'Kaynama noktası düşer',
        'Basınç azalınca su daha düşük sıcaklıkta kaynar. Yüksek rakımda yemek bu yüzden geç pişer.',
      ),
      kart(
        'Günlük etkileri',
        'Pipetle içmek, vantuz ve şırınga açık hava basıncıyla çalışır; içerideki basınç düşürülür, dışarıdaki iter.',
      ),
    ], [
      soru('Deniz seviyesinde açık hava basıncı 76 cm yüksekliğindeki cıva sütununun basıncına eşittir.', true, 'Torricelli deneyinin ölçtüğü değer bu.'),
      soru('Yükseklere çıkıldıkça açık hava basıncı artar.', false, 'Üstteki hava sütunu kısaldığı için basınç azalır.'),
      soru('Yüksek dağlarda su 100 °C nin altında kaynar.', true, 'Açık hava basıncı düştüğü için sıvı daha düşük sıcaklıkta kaynıyor.'),
      soru('Torricelli deneyinde cıva sütununun yüksekliği borunun kesit alanına bağlıdır.', false, 'Kesit değişse de yükseklik değişmez; belirleyen açık hava basıncı.'),
    ]),
    konu('fzk9-kaldirma', 'Kaldırma Kuvveti', [
      kart(
        'Neden oluşur?',
        'Cismin alt yüzeyine etkiyen sıvı basıncı üst yüzeyindekinden büyüktür; aradaki fark yukarı doğru bir kuvvet üretir.',
      ),
      kart(
        'Arşimet ilkesi',
        'Kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşittir.',
      ),
      kart(
        'Neye bağlı?',
        'Sıvının yoğunluğuna ve batan hacme bağlıdır. Cismin kütlesine ya da derinliğe bağlı değildir.',
      ),
      kart(
        'Yüzme koşulu',
        'Yüzüp yüzmemeyi iki yoğunluğun karşılaştırması belirler.',
        {
          tur: 'tablo',
          basliklar: ['Yoğunluk', 'Sonuç'],
          satirlar: [
            ['Cisim < sıvı', 'Yüzer'],
            ['Cisim = sıvı', 'Askıda kalır'],
            ['Cisim > sıvı', 'Batar'],
          ],
        },
      ),
      kart(
        'Görünen ağırlık',
        'Sıvıya batırılan cisim daha hafif gelir: dinamometre, gerçek ağırlıktan kaldırma kuvveti çıkmış değeri gösterir.',
      ),
      kart(
        'Gemi neden batmaz?',
        'Çelik yoğun ama gemi içi boştur; ortalama yoğunluğu suyunkinden küçük kaldığı için yüzer.',
      ),
      kart(
        'Gazlarda da vardır',
        'Balon havadan hafif gazla dolduğunda yükselir; havanın uyguladığı kaldırma kuvveti ağırlığından büyüktür.',
      ),
    ], [
      soru('Kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşittir.', true, 'Arşimet ilkesi.'),
      soru('Kaldırma kuvvetinin büyüklüğü cismin kütlesine bağlıdır.', false, 'Batan hacme ve sıvının yoğunluğuna bağlı; aynı hacimli iki cisme aynı kuvvet etkir.'),
      soru('Yoğunluğu içinde bulunduğu sıvıdan küçük olan cisim yüzer.', true, 'Kaldırma kuvveti ağırlıktan büyük olduğu için cisim yukarı itiliyor.'),
      soru('Gazlarda kaldırma kuvveti oluşmaz.', false, 'Balonun yükselmesi havanın uyguladığı kaldırma kuvvetiyle.'),
    ]),
    konu('fzk9-bernoulli', 'Bernoulli İlkesi', [
      kart(
        'Temel fikir',
        'Akışkanın sürati arttığı yerde çeperlere yaptığı basınç azalır.',
      ),
      kart(
        'Süreklilik',
        'Boru daralınca akışkan hızlanır; aynı miktar sıvı birim zamanda geçmek zorundadır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0.5, 5],
                [4, 5],
                [6, 3.6],
                [9.5, 3.6],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [0.5, 1],
                [4, 1],
                [6, 2.4],
                [9.5, 2.4],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [1.5, 3],
                [3, 3],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [6.5, 3],
                [9, 3],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2.2, y: 2.1, ad: 'yavaş', renk: 'ana' },
            { x: 7.7, y: 2.1, ad: 'hızlı', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Enerjinin korunumu',
        'İlke aslında enerji korunumudur: hızlanan akışkanın kinetik enerjisi artarken basınç enerjisi azalır.',
      ),
      kart(
        'Uçak kanadı',
        'Kanadın üstünden geçen hava daha hızlıdır, basınç düşer; alttaki yüksek basınç kanadı yukarı iter.',
      ),
      kart(
        'Bacadaki çekiş',
        'Baca ağzından geçen rüzgâr basıncı düşürür ve içerideki dumanı yukarı çeker.',
      ),
      kart(
        'Günlük örnek',
        'Duş perdesinin içeri çekilmesi ve iki yaprağın arasına üflendiğinde birbirine yaklaşması aynı ilkedir.',
      ),
    ], [
      soru('Bir akışkanın hızı arttığında basıncı azalır.', true, 'Bernoulli ilkesi; enerjinin korunumundan çıkıyor.'),
      soru('Uçak kanadının üst yüzeyinde hava daha hızlı aktığı için basınç düşer.', true, 'Alttaki yüksek basınç kanadı yukarı iter.'),
      soru('Dar bir bölümden geçen suyun hızı azalır.', false, 'Süreklilik: kesit daraldıkça hız artar.'),
      soru('Bernoulli ilkesi enerjinin korunumu yasasıyla çelişir.', false, 'İlke tam da enerjinin korunumundan türetiliyor.'),
    ]),
  ]),
  tema('fzk9-t4', 'Enerji', [
    konu('fzk9-ic-enerji', 'İç Enerji, Isı ve Sıcaklık', [
      kart(
        'İç enerji',
        'Maddedeki taneciklerin kinetik ve potansiyel enerjilerinin toplamı. Madde miktarına bağlıdır.',
      ),
      kart(
        'Sıcaklık',
        'Taneciklerin ortalama kinetik enerjisinin ölçüsü. Madde miktarından bağımsızdır.',
      ),
      kart(
        'Isı',
        'Sıcaklık farkı yüzünden aktarılan enerji. Madde ısı içermez; ısı yalnızca aktarım sırasında vardır.',
      ),
      kart(
        'Üçü karıştırılıyor',
        'Üç kavram da enerjiyle ilgili ama farklı soruları yanıtlar.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne ölçer?'],
          satirlar: [
            ['İç enerji', 'Toplam enerji'],
            ['Sıcaklık', 'Ortalama enerji'],
            ['Isı', 'Aktarılan enerji'],
          ],
        },
      ),
      kart(
        'Kıvılcım ve kazan',
        'Kıvılcımın sıcaklığı yüksektir ama iç enerjisi azdır; ılık bir kazan daha çok enerji taşır.',
      ),
      kart(
        'Aktarım yönü',
        'Isı her zaman sıcaktan soğuğa akar. Ters yön kendiliğinden olmaz.',
      ),
      kart(
        'Sıcaklık birimleri',
        'Celsius suyun donma ve kaynamasına, Kelvin mutlak sıfıra dayanır: 0 K = −273,15 °C. Aradaki fark 273,15’tir.',
      ),
    ], [
      soru('Isı, sıcaklık farkı nedeniyle bir yerden başka yere aktarılan enerjidir.', true, 'Isı bir enerji aktarımı; cisimde "depolanan" şey iç enerji.'),
      soru('Bir kıvılcımın sıcaklığı kazandaki sudan yüksek olsa bile iç enerjisi düşüktür.', true, 'İç enerji tanecik sayısına da bağlı; kıvılcımda tanecik az.'),
      soru('Isı, iç enerjisi büyük olan cisimden küçük olana akar.', false, 'Aktarım yönünü iç enerji değil sıcaklık belirler.'),
      soru('Sıcaklık, cismin sahip olduğu toplam enerjidir.', false, 'Sıcaklık taneciklerin ortalama kinetik enerjisinin ölçüsü; toplam olan iç enerji.'),
    ]),
    konu('fzk9-oz-isi', 'Isı, Öz Isı ve Isı Sığası', [
      kart(
        'Öz ısı',
        '1 gram maddenin sıcaklığını 1 °C artırmak için gereken ısı. Maddenin ayırt edici özelliğidir.',
      ),
      kart(
        'Suyun öz ısısı yüksek',
        'Su geç ısınır, geç soğur. Denizin havayı yumuşatması ve motor soğutmada su kullanılması bundandır.',
      ),
      kart(
        'Isı sığası',
        'Bütün cismin sıcaklığını 1 °C artırmak için gereken ısı. Öz ısı ile kütlenin çarpımıdır.',
      ),
      kart(
        'Öz ısı mı, ısı sığası mı?',
        'Öz ısı maddeye aittir ve kütleyle değişmez; ısı sığası o cisme aittir ve kütle büyüdükçe büyür.',
      ),
      kart(
        'Hesap',
        'Q = m · c · ΔT. Alınan ısı; kütle, öz ısı ve sıcaklık farkının çarpımına eşittir.',
      ),
      kart(
        'Grafikten öz ısı',
        'Sıcaklık-ısı grafiğinde eğim ne kadar dikse cisim o kadar çabuk ısınır; yatık doğru büyük öz ısı demektir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'verilen ısı',
          yAd: 'sıcaklık',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [3, 5.5],
              ],
              kirik: true,
              ad: 'küçük c',
            },
            {
              noktalar: [
                [0, 0],
                [5.5, 2.4],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'büyük c',
            },
          ],
        },
      ),
    ], [
      soru('Suyun öz ısısının yüksek olması, geç ısınıp geç soğumasının sebebidir.', true, 'Aynı sıcaklık artışı için daha çok ısı gerekiyor.'),
      soru('Isı sığası kütleye bağlıdır, öz ısı ise maddenin ayırt edici bir özelliğidir.', true, 'Isı sığası = kütle × öz ısı.'),
      soru('Q = m · c · ΔT bağıntısında c kütleyi gösterir.', false, 'c öz ısı, m kütle.'),
      soru('Aynı maddeden yapılmış iki cismin öz ısıları kütleleriyle orantılıdır.', false, 'Öz ısı maddeye ait; kütle değişse de aynı kalır.'),
    ]),
    konu('fzk9-hal-degisim', 'Hâl Değişimi', [
      kart(
        'Sıcaklık sabit kalır',
        'Hâl değişirken alınan ısı sıcaklığı değil, tanecikler arası bağları değiştirmeye harcanır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, -20, 120],
          xAd: 'zaman',
          yAd: '°C',
          egriler: [
            {
              noktalar: [
                [0, -20],
                [1.5, 0],
                [3.5, 0],
                [6, 100],
                [8.5, 100],
                [9.5, 115],
              ],
              kirik: true,
            },
          ],
          etiketler: [
            { x: 2.5, y: 18, ad: 'erime', renk: 'ikincil' },
            { x: 7.3, y: 82, ad: 'kaynama', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Hâl değişimleri',
        'Erime, donma, buharlaşma, yoğuşma; katıdan doğrudan gaza geçiş süblimleşmedir.',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Katı' }, { ad: 'Sıvı' }, { ad: 'Gaz' }],
        },
      ),
      kart(
        'Erime ve donma ısısı',
        '1 gram maddeyi eritmek için gereken ısı, aynı maddenin donarken verdiği ısıya eşittir.',
      ),
      kart(
        'Buharlaşma her sıcaklıkta',
        'Buharlaşma yüzeyde ve her sıcaklıkta olur; kaynama ise belirli bir sıcaklıkta sıvının her yerinde olur.',
      ),
      kart(
        'Buharlaşmayı hızlandıran',
        'Sıcaklık, yüzey alanı ve hava akımı buharlaşmayı hızlandırır; nemli hava yavaşlatır.',
      ),
      kart(
        'Neden serinletir?',
        'Terin buharlaşması için gereken ısı deriden çekilir; bu yüzden ter buharlaşırken vücut serinler.',
      ),
      kart(
        'Suyun tuhaflığı',
        'Su donarken genleşir. Buz sudan hafif olduğu için yüzer ve gölün yüzeyi donarken dibi sıvı kalır.',
      ),
    ], [
      soru(
        'Grafikte yatay kalan bölümde madde hâl değiştiriyor.',
        true,
        'Verilen ısı bağları koparmaya harcanıyor, o yüzden sıcaklık artmıyor.',
        {
          tur: 'koordinat',
          pencere: [0, 10, -20, 120],
          xAd: 'zaman',
          yAd: 'sıcaklık (°C)',
          egriler: [
            {
              noktalar: [
                [0, -10],
                [2, 0],
                [5, 0],
                [8, 100],
              ],
              kirik: true,
            },
          ],
        },
      ),
      soru('Buharlaşma yalnızca kaynama sıcaklığında görülür.', false, 'Buharlaşma her sıcaklıkta yüzeyden olur; kaynama sıvının her yerinde olan hâl değişimi.'),
      soru('Hâl değişimi sırasında maddeye verilen ısı sıcaklığı artırmaz.', true, 'Isı taneciklerin arasındaki bağları koparmak için harcanıyor.'),
      soru('Su donarken hacmi küçülür.', false, 'Su donarken genleşir; buzun suda yüzmesinin sebebi bu.'),
    ]),
    konu('fzk9-isil-denge', 'Isıl Denge', [
      kart(
        'Ne demek?',
        'Temas eden cisimler aynı sıcaklığa geldiğinde net ısı akışı durur; bu duruma ısıl denge denir.',
      ),
      kart(
        'Alınan ısı = verilen ısı',
        'Yalıtılmış bir kapta sıcak cismin verdiği ısı, soğuk cismin aldığı ısıya eşittir.',
      ),
      kart(
        'Denge sıcaklığı',
        'Karışımın son sıcaklığı iki başlangıç sıcaklığının arasındadır; kütlesi ve öz ısısı büyük olana yakın çıkar.',
      ),
      kart(
        'Denge ortalama değildir',
        'İki farklı madde karıştığında sonuç iki sıcaklığın ortalaması olmaz; öz ısılar farklıysa denge ortadan kayar.',
      ),
      kart(
        'Termometre nasıl çalışır?',
        'Termometre ölçtüğü cisimle ısıl dengeye girer ve kendi sıcaklığını gösterir.',
      ),
      kart(
        'Denge durgunluk değil',
        'Dengede ısı alışverişi durmaz, iki yöne eşitlenir. Net akış sıfırdır ama tanecikler durmaz.',
      ),
    ], [
      soru('Isıl dengeye gelen iki cismin sıcaklıkları eşittir.', true, 'Net ısı akışı, sıcaklıklar eşitlendiğinde duruyor.'),
      soru('Denge sıcaklığı her zaman iki cismin sıcaklıklarının ortalamasıdır.', false, 'Kütleler ve öz ısılar eşit değilse denge sıcaklığı ortalamaya düşmez.'),
      soru('Termometre, ölçtüğü cisimle ısıl dengeye gelerek çalışır.', true, 'Okunan değer termometrenin kendi sıcaklığı, o da cismin sıcaklığına eşitlenmiş oluyor.'),
      soru('Isıl dengedeki cisimlerde taneciklerin hareketi durur.', false, 'Tanecikler hareketine devam eder; duran şey yalnızca net ısı akışı.'),
    ]),
    konu('fzk9-aktarim', 'Isı Aktarım Yolları', [
      kart(
        'Üç yol',
        'Isı iletim, konveksiyon ve ışıma ile aktarılır. Aralarındaki fark taşıyıcının ne olduğudur.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Taşıyıcı'],
          satirlar: [
            ['İletim', 'Titreşen tanecik'],
            ['Konveksiyon', 'Akışkan hareketi'],
            ['Işıma', 'Ortam gerekmez'],
          ],
        },
      ),
      kart(
        'İletim',
        'Tanecikler yer değiştirmeden titreşerek enerjiyi komşusuna aktarır. Katılarda, özellikle metallerde baskındır.',
      ),
      kart(
        'Konveksiyon',
        'Isınan akışkan genleşip yükselir, soğuyan iner. Kalorifer odayı bu döngüyle ısıtır.',
      ),
      kart(
        'Işıma',
        'Enerji elektromanyetik dalgalarla taşınır ve ortam gerekmez. Güneş’in ısısı bize böyle ulaşır.',
      ),
      kart(
        'Renk ve ışıma',
        'Koyu ve mat yüzeyler ışımayı daha iyi soğurur ve yayar; parlak açık yüzeyler yansıtır.',
      ),
      kart(
        'Yalıtım',
        'Termos üç yolu birden keser: çift cidar arasında boşluk iletimi ve konveksiyonu, aynalı yüzey ışımayı engeller.',
      ),
    ], [
      soru(
        'Güneş ten Dünya ya enerji ışıma yoluyla ulaşır.',
        true,
        'Aradaki uzay boşluğunda madde yok; yalnızca ışıma ortam gerektirmiyor.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Nasıl taşınır'],
          satirlar: [
            ['İletim', 'Tanecikten taneciğe'],
            ['Konveksiyon', 'Akışkanın kendisi taşır'],
            ['Işıma', 'Ortam gerekmez'],
          ],
        },
      ),
      soru('Konveksiyon katılarda görülen bir ısı aktarım yoludur.', false, 'Konveksiyonda akışkanın kendisi yer değiştirir; katıda taneciklerin yeri sabit.'),
      soru('Koyu renkli yüzeyler ışımayı açık renklilerden daha iyi soğurur.', true, 'Aynı yüzey iyi soğurduğu ışımayı iyi de yayar.'),
      soru('Isı yalıtımı, ısının hiç geçmemesini sağlar.', false, 'Yalıtım aktarımı yavaşlatır, tümüyle durdurmaz.'),
    ]),
    konu('fzk9-iletim-hizi', 'Isı İletim Hızı', [
      kart(
        'Neye bağlı?',
        'Malzemenin cinsine, kesit alanına, iki uç arasındaki sıcaklık farkına ve uzunluğa bağlıdır.',
      ),
      kart(
        'Sıcaklık farkıyla doğru',
        'İki uç arasındaki fark büyüdükçe iletim hızlanır; fark sıfırsa akış durur.',
      ),
      kart(
        'Uzunlukla ters',
        'Yol uzadıkça iletim yavaşlar. Duvarın kalınlaştırılması ısı kaybını bu yüzden azaltır.',
      ),
      kart(
        'Kesit alanıyla doğru',
        'Kalın bir çubuk aynı sürede daha çok ısı taşır; alan iki katına çıkarsa iletim hızı da iki katına çıkar.',
      ),
      kart(
        'Neden metal soğuk hisseder?',
        'Metal ısıyı hızlı çektiği için elden ısı hızla akar. Aynı sıcaklıktaki tahta daha ılık hissedilir.',
      ),
      kart(
        'Yalıtkanlar',
        'Hava, köpük ve yün ısıyı yavaş iletir. Kışlık giysi aslında arasında tuttuğu havayla yalıtır.',
      ),
      kart(
        'Çift cam',
        'İki cam arasındaki durgun hava katmanı iletimi keser; camın kendisi değil, aradaki boşluk yalıtır.',
      ),
    ], [
      soru('Isı iletim hızı, çubuğun uzunluğuyla ters orantılıdır.', true, 'Yol uzadıkça aynı sürede geçen ısı azalıyor.'),
      soru('Kesit alanı büyüdükçe iletilen ısı miktarı azalır.', false, 'Doğru orantılı: geniş kesit daha çok ısı geçirir.'),
      soru('Aynı odadaki metal, tahtadan daha soğuk hissedilir çünkü sıcaklığı daha düşüktür.', false, 'İkisinin sıcaklığı aynı; metal ısıyı elden hızlı çektiği için soğuk hissediliyor.'),
      soru('Çift camın arasındaki hava tabakası ısı iletimini yavaşlattığı için yalıtım sağlar.', true, 'Hava kötü bir iletken.'),
    ]),
  ]),
])
