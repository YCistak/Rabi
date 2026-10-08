import { kart, konu, tema, type Tema } from '../tip'

/** 12. sınıf İngilizce (2018 programı): News Stories ve Alternative Energy temaları. */
export const ingilizce12Temalar3: Tema[] = [
  tema('ing12-t7', 'News Stories', [
    konu('ing12-haber-anlatim', 'Narrating Past Events in News Stories', [
      kart('Haberin yapısı', 'Haber önce olayı özetler: kim, ne, nerede, ne zaman.\n“Two people were struck and injured on Monday as they tried to cross the street.”\nAyrıntılar sonra gelir.'),
      kart('Olayları sıralamak', 'Sıralama sözcükleri: **first, then, after that, next, finally.**\nProgram örnekleri: “After …”, “Before …”, “Following this event, …”'),
      kart('Meanwhile', '**Meanwhile** = bu arada (aynı sırada başka bir olay).\n“Firefighters arrived. Meanwhile, the police closed the road.”\n**Following this event** = bu olayın ardından.'),
      kart('Past perfect ile öncelik', 'Daha önce tamamlanan olay: **had + V3**.\n“When he died, he had already published 20 novels.” → Öldüğünde 20 roman yayımlamıştı bile.\nİpucu: already, by the time, before.'),
      kart('After ve before', '**After** + past perfect: önce biten olay.\n“After he had finished the report, he left.”\n“He had locked the door before he left.”'),
      kart('As ile eş zamanlılık', '**as** “iken” anlamıyla iki olayı aynı anda bağlar.\n“The accident happened as he was driving home.”\n“Two people were injured as they tried to cross the street.”'),
      kart('Fortunately / Unfortunately', 'Tutum zarfları cümlenin başına gelir, virgülle ayrılır.\n“Fortunately, he survived the accident without a scratch.” → Neyse ki hiç yara almadan kurtuldu.\n“Unfortunately, I missed the last episode.”'),
      kart('Kaza sözcükleri', '- injure: yaralamak\n- survive: sağ kurtulmak (nesne alır)\n- rescue: kurtarmak\n- witness: görgü tanığı\n“He survived the accident.”'),
      kart('Remind of', '“That reminds me of my childhood.” → Bu bana çocukluğumu anımsatıyor.\n**remind someone of** = birine bir şeyi anımsatmak.', undefined, { not: 'Remind of birine anımsatır; remember kendi anımsayışındır: remind ≠ remember.' }),
      kart('Aynı anlamı başka sözle', 'Paraphrase: anlam aynı, söyleyiş farklı.\n“He survived without a scratch.” → “He was not hurt at all.”\nBu, YDT’de “anlamca en yakın cümle” sorusudur.'),
      kart('Başlık dili', 'Haber başlığı genellikle simple present ile yazılır: “Fire destroys old market”.\nHaberin gövdesi ise geçmişte anlatılır.'),
    ], [], [
      { soru: '“When I arrived, the film ___ already started.”', siklar: ['has', 'had'], dogru: 1, aciklama: { dogru: 'Önce biten olay past perfect ile verilir: had started.', yanlis: 'Has started present perfect’tir; geçmişteki sıra için had gerekir.' }, kart: 4 },
      { soru: '“After she ___ dinner, she watched TV.”', siklar: ['was eating', 'had eaten'], dogru: 1, aciklama: { dogru: 'After’dan sonra önce biten olay had eaten ile verilir.', yanlis: 'Was eating süren eylemdir; tamamlanan eylem için had eaten gerekir.' }, kart: 5 },
    ]),
    konu('ing12-haber-uretim', 'Presenting and Writing News Stories', [
      kart('Garip haber sözcükleri', '- unusual: alışılmadık\n- odd: tuhaf\n- bizarre: çok garip\n- surprising: şaşırtıcı\n“It was an odd story: a dog delivered the newspaper.”'),
      kart('Olayı özetlemek', 'Özetin içinde kim, ne, nerede, ne zaman, neden olmalı.\n“A fire broke out in a market on Sunday night.”'),
      kart('Haberde phrasal verbs', '- break out: patlak vermek\n- take place: gerçekleşmek\n- turn out: sonuçlanmak\n- carry out: yürütmek\n“The festival took place last week.”'),
      kart('Tanık sözü', 'Haberde tanıklar alıntılanır:\n“I heard a loud noise,” said the witness.\nFiiller: said, told, reported, claimed.'),
      kart('Say ve tell', 'Say + söz, tell + kişi alır.\n“He said he was fine.”\n“He told me he was fine.”\n“He said me” hatalıdır.'),
      kart('Zaman geçişleri', '- at first: önce\n- later / soon after: sonra\n- suddenly: birden\n- eventually: sonunda'),
      kart('Geçmiş alışkanlık', '**used to + yalın fiil** geçmişte bırakılmış alışkanlığı anlatır.\n“We used to visit my grandmother every summer.”'),
      kart('Dizi sözcükleri', '- episode: bölüm\n- series: dizi\n- plot: olay örgüsü\n“Unfortunately, I missed the last episode of my favourite series.”'),
      kart('Bağlaçla boşluk doldurmak', 'Bağlaçlar: however, therefore, meanwhile, as a result, in addition.\nBoşluğa seçmeden önce iki cümlenin ilişkisini adlandır.', undefined, { not: 'Önce iki cümlenin ilişkisini (neden, karşıtlık, sıra) belirle, sonra bağlacı seç.' }),
      kart('Cümleleri sıralamak', 'Karışık cümleleri sıralarken ipuçları:\n- ismi tanıtan cümle önce gelir\n- zaman ifadeleri sırayı gösterir\n- zamir, ismin ardından gelir'),
      kart('Hikâye yazmak', 'Hikâye üç bölümdür: giriş (kişi, yer), sorun, çözüm.\n“One day … Suddenly … In the end …”'),
    ], [], [
      { soru: '“The festival ___ place last week.”', siklar: ['took', 'made'], dogru: 0, aciklama: { dogru: 'Take place, gerçekleşmek demektir.', yanlis: 'Make place kalıbı yoktur.' }, kart: 3 },
      { soru: '“He ___ me he was fine.”', siklar: ['said', 'told'], dogru: 1, aciklama: { dogru: 'Tell kişiyle birlikte kullanılır: told me.', yanlis: 'Said’den sonra kişi nesnesi doğrudan gelmez.' }, kart: 5 },
    ]),
  ]),
  tema('ing12-t8', 'Alternative Energy', [
    konu('ing12-enerji-sorun', 'Describing Energy Problems and Making Complaints', [
      kart('Enerji sorunları', '- excessive consumption: aşırı tüketim\n- fossil fuels: fosil yakıtlar\n- shortage: kıtlık\n“Burning fossil fuels pollutes the air.”'),
      kart('Alternatif kaynaklar', '- solar: güneş\n- wind: rüzgâr\n- hydroelectric: su gücü\n- geothermal: yer ısısı\n- biomass: biyokütle'),
      kart('Renewable ve non-renewable', '**Renewable** tükenmeyen kaynaktır: güneş, rüzgâr.\n**Non-renewable** tükenir: kömür, petrol, doğal gaz.\n“Coal is non-renewable.”'),
      kart('Nazik şikâyet', '“Sorry to bother you, but I think there’s a problem that requires an urgent solution.”\nÖnce özür dile, sonra sorunu söyle.'),
      kart('Şikâyet kalıpları', '- I’m writing to complain about …\n- We’d like you to …\n“We’d like you to reduce the noise.”\nWould like + nesne + **to** + fiil.'),
      kart('Don’t get me wrong', '“Don’t get me wrong, but I think we should …” → Yanlış anlama, ama bence …\nEleştiriyi yumuşatır.'),
      kart('Neden ve sonuç', '**result from** nedeni, **result in** sonucu bildirir.\n“The blackout resulted from high demand.”\n“High demand resulted in a blackout.”'),
      kart('Forget to', '“Maybe you forgot to switch off the lights.” → Belki ışıkları kapatmayı unuttun.\n**forget to + fiil** yapılacak işi unutmaktır; **forget V-ing** yapılmış işi unutmaktır.'),
      kart('Şikâyet mektubu', 'Mektup sırası: neden yazıyorsun, sorun, talep, kapanış.\n“I am writing to complain about the noise from the power plant.”', undefined, { not: 'Sorunu açık yaz, ne istediğini tek cümleyle belirt.' }),
      kart('Düşen tonlama', 'Bildirme cümlelerinde ses sonda düşer: “I think we’re completely lost.” ↘\nÖnce vurgulu sözcükte yükselir, sonra düşer.'),
      kart('Enerji tüketimi çözümleri', 'Notlarda çözüm sözcükleri: reduce, save, recycle, switch to renewables.\n“We should switch to solar energy.”'),
    ], [], [
      { soru: '“Maybe you forgot ___ the lights.”', siklar: ['to switch off', 'switching off'], dogru: 0, aciklama: { dogru: 'Yapılması gereken işi unutmak forget to ile anlatılır.', yanlis: 'Forget V-ing yapılmış bir işi unutmaktır.' }, kart: 8 },
      { soru: 'The blackout resulted ___ high demand.', siklar: ['in', 'from'], dogru: 1, aciklama: { dogru: 'Result from nedeni bildirir.', yanlis: 'Result in sonucu bildirir; burada neden verilmiştir.' }, kart: 7 },
    ]),
    konu('ing12-enerji-cozum', 'Offering Solutions and Debating Alternative Energy', [
      kart('Çözüm önermek', '- I think we should …\n- The solution to this problem is …\n- Another way of looking at this problem is …'),
      kart('Sıra bildiren çözüm', '“In order to solve this problem, we must first reduce waste.”\nSıra: first, then, finally.'),
      kart('Would like you to', '“We’d like you to turn off the machines at night.”\nBir isteği nazikçe başkasından beklemek için kullanılır.'),
      kart('Enerji tasarrufu', '- switch off: kapatmak\n- unplug: fişi çekmek\n- insulate: yalıtmak\n- energy-efficient: enerji tasarruflu'),
      kart('Güneş ve rüzgâr', 'Her kaynağın iki yönü vardır:\n- Solar: temiz ama güneşe bağımlı.\n- Wind: temiz ama yer ister ve gürültü yapabilir.'),
      kart('Lehte ve aleyhte', '“I’m in favour of wind energy because it is clean.” → Rüzgâr enerjisinden yanayım.\n“I’m against nuclear plants because of the risk.” → Karşıyım.'),
      kart('Metni özetlemek', 'Özet: ana fikir + iki üç destek.\nÖzeti kendi sözlerinle yaz; metinden cümle kopyalama.'),
      kart('Önlem almak', 'Çözüm sözcükleri: solution, measure, action.\n“The government took measures to reduce waste.” → Hükümet israfı azaltmak için önlem aldı.'),
      kart('Biyoyakıt', '**Biofuel** bitkilerden elde edilen yakıttır.\n“Biofuel can replace some of the petrol.”', undefined, { not: 'Alternatif enerjide hem yararı hem sınırı yaz; tek yönlü anlatım zayıf kalır.' }),
      kart('Görüş paragrafı', '“In my opinion, … because … For example, …”\nHer görüşün yanına neden ve örnek ekle.'),
      kart('Resmî e-posta', '“Dear Sir or Madam, I am writing to complain about … I would be grateful if you could …”\n“Yours faithfully”.'),
    ], [], [
      { soru: 'Hangisi “önlem almak” demektir?', siklar: ['take measures', 'make measures'], dogru: 0, aciklama: { dogru: 'Take measures önlem almaktır.', yanlis: 'Make measures kalıbı yoktur.' }, kart: 8 },
      { soru: '“She is ___ nuclear plants because of the risk.”', siklar: ['for', 'against'], dogru: 1, aciklama: { dogru: 'Risk gerekçesi karşı çıkmayı destekler.', yanlis: 'For lehte demektir; risk nedeniyle against gerekir.' }, kart: 6 },
    ]),
  ]),
]
