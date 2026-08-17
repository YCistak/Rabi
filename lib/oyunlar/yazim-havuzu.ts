/**
 * Türkçe yazım kuralları oyununun kelime havuzu.
 *
 * Her satır bir çift: TDK Yazım Kılavuzu'na göre **doğru** yazılış ve günlük
 * hayatta en sık görülen **yanlış** yazılış. Oyun bu ikisini iki şık olarak
 * gösterir, oyuncu doğrusuna dokunur.
 *
 * Havuz iki kaynaktan derlendi:
 * 1. TDK Yazım Kılavuzu ve Güncel Türkçe Sözlük (doğru yazılışların tamamı
 *    `scripts/havuz-dogrula.mjs` ile sozluk.gov.tr üzerinden doğrulandı),
 * 2. ÖSYM'nin yıllardır sorduğu başlıklar — ayrı/bitişik yazım, "de/da" ve "ki"
 *    bağlacı, "mi" soru eki, kesme işareti, düzeltme işareti.
 *
 * Yanlış şık bilerek **inandırıcı** seçildi: uydurma bir bozma değil, gerçekten
 * yaygın olan hata. Aksi hâlde oyun okumadan bilinir, öğretmez.
 */

export type YazimKurali =
  | 'ses'
  | 'yabanci'
  | 'bitisik'
  | 'ayri'
  | 'duzeltme'
  | 'de-da'
  | 'ki'
  | 'soru-eki'
  | 'kesme'

export type YazimSorusu = {
  dogru: string
  yanlis: string
  kural: YazimKurali
}

export const KURAL_ADI: Record<YazimKurali, string> = {
  ses: 'Ses ve harf',
  yabanci: 'Yabancı kökenli kelime',
  bitisik: 'Bitişik yazılır',
  ayri: 'Ayrı yazılır',
  duzeltme: 'Düzeltme işareti',
  'de-da': '“de / da” bağlacı',
  ki: '“ki” bağlacı',
  'soru-eki': '“mi” soru eki',
  kesme: 'Kesme işareti',
}

/** Sonuç ekranında, yanlış bilinen kelimenin altında görünen kısa kural. */
export const KURAL_ACIKLAMASI: Record<YazimKurali, string> = {
  ses: 'Kelime söylendiği gibi değil, kökündeki sesle yazılır.',
  yabanci: 'Yabancı kökenli kelimeler Türkçedeki yerleşmiş biçimiyle yazılır.',
  bitisik: 'Birleşince anlam kaydığı için tek kelime hâlinde yazılır.',
  ayri: 'Anlam kayması yok; kelimeler ayrı ayrı yazılır.',
  duzeltme: 'Uzun okunan ünlü, düzeltme işaretiyle (â, î, û) yazılır.',
  'de-da': 'Bağlaç olan “de/da” ayrı, hâl eki olan “-de/-da” bitişik yazılır.',
  ki: 'Bağlaç olan “ki” ayrı yazılır; “-ki” eki ve kalıplaşmışlar bitişiktir.',
  'soru-eki': 'Soru eki “mi” her zaman ayrı yazılır, kendinden sonrakiyle birleşir.',
  kesme: 'Özel ada gelen çekim eki kesmeyle ayrılır; yapım eki ve çokluk eki ayrılmaz.',
}

/** `[doğru, yanlış]` çiftlerini tek kurala bağlar — havuzu okunur tutmak için. */
function grup(kural: YazimKurali, ciftler: [string, string][]): YazimSorusu[] {
  return ciftler.map(([dogru, yanlis]) => ({ dogru, yanlis, kural }))
}

