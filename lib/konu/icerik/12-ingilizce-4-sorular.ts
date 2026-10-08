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

/** 12. sınıf İngilizce (2018 programı): Technology ve Manners temalarının konu sonu soruları. */
export const ingilizce12Sorulari4: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'ing12-teknoloji-yaptirma': sorular([
    ['“I’ll have the computer formatted” bilgisayarı başkasına formatlatmayı anlatır.', true, 'Have + nesne + V3, işi başkasına yaptırmaktır.'],
    ['“I had Mindy downloaded a movie” doğru bir cümledir.', false, 'Kişi belirtilince yalın fiil gelir: I had Mindy download a movie.'],
    ['“Make + kişi + fiil” yapısında etken cümlede to kullanılmaz.', true, 'The teacher made the class do research: to yoktur.'],
    ['“Get + kişi + fiil” yapısında to hiç kullanılmaz.', false, 'Get + kişi + to fiil kalıbı vardır.'],
    ['“My laptop needs repairing” laptopun tamir edilmesi gerektiğini anlatır.', true, 'Need V-ing edilgen anlam taşır.'],
    ['“I cut my hair” cümlesi saçı başkasına kestirmeyi anlatır.', false, 'Saçı kendisi kesmiştir; kestirmek için I had my hair cut denir.'],
  ], [
    ['“I had my phone ___ yesterday.”', ['repair', 'repaired'], 1, 'Have + nesne + V3 yapısı gerekir.'],
    ['“I had Mindy ___ a movie for me.”', ['download', 'to download'], 0, 'Have + kişi + yalın fiil kullanılır.'],
    ['“The teacher made the class ___ research.”', ['do', 'to do'], 0, 'Make + kişi + yalın fiil kullanılır.'],
    ['“I got my brother ___ the app.”', ['install', 'to install'], 1, 'Get + kişi + to fiil kalıbı vardır.'],
    ['“The teacher doesn’t ___ us use phones.”', ['let', 'allow'], 0, 'Let + kişi + yalın fiil; allow us use biçimi yanlıştır.'],
    ['“He is having his car ___.”', ['wash', 'washed'], 1, 'Have + nesne + V3: washed.'],
  ]),
  'ing12-teknoloji-gorus': sorular([
    ['“On the other hand” karşıt görüşü açmak için kullanılır.', true, 'On the other hand karşıtlık bildirir.'],
    ['“Moreover” karşıtlık bağlacıdır.', false, 'Moreover ek bilgi ekler.'],
    ['“Warranty” garanti belgesi anlamındadır.', true, 'Warranty garanti demektir.'],
    ['Kapalı soru uzun açıklama ister.', false, 'Kapalı soru evet ya da hayır ile yanıtlanır.'],
    ['“Technology” sözcüğünde vurgu ikinci hecededir.', true, 'tek-NOL-o-gy biçiminde okunur.'],
    ['“I can’t believe it!” kayıtsızlık bildirir.', false, 'Bu ifade şaşkınlık bildirir.'],
  ], [
    ['Karşıtlık bağlacı hangisidir?', ['moreover', 'however'], 1, 'However karşıtlık kurar.'],
    ['Ekleme bağlacı hangisidir?', ['moreover', 'however'], 0, 'Moreover ek bilgi bağlar.'],
    ['“In conclusion” essay’in neresinde yer alır?', ['Giriş', 'Sonuç'], 1, 'In conclusion sonuç paragrafında kullanılır.'],
    ['Kayıtsızlık bildiren ifade hangisidir?', ['It makes no difference to me.', 'Wow, I love it!'], 0, 'It makes no difference, kayıtsızlık anlatır.'],
    ['Açık uçlu soru hangisidir?', ['Do you use social media?', 'How does social media affect your life?'], 1, 'How ile başlayan soru açıklama ister.'],
    ['“Garanti” hangisidir?', ['warranty', 'software'], 0, 'Warranty garantidir; software yazılımdır.'],
  ]),
  'ing12-pismanlik-dilek': sorular([
    ['“I wish I had studied harder” geçmişteki pişmanlığı anlatır.', true, 'Wish + had + V3, geçmiş pişmanlığıdır.'],
    ['“I wish I studied harder” geçmişteki pişmanlığı anlatır.', false, 'Wish + past simple şimdiki durumla ilgilidir.'],
    ['“I shouldn’t have said that” söylenmiş bir şeyden pişmanlığı anlatır.', true, 'Shouldn’t have + V3 geçmişteki hatayı eleştirir.'],
    ['“I wish I would” kalıbı kendi alışkanlığımızı değiştirmek için doğrudur.', false, 'Wish + would başkasının davranışı için kullanılır.'],
    ['“If only John knew about it” şimdiki bir durumu değiştirmek ister.', true, 'If only + past simple şimdiki durumu anlatır.'],
    ['“Apologise” fiilinden sonra for kullanılmaz.', false, 'Apologise to someone for something kalıbı vardır.'],
  ], [
    ['“If only I ___ up early.” (Geçmişten pişmanlık)', ['woke', 'had woken'], 1, 'Geçmiş pişmanlığı için had + V3 gerekir.'],
    ['“I wish you ___ with your phone in class.”', ['wouldn’t play', 'wouldn’t to play'], 0, 'Would’dan sonra yalın fiil gelir.'],
    ['“I’m terribly sorry ___ being late.”', ['to', 'for'], 1, 'Sorry for + V-ing kalıbı vardır.'],
    ['“She apologised ___ Ali.”', ['to', 'at'], 0, 'Apologise to someone denir.'],
    ['“You ___ called me.” (Aramamıştın.)', ['should have', 'should'], 0, 'Should have + V3 geçmişteki eksiği anlatır.'],
    ['Geçmiş pişmanlığı hangisidir?', ['I wish I listen.', 'I wish I had listened.'], 1, 'Wish + had + V3 geçmiş pişmanlığıdır.'],
  ]),
  'ing12-gelenek-davranis': sorular([
    ['“It is rude to interrupt” bir görgü kuralı bildirir.', true, 'Rude kaba demektir; kesmek kaba sayılır.'],
    ['“Considerate” sözcüğü “düşüncesiz” anlamındadır.', false, 'Considerate düşünceli demektir.'],
    ['“Date back to” kökeni geçmişe uzanan bir geleneği anlatır.', true, 'The tradition dates back centuries ifadesi böyledir.'],
    ['“Etiquette” yalnız bir yemek tarifidir.', false, 'Etiquette görgü kurallarıdır.'],
    ['“I wish people wouldn’t talk loudly on the phone” başkalarının davranışından şikâyet eder.', true, 'Wish + would başkasının davranışına yönelir.'],
    ['“Table manners” masanın boyutuyla ilgilidir.', false, 'Table manners sofra adabıdır.'],
  ], [
    ['“It is ___ to say thank you.”', ['rude', 'polite'], 1, 'Teşekkür etmek kibar bir davranıştır.'],
    ['“It is bad manners ___ interrupt.”', ['at', 'to'], 1, 'It is bad manners to + fiil kalıbı vardır.'],
    ['“Saygılı” hangisidir?', ['rude', 'respectful'], 1, 'Respectful saygılı demektir.'],
    ['“Gelenek” hangisidir?', ['custom', 'costume'], 0, 'Custom gelenek, costume kostümdür.'],
    ['Sonuç bildiren bağlaç hangisidir?', ['therefore', 'although'], 0, 'Therefore sonuç bildirir.'],
    ['Kökeni uzun yıllar öncesine uzanan gelenek?', ['dates back to', 'dates up to'], 0, 'Date back to kalıbı vardır.'],
  ]),
}
