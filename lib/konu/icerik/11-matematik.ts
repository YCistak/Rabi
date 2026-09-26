import { kart, konu, program, tema } from '../tip'

/**
 * 11. sınıf Matematik — Maarif Modeli.
 *
 * Beş tema: İstatistiksel Araştırma Süreci, Geometrik Şekiller ve üç parçalı
 * Nicelikler ve Değişimler (trigonometrik, üstel-logaritmik fonksiyonlar,
 * fonksiyon işlemleri). Program üçüncü temayı üç ayrı sayfada "(1), (2), (3)"
 * diye veriyor; haritada üç aynı ad yan yana okunmuyordu, o yüzden adın
 * yanına parçanın konusu yazıldı. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski (2018) programdan taşınmayanlar: toplam-fark ve yarım açı formülleri,
 * diziler, ikinci dereceden denklem sistemleri, çemberin analitiği. Bu
 * programda 11. sınıfın trigonometrisi fonksiyon olarak işleniyor: birim
 * çember, grafik, periyot, dönüşüm ve denklem.
 *
 * Sorular (turuncu kitaplar) henüz yazılmadı; destelerin ortasındaki hızlı
 * kontroller var.
 */
export const matematik11 = program('matematik', 11, 'Veriden çokgenlere, sinüsten logaritmaya', [
  tema('mat11-t1', 'İstatistiksel Araştırma Süreci', [
    konu('mat11-iki-nicel', 'İki Nicel Değişkenli Veriler', [
      kart(
        'İki nicel değişken',
        'Aynı bireylerden ölçülen iki sayısal özellik birlikte incelenir.\n- Çalışma süresi ve deneme neti\n- Aracın hızı ve fren mesafesi\n- Şehrin rakımı ve ortalama sıcaklığı\nAmaç: biri değişirken ötekinin nasıl değiştiğini görmek.',
      ),
      kart(
        'Araştırmanın dört adımı',
        '- **Soru:** "Uyku süresi ile dikkat puanı ilişkili mi?"\n- **Veri:** her kişiden iki ölçüm, yani sıralı ikili (x, y)\n- **Analiz:** tablo, serpme diyagramı, korelasyon\n- **Yorum:** sonuç sorunun bağlamına dönülerek söylenir',
      ),
      kart(
        'Serpme diyagramı',
        'Her birey düzlemde bir (x, y) noktasıdır.\n- **Yatay eksen:** açıklayan değişken (çalışma süresi)\n- **Dikey eksen:** açıklanan değişken (net)\nNoktaların oluşturduğu bulut ilişkinin resmidir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 10],
          eksenler: true,
          xAd: 'çalışma (saat)',
          yAd: 'net',
          noktalar: [
            { x: 1, y: 2 },
            { x: 2, y: 2.8 },
            { x: 3, y: 3.5 },
            { x: 4, y: 3.9 },
            { x: 5, y: 5.4 },
            { x: 6, y: 5.9 },
            { x: 7, y: 7.2 },
            { x: 8, y: 7.4 },
            { x: 9, y: 8.8 },
          ],
        },
      ),
      kart(
        'İlişkinin yönü',
        '- **Pozitif:** x arttıkça y de artma eğiliminde (boy–kilo)\n- **Negatif:** x arttıkça y azalma eğiliminde (aracın yaşı–fiyatı)\n- **İlişkisiz:** bulut belirli bir yöne gitmiyor (boy–matematik notu)',
      ),
      kart(
        'İlişkinin biçimi',
        '- **Doğrusal:** noktalar bir doğrunun çevresinde toplanır.\n- **Doğrusal olmayan:** noktalar bir eğri çizer, ör. önce artıp sonra azalır.\nKorelasyon katsayısı yalnızca **doğrusal** ilişkiyi ölçer.',
      ),
      kart(
        'İlişkinin gücü',
        'Noktalar bir doğruya ne kadar yakınsa ilişki o kadar **güçlüdür**.\n- **Dar ve uzun bulut:** güçlü ilişki\n- **Geniş, yuvarlağa yakın bulut:** zayıf ilişki\nGüç, doğrunun eğimiyle değil dağılmayla ilgilidir.',
      ),
      kart(
        'Bölgelere göre sayım',
        'x̄ ve ȳ doğruları düzlemi dört bölgeye ayırır.\n- **I ve III. bölgede çok nokta:** pozitif ilişki\n- **II ve IV. bölgede çok nokta:** negatif ilişki\n- **Dağılım denk:** belirgin ilişki yok',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 10],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [5, 0],
                [5, 10],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
            {
              noktalar: [
                [0, 5],
                [10, 5],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          noktalar: [
            { x: 1.5, y: 2 },
            { x: 2.5, y: 3.5 },
            { x: 3.5, y: 2.5 },
            { x: 4, y: 6 },
            { x: 6, y: 4 },
            { x: 6.5, y: 7 },
            { x: 7.5, y: 6.2 },
            { x: 8.5, y: 8.5 },
          ],
          etiketler: [
            { x: 8.8, y: 9.4, ad: 'I' },
            { x: 1, y: 9.4, ad: 'II' },
            { x: 1, y: 0.7, ad: 'III' },
            { x: 8.8, y: 0.7, ad: 'IV' },
          ],
        },
      ),
      kart(
        'Sayım oranı',
        '**Oran = (I. ve III. bölgedeki nokta sayısı) / (toplam nokta)**\n- **1’e yakın:** belirgin pozitif ilişki\n- **0’a yakın:** belirgin negatif ilişki\n- **0,5 civarı:** ilişki yok\n20 noktanın 16’sı I ve III’te → 0,8, pozitif.',
      ),
      kart(
        'Korelasyon katsayısı r',
        'Doğrusal ilişkinin yönünü ve gücünü tek sayıyla verir.\n**−1 ≤ r ≤ 1**\n- **r > 0:** pozitif ilişki\n- **r < 0:** negatif ilişki\n- **r ≈ 0:** doğrusal ilişki yok',
      ),
      kart(
        'r’yi yorumlamak',
        'Gücü |r| söyler, işaret yalnızca yönü söyler.\nr = −0,9 ilişkisi, r = 0,6 ilişkisinden **daha güçlüdür**.',
        {
          tur: 'tablo',
          basliklar: ['|r| aralığı', 'İlişki'],
          satirlar: [
            ['0,7 – 1', 'Güçlü'],
            ['0,3 – 0,7', 'Orta'],
            ['0 – 0,3', 'Zayıf ya da yok'],
          ],
        },
      ),
      kart(
        'r nasıl hesaplanır?',
        '**r = Σ(x − x̄)(y − ȳ) / √[Σ(x − x̄)² · Σ(y − ȳ)²]**\n- İki değişkenin ortalamasını bul.\n- Her bireyin iki sapmasını çarpıp topla.\n- Sapma kareleri toplamlarının çarpımının köküne böl.',
      ),
      kart(
        'Çözümlü örnek',
        'Veri: (1, 2), (2, 4), (3, 6) → x̄ = 2, ȳ = 4\n- **x sapmaları:** −1, 0, 1\n- **y sapmaları:** −2, 0, 2\n- **Hesap:** Σ çarpım = 4, Σx² = 2, Σy² = 8\nr = 4 / √16 = 1: noktalar tam bir doğru üstünde.',
      ),
      kart(
        'r’nin birimi yok',
        'r birimsiz bir sayıdır.\n- Boyu cm yerine m ile ölçmek r’yi değiştirmez.\n- Her değere aynı sayıyı eklemek r’yi değiştirmez.\n- x ile y’nin yerini değiştirmek r’yi değiştirmez.',
      ),
      kart(
        'Korelasyon neden değildir',
        'Birlikte değişmek, birinin ötekine yol açtığını göstermez.\nDondurma satışı ile boğulma vakaları birlikte artar; ortak sebep **yaz sıcağıdır**.\nBu ortak sebebe **karıştırıcı değişken** denir.',
        undefined,
        { not: 'Güçlü r "biri ötekini etkiler" demek değil. Neden-sonuç ilişkisini ancak kontrollü deney gösterir.' },
      ),
      kart(
        'Uç değerin etkisi',
        'Tek bir aykırı nokta r’yi büyük ölçüde değiştirebilir.\n- İlişkisiz buluta uzakta tek nokta eklemek r’yi şişirebilir.\n- Güçlü ilişkide ters köşedeki tek nokta r’yi düşürebilir.\nÖnce diyagrama bak, sonra sayıya güven.',
      ),
    ], [], [
      {
        soru: 'Aracın yaşı arttıkça fiyatı düşüyorsa ilişki nasıldır?',
        siklar: ['Negatif', 'Pozitif'],
        dogru: 0,
        aciklama: {
          dogru: 'Biri artarken öteki azalıyor: negatif ilişki, r sıfırdan küçük.',
          yanlis: 'Pozitif ilişkide ikisi birlikte artar. Burada yaş artarken fiyat düşüyor; bu negatif ilişki.',
        },
        kart: 4,
      },
      {
        soru: 'Hangi ilişki daha güçlüdür?',
        siklar: ['r = 0,6', 'r = −0,9'],
        dogru: 1,
        aciklama: {
          dogru: 'Güç |r| ile ölçülür: |−0,9| = 0,9 > 0,6. Eksi işareti yalnızca yönü söyler.',
          yanlis: 'İşarete bakıp karar verme; güç |r| ile ölçülür ve |−0,9| = 0,9 daha büyük.',
        },
        kart: 10,
      },
    ]),
    konu('mat11-hazir-veri', 'Hazır Nicel Verileri İnceleme', [
      kart(
        'Neden eleştirel okuma?',
        'Haberde, reklamda, raporda başkalarının kurduğu grafikler ve yorumlar karşına çıkar.\nİstatistiksel okuryazarlık, bu sonuçların **veriyle desteklenip desteklenmediğini** sormaktır.',
      ),
      kart(
        'Sorulacak beş soru',
        '- Veri kimden, nasıl toplandı?\n- Örneklem yeterince büyük mü?\n- Grafik doğru ölçekli mi?\n- İlişkiden neden-sonuç mu çıkarılıyor?\n- Sonuç verinin aralığının dışına mı taşıyor?',
      ),
      kart(
        'Örneklem yanlılığı',
        'Örneklem evreni temsil etmiyorsa sonuç genellenemez.\n- Yalnızca spor salonunda yapılan anket, halkın egzersiz alışkanlığını ölçmez.\n- Gönüllü katılımlı anketlerde güçlü görüşü olanlar fazla yer alır.',
      ),
      kart(
        'Örneklem büyüklüğü',
        '8 kişilik bir veride tek kişi r’yi büyük ölçüde oynatır.\nKüçük örneklemde güçlü görünen ilişki şans eseri olabilir.\nGüvenilir yorum için örneklem büyüdükçe ilişki korunmalıdır.',
      ),
      kart(
        'Kesilmiş eksen',
        'Dikey eksen 0’dan değil 95’ten başlarsa küçük fark dev bir fark gibi görünür.\n- Önce eksenin başladığı değere bak.\n- Farkı yüzde ya da gerçek sayı olarak kendin hesapla.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 95, 100],
          eksenler: true,
          xAd: 'ay',
          yAd: 'puan',
          egriler: [
            {
              noktalar: [
                [1, 96],
                [5, 97.5],
                [9, 99],
              ],
              kirik: true,
            },
          ],
          etiketler: [{ x: 5, y: 95.6, ad: 'fark yalnızca 3 puan', renk: 'ikincil' }],
        },
      ),
      kart(
        'Ölçek ve grafik türü',
        '- **İki farklı ölçekli dikey eksen:** iki çizgi olmayan bir ilişkiyi varmış gibi gösterebilir.\n- **Eşit olmayan aralıklar:** eğimi yapay biçimde değiştirir.\n- **Üç boyutlu grafik:** öndeki dilimi büyük gösterir.',
      ),
      kart(
        'Korelasyondan nedensellik',
        '"Kahvaltı yapan öğrencilerin notları yüksek, o hâlde kahvaltı notu yükseltir."\nBu yorum eksik: düzenli uyku, aile ilgisi gibi **karıştırıcı değişkenler** ikisini birden etkileyebilir.',
      ),
      kart(
        'Ters nedensellik',
        'İlişki doğru olsa bile yön ters olabilir.\n"Hastanede uzun kalanların durumu kötü" iddiasında sebep hastane değildir.\nAğır hastalık uzun kalışa yol açar; ok ters yöndedir.',
      ),
      kart(
        'Verinin dışına taşma',
        'İlişki yalnızca ölçülen aralıkta geçerlidir.\n- 1–6 saat çalışma verisinden "20 saat çalışan 200 net yapar" denemez.\n- Bu hataya **ekstrapolasyon** denir.',
        undefined,
        { not: 'Yorumdaki sayının verinin aralığında olup olmadığına bak; dışındaysa sonuç güvenilmez.' },
      ),
      kart(
        'Gizlenen veri ve seçici sunum',
        '- Yalnızca ilişkiyi destekleyen aylar gösterilmiş olabilir.\n- Uç değerler gerekçesiz atılmış olabilir.\n- Toplam yerine yalnızca yüzde verilip taban gizlenmiş olabilir.',
      ),
      kart(
        'Yüzde tuzağı',
        '"Suç oranı %100 arttı" → 2 olaydan 4 olaya da çıkmış olabilir.\nYüzde değişim yorumlanırken **başlangıç sayısı** mutlaka sorulmalıdır.',
      ),
      kart(
        'Grup birleşince tersine dönme',
        'Her alt grupta pozitif olan ilişki, gruplar birleşince negatif görünebilir.\nBu duruma **Simpson paradoksu** denir.\nYorumdan önce verinin alt gruplara göre de incelenmesi gerekir.',
      ),
      kart(
        'Yorumu değerlendirme',
        'Bir iddiayı değerlendirirken üç karar ver:\n- **Destekleniyor:** veri, grafik ve yöntem sonucu taşıyor.\n- **Kısmen:** ilişki var ama neden-sonuç iddiası fazla.\n- **Desteklenmiyor:** veri ya da grafik yanıltıcı.',
      ),
    ], [], [
      {
        soru: 'Dikey eksen 95’ten başlıyorsa fark nasıl görünür?',
        siklar: ['Olduğundan büyük', 'Olduğundan küçük'],
        dogru: 0,
        aciklama: {
          dogru: 'Eksen kesilince 3 puanlık fark tüm grafiği kaplar ve dev görünür.',
          yanlis: 'Kesilmiş eksen farkı büyütür: 95–100 arası tüm yüksekliğe yayılınca küçük fark dev görünür.',
        },
        kart: 5,
      },
      {
        soru: '1–6 saatlik veriden 20 saatlik tahmin yapmaya ne denir?',
        siklar: ['Örneklem yanlılığı', 'Ekstrapolasyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Verinin aralığının dışına taşmak ekstrapolasyondur; ilişki orada sürmeyebilir.',
          yanlis: 'Örneklem yanlılığı verinin kimden toplandığıyla ilgili. Aralığın dışına taşmak ekstrapolasyondur.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('mat11-t2', 'Geometrik Şekiller', [
    konu('mat11-dortgen', 'Dörtgenlerin Özellikleri', [
      kart(
        'Dörtgen nedir?',
        'Herhangi üçü doğrusal olmayan dört noktayı sırayla birleştiren kapalı şekildir.\n- 4 kenar, 4 köşe, 4 iç açı\n- 2 köşegen: komşu olmayan köşeleri birleştirir',
      ),
      kart(
        'İç ve dış açılar',
        'Bir köşegen dörtgeni iki üçgene ayırır.\n- **İç açılar toplamı:** 2 · 180° = 360°\n- **Dış açılar toplamı:** 360°\n- **Bir köşede:** iç açı + dış açı = 180°',
      ),
      kart(
        'Dışbükey ve içbükey dörtgen',
        '- **Dışbükey:** bütün iç açılar 180°’den küçük, iki köşegen de içeride kesişir.\n- **İçbükey:** bir iç açı 180°’den büyük, bir köşegen şeklin dışında kalır.\nÖzel dörtgenlerin hepsi dışbükeydir.',
      ),
      kart(
        'Köşegenlerle alan',
        'Köşegenler e ve f, aralarındaki açı θ ise:\n**A = ½ · e · f · sin θ**\nKöşegenler dikse sin 90° = 1 → **A = e · f / 2**\nÖrnek: dik köşegenler 6 ve 8 → A = 24',
        undefined,
        { not: 'e · f / 2 yalnızca köşegenler dikken geçerli. Dik değilse sin θ çarpanını unutma.' },
      ),
      kart(
        'Kenar orta noktaları',
        'Herhangi bir dörtgenin kenar orta noktaları birleştirilirse **paralelkenar** oluşur.\n- Kenarları köşegenlere paraleldir.\n- Çevresi köşegenlerin toplamına (e + f) eşittir.\n- Alanı dörtgenin alanının yarısıdır.',
      ),
      kart(
        'Yamuk',
        'En az bir çift karşılıklı kenarı paralel olan dörtgendir; paralel kenarlara **taban** denir.\n- **Yan kenar açıları:** aynı yan kenara komşu iki açının toplamı 180°\n- **Orta taban:** (a + c) / 2, tabanlara paralel\n- **Alan:** (a + c) / 2 · h',
        {
          tur: 'koordinat',
          pencere: [-0.5, 8.5, -0.8, 4.5],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [8, 0],
                [5.5, 4],
                [1.5, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [0.75, 2],
                [6.75, 2],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'orta taban',
            },
          ],
          etiketler: [
            { x: 4, y: -0.5, ad: 'a' },
            { x: 3.5, y: 4.3, ad: 'c' },
          ],
        },
      ),
      kart(
        'İkizkenar ve dik yamuk',
        '- **İkizkenar yamuk:** yan kenarlar eşit, taban açıları eşit, köşegenler eşit, tek simetri ekseni var.\n- **Dik yamuk:** bir yan kenar tabanlara diktir ve yüksekliğe eşittir.',
      ),
      kart(
        'Paralelkenar',
        'Karşılıklı kenarları paralel olan dörtgendir.\n- **Kenarlar:** karşılıklılar paralel ve eşit\n- **Açılar:** karşı açılar eşit, komşuların toplamı 180°\n- **Köşegenler:** birbirini ortalar\n- **Alan:** a · h = a · b · sin α',
      ),
      kart(
        'Paralelkenarda alan bölme',
        '- İki köşegen paralelkenarı **dört eş alanlı** üçgene böler.\n- İçteki herhangi bir noktayı köşelere birleştir: karşılıklı iki üçgenin alanları toplamı, alanın yarısıdır.\nSimetri ekseni yoktur, 180° dönme simetrisi vardır.',
      ),
      kart(
        'Eşkenar dörtgen',
        'Dört kenarı eşit olan paralelkenardır.\n- **Köşegenler:** birbirini dik ortalar, köşe açılarını ikiye böler\n- **Alan:** e · f / 2 = a² · sin α\n- **Simetri:** köşegenleri 2 simetri eksenidir',
      ),
      kart(
        'Dikdörtgen',
        'Bütün açıları 90° olan paralelkenardır.\n- **Köşegenler:** eşit, birbirini ortalar, e = √(a² + b²)\n- **Alan:** a · b\n- **Simetri:** kenar orta dikmeleri, 2 eksen\nKöşegenlerin kesişimi çevrel çemberin merkezidir.',
      ),
      kart(
        'Kare',
        'Hem dikdörtgen hem eşkenar dörtgen olan dörtgendir.\n- **Köşegenler:** a√2; eşit, dik ve birbirini ortalar\n- **Alan:** a² = e² / 2\n- **Simetri:** 4 eksen ve 90° dönme simetrisi',
      ),
      kart(
        'Deltoid',
        'İki çift **komşu** kenarı eşit olan dörtgendir.\n- **Köşegenler:** dik; simetri ekseni olan ötekini ortalar\n- **Açılar:** farklı kenarların arasındaki iki açı eşit\n- **Alan:** e · f / 2; tek simetri ekseni var',
      ),
      kart(
        'Köşegenlerin özeti',
        'Bir dörtgeni tanımanın en hızlı yolu köşegenlerine bakmaktır.',
        {
          tur: 'tablo',
          basliklar: ['Dörtgen', 'Köşegenler'],
          satirlar: [
            ['Paralelkenar', 'Birbirini ortalar'],
            ['Dikdörtgen', 'Ortalar ve eşittir'],
            ['Eşkenar dörtgen', 'Ortalar ve diktir'],
            ['Kare', 'Ortalar, eşit ve dik'],
            ['İkizkenar yamuk', 'Eşittir'],
            ['Deltoid', 'Dik; biri ötekini ortalar'],
          ],
        },
      ),
    ], [], [
      {
        soru: 'Köşegenleri 10 ve 12 olan, köşegenleri dik dörtgenin alanı kaçtır?',
        siklar: ['120', '60'],
        dogru: 1,
        aciklama: {
          dogru: 'Köşegenler dik: A = e · f / 2 = 10 · 12 / 2 = 60.',
          yanlis: 'Köşegenlerin çarpımı alanın iki katıdır; ikiye bölmeyi unutma: 120 / 2 = 60.',
        },
        kart: 4,
      },
      {
        soru: 'Köşegenleri birbirini dik ortalayan paralelkenar hangisidir?',
        siklar: ['Eşkenar dörtgen', 'Dikdörtgen'],
        dogru: 0,
        aciklama: {
          dogru: 'Eşkenar dörtgende köşegenler birbirini dik ortalar ve açıortaydır.',
          yanlis: 'Dikdörtgende köşegenler eşittir ama dik değildir. Dik ortalayan köşegenler eşkenar dörtgenin özelliği.',
        },
        kart: 10,
      },
    ]),
    konu('mat11-ozel-dortgen', 'Özel Dörtgenler Arasındaki İlişkiler', [
      kart(
        'Dörtgenlerin soy ağacı',
        'Yamuk en az bir çift paralel kenar ister; bu tanımla **her paralelkenar bir yamuktur**.\nAşağı inildikçe koşul eklenir, küme daralır.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Dörtgen' },
            { ad: 'Yamuk', alt: '1 çift paralel kenar' },
            { ad: 'Paralelkenar', alt: '2 çift paralel kenar' },
            { ad: 'Dikdörtgen', alt: '+ açılar 90°' },
            { ad: 'Kare', alt: '+ kenarlar eşit' },
          ],
        },
      ),
      kart(
        'Kare bir kesişimdir',
        'Kare hem dikdörtgenin hem eşkenar dörtgenin bütün özelliklerini taşır.\nİki kümenin **kesişimidir**: iki satırda da "evet" diyen tek dörtgen.',
        {
          tur: 'tablo',
          basliklar: ['Koşul', 'Dikdörtgen', 'Eşkenar dörtgen'],
          satirlar: [
            ['Açılar 90°', 'Evet', 'Değil'],
            ['Kenarlar eşit', 'Değil', 'Evet'],
            ['Köşegenler', 'Eşit', 'Dik'],
          ],
        },
      ),
      kart(
        'Deltoid kolu',
        '- **Eşkenar dörtgen** hem paralelkenar hem deltoiddir.\n- **Kare** de deltoidin özel bir hâlidir.\n- **Deltoid** genel olarak yamuk değildir: paralel kenarı yoktur.',
      ),
      kart(
        '"Her … bir … mıdır?"',
        '- **Doğru:** her kare bir dikdörtgendir.\n- **Doğru:** her eşkenar dörtgen bir paralelkenardır.\n- **Yanlış:** her dikdörtgen bir karedir.\n- **Yanlış:** her yamuk bir paralelkenardır.',
      ),
      kart(
        'Özellikler aşağı iner',
        'Üst kümenin her özelliği alt kümede de geçerlidir.\nParalelkenarın köşegenleri birbirini ortalar → dikdörtgende, eşkenar dörtgende ve karede de ortalar.\nTersi geçerli değildir: karenin her özelliği dikdörtgende yoktur.',
      ),
      kart(
        'Paralelkenar olma koşulları',
        'Aşağıdakilerden **biri** yeterlidir:\n- Karşılıklı kenarlar paralel\n- Karşılıklı kenarlar eşit\n- Bir çift karşılıklı kenar hem eşit hem paralel\n- Karşı açılar eşit\n- Köşegenler birbirini ortalar',
      ),
      kart(
        'Dikdörtgene geçiş',
        'Bir paralelkenar şu koşullardan biriyle dikdörtgen olur:\n- Bir açısı 90°\n- Köşegenleri eşit\nParalelkenarda bir açı 90° ise ötekiler de 90° olmak zorundadır.',
      ),
      kart(
        'Eşkenar dörtgene geçiş',
        'Bir paralelkenar şu koşullardan biriyle eşkenar dörtgen olur:\n- İki komşu kenarı eşit\n- Köşegenleri dik\n- Bir köşegeni açıortay',
      ),
      kart(
        'Kareye geçiş',
        '- **Dikdörtgen + köşegenler dik:** kare\n- **Dikdörtgen + komşu kenarlar eşit:** kare\n- **Eşkenar dörtgen + bir açı 90°:** kare\n- **Eşkenar dörtgen + köşegenler eşit:** kare',
      ),
      kart(
        'Yalnızca köşegenlerden',
        'Köşegenler hakkında bilgi verildiyse sırayla sor: ortalıyor mu, eşit mi, dik mi?',
        {
          tur: 'tablo',
          basliklar: ['Köşegenler', 'Dörtgen'],
          satirlar: [
            ['Birbirini ortalar', 'Paralelkenar'],
            ['Ortalar + eşit', 'Dikdörtgen'],
            ['Ortalar + dik', 'Eşkenar dörtgen'],
            ['Ortalar + eşit + dik', 'Kare'],
            ['Dik, biri ötekini ortalar', 'Deltoid'],
          ],
        },
      ),
      kart(
        'Simetri eksenleriyle ilişki',
        '- **Kare:** 4 eksen\n- **Dikdörtgen ve eşkenar dörtgen:** 2 eksen\n- **İkizkenar yamuk ve deltoid:** 1 eksen\n- **Paralelkenar:** eksen yok, 180° dönme simetrisi var\nKoşul arttıkça simetri artar.',
      ),
      kart(
        'Karşı örnekle çürütme',
        'Bir genellemeyi çürütmek için tek bir karşı örnek yeter.\n- "Köşegenleri eşit dörtgen dikdörtgendir" → **ikizkenar yamuk** çürütür.\n- "Köşegenleri dik dörtgen eşkenar dörtgendir" → **deltoid** çürütür.',
        undefined,
        { not: 'Koşulun tamamını oku: "birbirini ortalayan ve eşit köşegen" dikdörtgen verir, yalnızca "eşit" vermez.' },
      ),
      kart(
        'Gerekli ve yeterli',
        '- Kare olmak, dikdörtgen olmak için **yeterlidir** ama gerekli değildir.\n- Dikdörtgen olmak, kare olmak için **gereklidir** ama yeterli değildir.\n- Paralelkenar + dik köşegenler, eşkenar dörtgen için hem gerekli hem yeterlidir.',
      ),
    ], [], [
      {
        soru: 'Köşegenleri eşit olan her dörtgen dikdörtgen midir?',
        siklar: ['Evet', 'Hayır, ikizkenar yamuk da olur'],
        dogru: 1,
        aciklama: {
          dogru: 'İkizkenar yamuğun köşegenleri eşittir ama dikdörtgen değildir. Köşegenlerin ortalaması da gerekir.',
          yanlis: 'İkizkenar yamuk karşı örnektir: köşegenleri eşit ama birbirini ortalamaz, dikdörtgen değildir.',
        },
        kart: 12,
      },
      {
        soru: 'Hangi ifade her zaman doğrudur?',
        siklar: ['Her kare bir dikdörtgendir', 'Her dikdörtgen bir karedir'],
        dogru: 0,
        aciklama: {
          dogru: 'Kare, dikdörtgenin bütün koşullarını taşır; ayrıca kenarları eşittir.',
          yanlis: 'Kenarları 3 ve 5 olan dikdörtgen kare değildir. Ters yön doğru: her kare bir dikdörtgendir.',
        },
        kart: 4,
      },
    ]),
    konu('mat11-cokgen-sinif', 'Çokgenlerin Sınıflandırılması', [
      kart(
        'Çokgen nedir?',
        'Doğru parçalarının uç uca eklenmesiyle oluşan, **kendini kesmeyen kapalı** şekildir.\n- Doğru parçaları kenar, uç noktalar köşedir.\n- En az 3 kenar gerekir.\n- Kenar sayısı köşe ve iç açı sayısına eşittir.',
      ),
      kart(
        'Çokgen olmayanlar',
        '- **Açık şekil:** bir ucu kapanmamış çizgi\n- **Eğri kenarlı şekil:** çember, elips\n- **Kendini kesen şekil:** kenarları çapraz geçen kapalı çizgi\nArdışık üç köşe doğrusal ise ortadaki köşe sayılmaz.',
      ),
      kart(
        'Kenar sayısına göre adlar',
        'Çokgenler önce kenar sayısıyla adlandırılır; n kenarlıya n-gen denir.',
        {
          tur: 'tablo',
          basliklar: ['Kenar', 'Ad'],
          satirlar: [
            ['3', 'Üçgen'],
            ['4', 'Dörtgen'],
            ['5', 'Beşgen'],
            ['6', 'Altıgen'],
            ['8', 'Sekizgen'],
            ['10', 'Ongen'],
          ],
        },
      ),
      kart(
        'Dışbükey çokgen',
        '- Her iç açısı 180°’den küçüktür.\n- Bütün köşegenleri çokgenin içindedir.\n- İçteki iki noktayı birleştiren parça dışarı taşmaz.\nİçe doğru "girintisi" olmayan çokgendir.',
      ),
      kart(
        'İçbükey çokgen',
        'En az bir iç açısı 180°’den büyüktür; bu köşede içe doğru bir girinti vardır.\nEn az bir köşegeni çokgenin dışında kalır.',
        {
          tur: 'koordinat',
          pencere: [-0.5, 4.5, -0.5, 4.8],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 0],
                [4, 4],
                [2, 1.6],
                [0, 4],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [0, 4],
                [4, 4],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2, y: 1.1, ad: 'iç açı > 180°' },
            { x: 2, y: 4.45, ad: 'dışarıdaki köşegen', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Dört ölçüt',
        '- **Açı:** 180°’den büyük iç açı var mı?\n- **Köşegen:** dışarıda kalan köşegen var mı?\n- **Kenar uzantısı:** bir kenarın uzantısı çokgeni ikiye bölüyor mu?\n- **Parça:** iki iç noktayı birleştiren parça dışarı taşıyor mu?\nBirine "evet" diyen içbükeydir.',
      ),
      kart(
        'Kenar uzantısı ölçütü',
        'Dışbükey çokgende her kenarın uzantısı, çokgenin tamamını doğrunun **bir yanında** bırakır.\nİçbükeyde girintiye komşu kenarın uzantısı çokgenin içinden geçer.',
      ),
      kart(
        'Her üçgen dışbükeydir',
        'Üçgenin iç açılar toplamı 180° olduğu için hiçbir açısı 180°’yi aşamaz.\nİçbükeylik en az **dörtgende** başlar: ok ucu biçimli dörtgen içbükeydir.',
      ),
      kart(
        'Düzgün çokgen',
        'Bütün kenarları eşit **ve** bütün açıları eşit çokgendir.\n- Eşkenar dörtgen: kenarlar eşit, açılar değil → düzgün değil\n- Dikdörtgen: açılar eşit, kenarlar değil → düzgün değil\n- Kare: ikisi de eşit → düzgün',
        undefined,
        { not: '"Düzgün" için iki koşul birden gerekir; yalnızca kenarları eşit olan çokgen düzgün değildir.' },
      ),
      kart(
        'Düzgün çokgen dışbükeydir',
        'Düzgün n-genin bir iç açısı (n − 2) · 180° / n’dir ve bu değer hep 180°’den küçüktür.\nBu yüzden her düzgün çokgen dışbükeydir.',
      ),
      kart(
        'Sınıflandırma şeması',
        'Sınıflandırma iç içe kümelerle yapılır: her düzgün çokgen dışbükeydir, her dışbükey çokgen çokgendir.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Çokgenler' },
            { ad: 'Dışbükey çokgenler', alt: 'iç açılar < 180°' },
            { ad: 'Düzgün çokgenler', alt: 'kenar ve açılar eşit' },
          ],
        },
      ),
      kart(
        'Etiketleme örnekleri',
        '- **Dur levhası:** düzgün sekizgen, dışbükey\n- **Bal peteği gözü:** düzgün altıgen, dışbükey\n- **L harfi biçimli oda:** altıgen, içbükey\n- **Ok ucu:** dörtgen, içbükey',
      ),
    ], [], [
      {
        soru: 'Bir köşegeni dışarıda kalan çokgen nasıldır?',
        siklar: ['Dışbükey', 'İçbükey'],
        dogru: 1,
        aciklama: {
          dogru: 'Dışarıda kalan köşegen, içe doğru bir girinti ve 180°’den büyük bir iç açı demektir.',
          yanlis: 'Dışbükey çokgende bütün köşegenler içeridedir. Dışarıda köşegen varsa çokgen içbükeydir.',
        },
        kart: 5,
      },
      {
        soru: 'Eşkenar dörtgen düzgün çokgen midir?',
        siklar: ['Hayır, açıları eşit değil', 'Evet, kenarları eşit'],
        dogru: 0,
        aciklama: {
          dogru: 'Düzgün çokgen için kenarlar da açılar da eşit olmalı; eşkenar dörtgende açılar genelde eşit değil.',
          yanlis: 'Kenarların eşitliği yetmez; açılar da eşit olmalı. Açıları 90° olan eşkenar dörtgen yani kare düzgündür.',
        },
        kart: 9,
      },
    ]),
    konu('mat11-disbukey', 'Dışbükey Çokgenlerin Özellikleri', [
      kart(
        'Üçgenlere bölme',
        'n kenarlı dışbükey çokgende bir köşeden **n − 3** köşegen çizilir.\nBu köşegenler çokgeni **n − 2** üçgene ayırır.\nÖrnek: altıgende bir köşeden 3 köşegen, 4 üçgen.',
      ),
      kart(
        'İç açılar toplamı',
        '**(n − 2) · 180°**\n- Beşgen: 3 · 180° = 540°\n- Altıgen: 4 · 180° = 720°\n- Sekizgen: 6 · 180° = 1080°\nHer üçgen 180° katar.',
      ),
      kart(
        'Dış açılar toplamı',
        'Dışbükey her çokgende dış açıların toplamı **360°**’dir.\nKenar sayısı değişse de değişmez.\nHer köşede iç açı + dış açı = 180°.',
        undefined,
        { not: 'Dış açılar toplamı kenar sayısına bağlı değil: üçgende de yirmigende de 360°.' },
      ),
      kart(
        'Köşegen sayısı',
        '**Köşegen sayısı = n · (n − 3) / 2**\nHer köşeden n − 3 köşegen çıkar; her köşegen iki kez sayıldığı için 2’ye bölünür.\nSekizgen: 8 · 5 / 2 = 20 köşegen',
      ),
      kart(
        'Düzgün çokgende açılar',
        '- **Bir iç açı:** (n − 2) · 180° / n\n- **Bir dış açı:** 360° / n',
        {
          tur: 'tablo',
          basliklar: ['Çokgen', 'İç açı', 'Dış açı'],
          satirlar: [
            ['Eşkenar üçgen', '60°', '120°'],
            ['Kare', '90°', '90°'],
            ['Düzgün beşgen', '108°', '72°'],
            ['Düzgün altıgen', '120°', '60°'],
            ['Düzgün sekizgen', '135°', '45°'],
          ],
        },
      ),
      kart(
        'Açıdan kenar sayısına',
        'Düzgün çokgende en kısa yol dış açıdır: **n = 360° / dış açı**\n- Dış açı 36° → n = 10\n- İç açı 140° → dış açı 40° → n = 9',
      ),
      kart(
        'Merkez açı',
        'Düzgün çokgenin merkezinden iki komşu köşeye çizilen yarıçaplar arasındaki açıdır.\n**Merkez açı = 360° / n**, yani dış açıya eşittir.',
      ),
      kart(
        'Simetri',
        'Düzgün n-genin **n simetri ekseni** vardır ve **360° / n** dönmeyle kendisiyle çakışır.\n- **n çiftse:** eksenler karşı köşelerden ve karşı kenar ortalarından geçer.\n- **n tekse:** her eksen bir köşeden karşı kenarın ortasına iner.',
      ),
      kart(
        'Çevrel ve iç teğet çember',
        'Her düzgün çokgenin çevrel ve iç teğet çemberi vardır; merkezleri aynıdır.\n- **Çevrel çember yarıçapı:** merkezden köşeye uzaklık\n- **Apotem:** merkezden kenara dik uzaklık, iç teğet çemberin yarıçapı',
      ),
      kart(
        'Düzgün çokgenin alanı',
        'Merkez köşelere birleştirilince n eş ikizkenar üçgen oluşur.\n**A = ½ · çevre · apotem**\nKenarı 6, apotemi 4 olan düzgün beşgen: A = ½ · 30 · 4 = 60',
      ),
      kart(
        'Düzgün altıgen',
        'Merkezden köşelere çizilen doğrular altıgeni **6 eşkenar üçgene** ayırır.\n- **Alan:** 6 · a²√3 / 4 = 3a²√3 / 2\n- **Köşegenler:** uzun olan 2a, kısa olan a√3\n- **Çevrel çember:** yarıçapı kenara eşit',
      ),
      kart(
        'Eşkenar üçgen ve kare',
        '- **Eşkenar üçgen:** yükseklik a√3 / 2, alan a²√3 / 4\n- **Kare:** köşegen a√2, alan a²\nİkisi de en küçük düzgün çokgenler; altıgen hesabı eşkenar üçgenden türer.',
      ),
      kart(
        'Düzlemi kaplama',
        'İç açısı 360°’yi tam bölen düzgün çokgenler düzlemi boşluksuz kaplar.\n- **Eşkenar üçgen:** 60°, bir köşede 6 tane\n- **Kare:** 90°, bir köşede 4 tane\n- **Altıgen:** 120°, bir köşede 3 tane\nDüzgün beşgen (108°) kaplayamaz.',
      ),
      kart(
        'Düzgün olmayan çokgende alan',
        'Formül yoksa çokgeni üçgenlere ya da bilinen dörtgenlere böl, alanları topla.\nİçbükey şekilde bazen büyük şekilden fazlalığı çıkarmak daha kısadır.',
      ),
    ], [], [
      {
        soru: 'Düzgün bir çokgenin bir dış açısı 30° ise kaç kenarı vardır?',
        siklar: ['12', '6'],
        dogru: 0,
        aciklama: {
          dogru: 'n = 360° / 30° = 12. Dış açı toplamı her zaman 360°.',
          yanlis: 'Dış açılar toplamı 360°, her biri 30°: n = 360 / 30 = 12.',
        },
        kart: 6,
      },
      {
        soru: 'Kenarı 2 olan düzgün altıgenin alanı kaçtır?',
        siklar: ['4√3', '6√3'],
        dogru: 1,
        aciklama: {
          dogru: '6 eşkenar üçgen: 6 · (4√3 / 4) = 6√3.',
          yanlis: 'Tek eşkenar üçgenin alanı √3; altıgende bunlardan 6 tane var: 6√3.',
        },
        kart: 11,
      },
    ]),
    konu('mat11-cokgen-problem', 'Çokgenlerle İlgili Problemler', [
      kart(
        'Problem çözme adımları',
        '- **Anla:** verilen ve istenen nicelikleri ayır.\n- **Çiz:** şekli ölçekli olmasa da çiz, bilinenleri yaz.\n- **İlişki kur:** açı toplamı, alan, Pisagor, simetri\n- **Kontrol et:** cevap bağlama uyuyor mu?',
      ),
      kart(
        'Örnek: açılardan kenar',
        'İç açısı dış açısının 4 katı olan düzgün çokgen:\n- iç + dış = 180° ve iç = 4 · dış\n- 5 · dış = 180° → dış = 36°\n- n = 360° / 36° = **10**',
      ),
      kart(
        'Örnek: köşegenden kenar',
        'Köşegen sayısı kenar sayısının 2 katı olan çokgen:\n- n(n − 3) / 2 = 2n\n- n − 3 = 4 → n = **7**\nKontrol: yedigen 7 · 4 / 2 = 14 köşegen.',
      ),
      kart(
        'Örnek: eksik açı',
        'Beşgenin dört açısı 100°, 110°, 120° ve 90° ise beşincisi:\n- İç açılar toplamı 540°\n- 540° − 420° = **120°**',
      ),
      kart(
        'Örnek: yamukta orta taban',
        'Tabanları 6 ve 14, yüksekliği 5 olan yamuk:\n- **Orta taban:** (6 + 14) / 2 = 10\n- **Alan:** orta taban × yükseklik = 10 · 5 = 50',
      ),
      kart(
        'Örnek: eşkenar dörtgen',
        'Köşegenleri 10 ve 24 olan eşkenar dörtgen:\n- **Yarım köşegenler:** 5 ve 12, çünkü dik ortalar\n- **Kenar:** √(25 + 144) = 13, çevre 52\n- **Alan:** 10 · 24 / 2 = 120',
      ),
      kart(
        'Örnek: dikdörtgenin köşegeni',
        'Kenarları 9 ve 12 olan dikdörtgen:\n- **Köşegen:** √(81 + 144) = 15\n- **Kesişimden köşeye:** 15 / 2 = 7,5\nBu uzaklık çevrel çemberin yarıçapıdır.',
      ),
      kart(
        'Örnek: paralelkenarda iç nokta',
        'Alanı 60 olan paralelkenarın içindeki bir noktadan dört köşeye doğru çizilir.\nKarşılıklı iki üçgenin alanları toplamı her zaman **30**’dur.\nNoktanın yeri fark etmez.',
      ),
      kart(
        'Örnek: altıgen bahçe',
        'Kenarı 4 m olan düzgün altıgen bahçe:\n- **Alan:** 3 · 16 · √3 / 2 = 24√3 ≈ 41,6 m²\n- **Çit uzunluğu:** 6 · 4 = 24 m',
      ),
      kart(
        'Örnek: kareden sekizgen',
        'Kenarı 2 + √2 olan karenin köşelerinden dik kenarı 1 olan ikizkenar dik üçgenler kesilir.\n- Kesik kenar: hipotenüs √2\n- Kalan orta parça: (2 + √2) − 2 = √2\nSekiz kenar da √2: **düzgün sekizgen**.',
      ),
      kart(
        'Neden bal peteği altıgen?',
        'Düzlemi kaplayan üç düzgün çokgenden altıgen, aynı alanı **en kısa çevreyle** kaplar.\nArı daha az mumla daha çok bal saklar.',
      ),
      kart(
        'Sık yapılan hatalar',
        '- Dış açılar toplamını (n − 2) · 180° sanmak\n- Köşegen formülünde 2’ye bölmeyi unutmak\n- Düzgün olmayan çokgende tek açıyı (n − 2) · 180° / n ile bulmak\n- e · f / 2’yi köşegenleri dik olmayan dörtgende kullanmak',
        undefined,
        { not: 'Tek açı formülü yalnızca düzgün çokgende geçerli; soruda "düzgün" kelimesini ara.' },
      ),
    ], [], [
      {
        soru: 'Köşegen sayısı kenar sayısına eşit olan çokgen hangisidir?',
        siklar: ['Altıgen', 'Beşgen'],
        dogru: 1,
        aciklama: {
          dogru: 'n(n − 3) / 2 = n → n − 3 = 2 → n = 5. Beşgenin 5 köşegeni var.',
          yanlis: 'Altıgenin 9 köşegeni var. n(n − 3) / 2 = n denklemi n = 5 verir.',
        },
        kart: 3,
      },
      {
        soru: 'Paralelkenarın içindeki noktada karşılıklı üçgenlerin alanları toplamı?',
        siklar: ['Alanın yarısı', 'Noktanın yerine bağlı'],
        dogru: 0,
        aciklama: {
          dogru: 'Noktanın yeri ne olursa olsun karşılıklı iki üçgen paralelkenarın yarısını kaplar.',
          yanlis: 'Tek tek üçgenler değişir ama karşılıklı ikisinin toplamı hep alanın yarısıdır.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('mat11-t3', 'Nicelikler ve Değişimler · Trigonometri', [
    konu('mat11-trig-fonk', 'Trigonometrik Fonksiyonlar', [
      kart(
        'Yönlü açı',
        'Açı, başlangıç kenarının bitiş kenarına dönmesiyle ölçülür.\n- **Saat yönünün tersi:** pozitif yön\n- **Saat yönü:** negatif yön\n−90° ile 270° aynı bitiş kenarını verir.',
      ),
      kart(
        'Derece ve radyan',
        '**Radyan:** yarıçap uzunluğundaki yayı gören merkez açı\n**180° = π radyan** → D / 180 = R / π\n- 60° = π/3, 45° = π/4, 30° = π/6\n- 3π/4 = 135°, 1 radyan ≈ 57,3°',
      ),
      kart(
        'Esas ölçü',
        'Açının [0°, 360°) ya da [0, 2π) aralığındaki karşılığıdır; tam turlar atılır.\n- 1110° = 3 · 360° + 30° → **30°**\n- −60° + 360° → **300°**\n- 17π/3 − 4π → **5π/3**',
      ),
      kart(
        'Birim çember',
        'Merkezi orijin, yarıçapı 1 olan çemberdir.\nx açısının bitiş kenarı çemberi **P(cos x, sin x)** noktasında keser.\nApsis kosinüs, ordinat sinüstür.',
        {
          tur: 'koordinat',
          pencere: [-2.4, 2.4, -1.47, 1.47],
          eksenler: true,
          cemberler: [{ x: 0, y: 0, r: 1 }],
          egriler: [
            {
              noktalar: [
                [0, 0],
                [0.8, 0.6],
              ],
              kirik: true,
            },
            {
              noktalar: [
                [0.8, 0.6],
                [0.8, 0],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          noktalar: [{ x: 0.8, y: 0.6 }],
          etiketler: [
            { x: 1.6, y: 1.05, ad: 'P(cos x, sin x)' },
            { x: 0.35, y: 0.1, ad: 'x' },
            { x: 1.2, y: 0.3, ad: 'sin x', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Temel özdeşlik',
        'P noktası çemberin üstünde olduğu için:\n**sin²x + cos²x = 1**\n- −1 ≤ sin x ≤ 1\n- −1 ≤ cos x ≤ 1\nsin x = 3/5 ise cos²x = 16/25, cos x = ±4/5.',
      ),
      kart(
        'Bölgelere göre işaret',
        'İşaret, P noktasının koordinatlarının işaretidir.',
        {
          tur: 'tablo',
          basliklar: ['Bölge', 'sin · cos', 'tan · cot'],
          satirlar: [
            ['I (0 – 90°)', '+ · +', '+'],
            ['II (90° – 180°)', '+ · −', '−'],
            ['III (180° – 270°)', '− · −', '+'],
            ['IV (270° – 360°)', '− · +', '−'],
          ],
        },
      ),
      kart(
        'Tanjant ve kotanjant',
        '- **tan x = sin x / cos x**, cos x = 0 olduğu x = π/2 + kπ’de tanımsız\n- **cot x = cos x / sin x**, sin x = 0 olduğu x = kπ’de tanımsız\ntan x · cot x = 1 (ikisi de tanımlıyken)',
      ),
      kart(
        'Özel açılar',
        'Bu değerler bütün hesapların temelidir.',
        {
          tur: 'tablo',
          basliklar: ['x', 'sin x', 'cos x'],
          satirlar: [
            ['0', '0', '1'],
            ['π/6 (30°)', '1/2', '√3/2'],
            ['π/4 (45°)', '√2/2', '√2/2'],
            ['π/3 (60°)', '√3/2', '1/2'],
            ['π/2 (90°)', '1', '0'],
          ],
        },
      ),
      kart(
        'Başka bölgeye taşıma',
        'Önce x ekseniyle yapılan dar açıyı bul, sonra işareti bölgeden al.\n- sin 150° = sin 30° = 1/2, cos 150° = −√3/2\n- sin 210° = −1/2, cos 330° = √3/2\n- sin(−x) = −sin x, cos(−x) = cos x',
      ),
      kart(
        'Periyot',
        'f(x + T) = f(x) eşitliğini her x için sağlayan en küçük pozitif T’dir.\n- **sin ve cos:** 2π\n- **tan ve cot:** π\nGrafik her periyotta aynen tekrarlanır.',
      ),
      kart(
        'Sinüs grafiği',
        '- **Tanım:** ℝ, **görüntü:** [−1, 1]\n- **Sıfırlar:** kπ; **en büyük:** 1, x = π/2 + 2kπ\n- **Simetri:** orijine göre, **tek** fonksiyon',
        {
          tur: 'koordinat',
          pencere: [0, 6.6, -1.5, 1.5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [0.785, 0.707],
                [1.571, 1],
                [2.356, 0.707],
                [3.142, 0],
                [3.927, -0.707],
                [4.712, -1],
                [5.498, -0.707],
                [6.283, 0],
              ],
              ad: 'y = sin x',
            },
          ],
          etiketler: [
            { x: 1.571, y: 1.3, ad: 'π/2' },
            { x: 3.142, y: -0.3, ad: 'π' },
            { x: 6.1, y: -0.3, ad: '2π' },
          ],
        },
      ),
      kart(
        'Kosinüs grafiği',
        'Sinüs grafiğinin π/2 sola ötelenmişidir: cos x = sin(x + π/2).\n- **En büyük:** 1, x = 2kπ; **sıfırlar:** π/2 + kπ\n- **Simetri:** y eksenine göre, **çift** fonksiyon',
        {
          tur: 'koordinat',
          pencere: [0, 6.6, -1.5, 1.5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [0, 1],
                [0.785, 0.707],
                [1.571, 0],
                [2.356, -0.707],
                [3.142, -1],
                [3.927, -0.707],
                [4.712, 0],
                [5.498, 0.707],
                [6.283, 1],
              ],
              ad: 'y = cos x',
            },
          ],
        },
      ),
      kart(
        'Tanjant ve kotanjant grafiği',
        '- **tan:** x = π/2 + kπ doğruları asimptot, her aralıkta artan, görüntü ℝ\n- **cot:** x = kπ doğruları asimptot, her aralıkta azalan\nİkisinin de periyodu π’dir, ikisi de tek fonksiyondur.',
        {
          tur: 'koordinat',
          pencere: [-2.2, 2.2, -4, 4],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [-1.3, -3.6],
                [-1, -1.557],
                [-0.5, -0.546],
                [0, 0],
                [0.5, 0.546],
                [1, 1.557],
                [1.3, 3.6],
              ],
              ad: 'y = tan x',
            },
            {
              noktalar: [
                [-1.571, -4],
                [-1.571, 4],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [1.571, -4],
                [1.571, 4],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
          ],
        },
      ),
      kart(
        'Dönüşümler',
        '**g(x) = k · f(mx + r) + s**\n- **k:** dikey esneme, |k| genlik; k < 0 ise x eksenine göre yansıma\n- **m:** periyot 2π / |m| (tan ve cot için π / |m|)\n- **r:** yatay öteleme, −r / m kadar\n- **s:** dikey öteleme',
        undefined,
        { not: 'Periyodu yalnızca x’in katsayısı belirler: 5 · sin(3x − 1) + 2’nin periyodu 2π/3.' },
      ),
      kart(
        'En büyük ve en küçük değer',
        'g(x) = k · sin(mx + r) + s için:\n- **En büyük:** |k| + s\n- **En küçük:** −|k| + s\nÖrnek: 3 sin 2x − 1 → en büyük 2, en küçük −4, periyot π',
      ),
      kart(
        'Artanlık ve azalanlık',
        '- **sin:** [−π/2, π/2]’de artan, [π/2, 3π/2]’de azalan\n- **cos:** [0, π]’de azalan, [π, 2π]’de artan\n- **tan:** tanımlı olduğu her aralıkta artan\n- **cot:** tanımlı olduğu her aralıkta azalan',
      ),
    ], [], [
      {
        soru: '210° hangi bölgededir ve sinüsü kaçtır?',
        siklar: ['III. bölge, −1/2', 'II. bölge, 1/2'],
        dogru: 0,
        aciklama: {
          dogru: '210° = 180° + 30°: III. bölge, orada sinüs negatif. sin 210° = −1/2.',
          yanlis: '210° 180° ile 270° arasında: III. bölge. Orada sinüs negatif, sin 210° = −1/2.',
        },
        kart: 9,
      },
      {
        soru: 'f(x) = 4 cos(2x) + 1 fonksiyonunun periyodu nedir?',
        siklar: ['2π', 'π'],
        dogru: 1,
        aciklama: {
          dogru: 'Periyot 2π / |m| = 2π / 2 = π. 4 ve 1 periyodu etkilemez.',
          yanlis: 'Periyodu x’in katsayısı belirler: 2π / 2 = π. Genlik ve öteleme periyodu değiştirmez.',
        },
        kart: 14,
      },
    ]),
    konu('mat11-trig-denklem', 'Trigonometrik Denklemler', [
      kart(
        'Trigonometrik denklem',
        'Bilinmeyeni bir trigonometrik fonksiyonun içinde olan denklemdir.\nFonksiyonlar periyodik olduğu için çözüm **sonsuz** tanedir.\nÇözüm kümesi k ∈ ℤ kullanılarak yazılır.',
      ),
      kart(
        'Çözüm var mı?',
        '- **sin x = a, cos x = a:** yalnızca −1 ≤ a ≤ 1 ise çözüm var\n- **tan x = a, cot x = a:** her a için çözüm var\nsin x = 2 ya da cos x = −1,5 denklemlerinin çözümü yoktur.',
      ),
      kart(
        'sin x = a',
        'Birim çemberde y = a doğrusu çemberi iki noktada keser.\n- x = α + 2kπ\n- x = π − α + 2kπ\nsin x = 1/2 → x = π/6 + 2kπ ya da x = 5π/6 + 2kπ',
        undefined,
        { not: 'sin x = a’nın iki kök ailesi var; π − α’yı unutan çözümlerin yarısını kaybeder.' },
      ),
      kart(
        'cos x = a',
        'x = a doğrusu çemberi x eksenine göre simetrik iki noktada keser.\n- x = α + 2kπ\n- x = −α + 2kπ\ncos x = 1/2 → x = ±π/3 + 2kπ',
      ),
      kart(
        'tan x = a, cot x = a',
        'Periyot π olduğu için tek bir kök ailesi yeter:\n**x = α + kπ**\n- tan x = 1 → x = π/4 + kπ\n- cot x = √3 → x = π/6 + kπ',
      ),
      kart(
        'Özel değerler',
        '- **sin x = 0:** x = kπ\n- **sin x = 1:** x = π/2 + 2kπ\n- **sin x = −1:** x = 3π/2 + 2kπ\n- **cos x = 0:** x = π/2 + kπ\n- **cos x = 1:** x = 2kπ\n- **cos x = −1:** x = π + 2kπ',
      ),
      kart(
        'Negatif değerler',
        'Önce işaretsiz değerin dar açısını bul, sonra doğru bölgeleri seç.\nsin x = −1/2: dar açı π/6, sinüs III ve IV. bölgede negatif.\n[0, 2π) içinde x = 7π/6 ve x = 11π/6',
      ),
      kart(
        'Aralıkta çözüm sayma',
        'Genel çözümde k’ye tam sayı değerleri ver, aralıkta kalanları say.\n[0, 2π) içinde sin x = 1/2 → π/6 ve 5π/6: **2 çözüm**\nAralığın uçlarının dâhil olup olmadığına dikkat et.',
      ),
      kart(
        'Açı katlıysa',
        'sin 2x = 1/2 → 2x = π/6 + 2kπ ya da 2x = 5π/6 + 2kπ\n- x = π/12 + kπ\n- x = 5π/12 + kπ\n[0, 2π) içinde **4** çözüm: katsayı çözüm sayısını katlar.',
      ),
      kart(
        'Grafikle çözüm',
        'f(x) = a denkleminin çözüm sayısı, y = f(x) ile y = a doğrusunun **kesişim sayısıdır**.',
        {
          tur: 'koordinat',
          pencere: [0, 6.6, -1.5, 1.5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [0.785, 0.707],
                [1.571, 1],
                [2.356, 0.707],
                [3.142, 0],
                [3.927, -0.707],
                [4.712, -1],
                [5.498, -0.707],
                [6.283, 0],
              ],
            },
            {
              noktalar: [
                [0, 0.5],
                [6.4, 0.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'y = 1/2',
            },
          ],
          noktalar: [
            { x: 0.524, y: 0.5, ad: 'π/6' },
            { x: 2.618, y: 0.5, ad: '5π/6' },
          ],
        },
      ),
      kart(
        'Cebirsel düzenleme',
        'Trigonometrik ifadeyi yalnız bırak ya da yerine bir harf koy.\n- 2 sin x − 1 = 0 → sin x = 1/2\n- 2cos²x − cos x − 1 = 0, t = cos x → (2t + 1)(t − 1) = 0\nKökler: cos x = −1/2 ya da cos x = 1',
      ),
      kart(
        'Özdeşlikle tek fonksiyona',
        'sin²x = 1 − cos²x yazıp tek fonksiyona indir.\n2sin²x + 3cos x = 3 → 2cos²x − 3cos x + 1 = 0\ncos x = 1 ya da cos x = 1/2 → x = 2kπ ya da x = ±π/3 + 2kπ',
      ),
      kart(
        'Bölerken dikkat',
        'sin x = cos x denkleminde cos x’e bölünür: tan x = 1 → x = π/4 + kπ.\nBölmeden önce cos x = 0 kökü var mı diye bak.\nsin x · cos x = sin x’te sin x’e bölmek sin x = 0 köklerini kaybettirir.',
      ),
      kart(
        'Model: dönme dolap',
        'Yükseklik h(t) = 20 − 18 cos(πt / 15) metre, t dakika.\n- Periyot 30 dakika, en alçak 2 m, en yüksek 38 m\n- h = 29 → cos(πt / 15) = −1/2 → t = **10** ve **20** dakika',
      ),
      kart(
        'Model: gelgit',
        'Su seviyesi h(t) = 3 sin(πt / 6) + 5 metre, t saat.\n- En yüksek 8 m, en alçak 2 m, periyot 12 saat\n- h = 6,5 → sin(πt / 6) = 1/2 → t = **1** ve **5** saat',
      ),
    ], [], [
      {
        soru: 'cos x = 2 denkleminin kaç çözümü vardır?',
        siklar: ['Hiç yok', 'Sonsuz'],
        dogru: 0,
        aciklama: {
          dogru: 'Kosinüs −1 ile 1 arasında kalır; 2 değerini hiç almaz.',
          yanlis: 'Periyodik olmak her değeri almak demek değil: cos x hiçbir zaman 1’i aşmaz, çözüm yok.',
        },
        kart: 2,
      },
      {
        soru: '[0, 2π) aralığında sin 2x = 1/2 kaç çözüm verir?',
        siklar: ['2', '4'],
        dogru: 1,
        aciklama: {
          dogru: 'x = π/12 + kπ ve 5π/12 + kπ; k = 0 ve 1 için dört çözüm.',
          yanlis: '2x iki tur döner: x = π/12, 5π/12, 13π/12, 17π/12 → 4 çözüm.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('mat11-t4', 'Nicelikler ve Değişimler · Logaritma', [
    konu('mat11-ustel', 'Üstel Fonksiyonlar', [
      kart(
        'Üstel fonksiyon',
        '**f(x) = aˣ**, a > 0 ve a ≠ 1\nDeğişken üstte durur: 2ˣ üstel, x² değildir.\nÖrnekler: 3ˣ, (1/2)ˣ, eˣ, 10ˣ',
      ),
      kart(
        'Tabana neden koşul var?',
        '- **a < 0:** (−4)^(1/2) gerçek sayı değil, fonksiyon tanımsız kalır.\n- **a = 0:** 0ˣ negatif x’lerde tanımsız.\n- **a = 1:** 1ˣ = 1, fonksiyon sabittir, üstel değil.',
      ),
      kart(
        'Grafik: a > 1',
        '(0, 1) noktasından geçer ve **artandır**.\n- Sağa gidildikçe çok hızlı büyür.\n- Sola gidildikçe x eksenine yaklaşır ama değmez.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -0.5, 5.5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [-3, 0.125],
                [-2, 0.25],
                [-1, 0.5],
                [0, 1],
                [1, 2],
                [2, 4],
                [2.4, 5.28],
              ],
              ad: 'y = 2ˣ',
            },
          ],
          noktalar: [{ x: 0, y: 1, ad: '(0, 1)' }],
        },
      ),
      kart(
        'Grafik: 0 < a < 1',
        '(0, 1) noktasından geçer ve **azalandır**.\ny = aˣ ile y = (1/a)ˣ grafikleri **y eksenine göre simetriktir**.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -0.5, 5.5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [-2.4, 5.28],
                [-2, 4],
                [-1, 2],
                [0, 1],
                [1, 0.5],
                [2, 0.25],
                [3, 0.125],
              ],
              ad: 'y = (1/2)ˣ',
            },
            {
              noktalar: [
                [-3, 0.125],
                [-2, 0.25],
                [-1, 0.5],
                [0, 1],
                [1, 2],
                [2, 4],
                [2.4, 5.28],
              ],
              renk: 'soluk',
              kesik: true,
            },
          ],
        },
      ),
      kart(
        'Nitel özellikler',
        '- **Tanım:** ℝ, **görüntü:** (0, ∞)\n- **İşaret:** her x için pozitif, sıfırı yok\n- **Asimptot:** y = 0 (x ekseni)\n- **Bire bir ve örten:** ℝ → (0, ∞)\n- **Teklik:** ne tek ne çift',
      ),
      kart(
        'Tabanın büyüklüğü',
        'Bütün aˣ grafikleri (0, 1)’de kesişir.\n- **x > 0:** taban büyüdükçe değer büyür, 3ˣ > 2ˣ\n- **x < 0:** sıra tersine döner, 3ˣ < 2ˣ\nTaban 1’den uzaklaştıkça grafik dikleşir.',
      ),
      kart(
        'e sayısı',
        '**e ≈ 2,718** — (1 + 1/n)ⁿ ifadesi n büyüdükçe e’ye yaklaşır.\n- y = eˣ doğal üstel fonksiyondur.\n- Sürekli büyüme ve azalma modellerinde doğal olarak ortaya çıkar.',
      ),
      kart(
        'Dönüşümler',
        '**g(x) = k · a^(mx + r) + s**\n- **Asimptot:** y = s\n- **Görüntü:** k > 0 ise (s, ∞), k < 0 ise (−∞, s)\n- **y eksenini kestiği yer:** g(0)',
      ),
      kart(
        'Örnek: g(x) = 2^(x − 1) + 3',
        '- 2ˣ grafiği 1 birim sağa, 3 birim yukarı kayar.\n- Asimptot y = 3, görüntü (3, ∞)\n- (0, 1) noktası (1, 4)’e taşınır.\n- g(0) = 1/2 + 3 = 3,5',
      ),
      kart(
        'Üstel büyüme',
        'Her adımda aynı **oranla** artan nicelik: f(t) = A · (1 + r)ᵗ\n- Her saat ikiye bölünen bakteri: N = N₀ · 2ᵗ\n- %10 büyüyen şehir: N = N₀ · 1,1ᵗ',
      ),
      kart(
        'Üstel azalma',
        'Her adımda aynı oranla azalan nicelik: 0 < a < 1\n- Her yıl %15 değer kaybeden araç: V = V₀ · 0,85ᵗ\n- Yarılanma süresi T olan madde: m = m₀ · (1/2)^(t / T)',
      ),
      kart(
        'Doğrusal mı üstel mi?',
        '- **Doğrusal:** eşit adımda eşit **fark**\n- **Üstel:** eşit adımda eşit **oran**',
        {
          tur: 'tablo',
          basliklar: ['x', 'Doğrusal (+3)', 'Üstel (×3)'],
          satirlar: [
            ['0', '2', '2'],
            ['1', '5', '6'],
            ['2', '8', '18'],
            ['3', '11', '54'],
          ],
        },
      ),
      kart(
        'Bire birlikten sonuçlar',
        '- **aᵘ = aᵛ ise u = v**\n- **a > 1:** aᵘ < aᵛ ⇔ u < v\n- **0 < a < 1:** aᵘ < aᵛ ⇔ u > v\n0,5³ < 0,5², çünkü taban 1’den küçük.',
        undefined,
        { not: '0 < a < 1 iken üs büyüdükçe değer küçülür. Karşılaştırmada önce tabanın 1’den büyük olup olmadığına bak.' },
      ),
      kart(
        'Sayı karşılaştırma',
        'Aynı tabana ya da aynı üsse getir.\n- 2³⁰ = 8¹⁰ ve 3²⁰ = 9¹⁰ → **3²⁰ daha büyük**\n- 4⁵ = 2¹⁰ ve 8³ = 2⁹ → **4⁵ daha büyük**',
      ),
    ], [], [
      {
        soru: 'y = (1/3)ˣ fonksiyonu nasıldır?',
        siklar: ['Artan', 'Azalan'],
        dogru: 1,
        aciklama: {
          dogru: 'Taban 0 ile 1 arasında: x büyüdükçe değer küçülür.',
          yanlis: 'Taban 1’den küçük olduğu için fonksiyon azalan. Artan olan 3ˣ.',
        },
        kart: 4,
      },
      {
        soru: 'g(x) = 2ˣ − 5 fonksiyonunun yatay asimptotu hangisidir?',
        siklar: ['y = −5', 'y = 0'],
        dogru: 0,
        aciklama: {
          dogru: 'Dikey öteleme asimptotu da taşır: y = 0 doğrusu y = −5’e iner.',
          yanlis: 'y = 0, 2ˣ’in asimptotu. Grafik 5 birim aşağı kaydığı için asimptot y = −5.',
        },
        kart: 8,
      },
    ]),
    konu('mat11-ustel-ters', 'Üstel Fonksiyonların Tersi', [
      kart(
        'Ters fonksiyon hatırlatma',
        'f bire bir ve örten ise tersi f⁻¹ vardır.\n- f(a) = b ⇔ f⁻¹(b) = a\n- f ve f⁻¹ grafikleri **y = x doğrusuna göre simetriktir**.',
      ),
      kart(
        'Üstelin tersi var',
        'f(x) = aˣ, ℝ’den (0, ∞)’a bire bir ve örtendir.\nBu yüzden tersi vardır: (0, ∞)’dan ℝ’ye giden bu fonksiyona **logaritma fonksiyonu** denir.',
      ),
      kart(
        'Logaritmanın tanımı',
        '**y = aˣ ⇔ x = logₐ y**\nlogₐ y sorusu: "a’yı kaçıncı kuvvete yükseltirsem y olur?"\n- 2³ = 8 ⇔ log₂ 8 = 3\n- 10² = 100 ⇔ log 100 = 2',
        undefined,
        { not: 'Logaritma bir üs sorar: log₂ 32 "2’nin kaçıncı kuvveti 32?" demek, cevap 5.' },
      ),
      kart(
        'Grafikte simetri',
        'y = 2ˣ ile y = log₂ x, y = x doğrusuna göre birbirinin aynasıdır.\n(0, 1) noktası (1, 0) noktasına yansır.',
        {
          tur: 'koordinat',
          pencere: [-2.5, 5, -2.5, 5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [-2.5, 0.177],
                [-2, 0.25],
                [-1, 0.5],
                [0, 1],
                [1, 2],
                [2, 4],
                [2.3, 4.92],
              ],
              ad: 'y = 2ˣ',
            },
            {
              noktalar: [
                [0.177, -2.5],
                [0.25, -2],
                [0.5, -1],
                [1, 0],
                [2, 1],
                [4, 2],
                [4.92, 2.3],
              ],
              renk: 'ikincil',
              ad: 'y = log₂ x',
            },
            {
              noktalar: [
                [-2.5, -2.5],
                [5, 5],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
              ad: 'y = x',
            },
          ],
        },
      ),
      kart(
        'Yer değiştiren özellikler',
        'Tersine dönerken tanım ile görüntü, x ile y yer değiştirir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'y = aˣ', 'y = logₐ x'],
          satirlar: [
            ['Tanım kümesi', 'ℝ', '(0, ∞)'],
            ['Görüntü kümesi', '(0, ∞)', 'ℝ'],
            ['Sabit nokta', '(0, 1)', '(1, 0)'],
            ['Asimptot', 'y = 0', 'x = 0'],
          ],
        },
      ),
      kart(
        'İlk sonuçlar',
        '- **logₐ 1 = 0**, çünkü a⁰ = 1\n- **logₐ a = 1**, çünkü a¹ = a\n- **logₐ aˣ = x** ve **a^(logₐ x) = x** (x > 0)\nSon ikisi fonksiyonla tersinin birbirini götürmesidir.',
      ),
      kart(
        'Biçim değiştirme',
        '- log₃ x = 4 → x = 3⁴ = **81**\n- log₅ 125 = x → 5ˣ = 125 → x = **3**\n- logₓ 16 = 2 → x² = 16 → x = **4** (taban pozitif olmalı)',
      ),
      kart(
        'Tanım koşulları',
        'logₐ x ifadesinin tanımlı olması için:\n- **Taban:** a > 0 ve a ≠ 1\n- **Argüman:** x > 0\nlog₂(−4), log₁ 5 ve log₃ 0 tanımsızdır.',
      ),
      kart(
        'Tersi bulma adımları',
        'f(x) = 2^(x − 1) + 3\n- y − 3 = 2^(x − 1)\n- x − 1 = log₂(y − 3)\n- x ile y yer değiştirir: **f⁻¹(x) = log₂(x − 3) + 1**',
      ),
      kart(
        'Ters işlemler ters sırada',
        '- **f:** 1 çıkar → 2’nin kuvvetini al → 3 ekle\n- **f⁻¹:** 3 çıkar → log₂ al → 1 ekle\nf’nin asimptotu y = 3 iken f⁻¹’inki x = 3 olur.',
      ),
      kart(
        'Özel tabanlar',
        '- **Onluk logaritma:** log x = log₁₀ x\n- **Doğal logaritma:** ln x = logₑ x\neˣ ile ln x birbirinin tersidir: ln eˣ = x, e^(ln x) = x',
      ),
      kart(
        'Yaklaşık değer',
        'log 2 ≈ 0,301 ve log 3 ≈ 0,477 bilinirse çok değer bulunur.\n- log 6 = log 2 + log 3 ≈ 0,778\n- 10ˣ = 50 → x = log 50, 1 ile 2 arasında ≈ 1,7',
      ),
    ], [], [
      {
        soru: 'log₂ 32 kaça eşittir?',
        siklar: ['16', '5'],
        dogru: 1,
        aciklama: {
          dogru: '2⁵ = 32 olduğu için log₂ 32 = 5.',
          yanlis: 'Logaritma bölme değil üs sorar: 2’nin kaçıncı kuvveti 32? Cevap 5.',
        },
        kart: 3,
      },
      {
        soru: 'y = aˣ ile y = logₐ x grafikleri hangi doğruya göre simetriktir?',
        siklar: ['y = x', 'y ekseni'],
        dogru: 0,
        aciklama: {
          dogru: 'Birbirinin tersi olan fonksiyonların grafikleri y = x’e göre simetriktir.',
          yanlis: 'y eksenine göre simetri aˣ ile (1/a)ˣ arasında. Ters fonksiyonlar y = x’e göre simetrik.',
        },
        kart: 4,
      },
    ]),
    konu('mat11-log', 'Logaritmik Fonksiyonlar', [
      kart(
        'Logaritmik fonksiyon',
        '**f(x) = logₐ x**, a > 0, a ≠ 1, x > 0\n- **Tanım:** (0, ∞)\n- **Görüntü:** ℝ\nÜstel fonksiyonun tersidir.',
      ),
      kart(
        'Grafik: a > 1',
        '(1, 0) noktasından geçer ve **artandır**.\n- y ekseni (x = 0) asimptottur.\n- 0 < x < 1’de negatif, x > 1’de pozitif\n- Çok yavaş büyür: log₂ 1024 = 10',
        {
          tur: 'koordinat',
          pencere: [-0.5, 6, -2.8, 3],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [0.15, -2.74],
                [0.25, -2],
                [0.5, -1],
                [1, 0],
                [2, 1],
                [4, 2],
                [6, 2.58],
              ],
              ad: 'y = log₂ x',
            },
          ],
          noktalar: [{ x: 1, y: 0, ad: '(1, 0)' }],
        },
      ),
      kart(
        'Grafik: 0 < a < 1',
        '(1, 0) noktasından geçer ve **azalandır**.\n- 0 < x < 1’de pozitif, x > 1’de negatif\n- log₁/₂ x = −log₂ x: iki grafik x eksenine göre simetriktir.',
      ),
      kart(
        'Nitel özellikler',
        '- **Sıfır:** x = 1\n- **Bire bir ve örten:** (0, ∞) → ℝ\n- **Asimptot:** x = 0\n- **Teklik:** ne tek ne çift\n- **Yön:** a > 1’de artan, 0 < a < 1’de azalan',
      ),
      kart(
        'Çarpım ve bölüm kuralı',
        '- **logₐ(x · y) = logₐ x + logₐ y**\n- **logₐ(x / y) = logₐ x − logₐ y**\nlog 20 + log 5 = log 100 = 2\nÜstel kuraldan gelir: aᵘ · aᵛ = aᵘ⁺ᵛ',
      ),
      kart(
        'Üs kuralı',
        '- **logₐ(xⁿ) = n · logₐ x**\n- **Taban aᵐ ise:** sonuç m’ye bölünür.\nlog₈ 32: 8 = 2³, 32 = 2⁵ → log₈ 32 = 5/3',
      ),
      kart(
        'Taban değiştirme',
        '**logₐ b = log b / log a** (istenen her tabanla)\n- logₐ x · logₓ a = 1\n- logₐ m · logₘ n = logₐ n\nlog₂ 7 = log 7 / log 2 ≈ 0,845 / 0,301 ≈ 2,81',
      ),
      kart(
        'Sık yapılan hatalar',
        '- log(x + y) ≠ log x + log y\n- (log x)² ≠ log x²\n- log x / log y ≠ log(x / y)\nKurallar çarpım, bölüm ve üs içindir; toplama kuralı yoktur.',
        undefined,
        { not: 'log(x + y)’yi açan bir kural yok. Toplamı görünce çarpım kuralını uygulamaya çalışma.' },
      ),
      kart(
        'Tanım kümesi bulma',
        'f(x) = log₍ₓ₋₁₎(5 − x)\n- Taban pozitif: x > 1\n- Taban 1 değil: x ≠ 2\n- Argüman pozitif: x < 5\nTanım kümesi: (1, 5) − {2}',
      ),
      kart(
        'Dönüşümler',
        '**g(x) = k · logₐ(mx + r) + s**\n- **Tanım:** mx + r > 0\n- **Asimptot:** mx + r = 0 doğrusu\ng(x) = log₂(x − 3) + 1: asimptot x = 3, (4, 1)’den geçer.',
      ),
      kart(
        'Değer karşılaştırma',
        'Aralarında kalan tam sayıları bul.\n- log₂ 10: 2³ = 8 < 10 < 16 = 2⁴ → 3 ile 4 arasında\n- log₃ 10: 3² = 9 < 10 < 27 → 2 ile 3 arasında\nBu yüzden log₂ 10 > log₃ 10.',
      ),
      kart(
        'Basamak sayısı',
        'Pozitif bir tam sayının basamak sayısı: **⌊log N⌋ + 1**\n2²⁰ için log = 20 · 0,301 = 6,02 → 7 basamak\nGerçekten 2²⁰ = 1.048.576.',
      ),
      kart(
        'Doğal logaritma',
        '- ln 1 = 0, ln e = 1, ln 2 ≈ 0,693\n- ln(eᵏ) = k\nSürekli büyüme modellerinde süre hesabı ln ile yapılır.',
      ),
    ], [], [
      {
        soru: 'log 4 + log 25 kaçtır?',
        siklar: ['2', 'log 29'],
        dogru: 0,
        aciklama: {
          dogru: 'Çarpım kuralı: log(4 · 25) = log 100 = 2.',
          yanlis: 'Logaritmaların toplamı argümanların çarpımının logaritmasıdır: log 100 = 2.',
        },
        kart: 5,
      },
      {
        soru: 'f(x) = log₃(x + 2) fonksiyonunun dikey asimptotu hangisidir?',
        siklar: ['x = 2', 'x = −2'],
        dogru: 1,
        aciklama: {
          dogru: 'Argümanı sıfırlayan doğru asimptottur: x + 2 = 0 → x = −2.',
          yanlis: 'Asimptot argümanı sıfır yapan yerde: x + 2 = 0 → x = −2. Grafik 2 birim sola kayar.',
        },
        kart: 10,
      },
    ]),
    konu('mat11-ustel-log-denklem', 'Üstel ve Logaritmik Denklemler', [
      kart(
        'Tabanları eşitle',
        'aᶠ⁽ˣ⁾ = aᵍ⁽ˣ⁾ ise f(x) = g(x)\n- 4ˣ = 32 → 2²ˣ = 2⁵ → x = 5/2\n- 9ˣ⁺¹ = 27 → 3²ˣ⁺² = 3³ → x = 1/2',
      ),
      kart(
        'Üsler eşitse',
        'Tabanlar farklı ama üsler aynıysa üs sıfır olmalıdır.\n3^(x − 2) = 5^(x − 2) → x − 2 = 0 → **x = 2**\nÇünkü yalnızca a⁰ = b⁰ = 1.',
      ),
      kart(
        'Yerine harf koy',
        '4ˣ − 3 · 2ˣ − 4 = 0, t = 2ˣ (t > 0)\n- t² − 3t − 4 = 0 → t = 4 ya da t = −1\n- t = −1 atılır, çünkü 2ˣ hep pozitif\n- 2ˣ = 4 → **x = 2**',
      ),
      kart(
        'Logaritma alarak çöz',
        'Tabanlar eşitlenemiyorsa iki yanın logaritması alınır.\n3ˣ = 7 → x = log₃ 7 = log 7 / log 3 ≈ **1,77**\n2ˣ = 5ˣ⁻¹ → x · log 2 = (x − 1) · log 5',
      ),
      kart(
        'Logaritmik denklem',
        'logₐ f(x) = b → f(x) = aᵇ\nlog₂(x + 3) = 4 → x + 3 = 16 → **x = 13**\nKontrol: x + 3 = 16 > 0, kök geçerli.',
      ),
      kart(
        'İki logaritmalı denklem',
        'log x + log(x − 3) = 1\n- log[x(x − 3)] = 1 → x² − 3x − 10 = 0\n- x = 5 ya da x = −2\n- x = −2’de log x tanımsız: **Ç = {5}**',
        undefined,
        { not: 'Logaritmik denklemde bulduğun kökü yerine koy; argümanı sıfır ya da negatif yapan kök atılır.' },
      ),
      kart(
        'Üstel eşitsizlik',
        '- **a > 1:** yön korunur. 2ˣ > 8 → x > 3\n- **0 < a < 1:** yön döner. (1/3)ˣ ≥ 9 → (1/3)ˣ ≥ (1/3)⁻² → x ≤ −2',
      ),
      kart(
        'Logaritmik eşitsizlik',
        'Önce tanım kümesini yaz, sonra çöz, sonra kesiştir.\n- log₂(x − 1) < 3 → 0 < x − 1 < 8 → **1 < x < 9**\n- log₁/₂ x > 2 → taban 1’den küçük, yön döner → **0 < x < 1/4**',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 10],
          isaretler: [1, 9],
          parcalar: [{ bas: 1, bit: 9, kapaliBas: false, kapaliBit: false, ad: '1 < x < 9' }],
        },
      ),
      kart(
        'Bileşik faiz',
        '**A = P · (1 + r)ᵗ**\n10.000 TL yıllık %20 faizle kaç yılda ikiye katlanır?\n- 1,2ᵗ = 2 → t = log 2 / log 1,2 ≈ 0,301 / 0,079\n- t ≈ **3,8 yıl**',
      ),
      kart(
        'Sürekli büyüme',
        '**N = N₀ · eᵏᵗ**\nBakteri 3 saatte iki katına çıkıyorsa: e³ᵏ = 2 → k = ln 2 / 3\nSekiz katına 3 ikiye katlanmada, yani **9 saatte** ulaşır.',
      ),
      kart(
        'Yarılanma',
        '**m = m₀ · (1/2)^(t / T)**\nKarbon-14’ün yarılanma süresi T ≈ 5730 yıl.\nÖrnekte %25 kalmışsa (1/2)² → t = 2T ≈ **11.460 yıl**',
      ),
      kart(
        'pH',
        '**pH = −log[H⁺]**\n- [H⁺] = 10⁻³ mol/L → pH = 3\n- pH 1 azalınca H⁺ derişimi **10 kat** artar.\npH 2 olan çözelti pH 4 olandan 100 kat asidiktir.',
      ),
      kart(
        'Deprem ve ses',
        '- **Richter:** 1 birim artış, dalga genliğinde 10 kat artış\n- **Desibel:** L = 10 · log(I / I₀)\nSes şiddeti 10 katına çıkınca +10 dB, 100 katına çıkınca +20 dB eklenir.',
      ),
    ], [], [
      {
        soru: '(1/2)ˣ < 1/8 eşitsizliğinin çözümü nedir?',
        siklar: ['x < 3', 'x > 3'],
        dogru: 1,
        aciklama: {
          dogru: '1/8 = (1/2)³ ve taban 1’den küçük: yön döner, x > 3.',
          yanlis: 'Taban 1’den küçükken eşitsizlik yön değiştirir: (1/2)ˣ < (1/2)³ → x > 3.',
        },
        kart: 7,
      },
      {
        soru: 'pH’ı 3 olan çözelti pH’ı 5 olandan kaç kat asidiktir?',
        siklar: ['100 kat', '2 kat'],
        dogru: 0,
        aciklama: {
          dogru: 'Her pH birimi 10 kat: iki birim fark 10² = 100 kat.',
          yanlis: 'pH logaritmik bir ölçek: 2 birim fark 10 · 10 = 100 kat demek.',
        },
        kart: 12,
      },
    ]),
  ]),
  tema('mat11-t5', 'Nicelikler ve Değişimler · Fonksiyonlar', [
    konu('mat11-bileske', 'Fonksiyonların Bileşkesi', [
      kart(
        'Bileşke nedir?',
        '**(f ∘ g)(x) = f(g(x))**\nÖnce g uygulanır, çıkan sonuç f’ye verilir.\n"f bileşke g" diye okunur.',
        undefined,
        { not: '(f ∘ g)(x)’te önce içteki g çalışır: yazılış soldan sağa, işlem sağdan sola.' },
      ),
      kart(
        'İki makine arka arkaya',
        'g’nin çıktısı f’nin girdisi olur.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'x' },
            { ad: 'g', alt: 'önce', renk: 'ikincil' },
            { ad: 'g(x)' },
            { ad: 'f', alt: 'sonra', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Hesaplama',
        'f(x) = 2x + 1, g(x) = x²\n- **(f ∘ g)(x):** f(x²) = 2x² + 1\n- **(g ∘ f)(x):** g(2x + 1) = 4x² + 4x + 1\n- **(f ∘ g)(3):** f(9) = 19',
      ),
      kart(
        'Değişme yok, birleşme var',
        '- **Değişme:** genel olarak f ∘ g ≠ g ∘ f\n- **Birleşme:** (f ∘ g) ∘ h = f ∘ (g ∘ h)\nSıra değişirse sonuç değişir; gruplama değişirse değişmez.',
      ),
      kart(
        'Tanım kümesi',
        'f ∘ g’nin tanımlı olması için g(x), f’nin tanım kümesinde olmalıdır.\nf(x) = √x, g(x) = x − 4 → √(x − 4) → x ≥ 4\ng her yerde tanımlı olsa da bileşke daha dar olabilir.',
      ),
      kart(
        'Birim fonksiyon',
        'I(x) = x fonksiyonu bileşkenin etkisiz elemanıdır.\n**f ∘ I = I ∘ f = f**\nGirdiyi değiştirmeden geri veren makine.',
      ),
      kart(
        'Ters fonksiyonla bileşke',
        '- **f ∘ f⁻¹ = f⁻¹ ∘ f = I**\n- **(f ∘ g)⁻¹ = g⁻¹ ∘ f⁻¹**\nÇorap-ayakkabı kuralı: son giyilen ilk çıkarılır.',
      ),
      kart(
        'Tablodan bileşke',
        '(f ∘ g)(2) için önce g(2) = 3, sonra f(3) = 7.\n(g ∘ f)(1) için önce f(1) = 2, sonra g(2) = 3.',
        {
          tur: 'tablo',
          basliklar: ['x', 'f(x)', 'g(x)'],
          satirlar: [
            ['1', '2', '4'],
            ['2', '5', '3'],
            ['3', '7', '1'],
          ],
        },
      ),
      kart(
        'Grafikten bileşke',
        '- g’nin grafiğinde x = a için g(a)’yı oku.\n- Bulduğun değeri f’nin grafiğinde **x olarak** kullan.\n- O noktadaki y, (f ∘ g)(a)’dır.',
      ),
      kart(
        'Bilinmeyen fonksiyonu bulma',
        '- f(g(x)) = 6x + 5 ve f(x) = 3x − 1 → 3g(x) − 1 = 6x + 5 → **g(x) = 2x + 2**\n- f(2x − 1) = 4x + 3: t = 2x − 1, x = (t + 1)/2 → **f(t) = 2t + 5**',
      ),
      kart(
        'Artanlık ve bire birlik',
        '- İki artanın bileşkesi artandır.\n- Artan ile azalanın bileşkesi azalandır.\n- İki azalanın bileşkesi artandır.\n- İki bire bir fonksiyonun bileşkesi bire birdir.',
      ),
      kart(
        'Teklik ve çiftlik',
        '- **İçteki g çiftse:** f ∘ g çifttir.\n- **İkisi de tekse:** f ∘ g tektir.\n- **f çift, g tekse:** f ∘ g çifttir.\nÖrnek: cos(x³) çift, sin(x³) tek.',
      ),
      kart(
        'Gerçek hayatta bileşke',
        'Fiyata önce %20 KDV, sonra 50 TL indirim:\n- g(x) = 1,2x, f(x) = x − 50 → f(g(x)) = 1,2x − 50\n- Sıra ters: g(f(x)) = 1,2x − 60\nİndirimin KDV’den sonra yapılması müşteriye 10 TL kazandırır.',
      ),
    ], [], [
      {
        soru: 'f(x) = x + 3, g(x) = 2x ise (f ∘ g)(4) kaçtır?',
        siklar: ['14', '11'],
        dogru: 1,
        aciklama: {
          dogru: 'Önce g(4) = 8, sonra f(8) = 11.',
          yanlis: '14, (g ∘ f)(4) = g(7). İstenen f(g(4)) = f(8) = 11; önce içteki g çalışır.',
        },
        kart: 3,
      },
      {
        soru: '(f ∘ g)⁻¹ hangisine eşittir?',
        siklar: ['g⁻¹ ∘ f⁻¹', 'f⁻¹ ∘ g⁻¹'],
        dogru: 0,
        aciklama: {
          dogru: 'Son uygulanan f olduğu için ilk o geri alınır: g⁻¹ ∘ f⁻¹.',
          yanlis: 'Tersinde sıra döner: önce f geri alınır (f⁻¹), sonra g (g⁻¹) → g⁻¹ ∘ f⁻¹.',
        },
        kart: 7,
      },
    ]),
    konu('mat11-dort-islem', 'Fonksiyonlarda Dört İşlem', [
      kart(
        'Dört işlemin tanımı',
        '- **(f ± g)(x) = f(x) ± g(x)**\n- **(f · g)(x) = f(x) · g(x)**\n- **(f / g)(x) = f(x) / g(x)**, g(x) ≠ 0\nİşlem her x için ayrı ayrı çıktılar üzerinde yapılır.',
      ),
      kart(
        'Tanım kümesi',
        'f’nin tanımı A, g’ninki B olsun.\n- **f + g, f − g, f · g:** A ∩ B\n- **f / g:** A ∩ B’den g’yi sıfır yapanlar çıkarılır.\nf = √x, g = x − 2 → f / g: x ≥ 0, x ≠ 2',
      ),
      kart(
        'Örnek hesap',
        'f(x) = x² − 1, g(x) = x + 1\n- **f + g:** x² + x\n- **f · g:** x³ + x² − x − 1\n- **f / g:** (x − 1)(x + 1) / (x + 1) = x − 1, x ≠ −1',
      ),
      kart(
        'Sadeleşme tuzağı',
        'f / g sadeleşip x − 1 olsa da x = −1 tanım kümesinde **değildir**.\nGrafiği y = x − 1 doğrusudur ama (−1, −2) noktası boştur.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -4, 2.5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [-2.5, -3.5],
                [3, 2],
              ],
              kirik: true,
              ad: 'y = x − 1',
            },
          ],
          noktalar: [{ x: -1, y: -2, bos: true, ad: '(−1, −2)' }],
        },
        { not: 'Sadeleştirmeden önce paydayı sıfır yapan değerleri yaz; sadeleşme onları geri getirmez.' },
      ),
      kart(
        'Sabitle çarpma',
        '(c · f)(x) = c · f(x)\n- |c| > 1: grafik dikeyde uzar\n- 0 < |c| < 1: grafik dikeyde basılır\n- c < 0: grafik x eksenine göre yansır',
      ),
      kart(
        'Grafikle toplama',
        'Her x için iki grafiğin y değerleri toplanır.\nf(x) = x ile g(x) = 2 toplanınca doğru 2 birim yukarı kayar.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -3, 5],
          eksenler: true,
          egriler: [
            {
              noktalar: [
                [-3, -3],
                [3, 3],
              ],
              kirik: true,
              ad: 'f',
            },
            {
              noktalar: [
                [-3, 2],
                [3, 2],
              ],
              kirik: true,
              renk: 'soluk',
              ad: 'g',
            },
            {
              noktalar: [
                [-3, -1],
                [3, 5],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'f + g',
            },
          ],
        },
      ),
      kart(
        'Tablodan işlem',
        '- (f − g)(1) = 4 − 1 = 3\n- (f · g)(2) = 3 · 5 = 15\n- (f / g)(3) tanımsız, çünkü g(3) = 0',
        {
          tur: 'tablo',
          basliklar: ['x', 'f(x)', 'g(x)'],
          satirlar: [
            ['1', '4', '1'],
            ['2', '3', '5'],
            ['3', '6', '0'],
          ],
        },
      ),
      kart(
        'Artanlık',
        '- İki artanın toplamı artandır.\n- Artandan azalan çıkarılırsa artan kalır.\n- Çarpımda işaret belirleyicidir: iki **pozitif** artanın çarpımı artandır.\nx ve x − 5 artan ama çarpımları x² − 5x her yerde artan değil.',
      ),
      kart(
        'Teklik ve çiftlik',
        '- **Tek + tek:** tek; **çift + çift:** çift\n- **Tek · tek:** çift; **çift · çift:** çift\n- **Tek · çift:** tek\n- **Tek + çift:** genelde ne tek ne çift (x + x²)',
      ),
      kart(
        'Sıfırlar',
        '- **f · g’nin sıfırları:** f’nin ve g’nin sıfırlarının birleşimi\n- **f / g’nin sıfırları:** f’nin sıfırlarından g’yi sıfır yapmayanlar\nPaydayı sıfır yapan değer asla sıfır değildir, tanımsızdır.',
      ),
      kart(
        'İşaret tablosu',
        'f(x) = x − 1, g(x) = x + 2 için (f · g)(x) < 0 nerede?\n- Sıfırlar −2 ve 1\n- İki çarpan zıt işaretliyken çarpım negatif\nÇözüm: **−2 < x < 1**',
        {
          tur: 'sayiDogrusu',
          aralik: [-4, 3],
          isaretler: [-2, 1],
          parcalar: [{ bas: -2, bit: 1, kapaliBas: false, kapaliBit: false, ad: 'f · g < 0' }],
        },
      ),
      kart(
        'Kâr fonksiyonu',
        'Gelir G(x) = 50x, maliyet M(x) = 20x + 600 (x ürün)\n- **Kâr:** K(x) = G(x) − M(x) = 30x − 600\n- **Başabaş:** K(x) = 0 → x = 20\n- **Birim maliyet:** M(x) / x = 20 + 600 / x',
      ),
      kart(
        'Çarpım bileşke değildir',
        'f(x) = x + 1, g(x) = 2x\n- **(f · g)(x):** (x + 1) · 2x = 2x² + 2x\n- **(f ∘ g)(x):** f(2x) = 2x + 1\nNokta çarpım, halka bileşkedir.',
      ),
    ], [], [
      {
        soru: 'f(x) = √x ve g(x) = x − 3 ise f / g’nin tanım kümesinden hangisi çıkar?',
        siklar: ['3', '0'],
        dogru: 0,
        aciklama: {
          dogru: 'g(3) = 0 olduğu için x = 3’te bölme tanımsız. 0 kalır: √0 / (−3) = 0.',
          yanlis: 'x = 0’da √0 = 0, payda −3: bölüm 0 ve tanımlı. Çıkan değer paydayı sıfırlayan 3.',
        },
        kart: 2,
      },
      {
        soru: 'Tek iki fonksiyonun çarpımı nasıldır?',
        siklar: ['Tek', 'Çift'],
        dogru: 1,
        aciklama: {
          dogru: '(−f(x)) · (−g(x)) = f(x) · g(x): çarpım çift. Örnek x · x³ = x⁴.',
          yanlis: 'İki eksi çarpılınca artı olur: tek · tek çift. x · x = x² çift fonksiyon.',
        },
        kart: 9,
      },
    ]),
  ]),
])
