/**
 * Kavram Eşleştirme oyununun kavram–tanım havuzu.
 *
 * Son yılların TYT tarih sorularında en çok karşılaşılan terimler: İslamiyet
 * öncesi Türk devletlerinin yönetim sözlüğü, ilk Türk-İslam devletlerinin
 * kurumları, Osmanlı devlet düzeni ve toprak-vergi sistemi, yenileşme dönemi
 * ve Millî Mücadele–Cumhuriyet kavramları. ÖSYM bu terimleri çoğu zaman adıyla
 * değil tanımıyla soruyor ("yalnızca bu tanıma uyan kurum aşağıdakilerden
 * hangisidir"); oyun da tanımı kavramla eşleştiriyor.
 *
 * Tanımlar tek bir kavrama uymak zorunda. Bir tanım iki kavram için de doğru
 * olsaydı, çeldirici olarak geldiği tahtada oyuncunun doğru cevabı yanlış
 * sayılırdı — bu yüzden yakın terimler (öşür/haraç, ikta/tımar) ayırt edici
 * yanlarıyla yazıldı.
 */

import type { Zorluk } from './ritim'

export type KavramKonusu =
  | 'ilk-turk'
  | 'islam-tarihi'
  | 'turk-islam'
  | 'osmanli-siyasi'
  | 'osmanli-kurum'
  | 'degisim'
  | 'inkilap'

export type KavramEsi = {
  kavram: string
  tanim: string
  konu: KavramKonusu
  zorluk: Zorluk
}

export const KAVRAM_KONU_ADI: Record<KavramKonusu, string> = {
  'ilk-turk': 'İslamiyet öncesi Türk devletleri',
  'islam-tarihi': 'İslam tarihi',
  'turk-islam': 'İlk Türk-İslam devletleri',
  'osmanli-siyasi': 'Osmanlı kuruluş ve yükseliş',
  'osmanli-kurum': 'Osmanlı devlet düzeni',
  degisim: 'Yenileşme dönemi',
  inkilap: 'Millî Mücadele ve Cumhuriyet',
}

/**
 * `[kavram, tanım, zorluk?]` üçlülerini tek konuya bağlar; zorluk yazılmazsa orta.
 *
 * Antlaşma havuzunun tersine zorluk burada **kavram başına**: aynı konunun
 * içinde "Tımar" ile "Malikâne" arasında gerçek bir seviye farkı var. Tahta üç
 * kavram istiyor, dört değil; süzülmüş havuzda üç kavram bulmak kolay, o yüzden
 * mekanik de buna izin veriyor.
 */
function konu(
  konu: KavramKonusu,
  ciftler: [kavram: string, tanim: string, zorluk?: Zorluk][],
): KavramEsi[] {
  return ciftler.map(([kavram, tanim, zorluk = 'orta']) => ({ kavram, tanim, konu, zorluk }))
}

