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
        'Biyoloji canlıları ve yaşamı inceler',
        'Kedi karanlıkta nasıl görür, yaprak neden yeşil, bakteri nasıl çoğalır? Hepsi biyolojinin sorusu. Biyoloji, yani canlıları ve yaşam olaylarını inceleyen bilim. Yalnızca hayvanlar değil; bitki, mantar ve bakteri de konusu.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yaşam küçükten büyüğe basamaklıdır',
        'Vücudunda önce moleküller var; moleküller hücreyi kurar. Hücreler dokuyu, dokular organı, organlar seni, yani organizmayı kurar. Organizmalar bir arada ekosistemi oluşturur. Her basamak bir öncekinin üstüne kurulur.',
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
        { not: 'Sıra sorulursa şunu düşün: hangisi ötekinin içinde? Molekül hücrenin, hücre dokunun içinde. Küçük olan önce gelir.' },
      ),
      kart(
        'Aşı ve antibiyotik biyolojiden çıktı',
        'Çocukken vurulduğun aşılar, boğaz iltihabında içtiğin antibiyotik, böbrek nakli: hepsi biyoloji bilgisinin sağlığa katkısı. Yüz yıl önce insanlar ortalama 40 yıl yaşıyordu; bugün bu süre iki katına yakın.',
      ),
      kart(
        'Bol ürün veren tohumu biyoloji üretti',
        'Dedenin zamanında bir tarla bugünün yarısı kadar buğday verirdi. Hastalığa dayanıklı ve bol ürün veren tohumlar biyoloji sayesinde geliştirildi. Tarımdaki verim artışının arkasında biyoloji var.',
      ),
      kart(
        'Biyoteknoloji: canlıya iş yaptırmak',
        'Şeker hastaları insülin iğnesi yapar. Bu insülini bakteriler üretiyor: insan geni bakteriye aktarıldı, bakteri fabrika gibi çalışıyor. Biyoteknoloji, yani canlıları ya da parçalarını üretimde kullanmak. Yoğurt mayası da bir örnek.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Bir türün kaybı bütün ağı sarsar',
        'Bir gölden kurbağaları çekersen sivrisinekler çoğalır, sivrisinekle beslenen kuşlar azalır. Ekosistem, yani bir yerdeki canlılar ve çevrelerinin kurduğu ağ. Bu bilgiyle millî parklar ve koruma yasaları doğdu.',
      ),
    ], [
      soru('Organizasyon düzeyleri küçükten büyüğe hücre, doku, organ, organizma diye sıralanır.', true, 'Her düzey bir öncekinden kuruluyor.'),
      soru('Biyoteknoloji, canlıların ya da onlara ait parçaların ürün elde etmek için kullanılmasıdır.', true, 'Yoğurt mayasından insülin üretimine kadar geniş bir alan.'),
      soru('Biyoloji yalnızca hayvanları inceleyen bilim dalıdır.', false, 'Bitkiler, mantarlar, bakteriler ve virüsler de biyolojinin konusu.'),
      soru('Tarımdaki verim artışının biyolojiyle bir ilgisi yoktur.', false, 'Dayanıklı ve bol ürün veren tohumlar biyoloji bilgisiyle geliştirildi.'),
      sikli('Aşı ve antibiyotik biyolojinin hangi alana katkısıdır?', ['Tarım', 'Sağlık'], 1, 'Ortalama ömür bir yüzyılda ikiye katlandı.'),
      sikli('Bir türün kaybının bütün ağı etkilediğini gösteren kavram?', ['Biyoteknoloji', 'Ekosistem'], 1, 'Koruma yasaları bu bilgiden doğdu.'),
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
        'Mikroskop hücreyi görünür kıldı',
        '1665\'te Hooke bir şişe mantarı parçasına mikroskopla baktı. Küçük odacıklar gördü ve onlara "hücre" dedi. Leeuwenhoek ise bir su damlasında kıpırdayan küçük canlıları, yani mikroorganizmaları ilk gören kişi.',
      ),
      kart(
        'Her canlı hücrelerden kurulur',
        'Bir fil de bir bakteri de hücrelerden yapılmış. Hücre teorisi üç cümle söyler: Bütün canlılar hücrelerden oluşur. Hücre, yaşamın en küçük birimidir. Her hücre başka bir hücrenin bölünmesiyle oluşur; çamurdan hücre çıkmaz.',
        undefined,
        { not: 'Üç cümlenin üçü de ayrı ayrı soruluyor; özellikle "her hücre başka hücreden gelir" cümlesini atlama.' },
      ),
      kart(
        'Darwin: türler zamanla değişir',
        'Uzun boyunlu zürafalar yüksek dallara ulaşıp yaşadı, kısa boyunlular aç kaldı. Nesiller sonra sürü uzun boyunlu oldu. Darwin buna doğal seçilim dedi: ortama uyan yaşar ve çoğalır. Türün böyle değişmesine evrim denir.',
      ),
      kart(
        'Mendel bezelyeyle kalıtımı çözdü',
        'Mendel sarı bezelyeyle yeşil bezelyeyi çaprazladı, yani tozlaştırdı. Torun kuşakta hep 3 sarıya 1 yeşil çıktı. Kalıtım, yani özelliklerin anne babadan çocuğa geçişi, belirli oranlarla işliyordu. Genetik böyle doğdu.',
      ),
      kart(
        'DNA bükülmüş bir merdivene benzer',
        '1953\'te Watson ve Crick, Franklin\'in çektiği görüntülerle DNA\'nın şeklini çözdü: iki iplik birbirine sarılmış, bükülmüş bir merdiven gibi. Buna çift sarmal denir. Kalıtımın nasıl kopyalandığı bu şekilden anlaşıldı.',
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
        'Antibiyotik bir kazayla bulundu',
        '1928\'de Fleming bakteri yetiştirdiği kabı açık unuttu. Kaba küf düştü ve küfün çevresindeki bakteriler öldü. Küfün ürettiği madde penisilin, yani ilk antibiyotik. Antibiyotik bakteriyi öldürür; virüse etki etmez, gribe içilmez.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Genom okundu, tedavi kişiye özel oldu',
        '2003\'te insanın bütün DNA\'sı, yani genomu harf harf okundu. Artık bir hastalığın hangi gende olduğu bulunabiliyor. Doktor ilacı senin genine göre seçebiliyor; buna kişiye özgü tedavi denir.',
      ),
    ], [
      soru('Hücre teorisi, bütün canlıların hücrelerden oluştuğunu söyler.', true, 'Ayrıca her hücrenin kendinden önceki bir hücreden oluştuğunu da belirtir.'),
      soru('DNA nın çift sarmal yapısını Mendel açıklamıştır.', false, 'Yapıyı Watson ve Crick açıkladı; Mendel kalıtımın kurallarını buldu.'),
      soru('Mikroskobun icadı hücrenin görülmesini ve incelenmesini sağladı.', true, 'Hücre kavramı ancak mikroskopla ortaya çıkabildi.'),
      soru('Antibiyotikler virüslere karşı geliştirilmiş ilaçlardır.', false, 'Antibiyotikler bakterilere etki eder; virüslere karşı etkisizdir.'),
      sikli('Mantar kesitinde odacıklar görüp "hücre" diyen kimdir?', ['Leeuwenhoek', 'Hooke'], 1, 'Leeuwenhoek ilk mikroorganizmaları gözledi.'),
      sikli('Bezelyelerle kalıtımın oranlarını gösteren kimdir?', ['Darwin', 'Mendel'], 1, 'Genetik böyle doğdu.'),
      sikli('DNA çift sarmalı hangi yılda çözüldü?', ['1859', '1953'], 1, 'Watson, Crick ve Franklin.'),
      soru('Antibiyotik planlı bir araştırmayla bulunmuştur.', false, 'Fleming\'in açık unuttuğu kaba düşen küf; bir kaza.'),
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
        'Bilimsel bilgi yeni kanıtla değişir',
        'Eskiden mide ülserinin sebebi stres sanılıyordu. 1980\'lerde bir bakterinin ülser yaptığı kanıtlandı ve ders kitapları değişti. Bilim yanlışını kanıt gelince düzeltir. Bu zayıflık değil, bilimi güçlü yapan şey.',
      ),
      kart(
        'İddia kanıt ister, unvan değil',
        'Ünlü bir profesör "bu bitki kanseri iyileştirir" dese bile bu bilimsel bilgi olmaz. Deney yapılmalı, sonuç ölçülmeli. Bilimde iddia gözlem ve deneyle desteklenir; kimin söylediği değil, kanıt önemli.',
      ),
      kart(
        'Hipotez sınanmayı bekleyen tahmindir',
        'Bitkin sararınca "az su verdim galiba" dersin. Bu bir hipotez, yani sınanabilir bir tahmin. Suyu artırıp bakarsın: yeşerirse hipotez desteklenir, sararmaya devam ederse çürür. Hipotez henüz kanıtlanmış bir şey değil.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Teori, defalarca sınanmış açıklamadır',
        'Hücre teorisi yüzlerce yıldır her mikroskop görüntüsüyle sınandı ve hiç çürümedi. Bilimde teori, çok kez sınanmış ve geniş bir alanı açıklayan sistemdir. Günlük dildeki "bence şöyle" anlamındaki teori değil.',
        undefined,
        { not: '"Sadece bir teori" cümlesini duyunca dur: bilimde teori en güçlü açıklama, tahmin değil.' },
      ),
      kart(
        'Yasa ne olduğunu, teori nedenini söyler',
        'Bıraktığın kalem yere düşer: bu bir yasa, yani her zaman ne olduğunu söyleyen kural. Neden düştüğünü kütle çekim teorisi açıklar. Teori zamanla yasaya dönüşmez; ikisi ayrı işler yapar.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne yapar?', 'Örnek'],
          satirlar: [
            ['Hipotez', 'Sınanmayı bekler', '"Az su verdim"'],
            ['Yasa', 'Ne olduğunu söyler', 'Kalem düşer'],
            ['Teori', 'Nedenini açıklar', 'Kütle çekimi'],
          ],
        },
      ),
      kart(
        'Çürütülemeyen iddia bilim değildir',
        'Biri "bahçemde görünmez bir ejderha var, hiçbir alet onu bulamaz" dese bunu asla sınayamazsın. Bilimsel iddia yanlışlanabilir olmalı: onu çürütebilecek bir gözlem düşünülebilmeli. Yanlışlanabilirlik, yani çürütmeye açık olma.',
      ),
      kart(
        'Makale önce hakemden geçer',
        'Bir bilim insanı sonucunu yazar ve dergiye gönderir. Dergi bunu alandan iki üç uzmana okutur; hata varsa geri yollar. Buna hakem değerlendirmesi denir. Yayımlanmadan önce yapılır; hatanın ilk süzgeci.',
      ),
    ], [
      soru('Bilimsel bilgi, yeni kanıtlar karşısında değişebilir.', true, 'Değişebilir olması zayıflığı değil, kanıta bağlı olmasının sonucu.'),
      soru('Bilimsel bir hipotezin yanlışlanabilir olması gerekir.', true, 'Hiçbir gözlemin çürütemeyeceği bir iddia bilimsel olarak sınanamaz.'),
      soru('Bir teori, yeterince kanıt toplayınca yasaya dönüşür.', false, 'Yasa neyin olduğunu tanımlar, teori niçin olduğunu açıklar; ikisi ayrı işler.'),
      soru('Hakem değerlendirmesinden geçmemiş bir iddia da bilimsel bilgi sayılır.', false, 'Yayımlanmadan önce alanın uzmanlarınca denetlenmesi sürecin parçası.'),
      sikli('Hiçbir gözlemle çürütülemeyen iddia için ne söylenir?', ['Kesin doğrudur', 'Bilim dışıdır'], 1, 'Yanlışlanabilirlik şart.'),
      sikli('Yasa ne yapar?', ['Nedenini açıklar', 'Neyin olduğunu tarif eder'], 1, 'Nedeni teori açıklar.'),
      soru('Hakem değerlendirmesi çalışma yayımlandıktan sonra yapılır.', false, 'Yayımlanmadan önce; hatanın ilk süzgeci.'),
      soru('Hipotez, kanıtlanmış kesin bir bilgidir.', false, 'Hipotez sınanmayı bekleyen tahmin; kanıtlanmış değil.'),
    ], [
      {
        soru: 'Bilimde "teori" ne demektir?',
        siklar: ['Henüz kanıtlanmamış tahmin', 'Çok kez sınanmış geniş açıklama'],
        dogru: 1,
        aciklama: {
          dogru: 'Teori defalarca sınanmış açıklama sistemi; "sadece bir teori" deyişi bilimdeki anlamı taşımaz.',
          yanlis: 'Kanıtlanmamış tahmin hipotezdir. Teori ise onlarca sınamadan geçmiş, geniş kapsamlı bir açıklama.',
        },
        kart: 4,
      },
    ]),
    konu('byl9-arastirma', 'Bilimsel Araştırma Süreçleri', [
      kart(
        'Araştırma gözlemle başlar, soruyla sürer',
        'Pencere kenarındaki bitkin öbüründen uzun; bu bir gözlem. "Işık bitkiyi uzatır mı?" bu bir soru. Sonra tahmin (hipotez), deney, ölçüm ve sonuç gelir. Sonuç çoğu zaman yeni bir soru doğurur; süreç bir döngü.',
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
        'Bağımsız değişken senin değiştirdiğin',
        'Bitkilere farklı miktarda ışık veriyorsun: ışık bağımsız değişken, yani senin bilerek değiştirdiğin şey. Ölçtüğün boy bağımlı değişken; ışığa bağlı değişiyor. Su, toprak, sıcaklık sabit kalır: kontrol değişkenleri.',
        undefined,
        { not: 'Deney sorusunda ilk iş: "Ne değiştirildi, ne ölçüldü, ne sabit?" Üçünü adlandırmadan şıklara bakma.' },
      ),
      kart(
        'Tek seferde tek şeyi değiştir',
        'Hem ışığı hem suyu aynı anda artırırsan bitki uzayınca sebebini bilemezsin: ışık mı, su mu? Bir deneyde tek bağımsız değişken değişir, gerisi sabit tutulur. Sık hata: iki şeyi birden değiştirip sonucu birine bağlamak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Kontrol grubu karşılaştırma ölçüsüdür',
        'Bir saksıya gübre verdin, bitki 20 cm oldu. İyi mi? Bilemezsin; gübresiz bir saksı lazım. Gübresiz saksı kontrol grubu, yani denenen etkiyi almayan grup. Onsuz değişimin sebebi gübre mi, mevsim mi anlaşılmaz.',
      ),
      kart(
        'Plasebo: etkisiz hap, gerçek beklenti',
        'Baş ağrılılara şekerden hap veriyorsun, yarısı "geçti" diyor. Bu plasebo etkisi: iyileşeceğine inanmak bile sonucu değiştirir. O yüzden ilaç denemesinde bir grup etkisiz hap, yani plasebo alır; gerçek ilaç onunla karşılaştırılır.',
      ),
      kart(
        'Üç kişiyle deney sonuç vermez',
        'İlacı yalnızca üç kişide denedin, ikisi iyileşti. Şans da olabilir. Örneklem, yani deneye alınan grup, yeterince büyük ve karışık olmalı. Sadece gençleri seçersen sonuç yaşlılar için geçerli olmaz; buna taraflı örneklem denir.',
      ),
      kart(
        'Başkası tekrarlayamıyorsa sonuç sayılmaz',
        'Bir deneyde şaşırtıcı bir sonuç aldın. Başka bir ekip aynı koşullarda deneyi yapıp aynı sonucu almalı. Alamıyorsa hata ya da şans olabilir; sonuç kabul edilmez. Buna tekrarlanabilirlik denir.',
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
        'Veriyi uydurmak en ağır ihlaldir',
        'Deneyi 10 kez yaptın, 7\'sinde ilaç işe yaramadı. Yalnızca işe yarayan 3\'ünü yazarsan bu veri gizlemek. Hiç deney yapmadan sayı yazmak ise veri uydurmak. İkisi de etik ihlal; ortaya çıkınca makale geri çekilir.',
      ),
      kart(
        'Alıntı serbest, sahiplenmek aşırma',
        'Ödevine internetten bir paragrafı kaynağını yazmadan koyarsan bu aşırma, yani intihal. Aynı paragrafı "Kaynak: …" diye belirtirsen alıntı olur ve serbesttir. Fark tek şey: emeğin sahibini söylemek.',
      ),
      kart(
        'Denek riskleri bilerek evet demeli',
        'Yeni bir ilacı insanda deneyeceksin. Katılacak kişiye yan etkileri anlatırsın, yazılı onayını alırsın, istediği an çıkabileceğini söylersin. Buna aydınlatılmış onam denir: bilerek ve gönüllü kabul. Onamsız insan deneyi yapılmaz.',
      ),
      kart(
        'Hayvan deneyi izinle ve en az sayıyla',
        'Fareyle deney yapacaksan önce etik kurul onayı gerekir. Üç kural: kullanılan hayvan sayısı en aza indirilir, acı azaltılır, hücre kültürü gibi bir alternatif varsa o seçilir.',
      ),
      kart(
        'Araştırmayı kimin ödediği yazılmalı',
        'Bir şeker şirketi "şeker zararsızdır" diyen bir araştırmaya para ödemiş olsun. Sonuç doğru olabilir ama okuyan bunu bilmeli. Buna çıkar çatışması denir: sonuçtan kazancı olanın bunu açıkça bildirmesi zorunlu.',
        undefined,
        { not: 'Bir araştırma sonucunu okurken yanına "kim ödedi" sorusunu koy; cevap gizliyse şüphelen.' },
      ),
      kart(
        'Genetik verin sadece sana ait değil',
        'DNA testin yalnızca seni değil anneni, kardeşini de anlatır; çünkü genleriniz ortak. Bu yüzden genetik veri kimliği açık edecek biçimde paylaşılamaz. Araştırmalarda isimler silinir, veri şifrelenir.',
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
        'Her canlı hücreden yapılmıştır',
        'Sen yaklaşık 30 trilyon hücresin; bir bakteri tek bir hücre. Canlıların ilk ortak özelliği hücresel yapı: hücresiz canlı yok. Virüsün hücresi yok; o yüzden canlı sayılıp sayılmayacağı tartışmalı.',
      ),
      kart(
        'Besinini ya üretirsin ya bulursun',
        'Bir elma ağacı güneş ışığıyla kendi şekerini yapar: ototrof, yani kendi besinini üreten. Sen elmayı yersin: heterotrof, yani besini dışarıdan alan. Her canlı beslenir; fark besini nereden bulduğu.',
      ),
      kart(
        'Solunum besindeki enerjiyi açığa çıkarır',
        'Yediğin ekmek doğrudan enerji vermez; hücre onu parçalar ve enerjiyi ATP adlı moleküle yükler. ATP, yani hücrenin enerji parası. Bu işe hücresel solunum denir ve her canlıda olur; bitkide de.',
      ),
      kart(
        'Metabolizma yapım ve yıkımın toplamıdır',
        'Kas proteini yaparken küçük amino asitleri birleştirirsin: yapım, yani anabolizma. Şekeri parçalayıp enerji alırken: yıkım, yani katabolizma. Hücredeki bütün bu tepkimelerin toplamı metabolizma.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Vücut iç dengesini sabit tutar',
        'Dışarısı 40 derece de olsa −10 da olsa vücudun 36,5\'te kalır; terlersin ya da titrersin. Buna homeostazi denir: iç ortamı dengede tutmak. Kan şekerinin sabit kalması da homeostazi.',
      ),
      kart(
        'Canlı uyarana tepki verir',
        'Elini sobaya değdirince çekersin. Pencerede duran bitki güneşe doğru eğilir. İkisi de uyarana tepki: çevredeki değişimi algılayıp karşılık vermek. Bitkinin tepkisi yavaş ama var.',
      ),
      kart(
        'Metabolizma artıkları dışarı atılır',
        'Hücre çalışınca çöp çıkar: karbondioksit, üre gibi. Nefes verirken CO₂ atarsın, idrarla üreyi. Buna boşaltım denir: metabolizma artıklarını dışarı atmak. Sindirilmemiş besinin dışkıyla atılması boşaltım değil.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Canlı büyür ve çoğalır',
        'Bir fasulye tohumu filiz verir, boy atar: büyüme. Ergin bitki tohum yapar, yeni bitkiler çıkar: üreme. Bakteri ikiye bölünerek çoğalır. Bireyin yaşaması için üreme şart değil, türün sürmesi için şart.',
      ),
      kart(
        'Aynı türde küçük farklar uyum sağlar',
        'Aynı sürüdeki tavşanların kürkü biraz açık, biraz koyu: buna varyasyon denir, yani tür içi farklılık. Karlı yerde açık renkli olan saklanır ve yaşar. Ortama uygun özelliğin yerleşmesine adaptasyon, yani uyum denir.',
      ),
      kart(
        'Virüs canlı ile cansızın sınırında',
        'Virüsün DNA\'sı ya da RNA\'sı var ve çoğalabiliyor; bu canlı gibi. Ama hücresi yok, kendi başına beslenmiyor, solunum yapmıyor. Ancak bir hücrenin içine girince çoğalıyor. Dışarıda cansız bir taneciğe benziyor.',
        undefined,
        { not: 'Virüs sorusunda listeyi tek tek dene: hücre var mı, yok. Solunum var mı, yok. Takıldığı yer cevabın.' },
      ),
      kart(
        'Hücreden organizmaya sıra vardır',
        'Kas hücreleri kas dokusunu, kas dokusu kalbi (organ), kalp damarlarla dolaşım sistemini kurar. Sistemler seni, yani organizmayı oluşturur. Buna organizasyon denir; her canlıda düzenli bir yapı var.',
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
      sikli('Nefes verirken CO₂ atman hangi ortak özelliktir?', ['Boşaltım', 'Beslenme'], 0, 'Metabolizma artığını dışarı atmak boşaltım.'),
      soru('Bakterinin ikiye bölünerek çoğalması üremedir.', true, 'Tek hücreli de ürer; bölünme onun üreme yolu.'),
    ], [
      {
        soru: 'Vücut sıcaklığının sabit tutulması hangi ortak özelliktir?',
        siklar: ['Homeostazi', 'Metabolizma'],
        dogru: 0,
        aciklama: {
          dogru: 'İç ortamı dengede tutmak homeostazinin tanımı.',
          yanlis: 'Metabolizma yapım-yıkım tepkimelerinin tamamı. İç dengenin korunması ayrı bir özellik: homeostazi.',
        },
        kart: 5,
      },
      {
        soru: 'Virüs canlıların hangi ortak özelliğini taşımaz?',
        siklar: ['Kalıtım maddesi', 'Hücresel yapı'],
        dogru: 1,
        aciklama: {
          dogru: 'Virüsün DNA ya da RNA\'sı var ama hücresi yok; tartışma bu yüzden.',
          yanlis: 'Virüsün kalıtım maddesi var, DNA ya da RNA taşır. Eksik olan hücre: virüs hücresiz bir tanecik.',
        },
        kart: 10,
      },
    ]),
    konu('byl9-inorganik', 'İnorganik Moleküller', [
      kart(
        'İnorganik madde dışarıdan alınır',
        'Su içersin, tuz yersin; vücudun bunları üretemez, dışarıdan alır. Böyle moleküllere inorganik denir: su, mineral, asit, baz, tuz. Enerji vermez ve sindirilmezler; oldukları gibi kullanılırlar. Şeker ve protein ise organik.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Su çoğu şeyi çözer',
        'Şekeri suya at, kaybolur; yağı at, üstte kalır. Su molekülünün bir ucu hafif artı, öteki hafif eksi yüklü; buna polar denir. Bu yüzden yüklü maddeleri çözer. Hücrede tepkimeler suda olur, besin ve atık suyla taşınır.',
      ),
      kart(
        'Su suya yapışır, yüzeye yapışır',
        'Bardağı biraz taşır doldur, su dökülmeden kabarır: su molekülleri birbirini tutar, buna kohezyon denir. Suyun cam yüzeye yapışması adezyon: başka yüzeye tutunma. Ağaçta su bu ikisiyle kökten yaprağa tırmanır.',
      ),
      kart(
        'Su geç ısınır, geç soğur',
        'Yazın deniz öğlen bile kumdan serin; akşam kum soğur, deniz ılık kalır. Suyun öz ısısı yüksek: ısınması için çok ısı gerekir. Vücudunun büyük kısmı su olduğu için sıcaklığın güneşte bir anda fırlamaz.',
      ),
      kart(
        'Mineral yapıya girer, enerji vermez',
        'Kemiğindeki kalsiyum, kanındaki demir birer mineral. Kalsiyum kemiği kurar, demir oksijeni taşıyan hemoglobine girer. Mineraller yapıya katılır ve tepkimeleri düzenler; eksiğinde hastalık çıkar. Enerji vermezler.',
        {
          tur: 'tablo',
          basliklar: ['Mineral', 'Görevi', 'Eksikliğinde'],
          satirlar: [
            ['Kalsiyum', 'Kemik ve kas', 'Kemik erimesi'],
            ['Demir', 'Hemoglobin', 'Kansızlık'],
            ['İyot', 'Tiroit hormonu', 'Guatr'],
            ['Magnezyum', 'Klorofil, enzim', 'Kas krampı'],
          ],
        },
        { etiket: 'Sık hata' },
      ),
      kart(
        'pH 7 orta, altı asit, üstü baz',
        'Limon suyu pH 2: asidik. Sabun pH 9: bazik. Saf su pH 7: nötr, yani ne asit ne baz. pH, bir sıvının ne kadar asidik olduğunu 0–14 arası bir sayıyla söyler. Sayı küçüldükçe asit güçlenir.',
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
        'Asit H⁺ verir, baz H⁺ alır',
        'Mide sıvısı asidik: ortama H⁺, yani hidrojen iyonu bırakır. Safra bazik: OH⁻ verir ya da H⁺\'yı bağlar. Asit ve baz karışınca birbirini nötrler; mide asidi ince bağırsakta safrayla nötrlenir.',
      ),
      kart(
        'Kan pH\'ı 7,4\'te tutulur',
        'Kanın pH\'ı 7,4; küçük bir sapma bile hayati tehlike. Çünkü enzimler, yani tepkimeleri yürüten proteinler, dar bir pH dışında çalışmaz. Tampon sistemler fazla H⁺ ya da OH⁻\'yi bağlayıp pH\'ı sabit tutar.',
        undefined,
        { not: 'Tampon sorusu "neden dar aralık" diye gelirse aklına enzim gelsin: enzim dar pH dışında durur.' },
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
        kart: 8,
      },
    ]),
    konu('byl9-organik', 'Organik Moleküller', [
      kart(
        'Büyük molekül küçük tuğlalardan kurulur',
        'Bir duvar tuğlalardan kurulur; nişasta da yüzlerce glikozdan. Canlıdaki büyük organik moleküller dört grup ve her birinin kendi tuğlası, yani yapı birimi var. Organik: canlının ürettiği, karbon içeren molekül.',
        {
          tur: 'tablo',
          basliklar: ['Molekül', 'Yapı taşı', 'Örnek'],
          satirlar: [
            ['Karbonhidrat', 'Monosakkarit', 'Nişasta'],
            ['Lipit', 'Yağ asidi', 'Tereyağı'],
            ['Protein', 'Amino asit', 'Kas, enzim'],
            ['Nükleik asit', 'Nükleotit', 'DNA, RNA'],
          ],
        },
      ),
      kart(
        'Karbonhidrat en hızlı enerjidir',
        'Sınavdan önce yediğin çikolata seni hemen toparlar: karbonhidrat hızlı yakılır. En küçük birimi monosakkarit (glikoz). İkisi birleşince disakkarit (çay şekeri sükroz), yüzlercesi birleşince polisakkarit (nişasta).',
      ),
      kart(
        'Nişasta, glikojen ve selüloz hep glikoz',
        'Patatesteki nişasta, karaciğerindeki glikojen, kâğıttaki selüloz: üçü de glikoz zinciri, bağlanışları farklı. Bitki nişasta depolar, hayvan glikojen. Selüloz bitki hücresinin duvarı; insan onu sindiremez, lif olarak geçer.',
      ),
      kart(
        'Yağ en çok enerjiyi depolar',
        'Bir gram yağ, bir gram şekerin iki katından fazla enerji taşır; vücut fazla enerjiyi bu yüzden yağ olarak biriktirir. Lipit, yani yağ ve benzerleri. Suda çözünmezler; hücre zarını kurarlar, bazı hormonlar yağdan yapılır.',
      ),
      kart(
        'Enerji sırası: şeker, yağ, protein',
        'Koşarken vücudun önce karbonhidratı yakar; hızlı. Uzun sürerse yağa geçer; bol ama yavaş. Proteini en son yakar, çünkü protein yapı malzemesi. Sık hata: yağ "en çok enerji verir" diye ilk kullanılan sanmak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Protein amino asit zinciridir',
        'Kasın, saçın, tırnağın protein. Protein, amino asit denen 20 çeşit tuğlanın dizilmesiyle kurulur. Diziliş değişince protein değişir; harflerin sırası değişince kelimenin değişmesi gibi. Yapı, taşıma, savunma ve enzim işi görür.',
      ),
      kart(
        'Enzim tepkimeyi hızlandırır, tükenmez',
        'Ağzındaki amilaz enzimi ekmeği saniyeler içinde parçalamaya başlar; enzimsiz bu yıllar sürerdi. Enzim, tepkimeyi hızlandıran protein. Tepkimeye girip değişmeden çıkar, binlerce kez kullanılır. Tükenen substrat, enzim değil.',
      ),
      kart(
        'Enzim yalnızca kendi maddesine uyar',
        'Amilaz nişastayı parçalar ama proteine dokunmaz. Enzimin etkilediği maddeye substrat denir. Enzim ile substrat anahtar-kilit gibi uyar: her anahtar tek kilidi açar. Bu yüzden vücutta binlerce farklı enzim var.',
      ),
      kart(
        'Sıcaklık enzimi hızlandırır, sonra bozar',
        'Enzim 37 derecede en hızlı çalışır. 40\'ın üstünde hız aniden düşer, çünkü enzim protein ve ısı proteinin şeklini bozar; yumurta pişince katılaşır ya. Bozulan enzim substratına uymaz. pH da aynı: tepesi var, iki yanı düşüş.',
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
        { not: 'Grafiği tepeden ikiye böl: sola kadar artış, sağda düşüş. Düşüşün sebebi enzimin şeklinin bozulması.' },
      ),
      kart(
        'DNA bilgiyi taşır, RNA kullanır',
        'Hücrenin yapacağı her protein DNA\'da yazılı: DNA kalıtım bilgisini saklar. RNA bu yazının kopyasını alıp ribozoma götürür, protein orada yapılır. İkisi de nükleik asit; tuğlaları nükleotit.',
      ),
      kart(
        'Vitamin enerji vermez, düzenler',
        'C vitamini eksikse diş etin kanar; ama vitamin seni doyurmaz. Vitaminler enerji vermez, tepkimelerin düzenleyicisidir; çoğu enzime yardımcı olur. Az miktarda gerekirler ve çoğunu vücut üretemez.',
      ),
      kart(
        'Birleşirken su çıkar, ayrılırken su girer',
        'İki glikoz birleşip sükroz olurken aradan bir su molekülü çıkar: dehidrasyon, yani su çıkarma. Sindirimde sükroz suyla parçalanıp iki glikoza döner: hidroliz, yani suyla parçalama. Yapmak su verir, yıkmak su alır.',
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
      soru('Vücut enerji için önce karbonhidratı, en son proteini kullanır.', true, 'Sıra: karbonhidrat, yağ, protein.'),
    ], [
      {
        soru: 'Enzim tepkimeden sonra ne olur?',
        siklar: ['Değişmeden çıkar, tekrar kullanılır', 'Tepkimede tükenir'],
        dogru: 0,
        aciklama: {
          dogru: 'Enzim katalizör; tepkimeye girer, hızlandırır ve olduğu gibi çıkar.',
          yanlis: 'Tükenen substrat. Enzim tepkimeden değişmeden çıkar ve aynı enzim binlerce tepkimeyi art arda hızlandırır.',
        },
        kart: 7,
      },
      {
        soru: 'Yüksek sıcaklıkta enzim hızının düşmesinin sebebi?',
        siklar: ['Protein yapısı bozulur', 'Substrat tükenir'],
        dogru: 0,
        aciklama: {
          dogru: 'Enzim proteindir; belli sıcaklığın üstünde şekli bozulur ve substratına uyamaz.',
          yanlis: 'Substrat sıcaklıkla tükenmez. Isı enzimin üç boyutlu şeklini bozar; şekli bozulan enzim çalışmaz.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('byl9-t2', 'Organizasyon', [
    konu('byl9-hucre-tur', 'Prokaryot ve Ökaryot Hücre', [
      kart(
        'Prokaryotta DNA ortada serbest durur',
        'Bakteri hücresine bak: DNA\'sı sitoplazmanın ortasında çıplak duruyor, çevresinde zar yok. Buna prokaryot denir: zarla çevrili çekirdeği ve zarlı organeli olmayan hücre. Organel, yani hücre içinde belli bir işi yapan yapı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Ökaryotta DNA çekirdeğin içindedir',
        'Senin hücrelerinde DNA, zarla çevrili bir odada durur: çekirdek. Ayrıca mitokondri gibi zarlı organeller var. Buna ökaryot denir: gerçek çekirdekli hücre. Protist, mantar, bitki ve hayvan hücreleri ökaryot.',
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
        'Bakteri ve arke prokaryottur',
        'Yoğurttaki bakteri, kaplıcadaki arke: ikisi de prokaryot ve tek hücreli. DNA\'ları halka biçimli, ribozomları ökaryotunkinden küçük. Ribozom, yani protein üreten küçük yapı. Prokaryot küçük, ökaryot çok daha büyük.',
      ),
      kart(
        'Bölme, işlerin karışmasını önler',
        'Mutfakta yemek pişerken banyoda çamaşır yıkanır; odalar ayrı olduğu için karışmaz. Ökaryot hücre de bölmeli: lizozomda parçalama, mitokondride enerji üretimi aynı anda yürür. Zarlar bölmeleri ayırır.',
        undefined,
        { not: 'Ökaryotun farkı iki şey: zarlı çekirdek ve zarlı organeller. Sınav ikisini de sayıyor, yalnız çekirdeği değil.' },
      ),
      kart(
        'Bitkide duvar ve kloroplast var',
        'Bitki hücresinin dışında sert bir duvar var, içinde yeşil kloroplast ve büyük bir koful, yani su dolu kese. Hayvan hücresinde bunlar yok; onun yerine bölünmede iş gören sentrozom var. İkisi de ökaryot.',
      ),
      kart(
        'Dört şey her hücrede var',
        'Bakteri de senin hücren de dört şey taşır: dışarıdan ayıran hücre zarı, içini dolduran sitoplazma, protein yapan ribozom ve bilgiyi taşıyan DNA. Bu dördü yaşamın en az donanımı. Çekirdek bu listede yok.',
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
        'Zar iki sıra yağ molekülünden kurulur',
        'Hücre zarı sabun köpüğü gibi ince bir tabaka. Malzemesi fosfolipit, yani bir başı ve iki kuyruğu olan yağ molekülü. Fosfolipitler iki sıra hâlinde dizilir; aralarına protein, kolesterol ve şeker zincirleri gömülüdür.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Kuyruklar sudan kaçar, başlar suya döner',
        'Fosfolipitin başı suyu sever, kuyrukları sudan kaçar. Hücrenin içi de dışı da sulu. Bu yüzden kuyruklar birbirine dönük, başlar dışa bakar: çift kat kendiliğinden kurulur. Kimse dizmez, su dizer.',
        undefined,
        { not: 'Zarın yapısı sorulunca şunu çiz: başlar dışta, kuyruklar içte. Çizdiğinde çift kat kendiliğinden çıkar.' },
      ),
      kart(
        'Zar akışkandır, proteinler yüzer',
        'Zarı buzda kaymaya değil, yağda yüzmeye benzet: fosfolipitler yer değiştirir, proteinler aralarında yüzer. Buna akıcı mozaik model denir; mozaik, çünkü farklı parçalardan kurulu. Zar bu yüzden esner ve yırtılınca onarılır.',
      ),
      kart(
        'Zar proteinleri kapı ve anten görevinde',
        'Bazı proteinler kanal: su ve iyon oradan geçer. Bazıları taşıyıcı: glikozu tutup içeri alır. Bazıları alıcı: hormon yapışınca hücreye haber verir. Hücre dışarıyla bu proteinlerle konuşur.',
      ),
      kart(
        'Zar herkesi içeri almaz',
        'Oksijen küçük ve yağda çözünür; zardan doğrudan geçer. Glikoz büyük; taşıyıcı protein ister. Sodyum iyonu yüklü; kanal ister. Zar neyin gireceğini seçer: buna seçici geçirgenlik denir.',
      ),
      kart(
        'Hücre duvarı zarın dışında ayrı bir kat',
        'Bitki, mantar ve bakteri hücresinde zarın dışında bir de sert duvar var. Duvar cansız ve tam geçirgen: seçmez, her şey geçer. Seçen zardır. Hayvan hücresinde duvar yok. Sık hata: duvarı seçici sanmak.',
        undefined,
        { etiket: 'Sık hata' },
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
        'Sitoplazma zar ile çekirdek arasıdır',
        'Bir yumurtayı düşün: kabuk zar, sarısı çekirdek, beyazı sitoplazma. Sitoplazma, zar ile çekirdek arasını dolduran her şey: sıvı kısım (sitozol) ve içinde yüzen organeller.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Sitoplazmanın çoğu sudur',
        'Sitoplazmanın büyük kısmı su; içinde protein, tuz, enzim ve besin çözünmüş. Kıvamı jöle gibi. Neden su? İki molekül tepkimeye girmek için birbirini bulmalı; su içinde hareket edip bulurlar. Kuru ortamda tepkime olmaz.',
      ),
      kart(
        'Tepkimelerin çoğu burada olur',
        'Yediğin şekerin parçalanmaya başladığı yer sitoplazma; protein de burada, ribozomda yapılır. Hücrenin kimyasal işlerinin çoğu sitoplazmada yürür. Organeller de bu ortamın içinde durur.',
      ),
      kart(
        'Sitoplazma organelleri ve maddeyi taşır',
        'Sitoplazma organellerin yüzdüğü ortam; besin, enzim ve atık bu sıvıyla hücrenin bir ucundan öbürüne dağılır. Ayrıca hücreye dolgunluk verir. Cansız bir sıvı değil; canlı bir ortam.',
      ),
      kart(
        'Bitkide sitoplazma döner',
        'Mikroskopta bir yaprak hücresine bak: yeşil kloroplastlar sitoplazmayla birlikte döner. Buna sitoplazma hareketi denir. Dolaşan sıvı maddeleri hücrede daha hızlı dağıtır.',
      ),
      kart(
        'Glikoliz sitozolde olur',
        'Glikozun parçalanmasının ilk adımı glikoliz; mitokondride değil, sitozolde, yani sıvı kısımda olur. Protein sentezi ribozomda. Sınav "sitoplazmada mı, organelde mi" diye ayırır.',
        undefined,
        { not: '"Sitoplazmada olur" cümlesini duyunca sor: sıvıda mı, içindeki bir organelde mi? Glikoliz sıvıda.' },
      ),
    ], [
      soru('Sitoplazmanın büyük bölümü sudur.', true, 'Tepkimelerin geçtiği ortamın çözücüsü su.'),
      soru('Hücredeki tepkimelerin çoğu sitoplazmada gerçekleşir.', true, 'Organeller de bu ortamın içinde duruyor.'),
      soru('Sitoplazma, organelleri taşıyan cansız bir sıvıdır.', false, 'Canlı bir ortam: tepkimeler orada yürüyor ve kendisi de hareket ediyor.'),
      soru('Sitoplazma hareketi yalnızca hayvan hücrelerinde görülür.', false, 'Bitki hücrelerinde görülür; madde dağılımını hızlandırıyor.'),
      sikli('Solunumun ilk basamağı olan glikoliz nerede olur?', ['Çekirdekte', 'Sitoplazmada'], 1, 'Sitozolde yürür.'),
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
        kart: 2,
      },
    ]),
    konu('byl9-sitoplazmik', 'Sitoplazmik Yapılar', [
      kart(
        'Zarsız yapılar organel sayılmayabilir',
        'Mitokondrinin çevresinde zar var; ribozomun çevresinde yok. Ribozom, sentrozom ve sitoiskelet zarsız. Bazı kitaplar zarsız olanlara organel demez, "sitoplazmik yapı" der. İkisini de duyabilirsin.',
      ),
      kart(
        'Ribozom protein fabrikasıdır',
        'Hücrenin her proteini ribozomda yapılır: amino asitler burada zincire dizilir. Ribozom hem bakteride hem senin hücrende var; prokaryot ve ökaryotun tek ortak yapısı. Zarsız ve çok küçük.',
        undefined,
        { not: '"Her hücrede bulunan yapı hangisi" sorusunun cevabı ribozom; çekirdek ya da mitokondri değil.' },
      ),
      kart(
        'Ribozom serbest ya da ER\'ye bağlı olur',
        'Sitoplazmada serbest yüzen ribozom, hücrenin kendi içinde kullanacağı proteini yapar. Endoplazmik retikulum (ER) adlı zar ağına bağlı olanlar ise dışarı salgılanacak ya da zara gidecek proteini yapar.',
      ),
      kart(
        'Sitoiskelet hücrenin iskeletidir',
        'Sen kemiksiz olsan yığılırdın; hücre de sitoiskeletsiz yığılır. Sitoiskelet, sitoplazma içine yayılmış protein iplikleri. Hücreye şekil verir, organelleri yerinde tutar ve hücre içinde yol gibi taşıma sağlar.',
      ),
      kart(
        'Sentrozom bölünmede iğ ipliği üretir',
        'Hayvan hücresi bölünürken kromozomları iki yana çeken iğ iplikleri gerekir. Bu iplikleri sentrozom üretir. Sentrozom yalnızca hayvan hücresinde var; bitki hücresi iğ ipliğini sentrozomsuz yapar.',
      ),
      kart(
        'Sil kısa ve çok, kamçı uzun ve tek',
        'Boğazındaki hücrelerin üstünde binlerce kısa tüy var: siller. Süpürge gibi çalışıp tozu yukarı iter. Sperm hücresinin tek uzun kuyruğu ise kamçı; hücreyi yüzdürür. İkisi de hareket sağlayan uzantı.',
      ),
    ], [
      soru('Ribozom zarsız bir yapıdır ve protein sentezler.', true, 'Zarsız olduğu için prokaryotlarda da bulunabiliyor.'),
      soru('Sentrozom bitki hücrelerinin temel yapılarındandır.', false, 'Sentrozom hayvan hücrelerinde bulunur ve bölünmede rol alır.'),
      soru('Sitoiskelet hücreye şekil verir ve organelleri yerinde tutar.', true, 'Ayrıca hücre içi taşımaya da yol oluyor.'),
      soru('Sil ve kamçının hücrenin hareketiyle ilgisi yoktur.', false, 'İkisi de hücrenin ya da çevresindeki sıvının hareketini sağlıyor.'),
      sikli('Bölünmede iğ ipliklerini oluşturan yapı?', ['Ribozom', 'Sentrozom'], 1, 'Yalnızca hayvan hücresinde.'),
      sikli('Solunum yolundaki tozu dışarı süpüren?', ['Kamçı', 'Siller'], 1, 'Kısa ve çok sayıda.'),
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
        'Çekirdek hücrenin yönetim merkezidir',
        'Çekirdek DNA\'yı taşır; hangi proteinin ne zaman yapılacağı oradan söylenir. İçindeki koyu bölge çekirdekçik, ribozomun parçalarını üretir. Çekirdek zarındaki gözeneklerden RNA sitoplazmaya çıkar.',
      ),
      kart(
        'Mitokondri enerji santralidir',
        'Kas hücrelerinde binlerce mitokondri var, çünkü kas çok enerji ister. Mitokondri besini oksijenle yakıp ATP üretir; buna hücresel solunum denir. Kendi DNA\'sı var ve hücre içinde kendi kendine çoğalabilir.',
      ),
      kart(
        'Kloroplast güneşten şeker yapar',
        'Yaprağın yeşil rengi kloroplasttaki klorofil pigmentinden gelir. Klorofil ışığı yakalar; kloroplast su ve CO₂\'den şeker üretir: fotosentez. Yalnızca bitki ve alg hücrelerinde var; hayvan hücresinde yok.',
      ),
      kart(
        'ER hücre içindeki zar ağıdır',
        'Endoplazmik retikulum (ER) çekirdekten başlayan zar kanalları. Üstünde ribozom olan granüllü ER protein üretir. Ribozomsuz granülsüz ER yağ üretir ve zehirleri etkisiz hâle getirir. İkisi de ürettiğini taşır.',
      ),
      kart(
        'Golgi paketler ve gönderir',
        'Postane gibi: ER\'den gelen protein Golgi\'de işlenir, kese içine paketlenir ve gideceği yere gönderilir. Golgi protein üretmez; sık hata bu. Üretim ribozomda, işleme ve paketleme Golgi\'de.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Lizozom hücrenin çöp öğütücüsüdür',
        'Bakteri yutan akyuvar onu lizozomla parçalar. Lizozom içi sindirim enzimi dolu bir kese; yaşlı organelleri ve alınan besini parçalar. Enzimler kesenin içinde kalır; kese patlarsa hücre kendini sindirir.',
      ),
      kart(
        'Salgı proteini hep aynı yolu izler',
        'Pankreasın ürettiği insülin şu yolu izler: ribozomda yapılır, ER\'de katlanır, Golgi\'de paketlenir, keseyle zara gider ve dışarı atılır. Sınav bu sırayı sorar.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Ribozom' },
            { ad: 'ER' },
            { ad: 'Golgi' },
            { ad: 'Zar' },
          ],
        },
        { not: 'Sırayı bir kez kendin yaz: ribozom → ER → Golgi → kese → zar. Yazınca ER ile Golgi\'nin yeri karışmaz.' },
      ),
      kart(
        'Koful depo yapar, bitkiyi dik tutar',
        'Bitki hücresinin ortasında koca bir su kesesi var: koful. Suyla dolunca hücreyi içeriden iter, bitki dik durur. Susuz kalınca boşalır, bitki solar. Depolama ve atık biriktirme yapar; hayvan hücresinde küçük ve çok.',
      ),
      kart(
        'Bitkide kloroplast, hayvanda sentrozom',
        'Kloroplast, hücre duvarı ve büyük koful yalnızca bitkide. Sentrozom yalnızca hayvanda. Mitokondri, ribozom, ER, Golgi ve çekirdek ikisinde de var. Sık hata: bitkide mitokondri yok sanmak; bitki de solunum yapar.',
        {
          tur: 'tablo',
          basliklar: ['Yapı', 'Bitki', 'Hayvan'],
          satirlar: [
            ['Kloroplast', 'Var', 'Yok'],
            ['Hücre duvarı', 'Var', 'Yok'],
            ['Sentrozom', 'Yok', 'Var'],
            ['Mitokondri', 'Var', 'Var'],
          ],
        },
        { etiket: 'Sık hata' },
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
      sikli('Bitki hücresine diklik veren?', ['Büyük koful', 'Sentrozom'], 0, 'Suyla dolunca hücreyi içeriden iter.'),
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
        'Madde çoktan aza kendiliğinden yayılır',
        'Odanın köşesinde parfüm sıkarsın, biraz sonra her yerde kokar. Molekül çok olduğu yerden az olduğu yere kendiliğinden yayılır; buna difüzyon denir. Enerji gerekmez.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Pasif enerji istemez, aktif ister',
        'Yokuş aşağı bisiklet pedalsız iner; yokuş yukarı pedal gerekir. Zardan geçiş de öyle: çoktan aza gidiş pasif, ATP harcanmaz. Azdan çoğa gidiş aktif, ATP harcanır. Ayrım tek soru: enerji harcanıyor mu?',
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
        'Küçük moleküller doğrudan geçer',
        'Oksijen ve karbondioksit küçük ve yüksüz; zarın yağ tabakasından doğrudan süzülür. Buna basit difüzyon denir. Akciğerinde oksijen kana böyle geçer.',
      ),
      kart(
        'Glikoz kapıdan geçer, enerji yine yok',
        'Glikoz büyük, yağ tabakasından geçemez. Zardaki taşıyıcı protein ona kapı olur; yine çoktan aza ve ATP\'siz. Buna kolaylaştırılmış difüzyon denir. Sık hata: taşıyıcı protein var diye aktif sanmak.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Ozmozda geçen şey sudur',
        'Salatalığa tuz atınca su salar: su, tuzun yoğun olduğu tarafa geçti. Ozmoz, suyun zardan az yoğun ortamdan çok yoğun ortama geçmesi. Yoğunluk çözüneni sayar; suyun az olduğu yere su gider. Pasif; enerji yok.',
        undefined,
        { not: 'Ozmoz sorusunda "yoğun" kelimesini tuz miktarı olarak oku: tuz nerede çoksa su oraya gider.' },
      ),
      kart(
        'Tuzlu suda hücre büzülür',
        'Kan hücresini tuzlu suya koy: su dışarı çıkar, hücre büzülür. Bitki hücresinde buna plazmoliz denir; zar duvardan ayrılır. Saf suya koy: su içeri dolar, hücre şişer. Hayvan hücresi patlayabilir, bitki hücresini duvar korur.',
      ),
      kart(
        'Aktif taşıma yokuş yukarı pompalar',
        'Sinir hücren sodyumu dışarı, potasyumu içeri pompalar; ikisi de az olduğu yere doğru, yani yokuş yukarı. Buna aktif taşıma denir; ATP harcanır, taşıyıcı protein kullanılır. Sodyum-potasyum pompası klasik örnek.',
      ),
      kart(
        'Çok büyük madde keseyle girer çıkar',
        'Akyuvar bakteriyi yutarken zarını bakterinin çevresine sarar, kese yapar ve içeri alır: endositoz. Hücre insülini dışarı verirken kese zarla birleşir, içindekini boşaltır: ekzositoz. İkisi de ATP harcar.',
      ),
      kart(
        'İki soru sor: yön ne, ATP var mı',
        'Karşına bir geçiş çıkınca iki soru: Çoktan aza mı, azdan çoğa mı? ATP harcanıyor mu? Çoktan aza ve ATP yoksa pasif (difüzyon, ozmoz). Azdan çoğa ve ATP varsa aktif. Taşıyıcı protein iki tarafta da olabilir.',
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
      sikli('Endositoz ve ekzositozda enerji harcanır mı?', ['Hayır, pasiftir', 'Evet, ATP harcanır'], 1, 'Kese yapmak ve zarla birleştirmek enerji ister.'),
    ], [
      {
        soru: 'Ozmozda su hangi yöne geçer?',
        siklar: ['Az yoğun ortamdan çok yoğun ortama', 'Çok yoğun ortamdan az yoğun ortama'],
        dogru: 0,
        aciklama: {
          dogru: 'Su, çözünen derişiminin yüksek olduğu tarafa geçerek dengeyi kurmaya çalışır.',
          yanlis: 'Yoğunluk çözüneni sayar: su, çözünenin çok olduğu (yani suyun az olduğu) tarafa geçer.',
        },
        kart: 5,
      },
    ]),
    konu('byl9-siniflandirma', 'Sınıflandırmada Temel Yaklaşımlar', [
      kart(
        'Sınıflandırma düzen ve akrabalık verir',
        'Kütüphanede kitaplar konuya göre raflanmasa aradığını bulamazsın. Milyonlarca canlı da gruplara ayrılır; buna sınıflandırma denir. Modern sınıflandırma ayrıca akrabalığı gösterir: hangi tür hangisiyle yakın.',
      ),
      kart(
        'Yapay görünüşe, doğal kökene bakar',
        'Yarasa uçar, kuş uçar; ikisini "uçanlar" diye aynı gruba koyarsan bu yapay sınıflandırma: dış görünüşe bakar. Yarasa aslında memeli. Doğal sınıflandırma köken ve akrabalığa bakar; bugün kullanılan bu.',
      ),
      kart(
        'Homolog aynı kökten, analog aynı işten',
        'İnsan kolu ile yarasa kanadının kemikleri aynı düzende: aynı atadan gelmiş, buna homolog denir. Kuş kanadı ile sinek kanadı ikisi de uçurur ama yapıları bambaşka: analog, yani yalnızca aynı işi gören organlar.',
        undefined,
        { not: 'Organ sorusunda göreve değil kemik düzenine bak: düzen aynıysa homolog, yalnız iş aynıysa analog.' },
      ),
      kart(
        'Her türün iki kelimelik adı var',
        'İnsanın bilimsel adı Homo sapiens. İlk kelime cins (Homo), büyük harfle; ikinci kelime tür (sapiens), küçük harfle; ikisi de eğik yazılır. Bu Linne\'nin ikili adlandırması. Dünyanın her yerinde aynı ad.',
      ),
      kart(
        'Âlemden türe daralır, benzerlik artar',
        'Âlem en geniş kutu: bütün hayvanlar. İçinde şube, sınıf, takım, aile, cins var; en dipte tür. Kutu küçüldükçe canlı sayısı azalır, ortak özellik artar. Kedi ve aslan aynı ailede; kedi ve insan yalnızca aynı âlemde.',
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
        'Tür, verimli döl veren topluluktur',
        'At ile eşek çiftleşince katır doğar ama katır kısırdır, yavru yapamaz. O yüzden at ve eşek ayrı tür. Tür, doğada çiftleşip verimli, yani üreyebilen yavru veren bireyler topluluğu.',
        undefined,
        { etiket: 'Tanım' },
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
      sikli('Yarasa kanadı ile insan kolu nasıl organlardır?', ['Homolog', 'Analog'], 0, 'Kemik düzeni aynı, ortak köken.'),
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
        'Canlılar en tepede üçe ayrılır',
        'Bütün canlılar en tepede üç gruba ayrılır: Bakteriler, Arkeler ve Ökaryotlar. Bu üç gruba üst âlem ya da domain denir. Ayrım hücre yapısına ve genlerin benzerliğine dayanır; görünüşe değil.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Bakterilerin çoğu zararsız, hatta yararlı',
        'Yoğurdu mayalayan, bağırsağında vitamin üreten, toprakta çürütme yapan canlılar bakteri. Prokaryot ve tek hücreli. Bazıları hastalık yapar (verem, kolera) ama çoğunluğu yararlı. Sık hata: her bakteriyi mikrop sanmak.',
      ),
      kart(
        'Arke bakteriye benzer ama değildir',
        'Kaynar kaplıcada, Tuz Gölü\'nde, asitli suda yaşayan canlılar var: arkeler. Prokaryot, yani çekirdeksiz; bu yüzden bakteri sanılır. Ama genleri ve hücre duvarı bakteriden farklı, ayrı üst âlem. Çoğu aşırı ortamda yaşar.',
        undefined,
        { not: 'Prokaryot gördüğünde iki seçenek düşün: bakteri mi, arke mi? Aşırı ortamdan söz ediyorsa arke.' },
      ),
      kart(
        'Protistler kalan ökaryotlardır',
        'Göl suyundaki amip, öglena ve terliksi hayvan protist. Ökaryot, yani çekirdekli; çoğu tek hücreli. Bitki, mantar ve hayvan olmayan ökaryotlar bu gruba konur. Çok hücreli su yosunları da burada.',
      ),
      kart(
        'Mantar besinini dışarıda sindirir',
        'Ekmekteki küf enzimini dışarı salar, ekmeği dışarıda çözer ve çözüneni emer: dış sindirim. Mantarlar hazır beslenir, fotosentez yapmaz; bitki değildir. Hücre duvarı kitinden. Maya, küf, şapkalı mantar bu gruptan.',
      ),
      kart(
        'Bitki güneşle kendi besinini yapar',
        'Bitki ototrof: kloroplastıyla fotosentez yapar, kendi şekerini üretir. Hücre duvarı selülozdan. Yerleşik yaşar, hareket etmez. Ökaryot ve çok hücreli.',
      ),
      kart(
        'Hayvan hazır yer, hareket eder',
        'Hayvanlar heterotrof: besini dışarıdan alır. Çoğu hareket eder ve sinir sistemi vardır. Hücre duvarı yok; ökaryotlar içinde duvarı olmayan tek grup. Sen de bu gruptasın.',
        {
          tur: 'tablo',
          basliklar: ['Grup', 'Beslenme', 'Hücre duvarı'],
          satirlar: [
            ['Mantar', 'Hazır, dış sindirim', 'Kitin'],
            ['Bitki', 'Kendi üretir', 'Selüloz'],
            ['Hayvan', 'Hazır', 'Yok'],
          ],
        },
      ),
    ], [
      soru('Arkeler aşırı sıcaklık ve tuzluluk gibi zor koşullarda yaşayabilir.', true, 'Kaplıca ve tuz göllerinde yaşayan türleri var.'),
      soru('Mantarlar fotosentez yaparak kendi besinini üretir.', false, 'Kloroplastları yok; hazır besini dışarıda çözüp emerler.'),
      soru('Bakteriler prokaryot canlılardır.', true, 'Çekirdek zarları ve zarlı organelleri bulunmuyor.'),
      soru('Protistler yalnızca tek hücreli canlılardan oluşur.', false, 'Çok hücreli su yosunları da bu grupta yer alıyor.'),
      sikli('Dış sindirim yapan ve hücre duvarı kitin olan?', ['Bitkiler', 'Mantarlar'], 1, 'Bitkinin duvarı selüloz.'),
      sikli('Amip ve öglena hangi gruptadır?', ['Bakteriler', 'Protistler'], 1, 'Tek hücreli ökaryotlar.'),
      sikli('Hücre duvarı olmayan ökaryot grubu?', ['Bitkiler', 'Hayvanlar'], 1, 'Hareket eder, sinir sistemi var.'),
      soru('Bakterilerin çoğu hastalık yapar.', false, 'Çoğu yararlı: yoğurt, bağırsak, toprak.'),
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
        'Biyoçeşitlilik üç katmanda sayılır',
        'Bir ormanda meşe, çam, geyik, kurt: tür çeşitliliği. Aynı meşelerin bazısı kuraklığa dayanıklı, bazısı değil: gen çeşitliliği. Orman, göl, bozkır bir arada: ekosistem çeşitliliği. Biyoçeşitlilik üçünün toplamı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Tek çeşit ekersen tek hastalık bitirir',
        '1840\'larda İrlanda tek çeşit patates ekiyordu. Bir mantar hastalığı geldi, bütün patatesler çürüdü, bir milyon insan öldü. Çeşit çok olsaydı bazıları dayanırdı. Çeşitlilik ekosistemi dayanıklı kılar.',
      ),
      kart(
        'Direnç aynı türün içindeki farkta saklı',
        'Bir tavuk çiftliğine grip girdi; bazı tavuklar hastalanmadı, çünkü genleri farklıydı. Gen çeşitliliği, yani aynı türün bireyleri arasındaki farklılık. Tür sayısı kadar bu farklılık da önemli.',
        undefined,
        { not: 'Çeşitlilik sorusunda iki şeyi say: kaç tür var ve bir türün içinde ne kadar fark var.' },
      ),
      kart(
        'Endemik tür başka yerde yoktur',
        'Van Gölü\'ndeki inci kefali balığı dünyanın başka hiçbir yerinde yaşamaz. Endemik tür, yalnızca belirli bir bölgede doğal olarak yaşayan tür. Orada kaybolursa dünyadan tamamen silinir.',
      ),
      kart(
        'Türkiye üç bitki bölgesinin kesişimi',
        'Türkiye\'de yaklaşık 12 bin bitki türü var; bu sayı Avrupa\'nın tamamına yakın. Sebep: Akdeniz, Avrupa-Sibirya ve İran-Turan bitki coğrafyaları burada kesişiyor. Üç bölgenin türleri tek ülkede toplanmış.',
      ),
      kart(
        'En büyük tehdit yaşam alanı kaybı',
        'Sulak alan kurutulunca oradaki kuşlar gidecek yer bulamaz: habitat, yani yaşam alanı kaybı en büyük tehdit. Diğerleri: aşırı avlanma, kirlilik, dışarıdan gelip yerli türü bastıran istilacı türler ve iklim değişikliği.',
      ),
      kart(
        'Koruma: alan, tohum, yasa, geri getirme',
        'Millî park kurup habitatı koruyabilirsin. Tohum bankasına tohum koyup gen çeşitliliğini saklayabilirsin. Av yasağıyla türü kurtarabilirsin. Kaybolan türü yetiştirip doğaya geri bırakabilirsin. Dört yol da kullanılıyor.',
      ),
    ], [
      soru('Endemik tür, yalnızca belirli bir bölgede doğal olarak yaşayan türdür.', true, 'Başka yerde bulunmadığı için yok olması geri dönülmez.'),
      soru('Biyoçeşitlilik gen, tür ve ekosistem düzeylerinde incelenir.', true, 'Aynı türün içindeki gen farkları da çeşitliliğin parçası.'),
      soru('Türkiye biyoçeşitlilik bakımından Avrupa nın en fakir ülkelerindendir.', false, 'Üç bitki coğrafyasının kesişimi sayesinde en zengin ülkelerinden biri.'),
      soru('Bir türün yok olması ekosistemin işleyişini etkilemez.', false, 'Besin ağındaki her tür başka türlere bağlı; kopan halka zinciri etkiliyor.'),
      sikli('Aynı türün bireyleri arasındaki farklılık?', ['Ekosistem çeşitliliği', 'Gen çeşitliliği'], 1, 'Hastalığa direnç burada saklı.'),
      sikli('Türkiye\'nin tür zenginliğinin sebebi?', ['Geniş çöl alanları', 'Üç bitki coğrafyasının kesişimi'], 1, 'Avrupa\'nın tamamına yakın tür.'),
      sikli('Tohum bankası neyi korur?', ['Habitatı', 'Gen çeşitliliğini'], 1, 'Millî park habitatı korur.'),
      soru('Tek çeşit üretim bir hastalıkla tümüyle yok olabilir.', true, 'İrlanda patates kıtlığı; çeşitlilik dayanıklılık.'),
    ], [
      {
        soru: 'Yalnızca belirli bir bölgede yaşayan türe ne denir?',
        siklar: ['İstilacı', 'Endemik'],
        dogru: 1,
        aciklama: {
          dogru: 'Endemik tür başka yerde yok; orada kaybolursa dünyadan silinir.',
          yanlis: 'İstilacı tür dışarıdan gelip yerli türü bastıran tür. Yalnızca bir bölgeye özgü olan endemik tür.',
        },
        kart: 4,
      },
    ]),
  ]),
])
