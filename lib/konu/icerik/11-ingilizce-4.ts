import { kart, konu, tema } from '../tip'
import type { Tema } from '../tip'

/** TYMM İngilizce 11, B1.3: yedinci ve sekizinci temaların alt başlıkları. */
export const ingilizce11Temalar4: Tema[] = [
  tema('ing11-t7', 'Life In Nature & Global Problems', [
    konu('ing11-kuresellesme', 'Globalisation, Problems And Solutions', [
      kart('Küreselleşmeyi anlatmak', 'Globalisation, ülkeler arasındaki ticaretin, bilginin ve kültürel temasın artmasıdır.\n“Trade connects distant communities.” cümlesi bu bağlantıyı anlatır.'),
      kart('Farklı iki sonuç', '“Cultural exchange” fikir ve geleneklerin karşılıklı paylaşımıdır.\n“Job loss” ise bazı işlerin kaybıdır; bir metinde ikisi de geçiyorsa yalnızca yarara odaklanma.'),
      kart('Yaşam düzeyi', '“Standard of living” gelirden fazlasını kapsar: barınma, sağlık ve eğitime erişimi de düşün.\n“A higher income does not always mean a better standard of living.”'),
      kart('Kültürel çeşitlilik', '“Cultural diversity” farklı kültürlerin aynı toplumda bulunmasıdır.\n“Cross-cultural” ise kültürler arası bir ilişkiyi niteler: “a cross-cultural project”.'),
      kart('Sorun ile çözümü ayır', '“A health crisis affects several countries.” sorun cümlesidir.\n“Governments should share medical supplies.” ise çözüm önerir; iki cümleyi aynı işlevde okuma.'),
      kart('Politika ve düzenleme', '“Policy” kurumun benimsediği ilke veya eylem planıdır.\n“To regulate” kurallarla düzenlemek demektir: “A policy can regulate trade.”'),
      kart('Fiiller bağlama göre değişir', '“Trade” alıp satmak, “supply” ihtiyaç duyulan şeyi sağlamak demektir.\n“Factories supply goods” ile “countries trade goods” aynı ilişkiyi kurmaz.'),
      kart('Phrasal verb: face up to', '“Face up to a problem” sorunun varlığını kabul edip onunla yüzleşmektir.\n“Come up with a solution” ise çözüm üretmektir; sıralamada önce sorun, sonra çözüm gelir.'),
      kart('Gelecekte süren eylem', 'Future progressive: **will be + -ing**.\n“At this time next year, firms will be trading.”\nGelecekte belirli anda devam eden bir eylemi anlatır.'),
      kart('Gelecekte süren edilgen', '“New rules will be being discussed” gelecekte tartışılmakta olacak demektir.\nOdak kurallardır; tartışmayı yapan kişi belirtilmez.', undefined, { not: '“Will be being” kulağa ağır gelebilir; öznenin işi yapan mı, yapılan mı olduğuna bak.' }),
      kart('Söylemde neden ve sonuç', '“Because” nedeni, “therefore” sonucu bağlar.\n“Imports became cheaper; therefore, local firms faced competition.”\nÇıkarımı gerekçeyle kur.'),
      kart('Dengeli paragraf kurmak', 'Önce ana düşünce, ardından bir yarar ve bir bedel, son olarak uygulanabilir çözüm yaz.\n“Although trade creates opportunities, workers need support during change.”'),
    ], [], [
      { soru: '“Come up with a solution” neyi anlatır?', siklar: ['Çözüm üretmeyi', 'Sorunu gizlemeyi'], dogru: 0, aciklama: { dogru: 'Come up with, bir fikir veya çözüm geliştirmeyi anlatır.', yanlis: 'İfade saklamayı değil, yeni bir çözüm üretmeyi anlatır.' }, kart: 8 },
      { soru: '“Will be being discussed” cümlesinde odak nedir?', siklar: ['Tartışmayı yapan', 'Tartışılan konu'], dogru: 1, aciklama: { dogru: 'Edilgen yapıda konu öznedir; eylemi yapan ikinci plandadır.', yanlis: 'Edilgen yapıda tartışılan konu öne çıkar.' }, kart: 10 },
    ]),
    konu('ing11-cevre-sorunlari', 'Environmental Issues And Solutions', [
      kart('Sorunun türünü tanı', '“Contamination” bir ortamın kirlenmesidir; “carbon emissions” atmosfere salınan karbon içeren gazlardır.\nMetin önce sorunu adlandırır, sonra etkisini açıklar.'),
      kart('Etkiler zinciri', '“Global heating” ısınmayı, “sea level rise” deniz seviyesinin yükselmesini anlatır.\n“Melting ice caps contribute to sea level rise.” bir neden-sonuç bağı kurar.'),
      kart('Buzul ve buz örtüsü', '“Glacier” karada hareket eden büyük buz kütlesi; “ice caps” geniş buz örtüleridir.\n“Glaciers are shrinking” ifadesi küçülmeyi bildirir, bir çözüm söylemez.'),
      kart('Ekosistem bütündür', '“Ecosystem” canlılarla çevrelerinin oluşturduğu ilişkiler ağıdır.\n“One polluted river can harm an entire ecosystem.” tek bir etki birçok canlıya yayılabilir.'),
      kart('Ozon ve sera etkisi', '“Ozone layer” ve “greenhouse effect” ayrı kavramlardır.\nİlkinde koruyucu atmosfer katmanı, ikincisinde ısı tutma süreci anlatılır; metinde birbirinin yerine geçmez.'),
      kart('Doğa olayını ayırt et', '“Earthquake” deprem, “tornado” hortum, “windstorm” şiddetli rüzgâr fırtınasıdır.\nÇevre metninde bunları doğrudan insan kaynaklı kirlilikle eşitleme.'),
      kart('Reduce ve consume', '“Consume” kaynak kullanmak, “cut down on” tüketimi azaltmaktır.\n“We should cut down on single-use plastics” ifadesi tamamen yasaklamaktan farklıdır.'),
      kart('Clean up ve capture', '“Clean up a beach” mevcut atığı temizler; “capture emissions” gazı salınmadan veya havadan yakalar.\nİki eylemin hedefi aynı değildir.'),
      kart('Sıfır atık yaklaşımı', '“Zero-waste” atığı en baştan azaltmayı hedefler.\nYeniden kullanma ve onarma, yalnızca çöpü toplamanın önüne geçer.'),
      kart('Gelecekte sürecek değişim', '“By 2030, cities will be reducing emissions” gelecekte sürmekte olacak bir süreci anlatır.\n“Will reduce” ise aynı sürekliliği açıkça kurmaz.'),
      kart('Edilgen geleceği yorumla', '“More waste will be being recycled next year” cümlesi atığın işleme maruz kalacağını söyler.\n“Will be recycling” yazılsaydı öznenin geri dönüştürdüğü anlatılırdı.', undefined, { not: 'İngilizce çevre metninde “will be being” gördüğünde öznenin yapılan işten etkilendiğini denetle.' }),
      kart('Öneriyi kanıtla', '“This plan is sustainable” iddiası tek başına yeterli değildir.\n“Because it cuts energy use by 20%” gibi bir veri ya da gerekçe, öneriyi daha ikna edici kılar.'),
    ], [], [
      { soru: '“Cut down on plastic” ifadesinin amacı nedir?', siklar: ['Tüketimi artırmak', 'Tüketimi azaltmak'], dogru: 1, aciklama: { dogru: 'Cut down on, kullanım miktarını azaltmak demektir.', yanlis: 'İfade artırmayı değil azaltmayı anlatır.' }, kart: 7 },
      { soru: '“Cities will be reducing emissions.” Eylem nasıl sunulur?', siklar: ['Gelecekte sürmekte olan', 'Geçmişte tamamlanan'], dogru: 0, aciklama: { dogru: 'Will be reducing, gelecekte belirli anda süren işi anlatır.', yanlis: 'Will be + -ing geçmişte tamamlanan değil, gelecekte süren iştir.' }, kart: 10 },
    ]),
  ]),
  tema('ing11-t8', 'Life In The Universe & Future', [
    konu('ing11-gelecek-yasam', 'Future Lifestyles', [
      kart('Yaşam biçimi tasarlamak', '“Future lifestyle” gelecekte çalışma, ulaşım ve ev yaşamının nasıl olabileceğini anlatır.\nBir tahmin kurarken bugün eldeki ipuçlarını da söyle.'),
      kart('Akıllı evin işlevi', '“A smart home adjusts the lights automatically.” Ev çevreyi algılayıp uygun tepki verebilir.\n“Equipped with sensors” gerekli donanıma sahip demektir.'),
      kart('VR ile AR farkı', '“Virtual reality” kullanıcıyı sayısal bir ortama taşır.\n“Augmented reality” gerçek görüntünün üstüne sayısal ögeler ekler; aynı deneyim değildir.'),
      kart('Yapay zekâ bir araçtır', '“An AI assistant suggests a route.” Burada sistem veriden öneri üretir.\nÖneri ile kararın aynı şey olmadığını belirtmek teknoloji metnini daha dikkatli kılar.'),
      kart('Uzaktan çalışma', '“Telecommuting” ofise gitmeden, iletişim teknolojileriyle çalışmaktır.\n“Working from home saves travel time, but it may reduce face-to-face contact.”'),
      kart('Giyilebilir teknoloji', '“Wearable devices” vücutta taşınan sayısal araçlardır.\n“A wearable watch tracks activity” örneği işlev anlatır; sağlık tanısı koyduğunu tek başına göstermez.'),
      kart('İkinci koşulun anlamı', '“If I had a smart home, I would save energy.”\n**If + past simple, would + fiil** bugün gerçek olmayan ya da olasılığı düşük bir durumu varsayar.'),
      kart('Could ve would', '“If I could design it, I would add solar panels.”\n“Could” imkânı, “would” varsayılan sonucu anlatır; iki bölümün görevi farklıdır.'),
      kart('Gerçeklik ile hayal', '“If I have time, I will study” gerçek olasılığa açıktır.\n“If I had more time, I would study” şu andaki hayalî duruma uzaklık kurar.'),
      kart('Wish ile şimdiki dilek', '“I wish I had a quieter room” şu an odanın yeterince sessiz olmadığını sezdirir.\n**Wish + past simple** geçmiş zamanı değil, bugünkü gerçek dışı dileği gösterebilir.', undefined, { not: '“I wish I had…” cümlesindeki geçmiş biçim, çoğu zaman geçmiş olayı değil bugünkü eksikliği anlatır.' }),
      kart('Wish ve were', '“I wish my home were more accessible.” Resmî kullanımda tüm öznelerle “were” görülebilir.\nCümle bugünkü durumdan farklı bir ev hayal eder.'),
      kart('Gerekçeli tahmin yaz', '“Smart homes could save power if devices shared data efficiently.”\n“Could” olasılığı açık bırakır; kesin kanıt yoksa “will certainly” gibi mutlak ifadelerden kaçın.'),
    ], [], [
      { soru: '“If I had a smart home, I would…” hangi anlamı taşır?', siklar: ['Gerçek dışı varsayım', 'Kesinleşmiş plan'], dogru: 0, aciklama: { dogru: 'İkinci koşul, şu an gerçek olmayan veya uzak görülen durumu varsayar.', yanlis: 'Had + would, kesin plan değil gerçek dışı koşuldur.' }, kart: 7 },
      { soru: 'AR deneyiminde sayısal ögeler nereye eklenir?', siklar: ['Tamamen kapalı bir sanal dünyaya', 'Gerçek görüntünün üstüne'], dogru: 1, aciklama: { dogru: 'Augmented reality, görülen gerçek dünyaya sayısal katman ekler.', yanlis: 'Tümüyle sanal çevre VR ile ilgilidir; AR gerçeğin üzerine ekler.' }, kart: 3 },
    ]),
    konu('ing11-gelecek-teknolojileri', 'Future Technologies And Inventions', [
      kart('Buluşu işleviyle anlat', '“An invention” yeni bir çözüm veya aygıttır; “innovation” onu geliştirip kullanıma sokma sürecini de kapsar.\nİşlevi olmayan ad listesi açıklama değildir.'),
      kart('Robotik ve otomasyon', '“Robotics” robotların tasarımı ve kullanımıyla ilgilidir.\n“Robots can perform repetitive tasks” olası bir kullanımdır.\nBütün işleri devralacakları iddiası değildir.'),
      kart('Dronun bağlamı', '“Drones can deliver supplies to remote areas.”\nBir teknolojiyi değerlendirirken hız gibi yararı, güvenlik veya mahremiyet gibi sınırı birlikte düşün.'),
      kart('Sürücüsüz araç', '“Self-driving vehicles use sensors to detect obstacles.”\n“Detect” engeli fark etmek, “avoid” ondan kaçınmaktır; algılama tek başına güvenli karar demek değildir.'),
      kart('Hologram ve başlık', '“Hologram” üç boyutlu görüntü izlenimi verir.\n“VR headset” başa takılan sanal gerçeklik cihazıdır; ikisini aynı aygıt sayma.'),
      kart('Nano ölçekte teknoloji', '“Nanotechnology” çok küçük ölçeklerde malzeme ve aygıt geliştirmeyi anlatır.\nTerimi yalnızca “küçük robot” ile sınırlamak kapsamı daraltır.'),
      kart('Enerjiyi üretmek', '“Solar panels generate electricity from sunlight.”\n“Generate” üretmektir; “store” depolamaktır. Panelin üretmesi, üretilen enerjinin depolandığı anlamına gelmez.'),
      kart('Track ve transform', '“A sensor tracks air quality”; “new systems transform transport.”\nİlki değişimi izler, ikincisi işleyişi dönüştürür; aynı görev değillerdir.'),
      kart('Cutting-edge kullanımı', '“Cutting-edge technology” son derece yeni ve ileri teknolojidir.\nSırf pahalı bir cihaz için bu sözü kullanmak gerekçesiz bir övgü olur.'),
      kart('Hayalî tasarım önerisi', '“If I designed a smart kitchen, it would reduce food waste.”\nİkinci koşul bir tasarım fikrini dener; bugünkü kanıtlanmış sonuç gibi sunmaz.'),
      kart('Wish ile yenilik isteği', '“I wish batteries lasted longer.” Şimdiki gerçeklikte pil ömrü istenen düzeyde değildir.\n“Lasted” biçimi geçmişteki bir pili anlatmak zorunda değil.', undefined, { not: 'Gelecek teknolojisi sorusunda “wish + geçmiş biçim” gördüğünde bugünkü karşılanmamış isteği ara.' }),
      kart('İddianın sınırını yaz', '“AI may improve access, but it also raises privacy questions.”\n“May” olasılığı bildirir; “but” karşı görüşe geçer. Teknoloji paragrafı ikisini birlikte tartabilir.'),
    ], [], [
      { soru: '“Generate electricity” neyi anlatır?', siklar: ['Elektrik üretmeyi', 'Elektrik depolamayı'], dogru: 0, aciklama: { dogru: 'Generate üretmektir; depolamak için store kullanılır.', yanlis: 'Generate depolama değil üretme eylemidir.' }, kart: 7 },
      { soru: '“If I designed a robot, it would…” ne anlatır?', siklar: ['Kesinleşmiş üretimi', 'Varsayımsal sonucu'], dogru: 1, aciklama: { dogru: 'İkinci koşul bugün için hayalî bir tasarım sonucunu anlatır.', yanlis: 'Designed + would yapısı kesin üretim kararı değil, varsayımdır.' }, kart: 10 },
    ]),
  ]),
]
