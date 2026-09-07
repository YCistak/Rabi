import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Fizik — Maarif Modeli.
 *
 * Dört tema: Fizik Bilimi ve Kariyer Keşfi, Kuvvet ve Hareket, Akışkanlar,
 * Enerji. Konu adları ve sırası `maarif/iskelet.json`'dan; `maarif.test.ts`
 * denetliyor.
 *
 * Konu adları programdakinden **kısaltılabiliyor** — haritadaki düğüme
 * "Isı, Öz Isı, Isı Sığası ve Sıcaklık Farkı Arasındaki İlişki" sığmıyor.
 * Test eşitlik değil örtüşme arıyor; kısaltırken konuyu tanıtan kelimeleri
 * atma.
 */
export const fizik9 = program('fizik', 9, 'Fizik bilimi ve enerji', [
  tema('fzk9-t1', 'Fizik Bilimi ve Kariyer Keşfi', [
    konu('fzk9-bilim', 'Fizik Bilimi', [
      kart(
        'Fizik neyi inceler?',
        'Madde, enerji ve bunların uzay-zamandaki etkileşimini inceler. Doğanın kurallarını sayı ile ifade etmeye çalışır.',
      ),
      kart(
        'Bilimsel yöntem',
        'Fizik gözlemle başlar, hipotez kurar, deneyle sınar ve sonucu yeniden gözleme döner.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Gözlem' },
            { ad: 'Hipotez' },
            { ad: 'Deney' },
            { ad: 'Kuram' },
          ],
        },
      ),
      kart(
        'Deney ve model',
        'Model gerçeğin sadeleştirilmiş hâlidir. Deneyle çelişen model ne kadar zarif olursa olsun bırakılır.',
      ),
      kart(
        'Hipotez, kuram, yasa',
        'Hipotez sınanmayı bekleyen öneri, kuram sınanmış açıklama, yasa ise gözlenen düzenliliğin kısa ifadesidir.',
      ),
      kart(
        'Fizik ve matematik',
        'Matematik fiziğin dili. Bir yasa cümleyle anlatılabilir ama tahmin yapabilmesi için denkleme dönmesi gerekir.',
      ),
      kart(
        'Ölçme olmadan fizik olmaz',
        'Her ölçümün bir belirsizliği vardır. Sonucu belirsizliğiyle birlikte vermek, fiziğin dürüstlük kuralıdır.',
      ),
      kart(
        'Fiziğin öteki bilimlerle bağı',
        'Kimya atomun elektron düzenine, biyoloji sinir hücresinin elektriğine dayanır. Sınır çizgileri idari, doğal değil.',
      ),
    ]),
    konu('fzk9-altdal', 'Fizik Biliminin Alt Dalları', [
      kart(
        'Mekanik',
        'Kuvvet, hareket ve dengeyi inceler. Köprüden gezegen yörüngesine kadar hareket eden her şey konusudur.',
      ),
      kart(
        'Termodinamik',
        'Isı ve enerji dönüşümlerini inceler. Motor, buzdolabı ve iklim modelleri bu dalın konusudur.',
      ),
      kart(
        'Optik',
        'Işığın yayılması, kırılması ve yansımasını inceler. Gözlük, kamera ve fiber optik kablo buradan çıkar.',
      ),
      kart(
        'Elektromanyetizma',
        'Elektrik ve manyetizmayı tek çatı altında toplar. Elektrik motorundan radyo dalgasına kadar her şey buradan çıkar.',
      ),
      kart(
        'Katıhâl fiziği',
        'Maddenin katı hâldeki davranışını inceler; yarı iletkenler ve dolayısıyla bütün elektronik bu dalın ürünü.',
      ),
      kart(
        'Modern fizik',
        'Atom altı ve ışık hızına yakın olaylar: kuantum fiziği ve görelilik. Klasik fiziğin yetmediği yerde başlar.',
      ),
      kart(
        'Klasik mi modern mi?',
        'Klasik fizik yanlış değil, sınırlıdır: günlük hız ve boyutlarda doğru sonuç verir, o sınırın dışında modern fizik gerekir.',
      ),
    ]),
    konu('fzk9-bilim-insanlari', 'Fizik Bilimine Yön Verenler', [
      kart(
        'Galileo',
        'Deneyi fiziğin merkezine koydu. Serbest düşmede farklı kütlelerin aynı ivmeyle düştüğünü savundu.',
      ),
      kart(
        'Newton',
        'Hareket yasalarını ve kütle çekimini tek çatı altında topladı. Gökteki ve yerdeki hareketin aynı yasaya uyduğunu gösterdi.',
      ),
      kart(
        'Faraday ve Maxwell',
        'Faraday elektrik ile manyetizmanın bağını deneyle gösterdi, Maxwell bunu dört denklemle yazdı.',
      ),
      kart(
        'Einstein',
        'Görelilik kuramıyla zaman ve uzayın mutlak olmadığını gösterdi. Enerji ile kütlenin bağını da o kurdu.',
      ),
      kart(
        'Marie Curie',
        'Radyoaktivite üzerine çalıştı, iki ayrı dalda Nobel alan ilk kişi oldu. Polonyum ve radyumu keşfetti.',
      ),
      kart(
        'İbn Heysem',
        'Optiğin kurucusu sayılır. Görmenin gözden çıkan ışınla değil, cisimden göze gelen ışıkla olduğunu gösterdi.',
      ),
      kart(
        'Türkiye’den bir ad',
        'Feza Gürsey parçacık fiziğinde simetri kuramlarıyla tanınır; adı uluslararası bir araştırma ödülünde yaşıyor.',
      ),
    ]),
    konu('fzk9-kariyer', 'Fizik Bilimi ile İlgili Kariyer Keşfi', [
      kart(
        'Nerede çalışılır?',
        'Enerji, savunma, sağlık (tıbbi görüntüleme), yarı iletken ve havacılık sektörleri; ayrıca araştırma merkezleri.',
      ),
      kart(
        'Medikal fizik',
        'Radyoterapi ve görüntüleme cihazlarının doğru dozla çalışmasını sağlar. Hastane ekibinin bir parçasıdır.',
      ),
      kart(
        'Malzeme ve yarı iletken',
        'Yeni malzeme geliştirmek fizik ve kimyanın kesiştiği yer; işlemci üretiminin temeli burada.',
      ),
      kart(
        'Araştırma merkezleri',
        'TÜBİTAK ve üniversite laboratuvarları; yurt dışında CERN gibi merkezler. Türkiye CERN’e ortak üye.',
      ),
      kart(
        'Meteoroloji ve jeofizik',
        'Atmosferin ve yer kabuğunun davranışı fiziksel modellerle tahmin edilir; deprem araştırmaları da bu alanda.',
      ),
      kart(
        'Beklenmedik alanlar',
        'Fizik eğitimi veri analizi ve modelleme öğrettiği için finans ve yazılım da fizikçi istihdam eder.',
      ),
    ]),
  ]),
  tema('fzk9-t2', 'Kuvvet ve Hareket', [
    konu('fzk9-nicelik', 'Temel ve Türetilmiş Nicelikler', [
      kart(
        'Nicelik nedir?',
        'Ölçülebilen her özellik bir niceliktir. Ölçüm, niceliği birimiyle karşılaştırmaktır.',
      ),
      kart(
        'Temel nicelikler',
        'SI’da yedi tane vardır ve hiçbiri başka bir nicelikten türetilmez.',
        {
          tur: 'tablo',
          basliklar: ['Nicelik', 'Birim'],
          satirlar: [
            ['Uzunluk', 'metre (m)'],
            ['Kütle', 'kilogram (kg)'],
            ['Zaman', 'saniye (s)'],
            ['Akım', 'amper (A)'],
            ['Sıcaklık', 'kelvin (K)'],
            ['Madde miktarı', 'mol'],
            ['Işık şiddeti', 'kandela (cd)'],
          ],
        },
      ),
      kart(
        'Türetilmiş nicelikler',
        'Temel niceliklerden çarpma ve bölme ile elde edilir: hız (m/s), kuvvet (kg·m/s²), enerji (joule).',
      ),
      kart(
        'Birim önemlidir',
        'Sayı tek başına bilgi değildir. 1999’da bir Mars sondası birim karışıklığı yüzünden kaybedildi.',
      ),
      kart(
        'Ön ekler',
        'kilo bin katı, santi yüzde biri, mili binde biri, mikro milyonda biri. Hesaba girmeden önce birimler eşitlenir.',
      ),
      kart(
        'Boyut denetimi',
        'Bir denklemin iki tarafının birimi aynı olmalıdır. Tutmuyorsa denklem kesin yanlıştır — hesabı yapmadan anlaşılır.',
      ),
    ]),
    konu('fzk9-skaler-vektorel', 'Skaler ve Vektörel Nicelikler', [
      kart(
        'Skaler nicelik',
        'Yalnızca büyüklükle tanımlanır: kütle, zaman, sıcaklık, sürat, enerji.',
      ),
      kart(
        'Vektörel nicelik',
        'Büyüklüğün yanında yön de gerekir: kuvvet, hız, ivme, yer değiştirme.',
        {
          tur: 'tablo',
          basliklar: ['Skaler', 'Vektörel'],
          satirlar: [
            ['Yol', 'Yer değiştirme'],
            ['Sürat', 'Hız'],
            ['Kütle', 'Ağırlık'],
            ['Enerji', 'Kuvvet'],
          ],
        },
      ),
      kart(
        'Yol ve yer değiştirme',
        'Yol gidilen toplam uzunluk (skaler), yer değiştirme başlangıçtan bitişe çizilen ok (vektörel).',
      ),
      kart(
        'Sürat ve hız',
        'Sürat yolun zamana oranı, hız yer değiştirmenin. Pistte bir tur atan araç için ortalama hız sıfırdır.',
      ),
      kart(
        'Kütle ve ağırlık',
        'Kütle madde miktarıdır ve her yerde aynıdır; ağırlık ise kütleye etkiyen çekim kuvvetidir ve Ay’da azalır.',
      ),
      kart(
        'İşaret yön demektir',
        'Tek boyutta yön, artı ve eksi işaretiyle gösterilir. −5 m/s hız, 5 m/s ile aynı süratte ters yönde demektir.',
      ),
    ]),
    konu('fzk9-vektor', 'Vektörler', [
      kart(
        'Nasıl gösterilir?',
        'Ok ile: okun uzunluğu büyüklüğü, yönü ise vektörün yönünü verir.',
      ),
      kart(
        'Uç uca ekleme',
        'İlk vektörün ucuna ikincinin başı konur; ilkin başından sonuncunun ucuna çizilen ok bileşkedir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [1, 1],
                [6, 1],
              ],
              kirik: true,
              ok: true,
              ad: 'A',
            },
            {
              noktalar: [
                [6, 1],
                [8, 4.5],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
              ad: 'B',
            },
            {
              noktalar: [
                [1, 1],
                [8, 4.5],
              ],
              kirik: true,
              kesik: true,
              ok: true,
              renk: 'soluk',
            },
          ],
          etiketler: [{ x: 4, y: 3.3, ad: 'bileşke', renk: 'soluk' }],
        },
      ),
      kart(
        'Paralelkenar yöntemi',
        'İki vektör aynı noktadan çizilip paralelkenar tamamlanır; köşegen bileşkeyi verir. Uç uca eklemeyle aynı sonucu verir.',
      ),
      kart(
        'Bileşenlerine ayırma',
        'Bir vektör birbirine dik iki parçaya bölünebilir. Eğik düzlem problemleri bu yolla çözülür.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 5],
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5, 3.5],
              ],
              kirik: true,
              ok: true,
              ad: 'F',
            },
            {
              noktalar: [
                [0, 0],
                [5, 0],
              ],
              kirik: true,
              ok: true,
              kesik: true,
              renk: 'ikincil',
            },
            {
              noktalar: [
                [5, 0],
                [5, 3.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2.5, y: 0.5, ad: 'Fx', renk: 'ikincil' },
            { x: 5.7, y: 1.8, ad: 'Fy', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'En büyük, en küçük bileşke',
        'Aynı yönlüyse büyüklükler toplanır, zıt yönlüyse çıkarılır. Bileşke bu iki değer arasında kalır.',
      ),
      kart(
        'Dik vektörler',
        'İki vektör dikse bileşkenin büyüklüğü Pisagor ile bulunur: 3 ve 4 birimlik dik iki vektörün bileşkesi 5 birimdir.',
      ),
      kart(
        'Denge',
        'Bir cisme etkiyen vektörlerin bileşkesi sıfırsa cisim dengededir: ya durur ya sabit hızla gider.',
      ),
    ]),
    konu('fzk9-temel-kuvvet', 'Doğadaki Temel Kuvvetler', [
      kart(
        'Dört temel kuvvet',
        'Bütün etkileşimler dört kuvvete indirgenir; güç ve menzilleri birbirinden çok farklıdır.',
        {
          tur: 'tablo',
          basliklar: ['Kuvvet', 'Menzil'],
          satirlar: [
            ['Güçlü nükleer', 'Çekirdek boyu'],
            ['Elektromanyetik', 'Sonsuz'],
            ['Zayıf nükleer', 'Çekirdekten küçük'],
            ['Kütle çekim', 'Sonsuz'],
          ],
        },
      ),
      kart(
        'Kütle çekim',
        'En zayıfı ama menzili sonsuz ve hep çekicidir. Gezegenleri yörüngede tutan budur.',
      ),
      kart(
        'Elektromanyetik kuvvet',
        'Yükler arasında etkir, hem çeker hem iter. Sürtünme ve tepki gibi günlük kuvvetlerin kaynağı aslında budur.',
      ),
      kart(
        'Güçlü nükleer kuvvet',
        'Çekirdekteki protonlar birbirini iterken onları bir arada tutar. Menzili kısa ama şiddeti en büyüğüdür.',
      ),
      kart(
        'Zayıf nükleer kuvvet',
        'Radyoaktif bozunmadan sorumludur; Güneş’teki füzyon zincirinin başlaması da buna bağlıdır.',
      ),
      kart(
        'Neden en zayıfı baskın?',
        'Kütle çekim en zayıf olsa da yalnızca çekicidir ve birikir; elektrik kuvvetleri zıt yüklerle birbirini götürür.',
      ),
    ]),
    konu('fzk9-hareket', 'Hareket ve Hareket Türleri', [
      kart(
        'Hareket görecelidir',
        'Bir cismin hareketli sayılması seçilen referans noktasına bağlıdır. Otobüsteki yolcu yere göre hareketli, koltuğa göre durgundur.',
      ),
      kart(
        'Öteleme hareketi',
        'Cismin tüm noktaları aynı yönde ve aynı miktarda yer değiştirir. Düz yolda giden araba böyledir.',
      ),
      kart(
        'Dönme hareketi',
        'Cisim bir eksen çevresinde döner; noktalar eksene uzaklığına göre farklı yol alır. Tekerlek ve pervane örnektir.',
      ),
      kart(
        'Titreşim hareketi',
        'Denge noktası çevresinde ileri geri gidiş. Sarkaç ve yay ucundaki kütle böyle hareket eder.',
      ),
      kart(
        'Düzgün doğrusal hareket',
        'Hız sabittir, ivme sıfırdır. Yol-zaman grafiği bir doğru, hız-zaman grafiği yatay bir çizgidir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'zaman',
          yAd: 'konum',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5.5, 5.5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'İvme',
        'Hızın zamana göre değişimi. Hızlanmak, yavaşlamak ve yön değiştirmek — üçü de ivmelidir.',
      ),
      kart(
        'İvmeli hareket',
        'Hız düzgün değişiyorsa konum-zaman grafiği eğrilir; sabit ivmede bu eğri bir paraboldür.',
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
        'Serbest düşme',
        'Hava direnci yokken bütün cisimler aynı ivmeyle düşer: g ≈ 9,8 m/s². Kütle düşme süresini değiştirmez.',
      ),
    ]),
  ]),
  tema('fzk9-t3', 'Akışkanlar', [
    konu('fzk9-basinc', 'Basınç', [
      kart(
        'Tanımı',
        'Birim yüzeye dik olarak etkiyen kuvvet: P = F / A. Aynı kuvvet küçük alana uygulanırsa basınç büyür.',
      ),
      kart(
        'Birimi',
        'Pascal (Pa) = N/m². Bir metrekareye bir newtonluk kuvvet uygulandığındaki basınçtır.',
      ),
      kart(
        'Alanla ters orantı',
        'Kuvvet sabitken alan yarıya inerse basınç iki katına çıkar. Basınç-alan grafiği bu yüzden hiperboldür.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'alan',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [1, 5],
                [1.5, 3.3],
                [2, 2.5],
                [3, 1.7],
                [4, 1.25],
                [5, 1],
              ],
            },
          ],
        },
      ),
      kart(
        'Günlük örnekler',
        'Bıçağın ince ağzı ve çivinin sivri ucu alanı küçültüp basıncı artırır; kar ayakkabısı alanı büyütüp azaltır.',
      ),
      kart(
        'Katı basıncı',
        'Katılar basıncı yalnızca temas yüzeyine ve aşağı doğru iletir. Sıvı ve gazlar her yöne iletir.',
      ),
      kart(
        'Ağırlıktan gelen basınç',
        'Yere konan bir cismin uyguladığı basınç, ağırlığının temas alanına bölümüdür; cisim yan yatırılırsa basınç değişir.',
      ),
    ]),
    konu('fzk9-sivi-basinc', 'Sıvılarda Basınç', [
      kart(
        'Neye bağlı?',
        'Sıvının yoğunluğuna, derinliğe ve yer çekimi ivmesine bağlıdır. Kabın şekline ve sıvı miktarına bağlı değildir.',
      ),
      kart(
        'Derinlikle artar',
        'Üstteki sıvı sütununun ağırlığı arttığı için basınç derinlikle doğru orantılı büyür: P = h · d · g.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'derinlik',
          yAd: 'basınç',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5.5, 5],
              ],
              kirik: true,
            },
          ],
        },
      ),
      kart(
        'Her yöne iletir',
        'Durgun sıvı basıncı her yöne aynı şiddette iletir. Barajın alt duvarı bu yüzden daha kalın yapılır.',
      ),
      kart(
        'Pascal ilkesi',
        'Kapalı kaptaki sıvıya uygulanan basınç her noktaya aynen iletilir. Hidrolik fren ve kriko bununla çalışır.',
      ),
      kart(
        'Hidrolik kazanç',
        'Küçük pistona uygulanan az kuvvet, büyük pistonda büyük kuvvet verir; kazanılan kuvvet kadar yol kaybedilir.',
      ),
      kart(
        'Bileşik kaplar',
        'Birbirine bağlı kaplarda aynı sıvı, kapların şekli ne olursa olsun aynı seviyede durur.',
      ),
      kart(
        'Farklı sıvılar',
        'Bileşik kapta karışmayan iki sıvı varsa seviyeler eşit olmaz: yoğunluğu küçük olan daha yüksekte durur.',
      ),
    ]),
    konu('fzk9-acik-hava', 'Açık Hava Basıncı', [
      kart(
        'Havanın da ağırlığı var',
        'Atmosferdeki hava sütunu yeryüzüne basınç uygular. Deniz seviyesinde yaklaşık 101.325 Pa’dır.',
      ),
      kart(
        'Torricelli deneyi',
        'Cıva dolu ters çevrilmiş boruda cıva 76 cm’de durur. Bu yükseklik açık hava basıncının ölçüsüdür.',
      ),
      kart(
        'Neden 76 cm?',
        'Cıva sütununun ağırlığı, dışarıdaki havanın basıncını dengeler. Su kullanılsaydı sütun yaklaşık 10 metre olurdu.',
      ),
      kart(
        'Yükseklikle azalır',
        'Yukarı çıkıldıkça üstteki hava sütunu kısalır ve basınç düşer. Uçakta kulak tıkanmasının sebebi budur.',
        {
          tur: 'katman',
          eksenAdi: 'YÜKSEKLİK',
          katmanlar: [
            { ad: 'Uçuş yüksekliği', alt: '~25.000 Pa' },
            { ad: 'Yüksek dağ', alt: '~50.000 Pa' },
            { ad: 'Deniz seviyesi', alt: '101.325 Pa' },
          ],
        },
      ),
      kart(
        'Kaynama noktası düşer',
        'Basınç azalınca su daha düşük sıcaklıkta kaynar. Yüksek rakımda yemek bu yüzden geç pişer.',
      ),
      kart(
        'Günlük etkileri',
        'Pipetle içmek, vantuz ve şırınga açık hava basıncıyla çalışır; içerideki basınç düşürülür, dışarıdaki iter.',
      ),
    ]),
    konu('fzk9-kaldirma', 'Kaldırma Kuvveti', [
      kart(
        'Neden oluşur?',
        'Cismin alt yüzeyine etkiyen sıvı basıncı üst yüzeyindekinden büyüktür; aradaki fark yukarı doğru bir kuvvet üretir.',
      ),
      kart(
        'Arşimet ilkesi',
        'Kaldırma kuvveti, cismin taşırdığı sıvının ağırlığına eşittir.',
      ),
      kart(
        'Neye bağlı?',
        'Sıvının yoğunluğuna ve batan hacme bağlıdır. Cismin kütlesine ya da derinliğe bağlı değildir.',
      ),
      kart(
        'Yüzme koşulu',
        'Yüzüp yüzmemeyi iki yoğunluğun karşılaştırması belirler.',
        {
          tur: 'tablo',
          basliklar: ['Yoğunluk', 'Sonuç'],
          satirlar: [
            ['Cisim < sıvı', 'Yüzer'],
            ['Cisim = sıvı', 'Askıda kalır'],
            ['Cisim > sıvı', 'Batar'],
          ],
        },
      ),
      kart(
        'Görünen ağırlık',
        'Sıvıya batırılan cisim daha hafif gelir: dinamometre, gerçek ağırlıktan kaldırma kuvveti çıkmış değeri gösterir.',
      ),
      kart(
        'Gemi neden batmaz?',
        'Çelik yoğun ama gemi içi boştur; ortalama yoğunluğu suyunkinden küçük kaldığı için yüzer.',
      ),
      kart(
        'Gazlarda da vardır',
        'Balon havadan hafif gazla dolduğunda yükselir; havanın uyguladığı kaldırma kuvveti ağırlığından büyüktür.',
      ),
    ]),
    konu('fzk9-bernoulli', 'Bernoulli İlkesi', [
      kart(
        'Temel fikir',
        'Akışkanın sürati arttığı yerde çeperlere yaptığı basınç azalır.',
      ),
      kart(
        'Süreklilik',
        'Boru daralınca akışkan hızlanır; aynı miktar sıvı birim zamanda geçmek zorundadır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0.5, 5],
                [4, 5],
                [6, 3.6],
                [9.5, 3.6],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [0.5, 1],
                [4, 1],
                [6, 2.4],
                [9.5, 2.4],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [1.5, 3],
                [3, 3],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [6.5, 3],
                [9, 3],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 2.2, y: 2.1, ad: 'yavaş', renk: 'ana' },
            { x: 7.7, y: 2.1, ad: 'hızlı', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Enerjinin korunumu',
        'İlke aslında enerji korunumudur: hızlanan akışkanın kinetik enerjisi artarken basınç enerjisi azalır.',
      ),
      kart(
        'Uçak kanadı',
        'Kanadın üstünden geçen hava daha hızlıdır, basınç düşer; alttaki yüksek basınç kanadı yukarı iter.',
      ),
      kart(
        'Bacadaki çekiş',
        'Baca ağzından geçen rüzgâr basıncı düşürür ve içerideki dumanı yukarı çeker.',
      ),
      kart(
        'Günlük örnek',
        'Duş perdesinin içeri çekilmesi ve iki yaprağın arasına üflendiğinde birbirine yaklaşması aynı ilkedir.',
      ),
    ]),
  ]),
  tema('fzk9-t4', 'Enerji', [
    konu('fzk9-ic-enerji', 'İç Enerji, Isı ve Sıcaklık', [
      kart(
        'İç enerji',
        'Maddedeki taneciklerin kinetik ve potansiyel enerjilerinin toplamı. Madde miktarına bağlıdır.',
      ),
      kart(
        'Sıcaklık',
        'Taneciklerin ortalama kinetik enerjisinin ölçüsü. Madde miktarından bağımsızdır.',
      ),
      kart(
        'Isı',
        'Sıcaklık farkı yüzünden aktarılan enerji. Madde ısı içermez; ısı yalnızca aktarım sırasında vardır.',
      ),
      kart(
        'Üçü karıştırılıyor',
        'Üç kavram da enerjiyle ilgili ama farklı soruları yanıtlar.',
        {
          tur: 'tablo',
          basliklar: ['Kavram', 'Ne ölçer?'],
          satirlar: [
            ['İç enerji', 'Toplam enerji'],
            ['Sıcaklık', 'Ortalama enerji'],
            ['Isı', 'Aktarılan enerji'],
          ],
        },
      ),
      kart(
        'Kıvılcım ve kazan',
        'Kıvılcımın sıcaklığı yüksektir ama iç enerjisi azdır; ılık bir kazan daha çok enerji taşır.',
      ),
      kart(
        'Aktarım yönü',
        'Isı her zaman sıcaktan soğuğa akar. Ters yön kendiliğinden olmaz.',
      ),
      kart(
        'Sıcaklık birimleri',
        'Celsius suyun donma ve kaynamasına, Kelvin mutlak sıfıra dayanır: 0 K = −273,15 °C. Aradaki fark 273,15’tir.',
      ),
    ]),
    konu('fzk9-oz-isi', 'Isı, Öz Isı ve Isı Sığası', [
      kart(
        'Öz ısı',
        '1 gram maddenin sıcaklığını 1 °C artırmak için gereken ısı. Maddenin ayırt edici özelliğidir.',
      ),
      kart(
        'Suyun öz ısısı yüksek',
        'Su geç ısınır, geç soğur. Denizin havayı yumuşatması ve motor soğutmada su kullanılması bundandır.',
      ),
      kart(
        'Isı sığası',
        'Bütün cismin sıcaklığını 1 °C artırmak için gereken ısı. Öz ısı ile kütlenin çarpımıdır.',
      ),
      kart(
        'Öz ısı mı, ısı sığası mı?',
        'Öz ısı maddeye aittir ve kütleyle değişmez; ısı sığası o cisme aittir ve kütle büyüdükçe büyür.',
      ),
      kart(
        'Hesap',
        'Q = m · c · ΔT. Alınan ısı; kütle, öz ısı ve sıcaklık farkının çarpımına eşittir.',
      ),
      kart(
        'Grafikten öz ısı',
        'Sıcaklık-ısı grafiğinde eğim ne kadar dikse cisim o kadar çabuk ısınır; yatık doğru büyük öz ısı demektir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'verilen ısı',
          yAd: 'sıcaklık',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [3, 5.5],
              ],
              kirik: true,
              ad: 'küçük c',
            },
            {
              noktalar: [
                [0, 0],
                [5.5, 2.4],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'büyük c',
            },
          ],
        },
      ),
    ]),
    konu('fzk9-hal-degisim', 'Hâl Değişimi', [
      kart(
        'Sıcaklık sabit kalır',
        'Hâl değişirken alınan ısı sıcaklığı değil, tanecikler arası bağları değiştirmeye harcanır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, -20, 120],
          xAd: 'zaman',
          yAd: '°C',
          egriler: [
            {
              noktalar: [
                [0, -20],
                [1.5, 0],
                [3.5, 0],
                [6, 100],
                [8.5, 100],
                [9.5, 115],
              ],
              kirik: true,
            },
          ],
          etiketler: [
            { x: 2.5, y: 18, ad: 'erime', renk: 'ikincil' },
            { x: 7.3, y: 82, ad: 'kaynama', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Hâl değişimleri',
        'Erime, donma, buharlaşma, yoğuşma; katıdan doğrudan gaza geçiş süblimleşmedir.',
        {
          tur: 'akis',
          adimlar: [{ ad: 'Katı' }, { ad: 'Sıvı' }, { ad: 'Gaz' }],
        },
      ),
      kart(
        'Erime ve donma ısısı',
        '1 gram maddeyi eritmek için gereken ısı, aynı maddenin donarken verdiği ısıya eşittir.',
      ),
      kart(
        'Buharlaşma her sıcaklıkta',
        'Buharlaşma yüzeyde ve her sıcaklıkta olur; kaynama ise belirli bir sıcaklıkta sıvının her yerinde olur.',
      ),
      kart(
        'Buharlaşmayı hızlandıran',
        'Sıcaklık, yüzey alanı ve hava akımı buharlaşmayı hızlandırır; nemli hava yavaşlatır.',
      ),
      kart(
        'Neden serinletir?',
        'Terin buharlaşması için gereken ısı deriden çekilir; bu yüzden ter buharlaşırken vücut serinler.',
      ),
      kart(
        'Suyun tuhaflığı',
        'Su donarken genleşir. Buz sudan hafif olduğu için yüzer ve gölün yüzeyi donarken dibi sıvı kalır.',
      ),
    ]),
    konu('fzk9-isil-denge', 'Isıl Denge', [
      kart(
        'Ne demek?',
        'Temas eden cisimler aynı sıcaklığa geldiğinde net ısı akışı durur; bu duruma ısıl denge denir.',
      ),
      kart(
        'Alınan ısı = verilen ısı',
        'Yalıtılmış bir kapta sıcak cismin verdiği ısı, soğuk cismin aldığı ısıya eşittir.',
      ),
      kart(
        'Denge sıcaklığı',
        'Karışımın son sıcaklığı iki başlangıç sıcaklığının arasındadır; kütlesi ve öz ısısı büyük olana yakın çıkar.',
      ),
      kart(
        'Denge ortalama değildir',
        'İki farklı madde karıştığında sonuç iki sıcaklığın ortalaması olmaz; öz ısılar farklıysa denge ortadan kayar.',
      ),
      kart(
        'Termometre nasıl çalışır?',
        'Termometre ölçtüğü cisimle ısıl dengeye girer ve kendi sıcaklığını gösterir.',
      ),
      kart(
        'Denge durgunluk değil',
        'Dengede ısı alışverişi durmaz, iki yöne eşitlenir. Net akış sıfırdır ama tanecikler durmaz.',
      ),
    ]),
    konu('fzk9-aktarim', 'Isı Aktarım Yolları', [
      kart(
        'Üç yol',
        'Isı iletim, konveksiyon ve ışıma ile aktarılır. Aralarındaki fark taşıyıcının ne olduğudur.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Taşıyıcı'],
          satirlar: [
            ['İletim', 'Titreşen tanecik'],
            ['Konveksiyon', 'Akışkan hareketi'],
            ['Işıma', 'Ortam gerekmez'],
          ],
        },
      ),
      kart(
        'İletim',
        'Tanecikler yer değiştirmeden titreşerek enerjiyi komşusuna aktarır. Katılarda, özellikle metallerde baskındır.',
      ),
      kart(
        'Konveksiyon',
        'Isınan akışkan genleşip yükselir, soğuyan iner. Kalorifer odayı bu döngüyle ısıtır.',
      ),
      kart(
        'Işıma',
        'Enerji elektromanyetik dalgalarla taşınır ve ortam gerekmez. Güneş’in ısısı bize böyle ulaşır.',
      ),
      kart(
        'Renk ve ışıma',
        'Koyu ve mat yüzeyler ışımayı daha iyi soğurur ve yayar; parlak açık yüzeyler yansıtır.',
      ),
      kart(
        'Yalıtım',
        'Termos üç yolu birden keser: çift cidar arasında boşluk iletimi ve konveksiyonu, aynalı yüzey ışımayı engeller.',
      ),
    ]),
    konu('fzk9-iletim-hizi', 'Isı İletim Hızı', [
      kart(
        'Neye bağlı?',
        'Malzemenin cinsine, kesit alanına, iki uç arasındaki sıcaklık farkına ve uzunluğa bağlıdır.',
      ),
      kart(
        'Sıcaklık farkıyla doğru',
        'İki uç arasındaki fark büyüdükçe iletim hızlanır; fark sıfırsa akış durur.',
      ),
      kart(
        'Uzunlukla ters',
        'Yol uzadıkça iletim yavaşlar. Duvarın kalınlaştırılması ısı kaybını bu yüzden azaltır.',
      ),
      kart(
        'Kesit alanıyla doğru',
        'Kalın bir çubuk aynı sürede daha çok ısı taşır; alan iki katına çıkarsa iletim hızı da iki katına çıkar.',
      ),
      kart(
        'Neden metal soğuk hisseder?',
        'Metal ısıyı hızlı çektiği için elden ısı hızla akar. Aynı sıcaklıktaki tahta daha ılık hissedilir.',
      ),
      kart(
        'Yalıtkanlar',
        'Hava, köpük ve yün ısıyı yavaş iletir. Kışlık giysi aslında arasında tuttuğu havayla yalıtır.',
      ),
      kart(
        'Çift cam',
        'İki cam arasındaki durgun hava katmanı iletimi keser; camın kendisi değil, aradaki boşluk yalıtır.',
      ),
    ]),
  ]),
])
