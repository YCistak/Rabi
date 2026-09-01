import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Matematik — Maarif Modeli.
 *
 * Yedi tema. Eski programın "Denklem ve Eşitsizlikler / Üçgenler / Veri"
 * ünitelendirmesi değil, programın kendi tema adları kullanılıyor;
 * "Algoritma ve Bilişim" teması Maarif ile geldi.
 */
export const matematik9 = program('matematik', 9, [
  tema('mat9-t1', 'Sayılar', [
    konu('mat9-kume', 'Kümeler ve Sayı Aralıkları', [
      kart(
        'Küme gösterimi',
        'Liste, ortak özellik ve Venn şeması. Eleman sayısı s(A) ile gösterilir; boş kümenin eleman sayısı sıfırdır.',
      ),
      kart(
        'Birleşim ve kesişim',
        's(A∪B) = s(A) + s(B) − s(A∩B). Ortak elemanları iki kez saymamak için çıkarılır.',
      ),
      kart(
        'Sayı kümeleri',
        'Doğal (ℕ) ⊂ tam (ℤ) ⊂ rasyonel (ℚ) ⊂ gerçek (ℝ). İrrasyonel sayılar rasyonel değildir ama gerçek sayıdır: √2, π.',
      ),
      kart(
        'Aralık gösterimi',
        'Köşeli parantez ucu içeri alır, normal parantez almaz: [2, 5) → 2 dâhil, 5 değil. Sonsuz her zaman açık uçlu yazılır.',
      ),
    ]),
    konu('mat9-uslu', 'Üslü Sayılar', [
      kart(
        'Temel kurallar',
        'aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐ·ⁿ. Taban aynı olmadan üsler toplanmaz.',
      ),
      kart(
        'Sıfır ve negatif üs',
        'a⁰ = 1 (a ≠ 0), a⁻ⁿ = 1/aⁿ. Negatif üs sayıyı negatif yapmaz, ters çevirir.',
      ),
      kart(
        'İşaret tuzağı',
        '(−2)⁴ = 16 ama −2⁴ = −16. Parantez yoksa üs yalnız sayıya aittir, eksiye değil.',
      ),
      kart(
        'Bilimsel gösterim',
        'a × 10ⁿ biçiminde, 1 ≤ a < 10. Çok büyük ve çok küçük sayıları karşılaştırmayı kolaylaştırır.',
      ),
    ]),
    konu('mat9-koklu', 'Köklü Sayılar', [
      kart(
        'Kök ve üs ilişkisi',
        'ⁿ√aᵐ = aᵐ/ⁿ. Kökü kesirli üs olarak yazmak, üslü sayı kurallarını köklerde de kullanmayı sağlar.',
      ),
      kart(
        'Çift dereceli kökün içi',
        'Negatif olamaz. √x ifadesinde x ≥ 0 olmak zorundadır; tek dereceli kökte böyle bir sınır yok.',
      ),
      kart(
        '√a² = |a|',
        'Sonuç her zaman pozitiftir. Bu yüzden √(−3)² = 3 olur, −3 değil.',
      ),
      kart(
        'Paydayı rasyonel yapma',
        'Payda tek terimliyse aynı kökle, iki terimliyse eşleniğiyle genişletilir: 1/(√3−1) → (√3+1)/2.',
      ),
    ]),
    konu('mat9-ozdeslik', 'Özdeşlikler ve Çarpanlara Ayırma', [
      kart(
        'Tam kare',
        '(a ± b)² = a² ± 2ab + b². Ortadaki 2ab terimini unutmak en sık yapılan hata.',
      ),
      kart(
        'İki kare farkı',
        'a² − b² = (a − b)(a + b). Kare **toplamı** çarpanlarına ayrılmaz.',
      ),
      kart(
        'Küp özdeşlikleri',
        'a³ ± b³ = (a ± b)(a² ∓ ab + b²). İkinci parantezteki ortadaki terimin işareti birincinin tersidir.',
      ),
      kart(
        'Ortak çarpan',
        'Çarpanlara ayırmada ilk bakılacak yer. Önce ortak çarpanı al, sonra kalan ifadeye özdeşlik uygula.',
      ),
      kart(
        'Üç terimli ayırma',
        'x² + bx + c için çarpımı c, toplamı b olan iki sayı aranır: x² + 5x + 6 = (x+2)(x+3).',
      ),
    ]),
  ]),
  tema('mat9-t2', 'Nicelikler ve Değişimler', [
    konu('mat9-denklem', 'Birinci Dereceden Denklemler', [
      kart(
        'Denklem çözmenin mantığı',
        'İki tarafa aynı işlemi uygulamak eşitliği bozmaz. Amaç bilinmeyeni yalnız bırakmak.',
      ),
      kart(
        'Çözüm kümesi üç türlü',
        'Tek çözüm, sonsuz çözüm (0·x = 0) ya da çözümsüz (0·x = 5). Katsayı sıfırlanınca sağ tarafa bak.',
      ),
      kart(
        'Problem kurma',
        'Bilinmeyeni seç, cümleyi olduğu gibi denkleme çevir. "5 fazlası" → x + 5, "5 katının 3 eksiği" → 5x − 3.',
      ),
    ]),
    konu('mat9-esitsizlik', 'Eşitsizlikler', [
      kart(
        'Negatifle çarpma',
        'Eşitsizliğin iki tarafı negatif bir sayıyla çarpılır ya da bölünürse **yön değişir**. En sık atlanan kural.',
      ),
      kart(
        'Çözüm bir aralıktır',
        'Denklemin çözümü nokta, eşitsizliğin çözümü aralıktır. Sayı doğrusunda göstermek kontrolü kolaylaştırır.',
      ),
      kart(
        'Çift eşitsizlik',
        'a < x < b biçimindeki ifadede yapılan işlem üç bölgeye birden uygulanır.',
      ),
    ]),
    konu('mat9-fonksiyon', 'Doğrusal Fonksiyonlar', [
      kart(
        'Fonksiyon nedir?',
        'Her girdiye **tek** çıktı eşleyen kural. Bir girdiye iki çıktı düşüyorsa fonksiyon değildir.',
      ),
      kart(
        'Doğrusal fonksiyon',
        'f(x) = ax + b. Grafiği doğrudur; a eğim, b y eksenini kestiği noktadır.',
      ),
      kart(
        'Eğimin anlamı',
        'x bir birim artınca y’nin ne kadar değiştiği. Pozitif eğim artan, negatif eğim azalan doğru demektir.',
      ),
      kart(
        'İki noktadan eğim',
        'a = (y₂ − y₁)/(x₂ − x₁). Paydanın sıfır olması doğrunun düşey olduğunu, eğimin tanımsız olduğunu gösterir.',
      ),
      kart(
        'Paralel ve dik doğrular',
        'Paralel doğruların eğimi eşittir. Dik doğrularda eğimlerin çarpımı −1’dir.',
      ),
    ]),
    konu('mat9-mutlak', 'Mutlak Değer', [
      kart(
        'Tanım',
        '|x| sayının sıfıra uzaklığıdır, bu yüzden hiçbir zaman negatif olmaz. x ≥ 0 ise |x| = x, x < 0 ise |x| = −x.',
      ),
      kart(
        'Denklem çözümü',
        '|x| = a (a > 0) iki durum verir: x = a veya x = −a. a negatifse çözüm yoktur.',
      ),
      kart(
        'Eşitsizlik',
        '|x| < a → −a < x < a (arada kalır). |x| > a → x < −a veya x > a (dışarı çıkar).',
      ),
      kart(
        'Grafiği',
        'f(x) = |x| grafiği V şeklindedir; tepe noktası mutlak değerin içini sıfırlayan yerdedir.',
      ),
    ]),
  ]),
  tema('mat9-t3', 'Algoritma ve Bilişim', [
    konu('mat9-algoritma', 'Algoritma ve Akış Şeması', [
      kart(
        'Algoritma nedir?',
        'Bir işi bitiren, sonlu ve sıralı adımlar dizisi. Belirsiz adım içeremez; her adım tek bir anlama gelmelidir.',
      ),
      kart(
        'Akış şeması sembolleri',
        'Oval başlangıç/bitiş, paralelkenar giriş/çıkış, dikdörtgen işlem, eşkenar dörtgen karar.',
      ),
      kart(
        'Üç temel yapı',
        'Sıralı işlem, koşul (eğer…ise) ve döngü. Her algoritma bu üçünün birleşimiyle yazılabilir.',
      ),
      kart(
        'İzleme tablosu',
        'Değişkenlerin adım adım aldığı değerleri yazmak, algoritmanın doğruluğunu sınamanın en pratik yolu.',
      ),
    ]),
    konu('mat9-mantik', 'Mantık Bağlaçları', [
      kart(
        'Önerme',
        'Doğru ya da yanlış olduğu kesin olarak söylenebilen cümle. Soru ve emir cümleleri önerme değildir.',
      ),
      kart(
        've / veya',
        '"ve" (∧) yalnız ikisi de doğruyken doğrudur. "veya" (∨) en az biri doğruyken doğrudur.',
      ),
      kart(
        'İse (koşullu)',
        'p → q yalnızca p doğru, q yanlışken yanlış olur. Öncül yanlışsa önerme doğru sayılır.',
      ),
      kart(
        'Karşıt tersi',
        'p → q ile ~q → ~p her zaman aynı doğruluk değerini taşır. İspatlarda bu eşdeğerlik kullanılır.',
      ),
      kart(
        'Niceleyiciler',
        '∀ "her" demektir, tek bir karşı örnekle çürütülür. ∃ "en az bir" demektir, tek bir örnekle kanıtlanır.',
      ),
    ]),
    konu('mat9-sifreleme', 'Şifreleme', [
      kart(
        'Neden matematik?',
        'Şifreleme, geri döndürülmesi zor bir işlem bulma problemidir. Modüler aritmetik ve büyük asal sayılar bu yüzden kullanılır.',
      ),
      kart(
        'Sezar şifresi',
        'Her harfi sabit sayıda kaydırma. 26 olasılık olduğu için denemeyle kolayca kırılır.',
      ),
      kart(
        'Modüler aritmetik',
        'Saat aritmetiği: 26’ya bölümden kalanla çalışmak. Kaydırma şifrelerinin matematiksel karşılığı budur.',
      ),
      kart(
        'Simetrik ve açık anahtar',
        'Simetrikte iki taraf aynı anahtarı kullanır. Açık anahtarda şifreleyen anahtar herkese açıktır, çözen anahtar gizlidir.',
      ),
    ]),
  ]),
  tema('mat9-t4', 'Geometrik Şekiller', [
    konu('mat9-acilar', 'Açılar ve Doğrular', [
      kart(
        'Açı çiftleri',
        'Tümler açıların toplamı 90°, bütünler açıların toplamı 180°. Ters açılar eşittir.',
      ),
      kart(
        'Paralel doğrular',
        'Bir kesenle kesilen paralellerde yöndeş, ters ve iç ters açılar eşit; iç yan açılar bütünlerdir.',
      ),
      kart(
        'Z ve F kuralı',
        'Şekilde Z görüyorsan açılar eşit (iç ters), F görüyorsan eşit (yöndeş). Hızlı kontrol yöntemi.',
      ),
    ]),
    konu('mat9-ucgen', 'Üçgende Açı ve Kenar', [
      kart(
        'İç açılar toplamı',
        'Her üçgende 180°. Dış açılar toplamı ise her çokgende 360°.',
      ),
      kart(
        'Dış açı',
        'Bir dış açı, komşu olmayan iki iç açının toplamına eşittir.',
      ),
      kart(
        'Kenar-açı ilişkisi',
        'Büyük açının karşısında büyük kenar bulunur. Üçgeni sıralamak için önce açıları sırala.',
      ),
      kart(
        'Üçgen eşitsizliği',
        'Bir kenar, öteki iki kenarın toplamından küçük ve farkının mutlak değerinden büyüktür: |b−c| < a < b+c.',
      ),
      kart(
        'Üçgen çeşitleri',
        'Kenarlarına göre eşkenar, ikizkenar, çeşitkenar; açılarına göre dar, dik, geniş açılı.',
      ),
    ]),
    konu('mat9-yardimci', 'Üçgende Yardımcı Elemanlar', [
      kart(
        'Kenarortay',
        'Köşeden karşı kenarın orta noktasına çizilir. Üçü ağırlık merkezinde kesişir ve orayı 2:1 oranında böler.',
      ),
      kart(
        'Açıortay',
        'Bir açıyı iki eş parçaya böler. Üzerindeki her nokta açının kollarına eşit uzaklıktadır.',
      ),
      kart(
        'Yükseklik',
        'Köşeden karşı kenara indirilen dik. Geniş açılı üçgende bazı yükseklikler üçgenin dışında kalır.',
      ),
      kart(
        'Alan',
        'Alan = (taban × yükseklik)/2. Aynı tabana ve aynı yüksekliğe sahip üçgenlerin alanı eşittir.',
      ),
    ]),
  ]),
  tema('mat9-t5', 'Eşlik ve Benzerlik', [
    konu('mat9-donusum', 'Dönüşümler', [
      kart(
        'Öteleme',
        'Şekil aynı yönde, aynı miktarda kaydırılır. Boyut ve yön korunur.',
      ),
      kart(
        'Yansıma',
        'Bir doğruya göre simetrik görüntü alınır. x eksenine göre yansımada y’nin, y eksenine göre yansımada x’in işareti değişir.',
      ),
      kart(
        'Dönme',
        'Bir merkez etrafında belli açı kadar döndürme. Saat yönünün tersi pozitif kabul edilir.',
      ),
      kart(
        'Üçü de eşlik üretir',
        'Öteleme, yansıma ve dönme şeklin boyutunu değiştirmez; sonuç orijinaline **eş**tir.',
      ),
    ]),
    konu('mat9-eslik', 'Eşlik ve Benzerlik', [
      kart(
        'Eşlik ve benzerlik farkı',
        'Eş üçgenlerin hem açıları hem kenarları aynıdır. Benzer üçgenlerde açılar aynı, kenarlar orantılıdır.',
      ),
      kart(
        'Eşlik ölçütleri',
        'KKK, KAK, AKA. Üç açının eşit olması eşlik için yetmez — o yalnızca benzerlik verir.',
      ),
      kart(
        'Benzerlik oranı',
        'Kenarlar k oranındaysa çevreler de k, alanlar ise k² oranındadır. Alan oranını doğrudan k almak sık yapılan hata.',
      ),
    ]),
    konu('mat9-tales', 'Tales, Öklid ve Pisagor', [
      kart(
        'Tales teoremi',
        'Paralel doğrular, kestikleri doğrularda orantılı parçalar ayırır. Üçgende bir kenara paralel doğru benzer üçgen üretir.',
      ),
      kart(
        'Pisagor',
        'Dik üçgende a² + b² = c². Yalnız dik üçgende geçerlidir; c hipotenüstür.',
      ),
      kart(
        'Bilinen üçlüler',
        '3-4-5, 5-12-13, 8-15-17 ve katları. Tanımak soruda zaman kazandırır.',
      ),
      kart(
        'Öklid bağıntıları',
        'Dik üçgende hipotenüse ait yükseklik h için h² = p·q; ayrıca a² = p·c ve b² = q·c olur.',
      ),
    ]),
  ]),
  tema('mat9-t6', 'İstatistiksel Araştırma Süreci', [
    konu('mat9-veri', 'Veri ve Araştırma Süreci', [
      kart(
        'Sürecin adımları',
        'Soru sor → veri topla → veriyi düzenle ve göster → yorumla. Soru netleşmeden toplanan veri işe yaramaz.',
      ),
      kart(
        'Değişken türleri',
        'Nicel değişken sayıyla ölçülür (boy, süre); nitel değişken kategoridir (renk, cinsiyet).',
      ),
      kart(
        'Örneklem',
        'Tüm kitleye ulaşılamadığında seçilen alt grup. Temsil etmiyorsa sonuç yanlıdır.',
      ),
    ]),
    konu('mat9-merkez', 'Merkezî Eğilim ve Yayılım', [
      kart(
        'Ortalama, ortanca, tepe değer',
        'Ortalama toplamın sayıya bölümü, ortanca sıralı verinin ortası, tepe değer en çok tekrarlanan.',
      ),
      kart(
        'Hangisi daha güvenilir?',
        'Uç değer varsa ortalama yanılır, ortanca dayanıklıdır. Bir milyarderin girdiği sınıfın ortalama geliri sınıfı anlatmaz.',
      ),
      kart(
        'Açıklık ve çeyrekler',
        'Açıklık = en büyük − en küçük. Çeyrekler veriyi dörde böler; Ç3 − Ç1 çeyrekler açıklığıdır.',
      ),
      kart(
        'Standart sapma',
        'Verinin ortalamadan ne kadar yayıldığını gösterir. Küçükse veriler ortalamaya yakın toplanmıştır.',
      ),
    ]),
    konu('mat9-grafik', 'Histogram ve Kutu Grafiği', [
      kart(
        'Histogram',
        'Sürekli veriyi aralıklara bölüp sıklığı gösterir. Sütun grafiğinden farkı: sütunlar bitişiktir, çünkü aralıklar süreklidir.',
      ),
      kart(
        'Kutu grafiği',
        'Beş sayı özetini gösterir: en küçük, Ç1, ortanca, Ç3, en büyük. Kutu verinin ortadaki %50’sidir.',
      ),
      kart(
        'Grafik yorumlama',
        'Sağa çarpık dağılımda ortalama ortancadan büyüktür. Kutunun uzun tarafı verinin yayıldığı yönü söyler.',
      ),
      kart(
        'Yanıltıcı grafik',
        'Düşey eksene sıfırdan başlamayan grafik farkı olduğundan büyük gösterir. Önce ekseni oku.',
      ),
    ]),
  ]),
  tema('mat9-t7', 'Veriden Olasılığa', [
    konu('mat9-olasilik', 'Olasılığın Temelleri', [
      kart(
        'Örnek uzay',
        'Bir deneyin bütün olası sonuçları. Zarda 6, iki zarda 36 sonuç vardır.',
      ),
      kart(
        'Teorik olasılık',
        'İstenen durum / tüm durumlar. Sonuçların eşit olasılıklı olduğu varsayılır.',
      ),
      kart(
        'Deneysel olasılık',
        'Gözlenen sıklık / deneme sayısı. Deneme sayısı arttıkça teorik değere yaklaşır.',
      ),
      kart(
        'Olasılığın sınırları',
        'Her olasılık 0 ile 1 arasındadır. İmkânsız olay 0, kesin olay 1’dir.',
      ),
    ]),
    konu('mat9-olay', 'Olay Türleri', [
      kart(
        'Ayrık olaylar',
        'Aynı anda gerçekleşemezler. P(A veya B) = P(A) + P(B).',
      ),
      kart(
        'Ayrık olmayan olaylar',
        'Ortak sonuçları vardır: P(A∪B) = P(A) + P(B) − P(A∩B). Ortak kısmı iki kez saymamak için çıkarılır.',
      ),
      kart(
        'Tümleyen olay',
        'P(A) + P(A′) = 1. "En az bir" içeren sorularda tümleyenden gitmek çoğu zaman daha kısadır.',
      ),
      kart(
        'Bağımsız olaylar',
        'Biri ötekini etkilemiyorsa P(A ve B) = P(A) · P(B). Yazı-tura atışlarında önceki sonuç sonrakini etkilemez.',
      ),
    ]),
  ]),
])
