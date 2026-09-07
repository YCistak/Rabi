import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Matematik — Maarif Modeli.
 *
 * Yedi tema. **Sıra programın sırası**: Geometrik Şekiller üçüncü, Algoritma
 * ve Bilişim beşinci. Bu dosya bir süre ikisini yer değiştirmiş hâlde
 * taşıyordu; `maarif.test.ts` artık sırayı `maarif/iskelet.json` üstünden
 * denetliyor.
 *
 * Eski programın "polinom", "özdeşlik ve çarpanlara ayırma", "şifreleme"
 * başlıkları bu programda 9. sınıfta **yok**.
 *
 * Kart sayısı konunun genişliğine göre: "Üslü ve Köklü Gösterimler" on kart,
 * "Deneysel Olasılık" yedi. Bir süre her konu dört-beş kart taşıyordu ve
 * bunun sonucu geniş konuların yarım kalmasıydı — küme sembolleri konusu
 * "küme" kelimesini bir kez bile geçmiyordu.
 */
export const matematik9 = program('matematik', 9, 'Sayılardan olasılığa', [
  tema('mat9-t1', 'Sayılar', [
    konu('mat9-uslu-koklu', 'Üslü ve Köklü Gösterimlerle İşlemler', [
      kart(
        'Üslü ifade',
        'aⁿ, a sayısının n kez çarpımıdır. a tabandır, n üstür: 2⁵ = 2·2·2·2·2 = 32.',
      ),
      kart(
        'Sıfırıncı ve negatif üs',
        'a⁰ = 1 (a ≠ 0), a⁻ⁿ = 1/aⁿ. Negatif üs sayıyı negatif yapmaz, ters çevirir: 2⁻³ = 1/8.',
      ),
      kart(
        'Aynı tabanda işlem',
        'Çarpmada üsler toplanır, bölmede çıkarılır: aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ.',
        {
          tur: 'tablo',
          basliklar: ['Kural', 'Sonuç'],
          satirlar: [
            ['aᵐ · aⁿ', 'aᵐ⁺ⁿ'],
            ['aᵐ / aⁿ', 'aᵐ⁻ⁿ'],
            ['(aᵐ)ⁿ', 'aᵐ·ⁿ'],
            ['(a·b)ⁿ', 'aⁿ · bⁿ'],
            ['a⁻ⁿ', '1 / aⁿ'],
          ],
        },
      ),
      kart(
        'Üssün üssü',
        '(aᵐ)ⁿ = aᵐⁿ — üsler çarpılır. (2³)² = 2⁶ = 64; 2³·2² = 2⁵ = 32 ile karıştırılıyor.',
      ),
      kart(
        'Bilimsel gösterim',
        'Sayı a · 10ⁿ biçiminde yazılır ve 1 ≤ a < 10 olmalıdır: 45.000 = 4,5 · 10⁴, 0,0032 = 3,2 · 10⁻³.',
      ),
      kart(
        'Köklü ifade',
        'ⁿ√a, n. kuvveti a olan sayıdır. Karekökte n yazılmaz: √25 = 5.',
      ),
      kart(
        'Kök ile üs aynı şey',
        'Köklü ifade kesirli üsle yazılır: √a = a^(1/2), ³√a² = a^(2/3). Bütün üs kuralları köke de geçer.',
      ),
      kart(
        'Köklülerde işlem',
        '√a·√b = √(ab) ve √a/√b = √(a/b). Toplama böyle değil: √2 + √3, √5 etmez.',
      ),
      kart(
        'Paydayı rasyonel yapma',
        'Paydadaki kök genişletmeyle yok edilir. Payda iki terimliyse eşleniğiyle çarpılır: 1/(√3−1) → (√3+1)/2.',
      ),
      kart(
        'Dikkat: √(a²) = |a|',
        'Karekökün sonucu negatif olamaz. Bu yüzden değişkenli ifadelerde mutlak değer gerekir.',
      ),
    ]),
    konu('mat9-araliklar', 'Gerçek Sayı Aralıkları ve Küme Sembolleri', [
      kart(
        'Küme ve eleman',
        'Küme, iyi tanımlanmış nesneler topluluğu. Bir nesne kümedeyse ∈, değilse ∉ ile yazılır: 3 ∈ ℕ, −2 ∉ ℕ.',
      ),
      kart(
        'Alt küme ve boş küme',
        'A’nın her elemanı B’de varsa A ⊆ B. Hiç elemanı olmayan küme boş kümedir (∅) ve her kümenin alt kümesidir.',
      ),
      kart(
        'Evrensel küme ve tümleyen',
        'Konuşulan bütün elemanların kümesi evrensel kümedir (E). A’ nın tümleyeni A′, E’de olup A’da olmayanlardır.',
        {
          tur: 'venn',
          sol: 'A',
          sag: 'A′',
          disi: 'E',
          tumleyen: true,
        },
      ),
      kart(
        'Aralık gösterimi',
        'Köşeli parantez uç noktayı içerir, normal parantez içermez: [2, 5) → 2 dâhil, 5 hariç.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 7],
          isaretler: [0, 2, 5, 7],
          parcalar: [{ bas: 2, bit: 5, kapaliBas: true, kapaliBit: false, ad: '[2, 5)' }],
        },
      ),
      kart(
        'Sayı doğrusunda',
        'Dolu nokta uç noktanın dâhil olduğunu, boş nokta dâhil olmadığını gösterir. Yukarıdaki çizimde 2 dolu, 5 boştur.',
      ),
      kart(
        'Sonsuz uç',
        'Sonsuz bir sayı değildir, ulaşılan bir yer de değildir; bu yüzden yanına daima normal parantez konur.',
        {
          tur: 'sayiDogrusu',
          aralik: [-6, 6],
          isaretler: [-4, -2, 0, 3],
          parcalar: [{ bas: null, bit: 3, kapaliBit: true, ad: '(−∞, 3]' }],
        },
      ),
      kart(
        'Birleşim ve kesişim',
        'Birleşim (∪) iki aralığın tamamı, kesişim (∩) ortak kısmıdır. Kesişim boş küme olabilir.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 10],
          isaretler: [1, 4, 6, 9],
          parcalar: [
            { bas: 1, bit: 6, kapaliBas: true, kapaliBit: true, ad: 'A' },
            { bas: 4, bit: 9, kapaliBas: true, kapaliBit: true, ad: 'B', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Aralık mı küme mi?',
        'Aralık yalnızca gerçek sayılarda kullanılır ve arada sonsuz eleman vardır. Tam sayılarda liste yazılır: {2, 3, 4}.',
      ),
    ]),
    konu('mat9-sayi-kumeleri', 'Sayı Kümeleri ve İşlem Özellikleri', [
      kart(
        'Kümeler iç içedir',
        'Doğal ⊂ tam ⊂ rasyonel ⊂ gerçek. İrrasyonel sayılar rasyonellerin dışında kalır ama gerçek sayılara dâhildir.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'ℝ gerçek sayılar' },
            { ad: 'ℚ rasyonel sayılar' },
            { ad: 'ℤ tam sayılar' },
            { ad: 'ℕ doğal sayılar' },
          ],
        },
      ),
      kart(
        'Doğal ve tam sayılar',
        'ℕ = {0, 1, 2, …}; ℤ bunlara negatifleri ekler. Sayma sayıları sıfırı içermez, doğal sayılar içerir.',
      ),
      kart(
        'Rasyonel sayı',
        'a/b biçiminde yazılabilen sayı (a, b tam ve b ≠ 0). Her tam sayı da rasyoneldir: 5 = 5/1.',
      ),
      kart(
        'İrrasyonel sayı',
        'Kesir olarak yazılamayan sayı: √2, π, e. Ondalık açılımı sonsuz ve devirsizdir.',
      ),
      kart(
        'Ondalık açılım ayırt eder',
        'Bir sayının rasyonel mi irrasyonel mi olduğu ondalık açılımından anlaşılır.',
        {
          tur: 'tablo',
          basliklar: ['Açılım', 'Tür'],
          satirlar: [
            ['0,25 (sonlu)', 'Rasyonel'],
            ['0,333… (devirli)', 'Rasyonel'],
            ['1,41421… (devirsiz)', 'İrrasyonel'],
          ],
        },
      ),
      kart(
        'İşlem özellikleri',
        'Değişme, birleşme ve dağılma. Dağılma iki işlemi birbirine bağlayan tek özelliktir: a(b + c) = ab + ac.',
      ),
      kart(
        'Etkisiz ve ters eleman',
        'Etkisiz eleman toplamada 0, çarpmada 1’dir. Ters eleman toplamada −a, çarpmada 1/a (a ≠ 0).',
      ),
      kart(
        'Çıkarma ve bölme',
        'Değişme özelliği yoktur: 5 − 3 ile 3 − 5 aynı değildir. Bu yüzden ayrı işlem sayılırlar.',
      ),
      kart(
        'Kapalılık',
        'İki doğal sayının farkı doğal olmayabilir (3 − 5), iki tam sayının bölümü tam olmayabilir. Küme genişledikçe kapalılık artar.',
      ),
    ]),
    konu('mat9-cebirsel-ifade', 'İşlem Özelliklerini Cebirsel Olarak İfade Etme', [
      kart(
        'Neden harf?',
        'Harf, "her sayı için" demenin kısa yolu. a + b = b + a bir kural değil, sonsuz eşitliğin özetidir.',
      ),
      kart(
        'Terim, katsayı, değişken',
        '3x² + 5x − 2 ifadesinde üç terim var; 3 ve 5 katsayı, x değişken, −2 sabit terimdir.',
      ),
      kart(
        'Benzer terim',
        'Değişkeni ve derecesi aynı olan terimler toplanabilir: 3x + 5x = 8x. 3x + 5x² sadeleşmez.',
      ),
      kart(
        'Dağılma özelliği',
        'a(b + c) = ab + ac. Parantezin önünde eksi varsa içerideki her terimin işareti değişir.',
      ),
      kart(
        'Ters yönde okumak',
        'Aynı eşitlik sağdan sola okunduğunda ortak çarpan parantezine alma olur: 6x + 9 = 3(2x + 3).',
      ),
      kart(
        'Genelleme yapmak',
        'Birkaç sayıda gözlenen örüntü, harfle yazıldığında bütün sayılar için iddiaya dönüşür.',
      ),
      kart(
        'Karşı örnek',
        'Bir genellemeyi çürütmek için tek bir karşı örnek yeter; doğrulamak için ise ispat gerekir.',
      ),
    ]),
  ]),
  tema('mat9-t2', 'Nicelikler ve Değişimler', [
    konu('mat9-dogrusal', 'Doğrusal Fonksiyonlar ve Nitel Özellikleri', [
      kart(
        'Fonksiyon nedir?',
        'Her girdiye tam olarak bir çıktı eşleyen kural. Bir girdiye iki çıktı verilirse fonksiyon olmaz.',
      ),
      kart(
        'Dikey doğru testi',
        'Grafiğe çizilen her dikey doğru eğriyi en çok bir noktada kesiyorsa grafik bir fonksiyona aittir.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -3, 3],
          egriler: [
            {
              noktalar: [
                [-2, -2],
                [0, 0],
                [2, 2],
              ],
              kirik: true,
            },
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
          noktalar: [{ x: 1, y: 1, renk: 'ikincil' }],
        },
      ),
      kart(
        'Tanım ve görüntü kümesi',
        'Girdilerin kümesi tanım kümesi, çıkan değerlerin kümesi görüntü kümesidir. f(x) = 1/x için 0 tanımlı değildir.',
      ),
      kart(
        'Doğrusal fonksiyon',
        'f(x) = ax + b biçimindedir ve grafiği bir doğrudur. a eğim, b ise y eksenini kestiği değerdir.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -5, 5],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [-2, -5],
                [2, 3],
              ],
              kirik: true,
              ad: 'f(x) = 2x − 1',
            },
          ],
          noktalar: [
            { x: 0, y: -1 },
            { x: 0.5, y: 0, renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Eğim ne söyler?',
        'Eğim, x bir birim arttığında y’nin ne kadar değiştiğidir. a = 2 ise sağa bir adımda yukarı iki adım.',
        {
          tur: 'koordinat',
          pencere: [0, 4, 0, 5],
          egriler: [
            {
              noktalar: [
                [0.5, 0],
                [3, 5],
              ],
              kirik: true,
            },
            {
              noktalar: [
                [1, 1],
                [2, 1],
                [2, 3],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 1.5, y: 0.6, ad: '+1', renk: 'ikincil' },
            { x: 2.45, y: 2, ad: '+2', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Artan mı azalan mı?',
        'a > 0 ise fonksiyon artandır, a < 0 ise azalandır, a = 0 ise sabittir ve grafiği yatay bir doğrudur.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -4, 4],
          egriler: [
            {
              noktalar: [
                [-3, -2],
                [2.6, 3.6],
              ],
              kirik: true,
              ad: 'a > 0',
            },
            {
              noktalar: [
                [-3, 4],
                [2.6, -1.6],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'a < 0',
            },
          ],
        },
      ),
      kart(
        'Kesim noktaları',
        'b değeri y eksenini kestiği noktadır; x eksenini kestiği yer f(x) = 0 çözülerek bulunur.',
      ),
      kart(
        'Sabit fonksiyon',
        'f(x) = 3 her girdiye 3 verir. Grafiği yataydır, eğimi sıfırdır ve x eksenini hiç kesmez.',
      ),
      kart(
        'Gerçek hayatta',
        'Sabit ücretli taksi: f(x) = 8x + 25. Burada 25 açılış ücreti (b), 8 kilometre başına artış (a).',
      ),
      kart(
        'Grafikten okumak',
        'Doğrunun dikliği eğimi, yükseldiği yön artan mı azalan mı olduğunu, y ekseniyle kesişimi başlangıç değerini verir.',
      ),
    ]),
    konu('mat9-mutlak-deger', 'Mutlak Değer Fonksiyonu ve Nitel Özellikleri', [
      kart(
        'Mutlak değer',
        'Bir sayının sıfıra olan uzaklığı. Uzaklık negatif olamayacağı için sonuç asla negatif değildir.',
      ),
      kart(
        'Tanımı',
        '|x| = x (x ≥ 0 ise), |x| = −x (x < 0 ise). Parçalı bir tanımdır: kural, x’in işaretine göre değişir.',
      ),
      kart(
        'Grafiği V şeklinde',
        'x ≥ 0 için doğru yukarı, x < 0 için aşağıdan gelir; ikisi orijinde birleşir ve orası kırılma noktasıdır.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -1, 4],
          xAd: 'x',
          egriler: [
            {
              noktalar: [
                [-4, 4],
                [0, 0],
                [4, 4],
              ],
              kirik: true,
            },
          ],
          noktalar: [{ x: 0, y: 0, ad: 'kırılma', renk: 'ikincil' }],
        },
      ),
      kart(
        'Grafiği kaydırmak',
        '|x − 2| grafiği sağa 2 birim kayar, |x| + 3 yukarı 3 birim kayar. İçerideki değişim yatay, dışarıdaki dikey etkiler.',
        {
          tur: 'koordinat',
          pencere: [-2, 6, -1, 4],
          egriler: [
            {
              noktalar: [
                [-2, 2],
                [0, 0],
                [2, 2],
              ],
              kirik: true,
              ad: '|x|',
            },
            {
              noktalar: [
                [0, 2],
                [2, 0],
                [4, 2],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: '|x−2|',
            },
          ],
        },
      ),
      kart(
        'Denklem çözerken',
        '|x| = a denkleminin a > 0 için iki çözümü vardır: x = a ve x = −a. a < 0 ise çözüm yoktur.',
      ),
      kart(
        'Eşitsizlikte: küçüktür',
        '|x| < a ise −a < x < a. Çözüm sıfırın çevresinde tek bir aralıktır.',
        {
          tur: 'sayiDogrusu',
          aralik: [-5, 5],
          isaretler: [-3, 0, 3],
          parcalar: [{ bas: -3, bit: 3, ad: '|x| < 3' }],
        },
      ),
      kart(
        'Eşitsizlikte: büyüktür',
        '|x| > a ise x < −a ya da x > a. Çözüm birbirinden ayrı iki parçadır; en sık karıştırılan yer burasıdır.',
        {
          tur: 'sayiDogrusu',
          aralik: [-5, 5],
          isaretler: [-3, 0, 3],
          parcalar: [
            { bas: null, bit: -3, ad: '|x| > 3' },
            { bas: 3, bit: null },
          ],
        },
      ),
      kart(
        'Uzaklık olarak okumak',
        '|x − 5| ifadesi "x ile 5 arasındaki uzaklık" demektir. |x − 5| < 2 → x, 5’e 2 birimden yakın.',
      ),
    ]),
    konu('mat9-denklem-esitsizlik', 'Doğrusal Denklem ve Eşitsizlikler İçeren Problemler', [
      kart(
        'Denklem kurmak',
        'Bilinmeyeni seç, cümleyi eşitliğe çevir, çöz, sonucu problemin bağlamında kontrol et.',
      ),
      kart(
        'Çözmenin mantığı',
        'Denklem bir terazidir: iki tarafa aynı şey yapıldıkça denge bozulmaz. Çözmek, bilinmeyeni yalnız bırakmaktır.',
      ),
      kart(
        'Eşitsizlikte işaret',
        'İki tarafı negatif sayıyla çarparken ya da bölerken eşitsizlik yön değiştirir: −2x < 6 → x > −3.',
      ),
      kart(
        'Çözüm kümesi',
        'Denklemin çözümü genellikle tek noktadır; eşitsizliğin çözümü bir aralıktır ve sayı doğrusunda gösterilir.',
        {
          tur: 'sayiDogrusu',
          aralik: [-6, 6],
          isaretler: [-3, 0, 3],
          parcalar: [{ bas: -3, bit: null, kapaliBas: false, ad: 'x > −3' }],
        },
      ),
      kart(
        'Çözümsüz ve sonsuz çözüm',
        'Bilinmeyen sadeleşip 0 = 5 kalırsa çözüm yoktur; 0 = 0 kalırsa her sayı çözümdür.',
      ),
      kart(
        'Anlam kontrolü',
        'Kişi sayısı negatif, yaş kesirli çıkmaz. Matematiksel doğru çözüm bağlamda geçersiz olabilir.',
      ),
      kart(
        'Oran ve orantı',
        'Doğru orantıda biri artarken öteki aynı oranda artar; ters orantıda çarpımları sabit kalır.',
      ),
      kart(
        'Yüzde problemleri',
        'Yüzde bir orandır: %20 artış 1,2 ile çarpmaktır. Art arda %20 artıp %20 azalan sayı başlangıca dönmez.',
      ),
    ]),
  ]),
  tema('mat9-t3', 'Geometrik Şekiller', [
    konu('mat9-ucgen-ozellik', 'Üçgende Açı ve Kenarla İlgili Özellikler', [
      kart(
        'İç açılar toplamı',
        'Bir üçgenin iç açıları toplamı 180°, dış açıları toplamı 360°’dir. Bu, üçgenin tanımından gelen değişmez bir kuraldır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [9, 1],
                [6, 5],
              ],
              kirik: true,
              kapali: true,
            },
          ],
          etiketler: [
            { x: 1.7, y: 1.6, ad: 'A', renk: 'ikincil' },
            { x: 8.2, y: 1.6, ad: 'B', renk: 'ikincil' },
            { x: 6, y: 4.2, ad: 'C', renk: 'ikincil' },
            { x: 5, y: 5.6, ad: 'A + B + C = 180°', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Dış açı özelliği',
        'Bir dış açı, kendisine komşu olmayan iki iç açının toplamına eşittir. İspatı doğrudan 180° kuralından çıkar.',
      ),
      kart(
        'Kenar-açı ilişkisi',
        'Büyük açının karşısında büyük kenar bulunur. İkisi aynı yönde değişir; en küçük açının karşısı en kısa kenardır.',
      ),
      kart(
        'Üçgen eşitsizliği',
        'İki kenarın toplamı üçüncü kenardan büyük olmalıdır. Aksi hâlde kenarlar birleşip üçgen kapanmaz.',
        {
          tur: 'tablo',
          basliklar: ['Kenarlar', 'Üçgen olur mu?'],
          satirlar: [
            ['3, 4, 6', 'Olur (3+4 > 6)'],
            ['3, 4, 7', 'Olmaz (3+4 = 7)'],
            ['3, 4, 8', 'Olmaz (3+4 < 8)'],
          ],
        },
      ),
      kart(
        'Üçüncü kenarın aralığı',
        'İki kenar a ve b ise üçüncü kenar |a − b| ile a + b arasındadır. Uçlar dâhil değildir.',
      ),
      kart(
        'Üçgen türleri',
        'Kenarlarına göre eşkenar, ikizkenar, çeşitkenar; açılarına göre dar, dik ve geniş açılı.',
      ),
      kart(
        'İkizkenar üçgen',
        'Eşit kenarların karşısındaki açılar da eşittir. Tepe açısından inen yükseklik aynı zamanda açıortay ve kenarortaydır.',
      ),
      kart(
        'Üç temel doğru',
        'Açıortay açıyı ikiye böler, kenarortay kenarı ortalar, yükseklik kenara diktir. Üçü genelde farklı doğrulardır.',
      ),
      kart(
        'Ağırlık merkezi',
        'Üç kenarortay tek noktada kesişir ve bu nokta her kenarortayı köşeden başlayarak 2/1 oranında böler.',
      ),
      kart(
        'Alan',
        'Alan = taban · yükseklik / 2. Yükseklik, tabana **dik** olan uzaklıktır; yan kenar yükseklik değildir.',
      ),
    ]),
  ]),
  tema('mat9-t4', 'Eşlik ve Benzerlik', [
    konu('mat9-donusum', 'Geometrik Dönüşümler', [
      kart(
        'Öteleme',
        'Şekil belirli bir yönde ve miktarda kaydırılır. Boyut, şekil ve yön korunur; yalnızca konum değişir.',
        {
          tur: 'koordinat',
          pencere: [-1, 9, -1, 5],
          egriler: [
            {
              noktalar: [
                [1, 1],
                [3, 1],
                [2, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [5, 1],
                [7, 1],
                [6, 4],
              ],
              kirik: true,
              kapali: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [{ x: 4, y: 2.2, ad: '→ 4 birim', renk: 'soluk' }],
        },
      ),
      kart(
        'Yansıma',
        'Bir doğruya göre simetrik görüntü alınır. Şekil ters döner ama bütün ölçüleri korunur.',
      ),
      kart(
        'Döndürme',
        'Bir nokta çevresinde belirli açıyla çevrilir. Merkez, açı ve yön (saat yönü / tersi) birlikte belirtilmelidir.',
      ),
      kart(
        'Koordinatta kural',
        'Dönüşümler nokta koordinatlarına basit kurallarla yansır.',
        {
          tur: 'tablo',
          basliklar: ['Dönüşüm', '(x, y) → '],
          satirlar: [
            ['x eksenine yansıma', '(x, −y)'],
            ['y eksenine yansıma', '(−x, y)'],
            ['Orijine göre 180°', '(−x, −y)'],
            ['Öteleme (a, b)', '(x+a, y+b)'],
          ],
        },
      ),
      kart(
        'Eşlik dönüşümleri',
        'Öteleme, yansıma ve döndürme uzunlukları korur; ürettikleri şekil orijinaline eştir.',
      ),
      kart(
        'Benzerlik dönüşümü',
        'Ölçekleme (homoteti) boyutu değiştirir ama açıları korur; sonuç benzer bir şekildir.',
      ),
      kart(
        'Bileşke dönüşüm',
        'İki dönüşüm art arda uygulanabilir ve sıraları önemlidir: önce döndürüp ötelemek ile tersi farklı sonuç verir.',
      ),
      kart(
        'Simetri ekseni',
        'Bir şekil bir doğruya göre kendisiyle çakışıyorsa o doğru simetri eksenidir. Eşkenar üçgenin üç tanesi vardır.',
      ),
    ]),
    konu('mat9-eslik-kosul', 'Eşlik ve Benzerlik Koşulları', [
      kart(
        'Eşlik nedir?',
        'İki şeklin bütün karşılıklı kenar ve açılarının eşit olması. Üst üste tam olarak çakışırlar.',
      ),
      kart(
        'Eşlik koşulları',
        'Üç uygun eleman eşliği garanti eder; altı elemanın hepsini ölçmek gerekmez.',
        {
          tur: 'tablo',
          basliklar: ['Koşul', 'Anlamı'],
          satirlar: [
            ['KKK', 'Üç kenar eşit'],
            ['KAK', 'İki kenar ve aradaki açı'],
            ['AKA', 'İki açı ve aradaki kenar'],
            ['Dik üçgende HK', 'Hipotenüs ve bir kenar'],
          ],
        },
      ),
      kart(
        'AAA neden yetmez?',
        'Üç açısı eşit iki üçgen aynı biçimdedir ama aynı boyda olmak zorunda değildir; bu eşlik değil benzerliktir.',
      ),
      kart(
        'Benzerlik nedir?',
        'Açılar eşit, karşılıklı kenarlar orantılıdır. Şekil aynı, ölçek farklıdır.',
      ),
      kart(
        'Benzerlik koşulları',
        'AA, KKK (oran) ve KAK (oran). Üçgende iki açının eşitliği benzerlik için yeter — üçüncüsü kendiliğinden eşit olur.',
      ),
      kart(
        'Eşlik özel bir benzerliktir',
        'Benzerlik oranı 1 olan benzerlik, eşliktir. Her eş şekil benzerdir, tersi doğru değildir.',
      ),
      kart(
        'Yazım sırası önemli',
        'ABC ≅ DEF yazıldığında A ile D, B ile E, C ile F eşleşir. Sıra bozulursa kurulan bütün eşitlikler yanlış olur.',
      ),
      kart(
        'Nerede kullanılır?',
        'Ölçülemeyen uzunlukları hesaplamak için: nehrin genişliği, binanın yüksekliği, haritadaki mesafe.',
      ),
    ]),
    konu('mat9-benzer-ucgen', 'Benzer Üçgenler Oluşturma', [
      kart(
        'Paralel kesen',
        'Bir üçgende bir kenara paralel çizilen doğru, orijinaline benzer küçük bir üçgen üretir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [9, 1],
                [5, 5],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [3, 3],
                [7, 3],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [{ x: 5, y: 3.5, ad: 'DE ∥ AB', renk: 'ikincil' }],
        },
      ),
      kart(
        'Temel benzerlik teoremi',
        'Paralel kesen, kestiği iki kenarı aynı oranda böler. Bu, Tales teoreminin üçgendeki hâlidir.',
      ),
      kart(
        'Benzerlik oranı',
        'Karşılıklı kenarların oranı. Bu oran üçgenin bütün uzunluklarında (kenar, yükseklik, çevre) aynıdır.',
      ),
      kart(
        'Alan oranı karesidir',
        'Benzerlik oranı k ise çevreler oranı k, alanlar oranı k²’dir. Uzunluk oranıyla alan oranı sık karıştırılır.',
      ),
      kart(
        'Karşılıklı elemanlar',
        'Benzerlik yazılırken köşeler doğru sırayla eşleştirilmelidir; sıra bozulursa oranlar yanlış kurulur.',
      ),
      kart(
        'Kelebek benzerliği',
        'İki doğru kesiştiğinde ters açılar eşit olur; paralel kenarlar varsa iki üçgen "kelebek" biçiminde benzerdir.',
      ),
      kart(
        'Günlük kullanım',
        'Gölge boyu ile ağaç boyunu hesaplamak benzer üçgen kurmaktır: aynı anda ölçülen iki gölge aynı oranı verir.',
      ),
    ]),
    konu('mat9-teoremler', 'Tales, Öklid ve Pisagor Teoremleri', [
      kart(
        'Tales teoremi',
        'Paralel doğrular, kestikleri doğrular üzerinde orantılı parçalar ayırır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [9, 3],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [1, 5],
                [9, 5.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [2, 0.5],
                [3, 5.6],
              ],
              kirik: true,
            },
            {
              noktalar: [
                [7, 1.5],
                [8, 5.6],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'Tales nerede işe yarar?',
        'Bir kenarı ölçülemeyen şekillerde eksik uzunluğu bulmak için: orantı kurulur, bilinmeyen çekilir.',
      ),
      kart(
        'Pisagor teoremi',
        'Dik üçgende hipotenüsün karesi, dik kenarların karelerinin toplamına eşittir: a² + b² = c².',
        {
          tur: 'koordinat',
          pencere: [0, 7, 0, 5],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [5, 1],
                [5, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [4.6, 1],
                [4.6, 1.4],
                [5, 1.4],
              ],
              kirik: true,
              renk: 'soluk',
            },
          ],
          etiketler: [
            { x: 3, y: 0.5, ad: 'a = 4', renk: 'ikincil' },
            { x: 5.7, y: 2.5, ad: 'b = 3', renk: 'ikincil' },
            { x: 2.6, y: 3.1, ad: 'c = 5', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Pisagor üçlüleri',
        '(3,4,5), (5,12,13), (8,15,17) ve katları. Tanımak soruda zaman kazandırır: 6-8-10 de bir üçlüdür.',
      ),
      kart(
        'Teoremin tersi',
        'a² + b² = c² sağlanıyorsa üçgen diktir. Bu yönü, bir üçgenin dik olup olmadığını sınamak için kullanılır.',
      ),
      kart(
        'Öklid: yükseklik bağıntısı',
        'Dik üçgende hipotenüse indirilen yükseklik h ise h² = p·q — p ve q, yüksekliğin hipotenüste ayırdığı parçalardır.',
      ),
      kart(
        'Öklid: dik kenar bağıntısı',
        'Her dik kenarın karesi, kendi izdüşümü ile hipotenüsün çarpımına eşittir: a² = p·c.',
      ),
      kart(
        'Özel dik üçgenler',
        '30-60-90 üçgeninde kenarlar 1, √3, 2 oranında; 45-45-90 üçgeninde 1, 1, √2 oranındadır.',
      ),
      kart(
        'Neden aynı temada?',
        'Üçünün de ispatı benzerliğe dayanır; ayrı formüller gibi görünen şeyler tek fikrin sonuçlarıdır.',
      ),
    ]),
    konu('mat9-benzerlik-problem', 'Eşlik ve Benzerlik Problemleri', [
      kart(
        'Çözüm yolu',
        'Önce benzer üçgenleri ayır, sonra karşılıklı köşeleri eşleştir, en sonda oranı kur.',
      ),
      kart(
        'Şekli ayırmak',
        'İç içe geçmiş benzer üçgenleri iki ayrı şekil olarak yeniden çizmek, eşleştirme hatasını büyük ölçüde bitirir.',
      ),
      kart(
        'En sık hata',
        'Karşılıklı olmayan kenarları oranlamak. Eşleştirme yanlışsa oran da yanlış olur.',
      ),
      kart(
        'Alan oranı',
        'Benzerlik oranı k ise alan oranı k²’dir. Uzunluk oranıyla alan oranı karıştırılıyor.',
      ),
      kart(
        'Hacim oranı',
        'Benzer katı cisimlerde hacimler oranı k³’tür. Ölçeği iki katına çıkan bir maket sekiz kat hacim kaplar.',
      ),
      kart(
        'Ölçek',
        'Harita ölçeği bir benzerlik oranıdır: 1/25.000 ölçekte haritadaki 1 cm, arazide 250 metredir.',
      ),
      kart(
        'Uygulama',
        'Maket, gölge boyu, fotoğraf büyütme ve harita hesapları hep benzerlik problemidir.',
      ),
    ]),
  ]),
  tema('mat9-t5', 'Algoritma ve Bilişim', [
    konu('mat9-algoritma', 'Algoritma Temelli Problemler', [
      kart(
        'Algoritma nedir?',
        'Bir problemi çözmek için izlenen sonlu, sıralı ve kesin adımlar dizisi.',
      ),
      kart(
        'Üç özellik',
        'Sonlu olmalı, her adım açık olmalı ve aynı girdide her zaman aynı sonucu vermelidir.',
      ),
      kart(
        'Girdi, işlem, çıktı',
        'Her algoritmanın bir girdisi, üzerinde yapılan işlemler ve bir çıktısı vardır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Girdi', alt: 'veri alınır' },
            { ad: 'İşlem', alt: 'hesaplanır' },
            { ad: 'Çıktı', alt: 'sonuç yazılır' },
          ],
        },
      ),
      kart(
        'Akış şeması',
        'Oval başlangıç-bitiş, dikdörtgen işlem, eşkenar dörtgen karar, paralelkenar giriş-çıkış.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Başla', renk: 'soluk' },
            { ad: 'Sayıyı oku' },
            { ad: 'Sayı > 0 mı?', alt: 'karar', renk: 'ikincil' },
            { ad: 'Sonucu yaz' },
            { ad: 'Bitir', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Üç temel yapı',
        'Sıralı, koşullu (eğer) ve tekrarlı (döngü) yapılar. Her algoritma bu üçünün bileşimidir.',
      ),
      kart(
        'Değişken',
        'Değer tutan adlandırılmış kutu. İçindeki değer değişebilir; algoritma boyunca güncellenir.',
      ),
      kart(
        'Sonsuz döngü',
        'Döngüyü bitiren koşul hiçbir zaman sağlanmazsa algoritma durmaz — "sonlu olma" özelliği bu yüzden şart.',
      ),
      kart(
        'Neden matematikte?',
        'Matematiksel çözüm de bir algoritmadır: bölme işlemi ve denklem çözme adım adım tanımlıdır.',
      ),
    ]),
    konu('mat9-mantik', 'Mantık Bağlaçları ve Niceleyiciler', [
      kart(
        'Önerme',
        'Doğru ya da yanlış olduğu kesin olarak söylenebilen ifade. Soru ve emir cümlesi önerme değildir.',
      ),
      kart(
        'Doğruluk değeri',
        'Her önermenin bir doğruluk değeri vardır: doğru (D) ya da yanlış (Y). İkisi arasında bir değer yoktur.',
      ),
      kart(
        've bağlacı (∧)',
        'İki önermenin ikisi birden doğruysa bileşik önerme doğrudur; biri bile yanlışsa sonuç yanlıştır.',
        {
          tur: 'tablo',
          basliklar: ['p', 'q', 'p ∧ q'],
          satirlar: [
            ['D', 'D', 'D'],
            ['D', 'Y', 'Y'],
            ['Y', 'D', 'Y'],
            ['Y', 'Y', 'Y'],
          ],
        },
      ),
      kart(
        'veya bağlacı (∨)',
        'En az biri doğruysa sonuç doğrudur. Günlük dildeki "ya o ya bu" anlamı değil, "ikisi de olabilir" anlamıdır.',
        {
          tur: 'tablo',
          basliklar: ['p', 'q', 'p ∨ q'],
          satirlar: [
            ['D', 'D', 'D'],
            ['D', 'Y', 'D'],
            ['Y', 'D', 'D'],
            ['Y', 'Y', 'Y'],
          ],
        },
      ),
      kart(
        'değil (¬)',
        'Önermenin doğruluk değerini tersine çevirir. İki kez uygulanırsa başa dönülür: ¬(¬p) = p.',
      ),
      kart(
        'Koşullu önerme',
        'p ⇒ q yalnızca p doğru ve q yanlışken yanlıştır. Diğer üç durumda doğrudur.',
      ),
      kart(
        'Karşıt tersi',
        'p ⇒ q ile ¬q ⇒ ¬p her zaman aynı doğruluk değerini taşır. İspatlarda bu eşdeğerlik kullanılır.',
      ),
      kart(
        'Niceleyiciler',
        '∀ "her" demektir, ∃ "en az bir" demektir. İkisinin yeri değişince anlam tümüyle değişir.',
      ),
      kart(
        'Olumsuzlama',
        '"Her" olumsuzlanınca "en az bir", "en az bir" olumsuzlanınca "hiçbir" olur.',
      ),
    ]),
    konu('mat9-mantik-algoritma', 'Mantık Bağlaçlarının Algoritmik Kullanımı', [
      kart(
        'Koşullu ifadeler',
        'Programdaki "eğer" ifadeleri mantık önermeleridir; koşul doğruysa blok çalışır, yanlışsa atlanır.',
      ),
      kart(
        'Bileşik koşullar',
        '"Yaş > 18 ve ehliyet var" gibi koşullar mantık bağlaçlarıyla kurulur; doğruluk tablosu davranışı önceden söyler.',
      ),
      kart(
        'Eğer-değilse',
        'Karar noktasının iki çıkışı vardır ve yalnızca biri çalışır. İkisinin de çalıştığı bir yol yoktur.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Koşul', renk: 'ikincil' },
            { ad: 'Doğruysa' },
            { ad: 'Yanlışsa', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Döngü koşulu',
        'Döngü, koşul önermesi doğru kaldığı sürece tekrarlanır. Koşul hiç yanlış olmazsa döngü bitmez.',
      ),
      kart(
        'Karar noktaları',
        'Akış şemasındaki her eşkenar dörtgen bir önermedir ve çıkışları doğru/yanlış diye ayrılır.',
      ),
      kart(
        'Koşulun olumsuzu',
        'Bir koşulu tersine çevirmek, akış şemasındaki iki dalın yer değiştirmesi demektir; algoritma aynı işi yapar.',
      ),
      kart(
        'İç içe koşul',
        'Bir kararın dalı içinde ikinci bir karar olabilir. Bu, ve bağlacıyla yazılan tek koşula denk gelir.',
      ),
    ]),
  ]),
  tema('mat9-t6', 'İstatistiksel Araştırma Süreci', [
    konu('mat9-veri-dagilim', 'Tek Nicel Değişkenli Veri Dağılımları', [
      kart(
        'Araştırma süreci',
        'Soru sorulur, veri toplanır, düzenlenir, çözümlenir ve yorumlanır. Sonuç, sorulan soruya dönmelidir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Soru' },
            { ad: 'Veri' },
            { ad: 'Çözümleme' },
            { ad: 'Yorum' },
          ],
        },
      ),
      kart(
        'Nicel ve nitel veri',
        'Nicel veri sayıyla ölçülür (boy, süre); nitel veri kategoriyle belirtilir (renk, cinsiyet).',
      ),
      kart(
        'Kesikli ve sürekli',
        'Kesikli veri sayılabilir (kardeş sayısı), sürekli veri ölçülür ve arada her değeri alabilir (boy).',
      ),
      kart(
        'Merkezî eğilim ölçüleri',
        'Aritmetik ortalama, ortanca (medyan) ve tepe değer (mod). Üçü de "veri nereye yığılmış" sorusuna cevap verir.',
      ),
      kart(
        'Ortalama mı ortanca mı?',
        'Aşırı uç değerler varsa ortalama yanıltır; ortanca uçlardan etkilenmez.',
        {
          tur: 'tablo',
          basliklar: ['Veri', 'Ortalama', 'Ortanca'],
          satirlar: [
            ['2, 3, 4, 5, 6', '4', '4'],
            ['2, 3, 4, 5, 96', '22', '4'],
          ],
        },
      ),
      kart(
        'Yayılım ölçüleri',
        'Açıklık, çeyrekler açıklığı ve standart sapma. Verinin ne kadar dağıldığını söyler.',
      ),
      kart(
        'Standart sapma',
        'Değerlerin ortalamadan ortalama uzaklığı. Küçükse veri ortalamaya yakın toplanmış, büyükse dağılmış demektir.',
      ),
      kart(
        'Grafikler',
        'Histogram dağılımın şeklini, kutu grafiği ortanca ile uç değerleri, nokta grafiği tek tek veriyi gösterir.',
      ),
      kart(
        'Dağılımın şekli',
        'Simetrik dağılımda ortalama ile ortanca yakındır; sağa çarpık dağılımda ortalama ortancadan büyük olur.',
      ),
    ]),
    konu('mat9-dagilim-inceleme', 'Başkalarının Oluşturduğu Veri Dağılımlarını İnceleme', [
      kart(
        'Neye bakılır?',
        'Eksen aralıkları, örneklem büyüklüğü, veri kaynağı ve grafiğin türü. Başlık okunmadan grafik yorumlanmaz.',
      ),
      kart(
        'Kesik eksen',
        'Y ekseni sıfırdan başlamıyorsa küçük farklar büyük görünür. En sık kullanılan yanıltma budur.',
      ),
      kart(
        'Ölçek oyunu',
        'Aynı veri, eksen aralığı değiştirilerek hem "sert artış" hem "durgunluk" gibi çizilebilir.',
      ),
      kart(
        'Örneklem önemli',
        'Az sayıda ya da taraflı seçilmiş örneklem, doğru hesaplansa bile yanlış sonuç verir.',
      ),
      kart(
        'Kim topladı?',
        'Veriyi toplayanın sonuçtan çıkarı varsa soru soruluş biçiminden örneklem seçimine kadar her adım eğilebilir.',
      ),
      kart(
        'Korelasyon nedensellik değildir',
        'İki değişkenin birlikte artması, birinin ötekine sebep olduğunu göstermez; üçüncü bir sebep ikisini birden etkiliyor olabilir.',
      ),
      kart(
        'Eksik bilgi',
        'Yüzde verilip toplam sayı yazılmıyorsa "%50 arttı" cümlesi iki kişiden üç kişiye çıkmayı da anlatıyor olabilir.',
      ),
    ]),
  ]),
  tema('mat9-t7', 'Veriden Olasılığa', [
    konu('mat9-deneysel', 'Deneysel Olasılık', [
      kart(
        'Tanımı',
        'Gerçekleştirilen deneyde, istenen sonucun gözlenme sayısının toplam deneme sayısına oranı.',
      ),
      kart(
        'Deney, sonuç, olay',
        'Deney tekrarlanabilen işlemdir, sonuç tek bir çıktıdır, olay ise sonuçlardan oluşan bir kümedir.',
      ),
      kart(
        'Deneme sayısı önemli',
        'Deneme arttıkça deneysel olasılık teorik olasılığa yaklaşır. Az denemede sapma büyük olur.',
      ),
      kart(
        'Büyük sayılar',
        'Bir parayı 10 kez atınca 7 tura gelebilir; 10.000 kez atınca oran 1/2’ye yaklaşır.',
      ),
      kart(
        'Neden gerekli?',
        'Teorik olasılığı hesaplanamayan durumlarda (bozuk zar, hava durumu, raptiye) tek yol gözlemdir.',
      ),
      kart(
        'Sıklık tablosu',
        'Deneme sonuçları sıklık tablosuna işlenir; oranlar buradan hesaplanır ve göreli sıklık olasılığı verir.',
      ),
      kart(
        'İkisi arasındaki fark',
        'Teorik olasılık hesaplanır, deneysel olasılık ölçülür. Aynı deneyde ikisi genelde birbirine yakın ama eşit değildir.',
      ),
    ]),
    konu('mat9-teorik', 'Teorik Olasılık', [
      kart(
        'Tanımı',
        'İstenen durum sayısının, tüm olası durum sayısına oranı. Sonuçların eşit olasılıklı olması gerekir.',
      ),
      kart(
        'Örnek uzay',
        'Tüm olası sonuçların kümesi. Bir zarda örnek uzay {1,2,3,4,5,6}, eleman sayısı 6’dır.',
      ),
      kart(
        'Değer aralığı',
        'Olasılık 0 ile 1 arasındadır. 0 imkânsız, 1 kesin olayı gösterir; 1’den büyük bir olasılık hesap hatasıdır.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 1],
          isaretler: [0, 1],
          parcalar: [{ bas: 0, bit: 1, kapaliBas: true, kapaliBit: true }],
          noktalar: [{ deger: 0.5, ad: 'eşit şans' }],
        },
      ),
      kart(
        'Zar örneği',
        'Bir zarda istenen sonuçların sayısı, olasılığı doğrudan belirler.',
        {
          tur: 'tablo',
          basliklar: ['Olay', 'Durum', 'Olasılık'],
          satirlar: [
            ['6 gelmesi', '1', '1/6'],
            ['Çift gelmesi', '3', '1/2'],
            ['4’ten büyük', '2', '1/3'],
          ],
        },
      ),
      kart(
        'Tümleyen olay',
        'Bir olayın olmama olasılığı, 1’den olma olasılığının çıkarılmasıdır. "En az bir" sorularında bu yol kısaltır.',
      ),
      kart(
        'Ayrık olaylar',
        'Aynı anda gerçekleşemeyen iki olay ayrıktır ve birinin ya da ötekinin olma olasılığı, olasılıklarının toplamıdır.',
      ),
      kart(
        'Bağımsız olaylar',
        'Biri ötekini etkilemiyorsa ikisinin birlikte olma olasılığı, olasılıkların çarpımıdır: iki kez tura 1/2 · 1/2 = 1/4.',
      ),
      kart(
        'Yaygın yanılgı',
        'Yazı gelen bir paranın sonraki atışta tura gelme olasılığı yine 1/2’dir; para geçmişi hatırlamaz.',
      ),
    ]),
  ]),
])
