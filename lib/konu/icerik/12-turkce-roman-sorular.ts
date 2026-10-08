import type { SoruKarti } from '../tip'
import { sorular } from './12-turkce-yardimci'

/**
 * 12. sınıf Edebiyat (2018 programı) — Roman, Tiyatro, Deneme ve Söylev
 * yoklamaları. Yanlış şık, kartlarda yan yana duran iki yazarın, eserin ya da
 * yılın karıştırılmasıdır.
 */
export const romanSoylevSorulari: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'trk12-roman-1923': sorular([
    ['Yaban, Yakup Kadri Karaosmanoğlu’nun 1932 tarihli romanıdır.', true, 'Aydın ile köylü arasındaki kopukluğu anlatır.'],
    ['Dokuzuncu Hariciye Koğuşu, Halide Edib Adıvar’ın romanıdır.', false, 'Bu roman Peyami Safa’nındır.'],
    ['Kürk Mantolu Madonna, Sabahattin Ali’nin 1937 tarihli romanıdır.', false, 'Kürk Mantolu Madonna 1943’tedir; 1937’de Kuyucaklı Yusuf çıktı.'],
    ['Huzur’un kahramanları Mümtaz ve Nuran’dır.', true, 'Huzur (1949) Tanpınar’ın İstanbul romanıdır.'],
    ['Yeşil Gece, Peyami Safa’nın romanıdır.', false, 'Yeşil Gece (1928) Reşat Nuri Güntekin’indir.'],
  ], [
    ['Sodom ve Gomore kimin romanıdır?', 'Yakup Kadri', 'Reşat Nuri', 'Reşat Nuri’nin romanları Yeşil Gece ve Yaprak Dökümü’dür.'],
    ['Vurun Kahpeye kimin romanıdır?', 'Halide Edib Adıvar', 'Peyami Safa', 'Peyami Safa’nın romanı Fatih-Harbiye’dir.'],
    ['Huzur hangi yıl yayımlandı?', '1949', '1943', '1943 Kürk Mantolu Madonna’nın yılıdır.'],
    ['Fatih-Harbiye kimin romanıdır?', 'Peyami Safa', 'Sabahattin Ali', 'Sabahattin Ali’nin romanı İçimizdeki Şeytan’dır.'],
    ['Yaprak Dökümü kimin romanıdır?', 'Reşat Nuri Güntekin', 'Halide Edib Adıvar', 'Halide Edib’in romanı Sinekli Bakkal’dır.'],
  ]),
  'trk12-roman-toplumcu': sorular([
    ['İnce Memed, Yaşar Kemal’in 1955 tarihli romanıdır.', true, 'Çukurova köylüsünü ve ağa zulmünü anlatır.'],
    ['Yılanların Öcü, Orhan Kemal’in romanıdır.', false, 'Yılanların Öcü Fakir Baykurt’undur.'],
    ['Bizim Köy 1923’te yayımlandı.', false, 'Mahmut Makal’ın Bizim Köy’ü 1950 tarihlidir.'],
    ['Murtaza, Orhan Kemal’in romanıdır.', true, '1952’de yayımlandı.'],
    ['Devlet Ana, Yaşar Kemal’in romanıdır.', false, 'Devlet Ana (1967) Kemal Tahir’indir.'],
  ], [
    ['Esir Şehrin İnsanları kimin romanıdır?', 'Kemal Tahir', 'Orhan Kemal', 'Orhan Kemal’in romanı Bereketli Topraklar Üzerinde’dir.'],
    ['Bereketli Topraklar Üzerinde kimin romanıdır?', 'Orhan Kemal', 'Yaşar Kemal', 'Yaşar Kemal’in romanı İnce Memed’dir.'],
    ['Ortadirek kimin romanıdır?', 'Yaşar Kemal', 'Fakir Baykurt', 'Ortadirek 1960 tarihli Yaşar Kemal romanıdır.'],
    ['Bizim Köy kimin kitabıdır?', 'Mahmut Makal', 'Fakir Baykurt', 'Fakir Baykurt’un romanı Yılanların Öcü’dür.'],
  ]),
  'trk12-roman-modern': sorular([
    ['Aylak Adam’ın kahramanı C.’dir.', true, 'Yusuf Atılgan’ın romanıdır (1959).'],
    ['Tutunamayanlar, Yusuf Atılgan’ın romanıdır.', false, 'Tutunamayanlar Oğuz Atay’ındır.'],
    ['Anayurt Oteli 1959’da yayımlandı.', false, 'Anayurt Oteli 1973’tedir; 1959’da Aylak Adam çıktı.'],
    ['Saatleri Ayarlama Enstitüsü’nün kahramanı Hayri İrdal’dır.', true, 'Tanpınar romanda bürokrasiyi hicveder.'],
    ['Ölmeye Yatmak, Oğuz Atay’ın romanıdır.', false, 'Ölmeye Yatmak Adalet Ağaoğlu’ndur.'],
  ], [
    ['Tehlikeli Oyunlar kimin romanıdır?', 'Oğuz Atay', 'Adalet Ağaoğlu', 'Adalet Ağaoğlu’nun romanı Ölmeye Yatmak’tır.'],
    ['Düşüncelerin sırasız, kesintisiz akışına ne denir?', 'Bilinç akışı', 'Diyalog', 'Bilinç akışında düşünceler kesintisiz verilir.'],
    ['Aylak Adam kimin romanıdır?', 'Yusuf Atılgan', 'Oğuz Atay', 'Oğuz Atay’ın romanları Tutunamayanlar ve Tehlikeli Oyunlar’dır.'],
    ['Saatleri Ayarlama Enstitüsü kimin romanıdır?', 'Tanpınar', 'Peyami Safa', 'Tanpınar’ın bu romanı 1961’de çıktı.'],
    ['Bir Düğün Gecesi kimin romanıdır?', 'Adalet Ağaoğlu', 'Sevgi Soysal', 'Bir Düğün Gecesi (1979) Adalet Ağaoğlu’ndur.'],
  ]),
  'trk12-roman-1980': sorular([
    ['Beyaz Kale, Orhan Pamuk’un 1985 tarihli romanıdır.', true, 'Kimlik temasını tarihî bir çerçevede işler.'],
    ['Sevgili Arsız Ölüm, İhsan Oktay Anar’ın romanıdır.', false, 'Bu roman Latife Tekin’indir.'],
    ['Orhan Pamuk 2010’da Nobel Edebiyat Ödülü’nü aldı.', false, 'Ödülü 2006’da aldı.'],
    ['Postmodern romanda gerçek ile kurmaca arasındaki sınır bilerek bulanıklaştırılır.', true, 'Üstkurmaca ve metinlerarasılık bu anlayışın araçlarıdır.'],
    ['Puslu Kıtalar Atlası 1960’ta yayımlandı.', false, 'Puslu Kıtalar Atlası 1995 tarihlidir.'],
  ], [
    ['Kara Kitap kimin romanıdır?', 'Orhan Pamuk', 'İhsan Oktay Anar', 'Puslu Kıtalar Atlası İhsan Oktay Anar’ındır.'],
    ['Puslu Kıtalar Atlası kimin romanıdır?', 'İhsan Oktay Anar', 'Latife Tekin', 'Latife Tekin’in romanı Sevgili Arsız Ölüm’dür.'],
    ['Romanın kendi kurmaca olduğunu hatırlatmasına ne denir?', 'Üstkurmaca', 'Betimleme', 'Üstkurmaca postmodern romanın araçlarındandır.'],
    ['Benim Adım Kırmızı hangi yıl yayımlandı?', '1998', '1990', '1990 Kara Kitap’ın yılıdır.'],
  ]),
  'trk12-roman-dunya': sorular([
    ['Cengiz Aytmatov Kırgız yazardır.', true, '1928–2008 arasında yaşadı.'],
    ['Abay Yolu, Cengiz Aytmatov’un romanıdır.', false, 'Abay Yolu Kazak yazar Muhtar Auezov’undur.'],
    ['Kafka’nın Dava romanı 1925’te yayımlandı.', true, 'Kafka’nın ölümünden sonra, 1925’te çıktı.'],
    ['1984 romanı Gabriel García Márquez’indir.', false, '1984 George Orwell’indir.'],
    ['Yüzyıllık Yalnızlık büyülü gerçekçiliğin tanınmış örneğidir.', true, 'García Márquez 1967’de yayımladı.'],
  ], [
    ['Gün Olur Asra Bedel kimin romanıdır?', 'Cengiz Aytmatov', 'Muhtar Auezov', 'Muhtar Auezov Abay Yolu’nu yazdı.'],
    ['Yabancı romanının yazarı kimdir?', 'Albert Camus', 'Franz Kafka', 'Kafka’nın romanı Dava’dır.'],
    ['Cemile’de olayı kim anlatır?', 'Seyit', 'Daniyar', 'Daniyar, Cemile’nin sevdiği kişidir.'],
    ['1984 hangi yıl yayımlandı?', '1949', '1967', '1967 Yüzyıllık Yalnızlık’ın yılıdır.'],
  ]),
  'trk12-tiyatro-kurumlar': sorular([
    ['Darülbedayi 1914’te kuruldu.', true, 'Sonradan İstanbul Şehir Tiyatroları adını aldı.'],
    ['Halkevleri 1949’da açıldı.', false, 'Halkevleri 1932’de açıldı.'],
    ['Ankara Sanat Tiyatrosu’nun kurucusu Genco Erkal’dır.', false, 'Ankara Sanat Tiyatrosu Cüneyt Gökçer’indir; Genco Erkal Dostlar Tiyatrosu’nu kurdu.'],
    ['Devlet Konservatuvarı 1936’da Ankara’da açıldı.', true, 'Tiyatro ve müzik sanatçıları burada yetişti.'],
    ['Bir Adam Yaratmak, Orhan Asena’nın oyunudur.', false, 'Bir Adam Yaratmak (1938) Necip Fazıl’ındır.'],
  ], [
    ['Dostlar Tiyatrosu’nu kim kurdu?', 'Genco Erkal', 'Cüneyt Gökçer', 'Cüneyt Gökçer 1955’te Ankara Sanat Tiyatrosu’nu kurdu.'],
    ['Devlet Tiyatroları hangi yıl kuruldu?', '1949', '1936', '1936 Devlet Konservatuvarı’nın yılıdır.'],
    ['Darülbedayi’nin tanınmış yönetmeni kimdir?', 'Muhsin Ertuğrul', 'Haldun Taner', 'Haldun Taner oyun yazarıdır.'],
    ['Bir Adam Yaratmak kimin oyunudur?', 'Necip Fazıl', 'Güngör Dilmen', 'Oyun 1938 tarihlidir.'],
  ]),
  'trk12-tiyatro-epik-absurt': sorular([
    ['Epik tiyatroda amaç seyirciyi duygulandırmak değil, düşündürmektir.', true, 'Yabancılaştırma seyircinin olaya kapılmasını önler.'],
    ['Keşanlı Ali Destanı, Vasıf Öngören’in oyunudur.', false, 'Keşanlı Ali Destanı Haldun Taner’indir.'],
    ['Godot’yu Beklerken, Brecht’in epik tiyatro oyunudur.', false, 'Godot’yu Beklerken Beckett’in absürt tiyatro oyunudur.'],
    ['Absürt tiyatroda mantıksal olay örgüsü bozulur.', true, 'Diyalog çoğu kez anlamsız ve döngüseldir.'],
    ['Asiye Nasıl Kurtulur, Melih Cevdet Anday’ındır.', false, 'Asiye Nasıl Kurtulur Vasıf Öngören’indir.'],
  ], [
    ['Epik tiyatro hangi yazarla özdeşleşir?', 'Bertolt Brecht', 'Samuel Beckett', 'Beckett absürt tiyatroyla anılır.'],
    ['Keşanlı Ali Destanı kimin oyunudur?', 'Haldun Taner', 'Vasıf Öngören', 'Vasıf Öngören Asiye Nasıl Kurtulur’u yazdı.'],
    ['Kel Şarkıcı kimin oyunudur?', 'Eugène Ionesco', 'Bertolt Brecht', 'Brecht epik tiyatroyu geliştirdi.'],
    ['Mikado’nun Çöpleri kimin oyunudur?', 'Melih Cevdet Anday', 'Haldun Taner', 'Haldun Taner Keşanlı Ali Destanı’nı yazdı.'],
  ]),
  'trk12-deneme': sorular([
    ['Deneme sözcüğü Fransızca essai’den gelir.', true, '“Denemek, sınamak” anlamına gelir.'],
    ['Francis Bacon, Denemeler’i 1580’de yayımladı.', false, '1580 Montaigne’in yılıdır; Bacon’ın Denemeler’i 1597’de çıktı.'],
    ['Montaigne İngiliz yazardır.', false, 'Montaigne Fransız yazardır.'],
    ['Nurullah Ataç sade Türkçeyi savunan bir denemecidir.', true, 'Günlerin Getirdiği ve Karalama onun kitaplarındandır.'],
    ['Bu Ülke, Azra Erhat’ın kitabıdır.', false, 'Bu Ülke Cemil Meriç’indir.'],
  ], [
    ['Mavi Anadolu kimin kitabıdır?', 'Azra Erhat', 'Sabahattin Eyüboğlu', 'Eyüboğlu’nun kitabı Mavi ve Kara’dır.'],
    ['Karalama kimin kitabıdır?', 'Nurullah Ataç', 'Cemil Meriç', 'Cemil Meriç Bu Ülke’yi yazdı.'],
    ['Mavi ve Kara kimin kitabıdır?', 'Sabahattin Eyüboğlu', 'Azra Erhat', 'Azra Erhat Mavi Anadolu’yu yazdı.'],
    ['Kişisel görüşü kesin hüküm vermeden anlatan tür hangisidir?', 'Deneme', 'Makale', 'Makale kanıta ve sisteme dayanır.'],
    ['Montaigne’in Denemeler’i hangi yıl çıktı?', '1580', '1597', '1597 Bacon’ın Denemeler’inin yılıdır.'],
  ]),
  'trk12-soylev': sorular([
    ['Nutuk, 15–20 Ekim 1927’de okundu.', true, 'Cumhuriyet Halk Fırkası’nın II. Büyük Kongresi’nde okundu.'],
    ['Gençliğe Hitabe, 10. Yıl Nutku’nun içinde yer alır.', false, 'Gençliğe Hitabe Nutuk’un sonundadır.'],
    ['Söylevde dinleyiciye doğrudan seslenilmez.', false, 'Seslenme söylevin temel özelliğidir.'],
    ['“Ne mutlu Türk’üm diyene” sözü 10. Yıl Nutku’nda geçer.', true, 'Nutuk 29 Ekim 1933’te okundu.'],
    ['Cicero, Antik Yunan’ın ünlü hatiplerindendir.', false, 'Cicero Romalıdır; Yunanlı hatipler Perikles ve Demosthenes’tir.'],
  ], [
    ['10. Yıl Nutku hangi tarihte okundu?', '29 Ekim 1933', '29 Ekim 1927', '1927, Nutuk’un yılıdır.'],
    ['Gençliğe Hitabe hangi eserin sonunda yer alır?', 'Nutuk', '10. Yıl Nutku', '10. Yıl Nutku ayrı bir konuşmadır.'],
    ['Orhun yazıtlarında halka seslenen kağan hangisidir?', 'Bilge Kağan', 'Kaşgarlı Mahmud', 'Kaşgarlı Mahmud sözlük yazarıdır.'],
    ['Nutuk hangi toplantıda okundu?', 'CHF II. Büyük Kongresi', 'TBMM açılışı', 'Nutuk 1927 kongresinde okundu.'],
  ]),
}
