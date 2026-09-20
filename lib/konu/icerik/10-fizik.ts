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
        'Sabit hız: her saniye aynı kadar yol',
        'Bir araba her saniye 20 m gidiyor: 1 s\'de 20 m, 2 s\'de 40 m, 3 s\'de 60 m. Buna sabit hızlı hareket denir. Hızın büyüklüğü de yönü de değişmez; ivme sıfırdır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yol = hız × zaman',
        '20 m/s ile 5 s giden araç 20·5 = 100 m yol alır. Formül: x = v·t. Hızı bulmak istersen yolu zamana böl: v = x/t.',
      ),
      kart(
        'Konum-zaman grafiği eğik bir doğrudur',
        'Her saniye aynı yol eklendiği için çizgi düz çıkar. Çizgi ne kadar dikse hız o kadar büyük. Eğim, yani çizginin dikliği, hızı verir. Yatay çizgi duran cisim demek: konum değişmiyor.',
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
        'Hız-zaman grafiği yatay bir çizgidir',
        'Hız 3 m/s ve hiç değişmiyor: çizgi 3 hizasında düz gider. Çizginin altındaki dikdörtgenin alanı 3·5 = 15, yani alınan yol. Alan = hız × zaman = yol.',
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
        'Eğim mi alan mı? Grafiğe göre değişir',
        'Konum-zaman grafiğinde eğime bak: hız. Hız-zaman grafiğinde alana bak: yol. Hız-zaman grafiğinin altındaki alan ivme değil, yoldur. İki grafik aynı hareketi iki ayrı pencereden gösterir.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Ortalama hız: toplam yol bölü toplam süre',
        'Araç 2 saatte 100 km, sonra 3 saatte 200 km gitsin. Ortalama hız 300/5 = 60 km/h. Hızları toplayıp ikiye bölme; yolları topla, süreleri topla, sonra böl.',
      ),
      kart(
        'Aynı yönde fark, zıt yönde toplam',
        'Sen 5 m/s, arkadaşın karşıdan 3 m/s koşuyor: aranız her saniye 8 m kapanır, hızlar toplandı. Aynı yöne koşsaydınız aranız saniyede 2 m değişirdi, hızlar çıkarıldı. Karşılaşma süresi = aradaki uzaklık / yaklaşma hızı.',
      ),
      kart(
        'Hesaba başlamadan birimleri eşitle',
        '72 km/h ile 10 dakika giden araç kaç m gider? Önce çevir: 72 km/h = 72/3,6 = 20 m/s, 10 dk = 600 s. Yol 20·600 = 12.000 m. km/h\'yi m/s\'ye çevirmek için 3,6\'ya böl.',
        undefined,
        { not: 'Soruda km/h ve saniye bir arada görürsen dur; önce 3,6\'ya böl, sonra hesapla.' },
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
      soru('Hız-zaman grafiğinde çizginin altında kalan alan ivmeyi verir.', false, 'Alan alınan yolu verir; sabit hızda ivme zaten sıfır.'),
      soru('Ortalama hız, hızların toplamının ikiye bölünmesiyle bulunur.', false, 'Toplam yolun toplam süreye bölümüdür.'),
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
        kart: 3,
      },
    ]),
    konu('fzk10-sabit-ivme', 'Bir Boyutta Sabit İvmeli Hareket', [
      kart(
        'İvme, hızın ne kadar hızlı değiştiğidir',
        'Araba duruyor. 1 s sonra 2 m/s, 2 s sonra 4 m/s, 3 s sonra 6 m/s. Hız her saniye 2 m/s artıyor. İşte bu 2 m/s² ivme, yani hızın saniyedeki değişimi. Değişim her saniye aynıysa ivme sabittir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Hız formülü: v = v₀ + a·t',
        '10 m/s ile giden araç 3 m/s² ivmeyle 4 s hızlansın: v = 10 + 3·4 = 22 m/s. v₀ ilk hız, a ivme, t süre. Formül yalnızca ivme sabitken geçerli.',
      ),
      kart(
        'İvme hızla aynı yöndeyse hızlanır',
        'Gaz pedalı: ivme ileri, hız ileri, araç hızlanır. Fren: ivme geri, hız ileri, araç yavaşlar. Yönleri karşılaştır, işarete bakma. İvmesi eksi olan cisim de hızlanabilir: hızı da eksiyse, yani geri gidiyorsa.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Hız-zaman grafiğinin eğimi ivmedir',
        'Hız 4 s\'de 1\'den 5\'e çıkıyor: eğim (5−1)/4 = 1 m/s². Çizgi düz olduğu için ivme sabit. Çizginin altındaki alan yine yer değiştirme. Eksenin altına inen alan geri gidilen yol demek.',
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
        'Konum-zaman grafiği parabol olur',
        'Hızlanan araç her saniye bir öncekinden daha çok yol alıyor. Bu yüzden çizgi düz değil, gittikçe dikleşen bir eğri: parabol. Sabit hızda doğru, sabit ivmede parabol.',
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
        'Ortalama hız, ilk ve son hızın ortası',
        'Hız 0\'dan 6 m/s\'ye düzgün çıktıysa ortalama 3 m/s. 3 s sürdüyse yol 3·3 = 9 m. Kural: v_ort = (v₀ + v)/2, yol = v_ort·t. Bu kısayol yalnızca sabit ivmede çalışır.',
      ),
      kart(
        'Yol formülü: x = v₀·t + ½·a·t²',
        'Aynı örnek: v₀ = 0, a = 2, t = 3. x = 0·3 + ½·2·3² = 9 m. İki yol da aynı sonucu verir. Formülde t² var: süre iki katına çıkarsa yol dörde katlanır.',
      ),
      kart(
        'Zaman verilmediyse: v² = v₀² + 2·a·x',
        'Duran araç 2 m/s² ile 9 m gitti, hızı kaç? v² = 0 + 2·2·9 = 36, v = 6 m/s. Süreyi hiç kullanmadın. Soruda t yoksa bu formülü seç.',
      ),
      kart(
        'Serbest düşmede herkes aynı ivmeyle düşer',
        'Havası boşaltılmış tüpte taş ve tüy aynı anda yere varır. İkisinin ivmesi de g ≈ 9,8 m/s², yani yer çekimi ivmesi. Kütle düşüşü hızlandırmaz. Hesapta g çoğu zaman 10 alınır.',
      ),
      kart(
        'Tepede top durur, ivmesi durmaz',
        'Topu 20 m/s ile yukarı at. Hızı her saniye 10 azalır: 2 s sonra tepede hız 0. Ama ivme hâlâ 10 m/s² aşağı; o yüzden top hemen geri düşer. İvme sıfır olsaydı top havada asılı kalırdı.',
        undefined,
        { not: '"Tepede hız sıfır" deyince cümleyi bitirme; "ama ivme g, aşağı" diye ekle.' },
      ),
      kart(
        'Çıkış süresi iniş süresine eşit',
        '20 m/s ile atılan top 2 s\'de tepeye çıkar, 2 s\'de geri iner. Yere 20 m/s ile döner, yani atıldığı hızla. Tepeye çıkış süresi v₀/g.',
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
          yanlis: 'Hızlanma yalnızca ivme hızla aynı yöndeyken olur. Zıt yönlü ivme fren demek.',
        },
        kart: 3,
      },
      {
        soru: 'Yukarı atılan cisim en yüksek noktadayken ivmesi nedir?',
        siklar: ['Sıfır', 'g, aşağı yönlü'],
        dogru: 1,
        aciklama: {
          dogru: 'Yer çekimi her an aynı; tepe noktasında yalnızca hız sıfırlanır.',
          yanlis: 'Sıfır olan hız, ivme değil. İvme sıfır olsaydı hız değişmez ve cisim tepede asılı kalırdı.',
        },
        kart: 10,
      },
    ]),
  ]),
  tema('fzk10-t2', 'Enerji', [
    konu('fzk10-is-guc', 'İş, Enerji ve Güç', [
      kart(
        'Fizikte iş: kuvvet cismi yol boyunca iter',
        'Bir kutuyu 20 N kuvvetle 3 m ittin: iş 20·3 = 60 joule. Formül W = F·x; joule (J) işin birimi. Kuvvet yoksa ya da yol yoksa iş de yok.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Duvarı itmek iş değildir',
        'Duvarı bütün gücünle itiyorsun, yoruluyorsun ama duvar kımıldamıyor: yol 0, iş 0. Çantayla yatay yolda yürümek de iş değil: kuvvet yukarı, yol yana. Fizik yalnızca yol yönündeki kuvveti sayar.',
        {
          tur: 'tablo',
          basliklar: ['Durum', 'Örnek', 'İş'],
          satirlar: [
            ['Yol yok', 'duvarı itmek', '0'],
            ['Kuvvet yola dik', 'çanta taşımak', '0'],
            ['Kuvvet yok', 'buzda kayan taş', '0'],
          ],
        },
        { not: 'Çanta taşırken yorulmana bakma: kuvvet yukarı, yol yana, fizikte iş sıfır.' },
      ),
      kart(
        'Açılı kuvvette yalnızca yol yönü sayılır',
        'Bavulu yukarı doğru açıyla çekiyorsun. Kuvvetin bir kısmı bavulu ileri, bir kısmı yukarı çeker. İş yapan ileri kısım: W = F·cosθ·x. Yukarı çeken kısım iş yapmaz.',
      ),
      kart(
        'Kuvvet-yol grafiğinde alan iş',
        '10 N kuvvetle 4 m: grafik dikdörtgen, alanı 40 J. Kuvvet yol boyunca değişiyorsa formül işe yaramaz; grafiğin altındaki alanı hesaplarsın.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 14],
          xAd: 'yol (m)',
          yAd: 'kuvvet (N)',
          egriler: [
            {
              noktalar: [
                [0, 10],
                [4, 10],
                [4, 0],
                [0, 0],
              ],
              kirik: true,
              kapali: true,
            },
          ],
          etiketler: [{ x: 2, y: 5, ad: 'alan = iş', renk: 'ikincil' }],
        },
      ),
      kart(
        'Yapılan iş enerjiye dönüşür',
        'Duran arabayı 60 J işle ittin: araba 60 J kinetik enerji kazanır, yani hareket enerjisi. Net iş = kinetik enerjideki değişim. İş ve enerji aynı birimi paylaşır: joule.',
      ),
      kart(
        'Güç: işi ne kadar hızlı yaptığın',
        'İki asansör aynı yükü aynı kata çıkarıyor; biri 10 s\'de, öteki 20 s\'de. İşleri eşit, hızlı olanın gücü iki kat. Güç = iş / zaman, birimi watt (W). 1 W, saniyede 1 J demek.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Sabit hızda güç = kuvvet × hız',
        '20 m/s ile giden araba sürtünmeye karşı 500 N itiyor: güç 500·20 = 10.000 W. Formül P = F·v. Yokuşta aynı hız daha çok kuvvet, yani daha çok güç ister.',
      ),
      kart(
        'Verim: enerjinin işe dönen payı',
        'Ampul 100 J alıp 10 J ışık veriyorsa verimi %10; kalan 90 J ısı oldu. Verim = alınan iş / verilen enerji. Hiçbir makinede %100 olmaz; bir kısım hep ısıya kaçar.',
      ),
      kart(
        'Fatura güç değil enerji sayar',
        '2000 W\'lık ısıtıcı 3 saat çalışsın: 2 kW · 3 h = 6 kWh. Fatura bu sayıyı yazar. 1 kWh = 1000 W · 3600 s = 3,6 milyon joule. Watt harcanan miktar değil, harcama hızı.',
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
        'Hareket eden her şeyin kinetik enerjisi var',
        'Yuvarlanan top, koşan sen, uçan kuş. Hareketten gelen enerjiye kinetik enerji denir. Formül E = ½·m·v². 2 kg\'lık top 3 m/s ile gidiyorsa E = ½·2·9 = 9 J.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Hız iki katsa enerji dört kat',
        'Aynı top 6 m/s ile: E = ½·2·36 = 36 J. Hız 2 katına çıktı, enerji 4 katına. Sebep formüldeki v², hızın karesi. Fren mesafesi de böyle: iki kat hız, dört kat mesafe.',
        undefined,
        { not: '"Hız 3 kat" deyince "enerji 3 kat" deme; kareyi al, 9 kat.' },
      ),
      kart(
        'Potansiyel enerji: depolanmış, beklemede',
        'Rafın üstündeki vazo, gerilmiş yay, çekilmiş sapan. Hiçbiri hareket etmiyor ama bırakılınca edecek. Konumdan ya da şekilden gelen bu depolanmış enerjiye potansiyel enerji denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yükseklik enerjisi: E = m·g·h',
        '2 kg\'lık kitap 3 m yüksekte: E = 2·10·3 = 60 J. Kitabı 6 m\'ye çıkarırsan 120 J: yükseklik 2 kat, enerji 2 kat. Burada kare yok, doğru orantı. g yer çekimi ivmesi, hesapta 10.',
      ),
      kart(
        'Yayı ne kadar gerersen o kadar enerji',
        'Yayı 2 cm çekince biriken enerji 4 birim, 4 cm çekince 16 birim. Formül E = ½·k·x²; x uzama, k yayın sertliği. Yine kare var: uzama 2 kat, enerji 4 kat.',
      ),
      kart(
        'Enerji biçim değiştirir',
        'Pil (kimyasal) feneri yakar (ışık ve ısı). Şelale (potansiyel) düşer (kinetik), türbini döndürür (elektrik). Isı, ışık, ses, elektrik, kimyasal, nükleer: hepsi birbirine dönüşebilir.',
      ),
      kart(
        'Her dönüşümde bir pay ısıya kaçar',
        'Termik santral: kömür yanar, kimyasal enerji ısı olur. Buhar türbini döndürür, ısı mekanik olur. Türbin jeneratörü çevirir, mekanik elektrik olur. Her okta bir kısım ısı olarak havaya gider.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Kimyasal', alt: 'kömür' },
            { ad: 'Isı', alt: 'buhar' },
            { ad: 'Mekanik', alt: 'türbin' },
            { ad: 'Elektrik' },
          ],
        },
      ),
      kart(
        'Enerji yok olmaz, toplam sabit kalır',
        'Fener pilinin 100 J\'ü ışığa ve ısıya dağılır; toplarsan yine 100 J. Enerji yoktan var olmaz, yok olmaz; yalnızca biçim değiştirir. Buna enerjinin korunumu denir. "Enerji kayboldu" demek, ısıya gitti demek.',
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
        kart: 2,
      },
    ]),
    konu('fzk10-mekanik', 'Mekanik Enerji', [
      kart(
        'Mekanik enerji = kinetik + potansiyel',
        'Havada uçan top hem hareket ediyor (kinetik) hem yüksekte (potansiyel). İkisinin toplamı mekanik enerji. 3 m yükseklikte 4 m/s ile giden 1 kg top: 30 + 8 = 38 J.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Sürtünme yoksa toplam değişmez',
        'Top düşerken yükseklik azalır, hız artar. Potansiyel 30\'dan 0\'a inerken kinetik 8\'den 38\'e çıkar; toplam hep 38 J. Buna mekanik enerjinin korunumu denir. Şart: sürtünme ve hava direnci yok.',
      ),
      kart(
        'Sarkaç: tepede potansiyel, altta kinetik',
        'Salıncak en yükseğe çıkınca bir an durur: kinetik 0, potansiyel en büyük. En alttan geçerken en hızlı: kinetik en büyük, potansiyel 0. Arada ikisi de var, toplam hep aynı.',
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
        'Düşen cismin hızı kütleye bağlı değil',
        '5 m\'den bırakılan taş: m·g·h = ½·m·v². Kütle iki tarafta da var, sadeleşir: v = √(2gh) = √(2·10·5) = 10 m/s. Taş 1 kg da olsa 10 kg da olsa yere aynı hızla varır.',
      ),
      kart(
        'Yolun şekli son hızı değiştirmez',
        'Aynı yükseklikten biri dik, biri yatık iki sürtünmesiz kaydırak. Yatıktan kayan daha geç iner ama yere aynı hızla varır. Son hız yalnızca yükseklik farkına bağlı; yol ne kadar dolambaçlı olursa olsun.',
      ),
      kart(
        'Sıfır yüksekliği sen seçersin',
        'Masadaki kitap: yeri sıfır alırsan 1 m yüksekte, masayı sıfır alırsan 0 m. Potansiyel enerji seçime göre değişir. Ama kitap 0,5 m düşünce kaybettiği enerji ikisinde de aynı. Hesaba giren o değişim.',
        undefined,
        { not: 'Yükseklik sorusunda önce "sıfır nerede" diye bak; tek değeri değil, farkı hesapla.' },
      ),
      kart(
        'Sürtünme varsa mekanik enerji azalır',
        'Kaydıraktan inen çocuğun pantolonu ısınır. Enerjinin bir kısmı ısı oldu; mekanik enerji azaldı ama toplam enerji korunuyor. Kayıp değil, dönüşüm.',
      ),
      kart(
        'Isıya giden enerji = sürtünme × yol',
        '10 N sürtünme kuvvetiyle 3 m kayan kutu 30 J mekanik enerji kaybeder. Bu 30 J ısı olarak yüzeylere geçer. Kaybolan mekanik enerji sorulursa sürtünme kuvvetiyle yolu çarp.',
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
        kart: 5,
      },
    ]),
    konu('fzk10-kaynak', 'Enerji Kaynakları', [
      kart(
        'Yenilenebilir: kullandıkça bitmez',
        'Güneş her sabah yine doğar, rüzgâr yine eser, nehir yine akar. Güneş, rüzgâr, hidroelektrik (akan su), jeotermal (yerin ısısı) ve biyokütle (bitki, atık) yenilenebilir kaynaklardır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yenilenemez: tükenince yenisi gelmez',
        'Kömür, petrol ve doğal gaz milyonlarca yılda oluştu; yakınca biter. Bunlara fosil yakıt denir. Nükleer yakıt uranyum da yenilenemez: madende ne kadar varsa o kadar.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Fosil yakıt yanınca karbondioksit çıkar',
        'Arabanın egzozu, kömür sobasının bacası: yanan yakıt havaya CO₂ salar. CO₂ ısıyı tutar; küresel ısınmanın ana sebebi bu. Yenilenebilire geçişin asıl gerekçesi tükenme değil, bu salım.',
      ),
      kart(
        'Güneş gece, rüzgâr durgun havada üretmez',
        'Güneş paneli akşam durur, rüzgâr türbini rüzgârsız günde dönmez. Yenilenebilirin zayıf noktası süreklilik. Çözüm: üretileni pilde depolamak ya da başka kaynakla desteklemek.',
      ),
      kart(
        'Hiçbiri her ölçütte üstün değil',
        'Kömür santrali günün her saati çalışır ama havayı kirletir. Rüzgâr temiz ama hava durumuna bağlı. Soruda "hangisi daha iyi" değil, "hangi ölçütte üstün" diye bak.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fosil', 'Yenilenebilir'],
          satirlar: [
            ['Süreklilik', 'Yüksek', 'Değişken'],
            ['Salım', 'Yüksek', 'Düşük'],
            ['Tükenme', 'Var', 'Yok'],
          ],
        },
        { not: '"En iyi kaynak hangisi" diye soran şıkta dur; tabloya bak, hangi satırı soruyor?' },
      ),
      kart(
        'Barajda su düşer, türbin döner',
        'Baraj gölündeki su yüksekte: potansiyel enerji. Kapak açılınca su düşer: kinetik enerji. Su türbini döndürür, türbin jeneratörü çevirir: elektrik.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Potansiyel', alt: 'yüksekteki su' },
            { ad: 'Kinetik', alt: 'düşen su' },
            { ad: 'Elektrik', alt: 'jeneratör' },
          ],
        },
      ),
      kart(
        'Nükleer: temiz baca, sorunlu atık',
        'Nükleer santral CO₂ salmaz ve bir avuç uranyumdan çok büyük enerji çıkar. Ama yakıt tükenir ve kullanılmış yakıt binlerce yıl ışıma yapar; güvenli saklanması gerekir.',
      ),
      kart(
        'Türkiye\'de jeotermal ve su güçlü',
        'Denizli ve Aydın çevresindeki sıcak su kaynakları jeotermal santral çalıştırıyor. Barajlar uzun süredir elektriğin büyük payı. Rüzgâr ve güneş kurulu gücü her yıl artıyor.',
      ),
      kart(
        'Harcanmayan enerji en ucuz kaynak',
        'Evi yalıtırsan kışın daha az doğal gaz yakarsın: o gaz üretilmedi bile. LED ampul aynı ışığı beşte bir elektrikle verir. Tasarruf, üretilmesi gerekmeyen enerjidir.',
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
        'Devre: pil, kablo, ampul, anahtar',
        'El fenerini aç: pil enerji verir, kablo taşır, ampul harcar (ışık verir), düğme yolu açıp kapatır. Fizik dilinde: üreteç, iletken, direnç, anahtar.',
        {
          tur: 'tablo',
          basliklar: ['Eleman', 'Örnek', 'İşi'],
          satirlar: [
            ['Üreteç', 'pil', 'enerji verir'],
            ['İletken', 'kablo', 'taşır'],
            ['Direnç', 'ampul', 'harcar'],
            ['Anahtar', 'düğme', 'açar, kapar'],
          ],
        },
        { etiket: 'Tanım' },
      ),
      kart(
        'Akım geçmesi için yol kapalı olmalı',
        'Anahtar açık: kabloda boşluk var, yükler tur atamaz, ampul yanmaz. Anahtar kapalı: yol tam, akım geçer. "Kapalı devre" çalışan devre demek; kelime seni şaşırtmasın.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Gerilim, akımı iten şeydir',
        'Pilin iki ucu arasında enerji farkı var. Buna potansiyel fark ya da gerilim denir. Birimi volt (V). Kalem pil 1,5 V, priz 220 V. Fark yoksa itme yok, akım yok.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Akım telden geçen yük, direnç karşı koyma',
        'Gerilim itince yükler telde akar. Saniyede geçen yük miktarı akımdır, birimi amper (A). Direnç ise akıma karşı koymadır, birimi ohm (Ω). Devre soruları bu üçünü birbirine bağlar.',
      ),
      kart(
        'Su borusu gibi düşün',
        'Su deposu yüksekteyse (basınç farkı) su akar (debi), boru darsa az akar (direnç). Gerilim basınç farkı, akım debi, direnç dar boru. Benzetme üçünü oturtur ama su elektrik değil.',
        {
          tur: 'tablo',
          basliklar: ['Elektrik', 'Su'],
          satirlar: [
            ['Gerilim', 'Basınç farkı'],
            ['Akım', 'Debi'],
            ['Direnç', 'Dar boru'],
          ],
        },
        { not: 'Akım mı gerilim mi karıştırdığında boruyu düşün: iten şey basınç, akan şey su.' },
      ),
      kart(
        'Şema bağlantıyı gösterir, görüntüyü değil',
        'Şemada pil iki çizgi: uzun çizgi artı (+), kısa kalın çizgi eksi (−). Ampul daire içinde çarpı, direnç zikzak ya da dikdörtgen. Kablonun uzunluğu ve rengi şemada yok; yalnızca kim kime bağlı.',
      ),
      kart(
        'Harcanan enerji = gerilim × akım × süre',
        '220 V\'ta 2 A çeken ısıtıcı 10 s\'de 220·2·10 = 4400 J harcar. Formül E = V·I·t. Elektrik faturası bu enerjiyi sayar, kWh olarak.',
      ),
      kart(
        'Çok akım çeken ampul parlak yanar',
        'Aynı ampulden 0,5 A yerine 1 A geçerse daha parlak yanar, daha çok güç harcar. Parlaklığı belirleyen akım ve güç; kablonun uzunluğu ya da rengi değil.',
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
        kart: 2,
      },
    ]),
    konu('fzk10-akim', 'Elektrik Akımı', [
      kart(
        'Akım: saniyede geçen yük',
        'Telin bir kesitini kapı gibi düşün. Kapıdan saniyede 1 coulomb yük geçiyorsa akım 1 amper. Coulomb (C) yükün birimi. Formül I = q/t.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Yük = akım × süre',
        '2 A akım 10 s aktı: q = 2·10 = 20 C geçti. Tersini sorarsa böl: 30 C, 5 s\'de geçtiyse akım 30/5 = 6 A.',
      ),
      kart(
        'Elektron eksiden artıya, akım artıdan eksiye',
        'Pilde elektronlar eksi kutuptan çıkar, artı kutba koşar. Ama fizikte akım yönü artıdan eksiye kabul edilir; elektron bilinmeden önce böyle tanımlandı. Şemadaki ok artıdan eksiye.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Fark yoksa akım durur',
        'Pil bittiğinde iki kutup arasındaki gerilim sıfıra iner; elektronları iten kalmaz, akım durur. Akımı yürüten şey potansiyel fark.',
      ),
      kart(
        'Elektron yavaş, etki hızlı',
        'Düğmeye basınca lamba anında yanar. Ama elektronlar telde saniyede milimetreler ilerler. Hızlı olan elektron değil, itme. Tel su dolu bir boru gibi: bir ucundan itince öteki uçtan hemen çıkar.',
      ),
      kart(
        'Ampermetre akımı ölçer, seri bağlanır',
        'Akımı ölçmek için akım aletin içinden geçmeli. Ampermetre kabloyu kesip araya girer; buna seri bağlama denir. İç direnci sıfıra yakın ki akımı azaltmasın.',
      ),
      kart(
        'Voltmetre gerilimi ölçer, paralel bağlanır',
        'Gerilim iki nokta arasındaki fark. Voltmetre o iki noktaya iki teliyle dokunur, kabloyu kesmez; buna paralel bağlama denir. İç direnci çok büyük ki kendisi akım çekmesin.',
      ),
      kart(
        'Yerleri karışırsa ölçüm değil kaza',
        'Ampermetre paralel bağlanırsa sıfır dirençli kestirme yol olur: kısa devre, akım aşırı büyür. Voltmetre seri bağlanırsa çok büyük direnç yolu tıkar: akım geçmez.',
        {
          tur: 'tablo',
          basliklar: ['Alet', 'Bağlantı', 'Direnç'],
          satirlar: [
            ['Ampermetre', 'seri', 'sıfıra yakın'],
            ['Voltmetre', 'paralel', 'çok büyük'],
          ],
        },
        { not: 'Seri mi paralel mi diye ezberleme; direncinden yola çık: sıfıra yakınsa seri, çok büyükse paralel.' },
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
        'Gerilim = akım × direnç',
        '4 Ω\'luk dirence 12 V uygulandı: akım 12/4 = 3 A. Formül V = I·R; buna Ohm yasası denir. Üçünden ikisi verilirse üçüncüyü bulursun.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Gerilim iki katsa akım iki kat',
        'Aynı 4 Ω direnç, gerilim 24 V: akım 6 A. Direnç sabitken akım gerilimle doğru orantılı. Direnç iki kat olursa akım yarıya iner: ters orantı.',
      ),
      kart(
        'Grafikte eğim direnci verir',
        'Yatay eksen akım, düşey eksen gerilim. 3 A\'da 12 V: eğim 12/3 = 4 Ω. Dik çizgi büyük direnç, yatık çizgi küçük direnç. Önce eksenlere bak; ters çizilirse eğim 1/R olur.',
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
        { not: 'Grafik sorusunda hemen eğime koşma; önce hangi eksen akım, hangisi gerilim diye bak.' },
      ),
      kart(
        'Direnç: akıma karşı koyma',
        'Aynı pil ince telde az, kalın telde çok akım geçirir. Telin akımı zorlaştırmasına direnç denir, birimi ohm (Ω). Direnç telin maddesine, uzunluğuna, kalınlığına ve sıcaklığına bağlı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Uzun tel çok, kalın tel az direnç',
        '1 m tel 2 Ω ise 2 m aynı tel 4 Ω. Kesiti (kalınlığı) iki kat olan tel 1 Ω. Direnç uzunlukla doğru, kesit alanıyla ters orantılı. Evdeki kalın kablolar bu yüzden az ısınır.',
      ),
      kart(
        'Öz direnç maddeye özgü',
        'Aynı boy ve kalınlıkta bakır tel ile demir tel: demir daha çok direnç gösterir. Fark maddeden geliyor; buna öz direnç (ρ) denir. Formül R = ρ·L/A: L uzunluk, A kesit alanı.',
      ),
      kart(
        'Metal ısınınca direnci artar',
        'Ampulün teli soğukken 30 Ω, yanıp ısınınca 300 Ω olabilir. Metalde sıcaklık artınca atomlar daha çok titreşir, elektronlar daha zor geçer. Sıcak tel, büyük direnç.',
      ),
      kart(
        'Her eleman Ohm\'a uymaz',
        'Diyot ve ampul için gerilim-akım grafiği düz çizgi çıkmaz; direnç akımla değişir. Bunlara ohmik olmayan eleman denir. Ohm yasası düz çizgi verenler için: metaller, sabit dirençler.',
      ),
    ], [
      soru('Ohm yasasına göre gerilim, akım ile direncin çarpımına eşittir.', true, 'V = I · R.'),
      soru('Bir iletkenin direnci uzunluğuyla doğru, kesit alanıyla ters orantılıdır.', true, 'İnce ve uzun tel daha çok direnç gösteriyor.'),
      soru('Metallerde sıcaklık arttıkça direnç azalır.', false, 'Metallerde direnç artar; azalan yarı iletkenlerde görülür.'),
      soru('Bütün devre elemanları Ohm yasasına uyar.', false, 'Diyot ve ampul gibi ohmik olmayan elemanlar var.'),
      sikli('12 V üretece 4 Ω direnç bağlanırsa akım kaç amperdir?', ['3', '48'], 0, 'I = V / R.'),
      sikli('Kesit alanı büyüyen telin direnci?', ['Azalır', 'Artar'], 0, 'Kesitle ters orantılı; kalın kablo az direnç.'),
      sikli('Gerilim-akım grafiğinin eğimi neyi verir?', ['Direnci', 'Gücü'], 0, 'V = I·R; eğim R.'),
      sikli('Aynı boy ve kesitteki bakır ile demir teli ayıran nedir?', ['Öz direnç', 'Sıcaklık'], 0, 'Maddeye özgü.'),
      soru('Diyot ve ampul için Ohm yasası her zaman geçerlidir.', false, 'Ohmik olmayan elemanlarda grafik doğru çıkmaz.'),
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
        kart: 5,
      },
    ]),
    konu('fzk10-direnc-baglama', 'Dirençlerin Bağlanması', [
      kart(
        'Seri: uç uca, tek yol',
        'İki ampulü ip gibi art arda bağla: akımın tek yolu var. 2 Ω ve 3 Ω seri → eşdeğer 5 Ω, toplanır. Akım her elemandan aynı geçer; gerilim dirençlere paylaşılır.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Seride biri sönerse hepsi söner',
        'Eski yılbaşı ışıkları: bir ampul patlayınca dizinin tamamı söner. Tek yol kesildi, akım hiçbir yerde geçmez. Seride her eleman aynı akımı taşır.',
      ),
      kart(
        'Paralel: aynı iki nokta arasında, çok yol',
        'İki ampulü yan yana, aynı iki noktaya bağla. Akım ikiye ayrılır, her ampul aynı gerilimi görür. Bir ampul sönse öteki yanmaya devam eder: yolu ayrı.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Paralelde eşdeğer direnç küçülür',
        '6 Ω ile 3 Ω paralel: 1/R = 1/6 + 1/3 = 1/2, R = 2 Ω. İki direnç için kısayol: çarpım bölü toplam = 18/9 = 2. Sonuç en küçük dirençten (3) bile küçük: yol çoğaldı, geçiş kolaylaştı.',
      ),
      kart(
        'Özdeş dirençlerde kısayol',
        '4 tane 8 Ω seri: 4·8 = 32 Ω. Aynı 4 tane paralel: 8/4 = 2 Ω. n tane R direnci seride n·R, paralelde R/n.',
      ),
      kart(
        'Seride akım, paralelde gerilim ortak',
        'Seride tek yol var, akım paylaşılamaz: ortak. Paralelde her kol aynı iki noktaya bağlı, gerilim aynı: ortak. Biri ortaksa öteki bölünür.',
        {
          tur: 'tablo',
          basliklar: ['', 'Seri', 'Paralel'],
          satirlar: [
            ['Akım', 'Ortak', 'Bölünür'],
            ['Gerilim', 'Bölünür', 'Ortak'],
            ['Eşdeğer R', 'Artar', 'Azalır'],
          ],
        },
        { not: 'Soruda "hangisi eşit" diye sorulunca önce bağlantıya bak: seride akım, paralelde gerilim.' },
      ),
      kart(
        'Paralelde akım küçük dirençten çok geçer',
        '12 V\'a paralel 6 Ω ve 3 Ω: ikisi de 12 V görür. 6 Ω\'dan 12/6 = 2 A, 3 Ω\'dan 12/3 = 4 A geçer. Küçük direnç, büyük akım: akım kolay yolu daha çok kullanır.',
      ),
      kart(
        'Ev tesisatı paralel',
        'Buzdolabı çalışırken lambayı söndürebiliyorsun; televizyon kapanınca fırın durmuyor. Her cihaz kendi yolunda ve hepsi aynı 220 V\'u görüyor. Seri olsaydı biri kapanınca hepsi dururdu.',
      ),
      kart(
        'Kısa devre: dirençsiz kestirme yol',
        'Pilin iki ucunu kabloyla doğrudan birleştir: dirençsiz yoldan akım aşırı büyür, kablo ısınır, yangın çıkabilir. Sigorta bu akımı keser. Kısa devre akımın dirençten geçmesi değil, direnci atlaması.',
        undefined,
        { etiket: 'Dikkat' },
      ),
      kart(
        'Karışık devreyi parça parça sadeleştir',
        'Önce en içteki gruba bak: seri mi paralel mi? Onu tek dirence indir, sonra bir dışarı çık. Her adımda devre küçülür, sonunda tek direnç kalır.',
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
      sikli('Seri bağlı dizide bir ampul patlarsa ötekiler ne olur?', ['Söner', 'Yanmaya devam eder'], 0, 'Tek yol kesilir; akım hiçbir yerde geçmez.'),
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
        'Seri piller: gerilimler toplanır',
        'Kumandaya iki 1,5 V pil uç uca konur: 1,5 + 1,5 = 3 V. Birinin artısı ötekinin eksisine değer. Cihaz daha yüksek gerilim istiyorsa piller seri bağlanır.',
      ),
      kart(
        'Paralel piller: gerilim aynı, süre uzar',
        'İki özdeş 1,5 V pil yan yana, artılar birbirine, eksiler birbirine: gerilim yine 1,5 V. Ama her pil akımın yarısını verir; ikisi birlikte iki kat uzun dayanır.',
      ),
      kart(
        'Seri gerilimi, paralel süreyi artırır',
        'Daha parlak ışık istiyorsan seri: gerilim toplanır. Daha uzun süre istiyorsan paralel: gerilim aynı kalır, pil geç biter. İkisi aynı anda olmaz.',
        {
          tur: 'tablo',
          basliklar: ['', 'Seri', 'Paralel'],
          satirlar: [
            ['Gerilim', 'toplanır', 'tek pil kadar'],
            ['Süre', 'tek pil kadar', 'uzar'],
            ['Örnek', 'kumanda', 'yedek güç'],
          ],
        },
        { not: 'Soruda "daha parlak" mı "daha uzun" mu isteniyor diye bak: parlak seri, uzun paralel.' },
      ),
      kart(
        'Ters bağlı pil geriye iter',
        'İki 1,5 V pilden birini ters koydun: artı artıya bakıyor. Gerilimler birbirini götürür, 1,5 − 1,5 = 0 V, lamba yanmaz. Kumandada pil ters takılınca çalışmaması bundan.',
      ),
      kart(
        'Pilin kendi içinde de direnç var',
        'Pil 1,5 V yazar ama lamba takınca uçlarında 1,3 V ölçersin. Fark pilin iç direncinde harcandı. Gerçek pilin uçlarındaki gerilim, akım çekilince biraz düşer.',
      ),
      kart(
        'Pil biterken iç direnci büyür',
        'Bitmek üzere olan pil boşta 1,4 V gösterir ama cihaz takınca 0,8 V\'a düşer. Kimyasal madde tükendikçe iç direnç artar, gerilim yük altında çöker. Cihaz "pil bitti" der.',
      ),
      kart(
        'Dolu pille boş pili karıştırma',
        'Kumandaya bir yeni bir eski pil koydun: dolu pil boş pili ters yönde zorlar, ısınır, akabilir. Seri bağlı piller aynı tür ve aynı dolulukta olmalı.',
        undefined,
        { etiket: 'Dikkat' },
      ),
    ], [
      soru('Özdeş üreteçler seri bağlandığında toplam elektromotor kuvvet artar.', true, 'Gerilimler toplanıyor.'),
      soru('Özdeş üreteçler paralel bağlandığında gerilim değişmez ama piller daha uzun dayanır.', true, 'Akım kaynaklar arasında paylaşılıyor.'),
      soru('Üreteçlerin iç direnci yoktur.', false, 'Her üretecin bir iç direnci var; verdiği gerilimin bir kısmını kendi üzerinde harcıyor.'),
      soru('Farklı marka ve şarj düzeyindeki piller bir arada kullanılabilir.', false, 'Dolu pil boş pili zorlar; ısınma ve akma riski doğar.'),
      sikli('İki özdeş pil paralel bağlanınca ne kazanılır?', ['Daha uzun süre besleme', 'Daha yüksek gerilim'], 0, 'Gerilim aynı kalır, kapasite artar.'),
      sikli('Pil biterken uçlarındaki gerilimin düşmesinin sebebi?', ['İç direncin büyümesi', 'Elektronların tükenmesi'], 0, 'Kimyasal madde tükenirken iç direnç artar.'),
      soru('Ters bağlanan iki üretecin gerilimleri toplanır.', false, 'Birbirini götürür.'),
      soru('Farklı kapasitedeki piller seri bağlanmamalıdır.', true, 'Dolu pil boş pili ters yönde zorlar.'),
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
        'Zarar veren gerilim değil, geçen akım',
        'Kuşlar 10.000 V\'luk telde oturur, hiçbir şey olmaz: içlerinden akım geçmiyor. İnsanı yakan, vücuttan geçen akımın büyüklüğü ve süresi. Gerilim yalnızca akımı doğuran sebep.',
      ),
      kart(
        'Miliamperler bile yeter',
        '1 mA (amperin binde biri) karıncalanma. 10 mA\'de kaslar kasılır, el teli bırakamaz. 50 mA üstü kalbi durdurabilir. Priz 220 V; ıslak vücutta bu sınırlar kolay aşılır.',
        {
          tur: 'tablo',
          basliklar: ['Akım', 'Etki'],
          satirlar: [
            ['1 mA', 'karıncalanma'],
            ['10 mA', 'el bırakamaz'],
            ['50 mA', 'kalp durabilir'],
          ],
        },
      ),
      kart(
        'Islak el direnci düşürür, akımı büyütür',
        'Kuru derinin direnci yüksek, 220 V\'ta küçük akım geçer. Islak deride direnç onda birine iner; aynı gerilimde on kat akım. Ohm yasası: V aynı, R düşer, I artar. Banyoda priz kuralı bundan.',
      ),
      kart(
        'Sigorta kabloyu korur',
        'Bir kablodan güvenli sınırın üstünde akım geçince sigorta atar, devreyi keser. Kablo ısınmaz, yangın çıkmaz. Sigorta amperleri sayar: 16 A sigorta 16 A üstünde atar.',
      ),
      kart(
        'Kaçak akım rölesi insanı korur',
        'Röle giren ve çıkan akımı karşılaştırır: 5 A girdi, 4,97 A çıktı, 30 mA nereye gitti? İnsana. Röle bunu anında görüp keser. Sigorta o 30 mA\'yi fark etmez bile.',
      ),
      kart(
        'İkisinin işi ayrı',
        'Sigorta kabloyu, röle insanı korur. Biri ötekinin yerini tutmaz: "sigorta var, çarpılmam" demek yanlış. Evde ikisi de olmalı.',
        undefined,
        { not: 'Sigorta ile röleyi karıştırıyorsan sor: kimi koruyor? Kabloyu mu, insanı mı?' },
      ),
      kart(
        'Çoklu prize yığma',
        'Bir prize ısıtıcı, ütü ve su ısıtıcısı taktın: hepsinin akımı tek kablodan geçer, kablo ısınır. Isınan kablo ev yangınlarının en sık sebebi. Yüksek güçlü cihaz ayrı prize.',
        undefined,
        { etiket: 'Dikkat' },
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
        kart: 5,
      },
    ]),
    konu('fzk10-topraklama', 'Topraklamanın Önemi', [
      kart(
        'Gövde topraklanınca kaçak toprağa gider',
        'Çamaşır makinesinin metal gövdesi bir kabloyla toprağa bağlı. İçeride bir kablo sıyrılıp gövdeye değerse akım gövdeden bu kabloyla toprağa akar, sana değil. Buna topraklama denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Topraklama yoksa yolu sen tamamlarsın',
        'Aynı makine topraksız: gövde 220 V\'ta bekler, kimse fark etmez. Sen dokununca akım gövdeden sana, senden yere geçer. Topraklama olmayan yerde insan kablo olur.',
      ),
      kart(
        'Akım kolay yolu daha çok kullanır',
        'Akım tek bir yol seçmez, yolları dirençlerine göre paylaşır. Topraklama kablosu birkaç ohm, insan vücudu binlerce ohm. Akımın neredeyse tamamı kablodan gider; sana düşen pay zararsız.',
        undefined,
        { not: 'Topraklama akımı yok etmez; sadece senden daha kolay bir yol açar.' },
      ),
      kart(
        'Prizdeki üçüncü uç toprak hattıdır',
        'Fişin iki ucu faz ve nötr, yanlardaki metal tırnaklar toprak. Topraksız uzatma kablosu bu tırnağı taşımaz: cihaz çalışır ama koruma gider.',
      ),
      kart(
        'Metal gövdeli cihaza şart',
        'Buzdolabı, çamaşır makinesi, fırın, su ısıtıcı: gövdeleri metal, kaçak olursa gövde elektriklenir. Plastik gövdeli cihazlar (saç kurutma, şarj aleti) çift yalıtımlı: fişlerinde toprak ucu yok.',
      ),
      kart(
        'Paratoner, binanın topraklaması',
        'Çatının tepesindeki sivri çubuk kalın bir kabloyla toprağa iner. Yıldırım çubuğa düşer, kablodan toprağa gider; binaya girmez. Yıldırımı engellemez, ona kolay bir yol sunar.',
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
        'Periyodik hareket: aynı şeyi tekrar tekrar',
        'Salıncak gidip geliyor, saat sarkacı sallanıyor, tekerlek dönüyor, yaydaki ağırlık zıplıyor. Belirli sürede kendini tekrarlayan harekete periyodik hareket denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Periyot: bir turun süresi',
        'Salıncak bir gidip gelmeyi 2 saniyede tamamlıyorsa periyodu 2 s. Periyot (T) bir tam hareketin süresi, birimi saniye.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Frekans: saniyedeki tur sayısı',
        'Aynı salıncak 2 s\'de bir tur yapıyorsa saniyede yarım tur: frekans 0,5 Hz. Frekans (f) birim zamandaki tekrar sayısı, birimi hertz (Hz). T = 1/f: biri ötekinin tersi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Hesap: T = 1/f, f = 1/T',
        'Saniyede 5 kez titreşen yayın periyodu 1/5 = 0,2 s. Periyodu 4 s olan sarkacın frekansı 1/4 = 0,25 Hz. Birimleri karıştırma: frekans hertz, periyot saniye.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Salınım: denge noktasının iki yanına gidiş',
        'Sarkaç ortada dururken denge konumunda. Çekip bırakınca ortanın bir o yanına bir bu yanına geçer; buna salınım denir. Grafik zamanla uzaklığı gösterir: tepe, çukur, tepe.',
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
        'Sarkaç periyodu: ip uzunluğu ve yer çekimi',
        'Uzun ipli sarkaç yavaş, kısa ipli hızlı salınır. Ay\'da yer çekimi az: aynı sarkaç daha yavaş. Kütle listede yok: ağır ya da hafif top, periyot aynı.',
        undefined,
        { not: 'Sarkaç sorusunda kütleyi değiştiren şık çeldirici; ipe ve yer çekimine bak.' },
      ),
      kart(
        'Ne kadar açtığın periyodu değiştirmez',
        'Sarkacı az ya da biraz daha çok çekip bıraksan gidiş geliş süresi aynı. Küçük salınımlarda genlik, yani açılma miktarı, periyodu etkilemez. Sarkaçlı saatler bu yüzden doğru çalışır.',
      ),
      kart(
        'Yay sarkacında kütle etkili',
        'Yaya asılı ağırlık: ağır kütle yavaş, sert yay hızlı salınır. Periyot yayın sertliğine ve kütleye bağlı. İp sarkacının tersine kütle burada iş yapar.',
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
        kart: 6,
      },
    ]),
    konu('fzk10-dalga-kavram', 'Dalgaların Temel Kavramları', [
      kart(
        'Dalga enerjiyi taşır, maddeyi değil',
        'Denizde şamandıra: dalga geçerken inip kalkar ama kıyıya gitmez. Su yerinde kalır, giden enerjidir. Dalga: enerjinin madde taşınmadan yayılması.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Dalga boyu: iki tepe arası',
        'Tepe dalganın en yüksek, çukur en alçak noktası. Ardışık iki tepe (ya da iki çukur) arasındaki uzaklık dalga boyu; sembolü λ (lambda), birimi metre.',
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
        'Genlik: ortadan tepeye yükseklik',
        'Denge çizgisi (dalga yokken suyun düz hâli) ile tepe arası genlik. Büyük genlik büyük dalga: daha çok enerji taşır. Enerjiyi dalga boyu değil genlik belirler.',
      ),
      kart(
        'Dalgada da periyot ve frekans var',
        'Şamandıra saniyede 2 kez inip kalkıyorsa frekans 2 Hz: saniyede geçen dalga sayısı. Bir dalganın geçme süresi periyot: 0,5 s. Frekansı dalgayı yaratan kaynak belirler.',
      ),
      kart(
        'Ses: şiddeti genlik, tizliği frekans',
        'Sesi açtığında genlik büyür, ses yükselir. İnce ses (tiz) yüksek frekans, kalın ses (pes) düşük frekans. İkisi ayrı ayrı değişir: yüksek ses tiz olmak zorunda değil.',
      ),
      kart(
        'Sürat = dalga boyu × frekans',
        'Frekans 50 Hz, dalga boyu 2 m: sürat 50·2 = 100 m/s. Formül v = λ·f. Periyot verilirse önce f = 1/T ile frekansa çevir.',
      ),
      kart(
        'Frekans kaynağın, sürat ortamın',
        'Aynı hoparlör suda ve havada aynı frekansta ses üretir; ama ses suda daha hızlı gider. Ortam değişince sürat değişir, frekans değişmez; o yüzden dalga boyu değişir.',
        undefined,
        { not: 'Sürat sabitken f artarsa λ küçülür; ikisini hep v = λ·f ile birlikte düşün.' },
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
        'Mekanik dalga ortam ister',
        'Ses havada, dalga suda, titreşim yayda ilerler; her birinin bir taşıyıcısı var. Taşıyıcı ortamı olan dalgaya mekanik dalga denir. Ortam yoksa dalga yok.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Elektromanyetik dalga boşlukta da gider',
        'Güneş ışığı milyonlarca kilometre boşluğu geçip bize ulaşıyor. Işık, radyo dalgası ve röntgen ışını ortam istemez. Bunlara elektromanyetik (EM) dalga denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Uzayda patlama duyulmaz',
        'Filmlerdeki uzay patlaması gürültüsü yanlış: ses mekanik, taşıyacak hava yok. Patlamanın ışığını görürsün, sesini duymazsın.',
        undefined,
        { etiket: 'Sık hata' },
      ),
      kart(
        'Enine dalga: titreşim yayılmaya dik',
        'İpi yukarı aşağı salla: dalga ileri gider, ip yukarı aşağı titrer. Titreşim yönü ile yayılma yönü birbirine dik. Su dalgaları ve ışık enine.',
      ),
      kart(
        'Boyuna dalga: titreşim yayılmayla aynı yönde',
        'Yayı ileri geri it: sıkışmış halkalar ileri gider, halkalar da ileri geri titrer. Ses böyle: hava sıkışıp seyrelerek ilerler. Buna boyuna dalga denir.',
      ),
      kart(
        'Bir dalga iki soruya birden cevap verir',
        'Ses ortam ister (mekanik) ve ileri geri titreşir (boyuna). Işık ortam istemez (EM) ve dik titreşir (enine). İki soruyu ayrı sor: ortam gerekiyor mu, titreşim hangi yönde?',
        {
          tur: 'tablo',
          basliklar: ['Ölçüt', 'Türler', 'Örnek'],
          satirlar: [
            ['Ortam', 'Mekanik / EM', 'ses / ışık'],
            ['Titreşim yönü', 'Boyuna / Enine', 'ses / ışık'],
          ],
        },
        { not: 'Bir dalga iki sınıfa birden girer: ses hem mekanik hem boyuna. Tek cevapla yetinme.' },
      ),
      kart(
        'EM tayf: radyodan gamaya',
        'Radyo, mikrodalga, kızılötesi, görünür ışık, morötesi, X ve gama ışını. Hepsi aynı tür dalga; farkları frekans. Radyo en düşük, gama en yüksek frekans.',
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
        'Depremde önce P gelir, sonra S',
        'P dalgası boyuna ve hızlı: önce ulaşır, hafif sarsar. S dalgası enine ve yavaş: sonra gelir, asıl yıkım ondan. Aradaki süre uzunsa merkez üssü uzak.',
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
        kart: 6,
      },
    ]),
    konu('fzk10-yayilma-surati', 'Dalgaların Yayılma Süratini Etkileyen Etmenler', [
      kart(
        'Sürati ortam belirler, kaynak değil',
        'Aynı ıslığı havada da suda da çal: frekans aynı, ama ses suda dört kat hızlı gider. Daha güçlü çalmak sesi hızlandırmaz. Kaynak frekansı, ortam sürati belirler.',
      ),
      kart(
        'Ses katıda hızlı, gazda yavaş',
        'Rayı tıklat: kulağını raya dayayan, sesi havadan önce duyar. Katıda tanecikler sıkı sıkı yan yana, titreşim komşuya hemen geçer. Havada tanecikler seyrek. Sıra: katı > sıvı > gaz.',
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
        'Sıcak havada ses hızlanır',
        '0 °C\'de ses 331 m/s, 20 °C\'de 343 m/s. Sıcak havada tanecikler daha hızlı hareket eder, titreşimi daha çabuk iletir. Sıcaklık artınca sesin sürati artar.',
      ),
      kart(
        'Işıkta tam tersi: boşlukta en hızlı',
        'Işık boşlukta 300.000 km/s, camda bunun üçte ikisi kadar. Yoğun ortam ışığı yavaşlatır, sesi hızlandırır. İkisini aynı kefeye koyma.',
        undefined,
        { not: '"Yoğun ortamda hızlanır" cümlesini duyunca sor: ses mi, ışık mı? Cevap ikisinde ters.' },
      ),
      kart(
        'Derin suda dalga hızlı',
        'Kıyıya yaklaşan dalga sığ suya girince yavaşlar; arkadan gelenler ona yetişir, dalga yükselir ve devrilir. Derinde hızlı, sığda yavaş.',
      ),
      kart(
        'Gergin ve hafif yayda dalga hızlı',
        'Gitar telini akort ederken gerdikçe ses tizleşir: dalga telde daha hızlı ilerliyor. Kalın (ağır) tel daha yavaş, kalın ses verir. Gerginlik sürati artırır, kütle azaltır.',
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
        'Yansıma: dalga engele çarpıp geri döner',
        'Havuz kenarına çarpan dalga geri gelir. Geliş açısı ne kadarsa dönüş açısı o kadar; açı engele dik çizgiden (normal) ölçülür. Yansıyan dalganın sürati, dalga boyu ve frekansı değişmez.',
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
        { etiket: 'Tanım' },
      ),
      kart(
        'Kırılma: derinlik değişince yön değişir',
        'Dalga derin sudan sığ suya açıyla geçsin. Sığda yavaşlar; önce giren taraf geri kalır, dalga döner. Sürat ve dalga boyu değişir, doğrultu kırılır. Buna kırılma denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Kırılmada frekans değişmez',
        'Frekansı kaynak belirliyordu; kaynak hâlâ aynı hızla titreşiyor. Sığ suda sürat düşünce v = λ·f\'de λ da düşer. Değişen sürat ve dalga boyu; değişmeyen frekans.',
        {
          tur: 'tablo',
          basliklar: ['Büyüklük', 'Kırılmada'],
          satirlar: [
            ['Frekans', 'değişmez'],
            ['Sürat', 'değişir'],
            ['Dalga boyu', 'değişir'],
          ],
        },
        { not: 'Kırılma sorusu hep "hangisi değişmez" diye gelir; ezberleme, kaynağı düşün: frekans.' },
      ),
      kart(
        'Yavaşlayan dalga normale yaklaşır',
        'Normal, sınıra dik çizgi. Derinden sığa geçen dalga yavaşlar ve normale yaklaşır: açı küçülür. Sığdan derine geçen hızlanır, normalden uzaklaşır: açı büyür.',
      ),
      kart(
        'Dik gelen dalga dönmez',
        'Dalga sınıra tam dik gelirse iki tarafı aynı anda yavaşlar; dönmesi için sebep yok. Doğrultu aynı kalır, yalnızca sürat ve dalga boyu değişir.',
      ),
      kart(
        'Dalgalar kıyıya neden paralel vurur',
        'Açıkta dalgalar kıyıya açılı gelir. Kıyıya yaklaştıkça su sığlaşır; dalga yavaşlayıp normale yaklaşır. Sonuç: dalgalar kıyıya neredeyse paralel vurur. Kırılmanın gözle görülür hâli.',
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
        'Her cismin kendi frekansı var',
        'Bardağa vur: hep aynı notada tınlar. Salıncağı bırak: hep aynı sürede gidip gelir. Cismin kendiliğinden titreştiği frekansa doğal frekans denir.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Doğru anda itersen az kuvvet yeter',
        'Salıncağı tam sana geri geldiği anda hafifçe it: her seferinde biraz daha yükselir. Yanlış anda itersen salınım söner. İtme frekansı salıncağın doğal frekansına eşitse genlik hızla büyür.',
      ),
      kart(
        'Buna rezonans denir',
        'Dış etkinin frekansı cismin doğal frekansına eşitse genlik büyür: rezonans. Küçük kuvvet, büyük salınım. Opera sanatçısının bardağı sesle kırması bu: sesin frekansı bardağınkine denk geldi.',
        undefined,
        { etiket: 'Tanım' },
      ),
      kart(
        'Deprem binayı rezonansa sokabilir',
        'Sarsıntının frekansı binanın doğal frekansına yakınsa bina her sarsıntıda biraz daha çok sallanır. Salıncak gibi. Hasar bu yüzden bazı binalarda çok, yanındakinde az.',
      ),
      kart(
        'Alçak bina hızlı, yüksek bina yavaş sallanır',
        'Kısa cetveli masadan sarkıtıp titret: hızlı titrer. Uzunu: yavaş. Alçak binanın doğal frekansı yüksek, yüksek binanınki düşük. Aynı deprem, frekansına göre farklı boydaki binayı zorlar.',
      ),
      kart(
        'Binayı rezonanstan çıkarmak',
        'Binanın doğal frekansı sarsıntıdan uzaklaştırılır. Ya da sönümleyici konur: salınımı emen bir ağırlık. Ya da taban yalıtımı: bina yaylı yastıklar üstüne oturur, sarsıntı ona geçmez.',
      ),
      kart(
        'Odak yerin altında, merkez üssü yüzeyde',
        'Kırılma yerin 10 km altında oldu: orası odak. Tam üstündeki yeryüzü noktası merkez üssü. Haberde "merkez üssü Elazığ" derken yüzeydeki noktadan söz edilir.',
      ),
      kart(
        'Büyüklük tek sayı, şiddet yere göre',
        '"7,4 büyüklüğünde deprem": açığa çıkan enerji, aletle ölçülür, tek sayı. Şiddet ise hissedilen etki: merkez üssünde yıkıcı, 300 km ötede hafif sarsıntı.',
        {
          tur: 'tablo',
          basliklar: ['Büyüklük', 'Şiddet'],
          satirlar: [
            ['Ölçülür', 'Gözlenir'],
            ['Tektir', 'Yere göre değişir'],
            ['Enerji', 'Etki'],
          ],
        },
        { not: 'Haberde "şiddetinde deprem" duyarsan düzelt: tek sayıyla verilen büyüklüktür.' },
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
        kart: 3,
      },
    ]),
  ]),
])