export const YAZIM_HAVUZU: YazimSorusu[] = [
  // -------------------------------------------------------------------------
  // Ses ve harf karışması — söylenişten kaynaklanan hatalar
  // -------------------------------------------------------------------------
  ...grup('ses', [
    ['yalnız', 'yanlız'],
    ['yanlış', 'yalnış'],
    ['yalnızca', 'yanlızca'],
    ['herkes', 'herkez'],
    ['tıraş', 'traş'],
    ['şoför', 'şöför'],
    ['maalesef', 'malesef'],
    ['sürpriz', 'süpriz'],
    ['kılavuz', 'klavuz'],
    ['eczane', 'ezcane'],
    ['gazete', 'gaste'],
    ['çarşamba', 'çarşanba'],
    ['perşembe', 'perşenbe'],
    ['ambulans', 'anbulans'],
    ['şemsiye', 'şemşiye'],
    ['meyve', 'meyva'],
    ['kolonya', 'kolanya'],
    ['menemen', 'melemen'],
    ['kokoreç', 'kokariç'],
    ['maydanoz', 'maydonoz'],
    ['domates', 'tomates'],
    ['çikolata', 'çukulata'],
    ['poğaça', 'poğoça'],
    ['fotoğraf', 'fotograf'],
    ['matematik', 'matamatik'],
    ['elektrik', 'elektirik'],
    ['enerji', 'enerci'],
    ['palyaço', 'palyanço'],
    ['bisiklet', 'pisiklet'],
    ['alarm', 'alarım'],
    ['burada', 'burda'],
    ['orada', 'orda'],
    ['şurada', 'şurda'],
    ['serbest', 'serbes'],
    ['kirpik', 'kiprik'],
    ['dakika', 'dakka'],
    ['hastane', 'hastahane'],
    ['pastane', 'pastahane'],
    ['kahvaltı', 'kahvaaltı'],
    ['şarj', 'şarz'],
    ['meşgul', 'meşkul'],
    ['mağdur', 'madur'],
    ['mağaza', 'magaza'],
    ['tehdit', 'tehdid'],
    ['iddia', 'iddaa'],
    ['herhalde', 'heralde'],
    ['ait', 'ayit'],
    ['çare', 'çağre'],
    ['çünkü', 'çünki'],
    ['soğan', 'sovan'],
    ['süper', 'super'],
    ['seyahat', 'seyehat'],
    ['tren', 'tiren'],
    ['küsur', 'küsür'],
    ['mahvetmek', 'mahfetmek'],
    ['sarhoş', 'serhoş'],
    ['kaymakam', 'kaymakan'],
    ['pantolon', 'pantalon'],
    ['kravat', 'karvat'],
    ['yoğurt', 'yoğrut'],
    ['eşofman', 'eşortman'],
    ['fasulye', 'fasülye'],
    ['misafir', 'müsafir'],
    ['muhabbet', 'muhabet'],
    ['tavsiye', 'tavsiya'],
    ['teşekkür', 'teşekür'],
    ['zannetmek', 'zanetmek'],
    ['affetmek', 'afetmek'],
    ['hissetmek', 'hisetmek'],
    ['reddetmek', 'redetmek'],
    ['makyaj', 'makiyaj'],
    ['inşallah', 'inşaallah'],
    ['direksiyon', 'direksyon'],
    ['hoparlör', 'oparlör'],
    ['ıspanak', 'ispanak'],
    ['şeftali', 'şevtali'],
  ]),

  // -------------------------------------------------------------------------
  // Yabancı kökenli kelimeler
  // -------------------------------------------------------------------------
  ...grup('yabanci', [
    ['orijinal', 'orjinal'],
    ['piyanist', 'pianist'],
    ['konservatuvar', 'konservatuar'],
    ['laboratuvar', 'laboratuar'],
    ['program', 'proğram'],
    ['film', 'filim'],
    ['virüs', 'vürüs'],
    ['artist', 'artiz'],
    ['espri', 'espiri'],
    ['röportaj', 'röpörtaj'],
    ['gramer', 'gıramer'],
    ['jimnastik', 'cimnastik'],
    ['grip', 'grib'],
    ['tampon', 'tanpon'],
    ['psikoloji', 'pisikoloji'],
    ['bisküvi', 'büsküvi'],
    ['lavabo', 'lavobo'],
    ['süveter', 'süeter'],
    ['ataş', 'ataç'],
    ['jant', 'cant'],
    ['entelektüel', 'entellektüel'],
    ['otobüs', 'otobus'],
    ['rötar', 'rotar'],
    ['antrenman', 'antreman'],
    ['antrenör', 'antronör'],
    ['sandviç', 'sandiviç'],
    ['portakal', 'portokal'],
    ['istasyon', 'istasyun'],
    ['televizyon', 'televizyun'],
    ['üniversite', 'ünivarsite'],
    ['restoran', 'restorant'],
    ['asansör', 'asansor'],
    ['ceket', 'çeket'],
    ['klasik', 'klâsik'],
  ]),

  // -------------------------------------------------------------------------
  // Bitişik yazılanlar — yanlış şık ayrı yazılmış hâli
  // -------------------------------------------------------------------------
  ...grup('bitisik', [
    ['birçok', 'bir çok'],
    ['hiçbir', 'hiç bir'],
    ['hiçbiri', 'hiç biri'],
    ['birkaç', 'bir kaç'],
    ['birtakım', 'bir takım'],
    ['herhangi', 'her hangi'],
    ['birbiri', 'bir biri'],
    ['biraz', 'bir az'],
    ['bugün', 'bu gün'],
    ['ilkokul', 'ilk okul'],
    ['ortaokul', 'orta okul'],
    ['anaokulu', 'ana okulu'],
    ['ilköğretim', 'ilk öğretim'],
    ['ortaöğretim', 'orta öğretim'],
    ['yükseköğretim', 'yüksek öğretim'],
    ['başhekim', 'baş hekim'],
    ['başhemşire', 'baş hemşire'],
    ['huzurevi', 'huzur evi'],
    ['basımevi', 'basım evi'],
    ['doğumevi', 'doğum evi'],
    ['yayınevi', 'yayın evi'],
    ['ayçiçeği', 'ay çiçeği'],
    ['hanımeli', 'hanım eli'],
    ['kahverengi', 'kahve rengi'],
    ['suçiçeği', 'su çiçeği'],
    ['vurdumduymaz', 'vurdum duymaz'],
    ['gitgide', 'git gide'],
    ['açgözlü', 'aç gözlü'],
    ['safkan', 'saf kan'],
    ['alışveriş', 'alış veriş'],
    ['gökkuşağı', 'gök kuşağı'],
    ['gözyaşı', 'göz yaşı'],
    ['gecekondu', 'gece kondu'],
    ['başsağlığı', 'baş sağlığı'],
    ['hanımefendi', 'hanım efendi'],
    ['beyefendi', 'bey efendi'],
    ['cumartesi', 'cuma ertesi'],
    ['pazartesi', 'pazar ertesi'],
    ['açıkgöz', 'açık göz'],
    ['karabiber', 'kara biber'],
    ['imambayıldı', 'imam bayıldı'],
    ['karnıyarık', 'karnı yarık'],
    ['yüzbaşı', 'yüz başı'],
    ['binbaşı', 'bin başı'],
    ['onbaşı', 'on başı'],
    ['akşamüstü', 'akşam üstü'],
    ['bilirkişi', 'bilir kişi'],
    ['uyurgezer', 'uyur gezer'],
    ['çekyat', 'çek yat'],
    ['biçerdöver', 'biçer döver'],
    ['cankurtaran', 'can kurtaran'],
    ['yeryüzü', 'yer yüzü'],
    ['gökyüzü', 'gök yüzü'],
    ['büyükelçi', 'büyük elçi'],
    ['başbakan', 'baş bakan'],
    ['cumhurbaşkanı', 'cumhur başkanı'],
    ['milletvekili', 'millet vekili'],
    ['başöğretmen', 'baş öğretmen'],
    ['ilkbahar', 'ilk bahar'],
    ['sonbahar', 'son bahar'],
    ['başvurmak', 'baş vurmak'],
    ['vazgeçmek', 'vaz geçmek'],
    ['zeytinyağı', 'zeytin yağı'],
    ['kaynanadili', 'kaynana dili'],
  ]),

  // -------------------------------------------------------------------------
  // Ayrı yazılanlar — yanlış şık bitişik yazılmış hâli
  // -------------------------------------------------------------------------
  ...grup('ayri', [
    ['her şey', 'herşey'],
    ['her zaman', 'herzaman'],
    ['her gün', 'hergün'],
    ['her biri', 'herbiri'],
    ['her ikisi', 'herikisi'],
    ['bir şey', 'birşey'],
    ['hoş geldin', 'hoşgeldin'],
    ['hoşça kal', 'hoşçakal'],
    ['sağ ol', 'sağol'],
    ['şu an', 'şuan'],
    ['hafta sonu', 'haftasonu'],
    ['yıl dönümü', 'yıldönümü'],
    ['ara sıra', 'arasıra'],
    ['bir daha', 'birdaha'],
    ['bir arada', 'birarada'],
    ['söz konusu', 'sözkonusu'],
    ['göz ardı', 'gözardı'],
    ['ön yargı', 'önyargı'],
    ['öz geçmiş', 'özgeçmiş'],
    ['fark etmek', 'farketmek'],
    ['terk etmek', 'terketmek'],
    ['yardım etmek', 'yardımetmek'],
    ['kabul etmek', 'kabuletmek'],
    ['devam etmek', 'devametmek'],
    ['teşekkür etmek', 'teşekküretmek'],
    ['var olmak', 'varolmak'],
    ['yok olmak', 'yokolmak'],
    ['pek çok', 'pekçok'],
    ['hiç olmazsa', 'hiçolmazsa'],
    ['az çok', 'azçok'],
    ['iyi kötü', 'iyikötü'],
    ['er geç', 'ergeç'],
    ['güle güle', 'gülegüle'],
    ['bir an önce', 'biranönce'],
    ['peki ama', 'pekiama'],
  ]),

  // -------------------------------------------------------------------------
  // Düzeltme işareti — ÖSYM'nin klasiği
  // -------------------------------------------------------------------------
  ...grup('duzeltme', [
    ['kâğıt', 'kağıt'],
    ['rüzgâr', 'rüzgar'],
    ['hükûmet', 'hükümet'],
    ['mahkûm', 'mahkum'],
    ['tezgâh', 'tezgah'],
    ['dükkân', 'dükkan'],
    ['mekân', 'mekan'],
    ['imkân', 'imkan'],
    ['kâtip', 'katip'],
    ['sükûnet', 'sükunet'],
    // "hala" (babanın kız kardeşi) ve "bekar" (nota işareti) sözlükte ayrı
    // kelimeler. Şapkasız hâli tek başına yanlış olmadığı için cümleyle soruluyor.
    ['Hâlâ bekliyorum.', 'Hala bekliyorum.'],
    ['Bekâr bir öğretmen.', 'Bekar bir öğretmen.'],
  ]),

  // -------------------------------------------------------------------------
  // "de / da" — bağlaç ayrı, hâl eki bitişik
  // -------------------------------------------------------------------------
  ...grup('de-da', [
    ['Sen de gel.', 'Sende gel.'],
    ['Ben de geldim.', 'Bende geldim.'],
    ['Ali de gelecek.', 'Alide gelecek.'],
    ['Bunu ben de bilmiyorum.', 'Bunu bende bilmiyorum.'],
    ['Okulda ders var.', 'Okul da ders var.'],
    ['Evde kimse yok.', 'Ev de kimse yok.'],
    ['Çantada kalem var.', 'Çanta da kalem var.'],
    ['Sınıfta kimse yoktu.', 'Sınıf ta kimse yoktu.'],
    ['Yolda kaldık.', 'Yol da kaldık.'],
    ['Bende kalem yok.', 'Ben de kalem yok.'],
    ['Sende bir tuhaflık var.', 'Sen de bir tuhaflık var.'],
    ['Kitapta yazıyor.', 'Kitap ta yazıyor.'],
  ]),

  // -------------------------------------------------------------------------
  // "ki" — bağlaç ayrı, ek ve kalıplaşmışlar bitişik
  // -------------------------------------------------------------------------
  ...grup('ki', [
    ['Duydum ki gelmişsin.', 'Duydumki gelmişsin.'],
    ['Öyle yorgunum ki uyuyakaldım.', 'Öyle yorgunumki uyuyakaldım.'],
    ['Bilirim ki haklısın.', 'Bilirimki haklısın.'],
    ['Benimki daha güzel.', 'Benim ki daha güzel.'],
    ['Akşamki maçı izledim.', 'Akşam ki maçı izledim.'],
    ['Evdeki hesap çarşıya uymaz.', 'Evde ki hesap çarşıya uymaz.'],
    ['Sanki hiç görmemiş.', 'San ki hiç görmemiş.'],
    ['Mademki geldin, otur.', 'Madem ki geldin, otur.'],
    ['Oysaki haberim yoktu.', 'Oysa ki haberim yoktu.'],
    ['Yarınki sınava çalıştım.', 'Yarın ki sınava çalıştım.'],
  ]),

  // -------------------------------------------------------------------------
  // "mi" soru eki — her zaman ayrı
  // -------------------------------------------------------------------------
  ...grup('soru-eki', [
    ['Geldi mi?', 'Geldimi?'],
    ['Okudun mu?', 'Okudunmu?'],
    ['Hazır mısın?', 'Hazırmısın?'],
    ['Gelecek misin?', 'Gelecekmisin?'],
    ['Güzel mi güzel.', 'Güzelmi güzel.'],
    ['Bitti mi haber ver.', 'Bittimi haber ver.'],
    ['Çalıştın mı?', 'Çalıştınmı?'],
  ]),

  // -------------------------------------------------------------------------
  // Kesme işareti — çekim eki ayrılır, yapım ve çokluk eki ayrılmaz
  // -------------------------------------------------------------------------
  ...grup('kesme', [
    ['Türkiye’nin', 'Türkiyenin'],
    ['Ankara’ya', 'Ankaraya'],
    ['İstanbul’da', 'İstanbulda'],
    ['Atatürk’ün', 'Atatürkün'],
    ['Ayşe’ye', 'Ayşeye'],
    ['2026’da', '2026 da'],
    ['TBMM’nin', 'TBMM nin'],
    ['Türkçede', 'Türkçe’de'],
    ['Ankaralıyım', 'Ankara’lıyım'],
    ['Ahmetlerde', 'Ahmet’lerde'],
    ['Aliler geldi.', 'Ali’ler geldi.'],
    ['Avrupalılar', 'Avrupa’lılar'],
  ]),
]

/** Havuzdaki soru sayısı — tanıtım ekranı bunu yazıyor. */
export const HAVUZ_BOYUTU = YAZIM_HAVUZU.length
