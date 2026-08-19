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
 * - *niçin* (ünlü daralması mı hece düşmesi mi, kaynaklar ayrışıyor),
 * - *zıddı*, *reddi* (t→d yumuşaması **ve** ikizleşme),
 * - *küçümsemek* (k düşmesi ve ünlü düşmesi bir arada),
 * - *çoğalmak* (k düşer mi ğ'ye mi yumuşar, kaynaklar ayrışıyor),
 * - *çırılçıplak*, *sırılsıklam* (türeyen ses yalnız ünlü mü, tartışmalı).
 *
 * "Hece düşmesi" ayrı bir şık değil: müfredatta çoğunlukla ünlü düşmesinin
 * altında anlatılıyor ve ayrı şık yapılsaydı *kahvaltı* için iki doğru cevap
 * çıkardı. `kahvaltı`, `cumartesi` gibi örnekler ünlü düşmesi sayılıyor.
 */

import type { Zorluk } from './ritim'

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
  /**
   * Nasıl oluştuğu: "kitap + ı".
   *
   * Soruda **gösterilmiyor**: kökü yan yana koymak olayı doğrudan ele veriyor
   * ("burun + u" ünlü düşmesini, "his + etmek" ünsüz türemesini okutuyor).
   * Cevaptan sonra geri bildirimde ve tur sonu listesinde çıkıyor.
   */
  olusum: string
  olay: SesOlayi
  /**
   * Zorluk.
   *
   * Taban zorluk ses olayının kendisinden geliyor — ünsüz yumuşaması
   * müfredatın en erken ve en tanıdık konusu, ünsüz türemesi en geç ve en az
   * bilineni. Grup içindeki sapmalar tek tek işaretli: `rengi` yumuşamadır
   * ama k→g istisnası yüzünden `kitabı`dan zordur.
   */
  zorluk: Zorluk
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

/**
 * Havuzu okunur tutmak için: bir olaya ait bütün örnekler tek yerde.
 *
 * `taban` grubun zorluğu; bir örnek üçüncü eleman verirse onunki geçerli.
 * Böylece 225 satırın her birine zorluk yazmak gerekmiyor, yalnızca gruptan
 * ayrılanlar işaretleniyor — ve ayrıldıkları göze çarpıyor.
 */
function grup(
  olay: SesOlayi,
  taban: Zorluk,
  ornekler: ([string, string] | [string, string, Zorluk])[],
): SesSorusu[] {
  return ornekler.map(([kelime, olusum, zorluk]) => ({
    kelime,
    olusum,
    olay,
    zorluk: zorluk ?? taban,
  }))
}

export const SES_HAVUZU: readonly SesSorusu[] = [
  ...grup('yumusama', 'kolay', [
    ['kitabı', 'kitap + ı'],
    ['ağacı', 'ağaç + ı'],
    ['kanadı', 'kanat + ı'],
    ['rengi', 'renk + i', 'orta'],
    ['dolabı', 'dolap + ı'],
    ['ilacı', 'ilaç + ı'],
    ['kâğıdı', 'kâğıt + ı'],
    ['çocuğu', 'çocuk + u'],
    ['yurdu', 'yurt + u'],
    ['armudu', 'armut + u'],
    ['kepengi', 'kepenk + i', 'orta'],
    ['damadı', 'damat + ı', 'orta'],
    ['bileği', 'bilek + i'],
    ['sokağı', 'sokak + ı'],
    ['ucu', 'uç + u', 'orta'],
    ['geçidi', 'geçit + i', 'orta'],
    ['şarabı', 'şarap + ı'],
    ['küreği', 'kürek + i'],
    ['tarağı', 'tarak + ı'],
    ['balığı', 'balık + ı'],
    ['ekmeği', 'ekmek + i'],
    ['yaprağı', 'yaprak + ı'],
    ['toprağı', 'toprak + ı'],
    ['bardağı', 'bardak + ı'],
    ['yatağı', 'yatak + ı'],
    ['köpeği', 'köpek + i'],
    ['bebeği', 'bebek + i'],
    ['çorabı', 'çorap + ı'],
    ['cevabı', 'cevap + ı'],
    ['hesabı', 'hesap + ı'],
    ['amacı', 'amaç + ı'],
    ['sebebi', 'sebep + i'],
    ['ümidi', 'ümit + i', 'orta'],
    ['senedi', 'senet + i', 'orta'],
    ['kilidi', 'kilit + i', 'orta'],
    ['tadı', 'tat + ı', 'orta'],
    ['yoğurdu', 'yoğurt + u', 'orta'],
    ['gencin', 'genç + in', 'orta'],
    ['ahengi', 'ahenk + i', 'zor'],
    ['dengi', 'denk + i', 'zor'],
    ['öğüdü', 'öğüt + ü', 'zor'],
  ]),

  ...grup('benzesme', 'orta', [
    ['kitapta', 'kitap + da', 'kolay'],
    ['seçki', 'seç + gi', 'zor'],
    ['aşçı', 'aş + cı'],
    ['gitti', 'git + di', 'kolay'],
    ['sabahtan', 'sabah + dan', 'kolay'],
    ['çiçekten', 'çiçek + den', 'kolay'],
    ['dolaptan', 'dolap + dan', 'kolay'],
    ['Türkçe', 'Türk + ce'],
    ['simitçi', 'simit + ci'],
    ['baskı', 'bas + gı', 'zor'],
    ['düşkün', 'düş + gün', 'zor'],
    ['keskin', 'kes + gin', 'zor'],
    ['ihtiyaçtan', 'ihtiyaç + dan', 'kolay'],
    ['yavaşça', 'yavaş + ca'],
    ['sanatçı', 'sanat + cı'],
    ['kaçtı', 'kaç + dı', 'kolay'],
    ['topçu', 'top + cu'],
    ['ağaçtan', 'ağaç + dan', 'kolay'],
    ['yaptı', 'yap + dı', 'kolay'],
    ['baktı', 'bak + dı', 'kolay'],
    ['seçti', 'seç + di', 'kolay'],
    ['kuştan', 'kuş + dan', 'kolay'],
    ['ipten', 'ip + den', 'kolay'],
    ['sokaktan', 'sokak + dan', 'kolay'],
    ['işçi', 'iş + ci'],
    ['sütçü', 'süt + cü'],
    ['balıkçı', 'balık + cı'],
    ['kitapçı', 'kitap + cı'],
    ['saatçi', 'saat + ci'],
    ['çöpçü', 'çöp + cü'],
    ['bitki', 'bit + gi', 'zor'],
    ['içki', 'iç + gi', 'zor'],
    ['coşku', 'coş + gu', 'zor'],
    ['yatkın', 'yat + gın', 'zor'],
  ]),

  ...grup('unluDusmesi', 'kolay', [
    ['burnu', 'burun + u'],
    ['ağzı', 'ağız + ı'],
    ['oğlu', 'oğul + u'],
    ['gönlü', 'gönül + ü'],
    ['beyni', 'beyin + i'],
    ['şehri', 'şehir + i', 'orta'],
    ['aklı', 'akıl + ı', 'orta'],
    ['boynu', 'boyun + u'],
    ['karnı', 'karın + ı'],
    ['omzu', 'omuz + u'],
    ['göğsü', 'göğüs + ü'],
    ['alnı', 'alın + ı'],
    ['resmi', 'resim + i', 'orta'],
    ['fikri', 'fikir + i', 'orta'],
    ['kahvaltı', 'kahve + altı', 'zor'],
    ['cumartesi', 'cuma + ertesi', 'zor'],
    ['sararmak', 'sarı + armak', 'zor'],
    ['ilerlemek', 'ileri + lemek', 'zor'],
    ['devrim', 'devir + im', 'zor'],
    ['sıyrık', 'sıyır + ık', 'zor'],
    ['kıvrım', 'kıvır + ım', 'zor'],
    ['ismi', 'isim + i', 'orta'],
    ['emri', 'emir + i', 'orta'],
    ['nehri', 'nehir + i', 'orta'],
    ['zehri', 'zehir + i', 'orta'],
    ['sabrı', 'sabır + ı', 'orta'],
    ['ömrü', 'ömür + ü', 'orta'],
    ['hükmü', 'hüküm + ü', 'orta'],
    ['kısmı', 'kısım + ı', 'orta'],
    ['asrı', 'asır + ı', 'zor'],
    ['bağrı', 'bağır + ı', 'zor'],
    ['pazartesi', 'pazar + ertesi', 'zor'],
    ['kaynana', 'kayın + ana', 'zor'],
    ['yumurtlamak', 'yumurta + lamak', 'zor'],
    ['sızlamak', 'sızı + lamak', 'zor'],
  ]),

  ...grup('unluDaralmasi', 'kolay', [
    ['bekliyor', 'bekle + yor'],
    ['diyor', 'de + yor', 'orta'],
    ['yiyor', 'ye + yor', 'orta'],
    ['anlıyor', 'anla + yor'],
    ['başlıyor', 'başla + yor'],
    ['söylüyor', 'söyle + yor'],
    ['diye', 'de + e', 'zor'],
    ['yiyen', 'ye + en', 'zor'],
    ['kokluyor', 'kokla + yor'],
    ['atlıyor', 'atla + yor'],
    ['gizliyor', 'gizle + yor'],
    ['oynuyor', 'oyna + yor'],
    ['izliyor', 'izle + yor'],
    ['topluyor', 'topla + yor'],
    ['özlüyor', 'özle + yor'],
    ['uğruyor', 'uğra + yor'],
    ['ağlıyor', 'ağla + yor'],
    ['bağlıyor', 'bağla + yor'],
    ['saklıyor', 'sakla + yor'],
    ['dinliyor', 'dinle + yor'],
    ['temizliyor', 'temizle + yor'],
    ['kapıyor', 'kapa + yor'],
    ['okşuyor', 'okşa + yor'],
    ['gelmiyor', 'gelme + yor', 'orta'],
    ['bakmıyor', 'bakma + yor', 'orta'],
    ['diyerek', 'de + erek', 'zor'],
    ['diyecek', 'de + ecek', 'zor'],
    ['yiyecek', 'ye + ecek', 'zor'],
  ]),

  ...grup('unsuzTuremesi', 'zor', [
    ['hissetmek', 'his + etmek', 'orta'],
    ['affetmek', 'af + etmek', 'orta'],
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
    ['hissi', 'his + i', 'orta'],
    ['affı', 'af + ı', 'orta'],
    ['affa', 'af + a', 'orta'],
    ['zammı', 'zam + ı', 'orta'],
    ['zamma', 'zam + a', 'orta'],
    ['sırra', 'sır + a', 'orta'],
    ['hakka', 'hak + a', 'orta'],
    ['hazzı', 'haz + ı'],
    ['hazza', 'haz + a'],
    ['hazzetmek', 'haz + etmek'],
    ['halletmek', 'hal + etmek'],
    ['fenni', 'fen + i'],
    ['hacca', 'hac + a'],
    ['şerri', 'şer + i'],
  ]),

  ...grup('unluTuremesi', 'zor', [
    ['biricik', 'bir + cik'],
    ['azıcık', 'az + cık'],
    ['daracık', 'dar + cık'],
    ['gülücük', 'gül + cük'],
    ['sapasağlam', 'sağlam + pekiştirme', 'orta'],
    ['güpegündüz', 'gündüz + pekiştirme', 'orta'],
    ['çepeçevre', 'çevre + pekiştirme', 'orta'],
    ['yapayalnız', 'yalnız + pekiştirme', 'orta'],
    ['düpedüz', 'düz + pekiştirme', 'orta'],
    ['apaçık', 'açık + pekiştirme', 'orta'],
    ['apayrı', 'ayrı + pekiştirme', 'orta'],
    ['upuzun', 'uzun + pekiştirme', 'orta'],
    ['paramparça', 'parça + pekiştirme', 'orta'],
    ['gepegenç', 'genç + pekiştirme', 'orta'],
    ['apansız', 'ansız + pekiştirme', 'orta'],
  ]),

  ...grup('kaynastirma', 'kolay', [
    ['babası', 'baba + ı'],
    ['arabaya', 'araba + a'],
    ['ikişer', 'iki + er', 'orta'],
    ['yedişer', 'yedi + er', 'orta'],
    ['masanın', 'masa + ın'],
    ['kapısı', 'kapı + ı'],
    ['elmayı', 'elma + ı'],
    ['altışar', 'altı + ar', 'orta'],
    ['pencereye', 'pencere + e'],
    ['bahçenin', 'bahçe + in'],
    ['suyu', 'su + u', 'orta'],
    ['odası', 'oda + ı'],
    ['ütüsü', 'ütü + ü'],
    ['kediye', 'kedi + e'],
    ['sürüsü', 'sürü + ü'],
    ['yirmişer', 'yirmi + er', 'orta'],
    ['annesi', 'anne + i'],
    ['çantası', 'çanta + ı'],
    ['perdeyi', 'perde + i'],
    ['tarlaya', 'tarla + a'],
    ['köprüsü', 'köprü + ü'],
    ['ablası', 'abla + ı'],
    ['sıranın', 'sıra + ın'],
    ['kapıya', 'kapı + a'],
    ['sorusu', 'soru + u', 'orta'],
  ]),

  ...grup('unsuzDusmesi', 'orta', [
    ['küçücük', 'küçük + cük'],
    ['ufacık', 'ufak + cık'],
    ['alçacık', 'alçak + cık'],
    ['minicik', 'minik + cik'],
    ['sıcacık', 'sıcak + cık'],
    ['yumuşacık', 'yumuşak + cık'],
    ['büyücek', 'büyük + cek', 'zor'],
    ['yükselmek', 'yüksek + l + mek', 'zor'],
    ['küçülmek', 'küçük + l + mek', 'zor'],
    ['alçalmak', 'alçak + l + mak', 'zor'],
    ['ufalmak', 'ufak + l + mak', 'zor'],
    ['seyrelmek', 'seyrek + l + mek', 'zor'],
    ['çabucak', 'çabuk + cak', 'zor'],
    ['ıslacık', 'ıslak + cık'],
    ['küçültmek', 'küçük + l + t + mek', 'zor'],
    ['alçaltmak', 'alçak + l + t + mak', 'zor'],
    ['ufaltmak', 'ufak + l + t + mak', 'zor'],
    ['yükseltmek', 'yüksek + l + t + mek', 'zor'],
    ['seyreltmek', 'seyrek + l + t + mek', 'zor'],
    ['ufalamak', 'ufak + la + mak', 'zor'],
    ['yükselti', 'yüksek + l + ti', 'zor'],
  ]),
] as const

export const SES_BOYUTU = SES_HAVUZU.length
