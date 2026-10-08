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

/** 12. sınıf İngilizce (2018 programı): Music, Friendship, Human Rights temalarının konu sonu soruları. */
export const ingilizce12Sorulari1: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'ing12-muzik-fikir': sorular([
    ['“According to the survey, most teenagers prefer pop.” cümlesi bir araştırmaya dayanan görüşü aktarır.', true, 'According to bir kaynağa dayanır; kişinin kendi fikri değildir.'],
    ['“I agree on you” kişiyle katılmayı anlatan doğru bir kalıptır.', false, 'Kişiyle agree with, konuyla agree on kullanılır: I agree with you.'],
    ['“I tend to agree with you” tam bir katılmadan çok ılımlı bir katılmayı anlatır.', true, 'Tend to eğilimi bildirir; katılma yumuşatılmıştır.'],
    ['“In my opinion” kalıbı başkasının görüşünü aktarmak için kullanılır.', false, 'In my opinion kişinin kendi görüşünü söyler; başkasının görüşü için according to kullanılır.'],
    ['“Why do you think that” kalıbı karşıdakinden gerekçe ister.', true, 'Why ile sorulan soru, düşüncenin nedenini öğrenmeyi amaçlar.'],
    ['Evet/hayır sorularında ses genellikle düşer, “Do you like jazz” gibi.', false, 'Evet/hayır sorularında ses genellikle yükselir; wh- sorularında düşer.'],
  ], [
    ['“I ___ with you on this point.”', ['agree', 'am agree'], 0, 'Agree bir fiildir; am ile birlikte kullanılmaz.'],
    ['“___ the critics, the album is brilliant.”', ['In my opinion', 'According to'], 1, 'Eleştirmenlerin görüşü aktarıldığı için According to gerekir.'],
    ['Karşıdakinden gerekçe isteyen soru hangisidir?', ['Why do you think that …?', 'I tend to agree …'], 0, 'Why do you think that, düşüncenin nedenini sorar.'],
    ['Şarkının ezgisi için hangi sözcük kullanılır?', ['lyrics', 'melody'], 1, 'Melody ezgidir; lyrics şarkı sözleridir.'],
    ['Katılmadığını hangi cümle bildirir?', ['I disagree with you.', 'I tend to agree.'], 0, 'Disagree katılmamayı ifade eder.'],
    ['Çoğunluğun görüşünü hangi cümle aktarır?', ['A few believe that …', 'The majority believe that …'], 1, 'The majority çoğunluk demektir; a few az sayıda kişiyi anlatır.'],
  ]),
  'ing12-muzik-tercih': sorular([
    ['“She prefers jazz to rock” cümlesi cazı rocka tercih ettiğini anlatır.', true, 'Prefer A to B, A’yı B’ye tercih etmek demektir.'],
    ['“I’d rather to go out tonight” doğru bir cümledir.', false, 'Would rather’dan sonra yalın fiil gelir: I’d rather go out.'],
    ['“I like this song because of its beat” cümlesinde because of’tan sonra isim öbeği gelmiştir.', true, 'Because of + isim öbeği; because + cümle kullanılır.'],
    ['Anket raporunun Findings bölümünde kişisel yorumlar yazılır.', false, 'Findings sayılarla bulguları verir; yorum sonuç bölümünde yer alır.'],
    ['“If I had a choice, I would go for jazz” cümlesi şimdiki durumun tersi bir seçimi anlatır.', true, 'If + past simple, would + yalın fiil kalıbı gerçek olmayan durumu anlatır.'],
    ['“I can’t stand loud music” cümlesi yüksek sesli müziği sevdiğini gösterir.', false, 'Can’t stand, dayanamamak demektir; sevmediğini anlatır.'],
  ], [
    ['“I prefer walking ___ driving.”', ['to', 'than'], 0, 'Prefer A to B kalıbında to kullanılır.'],
    ['“I’d rather ___ at home tonight.”', ['staying', 'stay'], 1, 'Would rather’dan sonra yalın fiil gelir.'],
    ['“I like this song ___ its beat.”', ['because of', 'because'], 0, 'Beat bir isim öbeği olduğu için because of gerekir.'],
    ['Anketin sonucu hangi bölümde özetlenir?', ['Introduction', 'Conclusion'], 1, 'Sonuç, raporun Conclusion bölümünde verilir.'],
    ['“Only a small number like jazz.” Bu cümle neyi anlatır?', ['Az bir kısım', 'Çoğunluk'], 0, 'Only a small number az sayıda kişiyi anlatır.'],
    ['“I’m into hip-hop.” ne demektir?', ['Hip-hop’tan nefret ederim', 'Hip-hop’a meraklıyım'], 1, 'Be into, bir şeye ilgi duymak demektir.'],
  ]),
  'ing12-arkadaslik-ozellik': sorular([
    ['“What does she look like” sorusu görünüşü sorar.', true, 'Look like sorusu dış görünüşü sorar; huy için what kind of person kullanılır.'],
    ['“What kind of person is he” sorusu boyunu ve saç rengini sorar.', false, 'Bu soru kişiliği sorar; görünüş için what does he look like kullanılır.'],
    ['“Tom is as handsome as his brother” iki kişiyi eşit gösterir.', true, 'As … as eşitlik anlatır.'],
    ['“She looks very younger than her sister” doğru bir cümledir.', false, 'Comparative ile much kullanılır: much younger; very kullanılmaz.'],
    ['“He behaves badly” cümlesinde behave fiilinden sonra zarf gelmiştir.', true, 'Badly bir zarftır; davranışın nasıl olduğunu anlatır.'],
    ['“Generous” sözcüğü “cimri” anlamına gelir.', false, 'Generous cömert demektir; cimri stingy ile anlatılır.'],
  ], [
    ['“He looks ___ younger than his age.”', ['very', 'much'], 1, 'Karşılaştırmayı much güçlendirir.'],
    ['Kişiliği sormak için hangi soru kullanılır?', ['What kind of person is she?', 'What does she look like?'], 0, 'What kind of person kişiliği sorar.'],
    ['“She is a girl ___ always helps others.”', ['who', 'which'], 0, 'Kişi tanımlamak için who gerekir.'],
    ['“Mia is not ___ tall as her sister.”', ['than', 'as'], 1, 'Olumsuz eşitlik not as … as kalıbıyla kurulur.'],
    ['Hangisi bir kişilik özelliğidir?', ['curly', 'patient'], 1, 'Patient sabırlı demektir; curly saç şeklini anlatır.'],
    ['“Altmışlı yaşlarında” İngilizce nasıl söylenir?', ['in his 60s', 'at his 60'], 0, 'Yaş aralığı için in his 60s denir.'],
  ]),
  'ing12-arkadaslik-cikarim': sorular([
    ['“She writes to him every day. She must be his best friend.” cümlesinde must güçlü bir çıkarım bildirir.', true, 'Must be, güçlü kanıta dayanan kesine yakın çıkarımdır.'],
    ['“He can’t be shy” kişinin utangaç olabileceğini zayıf biçimde söyler.', false, 'Can’t be kesin olumsuz çıkarımdır; zayıf olasılık için might kullanılır.'],
    ['“She must have missed the bus” geçmişe dair bir çıkarımdır.', true, 'Must have + V3 geçmiş için çıkarım yapar.'],
    ['Because of’tan sonra tam bir cümle gelir.', false, 'Because of’tan sonra isim öbeği gelir; tam cümle için because kullanılır.'],
    ['“Whereas” iki durum arasında karşıtlık kurar.', true, '“Ali is shy, whereas Can is outgoing” karşıtlığı gösterir.'],
    ['“Similar in that” kalıbı bir farkı anlatır.', false, 'Similar in that benzerlik kurar.'],
  ], [
    ['“He ___ be in his 60s; he looks very young.”', ['can’t', 'must'], 0, 'Kanıt aksini gösterdiği için can’t be denir.'],
    ['“She passed. She ___ have studied hard.”', ['can’t', 'must'], 1, 'Kanıt olumlu olduğu için must have studied denir.'],
    ['“We were late ___ the heavy traffic.”', ['because', 'because of'], 1, 'Traffic bir isim öbeği olduğu için because of gerekir.'],
    ['“Ali is shy, ___ Can is outgoing.”', ['whereas', 'because'], 0, 'İki karşıt özellik whereas ile bağlanır.'],
    ['Hangisi kesin olumsuz çıkarımdır?', ['might be', 'can’t be'], 1, 'Can’t be kesin olumsuz çıkarımdır.'],
    ['“Tom and I have a lot ___.”', ['in common', 'in same'], 0, 'Ortak yönler için have in common denir.'],
  ]),
  'ing12-insan-haklari': sorular([
    ['“Freedom of expression is a basic human right” ifade özgürlüğünü temel hak sayar.', true, 'Basic human right, temel insan hakkı demektir.'],
    ['“Disabled” sözcüğü “dezavantajlı olmayan” anlamına gelir.', false, 'Disabled engelli demektir.'],
    ['“Every child has the right to get health services” çocukların sağlık hakkını bildirir.', true, 'Have the right to, hakkı olmak demektir.'],
    ['“Discrimination” herkese eşit davranmak anlamına gelir.', false, 'Discrimination ayrımcılıktır; eşit davranış equality ile anlatılır.'],
    ['“The right to education” eğitim hakkı demektir.', true, 'The right to + isim, bir şeye hakkı olmayı anlatır.'],
    ['“Animal rights” yalnız insan haklarını anlatır.', false, 'Animal rights hayvan haklarıdır.'],
  ], [
    ['“Everyone has the right ___ education.”', ['to', 'of'], 0, 'Right ile to kullanılır: the right to education.'],
    ['Olumsuz bir eylem hangisidir?', ['protect', 'violate'], 1, 'Violate, hakkı çiğnemek demektir.'],
    ['“Cinsiyet eşitliği” hangisidir?', ['gender equality', 'discrimination'], 0, 'Gender equality cinsiyet eşitliğidir.'],
    ['“Disability” sözcüğünde vurgu hangisidir?', ['DIS-a-bil-i-ty', 'dis-a-BIL-i-ty'], 1, '-ity öncesi hece vurgulanır: dis-a-BIL-i-ty.'],
    ['Slogan için hangisi daha uygundur?', ['A long detailed paragraph', 'Equal rights for all!'], 1, 'Slogan kısa ve tek fikirli olmalıdır.'],
    ['“The company ___ them their rights.” Hangi fiil uygundur?', ['denied', 'deserved'], 0, 'Deny haklarını vermemek demektir.'],
  ]),
  'ing12-oneri-sorunlar': sorular([
    ['“Governments should protect children” bir öneri bildirir.', true, 'Should + yalın fiil öneri verir.'],
    ['“I suggest to build a ramp” doğru bir cümledir.', false, 'Suggest’ten sonra to + fiil gelmez: I suggest building / that we build.'],
    ['“Lead to” sonuç doğurmayı anlatır.', true, 'Poverty leads to a lack of education: yoksulluk eğitim eksikliğine yol açar.'],
    ['“Why don’t we write to the mayor” kalıbı bir yasak bildirir.', false, 'Why don’t we …? öneri kalıbıdır.'],
    ['“Lack of access to schools” erişim eksikliğini anlatır.', true, 'Lack of eksikliği anlatır.'],
    ['“However” cümleye neden ekler.', false, 'However karşıtlık kurar; neden için because kullanılır.'],
  ], [
    ['“How about ___ a campaign?”', ['to start', 'starting'], 1, 'How about’tan sonra V-ing gelir.'],
    ['“Poverty often ___ a lack of education.”', ['leads to', 'lead to'], 0, 'Poverty tekil olduğu için leads to gerekir.'],
    ['Vurgusu doğru olan hangisidir?', ['EQ-ual-i-ty', 'e-QUAL-i-ty'], 1, '-ity öncesi hece vurgulanır: e-QUAL-i-ty.'],
    ['“___ the opportunities for children grow?”', ['Does', 'Do'], 1, 'Opportunities çoğul olduğu için Do gerekir.'],
    ['“We ___ listen to disadvantaged people.”', ['ought to', 'ought'], 0, 'Ought her zaman to ile birlikte kullanılır.'],
    ['“Some countries have improved; ___, many problems remain.”', ['however', 'because'], 0, 'Karşıt iki bilgi however ile bağlanır.'],
  ]),
}
