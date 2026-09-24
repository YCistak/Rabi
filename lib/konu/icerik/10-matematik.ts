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
      sikli('tan x neye eşittir?', ['cos x / sin x', 'sin x / cos x'], 1, 'cot tersi.'),
      sikli('sin 30° hangi değere eşittir?', ['cos 30°', 'cos 60°'], 1, 'Tümler açı.'),
      sikli('tan 45° kaçtır?', ['√3', '1'], 1, 'tan 60° = √3.'),
      sikli('cos 60° kaçtır?', ['√3/2', '1/2'], 1, 'cos 30° = √3/2.'),
      sikli('Trigonometrik oranlar neye bağlıdır?', ['Açıya', 'Üçgenin boyuna'], 0, 'Benzer üçgenlerde aynı.'),
      soru('sin²x + cos²x = 1 özdeşliği Pisagor\'dan gelir.', true, 'Birim çember.'),
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
        'Bir açıyı iki eş parçaya böler.\nÜç açıortay **iç teğet çemberin merkezinde** kesişir.',
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
    ], [
      soru('Ağırlık merkezi, kenarortayları köşeden başlayarak 2:1 oranında böler.', true, 'Üç kenarortay tek bir noktada kesişiyor.'),
      soru('Açıortay, bir açıyı iki eş açıya ayıran ışındır.', true, 'İç açıortayların kesim noktası iç teğet çemberin merkezi.'),
      soru('Üçgenin yükseklikleri her zaman üçgenin içinde kesişir.', false, 'Geniş açılı üçgende kesim noktası üçgenin dışında kalır.'),
      soru('Kenar orta dikmelerin kesim noktası iç teğet çemberin merkezidir.', false, 'Çevrel çemberin merkezidir; iç teğet çemberin merkezi açıortayların kesişimi.'),
      sikli('Üç yükseklik nerede kesişir?', ['Ağırlık merkezinde', 'Diklik merkezinde'], 1, 'Kenarortaylar ağırlık merkezinde.'),
      sikli('Çevrel çemberin merkezi hangi doğruların kesişimidir?', ['Açıortayların', 'Kenar orta dikmelerin'], 1, 'Açıortaylar iç teğet.'),
      sikli('İç açıortay karşı kenarı hangi oranda böler?', ['Eşit iki parçaya', 'Komşu kenarların oranında'], 1, 'Benzerlikten çıkar.'),
      sikli('Tepeden inen açıortay, kenarortay ve yükseklik çakışıyorsa üçgen?', ['Çeşitkenar', 'İkizkenar'], 1, 'Kanıt.'),
      soru('Ağırlık merkezi kenarortayı 2:1 böler, uzun parça köşe tarafındadır.', true, 'Kenarortay.'),
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
    ], [
      soru('Üçgenin alanı, taban ile ona ait yüksekliğin çarpımının yarısıdır.', true, 'Hangi kenar taban seçilirse seçilsin sonuç aynı.'),
      soru('Tabanları ve yükseklikleri eşit olan üçgenlerin alanları eşittir.', true, 'Şekilleri farklı olsa da alan aynı kalıyor.'),
      soru('Benzerlik oranı k olan iki üçgenin alanları oranı da k dır.', false, 'Alan oranı k² olur.'),
      soru('İki kenarı ve aradaki açısı bilinen bir üçgenin alanı hesaplanamaz.', false, 'Alan = (1/2)·a·b·sinC ile hesaplanıyor.'),
      sikli('İki kenarı ve aradaki açısı bilinen üçgenin alanı?', ['a·b·sin C', '(1/2)·a·b·sin C'], 1, 'Yükseklik bilinmediğinde.'),
      sikli('Bir açısı ortak iki üçgende alan oranı?', ['Tabanlar oranı', 'Açıyı oluşturan kenarların çarpımları oranı'], 1, 'Ortak açılı üçgenler.'),
      soru('Yükseklikleri eşit üçgenlerde alanlar oranı tabanlar oranına eşittir.', true, 'Kenarortay iki eşit alan.'),
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
    ], [
      soru('Kosinüs teoremi, dik üçgende Pisagor teoremine dönüşür.', true, '90° nin kosinüsü sıfır olduğu için son terim kayboluyor.'),
      soru('İki kenar ve aradaki açı biliniyorsa üçüncü kenar kosinüs teoremiyle bulunur.', true, 'Sinüs teoremi bu durumda yetmiyor.'),
      soru('Sinüs teoremi yalnızca dik üçgenlerde kullanılır.', false, 'Her üçgende geçerli; kenarlar ile karşı açıların sinüsleri orantılı.'),
      soru('Kosinüs teoreminde bulunan kosinüs değeri negatifse karşı açı dardır.', false, 'Negatif kosinüs geniş açı demek.'),
      sikli('Sinüs teoremindeki ortak oran neye eşittir?', ['2R (çevrel çap)', 'R'], 0, 'a/sin A = 2R.'),
      sikli('Kosinüs teoreminde cos A negatif çıkarsa A açısı?', ['Geniş', 'Dar'], 0, 'Üçgenin türü hesaptan okunur.'),
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
        'Bir değişkenin dağılımı, ötekinin düzeylerine göre belirgin biçimde değişiyorsa ilişki vardır.',
      ),
      kart(
        'İlişki nedensellik değil',
        'İki kategorinin birlikte görünmesi, birinin ötekine yol açtığını göstermez.\nÜçüncü bir etken ikisini birden üretebilir.',
      ),
    ], [
      soru('İki yönlü tabloda satır yüzdesi ile sütun yüzdesi farklı sorulara cevap verir.', true, 'Hangisinin kullanılacağı sorulan soruya bağlı.'),
      soru('Marjinal dağılım, tablonun kenarındaki toplam satır ve sütunlardan okunur.', true, 'Tek bir değişkenin dağılımını veriyor.'),
      soru('Göz rengi nicel bir değişkendir.', false, 'Sayıyla ölçülmüyor, gruplara ayrılıyor; kategorik değişken.'),
      soru('İki kategorik değişken arasında ilişki bulunması, birinin ötekine sebep olduğunu gösterir.', false, 'İlişki nedensellik değil; arkada üçüncü bir etken olabilir.'),
      sikli('Meslek hangi tür değişkendir?', ['Nicel', 'Kategorik'], 1, 'Kategoriyle ölçülür.'),
      sikli('Satır ve sütun yüzdesinin farklı çıkmasının sebebi?', ['Hesap hatası', 'Bölünen toplam farklı'], 1, 'Hangisine bölündüğü söylenmeli.'),
      soru('Bir değişkenin dağılımı ötekine göre değişiyorsa ilişki vardır.', true, 'Nedensellik demek değil.'),
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
    ], [
      soru('Anket sorusunun nasıl sorulduğu verilen cevapları etkileyebilir.', true, 'Yönlendirici soru, sonucu önceden şekillendiriyor.'),
      soru('Yüzdeyle verilen bir sonuçta toplam sayının bilinmesi önemlidir.', true, '4 kişiden 2 si de %50 dir, 4000 kişiden 2000 i de.'),
      soru('Ankete cevap vermeyenlerin varlığı sonucun yorumunu etkilemez.', false, 'Cevap vermeyenler belirli bir grupsa sonuç yanlı çıkıyor.'),
      soru('Bir tabloda bazı kategorilerin gösterilmemesi sonucu değiştirmez.', false, 'Eksik kategori, kalan yüzdeleri olduğundan büyük gösterebilir.'),
      sikli('Yönlendirici soruyla toplanan veri?', ['Geçerlidir', 'Geçersizdir'], 1, 'Doğru hesaplansa bile.'),
      sikli('2 kişiden 1\'i "yüzde 50" diye sunulursa sorun nedir?', ['Yanlış yüzde', 'Küçük örneklem'], 1, 'Yüzde abartılı görünür.'),
      soru('Üç boyutlu grafik oranları doğru gösterir.', false, 'Görsel yanıltma.'),
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
    ], [
      soru('1 sayısı asal sayı değildir.', true, 'Asal sayının tam iki pozitif böleni olmalı; 1 in tek böleni var.'),
      soru('72 = 2³ · 3² olduğuna göre 72 nin pozitif bölen sayısı 12 dir.', true, 'Üsler birer artırılıp çarpılıyor: 4 · 3 = 12.'),
      soru('Tam kare sayıların pozitif bölen sayısı çifttir.', false, 'Tam karelerde bölen sayısı tektir; ortadaki bölen kendisiyle eşleşiyor.'),
      soru('2 sayısı çift olduğu için asal değildir.', false, 'Asallık çift olmakla ilgili değil; 2 tek çift asal sayıdır.'),
      sikli('Tek çift asal sayı?', ['1', '2'], 1, '1 asal değil.'),
      sikli('360\'ın asal böleni kaç tanedir?', ['24', '3'], 1, '2, 3, 5.'),
      sikli('Tam kare sayının bölen sayısı?', ['Çifttir', 'Tektir'], 1, 'Üsler çift.'),
      sikli('1 asal sayılsaydı ne olurdu?', ['Hiçbir şey değişmezdi', 'Asal çarpanlara ayırma tek olmazdı'], 1, '6 = 1·2·3 = 1·1·2·3.'),
      sikli('Bölenlerin toplamı nasıl bulunur?', ['Her asalın üs toplamları çarpılır', 'Bölenler tek tek yazılır'], 0, 'Kısa yol.'),
      soru('Her doğal sayı asalların çarpımı olarak tek biçimde yazılır.', true, 'Aritmetiğin temel teoremi.'),
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
    ], [
      soru('İki sayının EBOB u ile EKOK unun çarpımı, sayıların çarpımına eşittir.', true, 'Bu bağıntı biri bilinirken ötekini bulmayı sağlıyor.'),
      soru('Aralarında asal iki sayının EBOB u 1 dir.', true, 'Ortak asal çarpanları yok.'),
      soru('EKOK, iki sayının ortak bölenlerinin en büyüğüdür.', false, 'O tanım EBOB a ait; EKOK ortak katların en küçüğü.'),
      soru('Bir odayı tam sayıda eş kare fayansla kaplarken EKOK kullanılır.', false, 'En büyük kare fayansın kenarı EBOB ile bulunur.'),
      sikli('12 ile 18\'in EBOB\'u?', ['36', '6'], 1, 'Küçük üsler.'),
      sikli('EBOB\'u 1 olan sayılar?', ['Asal', 'Aralarında asal'], 1, 'EKOK çarpıma eşit.'),
      sikli('"En büyük parça" sorusunda ne kullanılır?', ['EKOK', 'EBOB'], 1, 'Eşit bölme.'),
      soru('EBOB · EKOK = a · b\'dir.', true, 'Temel bağıntı.'),
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
    ], [
      soru('Rakamları toplamı 9 un katı olan sayı 9 a bölünür.', true, 'Kural doğrudan rakam toplamına bakıyor.'),
      soru('Son iki basamağı 4 ün katı olan sayı 4 e bölünür.', true, 'Yüzler basamağından sonrası zaten 4 e bölünüyor.'),
      soru('Rakamları toplamı 3 ün katı olan her sayı 9 a da bölünür.', false, '12 nin rakam toplamı 3; 3 e bölünüyor ama 9 a bölünmüyor.'),
      soru('Hem 4 e hem 6 ya bölünen bir sayı 24 e de bölünür.', false, '4 ile 6 aralarında asal değil; garanti olan 12 ye bölünmesi.'),
      sikli('Son iki basamağı 4\'e bölünen sayı?', ['8\'e bölünür', '4\'e bölünür'], 1, '8 için son üç basamak.'),
      sikli('6\'ya bölünme için hangi ikisine bakılır?', ['2 ve 4', '2 ve 3'], 1, 'Aralarında asal.'),
      sikli('Rakamları toplamı 9\'a bölünen sayı?', ['11\'e bölünür', '9\'a bölünür'], 1, '11 dönüşümlü toplam.'),
      sikli('Bir sayının 9\'a bölümünden kalan nasıl bulunur?', ['Son basamaktan', 'Rakamlar toplamının 9\'a bölümünden'], 1, 'Kural kalanı da verir.'),
      soru('Son basamağı 0 olan sayı hem 2\'ye hem 5\'e bölünür.', true, '10\'a da.'),
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
      sikli('Farklı girdilerin farklı çıktı vermesi?', ['Bire bir', 'Örten'], 0, 'Örten değer kümesinin tamamı.'),
      sikli('(f∘g)(x) neye eşittir?', ['f(g(x))', 'g(f(x))'], 0, 'Önce içteki.'),
      sikli('I(x) = x fonksiyonu bileşkede nedir?', ['Etkisiz eleman', 'Ters eleman'], 0, 'f∘I = f.'),
      soru('Görüntü kümesi değer kümesinin alt kümesidir.', true, 'Gerçekten alınan değerler.'),
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
      sikli('Δ < 0 ise parabol x eksenini kaç noktada keser?', ['0', '2'], 0, 'Δ > 0 iki nokta.'),
      sikli('Köklerin toplamı?', ['−b/a', 'c/a'], 0, 'Çarpım c/a.'),
      sikli('Simetri ekseni nereden geçer?', ['Tepe noktasından', 'Orijinden'], 0, 'Düşey doğru.'),
      soru('Atılan cismin yolu karesel fonksiyonla modellenir.', true, 'En yüksek nokta tepe.'),
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
    ], [
      soru('f(x) = √x fonksiyonunun tanım kümesi x ≥ 0 dır.', true, 'Karekökün içi negatif olamaz.'),
      soru('f(x) = √x fonksiyonu artandır.', true, 'x büyüdükçe değer de büyüyor, ama gittikçe yavaşlayarak.'),
      soru('f(x) = √(x − 3) fonksiyonunun tanım kümesi x ≥ −3 tür.', false, 'Kökün içi negatif olmamalı: x − 3 ≥ 0, yani x ≥ 3.'),
      soru('Karekök fonksiyonu negatif değerler de alabilir.', false, 'Karekökün sonucu negatif olmaz.'),
      sikli('√x fonksiyonunun görüntü kümesi?', ['y ≥ 0', 'Tüm gerçek sayılar'], 0, 'Karekök negatif olamaz.'),
      sikli('√x\'in artış hızı nasıl değişir?', ['Giderek azalır', 'Sabittir'], 0, '0→1 bir birim, 4→9 bir birim.'),
      soru('x ≥ 0 aralığında x²\'nin tersi karekök fonksiyonudur.', true, 'Daraltılmış tanım kümesi.'),
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
      sikli('Yatay asimptot neye bağlıdır?', ['Pay ve paydanın derecelerine', 'Sabit terime'], 0, 'x sonsuza giderken.'),
      sikli('1/x grafiği nedir?', ['İki kollu hiperbol', 'Parabol'], 0, 'Eksenler asimptot.'),
      sikli('Grafik hangi asimptotu hiç kesmez?', ['Düşey', 'Yatay'], 0, 'Yatayı ortada kesebilir.'),
      soru('Sabit hızda yol-zaman ilişkisi rasyonel fonksiyondur.', false, 'Doğrusal; sabit yolda hız-zaman ters orantı.'),
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
        'Ters fonksiyon nedir?',
        'Girdiyle çıktının yer değiştirdiği fonksiyondur.\n**f(a) = b ise f⁻¹(b) = a**',
      ),
      kart(
        'Koşulu',
        'Yalnızca bire bir ve örten fonksiyonların tersi vardır.\nÖbürleri, tanım kümesi daraltılarak terslenir.',
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
    ], [
      soru('Bir fonksiyonun tersinin olması için bire bir ve örten olması gerekir.', true, 'Aksi hâlde geri dönüş tek anlamlı olmuyor.'),
      soru('Bir fonksiyon ile tersinin grafikleri y = x doğrusuna göre simetriktir.', true, 'x ile y yer değiştirdiği için simetri o doğruya göre.'),
      soru('f⁻¹(x), f(x) in çarpmaya göre tersidir, yani 1/f(x) tir.', false, 'İkisi ayrı kavram; ters fonksiyon işlemi geri alır, 1/f(x) bir bölme.'),
      soru('Ters fonksiyon bulunurken x ile y yer değiştirmez.', false, 'Tam da yer değiştirir; sonra y yalnız bırakılır.'),
      sikli('f(a) = b ise f⁻¹(b) kaçtır?', ['b', 'a'], 1, 'Girdi çıktı yer değiştirir.'),
      sikli('Ters fonksiyonun grafiği neye göre simetriktir?', ['x eksenine', 'y = x doğrusuna'], 1, 'Köşegen.'),
      sikli('f∘f⁻¹ neye eşittir?', ['Sıfır', 'Birim fonksiyon'], 1, 'I.'),
      soru('Her fonksiyonun tersi vardır.', false, 'Yalnızca bire bir ve örten.'),
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
    ], [
      soru('Bir çarpanın çift katlı kökünde ifade işaret değiştirmez.', true, 'İşaret tablosunda o kökün iki yanında aynı işaret duruyor.'),
      soru('Problemde bulunan çözümün bağlama uygunluğu denetlenmelidir.', true, 'Uzunluk için çıkan negatif değer matematiksel çözümdür ama cevap değildir.'),
      soru('Bir eşitsizliğin çözümünde kökler her zaman çözüm kümesine dâhildir.', false, 'Eşitsizlik katıysa (< ya da >) kökler dâhil edilmez.'),
      soru('İki fonksiyonun grafiklerinin kesiştiği noktalar f(x) = g(x) denklemini sağlamaz.', false, 'Kesişim noktaları tam da bu denklemin çözümleridir.'),
      sikli('En büyük alan problemi nerede çözülür?', ['Tepe noktasında', 'Köklerde'], 0, 'Karesel fonksiyon.'),
      sikli('f(x) > g(x) nasıl çözülür?', ['f − g\'nin pozitif olduğu aralıklar', 'f\'nin kökleri'], 0, 'Fark fonksiyonu.'),
      soru('Matematiksel her kök problemin cevabıdır.', false, 'Bağlama uyanlar seçilir.'),
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
    ], [
      soru('Permütasyonda sıralama önemlidir, kombinasyonda değildir.', true, 'Aynı elemanlar farklı sırayla permütasyonda ayrı, kombinasyonda aynı sayılıyor.'),
      soru('0! = 1 dir.', true, 'Tanım gereği; formüllerin tutarlı çalışmasını sağlıyor.'),
      soru('5 kişiden 2 kişilik bir takım seçmek permütasyon problemidir.', false, 'Takımda sıra önemli değil; bu bir kombinasyon problemi.'),
      soru('C(n, r) = C(n, n−r) eşitliği yanlıştır.', false, 'Simetri özelliği bu eşitliği veriyor: r seçmek, n−r tanesini ayırmakla aynı.'),
      sikli('0! kaçtır?', ['1', '0'], 0, 'Tanım gereği.'),
      sikli('5 kişiden 3\'ü sıraya kaç türlü dizilir?', ['60', '10'], 0, 'P(5,3) = 5·4·3.'),
      sikli('C(n, r) neye eşittir?', ['C(n, n−r)', 'C(r, n)'], 0, 'Simetri.'),
      sikli('Seçenekler birbirinin alternatifiyse?', ['Toplanır', 'Çarpılır'], 0, 'Art arda çarpılır.'),
      sikli('"En az bir" sorularında kısa yol?', ['Hepsini saymak', 'Toplamdan hiç olmayanı çıkarmak'], 1, 'Tümleyen.'),
      soru('Aynı nesnelerden birden çok varsa toplam, tekrar faktöriyellerine bölünür.', true, 'Tekrarlı sayma.'),
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
    ], [
      soru('İşlem önceliği kuralları adım adım uygulanan bir algoritmadır.', true, 'Aynı ifade herkeste aynı sonucu bu sayede veriyor.'),
      soru('Öklid algoritması iki sayının EBOB unu bulur.', true, 'Kalanlı bölme tekrarlanarak yürüyor.'),
      soru('Öklid algoritması, çarpanlara ayırma yöntemine göre daha yavaştır.', false, 'Büyük sayılarda çok daha hızlı; her adımda sayılar hızla küçülüyor.'),
      soru('Özyinelemeli bir tanımın durma koşuluna ihtiyacı yoktur.', false, 'Durma koşulu olmayan özyineleme hiç sonlanmaz.'),
      sikli('n! = n·(n−1)! tanımı nedir?', ['Döngü', 'Özyineleme'], 1, 'Durma koşulu şart.'),
      sikli('Öklid neden asal çarpanlardan hızlıdır?', ['Daha az bellek ister', 'Birkaç bölme yeter'], 1, 'Büyük sayılarda fark büyür.'),
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
        kart: 2,
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
    ], [
      soru('A(1, 2) ile B(4, 6) noktaları arasındaki uzaklık 5 birimdir.', true, 'Farklar 3 ve 4; karekök içinde 9 + 16 = 25.'),
      soru('İki noktanın orta noktasının koordinatları, uçların koordinatlarının ortalamasıdır.', true, 'Her eksende ayrı ayrı ortalama alınıyor.'),
      soru('Bir üçgenin ağırlık merkezi, köşe koordinatlarının toplamına eşittir.', false, 'Toplamın üçte biri, yani ortalaması.'),
      soru('Apsisi negatif, ordinatı pozitif olan nokta birinci bölgededir.', false, 'İkinci bölgededir; birinci bölgede ikisi de pozitif.'),
      sikli('(2, 4) ile (6, 8)\'in orta noktası?', ['(8, 12)', '(4, 6)'], 1, 'Ortalamalar.'),
      sikli('(−3, 5) hangi bölgededir?', ['IV', 'II'], 1, '(−, +).'),
      soru('Üçgenin ağırlık merkezi köşe koordinatlarının ortalamasıdır.', true, 'Kenarortay çizmeden.'),
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
    ], [
      soru('Birbirine paralel iki doğrunun eğimleri eşittir.', true, 'Aynı yöne baktıkları için eğimleri aynı.'),
      soru('Birbirine dik iki doğrunun eğimleri çarpımı −1 dir.', true, 'Eksenlere paralel olmayan doğrular için geçerli.'),
      soru('x eksenine paralel bir doğrunun eğimi tanımsızdır.', false, 'Eğimi 0 dır; tanımsız olan y eksenine paralel doğrunun eğimi.'),
      soru('İki doğrunun kesişim noktası, denklemlerden yalnızca birini sağlar.', false, 'Kesişim noktası her iki denklemi de sağlar.'),
      sikli('Düşey doğrunun eğimi?', ['Tanımsız', '0'], 0, 'Yatay doğru 0.'),
      sikli('Paralel doğruların eğimleri?', ['Eşit', 'Çarpımı −1'], 0, 'Dikte çarpım −1.'),
      sikli('İki doğrunun denklem sistemi çözümsüzse?', ['Paralel', 'Çakışık'], 0, 'Sonsuz çözüm çakışık.'),
      sikli('y eksenini kestiği nokta nasıl bulunur?', ['x = 0 yazarak', 'y = 0 yazarak'], 0, 'y = 0 x eksenini.'),
      soru('Noktanın doğruya uzaklığı negatif olabilir.', false, 'Daima pozitif.'),
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
    ], [
      soru('P(A|B), B nin gerçekleştiği bilindiğinde A nın olasılığıdır.', true, 'Bilgi, hesabın yapıldığı zemini değiştiriyor.'),
      soru('Yeni bir bilginin verilmesi örnek uzayı daraltır.', true, 'Artık yalnızca bilginin uyduğu sonuçlar sayılıyor.'),
      soru('Bağımsız olaylar ile ayrık olaylar aynı şeydir.', false, 'Ayrık olaylar birlikte olamaz; bağımsız olaylarda biri ötekinin olasılığını değiştirmez.'),
      soru('İadesiz çekimde ikinci çekilişin olasılığı birinciden etkilenmez.', false, 'Çekilen top geri konmadığı için örnek uzay değişiyor.'),
      sikli('P(A|B) formülü?', ['P(A) · P(B)', 'P(A ∩ B) / P(B)'], 1, 'Örnek uzay B\'ye daralır.'),
      sikli('Çekilen top geri konursa olaylar?', ['Bağımlı', 'Bağımsız'], 1, 'İadesiz bağımlı.'),
      sikli('Ayrık olaylar bağımsız mıdır?', ['Evet', 'Hayır, ayrı kavramlar'], 1, 'Ayrıkta P(A|B) = 0.'),
      soru('P(A|B) ile P(B|A) aynı şeydir.', false, 'Karıştırmak yanlış sonuç üretir.'),
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
    ], [
      soru('Bayes teoremi, yeni bir kanıt ışığında olasılığı güncellemeyi sağlar.', true, 'Ön bilgi ile kanıtı birleştiriyor.'),
      soru('Nadir bir hastalıkta test pozitif çıkarsa kişinin hasta olma olasılığı testin doğruluk oranına eşittir.', false, 'Hastalığın nadirliği hesaba katılınca bu olasılık çok daha düşük çıkıyor.'),
      soru('Taban oranı yanılgısı, olayın toplumdaki yaygınlığını hesaba katmamaktır.', true, 'Sonucu olduğundan çok daha yüksek göstermeye yol açıyor.'),
      soru('Bayes teoreminde ön bilgi sonucu etkilemez.', false, 'Ön bilgi hesabın içinde ve sonucu belirleyen etkenlerden biri.'),
      sikli('Bayes teoremi neyi yapar?', ['Olasılıkları toplar', 'Koşullu olasılığı ters çevirir'], 1, 'P(B|A)\'dan P(A|B).'),
      sikli('İnsanların test doğruluğuna bakıp unuttuğu?', ['Test sonucu', 'Önsel olasılık'], 1, 'Taban oranı yanılgısı.'),
      soru('Bayes makine öğrenmesinde de kullanılır.', true, 'İnancı güncelleme kuralı.'),
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
    ]),
  ]),
])
