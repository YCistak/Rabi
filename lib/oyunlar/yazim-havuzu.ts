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

import type { Zorluk } from './ritim'

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
  /**
   * Zorluk.
   *
   * Taban kuraldan geliyor — "de/da" ayrımı müfredatın en çok işlenen konusu,
   * düzeltme işareti (â, î) en az bilineni. Ama kural içinde de büyük fark var:
   * *birçok* bitişik yazılır, bunu herkes bilir; *kaynanadili* de bitişik
   * yazılır, bunu kimse bilmez. Ayrılanlar tek tek işaretli.
   */
  zorluk: Zorluk
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
function grup(
  kural: YazimKurali,
  taban: Zorluk,
  ciftler: ([string, string] | [string, string, Zorluk])[],
): YazimSorusu[] {
  return ciftler.map(([dogru, yanlis, zorluk]) => ({
    dogru,
    yanlis,
    kural,
    zorluk: zorluk ?? taban,
  }))
}

export const YAZIM_HAVUZU: YazimSorusu[] = [
  // -------------------------------------------------------------------------
  // Ses ve harf karışması — söylenişten kaynaklanan hatalar
  // -------------------------------------------------------------------------
  ...grup('ses', 'kolay', [
    ['yalnız', 'yanlız'],
    ['yanlış', 'yalnış'],
    ['yalnızca', 'yanlızca', 'orta'],
    ['herkes', 'herkez'],
    ['tıraş', 'traş', 'orta'],
    ['şoför', 'şöför'],
    ['maalesef', 'malesef', 'orta'],
    ['sürpriz', 'süpriz'],
    ['kılavuz', 'klavuz', 'orta'],
    ['eczane', 'ezcane'],
    ['gazete', 'gaste'],
    ['çarşamba', 'çarşanba'],
    ['perşembe', 'perşenbe'],
    ['ambulans', 'anbulans', 'orta'],
    ['şemsiye', 'şemşiye'],
    ['meyve', 'meyva'],
    ['kolonya', 'kolanya', 'orta'],
    ['menemen', 'melemen', 'orta'],
    ['kokoreç', 'kokariç', 'zor'],
    ['maydanoz', 'maydonoz', 'orta'],
    ['domates', 'tomates'],
    ['çikolata', 'çukulata'],
    ['poğaça', 'poğoça', 'orta'],
    ['fotoğraf', 'fotograf'],
    ['matematik', 'matamatik'],
    ['elektrik', 'elektirik'],
    ['enerji', 'enerci', 'orta'],
    ['palyaço', 'palyanço', 'orta'],
    ['bisiklet', 'pisiklet'],
    ['alarm', 'alarım', 'orta'],
    ['burada', 'burda'],
    ['orada', 'orda'],
    ['şurada', 'şurda'],
    ['serbest', 'serbes', 'orta'],
    ['kirpik', 'kiprik', 'orta'],
    ['dakika', 'dakka', 'orta'],
    ['hastane', 'hastahane'],
    ['pastane', 'pastahane'],
    ['kahvaltı', 'kahvaaltı'],
    ['şarj', 'şarz', 'orta'],
    ['meşgul', 'meşkul', 'orta'],
    ['mağdur', 'madur', 'zor'],
    ['mağaza', 'magaza', 'orta'],
    ['tehdit', 'tehdid', 'zor'],
    ['iddia', 'iddaa', 'zor'],
    ['herhalde', 'heralde', 'orta'],
    ['ait', 'ayit', 'orta'],
    ['çare', 'çağre'],
    ['çünkü', 'çünki'],
    ['soğan', 'sovan'],
    ['süper', 'super'],
    ['seyahat', 'seyehat', 'orta'],
    ['tren', 'tiren'],
    ['küsur', 'küsür', 'zor'],
    ['mahvetmek', 'mahfetmek', 'zor'],
    ['sarhoş', 'serhoş', 'orta'],
    ['kaymakam', 'kaymakan', 'orta'],
    ['pantolon', 'pantalon'],
    ['kravat', 'karvat'],
    ['yoğurt', 'yoğrut'],
    ['eşofman', 'eşortman', 'orta'],
    ['fasulye', 'fasülye', 'orta'],
    ['misafir', 'müsafir', 'orta'],
    ['muhabbet', 'muhabet', 'zor'],
    ['tavsiye', 'tavsiya', 'orta'],
    ['teşekkür', 'teşekür'],
    ['zannetmek', 'zanetmek', 'zor'],
    ['affetmek', 'afetmek', 'zor'],
    ['hissetmek', 'hisetmek', 'zor'],
    ['reddetmek', 'redetmek', 'zor'],
    ['makyaj', 'makiyaj', 'orta'],
    ['inşallah', 'inşaallah', 'orta'],
    ['direksiyon', 'direksyon', 'orta'],
    ['hoparlör', 'oparlör', 'orta'],
    ['ıspanak', 'ispanak', 'orta'],
    ['şeftali', 'şevtali', 'orta'],
  ]),

  // -------------------------------------------------------------------------
  // Yabancı kökenli kelimeler
  // -------------------------------------------------------------------------
  ...grup('yabanci', 'orta', [
    ['orijinal', 'orjinal', 'orta'],
    ['piyanist', 'pianist', 'orta'],
    ['konservatuvar', 'konservatuar', 'zor'],
    ['laboratuvar', 'laboratuar', 'zor'],
    ['program', 'proğram', 'kolay'],
    ['film', 'filim', 'kolay'],
    ['virüs', 'vürüs', 'orta'],
    ['artist', 'artiz', 'kolay'],
    ['espri', 'espiri', 'orta'],
    ['röportaj', 'röpörtaj', 'orta'],
    ['gramer', 'gıramer', 'orta'],
    ['jimnastik', 'cimnastik', 'zor'],
    ['grip', 'grib', 'kolay'],
    ['tampon', 'tanpon', 'orta'],
    ['psikoloji', 'pisikoloji', 'orta'],
    ['bisküvi', 'büsküvi', 'zor'],
    ['lavabo', 'lavobo', 'orta'],
    ['süveter', 'süeter', 'zor'],
    ['ataş', 'ataç', 'zor'],
    ['jant', 'cant', 'zor'],
    ['entelektüel', 'entellektüel', 'zor'],
    ['otobüs', 'otobus', 'kolay'],
    ['rötar', 'rotar', 'zor'],
    ['antrenman', 'antreman', 'zor'],
    ['antrenör', 'antronör', 'zor'],
    ['sandviç', 'sandiviç', 'zor'],
    ['portakal', 'portokal', 'kolay'],
    ['istasyon', 'istasyun', 'kolay'],
    ['televizyon', 'televizyun', 'kolay'],
    ['üniversite', 'ünivarsite', 'kolay'],
    ['restoran', 'restorant'],
    ['asansör', 'asansor', 'orta'],
    ['ceket', 'çeket', 'kolay'],
    ['klasik', 'klâsik', 'kolay'],
  ]),

  // -------------------------------------------------------------------------
  // Bitişik yazılanlar — yanlış şık ayrı yazılmış hâli
  // -------------------------------------------------------------------------
  ...grup('bitisik', 'zor', [
    ['birçok', 'bir çok', 'kolay'],
    ['hiçbir', 'hiç bir', 'kolay'],
    ['hiçbiri', 'hiç biri', 'orta'],
    ['birkaç', 'bir kaç', 'kolay'],
    ['birtakım', 'bir takım', 'orta'],
    ['herhangi', 'her hangi', 'orta'],
    ['birbiri', 'bir biri', 'orta'],
    ['biraz', 'bir az', 'kolay'],
    ['bugün', 'bu gün', 'kolay'],
    ['ilkokul', 'ilk okul', 'kolay'],
    ['ortaokul', 'orta okul', 'kolay'],
    ['anaokulu', 'ana okulu', 'kolay'],
    ['ilköğretim', 'ilk öğretim', 'orta'],
    ['ortaöğretim', 'orta öğretim', 'orta'],
    ['yükseköğretim', 'yüksek öğretim', 'orta'],
    ['başhekim', 'baş hekim', 'orta'],
    ['başhemşire', 'baş hemşire'],
    ['huzurevi', 'huzur evi', 'orta'],
    ['basımevi', 'basım evi'],
    ['doğumevi', 'doğum evi'],
    ['yayınevi', 'yayın evi'],
    ['ayçiçeği', 'ay çiçeği', 'orta'],
    ['hanımeli', 'hanım eli'],
    ['kahverengi', 'kahve rengi', 'kolay'],
    ['suçiçeği', 'su çiçeği'],
    ['vurdumduymaz', 'vurdum duymaz'],
    ['gitgide', 'git gide'],
    ['açgözlü', 'aç gözlü', 'orta'],
    ['safkan', 'saf kan'],
    ['alışveriş', 'alış veriş', 'kolay'],
    ['gökkuşağı', 'gök kuşağı', 'kolay'],
    ['gözyaşı', 'göz yaşı', 'kolay'],
    ['gecekondu', 'gece kondu', 'kolay'],
    ['başsağlığı', 'baş sağlığı', 'orta'],
    ['hanımefendi', 'hanım efendi', 'orta'],
    ['beyefendi', 'bey efendi', 'orta'],
    ['cumartesi', 'cuma ertesi', 'kolay'],
    ['pazartesi', 'pazar ertesi', 'kolay'],
    ['açıkgöz', 'açık göz', 'orta'],
    ['karabiber', 'kara biber', 'orta'],
    ['imambayıldı', 'imam bayıldı'],
    ['karnıyarık', 'karnı yarık'],
    ['yüzbaşı', 'yüz başı', 'orta'],
    ['binbaşı', 'bin başı', 'orta'],
    ['onbaşı', 'on başı', 'orta'],
    ['akşamüstü', 'akşam üstü'],
    ['bilirkişi', 'bilir kişi'],
    ['uyurgezer', 'uyur gezer'],
    ['çekyat', 'çek yat'],
    ['biçerdöver', 'biçer döver'],
    ['cankurtaran', 'can kurtaran'],
    ['yeryüzü', 'yer yüzü', 'kolay'],
    ['gökyüzü', 'gök yüzü', 'kolay'],
    ['büyükelçi', 'büyük elçi', 'orta'],
    ['başbakan', 'baş bakan', 'kolay'],
    ['cumhurbaşkanı', 'cumhur başkanı', 'kolay'],
    ['milletvekili', 'millet vekili', 'orta'],
    ['başöğretmen', 'baş öğretmen', 'orta'],
    ['ilkbahar', 'ilk bahar', 'kolay'],
    ['sonbahar', 'son bahar', 'kolay'],
    ['başvurmak', 'baş vurmak', 'orta'],
    ['vazgeçmek', 'vaz geçmek', 'orta'],
    ['zeytinyağı', 'zeytin yağı', 'orta'],
    ['kaynanadili', 'kaynana dili'],
  ]),

  // -------------------------------------------------------------------------
  // Ayrı yazılanlar — yanlış şık bitişik yazılmış hâli
  // -------------------------------------------------------------------------
  ...grup('ayri', 'zor', [
    ['her şey', 'herşey', 'kolay'],
    ['her zaman', 'herzaman', 'kolay'],
    ['her gün', 'hergün', 'kolay'],
    ['her biri', 'herbiri', 'orta'],
    ['her ikisi', 'herikisi', 'orta'],
    ['bir şey', 'birşey', 'kolay'],
    ['hoş geldin', 'hoşgeldin', 'kolay'],
    ['hoşça kal', 'hoşçakal', 'orta'],
    ['sağ ol', 'sağol', 'kolay'],
    ['şu an', 'şuan', 'orta'],
    ['hafta sonu', 'haftasonu', 'orta'],
    ['yıl dönümü', 'yıldönümü'],
    ['ara sıra', 'arasıra'],
    ['bir daha', 'birdaha', 'orta'],
    ['bir arada', 'birarada', 'orta'],
    ['söz konusu', 'sözkonusu'],
    ['göz ardı', 'gözardı'],
    ['ön yargı', 'önyargı'],
    ['öz geçmiş', 'özgeçmiş'],
    ['fark etmek', 'farketmek', 'orta'],
    ['terk etmek', 'terketmek', 'orta'],
    ['yardım etmek', 'yardımetmek', 'kolay'],
    ['kabul etmek', 'kabuletmek', 'kolay'],
    ['devam etmek', 'devametmek', 'kolay'],
    ['teşekkür etmek', 'teşekküretmek', 'kolay'],
    ['var olmak', 'varolmak', 'orta'],
    ['yok olmak', 'yokolmak', 'orta'],
    ['pek çok', 'pekçok', 'orta'],
    ['hiç olmazsa', 'hiçolmazsa'],
    ['az çok', 'azçok', 'orta'],
    ['iyi kötü', 'iyikötü', 'orta'],
    ['er geç', 'ergeç', 'orta'],
    ['güle güle', 'gülegüle', 'kolay'],
    ['bir an önce', 'biranönce', 'orta'],
    ['peki ama', 'pekiama', 'orta'],
  ]),

  // -------------------------------------------------------------------------
  // Düzeltme işareti — ÖSYM'nin klasiği
  // -------------------------------------------------------------------------
  ...grup('duzeltme', 'zor', [
    ['kâğıt', 'kağıt', 'orta'],
    ['rüzgâr', 'rüzgar', 'orta'],
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
  ...grup('de-da', 'kolay', [
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
  ...grup('ki', 'orta', [
    ['Duydum ki gelmişsin.', 'Duydumki gelmişsin.', 'kolay'],
    ['Öyle yorgunum ki uyuyakaldım.', 'Öyle yorgunumki uyuyakaldım.'],
    ['Bilirim ki haklısın.', 'Bilirimki haklısın.'],
    ['Benimki daha güzel.', 'Benim ki daha güzel.', 'kolay'],
    ['Akşamki maçı izledim.', 'Akşam ki maçı izledim.'],
    ['Evdeki hesap çarşıya uymaz.', 'Evde ki hesap çarşıya uymaz.'],
    ['Sanki hiç görmemiş.', 'San ki hiç görmemiş.', 'zor'],
    ['Mademki geldin, otur.', 'Madem ki geldin, otur.', 'zor'],
    ['Oysaki haberim yoktu.', 'Oysa ki haberim yoktu.', 'zor'],
    ['Yarınki sınava çalıştım.', 'Yarın ki sınava çalıştım.'],
  ]),

  // -------------------------------------------------------------------------
  // "mi" soru eki — her zaman ayrı
  // -------------------------------------------------------------------------
  ...grup('soru-eki', 'kolay', [
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
  ...grup('kesme', 'orta', [
    ['Türkiye’nin', 'Türkiyenin', 'kolay'],
    ['Ankara’ya', 'Ankaraya', 'kolay'],
    ['İstanbul’da', 'İstanbulda', 'kolay'],
    ['Atatürk’ün', 'Atatürkün', 'kolay'],
    ['Ayşe’ye', 'Ayşeye', 'kolay'],
    ['2026’da', '2026 da', 'kolay'],
    ['TBMM’nin', 'TBMM nin'],
    ['Türkçede', 'Türkçe’de', 'zor'],
    ['Ankaralıyım', 'Ankara’lıyım', 'zor'],
    ['Ahmetlerde', 'Ahmet’lerde', 'zor'],
    ['Aliler geldi.', 'Ali’ler geldi.', 'zor'],
    ['Avrupalılar', 'Avrupa’lılar', 'zor'],
  ]),
]

/** Havuzdaki soru sayısı — tanıtım ekranı bunu yazıyor. */
export const HAVUZ_BOYUTU = YAZIM_HAVUZU.length
