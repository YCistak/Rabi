/**
 * İklim Kuşakları oyununun havuzu — 9. sınıf "Yeryüzünde İklim Tipleri".
 *
 * Sorular **rastgele ülkelerden** kurulmuyor. Ölçüt şu: bir bölge ancak tek bir
 * iklim tipiyle anılabiliyorsa havuza giriyor. Brezilya bu yüzden ülke olarak
 * yok — kuzeyi ekvatoral, ortası savan, güneyi ılıman; "Brezilya'da hangi iklim
 * görülür" sorusunun tek doğru cevabı olmazdı. Yerine Amazon Havzası ve
 * Brezilya'nın orta kesimi ayrı ayrı, nokta olarak duruyor.
 *
 * Bu ayrım havuzun iki tür kaydı olmasının sebebi: bazı sorular bir **ülkeyi**
 * işaretliyor (sınırı boyanıyor), bazıları bir **bölgeyi** (halka konuyor).
 * Çölün, havzanın, kuşağın sınırı yok — ortası var.
 */

import type { Zorluk } from './ritim'

/**
 * İklim tipleri — MEB 9. sınıf coğrafya programındaki adlandırma.
 *
 * Yüksek dağ iklimi listede yok: yeri enlemle değil yükseltiyle belirleniyor
 * ve dünya haritasında işaretlenen bir noktadan okunamıyor. Aynı sebeple
 * Antarktika da yok — harita eşdikdörtgen izdüşümde kesiliyor
 * (`dunya-havuzu.ts`).
 */
export type IklimTipi =
  | 'ekvatoral'
  | 'savan'
  | 'muson'
  | 'col'
  | 'akdeniz'
  | 'okyanusal'
  | 'karasal'
  | 'step'
  | 'sert-karasal'
  | 'tundra'
  | 'kutup'

export const IKLIM_ADI: Record<IklimTipi, string> = {
  ekvatoral: 'Ekvatoral iklim',
  savan: 'Savan iklimi',
  muson: 'Muson iklimi',
  col: 'Çöl iklimi',
  akdeniz: 'Akdeniz iklimi',
  okyanusal: 'Okyanusal iklim',
  karasal: 'Ilıman karasal iklim',
  step: 'Step (yarı kurak) iklim',
  'sert-karasal': 'Sert karasal iklim',
  tundra: 'Tundra iklimi',
  kutup: 'Kutup iklimi',
}

/**
 * Şıkların çeldiricileri buradan seçiliyor — rastgele değil.
 *
 * Rastgele çeldirici soruyu çözmeden elenebilir yapardı: Grönland sorulup
 * şıklara Ekvatoral, Muson ve Savan konsaydı haritaya bakan herkes kutbu
 * seçerdi. Buradaki listeler **gerçekten karıştırılan** iklimler: aynı
 * kuşakta duran, aynı yağış rejimini paylaşan ya da sınırları birbirine
 * geçen tipler.
 */
export const KARISTIRILAN: Record<IklimTipi, IklimTipi[]> = {
  // Üçü de sıcak kuşakta ve yağışlı; ayıran şey yağışın yıla dağılışı.
  ekvatoral: ['muson', 'savan', 'okyanusal'],
  savan: ['ekvatoral', 'muson', 'step'],
  muson: ['ekvatoral', 'savan', 'okyanusal'],
  // Çölün komşusu step: ikisi de kurak, aradaki fark yağış miktarı.
  col: ['step', 'savan', 'akdeniz'],
  // Akdeniz ile okyanusal aynı enlemlerde, ikisi de deniz etkisinde.
  akdeniz: ['okyanusal', 'step', 'karasal'],
  okyanusal: ['akdeniz', 'karasal', 'sert-karasal'],
  karasal: ['step', 'okyanusal', 'sert-karasal'],
  step: ['karasal', 'col', 'akdeniz'],
  'sert-karasal': ['tundra', 'karasal', 'step'],
  // Tundra ile kutup arasındaki sınır bitki örtüsü: birinde yaz var, ötekinde yok.
  tundra: ['kutup', 'sert-karasal', 'karasal'],
  kutup: ['tundra', 'sert-karasal', 'okyanusal'],
}

