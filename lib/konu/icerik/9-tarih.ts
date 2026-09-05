import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema: **Geçmişin İnşa Sürecinde Tarih**, **Eski Çağ Medeniyetleri**,
 * **Orta Çağ Medeniyetleri**. Eski programın "Tarih ve Zaman / İnsanlığın
 * İlk Dönemleri / Orta Çağ’da Dünya / İlk ve Orta Çağlarda Türk Dünyası"
 * ünitelendirmesi değil; Türk tarihi ayrı ünite değil, temaların içinde.
 */
export const tarih9 = program('tarih', 9, 'Tarihin doğasından Orta Çağ’a', [
  tema('trh9-t1', 'Geçmişin İnşa Sürecinde Tarih', [
    konu('trh9-bilim', 'Tarih Bilimi ve Yöntemi', [
      kart(
        'Tarihin konusu',
        'Geçmişteki insan topluluklarının yaşayışını, yer ve zaman göstererek, neden-sonuç ilişkisi içinde inceler.',
      ),
      kart(
        'Deney yapılamaz',
        'Olay bir kez yaşanır ve tekrarlanamaz. Bu yüzden tarihte deney ve gözlem yerine kaynak eleştirisi kullanılır.',
      ),
      kart(
        'Yöntemin adımları',
        'Kaynak tarama → tasnif (sınıflandırma) → tahlil (çözümleme) → tenkit (eleştiri) → terkip (sentez).',
      ),
      kart(
        'Olay ve olgu',
        'Olay belirli yer ve zamanda olup biten tekil bir şeydir (Malazgirt Savaşı). Olgu uzun sürede oluşan genel durumdur (Anadolu’nun Türkleşmesi).',
      ),
      kart(
        'Tarafsızlık',
        'Tarihçi kendi çağının değerleriyle geçmişi yargılamaz. Olayı, olduğu dönemin koşullarında değerlendirir.',
      ),
    ]),
    konu('trh9-kaynak', 'Kaynaklar ve Yardımcı Bilimler', [
      kart(
        'Birinci ve ikinci el kaynak',
        'Olayın geçtiği döneme ait kaynaklar birinci eldir. Sonradan bunlara dayanarak yazılanlar ikinci eldir.',
      ),
      kart(
        'Kaynak türleri',
        'Yazılı (ferman, kitabe, mektup), sözlü (destan, efsane), kalıntı (silah, sikke) ve çizili-görsel kaynaklar.',
      ),
      kart(
        'Yardımcı bilimler',
        'Arkeoloji kazı, paleografya eski yazı, epigrafi kitabe, nümizmatik sikke, kronoloji zaman, filoloji dil inceler.',
      ),
      kart(
        'Tarih öncesi ve tarihî devir',
        'Ayıran ölçüt yazıdır. Yazının bulunmasından öncesi tarih öncesi devirlerdir ve buluntularla aydınlatılır.',
      ),
    ]),
    konu('trh9-zaman', 'Zaman ve Takvim', [
      kart(
        'Neden takvim?',
        'Zamanı ölçmek ve olayları sıralamak için. Takvimler ya Ay’ın ya Güneş’in hareketine dayanır.',
      ),
      kart(
        'Ay ve Güneş yılı',
        'Ay yılı 354, Güneş yılı 365 gündür. Aradaki 11 günlük fark, dinî günlerin her yıl kaymasının sebebidir.',
      ),
      kart(
        'Türklerin kullandığı takvimler',
        '12 Hayvanlı Türk, Hicri, Celali, Rumi ve Miladi takvim. Miladi takvim 1926’da kabul edildi.',
      ),
      kart(
        'Yüzyıl hesabı',
        'Bir yılın hangi yüzyıla ait olduğu, yüzler basamağına 1 eklenerek bulunur: 1453 → 15. yüzyıl.',
      ),
      kart(
        'Dijitalleşme ve tarih',
        'Arşivlerin sayısallaşması kaynağa erişimi kolaylaştırdı; ama üretilmesi kolay sahte içerik kaynak eleştirisini daha da gerekli kıldı.',
      ),
    ]),
  ]),
  tema('trh9-t2', 'Eski Çağ Medeniyetleri', [
    konu('trh9-tarim', 'Tarım Devrimi ve Yerleşik Hayat', [
      kart(
        'Tarım devrimi',
        'İnsanın besinini üretmeye başlaması. Avcı-toplayıcılıktan üreticiliğe geçiş, yerleşik hayatı zorunlu kıldı.',
      ),
      kart(
        'Sonuçları',
        'Artı ürün doğdu; iş bölümü, mülkiyet, ticaret, sınıflar ve nihayet devlet bu artı üründen çıktı.',
      ),
      kart(
        'Anadolu’daki ilk yerleşmeler',
        'Göbeklitepe, Çatalhöyük, Çayönü ve Hacılar. Göbeklitepe, tapınağın yerleşmeden önce gelmiş olabileceğini gösterdi.',
      ),
      kart(
        'Maden kullanımı',
        'İlk işlenen maden bakır. Bakıra kalay katılarak tunç, en son ve en zor işlenen maden olarak demir elde edildi.',
      ),
    ]),
    konu('trh9-mezopotamya', 'Mezopotamya ve Mısır', [
      kart(
        'Sümerler',
        'Yazıyı (çivi yazısı) bularak tarihi başlattılar. Site adı verilen şehir devletleri kurdular; Ur, Uruk, Lagaş.',
      ),
      kart(
        'İlk yazılı kanunlar',
        'Urgakina kanunları ilk yazılı kanunlardır. Hammurabi kanunları ise daha sert ve kısasa kısas esaslıdır.',
      ),
      kart(
        'Mısır’ın yalıtılmışlığı',
        'Çöllerle çevrili olduğu için uzun süre istila görmedi; bu yüzden kendine özgü bir uygarlık gelişti.',
      ),
      kart(
        'Mısır’da bilim',
        'Nil’in taşmasıyla bozulan tarla sınırlarını yeniden çizmek geometriyi, mumyacılık tıbbı ve anatomiyi geliştirdi.',
      ),
      kart(
        'Fenikeliler ve İbraniler',
        'Fenikeliler bugünkü alfabenin temelini attı ve deniz ticaretini geliştirdi. İbraniler ilk tek tanrılı inanç sistemini benimsedi.',
      ),
    ]),
    konu('trh9-anadolu', 'Anadolu Medeniyetleri', [
      kart(
        'Hititler',
        'Anadolu’da güçlü bir devlet kurdular. Kralın yanındaki Pankuş meclisi, kralın yetkisini sınırlayan ilk kurumlardandır.',
      ),
      kart(
        'Anal (yıllık)',
        'Hitit kralları yaptıklarını başarısızlıklarıyla birlikte yazdırdı. Bu, tarih yazıcılığının ilk örneklerinden sayılır.',
      ),
      kart(
        'Frigler ve Lidyalılar',
        'Frigler tarımı korumak için sert kanunlar koydu. Lidyalılar parayı icat ederek ticareti kolaylaştırdı; Kral Yolu’nu açtılar.',
      ),
      kart(
        'Urartular ve İyonlar',
        'Urartular kaya mimarisi ve su kanallarıyla, İyonlar ise özgür düşünce ortamı sayesinde bilim ve felsefeyle öne çıktı.',
      ),
    ]),
    konu('trh9-yonetim', 'Yönetim, Ordu ve Hukuk', [
      kart(
        'Devletin doğuşu',
        'Artı ürünün korunması ve dağıtılması için örgütlenme gerekti. Din adamı-yönetici ayrımı böyle başladı.',
      ),
      kart(
        'Teokratik yönetim',
        'İlk çağ devletlerinde yönetici çoğu zaman aynı zamanda dinî önderdi; gücünü tanrıdan aldığını iddia ederdi.',
      ),
      kart(
        'Ordu',
        'Önce halktan toplanan geçici kuvvetler, sonra sürekli ve ücretli ordular kuruldu. Sürekli ordu güçlü merkezî devlet demektir.',
      ),
      kart(
        'Hukukun gelişimi',
        'Sözlü gelenekten yazılı kanuna geçiş, keyfî cezayı azalttı. Yazılı kanun aynı zamanda devletin gücünün ilanıydı.',
      ),
    ]),
    konu('trh9-turkler', 'İlk Türk Toplulukları', [
      kart(
        'Konar-göçer hayat',
        'Hayvancılığa dayalı, otlak peşinde mevsimlik yer değiştiren yaşam. Başıboş dolaşmak değil, belirli güzergâhlarda düzenli hareket.',
      ),
      kart(
        'Yaşamın etkileri',
        'Taşınabilir eşya (kilim, halı, at koşumu) gelişti; kalıcı mimari ve yazılı edebiyat geç gelişti.',
      ),
      kart(
        'Orta Asya’dan göçler',
        'Kuraklık, otlak yetersizliği, nüfus artışı, boylar arası mücadele ve dış baskılar Türk göçlerinin başlıca sebepleridir.',
      ),
      kart(
        'Kurultay',
        'Devlet işlerinin görüşüldüğü meclis. Kağan tek başına değil, boy beyleriyle birlikte karar verirdi.',
      ),
      kart(
        'İlk Türk devletleri',
        'Asya Hun, Kök Türk ve Uygur. Kök Türkler Türk adını ilk kez devlet adı olarak kullandı; Orhun Yazıtları onlardan kaldı.',
      ),
    ]),
  ]),
  tema('trh9-t3', 'Orta Çağ Medeniyetleri', [
    konu('trh9-kavimler', 'Kavimler Göçü ve Sonuçları', [
      kart(
        'Göçün başlaması',
        'Batı Hunlarının baskısıyla Karadeniz’in kuzeyindeki kavimler Avrupa içlerine doğru harekete geçti (375).',
      ),
      kart(
        'Roma’nın bölünmesi',
        'Göç dalgası Roma’yı sarstı; imparatorluk 395’te ikiye ayrıldı, Batı Roma 476’da yıkıldı.',
      ),
      kart(
        'Yeni haritanın doğuşu',
        'Avrupa’da bugünkü milletlerin temeli atıldı; İlk Çağ kapandı, Orta Çağ başladı.',
      ),
      kart(
        'Feodalite',
        'Merkezî otorite çöktüğü için halk toprak sahibi senyörlerin korumasına sığındı. Toprağa bağlı serflik düzeni böyle kuruldu.',
      ),
    ]),
    konu('trh9-islam', 'İslam Medeniyetinin Doğuşu', [
      kart(
        'İslamiyet öncesi Arabistan',
        'Kabile düzeni, kan davaları ve putperestlik hâkimdi. Bu döneme Cahiliye Devri denir.',
      ),
      kart(
        'Hızlı yayılış',
        'Kısa sürede geniş alana yayıldı; fethedilen yerlerde yerel halkın inancına dokunulmaması bu yayılışı kolaylaştırdı.',
      ),
      kart(
        'Dört Halife Dönemi',
        'Halifenin seçimle belirlendiği dönem. Bu dönemin sonunda yönetim saltanata dönüştü.',
      ),
      kart(
        'Bilim ve çeviri',
        'Beytü’l-Hikme’de Yunan, Hint ve İran eserleri Arapçaya çevrildi. İbn Sînâ, Bîrûnî ve Hârizmî bu birikimden çıktı.',
      ),
    ]),
    konu('trh9-turk-islam', 'Türklerin İslamiyet’i Kabulü', [
      kart(
        'Talas Savaşı (751)',
        'Abbasi-Çin savaşında Karluklar Müslümanların yanında yer aldı. Türk-Arap yakınlaşmasının ve kâğıdın İslam dünyasına geçişinin dönüm noktası.',
      ),
      kart(
        'İlk Müslüman Türk devletleri',
        'Karahanlılar, Gazneliler ve Büyük Selçuklu. Karahanlılar Türkçeyi resmî dil olarak kullandı.',
      ),
      kart(
        'Malazgirt (1071)',
        'Anadolu’nun kapıları Türklere açıldı. Bu tarih Anadolu’nun Türkleşme sürecinin başlangıcı sayılır.',
      ),
      kart(
        'Selçuklu’da kurumlar',
        'Nizamülmülk’ün kurduğu medreseler (Nizamiye) eğitimi kurumsallaştırdı; ikta sistemi hem toprağı işletti hem ordu besledi.',
      ),
    ]),
    konu('trh9-ticaret', 'Ticaret Yolları ve Kültürel Etkileşim', [
      kart(
        'İpek Yolu',
        'Çin’den Anadolu’ya uzanan kara yolu. Yalnız mal değil; teknoloji, din ve hastalık da bu yolla taşındı.',
      ),
      kart(
        'Baharat Yolu',
        'Hindistan’dan Orta Doğu üzerinden Avrupa’ya uzanan yol. Denetimi, devletler arasındaki mücadelenin başlıca sebeplerinden biriydi.',
      ),
      kart(
        'Kervansaraylar',
        'Yol güvenliğini ve konaklamayı sağlayan yapılar. Selçuklular tüccarın zararını devlet güvencesine alarak sigortanın erken bir biçimini uyguladı.',
      ),
      kart(
        'Kültürel alışveriş',
        'Ticaret yolları boyunca alfabe, sayı sistemi, matbaa ve pusula gibi buluşlar kıtalar arasında dolaştı.',
      ),
    ]),
  ]),
])
