import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Biyoloji — Maarif Modeli.
 *
 * Program iki tema: **Yaşam** (canlılığın ortak özellikleri ve temel
 * bileşenler) ve **Organizasyon** (hücre, sınıflandırma). Eski programın
 * "Canlılar Dünyası" ünitelendirmesi kullanılmıyor.
 */
export const biyoloji9 = program('biyoloji', 9, [
  tema('byl9-t1', 'Yaşam', [
    konu('byl9-bilim', 'Biyoloji ve Bilimin Doğası', [
      kart(
        'Biyoloji neyi inceler?',
        'Canlıyı ve yaşamı inceler. Moleküllerden ekosisteme kadar her düzeyde çalışır; tıp, tarım ve çevre bilimlerinin temelidir.',
      ),
      kart(
        'Bilimsel bilgi kesin değildir',
        'Yeni kanıt geldiğinde değişebilir. Bu bir zayıflık değil, bilimin kendini düzeltme yolu.',
      ),
      kart(
        'Hipotez, teori, kanun',
        'Hipotez sınanabilir tahmin; teori çok sayıda kanıtla desteklenen açıklama; kanun gözlenen düzenli ilişkinin ifadesi. Teori kanuna dönüşmez, ikisi ayrı iş yapar.',
      ),
      kart(
        'Kontrol grubu neden var?',
        'Değişkenin etkisini görebilmek için. Bağımsız değişken uygulanmayan grup, karşılaştırma ölçütüdür.',
      ),
      kart(
        'Bilimsel etik',
        'Veriyi çarpıtmamak, başkasının çalışmasını kaynak göstermek, canlılara zarar vermemek. Etiği olmayan araştırma bilimsel de sayılmaz.',
      ),
    ]),
    konu('byl9-ortak', 'Canlıların Ortak Özellikleri', [
      kart(
        'Hepsinde hücre var',
        'Canlılığın en küçük birimi hücredir. Virüsler hücresel yapıya sahip olmadığı için tam canlı sayılmaz.',
      ),
      kart(
        'Metabolizma',
        'Yapım (anabolizma) ve yıkım (katabolizma) tepkimelerinin toplamı. Yapım enerji harcar, yıkım enerji açığa çıkarır.',
      ),
      kart(
        'Homeostazi',
        'İç ortamı dengede tutma. Terleme, titreme, kan şekerinin ayarlanması hep bu amaçla olur.',
      ),
      kart(
        'Uyarıya tepki',
        'Canlı, çevresindeki değişimi algılar ve karşılık verir. Bitkinin ışığa yönelmesi de bir tepkidir.',
      ),
      kart(
        'Adaptasyon ve varyasyon',
        'Varyasyon bireyler arasındaki farklılık, adaptasyon ortama uyum sağlatan kalıtsal özellik. Varyasyon olmadan adaptasyon olmaz.',
      ),
      kart(
        'Üreme ve büyüme',
        'Üreme türün devamı içindir, bireyin yaşaması için şart değildir. Büyüme hücre sayısının ve hacminin artmasıdır.',
      ),
    ]),
    konu('byl9-inorganik', 'Su, Mineraller ve Asit-Baz', [
      kart(
        'Su neden vazgeçilmez?',
        'İyi bir çözücüdür, tepkimelere girer, öz ısısı yüksek olduğu için vücut sıcaklığını dengede tutar. Hücrede en çok bulunan moleküldür.',
      ),
      kart(
        'Mineraller enerji vermez',
        'Düzenleyicidir. Demir hemoglobinde, kalsiyum kemikte ve kas kasılmasında, iyot tiroit hormonunda görev alır.',
      ),
      kart(
        'pH ölçeği',
        '0–14 arası. 7 nötr, altı asit, üstü baz. Kan pH’si 7,4 dolayında dar bir aralıkta tutulur; sapması ölümcüldür.',
      ),
      kart(
        'Tampon çözelti',
        'Asit ya da baz eklendiğinde pH’nin sert değişmesini engeller. Kandaki karbonat tamponu buna örnektir.',
      ),
    ]),
    konu('byl9-karbonhidrat', 'Karbonhidratlar', [
      kart(
        'Birincil enerji kaynağı',
        'Hücrenin ilk başvurduğu yakıt. 1 gramı yaklaşık 4 kalori verir. C, H, O içerir.',
      ),
      kart(
        'Monosakkaritler',
        'En küçük birim: glikoz, fruktoz, galaktoz. Sindirilmeden kana geçebilirler.',
      ),
      kart(
        'Disakkaritler',
        'İki monosakkarit: maltoz (glikoz+glikoz), sükroz (glikoz+fruktoz), laktoz (glikoz+galaktoz).',
      ),
      kart(
        'Polisakkaritler',
        'Nişasta bitkide depo, glikojen hayvanda depo, selüloz bitki çeperinde yapı, kitin mantar ve böcek dış iskeletinde bulunur.',
      ),
      kart(
        'Selülozu sindiremeyiz',
        'İnsanda selülaz enzimi yoktur. Yine de posa olarak bağırsak hareketini düzenler.',
      ),
    ]),
    konu('byl9-lipit', 'Lipitler', [
      kart(
        'En çok enerji veren molekül',
        '1 gramı yaklaşık 9 kalori. Yavaş yıkıldığı için birincil değil, depo enerji kaynağıdır.',
      ),
      kart(
        'Doymuş ve doymamış yağ',
        'Doymuş yağda çift bağ yoktur, oda sıcaklığında katıdır (tereyağı). Doymamış yağ sıvıdır (zeytinyağı) ve sağlık için daha uygundur.',
      ),
      kart(
        'Fosfolipit',
        'Bir ucu suyu seven, öteki ucu suyu iten molekül. Hücre zarının iki katlı yapısını bu ikilik kurar.',
      ),
      kart(
        'Steroitler',
        'Kolesterol zarın akıcılığını ayarlar; ayrıca D vitamini ve eşey hormonlarının ham maddesidir.',
      ),
    ]),
    konu('byl9-protein', 'Proteinler', [
      kart(
        'Amino asitler',
        'Proteinin yapı taşı. 20 çeşit vardır; 8’ini insan üretemez, besinle almak zorundadır (temel amino asit).',
      ),
      kart(
        'Peptit bağı',
        'İki amino asit arasında su açığa çıkararak kurulan bağ. Bağ sayısı = amino asit sayısı − 1.',
      ),
      kart(
        'Sıra her şeyi belirler',
        'Amino asit dizilimi değişirse protein de işlevi de değişir. Diziyi belirleyen DNA’dır.',
      ),
      kart(
        'Denatürasyon',
        'Yüksek sıcaklık ya da uygun olmayan pH proteinin şeklini bozar, işlev kaybolur. Yumurtanın pişmesi geri dönüşsüz örnektir.',
      ),
      kart(
        'Proteinin görevleri',
        'Yapı (kolajen), taşıma (hemoglobin), savunma (antikor), düzenleme (bazı hormonlar) ve hızlandırma (enzim).',
      ),
    ]),
    konu('byl9-enzim', 'Enzimler', [
      kart(
        'Enzim ne yapar?',
        'Tepkimenin aktivasyon enerjisini düşürerek hızlandırır. Kendisi değişmeden çıkar, tekrar tekrar kullanılır.',
      ),
      kart(
        'Anahtar-kilit',
        'Her enzim yalnızca kendi substratına uyar. Bu yüzden enzimler özgüldür, bir enzim her işi yapamaz.',
      ),
      kart(
        'Sıcaklık ve pH',
        'Optimum değerde hız en yüksektir. Sıcaklık çok artarsa enzim denatüre olur ve etkinlik geri gelmez; düşük sıcaklıkta yalnızca yavaşlar.',
      ),
      kart(
        'Substrat derişimi',
        'Artarken hız artar, ama bütün enzimler dolduğunda hız sabitlenir. Daha fazla substrat artık hızı değiştirmez.',
      ),
      kart(
        'Kofaktör ve koenzim',
        'Bazı enzimler tek başına çalışamaz. Mineral yardımcıya kofaktör, vitamin kökenli organik yardımcıya koenzim denir.',
      ),
    ]),
    konu('byl9-nukleik', 'Vitaminler, Nükleik Asitler ve ATP', [
      kart(
        'Vitaminler enerji vermez',
        'Düzenleyicidir. A, D, E, K yağda çözünür ve depolanır; B ve C suda çözünür, fazlası atılır, her gün alınmalıdır.',
      ),
      kart(
        'DNA ve RNA farkı',
        'DNA çift zincir, şekeri deoksiriboz, bazı timin. RNA tek zincir, şekeri riboz, bazı urasil.',
      ),
      kart(
        'Baz eşleşmesi',
        'DNA’da adenin timinle iki, guanin sitozinle üç hidrojen bağı yapar. Bu yüzden A=T ve G=C sayıları eşittir.',
      ),
      kart(
        'ATP hücrenin parasıdır',
        'Enerji fosfat bağlarında durur. Son fosfat koptuğunda ADP’ye dönüşür ve enerji açığa çıkar. Depolanmaz, gerektiğinde üretilir.',
      ),
    ]),
  ]),
  tema('byl9-t2', 'Organizasyon', [
    konu('byl9-hucre', 'Hücrenin Keşfi ve Çeşitleri', [
      kart(
        'Hücre teorisi',
        'Bütün canlılar hücrelerden oluşur, hücre canlılığın temel birimidir ve her hücre kendinden önceki bir hücreden meydana gelir.',
      ),
      kart(
        'Prokaryot hücre',
        'Çekirdeği ve zarlı organeli yoktur; DNA sitoplazmada serbesttir. Yalnız ribozom bulunur. Bakteri ve arkeler böyledir.',
      ),
      kart(
        'Ökaryot hücre',
        'Zarla çevrili çekirdeği ve organelleri vardır. Protista, bitki, mantar ve hayvan hücreleri bu gruptadır.',
      ),
      kart(
        'Bitki ve hayvan hücresi',
        'Bitkide çeper, kloroplast ve büyük koful vardır. Hayvanda sentrozom bulunur, çeper yoktur.',
      ),
    ]),
    konu('byl9-zar', 'Hücre Zarı ve Madde Geçişi', [
      kart(
        'Akıcı mozaik model',
        'Zar iki katlı fosfolipitten oluşur, aralarına proteinler gömülüdür ve bu yapı akışkandır. Seçici geçirgendir.',
      ),
      kart(
        'Pasif taşıma',
        'Enerji harcanmaz, madde çoktan aza gider. Difüzyon, ozmoz ve kolaylaştırılmış difüzyon bu gruptadır.',
      ),
      kart(
        'Ozmoz',
        'Suyun, kendisinin çok olduğu yerden az olduğu yere zardan geçişi. Hücreyi şişirir ya da büzer.',
      ),
      kart(
        'Aktif taşıma',
        'Azdan çoka, derişim farkına karşı taşıma. ATP ve taşıyıcı protein gerekir. Sodyum-potasyum pompası örnektir.',
      ),
      kart(
        'Endositoz ve ekzositoz',
        'Büyük moleküller zardan geçemez; kese oluşturularak alınır (endositoz) ya da atılır (ekzositoz). İkisi de enerji ister.',
      ),
    ]),
    konu('byl9-organel', 'Sitoplazma ve Organeller', [
      kart(
        'Ribozom',
        'Protein üretir. Zarsızdır ve bütün hücrelerde bulunur; prokaryotta da vardır.',
      ),
      kart(
        'Endoplazmik retikulum',
        'Granüllü ER üzerinde ribozom taşır, protein işler. Granülsüz ER yağ üretir ve zehirleri etkisizleştirir.',
      ),
      kart(
        'Golgi',
        'Gelen maddeyi paketler, salgı hâline getirir. Salgı yapan hücrelerde (tükürük bezi) bol bulunur.',
      ),
      kart(
        'Mitokondri',
        'Oksijenli solunumla ATP üretir. Kendi DNA’sı ve ribozomu vardır, kendini eşleyebilir. Kas hücresinde sayısı fazladır.',
      ),
      kart(
        'Lizozom ve koful',
        'Lizozom sindirim enzimi taşır, yaşlı yapıları parçalar. Koful depolama ve boşaltım yapar; bitkide büyüktür.',
      ),
      kart(
        'Kloroplast',
        'Fotosentez yapar, klorofil içerir. Yalnız bitki ve bazı protistalarda bulunur; kendi DNA’sı vardır.',
      ),
    ]),
    konu('byl9-cekirdek', 'Çekirdek', [
      kart(
        'Çekirdeğin görevi',
        'Kalıtım maddesini taşır ve hücrenin bütün etkinliklerini yönetir. Çekirdeği alınan hücre bir süre sonra ölür.',
      ),
      kart(
        'Çekirdek zarı',
        'Çift katlıdır ve porludur. Porlar sayesinde RNA ve proteinler sitoplazmayla alışveriş yapabilir.',
      ),
      kart('Çekirdekçik', 'Ribozomun yapı taşları burada üretilir. Zarı yoktur.'),
      kart(
        'Kromatin ve kromozom',
        'DNA normalde ince iplikler hâlinde (kromatin) durur; bölünme sırasında kısalıp kalınlaşarak kromozoma dönüşür.',
      ),
    ]),
    konu('byl9-siniflandirma', 'Canlıların Sınıflandırılması', [
      kart(
        'Doğal sınıflandırma',
        'Canlılar akrabalık ilişkisine (kökene) göre ayrılır. Yalnız benzer görünüşe bakan yapay sınıflandırma bilimsel değildir.',
      ),
      kart(
        'Birimlerin sırası',
        'Âlem → şube → sınıf → takım → aile → cins → tür. Aşağı inildikçe birey sayısı azalır, ortak özellik artar.',
      ),
      kart(
        'Tür nedir?',
        'Ortak atadan gelen, çiftleştiğinde verimli döl verebilen bireyler topluluğu. Katır kısır olduğu için at ve eşek ayrı türdür.',
      ),
      kart(
        'İkili adlandırma',
        'Linnaeus’un yöntemi: birinci sözcük cins (büyük harf), ikincisi tür tanımlayıcısı. Latince yazılır: Homo sapiens.',
      ),
    ]),
    konu('byl9-alemler', 'Âlemler ve Biyoçeşitlilik', [
      kart(
        'Üç domain',
        'Bakteri, Arke ve Ökarya. Arkeler sıcak su kaynağı, tuz gölü gibi uç ortamlarda yaşayabilir.',
      ),
      kart(
        'Bakteriler',
        'Prokaryottur. Hepsi zararlı değildir: bağırsak florası, yoğurt mayalanması ve azot döngüsü bakterilerle yürür.',
      ),
      kart(
        'Protista',
        'Ökaryot ama öteki âlemlere uymayan karışık grup: amip, öglena, terliksi hayvan, algler.',
      ),
      kart(
        'Mantarlar',
        'Klorofilsizdir, besinini dışarıdan hazır alır. Çeperinde selüloz değil kitin bulunur.',
      ),
      kart(
        'Biyoçeşitlilik neden önemli?',
        'Tür çeşitliliği yüksek ekosistem değişime daha dayanıklıdır. Bir türün yok olması besin ağının tamamını etkileyebilir.',
      ),
    ]),
  ]),
])
