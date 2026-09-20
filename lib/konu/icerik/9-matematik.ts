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
        'Üs, kaç kez çarpacağını söyler',
        '2⁵ demek, 2\'yi 5 kez kendisiyle çarpmak: 2·2·2·2·2 = 32. Alttaki sayı taban (2), üstteki küçük sayı üs (5).',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Negatif üs sayıyı ters çevirir',
        '2⁻³ eksi bir sayı değil; 2³\'ün tersi, yani 1/8. Üs eksiyse sayıyı paydaya at, eksiyi at: 5⁻² = 1/25.',
        undefined,
        { not: 'Sınavda en çok bu kayıyor: 2⁻³ gördüğünde aklına −8 gelirse dur, 1/8 olacak.' },
      ),
      kart(
        'Üs sıfırsa cevap 1',
        'Hangi sayı olursa olsun sıfırıncı kuvveti 1\'dir: 7⁰ = 1, 1000⁰ = 1. Tek istisna 0⁰, o tanımsız.',
      ),
      kart(
        'Aynı taban çarpılıyorsa üsler toplanır',
        '2³·2² = (2·2·2)·(2·2) = 2⁵. Beş tane 2 var, o kadar. Bölmede tersi: üsler çıkarılır, 2⁵/2² = 2³.',
        {
          tur: 'tablo',
          basliklar: ['İşlem', 'Örnek', 'Kural'],
          satirlar: [
            ['Çarpma', '2³·2² = 2⁵', 'üsler toplanır'],
            ['Bölme', '2⁵/2² = 2³', 'üsler çıkarılır'],
            ['Üssün üssü', '(2³)² = 2⁶', 'üsler çarpılır'],
          ],
        },
      ),
      kart(
        'Parantezin dışındaki üs çarpar',
        '(2³)² demek 2³\'ü iki kez çarpmak: 2³·2³ = 2⁶ = 64. Üsler toplanmaz, çarpılır: 3·2 = 6.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Tabanlar farklı, üsler aynıysa',
        '2⁵·5⁵ = (2·5)⁵ = 10⁵. Üsler aynıysa tabanları çarpıp tek üs yazarsın. Hem taban hem üs farklıysa kural yok; sayıya çevir.',
      ),
      kart(
        'Bilimsel gösterim: büyük sayıyı kısalt',
        '45.000 = 4,5·10⁴. Virgülü baştaki rakamın sağına koy, kaç basamak kaydırdıysan o üs olur. Küçük sayıda üs eksi: 0,0032 = 3,2·10⁻³.',
      ),
      kart(
        'Kök, üssün tersini sorar',
        '√25 = 5, çünkü 5² = 25. Kök "hangi sayının karesi bu?" diye sorar. ³√8 = 2, çünkü 2³ = 8.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Kök aslında kesirli üs',
        '√a ile a^(1/2) aynı şey. Kökün derecesi paydaya iner: ³√a² = a^(2/3). Böylece üs kurallarının hepsi köklerde de çalışır.',
      ),
      kart(
        'Kökler çarpılır, toplanmaz',
        '√2·√3 = √6 olur. Ama √2 + √3, √5 etmez; öyle kalır. Toplayabilmen için kök içleri aynı olmalı: 2√3 + 5√3 = 7√3.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Paydada kök bırakma',
        '1/√3 gördüğünde pay ve paydayı √3 ile çarp: √3/3. Payda iki terimliyse (√3−1) işaret değiştirip çarp: (√3+1) ile. Adı "rasyonel yapmak".',
      ),
      kart(
        'Kare kök negatif çıkmaz',
        '√(x²) = x demek yanlış, |x| demek doğru. x = −3 için √9 = 3, yani −3 değil. Kök hep sıfır ya da pozitif verir.',
      ),
    ], [
      soru('2⁻³ ifadesinin değeri −8 tir.', false, 'Negatif üs sayıyı negatif yapmaz, ters çevirir: 2⁻³ = 1/2³ = 1/8.'),
      soru('(2³)² ile 2³ · 2² aynı sonucu verir.', false, 'Üssün üssünde üsler çarpılır (2⁶ = 64), aynı tabanda çarpmada toplanır (2⁵ = 32).'),
      soru('0,0032 sayısının bilimsel gösterimi 3,2 · 10⁻³ tür.', true, 'Virgül üç basamak sağa kaydı, yani üs −3 oldu; baştaki sayı 1 ile 10 arasında.'),
      soru('√2 + √3 = √5 tir.', false, 'Kökler çarpma ve bölmede birleşir, toplamada birleşmez.'),
      sikli('2⁻³ kaçtır?', ['−8', '1/8'], 1, 'Negatif üs ters çevirir.'),
      sikli('2³ · 2² kaçtır?', ['2⁶ = 64', '2⁵ = 32'], 1, 'Aynı tabanda üsler toplanır.'),
      sikli('0,0032 sayısının bilimsel gösterimi?', ['32 · 10⁻⁴', '3,2 · 10⁻³'], 1, '1 ≤ a < 10 olmalı.'),
      sikli('³√a² ifadesi kesirli üsle nasıl yazılır?', ['a^(3/2)', 'a^(2/3)'], 1, 'Kökün derecesi paydaya.'),
      sikli('√(a²) neye eşittir?', ['|a|', 'a'], 0, 'Karekök negatif olamaz.'),
      sikli('2⁵ · 5⁵ kaçtır?', ['10⁵', '10¹⁰'], 0, 'Aynı üs, tabanlar çarpılır.'),
      sikli('1/(√3 − 1) paydası nasıl rasyonel yapılır?', ['Eşleniği (√3 + 1) ile çarparak', '√3 ile çarparak'], 0, 'İki terimli payda.'),
      soru('√2 · √3 = √6\'dır.', true, 'Çarpımda kökler birleşir.'),
      soru('7⁰ ifadesinin değeri 1\'dir.', true, 'Sıfırıncı kuvvet her zaman 1; tek istisna 0⁰.'),
    ], [
      {
        soru: '(2³)² ifadesinin değeri kaçtır?',
        siklar: ['32', '64'],
        dogru: 1,
        aciklama: {
          dogru: 'Üssün üssünde üsler çarpılır: 2⁶ = 64.',
          yanlis: '32 = 2⁵, yani 2³·2² olurdu. Üssün üssü üsleri toplamaz, çarpar: 2⁶ = 64.',
        },
        kart: 5,
      },
      {
        soru: '√2 + √3 toplamı neye eşittir?',
        siklar: ['√5', 'Sadeleşmez, öyle kalır'],
        dogru: 1,
        aciklama: {
          dogru: 'Kökler çarpılırken birleşir, toplanırken birleşmez.',
          yanlis: '√5 yalnızca çarpımda çıkardı: √2·√3 = √6. Toplamda kökler birleşmez; √2 + √3 ≈ 3,15 iken √5 ≈ 2,24.',
        },
        kart: 10,
      },
    ]),
    konu('mat9-araliklar', 'Gerçek Sayı Aralıkları ve Küme Sembolleri', [
      kart(
        'Küme, nesnelerin topluluğudur',
        'Sınıfındaki kızlar bir küme, 10\'dan küçük çift sayılar bir küme. Bir nesne kümenin içindeyse ∈, dışındaysa ∉ yazarsın: 4 ∈ {2, 4, 6}, 5 ∉ {2, 4, 6}.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Alt küme: hepsi ötekinin içinde',
        'A = {1, 2}, B = {1, 2, 3} olsun. A\'nın her elemanı B\'de var; buna A alt kümedir denir, A ⊆ B yazılır. B\'de fazladan 3 olması sorun değil, önemli olan A\'dan dışarı taşan olmaması.',
      ),
      kart(
        'Boş kümenin hiç elemanı yok',
        'Üç kenarlı kareler diye bir şey yok; o küme boştur ve ∅ yazılır. Boş küme her kümenin alt kümesidir: dışarı taşacak bir elemanı yok. {0} boş küme değil, içinde 0 var.',
      ),
      kart(
        'Tümleyen, dışarıda kalanlardır',
        'Sınıfın tamamı evrensel küme (E), yani konuştuğun her şeyin kümesi. Gözlüklüler A ise gözlüksüzler A′ olur. A′ tümleyen demek: E\'de olup A\'da olmayanlar.',
        {
          tur: 'venn',
          sol: 'A',
          sag: 'A′',
          disi: 'E',
          tumleyen: true,
        },
      ),
      kart(
        'Köşeli parantez ucu içeri alır',
        '[2, 5) demek 2 ile 5 arasındaki bütün sayılar. Köşeli parantez ucu içeri alır: 2 dâhil. Normal parantez dışarıda bırakır: 5 hariç. Çizimde dolu nokta dâhil, boş nokta hariç demek.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 7],
          isaretler: [0, 2, 5, 7],
          parcalar: [{ bas: 2, bit: 5, kapaliBas: true, kapaliBit: false, ad: '[2, 5)' }],
        },
      ),
      kart(
        'Sonsuza "dâhil" denemez',
        '3 ve 3\'ten küçük bütün sayılar (−∞, 3] diye yazılır. Sol uçta bir bitiş yok, sonsuza gidiyor. Sonsuz bir sayı değil; yanına her zaman normal parantez konur.',
        {
          tur: 'sayiDogrusu',
          aralik: [-6, 6],
          isaretler: [-4, -2, 0, 3],
          parcalar: [{ bas: null, bit: 3, kapaliBit: true, ad: '(−∞, 3]' }],
        },
        { not: '(−∞, 3] gördüğünde sonsuz tarafına köşeli parantez koyma isteği gelirse dur: sonsuz bir sayı değil.' },
      ),
      kart(
        'Kesişim ortak kısım, birleşim tamamı',
        'A = [1, 6], B = [4, 9] olsun. İkisinde de olan sayılar kesişim: A ∩ B = [4, 6]. İkisinin kapladığı her yer birleşim: A ∪ B = [1, 9]. Hiç örtüşmüyorlarsa kesişim boş küme.',
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
        'Aralık yalnızca gerçek sayılarda',
        'Tam sayılardan 2, 3, 4\'ü anlatmak istersen liste yazarsın: {2, 3, 4}. [2, 4] yazarsan 2,5 ve 3,7 de içeri girer. Aralık, "arada sonsuz sayı var" demek.',
        undefined,
        { etiket: 'Sık hata' },
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
      soru('(3, 7) aralığında 3 sayısı da vardır.', false, 'Normal parantez ucu dışarıda bırakır: 3 dâhil değil, 3\'ten büyük sayılar dâhil.'),
      soru('Sonsuz uçlu aralıklar her zaman normal parantezle yazılır: (−∞, 4].', true, 'Sonsuz bir sayı değil; dâhil edilecek bir uç olmadığı için köşeli parantez konmaz.'),
      soru('{0} kümesi boş kümedir.', false, 'İçinde 0 var; boş kümenin hiç elemanı olmaz.'),
      sikli('Sonsuzun yanına hangi parantez konur?', ['Köşeli parantez', 'Normal parantez'], 1, 'Sonsuz ulaşılan bir yer değil.'),
      sikli('Sayı doğrusunda boş nokta ne demektir?', ['Uç dâhil', 'Uç dâhil değil'], 1, 'Dolu nokta dâhil demek.'),
      sikli('2, 3, 4 tam sayıları nasıl yazılır?', ['[2, 4]', '{2, 3, 4}'], 1, 'Aralık arada sonsuz sayı var demek; tam sayılar listelenir.'),
      sikli('[1, 6] ile [4, 9] aralıklarının ortak kısmı?', ['[1, 9]', '[4, 6]'], 1, 'Ortak kısım kesişim; [1, 9] birleşim.'),
      soru('Boş küme her kümenin alt kümesidir.', true, 'Dışarı taşacak elemanı yok.'),
    ], [
      {
        soru: '[2, 5) aralığında 5 dâhil midir?',
        siklar: ['Evet, aralığın ucu', 'Hayır, normal parantez'],
        dogru: 1,
        aciklama: {
          dogru: 'Köşeli parantez içeri alır, normal parantez dışarıda bırakır; 2 dâhil, 5 hariç.',
          yanlis: 'Uç nokta olmak dâhil olmak demek değil. 5\'in yanındaki normal parantez onu dışarıda bırakır.',
        },
        kart: 5,
      },
    ]),
    konu('mat9-sayi-kumeleri', 'Sayı Kümeleri ve İşlem Özellikleri', [
      kart(
        'Tam sayılar, doğal sayılara eksileri ekler',
        'Saydığın sayılar 1, 2, 3… sayma sayıları; başına 0 gelince doğal sayılar: ℕ = {0, 1, 2, …}. Hava −5° olabilir; −5 doğal değil ama tam sayı: ℤ = {…, −2, −1, 0, 1, 2, …}.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Rasyonel sayı kesir olarak yazılabilir',
        '3/4, −2/5 ve 0,25 (= 1/4) rasyonel sayı. Rasyonel, yani a/b biçiminde yazılabilen sayı; a ve b tam sayı, b sıfır değil. 5 de rasyonel, çünkü 5/1 diye yazılır.',
      ),
      kart(
        'Ondalık açılım rasyoneli ele verir',
        '0,25 bitiyor: rasyonel. 0,333… bitmiyor ama 3 tekrar ediyor: yine rasyonel, çünkü 1/3. Açılım, yani virgülden sonraki kısım, bitiyorsa ya da tekrar ediyorsa sayı kesre çevrilir.',
        {
          tur: 'tablo',
          basliklar: ['Açılım', 'Tür', 'Örnek'],
          satirlar: [
            ['Sonlu', 'Rasyonel', '0,25 = 1/4'],
            ['Devirli', 'Rasyonel', '0,333… = 1/3'],
            ['Devirsiz', 'İrrasyonel', '1,41421… = √2'],
          ],
        },
      ),
      kart(
        'İrrasyonel sayı kesre çevrilemez',
        '√2 = 1,41421… sonsuza gider ve hiçbir parça tekrar etmez. Böyle bir sayı kesir olarak yazılamaz; adı irrasyonel. π de öyle. √4 irrasyonel değil, çünkü √4 = 2.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Kümeler iç içe büyür',
        '0 doğal sayı; aynı zamanda tam, rasyonel ve gerçek sayı. Her küme bir öncekini içine alır: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. Gerçek sayılar (ℝ) rasyonellerle irrasyonellerin hepsi.',
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
        'Değişme: sıra değişir, sonuç değişmez',
        '3 + 5 = 5 + 3 = 8 ve 3 · 5 = 5 · 3 = 15. Toplama ile çarpmada sırayı değiştirebilirsin; adı değişme özelliği. Çıkarmada yok: 5 − 3 = 2 ama 3 − 5 = −2.',
      ),
      kart(
        'Birleşme: parantez kayar, sonuç kalır',
        '(2 + 3) + 4 = 2 + (3 + 4) = 9. Önce hangi ikisini toplarsan topla sonuç aynı; adı birleşme özelliği. Çarpmada da var, çıkarma ve bölmede yok: (8 − 3) − 2 ≠ 8 − (3 − 2).',
      ),
      kart(
        'Dağılma: çarpan içeriye dağılır',
        '3 · (4 + 5) = 3·4 + 3·5 = 27. Parantezin önündeki 3, içerideki her sayıyla ayrı ayrı çarpılır. Genel hâli a(b + c) = ab + ac. Çarpmayı toplamaya bağlayan tek özellik bu.',
      ),
      kart(
        'Etkisiz eleman sayıyı değiştirmez',
        '7 + 0 = 7, 7 · 1 = 7: toplamada 0, çarpmada 1 etkisiz eleman. Ters eleman seni etkisize götürür: 5 + (−5) = 0, 5 · 1/5 = 1. Çarpmada 0 etkisiz değil; 7 · 0 = 0.',
      ),
      kart(
        'Kapalılık: sonuç kümeden çıkıyor mu',
        '3 − 5 = −2. İki doğal sayıyı çıkardın, sonuç doğal değil; doğal sayılar çıkarmaya kapalı değil. 3 + 5 = 8 yine doğal; toplamaya kapalı. Kapalı, yani sonuç hep aynı kümede kalıyor.',
        undefined,
        { not: 'Kapalı mı diye sorulunca kümeden dışarı çıkan tek bir örnek ara; bulursan kapalı değil.' },
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
      soru('√2 rasyonel bir sayıdır.', false, 'Ondalık açılımı ne bitiyor ne de tekrar ediyor; kesre çevrilemez, irrasyonel.'),
      soru('Çıkarma işleminin değişme özelliği vardır.', false, '5 − 3 ile 3 − 5 aynı değil; değişme özelliği toplama ve çarpmada var.'),
      soru('Doğal sayılar kümesi çıkarma işlemine göre kapalı değildir.', true, '3 − 5 = −2 doğal sayı değil; sonuç kümenin dışına çıkıyor.'),
      sikli('√2 hangi kümeye girer?', ['İrrasyonel', 'Rasyonel'], 0, 'Kesir yazılamaz, açılım tekrar etmez.'),
      sikli('Çarpmada etkisiz eleman?', ['1', '0'], 0, '7 · 1 = 7; toplamada 0.'),
      sikli('3 − 5 işlemi doğal sayılarda kapalı mı?', ['Hayır, sonuç −2', 'Evet, sonuç 2'], 0, 'Sonuç kümeden dışarı çıkıyor.'),
      sikli('Sayma sayıları ile doğal sayıları ayıran?', ['Sıfır', 'Negatifler'], 0, 'Doğal sayılar sıfırı içerir.'),
      sikli('3 · (4 + 5) = 3·4 + 3·5 hangi özelliktir?', ['Birleşme', 'Dağılma'], 1, 'Çarpan içeriye dağılıyor.'),
      soru('Çarpmada etkisiz eleman 0\'dır.', false, '7 · 0 = 0, sayı yok oldu; çarpmada etkisiz eleman 1.'),
      soru('(2 + 3) + 4 = 2 + (3 + 4) eşitliği birleşme özelliğidir.', true, 'Parantez kayıyor, sonuç 9 kalıyor.'),
    ], [
      {
        soru: '0,333… (devirli) sayısı hangi kümeye girer?',
        siklar: ['İrrasyonel', 'Rasyonel'],
        dogru: 1,
        aciklama: {
          dogru: 'Tekrar eden açılım 1/3 kesri olarak yazılır; kesir yazılabiliyorsa rasyonel.',
          yanlis: 'İrrasyonelin açılımı sonsuz ve tekrarsızdır (π, √2). 0,333… = 1/3, yani rasyonel.',
        },
        kart: 3,
      },
    ]),
    konu('mat9-cebirsel-ifade', 'İşlem Özelliklerini Cebirsel Olarak İfade Etme', [
      kart(
        'Harf, "her sayı için" demenin kısa yolu',
        '2 + 3 = 3 + 2, 7 + 1 = 1 + 7, 10 + 4 = 4 + 10… Sonsuz tane böyle eşitlik var. Hepsini tek satırda söylemek için harf kullanırsın: a + b = b + a. a ve b yerine istediğin sayıyı koy.',
      ),
      kart(
        '3x² + 5x − 2 üç terimden oluşur',
        'Artı ve eksiyle ayrılan parçalar terim: 3x², 5x ve −2. Harfin önündeki sayı katsayı: 3 ve 5. Yerine sayı gelen harf değişken: x. Harfi olmayan parça sabit terim: −2.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Benzer terimleri toplayabilirsin',
        '3 elma + 5 elma = 8 elma; aynı şekilde 3x + 5x = 8x. Benzer terim, yani harfi ve üssü aynı olan terimler. 3x + 5x² toplanmaz: x ile x² farklı şeyler, ifade öyle kalır.',
      ),
      kart(
        'Dağılma parantezi açar',
        '2(x + 5) = 2x + 10. Parantezin önündeki 2, içerideki her terimle ayrı ayrı çarpılır. Önde eksi varsa her işaret değişir: −(x − 3) = −x + 3. −x − 3 yazma.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Ortak çarpan, dağılmanın tersidir',
        '6x + 9 ifadesinde iki terim de 3\'e bölünüyor. 3\'ü dışarı al: 3(2x + 3). Kontrol için dağıt: 3·2x + 3·3 = 6x + 9. Aynı eşitliği sağdan sola okudun.',
      ),
      kart(
        'Örüntüyü harfle yazınca kural olur',
        '1 + 3 = 4, 1 + 3 + 5 = 9, 1 + 3 + 5 + 7 = 16. Sonuçlar 2², 3², 4². Harfle yaz: ilk n tek sayının toplamı n². Artık yalnızca dört örnek için değil, her n için bir iddia.',
      ),
      kart(
        'Tek karşı örnek kuralı çürütür',
        '"Her asal sayı tektir" dedin. 2 asal ama çift; kural bitti. Bir kuralı yıkmak için tek örnek yeter. Kurmak için ise on örnek de yetmez, ispat gerekir.',
        undefined,
        { not: 'Bir kural gördüğünde önce onu bozan bir sayı ara; bulamıyorsan bile "örnekler tuttu" ispat değildir.' },
      ),
    ], [
      soru('3x ile 3x² benzer terimdir.', false, 'Benzer terimde harf ve üs aynı olmalı; burada üsler farklı.'),
      soru('2(x + 5) = 2x + 10 dur.', true, 'Dağılma: 2, parantezdeki iki terimle de çarpılıyor.'),
      soru('Bir kuralın yanlış olduğunu göstermek için tek bir karşı örnek yeter.', true, 'Kural her sayı için geçerli olmalı; tutmadığı tek örnek onu çürütür.'),
      soru('5x ifadesinde 5 değişken, x katsayıdır.', false, 'Tersi: 5 katsayı, x değişken.'),
      sikli('3x² + 5x − 2 ifadesinde sabit terim?', ['−2', '3'], 0, 'Harfi olmayan terim.'),
      sikli('6x + 9 = 3(2x + 3) işlemi nedir?', ['Ortak çarpan parantezine alma', 'Dağılma'], 0, 'Dağılmanın ters yönü.'),
      sikli('Bir kuralı çürütmek için ne yeter?', ['Tek karşı örnek', 'Birçok örnek'], 0, 'Doğrulamak için ispat gerekir.'),
      soru('−(x − 3) = −x + 3\'tür.', true, 'Parantez önündeki eksi her işareti değiştirir.'),
    ], [
      {
        soru: '3x + 5x² ifadesi sadeleşir mi?',
        siklar: ['Hayır, üsleri farklı', 'Evet, 8x³'],
        dogru: 0,
        aciklama: {
          dogru: 'Benzer terim için harf ve üs aynı olmalı; x ile x² farklı.',
          yanlis: 'Toplamada üsler toplanmaz. x ve x² benzer terim değil; ifade olduğu gibi kalır.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('mat9-t2', 'Nicelikler ve Değişimler', [
    konu('mat9-dogrusal', 'Doğrusal Fonksiyonlar ve Nitel Özellikleri', [
      kart(
        'Fonksiyon her girdiye tek çıktı verir',
        'Otomata 1 lira atarsın, bir çikolata düşer. Aynı paraya bazen iki bazen hiç düşse otomat bozuk. Fonksiyon da böyle bir kural: her girdiye tam olarak bir çıktı. f(x) = 2x: 3 girer, 6 çıkar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Dikey çizgi iki kez keserse fonksiyon değil',
        'Grafiğe dikey bir çizgi çek. Çizgi grafiği iki yerden kesiyorsa aynı x\'e iki y düşüyor demek; bu fonksiyon olamaz. Her dikey çizgi en çok bir kez kesiyorsa grafik bir fonksiyona ait.',
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
        'Tanım kümesi girenler, görüntü çıkanlar',
        'f(x) = 1/x kuralına 0 giremez, çünkü 1/0 tanımsız. Girebilen sayıların kümesine tanım kümesi denir. Çıkan değerlerin kümesine de görüntü kümesi: f(x) = 2x için 3 girince 6 çıkar, 6 görüntü.',
      ),
      kart(
        'Doğrusal fonksiyonun grafiği bir doğrudur',
        'f(x) = 2x − 1 için x = 0, 1, 2 koy: y = −1, 1, 3 çıkar. Noktaları işaretle, hepsi bir doğru üstünde. f(x) = ax + b biçimindeki her fonksiyona doğrusal denir; burada a = 2, b = −1.',
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
        'Eğim: sağa bir adımda kaç yukarı',
        'f(x) = 2x − 1\'de x 1 artınca y 2 artıyor: 1\'den 3\'e, 3\'ten 5\'e. Bu sayıya eğim denir ve a\'nın ta kendisi. Eğim, yani x bir birim artınca y\'nin ne kadar değiştiği.',
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
        { not: 'a sayısını "sağa bir adım, yukarı kaç adım" diye oku; formülü unutsan da bu kalır.' },
      ),
      kart(
        'a pozitifse artan, negatifse azalan',
        'f(x) = 2x + 1: x büyüdükçe y büyüyor, doğru soldan sağa çıkıyor; artan. f(x) = −2x + 1: x büyüdükçe y küçülüyor, doğru iniyor; azalan. Bakacağın tek şey a\'nın işareti.',
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
        'b, doğrunun y eksenini kestiği yerdir',
        'f(x) = 2x − 1\'e x = 0 koy: y = −1. Doğru y eksenini −1\'de kesiyor, bu b. x eksenini kestiği yer için y = 0 yaz: 2x − 1 = 0, x = 1/2. Eksenleri kesen iki nokta bunlar.',
      ),
      kart(
        'İki noktadan eğim bulmak',
        '(1, 3) ve (3, 7) noktalarına bak. x 1\'den 3\'e: 2 arttı. y 3\'ten 7\'ye: 4 arttı. Eğim = 4/2 = 2. Genel hâli: eğim = (y₂ − y₁) / (x₂ − x₁). Sırayı iki tarafta aynı tut.',
      ),
      kart(
        'Sabit fonksiyon yatay bir çizgidir',
        'f(x) = 3: ne girersen gir 3 çıkar. x 1 artınca y hiç değişmiyor, eğim 0. Grafik x eksenine paralel yatay bir doğru; x eksenini hiç kesmez.',
      ),
      kart(
        'Taksi ücreti bir doğrusal fonksiyondur',
        'Açılış 25 lira, her kilometre 8 lira: f(x) = 8x + 25. Hiç yol gitmeden ödediğin 25, b. Her kilometrede eklenen 8, a yani eğim. Soruda "başlangıç" gördüğünde b, "her birimde" gördüğünde a.',
      ),
      kart(
        'Grafiğe bakınca üç şeyi oku',
        'Doğru y eksenini 2\'de kesiyor: b = 2. Sağa 1 gidince 3 yukarı çıkıyor: a = 3. Doğru yükseliyor: artan. Fonksiyon f(x) = 3x + 2. Denklem verilmese de grafik üçünü söyler.',
      ),
    ], [
      soru(
        'Grafiği çizilen bağıntı bir fonksiyondur.',
        false,
        'Dikey çizgi testi: bir x değerine iki y düşüyor, yani bu bir fonksiyon değil.',
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
      soru('Sabit fonksiyonun grafiği x eksenine paralel bir doğrudur.', true, 'Her x için aynı değer çıkıyor, yani grafik yatay bir doğru.'),
      sikli('Bir girdiye iki çıktı veren kural?', ['Fonksiyondur', 'Fonksiyon değildir'], 1, 'Fonksiyon tam olarak bir çıktı verir.'),
      sikli('f(x) = 1/x için hangi değer tanımlı değildir?', ['1', '0'], 1, '1/0 tanımsız.'),
      sikli('f(x) = ax + b\'de b nedir?', ['Eğim', 'y eksenini kestiği değer'], 1, 'a eğim.'),
      sikli('f(x) = 3 fonksiyonunun grafiği?', ['Dikey doğru', 'Yatay doğru'], 1, 'Sabit fonksiyon, eğim 0.'),
      sikli('(1, 3) ve (3, 7) noktalarından geçen doğrunun eğimi?', ['2', '4'], 0, 'y 4 arttı, x 2 arttı: 4/2.'),
      sikli('x eksenini kestiği nokta nasıl bulunur?', ['f(x) = 0 çözülür', 'x = 0 yazılır'], 0, 'x = 0 y eksenini kestiği yeri verir.'),
      sikli('Eğim 2 ise x bir birim artınca y?', ['2 artar', '2 azalır'], 0, 'Sağa bir, yukarı iki.'),
      soru('Eğimi pozitif olan doğrusal fonksiyon azalandır.', false, 'a > 0 ise artandır; doğru soldan sağa çıkar.'),
    ], [
      {
        soru: 'f(x) = −3x + 2 fonksiyonu nasıldır?',
        siklar: ['Artan', 'Azalan'],
        dogru: 1,
        aciklama: {
          dogru: 'a = −3 negatif; x arttıkça y düşer.',
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
        'Mutlak değer, sıfıra olan uzaklıktır',
        '|−3| = 3 ve |3| = 3. İkisi de sayı doğrusunda sıfırdan 3 adım uzakta; hangi yönde olduğu sorulmaz. Uzaklık eksi olamayacağı için mutlak değer de hiç eksi çıkmaz.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İçerideki sayı eksiyse işareti atarsın',
        'x sıfır ya da pozitifse |x| = x, olduğu gibi kalır. x negatifse |x| = −x: |−7| = −(−7) = 7. Buradaki −x\'i "negatif sayı" sanma; x zaten eksiyken −x artıdır.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Grafiği V harfi gibidir',
        'y = |x| için x = −2, −1, 0, 1, 2 koy: y = 2, 1, 0, 1, 2. Sağ taraf y = x doğrusu, sol taraf y = −x doğrusu. İkisi sıfırda birleşir; o köşeye kırılma noktası denir.',
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
        'İçerideki sayı grafiği yana kaydırır',
        'y = |x − 2| sıfır olur mu? x = 2\'de olur. Kırılma noktası 2\'ye taşındı: V sağa 2 birim kaydı. y = |x| + 3 ise V\'yi 3 yukarı kaldırır. İçerideki sayı yatay, dışarıdaki dikey oynatır.',
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
        '|x| = 5 denkleminin iki çözümü var',
        'Sıfıra uzaklığı 5 olan iki sayı var: 5 ve −5. O yüzden |x| = 5 için x = 5 ya da x = −5. |x| = −5 sorulursa hiç çözüm yok: uzaklık eksi olamaz.',
      ),
      kart(
        '|x| < 3 ise sıfırın etrafında tek parça',
        'Sıfıra uzaklığı 3\'ten küçük sayılar: −3 ile 3 arasındakiler. Çözüm −3 < x < 3, tek parça. Küçüktür eşitsizliği sayıyı sıfırın yakınına hapseder.',
        {
          tur: 'sayiDogrusu',
          aralik: [-5, 5],
          isaretler: [-3, 0, 3],
          parcalar: [{ bas: -3, bit: 3, ad: '|x| < 3' }],
        },
      ),
      kart(
        '|x| > 3 ise iki ayrı parça',
        'Sıfıra uzaklığı 3\'ten büyük sayılar iki yanda: 4, 5, 6… ve −4, −5, −6… Çözüm x < −3 veya x > 3. En sık yapılan hata bunu −3 < x < 3 diye yazmak.',
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
        '|x − 5| ifadesini uzaklık diye oku',
        '|x − 5| demek "x ile 5 arasındaki uzaklık". |x − 5| < 2 dendiğinde x, 5\'e 2 birimden yakın: 3 ile 7 arasında. Ezber yok, sayı doğrusunda 5\'in iki yanına 2 adım at.',
        undefined,
        { not: 'Eşitsizliği açmadan önce "hangi sayıya ne kadar uzak" diye sor; cevabı sayı doğrusunda göreceksin.' },
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
      soru('|x| = −5 denkleminin iki çözümü vardır.', false, 'Uzaklık eksi olamaz; denklemin hiç çözümü yok.'),
      soru(
        'Çizimdeki çözüm kümesi |x| < 3 eşitsizliğine aittir.',
        true,
        'Sıfıra 3 birimden yakın sayılar, tek parça.',
        {
          tur: 'sayiDogrusu',
          aralik: [-5, 5],
          isaretler: [-5, -3, 0, 3, 5],
          parcalar: [{ bas: -3, bit: 3, kapaliBas: false, kapaliBit: false }],
        },
      ),
      soru('|x| > 2 eşitsizliğinin çözümü tek bir aralıktır.', false, 'Çözüm iki ayrı parça: x < −2 veya x > 2.'),
      sikli('|x| = −2 denkleminin çözümü?', ['x = −2', 'Yoktur'], 1, 'Uzaklık eksi olamaz.'),
      sikli('|x − 2| grafiği |x|\'e göre nasıl kayar?', ['Yukarı 2', 'Sağa 2'], 1, 'İçerideki sayı yatay kaydırır.'),
      sikli('|x − 5| < 2 ne demektir?', ['x, 5\'ten büyük', 'x, 5\'e 2 birimden yakın'], 1, 'Uzaklık okuması: 3 ile 7 arası.'),
      sikli('|x| < 3 eşitsizliğinin çözümü?', ['x < 3', '−3 < x < 3'], 1, 'Sıfırın etrafında tek parça.'),
      soru('|x| = 4 denkleminin iki çözümü vardır.', true, '4 ve −4, ikisi de sıfıra 4 uzakta.'),
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
        'Cümleyi denkleme çevir',
        '"Bir sayının 3 fazlası 11" cümlesi: x + 3 = 11. Bilinmeyen sayıya x de. "Fazlası" artı, "katı" çarpı, "eşittir" eşittir işareti. Denklem, yani içinde bilinmeyen olan eşitlik.',
      ),
      kart(
        'Denklem bir terazidir',
        'x + 3 = 11: iki kefeden de 3 al, x = 8 kalır. 2x = 8: iki kefeyi de ikiye böl, x = 4. İki tarafa aynı şeyi yaparsan denge bozulmaz. Çözmek, x\'i tek başına bırakmak demek.',
      ),
      kart(
        'Negatifle çarpınca eşitsizlik döner',
        '−2x < 6 eşitsizliğinde iki tarafı −2\'ye böl; işaret ters döner: x > −3. Neden? 2 < 3 doğru ama −2 > −3. Kontrol et: x = 0 koy, 0 < 6 tutuyor.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Eşitsizliğin çözümü bir aralıktır',
        'x + 3 = 11 tek sayı verir: 8. x > −3 ise sonsuz sayı verir: −2, 0, 100… Sayı doğrusunda −3\'e boş nokta koy, sağa doğru boya. −3 dâhil değil, çünkü işaret ≥ değil >.',
        {
          tur: 'sayiDogrusu',
          aralik: [-6, 6],
          isaretler: [-3, 0, 3],
          parcalar: [{ bas: -3, bit: null, kapaliBas: false, ad: 'x > −3' }],
        },
      ),
      kart(
        '0 = 5 kalırsa çözüm yok, 0 = 0 kalırsa hepsi',
        '3x + 5 = 3x + 10: iki taraftan 3x gider, 5 = 10 kalır. Bu hiç doğru olmaz; çözüm yok. 3x + 5 = 3x + 5: 0 = 0 kalır, her zaman doğru; her sayı çözüm.',
      ),
      kart(
        'Cevabı probleme geri götür',
        'Kişi sayısı 4,5 mi çıktı? Yarım kişi olmaz, denklemi yanlış kurmuşsun. Yaş −3 mü çıktı? Olmaz. Denklem doğru çözülmüş olsa bile sonuç problemde anlamsızsa cevap değildir.',
        undefined,
        { not: 'Sayıyı bulunca soruya dön ve sor: bu sayı bu problemde olabilir mi? Olamıyorsa kurulumu yeniden kontrol et.' },
      ),
      kart(
        'Doğru orantıda oran sabit, tersinde çarpım',
        '3 kalem 12 lira; 5 kalem? Bir kalem 4 lira, 5 kalem 20. Biri artınca öteki de artıyor: doğru orantı, oran sabit. 4 işçi 6 günde bitiriyor; 8 işçi? Çarpım 24 sabit: 3 gün. Ters orantı.',
      ),
      kart(
        'Yüzde artış çarpmakla olur',
        '200 liraya %20 zam: 200 · 1,2 = 240. %20 indirim: 0,8 ile çarp. 100 lira önce %20 artıp sonra %20 düşerse 120 → 96 olur; başa dönmez, çünkü indirim büyümüş fiyattan alınır.',
      ),
    ], [
      soru('Bir eşitsizliğin iki tarafı negatif bir sayıyla çarpılırsa eşitsizliğin yönü değişir.', true, 'Negatifle çarpmak sıralamayı ters çeviriyor: 2 < 3 iken −2 > −3.'),
      soru('3x + 5 = 3x + 5 denkleminin çözümü yoktur.', false, 'İki taraf birebir aynı, 0 = 0 kalır; her sayı çözüm.'),
      soru('Kişi sayısı için kurulan bir denklemin çözümü 4,5 çıkarsa sonuç kabul edilir.', false, 'Kişi sayısı tam sayı olmalı; sonuç denklemin yanlış kurulduğunu söylüyor.'),
      soru('Yüzde 20 indirimden sonra yüzde 20 zam yapılırsa ilk fiyata dönülür.', false, 'Zam küçülmüş fiyat üzerinden alınıyor: 100 → 80 → 96.'),
      soru('x/3 = 4/6 orantısında x = 2 dir.', true, 'İçler dışlar çarpımı: 6x = 12, yani x = 2.'),
      sikli('Bilinmeyen sadeleşip 0 = 5 kalırsa?', ['Her sayı çözümdür', 'Çözüm yoktur'], 1, '0 = 5 hiç doğru olmaz; 0 = 0 kalsaydı her sayı olurdu.'),
      sikli('%20 artış hangi sayıyla çarpmaktır?', ['0,2', '1,2'], 1, '200 · 1,2 = 240.'),
      sikli('Ters orantıda ne sabit kalır?', ['Oran', 'Çarpım'], 1, 'Doğru orantıda oran sabit.'),
      soru('%20 artıp %20 azalan sayı başlangıca döner.', false, '1,2 · 0,8 = 0,96; başlangıcın altında kalır.'),
    ], [
      {
        soru: '−2x < 6 eşitsizliğinin çözümü?',
        siklar: ['x > −3', 'x < −3'],
        dogru: 0,
        aciklama: {
          dogru: 'Negatifle bölünce yön değişir.',
          yanlis: 'İki taraf −2\'ye bölünürken eşitsizlik yön değiştirir: x > −3. Kontrol: x = 0 için 0 < 6 doğru.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('mat9-t3', 'Geometrik Şekiller', [
    konu('mat9-ucgen-ozellik', 'Üçgende Açı ve Kenarla İlgili Özellikler', [
      kart(
        'Üçgenin iç açıları 180° eder',
        'İki açısı 50° ve 60° olan üçgenin üçüncü açısı 180 − 50 − 60 = 70°. Kâğıttan bir üçgen kes, üç köşesini yan yana koy: düz bir çizgi olur, yani 180°.',
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
        'Dış açı, karşıdaki iki iç açının toplamı',
        'İç açılar 50°, 60°, 70° olsun. Bir kenarı uzatınca köşede oluşan açıya dış açı denir. 70°\'lik köşenin dış açısı 180 − 70 = 110°; bu da 50 + 60. Üç dış açının toplamı 360°.',
      ),
      kart(
        'Büyük açının karşısında büyük kenar',
        'Açıları 30°, 60°, 90° olan üçgende en uzun kenar 90°\'nin karşısında, en kısası 30°\'nin. Kapı gibi düşün: açı ne kadar açılırsa karşıdaki uç o kadar uzaklaşır.',
      ),
      kart(
        'İki kenarın toplamı üçüncüden büyük olmalı',
        '3, 4 ve 8 uzunluğunda çubuklarla üçgen yapmaya çalış: 3 + 4 = 7, 8\'e yetişmez, çubuklar birleşmez. 3, 4, 7 de olmaz; uçlar ancak düz çizgide değer. Üçgen için toplam üçüncüyü geçmeli.',
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
        'Üçüncü kenar farkla toplam arasında',
        'İki kenar 4 ve 9 olsun. Üçüncü kenar 9 − 4 = 5\'ten büyük, 9 + 4 = 13\'ten küçük olmalı: 5 < c < 13. Genel hâli |a − b| < c < a + b. Uçlar dâhil değil.',
        undefined,
        { not: 'Uçların dâhil olmadığını unutma; tam sayı sorularında hata hep uçlarda çıkıyor.' },
      ),
      kart(
        'Tam sayı soruları uçları almaz',
        '5 < c < 13 aralığında tam sayılar: 6, 7, 8, 9, 10, 11, 12. Yedi değer. 5 ile 13\'ü sayarsan dokuz bulursun, yanlış: onlar üçgeni düz çizgiye çevirir.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Üçgenler kenara ve açıya göre adlanır',
        'Üç kenar eşitse eşkenar, ikisi eşitse ikizkenar, hepsi farklıysa çeşitkenar. Açıya göre: bir açı 90° ise dik üçgen. Bir açı 90°\'den büyükse geniş açılı, hepsi 90°\'den küçükse dar açılı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İkizkenarda eşit kenarların karşısı eşit açı',
        'Kenarları 5, 5, 6 olan üçgende 6\'nın iki ucundaki açılar eşittir. 5\'lerin buluştuğu köşe tepe; tepeden inen yükseklik tabanı tam ortadan böler ve tepe açısını ikiye ayırır.',
      ),
      kart(
        'Bir köşeden üç ayrı çizgi iner',
        'Köşeden karşı kenara dik inen çizgi yükseklik. Kenarın tam ortasına giden çizgi kenarortay. Açıyı ikiye bölen çizgi açıortay. Genelde üçü ayrı çizgi; eşkenar üçgende üçü üst üste biner.',
      ),
      kart(
        'Ağırlık merkezi kenarortayı 2/1 böler',
        'Üç kenarortay tek noktada kesişir; adı ağırlık merkezi (G). Kenarortay 12 birimse köşeden G\'ye 8, G\'den kenara 4 birim. Köşeye yakın parça hep iki kat uzun.',
      ),
      kart(
        'Alan: taban çarpı yükseklik bölü iki',
        'Tabanı 6, yüksekliği 4 olan üçgenin alanı 6 · 4 / 2 = 12. Yükseklik tabana dik olan uzunluk. Yan kenar 5 diye verilmişse onu kullanma; yan kenar yükseklik değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
    ], [
      soru('Kenar uzunlukları 3, 4 ve 8 olan bir üçgen çizilebilir.', false, '3 + 4 = 7 < 8; iki kenar üçüncüyü kapatamıyor.'),
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
      soru('Eşkenar üçgende yükseklik, kenarortay ve açıortay farklı çizgilerdir.', false, 'Eşkenar üçgende her köşe için üçü de aynı çizgi.'),
      sikli('Bir üçgenin dış açıları toplamı?', ['180°', '360°'], 1, 'İç açılar 180°, dış açılar 360°.'),
      sikli('Bir dış açı neye eşittir?', ['Komşu iç açıya', 'Komşu olmayan iki iç açının toplamına'], 1, '110° = 50° + 60°.'),
      sikli('En küçük açının karşısında?', ['En uzun kenar', 'En kısa kenar'], 1, 'Açı ile karşı kenar aynı yönde değişir.'),
      sikli('İkizkenar üçgende tepeden inen yükseklik aynı zamanda?', ['Yalnızca yükseklik', 'Açıortay ve kenarortay'], 1, 'Tabanı ortalar, açıyı böler.'),
      sikli('Kenarları 4 ve 9 olan üçgende tam sayı üçüncü kenar kaç değer alır?', ['7', '9'], 0, '6\'dan 12\'ye yedi değer; uçlar alınmaz.'),
      sikli('Alan formülünde yükseklik nedir?', ['Tabana dik uzaklık', 'Yan kenar'], 0, 'Yan kenar yükseklik değil.'),
      sikli('Bütün kenarları farklı üçgen?', ['Çeşitkenar', 'İkizkenar'], 0, 'İkizkenarda iki kenar eşit.'),
      soru('Kenarortay kenarı ortalar, açıortay açıyı böler.', true, 'Genelde farklı çizgiler.'),
    ], [
      {
        soru: 'Kenarları 4 ve 9 olan üçgenin üçüncü kenarı hangi aralıktadır?',
        siklar: ['4 < c < 9', '5 < c < 13'],
        dogru: 1,
        aciklama: {
          dogru: '9 − 4 < c < 9 + 4.',
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
        'Öteleme şekli olduğu gibi kaydırır',
        'Masadaki kitabı 4 birim sağa it: aynı kitap, aynı boy, aynı duruş; yalnızca yeri değişti. Buna öteleme denir. Koordinatta her nokta aynı miktar kayar: (x, y) → (x + 4, y).',
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
        'Yansıma ayna görüntüsü alır',
        'Aynada sağ elin sol el gibi görünür ama boyun değişmez. Yansıma da böyle: bir doğruya göre şeklin ayna görüntüsünü alırsın. Şekil ters döner, bütün uzunluklar ve açılar aynı kalır.',
      ),
      kart(
        'Döndürme bir nokta etrafında çevirir',
        'Saatin ibresi merkez etrafında döner. Bir şekli döndürmek için üç şey söylemelisin: hangi noktanın etrafında (merkez), kaç derece (açı), hangi yöne (saat yönü mü tersi mi).',
      ),
      kart(
        'Koordinatta yansıma işareti değiştirir',
        '(3, 2) noktasını x eksenine göre yansıt: y işaret değiştirir, (3, −2). y eksenine göre yansıt: x değişir, (−3, 2). Orijin etrafında 180° döndür: ikisi de değişir, (−3, −2).',
        {
          tur: 'tablo',
          basliklar: ['Dönüşüm', '(x, y) → ', 'Örnek (3, 2)'],
          satirlar: [
            ['x eksenine yansıma', '(x, −y)', '(3, −2)'],
            ['y eksenine yansıma', '(−x, y)', '(−3, 2)'],
            ['Orijine göre 180°', '(−x, −y)', '(−3, −2)'],
            ['Öteleme (a, b)', '(x+a, y+b)', 'a=1, b=1: (4, 3)'],
          ],
        },
      ),
      kart(
        'Bu üç dönüşüm boyu korur',
        'Ötelenen, yansıtılan ya da döndürülen üçgeni kesip orijinalin üstüne koy: tam çakışır. Boyu ve açıları aynı kalan şekillere eş denir; bu üç dönüşüme de eşlik dönüşümü.',
      ),
      kart(
        'Ölçekleme büyütür ya da küçültür',
        'Fotoğrafı iki kat büyüt: her kenar iki kat uzar, açılar aynı kalır, yüz yine aynı yüz. Buna ölçekleme (homoteti) denir. Sonuç eş değil benzer şekil: biçim aynı, boy farklı.',
      ),
      kart(
        'Dönüşümlerin sırası sonucu değiştirir',
        '(1, 0) noktasını önce orijin etrafında 90° döndür: (0, 1). Sonra 2 sağa öteler: (2, 1). Sırayı çevir: önce ötele (3, 0), sonra döndür (0, 3). İki farklı nokta çıktı.',
        undefined,
        { not: 'İki dönüşüm verildiğinde hangisinin önce olduğunu soruda bul; sırayı değiştirirsen başka bir noktaya varırsın.' },
      ),
      kart(
        'Simetri ekseni şekli ikiye katlar',
        'Kâğıttan bir kalp kes, ortadan katla: iki yarı üst üste gelir. Katlama çizgisi simetri ekseni. Eşkenar üçgende üç, karede dört simetri ekseni var; dikdörtgende iki, köşegenler değil.',
      ),
    ], [
      soru('Öteleme şeklin boyutunu ve açılarını değiştirmez.', true, 'Şekil yalnızca yer değiştiriyor; öteleme bir eşlik dönüşümü.'),
      soru('(x, y) noktasının y eksenine göre yansıması (x, −y) olur.', false, 'y eksenine göre yansımada x işaret değiştirir: (−x, y).'),
      soru('Ölçekleme açıları korur, kenar uzunluklarını aynı oranda değiştirir.', true, 'Şeklin biçimi aynı kalıyor, yalnızca boyu değişiyor.'),
      soru('Karenin simetri ekseni sayısı ikidir.', false, 'Karede dört simetri ekseni var: iki köşegen ve kenarların ortasından geçen iki çizgi.'),
      sikli('Bir doğruya göre ayna görüntüsü alma?', ['Yansıma', 'Öteleme'], 0, 'Şekil ters döner.'),
      sikli('Döndürmede neler belirtilmelidir?', ['Merkez, açı ve yön', 'Yalnızca açı'], 0, 'Üçü birlikte.'),
      sikli('Eşkenar üçgenin kaç simetri ekseni vardır?', ['3', '1'], 0, 'Her köşeden bir tane.'),
      sikli('Önce döndürüp sonra ötelemek ile tersi?', ['Farklı sonuç verebilir', 'Hep aynı sonuç'], 0, 'Sıra önemli.'),
      soru('Öteleme şeklin boyutunu değiştirir.', false, 'Yalnızca yer değişir.'),
    ], [
      {
        soru: 'Hangi dönüşüm uzunlukları korumaz?',
        siklar: ['Yansıma', 'Ölçekleme (homoteti)'],
        dogru: 1,
        aciklama: {
          dogru: 'Ölçekleme boyu değiştirir, açıları korur; sonuç benzer şekil.',
          yanlis: 'Yansıma eşlik dönüşümü, bütün ölçüleri korur. Boyu değiştiren ölçekleme.',
        },
        kart: 6,
      },
    ]),
    konu('mat9-eslik-kosul', 'Eşlik ve Benzerlik Koşulları', [
      kart(
        'Eş şekiller üst üste tam çakışır',
        'Aynı kalıptan çıkmış iki anahtar: her diş, her açı aynı. Eşlik de bu: iki şeklin bütün karşılıklı kenarları ve açıları eşit. Birini ötekinin üstüne koysan hiçbir yer taşmaz. Sembolü ≅.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Üç uygun ölçü eşliği garantiler',
        'Kenarları 3, 4, 5 olan bir üçgen çiz; arkadaşın da çizsin. İkisi eş çıkar, üç kenar üçgeni tek biçimde belirler (KKK). İki kenar ve aradaki açı (KAK) ya da iki açı ve aradaki kenar (AKA) da yeter.',
        {
          tur: 'tablo',
          basliklar: ['Koşul', 'Bilinenler', 'Örnek'],
          satirlar: [
            ['KKK', 'Üç kenar', '3, 4, 5'],
            ['KAK', 'İki kenar + aradaki açı', '3, 90°, 4'],
            ['AKA', 'İki açı + aradaki kenar', '30°, 5, 60°'],
            ['HK (dik üçgen)', 'Hipotenüs + bir kenar', '5 ve 3'],
          ],
        },
      ),
      kart(
        'Üç açının eşitliği eşlik vermez',
        'Biri küçük biri büyük iki eşkenar üçgen düşün: ikisinin de açıları 60°, 60°, 60°. Ama biri ötekinin iki katı. Açılar biçimi söyler, boyu söylemez. AAA eşlik değil, benzerlik koşulu.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Benzer şekiller aynı biçim, farklı boy',
        'Fotoğrafın küçük baskısı: yüz aynı yüz, boy yarısı. Benzerlik bu: açılar eşit, karşılıklı kenarlar hep aynı oranda. Kenarlar 3, 4, 5 ile 6, 8, 10 olan üçgenler benzer; oran 2.',
      ),
      kart(
        'İki açı eşitse üçgenler benzerdir',
        'Bir üçgenin açıları 40° ve 60°, ötekininki de 40° ve 60° olsun. Üçüncü açı ikisinde de 180 − 100 = 80°; kendiliğinden geldi. O yüzden benzerlik için iki açı (AA) yeter.',
      ),
      kart(
        'Eşlik, oranı 1 olan benzerliktir',
        'Benzerlik oranı 2 ise kenarlar iki kat. Oran 1 ise kenarlar aynı, yani şekiller eş. Eşlik benzerliğin özel hâli: her eş şekil benzerdir, ama her benzer şekil eş değildir.',
      ),
      kart(
        'Yazım sırası eşleşmeyi söyler',
        'ABC ≅ DEF yazdın: A ile D, B ile E, C ile F eşleşir; AB kenarı DE\'ye eşit. ABC ≅ FED yazsaydın A ile F eşleşirdi, bambaşka bir iddia. Harfleri karşılıklı köşe sırasıyla yaz.',
      ),
      kart(
        'Ölçemediğini benzerlikle hesaplarsın',
        'Ağacın boyunu ölçemezsin ama gölgesini ölçersin. Aynı anda 1 metrelik çubuğun gölgesi 0,5 m, ağacınki 4 m. Güneş açısı aynı, iki üçgen benzer: ağaç 4 · (1/0,5) = 8 m.',
        undefined,
        { not: 'Gölge sorusunda iki gölgenin aynı anda ölçüldüğünü gör; güneş açısı aynı olmadan üçgenler benzer olmaz.' },
      ),
    ], [
      soru('İki üçgenin üç açısı da eşitse bu üçgenler eştir.', false, 'AAA eşlik değil benzerlik verir; aynı biçimde ama farklı boyda olabilirler.'),
      soru('Eşlik, benzerlik oranı 1 olan özel bir benzerliktir.', true, 'Eş şekiller hem aynı biçimde hem aynı boyda.'),
      soru('KKK, KAK ve AKA birer eşlik koşuludur.', true, 'Üçü de üçgeni tek bir biçimde belirliyor.'),
      soru('ABC ≅ DEF yazılışında A köşesi F köşesine karşılık gelir.', false, 'Yazım sırası eşleşmeyi verir: A ile D, B ile E, C ile F.'),
      sikli('Eşlik için en az kaç uygun ölçü gerekir?', ['3', '6'], 0, 'KAK, AKA, KKK.'),
      sikli('İki açısı eşit iki üçgen için ne söylenir?', ['Benzerdir', 'Eştir'], 0, 'AA yeter; üçüncü açı kendiliğinden gelir.'),
      sikli('Benzerlik oranı 1 olan benzerlik nedir?', ['Eşlik', 'Yansıma'], 0, 'Kenarlar aynı boyda.'),
      sikli('ABC ≅ DEF yazımında B kiminle eşleşir?', ['E', 'F'], 0, 'Sıra korunur.'),
      soru('Ağacın boyu gölgesinden benzerlikle hesaplanabilir.', true, 'Aynı anda ölçülen gölgeler benzer üçgen verir.'),
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
        'Paralel çizgi küçük bir benzer üçgen keser',
        'ABC üçgeninde AB kenarına paralel bir DE çizgisi çek. Üstte kalan küçük üçgenin açıları büyük üçgenle aynı; paralel çizgi açıları bozmaz. Aynı açılar demek benzer üçgen demek.',
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
        'Paralel kesen kenarları aynı oranda böler',
        'Tepeden D\'ye 2, D\'den tabana 4 olsun. Öteki kenarda da oran aynı: tepeden E\'ye 2 ise E\'den tabana 4. İkisi de 2/4. Adı temel benzerlik teoremi; Tales\'in üçgendeki hâli.',
      ),
      kart(
        'Benzerlik oranı her uzunlukta aynıdır',
        'Kenarları 3, 4, 5 ve 6, 8, 10 olan üçgenler: oran 2. Çevreleri 12 ve 24: yine 2. Yükseklikler de iki kat. Uzunluk olan her şey, yani kenar, çevre, yükseklik, aynı oranla büyür.',
      ),
      kart(
        'Alan oranı, oranın karesidir',
        '3, 4, 5 dik üçgeninin alanı 3·4/2 = 6. İki katı olan 6, 8, 10\'un alanı 6·8/2 = 24. Alan oranı 24/6 = 4, yani 2². Uzunluk oranı k ise alan oranı k². İki kat uzun, dört kat geniş.',
        undefined,
        { not: 'Soruda "oran 2" görünce alanı da 2 katı sanma: uzunluk k, alan k². Hangisinin verildiğini iki kez oku.' },
      ),
      kart(
        'Köşeleri doğru sırayla eşleştir',
        'ABC ~ DEF ise AB/DE = BC/EF = AC/DF. AB\'yi EF ile oranlarsan sonuç yanlış çıkar. Önce hangi açı hangisine eşit bul, eşit açıların karşısındaki kenarları birbirine oranla.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Kelebek şeklinde iki üçgen benzerdir',
        'İki doğru X gibi kesişince kesişme noktasındaki ters açılar eşittir. Uçtaki iki kenar birbirine paralelse iki üçgen kelebek kanadı gibi durur ve benzerdir: küçük kanat, büyük kanat.',
      ),
      kart(
        'Gölge boyu benzer üçgen kurar',
        '1,8 m boyunda birinin gölgesi 1,2 m; aynı anda ağacın gölgesi 4 m. Güneş açısı ikisinde aynı, üçgenler benzer. Oran 1,8/1,2 = 1,5; ağaç 4 · 1,5 = 6 m.',
      ),
    ], [
      soru(
        'Şekilde DE ∥ BC ise ADE üçgeni ABC üçgenine benzerdir.',
        true,
        'Paralellik açıları koruyor; küçük üçgenin açıları büyükle aynı.',
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
      soru('Kelebek benzerliğinde üçgenler ters yönde durduğu için benzer olamazlar.', false, 'Ters durmak benzerliği bozmaz; ters açılar ve paralellik eşit açılar veriyor.'),
      sikli('Bir kenara paralel kesen ne üretir?', ['Eş üçgen', 'Benzer küçük üçgen'], 1, 'Açılar korunur, boy küçülür.'),
      sikli('Benzerlik oranı k ise çevreler oranı?', ['k²', 'k'], 1, 'Çevre bir uzunluk; alan k².'),
      sikli('Gölge boyuyla ağaç boyunu bulmak neye dayanır?', ['Pisagor\'a', 'Benzer üçgenlere'], 1, 'Aynı anda ölçülen gölgeler aynı oranı verir.'),
      soru('Kelebek benzerliğinde ters açılar eşittir.', true, 'Kesişen iki doğru.'),
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
        'Paralel doğrular orantılı parçalar ayırır',
        'İki paralel çizgi, iki doğruyu kesiyor. Birinci doğruda parçalar 2 ve 4, ikincide 3 ve x olsun. Oranlar eşit: 2/4 = 3/x, x = 6. Buna Tales teoremi denir; paralel varsa oran var.',
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
        'Tales ile eksik uzunluğu bulursun',
        'Merdivenin basamakları paralel. Bir yan direkte iki basamak arası 3 ve 6, öteki direkte 2 ve x. Orantı kur: 3/6 = 2/x, x = 4. Ölçemediğin parçayı ölçebildiklerinden çıkarırsın.',
      ),
      kart(
        'Pisagor: dik kenarların kareleri toplamı',
        'Dik kenarları 3 ve 4 olan üçgende 3² + 4² = 9 + 16 = 25, karekökü 5: en uzun kenar 5. Dik açının karşısındaki bu kenara hipotenüs denir. Kural a² + b² = c², yalnızca dik üçgende.',
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
        'Pisagor üçlülerini tanı',
        '3-4-5, 5-12-13 ve 8-15-17 üçlüleri Pisagor\'u sağlar. Katları da sağlar: 6-8-10, 9-12-15. Soruda dik kenarlar 6 ve 8 görünce hesap yapma, hipotenüse 10 yaz.',
      ),
      kart(
        'Eşitlik tutuyorsa üçgen diktir',
        'Kenarları 5, 12, 13 olan üçgen: 25 + 144 = 169 = 13². Eşitlik tutuyor, üçgen dik; 90° 13\'ün karşısında. 4, 5, 6 için 16 + 25 = 41 ≠ 36, dik değil. Teoremin tersi böyle çalışır.',
      ),
      kart(
        'Öklid: yükseklik karesi, parçaların çarpımı',
        'Dik üçgende dik köşeden hipotenüse dik bir çizgi indir; hipotenüs iki parçaya bölünür. Parçalar 4 ve 9 ise yükseklik h için h² = 4 · 9 = 36, h = 6. Kural: h² = p · q.',
      ),
      kart(
        'Dik kenar karesi: parçası çarpı hipotenüs',
        'Parçalar 4 ve 9, hipotenüs 13. 4\'lük parçanın yanındaki dik kenar: a² = 4 · 13 = 52. Her dik kenar kendi altındaki parçayla eşleşir; 9\'un yanındaki için b² = 9 · 13.',
        undefined,
        { not: 'Öklid\'de hangi parçanın hangi kenarın altında olduğuna bak; yanlış parçayla çarpmak en sık hata.' },
      ),
      kart(
        'Özel dik üçgenleri ezberle',
        '30-60-90 üçgeninde kenarlar 1, √3, 2 oranında; en kısa kenar 30°\'nin karşısında. 45-45-90 üçgeninde 1, 1, √2. Kısa kenar 5 ise 30-60-90\'da hipotenüs 10, öteki kenar 5√3.',
      ),
      kart(
        'Yükseklik çizince üç benzer üçgen çıkar',
        'Dik üçgene hipotenüse inen yüksekliği çiz: büyük üçgen ve iki küçük üçgen. Üçünün açıları aynı, yani benzerler. Öklid bağıntıları bu benzer üçgenlerin oranlarından çıkıyor; ezber değil, oran.',
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
      soru('Kenarları a² + b² = c² şartını sağlayan üçgen dik üçgendir.', true, 'Teoremin tersi de doğru: eşitlik tutuyorsa c kenarını gören açı 90°.'),
      soru('Öklid bağıntıları dik olmayan üçgenlerde de kullanılır.', false, 'Öklid bağıntıları dik üçgende, hipotenüse indirilen yükseklikle kuruluyor.'),
      sikli('Hipotenüse indirilen yükseklik h ise h² neye eşittir?', ['p·q', 'p·c'], 0, 'p ve q hipotenüsteki iki parça.'),
      sikli('(5, 12, 13) üçlüsünün iki katı?', ['(10, 24, 26)', '(7, 14, 15)'], 0, 'Katlar da Pisagor üçlüsü.'),
      sikli('30-60-90 üçgeninde kenar oranı?', ['1, √3, 2', '1, 1, √2'], 0, '45-45-90\'da 1, 1, √2.'),
      sikli('a² + b² = c² sağlanıyorsa üçgen?', ['Diktir', 'Eşkenardır'], 0, 'Teoremin tersi.'),
      sikli('Paralel doğruların kestikleri doğrularda orantılı parça ayırması?', ['Öklid teoremi', 'Tales teoremi'], 1, 'Paralel varsa oran var.'),
      soru('45-45-90 üçgeninde hipotenüs, dik kenarın √2 katıdır.', true, 'Kenarlar 1, 1, √2 oranında.'),
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
        'Önce benzer üçgenleri bul, sonra oran kur',
        'DE ∥ BC, AD = 2, DB = 4, DE = 3; BC kaç? Benzer üçgenler ADE ve ABC. Eşleştir: AD ↔ AB, yani 2 ↔ 6; DE ↔ BC. Oran: 2/6 = 3/BC, BC = 9. Sıra hep bu: bul, eşleştir, oranla.',
      ),
      kart(
        'İç içe üçgenleri ayrı ayrı çiz',
        'Küçük ADE üçgenini kenara ayrı çiz, üstüne 2 ve 3 yaz. Büyük ABC\'yi ayrı çiz, 6 ve ? yaz. Hangi kenarın hangisiyle eşleştiği artık gözünün önünde; oranı yanlış kurma ihtimalin düşer.',
        undefined,
        { not: 'İç içe üçgeni ayırmadan oran kurma; yanlışların çoğu çizilmeyen şekilde başlıyor.' },
      ),
      kart(
        'Parçayı tam kenar sanma',
        'AD = 2 ile DB = 4\'ü oranlamak yanlış: DB bir kenar değil, kenarın parçası. Küçük üçgenin kenarı AD = 2, büyüğün kenarı AB = 2 + 4 = 6. Doğru oran 2/6, 2/4 değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Alan oranı, oranın karesidir',
        'Benzerlik oranı 1/2 olan iki üçgen: küçüğün alanı 5 ise büyüğün alanı 20. Çünkü alan oranı (1/2)² = 1/4. Uzunlukta k, alanda k²; iki kat kısa, dört kat küçük.',
      ),
      kart(
        'Hacim oranı, oranın küpüdür',
        'Bir maketin ölçeğini iki katına çıkar: eni, boyu, yüksekliği ikişer kat. Hacim 2 · 2 · 2 = 8 kat. 1 litrelik şişenin her yönden iki kat büyüğü 8 litre alır. Uzunluk k, hacim k³.',
      ),
      kart(
        'Harita ölçeği bir benzerlik oranıdır',
        '1/25.000 ölçekte haritadaki 1 cm gerçekte 25.000 cm. Metreye çevir: 100\'e böl, 250 m. 3 cm ise 750 m. Önce santimde çarp, sonra birimi çevir; sırayı karıştırınca sıfırlar kayar.',
      ),
      kart(
        'Fotoğraf büyütürken oran korunur',
        '10×15 cm fotoğrafı 20 cm genişliğe büyüt: oran 2, boy da 30 cm olmalı. 20×25 yaparsan yüz yamulur; çünkü kenarlar farklı oranda büyüdü, şekil artık benzer değil.',
      ),
    ], [
      soru('Benzer iki cismin hacimleri oranı benzerlik oranının küpüdür.', true, 'Üç boyut da aynı oranda büyüyor.'),
      soru('1/500 ölçekli haritada 3 cm olan yol gerçekte 1500 m dir.', false, '3 × 500 = 1500 cm, yani 15 m.'),
      soru('Boyu 1,8 m olan kişinin gölgesi 1,2 m iken 4 m gölgesi olan ağaç 6 m dir.', true, 'Aynı anda oran sabit: 1,8/1,2 = 1,5 ve 4 × 1,5 = 6.'),
      soru('Benzerlik oranı kurulurken hangi kenarın hangisiyle eşleştiği önemli değildir.', false, 'Oran yalnızca karşılıklı kenarlar arasında kurulur; parçayı tam kenar sanmak en sık hata.'),
      sikli('1/25.000 ölçekte haritadaki 1 cm gerçekte?', ['25 m', '250 m'], 1, '25.000 cm = 250 m.'),
      sikli('İç içe benzer üçgenlerde ilk yapılacak?', ['Alan hesaplamak', 'Şekli iki ayrı üçgene ayırmak'], 1, 'Eşleştirme hatasını bitirir.'),
      sikli('Benzerlik oranı 1/2 ise alan oranı?', ['1/2', '1/4'], 1, 'Alan k²: (1/2)² = 1/4.'),
      soru('AD = 2, DB = 4 ise küçük üçgenle büyük üçgenin oranı 2/6 dır.', true, 'Büyük üçgenin kenarı AB = 2 + 4 = 6; DB parça, kenar değil.'),
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
        'Algoritma, adım adım bir tariftir',
        'Çay demleme: suyu kaynat, çayı koy, 10 dakika bekle, bardağa dök. Algoritma, yani bir işi bitiren sıralı ve kesin adımlar listesi. Sırayı bozarsan çay çıkmaz.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'İyi algoritmanın üç özelliği',
        '"Biraz bekle" belirsiz, "10 dakika bekle" kesin. Her adım açık olmalı. Adımlar bir yerde bitmeli; sonsuz tarif olmaz. Aynı girdiyle her seferinde aynı sonuç çıkmalı.',
      ),
      kart(
        'Girdi girer, işlem yapılır, çıktı çıkar',
        'İki sayının ortalaması: girdi 4 ve 8, işlem topla ve ikiye böl, çıktı 6. Her algoritmada bu üç parça var. Soruda önce "ne giriyor, ne çıkıyor" diye bak.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Girdi', alt: '4 ve 8' },
            { ad: 'İşlem', alt: 'topla, ikiye böl' },
            { ad: 'Çıktı', alt: '6' },
          ],
        },
      ),
      kart(
        'Akış şemasında her şeklin bir işi var',
        'Oval başla ve bitir. Dikdörtgen bir işlem: "sayıyı 2 ile çarp". Eşkenar dörtgen bir soru, iki çıkışı var: "sayı > 0 mı? evet / hayır". Paralelkenar giriş ve çıkış.',
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
        'Üç yapı: sıralı, koşullu, tekrarlı',
        'Sıralı: adımlar arka arkaya. Koşullu: "yağmur yağıyorsa şemsiye al". Tekrarlı: "10 kez şınav çek"; buna döngü denir. Her algoritma bu üçünün karışımı.',
      ),
      kart(
        'Değişken, üstüne yazılan kutudur',
        'sayac = 0 yaz. Her adımda sayac = sayac + 1: kutunun adı aynı, içi 1, 2, 3 diye değişiyor. Değişken, yani içindeki değer değişebilen adlı kutu. Toplam ve sayaç hep böyle tutulur.',
      ),
      kart(
        'Döngü bitmezse sonsuz döngü olur',
        '"sayac < 5 olduğu sürece devam et" dedin ama sayacı artırmadın. Sayaç hep 0, koşul hep doğru, döngü hiç bitmez. Bir döngü yazınca "bunu ne durduracak" diye sor.',
        undefined,
        { not: 'Döngü sorusunda önce koşulu değiştiren adımı bul; yoksa cevap "sonsuz döngü".' },
      ),
      kart(
        'Bölme işlemi de bir algoritmadır',
        '27 ÷ 4: 4 kaç kez 27\'ye sığar? 6. 6 · 4 = 24. 27 − 24 = 3, kalan. Her adım kesin, iş bitiyor, aynı sayılarla aynı sonuç. Matematikte yaptığın işlemler zaten birer algoritma.',
      ),
    ], [
      soru('Akış şemasında karar noktası dikdörtgenle gösterilir.', false, 'Karar eşkenar dörtgenle çizilir; dikdörtgen işlem adımı.'),
      soru('Algoritmanın adımları belirsiz olabilir, önemli olan sonuca ulaşmaktır.', false, 'Her adım açık ve tek anlamlı olmalı; "biraz bekle" algoritma adımı değil.'),
      soru(
        'Her algoritmada girdi, işlem ve çıktı sırası vardır.',
        true,
        'Veri alınır, üzerinde işlem yapılır, sonuç verilir.',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Girdi' }, { ad: 'İşlem' }, { ad: 'Çıktı' }],
        },
      ),
      soru('Çıkış koşulu hiçbir zaman sağlanmayan bir döngü sonsuza kadar çalışır.', true, 'Koşulu değiştiren adım yoksa döngü hiç bitmez.'),
      sikli('Algoritmanın üç özelliğinden biri?', ['Sonlu olmak', 'Rastgele olmak'], 0, 'Açık adım, bir yerde bitmek, aynı girdide aynı sonuç.'),
      sikli('Değer tutan adlı kutu?', ['Değişken', 'Döngü'], 0, 'İçi değişebilir.'),
      sikli('Akış şemasında oval ne gösterir?', ['Başla ve bitir', 'İşlem'], 0, 'Dikdörtgen işlem.'),
      sikli('Her algoritma hangi üç yapının karışımıdır?', ['Sıralı, koşullu, tekrarlı', 'Girdi, işlem, çıktı'], 0, 'Temel yapılar.'),
      soru('Bölme işlemi de bir algoritmadır.', true, 'Adımları kesin ve sonlu.'),
    ], [
      {
        soru: 'Akış şemasında karar (koşul) hangi şekille gösterilir?',
        siklar: ['Eşkenar dörtgen', 'Dikdörtgen'],
        dogru: 0,
        aciklama: {
          dogru: 'Dikdörtgen işlem, eşkenar dörtgen karar.',
          yanlis: 'Dikdörtgen işlem adımı. Evet/hayır diye iki çıkışı olan karar eşkenar dörtgenle çizilir.',
        },
        kart: 4,
      },
    ]),
    konu('mat9-mantik', 'Mantık Bağlaçları ve Niceleyiciler', [
      kart(
        'Önerme: doğru ya da yanlış denebilen cümle',
        '"Ankara başkenttir" doğru, "5 çift sayıdır" yanlış; ikisi de önerme. "Kapıyı kapat!" ve "Saat kaç?" önerme değil, doğru mu yanlış mı diyemezsin. "Bu çiçek güzel" de değil; görüş.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Her önermenin değeri D ya da Y',
        'Bir önerme ya doğrudur (D) ya yanlıştır (Y); ortası yok. Önermeye p gibi bir harf verilir. p: "3 + 4 = 7" ise p\'nin değeri D. Bu değere doğruluk değeri denir.',
      ),
      kart(
        '"ve" için ikisi de doğru olmalı',
        '"Sınavı geçtim ve tam puan aldım" dedin. Geçtin ama tam puan yoksa cümle yanlış. p ∧ q ("p ve q") yalnızca ikisi de doğruyken doğru; biri bile yanlışsa yanlış.',
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
        '"veya" için biri yetmeli',
        '"Çay veya kahve içerim" dedin; ikisini de içsen yalan söylemiş olmazsın. p ∨ q ("p veya q") en az biri doğruysa doğru, ikisi de yanlışsa yanlış. Günlük dildeki "ya o ya bu" değil.',
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
        '"değil" değeri ters çevirir',
        'p: "5 tektir", değeri D. ¬p: "5 tek değildir", değeri Y. ¬ işareti "değil" demek ve değeri ters çevirir. İki kez uygularsan başa dönersin: ¬(¬p) = p.',
      ),
      kart(
        'p ⇒ q yalnızca bir durumda yanlış',
        'Söz: "Sınavı geçersen telefon alırım." Geçtin, aldı: söz tutuldu, D. Geçtin, almadı: söz bozuldu, Y. Geçmedin: söz bozulmadı, iki durumda da D. Tek yanlış: p doğru, q yanlış.',
        undefined,
        { not: 'Tek satırı ezberle: D ⇒ Y yanlış. Geri kalan üç durumda koşullu önerme doğru.' },
      ),
      kart(
        'Karşıt tersi aynı şeyi söyler',
        '"Yağmur yağıyorsa yer ıslaktır" ile "Yer ıslak değilse yağmur yağmıyordur" aynı bilgi. p ⇒ q ile ¬q ⇒ ¬p hep aynı değeri alır. Ama "yer ıslaksa yağmur yağıyordur" aynı değil; hortum olabilir.',
      ),
      kart(
        '∀ "her", ∃ "en az bir" demek',
        '∀x, x² ≥ 0: "her sayının karesi sıfır ya da pozitif", doğru. ∃x, x² = 4: "karesi 4 olan en az bir sayı var", doğru (2). ∀x, x² = 4 ise yanlış; 3\'ün karesi 9.',
      ),
      kart(
        '"Her"in olumsuzu "en az bir"',
        '"Her öğrenci geçti" yanlışsa ne doğru? "En az bir öğrenci kaldı." "En az bir kişi geldi" yanlışsa "hiç kimse gelmedi". Olumsuzlarken ∀ ile ∃ yer değiştirir, cümle de tersine döner.',
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
      soru('Bir koşullu önerme ile karşıt tersinin doğruluk değerleri her zaman aynıdır.', true, 'p ⇒ q ile ¬q ⇒ ¬p aynı şeyi söyler.'),
      sikli('Soru cümlesi önerme midir?', ['Evet', 'Hayır'], 1, 'Doğru ya da yanlış denemez.'),
      sikli('p ∧ q ne zaman doğrudur?', ['En az biri doğruyken', 'İkisi de doğruyken'], 1, '"veya" en az biriyle yetinir.'),
      sikli('¬(¬p) neye eşittir?', ['¬p', 'p'], 1, 'İki kez ters çevirince başa dönülür.'),
      sikli('"Her" olumsuzlanınca ne olur?', ['Hiçbir', 'En az bir'], 1, '"En az bir"in olumsuzu "hiçbir".'),
      sikli('p ⇒ q ile hangisi aynı değeri taşır?', ['¬q ⇒ ¬p', 'q ⇒ p'], 0, 'Karşıt tersi.'),
      soru('Mantıktaki "veya" günlük dildeki "ya o ya bu" anlamındadır.', false, 'İkisi de doğru olabilir; yine doğru.'),
    ], [
      {
        soru: 'p ⇒ q önermesi hangi durumda yanlıştır?',
        siklar: ['p yanlış, q doğru', 'p doğru, q yanlış'],
        dogru: 1,
        aciklama: {
          dogru: 'Söz verilip tutulmadı: tek yanlış durum bu.',
          yanlis: 'p yanlışken söz bozulmamıştır, önerme doğru. Yanlış olan tek durum: p doğru, q yanlış.',
        },
        kart: 6,
      },
    ]),
    konu('mat9-mantik-algoritma', 'Mantık Bağlaçlarının Algoritmik Kullanımı', [
      kart(
        '"Eğer" bir önermeyi sorar',
        '"Eğer not ≥ 50 ise geçti yaz." not = 70 için koşul doğru, satır çalışır. not = 40 için yanlış, satır atlanır. Programdaki koşul, yani doğru ya da yanlış çıkan bir önerme.',
      ),
      kart(
        'Bileşik koşul bağlaçla kurulur',
        '"yaş ≥ 18 ve ehliyet var" ise araba verilir. İki şart da tutmalı; 20 yaşında ehliyetsize yok. "veya" olsaydı biri yeterdi. Bağlacın tablosu, programın ne yapacağını önceden söyler.',
      ),
      kart(
        'Eğer-değilse: iki daldan yalnız biri çalışır',
        'not ≥ 50 ise "geçti" yaz, değilse "kaldı" yaz. Bir not için ikisi birden yazılamaz: koşul doğruysa ilk dal, yanlışsa ikinci. Üçüncü yol yok.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'not ≥ 50?', renk: 'ikincil' },
            { ad: 'Doğruysa', alt: 'geçti' },
            { ad: 'Yanlışsa', alt: 'kaldı', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Döngü, koşul doğru kaldıkça döner',
        '"sayac < 5 iken: sayacı yaz, 1 artır." 0, 1, 2, 3, 4 yazılır; sayaç 5 olunca koşul yanlış, döngü biter. Artırma satırını unutursan koşul hiç yanlış olmaz: sonsuz döngü.',
      ),
      kart(
        'Şemadaki her eşkenar dörtgen bir önerme',
        '"sayı > 0 mı?" kutusunun evet çıkışı önermenin doğru, hayır çıkışı yanlış olması. Şemayı okurken her karar noktasında dur ve o sayı için önermenin değerini sor.',
      ),
      kart(
        'Koşulu ters çevirirsen dalları da çevir',
        '"not ≥ 50 ise geçti, değilse kaldı" ile "not < 50 ise kaldı, değilse geçti" aynı işi yapar. ≥ nin tersi <. "ve"nin tersi "veya": "yaş ≥ 18 ve ehliyet var"ın tersi "yaş < 18 veya ehliyet yok".',
        undefined,
        { not: 'Koşulu tersine çevirirken bağlacı da çevir: "ve" → "veya", ≥ → <. Yalnız birini çevirmek programı bozar.' },
      ),
      kart(
        'İç içe iki koşul "ve" demektir',
        '"Yağmur varsa: şemsiye varsa dışarı çık." Ancak ikisi de doğruysa çıkarsın; bu "yağmur var ve şemsiye var" ile aynı. Dıştaki koşul yanlışsa içtekine hiç bakılmaz.',
      ),
    ], [
      soru('"not ≥ 50 ise geçti" koşulunun olumsuzu "not < 50" dir.', true, '≥ nin tersi <; sınır değeri karşı tarafa geçiyor.'),
      soru('"ve" ile bağlanan bir koşulda tek şartın sağlanması yeterlidir.', false, '"ve" iki şartı da ister; biri yetiyorsa bağlaç "veya" olmalı.'),
      soru('İç içe koşullarda dıştaki koşul sağlanmazsa içteki hiç denenmez.', true, 'İçteki koşula ancak dıştaki doğruysa geliniyor.'),
      soru('Bir döngünün koşulunda geçen değer, döngü gövdesinde asla değişmemelidir.', false, 'Değişmezse koşul hep aynı kalır ve döngü hiç bitmez.'),
      sikli('Akış şemasında karar noktasının kaç çıkışı vardır?', ['2', '3'], 0, 'Doğru ve yanlış.'),
      sikli('İç içe iki koşul hangi bağlaca denk gelir?', ['ve', 'veya'], 0, 'İkisi de sağlanmalı.'),
      sikli('"ve"li bir koşulun tersinde bağlaç ne olur?', ['veya', 'yine ve'], 0, '"yaş ≥ 18 ve ehliyet var" → "yaş < 18 veya ehliyet yok".'),
      soru('Eğer-değilse yapısında iki dal da çalışabilir.', false, 'Yalnızca biri çalışır.'),
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
        'Araştırma soruyla başlar, yorumla biter',
        '"Sınıfın ortalama boyu kaç?" diye sordun. Herkesin boyunu ölçtün (veri), sayıları sıraladın, ortalamayı hesapladın, sonunda soruya döndün: "168 cm." Yorumsuz veri araştırma değil.',
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
        'Nicel sayıyla, nitel kategoriyle ölçülür',
        'Boy 170 cm: nicel veri, sayıyla ölçülür. Göz rengi "kahverengi": nitel veri, kategoriyle söylenir. Sayıları toplayıp ortalama alabiliyorsan nicel; renklerin ortalaması olmaz.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Kesikli sayılır, sürekli ölçülür',
        'Kardeş sayısı 0, 1, 2 olur; 1,5 kardeş yok. Bu kesikli veri: sayılır, arada değer almaz. Boy 170,3 cm olabilir, arada her değer var; sürekli veri: ölçülür.',
      ),
      kart(
        'Ortalama, ortanca ve tepe değer',
        'Veri 2, 3, 3, 5, 7. Ortalama: topla böl, 20/5 = 4. Ortanca: sıralı listede ortadaki, 3. Tepe değer (mod): en çok tekrar eden, 3. Üçü de "veri nereye yığılmış" diye sorar.',
      ),
      kart(
        'Uç değer varsa ortancaya bak',
        '2, 3, 4, 5, 6 için ortalama 4, ortanca 4. Son sayıyı 96 yap: ortalama 22\'ye fırlar, ortanca hâlâ 4. Tek bir uç değer ortalamayı sürükler, ortancayı yerinden oynatmaz.',
        {
          tur: 'tablo',
          basliklar: ['Veri', 'Ortalama', 'Ortanca'],
          satirlar: [
            ['2, 3, 4, 5, 6', '4', '4'],
            ['2, 3, 4, 5, 96', '22', '4'],
          ],
        },
        { not: 'Veride 96 gibi bir uç değer görünce ortalamaya güvenme; önce ortancaya bak.' },
      ),
      kart(
        'Açıklık: en büyük eksi en küçük',
        '2, 3, 4, 5, 96 için açıklık 96 − 2 = 94; veri çok yayılmış. 2, 3, 4, 5, 6 için 4; toplu. Verinin ne kadar dağıldığını söyleyen ölçülere yayılım ölçüsü denir; en basiti açıklık.',
      ),
      kart(
        'Standart sapma küçükse veri toplu',
        'A sınıfının notları 48, 50, 52; B\'ninki 20, 50, 80. İkisinin ortalaması 50 ama B dağınık. Standart sapma, yani değerlerin ortalamadan ortalama uzaklığı, B\'de büyük çıkar.',
      ),
      kart(
        'Her grafik başka bir şeyi gösterir',
        'Histogram: hangi aralıkta kaç kişi var, dağılımın şekli. Kutu grafiği: ortanca ile en küçük ve en büyük değer. Nokta grafiği: her veri tek tek nokta. Soruya göre grafik seç.',
      ),
      kart(
        'Kuyruk sağa uzuyorsa ortalama sağa kayar',
        'Bir şirkette çoğu maaş 20 bin, birkaçı 500 bin. Dağılımın kuyruğu sağa uzuyor; buna sağa çarpık denir. Büyük maaşlar ortalamayı sağa çeker, ortanca yerinde kalır: ortalama > ortanca.',
      ),
    ], [
      soru('Bir sınıftaki öğrencilerin göz rengi nicel bir veridir.', false, 'Göz rengi sayıyla ölçülmez; nitel veri.'),
      soru('Aşırı uç değer bulunan bir veride ortanca, ortalamadan daha güvenilir bir merkez ölçüsüdür.', true, 'Tek bir büyük değer ortalamayı çeker, ortancayı yerinden oynatmaz.'),
      soru('Standart sapma büyükse veriler ortalamanın etrafında sıkışmıştır.', false, 'Tersi: standart sapma büyüdükçe veriler ortalamadan uzağa yayılır.'),
      soru('Bir sınıftaki öğrenci sayısı kesikli bir değişkendir.', true, 'Sayılır ve arada değer almaz; 24 ile 25 arasında öğrenci sayısı yok.'),
      sikli('Kardeş sayısı hangi veri türüdür?', ['Sürekli', 'Kesikli'], 1, '1,5 kardeş yok; boy sürekli.'),
      sikli('Standart sapma küçükse?', ['Veri dağılmış', 'Veri ortalamaya yakın'], 1, 'Ortalamadan ortalama uzaklık küçük.'),
      sikli('Sağa çarpık dağılımda ortalama ile ortanca?', ['Eşit', 'Ortalama daha büyük'], 1, 'Sağdaki uç değerler ortalamayı çeker.'),
      sikli('En sık tekrar eden değere ne denir?', ['Ortanca', 'Tepe değer (mod)'], 1, 'Ortanca sıralı listede ortadaki.'),
      sikli('Dağılımın şeklini gösteren grafik?', ['Histogram', 'Nokta grafiği'], 0, 'Kutu grafiği ortanca ve uçları gösterir.'),
      soru('Araştırma süreci veri toplamayla biter.', false, 'Veri yorumlanıp soruya dönülmeli.'),
    ], [
      {
        soru: 'Veride aşırı uç değerler varsa hangi ölçü daha güvenilirdir?',
        siklar: ['Aritmetik ortalama', 'Ortanca'],
        dogru: 1,
        aciklama: {
          dogru: 'Ortanca sıralamanın ortası; uçlar onu kaydırmaz.',
          yanlis: 'Ortalama uç değerle sürüklenir: 2, 3, 4, 5, 96 için ortalama 22, ortanca 4.',
        },
        kart: 5,
      },
    ]),
    konu('mat9-dagilim-inceleme', 'Başkalarının Oluşturduğu Veri Dağılımlarını İnceleme', [
      kart(
        'Grafiğe önce başlığından bak',
        'Bir sütun grafiği gördün. Ne ölçülmüş, hangi yıllar, kaç kişiyle, kim toplamış? Başlık, eksen adları ve kaynak okunmadan sütunların boyu hiçbir şey söylemez.',
      ),
      kart(
        'Sıfırdan başlamayan eksen farkı şişirir',
        'İki sütun: 100 ve 102. Düşey eksen 98\'den başlarsa ikinci sütun ilkinin iki katı görünür. Sıfırdan başlasa ikisi neredeyse eşit. En çok kullanılan yanıltma bu.',
        undefined,
        { not: 'Bir grafiğe bakınca ilk iş: düşey eksen sıfırdan mı başlıyor? Başlamıyorsa farkı kafanda küçült.' },
      ),
      kart(
        'Ölçek değişince hikâye değişir',
        'Fiyat 100\'den 105\'e çıktı. Ekseni 0–200 yaparsan çizgi dümdüz: "durgun". 99–106 yaparsan dik tırmanış: "patlama". Sayı aynı sayı; hikâyeyi eksen aralığı yazdı.',
      ),
      kart(
        'Az ya da taraflı örneklem yanıltır',
        '"Öğrencilerin %90\'ı spor seviyor." Anket spor salonunda 10 kişiye yapıldıysa okulu anlatmaz. Örneklem, yani veri toplanan grup, hem yeterince büyük hem herkesi temsil eden olmalı.',
      ),
      kart(
        'Veriyi kim topladı, sor',
        'Bir şeker firması "şeker zararsız" araştırması yayınlıyor. Sonuçtan çıkarı olan, soruyu nasıl soracağını ve kime soracağını kendine göre seçebilir. Kaynağı okumadan sonuca inanma.',
      ),
      kart(
        'Birlikte artmak sebep olmak değil',
        'Dondurma satışı artınca boğulma vakaları da artıyor. Dondurma boğmuyor; ikisini de yaz sıcağı artırıyor. Birlikte değişmeye korelasyon denir; sebep olmak (nedensellik) ayrı şey.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Yüzdenin yanında sayıyı iste',
        '"Vaka sayısı %50 arttı." 2\'den 3\'e çıkmak da %50, 2 milyondan 3 milyona çıkmak da. Toplam sayı yazmıyorsa yüzde tek başına ne kadar büyük olduğunu söylemez.',
      ),
    ], [
      soru('Düşey ekseni sıfırdan başlamayan bir sütun grafiği farkları olduğundan büyük gösterir.', true, 'Kesik eksen sütunların oranını bozuyor; iki katı gibi görünen fark aslında küçük olabilir.'),
      soru('İki değişken birlikte artıyorsa biri diğerinin sebebidir.', false, 'Birlikte değişmek nedensellik değil; ikisini birden etkileyen üçüncü bir sebep olabilir.'),
      soru('Verinin kimin tarafından toplandığı sonucun güvenilirliğini etkilemez.', false, 'Sonuçtan çıkarı olan birinin topladığı veri taraflı olabilir.'),
      soru('Yalnızca kendi sınıfında yapılan bir anket bütün okul hakkında sonuç vermez.', true, 'Örneklem okulun tamamını temsil etmiyor.'),
      sikli('İki değişkenin birlikte artması ne gösterir?', ['Nedensellik', 'İlişki, nedensellik değil'], 1, 'Dondurma ile boğulma: ikisini de yaz artırıyor.'),
      sikli('"%50 arttı" ifadesi ne zaman yanıltıcıdır?', ['Her zaman', 'Toplam sayı yazılmıyorsa'], 1, '2\'den 3\'e de %50.'),
      sikli('Taraflı örneklem sonucu ne yapar?', ['Sonucu güçlendirir', 'Yanlış sonuç verir'], 1, 'Spor salonundaki 10 kişi okulu anlatmaz.'),
      soru('Grafik başlık okunmadan yorumlanabilir.', false, 'Başlık, eksen, örneklem ve kaynak okunmalı.'),
    ], [
      {
        soru: 'Düşey ekseni sıfırdan başlamayan grafik ne yapar?',
        siklar: ['Veriyi daha doğru gösterir', 'Küçük farkları büyük gösterir'],
        dogru: 1,
        aciklama: {
          dogru: 'En sık kullanılan yanıltma; 100 ile 102 iki kat farklı görünür.',
          yanlis: 'Kesik eksen doğruluk katmaz, oranı bozar. Küçük farklar büyük görünür.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('mat9-t7', 'Veriden Olasılığa', [
    konu('mat9-deneysel', 'Deneysel Olasılık', [
      kart(
        'Deneysel olasılık sayarak bulunur',
        'Parayı 20 kez attın, 7 kez tura geldi. Deneysel tura olasılığı 7/20 = 0,35. Kural: istediğin sonucun kaç kez geldiği bölü toplam deneme sayısı. Hesap değil, sayım.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Deney, sonuç ve olay ayrı şeyler',
        'Deney: zar atmak, istediğin kadar tekrarlarsın. Sonuç: tek bir çıktı, "4 geldi". Olay: sonuçlardan oluşan küme, "çift geldi" demek {2, 4, 6}. Olay birden çok sonucu kapsayabilir.',
      ),
      kart(
        'Deneme arttıkça oran oturur',
        '10 atışta 7 tura: 0,7. 100 atışta 53: 0,53. 10.000 atışta 5.012: 0,5012. Az denemede sapma büyük; deneme arttıkça deneysel olasılık gerçek değere, yani 1/2\'ye yaklaşır.',
      ),
      kart(
        'Az denemeye güvenme',
        '10 atışta 7 tura gördün diye "para hileli" deme; şans bu kadar oynar. Hileli mi diye hüküm vermeden önce yüzlerce atış gerekir. Küçük sayıda görülen fark çoğu zaman gürültü.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Hesaplayamadığın olasılığı ölçersin',
        'Raptiye düşünce sivri ucu yukarı mı bakar? Hesabı yok, raptiye simetrik değil. Tek yol: 100 kez at, say. Bozuk zar ve "yarın yağmur yağar mı" da böyle; kuram susunca deney konuşur.',
      ),
      kart(
        'Sıklık tablosu oranı hazır verir',
        'Zar 60 kez atıldı; 2 gelme sayısı 12, tabloya yazıldı. Her satırdaki sayı sıklık. Sıklığı toplam denemeye böl: 12/60 = 0,2. Buna göreli sıklık denir; deneysel olasılığın kendisi.',
      ),
      kart(
        'Deneysel ölçülür, teorik hesaplanır',
        'Zarda 6 gelme olasılığı kâğıt üstünde 1/6 ≈ 0,167; bu teorik. 60 atışta 12 kez 6 geldi: 12/60 = 0,2; bu deneysel. Yakınlar ama eşit değiller; soru hangisini istiyor, ona bak.',
        undefined,
        { not: 'Soruda "atıldı, geldi" varsa deneysel: say ve böl. "Hilesiz zar" varsa teorik: hesapla.' },
      ),
    ], [
      soru('Deneysel olasılık, gözlenen sıklığın toplam deneme sayısına bölümüdür.', true, 'Hesap yapılan deneyden çıkıyor, kuramdan değil.'),
      soru('Deneme sayısı arttıkça deneysel olasılık teorik olasılıktan uzaklaşır.', false, 'Tersi olur: deneme arttıkça deneysel olasılık teoriğe yaklaşır.'),
      soru('Hileli olabileceğinden şüphelenilen bir zar yalnızca teorik olasılıkla incelenir.', false, 'Zarın gerçekten hileli olup olmadığı ancak atılarak, yani deneysel olasılıkla anlaşılır.'),
      soru('20 atışın 7 sinde tura gelen paranın deneysel tura olasılığı 0,35 tir.', true, '7/20 = 0,35.'),
      sikli('Bozuk zarın olasılığı nasıl bulunur?', ['Deneyle ölçülür', 'Hesaplanır'], 0, 'Simetri yok, teorik hesap yapılamaz.'),
      sikli('Deneme sonuçlarının işlendiği tablo?', ['Sıklık tablosu', 'Örnek uzay'], 0, 'Göreli sıklık buradan çıkar.'),
      sikli('Tek bir çıktıya ne denir?', ['Sonuç', 'Olay'], 0, 'Olay sonuçlardan oluşan küme.'),
      soru('Teorik olasılık ölçülür, deneysel olasılık hesaplanır.', false, 'Tersi: deneysel ölçülür, teorik hesaplanır.'),
    ], [
      {
        soru: 'Deneme sayısı arttıkça deneysel olasılık ne yapar?',
        siklar: ['Teorik olasılığa yaklaşır', 'Teorik olasılıktan uzaklaşır'],
        dogru: 0,
        aciklama: {
          dogru: '10.000 atışta tura oranı 1/2\'ye yaklaşır.',
          yanlis: 'Az denemede sapma büyük, çok denemede küçük. Deneme arttıkça oran teorik değere yaklaşır.',
        },
        kart: 3,
      },
    ]),
    konu('mat9-teorik', 'Teorik Olasılık', [
      kart(
        'Teorik olasılık: istenen bölü hepsi',
        'Hilesiz zarda 6 gelme: istediğin 1 durum var, toplam 6 durum; olasılık 1/6. Kural: istenen durum sayısı bölü bütün durum sayısı. Şart: her sonucun şansı eşit olmalı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Örnek uzay, bütün sonuçların listesi',
        'Zar için örnek uzay {1, 2, 3, 4, 5, 6}, 6 eleman. Para için {yazı, tura}, 2 eleman. İki para için {YY, YT, TY, TT}, 4 eleman. Olasılığın paydasına bu sayı gelir.',
      ),
      kart(
        'Olasılık 0 ile 1 arasındadır',
        'Zarda 7 gelme olasılığı 0: imkânsız. 7\'den küçük gelme 1: kesin. Her olasılık bu ikisinin arasında. Hesabın 1,2 çıktıysa sonuç değil, hata; geri dön.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 1],
          isaretler: [0, 1],
          parcalar: [{ bas: 0, bit: 1, kapaliBas: true, kapaliBit: true }],
          noktalar: [{ deger: 0.5, ad: 'eşit şans' }],
        },
      ),
      kart(
        'İstenen durumları sayarak olasılığı bul',
        'Zarda çift gelme: {2, 4, 6}, 3 durum; 3/6 = 1/2. 4\'ten büyük gelme: {5, 6}, 2 durum; 2/6 = 1/3. Önce istenen sonuçları listele, sonra 6\'ya böl.',
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
        'Olmama olasılığı: 1\'den çıkar',
        'Zarda 6 gelmeme: 1 − 1/6 = 5/6. Bir olay ya olur ya olmaz, toplam 1. "En az bir" sorularında bu kısa yol: iki atışta en az bir 6 = 1 − hiç 6 gelmeme. Adı tümleyen olay.',
      ),
      kart(
        'Ayrık olayların olasılığı toplanır',
        'Zarda 1 veya 6 gelme: 1/6 + 1/6 = 2/6. Toplayabildin çünkü ikisi aynı anda olamaz; böyle olaylara ayrık denir. "Çift veya 4\'ten büyük" ayrık değil, 6 ikisinde de var; toplama.',
      ),
      kart(
        'Bağımsız olayların olasılığı çarpılır',
        'İki para at. İlkinin tura gelmesi 1/2, ikincinin 1/2. İkisinin de tura gelmesi 1/2 · 1/2 = 1/4. Çarpabildin çünkü ilk para ikincisini etkilemiyor; böyle olaylara bağımsız denir.',
      ),
      kart(
        'Paranın hafızası yok',
        'Beş kez üst üste yazı geldi. Altıncıda tura "gelmesi lazım" değil; olasılık yine 1/2. Her atış bağımsız, para öncekileri hatırlamaz. Seri görünce şans arttı sanmak en yaygın tuzak.',
        undefined,
        { not: 'Arka arkaya aynı sonuç görünce "sıra ötekinde" deme; her atış sıfırdan 1/2.' },
      ),
    ], [
      soru('Bir olayın olasılığı 1,5 olabilir.', false, 'Olasılık 0 ile 1 arasında; 1 kesin olayın değeri.'),
      soru('Bir zar atıldığında çift sayı gelme olasılığı 1/2 dir.', true, 'Altı sonuçtan üçü çift: 3/6 = 1/2.'),
      soru('Bir olayın tümleyeninin olasılığı 1 − P(A) dır.', true, 'Olay ya olur ya olmaz; ikisinin olasılığı toplamda 1.'),
      soru('Arka arkaya beş kez yazı gelen para altıncı atışta daha yüksek olasılıkla tura gelir.', false, 'Para önceki atışları hatırlamaz; her atışta tura olasılığı 1/2.'),
      sikli('Bir zarda 3\'ten büyük sayı gelme olasılığı?', ['1/3', '1/2'], 1, '4, 5, 6: 3/6.'),
      sikli('"En az bir" sorularında kısa yol?', ['Toplama', 'Tümleyen olay'], 1, '1 − hiç olmama.'),
      sikli('Aynı anda gerçekleşemeyen iki olay?', ['Bağımsız', 'Ayrık'], 1, 'Olasılıkları toplanır.'),
      sikli('Olasılık 1,2 çıkarsa?', ['Kesin olay', 'Hesap hatası'], 1, '0 ile 1 arasında olmalı.'),
      soru('Üst üste üç yazı gelen para dördüncüde daha çok tura gelir.', false, 'Para geçmişi hatırlamaz.'),
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
