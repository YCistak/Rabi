import { kart, konu, program, sikli, soru, tema } from '../tip'

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
      metinler oradan. Etiket ve hızlı kontrol öteki konularda henüz boş;
      Rabi notu ise her konuda **bir** kartta var (bkz. `tip.ts`).
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
        'Bilimsel bilgi değişebilir',
        'Yeni bir gözlem eski kuramı düzeltebilir. Değişmek bilimin zayıflığı değil, yöntemin işlediğinin kanıtıdır.',
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
      sikli('Sınanmayı bekleyen öneriye ne denir?', ['Hipotez', 'Yasa'], 0, 'Hipotez henüz sınanmamış öneri; yasa gözlenen düzenliliğin kısa ifadesi.'),
      sikli('Deneyle çelişen bir model için ne yapılır?', ['Bırakılır ya da düzeltilir', 'Deney tekrar edilene kadar korunur'], 0, 'Model gerçeğin sadeleştirilmiş hâli; deneyle çelişince zarif olsa da bırakılır.'),
      sikli('Bir ölçüm sonucu nasıl verilmelidir?', ['Belirsizliğiyle birlikte', 'Yalnızca sayı olarak'], 0, 'Her ölçümün belirsizliği vardır; onu yazmamak sonucu olduğundan kesin gösterir.'),
      soru('Bilimsel bilginin yeni gözlemle değişmesi yöntemin zayıflığını gösterir.', false, 'Tam tersi: kendini düzeltebilmek yöntemin işlediğinin kanıtı.'),
      soru('Matematik, fizik yasasını tahmin yapabilir hâle getiren dildir.', true, 'Cümleyle anlatılan yasa denkleme dönmeden tahmin üretemez.'),
    ], [
      {
        soru: 'Bilimsel yöntemde deney neyi sınar?',
        siklar: ['Kurulan hipotezi', 'Ölçüm biriminin adını'],
        dogru: 0,
        aciklama: {
          dogru: 'Aynen öyle. Gözlem soruyu doğurur, hipotez bir tahmindir; deney o tahmini sınar ve tutmazsa zincir başa döner.',
          yanlis: 'Tam değil. Deney, kurulan hipotezi sınar. Birim seçimi ölçmeyi karşılaştırılabilir kılar ama sınanan şey tahmindir.',
        },
        kart: 2,
      },
    ]),
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
        'Akustik ve dalgalar',
        'Ses, su dalgası ve deprem dalgası aynı matematikle incelenir. Dalga mekaniği, mekanik ile optiğin arasında köprüdür.',
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
      kart(
        'Hangi dal hangi soruyu sorar?',
        'Cisim nasıl hareket eder → mekanik; ısı nereye gider → termodinamik; ışık ne yapar → optik; yük ne yapar → elektromanyetizma.',
        undefined,
        { not: 'Dalları listeleme; her birini bir soruyla eşle, soru aklında kalır.' },
      ),
    ], [
      soru('Termodinamik, ısı ve sıcaklıkla ilgili olayları inceler.', true, 'Isı alışverişi, hâl değişimi ve enerji dönüşümleri bu alanın konusu.'),
      soru('Atom altı parçacıkların davranışı klasik fiziğin konusudur.', false, 'Modern fiziğin: kuantum kuramı ve görelilik burada devreye giriyor.'),
      soru('Yarı iletkenlerin davranışı katıhâl fiziğinin konusudur.', true, 'Katıhâl fiziği maddenin katı hâldeki yapısını ve elektriksel davranışını inceliyor.'),
      soru('Mekanik yalnızca hareketsiz cisimleri inceler.', false, 'Mekanik kuvvet ve hareketi inceler; durgunluk bunun özel bir hâli.'),
      sikli('Gözlük ve fiber optik hangi dalın ürünüdür?', ['Mekanik', 'Optik'], 1, 'Işığın kırılması ve yansıması optiğin konusu.'),
      sikli('Elektrik motoru ve radyo dalgası hangi dalın çatısı altındadır?', ['Termodinamik', 'Elektromanyetizma'], 1, 'Elektrik ve manyetizma tek çatıda toplanır.'),
      sikli('Ses ve deprem dalgası hangi alanda incelenir?', ['Katıhâl fiziği', 'Dalga mekaniği (akustik)'], 1, 'Ses, su ve deprem dalgası aynı matematikle incelenir.'),
      soru('Klasik fizik günlük hız ve boyutlarda yanlış sonuç verir.', false, 'Klasik fizik günlük ölçekte doğru sonuç verir; sınırı atom altı ve ışık hızına yakın olaylardır.'),
      soru('Bütün elektronik cihazlar katıhâl fiziğinin ürünü olan yarı iletkenlere dayanır.', true, 'Yarı iletken katıhâl fiziğinden çıktı; işlemciler onunla yapılıyor.'),
      soru('Kuantum fiziği ve görelilik modern fiziğin konusudur.', true, 'Klasik fiziğin yetmediği yerde modern fizik başlar.'),
    ], [
      {
        soru: 'Buzdolabının çalışma ilkesi hangi alt dalın konusudur?',
        siklar: ['Termodinamik', 'Optik'],
        dogru: 0,
        aciklama: {
          dogru: 'Evet: buzdolabı ısıyı içeriden dışarı taşıyan bir enerji dönüşümü, termodinamiğin işi.',
          yanlis: 'Optik ışıkla ilgilenir. Isı ve enerji dönüşümü termodinamiğin konusu; buzdolabı ısıyı içeriden dışarı taşır.',
        },
        kart: 2,
      },
    ]),
    konu('fzk9-bilim-insanlari', 'Fizik Bilimine Yön Verenler', [
      kart(
        'Arşimet',
        'Kaldırma kuvvetini ve kaldıraç ilkesini buldu; suya batan cismin taşırdığı su kadar hafiflediğini gösterdi.',
      ),
      kart(
        'Galileo',
        'Deneyi fiziğin merkezine koydu. Serbest düşmede farklı kütlelerin aynı ivmeyle düştüğünü savundu.',
        undefined,
        { not: 'Adları değil, her birinin fiziğe kattığı tek cümleyi tut.' },
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
        'Tesla ve alternatif akım',
        'Alternatif akım sistemini geliştirdi; bugünkü elektrik şebekesinin temeli onun motor ve transformatör tasarımlarıdır.',
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
      sikli('Kaldırma kuvvetini ve kaldıraç ilkesini bulan kimdir?', ['Galileo', 'Arşimet'], 1, 'Arşimet suya batan cismin taşırdığı su kadar hafiflediğini gösterdi.'),
      sikli('Elektrik ile manyetizmanın bağını deneyle gösteren kimdir?', ['Einstein', 'Faraday'], 1, 'Faraday deneyle gösterdi, Maxwell denklemlerle yazdı.'),
      sikli('Alternatif akım sistemini geliştiren kimdir?', ['Newton', 'Tesla'], 1, 'Bugünkü şebekenin temeli Tesla\'nın motor ve transformatör tasarımları.'),
      sikli('Enerji ile kütlenin bağını kuran kimdir?', ['Marie Curie', 'Einstein'], 1, 'E = mc² göreliliğin sonucu.'),
      soru('Feza Gürsey parçacık fiziğinde simetri kuramlarıyla tanınır.', true, 'Adı uluslararası bir araştırma ödülünde yaşıyor.'),
      soru('Maxwell elektromanyetizmayı dört denklemle yazmıştır.', true, 'Faraday\'ın deneyle gösterdiği bağı Maxwell matematikle kurdu.'),
    ], [
      {
        soru: 'Gökteki ve yerdeki hareketin aynı yasaya uyduğunu gösteren kimdir?',
        siklar: ['Galileo', 'Newton'],
        dogru: 1,
        aciklama: {
          dogru: 'Newton\'un kütle çekim yasası elmayı düşüren kuvvetle Ay\'ı yörüngede tutan kuvvetin aynı olduğunu söyler.',
          yanlis: 'Galileo deneyi ve serbest düşmeyi getirdi; gök ile yeri tek yasada birleştiren Newton\'un kütle çekimi.',
        },
        kart: 3,
      },
    ]),
    konu('fzk9-kariyer', 'Fizik Bilimi ile İlgili Kariyer Keşfi', [
      kart(
        'Nerede çalışılır?',
        'Enerji, savunma, sağlık (tıbbi görüntüleme), yarı iletken ve havacılık sektörleri; ayrıca araştırma merkezleri.',
      ),
      kart(
        'Fizik mühendisliği',
        'Lazer, optik sistem ve sensör tasarımı; fiziğin sanayideki doğrudan uygulaması. Üniversitede ayrı bir bölümdür.',
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
      kart(
        'Hangi ders neye açılır?',
        'Mekanik → makine ve inşaat; elektromanyetizma → elektrik-elektronik; modern fizik → nükleer ve malzeme; optik → görüntüleme.',
        undefined,
        { not: 'Bu kart seçim yaptırmak için değil, dersle meslek arasındaki bağı görmen için.' },
      ),
    ], [
      soru('Medikal fizik uzmanı, hastanelerdeki ışın tedavisi cihazlarının doğru çalışmasıyla ilgilenir.', true, 'Doz hesabı ve cihaz denetimi bu uzmanlığın işi.'),
      soru('Fizik mezunları yalnızca üniversitede akademisyen olarak çalışabilir.', false, 'Sanayi, hastane, meteoroloji ve araştırma merkezleri de çalışma alanı.'),
      soru('Meteoroloji ve jeofizik, fizik bilgisinin kullanıldığı alanlardır.', true, 'Atmosfer olayları da yer kabuğu hareketleri de fiziksel yasalarla inceleniyor.'),
      soru('Yarı iletken üretimi fizikle ilgisi olmayan bir sanayi dalıdır.', false, 'Katıhâl fiziğinin doğrudan uygulama alanı.'),
      sikli('Lazer ve sensör tasarımı hangi bölümün işidir?', ['Meteoroloji', 'Fizik mühendisliği'], 1, 'Fiziğin sanayideki doğrudan uygulaması; ayrı bir bölüm.'),
      sikli('Türkiye hangi araştırma merkezine ortak üyedir?', ['NASA', 'CERN'], 1, 'Türkiye CERN\'e ortak üye; üniversite ve TÜBİTAK laboratuvarları da var.'),
      sikli('Elektromanyetizma bilgisi en çok hangi mühendisliğe açılır?', ['İnşaat', 'Elektrik-elektronik'], 1, 'Mekanik makine ve inşaata, elektromanyetizma elektrik-elektroniğe.'),
      soru('Finans ve yazılım sektörü fizikçi istihdam etmez.', false, 'Fizik eğitimi veri analizi ve modelleme öğrettiği için bu sektörler de fizikçi alır.'),
      soru('Deprem araştırmaları jeofizik alanında fiziksel modellerle yapılır.', true, 'Yer kabuğunun davranışı fizik yasalarıyla modellenir.'),
    ], [
      {
        soru: 'Radyoterapi cihazının doğru dozla çalışmasını kim sağlar?',
        siklar: ['Meteorolog', 'Medikal fizikçi'],
        dogru: 1,
        aciklama: {
          dogru: 'Medikal fizik hastanedeki ışın tedavisi ve görüntüleme cihazlarının doz ve denetim işi.',
          yanlis: 'Meteorolog atmosferi modeller. Hastanedeki doz hesabı ve cihaz denetimi medikal fizikçinin işi.',
        },
        kart: 3,
      },
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
        'Sık kullanılan türetilmişler',
        'Alan m², hacim m³, yoğunluk kg/m³, hız m/s, ivme m/s², kuvvet N = kg·m/s², enerji J = N·m, güç W = J/s.',
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
        undefined,
        { not: 'Sınavda çıkmaza girdiğinde ilk yapacağın şey bu: birimler tutuyor mu?' },
      ),
      kart(
        'Birim çevirme',
        'Çevirirken çarpanı iki kez uygula: 1 m² = 10⁴ cm², 1 m³ = 10⁶ cm³. Hız için 1 m/s = 3,6 km/h.',
      ),
    ], [
      soru('Kütlenin SI birimi gramdır.', false, 'SI temel birimi kilogram; gram onun ast katı.'),
      soru('Hız türetilmiş bir niceliktir.', true, 'Uzunluk ve zaman gibi temel niceliklerden türüyor.'),
      soru('1 nanometre, metrenin milyarda biridir.', true, 'nano ön eki 10⁻⁹ demek.'),
      soru('Bir denklemin iki tarafının birimleri farklı olabilir.', false, 'Boyut denetimi tutmuyorsa denklem yanlıştır.'),
      sikli('Kuvvetin SI birimi olan newton hangi temel birimlerden türer?', ['kg·m/s', 'kg·m/s²'], 1, 'Kuvvet = kütle × ivme; ivme m/s².'),
      sikli('1 m² kaç cm²\'dir?', ['10²', '10⁴'], 1, 'Çarpan iki kez uygulanır: 100 × 100 = 10.000.'),
      sikli('72 km/h kaç m/s\'dir?', ['72', '20'], 1, '1 m/s = 3,6 km/h; 72 / 3,6 = 20.'),
      sikli('"mikro" ön eki neyi gösterir?', ['Binde biri', 'Milyonda biri'], 1, 'mili binde bir, mikro milyonda bir.'),
      soru('1999\'da bir Mars sondası birim karışıklığı yüzünden kaybedilmiştir.', true, 'Sayı tek başına bilgi değil; birim tutmayınca hesap da tutmaz.'),
      soru('Sıcaklığın SI temel birimi santigrat derecedir.', false, 'Temel birim kelvin (K).'),
    ], [
      {
        soru: 'Aşağıdakilerden hangisi SI temel niceliğidir?',
        siklar: ['Akım şiddeti', 'Kuvvet'],
        dogru: 0,
        aciklama: {
          dogru: 'Akım (amper) yedi temel nicelikten biri. Kuvvet ise kütle, uzunluk ve zamandan türetilir.',
          yanlis: 'Kuvvet türetilmiştir: kg·m/s². Yedi temel nicelik uzunluk, kütle, zaman, akım, sıcaklık, madde miktarı ve ışık şiddeti.',
        },
        kart: 2,
      },
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
        undefined,
        { not: 'Tur atan araç örneğini aklında tut; skaler ile vektörelin farkı orada.' },
      ),
      kart(
        'Kütle ve ağırlık',
        'Kütle madde miktarıdır ve her yerde aynıdır; ağırlık ise kütleye etkiyen çekim kuvvetidir ve Ay’da azalır.',
      ),
      kart(
        'İşaret yön demektir',
        'Tek boyutta yön, artı ve eksi işaretiyle gösterilir. −5 m/s hız, 5 m/s ile aynı süratte ters yönde demektir.',
      ),
      kart(
        'Ortalama sürat sıfır olmaz',
        'Yol hiç sıfırlanmadığı için ortalama sürat de sıfırlanmaz; başladığı yere dönen koşucunun ortalama hızı sıfır, sürati sıfır değildir.',
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
      sikli('Aşağıdakilerden hangisi vektörel niceliktir?', ['İvme', 'Sürat'], 0, 'İvmenin yönü var; sürat yalnızca büyüklük.'),
      sikli('Ay\'a giden bir astronotun neyi değişir?', ['Ağırlığı', 'Kütlesi'], 0, 'Kütle her yerde aynı; ağırlık çekim kuvveti, Ay\'da azalır.'),
      sikli('−5 m/s hız ne anlatır?', ['5 m/s süratle ters yönde hareket', 'Yavaşlayan hareket'], 0, 'Tek boyutta eksi işaret yön demek.'),
      soru('Başladığı yere dönen koşucunun ortalama sürati sıfırdır.', false, 'Yol sıfırlanmaz; sıfırlanan yer değiştirme, dolayısıyla ortalama hız.'),
      soru('Enerji ve sıcaklık skaler niceliklerdir.', true, 'Yalnızca büyüklükle tanımlanırlar.'),
    ], [
      {
        soru: 'Pistte tam tur atan aracın ortalama hızı nedir?',
        siklar: ['Sıfır', 'Yol / zaman'],
        dogru: 0,
        aciklama: {
          dogru: 'Başlangıç ve bitiş aynı nokta, yer değiştirme sıfır; hız yer değiştirmeden hesaplanır.',
          yanlis: 'Yol / zaman ortalama sürati verir. Hız yer değiştirmeye bakar ve tam turda yer değiştirme sıfırdır.',
        },
        kart: 4,
      },
    ]),
    konu('fzk9-vektor', 'Vektörler', [
      kart(
        'Nasıl gösterilir?',
        'Ok ile: okun uzunluğu büyüklüğü, yönü ise vektörün yönünü verir.',
      ),
      kart(
        'Eşit ve zıt vektörler',
        'Büyüklüğü ve yönü aynı olan vektörler eşittir; başlangıç noktası fark etmez. −A, A ile aynı boyda ve ters yöndedir.',
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
        undefined,
        { not: 'Bileşke sorusunda önce bu iki sınırı yaz; cevap ikisinin arasında olmalı.' },
      ),
      kart(
        'Dik vektörler',
        'İki vektör dikse bileşkenin büyüklüğü Pisagor ile bulunur: 3 ve 4 birimlik dik iki vektörün bileşkesi 5 birimdir.',
      ),
      kart(
        'Denge',
        'Bir cisme etkiyen vektörlerin bileşkesi sıfırsa cisim dengededir: ya durur ya sabit hızla gider.',
      ),
      kart(
        'Vektörü sayıyla çarpma',
        '2A vektörü A ile aynı yönde, iki kat uzun; −½A ters yönde ve yarı boydadır. Yön yalnızca işaretle değişir.',
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
      sikli('Büyüklükleri 5 ve 3 olan vektörlerin bileşkesi en az kaçtır?', ['8', '2'], 1, 'Zıt yönde çıkarılır: 5 − 3 = 2. En çok 8.'),
      sikli('−A vektörü A ile nasıl bir ilişkidedir?', ['Yarı boy, aynı yön', 'Aynı boy, ters yön'], 1, 'Eksi işaret yalnızca yönü çevirir.'),
      sikli('Dik iki vektörün bileşkesi nasıl bulunur?', ['Toplayarak', 'Pisagor ile'], 1, '3 ve 4 birimlik dik vektörlerin bileşkesi 5.'),
      sikli('Eğik düzlem problemleri hangi yöntemle çözülür?', ['Paralelkenar yöntemi', 'Bileşenlerine ayırma'], 1, 'Vektör birbirine dik iki parçaya bölünür.'),
      soru('Başlangıç noktaları farklı iki vektör hiçbir zaman eşit olamaz.', false, 'Eşitlik için büyüklük ve yön yeter; başlangıç noktası fark etmez.'),
      soru('2A vektörü A ile aynı yönde ve iki kat uzundur.', true, 'Pozitif sayıyla çarpmak yönü değiştirmez, boyu ölçekler.'),
    ], [
      {
        soru: 'Büyüklükleri 6 ve 8 olan dik iki vektörün bileşkesi kaç birimdir?',
        siklar: ['14', '10'],
        dogru: 1,
        aciklama: {
          dogru: 'Dik vektörlerde Pisagor: 6² + 8² = 100, karekökü 10.',
          yanlis: '14 yalnızca aynı yönde olsalardı çıkardı. Dik vektörlerde Pisagor kullanılır: 6² + 8² = 100 → 10.',
        },
        kart: 7,
      },
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
        undefined,
        { not: 'Zayıf ile baskın aynı şey değil; bu kart ikisini ayırıyor.' },
      ),
      kart(
        'Günlük kuvvetlerin kökeni',
        'İtme, sürtünme, gerilme ve tepki kuvvetlerinin hepsi atomlar arasındaki elektromanyetik etkileşimdir; temas kuvveti diye ayrı bir temel kuvvet yoktur.',
      ),
    ], [
      soru('Doğadaki dört temel kuvvetin en zayıfı kütle çekim kuvvetidir.', true, 'Bir mıknatıs, Dünya nın çekimine karşı toplu iğneyi kaldırabiliyor.'),
      soru('Çekirdekteki protonları bir arada tutan güçlü nükleer kuvvettir.', true, 'Aynı yüklü protonların itmesini yenen kuvvet o.'),
      soru('Zayıf nükleer kuvvet, sürtünmenin bir çeşididir.', false, 'Sürtünme elektromanyetik kökenli; zayıf kuvvet çekirdek bozunmalarında etkili.'),
      soru('Kütle çekim en zayıf kuvvet olduğu için evrenin büyük yapılarında etkisizdir.', false, 'Menzili sonsuz ve her zaman çekici; büyük kütlelerde baskın olan o.'),
      sikli('Radyoaktif bozunmadan sorumlu temel kuvvet hangisidir?', ['Güçlü nükleer', 'Zayıf nükleer'], 1, 'Güneş\'teki füzyon zincirinin başlaması da zayıf kuvvete bağlı.'),
      sikli('Menzili en kısa ama şiddeti en büyük olan kuvvet?', ['Kütle çekim', 'Güçlü nükleer'], 1, 'Çekirdek boyunda etkir, protonları bir arada tutar.'),
      sikli('Sürtünme kuvvetinin kökeni hangi temel kuvvettir?', ['Kütle çekim', 'Elektromanyetik'], 1, 'Temas kuvvetlerinin hepsi atomlar arası elektromanyetik etkileşim.'),
      soru('Elektrik kuvvetleri zıt yüklerle birbirini götürdüğü için büyük ölçekte kütle çekim baskındır.', true, 'Kütle çekim yalnızca çeker ve birikir.'),
    ], [
      {
        soru: 'Menzili sonsuz olup yalnızca çeken temel kuvvet hangisidir?',
        siklar: ['Kütle çekim', 'Elektromanyetik'],
        dogru: 0,
        aciklama: {
          dogru: 'Kütle çekim hep çeker ve menzili sonsuz; bu yüzden büyük ölçekte baskın.',
          yanlis: 'Elektromanyetik kuvvetin de menzili sonsuz ama hem çeker hem iter; yalnızca çeken kütle çekimdir.',
        },
        kart: 2,
      },
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
        'Konum-zaman grafiğinde eğim',
        'Eğim hızı verir: dik doğru hızlı, yatay doğru duran cisim, aşağı inen doğru geri dönüş demektir.',
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
      kart(
        'Hız-zaman grafiğinde alan',
        'Grafiğin altında kalan alan yer değiştirmeyi, eğimi ise ivmeyi verir. Yatay çizgi sabit hız, eğik çizgi sabit ivmedir.',
        undefined,
        { not: 'Grafik sorusunda önce eksenleri oku; eğim mi alan mı istendiğine sonra karar ver.' },
      ),
      kart(
        'Ortalama hız hesabı',
        'Toplam yer değiştirmeyi toplam zamana böl; ara hızların ortalamasını alma. Yolun yarısını 40, yarısını 60 km/h ile giden aracın ortalama sürati 48 km/h çıkar, 50 değil.',
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
      sikli('Hız-zaman grafiğinin altındaki alan neyi verir?', ['İvmeyi', 'Yer değiştirmeyi'], 1, 'Eğim ivmeyi, alan yer değiştirmeyi verir.'),
      sikli('Konum-zaman grafiği parabolse hareket nasıldır?', ['Sabit hızlı', 'Sabit ivmeli'], 1, 'Sabit hızda doğru, sabit ivmede parabol.'),
      sikli('Denge noktası çevresinde gidip gelen sarkacın hareketi?', ['Öteleme', 'Titreşim'], 1, 'Titreşim hareketi; yay ucundaki kütle de böyle.'),
      sikli('Serbest düşmede hava direnci yokken hangi cisim önce yere düşer?', ['Ağır olan', 'İkisi aynı anda'], 1, 'Bütün cisimler aynı g ivmesiyle düşer.'),
      sikli('Yolun yarısını 40, yarısını 60 km/h ile giden aracın ortalama sürati?', ['48 km/h', '50 km/h'], 0, 'Ortalama sürat toplam yol / toplam zaman; ara hızların ortalaması değil.'),
      soru('Sabit süratle yön değiştiren cisim ivmeli hareket yapar.', true, 'Yön değişimi hız değişimidir; ivme sıfır değildir.'),
      soru('Konum-zaman grafiğinde aşağı inen doğru cismin geri döndüğünü gösterir.', true, 'Konum azalıyor: hareket ters yönde.'),
      soru('Referans noktası değişse de bir cismin hareketli olup olmadığı değişmez.', false, 'Hareket görecelidir: yolcu yere göre hareketli, koltuğa göre durgun.'),
    ], [
      {
        soru: 'Sabit süratle dönen pervanenin hareketi nedir?',
        siklar: ['Öteleme, ivmesiz', 'Dönme, ivmeli'],
        dogru: 1,
        aciklama: {
          dogru: 'Pervane eksen çevresinde döner; hızın yönü sürekli değiştiği için hareket ivmelidir.',
          yanlis: 'Ötelemede bütün noktalar aynı yönde kayar. Pervane döner ve yön değiştiği için ivme sıfır değildir.',
        },
        kart: 3,
      },
      {
        soru: 'Konum-zaman grafiği yatay bir çizgiyse cisim ne yapıyor?',
        siklar: ['Sabit hızla gidiyor', 'Duruyor'],
        dogru: 1,
        aciklama: {
          dogru: 'Konum zamanla değişmiyor; eğim sıfır, hız sıfır.',
          yanlis: 'Sabit hız konum-zaman grafiğinde eğik bir doğru olurdu. Yatay çizgi konumun değişmediğini, cismin durduğunu söyler.',
        },
        kart: 6,
      },
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
      kart(
        'Dik duran kutu, yatan kutu',
        'Aynı kutu dar yüzeyi üstünde dururken basıncı büyük, geniş yüzeyi üstündeyken küçüktür; ağırlık ikisinde de aynıdır.',
        undefined,
        { not: 'Kuvvet aynı, alan değişiyor; basınç sorularının çoğu bu cümleden çıkıyor.' },
      ),
    ], [
      soru('Basınç, kuvvetin uygulandığı yüzey alanıyla ters orantılıdır.', true, 'Aynı kuvvet küçük alana uygulanınca basınç büyüyor.'),
      soru('Kar ayakkabısı, kişinin ağırlığını azalttığı için batmayı önler.', false, 'Ağırlık aynı kalıyor; temas alanı büyüdüğü için basınç azalıyor.'),
      soru('Basıncın SI birimi pascaldır.', true, '1 Pa, 1 m² ye uygulanan 1 N luk kuvvet demek.'),
      soru('Bıçağın keskin olması uyguladığı kuvveti artırır.', false, 'Kuvvet aynı; alan küçüldüğü için basınç artıyor.'),
      sikli('Aynı kutu geniş yüzeyi üstüne yatırılınca basıncı ne olur?', ['Azalır', 'Artar'], 0, 'Ağırlık aynı, alan büyüdü; basınç küçüldü.'),
      sikli('Katılar basıncı hangi yönde iletir?', ['Yalnızca aşağı, temas yüzeyine', 'Her yöne eşit'], 0, 'Her yöne ileten sıvı ve gazlar.'),
      sikli('1 Pa neye eşittir?', ['1 N/m²', '1 kg/m²'], 0, 'Basınç kuvvet / alan; birimi newton bölü metrekare.'),
      soru('Çivinin sivri ucu uygulanan kuvveti artırır.', false, 'Kuvvet aynı; alan küçüldüğü için basınç artar.'),
      soru('Kuvvet sabitken basınç-alan grafiği hiperboldür.', true, 'Ters orantı hiperbol çizer.'),
    ], [
      {
        soru: 'Kuvvet sabitken temas alanı yarıya inerse basınç ne olur?',
        siklar: ['İki katına çıkar', 'Yarıya iner'],
        dogru: 0,
        aciklama: {
          dogru: 'P = F / A: payda yarıya inince sonuç iki katına çıkar.',
          yanlis: 'Basınç alanla ters orantılı; alan küçülünce basınç büyür. Bıçağın ince ağzı bu yüzden keser.',
        },
        kart: 3,
      },
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
        'Kabın şekli önemsiz',
        'Tabanı aynı, şekli farklı üç kapta aynı sıvı aynı yükseklikteyse taban basınçları eşittir; kaptaki sıvı miktarı farklı olsa bile.',
        undefined,
        { not: 'Şekli görünce şaşırtmaya çalışıyorlar; sen yalnızca yüksekliğe bak.' },
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
      sikli('Barajın alt duvarı neden daha kalın yapılır?', ['Derinlikle basınç artar', 'Su aşağıda daha yoğundur'], 0, 'P = h·d·g; en derin nokta en büyük basınç.'),
      sikli('Bileşik kapta karışmayan iki sıvıdan hangisi daha yüksekte durur?', ['Yoğunluğu küçük olan', 'Yoğunluğu büyük olan'], 0, 'Aynı basıncı daha uzun sütunla dengeler.'),
      sikli('Hidrolik krikoda kuvvet kazanılırken ne kaybedilir?', ['Yol', 'Basınç'], 0, 'Kazanılan kuvvet kadar yol kaybedilir; iş korunur.'),
      sikli('Tabanı aynı, şekli farklı üç kapta aynı yükseklikte su varsa taban basınçları?', ['Eşit', 'Geniş kapta büyük'], 0, 'Basınç derinliğe bağlı, kabın şekline değil.'),
      soru('Sıvı basıncı yer çekimi ivmesine bağlıdır.', true, 'P = h·d·g; Ay\'da aynı derinlikte basınç daha küçük.'),
      soru('Durgun sıvı basıncı yalnızca aşağı yönde iletir.', false, 'Her yöne aynı şiddette iletir.'),
    ], [
      {
        soru: 'Sıvı basıncı aşağıdakilerden hangisine bağlıdır?',
        siklar: ['Kabın şekline', 'Derinliğe'],
        dogru: 1,
        aciklama: {
          dogru: 'P = h·d·g: derinlik, sıvının yoğunluğu ve yer çekimi. Kabın şekli ve sıvı miktarı işe girmez.',
          yanlis: 'Kabın şekli basıncı değiştirmez; aynı derinlikteki iki nokta hangi kapta olursa olsun aynı basınçtadır.',
        },
        kart: 1,
      },
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
        undefined,
        { not: 'Sayıyı ezberleme; cıva yerine su konsa ne olacağını anlatabiliyor musun?' },
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
      kart(
        'Kapalı kaptaki gaz basıncı',
        'Gaz tanecikleri çarptıkları yüzeye basınç yapar. Sıcaklık artınca ya da hacim küçülünce çarpma sıklaşır, basınç büyür.',
      ),
    ], [
      soru('Deniz seviyesinde açık hava basıncı 76 cm yüksekliğindeki cıva sütununun basıncına eşittir.', true, 'Torricelli deneyinin ölçtüğü değer bu.'),
      soru('Yükseklere çıkıldıkça açık hava basıncı artar.', false, 'Üstteki hava sütunu kısaldığı için basınç azalır.'),
      soru('Yüksek dağlarda su 100 °C nin altında kaynar.', true, 'Açık hava basıncı düştüğü için sıvı daha düşük sıcaklıkta kaynıyor.'),
      soru('Torricelli deneyinde cıva sütununun yüksekliği borunun kesit alanına bağlıdır.', false, 'Kesit değişse de yükseklik değişmez; belirleyen açık hava basıncı.'),
      sikli('Torricelli deneyi su ile yapılsaydı sütun yaklaşık kaç metre olurdu?', ['10 m', '1 m'], 0, 'Su cıvadan 13,6 kat az yoğun; sütun o kadar uzar.'),
      sikli('Uçakta kulak tıkanmasının sebebi?', ['Yükseklikle basıncın düşmesi', 'Sıcaklığın düşmesi'], 0, 'Üstteki hava sütunu kısalır, basınç azalır.'),
      sikli('Kapalı kaptaki gazın sıcaklığı artınca basıncı?', ['Artar', 'Değişmez'], 0, 'Tanecikler çepere daha sık ve hızlı çarpar.'),
      soru('Pipetle içmek açık hava basıncıyla çalışır.', true, 'Pipette basınç düşürülür, dışarıdaki hava sıvıyı iter.'),
      soru('Deniz seviyesinde açık hava basıncı yaklaşık 101.325 Pa\'dır.', true, '1 atm.'),
    ], [
      {
        soru: 'Torricelli deneyinde cıva sütunu deniz seviyesinde kaç cm\'de durur?',
        siklar: ['76 cm', '100 cm'],
        dogru: 0,
        aciklama: {
          dogru: '76 cm cıva sütununun basıncı açık hava basıncını dengeler; 1 atm bu demektir.',
          yanlis: '76 cm. Su kullanılsaydı sütun yaklaşık 10 m olurdu; cıva yoğun olduğu için sütun kısa kalır.',
        },
        kart: 2,
      },
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
        undefined,
        { not: 'Bağlı olmadığı şeyleri de ezberle: derinlik ve kütle çeldirici olarak gelir.' },
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
        'Batan hacim ne kadar?',
        'Yüzen cisimde kaldırma kuvveti ağırlığa eşittir; cismin yoğunluğu sıvınınkinin kaçta kaçıysa hacminin o kadarı batar.',
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
      kart(
        'Tuzlu suda daha kolay yüzülür',
        'Tuz suyun yoğunluğunu artırır, aynı hacme daha büyük kaldırma kuvveti gelir. Aynı cisim tuzlu suda daha az batar.',
      ),
    ], [
      soru('Kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşittir.', true, 'Arşimet ilkesi.'),
      soru('Kaldırma kuvvetinin büyüklüğü cismin kütlesine bağlıdır.', false, 'Batan hacme ve sıvının yoğunluğuna bağlı; aynı hacimli iki cisme aynı kuvvet etkir.'),
      soru('Yoğunluğu içinde bulunduğu sıvıdan küçük olan cisim yüzer.', true, 'Kaldırma kuvveti ağırlıktan büyük olduğu için cisim yukarı itiliyor.'),
      soru('Gazlarda kaldırma kuvveti oluşmaz.', false, 'Balonun yükselmesi havanın uyguladığı kaldırma kuvvetiyle.'),
      sikli('Gemi çelikten yapıldığı hâlde neden yüzer?', ['Çelik sudan hafif', 'Ortalama yoğunluğu suyunkinden küçük'], 1, 'İçi boş olduğu için ortalama yoğunluk düşük.'),
      sikli('Tuzlu suda aynı cisim tatlı suya göre nasıl yüzer?', ['Daha çok batar', 'Daha az batar'], 1, 'Tuz yoğunluğu artırır, aynı hacme daha büyük kaldırma kuvveti gelir.'),
      sikli('Yoğunluğu sıvınınkine eşit cisim ne yapar?', ['Batar', 'Askıda kalır'], 1, 'Kaldırma kuvveti ağırlığa eşit; ne yüzer ne batar.'),
      sikli('Sıvıya batan cisim dinamometrede neden hafif gelir?', ['Kütlesi azalır', 'Kaldırma kuvveti ağırlıktan düşer'], 1, 'Görünen ağırlık = gerçek ağırlık − kaldırma kuvveti.'),
      soru('Yoğunluğu sıvının yarısı olan cismin hacminin yarısı batar.', true, 'Yüzen cisimde kaldırma kuvveti ağırlığa eşit; batan hacim oranı yoğunluk oranı.'),
      soru('Kaldırma kuvveti derinlikle artar.', false, 'Batan hacim ve sıvı yoğunluğuna bağlı; tümüyle batmış cisimde derinlik fark etmez.'),
    ], [
      {
        soru: 'Kaldırma kuvveti hangisine bağlıdır?',
        siklar: ['Batan hacme', 'Cismin kütlesine'],
        dogru: 0,
        aciklama: {
          dogru: 'Kaldırma kuvveti = batan hacim × sıvı yoğunluğu × g. Kütle işe girmez.',
          yanlis: 'Aynı hacimli demir ve tahta tümüyle batınca aynı kaldırma kuvveti alır; belirleyen batan hacim ve sıvının yoğunluğu.',
        },
        kart: 3,
      },
    ]),
    konu('fzk9-bernoulli', 'Bernoulli İlkesi', [
      kart(
        'Temel fikir',
        'Akışkanın sürati arttığı yerde çeperlere yaptığı basınç azalır.',
        undefined,
        { not: 'Tek cümle: hızlanan akışkan basıncı düşer. Örneklerin hepsi bunun tekrarı.' },
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
      sikli('Duş perdesinin içeri çekilmesinin sebebi?', ['Su perdeyi iter', 'Hızlı hava basıncı düşürür'], 1, 'Hızlanan hava akımı basıncı düşürür, dışarıdaki hava perdeyi iter.'),
      sikli('Bacada rüzgâr dumanı neden yukarı çeker?', ['Rüzgâr dumanı iter', 'Baca ağzında basınç düşer'], 1, 'Bernoulli: hızlı akışkan düşük basınç.'),
      soru('Uçak kanadının altında hava üstünden daha hızlı akar.', false, 'Üstte hızlı akar, basınç düşer; alttaki yüksek basınç kanadı yukarı iter.'),
    ], [
      {
        soru: 'Boru daralınca içinden geçen suyun hızı ve basıncı ne olur?',
        siklar: ['Hız artar, basınç düşer', 'Hız azalır, basınç artar'],
        dogru: 0,
        aciklama: {
          dogru: 'Süreklilik hızı artırır, Bernoulli hızlı akışkanda basıncı düşürür.',
          yanlis: 'Dar kesitten aynı miktar su aynı sürede geçmek zorunda, o yüzden hızlanır; hızlanan akışkanın basıncı düşer.',
        },
        kart: 2,
      },
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
        { not: 'Kıvılcım ve kazan örneğini kendi cümlelerinle anlatmadan geçme.' },
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
      kart(
        'Isı ve sıcaklık birimleri',
        'Isı bir enerjidir, birimi joule (J) ya da kalori (cal); 1 cal ≈ 4,18 J. Sıcaklık ise °C ya da K ile ölçülür, enerji birimi taşımaz.',
      ),
    ], [
      soru('Isı, sıcaklık farkı nedeniyle bir yerden başka yere aktarılan enerjidir.', true, 'Isı bir enerji aktarımı; cisimde "depolanan" şey iç enerji.'),
      soru('Bir kıvılcımın sıcaklığı kazandaki sudan yüksek olsa bile iç enerjisi düşüktür.', true, 'İç enerji tanecik sayısına da bağlı; kıvılcımda tanecik az.'),
      soru('Isı, iç enerjisi büyük olan cisimden küçük olana akar.', false, 'Aktarım yönünü iç enerji değil sıcaklık belirler.'),
      soru('Sıcaklık, cismin sahip olduğu toplam enerjidir.', false, 'Sıcaklık taneciklerin ortalama kinetik enerjisinin ölçüsü; toplam olan iç enerji.'),
      sikli('Isının SI birimi nedir?', ['Kelvin', 'Joule'], 1, 'Isı enerjidir; kelvin sıcaklık birimi.'),
      sikli('0 K kaç °C\'dir?', ['0', '−273,15'], 1, 'Kelvin mutlak sıfırdan başlar.'),
      sikli('Isı hangi yönde akar?', ['İç enerjisi büyükten küçüğe', 'Sıcaktan soğuğa'], 1, 'Yönü sıcaklık farkı belirler.'),
      soru('Madde ısı içerir; ısıtılan cisimde ısı depolanır.', false, 'Depolanan iç enerjidir; ısı yalnızca aktarım sırasında vardır.'),
      soru('1 kalori yaklaşık 4,18 joule\'dür.', true, 'İki birim aynı şeyi, enerjiyi ölçer.'),
    ], [
      {
        soru: 'Kaynayan bir çay bardağı ile kaynayan bir kazanı karşılaştırırsak?',
        siklar: ['Sıcaklık aynı, iç enerji farklı', 'İkisi de aynı'],
        dogru: 0,
        aciklama: {
          dogru: 'İkisi de 100 °C ama kazanda daha çok tanecik var; toplam enerji, yani iç enerji, kazanda daha büyük.',
          yanlis: 'Sıcaklık ortalama enerjiyi ölçer ve ikisinde eşit; iç enerji toplam enerjidir ve tanecik sayısıyla büyür.',
        },
        kart: 5,
      },
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
        undefined,
        { not: 'Biri maddeye, öteki cisme ait; hangisinin kütleyle değiştiğini sor.' },
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
      kart(
        'Öz ısı küçük olan çabuk ısınır',
        'Aynı ısı verilen eşit kütleli iki maddeden öz ısısı küçük olanın sıcaklığı daha çok artar; demir bu yüzden sudan önce ısınır ve önce soğur.',
      ),
    ], [
      soru('Suyun öz ısısının yüksek olması, geç ısınıp geç soğumasının sebebidir.', true, 'Aynı sıcaklık artışı için daha çok ısı gerekiyor.'),
      soru('Isı sığası kütleye bağlıdır, öz ısı ise maddenin ayırt edici bir özelliğidir.', true, 'Isı sığası = kütle × öz ısı.'),
      soru('Q = m · c · ΔT bağıntısında c kütleyi gösterir.', false, 'c öz ısı, m kütle.'),
      soru('Aynı maddeden yapılmış iki cismin öz ısıları kütleleriyle orantılıdır.', false, 'Öz ısı maddeye ait; kütle değişse de aynı kalır.'),
      sikli('Aynı ısı verilen eşit kütleli demir ve suyun hangisi daha çok ısınır?', ['Demir', 'Su'], 0, 'Öz ısısı küçük olan aynı ısıyla daha çok ısınır.'),
      sikli('Sıcaklık-ısı grafiğinde yatık doğru neyi gösterir?', ['Büyük öz ısı', 'Küçük öz ısı'], 0, 'Aynı ısıyla sıcaklık az artıyor.'),
      sikli('Q = m·c·ΔT bağıntısında ΔT nedir?', ['Sıcaklık farkı', 'Zaman farkı'], 0, 'Alınan ısı kütle, öz ısı ve sıcaklık farkının çarpımı.'),
      soru('Denizin kıyı havasını yumuşatması suyun öz ısısının yüksekliğindendir.', true, 'Su geç ısınır geç soğur.'),
      soru('Isı sığası maddeye ait ayırt edici bir özelliktir.', false, 'Ayırt edici olan öz ısı; ısı sığası o cisme ait, kütleyle büyür.'),
    ], [
      {
        soru: 'Kütlesi iki katına çıkan bir cismin öz ısısı ne olur?',
        siklar: ['İki katına çıkar', 'Değişmez'],
        dogru: 1,
        aciklama: {
          dogru: 'Öz ısı maddeye ait ayırt edici özellik; kütleyle değişen ısı sığasıdır.',
          yanlis: 'İki katına çıkan ısı sığasıdır (m·c). Öz ısı maddenin cinsine bağlıdır, kütleyle değişmez.',
        },
        kart: 4,
      },
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
        { not: 'Grafikte yatay çizgi gördüğünde hâl değişiyor demek; ısı boşa gitmiyor.' },
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
      kart(
        'Kaynama noktası basınca bağlı',
        'Basınç artınca kaynama noktası yükselir: düdüklü tencerede su 100 °C\'nin üstünde kaynar ve yemek çabuk pişer.',
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
      sikli('Katıdan doğrudan gaza geçişe ne denir?', ['Süblimleşme', 'Yoğuşma'], 0, 'Naftalin ve kuru buz süblimleşir.'),
      sikli('Düdüklü tencerede yemek neden çabuk pişer?', ['Basınç artınca kaynama noktası yükselir', 'Su daha çabuk kaynar'], 0, 'Su 100 °C\'nin üstünde kaynar.'),
      sikli('Terin buharlaşması vücudu neden serinletir?', ['Buharlaşma ısısı deriden çekilir', 'Ter soğuktur'], 0, 'Buharlaşmak için gereken ısı deriden alınır.'),
      sikli('Hangisi buharlaşmayı yavaşlatır?', ['Nemli hava', 'Hava akımı'], 0, 'Sıcaklık, yüzey ve rüzgâr hızlandırır; nem yavaşlatır.'),
      soru('1 gram maddeyi eritmek için gereken ısı, donarken verdiği ısıya eşittir.', true, 'Erime ısısı ile donma ısısı eşit.'),
    ], [
      {
        soru: 'Erimekte olan buza ısı verilince sıcaklığı ne olur?',
        siklar: ['Sabit kalır', 'Artar'],
        dogru: 0,
        aciklama: {
          dogru: 'Hâl değişimi boyunca verilen ısı bağları koparmaya gider; sıcaklık buz bitene kadar 0 °C\'de durur.',
          yanlis: 'Hâl değişirken sıcaklık sabit kalır. Grafikte yatay bölüm tam bu: ısı alınıyor ama sıcaklık artmıyor.',
        },
        kart: 1,
      },
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
        undefined,
        { not: 'Ortalama alıp cevabı işaretleme; öz ısılar farklıysa denge kaydırılır.' },
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
      sikli('Isıl dengede ne durur?', ['Taneciklerin hareketi', 'Net ısı akışı'], 1, 'Alışveriş iki yöne eşitlenir; tanecikler durmaz.'),
      sikli('Kütlesi büyük olan cisim denge sıcaklığını nasıl etkiler?', ['Etkilemez', 'Dengeyi kendine yaklaştırır'], 1, 'Kütlesi ve öz ısısı büyük olana yakın çıkar.'),
      soru('Yalıtılmış kapta sıcak cismin verdiği ısı soğuk cismin aldığına eşittir.', true, 'Enerji dışarı kaçmıyorsa alınan = verilen.'),
    ], [
      {
        soru: '80 °C su ile 20 °C su eşit kütlede karıştırılırsa denge sıcaklığı?',
        siklar: ['50 °C', '60 °C'],
        dogru: 0,
        aciklama: {
          dogru: 'Aynı madde, eşit kütle: alınan ısı verilen ısıya eşit, sonuç tam ortada.',
          yanlis: 'Kütleler ve öz ısılar eşit olduğu için sıcaklıklar ortada buluşur: 50 °C. Ortadan kayma yalnızca kütle ya da madde farklıysa olur.',
        },
        kart: 3,
      },
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
        undefined,
        { not: 'Termos üç yolu nasıl kesiyor, kendine anlat; üç yol tek örnekte oturur.' },
      ),
      kart(
        'Sıcak hava neden yükselir?',
        'Isınan hava genleşir, yoğunluğu azalır ve kaldırma kuvvetiyle yükselir. Klimanın yukarıya, kaloriferin aşağıya konması bu yüzden.',
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
      sikli('Metal kaşığın sıcak çayda ısınması hangi yolla olur?', ['İletim', 'Işıma'], 0, 'Tanecikler titreşerek enerjiyi komşusuna aktarır.'),
      sikli('Termosun aynalı iç yüzeyi hangi aktarımı keser?', ['Işıma', 'Konveksiyon'], 0, 'Parlak yüzey ışımayı yansıtır; boşluk iletim ve konveksiyonu keser.'),
      sikli('Klima neden yukarıya konur?', ['Soğuk hava aşağı iner', 'Soğuk hava yükselir'], 0, 'Sıcak hava yükselir, soğuk iner; klima yukarıdan, kalorifer aşağıdan çalışır.'),
      soru('Parlak ve açık renkli yüzeyler ışımayı iyi soğurur.', false, 'Koyu ve mat yüzeyler soğurur; parlak yüzey yansıtır.'),
      soru('Işıma için madde ortamı gerekmez.', true, 'Enerji elektromanyetik dalgayla taşınır; uzay boşluğunu geçer.'),
    ], [
      {
        soru: 'Kaloriferin odayı ısıtması hangi yolla olur?',
        siklar: ['Konveksiyon', 'İletim'],
        dogru: 0,
        aciklama: {
          dogru: 'Isınan hava yükselir, soğuyan iner; odayı dolaşan havanın kendisi ısıyı taşır.',
          yanlis: 'İletimde tanecikler yer değiştirmez. Odada havanın kendisi dolaşarak ısıyı taşır, bu konveksiyondur.',
        },
        kart: 3,
      },
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
        undefined,
        { not: 'Elin sıcaklığı değil, ısının akış hızını ölçüyor; bu farkı unutma.' },
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
      sikli('Duvarın kalınlaştırılması ısı kaybını neden azaltır?', ['Yol uzayınca iletim yavaşlar', 'Duvar daha soğuk olur'], 0, 'İletim hızı uzunlukla ters orantılı.'),
      sikli('Çift camda yalıtımı sağlayan nedir?', ['Aradaki durgun hava', 'Camın kalınlığı'], 0, 'Hava kötü iletken; boşluk yalıtır, cam değil.'),
      sikli('Kesit alanı iki katına çıkan çubukta iletim hızı?', ['İki katına çıkar', 'Yarıya iner'], 0, 'Kesit alanıyla doğru orantılı.'),
      soru('İki uç arasındaki sıcaklık farkı sıfırsa ısı akışı durur.', true, 'Akışı süren şey sıcaklık farkı.'),
      soru('Yün kumaş ısıyı iyi ilettiği için ısıtır.', false, 'Yün arasında tuttuğu havayla yalıtır; ısı kaybını yavaşlatır.'),
    ], [
      {
        soru: 'Aynı sıcaklıktaki metal ve tahta elde neden farklı hissedilir?',
        siklar: ['Metalin sıcaklığı düşüktür', 'Metal ısıyı hızlı iletir'],
        dogru: 1,
        aciklama: {
          dogru: 'Metal elden ısıyı hızla çeker; his sıcaklıktan değil iletim hızından geliyor.',
          yanlis: 'İkisi odayla ısıl dengede, sıcaklıkları aynı. Fark iletim hızında: metal elden ısıyı hızla alır.',
        },
        kart: 5,
      },
    ]),
  ]),
])
