/**
 * Antlaşma Eşleştirme oyununun madde–antlaşma havuzu.
 *
 * Son yılların TYT Sosyal Bilimler tarih sorularının yoğunlaştığı yerlerden
 * derlendi: Osmanlı'nın Batı ve Doğu antlaşmaları, Dağılma dönemi, Millî
 * Mücadele antlaşmaları ile Millî Mücadele belgeleri ve Cumhuriyet kanunları.
 * ÖSYM bu konularda "hangi antlaşmanın maddesidir / hangi belgede yer alır"
 * kalıbını kullanıyor; oyun da tam bunu soruyor.
 *
 * Madde metinleri **ayırt edici** olmak zorunda: aynı cümle iki belgede birden
 * geçiyorsa havuza alınmadı. Örnek: "Manda ve himaye kabul edilemez" hem
 * Erzurum hem Sivas kararlarında var, iki doğru cevabı olan bir soru demek —
 * bu yüzden yok. Yerine yalnız birinde geçen kararlar yazıldı (Sivas'ta
 * cemiyetlerin birleştirilmesi, Erzurum'da Temsil Heyeti'nin kurulması).
 *
 * Antlaşma adlarında yıl bilerek var: hem aynı adı taşıyan iki antlaşmayı
 * (İstanbul 1700/1913, Ankara 1921/1926) ayırıyor hem de öğrenciye maddeyle
 * birlikte tarihi de ezberletiyor.
 */

export type TarihDonemi =
  | 'klasik'
  | 'gerileme'
  | 'dagilma'
  | 'kurtulus'
  | 'belgeler'
  | 'inkilap'
  | 'cumhuriyet'

export type AntlasmaMaddesi = {
  /** Antlaşmanın/belgenin maddesi ya da o maddenin özeti. */
  madde: string
  /** Doğru cevap: maddenin geçtiği antlaşma ya da belge. */
  antlasma: string
  donem: TarihDonemi
}

export const TARIH_DONEM_ADI: Record<TarihDonemi, string> = {
  klasik: 'Yükselme ve Duraklama',
  gerileme: 'Gerileme dönemi',
  dagilma: 'Dağılma dönemi',
  kurtulus: 'Millî Mücadele antlaşmaları',
  belgeler: 'Millî Mücadele belgeleri',
  inkilap: 'İnkılap kanunları',
  cumhuriyet: 'Cumhuriyet dış politikası',
}

/**
 * Sağ sütunun başlığı.
 *
 * Bir elin tamamı antlaşmalardan kuruluyorsa "Antlaşmalar", belgelerden
 * kuruluyorsa "Belgeler" yazıyor: Amasya Genelgesi'ne antlaşma demek yanlış
 * olurdu ve oyun bilgi öğretiyor, terim karıştırmıyor.
 */
export function sutunBasligi(donem: TarihDonemi | null): string {
  if (donem === 'belgeler' || donem === 'inkilap') return 'Belgeler'
  if (donem === null) return 'Antlaşma ve belgeler'
  return 'Antlaşmalar'
}

/** `[madde, antlaşma]` çiftlerini tek döneme bağlar — havuzu okunur tutmak için. */
function donem(donem: TarihDonemi, ciftler: [string, string][]): AntlasmaMaddesi[] {
  return ciftler.map(([madde, antlasma]) => ({ madde, antlasma, donem }))
}

