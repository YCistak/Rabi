import { tema } from '../tip'
import { edebiyatKonusu } from './12-turkce-yardimci'

/** Roman ve Tiyatro üniteleri (2018 programı, 12. sınıf). */
export const romanTiyatroTemalari = [
  tema('trk12-t4', 'Roman', [
    edebiyatKonusu({
      id: 'trk12-roman-1923', ad: 'Cumhuriyet Dönemi Romanı (1923–1950)',
      kartlar: [
        ['Dönemin çizgisi', 'Roman Kurtuluş Savaşı’nı, Anadolu’yu ve Batılılaşma tartışmasını işledi.\nToplumsal eleştiri ve gerçekçi gözlem öne çıktı.'],
        ['Yakup Kadri', 'Yakup Kadri Karaosmanoğlu şu romanları yazdı:\n- **Sodom ve Gomore:** 1928\n- **Yaban:** 1932\n- **Ankara:** 1934'],
        ['Yaban', 'Yaban, sakat kalan subay Ahmet Celâl ile Anadolu köylüsü arasındaki kopukluğu anlatır.\nAydın–halk uçurumu romanın ana temasıdır.'],
        ['Halide Edib Adıvar', 'Vurun Kahpeye (1923) Millî Mücadele’yi, Sinekli Bakkal (1936) eski İstanbul mahallesini anlatır.\nKadın kahramanlar önemli yer tutar.'],
        ['Reşat Nuri Güntekin', 'Yeşil Gece (1928) ve Yaprak Dökümü (1930) romanlarını yazdı.\nÇalıkuşu (1922) en çok okunan romanıdır.'],
        ['Peyami Safa', 'Dokuzuncu Hariciye Koğuşu (1930) hastane ve hastalık deneyimini anlatır.\nFatih-Harbiye (1931) Doğu–Batı karşılaşmasını işler.'],
        ['Sabahattin Ali', 'Kuyucaklı Yusuf (1937), İçimizdeki Şeytan (1940) ve Kürk Mantolu Madonna (1943) romanlarını yazdı.\nİnsan ruhunu toplumsal gerçekle birlikte işledi.'],
        ['Tanpınar’ın Huzur’u', 'Huzur (1949) İstanbul’da geçer; Mümtaz ile Nuran’ın aşkını anlatır.\nZaman, bellek ve Doğu–Batı uyumu temel konulardır.'],
      ],
      not: 'Yaban aydın ile köylü arasındaki uçurumu anlatır; kahramanı Ahmet Celâl’dir.', notKarti: 3,
      kontrol: ['Yaban romanının yazarı kimdir?', 'Yakup Kadri', 'Reşat Nuri', 'Yaban (1932) Yakup Kadri Karaosmanoğlu’nundur.', 3],
    }),
    edebiyatKonusu({
      id: 'trk12-roman-toplumcu', ad: 'Köy ve Toplumcu Gerçekçi Roman',
      kartlar: [
        ['Bağlam', 'Köyden kente göç, 1950’lerde roman konularını değiştirdi.\nToplumcu gerçekçilik köylü, işçi ve ağa ilişkilerini işledi.'],
        ['Köy edebiyatı', 'Mahmut Makal’ın Bizim Köy’ü (1950) köy yaşamını bir köylü öğretmenin gözüyle anlatır.\nKöy Enstitüleri bu çevrenin yetişmesini sağladı.'],
        ['İnce Memed', 'İnce Memed (1955), Yaşar Kemal’in Çukurova köylüsünü anlattığı romanıdır.\nKahraman ağa zulmüne başkaldıran bir halk kahramanıdır.'],
        ['Yaşar Kemal’in dünyası', 'Ortadirek (1960) ve Yer Demir Gök Bakır (1963) romanlarını yazdı.\nÇukurova, destan havası ve doğa betimlemeleri belirgindir.'],
        ['Orhan Kemal', 'Murtaza (1952) ve Bereketli Topraklar Üzerinde (1954) romanlarını yazdı.\nÇukurova işçilerini ve yoksulların yaşamını anlatır.'],
        ['Kemal Tahir', 'Esir Şehrin İnsanları (1956) ve Devlet Ana (1967) romanlarını yazdı.\nTarih ve Anadolu toplumunun yapısı ana temalarındandır.'],
        ['Fakir Baykurt', 'Yılanların Öcü (1959), yoksul Kara Bayram’ın muhtar ve onun adamlarıyla çatışmasını anlatır.\nKöy Enstitüsü çıkışlı bir yazardır.'],
        ['Anlatım özellikleri', 'Anlatıcı çoğunlukla üçüncü kişidir.\nYerel konuşma dili, tanıklık ve ağa–köylü çatışması öne çıkar.'],
      ],
      not: 'İnce Memed’de eşkıya, ağa zulmüne başkaldıran bir halk kahramanıdır.', notKarti: 3,
      kontrol: ['İnce Memed kimin romanıdır?', 'Yaşar Kemal', 'Kemal Tahir', 'İnce Memed 1955’te Yaşar Kemal tarafından yazıldı.', 3],
    }),
    edebiyatKonusu({
      id: 'trk12-roman-modern', ad: 'Bireysel ve Modernist Roman',
      kartlar: [
        ['Yeni arayış', '1950’den sonra roman, bireyin iç dünyasına yöneldi.\nBatı edebiyatının modern anlatı teknikleri Türk romanına girdi.'],
        ['Teknikler', '- **Bilinç akışı:** Düşünceler sırasız ve kesintisiz akar.\n- **İç monolog:** Kahraman kendi kendine konuşur.\n- **Zaman atlaması:** Anlatı geçmiş ile şimdi arasında gezinir.'],
        ['Aylak Adam', 'Yusuf Atılgan’ın Aylak Adam (1959) romanı, kahramanı C.’nin kentte amaçsızca dolaşmasını anlatır.\nYabancılaşma temadır.'],
        ['Anayurt Oteli', 'Anayurt Oteli (1973), otel işleten Zebercet’in yalnızlığını ve kendine yabancılaşmasını anlatır.\nYusuf Atılgan’ındır.'],
        ['Tutunamayanlar', 'Tutunamayanlar (1971–1972), Turgut Özben’in arkadaşı Selim Işık’ı anlama çabasını anlatır.\nOğuz Atay’ın romanında ironi ve parodi güçlüdür.'],
        ['Tehlikeli Oyunlar', 'Oğuz Atay’ın Tehlikeli Oyunlar’ı (1973) kurmaca ile gerçeğin iç içe geçtiği bir romandır.\nKahramanı Hikmet Benol’dur.'],
        ['Adalet Ağaoğlu', 'Ölmeye Yatmak (1973) ve Bir Düğün Gecesi (1979) romanlarını yazdı.\nBireyin ve toplumun hesaplaşmasını anlatır.'],
        ['Saatleri Ayarlama', 'Tanpınar’ın Saatleri Ayarlama Enstitüsü (1961) bürokrasiyi ve Batılılaşmayı hicveder.\nKahramanı Hayri İrdal’dır.'],
      ],
      not: 'Aylak Adam’da kahraman olaydan çok içindeki boşlukla anlatılır; adı C.’dir.', notKarti: 3,
      kontrol: ['Tutunamayanlar kimin romanıdır?', 'Oğuz Atay', 'Yusuf Atılgan', 'Tutunamayanlar Oğuz Atay’ın romanıdır.', 5],
    }),
    edebiyatKonusu({
      id: 'trk12-roman-1980', ad: '1980 Sonrası Roman ve Postmodernizm',
      kartlar: [
        ['Yeni dönem', '1980’den sonra roman, postmodern anlayışla yeni biçimler denedi.\nTarih, kimlik ve gerçeklik sorgulandı.'],
        ['Postmodern roman', '- **Üstkurmaca:** Roman kurmaca olduğunu hatırlatır.\n- **Metinlerarasılık:** Eski metinlere gönderme yapılır.\n- **Parodi:** Kalıplar eğlenceli biçimde yinelenir.'],
        ['Beyaz Kale', 'Orhan Pamuk’un Beyaz Kale’si (1985) tarihî bir çerçevede kimlik temasını işler.\nVenedikli köle ile Osmanlı hocası birbirine benzer.'],
        ['Orhan Pamuk', 'Kara Kitap (1990), Galip’in kayıp karısı Rüya’yı aramasını anlatır.\nBenim Adım Kırmızı (1998) minyatür sanatçıları çevresinde döner.\nPamuk 2006’da Nobel Edebiyat Ödülü’nü aldı.'],
        ['Latife Tekin', 'Sevgili Arsız Ölüm (1983) köyden kente göçen bir aileyi büyülü gerçekçi bir dille anlatır.\nHalk söyleyişi ve masalsı anlatım iç içedir.'],
        ['İhsan Oktay Anar', 'Puslu Kıtalar Atlası (1995), eski İstanbul’da geçen fantastik ögeli bir romandır.\nTarih, hayal ve oyun birbirine karışır.'],
        ['Postmoderni okumak', 'Anlatıcının güvenilirliğini ve gönderme yapılan metinleri sorgula.\nOlaydan çok kurgunun nasıl kurulduğuna bak.'],
      ],
      not: 'Postmodern romanda gerçek ile kurmaca arasındaki sınır bilerek bulanıklaştırılır.', notKarti: 3,
      kontrol: ['Beyaz Kale kimin romanıdır?', 'Orhan Pamuk', 'Latife Tekin', 'Beyaz Kale (1985) Orhan Pamuk’un romanıdır.', 3],
    }),
    edebiyatKonusu({
      id: 'trk12-roman-dunya', ad: 'Türk Dünyası ve Dünya Romanı',
      kartlar: [
        ['Türk dünyası romanı', 'Kırgız, Kazak ve Azerbaycan gibi toplulukların romanları ortak kültürden izler taşır.\nHer topluluğun yaşamı ve dili ayrıca kendine özgüdür.'],
        ['Cengiz Aytmatov', 'Kırgız yazardır (1928–2008).\nRomanlarında doğa, insan ve gelenek ilişkisi öne çıkar.'],
        ['Cemile', 'Cemile (1958) anlatıcı Seyit’in gözünden Cemile ile Daniyar’ın aşkını anlatır.\nLouis Aragon onu “dünyanın en güzel aşk hikâyesi” diye nitelemiştir.'],
        ['Gün Olur Asra Bedel', 'Gün Olur Asra Bedel (1980) demiryolu işçisi Yedigey’in öyküsünü anlatır.\nMankurt, belleğini yitirmiş insanı simgeler.'],
        ['Muhtar Auezov', 'Kazak yazar Muhtar Auezov, Abay Yolu romanıyla tanınır.\nRoman, şair Abay Kunanbayev’in yaşamını ve dönemini anlatır.'],
        ['20. yüzyıl dünya romanı', 'Kafka’nın Dava (1925) ve Camus’nün Yabancı (1942) romanları yabancılaşmayı ve absürdü işler.\nBu eserler varoluşçu düşünceyle ilişkilidir.'],
        ['Distopya ve büyülü gerçekçilik', '- **1984:** George Orwell, 1949; baskıcı bir gelecek toplumunu anlatır.\n- **Yüzyıllık Yalnızlık:** García Márquez, 1967; büyülü gerçekçiliğin tanınmış örneği.'],
      ],
      not: 'Cemile’de olayı anlatan Seyit’tir; aşk Cemile ile Daniyar arasındadır.', notKarti: 3,
      kontrol: ['Cemile kimin romanıdır?', 'Cengiz Aytmatov', 'Muhtar Auezov', 'Cemile (1958) Kırgız yazar Aytmatov’undur.', 3],
    }),
  ]),
  tema('trk12-t5', 'Tiyatro', [
    edebiyatKonusu({
      id: 'trk12-tiyatro-kurumlar', ad: 'Cumhuriyet Dönemi Tiyatrosu ve Kurumları',
      kartlar: [
        ['Darülbedayi', 'İstanbul’da 1914’te Darülbedayi adıyla kurulan topluluk Türk tiyatrosunun önemli kurumlarındandır.\nSonradan İstanbul Şehir Tiyatroları adını aldı.'],
        ['Muhsin Ertuğrul', '1892–1979 arasında yaşadı.\nDarülbedayi’nin yönetmeni ve oyuncusu olarak Batı oyunlarını sahneye taşıdı.'],
        ['Halkevleri', 'Halkevleri 1932’de açıldı.\nTiyatroyu halka götüren kurumlardan biri oldu.'],
        ['Devlet Konservatuvarı', '1936’da Ankara’da Devlet Konservatuvarı açıldı.\nTiyatro ve müzik sanatçıları burada yetişti.'],
        ['Devlet Tiyatroları', 'Devlet Tiyatroları 1949’da kuruldu.\nAnkara’da düzenli bir profesyonel sahne yapısı getirdi.'],
        ['Özel tiyatrolar', '- **Ankara Sanat Tiyatrosu:** 1963, Asaf Çiyiltepe\n- **Dostlar Tiyatrosu:** 1969, Genco Erkal'],
        ['Necip Fazıl', 'Bir Adam Yaratmak (1938), Necip Fazıl’ın tanınmış oyunudur.\nŞiirinin yanında tiyatro yazarlığıyla da anılır.'],
      ],
      not: 'Devlet Konservatuvarı 1936, Devlet Tiyatroları 1949: iki tarihi karıştırma.', notKarti: 3,
      kontrol: ['Devlet Konservatuvarı hangi yıl açıldı?', '1936', '1949', 'Devlet Tiyatroları ise 1949’da kuruldu.', 4],
    }),
    edebiyatKonusu({
      id: 'trk12-tiyatro-epik-absurt', ad: 'Epik ve Absürt Tiyatro',
      kartlar: [
        ['Epik tiyatro', 'Alman yazar Bertolt Brecht’in geliştirdiği tiyatro anlayışıdır.\nSeyircinin oyuna kapılması değil, düşünmesi amaçlanır.'],
        ['Özellikleri', '- **Yabancılaştırma:** Seyirci olayın içinde kaybolmaz.\n- **Anlatıcı ve şarkı:** Oyun yer yer kesilerek yorum yapılır.\n- **Amaç:** Toplumsal gerçeği sorgulatmak.'],
        ['Haldun Taner', 'Keşanlı Ali Destanı (1964), Brecht etkisiyle yazılmış müzikli bir oyundur.\nTürkçede epik tiyatronun tanınmış örneğidir.'],
        ['Vasıf Öngören', 'Vasıf Öngören de epik tiyatro çizgisinde oyunlar yazdı.\nAsiye Nasıl Kurtulur onun tanınmış oyunlarındandır.'],
        ['Absürt tiyatro', 'Mantıksal olay örgüsü bozulur; diyalog çoğu kez anlamsız ve döngüseldir.\nİnsanın anlamsız bir evrendeki durumu işlenir.'],
        ['Dünyadan örnekler', 'Beckett’in Godot’yu Beklerken (1953) ve Ionesco’nun Kel Şarkıcı (1950) oyunları bu türün örnekleridir.'],
        ['Türk tiyatrosunda absürt', 'Melih Cevdet Anday’ın Mikado’nun Çöpleri (1967), absürt tiyatronun Türkçedeki örnekleri arasında anılır.'],
      ],
      not: 'Epik tiyatroda amaç duygulandırmak değil, seyirciyi düşündürmektir.', notKarti: 3,
      kontrol: ['Epik tiyatroyu geliştiren yazar kimdir?', 'Bertolt Brecht', 'Samuel Beckett', 'Beckett absürt tiyatronun yazarıdır.', 1],
    }),
  ]),
]
