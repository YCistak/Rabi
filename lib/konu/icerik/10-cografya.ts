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
        'Coğrafi bakış nedir?',
        'Bir olayı yalnızca kendisiyle değil, olduğu yerle ve çevresiyle birlikte düşünmektir.',
      ),
      kart(
        'Temel kavramlar',
        'Coğrafi çözümleme beş kavram üzerinden yürür.\nHer kavram ayrı bir soruya karşılık gelir.',
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
        'Ölçek meselesi',
        'Aynı olay yerel, bölgesel ve küresel ölçekte farklı görünür.\nÖlçeği değiştirmek sonucu da değiştirir.',
        undefined,
        { not: 'Bir baraj yerelde köyü sular, bölgesel ölçekte tarımı sular, küresel ölçekte karbon salımını azaltır.' },
      ),
      kart(
        'Etkileşim',
        'Hiçbir yer yalıtık değildir.\nBir bölgedeki kuraklık, başka bir kıtadaki gıda fiyatını etkileyebilir.',
      ),
      kart(
        'Neden-sonuç aramak',
        'Coğrafi bakış "Nerede?" ile yetinmez, "Neden orada?" diye sorar.\nAsıl iş, dağılışın arkasındaki sebebi bulmaktır.',
      ),
      kart(
        'Doğa mı belirler insan mı?',
        '- **Doğa:** sınırları çizer.\n- **İnsan:** o sınırlar içinde seçim yapar.\nBugünkü coğrafya bu karşılıklı ilişkiyi esas alır.',
      ),
      kart(
        'Mutlak ve göreli konum',
        '- **Mutlak konum:** enlem-boylamla verilen kesin yer\n- **Göreli konum:** başka yerlere göre durum ("Boğazların kıyısında")\nGöreli konum zamanla değer kazanıp yitirebilir.',
      ),
      kart(
        'Mekân ve yer',
        '- **Mekân:** genel, ölçülebilir alan\n- **Yer:** insanların anlam yüklediği mekân (doğduğun mahalle)',
      ),
      kart(
        'Hareket',
        'İnsan, mal, para ve fikir yerler arasında akar.\nGöç, ticaret ve internet bu akışın biçimleridir.',
      ),
      kart(
        'Coğrafi soru kurmak',
        '- Nerede? Neden orada?\n- Nasıl dağılmış?\n- Başka yerlerle nasıl bağlantılı?\n- Zamanla nasıl değişti?',
      ),
    ], [
      soru('Coğrafi bakış, olayları yer ve ölçek ilişkisi içinde değerlendirmektir.', true, 'Aynı olay yerel ve küresel ölçekte farklı okunuyor.'),
      soru('Bir olayın neyi etkilediğini sormak etkileşim kavramının işidir.', true, 'Konum "nerede", dağılış "nasıl yayılmış", ölçek "ne kadar geniş" sorusudur.'),
      soru('Doğa insanı tümüyle belirler; insanın doğayı değiştirme gücü yoktur.', false, 'İlişki karşılıklı: insan da araziyi, akarsuyu ve bitki örtüsünü değiştiriyor.'),
      soru('Coğrafyada neden-sonuç ilişkisi aranmaz.', false, 'Bir olayın niçin orada olduğunu sormak coğrafyanın temel işi.'),
      sikli('"Nasıl yayılmış?" sorusu hangi kavramın sorusudur?', ['Dağılış', 'Konum'], 0, 'Konum "nerede?" sorusuna cevap verir.'),
      sikli('"Nereye benziyor?" sorusu hangi kavramın sorusudur?', ['Konum', 'Bölge'], 1, 'Benzer özellik gösteren alanlar bir bölge oluşturur.'),
      soru('Bir bölgedeki kuraklık başka kıtadaki gıda fiyatını etkileyebilir.', true, 'Hiçbir yer yalıtık değil.'),
      soru('Enlem ve boylamla verilen konum mutlak konumdur.', true, 'Kesin ve değişmez.'),
      soru('Göreli konumun değeri zamanla hiç değişmez.', false, 'Yeni yollar ve ticaret onu değiştirebilir.'),
      soru('İnsanların anlam yüklediği mekâna yer denir.', true, 'Duygusal ve kültürel bağ.'),
      sikli('"Boğazların kıyısında" ifadesi hangi konum?', ['Mutlak', 'Göreli'], 1, 'Başka yerlere göre tarif.'),
      sikli('İnternetle bilgi akışı hangi kavramla ilgili?', ['Hareket', 'Mutlak konum'], 0, 'Yerler arası akış.'),
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
        'Afet yönetiminde',
        'CBS ile yapılır: risk haritaları, hasar tespiti, tahliye planı\nUydu görüntüsü ilk saatlerde hayat kurtarır.',
      ),
      kart(
        'Şehir planlamada',
        'İmar, altyapı ve ulaşım planları katman katman çözümlenir.\nYeni yatırımın yeri buna göre seçilir.',
      ),
      kart(
        'Tarım ve ormanda',
        'Uzaktan algılamayla yürütülür:\n- Ürün deseni ve verim tahmini\n- Kuraklık ve yangın takibi',
      ),
      kart(
        'Çevre izlemede',
        'Yıllar arası uydu görüntüleri karşılaştırılarak ölçülür:\n- Buzul erimesi\n- Kıyı değişimi\n- Ormansızlaşma',
      ),
      kart(
        'Sağlıkta',
        'Salgın haritaları hastalığın nerede yoğunlaştığını gösterir.\nMüdahale kaynakları bu haritaya göre dağıtılır.',
      ),
      kart(
        'Günlük hayatta',
        'Navigasyon, kargo takibi ve teslimat rotaları aynı teknolojinin ürünüdür.',
      ),
      kart(
        'Zaman boyutu',
        'Uzaktan algılamanın asıl gücü **karşılaştırmadır**.\nAynı yerin on yıl arayla görüntüsü, değişimi doğrudan ölçülebilir kılar.',
        undefined,
        { not: 'Aral Gölü\'nün 1989 ve 2014 uydu görüntüsü yan yana: tek görüntü göl gösterir, iki görüntü kaybı.' },
      ),
      kart(
        'Deprem sonrası hasar tespiti',
        'Depremden önceki ve sonraki uydu görüntüleri karşılaştırılarak yıkılan binalar saptanır.\nEkipler en çok hasar gören alanlara yönlendirilir.',
      ),
      kart(
        'İnsansız hava aracıyla haritalama',
        'Alçaktan uçan araçlar çok ayrıntılı görüntü alır.\nMaden, tarla ve şantiye alanları hızla ölçülür.',
      ),
      kart(
        'Arkeolojide',
        'Uydu ve hava görüntüleri toprak altındaki yapıların izlerini gösterebilir.\nKazı yeri bu izlere göre seçilir.',
      ),
      kart(
        'Açık veri',
        'Kurumların herkese açık paylaştığı mekânsal verilerdir.\nÖğrenci de bu verilerle kendi haritasını üretebilir.',
      ),
    ], [
      soru('CBS, afet sonrası hasar tespitinde kullanılır.', true, 'Önceki ve sonraki veriler üst üste konarak değişim görülüyor.'),
      soru('Uzaktan algılama orman yangınlarının izlenmesinde kullanılır.', true, 'Uydu görüntüleri sıcaklık farkını gösteriyor.'),
      soru('CBS yalnızca harita çizer, analiz yapamaz.', false, 'Katmanları ilişkilendirip sorgu ve analiz yapmak asıl gücü.'),
      soru('CBS verilerinde zaman boyutu bulunmaz.', false, 'Farklı tarihli veriler karşılaştırılarak değişim izleniyor.'),
      sikli('Salgın haritası ne için kullanılır?', ['Kaynakları yoğunluğa göre dağıtmak', 'Hastalığı tedavi etmek'], 0, 'Sağlıkta CBS.'),
      sikli('Kargo takibi ve navigasyon hangi teknolojinin ürünü?', ['CBS ve GPS', 'Uzaktan algılama'], 0, 'Günlük hayatta.'),
      sikli('Uzaktan algılama tarımda neyi tahmin etmekte kullanılır?', ['Toprak fiyatını', 'Ürün deseni ve verimi'], 1, 'Kuraklık ve yangın takibi de bu yöntemle yapılır.'),
      soru('İmar ve altyapı planları CBS ile katman katman çözümlenebilir.', true, 'Yeni yatırımın yeri bu çözümlemeye göre seçilir.'),
      soru('Önceki ve sonraki uydu görüntüleri hasarın tespitine yardım eder.', true, 'Karşılaştırma değişimi gösterir.'),
      soru('İnsansız hava araçları yalnızca askerî amaçla kullanılır.', false, 'Haritalama, tarım ve maden ölçümünde de.'),
      soru('Uydu görüntüleri gömülü yapıların izlerini gösterebilir.', true, 'Arkeolojide kazı yeri seçimi.'),
      sikli('Herkese açık paylaşılan mekânsal veri?', ['Açık veri', 'Gizli veri'], 0, 'Kurumlar paylaşır.'),
      sikli('Alçaktan uçup çok ayrıntılı görüntü alan araç?', ['Yer gözlem uydusu', 'İnsansız hava aracı'], 1, 'Uydu çok daha yüksekte.'),
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
      {
        soru: 'Depremde yıkılan binalar uydudan nasıl saptanır?',
        siklar: ['Önceki ve sonraki görüntüyü kıyaslayarak', 'Tek bir görüntüyle'],
        dogru: 0,
        aciklama: {
          dogru: 'Değişim iki zamanın karşılaştırılmasıyla görünür.',
          yanlis: 'Tek görüntü değişimi göstermez; önceki ve sonraki kıyaslanır.',
        },
        kart: 8,
      },
    ]),
    konu('cog10-veri-harita', 'Mekânsal Verilerin Haritalara Aktarılması', [
      kart(
        'Altlık harita',
        'Üzerine veri işlenecek temel haritadır.\nDoğru altlık seçilmezse veri yanlış yere düşer.',
      ),
      kart(
        'Veri türleri',
        '- **Vektör veri:** nokta, çizgi ve alan\n- **Raster veri:** piksel',
        {
          tur: 'tablo',
          basliklar: ['Vektör', 'Raster'],
          satirlar: [
            ['Nokta, çizgi, alan', 'Piksel'],
            ['Yol, sınır, bina', 'Uydu görüntüsü'],
            ['Ölçek bozulmaz', 'Yakınlaşınca bozulur'],
          ],
        },
      ),
      kart(
        'Adımlar',
        'Her harita üretimi aynı sırayı izler.\nİlk adım (amaç) atlanırsa geri kalanı da amaçsız kalır.',
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
        'Sınıflandırma önemlidir',
        'Aynı veri farklı aralıklarla sınıflandırılırsa harita bambaşka bir izlenim verir.',
        undefined,
        { not: 'Nüfus yoğunluğu 0-50-100 aralıklarında \'boş\' görünen il, 0-10-20 aralıklarında \'kalabalık\' görünür.' },
      ),
      kart(
        'Renk seçimi',
        '- **Artan bir değer için:** tek rengin tonları\n- **Karşıt iki değer için:** iki ayrı renk\nKeyfî renk haritayı okunmaz yapar.',
      ),
      kart(
        'Konum doğruluğu',
        'Verinin koordinat sistemi bilinmezse katmanlar birbirine oturmaz.\nHarita sessizce kayar.',
      ),
      kart(
        'Tematik harita türleri',
        '- **Koroplet:** alanlar değerine göre boyanır (il nüfusu).\n- **Nokta:** her nokta belli sayıda birim\n- **İzoçizgi:** eşit değerleri birleştiren eğriler (izoterm)\n- **Akış:** oklarla hareket (göç)',
      ),
      kart(
        'Lejant',
        'Haritadaki renk ve işaretlerin ne anlama geldiğini söyler.\nLejantsız tematik harita okunamaz.',
      ),
      kart(
        'Kaynak ve tarih',
        'Verinin kaynağı ve yılı haritada yazılmalıdır.\n2010 nüfusuyla çizilmiş harita bugünü anlatmaz.',
      ),
      kart(
        'Ölçeği amaç belirler',
        'Mahalle planı için büyük ölçek, ülke nüfusu için küçük ölçek seçilir.\nYanlış ölçek ya ayrıntıyı boğar ya da kaybeder.',
      ),
    ], [
      soru('Altlık harita, üzerine veri işlenen temel haritadır.', true, 'Kıyı, sınır ve akarsu gibi değişmeyen ögeleri taşıyor.'),
      soru('Verinin sınıflandırılma biçimi haritanın verdiği izlenimi değiştirir.', true, 'Aynı veri, aralıklar değişince başka bir dağılım gibi görünebiliyor.'),
      soru('Harita renkleri rastgele seçilebilir, okumayı etkilemez.', false, 'Renk sırası verinin sırasını anlatıyor; rastgele renk haritayı okunmaz kılar.'),
      soru('Konum doğruluğu düşük veriyle güvenilir bir harita üretilebilir.', false, 'Yanlış konumlanmış veri, haritayı olduğu gibi yanlış yapar.'),
      sikli('Artan bir değer haritada nasıl gösterilir?', ['Tek rengin tonlarıyla', 'Rastgele renklerle'], 0, 'Karşıt değerler iki renk.'),
      sikli('Katmanlar birbirine oturmuyorsa sebep ne olabilir?', ['Farklı koordinat sistemi', 'Yanlış renk'], 0, 'Harita sessizce kayar.'),
      soru('Raster veri yakınlaştırıldıkça pikseller belirginleşir.', true, 'Vektör veride yakınlaşınca biçim bozulmaz.'),
      soru('Eşit sıcaklıkları birleştiren eğriler izotermdir.', true, 'Bir izoçizgi türü.'),
      soru('Koroplet haritada göç okla gösterilir.', false, 'Oklar akış haritasıdır; koropletde alanlar boyanır.'),
      soru('Haritada verinin kaynağı ve yılı belirtilmelidir.', true, 'Eski veri bugünü anlatmaz.'),
      sikli('İl nüfuslarını renk tonlarıyla gösteren harita?', ['Akış', 'Koroplet'], 1, 'Akış hareket gösterir.'),
      sikli('Haritadaki işaretlerin anlamını söyleyen bölüm?', ['Lejant', 'Başlık'], 0, 'Başlık konuyu söyler.'),
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
        'Levha tektoniği',
        'Yer kabuğu levhalara bölünmüştür.\nLevhalar manto hareketleriyle sürüklenir.',
      ),
      kart(
        'Yerin katmanları',
        '- **Kabuk:** ince ve katı\n- **Manto:** katı ama yarı akışkan (plastik)\n- **Çekirdek:** en sıcak bölüm\nLevhaları mantodaki ısı akımları hareket ettirir.',
        {
          tur: 'katman',
          eksenAdi: 'DERİNLİK',
          katmanlar: [
            { ad: 'Yer kabuğu', alt: 'ince, katı' },
            { ad: 'Manto', alt: 'yarı akışkan' },
            { ad: 'Dış çekirdek', alt: 'sıvı' },
            { ad: 'İç çekirdek', alt: 'katı' },
          ],
        },
      ),
      kart(
        'Levha sınırları',
        '- **Uzaklaşan:** yeni kabuk oluşur.\n- **Yaklaşan:** dalma-batma olur.\n- **Yanal:** levhalar sürtünür.',
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
        'İç kuvvetler',
        '- Orojenez (dağ oluşumu)\n- Epirojenez (kıta oluşumu)\n- Volkanizma ve depremler\nEnerjisi yerin içinden gelir.',
      ),
      kart(
        'Türkiye neden depremsel?',
        'Anadolu levhası, Avrasya ve Arap levhaları arasında sıkışıyor.\nBatıya doğru itiliyor.',
        undefined,
        { not: 'Arap levhası kuzeye iter, Avrasya tutar, Anadolu batıya kaçar: KAF ve DAF bu kaçışın iki kenarı.' },
      ),
      kart(
        'Fay hatları',
        'Ülkenin en etkin iki kırık kuşağı:\n- Kuzey Anadolu Fay Hattı\n- Doğu Anadolu Fay Hattı',
      ),
      kart(
        'Deprem nasıl oluşur?',
        'Levhalar sürtünürken enerji birikir.\nKayaç dayanma sınırını aşınca kırılır, enerji dalgalar hâlinde yayılır.',
      ),
      kart(
        'Kıvrılma ve kırılma',
        '- **Kıvrılma:** esnek tabakalar bükülür; Toroslar ve Kuzey Anadolu Dağları\n- **Kırılma:** sert tabakalar kırılır; Ege’de horst ve grabenler',
      ),
      kart(
        'Horst ve graben',
        '- **Horst:** kırılıp yükselen blok (Bozdağlar)\n- **Graben:** kırılıp çöken blok (Gediz, Büyük Menderes ovaları)\nEge’de dağların denize dik uzanması bundandır.',
      ),
      kart(
        'Türkiye’nin volkanları',
        'Erciyes, Hasandağı, Ağrı, Nemrut ve Süphan sönmüş ya da uykudaki volkanlardır.\nKapadokya’nın tüf örtüsü volkan küllerinden oluştu.',
      ),
      kart(
        'Büyüklük ve şiddet',
        '- **Büyüklük (magnitüd):** açığa çıkan enerji; tek bir sayı\n- **Şiddet:** yerde görülen etki; yerden yere değişir',
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
      soru('Türkiye, deprem riski yüksek bir kuşakta yer alır.', true, 'Alp-Himalaya kuşağı üzerinde bulunuyor.'),
      soru('Depremler levha sınırlarında ve fay hatlarında yoğunlaşır.', true, 'Gerilme buralarda birikip boşalıyor.'),
      soru('İç kuvvetler yeryüzünü düzleştirir.', false, 'İç kuvvetler engebelendirir; düzleştiren dış kuvvetlerdir.'),
      sikli('Uzaklaşan levha sınırında ne olur?', ['Dalma-batma', 'Yeni kabuk oluşur'], 1, 'Yaklaşanda dalma-batma.'),
      sikli('Anadolu levhası neden batıya itiliyor?', ['Manto soğuyor', 'Avrasya ve Arap levhaları arasında sıkışıyor'], 1, 'Türkiye\'nin depremselliği.'),
      sikli('Dağ oluşumuna ne denir?', ['Epirojenez', 'Orojenez'], 1, 'Epirojenez kıta oluşumu.'),
      sikli('Deprem enerjisi nasıl birikir?', ['Volkan patlayınca', 'Levhalar sürtünürken'], 1, 'Kayaç dayanma sınırını aşınca kırılır.'),
      soru('Çekirdek yerin en sıcak bölümüdür.', true, 'Kabuk ince ve katı.'),
      soru('Ege\'deki ovalar grabenlerde oluşmuştur.', true, 'Çöken bloklar.'),
      soru('Depremin büyüklüğü yerden yere değişir.', false, 'Büyüklük tek; değişen şiddet.'),
      soru('Kapadokya\'nın tüfleri volkan küllerinden oluştu.', true, 'Peri bacalarının malzemesi.'),
      sikli('Kırılıp yükselen blok?', ['Graben', 'Horst'], 1, 'Graben çöken blok.'),
      sikli('Toroslar nasıl oluştu?', ['Kıvrılma', 'Volkanizma'], 0, 'Esnek tabakalar büküldü.'),
    ], [
      {
        soru: 'Levhaları hareket ettiren nedir?',
        siklar: ['Mantodaki ısı akımları', 'Ay\'ın çekimi'],
        dogru: 0,
        aciklama: {
          dogru: 'Akışkan manto konveksiyon akımlarıyla üstündeki kabuğu sürükler.',
          yanlis: 'Ay\'ın çekimi gelgiti yapar. Levhaları sürükleyen mantodaki ısı akımları.',
        },
        kart: 2,
      },
      {
        soru: 'Depremin yerde görülen etkisine ne denir?',
        siklar: ['Büyüklük', 'Şiddet'],
        dogru: 1,
        aciklama: {
          dogru: 'Şiddet yerden yere değişir; merkeze yaklaştıkça artar.',
          yanlis: 'Büyüklük açığa çıkan enerjidir, tek sayıdır. Yerdeki etki şiddet.',
        },
        kart: 11,
      },
    ]),
    konu('cog10-asinma', 'İklim ve Kayaç Yapısının Aşınmaya Etkisi', [
      kart(
        'Fiziksel ayrışma',
        'Kayaç kimyasal olarak değişmeden parçalanır.\nBaşlıca etken: donma-çözülme ve sıcaklık farkı',
      ),
      kart(
        'Kimyasal çözünme',
        'Su ve asitler kayacın yapısını değiştirir.\nSıcak ve nemli iklimlerde hızlıdır.',
      ),
      kart(
        'İkisinin karşılaştırması',
        'Hangisinin baskın olduğunu iklim belirler.\n- **Kurakta:** parçalanma\n- **Nemlide:** çözünme',
        {
          tur: 'tablo',
          basliklar: ['', 'Fiziksel', 'Kimyasal'],
          satirlar: [
            ['İklim', 'Kurak, soğuk', 'Sıcak, nemli'],
            ['Değişim', 'Şekil', 'Yapı'],
            ['Örnek', 'Donma-çözülme', 'Karstlaşma'],
          ],
        },
        { not: 'Toroslar\'da kireç taşı + yağış → mağara ve obruk (kimyasal). Çölde granit + sıcaklık farkı → çatlama (fiziksel).' },
      ),
      kart(
        'Kayaç türü belirleyici',
        '- **Kireç taşı:** kolay çözünür, karstik şekiller verir.\n- **Granit:** fiziksel ayrışmaya daha açıktır.',
      ),
      kart(
        'İklim belirleyici',
        '- **Kurak bölgeler:** fiziksel süreçler öne çıkar.\n- **Nemli bölgeler:** kimyasal süreçler öne çıkar.',
      ),
      kart(
        'Karstik şekiller',
        'Lapya, dolin, obruk, mağara ve sarkıt-dikit.\nTürkiye’de Taşeli ve Toroslar bu şekillerce zengindir.',
      ),
      kart(
        'Bitki örtüsünün rolü',
        'Bitki örtüsü toprağı tutar, aşınmayı yavaşlatır.\nÖrtüsüz yamaçta aynı yağmur kat kat çok toprak taşır.',
      ),
      kart(
        'Traverten',
        'Kireçli suyun içindeki kalsiyum karbonat su yüzeye çıkınca çökelir.\nPamukkale’nin beyaz basamakları travertendir.',
      ),
      kart(
        'Obruk',
        'Kireç taşının çözünmesiyle yer altında boşluk oluşur, üstü çöker.\nKonya Karapınar çevresinde yer altı suyunun aşırı çekilmesiyle obruklar arttı.',
      ),
      kart(
        'Peri bacaları',
        'Sert kayaç şapkanın altındaki yumuşak tüf yağmur ve rüzgârla aşınır.\nŞapka korumaya devam ettikçe sütun yükselir.',
      ),
      kart(
        'İklim ve toprak',
        '- **Nemli-sıcak:** kimyasal ayrışma derin toprak verir.\n- **Kurak:** ince, taşlı toprak\n- **Soğuk:** ayrışma yavaş, toprak sığ',
      ),
    ], [
      soru('Fiziksel ayrışma, günlük sıcaklık farkının fazla olduğu kurak bölgelerde etkilidir.', true, 'Kayaç ısınıp soğudukça çatlıyor.'),
      soru('Karstik şekiller kireç taşının çözünmesiyle oluşur.', true, 'Suyun içindeki karbondioksit çözünmeyi hızlandırıyor.'),
      soru('Kimyasal çözünme kurak ve soğuk bölgelerde en etkilidir.', false, 'Nemli ve sıcak bölgelerde etkili; su ve sıcaklık tepkimeyi hızlandırıyor.'),
      soru('Bitki örtüsü aşınmayı hızlandırır.', false, 'Kökleriyle toprağı tutarak aşınmayı yavaşlatıyor.'),
      sikli('Donma-çözülme hangi ayrışma türüdür?', ['Fiziksel', 'Kimyasal'], 0, 'Kayaç kimyasal değişmez.'),
      sikli('Hangisi karstik bir şekildir?', ['Menderes', 'Obruk'], 1, 'Menderes akarsuyun kıvrımı; obruk kireç taşının çözünmesiyle oluşur.'),
      sikli('Türkiye\'de karstik şekiller nerede zengindir?', ['Taşeli ve Toroslar', 'Doğu Anadolu'], 0, 'Kireç taşı bölgesi.'),
      sikli('Kimyasal çözünmede kayacın neyi değişir?', ['Yalnızca şekli', 'Yapısı'], 1, 'Fiziksel ayrışmada yalnızca şekil değişir.'),
      soru('Granit fiziksel ayrışmaya daha açıktır.', true, 'Kireç taşı ise kolay çözünür, karstik şekiller verir.'),
      soru('Pamukkale travertenleri kalsiyum karbonat birikimidir.', true, 'Kireçli sudan çökelir.'),
      soru('Peri bacaları buzul aşındırmasıyla oluştu.', false, 'Yağmur ve rüzgâr tüfü aşındırdı.'),
      soru('Yer altı suyunun aşırı çekilmesi obruk oluşumunu artırabilir.', true, 'Konya Karapınar örneği.'),
      sikli('Obruk hangi kayaçta oluşur?', ['Granit', 'Kireç taşı'], 1, 'Kireç taşı çözünür.'),
    ], [
      {
        soru: 'Kurak iklimde hangi ayrışma türü baskındır?',
        siklar: ['Fiziksel', 'Kimyasal'],
        dogru: 0,
        aciklama: {
          dogru: 'Gündüz-gece sıcaklık farkı kayayı çatlatır; çözünme için su gerekir ve su az.',
          yanlis: 'Kimyasal çözünme su ve sıcaklık ister; nemli iklimde baskın. Kurakta sıcaklık farkı kayayı fiziksel olarak parçalar.',
        },
        kart: 5,
      },
      {
        soru: 'Pamukkale\'nin beyaz basamaklarının adı?',
        siklar: ['Traverten', 'Moren'],
        dogru: 0,
        aciklama: {
          dogru: 'Kireçli sudan çökelen traverten.',
          yanlis: 'Moren buzulun biriktirdiği moloz. Pamukkale travertendir.',
        },
        kart: 8,
      },
    ]),
    konu('cog10-asinim-birikim', 'Aşınım ve Birikim Süreçlerinin Etkisi', [
      kart(
        'Dış kuvvetler',
        'Akarsu, rüzgâr, buzul, dalga ve yer altı suyu.\nEnerjisini Güneş’ten alır; yüksek yeri aşındırır, çukuru doldurur.',
      ),
      kart(
        'İç ve dış kuvvet yarışı',
        '- **İç kuvvetler:** yükseltir.\n- **Dış kuvvetler:** tıraşlar.\nYer şekilleri bu iki yönün o andaki dengesidir.',
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
        'Akarsu şekilleri',
        'Vadi, menderes, delta ve birikinti konisi.\nTürkiye’de en etkili dış kuvvet **akarsulardır**.',
      ),
      kart(
        'Menderes nasıl oluşur?',
        'Eğim azalınca akarsu yavaşlar.\nDış kıyıyı aşındırıp iç kıyıya biriktirir; kıvrımlar büyür.',
      ),
      kart(
        'Rüzgâr şekilleri',
        'Mantar kaya, kumul ve tafoni.\nBitki örtüsü zayıf, kurak alanlarda etkilidir.',
      ),
      kart(
        'Buzul şekilleri',
        'Sirk, buzul vadisi (U vadi) ve moren.\nTürkiye’de yalnızca yüksek dağlarda görülür.',
      ),
      kart(
        'Kıyı şekilleri',
        'Falez, kumsal, kıyı oku ve lagün.\nDalga ve akıntı aşındırır ve biriktirir.',
      ),
      kart(
        'Vadi biçimi anlatır',
        '- **V biçimli vadi:** akarsuyun izi\n- **U biçimli vadi:** buzulun izi\nŞekil, onu oluşturan kuvveti ele verir.',
        undefined,
        { not: 'V vadi akarsu (Fırat), U vadi buzul (Kaçkarlar), boğaz vadi akarsuyun sert kayayı derin yarması.' },
      ),
      kart(
        'Türkiye’nin deltaları',
        '- **Bafra:** Kızılırmak\n- **Çarşamba:** Yeşilırmak\n- **Çukurova:** Seyhan ve Ceyhan\n- **Silifke:** Göksu',
      ),
      kart(
        'Kanyon',
        'Akarsuyun dayanıklı kayaçları derine kazmasıyla oluşan dik yamaçlı dar vadidir.\nIhlara ve Köprülü kanyonları örnektir.',
      ),
      kart(
        'Tombolo',
        'Kıyı ile bir adayı birleştiren kum ve çakıl birikimidir.\nKapıdağ Yarımadası bir tombolo ile karaya bağlanmıştır.',
      ),
      kart(
        'Kıyı tipleri',
        '- **Boyuna kıyı:** dağlar kıyıya paralel; Karadeniz, Akdeniz\n- **Enine kıyı:** dağlar kıyıya dik; Ege\n- **Ria:** akarsu vadisine deniz girmiş; Haliç',
      ),
    ], [
      soru('Menderesler, eğimin azaldığı yerlerde oluşur.', true, 'Yavaşlayan akarsu yatağında kıvrılarak akıyor.'),
      soru('Buzul vadileri U biçimli, akarsu vadileri V biçimlidir.', true, 'Vadinin biçimi onu oluşturan kuvveti ele veriyor.'),
      soru('Dış kuvvetlerin enerji kaynağı yerin iç ısısıdır.', false, 'Dış kuvvetler güneş enerjisi ve yer çekimiyle çalışır; iç ısı iç kuvvetlerin kaynağı.'),
      soru('Delta ovaları akarsuyun aşındırma gücüyle oluşur.', false, 'Taşıdığı malzemeyi denize dökülürken biriktirmesiyle oluşuyor.'),
      sikli('Türkiye\'de en etkili dış kuvvet?', ['Akarsu', 'Buzul'], 0, 'Vadi, menderes, delta.'),
      sikli('Mantar kaya ve kumul hangi kuvvetin ürünü?', ['Dalga', 'Rüzgâr'], 1, 'Bitki örtüsü zayıf, kurak alanlarda etkili.'),
      sikli('Falez ve lagün hangi kuvvetin ürünü?', ['Dalga ve akıntı', 'Buzul'], 0, 'Kıyı şekilleri.'),
      sikli('Menderes kıvrımları neden büyür?', ['Dış kıyı aşınır, iç kıyıda birikir', 'Akarsu hızlanır'], 0, 'Yavaşlayan akarsu dış kıyıyı oyar, iç kıyıya malzeme bırakır.'),
      sikli('Sirk ve moren hangi kuvvetin eseridir?', ['Rüzgâr', 'Buzul'], 1, 'Mantar kaya ve kumul rüzgârın eseri.'),
      soru('İç kuvvetler yükseltir, dış kuvvetler tıraşlar.', true, 'Yer şekilleri iki yönün dengesi.'),
      soru('Bafra Deltası Kızılırmak\'ın biriktirmesiyle oluştu.', true, 'Karadeniz kıyısında.'),
      soru('Ege kıyıları boyuna kıyı tipindedir.', false, 'Dağlar kıyıya dik: enine kıyı.'),
      soru('Kapıdağ Yarımadası karaya bir tombolo ile bağlıdır.', true, 'Kum ve çakıl birikimi.'),
      sikli('Haliç hangi kıyı tipine örnektir?', ['Enine', 'Ria'], 1, 'Deniz vadiye girmiş.'),
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
      {
        soru: 'Ege\'de girinti çıkıntının fazla olmasının sebebi?',
        siklar: ['Dağların kıyıya dik uzanması', 'Dağların kıyıya paralel uzanması'],
        dogru: 0,
        aciklama: {
          dogru: 'Enine kıyıda deniz ovalara sokulur, girinti çıkıntı artar.',
          yanlis: 'Paralel dağlar boyuna kıyı yapar; kıyı düzdür (Karadeniz).',
        },
        kart: 12,
      },
    ]),
    konu('cog10-saha', 'Yeryüzü Şekilleri ile İlgili Saha Çalışması', [
      kart(
        'Saha çalışması nedir?',
        'Coğrafi olayı yerinde gözlemleyip veri toplamaktır.\nCoğrafyanın laboratuvarı arazidir.',
      ),
      kart(
        'Hazırlık',
        '- Amaç belirlenir.\n- Harita ve hava fotoğrafı incelenir.\n- Ölçüm araçları ve güvenlik planı hazırlanır.',
      ),
      kart(
        'Arazide',
        'Gözlem yapılır, ölçüm alınır, fotoğraf çekilir ve eskiz çizilir.\nHer kayda **yer ve saat** yazılır.',
      ),
      kart(
        'Neden yer ve saat?',
        'Konumu ve zamanı yazılmayan gözlem hiçbir haritaya oturtulamaz.\nVeri olmaktan çıkar.',
        undefined,
        { not: 'Ölçümde koordinat ve saat yoksa \'sıcaklık 12 °C\' hiçbir şey demez: nerede, sabah mı öğle mi?' },
      ),
      kart(
        'Sanal saha çalışması',
        'Uydu görüntüsü ve panoramik haritalarla araziye gitmeden inceleme yapılır.\nErişilemeyen alanlar için elverişlidir.',
      ),
      kart(
        'Raporlama',
        'Toplanan veri çözümlenir, bulgular haritayla birlikte sunulur.\nHam gözlem tek başına sonuç değildir.',
      ),
      kart(
        'Araç gereç',
        '- GPS ya da telefonla konum\n- Pusula ve altimetre\n- Fotoğraf makinesi\n- Not defteri ve gözlem formu',
      ),
      kart(
        'Güvenlik',
        '- Tek başına gitme, rotayı birine bildir.\n- Hava durumuna bak, uygun giysi giy.\n- Dere yatağı ve dik yamaçtan uzak dur.',
      ),
      kart(
        'Gözlem formu',
        'Her durakta aynı sorular sorulur: yer, saat, yükselti, yer şekli, bitki örtüsü, insan etkisi.\nForm, verilerin karşılaştırılabilir olmasını sağlar.',
      ),
      kart(
        'Saha etiği',
        'Özel araziye izinsiz girilmez, bitki koparılmaz, çöp bırakılmaz.\nFotoğrafı çekilecek kişiden izin alınır.',
      ),
    ], [
      soru('Saha çalışmasında gözlemin yeri ve saati kaydedilmelidir.', true, 'Aynı yerin başka zamanla karşılaştırılabilmesi buna bağlı.'),
      soru('Saha çalışması öncesinde harita ve kaynak incelemesi yapılır.', true, 'Arazide neye bakılacağı önceden belirleniyor.'),
      soru('Sanal saha çalışması, gerçek arazi gözleminin bütün kazanımlarını sağlar.', false, 'Erişim sağlar ama arazide edinilen doğrudan gözlemin yerini tutmaz.'),
      soru('Saha çalışması yalnızca uzman coğrafyacıların yapabileceği bir iştir.', false, 'Planlı bir gözlem ve kayıtla öğrenciler de yürütebiliyor.'),
      sikli('Coğrafyanın laboratuvarı neresidir?', ['Arazi', 'Kütüphane'], 0, 'Saha çalışması.'),
      sikli('Erişilemeyen alanlar için hangi yöntem?', ['Sanal saha çalışması', 'Anket'], 0, 'Uydu ve panoramik harita.'),
      soru('Ham gözlem tek başına sonuçtur.', false, 'Çözümlenip haritayla sunulmalı.'),
      soru('Saha çalışmasında rota başkasına bildirilmelidir.', true, 'Güvenlik kuralı.'),
      soru('Gözlem formu her durakta farklı sorular içermelidir.', false, 'Aynı sorular karşılaştırmayı sağlar.'),
      soru('Yükseltiyi ölçen alet altimetredir.', true, 'Basınçtan yükselti hesaplar.'),
      sikli('Saha etiğine uygun davranış?', ['Bitki koparmak', 'Çöp bırakmamak'], 1, 'Çevreye zarar verilmez.'),
      sikli('Yönü bulmak için kullanılan araç?', ['Pusula', 'Termometre'], 0, 'Termometre sıcaklık ölçer.'),
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
        'Yerleşmeye etkisi',
        '- **Yerleşme çeker:** düz ve su kaynağına yakın alanlar\n- **Caydırır:** dik yamaçlar ve bataklıklar',
      ),
      kart(
        'Ulaşıma etkisi',
        'Dağlık alanda yol maliyeti artar.\nGeçitler ve vadiler tarih boyunca güzergâhı belirlemiştir.',
      ),
      kart(
        'Tarıma etkisi',
        'Eğim arttıkça makineli tarım zorlaşır, erozyon riski büyür.\nTeraslama bir uyum yöntemidir.',
      ),
      kart(
        'Yükselti ve tarım',
        'Yükseldikçe sıcaklık düşer, yetişme süresi kısalır.\nBu yüzden ürün deseni değişir.',
      ),
      kart(
        'İnsanın araziyi değiştirmesi',
        'Yer şekillerini doğrudan dönüştürür:\ntünel, baraj, dolgu ve maden ocakları',
      ),
      kart(
        'Değiştirmenin bedeli',
        '- **Dere yatağını daraltmak:** taşkını davet eder.\n- **Yamacı kesmek:** heyelanı davet eder.\nAraziye yapılan müdahale hep bir karşılık üretir.',
        undefined,
        { not: 'Dere yatağına yapılan mahalle: 10 yıl sorunsuz, 11. yılda taşkın. Dere yatağını unutmaz.' },
      ),
      kart(
        'Karşılıklı ilişki',
        'Arazi insanı sınırlar, insan da araziyi dönüştürür.\nCoğrafyanın baktığı şey bu çift yönlü etkidir.',
      ),
      kart(
        'Türkiye’de yerleşme dokusu',
        '- **Karadeniz:** dağınık; su bol, arazi engebeli\n- **İç Anadolu:** toplu; su kaynağı sınırlı\nYer şekli ve su birlikte belirler.',
      ),
      kart(
        'Geçitler',
        'Dağların kolay aşıldığı alçak yerlerdir.\nGülek Boğazı Toroslar’ı, Zigana Geçidi Doğu Karadeniz Dağları’nı aşar.',
      ),
      kart(
        'Barajlar',
        'Akarsuyun önü kesilerek enerji ve sulama suyu sağlanır.\nBedeli: tarım arazisi ve yerleşmeler su altında kalabilir, akarsu rejimi değişir.',
      ),
      kart(
        'Madencilik ve arazi',
        'Açık ocak madenciliği araziyi dev çukurlara çevirir.\nMaden bitince alanın yeniden doğaya kazandırılması (rehabilitasyon) gerekir.',
      ),
    ], [
      soru('Dağlık alanlarda yol yapım maliyeti yüksektir.', true, 'Tünel ve viyadük gerektiriyor.'),
      soru('Yükselti arttıkça yetiştirilebilen tarım ürünü çeşidi azalır.', true, 'Sıcaklık düşüp yetişme süresi kısalıyor.'),
      soru('İnsanın araziyi değiştirmesinin çevresel bir bedeli yoktur.', false, 'Erozyon, sel riski ve habitat kaybı bu değişimin bedelleri.'),
      soru('Yer şekilleri yerleşmelerin dağılışını etkilemez.', false, 'Ovalar ve vadi tabanları yoğun, dağlık alanlar seyrek nüfusludur.'),
      sikli('Tarih boyunca yol güzergâhını ne belirledi?', ['Ovaların büyüklüğü', 'Geçitler ve vadiler'], 1, 'Dağlık alanda maliyet artar.'),
      sikli('Dere yatağını daraltmak neyi davet eder?', ['Kuraklığı', 'Taşkını'], 1, 'Yamacı kesmek heyelanı.'),
      sikli('Tünel, baraj ve dolgu neye örnektir?', ['İnsanın araziyi değiştirmesine', 'Doğal aşınmaya'], 0, 'Arazi insanı sınırlar, insan da araziyi dönüştürür.'),
      soru('Bataklık alanlar yerleşmeyi çeker.', false, 'Caydırır.'),
      soru('Karadeniz\'de dağınık yerleşme yaygındır.', true, 'Su bol, arazi engebeli.'),
      soru('Barajların hiçbir çevresel bedeli yoktur.', false, 'Arazi su altında kalabilir, rejim değişir.'),
      soru('Gülek Boğazı Toroslar\'ı aşan bir geçittir.', true, 'Çukurova ile İç Anadolu arası.'),
      sikli('Zigana Geçidi hangi dağları aşar?', ['Toroslar', 'Doğu Karadeniz Dağları'], 1, 'Trabzon-Gümüşhane yolu.'),
      sikli('Maden bitince alanın doğaya kazandırılması?', ['Rehabilitasyon', 'Erozyon'], 0, 'Erozyon toprak kaybı.'),
    ], [
      {
        soru: 'Eğimli arazide tarım için hangi uyum yöntemi kullanılır?',
        siklar: ['Drenaj', 'Teraslama'],
        dogru: 1,
        aciklama: {
          dogru: 'Yamacı basamaklara bölmek erozyonu azaltır ve ekim yüzeyi açar.',
          yanlis: 'Drenaj fazla suyu uzaklaştırmak için, bataklıkta. Yamaçta yöntem teraslama.',
        },
        kart: 3,
      },
      {
        soru: 'İç Anadolu\'da toplu yerleşmenin başlıca sebebi?',
        siklar: ['Sınırlı su kaynağı', 'Bol yağış'],
        dogru: 0,
        aciklama: {
          dogru: 'Evler kıt su kaynağı çevresinde toplanır.',
          yanlis: 'Bol yağış dağınık yerleşmeye yol açar (Karadeniz). İç Anadolu\'da su kıttır.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('cog10-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog10-yerlesme-kurulus', 'Yerleşmelerin Kuruluşu ve Gelişimi', [
      kart(
        'Yer seçiminde doğal etkenler',
        '- Su kaynağı\n- İklim ve yer şekli\n- Toprak verimliliği\n- Güvenlik',
      ),
      kart(
        'Savunma kaygısı',
        'Eski şehirler çoğu zaman savunulabilir yerlere kuruldu.\nÖrnek: tepe, yarımada',
      ),
      kart(
        'Beşerî etkenler',
        'Ticaret yolları, sanayi, maden ve idari kararlar.\nAnkara’nın başkent olması şehri hızla büyüttü.',
      ),
      kart(
        'Kırsal ve kentsel yerleşme',
        'Ayrım üç ölçüte göre yapılır:\n- Nüfus\n- Ekonomik faaliyet\n- Hizmet çeşitliliği',
      ),
      kart(
        'Yerleşme dokusu',
        '- **Toplu yerleşme:** su kıtlığı ve güvenlik kaygısı olan yerlerde\n- **Dağınık yerleşme:** su ve arazinin bol olduğu yerlerde',
      ),
      kart(
        'Neden değişir?',
        'Kuruluş sebebi ortadan kalksa da şehir kalabilir.\nSavunma için kurulan bir kale şehri bugün turizmle yaşıyor olabilir.',
        undefined,
        { not: 'Ankara başkent olmadan önce 30 bin nüfuslu kasabaydı; idari karar şehri kurdu. Kuruluş sebebi: siyasi.' },
      ),
      kart(
        'Geçici yerleşmeler',
        'Yayla, oba ve dam mevsimlik kullanılır.\nKonargöçer geleneğin bugüne kalan izleridir.',
      ),
      kart(
        'Köy altı yerleşmeler',
        '- **Mezra:** tarla başındaki birkaç ev\n- **Oba:** konargöçerlerin çadır yerleşmesi\n- **Yayla:** yazın hayvanla çıkılan yer\n- **Dalyan:** balıkçılık yeri',
      ),
      kart(
        'Hızlı kentleşmenin sonuçları',
        '- Gecekondu ve plansız yapılaşma\n- Altyapı ve ulaşım yetersizliği\n- Tarım alanlarının şehre açılması',
      ),
      kart(
        'Kentsel yayılma',
        'Şehir çevresindeki tarım ve orman alanlarına dağınık biçimde yayılır.\nUlaşım uzar, altyapı maliyeti artar.',
      ),
      kart(
        'Şehir planı biçimleri',
        '- **Izgara plan:** sokaklar dik kesişir; planlı şehirler\n- **Organik doku:** dar, kıvrımlı sokaklar; eski şehir merkezleri',
      ),
    ], [
      soru('Su kaynaklarına yakınlık, yerleşme yeri seçiminde belirleyici olmuştur.', true, 'İlk yerleşmelerin çoğu akarsu kenarında kuruldu.'),
      soru('Eski yerleşmelerde savunma kaygısı yer seçimini etkilemiştir.', true, 'Tepe üstleri ve yarımadalar bu yüzden tercih edildi.'),
      soru('Yayla ve oba sürekli yerleşmelere örnektir.', false, 'İkisi de yılın belirli döneminde kullanılan geçici yerleşmeler.'),
      soru('Bir yerleşmenin dokusu kurulduğu gibi kalır, zamanla değişmez.', false, 'Nüfus, ekonomi ve ulaşım değiştikçe doku da değişiyor.'),
      sikli('Toplu yerleşme hangi koşulda görülür?', ['Su kıtlığı ve güvenlik kaygısı', 'Bol su ve arazi'], 0, 'Bol su ve arazi dağınık yerleşmeyi doğurur.'),
      sikli('Ankara\'nın hızla büyümesinin sebebi?', ['Maden', 'Başkent olması (idari karar)'], 1, 'Beşerî etken.'),
      sikli('Kırsal ile kentsel yerleşmeyi ayıran ölçütlerden biri?', ['Ekonomik faaliyet', 'Binaların rengi'], 0, 'Nüfus ve hizmet çeşitliliği de ölçüttür.'),
      soru('Kuruluş sebebi kalksa şehir de yok olur.', false, 'Yeni işlevle kalabilir.'),
      soru('Oba konargöçerlerin çadır yerleşmesidir.', true, 'Geçici yerleşme.'),
      soru('Hızlı kentleşme altyapı sorunlarını azaltır.', false, 'Altyapı yetişemez, sorun artar.'),
      soru('Eski şehir merkezlerinde çoğunlukla organik doku görülür.', true, 'Dar, kıvrımlı sokaklar.'),
      sikli('Tarla başındaki birkaç evden oluşan yerleşme?', ['Dalyan', 'Mezra'], 1, 'Dalyan balıkçılık yeri.'),
      sikli('Sokakların dik kesiştiği plan?', ['Izgara', 'Organik'], 0, 'Planlı şehirlerde.'),
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
      {
        soru: 'Şehrin çevresindeki tarım alanlarına dağınık biçimde yayılmasına ne denir?',
        siklar: ['Kentsel yayılma', 'Kentsel dönüşüm'],
        dogru: 0,
        aciklama: {
          dogru: 'Kentsel yayılma altyapı maliyetini ve ulaşımı artırır.',
          yanlis: 'Kentsel dönüşüm eski yapı stokunun yenilenmesidir.',
        },
        kart: 10,
      },
    ]),
    konu('cog10-yerlesme-fonksiyon', 'Yerleşmelerin Fonksiyonları', [
      kart(
        'Fonksiyon nedir?',
        'Bir yerleşmenin öne çıkan temel işlevidir.\nŞehri besleyen ana faaliyettir.',
      ),
      kart(
        'Başlıca türler',
        '- Tarım, sanayi, maden şehirleri\n- Ticaret ve liman şehirleri\n- Turizm ve üniversite şehirleri\n- İdari ve askerî şehirler',
      ),
      kart(
        'Türkiye’den örnekler',
        'Bir şehrin adı çoğu zaman öne çıkan işleviyle birlikte anılır.\nTabloda beş örnek var.',
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
        'Fonksiyon değişebilir',
        'Maden tükenir ya da yol değişirse şehir küçülebilir.\nYa da yeni bir işleve geçebilir.',
        undefined,
        { not: 'Zonguldak kömürle büyüdü, maden azalınca nüfus kaybetti. Tek işlevli şehir, işlev bitince küçülür.' },
      ),
      kart(
        'Çok fonksiyonlu şehirler',
        'Büyük şehirlerde tek bir işlev baskın değildir.\nİstanbul ticaret, sanayi, turizm ve kültürü birlikte taşır.',
      ),
      kart(
        'Fonksiyon ve nüfus',
        '- **İşlev çeşitlendikçe:** şehir daha çok insanı besler.\n- **Tek işleve bağlı şehir:** o işlev sarsılınca hızla göç verir.',
      ),
      kart(
        'Şehir kademeleri',
        'Köy → kasaba → il merkezi → bölge merkezi → metropol\nÜst kademedeki şehir daha nadir ve üst düzey hizmet sunar (üniversite hastanesi, havalimanı).',
      ),
      kart(
        'Metropol ve megakent',
        '- **Metropol:** çevresine hizmet veren büyük şehir\n- **Megakent:** nüfusu 10 milyonu aşan şehir; İstanbul bunlardandır.',
      ),
      kart(
        'Uydu kent',
        'Büyük şehrin yakınında kurulup ona bağımlı yaşayan yerleşmedir.\nHalkın çoğu işe ana şehre gider.',
      ),
      kart(
        'Kentsel dönüşüm',
        'Eski ve riskli yapı stokunun yenilenmesidir.\nDepreme dayanıklılık kadar sosyal dokunun korunması da tartışılır.',
      ),
    ], [
      soru('Bir yerleşmenin fonksiyonu, orada öne çıkan ekonomik etkinliktir.', true, 'Liman kenti, sanayi kenti gibi adlandırmalar buradan geliyor.'),
      soru('Büyük şehirler genellikle çok fonksiyonludur.', true, 'Tek bir etkinlik değil, birden çok işlev bir arada yürüyor.'),
      soru('Bir yerleşmenin fonksiyonu zamanla değişmez.', false, 'Madeni tükenen kent turizm kentine dönüşebiliyor.'),
      soru('Turizm bir yerleşme fonksiyonu sayılmaz.', false, 'Turizm kenti, fonksiyon türlerinden biri.'),
      sikli('Antalya\'nın öne çıkan fonksiyonu nedir?', ['Sanayi', 'Turizm'], 1, 'Bursa ve Kocaeli sanayi şehirleri.'),
      sikli('İşlev çeşitlendikçe şehir için ne söylenir?', ['Daha çok insanı besler', 'Nüfus kaybeder'], 0, 'Tek işleve bağlı şehir o işlev sarsılınca göç verir.'),
      soru('Zonguldak\'ın öne çıkan fonksiyonu madenciliktir.', true, 'Kömürle büyüdü; maden azalınca nüfus kaybetti.'),
      soru('İstanbul bir megakenttir.', true, 'Nüfusu 10 milyonu aşar.'),
      soru('Uydu kentte yaşayanlar ana şehre hiç gitmez.', false, 'Çoğu işe ana şehre gider.'),
      soru('Üst kademedeki şehirler daha nadir hizmetler sunar.', true, 'Havalimanı, üniversite hastanesi.'),
      sikli('Nüfusu 10 milyonu aşan şehir?', ['Kasaba', 'Megakent'], 1, 'Kasaba küçük yerleşme.'),
      sikli('Riskli yapıların yenilenmesi?', ['Kentsel dönüşüm', 'Kentsel yayılma'], 0, 'Yayılma şehrin dışa taşmasıdır.'),
    ], [
      {
        soru: 'Tek işleve bağlı şehir o işlev sarsılınca ne yapar?',
        siklar: ['Nüfusu artar', 'Hızla göç verir'],
        dogru: 1,
        aciklama: {
          dogru: 'Maden kapanınca maden şehri boşalır; çeşitlenmiş şehir dayanır.',
          yanlis: 'İşi bitince insanlar gider. Tek işleve bağlılık kırılganlık demek; çok fonksiyonlu şehir sarsıntıyı atlatır.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('cog10-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog10-ekonomi-ozellik', 'Ekonomik Faaliyetlerin Özellikleri', [
      kart(
        'Beş sektör',
        'Faaliyetler doğaya olan uzaklıklarına göre basamaklanır.\nYukarı çıktıkça katma değer artar.',
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
        'Birincil faaliyetler',
        'Doğadan doğrudan ürün alma:\ntarım, hayvancılık, ormancılık, balıkçılık, madencilik',
      ),
      kart(
        'İkincil faaliyetler',
        'Ham maddeyi işleyip ürüne çevirme:\nsanayi, imalat, inşaat',
      ),
      kart(
        'Üçüncül faaliyetler',
        'Hizmet üretimi:\nticaret, ulaşım, turizm, sağlık, eğitim',
      ),
      kart(
        'Dördüncül ve beşincil',
        '- **Dördüncül:** bilgi işleme, araştırma-geliştirme\n- **Beşincil:** üst düzey karar ve yönetim\nGelişmiş ekonomilerde payları artıyor.',
      ),
      kart(
        'Sektörler birbirine bağlı',
        'Tarım olmadan gıda sanayii, sanayi olmadan lojistik olmaz.\nZincirin bir halkası ötekini besler.',
      ),
      kart(
        'Katma değer',
        'Ham maddenin işlenerek kazandığı ek değerdir.\nAynı pamuk, kumaşa ve giysiye dönüştükçe kat kat değerlenir.',
        undefined,
        { not: '1 kg pamuk 1 lira, kumaş olunca 10, gömlek olunca 100. Sanayi olmayan ülke pamuğu 1 liraya satar.' },
      ),
      kart(
        'Ekstansif ve entansif tarım',
        '- **Ekstansif:** geniş alan, az emek ve sermaye, düşük verim; kurak bölgelerde nadas\n- **Entansif:** sulama, gübre, makine; yüksek verim',
      ),
      kart(
        'Hayvancılık türleri',
        '- **Büyükbaş:** sığır; yağışlı, gür çayırlı alanlar\n- **Küçükbaş:** koyun, keçi; kurak bozkırlar ve dağlık alanlar\n- **Ahır hayvancılığı:** yem sanayiine dayalı, modern',
      ),
      kart(
        'Dış ticaret',
        '- **İhracat:** yurt dışına satış\n- **İthalat:** yurt dışından alım\nİhracat ithalatı karşılayamazsa dış ticaret açığı oluşur.',
      ),
      kart(
        'Ulaşım türleri',
        '- **Kara yolu:** esnek, en yaygın\n- **Demir yolu:** ağır yük için ucuz\n- **Deniz yolu:** uluslararası yükün çoğu\n- **Hava yolu:** hızlı, pahalı',
      ),
    ], [
      soru('Tarım, madencilik ve balıkçılık birincil ekonomik faaliyetlerdir.', true, 'Doğrudan doğadan üretim yapıyorlar.'),
      soru('Ham maddenin işlenmesi ikincil faaliyettir.', true, 'Sanayi bu grupta yer alıyor.'),
      soru('Katma değer, ham maddenin işlenmeden satılmasıyla artar.', false, 'İşlendikçe artar; ham madde ihracı katma değeri düşük tutuyor.'),
      soru('Ekonomik sektörler birbirinden bağımsız çalışır.', false, 'Sanayi tarımın ürününü, hizmet ikisinin ulaşımını ve satışını üstleniyor.'),
      sikli('Beşincil sektör neyi kapsar?', ['Balıkçılığı', 'Üst düzey karar ve yönetimi'], 1, 'Balıkçılık birincil sektör.'),
      sikli('İnşaat hangi sektördür?', ['Üçüncül', 'İkincil'], 1, 'Ham maddeyi ürüne çevirme.'),
      sikli('Araştırma-geliştirme hangi sektördür?', ['Birincil', 'Dördüncül'], 1, 'Bilgi işleme.'),
      sikli('Ormancılık hangi sektördür?', ['Birincil', 'Üçüncül'], 0, 'Doğadan doğrudan ürün alınıyor.'),
      soru('Sektör basamaklarında yukarı çıktıkça katma değer artar.', true, 'Birincilden beşincile doğru doğadan uzaklaşılır, değer artar.'),
      soru('Entansif tarımda verim yüksektir.', true, 'Sulama, gübre ve makine kullanılır.'),
      soru('Küçükbaş hayvancılık en çok gür çayırlı yağışlı alanlarda yapılır.', false, 'Kurak bozkırlarda; gür çayır büyükbaşa uygun.'),
      soru('Uluslararası yükün çoğu deniz yoluyla taşınır.', true, 'En ucuz uzun mesafe yolu.'),
      sikli('İhracatın ithalatı karşılayamaması?', ['Dış ticaret fazlası', 'Dış ticaret açığı'], 1, 'Fazla tersi durumdur.'),
    ], [
      {
        soru: 'Turizm ve sağlık hangi sektöre girer?',
        siklar: ['İkincil (sanayi)', 'Üçüncül (hizmet)'],
        dogru: 1,
        aciklama: {
          dogru: 'Ürün değil hizmet üretilir.',
          yanlis: 'İkincil sektör ham maddeyi işler (fabrika, inşaat). Turizm ve sağlık hizmet üretir: üçüncül.',
        },
        kart: 4,
      },
      {
        soru: 'Nadas uygulanan, verimi düşük tarım türü?',
        siklar: ['Ekstansif', 'Entansif'],
        dogru: 0,
        aciklama: {
          dogru: 'Ekstansif tarım geniş alanda az girdiyle yapılır; nadas buna örnek.',
          yanlis: 'Entansif tarım sulama ve gübreyle yoğun yapılır; nadas gerekmez.',
        },
        kart: 10,
      },
    ]),
    konu('cog10-sektor-gelismislik', 'Ekonomik Sektörler ve Gelişmişlik', [
      kart(
        'Gelişmişlik göstergesi',
        'Sektör dağılımı ülkenin gelişmişliğini gösterir.\nBirincil sektörün payı azaldıkça gelişmişlik artar.',
      ),
      kart(
        'Az gelişmiş ülkelerde',
        'Nüfusun büyük kısmı tarımda çalışır.\nAma üretilen katma değer düşüktür.',
      ),
      kart(
        'Gelişmiş ülkelerde',
        'Hizmet sektörü hem istihdamda hem millî gelirde başı çeker.\nTarımın payı yüzde birkaçtır.',
      ),
      kart(
        'İstihdam ve gelir farkı',
        'Bir sektörde çok kişi çalışması, çok gelir ürettiği anlamına gelmez.\nTarım buna örnektir: çalışanı çok, geliri azdır.',
        {
          tur: 'tablo',
          basliklar: ['Ülke', 'Tarım payı', 'Hizmet payı'],
          satirlar: [
            ['Az gelişmiş', 'Yüksek', 'Düşük'],
            ['Gelişmiş', 'Çok düşük', 'Yüksek'],
          ],
        },
        { not: 'Türkiye\'de tarım çalışanların ~%15\'i, millî gelirin ~%6\'sı: çok kişi, az gelir = düşük verim.' },
      ),
      kart(
        'Göstergeler',
        'Birlikte okunur:\n- Kişi başına gelir\n- İnsani Gelişme Endeksi\n- Okuryazarlık\n- Bebek ölüm hızı',
      ),
      kart(
        'Neden tek gösterge yetmez?',
        'Kişi başına gelir bir ortalamadır ve dağılımı göstermez.\nEğitim ve sağlık göstergeleri olmadan yanıltıcıdır.',
      ),
      kart(
        'İnsani Gelişme Endeksi',
        'Birleşmiş Milletlerin ölçüsüdür; üç boyutu birlikte değerlendirir:\n- Doğumda yaşam beklentisi\n- Eğitim süresi\n- Kişi başına gelir',
      ),
      kart(
        'Kişi başına gelir',
        'Gayrisafi yurt içi hasıla / nüfus\nAynı gelir iki kat nüfusa bölününce kişi başına gelir yarıya iner.',
      ),
      kart(
        'Gelir dağılımı',
        'Gini katsayısı gelirin ne kadar eşit dağıldığını gösterir.\n0’a yaklaştıkça eşit, 1’e yaklaştıkça eşitsiz dağılım vardır.',
      ),
      kart(
        'Gelişmişlikte eğilimler',
        '- Kentsel nüfusun payı artar.\n- Doğum oranı ve bebek ölümleri düşer.\n- Eğitim süresi uzar.\n- Hizmet sektörünün payı büyür.',
      ),
    ], [
      soru('Gelişmiş ülkelerde hizmet sektörünün payı yüksektir.', true, 'İstihdamın büyük kısmı üçüncül sektörde.'),
      soru('Az gelişmiş ülkelerde tarımda çalışan nüfusun payı yüksektir.', true, 'Buna karşılık tarımın gelirdeki payı düşük kalıyor.'),
      soru('Bir ülkenin gelişmişliği yalnızca kişi başına düşen gelirle ölçülür.', false, 'Eğitim, sağlık ve yaşam süresi gibi göstergeler de hesaba katılıyor.'),
      soru('Tarımda çalışan nüfusun çok olması, tarım gelirinin de yüksek olduğunu gösterir.', false, 'Çoğu zaman tersini gösterir: çok kişi çalışıyor ama verim ve gelir düşük.'),
      sikli('Hangisi gelişmişlik göstergelerinden biridir?', ['Bebek ölüm hızı', 'Ülkenin yüz ölçümü'], 0, 'Kişi başına gelir, İGE ve okuryazarlık da.'),
      sikli('İnsani Gelişme Endeksi neyi ölçer?', ['Yalnızca nüfusu', 'Eğitim, sağlık ve geliri birlikte'], 1, 'Tek göstergenin gizlediğini birlikte okumak gösterir.'),
      soru('Türkiye\'de tarım, çalışanların payına göre millî gelire daha az katkı yapar.', true, 'Çalışanların ~%15\'i, millî gelirin ~%6\'sı: verim düşük.'),
      soru('İnsani Gelişme Endeksi yalnızca gelire bakar.', false, 'Yaşam beklentisi ve eğitimi de ölçer.'),
      soru('Gini katsayısı 1\'e yaklaştıkça gelir dağılımı eşitsizleşir.', true, '0 tam eşitlik.'),
      soru('Gelişmiş ülkelerde bebek ölüm hızı düşüktür.', true, 'Sağlık hizmetleri yaygın.'),
      sikli('Kişi başına gelir nasıl hesaplanır?', ['GSYH / nüfus', 'Nüfus / alan'], 0, 'Nüfus / alan yoğunluktur.'),
      sikli('Gelir dağılımının eşitliğini ölçen gösterge?', ['Doğurganlık hızı', 'Gini katsayısı'], 1, 'Doğurganlık nüfusla ilgilidir.'),
    ], [
      {
        soru: 'Birincil sektörün payı azaldıkça gelişmişlik?',
        siklar: ['Azalır', 'Artar'],
        dogru: 1,
        aciklama: {
          dogru: 'Gelişmiş ülkede tarımın payı yüzde birkaç, hizmet başı çeker.',
          yanlis: 'Tersi: nüfusun çoğu tarımda çalışıyorsa ülke az gelişmiştir. Tarımın payı düştükçe gelişmişlik yükselir.',
        },
        kart: 1,
      },
    ]),
    konu('cog10-turkiye-ekonomi', 'Türkiye Ekonomisinin Sektörel Dağılımı', [
      kart(
        'Genel görünüm',
        'Tarımın payı azaldı; sanayi ve özellikle hizmet sektörü büyüdü.\nYapı gelişmiş ülkelere yaklaşıyor.',
      ),
      kart(
        'Tarım',
        'İstihdamdaki payı hâlâ dikkat çekicidir ama millî gelirdeki payı düşüktür.\nTemel sorun verimliliktir.',
      ),
      kart(
        'Neden verim düşük?',
        '- Küçük ve parçalı araziler makineli tarımı zorlaştırıyor.\n- Sulama ve modern yöntemler her bölgede yaygın değil.',
      ),
      kart(
        'Sanayi',
        'Otomotiv, tekstil, beyaz eşya ve gıda öne çıkıyor.\nSanayi Marmara Bölgesi’nde yoğunlaşmış durumda.',
      ),
      kart(
        'Sanayi neden Marmara’da?',
        'Liman, pazar, iş gücü ve ulaşım ağı orada toplanmış durumda.\nSanayi kendini besleyen bir yığılma üretiyor.',
        undefined,
        { not: 'Marmara: İstanbul limanı + 25 milyon tüketici + iş gücü + Avrupa yolu. Sanayi kesiştikleri yere kurulur.' },
      ),
      kart(
        'Hizmetler',
        'Turizm, ticaret ve ulaştırma başı çekiyor.\nTurizm döviz girdisinde önemli bir kalem.',
      ),
      kart(
        'Bölgesel dengesizlik',
        '- **Batıda:** sanayi yoğun\n- **Doğuda:** tarım ve hayvancılık ağırlıkta\nTeşvik politikaları bu farkı azaltmayı hedefler.',
      ),
      kart(
        'Başlıca tarım ürünleri',
        '- **Buğday:** İç Anadolu\n- **Pamuk:** Çukurova, Harran\n- **Çay:** Rize\n- **Fındık:** Karadeniz kıyıları\n- **Zeytin:** Ege, Marmara',
      ),
      kart(
        'Madenler',
        '- **Bor:** dünya rezervinin büyük kısmı Türkiye’de (Eskişehir, Kütahya, Balıkesir)\n- **Taş kömürü:** Zonguldak\n- **Linyit:** Afşin-Elbistan, Soma\n- **Krom:** Elazığ, Muğla',
      ),
      kart(
        'Enerjide dışa bağımlılık',
        'Petrol ve doğal gazın büyük kısmı ithal edilir.\nYenilenebilir enerji (güneş, rüzgâr, jeotermal) bu bağımlılığı azaltmanın yoludur.',
      ),
      kart(
        'GAP',
        'Güneydoğu Anadolu Projesi Fırat ve Dicle üzerindeki barajlarla sulama ve enerji sağlar.\nAtatürk Barajı projenin en büyük yapısıdır; Harran Ovası sulamaya açıldı.',
      ),
    ], [
      soru('Türkiye de sanayi tesislerinin en çok yoğunlaştığı bölge Marmara dır.', true, 'Ulaşım, pazar ve iş gücü orada bir arada.'),
      soru('Türkiye de hizmet sektörünün millî gelirdeki payı en yüksektir.', true, 'Turizm ve ticaret bu payın büyük kısmını oluşturuyor.'),
      soru('Türkiye de tarımda çalışan nüfusun payı, tarımın millî gelirdeki payından düşüktür.', false, 'Tersi geçerli; bu da tarımda verimin düşük olduğunu gösteriyor.'),
      soru('Türkiye de ekonomik faaliyetler bölgeler arasında dengeli dağılmıştır.', false, 'Batı ile doğu arasında belirgin bir gelişmişlik farkı var.'),
      sikli('Türkiye\'de tarımın temel sorunu?', ['Verimlilik', 'Toprak yokluğu'], 0, 'Küçük parçalı arazi.'),
      sikli('Döviz girdisinde önemli hizmet kalemi?', ['Turizm', 'Madencilik'], 0, 'Hizmetler başı çekiyor.'),
      sikli('Türkiye\'de öne çıkan sanayi kollarından biri?', ['Kakao işleme', 'Otomotiv'], 1, 'Otomotiv, tekstil, beyaz eşya ve gıda öne çıkıyor.'),
      soru('Teşvik politikaları bölgesel dengesizliği azaltmayı hedefler.', true, 'Batı-doğu farkı.'),
      soru('Dünya bor rezervinin büyük kısmı Türkiye\'dedir.', true, 'Eskişehir, Kütahya, Balıkesir.'),
      soru('Taş kömürü en çok Afşin-Elbistan\'dan çıkarılır.', false, 'Taş kömürü Zonguldak\'ta; Afşin-Elbistan linyit.'),
      soru('Türkiye doğal gazın büyük kısmını ithal eder.', true, 'Enerjide dışa bağımlılık.'),
      sikli('GAP\'ın en büyük barajı?', ['Keban', 'Atatürk'], 1, 'Keban GAP dışında, daha kuzeyde.'),
      sikli('Çay tarımının merkezi?', ['Rize', 'Adana'], 0, 'Adana pamuk.'),
    ], [
      {
        soru: 'Türkiye\'de sanayinin Marmara\'da yoğunlaşmasının sebebi?',
        siklar: ['İklimi ılıman', 'Liman, pazar, iş gücü ve ulaşım bir arada'],
        dogru: 1,
        aciklama: {
          dogru: 'Sanayi kendini besleyen bir yığılma üretir; altyapı orada.',
          yanlis: 'İklim sanayiyi belirlemez. Marmara\'yı çeken şey liman, pazar, iş gücü ve ulaşım ağının bir arada olması.',
        },
        kart: 5,
      },
      {
        soru: 'Zonguldak\'tan çıkarılan başlıca maden?',
        siklar: ['Bor', 'Taş kömürü'],
        dogru: 1,
        aciklama: {
          dogru: 'Türkiye\'nin taş kömürü Zonguldak havzasındadır.',
          yanlis: 'Bor Eskişehir, Kütahya ve Balıkesir\'de. Zonguldak taş kömürü.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('cog10-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog10-iyi-uygulama', 'Afetlerle Mücadelede İyi Uygulama Örnekleri', [
      kart(
        'Japonya’nın deneyimi',
        '- Katı yapı denetimi\n- Erken uyarı sistemi\n- Düzenli tatbikat\nOkullarda afet eğitimi zorunludur.',
      ),
      kart(
        'Erken uyarı',
        'Deprem dalgasının hızlı ve yavaş bileşenleri arasında süre farkı vardır.\nBu fark saniyeler kazandırır; tren bile durdurulabilir.',
      ),
      kart(
        'Yapısal önlemler',
        'Sismik izolatör, güçlendirme ve zemin iyileştirme.\nYeni yapıda maliyeti düşük, sonradan yüksektir.',
      ),
      kart(
        'Hollanda ve su',
        'Ülkenin yaklaşık dörtte biri deniz seviyesinin altındadır.\nSetler, kapaklar ve suya yer bırakan planlama taşkını yönetiyor.',
      ),
      kart(
        'Toplum temelli hazırlık',
        'Mahalle ölçeğindeki gönüllü ekipler ilk saatlerde en etkili müdahaleyi yapar.',
      ),
      kart(
        'Türkiye’de',
        '- AFAD koordinasyonu\n- Zorunlu deprem sigortası\n- Kentsel dönüşüm',
      ),
      kart(
        'Ortak nokta',
        'Başarılı örneklerin hepsinde önlem afetten önce alınmış.\nÖnlem bir kurumun sürekli sorumluluğuna bağlanmış.',
        undefined,
        { not: 'Japonya\'da okullar deprem tatbikatını her ay yapar; hazırlık afet günü değil, sakin günlerin işi.' },
      ),
      kart(
        'Bangladeş’in kasırga sığınakları',
        'Kıyı boyunca yükseltilmiş sığınaklar ve erken uyarı gönüllüleri kuruldu.\nKasırgalarda can kaybı onlarca yıl içinde büyük ölçüde azaldı.',
      ),
      kart(
        '1999 sonrası Türkiye',
        'Marmara depremlerinden sonra:\n- Zorunlu deprem sigortası (2000)\n- Yapı denetimi sistemi\n- AFAD’ın kuruluşu (2009)',
      ),
      kart(
        'Şili’nin yapı yönetmeliği',
        'Dünyanın en güçlü depremlerinin yaşandığı Şili sıkı bir yapı yönetmeliği uygular.\nBüyük depremlerde bina çöküşleri görece sınırlı kaldı.',
      ),
      kart(
        'Okulda afet eğitimi',
        'Düzenli tatbikat ve afet dersi, bilgiyi çocuklar üzerinden ailelere de taşır.\nJaponya’da afet günü her yıl okullarda anılır.',
      ),
    ], [
      soru('Japonya da deprem eğitimleri ve tatbikatlar düzenli olarak yapılır.', true, 'Hazırlık, günlük hayatın parçası hâline getirilmiş durumda.'),
      soru('Erken uyarı sistemleri can kaybını azaltır.', true, 'Saniyeler bile korunma davranışı için yeterli olabiliyor.'),
      soru('Hollanda nın su yönetimi deneyimi yalnızca baraj yapımına dayanır.', false, 'Suya alan bırakan planlama ve arazi kullanımı da bu deneyimin parçası.'),
      soru('İyi uygulama örneklerinin ortak yanı, afet sonrasına odaklanmalarıdır.', false, 'Ortak yanları afet öncesine, yani hazırlığa yatırım yapmaları.'),
      sikli('Türkiye\'de afet koordinasyonunu yürüten kurum?', ['Yargıtay', 'AFAD'], 1, 'Zorunlu deprem sigortası ve kentsel dönüşüm de uygulamalardan.'),
      sikli('Hollanda\'nın yaklaşık ne kadarı deniz seviyesinin altındadır?', ['Dörtte biri', 'Tamamı'], 0, 'Setler ve suya yer bırakan planlamayla taşkın yönetiliyor.'),
      sikli('Sismik izolatör maliyeti ne zaman düşüktür?', ['Sonradan eklemede', 'Yeni yapıda'], 1, 'Yapısal önlem.'),
      soru('Mahalle ölçeğindeki gönüllü ekipler ilk saatlerde etkili müdahale yapar.', true, 'Toplum temelli hazırlık dışarıdan yardım gelene kadar hayat kurtarır.'),
      soru('Bangladeş sığınaklar ve erken uyarıyla kasırga kayıplarını azalttı.', true, 'Gönüllü ağıyla.'),
      soru('Zorunlu deprem sigortası 1999 depreminden önce başladı.', false, '2000\'de başladı.'),
      soru('Sıkı yapı yönetmeliği büyük depremlerde kayıpları azaltır.', true, 'Şili örneği.'),
      sikli('Marmara depreminden sonra kurulan afet başkanlığı?', ['DSİ', 'AFAD'], 1, 'DSİ su işleri kurumu.'),
      sikli('Okuldaki afet eğitiminin yaygın etkisi?', ['Ailelere de ulaşır', 'Yalnız öğrencide kalır'], 0, 'Çocuklar bilgiyi eve taşır.'),
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
      {
        soru: 'Türkiye\'de zorunlu deprem sigortası hangi yıl başladı?',
        siklar: ['1999', '2000'],
        dogru: 1,
        aciklama: {
          dogru: '1999 depremlerinin ardından 2000\'de başladı.',
          yanlis: '1999 depremlerin yılı; sigorta ertesi yıl, 2000\'de başladı.',
        },
        kart: 9,
      },
    ]),
    konu('cog10-dirençli-alan', 'Afetlere Karşı Dirençli Yaşam Alanları', [
      kart(
        'Dirençlilik nedir?',
        'Afeti önlemek değil, afetten sonra hızla toparlanabilme kapasitesidir.',
      ),
      kart(
        'Yer seçimi',
        'İlk koşul, şu alanlara yapı yapılmamasıdır:\n- Fay hattı\n- Taşkın ovası\n- Heyelan alanı ve gevşek zemin',
      ),
      kart(
        'Zemin önemli',
        'Gevşek ve suya doygun zemin deprem dalgasını büyütür.\nAynı bina sağlam kayada çok daha az zorlanır.',
        undefined,
        { not: '1985 Meksika depremi 350 km uzakta ama şehir eski göl dolgusu üstündeydi: zemin sarsıntıyı 5 kat büyüttü.' },
      ),
      kart(
        'Açık alanlar',
        'Park ve meydanlar iki iş görür:\n- Toplanma alanı\n- Yangın engeli',
      ),
      kart(
        'Altyapı yedekliliği',
        'Su, elektrik ve iletişimin alternatif hatları olmalıdır.\nTek hat koparsa şehir felç olur.',
      ),
      kart(
        'Ulaşılabilirlik',
        'Geniş ve birbirine bağlı yollar müdahale ekiplerinin ulaşmasını sağlar.',
      ),
      kart(
        'Dirençli şehrin ögeleri',
        'Beş öge birlikte çalışır.\nBiri eksikse ötekilerin sağladığı kazanç da düşer.',
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
      kart(
        'Mikrobölgeleme',
        'Şehir zemin özelliklerine göre küçük parçalara ayrılıp her birinin deprem davranışı incelenir.\nİmar kararları bu haritaya göre verilir.',
      ),
      kart(
        'Kritik yapılar',
        'Hastane, okul, itfaiye ve enerji tesisleri afetten sonra da çalışmalıdır.\nBu yüzden daha yüksek dayanım ölçütleriyle yapılır.',
      ),
      kart(
        'Yeşil altyapı',
        'Parklar, geçirimli zeminler ve yağmur bahçeleri yağmur suyunu emer.\nBeton yüzey arttıkça ani sel riski büyür.',
      ),
      kart(
        'Dere yataklarına saygı',
        'Dere yatağı kapatılıp üstüne yapı yapılırsa su taşkın anında eski yolunu arar.\nDirençli şehir dereye yer bırakır.',
      ),
    ], [
      soru('Zemin özellikleri, yapıların depremden etkilenme derecesini değiştirir.', true, 'Gevşek ve suya doygun zemin sarsıntıyı büyütüyor.'),
      soru('Şehirlerdeki açık alanlar afet sonrasında toplanma yeri olarak kullanılır.', true, 'Bu yüzden imara açılmamaları önemli.'),
      soru('Altyapıda yedeklilik gereksiz bir masraftır.', false, 'Bir hat koptuğunda ikinci hat devreye girdiği için şehir işlemeye devam ediyor.'),
      soru('Dirençli şehir, afette hiç zarar görmeyen şehirdir.', false, 'Zarar görse de işleyişini sürdürebilen ve hızla toparlanan şehir.'),
      sikli('Park ve meydanlar afette toplanma alanı dışında hangi işi görür?', ['Yangın engeli', 'Otopark'], 0, 'Açık alan yangının yayılmasını keser.'),
      sikli('Dirençli şehrin ögelerinden biri?', ['Tek hatlı altyapı', 'Hazırlıklı toplum'], 1, 'Altyapının yedekli olması gerekir.'),
      sikli('Hangisi yapı yapılmaması gereken bir alandır?', ['Sağlam kaya zemin', 'Taşkın ovası'], 1, 'Fay hattı ve heyelan alanı da.'),
      soru('Dar ve kopuk yollar müdahaleyi kolaylaştırır.', false, 'Geniş ve bağlı yollar gerekir.'),
      soru('Hastaneler daha yüksek dayanım ölçütleriyle yapılır.', true, 'Afetten sonra da çalışmalı.'),
      soru('Beton yüzey arttıkça ani sel riski azalır.', false, 'Su toprağa sızamaz, risk artar.'),
      soru('Mikrobölgeleme zemin davranışına göre imar kararı vermeyi sağlar.', true, 'Küçük parçalara ayrılır.'),
      sikli('Yağmur suyunu emen şehir ögesi?', ['Geçirimli zemin', 'Asfalt'], 0, 'Asfalt suyu geçirmez.'),
      sikli('Dere yatağına yapı yapılınca ne olur?', ['Taşkın riski azalır', 'Taşkın riski artar'], 1, 'Su eski yolunu arar.'),
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
      {
        soru: 'Şehri zemin özelliğine göre küçük parçalara ayırıp incelemek?',
        siklar: ['Kentsel yayılma', 'Mikrobölgeleme'],
        dogru: 1,
        aciklama: {
          dogru: 'Mikrobölgeleme her parçanın deprem davranışını ortaya koyar.',
          yanlis: 'Kentsel yayılma şehrin dışa taşmasıdır. Zemin incelemesi mikrobölgeleme.',
        },
        kart: 8,
      },
    ]),
    konu('cog10-korunma', 'Afetlerden Korunma', [
      kart(
        'Mekâna göre değişir',
        'Deprem bölgesindeki önlem ile sel havzasındaki önlem aynı olamaz.\nKorunma, yerin özelliğine göre planlanır.',
      ),
      kart(
        'Depremde',
        '- Sağlam yapı\n- Eşya sabitleme\n- Çök-kapan-tutun\n- Afet çantası',
      ),
      kart(
        'Selde',
        '- Dere yatağına yapı yapmamak\n- Drenaj ve erken uyarı\n- Yüksek yere tahliye',
      ),
      kart(
        'Yangında',
        '- Orman ile yerleşim arasında güvenlik şeridi\n- Erken müdahale\n- Yanıcı madde temizliği',
      ),
      kart(
        'Heyelanda',
        '- Yamaç eğimini bozmamak\n- Drenajla suyu uzaklaştırmak\n- Bitki örtüsünü korumak',
      ),
      kart(
        'Ortak nokta',
        'Korunmanın en etkili adımı **afetten önce** atılır.\nSonrasında yapılan her şey daha pahalı ve daha az etkilidir.',
        undefined,
        { not: 'Deprem: eşya sabitle. Sel: dere yatağına yapma. Heyelan: yamacı kesme. Hepsi \'olmadan önce\'.' },
      ),
      kart(
        'Çığda',
        '- Çığ uyarısı olan yamaçlara çıkmamak\n- Ağaçlandırma ve çığ setleri\n- Kış dağcılığında çığ vericisi taşımak',
      ),
      kart(
        'Fırtına ve kasırgada',
        '- Uyarıları izlemek\n- Balkon ve çatıdaki uçabilecek eşyaları sabitlemek\n- Pencerelerden uzak, sağlam bir iç odada beklemek',
      ),
      kart(
        'Kuraklıkta',
        '- Damla sulama, suyu az isteyen ürün\n- Yer altı suyunu aşırı çekmemek\n- Evde su tasarrufu',
      ),
      kart(
        'Aşırı sıcakta',
        '- Günün en sıcak saatlerinde dışarı çıkmamak\n- Bol su içmek\n- Yaşlıları ve çocukları korumak',
      ),
    ], [
      soru('Depremde "çök-kapan-tutun" davranışı önerilir.', true, 'Sağlam bir eşyanın yanına çökmek düşen cisimlerden koruyor.'),
      soru('Selde araçla su birikintisine girilmemelidir.', true, 'Az bir su bile aracı sürükleyebiliyor.'),
      soru('Yangında tahliye için asansör kullanılmalıdır.', false, 'Asansör elektrik kesilince kapanabilir; merdiven kullanılmalı.'),
      soru('Heyelan riski olan bir yamacın eteğine yapı yapılmasında sakınca yoktur.', false, 'Kayan malzemenin geleceği yer tam da orası.'),
      sikli('Sel sırasında nereye tahliye olunur?', ['Yüksek yere', 'Bodruma'], 0, 'Su en önce alçak yerleri doldurur.'),
      sikli('Orman-yerleşim arasında ne bırakılır?', ['Otopark', 'Güvenlik şeridi'], 1, 'Yangın önlemi.'),
      soru('Afetten sonra yapılan her şey öncekinden ucuzdur.', false, 'Daha pahalı ve az etkili.'),
      soru('Ağaçlandırma çığ riskini azaltır.', true, 'Kar örtüsünü tutar.'),
      soru('Fırtınada pencere kenarı en güvenli yerdir.', false, 'Pencereden uzak, iç odada beklenir.'),
      soru('Damla sulama kuraklıkta suyu verimli kullanmanın yoludur.', true, 'Su doğrudan köke verilir.'),
      sikli('Aşırı sıcakta ne yapılmalı?', ['Öğle saatinde dışarı çıkmak', 'Bol su içmek'], 1, 'Öğle saatlerinden kaçınılır.'),
      sikli('Kış dağcılığında taşınan koruyucu araç?', ['Çığ vericisi', 'Termos'], 0, 'Gömülen kişinin yerini bildirir.'),
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
        '- Riski bilmek\n- Önlemi bilmek\n- Afet anında ne yapacağını önceden kararlaştırmış olmak',
      ),
      kart(
        'Neden bilgi yetmiyor?',
        'Bilgi davranışa dönüşmezse işe yaramaz.\nTatbikat, bilgiyi refleks hâline getirir.',
      ),
      kart(
        'Aile afet planı',
        'Önceden konuşulmalı:\n- Buluşma noktası ve iletişim kişisi\n- Afet çantasının yeri\n- Vanaların kapatılması',
      ),
      kart(
        'Afet çantası',
        'Su, uzun ömürlü gıda, ilk yardım malzemesi, el feneri, düdük, pil, kimlik fotokopisi.\nKapıya yakın tutulur.',
      ),
      kart(
        'Afete dirençli toplum',
        'Program bunu hedef olarak koyuyor.\nYalnızca bilen değil, imar denetimini ve yapı kalitesini talep eden bir toplum.',
      ),
      kart(
        'Risk algısı sorunu',
        'Uzun süre afet yaşanmayan yerde tehlike unutulur.\nHazırlık en çok sakin dönemlerde gevşer.',
        undefined,
        { not: 'İstanbul\'u doğrudan vuran son büyük depremler 1766 ve 1894\'te: sessizlik \'olmaz\' hissi verir; fay enerji biriktirir.' },
      ),
      kart(
        'Doğru bilgi kaynakları',
        '- **AFAD:** afet yönetimi ve toplanma alanları\n- **Kandilli Rasathanesi:** deprem verisi\n- **Meteoroloji Genel Müdürlüğü:** hava uyarıları\nSöylentiye değil resmî kaynağa güvenilir.',
      ),
      kart(
        'Psikolojik ilk yardım',
        'Afetten sonra korku ve kaygı olağandır.\nDinlemek, güven vermek ve rutini yeniden kurmak toparlanmayı hızlandırır.',
      ),
      kart(
        'Gönüllülük',
        'Eğitimli gönüllüler ilk saatlerde arama, ilk yardım ve lojistikte büyük rol oynar.\nGönüllülük önceden eğitim almayı gerektirir.',
      ),
      kart(
        'Tatbikat',
        'Okulda ve evde düzenli tatbikat, afet anında düşünmeden doğru davranmayı sağlar.\nPanik, hazırlıksızlıktan doğar.',
      ),
    ], [
      soru('Afet bilinci, bilgiyi davranışa dönüştürmeyi gerektirir.', true, 'Ne yapılacağını bilmek, yapmakla tamamlanıyor.'),
      soru('Aile afet planında buluşma noktası belirlenir.', true, 'İletişim kesildiğinde nerede buluşulacağı önceden kararlaştırılıyor.'),
      soru('Afet çantası, afet olduktan sonra hazırlanır.', false, 'Önceden hazırlanır ve ulaşılabilir bir yerde tutulur.'),
      soru('İnsanlar afet riskini genellikle olduğundan büyük görür.', false, 'Risk algısı çoğu zaman düşük kalıyor; "bana olmaz" eğilimi yaygın.'),
      sikli('Afet çantasında hangisi olmalı?', ['Düdük ve el feneri', 'Televizyon'], 0, 'Su, gıda, ilk yardım, pil, kimlik fotokopisi.'),
      sikli('Uzun süre afet yaşanmayan yerde ne olur?', ['Tehlike unutulur', 'Risk sıfırlanır'], 0, 'Hazırlık gevşer.'),
      soru('Afete dirençli toplum imar denetimini ve yapı kalitesini talep eder.', true, 'Yalnızca bilen değil, isteyen bir toplum.'),
      soru('Deprem verisi için Kandilli Rasathanesi resmî bir kaynaktır.', true, 'Deprem kayıtlarını yayımlar.'),
      soru('Afetten sonra korku duymak olağan dışıdır.', false, 'Korku ve kaygı olağan tepkilerdir.'),
      soru('Düzenli tatbikat paniği azaltır.', true, 'Davranış refleks hâline gelir.'),
      sikli('Hava uyarıları için resmî kaynak?', ['Sosyal medya söylentisi', 'Meteoroloji Genel Müdürlüğü'], 1, 'Resmî kaynağa güvenilir.'),
      sikli('Afetten sonra toparlanmayı hızlandıran?', ['Rutini yeniden kurmak', 'Olayı hiç konuşmamak'], 0, 'Dinlemek ve güven vermek.'),
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
        'Geniş bir kuşakta yayılır:\nBalkanlardan Türkistan’a, Sibirya’dan Anadolu’ya',
      ),
      kart(
        'Türkistan neresi?',
        'Türk topluluklarının tarihsel yurdu olan geniş İç Asya bölgesidir.\nProgram bu adı kullanır; "Orta Asya" onun bir bölümüdür.',
      ),
      kart(
        'Ortak unsurlar',
        '- Dil ailesi\n- Sözlü gelenek ve destanlar\n- Mutfak ve müzik\n- Halı-kilim dokumacılığı',
      ),
      kart(
        'Konargöçer mirası',
        'Taşınabilir sanat, at kültürü ve otağ geleneği.\nBu miras yerleşik hayata geçildikten sonra da sürdü.',
      ),
      kart(
        'Coğrafyanın etkisi',
        'Bozkır kuşağı benzer yaşam biçimleri üretti.\nOrtak kültürün coğrafi bir zemini var.',
      ),
      kart(
        'Kültür bölgesi',
        'Sınırları devlet sınırlarıyla çakışmaz; ortak dil ve gelenekle tanımlanır.\nGeçiş kuşakları keskin değildir.',
        undefined,
        { not: 'Türk kültür bölgesi Balkanlar\'dan Sibirya\'ya 7 devlet + özerk bölgeler; sınırı dil ve gelenek çizer.' },
      ),
      kart(
        'Bugünkü bağlar',
        'Türk Devletleri Teşkilatı gibi yapılar kültürel yakınlığı iş birliğine çeviriyor.\nBu iş birliği ekonomik ve siyasidir.',
      ),
      kart(
        'Yeşil Vatan',
        'Ormanların vatanın bir parçası sayıldığı yaklaşımdır.\nAğaçlandırma ve yangınla mücadele bu kavramla anılıyor.',
      ),
      kart(
        'Türk dilinin kolları',
        'Türkiye Türkçesi, Azerbaycan Türkçesi, Özbekçe, Kazakça, Kırgızca, Türkmence ve Uygurca başlıcalarıdır.\nHepsi aynı dil ailesinin kollarıdır.',
      ),
      kart(
        'Nevruz',
        'Baharın gelişini kutlayan ortak bayramdır.\nTürk dünyasının geniş bir bölümünde ateş üstünden atlama gibi benzer geleneklerle kutlanır.',
      ),
      kart(
        'Ortak mimari izler',
        'Kümbet, kervansaray ve medrese Türkistan’dan Anadolu’ya uzanan bir hat boyunca görülür.\nBiçimler taşındıkları yerin malzemesine göre değişti.',
      ),
      kart(
        'UNESCO’da ortak miras',
        'Dede Korkut mirası Azerbaycan, Kazakistan ve Türkiye’nin ortak başvurusuyla UNESCO listesine girdi.\nOrtak kültür, uluslararası tanınırlık kazanıyor.',
      ),
    ], [
      soru('Türkistan, Türk kültürünün doğduğu ve yayıldığı ana alandır.', true, 'Buradan batıya uzanan göçlerle kültür geniş bir alana yayıldı.'),
      soru('Konargöçer yaşamın izleri halı, kilim ve mutfak kültüründe sürmektedir.', true, 'Taşınabilir ve dayanıklı ürünler bu yaşamın mirası.'),
      soru('Yeşil Vatan kavramı denizlerimizi anlatır.', false, 'Yeşil Vatan ormanlarımızı anlatıyor; denizler için kullanılan kavram Mavi Vatan.'),
      soru('Kültür bölgeleri siyasi sınırlarla birebir örtüşür.', false, 'Kültürel özellikler sınırları aşarak yayılıyor.'),
      sikli('Türk kültürünün yayılış alanı hangisidir?', ['Balkanlardan Türkistan\'a geniş bir kuşak', 'Yalnızca Anadolu'], 0, 'Sibirya\'dan Anadolu\'ya da uzanır.'),
      sikli('Ortak kültürün coğrafi zemini nedir?', ['Kıyı ovaları', 'Bozkır kuşağı'], 1, 'Bozkır benzer yaşam biçimleri üretti.'),
      sikli('Kültürel yakınlığı iş birliğine çeviren yapı?', ['Türk Devletleri Teşkilatı', 'Yeşil Vatan'], 0, 'Ekonomik ve siyasi.'),
      sikli('Hangisi Türk kültürünün ortak unsurlarındandır?', ['Buz hokeyi', 'Halı-kilim dokumacılığı'], 1, 'Dil, sözlü gelenek, mutfak ve müzik de.'),
      soru('Otağ geleneği yerleşik hayata geçince tümüyle unutuldu.', false, 'Konargöçer mirası sürdü.'),
      soru('Nevruz Türk dünyasında ortak kutlanan bir bayramdır.', true, 'Baharın gelişi.'),
      soru('Kazakça Türk dil ailesinin dışındadır.', false, 'Türk dil ailesinin bir koludur.'),
      soru('Dede Korkut mirası UNESCO listesine ortak başvuruyla girdi.', true, 'Azerbaycan, Kazakistan, Türkiye.'),
      sikli('Türkistan\'dan Anadolu\'ya uzanan ortak yapı türü?', ['Kümbet', 'Gotik katedral'], 0, 'Gotik Avrupa üslubudur.'),
      sikli('Hangisi Türk dilinin bir koludur?', ['Farsça', 'Özbekçe'], 1, 'Farsça Hint-Avrupa dilidir.'),
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
      {
        soru: 'Baharın gelişini kutlayan ortak bayram?',
        siklar: ['Nevruz', 'Yılbaşı'],
        dogru: 0,
        aciklama: {
          dogru: 'Nevruz baharın gelişini kutlar; Türk dünyasında ortaktır.',
          yanlis: 'Yılbaşı bahar bayramı değildir. Türk dünyasının ortak bahar bayramı Nevruz.',
        },
        kart: 10,
      },
    ]),
  ]),
])
