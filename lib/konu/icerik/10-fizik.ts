import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Fizik — Maarif Modeli.
 *
 * Dört tema: Kuvvet ve Hareket, Enerji, Elektrik, Dalgalar. Konu adları ve
 * sırası `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Newton yasaları 10. sınıfın içerik çerçevesinde ayrı bir konu değil;
 * hareket bu sınıfta grafiklerle ve sabit ivmeyle işleniyor.
 */
export const fizik10 = program('fizik', 10, 'Hareketten dalgalara', [
  tema('fzk10-t1', 'Kuvvet ve Hareket', [
    konu('fzk10-sabit-hiz', 'Sabit Hızlı Hareket', [
      kart(
        'Tanımı',
        'Cisim eşit zaman aralıklarında eşit yer değiştirir. Hız büyüklüğü ve yönü değişmez, ivme sıfırdır.',
      ),
      kart(
        'Konum-zaman grafiği',
        'Doğrusaldır ve eğimi hızı verir. Eğim dikleştikçe hız büyür; yatay doğru duran cismi gösterir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'konum',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [3, 5.5],
              ],
              kirik: true,
              ad: 'hızlı',
            },
            {
              noktalar: [
                [0, 0],
                [5.5, 2.5],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'yavaş',
            },
          ],
        },
      ),
      kart(
        'Hız-zaman grafiği',
        'Zaman eksenine paralel bir doğrudur. Grafiğin altında kalan alan alınan yolu verir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 3],
                [5, 3],
                [5, 0],
                [0, 0],
              ],
              kirik: true,
              kapali: true,
            },
          ],
          etiketler: [{ x: 2.5, y: 1.4, ad: 'alan = yol', renk: 'ikincil' }],
        },
      ),
      kart(
        'Yol hesabı',
        'x = v · t. Sabit hızda yol, hız ile zamanın çarpımıdır.',
      ),
      kart(
        'Grafik dönüşümü',
        'Konum-zamanın eğimi hız-zamanı, hız-zamanın altındaki alan konum değişimini verir. İki grafik aynı hareketi anlatır.',
      ),
      kart(
        'Ortalama hız',
        'Toplam yer değiştirmenin toplam zamana bölümü. Anlık hızların ortalaması değildir; ikisi çoğu zaman farklı çıkar.',
      ),
    ]),
    konu('fzk10-sabit-ivme', 'Bir Boyutta Sabit İvmeli Hareket', [
      kart(
        'İvme nedir?',
        'Hızın zamana göre değişimi. Sabit ivmede hız eşit zaman aralıklarında eşit miktarda değişir.',
      ),
      kart(
        'Hızlanma ve yavaşlama',
        'İvme hızla aynı yöndeyse cisim hızlanır, zıt yöndeyse yavaşlar. İvmenin işareti tek başına yeterli bilgi değildir.',
      ),
      kart(
        'Hız-zaman grafiği',
        'Eğimi ivmeyi, altında kalan alan yer değiştirmeyi verir. Eksenin altındaki alan ters yönde yol demektir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 1],
                [5, 5],
              ],
              kirik: true,
              ad: 'eğim = a',
            },
          ],
        },
      ),
      kart(
        'Konum-zaman grafiği',
        'Sabit ivmede parabol olur: hız arttıkça aynı sürede alınan yol da artar ve eğri dikleşir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'konum',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 0.2],
                [2, 0.8],
                [3, 1.8],
                [4, 3.2],
                [5, 5],
              ],
            },
          ],
        },
      ),
      kart(
        'Denklemler',
        'v = v₀ + a·t ve x = v₀·t + ½·a·t². İkisi de yalnızca ivme sabitken geçerlidir.',
      ),
      kart(
        'Zamansız denklem',
        'v² = v₀² + 2·a·x. Zaman bilinmiyorken hız ile yol arasındaki bağı doğrudan verir.',
      ),
      kart(
        'Serbest düşme',
        'Hava direnci ihmal edilirse tüm cisimler aynı ivmeyle (yaklaşık 9,8 m/s²) düşer; kütle fark etmez.',
      ),
      kart(
        'Düşey atış',
        'Yukarı atılan cisim en yüksek noktada bir an durur ama ivmesi hâlâ aşağı yönlüdür ve büyüklüğü değişmez.',
      ),
    ]),
  ]),
  tema('fzk10-t2', 'Enerji', [
    konu('fzk10-is-guc', 'İş, Enerji ve Güç', [
      kart(
        'Fizikte iş',
        'Kuvvetin, yer değiştirme yönündeki bileşeni ile yer değiştirmenin çarpımı. Birimi joule.',
      ),
      kart(
        'Ne zaman iş sıfırdır?',
        'Üç durumda iş yapılmaz ve üçü de günlük dildeki "iş" ile çelişir.',
        {
          tur: 'tablo',
          basliklar: ['Durum', 'İş'],
          satirlar: [
            ['Yer değiştirme yok', '0'],
            ['Kuvvet yola dik', '0'],
            ['Kuvvet yok', '0'],
          ],
        },
      ),
      kart(
        'Kuvvet-yer değiştirme grafiği',
        'Grafiğin altında kalan alan yapılan işi verir. Kuvvet değişkense iş bu alandan bulunur.',
      ),
      kart(
        'İş enerjiyi değiştirir',
        'Bir cisme yapılan net iş, kinetik enerjisindeki değişime eşittir. İş ile enerji aynı birimi paylaşır.',
      ),
      kart(
        'Güç',
        'Birim zamanda yapılan iş. Birimi watt; aynı işi kısa sürede yapan makine daha güçlüdür.',
      ),
      kart(
        'Verim',
        'Alınan enerjinin ne kadarının işe dönüştüğü. Hiçbir makinede yüzde yüz değildir; kalan kısım ısıya gider.',
      ),
    ]),
    konu('fzk10-enerji-bicim', 'Enerji Biçimleri', [
      kart(
        'Kinetik enerji',
        'Hareketten gelen enerji. Kütleyle doğru, hızın karesiyle orantılıdır — hız iki katına çıkınca enerji dörde katlanır.',
      ),
      kart(
        'Neden hızın karesi?',
        'Fren mesafesi bunun günlük karşılığıdır: hızı iki katına çıkan araç, durmak için dört katı mesafeye ihtiyaç duyar.',
      ),
      kart(
        'Potansiyel enerji',
        'Konumdan ya da şekilden gelen depolanmış enerji: yerden yükseklik veya sıkışmış bir yay.',
      ),
      kart(
        'Diğer biçimler',
        'Isı, ışık, ses, elektrik, kimyasal ve nükleer enerji. Hepsi birbirine dönüşebilir.',
      ),
      kart(
        'Dönüşüm zinciri',
        'Bir enerji biçimi ötekine geçerken her adımda bir miktarı ısıya gider.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Kimyasal', alt: 'yakıt' },
            { ad: 'Isı' },
            { ad: 'Mekanik' },
            { ad: 'Elektrik' },
          ],
        },
      ),
      kart(
        'Enerjinin korunumu',
        'Enerji yoktan var olmaz, yok olmaz; yalnızca biçim değiştirir. Toplam enerji sabit kalır.',
      ),
    ]),
    konu('fzk10-mekanik', 'Mekanik Enerji', [
      kart(
        'Tanımı',
        'Kinetik enerji ile potansiyel enerjinin toplamı.',
      ),
      kart(
        'Korunum',
        'Sürtünme ve hava direnci yoksa mekanik enerji sabit kalır; biri azalırken öteki aynı kadar artar.',
      ),
      kart(
        'Sarkaç',
        'En yüksek noktada potansiyel en büyük, kinetik sıfırdır; en alçak noktada tersi olur.',
        {
          tur: 'tablo',
          basliklar: ['Konum', 'Potansiyel', 'Kinetik'],
          satirlar: [
            ['En yüksek', 'En büyük', 'Sıfır'],
            ['Orta', 'Orta', 'Orta'],
            ['En alçak', 'Sıfır', 'En büyük'],
          ],
        },
      ),
      kart(
        'Yükseklik nereden ölçülür?',
        'Potansiyel enerji seçilen sıfır düzeyine göredir. Değişimi ise seçimden bağımsızdır; hesaba giren o değişimdir.',
      ),
      kart(
        'Sürtünme varsa',
        'Mekanik enerjinin bir kısmı ısıya dönüşür. Toplam enerji yine korunur ama mekanik enerji azalır.',
      ),
      kart(
        'Yol fark etmez',
        'Sürtünmesiz bir kaydırakta son hız, yolun eğimine değil yalnızca yükseklik farkına bağlıdır.',
      ),
    ]),
    konu('fzk10-kaynak', 'Enerji Kaynakları', [
      kart(
        'Yenilenebilir',
        'Güneş, rüzgâr, hidroelektrik, jeotermal ve biyokütle. Kendini yenileyen kaynaklardır.',
      ),
      kart(
        'Yenilenemez',
        'Kömür, petrol, doğal gaz ve nükleer yakıt. Oluşumları milyonlarca yıl sürer, tükenirler.',
      ),
      kart(
        'Karşılaştırma',
        'İki grubun üstünlükleri farklı yerlerde; hiçbiri her ölçüte göre üstün değil.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fosil', 'Yenilenebilir'],
          satirlar: [
            ['Süreklilik', 'Yüksek', 'Değişken'],
            ['Salım', 'Yüksek', 'Düşük'],
            ['Tükenme', 'Var', 'Yok'],
          ],
        },
      ),
      kart(
        'Süreklilik sorunu',
        'Güneş gece, rüzgâr durgun havada üretmez. Bu yüzden depolama ve şebeke esnekliği en kritik konu.',
      ),
      kart(
        'Nükleer enerji',
        'Salım açısından temiz, enerji yoğunluğu çok yüksek; ama yakıt tükenir ve atık uzun süre saklanmalıdır.',
      ),
      kart(
        'Türkiye’de durum',
        'Jeotermal ve hidroelektrikte güçlü bir potansiyel var; rüzgâr ve güneş kurulu gücü hızla artıyor.',
      ),
      kart(
        'Tasarruf da bir kaynaktır',
        'Harcanmayan enerji üretilmesi gerekmeyen enerjidir. Yalıtım ve verimli cihaz en ucuz "kaynak"tır.',
      ),
    ]),
  ]),
  tema('fzk10-t3', 'Elektrik', [
    konu('fzk10-devre', 'Basit Elektrik Devreleri', [
      kart(
        'Devre elemanları',
        'Üreteç enerji verir, iletken taşır, direnç harcar, anahtar yolu açıp kapatır.',
      ),
      kart(
        'Kapalı devre şart',
        'Akımın akması için yolun kesintisiz olması gerekir. Anahtar açıksa devre kopar ve akım geçmez.',
      ),
      kart(
        'Potansiyel fark',
        'İki nokta arasındaki enerji farkı; akımı iten şey budur. Birimi volt.',
      ),
      kart(
        'Su benzetmesi',
        'Devreyi anlamanın en kolay yolu su devresidir; benzetme sınırlı ama üç kavramı yerine oturtur.',
        {
          tur: 'tablo',
          basliklar: ['Elektrik', 'Su'],
          satirlar: [
            ['Gerilim', 'Basınç farkı'],
            ['Akım', 'Debi'],
            ['Direnç', 'Dar boru'],
          ],
        },
      ),
      kart(
        'Şema çizimi',
        'Elemanlar standart sembollerle gösterilir. Şema, devrenin fiziksel görüntüsünü değil bağlantısını anlatır.',
      ),
      kart(
        'Elektriksel enerji',
        'Devrede harcanan enerji, gerilim ile akımın ve sürenin çarpımıdır. Elektrik faturası bu enerjiyi ölçer.',
      ),
    ]),
    konu('fzk10-akim', 'Elektrik Akımı', [
      kart(
        'Tanımı',
        'Birim zamanda bir kesitten geçen yük miktarı. Birimi amper.',
      ),
      kart(
        'Yönü',
        'Gerçekte elektronlar eksiden artıya gider; geleneksel akım yönü ise artıdan eksiye kabul edilir.',
      ),
      kart(
        'Neden hareket eder?',
        'Potansiyel farkı serbest elektronlara kuvvet uygular. Fark ortadan kalkarsa akım durur.',
      ),
      kart(
        'Elektron yavaş, sinyal hızlı',
        'Elektronlar telde çok yavaş ilerler ama elektriksel etki neredeyse ışık hızıyla yayılır; lamba anında yanar.',
      ),
      kart(
        'Ampermetre',
        'Akımı ölçer ve devreye seri bağlanır. Paralel bağlanırsa kısa devre olur.',
      ),
      kart(
        'Voltmetre',
        'Gerilimi ölçer ve ölçülecek elemana paralel bağlanır. Seri bağlanırsa devreden akım geçmez.',
      ),
    ]),
    konu('fzk10-ohm', 'Ohm Yasası', [
      kart(
        'Bağıntı',
        'V = I · R. Potansiyel fark, akım ile direncin çarpımına eşittir.',
      ),
      kart(
        'Direnç nedir?',
        'Akıma karşı gösterilen zorluk. Birimi ohm; iletkenin cinsine, uzunluğuna, kesitine ve sıcaklığına bağlıdır.',
      ),
      kart(
        'Uzunluk ve kesit',
        'Direnç uzunlukla doğru, kesit alanıyla ters orantılıdır. Kalın kablo daha az direnç gösterir.',
      ),
      kart(
        'Grafiği',
        'Gerilim-akım grafiği doğrusaldır ve eğimi direnci verir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'akım',
          yAd: 'gerilim',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [2.5, 5.5],
              ],
              kirik: true,
              ad: 'büyük R',
            },
            {
              noktalar: [
                [0, 0],
                [5.5, 2.5],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'küçük R',
            },
          ],
        },
      ),
      kart(
        'Sıcaklık etkisi',
        'Metallerde sıcaklık arttıkça direnç artar. Lamba teli soğukken daha az, yanarken daha çok direnç gösterir.',
      ),
      kart(
        'Ohmik olmayan elemanlar',
        'Diyot ve lamba gibi bazı elemanlarda grafik doğru çıkmaz; Ohm yasası her elemanda geçerli değildir.',
      ),
    ]),
    konu('fzk10-direnc-baglama', 'Dirençlerin Bağlanması', [
      kart(
        'Seri bağlama',
        'Dirençler uç uca eklenir. Eşdeğer direnç dirençlerin toplamıdır; akım her elemanda aynıdır.',
      ),
      kart(
        'Paralel bağlama',
        'Dirençler aynı iki nokta arasına bağlanır. Eşdeğer direnç en küçük dirençten de küçüktür; gerilim ortaktır.',
      ),
      kart(
        'İkisinin karşılaştırması',
        'Hangi büyüklüğün ortak, hangisinin bölündüğü iki bağlamada tam tersidir.',
        {
          tur: 'tablo',
          basliklar: ['', 'Seri', 'Paralel'],
          satirlar: [
            ['Akım', 'Ortak', 'Bölünür'],
            ['Gerilim', 'Bölünür', 'Ortak'],
            ['Eşdeğer R', 'Artar', 'Azalır'],
          ],
        },
      ),
      kart(
        'Ev tesisatı neden paralel?',
        'Biri bozulunca ötekiler çalışmaya devam etsin ve her cihaz aynı gerilimi görsün diye.',
      ),
      kart(
        'Kısa devre',
        'Akım dirençsiz bir yol bulursa aşırı büyür; kablo ısınır ve yangın çıkabilir. Sigorta bunu keser.',
      ),
      kart(
        'Karışık bağlama',
        'Devre parça parça sadeleştirilir: önce en içteki seri ya da paralel gruplar tek dirence indirilir.',
      ),
    ]),
    konu('fzk10-uretec-baglama', 'Üreteçlerin Bağlanması', [
      kart(
        'Seri bağlama',
        'Üreteçlerin gerilimleri toplanır. Uzaktan kumandada iki pilin uç uca konması bu yüzdendir.',
      ),
      kart(
        'Paralel bağlama',
        'Özdeş üreteçlerde gerilim tek üretecinki kadar kalır, ama devre daha uzun süre beslenir.',
      ),
      kart(
        'Ters bağlama',
        'Zıt yönde bağlanan üreteçlerin gerilimleri birbirini götürür; devreye net katkı azalır.',
      ),
      kart(
        'İç direnç',
        'Gerçek üreteçlerin kendi direnci vardır; bu yüzden uçlarındaki gerilim yük altında bir miktar düşer.',
      ),
      kart(
        'Neden pil biter?',
        'Kimyasal madde tükenirken iç direnç büyür; uçlardaki gerilim yük altında hızla düşer ve cihaz çalışmaz olur.',
      ),
      kart(
        'Farklı piller karıştırılmaz',
        'Seri bağlı farklı kapasitedeki piller birbirini zorlar; biten pil ötekiler tarafından ters yönde sürülebilir.',
      ),
    ]),
    konu('fzk10-tehlike', 'Elektrik Akımının Tehlikelerine Karşı Önlemler', [
      kart(
        'Tehlikeli olan akımdır',
        'İnsan için asıl tehlike gerilim değil, vücuttan geçen akımın şiddeti ve süresidir.',
      ),
      kart(
        'Sigorta',
        'Akım güvenli sınırı aşınca devreyi otomatik keser. Kablo yangınlarının önündeki ilk engeldir.',
      ),
      kart(
        'Kaçak akım rölesi',
        'Giren ve çıkan akımı karşılaştırır; fark varsa akım insan üzerinden kaçıyor demektir ve devre anında kesilir.',
      ),
      kart(
        'Sigorta insanı korumaz',
        'Sigorta kabloyu, kaçak akım rölesi insanı korur. İkisi farklı işler yapar ve biri ötekinin yerini tutmaz.',
      ),
      kart(
        'Islak elle dokunma',
        'Su vücut direncini düşürür ve aynı gerilimde çok daha büyük akım geçer. Banyoda priz kuralları bundandır.',
      ),
      kart(
        'Çoklu priz yükü',
        'Aynı prizden çok sayıda yüksek güçlü cihaz beslemek kabloyu ısıtır; ısınan kablo yangının en sık sebebidir.',
      ),
    ]),
    konu('fzk10-topraklama', 'Topraklamanın Önemi', [
      kart(
        'Ne yapar?',
        'Cihazın gövdesini toprağa bağlar. Kaçak akım insan yerine düşük dirençli bu yoldan toprağa gider.',
      ),
      kart(
        'Neden gerekli?',
        'Yalıtımı bozulan bir cihazın metal gövdesi gerilim altında kalabilir; topraklama olmadan dokunan kişi yolu tamamlar.',
      ),
      kart(
        'Üçüncü uç',
        'Prizdeki üçüncü uç topraklama hattıdır. Topraksız uzatma kabloları bu korumayı ortadan kaldırır.',
      ),
      kart(
        'En az dirençli yol',
        'Akım tek bir yoldan gitmez, yolları dirençleriyle ters orantılı paylaşır. Topraklamanın işi insandan daha kolay bir yol açmaktır.',
      ),
      kart(
        'Paratoner',
        'Yıldırımı binanın üstünden alıp toprağa iletir. Aynı ilkenin bina ölçeğindeki uygulamasıdır.',
      ),
    ]),
  ]),
  tema('fzk10-t4', 'Dalgalar', [
    konu('fzk10-periyodik', 'Periyodik Hareketler', [
      kart(
        'Tanımı',
        'Belirli zaman aralıklarında kendini tekrarlayan hareket. Sarkaç, yay ve dönen tekerlek örnektir.',
      ),
      kart(
        'Periyot ve frekans',
        'Periyot bir tam hareketin süresi, frekans birim zamandaki tekrar sayısı. Biri ötekinin tersidir.',
      ),
      kart(
        'Basit sarkaç',
        'Periyodu ipin uzunluğuna ve yer çekimine bağlıdır; asılan kütleye bağlı değildir.',
      ),
      kart(
        'Genlik periyodu değiştirmez',
        'Küçük salınımlarda sarkacın periyodu, ne kadar açıldığından bağımsızdır. Saatlerin sarkaçla çalışmasının sebebi budur.',
      ),
      kart(
        'Salınım',
        'Denge konumu çevresindeki gidip gelme. Dalgayı üreten hareket budur.',
        {
          tur: 'koordinat',
          pencere: [0, 8, -3, 3],
          xAd: 'zaman',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 2],
                [2, 0],
                [3, -2],
                [4, 0],
                [5, 2],
                [6, 0],
                [7, -2],
              ],
            },
          ],
        },
      ),
      kart(
        'Yay sarkacı',
        'Periyodu yayın sertliğine ve asılan kütleye bağlıdır; basit sarkacın tersine kütle burada etkilidir.',
      ),
    ]),
    konu('fzk10-dalga-kavram', 'Dalgaların Temel Kavramları', [
      kart(
        'Dalga nedir?',
        'Enerjinin, madde taşınmadan ortamda yayılması. Denizde şamandıra ilerlemez, yalnızca inip kalkar.',
      ),
      kart(
        'Dalga boyu',
        'Ardışık iki tepe ya da iki çukur arasındaki uzaklık.',
        {
          tur: 'koordinat',
          pencere: [0, 8, -3, 3],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 2],
                [2, 0],
                [3, -2],
                [4, 0],
                [5, 2],
                [6, 0],
                [7, -2],
              ],
            },
            {
              noktalar: [
                [1, 2.5],
                [5, 2.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 3, y: 2.9, ad: 'dalga boyu', renk: 'ikincil' },
            { x: 6.6, y: 1.1, ad: 'genlik', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Genlik',
        'Denge konumundan en büyük uzaklık. Dalganın taşıdığı enerjiyi genlik belirler.',
      ),
      kart(
        'Periyot ve frekans',
        'Bir tam dalganın geçme süresi periyot, saniyedeki dalga sayısı frekanstır. Frekansı kaynak belirler.',
      ),
      kart(
        'Yayılma sürati',
        'Dalga boyu ile frekansın çarpımı. Frekansı kaynak, sürati ortam belirler.',
      ),
      kart(
        'Genlik enerjidir',
        'Sesin şiddeti genlikle, tizliği frekansla ilgilidir. İkisi bağımsız değişir; yüksek ses tiz olmak zorunda değildir.',
      ),
    ]),
    konu('fzk10-dalga-sinif', 'Dalgaların Sınıflandırılması', [
      kart(
        'İki ölçüt',
        'Dalgalar iki ayrı soruya göre sınıflandırılır: ortam gerekiyor mu, titreşim hangi yönde?',
        {
          tur: 'tablo',
          basliklar: ['Ölçüt', 'Türler'],
          satirlar: [
            ['Ortam', 'Mekanik / EM'],
            ['Titreşim yönü', 'Enine / Boyuna'],
          ],
        },
      ),
      kart(
        'Mekanik dalga',
        'Yayılmak için ortama ihtiyaç duyar: ses, su ve yay dalgaları. Boşlukta yayılamaz.',
      ),
      kart(
        'Elektromanyetik dalga',
        'Ortam gerektirmez, boşlukta da yayılır. Işık, radyo dalgası ve röntgen ışını bu türdendir.',
      ),
      kart(
        'Enine dalga',
        'Titreşim doğrultusu yayılma doğrultusuna diktir. Su dalgaları ve ışık böyledir.',
      ),
      kart(
        'Boyuna dalga',
        'Titreşim yayılma yönüyle aynı doğrultudadır. Ses dalgası sıkışma ve seyrelmelerle ilerler.',
      ),
      kart(
        'Uzayda ses yok',
        'Ses mekanik bir dalgadır ve taşıyacak tanecik ister; boşlukta hiçbir ses yayılmaz, ama ışık yayılır.',
      ),
      kart(
        'Elektromanyetik tayf',
        'Radyo, mikrodalga, kızılötesi, görünür ışık, morötesi, X ve gama ışınları. Sıra frekans arttıkça ilerler.',
        {
          tur: 'katman',
          eksenAdi: 'FREKANS ARTAR',
          katmanlar: [
            { ad: 'Gama ve X' },
            { ad: 'Morötesi' },
            { ad: 'Görünür ışık' },
            { ad: 'Kızılötesi' },
            { ad: 'Radyo ve mikrodalga' },
          ],
        },
      ),
    ]),
    konu('fzk10-yayilma-surati', 'Dalgaların Yayılma Süratini Etkileyen Etmenler', [
      kart(
        'Ortam belirler',
        'Sürat kaynağın değil ortamın özelliğidir. Kaynağı değiştirmek frekansı değiştirir, sürati değil.',
      ),
      kart(
        'Ses hangi ortamda hızlı?',
        'Katıda en hızlı, gazda en yavaş yayılır; tanecikler birbirine yakın olduğunda titreşim daha çabuk aktarılır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Gaz', alt: 'en yavaş' },
            { ad: 'Sıvı' },
            { ad: 'Katı', alt: 'en hızlı' },
          ],
        },
      ),
      kart(
        'Sıcaklık etkisi',
        'Havada sıcaklık arttıkça ses sürati artar. Tanecikler daha hızlı hareket eder.',
      ),
      kart(
        'Işıkta tersi',
        'Işık en hızlı boşlukta yayılır; yoğun ortamda yavaşlar. Ses ile ışık bu açıdan birbirinin tersidir.',
      ),
      kart(
        'Su dalgalarında derinlik',
        'Derin suda dalga hızlı, sığ suda yavaş ilerler. Kıyıya yaklaşan dalganın yükselmesi bundandır.',
      ),
      kart(
        'Yay dalgasında',
        'Gergin ve hafif yayda dalga daha hızlı yayılır. Gitar telinin sesi gerginlikle tizleşir.',
      ),
    ]),
    konu('fzk10-yansima-kirilma', 'Su Dalgalarında Yansıma ve Kırılma', [
      kart(
        'Yansıma',
        'Dalga engele çarpıp geri döner. Gelme açısı yansıma açısına eşittir; dalga boyu ve frekans değişmez.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [9, 1],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [1.5, 5],
                [5, 1],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [5, 1],
                [8.5, 5],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
            {
              noktalar: [
                [5, 1],
                [5, 5.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
          ],
        },
      ),
      kart(
        'Kırılma',
        'Dalga derinliği farklı bölgeye geçerken sürati ve dalga boyu değişir, doğrultusu kırılır.',
      ),
      kart(
        'Frekans değişmez',
        'Kırılmada frekans sabittir; onu kaynak belirler. Değişen şey sürat ve dalga boyudur.',
      ),
      kart(
        'Hangi yöne kırılır?',
        'Yavaşlayan dalga normale yaklaşır, hızlanan dalga normalden uzaklaşır. Derinden sığa geçiş yavaşlatır.',
      ),
      kart(
        'Doğru gelirse',
        'Dalga sınıra dik gelirse doğrultu değişmez, yalnızca sürat ve dalga boyu değişir.',
      ),
      kart(
        'Kıyıya paralel dalgalar',
        'Sığlaşan suda dalga yavaşlayıp kırıldığı için, açıdan gelen dalgalar kıyıya neredeyse paralel varır.',
      ),
    ]),
    konu('fzk10-rezonans', 'Rezonans ve Deprem', [
      kart(
        'Doğal frekans',
        'Her cismin kendiliğinden titreştiği bir frekans vardır. Bardağın tınlaması bu frekanstadır.',
      ),
      kart(
        'Rezonans',
        'Dış etkinin frekansı cismin doğal frekansına eşitse genlik hızla büyür. Az kuvvetle büyük salınım oluşur.',
      ),
      kart(
        'Salıncak örneği',
        'Salıncağı iten kişi doğru anda ittiğinde küçük itmeler büyük salınım üretir; yanlış anda itmek salınımı söndürür.',
      ),
      kart(
        'Depremde neden önemli?',
        'Yer sarsıntısının frekansı binanın doğal frekansına yakınsa bina daha şiddetli sallanır ve hasar artar.',
      ),
      kart(
        'Bina yüksekliği',
        'Alçak binaların doğal frekansı yüksek, yüksek binalarınki düşüktür. Aynı deprem farklı yükseklikteki binaları farklı zorlar.',
      ),
      kart(
        'Odak ve merkez üssü',
        'Odak, kırılmanın yer altındaki noktası; merkez üssü ise odağın yeryüzündeki izdüşümüdür.',
      ),
      kart(
        'Şiddet ve büyüklük',
        'Büyüklük açığa çıkan enerjidir ve tektir; şiddet ise hissedilen etkidir ve yere göre değişir.',
        {
          tur: 'tablo',
          basliklar: ['Büyüklük', 'Şiddet'],
          satirlar: [
            ['Ölçülür', 'Gözlenir'],
            ['Tektir', 'Yere göre değişir'],
            ['Enerji', 'Etki'],
          ],
        },
      ),
    ]),
  ]),
])
