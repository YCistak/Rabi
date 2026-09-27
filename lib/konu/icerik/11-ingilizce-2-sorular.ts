import { sikli, soru, type SoruKarti } from '../tip'

type Iddia = [ifade: string, dogru: boolean, aciklama: string]
type Secim = [soru: string, siklar: [string, string], dogru: 0 | 1, aciklama: string]

function sorular(iddialar: Iddia[], secimler: Secim[]): Omit<SoruKarti, 'id'>[] {
  const sonuc: Omit<SoruKarti, 'id'>[] = []
  for (let i = 0; i < Math.max(iddialar.length, secimler.length); i++) {
    if (i < iddialar.length) sonuc.push(soru(...iddialar[i]))
    if (i < secimler.length) sonuc.push(sikli(...secimler[i]))
  }
  return sonuc
}

export const ingilizce11Sorulari2: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'ing11-fiziksel-saglik': sorular([
    ['“While I was jogging, my friend called.” cümlesinde koşu arama sırasında sürüyordu.', true, 'Was jogging süren, called ise o sırada olan kısa eylemdir.'],
    ['“Adequate sleep” ifadesi “aşırı uyku” anlamına gelir.', false, 'Adequate “yeterli” demektir; aşırılık anlatmaz.'],
    ['“She stretched yesterday.” bitmiş bir geçmiş eylem anlatır.', true, 'Yesterday ile kullanılan stretched, past simple biçimindedir.'],
    ['“Posture” kelimesi yalnızca besinin enerji miktarını anlatır.', false, 'Posture duruş demektir; enerji miktarı calories ile anlatılır.'],
    ['“The doctor treated her injury.” cümlesinde tedaviyi doktor yaptı.', true, 'Treat fiilinin öznesi the doctor, nesnesi her injury’dir.'],
    ['“He was sleeping when the alarm rang.” cümlesinde alarm uykudan önce çaldı.', false, 'Was sleeping sürmekteydi; alarm o sırada çaldı.'],
    ['“Mindfulness” sözcüğü yalnızca fiziksel bir masaj uygulamasının adıdır.', false, 'Mindfulness anda olup biteni fark etmeye yönelik bir uygulamadır; massage ayrı bir sözcüktür.'],
  ], [
    ['“While I ___, the phone rang.” Geçmişte süren eylem için hangisi gelir?', ['was stretching', 'am stretching'], 0, 'Geçmişte süren iş was stretching; am stretching şimdiki zamandır.'],
    ['“He did exercise last week.” hangi zaman bakışını verir?', ['O anda süren', 'Geçmişte tamamlanan'], 1, 'Did geçmişte tamamlanan eylemi bildirir.'],
    ['“The meal has enough protein.” cümlesinde enough neyi anlatır?', ['Yeterli miktarı', 'Aşırı miktarı'], 0, 'Enough ihtiyaç için yeterli miktardır.'],
    ['Bir hastalık sonrası iyileşme desteği için hangi sözcük uygundur?', ['posture', 'rehabilitation'], 1, 'Rehabilitation iyileşme ve işlev kazanma sürecidir.'],
    ['“At 7 p.m. she was cycling.” hangi eylem anlatılır?', ['O anda sürmekte olan', 'Daha önce bitmiş olan'], 0, 'Was cycling belirli geçmiş anda devam eden eylemdir.'],
    ['“He took care of his grandmother.” cümlesinde ne yaptı?', ['Onu ziyaret etti', 'Onun bakımını üstlendi'], 1, 'Take care of birinin bakımıyla ilgilenmektir; yalnız ziyaret etmekten fazlasıdır.'],
    ['“While she was jogging, it started raining.” Önce hangi eylem sürüyordu?', ['Jogging', 'Yağmurun başlaması'], 0, 'Was jogging devam ederken started raining gerçekleşti.'],
  ]),
  'ing11-ruhsal-saglik': sorular([
    ['“She built up confidence.” güvenin zamanla geliştiğini anlatır.', true, 'Build up bir niteliğin giderek güçlenmesini ifade eder.'],
    ['“He gave up after one mistake.” devam etmeyi seçtiğini anlatır.', false, 'Give up vazgeçmek demektir; carry on devam etmektir.'],
    ['“Her friends backed her up.” arkadaşlarının onu desteklediğini anlatır.', true, 'Back up birine destek vermektir.'],
    ['“She was feeling anxious when I called.” arama sırasında kaygısı sürüyordu.', true, 'Was feeling süren durumu; called kısa olayı anlatır.'],
    ['“Loneliness” ve “joy” aynı duyguyu anlatır.', false, 'Loneliness yalnızlık, joy sevinçtir.'],
    ['“He coped with stress.” stresin hiç yaşanmadığını anlatır.', false, 'Cope with yaşanan güçlükle başa çıkmaktır.'],
  ], [
    ['“Cheer up” hangi durumda daha uygundur?', ['Üzgün arkadaşına moral verirken', 'Arkadaşının yerine karar verirken'], 0, 'Cheer up moral vermek, kişinin daha iyi hissetmesine yardım etmektir.'],
    ['“She carried on practising.” ne yaptı?', ['Çalışmayı bıraktı', 'Çalışmaya devam etti'], 1, 'Carry on bir eylemi sürdürmektir.'],
    ['“Self-awareness” örneği hangisidir?', ['Sınav öncesi gerildiğini fark etmek', 'Kaygısını başkasına yüklemek'], 0, 'Kendi duygu ve tepkisini fark etmek öz farkındalıktır.'],
    ['“He overcame his fear.” cümlesi hangi sonucu anlatır?', ['Korkusunu sakladı', 'Korkusunu aştı'], 1, 'Overcome bir engeli veya korkuyu aşmaktır.'],
    ['“She was resting when the message arrived.” Mesaj geldiğinde ne oluyordu?', ['Dinleniyordu', 'Mesaj yazıyordu'], 0, 'Was resting süren eylemdir; arrived sonradan olan olaydır.'],
    ['“Build up self-esteem” neye yakındır?', ['Öz saygıyı geliştirmeye', 'Öz saygıyı bastırmaya'], 0, 'Build up artırıp güçlendirmek; self-esteem öz saygıdır.'],
    ['Arkadaşının zor döneminde “I will back you up” ne sunar?', ['Bir eleştiri', 'Bir destek'], 1, 'Back you up, gerektiğinde yanında olacağını bildirir.'],
    ['“She struggled but carried on.” hangi yorum doğrudur?', ['Güçlük yaşayıp devam etti', 'Hiç güçlük yaşamadı'], 0, 'Struggled zorluk yaşadı; carried on buna rağmen sürdürdü.'],
  ]),
  'ing11-aile-gelenekleri': sorular([
    ['“We had prepared dinner before they arrived.” yemek hazırlığı misafirlerden önce bitti.', true, 'Had prepared önceki, arrived sonraki geçmiş eylemdir.'],
    ['“She had chosen the film, hadn’t she” sözündeki kısa ek bilgi doğrulama amacı taşır.', true, 'Question tag, konuşanın bilgisini karşı tarafa teyit ettirir.'],
    ['“Spoiler” film sonucunu önceden açıklayan bilgi olabilir.', true, 'Sonucu erkenden söylemek izleyicinin sürprizini bozar.'],
    ['“Contestant” bir yarışmayı izleyen seyircidir.', false, 'Contestant yarışmaya katılan kişidir.'],
    ['“They had reunited after the festival ended.” önce buluşma, sonra festival bitişi demektir.', false, 'After the festival ended önce festival biter, sonra yeniden buluşurlar.'],
    ['“Amusing” ve “dull” film yorumu olarak aynı anlama gelir.', false, 'Amusing eğlenceli, dull sıkıcıdır.'],
  ], [
    ['“We had met before the concert began.” Önce ne oldu?', ['Buluşma', 'Konserin başlaması'], 0, 'Had met, began olayından önce tamamlandı.'],
    ['“He had watched the episode, ___?” hangi tag uygundur?', ['had he', 'hadn’t he'], 1, 'Olumlu had watched cümlesine olumsuz hadn’t he gelir.'],
    ['“Do not tell me who won!” hangi bilgi türünden kaçınıyor?', ['Spoiler', 'Occasion'], 0, 'Kazananı söylemek sonucu erkenden açığa çıkarır.'],
    ['Aile birlikte şarkıya eşlik ediyorsa hangi ifade kullanılır?', ['set up', 'sing along'], 1, 'Sing along çalan ya da söylenen şarkıya eşlik etmektir.'],
    ['“She is fond of films.” ne anlatır?', ['Filmleri sevdiğini', 'Filmlerden sıkıldığını'], 0, 'Fond of bir şeye ilgi ve sevgi duymayı anlatır.'],
    ['“They had set up the screen before we arrived.” Önce ne tamamlandı?', ['Bizim gelişimiz', 'Ekranın kurulması'], 1, 'Had set up, arrived eyleminden önce gerçekleşti.'],
    ['“The film was dull.” hangi değerlendirmedir?', ['Sıkıcıydı', 'Eğlenceliydi'], 0, 'Dull sıkıcı demektir; amusing eğlenceli anlamına gelir.'],
    ['“They chose an indoor sport because it rained.” Neden kapalı alan seçildi?', ['Daha kısa sürmesi için', 'Yağmur nedeniyle'], 1, 'Because it rained nedeni açıklar; indoor sport kapalı alandadır.'],
  ]),
  'ing11-ev-paylasimi': sorular([
    ['“They had set the rules before we moved in.” kurallar taşınmadan önce kondu.', true, 'Had set önce, moved in sonra gerçekleşti.'],
    ['“She had not cleaned the room.” geçmişteki temizlik işinin tamamlandığını söyler.', false, 'Had not cleaned, söz edilen geçmiş ana dek temizliğin tamamlanmadığını söyler.'],
    ['“Sort out a disagreement” görüş ayrılığını çözmek anlamına gelir.', true, 'Sort out sorunu düzene koyup çözmektir.'],
    ['“Privacy” ortak evde herkesin odasına izinsiz girmeyi gerektirir.', false, 'Privacy kişisel alana ve mahremiyete saygı gerektirir.'],
    ['“They had agreed, hadn’t they” sözündeki kısa ek bir bilgiyi teyit eder.', true, 'Olumlu past perfect cümlesine olumsuz question tag gelir.'],
    ['“Figure out the cause” nedeni anlamaya çalışmak değil, onu gizlemek demektir.', false, 'Figure out çözümü ya da nedeni bulup anlamaktır.'],
    ['“She looked after her brother.” kardeşinin bakımını üstlendiğini anlatır.', true, 'Look after birinin bakımıyla ilgilenmek demektir.'],
  ], [
    ['“He hadn’t done the dishes before guests arrived.” Hangisi doğru?', ['Bulaşıklar önce bitmemişti', 'Bulaşıklar önce bitti'], 0, 'Hadn’t done, misafirlerden önce işin tamamlanmadığını gösterir.'],
    ['“You had agreed on the budget, ___?” hangi tag doğrudur?', ['had you', 'hadn’t you'], 1, 'Olumlu ana cümle olumsuz kısa soru alır.'],
    ['Ortak masraf anlaşmazlığında hangi söz uygundur?', ['Let’s set a budget.', 'Let’s ignore the complaint.'], 0, 'Bütçeyi birlikte belirlemek paylaşılan giderleri görünür kılar.'],
    ['“Take responsibility” hangi eyleme yakındır?', ['Görevi başkasına yüklemek', 'Görevi üstlenmek'], 1, 'Take responsibility sorumluluk almayı anlatır.'],
    ['“We need to figure out why the kitchen is messy.” amaç nedir?', ['Nedeni anlamak', 'Gerginliği artırmak'], 0, 'Figure out nedenin veya çözümün anlaşılmasıdır.'],
    ['Kişisel alan sorunu için hangi davranış uygundur?', ['Odaya habersiz girmek', 'Girmeden önce kapıyı çalmak'], 1, 'Privacy başkasının kişisel alanını gözetmeyi gerektirir.'],
    ['“They calmed down before they talked.” önce ne yaptılar?', ['Sakinleştiler', 'Konuşmaya başladılar'], 0, 'Calmed down önce; talked sonra gerçekleşti.'],
  ]),
}