export const KAVRAM_HAVUZU: KavramEsi[] = [
  ...konu('ilk-turk', [
    ['Kurultay', 'Devlet işlerinin görüşüldüğü, kağanın başkanlık ettiği meclis.', 'kolay'],
    ['Kut', 'Yönetme yetkisinin Tanrı tarafından kağana ve ailesine verildiği inancı.', 'kolay'],
    ['Töre', 'Toplum hayatını düzenleyen, çoğu yazısız kurallardan oluşan Türk hukuku.', 'kolay'],
    ['Balbal', 'Ölenin mezarına, hayattayken yendiği düşman sayısınca dikilen küçük taşlar.', 'kolay'],
    ['Yuğ', 'Ölen kişinin ardından yapılan cenaze töreni.'],
    ['Kurgan', 'Ölünün eşyalarıyla birlikte gömüldüğü, oda biçiminde yapılmış mezar.'],
    ['Yabgu', 'Kağandan sonra gelen, ülkenin bir kanadını yöneten unvan.'],
    ['Tigin', 'Kağanın erkek çocuklarına verilen unvan.', 'zor'],
    ['Boy', 'Aynı soydan gelen ailelerin birleşmesiyle oluşan, beyin yönettiği topluluk.'],
    ['Onluk sistem', 'Ordunun onlu, yüzlü, binli bölüklere ayrıldığı ve Mete Han’a dayanan düzen.', 'kolay'],
    ['İkili teşkilat', 'Ülkenin doğu ve batı olmak üzere iki kanattan yönetilmesi.'],
    ['Ordu-millet', 'Savaşta bütün halkın asker sayıldığı, ayrıca ücretli ordu bulundurulmayan yapı.', 'zor'],
    ['Ötüken', 'Türklerin kutsal saydığı, devlet merkezi kabul edilen bölge.', 'zor'],
    ['Kağan', 'Türk devletlerinde ordunun başında bulunan, devleti yöneten en yüksek unvan.', 'kolay'],
    ['Hatun', 'Kağanın eşi; kurultaya katılabilen ve elçi kabul edebilen hükümdar eşi.', 'kolay'],
    ['Gök Tanrı inancı', 'Türklerin İslam öncesinde benimsediği, tek Tanrı’ya ve ahirete dayanan inanç.', 'kolay'],
    ['Orhun Yazıtları', 'II. Göktürklerden kalan, Türk adının geçtiği ilk Türkçe yazılı belgeler.', 'kolay'],
    ['Kavimler Göçü', 'Hunların batıya ilerlemesiyle Avrupa’daki kavimlerin yer değiştirdiği olay.', 'kolay'],
    ['İpek Yolu', 'Çin’den Akdeniz’e uzanan, Türk devletlerinin denetimi için savaştığı ticaret yolu.', 'kolay'],
    ['Budun', 'Boyların bir araya gelmesiyle oluşan halk, millet.', 'kolay'],
    ['Kışlak', 'Konar-göçer Türklerin kışı geçirdiği, korunaklı ovalık yerleşme yeri.', 'kolay'],
    ['Yaylak', 'Konar-göçer Türklerin yaz aylarında hayvan otlatmak için çıktığı yüksek yer.'],
    ['Kam', 'Gök Tanrı inancında ayinleri yöneten, hekimlik de yapan din adamı.'],
    ['Oguş', 'Türk toplumunun en küçük birimi olan aile.'],
    ['Damga', 'Boyların hayvanlarını ve eşyalarını ayırt etmek için kullandığı işaret.'],
    ['Manihaizm', 'Uygurların bir dönem benimsediği, et yemeyi ve savaşmayı yasaklayan din.'],
    ['Şölen', 'Zafer ya da bayram sonrasında verilen, halkın katıldığı yemekli tören.'],
    ['İl', 'Budunların tek yönetim altında birleşmesiyle kurulan devlet.'],
    ['Bengü taş', 'Kağanların olaylarını anlatmak için diktirdiği yazılı anıt taşı.'],
    ['Şad', 'Kağan soyundan gelenlerin taşıdığı, bölge ve ordu yöneticiliği unvanı.', 'zor'],
    ['Ayguci', 'Kağana devlet işlerinde danışmanlık yapan, başbakan konumundaki görevli.', 'zor'],
    ['Tamgacı', 'Devletin mühür işlerini ve yazışmalarını yürüten görevli.', 'zor'],
    ['Tudun', 'Göktürk ve Hazarlarda vergi toplama ile denetimden sorumlu memur.', 'zor'],
    ['Urug', 'Birkaç ailenin birleşmesiyle oluşan, boyun alt birimi olan sülale.', 'zor'],
    ['Uçmağ', 'Gök Tanrı inancında iyilerin gittiğine inanılan yer.', 'zor'],
  ]),

  /*
    İslam tarihi ayrı konu: Emevi-Abbasi kurumları (beytülmal, muhtesip, berid)
    ile Osmanlı kurumları birbirine benziyor; aynı tahtada karışırlardı.
  */
  ...konu('islam-tarihi', [
    ['Hicret', 'Hz. Muhammed’in Mekke’den Medine’ye göçü; hicri takvimin başlangıcı.', 'kolay'],
    ['Cahiliye', 'İslam öncesi Arap toplumunun putperestlik ve kabile kavgalarıyla anılan dönemi.', 'kolay'],
    ['Muhacir', 'Mekke’den Medine’ye göç eden Müslümanlara verilen ad.', 'kolay'],
    ['Ensar', 'Medine’de göçmen Müslümanları evlerinde ağırlayan yerli Müslümanlar.', 'kolay'],
    ['Veda Hutbesi', 'Hz. Muhammed’in son haccında eşitlik ve insan haklarına dair yaptığı konuşma.', 'kolay'],
    ['Dört Halife Dönemi', 'Halifelerin seçimle iş başına geldiği 632-661 arasındaki dönem.', 'kolay'],
    ['Zekât', 'Belli bir servete ulaşan Müslümanın malından yılda bir kez verdiği dinî vergi.', 'kolay'],
    ['Ganimet', 'Savaşta ele geçirilen ve beşte biri devlet hazinesine ayrılan mallar.', 'kolay'],
    ['Talas Savaşı', 'Türklerle Arapların Çin’i yendiği, kâğıdın Müslümanlara geçtiği savaş.', 'kolay'],
    ['Ridde Savaşları', 'Hz. Ebubekir’in dinden dönenlere ve zekât vermeyenlere karşı yaptığı savaşlar.'],
    ['Beytülmal', 'İslam devletinde gelirlerin toplandığı ve harcandığı devlet hazinesi.'],
    ['Mevali', 'Emeviler döneminde Arap olmayan Müslümanlara verilen, onları aşağılayan ad.'],
    ['Haraç', 'Gayrimüslimlerin ellerindeki toprağı işledikleri için ödedikleri vergi.'],
    ['Cemel Vakası', 'Hz. Ali ile Hz. Ayşe taraftarları arasındaki, Müslümanların ilk iç savaşı.'],
    ['Sıffin Savaşı', 'Hz. Ali ile Muaviye arasında yapılan ve hakem olayına yol açan savaş.'],
    ['Hakem Olayı', 'Halifelik anlaşmazlığının iki hakeme bırakıldığı, Müslümanları bölen girişim.'],
    ['Kerbela Olayı', 'Hz. Hüseyin ve yakınlarının öldürülmesiyle mezhep ayrılığını derinleştiren olay.'],
    ['Mescid-i Nebevi', 'Medine’de ibadetin yanında eğitim ve yönetim merkezi olarak da kullanılan cami.'],
    ['Şuubiye', 'Arap olmayan Müslümanların Araplardan üstün olduğunu savunan akım.', 'zor'],
    ['Beytülhikme', 'Abbasilerde yabancı eserlerin Arapçaya çevrildiği bilim ve tercüme merkezi.', 'zor'],
    ['Emirü’l-ümera', 'Abbasilerde halifenin yönetim yetkilerini eline geçiren askerî komutanlık.', 'zor'],
    ['Muhtesip', 'Çarşı ve pazarda ölçü, tartı ile ahlak kurallarını denetleyen görevli.', 'zor'],
    ['Berid teşkilatı', 'İslam devletlerinde posta ve haber alma işlerini yürüten teşkilat.', 'zor'],
    ['Suffe', 'Mescid-i Nebevi’nin yanında kurulan, ilk İslam eğitim kurumu sayılan bölüm.', 'zor'],
    ['Divanü’l-cünd', 'Hz. Ömer’in kurduğu, askerlerin adlarını ve maaşlarını kaydeden divan.', 'zor'],
  ]),

  ...konu('turk-islam', [
    ['İkta', 'Vergi geliri, asker yetiştirmesi karşılığında komutan ve görevlilere bırakılan toprak.', 'kolay'],
    ['Atabey', 'Şehzadelerin eğitiminden ve yetiştirilmesinden sorumlu deneyimli devlet adamı.', 'kolay'],
    ['Divan-ı Mezalim', 'Halkın görevlilerden şikâyetlerinin görüşüldüğü, sultanın başkanlık ettiği yüksek mahkeme.'],
    ['Gulam', 'Küçük yaşta alınıp sarayda yetiştirilen, doğrudan hükümdara bağlı asker sistemi.'],
    ['Nizamiye Medresesi', 'Nizamülmülk’ün kurduğu, öğrencisine burs veren ilk düzenli medreseler.'],
    ['Ahilik', 'Esnaf ve zanaatkârları birleştiren, kalite ile ahlak kurallarını belirleyen Anadolu teşkilatı.', 'kolay'],
    ['Melik', 'Ülkenin bir bölgesini yöneten, hanedan soyundan gelen vali.', 'zor'],
    ['Kervansaray', 'Ticaret yolları üzerinde tüccarların ücretsiz konaklayabildiği yapı.', 'kolay'],
    ['Siyasetname', 'Devletin nasıl yönetileceğini ve hükümdarın nasıl davranacağını anlatan eser.', 'zor'],
    ['Sübaşı', 'İkta topraklarında güvenliği sağlayan ve asker yetiştiren komutan.', 'zor'],
    ['Sultan', 'Tuğrul Bey’den itibaren Türk-İslam hükümdarlarının kullandığı en yüksek unvan.', 'kolay'],
    ['Vezir', 'Hükümdardan sonra gelen, divana başkanlık eden en yetkili devlet adamı.', 'kolay'],
    ['Medrese', 'Din ilimlerinin yanında matematik ve tıp da okutulan yüksek öğretim kurumu.', 'kolay'],
    ['Darüşşifa', 'Hastaların ücretsiz tedavi edildiği, hekim de yetiştiren sağlık kurumu.', 'kolay'],
    ['Kutadgu Bilig', 'Yusuf Has Hacip’in ideal devlet ve insan anlayışını anlattığı ilk Türk-İslam eseri.', 'kolay'],
    ['Divanü Lugati’t-Türk', 'Kaşgarlı Mahmut’un Araplara Türkçe öğretmek için yazdığı sözlük.', 'kolay'],
    ['Sikke', 'Hükümdarlık belirtisi sayılan, hükümdar adına bastırılan para.', 'kolay'],
    ['Hutbe okutma', 'Cuma namazında hükümdarın adının anılması biçimindeki egemenlik göstergesi.', 'kolay'],
    ['Kümbet', 'Altı mezar, üstü mescit olarak yapılan Türk-İslam anıt mezarı.', 'kolay'],
    ['Divan-ı İstifa', 'Devletin gelir gider hesaplarına ve hazineye bakan divan.'],
    ['Divan-ı Arz', 'Ordunun donatımı, sevki ve asker kayıtlarından sorumlu Selçuklu divanı.'],
    ['Uc beyliği', 'Sınır bölgelerine yerleştirilen, akın yaparak toprağı genişleten beylik.'],
    ['Divan-ı Hikmet', 'Ahmet Yesevi’nin tasavvufu Türkçe şiirlerle anlattığı eser.'],
    ['Bac', 'Ticaret mallarından alınan pazar ve geçiş vergisi.'],
    ['Batınilik', 'Selçukluları içten yıkmak için suikastlara başvuran gizli mezhep hareketi.'],
    ['Hassa ordusu', 'Selçuklu’da doğrudan sultana bağlı, seçilmiş askerlerden kurulu muhafız ordusu.'],
    ['Menşur', 'Halifenin bir hükümdarın saltanatını onayladığını bildiren belge.'],
    ['Ribat', 'Sınır boylarında hem konaklama hem savunma amacıyla yapılan yapı.'],
    ['Divan-ı İşraf', 'Devletin idari ve mali işlerini yerinde denetleyen Selçuklu divanı.', 'zor'],
    ['Divan-ı Tuğra', 'Selçuklu’da yazışmaların hazırlandığı ve tuğranın çekildiği divan.', 'zor'],
    ['Şıhne', 'Selçuklu’da bir şehrin güvenliğinden sorumlu askerî vali.', 'zor'],
    ['Emir-i dad', 'Selçuklu’da şeriat dışında kalan davalara bakan adalet görevlisi.', 'zor'],
    ['Çetr', 'Hükümdarlık simgesi sayılan saltanat şemsiyesi.', 'zor'],
    ['Nevbet', 'Hükümdarlık belirtisi olarak belli saatlerde sarayda çaldırılan davul takımı.', 'zor'],
    ['Atabetü’l-Hakayık', 'Edip Ahmet’in dinî ve ahlaki öğütler verdiği manzum eseri.', 'zor'],
  ]),

  /*
    Osmanlı siyasi tarihi kurumlardan ayrı: aynı tahtada "Divan-ı Hümayun" ile
    "Mohaç Savaşı" yan yana gelseydi çeldirici okumadan elenirdi.
  */
  ...konu('osmanli-siyasi', [
    ['Gaza', 'Uç boylarında din adına yapılan ve Osmanlı’nın kuruluşunu besleyen akın.', 'kolay'],
    ['Anadolu beylikleri', 'Anadolu Selçuklu’nun yıkılışıyla ortaya çıkan küçük Türk devletleri.', 'kolay'],
    ['Çimpe Kalesi', 'Osmanlı’nın Rumeli’de ele geçirdiği ilk toprak olan kale.', 'kolay'],
    ['Fetret Devri', 'Ankara Savaşı sonrasında taht kavgalarıyla geçen, padişahsız on bir yıl.', 'kolay'],
    ['Ankara Savaşı', 'Timur’un Yıldırım Bayezid’i yenerek Anadolu Türk birliğini bozduğu savaş.', 'kolay'],
    ['İstanbul’un Fethi', 'Orta Çağ’ı kapatan ve Osmanlı’yı imparatorluğa dönüştüren 1453 olayı.', 'kolay'],
    ['Kardeş katli', 'Devletin bölünmesini önlemek için Fatih Kanunnamesi’yle kurala bağlanan uygulama.', 'kolay'],
    ['Celali İsyanları', 'Anadolu’da ağır vergiler ve asayişsizlik yüzünden çıkan halk ayaklanmaları.', 'kolay'],
    ['Padişah', 'Osmanlı hükümdarının kullandığı, devlette son sözü söyleyen unvan.', 'kolay'],
    ['Halifeliğin geçişi', 'Yavuz’un Mısır seferiyle halifelik makamının Osmanlı’ya geçmesi.', 'kolay'],
    ['I. Kosova Savaşı', 'Balkanlarda Haçlı ordusunun yenildiği, I. Murat’ın şehit olduğu savaş.'],
    ['Niğbolu Savaşı', 'Yıldırım Bayezid’in Haçlıları yenerek Bulgaristan’a yerleştiği savaş.'],
    ['Şeyh Bedreddin', 'Fetret sonrasında dinî ve sosyal içerikli büyük bir ayaklanma başlatan âlim.'],
    ['Anadolu Türk birliği', 'Osmanlı’nın beylikleri kendine bağlayarak Anadolu’da siyasi bütünlüğü sağlaması.'],
    ['Çaldıran Savaşı', 'Yavuz’un Safevileri yenerek Doğu Anadolu’yu Osmanlı’ya bağladığı savaş.'],
    ['Ridaniye Savaşı', 'Yavuz’un Memlük Devleti’ni yıkarak Mısır’ı Osmanlı’ya kattığı savaş.'],
    ['Mukaddes emanetler', 'Yavuz’un Mısır’dan İstanbul’a getirdiği, Hz. Muhammed’e ait kutsal eşyalar.'],
    ['Mohaç Savaşı', 'Kanuni’nin kısa sürede kazandığı, Macaristan’ı Osmanlı’ya bağlayan savaş.'],
    ['Preveze Deniz Savaşı', 'Barbaros’un Haçlı donanmasını yenerek Akdeniz üstünlüğünü sağladığı savaş.'],
    ['Ekber ve erşed', 'Tahta hanedanın en yaşlı ve olgun üyesinin geçmesini öngören veraset kuralı.'],
    ['Kafes usulü', 'Şehzadelerin sancağa gönderilmeyip sarayda gözetim altında tutulması.'],
    ['Tersane-i Amire', 'Osmanlı savaş gemilerinin yapıldığı, Haliç’teki devlet tersanesi.', 'zor'],
    ['Levent', 'Osmanlı donanmasında sefer süresince ücretle çalışan denizci asker.', 'zor'],
    ['İnebahtı Savaşı', 'Osmanlı donanmasının yakıldığı, bir kışta yeniden inşa edildiği deniz yenilgisi.', 'zor'],
    ['Kutsal İttifak', 'II. Viyana bozgunundan sonra Osmanlı’ya karşı kurulan Avrupa birliği.', 'zor'],
    ['II. Viyana Kuşatması', 'Başarısızlığı Osmanlı’yı uzun bir toprak kaybı sürecine sokan kuşatma.', 'zor'],
    ['Edirne Vakası', 'II. Mustafa’nın tahttan indirildiği, Feyzullah Efendi’nin öldürüldüğü ayaklanma.', 'zor'],
    ['Patrona Halil İsyanı', 'Lale Devri’ni sona erdiren, yenilik karşıtı İstanbul ayaklanması.', 'zor'],
  ]),

  ...konu('osmanli-kurum', [
    ['Tımar', 'Geliri, atlı asker beslemesi karşılığında sipahiye bırakılan dirlik toprağı.', 'kolay'],
    ['Devşirme', 'Hristiyan ailelerin çocuklarının belli ölçütlerle seçilip devlet hizmetine yetiştirilmesi.', 'kolay'],
    ['Enderun', 'Devşirilen çocukların yönetici olarak yetiştirildiği saray okulu.', 'kolay'],
    ['Acemi Ocağı', 'Devşirilen çocukların asıl ocaklara girmeden önce hazırlandığı yer.'],
    ['Kapıkulu', 'Doğrudan padişaha bağlı, üç ayda bir maaş alan sürekli ordu.', 'kolay'],
    ['Divan-ı Hümayun', 'Devlet işlerinin görüşülüp karara bağlandığı en yüksek kurul.', 'kolay'],
    ['Nişancı', 'Padişahın tuğrasını çeken, fermanları yazan ve toprak kayıtlarını tutan divan üyesi.'],
    ['Defterdar', 'Devletin gelir ve giderlerinden, hazineden sorumlu divan üyesi.'],
    ['Kazasker', 'Divanda eğitim ve yargı işlerine bakan, kadı ile müderrisleri atayan üye.'],
    ['Reisülküttap', 'Divan yazışmalarından sorumluyken sonradan dışişlerini yürüten görevli.', 'zor'],
    ['Şeyhülislam', 'Alınan kararların dine uygunluğu konusunda fetva veren en yüksek din görevlisi.'],
    ['Kadı', 'Kazalarda yargı, belediye ve noterlik işlerini birlikte yürüten görevli.'],
    ['Sancağa çıkma', 'Şehzadelerin yönetim tecrübesi kazanması için sancaklara vali gönderilmesi.'],
    ['Müsadere', 'Görevden alınan ya da ölen devlet adamının malına devletçe el konulması.', 'zor'],
    ['Millet sistemi', 'Gayrimüslimlerin dinlerine göre topluluklara ayrılıp kendi hukuklarını uygulaması.'],
    ['İstimalet', 'Fethedilen yerlerin halkını hoşgörüyle ve haklarını koruyarak kazanma politikası.', 'zor'],
    ['İskân', 'Fethedilen bölgelere Anadolu’dan Türk ailelerin yerleştirilmesi.'],
    ['Derbent teşkilatı', 'Yol ve geçitlerin güvenliğinden sorumlu, karşılığında vergi indirimi alan köylüler.', 'zor'],
    ['Lonca', 'Aynı işi yapan esnafın kurduğu, üretimi ve kaliteyi denetleyen birlik.', 'kolay'],
    ['Gedik', 'Bir esnafın kendi dükkânını açabilmesi için alması gereken ustalık hakkı.', 'zor'],
    ['Narh', 'Devletin çarşıda satılan mala koyduğu üst fiyat sınırı.', 'zor'],
    ['Vakıf', 'Geliri hayır işlerine bırakılmak üzere kişilerin bağışıyla kurulan kurum.', 'kolay'],
    ['Avarız', 'Savaş gibi olağanüstü zamanlarda toplanan, sonradan sürekli hâle gelen vergi.', 'zor'],
    ['Öşür', 'Müslüman çiftçiden ürünü üzerinden alınan vergi.', 'kolay'],
    ['Cizye', 'Gayrimüslim erkeklerden askerlik yapmadıkları için alınan vergi.', 'kolay'],
    ['İltizam', 'Devlet gelirlerinin peşin para karşılığında açık artırmayla kişilere verilmesi.'],
    ['Mültezim', 'Vergi toplama hakkını açık artırmayla üstlenen kişi.'],
    ['Malikâne', 'Vergi toplama hakkının kişiye ölünceye kadar verilmesi.', 'zor'],
    ['Kapitülasyon', 'Yabancı devlet uyruklarına ticarette ve hukukta tanınan ayrıcalıklar.', 'kolay'],
    ['Kanunname', 'Padişahın örfi hukuka dayanarak koyduğu kuralların toplandığı metin.'],
    ['Yeniçeri Ocağı', 'Kapıkulu piyadesinin en kalabalık ve merkezde konuşlanan ocağı.', 'kolay'],
    ['Sadrazam', 'Padişahın mührünü taşıyan ve onun mutlak vekili sayılan devlet adamı.', 'kolay'],
    ['Beylerbeyi', 'Bir eyaletin yönetiminden sorumlu, sancakbeylerinin üstündeki taşra yöneticisi.', 'kolay'],
    ['Sancakbeyi', 'Sancağın yönetiminden ve tımarlı sipahilerin sefere sevkinden sorumlu görevli.', 'kolay'],
    ['Sipahi', 'Tımar geliriyle geçinen, sefere kendi askerleriyle katılan eyalet süvarisi.', 'kolay'],
    ['Kaptan-ı Derya', 'Donanmanın başında bulunan ve divanda yer alan komutan.', 'kolay'],
    ['Akıncı', 'Sınır ötesine keşif ve yıpratma akınları yapan hafif süvari birliği.', 'kolay'],
    ['Miri arazi', 'Mülkiyeti devlete ait olan, kullanım hakkı köylüye bırakılan toprak.', 'kolay'],
    ['Reaya', 'Üretim yapıp vergi veren, yönetilen halk.', 'kolay'],
    ['Cebelü', 'Tımarlı sipahinin geliriyle donatıp sefere götürdüğü teçhizatlı asker.'],
    ['Has', 'Yıllık geliri yüz bin akçeden çok olan, padişah ve üst yöneticilere ayrılan dirlik.'],
    ['Zeamet', 'Yıllık geliri yirmi bin ile yüz bin akçe arasındaki orta dereceli dirlik.'],
    ['Ulufe', 'Kapıkulu askerlerine üç ayda bir ödenen maaş.'],
    ['Cülus bahşişi', 'Tahta çıkan padişahın kapıkulu askerlerine dağıttığı bağış.'],
    ['Müderris', 'Medresede ders veren öğretim görevlisi.'],
    ['İlmiye', 'Eğitim, yargı ve fetva işlerini yürüten yönetici sınıfı.'],
    ['Seyfiye', 'Askerlik ve taşra yöneticiliği görevlerini üstlenen yönetici sınıfı.'],
    ['Kalemiye', 'Maliye ve yazışma işlerini yürüten memur sınıfı.'],
    ['Azap', 'Savaşta ordunun önünde yer alan, Anadolu’dan toplanmış yardımcı piyade.'],
    ['Mukataa', 'Geliri doğrudan hazineye aktarılan, dirliğe ayrılmamış devlet toprağı.', 'zor'],
    ['Yurtluk-ocaklık', 'Sınır boylarında hizmet karşılığı babadan oğula geçen topraklar.', 'zor'],
    ['Çiftbozan vergisi', 'Toprağını üç yıl üst üste ekmeyen köylüden alınan ceza vergisi.', 'zor'],
    ['Ağnam vergisi', 'Beslenen küçükbaş hayvanın sayısına göre alınan vergi.', 'zor'],
    ['Ayak divanı', 'Olağanüstü durumlarda ayakta toplanan, padişahın şikâyetleri dinlediği divan.', 'zor'],
    ['Surre alayı', 'Her yıl Mekke ve Medine’ye hediye ile para götüren kafile.', 'zor'],
  ]),

  ...konu('degisim', [
    ['Ayan', 'Taşrada söz sahibi olan, halkla devlet arasında aracılık eden yerel güç sahibi.'],
    ['Sened-i İttifak', 'Padişahın yetkilerinin ilk kez sınırlandığı, taşra güçleriyle imzalanan belge.', 'kolay'],
    ['Nizam-ı Cedit', 'III. Selim’in kurduğu yeni düzen ve Avrupa tarzında eğitilmiş ordu.', 'kolay'],
    ['İrad-ı Cedit', 'Yeni ordunun masraflarını karşılamak için kurulan ayrı hazine.', 'zor'],
    ['Sekban-ı Cedit', 'Alemdar Mustafa Paşa döneminde kurulan, yeniçeri tepkisiyle kaldırılan ocak.', 'zor'],
    ['Eşkinci Ocağı', 'II. Mahmut’un kurduğu ve Yeniçeri Ocağı’nın kaldırılmasına yol açan birlik.', 'zor'],
    ['Vaka-i Hayriye', 'Yeniçeri Ocağı’nın 1826’da kaldırılmasına verilen ad.'],
    ['Tanzimat Fermanı', 'Herkesin can, mal ve namus güvenliğiyle kanun üstünlüğünün ilan edildiği ferman.', 'kolay'],
    ['Islahat Fermanı', 'Müslüman ve gayrimüslimler arasında tam eşitliği amaçlayan, Avrupa baskısıyla ilan edilen ferman.'],
    ['Kanun-i Esasi', 'Osmanlı Devleti’nin ilk anayasası.', 'kolay'],
    ['Meşrutiyet', 'Padişahın yanında halkın seçtiği meclisin de yönetimde söz sahibi olduğu yönetim biçimi.', 'kolay'],
    ['Duyun-u Umumiye', 'Osmanlı borçlarını alacaklı devletler adına toplayan idare.'],
    ['Şûra-yı Devlet', 'Kanun tasarılarını hazırlayan ve idari davalara bakan, Danıştay’ın temeli olan kurul.', 'zor'],
    ['Lale Devri', 'Patrona Halil İsyanı’yla sona eren, matbaanın açıldığı yenilik dönemi.', 'kolay'],
    ['Şark Meselesi', 'Avrupa devletlerinin Osmanlı topraklarını paylaşma politikasına verilen ad.', 'kolay'],
    ['Yeni Osmanlılar', 'Meşrutiyeti savunan ve Tanzimat yönetimini eleştiren aydın hareketi.', 'kolay'],
    ['Jön Türkler', 'II. Abdülhamit yönetimine karşı meşrutiyeti yeniden isteyen muhalefet.', 'kolay'],
    ['31 Mart Olayı', 'II. Meşrutiyet’e karşı çıkan, Hareket Ordusu’nun bastırdığı ayaklanma.', 'kolay'],
    ['İttihat ve Terakki', 'II. Meşrutiyet’i ilan ettiren ve devleti savaşa sokan siyasi örgüt.', 'kolay'],
    ['Takvim-i Vekayi', 'Osmanlı Devleti’nin ilk resmî gazetesi.', 'kolay'],
    ['Osmanlıcılık', 'Din ve millet farkı gözetmeden herkesi Osmanlı kimliğinde birleştirme düşüncesi.', 'kolay'],
    ['Türkçülük', 'Devleti Türk milliyetçiliği temelinde ayakta tutmayı amaçlayan akım.', 'kolay'],
    ['Tercüme Odası', 'Rum tercümanlara güven kalmayınca kurulan, dış işlerine eleman yetiştiren kalem.'],
    ['Mühendishane', 'Orduya teknik subay yetiştirmek için açılan mühendislik okulu.'],
    ['Mekteb-i Tıbbiye', 'Ordunun hekim ihtiyacını karşılamak için açılan tıp okulu.'],
    ['Mecelle', 'Ahmet Cevdet Paşa başkanlığında hazırlanan ilk Osmanlı medeni kanunu.'],
    ['Kaime', 'Osmanlı Devleti’nin çıkardığı ilk kâğıt para.'],
    ['Bedel-i askerî', 'Gayrimüslimlerin askerlik hizmeti yerine ödediği vergi.'],
    ['Kabakçı İsyanı', 'Nizam-ı Cedit’i dağıtan ve III. Selim’i tahttan indiren yeniçeri ayaklanması.'],
    ['Asakir-i Mansure', 'Yeniçeri Ocağı kaldırıldıktan sonra kurulan yeni düzenli ordu.'],
    ['İstibdat Dönemi', 'II. Abdülhamit’in meclisi kapatıp otuz yıl tek başına yönettiği dönem.'],
    ['Muhassıllık', 'Tanzimat’la vergiyi doğrudan toplamak için kurulan, kısa ömürlü görev.', 'zor'],
    ['Nizamiye mahkemesi', 'Tanzimat sonrası kurulan, Avrupa hukukunu uygulayan karma mahkeme.', 'zor'],
    ['Boğazlar Meselesi', 'Boğazlardan hangi devletin gemilerinin geçebileceği tartışması.', 'zor'],
    ['Ayan Meclisi', 'Kanun-i Esasi ile kurulan, üyelerini padişahın atadığı meclis.', 'zor'],
    ['Babıali Baskını', 'İttihat ve Terakki’nin hükümeti silah zoruyla devirdiği darbe.', 'zor'],
    ['Redif', 'II. Mahmut döneminde oluşturulan yedek asker sınıfı.', 'zor'],
    ['Mısır Meselesi', 'Kavalalı Mehmet Ali Paşa’nın ayaklanmasıyla ortaya çıkan iç ve dış sorun.', 'zor'],
  ]),

  ...konu('inkilap', [
    ['Manda ve himaye', 'Kendini yönetemeyeceği varsayılan bir ülkenin güçlü bir devletin yönetimine bırakılması.', 'kolay'],
    ['Kuva-yı Milliye', 'İşgallere karşı halkın kendi imkânlarıyla kurduğu düzensiz direniş birlikleri.', 'kolay'],
    ['Misak-ı Millî', 'Son Osmanlı Mebusan Meclisi’nde kabul edilen, ulusal sınırları belirleyen kararlar.', 'kolay'],
    ['Tekâlif-i Milliye', 'Ordunun ihtiyacı için halka getirilen olağanüstü savaş yükümlülükleri.'],
    ['İstiklal Mahkemeleri', 'Cephe gerisindeki asker kaçakları ve isyanlarla ilgilenen olağanüstü mahkemeler.'],
    ['Saltanat', 'Yönetme hakkının bir ailede kalması ve babadan oğula geçmesi.', 'kolay'],
    ['Halifelik', 'İslam dünyasının dinî önderliğini temsil eden makam.', 'kolay'],
    ['Laiklik', 'Din ile devlet işlerinin ayrılması ve herkesin inanç özgürlüğünün güvenceye alınması.', 'kolay'],
    ['Devletçilik', 'Özel sermayenin yetmediği alanlarda yatırımı devletin üstlenmesi.', 'zor'],
    ['Halkçılık', 'Kanun önünde eşitlik ve hiçbir zümreye ayrıcalık tanımama ilkesi.'],
    ['İnkılapçılık', 'Yapılan yenilikleri koruma ve çağın gereğine göre ilerlemeyi sürdürme ilkesi.', 'zor'],
    ['Misak-ı İktisadi', 'İzmir İktisat Kongresi’nde kabul edilen ekonomik bağımsızlık kararları.', 'zor'],
    ['Mübadele', 'Lozan’da kararlaştırılan, Türkiye ile Yunanistan arasındaki karşılıklı nüfus değişimi.'],
    ['Kabotaj', 'Bir ülkenin kendi kıyıları arasında taşımacılık yapma hakkı.'],
  ]),
]

/** Havuzdaki kavram sayısı — tanıtım ekranı bunu yazıyor. */
export const KAVRAM_BOYUTU = KAVRAM_HAVUZU.length
