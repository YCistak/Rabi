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
      tasarım (`tasarim/bilgi-karti.html`) bu konu üstünden çizildi. Etiket ve
      hızlı kontrol öteki konularda henüz boş; Rabi notu her konuda **bir**
      kartta var (bkz. `tip.ts`). Buradaki yedi not tasarımın "ezberleme, anla"
      cümleleriydi; öteki notlarla aynı ölçüye (somut örnek, sayı, tuzak)
      çekildi.
    */
    konu('fzk9-bilim', 'Fizik Bilimi', [
      kart(
        'Fizik neyi inceler?',
        'Madde, enerji ve bunların uzay-zamandaki etkileşimini inceler.\nDoğanın kurallarını sayıyla ifade etmeye çalışır.',
        undefined,
        { etiket: 'Tanım', not: 'Yaprağın düşüşü fizik, çürümesi kimya, büyümesi biyoloji: aynı yaprak, üç soru. Fizik enerji ve hareketi sorar.' },
      ),
      kart(
        'Bilimsel yöntem',
        'Fizik gözlemle başlar, hipotez kurar ve deneyle sınar.\nSonuç yeniden gözleme döner.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Gözlem' },
            { ad: 'Hipotez' },
            { ad: 'Deney' },
            { ad: 'Kuram' },
          ],
        },
        { etiket: 'Ölçme', not: '\'Ağır cisim hızlı düşer\' hipotezi tüyle taşı vakumda bırakınca çöktü; deney kazandı, sezgi kaybetti.' },
      ),
      kart(
        'Deney ve model',
        'Model, gerçeğin sadeleştirilmiş hâlidir.\nDeneyle çelişen model, ne kadar zarif olursa olsun bırakılır.',
        undefined,
        { etiket: 'Yöntem', not: '\'Sürtünmesiz ortam\' gerçek değil ama 100 m\'lik kaydırakta hata %2; model işe yaradığı yerde doğru sayılır.' },
      ),
      kart(
        'Hipotez, kuram, yasa',
        '- **Hipotez:** sınanmayı bekleyen öneri\n- **Kuram:** sınanmış açıklama\n- **Yasa:** gözlenen düzenliliğin kısa ifadesi',
        undefined,
        { etiket: 'Kavramlar', not: 'Kütle çekim yasası F = Gm₁m₂/r² (ne oluyor), görelilik kuramı (neden oluyor). Yasa kuramın üst basamağı değil.' },
      ),
      kart(
        'Bilimsel bilgi değişebilir',
        'Yeni bir gözlem eski kuramı düzeltebilir.\nDeğişmek bilimin zayıflığı değil, yöntemin işlediğinin kanıtıdır.',
      ),
      kart(
        'Fizik ve matematik',
        'Matematik fiziğin dilidir.\nBir yasa cümleyle anlatılabilir; tahmin yapması için denkleme dönmesi gerekir.',
        undefined,
        { etiket: 'Dil', not: 'x = ½gt² cümlesi: \'düşen cisim her saniye daha çok yol alır.\' Cümleyi biliyorsan formülü t = 2\'de sınayabilirsin.' },
      ),
      kart(
        'Ölçme olmadan fizik olmaz',
        'Her ölçümün bir belirsizliği vardır.\nSonucu belirsizliğiyle birlikte vermek, fiziğin dürüstlük kuralıdır.',
        undefined,
        { etiket: 'Birimler', not: 'Cetvelle ölçülen 12,3 cm aslında 12,3 ± 0,1 cm; \'12,3456\' yazan öğrenci ölçmüyor, uyduruyor.' },
      ),
      kart(
        'Fiziğin öteki bilimlerle bağı',
        '- **Kimya:** atomun elektron düzenine dayanır.\n- **Biyoloji:** sinir hücresinin elektriğine dayanır.\nBilimler arasındaki sınırlar doğal değil, idaridir.',
        undefined,
        { etiket: 'Kapanış', not: 'MR cihazı fizik (manyetizma), okuyan doktor tıp; EKG\'deki elektrik fizik, kalp biyoloji. Sınır yok.' },
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
        'Kuvvet, hareket ve dengeyi inceler.\nKöprüden gezegen yörüngesine kadar hareket eden her şey konusudur.',
      ),
      kart(
        'Termodinamik',
        'Isı ve enerji dönüşümlerini inceler.\nÖrnek: motor, buzdolabı, iklim modelleri',
      ),
      kart(
        'Optik',
        'Işığın yayılmasını, yansımasını ve kırılmasını inceler.\nÖrnek: gözlük, kamera, fiber optik kablo',
      ),
      kart(
        'Elektromanyetizma',
        'Elektrik ile manyetizmayı tek çatı altında toplar.\nÖrnek: elektrik motoru, radyo dalgası',
      ),
      kart(
        'Akustik ve dalgalar',
        'Ses, su dalgası ve deprem dalgası aynı matematikle incelenir.\nDalga mekaniği, mekanik ile optik arasında bir köprüdür.',
      ),
      kart(
        'Katıhâl fiziği',
        'Maddenin katı hâldeki davranışını inceler.\nYarı iletkenler, dolayısıyla bütün elektronik bu dalın ürünüdür.',
      ),
      kart(
        'Modern fizik',
        'Atom altı ve ışık hızına yakın olayları inceler:\n- Kuantum fiziği\n- Görelilik\nKlasik fiziğin yetmediği yerde başlar.',
      ),
      kart(
        'Klasik mi modern mi?',
        'Klasik fizik yanlış değil, **sınırlıdır**.\nGünlük hız ve boyutlarda doğru sonuç verir; o sınırın dışında modern fizik gerekir.',
      ),
      kart(
        'Hangi dal hangi soruyu sorar?',
        '- **Cisim nasıl hareket eder?** mekanik\n- **Isı nereye gider?** termodinamik\n- **Işık ne yapar?** optik\n- **Yük ne yapar?** elektromanyetizma',
        undefined,
        { not: 'Ses dalgası ve deprem dalgası aynı dala girer: akustik/dalgalar. Ses için \'optik\' işaretleme.' },
      ),
      kart(
        'Nükleer fizik ve astrofizik',
        '- **Nükleer fizik:** atom çekirdeğini ve radyoaktiviteyi inceler.\n- **Astrofizik:** yıldızları ve evreni fizik yasalarıyla inceler.',
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
      soru('Yıldızların yapısını fizik yasalarıyla inceleyen dal astrofiziktir.', true, 'Astrofizik, fiziğin yasalarını gökteki cisimlere uygular.'),
      soru('Radyoaktivite optiğin konusudur.', false, 'Çekirdekle ilgili; nükleer fiziğin konusu.'),
      sikli('Güneş\'in enerjisini nasıl ürettiği hangi dalların sorusudur?', ['Akustik', 'Astrofizik ve nükleer fizik'], 1, 'Güneş çekirdeğinde füzyon olur; yıldızın kendisi astrofiziğin konusu.'),
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
        'Kaldırma kuvvetini ve kaldıraç ilkesini buldu.\nSuya batan cismin, taşırdığı su kadar hafiflediğini gösterdi.',
      ),
      kart(
        'Galileo',
        'Deneyi fiziğin merkezine koydu.\nSerbest düşmede farklı kütlelerin aynı ivmeyle düştüğünü savundu.',
        undefined,
        { not: 'Sınav tuzağı: serbest düşmede eşit ivmeyi Galileo söyledi, Newton değil. Newton yasayı yazdı.' },
      ),
      kart(
        'Newton',
        'Hareket yasalarını ve kütle çekimini ortaya koydu.\nGökteki ve yerdeki hareketin aynı yasaya uyduğunu gösterdi.',
      ),
      kart(
        'Faraday ve Maxwell',
        '- **Faraday:** elektrik ile manyetizmanın bağını deneyle gösterdi.\n- **Maxwell:** bu bağı dört denklemle yazdı.',
      ),
      kart(
        'Tesla ve alternatif akım',
        'Alternatif akım sistemini geliştirdi.\nBugünkü elektrik şebekesi onun motor ve transformatör tasarımlarına dayanır.',
      ),
      kart(
        'Einstein',
        'Görelilik kuramıyla zamanın ve uzayın mutlak olmadığını gösterdi.\nEnerji ile kütle arasındaki bağı kurdu: E = mc²',
      ),
      kart(
        'Marie Curie',
        'Radyoaktivite üzerine çalıştı; polonyum ve radyumu keşfetti.\nİki ayrı dalda Nobel alan ilk kişidir.',
      ),
      kart(
        'İbn Heysem',
        'Optiğin kurucusu sayılır.\nGörmenin, cisimden göze gelen ışıkla olduğunu gösterdi.',
      ),
      kart(
        'Türkiye’den bir ad',
        '**Feza Gürsey**, parçacık fiziğinde simetri kuramlarıyla tanınır.\nAdı uluslararası bir araştırma ödülünde yaşıyor.',
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
      soru('Einstein\'ın görelilik kuramına göre zaman ve uzay mutlaktır.', false, 'Tersini gösterdi: zaman ve uzay gözlemciye göre değişir.'),
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
        '- Enerji ve savunma\n- Sağlık (tıbbi görüntüleme)\n- Yarı iletken ve havacılık\n- Araştırma merkezleri',
      ),
      kart(
        'Fizik mühendisliği',
        'Lazer, optik sistem ve sensör tasarlar.\nFiziğin sanayideki doğrudan uygulamasıdır; üniversitede ayrı bir bölümdür.',
      ),
      kart(
        'Medikal fizik',
        'Radyoterapi ve görüntüleme cihazlarının doğru dozla çalışmasını sağlar.\nHastane ekibinin bir parçasıdır.',
      ),
      kart(
        'Malzeme ve yarı iletken',
        'Yeni malzeme geliştirmek, fizik ile kimyanın kesiştiği yerdir.\nİşlemci üretiminin temeli buradadır.',
      ),
      kart(
        'Araştırma merkezleri',
        '- **Türkiye’de:** TÜBİTAK ve üniversite laboratuvarları\n- **Yurt dışında:** CERN gibi merkezler\nTürkiye CERN’e ortak üyedir.',
      ),
      kart(
        'Meteoroloji ve jeofizik',
        'Atmosferin ve yer kabuğunun davranışı fiziksel modellerle tahmin edilir.\nDeprem araştırmaları da bu alandadır.',
      ),
      kart(
        'Beklenmedik alanlar',
        'Fizik eğitimi veri analizi ve modelleme öğretir.\nBu yüzden finans ve yazılım da fizikçi istihdam eder.',
      ),
      kart(
        'Hangi ders neye açılır?',
        '- **Mekanik:** makine ve inşaat\n- **Elektromanyetizma:** elektrik-elektronik\n- **Modern fizik:** nükleer ve malzeme\n- **Optik:** görüntüleme',
        undefined,
        { not: 'Tıbbi görüntüleme (MR, tomografi) da fizik işi: \'medikal fizik\' şıkta çıkarsa yabancı gelmesin.' },
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
      soru('Fizik mühendisliği üniversitede fizikten ayrı bir bölümdür.', true, 'Lazer, optik sistem ve sensör tasarımına yönelik ayrı bir lisans programı.'),
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
        'Ölçülebilen her özellik bir niceliktir.\nÖlçmek, niceliği kendi birimiyle karşılaştırmaktır.',
      ),
      kart(
        'Temel nicelikler',
        'SI’da yedi temel nicelik vardır.\nHiçbiri başka bir nicelikten türetilmez.',
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
        'Temel niceliklerden çarpma ve bölmeyle elde edilir.\nÖrnek: hız (m/s), kuvvet (kg·m/s²), enerji (J)',
      ),
      kart(
        'Sık kullanılan türetilmişler',
        '- **Yoğunluk:** kg/m³\n- **İvme:** m/s²\n- **Kuvvet:** N = kg·m/s²\n- **Enerji:** J = N·m\n- **Güç:** W = J/s',
      ),
      kart(
        'Birim önemlidir',
        'Sayı tek başına bilgi değildir.\n1999’da bir Mars sondası birim karışıklığı yüzünden kaybedildi.',
      ),
      kart(
        'Ön ekler',
        '- **kilo (k):** bin katı\n- **santi (c):** yüzde biri\n- **mili (m):** binde biri\n- **mikro (µ):** milyonda biri\nHesaptan önce birimler eşitlenir.',
      ),
      kart(
        'Boyut denetimi',
        'Bir denklemin iki tarafının birimi aynı olmalıdır.\nTutmuyorsa denklem kesin yanlıştır; hesap yapmadan anlaşılır.',
        undefined,
        { not: 'Hızlı kontrol: yol = hız × zaman → m = (m/s)·s ✓. \'m = m/s\' çıkıyorsa formül ters yazılmış.' },
      ),
      kart(
        'Birim çevirme',
        '- 1 m² = 10⁴ cm²\n- 1 m³ = 10⁶ cm³\n- 1 m/s = 3,6 km/h\nAlanda çarpan iki, hacimde üç kez uygulanır.',
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
        'Yalnızca büyüklükle tanımlanır.\nÖrnek: kütle, zaman, sıcaklık, sürat, enerji',
      ),
      kart(
        'Vektörel nicelik',
        'Büyüklüğün yanında **yön** de gerekir.\nÖrnek: kuvvet, hız, ivme, yer değiştirme',
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
        '- **Yol (skaler):** gidilen toplam uzunluk\n- **Yer değiştirme (vektörel):** başlangıçtan bitişe çizilen ok',
      ),
      kart(
        'Sürat ve hız',
        '- **Sürat:** yol / zaman\n- **Hız:** yer değiştirme / zaman\nPistte bir tur atan aracın ortalama hızı sıfırdır.',
        undefined,
        { not: '400 m pisti 100 s\'de tur atan koşucu: sürat 4 m/s, hız 0. Sınav \'ortalama hız\' derken bunu sorar.' },
      ),
      kart(
        'Kütle ve ağırlık',
        '- **Kütle:** madde miktarı, her yerde aynı\n- **Ağırlık:** kütleye etkiyen çekim kuvveti, Ay’da azalır',
      ),
      kart(
        'İşaret yön demektir',
        'Tek boyutta yön, artı ve eksi işaretiyle gösterilir.\n−5 m/s, 5 m/s ile aynı süratte ama ters yönde demektir.',
      ),
      kart(
        'Ortalama sürat sıfır olmaz',
        'Yol hiç azalmadığı için ortalama sürat sıfır olmaz.\nBaşladığı yere dönen koşucunun ortalama hızı sıfırdır, sürati değil.',
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
        'Vektör bir okla gösterilir:\n- **Okun uzunluğu:** büyüklük\n- **Okun yönü:** vektörün yönü',
      ),
      kart(
        'Eşit ve zıt vektörler',
        '- **Eşit:** büyüklüğü ve yönü aynı, başlangıç noktası fark etmez\n- **Zıt (−A):** A ile aynı boyda, ters yönde',
      ),
      kart(
        'Uç uca ekleme',
        'İlk vektörün ucuna ikincinin başı konur.\nİlkin başından sonuncunun ucuna çizilen ok **bileşkedir**.',
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
        'İki vektör aynı noktadan çizilir, paralelkenar tamamlanır.\nKöşegen bileşkeyi verir; uç uca eklemeyle aynı sonuç çıkar.',
      ),
      kart(
        'Bileşenlerine ayırma',
        'Bir vektör, birbirine dik iki parçaya bölünebilir.\nEğik düzlem problemleri bu yolla çözülür.',
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
        '- **Aynı yönlüyse:** büyüklükler toplanır, en büyük bileşke.\n- **Zıt yönlüyse:** büyüklükler çıkarılır, en küçük bileşke.\nBileşke bu iki değer arasında kalır.',
        undefined,
        { not: '3 ve 5 birimlik iki vektörün bileşkesi 2 ile 8 arasında; 9 ya da 1 diyen şık baştan elenir.' },
      ),
      kart(
        'Dik vektörler',
        'Dik iki vektörün bileşkesi Pisagor ile bulunur.\nÖrnek: 3 ve 4 birimlik dik iki vektör → 5 birim',
      ),
      kart(
        'Denge',
        'Cisme etkiyen vektörlerin bileşkesi sıfırsa cisim dengededir.\nYa durur ya da sabit hızla gider.',
      ),
      kart(
        'Vektörü sayıyla çarpma',
        '- **2A:** A ile aynı yönde, iki kat uzun\n- **−½A:** ters yönde, yarı boyda\nYön yalnızca işaretle değişir.',
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
      sikli('İlk vektörün ucuna ikincinin başı konarak bileşke bulunan yöntem?', ['Uç uca ekleme', 'Bileşenlere ayırma'], 0, 'İlkin başından sonuncunun ucuna çizilen ok bileşkedir.'),
      sikli('−A vektörü A ile nasıl bir ilişkidedir?', ['Yarı boy, aynı yön', 'Aynı boy, ters yön'], 1, 'Eksi işaret yalnızca yönü çevirir.'),
      sikli('Paralelkenar yönteminde bileşkeyi ne verir?', ['Köşegen', 'Kenarlardan biri'], 0, 'İki vektör aynı noktadan çizilir; tamamlanan paralelkenarın köşegeni bileşkedir.'),
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
        'Bütün etkileşimler dört temel kuvvete indirgenir.\nGüçleri ve menzilleri birbirinden çok farklıdır.',
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
        'En zayıf temel kuvvettir.\nMenzili sonsuzdur ve hep çekicidir; gezegenleri yörüngede tutar.',
      ),
      kart(
        'Elektromanyetik kuvvet',
        'Yükler arasında etkir; hem çeker hem iter.\nSürtünme ve tepki gibi günlük kuvvetlerin asıl kaynağıdır.',
      ),
      kart(
        'Güçlü nükleer kuvvet',
        'Birbirini iten protonları çekirdekte bir arada tutar.\nMenzili çok kısa, şiddeti en büyüktür.',
      ),
      kart(
        'Zayıf nükleer kuvvet',
        'Radyoaktif bozunmadan sorumludur.\nGüneş’teki füzyon zincirinin başlaması da buna bağlıdır.',
      ),
      kart(
        'Neden en zayıfı baskın?',
        '- **Kütle çekim:** hep çeker, büyük kütlelerde birikir.\n- **Elektrik:** zıt yükler birbirini götürür, büyük ölçekte sönümlenir.',
        undefined,
        { not: 'Küçük bir mıknatıs, koca Dünya\'nın çektiği çiviyi kaldırır — kütle çekim gerçekten en zayıf.' },
      ),
      kart(
        'Günlük kuvvetlerin kökeni',
        'İtme, sürtünme, gerilme ve tepki kuvvetleri aslında elektromanyetiktir.\nHepsi atomlar arasındaki etkileşimden doğar.\n"Temas kuvveti" diye ayrı bir temel kuvvet yoktur.',
      ),
    ], [
      soru('Zayıf nükleer kuvvetin menzili çekirdek boyundan da kısadır.', true, 'Güçlü nükleer çekirdek boyunda, zayıf nükleer ondan da kısa mesafede etkir.'),
      soru('Çekirdekteki protonları bir arada tutan güçlü nükleer kuvvettir.', true, 'Aynı yüklü protonların itmesini yenen kuvvet o.'),
      soru('Zayıf nükleer kuvvet, sürtünmenin bir çeşididir.', false, 'Sürtünme elektromanyetik kökenli; zayıf kuvvet çekirdek bozunmalarında etkili.'),
      soru('Kütle çekim en zayıf kuvvet olduğu için evrenin büyük yapılarında etkisizdir.', false, 'Menzili sonsuz ve her zaman çekici; büyük kütlelerde baskın olan o.'),
      sikli('Radyoaktif bozunmadan sorumlu temel kuvvet hangisidir?', ['Güçlü nükleer', 'Zayıf nükleer'], 1, 'Güneş\'teki füzyon zincirinin başlaması da zayıf kuvvete bağlı.'),
      sikli('Küçük bir mıknatısın çiviyi Dünya\'nın çekimine rağmen kaldırması neyi gösterir?', ['Kütle çekimin çok zayıf olduğunu', 'Çivinin kütlesiz olduğunu'], 0, 'Koca Dünya\'nın çekimini avuç içi kadar mıknatıs yeniyor.'),
      sikli('Sürtünme kuvvetinin kökeni hangi temel kuvvettir?', ['Kütle çekim', 'Elektromanyetik'], 1, 'Temas kuvvetlerinin hepsi atomlar arası elektromanyetik etkileşim.'),
      soru('Elektromanyetik kuvvet hem çekici hem itici olabilir.', true, 'Zıt yükler çeker, aynı yükler iter; kütle çekim ise hep çeker.'),
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
        'Hareketli sayılmak, seçilen referans noktasına bağlıdır.\nOtobüsteki yolcu yere göre hareketli, koltuğa göre durgundur.',
      ),
      kart(
        'Öteleme hareketi',
        'Cismin bütün noktaları aynı yönde ve aynı miktarda yer değiştirir.\nÖrnek: düz yolda giden araba',
      ),
      kart(
        'Dönme hareketi',
        'Cisim bir eksen çevresinde döner.\nNoktalar eksene uzaklıklarına göre farklı yol alır.\nÖrnek: tekerlek, pervane',
      ),
      kart(
        'Titreşim hareketi',
        'Denge noktası çevresinde ileri geri gidip gelmektir.\nÖrnek: sarkaç, yayın ucundaki kütle',
      ),
      kart(
        'Düzgün doğrusal hareket',
        'Hız sabit, ivme sıfırdır.\n- **Konum-zaman grafiği:** eğik bir doğru\n- **Hız-zaman grafiği:** yatay bir çizgi',
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
        'Eğim hızı verir:\n- **Dik doğru:** hızlı\n- **Yatay doğru:** duran cisim\n- **Aşağı inen doğru:** geri dönüş',
      ),
      kart(
        'İvme',
        'Hızın zamana göre değişimidir.\nÜçü de ivmelidir: hızlanmak, yavaşlamak ve yön değiştirmek.',
      ),
      kart(
        'İvmeli hareket',
        'Hız düzgün değişiyorsa konum-zaman grafiği eğrilir.\nSabit ivmede bu eğri bir paraboldür.',
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
        'Hava direnci yokken bütün cisimler aynı ivmeyle düşer:\n**g ≈ 9,8 m/s²**\nKütle düşme süresini değiştirmez.',
      ),
      kart(
        'Hız-zaman grafiğinde alan',
        '- **Alan:** yer değiştirme\n- **Eğim:** ivme\nYatay çizgi sabit hız, eğik çizgi sabit ivmedir.',
        undefined,
        { not: 'Eksenin altındaki alan negatif yer değiştirme; iki alanı toplarken işareti unutma, yol için mutlak değer.' },
      ),
      kart(
        'Ortalama hız hesabı',
        'Toplam yer değiştirme, toplam zamana bölünür; ara hızların ortalaması alınmaz.\nYolun yarısı 40, yarısı 60 km/h → ortalama 48 km/h, 50 değil.',
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
      sikli('Serbest düşen cismin ivmesi yaklaşık kaçtır?', ['9,8 m/s²', '9,8 m/s'], 0, 'İvmenin birimi m/s²; m/s hızın birimi.'),
      sikli('Yolun yarısını 40, yarısını 60 km/h ile giden aracın ortalama sürati?', ['48 km/h', '50 km/h'], 0, 'Ortalama sürat toplam yol / toplam zaman; ara hızların ortalaması değil.'),
      soru('Sabit süratle yön değiştiren cisim ivmeli hareket yapar.', true, 'Yön değişimi hız değişimidir; ivme sıfır değildir.'),
      soru('Konum-zaman grafiğinde aşağı inen doğru cismin geri döndüğünü gösterir.', true, 'Konum azalıyor: hareket ters yönde.'),
      soru('Dönen tekerlekte eksene uzak noktalar aynı sürede daha çok yol alır.', true, 'Dönmede noktalar eksene uzaklıklarına göre farklı yol alır.'),
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
        'Birim yüzeye dik etkiyen kuvvettir:\n**P = F / A**\nAynı kuvvet küçük alana uygulanırsa basınç büyür.',
      ),
      kart(
        'Birimi',
        '**Pascal (Pa) = N/m²**\nBir metrekareye bir newtonluk kuvvet uygulandığındaki basınçtır.',
      ),
      kart(
        'Alanla ters orantı',
        'Kuvvet sabitken alan yarıya inerse basınç iki katına çıkar.\nBasınç-alan grafiği bu yüzden bir hiperboldür.',
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
        '- **Bıçak ağzı, çivi ucu:** alan küçük, basınç büyük\n- **Kar ayakkabısı:** alan büyük, basınç küçük',
      ),
      kart(
        'Katı basıncı',
        '- **Katılar:** basıncı yalnızca temas yüzeyine ve aşağı iletir.\n- **Sıvı ve gazlar:** basıncı her yöne iletir.',
      ),
      kart(
        'Ağırlıktan gelen basınç',
        'Yere konan cismin basıncı = ağırlık / temas alanı\nCisim yan yatırılırsa temas alanı, dolayısıyla basınç değişir.',
      ),
      kart(
        'Dik duran kutu, yatan kutu',
        '- **Dar yüzeyi üstünde:** basınç büyük\n- **Geniş yüzeyi üstünde:** basınç küçük\nAğırlık ikisinde de aynıdır.',
        undefined,
        { not: 'Kutu devrilince ağırlık aynı kalır, sadece alan değişir: alan 2 katsa basınç yarı. Kuvvete dokunma.' },
      ),
    ], [
      soru('Basınç, kuvvetin uygulandığı yüzey alanıyla ters orantılıdır.', true, 'Aynı kuvvet küçük alana uygulanınca basınç büyüyor.'),
      soru('Kar ayakkabısı, kişinin ağırlığını azalttığı için batmayı önler.', false, 'Ağırlık aynı kalıyor; temas alanı büyüdüğü için basınç azalıyor.'),
      soru('Basıncın SI birimi pascaldır.', true, '1 Pa, 1 m² ye uygulanan 1 N luk kuvvet demek.'),
      soru('Bıçağın keskin olması uyguladığı kuvveti artırır.', false, 'Kuvvet aynı; alan küçüldüğü için basınç artıyor.'),
      sikli('Aynı kutu geniş yüzeyi üstüne yatırılınca basıncı ne olur?', ['Azalır', 'Artar'], 0, 'Ağırlık aynı, alan büyüdü; basınç küçüldü.'),
      sikli('Katılar basıncı hangi yönde iletir?', ['Yalnızca aşağı, temas yüzeyine', 'Her yöne eşit'], 0, 'Her yöne ileten sıvı ve gazlar.'),
      sikli('Ağırlığı 60 N olan kutu 0,5 m²\'lik yüzeyi üstünde durursa basınç?', ['120 Pa', '30 Pa'], 0, 'P = F / A = 60 / 0,5 = 120 Pa.'),
      soru('Kutu devrilip dar yüzeyi üstüne konursa ağırlığı artar.', false, 'Ağırlık aynı kalır; alan küçüldüğü için basınç artar.'),
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
        '- **Bağlı:** sıvının yoğunluğu, derinlik, yer çekimi ivmesi\n- **Bağlı değil:** kabın şekli, sıvının miktarı',
      ),
      kart(
        'Derinlikle artar',
        'Üstteki sıvı sütunu uzadıkça basınç büyür:\n**P = h · d · g**',
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
        'Aynı sıvı aynı yükseklikteyse taban basınçları eşittir.\nKaplardaki sıvı miktarı farklı olsa bile.',
        undefined,
        { not: 'P = h·d·g: aynı sıvı, aynı yükseklik → aynı basınç. Geniş kapta \'daha çok su var\' diye basınç artmaz.' },
      ),
      kart(
        'Her yöne iletir',
        'Durgun sıvı basıncı her yöne aynı şiddette iletir.\nBarajın alt kısmı bu yüzden daha kalın yapılır.',
      ),
      kart(
        'Pascal ilkesi',
        'Kapalı kaptaki sıvıya uygulanan basınç her noktaya aynen iletilir.\nHidrolik fren ve kriko bu ilkeyle çalışır.',
      ),
      kart(
        'Hidrolik kazanç',
        'Küçük pistona uygulanan az kuvvet, büyük pistonda büyük kuvvet olur.\nKuvvetten kazanılan kadar yoldan kaybedilir.',
      ),
      kart(
        'Bileşik kaplar',
        'Birbirine bağlı kaplarda aynı sıvı aynı seviyede durur.\nKapların şekli fark etmez.',
      ),
      kart(
        'Farklı sıvılar',
        'Bileşik kapta karışmayan iki sıvı varsa seviyeler eşit olmaz.\nYoğunluğu küçük olan sıvı daha yüksekte durur.',
      ),
    ], [
      soru('Sıvı basıncı, kabın şekline ve içindeki sıvı miktarına bağlıdır.', false, 'Yalnızca derinliğe, sıvının yoğunluğuna ve yer çekimine bağlı.'),
      soru('Kapalı bir kaptaki sıvıya uygulanan basınç her yöne aynen iletilir.', true, 'Pascal ilkesi; hidrolik sistemler buna dayanıyor.'),
      soru('Hidrolik sistemde küçük pistona uygulanan kuvvet, büyük pistonda büyütülür.', true, 'Basınç aynı kaldığı için geniş yüzeyde daha büyük kuvvet oluşuyor.'),
      soru('Bileşik kaplarda aynı sıvının seviyesi, kolun genişliğine göre değişir.', false, 'Sıvı bütün kollarda aynı seviyede durur; belirleyen derinlik.'),
      sikli('Barajın alt duvarı neden daha kalın yapılır?', ['Derinlikle basınç artar', 'Su aşağıda daha yoğundur'], 0, 'P = h·d·g; en derin nokta en büyük basınç.'),
      sikli('Bileşik kapta karışmayan iki sıvıdan hangisi daha yüksekte durur?', ['Yoğunluğu küçük olan', 'Yoğunluğu büyük olan'], 0, 'Aynı basıncı daha uzun sütunla dengeler.'),
      sikli('Hidrolik krikoda kuvvet kazanılırken ne kaybedilir?', ['Yol', 'Basınç'], 0, 'Kazanılan kuvvet kadar yol kaybedilir; iş korunur.'),
      sikli('10 m derinlikte suyun basıncı kaç Pa\'dır? (d = 1000 kg/m³, g = 10)', ['100.000', '10.000'], 0, 'P = h · d · g = 10 · 1000 · 10 = 100.000 Pa.'),
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
        'Atmosferdeki hava sütunu yeryüzüne basınç uygular.\nDeniz seviyesinde yaklaşık **101.325 Pa**’dır.',
      ),
      kart(
        'Torricelli deneyi',
        'Cıva dolu, ters çevrilmiş boruda cıva **76 cm**’de durur.\nBu yükseklik, açık hava basıncının ölçüsüdür.',
      ),
      kart(
        'Neden 76 cm?',
        'Cıva sütununun ağırlığı, dışarıdaki havanın basıncını dengeler.\nSu kullanılsaydı sütun yaklaşık 10 m olurdu.',
        undefined,
        { not: 'Su ile deney: 76 cm × 13,6 (cıva/su yoğunluk oranı) ≈ 10,3 m. Sayı sorulursa hesap böyle.' },
      ),
      kart(
        'Yükseklikle azalır',
        'Yukarı çıkıldıkça üstteki hava sütunu kısalır, basınç düşer.\nUçakta kulak tıkanmasının sebebi budur.',
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
        'Basınç azalınca su daha düşük sıcaklıkta kaynar.\nYüksek rakımda yemek bu yüzden geç pişer.',
      ),
      kart(
        'Günlük etkileri',
        'Pipet, vantuz ve şırınga açık hava basıncıyla çalışır.\nİçerideki basınç düşürülür, dışarıdaki hava iter.',
      ),
      kart(
        'Kapalı kaptaki gaz basıncı',
        'Gaz tanecikleri çarptıkları yüzeye basınç yapar.\nSıcaklık artınca ya da hacim küçülünce çarpma sıklaşır, basınç büyür.',
      ),
    ], [
      soru('Deniz seviyesinde açık hava basıncı 76 cm yüksekliğindeki cıva sütununun basıncına eşittir.', true, 'Torricelli deneyinin ölçtüğü değer bu.'),
      soru('Yükseklere çıkıldıkça açık hava basıncı artar.', false, 'Üstteki hava sütunu kısaldığı için basınç azalır.'),
      soru('Yüksek dağlarda su 100 °C nin altında kaynar.', true, 'Açık hava basıncı düştüğü için sıvı daha düşük sıcaklıkta kaynıyor.'),
      soru('Torricelli deneyinde cıva sütununun yüksekliği borunun kesit alanına bağlıdır.', false, 'Kesit değişse de yükseklik değişmez; belirleyen açık hava basıncı.'),
      sikli('Torricelli deneyi su ile yapılsaydı sütun yaklaşık kaç metre olurdu?', ['10 m', '1 m'], 0, 'Su cıvadan 13,6 kat az yoğun; sütun o kadar uzar.'),
      sikli('Açık hava basıncının kaynağı nedir?', ['Havanın ağırlığı', 'Güneş ışığı'], 0, 'Atmosferdeki hava sütunu yeryüzüne ağırlığıyla bastırır.'),
      sikli('Kapalı kaptaki gazın sıcaklığı artınca basıncı?', ['Artar', 'Değişmez'], 0, 'Tanecikler çepere daha sık ve hızlı çarpar.'),
      soru('Pipetle içmek açık hava basıncıyla çalışır.', true, 'Pipette basınç düşürülür, dışarıdaki hava sıvıyı iter.'),
      soru('Kapalı kaptaki gazın hacmi küçülürse basıncı artar.', true, 'Tanecikler çepere daha sık çarpar.'),
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
        'Cismin alt yüzeyine etkiyen sıvı basıncı, üst yüzeyindekinden büyüktür.\nAradaki fark yukarı doğru bir kuvvet üretir.',
      ),
      kart(
        'Arşimet ilkesi',
        'Kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşittir.\n**F = V(batan) · d(sıvı) · g**',
      ),
      kart(
        'Neye bağlı?',
        '- **Bağlı:** sıvının yoğunluğu, batan hacim\n- **Bağlı değil:** cismin kütlesi, derinlik',
        undefined,
        { not: 'F = V_batan · d_sıvı · g. Cismin kütlesi ve derinlik formülde yok; ikisi de şıkta çeldirici olarak gelir.' },
      ),
      kart(
        'Yüzme koşulu',
        'Yüzüp yüzmemeyi cisim ile sıvının yoğunlukları belirler.\nTabloda üç durum var.',
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
        'Yüzen cisimde kaldırma kuvveti ağırlığa eşittir.\nCismin yoğunluğu sıvınınkinin kaçta kaçıysa, hacminin o kadarı batar.',
      ),
      kart(
        'Görünen ağırlık',
        'Sıvıya batırılan cisim daha hafif gelir.\nDinamometre: gerçek ağırlık − kaldırma kuvveti',
      ),
      kart(
        'Gemi neden batmaz?',
        'Çelik yoğundur ama geminin içi boştur.\nOrtalama yoğunluğu sudan küçük kaldığı için yüzer.',
      ),
      kart(
        'Gazlarda da vardır',
        'Havadan hafif gazla dolu balon yükselir.\nHavanın kaldırma kuvveti, balonun ağırlığından büyüktür.',
      ),
      kart(
        'Tuzlu suda daha kolay yüzülür',
        'Tuz suyun yoğunluğunu artırır.\nAynı batan hacme daha büyük kaldırma kuvveti gelir; cisim daha az batar.',
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
        'Akışkanın sürati arttığı yerde çeperlere yaptığı **basınç azalır**.\nHızlı akan hava, yanındaki yüzeye daha az basınç yapar.',
        undefined,
        { not: 'İki kâğıdı yan yana tutup arasına üfle: kâğıtlar birbirine yaklaşır. Hızlı hava = düşük basınç.' },
      ),
      kart(
        'Süreklilik',
        'Boru daralınca akışkan hızlanır, çünkü birim zamanda aynı miktar geçmek zorundadır.\nDar kesitte hız artar, basınç düşer.',
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
        'İlke aslında enerji korunumudur.\nAkışkan hızlanınca kinetik enerjisi artar, basınç enerjisi azalır.',
      ),
      kart(
        'Uçak kanadı',
        'Kanadın üstünden geçen hava daha hızlıdır, orada basınç düşer.\nAlttaki yüksek basınç kanadı yukarı iter.',
      ),
      kart(
        'Bacadaki çekiş',
        'Baca ağzından geçen rüzgâr orada basıncı düşürür.\nİçerideki duman yukarı çekilir.',
      ),
      kart(
        'Günlük örnek',
        'Aynı ilkeyle olur:\n- Duş perdesinin içeri çekilmesi\n- Arasına üflenen iki yaprağın birbirine yaklaşması',
      ),
    ], [
      soru('Bir akışkanın hızı arttığında basıncı azalır.', true, 'Bernoulli ilkesi; enerjinin korunumundan çıkıyor.'),
      soru('Uçak kanadının üst yüzeyinde hava daha hızlı aktığı için basınç düşer.', true, 'Alttaki yüksek basınç kanadı yukarı iter.'),
      soru('Dar bir bölümden geçen suyun hızı azalır.', false, 'Süreklilik: kesit daraldıkça hız artar.'),
      soru('Bernoulli ilkesi enerjinin korunumu yasasıyla çelişir.', false, 'İlke tam da enerjinin korunumundan türetiliyor.'),
      sikli('Duş perdesinin içeri çekilmesinin sebebi?', ['Su perdeyi iter', 'Hızlı hava basıncı düşürür'], 1, 'Hızlanan hava akımı basıncı düşürür, dışarıdaki hava perdeyi iter.'),
      sikli('Bacada rüzgâr dumanı neden yukarı çeker?', ['Rüzgâr dumanı iter', 'Baca ağzında basınç düşer'], 1, 'Bernoulli: hızlı akışkan düşük basınç.'),
      soru('Yan yana tutulan iki kâğıdın arasına üflenirse kâğıtlar birbirinden uzaklaşır.', false, 'Aradaki hava hızlanır, basınç düşer; dıştaki hava kâğıtları birbirine iter.'),
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
        'Maddedeki taneciklerin kinetik ve potansiyel enerjilerinin toplamıdır.\nMadde miktarına bağlıdır.',
      ),
      kart(
        'Sıcaklık',
        'Taneciklerin **ortalama** kinetik enerjisinin ölçüsüdür.\nMadde miktarından bağımsızdır.',
      ),
      kart(
        'Isı',
        'Sıcaklık farkı yüzünden aktarılan enerjidir.\nMadde ısı içermez; ısı yalnızca aktarım sırasında vardır.',
      ),
      kart(
        'Üçü karıştırılıyor',
        'Üç kavram da enerjiyle ilgilidir ama farklı soruları yanıtlar.\nTabloyu karşılaştırarak oku.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne ölçer?'],
          satirlar: [
            ['İç enerji', 'Toplam enerji'],
            ['Sıcaklık', 'Ortalama enerji'],
            ['Isı', 'Aktarılan enerji'],
          ],
        },
        { not: 'Buz dolu kova, kaynar su damlasından daha çok iç enerji taşır; sıcaklık madde miktarını bilmez.' },
      ),
      kart(
        'Kıvılcım ve kazan',
        '- **Kıvılcım:** sıcaklığı yüksek, iç enerjisi az\n- **Ilık kazan:** sıcaklığı düşük, iç enerjisi çok',
      ),
      kart(
        'Aktarım yönü',
        'Isı her zaman **sıcaktan soğuğa** akar.\nTers yön kendiliğinden olmaz.',
      ),
      kart(
        'Sıcaklık birimleri',
        '- **Celsius:** suyun donma ve kaynamasına dayanır.\n- **Kelvin:** mutlak sıfıra dayanır.\n0 K = −273,15 °C',
      ),
      kart(
        'Isı ve sıcaklık birimleri',
        '- **Isı (enerji):** joule (J) ya da kalori (cal), 1 cal ≈ 4,18 J\n- **Sıcaklık:** °C ya da K, enerji birimi değil',
      ),
    ], [
      soru('Isı, sıcaklık farkı nedeniyle bir yerden başka yere aktarılan enerjidir.', true, 'Isı bir enerji aktarımı; cisimde "depolanan" şey iç enerji.'),
      soru('Bir kıvılcımın sıcaklığı kazandaki sudan yüksek olsa bile iç enerjisi düşüktür.', true, 'İç enerji tanecik sayısına da bağlı; kıvılcımda tanecik az.'),
      soru('Isı, iç enerjisi büyük olan cisimden küçük olana akar.', false, 'Aktarım yönünü iç enerji değil sıcaklık belirler.'),
      soru('Sıcaklık, cismin sahip olduğu toplam enerjidir.', false, 'Sıcaklık taneciklerin ortalama kinetik enerjisinin ölçüsü; toplam olan iç enerji.'),
      sikli('Isının SI birimi nedir?', ['Kelvin', 'Joule'], 1, 'Isı enerjidir; kelvin sıcaklık birimi.'),
      sikli('0 K kaç °C\'dir?', ['0', '−273,15'], 1, 'Kelvin mutlak sıfırdan başlar.'),
      sikli('İç enerji neye bağlıdır?', ['Madde miktarına da', 'Yalnızca sıcaklığa'], 0, 'Tanecik sayısı arttıkça toplam enerji artar.'),
      soru('Sıcaklık, madde miktarına bağlı değildir.', true, 'Ortalama bir değer; bir damla ile bir kazan aynı sıcaklıkta olabilir.'),
      soru('Celsius ölçeği suyun donma ve kaynama noktalarına dayanır.', true, 'Kelvin ise mutlak sıfıra dayanır.'),
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
        '1 gram maddenin sıcaklığını 1 °C artırmak için gereken ısıdır.\nMaddenin ayırt edici özelliğidir.',
      ),
      kart(
        'Suyun öz ısısı yüksek',
        'Su geç ısınır, geç soğur.\n- Deniz, kıyıdaki havayı yumuşatır.\n- Motorlar suyla soğutulur.',
      ),
      kart(
        'Isı sığası',
        'Bütün cismin sıcaklığını 1 °C artırmak için gereken ısıdır.\n**Isı sığası = m · c**',
      ),
      kart(
        'Öz ısı mı, ısı sığası mı?',
        '- **Öz ısı:** maddeye aittir, kütleyle değişmez.\n- **Isı sığası:** cisme aittir, kütle büyüdükçe büyür.',
        undefined,
        { not: '1 kg su ile 2 kg su: öz ısı aynı (4,18), ısı sığası ikincide 2 kat. Kütle değişince yalnızca sığa değişir.' },
      ),
      kart(
        'Hesap',
        '**Q = m · c · ΔT**\nAlınan ısı: kütle × öz ısı × sıcaklık değişimi',
      ),
      kart(
        'Grafikten öz ısı',
        'Sıcaklık-ısı grafiğinde:\n- **Dik doğru:** çabuk ısınır, öz ısı küçük\n- **Yatık doğru:** geç ısınır, öz ısı büyük',
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
        'Eşit kütleye aynı ısı verilirse öz ısısı küçük olan daha çok ısınır.\nDemir bu yüzden sudan önce ısınır, önce soğur.',
      ),
    ], [
      soru('Suyun öz ısısının yüksek olması, geç ısınıp geç soğumasının sebebidir.', true, 'Aynı sıcaklık artışı için daha çok ısı gerekiyor.'),
      soru('Isı sığası kütleye bağlıdır, öz ısı ise maddenin ayırt edici bir özelliğidir.', true, 'Isı sığası = kütle × öz ısı.'),
      soru('Q = m · c · ΔT bağıntısında c kütleyi gösterir.', false, 'c öz ısı, m kütle.'),
      soru('Sıcaklık-ısı grafiğinde dik doğru öz ısının büyük olduğunu gösterir.', false, 'Dik doğru az ısıyla çok ısınma demek: öz ısı küçük.'),
      sikli('Aynı ısı verilen eşit kütleli demir ve suyun hangisi daha çok ısınır?', ['Demir', 'Su'], 0, 'Öz ısısı küçük olan aynı ısıyla daha çok ısınır.'),
      sikli('Isı sığası nasıl hesaplanır?', ['c / m', 'm · c'], 1, 'Kütle × öz ısı; kütle büyüdükçe sığa büyür.'),
      sikli('200 g suyu 5 °C ısıtmak için kaç kalori gerekir? (c = 1 cal/g°C)', ['40', '1000'], 1, 'Q = m · c · ΔT = 200 · 1 · 5 = 1000 cal.'),
      soru('1 gram maddenin sıcaklığını 1 °C artırmak için gereken ısıya öz ısı denir.', true, 'Bütün cisim için olanı ısı sığası.'),
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
        'Hâl değişirken alınan ısı sıcaklığı değil, tanecikler arası bağları değiştirir.\nBu sırada sıcaklık sabit kalır.',
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
        { not: 'Grafikte yatay bölüm = hâl değişimi; o sırada verilen ısı Q = m·L, sıcaklık formülü (m·c·ΔT) kullanılmaz.' },
      ),
      kart(
        'Hâl değişimleri',
        '- **Erime / donma:** katı ↔ sıvı\n- **Buharlaşma / yoğuşma:** sıvı ↔ gaz\n- **Süblimleşme:** katıdan doğrudan gaza',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Katı' }, { ad: 'Sıvı' }, { ad: 'Gaz' }],
        },
      ),
      kart(
        'Erime ve donma ısısı',
        'Aynı madde için iki değer birbirine eşittir:\n- 1 g maddeyi eritmek için gereken ısı\n- 1 g madde donarken verdiği ısı',
      ),
      kart(
        'Buharlaşma her sıcaklıkta',
        '- **Buharlaşma:** yüzeyde, her sıcaklıkta\n- **Kaynama:** sıvının her yerinde, belirli bir sıcaklıkta',
      ),
      kart(
        'Buharlaşmayı hızlandıran',
        '- Sıcaklığın artması\n- Yüzey alanının büyümesi\n- Hava akımı\nNemli hava buharlaşmayı yavaşlatır.',
      ),
      kart(
        'Neden serinletir?',
        'Terin buharlaşması için gereken ısı deriden çekilir.\nBu yüzden ter buharlaşırken vücut serinler.',
      ),
      kart(
        'Suyun tuhaflığı',
        'Su donarken **genleşir**.\nBuz sudan hafif olduğu için yüzer; göl yüzeyden donar, dibi sıvı kalır.',
      ),
      kart(
        'Kaynama noktası basınca bağlı',
        'Basınç artınca kaynama noktası yükselir.\nDüdüklü tencerede su 100 °C’nin üstünde kaynar, yemek çabuk pişer.',
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
      soru('Göl kışın yüzeyden donar, dibi sıvı kalır.', true, 'Buz sudan hafif olduğu için yüzeyde kalır ve alttaki suyu yalıtır.'),
      soru('Su donarken hacmi küçülür.', false, 'Su donarken genleşir; buzun suda yüzmesinin sebebi bu.'),
      sikli('Katıdan doğrudan gaza geçişe ne denir?', ['Süblimleşme', 'Yoğuşma'], 0, 'Naftalin ve kuru buz süblimleşir.'),
      sikli('Düdüklü tencerede yemek neden çabuk pişer?', ['Basınç artınca kaynama noktası yükselir', 'Su daha çabuk kaynar'], 0, 'Su 100 °C\'nin üstünde kaynar.'),
      sikli('Terin buharlaşması vücudu neden serinletir?', ['Ter soğuktur', 'Buharlaşma ısısı deriden çekilir'], 1, 'Buharlaşmak için gereken ısı deriden alınır.'),
      sikli('Hangisi buharlaşmayı yavaşlatır?', ['Hava akımı', 'Nemli hava'], 1, 'Sıcaklık, yüzey ve rüzgâr hızlandırır; nem yavaşlatır.'),
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
        'Temas eden cisimler aynı sıcaklığa gelince net ısı akışı durur.\nBu duruma **ısıl denge** denir.',
      ),
      kart(
        'Alınan ısı = verilen ısı',
        'Yalıtılmış bir kapta:\nsıcak cismin verdiği ısı = soğuk cismin aldığı ısı',
      ),
      kart(
        'Denge sıcaklığı',
        'Son sıcaklık, iki başlangıç sıcaklığının arasındadır.\nKütlesi ve öz ısısı büyük olana daha yakın çıkar.',
      ),
      kart(
        'Denge ortalama değildir',
        'Farklı iki madde karışınca sonuç, sıcaklıkların ortalaması olmaz.\nÖz ısılar farklıysa denge ortadan kayar.',
        undefined,
        { not: '100 g 80 °C su + 100 g 20 °C su = 50 °C, ama su + demir olsa denge suya yakın çıkar (c_su > c_demir).' },
      ),
      kart(
        'Termometre nasıl çalışır?',
        'Termometre, ölçtüğü cisimle ısıl dengeye girer.\nGösterdiği değer kendi sıcaklığıdır.',
      ),
      kart(
        'Denge durgunluk değil',
        'Dengede ısı alışverişi durmaz, iki yönde eşitlenir.\nNet akış sıfırdır ama tanecikler hareket etmeye devam eder.',
      ),
    ], [
      soru('Isıl dengeye gelen iki cismin sıcaklıkları eşittir.', true, 'Net ısı akışı, sıcaklıklar eşitlendiğinde duruyor.'),
      soru('Denge sıcaklığı her zaman iki cismin sıcaklıklarının ortalamasıdır.', false, 'Kütleler ve öz ısılar eşit değilse denge sıcaklığı ortalamaya düşmez.'),
      soru('Termometre, ölçtüğü cisimle ısıl dengeye gelerek çalışır.', true, 'Okunan değer termometrenin kendi sıcaklığı, o da cismin sıcaklığına eşitlenmiş oluyor.'),
      soru('Isıl dengedeki cisimlerde taneciklerin hareketi durur.', false, 'Tanecikler hareketine devam eder; duran şey yalnızca net ısı akışı.'),
      sikli('Denge sıcaklığı başlangıç sıcaklıklarına göre nerededir?', ['İkisinin arasında', 'Sıcak olanın üstünde'], 0, 'Sıcak cisim soğur, soğuk ısınır; ikisi aradaki bir değerde buluşur.'),
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
        'Isı üç yolla aktarılır: iletim, konveksiyon ve ışıma.\nAralarındaki fark, enerjiyi neyin taşıdığıdır.',
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
        'Tanecikler yer değiştirmeden titreşir, enerjiyi komşusuna aktarır.\nKatılarda, özellikle metallerde baskındır.',
      ),
      kart(
        'Konveksiyon',
        'Isınan akışkan genleşip yükselir, soğuyan iner.\nKalorifer odayı bu döngüyle ısıtır.',
      ),
      kart(
        'Işıma',
        'Enerji elektromanyetik dalgalarla taşınır, **ortam gerekmez**.\nGüneş’in ısısı bize böyle ulaşır.',
      ),
      kart(
        'Renk ve ışıma',
        '- **Koyu ve mat yüzey:** ışımayı iyi soğurur ve yayar.\n- **Açık ve parlak yüzey:** ışımayı yansıtır.',
      ),
      kart(
        'Yalıtım',
        'Termos üç yolu birden keser:\n- **Çift cidar arası boşluk:** iletim ve konveksiyon\n- **Aynalı yüzey:** ışıma',
        undefined,
        { not: 'Işıma için ortam gerekmez: Güneş\'ten ısı boşluktan geliyor. \'Boşlukta ısı aktarılmaz\' şıkkı yanlış.' },
      ),
      kart(
        'Sıcak hava neden yükselir?',
        'Isınan havanın yoğunluğu azalır, kaldırma kuvvetiyle yükselir.\nBu yüzden klima yukarıya, kalorifer aşağıya konur.',
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
      soru('Metaller ısıyı iletimle tahtadan daha hızlı aktarır.', true, 'Metallerde serbest elektronlar enerjiyi hızla taşır.'),
      soru('Termosun çift cidarı arasındaki boşluk iletim ve konveksiyonu keser.', true, 'Boşlukta taşıyacak tanecik yok; aynalı yüzey de ışımayı keser.'),
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
        '- Malzemenin cinsi\n- Kesit alanı\n- İki uç arasındaki sıcaklık farkı\n- Uzunluk',
      ),
      kart(
        'Sıcaklık farkıyla doğru',
        'İki uç arasındaki fark büyüdükçe iletim hızlanır.\nFark sıfırsa akış durur.',
      ),
      kart(
        'Uzunlukla ters',
        'Yol uzadıkça iletim yavaşlar.\nKalın duvar ısı kaybını bu yüzden azaltır.',
      ),
      kart(
        'Kesit alanıyla doğru',
        'Kalın çubuk aynı sürede daha çok ısı taşır.\nAlan iki katına çıkarsa iletim hızı da iki katına çıkar.',
      ),
      kart(
        'Neden metal soğuk hisseder?',
        'Metal elden ısıyı hızlı çeker.\nAynı sıcaklıktaki tahta bu yüzden daha ılık hissedilir.',
        undefined,
        { not: 'Aynı odadaki tahta ve metal aynı sıcaklıkta; elin ölçtüğü şey sıcaklık değil ısı iletim hızı.' },
      ),
      kart(
        'Yalıtkanlar',
        'Hava, köpük ve yün ısıyı yavaş iletir.\nKışlık giysi asıl yalıtımı, arasında tuttuğu havayla yapar.',
      ),
      kart(
        'Çift cam',
        'İki cam arasındaki durgun hava katmanı iletimi keser.\nYalıtan camın kendisi değil, aradaki boşluktur.',
      ),
    ], [
      soru('Isı iletim hızı, çubuğun uzunluğuyla ters orantılıdır.', true, 'Yol uzadıkça aynı sürede geçen ısı azalıyor.'),
      soru('Kesit alanı büyüdükçe iletilen ısı miktarı azalır.', false, 'Doğru orantılı: geniş kesit daha çok ısı geçirir.'),
      soru('Aynı odadaki metal, tahtadan daha soğuk hissedilir çünkü sıcaklığı daha düşüktür.', false, 'İkisinin sıcaklığı aynı; metal ısıyı elden hızlı çektiği için soğuk hissediliyor.'),
      soru('Çift camın arasındaki hava tabakası ısı iletimini yavaşlattığı için yalıtım sağlar.', true, 'Hava kötü bir iletken.'),
      sikli('Çubuğun iki ucu arasındaki sıcaklık farkı artarsa iletim?', ['Hızlanır', 'Yavaşlar'], 0, 'İletim hızı sıcaklık farkıyla doğru orantılı.'),
      sikli('Hangisi ısıyı en yavaş iletir?', ['Bakır', 'Köpük'], 1, 'Köpüğün içindeki hava kabarcıkları iletimi yavaşlatır.'),
      sikli('Kışlık giysinin asıl yalıtımını ne sağlar?', ['Arasında tuttuğu hava', 'Kumaşın rengi'], 0, 'Hava kötü iletken; lifler onu hareketsiz tutar.'),
      soru('İki uç arasındaki sıcaklık farkı sıfırsa ısı akışı durur.', true, 'Akışı süren şey sıcaklık farkı.'),
      soru('Isı iletim hızı malzemenin cinsine bağlıdır.', true, 'Aynı boyutta bakır çubuk ahşaptan kat kat hızlı iletir.'),
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
