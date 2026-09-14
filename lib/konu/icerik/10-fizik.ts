import { kart, konu, program, sikli, soru, tema } from '../tip'

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
        'İki hareketli',
        'Aynı yönde giden iki araç birbirine hızların farkıyla, zıt yönde gidenler hızların toplamıyla yaklaşır. Karşılaşma süresi = aradaki uzaklık / yaklaşma hızı.',
      ),
      kart(
        'Grafik dönüşümü',
        'Konum-zamanın eğimi hız-zamanı, hız-zamanın altındaki alan konum değişimini verir. İki grafik aynı hareketi anlatır.',
      ),
      kart(
        'Ortalama hız',
        'Toplam yer değiştirmenin toplam zamana bölümü. Anlık hızların ortalaması değildir; ikisi çoğu zaman farklı çıkar.',
      ),
      kart(
        'Birim tuzağı',
        'Hız km/h, zaman dakika verilmişse önce birimleri eşitle: 72 km/h = 20 m/s. Çoğu hata hesapta değil birimde çıkar.',
        undefined,
        { not: 'km/h → m/s için 3,6\'ya böl: 72 km/h = 20 m/s, 90 km/h = 25 m/s. Tersinde 3,6 ile çarp.' },
      ),
    ], [
      soru(
        'Konum-zaman grafiğinin eğimi cismin hızını verir.',
        true,
        'Eğim, yer değiştirmenin zamana oranı; bu da hızın tanımı.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 10],
          xAd: 'zaman (s)',
          yAd: 'konum (m)',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 8],
              ],
              kirik: true,
            },
          ],
        },
      ),
      soru('Sabit hızlı harekette hız-zaman grafiği zaman eksenine paralel bir doğrudur.', true, 'Hız değişmediği için çizgi yatay kalıyor.'),
      soru('Hız-zaman grafiğinde çizginin altında kalan alan ivmeyi verir.', false, 'Alan alınan yolu verir; ivmeyi eğim gösterir.'),
      soru('Ortalama hız, hızların toplamının ikiye bölünmesiyle bulunur.', false, 'Toplam yer değiştirmenin toplam zamana bölümüdür.'),
      sikli('Hız-zaman grafiğinin altındaki alan neyi verir?', ['Alınan yolu', 'İvmeyi'], 0, 'Sabit hızda alan dikdörtgen: v·t.'),
      sikli('Zıt yönde giden iki araç birbirine hangi hızla yaklaşır?', ['Hızların toplamıyla', 'Hızların farkıyla'], 0, 'Aynı yönde fark, zıt yönde toplam.'),
      sikli('72 km/h kaç m/s\'dir?', ['20', '72'], 0, '3,6\'ya böl.'),
      soru('Sabit hızlı harekette ivme sıfırdır.', true, 'Hız büyüklüğü ve yönü değişmiyor.'),
      soru('Konum-zaman grafiğinde yatay doğru sabit hızla giden cismi gösterir.', false, 'Yatay doğru duran cisim; sabit hız eğik doğru.'),
    ], [
      {
        soru: 'Konum-zaman grafiğinde eğim neyi verir?',
        siklar: ['İvmeyi', 'Hızı'],
        dogru: 1,
        aciklama: {
          dogru: 'Konum / zaman = hız. Eğim dikleştikçe hız büyür.',
          yanlis: 'İvme hız-zaman grafiğinin eğimidir. Konum-zamanın eğimi hızı verir; yatay doğru duran cisim demek.',
        },
        kart: 2,
      },
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
        'Ortalama hız kısayolu',
        'Sabit ivmede ortalama hız, ilk ve son hızın ortalamasıdır: (v₀ + v) / 2. Yol da bu ortalama ile zamanın çarpımı.',
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
      kart(
        'Düşey atışta simetri',
        'Çıkış süresi iniş süresine, atış hızı da geri düşüş hızına eşittir. Tepeye çıkış süresi v₀ / g\'dir.',
      ),
      kart(
        'Sık yapılan hata',
        'En yüksek noktada hız sıfırdır ama ivme sıfır değildir. İvme sıfır olsaydı cisim orada asılı kalırdı.',
        undefined,
        { not: 'Tepede v = 0 ama a = g = 10 m/s² aşağı. \'İvme sıfırdır\' şıkkı her yıl çıkar, her yıl yanlış.' },
      ),
    ], [
      soru('Yavaşlayan bir cismin ivmesi, hızıyla zıt yöndedir.', true, 'İvme hızla aynı yöndeyse cisim hızlanır.'),
      soru(
        'Grafikteki hareketin ivmesi sabittir.',
        true,
        'Hız-zaman grafiği doğru; eğimi değişmiyor, yani ivme sabit.',
        {
          tur: 'koordinat',
          pencere: [0, 5, 0, 10],
          xAd: 'zaman (s)',
          yAd: 'hız (m/s)',
          egriler: [
            {
              noktalar: [
                [0, 2],
                [4, 10],
              ],
              kirik: true,
            },
          ],
        },
      ),
      soru('Yukarı atılan bir cismin en yüksek noktada ivmesi sıfırdır.', false, 'Hız orada sıfır olur ama ivme hâlâ yer çekimi ivmesi kadardır.'),
      soru('Sabit ivmeli harekette konum-zaman grafiği bir doğrudur.', false, 'Konum-zaman grafiği parabol biçiminde; doğru olan hız-zaman grafiği.'),
      sikli('v = v₀ + a·t denklemi hangi koşulda geçerlidir?', ['Her harekette', 'İvme sabitken'], 1, 'Denklemlerin hepsi sabit ivme varsayar.'),
      sikli('Zaman bilinmezken hız ile yolu bağlayan denklem?', ['x = v₀t + ½at²', 'v² = v₀² + 2ax'], 1, 'Zamansız denklem.'),
      sikli('Yukarı atılan cismin çıkış süresi ile iniş süresi nasıldır?', ['Çıkış daha uzun', 'Eşit'], 1, 'Simetri: geri düşüş hızı da atış hızına eşit.'),
      sikli('Sabit ivmede ortalama hız nasıl bulunur?', ['v₀ · v', '(v₀ + v) / 2'], 1, 'İlk ve son hızın ortalaması; yalnızca sabit ivmede.'),
      sikli('Hız-zaman grafiğinde eksenin altındaki alan neyi anlatır?', ['Ters yönde alınan yolu', 'Negatif ivmeyi'], 0, 'Hız negatif: cisim geri gidiyor.'),
      soru('Serbest düşmede hava direnci ihmal edilirse kütle düşme süresini etkilemez.', true, 'Hepsi 9,8 m/s² ile düşer.'),
      soru('İvmesi negatif olan cisim mutlaka yavaşlıyordur.', false, 'İvme hızla aynı yöndeyse (ikisi de negatif) cisim hızlanır.'),
      soru('Tepe noktasına çıkış süresi v₀ / g\'dir.', true, 'Hız sıfırlanana kadar geçen süre.'),
    ], [
      {
        soru: 'İvme ile hız zıt yöndeyse cisim ne yapar?',
        siklar: ['Hızlanır', 'Yavaşlar'],
        dogru: 1,
        aciklama: {
          dogru: 'İvme hızı kendi yönüne çeker; zıt yöndeyse hızı küçültür.',
          yanlis: 'Hızlanma yalnızca ivme hızla aynı yöndeyken olur. Zıt yönlü ivme freni temsil eder.',
        },
        kart: 2,
      },
      {
        soru: 'Yukarı atılan cisim en yüksek noktadayken ivmesi nedir?',
        siklar: ['Sıfır', 'g, aşağı yönlü'],
        dogru: 1,
        aciklama: {
          dogru: 'Yer çekimi her an aynı; tepe noktasında yalnızca hız sıfırlanır.',
          yanlis: 'Sıfır olan hız, ivme değil. İvme sıfır olsaydı hız değişmez ve cisim tepede asılı kalırdı.',
        },
        kart: 8,
      },
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
        { not: 'Üç sıfır: kuvvet var yol yok (duvarı itmek), yol var kuvvet yok, kuvvet yola dik (çantayla düz yürümek).' },
      ),
      kart(
        'Yatayla açılı kuvvet',
        'Kuvvet yola açılıysa yalnızca yol yönündeki bileşen iş yapar: W = F · cosθ · x. Dik bileşen hiç iş yapmaz.',
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
      kart(
        'Güç ve hız',
        'Sabit hızla giden araçta güç, kuvvet ile hızın çarpımıdır: P = F · v. Yokuşta aynı hızı korumak daha çok güç ister.',
      ),
      kart(
        'Birimler',
        'İş ve enerji joule (J), güç watt (W = J/s). 1 kWh = 3,6 milyon joule; elektrik faturası güç değil enerji sayar.',
      ),
    ], [
      soru('Kuvvet uygulanmasına rağmen cisim yer değiştirmiyorsa yapılan iş sıfırdır.', true, 'Fizikte iş, kuvvet ile yer değiştirmenin çarpımı.'),
      soru('Kuvvet ile yer değiştirme birbirine dikse yapılan iş sıfırdır.', true, 'Kuvvetin hareket doğrultusundaki bileşeni yok.'),
      soru('Güç, yapılan işin büyüklüğüdür.', false, 'Güç işin yapılma hızı: iş bölü zaman.'),
      soru('Verimi %100 olan bir makine yapılabilir.', false, 'Verilen enerjinin bir kısmı sürtünme ve ısı olarak kaybediliyor.'),
      sikli('Kuvvet-yer değiştirme grafiğinin altındaki alan neyi verir?', ['Gücü', 'Yapılan işi'], 1, 'Kuvvet değişkense iş bu alandan bulunur.'),
      sikli('Aynı işi daha kısa sürede yapan makine için ne denir?', ['Daha verimli', 'Daha güçlü'], 1, 'Güç = iş / zaman.'),
      sikli('1 kWh kaç joule\'dür?', ['1000', '3,6 milyon'], 1, '1000 W × 3600 s.'),
      sikli('Sabit hızla giden araçta güç nasıl hesaplanır?', ['P = F / v', 'P = F · v'], 1, 'Güç kuvvet ile hızın çarpımı.'),
      soru('Hiçbir makinenin verimi yüzde yüz değildir.', true, 'Bir kısım enerji ısıya gider.'),
      soru('Kuvvet yola dik olduğunda yapılan iş en büyüktür.', false, 'Dik kuvvet iş yapmaz; en büyük iş kuvvet yol yönündeyken.'),
    ], [
      {
        soru: 'Çantayı sabit hızla yatay yolda taşıyan kişi çantaya iş yapar mı?',
        siklar: ['Hayır, kuvvet yola dik', 'Evet, yol alındı'],
        dogru: 0,
        aciklama: {
          dogru: 'Taşıma kuvveti yukarı, hareket yatay; kuvvet yola dik olduğu için fizikte iş sıfır.',
          yanlis: 'Yol alınması yetmez; kuvvetin yol yönünde bileşeni olmalı. Yukarı tutan kuvvet yatay yolda iş yapmaz.',
        },
        kart: 2,
      },
    ]),
    konu('fzk10-enerji-bicim', 'Enerji Biçimleri', [
      kart(
        'Kinetik enerji',
        'Hareketten gelen enerji. Kütleyle doğru, hızın karesiyle orantılıdır — hız iki katına çıkınca enerji dörde katlanır.',
      ),
      kart(
        'Neden hızın karesi?',
        'Fren mesafesi bunun günlük karşılığıdır: hızı iki katına çıkan araç, durmak için dört katı mesafeye ihtiyaç duyar.',
        undefined,
        { not: 'Hız 2 kat → kinetik enerji 4 kat, fren mesafesi 4 kat. 50 km/h\'de 10 m duran araç 100 km/h\'de 40 m.' },
      ),
      kart(
        'Potansiyel enerji',
        'Konumdan ya da şekilden gelen depolanmış enerji: yerden yükseklik veya sıkışmış bir yay.',
      ),
      kart(
        'Yer çekimi potansiyel enerjisi',
        'E = m · g · h. Kütle, yer çekimi ivmesi ve yükseklik; yükseklik iki katına çıkınca enerji de iki katına çıkar.',
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
      kart(
        'Esneklik potansiyel enerjisi',
        'Sıkışan ya da uzayan yayda depolanan enerji, uzama miktarının karesiyle orantılıdır: E = ½ · k · x².',
      ),
    ], [
      soru('Kinetik enerji hızın karesiyle orantılıdır.', true, 'Bu yüzden hız iki katına çıkınca enerji dört katına çıkıyor.'),
      soru('Hızı iki katına çıkan bir cismin kinetik enerjisi de iki katına çıkar.', false, 'Dört katına çıkar; enerji hızın karesine bağlı.'),
      soru('Potansiyel enerji cismin konumundan kaynaklanır.', true, 'Yerden yüksekliği ya da yayın sıkışma miktarı belirliyor.'),
      soru('Enerji dönüşümlerinde toplam enerji azalır.', false, 'Toplam enerji korunur; yalnızca biçim değiştirir.'),
      sikli('Hızı iki katına çıkan aracın fren mesafesi kaç katına çıkar?', ['2', '4'], 1, 'Kinetik enerji hızın karesiyle orantılı.'),
      sikli('Yerden yükseklik hangi enerjiyi belirler?', ['Kinetik enerji', 'Yer çekimi potansiyel enerjisi'], 1, 'E = m·g·h.'),
      sikli('Yayın uzama miktarı iki katına çıkarsa depoladığı enerji?', ['2 katına çıkar', '4 katına çıkar'], 1, 'E = ½·k·x².'),
      soru('Enerji yoktan var olmaz, yok olmaz; biçim değiştirir.', true, 'Enerjinin korunumu.'),
      soru('Dönüşüm zincirinin her adımında bir miktar enerji ısıya gider.', true, 'Bu yüzden verim yüzde yüz olmaz.'),
    ], [
      {
        soru: 'Hızı üç katına çıkan cismin kinetik enerjisi kaç katına çıkar?',
        siklar: ['9', '3'],
        dogru: 0,
        aciklama: {
          dogru: 'Kinetik enerji hızın karesiyle orantılı: 3² = 9.',
          yanlis: 'Kinetik enerji hızla değil hızın karesiyle orantılıdır; 3 kat hız 9 kat enerji demek.',
        },
        kart: 1,
      },
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
        'Hesap kalıbı',
        'Sürtünmesiz düşüşte m·g·h = ½·m·v²; kütle sadeleşir ve son hız v = √(2gh) çıkar. Kütle büyük ya da küçük, hız aynı.',
      ),
      kart(
        'Yükseklik nereden ölçülür?',
        'Potansiyel enerji seçilen sıfır düzeyine göredir. Değişimi ise seçimden bağımsızdır; hesaba giren o değişimdir.',
        undefined,
        { not: 'Sıfırı en alçak noktaya koy: potansiyeller pozitif çıkar, işaret hatası azalır.' },
      ),
      kart(
        'Sürtünme varsa',
        'Mekanik enerjinin bir kısmı ısıya dönüşür. Toplam enerji yine korunur ama mekanik enerji azalır.',
      ),
      kart(
        'Yol fark etmez',
        'Sürtünmesiz bir kaydırakta son hız, yolun eğimine değil yalnızca yükseklik farkına bağlıdır.',
      ),
      kart(
        'Isıya giden enerji',
        'Sürtünmeli yolda kaybolan mekanik enerji sürtünme kuvveti ile yolun çarpımı kadardır: bu enerji yok olmaz, ısı olur.',
      ),
    ], [
      soru('Mekanik enerji, kinetik ve potansiyel enerjilerin toplamıdır.', true, 'Sürtünmesiz ortamda bu toplam sabit kalıyor.'),
      soru('Sürtünmesiz bir ortamda mekanik enerji korunur.', true, 'Biri azalırken öteki aynı oranda artıyor.'),
      soru('Sürtünmeli ortamda mekanik enerji yok olur.', false, 'Isıya dönüşür; enerji yok olmaz, mekanik enerji olmaktan çıkar.'),
      soru('Sürtünmesiz eğik düzlemde cismin yere ulaştığı andaki hızı, izlediği yola bağlıdır.', false, 'Yalnızca düştüğü yükseklik belirler.'),
      sikli('Sürtünmesiz düşüşte son hız neye bağlıdır?', ['Kütleye ve yüksekliğe', 'Yalnızca yüksekliğe'], 1, 'v = √(2gh); kütle sadeleşir.'),
      sikli('Sürtünmeli yolda kaybolan mekanik enerji ne olur?', ['Yok olur', 'Isıya dönüşür'], 1, 'Toplam enerji korunur, mekanik enerji azalır.'),
      sikli('Sarkaç en alçak noktadayken hangi enerji en büyüktür?', ['Potansiyel', 'Kinetik'], 1, 'Tepede potansiyel, altta kinetik.'),
      soru('Potansiyel enerjinin değeri seçilen sıfır düzeyine bağlıdır.', true, 'Değişimi ise seçimden bağımsız.'),
      soru('Sürtünme varken mekanik enerji korunur.', false, 'Bir kısmı ısıya gider; korunan toplam enerjidir.'),
    ], [
      {
        soru: 'Aynı yükseklikteki dik ve yatık sürtünmesiz kaydıraklardan kayanların son hızı?',
        siklar: ['Dikte daha büyük', 'Eşit'],
        dogru: 1,
        aciklama: {
          dogru: 'Son hız yalnızca yükseklik farkına bağlı; yolun eğimi süreyi değiştirir, hızı değil.',
          yanlis: 'Dik kaydırak daha kısa sürede indirir ama son hızı değiştirmez; mekanik enerji korunuyor ve yükseklik aynı.',
        },
        kart: 6,
      },
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
        { not: 'Nükleer: yenilenemez ama sera gazı salmaz. \'Fosil = kirli, yenilenemez = kirli\' genellemesi burada bozulur.' },
      ),
      kart(
        'Hidroelektrik nasıl çalışır?',
        'Baraj suyun potansiyel enerjisini depolar; su düşerken türbini döndürür, türbin jeneratörü. Zincir: potansiyel → kinetik → elektrik.',
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
      kart(
        'Fosil yakıtın bedeli',
        'Yanan kömür ve petrol karbondioksit salar; küresel ısınmanın ana kaynağı bu. Yenilenebilire geçişin asıl gerekçesi tükenme değil salım.',
      ),
    ], [
      soru('Rüzgâr ve güneş yenilenebilir enerji kaynaklarıdır.', true, 'Kullanıldıkça tükenmiyorlar.'),
      soru('Yenilenebilir kaynakların süreklilik sorunu vardır.', true, 'Güneş her zaman parlamıyor, rüzgâr her zaman esmiyor.'),
      soru('Nükleer enerji yenilenebilir bir kaynaktır.', false, 'Yakıtı olan uranyum tükenen bir kaynak.'),
      soru('Enerji tasarrufu bir enerji kaynağı sayılmaz.', false, 'Tasarruf edilen enerji, üretilmesi gerekmeyen enerjidir.'),
      sikli('Hidroelektrikte enerji dönüşüm zinciri nedir?', ['Kimyasal → ısı → elektrik', 'Potansiyel → kinetik → elektrik'], 1, 'Düşen su türbini döndürür.'),
      sikli('Nükleer enerjinin başlıca sorunu?', ['Yüksek karbon salımı', 'Uzun süre saklanması gereken atık'], 1, 'Salım açısından temiz ama atık sorunu var.'),
      sikli('Güneş ve rüzgârın ortak zayıflığı?', ['Yüksek salım', 'Süreklilik (gece, durgun hava)'], 1, 'Depolama bu yüzden kritik.'),
      sikli('Yenilenebilire geçişin asıl gerekçesi?', ['Kaynakların hemen tükenmesi', 'Karbon salımı'], 1, 'Fosil yakıt CO₂ salar; küresel ısınmanın ana kaynağı.'),
      soru('Harcanmayan enerji üretilmesi gerekmeyen enerjidir.', true, 'Tasarruf en ucuz kaynak.'),
      soru('Doğal gaz yenilenebilir bir kaynaktır.', false, 'Fosil yakıt; milyonlarca yılda oluşur.'),
    ], [
      {
        soru: 'Aşağıdakilerden hangisi yenilenebilir enerji kaynağıdır?',
        siklar: ['Jeotermal', 'Doğal gaz'],
        dogru: 0,
        aciklama: {
          dogru: 'Yerin ısısı kendini yeniler; doğal gaz ise milyonlarca yılda oluşur ve tükenir.',
          yanlis: 'Doğal gaz fosil yakıttır ve tükenir. Jeotermal, güneş, rüzgâr, hidroelektrik ve biyokütle yenilenebilir gruptadır.',
        },
        kart: 1,
      },
    ]),
  ]),
  tema('fzk10-t3', 'Elektrik', [
    konu('fzk10-devre', 'Basit Elektrik Devreleri', [
      kart(
        'Devre elemanları',
        'Üreteç enerji verir, iletken taşır, direnç harcar, anahtar yolu açıp kapatır.',
      ),
      kart(
        'Akım, gerilim, direnç',
        'Üç temel büyüklük: akım (A) geçen yük, gerilim (V) iten fark, direnç (Ω) karşı koyma. Devre soruları bu üçünün ilişkisidir.',
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
        { not: 'Gerilim = pompa, akım = su miktarı, direnç = borunun darlığı. Kalın boru = düşük direnç = büyük akım.' },
      ),
      kart(
        'Şema çizimi',
        'Elemanlar standart sembollerle gösterilir. Şema, devrenin fiziksel görüntüsünü değil bağlantısını anlatır.',
      ),
      kart(
        'Elektriksel enerji',
        'Devrede harcanan enerji, gerilim ile akımın ve sürenin çarpımıdır. Elektrik faturası bu enerjiyi ölçer.',
      ),
      kart(
        'Lamba parlaklığı neye bağlı?',
        'Lambanın parlaklığını üstünden geçen akım ve harcadığı güç belirler; devrede aynı lambadan geçen akım büyükse daha parlak yanar.',
      ),
    ], [
      soru('Elektrik akımının geçebilmesi için devrenin kapalı olması gerekir.', true, 'Açık devrede yükler tam bir tur atamaz.'),
      soru('Potansiyel fark, devrede akımı sürükleyen sebeptir.', true, 'Su borusundaki basınç farkına benziyor.'),
      soru('Devre şemasında pilin uzun çizgisi negatif kutbu gösterir.', false, 'Uzun çizgi pozitif kutup, kısa ve kalın olan negatif kutup.'),
      soru('Ampul, devrede elektriksel enerjiyi üreten elemandır.', false, 'Enerjiyi üreteç sağlar; ampul onu ışığa ve ısıya çevirir.'),
      sikli('Devrede enerji harcayan eleman hangisidir?', ['Direnç', 'Üreteç'], 0, 'Üreteç verir, direnç harcar.'),
      sikli('Elektrik faturası neyi ölçer?', ['Harcanan enerjiyi', 'Gücü'], 0, 'Enerji = gerilim × akım × süre; kWh.'),
      sikli('Lambanın parlaklığını ne belirler?', ['Üstünden geçen akım ve güç', 'Kablonun uzunluğu'], 0, 'Aynı lambada büyük akım daha parlak.'),
      soru('Devre şeması devrenin fiziksel görüntüsünü gösterir.', false, 'Bağlantıyı gösterir, görüntüyü değil.'),
      soru('Potansiyel farkın birimi volttur.', true, 'Akımı iten enerji farkı.'),
    ], [
      {
        soru: 'Anahtar açıkken devrede ne olur?',
        siklar: ['Akım geçmez', 'Akım azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Açık anahtar yolu keser; kapalı devre yoksa akım hiç akmaz.',
          yanlis: 'Azalmaz, tümüyle durur. Akım için kesintisiz kapalı bir yol şart; açık anahtar o yolu koparır.',
        },
        kart: 3,
      },
    ]),
    konu('fzk10-akim', 'Elektrik Akımı', [
      kart(
        'Tanımı',
        'Birim zamanda bir kesitten geçen yük miktarı. Birimi amper.',
      ),
      kart(
        'Yük ve akım hesabı',
        'I = q / t. 1 amper, kesitten saniyede 1 coulomb yük geçmesi demek. 2 A akım 10 saniyede 20 C taşır.',
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
      kart(
        'Ölçü aletleri özeti',
        'Ampermetre seri ve direnci sıfıra yakın; voltmetre paralel ve direnci sonsuza yakın. Yerleri değişirse ölçüm değil kısa devre ya da açık devre olur.',
        undefined,
        { not: 'Ampermetre direnci ~0: paralel bağlarsan kısa devre. Voltmetre ~∞: seri bağlarsan akım geçmez, sıfır okur.' },
      ),
    ], [
      soru('Akımın geleneksel yönü, elektronların hareket yönünün tersidir.', true, 'Yön elektron bilinmeden tanımlandığı için böyle kaldı.'),
      soru('Ampermetre devreye seri, voltmetre paralel bağlanır.', true, 'Ampermetre akımı, voltmetre iki nokta arasındaki farkı ölçüyor.'),
      soru('Devredeki elektronlar ışık hızıyla hareket eder.', false, 'Elektronlar çok yavaş ilerler; hızla yayılan şey elektriksel etkinin kendisi.'),
      soru('Voltmetrenin iç direncinin çok küçük olması gerekir.', false, 'Voltmetrenin iç direnci çok büyük olmalı; küçük olması gereken ampermetrenin.'),
      sikli('2 A akım 10 saniyede kaç coulomb yük taşır?', ['5', '20'], 1, 'q = I · t.'),
      sikli('Ampermetre devreye nasıl bağlanır?', ['Paralel', 'Seri'], 1, 'Paralel bağlanırsa kısa devre olur.'),
      sikli('Elektronlar gerçekte hangi yönde hareket eder?', ['Artıdan eksiye', 'Eksiden artıya'], 1, 'Geleneksel akım yönü ters kabul edilir.'),
      sikli('Voltmetrenin direnci nasıldır?', ['Sıfıra yakın', 'Çok büyük'], 1, 'Paralel bağlandığı elemandan akım çalmasın diye.'),
      soru('Lamba anında yanar çünkü elektronlar telde ışık hızıyla ilerler.', false, 'Elektronlar yavaş; hızlı yayılan elektriksel etki.'),
      soru('Potansiyel farkı ortadan kalkarsa akım durur.', true, 'Elektronları iten şey fark.'),
    ], [
      {
        soru: 'Voltmetre devreye nasıl bağlanır?',
        siklar: ['Paralel', 'Seri'],
        dogru: 0,
        aciklama: {
          dogru: 'Gerilim iki nokta arasındaki farktır; voltmetre o iki noktaya paralel takılır.',
          yanlis: 'Seri bağlanan voltmetre direnci çok büyük olduğu için devreyi keser. Gerilim ölçümü paralel, akım ölçümü seri.',
        },
        kart: 7,
      },
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
        'Öz direnç',
        'Aynı boy ve kesitteki bakır ile demir teli ayıran şey öz dirençtir; maddeye özgüdür. R = ρ · L / A.',
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
        { not: 'V-I grafiğinde eğim = R. I-V grafiğinde (eksenler ters) eğim = 1/R; eksen adlarını okumadan eğim alma.' },
      ),
      kart(
        'Sıcaklık etkisi',
        'Metallerde sıcaklık arttıkça direnç artar. Lamba teli soğukken daha az, yanarken daha çok direnç gösterir.',
      ),
      kart(
        'Ohmik olmayan elemanlar',
        'Diyot ve lamba gibi bazı elemanlarda grafik doğru çıkmaz; Ohm yasası her elemanda geçerli değildir.',
      ),
      kart(
        'Hesap örneği',
        '12 V\'luk üretece 4 Ω direnç bağlanırsa akım 3 A olur. Gerilim iki katına çıkarsa aynı dirençte akım da iki katına çıkar.',
      ),
    ], [
      soru('Ohm yasasına göre gerilim, akım ile direncin çarpımına eşittir.', true, 'V = I · R.'),
      soru('Bir iletkenin direnci uzunluğuyla doğru, kesit alanıyla ters orantılıdır.', true, 'İnce ve uzun tel daha çok direnç gösteriyor.'),
      soru('Metallerde sıcaklık arttıkça direnç azalır.', false, 'Metallerde direnç artar; azalan yarı iletkenlerde görülür.'),
      soru('Bütün devre elemanları Ohm yasasına uyar.', false, 'Diyot ve lamba gibi ohmik olmayan elemanlar var.'),
      sikli('12 V üretece 4 Ω direnç bağlanırsa akım kaç amperdir?', ['3', '48'], 0, 'I = V / R.'),
      sikli('Kesit alanı büyüyen telin direnci?', ['Azalır', 'Artar'], 0, 'Kesitle ters orantılı; kalın kablo az direnç.'),
      sikli('Gerilim-akım grafiğinin eğimi neyi verir?', ['Direnci', 'Gücü'], 0, 'V = I·R; eğim R.'),
      sikli('Aynı boy ve kesitteki bakır ile demir teli ayıran nedir?', ['Öz direnç', 'Sıcaklık'], 0, 'Maddeye özgü.'),
      soru('Diyot ve lamba için Ohm yasası her zaman geçerlidir.', false, 'Ohmik olmayan elemanlarda grafik doğru çıkmaz.'),
      soru('Metallerde sıcaklık arttıkça direnç artar.', true, 'Yanan lamba teli soğukkinden çok direnç gösterir.'),
    ], [
      {
        soru: 'Telin uzunluğu iki katına çıkarsa direnci ne olur?',
        siklar: ['İki katına çıkar', 'Yarıya iner'],
        dogru: 0,
        aciklama: {
          dogru: 'Direnç uzunlukla doğru orantılı; uzun tel elektronlara daha uzun yol demek.',
          yanlis: 'Yarıya inen, kesit alanı iki katına çıktığında olur. Uzunluk artınca direnç de artar.',
        },
        kart: 3,
      },
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
        'Paralel eşdeğer hesabı',
        '1/R = 1/R₁ + 1/R₂. İki direnç için kısa yol: çarpım bölü toplam. 6 Ω ile 3 Ω paralel → 18/9 = 2 Ω.',
      ),
      kart(
        'Özdeş dirençler',
        'n tane özdeş R direnci seri bağlanırsa n·R, paralel bağlanırsa R/n olur. 4 tane 8 Ω paralelde 2 Ω eder.',
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
        { not: 'Seri: R toplanır, akım ortak. Paralel: gerilim ortak, R küçülür. 6 Ω ve 3 Ω paralel = 18/9 = 2 Ω.' },
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
      kart(
        'Akım hangi koldan çok geçer?',
        'Paralel kollarda gerilim eşit, akım dirençle ters orantılı paylaşılır: küçük dirençli koldan büyük akım geçer.',
      ),
    ], [
      soru(
        'Dirençler paralel bağlandığında eş değer direnç, en büyük dirençten büyük olur.',
        false,
        'Paralel bağlamada eş değer direnç, en küçük dirençten bile küçük çıkar.',
        {
          tur: 'tablo',
          basliklar: ['Bağlama', 'Eş değer direnç'],
          satirlar: [
            ['Seri', 'Toplanır, artar'],
            ['Paralel', 'Azalır'],
          ],
        },
      ),
      soru('Ev tesisatında lambalar paralel bağlanır.', true, 'Biri sönünce ötekiler yanmaya devam etsin diye.'),
      soru('Seri bağlı bir devrede elemanların üzerinden geçen akım aynıdır.', true, 'Tek bir yol olduğu için akım bölünmüyor.'),
      soru('Kısa devre, akımın direnç üzerinden geçmesi demektir.', false, 'Akımın dirençsiz bir yoldan geçmesi; akım tehlikeli biçimde büyür.'),
      sikli('6 Ω ile 3 Ω paralel bağlanırsa eşdeğer direnç?', ['9 Ω', '2 Ω'], 1, 'Çarpım bölü toplam: 18/9.'),
      sikli('4 tane 8 Ω direnç paralel bağlanırsa eşdeğer?', ['32 Ω', '2 Ω'], 1, 'R/n.'),
      sikli('Paralel kollarda akım nasıl paylaşılır?', ['Bütün kollarda eşit', 'Küçük dirençli koldan büyük akım'], 1, 'Gerilim ortak, akım dirençle ters orantılı.'),
      sikli('Ev tesisatı neden paralel bağlıdır?', ['Daha az kablo gerekir', 'Biri bozulunca ötekiler çalışsın'], 1, 'Her cihaz aynı gerilimi de görür.'),
      soru('Paralel bağlamada eşdeğer direnç en küçük dirençten de küçüktür.', true, 'Yollar çoğaldıkça toplam direnç düşer.'),
      soru('Seri bağlı dirençlerde gerilim bütün elemanlarda aynıdır.', false, 'Seride akım aynı, gerilim bölünür.'),
    ], [
      {
        soru: 'Seri bağlı dirençlerde hangisi bütün elemanlarda aynıdır?',
        siklar: ['Gerilim', 'Akım'],
        dogru: 1,
        aciklama: {
          dogru: 'Tek yol var, geçen yük her elemandan aynı sırayla geçer; gerilim dirençlere bölünür.',
          yanlis: 'Gerilimin ortak olduğu bağlama paraleldir. Seride tek yol olduğundan akım aynı, gerilim paylaşılır.',
        },
        kart: 1,
      },
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
      kart(
        'Neden paralel bağlanır?',
        'Gerilim artmaz ama toplam kapasite artar: iki özdeş pil paralelde devreyi iki kat uzun süre besler ve her pilden yarım akım çeker.',
        undefined,
        { not: 'İki 1,5 V pil seri = 3 V; paralel = yine 1,5 V ama iki kat süre. Uzun ömür isteyen cihaz paralel bağlar.' },
      ),
    ], [
      soru('Özdeş üreteçler seri bağlandığında toplam elektromotor kuvvet artar.', true, 'Gerilimler toplanıyor.'),
      soru('Özdeş üreteçler paralel bağlandığında gerilim değişmez ama piller daha uzun dayanır.', true, 'Akım kaynaklar arasında paylaşılıyor.'),
      soru('Üreteçlerin iç direnci yoktur.', false, 'Her üretecin bir iç direnci var; verdiği gerilimin bir kısmını kendi üzerinde harcıyor.'),
      soru('Farklı marka ve şarj düzeyindeki piller bir arada kullanılabilir.', false, 'Dolu pil boş pili zorlar; ısınma ve akma riski doğar.'),
      sikli('İki özdeş pil paralel bağlanınca ne kazanılır?', ['Daha uzun süre besleme', 'Daha yüksek gerilim'], 0, 'Gerilim aynı kalır, kapasite artar.'),
      sikli('Pil biterken uçlarındaki gerilimin düşmesinin sebebi?', ['İç direncin büyümesi', 'Elektronların tükenmesi'], 0, 'Kimyasal madde tükenirken iç direnç artar.'),
      soru('Ters bağlanan iki üretecin gerilimleri toplanır.', false, 'Birbirini götürür.'),
      soru('Farklı kapasitedeki piller seri bağlanmamalıdır.', true, 'Biten pil ötekiler tarafından ters yönde sürülebilir.'),
    ], [
      {
        soru: '1,5 V\'luk iki pil seri bağlanırsa toplam gerilim?',
        siklar: ['3 V', '1,5 V'],
        dogru: 0,
        aciklama: {
          dogru: 'Seri bağlamada gerilimler toplanır; kumandadaki iki pil bu yüzden uç uca.',
          yanlis: '1,5 V paralel bağlamanın sonucu olurdu. Seride uç uca eklenen gerilimler toplanır: 3 V.',
        },
        kart: 1,
      },
    ]),
    konu('fzk10-tehlike', 'Elektrik Akımının Tehlikelerine Karşı Önlemler', [
      kart(
        'Tehlikeli olan akımdır',
        'İnsan için asıl tehlike gerilim değil, vücuttan geçen akımın şiddeti ve süresidir.',
      ),
      kart(
        'Kaç miliamper tehlikeli?',
        'Birkaç mA hissedilir, yaklaşık 10 mA\'de kas kasılır ve el bırakamaz, 50 mA üstü kalbi durdurabilir. Priz gerilimi ıslak vücutta bu sınırı kolay aşar.',
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
        undefined,
        { not: 'Sigorta 16 A\'de atar; insan 50 mA\'de ölebilir. İnsanı koruyan kaçak akım rölesi (30 mA).' },
      ),
      kart(
        'Islak elle dokunma',
        'Su vücut direncini düşürür ve aynı gerilimde çok daha büyük akım geçer. Banyoda priz kuralları bundandır.',
      ),
      kart(
        'Çoklu priz yükü',
        'Aynı prizden çok sayıda yüksek güçlü cihaz beslemek kabloyu ısıtır; ısınan kablo yangının en sık sebebidir.',
      ),
    ], [
      soru('İnsan için tehlikeli olan, vücuttan geçen akımın büyüklüğüdür.', true, 'Gerilim tek başına değil, geçen akım zarar veriyor.'),
      soru('Sigorta, insanı elektrik çarpmasına karşı korur.', false, 'Sigorta tesisatı ve cihazları korur; insanı koruyan kaçak akım rölesi.'),
      soru('Islak el, vücut direncini düşürdüğü için tehlikeyi artırır.', true, 'Direnç düşünce geçen akım büyüyor.'),
      soru('Çoklu prize istenildiği kadar cihaz takılabilir.', false, 'Çekilen toplam akım artınca kablo ısınır ve yangın riski doğar.'),
      sikli('İnsan için asıl tehlikeli olan nedir?', ['Gerilimin büyüklüğü', 'Vücuttan geçen akımın şiddeti ve süresi'], 1, 'Aynı gerilim ıslak vücutta çok daha büyük akım geçirir.'),
      sikli('Islak elle prize dokunmak neden daha tehlikelidir?', ['Gerilim artar', 'Vücut direnci düşer'], 1, 'Düşük dirençte aynı gerilim daha büyük akım.'),
      sikli('Kaç miliamperde kas kasılıp el bırakamaz?', ['Yaklaşık 1 A', 'Yaklaşık 10 mA'], 1, '50 mA üstü kalbi durdurabilir.'),
      soru('Sigorta insanı elektrik çarpmasından korur.', false, 'Sigorta kabloyu korur; insanı kaçak akım rölesi.'),
      soru('Çoklu prize çok cihaz takmak kablo yangınına yol açabilir.', true, 'Isınan kablo en sık yangın sebebi.'),
    ], [
      {
        soru: 'İnsanı elektrik çarpmasına karşı koruyan hangisidir?',
        siklar: ['Sigorta', 'Kaçak akım rölesi'],
        dogru: 1,
        aciklama: {
          dogru: 'Röle giren ve çıkan akımı karşılaştırır; fark varsa akım insandan kaçıyor demek ve anında keser.',
          yanlis: 'Sigorta kabloyu aşırı akımdan korur; insandan geçen birkaç miliamper onu hiç açtırmaz. İnsanı koruyan kaçak akım rölesi.',
        },
        kart: 4,
      },
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
        undefined,
        { not: 'Toprak hattı birkaç ohm, insan vücudu binlerce ohm: kaçak akım toprağa gider, sana değil.' },
      ),
      kart(
        'Paratoner',
        'Yıldırımı binanın üstünden alıp toprağa iletir. Aynı ilkenin bina ölçeğindeki uygulamasıdır.',
      ),
      kart(
        'Nerede şart?',
        'Metal gövdeli cihazlar: buzdolabı, çamaşır makinesi, fırın, su ısıtıcı. Plastik gövdeli cihazlar çift yalıtımlıdır ve topraklama ucu taşımaz.',
      ),
    ], [
      soru('Topraklama, cihazda oluşan kaçak akımı toprağa güvenle iletir.', true, 'Akım insan yerine bu yoldan geçiyor.'),
      soru('Akım, kendisine sunulan en az dirençli yolu izler.', true, 'Topraklama hattı bu yüzden düşük dirençli yapılıyor.'),
      soru('Topraklaması olmayan bir cihazın gövdesinde kaçak olsa da tehlike oluşmaz.', false, 'Gövdeye dokunan kişi akımın geçtiği yol hâline gelir.'),
      soru('Paratoner yıldırım düşmesini engeller.', false, 'Yıldırımı engellemez; ona güvenli bir yol sunup toprağa iletir.'),
      sikli('Prizdeki üçüncü uç nedir?', ['Topraklama hattı', 'Yedek faz'], 0, 'Topraksız uzatma kablosu korumayı kaldırır.'),
      sikli('Paratoner ne yapar?', ['Yıldırımı toprağa iletir', 'Yıldırımı engeller'], 0, 'Aynı ilkenin bina ölçeği.'),
      soru('Plastik gövdeli çift yalıtımlı cihazlarda topraklama ucu yoktur.', true, 'Metal gövdeli cihazlarda şart.'),
    ], [
      {
        soru: 'Topraklama kaçak akımı nereye yönlendirir?',
        siklar: ['Sigortaya', 'Toprağa, düşük dirençli yoldan'],
        dogru: 1,
        aciklama: {
          dogru: 'Akım dirençleri ters orantılı paylaşır; topraklama insandan çok daha kolay bir yol açar.',
          yanlis: 'Sigorta bir yol değil, bir kesici. Topraklama gövdeden toprağa düşük dirençli bir yol açar; akım insanı bırakıp oradan gider.',
        },
        kart: 1,
      },
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
        'Hesap',
        'T = 1 / f. Saniyede 5 kez salınan cismin periyodu 0,2 s. Frekansın birimi hertz (Hz), periyodunki saniye.',
      ),
      kart(
        'Basit sarkaç',
        'Periyodu ipin uzunluğuna ve yer çekimine bağlıdır; asılan kütleye bağlı değildir.',
        undefined,
        { not: 'T = 2π√(L/g): kütle yok. Ağır sarkaç aynı hızda salınır; ip 4 kat uzarsa periyot 2 kat.' },
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
      kart(
        'Sarkaç periyodunu neler değiştirir?',
        'İp uzarsa periyot büyür, yer çekimi artarsa küçülür. Ay\'da aynı sarkaç daha yavaş salınır; kütle ve küçük genlik etkisiz.',
      ),
    ], [
      soru('Periyot ile frekans birbirinin tersidir.', true, 'Biri bir salınımın süresi, öteki saniyedeki salınım sayısı.'),
      soru('Basit sarkacın periyodu genliğe bağlı değildir.', true, 'Küçük açılarda salınım süresi genlikten etkilenmiyor.'),
      soru('Basit sarkacın periyodu asılı kütleye bağlıdır.', false, 'İp uzunluğuna ve yer çekimi ivmesine bağlı; kütle etkilemiyor.'),
      soru('Frekansın birimi saniyedir.', false, 'Frekansın birimi hertz; saniye periyodun birimi.'),
      sikli('Saniyede 5 kez salınan cismin periyodu?', ['5 s', '0,2 s'], 1, 'T = 1/f.'),
      sikli('Yay sarkacının periyodu neye bağlıdır?', ['İp uzunluğu', 'Yayın sertliği ve kütle'], 1, 'Basit sarkacın tersine kütle etkili.'),
      sikli('Aynı sarkaç Ay\'da nasıl salınır?', ['Daha hızlı', 'Daha yavaş'], 1, 'Yer çekimi azalınca periyot büyür.'),
      sikli('Frekansın birimi nedir?', ['Saniye', 'Hertz'], 1, 'Periyodun birimi saniye.'),
      soru('Küçük salınımlarda sarkacın periyodu genliğe bağlı değildir.', true, 'Sarkaçlı saatin çalışma sebebi.'),
    ], [
      {
        soru: 'Basit sarkacın periyodu hangisine bağlıdır?',
        siklar: ['İpin uzunluğuna', 'Asılan kütleye'],
        dogru: 0,
        aciklama: {
          dogru: 'Uzun ip yavaş salınır; kütle ne olursa olsun periyot aynı kalır.',
          yanlis: 'Kütle basit sarkacın periyodunu değiştirmez; onu ipin uzunluğu ve yer çekimi belirler. Kütlenin işe girdiği yay sarkacı.',
        },
        kart: 3,
      },
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
        undefined,
        { not: 'Kaynak frekansı 2 kat artırırsa aynı ortamda sürat aynı kalır, dalga boyu yarıya iner.' },
      ),
      kart(
        'Genlik enerjidir',
        'Sesin şiddeti genlikle, tizliği frekansla ilgilidir. İkisi bağımsız değişir; yüksek ses tiz olmak zorunda değildir.',
      ),
      kart(
        'Hesap kalıbı',
        'v = λ · f. Frekansı 50 Hz, dalga boyu 2 m olan dalganın sürati 100 m/s. Periyot verilirse önce frekansa çevir: f = 1/T.',
      ),
    ], [
      soru(
        'Şekilde λ ile gösterilen uzunluk dalganın genliğidir.',
        false,
        'İki tepe arasındaki uzaklık dalga boyu; genlik denge konumundan tepeye olan yükseklik.',
        {
          tur: 'koordinat',
          pencere: [0, 8, -2.5, 2.5],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 1.5],
                [2, 0],
                [3, -1.5],
                [4, 0],
                [5, 1.5],
                [6, 0],
                [7, -1.5],
              ],
            },
          ],
          etiketler: [{ x: 3, y: 2.1, ad: 'λ' }],
          noktalar: [
            { x: 1, y: 1.5, renk: 'ikincil' },
            { x: 5, y: 1.5, renk: 'ikincil' },
          ],
        },
      ),
      soru('Dalga, enerjinin madde taşınmadan aktarılmasıdır.', true, 'Tanecikler yer değiştirmez, yalnızca titreşir.'),
      soru('Bir dalganın taşıdığı enerji genliğine bağlıdır.', true, 'Genlik büyüdükçe taşınan enerji artıyor.'),
      soru('Sabit süratte dalga boyu ile frekans doğru orantılıdır.', false, 'Ters orantılıdır: frekans artarken dalga boyu küçülür.'),
      sikli('Frekansı 50 Hz, dalga boyu 2 m olan dalganın sürati?', ['100 m/s', '25 m/s'], 0, 'v = λ·f.'),
      sikli('Sesin tizliğini ne belirler?', ['Frekans', 'Genlik'], 0, 'Şiddeti genlik, tizliği frekans.'),
      sikli('Dalganın süratini kim belirler?', ['Ortam', 'Kaynak'], 0, 'Kaynak frekansı belirler.'),
      soru('Denizdeki şamandıra dalgayla birlikte kıyıya ilerler.', false, 'Yalnızca inip kalkar; dalga enerjiyi taşır, maddeyi değil.'),
      soru('Ardışık iki tepe arasındaki uzaklık dalga boyudur.', true, 'İki çukur arası da aynı.'),
    ], [
      {
        soru: 'Bir dalganın taşıdığı enerjiyi hangisi belirler?',
        siklar: ['Dalga boyu', 'Genlik'],
        dogru: 1,
        aciklama: {
          dogru: 'Genlik büyüdükçe enerji büyür; yüksek ses büyük genlikli sestir.',
          yanlis: 'Dalga boyu sürat ve frekansla ilgili. Enerjiyi taşıyan büyüklük genlik: ses ne kadar yüksekse genlik o kadar büyük.',
        },
        kart: 3,
      },
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
        { not: 'Ses: mekanik + boyuna. Işık: elektromanyetik + enine. Su dalgası: mekanik + enine. Üç örneği tabloya yaz.' },
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
      kart(
        'Deprem dalgaları',
        'P dalgası boyuna ve hızlıdır, önce gelir; S dalgası enine, yavaş ve daha yıkıcıdır. İkisi arasındaki süre merkez üssüne uzaklığı verir.',
      ),
    ], [
      soru('Ses mekanik bir dalgadır ve boşlukta yayılmaz.', true, 'Yayılmak için maddesel ortama ihtiyaç duyuyor.'),
      soru('Elektromanyetik dalgalar yayılmak için ortama ihtiyaç duymaz.', true, 'Güneş ışığı boşluğu geçerek bize ulaşıyor.'),
      soru('Işık boyuna bir dalgadır.', false, 'Işık enine dalga; boyuna dalgaya örnek ses.'),
      soru('Elektromanyetik tayfta yalnızca görünür ışık bulunur.', false, 'Radyo dalgasından gama ışınına kadar geniş bir aralık var.'),
      sikli('Işık hangi tür dalgadır?', ['Elektromanyetik ve enine', 'Mekanik ve boyuna'], 0, 'Boşlukta yayılır, titreşim yayılmaya dik.'),
      sikli('Depremde önce gelen dalga hangisidir?', ['P dalgası', 'S dalgası'], 0, 'P boyuna ve hızlı; S enine ve yıkıcı.'),
      sikli('Elektromanyetik tayfta frekansı en yüksek olan?', ['Gama ışını', 'Radyo dalgası'], 0, 'Sıra radyo → … → gama.'),
      soru('Uzay boşluğunda ses yayılamaz ama ışık yayılır.', true, 'Ses mekanik, ışık elektromanyetik.'),
      soru('Su dalgaları boyuna dalgadır.', false, 'Enine: titreşim yayılma yönüne dik.'),
    ], [
      {
        soru: 'Ses dalgası hangi türdendir?',
        siklar: ['Mekanik ve boyuna', 'Elektromanyetik ve enine'],
        dogru: 0,
        aciklama: {
          dogru: 'Ses ortam ister (mekanik) ve tanecikleri yayılma yönünde sıkıştırır (boyuna).',
          yanlis: 'Elektromanyetik ve enine olan ışık. Ses ortam ister ve sıkışma-seyrelmeyle ilerler: mekanik, boyuna.',
        },
        kart: 5,
      },
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
        undefined,
        { not: 'Ses katıda en hızlı (demirde ~5000 m/s), ışık boşlukta en hızlı. Aynı soruda ikisi ters çalışır.' },
      ),
      kart(
        'Su dalgalarında derinlik',
        'Derin suda dalga hızlı, sığ suda yavaş ilerler. Kıyıya yaklaşan dalganın yükselmesi bundandır.',
      ),
      kart(
        'Yay dalgasında',
        'Gergin ve hafif yayda dalga daha hızlı yayılır. Gitar telinin sesi gerginlikle tizleşir.',
      ),
    ], [
      soru('Ses katılarda gazlara göre daha hızlı yayılır.', true, 'Tanecikler birbirine yakın olduğu için titreşim çabuk aktarılıyor.'),
      soru('Havanın sıcaklığı arttıkça sesin sürati artar.', true, 'Tanecikler daha hızlı hareket ediyor.'),
      soru('Işık yoğun ortamda daha hızlı yayılır.', false, 'Işık en hızlı boşlukta yayılır; yoğun ortamda yavaşlar.'),
      soru('Su dalgalarının sürati derinlikten etkilenmez.', false, 'Derin ortamda daha hızlı, sığ ortamda daha yavaş yayılır.'),
      sikli('Havada sıcaklık artınca sesin sürati?', ['Azalır', 'Artar'], 1, 'Tanecikler hızlanır.'),
      sikli('Işık hangi ortamda en hızlıdır?', ['Camda', 'Boşlukta'], 1, 'Ses ile ışık bu açıdan ters.'),
      soru('Kıyıya yaklaşan dalga sığ suda yavaşlar.', true, 'Derin suda hızlı, sığda yavaş.'),
    ], [
      {
        soru: 'Ses hangi ortamda en hızlı yayılır?',
        siklar: ['Gazda', 'Katıda'],
        dogru: 1,
        aciklama: {
          dogru: 'Katıda tanecikler birbirine yakın, titreşim komşuya çabuk aktarılır.',
          yanlis: 'Gazda tanecikler seyrek, titreşimin aktarılması yavaş. Sıralama katı > sıvı > gaz.',
        },
        kart: 2,
      },
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
        undefined,
        { not: 'Derinden sığa geçen dalga: f aynı, v düşer, λ kısalır. Değişmeyen tek şey frekans.' },
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
    ], [
      soru('Dalgalar yansırken frekansları değişmez.', true, 'Frekansı kaynak belirliyor.'),
      soru('Su dalgası derin ortamdan sığ ortama geçerken yavaşlar ve dalga boyu küçülür.', true, 'Frekans sabit kaldığı için sürat düşünce dalga boyu da düşüyor.'),
      soru('Kırılma sırasında dalganın frekansı değişir.', false, 'Frekans değişmez; değişen sürat ve dalga boyu.'),
      soru('Bir dalga yüzeye dik geldiğinde kırılarak yön değiştirir.', false, 'Doğrultusu değişmez; yalnızca sürati ve dalga boyu değişir.'),
      sikli('Derinden sığa geçen dalga normale göre nasıl kırılır?', ['Normalden uzaklaşır', 'Normale yaklaşır'], 1, 'Yavaşlayan dalga normale yaklaşır.'),
      sikli('Yansımada gelme açısı ile yansıma açısı?', ['Yansıma daha büyük', 'Eşittir'], 1, 'Dalga boyu ve frekans da değişmez.'),
      soru('Sınıra dik gelen dalganın doğrultusu değişmez.', true, 'Yalnızca sürat ve dalga boyu değişir.'),
    ], [
      {
        soru: 'Kırılmada hangisi değişmez?',
        siklar: ['Dalga boyu', 'Frekans'],
        dogru: 1,
        aciklama: {
          dogru: 'Frekansı kaynak belirler; ortam değişse de kaynak aynı hızda titreşir.',
          yanlis: 'Dalga boyu süratle birlikte değişir. Ortam değişince değişmeyen tek şey kaynağın belirlediği frekans.',
        },
        kart: 3,
      },
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
        { not: 'Kahramanmaraş depremi tek büyüklük (7,7) ama her şehirde başka şiddet. Şiddet Roma rakamıyla (IX) yazılır.' },
      ),
      kart(
        'Rezonanstan korunma',
        'Binanın doğal frekansı sarsıntıdan uzaklaştırılır ya da sönümleyici konur; taban yalıtımı sarsıntıyı binaya geçirmez.',
      ),
    ], [
      soru('Rezonans, bir cismin doğal frekansına eşit frekansta zorlanmasıyla oluşur.', true, 'Genlik hızla büyüyor.'),
      soru('Bir binanın doğal frekansı deprem dalgalarının frekansına yakınsa hasar artar.', true, 'Rezonans, sarsıntının etkisini büyütüyor.'),
      soru('Depremin büyüklüğü ile şiddeti aynı şeydir.', false, 'Büyüklük açığa çıkan enerjiyi, şiddet ise oluşturduğu etkiyi anlatıyor.'),
      soru('Odak (iç merkez), depremin yeryüzündeki noktasıdır.', false, 'Yeryüzündeki nokta merkez üssü; odak yerin içindeki kırılma noktası.'),
      sikli('Yüksek binaların doğal frekansı nasıldır?', ['Yüksek', 'Düşük'], 1, 'Alçak bina yüksek frekans.'),
      sikli('Odağın yeryüzündeki izdüşümüne ne denir?', ['Fay', 'Merkez üssü'], 1, 'Odak yer altındaki kırılma noktası.'),
      sikli('Depremin şiddeti neye göre değişir?', ['Tektir, değişmez', 'Yere göre'], 1, 'Büyüklük tek, şiddet hissedilen etki.'),
      sikli('Salıncakta yanlış anda itmek ne yapar?', ['Salınımı büyütür', 'Salınımı söndürür'], 1, 'Doğru zamanlama rezonans.'),
      soru('Rezonanstan korunmak için binaya sönümleyici konabilir.', true, 'Taban yalıtımı da sarsıntıyı geçirmez.'),
    ], [
      {
        soru: 'Rezonans ne zaman olur?',
        siklar: ['Dış kuvvet çok büyükken', 'Dış frekans doğal frekansa eşitken'],
        dogru: 1,
        aciklama: {
          dogru: 'Küçük ama doğru zamanlı itmeler genliği büyütür; salıncak örneği bu.',
          yanlis: 'Kuvvetin büyüklüğü değil zamanlaması: dış etkinin frekansı doğal frekansa eşitse az kuvvetle büyük salınım olur.',
        },
        kart: 2,
      },
    ]),
  ]),
])
