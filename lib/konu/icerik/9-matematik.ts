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
 */
export const matematik9 = program('matematik', 9, 'Sayılardan olasılığa', [
  tema('mat9-t1', 'Sayılar', [
    konu('mat9-uslu-koklu', 'Üslü ve Köklü Gösterimlerle İşlemler', [
      kart(
        'Üslü ifade',
        'aⁿ, a sayısının n kez çarpımıdır. a⁰ = 1 (a ≠ 0), a⁻ⁿ = 1/aⁿ.',
      ),
      kart(
        'Üslü sayı kuralları',
        'Aynı tabanda çarpmada üsler toplanır, bölmede çıkarılır; üssün üssü alınırken üsler çarpılır.',
      ),
      kart(
        'Köklü ifade',
        'ⁿ√a, n. kuvveti a olan sayıdır. Köklü ifade kesirli üsle de yazılır: √a = a^(1/2).',
      ),
      kart(
        'Paydayı rasyonel yapma',
        'Paydadaki kök, uygun bir ifadeyle genişletilerek yok edilir; iki terimliyse eşleniğiyle çarpılır.',
      ),
      kart(
        'Dikkat: √(a²) = |a|',
        'Karekökün sonucu negatif olamaz. Bu yüzden değişkenli ifadelerde mutlak değer gerekir.',
      ),
    ]),
    konu('mat9-araliklar', 'Gerçek Sayı Aralıkları ve Küme Sembolleri', [
      kart(
        'Aralık gösterimi',
        'Köşeli parantez uç noktayı içerir, normal parantez içermez: [2, 5) → 2 dâhil, 5 hariç.',
      ),
      kart(
        'Sayı doğrusunda',
        'Dolu nokta uç noktanın dâhil olduğunu, boş nokta dâhil olmadığını gösterir.',
      ),
      kart(
        'Birleşim ve kesişim',
        'Birleşim iki aralığın tamamı, kesişim ortak kısmıdır. Kesişim boş olabilir.',
      ),
      kart(
        'Sonsuz uç',
        'Sonsuz bir sayı değildir, bu yüzden yanına daima normal parantez konur: (−∞, 3].',
      ),
    ]),
    konu('mat9-sayi-kumeleri', 'Sayı Kümeleri ve İşlem Özellikleri', [
      kart(
        'Kümeler iç içedir',
        'Doğal ⊂ tam ⊂ rasyonel ⊂ gerçek. İrrasyonel sayılar rasyonellerin dışındadır.',
      ),
      kart(
        'Rasyonel sayı',
        'a/b biçiminde yazılabilen sayı (b ≠ 0). Ondalık açılımı ya sonludur ya devirlidir.',
      ),
      kart(
        'İrrasyonel sayı',
        'Kesir olarak yazılamayan sayı: √2, π. Ondalık açılımı sonsuz ve devirsizdir.',
      ),
      kart(
        'İşlem özellikleri',
        'Değişme, birleşme, dağılma; etkisiz eleman toplamada 0 çarpmada 1; ters eleman −a ve 1/a.',
      ),
      kart(
        'Çıkarma ve bölme',
        'Değişme özelliği yoktur: 5 − 3 ile 3 − 5 aynı değildir. Bu yüzden ayrı işlem sayılırlar.',
      ),
    ]),
    konu('mat9-cebirsel-ifade', 'İşlem Özelliklerini Cebirsel Olarak İfade Etme', [
      kart(
        'Neden harf?',
        'Harf, "her sayı için" demenin kısa yolu. a + b = b + a bir kural değil, sonsuz eşitliğin özetidir.',
      ),
      kart(
        'Dağılma özelliği',
        'a(b + c) = ab + ac. Çarpanlara ayırmanın da temeli budur, ters yönde okunur.',
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
        'Doğrusal fonksiyon',
        'f(x) = ax + b biçimindedir ve grafiği bir doğrudur.',
      ),
      kart(
        'Eğim',
        'a katsayısı eğimdir: x bir birim arttığında y’nin ne kadar değiştiğini söyler.',
      ),
      kart(
        'Artan mı azalan mı?',
        'a > 0 ise fonksiyon artandır, a < 0 ise azalandır, a = 0 ise sabittir.',
      ),
      kart(
        'Kesim noktaları',
        'b değeri y eksenini kestiği noktadır; x eksenini kestiği yer f(x) = 0 çözülerek bulunur.',
      ),
    ]),
    konu('mat9-mutlak-deger', 'Mutlak Değer Fonksiyonu ve Nitel Özellikleri', [
      kart(
        'Mutlak değer',
        'Bir sayının sıfıra olan uzaklığı. Sonucu asla negatif olamaz.',
      ),
      kart(
        'Tanımı',
        '|x| = x (x ≥ 0 ise), |x| = −x (x < 0 ise). Parçalı bir tanımdır.',
      ),
      kart(
        'Grafiği',
        'V şeklindedir ve tepe noktası kırılma noktasıdır. |x| grafiğinin tepesi orijindedir.',
      ),
      kart(
        'Denklem çözerken',
        '|x| = a denkleminin a > 0 için iki çözümü vardır: x = a ve x = −a.',
      ),
      kart(
        'Eşitsizlikte',
        '|x| < a ise −a < x < a; |x| > a ise x < −a ya da x > a. İkisi karıştırılıyor.',
      ),
    ]),
    konu('mat9-denklem-esitsizlik', 'Doğrusal Denklem ve Eşitsizlikler İçeren Problemler', [
      kart(
        'Denklem kurmak',
        'Bilinmeyeni seç, cümleyi eşitliğe çevir, çöz, sonucu problemin bağlamında kontrol et.',
      ),
      kart(
        'Eşitsizlikte işaret',
        'İki tarafı negatif sayıyla çarparken ya da bölerken eşitsizlik yön değiştirir.',
      ),
      kart(
        'Çözüm kümesi',
        'Denklemin çözümü genellikle tek noktadır; eşitsizliğin çözümü bir aralıktır.',
      ),
      kart(
        'Problemde anlam kontrolü',
        'Kişi sayısı negatif, yaş kesirli çıkmaz. Matematiksel doğru çözüm bağlamda geçersiz olabilir.',
      ),
    ]),
  ]),
  tema('mat9-t3', 'Geometrik Şekiller', [
    konu('mat9-ucgen-ozellik', 'Üçgende Açı ve Kenarla İlgili Özellikler', [
      kart(
        'İç açılar toplamı',
        'Bir üçgenin iç açıları toplamı 180°, dış açıları toplamı 360°’dir.',
      ),
      kart(
        'Dış açı özelliği',
        'Bir dış açı, kendisine komşu olmayan iki iç açının toplamına eşittir.',
      ),
      kart(
        'Kenar-açı ilişkisi',
        'Büyük açının karşısında büyük kenar bulunur. İkisi aynı yönde değişir.',
      ),
      kart(
        'Üçgen eşitsizliği',
        'İki kenarın toplamı üçüncü kenardan büyük, farkının mutlak değeri ondan küçük olmalıdır.',
      ),
      kart(
        'Üçgen türleri',
        'Kenarlarına göre eşkenar, ikizkenar, çeşitkenar; açılarına göre dar, dik ve geniş açılı.',
      ),
    ]),
  ]),
  tema('mat9-t4', 'Eşlik ve Benzerlik', [
    konu('mat9-donusum', 'Geometrik Dönüşümler', [
      kart(
        'Öteleme',
        'Şekil belirli bir yönde ve miktarda kaydırılır. Boyut ve şekil değişmez.',
      ),
      kart(
        'Yansıma',
        'Bir doğruya göre simetrik görüntü alınır. Şekil ters döner ama ölçüleri korunur.',
      ),
      kart(
        'Döndürme',
        'Bir nokta çevresinde belirli açıyla çevrilir. Yön ve açı birlikte belirtilmelidir.',
      ),
      kart(
        'Eşlik dönüşümleri',
        'Öteleme, yansıma ve döndürme uzunlukları korur; ürettikleri şekil orijinaline eştir.',
      ),
      kart(
        'Benzerlik dönüşümü',
        'Ölçekleme (homoteti) boyutu değiştirir ama açıları korur; sonuç benzer bir şekildir.',
      ),
    ]),
    konu('mat9-eslik-kosul', 'Eşlik ve Benzerlik Koşulları', [
      kart(
        'Eşlik nedir?',
        'İki şeklin bütün karşılıklı kenar ve açılarının eşit olması. Üst üste tam olarak çakışırlar.',
      ),
      kart(
        'Eşlik koşulları',
        'KKK, KAK, AKA ve dik üçgenlerde hipotenüs-kenar. Üç uygun eleman eşliği garanti eder.',
      ),
      kart(
        'Benzerlik nedir?',
        'Açılar eşit, karşılıklı kenarlar orantılıdır. Şekil aynı, ölçek farklıdır.',
      ),
      kart(
        'Benzerlik koşulları',
        'AA, KKK (oran) ve KAK (oran). İki açının eşitliği benzerlik için yeter.',
      ),
      kart(
        'Eşlik özel bir benzerliktir',
        'Benzerlik oranı 1 olan benzerlik, eşliktir. Her eş şekil benzerdir, tersi doğru değildir.',
      ),
    ]),
    konu('mat9-benzer-ucgen', 'Benzer Üçgenler Oluşturma', [
      kart(
        'Paralel kesen',
        'Bir üçgende bir kenara paralel çizilen doğru, orijinaline benzer küçük bir üçgen üretir.',
      ),
      kart(
        'Benzerlik oranı',
        'Karşılıklı kenarların oranı. Çevreler de aynı oranda, alanlar ise oranın karesi kadar değişir.',
      ),
      kart(
        'Karşılıklı elemanlar',
        'Benzerlik yazılırken köşeler doğru sırayla eşleştirilmelidir; sıra bozulursa oranlar yanlış kurulur.',
      ),
      kart(
        'Günlük kullanım',
        'Gölge boyu ile ağaç boyunu hesaplamak benzer üçgen kurmaktır.',
      ),
    ]),
    konu('mat9-teoremler', 'Tales, Öklid ve Pisagor Teoremleri', [
      kart(
        'Tales teoremi',
        'Paralel doğrular, kestikleri doğrular üzerinde orantılı parçalar ayırır.',
      ),
      kart(
        'Pisagor teoremi',
        'Dik üçgende hipotenüsün karesi, dik kenarların karelerinin toplamına eşittir.',
      ),
      kart(
        'Pisagor üçlüleri',
        '(3,4,5), (5,12,13), (8,15,17) ve katları. Tanımak soruda zaman kazandırır.',
      ),
      kart(
        'Öklid bağıntıları',
        'Dik üçgende hipotenüse indirilen yükseklik, üçgeni kendisine benzer iki üçgene ayırır.',
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
        'En sık hata',
        'Karşılıklı olmayan kenarları oranlamak. Eşleştirme yanlışsa oran da yanlış olur.',
      ),
      kart(
        'Alan oranı',
        'Benzerlik oranı k ise alan oranı k²’dir. Uzunluk oranıyla alan oranı karıştırılıyor.',
      ),
      kart(
        'Uygulama',
        'Harita ölçeği, maket ve gölge boyu hesapları hep benzerlik problemidir.',
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
        'Akış şeması',
        'Oval başlangıç-bitiş, dikdörtgen işlem, eşkenar dörtgen karar, paralelkenar giriş-çıkış.',
      ),
      kart(
        'Yapılar',
        'Sıralı, koşullu (eğer) ve tekrarlı (döngü) yapılar. Her algoritma bu üçünün bileşimidir.',
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
        'Bağlaçlar',
        've (∧) ikisi birden doğruysa doğru; veya (∨) en az biri doğruysa doğru; değil (¬) tersine çevirir.',
      ),
      kart(
        'Koşullu önerme',
        'p ⇒ q yalnızca p doğru ve q yanlışken yanlıştır. Diğer üç durumda doğrudur.',
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
        'Programdaki "eğer" ifadeleri mantık önermeleridir; koşul doğruysa blok çalışır.',
      ),
      kart(
        'Bileşik koşullar',
        '"Yaş > 18 ve ehliyet var" gibi koşullar mantık bağlaçlarıyla kurulur.',
      ),
      kart(
        'Döngü koşulu',
        'Döngü, koşul önermesi doğru kaldığı sürece tekrarlanır. Koşul hiç yanlış olmazsa döngü bitmez.',
      ),
      kart(
        'Karar noktaları',
        'Akış şemasındaki her eşkenar dörtgen bir önermedir ve çıkışları doğru/yanlış diye ayrılır.',
      ),
    ]),
  ]),
  tema('mat9-t6', 'İstatistiksel Araştırma Süreci', [
    konu('mat9-veri-dagilim', 'Tek Nicel Değişkenli Veri Dağılımları', [
      kart(
        'Nicel ve nitel veri',
        'Nicel veri sayıyla ölçülür (boy, süre); nitel veri kategoriyle belirtilir (renk, cinsiyet).',
      ),
      kart(
        'Merkezî eğilim ölçüleri',
        'Aritmetik ortalama, ortanca (medyan) ve tepe değer (mod).',
      ),
      kart(
        'Ortalama mı ortanca mı?',
        'Aşırı uç değerler varsa ortalama yanıltır; ortanca uçlardan etkilenmez.',
      ),
      kart(
        'Yayılım ölçüleri',
        'Açıklık, çeyrekler açıklığı ve standart sapma. Verinin ne kadar dağıldığını söyler.',
      ),
      kart(
        'Grafikler',
        'Histogram dağılımın şeklini, kutu grafiği ise ortanca ve uç değerleri gösterir.',
      ),
    ]),
    konu('mat9-dagilim-inceleme', 'Başkalarının Oluşturduğu Veri Dağılımlarını İnceleme', [
      kart(
        'Neye bakılır?',
        'Eksen aralıkları, örneklem büyüklüğü, veri kaynağı ve grafiğin türü.',
      ),
      kart(
        'Kesik eksen',
        'Y ekseni sıfırdan başlamıyorsa küçük farklar büyük görünür. En sık kullanılan yanıltma budur.',
      ),
      kart(
        'Örneklem önemli',
        'Az sayıda ya da taraflı seçilmiş örneklem, doğru hesaplansa bile yanlış sonuç verir.',
      ),
      kart(
        'Korelasyon nedensellik değildir',
        'İki değişkenin birlikte artması, birinin ötekine sebep olduğunu göstermez.',
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
        'Deneme sayısı önemli',
        'Deneme arttıkça deneysel olasılık teorik olasılığa yaklaşır. Az denemede sapma büyük olur.',
      ),
      kart(
        'Neden gerekli?',
        'Teorik olasılığı hesaplanamayan durumlarda (bozuk zar, hava durumu) tek yol gözlemdir.',
      ),
      kart(
        'Sıklık tablosu',
        'Deneme sonuçları sıklık tablosuna işlenir; oranlar buradan hesaplanır.',
      ),
    ]),
    konu('mat9-teorik', 'Teorik Olasılık', [
      kart(
        'Tanımı',
        'İstenen durum sayısının, tüm olası durum sayısına oranı. Sonuçların eşit olasılıklı olması gerekir.',
      ),
      kart(
        'Değer aralığı',
        'Olasılık 0 ile 1 arasındadır. 0 imkânsız, 1 kesin olayı gösterir.',
      ),
      kart(
        'Örnek uzay',
        'Tüm olası sonuçların kümesi. Bir zarda örnek uzay {1,2,3,4,5,6}, eleman sayısı 6’dır.',
      ),
      kart(
        'Tümleyen olay',
        'Bir olayın olmama olasılığı, 1’den olma olasılığının çıkarılmasıdır.',
      ),
      kart(
        'Yaygın yanılgı',
        'Yazı gelen bir paranın sonraki atışta tura gelme olasılığı yine 1/2’dir; para geçmişi hatırlamaz.',
      ),
    ]),
  ]),
])
