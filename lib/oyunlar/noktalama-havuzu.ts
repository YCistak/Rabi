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
  | 'uc-nokta-eksiltme'

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
]

/** Havuzdaki soru sayısı — tanıtım ekranı bunu yazıyor. */
export const NOKTALAMA_BOYUTU = NOKTALAMA_HAVUZU.length
