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
}

/** Satırları tek kurala bağlar — havuzu okunur tutmak için. */
function grup(
  kural: NoktalamaKurali,
  satirlar: [string, string, NoktalamaIsareti, NoktalamaIsareti][],
): NoktalamaSorusu[] {
  return satirlar.map(([cumle, duzeltme, yanlisIsaret, dogruIsaret]) => ({
    cumle,
    duzeltme,
    yanlisIsaret,
    dogruIsaret,
    kural,
  }))
}

export const NOKTALAMA_HAVUZU: NoktalamaSorusu[] = [
  // -------------------------------------------------------------------------
  // “ve, veya, ile” bağlaçlarından önce virgül — en sık yapılan hata
  // -------------------------------------------------------------------------
  ...grup('ve-virgul', [
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
  ...grup('sirali-virgul', [
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
  ...grup('soru-anlami', [
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
  ...grup('soru-cumlesi', [
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
  ...grup('saat-nokta', [
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
  ...grup('iki-nokta-aciklama', [
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
  ...grup('kesme-yapim-eki', [
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
  ...grup('kesme-cokluk', [
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
  ...grup('hitap-virgul', [
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
]

/** Havuzdaki soru sayısı — tanıtım ekranı bunu yazıyor. */
export const NOKTALAMA_BOYUTU = NOKTALAMA_HAVUZU.length
