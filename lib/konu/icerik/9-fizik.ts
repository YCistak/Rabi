import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Fizik — Maarif Modeli.
 *
 * Dört tema: **Fizik Bilimi ve Kariyer Keşfi**, **Kuvvet ve Hareket**,
 * **Akışkanlar**, **Enerji**. Eski programdaki "Madde ve Özellikleri"
 * ünitesi 9. sınıfta yok.
 */
export const fizik9 = program('fizik', 9, 'Fizik biliminden enerjiye', [
  tema('fzk9-t1', 'Fizik Bilimi ve Kariyer Keşfi', [
    konu('fzk9-bilim', 'Fizik Bilimi', [
      kart(
        'Fizik neyi inceler?',
        'Madde, enerji ve bunlar arasındaki etkileşimi inceler. Öteki fen bilimlerinin dayandığı temel bilimdir.',
      ),
      kart(
        'Alt dalları',
        'Mekanik hareketi, optik ışığı, termodinamik ısıyı, elektromanyetizma yük ve alanı, atom-nükleer fizik çekirdeği inceler.',
      ),
      kart(
        'Modelleme',
        'Fizik gerçeği sadeleştirerek anlatır: sürtünmesiz yüzey, noktasal cisim. Model gerçeğin kendisi değil, işe yarayan yaklaşımıdır.',
      ),
      kart(
        'Fiziğe yön verenler',
        'Galileo deneyi öne çıkardı, Newton hareketi matematikleştirdi, Einstein uzay ve zamanı birbirine bağladı.',
      ),
      kart(
        'Fizik tabanlı meslekler',
        'Mühendislik, tıp fiziği (radyoterapi), meteoroloji, havacılık, malzeme bilimi ve yazılımda simülasyon.',
      ),
    ]),
  ]),
  tema('fzk9-t2', 'Kuvvet ve Hareket', [
    konu('fzk9-nicelik', 'Nicelikler ve Birimler', [
      kart(
        'Temel nicelikler',
        'Yedi tane: uzunluk (m), kütle (kg), zaman (s), sıcaklık (K), akım (A), madde miktarı (mol), ışık şiddeti (cd).',
      ),
      kart(
        'Türetilmiş nicelik',
        'Temel niceliklerden çıkar: hız (m/s), kuvvet (N = kg·m/s²), enerji (J). Yeni bir tanım değil, birleşimdir.',
      ),
      kart(
        'Birim kontrolü işe yarar',
        'Bir denklemin iki tarafının birimi tutmuyorsa denklem yanlıştır. Sonucu kontrol etmenin en hızlı yolu.',
      ),
      kart(
        'Ölçmede belirsizlik',
        'Her ölçüm bir hata payı taşır. Cetvelin en küçük bölmesi 1 mm ise sonucu 0,01 mm duyarlıkla yazmak sahte bir kesinliktir.',
      ),
    ]),
    konu('fzk9-vektor', 'Skaler ve Vektörel Nicelikler', [
      kart(
        'Fark nedir?',
        'Skaler yalnızca büyüklüktür (kütle, zaman, sıcaklık). Vektörel nicelikte yön de vardır (kuvvet, hız, yer değiştirme).',
      ),
      kart(
        'Yol ve yer değiştirme',
        'Yol gidilen toplam uzunluk (skaler), yer değiştirme başlangıçla bitiş arasındaki vektör. Başladığın yere dönersen yol var, yer değiştirme sıfır.',
      ),
      kart(
        'Vektör toplama',
        'Aynı yönlüler toplanır, zıt yönlüler çıkarılır. Dik iki vektörün bileşkesi Pisagor ile bulunur.',
      ),
      kart(
        'Bileşenlere ayırma',
        'Eğik bir vektör yatay ve düşey bileşenlerine ayrılabilir. Eğik atış ve eğik düzlem soruları bununla çözülür.',
      ),
    ]),
    konu('fzk9-kuvvet', 'Kuvvet ve Denge', [
      kart(
        'Kuvvet ne yapar?',
        'Cismin hızını, yönünü ya da şeklini değiştirir. Birimi newton (N), vektörel bir niceliktir.',
      ),
      kart(
        'Net kuvvet',
        'Cisme etki eden kuvvetlerin bileşkesi. Net kuvvet sıfırsa cisim ya durur ya sabit hızla gider — ikisi de dengedir.',
      ),
      kart(
        'Doğadaki dört temel kuvvet',
        'Kütle çekim, elektromanyetik, güçlü nükleer ve zayıf nükleer. Günlük hayatta gördüğümüz sürtünme, gerilme gibi kuvvetler elektromanyetik kökenlidir.',
      ),
      kart(
        'Sürtünme kuvveti',
        'Harekete zıt yöndedir. Yüzeylerin cinsine ve cismin yüzeye uyguladığı dik kuvvete bağlıdır; temas alanına bağlı değildir.',
      ),
      kart(
        'Eylemsizlik',
        'Cisim durumunu korumak ister. Fren yapan otobüste öne savrulmanın sebebi budur; kütle arttıkça eylemsizlik artar.',
      ),
    ]),
    konu('fzk9-hareket', 'Hareket Türleri', [
      kart(
        'Hareket görecelidir',
        'Bir cismin hareketli olup olmadığı seçilen referans noktasına bağlıdır. Otobüsteki yolcu şoföre göre duruyor, yoldakine göre hareketli.',
      ),
      kart(
        'Düzgün doğrusal hareket',
        'Hız sabit, ivme sıfır. Eşit zamanlarda eşit yol alınır; yol-zaman grafiği doğrudur.',
      ),
      kart(
        'İvmeli hareket',
        'Hız zamanla değişir. İvme, hızdaki değişimin zamana oranıdır; hızla aynı yöndeyse hızlanma, zıtsa yavaşlama olur.',
      ),
      kart(
        'Grafik okuma',
        'Hız-zaman grafiğinde eğim ivmeyi, grafiğin altında kalan alan yer değiştirmeyi verir.',
      ),
      kart(
        'Dairesel ve titreşim hareketi',
        'Dairesel harekette hızın büyüklüğü sabit olsa da yön sürekli değiştiği için hareket ivmelidir. Sarkaç ve yay titreşim hareketi yapar.',
      ),
    ]),
  ]),
  tema('fzk9-t3', 'Akışkanlar', [
    konu('fzk9-basinc', 'Basınç', [
      kart(
        'Tanım',
        'Birim yüzeye dik uygulanan kuvvet: P = F/A. Birimi paskal (Pa). Aynı kuvvet küçük alana uygulanırsa basınç büyür — bıçağın ince olmasının sebebi.',
      ),
      kart(
        'Katı basıncı',
        'Yalnız ağırlığa ve temas alanına bağlıdır. Katılar basıncı **aynen** iletir, yönünü değiştirmez.',
      ),
      kart(
        'Sıvı basıncı',
        'P = h·d·g. Yalnız derinliğe, sıvının yoğunluğuna ve yer çekimine bağlıdır; kabın şekli ve sıvının miktarı basıncı değiştirmez.',
      ),
      kart(
        'Pascal ilkesi',
        'Kapalı kaptaki sıvıya uygulanan basınç her yöne aynen iletilir. Hidrolik fren ve kriko bu ilkeyle küçük kuvvetten büyük kuvvet üretir.',
      ),
      kart(
        'Açık hava basıncı',
        'Deniz seviyesinde yaklaşık 76 cm-Hg. Yükseldikçe azalır; Torricelli deneyiyle ölçülmüştür.',
      ),
    ]),
    konu('fzk9-kaldirma', 'Kaldırma Kuvveti', [
      kart(
        'Arşimet ilkesi',
        'Sıvıya batan cisme, taşırdığı sıvının ağırlığı kadar yukarı yönlü kuvvet etki eder.',
      ),
      kart(
        'Neye bağlı?',
        'Sıvının yoğunluğuna ve cismin **batan** hacmine bağlıdır. Cismin kütlesine ya da derinliğe bağlı değildir.',
      ),
      kart(
        'Yüzme, askıda kalma, batma',
        'Cismin yoğunluğu sıvıdan küçükse yüzer, eşitse askıda kalır, büyükse batar.',
      ),
      kart(
        'Gemi neden batmaz?',
        'Çelik yoğun ama geminin içi boştur; ortalama yoğunluğu suyunkinden küçük kalır.',
      ),
    ]),
    konu('fzk9-bernoulli', 'Bernoulli İlkesi', [
      kart(
        'Temel ifade',
        'Bir akışkanın hızı arttığı yerde basıncı azalır. Enerjinin korunumunun akışkanlardaki hâlidir.',
      ),
      kart(
        'Uçak kanadı',
        'Kanadın üstünden akan hava daha hızlıdır, orada basınç düşer; alt-üst basınç farkı kaldırma kuvveti üretir.',
      ),
      kart(
        'Günlük örnekler',
        'İki kâğıdın arasına üflenince kâğıtların birbirine yaklaşması, duş perdesinin içeri çekilmesi, spreyin çalışması.',
      ),
      kart(
        'Süreklilik',
        'Boru daralınca akışkanın hızı artar. Hortumun ucunu sıkınca suyun uzağa fışkırması bu yüzden.',
      ),
    ]),
  ]),
  tema('fzk9-t4', 'Enerji', [
    konu('fzk9-is', 'İş, Enerji ve Güç', [
      kart(
        'Fizikte iş',
        'W = F·x, kuvvet yönünde yol alınırsa iş yapılır. Duvarı ittiğin hâlde duvar hareket etmiyorsa fizik açısından iş sıfırdır.',
      ),
      kart(
        'Kuvvet dikse iş yok',
        'Kuvvet, yer değiştirmeye dikse iş yapmaz. Cebindeki kitabı yatay taşırken yer çekimi iş yapmaz.',
      ),
      kart(
        'Enerji',
        'İş yapabilme yeteneği. Birimi joule (J); iş ile enerji aynı birimi paylaşır çünkü iş, enerji aktarımıdır.',
      ),
      kart(
        'Güç',
        'Birim zamanda yapılan iş: P = W/t. Birimi watt. Aynı işi kısa sürede yapan makine daha güçlüdür, daha çok enerji harcamış olmaz.',
      ),
    ]),
    konu('fzk9-mekanik', 'Mekanik Enerji', [
      kart(
        'Kinetik enerji',
        'Hareketten gelen enerji: Ek = ½mv². Hız iki katına çıkarsa enerji dört katına çıkar — fren mesafesinin hızla hızla artmasının sebebi.',
      ),
      kart(
        'Potansiyel enerji',
        'Konumdan gelir. Çekim potansiyeli Ep = m·g·h; yayda ise esneklik potansiyel enerjisi depolanır.',
      ),
      kart(
        'Korunum',
        'Sürtünmesiz ortamda kinetik + potansiyel toplamı sabittir. Düşen cisimde potansiyel azalırken kinetik aynı oranda artar.',
      ),
      kart(
        'Sürtünme varsa',
        'Enerji yok olmaz, ısıya dönüşür. "Enerji kaybı" denen şey aslında biçim değiştirmedir.',
      ),
    ]),
    konu('fzk9-isi', 'Isı ve Sıcaklık', [
      kart(
        'Isı ile sıcaklık aynı değil',
        'Sıcaklık taneciklerin ortalama hareket enerjisidir, termometreyle ölçülür. Isı ise aktarılan enerjidir, kalorimetre kabıyla ölçülür.',
      ),
      kart(
        'Denizle bardak',
        'Denizin sıcaklığı bardaktaki sudan düşük olabilir ama ısı enerjisi çok daha fazladır: ısı kütleye de bağlıdır.',
      ),
      kart(
        'İç enerji',
        'Cismi oluşturan bütün taneciklerin enerjilerinin toplamı. Kütle arttıkça artar.',
      ),
      kart(
        'Isıl denge',
        'Isı her zaman sıcaktan soğuğa akar. Sıcaklıklar eşitlendiğinde akış durur.',
      ),
    ]),
    konu('fzk9-ozisi', 'Öz Isı ve Hâl Değişimi', [
      kart(
        'Öz ısı',
        '1 gram maddenin sıcaklığını 1 °C artırmak için gereken ısı. Maddeye özgüdür; suyun öz ısısı yüksektir, bu yüzden geç ısınır ve geç soğur.',
      ),
      kart(
        'Isı sığası',
        'Öz ısı × kütle. Maddeye değil **cisme** aittir: aynı maddeden yapılmış iki cismin öz ısısı aynı, ısı sığası farklı olabilir.',
      ),
      kart(
        'Hâl değişiminde sıcaklık sabit',
        'Erime ve kaynama sırasında verilen ısı sıcaklığı yükseltmez, hâli değiştirir. Grafikte yatay bölüm burasıdır.',
      ),
      kart(
        'Gizli ısı',
        'Hâl değiştirmek için gereken ısı. Buharlaşma ısısı erime ısısından çok daha büyüktür; ter buharlaşınca vücudu bu yüzden serinletir.',
      ),
    ]),
    konu('fzk9-aktarim', 'Isı Aktarım Yolları', [
      kart(
        'İletim',
        'Tanecikler yerinde titreşerek enerjiyi komşusuna aktarır. Katılarda, özellikle metallerde etkindir.',
      ),
      kart(
        'Konveksiyon (taşınma)',
        'Isınan akışkan genleşir, yoğunluğu düşer ve yükselir. Kalorifer peteğinin altta, klimanın üstte olmasının sebebi.',
      ),
      kart(
        'Işıma',
        'Ortam gerekmez, boşlukta da olur. Güneş enerjisi Dünya’ya bu yolla gelir. Koyu ve mat yüzeyler daha çok ışıma soğurur.',
      ),
      kart(
        'Yalıtım',
        'Amaç üç yolu da yavaşlatmak: çift cam arasındaki durgun hava iletimi ve taşınmayı, parlak yüzey ışımayı azaltır.',
      ),
    ]),
  ]),
])
