/**
 * Ses Olayları oyununun kelime havuzu.
 *
 * Her satır bir sözcük ve içindeki **tek** ses olayı. Tek olması şart: oyun
 * dört şık gösterip birini doğru sayıyor, sözcükte iki olay birden olsaydı
 * ikinci şıkkı işaretleyen haksız yere yanlış olurdu.
 *
 * Bu yüzden bilerek dışarıda bırakılan sözcükler var:
 * - *tıbbı* (p→b yumuşaması **ve** ünsüz türemesi),
 * - *gideceğim* (t→d ve k→ğ, iki yumuşama bir arada sayılıyor),
 * - *gencecik* (ünlü türemesi ama ç→c değişimi de tartışmalı),
 * - *niçin* (ünlü daralması mı hece düşmesi mi, kaynaklar ayrışıyor).
 *
 * "Hece düşmesi" ayrı bir şık değil: müfredatta çoğunlukla ünlü düşmesinin
 * altında anlatılıyor ve ayrı şık yapılsaydı *kahvaltı* için iki doğru cevap
 * çıkardı. `kahvaltı`, `cumartesi` gibi örnekler ünlü düşmesi sayılıyor.
 */

export type SesOlayi =
  | 'yumusama'
  | 'benzesme'
  | 'unluDusmesi'
  | 'unluDaralmasi'
  | 'unsuzTuremesi'
  | 'unluTuremesi'
  | 'kaynastirma'
  | 'unsuzDusmesi'

export type SesSorusu = {
  /** Ses olayının görüldüğü sözcük — ekranda büyük yazılan. */
  kelime: string
  /** Nasıl oluştuğu: "kitap + ı". Şıkların üstünde ipucu olarak duruyor. */
  olusum: string
  olay: SesOlayi
}

/** Şıklarda görünen ad. */
export const OLAY_ADI: Record<SesOlayi, string> = {
  yumusama: 'Ünsüz yumuşaması',
  benzesme: 'Ünsüz benzeşmesi',
  unluDusmesi: 'Ünlü düşmesi',
  unluDaralmasi: 'Ünlü daralması',
  unsuzTuremesi: 'Ünsüz türemesi',
  unluTuremesi: 'Ünlü türemesi',
  kaynastirma: 'Kaynaştırma',
  unsuzDusmesi: 'Ünsüz düşmesi',
}

/** Tur sonunda, yanlış bilinen sözcüğün altında görünen kural. */
export const OLAY_ACIKLAMASI: Record<SesOlayi, string> = {
  yumusama:
    'Sonu p, ç, t, k ile biten sözcük ünlüyle başlayan ek alınca bu sesler b, c, d, ğ/g olur.',
  benzesme:
    'Sert ünsüzle (f, s, t, k, ç, ş, h, p) biten sözcüğe gelen ekin c, d, g sesi ç, t, k olur.',
  unluDusmesi:
    'İki heceli sözcük ünlüyle başlayan ek alınca ikinci hecedeki dar ünlü düşer.',
  unluDaralmasi:
    'Sonu a, e ile biten fiil “-yor” eki alınca bu ünlü ı, i, u, ü olarak daralır.',
  unsuzTuremesi:
    'Tek heceli Arapça kökenli bazı sözcükler ünlüyle başlayan ek ya da yardımcı fiil alınca son ünsüzünü ikizler.',
  unluTuremesi:
    'Pekiştirme ve küçültmede sözcüğün içinde olmayan bir ünlü türer.',
  kaynastirma:
    'İki ünlü yan yana gelmesin diye araya y, ş, s, n kaynaştırma ünsüzlerinden biri girer.',
  unsuzDusmesi:
    'Sonu k ile biten sözcük küçültme eki ya da “-l-” alınca bu k düşer.',
}

/** Havuzu okunur tutmak için: bir olaya ait bütün örnekler tek yerde. */
function grup(olay: SesOlayi, ornekler: [string, string][]): SesSorusu[] {
  return ornekler.map(([kelime, olusum]) => ({ kelime, olusum, olay }))
}

