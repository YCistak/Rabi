/**
 * Organel Kartı oyununun havuzu.
 *
 * Her satır bir organel ve onu tarif eden **üç ipucu**. İpuçlarının sırası
 * rastgele değil: birincisi birkaç organele birden uyar, ikincisi alanı
 * daraltır, üçüncüsü tek bir cevabı gösterir. Oyunun puanı da buna dayanıyor —
 * erken bilmek çok puan, geç bilmek az puan getiriyor. Sıra bozulursa oyunun
 * ölçtüğü şey bozulur.
 *
 * İpuçları organelin ağzından yazılıyor ("çift zarlıyım"): kart arkası dönük
 * duruyor ve ipuçlarını o veriyor.
 *
 * Kapsam 9. sınıf "Hücre" ünitesi; hücrenin bütün yapı ve organelleri, ökaryot
 * ve prokaryot. Hücre zarı, hücre duvarı, sitoplazma ve kromozom organel değil
 * ama havuzda: ünite onları da anlatıyor ve şıklarda birlikte geçiyorlar.
 *
 * Havuzun büyüklüğü konuyla sınırlı: bir hücrede sayılı sayıda yapı var, o
 * yüzden burası öteki oyunların havuzları gibi istendiği kadar büyüyemez.
 * Yeni kart eklerken sınır şu: **her kartın cevabı benzersiz bir yapı adı
 * olmalı** (`hucre.test.ts` denetliyor) ve şıklar bu adlardan çekildiği için
 * iki kart aynı yapının iki adı olamaz — "hücre çeperi" ile "hücre duvarı" ya
 * da "sitozol" ile "sitoplazma" ayrı kart olarak konulamaz, cevabı ikiye
 * bölerdi. Alt bölmeler (krista, granum, stroma) ayrı kart, çünkü ipuçları
 * onları ait oldukları organelden ayırt edebiliyor.
 */

import type { Zorluk } from './ritim'

export type OrganelSorusu = {
  /** Kartın arkasındaki cevap — şıklarda da bu ad görünüyor. */
  organel: string
  /** Üç ipucu; belirsizden belirgine sıralı. */
  ipuclari: [string, string, string]
  /** Tur sonunda yanlışın altında görünen kısa öğretici not. */
  aciklama: string
  zorluk: Zorluk
}

