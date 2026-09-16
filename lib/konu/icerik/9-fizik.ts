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
      Bu konu, kart etiketi / Rabi notu / hızlı kontrol alanlarının ilk
      **örneği**: tasarım (`tasarim/bilgi-karti.html`) bu konu üstünden
      çizildi. Metinler sonradan `docs/kart-yazim-rehberi.md`ne göre yeniden
      yazıldı; Rabi notu artık her konuda **bir** kartta (bkz. `tip.ts`).
    */
    konu('fzk9-bilim', 'Fizik Bilimi', [
      kart(
        'Fizik madde ve enerjiyi inceler',
        'Top neden düşer, buz neden erir, ışık neden kırılır? Hepsi fiziğin sorusu. Fizik, yani madde ile enerjiyi ve aralarındaki etkileşimi inceleyen bilim. Cevabı sayıyla vermeye çalışır: "düşer" değil, "9,8 m/s² ile düşer".',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Bilim gözlemle başlar, deneyle sınanır',
        'Bıraktığın taş düşer: bu bir gözlem. "Ağır taş daha hızlı düşer" dersin: bu bir hipotez, yani sınanacak tahmin. İki taşı aynı anda bırakırsın: bu deney. Deney tahmini tutmazsa tahmini değiştirirsin; sonuç değil, tahmin gider.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Gözlem' },
            { ad: 'Hipotez' },
            { ad: 'Deney' },
            { ad: 'Kuram' },
          ],
        },
      ),
      kart(
        'Model, gerçeğin sadeleştirilmiş hâlidir',
        'Top atma sorusunda hava direncini yok sayarsın. Bu bir model, yani gerçeğin işe yarayan parçalarını tutan basit hâli. "Sürtünmesiz ortam" bir yalan değil, bilinçli bir sadeleştirme. Deneyle çelişen model ne kadar güzel olsa da bırakılır.',
      ),
      kart(
        'Hipotez, kuram ve yasa ayrı işler yapar',
        '"Bırakılan taş düşer" bir yasa, yani hep olan şeyi kısaca söyleyen kural. Neden düştüğünü kütle çekim kuramı açıklar; kuram, çok kez sınanmış açıklama. Hipotez ise henüz sınanmamış tahmin. Kuram güçlenince yasaya dönüşmez.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne yapar?', 'Örnek'],
          satirlar: [
            ['Hipotez', 'Sınanmayı bekler', '"Ağır taş hızlı düşer"'],
            ['Yasa', 'Ne olduğunu söyler', 'Taş düşer'],
            ['Kuram', 'Nedenini açıklar', 'Kütle çekimi'],
          ],
        },
        { etiket: 'Sık hata' },
      ),
      kart(
        'Bilimsel bilgi yeni kanıtla değişir',
        'Yüz yıl önce atomun bölünmez olduğu sanılıyordu. Sonra çekirdek ve elektron bulundu, ders kitapları değişti. Yeni bir gözlem eski bilgiyi düzeltir. Bu zayıflık değil; yöntemin çalıştığını gösterir.',
      ),
      kart(
        'Formül bir cümlenin kısaltmasıdır',
        '"Hız, yolun zamana bölümüdür" cümlesi v = x / t diye yazılır. Matematik fiziğin dili. Cümleyle yalnızca anlatırsın; formülle hesap yapar, tahmin edersin: 2 saatte kaç km gider? Cümlesini anlamadan formül ezberleme.',
      ),
      kart(
        'Her ölçümün bir belirsizliği vardır',
        'Cetvelle masayı ölçtün: 80 cm. Ama cetvelin en küçük çizgisi 1 mm; gerçek 80,1 de olabilir. Buna belirsizlik denir. Fizikçi sonucu belirsizliğiyle yazar: 80,0 ± 0,1 cm. Birim de şart; birimsiz sayı bilgi değil.',
        undefined,
        { not: 'Soruda birimler tutmuyorsa (m ile km karışmışsa) işlem de tutmuyordur; önce birimi düzelt.' },
      ),
      kart(
        'Kimya ve biyoloji fizik yasasına dayanır',
        'Pil, elektronların bir maddeden ötekine geçmesiyle çalışır: bu fizik. Sinir hücresi elektrik sinyaliyle konuşur: bu da fizik. Fizik öteki doğa bilimlerinin temelini kurar. Dersler ayrı ama doğa ayrı değil.',
      ),
    ], [
      soru('Bir kuram yeterince kanıt toplayınca yasaya dönüşür.', false, 'Yasa olayın ne olduğunu söyler, kuram nedenini açıklar; biri ötekinin ileri hâli değil.'),
      soru('Bıraktığın taşın düştüğünü görmek bir gözlemdir.', true, 'Gözlem başlangıç; sonra tahmin (hipotez) ve deney gelir.'),
      soru('Model, gerçeğin bütün ayrıntılarını taşıyan birebir kopyasıdır.', false, 'Model gerçeği basitleştirir; yalnızca işe yarayacak ayrıntıları tutar.'),
      soru('Fizik, öteki doğa bilimlerinin dayandığı temel yasaları da inceler.', true, 'Pilin çalışması da sinir hücresinin sinyali de fizik yasalarıyla açıklanıyor.'),
      sikli('Sınanmayı bekleyen tahmine ne denir?', ['Hipotez', 'Yasa'], 0, 'Hipotez henüz sınanmamış tahmin; yasa hep olan şeyi söyleyen kural.'),
      sikli('Deneyle çelişen bir model için ne yapılır?', ['Bırakılır ya da düzeltilir', 'Deney tekrar edilene kadar korunur'], 0, 'Model gerçeğin sadeleştirilmiş hâli; deneyle çelişince güzel olsa da bırakılır.'),
      sikli('Bir ölçüm sonucu nasıl verilmelidir?', ['Belirsizliğiyle birlikte', 'Yalnızca sayı olarak'], 0, 'Her ölçümün belirsizliği vardır; onu yazmamak sonucu olduğundan kesin gösterir.'),
      soru('Bilimsel bilginin yeni gözlemle değişmesi yöntemin zayıflığını gösterir.', false, 'Tam tersi: kendini düzeltebilmek yöntemin işlediğinin kanıtı.'),
      soru('Matematik, fizik yasasını tahmin yapabilir hâle getiren dildir.', true, 'Cümleyle anlatılan yasa formüle dönmeden hesap ve tahmin üretemez.'),
    ], [
      {
        soru: 'Bilimsel yöntemde deney neyi sınar?',
        siklar: ['Kurulan hipotezi', 'Ölçüm biriminin adını'],
        dogru: 0,
        aciklama: {
          dogru: 'Aynen öyle. Gözlem soruyu doğurur, hipotez bir tahmindir; deney o tahmini sınar ve tutmazsa tahmin değişir.',
          yanlis: 'Tam değil. Deney, kurulan hipotezi sınar. Birim seçimi ölçmeyi karşılaştırılabilir kılar ama sınanan şey tahmindir.',
        },
        kart: 2,
      },
    ]),
    konu('fzk9-altdal', 'Fizik Biliminin Alt Dalları', [
      kart(
        'Mekanik hareket eden her şeye bakar',
        'Bisiklet neden ilerler, köprü neden ayakta durur, Ay neden düşmez? Hepsi mekaniğin sorusu. Mekanik, yani kuvvet, hareket ve dengeyi inceleyen dal. Duran cisim de konusu; durmak hareketin özel bir hâli.',
      ),
      kart(
        'Termodinamik ısının nereye gittiğine bakar',
        'Buzdolabı içindeki ısıyı alır, arkasından dışarı atar. Araba motoru yakıtın ısısını harekete çevirir. Termodinamik, yani ısı ve enerji dönüşümlerini inceleyen dal. İklim modelleri de buradan çıkar.',
      ),
      kart(
        'Optik ışığın yolunu izler',
        'Gözlük camı ışığı kırar, ayna yansıtır, fiber kablo ışığı içinde taşır. Optik, yani ışığın yayılması, kırılması ve yansımasını inceleyen dal. Kamera ve teleskop da optiğin ürünü.',
      ),
      kart(
        'Elektrik ve manyetizma tek çatı altında',
        'Elektrik motorunda akım bir mıknatısı döndürür. Radyo dalgası antene gelince akım oluşur. Elektromanyetizma, yani elektrik ile manyetizmayı birlikte inceleyen dal. İkisi ayrı olay değil, aynı olayın iki yüzü.',
      ),
      kart(
        'Ses de deprem de dalgadır',
        'Gitar teli havayı titretir: ses dalgası. Yer sarsılır: deprem dalgası. Havuza taş atarsın: su dalgası. Üçü aynı matematikle incelenir. Bu dala dalga mekaniği denir; ses kısmına akustik.',
      ),
      kart(
        'Katıhâl fiziği telefonunun çipini yaptı',
        'Telefonundaki işlemci silisyumdan yapılır. Silisyum bir yarı iletken, yani elektriği bazen ileten bazen iletmeyen madde. Katıhâl fiziği katı maddelerin bu tür davranışlarını inceler. Bütün elektronik buradan çıktı.',
      ),
      kart(
        'Modern fizik çok küçükte ve çok hızlıda',
        'Atomun içindeki elektron top gibi davranmaz. Işık hızına yakın giden bir araçta zaman yavaşlar. Klasik kurallar burada tutmaz. Modern fizik, yani kuantum fiziği ve görelilik, bu olayları inceler.',
      ),
      kart(
        'Klasik fizik yanlış değil, sınırlıdır',
        'Arabanın fren mesafesini Newton\'un yasalarıyla doğru hesaplarsın. Aynı yasalar elektron için yanlış cevap verir. Klasik fizik günlük hız ve boyutta doğru sonuç verir. "Klasik, yani eski ve yanlış" sanma.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Her dalı bir soruyla eşle',
        'Dalları liste gibi ezberleme. Sınavda bir örnek verilir, "hangi dal" diye sorulur. Önce örneğin hangi soruyu sorduğuna bak: hareket mi, ısı mı, ışık mı, yük mü?',
        {
          tur: 'tablo',
          basliklar: ['Soru', 'Dal'],
          satirlar: [
            ['Cisim nasıl hareket eder?', 'Mekanik'],
            ['Isı nereye gider?', 'Termodinamik'],
            ['Işık ne yapar?', 'Optik'],
            ['Yük ne yapar?', 'Elektromanyetizma'],
          ],
        },
        { not: 'Buzdolabı, motor, klima gördüğünde "ısı nereye gidiyor" diye sor; cevap termodinamik.' },
      ),
    ], [
      soru('Termodinamik, ısı ve sıcaklıkla ilgili olayları inceler.', true, 'Isı alışverişi, hâl değişimi ve enerji dönüşümleri bu alanın konusu.'),
      soru('Atom altı parçacıkların davranışı klasik fiziğin konusudur.', false, 'Modern fiziğin: kuantum kuramı ve görelilik burada devreye giriyor.'),
      soru('Yarı iletkenlerin davranışı katıhâl fiziğinin konusudur.', true, 'Katıhâl fiziği katı maddelerin yapısını ve elektriksel davranışını inceliyor.'),
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
        'Arşimet küvette hafiflediğini fark etti',
        'Küvete girince taşan suya bakan Arşimet şunu buldu: suya batan cisim, taşırdığı su kadar hafifler. Buna kaldırma kuvveti denir. Kaldıraç ilkesini de o buldu: uzun kol az kuvvetle ağır yük kaldırır.',
      ),
      kart(
        'Galileo deneyi fiziğin merkezine koydu',
        'Herkes ağır taşın hızlı düştüğünü sanıyordu. Galileo bunu düşünmedi, denedi: hava direnci yoksa ağır ve hafif cisim aynı anda düşer. Fizikte bir şeyi söylemek yetmez, deneyle göstermek gerekir; bu alışkanlık onunla başladı.',
      ),
      kart(
        'Newton elma ile Ay\'ı aynı yasaya bağladı',
        'Elmayı yere düşüren kuvvetle Ay\'ı yörüngede tutan kuvvet aynı: kütle çekimi. Newton bunu gösterdi. Üç hareket yasasını da o yazdı. Gökteki ve yerdeki hareket aynı kurala uyuyor; öncesinde ikisi ayrı sanılıyordu.',
      ),
      kart(
        'Faraday deneyle gösterdi, Maxwell yazdı',
        'Faraday bir mıknatısı bobinin içinde hareket ettirdi ve telde akım oluştu. Elektrik ile manyetizmanın bağını böyle deneyle gösterdi. Maxwell bu bağı dört denklemle yazdı. Biri deneyi, öteki matematiği yaptı.',
      ),
      kart(
        'Tesla evine gelen elektriği tasarladı',
        'Prizindeki elektrik yönü sürekli değişen akım, yani alternatif akım. Bu sistemi Tesla geliştirdi. Elektriği uzağa taşımayı sağlayan transformatörü ve motoru da o tasarladı. Bugünkü şebekenin temeli onun işi.',
      ),
      kart(
        'Einstein: zaman herkes için aynı akmaz',
        'Çok hızlı giden bir uzay aracında saat, yerdekine göre yavaş işler. Einstein bunu görelilik kuramıyla gösterdi: zaman ve uzay mutlak değil. Enerji ile kütlenin bağını da o kurdu: E = mc².',
      ),
      kart(
        'Marie Curie iki dalda Nobel aldı',
        'Bazı maddeler kendiliğinden ışın yayar; buna radyoaktivite denir. Curie bu ışınları inceledi ve iki yeni element buldu: polonyum ve radyum. Biri fizik, biri kimya olmak üzere iki ayrı dalda Nobel alan ilk kişi.',
      ),
      kart(
        'İbn Heysem görmeyi doğru açıkladı',
        'Eskiden gözden çıkan ışınların cisme değerek görmeyi sağladığı sanılıyordu. İbn Heysem tersini gösterdi: ışık cisimden çıkar, göze gelir. Karanlıkta görememen bu yüzden. Optiğin kurucusu sayılır.',
        undefined,
        { not: 'İsimleri değil, her birinin fiziğe kattığı tek cümleyi tut: "Galileo deney, Newton çekim, Heysem görme yönü."' },
      ),
      kart(
        'Feza Gürsey: Türkiye\'den bir fizikçi',
        'Feza Gürsey, atomdan küçük parçacıkların kurallarını inceledi. Parçacık fiziğinde simetri kuramlarıyla, yani parçacıkların düzen kalıplarıyla tanınır. Adı bugün uluslararası bir araştırma ödülünde yaşıyor.',
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
        'Fizikçi hastanede de fabrikada da çalışır',
        'MR cihazını ayarlayan, güneş paneli tasarlayan, radar geliştiren, uçak kanadı test eden: hepsi fizik okumuş olabilir. Fizik mezunu sağlık, enerji, savunma, yarı iletken ve havacılıkta çalışır. Bir de araştırma merkezleri var.',
      ),
      kart(
        'Fizik mühendisliği ayrı bir bölümdür',
        'Barkod okuyucudaki lazeri, telefonundaki hareket sensörünü, teleskoptaki merceği kim tasarlar? Fizik mühendisi. Fizik mühendisliği, yani fiziği doğrudan sanayide ürüne çeviren bölüm. Üniversitede fizikten ayrı bir bölüm.',
      ),
      kart(
        'Medikal fizikçi ışın dozunu ayarlar',
        'Kanser hastasına ışın tedavisi verilirken doz azsa tümör ölmez, çoksa sağlam doku zarar görür. Doğru dozu medikal fizikçi hesaplar. Röntgen ve MR cihazlarının da doğru çalışmasını sağlar. Hastane ekibinin bir üyesi.',
      ),
      kart(
        'Yeni malzeme fizik ile kimyanın kesişimi',
        'Daha hızlı işlemci daha küçük yarı iletken ister; daha hafif uçak daha dayanıklı alaşım ister. Yeni malzeme geliştirmek fizik ile kimyanın kesiştiği yer. İşlemci üretimi de bu alanın işi.',
      ),
      kart(
        'Araştırma merkezi: yeni bilgi üretilen yer',
        'Türkiye\'de TÜBİTAK ve üniversite laboratuvarları, dünyada CERN gibi merkezler var. CERN, yani parçacıkları çarpıştırıp atomun içine bakan dev laboratuvar. Türkiye CERN\'e ortak üye; Türk fizikçiler orada çalışıyor.',
      ),
      kart(
        'Hava tahminini de depremi de fizik modeller',
        'Yarın yağmur yağacak mı? Meteorolog atmosferi fizik denklemleriyle modelleyip cevap verir. Fay hattı ne kadar gerildi? Jeofizikçi yer kabuğunu aynı yolla inceler. Deprem araştırmaları jeofiziğin işi.',
      ),
      kart(
        'Banka ve yazılım şirketi de fizikçi alır',
        'Fizik okuyan kişi veriye bakmayı ve modelleme yapmayı öğrenir. Borsa hareketini tahmin eden banka da oyun motoru yazan şirket de bunu ister. Bu yüzden finans ve yazılım da fizikçi çalıştırır.',
      ),
      kart(
        'Bugünkü ders yarınki mesleğe açılır',
        'Bu yıl hangi konuyu sevdiysen ona bakan meslek var. Bu kart seçim yaptırmak için değil; dersle meslek arasındaki bağı görmen için.',
        {
          tur: 'tablo',
          basliklar: ['Ders konusu', 'Meslek alanı'],
          satirlar: [
            ['Mekanik', 'Makine, inşaat'],
            ['Elektromanyetizma', 'Elektrik-elektronik'],
            ['Modern fizik', 'Nükleer, malzeme'],
            ['Optik', 'Görüntüleme'],
          ],
        },
        { not: 'Bir meslek sorulduğunda "hangi fizik konusunu kullanıyor" diye sor; cevap çoğu zaman tabloda.' },
      ),
    ], [
      soru('Medikal fizik uzmanı, hastanelerdeki ışın tedavisi cihazlarının doğru çalışmasıyla ilgilenir.', true, 'Doz hesabı ve cihaz denetimi bu uzmanlığın işi.'),
      soru('Fizik mezunları yalnızca üniversitede akademisyen olarak çalışabilir.', false, 'Sanayi, hastane, meteoroloji ve araştırma merkezleri de çalışma alanı.'),
      soru('Meteoroloji ve jeofizik, fizik bilgisinin kullanıldığı alanlardır.', true, 'Atmosfer olayları da yer kabuğu hareketleri de fiziksel yasalarla inceleniyor.'),
      soru('Yarı iletken üretimi fizikle ilgisi olmayan bir sanayi dalıdır.', false, 'Fizik ile kimyanın kesiştiği malzeme alanının doğrudan işi.'),
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
        'Ölçebildiğin her şey bir niceliktir',
        'Boyun 170 cm, çantan 3 kg, teneffüs 10 dakika. Uzunluk, kütle ve zaman birer nicelik, yani ölçülebilen özellik. Ölçmek, niceliği bir birimle karşılaştırmak: 170 cm demek "1 cm\'nin 170 katı" demek.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yedi temel nicelik başka şeyden türemez',
        'Uzunluğu başka bir şeyden hesaplayamazsın; ölçersin. Böyle yedi nicelik var ve bunlara temel nicelik denir. Dünyanın ortak birim sistemi SI, yedisine birer birim vermiştir; geri kalan her şey bunlardan kurulur.',
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
        'Türetilmiş nicelik temel olanlardan kurulur',
        'Hız için uzunluğu zamana bölersin: m/s. Alan için uzunluğu uzunlukla çarparsın: m². İkisi de türetilmiş nicelik, yani temel niceliklerden çarpma ve bölmeyle elde edilen nicelik. Kuvvet ve enerji de böyle.',
      ),
      kart(
        'Newton ve joule de temel birimlerden kurulu',
        'Kuvvetin birimi newton kısa bir ad; açılımı kg·m/s². Enerjinin birimi joule = N·m, gücün birimi watt = J/s. Sık kullanılanlar: alan m², hacim m³, yoğunluk kg/m³, ivme m/s². Kısa ad yeni bir temel birim değil.',
      ),
      kart(
        'Birimsiz sayı bilgi değildir',
        '"Hız 5" ne demek? 5 m/s mi, 5 km/h mi? 1999\'da bir Mars sondası tam bu yüzden kaybedildi: bir ekip newton, öteki pound ile hesapladı. Sayının yanına birimini yazmadan sonuç verme.',
      ),
      kart(
        'Ön ek, birimin katını söyler',
        '1 kilometre 1000 metre: "kilo" bin katı demek. Santi yüzde bir, mili binde bir, mikro milyonda bir, nano milyarda bir. Hesaba girmeden önce birimleri eşitle: 2 km ile 300 m toplanacaksa ikisini de metre yap.',
      ),
      kart(
        'İki tarafın birimi tutmalı',
        'Bir arkadaşın "yol = hız × zaman²" yazmış. Sağ taraf (m/s)·s² = m·s çıkar; sol taraf metre. Birimler tutmuyor, denklem kesin yanlış. Buna boyut denetimi denir; hesabı yapmadan hatayı yakalar.',
        undefined,
        { not: 'Sınavda çıkmaza girdiğinde ilk yapacağın şey bu: yazdığın formülde birimler tutuyor mu?' },
      ),
      kart(
        'Alan çevirirken çarpanı iki kez uygula',
        '1 m = 100 cm; ama 1 m² = 100 × 100 = 10⁴ cm². Çünkü iki kenar da çevrilir. Hacimde üç kez: 1 m³ = 10⁶ cm³. Hız için ezberle: 1 m/s = 3,6 km/h; 72 km/h demek 20 m/s demek.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Kütlenin SI birimi gramdır.', false, 'SI temel birimi kilogram; gram onun binde biri.'),
      soru('Hız türetilmiş bir niceliktir.', true, 'Uzunluk ve zaman gibi temel niceliklerden türüyor.'),
      soru('1 nanometre, metrenin milyarda biridir.', true, 'nano ön eki milyarda bir demek.'),
      soru('Bir denklemin iki tarafının birimleri farklı olabilir.', false, 'Boyut denetimi tutmuyorsa denklem yanlıştır.'),
      sikli('Kuvvetin SI birimi olan newton hangi temel birimlerden türer?', ['kg·m/s', 'kg·m/s²'], 1, 'Kuvvet = kütle × ivme; ivme m/s².'),
      sikli('1 m² kaç cm²\'dir?', ['10²', '10⁴'], 1, 'Çarpan iki kez uygulanır: 100 × 100 = 10.000.'),
      sikli('72 km/h kaç m/s\'dir?', ['72', '20'], 1, '1 m/s = 3,6 km/h; 72 / 3,6 = 20.'),
      sikli('"mikro" ön eki neyi gösterir?', ['Binde biri', 'Milyonda biri'], 1, 'mili binde bir, mikro milyonda bir.'),
      soru('1999\'da bir Mars sondası birim karışıklığı yüzünden kaybedilmiştir.', true, 'Bir ekip newton, öteki pound kullandı; birim tutmayınca hesap da tutmadı.'),
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
        'Skaler nicelik yalnızca sayıyla anlatılır',
        '"Çantam 3 kg" dediğinde herkes anlar; "hangi yönde" diye soran olmaz. Kütle skaler bir nicelik, yani yalnızca büyüklüğü olan nicelik. Zaman, sıcaklık, sürat ve enerji de skaler.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Vektörel nicelikte yön de söylenir',
        '"Kapıyı 10 N ile ittim" eksik; içeri mi dışarı mı? Kuvvet vektörel bir nicelik, yani büyüklüğüyle birlikte yönü de gereken nicelik. Hız, ivme ve yer değiştirme de vektörel. Tabloda her skalerin vektörel eşi var.',
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
        'Yol gidilen çizgi, yer değiştirme oktur',
        'Okuldan eve 800 m yürüdün ama ev okula kuş uçuşu 500 m. Yol 800 m: gittiğin bütün çizginin uzunluğu, skaler. Yer değiştirme 500 m ve okuldan eve doğru: başlangıçtan bitişe çizilen ok, vektörel.',
      ),
      kart(
        'Sürat yola, hız yer değiştirmeye bakar',
        'Pistte tam tur atan araç 2 dakikada 1 km gitti. Sürat yol / zaman: 500 m/dk. Hız yer değiştirme / zaman; araç başladığı yere döndü, yer değiştirme sıfır, ortalama hız sıfır. Yön değişince hız değişir; sürat aynı kalsa bile.',
        undefined,
        { not: 'Tur atan araç örneğini aklında tut: sürat sıfır değil, hız sıfır. Skaler ile vektörelin farkı orada.' },
      ),
      kart(
        'Kütle her yerde aynı, ağırlık değişir',
        '60 kg\'lık astronot Ay\'a gidince kütlesi yine 60 kg; madde miktarı değişmedi. Ama ağırlığı altıda birine düşer. Ağırlık, yani kütleye etkiyen çekim kuvveti; Ay az çektiği için azalır. Ağırlık vektörel, kütle skaler.',
      ),
      kart(
        'Eksi işaret yön demektir',
        'Sağa giden arabanın hızı +5 m/s ise sola giden −5 m/s. İkisi de aynı süratte; eksi işaret yavaşlamak değil, ters yön demek. Tek boyutta yön yalnızca artı ve eksiyle gösterilir.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Ortalama sürat hiç sıfır olmaz',
        'Parkta koşup başladığın yere döndün. Yer değiştirmen sıfır, ortalama hızın sıfır. Ama koştuğun yol sıfır değil; ortalama süratin de değil. Yol hiç geri sayılmaz, o yüzden sürat sıfırlanmaz.',
      ),
    ], [
      soru('Yol skaler, yer değiştirme vektörel bir niceliktir.', true, 'Yol yalnızca büyüklük taşır, yer değiştirmenin ayrıca yönü var.'),
      soru(
        'Şekildeki hareketin yolu 7 birim, yer değiştirmesi 5 birimdir.',
        true,
        'Yol gidilen çizginin uzunluğu (4 + 3), yer değiştirme başlangıcı bitişe bağlayan ok.',
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
      soru('Bir cismin sürati sabitse hızı da kesinlikle sabittir.', false, 'Yön değişirse hız değişir; pistte dönen araç buna örnek.'),
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
        'Vektör bir okla çizilir',
        'Bir kutuyu sağa doğru 10 N ile itiyorsun. Bunu kâğıda sağa bakan bir okla çizersin; 20 N olsaydı ok iki kat uzun olurdu. Okun uzunluğu büyüklüğü, ucunun baktığı yer yönü gösterir. Vektör, yani bu ok.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Aynı boy, aynı yön: eşit vektör',
        'Sayfanın solunda ve sağında sağa bakan iki 3 cm\'lik ok çiz. İkisi eşit vektör; nereden başladığı önemli değil. Aynı boyda ama sola bakan ok ise −A: A ile eşit büyüklükte, ters yönde.',
      ),
      kart(
        'Toplamak için okları uç uca ekle',
        'Önce 5 adım doğuya, sonra 3 adım kuzeye gittin. İkinci okun başını ilk okun ucuna koy. Başladığın noktadan bittiğin noktaya çizilen ok bileşke, yani iki vektörün toplamı. Ekleme sırası sonucu değiştirmez.',
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
        'Paralelkenar da aynı bileşkeyi verir',
        'İki oku aynı noktadan başlat. Her okun ucundan ötekine paralel çizgi çek; bir paralelkenar çıkar. Başlangıçtan karşı köşeye giden köşegen bileşkedir. Uç uca eklemeyle aynı sonuç; hangisi kolaysa onu kullan.',
      ),
      kart(
        'Eğik vektör iki dik parçaya bölünür',
        'Kızağı yukarı ve ileri doğru eğik çekiyorsun. Bu kuvvetin bir kısmı ileri çeker, bir kısmı yukarı kaldırır. Vektörü bu iki dik parçaya ayırmaya bileşenlerine ayırma denir. Eğik düzlem soruları böyle çözülür.',
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
        'Bileşke iki sınırın arasında kalır',
        '5 N ve 3 N\'luk iki kuvvet düşün. Aynı yöne çekerlerse toplanır: 8 N. Zıt yöne çekerlerse çıkarılır: 2 N. Aralarındaki açı ne olursa olsun bileşke 2 ile 8 arasında kalır. 9 N cevabı baştan yanlış.',
        undefined,
        { not: 'Bileşke sorusunda önce toplamı ve farkı yaz; şıklardan bu aralığın dışında kalanları hemen ele.' },
      ),
      kart(
        'Dik vektörlerde Pisagor kullan',
        '4 N doğuya, 3 N kuzeye. Bu iki ok dik; bileşke dik üçgenin uzun kenarı. Pisagor: 3² + 4² = 25, karekökü 5. Bileşke 5 N. Dik olmayan vektörlerde bu yol kullanılmaz.',
      ),
      kart(
        'Bileşke sıfırsa cisim dengede',
        'Bir ipi iki kişi eşit kuvvetle zıt yöne çekiyor; ip kıpırdamıyor. Kuvvetlerin bileşkesi sıfır, bu duruma denge denir. Dengedeki cisim ya durur ya sabit hızla gider; hızı değişmez.',
      ),
      kart(
        'Sayıyla çarpmak boyu değiştirir',
        'A vektörü sağa 2 cm olsun. 2A sağa 4 cm: aynı yön, iki kat boy. −½A sola 1 cm: ters yön, yarı boy. Sayının büyüklüğü boyu, işareti yönü belirler. Artı sayı yönü hiç değiştirmez.',
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
      soru('Bir cisme etki eden kuvvetlerin bileşkesi sıfırsa cisim dengededir.', true, 'Net kuvvet yoksa hızı değişmez: ya durur ya sabit hızla gider.'),
      soru('Vektörler uç uca eklenirken ekleme sırası bileşkeyi değiştirir.', false, 'Sıra sonucu değiştirmez; önce A sonra B ile önce B sonra A aynı bileşkeyi verir.'),
      sikli('Büyüklükleri 5 ve 3 olan vektörlerin bileşkesi en az kaçtır?', ['8', '2'], 1, 'Zıt yönde çıkarılır: 5 − 3 = 2. En çok 8.'),
      sikli('−A vektörü A ile nasıl bir ilişkidedir?', ['Yarı boy, aynı yön', 'Aynı boy, ters yön'], 1, 'Eksi işaret yalnızca yönü çevirir.'),
      sikli('Dik iki vektörün bileşkesi nasıl bulunur?', ['Toplayarak', 'Pisagor ile'], 1, '3 ve 4 birimlik dik vektörlerin bileşkesi 5.'),
      sikli('Eğik düzlem problemleri hangi yöntemle çözülür?', ['Paralelkenar yöntemi', 'Bileşenlerine ayırma'], 1, 'Vektör birbirine dik iki parçaya bölünür.'),
      soru('Başlangıç noktaları farklı iki vektör hiçbir zaman eşit olamaz.', false, 'Eşitlik için büyüklük ve yön yeter; başlangıç noktası fark etmez.'),
      soru('2A vektörü A ile aynı yönde ve iki kat uzundur.', true, 'Artı sayıyla çarpmak yönü değiştirmez, boyu büyütür.'),
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
        'Bütün kuvvetler dört temel kuvvete iner',
        'Elma düşer, mıknatıs çeker, çekirdek dağılmaz, Güneş yanar. Dördü ayrı görünür ama doğada yalnızca dört temel kuvvet var; her etkileşim bunlardan birine iner. Güçleri ve menzilleri, yani etki uzaklıkları, çok farklı.',
        {
          tur: 'tablo',
          basliklar: ['Kuvvet', 'Menzil', 'Örnek'],
          satirlar: [
            ['Güçlü nükleer', 'Çekirdek boyu', 'Çekirdek dağılmaz'],
            ['Elektromanyetik', 'Sonsuz', 'Mıknatıs, sürtünme'],
            ['Zayıf nükleer', 'Çekirdekten küçük', 'Radyoaktif bozunma'],
            ['Kütle çekim', 'Sonsuz', 'Elma düşer'],
          ],
        },
      ),
      kart(
        'Kütle çekim en zayıfı ama hep çeker',
        'Küçük bir mıknatıs, koca Dünya\'nın çektiği iğneyi masadan kaldırır. Kütle çekim dördünün en zayıfı. Ama menzili sonsuz ve yalnızca çeker, hiç itmez. Gezegenleri yörüngede tutan bu.',
      ),
      kart(
        'Elektromanyetik kuvvet hem çeker hem iter',
        'Zıt yükler birbirini çeker, aynı yükler iter; mıknatısın kutupları da öyle. Bu elektromanyetik kuvvet, yani yükler arasındaki kuvvet. Menzili sonsuz. Kütle çekimden çok daha güçlü; iğneyi kaldıran o.',
      ),
      kart(
        'Güçlü kuvvet çekirdeği dağılmaktan korur',
        'Çekirdekteki protonların hepsi artı yüklü; birbirlerini itmeleri gerekir. Yine de çekirdek dağılmaz. Onları bir arada tutan güçlü nükleer kuvvet; dördünün en şiddetlisi. Ama menzili çekirdek boyu kadar, dışarı taşmaz.',
      ),
      kart(
        'Zayıf kuvvet çekirdeği dönüştürür',
        'Bazı çekirdekler kendiliğinden parçacık fırlatıp başka elemente dönüşür; buna radyoaktif bozunma denir. Sorumlusu zayıf nükleer kuvvet. Güneş\'in yanmasını başlatan zincirde de ilk adım onun işi. Menzili çekirdekten de küçük.',
      ),
      kart(
        'En zayıf kuvvet evrende neden baskın?',
        'Dünya\'da trilyonlarca artı ve eksi yük var ama toplamı sıfıra yakın; elektrik kuvvetleri birbirini götürür. Kütle çekim ise yalnızca çeker ve her kütleyle birikir. Zayıf ama birikince gezegenleri yönetir.',
        undefined,
        { not: '"Zayıf" ile "baskın" aynı şey değil. Soru "en zayıf" derse kütle çekim, "büyük ölçekte baskın" derse yine kütle çekim.' },
      ),
      kart(
        'Sürtünme ve itme aslında elektromanyetik',
        'Masayı ittiğinde elinin atomları masanın atomlarını iter; sürtünme de iki yüzeyin atomlarının birbirine takılması. Bunlar atomlar arası elektromanyetik kuvvet. "Temas kuvveti" diye ayrı bir temel kuvvet yok.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Doğadaki dört temel kuvvetin en zayıfı kütle çekim kuvvetidir.', true, 'Bir mıknatıs, Dünya\'nın çekimine karşı toplu iğneyi kaldırabiliyor.'),
      soru('Çekirdekteki protonları bir arada tutan güçlü nükleer kuvvettir.', true, 'Aynı yüklü protonların itmesini yenen kuvvet o.'),
      soru('Zayıf nükleer kuvvet, sürtünmenin bir çeşididir.', false, 'Sürtünme elektromanyetik kökenli; zayıf kuvvet çekirdek bozunmalarında etkili.'),
      soru('Kütle çekim en zayıf kuvvet olduğu için evrenin büyük yapılarında etkisizdir.', false, 'Menzili sonsuz ve her zaman çekici; büyük kütlelerde baskın olan o.'),
      sikli('Radyoaktif bozunmadan sorumlu temel kuvvet hangisidir?', ['Güçlü nükleer', 'Zayıf nükleer'], 1, 'Güneş\'teki yanma zincirinin başlaması da zayıf kuvvete bağlı.'),
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
        'Hareketli mi, neye göre?',
        'Otobüste oturuyorsun. Yoldaki ağaca göre hareketlisin, yanındaki koltuğa göre duruyorsun. İkisi de doğru. Hareket görecelidir, yani seçilen referans noktasına göre değişir. Soruda önce "neye göre" diye bak.',
      ),
      kart(
        'Öteleme: her nokta aynı yöne kayar',
        'Düz yolda giden arabanın farı da bagajı da aynı yönde, aynı kadar ilerler. Buna öteleme hareketi denir: cismin bütün noktaları aynı yönde ve aynı miktarda yer değiştirir. Asansör de böyle.',
      ),
      kart(
        'Dönme: bir eksen çevresinde',
        'Pervanenin ucu büyük bir çember çizer, ortası neredeyse yerinde kalır. Bu dönme hareketi: cisim bir eksen çevresinde döner, eksene uzak noktalar daha çok yol alır. Tekerlek ve saat ibresi de örnek.',
      ),
      kart(
        'Titreşim: bir noktanın iki yanına gidiş',
        'Salıncak en alt noktadan geçer, ileri gider, geri döner, yine geçer. Buna titreşim hareketi denir: cisim bir denge noktasının iki yanına gidip gelir. Sarkaç ve yay ucundaki kütle böyle hareket eder.',
      ),
      kart(
        'Düzgün doğrusal hareket: hız hiç değişmez',
        'Otoyolda sabit 90 km/h ile düz giden araba düşün. Hız sabit, ivme sıfır. Konum-zaman grafiği eğik bir doğru: her saniye aynı kadar yol. Hız-zaman grafiği ise yatay bir çizgi.',
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
        'Konum-zaman grafiğinde eğim hızdır',
        'Grafikte doğru dikse cisim hızlı, yatıksa yavaş. Yatay çizgi konum değişmiyor demek: cisim duruyor. Aşağı inen doğru konum azalıyor demek: cisim geri dönüyor. Eğim, yani doğrunun dikliği, hızı verir.',
      ),
      kart(
        'İvme, hızın değişmesidir',
        'Yeşil yanınca araba 0\'dan 50 km/h\'ye çıkar: hızlanma. Frende 50\'den 0\'a iner: yavaşlama. Virajda sürat aynı ama yön değişir. Üçünde de hız değişiyor; üçü de ivmeli. İvme, yani hızın zamana göre değişimi.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'İvmeli harekette grafik eğrilir',
        'Yokuş aşağı bırakılan bisiklet her saniye biraz daha hızlanır. Yolu da her saniye biraz daha çok artar. Konum-zaman grafiği bu yüzden doğru değil, giderek dikleşen bir eğri. Sabit ivmede bu eğri paraboldür.',
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
        'Serbest düşmede kütle fark etmez',
        'Havasız bir tüpte tüy ile taş aynı anda yere iner. Hava direnci yoksa her cisim aynı ivmeyle düşer: g ≈ 9,8 m/s². Yani hız her saniye 9,8 m/s artar. Ağır cisim daha hızlı düşmez.',
      ),
      kart(
        'Hız-zaman grafiğinde alan yoldur',
        'Hız-zaman grafiğinde eksen ile çizginin arasındaki alan yer değiştirmeyi verir. Çizginin eğimi ivmeyi verir. Yatay çizgi sabit hız, eğik çizgi sabit ivme. Konum grafiğiyle karıştırma: orada eğim hızdı.',
        undefined,
        { not: 'Grafik sorusunda önce eksenleri oku: y konum mu hız mı? Eğim mi alan mı istendiğine ondan sonra karar ver.' },
      ),
      kart(
        'Ortalama sürat için hızları toplayıp bölme',
        'Yolun yarısını 40, yarısını 60 km/h ile giden aracın ortalama sürati 50 değil, 48 km/h. Çünkü yavaş gittiği yarıda daha çok zaman geçirdi. Doğru yol: toplam yolu toplam zamana böl.',
        undefined,
        { etiket: 'Sık hata' },
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
      soru('Hareket görecelidir; seçilen referans noktasına göre değişir.', true, 'Otobüste oturan yolcu koltuğa göre durgun, yoldaki ağaca göre hareketli.'),
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
        'Basınç, kuvvetin alana yayılmasıdır',
        'Aynı ağırlıkla karda çizmeyle batarsın, kar ayakkabısıyla batmazsın. Kuvvet aynı, dokunan alan farklı. Basınç, yani bir yüzeye dik etkiyen kuvvetin o yüzeyin alanına bölümü: P = F / A. Alan küçülünce basınç büyür.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Basıncın birimi pascal',
        '1 m²\'lik bir yüzeye 1 N kuvvet düşüyorsa basınç 1 pascal (Pa). Yani 1 Pa = 1 N/m². Küçük bir birim: bir elmanın masaya yaptığı basınç bile yüzlerce pascal.',
      ),
      kart(
        'Alan yarıya inince basınç ikiye katlanır',
        'Kutuyu 4 cm²\'lik yüzeyi üstüne koy, basınç bir değer; 2 cm²\'lik yüzeyi üstüne çevir, basınç iki katı. Kuvvet sabitken basınç alanla ters orantılı. Grafiği bu yüzden hiperbol, yani alan büyüdükçe inen eğri.',
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
        'Bıçak keser, kar ayakkabısı batmaz',
        'Bıçağın ağzı incedir: alan küçük, basınç büyük, kesilir. Çivinin ucu sivridir: aynı sebep. Kar ayakkabısı geniştir: alan büyük, basınç küçük, batmazsın. Basıncı büyütmek istiyorsan alanı küçült; küçültmek istiyorsan alanı büyüt.',
      ),
      kart(
        'Katı basıncı yalnızca aşağı iletir',
        'Masaya koyduğun kitap yalnızca altındaki masaya basınç yapar; yanındaki bardağa değil. Katılar basıncı yalnızca temas ettiği yüzeye ve aşağı doğru iletir. Sıvı ve gazlar ise her yöne iletir; onları sonraki konularda göreceksin.',
      ),
      kart(
        'Basınç artınca kuvvet artmaz',
        'Bıçağı bilemek uyguladığın kuvveti artırmaz; kuvvet senin kolundan geliyor, aynı kalır. Artan şey basınç, çünkü alan küçüldü. Soruda "kuvvet artar" şıkkı gördüğünde dur: alan değişince kuvvet değil basınç değişir.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Dik duran kutu daha çok basınç yapar',
        'Aynı kutuyu dar yüzeyi üstüne dik koy: alan küçük, basınç büyük. Geniş yüzeyi üstüne yatır: alan büyük, basınç küçük. Ağırlık ikisinde de aynı. Basınç sorularının çoğu bu tek cümleden çıkar: kuvvet aynı, alan değişiyor.',
        undefined,
        { not: 'Kutu sorusunda önce "hangi yüzey yere değiyor" diye bak; alanı bul, ağırlığı ona böl.' },
      ),
    ], [
      soru('Basınç, kuvvetin uygulandığı yüzey alanıyla ters orantılıdır.', true, 'Aynı kuvvet küçük alana uygulanınca basınç büyüyor.'),
      soru('Kar ayakkabısı, kişinin ağırlığını azalttığı için batmayı önler.', false, 'Ağırlık aynı kalıyor; temas alanı büyüdüğü için basınç azalıyor.'),
      soru('Basıncın SI birimi pascaldır.', true, '1 Pa, 1 m²\'ye uygulanan 1 N\'luk kuvvet demek.'),
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
        'Sıvı basıncı üç şeye bağlıdır',
        'Havuzda dibe daldıkça kulağın daha çok sıkışır. Sebep üstündeki suyun ağırlığı. Sıvı basıncı derinliğe, sıvının yoğunluğuna ve yer çekimine bağlı. Kabın şekline ve içindeki su miktarına bağlı değil.',
      ),
      kart(
        'Derinlik iki katsa basınç iki kat',
        '1 m derinde üstünde 1 m su var; 2 m derinde 2 m su. Üstteki su sütunu iki kat ağır, basınç iki kat. Basınç derinlikle doğru orantılı: P = h · d · g. Burada h derinlik, d sıvının yoğunluğu, g yer çekimi.',
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
        'Kabın şekli basıncı değiştirmez',
        'Biri dar, biri geniş, biri huni gibi üç kap; hepsinde su 20 cm yüksekte. Geniş kapta çok su var, dar kapta az. Yine de üçünün taban basıncı eşit, çünkü derinlik aynı. Şekil seni şaşırtmasın; yalnızca yüksekliğe bak.',
        undefined,
        { etiket: 'Sık hata', not: 'Kap şekli sorusunda su miktarını hiç düşünme; cetvelle yüksekliği ölçüyormuş gibi bak, o kadar.' },
      ),
      kart(
        'Sıvı basıncı her yöne iter',
        'Su dolu pet şişenin yanına delik aç: su yana fışkırır. Yani sıvı yalnızca aşağı değil, yana da basınç yapar. Durgun sıvıda bir noktadaki basınç her yöne aynı. Barajın alt kısmı bu yüzden kalın yapılır: orada basınç en büyük.',
      ),
      kart(
        'Pascal ilkesi: basınç aynen iletilir',
        'Kapalı şırınganın pistonuna bas: içindeki suyun her noktasında basınç aynı miktarda artar. Buna Pascal ilkesi denir: kapalı kaptaki sıvıya yapılan basınç her noktaya aynen iletilir. Hidrolik fren ve kriko bununla çalışır.',
      ),
      kart(
        'Küçük piston az kuvvet, büyük piston çok',
        'Krikoda küçük pistona 100 N basarsın, büyük piston arabayı kaldırır. Basınç aynı; büyük pistonun alanı 20 kat ise kuvvet de 20 kat. Ama bedava değil: küçük piston 20 cm inerken büyük piston 1 cm çıkar. Kuvvet kazanırken yol kaybedersin.',
      ),
      kart(
        'Bileşik kapta sıvı aynı seviyede durur',
        'Çaydanlığın gövdesi ve ince ağzı birbirine bağlı; içindeki su ikisinde de aynı yükseklikte durur. Bileşik kap, yani alttan birbirine bağlı kaplar. Kollar ne kadar farklı olursa olsun aynı sıvı aynı seviyeye gelir.',
      ),
      kart(
        'Farklı sıvılar farklı seviyede durur',
        'U borusunun bir koluna su, öbürüne yağ koy; karışmazlar. Yağ tarafı daha yüksek durur. Çünkü yağ suya göre az yoğun; aynı basıncı ancak daha uzun sütunla yapabilir. Yoğunluğu küçük olan hep yüksekte kalır.',
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
        'Üstünde kilometrelerce hava var ve havanın ağırlığı sana basınç yapıyor. Buna açık hava basıncı denir. Deniz seviyesinde yaklaşık 101.325 Pa; kısaca 1 atm. Hissetmiyorsun çünkü vücudunun içi de aynı basınçta.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Torricelli hava basıncını cıvayla ölçtü',
        'Cıva dolu bir boruyu ağzı kapalı ters çevirip cıva kabına daldır. Cıva biraz iner ve 76 cm yükseklikte durur. Torricelli deneyi bu. 76 cm\'lik cıva sütunu, dışarıdaki havanın basıncına eşit basınç yapıyor.',
      ),
      kart(
        'Sütun neden tam 76 cm?',
        'Dışarıdaki hava kaptaki cıvayı aşağı bastırır; borudaki cıva sütunu bunu dengeler. Hava basıncı ne kadarsa sütun o kadar. Su kullansaydın sütun yaklaşık 10 m olurdu; su cıvadan 13,6 kat az yoğun, o kadar uzun sütun ister.',
        undefined,
        { not: '76 cm\'yi ezberlemekle yetinme: "cıva yerine su olsa ne olur" sorusuna 10 m diyebiliyorsan konuyu anladın.' },
      ),
      kart(
        'Yukarı çıktıkça basınç düşer',
        'Uçak kalkarken kulağın tıkanır. Sebep: yükseldikçe üstündeki hava sütunu kısalır, dışarıdaki basınç düşer, kulağının içindeki hava dışarı itmeye başlar. Dağ tepesinde basınç deniz seviyesinin yarısına iner.',
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
        'Dağda su daha erken kaynar',
        'Deniz kenarında su 100 °C\'de kaynar; yüksek bir dağda 90 °C\'de. Basınç azalınca kaynama sıcaklığı düşer. Su daha soğukken kaynadığı için yemek daha geç pişer; dağ evlerinde makarnanın uzun sürmesi bundan.',
      ),
      kart(
        'Pipet emmez, hava iter',
        'Pipeti emdiğinde içindeki havayı çekersin; pipetin içindeki basınç düşer. Bardağın yüzeyine basan dış hava artık daha güçlü ve suyu pipetten yukarı iter. Vantuz ve şırınga da aynı yolla çalışır: içeride basıncı düşür, dışarısı itsin.',
      ),
      kart(
        'Kapalı gaz da basınç yapar',
        'Şişirilmiş balonun içindeki hava tanecikleri durmadan iç yüzeye çarpar; her çarpma bir itme. Kapalı gazın basıncı bu çarpmalardan gelir. Gazı ısıtırsan tanecikler hızlanır, daha sık çarpar: basınç artar. Hacmi küçültürsen de artar.',
      ),
    ], [
      soru('Deniz seviyesinde açık hava basıncı 76 cm yüksekliğindeki cıva sütununun basıncına eşittir.', true, 'Torricelli deneyinin ölçtüğü değer bu.'),
      soru('Yükseklere çıkıldıkça açık hava basıncı artar.', false, 'Üstteki hava sütunu kısaldığı için basınç azalır.'),
      soru('Yüksek dağlarda su 100 °C\'nin altında kaynar.', true, 'Açık hava basıncı düştüğü için sıvı daha düşük sıcaklıkta kaynıyor.'),
      soru('Torricelli deneyinde cıva sütununun yüksekliği borunun kesit alanına bağlıdır.', false, 'Boru kalın da olsa ince de olsa yükseklik 76 cm; belirleyen açık hava basıncı.'),
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
        'Su, içindeki cismi yukarı iter',
        'Havuzda arkadaşını kucağına alırsın, tüy gibi gelir. Su onu yukarı itiyor. Cismin altındaki su derinde olduğu için üstündekinden daha çok basınç yapar. Aradaki fark yukarı doğru bir kuvvet üretir: kaldırma kuvveti.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Arşimet: taşan suyun ağırlığı kadar',
        'Ağzına kadar dolu kaba bir taş at; bir miktar su taşar. Taşan suyu tart: 2 N geldiyse suyun taşa yaptığı kaldırma kuvveti de 2 N. Arşimet ilkesi bu: kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşit.',
      ),
      kart(
        'Kaldırma kuvveti kütleye bakmaz',
        'Aynı boyda demir top ve tahta topu suya tamamen batır. İkisine de aynı kaldırma kuvveti etkir; çünkü ikisi aynı hacimde su taşırdı. Kaldırma kuvveti batan hacme ve sıvının yoğunluğuna bağlı. Cismin kütlesine ve derinliğe bağlı değil.',
        undefined,
        { etiket: 'Sık hata', not: 'Bağlı olmadığı şeyleri de ezberle: "kütle" ve "derinlik" şıkları çeldirici olarak geliyor.' },
      ),
      kart(
        'Yüzmek yoğunluk yarışıdır',
        'Tahta suda yüzer, taş batar. Tahta sudan az yoğun, taş sudan çok yoğun. Cismin yoğunluğu sıvınınkinden küçükse yüzer, büyükse batar, eşitse askıda kalır: ne yüzer ne batar.',
        {
          tur: 'tablo',
          basliklar: ['Yoğunluk', 'Sonuç', 'Örnek'],
          satirlar: [
            ['Cisim < sıvı', 'Yüzer', 'Tahta'],
            ['Cisim = sıvı', 'Askıda kalır', 'Denizaltı'],
            ['Cisim > sıvı', 'Batar', 'Taş'],
          ],
        },
      ),
      kart(
        'Yüzen cismin ne kadarı batar?',
        'Buzun yoğunluğu suyunkinin onda dokuzu; buzdağının onda dokuzu su altında. Yüzen cisimde kaldırma kuvveti ağırlığa eşit. Cismin yoğunluğu sıvınınkinin kaçta kaçıysa hacminin o kadarı batar: yarısıysa yarısı.',
      ),
      kart(
        'Sudaki cisim daha hafif gelir',
        'Dinamometreye asılı taş havada 10 N gösteriyor. Suya daldırınca 8 N. Taş hafiflemedi; su onu 2 N ile yukarı itiyor. Görünen ağırlık, yani gerçek ağırlıktan kaldırma kuvveti çıkınca kalan: 10 − 2 = 8 N.',
      ),
      kart(
        'Gemi çelikten ama yüzer',
        'Çelik bilye batar; peki koca gemi neden batmıyor? Geminin içi havayla dolu. Çelik ve havanın karışımı olarak geminin ortalama yoğunluğu suyunkinden küçük kalır. Yüzme kararını cismin tek parçası değil, bütününün yoğunluğu verir.',
      ),
      kart(
        'Hava da kaldırma kuvveti uygular',
        'Helyum balonu bırakınca yükselir. Hava da bir akışkan ve içindeki cisme kaldırma kuvveti uygular. Balon havadan hafif gazla dolu; havanın uyguladığı kaldırma kuvveti balonun ağırlığından büyük, o yüzden yükselir.',
      ),
      kart(
        'Tuzlu suda daha kolay yüzersin',
        'Denizde havuzdakinden kolay yüzersin. Tuz suyun yoğunluğunu artırır; aynı batan hacim için taşan su daha ağır, kaldırma kuvveti daha büyük. Aynı cisim tuzlu suda daha az batar.',
      ),
    ], [
      soru('Kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşittir.', true, 'Arşimet ilkesi.'),
      soru('Kaldırma kuvvetinin büyüklüğü cismin kütlesine bağlıdır.', false, 'Batan hacme ve sıvının yoğunluğuna bağlı; aynı hacimli iki cisme aynı kuvvet etkir.'),
      soru('Yoğunluğu içinde bulunduğu sıvıdan küçük olan cisim yüzer.', true, 'Kaldırma kuvveti ağırlıktan büyük olduğu için cisim yukarı itiliyor.'),
      soru('Gazlarda kaldırma kuvveti oluşmaz.', false, 'Balonun yükselmesi havanın uyguladığı kaldırma kuvvetiyle.'),
      sikli('Gemi çelikten yapıldığı hâlde neden yüzer?', ['Çelik sudan hafif', 'Ortalama yoğunluğu suyunkinden küçük'], 1, 'İçi hava dolu olduğu için ortalama yoğunluk düşük.'),
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
        'Hızlanan akışkanın basıncı düşer',
        'İki kâğıdı yan yana tut, arasına üfle. Kâğıtlar ayrılmaz, birbirine yaklaşır. Aradaki hava hızlandı ve basıncı düştü; dıştaki durgun hava kâğıtları içeri itti. Bernoulli ilkesi bu: akışkan hızlandığı yerde yanlara az basınç yapar.',
        undefined,
        { not: 'Bütün örnekler tek cümlenin tekrarı: hızlı akışkan, düşük basınç. Soruda önce "hava nerede hızlı" diye bak.' },
      ),
      kart(
        'Boru daralınca su hızlanır',
        'Hortumun ucunu parmağınla sıkınca su fışkırır. Daralan yerden aynı miktar su aynı sürede geçmek zorunda; geçebilmek için hızlanır. Buna süreklilik denir. Sonra Bernoulli devreye girer: dar ve hızlı yerde basınç düşük.',
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
        'İlkenin arkasında enerji korunumu var',
        'Akışkanın enerjisi iki kısım: hareket enerjisi ve basınç enerjisi. Toplam sabit. Su hızlanınca hareket enerjisi artar; toplam değişmeyeceği için basınç enerjisi azalır. Bernoulli ilkesi enerji korunumunun akışkan hâli.',
      ),
      kart(
        'Uçağı kanadın üstündeki hız kaldırır',
        'Kanadın üstü kavisli; oradan geçen hava alttakinden hızlı akar. Hızlı yerde basınç düşük: üstte az, altta çok basınç. Alttaki büyük basınç kanadı yukarı iter. Uçağı havada tutan bu basınç farkı.',
      ),
      kart(
        'Rüzgâr bacayı çeker',
        'Rüzgârlı günde soba daha iyi çeker. Baca ağzından hızla geçen rüzgâr orada basıncı düşürür. İçerideki duman yüksek basınçtan düşük basınca doğru, yani yukarı akar. Rüzgâr dumanı itmez; önündeki basıncı düşürür.',
      ),
      kart(
        'Duş perdesi neden üstüne yapışır?',
        'Duş açılınca perde içeri doğru gelir. Akan su kabinin içindeki havayı hızlandırır, basınç düşer; dışarıdaki durgun hava perdeyi içeri iter. İki kâğıt deneyiyle aynı şey: hızlı hava içeride, perde oraya gider.',
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
        'İç enerji taneciklerin toplam enerjisidir',
        'Bir bardak sudaki her molekül titrer, döner, koşuşturur; her birinin enerjisi var. Hepsini topla: bardağın iç enerjisi. Aynı sıcaklıkta kova dolusu suyun iç enerjisi daha çok, çünkü molekülü daha çok. İç enerji madde miktarına bağlı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Sıcaklık ortalamayı ölçer, toplamı değil',
        'Aynı çaydanlıktan bir fincan ve bir bardak çay koy. İkisi de 90 °C; sıcaklık miktara bakmaz. Sıcaklık, yani taneciklerin ortalama hareket enerjisinin ölçüsü. Ortalama olduğu için madde miktarından bağımsız.',
      ),
      kart(
        'Isı, aktarılan enerjidir',
        'Sıcak çayın içine soğuk kaşık koy: çaydan kaşığa enerji geçer, kaşık ısınır. Geçen bu enerjiye ısı denir. Isı yalnızca aktarım sırasında var; "kaşıkta ısı depolandı" denmez. Kaşıkta artan şey iç enerji.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Üç kavram üç ayrı soruya cevap',
        'Ne kadar enerji var: iç enerji. Ne kadar sıcak: sıcaklık. Ne kadar enerji geçti: ısı. Üçü de enerjiyle ilgili ama üçü ayrı soruya cevap veriyor. Tablodaki örnek sütununu kapatıp kendin doldurmayı dene.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne ölçer?', 'Örnek'],
          satirlar: [
            ['İç enerji', 'Toplam enerji', 'Kova dolusu su'],
            ['Sıcaklık', 'Ortalama enerji', '90 °C'],
            ['Isı', 'Aktarılan enerji', 'Çaydan kaşığa'],
          ],
        },
      ),
      kart(
        'Kıvılcım sıcak ama enerjisi az',
        'Maytaptan sıçrayan kıvılcım 1000 °C\'nin üstünde; ama eline değince yanmazsın. Tanecik sayısı çok az, toplam enerjisi küçük. Ilık bir kazan dolusu su 60 °C ama iç enerjisi kıvılcımın kat kat üstünde. Sıcaklık yüksek, enerji az olabilir.',
        undefined,
        { not: 'Sınavda "sıcaklığı yüksek olanın iç enerjisi de büyüktür" cümlesi gelirse kıvılcım ile kazanı hatırla: yanlış.' },
      ),
      kart(
        'Isı hep sıcaktan soğuğa akar',
        'Buzu sıcak çaya at: çay soğur, buz erir. Isı çaydan buza geçti; tersi olmaz. Isı her zaman sıcak cisimden soğuk cisme akar. Yönü belirleyen sıcaklık farkı; iç enerji büyüklüğü değil. Kazan kıvılcımdan ısı alır, vermez.',
      ),
      kart(
        'Celsius ve Kelvin arasında 273 fark var',
        'Celsius\'ta 0 suyun donduğu, 100 kaynadığı sıcaklık. Kelvin ise mutlak sıfırdan başlar: taneciklerin tümüyle durduğu en düşük sıcaklık. 0 K = −273,15 °C. Çevirmek için 273 ekle: 27 °C = 300 K. Kelvinde eksi sıcaklık yok.',
      ),
      kart(
        'Isı joule ile, sıcaklık derece ile ölçülür',
        'Isı bir enerji; birimi joule (J) ya da kalori (cal). 1 cal, 1 gram suyu 1 °C ısıtan enerji; 1 cal ≈ 4,18 J. Sıcaklık enerji değil; °C ya da K ile ölçülür. "Sıcaklık 50 J" demek yanlış.',
      ),
    ], [
      soru('Isı, sıcaklık farkı nedeniyle bir yerden başka yere aktarılan enerjidir.', true, 'Isı bir enerji aktarımı; cisimde depolanan şey iç enerji.'),
      soru('Bir kıvılcımın sıcaklığı kazandaki sudan yüksek olsa bile iç enerjisi düşüktür.', true, 'İç enerji tanecik sayısına da bağlı; kıvılcımda tanecik az.'),
      soru('Isı, iç enerjisi büyük olan cisimden küçük olana akar.', false, 'Aktarım yönünü iç enerji değil sıcaklık belirler.'),
      soru('Sıcaklık, cismin sahip olduğu toplam enerjidir.', false, 'Sıcaklık taneciklerin ortalama hareket enerjisinin ölçüsü; toplam olan iç enerji.'),
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
        'Öz ısı: 1 gramı 1 derece ısıtmanın bedeli',
        '1 gram suyu 1 °C ısıtmak 4,18 J ister; 1 gram demiri ısıtmak yalnızca 0,45 J. Bu sayıya öz ısı denir: 1 gram maddenin sıcaklığını 1 °C artırmak için gereken ısı. Her maddenin kendi öz ısısı var; ayırt edici özellik.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Su geç ısınır, geç soğur',
        'Yazın öğlen kum yakar, deniz serindir; gece kum soğur, deniz ılık kalır. Suyun öz ısısı çok yüksek: ısınmak için çok ısı ister, soğurken çok ısı verir. Kıyı havasının yumuşak olması ve motorların suyla soğutulması bundan.',
      ),
      kart(
        'Isı sığası bütün cisme aittir',
        'Bir bardak suyu 1 °C ısıtmak az ısı ister, bir küveti çok. İkisi de su, öz ısı aynı; farklı olan kütle. Isı sığası, yani bütün cismin sıcaklığını 1 °C artırmak için gereken ısı: kütle × öz ısı. Kütle büyüdükçe büyür.',
      ),
      kart(
        'Öz ısı maddeye, ısı sığası cisme ait',
        'Bir kilo su ve on kilo su: ikisinin öz ısısı aynı, çünkü ikisi de su. Isı sığaları farklı, çünkü kütleleri farklı. Soru "hangisi kütleyle değişir" derse cevap ısı sığası. Öz ısı madde cinsine bakar, miktarına değil.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Kime ait?', 'Kütleyle'],
          satirlar: [
            ['Öz ısı (c)', 'Maddeye', 'Değişmez'],
            ['Isı sığası (m·c)', 'Cisme', 'Büyür'],
          ],
        },
        { etiket: 'Sık hata', not: 'Soruda "aynı maddeden ama farklı kütlede" gördüğünde: öz ısı eşit, ısı sığası farklı.' },
      ),
      kart(
        'Isı hesabı: Q = m · c · ΔT',
        '200 g suyu 20 °C\'den 30 °C\'ye çıkarmak için ne kadar ısı gerekir? Kütle 200 g, öz ısı 1 cal/g°C, sıcaklık farkı 10 °C. Çarp: 200 × 1 × 10 = 2000 cal. Formülde m kütle, c öz ısı, ΔT sıcaklık farkı.',
      ),
      kart(
        'Grafikte yatık doğru büyük öz ısı demek',
        'İki maddeye aynı hızda ısı veriliyor. Demirin sıcaklığı hızla tırmanır: dik doğru, küçük öz ısı. Suyunki yavaş yükselir: yatık doğru, büyük öz ısı. Grafikte doğru ne kadar yatıksa madde o kadar zor ısınıyor.',
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
        'Öz ısısı küçük olan önce ısınır, önce soğur',
        'Eşit kütlede demir ve suya aynı ısıyı ver. Demir 10 °C ısınırken su 1 °C ısınır; demirin öz ısısı küçük. Aynı şey soğurken de geçerli: demir hemen soğur, su uzun süre ılık kalır. Küçük öz ısı, hızlı değişim.',
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
        'Erirken sıcaklık yerinde sayar',
        'Buzu ocağa koy ve termometreyle izle. −20 °C\'den 0 °C\'ye çıkar, sonra buz bitene kadar 0\'da bekler. Isı veriyorsun ama sıcaklık artmıyor; ısı tanecikler arasındaki bağları gevşetmeye gidiyor. Grafikteki her yatay çizgi bir hâl değişimi.',
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
        { not: 'Grafikte yatay çizgi gördüğünde "ısı boşa gitti" deme; o sırada madde hâl değiştiriyor, ısı bağlara harcanıyor.' },
      ),
      kart(
        'Altı hâl değişimi, üç hâl',
        'Buz erir: katıdan sıvıya. Su donar: sıvıdan katıya. Su buharlaşır, buhar yoğuşur: sıvı ile gaz arası. Naftalin dolapta erimeden yok olur: katıdan doğrudan gaza, süblimleşme. Tersine, gazdan doğrudan katıya geçiş kırağılaşma.',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Katı' }, { ad: 'Sıvı' }, { ad: 'Gaz' }],
        },
      ),
      kart(
        'Erirken aldığını donarken geri verir',
        '1 gram buzu eritmek 80 cal ister. Aynı 1 gram su donarken 80 cal verir. Erime ısısı ile donma ısısı eşit; biri alınır, öteki verilir. Buharlaşma ve yoğuşma ısısı için de aynı kural: 1 gram su için 540 cal.',
      ),
      kart(
        'Buharlaşma hep olur, kaynama tek sıcaklıkta',
        'Çamaşır kışın da kurur; su 100 °C olmadan da buharlaşır. Buharlaşma yüzeyden ve her sıcaklıkta olur. Kaynama ise yalnızca kaynama sıcaklığında ve sıvının her yerinde: dipten kabarcıklar çıkar. İkisi aynı şey değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Çamaşır güneşte ve rüzgârda çabuk kurur',
        'Islak çamaşırı güneşe as, rüzgâra tut, yayarak ser: çabuk kurur. Sıcaklık, hava akımı ve yüzey alanı buharlaşmayı hızlandırır. Nemli havada ise havada zaten çok su buharı var; çamaşır geç kurur. Nem yavaşlatır.',
      ),
      kart(
        'Ter buharlaşırken seni serinletir',
        'Terin buharlaşması için ısı gerekir; bu ısı derinden çekilir. Derin ısı verdiği için serinler. Rüzgârda daha çok üşümen de bundan: buharlaşma hızlanır, deriden daha çok ısı gider. Ter soğuk olduğu için değil.',
      ),
      kart(
        'Su donarken büyür, buz bu yüzden yüzer',
        'Ağzına kadar dolu su şişesini dondurucuya koyarsan patlar. Su donarken genleşir, yani hacmi büyür. Aynı kütle daha büyük hacim: buz sudan az yoğun, üstte yüzer. Göl yüzeyden donar, dipte su sıvı kalır; balıklar orada yaşar.',
      ),
      kart(
        'Basınç artınca kaynama noktası yükselir',
        'Düdüklü tencerede buhar dışarı çıkamaz, içerideki basınç artar. Basınç artınca su 100 °C\'de değil, 120 °C civarında kaynar. Yemek daha sıcak suda piştiği için çabuk pişer. Dağdaki durumun tam tersi: orada basınç düşük, su erken kaynar.',
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
        'Sıcaklıklar eşitlenince akış durur',
        'Sıcak çaya soğuk süt koy. Çay soğur, süt ısınır; bir süre sonra ikisi aynı sıcaklıkta. Artık birinden ötekine net ısı geçmez. Bu duruma ısıl denge denir: temas eden cisimlerin sıcaklıklarının eşitlenmesi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Sıcağın verdiği ısı soğuğun aldığına eşit',
        'Termosun içine sıcak su ve soğuk demir koy. Isı dışarı kaçamaz. Suyun verdiği her kalori demire geçer. Yalıtılmış kapta, yani dışarıyla ısı alışverişi olmayan kapta: verilen ısı = alınan ısı. Hesaplar bu eşitlikle yapılır.',
      ),
      kart(
        'Denge, büyük olana yakın çıkar',
        'Kovaya bir bardak sıcak su döksen kovanın suyu neredeyse hiç ısınmaz. Denge sıcaklığı iki başlangıç sıcaklığının arasında çıkar. Ama kütlesi ve öz ısısı büyük olana daha yakın. Büyük taraf dengeyi kendine çeker.',
      ),
      kart(
        'Denge ortalama değildir',
        '80 °C su ile eşit kütlede 20 °C su karışırsa denge 50 °C: ortalama. Aynı su eşit kütlede 20 °C demirle karışırsa denge 50 değil, 74 °C. Demirin öz ısısı küçük, dengeyi az çeker. Ortalama yalnızca aynı madde ve eşit kütlede geçerli.',
        undefined,
        { etiket: 'Sık hata', not: 'Ortalama alıp şıkkı işaretleme. Önce sor: aynı madde mi, kütleler eşit mi? İkisi de evet değilse ortalama yanlış.' },
      ),
      kart(
        'Termometre kendi sıcaklığını gösterir',
        'Termometreyi koltuk altına koyunca hemen okumazsın, beklersin. Bekleme süresinde termometre vücudunla ısıl dengeye girer. Gösterdiği değer aslında kendi sıcaklığı; dengeye geldiği için seninkine eşit.',
      ),
      kart(
        'Dengede tanecikler durmaz',
        'Isıl dengede ısı alışverişi bitmez; iki yöne eşit olur. Çaydan süte geçen enerji kadar sütten çaya da geçer, net akış sıfır. Tanecikler yine titreşir, yine çarpışır. Denge durgunluk değil, eşitlik.',
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
        'Isı üç yoldan yolculuk eder',
        'Çaydaki kaşık sapından ısınır: iletim. Kalorifer odanın havasını dolaştırır: konveksiyon. Güneş boşluktan geçip yüzünü ısıtır: ışıma. Isı bu üç yolla aktarılır. Fark, ısıyı taşıyanın ne olduğu; tabloya bak.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Taşıyıcı', 'Örnek'],
          satirlar: [
            ['İletim', 'Titreşen tanecik', 'Çaydaki kaşık'],
            ['Konveksiyon', 'Akışkan hareketi', 'Kalorifer'],
            ['Işıma', 'Ortam gerekmez', 'Güneş'],
          ],
        },
      ),
      kart(
        'İletimde tanecik yerinden kıpırdamaz',
        'Metal çubuğun ucunu ateşe tut; öbür ucu da ısınır. Uçtaki tanecikler hızlı titreşir, komşusunu dürter, o da komşusunu. Tanecikler yer değiştirmez, yalnızca titreşimi aktarır. Buna iletim denir; katılarda, özellikle metallerde baskın.',
      ),
      kart(
        'Konveksiyonda akışkanın kendisi taşır',
        'Kaloriferin yanındaki hava ısınır, genleşir, hafifler ve yükselir. Tavandaki soğuk hava iner, o da ısınır. Oda bu döngüyle ısınır. Konveksiyon, yani ısınan akışkanın yer değiştirerek ısıyı taşıması. Yalnızca sıvı ve gazda olur.',
      ),
      kart(
        'Işıma için madde gerekmez',
        'Güneş ile aramızda milyonlarca kilometre boşluk var; yine de yüzünü ısıtır. Enerji elektromanyetik dalgayla, yani ışıkla aynı türden dalgayla taşınır. Buna ışıma denir. Ateşin karşısında durunca hissettiğin sıcaklık da ışıma.',
      ),
      kart(
        'Koyu renk ışımayı yutar',
        'Yazın siyah tişört beyazdan daha çok ısıtır. Koyu ve mat yüzeyler gelen ışımayı soğurur, yani içine alır; açık ve parlak yüzeyler yansıtır. İyi soğuran yüzey aynı zamanda iyi yayar: siyah radyatör bu yüzden.',
      ),
      kart(
        'Termos üç yolu birden keser',
        'Termosun iki cidarı, yani iç içe iki duvarı var; arası boşluk. Boşlukta tanecik yok: iletim ve konveksiyon geçemez. İç yüzeyi aynalı: ışımayı yansıtır. Üç yol da kapandığı için çay saatlerce sıcak kalır.',
        undefined,
        { not: 'Termosun her parçasını bir yola eşle: boşluk → iletim ve konveksiyon, ayna → ışıma. Üç yol tek örnekte oturur.' },
      ),
      kart(
        'Sıcak hava yükselir, soğuk hava iner',
        'Isınan hava genleşir, yoğunluğu azalır; kaldırma kuvvetiyle yukarı çıkar, soğuk hava aşağı iner. Klima bu yüzden yukarıya konur: soğuk hava kendiliğinden aşağı yayılır. Kalorifer aşağıya konur: sıcak hava kendiliğinden yükselir.',
      ),
    ], [
      soru(
        'Güneş\'ten Dünya\'ya enerji ışıma yoluyla ulaşır.',
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
      soru('Isı yalıtımı, ısının hiç geçmemesini sağlar.', false, 'Yalıtım aktarımı yavaşlatır, tümüyle durdurmaz; termostaki çay da sonunda soğur.'),
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
        'Isı bir çubuktan ne kadar hızlı geçer?',
        'Bir ucu ateşte metal çubuk düşün. Öbür ucun ne kadar çabuk ısındığı dört şeye bağlı: çubuğun maddesi, kalınlığı (kesit alanı), uzunluğu ve iki ucu arasındaki sıcaklık farkı. Isı iletim hızı, yani birim zamanda geçen ısı.',
      ),
      kart(
        'Sıcaklık farkı büyükse ısı hızlı akar',
        'Kaynar suya batırılan kaşık ılık suya batırılandan çabuk ısınır. İki uç arasındaki sıcaklık farkı büyüdükçe iletim hızlanır; doğru orantı. Fark sıfırsa akış durur: aynı sıcaklıktaki iki cisim arasında ısı geçmez.',
      ),
      kart(
        'Uzun çubukta ısı geç ulaşır',
        'Kısa kaşığın sapı çabuk, uzun kepçenin sapı geç ısınır. Yol uzadıkça iletim yavaşlar; ters orantı. Duvarı kalın yapmak da aynı şey: ısının geçeceği yol uzar, kayıp azalır.',
      ),
      kart(
        'Kalın çubuk daha çok ısı taşır',
        'İnce tel ile kalın çubuğun bir ucunu aynı ateşe tut; kalın olan öbür uca daha çok ısı geçirir. Kesit alanı, yani çubuğun kalınlığı, iki katına çıkarsa iletim hızı da iki katına çıkar. Doğru orantı.',
      ),
      kart(
        'Metal soğuk değil, hızlı',
        'Aynı odadaki metal sandalye tahta sandalyeden soğuk gelir. Ama ikisi de oda sıcaklığında. Metal elinden ısıyı hızla çeker, tahta yavaş. Elin sıcaklığı değil, ısının gidiş hızını hissediyor.',
        undefined,
        { etiket: 'Sık hata', not: 'Soru "hangisi daha soğuktur" derse tuzak: ikisi aynı sıcaklıkta. Fark iletim hızında.' },
      ),
      kart(
        'Hava iyi bir yalıtkandır',
        'Kazak seni ısıtmaz; ısıtan sensin. Kazak, yün liflerinin arasında hava hapseder ve hava ısıyı çok yavaş iletir. Yalıtkan, yani ısıyı zor ileten madde: hava, köpük, yün. Metal ise iyi iletken.',
      ),
      kart(
        'Çift camda yalıtan cam değil, aradaki hava',
        'Çift camlı pencere tek camdan çok daha az ısı kaçırır. Sebep camın kalınlığı değil; iki cam arasında hapsolmuş durgun hava tabakası. Hava iletimi keser. Aynı fikir köpük ve yün gibi bütün yalıtkanlarda.',
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
