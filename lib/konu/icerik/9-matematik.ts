import { kart, konu, program, sikli, soru, tema } from '../tip'

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
        '**aⁿ**, a sayısının n kez kendisiyle çarpımıdır.\n- **a:** taban\n- **n:** üs\nÖrnek: 2⁵ = 2·2·2·2·2 = 32',
      ),
      kart(
        'Sıfırıncı ve negatif üs',
        '- **a⁰ = 1** (a ≠ 0)\n- **a⁻ⁿ = 1 / aⁿ**\nNegatif üs sayıyı negatif yapmaz, ters çevirir: 2⁻³ = 1/8',
      ),
      kart(
        'Aynı tabanda işlem',
        '- **Çarpmada** üsler toplanır: aᵐ · aⁿ = aᵐ⁺ⁿ\n- **Bölmede** üsler çıkarılır: aᵐ / aⁿ = aᵐ⁻ⁿ',
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
        '**(aᵐ)ⁿ = aᵐ·ⁿ**, üsler çarpılır.\n- (2³)² = 2⁶ = 64\n- 2³ · 2² = 2⁵ = 32\nİkisi sık karıştırılır.',
        undefined,
        { not: '2³·2² = 2⁵ = 32 (üsler toplanır), (2³)² = 2⁶ = 64 (üsler çarpılır). İkisini yan yana ezberle.' },
      ),
      kart(
        'Farklı taban, aynı üs',
        '**aⁿ · bⁿ = (a·b)ⁿ**\nÖrnek: 2⁵ · 5⁵ = 10⁵\nTaban da üs de farklıysa kural yok; önce sayıya çevir.',
      ),
      kart(
        'Bilimsel gösterim',
        'Sayı **a · 10ⁿ** biçiminde yazılır, 1 ≤ a < 10 olmalı.\n- 45.000 = 4,5 · 10⁴\n- 0,0032 = 3,2 · 10⁻³',
      ),
      kart(
        'Köklü ifade',
        '**ⁿ√a**, n. kuvveti a olan sayıdır.\nKarekökte n yazılmaz: √25 = 5',
      ),
      kart(
        'Kök ile üs aynı şey',
        'Köklü ifade kesirli üsle yazılır:\n- √a = a^(1/2)\n- ³√a² = a^(2/3)\nBütün üs kuralları köke de geçer.',
      ),
      kart(
        'Köklülerde işlem',
        '- **Çarpma:** √a · √b = √(ab)\n- **Bölme:** √a / √b = √(a/b)\nToplama böyle değil: √2 + √3 ≠ √5',
      ),
      kart(
        'Paydayı rasyonel yapma',
        'Paydadaki kök genişletmeyle yok edilir.\nPayda iki terimliyse **eşleniğiyle** çarpılır:\n1 / (√3 − 1) = (√3 + 1) / 2',
      ),
      kart(
        'Dikkat: √(a²) = |a|',
        'Karekökün sonucu negatif olamaz.\nBu yüzden değişkenli ifadelerde mutlak değer gerekir.',
      ),
    ], [
      soru('2⁻³ ifadesinin değeri −8 tir.', false, 'Negatif üs sayıyı negatif yapmaz, ters çevirir: 2⁻³ = 1/2³ = 1/8.'),
      soru('(2³)² ile 2³ · 2² aynı sonucu verir.', false, 'Üssün üssünde üsler çarpılır (2⁶ = 64), aynı tabanda çarpmada toplanır (2⁵ = 32).'),
      soru('0,0032 sayısının bilimsel gösterimi 3,2 · 10⁻³ tür.', true, 'Virgül üç basamak sağa kaydı, yani üs −3 oldu; baştaki sayı 1 ile 10 arasında.'),
      soru('√2 + √3 = √5 tir.', false, 'Kökler çarpma ve bölmede birleşir, toplamada birleşmez.'),
      sikli('5⁰ + 5⁻¹ kaçtır?', ['1/5', '6/5'], 1, '5⁰ = 1 ve 5⁻¹ = 1/5; toplam 6/5.'),
      sikli('(3²)³ · 3⁻⁴ ifadesinin değeri?', ['3', '9'], 1, 'Üssün üssü 3⁶; aynı tabanda çarpma 3⁶⁻⁴ = 3² = 9.'),
      sikli('720.000 sayısının bilimsel gösterimi?', ['72 · 10⁴', '7,2 · 10⁵'], 1, 'Baştaki sayı 1 ile 10 arasında olmalı: 7,2 ve virgül 5 basamak kaydı.'),
      sikli('³√a² ifadesi kesirli üsle nasıl yazılır?', ['a^(3/2)', 'a^(2/3)'], 1, 'Kökün derecesi paydaya.'),
      sikli('√(a²) neye eşittir?', ['|a|', 'a'], 0, 'Karekök negatif olamaz.'),
      sikli('2⁵ · 5⁵ kaçtır?', ['10⁵', '10¹⁰'], 0, 'Aynı üs, tabanlar çarpılır.'),
      sikli('1/(√3 − 1) paydası nasıl rasyonel yapılır?', ['Eşleniği (√3 + 1) ile çarparak', '√3 ile çarparak'], 0, 'İki terimli payda.'),
      soru('√2 · √3 = √6\'dır.', true, 'Çarpımda kökler birleşir.'),
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
        'Küme, iyi tanımlanmış nesneler topluluğudur.\n- **∈:** elemanıdır, 3 ∈ ℕ\n- **∉:** elemanı değildir, −2 ∉ ℕ',
      ),
      kart(
        'Alt küme ve boş küme',
        '- **A ⊆ B:** A’nın her elemanı B’de var.\n- **Boş küme (∅):** hiç elemanı yok.\nBoş küme her kümenin alt kümesidir.',
      ),
      kart(
        'Evrensel küme ve tümleyen',
        '- **Evrensel küme (E):** konuşulan bütün elemanlar\n- **Tümleyen (A′):** E’de olup A’da olmayanlar',
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
        '- **Köşeli parantez [ ]:** uç nokta dâhil\n- **Normal parantez ( ):** uç nokta hariç\nÖrnek: [2, 5) → 2 dâhil, 5 hariç',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 7],
          isaretler: [0, 2, 5, 7],
          parcalar: [{ bas: 2, bit: 5, kapaliBas: true, kapaliBit: false, ad: '[2, 5)' }],
        },
      ),
      kart(
        'Sayı doğrusunda',
        '- **Dolu nokta:** uç nokta dâhil\n- **Boş nokta:** uç nokta hariç\nÇizimde 2 dolu, 5 boştur.',
      ),
      kart(
        'Sonsuz uç',
        'Sonsuz bir sayı değildir, ulaşılan bir yer de değildir.\nBu yüzden yanına **her zaman normal parantez** konur.',
        {
          tur: 'sayiDogrusu',
          aralik: [-6, 6],
          isaretler: [-4, -2, 0, 3],
          parcalar: [{ bas: null, bit: 3, kapaliBit: true, ad: '(−∞, 3]' }],
        },
        { not: '[2, ∞) doğru, [2, ∞] yanlış. Sonsuzun yanına asla köşeli parantez koyma; şıkta ilk elenecek bu.' },
      ),
      kart(
        'Birleşim ve kesişim',
        '- **Birleşim (∪):** iki aralığın tamamı\n- **Kesişim (∩):** ortak kısım\nKesişim boş küme olabilir.',
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
        '- **Aralık:** yalnızca gerçek sayılarda, arada sonsuz eleman var.\n- **Liste:** tam sayılarda elemanlar yazılır, {2, 3, 4}',
      ),
      kart(
        'Alt küme sayısı',
        'n elemanlı bir kümenin **2ⁿ** alt kümesi vardır.\nBoş küme ve kümenin kendisi de bu sayıya dâhildir.\nÖrnek: {a, b} → ∅, {a}, {b}, {a, b}',
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
      sikli('x ≥ −1 koşulunu sağlayan sayılar hangi aralıkla yazılır?', ['(−1, ∞)', '[−1, ∞)'], 1, '−1 dâhil olduğu için köşeli parantez; sonsuzun yanı her zaman normal parantez.'),
      sikli('Sayı doğrusunda boş nokta ne demektir?', ['Uç dâhil', 'Uç dâhil değil'], 1, 'Dolu nokta dâhil.'),
      sikli('Tam sayılar için {2, 3, 4} yazılıp aralık yazılmamasının sebebi?', ['Tam sayılar sınırsız', 'Aralık gerçek sayılara özgü'], 1, 'Arada sonsuz eleman gerekir.'),
      sikli('İki aralığın ortak kısmına ne denir?', ['Birleşim', 'Kesişim'], 1, 'Boş küme olabilir.'),
      soru('A = {1, 2, 3} kümesinin 8 alt kümesi vardır.', true, '3 elemanlı kümenin alt küme sayısı 2³ = 8; ∅ ve A da dâhil.'),
      sikli('E = {1, 2, 3, 4, 5} ve A = {1, 2} ise A′ nedir?', ['{3, 4, 5}', '{1, 2}'], 0, 'Tümleyen, evrensel kümede olup A\'da olmayanlardır.'),
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
        '**ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ**\nİrrasyonel sayılar ℚ’nun dışında kalır ama ℝ’ye dâhildir.',
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
        '- **ℕ:** {0, 1, 2, …}\n- **ℤ:** doğal sayılar ve negatifleri\nSayma sayıları sıfırı içermez, doğal sayılar içerir.',
      ),
      kart(
        'Rasyonel sayı',
        '**a / b** biçiminde yazılabilen sayıdır (a, b tam sayı, b ≠ 0).\nHer tam sayı rasyoneldir: 5 = 5/1',
      ),
      kart(
        'İrrasyonel sayı',
        'Kesir olarak yazılamayan sayıdır: √2, π, e\nOndalık açılımı sonsuz ve devirsizdir.',
      ),
      kart(
        'Ondalık açılım ayırt eder',
        'Sayının rasyonel mi irrasyonel mi olduğu ondalık açılımından anlaşılır.\nSonlu ya da devirliyse rasyoneldir.',
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
        'Değişme, birleşme ve dağılma.\nDağılma, iki işlemi birbirine bağlayan tek özelliktir:\n**a(b + c) = ab + ac**',
      ),
      kart(
        'Etkisiz ve ters eleman',
        '- **Etkisiz:** toplamada 0, çarpmada 1\n- **Ters:** toplamada −a, çarpmada 1/a (a ≠ 0)',
      ),
      kart(
        'Çıkarma ve bölme',
        'Değişme özellikleri yoktur: 5 − 3 ≠ 3 − 5\nBu yüzden ayrı işlem sayılırlar.',
      ),
      kart(
        'Kapalılık',
        '- **ℕ çıkarmaya kapalı değil:** 3 − 5 = −2\n- **ℤ bölmeye kapalı değil:** 1 / 2 tam değil\nKüme genişledikçe kapalılık artar.',
        undefined,
        { not: 'Doğal sayılar çıkarmaya kapalı değil: 3 − 5 = −2 doğal değil. Tam sayılar bölmeye kapalı değil: 1/2.' },
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
      sikli('π sayısının ondalık açılımı nasıldır?', ['Sonsuz ve devirsiz', 'Devirli'], 0, 'π irrasyonel; ondalık açılımı ne biter ne de tekrar eder.'),
      sikli('Çarpmada etkisiz eleman?', ['1', '0'], 0, 'Toplamada 0.'),
      sikli('Tam sayılar hangi işleme göre kapalı değildir?', ['Bölme', 'Çarpma'], 0, '1 / 2 tam sayı değil; iki tam sayının çarpımı ise hep tam sayı.'),
      sikli('Sayma sayıları ile doğal sayıları ayıran?', ['Sıfır', 'Negatifler'], 0, 'Doğal sayılar sıfırı içerir.'),
      sikli('a(b + c) = ab + ac hangi özelliktir?', ['Birleşme', 'Dağılma'], 1, 'İki işlemi bağlayan tek özellik.'),
      soru('Toplamaya göre tersi −7 olan sayı 7\'dir.', true, 'Toplamaya göre ters eleman, toplamı etkisiz eleman 0 yapan sayıdır: 7 + (−7) = 0.'),
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
        'Harf, "her sayı için" demenin kısa yoludur.\na + b = b + a bir kural değil, sonsuz eşitliğin özetidir.',
      ),
      kart(
        'Terim, katsayı, değişken',
        '3x² + 5x − 2 ifadesinde:\n- **Terim:** 3x², 5x, −2\n- **Katsayı:** 3 ve 5\n- **Değişken:** x\n- **Sabit terim:** −2',
      ),
      kart(
        'Benzer terim',
        'Değişkeni ve derecesi aynı olan terimler toplanır.\n- 3x + 5x = 8x\n- 3x + 5x² sadeleşmez.',
      ),
      kart(
        'Dağılma özelliği',
        '**a(b + c) = ab + ac**\nParantezin önünde eksi varsa içerideki her terimin işareti değişir.',
      ),
      kart(
        'Ters yönde okumak',
        'Aynı eşitlik sağdan sola okununca ortak çarpan parantezine alma olur:\n6x + 9 = 3(2x + 3)',
      ),
      kart(
        'Genelleme yapmak',
        'Birkaç sayıda gözlenen örüntü harfle yazılır.\nBöylece bütün sayılar için geçerli bir iddiaya dönüşür.',
      ),
      kart(
        'Karşı örnek',
        '- **Çürütmek için:** tek bir karşı örnek yeter.\n- **Doğrulamak için:** ispat gerekir.',
        undefined,
        { not: '\'Her asal tektir\' iddiasını 2 tek başına çürütür. Çürütmek için bir sayı yeter, yüz örnek ispat etmez.' },
      ),
    ], [
      soru('3x ile 3x² benzer terimdir.', false, 'Benzer terimlerde değişkenler ve üsleri aynı olmalı; burada üsler farklı.'),
      soru('2(x + 5) = 2x + 10 dur.', true, 'Dağılma özelliği çarpanı parantezdeki iki terime de dağıtıyor.'),
      soru('Bir genellemenin yanlış olduğunu göstermek için tek bir karşı örnek yeter.', true, 'Kural her sayı için geçerli olmalı; tutmadığı tek bir örnek onu çürütüyor.'),
      soru('5x ifadesinde 5 değişken, x katsayıdır.', false, 'Tersi: 5 katsayı, x değişken.'),
      sikli('3x² + 5x − 2 ifadesinde sabit terim?', ['−2', '3'], 0, 'Değişkensiz terim.'),
      sikli('6x + 9 = 3(2x + 3) işlemi nedir?', ['Ortak çarpan parantezine alma', 'Dağılma'], 0, 'Dağılmanın ters yönü.'),
      sikli('"Her çift sayı 4\'e bölünür" iddiasını hangi sayı çürütür?', ['6', '8'], 0, '6 çift ama 4\'e bölünmüyor; tek karşı örnek iddiayı çürütür.'),
      soru('−(x − 3) = −x + 3\'tür.', true, 'Parantez önündeki eksi işaretleri değiştirir.'),
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
        'Her girdiye **tam olarak bir** çıktı eşleyen kuraldır.\nBir girdiye iki çıktı verilirse fonksiyon olmaz.',
      ),
      kart(
        'Dikey doğru testi',
        'Her dikey doğru grafiği **en çok bir** noktada kesiyorsa grafik bir fonksiyondur.',
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
        '- **Tanım kümesi:** girdilerin kümesi\n- **Görüntü kümesi:** çıkan değerlerin kümesi\nÖrnek: f(x) = 1/x, x = 0’da tanımlı değil.',
      ),
      kart(
        'Doğrusal fonksiyon',
        '**f(x) = ax + b**, grafiği bir doğrudur.\n- **a:** eğim\n- **b:** y eksenini kestiği değer',
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
        'x bir birim artınca y’nin ne kadar değiştiğidir.\na = 2 ise: sağa bir adımda yukarı iki adım.',
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
        { not: 'f(x) = 2x + 3: sağa 1 adım, yukarı 2 adım; y eksenini 3\'te keser. Eğim eksiyse sağa gidince aşağı iner.' },
      ),
      kart(
        'Artan mı azalan mı?',
        '- **a > 0:** artan\n- **a < 0:** azalan\n- **a = 0:** sabit, grafik yatay',
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
        '- **y eksenini:** b noktasında keser.\n- **x eksenini:** f(x) = 0 çözülerek bulunur.',
      ),
      kart(
        'İki noktadan eğim',
        '**Eğim = (y₂ − y₁) / (x₂ − x₁)**\n(1, 3) ve (3, 7) için: 4 / 2 = 2',
      ),
      kart(
        'Sabit fonksiyon',
        'f(x) = 3 her girdiye 3 verir.\n- Grafiği yatay, eğimi sıfır\n- x eksenini hiç kesmez',
      ),
      kart(
        'Gerçek hayatta',
        'Taksi ücreti: **f(x) = 8x + 25**\n- **25 (b):** açılış ücreti\n- **8 (a):** kilometre başına artış',
      ),
      kart(
        'Grafikten okumak',
        '- **Dikliği:** eğimin büyüklüğü\n- **Yönü:** artan mı azalan mı\n- **y ekseniyle kesişimi:** başlangıç değeri',
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
      sikli('f(x) = 2x + 1 için f(3) kaçtır?', ['6', '7'], 1, 'x yerine 3 yazılır: 2 · 3 + 1 = 7.'),
      sikli('f(x) = 1/x için hangi değer tanımlı değildir?', ['1', '0'], 1, 'Payda sıfır.'),
      sikli('f(x) = −x + 4 doğrusu y eksenini hangi noktada keser?', ['(4, 0)', '(0, 4)'], 1, 'y eksenini kesen noktada x = 0; f(0) = 4.'),
      sikli('Hangi doğru daha diktir?', ['y = 2x', 'y = 5x'], 1, 'Eğimin büyüklüğü dikliği verir: 5 > 2.'),
      sikli('(1, 3) ve (3, 7) noktalarından geçen doğrunun eğimi?', ['2', '4'], 0, '4/2.'),
      sikli('x eksenini kestiği nokta nasıl bulunur?', ['f(x) = 0 çözülür', 'x = 0 yazılır'], 0, 'x = 0 y eksenini verir.'),
      sikli('Eğim 2 ise x bir birim artınca y?', ['2 artar', '2 azalır'], 0, 'Sağa bir, yukarı iki.'),
      soru('f(x) = 8x + 25 taksi ücretinde 10 km\'lik yolculuk 105 TL tutar.', true, '8 · 10 + 25 = 105.'),
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
        'Bir sayının sıfıra olan uzaklığıdır.\nUzaklık negatif olamayacağı için sonuç asla negatif değildir.',
      ),
      kart(
        'Tanımı',
        'Parçalı bir tanımdır, kural x’in işaretine göre değişir:\n- **x ≥ 0 ise:** |x| = x\n- **x < 0 ise:** |x| = −x',
      ),
      kart(
        'Grafiği V şeklinde',
        '- **Sağ kol:** x ≥ 0 için y = x\n- **Sol kol:** x < 0 için y = −x\nİki kol orijinde birleşir; orası kırılma noktasıdır.',
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
        '- **|x − 2|:** sağa 2 birim\n- **|x| + 3:** yukarı 3 birim\nİçerideki değişiklik yatay, dışarıdaki dikey kaydırır.',
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
        '**|x| = a** denkleminde:\n- **a > 0:** iki çözüm, x = a ve x = −a\n- **a = 0:** tek çözüm, x = 0\n- **a < 0:** çözüm yok',
      ),
      kart(
        'Eşitsizlikte: küçüktür',
        '**|x| < a** ise **−a < x < a**\nÇözüm sıfırın çevresinde tek bir aralıktır.',
        {
          tur: 'sayiDogrusu',
          aralik: [-5, 5],
          isaretler: [-3, 0, 3],
          parcalar: [{ bas: -3, bit: 3, ad: '|x| < 3' }],
        },
      ),
      kart(
        'Eşitsizlikte: büyüktür',
        '**|x| > a** ise **x < −a ya da x > a**\nÇözüm birbirinden ayrı iki parçadır; en sık karıştırılan yer burası.',
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
        '|x − 5|, "x ile 5 arasındaki uzaklık" demektir.\n|x − 5| < 2 → x, 5’e 2 birimden yakın.',
        undefined,
        { not: '|x − 5| < 2 → 5\'e uzaklığı 2\'den az → 3 < x < 7. Tek satırda, denklem çözmeden.' },
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
      sikli('|x − 1| = 3 denkleminin çözümleri?', ['4 ve 2', '4 ve −2'], 1, 'x − 1 = 3 ya da x − 1 = −3; x = 4 ya da x = −2.'),
      sikli('|x − 2| grafiği |x|\'e göre nasıl kayar?', ['Yukarı 2', 'Sağa 2'], 1, 'İçerideki değişim yatay.'),
      sikli('|x − 5| < 2 ne demektir?', ['x, 5\'ten büyük', 'x, 5\'e 2 birimden yakın'], 1, 'Uzaklık okuması.'),
      sikli('|−7| + |3| kaçtır?', ['−4', '10'], 1, 'Mutlak değerler 7 ve 3; toplam 10.'),
      soru('|x| + 3 fonksiyonunun en küçük değeri 3\'tür.', true, '|x| en az 0; grafik 3 birim yukarı kaymış.'),
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
        '- Bilinmeyeni seç.\n- Cümleyi eşitliğe çevir.\n- Çöz.\n- Sonucu problemin bağlamında kontrol et.',
      ),
      kart(
        'Çözmenin mantığı',
        'Denklem bir terazidir: iki tarafa aynı işlem yapıldıkça denge bozulmaz.\nÇözmek, bilinmeyeni yalnız bırakmaktır.',
      ),
      kart(
        'Eşitsizlikte işaret',
        'Negatif sayıyla çarparken ya da bölerken eşitsizlik **yön değiştirir**.\nÖrnek: −2x < 6 → x > −3',
      ),
      kart(
        'Çözüm kümesi',
        '- **Denklem:** çözüm genellikle tek bir nokta\n- **Eşitsizlik:** çözüm bir aralık, sayı doğrusunda gösterilir',
        {
          tur: 'sayiDogrusu',
          aralik: [-6, 6],
          isaretler: [-3, 0, 3],
          parcalar: [{ bas: -3, bit: null, kapaliBas: false, ad: 'x > −3' }],
        },
      ),
      kart(
        'Çözümsüz ve sonsuz çözüm',
        'Bilinmeyen sadeleşince kalan eşitliğe bak:\n- **0 = 5 kalırsa:** çözüm yok\n- **0 = 0 kalırsa:** her sayı çözüm',
      ),
      kart(
        'Anlam kontrolü',
        'Kişi sayısı negatif, yaş kesirli çıkmaz.\nMatematiksel olarak doğru çözüm bağlamda geçersiz olabilir.',
        undefined,
        { not: '%20 artıp %20 azalan fiyat başa dönmez: 100 → 120 → 96. Art arda yüzdelerde çarpanları çarp: 1,2 × 0,8.' },
      ),
      kart(
        'Oran ve orantı',
        '- **Doğru orantı:** biri artarken öteki aynı oranda artar.\n- **Ters orantı:** çarpımları sabit kalır.',
      ),
      kart(
        'Yüzde problemleri',
        'Yüzde bir orandır: %20 artış, 1,2 ile çarpmaktır.\nArt arda %20 artıp %20 azalan sayı başa dönmez: 1,2 · 0,8 = 0,96',
      ),
    ], [
      soru('Bir eşitsizliğin iki tarafı negatif bir sayıyla çarpılırsa eşitsizliğin yönü değişir.', true, 'Negatifle çarpmak sıralamayı ters çeviriyor: 2 < 3 iken −2 > −3.'),
      soru('3x + 5 = 3x + 5 denkleminin çözümü yoktur.', false, 'İki taraf birebir aynı; her gerçek sayı çözüm, yani sonsuz çözüm var.'),
      soru('Kişi sayısı için kurulan bir denklemin çözümü 4,5 çıkarsa sonuç kabul edilir.', false, 'Kişi sayısı tam sayı olmalı; anlam kontrolü kurulan denklemin hatalı olduğunu söylüyor.'),
      soru('Yüzde 20 indirimden sonra yüzde 20 zam yapılırsa ilk fiyata dönülür.', false, 'Zam küçülmüş fiyat üzerinden alınıyor: 100 → 80 → 96.'),
      soru('x/3 = 4/6 orantısında x = 2 dir.', true, 'İçler dışlar çarpımı: 6x = 12, yani x = 2.'),
      sikli('Bilinmeyen sadeleşip 0 = 5 kalırsa?', ['Her sayı çözümdür', 'Çözüm yoktur'], 1, '0 = 0 her sayı.'),
      sikli('%20 artış hangi sayıyla çarpmaktır?', ['0,2', '1,2'], 1, 'Yüzde bir oran.'),
      sikli('Ters orantıda ne sabit kalır?', ['Oran', 'Çarpım'], 1, 'Doğru orantıda oran.'),
      soru('Doğru orantılı iki çokluktan biri 3 katına çıkarsa öteki de 3 katına çıkar.', true, 'Doğru orantıda oran sabit kalır.'),
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
        '- **İç açılar toplamı:** 180°\n- **Dış açılar toplamı:** 360°\nBu, her üçgende geçerli değişmez bir kuraldır.',
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
        'Bir dış açı, kendisine komşu olmayan iki iç açının toplamına eşittir.\nİspatı doğrudan 180° kuralından çıkar.',
      ),
      kart(
        'Kenar-açı ilişkisi',
        'Büyük açının karşısında büyük kenar bulunur.\nEn küçük açının karşısı en kısa kenardır.',
      ),
      kart(
        'Üçgen eşitsizliği',
        'İki kenarın toplamı üçüncü kenardan **büyük** olmalıdır.\nAksi hâlde kenarlar birleşip üçgen kapanmaz.',
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
        'İki kenar a ve b ise üçüncü kenar c:\n**|a − b| < c < a + b**\nUçlar dâhil değildir.',
        undefined,
        { not: 'Kenarlar 4 ve 9: 5 < c < 13. Tam sayı ise 6\'dan 12\'ye 7 değer; 5 ve 13 dâhil değil, sayarken atla.' },
      ),
      kart(
        'Kenar sorusu kalıbı',
        'Kenarlar 4 ve 9 ise: **5 < c < 13**\nTam sayı değerleri 6, 7, …, 12 → **7 değer**\n5 ve 13 sayılmaz.',
      ),
      kart(
        'Üçgen türleri',
        '- **Kenarlarına göre:** eşkenar, ikizkenar, çeşitkenar\n- **Açılarına göre:** dar, dik, geniş açılı',
      ),
      kart(
        'İkizkenar üçgen',
        'Eşit kenarların karşısındaki açılar da eşittir.\nTepeden inen yükseklik aynı zamanda açıortay ve kenarortaydır.',
      ),
      kart(
        'Üç temel doğru',
        '- **Açıortay:** açıyı ikiye böler.\n- **Kenarortay:** kenarı ortalar.\n- **Yükseklik:** kenara diktir.\nÜçü genelde farklı doğrulardır.',
      ),
      kart(
        'Ağırlık merkezi',
        'Üç kenarortay tek noktada kesişir.\nBu nokta her kenarortayı köşeden başlayarak **2 : 1** oranında böler.',
      ),
      kart(
        'Alan',
        '**Alan = taban · yükseklik / 2**\nYükseklik, tabana **dik** olan uzaklıktır; yan kenar yükseklik değildir.',
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
      sikli('Bir üçgenin dış açıları toplamı?', ['180°', '360°'], 1, 'İç açılar 180°.'),
      sikli('Bir dış açı neye eşittir?', ['Komşu iç açıya', 'Komşu olmayan iki iç açının toplamına'], 1, '180° kuralından çıkar.'),
      sikli('Bir iç açısı 110° olan üçgen açılarına göre hangi türdür?', ['Dar açılı', 'Geniş açılı'], 1, '90°\'den büyük tek bir açı üçgeni geniş açılı yapar.'),
      sikli('İkizkenar üçgende tepeden inen yükseklik aynı zamanda?', ['Yalnızca yükseklik', 'Açıortay ve kenarortay'], 1, 'Üçü çakışır.'),
      sikli('Kenarları 5 ve 8 olan üçgende üçüncü kenar tam sayı olarak kaç değer alır?', ['9', '11'], 0, '3 < c < 13; 4, 5, …, 12 → 9 değer.'),
      sikli('Alan formülünde yükseklik nedir?', ['Tabana dik uzaklık', 'Yan kenar'], 0, 'Yan kenar yükseklik değil.'),
      sikli('Kenarlarına göre bütün kenarları farklı üçgen?', ['Çeşitkenar', 'İkizkenar'], 0, 'Eşkenar hepsi eşit.'),
      soru('İki açısı 70° ve 40° olan üçgen ikizkenardır.', true, 'Üçüncü açı 70°; iki açı eşitse karşılarındaki kenarlar da eşit.'),
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
        'Şekil belirli bir yönde ve miktarda kaydırılır.\nBoyut, biçim ve yön korunur; yalnızca konum değişir.',
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
        'Bir doğruya göre simetrik görüntü alınır.\nŞekil ters döner ama bütün ölçüleri korunur.',
      ),
      kart(
        'Döndürme',
        'Şekil bir nokta çevresinde belirli bir açıyla çevrilir.\nÜçü birlikte belirtilir: merkez, açı ve yön.',
      ),
      kart(
        'Koordinatta kural',
        'Her dönüşüm, noktanın koordinatlarına basit bir kuralla yansır.\nTabloda en sık kullanılan dördü var.',
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
        'Öteleme, yansıma ve döndürme uzunlukları korur.\nÜrettikleri şekil orijinaline **eştir**.',
      ),
      kart(
        'Benzerlik dönüşümü',
        'Ölçekleme (homoteti) boyutu değiştirir, açıları korur.\nSonuç **benzer** bir şekildir.',
      ),
      kart(
        'Bileşke dönüşüm',
        'İki dönüşüm art arda uygulanabilir ve **sıra önemlidir**.\nÖnce döndürüp ötelemek ile tersi farklı sonuç verir.',
        undefined,
        { not: '(1, 0) noktası: önce 90° döndürüp 2 sağa ötele → (2, 1); önce ötele sonra döndür → (0, 3). Sıra sonucu değiştirir.' },
      ),
      kart(
        'Simetri ekseni',
        'Şekil bir doğruya göre kendisiyle çakışıyorsa o doğru simetri eksenidir.\nEşkenar üçgenin üç simetri ekseni vardır.',
      ),
    ], [
      soru('Öteleme şeklin boyutunu ve açılarını değiştirmez.', true, 'Şekil yalnızca yer değiştiriyor; öteleme bir eşlik dönüşümü.'),
      soru('(x, y) noktasının y eksenine göre yansıması (x, −y) olur.', false, 'y eksenine göre yansımada x işaret değiştirir: (−x, y).'),
      soru('Benzerlik dönüşümü açıları korur, kenar uzunluklarını aynı oranda değiştirir.', true, 'Şeklin biçimi aynı kalıyor, yalnızca ölçeği değişiyor.'),
      soru('Karenin simetri ekseni sayısı ikidir.', false, 'Karede dört simetri ekseni var: iki köşegen ve karşılıklı kenarların orta dikmeleri.'),
      sikli('Bir doğruya göre simetrik görüntü alma?', ['Yansıma', 'Öteleme'], 0, 'Şekil ters döner.'),
      sikli('Döndürmede neler belirtilmelidir?', ['Merkez, açı ve yön', 'Yalnızca açı'], 0, 'Üçü birlikte.'),
      sikli('Eşkenar üçgenin kaç simetri ekseni vardır?', ['3', '1'], 0, 'Her köşeden bir tane.'),
      sikli('Önce döndürüp sonra ötelemek ile tersi?', ['Farklı sonuç verebilir', 'Hep aynı sonuç'], 0, 'Sıra önemli.'),
      soru('(2, 5) noktası orijine göre 180° döndürülürse (2, −5) olur.', false, '180° dönmede iki koordinat da işaret değiştirir: (−2, −5). (2, −5) x eksenine göre yansıma.'),
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
        'İki şeklin karşılıklı bütün kenar ve açıları eşittir.\nÜst üste konunca tam olarak çakışırlar.',
      ),
      kart(
        'Eşlik koşulları',
        'Üç uygun eleman eşliği garanti eder.\nAltı elemanın hepsini ölçmek gerekmez.',
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
        'Üç açısı eşit iki üçgen aynı biçimdedir ama aynı boyda olmak zorunda değildir.\nBu eşlik değil **benzerliktir**.',
        undefined,
        { not: 'Açıları 30-60-90 olan iki üçgen: biri kibrit kutusu, biri bina; benzer ama eş değil. AAA benzerlik verir.' },
      ),
      kart(
        'Benzerlik nedir?',
        '- Karşılıklı açılar eşit\n- Karşılıklı kenarlar orantılı\nBiçim aynı, ölçek farklıdır.',
      ),
      kart(
        'Benzerlik koşulları',
        '- **AA:** iki açı eşit\n- **KKK:** üç kenar orantılı\n- **KAK:** iki kenar orantılı, aradaki açı eşit',
      ),
      kart(
        'Eşlik özel bir benzerliktir',
        'Benzerlik oranı 1 olan benzerlik eşliktir.\nHer eş şekil benzerdir; tersi doğru değildir.',
      ),
      kart(
        'Yazım sırası önemli',
        '**ABC ≅ DEF** yazılınca: A↔D, B↔E, C↔F\nSıra bozulursa kurulan bütün eşitlikler yanlış olur.',
      ),
      kart(
        'Nerede kullanılır?',
        'Ölçülemeyen uzunlukları hesaplamakta:\n- Bir nehrin genişliği\n- Bir binanın yüksekliği\n- Haritadaki mesafe',
      ),
    ], [
      soru('İki üçgenin üç açısı da eşitse bu üçgenler eştir.', false, 'AAA eşlik değil benzerlik verir; aynı biçimde ama farklı büyüklükte olabilirler.'),
      soru('Eşlik, benzerlik oranı 1 olan özel bir benzerliktir.', true, 'Eş şekiller hem aynı biçimde hem aynı büyüklükte.'),
      soru('KKK, KAK ve AKA birer eşlik koşuludur.', true, 'Üçü de üçgeni tek bir biçimde belirliyor.'),
      soru('ABC ≅ DEF yazılışında A köşesi F köşesine karşılık gelir.', false, 'Yazım sırası eşleşmeyi veriyor: A ile D, B ile E, C ile F karşılıklı.'),
      sikli('Eşlik için en az kaç uygun eleman gerekir?', ['3', '6'], 0, 'KAK, AKA, KKK.'),
      sikli('İki açısı eşit iki üçgen için ne söylenir?', ['Benzerdir', 'Eştir'], 0, 'AA yeter; üçüncü açı kendiliğinden.'),
      sikli('Benzerlik oranı 3 olan üçgenlerde küçüğün bir kenarı 4 ise büyükteki karşılığı?', ['12', '7'], 0, 'Karşılıklı kenarlar aynı oranla büyür: 4 · 3 = 12.'),
      sikli('Hipotenüsü ve bir dik kenarı eşit iki dik üçgen için ne söylenir?', ['Eştir', 'Yalnızca benzerdir'], 0, 'Dik üçgende HK bir eşlik koşuludur; üçüncü kenar Pisagor\'la aynı çıkar.'),
      soru('Nehrin genişliği benzerlikle hesaplanabilir.', true, 'Ölçülemeyen uzunluklar.'),
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
        'Üçgende bir kenara paralel çizilen doğru, orijinaline benzer küçük bir üçgen üretir.',
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
        'Paralel kesen, kestiği iki kenarı **aynı oranda** böler.\nBu, Tales teoreminin üçgendeki hâlidir.',
      ),
      kart(
        'Benzerlik oranı',
        'Karşılıklı kenarların oranıdır.\nKenar, yükseklik ve çevre gibi bütün uzunluklarda aynıdır.',
      ),
      kart(
        'Alan oranı karesidir',
        'Benzerlik oranı **k** ise:\n- **Çevreler oranı:** k\n- **Alanlar oranı:** k²',
        undefined,
        { not: 'Benzerlik oranı 2/3 ise alanlar 4/9. Soru \'alanı 18 ise\' diyorsa küçüğün alanı 8, 12 değil.' },
      ),
      kart(
        'Karşılıklı elemanlar',
        'Benzerlik yazılırken köşeler doğru sırayla eşleştirilmelidir.\nSıra bozulursa oranlar yanlış kurulur.',
      ),
      kart(
        'Kelebek benzerliği',
        'Kesişen iki doğruda ters açılar eşittir.\nKarşılıklı kenarlar paralelse iki üçgen "kelebek" biçiminde benzerdir.',
      ),
      kart(
        'Günlük kullanım',
        'Gölge boyundan ağaç boyunu hesaplamak benzer üçgen kurmaktır.\nAynı anda ölçülen iki gölge aynı oranı verir.',
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
      soru('Benzer üçgenlerde karşılıklı açılar eşittir.', true, 'Benzerlikte biçim aynı; açılar korunur, kenarlar orantılı değişir.'),
      soru('Kelebek benzerliğinde üçgenler ters yönde durduğu için benzer olamazlar.', false, 'Ters dönmüş olmak benzerliği bozmaz; ters açılar ve paralellik eşit açılar veriyor.'),
      sikli('DE ∥ BC, AD = 2, DB = 4, AE = 3 ise EC kaçtır?', ['6', '1,5'], 0, 'Paralel kesen kenarları aynı oranda böler: 2/4 = 3/EC, EC = 6.'),
      sikli('Benzer iki üçgenin yükseklikleri 4 ve 6 ise çevreleri oranı?', ['2/3', '4/9'], 0, 'Bütün uzunluklar aynı oranda: yükseklik oranı çevre oranına eşit.'),
      sikli('Benzerlik yazılırken köşeler yanlış eşleştirilirse ne olur?', ['Sonuç değişmez', 'Oranlar yanlış kurulur'], 1, 'Oran yalnızca karşılıklı kenarlar arasında anlamlı.'),
      soru('Aynı anda 2 m\'lik direğin gölgesi 3 m, bir ağacın gölgesi 12 m ise ağaç 8 m\'dir.', true, 'Boy/gölge oranı sabit: 2/3 = x/12, x = 8.'),
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
        'Paralel doğrular, kestikleri doğrular üzerinde **orantılı** parçalar ayırır.',
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
        'Bir kenarı ölçülemeyen şekilde eksik uzunluğu bulmakta:\norantı kurulur, bilinmeyen çekilir.',
      ),
      kart(
        'Pisagor teoremi',
        'Dik üçgende hipotenüs c ise:\n**a² + b² = c²**',
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
        '- 3, 4, 5\n- 5, 12, 13\n- 8, 15, 17\nBunların katları da üçlüdür: 6, 8, 10',
      ),
      kart(
        'Teoremin tersi',
        'a² + b² = c² sağlanıyorsa üçgen diktir.\nBir üçgenin dik olup olmadığı bu yönle sınanır.',
      ),
      kart(
        'Öklid: yükseklik bağıntısı',
        'Hipotenüse inen yükseklik h, hipotenüsü p ve q parçalarına ayırsın:\n**h² = p · q**',
      ),
      kart(
        'Öklid: dik kenar bağıntısı',
        'Her dik kenarın karesi, kendi izdüşümü ile hipotenüsün çarpımıdır:\n**a² = p · c**',
      ),
      kart(
        'Özel dik üçgenler',
        '- **30-60-90:** kenarlar 1 : √3 : 2\n- **45-45-90:** kenarlar 1 : 1 : √2',
      ),
      kart(
        'Neden aynı temada?',
        'Üçünün de ispatı benzerliğe dayanır.\nAyrı formüller gibi görünenler tek bir fikrin sonuçlarıdır.',
        undefined,
        { not: 'Öklid h² = p·q yalnızca hipotenüse inen yükseklikte; dik kenara inen yükseklikte kullanırsan yanlış.' },
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
      sikli('Hipotenüse indirilen yükseklik h ise h² neye eşittir?', ['p·q', 'p·c'], 0, 'p ve q hipotenüsteki parçalar.'),
      sikli('(5, 12, 13) üçlüsünün iki katı?', ['(7, 14, 15)', '(10, 24, 26)'], 1, 'Pisagor üçlüsünün katları da üçlüdür: 100 + 576 = 676.'),
      sikli('30-60-90 üçgeninde kenar oranı?', ['1, √3, 2', '1, 1, √2'], 0, '45-45-90\'da 1, 1, √2.'),
      sikli('45-45-90 üçgeninde dik kenarlar 1 ise hipotenüs kaçtır?', ['√2', '2'], 0, 'Kenarlar 1 : 1 : √2; 30-60-90\'da 1 : √3 : 2.'),
      sikli('Paralel doğruların kestikleri doğrularda orantılı parça ayırması?', ['Öklid teoremi', 'Tales teoremi'], 1, 'Orantı.'),
      soru('Tales, Öklid ve Pisagor teoremlerinin ispatı benzerliğe dayanır.', true, 'Tek fikrin sonuçları.'),
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
        '- Benzer üçgenleri ayır.\n- Karşılıklı köşeleri eşleştir.\n- Oranı kur.',
      ),
      kart(
        'Şekli ayırmak',
        'İç içe geçmiş benzer üçgenleri iki ayrı şekil olarak yeniden çiz.\nEşleştirme hatası büyük ölçüde biter.',
        undefined,
        { not: 'Ağaç–gölge sorusu: aynı anda ölçülen 1 m\'lik çubuk 1,5 m gölge veriyorsa 6 m gölgeli ağaç 4 m.' },
      ),
      kart(
        'En sık hata',
        'Karşılıklı olmayan kenarları oranlamak.\nEşleştirme yanlışsa oran da yanlış olur.',
      ),
      kart(
        'Alan oranı',
        'Benzerlik oranı **k** ise alan oranı **k²** olur.\nUzunluk oranı ile alan oranı sık karıştırılır.',
      ),
      kart(
        'Hacim oranı',
        'Benzer cisimlerde hacimler oranı **k³** olur.\nÖlçeği iki katına çıkan maket, sekiz kat hacim kaplar.',
      ),
      kart(
        'Ölçek',
        'Harita ölçeği bir benzerlik oranıdır.\n1/25.000 ölçekte haritadaki 1 cm, arazide 250 m’dir.',
      ),
      kart(
        'Uygulama',
        'Hepsi benzerlik problemidir:\n- Maket ve harita hesapları\n- Gölge boyu\n- Fotoğraf büyütme',
      ),
    ], [
      soru('Benzer iki cismin hacimleri oranı benzerlik oranının küpüdür.', true, 'Üç boyut da aynı oranda büyüyor.'),
      soru('1/500 ölçekli haritada 3 cm olan yol gerçekte 1500 m dir.', false, '3 × 500 = 1500 cm, yani 15 m.'),
      soru('Boyu 1,8 m olan kişinin gölgesi 1,2 m iken 4 m gölgesi olan ağaç 6 m dir.', true, 'Aynı anda oran sabit: 1,8/1,2 = 1,5 ve 4 × 1,5 = 6.'),
      soru('Benzerlik oranı kurulurken hangi kenarın hangisiyle eşleştiği önemli değildir.', false, 'Oran yalnızca karşılıklı kenarlar arasında kurulur; en sık hata burada yapılıyor.'),
      sikli('Haritadaki 4 cm\'lik yol gerçekte 2 km ise ölçek nedir?', ['1/5.000', '1/50.000'], 1, '2 km = 200.000 cm; 200.000 / 4 = 50.000.'),
      sikli('İç içe benzer üçgenlerde ilk yapılacak?', ['Alan hesaplamak', 'Şekli iki ayrı üçgene ayırmak'], 1, 'Eşleştirme hatasını bitirir.'),
      sikli('Benzerlik oranı 1/2 ise alan oranı?', ['1/2', '1/4'], 1, 'k².'),
      soru('Benzerlik probleminde önce benzer üçgenler belirlenir, köşeler eşleştirilir, sonra oran kurulur.', true, 'Sıra atlanırsa yanlış kenarlar oranlanır.'),
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
        'Bir problemi çözmek için izlenen sonlu, sıralı ve kesin adımlar dizisidir.\nBir yemek tarifi de bir algoritmadır.',
      ),
      kart(
        'Üç özellik',
        '- Sonlu olmalı.\n- Her adımı açık olmalı.\n- Aynı girdide hep aynı sonucu vermeli.',
      ),
      kart(
        'Girdi, işlem, çıktı',
        'Her algoritmanın üç parçası vardır:\n- **Girdi:** alınan veri\n- **İşlem:** yapılan hesap\n- **Çıktı:** yazılan sonuç',
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
        '- **Oval:** başlangıç ve bitiş\n- **Dikdörtgen:** işlem\n- **Eşkenar dörtgen:** karar\n- **Paralelkenar:** giriş ve çıkış',
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
        '- **Sıralı:** adımlar art arda\n- **Koşullu:** "eğer" ile dallanma\n- **Tekrarlı:** döngü\nHer algoritma bu üçünün bileşimidir.',
      ),
      kart(
        'Değişken',
        'Değer tutan, adı konmuş bir kutudur.\nİçindeki değer algoritma boyunca güncellenebilir.',
      ),
      kart(
        'Sonsuz döngü',
        'Döngüyü bitiren koşul hiç sağlanmazsa algoritma durmaz.\n"Sonlu olma" özelliği bu yüzden şarttır.',
        undefined,
        { not: '\'Sayı 10\'dan küçükken 2 ekle\' döngüsü 3\'ten başlarsa durur; 11\'den başlarsa hiç girmez. Başlangıcı kontrol et.' },
      ),
      kart(
        'Neden matematikte?',
        'Matematiksel çözüm de bir algoritmadır.\nBölme işlemi ve denklem çözme adım adım tanımlıdır.',
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
      sikli('Algoritmanın üç özelliğinden biri?', ['Sonlu olmak', 'Rastgele olmak'], 0, 'Açık adım, aynı girdide aynı sonuç.'),
      sikli('Değer tutan adlandırılmış kutu?', ['Değişken', 'Döngü'], 0, 'Güncellenebilir.'),
      sikli('Akış şemasında oval ne gösterir?', ['Başlangıç-bitiş', 'İşlem'], 0, 'Dikdörtgen işlem.'),
      sikli('Her algoritma hangi üç yapının bileşimidir?', ['Sıralı, koşullu, tekrarlı', 'Girdi, işlem, çıktı'], 0, 'Temel yapılar.'),
      soru('Akış şemasında giriş ve çıkış işlemleri paralelkenarla gösterilir.', true, 'Oval başla-bitir, dikdörtgen işlem, eşkenar dörtgen karar, paralelkenar giriş-çıkış.'),
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
        'Doğru ya da yanlış olduğu kesin olarak söylenebilen ifadedir.\nSoru ve emir cümleleri önerme değildir.',
      ),
      kart(
        'Doğruluk değeri',
        'Her önerme ya **doğru (D)** ya **yanlış (Y)** olur.\nİkisi arasında bir değer yoktur.',
      ),
      kart(
        've bağlacı (∧)',
        '- İkisi de doğruysa: **doğru**\n- Biri bile yanlışsa: **yanlış**',
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
        'En az biri doğruysa sonuç doğrudur.\n"Ya o ya bu" değil, "ikisi de olabilir" anlamındadır.',
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
        'Önermenin doğruluk değerini tersine çevirir.\nİki kez uygulanınca başa dönülür: **¬(¬p) = p**',
      ),
      kart(
        'Koşullu önerme',
        '**p ⇒ q** yalnızca bir durumda yanlıştır:\np doğru, q yanlışken.\nDiğer üç durumda doğrudur.',
        undefined,
        { not: '\'Yağmur yağarsa yer ıslanır\': yağmur yok, yer ıslak → önerme yine doğru. Yalnız D⇒Y yanlış.' },
      ),
      kart(
        'Karşıt tersi',
        '**p ⇒ q ≡ ¬q ⇒ ¬p**\nİkisi her zaman aynı doğruluk değerini taşır; ispatlarda kullanılır.',
      ),
      kart(
        'Niceleyiciler',
        '- **∀:** "her"\n- **∃:** "en az bir"\nİkisinin yeri değişince anlam tümüyle değişir.',
      ),
      kart(
        'Olumsuzlama',
        '- **"Her"in olumsuzu:** "en az biri değil"\n- **"En az bir"in olumsuzu:** "hiçbiri"',
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
      sikli('Soru cümlesi önerme midir?', ['Evet', 'Hayır'], 1, 'Doğruluk değeri yok.'),
      sikli('p doğru, q yanlış ise p ∨ q nedir?', ['Yanlış', 'Doğru'], 1, '"veya" için bir tanesinin doğru olması yeter.'),
      sikli('¬(¬p) neye eşittir?', ['¬p', 'p'], 1, 'Başa dönülür.'),
      sikli('"Her" olumsuzlanınca ne olur?', ['Hiçbir', 'En az bir'], 1, '"En az bir" olumsuzu "hiçbir".'),
      sikli('p ∧ ¬p önermesinin doğruluk değeri?', ['Her zaman yanlış', 'Her zaman doğru'], 0, 'Bir önerme ile değili aynı anda doğru olamaz.'),
      soru('p yanlış, q doğru iken p ⇒ q önermesi doğrudur.', true, 'Koşullu önerme yalnızca "doğru ⇒ yanlış" durumunda yanlış.'),
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
        'Programdaki "eğer" ifadeleri mantık önermeleridir.\n- **Koşul doğruysa:** blok çalışır.\n- **Yanlışsa:** blok atlanır.',
      ),
      kart(
        'Bileşik koşullar',
        '"Yaş > 18 ve ehliyet var" gibi koşullar bağlaçlarla kurulur.\nDoğruluk tablosu davranışı önceden söyler.',
      ),
      kart(
        'Eğer-değilse',
        'Karar noktasının iki çıkışı vardır ve **yalnızca biri** çalışır.\nİkisinin birden çalıştığı bir yol yoktur.',
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
        'Döngü, koşul doğru kaldığı sürece tekrarlanır.\nKoşul hiç yanlış olmazsa döngü bitmez.',
      ),
      kart(
        'Karar noktaları',
        'Akış şemasındaki her eşkenar dörtgen bir önermedir.\nÇıkışları doğru / yanlış diye ayrılır.',
      ),
      kart(
        'Koşulun olumsuzu',
        'Koşulu tersine çevirmek, iki dalın yer değiştirmesi demektir.\nAlgoritma yine aynı işi yapar.',
        undefined,
        { not: '\'Yaş > 18 ve ehliyet var\' olumsuzu: \'Yaş ≤ 18 veya ehliyet yok\'. ve→veya, büyük→küçük eşit.' },
      ),
      kart(
        'İç içe koşul',
        'Bir kararın dalı içinde ikinci bir karar olabilir.\nBu, "ve" bağlacıyla yazılan tek bir koşula denktir.',
      ),
    ], [
      soru('"not ≥ 50 ise geçti" koşulunun olumsuzu "not < 50" dir.', true, '≥ nin olumsuzu <; sınır değeri karşı tarafa geçiyor.'),
      soru('"ve" ile bağlanan bir koşulda tek şartın sağlanması yeterlidir.', false, '"ve" iki şartı da ister; biri yetiyorsa bağlaç "veya" olmalı.'),
      soru('İç içe koşullarda dıştaki koşul sağlanmazsa içteki hiç denenmez.', true, 'İçteki koşula ancak dıştaki doğruysa geliniyor.'),
      soru('Bir döngünün koşulunda geçen değer, döngü gövdesinde asla değişmemelidir.', false, 'Değişmezse koşul hep aynı kalır ve döngü hiç bitmez.'),
      sikli('Akış şemasında karar noktasının kaç çıkışı vardır?', ['2', '3'], 0, 'Doğru/yanlış.'),
      sikli('İç içe iki koşul hangi bağlaca denk gelir?', ['ve', 'veya'], 0, 'İkisi de sağlanmalı.'),
      sikli('Koşulu tersine çevirmek şemada ne yapar?', ['İki dalın yer değişmesi', 'Algoritmayı bozar'], 0, 'Aynı iş.'),
      soru('"Yaş > 18 ve ehliyet var" koşulunun olumsuzu "Yaş ≤ 18 veya ehliyet yok" olur.', true, 'Olumsuzlamada "ve" → "veya" döner, her şart ayrı ayrı olumsuzlanır.'),
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
        'Soru → veri → çözümleme → yorum\nSonuç, baştaki soruya dönmelidir.',
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
        '- **Nicel:** sayıyla ölçülür (boy, süre)\n- **Nitel:** kategoriyle belirtilir (renk, cinsiyet)',
      ),
      kart(
        'Kesikli ve sürekli',
        '- **Kesikli:** sayılır (kardeş sayısı)\n- **Sürekli:** ölçülür, arada her değeri alabilir (boy)',
      ),
      kart(
        'Merkezî eğilim ölçüleri',
        '- **Aritmetik ortalama**\n- **Ortanca (medyan)**\n- **Tepe değer (mod)**\nÜçü de "veri nereye yığılmış" sorusuna cevap verir.',
      ),
      kart(
        'Ortalama mı ortanca mı?',
        'Aşırı uç değer varsa ortalama yanıltır.\nOrtanca uç değerlerden etkilenmez.',
        {
          tur: 'tablo',
          basliklar: ['Veri', 'Ortalama', 'Ortanca'],
          satirlar: [
            ['2, 3, 4, 5, 6', '4', '4'],
            ['2, 3, 4, 5, 96', '22', '4'],
          ],
        },
        { not: 'Maaşlar 2, 2, 3, 3, 40 (bin): ortalama 10, ortanca 3. Uç değer varsa ortalama kimseyi temsil etmez.' },
      ),
      kart(
        'Yayılım ölçüleri',
        'Verinin ne kadar dağıldığını söylerler:\n- Açıklık\n- Çeyrekler açıklığı\n- Standart sapma',
      ),
      kart(
        'Standart sapma',
        'Değerlerin ortalama çevresinde ne kadar yayıldığını ölçer.\n- **Küçükse:** veri ortalamaya yakın toplanmış.\n- **Büyükse:** veri dağılmış.',
      ),
      kart(
        'Grafikler',
        '- **Histogram:** dağılımın şekli\n- **Kutu grafiği:** ortanca ve uç değerler\n- **Nokta grafiği:** tek tek veriler',
      ),
      kart(
        'Dağılımın şekli',
        '- **Simetrik:** ortalama ile ortanca yakın\n- **Sağa çarpık:** ortalama, ortancadan büyük',
      ),
    ], [
      soru('Bir sınıftaki öğrencilerin göz rengi nicel bir veridir.', false, 'Göz rengi ölçülüp sayılamaz; nitel veri.'),
      soru('Aşırı uç değer bulunan bir veride ortanca, ortalamadan daha güvenilir bir merkez ölçüsüdür.', true, 'Tek bir büyük değer ortalamayı çeker, ortancayı yerinden oynatmaz.'),
      soru('Standart sapma büyükse veriler ortalamanın etrafında sıkışmıştır.', false, 'Tersi: standart sapma büyüdükçe veriler ortalamadan uzağa yayılır.'),
      soru('Bir sınıftaki öğrenci sayısı kesikli bir değişkendir.', true, 'Sayılabilir ve arada değer almıyor; 24 ile 25 arasında öğrenci sayısı yok.'),
      sikli('Verideki en büyük ile en küçük değerin farkına ne denir?', ['Ortanca', 'Açıklık'], 1, 'Açıklık en basit yayılım ölçüsü; yalnızca iki uca bakar.'),
      sikli('2, 4, 4, 5, 10 verisinin ortancası?', ['5', '4'], 1, 'Sıralı beş değerin ortadaki (üçüncü) değeri 4.'),
      sikli('Sağa çarpık dağılımda ortalama ile ortanca?', ['Eşit', 'Ortalama daha büyük'], 1, 'Uç değerler çeker.'),
      sikli('En sık tekrar eden değere ne denir?', ['Ortanca', 'Tepe değer (mod)'], 1, 'Merkezî eğilim.'),
      sikli('Dağılımın şeklini gösteren grafik?', ['Histogram', 'Nokta grafiği'], 0, 'Kutu grafiği ortanca ve uçlar.'),
      soru('Araştırma süreci veri toplamayla biter.', false, 'Yorumlanıp soruya dönülmeli.'),
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
        '- Eksen aralıkları\n- Örneklem büyüklüğü\n- Veri kaynağı ve grafiğin türü\nBaşlık okunmadan grafik yorumlanmaz.',
      ),
      kart(
        'Kesik eksen',
        'Y ekseni sıfırdan başlamıyorsa küçük farklar büyük görünür.\nEn sık kullanılan yanıltma budur.',
        undefined,
        { not: 'Y ekseni 98\'den başlarsa 99 ile 100 arasındaki fark iki kat görünür; gerçek fark %1.' },
      ),
      kart(
        'Ölçek oyunu',
        'Aynı veri, eksen aralığı değiştirilerek farklı çizilebilir:\n- **Dar aralıkta:** "sert artış" gibi görünür.\n- **Geniş aralıkta:** "durgunluk" gibi görünür.',
      ),
      kart(
        'Örneklem önemli',
        'Az sayıda ya da taraflı seçilmiş örneklem yanlış sonuç verir.\nHesap doğru yapılsa bile sonuç yanıltır.',
      ),
      kart(
        'Kim topladı?',
        'Veriyi toplayanın sonuçtan çıkarı varsa her adım eğilebilir:\nsorunun soruluşundan örneklemin seçimine kadar.',
      ),
      kart(
        'Korelasyon nedensellik değildir',
        'İki değişkenin birlikte artması, birinin ötekine sebep olduğunu göstermez.\nÜçüncü bir sebep ikisini birden etkiliyor olabilir.',
      ),
      kart(
        'Eksik bilgi',
        'Yüzde verilip toplam yazılmıyorsa dikkat:\n"%50 arttı", iki kişiden üç kişiye çıkmak da olabilir.',
      ),
    ], [
      soru('Düşey ekseni sıfırdan başlamayan bir sütun grafiği farkları olduğundan büyük gösterir.', true, 'Kesik eksen sütunların oranını bozuyor; iki katı gibi görünen fark aslında küçük olabilir.'),
      soru('İki değişken birlikte artıyorsa biri diğerinin sebebidir.', false, 'Birlikte değişmek nedensellik değil; ikisini birden etkileyen üçüncü bir sebep olabilir.'),
      soru('Verinin kimin tarafından toplandığı sonucun güvenilirliğini etkilemez.', false, 'Sonuçtan çıkarı olan birinin topladığı veri taraflı olabilir.'),
      soru('Yalnızca kendi sınıfında yapılan bir anket bütün okul hakkında sonuç vermez.', true, 'Örneklem okulun tamamını temsil etmiyor.'),
      sikli('Aynı veri dar bir eksen aralığıyla çizilirse nasıl görünür?', ['Sert artış gibi', 'Durgunluk gibi'], 0, 'Dar aralık küçük değişimi büyütür; geniş aralık durgunluk gösterir.'),
      sikli('"%50 arttı" ifadesi ne zaman yanıltıcıdır?', ['Her zaman', 'Toplam sayı yazılmıyorsa'], 1, '2\'den 3\'e de %50.'),
      sikli('5 kişiden 4\'ünün beğendiği ürün için "%80 beğeniyor" demenin sorunu?', ['Örneklem çok küçük', 'Yüzde yanlış'], 0, 'Hesap doğru (4/5); ama 5 kişi kimseyi temsil etmez.'),
      soru('Grafik başlık okunmadan yorumlanabilir.', false, 'Eksen, örneklem, kaynak okunmalı.'),
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
        'Deneyde gözlenen sıklıktan hesaplanan olasılıktır:\n**istenen sonuç sayısı / toplam deneme sayısı**',
      ),
      kart(
        'Deney, sonuç, olay',
        '- **Deney:** tekrarlanabilen işlem\n- **Sonuç:** tek bir çıktı\n- **Olay:** sonuçlardan oluşan küme',
      ),
      kart(
        'Deneme sayısı önemli',
        'Deneme arttıkça deneysel olasılık teorik olasılığa yaklaşır.\nAz denemede sapma büyük olur.',
      ),
      kart(
        'Büyük sayılar',
        '- **10 atış:** 7 tura gelebilir.\n- **10.000 atış:** oran 1/2’ye yaklaşır.',
      ),
      kart(
        'Neden gerekli?',
        'Teorik olasılık hesaplanamıyorsa tek yol gözlemdir.\nÖrnek: bozuk zar, hava durumu, raptiye',
      ),
      kart(
        'Sıklık tablosu',
        'Deneme sonuçları sıklık tablosuna işlenir.\nGöreli sıklık, deneysel olasılığı verir.',
      ),
      kart(
        'İkisi arasındaki fark',
        '- **Teorik olasılık:** hesaplanır.\n- **Deneysel olasılık:** ölçülür.\nAynı deneyde ikisi genelde yakındır ama eşit değildir.',
        undefined,
        { not: 'Zar 60 kez atıldı, 14 kez 6 geldi: deneysel 14/60, teorik 1/6 = 10/60. Deneme artınca ikisi yaklaşır.' },
      ),
    ], [
      soru('Deneysel olasılık, gözlenen sıklığın toplam deneme sayısına bölümüdür.', true, 'Hesap yapılan deneyden çıkıyor, kuramdan değil.'),
      soru('Deneme sayısı arttıkça deneysel olasılık teorik olasılıktan uzaklaşır.', false, 'Tersi olur: deneme arttıkça deneysel olasılık teoriğe yaklaşır.'),
      soru('Hileli olabileceğinden şüphelenilen bir zar yalnızca teorik olasılıkla incelenir.', false, 'Zarın gerçekten hileli olup olmadığı ancak atılarak, yani deneysel olasılıkla anlaşılır.'),
      soru('20 atışın 7 sinde tura gelen paranın deneysel tura olasılığı 0,35 tir.', true, '7/20 = 0,35.'),
      sikli('10 atışta 7 tura gelmesi paranın hileli olduğunu gösterir mi?', ['Hayır, az denemede sapma büyük', 'Evet, kesin gösterir'], 0, 'Az denemede sonuç teorik değerden kolayca sapar.'),
      sikli('Deneme sonuçlarının işlendiği tablo?', ['Sıklık tablosu', 'Örnek uzay'], 0, 'Göreli sıklık.'),
      sikli('Tek bir çıktıya ne denir?', ['Sonuç', 'Olay'], 0, 'Olay sonuçlardan oluşan küme.'),
      soru('Teorik olasılık ölçülür, deneysel olasılık hesaplanır.', false, 'Tersi.'),
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
        '**P = istenen durum sayısı / tüm durum sayısı**\nSonuçların eşit olasılıklı olması gerekir.',
      ),
      kart(
        'Örnek uzay',
        'Tüm olası sonuçların kümesidir.\nBir zarda: {1, 2, 3, 4, 5, 6}, eleman sayısı 6',
      ),
      kart(
        'Değer aralığı',
        'Olasılık **0 ile 1** arasındadır.\n- **0:** imkânsız olay\n- **1:** kesin olay\n1’den büyük bir sonuç hesap hatasıdır.',
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
        'Bir zarda istenen sonuçların sayısı olasılığı doğrudan belirler.\nTabloda üç olay var.',
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
        '**P(olmaması) = 1 − P(olması)**\n"En az bir" sorularında bu yol kısaltır.',
      ),
      kart(
        'Ayrık olaylar',
        'Aynı anda gerçekleşemeyen iki olay ayrıktır.\nBirinin ya da ötekinin olma olasılığı: **P(A) + P(B)**',
      ),
      kart(
        'Bağımsız olaylar',
        'Biri ötekini etkilemiyorsa birlikte olma olasılığı: **P(A) · P(B)**\nÖrnek: iki kez tura, 1/2 · 1/2 = 1/4',
      ),
      kart(
        'Yaygın yanılgı',
        'Yazı gelen paranın sonraki atışta tura gelme olasılığı yine **1/2**’dir.\nPara geçmişi hatırlamaz.',
        undefined,
        { not: '5 kez üst üste yazı gelen paranın 6.\'da tura gelme olasılığı yine 1/2; \'artık tura gelmeli\' matematik değil.' },
      ),
    ], [
      soru('Bir olayın olasılığı 1,5 olabilir.', false, 'Olasılık 0 ile 1 arasında; 1 kesin olan olayın değeri.'),
      soru('Bir zar atıldığında çift sayı gelme olasılığı 1/2 dir.', true, 'Altı sonuçtan üçü çift: 3/6 = 1/2.'),
      soru('Bir olayın tümleyeninin olasılığı 1 − P(A) dır.', true, 'Olay ya olur ya olmaz; ikisinin olasılığı toplamda 1.'),
      soru('Arka arkaya beş kez yazı gelen para altıncı atışta daha yüksek olasılıkla tura gelir.', false, 'Para önceki atışları hatırlamaz; her atışta tura olasılığı 1/2.'),
      sikli('Bir zarda 3\'ten büyük sayı gelme olasılığı?', ['1/3', '1/2'], 1, '4, 5, 6: 3/6.'),
      sikli('İki zar atıldığında örnek uzayın eleman sayısı?', ['12', '36'], 1, 'Her zarın 6 sonucu var: 6 · 6 = 36.'),
      sikli('Aynı anda gerçekleşemeyen iki olay?', ['Bağımsız', 'Ayrık'], 1, 'Olasılıkları toplanır.'),
      sikli('3 kırmızı, 5 mavi toplu torbadan kırmızı çekme olasılığı?', ['3/5', '3/8'], 1, 'Toplam 8 top, 3 kırmızı: 3/8.'),
      soru('Bir zar atıldığında 7 gelme olasılığı 0\'dır.', true, 'Örnek uzayda 7 yok; imkânsız olayın olasılığı 0.'),
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
