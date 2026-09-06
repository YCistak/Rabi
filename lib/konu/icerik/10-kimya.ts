import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Kimya — Maarif Modeli.
 *
 * Konu adları ve sırası programın İçerik Çerçevesi'nden
 * (`maarif/iskelet.json`); `maarif.test.ts` denetliyor.
 *
 * **Mol burada.** Eski programda 9. sınıfta olan mol kavramı ve
 * stokiyometri Maarif'te 10. sınıfın ilk temasına taşındı; 9. sınıf
 * dosyasında bu yüzden yok.
 */
export const kimya10 = program('kimya', 10, 'Tepkimelerden çözeltilere', [
  tema('kim10-t1', 'Etkileşim', [
    konu('kim10-gosterge', 'Kimyasal Değişimin Göstergeleri', [
      kart(
        'Fiziksel mi kimyasal mı?',
        'Fiziksel değişimde madde aynı kalır, yalnızca hâli ya da şekli değişir. Kimyasal değişimde yeni madde oluşur.',
      ),
      kart(
        'Gözle görülen kanıtlar',
        'Renk değişimi, gaz çıkışı, çökelek oluşumu, ısı ya da ışık salınması. Biri varsa kimyasal değişim güçlü olasılıktır.',
      ),
      kart(
        'Aldatıcı olabilir',
        'Kaynayan suda da kabarcık çıkar ama bu kimyasal değişim değil. Tek bir gösterge kanıt sayılmaz.',
      ),
      kart(
        'Geri dönüşümlü mü?',
        'Buzun erimesi kolayca geri alınır; yanmış kâğıt geri gelmez. Kimyasal değişimi geri almak yeni bir tepkime ister.',
      ),
    ]),
    konu('kim10-olusum', 'Kimyasal Tepkimelerin Oluşumu', [
      kart(
        'Bağlar kopar, yenisi kurulur',
        'Tepkimede atomlar yok olmaz; yalnızca aralarındaki bağlar kopar ve atomlar yeniden düzenlenir.',
      ),
      kart(
        'Kütle korunur',
        'Girenlerin toplam kütlesi ürünlerin toplam kütlesine eşittir. Atom sayısı iki tarafta da aynıdır.',
      ),
      kart(
        'Enerji alışverişi',
        'Bağ kırmak enerji ister, bağ kurmak enerji verir. Farkı pozitifse ortam soğur, negatifse ısınır.',
      ),
      kart(
        'Çarpışma gerekir',
        'Tanecikler yeterli enerjiyle ve uygun yönde çarpışmazsa tepkime olmaz. Isıtmak bu yüzden hızlandırır.',
      ),
    ]),
    konu('kim10-tur', 'Kimyasal Tepkime Türleri', [
      kart(
        'Yanma tepkimeleri',
        'Madde oksijenle birleşir, ısı ve ışık açığa çıkar. Organik yanmada ürünler karbondioksit ve sudur.',
      ),
      kart(
        'Asit-baz tepkimesi',
        'Asit ile baz birleşerek tuz ve su verir. Nötrleşme de denir; mide ilacı bu ilkeyle çalışır.',
      ),
      kart(
        'Çökelme tepkimesi',
        'İki çözelti karışınca suda çözünmeyen bir katı oluşur. Oluşan katıya çökelek denir.',
      ),
      kart(
        'Redoks tepkimesi',
        'Elektron alışverişi vardır: elektron veren yükseltgenir, alan indirgenir. Paslanma ve pil tepkimeleri böyledir.',
      ),
      kart(
        'Sentez ve analiz',
        'Sentezde birden çok madde birleşip tek ürün verir; analizde tek madde parçalanır.',
      ),
    ]),
    konu('kim10-mol', 'Mol Kavramı', [
      kart(
        'Mol nedir?',
        'Tanecik saymanın birimi. 1 mol, 6,02×10²³ tanecik demektir; bu sayıya Avogadro sayısı denir.',
      ),
      kart(
        'Neden gerekli?',
        'Atomlar tek tek tartılamaz. Mol, laboratuvarda tartılan gramı tanecik sayısına çeviren köprüdür.',
      ),
      kart(
        'Molar kütle',
        '1 molün gram cinsinden kütlesi. Sayıca atom ya da molekül kütlesine eşittir: su için 18 g/mol.',
      ),
      kart(
        'Gazlarda molar hacim',
        'Normal şartlarda (0 °C, 1 atm) her ideal gazın 1 molü 22,4 litre yer kaplar; gazın cinsi fark etmez.',
      ),
      kart(
        'Üç yönlü çevrim',
        'Kütle ↔ mol ↔ tanecik sayısı. Molar kütle ile Avogadro sayısı bu üçünü birbirine bağlar.',
      ),
    ]),
    konu('kim10-denklestirme', 'Kimyasal Tepkime Denklemlerinin Denkleştirilmesi', [
      kart(
        'Neden denkleştirilir?',
        'Atom yoktan var olmaz. İki tarafta her elementin atom sayısı eşit olmalıdır.',
      ),
      kart(
        'Katsayı değişir, indis değişmez',
        'Formülün alt indisine dokunulmaz — değiştirmek maddeyi değiştirir. Yalnızca önündeki katsayı büyütülür.',
      ),
      kart(
        'İzlenecek sıra',
        'Önce yalnız bir bileşikte geçen elementler, en sona oksijen ve hidrojen bırakılır. Sonda katsayılar sadeleştirilir.',
      ),
      kart(
        'Hâl gösterimi',
        'Denklemde (k) katı, (s) sıvı, (g) gaz, (suda) sulu çözelti demektir. Çökelek ve gaz çıkışı buradan okunur.',
      ),
    ]),
    konu('kim10-hesap', 'Kimyasal Hesaplamalar', [
      kart(
        'Katsayılar oran verir',
        'Denkleştirilmiş denklemdeki katsayılar mol oranıdır. Bütün hesaplar bu orandan yürür.',
      ),
      kart(
        'Sınırlayıcı bileşen',
        'Önce biten madde tepkimeyi durdurur; ürün miktarını o belirler. Artan maddenin fazlası tepkimeye giremez.',
      ),
      kart(
        'Yüzde verim',
        'Gerçekte elde edilen ürünün, teorik olarak beklenene oranı. Kayıplar yüzünden pratikte %100’e ulaşılmaz.',
      ),
      kart(
        'Hesabın yolu',
        'Verilen kütleyi mole çevir, katsayı oranıyla aranan maddenin molünü bul, sonra istenen birime dön.',
      ),
    ]),
    konu('kim10-gaz-ozellik', 'Gazların Özellikleri ve Kinetik Moleküler Teori', [
      kart(
        'Gazın dört değişkeni',
        'Basınç, hacim, sıcaklık ve mol sayısı. Gaz yasalarının tamamı bu dördü arasındaki ilişkidir.',
      ),
      kart(
        'Kinetik moleküler teori',
        'Tanecikler sürekli ve rastgele hareket eder, aralarındaki hacim taneciklerin yanında çok büyüktür, çarpışmalar esnektir.',
      ),
      kart(
        'Basınç nereden gelir?',
        'Taneciklerin kap çeperine çarpmasından. Tanecik sayısı ya da hızı arttıkça basınç artar.',
      ),
      kart(
        'Sıcaklık ve hız',
        'Mutlak sıcaklık, taneciklerin ortalama kinetik enerjisiyle doğru orantılıdır. Hesaplarda Kelvin kullanılır.',
      ),
    ]),
    konu('kim10-gaz-yasa', 'Gaz Yasaları', [
      kart(
        'Boyle yasası',
        'Sabit sıcaklıkta basınç ile hacim ters orantılıdır. Şırıngayı sıkıştırmak bunun günlük örneği.',
      ),
      kart(
        'Charles yasası',
        'Sabit basınçta hacim ile mutlak sıcaklık doğru orantılıdır. Isınan balon şişer.',
      ),
      kart(
        'Gay-Lussac yasası',
        'Sabit hacimde basınç ile mutlak sıcaklık doğru orantılıdır. Isınan kapalı kap patlayabilir.',
      ),
      kart(
        'Avogadro yasası',
        'Aynı sıcaklık ve basınçta eşit hacimli gazlarda eşit sayıda tanecik vardır.',
      ),
    ]),
    konu('kim10-ideal', 'İdeal Gaz Yasası', [
      kart(
        'PV = nRT',
        'Dört değişkeni tek denklemde birleştirir. R gaz sabitidir; birim seçimine göre değeri değişir.',
      ),
      kart(
        'Sıcaklık Kelvin',
        'Denklemde sıcaklık mutlak olmalıdır. Santigrat kullanmak sonucu doğrudan yanlış çıkarır.',
      ),
      kart(
        'İdeallikten sapma',
        'Yüksek basınç ve düşük sıcaklıkta tanecik hacmi ve çekimler önemli hâle gelir; gaz ideal davranmaz.',
      ),
      kart(
        'Kısmi basınç',
        'Gaz karışımında toplam basınç, her gazın tek başına yapacağı basınçların toplamıdır.',
      ),
    ]),
    konu('kim10-graham', 'Graham Difüzyon ve Efüzyon Yasası', [
      kart(
        'Difüzyon ve efüzyon',
        'Difüzyon gazın başka bir gaz içinde yayılması, efüzyon küçük bir delikten dışarı sızmasıdır.',
      ),
      kart(
        'Graham yasası',
        'Yayılma hızı, molar kütlenin kareköküyle ters orantılıdır. Hafif gaz daha hızlı yayılır.',
      ),
      kart(
        'Günlük karşılığı',
        'Mutfakta doğal gaz kaçağı, ağır kokulardan daha çabuk hissedilir; hidrojen balonu heliumdan hızlı söner.',
      ),
    ]),
  ]),
  tema('kim10-t2', 'Çeşitlilik', [
    konu('kim10-cozunme', 'Çözünme Süreci', [
      kart(
        'Çözelti nedir?',
        'Bir maddenin başka bir madde içinde tanecik boyutunda ve homojen biçimde dağılmasıyla oluşan karışım.',
      ),
      kart(
        'Çözen ve çözünen',
        'Miktarca çok olan çözücü, az olan çözünendir. Sulu çözeltilerde su her zaman çözücü sayılır.',
      ),
      kart(
        'Üç adım',
        'Çözünenin tanecikleri ayrılır, çözücünün tanecikleri aralanır, sonra ikisi birbirini sarar. İlk ikisi enerji ister.',
      ),
      kart(
        'Isı alan mı veren mi?',
        'Sarma adımında açığa çıkan enerji, ayırma adımlarının istediğinden büyükse çözelti ısınır; küçükse soğur.',
      ),
    ]),
    konu('kim10-cozunebilirlik', 'Maddelerin Birbiri İçindeki Çözünebilirliği', [
      kart(
        'Benzer benzeri çözer',
        'Polar madde polar çözücüde, apolar madde apolar çözücüde çözünür. Tuz suda, yağ benzinde çözünür.',
      ),
      kart(
        'Su neden iyi çözücü?',
        'Polar ve hidrojen bağı yapabildiği için iyonları ve polar molekülleri kolayca sarar.',
      ),
      kart(
        'Yağ ile su',
        'Su molekülleri birbirini yağdan güçlü çeker; yağ dışarı itilir ve iki faz ayrı kalır.',
      ),
      kart(
        'Kısmen çözünenler',
        'Alkol hem polar hem apolar uç taşıdığı için hem suda hem yağlı maddelerde bir ölçüde çözünür.',
      ),
    ]),
    konu('kim10-siniflandirma', 'Çözünme Olayının Sınıflandırılması', [
      kart(
        'İyonik çözünme',
        'Madde suda iyonlarına ayrılır. Çözelti elektrik akımını iletir; tuz ve asitler böyledir.',
      ),
      kart(
        'Moleküler çözünme',
        'Madde molekül hâlinde dağılır, iyon oluşmaz. Şeker çözeltisi elektriği iletmez.',
      ),
      kart(
        'Elektrolit çözelti',
        'İçinde serbest iyon bulunduran ve akımı ileten çözelti. İyon sayısı arttıkça iletkenlik artar.',
      ),
      kart(
        'Nasıl anlaşılır?',
        'Basit bir devreye lamba bağlanır: çözeltiye daldırıldığında lamba yanıyorsa çözünme iyoniktir.',
      ),
    ]),
    konu('kim10-cozunurluk', 'Çözünürlük', [
      kart(
        'Tanımı',
        'Belirli sıcaklıkta 100 g çözücüde çözünebilen en fazla madde miktarı. Maddenin ayırt edici özelliğidir.',
      ),
      kart(
        'Doymuş çözelti',
        'Daha fazla madde çözemeyen çözelti. Eklenen fazlalık dibe çöker.',
      ),
      kart(
        'Aşırı doymuş çözelti',
        'Kararsız biçimde sınırın üstünde madde taşır. Küçük bir sarsıntı ya da kristal fazlalığı çökertir.',
      ),
      kart(
        'Çözünürlük eğrisi',
        'Sıcaklığa karşı çözünürlüğü gösteren grafik. Eğrinin üstü aşırı doymuş, altı doymamış bölgedir.',
      ),
    ]),
    konu('kim10-etkileyen', 'Çözünürlüğe Etki Eden Faktörler', [
      kart(
        'Madde cinsi',
        'Çözünürlük öncelikle çözücü ile çözünenin türüne bağlıdır. Aynı koşulda her madde farklı çözünür.',
      ),
      kart(
        'Sıcaklık — katılar',
        'Çoğu katının çözünürlüğü sıcaklıkla artar. Sıcak çayda şekerin çabuk çözünmesi bundan.',
      ),
      kart(
        'Sıcaklık — gazlar',
        'Gazların çözünürlüğü sıcaklıkla azalır. Isınan gazoz köpürür, ısınan suda balık için oksijen azalır.',
      ),
      kart(
        'Basınç',
        'Yalnızca gazları etkiler ve çözünürlüğü artırır. Gazoz şişesi açılınca basınç düşer ve gaz kaçar.',
      ),
      kart(
        'Etkilemeyenler',
        'Çözücü miktarı ve karıştırmak çözünürlüğü değiştirmez; yalnızca çözünme hızını değiştirir.',
      ),
    ]),
    konu('kim10-cozelti-sinif', 'Çözeltilerin Sınıflandırılması', [
      kart(
        'Derişik ve seyreltik',
        'Aynı çözücüde çok çözünen varsa derişik, az varsa seyreltiktir. Göreli bir karşılaştırmadır.',
      ),
      kart(
        'Doymuş, doymamış, aşırı doymuş',
        'Çözünürlük sınırına göre yapılan sınıflama. Derişik olmakla doymuş olmak aynı şey değildir.',
      ),
      kart(
        'Hâline göre',
        'Çözelti sıvı olmak zorunda değil: hava gaz çözeltisi, alaşımlar katı çözeltidir.',
      ),
      kart(
        'İletkenliğine göre',
        'Elektrolit çözeltiler akımı iletir, elektrolit olmayanlar iletmez.',
      ),
    ]),
    konu('kim10-derisim', 'Derişim Birimleri', [
      kart(
        'Molarite',
        '1 litre çözeltide çözünen madde mol sayısı. Birimi mol/L ve sembolü M’dir.',
      ),
      kart(
        'Dikkat: çözelti hacmi',
        'Molarite çözücünün değil çözeltinin hacmine bölünür. Katıyı eklemek hacmi değiştirir.',
      ),
      kart(
        'ppm',
        'Milyonda bir kısım. Çok seyreltik derişimlerde kullanılır: içme suyundaki kurşun sınırı ppm ile verilir.',
      ),
      kart(
        'Seyreltme',
        'Su eklemek mol sayısını değiştirmez, yalnızca hacmi büyütür. Bu yüzden derişim küçülür.',
      ),
    ]),
    konu('kim10-koligatif', 'Koligatif Özellikler', [
      kart(
        'Neye bağlı?',
        'Çözünenin cinsine değil, çözeltideki tanecik sayısına bağlı özelliklerdir.',
      ),
      kart(
        'Kaynama noktası yükselmesi',
        'Çözünen eklenince çözeltinin kaynama sıcaklığı saf çözücününkinden yüksek olur.',
      ),
      kart(
        'Donma noktası düşmesi',
        'Çözelti saf çözücüden daha düşük sıcaklıkta donar. Kışın yollara tuz atılmasının sebebi budur.',
      ),
      kart(
        'İyonik çözünen daha etkili',
        'NaCl suda iki iyona ayrıldığı için aynı moldeki şekerin iki katı etki yapar.',
      ),
    ]),
  ]),
  tema('kim10-t3', 'Sürdürülebilirlik', [
    konu('kim10-mikro', 'Makro ve Mikro Ölçekli Deneyler', [
      kart(
        'Fark nedir?',
        'Mikro ölçekli deney aynı sonucu çok daha az madde ve küçük düzenekle verir.',
      ),
      kart(
        'Üç kazanç',
        'Daha az atık, daha az maliyet, daha az risk. Az miktarda kimyasal daha az zarar verir.',
      ),
      kart(
        'Atom ekonomisi',
        'Girenlerdeki atomların ne kadarının ürüne geçtiğinin ölçüsü. Yüksek atom ekonomisi az atık demektir.',
      ),
      kart(
        'Sınırı',
        'Her deney küçültülemez: bazı ölçümler görünür miktarda madde ister. Ölçek, doğruluğu bozmadan küçültülür.',
      ),
    ]),
    konu('kim10-atmosfer', 'Atmosferdeki Tepkimeler ve Küresel Sorunlar', [
      kart(
        'Sera etkisi',
        'Karbondioksit ve metan gibi sera gazları yerden yayılan ısıyı tutar. Doğal hâli yaşamı mümkün kılar.',
      ),
      kart(
        'Küresel ısınma',
        'Fosil yakıtların yakılması sera gazı derişimini artırdı; tutulan ısı arttıkça ortalama sıcaklık yükseliyor.',
      ),
      kart(
        'Asit yağmurları',
        'Kükürt ve azot oksitleri suyla birleşip asit oluşturur. Toprağı, ormanı ve yapıları aşındırır.',
      ),
      kart(
        'Ozon azalımı',
        'Ozon tabakası morötesi ışınları süzer. Kloroflorokarbonlar ozonu parçaladığı için üretimleri kısıtlandı.',
      ),
      kart(
        'Ayak izleri',
        'Karbon, su ve emisyon ayak izi bir etkinliğin doğaya bindirdiği yükü ölçer; azaltmanın ilk adımı ölçmektir.',
      ),
    ]),
  ]),
])
