import { kart, konu, tema, type Tema } from '../tip'

/** 12. sınıf İngilizce (2018 programı): Technology ve Manners temaları. */
export const ingilizce12Temalar4: Tema[] = [
  tema('ing12-t9', 'Technology', [
    konu('ing12-teknoloji-yaptirma', 'Having Things Done: Causative Forms', [
      kart('Have something done', 'İşi başkasına yaptırmak: **have + nesne + V3**.\n“I’ll have the computer formatted.” → Bilgisayarı formatlatacağım.\nİşi kimin yaptığı genellikle söylenmez.'),
      kart('Get something done', 'Gayriresmî eşdeğeri: **get + nesne + V3**.\n“She wants her smart phone fixed.” → Telefonunun tamir edilmesini istiyor.\n“We’ll get the PPP done as soon as possible.”'),
      kart('Have somebody do', 'Yapacak kişi belirtilirse: **have + kişi + yalın fiil**.\n“I had Mindy download a movie for me.” → Mindy’ye bir film indirttim.'),
      kart('Make somebody do', '**make + kişi + yalın fiil** zorlama anlatır.\n“The teacher made the class do online research on the topic.”\nEdilgende to gelir: “The class was made to do it.”'),
      kart('Let somebody do', '**let + kişi + yalın fiil** izin verir.\n“The teacher does not let the students use their phones in class.”'),
      kart('Make, let, have farkı', '- make: zorlama\n- let: izin\n- have: işi birine verme\nÜçünden sonra da **to’suz** yalın fiil gelir.'),
      kart('Get somebody to do', '**get + kişi + to + fiil** ikna ederek yaptırmayı anlatır.\n“I got my brother to install the app.”\nGet’te **to** vardır, have’de yoktur.'),
      kart('Zaman çekimi', 'Çekimlenen have’dir, V3 sabit kalır.\n“She has her hair cut every month.”\n“I had my phone repaired yesterday.”\n“He is having his car washed.”'),
      kart('Kendin mi, başkası mı?', '“I repaired my phone.” → Tamiri kendisi yaptı.\n“I had my phone repaired.” → Başkasına yaptırdı.', undefined, { not: 'Yaptıran ve yapan ayrı kişilerdir: I cut my hair ≠ I had my hair cut.' }),
      kart('Nazik teknik rica', '“Could you please get the warranty approved?” → Garantinin onaylanmasını sağlar mısınız?\nRicayı please ve could ile yumuşat.'),
      kart('Yapılması gerekenler', '**need + V-ing**, edilgen anlam taşır.\n“My laptop needs repairing.” = “…needs to be repaired.”\nYapılacaklar listesi: update, charge, back up.'),
    ], [], [
      { soru: '“I had my phone ___ yesterday.”', siklar: ['repair', 'repaired'], dogru: 1, aciklama: { dogru: 'Have + nesne + V3 yapısında fiil V3 olur.', yanlis: 'Nesne işi kendisi yapmadığı için repaired gerekir.' }, kart: 1 },
      { soru: '“I got my brother ___ the app.”', siklar: ['install', 'to install'], dogru: 1, aciklama: { dogru: 'Get + kişi + to fiil kalıbı vardır.', yanlis: 'Get’te to gelir; to’suz biçim have ile kullanılır.' }, kart: 7 },
    ]),
    konu('ing12-teknoloji-gorus', 'Discussing Technology: Opinions, Interviews and Essays', [
      kart('Fikir sormak', '“What do you think about the future of smart phones?”\n“How has technology changed your life?”\nGörüş sorusu açık uçlu olmalıdır.'),
      kart('Duyguları ifade etmek', '- **Şaşkınlık:** Wow, I can’t believe it!\n- **İlgi:** That sounds interesting!\n- **Mutluluk:** I’m so glad to hear that.\n- **Kayıtsızlık:** It makes no difference to me.'),
      kart('Konuşmayı bitirmek', '“Sorry, I can’t talk any longer on this issue.” → Üzgünüm, bu konuda daha fazla konuşamam.\n“I’m afraid I have to go.”'),
      kart('Röportaj soruları', 'Kapalı soru evet/hayır ister: “Do you use social media?”\nAçık soru açıklama ister: “How does social media affect your life?”'),
      kart('Sosyal etki', '- Olumlu: stay in touch, share ideas\n- Olumsuz: addiction, isolation\n“Social media helps people stay in touch.”'),
      kart('For and against essay', 'Yapı:\n- Giriş: konu\n- Bir paragraf lehte, bir paragraf aleyhte görüş\n- Sonuç: kendi görüşün'),
      kart('Essay bağlaçları', '- Ekleme: moreover, in addition\n- Karşıtlık: however, on the other hand\n- Sonuç: therefore, in conclusion'),
      kart('Hi-tech ürün tanımı', 'Tanımda işlev, özellik ve yararı bağlayıcılarla ver:\n“This smartwatch tracks your steps and, moreover, sends messages.”'),
      kart('Broşür ve web sitesi', 'Web sayfasında başlık ve alt başlıkları tara.\nBilgiyi kategorilere ayır: özellik, fiyat, garanti.', undefined, { not: 'Her bilgi için “hangi kategoriye ait?” diye sor: özellik, fiyat, garanti.' }),
      kart('Teknoloji sözcükleri', '- device: cihaz\n- application (app): uygulama\n- warranty: garanti\n- software: yazılım'),
      kart('Sözcük vurgusu', '- technology → tek-NOL-o-gy\n- photography → pho-TOG-ra-phy\n- electricity → e-lec-TRIC-i-ty\nVurgu genellikle son ekten önceki hecededir.'),
    ], [], [
      { soru: 'Karşıt görüşe geçmek için hangi bağlaç kullanılır?', siklar: ['moreover', 'however'], dogru: 1, aciklama: { dogru: 'However karşıtlık kurar.', yanlis: 'Moreover aynı yönde ek bilgi verir.' }, kart: 7 },
      { soru: 'Açık uçlu soru hangisidir?', siklar: ['Do you use social media?', 'How does social media affect your life?'], dogru: 1, aciklama: { dogru: 'How ile başlayan soru açıklama ister.', yanlis: 'Do you …? sorusu evet/hayır ile yanıtlanır.' }, kart: 4 },
    ]),
  ]),
  tema('ing12-t10', 'Manners', [
    konu('ing12-pismanlik-dilek', 'Expressing Wishes, Regrets and Apologies', [
      kart('Wish + past simple', 'Şimdiki durumu değiştirme isteği: **wish / if only + past simple**.\n“If only John knew about it.” → Keşke John bilseydi.\n“I wish I had more time.”'),
      kart('Wish + past perfect', 'Geçmiş pişmanlığı: **wish / if only + had + V3**.\n“I wish that someone had told John about it.”\n“If only I had woken up early.”'),
      kart('Should have', '**should have + V3** geçmişte yapılmayanı ya da yapılanı eleştirir.\n“I shouldn’t have said that.” → Bunu söylememeliydim.\n“You should have called.” → Aramalıydın.'),
      kart('Wish + would', '**wish + özne + would** başkasının davranışından şikâyet eder.\n“I wish you wouldn’t play with your mobile phone.”\nKendi eylemin için wish I would kullanılmaz.'),
      kart('If only', 'If only, wish’in daha güçlü söylenişidir.\n- past simple: şimdiki durum\n- had + V3: geçmiş pişmanlığı\n- would: şikâyet ya da beklenti'),
      kart('Dilek kalıpları', '“What I’d like more than anything else is to travel the world.”\n“Something I have always wanted is a quiet home.”'),
      kart('Özür dilemek', '“Please accept my apologies for yesterday.”\n“I’m terribly sorry for being late.”\nSorry for + V-ing ya da isim.'),
      kart('Apologise to … for …', 'Kişi için **to**, sebep için **for** kullanılır.\n“I apologised to Ali for being late.”\nSorry **about** + isim: “sorry about the noise”.'),
      kart('Niyeti açıklamak', '“It was not my intention to hurt you.”\n“I didn’t mean to hurt you.”', undefined, { not: 'İyi özür üç parçalıdır: üzüntü, açıklama, telafi sözü.' }),
      kart('Özür notu yazmak', 'Not sırası: hitap, özür, açıklama, telafi sözü, kapanış.\n“Dear Ali, I’m terribly sorry about … Please accept my apologies.”'),
      kart('Cümle vurgusu', 'Vurgu içerik sözcüklerine gelir.\n“I’ll MAKE a POT of TEA if you would LIKE some.”\nYardımcı fiil ve edatlar zayıf okunur.'),
    ], [], [
      { soru: '“If only I ___ up early.” (Geçmişten pişmanlık)', siklar: ['woke', 'had woken'], dogru: 1, aciklama: { dogru: 'Geçmiş pişmanlığı için had + V3 gerekir.', yanlis: 'Woke şimdiki dilek için kullanılırdı.' }, kart: 2 },
      { soru: '“You ___ called me.” (Aramamıştın.)', siklar: ['should have', 'should'], dogru: 0, aciklama: { dogru: 'Should have + V3 geçmişteki eksiği anlatır.', yanlis: 'Tek başına should geçmişi anlatmaz.' }, kart: 3 },
    ]),
    konu('ing12-gelenek-davranis', 'Manners in Different Cultures', [
      kart('Manners nedir?', 'Manners, toplumda kabul gören nazik davranışlardır.\n“good manners”: görgü; “table manners”: sofra adabı.\n“It is bad manners to interrupt.”'),
      kart('Kültürlere göre görgü', 'Davranışlar kültüre göre değişir.\n“In Japan, people take off their shoes before entering a house.”\n“In many countries, people shake hands to greet.”'),
      kart('Polite ve rude', 'Davranış yargısı: **It is + sıfat + to + fiil**.\n“It is polite to say thank you.”\n“It is rude to interrupt.”'),
      kart('Görgü sözcükleri', '- polite / rude: kibar / kaba\n- respectful: saygılı\n- considerate: düşünceli\n- custom: gelenek\n- etiquette: görgü kuralları'),
      kart('Köken ve uygulama', 'Bir görgü kuralının kökeni (origin) ve günlük uygulaması (practice) ayrılabilir.\n“The tradition dates back centuries.” → Gelenek yüzyıllar öncesine uzanır.'),
      kart('Başkasından şikâyet', '“I wish people wouldn’t talk loudly on the phone.” → Keşke insanlar telefonda yüksek sesle konuşmasa.\nWish + would, başkasının davranışına yönelir.'),
      kart('Ziyarette tavsiye', '“When you visit someone’s home, you should bring a small gift.”\n“You shouldn’t arrive too late.”'),
      kart('Günlük yazmak', 'Günlük birinci kişi ve genellikle geçmişle yazılır.\n- embarrassed: utanmış\n- grateful: minnettar\n- relieved: rahatlamış\n“Today I felt embarrassed because I was late.”'),
      kart('Duygu ve sonuç', '“When I forgot his name, I felt embarrassed, so I apologised.”\nOlay, duygu ve sonuç ayrı bildirimlerdir.', undefined, { not: 'Günlükte olayı, hissini ve çıkardığın dersi ayrı cümlelerle yaz.' }),
      kart('Metnin ana sonucu', 'Argumentative metinde ana sonuç genellikle son paragrafta yer alır.\nİpuçları: therefore, thus, in conclusion.'),
      kart('Mektup ve rapor', 'Görgü raporunda önce gözlem, sonra yorum yaz:\n“Most people greet with a handshake, whereas some bow.”'),
    ], [], [
      { soru: '“It is ___ to say thank you.”', siklar: ['rude', 'polite'], dogru: 1, aciklama: { dogru: 'Teşekkür etmek kibar bir davranıştır.', yanlis: 'Rude kaba demektir.' }, kart: 3 },
      { soru: '“It is bad manners ___ interrupt.”', siklar: ['at', 'to'], dogru: 1, aciklama: { dogru: 'It is bad manners to + fiil kalıbı vardır.', yanlis: 'At bu kalıpta kullanılmaz.' }, kart: 1 },
    ]),
  ]),
]
