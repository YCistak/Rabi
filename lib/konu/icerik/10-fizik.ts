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
      ),
      kart(
        'Hız-zaman grafiği',
        'Zaman eksenine paralel bir doğrudur. Grafiğin altında kalan alan alınan yolu verir.',
      ),
      kart(
        'Yol hesabı',
        'x = v · t. Sabit hızda yol, hız ile zamanın çarpımıdır.',
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
      ),
      kart(
        'Denklemler',
        'v = v₀ + a·t ve x = v₀·t + ½·a·t². İkisi de yalnızca ivme sabitken geçerlidir.',
      ),
      kart(
        'Serbest düşme',
        'Hava direnci ihmal edilirse tüm cisimler aynı ivmeyle (yaklaşık 9,8 m/s²) düşer; kütle fark etmez.',
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
        'Yer değiştirme yoksa, kuvvet yer değiştirmeye dikse ya da kuvvet yoksa iş sıfırdır. Duvarı itip yormak iş değildir.',
      ),
      kart(
        'Kuvvet-yer değiştirme grafiği',
        'Grafiğin altında kalan alan yapılan işi verir. Kuvvet değişkense iş bu alandan bulunur.',
      ),
      kart(
        'Güç',
        'Birim zamanda yapılan iş. Birimi watt; aynı işi kısa sürede yapan makine daha güçlüdür.',
      ),
    ]),
    konu('fzk10-enerji-bicim', 'Enerji Biçimleri', [
      kart(
        'Kinetik enerji',
        'Hareketten gelen enerji. Kütleyle doğru, hızın karesiyle orantılıdır — hız iki katına çıkınca enerji dörde katlanır.',
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
      ),
      kart(
        'Sürtünme varsa',
        'Mekanik enerjinin bir kısmı ısıya dönüşür. Toplam enerji yine korunur ama mekanik enerji azalır.',
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
        'Fosil yakıtlar yoğun enerji verir ama sera gazı salar; yenilenebilirler temizdir ama süreklilik ve depolama sorunu vardır.',
      ),
      kart(
        'Türkiye’de durum',
        'Jeotermal ve hidroelektrikte güçlü bir potansiyel var; rüzgâr ve güneş kurulu gücü hızla artıyor.',
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
        'Şema çizimi',
        'Elemanlar standart sembollerle gösterilir. Şema, devrenin fiziksel görüntüsünü değil bağlantısını anlatır.',
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
        'Ampermetre',
        'Akımı ölçer ve devreye seri bağlanır. Paralel bağlanırsa kısa devre olur.',
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
        'Ev tesisatı neden paralel?',
        'Biri bozulunca ötekiler çalışmaya devam etsin ve her cihaz aynı gerilimi görsün diye.',
      ),
      kart(
        'Kısa devre',
        'Akım dirençsiz bir yol bulursa aşırı büyür; kablo ısınır ve yangın çıkabilir. Sigorta bunu keser.',
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
        'Islak elle dokunma',
        'Su vücut direncini düşürür ve aynı gerilimde çok daha büyük akım geçer. Banyoda priz kuralları bundandır.',
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
        'Salınım',
        'Denge konumu çevresindeki gidip gelme. Dalgayı üreten hareket budur.',
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
      ),
      kart(
        'Genlik',
        'Denge konumundan en büyük uzaklık. Dalganın taşıdığı enerjiyi genlik belirler.',
      ),
      kart(
        'Yayılma sürati',
        'Dalga boyu ile frekansın çarpımı. Frekansı kaynak, sürati ortam belirler.',
      ),
    ]),
    konu('fzk10-dalga-sinif', 'Dalgaların Sınıflandırılması', [
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
    ]),
    konu('fzk10-yayilma-surati', 'Dalgaların Yayılma Süratini Etkileyen Etmenler', [
      kart(
        'Ortam belirler',
        'Sürat kaynağın değil ortamın özelliğidir. Kaynağı değiştirmek frekansı değiştirir, sürati değil.',
      ),
      kart(
        'Ses hangi ortamda hızlı?',
        'Katıda en hızlı, gazda en yavaş yayılır; tanecikler birbirine yakın olduğunda titreşim daha çabuk aktarılır.',
      ),
      kart(
        'Sıcaklık etkisi',
        'Havada sıcaklık arttıkça ses sürati artar. Tanecikler daha hızlı hareket eder.',
      ),
      kart(
        'Su dalgalarında derinlik',
        'Derin suda dalga hızlı, sığ suda yavaş ilerler. Kıyıya yaklaşan dalganın yükselmesi bundandır.',
      ),
    ]),
    konu('fzk10-yansima-kirilma', 'Su Dalgalarında Yansıma ve Kırılma', [
      kart(
        'Yansıma',
        'Dalga engele çarpıp geri döner. Gelme açısı yansıma açısına eşittir; dalga boyu ve frekans değişmez.',
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
        'Doğru gelirse',
        'Dalga sınıra dik gelirse doğrultu değişmez, yalnızca sürat ve dalga boyu değişir.',
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
        'Depremde neden önemli?',
        'Yer sarsıntısının frekansı binanın doğal frekansına yakınsa bina daha şiddetli sallanır ve hasar artar.',
      ),
      kart(
        'Odak ve merkez üssü',
        'Odak, kırılmanın yer altındaki noktası; merkez üssü ise odağın yeryüzündeki izdüşümüdür.',
      ),
      kart(
        'Şiddet ve büyüklük',
        'Büyüklük açığa çıkan enerjidir ve tektir; şiddet ise hissedilen etkidir ve yere göre değişir.',
      ),
    ]),
  ]),
])
