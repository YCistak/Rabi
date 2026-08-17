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
function donem(donem: EdebiyatDonemi, ciftler: [string, string][]): EdebiyatEsi[] {
  return ciftler.map(([eser, yazar]) => ({ eser, yazar, donem }))
}

export const EDEBIYAT_HAVUZU: EdebiyatEsi[] = [
  ...donem('ilk', [
    ['Kutadgu Bilig', 'Yusuf Has Hâcib'],
    ['Divânü Lugâti’t-Türk', 'Kâşgarlı Mahmut'],
    ['Atabetü’l-Hakayık', 'Edip Ahmet Yükneki'],
    ['Divan-ı Hikmet', 'Ahmet Yesevî'],
    ['Muhakemetü’l-Lugateyn', 'Ali Şîr Nevâî'],
    ['Garipnâme', 'Âşık Paşa'],
  ]),

  ...donem('divan', [
    ['Hüsn ü Aşk', 'Şeyh Galip'],
    ['Harnâme', 'Şeyhî'],
    ['Hüsrev ü Şirin', 'Şeyhî'],
    ['Mantıku’t-Tayr', 'Gülşehrî'],
    ['Hayriyye', 'Nâbî'],
    ['Hayrâbâd', 'Nâbî'],
    ['Leylâ ile Mecnun', 'Fuzûlî'],
    ['Şikâyetnâme', 'Fuzûlî'],
    ['Su Kasidesi', 'Fuzûlî'],
    ['Beng ü Bâde', 'Fuzûlî'],
    ['Mesnevî', 'Mevlânâ'],
    ['Divan-ı Kebir', 'Mevlânâ'],
    ['Fîhi Mâ Fîh', 'Mevlânâ'],
    ['İskendernâme', 'Ahmedî'],
    ['Kâbusnâme çevirisi', 'Mercimek Ahmet'],
    ['Keşfü’z-Zünûn', 'Kâtip Çelebi'],
    ['Cihannümâ', 'Kâtip Çelebi'],
    ['Seyahatnâme', 'Evliya Çelebi'],
    ['Vesîletü’n-Necât (Mevlid)', 'Süleyman Çelebi'],
    ['Kanunî Mersiyesi', 'Bâkî'],
    ['Sihâm-ı Kazâ', 'Nef’î'],
    ['Tazarrunâme', 'Sinan Paşa'],
    ['Meşâirü’ş-Şuarâ', 'Âşık Çelebi'],
    ['Tezkiretü’ş-Şuarâ', 'Latîfî'],
    ['Naîmâ Tarihi', 'Naîmâ'],
    ['Sefaretnâme', 'Yirmisekiz Çelebi Mehmet'],
  ]),

  ...donem('halk', [
    ['Risâletü’n-Nushiyye', 'Yunus Emre'],
    ['Budalanâme', 'Kaygusuz Abdal'],
    ['Dilgüşâ', 'Kaygusuz Abdal'],
    ['Makâlât', 'Hacı Bektaş Velî'],
    ['Dostlar Beni Hatırlasın', 'Âşık Veysel'],
  ]),

  ...donem('tanzimat', [
    ['Şair Evlenmesi', 'Şinasi'],
    ['Tercüman-ı Ahval Mukaddimesi', 'Şinasi'],
    ['Müntehabat-ı Eş’ar', 'Şinasi'],
    ['İntibah', 'Namık Kemal'],
    ['Cezmi', 'Namık Kemal'],
    ['Vatan yahut Silistre', 'Namık Kemal'],
    ['Zavallı Çocuk', 'Namık Kemal'],
    ['Terkib-i Bend', 'Ziya Paşa'],
    ['Harâbat', 'Ziya Paşa'],
    ['Zafernâme', 'Ziya Paşa'],
    ['Felâtun Bey ile Râkım Efendi', 'Ahmet Mithat Efendi'],
    ['Henüz On Yedi Yaşında', 'Ahmet Mithat Efendi'],
    ['Hasan Mellah', 'Ahmet Mithat Efendi'],
    ['Araba Sevdası', 'Recaizade Mahmut Ekrem'],
    ['Muhsin Bey', 'Recaizade Mahmut Ekrem'],
    ['Talim-i Edebiyat', 'Recaizade Mahmut Ekrem'],
    ['Sergüzeşt', 'Samipaşazade Sezai'],
    ['Küçük Şeyler', 'Samipaşazade Sezai'],
    ['Makber', 'Abdülhak Hâmit Tarhan'],
    ['Eşber', 'Abdülhak Hâmit Tarhan'],
    ['Sahra', 'Abdülhak Hâmit Tarhan'],
    ['Ömer’in Çocukluğu', 'Muallim Naci'],
    ['Demdeme', 'Muallim Naci'],
    ['Karabibik', 'Nabizade Nâzım'],
    ['Zehra', 'Nabizade Nâzım'],
    ['Taaşşuk-ı Talat ve Fitnat', 'Şemsettin Sami'],
    ['Kamus-ı Türkî', 'Şemsettin Sami'],
  ]),

  ...donem('servet', [
    ['Mai ve Siyah', 'Halit Ziya Uşaklıgil'],
    ['Aşk-ı Memnu', 'Halit Ziya Uşaklıgil'],
    ['Kırık Hayatlar', 'Halit Ziya Uşaklıgil'],
    ['Eylül', 'Mehmet Rauf'],
    ['Rübâb-ı Şikeste', 'Tevfik Fikret'],
    ['Haluk’un Defteri', 'Tevfik Fikret'],
    ['Şermin', 'Tevfik Fikret'],
    ['Elhan-ı Şitâ', 'Cenap Şahabettin'],
    ['Hac Yolunda', 'Cenap Şahabettin'],
    ['Evrak-ı Eyyam', 'Cenap Şahabettin'],
    ['Şıpsevdi', 'Hüseyin Rahmi Gürpınar'],
    ['Gulyabani', 'Hüseyin Rahmi Gürpınar'],
    ['Mürebbiye', 'Hüseyin Rahmi Gürpınar'],
    ['Şehir Mektupları', 'Ahmet Rasim'],
    ['Hayat-ı Muhayyel', 'Hüseyin Cahit Yalçın'],
    ['Göl Saatleri', 'Ahmet Hâşim'],
    ['Piyale', 'Ahmet Hâşim'],
    ['Gurabahâne-i Laklakan', 'Ahmet Hâşim'],
    ['Bize Göre', 'Ahmet Hâşim'],
  ]),

  ...donem('milli', [
    ['Kaşağı', 'Ömer Seyfettin'],
    ['Bomba', 'Ömer Seyfettin'],
    ['Yalnız Efe', 'Ömer Seyfettin'],
    ['Türkçülüğün Esasları', 'Ziya Gökalp'],
    ['Kızıl Elma', 'Ziya Gökalp'],
    ['Altın Işık', 'Ziya Gökalp'],
    ['Ateşten Gömlek', 'Halide Edib Adıvar'],
    ['Sinekli Bakkal', 'Halide Edib Adıvar'],
    ['Vurun Kahpeye', 'Halide Edib Adıvar'],
    ['Yaban', 'Yakup Kadri Karaosmanoğlu'],
    ['Kiralık Konak', 'Yakup Kadri Karaosmanoğlu'],
    ['Nur Baba', 'Yakup Kadri Karaosmanoğlu'],
    ['Sodom ve Gomore', 'Yakup Kadri Karaosmanoğlu'],
    ['Memleket Hikâyeleri', 'Refik Halit Karay'],
    ['Gurbet Hikâyeleri', 'Refik Halit Karay'],
    ['Çalıkuşu', 'Reşat Nuri Güntekin'],
    ['Yaprak Dökümü', 'Reşat Nuri Güntekin'],
    ['Dudaktan Kalbe', 'Reşat Nuri Güntekin'],
    ['Türkçe Şiirler', 'Mehmet Emin Yurdakul'],
    ['Safahat', 'Mehmet Âkif Ersoy'],
    ['Kendi Gök Kubbemiz', 'Yahya Kemal Beyatlı'],
    ['Eski Şiirin Rüzgârıyle', 'Yahya Kemal Beyatlı'],
    ['Aziz İstanbul', 'Yahya Kemal Beyatlı'],
  ]),

  ...donem('cumhuriyet-siir', [
    ['Han Duvarları', 'Faruk Nafiz Çamlıbel'],
    ['Çoban Çeşmesi', 'Faruk Nafiz Çamlıbel'],
    ['Kaldırımlar', 'Necip Fazıl Kısakürek'],
    ['Çile', 'Necip Fazıl Kısakürek'],
    ['Memleketimden İnsan Manzaraları', 'Nâzım Hikmet'],
    ['Kuvâyi Milliye', 'Nâzım Hikmet'],
    ['835 Satır', 'Nâzım Hikmet'],
    ['Garip', 'Orhan Veli Kanık'],
    ['Vazgeçemediğim', 'Orhan Veli Kanık'],
    ['Perçemli Sokak', 'Oktay Rifat'],
    ['Kolları Bağlı Odysseus', 'Melih Cevdet Anday'],
    ['Üvercinka', 'Cemal Süreya'],
    ['Göçebe', 'Cemal Süreya'],
    ['Tütünler Islak', 'Turgut Uyar'],
    ['Dünyanın En Güzel Arabistanı', 'Turgut Uyar'],
    ['Yerçekimli Karanfil', 'Edip Cansever'],
    ['Galile Denizi', 'İlhan Berk'],
    ['Kınar Hanımın Denizleri', 'Ece Ayhan'],
    ['Monna Rosa', 'Sezai Karakoç'],
    ['Otuz Beş Yaş', 'Cahit Sıtkı Tarancı'],
    ['Soğuk Otların Altında', 'Ülkü Tamer'],
    ['Sisler Bulvarı', 'Attilâ İlhan'],
    ['Kapalı Çarşı', 'Behçet Necatigil'],
    ['Çocuk ve Allah', 'Fazıl Hüsnü Dağlarca'],
    ['Fahriye Abla', 'Ahmet Muhip Dıranas'],
    ['Sebil ve Güvercinler', 'Ziya Osman Saba'],
    ['Adamın Biri', 'Cahit Külebi'],
  ]),

  ...donem('cumhuriyet-roman', [
    ['Kürk Mantolu Madonna', 'Sabahattin Ali'],
    ['Kuyucaklı Yusuf', 'Sabahattin Ali'],
    ['Semaver', 'Sait Faik Abasıyanık'],
    ['Sarnıç', 'Sait Faik Abasıyanık'],
    ['Bereketli Topraklar Üzerinde', 'Orhan Kemal'],
    ['Murtaza', 'Orhan Kemal'],
    ['İnce Memed', 'Yaşar Kemal'],
    ['Yer Demir Gök Bakır', 'Yaşar Kemal'],
    ['Devlet Ana', 'Kemal Tahir'],
    ['Yorgun Savaşçı', 'Kemal Tahir'],
    ['Esir Şehrin İnsanları', 'Kemal Tahir'],
    ['Tutunamayanlar', 'Oğuz Atay'],
    ['Tehlikeli Oyunlar', 'Oğuz Atay'],
    ['Ölmeye Yatmak', 'Adalet Ağaoğlu'],
    ['Aylak Adam', 'Yusuf Atılgan'],
    ['Anayurt Oteli', 'Yusuf Atılgan'],
    ['Benim Adım Kırmızı', 'Orhan Pamuk'],
    ['Kar', 'Orhan Pamuk'],
    ['Huzur', 'Ahmet Hamdi Tanpınar'],
    ['Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar'],
    ['Fatih-Harbiye', 'Peyami Safa'],
    ['Dokuzuncu Hariciye Koğuşu', 'Peyami Safa'],
    ['Küçük Ağa', 'Tarık Buğra'],
    ['Keşanlı Ali Destanı', 'Haldun Taner'],
    ['Şişhane’ye Yağmur Yağıyordu', 'Haldun Taner'],
    ['Yılanların Öcü', 'Fakir Baykurt'],
    ['Tütün Zamanı', 'Necati Cumalı'],
    ['Zübük', 'Aziz Nesin'],
    ['Yaşar Ne Yaşar Ne Yaşamaz', 'Aziz Nesin'],
    ['Uzun Sürmüş Bir Günün Akşamı', 'Bilge Karasu'],
    ['Buzlar Çözülmeden', 'Cevat Fehmi Başkut'],
  ]),
]

/** Havuzdaki eser sayısı — tanıtım ekranı bunu yazıyor. */
export const EDEBIYAT_BOYUTU = EDEBIYAT_HAVUZU.length
