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
 * Böylece 425 satırın her birine zorluk yazmak gerekmiyor, yalnızca gruptan
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

    // Gövde sonundaki p, ç, t, k ünlüyle başlayan ekten önce b, c, d, ğ oluyor.
    // Kökü günlük dilden tanıdık olan örnekler burada: öğrenci sözcüğün yalın
    // hâlini zaten biliyor, değişimi karşılaştırarak görüyor.
    ['kabı', 'kap + ı'],
    ['cebi', 'cep + i'],
    ['mektubu', 'mektup + u'],
    ['kulübü', 'kulüp + ü'],
    ['bıçağı', 'bıçak + ı'],
    ['ayağı', 'ayak + ı'],
    ['kulağı', 'kulak + ı'],
    ['dudağı', 'dudak + ı'],
    ['durağı', 'durak + ı'],
    ['oyuncağı', 'oyuncak + ı'],
    ['çiçeği', 'çiçek + i'],
    ['gerçeği', 'gerçek + i'],
    ['dileği', 'dilek + i'],
    ['emeği', 'emek + i'],
    ['örneği', 'örnek + i'],
    ['gömleği', 'gömlek + i'],
    ['kelebeği', 'kelebek + i'],
    ['erkeği', 'erkek + i'],
    ['yemeği', 'yemek + i'],
    ['tabağı', 'tabak + ı'],
    ['kapağı', 'kapak + ı'],
    ['kabuğu', 'kabuk + u'],
    ['kılıcı', 'kılıç + ı'],
    ['borcu', 'borç + u'],
    // Kök tek heceli ya da alıntı olunca yalın hâli akla geç geliyor
    // (*güç* → *gücü*), bu yüzden aynı kural bir kademe zorlaşıyor.
    ['dibi', 'dip + i', 'orta'],
    ['sahibi', 'sahip + i', 'orta'],
    ['dördü', 'dört + ü', 'orta'],
    ['umudu', 'umut + u', 'orta'],
    ['vücudu', 'vücut + u', 'orta'],
    ['inadı', 'inat + ı', 'orta'],
    ['cildi', 'cilt + i', 'orta'],
    ['tacı', 'taç + ı', 'orta'],
    ['gücü', 'güç + ü', 'orta'],
    ['burcu', 'burç + u', 'orta'],
    ['sonucu', 'sonuç + u', 'orta'],
    ['kurdu', 'kurt + u', 'orta'],
    ['ihtiyacı', 'ihtiyaç + ı', 'orta'],
    ['kirpiği', 'kirpik + i', 'orta'],
    // En zor uç: k → g istisnası (nk ile bitenler *rengi* gibi ğ değil g olur)
    // ve günlük dilde seyrek geçen alıntılar.
    ['cengi', 'cenk + i', 'zor'],
    ['çelengi', 'çelenk + i', 'zor'],
    ['söğüdü', 'söğüt + ü', 'zor'],
    ['kalbi', 'kalp + i', 'zor'],
    ['nasibi', 'nasip + i', 'zor'],
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

    // Görme biçimi en kolay olan grup: ekin d'si t'ye dönüyor ve kök gözle
    // ayrılıyor. Ünlü uyumu dışında hiçbir şey değişmediği için kolay.
    ['koştu', 'koş + du', 'kolay'],
    ['içti', 'iç + di', 'kolay'],
    ['bastı', 'bas + dı', 'kolay'],
    ['kesti', 'kes + di', 'kolay'],
    ['düştü', 'düş + dü', 'kolay'],
    ['uçtu', 'uç + du', 'kolay'],
    ['çıktı', 'çık + dı', 'kolay'],
    ['geçti', 'geç + di', 'kolay'],
    ['açtı', 'aç + dı', 'kolay'],
    ['taştan', 'taş + dan', 'kolay'],
    ['ipekten', 'ipek + den', 'kolay'],
    ['sınıfta', 'sınıf + da', 'kolay'],
    ['hesaptan', 'hesap + dan', 'kolay'],
    // c → ç grubu: ek yazıda hiç görünmediği için öğrenci ekin aslını
    // hatırlamak zorunda, bu yüzden bir kademe yukarıda.
    ['çiftçi', 'çift + ci'],
    ['dişçi', 'diş + ci'],
    ['gözlükçü', 'gözlük + cü'],
    ['sepetçi', 'sepet + ci'],
    ['halkçı', 'halk + cı'],
    ['yenilikçi', 'yenilik + ci'],
    ['Rusça', 'Rus + ca'],
    ['Arapça', 'Arap + ca'],
    ['çocukça', 'çocuk + ca'],
    ['alçakça', 'alçak + ca'],
    ['açıkça', 'açık + ca'],
    ['genişçe', 'geniş + ce'],
    ['hafifçe', 'hafif + ce'],
    // g → k en zoru: türemiş sözcük kalıplaşmış, ek artık ek gibi durmuyor
    // (*tutku*yu duyan *tut- + -gu* diye çözmüyor).
    ['tutku', 'tut + gu', 'zor'],
    ['atkı', 'at + gı', 'zor'],
    ['askı', 'as + gı', 'zor'],
    ['bıkkın', 'bık + gın', 'zor'],
    ['kaçkın', 'kaç + gın', 'zor'],
    ['şaşkın', 'şaş + gın', 'zor'],
    ['küskün', 'küs + gün', 'zor'],
    ['bitkin', 'bit + gin', 'zor'],
    ['yetkin', 'yet + gin', 'zor'],
    ['geçkin', 'geç + gin', 'zor'],
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

    // Türkçe kökenli, gövdesi günlük dilde tek başına geçen örnekler.
    ['koynu', 'koyun + u'],
    ['oğlan', 'oğul + an'],
    // Arapça alıntıların büyük bölümü bu kalıpta: iki heceli yalın hâlin dar
    // ünlüsü ek gelince düşüyor. Yalın hâli bilinmezse olay görünmüyor.
    ['genzi', 'geniz + i', 'orta'],
    ['şükrü', 'şükür + ü', 'orta'],
    ['kahrı', 'kahır + ı', 'orta'],
    ['vakti', 'vakit + i', 'orta'],
    ['şahsı', 'şahıs + ı', 'orta'],
    ['nesli', 'nesil + i', 'orta'],
    ['nakli', 'nakil + i', 'orta'],
    ['seyri', 'seyir + i', 'orta'],
    ['hüznü', 'hüzün + ü', 'orta'],
    ['keşfi', 'keşif + i', 'orta'],
    ['nutku', 'nutuk + u', 'orta'],
    ['şekli', 'şekil + i', 'orta'],
    ['hapsi', 'hapis + i', 'orta'],
    ['nabzı', 'nabız + ı', 'orta'],
    ['cismi', 'cisim + i', 'orta'],
    // Zor uç: ya sözcük artık kalıplaşmış (*uyku*, *nasıl*, *yanlış*) ya da
    // yalın hâli yazı dilinde neredeyse hiç geçmiyor.
    ['benzi', 'beniz + i', 'zor'],
    ['faslı', 'fasıl + ı', 'zor'],
    ['kavmi', 'kavim + i', 'zor'],
    ['lütfu', 'lütuf + u', 'zor'],
    ['ilmi', 'ilim + i', 'zor'],
    ['zulmü', 'zulüm + ü', 'zor'],
    ['kabri', 'kabir + i', 'zor'],
    ['ayrı', 'ayır + ı', 'zor'],
    ['sıyrılmak', 'sıyır + ılmak', 'zor'],
    ['uyku', 'uyu + ku', 'zor'],
    ['nasıl', 'ne + asıl', 'zor'],
    ['yanlış', 'yanıl + ış', 'zor'],
    ['kaynata', 'kayın + ata', 'zor'],
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

    // Sonu a/e ile biten fiil + “-yor”: en tanıdık kalıp, kolay.
    ['ödüyor', 'öde + yor'],
    ['istiyor', 'iste + yor'],
    ['hazırlıyor', 'hazırla + yor'],
    ['kutluyor', 'kutla + yor'],
    ['besliyor', 'besle + yor'],
    ['gözlüyor', 'gözle + yor'],
    ['sıçrıyor', 'sıçra + yor'],
    ['titriyor', 'titre + yor'],
    ['deniyor', 'dene + yor'],
    ['süslüyor', 'süsle + yor'],
    ['bağışlıyor', 'bağışla + yor'],
    ['yolluyor', 'yolla + yor'],
    ['sallıyor', 'salla + yor'],
    ['yakalıyor', 'yakala + yor'],
    ['tekrarlıyor', 'tekrarla + yor'],
    ['hatırlıyor', 'hatırla + yor'],
    ['yaşıyor', 'yaşa + yor'],
    ['boyuyor', 'boya + yor'],
    ['harcıyor', 'harca + yor'],
    ['avlıyor', 'avla + yor'],
    // Daralan ünlü kökün değil olumsuzluk ekinin (-ma/-me) ünlüsü; kök
    // ünsüzle bittiği için öğrenci olayı gözden kaçırıyor.
    ['bilmiyor', 'bilme + yor', 'orta'],
    ['görmüyor', 'görme + yor', 'orta'],
    ['okumuyor', 'okuma + yor', 'orta'],
    ['yapmıyor', 'yapma + yor', 'orta'],
    ['gitmiyor', 'gitme + yor', 'orta'],
    ['içmiyor', 'içme + yor', 'orta'],
    ['sevmiyor', 'sevme + yor', 'orta'],
    ['duymuyor', 'duyma + yor', 'orta'],
    ['anlamıyor', 'anlama + yor', 'orta'],
    // “de-” ve “ye-” istisnası: daralma yalnız “-yor” ile değil, ünlüyle
    // başlayan başka eklerle de oluyor. Kural dışı olduğu için en zoru.
    ['diyen', 'de + en', 'zor'],
    ['diyelim', 'de + elim', 'zor'],
    ['diyince', 'de + ince', 'zor'],
    ['yiyerek', 'ye + erek', 'zor'],
    ['yiyelim', 'ye + elim', 'zor'],
    ['yiyip', 'ye + ip', 'zor'],
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

    // Aynı köklerin başka çekimleri: havuzdaki kök sayısı az, çünkü ünsüzünü
    // ikizleyen sözcükler sayılı. Ek değişince olay değişmiyor, tanıma
    // alışkanlığı pekişiyor.
    ['hisse', 'his + e', 'orta'],
    ['hakkım', 'hak + ım', 'orta'],
    ['sırrım', 'sır + ım', 'orta'],
    ['şıkka', 'şık + a', 'orta'],
    ['halletti', 'hal + etti'],
    ['fenne', 'fen + e'],
    ['haccı', 'hac + ı'],
    ['zanna', 'zan + a'],
    ['addetmek', 'ad + etmek'],
    ['üssü', 'üs + ü'],
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

    // Ünlüyle biten ada ünlüyle başlayan ek gelince araya s ya da y giriyor.
    // Kök günlük dilden tanıdık olduğu sürece olay gözle görünüyor.
    ['dedesi', 'dede + i'],
    ['teyzesi', 'teyze + i'],
    ['amcası', 'amca + ı'],
    ['halası', 'hala + ı'],
    ['kuzusu', 'kuzu + u'],
    ['kutusu', 'kutu + u'],
    ['sobası', 'soba + ı'],
    ['bahçesi', 'bahçe + i'],
    ['gemisi', 'gemi + i'],
    ['şişesi', 'şişe + i'],
    ['örtüsü', 'örtü + ü'],
    ['kapıyı', 'kapı + ı'],
    ['arabayı', 'araba + ı'],
    ['odaya', 'oda + a'],
    ['bahçeye', 'bahçe + e'],
    ['masaya', 'masa + a'],
    ['gemiyi', 'gemi + i'],
    ['kediyi', 'kedi + i'],
    ['babaya', 'baba + a'],
    ['çantayı', 'çanta + ı'],
    // n kaynaştırması: ilgi eki “-ın” ve sıra sayı eki “-ncı”. Buradaki n
    // ekin parçası sanıldığı için y/s'li örneklerden bir kademe zor.
    ['babanın', 'baba + ın', 'orta'],
    ['arabanın', 'araba + ın', 'orta'],
    ['kedinin', 'kedi + in', 'orta'],
    ['odanın', 'oda + ın', 'orta'],
    ['kapının', 'kapı + ın', 'orta'],
    ['teyzenin', 'teyze + in', 'orta'],
    ['amcanın', 'amca + ın', 'orta'],
    ['kutunun', 'kutu + un', 'orta'],
    ['köprünün', 'köprü + ün', 'orta'],
    ['ikinci', 'iki + nci', 'orta'],
    ['altıncı', 'altı + ncı', 'orta'],
    ['yedinci', 'yedi + nci', 'orta'],
    ['yirminci', 'yirmi + nci', 'orta'],
    ['ellişer', 'elli + er', 'orta'],
    // Zor uç: o ile biten alıntılar ve “su” — ünlü uzun sanıldığı için
    // araya giren ses ekin kendisiymiş gibi okunuyor.
    ['paltosu', 'palto + u', 'zor'],
    ['radyosu', 'radyo + u', 'zor'],
    ['kilosu', 'kilo + u', 'zor'],
    ['banyoya', 'banyo + a', 'zor'],
    ['suya', 'su + a', 'zor'],
    ['ellinci', 'elli + nci', 'zor'],
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

    // Aynı k düşmesinin fiilden türeme biçimleri. Sözcük kalıplaştığı için
    // kökteki k'nın varlığı hiç sezilmiyor; hepsi zor uçta.
    ['yumuşamak', 'yumuşak + a + mak', 'zor'],
    ['yumuşatmak', 'yumuşak + a + t + mak', 'zor'],
    ['ufalanmak', 'ufak + la + n + mak', 'zor'],
    ['yükseliş', 'yüksek + l + iş', 'zor'],
    ['alçalış', 'alçak + l + ış', 'zor'],
    ['küçülüş', 'küçük + l + üş', 'zor'],
  ]),
] as const

export const SES_BOYUTU = SES_HAVUZU.length
