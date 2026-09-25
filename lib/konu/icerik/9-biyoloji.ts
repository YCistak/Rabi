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
        'Canlıları ve yaşam olaylarını inceler.\nMoleküllerden ekosistemlere kadar her ölçekte çalışır.',
      ),
      kart(
        'Organizasyon düzeyleri',
        'Yaşam iç içe basamaklardan kurulur.\nHer basamakta, bir öncekinde olmayan yeni özellikler ortaya çıkar.',
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
        { not: 'Hücre → doku → organ → sistem → organizma → popülasyon → komünite → ekosistem → biyosfer. Bitkide \'sistem\' yok.' },
      ),
      kart(
        'Sağlığa katkısı',
        'Aşı, antibiyotik ve organ nakli biyolojik bilginin doğrudan sonucudur.\nOrtalama ömür bir yüzyılda ikiye katlandı.',
      ),
      kart(
        'Tarıma katkısı',
        'Biyoloji sayesinde geliştirildi:\n- Verimli tohumlar\n- Hastalığa dayanıklı çeşitler',
      ),
      kart(
        'Biyoteknoloji',
        'Canlıları ya da parçalarını üretimde kullanmaktır.\nEn bilinen örnek: insülinin bakteriye ürettirilmesi',
      ),
      kart(
        'Çevreye bakışı değiştirdi',
        'Ekosistem kavramı, bir türün kaybının bütün ağı etkilediğini gösterdi.\nKoruma politikaları bu bilgiden doğdu.',
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
        '- **Hooke:** mantar kesitindeki odacıklara "hücre" dedi.\n- **Leeuwenhoek:** ilk mikroorganizmaları gözledi.',
      ),
      kart(
        'Hücre teorisi',
        '- Bütün canlılar hücrelerden oluşur.\n- Hücre yaşamın en küçük birimidir.\n- Her hücre başka bir hücreden gelir.',
        undefined,
        { not: 'Virüs hücre teorisine uymaz: hücresi yok, tek başına bölünemez. \'En küçük canlı birim\' şıkkında virüs seçme.' },
      ),
      kart(
        'Evrim kuramı',
        '**Darwin**, doğal seçilimle türlerin zamanla değiştiğini gösterdi.\nKuram biyolojiyi tek çatı altında topladı.',
      ),
      kart(
        'Mendel ve kalıtım',
        'Bezelyelerle çaprazlama yaptı.\nKalıtımın belirli oranlarla işlediğini gösterdi; genetik böyle doğdu.',
      ),
      kart(
        'DNA’nın yapısı',
        '1953’te DNA’nın çift sarmal yapısı çözüldü.\nWatson, Crick ve Franklin’in çalışmalarıyla moleküler biyoloji başladı.',
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
        '**Fleming**, küf mantarının bakteriyi öldürdüğünü bir kaza sonucu gözledi.\nBakteriyel enfeksiyonlar öldürücü olmaktan çıktı.',
      ),
      kart(
        'Genom projeleri',
        'İnsan genomunun okunması iki şeyi mümkün kıldı:\n- Hastalık genlerinin bulunması\n- Kişiye özgü tedavi',
      ),
    ], [
      soru('Hücre teorisi, bütün canlıların hücrelerden oluştuğunu söyler.', true, 'Ayrıca her hücrenin kendinden önceki bir hücreden oluştuğunu da belirtir.'),
      soru('DNA nın çift sarmal yapısını Mendel açıklamıştır.', false, 'Yapıyı Watson ve Crick açıkladı; Mendel kalıtımın kurallarını buldu.'),
      soru('Mikroskobun icadı hücrenin görülmesini ve incelenmesini sağladı.', true, 'Hücre kavramı ancak mikroskopla ortaya çıkabildi.'),
      soru('Antibiyotikler virüslere karşı geliştirilmiş ilaçlardır.', false, 'Antibiyotikler bakterilere etki eder; virüslere karşı etkisizdir.'),
      sikli('Mantar kesitinde odacıklar görüp "hücre" diyen kimdir?', ['Leeuwenhoek', 'Hooke'], 1, 'Leeuwenhoek ilk mikroorganizmaları gözledi.'),
      sikli('Bezelyelerle kalıtımın oranlarını gösteren kimdir?', ['Mendel', 'Darwin'], 0, 'Darwin doğal seçilimle evrimi açıkladı.'),
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
        'Yeni kanıt gelince bilgi güncellenir.\nBu bir zayıflık değil, bilimin kendini düzeltme yeteneğidir.',
      ),
      kart(
        'Kanıta dayanır',
        'İddia gözlem ve deneyle desteklenmelidir.\nOtoriteye dayanan bir açıklama bilimsel sayılmaz.',
      ),
      kart(
        'Teori ve hipotez',
        '- **Hipotez:** sınanmayı bekleyen açıklama\n- **Teori:** defalarca sınanmış, geniş kapsamlı açıklama sistemi',
      ),
      kart(
        'Yasa ile teori farkı',
        '- **Yasa:** neyin olduğunu tarif eder.\n- **Teori:** nedenini açıklar.\nTeori "kanıtlanmamış yasa" değildir.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne yapar?'],
          satirlar: [
            ['Hipotez', 'Sınanmayı bekler'],
            ['Yasa', 'Ne olduğunu söyler'],
            ['Teori', 'Nedenini açıklar'],
          ],
        },
        { not: 'Mendel yasaları oranı söyler (3:1), evrim teorisi neden öyle olduğunu açıklar. Teori kanıtsız değildir.' },
      ),
      kart(
        'Yanlışlanabilirlik',
        'Bilimsel iddia, yanlış olduğunu gösterebilecek bir gözleme açık olmalıdır.\nHiçbir şeyle çürütülemeyen iddia bilim dışıdır.',
      ),
      kart(
        'Hakem değerlendirmesi',
        'Çalışma yayımlanmadan önce alandaki başka araştırmacılarca denetlenir.\nBu, hataların ilk süzgecidir.',
      ),
    ], [
      soru('Bilimsel bilgi, yeni kanıtlar karşısında değişebilir.', true, 'Değişebilir olması zayıflığı değil, kanıta bağlı olmasının sonucu.'),
      soru('Bilimsel bir hipotezin yanlışlanabilir olması gerekir.', true, 'Hiçbir gözlemin çürütemeyeceği bir iddia bilimsel olarak sınanamaz.'),
      soru('Bir teori, yeterince kanıt toplayınca yasaya dönüşür.', false, 'Yasa neyin olduğunu tanımlar, teori niçin olduğunu açıklar; ikisi ayrı işler.'),
      soru('Hakem değerlendirmesinden geçmemiş bir iddia da bilimsel bilgi sayılır.', false, 'Yayımlanmadan önce alanın uzmanlarınca denetlenmesi sürecin parçası.'),
      sikli('Evrim teorisi için hangisi doğrudur?', ['Defalarca sınanmış açıklamadır', 'Kanıtsız bir tahmindir'], 0, 'Bilimde teori "kanıtlanmamış" demek değildir.'),
      sikli('Sınanmayı bekleyen açıklamaya ne denir?', ['Hipotez', 'Teori'], 0, 'Teori defalarca sınanmış geniş bir açıklama sistemi.'),
      soru('Otoriteye dayanan bir açıklama bilimsel sayılır.', false, 'Bilimsel iddia gözlem ve deneyle desteklenmelidir; söyleyenin kim olduğu kanıt değildir.'),
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
        'Gözlem → soru → hipotez → deney → veri → analiz → sonuç\nSonuç yeni bir soruya kapı açar.',
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
        '- **Bağımsız:** araştırmacının değiştirdiği\n- **Bağımlı:** ölçülen\n- **Kontrol:** sabit tutulanlar',
        undefined,
        { not: '\'Işık bitki boyunu etkiler mi\': bağımsız = ışık, bağımlı = boy, kontrol = su, toprak, sıcaklık (sabit tutulan).' },
      ),
      kart(
        'Örnek deney',
        '"Işık miktarı bitki boyunu etkiler mi?"\n- **Bağımsız değişken:** ışık\n- **Bağımlı değişken:** bitki boyu\n- **Sabit tutulan:** su, toprak, sıcaklık',
      ),
      kart(
        'Kontrol grubu',
        'Denenen etkiyi almayan gruptur.\nKontrol grubu olmadan gözlenen değişimin sebebi bilinemez.',
      ),
      kart(
        'Plasebo',
        'Etkisiz bir uygulama alan gruptur.\nİnsanlarda beklentinin kendisi sonucu değiştirdiği için gereklidir.',
      ),
      kart(
        'Örneklem',
        'Denek sayısı az ya da seçimi taraflıysa sonuç yanıltır.\nDeney doğru kurulmuş olsa bile.',
      ),
      kart(
        'Tekrarlanabilirlik',
        'Aynı koşullarda başkaları da aynı sonucu alabilmelidir.\nTekrarlanamayan sonuç kabul edilmez.',
      ),
    ], [
      soru('Kontrol grubu, deney grubuyla karşılaştırma yapabilmek için kullanılır.', true, 'Değişkenin etkisi ancak bu karşılaştırmayla görülüyor.'),
      soru('Bir deneyde birden çok bağımsız değişken aynı anda değiştirilirse sonucun sebebi anlaşılmaz.', true, 'Hangi değişikliğin sonuca yol açtığı ayırt edilemez.'),
      soru('Plasebo, deneklere verilen etkin maddedir.', false, 'Plasebo etkisiz bir madde; beklentinin etkisini ayırmak için veriliyor.'),
      soru('Örneklem küçüldükçe sonuçların güvenilirliği artar.', false, 'Küçük örneklem rastlantıya daha açık; güvenilirlik örneklem büyüdükçe artar.'),
      sikli('Bilimsel araştırmada hipotezden hemen sonra hangi adım gelir?', ['Deney', 'Sonuç'], 0, 'Hipotez deneyle sınanır, sonuç veriden çıkar.'),
      sikli('Işık-bitki deneyinde su miktarı hangi değişkendir?', ['Sabit tutulan', 'Bağımlı'], 0, 'Bağımlı değişken ölçülen bitki boyu; su sabit tutulur.'),
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
        'Sonuç uydurmak ya da beğenilmeyen veriyi gizlemek en ağır ihlaldir.\nBöyle bir yayın geri çekilir.',
      ),
      kart(
        'Aşırma',
        'Başkasının çalışmasını kaynak göstermeden kullanmaktır.\nAlıntı yapmak serbest, sahiplenmek değil.',
      ),
      kart(
        'Aydınlatılmış onam',
        'İnsan üzerinde çalışılacaksa katılımcı:\n- riskleri bilmeli,\n- gönüllü olarak kabul etmelidir.',
      ),
      kart(
        'Hayvan deneyleri',
        'Etik kurul onayı gerekir.\n- Hayvan sayısı en aza indirilir.\n- Acı azaltılır.\n- Mümkünse alternatif yöntem seçilir.',
      ),
      kart(
        'Çıkar çatışması',
        'Araştırmayı finanse eden kuruluşun sonuçtan çıkarı varsa açıkça bildirilmelidir.',
        undefined,
        { not: 'Şeker firmasının finanse ettiği \'şeker zararsız\' araştırması: sonuç yanlış olmayabilir ama şüpheyle okunur.' },
      ),
      kart(
        'Kişisel verinin gizliliği',
        'Genetik veri kişiye ve ailesine aittir.\nKimliği açık edecek biçimde paylaşılamaz.',
      ),
    ], [
      soru('Beklenen sonuca uymayan verileri çıkarmak bilim etiğine aykırıdır.', true, 'Veriyi seçmek, sonucu önceden yazmak demek.'),
      soru('Başkasının çalışmasını kaynak göstermeden kullanmak aşırmadır.', true, 'Fikir de bir emek; sahibi belirtilmek zorunda.'),
      soru('İnsan üzerinde yapılan araştırmalarda kişinin onayı alınmayabilir.', false, 'Aydınlatılmış onam şart: kişi neye katıldığını bilerek kabul etmeli.'),
      soru('Araştırmayı destekleyen kuruluşun belirtilmesine gerek yoktur.', false, 'Çıkar çatışması açıklanmalı; sonucu okuyanın bunu bilmeye hakkı var.'),
      sikli('Hayvan deneylerinde hangisi ilkedir?', ['Hayvan sayısını en aza indirmek', 'Sayıyı artırmak'], 0, 'Etik kurul onayı, en az hayvan, en az acı, mümkünse alternatif yöntem.'),
      sikli('Veri uydurduğu anlaşılan bir yayına ne olur?', ['Ödül alır', 'Geri çekilir'], 1, 'Veri uydurmak bilim etiğinin en ağır ihlali.'),
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
        'Bütün canlılar hücrelerden oluşur.\nVirüslerin hücresi yoktur; bu yüzden canlı sayılmaları tartışmalıdır.',
      ),
      kart(
        'Beslenme ve enerji',
        '- **Ototrof:** besinini kendi üretir.\n- **Heterotrof:** besinini dışarıdan alır.\nHer canlı enerji üretir ve tüketir.',
      ),
      kart(
        'Metabolizma',
        '- **Anabolizma:** yapım tepkimeleri\n- **Katabolizma:** yıkım tepkimeleri\nYaşam bu iki yönün dengesidir.',
      ),
      kart(
        'Homeostazi',
        'İç ortamı dengede tutmaktır.\nÖrnek: vücut sıcaklığının ve kan şekerinin sabit kalması',
      ),
      kart(
        'Uyarılara tepki',
        'Canlılar çevredeki değişimi algılar ve karşılık verir.\nBitkinin ışığa yönelmesi de bir tepkidir.',
      ),
      kart(
        'Boşaltım ve solunum',
        '- **Boşaltım:** metabolizma artıkları dışarı atılır.\n- **Solunum:** besindeki enerji kullanılabilir hâle gelir.',
      ),
      kart(
        'Üreme, büyüme, uyum',
        'Canlılar çoğalır ve gelişir.\nVaryasyon ve adaptasyon sayesinde türler değişen koşullara uyar.',
      ),
      kart(
        'Virüs canlı mı?',
        '- **Canlı gibi:** kalıtım maddesi var, çoğalabilir.\n- **Cansız gibi:** hücresi yok, konak dışında yaşam belirtisi göstermez.',
        undefined,
        { not: 'Virüs: metabolizma yok, hücre yok, ribozom yok; konakta çoğalır. Bu yüzden antibiyotik virüse işlemez.' },
      ),
      kart(
        'Organizasyon',
        'Her canlıda hücreden başlayan düzenli bir yapı vardır.\nÇok hücrelilerde: hücre → doku → organ → sistem → organizma',
      ),
    ], [
      soru('Bütün canlılar hücresel yapıya sahiptir.', true, 'Hücre, canlılığın en küçük yapı ve işlev birimi.'),
      soru('Virüsler hücresel yapıya sahip olduğu için canlı kabul edilir.', false, 'Hücresel yapıları yok; ancak canlı bir hücrenin içinde çoğalabiliyorlar.'),
      soru('Homeostazi, canlının değişen koşullara rağmen iç dengesini korumasıdır.', true, 'Vücut sıcaklığının sabit tutulması buna örnek.'),
      soru('Metabolizma yalnızca yapım tepkimelerini kapsar.', false, 'Yapım (anabolizma) ve yıkım (katabolizma) tepkimelerinin tamamı.'),
      sikli('Besinini kendi üreten canlıya ne denir?', ['Heterotrof', 'Ototrof'], 1, 'Heterotrof dışarıdan alır.'),
      sikli('Türlerin değişen koşullara uyum sağlamasını ne kolaylaştırır?', ['Varyasyon ve adaptasyon', 'Homeostazi'], 0, 'Homeostazi bireyin iç dengesini korur; türün uyumu varyasyonla olur.'),
      sikli('Bitkinin ışığa yönelmesi hangi özelliktir?', ['Boşaltım', 'Uyarılara tepki'], 1, 'Çevredeki değişimi algılayıp karşılık verme.'),
      sikli('Antibiyotik virüse neden işlemez?', ['Metabolizması ve ribozomu yok', 'Çok büyüktür'], 0, 'Antibiyotik bakterinin yapısını hedefler; virüste o yapılar yok.'),
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
        'Polar yapısı sayesinde iyi bir çözücüdür.\nTepkimeler suda gerçekleşir, maddeler suyla taşınır.',
      ),
      kart(
        'Adezyon ve kohezyon',
        '- **Kohezyon:** su moleküllerini birbirine bağlar.\n- **Adezyon:** suyu başka yüzeylere bağlar.\nBitkilerde su bu sayede yükselir.',
      ),
      kart(
        'Suyun ısı dengeleyiciliği',
        'Öz ısısı yüksek olduğu için geç ısınır, geç soğur.\nVücut ve göl sıcaklığı bu yüzden ani değişmez.',
      ),
      kart(
        'Mineraller',
        'Yapıya katılır ve tepkimeleri düzenler.\nEksiklikleri belirli hastalıklarla kendini gösterir.',
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
        '- **pH 7:** nötr\n- **7’nin altı:** asidik\n- **7’nin üstü:** bazik\nEnzimler yalnızca dar bir pH aralığında çalışır.',
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
        'Kan pH’ı **7,4** dolayında dar bir aralıkta tutulur.\nKüçük bir sapma bile enzimleri durdurabilir.',
        undefined,
        { not: 'Kan pH\'ı 7,35–7,45; 7\'ye inse enzimler durur. HCO₃⁻ tamponu fazla H⁺\'yı yakalar. Sınav: \'kanın pH\'ı nötrdür\' yanlış.' },
      ),
      kart(
        'Asitler ve bazlar',
        '- **Asit:** ortama H⁺ verir.\n- **Baz:** OH⁻ verir ya da H⁺ bağlar.\nMide asidik, safra baziktir.',
      ),
      kart(
        'İnorganik mi organik mi?',
        'İnorganik moleküller dışarıdan hazır alınır; su bir istisna, solunumda hücrede de oluşur.\nÖrnek: su, mineral, asit, baz, tuz\nEnerji vermezler ve sindirilmezler.',
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
      sikli('Hemoglobinin yapısına katılan mineral?', ['Kalsiyum', 'Demir'], 1, 'Kalsiyum kemik ve kasta görev alır.'),
      sikli('Bitkilerde suyun yükselmesini sağlayan?', ['Adezyon ve kohezyon', 'Tampon sistem'], 0, 'Kohezyon suyu suya, adezyon yüzeye bağlar.'),
      sikli('İnorganik moleküllerden hangisi hücrede de oluşabilir?', ['Su', 'Kalsiyum'], 0, 'Solunumun sonunda su oluşur; mineraller dışarıdan alınmak zorunda.'),
      sikli('Mide ortamı nasıldır?', ['Asidik', 'Bazik'], 0, 'Safra bazik.'),
      soru('Su, polar yapısı sayesinde iyi bir çözücüdür.', true, 'Tepkimeler suda gerçekleşir, maddeler suyla taşınır.'),
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
        'Canlıdaki büyük moleküller dört sınıfta toplanır.\nHer biri kendi küçük yapı taşından kurulur.',
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
        'Hızlı enerji kaynağıdır.\n- **Monosakkarit:** glikoz\n- **Disakkarit:** sükroz\n- **Polisakkarit:** nişasta, glikojen, selüloz',
      ),
      kart(
        'Lipitler',
        '- Yoğun enerji deposu\n- Hücre zarının yapı taşı\n- Bazı hormonların kaynağı\nSuda çözünmezler.',
      ),
      kart(
        'Proteinler',
        'Amino asitlerden kurulur; amino asit sırası işlevi belirler.\nGörevleri: yapı, taşıma, savunma ve enzim',
      ),
      kart(
        'Karbonhidrat depoları',
        '- **Bitki:** nişasta depolar.\n- **Hayvan:** glikojen depolar.\n- **Selüloz:** bitki duvarı, insan sindiremez.\nÜçü de glikoz zinciridir.',
      ),
      kart(
        'Enzimler',
        'Tepkimeleri hızlandıran, protein yapılı katalizörlerdir.\nAktivasyon enerjisini düşürür, kendileri tükenmez.',
      ),
      kart(
        'Enzim-substrat uyumu',
        'Enzim yalnızca kendi substratına uyar.\nAnahtar-kilit benzetmesi bu seçiciliği anlatır.',
      ),
      kart(
        'Enzimi etkileyen etmenler',
        'Sıcaklık ve pH belirli bir değere kadar hızı artırır.\nO noktadan sonra protein bozulur, hız düşer.',
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
        { not: 'Enzim 37 °C\'de en hızlı, 60 °C\'de bozulur (geri dönmez); 0 °C\'de yavaşlar ama bozulmaz. Soğuk durdurur, sıcak öldürür.' },
      ),
      kart(
        'Nükleik asitler ve vitaminler',
        '- **DNA:** kalıtım bilgisini taşır.\n- **RNA:** bu bilgiyi kullanır.\n- **Vitamin:** enerji vermez, tepkimeleri düzenler.',
      ),
      kart(
        'Dehidrasyon ve hidroliz',
        '- **Dehidrasyon:** su çıkararak birleşme\n- **Hidroliz:** su ekleyerek parçalanma',
      ),
      kart(
        'Enerji önceliği',
        'Enerji için sırayla kullanılır: karbonhidrat → yağ → protein\nYağ en çok enerjiyi verir ama en yavaş yıkılır.',
      ),
    ], [
      soru('Enzimler tepkimeyi hızlandırır ve tepkime sonunda değişmeden çıkar.', true, 'Bu yüzden aynı enzim defalarca kullanılabiliyor.'),
      soru('Her enzim her substratla çalışabilir.', false, 'Enzim substratına özgü; aralarında anahtar-kilit uyumu var.'),
      soru('Yüksek sıcaklıkta enzimin yapısı bozulur ve işlevini yitirir.', true, 'Protein yapısı bozulunca aktif bölge de bozuluyor.'),
      soru('Proteinlerin yapı birimi yağ asitleridir.', false, 'Proteinlerin yapı birimi amino asit; yağ asidi lipitlerin.'),
      sikli('Bitkinin karbonhidrat deposu nedir?', ['Nişasta', 'Glikojen'], 0, 'Hayvan glikojen.'),
      sikli('İnsan hangi polisakkariti sindiremez?', ['Selüloz', 'Nişasta'], 0, 'Bitki duvarı.'),
      sikli('Nişasta, glikojen ve selülozun ortak yapı birimi?', ['Glikoz', 'Amino asit'], 0, 'Üçü de glikoz zinciri; amino asit proteinlerin birimi.'),
      sikli('DNA\'nın görevi nedir?', ['Kalıtım bilgisini taşımak', 'Enerji depolamak'], 0, 'RNA bu bilgiyi kullanır; enerji deposu yağ ve karbonhidrat.'),
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
        kart: 6,
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
        '- **Prokaryot:** zarla çevrili çekirdek ve organel yok\n- **Ökaryot:** ikisi de var',
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
        'Bakteriler ve arkelerdir.\nDNA sitoplazmada serbest durur, ribozomları daha küçüktür.',
      ),
      kart(
        'Ökaryotlar',
        'Protistler, mantarlar, bitkiler ve hayvanlardır.\nHücreleri daha büyük ve bölmelidir.',
      ),
      kart(
        'Neden bölmeli?',
        'Zarla ayrılmış bölmeler, farklı tepkimelerin karışmadan aynı anda yürümesini sağlar.',
        undefined,
        { not: 'Lizozomun sindirim enzimi sitoplazmaya dökülse hücre kendini sindirir; zar o enzimi bölmede tutar.' },
      ),
      kart(
        'Bitki ve hayvan hücresi',
        '- **Bitki hücresi:** hücre duvarı, kloroplast, büyük koful\n- **Hayvan hücresi:** sentrozom',
      ),
      kart(
        'Ortak yanları',
        'İkisinde de bulunur: hücre zarı, sitoplazma, ribozom ve DNA.\nBunlar yaşamın asgari donanımıdır.',
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
      sikli('Mantarlar, bitkiler ve hayvanlar hangi hücre tipindedir?', ['Ökaryot', 'Prokaryot'], 0, 'Zarla çevrili çekirdekleri ve organelleri var.'),
      sikli('Sentrozom hangi hücrede bulunur?', ['Bitki', 'Hayvan'], 1, 'Hayvan hücresinde bölünmede iğ ipliklerini kurar.'),
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
        'Çift katlı fosfolipit tabakasıdır.\nİçine gömülü proteinler, kolesterol ve karbonhidrat zincirleri bulunur.',
      ),
      kart(
        'Neden çift katlı?',
        'Fosfolipitin bir ucu suyu sever, öbür ucu sevmez.\nSuda, su sevmeyen uçlar içeride kalacak biçimde kendiliğinden dizilirler.',
        undefined,
        { not: 'Fosfat başlar dışa (su), yağ kuyrukları içe bakar. Yağda çözünen O₂ kolay geçer, iyonlar kanal ister.' },
      ),
      kart(
        'Akıcı mozaik model',
        'Zar sabit bir duvar değildir; proteinler lipit denizinde yüzer.\nBu yüzden esnek ve onarılabilirdir.',
      ),
      kart(
        'Zar proteinleri',
        'Kimi taşıyıcı, kimi kanal, kimi alıcıdır.\nHücrenin dış dünyayla iletişimi bu proteinlerle olur.',
      ),
      kart(
        'Seçici geçirgenlik',
        'Zar neyin gireceğine karar verir.\n- **Küçük ve yağda çözünen:** kolay geçer.\n- **Büyük ve yüklü:** taşıyıcı ister.',
      ),
      kart(
        'Hücre duvarı ile karışmasın',
        'Hücre duvarı bitki, mantar ve bakterilerde zarın dışındadır.\nCansızdır ve tam geçirgendir.',
      ),
    ], [
      soru('Hücre zarı seçici geçirgendir.', true, 'Hangi maddenin geçeceğine zarın yapısı karar veriyor.'),
      soru('Akıcı mozaik modele göre zardaki proteinler yerlerinde sabit durur.', false, 'Proteinler yağ tabakasının içinde hareket edebiliyor; modelin adındaki "akıcı" bunu anlatıyor.'),
      soru('Hücre zarı çift katlı fosfolipit tabakasından oluşur.', true, 'Su sevmeyen kuyruklar içe, su seven başlar dışa bakıyor.'),
      soru('Hücre duvarı bütün canlı hücrelerde bulunur.', false, 'Hayvan hücresinde yok; bitki, mantar ve bakterilerde var.'),
      sikli('Fosfolipitin suda çift kat kurmasının sebebi?', ['Proteinler zorlar', 'Bir ucu suyu sever bir ucu sevmez'], 1, 'Su sevmez uçlar içeride kalır.'),
      sikli('Zardan hangisi kolay geçer?', ['Küçük ve yağda çözünen O₂', 'Büyük ve yüklü iyonlar'], 0, 'Yüklü ve büyük maddeler taşıyıcı ya da kanal ister.'),
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
        'Zar ile çekirdek arasını doldurur:\n- Sitozol (sıvı kısım)\n- Organeller ve sitoplazmik yapılar',
      ),
      kart(
        'Görevi',
        'Tepkimelerin çoğu burada gerçekleşir.\nOrganelleri taşır, maddelerin dağılmasını sağlar.',
      ),
      kart(
        'İçeriği',
        'Büyük kısmı sudur.\nAyrıca protein, tuz, enzim ve besin molekülleri bulunur.',
      ),
      kart(
        'Neden çoğu su?',
        'Tepkimeler çözelti içinde yürür.\nSusuz bir sitoplazmada moleküller birbirini bulamaz.',
      ),
      kart(
        'Sitoplazma hareketi',
        'Bitki hücrelerinde sitoplazma dolaşır.\nBu hareket, maddelerin hücre içinde dağılmasını hızlandırır.',
      ),
      kart(
        'Sitoplazmada gerçekleşen olaylar',
        '- **Glikoliz:** solunumun ilk basamağı\n- **Protein sentezi:** ribozomlarda\n- **Enzim tepkimeleri:** birçoğu burada yürür',
        undefined,
        { not: 'Glikoliz sitozolde (oksijensiz, her hücrede); Krebs mitokondride. \'Glikoliz mitokondride\' şıkkı yanlış.' },
      ),
    ], [
      soru('Sitoplazmanın büyük bölümü sudur.', true, 'Tepkimelerin geçtiği ortamın çözücüsü su.'),
      soru('Hücredeki tepkimelerin çoğu sitoplazmada gerçekleşir.', true, 'Organeller de bu ortamın içinde duruyor.'),
      soru('Sitoplazma, organelleri taşıyan cansız bir sıvıdır.', false, 'Canlı bir ortam: tepkimeler orada yürüyor ve kendisi de hareket ediyor.'),
      soru('Sitoplazma hareketi yalnızca hayvan hücrelerinde görülür.', false, 'Bitki hücrelerinde de görülür; madde dağılımını kolaylaştırıyor.'),
      sikli('Solunumun ilk basamağı olan glikoliz nerede olur?', ['Çekirdekte', 'Sitoplazmada'], 1, 'Sitoplazmada yürür.'),
      sikli('Hücredeki tepkimeler neden su içinde yürür?', ['Moleküller çözeltide birbirini bulur', 'Su enerji verir'], 0, 'Susuz ortamda moleküller karşılaşamaz.'),
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
        'Ribozom, sentrozom ve sitoiskelet zarla çevrili değildir.\nBu yüzden organel sayılmayabilirler.',
      ),
      kart(
        'Ribozom',
        'Protein sentezi yapar.\nHem prokaryot hem ökaryot hücrede bulunan ortak yapıdır.',
        undefined,
        { not: 'Bakteride de ribozom var: "prokaryotta organel yok" derken tek istisna bu. Antibiyotikler bakteri ribozomunu hedefler.' },
      ),
      kart(
        'Sitoiskelet',
        'Protein ipliklerinden oluşur.\n- Hücreye şekil verir.\n- Organelleri yerinde tutar.\n- Hareketi sağlar.',
      ),
      kart(
        'Sentrozom',
        'Hayvan hücrelerinde bölünme sırasında iğ ipliklerini oluşturur.\nBitki hücrelerinde bulunmaz.',
      ),
      kart(
        'Sil ve kamçı',
        'Hücrenin hareketini sağlayan uzantılardır.\nSolunum yolundaki siller tozu dışarı süpürür.',
      ),
      kart(
        'Ribozom nerede bulunur?',
        '- **Sitoplazmada serbest:** hücre içi proteinleri üretir.\n- **Granüllü ER’ye bağlı:** salgı ve zar proteinlerini üretir.',
      ),
    ], [
      soru('Ribozom zarsız bir yapıdır ve protein sentezler.', true, 'Zarsız olduğu için prokaryotlarda da bulunabiliyor.'),
      soru('Sentrozom bitki hücrelerinin temel yapılarındandır.', false, 'Sentrozom hayvan hücrelerinde bulunur ve bölünmede rol alır.'),
      soru('Sitoiskelet hücreye şekil verir ve organelleri yerinde tutar.', true, 'Ayrıca hücre içi taşımaya da yol oluyor.'),
      soru('Sil ve kamçının hücrenin hareketiyle ilgisi yoktur.', false, 'İkisi de hücrenin ya da çevresindeki sıvının hareketini sağlıyor.'),
      sikli('Bölünmede iğ ipliklerini oluşturan yapı?', ['Ribozom', 'Sentrozom'], 1, 'Yalnızca hayvan hücresinde.'),
      sikli('Antibiyotiklerin bir kısmı bakterinin hangi yapısını hedefler?', ['Ribozomunu', 'Çekirdeğini'], 0, 'Bakteride zarla çevrili çekirdek yok; ribozomu ise bizimkinden farklı.'),
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
        'DNA’yı taşır ve hücreyi yönetir.\nÇekirdekçikte ribozom parçaları üretilir.',
      ),
      kart(
        'Mitokondri',
        'Hücresel solunumla **ATP** üretir.\nKendi DNA’sı vardır ve çoğalabilir.',
      ),
      kart(
        'Kloroplast',
        'Bitki hücrelerinde fotosentez yapar.\nKlorofil pigmenti ışığı yakalar.',
      ),
      kart(
        'Endoplazmik retikulum',
        '- **Granüllü ER:** protein üretir.\n- **Granülsüz ER:** lipit üretir.\nİkisi de maddeleri taşır.',
      ),
      kart(
        'Golgi ve lizozom',
        '- **Golgi:** gelen maddeleri paketler ve gönderir.\n- **Lizozom:** sindirim enzimleriyle maddeleri parçalar.',
      ),
      kart(
        'Salgı yolu',
        'Üretilen bir protein hücreyi hep aynı sırayla terk eder.\nRibozom → ER → Golgi → zar',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ribozom' },
            { ad: 'ER' },
            { ad: 'Golgi' },
            { ad: 'Zar' },
          ],
        },
        { not: 'Protein yolu: ribozom → granüllü ER → Golgi → salgı kesesi → hücre zarı. Tükürük amilazı bu yoldan çıkar.' },
      ),
      kart(
        'Koful',
        'Depolama ve boşaltım yapar.\nBitki hücresinde tek ve büyüktür, hücreye diklik verir.',
      ),
      kart(
        'Neden ayrı organeller?',
        'Her organel bir işe ayrılmıştır.\nBölmeleme, hücrenin aynı anda hem üretip hem parçalamasını sağlar.',
      ),
      kart(
        'Hangi organel hangi hücrede?',
        '- **Yalnızca bitkide:** kloroplast, hücre duvarı\n- **Yalnızca hayvanda:** sentrozom\n- **Her ökaryotta:** mitokondri, ribozom, çekirdek',
      ),
    ], [
      soru('Mitokondri hücrede enerji üretiminden sorumludur.', true, 'Besinlerdeki enerji burada ATP ye çevriliyor.'),
      soru('Kloroplast hem bitki hem hayvan hücrelerinde bulunur.', false, 'Yalnızca fotosentez yapan hücrelerde var.'),
      soru('Lizozom hücre içi sindirimi sağlar.', true, 'İçindeki sindirim enzimleri büyük molekülleri parçalıyor.'),
      soru('Golgi aygıtı proteinleri üretir.', false, 'Üretimi ribozom yapar; Golgi gelen proteini işleyip paketler.'),
      sikli('Ribozom parçaları nerede üretilir?', ['Golgi\'de', 'Çekirdekçikte'], 1, 'Çekirdek içinde.'),
      sikli('Fotosentez hangi organelde olur?', ['Mitokondri', 'Kloroplast'], 1, 'Klorofil ışığı yakalar.'),
      sikli('Lipit üreten organel?', ['Golgi', 'Granülsüz ER'], 1, 'Granüllü ER protein.'),
      sikli('Salgı yolunda ER\'den sonra hangi organel gelir?', ['Golgi', 'Lizozom'], 0, 'Ribozom → ER → Golgi → zar.'),
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
        'Ayrım tek bir soruya bağlı:\ngeçiş için ATP harcanıyor mu?',
        {
          tur: 'tablo',
          basliklar: ['Geçiş', 'Enerji', 'Yön'],
          satirlar: [
            ['Difüzyon', 'Yok', 'Çoktan aza'],
            ['Ozmoz', 'Yok', 'Su seyreltikten derişiğe'],
            ['Aktif taşıma', 'Var', 'Azdan çoğa'],
          ],
        },
      ),
      kart(
        'Basit difüzyon',
        'Küçük ve yüksüz moleküller doğrudan zardan geçer.\nÖrnek: O₂, CO₂',
      ),
      kart(
        'Kolaylaştırılmış difüzyon',
        'Glikoz gibi büyük moleküller taşıyıcı proteinle geçer.\nYine enerji harcanmaz.',
      ),
      kart(
        'Ozmoz',
        'Suyun, az yoğun ortamdan çok yoğun ortama geçmesidir.\nBitkinin diklik kaybı bu dengeyle ilgilidir.',
      ),
      kart(
        'Hücre ve ortam',
        '- **Ortam derişikse:** hücre su kaybedip büzülür (plazmoliz).\n- **Ortam seyreltikse:** hücre su alıp şişer.',
      ),
      kart(
        'Aktif taşıma',
        'Madde azdan çoğa taşınır ve **ATP harcanır**.\nÖrnek: sodyum-potasyum pompası',
      ),
      kart(
        'Endositoz ve ekzositoz',
        'Çok büyük maddeler kese hâlinde taşınır:\n- **Endositoz:** hücreye alma\n- **Ekzositoz:** dışarı verme',
      ),
      kart(
        'Hangisi hangisi?',
        '- **Aktif:** azdan çoğa, ATP harcanır.\n- **Pasif:** çoktan aza, ATP harcanmaz.\nTaşıyıcı protein iki türde de olabilir.',
        undefined,
        { not: 'O₂ girişi difüzyon (ATP yok), glikoz girişi kolaylaştırılmış (taşıyıcı, ATP yok), Na⁺ dışarı atma aktif (ATP var).' },
      ),
    ], [
      soru('Difüzyon, maddenin çok yoğun ortamdan az yoğun ortama geçmesidir.', true, 'Yoğunluk farkı yönü belirliyor ve enerji harcanmıyor.'),
      soru('Aktif taşımada enerji harcanmaz.', false, 'Yoğunluk farkına ters yönde gidildiği için ATP harcanır.'),
      soru('Ozmoz, suyun az yoğun ortamdan çok yoğun ortama geçmesidir.', true, 'Geçen şey çözünen değil, çözücü olan su.'),
      soru('Büyük moleküller hücre zarından basit difüzyonla geçer.', false, 'Basit difüzyon küçük moleküller için; büyükler endositozla alınıyor.'),
      sikli('O₂ ve CO₂ zardan nasıl geçer?', ['Aktif taşıma', 'Basit difüzyon'], 1, 'Küçük ve yüksüz.'),
      sikli('Glikoz taşıyıcı proteinle, enerji harcamadan geçerse?', ['Kolaylaştırılmış difüzyon', 'Endositoz'], 0, 'Taşıyıcı var ama ATP yok: pasif taşıma.'),
      sikli('Sodyum-potasyum pompası hangi taşımadır?', ['Ozmoz', 'Aktif taşıma'], 1, 'ATP harcanır.'),
      sikli('Derişik ortamda hücre ne olur?', ['Su kaybedip büzülür', 'Su alıp şişer'], 0, 'Su seyreltikten derişiğe geçer; hücre su kaybeder (plazmoliz).'),
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
        'Milyonlarca türü düzenli incelemek içindir.\nSınıflandırma aynı zamanda akrabalık ilişkisini gösterir.',
      ),
      kart(
        'Yapay ve doğal sınıflandırma',
        '- **Yapay:** dış görünüşe bakar.\n- **Doğal (modern):** köken ve akrabalığı esas alır.',
      ),
      kart(
        'Analog ve homolog',
        '- **Homolog:** ortak kökenli (yarasa kanadı ve insan kolu)\n- **Analog:** yalnızca aynı işi görür (kuş kanadı ve sinek kanadı)',
        undefined,
        { not: 'Yarasa kanadı–insan kolu homolog (aynı kemikler); kuş kanadı–sinek kanadı analog (aynı iş, farklı yapı).' },
      ),
      kart(
        'İkili adlandırma',
        'Linne’nin yöntemidir: önce cins, sonra tür adı yazılır.\nCins büyük, tür küçük harfle başlar ve ikisi eğik yazılır: Homo sapiens',
      ),
      kart(
        'Kategoriler',
        'Âlemden türe doğru daralır:\n- Ortak özellik artar.\n- Birey sayısı azalır.',
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
        'Doğada çiftleşip **verimli döl** verebilen bireyler topluluğudur.\nKatır kısır olduğu için ayrı bir tür sayılmaz.',
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
      sikli('Sınıflandırma türler hakkında neyi de gösterir?', ['Akrabalık ilişkisini', 'Yaşam sürelerini'], 0, 'Doğal sınıflandırma köken ve akrabalığı esas alır.'),
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
        '- Bakteriler\n- Arkeler\n- Ökaryotlar\nAyrım hücre yapısına ve genetik benzerliğe dayanır.',
      ),
      kart(
        'Bakteriler',
        'Prokaryot ve tek hücrelidir.\nBazıları hastalık yapar ama çoğu yararlıdır: sindirim, toprak, yoğurt.',
      ),
      kart(
        'Arkeler',
        'Prokaryottur ama bakterilerden farklıdır.\nÇoğu aşırı ortamlarda yaşar: kaynar su, tuz gölü, asit.',
        undefined,
        { not: 'Arke kaynar suda ve tuz gölünde yaşar, hücre duvarında peptidoglikan yok; bu yüzden bakteriden ayrı domain.' },
      ),
      kart(
        'Protistler',
        'Çoğunlukla tek hücreli ökaryotlardır.\nÖrnek: amip, öglena, terliksi hayvan',
      ),
      kart(
        'Mantarlar',
        'Hazır beslenir ve dış sindirim yapar: enzimini dışarı salar, çözdüğünü emer.\nHücre duvarı **kitindir**.',
      ),
      kart(
        'Bitkiler',
        'Fotosentezle kendi besinini üretir.\nHücre duvarı **selülozdur**; yerleşik yaşarlar.',
      ),
      kart(
        'Hayvanlar',
        'Hazır beslenir ve hareket eder; çoğunun sinir sistemi vardır.\nHücre duvarları yoktur.',
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
        '- Gen çeşitliliği\n- Tür çeşitliliği\n- Ekosistem çeşitliliği',
      ),
      kart(
        'Neden önemli?',
        'Çeşitlilik ekosistemi dayanıklı kılar.\nTek çeşit üretim, bir hastalıkla bütünüyle yok olabilir.',
      ),
      kart(
        'Gen çeşitliliği',
        'Aynı türün bireyleri arasındaki farklılıktır.\nBir hastalığa direnç çoğu zaman bu farklılıkta saklıdır.',
        undefined,
        { not: '1845\'te İrlanda\'da tek çeşit patates: bir mantar hepsini vurdu, kıtlık. Gen çeşitliliği sigortadır.' },
      ),
      kart(
        'Endemik tür',
        'Yalnızca belirli bir bölgede yaşayan türdür.\nOrada kaybedilirse dünyadan tümüyle silinir.',
      ),
      kart(
        'Türkiye’nin durumu',
        'Türkiye üç bitki coğrafyası bölgesinin kesiştiği yerdedir.\nBu yüzden tür sayısı bütün Avrupa’nınkine yakındır.\nBitki türlerinin yaklaşık üçte biri endemiktir.',
      ),
      kart(
        'Tehditler',
        '- Habitat kaybı\n- Aşırı avlanma\n- Kirlilik\n- İstilacı türler\n- İklim değişikliği',
      ),
      kart(
        'Koruma yolları',
        '- Millî park ve koruma alanları\n- Tohum bankaları\n- Avlanma sınırları\n- Türlerin doğaya yeniden kazandırılması',
      ),
    ], [
      soru('Endemik tür, yalnızca belirli bir bölgede doğal olarak yaşayan türdür.', true, 'Başka yerde bulunmadığı için yok olması geri dönülmez.'),
      soru('Biyoçeşitlilik gen, tür ve ekosistem düzeylerinde incelenir.', true, 'Aynı türün içindeki gen farkları da çeşitliliğin parçası.'),
      soru('Türkiye biyoçeşitlilik bakımından Avrupa nın en fakir ülkelerindendir.', false, 'Farklı iklim ve bitki bölgeleri sayesinde en zengin ülkelerinden biri.'),
      soru('Bir türün yok olması ekosistemin işleyişini etkilemez.', false, 'Besin ağındaki her tür başka türlere bağlı; kopan halka zinciri etkiliyor.'),
      sikli('Aynı türün bireyleri arasındaki farklılık?', ['Ekosistem çeşitliliği', 'Gen çeşitliliği'], 1, 'Hastalığa direnç burada saklı.'),
      sikli('Türkiye\'de bitki türlerinin yaklaşık ne kadarı endemiktir?', ['Üçte biri', 'Yüzde biri'], 0, 'Üç bitki bölgesinin kesişimi, çok sayıda yerel tür doğurmuş.'),
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
