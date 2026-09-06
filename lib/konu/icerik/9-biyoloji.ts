import { kart, konu, program, tema } from '../tip'

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
        'Sağlığa katkısı',
        'Aşı, antibiyotik ve organ nakli biyolojik bilginin doğrudan sonucu. Ortalama ömür bir yüzyılda ikiye katlandı.',
      ),
      kart(
        'Tarıma katkısı',
        'Verimli tohum ve hastalığa dayanıklı çeşitler biyoloji sayesinde geliştirildi.',
      ),
      kart(
        'Çevreye bakışı değiştirdi',
        'Ekosistem kavramı, bir türün kaybının bütün ağı etkilediğini gösterdi. Koruma politikaları bu bilgiden doğdu.',
      ),
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
        'DNA’nın yapısı',
        'Watson, Crick ve Franklin’in çalışmalarıyla 1953’te çift sarmal çözüldü; moleküler biyoloji böyle başladı.',
      ),
      kart(
        'Genom projeleri',
        'İnsan genomunun okunması hastalık genlerinin bulunmasını ve kişiye özgü tedaviyi mümkün kıldı.',
      ),
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
      ),
    ]),
    konu('byl9-arastirma', 'Bilimsel Araştırma Süreçleri', [
      kart(
        'Adımlar',
        'Gözlem, soru, hipotez, deney, veri toplama, analiz ve sonuç. Sonuç yeni bir soruya kapı açar.',
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
        'Tekrarlanabilirlik',
        'Aynı koşullarda başkalarının da aynı sonucu alabilmesi gerekir. Tekrarlanamayan sonuç kabul edilmez.',
      ),
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
        'Üreme, büyüme, uyum',
        'Canlılar çoğalır, gelişir; varyasyon ve adaptasyon sayesinde türler değişen koşullara uyum sağlar.',
      ),
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
        'Yapıya katılır ve tepkimeleri düzenler: kalsiyum kemikte, demir hemoglobinde, iyot tiroit hormonunda.',
      ),
      kart(
        'Asit, baz ve pH',
        'pH 7 nötr, altı asidik, üstü baziktir. Enzimler yalnızca dar bir pH aralığında çalışır.',
      ),
    ]),
    konu('byl9-organik', 'Organik Moleküller', [
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
        'Enzimi etkileyen etmenler',
        'Sıcaklık, pH, substrat ve enzim derişimi. Aşırı sıcak ve uygunsuz pH proteini bozar (denatürasyon).',
      ),
      kart(
        'Nükleik asitler ve vitaminler',
        'DNA kalıtım bilgisini taşır, RNA onu kullanır. Vitaminler enerji vermez ama tepkimelerin düzenleyicisidir.',
      ),
      kart(
        'Dehidrasyon ve hidroliz',
        'Büyük moleküller su çıkararak birleşir (dehidrasyon), su eklenerek parçalanır (hidroliz).',
      ),
    ]),
  ]),
  tema('byl9-t2', 'Organizasyon', [
    konu('byl9-hucre-tur', 'Prokaryot ve Ökaryot Hücre', [
      kart(
        'Temel fark',
        'Prokaryotta zarla çevrili çekirdek ve organel yoktur; ökaryotta ikisi de vardır.',
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
        'Ortak yanları',
        'İkisinde de hücre zarı, sitoplazma, ribozom ve DNA bulunur. Bunlar yaşamın asgari donanımıdır.',
      ),
    ]),
    konu('byl9-zar', 'Hücre Zarı', [
      kart(
        'Yapısı',
        'Çift katlı fosfolipit tabakası; içine gömülü proteinler, kolesterol ve karbonhidrat zincirleri bulunur.',
      ),
      kart(
        'Akıcı mozaik model',
        'Zar sabit bir duvar değil; proteinler lipit denizinde yüzer. Bu yüzden esnek ve onarılabilirdir.',
      ),
      kart(
        'Seçici geçirgenlik',
        'Zar neyin gireceğine karar verir. Küçük ve yağda çözünenler kolay geçer, büyük ve yüklüler taşıyıcı ister.',
      ),
      kart(
        'Hücre duvarı ile karışmasın',
        'Duvar bitki, mantar ve bakterilerde zarın dışındadır; cansızdır ve tam geçirgendir.',
      ),
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
        'Sitoplazma hareketi',
        'Bitki hücrelerinde sitoplazmanın dolaşması maddelerin hücre içinde dağılmasını hızlandırır.',
      ),
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
        'Koful',
        'Depolama ve boşaltım yapar. Bitki hücresinde tek ve büyüktür, hücreye diklik verir.',
      ),
    ]),
    konu('byl9-madde-gecis', 'Hücre Zarından Madde Geçişleri', [
      kart(
        'Pasif taşıma',
        'Enerji harcanmaz; madde çok olduğu yerden az olduğu yere geçer.',
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
        'Aktif taşıma',
        'Az olduğu yerden çok olduğu yere taşıma. ATP harcanır; sodyum-potasyum pompası örnektir.',
      ),
      kart(
        'Endositoz ve ekzositoz',
        'Çok büyük maddeler zarla kese hâlinde alınır (endositoz) ya da dışarı verilir (ekzositoz).',
      ),
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
        'İkili adlandırma',
        'Linne’nin yöntemi: cins adı büyük, tür adı küçük harfle yazılır ve ikisi eğik dizilir (Homo sapiens).',
      ),
      kart(
        'Kategoriler',
        'Âlemden türe doğru daralır: âlem, şube, sınıf, takım, aile, cins, tür. Daraldıkça ortak özellik artar.',
      ),
      kart(
        'Tür nedir?',
        'Doğada çiftleşip verimli döl verebilen bireyler topluluğu. Katır kısır olduğu için ayrı bir tür değildir.',
      ),
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
        'Protistler ve mantarlar',
        'Protistler çoğunlukla tek hücreli ökaryotlar; mantarlar hazır beslenir ve dış sindirim yapar.',
      ),
      kart(
        'Bitkiler ve hayvanlar',
        'Bitkiler fotosentezle kendi besinini üretir; hayvanlar hazır beslenir ve hareket eder.',
      ),
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
    ]),
  ]),
])
