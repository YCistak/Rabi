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
    ['herhâlde', 'heralde', 'orta'],
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

    // ---- Yazıya taşınan söyleyiş ----
    // Bu kelimelerde hata gözden değil kulaktan geliyor: konuşurken kayan ses
    // olduğu gibi yazılıyor. Yaygın oldukları için tabanı kolay bıraktık.
    ['heyecan', 'heycan'],
    ['sandalye', 'sandelye'],
    ['dinozor', 'dinazor'],
    ['motosiklet', 'motorsiklet'],
    ['egzoz', 'eksoz'],
    ['makine', 'makina'],
    ['egzersiz', 'eksersiz', 'orta'],
    ['nüfus', 'nufüs', 'orta'],
    ['aferin', 'afferin', 'orta'],
    ['röntgen', 'röngen', 'orta'],
    ['stajyer', 'stajer', 'orta'],
    // Aşağıdakiler ÖSYM'nin sevdiği ayrıntılar: doğru yazılış söyleyişe ters
    // düştüğü için doğrusunu bilmek ezber gerektiriyor.
    ['unvan', 'ünvan', 'zor'],
    // "mütevazi" de sözlükte var (koşut, paralel) — soru tek doğru cevaplı
    // kalsın diye tamlama hâlinde soruluyor.
    ['mütevazı bir ev', 'mütevazi bir ev', 'zor'],
    ['ıstakoz', 'istakoz', 'zor'],
    ['aksesuar', 'aksesuvar', 'zor'],

    // ---- Çift ünsüz ----
    // Arapçadan gelen bu kelimelerde ünsüz ikizleşiyor ama söyleyişte tek ses
    // duyuluyor; kulağına güvenen tek harfle yazıyor. Kökte iki tane var.
    ['dikkat', 'dikat', 'kolay'],
    ['hakkında', 'hakında', 'kolay'],
    ['bakkal', 'bakal', 'kolay'],
    ['cadde', 'cade', 'kolay'],
    ['millet', 'milet', 'orta'],
    ['cennet', 'cenet', 'orta'],
    ['kuvvet', 'kuvet', 'orta'],
    ['şiddet', 'şidet', 'orta'],
    ['hassas', 'hasas', 'orta'],
    ['evvel', 'evel', 'orta'],
    ['teneffüs', 'tenefüs', 'orta'],
    ['hürriyet', 'hüriyet', 'zor'],
    ['sıhhat', 'sıhat', 'zor'],
    ['muhakkak', 'muhakak', 'zor'],
    ['seyyar', 'seyar', 'zor'],
    ['ıssız', 'ısız', 'zor'],

    // ---- "n" mi "m" mi ----
    // b'den önceki n söyleyişte m'ye kayıyor (dudak benzeşmesi) ve TDK bu
    // kelimeleri m ile yazıyor; yanlış şık kökteki n'yi olduğu gibi bırakıyor.
    ['pembe', 'penbe', 'orta'],
    ['çember', 'çenber', 'orta'],
    ['tembel', 'tenbel', 'orta'],
    ['saklambaç', 'saklanbaç', 'orta'],
    ['cambaz', 'canbaz', 'zor'],
    ['kambur', 'kanbur', 'zor'],
    ['sümbül', 'sünbül', 'zor'],

    // ---- Sert ünsüzle biten kökler ----
    // Türkçe kelimenin sonunda b, c, d bulunmaz; ek gelince yumuşasa da yalın
    // hâli sert yazılır ("ilacı" ama "ilaç"). Yanlış şıklar Osmanlıca aslından.
    ['armut', 'armud', 'kolay'],
    ['ilaç', 'ilac', 'kolay'],
    ['ihtiyaç', 'ihtiyac', 'kolay'],
    ['ümit', 'ümid', 'orta'],
    ['bant', 'band', 'orta'],
    ['tespit', 'tesbit', 'orta'],
    ['ispat', 'isbat', 'orta'],
    ['üstat', 'üstad', 'zor'],
    ['müspet', 'müsbet', 'zor'],
    ['nispet', 'nisbet', 'zor'],

    // ---- ı / i ayrımı ----
    // İkisi Türkçede ayrı harf; karışınca kelime tanınmaz hâle geliyor.
    ['ısrar', 'israr', 'orta'],
    ['ıslak', 'islak', 'orta'],
    ['ıhlamur', 'ihlamur', 'orta'],
    ['ıslık', 'islık', 'orta'],
    ['ıstırap', 'ızdırap', 'zor'],

    // ---- "-hane": düşen ve düşmeyen h ----
    // hastane, pastane, postane'de h düştü; kütüphane ve dershane'de düşmedi.
    // Kural yok, TDK hangisinde kısalmayı kabul ettiyse o yazılıyor.
    ['kütüphane', 'kütüpane', 'orta'],
    ['postane', 'postahane', 'orta'],
    ['dershane', 'dersane', 'zor'],

    // ---- Söyleyişten yazıya sızanlar ----
    ['merhaba', 'meraba', 'kolay'],
    ['aşçı', 'ahçı', 'orta'],
    ['sohbet', 'sohpet', 'orta'],
    ['yalnızlık', 'yanlızlık', 'orta'],
    ['yanlışlıkla', 'yalnışlıkla', 'orta'],
    ['karnabahar', 'karnıbahar', 'orta'],
    // "tabi" de sözlükte var (bağlı, bağımlı); soru tek doğru cevaplı kalsın
    // diye cümle içinde soruluyor.
    ['Tabii ki gelirim.', 'Tabi ki gelirim.', 'zor'],
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

    // ---- Aslından uzaklaşan biçimler ----
    // Kelime Türkçeye girerken bir ses kaybetmiş ya da kazanmış; yanlış şık
    // çoğu zaman kaynak dildeki söyleyişe daha yakın olduğu için inandırıcı.
    ['tornavida', 'tornovida', 'kolay'],
    ['fren', 'firen', 'kolay'],
    ['gardırop', 'gardrop', 'kolay'],
    ['ambalaj', 'anbalaj'],
    ['kapüşon', 'kapişon'],
    ['metot', 'metod'],
    ['pardösü', 'pardesü'],
    ['kalorifer', 'kalörifer'],
    // Bu dördünde yanlış yazılış o kadar yerleşmiş ki doğrusu kulağa yanlış
    // geliyor — havuzun en zor yabancı kelimeleri.
    ['ampul', 'ampül', 'zor'],
    ['fanila', 'fanile', 'zor'],
    ['şezlong', 'şazlong', 'zor'],
    ['aperitif', 'aperatif', 'zor'],
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

    // ---- Kalıplaşmış birleşikler ----
    // Kelimeler birleşince yeni bir kavram doğduğu için bitişik: "büyük anne"
    // boyu büyük anne, "büyükanne" ise babaannedir.
    ['yılbaşı', 'yıl başı', 'kolay'],
    ['büyükanne', 'büyük anne', 'kolay'],
    ['büyükbaba', 'büyük baba', 'kolay'],
    ['sivrisinek', 'sivri sinek', 'kolay'],
    ['atasözü', 'ata sözü', 'kolay'],
    ['anayasa', 'ana yasa', 'orta'],
    ['hoşgörü', 'hoş görü', 'orta'],
    ['ateşkes', 'ateş kes'],
    ['başrol', 'baş rol'],
    ['sırtüstü', 'sırt üstü'],
    ['yüzüstü', 'yüz üstü'],
    // Renk adları birleşik yazılır; "kavun içi" meyvenin içi, "kavuniçi" renktir.
    ['kavuniçi', 'kavun içi'],
    ['boşboğaz', 'boş boğaz'],
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

    // ---- Kalıp gibi görünen ama ayrı yazılanlar ----
    ['hiç kimse', 'hiçkimse', 'kolay'],
    ['hiçbir şey', 'hiçbirşey', 'kolay'],
    ['hoş bulduk', 'hoşbulduk', 'kolay'],
    // Sayılar ayrı yazılır; bitişik yazım yalnızca para/çek gibi belgelerde.
    ['on beş', 'onbeş', 'kolay'],
    ['yüz elli', 'yüzelli', 'orta'],
    // Böcek adlarının çoğu bitişik (kaynanadili) ama bu ayrı; TDK Yazım
    // Kılavuzu'nda madde başı "uğur böceği".
    ['uğur böceği', 'uğurböceği', 'orta'],
    // ---- Tekrar grupları ----
    // İki kelime aynı ya da yakın anlamda tekrarlanınca kalıp bitişmez.
    ['yan yana', 'yanyana', 'kolay'],
    ['el ele', 'elele', 'orta'],
    ['üst üste', 'üstüste'],
    ['baş başa', 'başbaşa'],
    ['peş peşe', 'peşpeşe'],
    ['art arda', 'artarda'],
    // "sarf" ad, ses düşmesi/türemesi yok — bu yüzden yardımcı fiil ayrı.
    ['sarf etmek', 'sarfetmek'],
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

    // ---- Uzun okunan ünlüler ----
    ['hikâye', 'hikaye', 'orta'],
    ['kâbus', 'kabus', 'orta'],
    ['nikâh', 'nikah', 'orta'],
    ['kâse', 'kase', 'orta'],
    // ---- Nispet (aitlik) eki ----
    // Sondaki "-i" aitlik bildiriyorsa uzun okunur ve şapka alır; şapkasız hâli
    // iyelik eki sayılır, anlam değişir: "millî takım" / "milli takım".
    ['millî takım', 'milli takım', 'orta'],
    ['resmî tatil', 'resmi tatil', 'orta'],
    ['tarihî eser', 'tarihi eser'],
    // ---- Şapkasız hâli başka kelime ----
    // Aşağıdakilerde şapka atılınca cümle bambaşka bir şey söylüyor; bu yüzden
    // tek kelime değil cümleyle soruluyorlar.
    ['Şirket kâr etti.', 'Şirket kar etti.'],
    ['Ona âşık oldu.', 'Ona aşık oldu.'],
    ['Bu bizim âdetimizdir.', 'Bu bizim adetimizdir.'],
    ['Hayvanlar âlemi geniştir.', 'Hayvanlar alemi geniştir.'],
    ['hâlbuki', 'halbuki'],
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

    ['Kitabı da getir.', 'Kitabıda getir.'],
    ['Annem de biliyor.', 'Annemde biliyor.'],
    ['Bahçede oynuyorlar.', 'Bahçe de oynuyorlar.'],
    ['Masada telefon var.', 'Masa da telefon var.'],
    ['Sınavda başarılar.', 'Sınav da başarılar.'],
    ['Bir de bunu dinle.', 'Birde bunu dinle.', 'orta'],
    ['Bu soruyu da çözdüm.', 'Bu soruyuda çözdüm.', 'orta'],
    ['Onda hiç sabır yok.', 'On da hiç sabır yok.', 'orta'],
    ['Ne kadar da çok konuşuyor.', 'Ne kadarda çok konuşuyor.', 'orta'],
    // "gitsem de" bağlaç: cümleden çıkarılabiliyor, o hâlde ayrı yazılır.
    ['Gitsem de olur.', 'Gitsemde olur.', 'zor'],
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

    ['Görüyorum ki çalışmışsın.', 'Görüyorumki çalışmışsın.', 'kolay'],
    ['Umarım ki geçersin.', 'Umarımki geçersin.', 'kolay'],
    ['Seninki nerede?', 'Senin ki nerede?', 'kolay'],
    ['Bugünkü ders iptal.', 'Bugün ki ders iptal.'],
    ['Dünkü sınav zordu.', 'Dün ki sınav zordu.'],
    ['Masadaki kitap benim.', 'Masada ki kitap benim.'],
    ['Sabahki toplantı uzun sürdü.', 'Sabah ki toplantı uzun sürdü.'],
    ['Öyle bir baktı ki korktum.', 'Öyle bir baktıki korktum.'],
    // "belki" ve "meğerki" kalıplaşmış sözler — ayırmak yanlış.
    ['Belki yarın gelirim.', 'Bel ki yarın gelirim.', 'zor'],
    ['Gelmez, meğerki çağırasın.', 'Gelmez, meğer ki çağırasın.', 'zor'],
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

    ['Gördün mü?', 'Gördünmü?'],
    ['Yağmur yağıyor mu?', 'Yağmur yağıyormu?'],
    ['Anladın mı?', 'Anladınmı?'],
    ['Öğrenci misin?', 'Öğrencimisin?'],
    ['Yorgun musun?', 'Yorgunmusun?'],
    ['Bakar mısın?', 'Bakarmısın?'],
    // Soru anlamı olmasa da (burada sitem var) ek yine ayrı yazılır.
    ['Bilmez miyim?', 'Bilmezmiyim?', 'orta'],
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

    ['Mehmet’in', 'Mehmetin', 'kolay'],
    ['Zeynep’le', 'Zeyneple', 'kolay'],
    ['Kızılırmak’ın', 'Kızılırmakın'],
    ['Marmara Denizi’nde', 'Marmara Denizinde'],
    ['Nutuk’u', 'Nutuku'],
    ['Kurtuluş Savaşı’nda', 'Kurtuluş Savaşında'],
    // ---- Kurum adları ----
    // Kurum, kuruluş ve iş yeri adlarına gelen ekler kesmeyle ayrılmaz; özel ad
    // olmalarına rağmen. ÖSYM bu istisnayı sık soruyor.
    ['Türk Dil Kurumuna', 'Türk Dil Kurumu’na', 'zor'],
    ['Ziraat Bankasına', 'Ziraat Bankası’na', 'zor'],
  ]),

  // -------------------------------------------------------------------------
  // Ses ve harf — ek grup: eklerin sesle uyumu
  // -------------------------------------------------------------------------
  // Buradaki hataların hepsi aynı kaynaktan çıkıyor: kelime söylenirken sesler
  // birbirine uyuyor, yazarken ise kök olduğu gibi bırakılıyor (ya da tersi).
  ...grup('ses', 'orta', [
    // Sert ünsüzle biten kelimeye gelen ek de sertleşir: -cı değil -çı.
    ['kitapçı', 'kitapcı', 'kolay'],
    ['çiçekçi', 'çiçekci', 'kolay'],
    ['sanatçı', 'sanatcı', 'kolay'],
    ['balıkçı', 'balıkcı', 'kolay'],
    ['dişçi', 'dişci'],
    ['saatçi', 'saatci'],
    ['simitçi', 'simitci'],
    ['gözlükçü', 'gözlükcü'],
    // Tersi de yanlış: yumuşak ünsüzden sonra ek sertleşmez.
    ['yolcu', 'yolçu', 'kolay'],
    ['tuzcu', 'tuzçu'],
    ['arabacı', 'arabaçı', 'kolay'],

    // Ünsüz yumuşaması: ünlüyle başlayan ek gelince p/ç/t/k sesi b/c/d/g olur.
    ['kitabı', 'kitapı', 'kolay'],
    ['ağacı', 'ağaçı', 'kolay'],
    ['dolabı', 'dolapı', 'kolay'],
    ['rengi', 'renki'],
    ['kanadı', 'kanatı'],
    ['ilacı', 'ilaçı'],

    // Ünlü düşmesi: iki heceli kelimenin ikinci ünlüsü ek gelince düşer.
    ['ağzı', 'ağızı'],
    ['burnu', 'burunu'],
    ['şehri', 'şehiri'],
    ['göğsü', 'göğüsü'],
    ['fikri', 'fikiri'],
    ['ömrü', 'ömürü'],
    ['aklı', 'akılı'],
    ['sabrı', 'sabırı', 'zor'],

    // Heceleri yer değiştiren ya da ses düşüren yaygın hatalar.
    ['sarımsak', 'sarmısak'],
    ['ağabey', 'ağbey'],
    ['tasdik', 'tastik'],
    ['şüphe', 'şübhe'],
    ['müsait', 'müsayit'],
    ['muayene', 'muyene'],
    ['mühendis', 'mühendiz', 'kolay'],
    ['inşaat', 'inşat', 'kolay'],
    ['patlıcan', 'patlican', 'kolay'],
    ['patates', 'patetes', 'kolay'],
    ['kayısı', 'kaysı'],
    ['pilav', 'pilaf'],
    ['kanepe', 'kanape'],
    ['mikrofon', 'mikrafon', 'kolay'],
    ['kuaför', 'kuvaför', 'kolay'],
    ['parfüm', 'perfüm', 'kolay'],
    ['deodorant', 'deodrant'],
    ['şampuan', 'şampuvan'],
    ['resepsiyon', 'resepsyon'],
  ]),

  // -------------------------------------------------------------------------
  // Yabancı kökenli kelimeler — ek grup: başta üst üste gelen iki ünsüz
  // -------------------------------------------------------------------------
  // Türkçe kelimeler iki ünsüzle başlamaz; bu yüzden konuşurken araya ya da
  // başa bir ünlü sıkıştırılıyor. Yazıda bu ünlü yazılmaz.
  ...grup('yabanci', 'orta', [
    ['trafik', 'tırafik', 'kolay'],
    ['tramvay', 'tıramvay'],
    ['plan', 'pilan', 'kolay'],
    ['plaka', 'pilaka', 'kolay'],
    ['plastik', 'pilastik', 'kolay'],
    ['klinik', 'kilinik'],
    ['kredi', 'kiredi', 'kolay'],
    ['spor', 'sipor', 'kolay'],
    ['stres', 'sitres', 'kolay'],
    ['klavye', 'kılavye'],
    ['broşür', 'buroşür'],
    // Ünlüsü ya da hecesi karıştırılan alıntılar.
    ['profesör', 'profösör', 'kolay'],
    ['enstitü', 'enstütü'],
    ['debriyaj', 'debiryaj', 'zor'],
    ['jeneratör', 'jenaratör'],
    ['fermuar', 'fermuvar'],
    ['tribün', 'tiribün'],
    ['turnuva', 'turnova'],
    ['rezervasyon', 'rezarvasyon'],
    ['dedektif', 'detektif'],
    ['kompozisyon', 'kompozisiyon'],
    ['kariyer', 'karyer'],
  ]),

  // -------------------------------------------------------------------------
  // Bitişik yazılanlar — ek grup: pekiştirmeliler ve kalıplaşmış birleşikler
  // -------------------------------------------------------------------------
  // Pekiştirme hecesi (bem-, sim-, sap-…) tek başına anlamsızdır; kelimeden
  // koparılamaz, bu yüzden her zaman bitişik yazılır.
  ...grup('bitisik', 'orta', [
    ['bembeyaz', 'bem beyaz', 'kolay'],
    ['simsiyah', 'sim siyah', 'kolay'],
    ['sapsarı', 'sap sarı', 'kolay'],
    ['masmavi', 'mas mavi', 'kolay'],
    ['yemyeşil', 'yem yeşil', 'kolay'],
    ['kupkuru', 'kup kuru'],
    ['upuzun', 'up uzun'],
    ['dosdoğru', 'dos doğru'],
    ['tertemiz', 'ter temiz'],
    ['büsbütün', 'büs bütün'],
    ['paramparça', 'param parça'],
    ['çepeçevre', 'çepe çevre', 'zor'],
    ['darmadağın', 'darma dağın', 'zor'],

    // Birleşince kelimelerden biri kendi anlamını yitiriyor: kaynanada "ana"
    // yok, gökdelende "delmek" yok. Anlam kayması varsa bitişik yazılır.
    ['kaynana', 'kayın ana'],
    ['akciğer', 'ak ciğer', 'kolay'],
    ['karaciğer', 'kara ciğer', 'kolay'],
    ['kırkayak', 'kırk ayak'],
    ['denizaltı', 'deniz altı'],
    ['gökdelen', 'gök delen'],
    ['dedikodu', 'dedi kodu', 'kolay'],
    ['delikanlı', 'deli kanlı', 'kolay'],
    ['sağduyu', 'sağ duyu'],
    ['soyadı', 'soy adı'],
    ['birdenbire', 'birden bire'],
    ['başkent', 'baş kent', 'kolay'],
    ['başkomutan', 'baş komutan'],
  ]),

  // -------------------------------------------------------------------------
  // Ayrı yazılanlar — ek grup: sayılar, ikilemeler, kalıplaşmamış öbekler
  // -------------------------------------------------------------------------
  // Sayılar harfle yazılırken her basamak ayrı yazılır; bitişik yazım yalnızca
  // çek, senet gibi belgelerde geçerli.
  ...grup('ayri', 'orta', [
    ['yirmi beş', 'yirmibeş', 'kolay'],
    ['otuz iki', 'otuziki', 'kolay'],
    ['kırk dört', 'kırkdört', 'kolay'],
    ['üç yüz altmış beş', 'üçyüzaltmışbeş'],

    // İkilemeler her zaman ayrı ve arada noktalama olmadan yazılır.
    ['yavaş yavaş', 'yavaşyavaş', 'kolay'],
    ['ağır ağır', 'ağırağır', 'kolay'],
    ['teker teker', 'tekerteker', 'kolay'],
    ['abur cubur', 'aburcubur', 'kolay'],
    ['irili ufaklı', 'iriliufaklı'],
    ['eciş bücüş', 'ecişbücüş'],
    ['allak bullak', 'allakbullak'],
    ['ıvır zıvır', 'ıvırzıvır'],
    ['konu komşu', 'konukomşu'],

    // Anlam kayması olmadığı için ayrı: "ön söz" hâlâ önde olan sözdür.
    // Bunlar bitişik sanıldığı için ÖSYM'nin sevdiği tuzaklar.
    ['ön söz', 'önsöz', 'zor'],
    ['dil bilgisi', 'dilbilgisi', 'zor'],
    ['ilk yardım', 'ilkyardım', 'zor'],
    ['iş birliği', 'işbirliği', 'zor'],
    ['hava alanı', 'havaalanı', 'zor'],

    // Yardımcı fiilde ses düşmesi ya da türemesi yoksa ayrı yazılır.
    ['dans etmek', 'dansetmek'],
    ['ilan etmek', 'ilanetmek'],
  ]),

  // -------------------------------------------------------------------------
  // Düzeltme işareti — ek grup
  // -------------------------------------------------------------------------
  // İşaret iki iş görüyor: ünlüyü uzatmak (kâinat) ve kendinden önceki g, k, l
  // sesini inceltmek (hâkim, kâhya). İkisi de yazılmazsa kelime başka okunur.
  ...grup('duzeltme', 'zor', [
    ['hâkim', 'hakim', 'orta'],
    ['dergâh', 'dergah', 'orta'],
    ['kâhya', 'kahya'],
    ['kâinat', 'kainat', 'orta'],
    ['kâfi', 'kafi'],
    ['yadigâr', 'yadigar'],
    ['zekâ', 'zeka', 'orta'],
    // Nispet eki "-î" uzun okunur; yazılmazsa kelime iyelik eki sanılır.
    ['askerî okul', 'askeri okul'],
    ['edebî eser', 'edebi eser'],
    ['dinî bayram', 'dini bayram'],
  ]),

  // -------------------------------------------------------------------------
  // Kesme işareti — ek grup: yer, eser, kısaltma ve saat
  // -------------------------------------------------------------------------
  ...grup('kesme', 'orta', [
    ['Karadeniz’in', 'Karadenizin', 'kolay'],
    ['Yunus Emre’yi', 'Yunus Emreyi', 'kolay'],
    ['Van Gölü’nün', 'Van Gölünün'],
    ['Ağrı Dağı’na', 'Ağrı Dağına'],
    ['Çanakkale Zaferi’ni', 'Çanakkale Zaferini'],
    ['Cumhuriyet Bayramı’nı', 'Cumhuriyet Bayramını'],
    // Kısaltmaya gelen ek, kısaltmanın okunuşuna göre seçilir: MEB "meb"
    // okunduğu için ek ince ünlüyle gelir.
    ['MEB’in', 'MEB’ın'],
    ['THY’de', 'THY de'],
    // Saat ve dakika gösteren sayılara gelen ek de kesmeyle ayrılır.
    ['saat 15.30’da', 'saat 15.30 da'],
    // Yapım eki kesmeyle ayrılmaz; özel ad artık cins ada dönüşmüştür.
    ['İstanbullu', 'İstanbul’lu', 'zor'],
    ['Türkçeyi', 'Türkçe’yi', 'zor'],
    ['Almancadan', 'Almanca’dan', 'zor'],
    ['Sağlık Bakanlığına', 'Sağlık Bakanlığı’na', 'zor'],
  ]),
]

/** Havuzdaki soru sayısı — tanıtım ekranı bunu yazıyor. */
export const HAVUZ_BOYUTU = YAZIM_HAVUZU.length
