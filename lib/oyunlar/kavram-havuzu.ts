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

export type KavramKonusu = 'ilk-turk' | 'turk-islam' | 'osmanli-kurum' | 'degisim' | 'inkilap'

export type KavramEsi = {
  kavram: string
  tanim: string
  konu: KavramKonusu
}

export const KAVRAM_KONU_ADI: Record<KavramKonusu, string> = {
  'ilk-turk': 'İslamiyet öncesi Türk devletleri',
  'turk-islam': 'İlk Türk-İslam devletleri',
  'osmanli-kurum': 'Osmanlı devlet düzeni',
  degisim: 'Yenileşme dönemi',
  inkilap: 'Millî Mücadele ve Cumhuriyet',
}

/** `[kavram, tanım]` çiftlerini tek konuya bağlar — havuzu okunur tutmak için. */
function konu(konu: KavramKonusu, ciftler: [string, string][]): KavramEsi[] {
  return ciftler.map(([kavram, tanim]) => ({ kavram, tanim, konu }))
}

export const KAVRAM_HAVUZU: KavramEsi[] = [
  ...konu('ilk-turk', [
    ['Kurultay', 'Devlet işlerinin görüşüldüğü, kağanın başkanlık ettiği meclis.'],
    ['Kut', 'Yönetme yetkisinin Tanrı tarafından kağana ve ailesine verildiği inancı.'],
    ['Töre', 'Toplum hayatını düzenleyen, çoğu yazısız kurallardan oluşan Türk hukuku.'],
    ['Balbal', 'Ölenin mezarına, hayattayken yendiği düşman sayısınca dikilen küçük taşlar.'],
    ['Yuğ', 'Ölen kişinin ardından yapılan cenaze töreni.'],
    ['Kurgan', 'Ölünün eşyalarıyla birlikte gömüldüğü, oda biçiminde yapılmış mezar.'],
    ['Yabgu', 'Kağandan sonra gelen, ülkenin bir kanadını yöneten unvan.'],
    ['Tigin', 'Kağanın erkek çocuklarına verilen unvan.'],
    ['Boy', 'Aynı soydan gelen ailelerin birleşmesiyle oluşan, beyin yönettiği topluluk.'],
    ['Onluk sistem', 'Ordunun onlu, yüzlü, binli bölüklere ayrıldığı ve Mete Han’a dayanan düzen.'],
    ['İkili teşkilat', 'Ülkenin doğu ve batı olmak üzere iki kanattan yönetilmesi.'],
    ['Ordu-millet', 'Savaşta bütün halkın asker sayıldığı, ayrıca ücretli ordu bulundurulmayan yapı.'],
    ['Ötüken', 'Türklerin kutsal saydığı, devlet merkezi kabul edilen bölge.'],
  ]),

  ...konu('turk-islam', [
    ['İkta', 'Vergi geliri, asker yetiştirmesi karşılığında komutan ve görevlilere bırakılan toprak.'],
    ['Atabey', 'Şehzadelerin eğitiminden ve yetiştirilmesinden sorumlu deneyimli devlet adamı.'],
    ['Divan-ı Mezalim', 'Halkın görevlilerden şikâyetlerinin görüşüldüğü, sultanın başkanlık ettiği yüksek mahkeme.'],
    ['Gulam', 'Küçük yaşta alınıp sarayda yetiştirilen, doğrudan hükümdara bağlı asker sistemi.'],
    ['Nizamiye Medresesi', 'Nizamülmülk’ün kurduğu, öğrencisine burs veren ilk düzenli medreseler.'],
    ['Ahilik', 'Esnaf ve zanaatkârları birleştiren, kalite ile ahlak kurallarını belirleyen Anadolu teşkilatı.'],
    ['Melik', 'Ülkenin bir bölgesini yöneten, hanedan soyundan gelen vali.'],
    ['Kervansaray', 'Ticaret yolları üzerinde tüccarların ücretsiz konaklayabildiği yapı.'],
    ['Siyasetname', 'Devletin nasıl yönetileceğini ve hükümdarın nasıl davranacağını anlatan eser.'],
    ['Sübaşı', 'İkta topraklarında güvenliği sağlayan ve asker yetiştiren komutan.'],
  ]),

  ...konu('osmanli-kurum', [
    ['Tımar', 'Geliri, atlı asker beslemesi karşılığında sipahiye bırakılan dirlik toprağı.'],
    ['Devşirme', 'Hristiyan ailelerin çocuklarının belli ölçütlerle seçilip devlet hizmetine yetiştirilmesi.'],
    ['Enderun', 'Devşirilen çocukların yönetici olarak yetiştirildiği saray okulu.'],
    ['Acemi Ocağı', 'Devşirilen çocukların asıl ocaklara girmeden önce hazırlandığı yer.'],
    ['Kapıkulu', 'Doğrudan padişaha bağlı, üç ayda bir maaş alan sürekli ordu.'],
    ['Divan-ı Hümayun', 'Devlet işlerinin görüşülüp karara bağlandığı en yüksek kurul.'],
    ['Nişancı', 'Padişahın tuğrasını çeken, fermanları yazan ve toprak kayıtlarını tutan divan üyesi.'],
    ['Defterdar', 'Devletin gelir ve giderlerinden, hazineden sorumlu divan üyesi.'],
    ['Kazasker', 'Divanda eğitim ve yargı işlerine bakan, kadı ile müderrisleri atayan üye.'],
    ['Reisülküttap', 'Divan yazışmalarından sorumluyken sonradan dışişlerini yürüten görevli.'],
    ['Şeyhülislam', 'Alınan kararların dine uygunluğu konusunda fetva veren en yüksek din görevlisi.'],
    ['Kadı', 'Kazalarda yargı, belediye ve noterlik işlerini birlikte yürüten görevli.'],
    ['Sancağa çıkma', 'Şehzadelerin yönetim tecrübesi kazanması için sancaklara vali gönderilmesi.'],
    ['Müsadere', 'Görevden alınan ya da ölen devlet adamının malına devletçe el konulması.'],
    ['Millet sistemi', 'Gayrimüslimlerin dinlerine göre topluluklara ayrılıp kendi hukuklarını uygulaması.'],
    ['İstimalet', 'Fethedilen yerlerin halkını hoşgörüyle ve haklarını koruyarak kazanma politikası.'],
    ['İskân', 'Fethedilen bölgelere Anadolu’dan Türk ailelerin yerleştirilmesi.'],
    ['Derbent teşkilatı', 'Yol ve geçitlerin güvenliğinden sorumlu, karşılığında vergi indirimi alan köylüler.'],
    ['Lonca', 'Aynı işi yapan esnafın kurduğu, üretimi ve kaliteyi denetleyen birlik.'],
    ['Gedik', 'Bir esnafın kendi dükkânını açabilmesi için alması gereken ustalık hakkı.'],
    ['Narh', 'Devletin çarşıda satılan mala koyduğu üst fiyat sınırı.'],
    ['Vakıf', 'Geliri hayır işlerine bırakılmak üzere kişilerin bağışıyla kurulan kurum.'],
    ['Avarız', 'Savaş gibi olağanüstü zamanlarda toplanan, sonradan sürekli hâle gelen vergi.'],
    ['Öşür', 'Müslüman çiftçiden ürünü üzerinden alınan vergi.'],
    ['Cizye', 'Gayrimüslim erkeklerden askerlik yapmadıkları için alınan vergi.'],
    ['İltizam', 'Devlet gelirlerinin peşin para karşılığında açık artırmayla kişilere verilmesi.'],
    ['Mültezim', 'Vergi toplama hakkını açık artırmayla üstlenen kişi.'],
    ['Malikâne', 'Vergi toplama hakkının kişiye ölünceye kadar verilmesi.'],
    ['Kapitülasyon', 'Yabancı devlet uyruklarına ticarette ve hukukta tanınan ayrıcalıklar.'],
    ['Kanunname', 'Padişahın örfi hukuka dayanarak koyduğu kuralların toplandığı metin.'],
  ]),

  ...konu('degisim', [
    ['Ayan', 'Taşrada söz sahibi olan, halkla devlet arasında aracılık eden yerel güç sahibi.'],
    ['Sened-i İttifak', 'Padişahın yetkilerinin ilk kez sınırlandığı, taşra güçleriyle imzalanan belge.'],
    ['Nizam-ı Cedit', 'III. Selim’in kurduğu yeni düzen ve Avrupa tarzında eğitilmiş ordu.'],
    ['İrad-ı Cedit', 'Yeni ordunun masraflarını karşılamak için kurulan ayrı hazine.'],
    ['Sekban-ı Cedit', 'Alemdar Mustafa Paşa döneminde kurulan, yeniçeri tepkisiyle kaldırılan ocak.'],
    ['Eşkinci Ocağı', 'II. Mahmut’un kurduğu ve Yeniçeri Ocağı’nın kaldırılmasına yol açan birlik.'],
    ['Vaka-i Hayriye', 'Yeniçeri Ocağı’nın 1826’da kaldırılmasına verilen ad.'],
    ['Tanzimat Fermanı', 'Herkesin can, mal ve namus güvenliğiyle kanun üstünlüğünün ilan edildiği ferman.'],
    ['Islahat Fermanı', 'Müslüman ve gayrimüslimler arasında tam eşitliği amaçlayan, Avrupa baskısıyla ilan edilen ferman.'],
    ['Kanun-i Esasi', 'Osmanlı Devleti’nin ilk anayasası.'],
    ['Meşrutiyet', 'Padişahın yanında halkın seçtiği meclisin de yönetimde söz sahibi olduğu yönetim biçimi.'],
    ['Duyun-u Umumiye', 'Osmanlı borçlarını alacaklı devletler adına toplayan idare.'],
    ['Şûra-yı Devlet', 'Kanun tasarılarını hazırlayan ve idari davalara bakan, Danıştay’ın temeli olan kurul.'],
  ]),

  ...konu('inkilap', [
    ['Manda ve himaye', 'Kendini yönetemeyeceği varsayılan bir ülkenin güçlü bir devletin yönetimine bırakılması.'],
    ['Kuva-yı Milliye', 'İşgallere karşı halkın kendi imkânlarıyla kurduğu düzensiz direniş birlikleri.'],
    ['Misak-ı Millî', 'Son Osmanlı Mebusan Meclisi’nde kabul edilen, ulusal sınırları belirleyen kararlar.'],
    ['Tekâlif-i Milliye', 'Ordunun ihtiyacı için halka getirilen olağanüstü savaş yükümlülükleri.'],
    ['İstiklal Mahkemeleri', 'Cephe gerisindeki asker kaçakları ve isyanlarla ilgilenen olağanüstü mahkemeler.'],
    ['Saltanat', 'Yönetme hakkının bir ailede kalması ve babadan oğula geçmesi.'],
    ['Halifelik', 'İslam dünyasının dinî önderliğini temsil eden makam.'],
    ['Laiklik', 'Din ile devlet işlerinin ayrılması ve herkesin inanç özgürlüğünün güvenceye alınması.'],
    ['Devletçilik', 'Özel sermayenin yetmediği alanlarda yatırımı devletin üstlenmesi.'],
    ['Halkçılık', 'Kanun önünde eşitlik ve hiçbir zümreye ayrıcalık tanımama ilkesi.'],
    ['İnkılapçılık', 'Yapılan yenilikleri koruma ve çağın gereğine göre ilerlemeyi sürdürme ilkesi.'],
    ['Misak-ı İktisadi', 'İzmir İktisat Kongresi’nde kabul edilen ekonomik bağımsızlık kararları.'],
    ['Mübadele', 'Lozan’da kararlaştırılan, Türkiye ile Yunanistan arasındaki karşılıklı nüfus değişimi.'],
    ['Kabotaj', 'Bir ülkenin kendi kıyıları arasında taşımacılık yapma hakkı.'],
  ]),
]

/** Havuzdaki kavram sayısı — tanıtım ekranı bunu yazıyor. */
export const KAVRAM_BOYUTU = KAVRAM_HAVUZU.length
