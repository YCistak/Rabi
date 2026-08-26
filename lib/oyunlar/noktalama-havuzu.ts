/**
 * Noktalama sorularının havuzu — Yazım Ustası'nın ikinci soru türü.
 *
 * Yapı yazım havuzundan farklı: orada iki yazılıştan **doğrusu** seçiliyor,
 * burada bir cümledeki **yanlış** işaret bulunuyor. Sebebi, noktalama hatasının
 * kelimede değil cümlede yaşaması — işareti bağlamından koparıp sorarsan
 * ezberletirsin, cümlenin içinde sorarsan okutursun. ÖSYM de yıllardır böyle
 * soruyor: "Bu cümlede noktalama yanlışı hangi işarette yapılmıştır?"
 *
 * Kaynak: TDK Yazım Kılavuzu'nun Noktalama İşaretleri bölümü. MEB'in Türkçe ve
 * Türk Dili ve Edebiyatı programları yazım ve noktalamada TDK'yı esas aldığı
 * için ikisi ayrışmıyor; kural metinleri kılavuzdaki maddelerin kısaltılmış
 * hâli.
 *
 * Havuzdaki her cümlede **yanlış işaret yalnızca bir kez** geçiyor. Aynı işaret
 * cümlede bir doğru bir yanlış kullanılsaydı oyuncu "virgül zaten doğru
 * kullanılmış" diye eleyip cevabı okumadan bulurdu; soru da hangi virgülü
 * kastettiğini söyleyemezdi. `noktalama.test.ts` bunu havuzun tamamında
 * doğruluyor.
 */

export type NoktalamaIsareti =
  | 'nokta'
  | 'virgul'
  | 'noktali-virgul'
  | 'iki-nokta'
  | 'uc-nokta'
  | 'soru'
  | 'unlem'
  | 'kesme'
  | 'tirnak'
  | 'kisa-cizgi'
  | 'parantez'

/**
 * Şıkta görünen işaret.
 *
 * Tırnak ve parantez çift kullanılıyor ama şıkta tek karakter duruyor: iki
 * karakter yan yana konsaydı düğme "işareti seç" değil "kalıbı seç" gibi
 * okunurdu. Havuzdaki sayım da bu karaktere göre yapılıyor (bkz. test).
 */
export const ISARET_SIMGESI: Record<NoktalamaIsareti, string> = {
  nokta: '.',
  virgul: ',',
  'noktali-virgul': ';',
  'iki-nokta': ':',
  'uc-nokta': '…',
  soru: '?',
  unlem: '!',
  kesme: '’',
  tirnak: '“',
  'kisa-cizgi': '-',
  parantez: '(',
}

export const ISARET_ADI: Record<NoktalamaIsareti, string> = {
  nokta: 'nokta',
  virgul: 'virgül',
  'noktali-virgul': 'noktalı virgül',
  'iki-nokta': 'iki nokta',
  'uc-nokta': 'üç nokta',
  soru: 'soru işareti',
  unlem: 'ünlem',
  kesme: 'kesme işareti',
  tirnak: 'tırnak işareti',
  'kisa-cizgi': 'kısa çizgi',
  parantez: 'parantez',
}

import type { Zorluk } from './ritim'

export type NoktalamaKurali =
  | 've-virgul'
  | 'sirali-virgul'
  | 'soru-anlami'
  | 'soru-cumlesi'
  | 'saat-nokta'
  | 'iki-nokta-aciklama'
  | 'kesme-yapim-eki'
  | 'kesme-cokluk'
  | 'hitap-virgul'
  | 'unlem-duygu'
  | 'tirnak-eser-adi'
  | 'parantez-ek-bilgi'
  | 'kesme-kurum'
  | 'noktali-virgul-tur'
  | 'noktali-virgul-cumle'
  | 'uc-nokta-eksiltme'
  | 'zarf-fiil-virgul'
  | 'sart-eki-virgul'
  | 'kesme-cins-isim'

/** Sonuç ekranında, yanlış bilinen cümlenin altında görünen kural. */
export const NOKTALAMA_ACIKLAMASI: Record<NoktalamaKurali, string> = {
  've-virgul': '“ve, veya, yahut, ile” bağlaçlarından önce de sonra da virgül konmaz.',
  'sirali-virgul':
    'Eş görevli kelimelerin arasına virgül konur; noktalı virgül ya da iki nokta gelmez.',
  'soru-anlami':
    'Soru eki ya da soru sözü bulunsa bile soru anlamı taşımayan cümlenin sonuna soru işareti konmaz.',
  'soru-cumlesi': 'Soru bildiren cümlelerin ve sözlerin sonuna soru işareti konur.',
  'saat-nokta':
    'Saat ile dakikayı ayırmak için nokta konur (09.45); bu iş için iki nokta kullanılmaz.',
  'iki-nokta-aciklama':
    'Kendisiyle ilgili açıklama yapılacak ya da örnek verilecek cümlenin sonuna iki nokta konur.',
  'kesme-yapim-eki':
    'Özel adlara getirilen yapım ekleri ve bunlardan sonra gelen ekler kesme işaretiyle ayrılmaz.',
  'kesme-cokluk':
    'Özel adlara getirilen çokluk eki ve sonrasındaki ekler kesme işaretiyle ayrılmaz.',
  'hitap-virgul': 'Hitap ve seslenme sözlerinden sonra virgül konur.',
  'unlem-duygu':
    'Sevinç, kıvanç, acı, korku, şaşma gibi duyguları anlatan cümlelerin sonuna ünlem konur.',
  'tirnak-eser-adi':
    'Cümle içinde eserlerin ve yazıların adları ile bölüm başlıkları tırnak içine alınır.',
  'parantez-ek-bilgi':
    'Cümledeki anlamı tamamlayan, cümlenin dışında kalan ek bilgiler yay ayraç içine alınır.',
  'kesme-kurum':
    'Kurum, kuruluş, kurul, birleşim, oturum ve iş yeri adlarına gelen ekler kesme işaretiyle ayrılmaz.',
  'noktali-virgul-tur':
    'Cümle içinde virgüllerle ayrılmış tür veya takımları birbirinden ayırmak için noktalı virgül konur.',
  'uc-nokta-eksiltme': 'Anlam bakımından tamamlanmamış cümlelerin sonuna üç nokta konur.',
  'noktali-virgul-cumle':
    'Bağımsız cümleler virgülle değil noktalı virgülle ayrılır; özellikle ikinci cümle “ancak, fakat, ama, oysa” gibi bir bağlaçla başlıyorsa.',
  'zarf-fiil-virgul': 'Zarf-fiil ekleriyle kurulmuş sözlerden sonra virgül konmaz.',
  'sart-eki-virgul': 'Şart ekinden (-se, -sa) sonra virgül konmaz.',
  'kesme-cins-isim':
    'Cins isimlere getirilen çekim ekleri kesme işaretiyle ayrılmaz; kesme yalnızca özel adlarda kullanılır.',
}

export type NoktalamaSorusu = {
  /** Ekrana gelen cümle — yanlış işaret içinde duruyor. */
  cumle: string
  /** Cümlenin doğru hâli; tur sonunda gösteriliyor. */
  duzeltme: string
  /** Yanlış kullanılmış işaret: oyuncunun bulması gereken şık. */
  yanlisIsaret: NoktalamaIsareti
  /** Cümlede doğru kullanılmış bir işaret: çeldirici şık. */
  dogruIsaret: NoktalamaIsareti
  kural: NoktalamaKurali
  /**
   * Zorluk — kuralın kendisinden geliyor.
   *
   * Noktalamada soruyu zorlaştıran şey cümle değil kural: "ve"den önce virgül
   * konmaz herkesin bildiği hata, "soru eki var ama cümle soru değil" ise
   * ÖSYM'nin klasik tuzağı. O yüzden burada tek tek istisna yok.
   */
  zorluk: Zorluk
}

/** Satırları tek kurala bağlar — havuzu okunur tutmak için. */
function grup(
  kural: NoktalamaKurali,
  zorluk: Zorluk,
  satirlar: [string, string, NoktalamaIsareti, NoktalamaIsareti][],
): NoktalamaSorusu[] {
  return satirlar.map(([cumle, duzeltme, yanlisIsaret, dogruIsaret]) => ({
    cumle,
    duzeltme,
    yanlisIsaret,
    dogruIsaret,
    kural,
    zorluk,
  }))
}

