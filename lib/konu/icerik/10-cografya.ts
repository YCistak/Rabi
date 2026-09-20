import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 10. sınıf Coğrafya — Maarif Modeli.
 *
 * 9. sınıftaki yedi temanın aynısı; program konuları sınıf sınıf
 * derinleştiriyor. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Eski programın "Jeolojik Zamanlar" başlığı bu programda yok; yer şekilleri
 * doğrudan tektonik ve dış süreçler üzerinden işleniyor.
 *
 * Programın kendi terimleri kullanılıyor: Türk kültürünün yayılış alanı
 * "Orta Asya" değil **Türkistan**, afet bölümünün hedefi "bilinçli toplum"
 * değil **afete dirençli toplum**. Bir süre ikisi de gündelik karşılıklarıyla
 * yazılıydı ve öğrenci programda geçen terimi hiç görmüyordu.
 */
export const cografya10 = program('cografya', 10, 'Yer şekillerinden ekonomiye', [
  tema('cog10-t1', 'Coğrafyanın Doğası', [
    konu('cog10-bakis', 'Coğrafi Bakış', [
      kart(
        'Coğrafya olayı yeriyle birlikte düşünür',
        'Rize\'de çay yetişiyor, Konya\'da buğday. Neden? Rize yağışlı, Konya kurak. Coğrafi bakış, yani bir olayı olduğu yerle ve çevresiyle birlikte düşünmek. Olayın kendisi kadar nerede olduğu da önemli.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Coğrafya beş soruyla bakar',
        'Bir fabrikayı düşün. Nerede? Bu konum. Benzerleri nasıl yayılmış? Bu dağılış. Çevresini nasıl etkiliyor? Bu etkileşim. Nereye benziyor? Bu bölge. Ne kadar geniş alanı ilgilendiriyor? Bu ölçek.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Sorusu'],
          satirlar: [
            ['Konum', 'Nerede?'],
            ['Dağılış', 'Nasıl yayılmış?'],
            ['Etkileşim', 'Neyi etkiliyor?'],
            ['Bölge', 'Nereye benziyor?'],
            ['Ölçek', 'Ne kadar geniş?'],
          ],
        },
      ),
      kart(
        'Ölçek değişince cevap değişir',
        'Mahallende bir dükkân kapanınca "işler kötü" dersin. Ülke ölçeğinde bakınca o sektör belki büyüyor. Ölçek, yani olaya ne kadar geniş alandan baktığın. Yerel, bölgesel ve küresel ölçek farklı sonuç verir.',
        undefined,
        { not: 'Yorum yaparken hangi ölçekten konuştuğunu söyle; mahalle için doğru olan ülke için yanlış olabilir.' },
      ),
      kart(
        'Hiçbir yer tek başına değildir',
        'Rusya\'da kuraklık olur, buğday az çıkar; Mısır\'da ekmek pahalanır. Uzak iki yer birbirini etkiler. Buna etkileşim denir. Bir yerde olan şey orada kalmaz; ticaret, göç ve iklimle başka yerlere taşınır.',
      ),
      kart(
        'Coğrafya "neden orada" diye sorar',
        'Türkiye\'deki fındığın çoğu Karadeniz kıyısında. "Nerede" sorusunun cevabı bu. Coğrafya burada durmaz: neden orada? Çünkü fındık ılık ve yağışlı iklim ister. Dağılışın sebebini bulmak asıl iş.',
      ),
      kart(
        'Doğa sınırlar, insan sınırın içinde seçer',
        'Çöle pirinç ekemezsin; doğa buna izin vermez. Ama kanal açıp hurma yetiştirebilirsin. Doğa neyin mümkün olduğunu belirler, insan mümkünler arasından seçer. Hollanda denizden toprak kazandı; ilişki iki yönlü.',
      ),
    ], [
      soru('Coğrafi bakış, olayları yer ve ölçek ilişkisi içinde değerlendirmektir.', true, 'Aynı olay yerel ve küresel ölçekte farklı okunuyor.'),
      soru('Bir olay, incelendiği ölçeğe göre farklı görünebilir.', true, 'Mahallede sorun görünmeyen şey ülke ölçeğinde büyük bir örüntü olabiliyor.'),
      soru('Doğa insanı tümüyle belirler; insanın doğayı değiştirme gücü yoktur.', false, 'İlişki karşılıklı: Hollanda denizden toprak kazandı, çölde kanalla hurma yetişiyor.'),
      soru('Coğrafyada neden-sonuç ilişkisi aranmaz.', false, 'Fındık neden Karadeniz\'de? Bunu sormak coğrafyanın asıl işi.'),
      sikli('Aynı olayın yerel ve küresel ölçekte farklı görünmesi neyi anlatır?', ['Etkileşim', 'Ölçek meselesi'], 1, 'Ölçek değişince sonuç değişir.'),
      sikli('Bugünkü coğrafya doğa-insan ilişkisine nasıl bakar?', ['Doğa her şeyi belirler', 'Karşılıklı'], 1, 'Doğa sınır çizer, insan içinde seçer.'),
      soru('Bir bölgedeki kuraklık başka kıtadaki gıda fiyatını etkileyebilir.', true, 'Rusya\'da kuraklık, Mısır\'da pahalı ekmek: etkileşim.'),
    ], [
      {
        soru: 'Coğrafi bakışın "nerede"den sonra sorduğu asıl soru?',
        siklar: ['Neden orada?', 'Ne zaman?'],
        dogru: 0,
        aciklama: {
          dogru: 'Dağılışın arkasındaki sebep coğrafyanın asıl işi.',
          yanlis: '"Ne zaman" tarihin sorusu. Coğrafya "nerede" ile yetinmez, "neden orada" diye sorar.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('cog10-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog10-cbs-uygulama', 'CBS ve Uzaktan Algılamanın Uygulama Alanları', [
      kart(
        'CBS haritaları katman katman üst üste koyar',
        'Bir şeffaf kâğıda yolları, ötekine okulları, üçüncüsüne nüfusu çiz. Üst üste koyunca "okulu olmayan kalabalık mahalle" görünür. CBS, yani Coğrafi Bilgi Sistemi, bunu bilgisayarda yapar. Sadece çizmez, katmanları karşılaştırıp sorgular.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Uzaktan algılama yere dokunmadan bakar',
        'Uydu bir ormanın fotoğrafını çeker; sen ormana gitmeden yangının nereye yayıldığını görürsün. Uzaktan algılama, yani uydu ya da uçakla uzaktan görüntü alma. Görüntü CBS\'ye bir katman olarak girer.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Afette önce uydu görüntüsüne bakılır',
        'Deprem oldu; hangi mahalle en çok yıkıldı? Depremden önceki ve sonraki uydu görüntüsü yan yana konur, yıkım hemen görünür. Ekipler oraya gönderilir. Risk haritası ve tahliye planı da CBS ile önceden hazırlanır.',
      ),
      kart(
        'Şehir planı katmanlarla yapılır',
        'Yeni hastane nereye yapılmalı? Nüfus, yol ve mevcut hastane katmanlarını üst üste koy. Kalabalık ama hastanesiz, yola yakın yer belli olur. İmar, altyapı ve ulaşım planları böyle çözülür.',
      ),
      kart(
        'Tarla ve orman gökten izlenir',
        'Uydu görüntüsünde sağlıklı bitki ile kuruyan bitki farklı renk verir. Böylece hangi tarlada kuraklık başladı, hangi ormanda yangın çıktı görülür. Ürün miktarı hasattan önce tahmin edilir.',
      ),
      kart(
        'Salgın haritası kaynağı doğru yere yollar',
        'Her hastanın adresini haritaya nokta olarak koy. Noktalar bir mahallede yığılıyorsa salgın orada. Aşı ve doktor önce oraya gider. Navigasyon ve kargo takibi de aynı mantık: konum verisi haritada.',
      ),
      kart(
        'Asıl güç iki tarihi karşılaştırmaktır',
        'Bir buzulun bugünkü fotoğrafı sana "eridi" demez. On yıl önceki fotoğrafın yanına koy: ne kadar küçüldüğü ölçülür. Uzaktan algılamanın gücü tek görüntü değil, aynı yerin farklı zamanlardaki görüntüleri.',
        undefined,
        { not: 'Tek görüntü sadece fotoğraf; değişimi görmek için aynı yerin iki tarihini yan yana koy.' },
      ),
    ], [
      soru('CBS, afet sonrası hasar tespitinde kullanılır.', true, 'Önceki ve sonraki görüntü yan yana konarak yıkım görülüyor.'),
      soru('Uzaktan algılama orman yangınlarının izlenmesinde kullanılır.', true, 'Uydu görüntüsünde yanan alan farklı renk veriyor.'),
      soru('CBS yalnızca harita çizer, analiz yapamaz.', false, 'Katmanları karşılaştırıp sorgulamak asıl gücü.'),
      soru('CBS verilerinde zaman boyutu bulunmaz.', false, 'Farklı tarihli görüntüler karşılaştırılarak değişim ölçülüyor.'),
      sikli('Salgın haritası ne için kullanılır?', ['Kaynakları yoğunluğa göre dağıtmak', 'Hastalığı tedavi etmek'], 0, 'Aşı ve doktor önce yığılma olan mahalleye.'),
      sikli('Kargo takibi ve navigasyon hangi teknolojinin ürünü?', ['Konum verisi ve CBS', 'Yalnızca uydu fotoğrafı'], 0, 'Konum verisi haritada.'),
      sikli('Buzul erimesi nasıl ölçülür?', ['Yıllar arası uydu görüntüsü karşılaştırarak', 'Yerinde termometreyle'], 0, 'İki tarih yan yana.'),
      soru('Uydu görüntüsü afetin ilk saatlerinde hasar tespitinde kullanılır.', true, 'Ekipler en çok yıkılan yere hemen yönlendirilir.'),
    ], [
      {
        soru: 'Uzaktan algılamanın değişimi ölçmedeki gücü nereden gelir?',
        siklar: ['Görüntünün renkli olması', 'Aynı yerin farklı zamanlardaki görüntüsü'],
        dogru: 1,
        aciklama: {
          dogru: 'On yıl arayla iki görüntü, buzul ya da orman kaybını doğrudan ölçtürür.',
          yanlis: 'Renk yalnızca gösterim. Asıl güç zaman boyutu: aynı alanın yıllar arası karşılaştırması.',
        },
        kart: 7,
      },
    ]),
    konu('cog10-veri-harita', 'Mekânsal Verilerin Haritalara Aktarılması', [
      kart(
        'Önce altlık harita seçilir',
        'Okulundaki öğrencilerin nerede oturduğunu haritaya işleyeceksin. Önce boş bir şehir haritası lazım: mahalleler, yollar, kıyı. Bu, altlık harita. Yanlış altlık seçersen noktalar yanlış mahalleye düşer.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Veri ya çizgi ya pikseldir',
        'Bir yolu haritaya çizgi, bir okulu nokta, bir gölü alan olarak çizersin: bu vektör veri. Uydu fotoğrafı ise küçük renkli karelerden, yani piksellerden oluşur: bu raster veri. Rastere yaklaşınca kareler belirir, vektör bozulmaz.',
        {
          tur: 'tablo',
          basliklar: ['Vektör', 'Raster'],
          satirlar: [
            ['Nokta, çizgi, alan', 'Piksel'],
            ['Yol, sınır, bina', 'Uydu görüntüsü'],
            ['Yakınlaşınca bozulmaz', 'Yakınlaşınca bozulur'],
          ],
        },
      ),
      kart(
        'Harita beş adımda yapılır',
        'Önce amaç: "nüfus yoğunluğunu göstereceğim." Sonra veri toplanır, gruplara ayrılır, haritaya işlenir; en sona lejant ve ölçek konur. Lejant, yani renklerin ne anlama geldiğini yazan kutu. Amaçsız başlarsan ne toplayacağını bilemezsin.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Amaç belirle' },
            { ad: 'Veri topla' },
            { ad: 'Sınıflandır' },
            { ad: 'Haritaya işle' },
            { ad: 'Lejant ve ölçek', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Aralıklar haritayı değiştirir',
        'İllerin nüfusunu "1 milyon altı, 1 milyon üstü" diye ikiye ayır: harita neredeyse tek renk. Beş gruba ayır: farklar belirir. Aynı veri, farklı aralık, bambaşka görüntü. Bu gruplara ayırma işine sınıflandırma denir.',
        undefined,
        { not: 'Haritaya bakarken yalnız renklere değil lejanttaki aralıklara da bak; aralık değişince görüntü değişir.' },
      ),
      kart(
        'Artan değer için tek rengin tonları',
        'Yağış az-orta-çok gösterilecekse açık maviden koyu maviye git; koyulaştıkça arttığını herkes anlar. Sıcak ve soğuk gibi iki karşıt şey için kırmızı ve mavi kullan. Rastgele renk okuru şaşırtır.',
      ),
      kart(
        'Koordinat sistemi tutmazsa harita kayar',
        'Yol katmanı bir sistemde, bina katmanı başka sistemde çizilmişse binalar yolun üstüne düşer. Koordinat sistemi, yani noktanın yerini sayıyla yazma kuralı. Bütün katmanlar aynı sistemde olmalı; yoksa harita sessizce yanlış olur.',
      ),
    ], [
      soru('Altlık harita, üzerine veri işlenen temel haritadır.', true, 'Mahalle, yol ve kıyı gibi değişmeyen ögeleri taşıyor.'),
      soru('Verinin sınıflandırılma biçimi haritanın verdiği izlenimi değiştirir.', true, 'Aynı nüfus verisi iki grupta tek renk, beş grupta farklı görünüyor.'),
      soru('Harita renkleri rastgele seçilebilir, okumayı etkilemez.', false, 'Artan değer tek rengin tonlarıyla gösterilir; rastgele renk okuru şaşırtır.'),
      soru('Farklı koordinat sistemindeki katmanlarla güvenilir bir harita üretilebilir.', false, 'Katmanlar birbirine oturmaz; binalar yolun üstüne düşer.'),
      sikli('Artan bir değer haritada nasıl gösterilir?', ['Tek rengin tonlarıyla', 'Rastgele renklerle'], 0, 'Karşıt değerler için iki renk.'),
      sikli('Katmanlar birbirine oturmuyorsa sebep ne olabilir?', ['Farklı koordinat sistemi', 'Yanlış renk'], 0, 'Harita sessizce kayar.'),
      soru('Aynı veri farklı sınıf aralıklarıyla farklı izlenim verebilir.', true, 'İki grup ve beş grup bambaşka harita verir.'),
    ], [
      {
        soru: 'Nokta, çizgi ve alan olarak saklanan veri hangi türdür?',
        siklar: ['Vektör', 'Raster'],
        dogru: 0,
        aciklama: {
          dogru: 'Raster veri pikselden oluşur (uydu görüntüsü); vektör geometrik nesnelerden.',
          yanlis: 'Raster piksel ızgarasıdır, uydu görüntüsü gibi. Nokta-çizgi-alan vektör verinin biçimi.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('cog10-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog10-tektonik', 'Tektonik Süreçler', [
      kart(
        'Yer kabuğu parçalara bölünmüştür',
        'Kaynayan çorbanın üstündeki kaymak parçalarını düşün; alttaki hareketle yavaşça kayarlar. Yer kabuğu da böyle: dev parçalara bölünmüş. Bu parçalara levha denir. Levhalar yılda birkaç santimetre hareket eder.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Levhaları mantonun ısısı yürütür',
        'Yerin içi soğan gibi katmanlı. En üstte ince ve katı kabuk, altında akışkan manto, en içte sıcak çekirdek. Mantoda ısınan madde yukarı çıkar, soğuyan aşağı iner. Bu akım üstteki levhayı sürükler.',
        {
          tur: 'katman',
          eksenAdi: 'DERİNLİK',
          katmanlar: [
            { ad: 'Yer kabuğu', alt: 'ince, katı' },
            { ad: 'Manto', alt: 'akışkan' },
            { ad: 'Dış çekirdek', alt: 'sıvı' },
            { ad: 'İç çekirdek', alt: 'katı' },
          ],
        },
      ),
      kart(
        'Levhalar üç türlü karşılaşır',
        'İki levha birbirinden uzaklaşırsa araya magma dolar, yeni kabuk oluşur. Birbirine yaklaşırsa biri ötekinin altına dalar; dağ ve volkan doğar. Yan yana sürtünürse kayaç kırılır, deprem olur.',
        {
          tur: 'tablo',
          basliklar: ['Sınır', 'Sonuç'],
          satirlar: [
            ['Uzaklaşan', 'Okyanus sırtı'],
            ['Yaklaşan', 'Dağ, volkan'],
            ['Yanal', 'Deprem, fay'],
          ],
        },
      ),
      kart(
        'İç kuvvetler yeryüzünü engebelendirir',
        'Enerjisini yerin içinden alan kuvvetlere iç kuvvet denir. Dağ oluşumuna orojenez, kıtaların geniş alanda yavaşça yükselip alçalmasına epirojenez denir. Volkanizma ve deprem de iç kuvvet. Hepsi yüzeyi düzleştirmez, engebelendirir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Anadolu iki levha arasında sıkışıyor',
        'Güneyden Arap levhası itiyor, kuzeyde Avrasya levhası duvar gibi duruyor. Arada kalan Anadolu ezilir ve batıya, Ege\'ye doğru kaçar. Türkiye\'nin sık deprem yaşamasının sebebi bu sıkışma.',
        undefined,
        { not: 'Fay adlarını değil sıkışmayı anla: iki levha bastırıyor, Anadolu batıya kaçıyor.' },
      ),
      kart(
        'Deprem iki büyük fay boyunca gelir',
        'Fay, yani kayaçların kırılıp kaydığı çizgi. Türkiye\'de en etkin ikisi Kuzey Anadolu Fayı ve Doğu Anadolu Fayı. 1999 Gölcük depremi kuzeydekinin, 2023 Kahramanmaraş depremi doğudakinin ürünü.',
      ),
      kart(
        'Deprem, biriken enerjinin boşalmasıdır',
        'Bir cetveli iki ucundan bük: önce eğilir, sonra çat diye kırılır. Levhalar sürtünürken kayaç böyle bükülür ve enerji biriktirir. Dayanma sınırı aşılınca kayaç kırılır; enerji dalga olarak yayılır. Deprem budur.',
      ),
    ], [
      soru(
        'Levhalar iç çekirdek üzerinde hareket eder.',
        false,
        'Levhalar mantonun üst kısmındaki akışkan tabaka üzerinde hareket ediyor.',
        {
          tur: 'katman',
          eksenAdi: 'derinlik',
          katmanlar: [
            { ad: 'Yer kabuğu' },
            { ad: 'Manto' },
            { ad: 'Dış çekirdek' },
            { ad: 'İç çekirdek' },
          ],
        },
      ),
      soru('Türkiye, deprem riski yüksek bir kuşakta yer alır.', true, 'Anadolu, Arap ve Avrasya levhaları arasında sıkışıyor.'),
      soru('Depremler levha sınırlarında ve fay hatlarında yoğunlaşır.', true, 'Enerji buralarda birikip boşalıyor.'),
      soru('İç kuvvetler yeryüzünü düzleştirir.', false, 'İç kuvvetler engebelendirir; düzleştiren dış kuvvetlerdir.'),
      sikli('Uzaklaşan levha sınırında ne olur?', ['Dalma-batma', 'Yeni kabuk oluşur'], 1, 'Yaklaşanda dalma-batma.'),
      sikli('Anadolu levhası neden batıya itiliyor?', ['Manto soğuyor', 'Avrasya ve Arap levhaları arasında sıkışıyor'], 1, 'Türkiye\'nin depremselliği.'),
      sikli('Dağ oluşumuna ne denir?', ['Epirojenez', 'Orojenez'], 1, 'Epirojenez kıtanın yavaşça yükselip alçalması.'),
      sikli('Deprem enerjisi nasıl birikir?', ['Volkan patlayınca', 'Levhalar sürtünürken'], 1, 'Kayaç dayanma sınırını aşınca kırılır.'),
      soru('Çekirdek yerin en sıcak bölümüdür.', true, 'Kabuk ince ve katı, manto akışkan, çekirdek en sıcak.'),
    ], [
      {
        soru: 'Levhaları hareket ettiren nedir?',
        siklar: ['Mantodaki ısı akımları', 'Ay\'ın çekimi'],
        dogru: 0,
        aciklama: {
          dogru: 'Akışkan mantoda ısınan madde yükselir, soğuyan iner; bu akım üstteki kabuğu sürükler.',
          yanlis: 'Ay\'ın çekimi gelgiti yapar. Levhaları sürükleyen mantodaki ısı akımları.',
        },
        kart: 2,
      },
    ]),
    konu('cog10-asinma', 'İklim ve Kayaç Yapısının Aşınmaya Etkisi', [
      kart(
        'Isınıp soğuyan kaya çatlar',
        'Çöl kayası gündüz kızar, gece buz gibi olur. Genleşip büzülen kaya sonunda çatlar. Çatlağa giren su donunca genişler, kayayı parçalar. Kaya kimyaca değişmez, sadece ufalanır. Buna fiziksel ayrışma denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Su ve asit kayayı eritir',
        'Yağmur suyu havadaki karbondioksiti alır ve hafif asit olur. Bu su kireç taşına değince onu yavaşça çözer, yani eritir. Kaya artık aynı madde değil. Buna kimyasal çözünme denir. Sıcak ve nemli yerde hızlı çalışır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İklim hangisinin kazanacağını söyler',
        'Çölde su az, sıcaklık farkı büyük: fiziksel ayrışma öne çıkar. Yağmur ormanında su bol, hava sıcak: kimyasal çözünme öne çıkar. Bir bölgeye bakınca önce iklimine bak.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fiziksel', 'Kimyasal'],
          satirlar: [
            ['İklim', 'Kurak, soğuk', 'Sıcak, nemli'],
            ['Değişim', 'Şekil', 'Yapı'],
            ['Örnek', 'Donma-çözülme', 'Karstlaşma'],
          ],
        },
      ),
      kart(
        'Kaya türü de sonucu değiştirir',
        'Aynı yağmur iki kayaya düşsün. Kireç taşı çözünür ve içi mağara gibi oyulur. Granit çözünmez; ancak sıcaklık farkıyla çatlar. Yani sonuç hem iklime hem kayanın cinsine bağlı.',
        undefined,
        { not: 'Soruda iki şeye bak: kaya ne, iklim ne? Kireç taşı ve nemli iklim görürsen kimyasal çözünme.' },
      ),
      kart(
        'Kireç taşı çözününce karstik şekil doğar',
        'Kireç taşının yüzeyinde suyun açtığı oluklar lapya, çukurlar dolin, ani çöken derin kuyular obruk. Yer altında mağara; tavanından damlayan su sarkıt ve dikit yapar. Bunlara karstik şekiller denir.',
      ),
      kart(
        'Toroslar karstik şekil cennetidir',
        'Türkiye\'de kireç taşı en çok Akdeniz\'de: Toroslar ve Taşeli Platosu. Antalya\'daki Damlataş Mağarası, Mersin\'deki Cennet-Cehennem obrukları buradan. Karstik şekil sorulunca aklına Akdeniz gelsin.',
      ),
      kart(
        'Bitki örtüsü toprağı yerinde tutar',
        'İki yamaç düşün: biri ormanlı, biri çıplak. Aynı sağanakta çıplak yamaçtan çamur akar; ormanlı yamaçta kökler toprağı tutar. Bitki örtüsü aşınmayı yavaşlatır. Orman kesilince erozyon, yani toprağın taşınması hızlanır.',
      ),
    ], [
      soru('Fiziksel ayrışma, günlük sıcaklık farkının fazla olduğu kurak bölgelerde etkilidir.', true, 'Kayaç ısınıp soğudukça çatlıyor.'),
      soru('Karstik şekiller kireç taşının çözünmesiyle oluşur.', true, 'Karbondioksitli yağmur suyu kireç taşını eritiyor.'),
      soru('Kimyasal çözünme kurak ve soğuk bölgelerde en etkilidir.', false, 'Nemli ve sıcak bölgelerde etkili; su ve sıcaklık çözünmeyi hızlandırıyor.'),
      soru('Bitki örtüsü aşınmayı hızlandırır.', false, 'Kökleriyle toprağı tutarak aşınmayı yavaşlatıyor.'),
      sikli('Donma-çözülme hangi ayrışma türüdür?', ['Fiziksel', 'Kimyasal'], 0, 'Kaya kimyaca değişmez, sadece ufalanır.'),
      sikli('Kolay çözünen ve karstik şekil veren kayaç?', ['Kireç taşı', 'Granit'], 0, 'Lapya, dolin, obruk.'),
      sikli('Türkiye\'de karstik şekiller nerede zengindir?', ['Taşeli ve Toroslar', 'Doğu Anadolu'], 0, 'Kireç taşı en çok Akdeniz\'de.'),
      sikli('Bitki örtüsü aşınmayı nasıl etkiler?', ['Yavaşlatır', 'Hızlandırır'], 0, 'Kökler toprağı tutar.'),
      soru('Sıcak ve nemli iklimde kimyasal çözünme hızlıdır.', true, 'Su ve sıcaklık çözünmeyi hızlandırır.'),
    ], [
      {
        soru: 'Kurak iklimde hangi ayrışma türü baskındır?',
        siklar: ['Fiziksel', 'Kimyasal'],
        dogru: 0,
        aciklama: {
          dogru: 'Gündüz-gece sıcaklık farkı kayayı çatlatır; çözünme için su gerekir ve su az.',
          yanlis: 'Kimyasal çözünme su ve sıcaklık ister; nemli iklimde baskın. Kurakta sıcaklık farkı kayayı fiziksel olarak parçalar.',
        },
        kart: 3,
      },
    ]),
    konu('cog10-asinim-birikim', 'Aşınım ve Birikim Süreçlerinin Etkisi', [
      kart(
        'Dış kuvvetler güneşten güç alır',
        'Yağmuru güneş buharlaştırıp yağdırır; rüzgârı güneşin ısıttığı hava üretir. Akarsu, rüzgâr, buzul, dalga ve yer altı suyu dış kuvvet. Enerjileri güneşten gelir. Yüksek yeri aşındırır, çukuru doldururlar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İç kuvvet yükseltir, dış kuvvet tıraşlar',
        'Dağı iç kuvvetler yükseltir; yağmur, rüzgâr ve buzul o dağı yıllar içinde aşındırır. Aşınan malzeme çukurlarda birikir. Gördüğün her yer şekli bu iki kuvvetin o anki dengesi.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'İç kuvvet', alt: 'yükseltir' },
            { ad: 'Dış kuvvet', alt: 'aşındırır' },
            { ad: 'Birikim', alt: 'doldurur' },
          ],
        },
      ),
      kart(
        'Türkiye\'yi en çok akarsu şekillendirir',
        'Akarsu yüksekte derin vadi kazar. Dağdan ovaya inince yavaşlar, taşıdığı çakılı yelpaze gibi yığar: birikinti konisi. Denize dökülürken kumu biriktirir: delta. Çukurova bir delta. Türkiye\'de en etkili dış kuvvet akarsu.',
      ),
      kart(
        'Menderes yavaşlayan suyun kıvrımıdır',
        'Ovada eğim azalınca akarsu yavaşlar ve kıvrılarak akar. Kıvrımın dış tarafında su hızlı, orayı aşındırır; iç tarafında yavaş, oraya kum bırakır. Kıvrım büyür. Buna menderes denir; Büyük Menderes Nehri adını buradan alır.',
      ),
      kart(
        'Rüzgâr çölde kum taşır, kaya oyar',
        'Rüzgâr kum tanelerini kaldırıp kayaya çarptırır. Kayanın altı üstünden çok aşınır: mantar kaya. Taşınan kum yığılınca kumul olur. Bitki örtüsü olmayan kurak alanda rüzgâr etkili; ot olsa kumu tutardı.',
      ),
      kart(
        'Buzul tabanı ve yamaçları birlikte yontar',
        'Dağın tepesinde kar birikir, sıkışıp buz olur ve yavaşça kayar. Buzul tabanı ve iki yamacı birden kazır: U biçimli vadi. Erirken taşıdığı çakılı yığın hâlinde bırakır: moren. Türkiye\'de yalnız yüksek dağlarda görülür.',
      ),
      kart(
        'Dalga kıyıyı hem yıkar hem doldurur',
        'Dalga dik kıyıya çarpa çarpa altını oyar; kaya çöker, dik uçurum kalır: falez. Aşınan kum sakin koya taşınıp yığılır: kumsal. Kum bir koyun ağzını kapatırsa arkasında göl kalır: lagün.',
      ),
      kart(
        'Vadinin şekli kuvvetin adını söyler',
        'Bir vadi gördün. Dar ve V harfi gibi mi? Onu akarsu kazmış. Geniş tabanlı U gibi mi? Onu buzul yontmuş. Şekil, kuvveti ele verir; sınav bunu ters yönden sorar.',
        undefined,
        { not: 'Soruda "U şekilli vadi" görürsen buzul, "V şekilli" görürsen akarsu; ikisini karıştırma.' },
      ),
    ], [
      soru('Menderesler, eğimin azaldığı yerlerde oluşur.', true, 'Yavaşlayan akarsu ovada kıvrılarak akıyor.'),
      soru('Buzul vadileri U biçimli, akarsu vadileri V biçimlidir.', true, 'Vadinin biçimi onu oluşturan kuvveti ele veriyor.'),
      soru('Dış kuvvetlerin enerji kaynağı yerin iç ısısıdır.', false, 'Dış kuvvetler güneşle çalışır; iç ısı iç kuvvetlerin kaynağı.'),
      soru('Delta ovaları akarsuyun aşındırma gücüyle oluşur.', false, 'Taşıdığı kumu denize dökülürken biriktirmesiyle oluşuyor; Çukurova örnek.'),
      sikli('Türkiye\'de en etkili dış kuvvet?', ['Akarsu', 'Buzul'], 0, 'Vadi, menderes, delta.'),
      sikli('Mantar kaya ve kumul hangi kuvvetin ürünü?', ['Rüzgâr', 'Dalga'], 0, 'Kurak, bitkisiz alanlar.'),
      sikli('Falez ve lagün hangi kuvvetin ürünü?', ['Dalga ve akıntı', 'Buzul'], 0, 'Kıyı şekilleri.'),
      sikli('Menderes nerede oluşur?', ['Eğimin azaldığı yerde', 'Dik yamaçta'], 0, 'Akarsu yavaşlayınca kıvrılır.'),
      sikli('Dış kuvvetler enerjisini nereden alır?', ['Yerin içinden', 'Güneşten'], 1, 'İç kuvvetler yerin içinden.'),
      soru('İç kuvvetler yükseltir, dış kuvvetler tıraşlar.', true, 'Yer şekilleri iki yönün dengesi.'),
    ], [
      {
        soru: 'U biçimli vadi hangi kuvvetin izidir?',
        siklar: ['Akarsu', 'Buzul'],
        dogru: 1,
        aciklama: {
          dogru: 'Buzul tabanı ve yamaçları birlikte yontar; akarsu V şeklinde derine kazar.',
          yanlis: 'Akarsu V biçimli vadi açar. Geniş tabanlı U vadi buzulun tabanı ve kenarları birlikte oyduğu yer.',
        },
        kart: 8,
      },
    ]),
    konu('cog10-saha', 'Yeryüzü Şekilleri ile İlgili Saha Çalışması', [
      kart(
        'Saha çalışması araziye gidip bakmaktır',
        'Kitapta "menderes" okursun; nehrin kenarına gidip kıvrımı görmek başka. Coğrafi olayı yerinde gözleyip veri toplamaya saha çalışması denir. Coğrafyanın laboratuvarı arazi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Araziye çıkmadan önce plan yapılır',
        'Nereye gideceksin, neye bakacaksın? Önce amacı yaz. Bölgenin haritasına ve hava fotoğrafına bak. Yanına metre, pusula, defter al. Hava durumunu ve güvenlik planını unutma.',
      ),
      kart(
        'Arazide gördüğünü hemen kaydet',
        'Yamaçtaki kaya katmanlarını gör, fotoğrafını çek, defterine eskiz yani hızlı bir çizim yap. Eğimi ölç. Her kaydın yanına nerede ve saat kaçta olduğunu yaz.',
      ),
      kart(
        'Yeri yazılmayan gözlem veri olmaz',
        'Defterde "büyük bir heyelan gördüm" yazıyor ama nerede? Bilinmiyor. Bu gözlem haritaya konamaz, başka gözlemle karşılaştırılamaz. Konum ve zaman yazılmamışsa gözlem veri değildir.',
        undefined,
        { not: 'Yeri yazılmamış gözlem coğrafi değil; ölçmeden önce nerede olduğunu yaz.' },
      ),
      kart(
        'Uydu görüntüsüyle de saha gezilir',
        'Antarktika\'ya gidemezsin ama uydu görüntüsü ve sokak panoramasıyla inceleyebilirsin. Buna sanal saha çalışması denir. Erişilmez yerler için iyi; ama toprağa dokunmayı, eğimi bacağında hissetmeyi vermez.',
      ),
      kart(
        'Gözlem çözümlenince sonuç olur',
        'Elinde 30 fotoğraf ve iki sayfa not var. Bu henüz sonuç değil. Verileri gruplayıp haritaya işle; "yamacın kuzeyi daha çok aşınmış" gibi bir bulguya var. Bulguyu haritayla birlikte sun.',
      ),
    ], [
      soru('Saha çalışmasında gözlemin yeri ve saati kaydedilmelidir.', true, 'Yoksa gözlem haritaya konamaz ve veri olmaktan çıkar.'),
      soru('Saha çalışması öncesinde harita ve kaynak incelemesi yapılır.', true, 'Arazide neye bakılacağı önceden belirleniyor.'),
      soru('Sanal saha çalışması, gerçek arazi gözleminin bütün kazanımlarını sağlar.', false, 'Erişim sağlar ama toprağa dokunmayı, eğimi hissetmeyi vermez.'),
      soru('Saha çalışması yalnızca uzman coğrafyacıların yapabileceği bir iştir.', false, 'Plan, kayıt ve çözümlemeyle öğrenciler de yürütebiliyor.'),
      sikli('Coğrafyanın laboratuvarı neresidir?', ['Arazi', 'Kütüphane'], 0, 'Olayı yerinde gözlemek.'),
      sikli('Erişilemeyen alanlar için hangi yöntem?', ['Sanal saha çalışması', 'Anket'], 0, 'Uydu görüntüsü ve panorama.'),
      soru('Ham gözlem tek başına sonuçtur.', false, 'Çözümlenip haritayla sunulunca sonuç olur.'),
    ], [
      {
        soru: 'Yeri ve saati yazılmayan bir arazi gözlemi neden veri sayılmaz?',
        siklar: ['Fotoğrafı yoktur', 'Haritaya oturtulamaz'],
        dogru: 1,
        aciklama: {
          dogru: 'Konumu bilinmeyen gözlem hiçbir katmana bağlanamaz.',
          yanlis: 'Fotoğraf yardımcı, şart değil. Konum ve zaman olmadan gözlem haritaya yerleşemez ve kullanılamaz.',
        },
        kart: 4,
      },
    ]),
    konu('cog10-beseri-etkilesim', 'Yeryüzü Şekilleri ile Beşerî Faaliyetler', [
      kart(
        'İnsan düz ve sulak yere yerleşir',
        'Konya Ovası\'nda köyler yan yana, Hakkâri dağlarında seyrek. Düz arazi ev yapmayı ve tarımı kolaylaştırır; su hayat demek. Dik yamaç ve bataklık yerleşmeyi caydırır.',
      ),
      kart(
        'Dağ yolu pahalıdır, vadi yolu ucuz',
        'Dağı aşan yol tünel ve viyadük ister; maliyet katlanır. Bu yüzden yollar tarih boyunca vadileri ve geçitleri izledi. Kral Yolu da bugünkü otoyollar da aynı doğal koridorlardan geçer.',
      ),
      kart(
        'Eğimli tarlada basamak yapılır',
        'Yamaçta traktör çalışamaz, yağmur toprağı süpürür. Çözüm teraslama, yani yamacı basamak basamak düz tarlalara bölmek. Karadeniz\'deki çay bahçeleri böyle. Basamak suyu tutar, toprak kaçmaz.',
      ),
      kart(
        'Yükseğe çıktıkça ürün değişir',
        'Her 100 metre yükseldikçe sıcaklık yaklaşık yarım derece düşer. Sahilde muz, biraz yukarıda zeytin, daha yukarıda buğday, en yukarıda yalnız otlak. Soğukta yetişme süresi kısalır, ürün çeşidi azalır.',
      ),
      kart(
        'İnsan da araziyi değiştirir',
        'Dağı deliyor: tünel. Vadiyi suyla dolduruyor: baraj gölü. Denizi dolduruyor: yeni arazi. Madende dağı kazıyor. Yani ilişki tek yönlü değil; arazi insanı sınırlar, insan araziyi dönüştürür.',
      ),
      kart(
        'Her müdahalenin bir bedeli vardır',
        'Dere yatağını daraltıp bina yaptın; ilk sağanakta su binaya girer: taşkın. Yol için yamacı kestin; yamaç kayar: heyelan. Araziye yapılan her müdahale bir karşılık üretir.',
        undefined,
        { not: 'Her müdahalenin bir karşılığı var; "ne kazandırır" kadar "neyi davet eder" diye sor.', etiket: 'Dikkat' },
      ),
      kart(
        'Soru iki yönden gelir, ayırt et',
        'Karadeniz\'de dağlar kıyıya paralel, yerleşme kıyıya sıkışmış: bu doğanın insana etkisi. Kıyıyı doldurup yol açmak: bu insanın doğaya etkisi. Sınav ikisini ayrı sorar; hangi yönü sorduğuna bak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Dağlık alanlarda yol yapım maliyeti yüksektir.', true, 'Tünel ve viyadük gerektiriyor.'),
      soru('Yükselti arttıkça yetiştirilebilen tarım ürünü çeşidi azalır.', true, 'Sıcaklık düşüp yetişme süresi kısalıyor.'),
      soru('İnsanın araziyi değiştirmesinin çevresel bir bedeli yoktur.', false, 'Dere yatağını daraltmak taşkını, yamacı kesmek heyelanı getiriyor.'),
      soru('Yer şekilleri yerleşmelerin dağılışını etkilemez.', false, 'Konya Ovası\'nda köyler sık, Hakkâri dağlarında seyrek.'),
      sikli('Tarih boyunca yol güzergâhını ne belirledi?', ['Ovaların büyüklüğü', 'Geçitler ve vadiler'], 1, 'Dağı aşmak pahalı.'),
      sikli('Dere yatağını daraltmak neyi davet eder?', ['Kuraklığı', 'Taşkını'], 1, 'Yamacı kesmek heyelanı.'),
      sikli('Yüksek yerlerde ürün deseni neden değişir?', ['Toprak yoktur', 'Yetişme süresi kısalır'], 1, 'Her 100 m\'de sıcaklık düşer.'),
      soru('Bataklık alanlar yerleşmeyi çeker.', false, 'Caydırır; düz ve sulak yer çeker.'),
    ], [
      {
        soru: 'Eğimli arazide tarım için hangi uyum yöntemi kullanılır?',
        siklar: ['Drenaj', 'Teraslama'],
        dogru: 1,
        aciklama: {
          dogru: 'Yamacı basamaklara bölmek toprağı tutar ve ekim yüzeyi açar.',
          yanlis: 'Drenaj fazla suyu uzaklaştırmak için, bataklıkta. Yamaçta yöntem teraslama.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('cog10-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog10-yerlesme-kurulus', 'Yerleşmelerin Kuruluşu ve Gelişimi', [
      kart(
        'İlk şehirler nehir kıyısına kuruldu',
        'Mezopotamya Fırat ve Dicle\'nin, Mısır Nil\'in kıyısında doğdu. Su içmek, sulamak ve taşımak için şart. Yer seçiminde ilk doğal etken su; sonra iklim, düz arazi ve verimli toprak gelir.',
      ),
      kart(
        'Eski şehirler savunulur yere kuruldu',
        'Ankara Kalesi tepede, İstanbul yarımadada, Mardin yamaçta. Düşman gelince tepeyi savunmak kolay, üç tarafı deniz olan yeri de. Eski çağda güvenlik, bereketli ovadan bile öndeydi.',
      ),
      kart(
        'Yol, maden ve karar da şehir kurar',
        'Ankara 1923\'te başkent oldu; küçük bir kasaba milyonluk şehre dönüştü. Zonguldak\'ı kömür, Kocaeli\'yi fabrika büyüttü. Ticaret yolu, sanayi, maden ve idari karar beşerî etken, yani insan kaynaklı etken.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Köyle şehri nüfus ve iş ayırır',
        'Köyde çoğu kişi tarım ve hayvancılıkla geçinir, nüfus az. Şehirde insanlar sanayi, ticaret ve hizmette çalışır, nüfus kalabalık. Hastane, üniversite ve alışveriş merkezi şehirde. Kırsal ve kentsel ayrımı böyle yapılır.',
      ),
      kart(
        'Su kıtsa evler toplanır, bolsa dağılır',
        'İç Anadolu\'da tek bir çeşme var; evler onun çevresine sıkışır: toplu yerleşme. Karadeniz\'de her yerde su, her tarla ayrı; herkes tarlasının yanına ev yapar: dağınık yerleşme. Güvenlik de evleri toplar.',
      ),
      kart(
        'Kuruluş sebebi gider, şehir kalır',
        'Kale şehri düşmana karşı kuruldu; bugün kimse kale istemez ama şehir turizmle yaşıyor. Kuruluş sebebiyle bugünkü yaşama sebebi farklı olabilir. Sınav bunu iki ayrı soru olarak sorar.',
        undefined,
        { not: 'Bir şehir için "neden kuruldu" ile "bugün neden büyüyor" iki ayrı soru; ikisine ayrı cevap ver.' },
      ),
      kart(
        'Yayla mevsimlik yerleşmedir',
        'Yazın sürüyü serin dağa çıkarırsın, kışın köye dönersin. Yaz evine yayla, çadır topluluğuna oba, tarla başındaki kulübeye dam denir. Yılın bir bölümünde kullanılır: geçici yerleşme. Konargöçer, yani göçebe geleneğin izi.',
      ),
    ], [
      soru('Su kaynaklarına yakınlık, yerleşme yeri seçiminde belirleyici olmuştur.', true, 'Mezopotamya ve Mısır nehir kıyısında kuruldu.'),
      soru('Eski yerleşmelerde savunma kaygısı yer seçimini etkilemiştir.', true, 'Tepe üstleri ve yarımadalar bu yüzden tercih edildi.'),
      soru('Yayla ve oba sürekli yerleşmelere örnektir.', false, 'İkisi de yılın belirli döneminde kullanılan geçici yerleşmeler.'),
      soru('Bir yerleşmenin dokusu kurulduğu gibi kalır, zamanla değişmez.', false, 'Nüfus, ekonomi ve ulaşım değiştikçe doku da değişiyor.'),
      sikli('Eski şehirler neden tepeye kuruldu?', ['Tarım', 'Savunma'], 1, 'Tepeyi savunmak kolay.'),
      sikli('Ankara\'nın hızla büyümesinin sebebi?', ['Maden', 'Başkent olması (idari karar)'], 1, 'Beşerî etken.'),
      sikli('Yayla ve oba nedir?', ['Kentsel yerleşme', 'Geçici yerleşme'], 1, 'Konargöçer geleneğin izi.'),
      soru('Kuruluş sebebi kalksa şehir de yok olur.', false, 'Kale şehri bugün turizmle yaşayabilir.'),
    ], [
      {
        soru: 'Dağınık yerleşme nerede görülür?',
        siklar: ['Su ve arazinin bol olduğu yerde', 'Su kıtlığı olan yerde'],
        dogru: 0,
        aciklama: {
          dogru: 'Herkes kendi tarlasının yanına kurulabilir; Karadeniz kıyısı örnek.',
          yanlis: 'Su kıt olunca herkes tek kaynağın çevresinde toplanır: toplu yerleşme. Dağınık yerleşme su ve arazi bolluğunun sonucu.',
        },
        kart: 5,
      },
    ]),
    konu('cog10-yerlesme-fonksiyon', 'Yerleşmelerin Fonksiyonları', [
      kart(
        'Fonksiyon, şehri geçindiren iştir',
        'Zonguldak deyince kömür, Antalya deyince turist gelir aklına. Şehirdeki insanların çoğunu geçindiren ana iş, o şehrin fonksiyonu yani işlevi. Şehri o iş besler.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Şehirler işlevine göre adlanır',
        'Tarım şehri, sanayi şehri, ticaret şehri, liman şehri, turizm şehri, maden şehri. Bir de idari şehir (başkent), askerî şehir ve üniversite şehri var. Ad, şehri geçindiren işi söyler.',
      ),
      kart(
        'Türkiye\'den örneklerle eşleştir',
        'Bursa\'da otomobil ve tekstil fabrikaları: sanayi. Antalya\'da oteller: turizm. Zonguldak\'ta kömür: maden. Ankara\'da bakanlıklar: idari. Mersin\'de dev liman: liman şehri.',
        {
          tur: 'tablo',
          basliklar: ['Şehir', 'Fonksiyon'],
          satirlar: [
            ['Bursa, Kocaeli', 'Sanayi'],
            ['Antalya', 'Turizm'],
            ['Zonguldak', 'Maden'],
            ['Ankara', 'İdari'],
            ['Mersin', 'Liman'],
          ],
        },
      ),
      kart(
        'Maden bitince şehir değişir',
        'Kömür tükendi; madenci işsiz kaldı, göç başladı. Şehir ya küçülür ya yeni bir iş bulur. Fonksiyon sabit değil; yol değişince, fabrika kapanınca şehir de değişir.',
        undefined,
        { not: 'Şehri işleviyle ezberleme; soruda "işlev değişirse ne olur" da sorulur.' },
      ),
      kart(
        'Büyük şehirde tek işlev yoktur',
        'İstanbul için "liman şehri" demek eksik kalır. Sanayi, ticaret, turizm, üniversite, kültür hepsi orada. Büyük şehirler çok fonksiyonlu; küçük şehirler çoğu zaman tek işe bağlı.',
      ),
      kart(
        'Tek işe bağlı şehir kırılgandır',
        'Tek fabrikası olan şehirde fabrika kapanırsa herkes işsiz, göç başlar. Beş sektörü olan şehirde biri sarsılsa öteki dördü ayakta tutar. İşlev çeşitlendikçe şehir daha çok insanı besler ve daha az sarsılır.',
      ),
    ], [
      soru('Bir yerleşmenin fonksiyonu, orada öne çıkan ekonomik etkinliktir.', true, 'Liman şehri, sanayi şehri gibi adlar buradan geliyor.'),
      soru('Büyük şehirler genellikle çok fonksiyonludur.', true, 'İstanbul\'da sanayi, ticaret, turizm ve kültür bir arada.'),
      soru('Bir yerleşmenin fonksiyonu zamanla değişmez.', false, 'Madeni tükenen şehir küçülür ya da yeni bir işe geçer.'),
      soru('Turizm bir yerleşme fonksiyonu sayılmaz.', false, 'Antalya bir turizm şehri; turizm işlev türlerinden biri.'),
      sikli('Bir şehrin öne çıkan temel işlevine ne denir?', ['Doku', 'Fonksiyon'], 1, 'Şehri geçindiren iş.'),
      sikli('İstanbul için ne söylenir?', ['Tek fonksiyonlu', 'Çok fonksiyonlu'], 1, 'Sanayi, ticaret, turizm, kültür.'),
      soru('Maden tükenince şehir yeni bir işleve geçebilir.', true, 'Ya da küçülür.'),
    ], [
      {
        soru: 'Tek işleve bağlı şehir o işlev sarsılınca ne yapar?',
        siklar: ['Nüfusu artar', 'Hızla göç verir'],
        dogru: 1,
        aciklama: {
          dogru: 'Fabrika kapanınca herkes işsiz kalır; çeşitlenmiş şehir dayanır.',
          yanlis: 'İşi bitince insanlar gider. Tek işe bağlılık kırılganlık demek; çok fonksiyonlu şehir sarsıntıyı atlatır.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('cog10-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog10-ekonomi-ozellik', 'Ekonomik Faaliyetlerin Özellikleri', [
      kart(
        'Ekonomi beş basamakta yükselir',
        'Çiftçi pamuk toplar, fabrika iplik yapar, mağaza satar, tasarımcı yeni kumaş geliştirir, şirket yönetimi karar verir. Beş iş, beş sektör. Doğadan uzaklaştıkça basamak yükselir ve kazanç artar.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Birincil', alt: 'tarım, maden' },
            { ad: 'İkincil', alt: 'sanayi' },
            { ad: 'Üçüncül', alt: 'hizmet' },
            { ad: 'Dördüncül', alt: 'bilgi, Ar-Ge' },
            { ad: 'Beşincil', alt: 'üst yönetim' },
          ],
        },
      ),
      kart(
        'Birincil sektör doğadan alır',
        'Tarladan buğday, denizden balık, ormandan odun, madenden kömür. Doğadan doğrudan ürün alan işler birincil sektör. Tarım, hayvancılık, ormancılık, balıkçılık ve madencilik burada.',
      ),
      kart(
        'İkincil sektör ham maddeyi işler',
        'Buğdayı un, unu ekmek yapan fırın; demiri otomobil yapan fabrika; tuğlayı binaya çeviren inşaat. Ham maddeyi ürüne dönüştüren işler ikincil sektör: sanayi, imalat, inşaat.',
      ),
      kart(
        'Üçüncül sektör hizmet satar',
        'Doktor seni muayene eder, öğretmen ders anlatır, kamyoncu ekmeği taşır, mağaza satar. Ortada elle tutulur bir ürün yok, hizmet var. Ticaret, ulaşım, turizm, sağlık ve eğitim üçüncül sektör.',
      ),
      kart(
        'Bilgi ve yönetim en üst basamak',
        'Yeni ilaç bulan laboratuvar, yazılım geliştiren mühendis: dördüncül sektör, yani bilgi üretimi ve Ar-Ge (araştırma-geliştirme). Şirketin tepesinde büyük kararı veren yönetim: beşincil sektör. Gelişmiş ülkede ikisinin payı büyüyor.',
      ),
      kart(
        'Sektörler birbirine zincir gibi bağlı',
        'Çiftçi buğday üretmezse fırın un bulamaz. Fırın ekmek yapmazsa kamyoncunun taşıyacağı şey kalmaz. Her sektör bir öncekinin ürünüyle çalışır, bir sonrakini besler. Biri dursa zincir kopar.',
      ),
      kart(
        'İşlendikçe değer katlanır',
        'Bir kilo pamuk birkaç lira. İplik olunca değeri artar, kumaş olunca daha da artar, gömlek olunca kat kat. Her işleme adımının eklediği bu fazlaya katma değer denir. Ham madde satan az, işleyip satan çok kazanır.',
        undefined,
        { not: 'Aynı pamuk gömlek olunca neden onlarca kat eder? Her adımda emek ve bilgi eklenir: katma değer.', etiket: 'Tanım' },
      ),
    ], [
      soru('Tarım, madencilik ve balıkçılık birincil ekonomik faaliyetlerdir.', true, 'Doğrudan doğadan ürün alıyorlar.'),
      soru('Ham maddenin işlenmesi ikincil faaliyettir.', true, 'Sanayi, imalat ve inşaat bu grupta.'),
      soru('Katma değer, ham maddenin işlenmeden satılmasıyla artar.', false, 'İşlendikçe artar; pamuk gömlek olunca kat kat değerlenir.'),
      soru('Ekonomik sektörler birbirinden bağımsız çalışır.', false, 'Çiftçi buğday üretmezse fırın un bulamaz; zincir gibi bağlılar.'),
      sikli('Madencilik hangi sektördür?', ['İkincil', 'Birincil'], 1, 'Doğadan doğrudan ürün.'),
      sikli('İnşaat hangi sektördür?', ['Üçüncül', 'İkincil'], 1, 'Tuğlayı binaya çevirir: ham maddeyi işler.'),
      sikli('Araştırma-geliştirme hangi sektördür?', ['Birincil', 'Dördüncül'], 1, 'Bilgi üretimi.'),
      sikli('Pamuğun giysiye dönüşürken değerlenmesi?', ['Kapasite', 'Katma değer'], 1, 'Her işleme adımı değer ekler.'),
      soru('Sektörler birbirinden bağımsızdır.', false, 'Zincirin halkaları birbirini besler.'),
    ], [
      {
        soru: 'Turizm ve sağlık hangi sektöre girer?',
        siklar: ['İkincil (sanayi)', 'Üçüncül (hizmet)'],
        dogru: 1,
        aciklama: {
          dogru: 'Elle tutulur ürün değil hizmet üretilir.',
          yanlis: 'İkincil sektör ham maddeyi işler (fabrika, inşaat). Turizm ve sağlık hizmet üretir: üçüncül.',
        },
        kart: 4,
      },
    ]),
    konu('cog10-sektor-gelismislik', 'Ekonomik Sektörler ve Gelişmişlik', [
      kart(
        'Tarımın payı düştükçe ülke gelişir',
        'Almanya\'da her 100 çalışandan 1\'i tarımda, Etiyopya\'da 60\'ı. Gelişmiş ülkede insanlar sanayi ve hizmete kaymış. Kural: birincil sektörün payı azaldıkça gelişmişlik artar.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Az gelişmiş ülkede herkes tarımda',
        'Köyde bütün aile tarlada çalışır ama ürettiği az; makine yok, sulama yok. Çok kişi çalışıyor, az gelir çıkıyor. Az gelişmiş ülkelerde nüfusun çoğu tarımda ama tarımın geliri düşük.',
      ),
      kart(
        'Gelişmiş ülkede hizmet başı çeker',
        'ABD\'de çalışanların yaklaşık beşte dördü hizmet sektöründe: bankacı, doktor, yazılımcı, satıcı. Tarımda yüzde birkaç kişi kalmış, o da makineyle çok üretiyor. Gelir de en çok hizmetten geliyor.',
      ),
      kart(
        'Çok çalışan çok kazanıyor demek değil',
        'Bir ülkede 100 kişiden 40\'ı tarımda ama tarım gelirin yalnız 10\'unu üretiyor. Kalabalık sektör küçük pay, az kişili hizmet büyük pay. İstihdam payı, yani çalışan oranı, gelir payından ayrı bir sayı.',
        {
          tur: 'tablo',
          basliklar: ['Ülke', 'Tarım payı', 'Hizmet payı'],
          satirlar: [
            ['Az gelişmiş', 'Yüksek', 'Düşük'],
            ['Gelişmiş', 'Çok düşük', 'Yüksek'],
          ],
        },
        { not: '"Çok kişi çalışıyor" ile "çok gelir üretiyor" ayrı şeyler; tarım tam bu tuzak.', etiket: 'Sık hata' },
      ),
      kart(
        'Gelişmişlik birkaç sayıyla ölçülür',
        'Kişi başına gelir, yani ülke gelirinin nüfusa bölümü. Bebek ölüm hızı, okuryazarlık, ortalama ömür. Bunları birleştiren ölçüye İnsani Gelişme Endeksi denir. Tek sayı değil, birkaçı birlikte okunur.',
      ),
      kart(
        'Ortalama gelir zengini fakiri gizler',
        'Petrol ülkesinde kişi başına gelir yüksek ama servet birkaç ailede; halkın çoğu yoksul. Ortalama bunu göstermez. O yüzden gelirin yanına eğitim ve sağlık göstergeleri konur.',
      ),
    ], [
      soru('Gelişmiş ülkelerde hizmet sektörünün payı yüksektir.', true, 'ABD\'de çalışanların beşte dördü hizmette.'),
      soru('Az gelişmiş ülkelerde tarımda çalışan nüfusun payı yüksektir.', true, 'Buna karşılık tarımın gelirdeki payı düşük kalıyor.'),
      soru('Bir ülkenin gelişmişliği yalnızca kişi başına düşen gelirle ölçülür.', false, 'Eğitim, sağlık ve ortalama ömür de hesaba katılıyor; ortalama dağılımı gizler.'),
      soru('Tarımda çalışan nüfusun çok olması, tarım gelirinin de yüksek olduğunu gösterir.', false, 'Çoğu zaman tersini gösterir: çok kişi çalışıyor ama verim ve gelir düşük.'),
      sikli('Gelişmiş ülkede hangi sektör başı çeker?', ['Tarım', 'Hizmet'], 1, 'Tarımın payı yüzde birkaç.'),
      sikli('Kişi başına gelir neden tek başına yetmez?', ['Yanlış hesaplanır', 'Dağılımı göstermez'], 1, 'Ortalama zengini fakiri gizler.'),
      soru('Bir sektörde çok kişi çalışması çok gelir ürettiğini gösterir.', false, 'İstihdam payı ve gelir payı ayrı sayılar.'),
    ], [
      {
        soru: 'Birincil sektörün payı azaldıkça gelişmişlik?',
        siklar: ['Azalır', 'Artar'],
        dogru: 1,
        aciklama: {
          dogru: 'Almanya\'da 100 çalışandan 1\'i tarımda, Etiyopya\'da 60\'ı.',
          yanlis: 'Tersi: nüfusun çoğu tarımda çalışıyorsa ülke az gelişmiştir. Tarımın payı düştükçe gelişmişlik yükselir.',
        },
        kart: 1,
      },
    ]),
    konu('cog10-turkiye-ekonomi', 'Türkiye Ekonomisinin Sektörel Dağılımı', [
      kart(
        'Türkiye tarımdan hizmete kaydı',
        '1950\'de Türkiye\'de her 4 çalışandan 3\'ü tarımdaydı; bugün 6\'da 1\'i bile değil. Sanayi ve özellikle hizmet büyüdü. Yapı gelişmiş ülkelere yaklaşıyor.',
      ),
      kart(
        'Tarımda çok kişi, az gelir',
        'Çalışanların yaklaşık altıda biri tarımda ama tarım millî gelirin yaklaşık yüzde 6\'sını üretiyor. Yani kişi başına düşen üretim düşük. Türkiye tarımının temel sorunu verimlilik.',
      ),
      kart(
        'Küçük tarla verimi düşürür',
        'Miras bölüne bölüne tarlalar küçüldü; 10 dönümlük parçaya traktör sokmak zor. Sulama ve modern tohum bazı bölgede var, bazısında yok. Küçük ve parçalı arazi verimin düşük olmasının başlıca sebebi.',
      ),
      kart(
        'Sanayide dört ürün öne çıkar',
        'Bursa ve Kocaeli\'de otomobil, Denizli ve İstanbul\'da tekstil, Manisa\'da beyaz eşya, her yerde gıda. Türkiye sanayisinin dört büyük kolu bunlar. Tesislerin çoğu Marmara\'da toplanmış.',
      ),
      kart(
        'Sanayi Marmara\'da yığılır',
        'Fabrika kurmak istiyorsun: limana yakın olsun, müşterin yakın olsun, işçi bulunsun, yol olsun. Dördü de Marmara\'da. Her yeni fabrika yenisini çeker; yığılma kendini besler.',
        undefined,
        { not: 'Marmara sorulunca tek sebep verme: liman, pazar, iş gücü ve ulaşım dördü birden.' },
      ),
      kart(
        'Hizmette turizm döviz kapısıdır',
        'Antalya\'ya gelen turist euro bırakır; bu döviz, yani yabancı para. Ülke dışarıdan aldığı malı bununla öder. Hizmet sektöründe turizm, ticaret ve ulaştırma başı çeker; turizm döviz girişinde önemli kalem.',
      ),
      kart(
        'Batıda sanayi, doğuda tarım',
        'Marmara ve Ege\'de fabrika, Doğu Anadolu\'da hayvancılık. Gelir de batıda yüksek, doğuda düşük. Devlet doğuda fabrika kurana vergi indirimi ve ucuz arsa verir; buna teşvik denir. Amaç farkı azaltmak.',
      ),
    ], [
      soru('Türkiye de sanayi tesislerinin en çok yoğunlaştığı bölge Marmara dır.', true, 'Liman, pazar, iş gücü ve ulaşım orada bir arada.'),
      soru('Türkiye de hizmet sektörünün millî gelirdeki payı en yüksektir.', true, 'Turizm, ticaret ve ulaştırma başı çekiyor.'),
      soru('Türkiye de tarımda çalışan nüfusun payı, tarımın millî gelirdeki payından düşüktür.', false, 'Tersi geçerli; bu da tarımda verimin düşük olduğunu gösteriyor.'),
      soru('Türkiye de ekonomik faaliyetler bölgeler arasında dengeli dağılmıştır.', false, 'Batıda sanayi, doğuda tarım; teşvik bu farkı azaltmak için var.'),
      sikli('Türkiye\'de tarımın temel sorunu?', ['Verimlilik', 'Toprak yokluğu'], 0, 'Küçük, parçalı arazi.'),
      sikli('Döviz girdisinde önemli hizmet kalemi?', ['Turizm', 'Madencilik'], 0, 'Turist yabancı para bırakır.'),
      sikli('Sanayi hangi bölgede yoğunlaşmıştır?', ['Marmara', 'Doğu Anadolu'], 0, 'Doğuda tarım ve hayvancılık.'),
      soru('Teşvik politikaları bölgesel dengesizliği azaltmayı hedefler.', true, 'Doğuda fabrika kurana vergi indirimi ve ucuz arsa.'),
    ], [
      {
        soru: 'Türkiye\'de sanayinin Marmara\'da yoğunlaşmasının sebebi?',
        siklar: ['İklimi ılıman', 'Liman, pazar, iş gücü ve ulaşım bir arada'],
        dogru: 1,
        aciklama: {
          dogru: 'Her yeni fabrika yenisini çeker; yığılma kendini besler.',
          yanlis: 'İklim sanayiyi belirlemez. Marmara\'yı çeken şey liman, pazar, iş gücü ve ulaşım ağının bir arada olması.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('cog10-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog10-iyi-uygulama', 'Afetlerle Mücadelede İyi Uygulama Örnekleri', [
      kart(
        'Japonya’nın deneyimi',
        'Katı yapı denetimi, erken uyarı sistemi ve düzenli tatbikat; okullarda afet eğitimi zorunlu.',
      ),
      kart(
        'Erken uyarı',
        'Deprem dalgasının hızlı ve yavaş bileşenleri arasındaki fark, saniyeler kazandırıp treni durdurabiliyor.',
      ),
      kart(
        'Yapısal önlemler',
        'Sismik izolatör, güçlendirme ve zemin iyileştirme; yeni yapıda maliyeti düşük, sonradan yüksektir.',
      ),
      kart(
        'Hollanda ve su',
        'Ülkenin büyük kısmı deniz seviyesinin altında; setler, kapaklar ve suya yer bırakan planlama taşkını yönetiyor.',
      ),
      kart(
        'Toplum temelli hazırlık',
        'Mahalle ölçeğinde gönüllü ekipler ilk saatlerde en etkili müdahaleyi yapar.',
      ),
      kart(
        'Türkiye’de',
        'AFAD koordinasyonu, zorunlu deprem sigortası ve kentsel dönüşüm başlıca uygulamalar.',
      ),
      kart(
        'Ortak nokta',
        'Başarılı örneklerin hepsinde önlem afetten önce alınmış ve bir kurumun sürekli sorumluluğuna bağlanmış.',
        undefined,
        { not: 'Ülkeleri değil ortak paydayı tut: önlem afetten önce ve bir kurumun sürekli işi.' },
      ),
    ], [
      soru('Japonya da deprem eğitimleri ve tatbikatlar düzenli olarak yapılır.', true, 'Hazırlık, günlük hayatın parçası hâline getirilmiş durumda.'),
      soru('Erken uyarı sistemleri can kaybını azaltır.', true, 'Saniyeler bile korunma davranışı için yeterli olabiliyor.'),
      soru('Hollanda nın su yönetimi deneyimi yalnızca baraj yapımına dayanır.', false, 'Suya alan bırakan planlama ve arazi kullanımı da bu deneyimin parçası.'),
      soru('İyi uygulama örneklerinin ortak yanı, afet sonrasına odaklanmalarıdır.', false, 'Ortak yanları afet öncesine, yani hazırlığa yatırım yapmaları.'),
      sikli('Japonya\'da okullarda ne zorunludur?', ['Yüzme', 'Afet eğitimi'], 1, 'Düzenli tatbikat.'),
      sikli('Hollanda taşkını nasıl yönetiyor?', ['Nüfusu taşıyarak', 'Set, kapak ve suya yer bırakan planlama'], 1, 'Deniz seviyesinin altında.'),
      sikli('Sismik izolatör maliyeti ne zaman düşüktür?', ['Sonradan eklemede', 'Yeni yapıda'], 1, 'Yapısal önlem.'),
      soru('Başarılı örneklerde önlem afetten sonra alınmış.', false, 'Öncesinde ve bir kurumun sürekli sorumluluğunda.'),
    ], [
      {
        soru: 'Deprem erken uyarısı saniyeleri nasıl kazanır?',
        siklar: ['Hızlı ve yavaş dalga arasındaki farktan', 'Depremi önceden tahmin ederek'],
        dogru: 0,
        aciklama: {
          dogru: 'P dalgası önce gelir, yıkıcı S dalgası sonra; aradaki süre treni durdurur.',
          yanlis: 'Deprem önceden tahmin edilemez. Uyarı, hızlı gelen zayıf dalga ile yavaş gelen yıkıcı dalga arasındaki saniyeleri kullanır.',
        },
        kart: 2,
      },
    ]),
    konu('cog10-dirençli-alan', 'Afetlere Karşı Dirençli Yaşam Alanları', [
      kart(
        'Dirençlilik nedir?',
        'Afeti önlemek değil, afetten sonra hızla toparlanabilme kapasitesi.',
      ),
      kart(
        'Yer seçimi',
        'Fay hattı, taşkın ovası, heyelan alanı ve gevşek zemin üzerine yapı yapılmaması ilk koşuldur.',
      ),
      kart(
        'Zemin önemli',
        'Gevşek ve suya doygun zemin deprem dalgasını büyütür; aynı bina sağlam kayada çok daha az zorlanır.',
        undefined,
        { not: 'Binanın sağlamlığı yetmez; aynı bina hangi zeminde, onu da sor.' },
      ),
      kart(
        'Açık alanlar',
        'Park ve meydanlar hem toplanma alanı hem yangın engeli olarak çalışır; yoğun dokuda bunlar yoktur.',
      ),
      kart(
        'Altyapı yedekliliği',
        'Su, elektrik ve iletişimin alternatif hatları olması gerekir; tek hat koparsa şehir felç olur.',
      ),
      kart(
        'Ulaşılabilirlik',
        'Geniş ve birbirine bağlı yollar müdahale ekiplerinin ulaşmasını sağlar.',
      ),
      kart(
        'Dirençli şehrin ögeleri',
        'Beş başlık birlikte çalışır; biri eksikse ötekilerin sağladığı kazanç da düşer.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Doğru yer seçimi' },
            { ad: 'Sağlam yapı' },
            { ad: 'Açık alan' },
            { ad: 'Yedekli altyapı' },
            { ad: 'Hazırlıklı toplum', renk: 'ikincil' },
          ],
        },
      ),
    ], [
      soru('Zemin özellikleri, yapıların depremden etkilenme derecesini değiştirir.', true, 'Gevşek ve suya doygun zemin sarsıntıyı büyütüyor.'),
      soru('Şehirlerdeki açık alanlar afet sonrasında toplanma yeri olarak kullanılır.', true, 'Bu yüzden imara açılmamaları önemli.'),
      soru('Altyapıda yedeklilik gereksiz bir masraftır.', false, 'Bir hat koptuğunda ikinci hat devreye girdiği için şehir işlemeye devam ediyor.'),
      soru('Dirençli şehir, afette hiç zarar görmeyen şehirdir.', false, 'Zarar görse de işleyişini sürdürebilen ve hızla toparlanan şehir.'),
      sikli('Gevşek ve suya doygun zemin deprem dalgasını ne yapar?', ['Söndürür', 'Büyütür'], 1, 'Sağlam kayada bina az zorlanır.'),
      sikli('Park ve meydanlar afette ne işe yarar?', ['Dekorasyon', 'Toplanma alanı ve yangın engeli'], 1, 'Yoğun dokuda yok.'),
      sikli('Tek elektrik hattı koparsa ne olur?', ['Bir şey olmaz', 'Şehir felç olur'], 1, 'Altyapı yedekliliği.'),
      soru('Dar ve kopuk yollar müdahaleyi kolaylaştırır.', false, 'Geniş ve bağlı yollar gerekir.'),
    ], [
      {
        soru: 'Dirençlilik ne demektir?',
        siklar: ['Afeti tümüyle önlemek', 'Afetten sonra hızla toparlanabilmek'],
        dogru: 1,
        aciklama: {
          dogru: 'Afet olur; dirençli şehir onu az kayıpla atlatır ve çabuk ayağa kalkar.',
          yanlis: 'Afet önlenemez, deprem olacak. Dirençlilik afetin olmaması değil, sonrasında hızla toparlanma kapasitesi.',
        },
        kart: 1,
      },
    ]),
    konu('cog10-korunma', 'Afetlerden Korunma', [
      kart(
        'Mekâna göre değişir',
        'Deprem bölgesindeki önlemle sel havzasındaki önlem aynı olamaz; korunma yerin özelliğine göre planlanır.',
      ),
      kart(
        'Depremde',
        'Sağlam yapı, eşya sabitleme, çök-kapan-tutun davranışı ve afet çantası.',
      ),
      kart(
        'Selde',
        'Dere yatağına yapı yapmamak, drenaj, erken uyarı ve yüksek yere tahliye.',
      ),
      kart(
        'Yangında',
        'Orman-yerleşim arasında güvenlik şeridi, erken müdahale ve yanıcı madde temizliği.',
      ),
      kart(
        'Heyelanda',
        'Yamaç eğimini bozmamak, drenajla suyu uzaklaştırmak ve bitki örtüsünü korumak.',
      ),
      kart(
        'Ortak nokta',
        'Korunmanın en etkili adımı afetten önce alınır; sonrasında yapılan her şey daha pahalı ve daha az etkilidir.',
        undefined,
        { not: 'Beş afet, tek kural: en ucuz önlem afetten önce alınan.' },
      ),
    ], [
      soru('Depremde "çök-kapan-tutun" davranışı önerilir.', true, 'Sağlam bir eşyanın yanına çökmek düşen cisimlerden koruyor.'),
      soru('Selde araçla su birikintisine girilmemelidir.', true, 'Az bir su bile aracı sürükleyebiliyor.'),
      soru('Yangında tahliye için asansör kullanılmalıdır.', false, 'Asansör elektrik kesilince kapanabilir; merdiven kullanılmalı.'),
      soru('Heyelan riski olan bir yamacın eteğine yapı yapılmasında sakınca yoktur.', false, 'Kayan malzemenin geleceği yer tam da orası.'),
      sikli('Depremde doğru davranış?', ['Pencereye koş', 'Çök-kapan-tutun'], 1, 'Eşya sabitleme de.'),
      sikli('Orman-yerleşim arasında ne bırakılır?', ['Otopark', 'Güvenlik şeridi'], 1, 'Yangın önlemi.'),
      soru('Afetten sonra yapılan her şey öncekinden ucuzdur.', false, 'Daha pahalı ve az etkili.'),
    ], [
      {
        soru: 'Heyelandan korunmanın bir yolu hangisidir?',
        siklar: ['Yamaçtaki suyu drenajla uzaklaştırmak', 'Yamacı bitki örtüsünden temizlemek'],
        dogru: 0,
        aciklama: {
          dogru: 'Suya doygun zemin kayar; bitki örtüsü de toprağı tutar, sökülmez.',
          yanlis: 'Bitki örtüsü toprağı tutar; sökmek heyelanı davet eder. Korunma drenaj ve örtüyü korumakla olur.',
        },
        kart: 5,
      },
    ]),
    konu('cog10-afet-bilinci', 'Afet Bilinci', [
      kart(
        'Ne demek?',
        'Riski bilmek, önlemi bilmek ve afet anında ne yapacağını önceden kararlaştırmış olmak.',
      ),
      kart(
        'Neden bilgi yetmiyor?',
        'Bilgi davranışa dönüşmezse işe yaramaz; tatbikat, bilgiyi refleks hâline getirir.',
      ),
      kart(
        'Aile afet planı',
        'Buluşma noktası, iletişim kişisi, afet çantasının yeri ve vana kapatma önceden konuşulmalıdır.',
      ),
      kart(
        'Afet çantası',
        'Su, uzun ömürlü gıda, ilk yardım malzemesi, el feneri, düdük, pil ve kimlik fotokopisi; kapıya yakın tutulur.',
      ),
      kart(
        'Afete dirençli toplum',
        'Program bunu hedef olarak koyuyor: yalnızca bilen değil, imar denetimini ve yapı kalitesini talep eden bir toplum.',
      ),
      kart(
        'Risk algısı sorunu',
        'Uzun süre afet yaşanmayan yerde tehlike unutulur. Hazırlık, en çok da sakin dönemlerde gevşer.',
        undefined,
        { not: 'Sakin dönem hazırlık dönemi; "burada olmaz" cümlesi en büyük risk.' },
      ),
    ], [
      soru('Afet bilinci, bilgiyi davranışa dönüştürmeyi gerektirir.', true, 'Ne yapılacağını bilmek, yapmakla tamamlanıyor.'),
      soru('Aile afet planında buluşma noktası belirlenir.', true, 'İletişim kesildiğinde nerede buluşulacağı önceden kararlaştırılıyor.'),
      soru('Afet çantası, afet olduktan sonra hazırlanır.', false, 'Önceden hazırlanır ve ulaşılabilir bir yerde tutulur.'),
      soru('İnsanlar afet riskini genellikle olduğundan büyük görür.', false, 'Risk algısı çoğu zaman düşük kalıyor; "bana olmaz" eğilimi yaygın.'),
      sikli('Afet çantasında hangisi olmalı?', ['Düdük ve el feneri', 'Televizyon'], 0, 'Su, gıda, ilk yardım, pil, kimlik fotokopisi.'),
      sikli('Uzun süre afet yaşanmayan yerde ne olur?', ['Tehlike unutulur', 'Risk sıfırlanır'], 0, 'Hazırlık gevşer.'),
      soru('Aile afet planında buluşma noktası önceden konuşulmalıdır.', true, 'İletişim kişisi, vana kapatma da.'),
    ], [
      {
        soru: 'Tatbikatın işlevi nedir?',
        siklar: ['Bilgiyi refleks hâline getirmek', 'Yeni bilgi öğretmek'],
        dogru: 0,
        aciklama: {
          dogru: 'Afet anında düşünmeye zaman yok; davranış önceden otomatikleşmeli.',
          yanlis: 'Bilgi zaten var; tatbikat onu davranışa çeviriyor. Bilgi davranışa dönüşmezse işe yaramaz.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('cog10-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog10-turk-kultur', 'Türk Kültürünün Mekânsal Özellikleri', [
      kart(
        'Yayılış alanı',
        'Balkanlardan Türkistan’a, Sibirya’dan Anadolu’ya uzanan geniş bir kuşak.',
      ),
      kart(
        'Türkistan neresi?',
        'Türk topluluklarının tarihsel yurdu olan geniş İç Asya bölgesi. Program bu adı kullanıyor; "Orta Asya" onun bir bölümünü anlatır.',
      ),
      kart(
        'Ortak unsurlar',
        'Dil ailesi, sözlü gelenek, destanlar, mutfak, halı-kilim dokumacılığı ve müzik.',
      ),
      kart(
        'Konargöçer mirası',
        'Taşınabilir sanat, at kültürü ve otağ geleneği; bu miras yerleşik hayata geçildikten sonra da sürdü.',
      ),
      kart(
        'Coğrafyanın etkisi',
        'Bozkır kuşağı benzer yaşam biçimleri üretti; ortak kültürün coğrafi bir zemini var.',
      ),
      kart(
        'Kültür bölgesi',
        'Sınırları devlet sınırlarıyla çakışmayan, ortak dil ve gelenekle tanımlanan alan. Geçiş kuşakları keskin değildir.',
        undefined,
        { not: 'Kültür bölgesinin sınırı devlet sınırı değil; haritada ikisini üst üste koyma.' },
      ),
      kart(
        'Bugünkü bağlar',
        'Türk Devletleri Teşkilatı gibi yapılar kültürel yakınlığı ekonomik ve siyasi iş birliğine çeviriyor.',
      ),
      kart(
        'Yeşil Vatan',
        'Ormanların vatanın bir parçası sayıldığı yaklaşım; ağaçlandırma ve yangınla mücadele bu kavramla anılıyor.',
      ),
    ], [
      soru('Türkistan, Türk kültürünün doğduğu ve yayıldığı ana alandır.', true, 'Buradan batıya uzanan göçlerle kültür geniş bir alana yayıldı.'),
      soru('Konargöçer yaşamın izleri halı, kilim ve mutfak kültüründe sürmektedir.', true, 'Taşınabilir ve dayanıklı ürünler bu yaşamın mirası.'),
      soru('Yeşil Vatan kavramı denizlerimizi anlatır.', false, 'Yeşil Vatan ormanlarımızı anlatıyor; denizler için kullanılan kavram Mavi Vatan.'),
      soru('Kültür bölgeleri siyasi sınırlarla birebir örtüşür.', false, 'Kültürel özellikler sınırları aşarak yayılıyor.'),
      sikli('Türk topluluklarının tarihsel yurdu?', ['Türkistan', 'Balkanlar'], 0, 'Program bu adı kullanıyor.'),
      sikli('Ortak kültürün coğrafi zemini nedir?', ['Bozkır kuşağı', 'Kıyı ovaları'], 0, 'Benzer yaşam biçimleri.'),
      sikli('Kültürel yakınlığı iş birliğine çeviren yapı?', ['Türk Devletleri Teşkilatı', 'Yeşil Vatan'], 0, 'Ekonomik ve siyasi.'),
      sikli('Ormanların vatanın parçası sayılması?', ['Yeşil Vatan', 'Kültür bölgesi'], 0, 'Ağaçlandırma ve yangınla mücadele.'),
      soru('Otağ geleneği yerleşik hayata geçince tümüyle unutuldu.', false, 'Konargöçer mirası sürdü.'),
    ], [
      {
        soru: 'Kültür bölgesinin sınırları neyle tanımlanır?',
        siklar: ['Ortak dil ve gelenekle', 'Devlet sınırlarıyla'],
        dogru: 0,
        aciklama: {
          dogru: 'Sınırlar siyasi haritayla çakışmaz ve geçiş kuşakları keskin değildir.',
          yanlis: 'Devlet sınırı siyasi ve keskin; kültür bölgesi ortak dil ve gelenekle tanımlanır, sınırları geçişlidir.',
        },
        kart: 6,
      },
    ]),
  ]),
])
