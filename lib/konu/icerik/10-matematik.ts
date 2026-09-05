import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Matematik — Maarif Modeli.
 *
 * Yedi tema; adları 9. sınıfla büyük ölçüde aynı, içerik derinleşiyor.
 * "Analitik İnceleme" bu sınıfta açılıyor, trigonometri ilk kez burada
 * geliyor. Polinomlar Maarif'te 10. sınıftan **12. sınıfa taşındı**, o
 * yüzden burada yok.
 */
export const matematik10 = program('matematik', 10, 'Sayılardan olasılığa', [
  tema('mat10-t1', 'Sayılar', [
    konu('mat10-bolunebilme', 'Bölünebilme Kuralları', [
      kart(
        'Bölünebilme nedir?',
        'a sayısı b’ye tam bölünüyorsa kalan sıfırdır. "Tam bölünür" ile "bölünür" aynı şeyi anlatır.',
      ),
      kart(
        'Sık kullanılan kurallar',
        '2: son rakam çift. 3: rakamlar toplamı 3’ün katı. 5: son rakam 0 ya da 5. 9: rakamlar toplamı 9’un katı.',
      ),
      kart(
        '4 ve 8 kuralı',
        '4 için son iki rakamın, 8 için son üç rakamın oluşturduğu sayıya bakılır.',
      ),
      kart(
        '11 kuralı',
        'Rakamlar sondan başlayarak birer atlanarak toplanır; iki toplamın farkı 0 ya da 11’in katıysa sayı 11’e bölünür.',
      ),
      kart(
        'Aralarında asallık',
        'Bir sayı 6’ya bölünüyorsa hem 2’ye hem 3’e bölünmelidir. Bu kural yalnız aralarında asal bölenler için geçerlidir: 4 ve 6 ile 24 denemesi yanıltır.',
      ),
    ]),
    konu('mat10-ebob', 'Asal Çarpanlar, EBOB ve EKOK', [
      kart(
        'Asal çarpanlara ayırma',
        'Her tam sayı asalların çarpımı olarak tek bir biçimde yazılır. Bütün bölünebilme sorularının anahtarı.',
      ),
      kart(
        'Pozitif bölen sayısı',
        'Sayı aᵐ·bⁿ biçimindeyse bölen sayısı (m+1)·(n+1)’dir.',
      ),
      kart(
        'EBOB',
        'Ortak asal çarpanların **küçük** üslüleri çarpılır. "En büyük parçaya bölme" tipi problemlerde kullanılır.',
      ),
      kart(
        'EKOK',
        'Bütün asal çarpanların **büyük** üslüleri çarpılır. "Aynı anda tekrar buluşma" problemleri bununla çözülür.',
      ),
      kart(
        'Altın kural',
        'İki sayı için EBOB × EKOK = sayıların çarpımı. Üç sayı için bu bağıntı geçerli değildir.',
      ),
    ]),
  ]),
  tema('mat10-t2', 'Nicelikler ve Değişimler', [
    konu('mat10-parabol', 'Karesel Fonksiyonlar', [
      kart(
        'Genel biçim',
        'f(x) = ax² + bx + c, a ≠ 0. Grafiği paraboldür; a > 0 ise kollar yukarı, a < 0 ise aşağı bakar.',
      ),
      kart(
        'Tepe noktası',
        'x = −b/(2a) ile bulunur, y değeri yerine koyarak. a > 0 ise burası en küçük, a < 0 ise en büyük değerdir.',
      ),
      kart(
        'Kökler ve diskriminant',
        'Δ = b² − 4ac. Δ > 0 iki kök, Δ = 0 çakışık kök, Δ < 0 gerçek kök yok — parabol ekseni kesmez.',
      ),
      kart(
        'Kök-katsayı ilişkisi',
        'Köklerin toplamı −b/a, çarpımı c/a. Kökleri bulmadan sorulan çoğu soruyu bu ikisi çözer.',
      ),
    ]),
    konu('mat10-fonksiyon', 'Fonksiyon Çeşitleri', [
      kart(
        'Karekök fonksiyonu',
        'f(x) = √x. Tanım kümesi x ≥ 0; grafiği yatık bir yarım paraboldür.',
      ),
      kart(
        'Rasyonel fonksiyon',
        'İki polinomun bölümü. Paydayı sıfır yapan değerler tanımsızdır ve grafikte düşey asimptot oluşturur.',
      ),
      kart(
        'Ters fonksiyon',
        'Yalnız bire bir ve örten fonksiyonun tersi vardır. f⁻¹ bulmak için x ve y yer değiştirilip y çekilir.',
      ),
      kart(
        'Ters fonksiyonun grafiği',
        'Fonksiyonun y = x doğrusuna göre yansımasıdır. İkisi bu doğru üzerinde kesişir.',
      ),
      kart(
        'Bileşke',
        '(f∘g)(x) = f(g(x)) — önce g uygulanır. Bileşkede sıra değişince sonuç genellikle değişir.',
      ),
    ]),
  ]),
  tema('mat10-t3', 'Sayma, Algoritma ve Bilişim', [
    konu('mat10-sayma', 'Sayma Yolları', [
      kart(
        'Toplama ve çarpma kuralı',
        'Seçenekler "ya o ya bu" ise toplanır, "önce o sonra bu" ise çarpılır. Sorudaki bağlaç kuralı seçer.',
      ),
      kart(
        'Faktöriyel',
        'n! = n·(n−1)···2·1. Tanım gereği 0! = 1’dir.',
      ),
      kart(
        'Permütasyon',
        'Sıralama önemliyse kullanılır: P(n,r) = n!/(n−r)!. Yarışta ilk üçün sıralaması buna girer.',
      ),
      kart(
        'Kombinasyon',
        'Sıralama önemsizse: C(n,r) = n!/(r!·(n−r)!). Takım seçmek kombinasyondur.',
      ),
      kart(
        'C(n,r) = C(n, n−r)',
        '10 kişiden 7’sini seçmekle 3’ünü dışarıda bırakmak aynı şeydir; hesabı kısaltır.',
      ),
    ]),
    konu('mat10-binom', 'Binom Açılımı', [
      kart(
        'Binom teoremi',
        '(a+b)ⁿ açılımındaki terim sayısı n+1’dir; katsayılar C(n,k) ile bulunur.',
      ),
      kart(
        'Genel terim',
        'Baştan (k+1). terim C(n,k)·aⁿ⁻ᵏ·bᵏ. Belirli bir terimi bulmak için açılımın tamamını yazmaya gerek yok.',
      ),
      kart(
        'Üslerin toplamı',
        'Her terimde a ve b’nin üslerinin toplamı n’dir. Hızlı kontrol yöntemi.',
      ),
      kart(
        'Katsayılar toplamı',
        'Değişkenlere 1 yazılarak bulunur. Sabit terim için ise değişkene 0 yazılır.',
      ),
    ]),
  ]),
  tema('mat10-t4', 'Geometrik Şekiller', [
    konu('mat10-trigonometri', 'Dik Üçgende Trigonometri', [
      kart(
        'Üç temel oran',
        'sin = karşı/hipotenüs, cos = komşu/hipotenüs, tan = karşı/komşu. Yalnız dik üçgende bu tanımlar geçerlidir.',
      ),
      kart(
        'Özel açılar',
        'sin30 = 1/2, sin45 = √2/2, sin60 = √3/2. Kosinüsler tersten okunur, tanjant ikisinin oranıdır.',
      ),
      kart(
        'Temel özdeşlik',
        'sin²x + cos²x = 1. Pisagor teoreminin trigonometrik hâli.',
      ),
      kart(
        'Tümler açılar',
        'sin(90° − x) = cos x. Bu yüzden 30° ile 60° soruları birbirine çevrilebilir.',
      ),
    ]),
    konu('mat10-teorem', 'Sinüs ve Kosinüs Teoremi', [
      kart(
        'Sinüs teoremi',
        'a/sinA = b/sinB = c/sinC. İki açı ve bir kenar, ya da iki kenar ve karşı açı biliniyorsa kullanılır.',
      ),
      kart(
        'Kosinüs teoremi',
        'a² = b² + c² − 2bc·cosA. Üç kenar biliniyorsa ya da iki kenar ve aradaki açı verilmişse çalışır.',
      ),
      kart(
        'Pisagor’un genel hâli',
        'A açısı 90° olduğunda cosA = 0 olur ve kosinüs teoremi Pisagor’a döner.',
      ),
      kart(
        'Alan bağıntısı',
        'İki kenar ve aradaki açı biliniyorsa alan = ½·a·b·sinC. Yüksekliği bulmaya gerek kalmaz.',
      ),
    ]),
  ]),
  tema('mat10-t5', 'Analitik İnceleme', [
    konu('mat10-analitik', 'Koordinat Düzleminde Nokta ve Doğru', [
      kart(
        'İki nokta arası uzaklık',
        '√[(x₂−x₁)² + (y₂−y₁)²]. Pisagor teoreminin koordinat düzlemindeki hâli.',
      ),
      kart(
        'Orta nokta',
        'Koordinatların aritmetik ortalaması: ((x₁+x₂)/2, (y₁+y₂)/2).',
      ),
      kart(
        'Doğrunun denklemi',
        'y = mx + n biçiminde; m eğim, n y eksenini kestiği noktadır. Bir nokta ve eğim biliniyorsa denklem yazılabilir.',
      ),
      kart(
        'Paralellik ve diklik',
        'Paralel doğruların eğimleri eşittir; dik doğrularda eğimlerin çarpımı −1’dir.',
      ),
      kart(
        'Eksenleri kesme',
        'x eksenini kestiği noktayı bulmak için y = 0, y eksenini kestiği nokta için x = 0 yazılır.',
      ),
    ]),
  ]),
  tema('mat10-t6', 'İstatistiksel Araştırma Süreci', [
    konu('mat10-tablo', 'İki Yönlü Tablolar', [
      kart(
        'İki kategorik değişken',
        'Satırda bir değişken, sütunda öteki. Hücreler iki özelliği birlikte taşıyan birey sayısını verir.',
      ),
      kart(
        'Göreli sıklık',
        'Sayının toplama bölünmesi. Grup büyüklükleri farklıysa ham sayılar değil oranlar karşılaştırılmalıdır.',
      ),
      kart(
        'Koşullu göreli sıklık',
        'Bir satır ya da sütun içinde hesaplanan oran: "kızlar arasında spor yapanların oranı" gibi.',
      ),
      kart(
        'İlişki var mı?',
        'Koşullu oranlar birbirine yakınsa iki değişken bağımsız sayılır; belirgin farklıysa aralarında ilişki vardır.',
      ),
    ]),
  ]),
  tema('mat10-t7', 'Veriden Olasılığa', [
    konu('mat10-kosullu', 'Koşullu Olasılık', [
      kart(
        'Tanım',
        'P(A|B), B gerçekleştiği bilindiğinde A’nın olasılığı: P(A∩B)/P(B). Örnek uzay B’ye daralır.',
      ),
      kart(
        'Bağımlı ve bağımsız olay',
        'Bağımsızsa P(A|B) = P(A). Torbadan **geri koyarak** çekmek bağımsız, geri koymadan çekmek bağımlıdır.',
      ),
      kart(
        'Çarpma kuralı',
        'P(A∩B) = P(B)·P(A|B). Bağımsız olaylarda P(A)·P(B)’ye iner.',
      ),
      kart(
        'Bayes teoremi',
        'Sonucu bilerek sebebin olasılığını hesaplar: P(A|B) = P(B|A)·P(A) / P(B). Tıbbi testlerin yorumu buna dayanır.',
      ),
      kart(
        'Sık yapılan hata',
        'P(A|B) ile P(B|A) aynı şey değildir. "Hasta olanların testi pozitif" ile "testi pozitif olanların hasta olması" farklı sorulardır.',
      ),
    ]),
  ]),
])
