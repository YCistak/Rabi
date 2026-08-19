/**
 * Edebiyat oyununun eser–yazar havuzu.
 *
 * ÖSYM'nin AYT Edebiyat'ta her yıl sorduğu eser–yazar eşleştirmelerinden
 * derlendi; ağırlık, çıkmış sorularda en sık geçen isimlerde.
 *
 * Anonim eserler (Dede Korkut Hikâyeleri, Battalname, halk destanları) havuza
 * **alınmadı**: eşleştirme oyununda karşılığında bir yazar tuşu olmayan bir
 * eser, cevabı olmayan bir soru demek.
 *
 * Aynı yazarın birden çok eseri var — bu bilerek: oyun bir ele aynı yazardan
 * iki eser koymuyor (`edebiyat.ts`), ama farklı ellerde farklı eserleri
 * sorabilmek havuzu zenginleştiriyor.
 */

import type { Zorluk } from './ritim'

export type EdebiyatDonemi =
  | 'ilk'
  | 'divan'
  | 'halk'
  | 'tanzimat'
  | 'servet'
  | 'milli'
  | 'cumhuriyet-siir'
  | 'cumhuriyet-roman'

export type EdebiyatEsi = {
  eser: string
  yazar: string
  donem: EdebiyatDonemi
  /**
   * Zorluk.
   *
   * Edebiyatta zorluğu belirleyen şey dönem değil eserin **ne kadar tanındığı**:
   * *Seyahatnâme* de divan edebiyatıdır, *Sihâm-ı Kazâ* da — ama biri her
   * müfredatta, öteki yalnızca ayrıntıya inende geçer. Dönem tabanı veriyor,
   * tanınırlık tek tek düzeltiyor.
   */
  zorluk: Zorluk
}

export const DONEM_ADI: Record<EdebiyatDonemi, string> = {
  ilk: 'İlk Türk-İslam eserleri',
  divan: 'Divan edebiyatı',
  halk: 'Halk ve tekke edebiyatı',
  tanzimat: 'Tanzimat edebiyatı',
  servet: 'Servet-i Fünûn ve Fecr-i Âtî',
  milli: 'Millî Edebiyat',
  'cumhuriyet-siir': 'Cumhuriyet dönemi şiiri',
  'cumhuriyet-roman': 'Cumhuriyet dönemi roman ve hikâyesi',
}

/** `[eser, yazar]` çiftlerini tek döneme bağlar — havuzu okunur tutmak için. */
function donem(
  donem: EdebiyatDonemi,
  taban: Zorluk,
  ciftler: ([string, string] | [string, string, Zorluk])[],
): EdebiyatEsi[] {
  return ciftler.map(([eser, yazar, zorluk]) => ({
    eser,
    yazar,
    donem,
    zorluk: zorluk ?? taban,
  }))
}