export const ANTLASMA_HAVUZU: AntlasmaMaddesi[] = [
  ...donem('klasik', [
    [
      'Bağdat ve Doğu Anadolu Osmanlı’da kaldı; Tebriz İran’a bırakıldı.',
      'Amasya Antlaşması (1555)',
    ],
    [
      'İranlı hacıların Osmanlı toprağından geçerek kutsal yerleri ziyaret etmesine izin verildi.',
      'Amasya Antlaşması (1555)',
    ],
    [
      'Azerbaycan, Gürcistan ve Dağıstan Osmanlı’ya bırakıldı; devlet doğuda en geniş sınırlarına ulaştı.',
      'Ferhat Paşa Antlaşması (1590)',
    ],
    [
      'Avusturya arşidükü protokol bakımından Osmanlı padişahına denk sayıldı.',
      'Zitvatorok Antlaşması (1606)',
    ],
    [
      'Avusturya’nın her yıl ödediği vergi kaldırıldı, yerine bir defalık savaş tazminatı alındı.',
      'Zitvatorok Antlaşması (1606)',
    ],
    [
      'İran, savaş tazminatı olarak her yıl Osmanlı’ya 200 yük ipek verecekti.',
      'Nasuh Paşa Antlaşması (1612)',
    ],
    [
      'İran’ın vereceği yıllık ipek miktarı 100 yüke indirildi.',
      'Serav Antlaşması (1618)',
    ],
    [
      'Bağdat Osmanlı’da, Revan İran’da kaldı; Zağros Dağları sınır kabul edildi.',
      'Kasr-ı Şirin Antlaşması (1639)',
    ],
    [
      'Bugünkü Türkiye–İran sınırının temeli atıldı ve iki devlet arasındaki uzun savaşlar sona erdi.',
      'Kasr-ı Şirin Antlaşması (1639)',
    ],
    [
      'Uyvar ve Novigrad Osmanlı’da kaldı; Erdel’e Osmanlı’nın onayladığı bir bey getirilecekti.',
      'Vasvar Antlaşması (1664)',
    ],
    [
      'Podolya Osmanlı’ya bırakıldı; devlet Batı’da en geniş sınırlarına ulaştı.',
      'Bucaş Antlaşması (1672)',
    ],
  ]),

  ...donem('gerileme', [
    [
      'Mora ve Dalmaçya Venedik’e, Podolya Lehistan’a, Macaristan ve Erdel Avusturya’ya bırakıldı.',
      'Karlofça Antlaşması (1699)',
    ],
    [
      'Osmanlı Devleti ilk kez geniş topraklar kaybetti; Batı karşısında gerileme dönemi başladı.',
      'Karlofça Antlaşması (1699)',
    ],
    [
      'Azak Kalesi ve çevresi Rusya’ya bırakıldı; Rusya İstanbul’da sürekli elçi bulundurabilecekti.',
      'İstanbul Antlaşması (1700)',
    ],
    [
      'Azak Kalesi geri alındı; Rusya İstanbul’da daimî elçi bulunduramayacaktı.',
      'Prut Antlaşması (1711)',
    ],
    [
      'Belgrad, Banat ve Kuzey Sırbistan Avusturya’ya bırakıldı; Mora Venedik’ten geri alındı.',
      'Pasarofça Antlaşması (1718)',
    ],
    [
      'Belgrad ve Azak Kalesi geri alındı; Rusya Karadeniz’de savaş ve ticaret gemisi bulunduramayacaktı.',
      'Belgrad Antlaşması (1739)',
    ],
    [
      'Kırım siyasi bakımdan bağımsız olacak, dinî bakımdan Osmanlı halifesine bağlı kalacaktı.',
      'Küçük Kaynarca Antlaşması (1774)',
    ],
    [
      'Rusya Osmanlı ülkesinde konsolosluk açabilecek ve Ortodoksların koruyuculuğunu üstlenecekti.',
      'Küçük Kaynarca Antlaşması (1774)',
    ],
    [
      'Rusya Kırım’dan çekilecek, Osmanlı da Şahin Giray’ın hanlığını tanıyacaktı.',
      'Aynalıkavak Tenkihnamesi (1779)',
    ],
    [
      'Savaştan önceki sınırlara dönüldü; Osmanlı’nın Avusturya ile son savaşı böyle bitti.',
      'Ziştovi Antlaşması (1791)',
    ],
    [
      'Kırım’ın Rusya’ya ait olduğu kesin olarak kabul edildi; Dinyester Nehri sınır oldu.',
      'Yaş Antlaşması (1792)',
    ],
  ]),

  ...donem('dagilma', [
    [
      'Sırplara ayrıcalık verildi; Prut Nehri iki devlet arasında sınır kabul edildi.',
      'Bükreş Antlaşması (1812)',
    ],
    [
      'Yunanistan’ın bağımsızlığı kabul edildi; Sırbistan’ın özerkliği genişletildi.',
      'Edirne Antlaşması (1829)',
    ],
    [
      'Osmanlı, bir saldırı hâlinde Boğazları Rusya lehine kapatmayı kabul etti.',
      'Hünkâr İskelesi Antlaşması (1833)',
    ],
    [
      'İngiliz tüccarlar iç gümrük vergisinden muaf tutuldu; yerli tüccar rekabet edemez hâle geldi.',
      'Balta Limanı Ticaret Antlaşması (1838)',
    ],
    [
      'Boğazlar barış zamanında hiçbir devletin savaş gemisine açılmayacaktı.',
      'Londra Boğazlar Sözleşmesi (1841)',
    ],
    [
      'Osmanlı Devleti Avrupalı sayıldı ve toprak bütünlüğü Avrupa devletlerinin güvencesine alındı.',
      'Paris Antlaşması (1856)',
    ],
    [
      'Karadeniz tarafsız hâle getirildi; iki taraf da burada savaş gemisi ve tersane bulunduramayacaktı.',
      'Paris Antlaşması (1856)',
    ],
    [
      'Sınırları Ege’ye uzanan büyük bir Bulgaristan Prensliği kuruluyordu; antlaşma hiç uygulanmadı.',
      'Ayastefanos Antlaşması (1878)',
    ],
    [
      'Sırbistan, Karadağ ve Romanya bağımsız oldu; Ermeni meselesi ilk kez uluslararası sorun hâline geldi.',
      'Berlin Antlaşması (1878)',
    ],
    [
      'Trablusgarp İtalya’ya bırakıldı; Oniki Ada geçici olarak İtalya’da kalacaktı.',
      'Uşi Antlaşması (1912)',
    ],
    [
      'Midye–Enez hattı Osmanlı’nın batı sınırı kabul edildi; Ege adalarının geleceği büyük devletlere bırakıldı.',
      'Londra Antlaşması (1913)',
    ],
    [
      'Edirne, Kırklareli ve Dimetoka geri alındı; Meriç Nehri sınır oldu.',
      'İstanbul Antlaşması (1913)',
    ],
    [
      'Girit Yunanistan’a bırakıldı; Yunanistan’da kalan Türklerin hakları güvence altına alındı.',
      'Atina Antlaşması (1913)',
    ],
  ]),

  ...donem('kurtulus', [
    [
      'İtilaf Devletleri güvenliklerini tehdit eden bir durumda istedikleri stratejik noktayı işgal edebilecekti.',
      'Mondros Ateşkes Antlaşması (1918)',
    ],
    [
      'Doğu Anadolu’daki altı ilde karışıklık çıkarsa bu iller işgal edilebilecekti.',
      'Mondros Ateşkes Antlaşması (1918)',
    ],
    [
      'Boğazlar İtilaf Devletleri’ne açılacak, Osmanlı ordusu terhis edilecekti.',
      'Mondros Ateşkes Antlaşması (1918)',
    ],
    [
      'Türk ordusu 50.700 kişiyle sınırlandırılacak, ağır silah bulunduramayacaktı.',
      'Sevr Antlaşması (1920)',
    ],
    [
      'Boğazlar, üyelerini İtilaf Devletleri’nin belirlediği bir komisyon yönetecekti.',
      'Sevr Antlaşması (1920)',
    ],
    [
      'Doğu Anadolu’da bir Ermeni devleti kurulacak, kapitülasyonlar bütün devletlere tanınacaktı.',
      'Sevr Antlaşması (1920)',
    ],
    [
      'Kars ve Sarıkamış TBMM’ye bırakıldı; karşı taraf Sevr’i geçersiz saydı.',
      'Gümrü Antlaşması (1920)',
    ],
    [
      'Sovyet Rusya Misak-ı Millî’yi tanıdı ve kapitülasyonların kaldırıldığını kabul etti.',
      'Moskova Antlaşması (1921)',
    ],
    [
      'Batum karşı tarafa bırakıldı; buna karşılık Kars ve Ardahan TBMM’de kaldı.',
      'Moskova Antlaşması (1921)',
    ],
    [
      'Fransa Güney Anadolu’dan çekildi; Hatay dışında bugünkü Türkiye–Suriye sınırı çizildi.',
      'Ankara Antlaşması (1921)',
    ],
    [
      'Süleyman Şah’ın türbesinin bulunduğu Caber Kalesi Türk toprağı sayıldı.',
      'Ankara Antlaşması (1921)',
    ],
    [
      'Ermenistan, Gürcistan ve Azerbaycan ile imzalandı; bugünkü Türkiye–Kafkasya sınırı kesinleşti.',
      'Kars Antlaşması (1921)',
    ],
    [
      'Doğu Trakya savaş yapılmadan, on beş gün içinde TBMM yönetimine bırakılacaktı.',
      'Mudanya Ateşkes Antlaşması (1922)',
    ],
    [
      'İstanbul ve Boğazlar TBMM’ye teslim edilecek, Kurtuluş Savaşı’nın askerî safhası sona erecekti.',
      'Mudanya Ateşkes Antlaşması (1922)',
    ],
    ['Kapitülasyonlar bütün sonuçlarıyla kaldırıldı.', 'Lozan Antlaşması (1923)'],
    [
      'İstanbul’daki Rumlar ile Batı Trakya’daki Türkler dışında nüfus mübadelesi yapılacaktı.',
      'Lozan Antlaşması (1923)',
    ],
    [
      'Boğazlar, başkanı Türk olan uluslararası bir komisyonun yönetimine bırakıldı.',
      'Lozan Antlaşması (1923)',
    ],
    [
      'Osmanlı borçları paylaştırıldı; Türkiye’ye düşen kısım taksitle ödenecekti.',
      'Lozan Antlaşması (1923)',
    ],
  ]),

  ...donem('belgeler', [
    [
      'Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir; milleti yine milletin azim ve kararı kurtaracaktır.',
      'Amasya Genelgesi (1919)',
    ],
    [
      'Milletin sesini duyurmak için Sivas’ta millî bir kongre toplanacaktır.',
      'Amasya Genelgesi (1919)',
    ],
    [
      'Doğu illerinin delegeleriyle toplanan kongrede Temsil Heyeti ilk kez oluşturuldu.',
      'Erzurum Kongresi (1919)',
    ],
    [
      'Kuva-yı Milliye’yi etkin, millî iradeyi hâkim kılmak esastır.',
      'Erzurum Kongresi (1919)',
    ],
    [
      'Bütün millî cemiyetler Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti adıyla birleştirildi.',
      'Sivas Kongresi (1919)',
    ],
    [
      'Temsil Heyeti, bütün vatanı temsil edecek biçimde genişletildi.',
      'Sivas Kongresi (1919)',
    ],
    [
      'Arap çoğunluğun yaşadığı ve ateşkes imzalandığında işgal altında olan yerlerde halk oylaması yapılacaktır.',
      'Misak-ı Millî (1920)',
    ],
    [
      'Kars, Ardahan ve Batum ile Batı Trakya’da gerekirse halk oylamasına başvurulacaktır.',
      'Misak-ı Millî (1920)',
    ],
    [
      'Siyasi, adli ve mali gelişmemizi engelleyen sınırlamalar kaldırılmalıdır.',
      'Misak-ı Millî (1920)',
    ],
    ['Egemenlik kayıtsız şartsız milletindir.', 'Teşkilat-ı Esasiye (1921)'],
    [
      'Yasama ve yürütme yetkileri Büyük Millet Meclisi’nde toplanır.',
      'Teşkilat-ı Esasiye (1921)',
    ],
    [
      'Halkın elindeki taşıt araçlarının yüzde yirmisine el konulacaktır.',
      'Tekâlif-i Milliye Emirleri (1921)',
    ],
    [
      'Her ev birer kat çamaşır, birer çift çorap ve çarık hazırlayıp orduya verecektir.',
      'Tekâlif-i Milliye Emirleri (1921)',
    ],
    [
      'TBMM’ye karşı gelenler ve isyan çıkaranlar vatan haini sayılacaktır.',
      'Hıyanet-i Vataniye Kanunu (1920)',
    ],
  ]),

  ...donem('inkilap', [
    [
      'Ülkedeki bütün okullar Maarif Vekâleti’ne bağlandı, medreseler kapatıldı.',
      'Tevhid-i Tedrisat Kanunu (1924)',
    ],
    [
      'İsviçre’den alınan kanunla tek eşlilik ve resmî nikâh zorunlu hâle geldi.',
      'Türk Medeni Kanunu (1926)',
    ],
    [
      'Kadınlara mirasta, boşanmada ve mahkemede erkeklerle eşit hak tanındı.',
      'Türk Medeni Kanunu (1926)',
    ],
    [
      'Türk karasularında yük ve yolcu taşıma hakkı yalnızca Türk gemilerine verildi.',
      'Kabotaj Kanunu (1926)',
    ],
    [
      'Hükûmete, huzuru bozan yayın ve örgütleri yasaklama yetkisi verildi; Şeyh Sait İsyanı üzerine çıkarıldı.',
      'Takrir-i Sükûn Kanunu (1925)',
    ],
    [
      'Her vatandaş öz adından başka bir soyadı taşıyacak; ağa, hacı, paşa gibi unvanlar kullanılmayacaktı.',
      'Soyadı Kanunu (1934)',
    ],
    [
      'Sanayi kuracak özel girişimcilere arazi, vergi muafiyeti ve taşıma kolaylığı sağlandı.',
      'Teşvik-i Sanayi Kanunu (1927)',
    ],
    [
      'Tekke, zaviye ve türbeler kapatıldı; şeyhlik, dervişlik, müritlik unvanları yasaklandı.',
      'Tekke ve Zaviyeler Kanunu (1925)',
    ],
    [
      'Köylüden ürünün onda biri oranında alınan vergi kaldırıldı.',
      'Aşar Vergisi’nin Kaldırılması (1925)',
    ],
  ]),

  ...donem('cumhuriyet', [
    [
      'Musul Irak’a bırakıldı; petrol gelirinin yüzde onu yirmi beş yıl Türkiye’ye verilecekti.',
      'Ankara Antlaşması (1926)',
    ],
    [
      'Boğazlar Komisyonu kaldırıldı, Boğazların iki yakasında asker bulundurma hakkı Türkiye’ye geri verildi.',
      'Montrö Boğazlar Sözleşmesi (1936)',
    ],
    [
      'Türkiye, Yunanistan, Yugoslavya ve Romanya sınırlarını karşılıklı olarak güvence altına aldı.',
      'Balkan Antantı (1934)',
    ],
    [
      'Türkiye, İran, Irak ve Afganistan birbirlerinin sınırlarına saygı göstermeyi kabul etti.',
      'Sadabat Paktı (1937)',
    ],
    [
      'Fransa, Hatay’ın Türkiye’ye katılmasını kabul etti.',
      'Türkiye–Fransa Antlaşması (1939)',
    ],
  ]),
]

/** Havuzdaki madde sayısı — tanıtım ekranı bunu yazıyor. */
export const ANTLASMA_BOYUTU = ANTLASMA_HAVUZU.length
