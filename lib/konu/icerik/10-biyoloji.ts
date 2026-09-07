import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Biyoloji — Maarif Modeli.
 *
 * İki tema: **Enerji** ve **Ekoloji**. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski programda 10. sınıfta olan **kalıtım** Maarif'te burada yok; bu
 * sınıfın tamamı enerji dönüşümleri ve ekoloji üzerine.
 */
export const biyoloji10 = program('biyoloji', 10, 'Enerjiden ekosisteme', [
  tema('byl10-t1', 'Enerji', [
    konu('byl10-enerji-onem', 'Canlılık İçin Enerjinin Önemi', [
      kart(
        'Neden enerji gerekir?',
        'Büyüme, onarım, madde taşınması ve hareket enerji ister. Enerji kesilirse hücre düzenini koruyamaz.',
      ),
      kart(
        'ATP nedir?',
        'Hücrenin kullanıma hazır enerji birimi. Adenin, riboz ve üç fosfattan oluşur.',
      ),
      kart(
        'Enerji nerede saklı?',
        'Fosfatlar arasındaki bağlarda. Son fosfat koptuğunda açığa çıkan enerji hücre işlerinde kullanılır.',
      ),
      kart(
        'ATP depolanmaz',
        'Hücre ATP’yi biriktirmez, ihtiyaç oldukça üretir. Depo, besin moleküllerinin kendisidir.',
      ),
      kart(
        'Döngü',
        'ATP parçalanıp ADP olur, solunumla yeniden ATP’ye çevrilir. Bu döngü hiç durmaz.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'ATP', alt: 'enerji hazır' },
            { ad: 'ADP + P', alt: 'enerji kullanıldı' },
          ],
        },
      ),
      kart(
        'Neden ATP, doğrudan besin değil?',
        'Besindeki enerji büyük ve kullanışsız bir paketti. ATP, hücrenin her işine yetecek büyüklükte bozuk paradır.',
      ),
    ]),
    konu('byl10-fotosentez', 'Işık Enerjisiyle Besin Sentezi: Fotosentez', [
      kart(
        'Özet denklem',
        'Karbondioksit ve su, ışık enerjisiyle glikoz ve oksijene dönüşür. Kloroplastta gerçekleşir.',
      ),
      kart(
        'İki evre',
        'Fotosentez iki basamakta yürür ve ikincisi doğrudan birincinin ürünleriyle çalışır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Işıklı evre', alt: 'tilakoit' },
            { ad: 'ATP + NADPH', renk: 'ikincil' },
            { ad: 'Calvin döngüsü', alt: 'stroma' },
          ],
        },
      ),
      kart(
        'Işığın kullanıldığı tepkimeler',
        'Tilakoit zarda olur. Su parçalanır (fotoliz), oksijen açığa çıkar, ATP ve NADPH üretilir.',
      ),
      kart(
        'Işığın kullanılmadığı tepkimeler',
        'Stromada geçen Calvin döngüsü. Karbondioksit, ışık tepkimelerinin ürettiği enerjiyle glikoza bağlanır.',
      ),
      kart(
        'Oksijen sudan gelir',
        'Açığa çıkan oksijenin kaynağı karbondioksit değil, parçalanan sudur. Bu, izotoplu deneylerle gösterildi.',
      ),
      kart(
        'Pigmentler',
        'Klorofil ışığın kırmızı ve mavisini soğurur, yeşili yansıtır. Yaprakların yeşil görünmesi bundandır.',
      ),
      kart(
        'Hızını etkileyen etmenler',
        'Işık, karbondioksit ve sıcaklık artarken hız bir noktaya kadar yükselir, sonra sabitlenir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'ışık şiddeti',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 0.2],
                [1, 2],
                [2, 3.6],
                [3.5, 4.6],
                [5.5, 4.8],
              ],
            },
          ],
        },
      ),
      kart(
        'Sınırlayıcı etmen',
        'Hız her zaman en yetersiz olan etmene takılır. Işığı artırmak, karbondioksit azsa hızı artırmaz.',
      ),
      kart(
        'Neden hayati?',
        'Atmosferdeki oksijenin ve besin zincirindeki enerjinin neredeyse tamamının kaynağı fotosentezdir.',
      ),
    ]),
    konu('byl10-kemosentez', 'Işık Kullanılmadan Besin Sentezi: Kemosentez', [
      kart(
        'Tanımı',
        'Bazı bakterilerin, ışık yerine kimyasal tepkimelerden aldıkları enerjiyle besin üretmesi.',
      ),
      kart(
        'Kimler yapar?',
        'Nitrit, kükürt ve demir bakterileri gibi bazı prokaryotlar. Ökaryotlarda görülmez.',
      ),
      kart(
        'Nerede önemli?',
        'Işığın ulaşmadığı okyanus tabanındaki hidrotermal bacalarda besin zincirini kemosentez başlatır.',
      ),
      kart(
        'Fotosentezden farkı',
        'İki süreç de üretici; ayrıldıkları yer enerji kaynağı ve yan üründür.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fotosentez', 'Kemosentez'],
          satirlar: [
            ['Enerji', 'Işık', 'Kimyasal bağ'],
            ['Yapan', 'Bitki, alg', 'Bakteri'],
            ['Oksijen', 'Çıkar', 'Çıkmaz'],
          ],
        },
      ),
      kart(
        'Döngülerdeki rolü',
        'Azot döngüsündeki nitrit ve nitrat bakterileri kemosentez yapar; toprağın verimliliği buna bağlıdır.',
      ),
    ]),
    konu('byl10-sindirim', 'Sindirim', [
      kart(
        'Neden gerekli?',
        'Büyük besin molekülleri hücre zarından geçemez; yapı taşlarına ayrılmaları gerekir.',
      ),
      kart(
        'Hücre içi sindirim',
        'Besin hücre içine alınır ve lizozom enzimleriyle parçalanır. Amip ve terliksi hayvan böyle beslenir.',
      ),
      kart(
        'Hücre dışı sindirim',
        'Enzimler dışarı salgılanır, besin dışarıda parçalanıp sonra emilir. Mantarlar ve çok hücreliler böyle yapar.',
      ),
      kart(
        'Mekanik ve kimyasal',
        'Mekanik sindirim besini küçültür ve yüzey alanını artırır; kimyasal sindirim enzimlerle bağları koparır.',
      ),
      kart(
        'Neden ikisi birden?',
        'Enzim yalnızca yüzeyde çalışır. Mekanik sindirim yüzeyi büyütmeseydi kimyasal sindirim çok yavaş kalırdı.',
      ),
      kart(
        'Hidroliz',
        'Kimyasal sindirimin tamamı su eklenerek bağ koparmadır; bu yüzden sindirime hidroliz de denir.',
      ),
    ]),
    konu('byl10-sindirim-yapi', 'Canlılarda Sindirim Yapıları', [
      kart(
        'Tek hücrelilerde',
        'Ayrı bir sistem yoktur; besin kofulu ile lizozom birleşir ve sindirim hücre içinde tamamlanır.',
      ),
      kart(
        'Sölenterelerde',
        'Tek açıklıklı bir sindirim boşluğu vardır; ağız hem giriş hem çıkıştır.',
      ),
      kart(
        'Solucanlarda',
        'İki açıklıklı sindirim kanalı gelişir; besin tek yönde ilerler ve bölümler uzmanlaşır.',
      ),
      kart(
        'Gelişim çizgisi',
        'Sindirim yapıları basitten karmaşığa doğru uzmanlaşır; her adımda daha çok besin daha verimli işlenir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Koful' },
            { ad: 'Tek açıklık' },
            { ad: 'İki açıklık' },
            { ad: 'Uzman organlar' },
          ],
        },
      ),
      kart(
        'Otçul ve etçillerde',
        'Otçulların bağırsağı uzun ve selüloz sindirimi için mikroplu; etçillerin bağırsağı kısadır.',
      ),
      kart(
        'Geviş getirenler',
        'Dört bölmeli midede bakteriler selülozu parçalar. Hayvan selülozu kendi enzimiyle sindiremez.',
      ),
    ]),
    konu('byl10-insan-sindirim', 'İnsanda Sindirim', [
      kart(
        'Ağızda',
        'Dişler mekanik olarak parçalar; tükürükteki amilaz nişastanın kimyasal sindirimini başlatır.',
      ),
      kart(
        'Midede',
        'Asidik ortamda pepsin proteinleri parçalar. Karbonhidrat sindirimi asit yüzünden burada durur.',
      ),
      kart(
        'İnce bağırsakta',
        'Sindirimin tamamlandığı yer. Pankreas enzimleri ve safra buraya dökülür.',
      ),
      kart(
        'Nerede ne sindirilir?',
        'Üç besin grubunun sindirimi farklı yerlerde başlar ama üçü de ince bağırsakta biter.',
        {
          tur: 'tablo',
          basliklar: ['Besin', 'Başlar', 'Biter'],
          satirlar: [
            ['Karbonhidrat', 'Ağız', 'İnce bağırsak'],
            ['Protein', 'Mide', 'İnce bağırsak'],
            ['Yağ', 'İnce bağırsak', 'İnce bağırsak'],
          ],
        },
      ),
      kart(
        'Safranın işi',
        'Enzim değildir; yağ damlalarını küçültüp (emülsiyon) enzimlerin ulaşacağı yüzeyi artırır.',
      ),
      kart(
        'Mide kendini neden sindirmez?',
        'Mukus tabakası asidi yüzeyden uzak tutar ve pepsin etkisiz bir öncül olarak salgılanır.',
      ),
      kart(
        'Kalın bağırsakta',
        'Sindirim olmaz. Su ve mineral emilir; bağırsak florası bazı vitaminleri üretir.',
      ),
    ]),
    konu('byl10-emilim', 'Emilim ve Taşınma', [
      kart(
        'Nerede olur?',
        'Büyük ölçüde ince bağırsakta. Villus ve mikrovilluslar emilim yüzeyini kat kat artırır.',
      ),
      kart(
        'Neden yüzey önemli?',
        'Emilim yüzeyde olur. Kıvrımlar, villuslar ve mikrovilluslar bağırsağın iç yüzeyini yüzlerce kat büyütür.',
      ),
      kart(
        'Neyin nereye gittiği',
        'Glikoz ve amino asitler kana; yağ asitleri ve gliserol önce lenf sistemine geçer.',
      ),
      kart(
        'Karaciğerin rolü',
        'Bağırsaktan gelen kan önce karaciğere uğrar; fazla glikoz glikojen olarak depolanır, zararlılar süzülür.',
      ),
      kart(
        'Taşıma',
        'Dolaşım sistemi besinleri hücrelere ulaştırır; hücreye giriş difüzyon ve aktif taşımayla olur.',
      ),
      kart(
        'Su nerede emilir?',
        'Suyun büyük kısmı ince bağırsakta, kalanı kalın bağırsakta emilir. Emilim bozulursa ishal görülür.',
      ),
    ]),
    konu('byl10-solunum', 'Hücresel Solunum', [
      kart(
        'Ne yapar?',
        'Besindeki kimyasal enerjiyi ATP’ye çevirir. Oksijenli solunumda son ürünler karbondioksit ve sudur.',
      ),
      kart(
        'Üç evre',
        'Her evre farklı yerde geçer ve ATP’nin büyük kısmı sonuncusunda üretilir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Glikoliz', alt: 'sitoplazma' },
            { ad: 'Sitrik asit döngüsü', alt: 'matriks' },
            { ad: 'Elektron taşıma', alt: 'iç zar', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Glikoliz',
        'Sitoplazmada olur, oksijen gerekmez. Glikoz iki piruvata ayrılır ve az miktarda ATP üretilir.',
      ),
      kart(
        'Sitrik asit döngüsü',
        'Mitokondri matriksinde. Karbon atomları karbondioksit olarak ayrılır, elektron taşıyıcılar yüklenir.',
      ),
      kart(
        'Elektron taşıma sistemi',
        'İç zarda. ATP’nin büyük kısmı burada üretilir; son elektron alıcısı oksijendir ve su oluşur.',
      ),
      kart(
        'Oksijen neden şart?',
        'Elektronları en sonda alacak biri yoksa taşıma zinciri tıkanır ve ATP üretimi durur.',
      ),
      kart(
        'Verim',
        'Bir glikozdan oksijenli solunumla çok sayıda ATP elde edilir; fermantasyonda bu sayı çok küçüktür.',
      ),
      kart(
        'Fotosentezin tersi mi?',
        'Girenler ve çıkanlar birbirinin tersi ama tepkimeler aynı yolun geri sarılması değil, ayrı süreçlerdir.',
      ),
    ]),
    konu('byl10-katilma', 'Besinlerin Solunuma Katılma Yolları', [
      kart(
        'Öncelik sırası',
        'Hücre önce karbonhidratı kullanır, sonra yağı; protein en son başvurulan kaynaktır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Karbonhidrat', alt: 'ilk' },
            { ad: 'Yağ' },
            { ad: 'Protein', alt: 'son çare', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Karbonhidratlar',
        'Glikoza çevrilip doğrudan glikolize girer. En hızlı kullanılan yakıttır.',
      ),
      kart(
        'Yağlar',
        'Gliserol ve yağ asitlerine ayrılır; gram başına en çok enerjiyi verirler ama kullanımı yavaştır.',
      ),
      kart(
        'Proteinler',
        'Amino asitlerin azotu ayrılır (bu atık boşaltımla atılır), kalan kısım döngüye katılır.',
      ),
      kart(
        'Neden protein son?',
        'Protein aynı zamanda yapı ve enzim malzemesidir; yakıt olarak kullanılması dokuların eritilmesi demektir.',
      ),
      kart(
        'Ortak yol',
        'Üç besin de sonunda aynı döngüye girer. Bu yüzden fazla alınan karbonhidrat da yağa çevrilip depolanabilir.',
      ),
    ]),
    konu('byl10-fermantasyon', 'Fermantasyon', [
      kart(
        'Ne zaman olur?',
        'Oksijen yetersizken. Glikoliz sürsün diye elektron taşıyıcılar başka yolla boşaltılır.',
      ),
      kart(
        'Laktik asit fermantasyonu',
        'Piruvat laktik aside dönüşür. Yoğurt ve turşu bununla yapılır; kaslarda da yorgunlukla ilişkilidir.',
      ),
      kart(
        'Etil alkol fermantasyonu',
        'Mayalarda piruvat etil alkol ve karbondioksite dönüşür. Hamurun kabarması bu gazdandır.',
      ),
      kart(
        'İkisinin karşılaştırması',
        'Başlangıç aynı, ayrılma piruvattan sonra. Ürün ne olursa olsun kazanılan ATP sayısı değişmez.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Ürün', 'Yapan'],
          satirlar: [
            ['Laktik asit', 'Laktik asit', 'Bakteri, kas'],
            ['Alkol', 'Etanol + CO₂', 'Maya'],
          ],
        },
      ),
      kart(
        'Verimi düşük',
        'Yalnızca glikolizden gelen az sayıda ATP üretilir; besindeki enerjinin çoğu ürün içinde kalır.',
      ),
      kart(
        'Neden hâlâ yapılır?',
        'Az ATP hiç ATP’den iyidir. Oksijensiz ortamda tek seçenek budur ve çok hızlı işler.',
      ),
    ]),
    konu('byl10-metabolizma', 'Enerji-Metabolizma İlişkisi', [
      kart(
        'Anabolizma ve katabolizma',
        'Anabolizma enerji harcayarak yapar, katabolizma parçalayıp enerji verir. Metabolizma ikisinin toplamıdır.',
      ),
      kart(
        'Bazal metabolizma',
        'Dinlenme hâlinde yaşamı sürdürmek için harcanan en az enerji. Yaş, cinsiyet ve kas kütlesiyle değişir.',
      ),
      kart(
        'Enerji dengesi',
        'Alınan enerji harcanandan fazlaysa depolanır, azsa depolar kullanılır.',
      ),
      kart(
        'Neden hep enerji harcanır?',
        'Uyurken bile kalp, solunum ve iyon pompaları çalışır. Düzeni korumak sürekli enerji ister.',
      ),
      kart(
        'Kas kütlesi ve metabolizma',
        'Kas dokusu dinlenirken bile yağ dokusundan çok enerji harcar; bazal metabolizmayı en çok etkileyen etken budur.',
      ),
      kart(
        'Metabolizma hormonlarla ayarlanır',
        'Tiroit hormonları hızı belirler; insülin ve glukagon kan şekerini dengede tutar.',
      ),
    ]),
  ]),
  tema('byl10-t2', 'Ekoloji', [
    konu('byl10-bilesen', 'Ekosistemin Bileşenleri', [
      kart(
        'Cansız bileşenler',
        'Işık, sıcaklık, su, toprak, mineraller ve pH. Hangi canlının nerede yaşayacağını büyük ölçüde bunlar belirler.',
      ),
      kart(
        'Canlı bileşenler',
        'Üreticiler, tüketiciler ve ayrıştırıcılar. Ayrıştırıcılar olmasa madde döngüsü kapanmazdı.',
      ),
      kart(
        'Organizasyon basamakları',
        'Ekoloji bireyden başlayıp biyosfere kadar iç içe basamaklarda çalışır.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Biyosfer' },
            { ad: 'Ekosistem' },
            { ad: 'Komünite' },
            { ad: 'Popülasyon' },
            { ad: 'Birey' },
          ],
        },
      ),
      kart(
        'Popülasyon ve komünite',
        'Popülasyon aynı türden bireyler; komünite aynı alandaki tüm popülasyonlar.',
      ),
      kart(
        'Ekosistem ve biyosfer',
        'Komünite ile cansız çevre birlikte ekosistemi kurar. Tüm ekosistemlerin toplamı biyosferdir.',
      ),
      kart(
        'Habitat ve niş',
        'Habitat canlının adresi, niş ise oradaki mesleğidir; iki tür aynı nişi uzun süre paylaşamaz.',
      ),
      kart(
        'Sınırlayıcı etmen',
        'Bir canlının yayılışını, en az bulunan kaynak belirler. Bolluk değil, kıtlık sınırı çizer.',
      ),
    ]),
    konu('byl10-etkilesim', 'Tür İçi ve Türler Arası Etkileşimler', [
      kart(
        'Tür içi rekabet',
        'Aynı türün bireyleri aynı kaynağı istediği için en şiddetli rekabet tür içinde olur.',
      ),
      kart(
        'Av-avcı ilişkisi',
        'Avcı av popülasyonunu dengeler; av azalınca avcı da azalır. İki popülasyon birbirini izler.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'zaman',
          yAd: 'birey',
          egriler: [
            {
              noktalar: [
                [0, 2],
                [1.5, 4.6],
                [3, 2],
                [4.5, 4.6],
                [6, 2],
                [7.5, 4.6],
              ],
              ad: 'av',
            },
            {
              noktalar: [
                [0, 1],
                [1.5, 2],
                [3, 3.4],
                [4.5, 2],
                [6, 3.4],
                [7.5, 2],
              ],
              renk: 'ikincil',
              ad: 'avcı',
            },
          ],
        },
      ),
      kart(
        'Etkileşimlerin haritası',
        'Türler arası ilişkiler, iki tarafın kazanıp kaybetmesine göre adlandırılır.',
        {
          tur: 'tablo',
          basliklar: ['İlişki', 'A', 'B'],
          satirlar: [
            ['Mutualizm', '+', '+'],
            ['Kommensalizm', '+', '0'],
            ['Parazitlik', '+', '−'],
            ['Rekabet', '−', '−'],
          ],
        },
      ),
      kart(
        'Mutualizm',
        'İki tür de kazanır: arı ile çiçek, baklagil ile azot bakterisi.',
      ),
      kart(
        'Kommensalizm',
        'Biri kazanır, öteki etkilenmez. Ağaç dalında yaşayan bir bitki buna örnektir.',
      ),
      kart(
        'Parazitlik',
        'Biri kazanır, öteki zarar görür. Parazit konağını genellikle öldürmez; öldürürse kendi yaşamı da biter.',
      ),
      kart(
        'Rekabetçi dışlama',
        'Aynı nişi paylaşan iki türden biri ötekini eninde sonunda o alandan uzaklaştırır ya da niş ayrışır.',
      ),
    ]),
    konu('byl10-suksesyon', 'Süksesyon', [
      kart(
        'Tanımı',
        'Bir alandaki canlı topluluğunun zamanla düzenli biçimde değişmesi.',
      ),
      kart(
        'Birincil süksesyon',
        'Toprağın hiç olmadığı yerde başlar: lav akıntısı ya da çıplak kaya. Öncü tür çoğunlukla likenlerdir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Çıplak kaya' },
            { ad: 'Likenler', alt: 'öncü tür' },
            { ad: 'Otlar ve çalılar' },
            { ad: 'Ağaçlar' },
            { ad: 'Klimaks', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'İkincil süksesyon',
        'Toprak varken başlar: yangın ya da terk edilmiş tarla. Birincilden çok daha hızlı ilerler.',
      ),
      kart(
        'Neden ikincisi hızlı?',
        'Toprak zaten var ve içinde tohum ile kök kalıntıları duruyor; en uzun adım olan toprak oluşumu atlanmış olur.',
      ),
      kart(
        'Klimaks',
        'Süksesyonun kararlı son aşaması. Tür bileşimi artık büyük ölçüde değişmez.',
      ),
      kart(
        'Klimaks bölgeye göre değişir',
        'Aynı süksesyon ormanla değil, iklime göre çayır ya da çalılıkla da bitebilir. Son durağı iklim belirler.',
      ),
    ]),
    konu('byl10-populasyon', 'Popülasyon Dinamikleri', [
      kart(
        'Büyümeyi belirleyenler',
        'Doğum ve içe göç sayıyı artırır; ölüm ve dışa göç azaltır.',
      ),
      kart(
        'Taşıma kapasitesi',
        'Ortamın sürekli besleyebileceği en büyük birey sayısı. Aşılırsa popülasyon çöker.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'zaman',
          yAd: 'birey',
          egriler: [
            {
              noktalar: [
                [0, 0.3],
                [2, 1],
                [3.5, 2.6],
                [5, 4.2],
                [7.5, 4.7],
              ],
            },
            {
              noktalar: [
                [0, 4.9],
                [7.5, 4.9],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'taşıma kap.',
            },
          ],
        },
      ),
      kart(
        'Çevre direnci',
        'Büyümeyi sınırlayan etkenlerin tamamı: besin kıtlığı, rekabet, avcı, hastalık.',
      ),
      kart(
        'Yoğunluğa bağlı ve bağımsız',
        'Rekabet ve hastalık kalabalıkla şiddetlenir; kuraklık ve don ise popülasyon büyüklüğünden bağımsız etkiler.',
      ),
      kart(
        'Yaş piramidi',
        'Genç birey oranı yüksekse popülasyon büyüyecek, yaşlı ağırlıklıysa küçülecek demektir.',
      ),
      kart(
        'Popülasyon büyüklüğü nasıl ölçülür?',
        'Tek tek saymak çoğu zaman imkânsız; işaretle-yakala yöntemiyle örneklemden tahmin edilir.',
      ),
    ]),
    konu('byl10-madde-enerji', 'Ekosistemde Madde ve Enerji Akışı', [
      kart(
        'Besin zinciri',
        'Üreticiden tüketiciye doğru tek yönlü enerji aktarımı. Ayrıştırıcılar her basamağa bağlanır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Üretici' },
            { ad: '1. tüketici' },
            { ad: '2. tüketici' },
            { ad: 'Ayrıştırıcı', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Besin ağı',
        'Zincirlerin birbirine bağlanmış hâli. Gerçek ekosistemler zincir değil ağ biçimindedir.',
      ),
      kart(
        'Enerji piramidi',
        'Her basamakta enerjinin yaklaşık onda biri aktarılır; kalanı ısı olarak kaybolur.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Üreticiler', alt: '%100' },
            { ad: '1. tüketici', alt: '%10' },
            { ad: '2. tüketici', alt: '%1' },
            { ad: '3. tüketici', alt: '%0,1' },
          ],
        },
      ),
      kart(
        'Neden basamak azdır?',
        'Her adımda enerjinin çoğu kaybolduğu için beşinci basamağa yetecek enerji kalmaz.',
      ),
      kart(
        'Enerji akar, madde döner',
        'Enerji güneşten gelir ve ısı olarak çıkar; madde ise döngülerle sürekli yeniden kullanılır.',
      ),
      kart(
        'Biyolojik birikim',
        'Parçalanmayan zehirler her basamakta derişir. En büyük zararı zincirin tepesindeki tür görür.',
      ),
      kart(
        'Neden bitkisel beslenme verimli?',
        'Aynı alandan doğrudan bitki tüketmek, o bitkiyle beslenen hayvanı tüketmekten on kat çok enerji sağlar.',
      ),
    ]),
    konu('byl10-dongu', 'Madde Döngüleri', [
      kart(
        'Su döngüsü',
        'Buharlaşma, yoğuşma, yağış ve akış. Güneş enerjisi döngüyü çeviren motordur.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Buharlaşma' },
            { ad: 'Yoğuşma' },
            { ad: 'Yağış' },
            { ad: 'Akış' },
          ],
        },
      ),
      kart(
        'Karbon döngüsü',
        'Fotosentez karbonu havadan alır, solunum ve yanma geri verir. Fosil yakıtlar dengeyi bozdu.',
      ),
      kart(
        'Karbon depoları',
        'Atmosfer, okyanuslar, canlılar, toprak ve fosil yakıtlar. Fosil yakıt milyonlarca yıl kilitli kalmış karbondur.',
      ),
      kart(
        'Azot döngüsü',
        'Havadaki azotu canlılar doğrudan kullanamaz; bakteriler bağlar, nitrifikasyon ve denitrifikasyon çevrimi tamamlar.',
      ),
      kart(
        'Neden azot bağlanmalı?',
        'Atmosferin dörtte üçü azot ama moleküldeki üçlü bağ çok güçlü; onu koparabilen yalnızca bazı bakteriler ve yıldırımdır.',
      ),
      kart(
        'Fosfor döngüsü',
        'Gaz evresi yoktur; kayaların aşınmasıyla toprağa geçer. Bu yüzden en yavaş döngüdür ve çoğu zaman sınırlayıcıdır.',
      ),
      kart(
        'Neden döngü şart?',
        'Dünyaya dışarıdan madde gelmiyor. Elimizdeki atomlar sürekli yeniden kullanılıyor.',
      ),
    ]),
    konu('byl10-surdurulebilirlik', 'Ekolojik Sürdürülebilirliğin Önemi', [
      kart(
        'Tanımı',
        'Doğal kaynakları, gelecek kuşakların da kullanabileceği biçimde ve yenilenme hızını aşmadan kullanmak.',
      ),
      kart(
        'Ekosistem hizmetleri',
        'Temiz hava, su döngüsü, tozlaşma ve toprak verimliliği. Bedava sanılan bu hizmetler yerine konulamaz.',
      ),
      kart(
        'Neden acil?',
        'Kaynak tüketim hızı yenilenme hızını geçtiğinde açık büyür ve geri dönüş giderek zorlaşır.',
      ),
      kart(
        'Devrilme noktası',
        'Bazı değişimler belirli bir eşiği geçince kendini hızlandırır; o noktadan sonra durdurmak çok daha zordur.',
      ),
      kart(
        'Ekonomiyle ilişkisi',
        'Sürdürülebilirlik üretimi durdurmak değil, üretimi doğanın yenilenme hızına uydurmaktır.',
      ),
      kart(
        'Üç ayak',
        'Sürdürülebilirlik çevre, ekonomi ve toplumsal adaleti birlikte gözetir; biri gözetilmezse öteki ikisi de tutmaz.',
      ),
    ]),
    konu('byl10-kisitlayan', 'Sürdürülebilirliği Kısıtlayan Durumlar', [
      kart(
        'Habitat kaybı',
        'Tür kayıplarının en büyük sebebi. Yaşam alanı bölününce popülasyonlar birbirinden kopar ve küçülür.',
      ),
      kart(
        'Habitat parçalanması',
        'Yol ve yerleşim bir alanı böldüğünde küçük popülasyonlar birbirinden yalıtılır ve gen çeşitliliği düşer.',
      ),
      kart(
        'Kirlilik',
        'Hava, su ve toprak kirliliği; ayrıca ışık ve gürültü kirliliği canlıların davranışını bozar.',
      ),
      kart(
        'Ötrofikasyon',
        'Sulara karışan gübre yosunu aşırı çoğaltır; ölen yosunlar çürürken oksijen tükenir ve balıklar ölür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Gübre suya karışır' },
            { ad: 'Yosun patlaması' },
            { ad: 'Yosunlar ölür' },
            { ad: 'Oksijen tükenir', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'İstilacı türler',
        'Doğal düşmanı olmayan bir tür yeni ortamda hızla çoğalır ve yerli türleri dışlar.',
      ),
      kart(
        'Biyoçeşitlilik kaybı',
        'Tür azaldıkça ekosistemin şoklara dayanma gücü düşer. Kayıp geri alınamaz.',
      ),
      kart(
        'İklim değişikliği',
        'Sıcaklık ve yağış düzeni değişince türlerin yayılış alanı kayar; uyum sağlayamayanlar yok olur.',
      ),
    ]),
    konu('byl10-saglanmasi', 'Ekolojik Sürdürülebilirliğin Sağlanması', [
      kart(
        'Ekolojik ayak izi',
        'Bir kişinin ya da toplumun doğaya bindirdiği yükün alan cinsinden ölçüsü. Küçültmenin ilk adımı ölçmektir.',
      ),
      kart(
        'Nasıl küçültülür?',
        'Enerji ve su tasarrufu, toplu taşıma, yerel ve mevsiminde beslenme, gereksiz tüketimi azaltma.',
      ),
      kart(
        'Atık yönetimi',
        'Sıra önemlidir: önce azalt, sonra yeniden kullan, en son geri dönüştür.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Azalt' },
            { ad: 'Yeniden kullan' },
            { ad: 'Geri dönüştür' },
          ],
        },
      ),
      kart(
        'Korunan alanlar',
        'Millî parklar ve tabiat koruma alanları habitatı bütün hâlinde korur; tohum bankaları gen çeşitliliğini saklar.',
      ),
      kart(
        'Ekolojik koridorlar',
        'Parçalanmış habitatları birbirine bağlayan şeritler; popülasyonların karışmasını ve gen akışını sürdürür.',
      ),
      kart(
        'Sürdürülebilir tarım',
        'Nöbetleşe ekim, damla sulama ve biyolojik mücadele toprağı yormadan üretim yapmanın yolları.',
      ),
      kart(
        'Bireysel katkının sınırı',
        'Bireysel çaba önemlidir ama yeterli değil; asıl fark üretim ve enerji politikalarında ortaya çıkar.',
      ),
    ]),
  ]),
])