export type IklimSorusu = {
  /** Ekranda okunan bölge adı. */
  ad: string
  iklim: IklimTipi
  /**
   * Haritada boyanacak ülke (ISO alpha-3) — bölge soruları için `null`.
   *
   * Ülke kodu havuzda duruyor, sınırı değil: sınır `dunya-havuzu.ts` içinde ve
   * harita yenilendiğinde kayıtla çelişmemesi gerekiyor.
   */
  ulke: string | null
  /** İşaret halkasının merkezi: [boylam, enlem]. */
  nokta: [number, number]
  /** Tur sonunda yanlışın altında görünen kısa öğretici not. */
  aciklama: string
  zorluk: Zorluk
}

/**
 * Havuz satırlarını okunur tutan kısayol.
 *
 * Zorluk başta duruyor çünkü havuzu tararken en çok bakılan alan o; `ulke`
 * kodu `null` olduğunda soru bir ülkeyi değil bir bölgeyi işaretliyor.
 */
function s(
  zorluk: Zorluk,
  ad: string,
  iklim: IklimTipi,
  ulke: string | null,
  nokta: [number, number],
  aciklama: string,
): IklimSorusu {
  return { ad, iklim, ulke, nokta, aciklama, zorluk }
}

export const IKLIM_HAVUZU: IklimSorusu[] = [
  // --- Ekvatoral: 0°–10°, yıl boyu yağışlı, sıcaklık farkı yok ---
  s(
    'kolay',
    'Kongo Havzası',
    'ekvatoral',
    'COD',
    [23, -2],
    'Ekvator üzerinde: yıl boyu yağış alır, aylık sıcaklık farkı 2–3 °C’yi geçmez. Bitki örtüsü yağmur ormanı.',
  ),
  s(
    'kolay',
    'Amazon Havzası',
    'ekvatoral',
    null,
    [-62, -4],
    'Yükselici (konveksiyonel) yağış her gün öğleden sonra düşer; dünyanın en geniş yağmur ormanı buradadır.',
  ),
  s(
    'kolay',
    'Endonezya',
    'ekvatoral',
    'IDN',
    [113, -2],
    'Ekvator adalar üzerinden geçer. Deniz etkisi de eklenince nem yıl boyu yüksek kalır.',
  ),
  s(
    'orta',
    'Malezya',
    'ekvatoral',
    'MYS',
    [102, 4],
    'Ekvatora yakın enlem + yıl boyu yağış. Muson Asya’sının içinde ama kurak mevsimi yoktur.',
  ),
  s(
    'orta',
    'Gabon',
    'ekvatoral',
    'GAB',
    [11.7, -0.8],
    'Gine Körfezi kıyısında, ekvator üzerinde: sıcaklık yıl boyu 25 °C dolayında, yağış her ay düşer.',
  ),

  // --- Muson: yaz yağışlı, kış kurak; mevsimlik yön değiştiren rüzgârlar ---
  s(
    'kolay',
    'Hindistan',
    'muson',
    'IND',
    [79, 22],
    'Yazın denizden karaya esen muson rüzgârları yağışı getirir, kışın yön değişir ve kuraklık başlar.',
  ),
  s(
    'orta',
    'Bangladeş',
    'muson',
    'BGD',
    [90, 24],
    'Dünyanın en çok yağış alan yerlerinden biri; yağışın tamamına yakını yaz musonuyla düşer.',
  ),
  s(
    'orta',
    'Vietnam',
    'muson',
    'VNM',
    [106, 16],
    'Güneydoğu Asya muson kuşağında: yazlar yağışlı ve boğucu, kışlar belirgin biçimde kurak.',
  ),
  s(
    'orta',
    'Tayland',
    'muson',
    'THA',
    [101, 15],
    'Yıllık yağışın büyük bölümü mayıs–ekim arasında düşer; kurak mevsim musonun yön değiştirmesiyle gelir.',
  ),
  s(
    'zor',
    'Çin’in güneydoğusu',
    'muson',
    null,
    [113, 25],
    'Asya’nın iç kesiminde kışın kuvvetli yüksek basınç oluşur; rüzgâr karadan denize eser ve kış kurak geçer.',
  ),

  // --- Savan: ekvatorun iki yanı, 10°–20°; yaz yağışlı, uzun kurak mevsim ---
  s(
    'orta',
    'Tanzanya',
    'savan',
    'TZA',
    [35, -6],
    'Ekvatoral kuşağın hemen dışında: yağış bir mevsimde toplanır, uzun otlarla kaplı savan örtüsü buna bağlıdır.',
  ),
  s(
    'orta',
    'Kenya',
    'savan',
    'KEN',
    [38, 0.5],
    'Ekvatordan geçmesine rağmen yükselti ve yağış rejimi ekvatoral değil savan özelliği gösterir.',
  ),
  s(
    'zor',
    'Zambiya',
    'savan',
    'ZMB',
    [27, -14],
    'Kasım–nisan arası yağışlı, kalan aylar kurak. Ekvatoral kuşakla çöl kuşağı arasındaki geçiş bölgesidir.',
  ),
  s(
    'zor',
    'Brezilya’nın orta kesimi',
    'savan',
    null,
    [-50, -15],
    'Amazon’un güneyi ekvatoral kuşağın dışında kalır: belirgin bir kurak mevsimi olan savan (campos) alanıdır.',
  ),
  s(
    'zor',
    'Venezuela’nın iç kesimi',
    'savan',
    null,
    [-67, 7],
    'Orinoco havzasının otluk düzlükleri (llanos): yazı yağışlı, kışı kurak tipik savan.',
  ),

  // --- Çöl: 30° dolayı dinamik yüksek basınç, kara içi ve soğuk su etkisi ---
  s(
    'kolay',
    'Sahra Çölü',
    'col',
    null,
    [10, 23],
    '30° kuzey dolayındaki sürekli yüksek basınç alçalıcı hava demektir: bulut oluşmaz, yağış düşmez.',
  ),
  s(
    'kolay',
    'Suudi Arabistan',
    'col',
    'SAU',
    [45, 24],
    'Dönenceler çevresindeki yüksek basınç kuşağında; günlük sıcaklık farkı nem azlığı yüzünden çok yüksektir.',
  ),
  s(
    'orta',
    'Libya',
    'col',
    'LBY',
    [17, 27],
    'Ülkenin neredeyse tamamı Sahra’nın içinde kalır; yağış yalnızca dar kıyı şeridinde görülür.',
  ),
  s(
    'orta',
    'Mısır',
    'col',
    'EGY',
    [30, 27],
    'Yerleşme Nil boyunca toplanmıştır: su akarsudan gelir, yağıştan değil.',
  ),
  s(
    'orta',
    'Avustralya’nın iç kesimi',
    'col',
    null,
    [133, -25],
    'Oğlak dönencesi kıtanın ortasından geçer; denizden uzaklık kuraklığı büsbütün artırır.',
  ),
  s(
    'zor',
    'Namib Çölü',
    'col',
    null,
    [15, -24],
    'Kıyıda olmasına rağmen çöl: soğuk Benguela akıntısı havayı alttan soğutur, yükselme ve yağış engellenir.',
  ),
  s(
    'zor',
    'Atacama Çölü',
    'col',
    null,
    [-69, -24],
    'Dünyanın en kurak yeri; soğuk Peru akıntısı ile And Dağları’nın yağış gölgesi bir aradadır.',
  ),
  s(
    'zor',
    'Kalahari',
    'col',
    null,
    [23, -23],
    'Oğlak dönencesi üzerinde, denizden uzak bir çanak: yağış çok az ve düzensizdir.',
  ),

  // --- Akdeniz: 30°–40° batı kıyıları; yaz kurak, kış yağışlı ---
  s(
    'kolay',
    'İtalya',
    'akdeniz',
    'ITA',
    [12.5, 42],
    'Yazın yüksek basıncın etkisinde kurak, kışın cephesel yağışlarla ılık ve yağışlı. Maki bu iklimin örtüsüdür.',
  ),
  s(
    'kolay',
    'Yunanistan',
    'akdeniz',
    'GRC',
    [22, 39],
    'Yağışın büyük bölümü kış aylarında düşer; yaz kuraklığı üç aydan uzun sürer.',
  ),
  s(
    'orta',
    'İspanya',
    'akdeniz',
    'ESP',
    [-3.7, 40],
    'Akdeniz ikliminin en geniş yayıldığı ülkelerden biri; iç kesimlerde karasallaşarak step görünümü alır.',
  ),
  s(
    'orta',
    'Fas’ın kuzeyi',
    'akdeniz',
    null,
    [-5.5, 34],
    'Atlas Dağları’nın kuzeyi Akdeniz’e bakar: kış yağışlı, yaz kurak. Dağların güneyinde Sahra başlar.',
  ),
  s(
    'zor',
    'Kaliforniya kıyıları',
    'akdeniz',
    null,
    [-121, 36],
    'Akdeniz iklimi bir denizin değil bir **enlem ve konumun** sonucu: 30–40° arası kıtaların batı kıyıları.',
  ),
  s(
    'zor',
    'Şili’nin orta kesimi',
    'akdeniz',
    null,
    [-71, -34],
    'Güney yarım kürede 30–40° arası batı kıyısı: yağış haziran–ağustos (orada kış) aylarında düşer.',
  ),
  s(
    'zor',
    'Güney Afrika’nın güneybatısı',
    'akdeniz',
    null,
    [19, -34],
    'Kap bölgesi güney yarım kürenin Akdeniz iklim alanıdır; üzüm bağları bu yüzden buradadır.',
  ),
  s(
    'zor',
    'Avustralya’nın güneybatısı',
    'akdeniz',
    null,
    [116, -32],
    'Kıtanın iç kesimi çölken güneybatı köşesi Akdeniz iklimindedir: kışın batıdan gelen cepheler yağış bırakır.',
  ),

  // --- Okyanusal: 40°–60° batı kıyıları, yıl boyu yağış, düşük sıcaklık farkı ---
  s(
    'kolay',
    'Birleşik Krallık',
    'okyanusal',
    'GBR',
    [-2, 53],
    'Batıdan gelen nemli hava ve sıcak Gulf Stream: yağış her mevsim düşer, kışlar enlemine göre ılıktır.',
  ),
  s(
    'kolay',
    'İrlanda',
    'okyanusal',
    'IRL',
    [-8, 53],
    'Yıllık sıcaklık farkı 10 °C’yi bulmaz; çayır örtüsü ve hayvancılık bu iklimin sonucudur.',
  ),
  s(
    'orta',
    'Hollanda',
    'okyanusal',
    'NLD',
    [5.5, 52],
    'Kuzey Denizi kıyısında, 50° kuzeyde: yıl boyu yağışlı, kışları donsuz geçen ılıman kıyı iklimi.',
  ),
  s(
    'orta',
    'Yeni Zelanda',
    'okyanusal',
    'NZL',
    [172, -42],
    'Güney yarım kürenin batı rüzgârları kuşağında bir ada ülkesi: her mevsim yağışlı, sıcaklık farkı düşük.',
  ),
  s(
    'zor',
    'Norveç’in batı kıyıları',
    'okyanusal',
    null,
    [6, 61],
    '60° kuzeyde olmasına rağmen limanları donmaz: sıcak su akıntısı ve batı rüzgârları kıyıyı ısıtır.',
  ),
  s(
    'zor',
    'Şili’nin güneyi',
    'okyanusal',
    null,
    [-73, -45],
    'And Dağları’nın batı yamacı yıl boyu batı rüzgârlarına açıktır; yağış dünyanın en yükseklerindendir.',
  ),

  // --- Ilıman karasal: denizden uzak orta enlemler ---
  s(
    'orta',
    'Ukrayna',
    'karasal',
    'UKR',
    [31, 49],
    'Deniz etkisinden uzak düzlükler: yazlar sıcak, kışlar soğuk, yağış en çok ilkbahar–yaz başında.',
  ),
  s(
    'orta',
    'Polonya',
    'karasal',
    'POL',
    [19, 52],
    'Batıya doğru okyanusal etki artar, doğuya doğru karasallaşır; kışlar Batı Avrupa’dan belirgin soğuktur.',
  ),
  s(
    'zor',
    'Macaristan',
    'karasal',
    'HUN',
    [19.5, 47],
    'Etrafı dağlarla çevrili bir havza: denizden gelen nem içeri giremez, yıllık sıcaklık farkı büyür.',
  ),

  // --- Step: karasal iklimin kurak yüzü, çölle ılıman arası ---
  s(
    'kolay',
    'İç Anadolu',
    'step',
    null,
    [33, 39],
    'Etrafı dağlarla çevrili, yağışı 400 mm dolayında: ağaç yetişmez, kısa boylu ot (bozkır) örtüsü görülür.',
  ),
  s(
    'orta',
    'Kazakistan',
    'step',
    'KAZ',
    [67, 48],
    'Dünyanın denize en uzak alanlarından biri; yağış azlığı yüzünden orman değil bozkır görülür.',
  ),
  s(
    'orta',
    'Moğolistan',
    'step',
    'MNG',
    [104, 46],
    'Kışın Sibirya yüksek basıncı altında kalır; yağış çok az, sıcaklık farkı çok yüksektir.',
  ),
  s(
    'zor',
    'ABD’nin Büyük Ovaları',
    'step',
    null,
    [-100, 40],
    'Kayalık Dağları’nın yağış gölgesinde kalan uzun otlu düzlükler (prairie): yarı kurak bir geçiş alanıdır.',
  ),

  // --- Sert karasal: yüksek enlem karaları, tayga kuşağı ---
  s(
    'kolay',
    'Sibirya',
    'sert-karasal',
    null,
    [95, 62],
    'Kışlar −40 °C’ye inebilir, yaz kısadır. İğne yapraklı orman (tayga) bu iklimin örtüsüdür.',
  ),
  s(
    'orta',
    'Kanada’nın iç kesimleri',
    'sert-karasal',
    null,
    [-105, 55],
    'Yüksek enlem + denizden uzaklık: donlu gün sayısı çok fazla, yağış ise ılıman kuşaktan azdır.',
  ),
  s(
    'orta',
    'Finlandiya',
    'sert-karasal',
    'FIN',
    [26, 63],
    'Deniz kıyısında olmasına rağmen kışlar uzun ve çok soğuk; kuzeye gidildikçe tayga tundraya bırakır.',
  ),

  // --- Tundra ve kutup: 60°/70° kuzeyi ---
  s(
    'orta',
    'Alaska’nın kuzeyi',
    'tundra',
    null,
    [-152, 70],
    'Kutup dairesinin kuzeyi: toprak yılın büyük bölümünde donmuş (permafrost), yalnızca yaz aylarında yüzeyi çözülür.',
  ),
  s(
    'orta',
    'Rusya’nın kuzey kıyıları',
    'tundra',
    null,
    [95, 72],
    'Ağaç yetişmez, yosun ve likenlerden oluşan kısa bir örtü vardır; ortalama sıcaklık yazın bile 10 °C’yi geçmez.',
  ),
  s(
    'zor',
    'Kanada’nın kuzey adaları',
    'tundra',
    null,
    [-95, 73],
    'Kutup ile tundrayı ayıran şey yazdır: burada kısa da olsa bir yaz ve buzsuz bir yüzey vardır.',
  ),
  s(
    'kolay',
    'Grönland',
    'kutup',
    'GRL',
    [-42, 72],
    'Yüzeyi kalın buzullarla kaplı: sıcaklık yılın tamamına yakınında donma noktasının altındadır, bitki örtüsü yoktur.',
  ),
]
