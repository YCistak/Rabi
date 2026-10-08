import { kart, konu, tema, type Tema } from '../tip'

/**
 * 12. sınıf İngilizce — **2018 programı** (MEB Ortaöğretim İngilizce Dersi
 * 9–12. Sınıflar Öğretim Programı, 12th Grade: 10 tema), ilk üç tema.
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı (bkz. `12-matematik.ts`); tema
 * adları ve işlevler (Functions) programın İngilizce metninden alındı. Kart
 * açıklamaları Türkçe, örnekler İngilizce. 11. sınıf (Maarif) desteleriyle
 * çakışan dil bilgisi (edilgen, gelecek zamanlar) burada tekrar yazılmadı.
 */
export const ingilizce12Temalar1: Tema[] = [
  tema('ing12-t1', 'Music', [
    konu('ing12-muzik-fikir', 'Expressing Opinions About Music', [
      kart('Fikir bildirmek', 'Fikrini kalıp + cümle ile söyle: **I believe / I think / I suppose** + that…\n“I think live music is more exciting.” → Canlı müzik bence daha heyecan verici.\n“In my opinion, lyrics matter most.” → Bence sözler en önemlisi.'),
      kart('According to ile kaynak', '**According to** başkasının görüşünü aktarır, kendi fikrini söylemez.\n“According to the survey, most teenagers prefer pop.” → Ankete göre çoğu genç pop sever.\nKendi fikrin için: In my opinion, …'),
      kart('Fikir sormak', 'Fikir sorma kalıpları:\n- What do you think about …?\n- What are your feelings about …?\n- Why do you think that …?\n“What do you think about rock music?” → Rock müzik hakkında ne düşünüyorsun?'),
      kart('Katılmak', 'Katılma kalıpları:\n- I agree with you that … → Sana … konusunda katılıyorum.\n- I completely agree on this. → Bu konuda tamamen katılıyorum.\nKişiyle **agree with**, konuyla **agree on** kullanılır.'),
      kart('Katılmamak', '- I disagree with you on this. → Bu konuda sana katılmıyorum.\n- He doesn’t agree with him because … → Ona katılmıyor çünkü …\nKatılmamayı bir gerekçeyle destekle: “because the lyrics are weak”.'),
      kart('Kısmen katılmak', 'Tam katılmıyorsan yumuşat:\n- I tend to agree with you, but … → Sana katılma eğilimindeyim ama …\n- You have a point, but … → Haklı bir yönün var ama …'),
      kart('Çoğunluğun görüşü', '**The majority believe that …** çoğunluğun görüşünü aktarır.\n“The majority believe that music improves mood.” → Çoğunluk müziğin ruh halini iyileştirdiğine inanır.'),
      kart('Müzik sözcükleri', '- lyrics: şarkı sözleri\n- melody: ezgi\n- rhythm: ritim\n- genre: tür (pop, rock, jazz)\n“I like the melody, but the lyrics are weak.” → Ezgiyi severim ama sözler zayıf.'),
      kart('Fikri nitelemek', '- catchy: akılda kalıcı\n- soothing: yatıştırıcı\n- overrated: hak ettiğinden fazla övülen\n“This song is catchy but overrated.”', undefined, { not: 'Fikrin arkasına because ile gerekçe ekle; gerekçesiz fikir zayıf kalır.' }),
      kart('Soru tonlaması', 'Evet/hayır sorularında ses genellikle yükselir: “Do you like jazz?” ↗\nWh- sorularında genellikle düşer: “What do you think about jazz?” ↘'),
      kart('Olumsuz soruyla fikir sormak', '“Don’t you think this song is too long?” → Sence bu şarkı fazla uzun değil mi?\nOlumsuz soru, karşıdakinin de katılmasını beklediğini sezdirir.'),
    ], [], [
      { soru: '“___ the survey, most students like pop.”', siklar: ['According to', 'I believe'], dogru: 0, aciklama: { dogru: 'According to bir kaynağa dayanır: ankete göre.', yanlis: '“The survey” bir kaynak olduğu için According to gerekir; I believe kendi fikridir.' }, kart: 2 },
      { soru: '“I agree ___ you.”', siklar: ['on', 'with'], dogru: 1, aciklama: { dogru: 'Kişiyle agree with kullanılır.', yanlis: 'Agree on konuyla gelir; “you” kişi olduğu için with gerekir.' }, kart: 4 },
    ]),
    konu('ing12-muzik-tercih', 'Expressing Preferences and Music Surveys', [
      kart('Tercih bildirmek', '**prefer A to B:** B yerine A’yı tercih etmek.\n“I prefer rock to pop.” → Rock’ı pop’a tercih ederim.\n“She prefers listening to music to watching TV.” → Müzik dinlemeyi TV izlemeye tercih eder.'),
      kart('Would rather', '**would rather + yalın fiil** (than + yalın fiil)\n“I’d rather go to a concert than stay at home.” → Evde kalmaktansa konsere giderim.\n“I’d rather have tickets for the opera.”'),
      kart('If I had a choice', '“If I had a choice, I would go for classical music.” → Seçme şansım olsaydı klasik müziği seçerdim.\nYapı: If + past simple, would + yalın fiil.'),
      kart('Sevgi ve nefret derecesi', '- I’m into hip-hop. → Hip-hop’a meraklıyım.\n- I’m fond of folk music. → Halk müziğinden hoşlanırım.\n- I can’t stand loud music. → Yüksek sesli müziğe dayanamam.'),
      kart('Tercihi gerekçelendirmek', '**because** + cümle; **because of** + isim öbeği.\n“I like jazz because it is relaxing.”\n“I like jazz because of its relaxing sound.”'),
      kart('Anket (survey) nedir?', 'Survey, birçok kişiye aynı soruları sorup yanıtları toplamaktır.\n- Soru hazırlanır: “What kind of music do you listen to?”\n- Yanıtlar sayılır ve tabloya geçirilir.'),
      kart('Yüzdeleri yorumlamak', '- The majority (65%) prefer pop. → Çoğunluk (%65) pop sever.\n- Only a small number (10%) like jazz. → Az bir kısım (%10) cazı sever.\n“A quarter of them listen to rock.” → Dörtte biri rock dinler.'),
      kart('Anket raporunun yapısı', 'Rapor üç bölümden oluşur:\n- Introduction: amaç ve katılımcılar\n- Findings: sayılarla bulgular\n- Conclusion: kısa sonuç'),
      kart('Sonuç cümlesi', '“In conclusion, the majority of students prefer pop, whereas few like classical music.”\nWhereas karşıt iki bulguyu tek cümlede toplar.', undefined, { not: 'Bulgular bölümüne kendi yorumunu değil, sayıları yaz; yorum sonuçta kalsın.' }),
      kart('Anket soru türleri', '“How often do you listen to music?” → sıklığı sorar.\n“Which genre do you like best?” → türü sorar.\nSeçenekleri baştan yaz: always, sometimes, never.'),
      kart('Röportaj yapmak', 'Röportajda açık uçlu soru sor: “Why do you prefer live music?”\nYanıtı not alıp kısaca özetle: “Mina prefers live music because it is exciting.”'),
    ], [], [
      { soru: '“I prefer walking ___ driving.”', siklar: ['to', 'than'], dogru: 0, aciklama: { dogru: 'Prefer A to B kalıbında to kullanılır.', yanlis: 'Prefer ile than kullanılmaz; would rather yapısında than gelir.' }, kart: 2 },
      { soru: '“I’d rather ___ at home tonight.”', siklar: ['staying', 'stay'], dogru: 1, aciklama: { dogru: 'Would rather’dan sonra yalın fiil gelir.', yanlis: 'Would rather + V-ing kullanılmaz; yalın fiil gerekir.' }, kart: 7 },
    ]),
  ]),
  tema('ing12-t2', 'Friendship', [
    konu('ing12-arkadaslik-ozellik', 'Describing Personal Features', [
      kart('Görünüşü ve kişiliği sormak', '**What does she look like?** → Nasıl görünüyor? (boy, saç, yüz)\n**What kind of person is she?** → Nasıl biri? (huy, kişilik)\nİlk soru görünüşü, ikincisi kişiliği sorar.'),
      kart('Fiziksel özellikler', '- tall / short: uzun / kısa boylu\n- slim / plump: ince / tombul\n- curly / straight hair: kıvırcık / düz saç\n- good-looking: çekici'),
      kart('Kişilik sıfatları', '- generous: cömert\n- supportive: destekleyici\n- helpful: yardımsever\n- patient: sabırlı\n- shy / outgoing: utangaç / dışa dönük'),
      kart('Look + sıfat', '**look + sıfat** görünüşten edinilen izlenimi verir.\n“He looks much younger.” → Çok daha genç görünüyor.\n“She looks tired.” → Yorgun görünüyor.\nİsimle: **look like** → “She looks like her mother.”'),
      kart('Much + karşılaştırma', 'Karşılaştırmayı güçlendirmek için **much / far / a lot** + comparative kullanılır.\n“He looks much younger than his brother.”\n“Very younger” denmez; **much younger** denir.'),
      kart('as … as', '**as + sıfat + as** eşitlik anlatır.\n“Tom is as handsome as his brother.” → Tom ağabeyi kadar yakışıklı.\nOlumsuz: “not as tall as” → … kadar uzun değil.'),
      kart('Behave like', '“a person who behaves like a child” → çocuk gibi davranan biri\n“He behaves badly.” → Kötü davranıyor.\nBehave fiilinden sonra sıfat değil zarf gelir.'),
      kart('Yaş anlatmak', '**in his 60s** → altmışlı yaşlarında\n“She is in her early 20s.” → Yirmili yaşlarının başında.\nTahmin: “He must be about 40.” → Yaklaşık 40 yaşında olmalı.'),
      kart('Who ile kişi tanımlamak', '**who** kişiyi tanımlar.\n“She is a girl who always helps others.”\n“Someone who tells the truth is honest.”', undefined, { not: 'Kişi için who, nesne için which: “a friend which” hatalıdır.' }),
      kart('Sözcük vurgusu', 'Vurgu -eer ile biten sözcüklerde genellikle son hecededir.\nengineer /ˌendʒɪˈnɪə(r)/ — volunteer /ˌvɒlənˈtɪə(r)/\nVurgu anlamı değil, sesleniş doğruluğunu belirler.'),
      kart('Kısa tanım paragrafı', 'Önce görünüş, sonra kişilik yaz:\n- “Anna is tall and slim.”\n- “She has long, straight hair.”\n- “She is patient and always listens.”'),
    ], [], [
      { soru: '“He looks ___ younger than his age.”', siklar: ['very', 'much'], dogru: 1, aciklama: { dogru: 'Karşılaştırmayı much güçlendirir.', yanlis: 'Very, comparative ile kullanılmaz; much younger denir.' }, kart: 5 },
      { soru: '“She is a girl ___ always helps others.”', siklar: ['who', 'which'], dogru: 0, aciklama: { dogru: 'Kişiyi tanımlamak için who kullanılır.', yanlis: 'Which nesne içindir; kişi için who gerekir.' }, kart: 9 },
    ]),
    konu('ing12-arkadaslik-cikarim', 'Making Conclusions and Stating Reasons', [
      kart('Kesin çıkarım', 'Güçlü kanıta dayanan sonuç: **must be** (olumlu), **can’t be** (olumsuz).\n“She writes to him every day. She must be his best friend.”'),
      kart('Zayıf olasılık', 'Zayıf olasılık için **might / may / could** kullanılır.\n“He might be shy.” → Utangaç olabilir.\n“He can’t be shy.” → Utangaç olamaz (kesin).'),
      kart('Geçmişe çıkarım', 'Geçmiş için: **must / can’t / might + have + V3**.\n“She must have missed the bus.” → Otobüsü kaçırmış olmalı.\n“He can’t have forgotten.” → Unutmuş olamaz.'),
      kart('Neden bildirmek', '- because + cümle\n- because of + isim öbeği\n- since / as + cümle: çünkü\n- so / therefore: bu yüzden'),
      kart('Benzerlik kalıpları', '“Kyle and Randy are similar because they are both athletic.”\n“Claire and Vivian are similar in that they both love animals.”\n**similar because / in that** + cümle ile gelir.'),
      kart('Farkı anlatmak', '**differ in** → … bakımından ayrışmak\n“The twins differ in their attitude towards animals.”\n**whereas / while** karşıtlık kurar: “Ali is shy, whereas Can is outgoing.”'),
      kart('Ortak yönler', '“What do you have in common with …?” → … ile ortak yönün ne?\n“We have a lot in common.” → Çok ortak yönümüz var.\n“One similarity between Tom and John is …”'),
      kart('Grafik ve tabloyu yorumlamak', 'Tablodan sonuç çıkarırken: “The chart shows that …”, “According to the table, …”.\nVeriden çıkan sonucu ayrıca yaz: “This means that …”'),
      kart('İyi arkadaş essay’i', '“A good friend is generous, supportive, helpful and patient.”\n“A friend in need is a friend indeed.” → Dost kara günde belli olur.', undefined, { not: 'Her özelliğe bir neden ve örnek ekle; yalnız sıfat sıralamak essay olmaz.' }),
      kart('Opinion essay yapısı', '- Giriş: görüşünü söyle\n- Gelişme: her paragrafta bir özellik ve neden\n- Sonuç: görüşünü yinele'),
      kart('Konu dışı cümleyi bulmak', 'Okuma sorusunda konuyla ilgisiz cümle aranır.\nHer cümleye sor: aynı kişiyi mi, aynı konuyu mu anlatıyor?\nSonuç bağlaçları: so, therefore, as a result.'),
    ], [], [
      { soru: '“He ___ be in his 60s; he looks very young.”', siklar: ['can’t', 'must'], dogru: 0, aciklama: { dogru: 'Kesin olumsuz çıkarım için can’t be kullanılır.', yanlis: 'Must kesin olumlu çıkarımdır; burada olumsuz sonuç gerekir.' }, kart: 2 },
      { soru: '“She passed. She ___ have studied hard.”', siklar: ['can’t', 'must'], dogru: 1, aciklama: { dogru: 'Kanıt olumlu olduğu için must have studied denir.', yanlis: 'Can’t have studied çalışmadığı sonucunu verirdi; kanıt tersini gösteriyor.' }, kart: 3 },
    ]),
  ]),
  tema('ing12-t3', 'Human Rights', [
    konu('ing12-insan-haklari', 'Expressing Ideas on Human Rights', [
      kart('Human rights nedir?', 'Human rights, her insanın doğuştan sahip olduğu temel haklardır.\n“Everyone deserves equal rights.” → Herkes eşit haklara layıktır.\n“Freedom of expression is a basic human right.”'),
      kart('The right to', '**have the right to** + fiil; **the right to** + isim.\n“Every child has the right to get health services, food and education.”'),
      kart('Gender equality', '- gender equality: cinsiyet eşitliği\n- discrimination: ayrımcılık\n- equal opportunity: fırsat eşitliği\n“Women and men should have equal pay.”'),
      kart('Çocuk hakları', '- child labour: çocuk işçiliği\n- protection: korunma\n- education: eğitim\n“Child labour violates children’s rights.”'),
      kart('Disadvantaged ve disabled', '- disadvantaged: dezavantajlı\n- disabled: engelli\n- disability: engellilik\n“Disabled people need equal access to public buildings.”'),
      kart('Hayvan hakları', 'Haklar yalnız insanlar için anlatılmaz: **animal rights** hayvan haklarıdır.\n“Animals should not be kept in cruel conditions.”'),
      kart('Olumlu ve olumsuz fiiller', '- Olumlu: protect, respect, support\n- Olumsuz: violate, deny, abuse\n“The law protects workers.”\n“The company denied them their rights.”'),
      kart('Atasözü', '“Look after those who looked after you.” → Sana bakanlara sen de bak.\n**those who** = olan kişiler.'),
      kart('Slogan yazmak', 'Slogan kısa olur: “Equal rights for all!”, “Respect differences, build peace.”\nKarşısındakine seslenen emir cümlesi etkili olur.', undefined, { not: 'Slogan tek fikir taşısın; uzun açıklamayı essay’e bırak.' }),
      kart('Hak ve sorumluluk', 'Right hak, duty / responsibility görevdir.\n“We have the right to speak, but we also have a duty to respect others.”'),
      kart('Evrensel Beyanname', 'İnsan Hakları Evrensel Beyannamesi (1948) 1. madde:\n“All human beings are born free and equal in dignity and rights.”\nTüm insanlar özgür doğar; haklar bakımından eşittir.'),
    ], [], [
      { soru: '“Everyone has the right ___ education.”', siklar: ['to', 'of'], dogru: 0, aciklama: { dogru: '“The right to” kalıbı kullanılır.', yanlis: 'Right ile of değil to kullanılır: the right to education.' }, kart: 2 },
      { soru: '“The company ___ them their rights.” Hangi fiil “reddetmek” anlamında?', siklar: ['deserved', 'denied'], dogru: 1, aciklama: { dogru: 'Deny reddetmek, hakkı vermemektir.', yanlis: 'Deserve “layık olmak”tır; haktan mahrum bırakmak denied ile anlatılır.' }, kart: 7 },
    ]),
    konu('ing12-oneri-sorunlar', 'Making Suggestions and Discussing Problems', [
      kart('Should ve ought to', '**should** ve **ought to** + yalın fiil: öneri verir.\n“All the governments should do their best to meet the needs of disabled people.”\n“We ought to listen to the victims.”'),
      kart('Güçlü zorunluluk', '**must** güçlü zorunluluk, **have to** dışarıdan gelen zorunluluktur.\n“Governments must respect human rights.”\n“Employers have to give equal pay.”'),
      kart('Öneri kalıpları', '- Let’s start a campaign.\n- Why don’t we write to the mayor?\n- How about organising a charity event?\nHow about’tan sonra V-ing gelir.'),
      kart('Suggest', '“I suggest that the school should build a ramp.”\n“I suggest building a ramp.”\nSuggest’ten sonra to + fiil gelmez: “suggest to build” hatalıdır.'),
      kart('Sorun anlatmak', '- difficulty: güçlük\n- barrier: engel\n- lack of: eksikliği\n“Lack of access to schools is a serious problem.”'),
      kart('Neden ve sonuç', '- because of / due to + isim: … nedeniyle\n- lead to / result in: yol açmak\n“Poverty leads to a lack of education.”'),
      kart('Karşıt bilgi eklemek', 'Dengeli tartışma için **however** kullan.\n“Some countries have improved; however, many children still cannot attend school.”'),
      kart('Tartışma sorusu', '“Do the educational opportunities for disabled young people grow rapidly?”\nÖzne çoğulsa **Do**, tekilse **Does**: “Does the government support them?”'),
      kart('Çözüm önermek', 'Sorunun yanına çözüm ekle: “The problem is … One solution is …”\n“If schools had ramps, disabled students could enter easily.”', undefined, { not: 'Essay’de her soruna bir çözüm koy; yalnız şikâyet etmek yetmez.' }),
      kart('Argumentative essay', '- Giriş: konu ve görüşün\n- Gelişme: sorun, neden, çözüm\n- Sonuç: görüşün güçlendirilmesi'),
      kart('Sözcük vurgusu', '**-ity** biten sözcükte son ekten önceki hece vurgulanır: e-QUAL-i-ty, dis-a-BIL-i-ty.\n**-tion** için de aynı: dis-crim-i-NA-tion.'),
    ], [], [
      { soru: '“How about ___ a campaign?”', siklar: ['to start', 'starting'], dogru: 1, aciklama: { dogru: 'How about’tan sonra V-ing gelir.', yanlis: 'How about + to fiil kullanılmaz; starting gerekir.' }, kart: 3 },
      { soru: '“___ the opportunities for children grow?”', siklar: ['Does', 'Do'], dogru: 1, aciklama: { dogru: 'Opportunities çoğul olduğu için Do gerekir.', yanlis: 'Does tekil özneyle kullanılır; opportunities çoğuldur.' }, kart: 8 },
    ]),
  ]),
]