export const EDEBIYAT_HAVUZU: EdebiyatEsi[] = [
  ...donem('ilk', 'orta', [
    ['Kutadgu Bilig', 'Yusuf Has Hâcib', 'kolay'],
    ['Divânü Lugâti’t-Türk', 'Kâşgarlı Mahmut', 'kolay'],
    ['Atabetü’l-Hakayık', 'Edip Ahmet Yükneki'],
    ['Divan-ı Hikmet', 'Ahmet Yesevî'],
    ['Muhakemetü’l-Lugateyn', 'Ali Şîr Nevâî'],
    ['Garipnâme', 'Âşık Paşa'],
  ]),

  ...donem('divan', 'zor', [
    ['Hüsn ü Aşk', 'Şeyh Galip', 'orta'],
    ['Harnâme', 'Şeyhî', 'orta'],
    ['Hüsrev ü Şirin', 'Şeyhî'],
    ['Mantıku’t-Tayr', 'Gülşehrî'],
    ['Hayriyye', 'Nâbî'],
    ['Hayrâbâd', 'Nâbî'],
    ['Leylâ ile Mecnun', 'Fuzûlî', 'kolay'],
    ['Şikâyetnâme', 'Fuzûlî', 'orta'],
    ['Su Kasidesi', 'Fuzûlî', 'kolay'],
    ['Beng ü Bâde', 'Fuzûlî'],
    ['Mesnevî', 'Mevlânâ', 'kolay'],
    ['Divan-ı Kebir', 'Mevlânâ'],
    ['Fîhi Mâ Fîh', 'Mevlânâ'],
    ['İskendernâme', 'Ahmedî'],
    ['Kâbusnâme çevirisi', 'Mercimek Ahmet'],
    ['Keşfü’z-Zünûn', 'Kâtip Çelebi'],
    ['Cihannümâ', 'Kâtip Çelebi'],
    ['Seyahatnâme', 'Evliya Çelebi', 'kolay'],
    ['Vesîletü’n-Necât (Mevlid)', 'Süleyman Çelebi', 'orta'],
    ['Kanunî Mersiyesi', 'Bâkî'],
    ['Sihâm-ı Kazâ', 'Nef’î'],
    ['Tazarrunâme', 'Sinan Paşa'],
    ['Meşâirü’ş-Şuarâ', 'Âşık Çelebi'],
    ['Tezkiretü’ş-Şuarâ', 'Latîfî'],
    ['Naîmâ Tarihi', 'Naîmâ'],
    ['Sefaretnâme', 'Yirmisekiz Çelebi Mehmet'],
  ]),

  ...donem('halk', 'zor', [
    ['Risâletü’n-Nushiyye', 'Yunus Emre', 'orta'],
    ['Budalanâme', 'Kaygusuz Abdal'],
    ['Dilgüşâ', 'Kaygusuz Abdal'],
    ['Makâlât', 'Hacı Bektaş Velî', 'orta'],
    ['Dostlar Beni Hatırlasın', 'Âşık Veysel'],
  ]),

  ...donem('tanzimat', 'zor', [
    ['Şair Evlenmesi', 'Şinasi', 'kolay'],
    ['Tercüman-ı Ahval Mukaddimesi', 'Şinasi'],
    ['Müntehabat-ı Eş’ar', 'Şinasi'],
    ['İntibah', 'Namık Kemal', 'kolay'],
    ['Cezmi', 'Namık Kemal', 'orta'],
    ['Vatan yahut Silistre', 'Namık Kemal', 'kolay'],
    ['Zavallı Çocuk', 'Namık Kemal', 'orta'],
    ['Terkib-i Bend', 'Ziya Paşa'],
    ['Harâbat', 'Ziya Paşa'],
    ['Zafernâme', 'Ziya Paşa'],
    ['Felâtun Bey ile Râkım Efendi', 'Ahmet Mithat Efendi', 'orta'],
    ['Henüz On Yedi Yaşında', 'Ahmet Mithat Efendi'],
    ['Hasan Mellah', 'Ahmet Mithat Efendi'],
    ['Araba Sevdası', 'Recaizade Mahmut Ekrem', 'kolay'],
    ['Muhsin Bey', 'Recaizade Mahmut Ekrem'],
    ['Talim-i Edebiyat', 'Recaizade Mahmut Ekrem'],
    ['Sergüzeşt', 'Samipaşazade Sezai', 'orta'],
    ['Küçük Şeyler', 'Samipaşazade Sezai'],
    ['Makber', 'Abdülhak Hâmit Tarhan', 'orta'],
    ['Eşber', 'Abdülhak Hâmit Tarhan'],
    ['Sahra', 'Abdülhak Hâmit Tarhan'],
    ['Ömer’in Çocukluğu', 'Muallim Naci'],
    ['Demdeme', 'Muallim Naci'],
    ['Karabibik', 'Nabizade Nâzım', 'orta'],
    ['Zehra', 'Nabizade Nâzım'],
    ['Taaşşuk-ı Talat ve Fitnat', 'Şemsettin Sami', 'orta'],
    ['Kamus-ı Türkî', 'Şemsettin Sami'],
  ]),

  ...donem('servet', 'orta', [
    ['Mai ve Siyah', 'Halit Ziya Uşaklıgil', 'kolay'],
    ['Aşk-ı Memnu', 'Halit Ziya Uşaklıgil', 'kolay'],
    ['Kırık Hayatlar', 'Halit Ziya Uşaklıgil'],
    ['Eylül', 'Mehmet Rauf', 'kolay'],
    ['Rübâb-ı Şikeste', 'Tevfik Fikret'],
    ['Haluk’un Defteri', 'Tevfik Fikret'],
    ['Şermin', 'Tevfik Fikret', 'zor'],
    ['Elhan-ı Şitâ', 'Cenap Şahabettin'],
    ['Hac Yolunda', 'Cenap Şahabettin', 'zor'],
    ['Evrak-ı Eyyam', 'Cenap Şahabettin', 'zor'],
    ['Şıpsevdi', 'Hüseyin Rahmi Gürpınar'],
    ['Gulyabani', 'Hüseyin Rahmi Gürpınar'],
    ['Mürebbiye', 'Hüseyin Rahmi Gürpınar'],
    ['Şehir Mektupları', 'Ahmet Rasim', 'zor'],
    ['Hayat-ı Muhayyel', 'Hüseyin Cahit Yalçın', 'zor'],
    ['Göl Saatleri', 'Ahmet Hâşim', 'zor'],
    ['Piyale', 'Ahmet Hâşim', 'zor'],
    ['Gurabahâne-i Laklakan', 'Ahmet Hâşim', 'zor'],
    ['Bize Göre', 'Ahmet Hâşim', 'zor'],
  ]),

  ...donem('milli', 'orta', [
    ['Kaşağı', 'Ömer Seyfettin', 'kolay'],
    ['Bomba', 'Ömer Seyfettin', 'zor'],
    ['Yalnız Efe', 'Ömer Seyfettin', 'zor'],
    ['Türkçülüğün Esasları', 'Ziya Gökalp', 'orta'],
    ['Kızıl Elma', 'Ziya Gökalp', 'zor'],
    ['Altın Işık', 'Ziya Gökalp', 'zor'],
    ['Ateşten Gömlek', 'Halide Edib Adıvar', 'kolay'],
    ['Sinekli Bakkal', 'Halide Edib Adıvar', 'kolay'],
    ['Vurun Kahpeye', 'Halide Edib Adıvar', 'kolay'],
    ['Yaban', 'Yakup Kadri Karaosmanoğlu', 'kolay'],
    ['Kiralık Konak', 'Yakup Kadri Karaosmanoğlu', 'orta'],
    ['Nur Baba', 'Yakup Kadri Karaosmanoğlu', 'zor'],
    ['Sodom ve Gomore', 'Yakup Kadri Karaosmanoğlu', 'zor'],
    ['Memleket Hikâyeleri', 'Refik Halit Karay', 'kolay'],
    ['Gurbet Hikâyeleri', 'Refik Halit Karay', 'orta'],
    ['Çalıkuşu', 'Reşat Nuri Güntekin', 'kolay'],
    ['Yaprak Dökümü', 'Reşat Nuri Güntekin', 'kolay'],
    ['Dudaktan Kalbe', 'Reşat Nuri Güntekin', 'orta'],
    ['Türkçe Şiirler', 'Mehmet Emin Yurdakul', 'zor'],
    ['Safahat', 'Mehmet Âkif Ersoy', 'kolay'],
    ['Kendi Gök Kubbemiz', 'Yahya Kemal Beyatlı', 'orta'],
    ['Eski Şiirin Rüzgârıyle', 'Yahya Kemal Beyatlı', 'zor'],
    ['Aziz İstanbul', 'Yahya Kemal Beyatlı', 'zor'],
  ]),

  ...donem('cumhuriyet-siir', 'orta', [
    ['Han Duvarları', 'Faruk Nafiz Çamlıbel', 'kolay'],
    ['Çoban Çeşmesi', 'Faruk Nafiz Çamlıbel'],
    ['Kaldırımlar', 'Necip Fazıl Kısakürek', 'kolay'],
    ['Çile', 'Necip Fazıl Kısakürek', 'kolay'],
    ['Memleketimden İnsan Manzaraları', 'Nâzım Hikmet', 'kolay'],
    ['Kuvâyi Milliye', 'Nâzım Hikmet'],
    ['835 Satır', 'Nâzım Hikmet', 'kolay'],
    ['Garip', 'Orhan Veli Kanık', 'kolay'],
    ['Vazgeçemediğim', 'Orhan Veli Kanık', 'zor'],
    ['Perçemli Sokak', 'Oktay Rifat', 'zor'],
    ['Kolları Bağlı Odysseus', 'Melih Cevdet Anday', 'zor'],
    ['Üvercinka', 'Cemal Süreya'],
    ['Göçebe', 'Cemal Süreya', 'zor'],
    ['Tütünler Islak', 'Turgut Uyar', 'zor'],
    ['Dünyanın En Güzel Arabistanı', 'Turgut Uyar', 'zor'],
    ['Yerçekimli Karanfil', 'Edip Cansever'],
    ['Galile Denizi', 'İlhan Berk', 'zor'],
    ['Kınar Hanımın Denizleri', 'Ece Ayhan', 'zor'],
    ['Monna Rosa', 'Sezai Karakoç', 'kolay'],
    ['Otuz Beş Yaş', 'Cahit Sıtkı Tarancı', 'kolay'],
    ['Soğuk Otların Altında', 'Ülkü Tamer', 'zor'],
    ['Sisler Bulvarı', 'Attilâ İlhan', 'kolay'],
    ['Kapalı Çarşı', 'Behçet Necatigil'],
    ['Çocuk ve Allah', 'Fazıl Hüsnü Dağlarca'],
    ['Fahriye Abla', 'Ahmet Muhip Dıranas', 'kolay'],
    ['Sebil ve Güvercinler', 'Ziya Osman Saba', 'zor'],
    ['Adamın Biri', 'Cahit Külebi', 'zor'],
  ]),

  ...donem('cumhuriyet-roman', 'orta', [
    ['Kürk Mantolu Madonna', 'Sabahattin Ali', 'kolay'],
    ['Kuyucaklı Yusuf', 'Sabahattin Ali', 'kolay'],
    ['Semaver', 'Sait Faik Abasıyanık'],
    ['Sarnıç', 'Sait Faik Abasıyanık', 'zor'],
    ['Bereketli Topraklar Üzerinde', 'Orhan Kemal'],
    ['Murtaza', 'Orhan Kemal', 'zor'],
    ['İnce Memed', 'Yaşar Kemal', 'kolay'],
    ['Yer Demir Gök Bakır', 'Yaşar Kemal', 'zor'],
    ['Devlet Ana', 'Kemal Tahir', 'kolay'],
    ['Yorgun Savaşçı', 'Kemal Tahir'],
    ['Esir Şehrin İnsanları', 'Kemal Tahir', 'zor'],
    ['Tutunamayanlar', 'Oğuz Atay', 'kolay'],
    ['Tehlikeli Oyunlar', 'Oğuz Atay', 'zor'],
    ['Ölmeye Yatmak', 'Adalet Ağaoğlu', 'zor'],
    ['Aylak Adam', 'Yusuf Atılgan', 'kolay'],
    ['Anayurt Oteli', 'Yusuf Atılgan'],
    ['Benim Adım Kırmızı', 'Orhan Pamuk', 'kolay'],
    ['Kar', 'Orhan Pamuk', 'kolay'],
    ['Huzur', 'Ahmet Hamdi Tanpınar', 'kolay'],
    ['Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar', 'kolay'],
    ['Fatih-Harbiye', 'Peyami Safa'],
    ['Dokuzuncu Hariciye Koğuşu', 'Peyami Safa', 'kolay'],
    ['Küçük Ağa', 'Tarık Buğra'],
    ['Keşanlı Ali Destanı', 'Haldun Taner'],
    ['Şişhane’ye Yağmur Yağıyordu', 'Haldun Taner', 'zor'],
    ['Yılanların Öcü', 'Fakir Baykurt', 'kolay'],
    ['Tütün Zamanı', 'Necati Cumalı', 'zor'],
    ['Zübük', 'Aziz Nesin', 'zor'],
    ['Yaşar Ne Yaşar Ne Yaşamaz', 'Aziz Nesin', 'zor'],
    ['Uzun Sürmüş Bir Günün Akşamı', 'Bilge Karasu', 'zor'],
    ['Buzlar Çözülmeden', 'Cevat Fehmi Başkut', 'zor'],
  ]),
]

/** Havuzdaki eser sayısı — tanıtım ekranı bunu yazıyor. */
export const EDEBIYAT_BOYUTU = EDEBIYAT_HAVUZU.length
