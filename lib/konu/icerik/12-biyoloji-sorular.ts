import { sikli, soru, type SoruKarti } from '../tip'

type Iddia = [ifade: string, dogru: boolean, gerekce: string]
type Secim = [metin: string, dogru: string, yanlis: string, gerekce: string]

let secimSirasi = 0

/** 12. sınıf Matematik soru dosyasının kalıbı: doğru şık A/B sırayla, iki biçim iç içe. */
function sorular(iddialar: Iddia[], secimler: Secim[]): Omit<SoruKarti, 'id'>[] {
  const dogruYanlis = iddialar.map(([ifade, dogru, gerekce]) => soru(ifade, dogru, gerekce))
  const ikiSikli = secimler.map(([metin, dogru, yanlis, gerekce]) => {
    const yanit = (secimSirasi++ % 2) as 0 | 1
    return sikli(metin, yanit === 0 ? [dogru, yanlis] : [yanlis, dogru], yanit, gerekce)
  })
  return ikiSikli.flatMap((secim, dizin) => [dogruYanlis[dizin], secim])
    .concat(dogruYanlis.slice(ikiSikli.length))
}

/**
 * 12. sınıf (2018 programı) Biyoloji yoklamaları. Sayısal sorular kartlardaki
 * kuralı başka sayılarla kullandırır (hidrojen bağı, eşlenme kuşakları,
 * kodon–aminoasit, kromozom takımı); yanlış şık o konunun en sık yapılan
 * hatasıdır (durdurma kodonunu saymamak, T ile U'yu karıştırmak, tohum
 * kabuğunu embriyo sanmak).
 */
