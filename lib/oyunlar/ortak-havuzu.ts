/**
 * Canlıların Ortak Özellikleri oyununun soru havuzu.
 *
 * Kapsam 9. sınıf "Canlıların Ortak Özellikleri" ünitesi, yani TYT Biyoloji'nin
 * ilk konusu: hücresel yapı, beslenme, solunum, boşaltım, hareket, uyarılara
 * tepki, üreme, büyüme-gelişme, metabolizma, homeostazi, uyum ve organizasyon.
 * 11-12. sınıfa giren hiçbir başlık (sinir sistemi, fotosentez tepkimeleri,
 * kalıtım hesapları) buraya alınmadı.
 *
 * Çeldiriciler soruyla birlikte yazılıyor: her birinin **açıkça yanlış ama
 * akla yatkın** olması gerekiyor. Rastgele seçilseydi çoğu soru okumadan
 * elenebilirdi.
 */

import { soruKur as s, type BiyolojiSorusu } from './biyoloji'

export const ORTAK_HAVUZU: readonly BiyolojiSorusu[] = [
  s(
    'kolay',
    'Canlıyı cansızdan ayıran, canlılığın en küçük yapı ve görev birimi hangisidir?',
    'Hücre',
    ['Doku', 'Organel', 'Molekül'],
    'Virüsler dışında bütün canlılar hücrelerden oluşur. Organel hücrenin parçası, doku ise hücrelerin topluluğudur.',
  ),
  s(
    'kolay',
    'Aşağıdakilerden hangisi hücresel yapıya sahip değildir?',
    'Virüs',
    ['Bakteri', 'Amip', 'Mantar'],
    'Virüslerin hücresi yoktur; bu yüzden canlıların ortak özelliklerini taşımaz ve sınıflandırmaya alınmaz.',
  ),
  s(
    'kolay',
    'Canlının iç ortamını değişen koşullara rağmen dengede tutmasına ne ad verilir?',
    'Homeostazi',
    ['Metabolizma', 'Adaptasyon', 'Mutasyon'],
    'Vücut sıcaklığının, kan şekerinin, su-tuz dengesinin belirli sınırlar içinde tutulması homeostazidir.',
  ),
  s(
    'kolay',
    'Hücrede gerçekleşen bütün yapım ve yıkım tepkimelerine verilen ortak ad hangisidir?',
    'Metabolizma',
    ['Homeostazi', 'Fotosentez', 'Boşaltım'],
    'Metabolizma = anabolizma (yapım) + katabolizma (yıkım). İkisi de bütün canlılarda görülür.',
  ),
  s(
    'orta',
    'Hücrede yapım (sentez) tepkimelerinin tümüne ne denir?',
    'Anabolizma',
    ['Katabolizma', 'Homeostazi', 'Difüzyon'],
    'Anabolizma enerji harcayarak büyük molekül kurar; katabolizma büyük molekülü parçalayıp enerji açığa çıkarır.',
  ),
  s(
    'kolay',
    'Besinlerin parçalanarak enerjiye dönüştürülmesi hangi ortak özelliktir?',
    'Solunum',
    ['Beslenme', 'Boşaltım', 'Sindirim'],
    'Solunum oksijenli ya da oksijensiz olabilir ama bütün canlılarda vardır; amacı besindeki enerjiyi ATP’ye çevirmektir.',
  ),
  s(
    'orta',
    'Solunumla ilgili olarak bütün canlılar için ortak olan hangisidir?',
    'Besinlerden enerji elde etmesi',
    ['Oksijen kullanması', 'Akciğer bulundurması', 'Karbondioksit vermesi'],
    'Oksijen ve akciğer her canlıda yok; ortak olan tek şey besinden enerji (ATP) elde edilmesidir.',
  ),
  s(
    'zor',
    'Oksijensiz solunum yapan canlılar için hangisi doğrudur?',
    'Glikozu tam parçalayamaz, az enerji elde eder',
    [
      'Hiç ATP üretemez',
      'Yalnızca ökaryot canlılarda görülür',
      'Glikozu oksijenli solunumdan daha çok parçalar',
    ],
    'Oksijensiz solunumda glikoz tam parçalanmadığı için elde edilen ATP, oksijenli solunuma göre çok azdır.',
  ),
  s(
    'kolay',
    'Metabolizma sonucu oluşan atık maddelerin dışarı atılması hangi ortak özelliktir?',
    'Boşaltım',
    ['Sindirim', 'Solunum', 'Üreme'],
    'Boşaltım her canlıda var; yalnız yapısı değişir: tek hücrelide hücre zarından, insanda böbrekle.',
  ),
  s(
    'kolay',
    'Türün devamını sağlayan ortak özellik hangisidir?',
    'Üreme',
    ['Büyüme', 'Beslenme', 'Hareket'],
    'Üreme bireyin yaşaması için zorunlu değildir; ama tür ancak üreyerek devam eder.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi bireyin hayatta kalması için zorunlu değildir?',
    'Üreme',
    ['Solunum', 'Beslenme', 'Boşaltım'],
    'Üremeyen bir birey yaşamını sürdürebilir; solunum, beslenme ve boşaltım durursa süremez.',
  ),
  s(
    'kolay',
    'Bir canlının kütle ve hacminin geri dönüşümsüz olarak artmasına ne denir?',
    'Büyüme',
    ['Gelişme', 'Üreme', 'Metabolizma'],
    'Büyüme niceliksel bir artıştır; gelişme ise hücrelerin farklılaşıp görev kazanmasıdır.',
  ),
  s(
    'orta',
    'Hücrelerin farklılaşarak görev kazanması ve canlının olgunlaşması hangisidir?',
    'Gelişme',
    ['Büyüme', 'Üreme', 'Adaptasyon'],
    'Büyüme "daha büyük olmak", gelişme "daha yetkin olmak"tır; ikisi birlikte yürür.',
  ),
  s(
    'orta',
    'Metabolizma hızı hangi dönemde en yüksektir?',
    'Büyüme ve gelişme döneminde',
    ['Yaşlılık döneminde', 'Kış uykusu sırasında', 'Uyku sırasında'],
    'Büyüme döneminde yapım tepkimeleri hızlandığı için metabolizma en yüksek seviyededir.',
  ),
  s(
    'kolay',
    'Bir canlının yaşadığı ortama kalıtsal olarak uymasına ne ad verilir?',
    'Adaptasyon',
    ['Homeostazi', 'Modifikasyon', 'Mutasyon'],
    'Adaptasyon kalıtsaldır ve yavrulara geçer; modifikasyon çevrenin etkisiyle oluşur, kalıtsal değildir.',
  ),
  s(
    'orta',
    'Kutup tilkisinin kulaklarının küçük, çöl tilkisinin kulaklarının büyük olması hangisine örnektir?',
    'Adaptasyon',
    ['Homeostazi', 'Modifikasyon', 'Büyüme'],
    'Kulak yüzeyi ısı kaybını belirler: soğukta küçük kulak ısıyı korur, sıcakta büyük kulak ısıyı atar.',
  ),
  s(
    'kolay',
    'Aşağıdakilerden hangisi "uyarılara tepki" özelliğine örnektir?',
    'Ayçiçeğinin güneşe dönmesi',
    ['Buzun suda erimesi', 'Demirin paslanması', 'Mumun ısıyla erimesi'],
    'Uyarana tepki canlılığa özgüdür; cansız varlıklardaki değişimler fiziksel ya da kimyasal olaylardır.',
  ),
  s(
    'zor',
    'Aşağıdakilerden hangisi hem canlılarda hem cansız varlıklarda görülebilir?',
    'Hareket',
    ['Üreme', 'Boşaltım', 'Metabolizma'],
    'Rüzgârla sürüklenen bir yaprak da hareket eder; hareketi canlılık belirtisi yapan şey uyarana tepki olmasıdır.',
  ),
  s(
    'orta',
    'Canlılardaki organizasyon (düzenlilik) hangi sırayla ilerler?',
    'Hücre – doku – organ – sistem – organizma',
    [
      'Doku – hücre – organ – sistem – organizma',
      'Hücre – organ – doku – sistem – organizma',
      'Organel – doku – hücre – organ – organizma',
    ],
    'Her basamak bir öncekilerden kurulur; tek hücrelilerde organizasyon hücre basamağında kalır.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi organizasyon özelliğiyle ilgilidir?',
    'Benzer hücrelerin bir araya gelip doku oluşturması',
    [
      'Canlının çevresine uyum sağlaması',
      'Atık maddelerin dışarı atılması',
      'Canlının uyarana tepki vermesi',
    ],
    'Organizasyon, canlının yapısındaki basamaklı düzendir: hücreden organizmaya doğru karmaşıklaşır.',
  ),
  s(
    'kolay',
    'Bütün canlılarda kalıtsal bilgiyi taşıyan molekül hangisidir?',
    'DNA',
    ['ATP', 'Protein', 'Glikoz'],
    'DNA kalıtsal bilgiyi taşır ve eşlenerek yavruya aktarılır; ATP enerji taşır, protein görev yapar.',
  ),
  s(
    'kolay',
    'Hücrede enerjinin taşınmasında ve kullanılmasında ortak olan molekül hangisidir?',
    'ATP',
    ['DNA', 'RNA', 'Selüloz'],
    'Besinlerden çıkan enerji doğrudan kullanılmaz, önce ATP’ye aktarılır. Bütün canlılar ATP kullanır.',
  ),
  s(
    'kolay',
    'Bütün canlıların yapısında en fazla bulunan madde hangisidir?',
    'Su',
    ['Protein', 'Karbonhidrat', 'Yağ'],
    'Su, hücredeki tepkimelerin ortamıdır ve canlı kütlesinin büyük bölümünü oluşturur.',
  ),
  s(
    'kolay',
    'Kendi besinini kendi üreten canlılara ne ad verilir?',
    'Ototrof',
    ['Heterotrof', 'Saprofit', 'Parazit'],
    'Ototroflar inorganik maddelerden organik besin üretir; heterotroflar hazır besinle beslenir.',
  ),
  s(
    'kolay',
    'Hazır besinle beslenen canlılara ne ad verilir?',
    'Heterotrof',
    ['Ototrof', 'Fotoototrof', 'Kemoototrof'],
    'Hayvanlar, mantarlar ve birçok bakteri heterotroftur: besini dışarıdan alır.',
  ),
  s(
    'orta',
    'Işık enerjisini kullanarak kendi besinini üreten canlılara ne denir?',
    'Fotoototrof',
    ['Kemoototrof', 'Heterotrof', 'Saprofit'],
    'Bitkiler, algler ve siyanobakteriler fotoototroftur; enerji kaynakları güneş ışığıdır.',
  ),
  s(
    'orta',
    'Kimyasal tepkimelerden elde ettiği enerjiyle besin üreten canlılara ne denir?',
    'Kemoototrof',
    ['Fotoototrof', 'Saprofit', 'Parazit'],
    'Kemoototroflar ışıksız ortamlarda da besin üretebilen bakterilerdir (nitrit ve kükürt bakterileri gibi).',
  ),
  s(
    'orta',
    'Ölü ve çürümüş organik maddelerle beslenen canlılara ne ad verilir?',
    'Saprofit',
    ['Parazit', 'Ototrof', 'Kemoototrof'],
    'Saprofitler (çürükçüller) madde döngüsünü tamamlar: organik atığı ayrıştırıp toprağa döndürür.',
  ),
  s(
    'orta',
    'Aşağıdakilerden hangisi bütün canlıların ortak özelliği değildir?',
    'Fotosentez yapmak',
    ['Beslenmek', 'Solunum yapmak', 'Boşaltım yapmak'],
    'Fotosentezi yalnızca klorofil taşıyan canlılar yapar; beslenme, solunum ve boşaltım her canlıda vardır.',
  ),
  s(
    'zor',
    'Bir canlıda üreme, büyüme ve gelişme görülüyorsa aşağıdakilerden hangisi kesinlikle söylenir?',
    'Metabolik faaliyetleri vardır',
    ['Ototroftur', 'Çok hücrelidir', 'Oksijenli solunum yapar'],
    'Üreme, büyüme ve gelişme enerji ister; enerjiyi de metabolizma sağlar. Beslenme şekli ve hücre sayısı ise değişebilir.',
  ),
]

export const ORTAK_BOYUTU = ORTAK_HAVUZU.length
