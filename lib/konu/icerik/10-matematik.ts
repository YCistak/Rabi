import { kart, konu, program, soru, tema } from '../tip'

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
        'sin = karşı/hipotenüs, cos = komşu/hipotenüs, tan = karşı/komşu. Oranlar açıya bağlıdır, üçgenin boyuna değil.',
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
        '30°, 45° ve 60° değerleri ezberlenir; 45-45-90 ve 30-60-90 üçgenlerinden türetilir.',
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
        'Temel özdeşlik',
        'sin²x + cos²x = 1. Pisagor teoreminin birim çemberdeki karşılığıdır.',
      ),
      kart(
        'tan ve cot',
        'tan x = sin x / cos x, cot x = cos x / sin x. tan ve cot birbirinin çarpmaya göre tersidir.',
      ),
      kart(
        'Tümler açı',
        'Bir açının sinüsü, tümlerinin kosinüsüne eşittir: sin 30° = cos 60°. Dik üçgende iki dar açı tümlerdir.',
      ),
      kart(
        'Oran açıya bağlıdır',
        'Benzer iki dik üçgende kenarlar farklı, oranlar aynıdır. Trigonometri tam da bu yüzden işe yarar.',
      ),
      kart(
        'Nerede kullanılır?',
        'Ölçülemeyen yükseklik ve uzaklıklar: bir binanın boyu, gölge açısından; geminin kıyıya uzaklığı, iki açıdan bulunur.',
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
    ]),
    konu('mat10-yardimci', 'Üçgende Yardımcı Elemanlar', [
      kart(
        'Kenarortay',
        'Bir köşeden karşı kenarın orta noktasına çizilir. Üçü ağırlık merkezinde kesişir.',
      ),
      kart(
        'Ağırlık merkezi',
        'Kenarortayları 2:1 oranında böler; uzun parça köşe tarafındadır.',
      ),
      kart(
        'Açıortay',
        'Bir açıyı iki eş parçaya böler. Üçü iç teğet çemberin merkezinde kesişir.',
      ),
      kart(
        'Yükseklik',
        'Bir köşeden karşı kenara indirilen dikme. Üçü diklik merkezinde kesişir.',
      ),
      kart(
        'Kenar orta dikme',
        'Kenarların orta noktasından dikilen doğrular çevrel çemberin merkezinde kesişir.',
      ),
      kart(
        'Dört merkez',
        'Dört yardımcı eleman dört ayrı merkez üretir; hangisinin nerede kesiştiği sık karıştırılır.',
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
      ),
      kart(
        'İkizkenar üçgende',
        'Tepe açısından inen açıortay, kenarortay ve yükseklik aynı doğrudur. Bu, üçgenin ikizkenar olduğunun kanıtıdır.',
      ),
      kart(
        'Açıortay bağıntısı',
        'İç açıortay, karşı kenarı komşu kenarların oranında böler. Bu bağıntı benzerlikten çıkar.',
      ),
    ], [
      soru('Ağırlık merkezi, kenarortayları köşeden başlayarak 2:1 oranında böler.', true, 'Üç kenarortay tek bir noktada kesişiyor.'),
      soru('Açıortay, bir açıyı iki eş açıya ayıran ışındır.', true, 'İç açıortayların kesim noktası iç teğet çemberin merkezi.'),
      soru('Üçgenin yükseklikleri her zaman üçgenin içinde kesişir.', false, 'Geniş açılı üçgende kesim noktası üçgenin dışında kalır.'),
      soru('Kenar orta dikmelerin kesim noktası iç teğet çemberin merkezidir.', false, 'Çevrel çemberin merkezidir; iç teğet çemberin merkezi açıortayların kesişimi.'),
    ]),
    konu('mat10-alan', 'Üçgenin Alanı', [
      kart(
        'Temel formül',
        'Alan = (taban × yükseklik) / 2. Yükseklik daima tabana dik olmalıdır.',
      ),
      kart(
        'İki kenar ve aradaki açı',
        'Alan = (1/2)·a·b·sin C. Yükseklik bilinmediğinde en pratik yol budur.',
      ),
      kart(
        'Eşit yükseklikli üçgenler',
        'Yükseklikleri eşitse alanlar oranı tabanlar oranına eşittir. Kenarortay üçgeni iki eşit alana böler.',
      ),
      kart(
        'Benzerlikte alan',
        'Benzerlik oranı k ise alanlar oranı k²’dir. Uzunluk oranıyla alan oranı en sık karıştırılan ikilidir.',
      ),
      kart(
        'Ortak açılı üçgenler',
        'İki üçgenin bir açısı ortaksa alanlar oranı, o açıyı oluşturan kenarların çarpımları oranına eşittir.',
      ),
      kart(
        'Hangi formül ne zaman?',
        'Elde ne olduğuna bakılır: taban ve yükseklik varsa temel formül, iki kenar ve açı varsa sinüslü formül.',
      ),
    ], [
      soru('Üçgenin alanı, taban ile ona ait yüksekliğin çarpımının yarısıdır.', true, 'Hangi kenar taban seçilirse seçilsin sonuç aynı.'),
      soru('Tabanları ve yükseklikleri eşit olan üçgenlerin alanları eşittir.', true, 'Şekilleri farklı olsa da alan aynı kalıyor.'),
      soru('Benzerlik oranı k olan iki üçgenin alanları oranı da k dır.', false, 'Alan oranı k² olur.'),
      soru('İki kenarı ve aradaki açısı bilinen bir üçgenin alanı hesaplanamaz.', false, 'Alan = (1/2)·a·b·sinC ile hesaplanıyor.'),
    ]),
    konu('mat10-sinus-kosinus', 'Sinüs ve Kosinüs Teoremleri', [
      kart(
        'Sinüs teoremi',
        'a/sin A = b/sin B = c/sin C. Kenar-karşı açı çiftleri bilindiğinde kullanılır.',
      ),
      kart(
        'Kosinüs teoremi',
        'a² = b² + c² − 2bc·cos A. İki kenar ve aradaki açı bilindiğinde üçüncü kenarı verir.',
      ),
      kart(
        'Pisagor’un genellemesi',
        'A açısı 90° olunca cos A = 0 olur ve kosinüs teoremi Pisagor teoremine dönüşür.',
      ),
      kart(
        'Hangisi ne zaman?',
        'Elde hangi üçlünün olduğu, hangi teoremin kullanılacağını doğrudan söyler.',
        {
          tur: 'tablo',
          basliklar: ['Bilinen', 'Teorem'],
          satirlar: [
            ['Kenar + karşı açı', 'Sinüs'],
            ['İki kenar + ara açı', 'Kosinüs'],
            ['Üç kenar', 'Kosinüs'],
          ],
        },
      ),
      kart(
        'Çevrel çemberle bağı',
        'Sinüs teoremindeki ortak oran, çevrel çemberin çapına eşittir: a/sin A = 2R.',
      ),
      kart(
        'Açının türü',
        'Kosinüs teoreminde çıkan cos değeri negatifse o açı geniştir. Üçgenin türü hesaptan okunur.',
      ),
    ], [
      soru('Kosinüs teoremi, dik üçgende Pisagor teoremine dönüşür.', true, '90° nin kosinüsü sıfır olduğu için son terim kayboluyor.'),
      soru('İki kenar ve aradaki açı biliniyorsa üçüncü kenar kosinüs teoremiyle bulunur.', true, 'Sinüs teoremi bu durumda yetmiyor.'),
      soru('Sinüs teoremi yalnızca dik üçgenlerde kullanılır.', false, 'Her üçgende geçerli; kenarlar ile karşı açıların sinüsleri orantılı.'),
      soru('Kosinüs teoreminde bulunan kosinüs değeri negatifse karşı açı dardır.', false, 'Negatif kosinüs geniş açı demek.'),
    ]),
  ]),
  tema('mat10-t2', 'İstatistiksel Araştırma Süreci', [
    konu('mat10-kategorik', 'İki Kategorik Değişkenli Veriler', [
      kart(
        'Kategorik değişken',
        'Sayıyla değil kategoriyle ölçülen değişken: cinsiyet, meslek, tercih.',
      ),
      kart(
        'İki yönlü tablo',
        'İki kategorik değişkenin birlikte dağılımını gösterir. Satır ve sütun kesişimi ortak sayıyı verir.',
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
        'Aynı tablodan farklı yüzdeler çıkar; hangisine bölündüğü söylenmezse sonuç yanıltıcı olur.',
      ),
      kart(
        'Marjinal dağılım',
        'Tablonun kenar toplamları. Tek bir değişkenin dağılımını verir ve ötekini yok sayar.',
      ),
      kart(
        'İlişki var mı?',
        'Bir değişkenin dağılımı öteki değişkenin düzeylerine göre belirgin biçimde değişiyorsa ilişki vardır.',
      ),
      kart(
        'İlişki nedensellik değil',
        'İki kategorinin birlikte görünmesi birinin ötekine yol açtığını göstermez; üçüncü bir etken ikisini birden üretebilir.',
      ),
    ], [
      soru('İki yönlü tabloda satır yüzdesi ile sütun yüzdesi farklı sorulara cevap verir.', true, 'Hangisinin kullanılacağı sorulan soruya bağlı.'),
      soru('Marjinal dağılım, tablonun kenarındaki toplam satır ve sütunlardan okunur.', true, 'Tek bir değişkenin dağılımını veriyor.'),
      soru('Göz rengi nicel bir değişkendir.', false, 'Sayıyla ölçülmüyor, gruplara ayrılıyor; kategorik değişken.'),
      soru('İki kategorik değişken arasında ilişki bulunması, birinin ötekine sebep olduğunu gösterir.', false, 'İlişki nedensellik değil; arkada üçüncü bir etken olabilir.'),
    ]),
    konu('mat10-kategorik-inceleme', 'Başkalarının Oluşturduğu Kategorik Verileri İnceleme', [
      kart(
        'Kaynağı sorgula',
        'Veriyi kimin, hangi amaçla topladığı sonucun yorumunu değiştirir.',
      ),
      kart(
        'Sorunun kendisi',
        'Anket sorusunun kuruluşu cevabı yönlendirebilir. Yönlendirici soruyla toplanan veri doğru hesaplanmış olsa da geçersizdir.',
      ),
      kart(
        'Eksik kategori',
        '"Diğer" kategorisinin büyüklüğü ya da bazı seçeneklerin hiç sunulmaması sonucu bozar.',
      ),
      kart(
        'Yüzde mi sayı mı?',
        'Küçük örneklemde yüzde abartılı görünür: 2 kişiden 1’i "yüzde 50" diye sunulabilir.',
      ),
      kart(
        'Görsel yanıltma',
        'Farklı alanlı daire dilimleri ve üç boyutlu grafikler oranları olduğundan farklı gösterir.',
      ),
      kart(
        'Cevap vermeyenler',
        'Ankete katılmayanlar rastgele değildir. Yanıt oranı düşükse sonuç katılanların değil, katılmayı seçenlerin görüşüdür.',
      ),
    ], [
      soru('Anket sorusunun nasıl sorulduğu verilen cevapları etkileyebilir.', true, 'Yönlendirici soru, sonucu önceden şekillendiriyor.'),
      soru('Yüzdeyle verilen bir sonuçta toplam sayının bilinmesi önemlidir.', true, '4 kişiden 2 si de %50 dir, 4000 kişiden 2000 i de.'),
      soru('Ankete cevap vermeyenlerin varlığı sonucun yorumunu etkilemez.', false, 'Cevap vermeyenler belirli bir grupsa sonuç yanlı çıkıyor.'),
      soru('Bir tabloda bazı kategorilerin gösterilmemesi sonucu değiştirmez.', false, 'Eksik kategori, kalan yüzdeleri olduğundan büyük gösterebilir.'),
    ]),
  ]),
  tema('mat10-t3', 'Sayılar', [
    konu('mat10-asal-carpan', 'Bir Doğal Sayının Asal Çarpanları ve Bölenleri', [
      kart(
        'Asal sayı',
        'Yalnızca 1’e ve kendisine bölünen, 1’den büyük doğal sayı. 2, tek çift asal sayıdır.',
      ),
      kart(
        '1 neden asal değil?',
        'Asal kabul edilseydi bir sayının asal çarpanlara ayrılışı tek olmazdı: 6 = 2·3 = 1·2·3 = 1·1·2·3.',
      ),
      kart(
        'Asal çarpanlara ayırma',
        'Her doğal sayı asalların çarpımı olarak tek bir biçimde yazılır. Buna aritmetiğin temel teoremi denir.',
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
        'Sayı p^a · q^b biçimindeyse bölen sayısı (a+1)(b+1) olur.',
      ),
      kart(
        'Asal olan bölen sayısı',
        'Toplam bölen sayısıyla karıştırılır: 360’ın 24 pozitif böleni vardır ama asal böleni yalnızca üçtür (2, 3, 5).',
      ),
      kart(
        'Bölenlerin toplamı',
        'Her asal için üslerin toplamı ayrı ayrı hesaplanıp çarpılır.',
      ),
      kart(
        'Tam kare sayılar',
        'Bir sayı tam kareyse bütün asal çarpanlarının üsleri çifttir ve bölen sayısı tektir.',
      ),
      kart(
        'Neden işe yarar?',
        'EBOB, EKOK ve sadeleştirme işlemlerinin tamamı asal çarpanlara ayırmaya dayanır.',
      ),
    ], [
      soru('1 sayısı asal sayı değildir.', true, 'Asal sayının tam iki pozitif böleni olmalı; 1 in tek böleni var.'),
      soru('72 = 2³ · 3² olduğuna göre 72 nin pozitif bölen sayısı 12 dir.', true, 'Üsler birer artırılıp çarpılıyor: 4 · 3 = 12.'),
      soru('Tam kare sayıların pozitif bölen sayısı çifttir.', false, 'Tam karelerde bölen sayısı tektir; ortadaki bölen kendisiyle eşleşiyor.'),
      soru('2 sayısı çift olduğu için asal değildir.', false, 'Asallık çift olmakla ilgili değil; 2 tek çift asal sayıdır.'),
    ]),
    konu('mat10-ebob-ekok', 'En Büyük Ortak Bölen, En Küçük Ortak Kat', [
      kart(
        'EBOB',
        'İki sayıyı da bölen en büyük sayı. Ortak asal çarpanların en küçük üsleri çarpılarak bulunur.',
      ),
      kart(
        'EKOK',
        'İki sayının da katı olan en küçük sayı. Tüm asal çarpanların en büyük üsleri çarpılır.',
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
        'EBOB(a,b) · EKOK(a,b) = a · b. Biri bilindiğinde öteki buradan çıkar.',
      ),
      kart(
        'Aralarında asal',
        'EBOB’u 1 olan sayılar aralarında asaldır; EKOK’ları çarpımlarına eşittir.',
      ),
      kart(
        'Nerede kullanılır?',
        'Parçalara eşit bölme problemlerinde EBOB, birlikte tekrar eden olaylarda EKOK kullanılır.',
      ),
      kart(
        'Problemi ayırmak',
        'Soru "en büyük parça" ya da "kaç eşit gruba" diyorsa EBOB; "kaç dakika sonra yine birlikte" diyorsa EKOK.',
      ),
    ], [
      soru('İki sayının EBOB u ile EKOK unun çarpımı, sayıların çarpımına eşittir.', true, 'Bu bağıntı biri bilinirken ötekini bulmayı sağlıyor.'),
      soru('Aralarında asal iki sayının EBOB u 1 dir.', true, 'Ortak asal çarpanları yok.'),
      soru('EKOK, iki sayının ortak bölenlerinin en büyüğüdür.', false, 'O tanım EBOB a ait; EKOK ortak katların en küçüğü.'),
      soru('Bir odayı tam sayıda eş kare fayansla kaplarken EKOK kullanılır.', false, 'En büyük kare fayansın kenarı EBOB ile bulunur.'),
    ]),
    konu('mat10-bolunebilme', 'Bölünebilme', [
      kart(
        '2, 5 ve 10 kuralı',
        'Son basamağa bakılır: çiftse 2’ye, 0 veya 5 ise 5’e, 0 ise 10’a bölünür.',
      ),
      kart(
        '3 ve 9 kuralı',
        'Rakamlar toplamı 3’e bölünüyorsa sayı 3’e, 9’a bölünüyorsa 9’a bölünür.',
      ),
      kart(
        '4 ve 8 kuralı',
        'Son iki basamak 4’e bölünüyorsa sayı 4’e; son üç basamak 8’e bölünüyorsa 8’e bölünür.',
      ),
      kart(
        'Kuralların özeti',
        'Kurallar üç öbekte toplanır: son basamaklara bakanlar, rakam toplamına bakanlar ve dönüşümlü toplama dayananlar.',
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
        'Rakamlar sağdan sola dönüşümlü olarak toplanıp çıkarılır; sonuç 11’in katıysa sayı 11’e bölünür.',
      ),
      kart(
        'Bileşik kurallar',
        '6’ya bölünme için hem 2’ye hem 3’e bölünmesi gerekir. Bölenler aralarında asal olmalıdır.',
      ),
      kart(
        'Sık yapılan hata',
        '12’ye bölünme için 2 ve 6’ya bakmak yetmez: 2 ile 6 aralarında asal değildir. Doğrusu 3 ve 4’tür.',
      ),
      kart(
        'Kalan bulma',
        'Bölünmeyen sayılarda aynı kurallar kalanı da verir: rakamlar toplamının 9’a bölümünden kalan, sayının 9’a bölümünden kalandır.',
      ),
    ], [
      soru('Rakamları toplamı 9 un katı olan sayı 9 a bölünür.', true, 'Kural doğrudan rakam toplamına bakıyor.'),
      soru('Son iki basamağı 4 ün katı olan sayı 4 e bölünür.', true, 'Yüzler basamağından sonrası zaten 4 e bölünüyor.'),
      soru('Rakamları toplamı 3 ün katı olan her sayı 9 a da bölünür.', false, '12 nin rakam toplamı 3; 3 e bölünüyor ama 9 a bölünmüyor.'),
      soru('Hem 4 e hem 6 ya bölünen bir sayı 24 e de bölünür.', false, '4 ile 6 aralarında asal değil; garanti olan 12 ye bölünmesi.'),
    ]),
  ]),
  tema('mat10-t4', 'Nicelikler ve Değişimler', [
    konu('mat10-fonksiyon-sart', 'Gerçek Sayılarda Fonksiyon Olma Şartları', [
      kart(
        'Fonksiyon koşulu',
        'Tanım kümesindeki her elemanın görüntüsü olmalı ve bu görüntü tek olmalıdır.',
      ),
      kart(
        'Düşey doğru testi',
        'Grafiği kesen her düşey doğru grafiği en fazla bir noktada kesiyorsa bu bir fonksiyondur.',
      ),
      kart(
        'Tanım kümesi',
        'Paydayı sıfır yapan ve çift dereceden kökün içini negatif yapan değerler tanım kümesinden çıkarılır.',
      ),
      kart(
        'Görüntü kümesi',
        'Fonksiyonun gerçekten aldığı değerlerin kümesi. Değer kümesinin alt kümesidir.',
      ),
      kart(
        'Bire bir ve örten',
        'Farklı girdiler farklı çıktı veriyorsa bire bir; değer kümesinin tamamı kullanılıyorsa örtendir.',
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
        '(f∘g)(x) = f(g(x)). Önce içteki uygulanır; sıra değiştirilirse sonuç genelde değişir.',
      ),
      kart(
        'Birim fonksiyon',
        'I(x) = x her girdiyi kendisine eşler. Bileşkede etkisiz elemandır: f∘I = f.',
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
    ]),
    konu('mat10-karesel', 'Karesel Fonksiyon ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        'f(x) = ax² + bx + c, a ≠ 0. Grafiği paraboldür.',
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
        'a > 0 ise kollar yukarı ve fonksiyonun en küçük değeri vardır; a < 0 ise kollar aşağıdır ve en büyük değeri vardır.',
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
        'x = −b/(2a) noktasında bulunur. Fonksiyonun en büyük ya da en küçük değeri buradadır.',
      ),
      kart(
        'Diskriminant',
        'Δ = b² − 4ac. İşareti, parabolün x eksenini kaç noktada kestiğini söyler.',
        {
          tur: 'tablo',
          basliklar: ['Δ', 'Kök', 'Grafik'],
          satirlar: [
            ['Δ > 0', '2 kök', 'İki kez keser'],
            ['Δ = 0', '1 kök', 'Teğet'],
            ['Δ < 0', 'Yok', 'Kesmez'],
          ],
        },
      ),
      kart(
        'Simetri ekseni',
        'Tepe noktasından geçen düşey doğru. Parabol bu doğruya göre simetriktir.',
      ),
      kart(
        'Kökler ve katsayılar',
        'Köklerin toplamı −b/a, çarpımı c/a’dır. Kökleri bulmadan bu iki değer hesaplanabilir.',
      ),
      kart(
        'Grafikten denklem',
        'Tepe noktası ve bir nokta biliniyorsa f(x) = a(x − r)² + k biçiminden a çekilerek denklem kurulur.',
      ),
      kart(
        'Nerede karşımıza çıkar?',
        'Atılan cismin yolu, en büyük alan ve en yüksek kâr problemleri karesel fonksiyonla modellenir.',
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
    ]),
    konu('mat10-karekok', 'Karekök Fonksiyonu ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        'f(x) = √x. Tanım kümesi x ≥ 0, görüntü kümesi y ≥ 0’dır.',
      ),
      kart(
        'Grafiği',
        'Orijinden başlayıp sağa doğru yavaşlayarak yükselen bir eğri. Parabolün yarısının yatay yansımasıdır.',
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
        'Tanım kümesi boyunca artandır ama artış hızı giderek azalır: 0’dan 1’e bir birim, 4’ten 9’a yine bir birim çıkar.',
      ),
      kart(
        'Tanım kümesi hesabı',
        'Kök içindeki ifade sıfırdan büyük ya da eşit olmalıdır; eşitsizlik çözülerek bulunur.',
      ),
      kart(
        'Kaydırmalar',
        '√(x − 2) grafiği sağa iki birim kayar ve tanım kümesi x ≥ 2 olur; √x + 3 ise yukarı kayar.',
      ),
      kart(
        'Kareselin tersi',
        'f(x) = x² fonksiyonu x ≥ 0 aralığına daraltılırsa tersi karekök fonksiyonu olur.',
      ),
    ], [
      soru('f(x) = √x fonksiyonunun tanım kümesi x ≥ 0 dır.', true, 'Karekökün içi negatif olamaz.'),
      soru('f(x) = √x fonksiyonu artandır.', true, 'x büyüdükçe değer de büyüyor, ama gittikçe yavaşlayarak.'),
      soru('f(x) = √(x − 3) fonksiyonunun tanım kümesi x ≥ −3 tür.', false, 'Kökün içi negatif olmamalı: x − 3 ≥ 0, yani x ≥ 3.'),
      soru('Karekök fonksiyonu negatif değerler de alabilir.', false, 'Karekökün sonucu negatif olmaz.'),
    ]),
    konu('mat10-rasyonel', 'Rasyonel Fonksiyon ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        'İki polinomun bölümü: f(x) = P(x)/Q(x), Q(x) ≠ 0.',
      ),
      kart(
        'Tanımsız noktalar',
        'Paydayı sıfır yapan değerler tanım kümesinde yoktur; grafikte orada süreksizlik olur.',
      ),
      kart(
        'Düşey asimptot',
        'Paydanın sıfır olduğu ve payın sıfır olmadığı noktalarda grafik düşey doğruya sonsuz yaklaşır.',
      ),
      kart(
        'Yatay asimptot',
        'x çok büyüdüğünde fonksiyonun yaklaştığı yatay doğru. Pay ve paydanın derecelerine bağlıdır.',
      ),
      kart(
        '1/x örneği',
        'En temel rasyonel fonksiyon. Grafiği iki kollu hiperboldür ve eksenler asimptottur.',
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
        'Asimptota değilmez',
        'Grafik düşey asimptotu hiç kesmez; yatay asimptotu ise ortada kesebilir, önemli olan sonsuzdaki davranıştır.',
      ),
      kart(
        'Nerede karşımıza çıkar?',
        'Sabit iş miktarında süre-işçi ilişkisi, sabit hızda yol-zaman ve seyreltme problemleri ters orantılıdır.',
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
      soru('Grafik asimptota yaklaşır ama ona değmez.', true, 'Asimptot bir sınır çizgisi; fonksiyon ona sonsuzda yaklaşıyor.'),
      soru('Düşey asimptot, payı sıfır yapan değerlerde oluşur.', false, 'Paydayı sıfır yapan değerlerde oluşur; payı sıfır yapanlar köktür.'),
    ]),
    konu('mat10-ters-fonksiyon', 'Fonksiyonların Ters Fonksiyonları', [
      kart(
        'Ters fonksiyon nedir?',
        'Girdiyle çıktının yer değiştirdiği fonksiyon. f(a) = b ise f⁻¹(b) = a olur.',
      ),
      kart(
        'Koşulu',
        'Yalnızca bire bir ve örten fonksiyonların tersi vardır; olmayanlar tanım kümesi daraltılarak terslenir.',
      ),
      kart(
        'Nasıl bulunur?',
        'Üç adım her fonksiyonda aynıdır.',
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
        'Ters fonksiyonun grafiği, orijinalin y = x doğrusuna göre simetriğidir.',
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
        'f∘f⁻¹ = f⁻¹∘f = I. Bir fonksiyonun tersi, onu birim fonksiyona götüren fonksiyondur.',
      ),
      kart(
        'Örnekler',
        'Karesel fonksiyonun tersi karekök, doğrusal fonksiyonun tersi yine doğrusaldır.',
      ),
      kart(
        'Ters ile çarpmaya göre ters',
        'f⁻¹(x) ile 1/f(x) aynı şey değildir. Üstteki −1 kuvvet değil, ters fonksiyon işaretidir.',
      ),
    ], [
      soru('Bir fonksiyonun tersinin olması için bire bir ve örten olması gerekir.', true, 'Aksi hâlde geri dönüş tek anlamlı olmuyor.'),
      soru('Bir fonksiyon ile tersinin grafikleri y = x doğrusuna göre simetriktir.', true, 'x ile y yer değiştirdiği için simetri o doğruya göre.'),
      soru('f⁻¹(x), f(x) in çarpmaya göre tersidir, yani 1/f(x) tir.', false, 'İkisi ayrı kavram; ters fonksiyon işlemi geri alır, 1/f(x) bir bölme.'),
      soru('Ters fonksiyon bulunurken x ile y yer değiştirmez.', false, 'Tam da yer değiştirir; sonra y yalnız bırakılır.'),
    ]),
    konu('mat10-denklem-problem', 'Fonksiyonlarla Denklem ve Eşitsizlik Problemleri', [
      kart(
        'Denklem kurmak',
        'Problemdeki ilişki bir fonksiyonla yazılır; aranan değer o fonksiyonun kökü ya da tepe noktasıdır.',
      ),
      kart(
        'En büyük-en küçük',
        'Karesel fonksiyonlarda en iyi değer tepe noktasındadır; alan ve kâr problemleri böyle çözülür.',
      ),
      kart(
        'İşaret incelemesi',
        'Eşitsizlik çözerken kökler işaret tablosuna yerleştirilir; aralıklar tek tek sınanır.',
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
        'Kök çift katlıysa işaret o noktada değişmez. Tabloyu kurarken kökün katı da yazılmalıdır.',
      ),
      kart(
        'İki fonksiyonu karşılaştırmak',
        'f(x) > g(x) eşitsizliği, f − g fonksiyonunun pozitif olduğu aralıkları bulmaya indirgenir.',
      ),
      kart(
        'Bağlam kontrolü',
        'Kenar uzunluğu negatif, kişi sayısı kesirli olamaz. Matematiksel köklerden bağlama uyanlar seçilir.',
      ),
    ], [
      soru('Bir çarpanın çift katlı kökünde ifade işaret değiştirmez.', true, 'İşaret tablosunda o kökün iki yanında aynı işaret duruyor.'),
      soru('Problemde bulunan çözümün bağlama uygunluğu denetlenmelidir.', true, 'Uzunluk için çıkan negatif değer matematiksel çözümdür ama cevap değildir.'),
      soru('Bir eşitsizliğin çözümünde kökler her zaman çözüm kümesine dâhildir.', false, 'Eşitsizlik katıysa (< ya da >) kökler dâhil edilmez.'),
      soru('İki fonksiyonun grafiklerinin kesiştiği noktalar f(x) = g(x) denklemini sağlamaz.', false, 'Kesişim noktaları tam da bu denklemin çözümleridir.'),
    ]),
  ]),
  tema('mat10-t5', 'Sayma, Algoritma ve Bilişim', [
    konu('mat10-sayma', 'Sayma Stratejileri', [
      kart(
        'Toplama ve çarpma kuralı',
        'Seçenekler birbirinin alternatifiyse toplanır, art arda yapılıyorsa çarpılır.',
      ),
      kart(
        'Faktöriyel',
        'n! = n·(n−1)···2·1, n elemanın kaç farklı sırada dizilebileceğidir. Tanım gereği 0! = 1.',
      ),
      kart(
        'Permütasyon',
        'Sıralamanın önemli olduğu seçimler. n elemandan r tanesinin sıralanışı P(n,r) ile bulunur.',
      ),
      kart(
        'Kombinasyon',
        'Sıralamanın önemsiz olduğu seçimler. C(n,r) = P(n,r) / r!.',
      ),
      kart(
        'Hangisi hangisi?',
        'Soru "kaç farklı sıra" diyorsa permütasyon, "kaç farklı grup" diyorsa kombinasyondur.',
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
      ),
      kart(
        'Tekrarlı sayma',
        'Aynı nesnelerden birden çok varsa toplam sıralama, tekrar sayılarının faktöriyellerine bölünür.',
      ),
      kart(
        'Tümleyenden sayma',
        '"En az bir" sorularında istenmeyeni saymak daha kısadır: toplamdan hiç olmayan durum çıkarılır.',
      ),
      kart(
        'Simetri özelliği',
        'C(n,r) = C(n, n−r). Bir grubu seçmek, geri kalanı seçmekle aynı sayıda yol verir.',
      ),
    ], [
      soru('Permütasyonda sıralama önemlidir, kombinasyonda değildir.', true, 'Aynı elemanlar farklı sırayla permütasyonda ayrı, kombinasyonda aynı sayılıyor.'),
      soru('0! = 1 dir.', true, 'Tanım gereği; formüllerin tutarlı çalışmasını sağlıyor.'),
      soru('5 kişiden 2 kişilik bir takım seçmek permütasyon problemidir.', false, 'Takımda sıra önemli değil; bu bir kombinasyon problemi.'),
      soru('C(n, r) = C(n, n−r) eşitliği yanlıştır.', false, 'Simetri özelliği bu eşitliği veriyor: r seçmek, n−r tanesini ayırmakla aynı.'),
    ]),
    konu('mat10-algoritmik-yapi', 'Cebirsel İşlemlerin Algoritmik Yapısı', [
      kart(
        'İşlem sırası bir algoritmadır',
        'Parantez, üs, çarpma-bölme, toplama-çıkarma sırası kesin adımlarla tanımlıdır.',
      ),
      kart(
        'Öklid algoritması',
        'EBOB’u kalanlı bölmeleri tekrarlayarak bulur; kalan sıfır olduğunda son bölen sonucu verir.',
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
        'Faktöriyel ve üs alma tekrar eden çarpmalardır; bir döngüyle adım adım hesaplanır.',
      ),
      kart(
        'Özyineleme',
        'Bir işlem kendi küçüğüyle tanımlanabilir: n! = n·(n−1)!. Durma koşulu olmazsa tanım hiç kapanmaz.',
      ),
      kart(
        'Verimlilik',
        'Aynı sonucu veren iki algoritmadan adım sayısı az olanı yeğlenir; büyük sayılarda fark büyür.',
      ),
      kart(
        'Neden Öklid daha hızlı?',
        'Asal çarpanlara ayırmak büyük sayılarda çok pahalıdır; Öklid yalnızca birkaç bölme ile aynı sonuca ulaşır.',
      ),
    ], [
      soru('İşlem önceliği kuralları adım adım uygulanan bir algoritmadır.', true, 'Aynı ifade herkeste aynı sonucu bu sayede veriyor.'),
      soru('Öklid algoritması iki sayının EBOB unu bulur.', true, 'Kalanlı bölme tekrarlanarak yürüyor.'),
      soru('Öklid algoritması, çarpanlara ayırma yöntemine göre daha yavaştır.', false, 'Büyük sayılarda çok daha hızlı; her adımda sayılar hızla küçülüyor.'),
      soru('Özyinelemeli bir tanımın durma koşuluna ihtiyacı yoktur.', false, 'Durma koşulu olmayan özyineleme hiç sonlanmaz.'),
    ]),
  ]),
  tema('mat10-t6', 'Analitik İnceleme', [
    konu('mat10-nokta', 'Dik Koordinat Sisteminde Noktanın Analitik İncelenmesi', [
      kart(
        'İki nokta arası uzaklık',
        'Pisagor teoreminden türer: koordinat farklarının kareleri toplanıp karekökü alınır.',
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
        'Koordinatların aritmetik ortalaması alınır: iki ucun x’leri toplanıp ikiye, y’leri toplanıp ikiye bölünür.',
      ),
      kart(
        'Bölme noktası',
        'Bir doğru parçasını verilen oranda bölen noktanın koordinatları oranla ağırlıklandırılarak bulunur.',
      ),
      kart(
        'Üçgenin ağırlık merkezi',
        'Üç köşenin koordinatlarının ortalamasıdır. Kenarortayları çizmeden bulunabilir.',
      ),
      kart(
        'Bölgeler',
        'Dört bölge işaretlerle ayrılır: I (+,+), II (−,+), III (−,−), IV (+,−).',
      ),
      kart(
        'Analitik düşünmenin gücü',
        'Geometrik bir soru koordinat verilerek cebirsel bir hesaba dönüşür; çizim yapmadan ispat yapılabilir.',
      ),
    ], [
      soru('A(1, 2) ile B(4, 6) noktaları arasındaki uzaklık 5 birimdir.', true, 'Farklar 3 ve 4; karekök içinde 9 + 16 = 25.'),
      soru('İki noktanın orta noktasının koordinatları, uçların koordinatlarının ortalamasıdır.', true, 'Her eksende ayrı ayrı ortalama alınıyor.'),
      soru('Bir üçgenin ağırlık merkezi, köşe koordinatlarının toplamına eşittir.', false, 'Toplamın üçte biri, yani ortalaması.'),
      soru('Apsisi negatif, ordinatı pozitif olan nokta birinci bölgededir.', false, 'İkinci bölgededir; birinci bölgede ikisi de pozitif.'),
    ]),
    konu('mat10-dogru', 'Dik Koordinat Sisteminde Doğrunun Analitik İncelenmesi', [
      kart(
        'Eğim',
        'İki nokta arasında y farkının x farkına oranı. Düşey doğrunun eğimi tanımsızdır.',
      ),
      kart(
        'Doğru denklemi',
        'y = mx + n (eğim-kesim) ya da y − y₁ = m(x − x₁) (nokta-eğim) biçiminde yazılır.',
      ),
      kart(
        'Paralellik',
        'İki doğru paralelse eğimleri eşittir; kesişmezler ya da tümüyle çakışırlar.',
      ),
      kart(
        'Diklik',
        'İki doğru dikse eğimlerinin çarpımı −1’dir.',
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
      ),
      kart(
        'Eksenleri kesme',
        'x = 0 yazılınca y eksenini, y = 0 yazılınca x eksenini kestiği nokta bulunur.',
      ),
      kart(
        'Noktanın doğruya uzaklığı',
        'Doğrunun genel denklemi kullanılarak hesaplanır; sonuç daima pozitiftir.',
      ),
      kart(
        'İki doğrunun kesişimi',
        'Denklemler birlikte çözülür. Çözüm yoksa doğrular paralel, sonsuz çözüm varsa çakışıktır.',
      ),
    ], [
      soru('Birbirine paralel iki doğrunun eğimleri eşittir.', true, 'Aynı yöne baktıkları için eğimleri aynı.'),
      soru('Birbirine dik iki doğrunun eğimleri çarpımı −1 dir.', true, 'Eksenlere paralel olmayan doğrular için geçerli.'),
      soru('x eksenine paralel bir doğrunun eğimi tanımsızdır.', false, 'Eğimi 0 dır; tanımsız olan y eksenine paralel doğrunun eğimi.'),
      soru('İki doğrunun kesişim noktası, denklemlerden yalnızca birini sağlar.', false, 'Kesişim noktası her iki denklemi de sağlar.'),
    ]),
  ]),
  tema('mat10-t7', 'Veriden Olasılığa', [
    konu('mat10-kosullu', 'Koşullu Olasılık', [
      kart(
        'Tanımı',
        'Bir olayın, başka bir olayın gerçekleştiği bilindiğinde hesaplanan olasılığı: P(A|B).',
      ),
      kart(
        'Formülü',
        'P(A|B) = P(A ∩ B) / P(B). Örnek uzay B’ye daraltılmış olur.',
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
        'Koşullu olasılıkta paydası değişen şey olayın kendisi değil, artık mümkün olan durumların kümesidir.',
      ),
      kart(
        'Bağımsız olaylar',
        'P(A|B) = P(A) ise olaylar bağımsızdır; birinin gerçekleşmesi ötekini etkilemez.',
      ),
      kart(
        'İadeli ve iadesiz',
        'Çekilen top geri konursa olaylar bağımsız, konmazsa bağımlıdır ve koşullu olasılık gerekir.',
      ),
      kart(
        'Bağımsız ile ayrık farkı',
        'Ayrık olaylar aynı anda olamaz; bağımsız olaylar olabilir. İkisi birbirinin karşıtı değil, ayrı kavramlardır.',
      ),
      kart(
        'Sık yapılan hata',
        'P(A|B) ile P(B|A) aynı şey değildir. İkisini karıştırmak günlük hayatta da yanlış sonuçlar üretir.',
      ),
    ], [
      soru('P(A|B), B nin gerçekleştiği bilindiğinde A nın olasılığıdır.', true, 'Bilgi, hesabın yapıldığı zemini değiştiriyor.'),
      soru('Yeni bir bilginin verilmesi örnek uzayı daraltır.', true, 'Artık yalnızca bilginin uyduğu sonuçlar sayılıyor.'),
      soru('Bağımsız olaylar ile ayrık olaylar aynı şeydir.', false, 'Ayrık olaylar birlikte olamaz; bağımsız olaylarda biri ötekinin olasılığını değiştirmez.'),
      soru('İadesiz çekimde ikinci çekilişin olasılığı birinciden etkilenmez.', false, 'Çekilen top geri konmadığı için örnek uzay değişiyor.'),
    ]),
    konu('mat10-bayes', 'Bayes Teoremi', [
      kart(
        'Ne yapar?',
        'Koşullu olasılığı ters çevirir: P(B|A) biliniyorken P(A|B)’yi hesaplar.',
      ),
      kart(
        'Formülü',
        'P(A|B) = P(B|A)·P(A) / P(B). Payda toplam olasılık kuralıyla açılır.',
      ),
      kart(
        'Ön bilgi önemlidir',
        'P(A) yani önsel olasılık sonucu belirleyici biçimde etkiler. Nadir bir durum, testten sonra da nadirdir.',
      ),
      kart(
        'Tıbbi test örneği',
        'Çok doğru bir test bile nadir bir hastalıkta çok sayıda yanlış pozitif üretir; sebep düşük önsel olasılıktır.',
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
        'İnsanlar test doğruluğuna bakıp önsel olasılığı unutuyor. Bayes, unutulan o sayıyı hesaba geri sokuyor.',
      ),
      kart(
        'Neden önemli?',
        'Yeni kanıt geldiğinde inancı güncellemenin matematiksel kuralıdır; makine öğrenmesinde de kullanılır.',
      ),
    ], [
      soru('Bayes teoremi, yeni bir kanıt ışığında olasılığı güncellemeyi sağlar.', true, 'Ön bilgi ile kanıtı birleştiriyor.'),
      soru('Nadir bir hastalıkta test pozitif çıkarsa kişinin hasta olma olasılığı testin doğruluk oranına eşittir.', false, 'Hastalığın nadirliği hesaba katılınca bu olasılık çok daha düşük çıkıyor.'),
      soru('Taban oranı yanılgısı, olayın toplumdaki yaygınlığını hesaba katmamaktır.', true, 'Sonucu olduğundan çok daha yüksek göstermeye yol açıyor.'),
      soru('Bayes teoreminde ön bilgi sonucu etkilemez.', false, 'Ön bilgi hesabın içinde ve sonucu belirleyen etkenlerden biri.'),
    ]),
  ]),
])
