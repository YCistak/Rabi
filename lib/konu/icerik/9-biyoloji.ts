import { kart, konu, program, sikli, soru, tema } from '../tip'

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
      sikli('Aşı ve antibiyotik biyolojinin hangi alana katkısıdır?', ['Tarım', 'Sağlık'], 1, 'Ortalama ömür bir yüzyılda ikiye katlandı.'),
      sikli('Bir türün kaybının bütün ağı etkilediğini gösteren kavram?', ['Biyoteknoloji', 'Ekosistem'], 1, 'Koruma politikaları bu bilgiden doğdu.'),
      soru('Biyoloji yalnızca hücre düzeyindeki olayları inceler.', false, 'Molekülden ekosisteme her ölçek.'),
    ], [
      {
        soru: 'İnsülinin bakteriye ürettirilmesi hangi alanın örneğidir?',
        siklar: ['Ekoloji', 'Biyoteknoloji'],
        dogru: 1,
        aciklama: {
          dogru: 'Canlıyı üretimde kullanmak biyoteknolojinin tanımı.',
          yanlis: 'Ekoloji canlı-çevre ilişkisini inceler. Bir bakteriye insan proteini ürettirmek biyoteknolojidir.',
        },
        kart: 5,
      },
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
      sikli('Mantar kesitinde odacıklar görüp "hücre" diyen kimdir?', ['Leeuwenhoek', 'Hooke'], 1, 'Leeuwenhoek ilk mikroorganizmaları gözledi.'),
      sikli('Bezelyelerle kalıtımın oranlarını gösteren kimdir?', ['Darwin', 'Mendel'], 1, 'Genetik böyle doğdu.'),
      sikli('DNA çift sarmalı hangi yılda çözüldü?', ['1859', '1953'], 1, 'Watson, Crick ve Franklin.'),
      soru('Antibiyotik planlı bir araştırmayla bulunmuştur.', false, 'Fleming\'in küf mantarında gözlediği bir kaza.'),
    ], [
      {
        soru: 'Hücre teorisine göre yeni bir hücre nereden gelir?',
        siklar: ['Var olan bir hücreden', 'Cansız maddeden kendiliğinden'],
        dogru: 0,
        aciklama: {
          dogru: 'Her hücre başka bir hücrenin bölünmesiyle oluşur; kendiliğinden oluşum yoktur.',
          yanlis: 'Kendiliğinden oluşum çürütülmüş eski bir görüş. Teorinin üçüncü maddesi: her hücre başka bir hücreden gelir.',
        },
        kart: 2,
      },
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
      sikli('Hiçbir gözlemle çürütülemeyen iddia için ne söylenir?', ['Kesin doğrudur', 'Bilim dışıdır'], 1, 'Yanlışlanabilirlik şart.'),
      sikli('Yasa ne yapar?', ['Nedenini açıklar', 'Neyin olduğunu tarif eder'], 1, 'Nedeni teori açıklar.'),
      soru('Hakem değerlendirmesi çalışma yayımlandıktan sonra yapılır.', false, 'Yayımlanmadan önce; hatanın ilk süzgeci.'),
    ], [
      {
        soru: 'Bilimde "teori" ne demektir?',
        siklar: ['Henüz kanıtlanmamış tahmin', 'Çok kez sınanmış geniş açıklama'],
        dogru: 1,
        aciklama: {
          dogru: 'Teori defalarca sınanmış açıklama sistemi; "sadece bir teori" deyişi bilimdeki anlamı taşımaz.',
          yanlis: 'Kanıtlanmamış tahmin hipotezdir. Teori ise onlarca sınamadan geçmiş, geniş kapsamlı bir açıklama.',
        },
        kart: 3,
      },
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
        'Örnek deney',
        '"Işık miktarı bitki boyunu etkiler mi?" Bağımsız değişken ışık, bağımlı değişken boy; su, toprak ve sıcaklık sabit tutulur.',
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
      sikli('Denenen etkiyi almayan gruba ne denir?', ['Deney grubu', 'Kontrol grubu'], 1, 'Onsuz değişimin sebebi bilinemez.'),
      sikli('Etkisiz uygulama alan grup neden gerekir?', ['Maliyeti düşürür', 'Beklenti sonucu değiştirir'], 1, 'Plasebo.'),
      sikli('"Işık bitki boyunu etkiler mi?" deneyinde bağımlı değişken?', ['Işık miktarı', 'Bitki boyu'], 1, 'Ölçülen sonuç.'),
      soru('Tekrarlanamayan sonuç bilimsel olarak kabul edilir.', false, 'Aynı koşullarda başkaları da alabilmeli.'),
    ], [
      {
        soru: 'Deneyde araştırmacının bilerek değiştirdiği değişken hangisidir?',
        siklar: ['Bağımlı değişken', 'Bağımsız değişken'],
        dogru: 1,
        aciklama: {
          dogru: 'Bağımsız değişken sebep, bağımlı değişken ölçülen sonuç.',
          yanlis: 'Bağımlı değişken ölçülen sonuçtur ve değiştirilene bağlı olarak değişir. Araştırmacının elindeki bağımsız değişken.',
        },
        kart: 2,
      },
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
      sikli('İnsan üzerinde çalışma için ne gerekir?', ['Aydınlatılmış onam', 'Yalnızca etik kurul'], 0, 'Kişi riskleri bilerek gönüllü kabul etmeli.'),
      sikli('Araştırmayı finanse edenin sonuçtan çıkarı varsa ne yapılmalı?', ['Açıkça bildirilmeli', 'Gizlenmeli'], 0, 'Çıkar çatışması.'),
      soru('Genetik veri kimliği açık edecek biçimde paylaşılabilir.', false, 'Kişiye ve ailesine aittir.'),
    ], [
      {
        soru: 'Başkasının çalışmasını kaynak göstermeden kullanmaya ne denir?',
        siklar: ['Çıkar çatışması', 'Aşırma'],
        dogru: 1,
        aciklama: {
          dogru: 'Alıntı yapmak serbest, sahiplenmek aşırma.',
          yanlis: 'Çıkar çatışması, sonuçtan maddi çıkarı olanın bunu bildirmemesi. Kaynak göstermeden kullanmak aşırmadır.',
        },
        kart: 2,
      },
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
      kart(
        'Organizasyon',
        'Her canlıda hücreden başlayan düzenli bir yapı vardır; çok hücrelilerde hücre → doku → organ → sistem → organizma sırası.',
      ),
    ], [
      soru('Bütün canlılar hücresel yapıya sahiptir.', true, 'Hücre, canlılığın en küçük yapı ve işlev birimi.'),
      soru('Virüsler hücresel yapıya sahip olduğu için canlı kabul edilir.', false, 'Hücresel yapıları yok; ancak canlı bir hücrenin içinde çoğalabiliyorlar.'),
      soru('Homeostazi, canlının değişen koşullara rağmen iç dengesini korumasıdır.', true, 'Vücut sıcaklığının sabit tutulması buna örnek.'),
      soru('Metabolizma yalnızca yapım tepkimelerini kapsar.', false, 'Yapım (anabolizma) ve yıkım (katabolizma) tepkimelerinin tamamı.'),
      sikli('Besinini kendi üreten canlıya ne denir?', ['Heterotrof', 'Ototrof'], 1, 'Heterotrof dışarıdan alır.'),
      sikli('Yapım tepkimelerine ne denir?', ['Katabolizma', 'Anabolizma'], 1, 'Katabolizma yıkım.'),
      sikli('Bitkinin ışığa yönelmesi hangi özelliktir?', ['Boşaltım', 'Uyarılara tepki'], 1, 'Çevredeki değişimi algılayıp karşılık verme.'),
      sikli('Virüsün canlılığı neden tartışmalıdır?', ['Kalıtım maddesi yok', 'Hücresi yok'], 1, 'Konak dışında yaşam belirtisi göstermez.'),
      soru('Çok hücrelide sıra hücre → doku → organ → sistem → organizmadır.', true, 'Organizasyon.'),
      soru('Solunum besindeki enerjiyi kullanılabilir hâle getirir.', true, 'ATP üretimi.'),
    ], [
      {
        soru: 'Vücut sıcaklığının sabit tutulması hangi ortak özelliktir?',
        siklar: ['Homeostazi', 'Metabolizma'],
        dogru: 0,
        aciklama: {
          dogru: 'İç ortamı dengede tutmak homeostazinin tanımı.',
          yanlis: 'Metabolizma yapım-yıkım tepkimelerinin tamamı. İç dengenin korunması ayrı bir özellik: homeostazi.',
        },
        kart: 4,
      },
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
      kart(
        'İnorganik mi organik mi?',
        'İnorganik moleküller canlı tarafından üretilmez, dışarıdan alınır: su, mineral, asit, baz, tuz. Enerji vermezler ve sindirilmezler.',
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
      sikli('pH 7\'nin altı nedir?', ['Asidik', 'Bazik'], 0, 'Üstü bazik.'),
      sikli('Bitkilerde suyun yükselmesini sağlayan?', ['Adezyon ve kohezyon', 'Tampon sistem'], 0, 'Kohezyon suyu suya, adezyon yüzeye bağlar.'),
      sikli('İnorganik moleküller için ne söylenir?', ['Canlı tarafından üretilmez', 'Enerji verir'], 0, 'Dışarıdan alınır, sindirilmez.'),
      sikli('Mide ortamı nasıldır?', ['Asidik', 'Bazik'], 0, 'Safra bazik.'),
      soru('Suyun öz ısısı düşüktür, bu yüzden hızla ısınır.', false, 'Yüksektir; geç ısınır geç soğur.'),
    ], [
      {
        soru: 'Kan pH\'ının dar aralıkta tutulmasını ne sağlar?',
        siklar: ['Mineraller', 'Tampon sistemler'],
        dogru: 1,
        aciklama: {
          dogru: 'Tampon, ortama gelen fazla H⁺ ya da OH⁻\'yi bağlayıp pH\'ı sabitler.',
          yanlis: 'Mineraller yapıya katılır ve tepkimeleri düzenler; pH\'ı dar aralıkta tutan tampon sistemler.',
        },
        kart: 6,
      },
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
        'Karbonhidrat depoları',
        'Bitki nişasta, hayvan glikojen depolar; selüloz bitki duvarıdır ve insan onu sindiremez. Üçü de glikoz zinciridir.',
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
      kart(
        'Enerji önceliği',
        'Enerji için önce karbonhidrat, sonra yağ, en son protein kullanılır. Yağ en çok enerji verir ama en yavaş yıkılır.',
      ),
    ], [
      soru('Enzimler tepkimeyi hızlandırır ve tepkime sonunda değişmeden çıkar.', true, 'Bu yüzden aynı enzim defalarca kullanılabiliyor.'),
      soru('Her enzim her substratla çalışabilir.', false, 'Enzim substratına özgü; aralarında anahtar-kilit uyumu var.'),
      soru('Yüksek sıcaklıkta enzimin yapısı bozulur ve işlevini yitirir.', true, 'Protein yapısı bozulunca aktif bölge de bozuluyor.'),
      soru('Proteinlerin yapı birimi yağ asitleridir.', false, 'Proteinlerin yapı birimi amino asit; yağ asidi lipitlerin.'),
      sikli('Bitkinin karbonhidrat deposu nedir?', ['Nişasta', 'Glikojen'], 0, 'Hayvan glikojen.'),
      sikli('İnsan hangi polisakkariti sindiremez?', ['Selüloz', 'Nişasta'], 0, 'Bitki duvarı.'),
      sikli('Proteinlerin yapı birimi?', ['Amino asit', 'Yağ asidi'], 0, 'Sırası işlevi belirler.'),
      sikli('Enzim-substrat seçiciliğini anlatan benzetme?', ['Anahtar-kilit', 'Merdiven'], 0, 'Enzim yalnızca kendi substratına uyar.'),
      sikli('Gram başına en çok enerji veren?', ['Karbonhidrat', 'Yağ'], 1, 'Ama en yavaş yıkılır.'),
      sikli('Büyük moleküllerin su çıkararak birleşmesi?', ['Hidroliz', 'Dehidrasyon'], 1, 'Hidroliz su ekleyerek parçalar.'),
      sikli('Vitaminler ne yapar?', ['Enerji verir', 'Tepkimeleri düzenler'], 1, 'Enerji vermez.'),
      soru('Lipitler suda çözünür.', false, 'Çözünmezler; hücre zarının yapı taşı.'),
    ], [
      {
        soru: 'Enzim tepkimeden sonra ne olur?',
        siklar: ['Değişmeden çıkar, tekrar kullanılır', 'Tepkimede tükenir'],
        dogru: 0,
        aciklama: {
          dogru: 'Enzim katalizör; tepkimeye girer, hızlandırır ve olduğu gibi çıkar.',
          yanlis: 'Tükenen substrat. Enzim tepkimeden değişmeden çıkar ve aynı enzim binlerce tepkimeyi art arda hızlandırır.',
        },
        kart: 5,
      },
      {
        soru: 'Yüksek sıcaklıkta enzim hızının düşmesinin sebebi?',
        siklar: ['Protein yapısı bozulur', 'Substrat tükenir'],
        dogru: 0,
        aciklama: {
          dogru: 'Enzim proteindir; belli sıcaklığın üstünde şekli bozulur ve substratına uyamaz.',
          yanlis: 'Substrat sıcaklıkla tükenmez. Isı enzimin üç boyutlu şeklini bozar; şekli bozulan enzim çalışmaz.',
        },
        kart: 8,
      },
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
      sikli('Bakteri ve arkeler hangi hücre tipindedir?', ['Prokaryot', 'Ökaryot'], 0, 'DNA sitoplazmada serbest.'),
      sikli('Hücre duvarı ve kloroplast hangi hücrede vardır?', ['Bitki', 'Hayvan'], 0, 'Hayvanda sentrozom.'),
      soru('Zarla bölmelenme farklı tepkimelerin karışmadan yürümesini sağlar.', true, 'Ökaryotun avantajı.'),
    ], [
      {
        soru: 'Prokaryot hücrede aşağıdakilerden hangisi bulunmaz?',
        siklar: ['Zarla çevrili çekirdek', 'Ribozom'],
        dogru: 0,
        aciklama: {
          dogru: 'Prokaryotta DNA sitoplazmada serbest durur; ribozom her hücrede var.',
          yanlis: 'Ribozom bütün hücrelerde bulunur, prokaryotta da. Prokaryotta olmayan şey zarla çevrili çekirdek ve organeller.',
        },
        kart: 1,
      },
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
      sikli('Fosfolipitin suda çift kat kurmasının sebebi?', ['Proteinler zorlar', 'Bir ucu suyu sever bir ucu sevmez'], 1, 'Su sevmez uçlar içeride kalır.'),
      sikli('Zarın esnek ve onarılabilir olduğunu anlatan model?', ['Anahtar-kilit', 'Akıcı mozaik'], 1, 'Proteinler lipit denizinde yüzer.'),
      soru('Hücre duvarı seçici geçirgendir.', false, 'Cansızdır ve tam geçirgendir.'),
    ], [
      {
        soru: 'Hücre zarının seçici geçirgen olması ne demektir?',
        siklar: ['Her şey serbestçe geçer', 'Neyin geçeceğine zar karar verir'],
        dogru: 1,
        aciklama: {
          dogru: 'Küçük ve yağda çözünen kolay geçer, büyük ve yüklü taşıyıcı ister.',
          yanlis: 'Her şeyin geçtiği yapı tam geçirgen hücre duvarıdır. Zar seçicidir; büyük ve yüklü moleküller ancak proteinle geçer.',
        },
        kart: 5,
      },
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
      kart(
        'Sitoplazmada gerçekleşen olaylar',
        'Glikoliz (solunumun ilk basamağı), protein sentezi (ribozomda) ve birçok enzim tepkimesi sitoplazmada yürür.',
      ),
    ], [
      soru('Sitoplazmanın büyük bölümü sudur.', true, 'Tepkimelerin geçtiği ortamın çözücüsü su.'),
      soru('Hücredeki tepkimelerin çoğu sitoplazmada gerçekleşir.', true, 'Organeller de bu ortamın içinde duruyor.'),
      soru('Sitoplazma, organelleri taşıyan cansız bir sıvıdır.', false, 'Canlı bir ortam: tepkimeler orada yürüyor ve kendisi de hareket ediyor.'),
      soru('Sitoplazma hareketi yalnızca hayvan hücrelerinde görülür.', false, 'Bitki hücrelerinde de görülür; madde dağılımını kolaylaştırıyor.'),
      sikli('Solunumun ilk basamağı olan glikoliz nerede olur?', ['Çekirdekte', 'Sitoplazmada'], 1, 'Sitoplazmada yürür.'),
      sikli('Sitoplazmanın dolaşması ne sağlar?', ['Hücreyi böler', 'Maddelerin dağılmasını hızlandırır'], 1, 'Bitki hücrelerinde.'),
      soru('Sitozol, zar ile çekirdek arasını dolduran sıvıdır.', true, 'Organeller içinde durur.'),
    ], [
      {
        soru: 'Sitoplazmanın büyük kısmı nedir?',
        siklar: ['Protein', 'Su'],
        dogru: 1,
        aciklama: {
          dogru: 'Tepkimeler çözeltide yürür; sitoplazmanın büyük kısmı sudur.',
          yanlis: 'Protein var ama az. Sitoplazmanın büyük kısmı su; moleküllerin birbirini bulması için çözelti gerekir.',
        },
        kart: 3,
      },
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
      kart(
        'Ribozom nerede bulunur?',
        'Sitoplazmada serbest ya da granüllü ER\'ye bağlı. Serbest olanlar hücre içi proteinleri, bağlı olanlar salgı ve zar proteinlerini üretir.',
      ),
    ], [
      soru('Ribozom zarsız bir yapıdır ve protein sentezler.', true, 'Zarsız olduğu için prokaryotlarda da bulunabiliyor.'),
      soru('Sentrozom bitki hücrelerinin temel yapılarındandır.', false, 'Sentrozom hayvan hücrelerinde bulunur ve bölünmede rol alır.'),
      soru('Sitoiskelet hücreye şekil verir ve organelleri yerinde tutar.', true, 'Ayrıca hücre içi taşımaya da yol oluyor.'),
      soru('Sil ve kamçının hücrenin hareketiyle ilgisi yoktur.', false, 'İkisi de hücrenin ya da çevresindeki sıvının hareketini sağlıyor.'),
      sikli('Bölünmede iğ ipliklerini oluşturan yapı?', ['Ribozom', 'Sentrozom'], 1, 'Yalnızca hayvan hücresinde.'),
      sikli('Solunum yolundaki tozu dışarı süpüren?', ['Kamçı', 'Siller'], 1, 'Hareket uzantıları.'),
      soru('Granüllü ER\'ye bağlı ribozomlar salgı proteinlerini üretir.', true, 'Serbest olanlar hücre içi proteinleri.'),
    ], [
      {
        soru: 'Hem prokaryot hem ökaryot hücrede bulunan yapı hangisidir?',
        siklar: ['Ribozom', 'Sentrozom'],
        dogru: 0,
        aciklama: {
          dogru: 'Protein sentezi her hücrede gerekli; ribozom her hücrede var.',
          yanlis: 'Sentrozom yalnızca hayvan hücrelerinde. Bütün hücrelerin ortak yapısı ribozom.',
        },
        kart: 2,
      },
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
      kart(
        'Hangi organel hangi hücrede?',
        'Kloroplast ve hücre duvarı yalnızca bitkide, sentrozom yalnızca hayvanda; mitokondri, ribozom ve çekirdek her ökaryotta.',
      ),
    ], [
      soru('Mitokondri hücrede enerji üretiminden sorumludur.', true, 'Besinlerdeki enerji burada ATP ye çevriliyor.'),
      soru('Kloroplast hem bitki hem hayvan hücrelerinde bulunur.', false, 'Yalnızca fotosentez yapan hücrelerde var.'),
      soru('Lizozom hücre içi sindirimi sağlar.', true, 'İçindeki sindirim enzimleri büyük molekülleri parçalıyor.'),
      soru('Golgi aygıtı proteinleri üretir.', false, 'Üretimi ribozom yapar; Golgi gelen proteini işleyip paketler.'),
      sikli('Ribozom parçaları nerede üretilir?', ['Golgi\'de', 'Çekirdekçikte'], 1, 'Çekirdek içinde.'),
      sikli('Fotosentez hangi organelde olur?', ['Mitokondri', 'Kloroplast'], 1, 'Klorofil ışığı yakalar.'),
      sikli('Lipit üreten organel?', ['Golgi', 'Granülsüz ER'], 1, 'Granüllü ER protein.'),
      sikli('Sindirim enzimleriyle maddeleri parçalayan?', ['Koful', 'Lizozom'], 1, 'Golgi paketler, lizozom parçalar.'),
      sikli('Bitki hücresine diklik veren?', ['Büyük koful', 'Sentrozom'], 0, 'Tek ve büyük.'),
      soru('Mitokondrinin kendi DNA\'sı vardır.', true, 'Çoğalabilir.'),
    ], [
      {
        soru: 'Hücre için ATP üreten organel hangisidir?',
        siklar: ['Golgi', 'Mitokondri'],
        dogru: 1,
        aciklama: {
          dogru: 'Hücresel solunum mitokondride; enerji para birimi ATP orada üretilir.',
          yanlis: 'Golgi paketleme ve gönderme yapar. ATP üretimi mitokondrinin işi.',
        },
        kart: 2,
      },
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
      kart(
        'Hangisi hangisi?',
        'Az yoğundan çok yoğuna ve ATP harcanıyorsa aktif; çok yoğundan az yoğuna ve ATP yoksa pasif. Taşıyıcı protein iki tarafta da olabilir.',
      ),
    ], [
      soru('Difüzyon, maddenin çok yoğun ortamdan az yoğun ortama geçmesidir.', true, 'Yoğunluk farkı yönü belirliyor ve enerji harcanmıyor.'),
      soru('Aktif taşımada enerji harcanmaz.', false, 'Yoğunluk farkına ters yönde gidildiği için ATP harcanır.'),
      soru('Ozmoz, suyun az yoğun ortamdan çok yoğun ortama geçmesidir.', true, 'Geçen şey çözünen değil, çözücü olan su.'),
      soru('Büyük moleküller hücre zarından basit difüzyonla geçer.', false, 'Basit difüzyon küçük moleküller için; büyükler endositozla alınıyor.'),
      sikli('O₂ ve CO₂ zardan nasıl geçer?', ['Aktif taşıma', 'Basit difüzyon'], 1, 'Küçük ve yüksüz.'),
      sikli('Glikoz taşıyıcı proteinle, enerji harcamadan geçerse?', ['Endositoz', 'Kolaylaştırılmış difüzyon'], 1, 'Pasif taşıma.'),
      sikli('Sodyum-potasyum pompası hangi taşımadır?', ['Ozmoz', 'Aktif taşıma'], 1, 'ATP harcanır.'),
      sikli('Derişik ortamda hücre ne olur?', ['Su alıp şişer', 'Su kaybedip büzülür'], 1, 'Plazmoliz.'),
      soru('Ekzositozla büyük maddeler dışarı verilir.', true, 'Zarla kese hâlinde.'),
    ], [
      {
        soru: 'Ozmozda su hangi yöne geçer?',
        siklar: ['Az yoğun ortamdan çok yoğun ortama', 'Çok yoğun ortamdan az yoğun ortama'],
        dogru: 0,
        aciklama: {
          dogru: 'Su, çözünen derişiminin yüksek olduğu tarafa geçerek dengeyi kurmaya çalışır.',
          yanlis: 'Yoğunluk çözüneni sayar: su, çözünenin çok olduğu (yani suyun az olduğu) tarafa geçer.',
        },
        kart: 4,
      },
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
      sikli('Yarasa kanadı ile insan kolu nasıl organlardır?', ['Homolog', 'Analog'], 0, 'Ortak köken.'),
      sikli('Katır neden ayrı tür değildir?', ['Kısırdır', 'Küçüktür'], 0, 'Verimli döl veremez.'),
      soru('Doğal sınıflandırma dış görünüşe dayanır.', false, 'Köken ve akrabalığa; yapay olan görünüşe.'),
    ], [
      {
        soru: 'Homo sapiens adlandırmasında "Homo" neyi gösterir?',
        siklar: ['Cinsi', 'Türü'],
        dogru: 0,
        aciklama: {
          dogru: 'İlk ad cins ve büyük harfle, ikinci ad tür ve küçük harfle yazılır.',
          yanlis: 'Tür adı ikinci kelime (sapiens) ve küçük harfle yazılır. Büyük harfli ilk kelime cins.',
        },
        kart: 4,
      },
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
      sikli('Dış sindirim yapan ve hücre duvarı kitin olan?', ['Bitkiler', 'Mantarlar'], 1, 'Bitkinin duvarı selüloz.'),
      sikli('Amip ve öglena hangi gruptadır?', ['Bakteriler', 'Protistler'], 1, 'Tek hücreli ökaryotlar.'),
      sikli('Hücre duvarı olmayan ökaryot grubu?', ['Bitkiler', 'Hayvanlar'], 1, 'Hareket eder, sinir sistemi var.'),
      soru('Bakterilerin çoğu hastalık yapar.', false, 'Çoğu yararlı: sindirim, toprak, yoğurt.'),
    ], [
      {
        soru: 'Kaynar su ve tuz gölü gibi aşırı ortamlarda yaşayan prokaryotlar?',
        siklar: ['Arkeler', 'Protistler'],
        dogru: 0,
        aciklama: {
          dogru: 'Arkeler prokaryot ve aşırı ortam uzmanı.',
          yanlis: 'Protistler ökaryot (amip, öglena). Aşırı ortamların prokaryotları arkeler.',
        },
        kart: 3,
      },
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
      sikli('Aynı türün bireyleri arasındaki farklılık?', ['Ekosistem çeşitliliği', 'Gen çeşitliliği'], 1, 'Hastalığa direnç burada saklı.'),
      sikli('Türkiye\'nin tür zenginliğinin sebebi?', ['Geniş çöl alanları', 'Üç bitki coğrafyasının kesişimi'], 1, 'Avrupa\'nın tamamına yakın tür.'),
      sikli('Tohum bankası neyi korur?', ['Habitatı', 'Gen çeşitliliğini'], 1, 'Millî park habitatı korur.'),
      soru('Tek çeşit üretim bir hastalıkla tümüyle yok olabilir.', true, 'Çeşitlilik dayanıklılık.'),
    ], [
      {
        soru: 'Yalnızca belirli bir bölgede yaşayan türe ne denir?',
        siklar: ['İstilacı', 'Endemik'],
        dogru: 1,
        aciklama: {
          dogru: 'Endemik tür başka yerde yok; orada kaybolursa dünyadan silinir.',
          yanlis: 'İstilacı tür geldiği yeri bozan yabancı tür. Yalnızca bir bölgeye özgü olan endemik tür.',
        },
        kart: 4,
      },
    ]),
  ]),
])