export const biyoloji12Sorulari: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'byl12-nukleik-kesif': sorular([
    ['Griffith deneyinde ısıyla öldürülmüş S suşu tek başına verilen fare ölmüştür.', false, 'Ölü S tek başına zararsızdı; fareyi öldüren, canlı R ile birlikte verilmesiydi.'],
    ['Avery’nin deneyinde DNA’yı yıkan enzim kullanılınca dönüşüm gerçekleşmemiştir.', true, 'Protein ya da RNA yıkılınca dönüşüm sürdü, DNA yıkılınca durdu.'],
    ['Hershey ve Chase, DNA’yı işaretlemek için radyoaktif kükürt kullanmıştır.', false, 'DNA’da kükürt yok; DNA ³²P ile, protein ³⁵S ile işaretlendi.'],
    ['Çift zincirli bir DNA’da A sayısı biliniyorsa T sayısı da bilinir.', true, 'A, T ile eşleşir; çift zincirde sayıları eşittir.'],
    ['Chargaff’a göre (A + T)/(G + C) oranı bütün türlerde 1’dir.', false, 'Bu oran türden türe değişir; her türde 1 olan (A + G)/(T + C).'],
    ['Miescher nükleini hücre çekirdeğinden elde etmiştir.', true, 'İrin hücrelerinin çekirdeğinden ayırdı; adı da çekirdekten (nükleus) gelir.'],
  ], [
    ['Bir DNA’nın bazlarının %30’u A ise G yüzdesi kaçtır?', '%20', '%30', 'A = T = %30, toplam %60; kalan %40 G ile C arasında eşit: G = %20.'],
    ['Griffith deneyinde fareyi öldüren karışım hangisidir?', 'Ölü S + canlı R', 'Ölü S + ölü R', 'Canlı R, ölü S’den aldığı DNA ile kapsüllü S’ye dönüştü.'],
    ['Hershey-Chase deneyi neyi gösterdi?', 'Kalıtım maddesi DNA’dır', 'Kalıtım maddesi proteindir', 'Bakteriye ³²P’li DNA girdi, ³⁵S’li protein dışarıda kaldı.'],
    ['DNA’nın sarmal olduğunu gösteren X-ışını görüntüleri kime ait?', 'Franklin ve Wilkins', 'Griffith ve Avery', 'Griffith ve Avery dönüşümü inceledi; görüntüler Franklin ve Wilkins’ten.'],
    ['Bir DNA’da T sayısı 400, G sayısı 600 ise toplam nükleotit kaçtır?', '2000', '1000', 'A = 400, C = 600; 400 + 400 + 600 + 600 = 2000.'],
    ['Kapsülsüz, fareye zarar vermeyen suş hangisidir?', 'R suşu', 'S suşu', 'S kapsüllü ve öldürücüdür; R kapsülsüz ve zararsız.'],
  ]),
  'byl12-nukleik-yapi': sorular([
    ['DNA ve RNA’da ortak bulunan bazlar adenin, guanin ve sitozindir.', true, 'Timin yalnız DNA’da, urasil yalnız RNA’da; öteki üç baz ortak.'],
    ['RNA’nın yapısındaki şeker deoksirribozdur.', false, 'RNA riboz, DNA deoksiriboz taşır.'],
    ['200 nükleotitlik çift zincirli doğrusal DNA’da 198 fosfodiester bağı vardır.', true, 'Her zincirde nükleotit − 1 bağ: 99 + 99 = 198.'],
    ['tRNA, DNA’daki şifreyi çekirdekten ribozoma taşır.', false, 'Şifreyi mRNA taşır; tRNA aminoasit getirir.'],
    ['G–C çiftleri arasındaki hidrojen bağı sayısı A–T çiftlerinden fazladır.', true, 'G–C üç, A–T iki hidrojen bağıyla bağlanır.'],
    ['Tek bir DNA zincirinde pürin sayısı her zaman pirimidin sayısına eşittir.', false, 'Eşitlik çift zincirin toplamında geçerli; tek zincirde farklı olabilir.'],
  ], [
    ['100 baz çiftlik DNA’da 30 A var. Hidrojen bağı sayısı kaçtır?', '270', '260', '30 A–T çifti 60 bağ, 70 G–C çifti 210 bağ; toplam 270.'],
    ['Ribozomun yapısına katılan RNA hangisidir?', 'rRNA', 'mRNA', 'mRNA şifreyi taşır; ribozomu rRNA ve proteinler kurar.'],
    ['Timin bazı hangi molekülde bulunur?', 'DNA', 'RNA', 'RNA’da timin yerine urasil vardır.'],
    ['Antikodon hangi RNA’da bulunur?', 'tRNA', 'rRNA', 'tRNA antikodonla mRNA’daki kodonu tanır.'],
    ['Sitozin hangi baz grubundadır?', 'Pirimidin', 'Pürin', 'Pürinler adenin ve guanin; sitozin tek halkalı bir pirimidin.'],
    ['Bir zincir 5’-ATGC-3’ ise karşı zincir hangisidir?', '3’-TACG-5’', '3’-ATGC-5’', 'A’nın karşısına T, G’nin karşısına C gelir; yön terstir.'],
  ]),
  'byl12-genetik-organizasyon': sorular([
    ['Kromatin ve kromozom farklı maddelerden oluşur.', false, 'İkisi de DNA ve proteindir; yalnızca paketlenme derecesi farklı.'],
    ['Bir gen, DNA molekülünün belirli bir bölümüdür.', true, 'Gen, bir protein ya da RNA’nın şifresini taşıyan DNA bölümüdür.'],
    ['Bakteri DNA’sı histon proteinlerine sarılı doğrusal moleküllerdir.', false, 'Bakteri DNA’sı halkasaldır ve histon taşımaz.'],
    ['Aynı bireyin deri ve kas hücreleri aynı genetik bilgiyi taşır.', true, 'İkisi de zigotun mitozlarından geldi; farkı hangi genlerin kullanıldığı.'],
    ['Bir canlının kromozom sayısı arttıkça o canlı daha gelişmiş olur.', false, 'Patateste 48, insanda 46 kromozom var; sayı gelişmişliği göstermez.'],
    ['Eşlenmiş bir kromozomun iki kardeş kromatidi sentromerden bağlıdır.', true, 'Kardeş kromatitler sentromerde birbirine tutunur.'],
  ], [
    ['Küçükten büyüğe doğru sıralama hangisidir?', 'Nükleotit → gen → kromozom', 'Gen → nükleotit → kromozom', 'Gen nükleotitlerden, kromozom genleri taşıyan DNA’dan oluşur.'],
    ['Hücre bölünürken görülen yoğun paketlenmiş yapı hangisidir?', 'Kromozom', 'Kromatin', 'Kromatin bölünmeyen hücrede gevşektir; bölünmede kromozoma dönüşür.'],
    ['İnsanda mitokondri DNA’sı kimden kalıtılır?', 'Anneden', 'Babadan', 'Zigotun sitoplazması ve mitokondrileri yumurtadan gelir.'],
    ['Bir hücredeki tüm DNA’nın adı nedir?', 'Genom', 'Gen', 'Gen tek bir bölümdür; tüm DNA genomdur.'],
    ['Prokaryot hücrede DNA nerededir?', 'Sitoplazmada', 'Çekirdek zarı içinde', 'Prokaryotta çekirdek zarı yoktur.'],
    ['İnsan sperm hücresinde kaç kromozom vardır?', '23', '46', 'Üreme hücreleri vücut hücresinin yarısını taşır.'],
  ]),
  'byl12-dna-eslenme': sorular([
    ['Yarı korunumlu eşlenmede yeni DNA’lardan biri tamamen eski zincirlerden oluşur.', false, 'Her yeni DNA’da bir eski, bir yeni zincir bulunur.'],
    ['DNA polimeraz yeni zinciri 5’→3’ yönünde uzatır.', true, 'Polimeraz nükleotidi yalnız zincirin 3’ ucuna ekleyebilir.'],
    ['Okazaki parçalarını DNA ligaz birleştirir.', true, 'Geri kalan zincirin kısa parçaları ligazla bağlanır.'],
    ['DNA eşlenmesi hücre döngüsünün mitoz evresinde gerçekleşir.', false, 'Eşlenme interfazın S evresinde, bölünmeden önce olur.'],
    ['¹⁵N’li bir DNA ¹⁴N ortamında iki kez eşlenirse hiç ağır (¹⁵N–¹⁵N) DNA kalmaz.', true, 'İlk eşlenmede iki ağır zincir ayrılır; ağır-ağır DNA bir daha oluşmaz.'],
    ['Helikaz, yeni nükleotitleri kalıp zincire bağlar.', false, 'Helikaz zincirleri açar; nükleotidi DNA polimeraz ekler.'],
  ], [
    ['¹⁵N’li bir DNA ¹⁴N ortamında 3 kez eşlendi. Hafif DNA sayısı kaçtır?', '6', '8', '2³ = 8 DNA; 2’si orta, 6’sı hafif.'],
    ['500 nükleotitlik DNA 2 kez eşlenirse kaç nükleotit harcanır?', '1500', '2000', '500 · (2² − 1) = 1500; eski zincirler yeniden yapılmaz.'],
    ['Kesintisiz sentezlenen zincir hangisidir?', 'Öncü zincir', 'Geri kalan zincir', 'Geri kalan zincir Okazaki parçalarıyla kesikli sentezlenir.'],
    ['Meselson-Stahl ilk eşlenmeden sonra ne gördü?', 'Hepsi orta ağırlık', 'Yarısı ağır, yarısı hafif', 'Yarısı ağır yarısı hafif sonucu korunumlu modelin beklentisiydi.'],
    ['Kalıptaki baz A ise yeni DNA zincirine hangisi eklenir?', 'T', 'U', 'U yalnız RNA’da kullanılır; DNA’da A’nın karşısı T.'],
    ['Eşlenme hatasını fark edip düzeltebilen enzim hangisidir?', 'DNA polimeraz', 'Helikaz', 'Polimeraz eklediği nükleotidi denetleyip yanlışı çıkarabilir.'],
  ]),
  'byl12-transkripsiyon': sorular([
    ['Transkripsiyonda bir genin iki zinciri de kalıp olarak kullanılır.', false, 'Bir gen için yalnız bir zincir kalıp olur.'],
    ['Durdurma kodonlarına karşılık gelen bir aminoasit yoktur.', true, 'UAA, UAG ve UGA aminoasit kodlamaz, sentezi bitirir.'],
    ['Genetik şifrede 64 kodon bulunur.', true, '4 baz üçlü dizilerle 4³ = 64 kodon kurar.'],
    ['Bir kodon birden fazla aminoasidi kodlayabilir.', false, 'Tersi doğru: bir aminoasidin birden çok kodonu olabilir, kodon tek anlamlıdır.'],
    ['Ökaryot hücrede transkripsiyon çekirdekte gerçekleşir.', true, 'DNA çekirdekte; mRNA orada sentezlenip sitoplazmaya çıkar.'],
    ['mRNA’nın yapısında timin bazı bulunur.', false, 'RNA’da timin yerine urasil vardır.'],
  ], [
    ['Kalıp DNA 3’-TACGGA-5’ ise mRNA hangisidir?', '5’-AUGCCU-3’', '5’-ATGCCT-3’', 'T→A, A→U, C→G, G→C; RNA’da T bulunmaz.'],
    ['mRNA kodonu 5’-GCA-3’ ise tRNA antikodonu hangisidir?', '3’-CGU-5’', '3’-CGT-5’', 'G→C, C→G, A→U; tRNA da RNA’dır, T taşımaz.'],
    ['Transkripsiyonu yürüten enzim hangisidir?', 'RNA polimeraz', 'DNA polimeraz', 'DNA polimeraz eşlenmede çalışır; RNA’yı RNA polimeraz yapar.'],
    ['Başlatma kodonu hangisidir?', 'AUG', 'UAA', 'UAA durdurma kodonudur; AUG başlatır ve metiyonin kodlar.'],
    ['Şifre ikili olsaydı kaç farklı kodon olurdu?', '16', '8', '4² = 16; 20 aminoasit için yetmez.'],
    ['İnsan geni bakteride neden aynı proteini üretir?', 'Genetik şifre evrenseldir', 'Bakteri DNA’sı insanınkiyle aynı', 'Bakteri genomu farklıdır; aynı kodonu aynı aminoasit diye okur.'],
  ]),
  'byl12-translasyon': sorular([
    ['Translasyonda peptit bağlarını ribozom kurar.', true, 'Ribozom yan yana gelen iki aminoasidi peptit bağıyla bağlar.'],
    ['Durdurma kodonuna uygun antikodonlu bir tRNA gelir ve son aminoasidi bağlar.', false, 'Durdurma kodonuna uyan tRNA yoktur; polipeptit serbest kalır.'],
    ['Polizom sayesinde bir mRNA’dan kısa sürede çok sayıda protein elde edilir.', true, 'Aynı mRNA’yı birden çok ribozom aynı anda okur.'],
    ['Ribozom zarla çevrili bir organeldir.', false, 'Ribozom zarsızdır; bu yüzden prokaryotlarda da bulunur.'],
    ['50 aminoasitlik bir polipeptit sentezinde 49 su molekülü açığa çıkar.', true, 'Her peptit bağında bir su çıkar: 50 − 1 = 49.'],
    ['Tek bir baz eklenmesi proteinde yalnızca bir aminoasidi değiştirir.', false, 'Okuma çerçevesi kayar; eklemeden sonraki kodonların hepsi değişir.'],
  ], [
    ['200 aminoasitlik protein için mRNA’da kaç kodon vardır?', '201', '200', 'Durdurma kodonu da sayılır: 200 + 1.'],
    ['Son kodonu durdurma olan 99 kodonlu mRNA kaç aminoasit verir?', '98', '99', 'Durdurma kodonu aminoasit kodlamaz: 99 − 1 = 98.'],
    ['Aminoasidi ribozoma getiren molekül hangisidir?', 'tRNA', 'mRNA', 'mRNA kodonları taşır; aminoasidi tRNA getirir.'],
    ['Translasyon nerede gerçekleşir?', 'Ribozomda', 'Çekirdekçikte', 'Çekirdekçikte ribozom alt birimleri yapılır; protein ribozomda sentezlenir.'],
    ['Hangi değişim proteini genellikle daha çok bozar?', 'Bir baz eklenmesi', 'Bir baz yer değiştirmesi', 'Ekleme çerçeveyi kaydırır; yer değiştirme tek kodonu etkiler.'],
    ['60 aminoasitlik proteinin geninde (çift zincir) kaç nükleotit vardır?', '366', '183', '61 kodon · 3 = 183 mRNA nükleotidi; çift zincirli gende 366.'],
  ]),
  'byl12-biyoteknoloji': sorular([
    ['Yoğurt yapımı geleneksel biyoteknoloji örneğidir.', true, 'Sütü yoğurda çeviren bakterilerin fermantasyonudur; gen aktarımı yok.'],
    ['Gen ve plazmidin aynı restriksiyon enzimiyle kesilmesi yapışkan uçların eşleşmesini sağlar.', true, 'Aynı enzim aynı tek zincirli uçları bırakır; uçlar birbirini tamamlar.'],
    ['DNA ligaz, DNA’yı belirli dizilerden keser.', false, 'Kesen restriksiyon enzimi; ligaz parçaları birleştirir.'],
    ['Jel elektroforezinde DNA parçaları eksi kutba doğru ilerler.', false, 'DNA eksi yüklüdür; artı kutba gider.'],
    ['PCR’da her döngüde DNA miktarı yaklaşık iki katına çıkar.', true, 'Her döngüde her DNA bir kez eşlenir.'],
    ['Plazmitler ökaryot çekirdeğindeki doğrusal DNA’lardır.', false, 'Plazmit bakterideki küçük halkasal DNA’dır.'],
  ], [
    ['5 PCR döngüsü sonunda 1 DNA’dan kaç DNA elde edilir?', '32', '10', '2⁵ = 32; her döngü ikiye katlar, ikişer eklemez.'],
    ['Elektroforezde başlangıçtan en uzağa giden parça hangisidir?', 'En kısa parça', 'En uzun parça', 'Kısa parça jelin gözeneklerinden daha kolay geçer.'],
    ['Yapışkan uçları kalıcı olarak birleştiren enzim hangisidir?', 'DNA ligaz', 'Helikaz', 'Helikaz zincirleri ayırır; ligaz birleştirir.'],
    ['Hangisi modern biyoteknoloji örneğidir?', 'Bakteriye insülin ürettirmek', 'Sütten peynir yapmak', 'Peynir geleneksel fermantasyondur; insülin üretimi gen aktarımıdır.'],
    ['PCR’da DNA zincirlerini ayıran işlem hangisidir?', 'Isıtma', 'Restriksiyon enzimi', 'Isı hidrojen bağlarını koparır; restriksiyon enzimi PCR’da kullanılmaz.'],
    ['Bakterilerde vektör olarak kullanılan DNA hangisidir?', 'Plazmit', 'Ribozom', 'Ribozom DNA değildir; plazmit geni bakteriye taşır.'],
  ]),
  'byl12-biyotek-uygulama': sorular([
    ['Gen tedavisinde sağlam gen hücreye çoğunlukla zararsızlaştırılmış virüsle taşınır.', true, 'Virüs genetik materyalini hücreye sokabildiği için vektör olarak kullanılır.'],
    ['Tek yumurta ikizlerinin DNA parmak izleri birbirinden ayırt edilebilir.', false, 'Tek yumurta ikizleri aynı zigottan gelir; DNA’ları aynıdır.'],
    ['Dolly, yumurta hücresini veren koyunun genetik kopyasıdır.', false, 'Yumurtanın çekirdeği çıkarılmıştı; Dolly çekirdeği veren koyunun kopyasıdır.'],
    ['Altın pirinç, A vitamini eksikliğiyle mücadele için geliştirildi.', true, 'Beta karoten taşır; vücut onu A vitaminine çevirir.'],
    ['Kemik iliği nakli kök hücre kullanılan bir tedavidir.', true, 'İlikteki kök hücreler kan hücrelerinin hepsini yeniden üretir.'],
    ['Türkiye’de GDO’lu bitkilerin tarlada üretimine izin verilir.', false, '2010 Biyogüvenlik Kanunu GDO’lu bitki üretimini yasaklar.'],
  ], [
    ['Babalık testinde çocuğun bir bandı annede yoksa bu bant nerede olmalı?', 'Babada', 'Hiçbir ebeveynde', 'Her bant ebeveynlerden birinden gelir; anneden gelmeyen babadan gelmiştir.'],
    ['Kendi böcek zehrini üreten GDO hangisidir?', 'Bt mısırı', 'Altın pirinç', 'Altın pirinç beta karoten taşır; böcek zehri Bt mısırında.'],
    ['İlk rekombinant ilaç hangisidir?', 'İnsan insülini', 'Penisilin', 'Penisilin küfün doğal ürünüdür; gen aktarımıyla ilk üretilen insülin.'],
    ['Bir GDO’nun yabani akrabasına gen geçirmesi hangi kaygıdır?', 'Ekolojik', 'Etik', 'Doğadaki türlere gen kaçışı biyoçeşitliliği etkileyen ekolojik bir risktir.'],
    ['Suç yerindeki kan örneği hangi yöntemle eşleştirilir?', 'DNA parmak izi', 'Gen tedavisi', 'Gen tedavisi hastalık tedavisidir; kimlik tespiti parmak iziyle.'],
    ['Kök hücrenin ayırt edici özelliği hangisidir?', 'Farklı hücrelere dönüşebilir', 'Bölünme yeteneği yoktur', 'Kök hücre bölünür ve farklılaşarak başka hücre tiplerine dönüşür.'],
  ]),
  'byl12-bitki-doku': sorular([
    ['Uç meristem bitkinin boyca uzamasını sağlar.', true, 'Kök ve gövde ucundaki uç meristem bölünerek boyu uzatır.'],
    ['Sklerenkima hücreleri canlı ve ince çeperlidir.', false, 'Sklerenkima ölü, lignin kaplı ve kalın çeperlidir.'],
    ['Ksilemde taşıma iki yönlüdür.', false, 'Ksilem suyu kökten yukarı tek yönde taşır; iki yönlü olan floem.'],
    ['Kalburlu boru hücreleri çekirdeksiz olmalarına rağmen canlıdır.', true, 'Yaşamları için arkadaş hücrelere bağımlıdırlar.'],
    ['Tek çenekli bitkilerin gövdesinde iletim demetleri dağınık dizilir.', true, 'Çift çeneklilerde ise halka şeklinde dizilir.'],
    ['Kutikula, yaprağın su kaybını artırır.', false, 'Mumsu kutikula su kaybını azaltır.'],
  ], [
    ['Ağaçta yıllık halkaları oluşturan doku hangisidir?', 'Kambiyum', 'Uç meristem', 'Kambiyum her yıl yeni ksilem katmanı üretir; uç meristem boyu uzatır.'],
    ['Patates yumrusunda nişasta depolayan doku hangisidir?', 'Depo parankiması', 'Kollenkima', 'Kollenkima destek dokusudur; nişastayı parankima depolar.'],
    ['Armut etindeki sert taneler hangi dokudandır?', 'Sklerenkima', 'Kollenkima', 'Taş hücreleri lignin kaplı ölü sklerenkima hücreleridir.'],
    ['Yaprağı ağsı damarlı, kökü kazık olan bitki hangisidir?', 'Fasulye', 'Mısır', 'Mısır tek çeneklidir: paralel damar, saçak kök.'],
    ['Organik madde taşıyan iletim dokusu hangisidir?', 'Floem', 'Ksilem', 'Ksilem su ve mineral taşır.'],
    ['Genç gövdeye esnek destek veren canlı doku hangisidir?', 'Kollenkima', 'Sklerenkima', 'Sklerenkima ölü ve serttir; esnek destek kollenkimadan.'],
  ]),
  'byl12-kok-govde-yaprak': sorular([
    ['Patates yumrusu değişikliğe uğramış bir köktür.', false, 'Üzerinde tomurcuk (göz) taşır; yumru bir gövdedir.'],
    ['Kaliptra kök ucundaki meristemi korur.', true, 'Kök toprakta ilerlerken uç meristemi yüksük gibi örter.'],
    ['Yan kökler perisiklden çıkar.', true, 'Perisikl bölünme yeteneğini korur; yan kökler buradan gelişir.'],
    ['Kara bitkilerinde stomalar çoğunlukla yaprağın alt yüzündedir.', true, 'Alt yüz güneşe daha az maruz kalır; su kaybı azalır.'],
    ['Saçak kök çift çenekli bitkilerin özelliğidir.', false, 'Saçak kök tek çeneklilerde, kazık kök çift çeneklilerde görülür.'],
    ['Palizat parankimasında kloroplast bulunmaz.', false, 'Palizat parankiması kloroplastça en zengin, fotosentezin en yoğun olduğu katmandır.'],
  ], [
    ['Bekçi hücresini öteki epidermis hücrelerinden ayıran nedir?', 'Kloroplast taşır', 'Çekirdeği yoktur', 'Bekçi hücreleri çekirdekli ve kloroplastlıdır.'],
    ['Nilüferde stomalar yaprağın neresindedir?', 'Üst yüzünde', 'Alt yüzünde', 'Alt yüz suya değer; gaz alışverişi üst yüzden olur.'],
    ['Havuç hangi organdır?', 'Kök', 'Gövde', 'Havuçta tomurcuk yok; besin depolayan kazık köktür.'],
    ['Kurak ortam bitkisinin yaprağında hangisi beklenir?', 'Kalın kutikula', 'Üst yüzde çok stoma', 'Kurak ortamda su kaybını azaltan özellikler seçilir.'],
    ['Kökün boyca uzamasının çoğu hangi bölgede olur?', 'Uzama bölgesi', 'Kaliptra', 'Kaliptra koruyucu örtüdür; hücreler uzama bölgesinde uzar.'],
    ['Yaprağın gövdeye bağlandığı, tomurcuk taşıyan yer neresidir?', 'Boğum', 'Kaliptra', 'Kaliptra kök ucundadır; yaprak boğumdan çıkar.'],
  ]),
  'byl12-su-emilim': sorular([
    ['Köke su girişi ATP harcanarak gerçekleşir.', false, 'Su osmozla, enerji harcamadan girer; ATP mineral iyonları için.'],
    ['Solunum zehiri verilen kökte mineral alımı azalır.', true, 'Mineraller aktif taşınır; solunum durunca ATP üretilemez.'],
    ['Kaspari şeridi maddelerin endodermiste hücre zarından geçmesini zorunlu kılar.', true, 'Çeper yolu kapanır; madde zarı geçerek seçilir.'],
    ['Gutasyon, suyun buhar olarak stomalardan çıkmasıdır.', false, 'Gutasyonda su sıvı damla hâlinde çıkar; buhar kaybı terlemedir.'],
    ['Mikoriza mantarı kökün su ve mineral emme alanını artırır.', true, 'Mantar hifleri kökün ulaşamadığı toprağa uzanır.'],
    ['Aşırı gübrelenen toprakta kök hücreleri su kazanır.', false, 'Toprak suyu derişikleşir; su kökten toprağa geçer.'],
  ], [
    ['Emici tüyler emilimi nasıl artırır?', 'Yüzey alanını artırır', 'Fotosentez yapar', 'Kök epidermisinin uzantılarıdır; temas alanını büyütür.'],
    ['Su basmış toprakta ilk azalan hangisidir?', 'Mineral alımı', 'Toprak suyu', 'Toprakta su bol ama oksijen yok; aktif taşıma düşer.'],
    ['Hücre çeperlerinden ve aralardan ilerleyen yol hangisidir?', 'Apoplast', 'Simplast', 'Simplast sitoplazmalardan ve plazmodezmlerden geçer.'],
    ['Baklagil köklerinde havadaki azotu bağlayan hangisidir?', 'Rhizobium bakterisi', 'Mikoriza mantarı', 'Mikoriza emilim alanını artırır; azotu nodüldeki bakteri bağlar.'],
    ['Gutasyonu oluşturan kuvvet hangisidir?', 'Kök basıncı', 'Terleme çekimi', 'Gece terleme düşüktür; suyu kök basıncı iter.'],
    ['K⁺ kök hücresinde topraktakinden derişikse K⁺ nasıl alınır?', 'Aktif taşımayla', 'Osmozla', 'Derişim farkına karşı taşıma ATP ister; osmoz suyun geçişidir.'],
  ]),
  'byl12-ksilem': sorular([
    ['Uzun ağaçlarda suyu yükselten başlıca kuvvet terlemenin oluşturduğu çekimdir.', true, 'Kılcallık ve kök basıncı onlarca metreye yetmez.'],
    ['Bekçi hücrelerine K⁺ girişi stomayı kapatır.', false, 'K⁺ girince su da girer, turgor artar ve stoma açılır.'],
    ['Havanın nemi arttıkça terleme hızı artar.', false, 'Nem arttıkça yaprakla hava arasındaki fark azalır, terleme düşer.'],
    ['Adezyon, suyun ksilem çeperlerine tutunmasıdır.', true, 'Kohezyon moleküllerin birbirini, adezyon çeperi çekmesidir.'],
    ['Absisik asit artınca stomalar kapanır.', true, 'ABA su kıtlığında stomaları kapatıp su kaybını önler.'],
    ['Gutasyon gündüz, sıcak ve kuru havada artar.', false, 'Gutasyon gece ve nemli havada, terleme azken görülür.'],
  ], [
    ['Rüzgârlı ve güneşli bir günde terleme ne olur?', 'Artar', 'Azalır', 'Işık stomaları açar, rüzgâr nemli havayı uzaklaştırır.'],
    ['Stomanın açılmasını sağlayan olay hangisidir?', 'Bekçi hücresinde turgor artışı', 'Bekçi hücresinde su kaybı', 'Su kaybeden bekçi hücresi gevşer ve stoma kapanır.'],
    ['Ksilemdeki su sütununun kopmamasını sağlayan hangisidir?', 'Kohezyon', 'Terleme', 'Terleme çekimi oluşturur; sütunu bir arada tutan kohezyon.'],
    ['Terlemeyle kaybedilen su hangi hâldedir?', 'Buhar', 'Sıvı damla', 'Sıvı damla gutasyondur.'],
    ['Gece kök basıncıyla yaprak kenarından su damlaması nedir?', 'Gutasyon', 'Terleme', 'Terleme buhar hâlinde ve gündüz olur.'],
    ['Kuraklıkta stomaları kapatan hormon hangisidir?', 'Absisik asit', 'Oksin', 'Oksin hücre uzamasını sağlar; stomaları ABA kapatır.'],
  ]),
  'byl12-floem': sorular([
    ['Floemde taşıma her zaman yapraktan köke doğrudur.', false, 'Yön kaynaktan havuza; ilkbaharda kökten yukarı da olabilir.'],
    ['Basınç akış modeline göre kaynakta floeme su osmozla girer.', true, 'Yüklenen şeker derişimi artırır; su ksilemden floeme geçer.'],
    ['Sakkarozun floeme yüklenmesi enerji harcamadan olur.', false, 'Yükleme aktif taşımadır; arkadaş hücreler ATP harcar.'],
    ['Halkalanan ağacın kökleri bir süre sonra besin alamaz.', true, 'Floem kesildiği için yaprakta üretilen şeker köke inemez.'],
    ['Gelişen bir meyve havuz organıdır.', true, 'Meyve şekeri kullanır ve depolar.'],
    ['Halkalamadan hemen sonra yapraklar su alamadığı için solar.', false, 'Halkalama yalnız floemi keser; ksilem sağlam, su gitmeye devam eder.'],
  ], [
    ['İlkbaharda sürgün veren ağaçta depo kökü nedir?', 'Kaynak', 'Havuz', 'Depoladığı şekeri büyüyen sürgüne verdiği için kaynaktır.'],
    ['Halkalanan gövdede hangi taraf şişer?', 'Halkanın üstü', 'Halkanın altı', 'Yapraktan inen şeker halkada takılır ve üstte birikir.'],
    ['Sakkarozu yüklemek için ATP sağlayan hücre hangisidir?', 'Arkadaş hücre', 'Trake', 'Trake ölü bir ksilem hücresidir; ATP üretemez.'],
    ['Floem özsuyunu toplamak için hangi canlıdan yararlanıldı?', 'Yaprak biti', 'Bal arısı', 'Yaprak biti hortumunu tek bir kalburlu boruya sokar.'],
    ['Floemde özsuyu hareket ettiren nedir?', 'Basınç farkı', 'Terleme çekimi', 'Terleme çekimi ksilemi çalıştırır; floemde akış basınç farkıyla.'],
    ['Havuzda şeker çıkınca floemdeki su nereye gider?', 'Ksileme', 'Stomaya', 'Su ksileme döner ve yeniden yukarı taşınır.'],
  ]),
  'byl12-cicek': sorular([
    ['Tek eşeyli bir çiçek tam çiçek olamaz.', true, 'Tam çiçekte erkek ve dişi organın ikisi de bulunmalıdır.'],
    ['Mısır iki evcikli bir bitkidir.', false, 'Mısırda erkek ve dişi çiçek aynı bitkide: bir evcikli.'],
    ['Polen ana hücresi mitozla bölünerek dört mikrospor oluşturur.', false, 'Mikrosporlar mayozla oluşur ve haploittir.'],
    ['Rüzgârla tozlaşan çiçeklerin polenleri bol ve hafiftir.', true, 'Rüzgâr polenin çoğunu boşa taşır; bol ve hafif polen bunu karşılar.'],
    ['Embriyo kesesindeki yumurta hücresi haploittir.', true, 'Yumurta, mayozla oluşan megaspordan mitozla türer: n.'],
    ['Tozlaşmada polen doğrudan yumurtalığın içine bırakılır.', false, 'Polen tepeciğe konar; yumurtalığa polen tüpü ulaşır.'],
  ], [
    ['Renkli taç yaprakların görevi nedir?', 'Tozlaşmacıyı çekmek', 'Polen üretmek', 'Polen başçıkta üretilir; taç yaprak böceği çeker.'],
    ['Söğüt hangisidir?', 'İki evcikli', 'Bir evcikli', 'Söğütte erkek ve dişi çiçekler ayrı ağaçlardadır.'],
    ['Megaspor ana hücresinin mayozundan kaç megaspor yaşar?', '1', '4', 'Dört megaspordan üçü ölür, biri embriyo kesesini kurar.'],
    ['Polen tüpü hangi yapının içinde ilerler?', 'Dişicik borusu', 'Sapçık', 'Sapçık erkek organdadır; tüp dişicik borusundan yumurtalığa iner.'],
    ['Erdişi çiçekte hangisi bulunur?', 'Erkek ve dişi organ', 'Yalnız dişi organ', 'Erdişi çiçek iki eşey organını birlikte taşır.'],
    ['Olgun polende kaç çekirdek vardır?', '2', '3', 'Tüp ve üreme çekirdeği; üreme çekirdeği sonra ikiye bölünür.'],
  ]),
  'byl12-dollenme': sorular([
    ['Çift döllenmede bir sperm çekirdeği yumurtayı, diğeri kutup çekirdeklerini döller.', true, 'Birinden zigot, ötekinden endosperm oluşur.'],
    ['Tohum kabuğu babadan gelen kromozomları da taşır.', false, 'Tohum kabuğu ana bitkinin dokusudur; döllenmeye katılmaz.'],
    ['Meyve, yumurtalık duvarının gelişmesiyle oluşur.', true, 'Döllenmeden sonra yumurtalık büyüyüp meyveye dönüşür.'],
    ['Partenokarpik meyvelerde tohum bulunur.', false, 'Döllenme olmadığı için tohum oluşmaz; muz gibi çekirdeksizdir.'],
    ['Fasulyede depo besinin büyük kısmı çeneklerdedir.', true, 'Endosperm gelişirken besin çeneklere aktarılır.'],
    ['Endosperm zigotun bölünmesiyle oluşur.', false, 'Zigottan embriyo oluşur; endosperm ikinci döllenmenin ürünüdür.'],
  ], [
    ['2n = 20 olan bitkide endosperm kaç kromozomludur?', '30', '20', 'Endosperm 3n: 3 · 10 = 30.'],
    ['2n = 16 olan bitkide polen tüp çekirdeği kaç kromozomludur?', '8', '16', 'Polen haploittir: n = 8.'],
    ['Çilek neden yalancı meyvedir?', 'Çiçek tablası meyveye katılır', 'Döllenme olmadan oluşur', 'Döllenmesiz meyve partenokarpidir; çilekte tabla etlenir.'],
    ['Zigottan ne gelişir?', 'Embriyo', 'Endosperm', 'Endosperm sperm ile kutup çekirdeklerinden gelişir.'],
    ['Buğday ununun büyük kısmı tohumun hangi yapısıdır?', 'Endosperm', 'Tohum kabuğu', 'Tohum kabuğu kepeğe gider; un endospermden.'],
    ['Tohum taslağının örtülerinden ne oluşur?', 'Tohum kabuğu', 'Meyve', 'Meyve yumurtalık duvarından oluşur.'],
  ]),
  'byl12-cimlenme': sorular([
    ['Çimlenen tohumun kuru ağırlığı, yapraklar fotosenteze başlayana kadar azalır.', true, 'Depo besin solunumla harcanır, yerine konmaz.'],
    ['Ölü bir tohum su alıp şişemez.', false, 'Şişme fiziksel bir olaydır; ölü tohum da su emer.'],
    ['Dormansi, tohumun kötü mevsimi atlatmasını sağlar.', true, 'Çimlenme uygun mevsime ertelenir.'],
    ['Çimlenme için ışık bütün tohumlarda zorunludur.', false, 'Bazı tohumlar ışık ister, bazıları karanlıkta çimlenir; zorunlu olanlar su, oksijen, sıcaklık.'],
    ['Absisik asit tohumun dormansisini sürdürür.', true, 'ABA büyümeyi baskılar; gibberellin ağır basınca çimlenme başlar.'],
    ['Mısırda çimlenme sırasında çenek toprak yüzüne çıkar.', false, 'Mısırda çimlenme toprak altıdır; çenek toprakta kalır.'],
  ], [
    ['Tahıl tohumunda nişastayı parçalayan enzim hangisidir?', 'Amilaz', 'Lipaz', 'Lipaz yağları parçalar; nişastayı amilaz.'],
    ['Sert kabuklu tohumun dormansisi nasıl kırılır?', 'Kabuğu aşındırarak', 'Karanlıkta tutarak', 'Kabuk aşınınca su ve oksijen girer.'],
    ['Çimlenmenin ilk aşaması hangisidir?', 'Su alıp şişme', 'Fotosentez', 'Fotosentez yaprak çıktıktan sonra başlar.'],
    ['Çenekleri toprak yüzüne çıkan bitki hangisidir?', 'Fasulye', 'Mısır', 'Fasulyede çimlenme toprak üstü, mısırda toprak altıdır.'],
    ['Çimlenme deneyinde kontrol kabı hangisidir?', 'Tüm koşulları uygun olan', 'Kuru bırakılan', 'Kuru kap suyun etkisini sınar; karşılaştırma uygun kapla yapılır.'],
    ['Embriyodan salınıp çimlenmeyi başlatan hormon hangisidir?', 'Gibberellin', 'Absisik asit', 'ABA çimlenmeyi baskılar; gibberellin amilazı uyarır.'],
  ]),
  'byl12-cevre-genetik': sorular([
    ['Modifikasyonla oluşan özellik yavrulara aktarılır.', false, 'Modifikasyonda DNA değişmez; özellik kalıtılmaz.'],
    ['Vücut hücresinde oluşan mutasyon yavruya geçmez.', true, 'Yavruya yalnız üreme hücresindeki mutasyon geçer.'],
    ['Antibiyotik, bakterilerde direnç mutasyonunu kendisi oluşturur.', false, 'Dirençli bireyler zaten vardı; antibiyotik yalnızca seçer.'],
    ['Aynı genotipteki bireyler farklı çevrelerde farklı fenotip gösterebilir.', true, 'Fenotip, genotip ile çevrenin birlikte etkisidir.'],
    ['UV ışınları mutasyon sıklığını artırır.', true, 'UV, DNA’da hasar oluşturan bir mutajendir.'],
    ['Adaptasyon, bireyin yaşamı boyunca kazandığı kalıtsal olmayan değişimdir.', false, 'Adaptasyon kalıtsaldır; kalıtsal olmayan değişim modifikasyondur.'],
  ], [
    ['Himalaya tavşanında kulak uçlarının siyah olması nedir?', 'Modifikasyon', 'Mutasyon', 'Soğuk bölgede renk oluşur; tüy tıraşlanıp soğukta çıkarsa siyah çıkar.'],
    ['Doğal seçilimde seçen etken hangisidir?', 'Çevre', 'İnsan', 'İnsanın seçtiği süreç yapay seçilimdir.'],
    ['Çocuğa geçebilecek mutasyon hangi hücrede olmalıdır?', 'Üreme hücresinde', 'Deri hücresinde', 'Deri hücresindeki mutasyon yalnız o bireyde kalır.'],
    ['İsle kararan ormanda koyu güvelerin artması nedir?', 'Doğal seçilim', 'Modifikasyon', 'Koyu renk kalıtsaldı; kuşlar açık renklileri daha çok yedi.'],
    ['Tek yumurta ikizlerinden birinin sporla kas yapması nedir?', 'Modifikasyon', 'Mutasyon', 'DNA değişmedi; çevre etkisiyle fenotip değişti.'],
    ['Antibiyotikli ortamda hangi bakteriler çoğalır?', 'Dirençli olanlar', 'Duyarlı olanlar', 'Duyarlılar ölür; dirençliler rakipsiz çoğalır.'],
  ]),
  'byl12-yapay-secilim': sorular([
    ['Yapay seçilimde seçimi insan yapar.', true, 'İnsan istediği özelliği taşıyan bireyleri çoğaltır.'],
    ['Yapay seçilim başka türlerden gen aktararak çalışır.', false, 'Türün kendi çeşitliliğinden seçer; gen aktarımı GDO’dur.'],
    ['Bütün köpek ırkları aynı türe aittir.', true, 'Irklar birbiriyle çiftleşip verimli yavru verebilir.'],
    ['Tek çeşit ekmek tarlayı hastalıklara karşı daha dayanıklı yapar.', false, 'Çeşitlilik azalınca bir hastalık bütün tarlayı vurabilir.'],
    ['Mısır, yabani teosinteden yapay seçilimle geliştirilmiştir.', true, 'Orta Amerika’da binlerce yıl süren seçilimle geliştirildi.'],
    ['Yapay seçilimle elde edilen özellik canlının doğada yaşama şansını her zaman artırır.', false, 'Ölçüt insanın yararıdır; özellik doğada dezavantaj olabilir.'],
  ], [
    ['Karnabaharda seçilen organ hangisidir?', 'Çiçek kümesi', 'Kök', 'Karnabahar ve brokoli çiçek kümesi büyütülerek elde edildi.'],
    ['Hibrit mısırın ana ve babasından verimli olması nedir?', 'Melez azmanlığı', 'Modifikasyon', 'Kalıtsal bir etkidir; çaprazlamayla ortaya çıkar.'],
    ['Bol süt veren inekleri çiftleştirmek hangisidir?', 'Yapay seçilim', 'Gen aktarımı', 'Başka türden gen eklenmez; var olan özellik seçilir.'],
    ['İrlanda kıtlığının temel nedeni hangisidir?', 'Düşük genetik çeşitlilik', 'Çok çeşit ekilmesi', 'Tek tip patates aynı hastalığa aynı biçimde yenildi.'],
    ['Seçen etkeni insan olan süreç hangisidir?', 'Yapay seçilim', 'Doğal seçilim', 'Doğal seçilimde seçen çevredir.'],
    ['Yerel tohumlar gen bankasında neden saklanır?', 'Islahta gen kaynağı olsun', 'Tarlada hemen ekilsin', 'Kaybolan çeşitlilik ileride ıslahta kullanılabilsin diye saklanır.'],
  ]),
}
