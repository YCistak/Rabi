import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Türk Dili ve Edebiyatı — Maarif Modeli.
 *
 * Dört tema: **Sözün İnceliği**, **Anlam Arayışı**, **Anlamın Yapı
 * Taşları**, **Dilin Zenginliği**. Eski programın tür temelli
 * ünitelendirmesi (Hikâye, Şiir, Roman, Tiyatro…) kullanılmıyor; türler
 * temaların içinde geçiyor.
 */
export const turkce9 = program('turkce', 9, [
  tema('trk9-t1', 'Sözün İnceliği', [
    konu('trk9-edebiyat', 'Edebiyat ve Güzel Sanatlar', [
      kart(
        'Edebiyatın malzemesi dildir',
        'Ressamın boyası, bestecinin sesi neyse yazarın da dili odur. Edebiyat, güzel sanatların "dille yapılan" koludur.',
      ),
      kart(
        'Kurmaca nedir?',
        'Edebî metin gerçeği aktarmaz, yeniden kurar. Anlatılan yaşanmış olsa bile metindeki hâli kurmacadır.',
      ),
      kart(
        'Edebiyatın öteki bilimlerle ilişkisi',
        'Tarih dönemin olaylarını, sosyoloji toplumu, psikoloji insanı anlamak için edebî metne başvurur.',
      ),
      kart(
        'Metin türleri',
        'Olay çevresinde gelişen (hikâye, roman, tiyatro), duygu ağırlıklı (şiir) ve düşünce ağırlıklı (deneme, makale, fıkra) metinler.',
      ),
    ]),
    konu('trk9-siir', 'Şiir Bilgisi', [
      kart(
        'Nazım birimi',
        'Şiirin yapı taşı: dize (mısra), beyit (iki dize), dörtlük. Halk şiirinde dörtlük, divan şiirinde beyit kullanılır.',
      ),
      kart(
        'Ölçü',
        'Hece ölçüsünde dizelerin hece sayısı eşittir. Aruzda hecelerin uzunluk-kısalığı esastır. Serbest şiirde ölçü aranmaz.',
      ),
      kart(
        'Uyak ve redif',
        'Redif dize sonundaki **aynı görevdeki** ek ya da sözcüktür. Redifin önündeki ses benzerliği uyaktır. Önce redifi bul, kalan kısma uyak de.',
      ),
      kart(
        'Uyak çeşitleri',
        'Yarım uyak tek ses, tam uyak iki ses, zengin uyak ikiden çok ses benzerliğidir.',
      ),
      kart(
        'İmge',
        'Şairin sözcükleri alışılmadık biçimde birleştirip zihinde yeni bir görüntü kurmasıdır. Şiiri düzyazıdan ayıran asıl şey.',
      ),
    ]),
    konu('trk9-sanat', 'Söz Sanatları', [
      kart(
        'Benzetme (teşbih)',
        'Bir şeyi ortak yönü olan başka bir şeye benzetme. Dört ögesi vardır: benzeyen, kendisine benzetilen, benzetme yönü, benzetme edatı.',
      ),
      kart(
        'İstiare',
        'Benzetmenin iki temel ögesinden yalnız biri söylenirse istiare olur. "Aslanım geldi" derken benzeyen (kişi) söylenmemiştir.',
      ),
      kart(
        'Kişileştirme',
        'İnsana özgü nitelikleri başka varlıklara vermek: "Rüzgâr fısıldıyordu." Kişileştirme varsa kapalı istiare de vardır.',
      ),
      kart(
        'Mecaz-ı mürsel',
        'Benzetme amacı olmadan bir sözü başka bir sözün yerine kullanma: "Ankara açıklama yaptı" (hükûmet yerine şehir).',
      ),
      kart(
        'Tezat ve tevriye',
        'Tezat karşıt kavramları bir arada kullanmak; tevriye ise iki anlamlı bir sözü uzak anlamını kastederek söylemektir.',
      ),
    ]),
    konu('trk9-deneme', 'Deneme ve Düşünce Yazıları', [
      kart(
        'Deneme',
        'Yazarın bir konuda kendi düşüncelerini, kanıtlama kaygısı gütmeden, samimi bir dille anlattığı yazı. Kurucusu Montaigne.',
      ),
      kart(
        'Makale',
        'Bir düşünceyi kanıtlarla savunur. Nesnel dil kullanılır, kaynak gösterilir.',
      ),
      kart(
        'Fıkra (köşe yazısı)',
        'Güncel bir konuyu kısa ve kişisel bir üslupla ele alır; kanıtlama zorunluluğu yoktur.',
      ),
      kart(
        'Söyleşi ve eleştiri',
        'Söyleşi karşısında biri varmış gibi yazılır. Eleştiri bir eserin değerini ölçütlerle değerlendirir.',
      ),
    ]),
  ]),
  tema('trk9-t2', 'Anlam Arayışı', [
    konu('trk9-sozcuk', 'Sözcükte Anlam', [
      kart(
        'Gerçek anlam',
        'Sözcüğün akla ilk gelen, sözlükteki temel anlamı. "Soğuk su" gerçek anlamdır.',
      ),
      kart(
        'Mecaz anlam',
        'Sözcüğün gerçek anlamından tamamen uzaklaşarak kazandığı anlam: "soğuk davranış".',
      ),
      kart(
        'Yan anlam',
        'Gerçek anlamla bağı sürerken kazanılan yeni anlam: "masanın ayağı". Mecazla karıştırılır; yan anlamda benzerlik bağı durur.',
      ),
      kart(
        'Terim anlam',
        'Bir bilim, sanat ya da meslek alanına özgü anlam: "kök" matematikte, dil bilgisinde ve biyolojide ayrı şey demektir.',
      ),
      kart(
        'Somut ve soyut',
        'Duyularla algılanabilen somut, algılanamayan soyuttur. "Ağır çanta" somut, "ağır söz" soyut kullanımdır.',
      ),
    ]),
    konu('trk9-soz', 'Deyim, Atasözü ve Söz Öbekleri', [
      kart(
        'Deyim',
        'En az iki sözcükten oluşan, kalıplaşmış, çoğunlukla mecazlı anlatım. Öğüt vermez, bir durumu anlatır.',
      ),
      kart(
        'Atasözü',
        'Uzun deneyimden çıkmış, öğüt veren ya da genel kural bildiren kalıplaşmış söz. Deyimden ayıran şey budur.',
      ),
      kart(
        'İkileme',
        'Anlamı güçlendirmek için sözcüklerin yinelenmesi: "yavaş yavaş", "eğri büğrü". Arasına noktalama girmez.',
      ),
      kart(
        'Terim mi deyim mi?',
        'Deyimde sözcükler kendi anlamlarından uzaklaşır. "Göze girmek" deyim, "göz kapağı" değildir.',
      ),
    ]),
    konu('trk9-cumle', 'Cümlede Anlam', [
      kart(
        'Neden-sonuç',
        'Bir yargı ötekinin gerekçesidir: "Yağmur yağdığı için maç ertelendi." "İçin, -dığından, ile" bağlar.',
      ),
      kart(
        'Amaç-sonuç',
        'Eylemin niyetini bildirir: "Sınavı kazanmak için çalıştı." Neden-sonuçtan ayıran şey, sonucun henüz gerçekleşmemiş olmasıdır.',
      ),
      kart(
        'Koşul',
        'Bir yargı ötekine bağlıdır: "Erken gelirsen görüşürüz."',
      ),
      kart(
        'Öznellik ve nesnellik',
        'Doğruluğu kanıtlanabiliyorsa nesnel, kişiden kişiye değişiyorsa özneldir. "Roman 300 sayfa" nesnel, "roman sıkıcı" özneldir.',
      ),
      kart(
        'Örtülü anlam',
        'Söylenmediği hâlde cümleden çıkarılan yargı: "Bu yıl da kazanamadı" cümlesi önceki yılları da anlatır.',
      ),
    ]),
    konu('trk9-paragraf', 'Paragrafta Anlam', [
      kart(
        'Ana düşünce',
        'Paragrafın yazılma amacı, verilmek istenen asıl mesaj. Tek cümleyle özetlenebilir ve paragrafın tamamını kapsar.',
      ),
      kart(
        'Yardımcı düşünce',
        'Ana düşünceyi destekleyen ara yargılar. "Paragrafta değinilmemiştir" sorularının aradığı yer burasıdır.',
      ),
      kart(
        'Anlatım biçimleri',
        'Açıklayıcı (bilgi verir), tartışmacı (karşı görüşü çürütür), betimleyici (göstererek anlatır), öyküleyici (olayı akışıyla anlatır).',
      ),
      kart(
        'Düşünceyi geliştirme yolları',
        'Tanımlama, örneklendirme, karşılaştırma, tanık gösterme, sayısal veri. Tanık göstermede söyleyenin adı geçer, örnekte geçmez.',
      ),
      kart(
        'Paragrafın yapısı',
        'Giriş bağımsız cümleyle başlar, gelişme açar, sonuç toparlar. Akışı bozan cümle "anlam akışını bozan cümle"dir.',
      ),
    ]),
  ]),
  tema('trk9-t3', 'Anlamın Yapı Taşları', [
    konu('trk9-yapi', 'Anlatmaya Bağlı Metinlerin Yapısı', [
      kart(
        'Olay örgüsü',
        'Olayların metindeki diziliş biçimi. Gerçek zaman sırası değil, yazarın kurduğu sıradır.',
      ),
      kart(
        'Kişiler',
        'Metni ilerleten kişiler. Karakter değişip gelişir, tip ise tek bir özelliğin temsilcisidir (cimri tipi).',
      ),
      kart(
        'Mekân',
        'Yalnızca dekor değildir; kişinin ruh hâlini ve toplumsal konumunu da anlatır.',
      ),
      kart(
        'Zaman',
        'Olayın geçtiği süre ile anlatılma süresi farklı olabilir. Geri dönüşle geçmişe gidilebilir.',
      ),
    ]),
    konu('trk9-anlatici', 'Anlatıcı ve Bakış Açısı', [
      kart(
        'İlahi (hâkim) bakış açısı',
        'Anlatıcı her şeyi bilir; kişilerin aklından geçeni bile aktarır. Üçüncü kişi ağzından anlatılır.',
      ),
      kart(
        'Kahraman bakış açısı',
        'Anlatıcı olayın içindeki kişidir, yalnız kendi bildiğini anlatır. "Ben" ağzıyla yazılır.',
      ),
      kart(
        'Gözlemci bakış açısı',
        'Anlatıcı yalnızca dışarıdan görüleni aktarır, iç dünyaya giremez. Kamera gibi davranır.',
      ),
      kart(
        'Anlatıcı yazar değildir',
        'Anlatıcı da kurmacanın bir parçasıdır. "Ben" diyen anlatıcıyı yazarla karıştırmamak gerekir.',
      ),
    ]),
    konu('trk9-hikaye', 'Hikâye ve Roman', [
      kart(
        'Hikâye',
        'Tek bir olay çevresinde, az kişiyle, kısa sürede geçen anlatı. Roman ise çok olaylı ve geniş zamanlıdır.',
      ),
      kart(
        'Olay hikâyesi',
        'Maupassant tarzı: serim-düğüm-çözüm vardır, sonu bağlanır. Türk edebiyatında Ömer Seyfettin.',
      ),
      kart(
        'Durum hikâyesi',
        'Çehov tarzı: belirgin bir olay ve çözüm yoktur, bir an ve izlenim anlatılır. Türk edebiyatında Sait Faik.',
      ),
      kart(
        'Roman türleri',
        'Tarihî, sosyal, psikolojik, macera, polisiye. Ayrım, romanın ağırlık verdiği konuya göre yapılır.',
      ),
    ]),
    konu('trk9-tiyatro', 'Tiyatro', [
      kart(
        'Sahnelenmek için yazılır',
        'Tiyatro metni okunmak için değil oynanmak için yazılır. Bu yüzden anlatıcı yoktur, her şey diyalogla verilir.',
      ),
      kart(
        'Perde, sahne, replik',
        'Perde büyük bölüm, sahne kişilerin değişmesiyle oluşan alt bölüm, replik oyuncunun söylediği sözdür.',
      ),
      kart(
        'Trajedi ve komedi',
        'Trajedide soylu kişiler ve acı son, yüksek üslup vardır. Komedi güldürerek düşündürür, halktan kişileri konu alır.',
      ),
      kart(
        'Dram',
        'Hayatı acı ve gülünç yanlarıyla birlikte verir, üslup sınırı yoktur. Modern tiyatronun temeli.',
      ),
      kart(
        'Geleneksel Türk tiyatrosu',
        'Karagöz, orta oyunu, meddah ve köy seyirlik oyunları. Yazılı metne değil doğaçlamaya dayanır.',
      ),
    ]),
  ]),
  tema('trk9-t4', 'Dilin Zenginliği', [
    konu('trk9-ses', 'Ses Bilgisi', [
      kart(
        'Büyük ünlü uyumu',
        'Bir sözcüğün ünlüleri ya hep kalın (a, ı, o, u) ya hep incedir (e, i, ö, ü). "Kardeş, anne, kitap" gibi sözcükler kurala uymaz.',
      ),
      kart(
        'Küçük ünlü uyumu',
        'Düz ünlüden sonra düz; yuvarlak ünlüden sonra ya dar yuvarlak ya düz-geniş ünlü gelir.',
      ),
      kart(
        'Ünsüz benzeşmesi',
        'Sert ünsüzle biten sözcüğe "c, d, g" ile başlayan ek gelirse ek sertleşir: "kitap-cı" değil **kitapçı**.',
      ),
      kart(
        'Ünsüz yumuşaması',
        'p, ç, t, k ile biten sözcüğe ünlüyle başlayan ek gelince b, c, d, ğ olur: kitap → kitabı. Tek heceli sözcüklerin çoğu yumuşamaz.',
      ),
      kart(
        'Ünlü düşmesi ve türemesi',
        'İki heceli bazı sözcükler ünlü alınca hece kaybeder: burun → burnu. Türemede araya ses girer: bir → birici değil **birincisi**.',
      ),
    ]),
    konu('trk9-yazim', 'Yazım Kuralları', [
      kart(
        '"de" ayrı mı bitişik mi?',
        'Bulunma eki "-de" bitişik, bağlaç "de" ayrı yazılır. Cümleden çıkarıldığında anlam bozulmuyorsa bağlaçtır, ayrı yazılır.',
      ),
      kart(
        '"ki" kuralı',
        'Bağlaç olan "ki" ayrı yazılır. Yalnız "hâlbuki, mademki, sanki, oysaki, çünkü" kalıplaşmıştır, bitişiktir.',
      ),
      kart(
        'Soru eki mi',
        'Her zaman ayrı yazılır, kendinden önceki sözcüğe uyar: "geldi mi", "güzel mi güzel".',
      ),
      kart(
        'Büyük harf',
        'Özel adlar büyük harfle başlar. Özel ada gelen çekim ekleri kesme ile ayrılır: "Ankara’ya". Yapım eki ayrılmaz: "Türkçe".',
      ),
      kart(
        'Sayıların yazımı',
        'Metinde geçen küçük sayılar yazıyla yazılır. Büyük harfle başlayan yerlerde ve resmî belgelerde rakam kullanılır.',
      ),
    ]),
    konu('trk9-noktalama', 'Noktalama İşaretleri', [
      kart(
        'Virgül',
        'Eş görevli sözcükleri, sıralı cümleleri ve uzun özneyi ayırır. Ancak "ve" bağlacından önce virgül konmaz.',
      ),
      kart(
        'Noktalı virgül',
        'İçinde virgül bulunan sıralı cümleleri ayırır; ayrıca aynı türden öbekleri gruplar.',
      ),
      kart(
        'İki nokta',
        'Açıklama, örnek ya da alıntı gelecekse kullanılır. Sonrası cümleyse büyük, öbekse küçük harfle başlar.',
      ),
      kart(
        'Kesme işareti',
        'Özel adlara gelen **çekim** eklerini ayırır. Kurum adlarına gelen ekler ayrılmaz: "Türk Dil Kurumuna".',
      ),
      kart(
        'Üç nokta',
        'Sözün bittirilmediğini, alıntıda atlama yapıldığını ya da kaba sayılan sözlerin gizlendiğini gösterir.',
      ),
    ]),
    konu('trk9-varlik', 'Türkçenin Söz Varlığı', [
      kart(
        'Söz varlığı nedir?',
        'Bir dilin bütün sözcükleri, deyimleri, atasözleri ve kalıp sözleri. Dilin zenginliği sözcük sayısıyla değil, anlatım gücüyle ölçülür.',
      ),
      kart(
        'Türetme gücü',
        'Türkçe eklemeli bir dildir: tek kökten "göz, gözlük, gözlemci, gözetmek" gibi bir aile üretilebilir.',
      ),
      kart(
        'Alıntı sözcükler',
        'Her dil başka dillerden sözcük alır. Sorun alıntı değil, karşılığı varken kullanılan gereksiz alıntıdır.',
      ),
      kart(
        'Anlam ilişkileri',
        'Eş anlamlı (kara-siyah), zıt anlamlı (uzun-kısa), eş sesli (yüz: sayı / surat / eylem) sözcükler.',
      ),
    ]),
  ]),
])
