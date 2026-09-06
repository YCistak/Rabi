import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema, üçü de tarih aralığıyla adlandırılıyor. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Program konuları **başlık başlık olay** değil, dönem içindeki eksenler
 * olarak kuruyor: askerî mücadeleler, teşkilat, sosyal-ekonomik yaşam,
 * bilim-kültür. "İstanbul'un Fethi" ayrı bir konu değil, dönemin siyasi ve
 * askerî mücadeleleri içinde.
 */
export const tarih10 = program('tarih', 10, 'Türkistan’dan cihan devletine', [
  tema('trh10-t1', 'Türkistan’dan Türkiye’ye (1040-1299)', [
    konu('trh10-mucadele', 'Türkistan’dan Türkiye’ye Askerî Mücadeleler', [
      kart(
        'Dandanakan (1040)',
        'Selçuklular Gaznelileri yendi ve Büyük Selçuklu Devleti kuruldu. Türklerin batıya yönelişi hızlandı.',
      ),
      kart(
        'Malazgirt (1071)',
        'Alparslan Bizans ordusunu yendi. Anadolu Türk yerleşimine açıldı; kapı bir daha kapanmadı.',
      ),
      kart(
        'Miryokefalon (1176)',
        'Bizans’ın Anadolu’yu geri alma umudu bitti. Artık Anadolu’nun Türk yurdu olduğu kabul edildi.',
      ),
      kart(
        'Haçlı Seferleri',
        'Anadolu ve Suriye üzerinden gelen seferler Türk beyliklerini zorladı; sonuçta doğu-batı teması arttı.',
      ),
      kart(
        'Kösedağ (1243)',
        'Moğollar Türkiye Selçuklularını yendi. Merkezî otorite çöktü ve beylikler dönemi başladı.',
      ),
    ]),
    konu('trh10-teskilat', 'Türk Devlet ve Ordu Teşkilatındaki Değişim', [
      kart(
        'Bozkırdan devlete',
        'Boy birliğine dayalı yapı, İslam ve İran devlet geleneğiyle birleşerek merkezî bir bürokrasiye dönüştü.',
      ),
      kart(
        'Divan teşkilatı',
        'Büyük Divan yönetimin merkezi oldu; maliye, yazışma ve ordu işleri ayrı divanlara bölündü.',
      ),
      kart(
        'İkta sistemi',
        'Toprağın geliri hizmet karşılığı komutan ve askerlere verildi. Hazineden para çıkmadan ordu beslendi.',
      ),
      kart(
        'Ordu unsurları',
        'Gulam askerleri, ikta askerleri ve boy kuvvetleri. Farklı kaynaklar orduyu hem büyütüyor hem çeşitlendiriyordu.',
      ),
      kart(
        'Ülke hanedanın malı',
        'Eski Türk anlayışında ülke hanedanın ortak malıydı; bu anlayış taht kavgalarının ve bölünmenin kaynağıydı.',
      ),
    ]),
    konu('trh10-sosyal', 'Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri', [
      kart(
        'Yerleşiklik arttı',
        'Anadolu’ya gelen Türkler zamanla köy ve şehirlere yerleşti; konargöçerlik azaldı ama tümüyle bitmedi.',
      ),
      kart(
        'Ahilik',
        'Esnaf ve zanaatkâr birliği. Kalite denetimi, fiyat düzeni ve mesleki eğitimi birlikte yürütüyordu.',
      ),
      kart(
        'Vakıf sistemi',
        'Hayır kurumlarını finanse eden yapı: cami, medrese, imaret, hastane ve köprüler vakıflarla yaşadı.',
      ),
      kart(
        'Ticaret ve kervansaray',
        'Selçuklular yol boyunca kervansaray kurdu; yolcular üç gün ücretsiz konaklardı.',
      ),
      kart(
        'Tarım ve hayvancılık',
        'Ekonominin temeliydi. İkta sistemi toprağın boş kalmamasını da güvence altına alıyordu.',
      ),
    ]),
    konu('trh10-turk-islam', 'Türk-İslam Medeniyetinde Bilim, Kültür ve Sanat', [
      kart(
        'Medreseler',
        'Nizamülmülk’ün kurduğu Nizamiye medreseleri dönemin en düzenli yükseköğretim kurumlarıydı.',
      ),
      kart(
        'Bilim insanları',
        'Ömer Hayyam takvim çalışmalarıyla, Harezmî cebirle, İbn Sina tıpla iz bıraktı.',
      ),
      kart(
        'Türkçenin yazı dili olması',
        'Kutadgu Bilig ve Divânu Lugâti’t-Türk, Türkçenin bir kültür dili olarak yazıya geçişini gösterir.',
      ),
      kart(
        'Tasavvuf',
        'Mevlânâ, Yunus Emre ve Hacı Bektaş Veli’nin öğretisi Anadolu’nun kültürel dokusunu biçimlendirdi.',
      ),
      kart(
        'Mimari',
        'Kümbet, medrese, kervansaray ve çini süsleme; taş işçiliğinde Anadolu Selçuklu üslubu belirginleşti.',
      ),
    ]),
  ]),
  tema('trh10-t2', 'Beylikten Devlete Osmanlı (1299-1453)', [
    konu('trh10-kurulus', 'Osmanlı Devleti’nin Kuruluşuna Dair Görüşler', [
      kart(
        'Gaza ve cihat görüşü',
        'Osmanlı’yı uç bölgesindeki gaza ruhunun büyüttüğünü savunur. Sınır boyu savaşçıları devlete katıldı.',
      ),
      kart(
        'Aşiret görüşü',
        'Kayı boyuna dayanan aşiret yapısının çekirdek olduğunu ileri sürer.',
      ),
      kart(
        'Ahilik ve tasavvuf etkisi',
        'Ahi teşkilatının ve dervişlerin örgütleyici rolüne dikkat çeker.',
      ),
      kart(
        'Coğrafi konum',
        'Bizans sınırında, Balkanlara açılan bir uçta olması Osmanlı’ya büyüme alanı verdi.',
      ),
      kart(
        'Neden farklı görüşler?',
        'Kuruluş dönemine ait yazılı kaynak çok az; ilk kronikler olaylardan yaklaşık yüz yıl sonra yazıldı.',
      ),
    ]),
    konu('trh10-anadolu-rumeli', 'Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Rumeli’ye geçiş',
        'Çimpe Kalesi’nin alınmasıyla (1353) Osmanlı Balkanlara ayak bastı; genişleme buradan hızlandı.',
      ),
      kart(
        'Balkan zaferleri',
        'Sırpsındığı, I. Kosova ve Niğbolu ile Balkanlardaki Osmanlı varlığı kalıcılaştı.',
      ),
      kart(
        'Anadolu Türk birliği',
        'Beylikler savaş, satın alma ve evlilik yoluyla Osmanlı’ya katıldı; amaç Anadolu’da tek otoriteydi.',
      ),
      kart(
        'Ankara Savaşı (1402)',
        'Timur karşısında alınan yenilgi devleti dağıttı; Anadolu birliği bozuldu.',
      ),
      kart(
        'Fetret Devri',
        'Şehzadeler arasındaki on bir yıllık taht mücadelesi. Devlet Balkanlardaki düzen sayesinde ayakta kaldı.',
      ),
      kart(
        'İstanbul’un Fethi (1453)',
        'Orta Çağ kapandı. Osmanlı toprak bütünlüğünü sağladı ve imparatorluğa dönüştü.',
      ),
    ]),
    konu('trh10-devletlesme', 'Devletleşme Süreci: Ordu, Hukuk ve Toprak', [
      kart(
        'Tımar sistemi',
        'Toprağın vergi geliri sipahiye bırakıldı; sipahi hem üretimi denetledi hem asker yetiştirdi.',
      ),
      kart(
        'Devşirme ve yeniçeri',
        'Devşirilen çocuklar eğitilerek kapıkulu ordusuna alındı; merkeze bağlı sürekli bir ordu doğdu.',
      ),
      kart(
        'Örfi hukuk',
        'Şer’i hukukun yanında padişahın koyduğu kanunlar. Kanunnameler devlet düzenini yazılı hâle getirdi.',
      ),
      kart(
        'Divan-ı Hümayun',
        'Devletin en yüksek karar organı. Her tebaanın şikâyetini götürebildiği bir merci sayılırdı.',
      ),
      kart(
        'Üçü birbirini besledi',
        'Toprak düzeni orduyu, ordu güvenliği, güvenlik de üretimi ayakta tuttu. Biri bozulunca hepsi sarsıldı.',
      ),
    ]),
    konu('trh10-kalicilik', 'Fethettiği Topraklarda Kalıcı Olma Politikaları', [
      kart(
        'İskân politikası',
        'Fethedilen bölgelere Anadolu’dan nüfus yerleştirildi; bölge hem şenlendirildi hem güvenceye alındı.',
      ),
      kart(
        'İstimalet',
        'Yerli halka hoşgörülü davranma siyaseti: can, mal ve inanç güvenliği verildi, vergi yükü hafifletildi.',
      ),
      kart(
        'Mevcut düzeni koruma',
        'Yerel vergi ve toprak düzeni çoğu zaman korundu; ani değişiklik direnç üretiyordu.',
      ),
      kart(
        'İmar faaliyetleri',
        'Cami, han, hamam ve köprü ile şehirler yeniden canlandırıldı; bunlar aynı zamanda kalıcılığın işaretiydi.',
      ),
      kart(
        'Neden işe yaradı?',
        'Bizans yönetiminde ağır vergi altındaki köylü için Osmanlı düzeni çoğu zaman daha katlanılırdı.',
      ),
    ]),
    konu('trh10-ilim-irfan', 'İlim ve İrfan Geleneğinin Oluşması', [
      kart(
        'İlk medrese',
        'İznik’te açıldı (1331). Devletin ihtiyaç duyduğu kadı ve müderrisler burada yetişti.',
      ),
      kart(
        'Külliye',
        'Cami çevresinde medrese, imaret, hamam ve şifahaneden oluşan yapı topluluğu; şehrin çekirdeğiydi.',
      ),
      kart(
        'Öne çıkan adlar',
        'Molla Fenari ilk şeyhülislam, Davud-i Kayseri ilk medresenin başmüderrisi olarak anılır.',
      ),
      kart(
        'Tekke ve zaviyeler',
        'Dervişler uç bölgelerde hem yol güvenliği hem yerleşim sağladı; kültürel kaynaşmanın merkezleriydi.',
      ),
      kart(
        'Mekân ve kişi',
        'Gelenek yalnızca kitapla değil, o kitabın okutulduğu mekân ve onu okutan kişiyle sürüyordu.',
      ),
    ]),
  ]),
  tema('trh10-t3', 'Cihan Devleti Osmanlı (1453-1683)', [
    konu('trh10-siyasi', '1453-1683 Arasındaki Siyasi ve Askerî Mücadeleler', [
      kart(
        'Doğuda',
        'Çaldıran (1514) ile Safeviler durduruldu; Ridaniye (1517) ile Memlük toprakları alındı ve halifelik geçti.',
      ),
      kart(
        'Batıda',
        'Mohaç (1526) ile Macaristan, Preveze (1538) ile Akdeniz’de üstünlük kazanıldı.',
      ),
      kart(
        'En geniş sınırlar',
        'Kanuni döneminde devlet üç kıtaya yayıldı; Akdeniz bir Osmanlı denizi hâline geldi.',
      ),
      kart(
        'Dönüm noktaları',
        'İnebahtı (1571) donanmanın yenildiği ilk büyük çarpışma; II. Viyana Kuşatması (1683) batıya ilerleyişin sonu.',
      ),
      kart(
        'Uzun savaşlar',
        'İran ve Avusturya ile yıllarca süren savaşlar hazineyi ve tımar düzenini yıprattı.',
      ),
    ]),
    konu('trh10-yonetim-degisim', 'Yönetim ve Ordu Yapısındaki Değişim', [
      kart(
        'Sancağa çıkma kalktı',
        'Şehzadelerin taşrada yönetim öğrenmesi son buldu; yerine kafes usulü geldi ve deneyimsiz padişahlar arttı.',
      ),
      kart(
        'Ekber ve erşed',
        'Tahta hanedanın en yaşlı ve olgun üyesinin geçmesi kuralı; kardeş katlinin yerini aldı.',
      ),
      kart(
        'Tımarın çözülmesi',
        'Ateşli silahlar öne çıkınca sipahi önemini yitirdi; tımarlar iltizama döndü ve köylünün yükü arttı.',
      ),
      kart(
        'Yeniçerinin bozulması',
        'Devşirme kuralı gevşedi, sayı arttı, disiplin düştü. Yeniçeriler siyasete karışan bir güce dönüştü.',
      ),
      kart(
        'Sadrazamların ağırlığı',
        'Padişahlar geri çekilince yönetim sadrazamlara kaydı; Köprülüler dönemi bunun en belirgin örneğidir.',
      ),
    ]),
    konu('trh10-somurge', 'Avrupa’nın Sömürgeci Politikalarının Etkileri', [
      kart(
        'Coğrafi keşifler',
        'Yeni deniz yolları bulununca ticaret okyanuslara kaydı; İpek ve Baharat yolları önemini yitirdi.',
      ),
      kart(
        'Gümrük geliri düştü',
        'Osmanlı’nın transit ticaretten aldığı pay azaldı. Hazinenin en güvenilir gelirlerinden biri zayıfladı.',
      ),
      kart(
        'Fiyat devrimi',
        'Amerika’dan gelen gümüş Avrupa’ya, oradan Osmanlı’ya aktı; para değer kaybetti ve enflasyon yükseldi.',
      ),
      kart(
        'Kapitülasyonlar',
        'Başlangıçta ticareti canlandırmak için verilen ayrıcalıklar, zamanla yerli üreticiyi zorlayan bir yüke dönüştü.',
      ),
      kart(
        'Sanayi dengesi',
        'Avrupa ucuz ve bol mal üretmeye başlayınca Osmanlı loncaları rekabette geriledi.',
      ),
    ]),
    konu('trh10-isyan', 'Önemli İsyanların Neden ve Sonuçları', [
      kart(
        'Celali isyanları',
        'Anadolu’da ağır vergi, iltizam baskısı ve işsiz sekbanlar yüzünden çıktı. Köyler boşaldı, üretim düştü.',
      ),
      kart(
        'İstanbul isyanları',
        'Yeniçeri ve kapıkulu ayaklanmaları; ulufe ve cülus talepleriyle çıkıp padişah değiştirecek güce ulaştı.',
      ),
      kart(
        'Eyalet isyanları',
        'Merkezden uzak valilerin ayaklanması. Otoritenin zayıfladığı yerlerde yerel güçler öne çıktı.',
      ),
      kart(
        'Ortak sebep',
        'Uzun savaşlar, bozulan para, artan vergi ve tımar düzeninin çöküşü. İsyanlar sebep değil sonuçtu.',
      ),
      kart(
        'Sonuçları',
        'Can ve mal kaybı, göç, tarımsal üretimde düşüş ve merkezî otoritenin daha da zayıflaması.',
      ),
    ]),
    konu('trh10-bilim-kultur', '1453-1683 Arasında Bilim, Kültür ve Sanat', [
      kart(
        'Sahn-ı Seman',
        'Fatih’in kurduğu sekiz medrese, dönemin en üst düzey eğitim kurumuydu.',
      ),
      kart(
        'Coğrafya ve denizcilik',
        'Piri Reis’in haritası ve Kitab-ı Bahriye’si, Osmanlı denizcilik bilgisinin düzeyini gösterir.',
      ),
      kart(
        'Tarih ve düşünce',
        'Kâtip Çelebi hem coğrafya hem bibliyografya alanında yazdı; devletin sorunlarını da eleştirel biçimde ele aldı.',
      ),
      kart(
        'Mimar Sinan',
        'Şehzade, Süleymaniye ve Selimiye ile Osmanlı klasik mimarisinin doruğunu kurdu.',
      ),
      kart(
        'Edebiyat ve sanat',
        'Divan edebiyatında Fuzuli ve Baki; minyatür, hat ve çini kendi ekollerini oluşturdu.',
      ),
    ]),
  ]),
])
