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
]

export const SINIFLANDIRMA_BOYUTU = SINIFLANDIRMA_HAVUZU.length