export const SES_HAVUZU: readonly SesSorusu[] = [
  ...grup('yumusama', [
    ['kitabı', 'kitap + ı'],
    ['ağacı', 'ağaç + ı'],
    ['kanadı', 'kanat + ı'],
    ['rengi', 'renk + i'],
    ['dolabı', 'dolap + ı'],
    ['ilacı', 'ilaç + ı'],
    ['kâğıdı', 'kâğıt + ı'],
    ['çocuğu', 'çocuk + u'],
    ['yurdu', 'yurt + u'],
    ['armudu', 'armut + u'],
    ['kepengi', 'kepenk + i'],
    ['damadı', 'damat + ı'],
    ['bileği', 'bilek + i'],
    ['sokağı', 'sokak + ı'],
    ['ucu', 'uç + u'],
    ['geçidi', 'geçit + i'],
    ['şarabı', 'şarap + ı'],
    ['küreği', 'kürek + i'],
    ['tarağı', 'tarak + ı'],
    ['balığı', 'balık + ı'],
  ]),

  ...grup('benzesme', [
    ['kitapta', 'kitap + da'],
    ['seçki', 'seç + gi'],
    ['aşçı', 'aş + cı'],
    ['gitti', 'git + di'],
    ['sabahtan', 'sabah + dan'],
    ['çiçekten', 'çiçek + den'],
    ['dolaptan', 'dolap + dan'],
    ['Türkçe', 'Türk + ce'],
    ['simitçi', 'simit + ci'],
    ['baskı', 'bas + gı'],
    ['düşkün', 'düş + gün'],
    ['keskin', 'kes + gin'],
    ['ihtiyaçtan', 'ihtiyaç + dan'],
    ['yavaşça', 'yavaş + ca'],
    ['sanatçı', 'sanat + cı'],
    ['kaçtı', 'kaç + dı'],
    ['topçu', 'top + cu'],
    ['ağaçtan', 'ağaç + dan'],
  ]),

  ...grup('unluDusmesi', [
    ['burnu', 'burun + u'],
    ['ağzı', 'ağız + ı'],
    ['oğlu', 'oğul + u'],
    ['gönlü', 'gönül + ü'],
    ['beyni', 'beyin + i'],
    ['şehri', 'şehir + i'],
    ['aklı', 'akıl + ı'],
    ['boynu', 'boyun + u'],
    ['karnı', 'karın + ı'],
    ['omzu', 'omuz + u'],
    ['göğsü', 'göğüs + ü'],
    ['alnı', 'alın + ı'],
    ['resmi', 'resim + i'],
    ['fikri', 'fikir + i'],
    ['kahvaltı', 'kahve + altı'],
    ['cumartesi', 'cuma + ertesi'],
    ['sararmak', 'sarı + armak'],
    ['ilerlemek', 'ileri + lemek'],
    ['devrim', 'devir + im'],
    ['sıyrık', 'sıyır + ık'],
    ['kıvrım', 'kıvır + ım'],
  ]),

  ...grup('unluDaralmasi', [
    ['bekliyor', 'bekle + yor'],
    ['diyor', 'de + yor'],
    ['yiyor', 'ye + yor'],
    ['anlıyor', 'anla + yor'],
    ['başlıyor', 'başla + yor'],
    ['söylüyor', 'söyle + yor'],
    ['diye', 'de + e'],
    ['yiyen', 'ye + en'],
    ['kokluyor', 'kokla + yor'],
    ['atlıyor', 'atla + yor'],
    ['gizliyor', 'gizle + yor'],
    ['oynuyor', 'oyna + yor'],
    ['izliyor', 'izle + yor'],
    ['topluyor', 'topla + yor'],
    ['özlüyor', 'özle + yor'],
    ['uğruyor', 'uğra + yor'],
  ]),

  ...grup('unsuzTuremesi', [
    ['hissetmek', 'his + etmek'],
    ['affetmek', 'af + etmek'],
    ['zannetmek', 'zan + etmek'],
    ['hakkı', 'hak + ı'],
    ['reddetmek', 'ret + etmek'],
    ['sırrı', 'sır + ı'],
    ['hattı', 'hat + ı'],
    ['şıkkı', 'şık + ı'],
    ['haddi', 'had + i'],
    ['zannı', 'zan + ı'],
    ['hallolmak', 'hal + olmak'],
    ['hakkında', 'hak + ında'],
  ]),

  ...grup('unluTuremesi', [
    ['biricik', 'bir + cik'],
    ['azıcık', 'az + cık'],
    ['daracık', 'dar + cık'],
    ['gülücük', 'gül + cük'],
    ['sapasağlam', 'sağlam + pekiştirme'],
    ['güpegündüz', 'gündüz + pekiştirme'],
    ['çepeçevre', 'çevre + pekiştirme'],
    ['yapayalnız', 'yalnız + pekiştirme'],
    ['düpedüz', 'düz + pekiştirme'],
  ]),

  ...grup('kaynastirma', [
    ['babası', 'baba + ı'],
    ['arabaya', 'araba + a'],
    ['ikişer', 'iki + er'],
    ['yedişer', 'yedi + er'],
    ['masanın', 'masa + ın'],
    ['kapısı', 'kapı + ı'],
    ['elmayı', 'elma + ı'],
    ['altışar', 'altı + ar'],
    ['pencereye', 'pencere + e'],
    ['bahçenin', 'bahçe + in'],
    ['suyu', 'su + u'],
    ['odası', 'oda + ı'],
    ['ütüsü', 'ütü + ü'],
    ['kediye', 'kedi + e'],
    ['sürüsü', 'sürü + ü'],
    ['yirmişer', 'yirmi + er'],
  ]),

  ...grup('unsuzDusmesi', [
    ['küçücük', 'küçük + cük'],
    ['ufacık', 'ufak + cık'],
    ['alçacık', 'alçak + cık'],
    ['minicik', 'minik + cik'],
    ['sıcacık', 'sıcak + cık'],
    ['yumuşacık', 'yumuşak + cık'],
    ['büyücek', 'büyük + cek'],
    ['yükselmek', 'yüksek + l + mek'],
    ['küçülmek', 'küçük + l + mek'],
    ['alçalmak', 'alçak + l + mak'],
    ['ufalmak', 'ufak + l + mak'],
    ['seyrelmek', 'seyrek + l + mek'],
    ['çabucak', 'çabuk + cak'],
  ]),
] as const

export const SES_BOYUTU = SES_HAVUZU.length
