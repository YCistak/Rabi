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
        'Cisim eşit zaman aralıklarında eşit yer değiştirir.\nHızın büyüklüğü ve yönü değişmez, ivme sıfırdır.',
      ),
      kart(
        'Konum-zaman grafiği',
        'Grafik doğrusaldır, **eğimi hızı** verir.\n- **Dik doğru:** büyük hız\n- **Yatay doğru:** duran cisim',
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
        'Zaman eksenine paralel bir doğrudur.\nGrafiğin altında kalan **alan**, alınan yolu verir.',
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
        '**x = v · t**\nSabit hızda yol, hız ile zamanın çarpımıdır.',
      ),
      kart(
        'İki hareketli',
        '- **Aynı yönde:** hızların farkıyla yaklaşırlar.\n- **Zıt yönde:** hızların toplamıyla yaklaşırlar.\nKarşılaşma süresi = aradaki uzaklık / yaklaşma hızı',
      ),
      kart(
        'Grafik dönüşümü',
        '- **Konum-zaman eğimi:** hız-zaman grafiğini verir.\n- **Hız-zaman alanı:** konum değişimini verir.\nİki grafik aynı hareketi anlatır.',
      ),
      kart(
        'Ortalama hız',
        'Toplam yer değiştirme, toplam zamana bölünür.\nAnlık hızların ortalaması değildir; ikisi çoğu zaman farklı çıkar.',
      ),
      kart(
        'Birim tuzağı',
        'Hız km/h, zaman dakika verilmişse önce birimleri eşitle.\nÖrnek: 72 km/h = 20 m/s\nHataların çoğu hesapta değil birimde çıkar.',
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
      sikli('10 m/s sabit hızla giden araç 2 dakikada kaç metre yol alır?', ['1200', '20'], 0, 'Önce birim: 2 dk = 120 s. x = v · t = 10 · 120 = 1200 m.'),
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
        'Hızın zamana göre değişimidir.\nSabit ivmede hız, eşit zaman aralıklarında eşit miktarda değişir.',
      ),
      kart(
        'Hızlanma ve yavaşlama',
        '- **İvme hızla aynı yöndeyse:** cisim hızlanır.\n- **İvme hıza zıt yöndeyse:** cisim yavaşlar.\nİvmenin işareti tek başına yetmez.',
      ),
      kart(
        'Hız-zaman grafiği',
        '- **Eğim:** ivme\n- **Alan:** yer değiştirme\nEksenin altındaki alan, ters yöndeki yer değiştirmedir.',
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
        'Sabit ivmede grafik bir **paraboldür**.\nHız arttıkça aynı sürede alınan yol artar, eğri dikleşir.',
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
        'Sabit ivmede ortalama hız, ilk ve son hızın ortalamasıdır:\n**(v₀ + v) / 2**\nYol = ortalama hız × zaman',
      ),
      kart(
        'Denklemler',
        '- **v = v₀ + a · t**\n- **x = v₀ · t + ½ · a · t²**\nİkisi de yalnızca ivme sabitken geçerlidir.',
      ),
      kart(
        'Zamansız denklem',
        '**v² = v₀² + 2 · a · x**\nZaman bilinmiyorken hız ile yolu doğrudan bağlar.',
      ),
      kart(
        'Serbest düşme',
        'Hava direnci yoksa bütün cisimler aynı ivmeyle düşer:\n**g ≈ 9,8 m/s²**\nKütle fark etmez.',
      ),
      kart(
        'Düşey atış',
        'Yukarı atılan cisim en yüksek noktada bir an durur.\nİvmesi o anda da aşağı yönlüdür ve büyüklüğü değişmez.',
      ),
      kart(
        'Düşey atışta simetri',
        '- Çıkış süresi = iniş süresi\n- Atış hızı = geri düşüş hızı\n- Tepeye çıkış süresi = v₀ / g',
      ),
      kart(
        'Sık yapılan hata',
        'En yüksek noktada **hız sıfırdır, ivme sıfır değildir**.\nİvme sıfır olsaydı cisim orada asılı kalırdı.',
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
        kart: 9,
      },
    ]),
  ]),
  tema('fzk10-t2', 'Enerji', [
    konu('fzk10-is-guc', 'İş, Enerji ve Güç', [
      kart(
        'Fizikte iş',
        'Kuvvetin yer değiştirme yönündeki bileşeni × yer değiştirme\nBirimi joule (J).',
      ),
      kart(
        'Ne zaman iş sıfırdır?',
        'Üç durumda iş yapılmaz.\nÜçü de günlük dildeki "iş" ile çelişir.',
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
        'Yalnızca yol yönündeki bileşen iş yapar:\n**W = F · cos θ · x**\nDik bileşen hiç iş yapmaz.',
      ),
      kart(
        'Kuvvet-yer değiştirme grafiği',
        'Grafiğin altında kalan alan yapılan işi verir.\nKuvvet değişkense iş bu alandan bulunur.',
      ),
      kart(
        'İş enerjiyi değiştirir',
        'Cisme yapılan net iş, kinetik enerjisindeki değişime eşittir.\nİş ile enerji aynı birimi paylaşır.',
      ),
      kart(
        'Güç',
        'Birim zamanda yapılan iştir: **P = W / t**\nBirimi watt (W); aynı işi kısa sürede yapan makine daha güçlüdür.',
      ),
      kart(
        'Verim',
        'Alınan enerjinin ne kadarının işe dönüştüğüdür.\nHiçbir makinede yüzde yüz değildir; kalan kısım ısıya gider.',
      ),
      kart(
        'Güç ve hız',
        'Sabit hızla giden araçta: **P = F · v**\nYokuşta aynı hızı korumak daha çok güç ister.',
      ),
      kart(
        'Birimler',
        '- **İş ve enerji:** joule (J)\n- **Güç:** watt, W = J/s\n- **1 kWh:** 3,6 milyon J\nElektrik faturası gücü değil enerjiyi sayar.',
      ),
    ], [
      soru('Kuvvet uygulanmasına rağmen cisim yer değiştirmiyorsa yapılan iş sıfırdır.', true, 'Fizikte iş, kuvvet ile yer değiştirmenin çarpımı.'),
      soru('Kuvvet ile yer değiştirme birbirine dikse yapılan iş sıfırdır.', true, 'Kuvvetin hareket doğrultusundaki bileşeni yok.'),
      soru('Güç, yapılan işin büyüklüğüdür.', false, 'Güç işin yapılma hızı: iş bölü zaman.'),
      soru('Verimi %100 olan bir makine yapılabilir.', false, 'Verilen enerjinin bir kısmı sürtünme ve ısı olarak kaybediliyor.'),
      sikli('Kuvvet-yer değiştirme grafiğinin altındaki alan neyi verir?', ['Gücü', 'Yapılan işi'], 1, 'Kuvvet değişkense iş bu alandan bulunur.'),
      sikli('400 J işi 8 saniyede yapan makinenin gücü kaç W?', ['3200', '50'], 1, 'P = W / t = 400 / 8 = 50 W.'),
      sikli('1 kWh kaç joule\'dür?', ['1000', '3,6 milyon'], 1, '1000 W × 3600 s.'),
      sikli('Sabit hızla giden araçta güç nasıl hesaplanır?', ['P = F / v', 'P = F · v'], 1, 'Güç kuvvet ile hızın çarpımı.'),
      soru('Yatayla 60° açı yapan 20 N\'luk kuvvet cismi yatayda 3 m çekerse 30 J iş yapar.', true, 'Yalnız yatay bileşen iş yapar: 20 · cos 60° · 3 = 20 · ½ · 3 = 30 J.'),
      soru('10 N\'luk kuvvetle cisim kuvvet yönünde 5 m çekilirse 2 J iş yapılır.', false, 'W = F · x = 10 · 5 = 50 J.'),
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
        'Hareketten gelen enerjidir: **Ek = ½ · m · v²**\nHız iki katına çıkınca enerji dört katına çıkar.',
      ),
      kart(
        'Neden hızın karesi?',
        'Fren mesafesi bunun günlük karşılığıdır.\nHızı iki katına çıkan araç, durmak için dört kat mesafeye ihtiyaç duyar.',
        undefined,
        { not: 'Hız 2 kat → kinetik enerji 4 kat, fren mesafesi 4 kat. 50 km/h\'de 10 m duran araç 100 km/h\'de 40 m.' },
      ),
      kart(
        'Potansiyel enerji',
        'Konumdan ya da şekilden gelen, depolanmış enerjidir.\nÖrnek: yüksekteki cisim, sıkışmış yay',
      ),
      kart(
        'Yer çekimi potansiyel enerjisi',
        '**Ep = m · g · h**\nYükseklik iki katına çıkınca enerji de iki katına çıkar.',
      ),
      kart(
        'Diğer biçimler',
        'Isı, ışık, ses, elektrik, kimyasal ve nükleer enerji.\nHepsi birbirine dönüşebilir.',
      ),
      kart(
        'Dönüşüm zinciri',
        'Enerji bir biçimden ötekine geçer.\nHer adımda bir miktarı ısıya gider.',
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
        'Enerji yoktan var olmaz, yok olmaz; yalnızca biçim değiştirir.\nToplam enerji sabit kalır.',
      ),
      kart(
        'Esneklik potansiyel enerjisi',
        'Sıkışan ya da uzayan yayda depolanır:\n**E = ½ · k · x²**\nUzama iki katına çıkınca enerji dört katına çıkar.',
      ),
    ], [
      soru('Kinetik enerji hızın karesiyle orantılıdır.', true, 'Bu yüzden hız iki katına çıkınca enerji dört katına çıkıyor.'),
      soru('Kütlesi 2 kg, hızı 3 m/s olan cismin kinetik enerjisi 6 J\'dür.', false, 'Ek = ½ · 2 · 3² = 9 J; hızın karesi alınmalı.'),
      soru('Potansiyel enerji cismin konumundan kaynaklanır.', true, 'Yerden yüksekliği ya da yayın sıkışma miktarı belirliyor.'),
      soru('Enerji dönüşümlerinde toplam enerji azalır.', false, 'Toplam enerji korunur; yalnızca biçim değiştirir.'),
      sikli('Güneş panelinde hangi dönüşüm olur?', ['Kimyasal → ısı', 'Işık → elektrik'], 1, 'Panel ışık enerjisini doğrudan elektriğe çevirir.'),
      sikli('1 kg\'lık cisim 5 m yükseklikte kaç J potansiyel enerjiye sahiptir? (g = 10)', ['5 J', '50 J'], 1, 'Ep = m · g · h = 1 · 10 · 5 = 50 J.'),
      sikli('Yayın uzama miktarı iki katına çıkarsa depoladığı enerji?', ['2 katına çıkar', '4 katına çıkar'], 1, 'E = ½·k·x².'),
      soru('Pilde depolanan enerji kimyasal enerjidir.', true, 'Pil kimyasal enerjiyi devrede elektrik enerjisine çevirir.'),
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
        '**Mekanik enerji = kinetik + potansiyel**\nHareketten ve konumdan gelen enerjilerin toplamıdır.',
      ),
      kart(
        'Korunum',
        'Sürtünme ve hava direnci yoksa mekanik enerji sabit kalır.\nBiri azalırken öteki aynı miktarda artar.',
      ),
      kart(
        'Sarkaç',
        '- **En yüksek noktada:** potansiyel en büyük, kinetik sıfır\n- **En alçak noktada:** kinetik en büyük, potansiyel en küçük',
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
        'Sürtünmesiz düşüşte: m · g · h = ½ · m · v²\nKütle sadeleşir: **v = √(2gh)**\nKütle ne olursa olsun son hız aynıdır.',
      ),
      kart(
        'Yükseklik nereden ölçülür?',
        'Potansiyel enerji, seçilen sıfır düzeyine göredir.\nHesaba giren değişim ise bu seçimden bağımsızdır.',
        undefined,
        { not: 'Sıfırı en alçak noktaya koy: potansiyeller pozitif çıkar, işaret hatası azalır.' },
      ),
      kart(
        'Sürtünme varsa',
        'Mekanik enerjinin bir kısmı ısıya dönüşür.\nToplam enerji korunur ama mekanik enerji azalır.',
      ),
      kart(
        'Yol fark etmez',
        'Sürtünmesiz kaydırakta son hız yolun eğimine bağlı değildir.\nYalnızca yükseklik farkına bağlıdır.',
      ),
      kart(
        'Isıya giden enerji',
        'Sürtünmeli yolda kaybolan mekanik enerji:\n**sürtünme kuvveti × yol**\nBu enerji yok olmaz, ısıya dönüşür.',
      ),
    ], [
      soru('Mekanik enerji, kinetik ve potansiyel enerjilerin toplamıdır.', true, 'Sürtünmesiz ortamda bu toplam sabit kalıyor.'),
      soru('Sürtünmesiz bir ortamda mekanik enerji korunur.', true, 'Biri azalırken öteki aynı oranda artıyor.'),
      soru('Sürtünmeli ortamda mekanik enerji yok olur.', false, 'Isıya dönüşür; enerji yok olmaz, mekanik enerji olmaktan çıkar.'),
      soru('Sürtünmesiz eğik düzlemde cismin yere ulaştığı andaki hızı, izlediği yola bağlıdır.', false, 'Yalnızca düştüğü yükseklik belirler.'),
      sikli('Sürtünmesiz düşüşte son hız neye bağlıdır?', ['Kütleye ve yüksekliğe', 'Yalnızca yüksekliğe'], 1, 'v = √(2gh); kütle sadeleşir.'),
      sikli('Sürtünmesiz ortamda 5 m yükseklikten bırakılan cismin yere çarpma hızı? (g = 10)', ['50 m/s', '10 m/s'], 1, 'v = √(2gh) = √100 = 10 m/s.'),
      sikli('Sarkaç en alçak noktadayken hangi enerji en büyüktür?', ['Potansiyel', 'Kinetik'], 1, 'Tepede potansiyel, altta kinetik.'),
      soru('Potansiyel enerjinin değeri seçilen sıfır düzeyine bağlıdır.', true, 'Değişimi ise seçimden bağımsız.'),
      soru('Sürtünmeli yolda ısıya dönüşen enerji, sürtünme kuvveti ile alınan yolun çarpımıdır.', true, 'Sürtünmenin yaptığı iş mekanik enerjiden düşer, ısıya geçer.'),
    ], [
      {
        soru: 'Aynı yükseklikteki dik ve yatık sürtünmesiz kaydıraklardan kayanların son hızı?',
        siklar: ['Dikte daha büyük', 'Eşit'],
        dogru: 1,
        aciklama: {
          dogru: 'Son hız yalnızca yükseklik farkına bağlı; yolun eğimi süreyi değiştirir, hızı değil.',
          yanlis: 'Dik kaydırak daha kısa sürede indirir ama son hızı değiştirmez; mekanik enerji korunuyor ve yükseklik aynı.',
        },
        kart: 4,
      },
    ]),
    konu('fzk10-kaynak', 'Enerji Kaynakları', [
      kart(
        'Yenilenebilir',
        'Kendini yenileyen kaynaklardır:\ngüneş, rüzgâr, hidroelektrik, jeotermal, biyokütle',
      ),
      kart(
        'Yenilenemez',
        'Oluşumları milyonlarca yıl sürer, tükenirler:\nkömür, petrol, doğal gaz, nükleer yakıt',
      ),
      kart(
        'Karşılaştırma',
        'İki grubun üstünlükleri farklı yerlerdedir.\nHiçbiri her ölçüte göre üstün değildir.',
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
        'Baraj suyun potansiyel enerjisini depolar.\nDüşen su türbini, türbin de jeneratörü döndürür.\nZincir: potansiyel → kinetik → elektrik',
      ),
      kart(
        'Süreklilik sorunu',
        'Güneş gece, rüzgâr durgun havada üretmez.\nBu yüzden depolama ve şebeke esnekliği en kritik konudur.',
      ),
      kart(
        'Nükleer enerji',
        '- **Artısı:** sera gazı salmaz, enerji yoğunluğu çok yüksek\n- **Eksisi:** yakıt tükenir, atık uzun süre saklanmalı',
      ),
      kart(
        'Türkiye’de durum',
        '- **Güçlü potansiyel:** jeotermal ve hidroelektrik\n- **Hızla artan:** rüzgâr ve güneş kurulu gücü',
      ),
      kart(
        'Tasarruf da bir kaynaktır',
        'Harcanmayan enerji, üretilmesi gerekmeyen enerjidir.\nYalıtım ve verimli cihaz en ucuz "kaynak"tır.',
      ),
      kart(
        'Fosil yakıtın bedeli',
        'Yanan kömür ve petrol karbondioksit salar; küresel ısınmanın ana kaynağı budur.\nYenilenebilire geçişin asıl gerekçesi tükenme değil salımdır.',
      ),
    ], [
      soru('Rüzgâr ve güneş yenilenebilir enerji kaynaklarıdır.', true, 'Kullanıldıkça tükenmiyorlar.'),
      soru('Yenilenebilir kaynakların süreklilik sorunu vardır.', true, 'Güneş her zaman parlamıyor, rüzgâr her zaman esmiyor.'),
      soru('Nükleer enerji yenilenebilir bir kaynaktır.', false, 'Yakıtı olan uranyum tükenen bir kaynak.'),
      soru('Enerji tasarrufu bir enerji kaynağı sayılmaz.', false, 'Tasarruf edilen enerji, üretilmesi gerekmeyen enerjidir.'),
      sikli('Hidroelektrikte enerji dönüşüm zinciri nedir?', ['Kimyasal → ısı → elektrik', 'Potansiyel → kinetik → elektrik'], 1, 'Düşen su türbini döndürür.'),
      sikli('Nükleer enerjinin başlıca sorunu?', ['Yüksek karbon salımı', 'Uzun süre saklanması gereken atık'], 1, 'Salım açısından temiz ama atık sorunu var.'),
      sikli('Fosil yakıtlar yenilenebilir kaynaklara göre hangi açıdan üstündür?', ['Süreklilik', 'Düşük salım'], 0, 'Kömür santrali gece de gündüz de üretir; ama salımı yüksektir.'),
      sikli('Yenilenebilire geçişin asıl gerekçesi?', ['Kaynakların hemen tükenmesi', 'Karbon salımı'], 1, 'Fosil yakıt CO₂ salar; küresel ısınmanın ana kaynağı.'),
      soru('Biyokütle yenilenebilir bir enerji kaynağıdır.', true, 'Bitki ve hayvan atıkları yeniden üretilebiliyor.'),
      soru('Türkiye jeotermal enerji potansiyeli bakımından güçlü bir ülkedir.', true, 'Ege\'deki fay hatları boyunca sıcak su kaynakları yoğun.'),
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
        '- **Üreteç:** enerji verir.\n- **İletken:** akımı taşır.\n- **Direnç:** enerji harcar.\n- **Anahtar:** yolu açıp kapatır.',
      ),
      kart(
        'Akım, gerilim, direnç',
        '- **Akım (A):** geçen yük\n- **Gerilim (V):** yükleri iten fark\n- **Direnç (Ω):** akıma karşı koyma\nDevre soruları bu üçünün ilişkisidir.',
      ),
      kart(
        'Kapalı devre şart',
        'Akımın akması için yolun kesintisiz olması gerekir.\nAnahtar açıksa devre kopar, akım geçmez.',
      ),
      kart(
        'Potansiyel fark',
        'İki nokta arasındaki enerji farkıdır; akımı iten budur.\nBirimi volt (V).',
      ),
      kart(
        'Su benzetmesi',
        'Devreyi anlamanın en kolay yolu su devresidir.\nBenzetme sınırlıdır ama üç kavramı yerine oturtur.',
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
        'Elemanlar standart sembollerle gösterilir.\nŞema, devrenin görüntüsünü değil bağlantısını anlatır.',
      ),
      kart(
        'Elektriksel enerji',
        'Devrede harcanan enerji: **E = V · I · t**\nElektrik faturası bu enerjiyi ölçer.',
      ),
      kart(
        'Lamba parlaklığı neye bağlı?',
        'Parlaklığı, lambanın harcadığı güç belirler.\nAynı lambadan geçen akım büyükse lamba daha parlak yanar.',
      ),
    ], [
      soru('Elektrik akımının geçebilmesi için devrenin kapalı olması gerekir.', true, 'Açık devrede yükler tam bir tur atamaz.'),
      soru('Potansiyel fark, devrede akımı sürükleyen sebeptir.', true, 'Su borusundaki basınç farkına benziyor.'),
      soru('Devre şemasında pilin uzun çizgisi negatif kutbu gösterir.', false, 'Uzun çizgi pozitif kutup, kısa ve kalın olan negatif kutup.'),
      soru('Ampul, devrede elektriksel enerjiyi üreten elemandır.', false, 'Enerjiyi üreteç sağlar; ampul onu ışığa ve ısıya çevirir.'),
      sikli('Su benzetmesinde elektrik akımı neye karşılık gelir?', ['Debi', 'Basınç farkı'], 0, 'Basınç farkı gerilime, dar boru dirence karşılık gelir.'),
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
        'Birim zamanda bir kesitten geçen yük miktarıdır.\nBirimi amper (A).',
      ),
      kart(
        'Yük ve akım hesabı',
        '**I = q / t**\n1 A: kesitten saniyede 1 C yük geçmesi\nÖrnek: 2 A akım, 10 s’de 20 C taşır.',
      ),
      kart(
        'Yönü',
        '- **Elektronlar:** eksiden artıya gider.\n- **Geleneksel akım:** artıdan eksiye kabul edilir.',
      ),
      kart(
        'Neden hareket eder?',
        'Potansiyel farkı, serbest elektronlara kuvvet uygular.\nFark ortadan kalkarsa akım durur.',
      ),
      kart(
        'Elektron yavaş, sinyal hızlı',
        'Elektronlar telde çok yavaş ilerler.\nElektriksel etki ise neredeyse ışık hızıyla yayılır; lamba anında yanar.',
      ),
      kart(
        'Ampermetre',
        'Akımı ölçer, devreye **seri** bağlanır.\nParalel bağlanırsa kısa devre olur.',
      ),
      kart(
        'Voltmetre',
        'Gerilimi ölçer, ölçülecek elemana **paralel** bağlanır.\nSeri bağlanırsa devreden akım geçmez.',
      ),
      kart(
        'Ölçü aletleri özeti',
        '- **Ampermetre:** seri, direnci sıfıra yakın\n- **Voltmetre:** paralel, direnci sonsuza yakın\nYerleri değişirse kısa devre ya da açık devre olur.',
        undefined,
        { not: 'Ampermetre direnci ~0: paralel bağlarsan kısa devre. Voltmetre ~∞: seri bağlarsan akım geçmez, sıfır okur.' },
      ),
    ], [
      soru('Akımın geleneksel yönü, elektronların hareket yönünün tersidir.', true, 'Yön elektron bilinmeden tanımlandığı için böyle kaldı.'),
      soru('Ampermetre devreye seri, voltmetre paralel bağlanır.', true, 'Ampermetre akımı, voltmetre iki nokta arasındaki farkı ölçüyor.'),
      soru('Devredeki elektronlar ışık hızıyla hareket eder.', false, 'Elektronlar çok yavaş ilerler; hızla yayılan şey elektriksel etkinin kendisi.'),
      soru('Voltmetrenin iç direncinin çok küçük olması gerekir.', false, 'Voltmetrenin iç direnci çok büyük olmalı; küçük olması gereken ampermetrenin.'),
      sikli('2 A akım 10 saniyede kaç coulomb yük taşır?', ['5', '20'], 1, 'q = I · t.'),
      sikli('Ampermetre devreye paralel bağlanırsa ne olur?', ['Kısa devre', 'Akım sıfır okunur'], 0, 'Direnci sıfıra yakın; akım ampermetreden kaçar.'),
      sikli('1 amper ne demektir?', ['Saniyede 1 C yük geçmesi', 'Saniyede 1 elektron geçmesi'], 0, 'I = q / t; 1 A = 1 C/s. Bir elektronun yükü çok küçük.'),
      sikli('Metal iletkende akımı taşıyan parçacıklar hangileridir?', ['Protonlar', 'Serbest elektronlar'], 1, 'Protonlar çekirdekte sabit; hareket eden serbest elektronlar.'),
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
        '**V = I · R**\nPotansiyel fark, akım ile direncin çarpımına eşittir.',
      ),
      kart(
        'Direnç nedir?',
        'Akıma karşı gösterilen zorluktur; birimi ohm (Ω).\nBağlı olduğu şeyler: iletkenin cinsi, uzunluğu, kesiti, sıcaklığı',
      ),
      kart(
        'Öz direnç',
        'Aynı boy ve kesitteki bakır ile demir teli ayıran şeydir; maddeye özgüdür.\n**R = ρ · L / A**',
      ),
      kart(
        'Uzunluk ve kesit',
        '- **Uzunlukla:** doğru orantılı\n- **Kesit alanıyla:** ters orantılı\nKalın kablo daha az direnç gösterir.',
      ),
      kart(
        'Grafiği',
        'Gerilim-akım grafiği doğrusaldır.\nEğimi direnci verir.',
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
        'Metallerde sıcaklık arttıkça direnç artar.\nLamba teli soğukken az, yanarken çok direnç gösterir.',
      ),
      kart(
        'Ohmik olmayan elemanlar',
        'Diyot ve lamba gibi elemanlarda grafik doğru çıkmaz.\nOhm yasası her elemanda geçerli değildir.',
      ),
      kart(
        'Hesap örneği',
        '12 V’luk üretece 4 Ω direnç bağlanırsa: I = 12 / 4 = 3 A\nGerilim iki katına çıkarsa aynı dirençte akım da iki katına çıkar.',
      ),
    ], [
      soru('Ohm yasasına göre gerilim, akım ile direncin çarpımına eşittir.', true, 'V = I · R.'),
      soru('Bir iletkenin direnci uzunluğuyla doğru, kesit alanıyla ters orantılıdır.', true, 'İnce ve uzun tel daha çok direnç gösteriyor.'),
      soru('Metallerde sıcaklık arttıkça direnç azalır.', false, 'Metallerde direnç artar; azalan yarı iletkenlerde görülür.'),
      soru('Bütün devre elemanları Ohm yasasına uyar.', false, 'Diyot ve lamba gibi ohmik olmayan elemanlar var.'),
      sikli('12 V üretece 4 Ω direnç bağlanırsa akım kaç amperdir?', ['3', '48'], 0, 'I = V / R.'),
      sikli('Ohmik bir iletkenin direncini hangisi değiştirmez?', ['Üzerindeki gerilim', 'Kesit alanı'], 0, 'Gerilim artınca akım da aynı oranda artar; oran R sabit kalır.'),
      sikli('Gerilim-akım grafiğinin eğimi neyi verir?', ['Direnci', 'Gücü'], 0, 'V = I·R; eğim R.'),
      sikli('Aynı boy ve kesitteki bakır ile demir teli ayıran nedir?', ['Öz direnç', 'Sıcaklık'], 0, 'Maddeye özgü.'),
      soru('Öz direnç, iletkenin uzunluğuna bağlıdır.', false, 'Öz direnç maddeye özgü; uzunluk direnci değiştirir, öz direnci değil.'),
      soru('Aynı iletkende gerilim iki katına çıkarsa akım da iki katına çıkar.', true, 'R sabitken I = V / R; V ile I doğru orantılı.'),
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
        'Dirençler uç uca eklenir.\n- **Eşdeğer direnç:** dirençlerin toplamı\n- **Akım:** her elemanda aynı',
      ),
      kart(
        'Paralel bağlama',
        'Dirençler aynı iki nokta arasına bağlanır.\n- **Eşdeğer direnç:** en küçük dirençten de küçük\n- **Gerilim:** her kolda aynı',
      ),
      kart(
        'Paralel eşdeğer hesabı',
        '**1/R = 1/R₁ + 1/R₂**\nİki direnç için kısa yol: çarpım / toplam\nÖrnek: 6 Ω ile 3 Ω → 18 / 9 = 2 Ω',
      ),
      kart(
        'Özdeş dirençler',
        'n tane özdeş R direnci:\n- **Seri:** n · R\n- **Paralel:** R / n\nÖrnek: 4 tane 8 Ω paralel → 2 Ω',
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
        '- Biri bozulunca ötekiler çalışmaya devam eder.\n- Her cihaz aynı gerilimi görür.',
      ),
      kart(
        'Kısa devre',
        'Akım dirençsiz bir yol bulursa aşırı büyür.\nKablo ısınır, yangın çıkabilir; sigorta bunu keser.',
      ),
      kart(
        'Karışık bağlama',
        'Devre parça parça sadeleştirilir.\nÖnce en içteki seri ya da paralel gruplar tek dirence indirilir.',
      ),
      kart(
        'Akım hangi koldan çok geçer?',
        'Paralel kollarda gerilim eşittir.\nAkım dirençle ters orantılı paylaşılır: küçük dirençli koldan büyük akım geçer.',
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
      sikli('Sigortanın görevi nedir?', ['Aşırı akımda devreyi kesmek', 'Gerilimi artırmak'], 0, 'Kısa devrede kablo ısınmadan akımı keser.'),
      soru('Seri bağlı 2 Ω, 3 Ω ve 5 Ω dirençlerin eşdeğeri 10 Ω\'dur.', true, 'Seride dirençler toplanır.'),
      soru('Karışık bağlı devre, en içteki seri ve paralel gruplardan başlayarak sadeleştirilir.', true, 'Her grup tek bir dirence indirilir, sonra dışa doğru ilerlenir.'),
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
        'Üreteçlerin gerilimleri **toplanır**.\nUzaktan kumandada iki pilin uç uca konması bu yüzdendir.',
      ),
      kart(
        'Paralel bağlama',
        'Özdeş üreteçlerde gerilim tek üretecinki kadar kalır.\nAma devre daha uzun süre beslenir.',
      ),
      kart(
        'Ters bağlama',
        'Zıt yönde bağlanan üreteçlerin gerilimleri birbirini götürür.\nDevreye net katkı azalır.',
      ),
      kart(
        'İç direnç',
        'Gerçek üreteçlerin kendi direnci vardır.\nBu yüzden uçlarındaki gerilim yük altında bir miktar düşer.',
      ),
      kart(
        'Neden pil biter?',
        'Kimyasal madde tükenirken iç direnç büyür.\nUçlardaki gerilim yük altında hızla düşer, cihaz çalışmaz olur.',
      ),
      kart(
        'Farklı piller karıştırılmaz',
        'Seri bağlı farklı kapasitedeki piller birbirini zorlar.\nBiten pil, ötekiler tarafından ters yönde sürülebilir.',
      ),
      kart(
        'Neden paralel bağlanır?',
        'Gerilim artmaz ama toplam kapasite artar.\nİki özdeş pil paralelde devreyi iki kat uzun süre besler.',
        undefined,
        { not: 'İki 1,5 V pil seri = 3 V; paralel = yine 1,5 V ama iki kat süre. Uzun ömür isteyen cihaz paralel bağlar.' },
      ),
      kart(
        'Elektromotor kuvvet',
        'Üretecin birim yüke verdiği enerjidir; birimi volttur.\nYük bağlı değilken uçlardaki gerilim emk’ya eşittir.',
      ),
    ], [
      soru('Özdeş üreteçler seri bağlandığında toplam elektromotor kuvvet artar.', true, 'Gerilimler toplanıyor.'),
      soru('Özdeş üreteçler paralel bağlandığında gerilim değişmez ama piller daha uzun dayanır.', true, 'Akım kaynaklar arasında paylaşılıyor.'),
      soru('Üreteçlerin iç direnci yoktur.', false, 'Her üretecin bir iç direnci var; verdiği gerilimin bir kısmını kendi üzerinde harcıyor.'),
      soru('Farklı marka ve şarj düzeyindeki piller bir arada kullanılabilir.', false, 'Dolu pil boş pili zorlar; ısınma ve akma riski doğar.'),
      sikli('Ters bağlanan iki özdeş pilin devreye net katkısı?', ['Sıfır', 'İki katı'], 0, 'Gerilimler birbirini götürür.'),
      sikli('Pil biterken uçlarındaki gerilimin düşmesinin sebebi?', ['İç direncin büyümesi', 'Elektronların tükenmesi'], 0, 'Kimyasal madde tükenirken iç direnç artar.'),
      soru('Devreye yük bağlı değilken pilin uçlarındaki gerilim emk\'ya eşittir.', true, 'Akım yokken iç dirençte gerilim düşmez.'),
      soru('Gerçek bir üretecin uçlarındaki gerilim, devreye yük bağlanınca bir miktar düşer.', true, 'Gerilimin bir kısmı iç dirençte harcanır.'),
      sikli('Elektromotor kuvvetin birimi nedir?', ['Amper', 'Volt'], 1, 'Adı "kuvvet" olsa da bir enerji farkıdır; birimi volt.'),
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
        'İnsan için asıl tehlike gerilim değil, vücuttan geçen **akımın şiddeti ve süresidir**.',
      ),
      kart(
        'Kaç miliamper tehlikeli?',
        '- **Birkaç mA:** hissedilir.\n- **~10 mA:** kas kasılır, el bırakamaz.\n- **50 mA üstü:** kalbi durdurabilir.',
      ),
      kart(
        'Sigorta',
        'Akım güvenli sınırı aşınca devreyi kendiliğinden keser.\nKablo yangınlarının önündeki ilk engeldir.',
      ),
      kart(
        'Kaçak akım rölesi',
        'Giren ve çıkan akımı karşılaştırır.\nFark varsa akım insan üzerinden kaçıyor demektir; devre anında kesilir.',
      ),
      kart(
        'Sigorta insanı korumaz',
        '- **Sigorta:** kabloyu korur.\n- **Kaçak akım rölesi:** insanı korur.\nBiri ötekinin yerini tutmaz.',
        undefined,
        { not: 'Sigorta 16 A\'de atar; insan 50 mA\'de ölebilir. İnsanı koruyan kaçak akım rölesi (30 mA).' },
      ),
      kart(
        'Islak elle dokunma',
        'Su vücudun direncini düşürür.\nAynı gerilimde çok daha büyük akım geçer; banyodaki priz kuralları bundandır.',
      ),
      kart(
        'Çoklu priz yükü',
        'Aynı prizden çok sayıda yüksek güçlü cihaz beslemek kabloyu ısıtır.\nIsınan kablo, yangının en sık sebebidir.',
      ),
      kart(
        'Çarpılana yardım',
        '- Önce sigortayı ya da şalteri kapat.\n- Kapatamıyorsan tahta gibi yalıtkan bir cisimle uzaklaştır.\n- Çıplak elle dokunma: akım senden de geçer.',
      ),
    ], [
      soru('İnsan için tehlikeli olan, vücuttan geçen akımın büyüklüğüdür.', true, 'Gerilim tek başına değil, geçen akım zarar veriyor.'),
      soru('Sigorta, insanı elektrik çarpmasına karşı korur.', false, 'Sigorta tesisatı ve cihazları korur; insanı koruyan kaçak akım rölesi.'),
      soru('Islak el, vücut direncini düşürdüğü için tehlikeyi artırır.', true, 'Direnç düşünce geçen akım büyüyor.'),
      soru('Çoklu prize istenildiği kadar cihaz takılabilir.', false, 'Çekilen toplam akım artınca kablo ısınır ve yangın riski doğar.'),
      sikli('Kablo yangınlarının önündeki ilk engel hangisidir?', ['Sigorta', 'Paratoner'], 0, 'Paratoner yıldırımı toprağa iletir; aşırı akımı sigorta keser.'),
      sikli('Vücuttan geçen 50 mA üstü akım ne yapabilir?', ['Kalbi durdurabilir', 'Yalnızca hissedilir'], 0, 'Birkaç mA hissedilir; 50 mA üstü kalp ritmini bozabilir.'),
      sikli('Kaç miliamperde kas kasılıp el bırakamaz?', ['Yaklaşık 1 A', 'Yaklaşık 10 mA'], 1, '50 mA üstü kalbi durdurabilir.'),
      soru('Kaçak akım rölesi yalnızca akım 16 A\'yı aşınca devreyi keser.', false, 'Giren ve çıkan akımın farkına bakar; yaklaşık 30 mA farkta keser.'),
      soru('Elektrik çarpan birine çıplak elle dokunmadan önce akım kesilmelidir.', true, 'Dokunan kişi de akımın yolu olur.'),
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
        'Cihazın gövdesini toprağa bağlar.\nKaçak akım, insan yerine bu düşük dirençli yoldan toprağa gider.',
      ),
      kart(
        'Neden gerekli?',
        'Yalıtımı bozulan cihazın metal gövdesi gerilim altında kalabilir.\nTopraklama yoksa dokunan kişi akımın yolunu tamamlar.',
      ),
      kart(
        'Üçüncü uç',
        'Prizdeki üçüncü uç topraklama hattıdır.\nTopraksız uzatma kablosu bu korumayı ortadan kaldırır.',
      ),
      kart(
        'En az dirençli yol',
        'Akım yollara dirençleriyle ters orantılı paylaşılır.\nTopraklamanın işi, insandan çok daha kolay bir yol açmaktır.',
        undefined,
        { not: 'Toprak hattı birkaç ohm, insan vücudu binlerce ohm: kaçak akım toprağa gider, sana değil.' },
      ),
      kart(
        'Paratoner',
        'Yıldırımı binanın üstünden alıp toprağa iletir.\nAynı ilkenin bina ölçeğindeki uygulamasıdır.',
      ),
      kart(
        'Nerede şart?',
        '- **Metal gövdeli cihazlar:** buzdolabı, çamaşır makinesi, fırın, su ısıtıcı\n- **Plastik gövdeli cihazlar:** çift yalıtımlıdır, topraklama ucu taşımaz',
      ),
    ], [
      soru('Topraklama, cihazda oluşan kaçak akımı toprağa güvenle iletir.', true, 'Akım insan yerine bu yoldan geçiyor.'),
      soru('Akım, kendisine sunulan en az dirençli yolu izler.', true, 'Topraklama hattı bu yüzden düşük dirençli yapılıyor.'),
      soru('Topraklaması olmayan bir cihazın gövdesinde kaçak olsa da tehlike oluşmaz.', false, 'Gövdeye dokunan kişi akımın geçtiği yol hâline gelir.'),
      soru('Paratoner yıldırım düşmesini engeller.', false, 'Yıldırımı engellemez; ona güvenli bir yol sunup toprağa iletir.'),
      sikli('Prizdeki üçüncü uç nedir?', ['Topraklama hattı', 'Yedek faz'], 0, 'Topraksız uzatma kablosu korumayı kaldırır.'),
      sikli('Hangi cihazda topraklama şarttır?', ['Çamaşır makinesi', 'Plastik saç kurutma makinesi'], 0, 'Metal gövdeli cihazlar topraklanır; plastik gövdeliler çift yalıtımlı.'),
      soru('Topraksız uzatma kablosu kullanmak topraklama korumasını ortadan kaldırır.', true, 'Üçüncü uç kablonun öbür ucunda karşılık bulamaz.'),
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
        'Belirli zaman aralıklarında kendini tekrarlayan harekettir.\nÖrnek: sarkaç, yay, dönen tekerlek',
      ),
      kart(
        'Periyot ve frekans',
        '- **Periyot (T):** bir tam hareketin süresi\n- **Frekans (f):** birim zamandaki tekrar sayısı\nBiri ötekinin tersidir.',
      ),
      kart(
        'Hesap',
        '**T = 1 / f**\nSaniyede 5 kez salınan cismin periyodu: 0,2 s\nFrekansın birimi hertz (Hz), periyodunki saniye (s).',
      ),
      kart(
        'Basit sarkaç',
        '- **Bağlı:** ipin uzunluğu, yer çekimi ivmesi\n- **Bağlı değil:** asılan kütle',
        undefined,
        { not: 'T = 2π√(L/g): kütle yok. Ağır sarkaç aynı hızda salınır; ip 4 kat uzarsa periyot 2 kat.' },
      ),
      kart(
        'Genlik periyodu değiştirmez',
        'Küçük salınımlarda periyot, sarkacın ne kadar açıldığından bağımsızdır.\nSaatlerin sarkaçla çalışmasının sebebi budur.',
      ),
      kart(
        'Salınım',
        'Denge konumu çevresinde gidip gelmedir.\nDalgayı üreten hareket budur.',
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
        'Periyodu yayın sertliğine ve asılan kütleye bağlıdır.\nBasit sarkacın tersine, burada **kütle etkilidir**.',
      ),
      kart(
        'Sarkaç periyodunu neler değiştirir?',
        '- **İp uzarsa:** periyot büyür.\n- **Yer çekimi artarsa:** periyot küçülür.\nAy’da aynı sarkaç daha yavaş salınır.',
      ),
    ], [
      soru('Dönen bir tekerlek periyodik hareket yapar.', true, 'Eşit zaman aralıklarında aynı konuma döner.'),
      soru('Basit sarkacın periyodu genliğe bağlı değildir.', true, 'Küçük açılarda salınım süresi genlikten etkilenmiyor.'),
      soru('Basit sarkacın periyodu asılı kütleye bağlıdır.', false, 'İp uzunluğuna ve yer çekimi ivmesine bağlı; kütle etkilemiyor.'),
      soru('Frekansın birimi saniyedir.', false, 'Frekansın birimi hertz; saniye periyodun birimi.'),
      sikli('Saniyede 5 kez salınan cismin periyodu?', ['5 s', '0,2 s'], 1, 'T = 1/f.'),
      sikli('Yay sarkacının periyodu neye bağlıdır?', ['İp uzunluğu', 'Yayın sertliği ve kütle'], 1, 'Basit sarkacın tersine kütle etkili.'),
      sikli('Aynı sarkaç Ay\'da nasıl salınır?', ['Daha hızlı', 'Daha yavaş'], 1, 'Yer çekimi azalınca periyot büyür.'),
      sikli('Denge konumu çevresinde gidip gelme hareketine ne denir?', ['Salınım', 'Öteleme'], 0, 'Dalgayı üreten hareket salınımdır.'),
      soru('İpin boyu 4 katına çıkarılan sarkacın periyodu 2 katına çıkar.', true, 'Periyot ip boyunun kareköküyle orantılı: √4 = 2.'),
    ], [
      {
        soru: 'Basit sarkacın periyodu hangisine bağlıdır?',
        siklar: ['İpin uzunluğuna', 'Asılan kütleye'],
        dogru: 0,
        aciklama: {
          dogru: 'Uzun ip yavaş salınır; kütle ne olursa olsun periyot aynı kalır.',
          yanlis: 'Kütle basit sarkacın periyodunu değiştirmez; onu ipin uzunluğu ve yer çekimi belirler. Kütlenin işe girdiği yay sarkacı.',
        },
        kart: 4,
      },
    ]),
    konu('fzk10-dalga-kavram', 'Dalgaların Temel Kavramları', [
      kart(
        'Dalga nedir?',
        'Enerjinin, madde taşınmadan ortamda yayılmasıdır.\nDenizdeki şamandıra ilerlemez, yalnızca inip kalkar.',
      ),
      kart(
        'Dalga boyu',
        'Ardışık iki tepe ya da iki çukur arasındaki uzaklıktır.\nSimgesi **λ** (lamda).',
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
        'Denge konumundan en büyük uzaklıktır.\nDalganın taşıdığı enerjiyi genlik belirler.',
      ),
      kart(
        'Periyot ve frekans',
        '- **Periyot:** bir tam dalganın geçme süresi\n- **Frekans:** saniyedeki dalga sayısı\nFrekansı kaynak belirler.',
      ),
      kart(
        'Yayılma sürati',
        'Dalga boyu ile frekansın çarpımıdır.\n- **Frekansı:** kaynak belirler.\n- **Sürati:** ortam belirler.',
        undefined,
        { not: 'Kaynak frekansı 2 kat artırırsa aynı ortamda sürat aynı kalır, dalga boyu yarıya iner.' },
      ),
      kart(
        'Genlik enerjidir',
        '- **Sesin şiddeti:** genlikle ilgili\n- **Sesin tizliği:** frekansla ilgili\nİkisi bağımsız değişir; yüksek ses tiz olmak zorunda değildir.',
      ),
      kart(
        'Hesap kalıbı',
        '**v = λ · f**\n50 Hz, λ = 2 m → v = 100 m/s\nPeriyot verilirse önce frekansa çevir: f = 1 / T',
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
      sikli('Periyodu 0,1 s olan dalganın frekansı?', ['0,1 Hz', '10 Hz'], 1, 'f = 1 / T = 1 / 0,1 = 10 Hz.'),
      sikli('Dalganın frekansını ne belirler?', ['Kaynak', 'Ortam'], 0, 'Frekans kaynağa, sürat ortama bağlıdır.'),
      soru('Genliği büyük olan ses daha tizdir.', false, 'Genlik şiddeti, frekans tizliği belirler; ikisi bağımsız.'),
      soru('Bir dalganın sürati onu oluşturan kaynağa bağlıdır.', false, 'Sürati ortam belirler; kaynak yalnızca frekansı belirler.'),
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
        'Dalgalar iki ayrı soruya göre sınıflandırılır:\n- Ortam gerekiyor mu?\n- Titreşim hangi yönde?',
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
        'Yayılmak için **ortam** gerekir; boşlukta yayılamaz.\nÖrnek: ses, su dalgası, yay dalgası',
      ),
      kart(
        'Elektromanyetik dalga',
        'Ortam gerektirmez, boşlukta da yayılır.\nÖrnek: ışık, radyo dalgası, X ışını',
      ),
      kart(
        'Enine dalga',
        'Titreşim, yayılma doğrultusuna **diktir**.\nÖrnek: su dalgası, ışık',
      ),
      kart(
        'Boyuna dalga',
        'Titreşim, yayılma doğrultusuyla **aynı** doğrultudadır.\nSes dalgası sıkışma ve seyrelmelerle ilerler.',
      ),
      kart(
        'Uzayda ses yok',
        'Ses mekanik bir dalgadır, taşıyacak tanecik ister.\nBoşlukta ses yayılmaz; ışık ise yayılır.',
      ),
      kart(
        'Elektromanyetik tayf',
        'Frekans sırasıyla (küçükten büyüğe):\nradyo → mikrodalga → kızılötesi → görünür ışık → morötesi → X → gama',
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
        '- **P dalgası:** boyuna, hızlı, önce gelir.\n- **S dalgası:** enine, yavaş, daha yıkıcı.\nİkisi arasındaki süre, merkez üssüne uzaklığı verir.',
      ),
    ], [
      soru('Ses mekanik bir dalgadır ve boşlukta yayılmaz.', true, 'Yayılmak için maddesel ortama ihtiyaç duyuyor.'),
      soru('Elektromanyetik dalgalar yayılmak için ortama ihtiyaç duymaz.', true, 'Güneş ışığı boşluğu geçerek bize ulaşıyor.'),
      soru('Işık boyuna bir dalgadır.', false, 'Işık enine dalga; boyuna dalgaya örnek ses.'),
      soru('Elektromanyetik tayfta yalnızca görünür ışık bulunur.', false, 'Radyo dalgasından gama ışınına kadar geniş bir aralık var.'),
      sikli('Hangisi mekanik bir dalgadır?', ['Radyo dalgası', 'Yay dalgası'], 1, 'Yay dalgası ortam gerektirir; radyo dalgası elektromanyetik.'),
      sikli('Depremde önce gelen dalga hangisidir?', ['P dalgası', 'S dalgası'], 0, 'P boyuna ve hızlı; S enine ve yıkıcı.'),
      sikli('Elektromanyetik tayfta frekansı en yüksek olan?', ['Gama ışını', 'Radyo dalgası'], 0, 'Sıra radyo → … → gama.'),
      soru('X ışınları elektromanyetik dalgadır.', true, 'Radyodan gama ışınına kadar tayfın bir parçası; ortam gerektirmez.'),
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
        'Sürat, kaynağın değil **ortamın** özelliğidir.\nKaynağı değiştirmek frekansı değiştirir, sürati değil.',
      ),
      kart(
        'Ses hangi ortamda hızlı?',
        '- **Katıda:** en hızlı\n- **Gazda:** en yavaş\nTanecikler yakın olduğunda titreşim daha çabuk aktarılır.',
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
        'Havada sıcaklık arttıkça ses sürati artar.\nTanecikler daha hızlı hareket eder.',
      ),
      kart(
        'Işıkta tersi',
        'Işık en hızlı **boşlukta** yayılır, yoğun ortamda yavaşlar.\nSes ile ışık bu açıdan birbirinin tersidir.',
        undefined,
        { not: 'Ses katıda en hızlı (demirde ~5000 m/s), ışık boşlukta en hızlı. Aynı soruda ikisi ters çalışır.' },
      ),
      kart(
        'Su dalgalarında derinlik',
        '- **Derin su:** dalga hızlı\n- **Sığ su:** dalga yavaş\nKıyıya yaklaşan dalganın yükselmesi bundandır.',
      ),
      kart(
        'Yay dalgasında',
        'Gergin ve hafif yayda dalga daha hızlı yayılır.\nGitar telinin sesi gerginlikle tizleşir.',
      ),
    ], [
      soru('Ses katılarda gazlara göre daha hızlı yayılır.', true, 'Tanecikler birbirine yakın olduğu için titreşim çabuk aktarılıyor.'),
      soru('Havanın sıcaklığı arttıkça sesin sürati artar.', true, 'Tanecikler daha hızlı hareket ediyor.'),
      soru('Işık yoğun ortamda daha hızlı yayılır.', false, 'Işık en hızlı boşlukta yayılır; yoğun ortamda yavaşlar.'),
      soru('Su dalgalarının sürati derinlikten etkilenmez.', false, 'Derin ortamda daha hızlı, sığ ortamda daha yavaş yayılır.'),
      sikli('Gitar teli gerildikçe teldeki dalganın sürati?', ['Azalır', 'Artar'], 1, 'Gergin telde dalga daha hızlı yayılır; ses tizleşir.'),
      sikli('Kaynağı değiştirmek dalganın neyini değiştirir?', ['Süratini', 'Frekansını'], 1, 'Sürat ortamın özelliği; kaynak frekansı belirler.'),
      soru('Ses suda havadakinden daha hızlı yayılır.', true, 'Sıvıda tanecikler gazdakinden yakın; titreşim daha çabuk aktarılır.'),
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
        'Dalga engele çarpıp geri döner.\n- Gelme açısı = yansıma açısı\n- Dalga boyu ve frekans değişmez.',
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
        'Dalga, derinliği farklı bölgeye geçer.\nSürati ve dalga boyu değişir, doğrultusu kırılır.',
      ),
      kart(
        'Frekans değişmez',
        'Kırılmada frekansı yine kaynak belirler, sabit kalır.\nDeğişenler sürat ve dalga boyudur.',
        undefined,
        { not: 'Derinden sığa geçen dalga: f aynı, v düşer, λ kısalır. Değişmeyen tek şey frekans.' },
      ),
      kart(
        'Hangi yöne kırılır?',
        '- **Yavaşlayan dalga:** normale yaklaşır.\n- **Hızlanan dalga:** normalden uzaklaşır.\nDerinden sığa geçiş dalgayı yavaşlatır.',
      ),
      kart(
        'Dik gelirse',
        'Dalga sınıra dik gelirse doğrultusu değişmez.\nYalnızca sürati ve dalga boyu değişir.',
      ),
      kart(
        'Kıyıya paralel dalgalar',
        'Sığlaşan suda dalga yavaşlar ve kırılır.\nBu yüzden açıyla gelen dalgalar kıyıya neredeyse paralel varır.',
      ),
    ], [
      soru('Dalgalar yansırken frekansları değişmez.', true, 'Frekansı kaynak belirliyor.'),
      soru('Su dalgası derin ortamdan sığ ortama geçerken yavaşlar ve dalga boyu küçülür.', true, 'Frekans sabit kaldığı için sürat düşünce dalga boyu da düşüyor.'),
      soru('Kırılma sırasında dalganın frekansı değişir.', false, 'Frekans değişmez; değişen sürat ve dalga boyu.'),
      soru('Bir dalga yüzeye dik geldiğinde kırılarak yön değiştirir.', false, 'Doğrultusu değişmez; yalnızca sürati ve dalga boyu değişir.'),
      sikli('Derinden sığa geçen dalga normale göre nasıl kırılır?', ['Normalden uzaklaşır', 'Normale yaklaşır'], 1, 'Yavaşlayan dalga normale yaklaşır.'),
      sikli('Yansımada gelme açısı ile yansıma açısı?', ['Yansıma daha büyük', 'Eşittir'], 1, 'Dalga boyu ve frekans da değişmez.'),
      soru('Açıyla gelen dalgalar sığlaşan kıyıya neredeyse paralel varır.', true, 'Sığ suda yavaşlayan dalga normale yaklaşarak kırılır.'),
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
        'Her cismin kendiliğinden titreştiği bir frekans vardır.\nBardağın tınlaması bu frekanstadır.',
      ),
      kart(
        'Rezonans',
        'Dış etkinin frekansı, cismin doğal frekansına eşitse genlik hızla büyür.\nAz kuvvetle büyük salınım oluşur.',
      ),
      kart(
        'Salıncak örneği',
        '- **Doğru anda itmek:** küçük itmeler büyük salınım üretir.\n- **Yanlış anda itmek:** salınımı söndürür.',
      ),
      kart(
        'Depremde neden önemli?',
        'Sarsıntının frekansı binanın doğal frekansına yakınsa bina daha şiddetli sallanır.\nHasar bu yüzden artar.',
      ),
      kart(
        'Bina yüksekliği',
        '- **Alçak bina:** doğal frekansı yüksek\n- **Yüksek bina:** doğal frekansı düşük\nAynı deprem farklı binaları farklı zorlar.',
      ),
      kart(
        'Odak ve merkez üssü',
        '- **Odak:** kırılmanın yer altındaki noktası\n- **Merkez üssü:** odağın yeryüzündeki izdüşümü',
      ),
      kart(
        'Şiddet ve büyüklük',
        '- **Büyüklük:** açığa çıkan enerji, tek bir değer\n- **Şiddet:** hissedilen etki, yere göre değişir',
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
        '- Binanın doğal frekansı sarsıntınınkinden uzaklaştırılır.\n- Sönümleyici konur.\n- Taban yalıtımı sarsıntıyı binaya geçirmez.',
      ),
    ], [
      soru('Rezonans, bir cismin doğal frekansına eşit frekansta zorlanmasıyla oluşur.', true, 'Genlik hızla büyüyor.'),
      soru('Bir binanın doğal frekansı deprem dalgalarının frekansına yakınsa hasar artar.', true, 'Rezonans, sarsıntının etkisini büyütüyor.'),
      soru('Depremin büyüklüğü ile şiddeti aynı şeydir.', false, 'Büyüklük açığa çıkan enerjiyi, şiddet ise oluşturduğu etkiyi anlatıyor.'),
      soru('Odak (iç merkez), depremin yeryüzündeki noktasıdır.', false, 'Yeryüzündeki nokta merkez üssü; odak yerin içindeki kırılma noktası.'),
      sikli('Yüksek binaların doğal frekansı nasıldır?', ['Yüksek', 'Düşük'], 1, 'Alçak bina yüksek frekans.'),
      sikli('Taban yalıtımının amacı nedir?', ['Sarsıntıyı binaya geçirmemek', 'Binayı ağırlaştırmak'], 0, 'Bina zeminden ayrılarak sarsıntının etkisi azaltılır.'),
      sikli('Bardağın tınlaması hangi frekanstadır?', ['Doğal frekansında', 'Rastgele frekansta'], 0, 'Her cismin kendiliğinden titreştiği bir frekansı vardır.'),
      sikli('Salıncakta yanlış anda itmek ne yapar?', ['Salınımı büyütür', 'Salınımı söndürür'], 1, 'Doğru zamanlama rezonans.'),
      soru('Aynı deprem, doğal frekansları farklı binaları farklı zorlar.', true, 'Sarsıntının frekansına yakın doğal frekanslı bina daha çok sallanır.'),
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
