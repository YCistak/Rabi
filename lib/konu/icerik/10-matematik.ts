import { kart, konu, program, tema } from '../tip'

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
        'sin = karşı/hipotenüs, cos = komşu/hipotenüs, tan = karşı/komşu.',
      ),
      kart(
        'Özel açılar',
        '30°, 45° ve 60° değerleri ezberlenir; 45-45-90 ve 30-60-90 üçgenlerinden türetilir.',
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
        'Bir açının sinüsü, tümlerinin kosinüsüne eşittir: sin 30° = cos 60°.',
      ),
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
        'Benzerlik oranı k ise alanlar oranı k²’dir.',
      ),
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
        'Karşılıklı kenar-açı çifti varsa sinüs; iki kenar ve aradaki açı ya da üç kenar varsa kosinüs.',
      ),
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
      ),
      kart(
        'Satır ve sütun yüzdesi',
        'Aynı tablodan farklı yüzdeler çıkar; hangisine bölündüğü söylenmezse sonuç yanıltıcı olur.',
      ),
      kart(
        'İlişki var mı?',
        'Bir değişkenin dağılımı öteki değişkenin düzeylerine göre belirgin biçimde değişiyorsa ilişki vardır.',
      ),
    ]),
    konu('mat10-kategorik-inceleme', 'Başkalarının Oluşturduğu Kategorik Verileri İnceleme', [
      kart(
        'Kaynağı sorgula',
        'Veriyi kimin, hangi amaçla topladığı sonucun yorumunu değiştirir.',
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
    ]),
  ]),
  tema('mat10-t3', 'Sayılar', [
    konu('mat10-asal-carpan', 'Bir Doğal Sayının Asal Çarpanları ve Bölenleri', [
      kart(
        'Asal sayı',
        'Yalnızca 1’e ve kendisine bölünen, 1’den büyük doğal sayı. 2 tek çift asaldır.',
      ),
      kart(
        'Asal çarpanlara ayırma',
        'Her doğal sayı asalların çarpımı olarak tek bir biçimde yazılır. Buna aritmetiğin temel teoremi denir.',
      ),
      kart(
        'Pozitif bölen sayısı',
        'Sayı p^a · q^b biçimindeyse bölen sayısı (a+1)(b+1) olur.',
      ),
      kart(
        'Bölenlerin toplamı',
        'Her asal için üslerin toplamı ayrı ayrı hesaplanıp çarpılır.',
      ),
      kart(
        'Neden işe yarar?',
        'EBOB, EKOK ve sadeleştirme işlemlerinin tamamı asal çarpanlara ayırmaya dayanır.',
      ),
    ]),
    konu('mat10-ebob-ekok', 'En Büyük Ortak Bölen, En Küçük Ortak Kat', [
      kart(
        'EBOB',
        'İki sayıyı da bölen en büyük sayı. Ortak asal çarpanların en küçük üsleri çarpılarak bulunur.',
      ),
      kart(
        'EKOK',
        'İki sayının da katı olan en küçük sayı. Tüm asal çarpanların en büyük üsleri çarpılır.',
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
        '11 kuralı',
        'Rakamlar sağdan sola dönüşümlü olarak toplanıp çıkarılır; sonuç 11’in katıysa sayı 11’e bölünür.',
      ),
      kart(
        'Bileşik kurallar',
        '6’ya bölünme için hem 2’ye hem 3’e bölünmesi gerekir. Aralarında asal çarpanlar birlikte kontrol edilir.',
      ),
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
      ),
    ]),
    konu('mat10-karesel', 'Karesel Fonksiyon ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        'f(x) = ax² + bx + c, a ≠ 0. Grafiği paraboldür.',
      ),
      kart(
        'Kolların yönü',
        'a > 0 ise kollar yukarı ve fonksiyonun en küçük değeri vardır; a < 0 ise kollar aşağıdır.',
      ),
      kart(
        'Tepe noktası',
        'x = −b/(2a) noktasında bulunur. Fonksiyonun en büyük ya da en küçük değeri buradadır.',
      ),
      kart(
        'Diskriminant',
        'Δ = b² − 4ac. Δ > 0 iki kök, Δ = 0 çift kat kök, Δ < 0 gerçek kök yok demektir.',
      ),
      kart(
        'Simetri ekseni',
        'Tepe noktasından geçen düşey doğru. Parabol bu doğruya göre simetriktir.',
      ),
    ]),
    konu('mat10-karekok', 'Karekök Fonksiyonu ve Nitel Özellikleri', [
      kart(
        'Genel biçim',
        'f(x) = √x. Tanım kümesi x ≥ 0, görüntü kümesi y ≥ 0’dır.',
      ),
      kart(
        'Grafiği',
        'Orijinden başlayıp sağa doğru yavaşlayarak yükselen bir eğri. Parabolün yarısının yatay yansımasıdır.',
      ),
      kart(
        'Artan fonksiyon',
        'Tanım kümesi boyunca artandır ama artış hızı giderek azalır.',
      ),
      kart(
        'Tanım kümesi hesabı',
        'Kök içindeki ifade sıfırdan büyük ya da eşit olmalıdır; eşitsizlik çözülerek bulunur.',
      ),
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
      ),
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
        'y = f(x) yazılır, x ile y yer değiştirilir, y yalnız bırakılır.',
      ),
      kart(
        'Grafiği',
        'Ters fonksiyonun grafiği, orijinalin y = x doğrusuna göre simetriğidir.',
      ),
      kart(
        'Örnekler',
        'Karesel fonksiyonun tersi karekök, doğrusal fonksiyonun tersi yine doğrusaldır.',
      ),
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
      ),
      kart(
        'Bağlam kontrolü',
        'Kenar uzunluğu negatif, kişi sayısı kesirli olamaz. Matematiksel köklerden bağlama uyanlar seçilir.',
      ),
    ]),
  ]),
  tema('mat10-t5', 'Sayma, Algoritma ve Bilişim', [
    konu('mat10-sayma', 'Sayma Stratejileri', [
      kart(
        'Toplama ve çarpma kuralı',
        'Seçenekler birbirinin alternatifiyse toplanır, art arda yapılıyorsa çarpılır.',
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
      ),
      kart(
        'Tekrarlı sayma',
        'Aynı nesnelerden birden çok varsa toplam sıralama, tekrar sayılarının faktöriyellerine bölünür.',
      ),
    ]),
    konu('mat10-algoritmik-yapi', 'Cebirsel İşlemlerin Algoritmik Yapısı', [
      kart(
        'İşlem sırası bir algoritmadır',
        'Parantez, üs, çarpma-bölme, toplama-çıkarma sırası kesin adımlarla tanımlıdır.',
      ),
      kart(
        'Öklid algoritması',
        'EBOB’u kalanlı bölmeleri tekrarlayarak bulur; kalan sıfır olduğunda son bölen sonucu verir.',
      ),
      kart(
        'Döngü ile hesaplama',
        'Faktöriyel ve üs alma tekrar eden çarpmalardır; bir döngüyle adım adım hesaplanır.',
      ),
      kart(
        'Verimlilik',
        'Aynı sonucu veren iki algoritmadan adım sayısı az olanı yeğlenir; büyük sayılarda fark büyür.',
      ),
    ]),
  ]),
  tema('mat10-t6', 'Analitik İnceleme', [
    konu('mat10-nokta', 'Dik Koordinat Sisteminde Noktanın Analitik İncelenmesi', [
      kart(
        'İki nokta arası uzaklık',
        'Pisagor teoreminden türer: koordinat farklarının kareleri toplanıp karekökü alınır.',
      ),
      kart(
        'Orta nokta',
        'Koordinatların aritmetik ortalaması alınır.',
      ),
      kart(
        'Bölme noktası',
        'Bir doğru parçasını verilen oranda bölen noktanın koordinatları oranla ağırlıklandırılarak bulunur.',
      ),
      kart(
        'Üçgenin ağırlık merkezi',
        'Üç köşenin koordinatlarının ortalamasıdır.',
      ),
      kart(
        'Bölgeler',
        'Dört bölge işaretlerle ayrılır: I (+,+), II (−,+), III (−,−), IV (+,−).',
      ),
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
        'İki doğru paralelse eğimleri eşittir.',
      ),
      kart(
        'Diklik',
        'İki doğru dikse eğimlerinin çarpımı −1’dir.',
      ),
      kart(
        'Noktanın doğruya uzaklığı',
        'Doğrunun genel denklemi kullanılarak hesaplanır; sonuç daima pozitiftir.',
      ),
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
        'Sık yapılan hata',
        'P(A|B) ile P(B|A) aynı şey değildir. İkisini karıştırmak günlük hayatta da yanlış sonuçlar üretir.',
      ),
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
      ),
      kart(
        'Neden önemli?',
        'Yeni kanıt geldiğinde inancı güncellemenin matematiksel kuralıdır; makine öğrenmesinde de kullanılır.',
      ),
    ]),
  ]),
])