export const HUCRE_HAVUZU: readonly OrganelSorusu[] = [
  {
    organel: 'Mitokondri',
    ipuclari: [
      'Çift zarlıyım; kendi DNA’m ve kendi ribozomum var.',
      'İç zarım kıvrımlar yaparak yüzeyimi artırır.',
      'Oksijenli solunumun büyük kısmı bende olur, hücrenin ATP’sini ben üretirim.',
    ],
    aciklama:
      'Enerji ihtiyacı yüksek hücrelerde (kas, karaciğer) sayısı artar. Çift zarlı ve kendi DNA’sı olan iki organelden biridir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Ribozom',
    ipuclari: [
      'Zarsızım ve istisnasız bütün hücrelerde bulunurum.',
      'İki alt birimden oluşurum; ancak birleşince çalışırım.',
      'Protein sentezi bende yapılır.',
    ],
    aciklama:
      'Prokaryot hücrelerde bulunan tek organeldir. Alt birimleri çekirdekçikte üretilir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Kloroplast',
    ipuclari: [
      'Çift zarlıyım; kendi DNA’m ve ribozomum var.',
      'Yalnızca bitki ve alg hücrelerinde bulunurum.',
      'Klorofil taşırım, fotosentez bende gerçekleşir.',
    ],
    aciklama:
      'Plastitlerdendir. Işık enerjisini kimyasal enerjiye çevirerek besin üretir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Çekirdek',
    ipuclari: [
      'Çift zarlıyım ve zarımın üstünde porlar var.',
      'İçimde kalıtım maddesi bulunur.',
      'Hücrenin yönetim merkeziyim; prokaryot hücrelerde bulunmam.',
    ],
    aciklama:
      'Porları sayesinde sitoplazmayla madde alışverişi yapar. DNA’yı taşıdığı için bölünmeyi ve sentezi yönetir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Hücre zarı',
    ipuclari: [
      'Bütün hücrelerde bulunurum.',
      'Yapımda yağ ve protein var; akıcı mozaik modeliyle açıklanırım.',
      'Seçici geçirgenim: hücreye neyin girip çıkacağına ben karar veririm.',
    ],
    aciklama:
      'Canlı ve seçici geçirgendir. Hücreyi dış ortamdan ayırır, madde alışverişini ve iletişimi sağlar.',
    zorluk: 'kolay',
  },
  {
    organel: 'Koful',
    ipuclari: [
      'Tek zarlı bir keseyim.',
      'Madde depolar, atıkları ve fazla suyu içimde tutarım.',
      'Bitki hücrelerinde tek ve çok büyüğüm; tatlı su canlılarında kasılarak fazla suyu dışarı atarım.',
    ],
    aciklama:
      'Genç bitki hücrelerinde küçük ve çok sayıda, yaşlı hücrelerde birleşerek tek ve büyüktür.',
    zorluk: 'kolay',
  },
  {
    organel: 'Hücre duvarı',
    ipuclari: [
      'Cansızım ve tam geçirgenim.',
      'Hayvan hücrelerinde bulunmam.',
      'Bitkide selülozdan, mantarda kitinden yapılırım; hücreye şekil ve dayanıklılık veririm.',
    ],
    aciklama:
      'Hücre zarının dışındadır. Cansız olduğu için madde geçişini seçemez, gelen her şeyi geçirir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Lizozom',
    ipuclari: [
      'Tek zarlı bir keseyim.',
      'İçim sindirim enzimiyle dolu; beni golgi üretir.',
      'Zarım yırtılırsa hücreyi kendi kendine sindiririm; bu yüzden bana “intihar kesesi” denir.',
    ],
    aciklama:
      'Hücre içi sindirimden sorumludur. Yaşlanmış organelleri ve dışarıdan alınan büyük molekülleri parçalar.',
    zorluk: 'orta',
  },
  {
    organel: 'Golgi cisimciği',
    ipuclari: [
      'Üst üste dizilmiş yassı keselerden oluşuyorum.',
      'Bana gelen maddeleri işler, paketler ve gideceği yere gönderirim.',
      'Salgı yapan hücrelerde sayım artar; lizozomu da ben oluştururum.',
    ],
    aciklama:
      'Endoplazmik retikulumdan gelen protein ve yağları işler; salgı kesecikleri hâlinde hücre dışına gönderir.',
    zorluk: 'orta',
  },
  {
    organel: 'Granüllü endoplazmik retikulum',
    ipuclari: [
      'Hücre içinde kanal ve keselerden oluşan bir ağım.',
      'Yüzeyimde ribozomlar olduğu için pürtüklü görünürüm.',
      'Ribozomda üretilen proteinleri taşır ve golgiye gönderirim.',
    ],
    aciklama:
      'Protein sentezi ve taşınmasıyla ilgilidir; salgı üreten hücrelerde bol bulunur.',
    zorluk: 'orta',
  },
  {
    organel: 'Sentrozom',
    ipuclari: [
      'Zarsızım ve hücre bölünmesiyle ilgiliyim.',
      'Bitki hücrelerinde bulunmam, hayvan hücrelerinde varım.',
      'Bölünme sırasında iğ ipliklerini ben oluştururum.',
    ],
    aciklama:
      'Birbirine dik iki sentriyolden oluşur. Bölünmede kromozomların kutuplara çekilmesini sağlar.',
    zorluk: 'orta',
  },
  {
    organel: 'Çekirdekçik',
    ipuclari: [
      'Çekirdeğin içindeyim ve zarsızım.',
      'RNA ile protein bakımından zenginim.',
      'Ribozomun alt birimleri bende üretilir.',
    ],
    aciklama:
      'Bölünme başlarken kaybolur, bölünme bitince yeniden oluşur. Protein sentezi hızlı olan hücrelerde belirgindir.',
    zorluk: 'orta',
  },
  {
    organel: 'Granülsüz endoplazmik retikulum',
    ipuclari: [
      'Kanallardan oluşuyorum ama yüzeyim düzgün.',
      'Yağ ve karbonhidrat sentezi bende yapılır.',
      'Karaciğer hücrelerinde ilaç ve alkol gibi zararlı maddeleri etkisizleştiririm.',
    ],
    aciklama:
      'Üzerinde ribozom yoktur. Yağ sentezi, kalsiyum depolanması ve zehirlerin etkisizleştirilmesinde görevlidir.',
    zorluk: 'zor',
  },
  {
    organel: 'Peroksizom',
    ipuclari: [
      'Tek zarlı, küçük bir keseyim.',
      'Karaciğer ve böbrek hücrelerinde çok bulunurum.',
      'Katalaz enzimimle hidrojen peroksiti su ve oksijene parçalarım.',
    ],
    aciklama:
      'Hücrede biriken hidrojen peroksit zehirlidir; peroksizom onu zararsız hâle getirir.',
    zorluk: 'zor',
  },
  {
    organel: 'Kromoplast',
    ipuclari: [
      'Bitki hücrelerindeki plastitlerden biriyim.',
      'Renk veririm ama fotosentez yapmam.',
      'Havucun turuncusu, domatesin kırmızısı bendeki pigmentlerden gelir.',
    ],
    aciklama:
      'Karoten (turuncu), ksantofil (sarı) ve likopen (kırmızı) gibi pigmentleri taşır; böceklerin çiçeğe gelmesini sağlar.',
    zorluk: 'zor',
  },
  {
    organel: 'Lökoplast',
    ipuclari: [
      'Renksiz bir plastitim.',
      'Bitkinin ışık almayan kök, yumru ve tohum gibi yerlerinde bulunurum.',
      'Nişasta, yağ ve protein depolarım; patatesteki nişasta bende durur.',
    ],
    aciklama:
      'Işık aldığında kloroplasta dönüşebilir; patatesin yeşermesinin sebebi budur.',
    zorluk: 'zor',
  },
  {
    organel: 'Sitoplazma',
    ipuclari: [
      'Hücrenin içini dolduran, yarı akışkan bir yapıyım.',
      'Bütün organeller benim içimde asılı durur; hücredeki tepkimelerin çoğu bende geçer.',
      'Hücre zarı ile çekirdek arasında kalan her yer benim; bölünmenin sonunda ikiye ayrılırım.',
    ],
    aciklama:
      'Organeller ile onları saran akışkan öz sudan (sitozol) oluşur. Prokaryot hücrelerde de bulunur; orada kalıtım maddesi doğrudan bunun içindedir.',
    zorluk: 'kolay',
  },
  {
    organel: 'Çekirdek zarı',
    ipuclari: [
      'İki katmandan oluşan, gözenekli bir örtüyüm.',
      'Dış katmanım granüllü endoplazmik retikulumla devam eder.',
      'Kalıtım maddesini saran örtü benim; gözeneklerimden RNA ve ribozom alt birimleri sitoplazmaya çıkar.',
    ],
    aciklama:
      'Bölünme başlarken erir, bölünme bitince yeniden oluşur. Prokaryot hücrelerde bulunmaz.',
    zorluk: 'kolay',
  },
  {
    organel: 'Nükleoplazma',
    ipuclari: [
      'Zarla çevrili bir bölmenin içini dolduran sıvıyım; yalnızca ökaryot hücrelerde bulunurum.',
      'İçimde kromatin iplikler ve çekirdekçik yüzer.',
      'Çekirdeğin öz suyuyum; DNA’nın eşlenmesi ve RNA sentezi benim içimde olur.',
    ],
    aciklama:
      'Çekirdek plazması da denir. Kromatini, çekirdekçiği ve çekirdek tepkimeleri için gereken enzimleri barındırır.',
    zorluk: 'zor',
  },
  {
    organel: 'Kromatin',
    ipuclari: [
      'DNA ile proteinin birlikte oluşturduğu bir yapıyım.',
      'Bölünme yapmayan hücrede çekirdeğin içinde ince, dağınık iplikler hâlinde görünürüm.',
      'Bölünme başlayınca kısalıp kalınlaşır, kromozom hâline gelirim.',
    ],
    aciklama:
      'Kromatin ile kromozom aynı maddenin iki hâlidir: bölünme arası dönemde kromatin, bölünme sırasında kromozom.',
    zorluk: 'orta',
  },
  {
    organel: 'Kromozom',
    ipuclari: [
      'DNA ve proteinden oluşurum; sayım türe özgüdür.',
      'Bölünme sırasında kısalıp kalınlaşarak mikroskopta görünür hâle gelirim.',
      'İki kardeş kromatidim sentromerden birbirine bağlıdır; insan vücut hücresinde 46 tanem bulunurum.',
    ],
    aciklama:
      'Genleri taşır. İnsanın vücut hücrelerinde 46, üreme hücrelerinde 23 tanedir; sayı türü belirler, birey farkını değil.',
    zorluk: 'kolay',
  },
  {
    organel: 'Sentriyol',
    ipuclari: [
      'Zarsızım; hayvan hücrelerinde ve bazı ilkel bitkilerde bulunurum.',
      'Dokuzar üçlü mikrotübül demetinden yapılmış, içi boş bir silindirim.',
      'İkimiz birbirine dik durup sentrozomu oluştururuz; silin ve kamçının tabanında da yer alırım.',
    ],
    aciklama:
      'Sentrozomu oluşturan çift yapıdır. Bölünmede iğ ipliklerinin çıktığı merkezdir; sil ve kamçının temelini de kurar.',
    zorluk: 'orta',
  },
  {
    organel: 'Hücre iskeleti',
    ipuclari: [
      'Sitoplazmanın içine yayılmış bir protein ağıyım.',
      'Hücreye şeklini veririm, organelleri yerinde tutar ve onları bir yerden bir yere taşırım.',
      'Mikrotübül, mikrofilament ve ara filamentlerin hepsi birlikte beni oluşturur.',
    ],
    aciklama:
      'Üç çeşit protein ipliğinden oluşur. Hücrenin şekli, hücre içi taşıma ve hücrenin hareketi buna bağlıdır.',
    zorluk: 'kolay',
  },
  {
    organel: 'Mikrotübül',
    ipuclari: [
      'Hücre iskeletinin en kalın ipliğiyim; içim boş bir boru gibidir.',
      'Tübülin proteininden yapılırım; organeller benim üzerimde ray üstündeki vagon gibi taşınır.',
      'Bölünmedeki iğ ipliklerini, silin ve kamçının içindeki dizilimi ben oluştururum.',
    ],
    aciklama:
      'Hücre iskeletinin en kalın elemanıdır. Sentriyol, sil, kamçı ve iğ ipliklerinin yapı taşıdır.',
    zorluk: 'orta',
  },
  {
    organel: 'Mikrofilament',
    ipuclari: [
      'Hücre iskeletinin en ince ipliğiyim.',
      'Aktin proteininden yapılırım ve hücre zarının hemen altında yoğunlaşırım.',
      'Kas kasılmasında ve hayvan hücresinin bölünme sonunda boğumlanmasında görev alırım.',
    ],
    aciklama:
      'Aktin ipliklerinden oluşur. Kas kasılması, sitoplazma bölünmesi ve hücrenin şekil değiştirmesi bununla olur.',
    zorluk: 'orta',
  },
  {
    organel: 'Ara filament',
    ipuclari: [
      'Hücre iskeletinde kalınlık bakımından ortada duran ipliğim.',
      'Keratin gibi dayanıklı proteinlerden örülüyüm; kolay kolay sökülüp yeniden kurulmam.',
      'Hücreye mekanik dayanıklılık veririm, çekirdeği ve organelleri yerinde tutan ağı ben gererim.',
    ],
    aciklama:
      'Kalınlığı mikrotübül ile mikrofilament arasındadır. Deri ve tırnak gibi baskıya uğrayan dokularda boldur.',
    zorluk: 'zor',
  },
  {
    organel: 'Sil',
    ipuclari: [
      'Kısayım ve çok sayıda bulunurum; hücrenin yüzeyinden dışarı uzanırım.',
      'Mikrotübüllerden yapılıyım; kürek çeker gibi ileri geri hareket ederim.',
      'Paramesyum benimle yüzer, soluk borusu epitelinde ise tozu ve mukusu ben süpürürüm.',
    ],
    aciklama:
      'Sil ile kamçının iç yapısı aynıdır; sil kısa ve çok sayıdadır, kamçı uzun ve azdır.',
    zorluk: 'kolay',
  },
  {
    organel: 'Kamçı',
    ipuclari: [
      'Uzunum ve genellikle bir ya da iki tanem bulunur.',
      'Mikrotübüllerden yapılıyım; kırbaç gibi savrularak hücreyi yüzdürürüm.',
      'Spermin kuyruğu ve öglenanın hareket yapısı benim.',
    ],
    aciklama:
      'Hücreye hareket sağlar. Sperm, öglena ve bazı bakterilerde bulunur; sile göre uzun ve az sayıdadır.',
    zorluk: 'kolay',
  },
  {
    organel: 'Glikokaliks',
    ipuclari: [
      'Hücre zarının dış yüzeyinde yer alırım.',
      'Zardaki proteinlere ve yağlara bağlanmış karbonhidrat zincirlerinden oluşurum.',
      'Hücrelerin birbirini tanımasını sağlarım; kan gruplarını belirleyen işaretler bende bulunur.',
    ],
    aciklama:
      'Glikoprotein ve glikolipitlerden oluşan bu karbonhidrat örtüsü hücre tanınmasında, doku oluşumunda ve bağışıklıkta görevlidir.',
    zorluk: 'zor',
  },
  {
    organel: 'Plazmodesma',
    ipuclari: [
      'Bitki hücrelerinin arasında bulunan ince bir bağlantıyım.',
      'Hücre duvarındaki boşluklardan geçerek komşu iki hücrenin sitoplazmasını birleştiririm.',
      'Bitkide hücreden hücreye madde ve uyartı geçişi benim içimden olur.',
    ],
    aciklama:
      'Bitki hücrelerini duvarlarındaki geçitler üzerinden birbirine bağlar; su, besin ve sinyal molekülleri buradan geçer.',
    zorluk: 'zor',
  },
  {
    organel: 'Tilakoid',
    ipuclari: [
      'Kloroplastın içinde yassı bir kese hâlinde bulunurum.',
      'Zarımın üzerinde klorofil ve elektron taşıma sistemi vardır.',
      'Fotosentezin ışığa bağlı tepkimeleri, yani ATP ile NADPH üretimi bende olur.',
    ],
    aciklama:
      'Işık enerjisinin tutulduğu zar sistemidir. Üst üste dizilenleri granumu oluşturur.',
    zorluk: 'orta',
  },
  {
    organel: 'Granum',
    ipuclari: [
      'Kloroplastın içindeyim ve bozuk para yığınına benzerim.',
      'Üst üste dizilmiş tilakoid keselerinden oluşurum.',
      'Klorofilin yoğunlaştığı yer benim; ışık enerjisi bende tutulur.',
    ],
    aciklama:
      'Tilakoid keselerin üst üste dizilmesiyle oluşur; kloroplastta ışık tepkimelerinin geçtiği bölgedir.',
    zorluk: 'zor',
  },
  {
    organel: 'Stroma',
    ipuclari: [
      'Kloroplastın iç zarı ile tilakoidleri arasındaki boşluğu doldururum.',
      'İçimde kloroplastın kendi DNA’sı ve ribozomları yüzer.',
      'Fotosentezin ışıktan bağımsız tepkimeleri, karbondioksidin şekere çevrildiği devir bende geçer.',
    ],
    aciklama:
      'Kloroplastın renksiz temel maddesidir. Calvin döngüsü burada işler, üretilen nişasta yine burada birikir.',
    zorluk: 'zor',
  },
  {
    organel: 'Krista',
    ipuclari: [
      'Bir organelin iç zarının içeriye doğru kıvrılmasıyla oluştum.',
      'Sayım arttıkça yüzey alanı, yüzey alanı arttıkça üretilen ATP miktarı artar.',
      'Üzerimde elektron taşıma sistemi enzimleri dizilidir; oksijenli solunumun son basamağı bende geçer.',
    ],
    aciklama:
      'Mitokondrinin iç zar kıvrımlarıdır. Enerji ihtiyacı yüksek hücrelerde daha sık ve daha çoktur.',
    zorluk: 'orta',
  },
  {
    organel: 'Mitokondri matriksi',
    ipuclari: [
      'Bir organelin en iç bölmesini dolduran koyu kıvamlı sıvıyım.',
      'İçimde halkasal DNA ve ribozomlar bulunur; kendi proteinlerimin bir kısmını bende üretirim.',
      'Krebs döngüsü enzimlerini taşırım; pirüvat bende karbondioksite parçalanır.',
    ],
    aciklama:
      'Mitokondrinin iç zarının kuşattığı sıvıdır. Krebs döngüsü burada geçer; mitokondrinin DNA ve ribozomları da buradadır.',
    zorluk: 'zor',
  },
  {
    organel: 'Vezikül',
    ipuclari: [
      'Zardan koparak oluşmuş, küçük ve kısa ömürlü bir keseciğim.',
      'Endoplazmik retikulumdan golgiye, golgiden hücre zarına yük taşırım.',
      'Ekzositozda hücre zarıyla kaynaşıp içimdeki salgıyı dışarı bırakırım.',
    ],
    aciklama:
      'Zarla çevrili küçük taşıma kesesidir. Kofuldan farkı depolamak değil, madde taşımak için kısa süre var olmasıdır.',
    zorluk: 'orta',
  },
  {
    organel: 'Nükleoid',
    ipuclari: [
      'Bakteri hücresinde sitoplazmanın ortasında yer alan bir bölgeyim.',
      'Beni saran bir zar yoktur, bu yüzden sınırlarım belirsizdir.',
      'Bakterinin halkasal DNA’sı bende bulunur; ökaryottaki çekirdeğin işini ben görürüm.',
    ],
    aciklama:
      'Prokaryot hücrede halkasal DNA’nın toplandığı, zarla çevrili olmayan bölgedir.',
    zorluk: 'orta',
  },
  {
    organel: 'Plazmit',
    ipuclari: [
      'Bakterilerde asıl kalıtım maddesinin dışında, ondan bağımsız bulunurum.',
      'Küçük ve halkasal bir DNA parçasıyım; kendimi tek başıma eşleyebilirim.',
      'Antibiyotik direnci genlerini taşırım; gen aktarımında biyoteknolojinin taşıyıcısıyım.',
    ],
    aciklama:
      'Bakterinin yaşaması için zorunlu değildir ama antibiyotik direnci gibi ek özellikler kazandırır; gen mühendisliğinde taşıyıcı olarak kullanılır.',
    zorluk: 'orta',
  },
  {
    organel: 'Mezozom',
    ipuclari: [
      'Yalnızca bakteri hücrelerinde bulunurum.',
      'Hücre zarının içeriye doğru kıvrılmasıyla oluşurum.',
      'Solunum enzimlerini taşıdığım için bana bakterinin mitokondrisi denir; DNA’nın eşlenmesine de yardım ederim.',
    ],
    aciklama:
      'Ders kitaplarında bakterinin solunum ve bölünme yeri olarak anlatılır; enerji üretimini zarın kendisi üstlenir.',
    zorluk: 'zor',
  },
  {
    organel: 'Kapsül',
    ipuclari: [
      'Bazı bakterilerin en dışında yer alırım.',
      'Hücre duvarının da dışındayım; yapışkan bir polisakkarit örtüyüm.',
      'Bakteriyi kurumaya ve akyuvarlara karşı korurum, hastalık yapma gücünü artırırım.',
    ],
    aciklama:
      'Bakterinin hücre duvarını saran yapışkan koruyucu tabakadır; bunu taşıyan bakteriler bağışıklık sisteminden daha kolay kaçar.',
    zorluk: 'zor',
  },
  {
    organel: 'Hücre dışı matriks',
    ipuclari: [
      'Hayvan hücrelerinde, hücrelerin arasındaki boşlukta bulunurum.',
      'Kollajen gibi proteinlerden ve karbonhidratlardan örülü bir ağım.',
      'Hücrelerin birbirine tutunmasını sağlarım; kemiğin ve kıkırdağın sertliği benim yapımdan gelir.',
    ],
    aciklama:
      'Hayvan hücresinde duvar yoktur; hücreleri bir arada tutan ve dokuya dayanıklılık veren yapı budur.',
    zorluk: 'zor',
  },
]

export const HUCRE_BOYUTU = HUCRE_HAVUZU.length
