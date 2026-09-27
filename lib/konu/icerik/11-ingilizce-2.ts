import { kart, konu, tema, type Tema } from '../tip'

/**
 * 11. sınıf İngilizce, 3. ve 4. temalar — B1.3.
 * Kaynak: tymm.meb.gov.tr/ingilizce-dersi-9-12/unite/551 ve /552.
 * Her resmî alt tema ayrı bir konu olarak işlenir.
 */
export const ingilizce11Temalar2: Tema[] = [
  tema('ing11-t3', 'Personal Life & Well-Being', [
    konu('ing11-fiziksel-saglik', 'Providing Well-Being With Physical Health', [
      kart('Well-being ne demek?', '**Well-being** yalnız hastalanmamak değil, bedenen ve ruhen iyi olmaktır.\n“I want to improve my well-being.” → “İyi oluşumu geliştirmek istiyorum.”'),
      kart('Balanced diet', '**A balanced diet** farklı besin gruplarını yeterli miktarda içerir.\n“Her diet includes vegetables, protein and whole grains.”'),
      kart('Vitamins ve minerals', '**Vitamins** ve **minerals** vücudun ihtiyaç duyduğu besin öğeleridir.\n“Fresh food provides vitamins and minerals.”'),
      kart('Calories ve protein', '**Calories** enerji miktarını; **protein** bir besin öğesini anlatır.\n“The meal has enough protein, but too many calories.”'),
      kart('Adequate', '**Adequate** “yeterli” demektir; “çok fazla” anlamına gelmez.\n“Eight hours of sleep is adequate for many teenagers.”', undefined, { not: 'İngilizcede “adequate” ile “excessive” zıt anlamlıdır: yeterli olmak aşırı olmak değildir.' }),
      kart('Posture ve stretch', '**Posture** duruş, **to stretch** esneme hareketi yapmaktır.\n“I stretched because my posture was poor after studying.”'),
      kart('Jogging', '**Jogging** hafif tempolu koşudur.\n“While my brother was jogging, I was stretching in the park.”\nİki eylem de o sırada sürüyordu: **was/were + -ing**.'),
      kart('Past simple', '**Past simple** geçmişte bitmiş eylemi anlatır.\n“She did regular exercise last year.”\nBelirli bir geçmiş dönemdeki alışkanlık burada tamamlanmış olarak görülür.'),
      kart('Past progressive', '**Past progressive** geçmişte bir anda sürmekte olan eylemi anlatır.\n“At 8 a.m., she was cycling to stay fit.”'),
      kart('When ve while', '**When** kısa olayla, **while** süren eylemle sık kullanılır.\n“While I was stretching, my phone rang.”\nEsneme sürerken telefon bir kez çaldı.'),
      kart('Treat ve rehabilitation', '**To treat** hastalığı tedavi etmek; **rehabilitation** iyileşme sürecini desteklemektir.\n“The doctor treated her injury; rehabilitation helped her walk again.”'),
      kart('Take care of', '**To take care of** “bakımını üstlenmek” ya da “özen göstermek” demektir.\n“He took care of his grandmother while she was ill.”'),
      kart('Mindfulness ve therapy', '**Mindfulness** anda olup biteni fark etme; **therapy** tedavi desteğidir.\n“She tried mindfulness exercises during rehabilitation.”\n“A massage helped her relax after jogging.”'),
    ], [], [
      { soru: '“While I was stretching, the phone rang.” Hangi eylem sürüyordu?', siklar: ['Esneme', 'Telefonun çalması'], dogru: 0, aciklama: { dogru: 'Was stretching sürmekte olan eylemdir; rang kısa olaydır.', yanlis: 'Rang bitmiş kısa eylem, was stretching ise o sırada sürüyordu.' }, kart: 10 },
      { soru: '“Adequate sleep” ne anlatır?', siklar: ['Aşırı uykuyu', 'Yeterli uykuyu'], dogru: 1, aciklama: { dogru: 'Adequate, ihtiyaç için yeterli miktardır.', yanlis: 'Adequate “aşırı” değil, “yeterli” demektir.' }, kart: 5 },
    ]),
    konu('ing11-ruhsal-saglik', 'Providing Well-Being With Mental And Emotional Health', [
      kart('Mental health', '**Mental health** düşünce, duygu ve davranışlarla ilgili iyi oluş hâlidir.\n“Rest and friendship support mental health.”'),
      kart('Balance', '**Balance** iş, okul ve dinlenme arasında denge kurmaktır.\n“She made time for both study and rest to keep a balance.”'),
      kart('Self-awareness', '**Self-awareness** kişinin duygularını ve tepkilerini fark etmesidir.\n“He noticed he felt tense before exams; this showed self-awareness.”'),
      kart('Self-esteem', '**Self-esteem** kişinin kendine verdiği değerdir.\n“Encouragement helped her build self-esteem.”'),
      kart('Burnout', '**Burnout** uzun süreli yükün yarattığı tükenmişliktir.\n“After weeks without rest, he felt burned out.”\nDuygu için “burned out” daha doğal bir kullanımdır.'),
      kart('Loneliness ve joy', '**Loneliness** yalnızlık; **joy** sevinçtir.\n“She felt lonely at first, but joining the club brought her joy.”'),
      kart('Cope with', '**To cope with** bir güçlükle başa çıkmaktır.\n“He coped with exam stress by planning breaks.”', undefined, { not: '“Cope with” güçlüğün hiç yaşanmaması değil, yaşanan güçlüğü yönetmek demektir.' }),
      kart('Cheer up ve back up', '**To cheer up** moral vermek; **to back up** destek olmaktır.\n“Her friends cheered her up and backed her up during the project.”'),
      kart('Build up ve give up', '**To build up** zamanla geliştirmek; **to give up** vazgeçmektir.\n“She built up confidence instead of giving up.”'),
      kart('Carry on ve overcome', '**To carry on** devam etmek; **to overcome** bir engeli aşmaktır.\n“He carried on practising and overcame his fear of speaking.”'),
      kart('Past eylemleri ayır', '“I was feeling anxious when my friend called.”\n**Was feeling** sürüyordu; **called** gerçekleşip bitti.\nCümle iki eylemin zaman ilişkisini kurar.'),
      kart('Destekleyici ifade', '“Keep your chin up!” birine moral vermek için kullanılır.\n“You are not alone; things will get better.” ifadesi de destek sunar.'),
      kart('Patience ve mindset', '**Patience** sabır, **a growth mindset** gelişmeye açık bakış açısıdır.\n“She struggled at first but carried on with patience.”\n“Her effort helped her fulfil her goal.”'),
    ], [], [
      { soru: '“She was feeling lonely when her friend called.” Önce hangi durum sürüyordu?', siklar: ['Yalnız hissetmesi', 'Arkadaşın araması'], dogru: 0, aciklama: { dogru: 'Was feeling süren durumu; called kısa olayı anlatır.', yanlis: 'Called tek seferlik olaydır; was feeling öncesinde sürüyordu.' }, kart: 11 },
      { soru: '“Cope with stress” hangi anlamdadır?', siklar: ['Stresi yok saymak', 'Stresle başa çıkmak'], dogru: 1, aciklama: { dogru: 'Cope with, var olan güçlüğü yönetme anlamı taşır.', yanlis: 'Cope with kaçınmak değil, güçlükle başa çıkmaktır.' }, kart: 7 },
    ]),
  ]),
  tema('ing11-t4', 'Family Life & Home', [
    konu('ing11-aile-gelenekleri', 'Family Traditions, Values, And Customs', [
      kart('Occasion', '**An occasion** özel gün veya etkinliktir.\n“Republic Day is an important occasion for our family.”'),
      kart('Reunite', '**To reunite** yeniden bir araya gelmektir.\n“Our relatives reunited for Eid al-Fitr.”'),
      kart('Come together', '**To come together** bir araya gelmektir; farklı aile üyelerini de kapsar.\n“We came together to share a meal.”'),
      kart('Ailece izlemek', '**An episode** dizinin bölümü; **a soap opera** uzun soluklu dizidir.\n“We watched one episode on a streaming service.”\n**Streaming service** çevrim içi yayın platformudur.'),
      kart('Programme türleri', '**A talent show** yetenek yarışması, **a reality show** gerçek kişilerle yapılan programdır.\n“My aunt prefers talent shows to reality shows.”'),
      kart('Contestant ve spoiler', '**A contestant** yarışmacı; **a spoiler** olayın sonucunu erkenden söyleyen bilgidir.\n“Do not tell me who won; that would be a spoiler.”'),
      kart('Tercih anlat', '**Keen on** bir şeye hevesli; **fond of** onu seviyor demektir.\n“My father is keen on outdoor sports, but I am fond of films.”'),
      kart('Yorum yap', '**Amusing** eğlenceli, **dull** sıkıcı, **violent** şiddet içeren demektir.\n“The film was amusing, but the spoiler was annoying.”\n**Annoying** rahatsız edici demektir.'),
      kart('Set up ve sing along', '**To set up** hazırlayıp kurmak; **to sing along** çalan şarkıya eşlik etmektir.\n“We set up the screen and sang along with the music.”'),
      kart('Past perfect', '**Had + fiilin üçüncü hâli** geçmişte başka olaydan önce biteni anlatır.\n“We had prepared dinner before our guests arrived.”', undefined, { not: 'Önce biten “had prepared”; daha sonra olan “arrived” ile anlatılır.' }),
      kart('Question tag', 'Olumlu cümleden sonra kısa olumsuz doğrulama sorusu gelebilir.\n“She had chosen the film, hadn’t she?”\nKonuşan seçimin doğru olduğunu onaylatır.'),
      kart('Bağlamdan çıkar', '“The family had gathered before the film started.”\nÖnce aile toplandı, sonra film başladı.\n**Had gathered** olay sırasını söyler.'),
      kart('Evde ve dışarıda', '**Indoor sports** kapalı alanda, **outdoor sports** dışarıda yapılır.\n“The family chose an indoor game because it was raining.”\n“They were willing to try something new.”'),
    ], [], [
      { soru: '“They had reunited before Eid began.” Önce ne oldu?', siklar: ['Yeniden buluşma', 'Bayramın başlaması'], dogru: 0, aciklama: { dogru: 'Had reunited, began eyleminden önce tamamlandı.', yanlis: 'Past perfect önceki olayı işaret eder: önce buluştular.' }, kart: 10 },
      { soru: '“She had chosen the film, ...?” için doğru son?', siklar: ['had she', 'hadn’t she'], dogru: 1, aciklama: { dogru: 'Olumlu past perfect cümlesinin question tag’i olumsuzdur.', yanlis: 'Olumlu cümleyi doğrulatırken “hadn’t she?” kullanılır.' }, kart: 11 },
    ]),
    konu('ing11-ev-paylasimi', 'Family Problems Related To Sharing A House And Solutions', [
      kart('Shared home', 'Evi paylaşırken **responsibility** görev ve sorumluluk demektir.\n“Everyone has a responsibility to keep shared rooms clean.”'),
      kart('Complaint ve mess', '**A complaint** şikâyet; **a mess** dağınıklıktır.\n“Her complaint was about the messy kitchen.”\n**Messy** dağınık anlamına gelir.'),
      kart('Misunderstanding', '**A misunderstanding** yanlış anlamadır; her zaman kötü niyet değildir.\n“They had a misunderstanding about who would wash the dishes.”'),
      kart('Disagreement ve conflict', '**A disagreement** görüş ayrılığıdır; büyürse **a conflict** olabilir.\n“They disagreed about the budget but avoided a conflict.”'),
      kart('Privacy', '**Privacy** kişisel alan ve mahremiyettir.\n“Knock before entering; everyone needs privacy.”'),
      kart('Budget', '**A budget** harcama planıdır.\n“We set a monthly budget for groceries.”\nOrtak masrafı önceden konuşmak gerilimi azaltabilir.'),
      kart('Expectation ve tension', '**An expectation** beklenti; **tension** gerginliktir.\n“Unspoken expectations created tension at home.”'),
      kart('Set rules ve obey', '**To set rules** kural koymak; **to obey** kurala uymaktır.\n“They set a cleaning schedule and agreed to obey it.”'),
      kart('Sort out ve figure out', '**To sort out** sorunu çözmek; **to figure out** çözümü anlamaktır.\n“We figured out the cause and sorted out the problem.”'),
      kart('Calm down ve forgive', '**To calm down** sakinleşmek; **to forgive** affetmektir.\n“He was impatient at first, but he calmed down and forgave her.”\n**Impatient** sabırsız demektir.'),
      kart('Önce-sonra ilişkisi', '“He hadn’t cleaned the kitchen before his sister arrived.”\n**Hadn’t cleaned** önceki eylemin gerçekleşmediğini gösterir.', undefined, { not: 'Past perfect olumsuzunda “had not + üçüncü hâl” kullanılır; “didn’t had” değildir.' }),
      kart('Question tag ile teyit', '“They had agreed on the rules, hadn’t they?”\nKonuşan ortak kurallar üzerinde anlaşmanın gerçekleşip gerçekleşmediğini teyit eder.'),
      kart('Look after ve put up with', '**Look after** bakımını üstlenmek, **put up with** bir duruma katlanmaktır.\n“She looked after her brother, but could not put up with the mess.”'),
    ], [], [
      { soru: '“They had set rules before the guests arrived.” Önce ne yapıldı?', siklar: ['Kurallar kondu', 'Misafirler geldi'], dogru: 0, aciklama: { dogru: 'Had set, arrived eyleminden önce tamamlanan işi anlatır.', yanlis: 'Past perfect önceliği gösterir; önce kurallar kondu.' }, kart: 11 },
      { soru: '“They had agreed, ...?” için uygun doğrulama eki?', siklar: ['had they', 'hadn’t they'], dogru: 1, aciklama: { dogru: 'Olumlu ana cümle olumsuz tag alır.', yanlis: 'Had agreed olumlu olduğu için “hadn’t they?” gerekir.' }, kart: 12 },
    ]),
  ]),
]
