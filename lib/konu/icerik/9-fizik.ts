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
        'Deney ve model',
        'Fizik gözlemle başlar, model kurar, deneyle sınar. Deneyle çelişen model ne kadar zarif olursa olsun bırakılır.',
      ),
      kart(
        'Fizik ve matematik',
        'Matematik fiziğin dili. Bir yasa cümleyle anlatılabilir ama tahmin yapabilmesi için denkleme dönmesi gerekir.',
      ),
      kart(
        'Ölçme olmadan fizik olmaz',
        'Her ölçümün bir belirsizliği vardır. Sonucu belirsizliğiyle birlikte vermek, fiziğin dürüstlük kuralıdır.',
      ),
    ]),
    konu('fzk9-altdal', 'Fizik Biliminin Alt Dalları', [
      kart(
        'Mekanik',
        'Kuvvet, hareket ve dengeyi inceler. Köprüden gezegen yörüngesine kadar hareket eden her şey konusudur.',
      ),
      kart(
        'Termodinamik ve optik',
        'Termodinamik ısı ve enerji dönüşümlerini, optik ışığın davranışını inceler.',
      ),
      kart(
        'Elektromanyetizma',
        'Elektrik ve manyetizmayı tek çatı altında toplar. Elektrik motorundan radyo dalgasına kadar her şey buradan çıkar.',
      ),
      kart(
        'Modern fizik',
        'Atom altı ve ışık hızına yakın olaylar: kuantum fiziği ve görelilik. Klasik fiziğin yetmediği yerde başlar.',
      ),
    ]),
    konu('fzk9-bilim-insanlari', 'Fizik Bilimine Yön Verenler', [
      kart(
        'Newton',
        'Hareket yasalarını ve kütle çekimini tek çatı altında topladı. Gökteki ve yerdeki hareketin aynı yasaya uyduğunu gösterdi.',
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
        'Araştırma merkezleri',
        'TÜBİTAK ve üniversite laboratuvarları; yurt dışında CERN gibi merkezler. Türkiye CERN’e ortak üye.',
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
        'Temel nicelikler',
        'SI’da yedi tane: uzunluk, kütle, zaman, akım, sıcaklık, madde miktarı, ışık şiddeti. Başka nicelikten türetilmezler.',
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
    ]),
    konu('fzk9-skaler-vektorel', 'Skaler ve Vektörel Nicelikler', [
      kart(
        'Skaler nicelik',
        'Yalnızca büyüklükle tanımlanır: kütle, zaman, sıcaklık, sürat, enerji.',
      ),
      kart(
        'Vektörel nicelik',
        'Büyüklüğün yanında yön de gerekir: kuvvet, hız, ivme, yer değiştirme.',
      ),
      kart(
        'Yol ve yer değiştirme',
        'Yol gidilen toplam uzunluk (skaler), yer değiştirme başlangıçtan bitişe çizilen ok (vektörel).',
      ),
      kart(
        'Sürat ve hız',
        'Sürat yolun zamana oranı, hız yer değiştirmenin. Pistte bir tur atan araç için ortalama hız sıfırdır.',
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
      ),
      kart(
        'Paralelkenar yöntemi',
        'İki vektör aynı noktadan çizilip paralelkenar tamamlanır; köşegen bileşkeyi verir.',
      ),
      kart(
        'Bileşenlerine ayırma',
        'Bir vektör birbirine dik iki parçaya bölünebilir. Eğik düzlem problemleri bu yolla çözülür.',
      ),
      kart(
        'En büyük, en küçük bileşke',
        'Aynı yönlüyse büyüklükler toplanır, zıt yönlüyse çıkarılır. Bileşke bu iki değer arasında kalır.',
      ),
    ]),
    konu('fzk9-temel-kuvvet', 'Doğadaki Temel Kuvvetler', [
      kart(
        'Dört temel kuvvet',
        'Kütle çekim, elektromanyetik, güçlü nükleer ve zayıf nükleer kuvvet. Bütün etkileşimler bu dördüne indirgenir.',
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
        'Nükleer kuvvetler',
        'Güçlü kuvvet çekirdeği bir arada tutar; zayıf kuvvet radyoaktif bozunmadan sorumludur. Menzilleri çekirdek kadardır.',
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
        'İvme',
        'Hızın zamana göre değişimi. Hızlanmak, yavaşlamak ve yön değiştirmek — üçü de ivmelidir.',
      ),
    ]),
  ]),
  tema('fzk9-t3', 'Akışkanlar', [
    konu('fzk9-basinc', 'Basınç', [
      kart(
        'Tanımı',
        'Birim yüzeye dik olarak etkiyen kuvvet. Aynı kuvvet küçük alana uygulanırsa basınç büyür.',
      ),
      kart(
        'Birimi',
        'Pascal (Pa) = N/m². Bir metrekareye bir newtonluk kuvvet uygulandığındaki basınçtır.',
      ),
      kart(
        'Günlük örnekler',
        'Bıçağın ince ağzı ve çivinin sivri ucu alanı küçültüp basıncı artırır; kar ayakkabısı alanı büyütüp azaltır.',
      ),
      kart(
        'Katı basıncı',
        'Katılar basıncı yalnızca temas yüzeyine ve aşağı doğru iletir. Sıvı ve gazlar her yöne iletir.',
      ),
    ]),
    konu('fzk9-sivi-basinc', 'Sıvılarda Basınç', [
      kart(
        'Neye bağlı?',
        'Sıvının yoğunluğuna, derinliğe ve yer çekimi ivmesine bağlıdır. Kabın şekline ve sıvı miktarına bağlı değildir.',
      ),
      kart(
        'Derinlikle artar',
        'Üstteki sıvı sütununun ağırlığı arttığı için basınç derinlikle doğru orantılı büyür.',
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
        'Bileşik kaplar',
        'Birbirine bağlı kaplarda aynı sıvı, kapların şekli ne olursa olsun aynı seviyede durur.',
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
        'Yükseklikle azalır',
        'Yukarı çıkıldıkça üstteki hava sütunu kısalır ve basınç düşer. Uçakta kulak tıkanmasının sebebi budur.',
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
        'Cismin yoğunluğu sıvınınkinden küçükse yüzer, eşitse askıda kalır, büyükse batar.',
      ),
      kart(
        'Gemi neden batmaz?',
        'Çelik yoğun ama gemi içi boştur; ortalama yoğunluğu suyunkinden küçük kaldığı için yüzer.',
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
      ),
      kart(
        'Uçak kanadı',
        'Kanadın üstünden geçen hava daha hızlıdır, basınç düşer; alttaki yüksek basınç kanadı yukarı iter.',
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
        'Kıvılcım ve kazan',
        'Kıvılcımın sıcaklığı yüksektir ama iç enerjisi azdır; ılık bir kazan daha çok enerji taşır.',
      ),
      kart(
        'Aktarım yönü',
        'Isı her zaman sıcaktan soğuğa akar. Ters yön kendiliğinden olmaz.',
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
        'Hesap',
        'Q = m · c · ΔT. Alınan ısı; kütle, öz ısı ve sıcaklık farkının çarpımına eşittir.',
      ),
    ]),
    konu('fzk9-hal-degisim', 'Hâl Değişimi', [
      kart(
        'Sıcaklık sabit kalır',
        'Hâl değişirken alınan ısı sıcaklığı değil, tanecikler arası bağları değiştirmeye harcanır.',
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
        'Neden serinletir?',
        'Terin buharlaşması için gereken ısı deriden çekilir; bu yüzden ter buharlaşırken vücut serinler.',
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
        'Termometre nasıl çalışır?',
        'Termometre ölçtüğü cisimle ısıl dengeye girer ve kendi sıcaklığını gösterir.',
      ),
    ]),
    konu('fzk9-aktarim', 'Isı Aktarım Yolları', [
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
        'Uzunlukla ters',
        'Yol uzadıkça iletim yavaşlar. Duvarın kalınlaştırılması ısı kaybını bu yüzden azaltır.',
      ),
      kart(
        'Neden metal soğuk hisseder?',
        'Metal ısıyı hızlı çektiği için elden ısı hızla akar. Aynı sıcaklıktaki tahta daha ılık hissedilir.',
      ),
      kart(
        'Yalıtkanlar',
        'Hava, köpük ve yün ısıyı yavaş iletir. Kışlık giysi aslında arasında tuttuğu havayla yalıtır.',
      ),
    ]),
  ]),
])
