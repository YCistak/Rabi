import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 10. sınıf Kimya — Maarif Modeli.
 *
 * Konu adları ve sırası programın İçerik Çerçevesi'nden
 * (`maarif/iskelet.json`); `maarif.test.ts` denetliyor.
 *
 * **Mol burada.** Eski programda 9. sınıfta olan mol kavramı ve
 * stokiyometri Maarif'te 10. sınıfın ilk temasına taşındı; 9. sınıf
 * dosyasında bu yüzden yok.
 */
export const kimya10 = program('kimya', 10, 'Tepkimelerden çözeltilere', [
  tema('kim10-t1', 'Etkileşim', [
    konu('kim10-gosterge', 'Kimyasal Değişimin Göstergeleri', [
      kart(
        'Kimyasal değişimde yeni madde oluşur',
        'Kâğıdı yırt: hâlâ kâğıt. Kâğıdı yak: kül ve duman çıktı, kâğıt gitti. İlki fiziksel değişim, yani madde aynı kalır, yalnızca şekli ya da hâli değişir. İkincisi kimyasal değişim, yani ortaya yeni bir madde çıkar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Beş belirti kimyasal değişimi haber verir',
        'Demir paslanınca rengi değişir. Kabartma tozu sirkeyle köpürünce gaz çıkar. Süt bozulunca kokar. Odun yanınca ısı ve ışık verir. Bu belirtilere gösterge denir, yani değişimi haber veren ipucu.',
        {
          tur: 'tablo',
          basliklar: ['Gösterge', 'Örnek'],
          satirlar: [
            ['Renk değişimi', 'Paslanma'],
            ['Gaz çıkışı', 'Kabartma tozu'],
            ['Çökelek', 'Kireçlenme'],
            ['Isı / ışık', 'Yanma'],
            ['Koku', 'Bozulan süt'],
          ],
        },
      ),
      kart(
        'Çökelek, sıvının içinde oluşan katıdır',
        'İki berrak sıvıyı karıştırdın, dipte beyaz bir katı belirdi. Bu katıya çökelek denir, yani çözeltide oluşup dibe inen katı. Çaydanlıktaki kireç de böyle oluşur. Çökelek gördüğünde kimyasal değişim düşün.',
      ),
      kart(
        'Tek gösterge kesin kanıt değildir',
        'Kaynayan suda kabarcık çıkar ama bu su buharı; yeni madde yok. Boyaları karıştırınca renk değişir ama bu da fiziksel. Gösterge yalnızca ipucu. "Kabarcık gördüm, kimyasal değişim var" deme.',
        undefined,
        { etiket: 'Sık hata', not: 'Kabarcık ya da renk değişimi gördüğünde dur ve sor: ortaya yeni bir madde çıktı mı? Cevap oradan gelir.' },
      ),
      kart(
        'Kesin ölçüt: yeni özellikli madde çıktı mı',
        'Yanan kâğıttan çıkan kül ne yanar ne yazı tutar; özellikleri kâğıttan bambaşka. Kesin ölçüt bu: yeni özellikleri olan bir madde çıktıysa değişim kimyasal. Çıkmadıysa fiziksel.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Kimyasal değişim kolay geri alınmaz',
        'Eriyen buzu dondurucuya koy, yine buz olur. Yanan kâğıdı geri getiremezsin. Fiziksel değişim kolayca geri alınır; kimyasal değişimi geri almak yeni bir tepkime ister.',
      ),
      kart(
        'Tuzun suda çözünmesi fizikseldir',
        'Tuzu suda çözdün, tuz kaybolmuş gibi. Suyu buharlaştır: tuz olduğu gibi geri gelir, tadı aynı. Yeni madde oluşmadı; çözünme fiziksel değişim. Sınavda çözünmeyi kimyasal sanma.',
      ),
    ], [
      soru('Kimyasal değişimin kesin ölçütü yeni bir maddenin oluşmasıdır.', true, 'Gözle görülen belirtiler ipucu; kesin ölçüt bu.'),
      soru('Renk değişimi her zaman kimyasal değişimin göstergesidir.', false, 'Boya karıştırmak gibi fiziksel olaylarda da renk değişebiliyor.'),
      soru('Şekerin suda çözünmesi kimyasal bir değişimdir.', false, 'Şeker şeker olarak kalıyor; bu fiziksel bir değişim.'),
      soru('Gaz çıkışı ve çökelek oluşumu kimyasal değişim belirtilerindendir.', true, 'İkisi de yeni bir maddenin oluştuğuna işaret ediyor.'),
      sikli('Kimyasal değişimin kesin ölçütü nedir?', ['Yeni özellikli madde oluşması', 'Renk değişmesi'], 0, 'Tek gösterge kanıt sayılmaz.'),
      sikli('Yanmış kâğıt neden geri gelmez?', ['Kimyasal değişim geri alınamaz', 'Kâğıt buharlaştı'], 0, 'Geri almak yeni bir tepkime ister.'),
      soru('Tuzun suda çözünmesi kimyasal değişimdir.', false, 'Su buharlaştırılınca tuz geri alınır.'),
      soru('Çökelek, çözeltinin içinde oluşup dibe inen katıdır.', true, 'Çaydanlıktaki kireç buna örnek.'),
    ], [
      {
        soru: 'Kaynayan suda kabarcık çıkması kimyasal değişim midir?',
        siklar: ['Hayır, hâl değişimi', 'Evet, gaz çıkışı var'],
        dogru: 0,
        aciklama: {
          dogru: 'Kabarcık su buharı; yeni madde yok. Gaz çıkışı tek başına kanıt değil.',
          yanlis: 'Kabarcıklar su buharıdır, yeni madde oluşmadı. Gösterge tek başına kanıt sayılmaz; kesin ölçüt yeni maddedir.',
        },
        kart: 4,
      },
    ]),
    konu('kim10-olusum', 'Kimyasal Tepkimelerin Oluşumu', [
      kart(
        'Tepkimede atomlar yer değiştirir, yok olmaz',
        'Hidrojen oksijenle yanınca su oluşur: H₂ + O₂ → H₂O. Hidrojen atomları kaybolmadı, oksijene bağlandı. Kimyasal tepkime, yani atomlar arasındaki bağların kopup yeniden kurulması. Atom yok olmaz, yalnızca eşi değişir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Kütle korunur: giren kadar çıkar',
        '4 g hidrojen 32 g oksijenle yanınca 36 g su oluşur; 4 + 32 = 36. Atomlar kaybolmadığı için toplam kütle de değişmez. Buna kütlenin korunumu denir. İki tarafta her atomdan aynı sayıda var.',
      ),
      kart(
        'Bağ kırmak enerji ister, bağ kurmak verir',
        'Bir ipi koparmak için güç harcarsın; düğüm ise kendiliğinden tutar. Bağlar da böyle: kırmak enerji ister, kurmak enerji verir. Tepkimenin ısı alıp vermesi bu ikisinin farkına bağlı.',
      ),
      kart(
        'Ekzotermik tepkime ortamı ısıtır',
        'Odun yanınca elini ısıtır: tepkime dışarı ısı veriyor. Buna ekzotermik denir, yani ısı veren tepkime. Kurulan bağların verdiği enerji, kırılan bağların istediğinden fazla; fazlası ısı olarak çıkar.',
      ),
      kart(
        'Endotermik tepkime ortamı soğutur',
        'Soğuk kompres paketini kır ve sık: soğur, çünkü içindeki tepkime çevreden ısı alıyor. Buna endotermik denir, yani ısı alan tepkime. Ortam soğuyorsa endotermik, ısınıyorsa ekzotermik.',
      ),
      kart(
        'Tepkime için tanecikler çarpışmalı',
        'İki bilye birbirine değmeden çarpışamaz. Tanecikler de tepkimeye girmek için çarpışmalı. Ama her çarpışma yetmez: yeterli hızla ve uygun yönden çarpmalı. Isıtınca tanecikler hızlanır, tepkime hızlanır.',
      ),
      kart(
        'Aktivasyon enerjisi başlangıç eşiğidir',
        'Kibrit kutuda kendiliğinden yanmaz; sürtmen gerekir. O sürtme tepkimeyi başlatan enerji. Aktivasyon enerjisi, yani tepkimenin başlaması için aşılması gereken eşik. Grafikte tepe noktası bu eşik.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'tepkime yolu',
          yAd: 'enerji',
          egriler: [
            {
              noktalar: [
                [0.5, 3],
                [2, 3.4],
                [4, 5.2],
                [6, 1.6],
                [7.5, 1.4],
              ],
            },
          ],
          etiketler: [
            { x: 4, y: 5.8, ad: 'aktivasyon', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Dört etken tepkimeyi hızlandırır',
        'Toz şeker küp şekerden hızlı yanar: temas yüzeyi büyük. Sıcak madde, derişik yani içinde çok tanecik olan madde ve ufalanmış madde daha hızlı tepkir. Dördüncü etken katalizör. Hepsi etkin çarpışmayı artırır.',
      ),
      kart(
        'Katalizör eşiği düşürür, kendisi tükenmez',
        'Patates parçası oksijenli suyu anında köpürtür; patates tepkimeden olduğu gibi çıkar. Katalizör, yani aktivasyon enerjisini düşürüp tepkimeyi hızlandıran madde. Ürün miktarını ve tepkime ısısını değiştirmez.',
        undefined,
        { not: 'Katalizör sorusunda "ne yapmaz" sorulur: ürünü artırmaz, tepkime ısısını değiştirmez, tükenmez.' },
      ),
    ], [
      soru(
        'Şemadaki tepkime endotermiktir.',
        false,
        'Ürünlerin enerjisi girenlerden düşük; tepkime ısı veriyor, yani ekzotermik.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 8],
          xAd: 'tepkime yolu',
          yAd: 'enerji',
          egriler: [
            {
              noktalar: [
                [0.3, 4],
                [1, 4],
                [2, 7],
                [3, 1.5],
                [4.5, 1.5],
              ],
            },
          ],
        },
      ),
      soru('Kimyasal tepkimelerde toplam kütle korunur.', true, 'Atomlar yok olmuyor, yalnızca yeniden diziliyor.'),
      soru('Tepkimenin gerçekleşmesi için taneciklerin uygun yönde ve yeterli enerjiyle çarpışması gerekir.', true, 'Her çarpışma tepkimeye yol açmıyor.'),
      soru('Katalizör aktivasyon enerjisini artırarak tepkimeyi hızlandırır.', false, 'Aktivasyon enerjisini düşürerek hızlandırır.'),
      sikli('Bağ kırmak enerji ister mi, verir mi?', ['İster', 'Verir'], 0, 'Bağ kurmak enerji verir.'),
      sikli('Katalizör neyi değiştirmez?', ['Ürün miktarını', 'Tepkime hızını'], 0, 'Aktivasyon enerjisini düşürür, tükenmez.'),
      sikli('Isıtmak tepkimeyi neden hızlandırır?', ['Etkin çarpışma sayısı artar', 'Bağlar zayıflar'], 0, 'Tanecikler yeterli enerjiyle çarpışır.'),
      soru('Tepkimede atomlar yok olup yeniden yaratılır.', false, 'Bağlar kopar, atomlar yeniden düzenlenir.'),
      soru('Temas yüzeyi arttıkça tepkime hızlanır.', true, 'Toz şeker küp şekerden hızlı yanar.'),
      sikli('Kibriti sürtmek tepkimeye hangi enerjiyi sağlar?', ['Bağ enerjisi', 'Aktivasyon enerjisi'], 1, 'Başlangıç eşiğini aşmak için gereken enerji.'),
    ], [
      {
        soru: 'Tepkime sırasında ortam soğuyorsa tepkime nasıldır?',
        siklar: ['Ekzotermik', 'Endotermik'],
        dogru: 1,
        aciklama: {
          dogru: 'Tepkime ortamdan ısı alıyor; ortam bu yüzden soğuyor.',
          yanlis: 'Ekzotermik tepkime ısı verir ve ortamı ısıtır. Soğuyan ortam tepkimenin ısı aldığını, endotermik olduğunu gösterir.',
        },
        kart: 5,
      },
    ]),
    konu('kim10-tur', 'Kimyasal Tepkime Türleri', [
      kart(
        'Yanma: madde oksijenle birleşir',
        'Mumu yak: mum oksijenle birleşir, ısı ve ışık çıkar. Yanma tepkimesi, yani maddenin oksijenle hızla birleşmesi. Mum, odun, doğal gaz gibi karbonlu maddeler yanınca karbondioksit ve su oluşur.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yanma denklemi: yakıt + O₂ → CO₂ + H₂O',
        'Doğal gaz metandır: CH₄ + 2O₂ → CO₂ + 2H₂O. Solda oksijen giriyor, sağda karbondioksit ve su çıkıyor. Bu kalıbı gördüğünde yanma de. Hidrokarbon, yani yalnız karbon ve hidrojenden yapılmış madde, hep böyle yanar.',
      ),
      kart(
        'Oksijen azsa eksik yanma olur',
        'Soba bacası tıkalıysa oksijen az gelir. Karbon CO₂ yerine karbonmonoksit (CO) ve is verir. CO kokusuz ve zehirlidir; soba zehirlenmesi bundan. Oksijen bolsa tam yanma, azsa eksik yanma.',
        undefined,
        { etiket: 'Dikkat' },
      ),
      kart(
        'Asit + baz → tuz + su: nötrleşme',
        'Miden fazla asit yaptı, mide ilacı aldın. İlaç bir baz; asitle birleşip tuz ve su verdi, yanma geçti. Buna nötrleşme denir: HCl + NaOH → NaCl + H₂O. Asit ile bazın etkisi birbirini siler.',
      ),
      kart(
        'Çökelme: iki sıvıdan katı çıkar',
        'İki berrak çözeltiyi karıştırdın, dipte beyaz katı oluştu. Bu katı çökelek, yani suda çözünmeyen ürün. Denklemde (k) ile gösterilir. İki çözelti karışıp katı veriyorsa çökelme tepkimesidir.',
      ),
      kart(
        'Redoks: elektron el değiştirir',
        'Demir paslanırken oksijene elektron verir. Elektron veren yükseltgenir, alan indirgenir. Redoks tepkimesi, yani elektron alışverişi olan tepkime. Pil de böyle çalışır: bir madde verir, öteki alır.',
      ),
      kart(
        'Sentez birleştirir, analiz parçalar',
        'Hidrojen ve oksijen birleşip su verir: 2H₂ + O₂ → 2H₂O, bu sentez. Suya elektrik ver, hidrojen ve oksijene ayrılır: bu analiz. Sentezde birden çok madde tek ürün olur; analizde tek madde parçalanır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Kalıp', 'Örnek'],
          satirlar: [
            ['Sentez', 'A + B → AB', '2H₂ + O₂ → 2H₂O'],
            ['Analiz', 'AB → A + B', '2H₂O → 2H₂ + O₂'],
            ['Yer değiştirme', 'A + BC → AC + B', 'Zn + CuSO₄ → ZnSO₄ + Cu'],
          ],
        },
      ),
      kart(
        'Yer değiştirme: aktif olan yerini alır',
        'Çinko parçasını bakır sülfat çözeltisine at: çinko çözünür, bakır ayrılır. Zn + CuSO₄ → ZnSO₄ + Cu. Çinko bakırdan aktif, yani daha kolay tepkimeye girer; bakırın yerini alır. Aktif olan, az aktif olanı kovar.',
      ),
      kart(
        'Denklemde önce giren ve çıkana bak',
        'Türü tanımak için ezber değil bakış gerek. O₂ giriyor, CO₂ çıkıyor: yanma. Asit + baz → tuz + su: nötrleşme. Ürünlerde (k) var: çökelme. Bir element bileşiğe girip başkasını çıkarıyor: yer değiştirme.',
        undefined,
        { not: 'Tür sorusunda adı değil kalıbı ara: önce girenlere, sonra çıkanlara bak; tür adı ondan sonra gelir.' },
      ),
    ], [
      soru('Yanma tepkimeleri ekzotermiktir.', true, 'Isı ve ışık açığa çıkıyor.'),
      soru('Eksik yanmada karbon monoksit ve is oluşabilir.', true, 'Oksijen yetersizse yanma tamamlanmıyor.'),
      soru('Nötrleşme tepkimesinde her zaman gaz açığa çıkar.', false, 'Asit ile bazın tepkimesinden tuz ve su oluşur; gaz her durumda çıkmaz.'),
      soru('Redoks tepkimelerinde elektron alışverişi olmaz.', false, 'Tanımı tam da elektron alışverişine dayanıyor.'),
      sikli('Eksik yanmada oluşan zehirli gaz?', ['Karbonmonoksit', 'Karbondioksit'], 0, 'Soba zehirlenmelerinin sebebi.'),
      sikli('İki çözelti karışınca oluşan çözünmeyen katıya ne denir?', ['Çökelek', 'Katalizör'], 0, 'Çökelme tepkimesi.'),
      sikli('Elektron veren madde ne olur?', ['Yükseltgenir', 'İndirgenir'], 0, 'Alan indirgenir.'),
      sikli('CH₄ + 2O₂ → CO₂ + 2H₂O hangi türdür?', ['Yanma', 'Nötrleşme'], 0, 'Hidrokarbon + O₂.'),
      sikli('Tek maddenin parçalanmasına ne denir?', ['Sentez', 'Analiz'], 1, 'Sentezde birden çok madde birleşir.'),
      soru('Paslanma bir redoks tepkimesidir.', true, 'Demir elektron verir.'),
    ], [
      {
        soru: 'HCl + NaOH → NaCl + H₂O tepkimesi hangi türdendir?',
        siklar: ['Asit-baz (nötrleşme)', 'Yanma'],
        dogru: 0,
        aciklama: {
          dogru: 'Asit ile baz birleşip tuz ve su verdi; nötrleşmenin tanımı bu.',
          yanlis: 'Yanmada oksijen girer, ısı ve ışık çıkar. Asit ile bazın tuz ve su vermesi nötrleşme tepkimesidir.',
        },
        kart: 4,
      },
    ]),
    konu('kim10-mol', 'Mol Kavramı', [
      kart(
        'Mol, düzine gibi bir sayma birimidir',
        '1 düzine yumurta 12 tane. 1 mol tanecik 6,02×10²³ tane; bu sayıya Avogadro sayısı denir. Mol, yani tanecik saymanın birimi. Farkı yalnızca büyüklüğü: atomlar o kadar küçük ki ancak böyle bir sayıyla sayılır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Mol, gram ile tanecik arasında köprüdür',
        'Teraziye tek bir atom koyamazsın; ama 18 g su koyabilirsin ve bu 1 mol, yani 6,02×10²³ molekül. Mol, tarttığın gramı tanecik sayısına çevirir. Kimyacı bu yüzden gram yerine mol ile konuşur.',
      ),
      kart(
        'Molar kütle, 1 molün gram cinsinden kütlesi',
        'Bir su molekülünün kütlesi 18 akb; 1 mol suyun kütlesi 18 gram. Molar kütle, yani 1 mol maddenin gram cinsinden kütlesi. Birimi g/mol. Sayı olarak atom ya da molekül kütlesiyle aynı.',
      ),
      kart(
        'Molar kütle: atom kütlelerini topla',
        'CO₂: 1 karbon (12) + 2 oksijen (2·16) = 44 g/mol. H₂SO₄: 2·1 + 32 + 4·16 = 98 g/mol. Her atomun kütlesini alt indisiyle çarp, hepsini topla. Alt indis, yani formülde elementin sağ altındaki küçük sayı.',
      ),
      kart(
        'Kütleden mole: molar kütleye böl',
        '36 g su kaç mol? Suyun molar kütlesi 18; 36 / 18 = 2 mol. Kural: mol = kütle / molar kütle. Ters yönde de çalışır: 3 mol su = 3 · 18 = 54 g.',
      ),
      kart(
        '1 mol gaz normal şartlarda 22,4 litredir',
        '0 °C ve 1 atm basınca normal şartlar denir, kısaca NŞA. Bu koşulda 1 mol oksijen de 1 mol helyum da 22,4 L yer kaplar; gazın cinsi fark etmez. 11,2 L O₂ (NŞA) = 0,5 mol.',
      ),
      kart(
        'Molden taneciğe: Avogadro sayısıyla çarp',
        '2 mol su kaç molekül? 2 × 6,02×10²³ = 12,04×10²³ molekül. Ters yön: 3,01×10²³ molekül kaç mol? 3,01 / 6,02 = 0,5 mol. Tanecik sayısı = mol × Avogadro sayısı.',
      ),
      kart(
        'Her çevrim moldan geçer',
        '22 g CO₂ kaç molekül? Gramdan taneciğe doğrudan yol yok. Önce mol: 22 / 44 = 0,5 mol. Sonra tanecik: 0,5 × 6,02×10²³ = 3,01×10²³. Kütle, hacim ve tanecik arasında yol hep moldan geçer.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Kütle (g)' },
            { ad: 'Mol', renk: 'ikincil' },
            { ad: 'Tanecik' },
          ],
        },
        { not: 'Gramdan taneciğe doğrudan atlamaya kalkarsan dur: önce mole çevir, sonra Avogadro sayısıyla çarp.' },
      ),
      kart(
        'Alt indisler mol oranını da verir',
        '1 su molekülünde 2 H ve 1 O atomu var. 1 mol suda da 2 mol H atomu ve 1 mol O atomu var. 3 mol CO₂\'de 3 · 2 = 6 mol O atomu. Alt indis, molekül başına da mol başına da aynı oranı söyler.',
      ),
      kart(
        'Gazın yoğunluğu molar kütleyi verir',
        'NŞA\'da bir gazın 1 litresi 1,25 g geldi. 1 mol 22,4 L olduğuna göre: 1,25 × 22,4 = 28 g/mol. Bu azot gazı (N₂). Kural: molar kütle = yoğunluk (g/L) × 22,4.',
      ),
      kart(
        'Eşit mol, eşit hacim ama farklı kütle',
        '1 mol He 4 g, 1 mol O₂ 32 g. İkisi de NŞA\'da 22,4 L. Hacim molden gelir, cinse bakmaz; kütle cinse bağlı. "Hacimleri eşitse kütleleri de eşittir" deme.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('1 mol madde 6,02 · 10²³ tanecik içerir.', true, 'Bu sayıya Avogadro sayısı deniyor.'),
      soru('Normal koşullarda 1 mol gaz 22,4 litre hacim kaplar.', true, 'Gazın cinsi değişse de bu hacim aynı.'),
      soru('Mol bir kütle birimidir.', false, 'Mol bir sayı birimi: belirli sayıda tanecik demek.'),
      soru('Farklı iki maddenin birer molünün kütleleri eşittir.', false, 'Tanecik sayıları eşit ama tanecik kütleleri farklı.'),
      sikli('Avogadro sayısı yaklaşık kaçtır?', ['6,02×10²³', '6,02×10²²'], 0, '1 mol tanecik sayısı.'),
      sikli('CO₂\'nin molar kütlesi? (C:12, O:16)', ['44 g/mol', '28 g/mol'], 0, '12 + 2·16.'),
      sikli('36 g su kaç moldür?', ['2', '36'], 0, 'Molar kütle 18.'),
      sikli('11,2 L O₂ (NŞA) kaç gramdır?', ['16', '32'], 0, '0,5 mol × 32.'),
      sikli('3 mol CO₂\'de kaç mol O atomu vardır?', ['3', '6'], 1, 'Her molde 2 mol O.'),
      sikli('Yoğunluğu 1,25 g/L olan gazın molar kütlesi (NŞA)?', ['22,4', '28'], 1, '1,25 × 22,4.'),
      sikli('1 mol He ile 1 mol O₂ için ne söylenir?', ['Kütleleri eşit', 'Hacimleri eşit, kütleleri farklı'], 1, 'Mol sayısı eşit, kütle 4 ve 32 g.'),
      soru('1 mol demir ile 1 mol su aynı sayıda tanecik içerir.', true, 'Mol bir sayıdır.'),
    ], [
      {
        soru: 'Normal şartlarda 1 mol ideal gaz kaç litre yer kaplar?',
        siklar: ['22,4 L', '18 L'],
        dogru: 0,
        aciklama: {
          dogru: '0 °C ve 1 atm\'de her ideal gazın 1 molü 22,4 L; gazın cinsi fark etmez.',
          yanlis: '18, suyun molar kütlesi (g/mol). Gazların molar hacmi normal şartlarda 22,4 litre.',
        },
        kart: 6,
      },
      {
        soru: '1 mol H₂SO₄ içinde kaç mol O atomu vardır?',
        siklar: ['4', '1'],
        dogru: 0,
        aciklama: {
          dogru: 'Alt indis mol oranını verir: her molekülde 4 O, her molde 4 mol O.',
          yanlis: '1 mol molekül var ama her molekülde 4 oksijen atomu; alt indis mol oranını verir: 4 mol O.',
        },
        kart: 9,
      },
    ]),
    konu('kim10-denklestirme', 'Kimyasal Tepkime Denklemlerinin Denkleştirilmesi', [
      kart(
        'Denkleştirme atom sayısını eşitler',
        'H₂ + O₂ → H₂O yaz: solda 2 O var, sağda 1. Bir oksijen atomu kayboldu; olamaz, atom yok olmaz. Denkleştirme, yani iki tarafta her elementin atom sayısını eşitleme. Doğrusu: 2H₂ + O₂ → 2H₂O.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Katsayıyı değiştir, alt indise dokunma',
        'H₂O\'daki 2 alt indis; su molekülünün kimliği. Onu H₂O₂ yaparsan su değil oksijenli su yazmış olursun. Katsayı, yani formülün önündeki sayı, kaç molekül olduğunu söyler. Yalnızca katsayı değişir.',
        undefined,
        { etiket: 'Sık hata', not: 'Denkleşmiyor diye alt indise el atarsan dur; o sayı maddenin kimliği, değiştirince başka madde olur.' },
      ),
      kart(
        'Sıra: önce tek yerde geçen element',
        'Fe + O₂ → Fe₂O₃\'te demir yalnız bir bileşikte geçiyor; onunla başla. Hidrojen ve oksijen çoğu denklemde birkaç yerde geçer; onları sona bırak. Sona kalan element en esnek olandır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tek bileşikte geçenler' },
            { ad: 'Metaller ve ametaller' },
            { ad: 'Hidrojen' },
            { ad: 'Oksijen' },
            { ad: 'Katsayıları sadeleştir', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Kesirli katsayı ara adımdır',
        'Fe + O₂ → Fe₂O₃. Demir için 2Fe. Sağda 3 O var; soldan 3 O için 3/2 O₂ gerekir. Kesir ara adımda serbest; sonunda hepsini 2 ile çarp: 4Fe + 3O₂ → 2Fe₂O₃. Son hâlde kesir kalmaz.',
      ),
      kart(
        'Bitince her atomu tek tek say',
        '4Fe + 3O₂ → 2Fe₂O₃. Fe: solda 4, sağda 2 · 2 = 4. O: solda 3 · 2 = 6, sağda 2 · 3 = 6. İkisi de tutuyor; denklem denk. Bir element bile tutmuyorsa baştan bak.',
      ),
      kart(
        'Parantez içindeki harf hâli söyler',
        'NaCl(k) katı, H₂O(s) sıvı, CO₂(g) gaz, NaCl(suda) suda çözünmüş demek. Ürünlerde (k) görürsen çökelek, (g) görürsen gaz çıkışı var. Hâl, yani maddenin katı, sıvı ya da gaz olması.',
      ),
      kart(
        'Katsayılar en küçük tam sayı olmalı',
        '4H₂ + 2O₂ → 4H₂O denk ama sadeleşir: hepsini 2\'ye böl, 2H₂ + O₂ → 2H₂O. Katsayıların ortak böleni varsa en küçük tam sayıya indir. 1 katsayısı yazılmaz.',
      ),
    ], [
      soru('Denkleştirme yapılırken formüllerdeki indisler değiştirilebilir.', false, 'İndis değişirse madde değişir; yalnızca katsayılar değiştirilir.'),
      soru('Denkleştirme, kütlenin korunumu yasasının bir gereğidir.', true, 'İki tarafta her elementin atom sayısı eşit olmalı.'),
      soru('Denklemdeki (k), (s), (g) gösterimleri maddenin fiziksel hâlini belirtir.', true, 'Katı, sıvı ve gaz hâlleri böyle yazılıyor.'),
      soru('Denkleştirmede kesirli katsayı hiçbir şekilde kullanılamaz.', false, 'Ara adımda kullanılabilir; sonunda tamamı genişletilip tam sayıya çevrilir.'),
      sikli('Denklemde (suda) ne demektir?', ['Sıvı hâl', 'Sulu çözelti'], 1, 'Sıvı için (s).'),
      sikli('4Fe + 3O₂ → 2Fe₂O₃ denkleminde O₂ katsayısı kaç?', ['2', '3'], 1, '6 O atomu iki tarafta.'),
      sikli('Denkleştirmede en sona bırakılan element hangisidir?', ['İlk yazılan', 'Birden çok bileşikte geçen'], 1, 'En esnek olan sona kalır.'),
      soru('Ara adımda kesirli katsayı kullanılabilir.', true, 'Sonunda tam sayıya çevrilir.'),
    ], [
      {
        soru: 'Denklem denkleştirilirken hangisine dokunulmaz?',
        siklar: ['Formülün önündeki katsayıya', 'Formülün alt indisine'],
        dogru: 1,
        aciklama: {
          dogru: 'Alt indis maddenin kimliği; H₂O\'yu H₂O₂ yapmak suyu oksijenli suya çevirir.',
          yanlis: 'Katsayı tam da değiştirilen şey. Alt indis değiştirilirse madde değişir; denkleştirme yalnızca katsayıyla yapılır.',
        },
        kart: 2,
      },
    ]),
    konu('kim10-hesap', 'Kimyasal Hesaplamalar', [
      kart(
        'Katsayılar mol oranıdır',
        '2H₂ + O₂ → 2H₂O: 2 mol hidrojen, 1 mol oksijenle 2 mol su verir. Katsayılar gram değil mol oranı söyler. 4 mol H₂ alırsan 2 mol O₂ gerekir, 4 mol su çıkar. Stokiyometri, yani denklemle miktar hesabı, bu orana dayanır.',
      ),
      kart(
        'Hesap üç adımdan geçer: mol, oran, birim',
        'Verilen gram, istenen litre olsa bile yol aynı. Önce verileni mole çevir. Sonra katsayı oranını uygula. Sonunda istenen birime dön. Ortadaki adım atlanamaz; oran yalnız mol ile çalışır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Verileni mole çevir' },
            { ad: 'Katsayı oranını uygula' },
            { ad: 'İstenen birime dön' },
          ],
        },
      ),
      kart(
        'Örnek: 4 g H₂ kaç g su verir',
        '2H₂ + O₂ → 2H₂O. Adım 1: 4 g H₂ = 4 / 2 = 2 mol. Adım 2: oran 2:2, yani 2 mol su. Adım 3: 2 × 18 = 36 g su. Yol: gram → mol → oran → gram.',
        undefined,
        { etiket: 'Örnek' },
      ),
      kart(
        'Önce biten madde tepkimeyi durdurur',
        '10 ekmek, 3 köfte varsa 3 sandviç yaparsın; köfte biter, ekmek artar. Tepkimede de önce tükenen madde tepkimeyi durdurur. Buna sınırlayıcı bileşen denir; ürün miktarını o belirler. Artan maddenin fazlası boşta kalır.',
        undefined,
        { not: 'İki maddenin de miktarı verilmişse dur: önce hangisinin biteceğini bul, ürünü ondan hesapla.' },
      ),
      kart(
        'Sınırlayıcıyı bulmak için katsayıya böl',
        '2H₂ + O₂ → 2H₂O\'da 3 mol H₂ ve 2 mol O₂ var. H₂: 3 / 2 = 1,5. O₂: 2 / 1 = 2. Küçük olan H₂; sınırlayıcı odur. Çok olan değil, katsayısına göre az olan biter. 3 mol su oluşur, 0,5 mol O₂ artar.',
      ),
      kart(
        'Yüzde verim: beklenenin ne kadarı çıktı',
        'Hesap 36 g su dedi, deneyde 27 g topladın. Verim = 27 / 36 × 100 = %75. Yüzde verim, yani gerçekte elde edilenin teorik olarak beklenene oranı. %100\'ün üstüne çıkamaz.',
      ),
      kart(
        'Verim neden %100 olmaz',
        'Ürünün bir kısmı kapta kalır, bir kısmı yan tepkimeye gider, bazı tepkimeler geri döner. Her biri toplanan ürünü azaltır. Verim %100 çıktıysa ölçüm hatası ya da safsızlık düşün.',
      ),
      kart(
        'Gazlarda katsayı oranı hacim oranıdır',
        '2H₂ + O₂ → 2H₂O: 2 L hidrojene 1 L oksijen yeter. Aynı sıcaklık ve basınçtaki gazlarda katsayı oranı doğrudan hacim oranı; mole çevirmeye gerek yok. NŞA\'da mol = hacim / 22,4.',
      ),
    ], [
      soru('Denklemdeki katsayılar maddeler arasındaki mol oranını verir.', true, 'Hesaplar bu orandan yürüyor.'),
      soru('Sınırlayıcı bileşen, tepkime bittiğinde artan maddedir.', false, 'Sınırlayıcı bileşen önce tükenen maddedir; tepkimeyi o durdurur.'),
      soru('Yüzde verim, gerçekte elde edilenin teorik miktara oranıdır.', true, 'Yüz ile çarpılarak yüzde olarak yazılıyor.'),
      soru('Yüzde verim %100 ün üzerinde olabilir.', false, 'Teorik miktardan fazlası elde edilemez; fazlası ölçüm hatası ya da safsızlık demek.'),
      sikli('4 g H₂ tamamen yanarsa kaç g su oluşur? (H:1, O:16)', ['18', '36'], 1, '2 mol H₂ → 2 mol H₂O.'),
      sikli('Stokiyometride atlanamayan adım hangisidir?', ['Gram\'a çevirme', 'Mol\'e çevirme'], 1, 'Oranlar mol cinsinden.'),
      sikli('Verimin %100\'e ulaşmamasının sebeplerinden biri?', ['Katalizör', 'Yan tepkimeler'], 1, 'Kayıplar teorik değeri düşürür.'),
      sikli('2 L H₂ için kaç L O₂ gerekir? (2H₂ + O₂)', ['2', '1'], 1, 'Aynı koşulda katsayı oranı hacim oranı.'),
      soru('Sınırlayıcı bileşen tükenince tepkime durur.', true, 'Artan maddenin fazlası tepkimeye giremez.'),
    ], [
      {
        soru: 'Sınırlayıcı bileşen nedir?',
        siklar: ['Miktarı en çok olan madde', 'Önce biten, ürünü belirleyen madde'],
        dogru: 1,
        aciklama: {
          dogru: 'Bittiği anda tepkime durur; ürün miktarı ona bağlı.',
          yanlis: 'Miktar değil oran belirler: her madde katsayısına bölünür, en küçük değeri veren sınırlayıcıdır. Çok olan artabilir.',
        },
        kart: 4,
      },
    ]),
    konu('kim10-gaz-ozellik', 'Gazların Özellikleri ve Kinetik Moleküler Teori', [
      kart(
        'Gaz, kabın her yerini doldurur',
        'Parfüm sıkıldığında odanın her köşesine ulaşır. Gaz, bulunduğu kabı tümüyle doldurur; belli bir şekli ve hacmi yok. Su bardağın dibinde durur, gaz kabın tamamına yayılır.',
      ),
      kart(
        'Gaz sıkışır: tanecikler arası boşluk çok',
        'Şırınganın ucunu kapat, pistonu it: hava sıkışır. Aynı şırıngayı suyla doldur: itemezsin. Gazda tanecikler arasındaki boşluk taneciklerin kendisinden çok büyük; sıkışır. Sıvı ve katıda boşluk yok denecek kadar az.',
      ),
      kart(
        'Kinetik teori: tanecikler durmadan uçuşur',
        'Gaz taneciklerini odada rastgele uçuşan sinekler gibi düşün. Kinetik moleküler teori bunu söyler: tanecikler sürekli ve rastgele hareket eder, aralarında büyük boşluk var, çarpışmalar esnektir, yani çarpışırken enerji kaybolmaz.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Basınç, taneciklerin çepere çarpmasıdır',
        'Balona üfle, balon gerilir. İçerideki tanecikler balonun duvarına durmadan çarpar; her çarpma bir itme. Gaz basıncı, yani taneciklerin kabın çeperine çarpmasından doğan kuvvet. Daha çok ya da daha hızlı tanecik, daha büyük basınç.',
        undefined,
        { not: 'Bir gaz yasası aklından çıkarsa bu resme dön: tanecikler çepere ne kadar sık ve sert çarpıyor?' },
      ),
      kart(
        'Gaz her yöne aynı basıncı yapar',
        'Balon her yöne aynı biçimde şişer, tek taraflı değil. Tanecikler rastgele uçtuğu için her duvara eşit çarpar. Gaz basıncı her yönde aynıdır; aşağı yönlü ağırlık gibi değil.',
      ),
      kart(
        'Sıcaklık, taneciklerin hızını gösterir',
        'Gazı ısıt: tanecikler hızlanır. Mutlak sıcaklık, yani Kelvin ile ölçülen sıcaklık, taneciklerin ortalama hareket enerjisiyle doğru orantılı. Kelvin = °C + 273. Gaz hesaplarında sıcaklık hep Kelvin.',
      ),
      kart(
        'Gazı dört şey tanımlar: P, V, T, n',
        'Bir gazı anlatmak için dört sayı yeter: basınç (P), hacim (V), sıcaklık (T) ve mol sayısı (n). Bisiklet lastiği: pompaladıkça n artar, güneşte T artar. Gaz yasaları bu dördü arasındaki ilişkidir.',
      ),
    ], [
      soru('Bir gazın durumunu basınç, hacim, sıcaklık ve mol sayısı belirler.', true, 'Dördü birbirine bağlı olarak değişiyor.'),
      soru('Gaz basıncı, taneciklerin kabın çeperlerine çarpmasından kaynaklanır.', true, 'Çarpışma sayısı ve şiddeti arttıkça basınç artıyor.'),
      soru('Sıcaklık arttıkça gaz taneciklerinin ortalama hızı azalır.', false, 'Sıcaklık taneciklerin ortalama kinetik enerjisinin ölçüsü; hız artar.'),
      soru('Gazlar sıkıştırılamaz.', false, 'Tanecikler arasındaki boşluk büyük olduğu için kolayca sıkışırlar.'),
      sikli('Gaz hesaplarında sıcaklık hangi birimle alınır?', ['Santigrat', 'Kelvin'], 1, 'Mutlak sıcaklık ortalama kinetik enerjiyle orantılı.'),
      sikli('Gazın kolayca sıkışmasının sebebi?', ['Tanecikler küçük', 'Tanecikler arası boşluk büyük'], 1, 'Katı ve sıvıda boşluk yok denecek kadar az.'),
      soru('Kinetik teoriye göre gaz çarpışmaları esnektir.', true, 'Enerji kaybı yok.'),
      soru('Gaz basıncı yalnızca aşağı yönde etki eder.', false, 'Tanecikler her duvara eşit çarpar; basınç her yönde aynı.'),
    ], [
      {
        soru: 'Gazın basıncı nereden gelir?',
        siklar: ['Taneciklerin ağırlığından', 'Taneciklerin çepere çarpmasından'],
        dogru: 1,
        aciklama: {
          dogru: 'Her çarpma çepere kuvvet uygular; sık ve hızlı çarpma büyük basınç.',
          yanlis: 'Gaz her yöne aynı basıncı uygular, ağırlık aşağı yönlü olurdu. Basınç taneciklerin çepere çarpmasından gelir.',
        },
        kart: 4,
      },
    ]),
    konu('kim10-gaz-yasa', 'Gaz Yasaları', [
      kart(
        'Boyle: sıkıştırırsan basınç artar',
        'Ucu kapalı şırıngayı it: hacim yarıya inince pistonu iki kat zor itersin, basınç ikiye katlandı. Boyle yasası: sabit sıcaklıkta basınç ile hacim ters orantılı, P·V sabit. Grafikte eğri aşağı iner.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'hacim',
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
        'Charles: ısınan gaz genleşir',
        'Balonu güneşe bırak: şişer. Sabit basınçta gaz ısındıkça hacmi büyür. Charles yasası: hacim ile mutlak sıcaklık doğru orantılı, V/T sabit. Grafikte düz çizgi sıfırdan başlar.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık (K)',
          yAd: 'hacim',
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
        'Gay-Lussac: kapalı kap ısınınca basınç artar',
        'Deodorant kutusu ateşe atılırsa patlar: hacim sabit, sıcaklık artınca basınç artar. Gay-Lussac yasası: sabit hacimde basınç ile mutlak sıcaklık doğru orantılı, P/T sabit. Kutuların üstünde bu yüzden "ısıtmayın" yazar.',
      ),
      kart(
        'Avogadro: eşit hacimde eşit sayıda tanecik',
        'Aynı sıcaklık ve basınçta 1 litre helyum ile 1 litre oksijende aynı sayıda tanecik var. Avogadro yasası: eşit hacimli gazlar eşit sayıda tanecik içerir. Hacim ile mol sayısı doğru orantılı.',
      ),
      kart(
        'Her yasa bir değişkeni sabit tutar',
        'Dört yasa dört ayrı deney. Boyle sıcaklığı sabit tutar, Charles basıncı, Gay-Lussac hacmi. Sabit olan değişkeni bul; kalan ikisinin ilişkisi yasanın kendisi.',
        {
          tur: 'tablo',
          basliklar: ['Yasa', 'Sabit', 'İlişki'],
          satirlar: [
            ['Boyle', 'T', 'P ile V ters'],
            ['Charles', 'P', 'V ile T doğru'],
            ['Gay-Lussac', 'V', 'P ile T doğru'],
            ['Avogadro', 'P, T', 'V ile n doğru'],
          ],
        },
      ),
      kart(
        'Sıcaklığı Kelvin\'e çevir: °C + 273',
        '27 °C\'deki gaz 54 °C\'ye ısıtılırsa hacmi iki katına çıkmaz. Kelvin\'e çevir: 300 K → 327 K, hacim ancak %9 artar. Santigratta sıfır keyfî; orantı yalnız mutlak sıfırdan başlayan Kelvin ile çalışır.',
        undefined,
        { etiket: 'Sık hata', not: 'Sıcaklık gördüğünde ilk iş +273; santigratla orantı kurmak sonucu baştan bozar.' },
      ),
      kart(
        'Birleşik gaz denklemi: P₁V₁/T₁ = P₂V₂/T₂',
        '2 atm, 300 K\'de 6 L gaz 600 K\'ye ısıtılıp 4 L\'ye sıkıştırılırsa basıncı? 2·6/300 = P₂·4/600 → P₂ = 6 atm. Üç yasa tek denklemde birleşir. Sabit olan değişkeni at, kalanı oranla.',
      ),
    ], [
      soru(
        'Grafiğe göre sabit sıcaklıkta hacim arttıkça basınç da artar.',
        false,
        'Eğri düşüyor: Boyle yasasına göre sabit sıcaklıkta basınç ile hacim ters orantılı.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 5],
          xAd: 'hacim',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [0.8, 4.5],
                [1.2, 3],
                [1.8, 2],
                [2.5, 1.4],
                [4.5, 0.8],
              ],
            },
          ],
        },
      ),
      soru('Charles yasasına göre sabit basınçta hacim, mutlak sıcaklıkla doğru orantılıdır.', true, 'Isıtılan gaz genişliyor.'),
      soru('Gaz yasalarında sıcaklık Celsius cinsinden kullanılır.', false, 'Kelvin kullanılır; sıfır noktası farklı olduğu için Celsius ile orantı bozulur.'),
      soru('Avogadro yasasına göre aynı koşullarda eşit hacimli gazlar eşit sayıda tanecik içerir.', true, 'Gazın cinsi sonucu değiştirmiyor.'),
      sikli('Sabit basınçta hacim ile mutlak sıcaklık arasındaki ilişki?', ['Ters orantı', 'Doğru orantı'], 1, 'Charles yasası.'),
      sikli('Isınan kapalı kabın patlaması hangi yasayı anlatır?', ['Boyle', 'Gay-Lussac'], 1, 'Sabit hacimde basınç sıcaklıkla artar.'),
      sikli('27 °C kaç kelvindir?', ['27', '300'], 1, '+273.'),
      soru('Aynı koşullardaki eşit hacimli gazlarda eşit sayıda tanecik vardır.', true, 'Avogadro yasası.'),
    ], [
      {
        soru: 'Sabit sıcaklıkta gazın hacmi yarıya inerse basıncı?',
        siklar: ['İki katına çıkar', 'Yarıya iner'],
        dogru: 0,
        aciklama: {
          dogru: 'Boyle: P·V sabit. Hacim yarıya inince basınç ikiye katlanır.',
          yanlis: 'Basınç ile hacim ters orantılı. Sıkışan gazda tanecikler çepere daha sık çarpar; basınç artar.',
        },
        kart: 1,
      },
    ]),
    konu('kim10-ideal', 'İdeal Gaz Yasası', [
      kart(
        'PV = nRT dört değişkeni birleştirir',
        'Boyle, Charles ve Gay-Lussac birer değişkeni sabit tutuyordu. İdeal gaz yasası dördünü birden bağlar: PV = nRT. P basınç, V hacim, n mol sayısı, T Kelvin sıcaklık. R gaz sabiti, yani her gaz için aynı olan sayı.',
      ),
      kart(
        'R = 0,082 L·atm/mol·K',
        'Basınç atm, hacim litre ile verilmişse R = 0,082. Birimler değişirse R\'nin sayısı da değişir; soruda hangi birim varsa ona bak. Sınavda çoğu zaman 0,082 ya da 22,4/273 kullanılır.',
      ),
      kart(
        'Örnek: 2 mol gaz, 300 K, 22,4 L',
        '27 °C = 300 K. P = nRT / V = 2 · 0,082 · 300 / 22,4 ≈ 2,2 atm. Bilinmeyeni yalnız bırak, sayıları yerine koy. Sıcaklığı Kelvin yapmayı unutursan sonuç baştan yanlış.',
        undefined,
        { etiket: 'Örnek' },
      ),
      kart(
        'İki değişken sabitse eski yasalar çıkar',
        'n ve T sabitse PV = sabit: Boyle. n ve P sabitse V/T = sabit: Charles. n ve V sabitse P/T = sabit: Gay-Lussac. Üç yasa da PV = nRT\'nin özel hâli; hepsini ayrı ezberlemene gerek yok.',
      ),
      kart(
        'İdeal gaz: tanecikler birbirini fark etmez',
        'İdeal gaz, yani taneciklerinin hacmi sıfır sayılan ve birbirini çekmeyen hayali gaz. Gerçek gazlar çoğu koşulda buna çok yakın davranır. Yasa bu hayali gaz için yazıldı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Seyrek ve sıcak gaz ideale yakın davranır',
        'Tanecikler birbirinden uzak (düşük basınç) ve hızlı (yüksek sıcaklık) olunca birbirini çekmeye fırsat bulamaz; gaz ideale yakın davranır. Helyum gibi küçük, apolar tanecikler ideale en yakın gazlardır.',
        undefined,
        { not: 'Sapma sorusunda şunu düşün: tanecikler ne zaman birbirine yaklaşıp çekişir? Sıkışınca ve yavaşlayınca.' },
      ),
      kart(
        'Sıkışan, soğuyan gaz idealden sapar',
        'Gazı çok sıkıştır: tanecikler yaklaşır, kendi hacimleri fark edilir. Çok soğut: yavaşlayan tanecikler birbirini çeker, gaz sıvılaşmaya başlar. Yüksek basınç ve düşük sıcaklıkta PV = nRT tutmaz.',
      ),
      kart(
        'Karışımda basınçlar toplanır',
        'Havada oksijen ve azot birlikte. Her gazın kapta tek başına olsaydı yapacağı basınca kısmi basınç denir. Toplam basınç, kısmi basınçların toplamı. Buna Dalton yasası denir.',
      ),
      kart(
        'Kısmi basınç mol oranı kadardır',
        'Kapta 1 mol O₂, 3 mol N₂ var; toplam 4 mol, toplam basınç 2 atm. O₂\'nin mol kesri 1/4; kısmi basıncı 2 · 1/4 = 0,5 atm. Mol kesri, yani gazın molünün toplam mole oranı. Kütle değil mol sayar.',
      ),
    ], [
      soru('PV = nRT bağıntısında T mutlak sıcaklıktır.', true, 'Kelvin cinsinden yazılmak zorunda.'),
      soru('Gazlar yüksek basınç ve düşük sıcaklıkta ideale yaklaşır.', false, 'Tersi: düşük basınç ve yüksek sıcaklıkta ideale yakın davranırlar.'),
      soru('Bir gaz karışımında toplam basınç, kısmi basınçların toplamına eşittir.', true, 'Dalton un kısmi basınçlar yasası.'),
      soru('Bir gazın kısmi basıncı, karışımdaki kütlesiyle doğru orantılıdır.', false, 'Mol oranıyla orantılıdır; kütle değil tanecik sayısı belirleyici.'),
      sikli('PV = nRT\'de R nedir?', ['Gaz sabiti', 'Yoğunluk'], 0, 'Birim seçimine göre değeri değişir.'),
      sikli('Gaz karışımında toplam basınç nasıl bulunur?', ['Kısmi basınçlar toplanır', 'En büyük kısmi basınç alınır'], 0, 'Dalton kısmi basınçlar.'),
      sikli('Bir gazın kısmi basıncı neyle orantılıdır?', ['Mol kesriyle', 'Molar kütlesiyle'], 0, 'P_gaz = mol kesri × toplam.'),
      soru('İdeal gaz denkleminde santigrat kullanılabilir.', false, 'Kelvin şart.'),
      soru('Yüksek basınçta gaz ideallikten sapar.', true, 'Tanecik hacmi ve çekimler işe girer.'),
      sikli('2 mol gaz, 300 K, 22,4 L kapta: basınç yaklaşık?', ['22 atm', '2,2 atm'], 1, '2 · 0,082 · 300 / 22,4.'),
    ], [
      {
        soru: 'Gaz hangi koşulda ideale en yakın davranır?',
        siklar: ['Düşük basınç, yüksek sıcaklık', 'Yüksek basınç, düşük sıcaklık'],
        dogru: 0,
        aciklama: {
          dogru: 'Tanecikler uzak ve hızlı; hacimleri ve çekimleri ihmal edilebilir.',
          yanlis: 'Yüksek basınç ve düşük sıcaklıkta tanecikler yaklaşır, çekimler işe girer; ideallikten en çok o zaman sapar.',
        },
        kart: 6,
      },
    ]),
    konu('kim10-graham', 'Graham Difüzyon ve Efüzyon Yasası', [
      kart(
        'Difüzyon: gaz başka gazın içinde yayılır',
        'Odanın köşesinde parfüm sıkıldı, birkaç saniye sonra sen de kokuyu aldın. Parfüm tanecikleri hava içinde yayıldı. Difüzyon, yani bir gazın başka bir gazın içinde yayılması.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Efüzyon: gaz küçük delikten sızar',
        'Şişirdiğin balon ertesi gün sönmüş. Gaz, balonun kauçuğundaki gözle görülmeyen deliklerden sızdı. Efüzyon, yani gazın küçük bir delikten dışarı kaçması. Yayılma değil, sızma.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Hafif gaz daha hızlı yayılır',
        'Helyum balonu bir günde söner, hava dolu balon günlerce dayanır. Helyum (4 g/mol) havadan (29 g/mol) hafif ve hızlı. Graham yasası: hafif gaz hem daha hızlı yayılır hem daha hızlı sızar.',
      ),
      kart(
        'Aynı sıcaklıkta enerji eşit, hız farklı',
        'Aynı sıcaklıkta bütün gaz taneciklerinin ortalama hareket enerjisi eşit. Aynı enerjiyle atılan tenis topu bowling topundan hızlı gider. Hafif tanecik de aynı enerjiyle ağırdan hızlı uçar. Yasa buradan çıkar.',
        undefined,
        { not: 'Formülü unutsan bile "eşit enerji, hafif olan hızlı" fikrini tut; hız oranı ondan kendiliğinden çıkar.' },
      ),
      kart(
        'Hız oranı, kütle oranının kareköküdür',
        'H₂ (2 g/mol) ile O₂ (32 g/mol): kütle oranı 32/2 = 16, karekökü 4. Hidrojen oksijenden 4 kat hızlı yayılır. Kural: v₁/v₂ = √(M₂/M₁). Ağır olanın kütlesi üste gelir.',
      ),
      kart(
        'Kütle 4 kat büyükse hız 4 kat değil 2 kat',
        'He (4) ile CH₄ (16): kütle 4 kat, hız oranı √4 = 2. Helyum metandan 2 kat hızlı, 4 kat değil. Karekökü unutmak en sık hata. Sayı vermeden de söylenir: hafif olan hızlı, ama kütle oranı kadar değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Graham yasasına göre molekül kütlesi küçük olan gaz daha hızlı yayılır.', true, 'Hafif tanecik aynı sıcaklıkta daha hızlı hareket ediyor.'),
      soru('Efüzyon, gazın küçük bir delikten dışarı sızmasıdır.', true, 'Difüzyon ise gazın başka bir gaz içinde yayılması.'),
      soru('İki gazın yayılma hızlarının oranı, molar kütlelerinin oranına eşittir.', false, 'Molar kütlelerin kareköküyle ters orantılıdır.'),
      soru('Odada açılan parfümün kokusunun yayılması efüzyona örnektir.', false, 'Bu difüzyona örnek; efüzyonda gaz küçük bir delikten geçiyor.'),
      sikli('H₂ (2) ile O₂ (32) hız oranı kaçtır?', ['4', '16'], 0, '√(32/2).'),
      sikli('Gazın küçük delikten sızmasına ne denir?', ['Efüzyon', 'Difüzyon'], 0, 'Difüzyon başka gaz içinde yayılma.'),
      soru('Aynı sıcaklıkta ağır gazın ortalama kinetik enerjisi hafif gazınkinden büyüktür.', false, 'Eşittir; ağır olan daha yavaş hareket eder.'),
    ], [
      {
        soru: 'Aynı sıcaklıkta hangi gaz daha hızlı yayılır?',
        siklar: ['CO₂ (44 g/mol)', 'He (4 g/mol)'],
        dogru: 1,
        aciklama: {
          dogru: 'Hız molar kütlenin kareköküyle ters orantılı; hafif gaz hızlı.',
          yanlis: 'Ağır gaz aynı kinetik enerjiyle daha yavaş hareket eder. Helyum CO₂\'den √11 ≈ 3,3 kat hızlı yayılır.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('kim10-t2', 'Çeşitlilik', [
    konu('kim10-cozunme', 'Çözünme Süreci', [
      kart(
        'Çözelti: bir madde ötekinin içinde dağılır',
        'Şekeri çaya at, karıştır: şeker kayboldu ama çay tatlı. Şeker tanecikleri çayın her yerine eşit dağıldı. Çözelti, yani bir maddenin ötekinin içinde tanecik boyutunda ve her yerde eşit dağıldığı karışım.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Çok olan çözücü, az olan çözünen',
        'Şekerli çayda çay çok, şeker az. Çok olan çözücü, az olan çözünen. Bir istisna var: su varsa hep çözücü sayılır. %70\'lik alkolde alkol çok ama çözücü yine su.',
      ),
      kart(
        'Çözünme üç adımda olur',
        'Tuz suya girince önce tuz tanecikleri birbirinden ayrılır. Sonra su molekülleri aralanıp yer açar. Son adımda su molekülleri tuz taneciklerini sarar. İlk iki adım enerji ister, üçüncüsü enerji verir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Çözünen ayrılır', alt: 'enerji ister' },
            { ad: 'Çözücü aralanır', alt: 'enerji ister' },
            { ad: 'Sarma', alt: 'enerji verir', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Sarma çok verirse çözelti ısınır',
        'NaOH suda çözünürken kap ısınır: sarma adımının verdiği enerji, ayırma adımlarının istediğinden büyük. Amonyum nitratta tersi: kap soğur, çünkü sarma az verir. Toplam artıysa ısı çıkar, eksiyse ısı alınır.',
        undefined,
        { not: 'Isı alan mı veren mi sorusunda üç adımı topla: sarma fazla veriyorsa ısınır, az veriyorsa soğur.' },
      ),
      kart(
        'Soğuk kompres ısı alan çözünmeyle çalışır',
        'Burkulan bileğe konan soğuk kompreste amonyum nitrat ile su ayrı bölmelerde. Paketi sıkınca karışır, çözünme ısı alır, paket soğur. Isıtıcı el paketi ise ısı veren çözünme kullanır.',
      ),
      kart(
        'Karıştırmak hızı artırır, miktarı değil',
        'Çayı karıştırınca şeker daha çabuk çözünür ama daha çok şeker çözünmez. Karıştırmak, ısıtmak ve ufalamak çözünmeyi hızlandırır. Ne kadar çözüneceğini değil, ne kadar sürede çözüneceğini değiştirir.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Bir çözeltide miktarı çok olan bileşen çözücüdür.', true, 'Az olan çözünen.'),
      soru('Çözünme sırasında hem enerji harcanır hem de enerji açığa çıkar.', true, 'Bağları koparmak enerji ister, yeni etkileşimler kurulurken enerji açığa çıkar.'),
      soru('Bütün çözünme olayları ısı verir.', false, 'Bazıları ısı alır; amonyum nitratın suda çözünmesi ortamı soğutuyor.'),
      soru('Çözünen maddenin tanecik boyutunu küçültmek çözünürlüğü artırır.', false, 'Çözünme hızını artırır; çözünürlük değişmez.'),
      sikli('Sulu çözeltilerde çözücü hangisidir?', ['Miktarca çok olan', 'Su'], 1, 'Sulu çözeltide su her zaman çözücü sayılır.'),
      sikli('Soğutucu jel paketi hangi çözünmeyi kullanır?', ['Isı veren', 'Isı alan'], 1, 'Isıtıcı el paketleri ısı veren.'),
      soru('Ufalamak maddenin çözünürlüğünü artırır.', false, 'Yalnızca hızı.'),
    ], [
      {
        soru: 'Karıştırmak ve ısıtmak çözünmenin neyini değiştirir?',
        siklar: ['Hızını', 'Çözünürlüğü'],
        dogru: 0,
        aciklama: {
          dogru: 'Karıştırma ve ufalama yalnızca hızı; çözünürlüğü sıcaklık ve madde cinsi belirler.',
          yanlis: 'Karıştırmak ve ufalamak çözünürlüğü değiştirmez, yalnızca sınıra daha çabuk ulaştırır. Isıtmanın çözünürlüğe etkisi ayrı bir konu.',
        },
        kart: 6,
      },
    ]),
    konu('kim10-cozunebilirlik', 'Maddelerin Birbiri İçindeki Çözünebilirliği', [
      kart(
        'Polar molekülün iki ucu farklı yüklüdür',
        'Su molekülü küçük bir mıknatıs gibi: oksijen tarafı hafif eksi, hidrojen tarafı hafif artı. Buna polar denir, yani yükü iki uca dağılmış. Yağ moleküllerinde böyle uçlar yok; onlar apolar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Benzer benzeri çözer',
        'Tuz suda çözünür, benzinde çözünmez. Yağ benzinde çözünür, suda çözünmez. Kural: polar madde polar çözücüde, apolar madde apolar çözücüde çözünür. Tuz ve su polar, yağ ve benzin apolar.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Su, iyonları sarıp çeker',
        'Tuz (NaCl) artı ve eksi iyonlardan yapılı. Suyun eksi ucu Na⁺\'yı, artı ucu Cl⁻\'yi sarar ve kristalden koparır. Su bu yüzden iyi çözücü: polar ve hidrojen bağı yapabiliyor, yani başka moleküllere sıkı tutunabiliyor.',
      ),
      kart(
        'Yağ suda çözünmez, üstte kalır',
        'Salata sosunu çalkala, biraz sonra yağ yine üste çıkar. Su molekülleri birbirini yağdan daha güçlü çeker; yağı aralarına almaz, dışarı iter. Yağ apolar, su polar: benzer değil, çözünmez.',
      ),
      kart(
        'Sabunun bir ucu suyu, öteki yağı sever',
        'Yağlı tabağı yalnız suyla yıkayamazsın; sabun ekleyince çıkar. Sabun molekülünün bir ucu polar, öteki ucu apolar. Apolar uç yağa tutunur, polar uç suya; yağ suyla birlikte akar gider.',
        undefined,
        { not: 'Sabun molekülünü kafanda iki uçlu bir çubuk gibi çiz: bir ucu yağda, öteki suda. Kural buradan görünür.' },
      ),
      kart(
        'Alkol iki tarafa da tutunur',
        'Etil alkol hem suda hem yağda bir ölçüde çözünür. Molekülünde polar –OH ucu ve apolar karbon zinciri var. Zincir uzadıkça apolar taraf ağır basar; uzun alkoller suda az çözünür.',
      ),
    ], [
      soru('Polar maddeler polar çözücülerde iyi çözünür.', true, '"Benzer benzeri çözer" kuralı.'),
      soru('Yağ suda çözünmez çünkü apolar bir maddedir.', true, 'Su polar; aralarında yeterli çekim kurulmuyor.'),
      soru('Sabun molekülünün iki ucu da polardır.', false, 'Bir ucu polar, öteki ucu apolar; yağ ile suyu bu yüzden birleştirebiliyor.'),
      soru('Karbon zinciri uzadıkça alkollerin sudaki çözünürlüğü artar.', false, 'Azalır; apolar kısım büyüdükçe su ile uyum bozuluyor.'),
      sikli('Tuz hangi çözücüde çözünür?', ['Su', 'Benzin'], 0, 'Polar çözücü.'),
      sikli('Alkolün hem suda hem yağda çözünmesinin sebebi?', ['Hem polar hem apolar ucu var', 'Çok küçük molekül'], 0, 'Zincir uzadıkça suda çözünürlük düşer.'),
      soru('Suyu iyi çözücü yapan şey polar olması ve hidrojen bağı yapabilmesidir.', true, 'İyonları ve polar molekülleri sarar.'),
    ], [
      {
        soru: 'Yağ neden suda çözünmez?',
        siklar: ['Yağ apolar, su polar', 'Yağ sudan yoğun'],
        dogru: 0,
        aciklama: {
          dogru: 'Benzer benzeri çözer; su molekülleri birbirini yağdan güçlü çeker, yağ dışarı itilir.',
          yanlis: 'Yoğunluk yüzmeyi belirler, çözünmeyi değil. Yağ apolar, su polar; polar su apolar yağı saramaz.',
        },
        kart: 4,
      },
    ]),
    konu('kim10-siniflandirma', 'Çözünme Olayının Sınıflandırılması', [
      kart(
        'Tuz suda iyonlarına ayrılır',
        'Tuz (NaCl) suya girince Na⁺ ve Cl⁻ iyonlarına ayrılır. İyon, yani elektrik yükü taşıyan tanecik. Buna iyonik çözünme denir. Asitler ve bazlar da suda iyonlarına ayrılır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Şeker molekül olarak dağılır',
        'Şeker suya girince molekülleri birbirinden ayrılır ama parçalanmaz; yüklü tanecik oluşmaz. Buna moleküler çözünme denir. Alkol ve glikoz da böyle çözünür.',
      ),
      kart(
        'İyon varsa çözelti akımı iletir',
        'Elektrik akımı yüklü taneciklerin hareketidir. Tuzlu suda serbest iyonlar var; akımı taşırlar. Şekerli suda yüklü tanecik yok; akım geçmez. Akım ileten çözeltiye elektrolit denir.',
      ),
      kart(
        'Lamba deneyi iyonu gösterir',
        'Basit devreye lamba bağla, iki ucunu çözeltiye daldır. Tuzlu suda lamba parlak yanar, şekerli suda hiç yanmaz. Lamba yanıyorsa çözünme iyonik; yanmıyorsa moleküler.',
        {
          tur: 'tablo',
          basliklar: ['Çözelti', 'İletkenlik'],
          satirlar: [
            ['Tuzlu su', 'Yüksek'],
            ['Sirke', 'Düşük'],
            ['Şekerli su', 'Yok'],
          ],
        },
        { not: 'İletkenlik sorusunda lamba deneyini düşün: parlak, sönük ya da yanmıyor; üçü üç ayrı cevap.' },
      ),
      kart(
        'Tamamı ayrılan kuvvetli, kısmı zayıf',
        'Tuzun bütün tanecikleri iyonlaşır: kuvvetli elektrolit, lamba parlak. Sirkedeki asetik asidin yalnız küçük bir kısmı iyonlaşır: zayıf elektrolit, lamba sönük yanar. İyon ne kadar çoksa iletkenlik o kadar yüksek.',
      ),
      kart(
        'Saf su neredeyse iletmez',
        'Saf suda serbest iyon yok denecek kadar az; akımı iletmez. Musluk suyu iletir, çünkü içinde çözünmüş tuzlar var. Islak elle prize dokunmak tehlikeli; ileten su değil, içindeki iyonlar.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('İyonik çözünmede oluşan çözelti elektrik akımını iletir.', true, 'Serbest iyonlar yükü taşıyor.'),
      soru('Şekerin suda çözünmesi moleküler çözünmedir.', true, 'Moleküller dağılıyor ama iyonlara ayrılmıyor.'),
      soru('Saf su elektriği iyi iletir.', false, 'Saf suda serbest iyon yok denecek kadar az; ileten şey içindeki çözünmüş tuzlar.'),
      soru('Zayıf elektrolitler suda tümüyle iyonlaşır.', false, 'Kısmen iyonlaşırlar; tümüyle iyonlaşan kuvvetli elektrolittir.'),
      sikli('Suda iyonlarına ayrılan madde nasıl çözünmüştür?', ['İyonik', 'Moleküler'], 0, 'Çözelti akım iletir.'),
      sikli('Bir kısmı iyonlaşan madde nedir?', ['Zayıf elektrolit', 'Kuvvetli elektrolit'], 0, 'Lamba sönük yanar.'),
      soru('Sirke çözeltisi kuvvetli bir elektrolittir.', false, 'Asetik asidin küçük bir kısmı iyonlaşır; zayıf elektrolit, lamba sönük yanar.'),
    ], [
      {
        soru: 'Şeker çözeltisi elektriği iletir mi?',
        siklar: ['Hayır, moleküler çözünme', 'Evet, çözünmüş madde var'],
        dogru: 0,
        aciklama: {
          dogru: 'Şeker molekül hâlinde dağılır, iyon oluşmaz; yük taşıyıcı yok.',
          yanlis: 'Çözünmüş olmak yetmez, iyon gerekir. Şeker molekül olarak dağılır; tuz gibi iyonlarına ayrılmaz.',
        },
        kart: 2,
      },
    ]),
    konu('kim10-cozunurluk', 'Çözünürlük', [
      kart(
        'Çözünürlük: 100 g suda en çok kaç gram',
        '20 °C\'de 100 g suya tuz ekle: 36 g çözünür, fazlası dipte kalır. Tuzun 20 °C\'deki çözünürlüğü 36 g. Çözünürlük, yani belirli sıcaklıkta 100 g çözücüde çözünebilen en çok madde. Her maddenin kendi değeri var.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Doymuş çözelti daha fazlasını alamaz',
        '100 g suya 36 g tuz kondu, hepsi çözündü; bir gram daha ekledin, dipte kaldı. Bu çözelti doymuş, yani o sıcaklıkta çözebileceği kadarını çözmüş. Daha azı çözülmüşse doymamış.',
      ),
      kart(
        'Aşırı doymuş çözelti kararsızdır',
        'Sıcakken bol şeker çözdün, yavaşça soğuttun; şeker çökmeden çözeltide kaldı. Şimdi sınırın üstünde madde taşıyor: aşırı doymuş. Küçük bir sarsıntı ya da tek bir kristal fazlalığı hemen çökertir.',
      ),
      kart(
        'Eğri, sıcaklıkla çözünürlüğü gösterir',
        'Yatay eksen sıcaklık, düşey eksen 100 g sudaki gram. Katıların çizgisi çoğunlukla yukarı çıkar: ısındıkça daha çok çözünür. Gazların çizgisi aşağı iner: ısındıkça daha az çözünür.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık',
          yAd: 'çözünürlük',
          egriler: [
            {
              noktalar: [
                [0, 0.6],
                [2, 1.6],
                [3.5, 3],
                [5, 5],
              ],
              ad: 'katı',
            },
            {
              noktalar: [
                [0, 3],
                [2, 2],
                [3.5, 1.3],
                [5.5, 0.8],
              ],
              renk: 'ikincil',
              ad: 'gaz',
            },
          ],
        },
      ),
      kart(
        'Eğrinin üstü aşırı doymuş, altı doymamış',
        'Grafikte bir nokta işaretle. Çizginin tam üstündeyse çözelti doymuş. Çizginin altındaysa doymamış; daha madde alır. Çizginin üstündeyse aşırı doymuş; fazlası çökmeye hazır.',
      ),
      kart(
        'Soğutunca fazlası kristal olur',
        '80 °C\'de 100 g suda 60 g madde çözündü. 20 °C\'de çözünürlük 30 g. Soğutunca 60 − 30 = 30 g kristal çöker. Buna kristallendirme denir; şeker ve tuz bu yolla saflaştırılır.',
        undefined,
        { not: 'Grafik sorusunda iki sıcaklıktaki değeri oku, farkı al; çöken miktar bu kadar. Su 200 g ise sayıları ikiyle çarp.' },
      ),
      kart(
        'Su miktarı değişirse orantı kur',
        'Çözünürlük 100 g su için verilir. 200 g suda her sayı iki katı: 80 °C\'de 120 g çözünür, 20 °C\'ye soğutunca 60 g çöker. 50 g suda yarısı. Önce suyu 100 g\'a oranla.',
      ),
    ], [
      soru(
        'Grafiğe göre sıcaklık arttıkça bu katının çözünürlüğü azalır.',
        false,
        'Eğri yükseliyor: sıcaklık arttıkça çözünürlük de artıyor.',
        {
          tur: 'koordinat',
          pencere: [0, 100, 0, 120],
          xAd: 'sıcaklık (°C)',
          yAd: 'çözünürlük',
          egriler: [
            {
              noktalar: [
                [0, 15],
                [20, 30],
                [40, 55],
                [60, 80],
                [80, 100],
              ],
            },
          ],
        },
      ),
      soru('Doymuş çözelti, o sıcaklıkta çözebileceği en çok maddeyi çözmüş çözeltidir.', true, 'Eklenen fazla madde dibe çöküyor.'),
      soru('Aşırı doymuş çözelti kararsızdır.', true, 'Küçük bir sarsıntı bile fazlalığın kristalleşmesine yol açabiliyor.'),
      soru('Çözünürlük sıcaklıktan etkilenmeyen sabit bir değerdir.', false, 'Sıcaklığa bağlı; her sıcaklık için ayrı bir çözünürlük değeri var.'),
      sikli('Çözünürlük hangi miktar suya göre tanımlanır?', ['100 g', '1 L'], 0, 'Belirli sıcaklıkta 100 g çözücü.'),
      sikli('Sıcak doymuş çözelti soğutulunca ne olur?', ['Fazlalık kristalleşir', 'Daha çok çözünür'], 0, 'Kristallendirme.'),
      sikli('80 °C\'de 60 g, 20 °C\'de 30 g çözünüyorsa soğutunca ne kadar çöker?', ['30 g', '60 g'], 0, 'Fark çöker.'),
      soru('Aşırı doymuş çözelti kararlıdır.', false, 'Küçük sarsıntı çökertir.'),
    ], [
      {
        soru: 'Çözünürlük eğrisinin üstünde kalan nokta hangi çözeltidir?',
        siklar: ['Aşırı doymuş', 'Doymamış'],
        dogru: 0,
        aciklama: {
          dogru: 'Eğri sınırı gösterir; üstü sınırdan fazla madde taşıyan kararsız çözelti.',
          yanlis: 'Doymamış çözelti eğrinin altında kalır. Eğrinin üstü sınırdan fazlasını taşıyan aşırı doymuş bölge.',
        },
        kart: 5,
      },
    ]),
    konu('kim10-etkileyen', 'Çözünürlüğe Etki Eden Faktörler', [
      kart(
        'Çözünürlük önce maddenin cinsine bağlıdır',
        'Aynı 100 g suya 20 °C\'de 36 g tuz, 200 g şeker, 0,001 g kireç sığar. Su aynı, sıcaklık aynı, sayılar bambaşka. Çözünürlüğü ilk belirleyen şey çözücü ile çözünenin cinsi.',
      ),
      kart(
        'Katılar sıcak suda daha çok çözünür',
        'Soğuk çayda üç şeker dipte kalır; sıcak çayda üçü de erir, dördüncü de sığar. Çoğu katının çözünürlüğü sıcaklıkla artar. Sıcak su yalnızca daha hızlı değil, daha çok da çözer.',
      ),
      kart(
        'Gazlar sıcak suda daha az çözünür',
        'Sıcak gazoz açılınca fışkırır; buzdolabındaki sessizce açılır. Isınan suda çözünmüş gaz kaçar. Gazların çözünürlüğü sıcaklıkla azalır. Yazın ısınan gölde balıklar bu yüzden oksijensiz kalır.',
        undefined,
        { etiket: 'Dikkat' },
      ),
      kart(
        'Basınç yalnızca gazın çözünürlüğünü artırır',
        'Gazoz şişesinde CO₂ yüksek basınçla suda tutulur. Kapağı aç: basınç düşer, gaz kaçar, köpürür. Basınç arttıkça gazın çözünürlüğü artar. Katı ve sıvıların çözünürlüğüne basıncın belirgin etkisi yok.',
      ),
      kart(
        'Karıştırma ve ufalama sınırı değiştirmez',
        'Şekeri toz yap, hızla karıştır: daha çabuk çözünür ama 100 g suya yine aynı miktar sığar. Hız ile miktar ayrı iki soru. Yalnız sıcaklık ikisini birden değiştirir.',
        {
          tur: 'tablo',
          basliklar: ['Etken', 'Neyi değiştirir?'],
          satirlar: [
            ['Karıştırma', 'Hız'],
            ['Ufalama', 'Hız'],
            ['Çözücü miktarı', 'Hiçbiri'],
            ['Sıcaklık', 'İkisi de'],
          ],
        },
        { etiket: 'Sık hata', not: 'Soru "hız" mı "çözünürlük" mü soruyor, önce ona bak: karıştırma yalnız hızı, sıcaklık ikisini değiştirir.' },
      ),
      kart(
        'Ortak iyon çözünürlüğü düşürür',
        'Doymuş tuzlu suya (NaCl) bir tutam KCl at: içinde zaten Cl⁻ var. Çözeltideki Cl⁻ artınca NaCl\'nin bir kısmı çöker. Ortak iyon etkisi, yani çözeltide zaten bulunan bir iyonu eklemek, o tuzun çözünürlüğünü düşürür.',
      ),
    ], [
      soru('Katıların çözünürlüğü genellikle sıcaklık arttıkça artar.', true, 'Şekerin sıcak suda daha çok çözünmesi buna örnek.'),
      soru('Gazların çözünürlüğü sıcaklık arttıkça azalır.', true, 'Isınan gazlı içeceğin gazının kaçması bu yüzden.'),
      soru('Basınç, katıların çözünürlüğünü belirgin biçimde etkiler.', false, 'Basıncın belirgin etkisi gazlarda görülür.'),
      soru('Karıştırmak çözünürlüğü artırır.', false, 'Çözünme hızını artırır; çözünürlük aynı kalır.'),
      sikli('Basınç hangi maddelerin çözünürlüğünü etkiler?', ['Katıların', 'Yalnızca gazların'], 1, 'Gazoz şişesi.'),
      sikli('Sıcak suda balık için oksijenin azalmasının sebebi?', ['Su buharlaşır', 'Gaz çözünürlüğü sıcaklıkla azalır'], 1, 'Isınan su gazı tutamaz.'),
      soru('Ortak iyon eklemek tuzun çözünürlüğünü artırır.', false, 'Düşürür; zaten bulunan iyon artınca tuzun bir kısmı çöker.'),
    ], [
      {
        soru: 'Gazoz ısındığında neden köpürür?',
        siklar: ['Gazın çözünürlüğü sıcaklıkla artar', 'Gazın çözünürlüğü sıcaklıkla azalır'],
        dogru: 1,
        aciklama: {
          dogru: 'Sıcak su gazı tutamaz; çözünmüş CO₂ dışarı kaçar.',
          yanlis: 'Katılar için doğru olan gazlarda tersine döner: ısınan sıvıda gazın çözünürlüğü düşer ve gaz kaçar.',
        },
        kart: 3,
      },
    ]),
    konu('kim10-cozelti-sinif', 'Çözeltilerin Sınıflandırılması', [
      kart(
        'Derişik çok, seyreltik az çözünen taşır',
        'Bir bardağa bir kaşık, öbürüne beş kaşık şeker koydun. Beş kaşıklı derişik, bir kaşıklı seyreltik. Derişik, yani çözünen miktarı çok olan; seyreltik, az olan. Kesin bir sınır yok; karşılaştırma göreli.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Doymuşluk sınıra, derişiklik miktara bakar',
        'Doymuş, doymamış, aşırı doymuş: çözünürlük sınırına göre sınıflama. Derişik ve seyreltik: içindeki miktara göre sınıflama. İki ayrı soru; biri ötekini söylemez.',
      ),
      kart(
        'Az çözünen madde seyreltikken doyar',
        'Kireç (CaCO₃) 100 g suda ancak 0,001 g çözünür. Bu kadarcık madde çözeltiyi doyurur ama içinde neredeyse hiç madde yok: doymuş ve seyreltik. Şekerli su ise 150 g şekerle doymamış ama derişik.',
        undefined,
        { not: 'Derişik ile doymuşu aynı sanma: az çözünen madde bir tutamla doyar, çözelti yine seyreltik kalır.' },
      ),
      kart(
        'Çözelti sıvı olmak zorunda değil',
        'Hava bir çözelti: azot içinde oksijen çözünmüş, gaz hâlde. Çelik de çözelti: demir içinde karbon dağılmış, katı hâlde. Çözelti, hâline göre gaz, sıvı ya da katı olabilir.',
        {
          tur: 'tablo',
          basliklar: ['Hâl', 'Örnek'],
          satirlar: [
            ['Gaz', 'Hava'],
            ['Sıvı', 'Tuzlu su'],
            ['Katı', 'Çelik'],
          ],
        },
      ),
      kart(
        'Elektrolit iletir, öteki iletmez',
        'Tuzlu su akımı iletir: elektrolit çözelti, içinde iyon var. Şekerli su iletmez: elektrolit olmayan çözelti, içinde yalnız molekül var. İletkenliğe göre sınıflama bu ikisi.',
      ),
      kart(
        'Çözelti her yerinde aynıdır',
        'Tuzlu suyun üstünden de dibinden de aynı tuzlulukta örnek alırsın: homojen, yani her yeri aynı. Kum-su karışımında kum dipte: bu çözelti değil, süspansiyon. Tanecikler görünüyorsa çözelti değil.',
      ),
    ], [
      soru('Derişik ve seyreltik ayrımı, çözünen madde miktarına göre yapılır.', true, 'Göreli bir ayrım; kesin bir sınır yok.'),
      soru('Doymuş bir çözelti aynı zamanda seyreltik olabilir.', true, 'Çözünürlüğü düşük bir maddede doymuş çözelti az madde içeriyor.'),
      soru('Çözeltiler heterojen karışımlardır.', false, 'Homojen olmak çözelti olmanın şartı.'),
      soru('Alaşımlar çözelti sayılmaz.', false, 'Katı hâldeki çözeltilere örnek.'),
      sikli('Hava hangi tür çözeltidir?', ['Katı çözelti', 'Gaz çözeltisi'], 1, 'Alaşımlar katı çözelti.'),
      sikli('Tanecikleri görünür boyutta olan karışım nedir?', ['Çözelti', 'Süspansiyon'], 1, 'Çözelti homojendir.'),
      soru('Derişik çözelti her zaman doymuştur.', false, 'İkisi ayrı sınıflama.'),
    ], [
      {
        soru: 'Doymuş bir çözelti aynı zamanda seyreltik olabilir mi?',
        siklar: ['Hayır, doymuş hep derişiktir', 'Evet, çözünürlük düşükse'],
        dogru: 1,
        aciklama: {
          dogru: 'Az çözünen madde küçük miktarda doyar; çözelti doymuş ama seyreltiktir.',
          yanlis: 'İki sınıflama ayrı: doymuşluk sınıra, derişiklik miktara bakar. Az çözünen madde az miktarda bile doyar.',
        },
        kart: 3,
      },
    ]),
    konu('kim10-derisim', 'Derişim Birimleri', [
      kart(
        'Molarite: 1 litrede kaç mol çözünmüş',
        '1 L çözeltide 1 mol tuz varsa çözelti 1 molar, yazılışı 1 M. Molarite, yani 1 litre çözeltideki çözünen mol sayısı. Birimi mol/L. Formül: M = n / V, V litre cinsinden.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Örnek: 4 g NaOH, 500 mL çözelti',
        'NaOH\'nin molar kütlesi 40; 4 g = 0,1 mol. 500 mL = 0,5 L. Molarite = 0,1 / 0,5 = 0,2 M. Sıra hep aynı: önce gramı mole çevir, sonra mL\'yi litreye, sonra böl.',
        undefined,
        { etiket: 'Örnek' },
      ),
      kart(
        'Çözeltinin hacmine böl, çözücünün değil',
        '500 mL suya tuz attın, hacim 510 mL oldu. Molaritede 510 mL kullanılır; suyun 500 mL\'si değil. Çözelti = çözücü + çözünen; katı eklenince hacim büyür. "Su" ile "çözelti" sınavda kasten karıştırılır.',
        undefined,
        { etiket: 'Sık hata', not: 'Soruda "mL su" mu "mL çözelti" mi yazıyor, altını çiz; molarite çözeltinin hacmine bölünür.' },
      ),
      kart(
        'Kütlece yüzde: 100 g çözeltide kaç gram',
        '20 g tuz + 80 g su = 100 g çözelti; tuz kütlece %20. Kütlece yüzde = çözünenin kütlesi / çözeltinin kütlesi × 100. Payda çözücü değil, çözelti. Sirke şişesindeki "%5 asit" böyle yazılır.',
      ),
      kart(
        'ppm: milyonda bir',
        '1 kg suda 1 mg kurşun varsa derişim 1 ppm; milyonda bir parça. ppm, yani çok seyreltik derişimlerin birimi. İçme suyu sınırları ve hava kirliliği ppm ile verilir; yüzde bu kadar küçük sayıya elverişsiz.',
      ),
      kart(
        'Su eklemek molü değil hacmi değiştirir',
        'Bir bardak şerbete su kat: tadı açılır. Şeker miktarı aynı, hacim büyüdü; derişim düştü. Seyreltme, yani çözücü ekleyerek derişimi düşürme. Mol sayısı değişmez, bu yüzden M₁V₁ = M₂V₂.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Mol sayısı', alt: 'değişmez' },
            { ad: 'Hacim', alt: 'büyür' },
            { ad: 'Derişim', alt: 'küçülür', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Seyreltme örneği: M₁V₁ = M₂V₂',
        '2 M\'lik 100 mL çözeltiye 300 mL su ekledin; son hacim 400 mL. 2 · 100 = M₂ · 400 → M₂ = 0,5 M. Sol taraf başlangıçtaki mol, sağ taraf sondaki mol; ikisi eşit.',
      ),
      kart(
        'Karıştırınca moller ve hacimler toplanır',
        '1 M\'lik 100 mL ile 3 M\'lik 100 mL aynı tuz çözeltisi karıştı. Mol: 0,1 + 0,3 = 0,4. Hacim: 200 mL = 0,2 L. Yeni derişim 0,4 / 0,2 = 2 M. Derişimleri toplama; molü topla, hacme böl.',
      ),
    ], [
      soru('Molarite, çözünen maddenin mol sayısının çözelti hacmine bölünmesidir.', true, 'Birimi mol/L.'),
      soru('Molarite hesabında çözücünün değil çözeltinin hacmi kullanılır.', true, 'Katı eklenince toplam hacim değişebiliyor.'),
      soru('Seyreltme sırasında çözünen maddenin mol sayısı değişir.', false, 'Mol sayısı aynı kalır; değişen hacim, dolayısıyla derişim.'),
      soru('Kütlece yüzde derişim, çözünenin kütlesinin çözücü kütlesine oranıdır.', false, 'Çözelti kütlesine oranıdır; çözelti çözücü ile çözünenin toplamı.'),
      sikli('4 g NaOH (40 g/mol) ile 500 mL çözelti: molarite?', ['0,1 M', '0,2 M'], 1, '0,1 mol / 0,5 L.'),
      sikli('2 M\'lik 100 mL çözeltiye 300 mL su eklenirse?', ['1,5 M', '0,5 M'], 1, 'M₁V₁ = M₂V₂.'),
      sikli('İçme suyundaki kurşun sınırı hangi birimle verilir?', ['Molarite', 'ppm'], 1, 'Milyonda bir kısım.'),
      sikli('Molarite hangi hacme bölünür?', ['Çözücünün', 'Çözeltinin'], 1, 'Katı eklemek hacmi değiştirir.'),
      soru('İki çözelti karışınca toplam mol ve toplam hacim toplanır.', true, 'Yeni derişim bölüm.'),
    ], [
      {
        soru: '1 M çözeltiye su eklenince mol sayısı ne olur?',
        siklar: ['Azalır', 'Değişmez'],
        dogru: 1,
        aciklama: {
          dogru: 'Çözünen madde eklenmedi ve çıkarılmadı; azalan şey derişim.',
          yanlis: 'Azalan derişim, mol sayısı değil. Su yalnızca hacmi büyütür; aynı mol daha çok hacme yayılır.',
        },
        kart: 6,
      },
    ]),
    konu('kim10-koligatif', 'Koligatif Özellikler', [
      kart(
        'Koligatif özellik tanecik sayısına bakar',
        'Suya 1 mol şeker de 1 mol üre de koysan kaynama noktası aynı miktarda yükselir. Ne koyduğun değil, kaç tanecik koyduğun önemli. Koligatif özellik, yani çözünenin cinsine değil tanecik sayısına bağlı özellik.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Çözünen buharlaşmayı zorlaştırır',
        'Su yüzeyinden moleküller uçup gider; üstte biriken buharın basıncına buhar basıncı denir. Tuz ekleyince yüzeyin bir kısmını tuz iyonları kaplar; daha az su molekülü uçar. Buhar basıncı düşer. Öteki özellikler buradan çıkar.',
      ),
      kart(
        'Tuzlu su daha yüksek sıcaklıkta kaynar',
        'Saf su 100 °C\'de kaynar; makarna suyuna tuz atınca biraz daha geç kaynar. Sıvı, buhar basıncı dış basınca eşitlenince kaynar; çözünen buhar basıncını düşürdüğü için daha çok ısı gerekir. Kaynama noktası yükselir.',
      ),
      kart(
        'Tuzlu su daha düşük sıcaklıkta donar',
        'Kışın yola tuz atılır: buz erir, çünkü tuzlu su 0 °C\'nin altında da sıvı kalır. Çözünen, donma noktasını düşürür. Arabanın antifrizi de aynı ilkeyle radyatörü donmaktan korur.',
      ),
      kart(
        'Tuz ikiye ayrılır, etkisi iki kat',
        '1 mol şeker suda 1 mol tanecik verir. 1 mol NaCl suda Na⁺ ve Cl⁻\'ye ayrılır: 2 mol tanecik. Aynı molde tuzun etkisi şekerin iki katı. CaCl₂ üç iyona ayrılır; üç kat.',
        {
          tur: 'tablo',
          basliklar: ['1 mol madde', 'Tanecik'],
          satirlar: [
            ['Şeker', '1 mol'],
            ['NaCl', '2 mol'],
            ['CaCl₂', '3 mol'],
          ],
        },
        { not: 'Mol sayma, tanecik say: tuz suda ikiye, CaCl₂ üçe ayrılır; şeker olduğu gibi kalır.' },
      ),
      kart(
        'Osmotik basınç suyu durdurur',
        'Yarı geçirgen zar, yani suyu geçiren ama çözüneni geçirmeyen zar. İki yanda derişim farklıysa su seyreltik taraftan derişik tarafa geçer. Bu geçişi durdurmak için gereken basınca osmotik basınç denir. Hücre tuzlu suda bu yüzden büzülür.',
      ),
    ], [
      soru('Koligatif özellikler, çözünen taneciklerin sayısına bağlıdır.', true, 'Taneciğin cinsi değil sayısı belirleyici.'),
      soru('Tuzlu suyun kaynama noktası saf sudan yüksektir.', true, 'Çözünen tanecikler buharlaşmayı zorlaştırıyor.'),
      soru('Yollara tuz atılması suyun donma noktasını yükseltir.', false, 'Donma noktasını düşürür; buz bu yüzden erir.'),
      soru('Aynı derişimdeki şeker ve tuz çözeltileri kaynama noktasını aynı ölçüde yükseltir.', false, 'Tuz iyonlarına ayrıldığı için daha çok tanecik verir ve etkisi büyüktür.'),
      sikli('Koligatif özellik neye bağlıdır?', ['Tanecik sayısına', 'Çözünenin cinsine'], 0, 'Cinsi değil sayısı.'),
      sikli('Aynı molde NaCl, şekerin kaç katı etki yapar?', ['2', '1'], 0, 'İki iyona ayrılır.'),
      soru('Çözünen eklenince kaynama noktası düşer.', false, 'Yükselir; düşen donma noktası.'),
    ], [
      {
        soru: 'Yollara kışın tuz atılmasının sebebi?',
        siklar: ['Kaynama noktası yükselir', 'Donma noktası düşer'],
        dogru: 1,
        aciklama: {
          dogru: 'Tuzlu su saf sudan daha düşük sıcaklıkta donar; buz çözülür.',
          yanlis: 'Kaynama noktası da yükselir ama yolda önemli olan donma: tuzlu su 0 °C\'nin altında sıvı kalır.',
        },
        kart: 4,
      },
    ]),
  ]),
  tema('kim10-t3', 'Sürdürülebilirlik', [
    konu('kim10-mikro', 'Makro ve Mikro Ölçekli Deneyler', [
      kart(
        'Mikro ölçek: aynı deney, çok az madde',
        'Okul laboratuvarında asit-baz deneyini 50 mL yerine 5 mL ile yaparsın; damlalık ve küçük tüp yeter. Sonuç aynı çıkar. Mikro ölçekli deney, yani aynı deneyi çok az madde ve küçük düzenekle yapmak.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Az madde: az atık, az para, az tehlike',
        '5 mL asit dökülürse bir peçeteyle silinir; 500 mL dökülürse laboratuvar boşaltılır. Az madde kullanmak üç kazanç getirir: daha az atık, daha düşük maliyet, daha küçük risk.',
      ),
      kart(
        'Atom ekonomisi: atomların kaçı ürüne gitti',
        'Tepkimeye giren 100 atomdan 80\'i istenen ürüne, 20\'si yan ürüne gittiyse atom ekonomisi %80. Atom ekonomisi, yani girenlerdeki atomların ne kadarının istenen üründe toplandığı. Yüksekse atık az.',
      ),
      kart(
        'Verim başka, atom ekonomisi başka',
        'Verim: beklenen 10 g üründen 8 g topladım, %80. Atom ekonomisi: girenlerin atomlarının %80\'i ürüne gitti, gerisi yan ürün. İlki deneyin ne kadarını kurtardığını, ikincisi tepkimenin ne kadar israfsız olduğunu söyler.',
        undefined,
        { not: 'Verim "ne kadar topladım" der, atom ekonomisi "kaç atom boşa gitti"; ikisini birbirinin yerine koyma.' },
      ),
      kart(
        'Her deney küçültülemez',
        'Yoğunluk ölçmek için tartılacak kadar madde gerekir; bir damlayla ölçüm hatası büyür. Ölçek, sonucun doğruluğunu bozmadan küçültülür. Küçük her zaman daha doğru değil.',
        undefined,
        { etiket: 'Dikkat' },
      ),
      kart(
        'Mikro ölçek yeşil kimyanın parçasıdır',
        'Yeşil kimya, yani doğaya en az zarar veren kimya yapma anlayışı. İlk ilkesi: atığı oluştuktan sonra temizlemek yerine hiç oluşturmamak. Mikro ölçekli deney tam bunu yapar: az madde, az atık.',
      ),
    ], [
      soru('Mikro ölçekli deneylerde daha az kimyasal kullanılır.', true, 'Maliyet de risk de düşüyor.'),
      soru('Mikro ölçekli çalışmak oluşan atık miktarını azaltır.', true, 'Yeşil kimyanın atık önleme ilkesiyle örtüşüyor.'),
      soru('Mikro ölçekli deneylerin sonuçları her zaman daha kesindir.', false, 'Küçük miktarlarda ölçüm hatasının payı büyüyebiliyor.'),
      soru('Atom ekonomisi ile yüzde verim aynı şeyi ölçer.', false, 'Verim ne kadar elde edildiğini, atom ekonomisi girenlerin ne kadarının ürüne geçtiğini ölçer.'),
      sikli('Atom ekonomisi neyi ölçer?', ['Kaç atomun ürüne geçtiğini', 'Ne kadar ürün elde edildiğini'], 0, 'Verim ikincisini ölçer.'),
      sikli('Deneyi 50 mL yerine 5 mL ile yapmak neyi değiştirir?', ['Atığı', 'Sonucu'], 0, 'Aynı sonuç, onda bir atık.'),
      soru('Her deney mikro ölçeğe küçültülebilir.', false, 'Bazı ölçümler görünür miktar ister.'),
    ], [
      {
        soru: 'Mikro ölçekli deneyin kazançlarından biri hangisidir?',
        siklar: ['Daha az atık ve risk', 'Daha yüksek verim'],
        dogru: 0,
        aciklama: {
          dogru: 'Az madde az atık, az maliyet, az risk demek.',
          yanlis: 'Verim yüzdesi ölçekle değişmez; mikro ölçeğin kazancı aynı sonucu daha az atık ve riskle almak.',
        },
        kart: 2,
      },
    ]),
    konu('kim10-atmosfer', 'Atmosferdeki Tepkimeler ve Küresel Sorunlar', [
      kart(
        'Sera gazı ısıyı tutar',
        'Serada cam güneşi içeri alır, ısının kaçmasını engeller. Atmosferdeki karbondioksit (CO₂) ve metan (CH₄) da yerden yayılan ısıyı tutar. Sera etkisi, yani bu gazların gezegeni battaniye gibi sarması. Olmasaydı Dünya buz kesilirdi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fazla sera gazı gezegeni ısıtır',
        'Kömür, petrol ve doğal gaz yakılınca CO₂ çıkar. Sanayi öncesine göre havadaki CO₂ yarı yarıya arttı; battaniye kalınlaştı. Küresel ısınma, yani ortalama sıcaklığın yükselmesi. Sorun sera etkisi değil, fazlası.',
      ),
      kart(
        'Kükürt ve azot oksitleri asit yağmuru yapar',
        'Kömürlü santral bacasından SO₂, araba egzozundan NOₓ çıkar. Bu gazlar havadaki suyla birleşip sülfürik ve nitrik asit olur, yağmurla iner. Asit yağmuru heykelleri aşındırır, gölleri ve ormanları öldürür.',
      ),
      kart(
        'Ozon tabakası morötesi ışını süzer',
        'Yerden 20–30 km yukarıda ozon (O₃) tabakası var. Güneşin morötesi ışınlarının, yani cilt kanseri yapan görünmez ışınların büyük kısmını yutar. Bu tabaka olmasa güneşlenmek tehlikeli olurdu.',
      ),
      kart(
        'CFC gazları ozonu parçalar',
        'Eski buzdolabı ve spreylerdeki kloroflorokarbonlar (CFC) yükseklere çıkıp klor salar; bir klor atomu binlerce ozon molekülünü parçalar. Ozon tabakası inceldi, kutuplarda delik açıldı. CFC üretimi bu yüzden yasaklandı.',
      ),
      kart(
        'Üç sorun, üç ayrı gaz',
        'Sera gazı ozonu delmez; CFC gezegeni ısıtmaz; asit yağmurunu CO₂ yapmaz. Üç sorunun gazı da sonucu da ayrı. Küresel ısınma: CO₂, CH₄. Ozon azalımı: CFC. Asit yağmuru: SO₂, NOₓ.',
        {
          tur: 'tablo',
          basliklar: ['Sorun', 'Sorumlu gaz'],
          satirlar: [
            ['Küresel ısınma', 'CO₂, CH₄'],
            ['Ozon azalımı', 'CFC’ler'],
            ['Asit yağmuru', 'SO₂, NOₓ'],
          ],
        },
        { etiket: 'Sık hata', not: 'Her sorunu kendi gazıyla eşle; "sera gazı ozonu deliyor" en sık hata.' },
      ),
      kart(
        'Yerdeki ozon zehir, yukarıdaki kalkan',
        'Yazın büyük şehirde egzoz gazları güneşle tepkimeye girip yer seviyesinde ozon üretir; bu ozon akciğeri ve gözü yakar. Aynı gaz 25 km yukarıda koruyucu. Ozonun yararı bulunduğu yere bağlı.',
      ),
      kart(
        'Karbon ayak izi doğaya yükü ölçer',
        'Bir hamburger için yaklaşık 3 kg CO₂ salınır; bir uçak yolculuğu için yüzlerce kg. Karbon ayak izi, yani bir etkinliğin doğaya saldığı sera gazı miktarı. Su ayak izi harcanan suyu ölçer. Azaltmanın ilk adımı ölçmek.',
      ),
      kart(
        'Kimya sorunu geri çevirmeye çalışır',
        'Arabanın egzozundaki katalitik konvertör zehirli NOₓ ve CO\'yu zararsız gaza çevirir. Fabrika bacasında CO₂ yakalanıp yer altına gömülür. CFC\'nin yerine ozonu parçalamayan gazlar bulundu. Sorunu yapan bilim, çözümü de üretiyor.',
      ),
    ], [
      soru('Sera etkisi doğal bir olaydır ve Dünya yı yaşanabilir sıcaklıkta tutar.', true, 'Sorun etkinin kendisi değil, insan kaynaklı gazlarla güçlenmesi.'),
      soru('Stratosferdeki ozon tabakası zararlı morötesi ışınları süzer.', true, 'İncelmesi cilt kanseri riskini artırıyor.'),
      soru('Asit yağmurlarının sebebi ozon tabakasının incelmesidir.', false, 'Sebep kükürt ve azot oksitlerinin havada aside dönüşmesi; iki sorun ayrı.'),
      soru('Ozon bulunduğu her yükseklikte yararlıdır.', false, 'Yer seviyesinde kirletici; yararlı olan stratosferdeki ozon.'),
      sikli('Asit yağmurunu hangi gazlar oluşturur?', ['Kükürt ve azot oksitleri', 'CFC\'ler'], 0, 'CFC ozonu parçalar.'),
      sikli('Yer seviyesindeki ozon nedir?', ['Solunumu bozan kirletici', 'Koruyucu tabaka'], 0, 'Yüksekteki koruyucu.'),
      sikli('Sera etkisinin doğal hâli için ne söylenir?', ['Yaşamı mümkün kılar', 'Zararlıdır'], 0, 'Olmasaydı dünya çok soğuk olurdu.'),
      sikli('Katalitik konvertör neye örnektir?', ['Sorunu geri çevirme çabası', 'Fosil yakıt'], 0, 'Egzoz gazlarını dönüştürür.'),
      soru('Metan bir sera gazıdır.', true, 'CO₂ gibi ısıyı tutar.'),
      sikli('Karbon ayak izi neyi ölçer?', ['Harcanan suyu', 'Salınan sera gazını'], 1, 'Su ayak izi harcanan suyu ölçer.'),
    ], [
      {
        soru: 'Ozon tabakasını parçalayan gazlar hangileridir?',
        siklar: ['Kloroflorokarbonlar (CFC)', 'Karbondioksit'],
        dogru: 0,
        aciklama: {
          dogru: 'CFC\'ler yüksekte klor salar, klor ozonu parçalar; üretimleri bu yüzden kısıtlandı.',
          yanlis: 'CO₂ sera gazıdır, küresel ısınmayla ilgili. Ozonu parçalayan CFC\'ler; üç sorunun gazları ayrı.',
        },
        kart: 5,
      },
    ]),
  ]),
])
