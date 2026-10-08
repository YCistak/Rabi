import { kart, konu, tema, type Tema } from '../tip'

/**
 * 12. sınıf İngilizce (2018 programı): Coming Soon, Psychology ve Favors
 * temaları. Tema ve işlev adları MEB programının 12th Grade bölümündendir.
 */
export const ingilizce12Temalar2: Tema[] = [
  tema('ing12-t4', 'Coming Soon', [
    konu('ing12-gelecek-tahmin', 'Making Predictions and Expressing Certainty', [
      kart('Tahmin kalıpları', 'Tahmin söylerken fikir kalıbı + will kullan:\n- I imagine … will be …\n- I guess … won’t …\n“I imagine driverless cars will be common in the near future.”'),
      kart('Will ve won’t', 'Kanıta dayanmayan tahmin: **will / won’t** + yalın fiil.\n“I guess there won’t be cars running with petrol in the future.”\n“There won’t be … any more” → artık … olmayacak.'),
      kart('Be going to ile tahmin', 'Şimdiki kanıta dayanan tahmin: **be going to**.\n“Look at the clouds! It is going to rain.”\n“Air pollution is going to decrease.”'),
      kart('Kesinlik dereceleri', 'Kesinlikten belirsizliğe:\n- will definitely: kesin olacak\n- will probably: büyük olasılıkla\n- may / might / could: olabilir\n- definitely won’t: kesin olmayacak'),
      kart('Zarfın yeri', 'Zarf **will**’den sonra, **won’t**’tan önce gelir.\n“It will probably rain.”\n“It probably won’t rain.”', undefined, { not: 'Zarf will’den sonra, won’t’tan önce gelir: will probably / probably won’t.' }),
      kart('Zaman anlatımı', '- in the near future: yakın gelecekte\n- by 2030: 2030’a kadar (en geç)\n- until 2030: 2030’a kadar sürerek\n“What do you think will happen in the year 2030?”'),
      kart('Birinci koşul', '**If + present simple, will + yalın fiil**: gerçekleşmesi olası koşul.\n“If people waste natural sources, future generations will suffer.”\nIf bölümünde will kullanılmaz.'),
      kart('Neden: due to', '**due to + isim öbeği** “… nedeniyle” demektir.\n“Air pollution is going to decrease due to the usage of bio-energy.”\nTam cümle için because kullanılır.'),
      kart('Amaç: in order to', '**in order to + yalın fiil** amaç bildirir.\n“He is going to buy a hybrid car in order to reduce his carbon footprint.”\nOlumsuzu: in order **not** to.'),
      kart('Gelecek sözcükleri', '- bio-energy: biyoenerji\n- hi-tech: ileri teknoloji\n- carbon footprint: karbon ayak izi\n- driverless: sürücüsüz'),
      kart('Kısaltılmış biçimler', 'Konuşmada will çoğunlukla ’ll olur: I’ll, she’ll /ʃiːl/.\nWon’t /wəʊnt/ olumsuz biçimdir.\nResmî yazıda kısaltma yerine will not yazılır.'),
    ], [], [
      { soru: '“Look at the clouds! It ___ rain.”', siklar: ['will', 'is going to'], dogru: 1, aciklama: { dogru: 'Şimdiki kanıta (bulutlar) dayanan tahmin be going to ile yapılır.', yanlis: 'Will kanıtsız tahmindir; burada bulut kanıtı var.' }, kart: 3 },
      { soru: '“It ___ rain tomorrow.” Büyük olasılıkla yağmayacak.', siklar: ['won’t probably', 'probably won’t'], dogru: 1, aciklama: { dogru: 'Zarf won’t’tan önce gelir.', yanlis: 'Won’t probably sıralaması yanlıştır.' }, kart: 5 },
    ]),
    konu('ing12-siber-dunya', 'Cyber Games, Virtual Reality and Cyber Crime', [
      kart('Cyber sözcük ailesi', '- cyber game: siber oyun\n- cyber crime: siber suç\n- cyborg: insan-makine melezi\n- virtual reality: sanal gerçeklik'),
      kart('Gerçek ve sanal', '“Many children cannot differentiate between reality and computer games.”\n**differentiate between A and B:** A ile B’yi ayırt etmek.\nAynı anlamda: distinguish A from B.'),
      kart('Hesap güvenliği', '“Please verify your e-mail.” → E-postanı doğrula.\n- password: parola\n- username: kullanıcı adı\n- account: hesap'),
      kart('Oyun talimatları', 'Talimat emir kipiyle verilir: “Choose your avatar.” → Avatarını seç.\nOlumsuzu **Don’t + fiil**: “Don’t share your password.”'),
      kart('Adım sırası', 'Adımlar sıralama bağlaçlarıyla verilir:\n- First, choose your avatar.\n- Then, select a level.\n- Finally, press Start.'),
      kart('Siber suçlar', '- hacking: izinsiz girme\n- identity theft: kimlik hırsızlığı\n- phishing: oltalama\n“Never click links from strangers.”'),
      kart('Korunma yolları', 'Korunmak için:\n- güçlü parola kullan\n- kişisel bilgini paylaşma\n- şüpheli bağlantıya tıklama\n“Everyone has the right to privacy.”'),
      kart('Gelecek tahmini', '“Cyber and cyborg figures will be around us in the near future.”\nBu bir tahmindir, kesin bilgi değil.'),
      kart('Anlamı doğrulamak', '“Did you mean this petrol-free car will reduce costs?”\nTürkçesi: Benzinsiz araba maliyeti düşürecek mi demek istedin?\nKarşıdakinin cümlesini kendi sözünle tekrarla.', undefined, { not: 'Anlamadığında “Did you mean …?” ile kendi cümlenle teyit et.' }),
      kart('Informal debate', 'Tartışmada:\n- I see your point, but …\n- In my view, games are …\n- That’s true; however, …\nSırayı bekle, söz kesme.'),
      kart('Siber oyun senaryosu', 'Senaryoda: avatar, goal (amaç), obstacle (engel), reward (ödül).\n“Your goal is to find the key. Avoid the guards.”'),
    ], [], [
      { soru: '“E-postanı doğrula” için hangi fiil kullanılır?', siklar: ['vary', 'verify'], dogru: 1, aciklama: { dogru: 'Verify doğrulamak demektir.', yanlis: 'Vary değişmek demektir; doğrulamak verify’dir.' }, kart: 3 },
      { soru: 'Adımları sıralarken ilk bağlaç hangisidir?', siklar: ['First', 'Finally'], dogru: 0, aciklama: { dogru: 'First, ilk adımı bildirir.', yanlis: 'Finally son adım için kullanılır.' }, kart: 5 },
    ]),
  ]),
  tema('ing12-t5', 'Psychology', [
    konu('ing12-ruh-hali', 'Describing Mood', [
      kart('Ruh hali sözcükleri', '- exhausted: bitkin\n- anxious: kaygılı\n- cheerful: neşeli\n- gloomy: kasvetli\n“I feel exhausted and I can’t concentrate.”'),
      kart('Feel + sıfat', '**feel + sıfat:** “I feel nervous.” → Gergin hissediyorum.\n**feel like + V-ing:** canı … istemek: “I feel like going for a walk.”'),
      kart('Concentrate on', '“I can’t concentrate on my homework.” → Ödevime odaklanamıyorum.\nConcentrate **on** + isim ya da V-ing alır.'),
      kart('Renkler ve ruh hali', 'Renkler ruh hali çağrıştırır (genellikle):\n- blue: sakin ya da hüzünlü\n- red: enerjik ya da öfkeli\n- yellow: neşeli\n- grey: kasvetli'),
      kart('Duygunun nedeni', '“I feel upset because I failed the test.”\n**make + nesne + sıfat:** “The news made me happy.”\n“The film left me confused.”'),
      kart('-ed ve -ing sıfatları', '**-ed** hisseden kişiyi, **-ing** hissettiren şeyi anlatır.\n“I am bored.” → Sıkılıyorum.\n“The lesson is boring.” → Ders sıkıcı.'),
      kart('Tonu anlamak', 'Konuşmacının ruh hali ses tonundan anlaşılır.\nYavaş ve alçak ses üzüntüyü, hızlı ve yüksek ses heyecanı sezdirir.'),
      kart('Şiirde ton', 'Şiiri tonuna uygun oku: gloomy bir şiir yavaş, cheerful bir şiir canlı okunur.\nTone yazarın tavrıdır, mood okurda uyanan duygudur.'),
      kart('Vurgu ve tonlama', '“Let’s take a BREAK.” → vurgu anlam taşıyan sözcüğe gelir.\nCümle sonunda ses düşer ↘', undefined, { not: 'Vurgu isim, fiil, sıfat gibi anlamlı sözcüklere gelir; the, a, to zayıf okunur.' }),
      kart('Ruh halini yazmak', 'Ruh halini benzetmeyle yaz:\n“I feel as light as a feather.” → Tüy kadar hafif hissediyorum.\n“The grey sky matched my gloomy mood.”'),
      kart('Kısa ruh hali metni', '- “Today I feel anxious.”\n- “My mind is full of questions.”\n- “I hope tomorrow will be calmer.”'),
    ], [], [
      { soru: '“I can’t concentrate ___ my homework.”', siklar: ['in', 'on'], dogru: 1, aciklama: { dogru: 'Concentrate on kalıbı kullanılır.', yanlis: 'Concentrate in kalıbı yoktur; on gerekir.' }, kart: 3 },
      { soru: '“The film was ___, so I fell asleep.”', siklar: ['boring', 'bored'], dogru: 0, aciklama: { dogru: 'Film hissettiren şey olduğu için -ing sıfatı gelir.', yanlis: 'Bored hisseden kişiyi anlatır; film için boring gerekir.' }, kart: 6 },
    ]),
    konu('ing12-oneri-talimat', 'Suggestions to Change Mood and Giving Instructions', [
      kart('Suggest kalıpları', 'Suggest iki kalıpla kurulur:\n“I suggest that you take a nap.” (that + özne + yalın fiil)\n“I suggest going for a walk.” (V-ing)'),
      kart('Öneri kalıpları', '- Why don’t you join a music club?\n- You should talk to a friend.\n- Let’s take a break.'),
      kart('Had better', '**had better + yalın fiil:** yapılmazsa sorun çıkar.\n“You’d better rest; you look exhausted.”\nOlumsuz: had better **not** + fiil.'),
      kart('If I were you', '“If I were you, I would talk to a counsellor.” → Yerinde olsam …\nBu kalıpta tüm kişiler için **were** kullanılır.'),
      kart('Rahatlama yolları', '- take a deep breath\n- do some stretching\n- listen to calm music\n“What do you do to clear your mind after school?”'),
      kart('Emir kipi', '“Close your eyes!” “Breathe deeply!” → Gözlerini kapat! Derin nefes al!\nOlumsuz: “Don’t worry.” “Don’t think about the test.”'),
      kart('Talimat sırası', 'Meditasyon adımlarını sırala:\n- First, sit comfortably.\n- Then, close your eyes.\n- Finally, breathe slowly.'),
      kart('Ses tonu ve talimat', 'Rahatlatıcı talimat yavaş, alçak ve yumuşak söylenir.\nHeyecanlandırıcı talimat hızlı ve yüksek söylenir.'),
      kart('Psikolog ve danışan', 'Roleplay: psychologist ile client.\n“What seems to be the problem?” → Sorun nedir?\n“I feel stressed before exams.”', undefined, { not: 'Danışanı dinle: “I see.” ve “That sounds hard.” gibi destek cümleleri kur.' }),
      kart('Psikoloji sözcükleri', '- stress: stres, gerginlik\n- anxiety: kaygı\n- relaxation: rahatlama\n- counsellor: rehber, danışman'),
      kart('Öneride tonlama', 'Öneri cümlelerinde ses sonda düşer: “Let’s take a break.” ↘\nSoru olarak sorulan öneride yükselir: “Shall we take a break?” ↗'),
    ], [], [
      { soru: '“I suggest ___ a break.”', siklar: ['to take', 'taking'], dogru: 1, aciklama: { dogru: 'Suggest’ten sonra V-ing gelir.', yanlis: 'Suggest + to fiil kullanılmaz.' }, kart: 1 },
      { soru: '“You’d better ___ late.”', siklar: ['not stay', 'not to stay'], dogru: 0, aciklama: { dogru: 'Had better not + yalın fiil kullanılır.', yanlis: 'Had better’dan sonra to gelmez.' }, kart: 3 },
    ]),
  ]),
  tema('ing12-t6', 'Favors', [
    konu('ing12-rica', 'Making Requests', [
      kart('Rica kalıpları', '- Can I borrow your …?\n- Could I borrow your …?\n- Is it OK if I use your mobile phone?\nCould, Can’den daha nazik bir tondur.'),
      kart('Could you ve Would you', '“Could you open the window, please?” → Pencereyi açar mısınız?\n“Would you pass me the salt?” → Tuzu uzatır mısınız?\nİkisinden sonra yalın fiil gelir.'),
      kart('Would you mind + V-ing', '“Would you mind lending me your bike?” → Bisikletini ödünç verir misin?\nMind’dan sonra **V-ing** gelir.\n“Do you mind if I open the window?” → Pencereyi açsam sakıncası var mı?'),
      kart('Mind sorusunun cevabı', 'Mind “sakıncası var mı” sorar.\n- Not at all. / No, go ahead. → Kabul\n- Yes, I do mind. → Ret\n“Yes” demek burada “evet, sakıncası var” demektir.'),
      kart('I was wondering if', '“I was wondering if you’d mind lending me your bike.”\nEn nazik rica kalıplarından biridir.'),
      kart('İhtiyaç bildirmek', '“I need a/an/some …” kalıbıyla ihtiyaç söylenir.\n“I need a pen.” “I need some help.”\n**a/an** sayılabilir tekilde, **some** sayılamayanda ya da çoğulda.'),
      kart('Resmî ve gayriresmî dil', '- Gayriresmî: Can I …? / Got a pen?\n- Resmî: Would it be possible to …? / I was wondering if …'),
      kart('Please ve nezaket', 'Please cümle başında ya da sonunda gelir: “Open the door, please.”\nSade emir kipi kaba kaçabilir: “Give me your pen.”'),
      kart('Söylenişte birleşme', '“Would you” hızlı konuşmada /wʊdʒu/, “Could you” /kʊdʒu/ gibi birleşir.', undefined, { not: 'Yazıda Would you / Could you ayrı yazılır; birleşme yalnız söylenişte olur.' }),
      kart('İyilik istemek', '“Could you do me a favour?” → Bana bir iyilik yapar mısın?\n“Sure. What is it?”\n“Could you help me with my homework?”'),
      kart('Borrow ve lend', '- borrow: ödünç almak\n- lend: ödünç vermek\n- return: geri vermek\n“Can I borrow your pen? I will return it soon.”'),
    ], [], [
      { soru: '“Would you mind ___ the window?”', siklar: ['to open', 'opening'], dogru: 1, aciklama: { dogru: 'Would you mind’dan sonra V-ing gelir.', yanlis: 'Mind + to fiil kullanılmaz.' }, kart: 3 },
      { soru: '“Would you mind closing the door?” Kabul eden yanıt hangisi?', siklar: ['Yes, I do mind.', 'Not at all.'], dogru: 1, aciklama: { dogru: 'Not at all, “hiç sakıncası yok” demektir.', yanlis: 'Yes, I do mind, ricayı reddeder.' }, kart: 4 },
    ]),
    konu('ing12-iyilik-yanit', 'Accepting, Declining and Asking for Favors', [
      kart('Kabul etmek', '- Sure! / Of course!\n- No problem.\n- Help yourself! → Buyur, kendin al!\n- I would be glad to help. → Memnuniyetle yardım ederim.'),
      kart('Nazikçe reddetmek', '- I’m really sorry, but …\n- I’m afraid I can’t.\n- No, I’m sorry. I don’t have one.\nÖnce özür dile, sonra kısa bir gerekçe ver.'),
      kart('Gerekçeli ret', '“I’m really sorry; I need it myself today.”\n“I’m afraid I can’t; I’m busy this evening.”\nGerekçe kısa tutulur.'),
      kart('Yardım teklif etmek', '“Shall I carry your bag?” → Çantanı taşıyayım mı?\n“Would you like me to help?” → Yardım etmemi ister misin?\n“I’ll do it for you.”'),
      kart('Teşekkür ifadeleri', '“Thanks a lot.” “That’s very kind of you.” “I really appreciate it.”\nBunlar iyilik karşısında minnet bildirir.'),
      kart('Teşekküre karşılık', '- You’re welcome.\n- My pleasure.\n- Don’t mention it.\n- No worries. → Önemli değil.'),
      kart('Anlamı netleştirmek', '“Did you mean you need my laptop the whole day?” → Bütün gün laptopumu mu istiyorsun?\nDolaylı ricayı netleştirmek için kullanılır.'),
      kart('Hayır kurumu sözcükleri', '- charity: hayır kurumu\n- donation: bağış\n- volunteer: gönüllü\n- foundation: vakıf'),
      kart('Duyuru yazmak', 'Duyuruda başlık, tarih, yer ve çağrı bulunur.\n“Join us! A charity sale will be held on Friday at 3 p.m.”\n“Everyone is welcome.”', undefined, { not: 'Duyuruda ne, ne zaman, nerede ve nasıl katılınacağı mutlaka olsun.' }),
      kart('Burs başvuru mektubu', '- Dear Sir or Madam, → resmî hitap\n- I am writing to apply for … → amaç\n- I would be grateful if you could … → rica\n- Yours faithfully, → kapanış'),
      kart('Scan ve skim', '**Scan:** belirli bilgiyi (tarih, sayı, isim) aramak için taramak.\n**Skim:** genel fikri almak için hızlı okumak.'),
    ], [], [
      { soru: '“Dear Sir or Madam” ile başlayan mektup nasıl kapanır?', siklar: ['Yours faithfully', 'Yours sincerely'], dogru: 0, aciklama: { dogru: 'İsim bilinmiyorsa Yours faithfully kullanılır.', yanlis: 'Yours sincerely isim bilindiğinde kullanılır.' }, kart: 10 },
      { soru: 'Hangisi nazik bir ret sayılır?', siklar: ['No!', 'I’m sorry, but I can’t.'], dogru: 1, aciklama: { dogru: 'Özür ve gerekçe reddi nazikleştirir.', yanlis: 'Tek başına No! sert kaçar.' }, kart: 2 },
    ]),
  ]),
]
