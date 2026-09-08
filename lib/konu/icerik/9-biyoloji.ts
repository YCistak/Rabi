import { kart, konu, program, soru, tema } from '../tip'

/**
 * 9. sınıf Biyoloji — Maarif Modeli.
 *
 * İki tema: **Yaşam** ve **Organizasyon**. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski programdaki "canlıların sınıflandırılması" ayrı bir ünite değil,
 * Organizasyon temasının ikinci bölümü. Kalıtım 9. sınıfta **yok**.
 */
export const biyoloji9 = program('biyoloji', 9, 'Yaşamdan hücreye', [
  tema('byl9-t1', 'Yaşam', [
    konu('byl9-onem', 'Biyolojinin Önemi', [
      kart(
        'Biyoloji neyi inceler?',
        'Canlıları ve yaşam olaylarını inceler: moleküllerden ekosistemlere kadar her ölçekte.',
      ),
      kart(
        'Organizasyon düzeyleri',
        'Yaşam iç içe basamaklardan kurulur ve her basamakta bir öncekinde olmayan yeni özellikler ortaya çıkar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Molekül' },
            { ad: 'Hücre' },
            { ad: 'Doku ve organ' },
            { ad: 'Organizma' },
            { ad: 'Ekosistem' },
          ],
        },
      ),
      kart(
        'Sağlığa katkısı',
        'Aşı, antibiyotik ve organ nakli biyolojik bilginin doğrudan sonucu. Ortalama ömür bir yüzyılda ikiye katlandı.',
      ),
      kart(
        'Tarıma katkısı',
        'Verimli tohum ve hastalığa dayanıklı çeşitler biyoloji sayesinde geliştirildi.',
      ),
      kart(
        'Biyoteknoloji',
        'Canlıları ya da parçalarını üretimde kullanmak: insülinin bakteriye ürettirilmesi bunun en bilinen örneği.',
      ),
      kart(
        'Çevreye bakışı değiştirdi',
        'Ekosistem kavramı, bir türün kaybının bütün ağı etkilediğini gösterdi. Koruma politikaları bu bilgiden doğdu.',
      ),
    ], [
      soru('Biyolojinin incelediği organizasyon düzeyleri küçükten büyüğe hücre, doku, organ, sistem diye sıralanır.', true, 'Her düzey bir öncekinden kuruluyor.'),
      soru('Biyoteknoloji, canlıların ya da onlara ait parçaların ürün elde etmek için kullanılmasıdır.', true, 'Yoğurt mayasından insülin üretimine kadar geniş bir alan.'),
      soru('Biyoloji yalnızca hayvanları inceleyen bilim dalıdır.', false, 'Bitkiler, mantarlar, bakteriler ve virüsler de biyolojinin konusu.'),
      soru('Tarımdaki verim artışının biyolojiyle bir ilgisi yoktur.', false, 'Tohum ıslahı, gübreleme ve hastalıkla mücadelenin tamamı biyoloji bilgisine dayanıyor.'),
    ]),
    konu('byl9-donum', 'Biyoloji Biliminin Gelişimindeki Dönüm Noktaları', [
      kart(
        'Mikroskobun icadı',
        'Hooke mantar kesitinde odacıklar gördü ve onlara hücre dedi; Leeuwenhoek ilk mikroorganizmaları gözledi.',
      ),
      kart(
        'Hücre teorisi',
        'Bütün canlılar hücrelerden oluşur, hücre yaşamın en küçük birimidir ve her hücre başka bir hücreden gelir.',
      ),
      kart(
        'Evrim kuramı',
        'Darwin, doğal seçilimle türlerin zaman içinde değiştiğini gösterdi. Biyolojiyi tek çatı altında topladı.',
      ),
      kart(
        'Mendel ve kalıtım',
        'Bezelyelerle yaptığı çaprazlamalarda kalıtımın belirli oranlarla işlediğini gösterdi; genetik böyle doğdu.',
      ),
      kart(
        'DNA’nın yapısı',
        'Watson, Crick ve Franklin’in çalışmalarıyla 1953’te çift sarmal çözüldü; moleküler biyoloji böyle başladı.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: '1665 · Hücre', alt: 'Hooke' },
            { ad: '1859 · Evrim', alt: 'Darwin' },
            { ad: '1866 · Kalıtım', alt: 'Mendel' },
            { ad: '1953 · DNA', alt: 'çift sarmal' },
            { ad: '2003 · Genom', alt: 'insan genomu' },
          ],
        },
      ),
      kart(
        'Antibiyotiğin bulunuşu',
        'Fleming’in küf mantarında gözlediği bir kaza, bakteriyel enfeksiyonların öldürücü olmaktan çıkmasını sağladı.',
      ),
      kart(
        'Genom projeleri',
        'İnsan genomunun okunması hastalık genlerinin bulunmasını ve kişiye özgü tedaviyi mümkün kıldı.',
      ),
    ], [
      soru('Hücre teorisi, bütün canlıların hücrelerden oluştuğunu söyler.', true, 'Ayrıca her hücrenin kendinden önceki bir hücreden oluştuğunu da belirtir.'),
      soru('DNA nın çift sarmal yapısını Mendel açıklamıştır.', false, 'Yapıyı Watson ve Crick açıkladı; Mendel kalıtımın kurallarını buldu.'),
      soru('Mikroskobun icadı hücrenin görülmesini ve incelenmesini sağladı.', true, 'Hücre kavramı ancak mikroskopla ortaya çıkabildi.'),
      soru('Antibiyotikler virüslere karşı geliştirilmiş ilaçlardır.', false, 'Antibiyotikler bakterilere etki eder; virüslere karşı etkisizdir.'),
    ]),
    konu('byl9-bilimin-dogasi', 'Bilimin Doğası', [
      kart(
        'Bilimsel bilgi değişebilir',
        'Yeni kanıt geldiğinde bilgi güncellenir. Bu bir zayıflık değil, bilimin kendini düzeltme yeteneğidir.',
      ),
      kart(
        'Kanıta dayanır',
        'İddia gözlem ve deneyle desteklenmelidir. Otoriteye dayanan bir açıklama bilimsel sayılmaz.',
      ),
      kart(
        'Teori ve hipotez',
        'Hipotez sınanmayı bekleyen açıklama; teori ise defalarca sınanmış, geniş kapsamlı bir açıklama sistemidir.',
      ),
      kart(
        'Yasa ile teori farkı',
        'Yasa neyin olduğunu tarif eder, teori nedenini açıklar. Teori "kanıtlanmamış yasa" değildir.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne yapar?'],
          satirlar: [
            ['Hipotez', 'Sınanmayı bekler'],
            ['Yasa', 'Ne olduğunu söyler'],
            ['Teori', 'Nedenini açıklar'],
          ],
        },
      ),
      kart(
        'Yanlışlanabilirlik',
        'Bilimsel bir iddia, yanlış olduğunu gösterebilecek bir gözleme açık olmalıdır. Hiçbir şeyle çürütülemeyen iddia bilim dışıdır.',
      ),
      kart(
        'Hakem değerlendirmesi',
        'Bir çalışma yayımlanmadan önce alandaki başka araştırmacılarca denetlenir. Bu, hatanın ilk süzgecidir.',
      ),
    ], [
      soru('Bilimsel bilgi, yeni kanıtlar karşısında değişebilir.', true, 'Değişebilir olması zayıflığı değil, kanıta bağlı olmasının sonucu.'),
      soru('Bilimsel bir hipotezin yanlışlanabilir olması gerekir.', true, 'Hiçbir gözlemin çürütemeyeceği bir iddia bilimsel olarak sınanamaz.'),
      soru('Bir teori, yeterince kanıt toplayınca yasaya dönüşür.', false, 'Yasa neyin olduğunu tanımlar, teori niçin olduğunu açıklar; ikisi ayrı işler.'),
      soru('Hakem değerlendirmesinden geçmemiş bir iddia da bilimsel bilgi sayılır.', false, 'Yayımlanmadan önce alanın uzmanlarınca denetlenmesi sürecin parçası.'),
    ]),
    konu('byl9-arastirma', 'Bilimsel Araştırma Süreçleri', [
      kart(
        'Adımlar',
        'Gözlem, soru, hipotez, deney, veri toplama, analiz ve sonuç. Sonuç yeni bir soruya kapı açar.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Gözlem' },
            { ad: 'Hipotez' },
            { ad: 'Deney' },
            { ad: 'Sonuç' },
          ],
        },
      ),
      kart(
        'Değişkenler',
        'Bağımsız değişken araştırmacının değiştirdiği, bağımlı değişken ölçülen, kontrol değişkenleri sabit tutulanlardır.',
      ),
      kart(
        'Kontrol grubu',
        'Denenen etkiyi almayan grup. Onsuz gözlenen değişimin sebebi bilinemez.',
      ),
      kart(
        'Plasebo',
        'Etkisiz bir uygulama alan grup. İnsanlarda beklentinin kendisi sonucu değiştirdiği için gereklidir.',
      ),
      kart(
        'Örneklem',
        'Az sayıda ya da taraflı seçilmiş denek, doğru yapılmış bir deneyi bile yanlış sonuca götürür.',
      ),
      kart(
        'Tekrarlanabilirlik',
        'Aynı koşullarda başkalarının da aynı sonucu alabilmesi gerekir. Tekrarlanamayan sonuç kabul edilmez.',
      ),
    ], [
      soru('Kontrol grubu, deney grubuyla karşılaştırma yapabilmek için kullanılır.', true, 'Değişkenin etkisi ancak bu karşılaştırmayla görülüyor.'),
      soru('Bir deneyde birden çok bağımsız değişken aynı anda değiştirilirse sonucun sebebi anlaşılmaz.', true, 'Hangi değişikliğin sonuca yol açtığı ayırt edilemez.'),
      soru('Plasebo, deneklere verilen etkin maddedir.', false, 'Plasebo etkisiz bir madde; beklentinin etkisini ayırmak için veriliyor.'),
      soru('Örneklem küçüldükçe sonuçların güvenilirliği artar.', false, 'Küçük örneklem rastlantıya daha açık; güvenilirlik örneklem büyüdükçe artar.'),
    ]),
    konu('byl9-etik', 'Bilim Etiği', [
      kart(
        'Veri uydurmak',
        'Sonuç uydurmak ya da beğenilmeyen veriyi gizlemek en ağır ihlaldir; yayın geri çekilir.',
      ),
      kart(
        'Aşırma',
        'Başkasının çalışmasını kaynak göstermeden kullanmak. Alıntı yapmak serbest, sahiplenmek değil.',
      ),
      kart(
        'Aydınlatılmış onam',
        'İnsan üzerinde çalışma yapılacaksa kişi riskleri bilerek ve gönüllü olarak kabul etmelidir.',
      ),
      kart(
        'Hayvan deneyleri',
        'Etik kurul onayı gerekir; sayı en aza indirilir, acı azaltılır, mümkünse alternatif yöntem seçilir.',
      ),
      kart(
        'Çıkar çatışması',
        'Araştırmayı finanse eden kuruluşun sonuçtan çıkarı varsa bu açıkça bildirilmelidir.',
      ),
      kart(
        'Kişisel verinin gizliliği',
        'Genetik veri kişiye ve ailesine aittir; kimliği açık edecek biçimde paylaşılamaz.',
      ),
    ], [
      soru('Beklenen sonuca uymayan verileri çıkarmak bilim etiğine aykırıdır.', true, 'Veriyi seçmek, sonucu önceden yazmak demek.'),
      soru('Başkasının çalışmasını kaynak göstermeden kullanmak aşırmadır.', true, 'Fikir de bir emek; sahibi belirtilmek zorunda.'),
      soru('İnsan üzerinde yapılan araştırmalarda kişinin onayı alınmayabilir.', false, 'Aydınlatılmış onam şart: kişi neye katıldığını bilerek kabul etmeli.'),
      soru('Araştırmayı destekleyen kuruluşun belirtilmesine gerek yoktur.', false, 'Çıkar çatışması açıklanmalı; sonucu okuyanın bunu bilmeye hakkı var.'),
    ]),
    konu('byl9-ortak-ozellik', 'Canlıların Ortak Özellikleri', [
      kart(
        'Hücresel yapı',
        'Bütün canlılar hücrelerden oluşur. Virüsler hücresel yapıya sahip olmadığı için tartışmalıdır.',
      ),
      kart(
        'Beslenme ve enerji',
        'Ototroflar besinini kendi üretir, heterotroflar dışarıdan alır. Her canlı enerji üretir ve tüketir.',
      ),
      kart(
        'Metabolizma',
        'Yapım (anabolizma) ve yıkım (katabolizma) tepkimelerinin tamamı. Yaşam bu iki yönün dengesidir.',
      ),
      kart(
        'Homeostazi',
        'İç ortamı dengede tutma. Vücut sıcaklığının ve kan şekerinin sabit tutulması buna örnektir.',
      ),
      kart(
        'Uyarılara tepki',
        'Canlılar çevredeki değişimi algılar ve karşılık verir. Bitkinin ışığa yönelmesi de bir tepkidir.',
      ),
      kart(
        'Boşaltım ve solunum',
        'Metabolizmanın artıkları dışarı atılır; solunumla besindeki enerji kullanılabilir hâle getirilir.',
      ),
      kart(
        'Üreme, büyüme, uyum',
        'Canlılar çoğalır, gelişir; varyasyon ve adaptasyon sayesinde türler değişen koşullara uyum sağlar.',
      ),
      kart(
        'Virüs canlı mı?',
        'Kalıtım maddesi var ve çoğalabiliyor ama hücresi yok ve konak dışında hiçbir yaşam belirtisi göstermiyor.',
      ),
    ], [
      soru('Bütün canlılar hücresel yapıya sahiptir.', true, 'Hücre, canlılığın en küçük yapı ve işlev birimi.'),
      soru('Virüsler hücresel yapıya sahip olduğu için canlı kabul edilir.', false, 'Hücresel yapıları yok; ancak canlı bir hücrenin içinde çoğalabiliyorlar.'),
      soru('Homeostazi, canlının değişen koşullara rağmen iç dengesini korumasıdır.', true, 'Vücut sıcaklığının sabit tutulması buna örnek.'),
      soru('Metabolizma yalnızca yapım tepkimelerini kapsar.', false, 'Yapım (anabolizma) ve yıkım (katabolizma) tepkimelerinin tamamı.'),
    ]),
    konu('byl9-inorganik', 'İnorganik Moleküller', [
      kart(
        'Su neden vazgeçilmez?',
        'Polar yapısı sayesinde iyi çözücüdür; tepkimeler suda gerçekleşir ve maddeler suyla taşınır.',
      ),
      kart(
        'Adezyon ve kohezyon',
        'Kohezyon su moleküllerini birbirine, adezyon başka yüzeye bağlar. Bitkilerde su bu sayede yükselir.',
      ),
      kart(
        'Suyun ısı dengeleyiciliği',
        'Öz ısısı yüksek olduğu için geç ısınır geç soğur; vücut ve göl sıcaklığı ani değişmez.',
      ),
      kart(
        'Mineraller',
        'Yapıya katılır ve tepkimeleri düzenler; eksikliği belirli hastalıklarla kendini gösterir.',
        {
          tur: 'tablo',
          basliklar: ['Mineral', 'Görevi'],
          satirlar: [
            ['Kalsiyum', 'Kemik ve kas'],
            ['Demir', 'Hemoglobin'],
            ['İyot', 'Tiroit hormonu'],
            ['Magnezyum', 'Klorofil, enzim'],
          ],
        },
      ),
      kart(
        'Asit, baz ve pH',
        'pH 7 nötr, altı asidik, üstü baziktir. Enzimler yalnızca dar bir pH aralığında çalışır.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 14],
          isaretler: [0, 7, 14],
          parcalar: [
            { bas: 0, bit: 7, kapaliBas: true, ad: 'asidik' },
            { bas: 7, bit: 14, kapaliBit: true, ad: 'bazik', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Tampon sistemler',
        'Kan pH’ı 7,4 dolayında dar bir aralıkta tutulur; küçük bir sapma bile enzimleri durdurabilir.',
      ),
      kart(
        'Asitler ve bazlar',
        'Asitler ortama H⁺ verir, bazlar OH⁻ verir ya da H⁺ bağlar. Mide asidik, safra baziktir.',
      ),
    ], [
      soru(
        'pH değeri 7 den büyük olan çözeltiler asit özelliği gösterir.',
        false,
        '7 den büyük değerler bazik bölgede; asitler 7 nin altında kalıyor.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 14],
          isaretler: [0, 7, 14],
          parcalar: [
            { bas: 0, bit: 7, ad: 'asit' },
            { bas: 7, bit: 14, ad: 'baz', renk: 'ikincil' },
          ],
        },
      ),
      soru('Suyun öz ısısının yüksek olması, canlıdaki sıcaklık dalgalanmalarını azaltır.', true, 'Su geç ısınıp geç soğuduğu için vücut sıcaklığı ani değişmiyor.'),
      soru('Mineraller vücutta enerji vermek için kullanılır.', false, 'Mineraller enerji vermez; yapıya katılır ve düzenleyici görev yapar.'),
      soru('Tampon sistemler kanın pH ını dar bir aralıkta tutar.', true, 'Küçük bir pH değişimi bile enzimleri işlevsiz bırakabilirdi.'),
    ]),
    konu('byl9-organik', 'Organik Moleküller', [
      kart(
        'Dört temel grup',
        'Canlıdaki büyük moleküller dört sınıfta toplanır ve her biri kendi küçük biriminden kurulur.',
        {
          tur: 'tablo',
          basliklar: ['Molekül', 'Yapı taşı'],
          satirlar: [
            ['Karbonhidrat', 'Monosakkarit'],
            ['Lipit', 'Yağ asidi'],
            ['Protein', 'Amino asit'],
            ['Nükleik asit', 'Nükleotit'],
          ],
        },
      ),
      kart(
        'Karbonhidratlar',
        'Hızlı enerji kaynağı. Monosakkarit (glikoz), disakkarit (sükroz) ve polisakkarit (nişasta, glikojen, selüloz) olarak gruplanır.',
      ),
      kart(
        'Lipitler',
        'Yoğun enerji deposu, hücre zarının yapı taşı ve bazı hormonların kaynağı. Suda çözünmezler.',
      ),
      kart(
        'Proteinler',
        'Amino asitlerden kurulur. Yapı, taşıma, savunma ve enzim görevleri vardır; sırası işlevi belirler.',
      ),
      kart(
        'Enzimler',
        'Tepkimeleri hızlandıran protein yapılı katalizörler. Aktivasyon enerjisini düşürür, kendileri tükenmez.',
      ),
      kart(
        'Enzim-substrat uyumu',
        'Enzim yalnızca kendi substratına uyar; anahtar-kilit benzetmesi bu seçiciliği anlatır.',
      ),
      kart(
        'Enzimi etkileyen etmenler',
        'Sıcaklık ve pH belirli bir değere kadar hızı artırır, o noktadan sonra proteini bozar ve hız düşer.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'sıcaklık',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0.3, 0.3],
                [1.5, 1.5],
                [3, 5],
                [4, 3],
                [5, 0.4],
              ],
            },
          ],
        },
      ),
      kart(
        'Nükleik asitler ve vitaminler',
        'DNA kalıtım bilgisini taşır, RNA onu kullanır. Vitaminler enerji vermez ama tepkimelerin düzenleyicisidir.',
      ),
      kart(
        'Dehidrasyon ve hidroliz',
        'Büyük moleküller su çıkararak birleşir (dehidrasyon), su eklenerek parçalanır (hidroliz).',
      ),
    ], [
      soru('Enzimler tepkimeyi hızlandırır ve tepkime sonunda değişmeden çıkar.', true, 'Bu yüzden aynı enzim defalarca kullanılabiliyor.'),
      soru('Her enzim her substratla çalışabilir.', false, 'Enzim substratına özgü; aralarında anahtar-kilit uyumu var.'),
      soru('Yüksek sıcaklıkta enzimin yapısı bozulur ve işlevini yitirir.', true, 'Protein yapısı bozulunca aktif bölge de bozuluyor.'),
      soru('Proteinlerin yapı birimi yağ asitleridir.', false, 'Proteinlerin yapı birimi amino asit; yağ asidi lipitlerin.'),
    ]),
  ]),
  tema('byl9-t2', 'Organizasyon', [
    konu('byl9-hucre-tur', 'Prokaryot ve Ökaryot Hücre', [
      kart(
        'Temel fark',
        'Prokaryotta zarla çevrili çekirdek ve organel yoktur; ökaryotta ikisi de vardır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Prokaryot', 'Ökaryot'],
          satirlar: [
            ['Çekirdek', 'Yok', 'Var'],
            ['Organel', 'Zarsız', 'Zarlı'],
            ['Boyut', 'Küçük', 'Büyük'],
            ['DNA', 'Halkasal', 'Doğrusal'],
          ],
        },
      ),
      kart(
        'Prokaryotlar',
        'Bakteri ve arkeler. DNA sitoplazmada serbest durur, ribozomları daha küçüktür.',
      ),
      kart(
        'Ökaryotlar',
        'Protist, mantar, bitki ve hayvanlar. Hücreleri daha büyük ve bölmelidir.',
      ),
      kart(
        'Neden bölmeli?',
        'Zarla ayrılmış bölmeler farklı tepkimelerin birbirine karışmadan aynı anda yürümesini sağlar.',
      ),
      kart(
        'Bitki ve hayvan hücresi',
        'Bitki hücresinde duvar, kloroplast ve büyük koful bulunur; hayvan hücresinde sentrozom vardır.',
      ),
      kart(
        'Ortak yanları',
        'İkisinde de hücre zarı, sitoplazma, ribozom ve DNA bulunur. Bunlar yaşamın asgari donanımıdır.',
      ),
    ], [
      soru(
        'Prokaryot hücrelerde DNA çekirdek zarıyla çevrilidir.',
        false,
        'Prokaryotta çekirdek zarı yok; DNA doğrudan sitoplazmada bulunuyor.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Prokaryot', 'Ökaryot'],
          satirlar: [
            ['Çekirdek zarı', 'Yok', 'Var'],
            ['Zarlı organel', 'Yok', 'Var'],
            ['DNA nın yeri', 'Sitoplazma', 'Çekirdek'],
          ],
        },
      ),
      soru('Bitki hücresinde hücre duvarı ve kloroplast bulunur.', true, 'İkisi de hayvan hücresinde yok.'),
      soru('Bakteriler ökaryot hücre yapısına sahiptir.', false, 'Bakteriler prokaryot; çekirdek zarları ve zarlı organelleri yok.'),
      soru('Ribozom hem prokaryot hem ökaryot hücrede bulunur.', true, 'Protein sentezi bütün canlılarda ortak.'),
    ]),
    konu('byl9-zar', 'Hücre Zarı', [
      kart(
        'Yapısı',
        'Çift katlı fosfolipit tabakası; içine gömülü proteinler, kolesterol ve karbonhidrat zincirleri bulunur.',
      ),
      kart(
        'Neden çift katlı?',
        'Fosfolipitin bir ucu suyu sever, öteki ucu sevmez. Suda kendiliğinden su sevmez uçlar içeride kalacak biçimde dizilirler.',
      ),
      kart(
        'Akıcı mozaik model',
        'Zar sabit bir duvar değil; proteinler lipit denizinde yüzer. Bu yüzden esnek ve onarılabilirdir.',
      ),
      kart(
        'Zar proteinleri',
        'Kimi taşıyıcı, kimi kanal, kimi alıcıdır. Hücrenin dış dünyayla konuşması bu proteinlerle olur.',
      ),
      kart(
        'Seçici geçirgenlik',
        'Zar neyin gireceğine karar verir. Küçük ve yağda çözünenler kolay geçer, büyük ve yüklüler taşıyıcı ister.',
      ),
      kart(
        'Hücre duvarı ile karışmasın',
        'Duvar bitki, mantar ve bakterilerde zarın dışındadır; cansızdır ve tam geçirgendir.',
      ),
    ], [
      soru('Hücre zarı seçici geçirgendir.', true, 'Hangi maddenin geçeceğine zarın yapısı karar veriyor.'),
      soru('Akıcı mozaik modele göre zardaki proteinler yerlerinde sabit durur.', false, 'Proteinler yağ tabakasının içinde hareket edebiliyor; modelin adındaki "akıcı" bunu anlatıyor.'),
      soru('Hücre zarı çift katlı fosfolipit tabakasından oluşur.', true, 'Su sevmeyen kuyruklar içe, su seven başlar dışa bakıyor.'),
      soru('Hücre duvarı bütün canlı hücrelerde bulunur.', false, 'Hayvan hücresinde yok; bitki, mantar ve bakterilerde var.'),
    ]),
    konu('byl9-sitoplazma', 'Sitoplazma', [
      kart(
        'Ne içerir?',
        'Zar ile çekirdek arasını dolduran sıvı (sitozol) ve içindeki organeller ile sitoplazmik yapılar.',
      ),
      kart(
        'Görevi',
        'Tepkimelerin çoğu burada gerçekleşir; organelleri taşır ve maddelerin dağılmasını sağlar.',
      ),
      kart(
        'İçeriği',
        'Büyük kısmı su; ayrıca protein, tuz, enzim ve besin molekülleri bulunur.',
      ),
      kart(
        'Neden çoğu su?',
        'Tepkimeler çözelti içinde yürür. Susuz bir sitoplazmada moleküller birbirini bulamaz.',
      ),
      kart(
        'Sitoplazma hareketi',
        'Bitki hücrelerinde sitoplazmanın dolaşması maddelerin hücre içinde dağılmasını hızlandırır.',
      ),
    ], [
      soru('Sitoplazmanın büyük bölümü sudur.', true, 'Tepkimelerin geçtiği ortamın çözücüsü su.'),
      soru('Hücredeki tepkimelerin çoğu sitoplazmada gerçekleşir.', true, 'Organeller de bu ortamın içinde duruyor.'),
      soru('Sitoplazma, organelleri taşıyan cansız bir sıvıdır.', false, 'Canlı bir ortam: tepkimeler orada yürüyor ve kendisi de hareket ediyor.'),
      soru('Sitoplazma hareketi yalnızca hayvan hücrelerinde görülür.', false, 'Bitki hücrelerinde de görülür; madde dağılımını kolaylaştırıyor.'),
    ]),
    konu('byl9-sitoplazmik', 'Sitoplazmik Yapılar', [
      kart(
        'Zarsız yapılar',
        'Ribozom, sentrozom ve sitoiskelet zarla çevrili değildir; bu yüzden organel sayılmayabilirler.',
      ),
      kart(
        'Ribozom',
        'Protein sentezi yapar. Hem prokaryot hem ökaryot hücrede bulunan tek ortak yapıdır.',
      ),
      kart(
        'Sitoiskelet',
        'Protein iplikleri hücreye şekil verir, organelleri yerinde tutar ve hareketi sağlar.',
      ),
      kart(
        'Sentrozom',
        'Hayvan hücrelerinde bölünme sırasında iğ ipliklerini oluşturur. Bitki hücrelerinde bulunmaz.',
      ),
      kart(
        'Sil ve kamçı',
        'Hücrenin hareketini sağlayan uzantılar. Solunum yolundaki siller tozu dışarı süpürür.',
      ),
    ], [
      soru('Ribozom zarsız bir yapıdır ve protein sentezler.', true, 'Zarsız olduğu için prokaryotlarda da bulunabiliyor.'),
      soru('Sentrozom bitki hücrelerinin temel yapılarındandır.', false, 'Sentrozom hayvan hücrelerinde bulunur ve bölünmede rol alır.'),
      soru('Sitoiskelet hücreye şekil verir ve organelleri yerinde tutar.', true, 'Ayrıca hücre içi taşımaya da yol oluyor.'),
      soru('Sil ve kamçının hücrenin hareketiyle ilgisi yoktur.', false, 'İkisi de hücrenin ya da çevresindeki sıvının hareketini sağlıyor.'),
    ]),
    konu('byl9-organel', 'Organeller ve Çekirdek', [
      kart(
        'Çekirdek',
        'DNA’yı taşır ve hücreyi yönetir. Çekirdekçikte ribozom parçaları üretilir.',
      ),
      kart(
        'Mitokondri',
        'Hücresel solunumla ATP üretir. Kendi DNA’sı vardır ve çoğalabilir.',
      ),
      kart(
        'Kloroplast',
        'Bitki hücrelerinde fotosentez yapar. Klorofil pigmenti ışığı yakalar.',
      ),
      kart(
        'Endoplazmik retikulum',
        'Granüllü ER protein, granülsüz ER lipit üretir ve maddeleri taşır.',
      ),
      kart(
        'Golgi ve lizozom',
        'Golgi gelen maddeleri paketleyip gönderir; lizozom sindirim enzimleriyle onları parçalar.',
      ),
      kart(
        'Salgı yolu',
        'Üretilen bir protein hücreyi hep aynı sırayla terk eder.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ribozom' },
            { ad: 'ER' },
            { ad: 'Golgi' },
            { ad: 'Zar' },
          ],
        },
      ),
      kart(
        'Koful',
        'Depolama ve boşaltım yapar. Bitki hücresinde tek ve büyüktür, hücreye diklik verir.',
      ),
      kart(
        'Neden ayrı organeller?',
        'Her organel bir işe ayrılmıştır. Bölmeleme, hücrenin aynı anda hem üretip hem parçalamasını mümkün kılar.',
      ),
    ], [
      soru('Mitokondri hücrede enerji üretiminden sorumludur.', true, 'Besinlerdeki enerji burada ATP ye çevriliyor.'),
      soru('Kloroplast hem bitki hem hayvan hücrelerinde bulunur.', false, 'Yalnızca fotosentez yapan hücrelerde var.'),
      soru('Lizozom hücre içi sindirimi sağlar.', true, 'İçindeki sindirim enzimleri büyük molekülleri parçalıyor.'),
      soru('Golgi aygıtı proteinleri üretir.', false, 'Üretimi ribozom yapar; Golgi gelen proteini işleyip paketler.'),
    ]),
    konu('byl9-madde-gecis', 'Hücre Zarından Madde Geçişleri', [
      kart(
        'Pasif ve aktif',
        'Ayrım tek bir soruda: geçiş için ATP harcanıyor mu, harcanmıyor mu.',
        {
          tur: 'tablo',
          basliklar: ['Geçiş', 'Enerji', 'Yön'],
          satirlar: [
            ['Difüzyon', 'Yok', 'Çoktan aza'],
            ['Ozmoz', 'Yok', 'Çoktan aza'],
            ['Aktif taşıma', 'Var', 'Azdan çoğa'],
          ],
        },
      ),
      kart(
        'Basit difüzyon',
        'Küçük ve yüksüz moleküller (O₂, CO₂) doğrudan zardan geçer.',
      ),
      kart(
        'Kolaylaştırılmış difüzyon',
        'Glikoz gibi büyük moleküller taşıyıcı proteinle geçer; yine enerji harcanmaz.',
      ),
      kart(
        'Ozmoz',
        'Suyun az yoğun ortamdan çok yoğun ortama geçmesi. Bitkinin diklik kaybı bu dengeyle ilgilidir.',
      ),
      kart(
        'Hücre ve ortam',
        'Ortam derişik ise hücre su kaybedip büzülür (plazmoliz), ortam seyreltik ise su alıp şişer.',
      ),
      kart(
        'Aktif taşıma',
        'Az olduğu yerden çok olduğu yere taşıma. ATP harcanır; sodyum-potasyum pompası örnektir.',
      ),
      kart(
        'Endositoz ve ekzositoz',
        'Çok büyük maddeler zarla kese hâlinde alınır (endositoz) ya da dışarı verilir (ekzositoz).',
      ),
    ], [
      soru('Difüzyon, maddenin çok yoğun ortamdan az yoğun ortama geçmesidir.', true, 'Yoğunluk farkı yönü belirliyor ve enerji harcanmıyor.'),
      soru('Aktif taşımada enerji harcanmaz.', false, 'Yoğunluk farkına ters yönde gidildiği için ATP harcanır.'),
      soru('Ozmoz, suyun az yoğun ortamdan çok yoğun ortama geçmesidir.', true, 'Geçen şey çözünen değil, çözücü olan su.'),
      soru('Büyük moleküller hücre zarından basit difüzyonla geçer.', false, 'Basit difüzyon küçük moleküller için; büyükler endositozla alınıyor.'),
    ]),
    konu('byl9-siniflandirma', 'Sınıflandırmada Temel Yaklaşımlar', [
      kart(
        'Neden sınıflandırılır?',
        'Milyonlarca türü düzenli incelemek için. Sınıflandırma aynı zamanda akrabalık ilişkisini gösterir.',
      ),
      kart(
        'Yapay ve doğal sınıflandırma',
        'Yapay sınıflandırma dış görünüşe bakar; doğal (modern) sınıflandırma köken ve akrabalığı esas alır.',
      ),
      kart(
        'Analog ve homolog',
        'Homolog organlar ortak kökenlidir (yarasa kanadı ile insan kolu); analog organlar yalnızca aynı işi görür.',
      ),
      kart(
        'İkili adlandırma',
        'Linne’nin yöntemi: cins adı büyük, tür adı küçük harfle yazılır ve ikisi eğik dizilir (Homo sapiens).',
      ),
      kart(
        'Kategoriler',
        'Âlemden türe doğru daralır ve daraldıkça ortak özellik artar, birey sayısı azalır.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Âlem' },
            { ad: 'Şube' },
            { ad: 'Sınıf' },
            { ad: 'Takım' },
            { ad: 'Aile' },
            { ad: 'Cins ve tür' },
          ],
        },
      ),
      kart(
        'Tür nedir?',
        'Doğada çiftleşip verimli döl verebilen bireyler topluluğu. Katır kısır olduğu için ayrı bir tür değildir.',
      ),
    ], [
      soru(
        'Sınıflandırma kategorilerinde en küçük birim âlemdir.',
        false,
        'Âlem en geniş kategori; en küçük ve en özel birim tür.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Âlem' },
            { ad: 'Şube' },
            { ad: 'Sınıf' },
            { ad: 'Cins' },
            { ad: 'Tür' },
          ],
        },
      ),
      soru('İkili adlandırmada önce cins adı, sonra tür adı yazılır.', true, 'Cins adının ilk harfi büyük, tür adı küçük harfle yazılıyor.'),
      soru('Analog organlar, canlıların ortak atadan geldiğini gösterir.', false, 'Akrabalığı homolog organlar gösterir; analog organlar yalnızca aynı işi yapar.'),
      soru('Tür, doğal koşullarda çiftleşip verimli döl verebilen bireyler topluluğudur.', true, 'Katır verimli olmadığı için at ve eşek ayrı türler.'),
    ]),
    konu('byl9-uc-alem', 'Üç Üst Âlem Sisteminde Canlılar', [
      kart(
        'Üç domain',
        'Bakteriler, Arkeler ve Ökaryotlar. Ayrım hücre yapısı ve genetik benzerliğe dayanır.',
      ),
      kart(
        'Bakteriler',
        'Prokaryot, tek hücreli. Bazıları hastalık yapar ama çoğu yararlıdır: sindirim, toprak, yoğurt.',
      ),
      kart(
        'Arkeler',
        'Prokaryot ama bakterilerden farklı. Çoğu aşırı ortamlarda yaşar: kaynar su, tuz gölü, asit.',
      ),
      kart(
        'Protistler',
        'Çoğunlukla tek hücreli ökaryotlar. Amip, öglena ve terliksi hayvan bu gruptadır.',
      ),
      kart(
        'Mantarlar',
        'Hazır beslenir ve dış sindirim yapar: enzimini dışarı salıp çözdüğünü emer. Hücre duvarı kitindir.',
      ),
      kart(
        'Bitkiler',
        'Fotosentezle kendi besinini üretir. Hücre duvarı selülozdur ve yerleşiktirler.',
      ),
      kart(
        'Hayvanlar',
        'Hazır beslenir, hareket eder ve çoğu sinir sistemine sahiptir. Hücre duvarları yoktur.',
      ),
    ], [
      soru('Arkeler aşırı sıcaklık ve tuzluluk gibi zor koşullarda yaşayabilir.', true, 'Kaplıca ve tuz göllerinde yaşayan türleri var.'),
      soru('Mantarlar fotosentez yaparak kendi besinini üretir.', false, 'Kloroplastları yok; hazır besini dışarıdan alıp emerler.'),
      soru('Bakteriler prokaryot canlılardır.', true, 'Çekirdek zarları ve zarlı organelleri bulunmuyor.'),
      soru('Protistler yalnızca tek hücreli canlılardan oluşur.', false, 'Çok hücreli su yosunları da bu grupta yer alıyor.'),
    ]),
    konu('byl9-biyocesitlilik', 'Biyoçeşitlilik', [
      kart(
        'Üç düzeyi',
        'Gen çeşitliliği, tür çeşitliliği ve ekosistem çeşitliliği. Üçü birlikte biyoçeşitliliği oluşturur.',
      ),
      kart(
        'Neden önemli?',
        'Çeşitlilik ekosistemi dayanıklı kılar. Tek çeşit üretim bir hastalıkla bütünüyle yok olabilir.',
      ),
      kart(
        'Gen çeşitliliği',
        'Aynı türün bireyleri arasındaki farklılık. Bir hastalığa direnç çoğu zaman bu farklılıkta saklıdır.',
      ),
      kart(
        'Endemik tür',
        'Yalnızca belirli bir bölgede yaşayan tür. Kaybedilirse dünyadan tümüyle silinir.',
      ),
      kart(
        'Türkiye’nin durumu',
        'Üç farklı bitki coğrafyasının kesiştiği yerde olduğu için tür sayısı Avrupa’nın tamamına yakındır.',
      ),
      kart(
        'Tehditler',
        'Habitat kaybı, aşırı avlanma, kirlilik, istilacı türler ve iklim değişikliği.',
      ),
      kart(
        'Koruma yolları',
        'Millî park ve koruma alanları, tohum bankaları, avlanma sınırları ve türlerin doğaya yeniden kazandırılması.',
      ),
    ], [
      soru('Endemik tür, yalnızca belirli bir bölgede doğal olarak yaşayan türdür.', true, 'Başka yerde bulunmadığı için yok olması geri dönülmez.'),
      soru('Biyoçeşitlilik gen, tür ve ekosistem düzeylerinde incelenir.', true, 'Aynı türün içindeki gen farkları da çeşitliliğin parçası.'),
      soru('Türkiye biyoçeşitlilik bakımından Avrupa nın en fakir ülkelerindendir.', false, 'Farklı iklim ve bitki bölgeleri sayesinde en zengin ülkelerinden biri.'),
      soru('Bir türün yok olması ekosistemin işleyişini etkilemez.', false, 'Besin ağındaki her tür başka türlere bağlı; kopan halka zinciri etkiliyor.'),
    ]),
  ]),
])
