import { kart, konu, program, soru, tema } from '../tip'

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
        'Farklı taban, aynı üs',
        'aⁿ·bⁿ = (ab)ⁿ. 2⁵·5⁵ = 10⁵. Tabanlar farklı, üsler farklıysa hiçbir kural yok; önce sayıya çevir.',
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
    ], [
      soru('2⁻³ ifadesinin değeri −8 tir.', false, 'Negatif üs sayıyı negatif yapmaz, ters çevirir: 2⁻³ = 1/2³ = 1/8.'),
      soru('(2³)² ile 2³ · 2² aynı sonucu verir.', false, 'Üssün üssünde üsler çarpılır (2⁶ = 64), aynı tabanda çarpmada toplanır (2⁵ = 32).'),
      soru('0,0032 sayısının bilimsel gösterimi 3,2 · 10⁻³ tür.', true, 'Virgül üç basamak sağa kaydı, yani üs −3 oldu; baştaki sayı 1 ile 10 arasında.'),
      soru('√2 + √3 = √5 tir.', false, 'Kökler çarpma ve bölmede birleşir, toplamada birleşmez.'),
    ], [
      {
        soru: '(2³)² ifadesinin değeri kaçtır?',
        siklar: ['32', '64'],
        dogru: 1,
        aciklama: {
          dogru: 'Üssün üssünde üsler çarpılır: 2⁶ = 64.',
          yanlis: '32 = 2⁵, yani 2³·2² olurdu. Üssün üssü üsleri toplamaz, çarpar: 2⁶ = 64.',
        },
        kart: 4,
      },
      {
        soru: '√2 + √3 toplamı neye eşittir?',
        siklar: ['√5', 'Sadeleşmez, öyle kalır'],
        dogru: 1,
        aciklama: {
          dogru: 'Kökler çarpılırken birleşir, toplanırken birleşmez.',
          yanlis: '√5 yalnızca çarpımda çıkardı: √2·√3 = √6. Toplamda kökler birleşmez; √2 + √3 ≈ 3,15 iken √5 ≈ 2,24.',
        },
        kart: 9,
      },
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
    ], [
      soru(
        'Çizimdeki aralık [2, 5) biçiminde yazılır.',
        true,
        'Dolu uç sayının dâhil, boş uç hariç olduğunu gösteriyor.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 7],
          isaretler: [0, 1, 2, 3, 4, 5, 6, 7],
          parcalar: [{ bas: 2, bit: 5, kapaliBas: true, kapaliBit: false }],
        },
      ),
      soru('(3, 7) aralığında 3 sayısı da vardır.', false, 'Parantez ucu açık: 3 aralığa dâhil değil, 3 ten büyük sayılar dâhil.'),
      soru('Sonsuz uçlu aralıklar her zaman parantezle yazılır: (−∞, 4].', true, 'Sonsuz bir sayı değil bir yön; dâhil edilecek bir uç olmadığı için kapalı yazılamaz.'),
      soru('Boş küme yalnızca kendisinin alt kümesidir.', false, 'Boş küme her kümenin alt kümesidir.'),
    ], [
      {
        soru: '[2, 5) aralığında 5 dâhil midir?',
        siklar: ['Evet, aralığın ucu', 'Hayır, normal parantez'],
        dogru: 1,
        aciklama: {
          dogru: 'Köşeli parantez içerir, normal parantez içermez; 2 dâhil, 5 hariç.',
          yanlis: 'Uç nokta olmak dâhil olmak demek değil. 5\'in yanındaki normal parantez onu dışarıda bırakır.',
        },
        kart: 4,
      },
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
    ], [
      soru(
        'Her tam sayı aynı zamanda bir rasyonel sayıdır.',
        true,
        'Tam sayı a, a/1 biçiminde yazılabiliyor; kümeler iç içe duruyor.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'ℝ gerçek' },
            { ad: 'ℚ rasyonel' },
            { ad: 'ℤ tam' },
            { ad: 'ℕ doğal' },
          ],
        },
      ),
      soru('√2 rasyonel bir sayıdır.', false, 'Ondalık açılımı ne bitiyor ne de devirli tekrar ediyor; irrasyonel.'),
      soru('Çıkarma işleminin değişme özelliği vardır.', false, '5 − 3 ile 3 − 5 aynı değil; değişme özelliği toplama ve çarpmada var.'),
      soru('Doğal sayılar kümesi çıkarma işlemine göre kapalı değildir.', true, '3 − 5 = −2 doğal sayı değil; sonuç kümenin dışına çıkıyor.'),
    ], [
      {
        soru: '0,333… (devirli) sayısı hangi kümeye girer?',
        siklar: ['İrrasyonel', 'Rasyonel'],
        dogru: 1,
        aciklama: {
          dogru: 'Devirli ondalık 1/3 kesri olarak yazılır; kesir yazılabiliyorsa rasyonel.',
          yanlis: 'İrrasyonelin açılımı sonsuz ve devirsizdir (π, √2). Devirli 0,333… = 1/3, yani rasyonel.',
        },
        kart: 5,
      },
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
    ], [
      soru('3x ile 3x² benzer terimdir.', false, 'Benzer terimlerde değişkenler ve üsleri aynı olmalı; burada üsler farklı.'),
      soru('2(x + 5) = 2x + 10 dur.', true, 'Dağılma özelliği çarpanı parantezdeki iki terime de dağıtıyor.'),
      soru('Bir genellemenin yanlış olduğunu göstermek için tek bir karşı örnek yeter.', true, 'Kural her sayı için geçerli olmalı; tutmadığı tek bir örnek onu çürütüyor.'),
      soru('5x ifadesinde 5 değişken, x katsayıdır.', false, 'Tersi: 5 katsayı, x değişken.'),
    ], [
      {
        soru: '3x + 5x² ifadesi sadeleşir mi?',
        siklar: ['Hayır, dereceleri farklı', 'Evet, 8x³'],
        dogru: 0,
        aciklama: {
          dogru: 'Benzer terim için değişken ve derece aynı olmalı; x ile x² farklı.',
          yanlis: 'Toplamada üsler toplanmaz. x ve x² benzer terim değil; ifade olduğu gibi kalır.',
        },
        kart: 3,
      },
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
        'İki noktadan eğim',
        'Eğim = (y₂ − y₁) / (x₂ − x₁). (1, 3) ve (3, 7) noktalarından geçen doğrunun eğimi 4/2 = 2.',
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
    ], [
      soru(
        'Grafiği çizilen bağıntı bir fonksiyondur.',
        false,
        'Dikey doğru testi kalıyor: bir x değerine iki y düşüyor, yani bu bir fonksiyon değil.',
        {
          tur: 'koordinat',
          pencere: [-1, 5, -3, 3],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [4, -2],
                [2.25, -1.5],
                [1, -1],
                [0.25, -0.5],
                [0, 0],
                [0.25, 0.5],
                [1, 1],
                [2.25, 1.5],
                [4, 2],
              ],
            },
          ],
        },
      ),
      soru(
        'Grafiği çizilen fonksiyon azalandır.',
        true,
        'Eğim negatif: x büyüdükçe y küçülüyor, doğru soldan sağa iniyor.',
        {
          tur: 'koordinat',
          pencere: [-2, 4, -4, 6],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [-1, 5],
                [3, -3],
              ],
              kirik: true,
              ad: 'f(x) = −2x + 3',
            },
          ],
        },
      ),
      soru('f(x) = ax + b fonksiyonunda b sayısı doğrunun eğimidir.', false, 'b, doğrunun y eksenini kestiği değer; eğim a.'),
      soru('Sabit fonksiyonun grafiği x eksenine paralel bir doğrudur.', true, 'Her x için aynı değer üretiliyor, yani grafik yatay bir doğru.'),
    ], [
      {
        soru: 'f(x) = −3x + 2 fonksiyonu nasıldır?',
        siklar: ['Artan', 'Azalan'],
        dogru: 1,
        aciklama: {
          dogru: 'Eğim negatif; x arttıkça y düşer.',
          yanlis: 'Artan için a > 0 gerekir. Buradaki eğim −3, yani x arttıkça y azalır: azalan.',
        },
        kart: 6,
      },
      {
        soru: 'f(x) = 8x + 25 taksi ücretinde 25 neyi gösterir?',
        siklar: ['Km başına ücret (a)', 'Açılış ücreti (b)'],
        dogru: 1,
        aciklama: {
          dogru: 'x = 0 iken ödenen 25; b, y eksenini kestiği başlangıç değeri.',
          yanlis: 'Km başına artış eğim, yani 8. Sabit terim 25 hiç yol gitmeden ödenen açılış ücreti.',
        },
        kart: 10,
      },
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
    ], [
      soru(
        'Grafiği çizilen fonksiyon hiçbir zaman negatif değer almaz.',
        true,
        'Mutlak değer bir uzaklık; en küçük değeri 0 ve grafik x ekseninin altına inmiyor.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -1, 4],
          xAd: 'x',
          yAd: 'y',
          egriler: [
            {
              noktalar: [
                [-3, 3],
                [0, 0],
                [3, 3],
              ],
              kirik: true,
              ad: 'y = |x|',
            },
          ],
        },
      ),
      soru('|x| = −5 denkleminin iki çözümü vardır.', false, 'Mutlak değer negatif olamaz; denklemin hiç çözümü yok.'),
      soru(
        'Çizimdeki çözüm kümesi |x| < 3 eşitsizliğine aittir.',
        true,
        'Mutlak değeri 3 ten küçük sayılar, sıfıra 3 birimden yakın olanlar.',
        {
          tur: 'sayiDogrusu',
          aralik: [-5, 5],
          isaretler: [-5, -3, 0, 3, 5],
          parcalar: [{ bas: -3, bit: 3, kapaliBas: false, kapaliBit: false }],
        },
      ),
      soru('|x| > 2 eşitsizliğinin çözümü tek bir aralıktır.', false, 'Çözüm iki ayrı aralık: x < −2 veya x > 2.'),
    ], [
      {
        soru: '|x| > 3 eşitsizliğinin çözümü nedir?',
        siklar: ['−3 < x < 3', 'x < −3 veya x > 3'],
        dogru: 1,
        aciklama: {
          dogru: 'Sıfıra uzaklığı 3\'ten büyük sayılar iki tarafta, ayrı iki parça.',
          yanlis: '−3 < x < 3 çözümü |x| < 3\'ün. Büyüktür eşitsizliği dışarıya açılır: iki ayrı parça.',
        },
        kart: 7,
      },
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
    ], [
      soru('Bir eşitsizliğin iki tarafı negatif bir sayıyla çarpılırsa eşitsizliğin yönü değişir.', true, 'Negatifle çarpmak sıralamayı ters çeviriyor: 2 < 3 iken −2 > −3.'),
      soru('3x + 5 = 3x + 5 denkleminin çözümü yoktur.', false, 'İki taraf birebir aynı; her gerçek sayı çözüm, yani sonsuz çözüm var.'),
      soru('Kişi sayısı için kurulan bir denklemin çözümü 4,5 çıkarsa sonuç kabul edilir.', false, 'Kişi sayısı tam sayı olmalı; anlam kontrolü kurulan denklemin hatalı olduğunu söylüyor.'),
      soru('Yüzde 20 indirimden sonra yüzde 20 zam yapılırsa ilk fiyata dönülür.', false, 'Zam küçülmüş fiyat üzerinden alınıyor: 100 → 80 → 96.'),
      soru('x/3 = 4/6 orantısında x = 2 dir.', true, 'İçler dışlar çarpımı: 6x = 12, yani x = 2.'),
    ], [
      {
        soru: '−2x < 6 eşitsizliğinin çözümü?',
        siklar: ['x > −3', 'x < −3'],
        dogru: 0,
        aciklama: {
          dogru: 'Negatifle bölünce yön değişir.',
          yanlis: 'İki taraf −2\'ye bölünürken eşitsizlik yön değiştirir: x > −3. Kontrol: x = 0 için −0 < 6 doğru.',
        },
        kart: 3,
      },
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
        'Kenar sorusu kalıbı',
        'Kenarları 4 ve 9 olan üçgende üçüncü kenar 5 < c < 13; tam sayı ise 6\'dan 12\'ye 7 değer. Uçlar alınmaz.',
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
    ], [
      soru('Kenar uzunlukları 3, 4 ve 8 olan bir üçgen çizilebilir.', false, 'Üçgen eşitsizliği tutmuyor: 3 + 4 = 7 < 8, iki kenar üçüncüyü kapatamıyor.'),
      soru('Bir üçgende en büyük açının karşısında en uzun kenar bulunur.', true, 'Kenar ile karşısındaki açı aynı sırayı izliyor.'),
      soru(
        'Şekildeki üçgende üçüncü açı 70° dir.',
        true,
        'İç açılar toplamı 180°: 180 − 50 − 60 = 70.',
        {
          tur: 'koordinat',
          pencere: [-0.5, 4.5, -0.8, 3.2],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 0],
                [1.5, 2.5],
              ],
              kapali: true,
              kirik: true,
            },
          ],
          etiketler: [
            { x: 0.55, y: 0.3, ad: '50°' },
            { x: 3.3, y: 0.3, ad: '60°' },
            { x: 1.5, y: 1.9, ad: '?' },
          ],
        },
      ),
      soru('Eşkenar üçgende yükseklik, kenarortay ve açıortay farklı doğrulardır.', false, 'Eşkenar üçgende her köşe için üçü de aynı doğru.'),
    ], [
      {
        soru: 'Kenarları 4 ve 9 olan üçgenin üçüncü kenarı hangi aralıktadır?',
        siklar: ['4 < c < 9', '5 < c < 13'],
        dogru: 1,
        aciklama: {
          dogru: '|9 − 4| < c < 9 + 4.',
          yanlis: 'Aralık iki kenarın kendisi değil, farkı ile toplamı arasında: 5 ile 13, uçlar hariç.',
        },
        kart: 5,
      },
      {
        soru: 'Ağırlık merkezi kenarortayı hangi oranda böler?',
        siklar: ['Tam ortadan', 'Köşeden 2, kenardan 1'],
        dogru: 1,
        aciklama: {
          dogru: 'Köşeye yakın parça uzun: 2/1.',
          yanlis: 'Ortadan bölmez. Köşeden itibaren 2 birim, kenara doğru 1 birim: 2/1.',
        },
        kart: 10,
      },
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
    ], [
      soru('Öteleme şeklin boyutunu ve açılarını değiştirmez.', true, 'Şekil yalnızca yer değiştiriyor; öteleme bir eşlik dönüşümü.'),
      soru('(x, y) noktasının y eksenine göre yansıması (x, −y) olur.', false, 'y eksenine göre yansımada x işaret değiştirir: (−x, y).'),
      soru('Benzerlik dönüşümü açıları korur, kenar uzunluklarını aynı oranda değiştirir.', true, 'Şeklin biçimi aynı kalıyor, yalnızca ölçeği değişiyor.'),
      soru('Karenin simetri ekseni sayısı ikidir.', false, 'Karede dört simetri ekseni var: iki köşegen ve karşılıklı kenarların orta dikmeleri.'),
    ], [
      {
        soru: 'Hangi dönüşüm uzunlukları korumaz?',
        siklar: ['Yansıma', 'Ölçekleme (homoteti)'],
        dogru: 1,
        aciklama: {
          dogru: 'Ölçekleme boyutu değiştirir, açıları korur; sonuç benzer şekil.',
          yanlis: 'Yansıma eşlik dönüşümü, bütün ölçüleri korur. Boyutu değiştiren ölçekleme.',
        },
        kart: 6,
      },
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
    ], [
      soru('İki üçgenin üç açısı da eşitse bu üçgenler eştir.', false, 'AAA eşlik değil benzerlik verir; aynı biçimde ama farklı büyüklükte olabilirler.'),
      soru('Eşlik, benzerlik oranı 1 olan özel bir benzerliktir.', true, 'Eş şekiller hem aynı biçimde hem aynı büyüklükte.'),
      soru('KKK, KAK ve AKA birer eşlik koşuludur.', true, 'Üçü de üçgeni tek bir biçimde belirliyor.'),
      soru('ABC ≅ DEF yazılışında A köşesi F köşesine karşılık gelir.', false, 'Yazım sırası eşleşmeyi veriyor: A ile D, B ile E, C ile F karşılıklı.'),
    ], [
      {
        soru: 'Üç açısı eşit iki üçgen için ne söylenir?',
        siklar: ['Benzerdir, eş olmayabilir', 'Kesinlikle eştir'],
        dogru: 0,
        aciklama: {
          dogru: 'AAA biçimi verir, boyu vermez; eşlik için bir kenar da gerekir.',
          yanlis: 'Aynı açılara sahip küçük ve büyük iki üçgen çizilebilir. AAA benzerlik koşulu, eşlik koşulu değil.',
        },
        kart: 3,
      },
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
    ], [
      soru(
        'Şekilde DE ∥ BC ise ADE üçgeni ABC üçgenine benzerdir.',
        true,
        'Paralellik ortak açıların yanına iki eş açı daha koyuyor; temel benzerlik teoremi.',
        {
          tur: 'koordinat',
          pencere: [-0.6, 6.6, -0.8, 4.6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [6, 0],
                [2, 4],
              ],
              kapali: true,
              kirik: true,
            },
            {
              noktalar: [
                [1, 2],
                [4, 2],
              ],
              kirik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2, y: 4.35, ad: 'A' },
            { x: -0.3, y: -0.35, ad: 'B' },
            { x: 6.1, y: -0.35, ad: 'C' },
            { x: 0.6, y: 2.1, ad: 'D' },
            { x: 4.4, y: 2.1, ad: 'E' },
          ],
        },
      ),
      soru('Benzerlik oranı 2 olan iki üçgenin alanları oranı da 2 dir.', false, 'Alan oranı benzerlik oranının karesi, yani 4.'),
      soru('Benzer üçgenlerde çevrelerin oranı benzerlik oranına eşittir.', true, 'Çevre kenarların toplamı ve her kenar aynı oranla büyüyor.'),
      soru('Kelebek benzerliğinde üçgenler ters yönde durduğu için benzer olamazlar.', false, 'Ters dönmüş olmak benzerliği bozmaz; ters açılar ve paralellik eşit açılar veriyor.'),
    ], [
      {
        soru: 'Benzerlik oranı 1/3 olan iki üçgenin alanları oranı?',
        siklar: ['1/3', '1/9'],
        dogru: 1,
        aciklama: {
          dogru: 'Alan oranı benzerlik oranının karesi.',
          yanlis: '1/3 uzunluk ve çevre oranı. Alan iki boyutlu, oran karesi: 1/9.',
        },
        kart: 4,
      },
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
    ], [
      soru('Pisagor teoremi her üçgende geçerlidir.', false, 'Yalnızca dik üçgende: dik kenarların kareleri toplamı hipotenüsün karesine eşit.'),
      soru(
        'Şekildeki dik üçgende hipotenüs 5 birimdir.',
        true,
        'Pisagor: 3² + 4² = 25, karekökü 5.',
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
            { x: 2, y: -0.4, ad: '4' },
            { x: -0.45, y: 1.5, ad: '3' },
            { x: 2.4, y: 1.9, ad: '?' },
          ],
        },
      ),
      soru('Kenarları a² + b² = c² şartını sağlayan üçgen dik üçgendir.', true, 'Teoremin tersi de doğru: bağıntı sağlanıyorsa c kenarını gören açı 90°.'),
      soru('Öklid bağıntıları dik olmayan üçgenlerde de kullanılır.', false, 'Öklid bağıntıları dik üçgende, hipotenüse indirilen yükseklikle kuruluyor.'),
    ], [
      {
        soru: 'Dik kenarları 6 ve 8 olan dik üçgenin hipotenüsü?',
        siklar: ['14', '10'],
        dogru: 1,
        aciklama: {
          dogru: '(3,4,5)\'in iki katı; 36 + 64 = 100.',
          yanlis: 'Kenarlar toplanmaz. Pisagor: 6² + 8² = 100, karekökü 10.',
        },
        kart: 4,
      },
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
    ], [
      soru('Benzer iki cismin hacimleri oranı benzerlik oranının küpüdür.', true, 'Üç boyut da aynı oranda büyüyor.'),
      soru('1/500 ölçekli haritada 3 cm olan yol gerçekte 1500 m dir.', false, '3 × 500 = 1500 cm, yani 15 m.'),
      soru('Boyu 1,8 m olan kişinin gölgesi 1,2 m iken 4 m gölgesi olan ağaç 6 m dir.', true, 'Aynı anda oran sabit: 1,8/1,2 = 1,5 ve 4 × 1,5 = 6.'),
      soru('Benzerlik oranı kurulurken hangi kenarın hangisiyle eşleştiği önemli değildir.', false, 'Oran yalnızca karşılıklı kenarlar arasında kurulur; en sık hata burada yapılıyor.'),
    ], [
      {
        soru: 'Ölçeği iki katına çıkan bir maketin hacmi kaç katına çıkar?',
        siklar: ['2', '8'],
        dogru: 1,
        aciklama: {
          dogru: 'Hacim üç boyutlu: 2³ = 8.',
          yanlis: '2 kat uzunluk oranı. Alan 4, hacim 8 katına çıkar.',
        },
        kart: 5,
      },
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
    ], [
      soru('Akış şemasında karar noktası dikdörtgenle gösterilir.', false, 'Karar noktası eşkenar dörtgenle çizilir; dikdörtgen işlem adımı.'),
      soru('Algoritmanın adımları belirsiz olabilir, önemli olan sonuca ulaşmaktır.', false, 'Her adım açık ve tek anlamlı olmalı; belirsiz adım algoritma değil.'),
      soru(
        'Her algoritmada girdi, işlem ve çıktı sırası vardır.',
        true,
        'Veri alınır, üzerinde işlem yapılır, sonuç verilir.',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Girdi' }, { ad: 'İşlem' }, { ad: 'Çıktı' }],
        },
      ),
      soru('Çıkış koşulu hiçbir zaman sağlanmayan bir döngü sonsuza kadar çalışır.', true, 'Döngüyü bitiren şey koşulun bozulması; koşulu değiştiren adım yoksa döngü hiç bitmez.'),
    ], [
      {
        soru: 'Akış şemasında karar (koşul) hangi şekille gösterilir?',
        siklar: ['Eşkenar dörtgen', 'Dikdörtgen'],
        dogru: 0,
        aciklama: {
          dogru: 'Dikdörtgen işlem, eşkenar dörtgen karar.',
          yanlis: 'Dikdörtgen işlem adımı. Doğru/yanlış diye iki çıkışı olan karar eşkenar dörtgenle çizilir.',
        },
        kart: 4,
      },
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
    ], [
      soru('"Bu çiçek çok güzel." cümlesi bir önermedir.', false, 'Önerme doğru ya da yanlış olduğu kesin söylenebilen cümledir; bu bir görüş.'),
      soru(
        'p ∧ q önermesi, ikisinden biri doğruysa doğru olur.',
        false,
        'Tablodaki ikinci ve üçüncü satır bunu çürütüyor: "ve" iki şartı birden istiyor.',
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
      soru('p ∨ q önermesi ikisi de doğru olduğunda yanlıştır.', false, '"veya" en az biri doğruysa doğrudur; ikisi de doğruyken de doğru.'),
      soru('Bir koşullu önerme ile karşıt tersinin doğruluk değerleri her zaman aynıdır.', true, 'p → q ile ¬q → ¬p denk önermeler.'),
    ], [
      {
        soru: 'p ⇒ q önermesi hangi durumda yanlıştır?',
        siklar: ['p yanlış, q doğru', 'p doğru, q yanlış'],
        dogru: 1,
        aciklama: {
          dogru: 'Tek yanlış durum bu; öteki üç durumda doğru.',
          yanlis: 'p yanlışken koşullu önerme her zaman doğrudur. Yanlış olan tek durum: p doğru, q yanlış.',
        },
        kart: 6,
      },
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
    ], [
      soru('"not ≥ 50 ise geçti" koşulunun olumsuzu "not < 50" dir.', true, '≥ nin olumsuzu <; sınır değeri karşı tarafa geçiyor.'),
      soru('"ve" ile bağlanan bir koşulda tek şartın sağlanması yeterlidir.', false, '"ve" iki şartı da ister; biri yetiyorsa bağlaç "veya" olmalı.'),
      soru('İç içe koşullarda dıştaki koşul sağlanmazsa içteki hiç denenmez.', true, 'İçteki koşula ancak dıştaki doğruysa geliniyor.'),
      soru('Bir döngünün koşulunda geçen değer, döngü gövdesinde asla değişmemelidir.', false, 'Değişmezse koşul hep aynı kalır ve döngü hiç bitmez.'),
    ], [
      {
        soru: 'Döngü koşulu hiç yanlış olmazsa ne olur?',
        siklar: ['Sonsuz döngü', 'Döngü hiç çalışmaz'],
        dogru: 0,
        aciklama: {
          dogru: 'Döngü koşul doğru kaldıkça tekrarlanır; bitmez.',
          yanlis: 'Hiç çalışmaması koşulun baştan yanlış olmasıyla olur. Hiç yanlış olmayan koşul döngüyü sonsuza sürer.',
        },
        kart: 4,
      },
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
    ], [
      soru('Bir sınıftaki öğrencilerin göz rengi nicel bir veridir.', false, 'Göz rengi ölçülüp sayılamaz; nitel veri.'),
      soru('Aşırı uç değer bulunan bir veride ortanca, ortalamadan daha güvenilir bir merkez ölçüsüdür.', true, 'Tek bir büyük değer ortalamayı çeker, ortancayı yerinden oynatmaz.'),
      soru('Standart sapma büyükse veriler ortalamanın etrafında sıkışmıştır.', false, 'Tersi: standart sapma büyüdükçe veriler ortalamadan uzağa yayılır.'),
      soru('Bir sınıftaki öğrenci sayısı kesikli bir değişkendir.', true, 'Sayılabilir ve arada değer almıyor; 24 ile 25 arasında öğrenci sayısı yok.'),
    ], [
      {
        soru: 'Veride aşırı uç değerler varsa hangi ölçü daha güvenilirdir?',
        siklar: ['Aritmetik ortalama', 'Ortanca'],
        dogru: 1,
        aciklama: {
          dogru: 'Ortanca sıralamanın ortası; uçlar onu kaydırmaz.',
          yanlis: 'Ortalama uç değerle sürüklenir: 5 kişilik maaş listesine bir milyoner girince ortalama patlar, ortanca yerinde kalır.',
        },
        kart: 5,
      },
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
    ], [
      soru('Düşey ekseni sıfırdan başlamayan bir sütun grafiği farkları olduğundan büyük gösterir.', true, 'Kesik eksen sütunların oranını bozuyor; iki katı gibi görünen fark aslında küçük olabilir.'),
      soru('İki değişken birlikte artıyorsa biri diğerinin sebebidir.', false, 'Birlikte değişmek nedensellik değil; ikisini birden etkileyen üçüncü bir sebep olabilir.'),
      soru('Verinin kimin tarafından toplandığı sonucun güvenilirliğini etkilemez.', false, 'Sonuçtan çıkarı olan birinin topladığı veri taraflı olabilir.'),
      soru('Yalnızca kendi sınıfında yapılan bir anket bütün okul hakkında sonuç vermez.', true, 'Örneklem okulun tamamını temsil etmiyor.'),
    ], [
      {
        soru: 'Y ekseni sıfırdan başlamayan grafik ne yapar?',
        siklar: ['Veriyi daha doğru gösterir', 'Küçük farkları büyük gösterir'],
        dogru: 1,
        aciklama: {
          dogru: 'En sık kullanılan yanıltma; %2 fark iki kat gibi görünür.',
          yanlis: 'Kesik eksen doğruluk katmaz, oranı bozar. Küçük farklar büyük görünür.',
        },
        kart: 2,
      },
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
    ], [
      soru('Deneysel olasılık, gözlenen sıklığın toplam deneme sayısına bölümüdür.', true, 'Hesap yapılan deneyden çıkıyor, kuramdan değil.'),
      soru('Deneme sayısı arttıkça deneysel olasılık teorik olasılıktan uzaklaşır.', false, 'Tersi olur: deneme arttıkça deneysel olasılık teoriğe yaklaşır.'),
      soru('Hileli olabileceğinden şüphelenilen bir zar yalnızca teorik olasılıkla incelenir.', false, 'Zarın gerçekten hileli olup olmadığı ancak atılarak, yani deneysel olasılıkla anlaşılır.'),
      soru('20 atışın 7 sinde tura gelen paranın deneysel tura olasılığı 0,35 tir.', true, '7/20 = 0,35.'),
    ], [
      {
        soru: 'Deneme sayısı arttıkça deneysel olasılık ne yapar?',
        siklar: ['Teorik olasılığa yaklaşır', 'Teorik olasılıktan uzaklaşır'],
        dogru: 0,
        aciklama: {
          dogru: 'Büyük sayılar: 10.000 atışta tura oranı 1/2\'ye yaklaşır.',
          yanlis: 'Az denemede sapma büyük, çok denemede küçük. Deneme arttıkça oran teorik değere yaklaşır.',
        },
        kart: 3,
      },
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
    ], [
      soru('Bir olayın olasılığı 1,5 olabilir.', false, 'Olasılık 0 ile 1 arasında; 1 kesin olan olayın değeri.'),
      soru('Bir zar atıldığında çift sayı gelme olasılığı 1/2 dir.', true, 'Altı sonuçtan üçü çift: 3/6 = 1/2.'),
      soru('Bir olayın tümleyeninin olasılığı 1 − P(A) dır.', true, 'Olay ya olur ya olmaz; ikisinin olasılığı toplamda 1.'),
      soru('Arka arkaya beş kez yazı gelen para altıncı atışta daha yüksek olasılıkla tura gelir.', false, 'Para önceki atışları hatırlamaz; her atışta tura olasılığı 1/2.'),
    ], [
      {
        soru: 'Üst üste iki kez tura gelme olasılığı?',
        siklar: ['1/4', '1/2'],
        dogru: 0,
        aciklama: {
          dogru: 'Bağımsız olaylar çarpılır: 1/2 · 1/2.',
          yanlis: '1/2 tek atışın olasılığı. İki bağımsız olayın birlikte olması için çarp: 1/4.',
        },
        kart: 7,
      },
    ]),
  ]),
])
