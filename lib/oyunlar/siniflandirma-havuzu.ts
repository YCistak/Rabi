/**
 * Canlıları Sınıflandır oyununun soru havuzu.
 *
 * Kapsam 9. sınıf "Canlılar Dünyası" ünitesi: sınıflandırma çeşitleri,
 * taksonomik birimler, tür kavramı, ikili adlandırma ve altı âlem. Âlemlerin
 * içi TYT'nin sorduğu kadar — bitkilerde tohumlu/tohumsuz ayrımı, hayvanlarda
 * omurgalı/omurgasız ayrımı. 11-12. sınıfın sistemleri buraya girmiyor.
 *
 * Çeldiriciler soruyla birlikte yazılıyor: her birinin **açıkça yanlış ama
 * akla yatkın** olması gerekiyor. Rastgele seçilseydi çoğu soru okumadan
 * elenebilirdi.
 */

import { soruKur as s, type BiyolojiSorusu } from './biyoloji'

export const SINIFLANDIRMA_HAVUZU: readonly BiyolojiSorusu[] = [
  s(
    'kolay',
    'Canlıların benzerlik ve farklılıklarına göre gruplandırılmasını inceleyen bilim dalı hangisidir?',
    'Sistematik (taksonomi)',
    ['Ekoloji', 'Genetik', 'Anatomi'],
    'Sistematik, canlıları akrabalıklarına göre gruplandırır ve adlandırır.',
  ),
  s(
    'kolay',
    'Canlıları yalnızca dış görünüş ve yaşadığı ortam gibi benzerliklere göre gruplayan sınıflandırma hangisidir?',
    'Ampirik (yapay) sınıflandırma',
    ['Doğal sınıflandırma', 'Filogenetik sınıflandırma', 'İkili adlandırma'],
    'Ampirik sınıflandırma göze görünene bakar: “uçanlar” grubuna hem kuşu hem yarasayı hem böceği koyar.',
  ),
  s(
    'kolay',
    'Bugün kullanılan, canlıların akrabalık derecesine dayanan sınıflandırma hangisidir?',
    'Doğal (filogenetik) sınıflandırma',
    ['Ampirik sınıflandırma', 'Yapay sınıflandırma', 'Alfabetik sınıflandırma'],
    'Doğal sınıflandırma; homolog organ, protein benzerliği ve DNA benzerliği gibi ölçütlere bakar.',
  ),
  s(
    'kolay',
    'Sınıflandırma birimlerinin büyükten küçüğe doğru sıralanışı hangisidir?',
    'Âlem – şube – sınıf – takım – familya – cins – tür',
    [
      'Âlem – sınıf – şube – familya – takım – cins – tür',
      'Şube – âlem – sınıf – takım – familya – cins – tür',
      'Âlem – şube – takım – sınıf – cins – familya – tür',
    ],
    'En geniş birim âlem, en küçük ve temel birim türdür.',
  ),
  s(
    'kolay',
    'Sınıflandırmanın temel (en küçük) birimi hangisidir?',
    'Tür',
    ['Cins', 'Familya', 'Birey'],
    'Birey bir sınıflandırma birimi değildir; en küçük birim türdür.',
  ),
  s(
    'kolay',
    'Ortak atadan gelen, çiftleştiklerinde verimli döller verebilen bireyler topluluğuna ne denir?',
    'Tür',
    ['Cins', 'Popülasyon', 'Familya'],
    'Tür tanımındaki kilit sözcük “verimli döl”dür: at ile eşek çiftleşir ama katır kısırdır, bu yüzden ayrı türlerdir.',
  ),
  s(
    'kolay',
    'Aynı türden bireylerin belirli bir bölgede oluşturduğu topluluğa ne ad verilir?',
    'Popülasyon',
    ['Komünite', 'Ekosistem', 'Familya'],
    'Popülasyon aynı türden bireylerdir; komünite ise aynı bölgedeki bütün popülasyonlardır.',
  ),
  s(
    'kolay',
    'İkili adlandırma sistemini geliştiren bilim insanı kimdir?',
    'Carl Linnaeus',
    ['Charles Darwin', 'Louis Pasteur', 'Aristoteles'],
    'Linnaeus her canlıya cins ve tür adından oluşan iki sözcüklü Latince bir ad verilmesini önerdi.',
  ),
  s(
    'orta',
    'İkili adlandırmada birinci sözcük neyi belirtir?',
    'Cins adını',
    ['Tür (tanımlayıcı) adını', 'Familya adını', 'Şube adını'],
    'Birinci sözcük cins, ikinci sözcük tanımlayıcı addır; ikisi birlikte tür adını verir.',
  ),
  s(
    'orta',
    'İkili adlandırmanın yazımıyla ilgili hangisi doğrudur?',
    'Cins adının ilk harfi büyük, tanımlayıcı ad tümüyle küçük yazılır',
    [
      'İki sözcüğün de ilk harfi büyük yazılır',
      'İki sözcük de tümüyle küçük yazılır',
      'Tanımlayıcı adın ilk harfi büyük yazılır',
    ],
    'Örnek: Pinus nigra. Ayrıca ad Latincedir ve elle yazımda altı çizilir, basılıda eğik yazılır.',
  ),
  s(
    'orta',
    'Bilimsel adı “Pinus nigra” olan canlıda “nigra” neyi belirtir?',
    'Tanımlayıcı (tür) adını',
    ['Cins adını', 'Familya adını', 'Âlem adını'],
    'Tanımlayıcı ad genelde canlının bir özelliğini anlatır; tek başına kullanılmaz.',
  ),
  s(
    'orta',
    'Bilimsel adlarının ilk sözcüğü aynı olan iki canlı için hangisi kesinlikle doğrudur?',
    'Aynı cinstendirler',
    ['Aynı türdendirler', 'Verimli döl verirler', 'Aynı ortamda yaşarlar'],
    'İlk sözcük cinsi gösterir. Aynı cinste olmak akraba olmak demektir, aynı tür olmak demek değildir.',
  ),
  s(
    'orta',
    'Türden âleme doğru çıkıldıkça ne olur?',
    'Birey sayısı artar, ortak özellik sayısı azalır',
    [
      'Birey sayısı azalır, ortak özellik sayısı artar',
      'Hem birey sayısı hem ortak özellik artar',
      'Hem birey sayısı hem ortak özellik azalır',
    ],
    'Grup genişledikçe içine daha çok canlı girer; hepsinin paylaştığı ortak özellik ise azalır.',
  ),
  s(
    'zor',
    'Aynı familyada bulunan iki canlı için hangisi kesinlikle söylenir?',
    'Aynı şubede de bulunurlar',
    ['Aynı cinstendirler', 'Aynı türdendirler', 'Kromozom sayıları eşittir'],
    'Ortak bir alt basamak, ondan büyük bütün basamakların da ortak olmasını gerektirir; tersi doğru değildir.',
  ),
  s(
    'orta',
    'İki canlının benzerliği arttıkça hangisi doğru olur?',
    'Ortak sınıflandırma birimi sayısı artar',
    [
      'Ortak sınıflandırma birimi sayısı azalır',
      'Akrabalık dereceleri azalır',
      'Farklı âlemlerde yer alırlar',
    ],
    'Akrabalık arttıkça canlılar daha çok basamakta yan yana gelir; en yakın akrabalar aynı cinstedir.',
  ),
  s(
    'kolay',
    'Prokaryot hücre yapısına sahip olan âlem hangisidir?',
    'Bakteriler',
    ['Mantarlar', 'Protistler', 'Bitkiler'],
    'Bakteriler ve arkeler prokaryottur: çekirdek zarları ve zarlı organelleri yoktur.',
  ),
  s(
    'orta',
    'Kaynar su, tuz gölü gibi aşırı koşullarda yaşayabilen prokaryotlar hangi âlemdedir?',
    'Arkeler',
    ['Bakteriler', 'Protistler', 'Mantarlar'],
    'Arkeler prokaryottur ama hücre duvarında peptidoglikan yoktur; bu yüzden bakterilerden ayrı bir âlemdir.',
  ),
  s(
    'kolay',
    'Amip, öglena ve terliksi hayvan hangi âlemde incelenir?',
    'Protistler',
    ['Bakteriler', 'Mantarlar', 'Hayvanlar'],
    'Protistler ökaryottur ve çoğu tek hücrelidir; öteki üç ökaryot âleme uymayanlar burada toplanır.',
  ),
  s(
    'orta',
    'Hücre duvarı kitinden oluşan, çürükçül ya da parazit beslenen ökaryotlar hangi âlemdedir?',
    'Mantarlar',
    ['Bitkiler', 'Protistler', 'Arkeler'],
    'Mantarlar klorofil taşımaz, fotosentez yapmaz; besinini dışarıdan hazır alır.',
  ),
  s(
    'kolay',
    'Mantarların beslenme şekli hangisidir?',
    'Heterotrof',
    ['Fotoototrof', 'Kemoototrof', 'Hepsi ototrof'],
    'Mantarlar klorofilsizdir: ya çürüyen maddelerle (saprofit) ya da başka canlıdan (parazit) beslenir.',
  ),
  s(
    'kolay',
    'Bitki hücrelerinin hücre duvarı hangi maddeden oluşur?',
    'Selüloz',
    ['Kitin', 'Peptidoglikan', 'Lignin'],
    'Selüloz bitkiye özgüdür; kitin mantarların, peptidoglikan bakterilerin duvarındadır.',
  ),
  s(
    'orta',
    'Bakterilerin hücre duvarında bulunan madde hangisidir?',
    'Peptidoglikan',
    ['Selüloz', 'Kitin', 'Nişasta'],
    'Gram boyama, hücre duvarındaki peptidoglikan kalınlığına göre bakterileri iki gruba ayırır.',
  ),
  s(
    'kolay',
    'Aşağıdaki âlemlerden hangisinin bütün üyeleri ototroftur?',
    'Bitkiler',
    ['Mantarlar', 'Hayvanlar', 'Protistler'],
    'Bitkilerin hepsi klorofil taşır ve fotosentez yapar; protistlerde hem ototrof hem heterotrof üyeler vardır.',
  ),
  s(
    'orta',
    'Virüslerle ilgili hangisi doğrudur?',
    'Hücresel yapıları olmadığı için âlemlere dahil edilmezler',
    [
      'Bakteriler âleminde incelenirler',
      'Protistler âleminde incelenirler',
      'Kendi başlarına çoğalabilirler',
    ],
    'Virüs ancak bir konak hücrenin içinde çoğalabilir; hücre dışında cansız gibi davranır.',
  ),
  s(
    'orta',
    'Tohumsuz bitkilere örnek hangisidir?',
    'Eğrelti otu',
    ['Çam', 'Elma ağacı', 'Buğday'],
    'Kara yosunları ve eğrelti otları tohum değil spor üretir.',
  ),
  s(
    'orta',
    'Açık tohumlu bitkilere örnek hangisidir?',
    'Çam',
    ['Fasulye', 'Buğday', 'Gül'],
    'Açık tohumlularda tohum meyve içinde değildir; kozalak pullarının üzerinde açıkta durur.',
  ),
  s(
    'orta',
    'Kapalı tohumlu bitkiler için hangisi doğrudur?',
    'Tohumları meyvenin içinde bulunur',
    [
      'Tohumları açıkta, kozalak üzerinde bulunur',
      'Çiçek oluşturmazlar',
      'İletim demetleri yoktur',
    ],
    'Kapalı tohumlularda çiçeğin yumurtalığı gelişerek meyveye dönüşür ve tohumu içine alır.',
  ),
  s(
    'kolay',
    'Aşağıdakilerden hangisi omurgalı bir hayvandır?',
    'Kurbağa',
    ['Ahtapot', 'Toprak solucanı', 'Karınca'],
    'Omurgalılar; balıklar, kurbağalar, sürüngenler, kuşlar ve memelilerden oluşur.',
  ),
  s(
    'zor',
    'Analog organlar için hangisi doğrudur?',
    'Görevleri aynı, kökenleri farklıdır; akrabalık göstermez',
    [
      'Akrabalığın en güçlü kanıtıdır',
      'Homolog organlarla aynı şeydir',
      'Yalnızca bitkilerde görülür',
    ],
    'Kuş kanadı ile sinek kanadı analogdur: ikisi de uçar ama kökenleri ayrıdır, bu yüzden doğal sınıflandırmada ölçüt sayılmaz.',
  ),
  s(
    'zor',
    'Homolog organlar hangi sınıflandırmada ölçüt olarak kullanılır?',
    'Doğal (filogenetik) sınıflandırmada',
    ['Ampirik sınıflandırmada', 'Yapay sınıflandırmada', 'İkili adlandırmada'],
    'Homolog organların kökeni ortaktır (insan kolu, kuş kanadı, balina yüzgeci); bu ortaklık akrabalığı gösterir.',
  ),

  // ————— Sistematiğin amacı ve tarihçesi —————
  // Sınıflandırmanın "ne işe yarar" tarafı sorulduğunda öğrenci genelde
  // ezberden basamak sayar; bu blok amacı ve tarihsel akışı ayrı ayrı yokluyor.
  s(
    'kolay',
    'Canlıların sınıflandırılmasının temel amacı aşağıdakilerden hangisidir?',
    'Canlıları düzenli biçimde inceleyip aralarındaki akrabalığı ortaya koymak',
    [
      'Yeryüzündeki canlı sayısını azaltmak',
      'Canlılara yeni kalıtsal özellikler kazandırmak',
      'Canlıların yaşam süresini uzatmak',
    ],
    'Milyonlarca tür tek tek incelenemez; sınıflandırma hem düzen sağlar hem de akrabalıkları görünür kılar.',
  ),
  s(
    'kolay',
    'Sınıflandırma yapan bilim insanına ne ad verilir?',
    'Sistematikçi (taksonomist)',
    ['Ekolog', 'Paleontolog', 'Embriyolog'],
    'Sistematikçi canlıları tanımlar, adlandırır ve akrabalıklarına göre gruplara yerleştirir.',
  ),
  s(
    'orta',
    'Canlıları bitkiler ve hayvanlar diye ikiye ayıran ilk sınıflandırmayı yapan bilim insanı kimdir?',
    'Aristoteles',
    ['Carl Linnaeus', 'Gregor Mendel', 'Robert Hooke'],
    'Aristoteles hayvanları yaşadıkları ortama göre gruplamıştı; bu, ampirik sınıflandırmanın ilk örneğidir.',
  ),
  s(
    'orta',
    'Canlıları yaşadığı ortama ve dış görünüşe göre ayıran ilk çağ sınıflandırmaları hangi türdendir?',
    'Ampirik (yapay) sınıflandırma',
    ['Doğal sınıflandırma', 'Moleküler sınıflandırma', 'Sayısal sınıflandırma'],
    'Ampirik sınıflandırma gözle görülen benzerliğe bakar, akrabalığı hesaba katmaz.',
  ),
  s(
    'kolay',
    'Ampirik sınıflandırmada aşağıdaki ölçütlerden hangisi kullanılır?',
    'Canlının yaşadığı ortam ve dış görünüşü',
    [
      'Protein benzerliği',
      'DNA baz dizilimindeki benzerlik',
      'Embriyonik gelişim evrelerindeki benzerlik',
    ],
    'Bu ölçütler kolay gözlenir ama yanıltıcıdır: yarasa ile kuşu aynı gruba düşürür.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi doğal sınıflandırmada kullanılan ölçütlerden biri değildir?',
    'Canlıların yaşadığı iklim bölgesi',
    [
      'Homolog organların varlığı',
      'Protein ve DNA benzerliği',
      'Embriyonik gelişim evrelerinin benzerliği',
    ],
    'Aynı iklimde yaşamak akrabalık göstermez; kaktüs ile deve aynı çölde yaşar ama farklı âlemlerdedir.',
  ),
  s(
    'orta',
    'Kuş, yarasa ve sineği “uçanlar” adlı tek bir gruba koyan sınıflandırma hangi bakımdan hatalıdır?',
    'Analog yapılara dayandığı için akrabalığı yansıtmaz',
    [
      'Homolog organları ölçüt aldığı için',
      'DNA benzerliğine dayandığı için',
      'Çok fazla basamak kullandığı için',
    ],
    'Üç canlının kanadı da ayrı kökenden gelişmiştir; benzerlik görev benzerliğidir, akrabalık değil.',
  ),
  s(
    'orta',
    'Canlıların akrabalık ilişkilerini dallanan bir şema üzerinde gösteren çizime ne ad verilir?',
    'Filogenetik ağaç',
    ['Besin ağı', 'Enerji piramidi', 'Karyotip'],
    'Filogenetik ağaçta dalların ayrıldığı nokta ortak atayı, dal uzunluğu ise ayrılma zamanını anlatır.',
  ),
  s(
    'zor',
    'İki canlının DNA ve protein benzerliğinin yüksek çıkması hangi sonucu doğrudan destekler?',
    'Akrabalık derecelerinin yüksek olduğunu',
    [
      'Aynı ortamda yaşadıklarını',
      'Aynı besinlerle beslendiklerini',
      'Boy ve kütlelerinin birbirine eşit olduğunu',
    ],
    'Kalıtsal madde ortak atadan aktarılır; benzerlik ne kadar çoksa ayrılma o kadar yenidir.',
  ),
  s(
    'orta',
    'Doğal sınıflandırmada aynı gruba yerleştirilen canlılar için hangisi söylenebilir?',
    'Ortak bir atadan gelmişlerdir',
    [
      'Aynı bölgede yaşamak zorundadırlar',
      'Boyutları birbirine yakındır',
      'Aynı besini tüketirler',
    ],
    'Doğal sınıflandırmanın çıkış noktası ortak köken olduğu için gruplar aynı zamanda birer akrabalık grubudur.',
  ),
  s(
    'kolay',
    'Aşağıdakilerden hangisi sistematiğin sağladığı yararlardan biridir?',
    'Canlıların kolay tanınmasını sağlayıp adlandırma karışıklığını önlemek',
    [
      'Canlıların kalıtsal yapısını değiştirmek',
      'Yeni türlerin oluşmasını sağlamak',
      'Canlıların çevreye uyumunu artırmak',
    ],
    'Sistematik canlıyı değiştirmez, yalnızca onu tanımlar ve yerini belirler.',
  ),
  s(
    'orta',
    'Canlıların yalnızca yerel adlarıyla anılması hangi soruna yol açar?',
    'Aynı canlının farklı bölgelerde farklı adlarla anılması karışıklığa neden olur',
    [
      'Canlının kromozom sayısı değişir',
      'Canlı sınıflandırılamaz duruma gelir',
      'Canlının ait olduğu tür değişir',
    ],
    'Ayçiçeğine kimi yerde gündöndü denmesi gibi; bilimsel ad bu karışıklığı ortadan kaldırır.',
  ),
  s(
    'zor',
    'Ampirik sınıflandırma ile doğal sınıflandırma arasındaki temel fark nedir?',
    'Ampirik sınıflandırma benzer görünüşe, doğal sınıflandırma ortak kökene dayanır',
    [
      'Ampirik sınıflandırma DNA verilerini kullanır',
      'Doğal sınıflandırma yalnızca hayvanlara uygulanır',
      'Ampirik sınıflandırmada tür kavramı yoktur',
    ],
    'Görünüş benzerliği yanıltabilir; ortak köken ise akrabalığın kendisidir.',
  ),
  s(
    'orta',
    'Kuş kanadı ile arı kanadı arasındaki benzerlik hangi kavramla açıklanır?',
    'Analog yapı',
    ['Homolog yapı', 'Körelmiş yapı', 'Ortak atadan gelen yapı'],
    'İkisi de uçmayı sağlar ama embriyonik kökenleri farklıdır; bu yüzden akrabalık kanıtı sayılmaz.',
  ),
  s(
    'orta',
    'İnsanın kolu, yarasanın kanadı ve balinanın yüzgeci arasındaki ilişki nedir?',
    'Homolog organlardır',
    ['Analog organlardır', 'Körelmiş organlardır', 'Aralarında hiçbir ilişki yoktur'],
    'Üçünün de kemik dizilişi ve embriyonik kökeni aynıdır; görevleri farklı olsa da ortak atayı gösterir.',
  ),

  // ————— İkili adlandırma (binominal) —————
  // Yazım kuralları TYT'de doğrudan sorulduğu için biçim ayrıntıları
  // (büyük harf, italik, altı çizili) tek tek ayrı sorularla veriliyor.
  s(
    'kolay',
    'İkili adlandırmada bilimsel adlar hangi dilde yazılır?',
    'Latince',
    ['İngilizce', 'Yunanca', 'Fransızca'],
    'Latince ölü bir dil olduğu için zamanla anlam değiştirmez; bu yüzden bilimsel adlandırmada tercih edilir.',
  ),
  s(
    'kolay',
    'Bir canlının bilimsel adı kaç sözcükten oluşur?',
    'İki',
    ['Bir', 'Üç', 'Dört'],
    'Bu yüzden sisteme ikili (binominal) adlandırma denir: cins adı ve tanımlayıcı ad.',
  ),
  s(
    'orta',
    'El yazısıyla yazılan bilimsel adlar nasıl belirtilir?',
    'Altı çizilerek',
    ['Tırnak içine alınarak', 'Tümüyle büyük harfle yazılarak', 'Parantez içine alınarak'],
    'Basılı metinde eğik yazı kullanılır; elle yazarken eğik yazının karşılığı altı çizmektir.',
  ),
  s(
    'orta',
    'Basılı metinlerde bilimsel adlar hangi biçimde yazılır?',
    'Eğik (italik) yazıyla',
    ['Koyu (kalın) yazıyla', 'Altı çizili olarak', 'Tümüyle büyük harflerle'],
    'Eğik yazı, adın Latince ve bilimsel olduğunu okura anında gösterir.',
  ),
  s(
    'zor',
    'Bilimsel adın sonuna eklenen üçüncü sözcük ne anlama gelir?',
    'Canlının alt türünü belirtir',
    [
      'Canlının yaşadığı ülkeyi belirtir',
      'Canlının kromozom sayısını belirtir',
      'Canlının beslenme şeklini belirtir',
    ],
    'Üç sözcüklü adlandırmaya üçlü adlandırma denir; aynı tür içindeki farklı alt grupları ayırmak için kullanılır.',
  ),
  s(
    'orta',
    'Homo sapiens bilimsel adında Homo sözcüğü hangi sınıflandırma birimini gösterir?',
    'Cins',
    ['Familya', 'Şube', 'Takım'],
    'Baştaki sözcük her zaman cinstir; sapiens ise insanı aynı cinsteki öteki türlerden ayıran tanımlayıcı addır.',
  ),
  s(
    'orta',
    'Pinus nigra ile Pinus sylvestris adlı canlılar için hangisi doğrudur?',
    'Aynı cinse ait farklı türlerdir',
    [
      'Aynı türün iki bireyidir',
      'Farklı familyalarda yer alırlar',
      'Çiftleştiklerinde verimli döl verirler',
    ],
    'Cins adları aynı, tanımlayıcı adları farklı; yani yakın akraba ama ayrı türlerdir.',
  ),
  s(
    'orta',
    'Bilimsel adlarının hiçbir sözcüğü ortak olmayan iki canlı için hangisi söylenebilir?',
    'En azından cins düzeyinde birbirlerinden ayrılırlar',
    [
      'Aynı cinse aittirler',
      'Aynı türe aittirler',
      'Kesinlikle farklı âlemlerde bulunurlar',
    ],
    'Cins adları farklıysa tür de farklıdır; ama iki canlı hâlâ aynı familyada, hatta aynı âlemde olabilir.',
  ),
  s(
    'zor',
    'Tanımlayıcı adın tek başına kullanılması neden doğru değildir?',
    'Aynı tanımlayıcı ad farklı cinslerde tekrarlanabildiği için canlı belirsiz kalır',
    [
      'Latince olmadığı için',
      'Cins adından daha uzun olduğu için',
      'Yalnızca bitkilerde kullanıldığı için',
    ],
    'Tanımlayıcı ad ancak cins adıyla birlikte tek bir türü işaret eder; tek başına adres değildir.',
  ),
  s(
    'orta',
    'İkili adlandırmanın sağladığı en önemli yarar aşağıdakilerden hangisidir?',
    'Her canlının dünyanın her yerinde aynı adla anılmasını sağlaması',
    [
      'Canlılar arasındaki akrabalığı ortadan kaldırması',
      'Tanımlanabilecek tür sayısını sınırlaması',
      'Yerel adların kullanımını zorunlu kılması',
    ],
    'Ortak ad sayesinde farklı ülkelerdeki bilim insanları aynı canlıdan söz ettiklerinden emin olur.',
  ),
  s(
    'kolay',
    'Aşağıdakilerden hangisi bilimsel adın kurallara uygun yazılmış biçimidir?',
    'Rosa canina',
    ['rosa Canina', 'Rosa Canina', 'ROSA CANINA'],
    'Kural tek: cins adı büyük harfle başlar, tanımlayıcı ad tümüyle küçük yazılır.',
  ),
  s(
    'zor',
    'Bilimsel adları tümüyle aynı olan iki birey için hangisi kesinlikle doğrudur?',
    'Aynı türe aittirler',
    ['Genotipleri aynıdır', 'Aynı popülasyonda yaşarlar', 'Cinsiyetleri aynıdır'],
    'Aynı tür olmak kalıtsal olarak tıpatıp aynı olmak demek değildir; tür içinde geniş bir çeşitlilik bulunur.',
  ),
  s(
    'orta',
    'Cins adı aynı, tanımlayıcı adı farklı iki canlı için aşağıdakilerden hangisi yanlıştır?',
    'Çiftleştiklerinde verimli döl verirler',
    ['Aynı familyada bulunurlar', 'Aynı âlemde bulunurlar', 'Yakın akrabadırlar'],
    'Verimli döl yalnızca aynı tür bireyleri arasında olur; aynı cinste olmak bunun için yetmez.',
  ),
  s(
    'orta',
    'Bilimsel adlandırmada tanımlayıcı ad çoğunlukla neyi anlatır?',
    'Canlının bir özelliğini, yaşadığı yeri ya da onu tanımlayan kişiyi',
    [
      'Canlının kromozom sayısını',
      'Canlının ait olduğu âlemi',
      'Canlının ortalama yaşam süresini',
    ],
    'Örneğin nigra “siyah” demektir; ad, canlının göze çarpan bir özelliğinden türetilmiştir.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi ikili adlandırma kurallarına aykırıdır?',
    'Tanımlayıcı adın büyük harfle başlatılması',
    [
      'Cins adının büyük harfle başlatılması',
      'Bilimsel adın eğik yazılması',
      'Bilimsel adın Latince olması',
    ],
    'Tanımlayıcı ad özel ad sayılmaz; kişi adından türetilse bile küçük harfle yazılır.',
  ),

  // ————— Sınıflandırma basamakları —————
  // Basamak sırası her turda bir kez çıkacak kadar çok soruluyor; burada
  // sıra ezberi yerine "hangi birim hangisinin içinde" ilişkisi ölçülüyor.
  s(
    'kolay',
    'Sınıflandırma basamaklarında cinsten sonra gelen birim hangisidir?',
    'Tür',
    ['Familya', 'Takım', 'Sınıf'],
    'Cins, birbirine çok benzeyen türlerin toplandığı basamaktır; ondan sonrası en küçük birim olan türdür.',
  ),
  s(
    'kolay',
    'Familya ile sınıf arasında yer alan sınıflandırma birimi hangisidir?',
    'Takım',
    ['Cins', 'Şube', 'Âlem'],
    'Sıra şöyledir: sınıf – takım – familya. Benzer familyalar takımı, benzer takımlar sınıfı oluşturur.',
  ),
  s(
    'orta',
    'Benzer cinslerin bir araya gelmesiyle oluşan sınıflandırma birimi hangisidir?',
    'Familya',
    ['Takım', 'Sınıf', 'Şube'],
    'Her basamak bir altındaki benzer grupların toplanmasıyla oluşur; cinslerin üstündeki basamak familyadır.',
  ),
  s(
    'orta',
    'Benzer şubelerin bir araya gelmesiyle oluşan en geniş sınıflandırma birimi hangisidir?',
    'Âlem',
    ['Sınıf', 'Takım', 'Familya'],
    'Âlem en kapsayıcı basamaktır; içindeki canlıların ortak özelliği en azdır.',
  ),
  s(
    'orta',
    'Âlemden türe doğru inildikçe aşağıdakilerden hangisi gözlenir?',
    'Ortak özellik sayısı artar, birey sayısı azalır',
    [
      'Ortak özellik sayısı azalır, birey sayısı artar',
      'Hem ortak özellik hem birey sayısı artar',
      'Hem ortak özellik hem birey sayısı azalır',
    ],
    'Grup daraldıkça içindekiler birbirine daha çok benzer; en çok ortak özellik türde bulunur.',
  ),
  s(
    'zor',
    'Aynı türden iki birey için aşağıdakilerden hangisi kesinlikle yanlıştır?',
    'Farklı familyalarda bulunurlar',
    ['Aynı cinstedirler', 'Aynı âlemdedirler', 'Ortak atadan gelmişlerdir'],
    'Aynı tür olmak, üstteki bütün basamakların da ortak olmasını zorunlu kılar.',
  ),
  s(
    'orta',
    'Aşağıdaki sınıflandırma basamaklarından hangisi en çok sayıda canlıyı kapsar?',
    'Âlem',
    ['Şube', 'Familya', 'Cins'],
    'Basamak büyüdükçe kapsadığı canlı sayısı artar; en genişten en dara doğru gidilir.',
  ),
  s(
    'zor',
    'Domain (âlem üstü) kavramı sınıflandırmada nerede yer alır?',
    'Âlemden daha geniş bir basamaktır',
    [
      'Şube ile sınıf arasındadır',
      'Türden daha küçük bir birimdir',
      'Familya ile cins arasındadır',
    ],
    'Domain, hücre yapısı ve ribozomal RNA farklarına dayanan en üst basamaktır.',
  ),
  s(
    'kolay',
    'Canlılar kaç domain altında toplanır?',
    'Üç',
    ['İki', 'Dört', 'Altı'],
    'Üç domain vardır: Bakteri, Arke ve Ökarya. Altı âlem bu üç domainin içine dağılır.',
  ),
  s(
    'kolay',
    'Üç domain sistemine göre domainler aşağıdakilerden hangisidir?',
    'Bakteri, Arke ve Ökarya',
    [
      'Bitki, Hayvan ve Mantar',
      'Prokaryot, Ökaryot ve Virüs',
      'Bakteri, Mantar ve Protista',
    ],
    'Ökarya domaini protista, mantar, bitki ve hayvan âlemlerinin dördünü birden içine alır.',
  ),

  // ————— Tür kavramı ve popülasyon —————
  // Tür tanımının kilit noktası "verimli döl"; sorular bu ölçütü melez
  // örnekleri (katır, ırklar) üzerinden farklı açılardan yokluyor.
  s(
    'kolay',
    'Aynı türden bireylerin ortak özelliği aşağıdakilerden hangisidir?',
    'Kromozom sayıları ve yapıları aynıdır',
    [
      'Genotipleri tıpatıp aynıdır',
      'Fenotipleri tıpatıp aynıdır',
      'Hepsi aynı bölgede yaşar',
    ],
    'Tür içinde kalıtsal çeşitlilik bulunur; ortak olan kromozom takımıdır, genlerin kendisi değil.',
  ),
  s(
    'orta',
    'At ile eşeğin çiftleşmesinden doğan katırın kısır olması neyi gösterir?',
    'At ile eşeğin ayrı türler olduğunu',
    [
      'At ile eşeğin aynı tür olduğunu',
      'Katırın yeni bir tür oluşturduğunu',
      'İkisinin de aynı popülasyonda bulunduğunu',
    ],
    'Çiftleşebilmek yetmez; tür sayılmak için döllerin de üreyebilmesi gerekir.',
  ),
  s(
    'orta',
    'Tür tanımında geçen “verimli döl” ifadesi ne anlama gelir?',
    'Doğan yavruların da üreyebilmesi',
    [
      'Yavru sayısının çok olması',
      'Yavruların hızlı büyümesi',
      'Yavruların ana babaya çok benzemesi',
    ],
    'Verimli döl, tür sınırını çizen ölçüttür: döl kısırsa ana babası ayrı türdür.',
  ),
  s(
    'zor',
    'Bir grup bireyin aynı türe ait olduğunu gösteren en güvenilir ölçüt hangisidir?',
    'Doğal ortamda çiftleşip verimli döl verebilmeleri',
    [
      'Dış görünüşlerinin birbirine benzemesi',
      'Aynı bölgede yaşamaları',
      'Aynı besinle beslenmeleri',
    ],
    'Dış görünüş yanıltıcıdır; üreme ölçütü ise doğrudan kalıtsal uyumu sınar.',
  ),
  s(
    'orta',
    'Aynı bölgede yaşayan farklı popülasyonların oluşturduğu topluluğa ne ad verilir?',
    'Komünite',
    ['Popülasyon', 'Ekosistem', 'Biyosfer'],
    'Sıra şöyledir: birey – popülasyon – komünite – ekosistem – biyosfer.',
  ),
  s(
    'orta',
    'Çoban köpeği, buldog gibi köpek ırkları için hangisi doğrudur?',
    'Hepsi aynı türe aittir',
    [
      'Her ırk ayrı bir tür sayılır',
      'Aralarında verimli döl oluşmaz',
      'Farklı cinslere aittirler',
    ],
    'Irk, tür içindeki kalıtsal çeşitliliktir; ırklar çiftleştiğinde verimli döl verir.',
  ),
  s(
    'zor',
    'Aynı türe ait iki popülasyon uzun süre birbirinden yalıtılırsa ne olabilir?',
    'Zamanla ayrı türlere dönüşebilirler',
    [
      'Kromozom sayıları hemen ikiye katlanır',
      'İkisi de aynı anda yok olur',
      'Ampirik sınıflandırmaya dahil edilirler',
    ],
    'Gen alışverişi kesilince farklılıklar birikir; sonunda çiftleşseler bile verimli döl vermez olurlar.',
  ),
  s(
    'kolay',
    'Tür kavramıyla ilgili aşağıdakilerden hangisi yanlıştır?',
    'Bir türün bütün bireyleri birbirinin tıpatıp aynısıdır',
    [
      'Türün bireyleri ortak bir atadan gelir',
      'Türün bireyleri çiftleşince verimli döl verir',
      'Tür, sınıflandırmanın temel birimidir',
    ],
    'Aynı türün bireyleri arasında boy, renk, direnç gibi pek çok fark bulunur.',
  ),
  s(
    'orta',
    'Bir tür içindeki bireylerin birbirinden farklı olmasının temel nedeni nedir?',
    'Kalıtsal çeşitlilik ve çevre etkisi',
    [
      'Kromozom sayılarının farklı olması',
      'Farklı âlemlerde bulunmaları',
      'Farklı cinslerden gelmeleri',
    ],
    'Mayoz ve döllenme her bireye ayrı bir gen bileşimi verir; üstüne çevre koşulları eklenir.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi bir sınıflandırma basamağı değildir?',
    'Popülasyon',
    ['Familya', 'Takım', 'Şube'],
    'Popülasyon ekolojik bir kavramdır; sınıflandırma basamakları âlemden türe kadar olan yedi birimdir.',
  ),

  // ————— Âlemlerin karşılaştırılması —————
  // Âlem soruları tek tek özellik ezberi yerine "hangi âlemde hangisi yok"
  // biçiminde soruluyor; ÖSYM de ayırt edici özelliği bu kurguyla sorar.
  s(
    'kolay',
    'Altı âlem sınıflandırmasında aşağıdakilerden hangisi yer almaz?',
    'Virüsler',
    ['Arkeler', 'Protistler', 'Mantarlar'],
    'Virüslerin hücresel yapısı olmadığı için hiçbir âleme yerleştirilmezler.',
  ),
  s(
    'kolay',
    'Altı âlem sınıflandırmasındaki âlemler aşağıdakilerden hangisidir?',
    'Bakteriler, arkeler, protistler, mantarlar, bitkiler ve hayvanlar',
    [
      'Bakteriler, virüsler, protistler, mantarlar, bitkiler ve hayvanlar',
      'Arkeler, virüsler, mantarlar, bitkiler, hayvanlar ve algler',
      'Prokaryotlar, ökaryotlar, mantarlar, bitkiler, hayvanlar ve virüsler',
    ],
    'İlk iki âlem prokaryot, kalan dördü ökaryottur.',
  ),
  s(
    'orta',
    'Bakteriler ve arkeler âlemlerinin ortak özelliği aşağıdakilerden hangisidir?',
    'Üyelerinin tamamı prokaryot hücre yapısına sahiptir',
    [
      'İkisinin de üyeleri zorunlu parazittir',
      'İkisinin de hücre duvarında peptidoglikan bulunur',
      'İkisinin de üyeleri yalnızca ototroftur',
    ],
    'Peptidoglikan yalnızca bakterilerde vardır; arkeleri ayrı bir âlem yapan farklardan biri de budur.',
  ),
  s(
    'orta',
    'Ökaryot hücre yapısına sahip âlemler aşağıdakilerden hangisidir?',
    'Protistler, mantarlar, bitkiler ve hayvanlar',
    [
      'Bakteriler, arkeler, protistler ve mantarlar',
      'Yalnızca bitkiler ve hayvanlar',
      'Mantarlar, bitkiler, hayvanlar ve virüsler',
    ],
    'Ökaryot hücrede çekirdek zarı ve zarlı organeller bulunur; bu dört âlem Ökarya domainindedir.',
  ),
  s(
    'orta',
    'Hem tek hücreli hem çok hücreli üyeleri bulunan âlem aşağıdakilerden hangisidir?',
    'Mantarlar',
    ['Bitkiler', 'Hayvanlar', 'Arkeler'],
    'Bira mayası tek hücreli, şapkalı mantarlar çok hücrelidir; ikisi de mantarlar âlemindedir.',
  ),
  s(
    'orta',
    'Hücre duvarı bulunmayan tek âlem aşağıdakilerden hangisidir?',
    'Hayvanlar',
    ['Bitkiler', 'Mantarlar', 'Bakteriler'],
    'Hayvan hücresini yalnızca hücre zarı sınırlar; bu yüzden hayvanlar yer değiştirerek hareket edebilir.',
  ),
  s(
    'zor',
    'Aşağıdaki âlemlerden hangisinin bütün üyeleri heterotroftur?',
    'Hayvanlar',
    ['Protistler', 'Bakteriler', 'Bitkiler'],
    'Bakteriler ve protistler hem ototrof hem heterotrof üye barındırır; hayvanların tamamı besinini dışarıdan alır.',
  ),
  s(
    'orta',
    'Beslenme bakımından hem ototrof hem heterotrof üyeler barındıran âlem hangisidir?',
    'Protistler',
    ['Hayvanlar', 'Mantarlar', 'Bitkiler'],
    'Öglena ışıkta fotosentez yapar, karanlıkta hazır besin alır; amip ise tümüyle heterotroftur.',
  ),

  // ————— Bakteriler âlemi —————
  // Bakteriler hem hücre yapısı hem ekolojik görev yönünden soruluyor;
  // "tek organeli ribozom" ile "çürükçüllük" en sık çıkan iki ayrıntı.
  s(
    'kolay',
    'Bakterilerde kalıtım maddesi nerede bulunur?',
    'Sitoplazmada, çekirdek zarıyla çevrili olmadan',
    ['Çekirdek zarıyla çevrili çekirdekte', 'Mitokondrinin içinde', 'Kloroplastın içinde'],
    'Bakteride DNA halkasaldır ve sitoplazmada serbest durur; bu bölgeye çekirdekçik değil, nükleoid denir.',
  ),
  s(
    'kolay',
    'Bakteri hücresinde bulunan tek organel hangisidir?',
    'Ribozom',
    ['Mitokondri', 'Golgi aygıtı', 'Endoplazmik retikulum'],
    'Ribozom zarsız bir organeldir; bu yüzden prokaryot hücrede de bulunabilir.',
  ),
  s(
    'orta',
    'Bakterilerde ana DNA dışında bulunan küçük halkasal DNA parçasına ne ad verilir?',
    'Plazmit',
    ['Mezozom', 'Kapsül', 'Pilus'],
    'Plazmit çoğu zaman antibiyotik direnci gibi ek özellikler taşır ve bakteriler arasında aktarılabilir.',
  ),
  s(
    'orta',
    'Yuvarlak şekilli bakterilere verilen ad hangisidir?',
    'Kok',
    ['Basil', 'Spiril', 'Vibrio'],
    'Bakteriler şekillerine göre kok (yuvarlak), basil (çubuk) ve spiril (kıvrık) diye anılır.',
  ),
  s(
    'orta',
    'Çubuk şeklindeki bakterilere verilen ad hangisidir?',
    'Basil',
    ['Kok', 'Spiril', 'Diplokok'],
    'Verem ve tetanoz etkeni gibi pek çok bakteri basil biçimindedir.',
  ),
  s(
    'orta',
    'Bakterilerin eşeysiz çoğalma biçimi hangisidir?',
    'İkiye bölünme',
    ['Mayoz bölünme', 'Döllenme', 'Rejenerasyon'],
    'Uygun koşullarda bakteri yirmi dakikada bir bölünebilir; oluşan iki hücre kalıtsal olarak aynıdır.',
  ),
  s(
    'zor',
    'İki bakteri arasında sitoplazmik köprüyle plazmit aktarılmasına ne ad verilir?',
    'Konjugasyon',
    ['Sporlanma', 'İkiye bölünme', 'Mayoz bölünme'],
    'Konjugasyon bir üreme değil, gen aktarımıdır; bakterilerde kalıtsal çeşitliliği artırır.',
  ),
  s(
    'orta',
    'Bakterilerin olumsuz koşullarda dayanıklı bir yapıya dönüşmesine ne ad verilir?',
    'Endospor oluşumu',
    ['Konjugasyon', 'Fotosentez', 'Kemosentez'],
    'Endospor üreme değil, korunma yapısıdır: koşullar düzelince bakteri yeniden etkin hâle geçer.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi bakterilerin doğadaki yararlı görevlerinden biridir?',
    'Ölü canlıları çürüterek madde döngüsünü sürdürmek',
    [
      'Bitkilerde tohum oluşumunu başlatmak',
      'Hayvanlarda hücre bölünmesini yönetmek',
      'Atmosferdeki oksijenin tamamını tüketmek',
    ],
    'Çürükçül bakteriler olmasaydı ölü kalıntılar birikir, topraktaki mineraller yeniden kullanılamazdı.',
  ),
  s(
    'zor',
    'Azot bağlayıcı bakteriler için aşağıdakilerden hangisi doğrudur?',
    'Havadaki azot gazını bitkilerin kullanabileceği bileşiklere dönüştürürler',
    [
      'Havadaki karbondioksiti azota dönüştürürler',
      'Bitkilerden azot çalarak onları öldürürler',
      'Yalnızca hayvanların bağırsağında yaşayabilirler',
    ],
    'Baklagillerin köklerindeki yumrularda yaşayan bu bakteriler doğal gübreleme sağlar.',
  ),
  s(
    'orta',
    'Işık yerine kimyasal tepkimelerden elde ettiği enerjiyle besin üreten bakterilere ne ad verilir?',
    'Kemoototrof bakteriler',
    ['Fotoototrof bakteriler', 'Saprofit bakteriler', 'Parazit bakteriler'],
    'Nitrit ve nitrat bakterileri kemoototroftur; azot döngüsünde önemli görev alırlar.',
  ),
  s(
    'orta',
    'Bakterilerde hücre duvarının dışını saran, kurumaya ve savunma hücrelerine karşı koruyan yapı hangisidir?',
    'Kapsül',
    ['Kamçı', 'Ribozom', 'Plazmit'],
    'Kapsüllü bakteriler bağışıklık sisteminden daha kolay kaçtığı için genellikle daha hastalık yapıcıdır.',
  ),

  // ————— Arkeler âlemi —————
  // Arkeler bakterilerden ayrılmalarıyla soruluyor: peptidoglikansız duvar
  // ve aşırı ortamlara dayanıklılık.
  s(
    'orta',
    'Arkeleri bakterilerden ayıran temel özellik nedir?',
    'Hücre duvarlarında peptidoglikan bulunmaması',
    [
      'Çekirdek zarlarının bulunması',
      'Ribozom taşımamaları',
      'Tamamının çok hücreli olması',
    ],
    'Arkeler prokaryottur ama hücre duvarı ve zar yapısı bakterilerden farklıdır; bu yüzden ayrı bir domaindir.',
  ),
  s(
    'orta',
    'Bataklıklarda ve geviş getiren hayvanların sindirim kanalında metan üreten arkelere ne ad verilir?',
    'Metanojenler',
    ['Halofiller', 'Termofiller', 'Siyanobakteriler'],
    'Metanojenler oksijensiz ortamlarda yaşar; ürettikleri metan biyogaz üretiminde kullanılır.',
  ),
  s(
    'orta',
    'Aşırı tuzlu ortamlarda yaşayabilen arkelere ne ad verilir?',
    'Halofiller',
    ['Metanojenler', 'Termofiller', 'Asidofiller'],
    'Tuz göllerinin pembemsi rengi çoğu zaman halofil arkelerin yoğunluğundan gelir.',
  ),
  s(
    'zor',
    'Arkelerin kaynar su ve asitli ortamlarda yaşayabilmesi neyle açıklanır?',
    'Hücre zarı ve enzim yapılarının bu koşullara dayanıklı olmasıyla',
    [
      'Çekirdek zarına sahip olmalarıyla',
      'Kloroplast taşımalarıyla',
      'Çok hücreli olmalarıyla',
    ],
    'Aşırı koşullarda çoğu proteinin yapısı bozulur; arke enzimleri bu koşullarda görev yapacak biçimdedir.',
  ),
  s(
    'orta',
    'Arkeler hangi domain altında incelenir?',
    'Arke domaini',
    ['Bakteri domaini', 'Ökarya domaini', 'Virüs domaini'],
    'Üç domainden biri tümüyle arkelere ayrılmıştır; bu, onların bakterilerden ne kadar farklı olduğunu gösterir.',
  ),

  // ————— Protista âlemi —————
  s(
    'orta',
    'Öglena ile ilgili aşağıdakilerden hangisi doğrudur?',
    'Kloroplast taşıdığı için ışıklı ortamda fotosentez yapabilir',
    [
      'Prokaryot bir canlıdır',
      'Hücre duvarı kitinden oluşur',
      'Çok hücreli bir canlıdır',
    ],
    'Öglena hem ototrof hem heterotrof beslenebildiği için protistlerin sınıflandırılmasını zorlaştıran örneklerdendir.',
  ),
  s(
    'orta',
    'Terliksi hayvanın (paramesyum) hareketini sağlayan yapı hangisidir?',
    'Siller',
    ['Kamçı', 'Yalancı ayak', 'Çizgili kas'],
    'Sil kısa ve çok sayıdadır; senkronize vuruşlarıyla hücreyi suda ilerletir.',
  ),
  s(
    'orta',
    'Amibin hem hareket etmesini hem besin almasını sağlayan yapı hangisidir?',
    'Yalancı ayak (psödopot)',
    ['Sil', 'Kamçı', 'Kapsül'],
    'Amip sitoplazmasını uzatarak ilerler ve aynı uzantılarla besini sarıp içine alır.',
  ),
  s(
    'orta',
    'Sıtma hastalığına yol açan Plasmodium hangi âlemde incelenir?',
    'Protistler',
    ['Bakteriler', 'Mantarlar', 'Arkeler'],
    'Plasmodium tek hücreli bir ökaryottur; anofel sivrisineğiyle insana taşınır.',
  ),
  s(
    'orta',
    'Sularda yaşayan, fotosentez yaparak atmosferdeki oksijenin önemli bölümünü üreten protistler hangileridir?',
    'Algler (su yosunları)',
    ['Mantarlar', 'Arkeler', 'Süngerler'],
    'Denizlerdeki algler karadaki bütün ormanlardan daha çok oksijen üretir.',
  ),
]

export const SINIFLANDIRMA_BOYUTU = SINIFLANDIRMA_HAVUZU.length
