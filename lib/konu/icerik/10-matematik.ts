import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 10. sınıf Matematik — Maarif Modeli.
 *
 * Yedi tema, 9. sınıfla aynı adlar ama **farklı sırada**: bu sınıf Geometrik
 * Şekiller ile başlıyor, Sayılar üçüncü sırada. Sıra `maarif/iskelet.json`'dan
 * geliyor ve `maarif.test.ts` denetliyor — hafızadan yazılan sıra bu dosyada
 * bir kez kaymıştı.
 *
 * Eski programın "binom açılımı" ve "polinomlar" başlıkları bu programda
 * 10. sınıfta yok; sayma bölümü sayma stratejileri üzerinden ilerliyor.
 */
export const matematik10 = program('matematik', 10, 'Üçgenlerden olasılığa', [
  tema('mat10-t1', 'Geometrik Şekiller', [
    konu('mat10-trigonometri', 'Dik Üçgende Trigonometrik Oranlar ve Özdeşlikler', [
      kart(
        'Dik üçgende kenarların adı var',
        'En uzun kenar hipotenüs, yani dik açının karşısındaki kenar. Bir dar açı seç: açının tam karşısındaki kenar "karşı", açıya bitişik olan "komşu". Öteki açıyı seçersen karşı ile komşu yer değiştirir.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 5],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [6, 1],
                [6, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [5.6, 1],
                [5.6, 1.4],
                [6, 1.4],
              ],
              kirik: true,
              renk: 'soluk',
            },
          ],
          etiketler: [
            { x: 1.9, y: 1.45, ad: 'α', renk: 'ikincil' },
            { x: 3.5, y: 0.5, ad: 'komşu', renk: 'soluk' },
            { x: 6.9, y: 2.5, ad: 'karşı', renk: 'soluk' },
            { x: 3.2, y: 3.2, ad: 'hipotenüs', renk: 'soluk' },
          ],
        },
        { etiket: 'Tanım' },
      ),
      kart(
        'Sinüs, karşı kenarı hipotenüse böler',
        'Kenarları 3, 4, 5 olan dik üçgen düşün; 3\'ün karşısındaki açıya α de. sin α = karşı/hipotenüs = 3/5. "sin" sinüsün kısaltması; bir açının sinüsü bu orandır.',
      ),
      kart(
        'Kosinüs, komşu kenarı hipotenüse böler',
        'Aynı üçgende cos α = komşu/hipotenüs = 4/5. Aklında tut: sin\'de karşı, cos\'ta komşu; ikisinde de payda hipotenüs.',
      ),
      kart(
        'Tanjant karşıyı komşuya böler',
        'tan α = karşı/komşu = 3/4; hipotenüs işin içinde yok. tan aynı zamanda sin/cos: (3/5)/(4/5) = 3/4. Kotanjant bunun tersi: cot α = komşu/karşı = 4/3.',
      ),
      kart(
        'Oran açıya bağlı, üçgenin boyuna değil',
        'Kenarları 6, 8, 10 olan üçgen de aynı açıları taşır. sin α yine 6/10 = 3/5. Üçgeni büyütünce kenarlar büyür, oran değişmez. Bu yüzden 30°\'nin sinüsü her üçgende aynı sayı.',
      ),
      kart(
        'Sinüs ve kosinüs 1\'i geçemez',
        'Karşı kenar hipotenüsten uzun olamaz; oran 3/5, 4/5 gibi hep 1\'in altında. sin α = 1,2 bulursan hesap yanlış. Tanjant için sınır yok: 3/4 de olur, 100 de.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Özel açıların değerleri tablodan',
        'Kenarları 1, 1, √2 olan üçgende iki dar açı 45°: sin 45° = 1/√2 = √2/2. 30-60-90 üçgeninde kenarlar 1, √3, 2: sin 30° = 1/2, sin 60° = √3/2. cos\'ta aynı değerler ters sırada.',
        {
          tur: 'tablo',
          basliklar: ['Açı', 'sin', 'cos'],
          satirlar: [
            ['30°', '1/2', '√3/2'],
            ['45°', '√2/2', '√2/2'],
            ['60°', '√3/2', '1/2'],
          ],
        },
      ),
      kart(
        'Tümler açılarda sin ile cos yer değişir',
        'Dik üçgende iki dar açının toplamı 90°; bunlara tümler açı denir. 30°\'nin karşısı, 60°\'nin komşusu. Bu yüzden sin 30° = cos 60° = 1/2. Genel kural: sin x = cos(90° − x).',
      ),
      kart(
        'sin² + cos² her zaman 1 eder',
        '3-4-5 üçgeninde (3/5)² + (4/5)² = 9/25 + 16/25 = 1. Tesadüf değil, Pisagor\'dan geliyor: karşı² + komşu² = hipotenüs². Her açıda geçerli: sin²x + cos²x = 1. sin x verilirse cos x\'i buradan bul.',
        undefined,
        { not: 'sin x = 3/5 görünce cos x\'i 1 − 3/5 sanma; kareleri topla: cos²x = 1 − 9/25, cos x = 4/5.' },
      ),
      kart(
        'Ağacın boyunu ölçmeden bul',
        'Ağaçtan 10 m uzakta dur, tepeyi 30° yukarıda gör. tan 30° = boy/10, boy = 10·(1/√3) ≈ 5,8 m. Ölçemediğin uzunluğu bir açı ve bir uzaklık verir; trigonometri bunun için var.',
        undefined,
        { etiket: 'Örnek' },
      ),
    ], [
      soru(
        'Şekildeki üçgende sin α = 3/5 tir.',
        true,
        'Sinüs, karşı kenarın hipotenüse oranı: 3/5.',
        {
          tur: 'koordinat',
          pencere: [-0.8, 4.8, -0.8, 3.8],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 0],
                [0, 3],
              ],
              kapali: true,
              kirik: true,
            },
          ],
          etiketler: [
            { x: 0.75, y: 0.28, ad: 'α' },
            { x: 2, y: -0.4, ad: '4' },
            { x: -0.45, y: 1.5, ad: '3' },
            { x: 2.5, y: 1.9, ad: '5' },
          ],
        },
      ),
      soru('sin²x + cos²x = 1 özdeşliği bütün açılar için geçerlidir.', true, 'Pisagor\'dan geliyor: karşı² + komşu² = hipotenüs².'),
      soru('Bir açının sinüs değeri 1 den büyük olabilir.', false, 'Karşı kenar hipotenüsten uzun olamaz; oran en çok 1.'),
      soru('tan x = cos x / sin x tir.', false, 'Tersi: tan x = sin x / cos x. cos/sin kotanjant.'),
      sikli('tan x neye eşittir?', ['cos x / sin x', 'sin x / cos x'], 1, 'cot tersi.'),
      sikli('sin 30° hangi değere eşittir?', ['cos 30°', 'cos 60°'], 1, 'Tümler açı: sin x = cos(90° − x).'),
      sikli('tan 45° kaçtır?', ['√3', '1'], 1, 'Kenarları 1, 1, √2 olan üçgen: karşı/komşu = 1.'),
      sikli('cos 60° kaçtır?', ['√3/2', '1/2'], 1, 'cos 30° = √3/2.'),
      sikli('Trigonometrik oranlar neye bağlıdır?', ['Açıya', 'Üçgenin boyuna'], 0, '3-4-5 ile 6-8-10 üçgeninde oran aynı.'),
      sikli('sin x = 3/5 ise cos x kaçtır?', ['4/5', '2/5'], 0, 'cos²x = 1 − 9/25 = 16/25.'),
      soru('Tanjant değeri 1\'den büyük olabilir.', true, 'Karşı kenar komşudan uzun olabilir; tan 60° = √3.'),
      soru('sin²x + cos²x = 1 özdeşliği Pisagor\'dan gelir.', true, '(3/5)² + (4/5)² = 1.'),
    ], [
      {
        soru: 'sin 30° değeri kaçtır?',
        siklar: ['1/2', '√3/2'],
        dogru: 0,
        aciklama: {
          dogru: '30-60-90 üçgeninde 30°\'nin karşısı hipotenüsün yarısı.',
          yanlis: '√3/2, sin 60° (ve cos 30°). 30°\'nin karşısındaki kenar hipotenüsün yarısı: sin 30° = 1/2.',
        },
        kart: 7,
      },
    ]),
    konu('mat10-yardimci', 'Üçgende Yardımcı Elemanlar', [
      kart(
        'Kenarortay köşeyi kenarın ortasına bağlar',
        'ABC üçgeninde BC kenarının orta noktasına D de. A\'dan D\'ye çizilen parça kenarortay; adı da bunu söylüyor, kenarı ortalıyor. Her üçgende üç tane var, her köşeden bir tane.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Üç kenarortay ağırlık merkezinde buluşur',
        'Üç kenarortayı çiz; hepsi tek noktada kesişir, adı ağırlık merkezi (G). Kartondan üçgen kesip o noktadan parmağınla tutarsan dengede durur; ad oradan geliyor.',
      ),
      kart(
        'Ağırlık merkezi kenarortayı 2:1 böler',
        'Kenarortay 12 cm ise G, köşeden 8 cm, kenardan 4 cm uzakta. Uzun parça hep köşe tarafında. Soru "AG kaç" derse kenarortayın 2/3\'ünü al.',
        {
          tur: 'koordinat',
          pencere: [-0.5, 6.5, -0.6, 4.6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [6, 0],
                [2, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [2, 4],
                [3, 0],
              ],
              kirik: true,
              renk: 'ikincil',
            },
          ],
          noktalar: [{ x: 2.67, y: 1.33, ad: 'G' }],
          etiketler: [
            { x: 1.6, y: 2.6, ad: '2k', renk: 'ikincil' },
            { x: 2.3, y: 0.5, ad: 'k', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Açıortay açıyı ikiye böler, kenarı değil',
        'A açısı 60° olsun. A\'dan çıkan açıortay onu 30° + 30° yapar. Karşı kenarı ortalamaz; ortalayan kenarortaydı. Sık hata: ikisini aynı çizgi sanmak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Açıortaylar iç teğet çemberin merkezinde',
        'Üç açıortay tek noktada kesişir. Bu nokta üç kenara da eşit uzaklıkta. O yüzden merkezi orada olan bir çember üç kenara içeriden değer: adı iç teğet çember.',
      ),
      kart(
        'Açıortay karşı kenarı kenar oranında böler',
        'AB = 6, AC = 4 olsun. A\'dan inen açıortay BC\'yi 6:4, yani 3:2 böler. Uzun parça uzun kenarın yanında kalır. Sorularda en çok bu bağıntı çıkar.',
      ),
      kart(
        'Yükseklik köşeden karşı kenara dik iner',
        'A\'dan BC\'ye dik bir çizgi çek; adı yükseklik. Alan hesabındaki "h" bu. Geniş açılı üçgende yükseklik dışarı düşer, kenarın uzantısına iner. Üç yükseklik diklik merkezinde kesişir.',
      ),
      kart(
        'Kenar orta dikme çevrel çemberi verir',
        'Bir kenarın ortasından dik çık; köşeden geçmez, adı kenar orta dikme. Üçü tek noktada kesişir ve o nokta üç köşeye eşit uzaklıkta. Üç köşeden geçen çember (çevrel çember) merkezini oradan alır.',
      ),
      kart(
        'Dört eleman, dört merkez',
        'Sınavın klasik sorusu "hangisi nerede kesişir". Aklında tutmanın yolu: kenarlara eşit uzaklık açıortay, köşelere eşit uzaklık orta dikme. Kalan ikisi ağırlık ve diklik merkezi.',
        {
          tur: 'tablo',
          basliklar: ['Eleman', 'Eşit uzaklık', 'Merkez'],
          satirlar: [
            ['Kenarortay', '—', 'Ağırlık merkezi'],
            ['Açıortay', 'Üç kenara', 'İç teğet çember'],
            ['Yükseklik', '—', 'Diklik merkezi'],
            ['Orta dikme', 'Üç köşeye', 'Çevrel çember'],
          ],
        },
        { not: '"Nerede kesişir" sorusunda önce "neye eşit uzak" diye sor: kenara → açıortay, köşeye → orta dikme.' },
      ),
      kart(
        'İkizkenarda üç çizgi çakışır',
        'AB = AC ise A\'dan inen kenarortay, açıortay ve yükseklik aynı çizgidir. Tersi de doğru: bir köşeden çizilen ikisi çakışıyorsa üçgen ikizkenardır.',
      ),
    ], [
      soru('Ağırlık merkezi, kenarortayları köşeden başlayarak 2:1 oranında böler.', true, 'Kenarortay 12 cm ise köşeden 8, kenardan 4 cm.'),
      soru('Açıortay, bir açıyı iki eş açıya ayıran ışındır.', true, '60°\'lik açıyı 30° + 30° yapar.'),
      soru('Üçgenin yükseklikleri her zaman üçgenin içinde kesişir.', false, 'Geniş açılı üçgende yükseklik dışarı düşer, kesim noktası dışarıda kalır.'),
      soru('Kenar orta dikmelerin kesim noktası iç teğet çemberin merkezidir.', false, 'Çevrel çemberin merkezidir; iç teğet çemberin merkezi açıortayların kesişimi.'),
      sikli('Üç yükseklik nerede kesişir?', ['Ağırlık merkezinde', 'Diklik merkezinde'], 1, 'Kenarortaylar ağırlık merkezinde.'),
      sikli('Çevrel çemberin merkezi hangi doğruların kesişimidir?', ['Açıortayların', 'Kenar orta dikmelerin'], 1, 'Köşelere eşit uzaklık orta dikme.'),
      sikli('İç açıortay karşı kenarı hangi oranda böler?', ['Eşit iki parçaya', 'Komşu kenarların oranında'], 1, 'AB = 6, AC = 4 ise 3:2.'),
      sikli('Tepeden inen açıortay, kenarortay ve yükseklik çakışıyorsa üçgen?', ['Çeşitkenar', 'İkizkenar'], 1, 'Çakışma ikizkenarın işareti.'),
      sikli('Kenarortay 12 cm ise köşeden ağırlık merkezine kaç cm?', ['8', '4'], 0, 'Uzun parça köşe tarafında: 12\'nin 2/3\'ü.'),
      soru('Açıortay karşı kenarı iki eşit parçaya böler.', false, 'Kenarı ortalayan kenarortay; açıortay kenarı komşu kenarların oranında böler.'),
      soru('Ağırlık merkezi kenarortayı 2:1 böler, uzun parça köşe tarafındadır.', true, 'Köşeden 2k, kenardan k.'),
    ], [
      {
        soru: 'Üç açıortay nerede kesişir?',
        siklar: ['İç teğet çemberin merkezinde', 'Çevrel çemberin merkezinde'],
        dogru: 0,
        aciklama: {
          dogru: 'Açıortay üstündeki nokta iki kenara eşit uzaklıkta; kesişim üç kenara teğet çemberin merkezi.',
          yanlis: 'Çevrel çemberin merkezi kenar orta dikmelerin kesişimi. Açıortaylar iç teğet çemberin merkezinde buluşur.',
        },
        kart: 5,
      },
    ]),
    konu('mat10-alan', 'Üçgenin Alanı', [
      kart(
        'Alan: taban çarpı yükseklik, bölü iki',
        'Tabanı 6, yüksekliği 4 olan üçgen: alan = 6·4/2 = 12. Neden bölü 2? Aynı ölçülerdeki dikdörtgenin yarısı. Yükseklik tabana dik olmalı; eğik kenarı yükseklik sanma.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Yükseklik yoksa aradaki açı işini görür',
        'İki kenar 5 ve 8, aralarındaki açı 30° olsun. Alan = (1/2)·5·8·sin 30° = 20·(1/2) = 10. Açı iki kenarın ARASINDA olmalı; karşıdaki açı işe yaramaz.',
        undefined,
        { not: 'Sinüslü formülde açı, çarptığın iki kenarın arasındaki açı olmalı; başka açı görünce formülü uygulama.' },
      ),
      kart(
        'Yükseklik aynıysa alanlar tabana göre',
        'İki üçgen aynı tepeden aynı doğruya insin; yükseklikleri ortak. Tabanları 2 ve 6 ise alanları da 2:6 = 1:3. Yükseklik ikisinde de aynı olduğu için oranda sadeleşir.',
      ),
      kart(
        'Kenarortay alanı tam ikiye böler',
        'Kenarortay tabanı iki eşit parçaya böler, tepe ortak; yükseklik de ortak. İki parçanın alanı eşit. Çevreleri eşit değil, yalnızca alanları.',
        {
          tur: 'koordinat',
          pencere: [-0.5, 6.5, -0.6, 4.6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [6, 0],
                [2, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [2, 4],
                [3, 0],
              ],
              kirik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 1.5, y: 1.1, ad: 'S', renk: 'ikincil' },
            { x: 3.7, y: 1.1, ad: 'S', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Benzerlikte alan oranı karedir',
        'Bir üçgenin kenarlarını 2 katına çıkar. Taban 2 kat, yükseklik 2 kat: alan 4 kat. Benzerlik oranı k ise alan oranı k². 3 kat büyütürsen alan 9 kat olur, 3 kat değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Ortak açı varsa kenar çarpımlarına bak',
        'İki üçgen A açısını paylaşsın. Birinde A\'daki kenarlar 2 ve 3, ötekinde 4 ve 6. Alan oranı (2·3)/(4·6) = 1/4. Sebebi sinüslü formül: sin A ikisinde de aynı, sadeleşir.',
      ),
      kart(
        'Elindeki veri formülü seçer',
        'Soruya bakınca önce "ne verilmiş" diye say. Yükseklik varsa temel formül, aradaki açı varsa sinüslü. Formülü ezberlemek yetmez; hangisinin ne zaman olduğunu bil.',
        {
          tur: 'tablo',
          basliklar: ['Elinde ne var', 'Formül', 'Örnek'],
          satirlar: [
            ['Taban + yükseklik', 't·h/2', '6, 4 → 12'],
            ['İki kenar + ara açı', '½·a·b·sin C', '5, 8, 30° → 10'],
            ['Ortak yükseklik', 'Tabanlar oranı', '2:6 → 1:3'],
          ],
        },
      ),
    ], [
      soru('Üçgenin alanı, taban ile ona ait yüksekliğin çarpımının yarısıdır.', true, 'Hangi kenar taban seçilirse seçilsin sonuç aynı.'),
      soru('Tabanları ve yükseklikleri eşit olan üçgenlerin alanları eşittir.', true, 'Şekilleri farklı olsa da alan aynı kalıyor.'),
      soru('Benzerlik oranı k olan iki üçgenin alanları oranı da k dır.', false, 'Alan oranı k² olur; 2 kat büyüyen üçgenin alanı 4 kat.'),
      soru('İki kenarı ve aradaki açısı bilinen bir üçgenin alanı hesaplanamaz.', false, 'Alan = (1/2)·a·b·sin C ile hesaplanıyor.'),
      sikli('İki kenarı ve aradaki açısı bilinen üçgenin alanı?', ['a·b·sin C', '(1/2)·a·b·sin C'], 1, 'Yarısı unutulmasın: 5, 8, 30° için 10.'),
      sikli('Bir açısı ortak iki üçgende alan oranı?', ['Tabanlar oranı', 'Açıyı oluşturan kenarların çarpımları oranı'], 1, 'sin A ikisinde de aynı, sadeleşir.'),
      sikli('Kenarları 3 kat büyütülen üçgenin alanı kaç kat olur?', ['9', '3'], 0, 'Alan oranı k² = 9.'),
      soru('Yükseklikleri eşit üçgenlerde alanlar oranı tabanlar oranına eşittir.', true, 'Yükseklik oranda sadeleşir.'),
    ], [
      {
        soru: 'Kenarortay üçgeni nasıl iki parçaya böler?',
        siklar: ['Çevreleri eşit iki üçgen', 'Alanları eşit iki üçgen'],
        dogru: 1,
        aciklama: {
          dogru: 'Tabanları eşit, yükseklikleri ortak: alanlar eşit.',
          yanlis: 'Çevreler genelde farklı. Kenarortay tabanı ortaladığı ve yükseklik ortak olduğu için alanları eşitler.',
        },
        kart: 4,
      },
    ]),
    konu('mat10-sinus-kosinus', 'Sinüs ve Kosinüs Teoremleri', [
      kart(
        'Sinüs teoremi kenarı karşı açısına bağlar',
        'Her kenarı karşısındaki açının sinüsüne böl. Üç bölüm de aynı çıkar: a/sin A = b/sin B = c/sin C. Örnek: A = 30°, a = 5, B = 90°. 5/(1/2) = b/1, yani b = 10.',
      ),
      kart(
        'Sinüs teoremi kenar-açı çifti ister',
        'Bir kenar ve tam karşısındaki açı bilinmeli. Üstüne bir şey daha lazım: başka bir açı ya da kenar. O zaman sinüs teoremi çalışır. Kenar-karşı açı çifti yoksa bu teorem işe yaramaz.',
      ),
      kart(
        'Ortak oran çevrel çemberin çapı',
        'a/sin A oranı yalnızca sabit değil, üçgenin çevrel çemberinin çapına eşit: a/sin A = 2R. Çevrel çember, üç köşeden geçen çember. a = 5, A = 30° ise 2R = 10, R = 5.',
      ),
      kart(
        'Kosinüs teoremi üçüncü kenarı bulur',
        'b = 3, c = 4, aradaki açı A = 60° olsun. a² = 3² + 4² − 2·3·4·cos 60° = 9 + 16 − 12 = 13, a = √13. İki kenar ve ARALARINDAKİ açı verilince bu formül.',
      ),
      kart(
        'Dik açıda kosinüs teoremi Pisagor olur',
        'A = 90° koy: cos 90° = 0, son terim düşer. Geriye a² = b² + c² kalır: Pisagor. Yani Pisagor, kosinüs teoreminin özel hâli. Formülü unutursan Pisagor\'un sonuna −2bc·cos A ekle.',
      ),
      kart(
        'Üç kenar verilince açıyı kosinüs verir',
        'Kenarlar 5, 6, 7 ise en büyük açı 7\'nin karşısında. 49 = 25 + 36 − 60·cos A, cos A = 12/60 = 1/5. Kosinüs pozitif çıktı, açı dar. Negatif çıksaydı açı geniş olurdu.',
        undefined,
        { not: 'cos A negatif çıkınca hesabı yanlış sanma; A\'nın 90°\'den büyük olduğunu söylüyor.' },
      ),
      kart(
        'Hangi teorem: eldeki üçlüye bak',
        'Önce verileni yaz. Bir kenar ve karşısındaki açı çift oluşturuyorsa sinüs. Açı iki kenarın arasında kalıyorsa ya da üç kenar verilmişse kosinüs.',
        {
          tur: 'tablo',
          basliklar: ['Bilinen', 'Teorem', 'Örnek'],
          satirlar: [
            ['Kenar + karşı açı', 'Sinüs', 'a, A, B'],
            ['İki kenar + ara açı', 'Kosinüs', 'b, c, A'],
            ['Üç kenar', 'Kosinüs', 'a, b, c'],
          ],
        },
      ),
    ], [
      soru('Kosinüs teoremi, dik üçgende Pisagor teoremine dönüşür.', true, '90° nin kosinüsü sıfır olduğu için son terim kayboluyor.'),
      soru('İki kenar ve aradaki açı biliniyorsa üçüncü kenar kosinüs teoremiyle bulunur.', true, 'Sinüs teoremi bu durumda yetmiyor; kenar-karşı açı çifti yok.'),
      soru('Sinüs teoremi yalnızca dik üçgenlerde kullanılır.', false, 'Her üçgende geçerli; kenarlar ile karşı açıların sinüsleri orantılı.'),
      soru('Kosinüs teoreminde bulunan kosinüs değeri negatifse karşı açı dardır.', false, 'Negatif kosinüs geniş açı demek.'),
      sikli('Sinüs teoremindeki ortak oran neye eşittir?', ['2R (çevrel çap)', 'R'], 0, 'a/sin A = 2R.'),
      sikli('Kosinüs teoreminde cos A negatif çıkarsa A açısı?', ['Geniş', 'Dar'], 0, 'Üçgenin türü hesaptan okunur.'),
      soru('Kenarları 5, 6, 7 olan üçgende en büyük açı 7\'nin karşısındadır.', true, 'Büyük kenarın karşısında büyük açı.'),
      soru('A = 90° iken kosinüs teoremi Pisagor\'a dönüşür.', true, 'cos 90° = 0.'),
    ], [
      {
        soru: 'İki kenar ve aradaki açı biliniyorsa hangi teorem kullanılır?',
        siklar: ['Kosinüs teoremi', 'Sinüs teoremi'],
        dogru: 0,
        aciklama: {
          dogru: 'a² = b² + c² − 2bc·cos A üçüncü kenarı doğrudan verir.',
          yanlis: 'Sinüs teoremi kenar-karşı açı çifti ister. İki kenar ve aralarındaki açı kosinüs teoreminin girdisi.',
        },
        kart: 4,
      },
    ]),
  ]),
  tema('mat10-t2', 'İstatistiksel Araştırma Süreci', [
    konu('mat10-kategorik', 'İki Kategorik Değişkenli Veriler', [
      kart(
        'Kategorik değişken sayı değil grup söyler',
        'Göz rengi: kahverengi, yeşil, mavi. Sayılmıyor, gruplara ayrılıyor; buna kategorik değişken denir. Boy ya da yaş sayıyla ölçülür, onlara nicel denir. "Kaç kişi" bir sayıdır ama sayılan şey kategori.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İki değişkeni tek tabloda birleştir',
        'Sınıf (9/10) ve "kulübe katılıyor musun" (evet/hayır) aynı öğrencilere sorulsun. Satır sınıf, sütun cevap: 9. sınıftan 40 evet, 60 hayır. Kesişimdeki sayı ikisini birden taşıyan kişi. Adı iki yönlü tablo.',
        {
          tur: 'tablo',
          basliklar: ['', 'Evet', 'Hayır'],
          satirlar: [
            ['9. sınıf', '40', '60'],
            ['10. sınıf', '70', '30'],
          ],
        },
      ),
      kart(
        'Kenar toplamları tek değişkeni anlatır',
        'Satırları topla: 9. sınıf 100, 10. sınıf 100. Sütunları topla: evet 110, hayır 90. Bu toplamlar tablonun kenarında durur; adı marjinal dağılım. Yalnızca bir değişkeni sayar, ötekini unutur.',
      ),
      kart(
        'Yüzde alırken neye böldüğünü söyle',
        '9. sınıftaki 40 evet cevabı: satıra göre 40/100 = %40, sütuna göre 40/110 ≈ %36. Aynı sayı, iki yüzde. "Yüzde 40" tek başına bir şey demez; paydası söylenmeli.',
        undefined,
        { not: 'Bir yüzde görünce ilk sorun şu: 100\'ün neresi? Satır toplamı mı, sütun toplamı mı?' },
      ),
      kart(
        'Satır yüzdeleri farklıysa ilişki var',
        '9. sınıfta evet %40, 10. sınıfta %70. Sınıf değişince cevabın dağılımı değişiyor: iki değişken ilişkili. İki satırda yüzdeler aynı olsaydı "sınıfın cevaba etkisi yok" derdik.',
      ),
      kart(
        'İlişki, sebep demek değil',
        'Dondurma satışı ile boğulma sayısı birlikte artar. Dondurma boğulmaya sebep olmaz; ikisini de yaz sıcağı artırır. Tabloda ilişki görünce "biri ötekini yapıyor" deme; üçüncü bir etken olabilir.',
        undefined,
        { etiket: 'Dikkat' },
      ),
    ], [
      soru('İki yönlü tabloda satır yüzdesi ile sütun yüzdesi farklı sorulara cevap verir.', true, 'Aynı 40, satıra göre %40, sütuna göre %36.'),
      soru('Marjinal dağılım, tablonun kenarındaki toplam satır ve sütunlardan okunur.', true, 'Tek bir değişkenin dağılımını veriyor.'),
      soru('Göz rengi nicel bir değişkendir.', false, 'Sayıyla ölçülmüyor, gruplara ayrılıyor; kategorik değişken.'),
      soru('İki kategorik değişken arasında ilişki bulunması, birinin ötekine sebep olduğunu gösterir.', false, 'İlişki nedensellik değil; dondurma ile boğulmayı sıcak bağlar.'),
      sikli('Meslek hangi tür değişkendir?', ['Nicel', 'Kategorik'], 1, 'Sayılmıyor, gruplanıyor.'),
      sikli('Satır ve sütun yüzdesinin farklı çıkmasının sebebi?', ['Hesap hatası', 'Bölünen toplam farklı'], 1, 'Payda 100 ile 110 farklı.'),
      soru('Bir değişkenin dağılımı ötekine göre değişiyorsa ilişki vardır.', true, '%40 ile %70 farklı; sınıf cevabı etkiliyor.'),
    ], [
      {
        soru: 'İki yönlü tablonun kenar toplamlarına ne denir?',
        siklar: ['Marjinal dağılım', 'Koşullu dağılım'],
        dogru: 0,
        aciklama: {
          dogru: 'Kenar toplamları tek bir değişkenin dağılımını verir.',
          yanlis: 'Koşullu dağılım bir satır ya da sütunun içindeki yüzdeler. Kenar toplamları marjinal dağılım.',
        },
        kart: 3,
      },
    ]),
    konu('mat10-kategorik-inceleme', 'Başkalarının Oluşturduğu Kategorik Verileri İnceleme', [
      kart(
        'Önce veriyi kim topladı diye bak',
        'Bir gazoz markası "insanların %80\'i gazozumuzu seviyor" diyor. Anketi kendi yapmış, kendi müşterisine sormuş. Sayı doğru olabilir; ama kimin, neden topladığı sonucun anlamını değiştirir.',
      ),
      kart(
        'Sorunun kuruluşu cevabı yönlendirir',
        '"Zararlı olan sigara yasaklansın mı" diye sorarsan evetler artar. "Sigara yasaklansın mı" daha dürüst. Yönlendirici soruyla toplanan veri düzgün hesaplansa bile yanlış sonuç verir.',
      ),
      kart(
        'Sunulmayan seçenek sayılmaz',
        'Ankette "en sevdiğin spor: futbol, basketbol, diğer". Yüzme sevenler "diğer"e düşer. "Diğer" %40 çıktıysa tablo bir şey anlatmıyor. Seçenek listesi eksikse yüzdeler bozulur.',
      ),
      kart(
        'Yüzdenin arkasındaki sayıyı sor',
        '2 kişiye sordun, 1\'i evet dedi: %50. 2000 kişiden 1000 evet de %50. Yüzde ikisini aynı gösterir; ama ilkine güvenilmez. Kaç kişiye sorulduğunu bilmeden yüzde okuma.',
        undefined,
        { not: '%50 görünce önce "kaç kişiden" diye sor; 2 kişilik %50 hiçbir şey söylemez.' },
      ),
      kart(
        'Grafik göze yalan söyleyebilir',
        'Aynı %30, üç boyutlu pastada öndeyse büyük, arkadaysa küçük görünür. Sütun grafiğinin ekseni 0\'dan değil 90\'dan başlarsa küçük fark uçurum gibi durur. Sayıyı oku, alanı değil.',
      ),
      kart(
        'Cevap vermeyenler de bir grup',
        '1000 kişiye anket gönderdin, 100\'ü cevapladı. Cevaplayanlar konuyu önemseyenler; gerisi sessiz. Sonuç 1000 kişinin değil, cevaplamayı seçen 100\'ün görüşü. Yanıt oranı düşükse buna dikkat.',
      ),
    ], [
      soru('Anket sorusunun nasıl sorulduğu verilen cevapları etkileyebilir.', true, '"Zararlı olan sigara" diye başlayan soru evetleri artırır.'),
      soru('Yüzdeyle verilen bir sonuçta toplam sayının bilinmesi önemlidir.', true, '2 kişiden 1\'i de %50, 2000 kişiden 1000\'i de.'),
      soru('Ankete cevap vermeyenlerin varlığı sonucun yorumunu etkilemez.', false, 'Cevap vermeyenler belirli bir grupsa sonuç yalnızca cevaplayanları anlatır.'),
      soru('Bir tabloda bazı kategorilerin gösterilmemesi sonucu değiştirmez.', false, 'Eksik seçenek "diğer"i şişirir, kalan yüzdeleri bozar.'),
      sikli('Yönlendirici soruyla toplanan veri?', ['Geçerlidir', 'Geçersizdir'], 1, 'Doğru hesaplansa bile.'),
      sikli('2 kişiden 1\'i "yüzde 50" diye sunulursa sorun nedir?', ['Yanlış yüzde', 'Küçük örneklem'], 1, 'Yüzde doğru ama 2 kişi az.'),
      soru('Üç boyutlu grafik oranları doğru gösterir.', false, 'Öndeki dilim büyük görünür; sayıyı oku, alanı değil.'),
    ], [
      {
        soru: 'Yanıt oranı düşük bir anket kimin görüşünü yansıtır?',
        siklar: ['Katılmayı seçenlerin', 'Bütün toplumun'],
        dogru: 0,
        aciklama: {
          dogru: 'Cevaplayanlar konuyu önemseyenler; gerisi sessiz kaldı.',
          yanlis: 'Cevaplamayanlar rastgele bir grup değil. Düşük yanıtta sonuç yalnızca cevaplamayı seçenleri anlatır.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('mat10-t3', 'Sayılar', [
    konu('mat10-asal-carpan', 'Bir Doğal Sayının Asal Çarpanları ve Bölenleri', [
      kart(
        'Asal sayının tam iki böleni var',
        '7\'yi bölen sayılar: 1 ve 7, başka yok. Tam iki böleni olan sayı asal: 2, 3, 5, 7, 11, 13… 6 asal değil; 2 ve 3 de böler. 2 tek çift asal, öteki çiftleri 2 böler.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        '1 asal değil',
        '1\'in tek böleni var: kendisi. "Tam iki bölen" şartı tutmuyor. Asal sayılsaydı 6 = 2·3 = 1·2·3 = 1·1·2·3 olurdu; çarpanlara ayırma tek olmaktan çıkardı.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Her sayı asalların çarpımıdır',
        '360\'ı en küçük asaldan başlayarak böl: 2, 2, 2, 3, 3, 5. Yani 360 = 2³·3²·5. Bu yazılış tek; başka asal kümesiyle 360 elde edemezsin. Sonraki kartların hepsi bu yazılıştan çıkıyor.',
        {
          tur: 'akis',
          adimlar: [
            { ad: '360' },
            { ad: '2³ · 45' },
            { ad: '2³ · 3² · 5' },
          ],
        },
      ),
      kart(
        'Bölen sayısı: üsleri bir artır, çarp',
        '360 = 2³·3²·5¹. Üslere 1 ekle: 4, 3, 2. Çarp: 4·3·2 = 24. 360\'ın 24 pozitif böleni var. Neden +1? 2\'yi 0, 1, 2 ya da 3 kez alabilirsin: dört seçenek.',
      ),
      kart(
        'Asal bölen sayısı ayrı bir soru',
        '360\'ın 24 böleni var ama asal böleni yalnızca 3: 2, 3 ve 5. Soru "kaç asal böleni var" derse üsleri hiç kullanma, farklı asalları say.',
        undefined,
        { not: '"Bölen sayısı" ile "asal bölen sayısı" iki ayrı soru; 360 için 24 ile 3\'ü karıştırma.' },
      ),
      kart(
        'Tek bölenler için 2\'yi at',
        '360\'ın tek bölenleri 2 içermez. 2³\'ü at, kalan 3²·5\'in bölenlerini say: (2+1)(1+1) = 6. Çift bölen sayısı da toplamdan tek olanı çıkar: 24 − 6 = 18.',
      ),
      kart(
        'Bölen toplamı: kuvvetleri topla, çarp',
        '12 = 2²·3. 2\'nin kuvvetleri: 1 + 2 + 4 = 7. 3\'ün kuvvetleri: 1 + 3 = 4. Çarp: 7·4 = 28. Kontrol: 1 + 2 + 3 + 4 + 6 + 12 = 28.',
      ),
      kart(
        'Tam karede bölen sayısı tek çıkar',
        '36 = 2²·3², bölen sayısı 3·3 = 9. Tek çıktı. Sebep: bölenler eşleşir (1·36, 2·18, 3·12, 4·9) ama 6·6 kendisiyle eşleşir. Bölen sayısı tekse sayı tam kare, üsleri de çift.',
      ),
    ], [
      soru('1 sayısı asal sayı değildir.', true, 'Asal sayının tam iki pozitif böleni olmalı; 1\'in tek böleni var.'),
      soru('72 = 2³ · 3² olduğuna göre 72 nin pozitif bölen sayısı 12 dir.', true, 'Üsler birer artırılıp çarpılıyor: 4 · 3 = 12.'),
      soru('Tam kare sayıların pozitif bölen sayısı çifttir.', false, 'Tam karelerde bölen sayısı tektir; ortadaki bölen kendisiyle eşleşiyor.'),
      soru('2 sayısı çift olduğu için asal değildir.', false, '2\'nin böleni 1 ve 2, tam iki tane; tek çift asal.'),
      sikli('Tek çift asal sayı?', ['1', '2'], 1, '1 asal değil.'),
      sikli('360\'ın asal böleni kaç tanedir?', ['24', '3'], 1, '2, 3, 5.'),
      sikli('Tam kare sayının bölen sayısı?', ['Çifttir', 'Tektir'], 1, '36\'nın 9 böleni var.'),
      sikli('1 asal sayılsaydı ne olurdu?', ['Hiçbir şey değişmezdi', 'Asal çarpanlara ayırma tek olmazdı'], 1, '6 = 1·2·3 = 1·1·2·3.'),
      sikli('Bölenlerin toplamı nasıl bulunur?', ['Her asalın kuvvet toplamları çarpılır', 'Bölenler tek tek yazılır'], 0, '12 için 7·4 = 28.'),
      soru('Her doğal sayı asalların çarpımı olarak tek biçimde yazılır.', true, '360 = 2³·3²·5, başka yolu yok.'),
    ], [
      {
        soru: '72 = 2³·3² sayısının pozitif bölen sayısı?',
        siklar: ['5', '12'],
        dogru: 1,
        aciklama: {
          dogru: '(3+1)(2+1) = 12.',
          yanlis: '5 üslerin toplamı; formül üslerin birer fazlasının çarpımı: 4·3 = 12.',
        },
        kart: 4,
      },
    ]),
    konu('mat10-ebob-ekok', 'En Büyük Ortak Bölen, En Küçük Ortak Kat', [
      kart(
        'Ortak bölenlerin en büyüğü EBOB',
        '12\'yi bölenler: 1, 2, 3, 4, 6, 12. 18\'i bölenler: 1, 2, 3, 6, 9, 18. Ortak olanlar 1, 2, 3, 6; en büyüğü 6. EBOB(12, 18) = 6. Yani ikisini de bölen en büyük sayı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'EBOB: ortak asalların küçük üsleri',
        '12 = 2²·3, 18 = 2·3². Ortak asallar 2 ve 3. Küçük üsleri al: 2¹·3¹ = 6. Yalnızca ikisinde de olan asallar girer; birinde olmayan asal EBOB\'a giremez.',
      ),
      kart(
        'Ortak katların en küçüğü EKOK',
        '12\'nin katları: 12, 24, 36, 48… 18\'in katları: 18, 36, 54… İlk ortak kat 36. EKOK(12, 18) = 36. Yani ikisinin de katı olan en küçük sayı.',
      ),
      kart(
        'EKOK: bütün asalların büyük üsleri',
        '12 = 2²·3, 18 = 2·3². Bütün asalları al, büyük üsleriyle: 2²·3² = 36. EBOB küçüğü seçer, EKOK büyüğü; EBOB hiçbir zaman EKOK\'tan büyük olmaz.',
        {
          tur: 'tablo',
          basliklar: ['', 'EBOB', 'EKOK'],
          satirlar: [
            ['Çarpan', 'Ortak olan', 'Hepsi'],
            ['Üs', 'En küçük', 'En büyük'],
            ['12 ve 18', '2·3 = 6', '2²·3² = 36'],
          ],
        },
      ),
      kart(
        'EBOB çarpı EKOK, sayıların çarpımı',
        '6·36 = 216 ve 12·18 = 216. Tesadüf değil: EBOB·EKOK = a·b. Soruda biri verilmiş, öteki soruluyorsa çarpıp böl. Yalnızca iki sayıda geçerli; üç sayıda bu bağıntı bozulur.',
      ),
      kart(
        'EBOB 1 ise aralarında asal',
        '8 ile 15\'in ortak asalı yok: 8 = 2³, 15 = 3·5. EBOB = 1; böyle sayılara aralarında asal denir. İkisi de asal olmak zorunda değil; 8 de 15 de asal değil. EKOK\'ları çarpımları: 120.',
      ),
      kart(
        '"En büyük parça" EBOB, "yine birlikte" EKOK',
        '12 m ve 18 m\'lik iki ipi eşit ve en uzun parçalara kes: EBOB, 6 m. 12 ve 18 dakikada bir kalkan iki otobüs ne zaman birlikte kalkar: EKOK, 36 dakika. Bölme küçültür, buluşma büyütür.',
        undefined,
        { not: 'Soruda "parçala, eşit böl" görürsen EBOB; "tekrar aynı anda" görürsen EKOK. Formülden önce bunu yaz.' },
      ),
    ], [
      soru('İki sayının EBOB u ile EKOK unun çarpımı, sayıların çarpımına eşittir.', true, '6·36 = 12·18 = 216.'),
      soru('Aralarında asal iki sayının EBOB u 1 dir.', true, 'Ortak asal çarpanları yok.'),
      soru('EKOK, iki sayının ortak bölenlerinin en büyüğüdür.', false, 'O tanım EBOB\'a ait; EKOK ortak katların en küçüğü.'),
      soru('Bir odayı tam sayıda eş kare fayansla kaplarken EKOK kullanılır.', false, 'En büyük kare fayansın kenarı EBOB ile bulunur; bölme küçültür.'),
      sikli('12 ile 18\'in EBOB\'u?', ['36', '6'], 1, 'Küçük üsler: 2·3.'),
      sikli('EBOB\'u 1 olan sayılar?', ['Asal', 'Aralarında asal'], 1, '8 ile 15 gibi; ikisi de asal değil.'),
      sikli('"En büyük parça" sorusunda ne kullanılır?', ['EKOK', 'EBOB'], 1, 'Eşit bölme küçültür.'),
      soru('EBOB · EKOK = a · b\'dir.', true, 'İki sayı için temel bağıntı.'),
    ], [
      {
        soru: '"İki otobüs kaç dakika sonra yine birlikte kalkar?" sorusunda ne kullanılır?',
        siklar: ['EBOB', 'EKOK'],
        dogru: 1,
        aciklama: {
          dogru: 'Birlikte tekrar eden olay ortak katı sorar: 12 ve 18 için 36 dakika.',
          yanlis: 'EBOB "en büyük parça / kaç eşit grup" sorularında. Tekrar eden olayların yeniden çakışması en küçük ortak kat.',
        },
        kart: 7,
      },
    ]),
    konu('mat10-bolunebilme', 'Bölünebilme', [
      kart(
        '2, 5 ve 10 için son basamağa bak',
        '4.736: son basamak 6, çift, yani 2\'ye bölünür. 5\'e bölünme için son basamak 0 ya da 5; 10 için 0 olmalı. 4.735 5\'e bölünür ama 2\'ye bölünmez. Yalnızca son rakam yeter.',
      ),
      kart(
        '4 ve 8 için son iki-üç basamağa bak',
        '100 zaten 4\'e bölünür; geriye son iki basamak kalır. 3.716 → 16, 4\'e bölünür. 1000 da 8\'e bölünür; son üç basamağa bak: 5.128 → 128 = 8·16, bölünür.',
      ),
      kart(
        '3 ve 9 için rakamları topla',
        '2.457: rakam toplamı 2 + 4 + 5 + 7 = 18. 18 hem 3\'e hem 9\'a bölünür; sayı da ikisine bölünür. 1.236\'nın toplamı 12: 3\'e bölünür, 9\'a bölünmez. 3\'e bölünen her sayı 9\'a bölünmez.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        '11 için dönüşümlü topla',
        '1.837: sağdan başla, işareti değiştire değiştire topla: 7 − 3 + 8 − 1 = 11. Sonuç 11\'in katıysa (0 da katı) sayı 11\'e bölünür. 1.837 = 11·167.',
      ),
      kart(
        'Kurallar üç öbekte toplanır',
        'Hepsini ayrı ayrı ezberleme, üç öbeğe ayır: sonuna bakılanlar, rakamları toplananlar, dönüşümlü toplanan. Örnek sütununu kapatıp kendin yeniden hesapla.',
        {
          tur: 'tablo',
          basliklar: ['Bölen', 'Nereye bak', 'Örnek'],
          satirlar: [
            ['2, 5, 10', 'Son basamak', '4.736 → 6'],
            ['4, 8', 'Son 2-3 basamak', '3.716 → 16'],
            ['3, 9', 'Rakam toplamı', '2.457 → 18'],
            ['11', 'Dönüşümlü toplam', '1.837 → 11'],
          ],
        },
      ),
      kart(
        '6 için 2 ve 3\'ü birlikte kontrol et',
        '6 = 2·3 ve 2 ile 3\'ün ortak böleni yok, yani aralarında asal. 6\'ya bölünme: hem çift olacak hem rakam toplamı 3\'e bölünecek. 1.236 çift, toplamı 12: 6\'ya bölünür.',
      ),
      kart(
        '12 için 2 ve 6 yetmez',
        '6 sayısı 2\'ye de 6\'ya da bölünür ama 12\'ye bölünmez. Sebep: 2 ile 6 aralarında asal değil. 12\'yi aralarında asal parçalara ayır: 3·4. Hem 3\'e hem 4\'e bölünen sayı 12\'ye bölünür.',
        undefined,
        { etiket: 'Sık hata', not: 'Bileşik kural kurmadan önce iki parçanın ortak böleni var mı diye bak; varsa kural çalışmaz.' },
      ),
      kart(
        'Kural bölünmüyorsa kalanı da verir',
        '1.236\'nın rakam toplamı 12; 12\'nin 9\'a bölümünden kalan 3. Sayının 9\'a bölümünden kalan da 3. 2 ve 5\'te son basamak, 4\'te son iki basamak kalanı verir. Kural "bölünüyor mu"dan fazlasını söylüyor.',
      ),
    ], [
      soru('Rakamları toplamı 9 un katı olan sayı 9 a bölünür.', true, '2.457\'nin toplamı 18; 9\'a bölünür.'),
      soru('Son iki basamağı 4 ün katı olan sayı 4 e bölünür.', true, '100 zaten 4\'e bölünüyor; geriye son iki basamak kalıyor.'),
      soru('Rakamları toplamı 3 ün katı olan her sayı 9 a da bölünür.', false, '12\'nin rakam toplamı 3; 3\'e bölünüyor ama 9\'a bölünmüyor.'),
      soru('Hem 4 e hem 6 ya bölünen bir sayı 24 e de bölünür.', false, '4 ile 6 aralarında asal değil; garanti olan 12\'ye bölünmesi.'),
      sikli('Son iki basamağı 4\'e bölünen sayı?', ['8\'e bölünür', '4\'e bölünür'], 1, '8 için son üç basamak gerekir.'),
      sikli('6\'ya bölünme için hangi ikisine bakılır?', ['2 ve 4', '2 ve 3'], 1, '2 ile 3 aralarında asal.'),
      sikli('Rakamları toplamı 9\'a bölünen sayı?', ['11\'e bölünür', '9\'a bölünür'], 1, '11 için dönüşümlü toplam.'),
      sikli('Bir sayının 9\'a bölümünden kalan nasıl bulunur?', ['Son basamaktan', 'Rakamlar toplamının 9\'a bölümünden'], 1, 'Kural kalanı da verir.'),
      soru('Son basamağı 0 olan sayı hem 2\'ye hem 5\'e bölünür.', true, '10\'a da bölünür.'),
    ], [
      {
        soru: 'Bir sayının 12\'ye bölünüp bölünmediği nasıl anlaşılır?',
        siklar: ['Hem 3\'e hem 4\'e bölünmeli', 'Hem 2\'ye hem 6\'ya bölünmeli'],
        dogru: 0,
        aciklama: {
          dogru: '3 ile 4 aralarında asal; 2 ile 6 değil.',
          yanlis: '2 ve 6 aralarında asal olmadığı için yetmez: 6 sayısı 2\'ye de 6\'ya da bölünür ama 12\'ye bölünmez. Doğrusu 3 ve 4.',
        },
        kart: 7,
      },
    ]),
  ]),
  tema('mat10-t4', 'Nicelikler ve Değişimler', [
    konu('mat10-fonksiyon-sart', 'Gerçek Sayılarda Fonksiyon Olma Şartları', [
      kart(
        'Fonksiyon her girdiye tek çıktı verir',
        'Bir makine düşün: 2 atıyorsun, 4 çıkıyor. Her sayı için bir çıktı var ve hep aynı çıktı. Buna fonksiyon denir. Girdilerin kümesi tanım kümesi, çıktıların gidebileceği küme değer kümesi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Bir girdiye iki çıktı olmaz',
        'x = 4\'e hem 2 hem −2 veren kural (y² = x) fonksiyon değil. Tanım kümesinde açıkta kalan eleman da olmaz; her girdinin karşılığı olacak. İki şart: hepsi eşlensin, tek eşlensin.',
      ),
      kart(
        'Düşey doğru testi grafiğe bakar',
        'Grafiğe düşey çizgiler çek. Bir çizgi eğriyi iki noktada kesiyorsa o x\'e iki y var: fonksiyon değil. Çember bu yüzden fonksiyon değil; y = x² parabolü fonksiyon.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -3, 3],
          xAd: 'x',
          yAd: 'y',
          cemberler: [{ x: 0, y: 0, r: 2 }],
          egriler: [
            {
              noktalar: [
                [1, -3],
                [1, 3],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          noktalar: [
            { x: 1, y: 1.73, renk: 'ikincil' },
            { x: 1, y: -1.73, renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Payda sıfır olamaz',
        'f(x) = 1/(x − 3): x = 3 yazınca payda 0, tanımsız. Tanım kümesi 3 dışındaki bütün gerçek sayılar: ℝ − {3}. Paydayı sıfır yapan sayıyı tanım kümesinden at.',
      ),
      kart(
        'Çift dereceli kökün içi negatif olamaz',
        'f(x) = √(x − 3): x = 1 için kök içi −2, gerçek sayı değil. Şart: x − 3 ≥ 0, yani x ≥ 3. Küp kökte bu sorun yok, ³√(−8) = −2. Yalnızca kare kök, dördüncü kök gibi çift dereceliler.',
        undefined,
        { not: 'Tanım kümesi sorusunda iki yasağı yaz: payda ≠ 0, çift kök içi ≥ 0. Gerisi eşitsizlik çözmek.' },
      ),
      kart(
        'Görüntü kümesi gerçekten çıkan değerler',
        'f(x) = x², ℝ\'den ℝ\'ye. Değer kümesi ℝ ama çıkan değerler hep ≥ 0; görüntü kümesi [0, ∞). Görüntü, değer kümesinin içinde kalan, fiilen kullanılan parça.',
      ),
      kart(
        'Bire bir: farklı girdi, farklı çıktı',
        'f(x) = 2x\'te 1 → 2, 3 → 6; iki girdi hiç aynı çıktıya gitmez: bire bir. f(x) = x²\'de 2 ve −2 ikisi de 4\'e gider: bire bir değil. Grafikte yatay doğru testi: yatay çizgi en çok bir kez kesmeli.',
      ),
      kart(
        'Örten: değer kümesinde boşta eleman yok',
        'f(x) = x², ℝ → ℝ: −1\'e giden girdi yok, −1 boşta kaldı. Örten değil. f(x) = 2x\'te her sayıya ulaşılır: örten. Görüntü kümesi değer kümesine eşitse örten.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Testi', 'Örnek'],
          satirlar: [
            ['Fonksiyon', 'Düşey doğru', 'y = x² evet'],
            ['Bire bir', 'Yatay doğru', 'y = 2x evet, y = x² hayır'],
            ['Örten', 'Görüntü = değer kümesi', 'y = x² (ℝ→ℝ) hayır'],
          ],
        },
      ),
      kart(
        'Bileşke: önce içteki fonksiyon',
        'f(x) = x + 1, g(x) = 2x. (f∘g)(3) = f(g(3)) = f(6) = 7. Sağdaki önce çalışır. (g∘f)(3) = g(4) = 8. Sıra değişince sonuç değişti; f∘g ile g∘f aynı şey değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Birim fonksiyon hiçbir şeyi değiştirmez',
        'I(x) = x: 5 girer, 5 çıkar. Bileşkede etkisiz: (f∘I)(x) = f(x). Çarpmadaki 1 gibi. Ters fonksiyon konusunda bu kart lazım olacak: f ile tersinin bileşkesi I verir.',
      ),
    ], [
      soru(
        'Çizilen eğri bir fonksiyonun grafiğidir.',
        false,
        'Düşey doğru testinden kalıyor: bir x değerine iki y karşılık geliyor.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -3, 3],
          xAd: 'x',
          yAd: 'y',
          cemberler: [{ x: 0, y: 0, r: 2 }],
        },
      ),
      soru('Bire bir fonksiyonda farklı elemanların görüntüleri de farklıdır.', true, 'Aynı çıktıya iki girdi gitmiyor.'),
      soru('Örten fonksiyonda değer kümesinin her elemanı bir görüntüdür.', true, 'Görüntü kümesi ile değer kümesi eşit oluyor.'),
      soru('Bileşke fonksiyonda işlem sırası sonucu değiştirmez.', false, '(f∘g)(3) = 7 iken (g∘f)(3) = 8; genellikle farklı.'),
      sikli('Farklı girdilerin farklı çıktı vermesi?', ['Bire bir', 'Örten'], 0, 'Örten, değer kümesinin tamamı kullanılıyor demek.'),
      sikli('(f∘g)(x) neye eşittir?', ['f(g(x))', 'g(f(x))'], 0, 'Önce içteki g çalışır.'),
      sikli('I(x) = x fonksiyonu bileşkede nedir?', ['Etkisiz eleman', 'Ters eleman'], 0, 'f∘I = f.'),
      soru('Görüntü kümesi değer kümesinin alt kümesidir.', true, 'Gerçekten alınan değerler.'),
      soru('f(x) = 1/(x − 3) fonksiyonunun tanım kümesi ℝ − {3}\'tür.', true, 'x = 3 paydayı sıfır yapar.'),
      sikli('f(x) = x + 1, g(x) = 2x ise (f∘g)(3) kaçtır?', ['7', '8'], 0, 'g(3) = 6, f(6) = 7.'),
      soru('Çember grafiği düşey doğru testinden geçer.', false, 'Düşey çizgi çemberi iki noktada keser; bir x\'e iki y.'),
    ], [
      {
        soru: 'f(x) = √(x − 3) fonksiyonunun tanım kümesi?',
        siklar: ['x ≥ 3', 'x > 0'],
        dogru: 0,
        aciklama: {
          dogru: 'Kök içi negatif olamaz: x − 3 ≥ 0.',
          yanlis: 'Sınır kökün içini sıfır yapan yer: x − 3 ≥ 0, yani x ≥ 3. x = 1 için kök içi −2 olur, tanımsız.',
        },
        kart: 5,
      },
    ]),
    konu('mat10-karesel', 'Karesel Fonksiyon ve Nitel Özellikleri', [
      kart(
        'Karesel fonksiyonda x\'in karesi var',
        'f(x) = x² en basit örnek: 1 → 1, 2 → 4, −2 → 4. Genel hâli f(x) = ax² + bx + c, a ≠ 0. Grafiğine parabol denir; U biçimli bir eğri.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -2, 7],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [-2.5, 6.25],
                [-1, 1],
                [0, 0],
                [1, 1],
                [2.5, 6.25],
              ],
              ad: 'y = x²',
            },
          ],
        },
        { etiket: 'Tanım' },
      ),
      kart(
        'a\'nın işareti kolların yönünü söyler',
        'y = x²\'de a = 1, kollar yukarı; en alt noktası var. y = −x²\'de kollar aşağı; en üst noktası var. a pozitifse gülen ağız, en küçük değer. a negatifse somurtan, en büyük değer.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -5, 5],
          egriler: [
            {
              noktalar: [
                [-2, 4],
                [0, 0],
                [2, 4],
              ],
              ad: 'a > 0',
            },
            {
              noktalar: [
                [-2, -4],
                [0, 0],
                [2, -4],
              ],
              renk: 'ikincil',
              ad: 'a < 0',
            },
          ],
        },
      ),
      kart(
        'c, y eksenini kestiği yer',
        'x = 0 yaz: f(0) = c. y = x² − 4x + 3\'te c = 3; parabol y eksenini (0, 3)\'te keser. Sık hata: c\'yi tepe noktası sanmak. Tepe başka yerde.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Tepe noktası x = −b/(2a)\'da',
        'y = x² − 4x + 3: a = 1, b = −4. Tepenin x\'i −(−4)/2 = 2. y\'yi bul: 4 − 8 + 3 = −1. Tepe (2, −1). Kollar yukarı olduğu için −1 en küçük değer.',
      ),
      kart(
        'Parabol tepesine göre simetrik',
        'Tepe x = 2\'deyse x = 1 ile x = 3\'te aynı y çıkar: f(1) = 0, f(3) = 0. Tepeden geçen düşey doğru simetri ekseni: x = 2. Kökler biliniyorsa tepe tam ortalarında.',
      ),
      kart(
        'Δ kaç kök olduğunu söyler',
        'Δ = b² − 4ac\'ye diskriminant denir. y = x² − 4x + 3: Δ = 16 − 12 = 4 > 0, iki kök (1 ve 3), parabol x eksenini iki kez keser. Δ = 0 tek kök, teğet; Δ < 0 kök yok, kesmez.',
        {
          tur: 'tablo',
          basliklar: ['Δ', 'Grafik', 'Örnek'],
          satirlar: [
            ['Δ > 0', '2 kök, iki kez keser', 'x² − 4x + 3'],
            ['Δ = 0', '1 kök, teğet', 'x² − 4x + 4'],
            ['Δ < 0', 'Kök yok, kesmez', 'x² − 4x + 5'],
          ],
        },
        { not: 'Kökleri hesaplamadan önce Δ\'ya bak; işareti, grafiğin x eksenini kesip kesmediğini söyler.' },
      ),
      kart(
        'Kök toplamı −b/a, çarpımı c/a',
        'x² − 4x + 3\'ün kökleri 1 ve 3. Toplam 4 = −(−4)/1, çarpım 3 = 3/1. Kökleri bulmadan da bu ikisi hesaplanır. İşarete dikkat: toplamda eksi var, çarpımda yok.',
      ),
      kart(
        'Tepe biliniyorsa denklemi kur',
        'Tepe (2, −1) ve grafik (0, 3)\'ten geçiyor. f(x) = a(x − 2)² − 1 yaz. x = 0 koy: 3 = 4a − 1, a = 1. Denklem (x − 2)² − 1 = x² − 4x + 3. Tepe (r, k) ise kalıp a(x − r)² + k.',
      ),
      kart(
        'En yüksek nokta problemi tepede çözülür',
        'Top yukarı atılıyor, yüksekliği h(t) = −5t² + 20t. a < 0, kollar aşağı; en yüksek nokta tepede. t = −20/(−10) = 2 saniye, h = 20 m. "En büyük alan", "en çok kâr" soruları da tepe noktası.',
        undefined,
        { etiket: 'Örnek' },
      ),
    ], [
      soru(
        'Grafiği çizilen fonksiyonda a katsayısı pozitiftir.',
        false,
        'Kollar aşağı bakıyor; bu a\'nın negatif olduğunu gösteriyor.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -2, 5],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [-2, 0],
                [-1, 3],
                [0, 4],
                [1, 3],
                [2, 0],
              ],
            },
          ],
        },
      ),
      soru('Diskriminant sıfırdan küçükse parabol x eksenini kesmez.', true, 'Gerçek kök yok demek.'),
      soru('Parabolün tepe noktası simetri ekseni üzerindedir.', true, 'Simetri ekseni tepe noktasından geçen düşey doğru.'),
      soru('f(x) = ax² + bx + c fonksiyonunda c, tepe noktasının apsisidir.', false, 'c, parabolün y eksenini kestiği değer; tepenin x\'i −b/(2a).'),
      sikli('Tepe noktasının x koordinatı?', ['−b/(2a)', 'b/(2a)'], 0, 'x² − 4x + 3 için 2.'),
      sikli('Δ < 0 ise parabol x eksenini kaç noktada keser?', ['0', '2'], 0, 'Δ > 0 iki nokta.'),
      sikli('Köklerin toplamı?', ['−b/a', 'c/a'], 0, 'Çarpım c/a.'),
      sikli('Simetri ekseni nereden geçer?', ['Tepe noktasından', 'Orijinden'], 0, 'Düşey doğru.'),
      sikli('y = x² − 4x + 3 parabolü y eksenini nerede keser?', ['(0, 3)', '(2, −1)'], 0, 'x = 0 için y = c = 3; (2, −1) tepe.'),
      soru('Atılan cismin yolu karesel fonksiyonla modellenir.', true, 'En yüksek nokta tepede.'),
    ], [
      {
        soru: 'f(x) = −2x² + 4x + 1 fonksiyonunun kolları hangi yöne bakar?',
        siklar: ['Aşağı, en büyük değeri var', 'Yukarı, en küçük değeri var'],
        dogru: 0,
        aciklama: {
          dogru: 'a = −2 < 0; tepe noktası en yüksek nokta.',
          yanlis: 'Kolların yönünü a belirler; a = −2 negatif, kollar aşağı. Yukarı bakan parabol için a > 0 gerekir.',
        },
        kart: 2,
      },
    ]),
    konu('mat10-karekok', 'Karekök Fonksiyonu ve Nitel Özellikleri', [
      kart(
        'Karekök fonksiyonu sıfırdan başlar',
        'f(x) = √x: 0 → 0, 1 → 1, 4 → 2, 9 → 3. Negatif sayının kare kökü gerçek sayı değil; x ≥ 0. Çıkan değer de negatif olmaz: y ≥ 0. Grafik orijinden başlayıp sağa doğru çıkar.',
        {
          tur: 'koordinat',
          pencere: [0, 9, 0, 4],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 1],
                [4, 2],
                [9, 3],
              ],
              ad: '√x',
            },
          ],
        },
      ),
      kart(
        'Artıyor ama giderek yavaşlıyor',
        '0\'dan 1\'e giderken y bir birim arttı. 4\'ten 9\'a, beş birimlik yolda yine bir birim. Fonksiyon hep artan; ama artış hızı düşüyor. Grafiğin sağa doğru yatıklaşması bundan.',
      ),
      kart(
        'Parabolün sağ kolunun yatırılmışı',
        'y = x²\'nin sağ kolunu al (x ≥ 0). x ile y\'nin yerini değiştir: (2, 4) → (4, 2). Çıkan eğri √x. Yani karekök, x ≥ 0\'a daraltılmış x²\'nin ters fonksiyonu. Sol kol alınmaz; 2 ile −2 aynı y\'ye gidiyor.',
      ),
      kart(
        'Tanım kümesi için kök içini ≥ 0 yap',
        'f(x) = √(2x − 6): 2x − 6 ≥ 0, x ≥ 3. Tanım kümesi [3, ∞). f(x) = √(4 − x): 4 − x ≥ 0, x ≤ 4. Eşitsizliği çöz, kök içini negatif yapan x\'leri at.',
      ),
      kart(
        'İçerideki sayı grafiği ters yöne kaydırır',
        '√(x − 2): başlangıç x = 2\'ye taşınır, sağa iki birim. Eksi görüp sola sanma. √(x + 2) sola kayar. Tanım kümesi de kayar: √(x − 2) için x ≥ 2.',
        undefined,
        { etiket: 'Sık hata', not: '√(x − 2) gördüğünde eksi var diye sola kaydırırsan dur: başlangıç x = 2\'de, sağa kayıyor.' },
      ),
      kart(
        'Dışarıdaki sayı yukarı-aşağı kaydırır',
        '√x + 3: her y\'ye 3 eklenir, grafik 3 birim yukarı. Başlangıç noktası (0, 3). Tanım kümesi değişmez: x ≥ 0. Görüntü kümesi y ≥ 3 olur. İçerideki x\'e, dışarıdaki y\'ye dokunur.',
      ),
    ], [
      soru('f(x) = √x fonksiyonunun tanım kümesi x ≥ 0 dır.', true, 'Karekökün içi negatif olamaz.'),
      soru('f(x) = √x fonksiyonu artandır.', true, 'x büyüdükçe değer de büyüyor, ama gittikçe yavaşlayarak.'),
      soru('f(x) = √(x − 3) fonksiyonunun tanım kümesi x ≥ −3 tür.', false, 'Kökün içi negatif olmamalı: x − 3 ≥ 0, yani x ≥ 3.'),
      soru('Karekök fonksiyonu negatif değerler de alabilir.', false, 'Karekökün sonucu negatif olmaz; y ≥ 0.'),
      sikli('√x fonksiyonunun görüntü kümesi?', ['y ≥ 0', 'Tüm gerçek sayılar'], 0, 'Karekök negatif olamaz.'),
      sikli('√x\'in artış hızı nasıl değişir?', ['Giderek azalır', 'Sabittir'], 0, '0→1 bir birim, 4→9 bir birim.'),
      soru('x ≥ 0 aralığında x²\'nin tersi karekök fonksiyonudur.', true, 'Sağ kol yatırılınca √x çıkar.'),
    ], [
      {
        soru: 'f(x) = √(x − 2) grafiği √x\'e göre nasıl kayar?',
        siklar: ['Sola 2 birim', 'Sağa 2 birim'],
        dogru: 1,
        aciklama: {
          dogru: 'İçerideki −2 başlangıcı x = 2\'ye taşır; tanım kümesi x ≥ 2.',
          yanlis: 'İçerideki eksi işareti sağa kaydırır (başlangıç x = 2\'de). Sola kayma için √(x + 2) gerekirdi.',
        },
        kart: 5,
      },
    ]),
    konu('mat10-rasyonel', 'Rasyonel Fonksiyon ve Nitel Özellikleri', [
      kart(
        'Rasyonel fonksiyon bir bölmedir',
        'f(x) = 1/x ya da f(x) = (x + 1)/(x − 2) gibi. Pay ve payda polinom, arada bölme çizgisi. Rasyonel sayı nasıl kesirse rasyonel fonksiyon da kesir. Tek kural: payda sıfır olamaz.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Paydayı sıfırlayan x tanım dışı',
        'f(x) = 1/(x − 4): x = 4\'te payda 0. 4 tanım kümesinde yok: ℝ − {4}. Grafik orada kopar; x = 4\'te nokta yok.',
      ),
      kart(
        'Grafik düşey asimptota yaklaşır, değmez',
        'x = 4\'e yaklaşırken 1/(x − 4) büyür: x = 4,1 → 10, x = 4,01 → 100. Eğri x = 4 doğrusuna sonsuz yaklaşır, hiç dokunmaz. O doğruya düşey asimptot denir; payda sıfır, pay sıfır değil.',
      ),
      kart(
        'x büyüyünce yatay asimptota yaklaşır',
        '1/x\'te x = 100 → 0,01; x = 1000 → 0,001. Değer 0\'a yaklaşıyor: y = 0 yatay asimptot. Pay derecesi paydadan küçükse yatay asimptot y = 0; dereceler eşitse baş katsayıların oranı.',
      ),
      kart(
        '1/x iki kollu bir eğri',
        'x pozitifken y pozitif (sağ üst), x negatifken y negatif (sol alt). İki kol birbirinden ayrı; ortada eksenler asimptot. Bu şekle hiperbol denir. Eğri hiçbir eksene değmiyor.',
        {
          tur: 'koordinat',
          pencere: [-5, 5, -5, 5],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [0.25, 4],
                [0.5, 2],
                [1, 1],
                [2, 0.5],
                [4, 0.25],
              ],
            },
            {
              noktalar: [
                [-4, -0.25],
                [-2, -0.5],
                [-1, -1],
                [-0.5, -2],
                [-0.25, -4],
              ],
            },
          ],
        },
      ),
      kart(
        'Yatay asimptot ortada kesilebilir',
        'Düşey asimptotu grafik hiç kesmez; orada fonksiyon yok. Yatay asimptot ise "x sonsuza giderken" ne olduğunu söyler; grafik ortalarda onu kesebilir. İkisini aynı sanma.',
        undefined,
        { etiket: 'Dikkat', not: 'Düşeye asla, yataya bazen; "asimptota değilmez" cümlesini yalnızca düşey için ezberle.' },
      ),
      kart(
        'Ters orantı bir rasyonel fonksiyondur',
        '120 km yol: hız 60 ise 2 saat, 120 ise 1 saat: t = 120/v. Hız artınca süre azalır; bu 1/x\'in ta kendisi. "İşçi artınca gün azalır" da aynı. Sabit hızda yol-zaman ise doğru orantı, rasyonel değil.',
      ),
    ], [
      soru(
        'Grafiği çizilen fonksiyon x = 0 noktasında tanımlıdır.',
        false,
        'Payda sıfır olduğu için x = 0 tanım kümesinde yok; orada düşey asimptot var.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -4, 4],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [0.3, 3.3],
                [0.5, 2],
                [1, 1],
                [2, 0.5],
                [3.5, 0.29],
              ],
            },
            {
              noktalar: [
                [-3.5, -0.29],
                [-2, -0.5],
                [-1, -1],
                [-0.5, -2],
                [-0.3, -3.3],
              ],
            },
          ],
        },
      ),
      soru('Rasyonel fonksiyonda paydayı sıfır yapan değerler tanım kümesine alınmaz.', true, 'Sıfıra bölme tanımsız.'),
      soru('Grafik düşey asimptota yaklaşır ama ona değmez.', true, 'x = 4,01 için 100; sonsuza yaklaşır, doğruya dokunmaz.'),
      soru('Düşey asimptot, payı sıfır yapan değerlerde oluşur.', false, 'Paydayı sıfır yapan değerlerde oluşur; payı sıfır yapanlar köktür.'),
      sikli('Yatay asimptot neye bağlıdır?', ['Pay ve paydanın derecelerine', 'Sabit terime'], 0, 'x sonsuza giderken.'),
      sikli('1/x grafiği nedir?', ['İki kollu hiperbol', 'Parabol'], 0, 'Eksenler asimptot.'),
      sikli('Grafik hangi asimptotu hiç kesmez?', ['Düşey', 'Yatay'], 0, 'Yatayı ortada kesebilir.'),
      soru('Sabit hızda yol-zaman ilişkisi rasyonel fonksiyondur.', false, 'Doğru orantı; sabit yolda hız-zaman ters orantı, o rasyonel.'),
    ], [
      {
        soru: 'f(x) = 1/(x − 4) fonksiyonunun düşey asimptotu?',
        siklar: ['y = 0', 'x = 4'],
        dogru: 1,
        aciklama: {
          dogru: 'Payda x = 4\'te sıfır, pay değil; grafik o doğruya sonsuz yaklaşır.',
          yanlis: 'y = 0 yatay asimptot. Düşey asimptot paydayı sıfır yapan yerde: x = 4.',
        },
        kart: 3,
      },
    ]),
    konu('mat10-ters-fonksiyon', 'Fonksiyonların Ters Fonksiyonları', [
      kart(
        'Ters fonksiyon yolu geri alır',
        'f(x) = 2x: 3 girer, 6 çıkar. Tersi 6\'yı alıp 3\'e döndürür: f⁻¹(x) = x/2. f(a) = b ise f⁻¹(b) = a. Girdi ile çıktı yer değiştirir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Üstteki −1 kuvvet değil',
        'f⁻¹(x), 1/f(x) demek değil. f(x) = 2x için f⁻¹(x) = x/2, ama 1/f(x) = 1/(2x). Bambaşka iki şey. Ters fonksiyon işlemi geri alır; 1/f(x) yalnızca bir bölme.',
        undefined,
        { etiket: 'Sık hata', not: 'f⁻¹ gördüğünde "bir bölü f" deme; "f\'nin yaptığını geri alan fonksiyon" de.' },
      ),
      kart(
        'Tersi olması için bire bir ve örten',
        'f(x) = x²\'de 2 ve −2 ikisi de 4\'e gider. 4\'ü geri gönderirken hangisine? Belirsiz. Bu yüzden x² (ℝ\'de) terslenemez. Tanım kümesini x ≥ 0\'a daraltırsan olur: tersi √x.',
      ),
      kart(
        'Tersi bulmak: x ile y\'yi değiştir',
        'f(x) = 2x + 1. y = 2x + 1 yaz. x ile y\'yi değiştir: x = 2y + 1. y\'yi yalnız bırak: y = (x − 1)/2. Yani f⁻¹(x) = (x − 1)/2. Kontrol: f(1) = 3, f⁻¹(3) = 1.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'y = f(x) yaz' },
            { ad: 'x ile y’yi değiştir' },
            { ad: 'y’yi yalnız bırak' },
          ],
        },
      ),
      kart(
        'Grafiği y = x doğrusuna göre yansıması',
        'f\'nin grafiğinde (2, 4) varsa tersinde (4, 2) var. Her nokta x ile y\'yi değiştiriyor; bu, köşegen y = x doğrusuna göre aynadaki görüntü. İki grafik o doğruya göre simetrik.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 5],
          egriler: [
            {
              noktalar: [
                [0, 0],
                [2, 4],
              ],
              kirik: true,
              ad: 'f',
            },
            {
              noktalar: [
                [0, 0],
                [4, 2],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'f⁻¹',
            },
            {
              noktalar: [
                [0, 0],
                [4.5, 4.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
          ],
        },
      ),
      kart(
        'f ile tersinin bileşkesi birim fonksiyon',
        'f(x) = 2x, f⁻¹(x) = x/2. (f⁻¹∘f)(3) = f⁻¹(6) = 3. Girdi neyse çıkan o: I(x) = x. f∘f⁻¹ = f⁻¹∘f = I. Bulduğun tersin doğru olup olmadığını böyle kontrol et.',
      ),
      kart(
        'Doğrusalın tersi doğrusal',
        'f(x) = 2x + 1\'in tersi (x − 1)/2: yine bir doğru. f(x) = x² (x ≥ 0) ise tersi √x: parabol kolu ile karekök birbirinin tersi. Karekök konusunda gördüğün yansıma buydu.',
      ),
    ], [
      soru('Bir fonksiyonun tersinin olması için bire bir ve örten olması gerekir.', true, 'Aksi hâlde geri dönüş tek anlamlı olmuyor: 4 → 2 mi, −2 mi?'),
      soru('Bir fonksiyon ile tersinin grafikleri y = x doğrusuna göre simetriktir.', true, 'x ile y yer değiştirdiği için simetri o doğruya göre.'),
      soru('f⁻¹(x), f(x) in çarpmaya göre tersidir, yani 1/f(x) tir.', false, 'İkisi ayrı kavram; ters fonksiyon işlemi geri alır, 1/f(x) bir bölme.'),
      soru('Ters fonksiyon bulunurken x ile y yer değiştirmez.', false, 'Tam da yer değiştirir; sonra y yalnız bırakılır.'),
      sikli('f(a) = b ise f⁻¹(b) kaçtır?', ['b', 'a'], 1, 'Girdi çıktı yer değiştirir.'),
      sikli('Ters fonksiyonun grafiği neye göre simetriktir?', ['x eksenine', 'y = x doğrusuna'], 1, 'Köşegen.'),
      sikli('f∘f⁻¹ neye eşittir?', ['Sıfır', 'Birim fonksiyon'], 1, 'I(x) = x.'),
      soru('Her fonksiyonun tersi vardır.', false, 'Yalnızca bire bir ve örten olanların.'),
    ], [
      {
        soru: 'f⁻¹(x) ile 1/f(x) aynı şey midir?',
        siklar: ['Evet, ikisi de ters', 'Hayır, biri ters fonksiyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Üstteki −1 kuvvet değil ters fonksiyon işareti.',
          yanlis: 'f(x) = 2x için f⁻¹(x) = x/2, ama 1/f(x) = 1/(2x). Bambaşka iki şey; üstteki −1 kuvvet değil.',
        },
        kart: 2,
      },
    ]),
    konu('mat10-denklem-problem', 'Fonksiyonlarla Denklem ve Eşitsizlik Problemleri', [
      kart(
        'Problemi önce fonksiyona çevir',
        'Bir kenarı x olan dikdörtgenin çevresi 20 ise öteki kenar 10 − x. Alan: A(x) = x(10 − x). Sorudaki ilişkiyi böyle yazınca cevap, fonksiyonun köküne ya da tepesine dönüşür.',
      ),
      kart(
        'En büyük, en küçük tepe noktasında',
        'A(x) = −x² + 10x, a < 0, kollar aşağı: en büyük değer tepede. x = −10/(−2) = 5, alan 25. Kâr, yükseklik, alan: "en çok" ya da "en az" diyen soru tepe noktasını sorar.',
      ),
      kart(
        'Eşitsizlik için işaret tablosu kur',
        '(x + 2)(x − 3) > 0 çöz. Kökler −2 ve 3; sayı doğrusuna koy. En sağda işaret + (baş katsayı pozitif), her kökte değişir: +, −, +. Pozitif istendi: x < −2 veya x > 3.',
        {
          tur: 'sayiDogrusu',
          aralik: [-4, 4],
          isaretler: [-2, 3],
          parcalar: [
            { bas: null, bit: -2, ad: '+' },
            { bas: -2, bit: 3, ad: '−', renk: 'ikincil' },
            { bas: 3, bit: null, ad: '+' },
          ],
        },
      ),
      kart(
        'Çift katlı kökte işaret değişmez',
        '(x − 2)²·(x + 1) için kök −1 tek katlı, 2 çift katlı. 2\'nin iki yanında (x − 2)² hep pozitif; işaret orada zıplamaz. Tabloya kökün katını da yaz.',
        undefined,
        { not: 'Tabloyu kurarken her kökün yanına katını yaz; çift katta çizgiyi değiştirme.' },
      ),
      kart(
        'Kökler dâhil mi, işarete bak',
        '> ve < katı eşitsizlik: kökler dışarıda, uçlar boş nokta. ≥ ve ≤ ise kökler dâhil, dolu nokta. Paydadaki kök hiçbir zaman dâhil olmaz; orada fonksiyon tanımsız.',
      ),
      kart(
        'f > g ise farkına bak',
        'x² > 2x nerede doğru? f − g = x² − 2x = x(x − 2) > 0. Kökler 0 ve 2; tablo: x < 0 veya x > 2. Grafiklerin kesiştiği noktalar f = g\'nin çözümü; aralarında hangisi üstteyse o büyük.',
      ),
      kart(
        'Çıkan kökü gerçek hayata sor',
        'x(10 − x) = 0\'ın kökleri 0 ve 10; kenar 0 olamaz. −4 çıkan kişi sayısı, 2,5 çıkan öğrenci sayısı olmaz. Denklemi çözmek yetmez; cevap problemin dünyasına uymalı.',
        undefined,
        { etiket: 'Dikkat' },
      ),
    ], [
      soru('Bir çarpanın çift katlı kökünde ifade işaret değiştirmez.', true, '(x − 2)² sıfırın iki yanında da pozitif.'),
      soru('Problemde bulunan çözümün bağlama uygunluğu denetlenmelidir.', true, 'Uzunluk için çıkan negatif değer matematiksel çözümdür ama cevap değildir.'),
      soru('Bir eşitsizliğin çözümünde kökler her zaman çözüm kümesine dâhildir.', false, 'Eşitsizlik katıysa (< ya da >) kökler dâhil edilmez.'),
      soru('İki fonksiyonun grafiklerinin kesiştiği noktalar f(x) = g(x) denklemini sağlamaz.', false, 'Kesişim noktaları tam da bu denklemin çözümleridir.'),
      sikli('En büyük alan problemi nerede çözülür?', ['Tepe noktasında', 'Köklerde'], 0, 'Kollar aşağı, tepe en yüksek.'),
      sikli('f(x) > g(x) nasıl çözülür?', ['f − g\'nin pozitif olduğu aralıklar', 'f\'nin kökleri'], 0, 'Fark fonksiyonu.'),
      soru('Matematiksel her kök problemin cevabıdır.', false, 'Kenar 0 ya da −4 olamaz; bağlama uyanlar seçilir.'),
      soru('Çevresi 20 olan dikdörtgenin alanı en çok 25 olur.', true, 'A(x) = x(10 − x), tepe x = 5, alan 25.'),
    ], [
      {
        soru: 'İşaret tablosunda çift katlı kökte ne olur?',
        siklar: ['İşaret değişir', 'İşaret değişmez'],
        dogru: 1,
        aciklama: {
          dogru: '(x − 2)² sıfırın iki yanında da pozitif.',
          yanlis: 'Tek katlı kökte değişir. (x − 2)² gibi çift katlı ifade kökün iki yanında aynı işareti taşır.',
        },
        kart: 4,
      },
    ]),
  ]),
  tema('mat10-t5', 'Sayma, Algoritma ve Bilişim', [
    konu('mat10-sayma', 'Sayma Stratejileri', [
      kart(
        'Ya biri ya öteki: topla',
        'Kantinde 3 çeşit tost, 4 çeşit sandviç var. Tek bir şey seçeceksin: 3 + 4 = 7 seçenek. Seçenekler birbirinin yerine geçiyorsa toplanır.',
      ),
      kart(
        'Hem biri hem öteki: çarp',
        '3 tişört, 4 pantolon: her tişörtle 4 pantolon giyilir, 3·4 = 12 kombin. Art arda yapılan seçimler çarpılır. "Ya … ya" topla, "hem … hem" çarp.',
        undefined,
        { etiket: 'Kural' },
      ),
      kart(
        'Faktöriyel: hepsini sıraya diz',
        '3 kişi sıraya giriyor: ilk yere 3, ikinciye 2, sonuncuya 1 kişi: 3·2·1 = 6. Buna 3! denir, "3 faktöriyel". n! = n·(n−1)·…·1. 0! = 1 kabul edilir; sıfır kişiyi dizmenin tek yolu var.',
      ),
      kart(
        'Permütasyon: sıra önemli',
        '5 kişiden başkan ve yardımcı seçiliyor. Başkana 5, yardımcıya 4 aday: 5·4 = 20. Ali-Ayşe ile Ayşe-Ali farklı; sıra önemli. n\'den r\'yi sıralamak: P(n, r) = n!/(n−r)!.',
      ),
      kart(
        'Kombinasyon: sıra önemsiz',
        '5 kişiden 2 kişilik takım. Ali-Ayşe ile Ayşe-Ali aynı takım; permütasyondaki 20\'de her takım 2 kez sayıldı. 20/2 = 10. C(n, r) = P(n, r)/r!: sıralamayı r! ile bölerek siliyorsun.',
      ),
      kart(
        'Soruyu okurken sırayı sor',
        'Tek soru: seçilenlerin yeri değişince sonuç değişiyor mu? Başkan-yardımcı: evet, permütasyon. Takım: hayır, kombinasyon. Sıra varsa sayı hep daha büyük çıkar.',
        {
          tur: 'tablo',
          basliklar: ['Soru', 'Yöntem', 'Örnek'],
          satirlar: [
            ['Kaç farklı sıra?', 'Permütasyon', '5\'ten başkan + yardımcı: 20'],
            ['Kaç farklı grup?', 'Kombinasyon', '5\'ten 2\'li takım: 10'],
          ],
        },
        { not: 'Formüle koşmadan önce "sıra önemli mi" diye sor; bu tek soru permütasyonla kombinasyonu ayırır.' },
      ),
      kart(
        'Seçmek, geride bırakmakla aynı',
        '5 kişiden 2\'sini seçmek, 3\'ünü dışarıda bırakmak demek: C(5, 2) = C(5, 3) = 10. Genel: C(n, r) = C(n, n−r). Büyük r\'de küçüğünü hesapla: C(10, 8) = C(10, 2) = 45.',
      ),
      kart(
        'Aynı harfler varsa faktöriyele böl',
        'ANNE kelimesinin harfleri: 4! = 24 dizilim. Ama iki N yer değiştirince kelime değişmiyor; her dizilim 2 kez sayıldı. 24/2! = 12. Tekrar eden her harf için kendi faktöriyeline böl.',
      ),
      kart(
        '"En az bir" için tersini say',
        '3 zar atıldı, en az bir 6 gelme sayısı: tek tek saymak uzun. Toplam 6³ = 216, hiç 6 gelmeyen 5³ = 125. Fark: 91. "En az bir" gördüğünde hiç olmayanı sayıp toplamdan çıkar.',
      ),
    ], [
      soru('Permütasyonda sıralama önemlidir, kombinasyonda değildir.', true, 'Ali-Ayşe ile Ayşe-Ali permütasyonda ayrı, kombinasyonda aynı.'),
      soru('0! = 1 dir.', true, 'Sıfır kişiyi dizmenin tek yolu var: hiçbir şey yapmamak.'),
      soru('5 kişiden 2 kişilik bir takım seçmek permütasyon problemidir.', false, 'Takımda sıra önemli değil; bu bir kombinasyon problemi.'),
      soru('C(n, r) = C(n, n−r) eşitliği yanlıştır.', false, 'r seçmek, n−r tanesini dışarıda bırakmakla aynı sayıda yol.'),
      sikli('0! kaçtır?', ['1', '0'], 0, 'Tanım gereği.'),
      sikli('5 kişiden 3\'ü sıraya kaç türlü dizilir?', ['60', '10'], 0, 'P(5,3) = 5·4·3.'),
      sikli('C(n, r) neye eşittir?', ['C(n, n−r)', 'C(r, n)'], 0, 'Seçmek, geride bırakmakla aynı.'),
      sikli('Seçenekler birbirinin alternatifiyse?', ['Toplanır', 'Çarpılır'], 0, '"Ya … ya" topla, "hem … hem" çarp.'),
      sikli('"En az bir" sorularında kısa yol?', ['Hepsini saymak', 'Toplamdan hiç olmayanı çıkarmak'], 1, '216 − 125 = 91.'),
      soru('Aynı nesnelerden birden çok varsa toplam, tekrar faktöriyellerine bölünür.', true, 'ANNE: 4!/2! = 12.'),
    ], [
      {
        soru: '"10 kişiden 3 kişilik komite kaç türlü seçilir?" hangi kavramla çözülür?',
        siklar: ['Kombinasyon', 'Permütasyon'],
        dogru: 0,
        aciklama: {
          dogru: 'Komitede sıra yok; grup sorusu.',
          yanlis: 'Permütasyon sıralama ister (başkan, yardımcı, üye). Sırasız grup seçimi kombinasyon.',
        },
        kart: 6,
      },
    ]),
    konu('mat10-algoritmik-yapi', 'Cebirsel İşlemlerin Algoritmik Yapısı', [
      kart(
        'Algoritma: sırası belli adımlar',
        'Çay tarifi: suyu kaynat, çayı koy, bekle. Adımlar belli, sırası belli, sonunda çay var. Matematikte de öyle: girdiyi al, adımları uygula, çıktıyı ver. Böyle her yönteme algoritma denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İşlem önceliği bir algoritmadır',
        '2 + 3·4² hesapla: önce üs (16), sonra çarpma (48), sonra toplama (50). Sıra: parantez, üs, çarpma-bölme, toplama-çıkarma. Sıra kesin olduğu için herkes 50 bulur; soldan giden 400 bulur.',
      ),
      kart(
        'Öklid: böl, kalanla devam et',
        'EBOB(48, 36): 48\'i 36\'ya böl, kalan 12. Şimdi 36\'yı 12\'ye böl, kalan 0. Kalan sıfır olunca son bölen cevap: 12. Her adımda bölen ile kalan yer değiştiriyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: '48 = 1·36 + 12' },
            { ad: '36 = 3·12 + 0' },
            { ad: 'EBOB = 12', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Öklid büyük sayılarda çok hızlı',
        'EBOB(1.000.003, 999.997) için asal çarpanlara ayırmayı dene: çok uzun. Öklid: fark 6 kalan, sonra 999.997\'yi 6\'ya böl… birkaç adımda biter. Sayılar her adımda hızla küçülür.',
      ),
      kart(
        'Döngü: aynı adımı tekrarla',
        '5! hesapla: sonuç 1\'den başla, 1\'den 5\'e her sayıyla çarp: 1, 2, 6, 24, 120. Beş kez aynı iş: "sonucu sıradaki sayıyla çarp". Buna döngü denir. 2⁵ için de 5 kez 2 ile çarp.',
      ),
      kart(
        'Özyineleme: kendi küçüğüyle tanımla',
        '5! = 5·4!, 4! = 4·3!… Her adım bir küçüğünü çağırır; buna özyineleme denir. Bir yerde durması şart: 0! = 1 durma koşulu. Durma koşulu yoksa 0! = 0·(−1)! diye sonsuza gider.',
        undefined,
        { not: 'Kendini çağıran bir tanım görünce ilk sorun: nerede duruyor? Durma koşulu yoksa tanım kapanmaz.' },
      ),
      kart(
        'Az adım, iyi algoritma',
        'İki yöntem de aynı EBOB\'u verir; biri 3 adım, öteki 300. Küçük sayıda fark yok, büyük sayıda saatler. Bilgisayarlar Öklid\'i bu yüzden kullanır: doğru olmak yetmez, kısa da olmalı.',
      ),
    ], [
      soru('İşlem önceliği kuralları adım adım uygulanan bir algoritmadır.', true, 'Aynı ifade herkeste aynı sonucu bu sayede veriyor.'),
      soru('Öklid algoritması iki sayının EBOB unu bulur.', true, 'Kalanlı bölme tekrarlanarak yürüyor.'),
      soru('Öklid algoritması, çarpanlara ayırma yöntemine göre daha yavaştır.', false, 'Büyük sayılarda çok daha hızlı; her adımda sayılar hızla küçülüyor.'),
      soru('Özyinelemeli bir tanımın durma koşuluna ihtiyacı yoktur.', false, 'Durma koşulu olmayan özyineleme hiç sonlanmaz.'),
      sikli('n! = n·(n−1)! tanımı nedir?', ['Döngü', 'Özyineleme'], 1, 'Kendi küçüğünü çağırıyor; durma koşulu şart.'),
      sikli('Öklid neden asal çarpanlardan hızlıdır?', ['Daha az bellek ister', 'Birkaç bölme yeter'], 1, 'Büyük sayılarda fark büyür.'),
      sikli('2 + 3·4² kaçtır?', ['50', '400'], 0, 'Önce üs, sonra çarpma, sonra toplama.'),
      soru('İşlem sırası bir algoritmadır.', true, 'Parantez, üs, çarpma-bölme, toplama-çıkarma.'),
    ], [
      {
        soru: 'Öklid algoritması neyi hesaplar?',
        siklar: ['Asal çarpanları', 'EBOB'],
        dogru: 1,
        aciklama: {
          dogru: 'Kalanlı bölmeleri tekrarlar; kalan sıfırken son bölen EBOB.',
          yanlis: 'Asal çarpanlara ayırma ayrı ve pahalı bir iş. Öklid birkaç bölmeyle EBOB\'u bulur.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('mat10-t6', 'Analitik İnceleme', [
    konu('mat10-nokta', 'Dik Koordinat Sisteminde Noktanın Analitik İncelenmesi', [
      kart(
        'Noktanın adresi iki sayı',
        'A(3, 2): x ekseninde 3 sağa, y ekseninde 2 yukarı. İlk sayı apsis (x), ikinci ordinat (y). Sıra önemli: (3, 2) ile (2, 3) farklı noktalar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Dört bölge işaretle ayrılır',
        'Eksenler düzlemi dörde böler. Sağ üst I: (+, +). Sol üst II: (−, +). Sol alt III: (−, −). Sağ alt IV: (+, −). (−3, 5) II. bölgede. Eksen üstündeki nokta hiçbir bölgede değil.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -4, 4],
          xAd: 'x',
          yAd: 'y',
          etiketler: [
            { x: 2, y: 2, ad: 'I (+,+)' },
            { x: -2, y: 2, ad: 'II (−,+)' },
            { x: -2, y: -2, ad: 'III (−,−)' },
            { x: 2, y: -2, ad: 'IV (+,−)' },
          ],
        },
      ),
      kart(
        'Uzaklık Pisagor\'dan gelir',
        'A(1, 1), B(5, 4). x farkı 4, y farkı 3; dik üçgen kur. Hipotenüs √(4² + 3²) = √25 = 5. Formül: d = √((x₂−x₁)² + (y₂−y₁)²). Farkları toplama, karelerini topla.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 5],
          egriler: [
            {
              noktalar: [
                [1, 1],
                [5, 4],
              ],
              kirik: true,
            },
            {
              noktalar: [
                [1, 1],
                [5, 1],
                [5, 4],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
          ],
          noktalar: [
            { x: 1, y: 1 },
            { x: 5, y: 4 },
          ],
          etiketler: [
            { x: 2.6, y: 3.1, ad: 'd = 5', renk: 'ikincil' },
            { x: 3, y: 0.6, ad: '4', renk: 'soluk' },
            { x: 5.4, y: 2.5, ad: '3', renk: 'soluk' },
          ],
        },
        { not: 'Uzaklıkta farkları toplamak (4 + 3 = 7) en sık hata; kareleri toplayıp kök al: 5.' },
      ),
      kart(
        'Orta nokta ortalamadır',
        'A(2, 4), B(6, 8). x\'leri topla ikiye böl: 4. y\'leri topla ikiye böl: 6. Orta nokta (4, 6). Her eksende ayrı ayrı ortalama.',
      ),
      kart(
        'Oranla bölen nokta ağırlıklı ortalama',
        'A(0, 0), B(6, 3); AB\'yi 1:2 bölen C noktası A\'ya yakın. x = (2·0 + 1·6)/3 = 2, y = (2·0 + 1·3)/3 = 1. C(2, 1). Yakın uca büyük ağırlık; oran 1:1 olunca orta nokta çıkar.',
      ),
      kart(
        'Ağırlık merkezi köşelerin ortalaması',
        'Köşeler (0, 0), (6, 0), (3, 6). x: (0 + 6 + 3)/3 = 3, y: (0 + 0 + 6)/3 = 2. G(3, 2). Kenarortay çizmeye gerek yok; üç x\'i topla üçe böl, üç y\'yi topla üçe böl.',
      ),
    ], [
      soru('A(1, 2) ile B(4, 6) noktaları arasındaki uzaklık 5 birimdir.', true, 'Farklar 3 ve 4; karekök içinde 9 + 16 = 25.'),
      soru('İki noktanın orta noktasının koordinatları, uçların koordinatlarının ortalamasıdır.', true, 'Her eksende ayrı ayrı ortalama alınıyor.'),
      soru('Bir üçgenin ağırlık merkezi, köşe koordinatlarının toplamına eşittir.', false, 'Toplamın üçte biri, yani ortalaması.'),
      soru('Apsisi negatif, ordinatı pozitif olan nokta birinci bölgededir.', false, 'İkinci bölgededir; birinci bölgede ikisi de pozitif.'),
      sikli('(2, 4) ile (6, 8)\'in orta noktası?', ['(8, 12)', '(4, 6)'], 1, 'Toplayıp ikiye böl.'),
      sikli('(−3, 5) hangi bölgededir?', ['IV', 'II'], 1, '(−, +) sol üst.'),
      soru('Üçgenin ağırlık merkezi köşe koordinatlarının ortalamasıdır.', true, 'Üç x\'i topla üçe böl, üç y\'yi topla üçe böl.'),
    ], [
      {
        soru: '(1, 2) ile (4, 6) noktaları arasındaki uzaklık?',
        siklar: ['7', '5'],
        dogru: 1,
        aciklama: {
          dogru: 'Farklar 3 ve 4; √(9 + 16) = 5.',
          yanlis: 'Farklar toplanmaz. Pisagor: √(3² + 4²) = 5.',
        },
        kart: 3,
      },
    ]),
    konu('mat10-dogru', 'Dik Koordinat Sisteminde Doğrunun Analitik İncelenmesi', [
      kart(
        'Eğim: dikey değişim bölü yatay değişim',
        '(1, 2)\'den (3, 6)\'ya: y 4 arttı, x 2 arttı. Eğim m = 4/2 = 2. Bir adım sağa gidince 2 yukarı çıkıyorsun. Eğim negatifse doğru sağa doğru aşağı iniyor.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yatay doğru 0, düşey doğru tanımsız',
        'y = 3 doğrusunda y hiç değişmez: eğim 0. x = 3 doğrusunda x değişmez: sıfıra bölme, tanımsız. İkisini karıştırma: yatay 0, düşey tanımsız.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'y = mx + n: eğim ve kesim',
        'y = 2x + 1: m = 2 eğim, n = 1 kesim. Kesim, doğrunun y eksenini kestiği yer: x = 0 için y = 1. Eğim ve bir nokta varsa y − y₁ = m(x − x₁). Eğim 2, (3, 7)\'den geçen: y − 7 = 2(x − 3).',
      ),
      kart(
        'Eksenleri kestiği yerleri sıfırla bul',
        'y = 2x − 4. y eksenini kestiği yerde x = 0: y = −4, nokta (0, −4). x eksenini kestiği yerde y = 0: 2x − 4 = 0, x = 2, nokta (2, 0). Hangisini arıyorsan ötekini sıfır yap.',
      ),
      kart(
        'Paralel doğruların eğimi eşit',
        'y = 2x + 1 ile y = 2x − 5: ikisinin de eğimi 2. Aynı yöne bakıyorlar, hiç kesişmiyorlar: paralel. Eğim eşit, n de eşitse aynı doğru: çakışık.',
      ),
      kart(
        'Dik doğrularda eğimler çarpımı −1',
        'Eğimi 2 olan doğruya dik olanın eğimi −1/2: ters çevir, işaret değiştir. 2·(−1/2) = −1. Eğimi −3 olana dik: 1/3.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -4, 4],
          egriler: [
            {
              noktalar: [
                [-2, -4],
                [2, 4],
              ],
              kirik: true,
              ad: 'm = 2',
            },
            {
              noktalar: [
                [-4, 2],
                [4, -2],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'm = −1/2',
            },
          ],
        },
        { not: 'Dik doğrunun eğimini bulurken yalnızca işaret değiştirme; ters çevir ve işaret değiştir: 2 → −1/2.' },
      ),
      kart(
        'Kesişim: iki denklemi birlikte çöz',
        'y = 2x + 1 ve y = −x + 4. Eşitle: 2x + 1 = −x + 4, x = 1, y = 3. Kesişim (1, 3); her iki denklemi de sağlar. Çözüm çıkmazsa paralel, her x çözümse çakışık.',
      ),
      kart(
        'Noktanın doğruya uzaklığı dik uzaklık',
        'Doğruyu ax + by + c = 0 biçimine getir. (x₀, y₀) noktasının uzaklığı |ax₀ + by₀ + c| / √(a² + b²). Mutlak değer var; uzaklık negatif çıkmaz. (0, 0)\'ın 3x + 4y − 10 = 0\'a uzaklığı 10/5 = 2.',
      ),
    ], [
      soru('Birbirine paralel iki doğrunun eğimleri eşittir.', true, 'Aynı yöne baktıkları için eğimleri aynı.'),
      soru('Birbirine dik iki doğrunun eğimleri çarpımı −1 dir.', true, 'Eksenlere paralel olmayan doğrular için geçerli.'),
      soru('x eksenine paralel bir doğrunun eğimi tanımsızdır.', false, 'Eğimi 0\'dır; tanımsız olan y eksenine paralel doğrunun eğimi.'),
      soru('İki doğrunun kesişim noktası, denklemlerden yalnızca birini sağlar.', false, 'Kesişim noktası her iki denklemi de sağlar.'),
      sikli('Düşey doğrunun eğimi?', ['Tanımsız', '0'], 0, 'Yatay doğru 0.'),
      sikli('Paralel doğruların eğimleri?', ['Eşit', 'Çarpımı −1'], 0, 'Dikte çarpım −1.'),
      sikli('İki doğrunun denklem sistemi çözümsüzse?', ['Paralel', 'Çakışık'], 0, 'Sonsuz çözüm çakışık.'),
      sikli('y eksenini kestiği nokta nasıl bulunur?', ['x = 0 yazarak', 'y = 0 yazarak'], 0, 'y = 0 x eksenini verir.'),
      soru('Noktanın doğruya uzaklığı negatif olabilir.', false, 'Formülde mutlak değer var; daima pozitif.'),
    ], [
      {
        soru: 'Eğimi 2 olan doğruya dik doğrunun eğimi?',
        siklar: ['−1/2', '−2'],
        dogru: 0,
        aciklama: {
          dogru: 'Eğimler çarpımı −1: 2 · (−1/2) = −1.',
          yanlis: '2 · (−2) = −4, −1 değil. Dik doğrunun eğimi ters işaretli ve ters çevrilmiş: −1/2.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('mat10-t7', 'Veriden Olasılığa', [
    konu('mat10-kosullu', 'Koşullu Olasılık', [
      kart(
        'Bilgi gelince olasılık değişir',
        'Zar atıldı; 6 gelme olasılığı 1/6. Sana "çift geldi" dendi. Artık 2, 4, 6\'dan biri; 6 olma olasılığı 1/3. Yeni bilgi olasılığı değiştirdi. Buna koşullu olasılık denir: P(6 | çift) = 1/3.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Bilgi örnek uzayı daraltır',
        'Zarın 6 sonucu vardı; "çift" bilgisi bunu 3\'e indirdi. Payda 6\'dan 3\'e düştü, olay aynı kaldı. Koşullu olasılıkta değişen şey olay değil, mümkün kalan durumların kümesi.',
      ),
      kart(
        'Formül: kesişim bölü koşul',
        'P(A|B) = P(A ∩ B) / P(B). Zar: A = 6 gelmesi, B = çift gelmesi. P(A ∩ B) = 1/6, P(B) = 1/2. Bölüm 1/3. Okunuşu: "B olduğu bilinirken A".',
        {
          tur: 'venn',
          sol: 'A',
          sag: 'B',
          kesisim: 'A ∩ B',
          disi: 'E',
          vurgu: 'kesisim',
        },
      ),
      kart(
        'P(A|B) ile P(B|A) aynı değil',
        'P(6 | çift) = 1/3. Ama P(çift | 6) = 1: 6 geldiyse kesin çift. Çubuğun iki yanı yer değiştirince soru değişir. Soruda hangisi "biliniyor", hangisi soruluyor: önce onu yaz.',
        undefined,
        { etiket: 'Sık hata', not: 'Çubuğun sağındaki "bilinen"dir. P(A|B) görünce "B oldu, A ne kadar" diye oku; tersini değil.' },
      ),
      kart(
        'Bağımsız: bilgi olasılığı değiştirmiyor',
        'İki zar. İlk zarın 6 gelmesi ikincinin 6 gelmesini etkilemez: P(A|B) = P(A). Böyle olaylara bağımsız denir. Bağımsızsa P(A ∩ B) = P(A)·P(B): 1/6·1/6 = 1/36.',
      ),
      kart(
        'İadeli bağımsız, iadesiz bağımlı',
        'Torbada 3 kırmızı, 2 mavi. Top çekip geri koyarsan ikinci çekiliş ilkinden etkilenmez: bağımsız. Geri koymazsan torba değişti: bağımlı, koşullu olasılık lazım. İlk kırmızıysa ikinci kırmızı 2/4.',
      ),
      kart(
        'Ayrık ile bağımsız farklı şeyler',
        'Ayrık: aynı anda olamazlar. Zarda "tek" ve "çift" ayrık. Biri olduysa öteki kesin olmadı: P(A|B) = 0, yani bağımsız DEĞİL. Bağımsız olaylar aynı anda olabilir; ayrık olaylar birbirini etkiler.',
        undefined,
        { etiket: 'Dikkat' },
      ),
    ], [
      soru('P(A|B), B nin gerçekleştiği bilindiğinde A nın olasılığıdır.', true, 'Bilgi, hesabın yapıldığı zemini değiştiriyor.'),
      soru('Yeni bir bilginin verilmesi örnek uzayı daraltır.', true, '"Çift geldi" bilgisi 6 sonucu 3\'e indirdi.'),
      soru('Bağımsız olaylar ile ayrık olaylar aynı şeydir.', false, 'Ayrık olaylar birlikte olamaz; bağımsız olaylarda biri ötekinin olasılığını değiştirmez.'),
      soru('İadesiz çekimde ikinci çekilişin olasılığı birinciden etkilenmez.', false, 'Çekilen top geri konmadığı için torba değişiyor.'),
      sikli('P(A|B) formülü?', ['P(A) · P(B)', 'P(A ∩ B) / P(B)'], 1, 'Örnek uzay B\'ye daralır.'),
      sikli('Çekilen top geri konursa olaylar?', ['Bağımlı', 'Bağımsız'], 1, 'İadesiz bağımlı.'),
      sikli('Ayrık olaylar bağımsız mıdır?', ['Evet', 'Hayır, ayrı kavramlar'], 1, 'Ayrıkta P(A|B) = 0.'),
      soru('P(A|B) ile P(B|A) aynı şeydir.', false, 'P(6 | çift) = 1/3 ama P(çift | 6) = 1.'),
    ], [
      {
        soru: 'P(A|B) = P(A) ise A ve B olayları nasıldır?',
        siklar: ['Bağımsız', 'Ayrık'],
        dogru: 0,
        aciklama: {
          dogru: 'B\'nin olması A\'nın olasılığını değiştirmiyor.',
          yanlis: 'Ayrık olaylar aynı anda olamaz; orada P(A|B) = 0 olurdu. Olasılığın değişmemesi bağımsızlık.',
        },
        kart: 5,
      },
    ]),
    konu('mat10-bayes', 'Bayes Teoremi', [
      kart(
        'Bayes koşulu ters çevirir',
        'Testin hasta birini yakalama olasılığı biliniyor: P(pozitif | hasta). Ama sen başka şeyi merak ediyorsun: P(hasta | pozitif). Bayes teoremi bu ikisini birbirine bağlar; bilineni ters çevirip aradığını verir.',
      ),
      kart(
        'Formül koşullu olasılıktan çıkar',
        'Koşullu olasılığı iki türlü yaz: P(A ∩ B) = P(A|B)·P(B) = P(B|A)·P(A). Buradan P(A|B) = P(B|A)·P(A) / P(B). Payda P(B) bütün yolları toplar: hem A olup B, hem A olmayıp B.',
      ),
      kart(
        'Sayılarla: 1000 kişilik köy',
        'Hastalık 1000 kişide 10\'da var. Test hastaların hepsini yakalasın, sağlamların %5\'ine yanlışlıkla pozitif desin. Pozitifler: 10 hasta + 990·0,05 ≈ 50 sağlam = 60. Pozitif çıkan biri gerçekten hasta: 10/60 ≈ %17.',
        undefined,
        { etiket: 'Örnek' },
      ),
      kart(
        'Nadir olan, testten sonra da nadir',
        'Test %95 doğruydu ama pozitif çıkanın hasta olma şansı %17. Sebep başlangıç oranı: 1000\'de 10. Buna önsel olasılık denir; testten sonraki %17 sonsal olasılık. Önsel küçükse sonsal da küçük kalır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Önsel olasılık', alt: 'yaygınlık: %1' },
            { ad: 'Test sonucu', alt: 'kanıt: pozitif test' },
            { ad: 'Sonsal olasılık', alt: 'güncellenmiş: %17', renk: 'ikincil' },
          ],
        },
        { not: 'Bir test sonucu görünce "test ne kadar doğru" demeden önce "hastalık ne kadar yaygın" diye sor.' },
      ),
      kart(
        'Taban oranını unutmak yaygın hata',
        'Çoğu insan "%95 doğru test pozitif dedi, %95 hastayım" der. Yanlış: 1000 kişinin 990\'ı sağlam ve o kalabalığın %5\'i (50 kişi) 10 hastayı sayıca geçer. Buna taban oranı yanılgısı denir.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Kanıt geldikçe inancı güncelle',
        'Bayes\'in kuralı: başlangıç inancın var (%1), kanıt geldi (pozitif test), inancı güncelledin (%17). İkinci test de pozitifse %17\'den başlayıp yeniden güncellersin. Spam süzgeçleri de böyle karar verir.',
      ),
    ], [
      soru('Bayes teoremi, yeni bir kanıt ışığında olasılığı güncellemeyi sağlar.', true, 'Ön bilgi ile kanıtı birleştiriyor: %1\'den %17\'ye.'),
      soru('Nadir bir hastalıkta test pozitif çıkarsa kişinin hasta olma olasılığı testin doğruluk oranına eşittir.', false, '1000 kişilik köyde %95 doğru test pozitif deyince hasta olma şansı %17.'),
      soru('Taban oranı yanılgısı, olayın toplumdaki yaygınlığını hesaba katmamaktır.', true, 'Sonucu olduğundan çok daha yüksek göstermeye yol açıyor.'),
      soru('Bayes teoreminde ön bilgi sonucu etkilemez.', false, 'Önsel olasılık hesabın içinde; küçükse sonsal da küçük kalır.'),
      sikli('Bayes teoremi neyi yapar?', ['Olasılıkları toplar', 'Koşullu olasılığı ters çevirir'], 1, 'P(B|A)\'dan P(A|B).'),
      sikli('İnsanların test doğruluğuna bakıp unuttuğu?', ['Test sonucu', 'Önsel olasılık'], 1, 'Taban oranı yanılgısı.'),
      soru('Spam süzgeçleri Bayes kuralıyla karar verir.', true, 'Kanıt geldikçe inancı güncelleme kuralı.'),
    ], [
      {
        soru: 'Nadir bir hastalıkta çok doğru bir test neden çok yanlış pozitif verir?',
        siklar: ['Test aslında doğru değil', 'Önsel olasılık çok düşük'],
        dogru: 1,
        aciklama: {
          dogru: 'Hasta olmayan kalabalığın küçük bir yüzdesi bile hasta sayısını aşar.',
          yanlis: 'Test doğru olabilir; sorun taban oranı. 990 sağlamın %5\'i (50 kişi), 10 hastadan çok.',
        },
        kart: 4,
      },
    ]),
  ]),
])
