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

export type KavramKonusu = 'ilk-turk' | 'turk-islam' | 'osmanli-kurum' | 'degisim' | 'inkilap'

export type KavramEsi = {
  kavram: string
  tanim: string
  konu: KavramKonusu
  zorluk: Zorluk
}

export const KAVRAM_KONU_ADI: Record<KavramKonusu, string> = {
  'ilk-turk': 'İslamiyet öncesi Türk devletleri',
  'turk-islam': 'İlk Türk-İslam devletleri',
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
