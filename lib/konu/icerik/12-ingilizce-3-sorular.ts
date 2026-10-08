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

/** 12. sınıf İngilizce (2018 programı): News Stories ve Alternative Energy temalarının konu sonu soruları. */
export const ingilizce12Sorulari3: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'ing12-haber-anlatim': sorular([
    ['“When he died, he had already published 20 novels” cümlesinde romanlar ölümden önce yayımlanmıştır.', true, 'Had published, ölümden önce tamamlanan olayı gösterir.'],
    ['Past perfect, iki geçmiş olaydan sonra gerçekleşeni anlatır.', false, 'Past perfect önce gerçekleşeni anlatır.'],
    ['“Meanwhile” aynı sırada gelişen başka bir olaya geçiş sağlar.', true, 'Meanwhile “bu arada” demektir.'],
    ['“Fortunately” kötü bir gelişmeyi bildirir.', false, 'Fortunately “neyse ki” demektir; iyi gelişmeyi bildirir.'],
    ['“That reminds me of my childhood” cümlesinde remind of kalıbı vardır.', true, 'Remind someone of, bir şeyi anımsatmaktır.'],
    ['“He survived the accident” cümlesinde adam kazada ölmüştür.', false, 'Survive, sağ kurtulmak demektir.'],
  ], [
    ['“When I arrived, the film ___ already started.”', ['has', 'had'], 1, 'Önce biten olay had started ile verilir.'],
    ['“After she ___ dinner, she watched TV.”', ['was eating', 'had eaten'], 1, 'After’dan sonra önce biten olay had eaten ile verilir.'],
    ['“___, he survived without a scratch.”', ['Fortunately', 'Unfortunately'], 0, 'Yara almadan kurtulmak olumlu bir gelişmedir.'],
    ['“The accident happened ___ he was driving home.”', ['as', 'so'], 0, 'As “iken” anlamıyla eş zamanlılık kurar.'],
    ['“Bu arada” anlamındaki sözcük hangisidir?', ['Finally', 'Meanwhile'], 1, 'Meanwhile eş zamanlı olayı bağlar.'],
    ['Haber başlığı genellikle hangi zamanla yazılır?', ['Simple present', 'Past perfect'], 0, 'Başlıklar kısa ve canlı olduğu için simple present kullanır.'],
  ]),
  'ing12-haber-uretim': sorular([
    ['“Take place” gerçekleşmek anlamına gelir.', true, 'The festival took place last week: festival gerçekleşti.'],
    ['“He said me he was fine” doğru bir cümledir.', false, 'Said kişi nesnesi almaz; he told me denir.'],
    ['“Used to” geçmişteki alışkanlığı anlatır.', true, 'We used to visit her every summer: eskiden ziyaret ederdik.'],
    ['“Eventually” bir olayın hemen başladığını anlatır.', false, 'Eventually “sonunda” demektir.'],
    ['“Episode” dizinin bir bölümüdür.', true, 'Episode bölüm demektir.'],
    ['“However” aynı yönde ek bilgi verir.', false, 'However karşıtlık kurar.'],
  ], [
    ['“The festival ___ place last week.”', ['took', 'made'], 0, 'Take place kalıbı kullanılır.'],
    ['“He ___ me he was fine.”', ['said', 'told'], 1, 'Tell kişi nesnesiyle kullanılır.'],
    ['“We ___ visit my grandmother every summer.”', ['used to', 'use to'], 0, 'Geçmiş alışkanlık için used to denir.'],
    ['“Sonunda” hangisidir?', ['suddenly', 'eventually'], 1, 'Eventually sonunda demektir.'],
    ['“The road was closed; ___, traffic was heavy.”', ['as a result', 'however'], 0, 'Birinci cümle ikincinin nedenidir.'],
    ['“Patlak vermek” hangisidir?', ['break up', 'break out'], 1, 'Break out patlak vermektir.'],
  ]),
  'ing12-enerji-sorun': sorular([
    ['“Coal is non-renewable” kömürün tükenebilen bir kaynak olduğunu söyler.', true, 'Non-renewable tükenen kaynağı anlatır.'],
    ['“Solar” sözcüğü rüzgâr enerjisini anlatır.', false, 'Solar güneş, wind rüzgârdır.'],
    ['“Don’t get me wrong, but …” kalıbı eleştiriyi yumuşatır.', true, 'Karşıdakinin yanlış anlamasını engellemek için kullanılır.'],
    ['“I forgot switching off” ifadesi “kapatmayı unuttum” için doğrudur.', false, 'Yapılacak işi unutmak forget to switch off ile anlatılır.'],
    ['“The blackout resulted from high demand” nedeni belirtir.', true, 'Result from neden bildirir.'],
    ['“Result in” neden, “result from” sonuç bildirir.', false, 'Result in sonucu, result from nedeni bildirir.'],
  ], [
    ['“Maybe you forgot ___ the lights.”', ['to switch off', 'switching off'], 0, 'Yapılacak işi unutmak forget to ile verilir.'],
    ['The blackout resulted ___ high demand.', ['in', 'from'], 1, 'Neden için result from kullanılır.'],
    ['Hangisi yenilenebilir enerjidir?', ['coal', 'wind'], 1, 'Rüzgâr tükenmeyen bir kaynaktır.'],
    ['Nazik şikâyet girişi hangisidir?', ['Sorry to bother you, but …', 'Listen, you must …'], 0, 'Özürle başlayan giriş daha naziktir.'],
    ['“Güneş enerjisi” hangisidir?', ['solar energy', 'wind energy'], 0, 'Solar güneşle ilgilidir.'],
    ['“We’d like you ___ the noise.”', ['reduce', 'to reduce'], 1, 'Would like + nesne + to fiil kalıbı vardır.'],
  ]),
  'ing12-enerji-cozum': sorular([
    ['“I’m in favour of wind energy” rüzgâr enerjisini desteklediğini söyler.', true, 'In favour of, destekliyorum demektir.'],
    ['“Against” bir fikri desteklemek anlamına gelir.', false, 'Against karşı olmayı anlatır.'],
    ['“Take measures” önlem almak demektir.', true, 'The government took measures: hükümet önlem aldı.'],
    ['“Insulate” ışığı açmak demektir.', false, 'Insulate yalıtmak demektir.'],
    ['“Biofuel” bitkilerden elde edilir.', true, 'Biofuel bitkisel kaynaklı yakıttır.'],
    ['“Another way of looking at this problem is …” sorunu görmezden gelmeyi anlatır.', false, 'Bu kalıp sorunu başka açıdan değerlendirmeyi anlatır.'],
  ], [
    ['“Önlem almak” hangisidir?', ['take measures', 'make measures'], 0, 'Take measures önlem almaktır.'],
    ['“She is ___ nuclear plants because of the risk.”', ['for', 'against'], 1, 'Risk nedeniyle karşıdır.'],
    ['Enerji tasarrufu için hangisi uygundur?', ['Switch off the lights.', 'Leave the lights on.'], 0, 'Işığı kapatmak enerji tasarrufu sağlar.'],
    ['Özet nasıl yazılır?', ['Metni kopyalayarak', 'Kendi sözlerinle'], 1, 'Özet kendi sözlerinle yazılır.'],
    ['Güneş enerjisinin sınırı hangisidir?', ['Güneşe bağımlıdır', 'Hiç tükenmez'], 0, 'Solar enerji güneş ışığına bağlıdır.'],
    ['“We ___ first reduce waste.”', ['must to', 'must'], 1, 'Must’tan sonra to gelmez.'],
  ]),
}
