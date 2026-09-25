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
        'Fiziksel mi kimyasal mı?',
        '- **Fiziksel değişim:** madde aynı kalır; yalnızca hâli ya da şekli değişir.\n- **Kimyasal değişim:** yeni bir madde oluşur.',
      ),
      kart(
        'Gözle görülen kanıtlar',
        'Beş gösterge kimyasal değişimi işaret eder.\nHiçbiri tek başına kesin kanıt değildir.',
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
        'Aldatıcı olabilir',
        'Kaynayan suda da kabarcık çıkar ama bu kimyasal değişim değildir.\nTek bir gösterge kanıt sayılmaz.',
        undefined,
        { not: 'Kaynayan suda kabarcık fiziksel, kabartma tozu + sirkede kabarcık kimyasal. Kabarcık tek başına kanıt değil.' },
      ),
      kart(
        'Kesin ölçüt',
        'Sorulacak soru: yeni özellikleri olan bir madde çıktı mı?\nÇıkmadıysa değişim fizikseldir.',
      ),
      kart(
        'Geri dönüşümlü mü?',
        '- **Buzun erimesi:** kolayca geri alınır.\n- **Kâğıdın yanması:** geri gelmez.\nKimyasal değişimi geri almak yeni bir tepkime ister.',
      ),
      kart(
        'Çözünme hangisi?',
        'Tuzun suda çözünmesi **fizikseldir**.\nSu buharlaştırılınca tuz geri alınır, kimliği değişmemiştir.',
      ),
      kart(
        'Renk değişimi',
        '- Demirin paslanması: gri → kırmızı-kahverengi\n- Bakır çatının yeşillenmesi\n- Elmanın kesilince kararması\nRenk değişimi yeni bir madde oluştuğunu düşündürür.',
      ),
      kart(
        'Gaz çıkışı',
        'Karbonata asit eklenince köpürme görülür:\nCaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂\nSirkeyle karbonatın köpürmesi de aynı tepkimedir.',
      ),
      kart(
        'Çökelek oluşumu',
        'İki berrak çözelti karışınca bulanıklık çıkarsa suda çözünmeyen bir katı oluşmuştur.\nAgNO₃ + NaCl → AgCl (beyaz çökelek) + NaNO₃',
      ),
      kart(
        'Isı ve ışık',
        'Yanma, havai fişek ve kibrit çakmak ısı ve ışık saçar.\nAmpulün ışığı ise kimyasal değil fizikseldir; tel değişmeden ışır.',
      ),
    ], [
      soru('Kimyasal değişimin kesin ölçütü yeni bir maddenin oluşmasıdır.', true, 'Gözle görülen belirtiler ipucu; kesin ölçüt bu.'),
      soru('Renk değişimi her zaman kimyasal değişimin göstergesidir.', false, 'Boya karıştırmak gibi fiziksel olaylarda da renk değişebiliyor.'),
      soru('Şekerin suda çözünmesi kimyasal bir değişimdir.', false, 'Şeker şeker olarak kalıyor; bu fiziksel bir değişim.'),
      soru('Gaz çıkışı ve çökelek oluşumu kimyasal değişim belirtilerindendir.', true, 'İkisi de yeni bir maddenin oluştuğuna işaret ediyor.'),
      sikli('Hangisi kimyasal değişimdir?', ['Sütün ekşimesi', 'Buzun erimesi'], 0, 'Ekşiyen sütte yeni maddeler oluşur; buz erise de sudur.'),
      sikli('Yanmış kâğıt neden geri gelmez?', ['Kimyasal değişim geri alınamaz', 'Kâğıt buharlaştı'], 0, 'Geri almak yeni bir tepkime ister.'),
      soru('Demirin paslanması kimyasal bir değişimdir.', true, 'Demir oksijenle birleşip yeni bir madde, demir oksit oluşturuyor.'),
      soru('Sirke ile karbonat karışınca çıkan gaz karbon dioksittir.', true, 'Asit karbonatla tepkimeye girer.'),
      soru('Ampulün ışık vermesi kimyasal değişimdir.', false, 'Tel değişmeden ışır; fiziksel.'),
      soru('İki berrak çözeltinin karışınca bulanıklaşması çökelek oluştuğunu gösterebilir.', true, 'Çözünmeyen katı oluşmuş.'),
      sikli('AgNO₃ ile NaCl karışınca oluşan beyaz katı?', ['AgCl', 'NaNO₃'], 0, 'NaNO₃ suda çözünür.'),
      sikli('Hangisi kimyasal değişim belirtisi olabilir?', ['Renk değişimi', 'Şekil değişimi'], 0, 'Şekil değişimi fizikseldir.'),
    ], [
      {
        soru: 'Kaynayan suda kabarcık çıkması kimyasal değişim midir?',
        siklar: ['Hayır, hâl değişimi', 'Evet, gaz çıkışı var'],
        dogru: 0,
        aciklama: {
          dogru: 'Kabarcık su buharı; yeni madde yok. Gaz çıkışı tek başına kanıt değil.',
          yanlis: 'Kabarcıklar su buharıdır, yeni madde oluşmadı. Gösterge tek başına kanıt sayılmaz; kesin ölçüt yeni maddedir.',
        },
        kart: 3,
      },
    ]),
    konu('kim10-olusum', 'Kimyasal Tepkimelerin Oluşumu', [
      kart(
        'Bağlar kopar, yenisi kurulur',
        'Tepkimede atomlar yok olmaz.\nAralarındaki bağlar kopar, atomlar yeniden düzenlenir.',
      ),
      kart(
        'Kütle korunur',
        'Girenlerin toplam kütlesi = ürünlerin toplam kütlesi\nHer elementin atom sayısı iki tarafta da aynıdır.',
      ),
      kart(
        'Enerji alışverişi',
        '- **Bağ kırmak:** enerji ister.\n- **Bağ kurmak:** enerji verir.\nAradaki fark tepkimenin ısı alıp vermesini belirler.',
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
        'Ekzotermik ve endotermik',
        '- **Ekzotermik:** ısı verir, ortam ısınır.\n- **Endotermik:** ısı alır, ortam soğur.',
      ),
      kart(
        'Çarpışma gerekir',
        'Tanecikler yeterli enerjiyle ve uygun yönde çarpışmazsa tepkime olmaz.\nIsıtmak bu yüzden tepkimeyi hızlandırır.',
      ),
      kart(
        'Aktivasyon enerjisi',
        'Tepkimenin başlaması için aşılması gereken eşiktir.\nKatalizör bu eşiği düşürür, tepkimenin kendisini değiştirmez.',
      ),
      kart(
        'Hızı etkileyen etmenler',
        '- Sıcaklık\n- Derişim\n- Temas yüzeyi\n- Katalizör\nDördü de çarpışma sayısını ya da başarısını artırır.',
      ),
      kart(
        'Katalizör ne yapar, ne yapmaz?',
        '- **Yapar:** aktivasyon enerjisini düşürür, tepkimeyi hızlandırır.\n- **Yapmaz:** ürün miktarını ve tepkime ısısını değiştirmez.\nTepkimeden harcanmadan çıkar.',
        undefined,
        { not: 'Katalizör aktivasyon enerjisini düşürür; ürün miktarını ve ΔH\'yi değiştirmez, tepkimeden aynen çıkar.' },
      ),
      kart(
        'Enerji diyagramı',
        '- **Ekzotermik:** ürünler girenlerden aşağıda, fark ısı olarak açığa çıkar.\n- **Endotermik:** ürünler yukarıda, fark dışarıdan alınır.\nİkisinde de önce aktivasyon tepesi aşılır.',
      ),
      kart(
        'Etkin çarpışma',
        'Her çarpışma tepkime doğurmaz. İki şart gerekir:\n- Yeterli enerji (aktivasyon enerjisi kadar)\n- Uygun yönelim',
      ),
      kart(
        'Örneklerle ısı alışverişi',
        '- **Ekzotermik:** yanma, solunum, nötralleşme\n- **Endotermik:** fotosentez, suyun elektrolizi, kireç taşının ayrışması',
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
      soru('Aktivasyon enerjisi yüksek olan tepkime daha hızlı gerçekleşir.', false, 'Eşik yüksekse daha az çarpışma onu aşar; tepkime yavaşlar.'),
      soru('Temas yüzeyi arttıkça tepkime hızlanır.', true, 'Toz şeker küp şekerden hızlı yanar.'),
      soru('Fotosentez endotermik bir tepkimedir.', true, 'Güneş enerjisi alınır.'),
      soru('Her çarpışma tepkimeyle sonuçlanır.', false, 'Yeterli enerji ve uygun yönelim gerekir.'),
      soru('Ekzotermik tepkimede ürünlerin enerjisi girenlerinkinden düşüktür.', true, 'Fark ısı olarak açığa çıkar.'),
      sikli('Hangisi ekzotermiktir?', ['Solunum', 'Suyun elektrolizi'], 0, 'Elektroliz enerji ister.'),
    ], [
      {
        soru: 'Tepkime sırasında ortam soğuyorsa tepkime nasıldır?',
        siklar: ['Ekzotermik', 'Endotermik'],
        dogru: 1,
        aciklama: {
          dogru: 'Tepkime ortamdan ısı alıyor; ortam bu yüzden soğuyor.',
          yanlis: 'Ekzotermik tepkime ısı verir ve ortamı ısıtır. Soğuyan ortam tepkimenin ısı aldığını, endotermik olduğunu gösterir.',
        },
        kart: 4,
      },
      {
        soru: 'Etkin çarpışma için yeterli enerjinin yanında ne gerekir?',
        siklar: ['Uygun yönelim', 'Yüksek basınç'],
        dogru: 0,
        aciklama: {
          dogru: 'Tanecikler doğru yüzleriyle çarpışmalıdır.',
          yanlis: 'Basınç çarpışma sayısını artırır ama şart değildir. Etkin çarpışma uygun yönelim ister.',
        },
        kart: 10,
      },
    ]),
    konu('kim10-tur', 'Kimyasal Tepkime Türleri', [
      kart(
        'Yanma tepkimeleri',
        'Madde oksijenle birleşir; ısı ve ışık açığa çıkar.\nOrganik maddenin yanmasında ürünler CO₂ ve H₂O’dur.',
      ),
      kart(
        'Tam ve eksik yanma',
        '- **Oksijen yeterliyse:** CO₂ çıkar.\n- **Oksijen yetersizse:** zehirli CO ve is oluşur.\nSoba zehirlenmelerinin sebebi budur.',
      ),
      kart(
        'Yanma denklemi',
        '**Hidrokarbon + O₂ → CO₂ + H₂O**\nÖrnek: CH₄ + 2O₂ → CO₂ + 2H₂O\nSınavda en sık denkleştirilen tepkimedir.',
      ),
      kart(
        'Asit-baz tepkimesi',
        '**Asit + baz → tuz + su**\nNötrleşme de denir; mide ilacı bu ilkeyle çalışır.',
      ),
      kart(
        'Çökelme tepkimesi',
        'İki çözelti karışınca suda çözünmeyen bir katı oluşur.\nOluşan katıya **çökelek** denir.',
      ),
      kart(
        'Redoks tepkimesi',
        'Elektron alışverişi vardır:\n- **Elektron veren:** yükseltgenir.\n- **Elektron alan:** indirgenir.\nÖrnek: paslanma, pil tepkimeleri',
      ),
      kart(
        'Sentez ve analiz',
        '- **Sentez:** birden çok madde birleşip tek ürün verir.\n- **Analiz:** tek madde parçalanır.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Kalıp'],
          satirlar: [
            ['Sentez', 'A + B → AB'],
            ['Analiz', 'AB → A + B'],
            ['Yer değiştirme', 'A + BC → AC + B'],
          ],
        },
      ),
      kart(
        'Yer değiştirme',
        'Aktif bir element, bileşikteki daha az aktif elementin yerini alır.\nTepkimenin yönünü aktiflik sırası söyler.',
      ),
      kart(
        'Türü nasıl tanırsın?',
        '- **O₂ girip CO₂ çıkıyorsa:** yanma\n- **Asit + baz → tuz + su:** nötrleşme\n- **Ürün (k) ise:** çökelme\n- **Yükseltgenme sayıları değişiyorsa:** redoks',
        undefined,
        { not: 'Zn + 2HCl → ZnCl₂ + H₂: yer değiştirme ve aynı zamanda redoks (Zn yükseltgendi). Bir denklem iki türe girebilir.' },
      ),
      kart(
        'Nötralleşme',
        'Asit + baz → tuz + su\nHCl + NaOH → NaCl + H₂O\nMide ekşimesinde alınan antiasit de bir nötralleşmedir.',
      ),
      kart(
        'Aktiflik sırası',
        'K > Na > Ca > Mg > Al > Zn > Fe > (H) > Cu > Ag > Au\nSoldaki metal, sağdakini bileşiğinden çıkarır.\nH’den sonrakiler asitten hidrojen açığa çıkarmaz.',
      ),
      kart(
        'Yükseltgenme ve indirgenme',
        '- **Yükseltgenme:** elektron vermek, yükseltgenme sayısı artar.\n- **İndirgenme:** elektron almak, sayı azalır.\nZn + Cu²⁺ → Zn²⁺ + Cu: çinko yükseltgenir, bakır indirgenir.',
      ),
    ], [
      soru('Yanma tepkimeleri ekzotermiktir.', true, 'Isı ve ışık açığa çıkıyor.'),
      soru('Eksik yanmada karbon monoksit ve is oluşabilir.', true, 'Oksijen yetersizse yanma tamamlanmıyor.'),
      soru('Nötrleşme tepkimesinde her zaman gaz açığa çıkar.', false, 'Asit ile bazın tepkimesinden tuz ve su oluşur; gaz her durumda çıkmaz.'),
      soru('Redoks tepkimelerinde elektron alışverişi olmaz.', false, 'Tanımı tam da elektron alışverişine dayanıyor.'),
      sikli('Zn + CuSO₄ → ZnSO₄ + Cu hangi türdür?', ['Nötrleşme', 'Yer değiştirme'], 1, 'Aktif çinko, bakırın yerini alıyor.'),
      sikli('İki çözelti karışınca oluşan çözünmeyen katıya ne denir?', ['Çökelek', 'Katalizör'], 0, 'Çökelme tepkimesi.'),
      sikli('Elektron veren madde ne olur?', ['Yükseltgenir', 'İndirgenir'], 0, 'Alan indirgenir.'),
      sikli('CH₄ + 2O₂ → CO₂ + 2H₂O hangi türdür?', ['Yanma', 'Nötrleşme'], 0, 'Hidrokarbon + O₂.'),
      sikli('Tek maddenin parçalanmasına ne denir?', ['Sentez', 'Analiz'], 1, 'Sentezde birden çok madde birleşir.'),
      soru('Paslanma bir redoks tepkimesidir.', true, 'Demir elektron verir.'),
      soru('Asit ile bazın tepkimesinde tuz ve su oluşur.', true, 'Nötralleşme.'),
      soru('Bakır seyreltik HCl\'den hidrojen gazı açığa çıkarır.', false, 'Cu, aktiflik sırasında H\'den sonra gelir.'),
      soru('Elektron veren tanecik yükseltgenir.', true, 'Yükseltgenme sayısı artar.'),
      sikli('Zn, CuSO₄ çözeltisine atılırsa?', ['Cu açığa çıkar', 'Tepkime olmaz'], 0, 'Zn daha aktif.'),
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
      {
        soru: 'Zn + Cu²⁺ → Zn²⁺ + Cu tepkimesinde indirgenen?',
        siklar: ['Cu²⁺', 'Zn'],
        dogru: 0,
        aciklama: {
          dogru: 'Cu²⁺ elektron alıp Cu olur: indirgenir.',
          yanlis: 'Zn elektron verip Zn²⁺ olur; yükseltgenen o. İndirgenen Cu²⁺.',
        },
        kart: 12,
      },
    ]),
    konu('kim10-mol', 'Mol Kavramı', [
      kart(
        'Mol nedir?',
        'Tanecik saymanın birimidir.\n**1 mol = 6,02 × 10²³ tanecik**\nBu sayıya Avogadro sayısı denir.',
      ),
      kart(
        'Neden gerekli?',
        'Atomlar tek tek tartılamaz.\nMol, laboratuvarda tartılan gramı tanecik sayısına çeviren köprüdür.',
      ),
      kart(
        'Molar kütle',
        '1 molün gram cinsinden kütlesidir.\nSayıca atom ya da molekül kütlesine eşittir: su için 18 g/mol',
      ),
      kart(
        'Molar kütle hesabı',
        'Atom kütleleri alt indisle çarpılıp toplanır:\n- **H₂SO₄:** 2·1 + 32 + 4·16 = 98 g/mol\n- **CO₂:** 12 + 2·16 = 44 g/mol',
      ),
      kart(
        'Gazlarda molar hacim',
        'Normal şartlarda (0 °C, 1 atm) her gazın 1 molü **22,4 L** yer kaplar.\nGazın cinsi fark etmez.',
      ),
      kart(
        'Üç yönlü çevrim',
        'Kütle, mol ve tanecik sayısı arasında gidip gelmenin tek yolu:\nher zaman önce **mole** çevir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Kütle (g)' },
            { ad: 'Mol', renk: 'ikincil' },
            { ad: 'Tanecik' },
          ],
        },
        { not: '36 g su → ÷18 = 2 mol → ×6,02·10²³ = 12,04·10²³ molekül. Gram ↔ tanecik geçişi her zaman moldan.' },
      ),
      kart(
        'Formülden mol',
        '1 mol H₂SO₄ içinde:\n- 2 mol H atomu\n- 1 mol S atomu\n- 4 mol O atomu',
      ),
      kart(
        'Mol bir sayıdır',
        'Düzine gibi düşünülebilir:\n- **1 düzine:** 12 tane\n- **1 mol:** 6,02 × 10²³ tane',
      ),
      kart(
        'Hızlı örnekler',
        '- **36 g su:** 2 mol = 12,04 × 10²³ molekül\n- **11,2 L O₂ (NŞA):** 0,5 mol = 16 g\n- **3 mol CO₂:** 6 mol O atomu',
      ),
      kart(
        'Gaz yoğunluğundan molar kütle',
        '**Molar kütle = yoğunluk (g/L) × 22,4**\nNŞA’da yoğunluğu 1,25 g/L olan gaz: 28 g/mol, azot',
      ),
      kart(
        'Sık hata',
        'Hacim gazın cinsine bağlı değil, kütle bağlı:\n- **1 mol He:** 4 g, 22,4 L\n- **1 mol O₂:** 32 g, 22,4 L',
      ),
      kart(
        'Molekülde kaç mol atom?',
        '1 mol H₂O’da 2 mol H ve 1 mol O, toplam 3 mol atom vardır.\n0,5 mol CO₂’de 1,5 mol atom bulunur.',
      ),
    ], [
      soru('1 mol madde 6,02 · 10²³ tanecik içerir.', true, 'Bu sayıya Avogadro sayısı deniyor.'),
      soru('Normal koşullarda 1 mol gaz 22,4 litre hacim kaplar.', true, 'Gazın cinsi değişse de bu hacim aynı.'),
      soru('Mol bir kütle birimidir.', false, 'Mol bir sayı birimi: belirli sayıda tanecik demek.'),
      soru('Farklı iki maddenin birer molünün kütleleri eşittir.', false, 'Tanecik sayıları eşit ama tanecik kütleleri farklı.'),
      sikli('1 mol H₂SO₄ kaç gramdır? (H:1, S:32, O:16)', ['98', '49'], 0, '2·1 + 32 + 4·16 = 98 g.'),
      sikli('CO₂\'nin molar kütlesi? (C:12, O:16)', ['44 g/mol', '28 g/mol'], 0, '12 + 2·16.'),
      sikli('36 g su kaç moldür?', ['2', '36'], 0, 'Molar kütle 18.'),
      sikli('11,2 L O₂ (NŞA) kaç gramdır?', ['16', '32'], 0, '0,5 mol × 32.'),
      sikli('3 mol CO₂\'de kaç mol O atomu vardır?', ['3', '6'], 1, 'Her molde 2 mol O.'),
      sikli('Yoğunluğu 1,25 g/L olan gazın molar kütlesi (NŞA)?', ['22,4', '28'], 1, '1,25 × 22,4.'),
      sikli('Mol kavramına neden ihtiyaç duyulur?', ['Atomlar görünmediği için', 'Atomlar tek tek tartılamadığı için'], 1, 'Mol, tartılan gramı tanecik sayısına çeviren köprü.'),
      soru('1 mol demir ile 1 mol su aynı sayıda tanecik içerir.', true, 'Mol bir sayıdır.'),
      soru('1 mol CH₄ molekülünde 5 mol atom vardır.', true, '1 C + 4 H.'),
      sikli('2 mol NH₃ kaç mol H atomu içerir?', ['6', '3'], 0, 'Her molekülde 3 H.'),
    ], [
      {
        soru: 'Normal şartlarda 1 mol ideal gaz kaç litre yer kaplar?',
        siklar: ['22,4 L', '18 L'],
        dogru: 0,
        aciklama: {
          dogru: '0 °C ve 1 atm\'de her ideal gazın 1 molü 22,4 L; gazın cinsi fark etmez.',
          yanlis: '18, suyun molar kütlesi (g/mol). Gazların molar hacmi normal şartlarda 22,4 litre.',
        },
        kart: 5,
      },
      {
        soru: '1 mol H₂SO₄ içinde kaç mol O atomu vardır?',
        siklar: ['4', '1'],
        dogru: 0,
        aciklama: {
          dogru: 'Alt indis mol oranını verir: her molekülde 4 O, her molde 4 mol O.',
          yanlis: '1 mol molekül var ama her molekülde 4 oksijen atomu; alt indis mol oranını verir: 4 mol O.',
        },
        kart: 7,
      },
    ]),
    konu('kim10-denklestirme', 'Kimyasal Tepkime Denklemlerinin Denkleştirilmesi', [
      kart(
        'Neden denkleştirilir?',
        'Atom yoktan var olmaz, yok da olmaz.\nİki tarafta her elementin atom sayısı eşit olmalıdır.',
      ),
      kart(
        'Katsayı değişir, indis değişmez',
        'Alt indise dokunulmaz; değiştirmek maddeyi değiştirir.\nYalnızca formülün önündeki **katsayı** büyütülür.',
        undefined,
        { not: 'H₂ + O₂ → H₂O: \'H₂O₂\' yazamazsın. Doğrusu 2H₂ + O₂ → 2H₂O. İndis değişirse madde değişir.' },
      ),
      kart(
        'İzlenecek sıra',
        'Sıra keyfî değildir.\nEn sona bırakılanlar birden çok bileşikte geçtiği için en esnek olanlardır.',
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
        'Hâl gösterimi',
        '- **(k):** katı\n- **(s):** sıvı\n- **(g):** gaz\n- **(suda):** sulu çözelti',
      ),
      kart(
        'Denetleme',
        'Bittiğinde her element için iki taraf tek tek sayılır.\nBir tanesi tutmuyorsa denklem denk değildir.',
      ),
      kart(
        'Kesirli katsayı',
        'Ara adımda kesir kullanılabilir.\nSonunda bütün denklem uygun sayıyla çarpılıp tam sayıya çevrilir.',
      ),
      kart(
        'Çözümlü örnek',
        'Fe + O₂ → Fe₂O₃\n- Önce Fe: 2Fe\n- Sonra O: 3/2 O₂\n- Tümü 2 ile çarpılır: **4Fe + 3O₂ → 2Fe₂O₃**',
      ),
      kart(
        'Örnek: propanın yanması',
        'C₃H₈ + O₂ → CO₂ + H₂O\n- Önce C: 3CO₂\n- Sonra H: 4H₂O\n- En son O: 6 + 4 = 10 → 5O₂\nC₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
      ),
      kart(
        'Örnek: demirin paslanması',
        'Fe + O₂ → Fe₂O₃\nO’yu eşitlemek için 3O₂ ve 2Fe₂O₃ yazılır, sonra Fe: 4\n**4Fe + 3O₂ → 2Fe₂O₃**',
      ),
      kart(
        'İyonlu denklemde yük',
        'Atom sayısının yanında yük toplamı da iki tarafta eşit olmalıdır.\nZn + 2Ag⁺ → Zn²⁺ + 2Ag: iki taraf da +2',
      ),
      kart(
        'Sık yapılan hatalar',
        '- İndisi değiştirmek (H₂O’yu H₂O₂ yapmak)\n- Katsayıları sadeleştirmeyi unutmak\n- Oksijeni en başta denkleştirip sonra bozmak',
      ),
    ], [
      soru('Denkleştirme yapılırken formüllerdeki indisler değiştirilebilir.', false, 'İndis değişirse madde değişir; yalnızca katsayılar değiştirilir.'),
      soru('Denkleştirme, kütlenin korunumu yasasının bir gereğidir.', true, 'İki tarafta her elementin atom sayısı eşit olmalı.'),
      soru('Denklemdeki (k), (s), (g) gösterimleri maddenin fiziksel hâlini belirtir.', true, 'Katı, sıvı ve gaz hâlleri böyle yazılıyor.'),
      soru('Denkleştirmede kesirli katsayı hiçbir şekilde kullanılamaz.', false, 'Ara adımda kullanılabilir; sonunda tamamı genişletilip tam sayıya çevrilir.'),
      sikli('Denklemde (suda) ne demektir?', ['Sıvı hâl', 'Sulu çözelti'], 1, 'Sıvı için (s).'),
      sikli('4Fe + 3O₂ → 2Fe₂O₃ denkleminde O₂ katsayısı kaç?', ['2', '3'], 1, '6 O atomu iki tarafta.'),
      sikli('Denkleştirmede en sona bırakılan element hangisidir?', ['İlk yazılan', 'Birden çok bileşikte geçen'], 1, 'En esnek olan sona kalır.'),
      soru('2H₂ + O₂ → 2H₂O denkleminde iki tarafta da 4 H atomu vardır.', true, 'Solda 2·2 = 4, sağda 2·2 = 4 hidrojen.'),
      soru('Denkleştirmede formüldeki indisler değiştirilebilir.', false, 'İndis değişirse madde değişir; yalnız katsayı.'),
      soru('İyonlu denklemde yük toplamları iki tarafta eşit olmalıdır.', true, 'Yük de korunur.'),
      soru('C₃H₈\'in tam yanmasında O₂\'nin katsayısı 5\'tir.', true, '6 + 4 = 10 O atomu.'),
      sikli('4Fe + 3O₂ → 2Fe₂O₃ denkleminde katsayılar toplamı?', ['9', '7'], 0, '4 + 3 + 2.'),
      sikli('Yanma denkleminde hangi element en son denkleştirilir?', ['O', 'C'], 0, 'O hem CO₂\'de hem H₂O\'da.'),
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
      {
        soru: 'CH₄ + O₂ → CO₂ + H₂O denkleminde O₂\'nin katsayısı?',
        siklar: ['2', '1'],
        dogru: 0,
        aciklama: {
          dogru: 'CH₄ + 2O₂ → CO₂ + 2H₂O: sağda 2 + 2 = 4 O.',
          yanlis: '1 ile sağdaki 4 O atomu dengelenmez. Katsayı 2.',
        },
        kart: 8,
      },
    ]),
    konu('kim10-hesap', 'Kimyasal Hesaplamalar', [
      kart(
        'Katsayılar oran verir',
        'Denkleştirilmiş denklemdeki katsayılar **mol oranıdır**.\nBütün hesaplar bu orandan yürür.',
      ),
      kart(
        'Hesabın yolu',
        'Her stokiyometri sorusu aynı üç adımdan geçer.\nOrtadaki adım atlanamaz.',
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
        'Çözümlü örnek',
        '2H₂ + O₂ → 2H₂O; 4 g H₂ kaç g su verir?\n- 4 g H₂ = 2 mol\n- Oran 2 : 2 → 2 mol su\n- 2 mol su = 36 g',
      ),
      kart(
        'Sınırlayıcı bileşen',
        'Önce biten madde tepkimeyi durdurur; ürün miktarını o belirler.\nÖteki maddenin fazlası artar, tepkimeye giremez.',
        undefined,
        { not: '2H₂ + O₂: 4 mol H₂ ve 1 mol O₂ verildi → O₂ sınırlayıcı, 2 mol su oluşur, 2 mol H₂ artar.' },
      ),
      kart(
        'Nasıl bulunur?',
        'Her giren madde için: mol sayısı / katsayı\nEn küçük değeri veren madde **sınırlayıcıdır**.',
      ),
      kart(
        'Yüzde verim',
        '**Verim = gerçek ürün / teorik ürün × 100**\nKayıplar yüzünden pratikte %100’e ulaşılmaz.',
      ),
      kart(
        'Neden verim düşük?',
        '- Yan tepkimeler\n- Geri dönüşlü tepkimeler\n- Aktarma sırasındaki kayıplar',
      ),
      kart(
        'Gaz hacmiyle hesap',
        'NŞA’da mol sayısı = hacim / 22,4\nAynı koşuldaki gazlarda katsayı oranı doğrudan hacim oranıdır: 2 L H₂ için 1 L O₂',
      ),
      kart(
        'Kütleden kütleye',
        '2H₂ + O₂ → 2H₂O\n4 g H₂ = 2 mol → 2 mol H₂O = 36 g\nYol: kütle → mol → oran → mol → kütle',
      ),
      kart(
        'Artan madde',
        '3 mol H₂ ile 1 mol O₂ tepkimeye girerse:\nO₂ 2 mol H₂ harcar; 1 mol H₂ artar.\nÜrün hesabı sınırlayıcı olan O₂’ye göre yapılır: 2 mol H₂O',
      ),
      kart(
        'Saflık',
        'Numune saf değilse yalnız saf kısım tepkimeye girer.\n%80 saflıkta 100 g CaCO₃ → 80 g CaCO₃ = 0,8 mol',
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
      soru('Sınırlayıcı bileşen, mol sayısı / katsayı değeri en küçük olan maddedir.', true, 'En az "tepkime payı" olan madde önce biter.'),
      soru('Ürün miktarı sınırlayıcı bileşene göre hesaplanır.', true, 'Önce biten madde tepkimeyi durdurur.'),
      soru('%50 saflıktaki 20 g numunede 20 g madde tepkimeye girer.', false, 'Yalnız saf kısım: 10 g.'),
      sikli('2H₂ + O₂ → 2H₂O. 8 g H₂ ile kaç mol su oluşur?', ['4', '8'], 0, '8 g H₂ = 4 mol; oran 1:1.'),
      sikli('N₂ + 3H₂ → 2NH₃. 2 mol N₂ ve 3 mol H₂ varsa sınırlayıcı?', ['H₂', 'N₂'], 0, '2 mol N₂ için 6 mol H₂ gerekir.'),
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
      {
        soru: '2 mol H₂ ve 2 mol O₂ ile 2H₂ + O₂ → 2H₂O tepkimesinde artan?',
        siklar: ['1 mol O₂', '1 mol H₂'],
        dogru: 0,
        aciklama: {
          dogru: '2 mol H₂, 1 mol O₂ harcar; 1 mol O₂ artar.',
          yanlis: 'H₂ tümüyle harcanır (sınırlayıcı). Artan 1 mol O₂.',
        },
        kart: 10,
      },
    ]),
    konu('kim10-gaz-ozellik', 'Gazların Özellikleri ve Kinetik Moleküler Teori', [
      kart(
        'Gazın dört değişkeni',
        '- **P:** basınç\n- **V:** hacim\n- **T:** sıcaklık\n- **n:** mol sayısı',
      ),
      kart(
        'Kinetik moleküler teori',
        '- Tanecikler sürekli ve rastgele hareket eder.\n- Aralarındaki boşluk, kendi hacimlerinden çok büyüktür.\n- Çarpışmalar esnektir.',
      ),
      kart(
        'Basınç nereden gelir?',
        'Taneciklerin kap çeperine çarpmasından gelir.\nTanecik sayısı ya da hızı arttıkça basınç artar.',
        undefined,
        { not: 'Kap yarıya inerse çarpma 2 kat → basınç 2 kat (Boyle). Sıcaklık artarsa hızlı çarpma → basınç artar (Gay-Lussac).' },
      ),
      kart(
        'Sıcaklık ve hız',
        'Mutlak sıcaklık, taneciklerin ortalama kinetik enerjisiyle doğru orantılıdır.\nHesaplarda **Kelvin** kullanılır.',
      ),
      kart(
        'Gazın üç özelliği',
        '- Bulunduğu kabı tümüyle doldurur.\n- Kolayca sıkıştırılır.\n- Her yöne aynı basıncı uygular.',
      ),
      kart(
        'Neden sıkışır?',
        'Tanecikler arasındaki boşluk, taneciklerin kendi hacminden çok büyüktür.\nKatı ve sıvıda bu boşluk yok denecek kadar azdır.',
      ),
      kart(
        'Basınç birimleri',
        '1 atm = 76 cmHg = 760 mmHg = 101,3 kPa\nmmHg’ye torr da denir.',
      ),
      kart(
        'Normal koşullar',
        '- **Normal koşul (NK):** 0 °C, 1 atm; 1 mol gaz 22,4 L\n- **Oda koşulu:** 25 °C, 1 atm; 1 mol gaz ≈ 24,5 L',
      ),
      kart(
        'Gazlar her oranda karışır',
        'Gaz tanecikleri arasında büyük boşluk olduğu için gazlar her oranda homojen karışır.\nHava böyle bir çözeltidir: %78 N₂, %21 O₂',
      ),
      kart(
        'Hacim kabın hacmidir',
        'Gaz bulunduğu kabı tümüyle doldurur.\nAynı miktar gaz büyük kaba konunca hacmi büyür, basıncı düşer.',
      ),
    ], [
      soru('Bir gazın durumunu basınç, hacim, sıcaklık ve mol sayısı belirler.', true, 'Dördü birbirine bağlı olarak değişiyor.'),
      soru('Gaz basıncı, taneciklerin kabın çeperlerine çarpmasından kaynaklanır.', true, 'Çarpışma sayısı ve şiddeti arttıkça basınç artıyor.'),
      soru('Sıcaklık arttıkça gaz taneciklerinin ortalama hızı azalır.', false, 'Sıcaklık taneciklerin ortalama kinetik enerjisinin ölçüsü; hız artar.'),
      soru('Gazlar sıkıştırılamaz.', false, 'Tanecikler arasındaki boşluk büyük olduğu için kolayca sıkışırlar.'),
      sikli('Gaz hesaplarında sıcaklık hangi birimle alınır?', ['Santigrat', 'Kelvin'], 1, 'Mutlak sıcaklık ortalama kinetik enerjiyle orantılı.'),
      sikli('Gazın bulunduğu kabı tümüyle doldurmasının sebebi?', ['Taneciklerin ağırlığı', 'Taneciklerin sürekli, rastgele hareketi'], 1, 'Tanecikler her yöne hareket eder ve kabın her yerine ulaşır.'),
      soru('Kinetik teoriye göre gaz çarpışmaları esnektir.', true, 'Enerji kaybı yok.'),
      soru('Normal koşullarda 1 mol gaz 22,4 L hacim kaplar.', true, '0 °C ve 1 atm.'),
      soru('1 atm 76 mmHg\'dir.', false, '76 cmHg = 760 mmHg.'),
      soru('Gazlar her oranda homojen karışır.', true, 'Tanecikler arası boşluk büyük.'),
      sikli('Havanın yüzde kaçı azottur?', ['%78', '%21'], 0, '%21 oksijen.'),
      sikli('Gaz büyük bir kaba aktarılırsa basıncı?', ['Düşer', 'Artar'], 0, 'Çarpışma sıklığı azalır.'),
    ], [
      {
        soru: 'Gazın basıncı nereden gelir?',
        siklar: ['Taneciklerin ağırlığından', 'Taneciklerin çepere çarpmasından'],
        dogru: 1,
        aciklama: {
          dogru: 'Her çarpma çepere kuvvet uygular; sık ve hızlı çarpma büyük basınç.',
          yanlis: 'Gaz her yöne aynı basıncı uygular, ağırlık aşağı yönlü olurdu. Basınç taneciklerin çepere çarpmasından gelir.',
        },
        kart: 3,
      },
    ]),
    konu('kim10-gaz-yasa', 'Gaz Yasaları', [
      kart(
        'Boyle yasası',
        'Sabit sıcaklıkta basınç ile hacim **ters orantılıdır**.\nŞırıngayı sıkıştırmak günlük bir örnektir.',
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
        'Charles yasası',
        'Sabit basınçta hacim ile mutlak sıcaklık **doğru orantılıdır**.\nIsınan balon şişer.',
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
        'Gay-Lussac yasası',
        'Sabit hacimde basınç ile mutlak sıcaklık **doğru orantılıdır**.\nIsınan kapalı kap patlayabilir.',
      ),
      kart(
        'Avogadro yasası',
        'Aynı sıcaklık ve basınçta, eşit hacimli gazlarda eşit sayıda tanecik vardır.',
      ),
      kart(
        'Dördünün özeti',
        'Her yasa bir değişkeni sabit tutar.\nKalan ikisi arasındaki ilişkiyi söyler.',
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
        'Neden Kelvin?',
        'Santigratta sıfır keyfî bir noktadır.\nOrantı ancak mutlak sıfırdan başlayan ölçekte doğru çalışır.',
        undefined,
        { not: '27 °C → 300 K, 127 °C → 400 K. \'27\'den 54\'e sıcaklık 2 kat\' yanlış; 300\'den 327\'ye, yalnızca %9 artış.' },
      ),
      kart(
        'Hesap kalıbı',
        '**P₁V₁ / T₁ = P₂V₂ / T₂**\nSabit olanı at, kalanı oranla.\nSıcaklık her zaman Kelvin: °C + 273',
      ),
      kart(
        'Boyle örneği',
        'Sabit sıcaklıkta 3 atm’de 2 L olan gaz 1 L’ye sıkıştırılırsa:\nP₁V₁ = P₂V₂ → 3 · 2 = P₂ · 1 → P₂ = 6 atm',
      ),
      kart(
        'Charles örneği',
        'Sabit basınçta 300 K’de 2 L olan gaz 600 K’e ısıtılırsa:\nV₁/T₁ = V₂/T₂ → V₂ = 4 L\n°C ile değil kelvinle hesaplanır.',
      ),
      kart(
        'Birleşik gaz yasası',
        '**P₁V₁ / T₁ = P₂V₂ / T₂**\nMiktar sabitse üç değişken birlikte değiştiğinde kullanılır.',
      ),
      kart(
        'Gündelik örnekler',
        '- Yazın araç lastiğinin basıncı artar (Gay-Lussac).\n- Buzdolabına konan balon büzülür (Charles).\n- Şırınga ucu kapatılıp itilince basınç artar (Boyle).',
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
      soru('Boyle yasasında sabit tutulan değişken sıcaklıktır.', true, 'Sabit sıcaklıkta basınç ile hacim ters orantılı.'),
      soru('Gaz yasalarında sıcaklık Celsius cinsinden kullanılır.', false, 'Kelvin kullanılır; sıfır noktası farklı olduğu için Celsius ile orantı bozulur.'),
      soru('Avogadro yasasına göre aynı koşullarda eşit hacimli gazlar eşit sayıda tanecik içerir.', true, 'Gazın cinsi sonucu değiştirmiyor.'),
      sikli('Sabit basınçta 300 K\'deki 6 L gaz 600 K\'e ısıtılırsa hacmi?', ['12 L', '3 L'], 0, 'Charles: mutlak sıcaklık iki katına çıkınca hacim de iki katına çıkar.'),
      sikli('Isınan kapalı kabın patlaması hangi yasayı anlatır?', ['Boyle', 'Gay-Lussac'], 1, 'Sabit hacimde basınç sıcaklıkla artar.'),
      sikli('127 °C kaç kelvindir?', ['127', '400'], 1, 'T(K) = °C + 273.'),
      soru('Gazın sıcaklığı 27 °C\'den 54 °C\'ye çıkarsa mutlak sıcaklığı iki katına çıkar.', false, '300 K\'den 327 K\'e çıkar; artış yalnızca %9.'),
      soru('Sabit sıcaklıkta hacim yarıya inerse basınç iki katına çıkar.', true, 'Boyle.'),
      soru('Charles hesabında sıcaklık °C olarak kullanılabilir.', false, 'Kelvin kullanılır.'),
      soru('Yazın araç lastiğinin basıncının artması Gay-Lussac yasasıyla açıklanır.', true, 'Hacim sabit, sıcaklık artıyor.'),
      sikli('2 atm\'de 6 L gaz, sabit sıcaklıkta 3 atm\'ye çıkarsa hacmi?', ['4 L', '9 L'], 0, '2 · 6 = 3 · V.'),
      sikli('Buzdolabındaki balonun büzülmesi hangi yasa?', ['Charles', 'Boyle'], 0, 'Sabit basınçta sıcaklık düşünce hacim azalır.'),
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
      {
        soru: 'Sabit basınçta 200 K\'de 3 L gaz 400 K\'e ısıtılırsa hacmi?',
        siklar: ['6 L', '1,5 L'],
        dogru: 0,
        aciklama: {
          dogru: 'V/T sabit: sıcaklık iki katı, hacim iki katı.',
          yanlis: 'Isınan gaz genleşir; hacim küçülmez. V₂ = 6 L.',
        },
        kart: 9,
      },
    ]),
    konu('kim10-ideal', 'İdeal Gaz Yasası', [
      kart(
        'PV = nRT',
        'Dört değişkeni tek denklemde birleştirir.\nR gaz sabitidir; değeri birim seçimine göre değişir.',
      ),
      kart(
        'Hesap örneği',
        '2 mol gaz, 300 K, 22,4 L kap:\n**P = nRT / V = 2 · 0,082 · 300 / 22,4 ≈ 2,2 atm**\nR = 0,082 L·atm/(mol·K)',
      ),
      kart(
        'Öteki yasaları içerir',
        'İki değişken sabit tutulunca denklem öteki yasalara dönüşür:\n- **n ve T sabit:** Boyle\n- **n ve P sabit:** Charles\n- **n ve V sabit:** Gay-Lussac',
      ),
      kart(
        'Sıcaklık Kelvin',
        'Denklemde sıcaklık mutlak olmalıdır.\nSantigrat kullanmak sonucu doğrudan yanlış çıkarır.',
      ),
      kart(
        'İdeallikten sapma',
        'Yüksek basınç ve düşük sıcaklıkta tanecik hacmi ve çekimler önem kazanır.\nGaz bu koşullarda ideal davranmaz.',
      ),
      kart(
        'Ne zaman ideale yakın?',
        '**Düşük basınç ve yüksek sıcaklıkta.**\nBu koşullarda tanecikler birbirinden uzak ve hızlıdır.',
        undefined,
        { not: 'He düşük basınç ve yüksek sıcaklıkta ideale en yakın; NH₃ (polar, büyük) en uzak. Küçük, apolar, seyrek = ideal.' },
      ),
      kart(
        'Kısmi basınç',
        'Gaz karışımında toplam basınç, her gazın tek başına yapacağı basınçların toplamıdır.',
      ),
      kart(
        'Kısmi basınç ve mol oranı',
        'Bir gazın kısmi basıncı = toplam basınç × mol kesri\nHavadaki oksijenin payı böyle hesaplanır.',
      ),
      kart(
        'R sabiti',
        '- **0,082 L·atm / mol·K:** basınç atm, hacim litre ise\n- **8,314 J / mol·K:** SI birimleriyle\nBirimler R’ye uymalı; yoksa sonuç yanlış çıkar.',
      ),
      kart(
        'Yoğunluk ve molar kütle',
        'PV = nRT’den türeyen: **d = P · M / (R · T)**\nAynı koşulda molar kütlesi büyük gazın yoğunluğu büyüktür.\nCO₂ bu yüzden yere çöker.',
      ),
    ], [
      soru('PV = nRT bağıntısında T mutlak sıcaklıktır.', true, 'Kelvin cinsinden yazılmak zorunda.'),
      soru('Gazlar yüksek basınç ve düşük sıcaklıkta ideale yaklaşır.', false, 'Tersi: düşük basınç ve yüksek sıcaklıkta ideale yakın davranırlar.'),
      soru('Bir gaz karışımında toplam basınç, kısmi basınçların toplamına eşittir.', true, 'Dalton un kısmi basınçlar yasası.'),
      soru('Bir gazın kısmi basıncı, karışımdaki kütlesiyle doğru orantılıdır.', false, 'Mol oranıyla orantılıdır; kütle değil tanecik sayısı belirleyici.'),
      sikli('PV = nRT\'de R nedir?', ['Gaz sabiti', 'Yoğunluk'], 0, 'Birim seçimine göre değeri değişir.'),
      sikli('PV = nRT\'de n neyi gösterir?', ['Mol sayısını', 'Basıncı'], 0, 'P basınç, V hacim, T mutlak sıcaklık, n mol sayısı.'),
      sikli('Toplam basıncı 10 atm olan karışımda mol kesri 0,2 olan gazın kısmi basıncı?', ['0,2 atm', '2 atm'], 1, 'Kısmi basınç = toplam basınç × mol kesri = 10 · 0,2.'),
      soru('İdeal gaz denklemi n ve T sabitken Boyle yasasına dönüşür.', true, 'PV sabit kalır: basınç ile hacim ters orantılı.'),
      soru('2 mol gaz 300 K\'de 22,4 L\'lik kapta yaklaşık 2,2 atm basınç yapar.', true, 'P = nRT / V = 2 · 0,082 · 300 / 22,4 ≈ 2,2 atm.'),
      soru('Aynı koşulda molar kütlesi büyük gazın yoğunluğu büyüktür.', true, 'd = PM/RT.'),
      soru('R = 0,082 kullanılırken hacim mL alınır.', false, 'Hacim litre, basınç atm olmalı.'),
      sikli('Aynı koşulda hangisinin yoğunluğu büyüktür?', ['CO₂', 'H₂'], 0, 'Molar kütle 44\'e karşı 2.'),
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
        'Difüzyon ve efüzyon',
        '- **Difüzyon:** gazın başka bir gaz içinde yayılması\n- **Efüzyon:** gazın küçük bir delikten dışarı sızması',
      ),
      kart(
        'Graham yasası',
        'Yayılma hızı, molar kütlenin **kareköküyle ters orantılıdır**.\nHafif gaz daha hızlı yayılır.',
      ),
      kart(
        'Neden böyle?',
        'Aynı sıcaklıkta bütün gazların ortalama kinetik enerjisi eşittir.\nEşit enerjide hafif tanecik daha hızlı hareket eder.',
        undefined,
        { not: 'H₂ (2) ile O₂ (32): √(32/2) = 4 kat hızlı. CH₄ (16) ile SO₂ (64): 2 kat. Kütle oranının karekökü.' },
      ),
      kart(
        'Günlük karşılığı',
        '- Doğal gaz kaçağı, ağır kokulardan daha çabuk hissedilir.\n- Hidrojen balonu, helyum balonundan hızlı söner.',
      ),
      kart(
        'Karşılaştırma',
        'İki gazın hız oranı, molar kütlelerinin ters oranının kareköküdür.\nSayı vermeden bile hangisinin hızlı olduğu söylenir.',
      ),
      kart(
        'Hesap örneği',
        'H₂ (2) ile O₂ (32): √(32 / 2) = **4**\nHidrojen, oksijenden dört kat hızlı yayılır.',
      ),
      kart(
        'Aynı sıcaklıkta aynı enerji',
        'Aynı sıcaklıktaki bütün gazların ortalama kinetik enerjisi eşittir.\nHafif molekül bu enerjiyi daha büyük hızla taşır.',
      ),
      kart(
        'NH₃ ve HCl deneyi',
        'Uzun bir borunun iki ucundan NH₃ ve HCl verilir.\nBuluştukları yerde beyaz NH₄Cl halkası oluşur.\nHalka ağır olan HCl’ye yakındır; NH₃ daha hızlıdır.',
      ),
      kart(
        'Molar kütle bulmak',
        'Hız oranı biliniyorsa bilinmeyen gazın molar kütlesi bulunur.\nGaz, O₂’den (32) iki kat yavaşsa M = 32 · 4 = 128',
      ),
      kart(
        'Sıcaklığın etkisi',
        'Sıcaklık artınca bütün gazların hızı, dolayısıyla difüzyonu artar.\nSıcak odada koku daha hızlı yayılır.',
      ),
      kart(
        'Helyum balonu',
        'Helyum balonu hava dolu balondan çabuk söner.\nHafif He atomları lastiğin gözeneklerinden daha hızlı kaçar: efüzyon.',
      ),
    ], [
      soru('Graham yasasına göre molekül kütlesi küçük olan gaz daha hızlı yayılır.', true, 'Hafif tanecik aynı sıcaklıkta daha hızlı hareket ediyor.'),
      soru('Efüzyon, gazın küçük bir delikten dışarı sızmasıdır.', true, 'Difüzyon ise gazın başka bir gaz içinde yayılması.'),
      soru('İki gazın yayılma hızlarının oranı, molar kütlelerinin oranına eşittir.', false, 'Molar kütlelerin kareköküyle ters orantılıdır.'),
      soru('Odada açılan parfümün kokusunun yayılması efüzyona örnektir.', false, 'Bu difüzyona örnek; efüzyonda gaz küçük bir delikten geçiyor.'),
      sikli('He (4) ile CH₄ (16) aynı koşulda yayılıyor. He kaç kat hızlıdır?', ['2', '4'], 0, '√(16 / 4) = 2.'),
      sikli('Hidrojen balonu helyum balonundan neden daha hızlı söner?', ['H₂ daha ağır', 'H₂ daha hafif, daha hızlı sızar'], 1, 'Molar kütle küçüldükçe efüzyon hızlanır: H₂ (2), He (4).'),
      soru('Aynı sıcaklıkta ağır gazın ortalama kinetik enerjisi hafif gazınkinden büyüktür.', false, 'Eşittir; ağır olan daha yavaş hareket eder.'),
      soru('Aynı sıcaklıkta H₂ ve O₂\'nin ortalama kinetik enerjisi eşittir.', true, 'Kinetik enerji yalnız sıcaklığa bağlı.'),
      soru('NH₃-HCl deneyinde beyaz halka NH₃ ucuna yakın oluşur.', false, 'NH₃ hızlıdır, halka HCl\'ye yakın.'),
      soru('Sıcaklık artınca difüzyon hızlanır.', true, 'Moleküller hızlanır.'),
      sikli('He (4) ile CH₄ (16) karşılaştırılırsa He kaç kat hızlıdır?', ['2', '4'], 0, '√(16/4).'),
      sikli('O₂\'den 2 kat yavaş gazın molar kütlesi?', ['128', '64'], 0, 'Hız oranı karekök: M = 32 · 4.'),
      soru('Helyum balonu hava balonundan daha geç söner.', false, 'He hafif, gözeneklerden hızlı kaçar.'),
    ], [
      {
        soru: 'Aynı sıcaklıkta hangi gaz daha hızlı yayılır?',
        siklar: ['CO₂ (44 g/mol)', 'He (4 g/mol)'],
        dogru: 1,
        aciklama: {
          dogru: 'Hız molar kütlenin kareköküyle ters orantılı; hafif gaz hızlı.',
          yanlis: 'Ağır gaz aynı kinetik enerjiyle daha yavaş hareket eder. Helyum CO₂\'den √11 ≈ 3,3 kat hızlı yayılır.',
        },
        kart: 2,
      },
      {
        soru: 'NH₃ ve HCl borusunda beyaz halka nerede oluşur?',
        siklar: ['HCl ucuna yakın', 'NH₃ ucuna yakın'],
        dogru: 0,
        aciklama: {
          dogru: 'NH₃ hafif (17), HCl ağır (36,5); hızlı olan daha uzağa gider.',
          yanlis: 'Hafif gaz daha hızlıdır; NH₃ daha çok yol alır, halka HCl\'ye yakın olur.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('kim10-t2', 'Çeşitlilik', [
    konu('kim10-cozunme', 'Çözünme Süreci', [
      kart(
        'Çözelti nedir?',
        'Bir madde başka bir madde içinde tanecik boyutunda dağılır.\nOluşan karışım homojendir: her yerinde aynı özelliği taşır.',
      ),
      kart(
        'Çözen ve çözünen',
        '- **Çözücü:** miktarca çok olan\n- **Çözünen:** miktarca az olan\nSulu çözeltilerde su her zaman çözücüdür.',
      ),
      kart(
        'Üç adım',
        'İlk iki adım enerji ister, üçüncüsü enerji verir.\nToplamın işareti çözeltinin ısınıp soğumasını belirler.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Çözünen ayrılır', alt: 'enerji ister' },
            { ad: 'Çözücü aralanır', alt: 'enerji ister' },
            { ad: 'Sarma', alt: 'enerji verir', renk: 'ikincil' },
          ],
        },
        { not: 'NaOH suda ısı verir (çözelti ısınır), NH₄NO₃ ısı alır (soğur — soğuk kompres). Sarma > ayırma ise ısı verir.' },
      ),
      kart(
        'Isı alan mı veren mi?',
        '- **Sarma enerjisi büyükse:** çözelti ısınır.\n- **Ayırma enerjisi büyükse:** çözelti soğur.',
      ),
      kart(
        'Günlük örnekler',
        '- **Soğutucu jel paketi:** ısı alan çözünme\n- **Isıtıcı el paketi:** ısı veren çözünme',
      ),
      kart(
        'Çözünme hızı',
        'Karıştırmak, ısıtmak ve maddeyi ufalamak çözünmeyi **hızlandırır**.\nNe kadar çözüneceğini değiştirmez.',
      ),
      kart(
        'Hidratasyon',
        'Çözücü su ise çözünen taneciklerin su molekülleriyle sarılmasına **hidratasyon** denir.\nÇözücü başka bir sıvıysa aynı olayın adı solvatasyondur.',
      ),
      kart(
        'Isınan ve soğuyan kaplar',
        '- **NaOH suda:** çözelti ısınır (ekzotermik).\n- **NH₄NO₃ suda:** çözelti soğur (endotermik).\nAnlık soğuk kompresler ikinci ilkeyle çalışır.',
      ),
      kart(
        'Çözünmeyi hızlandırmak',
        '- Karıştırmak\n- Katıyı toz hâline getirmek\n- Çoğu katı için ısıtmak\nBunlar çözünme **hızını** artırır, çözünürlüğü değil (ısıtma hariç).',
      ),
      kart(
        'Çözelti türleri',
        '- **Gaz-gaz:** hava\n- **Katı-sıvı:** tuzlu su\n- **Sıvı-sıvı:** kolonya\n- **Katı-katı:** alaşımlar (pirinç, tunç)',
      ),
    ], [
      soru('Bir çözeltide miktarı çok olan bileşen çözücüdür.', true, 'Az olan çözünen.'),
      soru('Çözünme sırasında hem enerji harcanır hem de enerji açığa çıkar.', true, 'Bağları koparmak enerji ister, yeni etkileşimler kurulurken enerji açığa çıkar.'),
      soru('Bütün çözünme olayları ısı verir.', false, 'Bazıları ısı alır; amonyum nitratın suda çözünmesi ortamı soğutuyor.'),
      soru('Çözünen maddenin tanecik boyutunu küçültmek çözünürlüğü artırır.', false, 'Çözünme hızını artırır; çözünürlük değişmez.'),
      sikli('Sulu çözeltilerde çözücü hangisidir?', ['Miktarca çok olan', 'Su'], 1, 'Sulu çözeltide su her zaman çözücü sayılır.'),
      sikli('Soğutucu jel paketi hangi çözünmeyi kullanır?', ['Isı veren', 'Isı alan'], 1, 'Isıtıcı el paketleri ısı veren.'),
      soru('Çözelti homojen bir karışımdır.', true, 'Madde tanecik boyutunda dağılır; her yeri aynı özelliği taşır.'),
      soru('NH₄NO₃ suda çözününce çözelti soğur.', true, 'Endotermik çözünme.'),
      soru('Karıştırmak maddenin çözünürlüğünü artırır.', false, 'Çözünme hızını artırır, çözünürlüğü değiştirmez.'),
      soru('Pirinç bir katı-katı çözeltidir.', true, 'Bakır ve çinko alaşımı.'),
      sikli('Suyun çözünen tanecikleri sarması?', ['Hidratasyon', 'Kristallenme'], 0, 'Kristallenme çözeltiden katı ayrılması.'),
      sikli('Anlık soğuk kompreste hangi tür çözünme var?', ['Endotermik', 'Ekzotermik'], 0, 'Isı alan çözünme.'),
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
        'Benzer benzeri çözer',
        '- **Polar madde:** polar çözücüde çözünür (tuz suda).\n- **Apolar madde:** apolar çözücüde çözünür (yağ benzinde).',
      ),
      kart(
        'Su neden iyi çözücü?',
        'Su polardır ve hidrojen bağı yapabilir.\nİyonları ve polar molekülleri kolayca sarar.',
      ),
      kart(
        'Yağ ile su',
        'Su molekülleri birbirini yağdan daha güçlü çeker.\nYağ dışarı itilir, iki faz ayrı kalır.',
      ),
      kart(
        'Sabun ikisini birleştirir',
        'Sabun molekülünün bir ucu polar, öbür ucu apolardır.\nYağı kavrar ve su tarafına taşır.',
        undefined,
        { not: 'Sabunun uzun karbon zinciri yağa, −COO⁻ ucu suya bakar; yağ damlası sabunla sarılıp suya karışır.' },
      ),
      kart(
        'Kısmen çözünenler',
        'Alkol hem polar hem apolar uç taşır.\nBu yüzden hem suda hem yağlı maddelerde bir ölçüde çözünür.',
      ),
      kart(
        'Zincir uzadıkça',
        'Alkolün karbon zinciri uzadıkça apolar kısmı ağır basar.\nSuda çözünürlüğü düşer.',
      ),
      kart(
        'Karışır mı, karışmaz mı?',
        'Polarlık benzerliği karışmayı belirler.',
        {
          tur: 'tablo',
          basliklar: ['İkili', 'Sonuç'],
          satirlar: [
            ['Su + etanol', 'Karışır'],
            ['Su + benzin', 'Karışmaz'],
            ['İyot + CCl₄', 'Çözünür'],
            ['Tuz + benzin', 'Çözünmez'],
          ],
        },
      ),
      kart(
        'Hidrojen bağıyla çözünme',
        'Etanol ve şeker suyla hidrojen bağı kurar; bu yüzden suda iyi çözünür.\nKolonyanın suyla her oranda karışması bundandır.',
      ),
      kart(
        'Emülsiyon',
        'Birbirinde çözünmeyen iki sıvının damlacıklar hâlinde dağılmasıdır.\nMayonez: yağ ile su, yumurta sarısı sayesinde bir arada kalır.',
      ),
      kart(
        'Kuru temizleme',
        'Yağ lekesi apolar olduğu için suyla çıkmaz.\nKuru temizlemede apolar çözücü kullanılır: benzer benzeri çözer.',
      ),
    ], [
      soru('Polar maddeler polar çözücülerde iyi çözünür.', true, '"Benzer benzeri çözer" kuralı.'),
      soru('Yağ suda çözünmez çünkü apolar bir maddedir.', true, 'Su polar; aralarında yeterli çekim kurulmuyor.'),
      soru('Sabun molekülünün iki ucu da polardır.', false, 'Bir ucu polar, öteki ucu apolar; yağ ile suyu bu yüzden birleştirebiliyor.'),
      soru('Karbon zinciri uzadıkça alkollerin sudaki çözünürlüğü artar.', false, 'Azalır; apolar kısım büyüdükçe su ile uyum bozuluyor.'),
      sikli('Yağ lekesini hangisi daha kolay çözer?', ['Benzin', 'Saf su'], 0, 'Apolar yağ, apolar çözücüde çözünür.'),
      sikli('Alkolün hem suda hem yağda çözünmesinin sebebi?', ['Hem polar hem apolar ucu var', 'Çok küçük molekül'], 0, 'Zincir uzadıkça suda çözünürlük düşer.'),
      soru('Suyu iyi çözücü yapan şey polar olması ve hidrojen bağı yapabilmesidir.', true, 'İyonları ve polar molekülleri sarar.'),
      soru('Etanol suda her oranda çözünür.', true, 'Hidrojen bağı kurar.'),
      soru('İyot suda çok iyi çözünür.', false, 'İyot apolar; CCl₄ gibi apolar çözücüde çözünür.'),
      soru('Mayonez bir emülsiyondur.', true, 'Yağ damlacıkları suda dağılmış.'),
      sikli('Yağ lekesi hangi çözücüyle çıkar?', ['Apolar çözücü', 'Su'], 0, 'Benzer benzeri çözer.'),
      sikli('Su ile benzin karıştırılınca?', ['İki katman oluşur', 'Homojen olur'], 0, 'Polar ile apolar karışmaz.'),
    ], [
      {
        soru: 'Yağ neden suda çözünmez?',
        siklar: ['Yağ apolar, su polar', 'Yağ sudan yoğun'],
        dogru: 0,
        aciklama: {
          dogru: 'Benzer benzeri çözer; su molekülleri birbirini yağdan güçlü çeker, yağ dışarı itilir.',
          yanlis: 'Yoğunluk yüzmeyi belirler, çözünmeyi değil. Yağ apolar, su polar; polar su apolar yağı saramaz.',
        },
        kart: 1,
      },
    ]),
    konu('kim10-siniflandirma', 'Çözünme Olayının Sınıflandırılması', [
      kart(
        'İyonik çözünme',
        'Madde suda iyonlarına ayrılır.\nÇözelti elektrik akımını iletir; tuzlar ve asitler böyledir.',
      ),
      kart(
        'Moleküler çözünme',
        'Madde molekül hâlinde dağılır, iyon oluşmaz.\nŞeker çözeltisi elektriği iletmez.',
      ),
      kart(
        'Elektrolit çözelti',
        'İçinde serbest iyon bulunan ve akımı ileten çözeltidir.\nİyon sayısı arttıkça iletkenlik artar.',
      ),
      kart(
        'Kuvvetli ve zayıf elektrolit',
        '- **Kuvvetli:** tamamı iyonlaşır.\n- **Zayıf:** bir kısmı iyonlaşır.\nFarkı lambanın parlaklığı gösterir.',
        {
          tur: 'tablo',
          basliklar: ['Çözelti', 'İletkenlik'],
          satirlar: [
            ['Tuzlu su', 'Yüksek'],
            ['Sirke', 'Düşük'],
            ['Şekerli su', 'Yok'],
          ],
        },
      ),
      kart(
        'Nasıl anlaşılır?',
        'Basit bir devreye lamba bağlanır, uçlar çözeltiye daldırılır.\nLamba yanıyorsa çözünme iyoniktir.',
        undefined,
        { not: 'Şeker çözeltisi lambayı yakmaz, tuz çözeltisi yakar, sirke (zayıf asit) sönük yakar. Üç ölçüt tek deney.' },
      ),
      kart(
        'Saf su iletmez',
        'Saf su neredeyse yalıtkandır.\nMusluk suyunu iletken yapan, içindeki çözünmüş iyonlardır.',
      ),
      kart(
        'Örnekler',
        '- **NaCl:** iyonik çözünür, iyonlara ayrılır.\n- **Şeker:** moleküler çözünür, molekül olarak dağılır.\n- **HCl:** molekül olduğu hâlde suda iyonlaşır.',
      ),
      kart(
        'Asitler suda iyonlaşır',
        'HCl gibi asitler saf hâlde molekül olsa da suda H⁺ ve Cl⁻ iyonlarına ayrılır.\nAsit çözeltilerinin elektriği iletmesi bundandır.',
      ),
      kart(
        'İletkenlik deneyi',
        'Çözeltiye iki elektrot ve ampul bağlanır.\n- **Parlak:** kuvvetli elektrolit\n- **Sönük:** zayıf elektrolit\n- **Yanmaz:** elektrolit değil',
      ),
      kart(
        'Vücutta elektrolit',
        'Kanda ve terde Na⁺, K⁺, Cl⁻ iyonları vardır.\nSinir ve kas iletimi bu iyonlara bağlıdır; çok terleyen biri su ile birlikte tuz da kaybeder.',
      ),
    ], [
      soru('İyonik çözünmede oluşan çözelti elektrik akımını iletir.', true, 'Serbest iyonlar yükü taşıyor.'),
      soru('Şekerin suda çözünmesi moleküler çözünmedir.', true, 'Moleküller dağılıyor ama iyonlara ayrılmıyor.'),
      soru('Saf su elektriği iyi iletir.', false, 'Saf suda serbest iyon yok denecek kadar az; ileten şey içindeki çözünmüş tuzlar.'),
      soru('Zayıf elektrolitler suda tümüyle iyonlaşır.', false, 'Kısmen iyonlaşırlar; tümüyle iyonlaşan kuvvetli elektrolittir.'),
      sikli('Bir çözünmenin iyonik olup olmadığı nasıl anlaşılır?', ['Devreye bağlı lamba çözeltiye daldırılır', 'Çözelti ısıtılır'], 0, 'Lamba yanıyorsa çözeltide serbest iyon vardır.'),
      sikli('Çözeltideki iyon sayısı artarsa iletkenlik?', ['Artar', 'Azalır'], 0, 'Yükü taşıyan iyonlar çoğaldıkça akım kolaylaşır.'),
      soru('Tuzlu su lambayı sirkeden daha parlak yakar.', true, 'Tuz kuvvetli, sirke zayıf elektrolit.'),
      soru('Şeker suda iyonlarına ayrılır.', false, 'Molekül olarak dağılır.'),
      soru('HCl suda iyonlaştığı için çözeltisi elektriği iletir.', true, 'H⁺ ve Cl⁻ oluşur.'),
      soru('Sinir iletimi vücuttaki iyonlara bağlıdır.', true, 'Na⁺ ve K⁺ özellikle.'),
      sikli('Şekerli suya bağlı ampul?', ['Yanmaz', 'Parlak yanar'], 0, 'İyon yok.'),
      sikli('Asetik asit çözeltisinde ampul?', ['Sönük yanar', 'Parlak yanar'], 0, 'Zayıf elektrolit.'),
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
        'Tanımı',
        'Belirli sıcaklıkta **100 g çözücüde** çözünebilen en fazla madde miktarıdır.\nMaddenin ayırt edici özelliğidir.',
      ),
      kart(
        'Doymuş çözelti',
        'Daha fazla madde çözemeyen çözeltidir.\nEklenen fazlalık dibe çöker.',
      ),
      kart(
        'Aşırı doymuş çözelti',
        'Kararsız biçimde sınırın üstünde madde taşır.\nKüçük bir sarsıntı ya da bir kristal fazlalığı çökertir.',
      ),
      kart(
        'Çözünürlük eğrisi',
        'Sıcaklığa karşı çözünürlüğü gösteren grafiktir.\n- **Eğrinin üstü:** aşırı doymuş\n- **Eğrinin altı:** doymamış',
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
        'Eğriden ne okunur?',
        '- Belirli sıcaklıkta en çok ne kadar çözüneceği\n- Soğutunca ne kadarının çökeceği\n- Çözeltinin doymuş olup olmadığı',
      ),
      kart(
        'Kristallendirme',
        'Sıcakken doyurulan çözelti soğutulunca fazlalık kristal olarak ayrılır.\nŞeker ve tuz bu yolla saflaştırılır.',
      ),
      kart(
        'Eğri sorusu kalıbı',
        '100 g suda: 80 °C’de 60 g, 20 °C’de 30 g çözünüyorsa\nsoğutunca **30 g** çöker.\n200 g su olsaydı sayılar iki katı olurdu.',
        undefined,
        { not: '80 °C\'de 60 g, 20 °C\'de 30 g çözünüyorsa 100 g suyla doymuş çözelti soğutulunca 30 g kristal çöker.' },
      ),
      kart(
        'Birimi',
        'Çözünürlük genellikle **100 g sudaki gram** ile verilir.\nSıcaklık mutlaka belirtilir; çünkü çözünürlük sıcaklıkla değişir.',
      ),
      kart(
        'Hesap örneği',
        'NaCl’nin çözünürlüğü 36 g / 100 g su ise:\n50 g suda en çok 18 g çözünür.\n20 g eklenirse 2 g dipte kalır.',
      ),
      kart(
        'Doymamışı doymuş yapmak',
        '- Çözünen eklemek\n- Çözücüyü buharlaştırmak\n- Sıcaklığı değiştirmek (çoğu katıda soğutmak)',
      ),
      kart(
        'Çözünürlük ile çözünme hızı',
        '- **Çözünürlük:** en çok ne kadar çözünür? (miktar)\n- **Çözünme hızı:** ne kadar çabuk çözünür? (zaman)\nToz şeker daha hızlı çözünür ama çözünürlüğü küp şekerle aynıdır.',
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
      sikli('Sıcak doymuş çözelti soğutulunca ne olur?', ['Daha çok çözünür', 'Fazlalık kristalleşir'], 1, 'Soğukta çözünürlük düşer; fazlası kristal olarak ayrılır.'),
      sikli('80 °C\'de 50 g, 30 °C\'de 20 g çözünüyorsa 100 g sulu doymuş çözelti soğuyunca kaç g çöker?', ['30', '20'], 0, 'Fark çöker: 50 − 20 = 30 g.'),
      soru('Çözünürlük eğrisinden bir çözeltinin doymuş olup olmadığı okunabilir.', true, 'Nokta eğrinin üstündeyse aşırı doymuş, üzerindeyse doymuş, altındaysa doymamış.'),
      soru('Çözünürlük verilirken sıcaklık belirtilir.', true, 'Sıcaklık değişince çözünürlük değişir.'),
      soru('Toz şekerin çözünürlüğü küp şekerinkinden büyüktür.', false, 'Hız farklı, çözünürlük aynı.'),
      soru('Çözücüyü buharlaştırmak doymamış çözeltiyi doymuş yapabilir.', true, 'Çözücü azalır.'),
      sikli('Çözünürlük 40 g/100 g su ise 25 g suda en çok?', ['10 g', '40 g'], 0, '40 · 25/100.'),
      sikli('Toz hâline getirmek neyi artırır?', ['Çözünme hızını', 'Çözünürlüğü'], 0, 'Yüzey alanı artar.'),
    ], [
      {
        soru: 'Çözünürlük eğrisinin üstünde kalan nokta hangi çözeltidir?',
        siklar: ['Aşırı doymuş', 'Doymamış'],
        dogru: 0,
        aciklama: {
          dogru: 'Eğri sınırı gösterir; üstü sınırdan fazla madde taşıyan kararsız çözelti.',
          yanlis: 'Doymamış çözelti eğrinin altında kalır. Eğrinin üstü sınırdan fazlasını taşıyan aşırı doymuş bölge.',
        },
        kart: 4,
      },
      {
        soru: 'Çözünürlük 30 g/100 g su. 200 g suya 70 g katı eklenirse dipte kalan?',
        siklar: ['10 g', '40 g'],
        dogru: 0,
        aciklama: {
          dogru: '200 g suda en çok 60 g çözünür; 70 − 60 = 10 g kalır.',
          yanlis: '100 g su için değil 200 g su için hesapla: 60 g çözünür, 10 g kalır.',
        },
        kart: 9,
      },
    ]),
    konu('kim10-etkileyen', 'Çözünürlüğe Etki Eden Faktörler', [
      kart(
        'Madde cinsi',
        'Çözünürlük öncelikle çözücü ile çözünenin türüne bağlıdır.\nAynı koşulda her madde farklı çözünür.',
      ),
      kart(
        'Sıcaklık — katılar',
        'Çoğu katının çözünürlüğü sıcaklıkla **artar**.\nŞekerin sıcak çayda daha çok çözünmesi bundandır.',
      ),
      kart(
        'Sıcaklık — gazlar',
        'Gazların çözünürlüğü sıcaklıkla **azalır**.\n- Isınan gazoz köpürür.\n- Isınan suda balık için oksijen azalır.',
      ),
      kart(
        'Basınç',
        'Yalnızca gazları etkiler; basınç arttıkça çözünürlük artar.\nGazoz şişesi açılınca basınç düşer, gaz kaçar.',
      ),
      kart(
        'Etkilemeyenler',
        'Karıştırma, ufalama ve çözücü miktarı çözünürlüğü değiştirmez.\nİlk ikisi yalnızca çözünme hızını değiştirir.',
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
        { not: 'Karıştırma, ufalama ve çözelti miktarı çözünme hızını artırır, çözünürlüğü (100 g sudaki en fazla) değiştirmez.' },
      ),
      kart(
        'Ortak iyon etkisi',
        'Çözeltide zaten bulunan bir iyonu tekrar eklemek:\no iyonu içeren tuzun çözünürlüğünü **düşürür**.',
      ),
      kart(
        'Henry yasası',
        'Gazın sıvıdaki çözünürlüğü, üstündeki kısmi basıncıyla doğru orantılıdır.\nGazoz basınç altında doldurulur; kapak açılınca basınç düşer, CO₂ kabarcıklanır.',
      ),
      kart(
        'Termal kirlilik',
        'Fabrikaların ısınmış atık suyu akarsuyu ısıtır.\nSıcak suda O₂ az çözünür; balıklar oksijensiz kalır.',
      ),
      kart(
        'Vurgun',
        'Derinde basınç yüksek olduğu için kanda çok azot çözünür.\nDalgıç hızlı yükselirse azot kabarcık olur ve damarları tıkar.',
      ),
      kart(
        'Sıcaklık ve çözünme ısısı',
        '- **Endotermik çözünen:** sıcaklık artınca çözünürlük artar (çoğu katı).\n- **Ekzotermik çözünen:** sıcaklık artınca çözünürlük azalır (gazlar).',
      ),
    ], [
      soru('Katıların çözünürlüğü genellikle sıcaklık arttıkça artar.', true, 'Şekerin sıcak suda daha çok çözünmesi buna örnek.'),
      soru('Gazların çözünürlüğü sıcaklık arttıkça azalır.', true, 'Isınan gazlı içeceğin gazının kaçması bu yüzden.'),
      soru('Basınç, katıların çözünürlüğünü belirgin biçimde etkiler.', false, 'Basıncın belirgin etkisi gazlarda görülür.'),
      soru('Karıştırmak çözünürlüğü artırır.', false, 'Çözünme hızını artırır; çözünürlük aynı kalır.'),
      sikli('Aynı koşulda farklı maddelerin çözünürlükleri nasıldır?', ['Farklıdır', 'Hep eşittir'], 0, 'Çözünürlük maddenin ayırt edici özelliği.'),
      sikli('Hangisi çözünürlüğü değiştirir?', ['Karıştırma', 'Sıcaklık'], 1, 'Karıştırma yalnızca hızı değiştirir.'),
      soru('Ortak iyon eklemek tuzun çözünürlüğünü düşürür.', true, 'Çözeltide zaten bulunan iyon, tuzun daha fazla çözünmesini engeller.'),
      soru('Gazozun kapağı açılınca CO₂ kabarcıklanır çünkü basınç düşer.', true, 'Henry yasası.'),
      soru('Sıcak suda oksijen daha çok çözünür.', false, 'Gazların çözünürlüğü sıcaklıkla azalır.'),
      soru('Vurgun, kanda çözünen azotun kabarcık oluşturmasıdır.', true, 'Hızlı yükselişte basınç düşer.'),
      sikli('Termal kirlilik balıkları nasıl etkiler?', ['Oksijen azalır', 'Tuz artar'], 0, 'Sıcak suda O₂ az çözünür.'),
      sikli('Gazın sıvıdaki çözünürlüğü basınçla?', ['Artar', 'Azalır'], 0, 'Kısmi basınçla doğru orantılı.'),
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
        'Derişik ve seyreltik',
        '- **Derişik:** çözünen çok\n- **Seyreltik:** çözünen az\nGöreli bir karşılaştırmadır.',
      ),
      kart(
        'Doymuş, doymamış, aşırı doymuş',
        'Çözünürlük sınırına göre yapılan sınıflamadır.\nDerişik olmak ile doymuş olmak aynı şey değildir.',
      ),
      kart(
        'İkisi neden farklı?',
        'Çözünürlüğü düşük madde, çok az miktarda bile doymuş çözelti verir.\nBu çözelti hem doymuş hem seyreltiktir.',
        undefined,
        { not: 'AgCl\'nin 100 g suda 0,0002 g\'ı doymuş çözelti verir: hem doymuş hem çok seyreltik. Doymuş ≠ derişik.' },
      ),
      kart(
        'Hâline göre',
        'Çözelti sıvı olmak zorunda değildir.\n- **Gaz çözelti:** hava\n- **Katı çözelti:** alaşımlar',
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
        'İletkenliğine göre',
        '- **Elektrolit çözelti:** akımı iletir.\n- **Elektrolit olmayan:** iletmez.',
      ),
      kart(
        'Homojen olmak şart',
        'Çözelti her noktasında aynı özelliği taşır.\nTanecikler görünür boyuttaysa o çözelti değil, süspansiyondur.',
      ),
      kart(
        'Aşırı doymuş örnekler',
        '- **Sıcak ped:** sodyum asetat çözeltisi, metal düğmeye basınca kristallenip ısı verir.\n- **Bal:** zamanla şekerlenmesi aşırı doymuşluktandır.',
      ),
      kart(
        'Karışım türleri',
        '- **Çözelti:** homojen, tanecik görünmez (tuzlu su)\n- **Süspansiyon:** katı sıvıda dağılmış, dibe çöker (ayran, çamurlu su)\n- **Emülsiyon:** sıvı sıvıda dağılmış (süt, mayonez)',
      ),
      kart(
        'Kolloit',
        'Tanecikleri çözeltidekinden büyük, süspansiyondakinden küçüktür.\nIşık demetini saçar: sisli havada far ışığının görünmesi (Tyndall etkisi).',
      ),
      kart(
        'Derişik mi doymuş mu?',
        'Derişik ve doymuş aynı şey değildir.\n- **Az çözünen madde:** doymuş çözeltisi bile seyreltik olabilir.\n- **Çok çözünen madde:** derişik olduğu hâlde doymamış kalabilir.',
      ),
    ], [
      soru('Derişik ve seyreltik ayrımı, çözünen madde miktarına göre yapılır.', true, 'Göreli bir ayrım; kesin bir sınır yok.'),
      soru('Doymuş bir çözelti aynı zamanda seyreltik olabilir.', true, 'Çözünürlüğü düşük bir maddede doymuş çözelti az madde içeriyor.'),
      soru('Çözeltiler heterojen karışımlardır.', false, 'Homojen olmak çözelti olmanın şartı.'),
      soru('Alaşımlar çözelti sayılmaz.', false, 'Katı hâldeki çözeltilere örnek.'),
      sikli('Hava hangi tür çözeltidir?', ['Katı çözelti', 'Gaz çözeltisi'], 1, 'Alaşımlar katı çözelti.'),
      sikli('Tanecikleri görünür boyutta olan karışım nedir?', ['Çözelti', 'Süspansiyon'], 1, 'Çözelti homojendir.'),
      soru('Elektrolit çözelti elektrik akımını iletir.', true, 'İçindeki serbest iyonlar yükü taşır.'),
      soru('Ayran bir süspansiyondur.', true, 'Katı tanecikler zamanla dibe çöker.'),
      soru('Doymuş çözelti her zaman derişiktir.', false, 'Çözünürlüğü düşük maddenin doymuş çözeltisi seyreltik olabilir.'),
      soru('Sisli havada far ışığının görünmesi Tyndall etkisidir.', true, 'Kolloit tanecikleri ışığı saçar.'),
      sikli('Süt hangi karışımdır?', ['Emülsiyon', 'Çözelti'], 0, 'Yağ damlacıkları suda dağılmış.'),
      sikli('Sıcak pedin ısınmasının sebebi?', ['Aşırı doymuş çözeltinin kristallenmesi', 'Yanma'], 0, 'Kristallenme ısı verir.'),
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
        'Molarite',
        '1 litre çözeltideki çözünen mol sayısıdır.\n**M = mol / litre çözelti**',
      ),
      kart(
        'Hesap örneği',
        '4 g NaOH (0,1 mol) ile 500 mL çözelti:\n**M = 0,1 / 0,5 = 0,2 M**\nÖnce mol, sonra litre.',
      ),
      kart(
        'Dikkat: çözelti hacmi',
        'Molarite, çözücünün değil **çözeltinin** hacmine bölünür.\nKatı eklemek hacmi değiştirir.',
        undefined,
        { not: '4 g NaOH 500 mL çözelti → 0,2 M. \'500 mL suya eklendi\' derse hacim 500\'den büyük olur, molarite biraz küçülür.' },
      ),
      kart(
        'Kütlece yüzde',
        'Çözünenin kütlesinin, çözeltinin toplam kütlesine oranıdır.\nEtiketlerde en sık görülen derişim birimidir.',
      ),
      kart(
        'ppm',
        'Milyonda bir kısım demektir.\nÇok seyreltik derişimlerde kullanılır: içme suyundaki kurşun sınırı gibi.',
      ),
      kart(
        'Seyreltme',
        'Su eklemek mol sayısını değiştirmez, yalnızca hacmi büyütür.\nBu yüzden derişim küçülür.',
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
        'Karıştırma',
        'İki çözelti karışınca mol sayıları ve hacimler toplanır.\nYeni derişim = toplam mol / toplam hacim',
      ),
      kart(
        'Seyreltme formülü',
        '**M₁V₁ = M₂V₂**\n2 M, 100 mL çözeltiye 300 mL su eklenirse:\n2 · 100 = M₂ · 400 → M₂ = 0,5 M',
      ),
      kart(
        'Hacimce yüzde',
        '100 mL çözeltideki çözünen hacmidir.\n%80’lik kolonyanın 100 mL’sinde 80 mL etanol vardır.',
      ),
      kart(
        'ppm örneği',
        'ppm, milyonda bir kısım demektir; sulu çözeltide 1 ppm ≈ 1 mg / 1 kg (1 L).\n1 L içme suyunda 2 mg florür → 2 ppm',
      ),
      kart(
        'İyon derişimi',
        'İyonik bileşik çözününce her iyonun derişimi ayrı hesaplanır.\n0,1 M CaCl₂ → [Ca²⁺] = 0,1 M, [Cl⁻] = 0,2 M',
      ),
    ], [
      soru('Molarite, çözünen maddenin mol sayısının çözelti hacmine bölünmesidir.', true, 'Birimi mol/L.'),
      soru('Molarite hesabında çözücünün değil çözeltinin hacmi kullanılır.', true, 'Katı eklenince toplam hacim değişebiliyor.'),
      soru('Seyreltme sırasında çözünen maddenin mol sayısı değişir.', false, 'Mol sayısı aynı kalır; değişen hacim, dolayısıyla derişim.'),
      soru('Kütlece yüzde, etiketlerde en sık görülen derişim birimidir.', true, 'Ürün etiketlerinde "%5" gibi yazılır.'),
      sikli('4 g NaOH (40 g/mol) ile 500 mL çözelti: molarite?', ['0,1 M', '0,2 M'], 1, '0,1 mol / 0,5 L.'),
      sikli('2 M\'lik 100 mL çözeltiye 300 mL su eklenirse?', ['1,5 M', '0,5 M'], 1, 'M₁V₁ = M₂V₂.'),
      sikli('İçme suyundaki kurşun sınırı hangi birimle verilir?', ['Molarite', 'ppm'], 1, 'Milyonda bir kısım.'),
      sikli('20 g tuz ile 80 g su karıştırılırsa kütlece yüzde kaçtır?', ['%20', '%25'], 0, 'Payda çözelti: 20 / (20 + 80) = %20. 20/80 çözücüye bölmek olur.'),
      soru('İki çözelti karışınca toplam mol ve toplam hacim toplanır.', true, 'Yeni derişim bölüm.'),
      soru('0,2 M Na₂SO₄ çözeltisinde [Na⁺] 0,4 M\'dir.', true, 'Her formülde iki Na⁺.'),
      soru('%70\'lik kolonyanın 100 mL\'sinde 30 mL etanol vardır.', false, '70 mL etanol, 30 mL su.'),
      sikli('1 L suda 5 mg kurşun kaç ppm\'dir?', ['5', '0,005'], 0, '1 mg/L ≈ 1 ppm.'),
      sikli('0,3 M AlCl₃ çözeltisinde [Cl⁻]?', ['0,9 M', '0,3 M'], 0, 'Formülde üç Cl.'),
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
      {
        soru: '0,5 M MgCl₂ çözeltisinde Cl⁻ derişimi?',
        siklar: ['1 M', '0,5 M'],
        dogru: 0,
        aciklama: {
          dogru: 'Her MgCl₂ iki Cl⁻ verir: 2 · 0,5 = 1 M.',
          yanlis: '0,5 M Mg²⁺ derişimidir. Cl⁻ iki kat: 1 M.',
        },
        kart: 11,
      },
    ]),
    konu('kim10-koligatif', 'Koligatif Özellikler', [
      kart(
        'Neye bağlı?',
        'Çözünenin cinsine değil, çözeltideki **tanecik sayısına** bağlı özelliklerdir.',
      ),
      kart(
        'Kaynama noktası yükselmesi',
        'Çözünen eklenince çözelti, saf çözücüden daha yüksek sıcaklıkta kaynar.',
      ),
      kart(
        'Donma noktası düşmesi',
        'Çözelti, saf çözücüden daha düşük sıcaklıkta donar.\nKışın yollara tuz atılmasının sebebi budur.',
      ),
      kart(
        'Buhar basıncı düşmesi',
        'Yüzeydeki çözünen tanecikleri buharlaşmayı engeller, buhar basıncı düşer.\nÖteki iki özellik bundan türer.',
      ),
      kart(
        'İyonik çözünen daha etkili',
        'NaCl suda iki iyona ayrılır.\nBu yüzden aynı moldaki şekerin iki katı etki yapar.',
        {
          tur: 'tablo',
          basliklar: ['1 mol madde', 'Tanecik'],
          satirlar: [
            ['Şeker', '1 mol'],
            ['NaCl', '2 mol'],
            ['CaCl₂', '3 mol'],
          ],
        },
        { not: '1 mol şeker 1 mol tanecik, 1 mol NaCl 2 mol, 1 mol CaCl₂ 3 mol. Donma noktasını en çok CaCl₂ düşürür.' },
      ),
      kart(
        'Osmotik basınç',
        'Yarı geçirgen zardan su geçişini durdurmak için gereken basınçtır.\nHücrelerin su dengesi buna bağlıdır.',
      ),
      kart(
        'Tanecik sayısı',
        'Koligatif etki çözünenin cinsine değil tanecik sayısına bağlıdır.\n- Şeker: 1 tanecik\n- NaCl: 2 (Na⁺, Cl⁻)\n- CaCl₂: 3 (Ca²⁺, 2Cl⁻)',
      ),
      kart(
        'Yollara tuz',
        'Buzlu yola dökülen tuz suyun donma noktasını düşürür.\nBuz −10 °C’ye kadar eriyebilir; CaCl₂ daha çok tanecik verdiği için daha etkilidir.',
      ),
      kart(
        'Antifriz',
        'Motor suyuna katılan etilen glikol hem donma noktasını düşürür hem kaynama noktasını yükseltir.\nMotor kışın donmaz, yazın kaynamaz.',
      ),
      kart(
        'Ters osmoz',
        'Tuzlu suya osmotik basınçtan büyük basınç uygulanırsa su zardan geri itilir.\nDeniz suyundan içme suyu elde etmenin yaygın yoludur.',
      ),
      kart(
        'Tuzlu su geç kaynar',
        'Makarna suyuna atılan tuz kaynama noktasını çok az yükseltir.\nEtki miktarla artar; deniz suyu arı sudan yüksek sıcaklıkta kaynar.',
      ),
    ], [
      soru('Koligatif özellikler, çözünen taneciklerin sayısına bağlıdır.', true, 'Taneciğin cinsi değil sayısı belirleyici.'),
      soru('Tuzlu suyun kaynama noktası saf sudan yüksektir.', true, 'Çözünen tanecikler buharlaşmayı zorlaştırıyor.'),
      soru('Yollara tuz atılması suyun donma noktasını yükseltir.', false, 'Donma noktasını düşürür; buz bu yüzden erir.'),
      soru('Aynı derişimdeki şeker ve tuz çözeltileri kaynama noktasını aynı ölçüde yükseltir.', false, 'Tuz iyonlarına ayrıldığı için daha çok tanecik verir ve etkisi büyüktür.'),
      sikli('1 mol CaCl₂ suda kaç mol tanecik verir?', ['3', '1'], 0, 'Bir Ca²⁺ ve iki Cl⁻ iyonu.'),
      sikli('Yarı geçirgen zardan su geçişini durdurmak için gereken basınç?', ['Buhar basıncı', 'Osmotik basınç'], 1, 'Hücrelerin su dengesi osmotik basınca bağlı.'),
      soru('Çözünen eklenmesi çözücünün buhar basıncını düşürür.', true, 'Yüzeydeki çözünen tanecikler buharlaşmayı engeller.'),
      soru('Koligatif özellikler çözünen taneciklerin sayısına bağlıdır.', true, 'Cinsine değil.'),
      soru('Eşit derişimde şeker ve NaCl donma noktasını eşit düşürür.', false, 'NaCl iki tanecik verir; iki kat etki.'),
      soru('Antifriz hem donma hem kaynama noktasını değiştirir.', true, 'Donmayı düşürür, kaynamayı yükseltir.'),
      sikli('Deniz suyundan içme suyu elde eden yöntem?', ['Ters osmoz', 'Süzme'], 0, 'Tuz süzgeçten geçer.'),
      sikli('Eşit derişimde hangisi donma noktasını daha çok düşürür?', ['CaCl₂', 'NaCl'], 0, '3 tanecik.'),
      soru('Deniz suyu arı sudan daha düşük sıcaklıkta kaynar.', false, 'Çözünen tanecikler kaynama noktasını yükseltir.'),
    ], [
      {
        soru: 'Yollara kışın tuz atılmasının sebebi?',
        siklar: ['Kaynama noktası yükselir', 'Donma noktası düşer'],
        dogru: 1,
        aciklama: {
          dogru: 'Tuzlu su saf sudan daha düşük sıcaklıkta donar; buz çözülür.',
          yanlis: 'Kaynama noktası da yükselir ama yolda önemli olan donma: tuzlu su 0 °C\'nin altında sıvı kalır.',
        },
        kart: 3,
      },
      {
        soru: 'Buzlu yollara tuz dökülmesinin sebebi?',
        siklar: ['Donma noktasını düşürmek', 'Buzu ısıtmak'],
        dogru: 0,
        aciklama: {
          dogru: 'Tuzlu su daha düşük sıcaklıkta donar; buz erir.',
          yanlis: 'Tuz ısı vermez. Suyun donma noktasını düşürdüğü için buz erir.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('kim10-t3', 'Sürdürülebilirlik', [
    konu('kim10-mikro', 'Makro ve Mikro Ölçekli Deneyler', [
      kart(
        'Fark nedir?',
        'Mikro ölçekli deney aynı sonucu çok daha az madde ve küçük düzenekle verir.',
      ),
      kart(
        'Üç kazanç',
        '- Daha az atık\n- Daha az maliyet\n- Daha az risk',
      ),
      kart(
        'Atom ekonomisi',
        'Girenlerdeki atomların ne kadarının ürüne geçtiğinin ölçüsüdür.\nYüksek atom ekonomisi, az atık demektir.',
      ),
      kart(
        'Verim ile farkı',
        '- **Verim:** ne kadar ürün elde edildiği\n- **Atom ekonomisi:** kaç atomun boşa gittiği\nİkisi ayrı ölçülerdir.',
        undefined,
        { not: 'Verim %90 olan bir tepkimenin atom ekonomisi %40 olabilir: ürün çok ama atomların çoğu yan ürüne gitmiş.' },
      ),
      kart(
        'Sınırı',
        'Her deney küçültülemez; bazı ölçümler görünür miktarda madde ister.\nÖlçek, doğruluğu bozmadan küçültülür.',
      ),
      kart(
        'Örnek',
        'Titrasyonu 50 mL yerine 5 mL ile yapmak sonucu değiştirmez.\nAtık onda birine iner.',
      ),
      kart(
        'Kuyucuklu plaka',
        'Deneyler beher yerine küçük kuyucuklarda, birkaç damlayla yapılır.\nAynı plakada birçok deneme yan yana karşılaştırılabilir.',
      ),
      kart(
        'Damlatma şişeleri',
        'Çözeltiler mililitre değil damla ile verilir.\nHem harcanan madde hem dökülme riski azalır.',
      ),
      kart(
        'Yeşil kimyayla bağ',
        'Mikro ölçek atığı kaynağında azaltır: yeşil kimyanın ilk ilkesi.\nAz madde, az enerji ve az atık birlikte gelir.',
      ),
      kart(
        'Nerede yetmez?',
        'Çok küçük miktarlar hassas tartım gerektirir; ölçüm hatası büyür.\nSanayi ölçeğindeki üretimin denenmesi için makro deney de gerekir.',
      ),
    ], [
      soru('Mikro ölçekli deney daha büyük bir düzenek gerektirir.', false, 'Aynı sonucu daha küçük düzenek ve daha az maddeyle verir.'),
      soru('Mikro ölçekli çalışmak oluşan atık miktarını azaltır.', true, 'Yeşil kimyanın atık önleme ilkesiyle örtüşüyor.'),
      soru('Mikro ölçekli deneylerin sonuçları her zaman daha kesindir.', false, 'Küçük miktarlarda ölçüm hatasının payı büyüyebiliyor.'),
      soru('Atom ekonomisi ile yüzde verim aynı şeyi ölçer.', false, 'Verim ne kadar elde edildiğini, atom ekonomisi girenlerin ne kadarının ürüne geçtiğini ölçer.'),
      sikli('Atom ekonomisi neyi ölçer?', ['Kaç atomun ürüne geçtiğini', 'Ne kadar ürün elde edildiğini'], 0, 'Verim ikincisini ölçer.'),
      sikli('Titrasyonu 5 mL ile yapmak neyi değiştirir?', ['Atığı', 'Sonucu'], 0, 'Aynı sonuç, onda bir atık.'),
      soru('Her deney mikro ölçeğe küçültülebilir.', false, 'Bazı ölçümler görünür miktar ister.'),
      soru('Mikro ölçekli deneyler atığı azaltır.', true, 'Kullanılan madde azdır.'),
      soru('Mikro ölçekte ölçüm hatası önemsizleşir.', false, 'Küçük miktarda hata oransal olarak büyür.'),
      soru('Kuyucuklu plakada birçok deneme yan yana yapılabilir.', true, 'Karşılaştırma kolaylaşır.'),
      sikli('Mikro deneyde çözeltiler nasıl verilir?', ['Damla ile', 'Litre ile'], 0, 'Damlatma şişeleriyle.'),
      sikli('Mikro ölçek yeşil kimyanın hangi ilkesine hizmet eder?', ['Atığı önleme', 'Yakma'], 0, 'Atık kaynağında azalır.'),
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
        'Sera etkisi',
        'CO₂ ve metan gibi sera gazları yerden yayılan ısıyı tutar.\nDoğal sera etkisi yaşamı mümkün kılar.',
      ),
      kart(
        'Küresel ısınma',
        'Fosil yakıtlar sera gazı derişimini artırdı.\nTutulan ısı arttıkça ortalama sıcaklık yükseliyor.',
      ),
      kart(
        'Asit yağmurları',
        'Kükürt ve azot oksitleri suyla birleşip asit oluşturur.\nToprağı, ormanı ve yapıları aşındırır.',
      ),
      kart(
        'Ozon azalımı',
        'Ozon tabakası morötesi ışınları süzer.\nCFC’ler ozonu parçaladığı için üretimleri kısıtlandı.',
      ),
      kart(
        'Üç sorun karıştırılıyor',
        'Sera etkisi, ozon azalımı ve asit yağmuru ayrı gazlardan kaynaklanır.\nSonuçları da ayrıdır; tabloyu karşılaştır.',
        {
          tur: 'tablo',
          basliklar: ['Sorun', 'Sorumlu gaz'],
          satirlar: [
            ['Küresel ısınma', 'CO₂, CH₄'],
            ['Ozon azalımı', 'CFC’ler'],
            ['Asit yağmuru', 'SO₂, NOₓ'],
          ],
        },
        { not: 'CO₂ ve CH₄ → sera; CFC → ozon deliği; SO₂ ve NOₓ → asit yağmuru. Üç gaz üç ayrı sorun, karıştırma.' },
      ),
      kart(
        'Ozon iki yüzlü',
        '- **Yüksekteki ozon:** koruyucu\n- **Yer seviyesindeki ozon:** solunumu bozan kirletici',
      ),
      kart(
        'Ayak izleri',
        'Karbon, su ve emisyon ayak izi, bir etkinliğin doğaya yükünü ölçer.\nAzaltmanın ilk adımı ölçmektir.',
      ),
      kart(
        'Çözüm de kimya',
        '- Karbon yakalama\n- Katalitik konvertör\n- CFC yerine geçen gazlar',
      ),
      kart(
        'Sera gazları',
        '- **CO₂:** fosil yakıt, ormansızlaşma\n- **CH₄:** hayvancılık, çöp alanları, pirinç tarlası\n- **N₂O:** gübre\n- **Su buharı** ve **CFC’ler**',
      ),
      kart(
        'Asit yağmurunun kimyası',
        '- **Kükürt:** SO₂ + H₂O → H₂SO₃, sonra H₂SO₄\n- **Azot:** NOₓ yağmur suyunda HNO₃’e döner.\nKaynak kömür santralleri ve egzozdur.',
      ),
      kart(
        'Asit yağmurunun zararı',
        '- Mermer ve kireç taşından yapıtları aşındırır.\n- Göllerin pH’ını düşürüp balıkları öldürür.\n- Orman topraklarından besin tuzlarını yıkar.',
      ),
      kart(
        'Montreal Protokolü',
        '1987’de imzalandı; ozonu inceltan CFC’lerin üretimi aşamalı olarak durduruldu.\nOzon deliği o günden beri yavaş yavaş kapanıyor: küresel iş birliğinin başarılı örneği.',
      ),
      kart(
        'Paris Anlaşması',
        '2015’te imzalandı.\nHedef: küresel ısınmayı sanayi öncesine göre 2 °C’nin, mümkünse 1,5 °C’nin altında tutmak.\nÜlkeler sera gazı salımlarını azaltmayı taahhüt eder.',
      ),
      kart(
        'Fotokimyasal sis',
        'Egzozdaki azot oksitler güneş ışığında tepkimeye girip yer seviyesinde ozon ve sis oluşturur.\nKalabalık, güneşli şehirlerde görülür; solunumu zorlaştırır.',
      ),
    ], [
      soru('Sera etkisi doğal bir olaydır ve Dünya yı yaşanabilir sıcaklıkta tutar.', true, 'Sorun etkinin kendisi değil, insan kaynaklı gazlarla güçlenmesi.'),
      soru('Stratosferdeki ozon tabakası zararlı morötesi ışınları süzer.', true, 'İncelmesi cilt kanseri riskini artırıyor.'),
      soru('Asit yağmurlarının sebebi ozon tabakasının incelmesidir.', false, 'Sebep kükürt ve azot oksitlerinin havada aside dönüşmesi; iki sorun ayrı.'),
      soru('Ozon bulunduğu her yükseklikte yararlıdır.', false, 'Yer seviyesinde kirletici; yararlı olan stratosferdeki ozon.'),
      sikli('Asit yağmurları hangisine zarar verir?', ['Ozon tabakasına', 'Tarihî taş yapılara'], 1, 'Asit, kireç taşı ve mermeri aşındırır; ozonu CFC inceltir.'),
      sikli('CFC\'lerin üretimi neden kısıtlandı?', ['Ozonu parçaladıkları için', 'Asit yağmuru yaptıkları için'], 0, 'Ozon tabakası morötesi ışınları süzer; CFC onu inceltir.'),
      sikli('Küresel ısınmanın başlıca sorumlu gazları?', ['SO₂ ve NOₓ', 'CO₂ ve CH₄'], 1, 'SO₂ ve NOₓ asit yağmurunun gazları.'),
      sikli('Katalitik konvertör neye örnektir?', ['Sorunu geri çevirme çabası', 'Fosil yakıt'], 0, 'Egzoz gazlarını dönüştürür.'),
      soru('Karbon ayak izi bir etkinliğin doğaya yükünü ölçer.', true, 'Azaltmanın ilk adımı ölçmektir.'),
      soru('Metan bir sera gazıdır.', true, 'CO₂\'den daha güçlü ısı tutar.'),
      soru('Montreal Protokolü karbon dioksit salımını sınırlamak için imzalandı.', false, 'CFC\'leri sınırlamak için; ozon tabakasını korumak.'),
      soru('Asit yağmurları mermer yapıtları aşındırır.', true, 'Asit karbonatla tepkimeye girer.'),
      sikli('Asit yağmurunda kükürtün kaynağı?', ['Kömür yakılması', 'Pirinç tarlası'], 0, 'Kömürdeki kükürt SO₂ olur.'),
      sikli('Paris Anlaşması\'nın hedefi?', ['Isınmayı 2 °C altında tutmak', 'CFC üretimini durdurmak'], 0, 'CFC Montreal\'in konusu.'),
      soru('Fotokimyasal sis güneşsiz, soğuk havada oluşur.', false, 'Güneş ışığı tepkimeyi başlatır.'),
    ], [
      {
        soru: 'Ozon tabakasını parçalayan gazlar hangileridir?',
        siklar: ['Kloroflorokarbonlar (CFC)', 'Karbondioksit'],
        dogru: 0,
        aciklama: {
          dogru: 'CFC\'ler yüksekte klor salar, klor ozonu parçalar; üretimleri bu yüzden kısıtlandı.',
          yanlis: 'CO₂ sera gazıdır, küresel ısınmayla ilgili. Ozonu parçalayan CFC\'ler; üç sorunun gazları ayrı.',
        },
        kart: 4,
      },
      {
        soru: 'CFC üretimini durduran uluslararası anlaşma?',
        siklar: ['Montreal Protokolü', 'Paris Anlaşması'],
        dogru: 0,
        aciklama: {
          dogru: '1987 Montreal, ozonu inceltan CFC\'leri hedef aldı.',
          yanlis: 'Paris Anlaşması (2015) küresel ısınmayla ilgili. CFC\'yi Montreal durdurdu.',
        },
        kart: 12,
      },
    ]),
  ]),
])
