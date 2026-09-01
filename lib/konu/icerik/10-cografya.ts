import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Coğrafya — Maarif Modeli.
 *
 * Tema adları 9. sınıfla aynı; içerik değişiyor. Bu sınıfın ağırlığı yerin
 * yapısında: jeolojik zamanlar, levha hareketleri, iç ve dış kuvvetler.
 */
export const cografya10 = program('cografya', 10, [
  tema('cog10-t1', 'Coğrafyanın Doğası', [
    konu('cog10-bakis', 'Coğrafi Bakış', [
      kart(
        'Coğrafyanın dört sorusu',
        'Nerede, neden orada, nasıl değişiyor, sonucu ne? Coğrafi bakış bu dört soruyu birlikte sorar.',
      ),
      kart(
        'Dağılış',
        'Bir olayın yeryüzüne yayılışı. Dağılışa bakmak, sebebe ulaşmanın ilk adımıdır.',
      ),
      kart(
        'Mekân',
        'Yalnız fiziki bir alan değil; insanın anlam yüklediği yer. Aynı vadi kimine tarla, kimine turizm bölgesidir.',
      ),
      kart(
        'Ölçek değiştirmek',
        'Aynı olay yerel, bölgesel ve küresel ölçekte farklı görünür. Ölçek değişince açıklama da değişir.',
      ),
    ]),
  ]),
  tema('cog10-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog10-algilama', 'Uzaktan Algılama', [
      kart(
        'Uzaktan algılama nedir?',
        'Yüzeye dokunmadan, uydu ya da hava aracıyla veri toplamak. Ulaşılamayan alanlar böyle izlenir.',
      ),
      kart(
        'Uydu görüntüsü fotoğraf değildir',
        'Farklı dalga boylarında ölçüm taşır; gözle görünmeyen bitki sağlığı ya da nem bilgisi de okunabilir.',
      ),
      kart(
        'Zaman serisi',
        'Aynı alanın farklı tarihlerdeki görüntüleri karşılaştırılır. Orman kaybı ve göl çekilmesi böyle ölçülür.',
      ),
      kart(
        'Veri ve karar',
        'CBS bu veriyi katmanlara döker; afet, tarım ve kent planlaması kararları buradan çıkar.',
      ),
    ]),
  ]),
  tema('cog10-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog10-jeolojik', 'Jeolojik Zamanlar', [
      kart(
        'Yerin yaşı',
        'Dünya yaklaşık 4,6 milyar yaşında. Jeolojik zamanlar bu süreyi büyük olaylara göre bölümler.',
      ),
      kart(
        'Zamanların işaretleri',
        'I. zamanda taş kömürü yatakları, II. zamanda dinozorlar ve Alp-Himalaya kuşağının tabanı, III. zamanda linyit ve petrol, IV. zamanda buzul çağları ve insan.',
      ),
      kart(
        'Türkiye’nin şekillenmesi',
        'Bugünkü yer şekilleri büyük ölçüde III. zamanda oluştu, IV. zamanda son hâlini aldı: Anadolu genç ve hareketli bir kara parçasıdır.',
      ),
      kart(
        'Fosiller',
        'Tabakaların yaşını belirler. Alt tabaka üsttekinden yaşlıdır — jeolojinin temel kuralı.',
      ),
    ]),
    konu('cog10-levha', 'Levha Hareketleri', [
      kart(
        'Levha tektoniği',
        'Yer kabuğu, manto üzerinde hareket eden levhalardan oluşur. Depremlerin ve volkanların çoğu levha sınırlarındadır.',
      ),
      kart(
        'Üç sınır türü',
        'Levhalar birbirinden uzaklaşır (okyanus ortası sırtlar), yaklaşır (dağ oluşumu, deniz çukurları) ya da yan yana sürtünür (fay hatları).',
      ),
      kart(
        'Kıtaların kayması',
        'Wegener, kıtaların bir zamanlar tek parça (Pangea) olduğunu ileri sürdü; kanıtları kıyı uyumu ve ortak fosillerdi.',
      ),
      kart(
        'Türkiye neden depremsel?',
        'Avrasya, Afrika ve Arabistan levhalarının sıkıştırdığı bir alanda; Kuzey Anadolu Fay Hattı bu sıkışmanın sonucudur.',
      ),
    ]),
    konu('cog10-ickuvvet', 'İç Kuvvetler', [
      kart(
        'Enerjisi yerin içinden',
        'İç kuvvetler yer şekillerini büyütür ve yükseltir: orojenez, epirojenez, volkanizma ve depremler.',
      ),
      kart(
        'Orojenez (dağ oluşumu)',
        'Tortuların sıkışmasıyla kıvrım ya da kırık dağlar oluşur. Kıvrımda antiklinal-senklinal, kırıkta horst-graben görülür.',
      ),
      kart(
        'Epirojenez',
        'Geniş alanların toptan alçalıp yükselmesi. Kıta sıkışmadan, blok hâlinde hareket eder.',
      ),
      kart(
        'Volkanizma',
        'Magmanın yüzeye çıkması. Yüzeye çıkarsa püskürük, içeride kalırsa derinlik kayaçları oluşur.',
      ),
    ]),
    konu('cog10-kayac', 'Kayaçlar ve Döngüsü', [
      kart(
        'Üç ana grup',
        'Püskürük (magmadan), tortul (birikimle) ve başkalaşım (sıcaklık-basınçla değişen) kayaçlar.',
      ),
      kart(
        'Tortul kayaçlar',
        'Fosil yalnız bunlarda bulunur. Kömür, petrol ve kireç taşı tortul kökenlidir.',
      ),
      kart(
        'Başkalaşım örnekleri',
        'Kireç taşı → mermer, kil taşı → şist, granit → gnays, kömür → elmas yönünde değişir.',
      ),
      kart(
        'Kayaç döngüsü',
        'Kayaçlar birbirine dönüşür: aşınan kayaç tortullaşır, gömülen tortul başkalaşır, eriyen kayaç magmaya karışır.',
      ),
    ]),
    konu('cog10-diskuvvet', 'Dış Kuvvetler', [
      kart(
        'Enerjisi güneşten',
        'Dış kuvvetler yer şekillerini aşındırır ve düzleştirir: akarsu, rüzgâr, buzul, dalga ve yer altı suyu.',
      ),
      kart(
        'Akarsu',
        'En etkili dış kuvvet. Üst çığırda aşındırır (vadi, dev kazanı), alt çığırda biriktirir (delta, birikinti ovası).',
      ),
      kart(
        'Rüzgâr',
        'Kurak alanlarda etkilidir. Mantar kaya ve tafoni aşındırma, kumul ve lös birikim şekilleridir.',
      ),
      kart(
        'Buzul',
        'Soğuk ve yüksek alanlarda. Sirk, buzul vadisi (U biçimli) ve moren bu kuvvetin izleridir.',
      ),
      kart(
        'Karstlaşma',
        'Kireç taşının suda çözünmesi. Mağara, dolin, obruk ve sarkıt-dikit böyle oluşur.',
      ),
    ]),
  ]),
  tema('cog10-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog10-yerlesme', 'Yerleşmeler', [
      kart(
        'Yerleşme yerini ne belirler?',
        'Su kaynağı, düz arazi, verimli toprak, güvenlik ve ulaşım. Tarihte savunma, bugün ulaşım daha belirleyici.',
      ),
      kart(
        'Kır yerleşmeleri',
        'Nüfusu az, ekonomisi tarım ve hayvancılığa dayalı. Toplu ya da dağınık dokuda olabilir; su bolsa dağınık doku görülür.',
      ),
      kart(
        'Şehir yerleşmeleri',
        'Nüfusu fazla, tarım dışı işlerin baskın olduğu yerleşmeler. Sınır yalnız nüfus değil, ekonomik yapıdır.',
      ),
      kart(
        'Şehir fonksiyonları',
        'Sanayi (Kocaeli), ticaret (İstanbul), turizm (Antalya), liman (İzmir), idare (Ankara), maden (Zonguldak).',
      ),
      kart(
        'Metropol',
        'Çevresindeki yerleşmeleri etkileyen büyük şehir. Etki alanı idari sınırından çok daha geniştir.',
      ),
    ]),
  ]),
  tema('cog10-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog10-gelismislik', 'Ekonomi ve Gelişmişlik', [
      kart(
        'İstihdam yapısı',
        'Çalışanların sektörlere dağılımı gelişmişliğin en açık göstergesidir: tarımda çalışan oranı düştükçe gelişmişlik artar.',
      ),
      kart(
        'GSYİH ve GSMH',
        'GSYİH ülke sınırları içinde üretilen değeri, GSMH o ülkenin vatandaşlarının nerede olursa olsun ürettiğini ölçer.',
      ),
      kart(
        'Kişi başına gelir yanıltabilir',
        'Ortalama, gelirin nasıl dağıldığını söylemez. Bu yüzden eğitim ve sağlık verileriyle birlikte okunur.',
      ),
      kart(
        'İnsani gelişme',
        'Gelirin yanında yaşam süresi ve eğitimi de hesaba katan ölçüt. Zengin ama eşitsiz ülkeler burada geriye düşer.',
      ),
    ]),
  ]),
  tema('cog10-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog10-direncli', 'Afete Dirençli Toplum', [
      kart(
        'Dirençlilik nedir?',
        'Afetten sonra hızla toparlanabilme kapasitesi. Yalnız binayla değil, örgütlenmeyle de ilgilidir.',
      ),
      kart(
        'Güvenli yaşam alanı',
        'Zemin etüdü yapılmış, dere yatağından ve fay hattından uzak, kaçış yolları planlanmış alan.',
      ),
      kart(
        'Afet bilinci',
        'Tatbikat, afet çantası, toplanma alanı bilgisi ve aile iletişim planı. Bilgi, panikten daha hızlıdır.',
      ),
      kart(
        'Sürdürülebilirlik',
        'Bugünün ihtiyacını, gelecek kuşakların imkânını tüketmeden karşılamak. Afet yönetimi de bu çerçevenin parçası.',
      ),
    ]),
  ]),
  tema('cog10-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog10-miras', 'Kültürel Miras ve Türk Dünyası', [
      kart(
        'Kültürel miras',
        'Somut (yapı, eser) ve somut olmayan (dil, gelenek, zanaat) miras. İkisi de korunmadığında geri getirilemez.',
      ),
      kart(
        'Türkistan',
        'Orta Asya’daki tarihî Türk yurdu. Bugünkü Türk cumhuriyetlerinin ortak kültür havzası.',
      ),
      kart(
        'Ortak bağlar',
        'Dil akrabalığı, destanlar, müzik ve el sanatları. Coğrafi uzaklığa rağmen süren bağlar kültürel bölge oluşturur.',
      ),
      kart(
        'Küresel bağlantı',
        'Ticaret, enerji hatları ve göç yolları bölgeleri birbirine bağlar; bir bölgedeki değişim uzaktakini de etkiler.',
      ),
    ]),
  ]),
])