export const NOKTALAMA_HAVUZU: NoktalamaSorusu[] = [
  // -------------------------------------------------------------------------
  // “ve, veya, ile” bağlaçlarından önce virgül — en sık yapılan hata
  // -------------------------------------------------------------------------
  ...grup('ve-virgul', 'kolay', [
    [
      'Ali, ve Ayşe sabah erkenden yola çıktı.',
      'Ali ve Ayşe sabah erkenden yola çıktı.',
      'virgul',
      'nokta',
    ],
    [
      'Çantasını aldı, ve arkasına bakmadan sınıftan çıktı.',
      'Çantasını aldı ve arkasına bakmadan sınıftan çıktı.',
      'virgul',
      'nokta',
    ],
    [
      'Zil çaldı, ve bütün öğrenciler bahçeye koştu.',
      'Zil çaldı ve bütün öğrenciler bahçeye koştu.',
      'virgul',
      'nokta',
    ],
    [
      'Sınavda Türkçe, veya matematik netleri belirleyici olacak.',
      'Sınavda Türkçe veya matematik netleri belirleyici olacak.',
      'virgul',
      'nokta',
    ],
    [
      'Annesi ile, babası mezuniyet törenine geldi.',
      'Annesi ile babası mezuniyet törenine geldi.',
      'virgul',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Eş görevli kelimeler arasında virgül
  // -------------------------------------------------------------------------
  ...grup('sirali-virgul', 'orta', [
    [
      'Sepette elma; armut ve üzüm vardı.',
      'Sepette elma, armut ve üzüm vardı.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Masanın üzerinde kitap: defter ve kalem duruyordu.',
      'Masanın üzerinde kitap, defter ve kalem duruyordu.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Kütüphaneden roman; öykü ve şiir kitapları aldım.',
      'Kütüphaneden roman, öykü ve şiir kitapları aldım.',
      'noktali-virgul',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Soru anlamı olmayan cümlede soru işareti — ÖSYM'nin klasiği
  // -------------------------------------------------------------------------
  ...grup('soru-anlami', 'zor', [
    [
      'Ayşe’nin sınava nasıl hazırlandığını bilmiyorum?',
      'Ayşe’nin sınava nasıl hazırlandığını bilmiyorum.',
      'soru',
      'kesme',
    ],
    [
      'Kitabı kimin aldığını Ahmet’e sormadım?',
      'Kitabı kimin aldığını Ahmet’e sormadım.',
      'soru',
      'kesme',
    ],
    [
      'Toplantının kaçta biteceğini kimse bilmiyordu, herkes saatine bakıyordu?',
      'Toplantının kaçta biteceğini kimse bilmiyordu, herkes saatine bakıyordu.',
      'soru',
      'virgul',
    ],
    [
      'Sınav sonuçlarını ÖSYM’nin sitesinden öğrendim?',
      'Sınav sonuçlarını ÖSYM’nin sitesinden öğrendim.',
      'soru',
      'kesme',
    ],
    [
      'Bu soruyu nasıl çözdüğümü, açıkçası, ben de hatırlamıyorum?',
      'Bu soruyu nasıl çözdüğümü, açıkçası, ben de hatırlamıyorum.',
      'soru',
      'virgul',
    ],
    [
      'Sınıfta Ali, Ayşe ve Mehmet vardı; bahçede kimse yoktu?',
      'Sınıfta Ali, Ayşe ve Mehmet vardı; bahçede kimse yoktu.',
      'soru',
      'noktali-virgul',
    ],
    [
      'Öğretmen, “Yarın sınav var.” dedi?',
      'Öğretmen, “Yarın sınav var.” dedi.',
      'soru',
      'tirnak',
    ],
    [
      'Millî Eğitim Bakanlığı (MEB), sınav takvimini açıkladı?',
      'Millî Eğitim Bakanlığı (MEB), sınav takvimini açıkladı.',
      'soru',
      'parantez',
    ],
    [
      'Sınavda dikkat, sabır, düzenli tekrar… hepsi gerekiyor?',
      'Sınavda dikkat, sabır, düzenli tekrar… hepsi gerekiyor.',
      'soru',
      'uc-nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Soru cümlesinin sonunda nokta
  // -------------------------------------------------------------------------
  ...grup('soru-cumlesi', 'kolay', [
    [
      'Ayşe’nin sınavı ne zaman başlıyor.',
      'Ayşe’nin sınavı ne zaman başlıyor?',
      'nokta',
      'kesme',
    ],
    [
      'Bu kitabı sen mi aldın, kardeşin mi.',
      'Bu kitabı sen mi aldın, kardeşin mi?',
      'nokta',
      'virgul',
    ],
    [
      'Yarın okula gelecek misin, yoksa evde mi kalacaksın.',
      'Yarın okula gelecek misin, yoksa evde mi kalacaksın?',
      'nokta',
      'virgul',
    ],
    [
      'Sınava kaç gün kaldığını hesapladın mı, Ahmet.',
      'Sınava kaç gün kaldığını hesapladın mı, Ahmet?',
      'nokta',
      'virgul',
    ],
    ['Bu soruyu Ahmet’e mi sordun.', 'Bu soruyu Ahmet’e mi sordun?', 'nokta', 'kesme'],
  ]),

  // -------------------------------------------------------------------------
  // Saat ile dakika arasında nokta
  // -------------------------------------------------------------------------
  ...grup('saat-nokta', 'orta', [
    [
      'Tren istasyondan tam 09:45’te kalkacak.',
      'Tren istasyondan tam 09.45’te kalkacak.',
      'iki-nokta',
      'kesme',
    ],
    [
      'Türkiye-Yunanistan maçı 20:30’da başlayacak.',
      'Türkiye-Yunanistan maçı 20.30’da başlayacak.',
      'iki-nokta',
      'kisa-cizgi',
    ],
    [
      'Sınav 10:15’te başlayacak, 12.45’te bitecek.',
      'Sınav 10.15’te başlayacak, 12.45’te bitecek.',
      'iki-nokta',
      'virgul',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Açıklama ve örnek öncesinde iki nokta
  // -------------------------------------------------------------------------
  ...grup('iki-nokta-aciklama', 'orta', [
    [
      'Çantamda şunlar vardı; kalem, silgi ve defter.',
      'Çantamda şunlar vardı: kalem, silgi ve defter.',
      'noktali-virgul',
      'virgul',
    ],
    [
      'Öğretmen şunu söyledi, sınav yarın saat 10.00’da başlayacak.',
      'Öğretmen şunu söyledi: sınav yarın saat 10.00’da başlayacak.',
      'virgul',
      'kesme',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Kesme işareti — yapım eki ve sonrasındaki ekler ayrılmaz
  // -------------------------------------------------------------------------
  ...grup('kesme-yapim-eki', 'zor', [
    [
      'Ankara’lı arkadaşım yarın bize gelecek.',
      'Ankaralı arkadaşım yarın bize gelecek.',
      'kesme',
      'nokta',
    ],
    ['Türkçe’de sesli harf sekiz tanedir.', 'Türkçede sesli harf sekiz tanedir.', 'kesme', 'nokta'],
    [
      'Avrupa’lılar bu konuda çok farklı düşünüyor.',
      'Avrupalılar bu konuda çok farklı düşünüyor.',
      'kesme',
      'nokta',
    ],
    [
      'İstanbul’lu olduğunu sonradan öğrendim.',
      'İstanbullu olduğunu sonradan öğrendim.',
      'kesme',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Kesme işareti — çokluk eki ayrılmaz
  // -------------------------------------------------------------------------
  ...grup('kesme-cokluk', 'zor', [
    ['Ali’ler bu akşam bize gelecek.', 'Aliler bu akşam bize gelecek.', 'kesme', 'nokta'],
    [
      'Kitabı Ahmet’lerde unutmuşum, yarın alırım.',
      'Kitabı Ahmetlerde unutmuşum, yarın alırım.',
      'kesme',
      'virgul',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Hitap ve seslenmeden sonra virgül
  // -------------------------------------------------------------------------
  ...grup('hitap-virgul', 'kolay', [
    [
      'Aman Allah’ım; ne kadar da büyümüşsün!',
      'Aman Allah’ım, ne kadar da büyümüşsün!',
      'noktali-virgul',
      'unlem',
    ],
    [
      'Sayın Öğretmenim; dersinize katılamayacağım.',
      'Sayın Öğretmenim, dersinize katılamayacağım.',
      'noktali-virgul',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // “ve, veya, yahut, ile” bağlacının çevresinde virgül
  // -------------------------------------------------------------------------
  ...grup('ve-virgul', 'kolay', [
    [
      'Defterini açtı, ve notlarını gözden geçirdi.',
      'Defterini açtı ve notlarını gözden geçirdi.',
      'virgul',
      'nokta',
    ],
    [
      'Ahmet’in kalemi, ve silgisi çantasında kalmış.',
      'Ahmet’in kalemi ve silgisi çantasında kalmış.',
      'virgul',
      'kesme',
    ],
    [
      'Yağmur başladı, ve maç yarıda kesildi.',
      'Yağmur başladı ve maç yarıda kesildi.',
      'virgul',
      'nokta',
    ],
    ['Kahve, veya çay içmek ister misin?', 'Kahve veya çay içmek ister misin?', 'virgul', 'soru'],
    [
      'Deneme sonuçlarını öğretmenim ile, ben inceledik.',
      'Deneme sonuçlarını öğretmenim ile ben inceledik.',
      'virgul',
      'nokta',
    ],
    [
      'Ne kadar hızlı koşuyor, ve hiç yorulmuyor!',
      'Ne kadar hızlı koşuyor ve hiç yorulmuyor!',
      'virgul',
      'unlem',
    ],
    [
      'Bugün, yahut yarın size uğrayıp konuyu anlatırım.',
      'Bugün yahut yarın size uğrayıp konuyu anlatırım.',
      'virgul',
      'nokta',
    ],
    [
      'Kitabı okudu, ve raftaki yerine kaldırdı.',
      'Kitabı okudu ve raftaki yerine kaldırdı.',
      'virgul',
      'nokta',
    ],
    [
      'Süre doldu, ve herkes kâğıdını teslim etti.',
      'Süre doldu ve herkes kâğıdını teslim etti.',
      'virgul',
      'nokta',
    ],
    [
      'Öğretmen “Kalemleri bırakın.” dedi, ve salondan çıktı.',
      'Öğretmen “Kalemleri bırakın.” dedi ve salondan çıktı.',
      'virgul',
      'tirnak',
    ],
    [
      'Sınavda ilk oturum (TYT), ve ikinci oturum aynı gün yapılacak.',
      'Sınavda ilk oturum (TYT) ve ikinci oturum aynı gün yapılacak.',
      'virgul',
      'parantez',
    ],
    [
      'Odasını topladı, ve ders çalışmaya oturdu.',
      'Odasını topladı ve ders çalışmaya oturdu.',
      'virgul',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Soru cümlesinin sonunda nokta
  // -------------------------------------------------------------------------
  ...grup('soru-cumlesi', 'kolay', [
    [
      'Bu konuyu kaç kere tekrar ettin, Ayşe.',
      'Bu konuyu kaç kere tekrar ettin, Ayşe?',
      'nokta',
      'virgul',
    ],
    [
      'ÖSYM’nin sınav takvimi ne zaman açıklanacak.',
      'ÖSYM’nin sınav takvimi ne zaman açıklanacak?',
      'nokta',
      'kesme',
    ],
    [
      'Kütüphane saat kaçta kapanıyor, biliyor musun.',
      'Kütüphane saat kaçta kapanıyor, biliyor musun?',
      'nokta',
      'virgul',
    ],
    ['Bunu Ahmet’e kim söylemiş.', 'Bunu Ahmet’e kim söylemiş?', 'nokta', 'kesme'],
    [
      'Yarın deneme mi var, yoksa ders mi işleyeceğiz.',
      'Yarın deneme mi var, yoksa ders mi işleyeceğiz?',
      'nokta',
      'virgul',
    ],
    [
      'Sen de mi bu soruyu boş bıraktın, Mehmet.',
      'Sen de mi bu soruyu boş bıraktın, Mehmet?',
      'nokta',
      'virgul',
    ],
    [
      'Kaç sorunun doğru olduğunu Ahmet’e mi soracaksın.',
      'Kaç sorunun doğru olduğunu Ahmet’e mi soracaksın?',
      'nokta',
      'kesme',
    ],
    [
      'İstanbul-Ankara treni kaçta kalkıyor.',
      'İstanbul-Ankara treni kaçta kalkıyor?',
      'nokta',
      'kisa-cizgi',
    ],
    [
      'Toplantıya Millî Eğitim Bakanlığı (MEB) da katılacak mı.',
      'Toplantıya Millî Eğitim Bakanlığı (MEB) da katılacak mı?',
      'nokta',
      'parantez',
    ],
    [
      'Ne demek istediğini anlamadım; sen anladın mı.',
      'Ne demek istediğini anlamadım; sen anladın mı?',
      'nokta',
      'noktali-virgul',
    ],
    [
      'Kalem, silgi, defter… hepsini aldın mı.',
      'Kalem, silgi, defter… hepsini aldın mı?',
      'nokta',
      'uc-nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Hitap ve seslenmeden sonra virgül
  // -------------------------------------------------------------------------
  ...grup('hitap-virgul', 'kolay', [
    [
      'Sevgili arkadaşlar; bugünkü konumuz noktalama işaretleri.',
      'Sevgili arkadaşlar, bugünkü konumuz noktalama işaretleri.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Çocuklar: sıralarınızı düzeltin lütfen.',
      'Çocuklar, sıralarınızı düzeltin lütfen.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Arkadaşlar; sınava yalnızca iki gün kaldı!',
      'Arkadaşlar, sınava yalnızca iki gün kaldı!',
      'noktali-virgul',
      'unlem',
    ],
    [
      'Hocam; bu soruyu bir daha anlatır mısınız?',
      'Hocam, bu soruyu bir daha anlatır mısınız?',
      'noktali-virgul',
      'soru',
    ],
    [
      'Sayın veliler: toplantı yarın saat 14.00’te yapılacak.',
      'Sayın veliler, toplantı yarın saat 14.00’te yapılacak.',
      'iki-nokta',
      'kesme',
    ],
    ['Ali: şu pencereyi kapatır mısın?', 'Ali, şu pencereyi kapatır mısın?', 'iki-nokta', 'soru'],
  ]),

  // -------------------------------------------------------------------------
  // Duygu bildiren cümlenin sonunda ünlem
  // -------------------------------------------------------------------------
  ...grup('unlem-duygu', 'kolay', [
    ['Aman, dikkat et.', 'Aman, dikkat et!', 'nokta', 'virgul'],
    ['Vay canına, ne büyük bir balık.', 'Vay canına, ne büyük bir balık!', 'nokta', 'virgul'],
    ['Eyvah, son otobüsü de kaçırdık.', 'Eyvah, son otobüsü de kaçırdık!', 'nokta', 'virgul'],
    ['Ne kadar da büyümüşsün Ayşe’ciğim.', 'Ne kadar da büyümüşsün Ayşe’ciğim!', 'nokta', 'kesme'],
    [
      'Öf, bu soruyu yine çözemedim; iyice sinirlendim.',
      'Öf, bu soruyu yine çözemedim; iyice sinirlendim!',
      'nokta',
      'noktali-virgul',
    ],
    ['Ah, o günler… ne güzeldi.', 'Ah, o günler… ne güzeldi!', 'nokta', 'uc-nokta'],
  ]),

  // -------------------------------------------------------------------------
  // Eş görevli kelimeler arasında virgül
  // -------------------------------------------------------------------------
  ...grup('sirali-virgul', 'orta', [
    [
      'Bahçede gül; lale ve karanfil açmıştı.',
      'Bahçede gül, lale ve karanfil açmıştı.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Çantasında kitap: defter ve kalemlik vardı.',
      'Çantasında kitap, defter ve kalemlik vardı.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Ahmet’in odasında masa; sandalye ve kitaplık vardı.',
      'Ahmet’in odasında masa, sandalye ve kitaplık vardı.',
      'noktali-virgul',
      'kesme',
    ],
    [
      'Sınavda Türkçe: matematik ve fen soruları mı çıkacak?',
      'Sınavda Türkçe, matematik ve fen soruları mı çıkacak?',
      'iki-nokta',
      'soru',
    ],
    [
      'Yorgun; bitkin ve umutsuz bir hâlde eve döndü.',
      'Yorgun, bitkin ve umutsuz bir hâlde eve döndü.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Buzdolabında süt: peynir ve zeytin vardı; ekmek yoktu.',
      'Buzdolabında süt, peynir ve zeytin vardı; ekmek yoktu.',
      'iki-nokta',
      'noktali-virgul',
    ],
    [
      'Ne güzel; ne temiz ve ne aydınlık bir sınıf!',
      'Ne güzel, ne temiz ve ne aydınlık bir sınıf!',
      'noktali-virgul',
      'unlem',
    ],
    [
      'Toplantıya müdür: müdür yardımcısı ve rehber öğretmen katıldı.',
      'Toplantıya müdür, müdür yardımcısı ve rehber öğretmen katıldı.',
      'iki-nokta',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Saat ile dakika arasında nokta
  // -------------------------------------------------------------------------
  ...grup('saat-nokta', 'orta', [
    ['Ders 08:30’da başlıyor.', 'Ders 08.30’da başlıyor.', 'iki-nokta', 'kesme'],
    [
      'Otobüs 17:20’de kalkacak, sakın geç kalma.',
      'Otobüs 17.20’de kalkacak, sakın geç kalma.',
      'iki-nokta',
      'virgul',
    ],
    [
      'Film 21:15’te başlıyor, hazır mısın?',
      'Film 21.15’te başlıyor, hazır mısın?',
      'iki-nokta',
      'soru',
    ],
    [
      'Ankara-İzmir uçağı 06:45’te kalkıyor.',
      'Ankara-İzmir uçağı 06.45’te kalkıyor.',
      'iki-nokta',
      'kisa-cizgi',
    ],
    [
      'Maç 19:00’da başlayacak; stat şimdiden doldu.',
      'Maç 19.00’da başlayacak; stat şimdiden doldu.',
      'iki-nokta',
      'noktali-virgul',
    ],
    [
      'Öğretmen “Sınav 10:30’da bitecek.” dedi.',
      'Öğretmen “Sınav 10.30’da bitecek.” dedi.',
      'iki-nokta',
      'tirnak',
    ],
    [
      'Servis her sabah 06:50’de kapının önünde oluyor.',
      'Servis her sabah 06.50’de kapının önünde oluyor.',
      'iki-nokta',
      'kesme',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Açıklama ve örnek öncesinde iki nokta
  // -------------------------------------------------------------------------
  ...grup('iki-nokta-aciklama', 'orta', [
    [
      'Çantamda üç şey vardı; kalem, silgi, defter.',
      'Çantamda üç şey vardı: kalem, silgi, defter.',
      'noktali-virgul',
      'virgul',
    ],
    [
      'Şunu unutma, düzenli tekrar her şeyi değiştirir.',
      'Şunu unutma: düzenli tekrar her şeyi değiştirir.',
      'virgul',
      'nokta',
    ],
    [
      'Sınavın iki bölümü var; TYT ve AYT.',
      'Sınavın iki bölümü var: TYT ve AYT.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Kararımı verdim, bu yıl sayısal bölümü seçiyorum.',
      'Kararımı verdim: bu yıl sayısal bölümü seçiyorum.',
      'virgul',
      'nokta',
    ],
    [
      'Ahmet’in tek isteği şuydu; herkesin onu dinlemesi.',
      'Ahmet’in tek isteği şuydu: herkesin onu dinlemesi.',
      'noktali-virgul',
      'kesme',
    ],
    [
      'Öğretmen sordu; “Bu kuralı kim açıklayabilir?”',
      'Öğretmen sordu: “Bu kuralı kim açıklayabilir?”',
      'noktali-virgul',
      'tirnak',
    ],
    [
      'Aklımda tek bir soru vardı; bu konu sınavda çıkar mı?',
      'Aklımda tek bir soru vardı: bu konu sınavda çıkar mı?',
      'noktali-virgul',
      'soru',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Eser ve yazı adları tırnak içinde
  // -------------------------------------------------------------------------
  ...grup('tirnak-eser-adi', 'orta', [
    [
      'Yahya Kemal’in (Sessiz Gemi) şiirini ezberledik.',
      'Yahya Kemal’in “Sessiz Gemi” şiirini ezberledik.',
      'parantez',
      'kesme',
    ],
    [
      'Bu hafta (Çalıkuşu) romanını bitirdim.',
      'Bu hafta “Çalıkuşu” romanını bitirdim.',
      'parantez',
      'nokta',
    ],
    [
      'Öğretmen (Han Duvarları) şiirini okudu, sınıf sessizce dinledi.',
      'Öğretmen “Han Duvarları” şiirini okudu, sınıf sessizce dinledi.',
      'parantez',
      'virgul',
    ],
    [
      'Sen (Kürk Mantolu Madonna) romanını okudun mu?',
      'Sen “Kürk Mantolu Madonna” romanını okudun mu?',
      'parantez',
      'soru',
    ],
    [
      'Kitabın (Giriş) bölümünü iki kez okudum; yine de anlamadım.',
      'Kitabın “Giriş” bölümünü iki kez okudum; yine de anlamadım.',
      'parantez',
      'noktali-virgul',
    ],
    [
      'Bu akşam (Beyaz Diş) romanını bitireceğim!',
      'Bu akşam “Beyaz Diş” romanını bitireceğim!',
      'parantez',
      'unlem',
    ],
    [
      'Safahat’ın (Küfe) bölümünü ezberledim.',
      'Safahat’ın “Küfe” bölümünü ezberledim.',
      'parantez',
      'kesme',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Cümlenin dışında kalan ek bilgi parantez içinde
  // -------------------------------------------------------------------------
  ...grup('parantez-ek-bilgi', 'orta', [
    [
      'Türk Dil Kurumu “TDK” yeni bir kılavuz yayımladı.',
      'Türk Dil Kurumu (TDK) yeni bir kılavuz yayımladı.',
      'tirnak',
      'nokta',
    ],
    [
      'Anadolu Ajansı “AA”, haberi akşam saatlerinde doğruladı.',
      'Anadolu Ajansı (AA), haberi akşam saatlerinde doğruladı.',
      'tirnak',
      'virgul',
    ],
    [
      'Necip Fazıl Kısakürek “1904-1983” bu şiiri gençken yazmış.',
      'Necip Fazıl Kısakürek (1904-1983) bu şiiri gençken yazmış.',
      'tirnak',
      'kisa-cizgi',
    ],
    [
      'Sınavı Millî Eğitim Bakanlığı “MEB” mi düzenliyor?',
      'Sınavı Millî Eğitim Bakanlığı (MEB) mi düzenliyor?',
      'tirnak',
      'soru',
    ],
    [
      'Bu kitabı Halide Edip Adıvar “Ateşten Gömlek’in yazarı” kaleme almış.',
      'Bu kitabı Halide Edip Adıvar (Ateşten Gömlek’in yazarı) kaleme almış.',
      'tirnak',
      'kesme',
    ],
    [
      'Kardeşim “on iki yaşında” bu yıl ortaokulu bitiriyor; ben de liseyi.',
      'Kardeşim (on iki yaşında) bu yıl ortaokulu bitiriyor; ben de liseyi.',
      'tirnak',
      'noktali-virgul',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Soru anlamı olmayan cümlede soru işareti
  // -------------------------------------------------------------------------
  ...grup('soru-anlami', 'zor', [
    [
      'Ahmet’in neden geç kaldığını sormadım?',
      'Ahmet’in neden geç kaldığını sormadım.',
      'soru',
      'kesme',
    ],
    [
      'Hangi kitabı okuyacağıma karar veremedim, listeyi de kaybettim?',
      'Hangi kitabı okuyacağıma karar veremedim, listeyi de kaybettim.',
      'soru',
      'virgul',
    ],
    [
      'Nereye gittiğini kimseye söylememiş; annesi bile bilmiyor?',
      'Nereye gittiğini kimseye söylememiş; annesi bile bilmiyor.',
      'soru',
      'noktali-virgul',
    ],
    [
      'Öğretmen, sınavın ne zaman olacağını “Haftaya.” diye yanıtladı?',
      'Öğretmen, sınavın ne zaman olacağını “Haftaya.” diye yanıtladı.',
      'soru',
      'tirnak',
    ],
    [
      'Ölçme, Seçme ve Yerleştirme Merkezi (ÖSYM) kaç adayın başvurduğunu açıklamadı?',
      'Ölçme, Seçme ve Yerleştirme Merkezi (ÖSYM) kaç adayın başvurduğunu açıklamadı.',
      'soru',
      'parantez',
    ],
    [
      'Ne yaptığını, ne söylediğini, kime gittiğini… hiçbirini bilmiyorum?',
      'Ne yaptığını, ne söylediğini, kime gittiğini… hiçbirini bilmiyorum.',
      'soru',
      'uc-nokta',
    ],
    [
      'İstanbul-Ankara arasının kaç saat sürdüğünü unutmuşum?',
      'İstanbul-Ankara arasının kaç saat sürdüğünü unutmuşum.',
      'soru',
      'kisa-cizgi',
    ],
    [
      'Neyi kaçırdığımı sonradan anladım; artık geri dönüş yoktu?',
      'Neyi kaçırdığımı sonradan anladım; artık geri dönüş yoktu.',
      'soru',
      'noktali-virgul',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Yapım eki kesmeyle ayrılmaz
  // -------------------------------------------------------------------------
  ...grup('kesme-yapim-eki', 'zor', [
    ['Konya’lı öğrenciler geziye katıldı.', 'Konyalı öğrenciler geziye katıldı.', 'kesme', 'nokta'],
    ['Almanca’dan Türkçeye çeviri yaptı.', 'Almancadan Türkçeye çeviri yaptı.', 'kesme', 'nokta'],
    [
      'Bu sözcük Farsça’dan dilimize geçmiş, çok eskiden.',
      'Bu sözcük Farsçadan dilimize geçmiş, çok eskiden.',
      'kesme',
      'virgul',
    ],
    [
      'İzmir’li arkadaşım sınavı kazandı; hepimiz sevindik.',
      'İzmirli arkadaşım sınavı kazandı; hepimiz sevindik.',
      'kesme',
      'noktali-virgul',
    ],
    ['Sen de mi Bursa’lısın?', 'Sen de mi Bursalısın?', 'kesme', 'soru'],
    [
      'Karadeniz’li olduğunu şivesinden hemen anladım!',
      'Karadenizli olduğunu şivesinden hemen anladım!',
      'kesme',
      'unlem',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Çokluk eki kesmeyle ayrılmaz
  // -------------------------------------------------------------------------
  ...grup('kesme-cokluk', 'zor', [
    ['Bu akşam Ayşe’lere gideceğiz.', 'Bu akşam Ayşelere gideceğiz.', 'kesme', 'nokta'],
    [
      'Ahmet’ler yeni bir ev almış; taşınma haftaya.',
      'Ahmetler yeni bir ev almış; taşınma haftaya.',
      'kesme',
      'noktali-virgul',
    ],
    ['Yarın Mehmet’lerde toplanalım mı?', 'Yarın Mehmetlerde toplanalım mı?', 'kesme', 'soru'],
    [
      'Çantamı Zeynep’lerde unutmuşum, sabah alırım.',
      'Çantamı Zeyneplerde unutmuşum, sabah alırım.',
      'kesme',
      'virgul',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Kurum ve kuruluş adlarına gelen ekler kesmeyle ayrılmaz
  // -------------------------------------------------------------------------
  ...grup('kesme-kurum', 'zor', [
    [
      'Türk Dil Kurumu’nun sözlüğünü kullanıyorum.',
      'Türk Dil Kurumunun sözlüğünü kullanıyorum.',
      'kesme',
      'nokta',
    ],
    [
      'Millî Eğitim Bakanlığı’na dilekçe verdim, cevap bekliyorum.',
      'Millî Eğitim Bakanlığına dilekçe verdim, cevap bekliyorum.',
      'kesme',
      'virgul',
    ],
    [
      'Türkiye Büyük Millet Meclisi’nde bu yasa görüşüldü mü?',
      'Türkiye Büyük Millet Meclisinde bu yasa görüşüldü mü?',
      'kesme',
      'soru',
    ],
    [
      'Ankara Üniversitesi’ni kazandı; ailesi çok sevindi.',
      'Ankara Üniversitesini kazandı; ailesi çok sevindi.',
      'kesme',
      'noktali-virgul',
    ],
    [
      'Öğretmen “Yazıyı Türk Dil Kurumu’na gönderin.” dedi.',
      'Öğretmen “Yazıyı Türk Dil Kurumuna gönderin.” dedi.',
      'kesme',
      'tirnak',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Virgülle ayrılmış türleri ayırmak için noktalı virgül
  // -------------------------------------------------------------------------
  ...grup('noktali-virgul-tur', 'zor', [
    [
      'Sözel derslerde Türkçe, tarih, coğrafya: sayısal derslerde matematik, fizik, kimya var.',
      'Sözel derslerde Türkçe, tarih, coğrafya; sayısal derslerde matematik, fizik, kimya var.',
      'iki-nokta',
      'virgul',
    ],
    [
      'Odada masa, sandalye, dolap… salonda koltuk, sehpa vardı.',
      'Odada masa, sandalye, dolap; salonda koltuk, sehpa vardı.',
      'uc-nokta',
      'virgul',
    ],
    [
      'Yazın deniz, güneş, tatil - kışın kar, soğuk, okul akla gelir.',
      'Yazın deniz, güneş, tatil; kışın kar, soğuk, okul akla gelir.',
      'kisa-cizgi',
      'virgul',
    ],
    [
      'Meyvelerden elma, armut, kiraz: sebzelerden domates, biber aldım.',
      'Meyvelerden elma, armut, kiraz; sebzelerden domates, biber aldım.',
      'iki-nokta',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Tamamlanmamış cümlenin sonunda üç nokta
  // -------------------------------------------------------------------------
  ...grup('uc-nokta-eksiltme', 'zor', [
    [
      'Ne yapsam, nereye gitsem, kime sorsam.',
      'Ne yapsam, nereye gitsem, kime sorsam…',
      'nokta',
      'virgul',
    ],
    [
      'Bir varmış, bir yokmuş; evvel zaman içinde.',
      'Bir varmış, bir yokmuş; evvel zaman içinde…',
      'nokta',
      'noktali-virgul',
    ],
    [
      'Sait Faik’in anlattığı o eski İstanbul.',
      'Sait Faik’in anlattığı o eski İstanbul…',
      'nokta',
      'kesme',
    ],
  ]),
  // -------------------------------------------------------------------------
  // “ve, veya, yahut, ile” bağlacının iki yanına virgül konmaz
  // Kural tek satır ama hata çok yaygın: konuşurken bağlaçtan önce duraklıyoruz,
  // o duraklamayı yazıya virgül olarak geçiriyoruz. Bu yüzden havuzun en kalabalık
  // grubu burası.
  // -------------------------------------------------------------------------
  ...grup('ve-virgul', 'kolay', [
    [
      'Kapıyı kilitledi, ve merdivenlerden hızla indi.',
      'Kapıyı kilitledi ve merdivenlerden hızla indi.',
      'virgul',
      'nokta',
    ],
    [
      'Rüzgâr dindi, ve deniz yeniden sakinleşti.',
      'Rüzgâr dindi ve deniz yeniden sakinleşti.',
      'virgul',
      'nokta',
    ],
    [
      'Kalem, ve defter almak için kırtasiyeye uğradım.',
      'Kalem ve defter almak için kırtasiyeye uğradım.',
      'virgul',
      'nokta',
    ],
    [
      'Bu konuyu bugün, veya yarın tekrar edeceğim.',
      'Bu konuyu bugün veya yarın tekrar edeceğim.',
      'virgul',
      'nokta',
    ],
    [
      'Ağabeyim ile, ablam aynı üniversiteye gitti.',
      'Ağabeyim ile ablam aynı üniversiteye gitti.',
      'virgul',
      'nokta',
    ],
    [
      'Tahtayı sildi, ve yeni konuya geçti.',
      'Tahtayı sildi ve yeni konuya geçti.',
      'virgul',
      'nokta',
    ],
    // Çeldirici kesme: “Zeynep’in” özel ada gelen çekim eki, doğru kullanım.
    [
      'Zeynep’in çantası, ve montu koridorda kalmış.',
      'Zeynep’in çantası ve montu koridorda kalmış.',
      'virgul',
      'kesme',
    ],
    [
      'Sınava iki gün kaldı, ve hâlâ tekrar bitmedi!',
      'Sınava iki gün kaldı ve hâlâ tekrar bitmedi!',
      'virgul',
      'unlem',
    ],
    // Çeldirici noktalı virgül: bağımsız iki cümleyi ayırıyor, yeri doğru.
    [
      'Notlarını topladı, ve kütüphaneden çıktı; kimseye görünmedi.',
      'Notlarını topladı ve kütüphaneden çıktı; kimseye görünmedi.',
      'virgul',
      'noktali-virgul',
    ],
    [
      'Yarın sabah erken kalkacağım, ve ilk otobüse bineceğim.',
      'Yarın sabah erken kalkacağım ve ilk otobüse bineceğim.',
      'virgul',
      'nokta',
    ],
    [
      'Ödevini bitirdi, ve televizyonun karşısına geçti.',
      'Ödevini bitirdi ve televizyonun karşısına geçti.',
      'virgul',
      'nokta',
    ],
    [
      'Matematikte pratik, ve düzenli tekrar şart!',
      'Matematikte pratik ve düzenli tekrar şart!',
      'virgul',
      'unlem',
    ],
    // Çeldirici tırnak: aktarılan söz tırnak içinde, noktası da tırnağın içinde.
    [
      'Kapıyı çaldı, ve içeriden “Buyurun.” sesi geldi.',
      'Kapıyı çaldı ve içeriden “Buyurun.” sesi geldi.',
      'virgul',
      'tirnak',
    ],
    // Çeldirici parantez: cümlenin dışında kalan ek bilgi, doğru kullanım.
    [
      'Sonuçlar bugün açıklandı, ve tercih dönemi (10-20 Ağustos) başladı.',
      'Sonuçlar bugün açıklandı ve tercih dönemi (10-20 Ağustos) başladı.',
      'virgul',
      'parantez',
    ],
    [
      'Işıkları söndürdü, ve odadan sessizce çıktı.',
      'Işıkları söndürdü ve odadan sessizce çıktı.',
      'virgul',
      'nokta',
    ],
    [
      'Ders bitti, ve herkes koridora doğru yürüdü.',
      'Ders bitti ve herkes koridora doğru yürüdü.',
      'virgul',
      'nokta',
    ],
    [
      'Tuz, veya karabiber isteyen var mı?',
      'Tuz veya karabiber isteyen var mı?',
      'virgul',
      'soru',
    ],
    [
      'Dedem ile, ninem hâlâ köyde yaşıyor.',
      'Dedem ile ninem hâlâ köyde yaşıyor.',
      'virgul',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Soru cümlesinin sonuna nokta değil soru işareti
  // Bu grupta yanlış işaret hep nokta olduğu için cümlede başka nokta bulunamaz;
  // çeldirici de bu yüzden virgül, kesme, tırnak gibi ikinci bir işaretten seçildi.
  // -------------------------------------------------------------------------
  ...grup('soru-cumlesi', 'kolay', [
    [
      'Zeynep’in telefon numarasını biliyor musun.',
      'Zeynep’in telefon numarasını biliyor musun?',
      'nokta',
      'kesme',
    ],
    [
      'Bu akşam sinemaya mı, tiyatroya mı gideceğiz.',
      'Bu akşam sinemaya mı, tiyatroya mı gideceğiz?',
      'nokta',
      'virgul',
    ],
    ['Sabah kaçta kalktın, Zeynep.', 'Sabah kaçta kalktın, Zeynep?', 'nokta', 'virgul'],
    [
      'Deneme kitabını nereye koydun, hatırlıyor musun.',
      'Deneme kitabını nereye koydun, hatırlıyor musun?',
      'nokta',
      'virgul',
    ],
    ['Mehmet’in adresini kim biliyor.', 'Mehmet’in adresini kim biliyor?', 'nokta', 'kesme'],
    [
      'Sınav salonuna kaçta girmemiz gerekiyor, öğretmenim.',
      'Sınav salonuna kaçta girmemiz gerekiyor, öğretmenim?',
      'nokta',
      'virgul',
    ],
    [
      'Bu şiiri kim yazmış, biliyor musunuz.',
      'Bu şiiri kim yazmış, biliyor musunuz?',
      'nokta',
      'virgul',
    ],
    ['Bu kalem Elif’in mi.', 'Bu kalem Elif’in mi?', 'nokta', 'kesme'],
    [
      'Kitabı bitirdin mi, yoksa yarıda mı bıraktın.',
      'Kitabı bitirdin mi, yoksa yarıda mı bıraktın?',
      'nokta',
      'virgul',
    ],
    [
      'Yağmur yağarsa maça gidecek miyiz, baba.',
      'Yağmur yağarsa maça gidecek miyiz, baba?',
      'nokta',
      'virgul',
    ],
    [
      'Ben yapamadım; sen bu soruyu çözebildin mi.',
      'Ben yapamadım; sen bu soruyu çözebildin mi?',
      'nokta',
      'noktali-virgul',
    ],
    [
      'Peki, bu konuyu ne zaman tekrar edeceğiz.',
      'Peki, bu konuyu ne zaman tekrar edeceğiz?',
      'nokta',
      'virgul',
    ],
    ['İzmir-Manisa yolu hâlâ kapalı mı.', 'İzmir-Manisa yolu hâlâ kapalı mı?', 'nokta', 'kisa-cizgi'],
    [
      'Temel Yeterlilik Testi (TYT) kaç soruluk.',
      'Temel Yeterlilik Testi (TYT) kaç soruluk?',
      'nokta',
      'parantez',
    ],
    [
      'O eski günler, o sokaklar… hatırlıyor musun.',
      'O eski günler, o sokaklar… hatırlıyor musun?',
      'nokta',
      'uc-nokta',
    ],
    [
      'Bu şarkının adı “Bir Başkadır Benim Memleketim” mi.',
      'Bu şarkının adı “Bir Başkadır Benim Memleketim” mi?',
      'nokta',
      'tirnak',
    ],
    [
      'Bugün kütüphaneye uğrayacak mısın, Elif.',
      'Bugün kütüphaneye uğrayacak mısın, Elif?',
      'nokta',
      'virgul',
    ],
    [
      'Neden bu kadar geç kaldın, açıklayabilir misin.',
      'Neden bu kadar geç kaldın, açıklayabilir misin?',
      'nokta',
      'virgul',
    ],
  ]),
  // -------------------------------------------------------------------------
  // Hitap ve seslenme sözünden sonra virgül
  // Buradaki yanlış hep noktalı virgül ya da iki nokta: ikisi de “duraklama”
  // hissi verdiği için hitaptan sonra sık sık virgülün yerine geçiriliyor.
  // Düzeltme cümleye bir virgül eklediği için çeldirici asla virgül seçilmedi.
  // -------------------------------------------------------------------------
  ...grup('hitap-virgul', 'kolay', [
    ['Anneciğim; çantamı bulamıyorum.', 'Anneciğim, çantamı bulamıyorum.', 'noktali-virgul', 'nokta'],
    [
      'Değerli konuklar: programımıza hoş geldiniz.',
      'Değerli konuklar, programımıza hoş geldiniz.',
      'iki-nokta',
      'nokta',
    ],
    ['Beyler; sıraya geçin lütfen!', 'Beyler, sıraya geçin lütfen!', 'noktali-virgul', 'unlem'],
    [
      'Kardeşim: bu soruyu bana açıklar mısın?',
      'Kardeşim, bu soruyu bana açıklar mısın?',
      'iki-nokta',
      'soru',
    ],
    [
      'Zeynep; Ahmet’in defterini geri ver.',
      'Zeynep, Ahmet’in defterini geri ver.',
      'noktali-virgul',
      'kesme',
    ],
    // Çeldirici kesme: “15.40’ta” — saatten sonraki ek kesmeyle ayrılır.
    [
      'Sayın yolcular: trenimiz 15.40’ta kalkacaktır.',
      'Sayın yolcular, trenimiz 15.40’ta kalkacaktır.',
      'iki-nokta',
      'kesme',
    ],
    [
      'Ey yolcu; bu yollar seni nereye götürür?',
      'Ey yolcu, bu yollar seni nereye götürür?',
      'noktali-virgul',
      'soru',
    ],
    [
      'Çocuklar; bugün “Kırmızı Başlıklı Kız” masalını okuyacağız.',
      'Çocuklar, bugün “Kırmızı Başlıklı Kız” masalını okuyacağız.',
      'noktali-virgul',
      'tirnak',
    ],
    [
      'Sevgili günlük: bugün çok yorucu bir gün geçirdim.',
      'Sevgili günlük, bugün çok yorucu bir gün geçirdim.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Arkadaşlar: sınav yerlerimiz (salon numaraları) belli oldu.',
      'Arkadaşlar, sınav yerlerimiz (salon numaraları) belli oldu.',
      'iki-nokta',
      'parantez',
    ],
    [
      'Sevgili öğrenciler; hepinize başarılar dilerim!',
      'Sevgili öğrenciler, hepinize başarılar dilerim!',
      'noktali-virgul',
      'unlem',
    ],
    [
      'Efendim: sizi rahatsız ettiysem özür dilerim.',
      'Efendim, sizi rahatsız ettiysem özür dilerim.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Dostum; İstanbul-Ankara yolu bu saatte çok kalabalık.',
      'Dostum, İstanbul-Ankara yolu bu saatte çok kalabalık.',
      'noktali-virgul',
      'kisa-cizgi',
    ],
    ['Ahmet: ne yaptığını bir düşün…', 'Ahmet, ne yaptığını bir düşün…', 'iki-nokta', 'uc-nokta'],
    [
      'Aziz milletim: bu topraklar hepimize emanet.',
      'Aziz milletim, bu topraklar hepimize emanet.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Öğretmenim; Elif’in raporunu masanıza bıraktım.',
      'Öğretmenim, Elif’in raporunu masanıza bıraktım.',
      'noktali-virgul',
      'kesme',
    ],
    [
      'Komşum; kapının önündeki kutu senin mi?',
      'Komşum, kapının önündeki kutu senin mi?',
      'noktali-virgul',
      'soru',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Duygu bildiren cümlenin sonuna ünlem
  // Yanlış işaret hep nokta olduğundan cümlede tek bir nokta bulunabiliyor;
  // ikinci işaret (virgül, kesme, tırnak…) hem çeldirici hem de cümleyi
  // “tek işaretli” olmaktan kurtaran unsur.
  // -------------------------------------------------------------------------
  ...grup('unlem-duygu', 'kolay', [
    ['Yaşasın, sınavı kazandım.', 'Yaşasın, sınavı kazandım!', 'nokta', 'virgul'],
    ['Hey, oradaki çantaya dikkat et.', 'Hey, oradaki çantaya dikkat et!', 'nokta', 'virgul'],
    ['Vah vah, ne kadar üzücü bir haber.', 'Vah vah, ne kadar üzücü bir haber!', 'nokta', 'virgul'],
    [
      'Ne güzel bir manzara, insanın içi açılıyor.',
      'Ne güzel bir manzara, insanın içi açılıyor!',
      'nokta',
      'virgul',
    ],
    ['Hey gidi günler, ne çabuk geçtiniz.', 'Hey gidi günler, ne çabuk geçtiniz!', 'nokta', 'virgul'],
    [
      'Ne yazık, tren tam gözümüzün önünde kalktı.',
      'Ne yazık, tren tam gözümüzün önünde kalktı!',
      'nokta',
      'virgul',
    ],
    ['Oh be, sonunda bu konuyu bitirdim.', 'Oh be, sonunda bu konuyu bitirdim!', 'nokta', 'virgul'],
    ['Hoş geldiniz, sizi görmek ne güzel.', 'Hoş geldiniz, sizi görmek ne güzel!', 'nokta', 'virgul'],
    ['Yandım, çay çok sıcakmış.', 'Yandım, çay çok sıcakmış!', 'nokta', 'virgul'],
    [
      'Ne kadar sevindim; sonunda başardın.',
      'Ne kadar sevindim; sonunda başardın!',
      'nokta',
      'noktali-virgul',
    ],
    ['Şuraya bak, kar yağıyor.', 'Şuraya bak, kar yağıyor!', 'nokta', 'virgul'],
    [
      'Of, bu gürültü… artık dayanamıyorum.',
      'Of, bu gürültü… artık dayanamıyorum!',
      'nokta',
      'uc-nokta',
    ],
    [
      'Bravo Zeynep, bütün soruları çözmüşsün.',
      'Bravo Zeynep, bütün soruları çözmüşsün!',
      'nokta',
      'virgul',
    ],
    [
      'Eyvahlar olsun; kitabı serviste unutmuşum.',
      'Eyvahlar olsun; kitabı serviste unutmuşum!',
      'nokta',
      'noktali-virgul',
    ],
    [
      'Ne yaptın sen, Mehmet’in bütün emeği boşa gitti.',
      'Ne yaptın sen, Mehmet’in bütün emeği boşa gitti!',
      'nokta',
      'kesme',
    ],
    [
      'Nihayet “Suç ve Ceza” romanını bitirdim.',
      'Nihayet “Suç ve Ceza” romanını bitirdim!',
      'nokta',
      'tirnak',
    ],
    [
      'Müjde, tatil (tam üç hafta) başlıyor.',
      'Müjde, tatil (tam üç hafta) başlıyor!',
      'nokta',
      'parantez',
    ],
  ]),
  // -------------------------------------------------------------------------
  // Eş görevli kelimeler arasında virgül
  // Düzeltme cümleye virgül eklediği için çeldirici hiçbir zaman virgül olamaz;
  // ikinci işaret hep nokta, ünlem, tırnak gibi cümleye dokunulmayan bir işaret.
  // -------------------------------------------------------------------------
  ...grup('sirali-virgul', 'orta', [
    [
      'Dolapta gömlek; pantolon ve kazak asılıydı.',
      'Dolapta gömlek, pantolon ve kazak asılıydı.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Sınıfta tahta: sıra ve dolap yenilendi.',
      'Sınıfta tahta, sıra ve dolap yenilendi.',
      'iki-nokta',
      'nokta',
    ],
    [
      'Çocuk uzun; sarışın ve çok neşeliydi.',
      'Çocuk uzun, sarışın ve çok neşeliydi.',
      'noktali-virgul',
      'nokta',
    ],
    // Çeldirici noktalı virgül: bağımsız iki cümleyi ayırıyor, yeri doğru.
    [
      'Kahvaltıda zeytin: peynir ve reçel vardı; çay demlenmemişti.',
      'Kahvaltıda zeytin, peynir ve reçel vardı; çay demlenmemişti.',
      'iki-nokta',
      'noktali-virgul',
    ],
    [
      'Bu kitap sade; akıcı ve öğretici bir dille yazılmış.',
      'Bu kitap sade, akıcı ve öğretici bir dille yazılmış.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Ahmet’in listesinde kalem: silgi ve cetvel yazıyordu.',
      'Ahmet’in listesinde kalem, silgi ve cetvel yazıyordu.',
      'iki-nokta',
      'kesme',
    ],
    [
      'Ne kadar sabırlı; ne kadar çalışkan bir öğrenci!',
      'Ne kadar sabırlı, ne kadar çalışkan bir öğrenci!',
      'noktali-virgul',
      'unlem',
    ],
    [
      'Ankara-Konya yolunda kar; buz ve sis vardı.',
      'Ankara-Konya yolunda kar, buz ve sis vardı.',
      'noktali-virgul',
      'kisa-cizgi',
    ],
    [
      'Bavuluna tişört: şort ve mayo koydu mu?',
      'Bavuluna tişört, şort ve mayo koydu mu?',
      'iki-nokta',
      'soru',
    ],
    // Eser adları zaten tırnak içinde; sıralamayı ayıran işaret yine virgül olmalı.
    [
      'Rafta “Sefiller”; “Anna Karenina” ve “Beyaz Gemi” yan yanaydı.',
      'Rafta “Sefiller”, “Anna Karenina” ve “Beyaz Gemi” yan yanaydı.',
      'noktali-virgul',
      'tirnak',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Saat ile dakikayı nokta ayırır
  // Dijital saatlerin “:” alışkanlığı yazıya taşınıyor. Düzeltme cümleye bir
  // nokta eklediği için bu grupta çeldirici asla nokta olamaz.
  // -------------------------------------------------------------------------
  ...grup('saat-nokta', 'orta', [
    ['Uçağımız 07:10’da havalanacak.', 'Uçağımız 07.10’da havalanacak.', 'iki-nokta', 'kesme'],
    [
      'Dersler 13:25’te başlıyor, sakın geç kalma.',
      'Dersler 13.25’te başlıyor, sakın geç kalma.',
      'iki-nokta',
      'virgul',
    ],
    ['Kütüphane 18:40’ta kapanıyor mu?', 'Kütüphane 18.40’ta kapanıyor mu?', 'iki-nokta', 'soru'],
    [
      'Son otobüs 22:05’te kalkıyor; kaçırırsak yürürüz.',
      'Son otobüs 22.05’te kalkıyor; kaçırırsak yürürüz.',
      'iki-nokta',
      'noktali-virgul',
    ],
    [
      'İzmir-Denizli treni 11:35’te hareket edecek.',
      'İzmir-Denizli treni 11.35’te hareket edecek.',
      'iki-nokta',
      'kisa-cizgi',
    ],
    [
      'Sunum 14:50’de başlıyor (salon B).',
      'Sunum 14.50’de başlıyor (salon B).',
      'iki-nokta',
      'parantez',
    ],
    [
      'Görevli “Kapılar 16:20’de açılacak.” diye duyurdu.',
      'Görevli “Kapılar 16.20’de açılacak.” diye duyurdu.',
      'iki-nokta',
      'tirnak',
    ],
    ['Nihayet 23:15’te eve vardık!', 'Nihayet 23.15’te eve vardık!', 'iki-nokta', 'unlem'],
  ]),

  // -------------------------------------------------------------------------
  // Açıklama ve örnek öncesinde iki nokta
  // Yanlış işaret ya noktalı virgül ya virgül; ikisi de “burada duraklıyorum”
  // sezgisiyle konuyor, oysa arkadan gelen kısım açıklama olduğu için iki nokta
  // gerekiyor. Düzeltme iki nokta eklediğinden çeldirici asla iki nokta değil.
  // -------------------------------------------------------------------------
  ...grup('iki-nokta-aciklama', 'orta', [
    [
      'Dolapta iki renk vardı; mavi ve yeşil.',
      'Dolapta iki renk vardı: mavi ve yeşil.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Sana bir şey söyleyeceğim, bu iş sandığın kadar kolay değil.',
      'Sana bir şey söyleyeceğim: bu iş sandığın kadar kolay değil.',
      'virgul',
      'nokta',
    ],
    [
      'Yapman gerekenler şunlar; erken kalk, plan yap, ara ver.',
      'Yapman gerekenler şunlar: erken kalk, plan yap, ara ver.',
      'noktali-virgul',
      'virgul',
    ],
    [
      'Sonuç ortada; emek veren kazanıyor.',
      'Sonuç ortada: emek veren kazanıyor.',
      'noktali-virgul',
      'nokta',
    ],
    // Aktarılan söz tırnak içinde; öncesindeki işaret iki nokta olmalı.
    ['Annem seslendi, “Sofraya gel!”', 'Annem seslendi: “Sofraya gel!”', 'virgul', 'tirnak'],
    [
      'Öğretmenin tek şartı vardı; defterler eksiksiz olacak.',
      'Öğretmenin tek şartı vardı: defterler eksiksiz olacak.',
      'noktali-virgul',
      'nokta',
    ],
    [
      'Elif’in aklında tek bir düşünce vardı; bir an önce eve dönmek.',
      'Elif’in aklında tek bir düşünce vardı: bir an önce eve dönmek.',
      'noktali-virgul',
      'kesme',
    ],
    [
      'Şunu hiç unutma, sabır her kapıyı açar!',
      'Şunu hiç unutma: sabır her kapıyı açar!',
      'virgul',
      'unlem',
    ],
    [
      'Herkesin merak ettiği soru şuydu; tercihler ne zaman başlayacak?',
      'Herkesin merak ettiği soru şuydu: tercihler ne zaman başlayacak?',
      'noktali-virgul',
      'soru',
    ],
    [
      'Sınavda iki oturum var; sabah (TYT) ve öğleden sonra (AYT).',
      'Sınavda iki oturum var: sabah (TYT) ve öğleden sonra (AYT).',
      'noktali-virgul',
      'parantez',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Eser, yazı ve bölüm adları tırnak içinde
  // Yanlış kullanım yay ayraç: ek bilgi ile eser adı karıştırılıyor. Düzeltme
  // tırnak eklediği için çeldirici tırnak olamaz.
  // -------------------------------------------------------------------------
  ...grup('tirnak-eser-adi', 'orta', [
    [
      'Bu yaz (Tutunamayanlar) romanını okumayı planlıyorum.',
      'Bu yaz “Tutunamayanlar” romanını okumayı planlıyorum.',
      'parantez',
      'nokta',
    ],
    [
      'Nâzım Hikmet’in (Memleketimden İnsan Manzaraları) adlı eserini duydun mu?',
      'Nâzım Hikmet’in “Memleketimden İnsan Manzaraları” adlı eserini duydun mu?',
      'parantez',
      'kesme',
    ],
    [
      'Derste (Sinekli Bakkal) romanını inceledik, hepimiz çok beğendik.',
      'Derste “Sinekli Bakkal” romanını inceledik, hepimiz çok beğendik.',
      'parantez',
      'virgul',
    ],
    [
      'Ders kitabının (Ses Bilgisi) ünitesini bitirdik; sıra biçim bilgisinde.',
      'Ders kitabının “Ses Bilgisi” ünitesini bitirdik; sıra biçim bilgisinde.',
      'parantez',
      'noktali-virgul',
    ],
    [
      'Ödevimde (Kaldırımlar) şiirini incelemişim!',
      'Ödevimde “Kaldırımlar” şiirini incelemişim!',
      'parantez',
      'unlem',
    ],
    [
      'Ansiklopedinin (Kaynakça) bölümüne baktın mı?',
      'Ansiklopedinin “Kaynakça” bölümüne baktın mı?',
      'parantez',
      'soru',
    ],
    [
      'Sait Faik’in (Semaver) öyküsünü sınıfta hep birlikte okuduk.',
      'Sait Faik’in “Semaver” öyküsünü sınıfta hep birlikte okuduk.',
      'parantez',
      'kesme',
    ],
    [
      'Gazetenin (Kültür-Sanat) sayfasında bu yazı çıkmış.',
      'Gazetenin “Kültür-Sanat” sayfasında bu yazı çıkmış.',
      'parantez',
      'kisa-cizgi',
    ],
  ]),
  // -------------------------------------------------------------------------
  // Cümlenin dışında kalan ek bilgi yay ayraç içinde
  // Yanlış kullanım tırnak: tırnak “aktarılan söz / eser adı” demek, ek bilgi
  // demek değil. Düzeltme parantez eklediği için çeldirici parantez olamaz.
  // -------------------------------------------------------------------------
  ...grup('parantez-ek-bilgi', 'orta', [
    [
      'Dün akşam Zeynep “sınıf birincisi” bize uğradı.',
      'Dün akşam Zeynep (sınıf birincisi) bize uğradı.',
      'tirnak',
      'nokta',
    ],
    [
      'Türkiye Radyo ve Televizyon Kurumu “TRT”, yeni diziyi akşam duyurdu.',
      'Türkiye Radyo ve Televizyon Kurumu (TRT), yeni diziyi akşam duyurdu.',
      'tirnak',
      'virgul',
    ],
    [
      'Bu yol “İzmir-Aydın hattı” geçen yıl baştan sona yenilenmiş.',
      'Bu yol (İzmir-Aydın hattı) geçen yıl baştan sona yenilenmiş.',
      'tirnak',
      'kisa-cizgi',
    ],
    [
      'Bu ilacı günde iki kez “sabah ve akşam” içmelisin!',
      'Bu ilacı günde iki kez (sabah ve akşam) içmelisin!',
      'tirnak',
      'unlem',
    ],
    [
      'Sınav ücretini “yüz elli lira” yatırdın mı?',
      'Sınav ücretini (yüz elli lira) yatırdın mı?',
      'tirnak',
      'soru',
    ],
    [
      'Ödevi Ahmet’in ablası “üniversite öğrencisi” yapmış.',
      'Ödevi Ahmet’in ablası (üniversite öğrencisi) yapmış.',
      'tirnak',
      'kesme',
    ],
    [
      'Ödevi iki günde “tam on iki saatte” bitirdim; kendime şaşırdım.',
      'Ödevi iki günde (tam on iki saatte) bitirdim; kendime şaşırdım.',
      'tirnak',
      'noktali-virgul',
    ],
    [
      'Bu sözcük “Arapça kökenli” dilimize çok eskiden girmiş.',
      'Bu sözcük (Arapça kökenli) dilimize çok eskiden girmiş.',
      'tirnak',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // “ama, fakat, ancak, çünkü, yoksa…” bağlaçlarından önce noktalı virgül
  // Bu bağlaçlar iki bağımsız cümleyi birbirine bağlar; aralarındaki duraklama
  // virgülün taşıyabileceğinden büyük. Düzeltme noktalı virgül eklediği için
  // çeldirici asla noktalı virgül seçilmedi.
  // -------------------------------------------------------------------------
  ...grup('noktali-virgul-cumle', 'orta', [
    [
      'Çok çalıştı, ancak istediği sonucu alamadı.',
      'Çok çalıştı; ancak istediği sonucu alamadı.',
      'virgul',
      'nokta',
    ],
    [
      'Kar yağıyordu, fakat kimse üşümüyordu.',
      'Kar yağıyordu; fakat kimse üşümüyordu.',
      'virgul',
      'nokta',
    ],
    [
      'Bugün dışarı çıkmadım, çünkü hava çok soğuktu.',
      'Bugün dışarı çıkmadım; çünkü hava çok soğuktu.',
      'virgul',
      'nokta',
    ],
    ['Elif’i aradım, ama telefonunu açmadı.', 'Elif’i aradım; ama telefonunu açmadı.', 'virgul', 'kesme'],
    [
      'Acele etmelisin, yoksa ilk otobüsü kaçıracaksın.',
      'Acele etmelisin; yoksa ilk otobüsü kaçıracaksın.',
      'virgul',
      'nokta',
    ],
    ['Sen de haklısın, ama bu işi böyle bitiremeyiz!', 'Sen de haklısın; ama bu işi böyle bitiremeyiz!', 'virgul', 'unlem'],
    [
      'Konular bitti, öyleyse deneme çözmeye başlayalım mı?',
      'Konular bitti; öyleyse deneme çözmeye başlayalım mı?',
      'virgul',
      'soru',
    ],
    [
      'Yağmur bardaktan boşanıyordu, lakin maç yine de oynandı.',
      'Yağmur bardaktan boşanıyordu; lakin maç yine de oynandı.',
      'virgul',
      'nokta',
    ],
    [
      'Ali “Ben gelmiyorum.” dedi, bundan dolayı planı değiştirdik.',
      'Ali “Ben gelmiyorum.” dedi; bundan dolayı planı değiştirdik.',
      'virgul',
      'tirnak',
    ],
    [
      'Tercih listesini hazırladık, ancak son karar (aile toplantısında) verilecek.',
      'Tercih listesini hazırladık; ancak son karar (aile toplantısında) verilecek.',
      'virgul',
      'parantez',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Cins isme gelen çekim eki kesmeyle ayrılmaz
  // Kesme özel ada mahsus; “müdür, kitap, okul” cins isim olduğu için ek doğrudan
  // yazılır. Tabela ve duyurularda çok görülen hata olduğundan ayrı grup edildi.
  // -------------------------------------------------------------------------
  ...grup('kesme-cins-isim', 'orta', [
    [
      'Müdür’e durumu anlattım, o da hemen yardımcı oldu.',
      'Müdüre durumu anlattım, o da hemen yardımcı oldu.',
      'kesme',
      'virgul',
    ],
    [
      'Öğretmen’in masasında bir yığın kâğıt duruyordu.',
      'Öğretmenin masasında bir yığın kâğıt duruyordu.',
      'kesme',
      'nokta',
    ],
    [
      'Kitap’ın son sayfasını okuyunca çok şaşırdım!',
      'Kitabın son sayfasını okuyunca çok şaşırdım!',
      'kesme',
      'unlem',
    ],
    [
      'Bu okul’da tam üç yıl okudum; hiç unutmam.',
      'Bu okulda tam üç yıl okudum; hiç unutmam.',
      'kesme',
      'noktali-virgul',
    ],
    [
      'Doktor’a gitmeden önce randevu aldın mı?',
      'Doktora gitmeden önce randevu aldın mı?',
      'kesme',
      'soru',
    ],
    [
      'Bilgisayar’ı tamire götürdüm (garantisi çoktan bitmiş).',
      'Bilgisayarı tamire götürdüm (garantisi çoktan bitmiş).',
      'kesme',
      'parantez',
    ],
    ['Ev’in kapısı sabaha kadar aralık kaldı…', 'Evin kapısı sabaha kadar aralık kaldı…', 'kesme', 'uc-nokta'],
    ['Öğretmen “Defter’i çıkarın.” dedi.', 'Öğretmen “Defteri çıkarın.” dedi.', 'kesme', 'tirnak'],
    [
      'Otobüs’ün İzmir-Aydın seferi iptal edilmiş.',
      'Otobüsün İzmir-Aydın seferi iptal edilmiş.',
      'kesme',
      'kisa-cizgi',
    ],
    [
      'Rapor’un sonuç bölümünü henüz yazmadım.',
      'Raporun sonuç bölümünü henüz yazmadım.',
      'kesme',
      'nokta',
    ],
  ]),

  // -------------------------------------------------------------------------
  // Soru anlamı taşımayan cümlede soru işareti
  // “ne, nasıl, kim, kaç” sözleri cümlede geçtiği hâlde cümle bir şey sormuyor,
  // bildiriyor. Düzeltme sona nokta koyduğu için çeldirici asla nokta olamaz.
  // -------------------------------------------------------------------------
  ...grup('soru-anlami', 'zor', [
    [
      'Bu soruyu kimin çözdüğünü Zeynep’e söylemedim?',
      'Bu soruyu kimin çözdüğünü Zeynep’e söylemedim.',
      'soru',
      'kesme',
    ],
    [
      'Nereden geldiğini, nereye gittiğini kimse sormadı?',
      'Nereden geldiğini, nereye gittiğini kimse sormadı.',
      'soru',
      'virgul',
    ],
    [
      'Hangi üniversiteyi kazandığını bize hiç söylemedi; biz de sormadık?',
      'Hangi üniversiteyi kazandığını bize hiç söylemedi; biz de sormadık.',
      'soru',
      'noktali-virgul',
    ],
    [
      'Öğretmen bu konunun kaç saat süreceğini “Bilmiyorum.” diye geçiştirdi?',
      'Öğretmen bu konunun kaç saat süreceğini “Bilmiyorum.” diye geçiştirdi.',
      'soru',
      'tirnak',
    ],
    [
      'Kütüphanenin (yeni binanın arkasında) kaçta açıldığını bilmiyorum?',
      'Kütüphanenin (yeni binanın arkasında) kaçta açıldığını bilmiyorum.',
      'soru',
      'parantez',
    ],
    [
      'Kim gelecek, kim gelmeyecek… listeyi hâlâ göremedim?',
      'Kim gelecek, kim gelmeyecek… listeyi hâlâ göremedim.',
      'soru',
      'uc-nokta',
    ],
    [
      'Trabzon-Rize yolunun ne zaman biteceğini duymadım?',
      'Trabzon-Rize yolunun ne zaman biteceğini duymadım.',
      'soru',
      'kisa-cizgi',
    ],
    [
      'Ahmet’in hangi bölümü tercih ettiğini çok merak ediyorum?',
      'Ahmet’in hangi bölümü tercih ettiğini çok merak ediyorum.',
      'soru',
      'kesme',
    ],
    // Çeldirici iki nokta: arkadan açıklama geliyor, yeri doğru.
    [
      'Şunu iyi bilirim: çalışan insan bir gün mutlaka kazanır?',
      'Şunu iyi bilirim: çalışan insan bir gün mutlaka kazanır.',
      'soru',
      'iki-nokta',
    ],
    [
      'Neyi yanlış yaptığımı, nerede hata ettiğimi uzun uzun düşündüm?',
      'Neyi yanlış yaptığımı, nerede hata ettiğimi uzun uzun düşündüm.',
      'soru',
      'virgul',
    ],
    [
      'Bu kitabı kimin unuttuğunu bulamadık; sahibi de hiç aramadı?',
      'Bu kitabı kimin unuttuğunu bulamadık; sahibi de hiç aramadı.',
      'soru',
      'noktali-virgul',
    ],
    [
      'Elif’in neden erken çıktığını sonradan öğrendim?',
      'Elif’in neden erken çıktığını sonradan öğrendim.',
      'soru',
      'kesme',
    ],
  ]),
]

/** Havuzdaki soru sayısı — tanıtım ekranı bunu yazıyor. */
export const NOKTALAMA_BOYUTU = NOKTALAMA_HAVUZU.length
