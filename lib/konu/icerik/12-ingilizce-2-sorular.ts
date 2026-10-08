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

/** 12. sınıf İngilizce (2018 programı): Coming Soon, Psychology, Favors temalarının konu sonu soruları. */
export const ingilizce12Sorulari2: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'ing12-gelecek-tahmin': sorular([
    ['“It is going to rain” cümlesi, şimdiki kanıta dayanan bir tahmin olabilir.', true, 'Be going to, bulut gibi şimdiki kanıttan çıkan tahminlerde kullanılır.'],
    ['“It will probably rain” cümlesinde probably, will’den önce gelir.', false, 'Zarf will’den sonra gelir: will probably.'],
    ['“It probably won’t rain” cümlesinde zarf won’t’tan önce yer alır.', true, 'Olumsuz biçimde zarf won’t’tan önce gelir.'],
    ['“If people will waste water, we will have a shortage” doğru bir birinci koşul cümlesidir.', false, 'If bölümünde present simple kullanılır: If people waste water.'],
    ['“In order to reduce” kalıbı amaç bildirir.', true, 'In order to + yalın fiil, amacı anlatır.'],
    ['“Due to” kalıbından sonra tam bir cümle gelir.', false, 'Due to’dan sonra isim öbeği gelir; tam cümle için because kullanılır.'],
  ], [
    ['“Look at the clouds! It ___ rain.”', ['will', 'is going to'], 1, 'Şimdiki kanıt olduğu için be going to kullanılır.'],
    ['En kesin tahmin hangisidir?', ['It will definitely rain.', 'It might rain.'], 0, 'Will definitely, kesin olasılığı anlatır; might zayıf olasılıktır.'],
    ['“If people waste water, we ___ a shortage.”', ['will have', 'would have'], 0, 'Birinci koşulda ana cümlede will kullanılır.'],
    ['“It ___ rain tomorrow.” (Büyük olasılıkla yağmayacak.)', ['won’t probably', 'probably won’t'], 1, 'Zarf won’t’tan önce gelir.'],
    ['“He saves money ___ buy a car.”', ['in order to', 'for to'], 0, 'Amaç için in order to + yalın fiil kullanılır.'],
    ['“Prices will rise ___ high demand.”', ['in order to', 'due to'], 1, 'High demand isim öbeği olduğu için due to gerekir.'],
  ]),
  'ing12-siber-dunya': sorular([
    ['“Cyborg” insan ile makine özelliklerini birleştiren varlığı anlatır.', true, 'Cyborg, cybernetic organism sözcüklerinden gelir.'],
    ['“Phishing” bir oyun türünün adıdır.', false, 'Phishing, sahte mesajlarla bilgi çalmayı anlatan bir siber suçtur.'],
    ['“Choose your avatar” bir talimat cümlesidir.', true, 'Fiille başlayan cümle emir kipidir.'],
    ['“Don’t share your password” bir gelecek tahmini bildirir.', false, 'Don’t + fiil, olumsuz bir talimattır.'],
    ['“Differentiate between A and B” iki şeyi birbirinden ayırt etmek demektir.', true, 'Differentiate between, ayırt etmeyi anlatır.'],
    ['“Identity theft” kimlik belgesini yenilemek demektir.', false, 'Identity theft, başkasının kimlik bilgilerini çalmaktır.'],
  ], [
    ['“E-postanı doğrula” için hangi fiil kullanılır?', ['vary', 'verify'], 1, 'Verify doğrulamak demektir; vary değişmektir.'],
    ['Adımlara başlarken hangi bağlaç kullanılır?', ['First', 'Finally'], 0, 'First ilk adımı bildirir.'],
    ['Hangisi bir siber suçtur?', ['gaming', 'hacking'], 1, 'Hacking izinsiz girmedir; gaming oyun oynamaktır.'],
    ['“Many children cannot ___ between reality and games.”', ['differentiate', 'different'], 0, 'Differentiate between A and B kalıbı vardır; different sıfattır, fiil yerine geçmez.'],
    ['Karşıdakinin cümlesini teyit etmek için ne denir?', ['Did you mean …?', 'Don’t share …'], 0, 'Did you mean …? anlamı doğrulatan sorudur.'],
    ['Hangisi doğru parola güvenliğidir?', ['Share it with friends', 'Use a strong password'], 1, 'Parola paylaşılmaz ve güçlü seçilir.'],
  ]),
  'ing12-ruh-hali': sorular([
    ['“Exhausted” sözcüğü bitkin demektir.', true, 'Exhausted aşırı yorgunluğu anlatır.'],
    ['“I feel like going for a walk” yürüyüşe çıkmak istemediğini anlatır.', false, 'Feel like + V-ing, canının bir şey istediğini anlatır.'],
    ['“The lesson is boring” cümlesinde boring dersin sıkıcı olduğunu bildirir.', true, '-ing sıfatı hissettiren şeyi anlatır.'],
    ['“I am boring” cümlesi “sıkılıyorum” anlamında doğrudur.', false, 'I am bored denir; I am boring, “sıkıcı biriyim” demektir.'],
    ['Concentrate fiili on edatıyla kullanılır.', true, 'Concentrate on kalıbı vardır.'],
    ['Tone, yalnız yazarın seçtiği renkleri anlatır.', false, 'Tone, yazarın ya da konuşmacının tavrını anlatır.'],
  ], [
    ['“I can’t concentrate ___ my homework.”', ['in', 'on'], 1, 'Concentrate on kalıbı kullanılır.'],
    ['“The film was ___, so I fell asleep.”', ['boring', 'bored'], 0, 'Film hissettiren şeydir; boring gerekir.'],
    ['“The news made me ___.”', ['happily', 'happy'], 1, 'Make + nesne + sıfat kalıbı vardır.'],
    ['“Kasvetli” hangisidir?', ['gloomy', 'cheerful'], 0, 'Gloomy kasvetli, cheerful neşelidir.'],
    ['“She is ___ because the trip was long.”', ['exhausted', 'exhausting'], 0, 'Kişi hisseden olduğu için -ed sıfatı gelir.'],
    ['“I feel ___ going for a walk.”', ['to', 'like'], 1, 'Feel like + V-ing kalıbı vardır.'],
  ]),
  'ing12-oneri-talimat': sorular([
    ['“I suggest going for a walk” cümlesi doğru kurulmuştur.', true, 'Suggest’ten sonra V-ing gelebilir.'],
    ['“I suggest you to take a nap” cümlesi doğru kurulmuştur.', false, 'Suggest + you to fiil kullanılmaz: I suggest that you take a nap.'],
    ['Had better’dan sonra yalın fiil gelir.', true, 'You’d better rest örneğinde olduğu gibi.'],
    ['“You’d better not to go” cümlesi doğrudur.', false, 'Had better not + yalın fiil: You’d better not go.'],
    ['“Close your eyes!” emir kipiyle kurulmuş bir talimattır.', true, 'Yalın fiille başlayan cümle emir kipidir.'],
    ['Evet/hayır sorusu biçimindeki öneride ses genellikle düşer.', false, 'Shall we take a break gibi sorularda ses yükselir.'],
  ], [
    ['“I suggest ___ a break.”', ['to take', 'taking'], 1, 'Suggest’ten sonra V-ing gelir.'],
    ['“You’d better ___ late.”', ['not stay', 'not to stay'], 0, 'Had better not + yalın fiil.'],
    ['“If I ___ you, I would talk to a counsellor.”', ['am', 'were'], 1, 'If I were you öğüt kalıbıdır; am bu kalıpta kullanılmaz.'],
    ['Sıralamada ilk adım bağlacı hangisidir?', ['First', 'Finally'], 0, 'First ilk adımı belirtir.'],
    ['“Kaygı” hangisidir?', ['anxiety', 'relaxation'], 0, 'Anxiety kaygıdır; relaxation rahatlamadır.'],
    ['Rahatlatıcı talimat nasıl okunur?', ['Fast and loud', 'Slow and soft'], 1, 'Rahatlatıcı talimat yavaş ve yumuşak söylenir.'],
  ]),
  'ing12-rica': sorular([
    ['“Would you mind lending me your bike” cümlesinde mind’dan sonra V-ing gelmiştir.', true, 'Mind + V-ing kuralı.'],
    ['“Borrow” bir şeyi başkasına ödünç vermek demektir.', false, 'Borrow ödünç almak, lend ödünç vermektir.'],
    ['“Would you mind opening the window” sorusuna “Yes” demek, “evet, sakıncası var” demektir.', true, 'Mind sakıncayı sorar; Yes ret anlamı taşır.'],
    ['“I was wondering if you’d mind …” kalıbı Can I …’dan daha az naziktir.', false, 'I was wondering if …, daha nazik ve dolaylıdır.'],
    ['“Could you” hızlı konuşmada /kʊdʒu/ gibi okunabilir.', true, 'Sözcükler arasında yod birleşmesi olur.'],
    ['“Do you mind if I open the window” cümlesinde if’ten sonra V-ing gelir.', false, 'If’ten sonra özne + present simple gelir: if I open.'],
  ], [
    ['“Would you mind ___ the window?”', ['to open', 'opening'], 1, 'Would you mind’dan sonra V-ing gelir.'],
    ['“Can I ___ your pen?”', ['borrow', 'lend'], 0, 'Ödünç almak borrow’dur.'],
    ['“I need ___ help.”', ['some', 'a'], 0, 'Help sayılamayan isimdir; some gerekir.'],
    ['“Would you mind closing the door?” Kabul eden yanıt?', ['Yes, I do mind.', 'Not at all.'], 1, 'Not at all, sakıncası olmadığını söyler.'],
    ['Daha resmî rica hangisidir?', ['Got a pen?', 'I was wondering if you could help.'], 1, 'I was wondering if … resmî ve naziktir.'],
    ['“Do you mind if I ___ the window?”', ['open', 'opening'], 0, 'If’ten sonra özne ve fiil gelir.'],
  ]),
  'ing12-iyilik-yanit': sorular([
    ['“Help yourself!” kullanılmasına izin verildiğini anlatır.', true, 'Help yourself, kendin al, kullan demektir.'],
    ['“I’m afraid I can’t” sert bir ret kalıbıdır.', false, 'I’m afraid I can’t, nazik bir ret kalıbıdır.'],
    ['“Dear Sir or Madam” ile başlayan mektup “Yours faithfully” ile kapanır.', true, 'Alıcının adı bilinmiyorsa Yours faithfully kullanılır.'],
    ['“Skim” metinde belirli bir bilgiyi aramak demektir.', false, 'Belirli bilgiyi aramak scan, genel fikir için skim kullanılır.'],
    ['“Donation” bağış demektir.', true, 'Charity için yapılan bağış donation’dır.'],
    ['“Don’t mention it” teşekküre sert bir ret verir.', false, 'Don’t mention it, önemli değil demektir.'],
  ], [
    ['“Dear Sir or Madam” ardından hangi kapanış gelir?', ['Yours faithfully', 'Yours sincerely'], 0, 'Alıcı adı bilinmiyorsa faithfully kullanılır.'],
    ['Hangisi nazik bir ret sayılır?', ['No!', 'I’m sorry, but I can’t.'], 1, 'Özür ve gerekçe reddi nazikleştirir.'],
    ['“Hayır kurumu” hangisidir?', ['charity', 'scholarship'], 0, 'Charity hayır kurumudur; scholarship burstur.'],
    ['Teşekküre karşılık hangisi uygundur?', ['I’m afraid not.', 'My pleasure.'], 1, 'My pleasure teşekküre verilen karşılıktır.'],
    ['Belirli bir bilgiyi bulmak için hangi okuma yapılır?', ['skim', 'scan'], 1, 'Scan belirli bilgiyi aramaktır.'],
    ['Hangisi yardım teklifidir?', ['Shall I carry your bag?', 'Carry your own bag.'], 0, 'Shall I …? teklif bildirir.'],
  ]),
}
