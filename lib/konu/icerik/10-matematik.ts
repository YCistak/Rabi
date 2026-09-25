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
        'Temel oranlar',
        'Dik üçgende α açısına göre:\n- **sin α** = karşı / hipotenüs\n- **cos α** = komşu / hipotenüs\n- **tan α** = karşı / komşu\nOranlar açıya bağlıdır, üçgenin boyuna değil.',
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
      ),
      kart(
        'Özel açılar',
        '30°, 45° ve 60° değerleri ezberlenir.\n45-45-90 ve 30-60-90 üçgenlerinden türetilir.',
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
        'tan değerleri',
        '- **tan 30°** = √3/3\n- **tan 45°** = 1\n- **tan 60°** = √3\nAçı büyüdükçe sin ve tan artar, cos azalır.',
      ),
      kart(
        'Temel özdeşlik',
        '**sin²x + cos²x = 1**\nPisagor teoreminin birim çemberdeki karşılığıdır.',
      ),
      kart(
        'tan ve cot',
        '- **tan x** = sin x / cos x\n- **cot x** = cos x / sin x\ntan ve cot birbirinin çarpmaya göre tersidir: tan x · cot x = 1',
      ),
      kart(
        'Tümler açı',
        'Dik üçgende iki dar açı tümlerdir: toplamları 90°.\nBir açının sinüsü, tümlerinin kosinüsüne eşittir.\nÖrnek: sin 30° = cos 60°',
      ),
      kart(
        'Oran açıya bağlıdır',
        'Benzer iki dik üçgende kenarlar farklı, oranlar aynıdır.\nTrigonometri tam da bu yüzden işe yarar.',
        undefined,
        { not: 'Ezber: sin 30 = 1/2, sin 60 = √3/2; cos tam tersi. tan 45 = 1. Bunları bilirsen tabloyu türetirsin.' },
      ),
      kart(
        'Nerede kullanılır?',
        'Ölçülemeyen yükseklik ve uzaklıkları bulmakta:\n- Bir binanın boyu, gölgesinin açısından\n- Bir geminin kıyıya uzaklığı, iki gözlem açısından',
      ),
      kart(
        'Özel açı tablosu',
        'Sınavda en çok bu altı değer sorulur.',
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
        'Bir oran verilince ötekiler',
        'sin α = 3/5 ise karşı 3, hipotenüs 5 olan üçgen çizilir.\nPisagor’dan komşu 4 bulunur:\n- cos α = 4/5\n- tan α = 3/4',
      ),
      kart(
        'Kenar bulmak',
        'Hipotenüs 10, α = 30° ise:\n- Karşı kenar = 10 · sin 30° = 5\n- Komşu kenar = 10 · cos 30° = 5√3',
      ),
      kart(
        'Eğim ve tanjant',
        'Bir doğrunun eğimi, x ekseniyle yaptığı açının tanjantıdır: **m = tan α**.\n45°’lik rampa eğimi 1, yani bir adım ileri bir adım yukarı demektir.',
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
      soru('sin²x + cos²x = 1 özdeşliği bütün açılar için geçerlidir.', true, 'Birim çemberde Pisagor teoreminin karşılığı.'),
      soru('Bir açının sinüs değeri 1 den büyük olabilir.', false, 'Karşı kenar hipotenüsten uzun olamaz; oran en çok 1.'),
      soru('tan x = cos x / sin x tir.', false, 'Tersi: tan x = sin x / cos x.'),
      sikli('tan x · cot x çarpımı kaçtır?', ['0', '1'], 1, 'tan ve cot birbirinin çarpmaya göre tersi; çarpımları her zaman 1.'),
      sikli('sin 30° hangi değere eşittir?', ['cos 30°', 'cos 60°'], 1, 'Tümler açı.'),
      sikli('tan 45° kaçtır?', ['√3', '1'], 1, 'tan 60° = √3.'),
      sikli('Dik üçgende sin α = 3/5 ise cos α kaçtır?', ['4/5', '5/3'], 0, '3-4-5 üçgeni: komşu kenar 4, hipotenüs 5. Kosinüs 1\'den büyük olamaz.'),
      sikli('Trigonometrik oranlar neye bağlıdır?', ['Açıya', 'Üçgenin boyuna'], 0, 'Benzer üçgenlerde aynı.'),
      soru('Dar açılarda açı büyüdükçe kosinüs değeri de büyür.', false, 'Açı büyüdükçe komşu kenar kısalır: cos azalır, sin ve tan artar.'),
      soru('cos 60° = 1/2\'dir.', true, 'sin 30° ile aynı değer; tümler açılar.'),
      soru('tan α = 3/4 ise sin α = 3/4\'tür.', false, 'Üçgen 3-4-5: sin α = 3/5.'),
      sikli('Hipotenüs 8, α = 30° ise α\'nın karşısındaki kenar?', ['4√3', '4'], 1, '8 · sin 30° = 4.'),
      sikli('sin α = 5/13 ise cos α?', ['12/13', '5/12'], 0, '5-12-13 üçgeni; komşu 12.'),
    ], [
      {
        soru: 'tan 60° değeri kaçtır?',
        siklar: ['√3/3', '√3'],
        dogru: 1,
        aciklama: {
          dogru: 'tan 60° = sin 60° / cos 60° = (√3/2) / (1/2) = √3.',
          yanlis: '√3/3, tan 30°. Açı büyüdükçe tan artar: tan 60° = √3.',
        },
        kart: 3,
      },
      {
        soru: 'cos α = 4/5 ise tan α kaçtır?',
        siklar: ['4/3', '3/4'],
        dogru: 1,
        aciklama: {
          dogru: '3-4-5 üçgeni: komşu 4, karşı 3; tan = karşı/komşu = 3/4.',
          yanlis: '4/3 cot α olur. tan karşı bölü komşu: 3/4.',
        },
        kart: 10,
      },
    ]),
    konu('mat10-yardimci', 'Üçgende Yardımcı Elemanlar', [
      kart(
        'Kenarortay',
        'Bir köşeden karşı kenarın orta noktasına çizilir.\nÜç kenarortay **ağırlık merkezinde** kesişir.',
      ),
      kart(
        'Ağırlık merkezi',
        'Her kenarortayı **2 : 1** oranında böler.\nUzun parça köşe tarafında kalır.',
      ),
      kart(
        'Açıortay',
        'Bir açıyı iki eş parçaya böler.\nÜzerindeki her nokta açının iki kenarına eşit uzaklıktadır.\nÜç açıortay **iç teğet çemberin merkezinde** kesişir.',
      ),
      kart(
        'Yükseklik',
        'Bir köşeden karşı kenara indirilen dikmedir.\nÜç yükseklik **diklik merkezinde** kesişir.',
      ),
      kart(
        'Kenar orta dikme',
        'Kenarın orta noktasından kenara dik çizilen doğrudur.\nÜçü **çevrel çemberin merkezinde** kesişir.',
      ),
      kart(
        'Dört merkez',
        'Dört yardımcı eleman dört ayrı merkez üretir.\nHangisinin nerede kesiştiği sık karıştırılır; tabloyu birlikte oku.',
        {
          tur: 'tablo',
          basliklar: ['Eleman', 'Merkez'],
          satirlar: [
            ['Kenarortay', 'Ağırlık merkezi'],
            ['Açıortay', 'İç teğet çember'],
            ['Yükseklik', 'Diklik merkezi'],
            ['Orta dikme', 'Çevrel çember'],
          ],
        },
        { not: 'Kenarortay → ağırlık merkezi, açıortay → iç teğet, kenar orta dikme → çevrel, yükseklik → diklik merkezi.' },
      ),
      kart(
        'İkizkenar üçgende',
        'Tepe açısından inen açıortay, kenarortay ve yükseklik **aynı doğrudur**.\nÜçü çakışıyorsa üçgen ikizkenardır.',
      ),
      kart(
        'Açıortay bağıntısı',
        'İç açıortay, karşı kenarı komşu kenarların oranında böler.\nBu bağıntı benzerlikten çıkar.',
      ),
      kart(
        'Dik üçgende kısa yollar',
        '- **Hipotenüse ait kenarortay:** hipotenüsün yarısı\n- **Diklik merkezi:** dik açının köşesi\n- **Çevrel çemberin merkezi:** hipotenüsün orta noktası',
      ),
      kart(
        'Kenarortay uzunluğu',
        'a kenarına ait kenarortay:\n**4Va² = 2b² + 2c² − a²**\nDik üçgende hipotenüse ait kenarortay hipotenüsün yarısıdır.',
      ),
      kart(
        'İç teğet çember',
        'Merkezi iç açıortayların kesişimidir.\nYarıçapı: **r = Alan / u** (u: yarı çevre)\nMerkez üç kenara eşit uzaklıktadır.',
      ),
      kart(
        'Çevrel çember',
        'Merkezi kenar orta dikmelerin kesişimidir; üç köşeye eşit uzaklıktadır.\nDik üçgende merkez hipotenüsün orta noktasıdır.',
      ),
    ], [
      soru('Ağırlık merkezi, kenarortayları köşeden başlayarak 2:1 oranında böler.', true, 'Üç kenarortay tek bir noktada kesişiyor.'),
      soru('Açıortay, bir açıyı iki eş açıya ayıran ışındır.', true, 'İç açıortayların kesim noktası iç teğet çemberin merkezi.'),
      soru('Üçgenin yükseklikleri her zaman üçgenin içinde kesişir.', false, 'Geniş açılı üçgende kesim noktası üçgenin dışında kalır.'),
      soru('Kenar orta dikmelerin kesim noktası iç teğet çemberin merkezidir.', false, 'Çevrel çemberin merkezidir; iç teğet çemberin merkezi açıortayların kesişimi.'),
      sikli('Üç yükseklik nerede kesişir?', ['Ağırlık merkezinde', 'Diklik merkezinde'], 1, 'Kenarortaylar ağırlık merkezinde.'),
      sikli('Açıortay üzerindeki bir nokta neye eşit uzaklıktadır?', ['Açının iki kenarına', 'Açının köşesine ve karşı kenara'], 0, 'İç teğet çemberin merkezi bu yüzden üç kenara eşit uzaklıkta.'),
      sikli('İç açıortay karşı kenarı hangi oranda böler?', ['Eşit iki parçaya', 'Komşu kenarların oranında'], 1, 'Benzerlikten çıkar.'),
      sikli('Tepeden inen açıortay, kenarortay ve yükseklik çakışıyorsa üçgen?', ['Çeşitkenar', 'İkizkenar'], 1, 'Kanıt.'),
      soru('Dik üçgende hipotenüse ait kenarortay, hipotenüsün yarısına eşittir.', true, 'Hipotenüsün orta noktası çevrel çemberin merkezi; üç köşeye de eşit uzaklıkta.'),
      sikli('Dik üçgende çevrel çemberin merkezi nerededir?', ['Hipotenüsün orta noktasında', 'Dik açının köşesinde'], 0, 'Dik açının köşesinde olan diklik merkezi; çevrel merkez hipotenüsün ortası.'),
      soru('İç teğet çemberin merkezi açıortayların kesişimidir.', true, 'Bu nokta üç kenara eşit uzaklıktadır.'),
      soru('Çevrel çemberin merkezi kenarortayların kesişimidir.', false, 'Kenar orta dikmelerin kesişimi; kenarortayların kesişimi ağırlık merkezi.'),
      sikli('Alanı 24, yarı çevresi 12 olan üçgende iç teğet çemberin yarıçapı?', ['4', '2'], 1, 'r = 24 / 12.'),
      sikli('Dik üçgende çevrel çemberin merkezi nerededir?', ['Dik köşede', 'Hipotenüsün ortasında'], 1, 'Hipotenüs çevrel çemberin çapıdır.'),
    ], [
      {
        soru: 'Üç açıortay nerede kesişir?',
        siklar: ['İç teğet çemberin merkezinde', 'Çevrel çemberin merkezinde'],
        dogru: 0,
        aciklama: {
          dogru: 'Açıortay üstündeki nokta iki kenara eşit uzaklıkta; kesişim üç kenara teğet çemberin merkezi.',
          yanlis: 'Çevrel çemberin merkezi kenar orta dikmelerin kesişimi. Açıortaylar iç teğet çemberin merkezinde buluşur.',
        },
        kart: 3,
      },
      {
        soru: 'Hipotenüsü 10 olan dik üçgenin çevrel çemberinin yarıçapı?',
        siklar: ['5', '10'],
        dogru: 0,
        aciklama: {
          dogru: 'Hipotenüs çap; yarıçap 10/2 = 5.',
          yanlis: '10 çaptır. Dik üçgende hipotenüs çevrel çemberin çapı, yarıçap 5.',
        },
        kart: 12,
      },
    ]),
    konu('mat10-alan', 'Üçgenin Alanı', [
      kart(
        'Temel formül',
        '**Alan = (taban × yükseklik) / 2**\nYükseklik her zaman tabana dik olmalıdır.',
      ),
      kart(
        'İki kenar ve aradaki açı',
        '**Alan = ½ · a · b · sin C**\nYükseklik bilinmediğinde en pratik yol budur.',
      ),
      kart(
        'Eşit yükseklikli üçgenler',
        'Yükseklikler eşitse alanlar oranı = tabanlar oranı.\nBu yüzden kenarortay üçgeni iki eşit alana böler.',
      ),
      kart(
        'Benzerlikte alan',
        'Benzerlik oranı **k** ise alanlar oranı **k²** olur.\nUzunluk oranı ile alan oranı en sık karıştırılan ikilidir.',
      ),
      kart(
        'Ortak açılı üçgenler',
        'İki üçgenin bir açısı ortaksa:\nalanlar oranı = o açıyı oluşturan kenarların çarpımları oranı.',
      ),
      kart(
        'Hangi formül ne zaman?',
        'Elde ne olduğuna bak:\n- **Taban + yükseklik:** temel formül\n- **İki kenar + aradaki açı:** sinüslü formül',
        undefined,
        { not: 'İki kenar 6 ve 8, aradaki açı 30°: alan = ½·6·8·sin30 = 12. Yükseklik aramaya gerek yok.' },
      ),
      kart(
        'Heron formülü',
        'Üç kenar biliniyorsa, u yarı çevre olmak üzere:\n**A = √(u(u − a)(u − b)(u − c))**\n5, 5, 6 için u = 8 → A = √(8·3·3·2) = 12',
      ),
      kart(
        'Dik üçgende alan',
        '- **Dik kenarlarla:** A = (a · b) / 2\n- **Hipotenüs ve yükseklikle:** A = (c · h) / 2\nİkisini eşitlemek hipotenüse ait yüksekliği verir.',
      ),
      kart(
        'Eşkenar üçgen alanı',
        'Kenarı a olan eşkenar üçgende:\n**A = a²√3 / 4**\na = 6 → A = 9√3',
      ),
      kart(
        'İç teğet çemberle alan',
        '**A = r · u**\nr: iç teğet çemberin yarıçapı, u: yarı çevre',
      ),
      kart(
        'Kenarortay alanı böler',
        'Her kenarortay üçgeni iki eşit alanlı parçaya ayırır.\nÜç kenarortay birlikte altı eşit alanlı küçük üçgen oluşturur.',
      ),
    ], [
      soru('Üçgenin alanı, taban ile ona ait yüksekliğin çarpımının yarısıdır.', true, 'Hangi kenar taban seçilirse seçilsin sonuç aynı.'),
      soru('Tabanları ve yükseklikleri eşit olan üçgenlerin alanları eşittir.', true, 'Şekilleri farklı olsa da alan aynı kalıyor.'),
      soru('Benzerlik oranı k olan iki üçgenin alanları oranı da k dır.', false, 'Alan oranı k² olur.'),
      soru('Kenarortay, üçgeni alanları eşit iki üçgene ayırır.', true, 'Tabanlar eşit, yükseklik ortak: alanlar eşit.'),
      sikli('Kenarları 4 ve 10, aradaki açısı 30° olan üçgenin alanı kaçtır?', ['20', '10'], 1, '½ · 4 · 10 · sin 30° = ½ · 40 · ½ = 10.'),
      sikli('Bir açısı ortak iki üçgende alan oranı?', ['Tabanlar oranı', 'Açıyı oluşturan kenarların çarpımları oranı'], 1, 'Ortak açılı üçgenler.'),
      soru('Bir kenar 3 katına çıkarılıp ona ait yükseklik aynı bırakılırsa alan da 3 katına çıkar.', true, 'Alan taban ile yüksekliğin çarpımının yarısı; taban 3 kat, alan 3 kat.'),
      soru('Dik kenarları 6 ve 8 olan üçgenin alanı 24\'tür.', true, '(6 · 8)/2 = 24.'),
      soru('Bir kenarortay üçgeni farklı alanlı iki parçaya böler.', false, 'Tabanlar eşit, yükseklik ortak: alanlar eşit.'),
      soru('Kenarı 4 olan eşkenar üçgenin alanı 4√3\'tür.', true, '16√3 / 4 = 4√3.'),
      sikli('Kenarları 3, 4, 5 olan üçgenin alanı (Heron)?', ['6', '12'], 0, 'u = 6; √(6·3·2·1) = 6.'),
      sikli('Üç kenarortay üçgeni kaç eşit alanlı parçaya böler?', ['3', '6'], 1, 'Altı küçük üçgen oluşur.'),
      sikli('r = 2, yarı çevre 9 ise alan?', ['11', '18'], 1, 'A = r · u.'),
    ], [
      {
        soru: 'Kenarortay üçgeni nasıl iki parçaya böler?',
        siklar: ['Çevreleri eşit iki üçgen', 'Alanları eşit iki üçgen'],
        dogru: 1,
        aciklama: {
          dogru: 'Tabanları eşit, yükseklikleri ortak: alanlar eşit.',
          yanlis: 'Çevreler genelde farklı. Kenarortay tabanı ortaladığı ve yükseklik ortak olduğu için alanları eşitler.',
        },
        kart: 3,
      },
      {
        soru: 'Kenarları 5, 5, 8 olan üçgenin alanı?',
        siklar: ['20', '12'],
        dogru: 1,
        aciklama: {
          dogru: 'u = 9; √(9·4·4·1) = 12. Ya da tabana yükseklik 3: 8·3/2.',
          yanlis: '20 kenarların yarısını çarpmaktan gelir. Heron: u = 9, alan √144 = 12.',
        },
        kart: 7,
      },
    ]),
    konu('mat10-sinus-kosinus', 'Sinüs ve Kosinüs Teoremleri', [
      kart(
        'Sinüs teoremi',
        '**a / sin A = b / sin B = c / sin C**\nKenar ve karşı açı çiftleri bilindiğinde kullanılır.',
      ),
      kart(
        'Kosinüs teoremi',
        '**a² = b² + c² − 2bc · cos A**\nİki kenar ve aradaki açı bilindiğinde üçüncü kenarı verir.',
      ),
      kart(
        'Pisagor’un genellemesi',
        'A = 90° olunca cos A = 0 olur.\nKosinüs teoremi bu durumda Pisagor teoremine dönüşür.',
      ),
      kart(
        'Hangisi ne zaman?',
        'Elde hangi üçlünün olduğu, hangi teoremin kullanılacağını söyler.\nTabloda üç durum var.',
        {
          tur: 'tablo',
          basliklar: ['Bilinen', 'Teorem'],
          satirlar: [
            ['Kenar + karşı açı', 'Sinüs'],
            ['İki kenar + ara açı', 'Kosinüs'],
            ['Üç kenar', 'Kosinüs'],
          ],
        },
        { not: 'Kenar ve karşı açısı biliniyorsa sinüs; iki kenar + aradaki açı ya da üç kenar varsa kosinüs.' },
      ),
      kart(
        'Çevrel çemberle bağı',
        'Sinüs teoremindeki ortak oran çevrel çemberin çapıdır:\n**a / sin A = 2R**',
      ),
      kart(
        'Açının türü',
        'Kosinüs teoreminden çıkan cos değerine bak:\n- **Negatif:** açı geniş\n- **Sıfır:** açı dik\n- **Pozitif:** açı dar',
      ),
      kart(
        'Kosinüs teoremi örneği',
        'b = 3, c = 5, A = 60° ise:\na² = 9 + 25 − 2·3·5·(1/2) = 19\na = √19',
      ),
      kart(
        'Geniş açının sinüs ve kosinüsü',
        '- **sin(180° − α) = sin α**\n- **cos(180° − α) = −cos α**\ncos 120° = −1/2: geniş açının kosinüsü negatiftir.',
      ),
      kart(
        'Sinüsle alan',
        'İki kenar ve aradaki açı biliniyorsa:\n**A = ½ · b · c · sin A**\nb = 4, c = 6, A = 30° → A = 6',
      ),
      kart(
        'Sinüs teoremi örneği',
        'A = 30°, a = 5 ise çevrel çemberin yarıçapı:\na / sin A = 2R → 5 / (1/2) = 10 → R = 5',
      ),
    ], [
      soru('Kosinüs teoremi, dik üçgende Pisagor teoremine dönüşür.', true, '90° nin kosinüsü sıfır olduğu için son terim kayboluyor.'),
      soru('İki kenar ve aradaki açı biliniyorsa üçüncü kenar kosinüs teoremiyle bulunur.', true, 'Sinüs teoremi bu durumda yetmiyor.'),
      soru('Sinüs teoremi yalnızca dik üçgenlerde kullanılır.', false, 'Her üçgende geçerli; kenarlar ile karşı açıların sinüsleri orantılı.'),
      soru('Kosinüs teoreminde bulunan kosinüs değeri negatifse karşı açı dardır.', false, 'Negatif kosinüs geniş açı demek.'),
      sikli('Sinüs teoremindeki ortak oran neye eşittir?', ['2R (çevrel çap)', 'R'], 0, 'a/sin A = 2R.'),
      sikli('Üçgende bir kenar büyüdükçe karşısındaki açı için ne söylenir?', ['Açı da büyür', 'Açı küçülür'], 0, 'Sinüs teoremi: büyük kenarın karşısında büyük açı durur.'),
      soru('Kenarları 3, 5 ve 7 olan üçgende en büyük açı geniş açıdır.', true, 'cos = (9 + 25 − 49) / 30 = −1/2; açı 120°, geniş.'),
      soru('cos 120° = 1/2\'dir.', false, 'Geniş açının kosinüsü negatif: −1/2.'),
      soru('sin 150° = sin 30°\'dur.', true, 'sin(180° − α) = sin α.'),
      soru('Kosinüs teoreminde açı 90° olursa Pisagor bağıntısı elde edilir.', true, 'cos 90° = 0, son terim düşer.'),
      sikli('b = 2, c = 3, A = 60° ise a²?', ['7', '13'], 0, '4 + 9 − 2·2·3·½ = 7.'),
      sikli('Kenarları 6 ve 8, aradaki açı 30° olan üçgenin alanı?', ['24', '12'], 1, '½ · 6 · 8 · ½ = 12.'),
    ], [
      {
        soru: 'İki kenar ve aradaki açı biliniyorsa hangi teorem kullanılır?',
        siklar: ['Kosinüs teoremi', 'Sinüs teoremi'],
        dogru: 0,
        aciklama: {
          dogru: 'a² = b² + c² − 2bc·cos A üçüncü kenarı doğrudan verir.',
          yanlis: 'Sinüs teoremi kenar-karşı açı çifti ister. İki kenar ve aralarındaki açı kosinüs teoreminin girdisi.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('mat10-t2', 'İstatistiksel Araştırma Süreci', [
    konu('mat10-kategorik', 'İki Kategorik Değişkenli Veriler', [
      kart(
        'Kategorik değişken',
        'Sayıyla değil kategoriyle ölçülen değişkendir.\nÖrnek: cinsiyet, meslek, tercih',
      ),
      kart(
        'İki yönlü tablo',
        'İki kategorik değişkenin birlikte dağılımını gösterir.\nSatır ile sütunun kesiştiği hücre, ortak sayıyı verir.',
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
        'Satır ve sütun yüzdesi',
        'Aynı tablodan farklı yüzdeler çıkar.\nNeye bölündüğü söylenmezse sonuç yanıltıcı olur.',
        undefined,
        { not: '\'Kızların %60\'ı basket seviyor\' ile \'basket sevenlerin %60\'ı kız\' aynı tablodan iki farklı sayı.' },
      ),
      kart(
        'Marjinal dağılım',
        'Tablonun kenarlarındaki toplamlardır.\nTek bir değişkenin dağılımını verir, ötekini yok sayar.',
      ),
      kart(
        'İlişki var mı?',
        'Bir değişkenin dağılımına, ötekinin her düzeyinde ayrı ayrı bak.\nDağılım belirgin biçimde değişiyorsa ilişki vardır.',
      ),
      kart(
        'İlişki nedensellik değil',
        'İki kategorinin birlikte görünmesi, birinin ötekine yol açtığını göstermez.\nÜçüncü bir etken ikisini birden üretebilir.',
      ),
      kart(
        'Örnek tablo',
        '100 öğrencinin spor ve cinsiyet dağılımı:',
        {
          tur: 'tablo',
          basliklar: ['', 'Spor yapar', 'Yapmaz'],
          satirlar: [
            ['Kız', '30', '20'],
            ['Erkek', '35', '15'],
          ],
        },
      ),
      kart(
        'Tablodan oran okumak',
        'Yukarıdaki tabloda:\n- Kızların spor yapma oranı: 30/50 = %60\n- Erkeklerin: 35/50 = %70\nSatır toplamına bölmek grupları karşılaştırır.',
      ),
      kart(
        'Yığılmış sütun grafiği',
        'Her grup bir sütun, sütun kategorilere göre dilimlenir.\nGrupların büyüklüğü farklıysa %100’lük yığılmış sütun karşılaştırmayı kolaylaştırır.',
      ),
      kart(
        'Toplamı unutma',
        'Sayılar değil oranlar karşılaştırılır.\n30 kız ile 35 erkek spor yapıyor diye erkekler daha sporcu denemez; grup büyüklüklerine bakılır.',
      ),
    ], [
      soru('İki yönlü tabloda satır yüzdesi ile sütun yüzdesi farklı sorulara cevap verir.', true, 'Hangisinin kullanılacağı sorulan soruya bağlı.'),
      soru('Marjinal dağılım, tablonun kenarındaki toplam satır ve sütunlardan okunur.', true, 'Tek bir değişkenin dağılımını veriyor.'),
      soru('Göz rengi nicel bir değişkendir.', false, 'Sayıyla ölçülmüyor, gruplara ayrılıyor; kategorik değişken.'),
      soru('İki kategorik değişken arasında ilişki bulunması, birinin ötekine sebep olduğunu gösterir.', false, 'İlişki nedensellik değil; arkada üçüncü bir etken olabilir.'),
      sikli('"Kızların %60\'ı basketi seviyor" oranı neye bölünerek bulunur?', ['Kızların toplamına', 'Basket sevenlerin toplamına'], 0, 'Cümle kızlardan söz ediyor; payda kızların toplamı. Öteki, sevenlerin kaçının kız olduğunu verir.'),
      sikli('Kartın tablosunda 10. sınıfların yüzde kaçı "Evet" demiş?', ['%30', '%70'], 1, '10. sınıf satırı: 70 evet, 30 hayır, toplam 100.'),
      soru('Bir değişkenin dağılımı, ötekinin her düzeyinde belirgin biçimde değişiyorsa iki değişken ilişkilidir.', true, 'İlişkinin işareti bu; neden-sonuç olduğunu ise göstermez.'),
      soru('İki grubu karşılaştırırken satır yüzdeleri kullanılır.', true, 'Grup büyüklüğü farkını ortadan kaldırır.'),
      soru('Sayıca fazla olan grup her zaman oranca da fazladır.', false, 'Grup büyüklüğü farklıysa oran başka sonuç verebilir.'),
      sikli('Örnek tabloda erkeklerin spor yapma oranı?', ['%70', '%35'], 0, '35 / 50.'),
      sikli('Farklı büyüklükteki grupları karşılaştıran grafik?', ['Tek renk sütun', '%100 yığılmış sütun'], 1, 'Her sütun 100\'e tamamlanır.'),
      soru('Örnek tabloda spor yapmayanların sayısı 35\'tir.', true, '20 + 15 = 35.'),
    ], [
      {
        soru: 'İki yönlü tablonun kenar toplamlarına ne denir?',
        siklar: ['Marjinal dağılım', 'Koşullu dağılım'],
        dogru: 0,
        aciklama: {
          dogru: 'Kenar toplamları tek bir değişkenin dağılımını verir.',
          yanlis: 'Koşullu dağılım bir satır ya da sütunun içindeki yüzdeler. Kenar toplamları marjinal dağılım.',
        },
        kart: 4,
      },
    ]),
    konu('mat10-kategorik-inceleme', 'Başkalarının Oluşturduğu Kategorik Verileri İnceleme', [
      kart(
        'Kaynağı sorgula',
        'Veriyi kimin, hangi amaçla topladığı sonucun yorumunu değiştirir.',
      ),
      kart(
        'Sorunun kendisi',
        'Anket sorusunun kuruluşu cevabı yönlendirebilir.\nYönlendirici soruyla toplanan veri, doğru hesaplansa da geçersizdir.',
      ),
      kart(
        'Eksik kategori',
        'Sonucu bozan iki durum:\n- "Diğer" kategorisinin çok büyük olması\n- Bazı seçeneklerin hiç sunulmaması',
      ),
      kart(
        'Yüzde mi sayı mı?',
        'Küçük örneklemde yüzde abartılı görünür.\nÖrnek: 2 kişiden 1’i "yüzde 50" diye sunulabilir.',
      ),
      kart(
        'Görsel yanıltma',
        'Oranları olduğundan farklı gösteren grafikler:\n- Farklı alanlı daire dilimleri\n- Üç boyutlu grafikler',
      ),
      kart(
        'Cevap vermeyenler',
        'Ankete katılmayanlar rastgele değildir.\nYanıt oranı düşükse sonuç, katılmayı seçenlerin görüşüdür.',
        undefined,
        { not: '1000 kişiye anket, 100 cevap: sonuç \'toplum\' değil \'cevap vermeye istekli 100 kişi\'.' },
      ),
      kart(
        'Yüzde puan ve yüzde',
        '%20’den %30’a çıkış:\n- **10 yüzde puan** artıştır.\n- **%50** artıştır (10/20).\nHaberlerde ikisi sık karıştırılır.',
      ),
      kart(
        'Farklı tabanlar',
        '"A okulunda %40, B okulunda %20 başarılı" demek sayıca A’nın fazla olduğunu göstermez.\nA’da 50, B’de 500 öğrenci varsa B’de başarılı 100, A’da 20 kişidir.',
      ),
      kart(
        'Birden çok seçenek',
        'Birden fazla cevabın işaretlenebildiği sorularda yüzdelerin toplamı %100’ü geçebilir.\nBu hata değil, sorunun doğasıdır.',
      ),
      kart(
        'Örneklem büyüklüğü',
        '10 kişiyle yapılan ankette 1 kişi sonucu %10 değiştirir.\nKüçük örneklemde oranlar oynaktır; kaç kişiye sorulduğuna bak.',
      ),
    ], [
      soru('Anket sorusunun nasıl sorulduğu verilen cevapları etkileyebilir.', true, 'Yönlendirici soru, sonucu önceden şekillendiriyor.'),
      soru('Yüzdeyle verilen bir sonuçta toplam sayının bilinmesi önemlidir.', true, '4 kişiden 2 si de %50 dir, 4000 kişiden 2000 i de.'),
      soru('Ankete cevap vermeyenlerin varlığı sonucun yorumunu etkilemez.', false, 'Cevap vermeyenler belirli bir grupsa sonuç yanlı çıkıyor.'),
      soru('Bir tabloda bazı kategorilerin gösterilmemesi sonucu değiştirmez.', false, 'Eksik kategori, kalan yüzdeleri olduğundan büyük gösterebilir.'),
      sikli('Daire dilimlerinin alanı oranlarla uyuşmuyorsa sorun nedir?', ['Görsel yanıltma', 'Eksik kategori'], 0, 'Veri doğru olsa da çizim oranları olduğundan farklı gösteriyor.'),
      sikli('"Bu harika ürünü denemek ister misiniz?" nasıl bir sorudur?', ['Tarafsız', 'Yönlendirici'], 1, '"Harika" sözcüğü cevabı önceden yönlendiriyor.'),
      soru('Veriyi toplayan kurumun amacı, sonucun yorumunda dikkate alınmalıdır.', true, 'Kaynak ve amaç, hangi sorunun nasıl sorulduğunu belirliyor.'),
      soru('%10\'dan %15\'e çıkış 5 yüzde puanlık artıştır.', true, 'Oransal olarak %50 artış.'),
      soru('Birden çok seçenekli sorularda yüzdelerin toplamı %100\'ü geçemez.', false, 'Her kişi birden çok şık seçebildiği için geçebilir.'),
      soru('Küçük örneklemde oranlar tek kişiyle çok değişir.', true, '10 kişide bir kişi %10 eder.'),
      sikli('%20\'den %30\'a çıkış kaç yüzde artış?', ['%10', '%50'], 1, '10 puan artış, 20\'ye göre %50.'),
      sikli('Farklı büyüklükteki grupların yüzdeleri neyi göstermez?', ['Oranı', 'Kişi sayısını'], 1, 'Sayı için taban gerekir.'),
    ], [
      {
        soru: 'Yanıt oranı düşük bir anket kimin görüşünü yansıtır?',
        siklar: ['Katılmayı seçenlerin', 'Bütün toplumun'],
        dogru: 0,
        aciklama: {
          dogru: 'Katılmayanlar rastgele değil; sonuç taraflı.',
          yanlis: 'Katılmayanlar rastgele seçilmiş bir grup değil. Düşük yanıtta sonuç yalnızca katılmayı seçenleri anlatır.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('mat10-t3', 'Sayılar', [
    konu('mat10-asal-carpan', 'Bir Doğal Sayının Asal Çarpanları ve Bölenleri', [
      kart(
        'Asal sayı',
        'Yalnızca 1’e ve kendisine bölünen, 1’den büyük doğal sayıdır.\n2, tek çift asal sayıdır.',
      ),
      kart(
        '1 neden asal değil?',
        'Asal sayılsaydı asal çarpanlara ayrılış tek olmazdı:\n6 = 2·3 = 1·2·3 = 1·1·2·3',
      ),
      kart(
        'Asal çarpanlara ayırma',
        'Her doğal sayı asalların çarpımı olarak **tek bir biçimde** yazılır.\nBuna aritmetiğin temel teoremi denir.',
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
        'Pozitif bölen sayısı',
        'Sayı **p^a · q^b** biçimindeyse:\nbölen sayısı = **(a + 1)(b + 1)**',
      ),
      kart(
        'Asal olan bölen sayısı',
        'Toplam bölen sayısıyla karıştırılır.\n- 360’ın pozitif böleni: 24 tane\n- 360’ın asal böleni: 3 tane (2, 3, 5)',
        undefined,
        { not: '72 = 2³·3²: bölen sayısı 4·3 = 12, asal bölen 2 tane (2 ve 3), tek bölen sayısı 3 (1, 3, 9).' },
      ),
      kart(
        'Bölenlerin toplamı',
        'Her asal için kuvvetlerin toplamı ayrı hesaplanır, sonra çarpılır.\nÖrnek: 12 = 2²·3 → (1+2+4)(1+3) = 28',
      ),
      kart(
        'Tam kare sayılar',
        'Sayı tam kareyse:\n- Bütün asal çarpanlarının üsleri çifttir.\n- Bölen sayısı tektir.',
      ),
      kart(
        'Neden işe yarar?',
        'EBOB, EKOK ve sadeleştirmenin tamamı asal çarpanlara ayırmaya dayanır.',
      ),
      kart(
        'Hesap örneği',
        '**360 = 2³ · 3² · 5**\n- **Bölen sayısı:** (3+1)(2+1)(1+1) = 24\n- **Asal bölen:** 3 tane\n- **Tek bölen:** 3²·5’in bölenleri, (2+1)(1+1) = 6',
      ),
      kart(
        'Asallık testi',
        'Bir n sayısının asallığı için √n’e kadar olan asallara bölmek yeter.\nÖrnek: 97 için 2, 3, 5, 7’ye bakılır; hiçbiri bölmez, 97 asaldır.',
      ),
      kart(
        'Tek ve çift bölenler',
        'N = 2ᵃ · (tek kısım) ise:\n- **Tek bölen sayısı:** tek kısmın bölen sayısı\n- **Çift bölen:** toplam − tek\n72 = 2³·3² → tek bölen 3, toplam 12, çift 9',
      ),
      kart(
        'Faktöriyelde asal çarpan',
        'n! içinde p asalının kuvveti:\n⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …\n10! içinde 2’nin kuvveti: 5 + 2 + 1 = 8',
      ),
    ], [
      soru('1 sayısı asal sayı değildir.', true, 'Asal sayının tam iki pozitif böleni olmalı; 1 in tek böleni var.'),
      soru('72 = 2³ · 3² olduğuna göre 72 nin pozitif bölen sayısı 12 dir.', true, 'Üsler birer artırılıp çarpılıyor: 4 · 3 = 12.'),
      soru('Tam kare sayıların pozitif bölen sayısı çifttir.', false, 'Tam karelerde bölen sayısı tektir; ortadaki bölen kendisiyle eşleşiyor.'),
      soru('2 sayısı çift olduğu için asal değildir.', false, 'Asallık çift olmakla ilgili değil; 2 tek çift asal sayıdır.'),
      sikli('360\'ın tek pozitif bölenlerinin sayısı kaçtır?', ['24', '6'], 1, '2\'leri atınca 3²·5 kalır; bölen sayısı (2+1)(1+1) = 6.'),
      sikli('360\'ın asal böleni kaç tanedir?', ['24', '3'], 1, '2, 3, 5.'),
      sikli('2⁴ · 3² sayısı neden tam karedir?', ['Asal çarpanlarının üsleri çift', 'Bölen sayısı çift'], 0, 'Üsler çiftse sayı (2²·3)² = 144 olarak yazılır.'),
      sikli('1 asal sayılsaydı ne olurdu?', ['Hiçbir şey değişmezdi', 'Asal çarpanlara ayırma tek olmazdı'], 1, '6 = 1·2·3 = 1·1·2·3.'),
      sikli('Bölenlerin toplamı nasıl bulunur?', ['Her asalın üs toplamları çarpılır', 'Bölenler tek tek yazılır'], 0, 'Kısa yol.'),
      soru('Her doğal sayı asalların çarpımı olarak tek biçimde yazılır.', true, 'Aritmetiğin temel teoremi.'),
      soru('Bir sayının asal olduğunu anlamak için kendisinden küçük bütün sayılara bölmek gerekir.', false, '√n\'e kadar olan asallar yeter; daha büyük bir bölen varsa eşi √n\'den küçüktür.'),
      soru('36 sayısının tek bölen sayısı 3\'tür.', true, '36 = 2²·3²; tek kısım 3² → 1, 3, 9.'),
      soru('10! sayısında 5\'in kuvveti 3\'tür.', false, '⌊10/5⌋ = 2; 25 > 10. Kuvvet 2.'),
      sikli('20! sonunda kaç sıfır var?', ['4', '2'], 0, '5\'in kuvveti ⌊20/5⌋ = 4; her 5, bir 2 ile 10 yapar.'),
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
      {
        soru: '24 = 2³ · 3 sayısının kaç çift böleni var?',
        siklar: ['6', '8'],
        dogru: 0,
        aciklama: {
          dogru: 'Toplam 4·2 = 8 bölen, tek bölen 2 (1, 3); çift 6.',
          yanlis: '8 toplam bölen sayısı. Tek olanlar (1, 3) çıkarılınca 6 çift bölen kalır.',
        },
        kart: 11,
      },
    ]),
    konu('mat10-ebob-ekok', 'En Büyük Ortak Bölen, En Küçük Ortak Kat', [
      kart(
        'EBOB',
        'İki sayıyı da bölen en büyük sayıdır.\nOrtak asal çarpanların **en küçük** üsleri çarpılır.',
      ),
      kart(
        'EKOK',
        'İki sayının da katı olan en küçük sayıdır.\nBütün asal çarpanların **en büyük** üsleri çarpılır.',
        {
          tur: 'tablo',
          basliklar: ['', 'EBOB', 'EKOK'],
          satirlar: [
            ['Çarpan', 'Ortak olan', 'Hepsi'],
            ['Üs', 'En küçük', 'En büyük'],
          ],
        },
      ),
      kart(
        'Temel bağıntı',
        '**EBOB(a, b) · EKOK(a, b) = a · b**\nBiri bilindiğinde öteki buradan çıkar.',
      ),
      kart(
        'Aralarında asal',
        'EBOB’u 1 olan sayılar aralarında asaldır.\nBu sayıların EKOK’u çarpımlarına eşittir.',
      ),
      kart(
        'Nerede kullanılır?',
        '- **EBOB:** parçalara eşit bölme problemleri\n- **EKOK:** birlikte tekrar eden olaylar',
      ),
      kart(
        'Problemi ayırmak',
        '- **"En büyük parça", "kaç eşit grup":** EBOB\n- **"Kaç dakika sonra yine birlikte":** EKOK',
        undefined,
        { not: 'Aynı anda 12 ve 18 dk\'da bir kalkan otobüsler → EKOK 36 dk. 12 m ve 18 m\'lik ipleri eşit parçalara → EBOB 6.' },
      ),
      kart(
        'Hesap örneği',
        '12 = 2²·3 ve 18 = 2·3²\n- **EBOB** = 2·3 = 6 (küçük üsler)\n- **EKOK** = 2²·3² = 36 (büyük üsler)\nKontrol: 6·36 = 12·18 = 216',
      ),
      kart(
        'Asal çarpanlarla bulmak',
        '- **EBOB:** ortak asalların **küçük** üslüleri çarpılır.\n- **EKOK:** bütün asalların **büyük** üslüleri çarpılır.\n12 = 2²·3, 18 = 2·3² → EBOB 6, EKOK 36',
      ),
      kart(
        'EBOB problemi: parçalama',
        '"En büyük eşit parçalar", "en az sayıda kare" EBOB ister.\n60 × 84 duvara en büyük kare fayans: EBOB 12, kenar 12 cm.\nFayans sayısı: 5 · 7 = 35',
      ),
      kart(
        'EKOK problemi: buluşma',
        '"Yeniden birlikte", "en az kaç gün sonra" EKOK ister.\nBiri 6, öteki 8 günde bir nöbetçi: EKOK 24, 24 gün sonra yine birlikte.',
      ),
      kart(
        'Aynı kalan',
        '4’e, 6’ya ve 9’a bölünce hep 1 kalan en küçük sayı:\nEKOK(4, 6, 9) + 1 = 36 + 1 = 37',
      ),
    ], [
      soru('İki sayının EBOB u ile EKOK unun çarpımı, sayıların çarpımına eşittir.', true, 'Bu bağıntı biri bilinirken ötekini bulmayı sağlıyor.'),
      soru('Aralarında asal iki sayının EBOB u 1 dir.', true, 'Ortak asal çarpanları yok.'),
      soru('EKOK, iki sayının ortak bölenlerinin en büyüğüdür.', false, 'O tanım EBOB a ait; EKOK ortak katların en küçüğü.'),
      soru('Bir odayı tam sayıda eş kare fayansla kaplarken EKOK kullanılır.', false, 'En büyük kare fayansın kenarı EBOB ile bulunur.'),
      sikli('12 ile 18\'in EBOB\'u?', ['36', '6'], 1, 'Küçük üsler.'),
      sikli('Aralarında asal 4 ve 9\'un EKOK\'u kaçtır?', ['36', '13'], 0, 'Aralarında asal sayıların EKOK\'u çarpımlarıdır: 4 · 9 = 36.'),
      sikli('8 ile 12\'nin EKOK\'u kaçtır?', ['96', '24'], 1, '8 = 2³, 12 = 2²·3; büyük üsler: 2³·3 = 24.'),
      soru('İki sayının EBOB\'u, bu sayıların küçüğünden büyük olabilir.', false, 'EBOB iki sayıyı da böler; küçük sayıyı aşamaz.'),
      soru('EBOB bulunurken ortak asalların en büyük üslüleri alınır.', false, 'EBOB küçük üslüleri, EKOK büyük üslüleri alır.'),
      soru('"En az kaç gün sonra yine birlikte" soruları EKOK ister.', true, 'Ortak kat aranıyor.'),
      soru('3\'e ve 5\'e bölünce 2 kalan en küçük sayı 17\'dir.', true, 'EKOK 15 + 2 = 17.'),
      sikli('20 × 30 duvara en büyük kare fayansın kenarı?', ['60', '10'], 1, 'EBOB(20, 30) = 10.'),
    ], [
      {
        soru: '"İki otobüs kaç dakika sonra yine birlikte kalkar?" sorusunda ne kullanılır?',
        siklar: ['EBOB', 'EKOK'],
        dogru: 1,
        aciklama: {
          dogru: 'Birlikte tekrar eden olay ortak katı sorar.',
          yanlis: 'EBOB "en büyük parça / kaç eşit grup" sorularında. Tekrar eden olayların yeniden çakışması en küçük ortak kat.',
        },
        kart: 6,
      },
      {
        soru: '6 ve 10 günde bir gelen iki gemi en az kaç gün sonra yine birlikte gelir?',
        siklar: ['2', '30'],
        dogru: 1,
        aciklama: {
          dogru: 'Ortak kat aranıyor: EKOK(6, 10) = 30.',
          yanlis: '2 EBOB. "Yeniden birlikte" ortak kat ister: EKOK 30.',
        },
        kart: 10,
      },
    ]),
    konu('mat10-bolunebilme', 'Bölünebilme', [
      kart(
        '2, 5 ve 10 kuralı',
        'Son basamağa bakılır:\n- **2:** son basamak çift\n- **5:** son basamak 0 ya da 5\n- **10:** son basamak 0',
      ),
      kart(
        '3 ve 9 kuralı',
        'Rakamlar toplamına bakılır:\n- **3:** toplam 3’e bölünüyorsa\n- **9:** toplam 9’a bölünüyorsa',
      ),
      kart(
        '4 ve 8 kuralı',
        '- **4:** son iki basamak 4’e bölünüyorsa\n- **8:** son üç basamak 8’e bölünüyorsa',
      ),
      kart(
        'Kuralların özeti',
        'Kurallar üç öbekte toplanır:\n- Son basamaklara bakanlar\n- Rakamlar toplamına bakanlar\n- Dönüşümlü toplamaya dayananlar',
        {
          tur: 'tablo',
          basliklar: ['Bölen', 'Kural'],
          satirlar: [
            ['2, 5, 10', 'Son basamak'],
            ['4, 8', 'Son 2-3 basamak'],
            ['3, 9', 'Rakamlar toplamı'],
            ['11', 'Dönüşümlü toplam'],
          ],
        },
      ),
      kart(
        '11 kuralı',
        'Rakamlar sağdan sola dönüşümlü toplanıp çıkarılır: + − + − …\nSonuç 11’in katıysa sayı 11’e bölünür.',
      ),
      kart(
        'Bileşik kurallar',
        '6’ya bölünmesi için hem 2’ye hem 3’e bölünmelidir.\nBakılan bölenler **aralarında asal** olmalıdır.',
      ),
      kart(
        'Sık yapılan hata',
        '12’ye bölünme için 2 ve 6’ya bakmak yetmez: 2 ile 6 aralarında asal değil.\nDoğrusu **3 ve 4**’e bakmaktır.',
        undefined,
        { not: '12\'ye bölünme: 3 ve 4\'e bak (aralarında asal). 2 ve 6\'ya bakarsan 6 hem 2 hem 6\'ya bölünür ama 12\'ye değil.' },
      ),
      kart(
        'Kalan bulma',
        'Aynı kurallar kalanı da verir.\nÖrnek: rakamlar toplamının 9’a bölümünden kalan, sayının 9’a bölümünden kalandır.',
      ),
      kart(
        '7 kuralı',
        'Birler basamağından başlayarak basamaklar sırasıyla 1, 3, 2, −1, −3, −2 ile çarpılır.\nToplam 7’nin katıysa sayı 7’ye bölünür.\n161: 1·1 + 6·3 + 1·2 = 21 → bölünür',
      ),
      kart(
        'Basamaklı sayı soruları',
        '4a5 sayısı 9’a bölünüyorsa rakamlar toplamı 9’un katıdır:\n4 + a + 5 = 9 + a → a = 0 ya da 9',
      ),
      kart(
        'Kalanla işlem',
        'Toplamın ve çarpımın kalanı, kalanlardan hesaplanabilir.\n17 ≡ 2, 23 ≡ 3 (mod 5) → 17 · 23 ≡ 6 ≡ 1 (mod 5)',
      ),
    ], [
      soru('Rakamları toplamı 9 un katı olan sayı 9 a bölünür.', true, 'Kural doğrudan rakam toplamına bakıyor.'),
      soru('Son iki basamağı 4 ün katı olan sayı 4 e bölünür.', true, 'Yüzler basamağından sonrası zaten 4 e bölünüyor.'),
      soru('Rakamları toplamı 3 ün katı olan her sayı 9 a da bölünür.', false, '12 nin rakam toplamı 3; 3 e bölünüyor ama 9 a bölünmüyor.'),
      soru('Hem 4 e hem 6 ya bölünen bir sayı 24 e de bölünür.', false, '4 ile 6 aralarında asal değil; garanti olan 12 ye bölünmesi.'),
      sikli('3516 sayısı 8\'e bölünür mü?', ['Evet', 'Hayır'], 1, 'Son üç basamak 516; 516 = 8 · 64 + 4, kalan 4.'),
      sikli('6\'ya bölünme için hangi ikisine bakılır?', ['2 ve 4', '2 ve 3'], 1, 'Aralarında asal.'),
      sikli('Hangisi 11\'e bölünür?', ['235', '253'], 1, '253: 3 − 5 + 2 = 0, 11\'in katı. 235: 5 − 3 + 2 = 4.'),
      sikli('Bir sayının 9\'a bölümünden kalan nasıl bulunur?', ['Son basamaktan', 'Rakamlar toplamının 9\'a bölümünden'], 1, 'Kural kalanı da verir.'),
      soru('Son basamağı 0 olan sayı hem 2\'ye hem 5\'e bölünür.', true, '10\'a da.'),
      soru('2a4 sayısı 3\'e bölünüyorsa a = 0, 3, 6 ya da 9 olabilir.', true, '2 + a + 4 = 6 + a; 3\'ün katı olmalı.'),
      soru('Bir sayı 2\'ye ve 4\'e bölünüyorsa 8\'e de bölünür.', false, '12 ikisine de bölünür, 8\'e bölünmez; aralarında asal olmayan böleni çarpamazsın.'),
      sikli('17 · 23 çarpımının 5 ile bölümünden kalan?', ['1', '3'], 0, 'Kalanlar 2 ve 3; 2·3 = 6 ≡ 1.'),
      sikli('161 sayısı hangisine bölünür?', ['9', '7'], 1, '7 kuralında toplam 21; rakamlar toplamı 8 olduğu için 9\'a bölünmez.'),
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
      {
        soru: '5a2 sayısı 9\'a bölünüyorsa a kaçtır?',
        siklar: ['2', '4'],
        dogru: 0,
        aciklama: {
          dogru: '5 + a + 2 = 9 → a = 2.',
          yanlis: 'a = 4 ile toplam 11 olur, 9\'un katı değil. a = 2.',
        },
        kart: 10,
      },
    ]),
  ]),
  tema('mat10-t4', 'Nicelikler ve Değişimler', [
    konu('mat10-fonksiyon-sart', 'Gerçek Sayılarda Fonksiyon Olma Şartları', [
      kart(
        'Fonksiyon koşulu',
        'Tanım kümesindeki her eleman için:\n- Bir görüntü olmalı.\n- Bu görüntü tek olmalı.',
      ),
      kart(
        'Düşey doğru testi',
        'Her düşey doğru grafiği **en fazla bir** noktada kesiyorsa grafik bir fonksiyondur.',
      ),
      kart(
        'Tanım kümesi',
        'Tanım kümesinden çıkarılan değerler:\n- Paydayı sıfır yapanlar\n- Çift dereceli kökün içini negatif yapanlar',
        undefined,
        { not: 'f(x) = √(x−2) / (x−5): kök için x ≥ 2, payda için x ≠ 5. Tanım kümesi [2, 5) ∪ (5, ∞).' },
      ),
      kart(
        'Görüntü kümesi',
        'Fonksiyonun gerçekten aldığı değerlerin kümesidir.\nDeğer kümesinin alt kümesidir.',
      ),
      kart(
        'Bire bir ve örten',
        '- **Bire bir:** farklı girdiler farklı çıktı verir.\n- **Örten:** değer kümesinin tamamı kullanılır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Testi'],
          satirlar: [
            ['Bire bir', 'Yatay doğru testi'],
            ['Örten', 'Görüntü = değer kümesi'],
            ['Fonksiyon', 'Düşey doğru testi'],
          ],
        },
      ),
      kart(
        'Bileşke fonksiyon',
        '**(f∘g)(x) = f(g(x))**\nÖnce içteki uygulanır; sıra değişirse sonuç genelde değişir.',
      ),
      kart(
        'Birim fonksiyon',
        '**I(x) = x**, her girdiyi kendisine eşler.\nBileşkede etkisiz elemandır: f∘I = f',
      ),
      kart(
        'Fonksiyonlarla işlem',
        '(f + g)(x) = f(x) + g(x), (f · g)(x) = f(x) · g(x)\nTanım kümesi iki kümenin **kesişimidir**.\nf/g’de ayrıca g(x) = 0 yapan x atılır.',
      ),
      kart(
        'Tek ve çift fonksiyon',
        '- **Çift:** f(−x) = f(x); y eksenine simetrik (x²)\n- **Tek:** f(−x) = −f(x); orijine simetrik (x³)\nÇoğu fonksiyon ikisi de değildir.',
      ),
      kart(
        'Parçalı fonksiyon',
        'Tanım kümesinin farklı parçalarında farklı kural uygulanır.\nf(x) = x + 1 (x < 0), 2x (x ≥ 0)\nf(−3) = −2, f(3) = 6',
      ),
      kart(
        'Bileşkede sıra',
        '(f ∘ g)(x) = f(g(x)): önce g, sonra f\nf(x) = x + 1, g(x) = 2x → f(g(3)) = 7, g(f(3)) = 8\nBileşkenin değişme özelliği yoktur.',
      ),
    ], [
      soru(
        'Çizilen eğri bir fonksiyonun grafiğidir.',
        false,
        'Düşey doğru testi kalıyor: bir x değerine iki y karşılık geliyor.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -3, 3],
          xAd: 'x',
          yAd: 'y',
          cemberler: [{ x: 0, y: 0, r: 2 }],
        },
      ),
      soru('Bire bir fonksiyonda farklı elemanların görüntüleri de farklıdır.', true, 'Aynı görüntüye iki eleman gitmiyor.'),
      soru('Örten fonksiyonda değer kümesinin her elemanı bir görüntüdür.', true, 'Görüntü kümesi ile değer kümesi eşit oluyor.'),
      soru('Bileşke fonksiyonda işlem sırası sonucu değiştirmez.', false, 'f∘g ile g∘f genellikle farklı fonksiyonlardır.'),
      sikli('Grafiğin bire bir olup olmadığını hangi test gösterir?', ['Yatay doğru testi', 'Düşey doğru testi'], 0, 'Düşey doğru testi fonksiyon olmayı sınar; yatay doğru testi bire birliği.'),
      sikli('f(x) = x + 1 ve g(x) = 2x ise (f∘g)(3) kaçtır?', ['7', '8'], 0, 'Önce içteki: g(3) = 6, sonra f(6) = 7. 8 ise (g∘f)(3).'),
      sikli('I(x) = x fonksiyonu bileşkede nedir?', ['Etkisiz eleman', 'Ters eleman'], 0, 'f∘I = f.'),
      soru('Görüntü kümesi değer kümesinin alt kümesidir.', true, 'Gerçekten alınan değerler.'),
      soru('f(x) = x² çift fonksiyondur.', true, 'f(−x) = x² = f(x).'),
      soru('(f ∘ g)(x) ile (g ∘ f)(x) her zaman eşittir.', false, 'Bileşkede sıra önemlidir.'),
      soru('f + g fonksiyonunun tanım kümesi iki tanım kümesinin kesişimidir.', true, 'İkisinin de tanımlı olduğu yerde toplanabilir.'),
      sikli('f(x) = x + 1, g(x) = 2x ise f(g(2))?', ['5', '6'], 0, 'g(2) = 4; f(4) = 5.'),
      sikli('Orijine göre simetrik grafik?', ['Çift fonksiyon', 'Tek fonksiyon'], 1, 'f(−x) = −f(x).'),
    ], [
      {
        soru: 'f(x) = √(x − 3) fonksiyonunun tanım kümesi?',
        siklar: ['x ≥ 3', 'x > 0'],
        dogru: 0,
        aciklama: {
          dogru: 'Kök içi negatif olamaz: x − 3 ≥ 0.',
          yanlis: 'Sınır kökün içini sıfır yapan yer: x − 3 ≥ 0, yani x ≥ 3. x = 1 için kök içi −2 olur, tanımsız.',
        },
        kart: 3,
      },
      {
        soru: 'f(x) = x³ hangi tür fonksiyondur?',
        siklar: ['Çift', 'Tek'],
        dogru: 1,
        aciklama: {
          dogru: '(−x)³ = −x³: f(−x) = −f(x), orijine simetrik.',
          yanlis: 'Çift fonksiyonda f(−x) = f(x) olur. x³\'te işaret değişiyor: tek.',
        },
        kart: 9,
      },
    ]),
    konu('mat10-karesel', 'Karesel Fonksiyon ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        '**f(x) = ax² + bx + c**, a ≠ 0\nGrafiği bir paraboldür.',
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
      ),
      kart(
        'Kolların yönü',
        '- **a > 0:** kollar yukarı, en küçük değer var\n- **a < 0:** kollar aşağı, en büyük değer var',
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
        'Tepe noktası',
        '**x = −b / (2a)** noktasındadır.\nFonksiyonun en büyük ya da en küçük değeri buradadır.',
      ),
      kart(
        'Diskriminant',
        '**Δ = b² − 4ac**\nİşareti, parabolün x eksenini kaç noktada kestiğini söyler.',
        {
          tur: 'tablo',
          basliklar: ['Δ', 'Kök', 'Grafik'],
          satirlar: [
            ['Δ > 0', '2 kök', 'İki kez keser'],
            ['Δ = 0', '1 kök', 'Teğet'],
            ['Δ < 0', 'Yok', 'Kesmez'],
          ],
        },
        { not: 'Δ > 0 iki kök, Δ = 0 tek kök (parabol eksene teğet), Δ < 0 kök yok (eksene değmez).' },
      ),
      kart(
        'Simetri ekseni',
        'Tepe noktasından geçen düşey doğrudur.\nParabol bu doğruya göre simetriktir.',
      ),
      kart(
        'Kökler ve katsayılar',
        'Kökleri bulmadan hesaplanabilir:\n- **Toplam:** −b/a\n- **Çarpım:** c/a',
      ),
      kart(
        'Grafikten denklem',
        'Tepe noktası (r, k) ve bir nokta biliniyorsa:\n**f(x) = a(x − r)² + k** yazılır, a noktadan bulunur.',
      ),
      kart(
        'Nerede karşımıza çıkar?',
        '- Atılan bir cismin yolu\n- En büyük alan problemleri\n- En yüksek kâr problemleri',
      ),
      kart(
        'Tepe noktası örneği',
        'f(x) = x² − 4x + 3\n- r = −b / 2a = 2\n- k = f(2) = −1\nTepe (2, −1); a > 0 olduğu için en küçük değer −1.',
      ),
      kart(
        'Eksenleri kesme',
        '- **y eksenini:** (0, c) noktasında\n- **x eksenini:** f(x) = 0 denkleminin kökleri\nx² − 4x + 3 = (x − 1)(x − 3) → 1 ve 3',
      ),
      kart(
        'Tepe biçimi',
        '**f(x) = a(x − r)² + k**\nTepe noktası doğrudan okunur: (r, k)\nf(x) = 2(x + 1)² − 5 → tepe (−1, −5)',
      ),
      kart(
        'En büyük ve en küçük değer',
        '- **a > 0:** kollar yukarı, en küçük değer k\n- **a < 0:** kollar aşağı, en büyük değer k\nDeğer kümesi buna göre [k, ∞) ya da (−∞, k].',
      ),
    ], [
      soru(
        'Grafiği çizilen fonksiyonda a katsayısı pozitiftir.',
        false,
        'Kollar aşağı bakıyor; bu a nın negatif olduğunu gösteriyor.',
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
      soru('f(x) = ax² + bx + c fonksiyonunda c, tepe noktasının apsisidir.', false, 'c, parabolün y eksenini kestiği değer.'),
      sikli('Tepe noktasının x koordinatı?', ['−b/(2a)', 'b/(2a)'], 0, 'En büyük ya da en küçük değer.'),
      sikli('f(x) = x² − 6x + 9 parabolü x eksenine nasıl değer?', ['Teğet olur', 'İki noktada keser'], 0, 'Δ = 36 − 36 = 0; tek (çift katlı) kök x = 3.'),
      sikli('Köklerin toplamı?', ['−b/a', 'c/a'], 0, 'Çarpım c/a.'),
      sikli('f(x) = (x − 2)² + 5 fonksiyonunun en küçük değeri kaçtır?', ['2', '5'], 1, 'Tepe noktası (2, 5); kare negatif olamadığı için en küçük değer 5.'),
      soru('Atılan cismin yolu karesel fonksiyonla modellenir.', true, 'En yüksek nokta tepe.'),
      soru('f(x) = x² − 6x + 5 fonksiyonunun tepe noktasının apsisi 3\'tür.', true, 'r = −(−6) / 2 = 3.'),
      soru('f(x) = −x² + 4 fonksiyonunun en küçük değeri 4\'tür.', false, 'a < 0; 4 en büyük değer.'),
      soru('f(x) = 3(x − 2)² + 1 grafiğinin tepe noktası (2, 1)\'dir.', true, 'Tepe biçiminden okunur.'),
      sikli('f(x) = x² + 2x − 8 grafiği y eksenini nerede keser?', ['(0, 2)', '(0, −8)'], 1, 'x = 0 → c = −8.'),
      sikli('x² − 5x + 6 = 0 denkleminin kökleri?', ['2 ve 3', '−2 ve −3'], 0, '(x − 2)(x − 3) = 0.'),
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
      {
        soru: 'f(x) = x² − 2x − 3 fonksiyonunun en küçük değeri?',
        siklar: ['−4', '−3'],
        dogru: 0,
        aciklama: {
          dogru: 'r = 1, f(1) = 1 − 2 − 3 = −4.',
          yanlis: '−3 y eksenini kestiği değer. En küçük değer tepe noktasında: f(1) = −4.',
        },
        kart: 9,
      },
    ]),
    konu('mat10-karekok', 'Karekök Fonksiyonu ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        '**f(x) = √x**\n- **Tanım kümesi:** x ≥ 0\n- **Görüntü kümesi:** y ≥ 0',
      ),
      kart(
        'Grafiği',
        'Orijinden başlar, sağa doğru yavaşlayarak yükselir.\nYan yatmış bir parabolün üst yarısı gibidir.',
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
        'Artan fonksiyon',
        'Tanım kümesi boyunca artar, ama artış hızı azalır:\n- 0’dan 1’e: bir birim çıkar\n- 4’ten 9’a: yine bir birim çıkar',
      ),
      kart(
        'Tanım kümesi hesabı',
        'Kök içindeki ifade **≥ 0** olmalıdır.\nBu eşitsizlik çözülerek tanım kümesi bulunur.',
      ),
      kart(
        'Kaydırmalar',
        '- **√(x − 2):** sağa 2 birim, tanım x ≥ 2\n- **√x + 3:** yukarı 3 birim',
        undefined,
        { not: '√(x−2): sağa 2, tanım x ≥ 2. √(x+3): sola 3, tanım x ≥ −3. İçerideki işaret kaydırmanın tersi.' },
      ),
      kart(
        'Kareselin tersi',
        'f(x) = x², x ≥ 0 aralığına daraltılırsa terslenebilir.\nTersi karekök fonksiyonudur.',
      ),
      kart(
        'Görüntü kümesi',
        '√x ≥ 0 olduğu için:\n- f(x) = √x → [0, ∞)\n- f(x) = √(x − 2) + 3 → [3, ∞)\nDikey kaydırma görüntü kümesini kaydırır.',
      ),
      kart(
        'Tanım kümesi örnekleri',
        '- **√(x − 5):** x ≥ 5\n- **√(4 − x):** x ≤ 4\n- **√(2x + 6):** x ≥ −3\nKökün içi sıfırdan küçük olamaz.',
      ),
      kart(
        'Karekök denklemi',
        '√(x + 1) = 3 → iki yanın karesi: x + 1 = 9 → x = 8\nKare almak sahte kök üretebilir; bulunan değer denklemde denenmelidir.',
      ),
      kart(
        'Ters fonksiyon olarak',
        'f(x) = x² fonksiyonu x ≥ 0’da kısıtlanınca tersi √x olur.\nİki grafik y = x doğrusuna göre simetriktir.',
      ),
    ], [
      soru('f(x) = √x fonksiyonunun tanım kümesi x ≥ 0 dır.', true, 'Karekökün içi negatif olamaz.'),
      soru('f(x) = √x + 3 fonksiyonunun grafiği √x\'in 3 birim yukarısındadır.', true, 'Kökün dışına eklenen sayı grafiği düşeyde kaydırır.'),
      soru('f(x) = √(x − 3) fonksiyonunun tanım kümesi x ≥ −3 tür.', false, 'Kökün içi negatif olmamalı: x − 3 ≥ 0, yani x ≥ 3.'),
      soru('Karekök fonksiyonu negatif değerler de alabilir.', false, 'Karekökün sonucu negatif olmaz.'),
      sikli('f(x) = √x için f(16) − f(9) kaçtır?', ['1', '7'], 0, '√16 − √9 = 4 − 3 = 1.'),
      sikli('√x\'in artış hızı nasıl değişir?', ['Giderek azalır', 'Sabittir'], 0, '0→1 bir birim, 4→9 bir birim.'),
      soru('x ≥ 0 aralığında x²\'nin tersi karekök fonksiyonudur.', true, 'Daraltılmış tanım kümesi.'),
      soru('f(x) = √(3 − x) fonksiyonunun tanım kümesi x ≤ 3\'tür.', true, '3 − x ≥ 0.'),
      soru('f(x) = √x + 2 fonksiyonu 1 değerini alabilir.', false, 'Görüntü kümesi [2, ∞).'),
      soru('Karekök denkleminde bulunan kök mutlaka denenmelidir.', true, 'Kare alma sahte kök üretebilir.'),
      sikli('√(x − 1) = 4 ise x?', ['5', '17'], 1, 'x − 1 = 16.'),
      sikli('f(x) = √(x + 2) − 1 fonksiyonunun görüntü kümesi?', ['[−1, ∞)', '[2, ∞)'], 0, 'Kök ≥ 0, sonra 1 çıkarılır.'),
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
        'Genel biçim',
        'İki polinomun bölümüdür:\n**f(x) = P(x) / Q(x)**, Q(x) ≠ 0',
      ),
      kart(
        'Tanımsız noktalar',
        'Paydayı sıfır yapan değerler tanım kümesinde yoktur.\nGrafik o noktalarda kesintiye uğrar.',
      ),
      kart(
        'Düşey asimptot',
        'Payda sıfır, pay sıfırdan farklıysa oluşur.\nGrafik o düşey doğruya sonsuzca yaklaşır.',
      ),
      kart(
        'Yatay asimptot',
        'x çok büyüdüğünde fonksiyonun yaklaştığı yatay doğrudur.\nPay ile paydanın derecelerine bağlıdır.',
      ),
      kart(
        '1/x örneği',
        'En temel rasyonel fonksiyondur.\nGrafiği iki kollu bir hiperbol, eksenler de asimptotudur.',
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
        'Asimptotu kesmek',
        '- **Düşey asimptot:** grafik onu hiç kesmez.\n- **Yatay asimptot:** grafik onu ortada kesebilir.\nÖnemli olan sonsuzdaki davranıştır.',
        undefined,
        { not: '1/x\'in grafiği eksenlere sonsuza kadar yaklaşır, hiç kesmez; şıkta \'x eksenini keser\' diyorsa yanlış.' },
      ),
      kart(
        'Nerede karşımıza çıkar?',
        'Ters orantılı durumlar:\n- Sabit işte işçi sayısı ve süre\n- Sabit yolda hız ve zaman\n- Seyreltme problemleri',
      ),
      kart(
        'Yatay asimptotu bulmak',
        '- **Payın derecesi küçükse:** y = 0\n- **Dereceler eşitse:** y = baş katsayıların oranı\nÖrnek: (2x + 1)/(x − 3) → y = 2',
      ),
      kart(
        'Delik mi asimptot mu?',
        '(x² − 1) / (x − 1) = x + 1 (x ≠ 1)\nSadeleşen çarpan asimptot değil **delik** bırakır: grafik x = 1’de tek bir boş nokta taşır.',
      ),
      kart(
        'Rasyonel denklem',
        'Paydalar eşitlenir, pay sıfıra eşitlenir.\nPaydayı sıfır yapan kök **atılır**.\n(x² − 4)/(x − 2) = 0 → x = −2 (x = 2 atılır)',
      ),
      kart(
        'Grafiği kaydırmak',
        'f(x) = 1/(x − 2) + 1\n- Düşey asimptot: x = 2\n- Yatay asimptot: y = 1\n1/x grafiği 2 sağa, 1 yukarı kayar.',
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
      soru('f(x) = (x + 1)/(x − 2) fonksiyonunun düşey asimptotu x = 2 doğrusudur.', true, 'x = 2 paydayı sıfır yapıyor, payı yapmıyor.'),
      soru('Düşey asimptot, payı sıfır yapan değerlerde oluşur.', false, 'Paydayı sıfır yapan değerlerde oluşur; payı sıfır yapanlar köktür.'),
      sikli('Yatay asimptot neye bağlıdır?', ['Pay ve paydanın derecelerine', 'Sabit terime'], 0, 'x sonsuza giderken.'),
      sikli('1/x grafiği nedir?', ['İki kollu hiperbol', 'Parabol'], 0, 'Eksenler asimptot.'),
      sikli('Grafik hangi asimptotu hiç kesmez?', ['Düşey', 'Yatay'], 0, 'Yatayı ortada kesebilir.'),
      soru('Sabit hızda yol-zaman ilişkisi rasyonel fonksiyondur.', false, 'Doğrusal; sabit yolda hız-zaman ters orantı.'),
      sikli('f(x) = (3x − 1)/(x + 4) fonksiyonunun yatay asimptotu?', ['y = −4', 'y = 3'], 1, 'Dereceler eşit: baş katsayılar oranı 3/1. x = −4 ise düşey asimptot.'),
      soru('(x² − 9)/(x − 3) fonksiyonunun x = 3\'te düşey asimptotu vardır.', false, 'Çarpan sadeleşiyor; x = 3\'te delik var.'),
      soru('f(x) = 1/(x + 4) − 2 grafiğinin yatay asimptotu y = −2\'dir.', true, '1/x grafiği 2 aşağı kaymış.'),
      sikli('(x² − 1)/(x + 1) = 0 denkleminin çözümü?', ['x = ±1', 'x = 1'], 1, 'x = −1 paydayı sıfır yapar, atılır.'),
      sikli('f(x) = 3/(x − 5) fonksiyonunun düşey asimptotu?', ['x = 5', 'x = 3'], 0, 'Payda sıfır olduğu yer.'),
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
      {
        soru: 'f(x) = (x − 2)(x + 1)/(x − 2) grafiğinde x = 2\'de ne var?',
        siklar: ['Düşey asimptot', 'Delik'],
        dogru: 1,
        aciklama: {
          dogru: 'Çarpan sadeleşiyor; grafik x + 1 doğrusu, x = 2\'de bir boş nokta.',
          yanlis: 'Asimptot için sadeleşmeyen payda çarpanı gerekir. Sadeleşen çarpan delik bırakır.',
        },
        kart: 9,
      },
    ]),
    konu('mat10-ters-fonksiyon', 'Fonksiyonların Ters Fonksiyonları', [
      kart(
        'Ters fonksiyon nedir?',
        'Girdiyle çıktının yer değiştirdiği fonksiyondur.\n**f(a) = b ise f⁻¹(b) = a**',
      ),
      kart(
        'Koşulu',
        'Yalnızca bire bir ve örten fonksiyonların tersi vardır.\nÖbürleri, tanım kümesi daraltılarak terslenir.',
      ),
      kart(
        'Nasıl bulunur?',
        'Üç adım her fonksiyonda aynıdır.\nSonunda yalnız kalan y, ters fonksiyondur: f⁻¹(x)',
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
        'Grafiği',
        'Ters fonksiyonun grafiği, orijinalin **y = x** doğrusuna göre simetriğidir.',
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
        'Bileşkeyle bağı',
        '**f∘f⁻¹ = f⁻¹∘f = I**\nTersi, fonksiyonu birim fonksiyona götürendir.',
      ),
      kart(
        'Örnekler',
        '- **Karesel (x ≥ 0):** tersi karekök\n- **Doğrusal:** tersi yine doğrusal',
      ),
      kart(
        'Ters ile çarpmaya göre ters',
        '**f⁻¹(x) ≠ 1 / f(x)**\nÜstteki −1 bir kuvvet değil, ters fonksiyon işaretidir.',
        undefined,
        { not: 'f(x) = 2x + 1: f⁻¹(x) = (x−1)/2, ama 1/f(x) = 1/(2x+1). f(3) = 7 ise f⁻¹(7) = 3.' },
      ),
      kart(
        'Doğrusal fonksiyonun tersi',
        'f(x) = ax + b → **f⁻¹(x) = (x − b) / a**\nf(x) = 2x + 3 → f⁻¹(x) = (x − 3) / 2',
      ),
      kart(
        'Kesirli fonksiyonun tersi',
        'f(x) = (ax + b) / (cx + d) → **f⁻¹(x) = (−dx + b) / (cx − a)**\na ile d yer ve işaret değiştirir.',
      ),
      kart(
        'Tersten değer bulmak',
        '**f⁻¹(a) = b ⇔ f(b) = a**\nf(x) = 3x − 1 ise f⁻¹(8) için 3b − 1 = 8 → b = 3\nTersi bulmadan da sonuca gidilir.',
      ),
      kart(
        'Tanım kümesini kısıtlamak',
        'Bire bir olmayan fonksiyonun tersi yoktur; tanım kümesi kısıtlanır.\nf(x) = x², x ≥ 0 için f⁻¹(x) = √x',
      ),
    ], [
      soru('Bir fonksiyonun tersinin olması için bire bir ve örten olması gerekir.', true, 'Aksi hâlde geri dönüş tek anlamlı olmuyor.'),
      soru('Bir fonksiyon ile tersinin grafikleri y = x doğrusuna göre simetriktir.', true, 'x ile y yer değiştirdiği için simetri o doğruya göre.'),
      soru('f⁻¹(x), f(x) in çarpmaya göre tersidir, yani 1/f(x) tir.', false, 'İkisi ayrı kavram; ters fonksiyon işlemi geri alır, 1/f(x) bir bölme.'),
      soru('Ters fonksiyon bulunurken x ile y yer değiştirmez.', false, 'Tam da yer değiştirir; sonra y yalnız bırakılır.'),
      sikli('f(a) = b ise f⁻¹(b) kaçtır?', ['b', 'a'], 1, 'Girdi çıktı yer değiştirir.'),
      sikli('f(x) = x − 5 fonksiyonunun tersi?', ['f⁻¹(x) = 5 − x', 'f⁻¹(x) = x + 5'], 1, 'y = x − 5 → x = y − 5 → y = x + 5. Çıkarmanın tersi toplama.'),
      sikli('f∘f⁻¹ neye eşittir?', ['Sıfır', 'Birim fonksiyon'], 1, 'I.'),
      soru('f(x) = 3x − 2 ise f⁻¹(10) = 4 tür.', true, 'f(4) = 12 − 2 = 10; girdi ile çıktı yer değiştiriyor.'),
      soru('f(x) = 2x − 4 ise f⁻¹(x) = (x + 4)/2\'dir.', true, 'y = 2x − 4 → x = (y + 4)/2.'),
      soru('f(x) = x² fonksiyonunun bütün gerçek sayılarda tersi vardır.', false, 'Bire bir değil; x ≥ 0 gibi bir kısıtlama gerekir.'),
      soru('f⁻¹(5) = 2 ise f(2) = 5\'tir.', true, 'Ters fonksiyon eşlemeyi çevirir.'),
      sikli('f(x) = 5x + 1 ise f⁻¹(11)?', ['56', '2'], 1, '5b + 1 = 11 → b = 2.'),
      sikli('f(x) = (2x + 1)/(x − 3) ise f⁻¹(x)?', ['(3x + 1)/(x − 2)', '(x − 3)/(2x + 1)'], 0, 'a = 2, d = −3: (3x + 1)/(x − 2).'),
    ], [
      {
        soru: 'f⁻¹(x) ile 1/f(x) aynı şey midir?',
        siklar: ['Evet, ikisi de ters', 'Hayır, biri ters fonksiyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Üstteki −1 kuvvet değil ters fonksiyon işareti.',
          yanlis: 'f(x) = 2x için f⁻¹(x) = x/2, ama 1/f(x) = 1/(2x). Bambaşka iki şey; üstteki −1 kuvvet değil.',
        },
        kart: 7,
      },
      {
        soru: 'f(x) = 4x − 2 ise f⁻¹(10) kaçtır?',
        siklar: ['38', '3'],
        dogru: 1,
        aciklama: {
          dogru: '4b − 2 = 10 → b = 3.',
          yanlis: '38 f(10) olurdu. f⁻¹(10) için f(b) = 10 çözülür: b = 3.',
        },
        kart: 10,
      },
    ]),
    konu('mat10-denklem-problem', 'Fonksiyonlarla Denklem ve Eşitsizlik Problemleri', [
      kart(
        'Denklem kurmak',
        'Problemdeki ilişki bir fonksiyonla yazılır.\nAranan değer çoğunlukla o fonksiyonun kökü ya da tepe noktasıdır.',
      ),
      kart(
        'En büyük-en küçük',
        'Karesel fonksiyonda en iyi değer tepe noktasındadır.\nAlan ve kâr problemleri böyle çözülür.',
      ),
      kart(
        'İşaret incelemesi',
        'Eşitsizlik çözerken:\n- Kökler işaret tablosuna yerleştirilir.\n- Aralıklar tek tek sınanır.',
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
        'Çift kat kökte işaret',
        'Kök çift katlıysa işaret o noktada **değişmez**.\nTabloyu kurarken kökün katını da yaz.',
        undefined,
        { not: '(x−2)²(x+1) > 0: x = 2\'de işaret değişmez. Çözüm x > −1, x ≠ 2; \'2 dâhil\' diyen şık yanlış.' },
      ),
      kart(
        'İki fonksiyonu karşılaştırmak',
        '**f(x) > g(x)** eşitsizliği, f − g’nin pozitif olduğu aralıkları bulmaya indirgenir.',
      ),
      kart(
        'Bağlam kontrolü',
        'Kenar uzunluğu negatif, kişi sayısı kesirli olamaz.\nBulunan köklerden yalnızca bağlama uyanlar seçilir.',
      ),
      kart(
        'Kâr fonksiyonu',
        '- **Gelir:** satış fiyatı · adet\n- **Kâr:** gelir − maliyet\n- **Başabaş noktası:** kâr = 0, gelir maliyete eşit',
      ),
      kart(
        'Grafikten eşitsizlik',
        'f(x) > g(x) olan x’ler, f grafiğinin g’nin **üstünde** kaldığı yerlerdir.\nİki grafiğin kesiştiği noktalar eşitliğin çözümüdür.',
      ),
      kart(
        'İkinci derece eşitsizlik',
        'x² − 5x + 6 < 0 → kökler 2 ve 3\na > 0 olduğu için kökler arasında ifade negatiftir.\nÇözüm: 2 < x < 3',
      ),
      kart(
        'Alan problemi',
        '40 m telle en büyük dikdörtgen: kenarlar x ve 20 − x\nA(x) = x(20 − x), tepe noktası x = 10\nEn büyük alan kare: 100 m²',
      ),
      kart(
        'Mutlak değerli eşitsizlik',
        '- **|x − a| < b:** a − b < x < a + b\n- **|x − a| > b:** x < a − b ya da x > a + b\n|x − 3| < 2 → 1 < x < 5',
      ),
    ], [
      soru('Bir çarpanın çift katlı kökünde ifade işaret değiştirmez.', true, 'İşaret tablosunda o kökün iki yanında aynı işaret duruyor.'),
      soru('Problemde bulunan çözümün bağlama uygunluğu denetlenmelidir.', true, 'Uzunluk için çıkan negatif değer matematiksel çözümdür ama cevap değildir.'),
      soru('Bir eşitsizliğin çözümünde kökler her zaman çözüm kümesine dâhildir.', false, 'Eşitsizlik katıysa (< ya da >) kökler dâhil edilmez.'),
      soru('İki fonksiyonun grafiklerinin kesiştiği noktalar f(x) = g(x) denklemini sağlamaz.', false, 'Kesişim noktaları tam da bu denklemin çözümleridir.'),
      sikli('En büyük alan problemi nerede çözülür?', ['Tepe noktasında', 'Köklerde'], 0, 'Karesel fonksiyon.'),
      sikli('f(x) > g(x) nasıl çözülür?', ['f − g\'nin pozitif olduğu aralıklar', 'f\'nin kökleri'], 0, 'Fark fonksiyonu.'),
      soru('(x − 1)(x − 4) < 0 eşitsizliğinin çözümü 1 < x < 4 aralığıdır.', true, 'Kökler arasında çarpanların işaretleri zıt; çarpım negatif.'),
      soru('Başabaş noktasında kâr sıfırdır.', true, 'Gelir maliyete eşit.'),
      soru('x² − 4 < 0 eşitsizliğinin çözümü x > 2\'dir.', false, 'Kökler arası negatif: −2 < x < 2.'),
      soru('Çevresi sabit dikdörtgenler içinde alanı en büyük olan karedir.', true, 'A(x) = x(k − x) tepe noktası ortada.'),
      sikli('f ile g kesişiyorsa kesişim noktaları neyin çözümüdür?', ['f(x) > g(x)', 'f(x) = g(x)'], 1, 'İki fonksiyonun eşit olduğu yer.'),
      sikli('x² − 7x + 10 > 0 çözümü?', ['2 < x < 5', 'x < 2 ya da x > 5'], 1, 'a > 0; kökler dışında pozitif.'),
      sikli('|x − 1| ≤ 4 çözüm kümesi?', ['[−3, 5]', '[−4, 4]'], 0, '1 − 4 ≤ x ≤ 1 + 4.'),
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
      {
        soru: 'x² − 9 ≤ 0 eşitsizliğinin çözüm kümesi?',
        siklar: ['[−3, 3]', 'x ≥ 3'],
        dogru: 0,
        aciklama: {
          dogru: 'Kökler ±3; a > 0 olduğu için kökler arasında negatif ya da sıfır.',
          yanlis: 'x ≥ 3\'te ifade pozitif. Kökler arası negatiftir: [−3, 3].',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('mat10-t5', 'Sayma, Algoritma ve Bilişim', [
    konu('mat10-sayma', 'Sayma Stratejileri', [
      kart(
        'Toplama ve çarpma kuralı',
        '- **Toplama:** seçenekler birbirinin alternatifiyse\n- **Çarpma:** seçimler art arda yapılıyorsa',
      ),
      kart(
        'Faktöriyel',
        '**n! = n · (n − 1) ··· 2 · 1**\nn elemanın kaç farklı sırada dizilebileceğidir.\nTanım gereği 0! = 1',
      ),
      kart(
        'Permütasyon',
        'Sıralamanın **önemli** olduğu seçimlerdir.\nn elemandan r tanesinin sıralanışı **P(n, r)** ile bulunur.',
      ),
      kart(
        'Kombinasyon',
        'Sıralamanın **önemsiz** olduğu seçimlerdir.\n**C(n, r) = P(n, r) / r!**',
      ),
      kart(
        'Hangisi hangisi?',
        '- **"Kaç farklı sıra?":** permütasyon\n- **"Kaç farklı grup?":** kombinasyon',
        {
          tur: 'tablo',
          basliklar: ['Soru', 'Yöntem'],
          satirlar: [
            ['Kaç farklı sıra?', 'Permütasyon'],
            ['Kaç farklı grup?', 'Kombinasyon'],
            ['Başkanlık seçimi', 'Permütasyon'],
            ['Takım kurma', 'Kombinasyon'],
          ],
        },
        { not: '5 kişiden 2\'si başkan-yardımcı: 5·4 = 20 (sıra önemli). 5 kişiden 2 kişilik komite: 20/2 = 10.' },
      ),
      kart(
        'Tekrarlı sayma',
        'Aynı nesnelerden birden çok varsa:\ntoplam sıralama, tekrar sayılarının faktöriyellerine bölünür.\nÖrnek: ANNE → 4! / 2! = 12',
      ),
      kart(
        'Tümleyenden sayma',
        '"En az bir" sorularında istenmeyeni saymak daha kısadır:\ntoplamdan "hiç olmayan" durum çıkarılır.',
      ),
      kart(
        'Simetri özelliği',
        '**C(n, r) = C(n, n − r)**\nBir grubu seçmek, geri kalanı seçmekle aynı sayıda yol verir.',
      ),
      kart(
        'Hesap örneği',
        '- **5 kişiden 3’ü sıraya:** P(5,3) = 5·4·3 = 60\n- **5 kişiden 3’lü grup:** C(5,3) = 60 / 3! = 10\nSıra önemliyse sonuç 3! = 6 kat fazla.',
      ),
      kart(
        'Dairesel sıralama',
        'n kişi yuvarlak masaya **(n − 1)!** biçimde oturur.\nBiri sabitlenir, ötekiler ona göre sıralanır.\n5 kişi → 4! = 24',
      ),
      kart(
        'Yan yana olma',
        'Yan yana olması istenenler tek kişi gibi paketlenir, sonra kendi içinde sıralanır.\n5 kişide A ve B yan yana: 4! · 2! = 48',
      ),
      kart(
        'Tekrarlı harflerle sıralama',
        'n nesnede a tanesi aynıysa sıralama sayısı **n! / a!**\nANNE: 4! / 2! = 12\nKALEM: 5! = 120',
      ),
      kart(
        'Pascal üçgeni',
        'Her sayı üstündeki iki sayının toplamıdır.\nn. satır C(n, 0), C(n, 1), … C(n, n) sayılarını verir.\n1 · 1 1 · 1 2 1 · 1 3 3 1',
      ),
    ], [
      soru('Permütasyonda sıralama önemlidir, kombinasyonda değildir.', true, 'Aynı elemanlar farklı sırayla permütasyonda ayrı, kombinasyonda aynı sayılıyor.'),
      soru('0! = 1 dir.', true, 'Tanım gereği; formüllerin tutarlı çalışmasını sağlıyor.'),
      soru('5 kişiden 2 kişilik bir takım seçmek permütasyon problemidir.', false, 'Takımda sıra önemli değil; bu bir kombinasyon problemi.'),
      soru('C(n, r) = C(n, n−r) eşitliği yanlıştır.', false, 'Simetri özelliği bu eşitliği veriyor: r seçmek, n−r tanesini ayırmakla aynı.'),
      sikli('MASA kelimesinin harfleriyle kaç farklı sıralama yapılır?', ['12', '24'], 0, 'İki A var: 4! / 2! = 12.'),
      sikli('5 kişiden 3\'ü sıraya kaç türlü dizilir?', ['60', '10'], 0, 'P(5,3) = 5·4·3.'),
      sikli('C(6, 2) kaçtır?', ['15', '30'], 0, 'P(6,2) = 30, sıra önemsiz: 30 / 2! = 15.'),
      sikli('Seçenekler birbirinin alternatifiyse?', ['Toplanır', 'Çarpılır'], 0, 'Art arda çarpılır.'),
      sikli('"En az bir" sorularında kısa yol?', ['Hepsini saymak', 'Toplamdan hiç olmayanı çıkarmak'], 1, 'Tümleyen.'),
      soru('3 gömlek ve 4 pantolondan bir gömlek ve bir pantolon 7 farklı şekilde seçilir.', false, 'Seçimler art arda: 3 · 4 = 12. Toplama kuralı "ya o ya bu" seçimleri için.'),
      soru('6 kişi yuvarlak masaya 720 farklı biçimde oturur.', false, 'Dairesel: (6 − 1)! = 120.'),
      soru('ELMA sözcüğünün harfleriyle 24 farklı sıralama yazılır.', true, 'Harfler farklı: 4! = 24.'),
      soru('Pascal üçgeninde her sayı üstündeki iki sayının toplamıdır.', true, 'C(n, r) = C(n − 1, r − 1) + C(n − 1, r).'),
      sikli('ANNE sözcüğünün harfleri kaç farklı sıralanır?', ['24', '12'], 1, '4! / 2! (iki N).'),
      sikli('4 kişi sıraya giriyor, A ile B yan yana olacak. Kaç sıralama?', ['12', '6'], 0, '3! · 2! = 12.'),
    ], [
      {
        soru: '"10 kişiden 3 kişilik komite kaç türlü seçilir?" hangi kavramla çözülür?',
        siklar: ['Kombinasyon', 'Permütasyon'],
        dogru: 0,
        aciklama: {
          dogru: 'Komitede sıra yok; grup sorusu.',
          yanlis: 'Permütasyon sıralama ister (başkan, yardımcı, üye). Sırasız grup seçimi kombinasyon.',
        },
        kart: 5,
      },
      {
        soru: '5 kişi yuvarlak masaya kaç farklı biçimde oturur?',
        siklar: ['120', '24'],
        dogru: 1,
        aciklama: {
          dogru: 'Dairesel sıralama (n − 1)! = 4! = 24.',
          yanlis: '120 düz sıradaki 5!. Yuvarlakta biri sabitlenir: 4! = 24.',
        },
        kart: 10,
      },
    ]),
    konu('mat10-algoritmik-yapi', 'Cebirsel İşlemlerin Algoritmik Yapısı', [
      kart(
        'İşlem sırası bir algoritmadır',
        'Adımlar kesin sırayla uygulanır:\nparantez → üs → çarpma-bölme → toplama-çıkarma',
      ),
      kart(
        'Öklid algoritması',
        'EBOB’u kalanlı bölmeleri tekrarlayarak bulur.\nKalan sıfır olduğunda son bölen EBOB’dur.',
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
        'Döngü ile hesaplama',
        'Faktöriyel ve üs alma, tekrar eden çarpmalardır.\nBir döngüyle adım adım hesaplanır.',
      ),
      kart(
        'Özyineleme',
        'Bir işlem kendi küçüğüyle tanımlanabilir: **n! = n · (n − 1)!**\nDurma koşulu olmazsa tanım hiç kapanmaz.',
        undefined,
        { not: 'n! = n·(n−1)! tanımı 0! = 1 durma koşulu olmadan sonsuza gider. Tanımda önce durma koşulunu yaz.' },
      ),
      kart(
        'Verimlilik',
        'Aynı sonucu veren iki algoritmadan adım sayısı az olan yeğlenir.\nBüyük sayılarda fark büyür.',
      ),
      kart(
        'Neden Öklid daha hızlı?',
        'Büyük sayıyı asal çarpanlara ayırmak çok pahalıdır.\nÖklid aynı sonuca birkaç bölmeyle ulaşır.',
      ),
      kart(
        'Öklid algoritması örneği',
        'EBOB(84, 36):\n- 84 = 2 · 36 + 12\n- 36 = 3 · 12 + 0\nKalan sıfır olunca son bölen EBOB’dur: 12',
      ),
      kart(
        'Horner yöntemi',
        'Polinomun değeri iç içe çarpımla hesaplanır.\n2x³ + 3x² − x + 5, x = 2 için:\n((2·2 + 3)·2 − 1)·2 + 5 = 31\nKuvvet hesaplamadan az çarpımla sonuca gider.',
      ),
      kart(
        'Özyinelemeli tanım',
        'Bir değer bir öncekinden tanımlanır.\n- **Faktöriyel:** n! = n · (n − 1)!, 0! = 1\n- **Fibonacci:** Fₙ = Fₙ₋₁ + Fₙ₋₂ → 1, 1, 2, 3, 5, 8',
      ),
      kart(
        'Durma koşulu',
        'Her döngü ve özyineleme bir durma koşulu ister.\nÖklid’de "kalan 0", faktöriyelde "0! = 1" durma koşuludur.\nKoşul yoksa algoritma bitmez.',
      ),
      kart(
        'Hızlı kuvvet alma',
        'x⁸’i yedi çarpma yerine üçle hesaplamak: x² → (x²)² = x⁴ → (x⁴)² = x⁸\nAynı sonuca daha az adımla varan algoritma daha verimlidir.',
      ),
    ], [
      soru('İşlem önceliği kuralları adım adım uygulanan bir algoritmadır.', true, 'Aynı ifade herkeste aynı sonucu bu sayede veriyor.'),
      soru('Öklid algoritması iki sayının EBOB unu bulur.', true, 'Kalanlı bölme tekrarlanarak yürüyor.'),
      soru('Öklid algoritması, çarpanlara ayırma yöntemine göre daha yavaştır.', false, 'Büyük sayılarda çok daha hızlı; her adımda sayılar hızla küçülüyor.'),
      soru('Özyinelemeli bir tanımın durma koşuluna ihtiyacı yoktur.', false, 'Durma koşulu olmayan özyineleme hiç sonlanmaz.'),
      sikli('n! = n·(n−1)! tanımı nedir?', ['Döngü', 'Özyineleme'], 1, 'Durma koşulu şart.'),
      sikli('Faktöriyel döngüyle hesaplanırken her adımda ne yapılır?', ['Sonuç sıradaki sayıyla çarpılır', 'Sayılar toplanır'], 0, 'n! = 1·2·3···n; döngü çarpımı adım adım büyütüyor.'),
      soru('2 + 3 · 4 işleminin sonucu 20\'dir.', false, 'Çarpma önce: 3 · 4 = 12, sonra 2 + 12 = 14.'),
      soru('Öklid algoritmasında kalan sıfır olunca son bölen EBOB\'dur.', true, 'Algoritmanın durma koşulu budur.'),
      soru('Fibonacci dizisinde her terim öncekinin iki katıdır.', false, 'Her terim önceki iki terimin toplamıdır.'),
      soru('Horner yöntemi polinom değerini kuvvet almadan hesaplar.', true, 'İç içe çarpma ve toplama yeter.'),
      sikli('EBOB(48, 18) kaçtır?', ['3', '6'], 1, '48 = 2·18 + 12; 18 = 1·12 + 6; 12 = 2·6.'),
      sikli('1, 1, 2, 3, 5, 8, … dizisinin sonraki terimi?', ['13', '11'], 0, '5 + 8 = 13.'),
      soru('x¹⁶ ardışık kare alarak dört çarpmayla hesaplanabilir.', true, 'x² → x⁴ → x⁸ → x¹⁶.'),
    ], [
      {
        soru: 'Öklid algoritması neyi hesaplar?',
        siklar: ['Asal çarpanları', 'EBOB'],
        dogru: 1,
        aciklama: {
          dogru: 'Kalanlı bölmeleri tekrarlar; kalan sıfırken son bölen EBOB.',
          yanlis: 'Asal çarpanlara ayırma ayrı ve pahalı bir iş. Öklid birkaç bölmeyle EBOB\'u bulur.',
        },
        kart: 2,
      },
      {
        soru: 'Öklid algoritmasıyla EBOB(56, 21)?',
        siklar: ['21', '7'],
        dogru: 1,
        aciklama: {
          dogru: '56 = 2·21 + 14; 21 = 1·14 + 7; 14 = 2·7 → 7.',
          yanlis: '21, 56\'yı bölmüyor. Öklid adımları kalan 7\'de durur.',
        },
        kart: 7,
      },
    ]),
  ]),
  tema('mat10-t6', 'Analitik İnceleme', [
    konu('mat10-nokta', 'Dik Koordinat Sisteminde Noktanın Analitik İncelenmesi', [
      kart(
        'İki nokta arası uzaklık',
        'Pisagor teoreminden türer:\n**|AB| = √((x₂ − x₁)² + (y₂ − y₁)²)**',
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
          etiketler: [{ x: 2.6, y: 3.1, ad: 'd = 5', renk: 'ikincil' }],
        },
      ),
      kart(
        'Orta nokta',
        'Koordinatların ortalaması alınır:\n**((x₁ + x₂) / 2 , (y₁ + y₂) / 2)**',
      ),
      kart(
        'Bölme noktası',
        'Doğru parçasını verilen oranda bölen noktadır.\nKoordinatları, oranla ağırlıklandırılarak bulunur.',
      ),
      kart(
        'Üçgenin ağırlık merkezi',
        'Üç köşenin koordinatlarının ortalamasıdır.\nKenarortayları çizmeden bulunabilir.',
      ),
      kart(
        'Bölgeler',
        'Dört bölge işaretlerle ayrılır:\n- **I. bölge:** (+, +)\n- **II. bölge:** (−, +)\n- **III. bölge:** (−, −)\n- **IV. bölge:** (+, −)',
      ),
      kart(
        'Analitik düşünmenin gücü',
        'Koordinat verilince geometri sorusu bir hesaba dönüşür.\nÇizim yapmadan ispat yapılabilir.',
        undefined,
        { not: 'A(1,2), B(5,8): orta nokta (3,5), uzaklık √(16+36) = √52. Çizmeden, sadece koordinatla.' },
      ),
      kart(
        'Uzaklık örneği',
        'A(1, 2), B(4, 6):\n|AB| = √((4 − 1)² + (6 − 2)²) = √(9 + 16) = 5\nFarkların karesi alındığı için sıra önemli değildir.',
      ),
      kart(
        'Eksenlere ve orijine uzaklık',
        'A(3, −4) için:\n- x eksenine uzaklık |y| = 4\n- y eksenine uzaklık |x| = 3\n- orijine uzaklık √(9 + 16) = 5',
      ),
      kart(
        'Orta nokta örneği',
        'A(2, 8), B(6, −2) → orta nokta ((2 + 6)/2, (8 − 2)/2) = (4, 3)\nOrta nokta ve bir uç biliniyorsa öteki uç: 2·orta − uç',
      ),
      kart(
        'Paralelkenarın köşesi',
        'Paralelkenarda köşegenler birbirini ortalar:\n**A + C = B + D** (koordinatlar ayrı ayrı)\nA(0,0), B(4,0), C(5,3) → D(1, 3)',
      ),
      kart(
        'Koordinatla üçgen alanı',
        'A(0, 0), B(4, 0), C(0, 3) üçgeninde alan kenarlardan okunur: 4·3/2 = 6\nGenel durumda üçgen bir dikdörtgenin içine alınıp fazlalıklar çıkarılır.',
      ),
    ], [
      soru('A(−1, 3) ile B(5, −5) noktaları arasındaki uzaklık 10 birimdir.', true, 'Farklar 6 ve 8; √(36 + 64) = 10.'),
      soru('Orta nokta, doğru parçasını 1 : 1 oranında bölen bölme noktasıdır.', true, 'Orta nokta bölme noktasının özel hâli: iki parça eşit.'),
      soru('Bir üçgenin ağırlık merkezi, köşe koordinatlarının toplamına eşittir.', false, 'Toplamın üçte biri, yani ortalaması.'),
      soru('Apsisi negatif, ordinatı pozitif olan nokta birinci bölgededir.', false, 'İkinci bölgededir; birinci bölgede ikisi de pozitif.'),
      sikli('(2, 4) ile (6, 8)\'in orta noktası?', ['(8, 12)', '(4, 6)'], 1, 'Ortalamalar.'),
      sikli('Bir (x, y) noktasının orijine uzaklığı nedir?', ['√(x² + y²)', 'x + y'], 0, 'Uzaklık formülünde ikinci nokta (0, 0) alınır.'),
      soru('x ekseni üzerindeki her noktanın ordinatı sıfırdır.', true, 'x ekseninde y = 0; y ekseninde x = 0.'),
      soru('A(−2, 5) noktasının x eksenine uzaklığı 5\'tir.', true, 'x eksenine uzaklık |y|.'),
      soru('A(0, 0) ile B(3, 4) arası uzaklık 7\'dir.', false, '√(9 + 16) = 5.'),
      soru('Paralelkenarda karşılıklı köşelerin koordinat toplamları eşittir.', true, 'Köşegenler aynı orta noktayı paylaşır.'),
      sikli('A(1, 3), orta nokta M(4, 5) ise B?', ['(2,5; 4)', '(7, 7)'], 1, 'B = 2M − A = (8 − 1, 10 − 3).'),
      sikli('A(−6, 8) noktasının orijine uzaklığı?', ['10', '14'], 0, '√(36 + 64) = 10.'),
      sikli('A(0,0), B(6,0), C(0,4) üçgeninin alanı?', ['24', '12'], 1, 'Dik kenarlar 6 ve 4: 6·4/2.'),
    ], [
      {
        soru: '(1, 2) ile (4, 6) noktaları arasındaki uzaklık?',
        siklar: ['7', '5'],
        dogru: 1,
        aciklama: {
          dogru: 'Farklar 3 ve 4; √(9 + 16) = 5.',
          yanlis: 'Farklar toplanmaz. Pisagor: √(3² + 4²) = 5.',
        },
        kart: 1,
      },
      {
        soru: 'A(2, 1) ve B(8, 9) arası uzaklık?',
        siklar: ['10', '14'],
        dogru: 0,
        aciklama: {
          dogru: '√(6² + 8²) = √100 = 10.',
          yanlis: '14 farkları toplamaktır. Uzaklık √(36 + 64) = 10.',
        },
        kart: 7,
      },
    ]),
    konu('mat10-dogru', 'Dik Koordinat Sisteminde Doğrunun Analitik İncelenmesi', [
      kart(
        'Eğim',
        'İki nokta arasında y farkının x farkına oranıdır:\n**m = (y₂ − y₁) / (x₂ − x₁)**\nDüşey doğrunun eğimi tanımsızdır.',
      ),
      kart(
        'Doğru denklemi',
        '- **Eğim-kesim:** y = mx + n\n- **Nokta-eğim:** y − y₁ = m(x − x₁)',
      ),
      kart(
        'Paralellik',
        'Paralel iki doğrunun eğimleri eşittir.\nYa hiç kesişmezler ya da tümüyle çakışırlar.',
      ),
      kart(
        'Diklik',
        'Dik iki doğrunun eğimlerinin çarpımı **−1**’dir.',
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
        { not: 'Eğimi 2 olan doğruya dik doğrunun eğimi −1/2; paralel olanın eğimi yine 2. Dikte işaret değişir, ters çevrilir.' },
      ),
      kart(
        'Eksenleri kesme',
        '- **x = 0 yaz:** y eksenini kestiği nokta\n- **y = 0 yaz:** x eksenini kestiği nokta',
      ),
      kart(
        'Noktanın doğruya uzaklığı',
        'Doğrunun genel denklemi kullanılarak hesaplanır.\nUzaklık her zaman pozitiftir.',
      ),
      kart(
        'İki doğrunun kesişimi',
        'Denklemler birlikte çözülür:\n- **Tek çözüm:** kesişirler\n- **Çözüm yok:** paraleldirler\n- **Sonsuz çözüm:** çakışıktırlar',
      ),
      kart(
        'Eğim açısı',
        'Doğrunun x ekseniyle yaptığı açı α ise **m = tan α**.\n- α = 45° → m = 1\n- α dar ise m > 0, geniş ise m < 0',
      ),
      kart(
        'Eksen kesişimleriyle denklem',
        'x eksenini a’da, y eksenini b’de kesen doğru:\n**x/a + y/b = 1**\na = 3, b = 6 → 2x + y = 6',
      ),
      kart(
        'Özel doğrular',
        '- **x = a:** y eksenine paralel, eğimi tanımsız\n- **y = b:** x eksenine paralel, eğim 0\n- **y = x:** birinci açıortay, eğim 1',
      ),
      kart(
        'Diklik örneği',
        'y = 2x + 1 doğrusuna dik doğrunun eğimi: m₁ · m₂ = −1 → m₂ = −1/2\n(2, 1)’den geçen dik doğru: y = −x/2 + 2',
      ),
    ], [
      soru('Birbirine paralel iki doğrunun eğimleri eşittir.', true, 'Aynı yöne baktıkları için eğimleri aynı.'),
      soru('Birbirine dik iki doğrunun eğimleri çarpımı −1 dir.', true, 'Eksenlere paralel olmayan doğrular için geçerli.'),
      soru('x eksenine paralel bir doğrunun eğimi tanımsızdır.', false, 'Eğimi 0 dır; tanımsız olan y eksenine paralel doğrunun eğimi.'),
      soru('İki doğrunun kesişim noktası, denklemlerden yalnızca birini sağlar.', false, 'Kesişim noktası her iki denklemi de sağlar.'),
      sikli('A(1, 2) ve B(3, 8) noktalarından geçen doğrunun eğimi?', ['3', '1/3'], 0, '(8 − 2) / (3 − 1) = 6 / 2 = 3.'),
      sikli('y = 3x − 2 doğrusunun eğimi kaçtır?', ['−2', '3'], 1, 'y = mx + n biçiminde m eğim, n y eksenini kestiği yer.'),
      sikli('İki doğrunun denklem sistemi çözümsüzse?', ['Paralel', 'Çakışık'], 0, 'Sonsuz çözüm çakışık.'),
      sikli('y eksenini kestiği nokta nasıl bulunur?', ['x = 0 yazarak', 'y = 0 yazarak'], 0, 'y = 0 x eksenini.'),
      soru('Noktanın doğruya uzaklığı negatif olabilir.', false, 'Daima pozitif.'),
      soru('x = 4 doğrusunun eğimi 0\'dır.', false, 'Dikey doğru; eğimi tanımsız. Eğimi 0 olan y = b.'),
      soru('Eğim açısı 45° olan doğrunun eğimi 1\'dir.', true, 'tan 45° = 1.'),
      soru('x/2 + y/5 = 1 doğrusu y eksenini 5\'te keser.', true, 'x = 0 → y = 5.'),
      sikli('Eğimi 3 olan doğruya dik doğrunun eğimi?', ['−1/3', '1/3'], 0, 'm₁ · m₂ = −1.'),
    ], [
      {
        soru: 'Eğimi 2 olan doğruya dik doğrunun eğimi?',
        siklar: ['−1/2', '−2'],
        dogru: 0,
        aciklama: {
          dogru: 'Eğimler çarpımı −1: 2 · (−1/2) = −1.',
          yanlis: '2 · (−2) = −4, −1 değil. Dik doğrunun eğimi ters işaretli ve ters çevrilmiş: −1/2.',
        },
        kart: 4,
      },
      {
        soru: 'x eksenini 4\'te, y eksenini 2\'de kesen doğru?',
        siklar: ['2x + y = 4', 'x + 2y = 4'],
        dogru: 1,
        aciklama: {
          dogru: 'x/4 + y/2 = 1 → x + 2y = 4.',
          yanlis: '2x + y = 4, x eksenini 2\'de keser. x/4 + y/2 = 1 düzenlenince x + 2y = 4.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('mat10-t7', 'Veriden Olasılığa', [
    konu('mat10-kosullu', 'Koşullu Olasılık', [
      kart(
        'Tanımı',
        'Bir olayın, başka bir olayın gerçekleştiği bilinirken hesaplanan olasılığıdır.\nGösterimi: **P(A|B)**',
      ),
      kart(
        'Formülü',
        '**P(A|B) = P(A ∩ B) / P(B)**\nÖrnek uzay B’ye daraltılmış olur.',
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
        'Bilgi örnek uzayı daraltır',
        'Koşullu olasılıkta değişen şey olayın kendisi değildir.\nDeğişen, artık mümkün olan durumların kümesidir.',
      ),
      kart(
        'Bağımsız olaylar',
        '**P(A|B) = P(A)** ise olaylar bağımsızdır.\nBirinin gerçekleşmesi ötekini etkilemez.',
      ),
      kart(
        'İadeli ve iadesiz',
        '- **İadeli (top geri konur):** olaylar bağımsız\n- **İadesiz (geri konmaz):** olaylar bağımlı',
      ),
      kart(
        'Bağımsız ile ayrık farkı',
        '- **Ayrık:** aynı anda olamazlar.\n- **Bağımsız:** aynı anda olabilirler.\nİkisi birbirinin karşıtı değil, ayrı kavramlardır.',
      ),
      kart(
        'Sık yapılan hata',
        '**P(A|B) ile P(B|A) aynı şey değildir.**\nİkisini karıştırmak günlük hayatta da yanlış sonuç üretir.',
        undefined,
        { not: 'P(hasta | test pozitif) ≠ P(test pozitif | hasta). İkincisi testin özelliği, birincisi senin durumun.' },
      ),
      kart(
        'Çarpma kuralı',
        'Formül ters çevrilince iki olayın birlikte olma olasılığı çıkar:\n**P(A ∩ B) = P(A) · P(B | A)**',
      ),
      kart(
        'İadesiz çekiliş örneği',
        'Torbada 3 kırmızı, 2 mavi top var; iadesiz iki top çekiliyor.\nİkisinin de kırmızı olma olasılığı:\n3/5 · 2/4 = 3/10',
      ),
      kart(
        'Ağaç diyagramı',
        'Her dal bir koşullu olasılık taşır.\nBir yol boyunca olasılıklar **çarpılır**, aynı sonuca giden yollar **toplanır**.',
      ),
      kart(
        'Tablodan koşullu olasılık',
        '100 kişi: 40 gözlüklü, bunların 10’u solak.\nP(solak | gözlüklü) = 10/40 = 1/4\nKoşul, paydayı gözlüklülere indirir.',
      ),
    ], [
      soru('P(A|B), B nin gerçekleştiği bilindiğinde A nın olasılığıdır.', true, 'Bilgi, hesabın yapıldığı zemini değiştiriyor.'),
      soru('Yeni bir bilginin verilmesi örnek uzayı daraltır.', true, 'Artık yalnızca bilginin uyduğu sonuçlar sayılıyor.'),
      soru('Bağımsız olaylar ile ayrık olaylar aynı şeydir.', false, 'Ayrık olaylar birlikte olamaz; bağımsız olaylarda biri ötekinin olasılığını değiştirmez.'),
      soru('İadesiz çekimde ikinci çekilişin olasılığı birinciden etkilenmez.', false, 'Çekilen top geri konmadığı için örnek uzay değişiyor.'),
      sikli('P(A|B) formülü?', ['P(A) · P(B)', 'P(A ∩ B) / P(B)'], 1, 'Örnek uzay B\'ye daralır.'),
      sikli('3 kırmızı 2 mavi toptan iadesiz çekimde ilki kırmızıysa ikincinin kırmızı olma olasılığı?', ['3/5', '1/2'], 1, 'Geriye 2 kırmızı, 2 mavi kalıyor: 2/4 = 1/2.'),
      sikli('Zar atıldı, sonucun çift olduğu biliniyor. 6 gelme olasılığı?', ['1/3', '1/6'], 0, 'Örnek uzay {2, 4, 6}\'ya daraldı: 1/3.'),
      soru('P(A|B) ile P(B|A) aynı şeydir.', false, 'Karıştırmak yanlış sonuç üretir.'),
      soru('P(A ∩ B) = P(A) · P(B | A)\'dır.', true, 'Koşullu olasılık formülünün ters çevrilmiş hâli.'),
      soru('Ağaç diyagramında bir yol boyunca olasılıklar toplanır.', false, 'Yol boyunca çarpılır; farklı yollar toplanır.'),
      soru('İadesiz çekilişte ikinci çekilişin olasılığı birinciye bağlıdır.', true, 'Torbadaki top sayısı değişir.'),
      sikli('4 kırmızı, 1 mavi topdan iadesiz iki kırmızı?', ['12/25', '3/5'], 1, '4/5 · 3/4 = 3/5.'),
      sikli('P(A) = 0,5, P(B | A) = 0,4 ise P(A ∩ B)?', ['0,2', '0,9'], 0, '0,5 · 0,4.'),
    ], [
      {
        soru: 'P(A|B) = P(A) ise A ve B olayları nasıldır?',
        siklar: ['Bağımsız', 'Ayrık'],
        dogru: 0,
        aciklama: {
          dogru: 'B\'nin olması A\'nın olasılığını değiştirmiyor.',
          yanlis: 'Ayrık olaylar aynı anda olamaz; orada P(A|B) = 0 olurdu. Olasılığın değişmemesi bağımsızlık.',
        },
        kart: 4,
      },
      {
        soru: '2 kırmızı, 3 mavi topdan iadesiz iki top: ikisi de mavi?',
        siklar: ['3/10', '9/25'],
        dogru: 0,
        aciklama: {
          dogru: '3/5 · 2/4 = 6/20 = 3/10.',
          yanlis: '9/25 iadeli çekilişin sonucu. İadesizde ikinci çekiliş 2/4: 3/10.',
        },
        kart: 9,
      },
    ]),
    konu('mat10-bayes', 'Bayes Teoremi', [
      kart(
        'Ne yapar?',
        'Koşullu olasılığı ters çevirir:\nP(B|A) biliniyorken **P(A|B)**’yi hesaplar.',
      ),
      kart(
        'Formülü',
        '**P(A|B) = P(B|A) · P(A) / P(B)**\nPayda, toplam olasılık kuralıyla açılır.',
      ),
      kart(
        'Ön bilgi önemlidir',
        'Önsel olasılık P(A), sonucu belirleyici biçimde etkiler.\nNadir bir durum, testten sonra da nadirdir.',
      ),
      kart(
        'Tıbbi test örneği',
        'Çok doğru bir test bile nadir bir hastalıkta çok sayıda yanlış pozitif üretir.\nSebep, düşük önsel olasılıktır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Önsel olasılık', alt: 'hastalık ne kadar yaygın' },
            { ad: 'Test sonucu', alt: 'yeni kanıt' },
            { ad: 'Sonsal olasılık', alt: 'güncellenmiş inanç', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Taban oranı yanılgısı',
        'İnsanlar test doğruluğuna bakıp önsel olasılığı unutur.\nBayes, unutulan o sayıyı hesaba geri sokar.',
        undefined,
        { not: 'Hastalık 1000\'de 1, test %99 doğru: pozitif çıkanların çoğu aslında sağlam (10 yanlış pozitife 1 gerçek).' },
      ),
      kart(
        'Neden önemli?',
        'Yeni kanıt geldiğinde inancı güncellemenin matematiksel kuralıdır.\nMakine öğrenmesinde de kullanılır.',
      ),
      kart(
        'Toplam olasılık',
        'B olayı farklı yollardan gerçekleşebiliyorsa yolların katkıları toplanır:\n**P(B) = P(A)·P(B|A) + P(A′)·P(B|A′)**\nBayes’in paydası budur.',
      ),
      kart(
        'İki fabrika örneği',
        'Ürünlerin %60’ı A’dan (%2 kusurlu), %40’ı B’den (%5 kusurlu).\nP(kusurlu) = 0,6·0,02 + 0,4·0,05 = 0,032\nP(A | kusurlu) = 0,012 / 0,032 = 3/8',
      ),
      kart(
        'Ağaçla Bayes',
        '- Önce dallara ön olasılıkları yaz.\n- Her dalın ucuna koşullu olasılığı yaz.\n- İstenen yolu, o sonuca giden bütün yolların toplamına böl.',
      ),
      kart(
        'Yanlış pozitif',
        'Hasta olmayan birinin testi pozitif çıkabilir.\nHastalık nadirse pozitiflerin çoğu yanlış pozitiftir; bu yüzden test tekrarlanır.',
      ),
      kart(
        'Ön ve son olasılık',
        '- **Ön olasılık:** bilgi gelmeden önceki tahmin, P(A)\n- **Son olasılık:** bilgi geldikten sonraki, P(A | B)\nBayes, yeni bilgiyle tahmini güncellemenin yoludur.',
      ),
    ], [
      soru('Bayes teoremi, yeni bir kanıt ışığında olasılığı güncellemeyi sağlar.', true, 'Ön bilgi ile kanıtı birleştiriyor.'),
      soru('Nadir bir hastalıkta test pozitif çıkarsa kişinin hasta olma olasılığı testin doğruluk oranına eşittir.', false, 'Hastalığın nadirliği hesaba katılınca bu olasılık çok daha düşük çıkıyor.'),
      soru('Taban oranı yanılgısı, olayın toplumdaki yaygınlığını hesaba katmamaktır.', true, 'Sonucu olduğundan çok daha yüksek göstermeye yol açıyor.'),
      soru('Bayes teoreminde ön bilgi sonucu etkilemez.', false, 'Ön bilgi hesabın içinde ve sonucu belirleyen etkenlerden biri.'),
      sikli('Bayes teoremi neyi yapar?', ['Olasılıkları toplar', 'Koşullu olasılığı ters çevirir'], 1, 'P(B|A)\'dan P(A|B).'),
      sikli('Bayes formülüne göre P(A|B) neye eşittir?', ['P(B|A)·P(A) / P(B)', 'P(B|A)·P(B) / P(A)'], 0, 'Pay: B\'nin A içindeki olasılığı çarpı A\'nın önsel olasılığı.'),
      soru('Bayes formülünün paydasındaki P(B), toplam olasılık kuralıyla açılabilir.', true, 'P(B) = P(B|A)·P(A) + P(B|A′)·P(A′).'),
      soru('Bayes teoreminin paydası toplam olasılıktır.', true, 'Sonuca giden bütün yolların toplamı.'),
      soru('Nadir bir hastalıkta pozitif test sonucu kişinin kesin hasta olduğunu gösterir.', false, 'Yanlış pozitiflerin payı yüksek olabilir.'),
      soru('Ağaç diyagramında Bayes, istenen yol bölü toplam yollarla hesaplanır.', true, 'Koşul örnek uzayı o sonuca daraltır.'),
      sikli('Örnekte P(kusurlu) kaçtır?', ['0,07', '0,032'], 1, '0,012 + 0,020.'),
      sikli('Kusurlu ürünün B\'den gelme olasılığı?', ['5/8', '2/5'], 0, '0,020 / 0,032 = 5/8.'),
      sikli('Test sonucundan sonra güncellenen olasılık?', ['Ön olasılık', 'Son olasılık'], 1, 'Bilgi geldikten sonraki P(A | B).'),
    ], [
      {
        soru: 'Nadir bir hastalıkta çok doğru bir test neden çok yanlış pozitif verir?',
        siklar: ['Test aslında doğru değil', 'Önsel olasılık çok düşük'],
        dogru: 1,
        aciklama: {
          dogru: 'Hasta olmayan kalabalığın küçük bir yüzdesi bile hasta sayısını aşar.',
          yanlis: 'Test doğru olabilir; sorun taban oranı. Sağlıklı milyonların %1\'i, hasta binlerin %99\'undan çok.',
        },
        kart: 4,
      },
      {
        soru: 'Toplam olasılık Bayes formülünün neresinde durur?',
        siklar: ['Payında', 'Paydasında'],
        dogru: 1,
        aciklama: {
          dogru: 'Pay istenen yol, payda o sonuca giden bütün yolların toplamı.',
          yanlis: 'Payda istenen tek yol var. Toplam olasılık paydadır.',
        },
        kart: 7,
      },
    ]),
  ]),
])
