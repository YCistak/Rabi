import { kart, konu, tema, type Tema } from '../tip'

/** MEB TYMM 11. sınıf B1.3, ilk iki tema: 549 ve 550 numaralı resmî üniteler. */
export const ingilizce11Temalar1: Tema[] = [
  tema('ing11-t1', 'School Life & Education', [
    konu('ing11-okul-turleri', 'Comparing Different Types of Schools', [
      kart('Karşılaştırmanın amacı', 'Okul türlerini tek sözcükle iyi-kötü diye ayırma; kaynak, ders ve öğrenci gereksinimini karşılaştır.\n"The schools differ in their facilities." → Olanakları bakımından farklılar.'),
      kart('Public ve private', '"A public school is funded by the state." → Devlet okulunun finansmanı kamudan gelir.\n"A private school may charge a fee." → Özel okul ücret isteyebilir; bütün okullar için genelleme yapma.'),
      kart('Vocational ve academic', '"Vocational schools offer practical training." → Mesleki okul uygulamalı eğitim sunar.\n"Academic courses focus on theory." → Akademik dersler kuramsal çalışmaya ağırlık verir.'),
      kart('Kaynak ve olanak', 'Resource öğrenmeye yardımcı kaynaktır; facility okulun sunduğu tesis veya olanaktır.\n"A library can be both a resource and a facility." → Kütüphane ikisi de olabilir.'),
      kart('Ücret sonuç değildir', '"Higher fees do not always mean better outcomes." → Yüksek ücret tek başına daha iyi öğrenme sonucu göstermez.\nOkulu değerlendirirken ders, erişim ve katılım verilerine de bak.'),
      kart('Müfredat ve seçmeli ders', 'Curriculum müfredat; compulsory zorunlu; optional seçmelidir.\n"Optional subjects are chosen by students." → Edilgen yapı seçilen dersleri öne çıkarır.'),
      kart('Karşılaştırma dili', '"School A is more flexible than School B." → A, B’ye göre daha esnek.\n"Both schools offer art, whereas only B has a workshop." → Ortaklık ve farkı birlikte verir.'),
      kart('Student-centred ne demek?', 'Student-centred derste öğrencinin soru sorması ve karar alması önemlidir.\n"Students take part in choosing projects." → Proje seçimine katılırlar.', undefined, { not: 'Bir okulu tek özellikten yargılama; karşılaştırma için ortak ölçüt ve somut kanıt seç.' }),
      kart('Şimdiki zamanın edilgeni', 'Süreç şu anda sürüyorsa "am/is/are being + V3" kullanılır.\n"New computers are being installed now." → Yeni bilgisayarlar şu anda kuruluyor.'),
      kart('Zaman ve sıklık', '"Students use the lab twice a week." → Haftada iki kez; sıklık öbeği sonda.\n"The meeting is held in the library on Fridays." → Yer ve zaman bilgisi sonucu netleştirir.'),
      kart('Kısa okul profili', '"Our school offers free clubs. Lessons are held in small groups twice a week."\nBir okul profilinde sunulan olanağı ve öğrenme biçimini somut örnekle anlat.'),
    ], [], [
      { soru: '"Optional subjects are chosen by students." Cümlenin odağı nedir?', siklar: ['Seçilen dersler', 'Öğrencilerin kimliği'], dogru: 0, aciklama: { dogru: 'Edilgende özne optional subjects olur; yapılan iş öne çıkar.', yanlis: 'Cümlenin başındaki optional subjects, seçilen derslere odaklanır.' }, kart: 6 },
      { soru: '"New computers are being installed now." Hangi zaman anlamı var?', siklar: ['Her yıl tekrarlanan iş', 'Şu anda süren iş'], dogru: 1, aciklama: { dogru: 'Are being installed, şimdi süren edilgen eylemdir.', yanlis: 'Now ve are being, kurulumun şu anda sürdüğünü anlatır.' }, kart: 9 },
    ]),
    konu('ing11-egitim-sistemleri', 'Comparing Different Education Systems', [
      kart('Aynı ölçütle bak', 'İki sistemi karşılaştırırken okul süresi, müfredat, değerlendirme ve erişim gibi aynı ölçütleri kullan.\n"We compare how students are assessed." → Ölçme biçimini karşılaştırırız.'),
      kart('Compulsory ve optional', 'Compulsory education zorunlu eğitimi; optional course seçmeli dersi anlatır.\n"Science is compulsory, but drama is optional." → İki dersin statüsü farklı.'),
      kart('Curriculum ve content', 'Curriculum derslerin genel planı, content ise işlenen içeriktir.\n"The curriculum includes science; the content changes each year."'),
      kart('Değerlendirme türleri', 'Assess değerlendirmek; exam, project ve portfolio farklı kanıtlar sağlar.\n"Projects are assessed at the end of each term." → Projeler her dönem sonunda değerlendirilir.'),
      kart('Outcome ve achievement', 'Outcome sürecin sonucu, achievement ulaşılan başarıdır.\n"The policy improved participation, but exam outcomes stayed the same." → İki gösterge aynı gitmeyebilir.'),
      kart('Politika ve kanıt', 'Policy okulun resmî yaklaşımıdır.\n"The new policy allows students to revise their work." → Yeni kural çalışmalarını düzeltmelerine izin verir.'),
      kart('Erişim ve eşitlik', 'Ücret, ulaşım ve kaynaklar eğitime erişimi etkileyebilir.\n"Students do not have equal access to digital resources." → Dijital kaynaklara erişimleri eşit değildir.'),
      kart('Veriyi dikkatli oku', '"The average score rose, but participation fell." → Ortalama artarken katılım azalmış.\nTek bir sonuçtan bütün sistemin daha iyi olduğu çıkarılmaz.', undefined, { not: 'İki sistemi kıyaslarken ortalamaya ek olarak katılımı ve koşulları da incele.' }),
      kart('Süreç anlatan edilgen', '"Applications are submitted online each spring." → Başvurular her bahar çevrim içi yapılır.\nKimin yaptığı değil, düzenli işleyiş ve zamanı önemlidir.'),
      kart('Şimdi değişen sistem', '"The curriculum is being revised this term." → Müfredat bu dönem yenileniyor.\n"Is revised every year" ise alışılmış, tekrarlanan bir işlemdir.'),
      kart('Dengeli sonuç yaz', '"System A has more facilities, whereas System B offers more flexible courses."\nİyi karşılaştırma farkı belirtir; kanıtsız bir üstünlük yargısı kurmaz.'),
    ], [], [
      { soru: '"Applications are submitted each spring." İş nasıl sunuluyor?', siklar: ['Her yıl yinelenen', 'Şu anda süren'], dogru: 0, aciklama: { dogru: 'Each spring ve are submitted, yinelenen edilgen işi gösterir.', yanlis: 'Each spring, yalnız bugün değil her bahar yinelenen işi anlatır.' }, kart: 9 },
      { soru: 'Ortalama yükselip katılım düştüyse hangi yorum daha dikkatli?', siklar: ['Her öğrenci ilerledi', 'İki gösterge ayrıştı'], dogru: 1, aciklama: { dogru: 'Ortalama ve katılım farklı yönlerde hareket etmiştir.', yanlis: 'Ortalama tek başına her öğrencinin ilerlediğini göstermez.' }, kart: 8 },
    ]),
    konu('ing11-milli-gunler', 'National Days and Celebrations', [
      kart('Günleri anlatmak', 'Ulusal ve dinî günleri yalnız adlarıyla değil, anma ve kutlama biçimleriyle karşılaştır.\n"The day is celebrated with school performances." → Gün okul gösterileriyle kutlanır.'),
      kart('29 October', '"Republic Day is celebrated on 29 October." → 29 Ekim Cumhuriyet Bayramı’dır.\n"Students prepare a ceremony at school." → Öğrenciler okulda tören hazırlar.'),
      kart('23 April', '"National Sovereignty and Children’s Day is on 23 April." → 23 Nisan’ın resmî İngilizce adı.\nÇocukların katıldığı etkinlikler anlatılırken "children take part" kullanılır.'),
      kart('19 May', '"Commemoration of Atatürk, Youth and Sports Day is on 19 May."\n"Young people join sports events." → Gençler spor etkinliklerine katılır.'),
      kart('30 August', '"Victory Day is observed on 30 August." → 30 Ağustos Zafer Bayramı.\nObserved, bir günün anıldığını; celebrated, kutlandığını vurgulayabilir.'),
      kart('15 July', '"Democracy and National Unity Day is observed on 15 July."\nAnma programları anlatılırken saygılı ve olgusal bir dil kullan.'),
      kart('Dinî bayram adları', 'Eid al-Fitr Ramazan Bayramı; Eid al-Adha Kurban Bayramı’dır.\n"Families visit relatives during Eid al-Fitr." → Aileler akrabalarını ziyaret eder.'),
      kart('Düzenli ve geçici', '"Our school holds a ceremony every year." → Her yıl olan alışkanlık.\n"We are preparing a concert now." → Şu anda süren hazırlık.', undefined, { not: 'Tarih ve sıklık öbeğine bak: every year alışkanlığı, now şu anda süren işi işaret eder.' }),
      kart('Edilgen kutlama', '"Flags are displayed in the school hall." → Bayraklar okul salonunda sergilenir.\n"The programme is being prepared today." → Program bugün hazırlanıyor.'),
      kart('Zamanın yeri', '"The event starts at ten in the school hall on Friday."\nAt saatle, in yerle, on günle kullanılır; dinleyiciye somut zaman-yer verir.'),
      kart('Nazik duyuru', '"Keep me in the loop about the ceremony, please." → Törendeki gelişmelerden beni haberdar et.\nDuyuruda gün, yer ve katılım bilgisi bulunmalı.'),
    ], [], [
      { soru: '"The programme is being prepared today." Ne anlatılıyor?', siklar: ['Süren hazırlık', 'Yıllık gelenek'], dogru: 0, aciklama: { dogru: 'Is being prepared, bugün sürmekte olan edilgen eylem.', yanlis: 'Today ve is being hazırlığın şu an sürdüğünü anlatır.' }, kart: 9 },
      { soru: '"Every year" öbeği hangi bilgiyi verir?', siklar: ['Yer', 'Sıklık'], dogru: 1, aciklama: { dogru: 'Every year olayın her yıl tekrarlandığını bildirir.', yanlis: 'Every year yer değil, tekrar sıklığı bildirir.' }, kart: 8 },
    ]),
  ]),
  tema('ing11-t2', 'Classroom Life & Learning', [
    konu('ing11-ogrenme-bicimleri', 'Comparing Learning Activities and Styles', [
      kart('Etkinliği amaçla eşleştir', 'Drill kısa tekrarlı alıştırma, workshop uygulamalı atölyedir.\n"A drill helps me practise forms; a workshop lets me build a model."'),
      kart('Tek doğru tarz yok', 'Bir öğrenci şemadan, bir başkası tartışmadan yararlanabilir; bu kalıcı bir etiket değildir.\n"I prefer diagrams for this topic, but discussion helps me explain it."'),
      kart('Collaborative çalışma', 'Collaborative birlikte üretmek demektir.\n"The group compares ideas before writing." → Grup yazmadan önce fikirleri karşılaştırır.'),
      kart('Practical ve feedback', 'Practical uygulamalı demektir; feedback neyin geliştirileceğini gösteren dönüttür.\n"The teacher gives feedback after our workshop."'),
      kart('Monotonous ne zaman?', 'Tek biçimli etkinlik uzun sürerse monotonous olabilir; her tekrar gereksiz değildir.\n"A short drill is useful, but an hour of copying is monotonous."'),
      kart('Etkiyi ölç', 'Promote desteklemek, restrict sınırlamak, impact etkilemektir.\n"Group work can promote interaction, but noise may restrict concentration."'),
      kart('Sabit gelecek programı', 'Takvimde kesinleşmiş ders için geniş zaman kullanılır.\n"The workshop starts at nine tomorrow." → Atölye yarın dokuzda başlar.'),
      kart('Kararlaştırılmış buluşma', 'Kişisel düzenleme için şimdiki zaman gelecek anlamı taşıyabilir.\n"We are meeting our study group tomorrow." → Buluşma kararlaştırılmış.', undefined, { not: 'Tomorrow tek başına zamanı seçmez; sabit çizelge mi, kararlaştırılmış kişisel plan mı diye bak.' }),
      kart('Plan ile anlık karar', '"I am going to join the debate." → Önceden planlandı.\n"You need a partner? I will join you." → Konuşurken verilen karar.'),
      kart('Yardım isteme', '"Could you explain the last step, please?" → Nazik rica.\n"Will you help me with the chart?" → Yardım isteği; ikisi de bağlama uyar.'),
      kart('Kendi seçimini gerekçelendir', '"For new words, a drill helps me; for ideas, I prefer a discussion."\nEtkinliği kendi amacınla ilişkilendir; bir yöntemi herkes için üstün ilan etme.'),
    ], [], [
      { soru: '"The workshop starts at nine tomorrow." Hangi gelecek bağlamı var?', siklar: ['Sabit çizelge', 'Anlık karar'], dogru: 0, aciklama: { dogru: 'Programdaki başlangıç saati geniş zamanla verilir.', yanlis: 'Starts at nine, sabit çizelgede yer alan zamanı belirtir.' }, kart: 7 },
      { soru: '"I am going to join the debate." Konuşan neyi anlatıyor?', siklar: ['Anlık kararı', 'Önceden planı'], dogru: 1, aciklama: { dogru: 'Be going to daha önce kurulmuş planı anlatır.', yanlis: 'Anlık karar için burada will uygun olurdu.' }, kart: 9 },
    ]),
    konu('ing11-geleneksel-dijital', 'Traditional and Tech-Enhanced Education', [
      kart('İki araç, iki olanak', 'Printed handout basılı ders notu; online video çevrim içi kaynaktır.\n"The printed handout works offline; the video can be replayed."'),
      kart('Yüz yüze ve uzaktan', 'Face-to-face aynı ortamda etkileşim, distance learning uzaktan öğrenmedir.\n"A live online lesson can still be interactive." → Uzaktan ders de etkileşimli olabilir.'),
      kart('Erişim eşit değildir', 'Teknoloji her öğrencide aynı cihaz ve bağlantı bulunduğu varsayımıyla seçilmemeli.\n"Some students cannot access the platform at home." → Erişim farkını belirtir.'),
      kart('Dikkat ve seçim', 'Distract dikkat dağıtmak, enable mümkün kılmaktır.\n"A tablet enables quick research, but messages can distract us." → İki etki bir arada.'),
      kart('Phrasal verbs', '"Go over the notes" = notları gözden geçir.\n"Hand in the task" = görevi teslim et.\n"Keep up with the class" = sınıfın temposuna yetiş.'),
      kart('Kurulum ve güncelleme', 'Install yüklemek, update güncellemek, subscribe abone olmaktır.\n"We are installing antivirus software tomorrow." → Önceden ayarlanmış iş.'),
      kart('Gelecek edilgeni', 'Eylemden etkilenen şey öndeyse "will be + V3" kullan.\n"The smart board will be updated next week." → Akıllı tahta gelecek hafta güncellenecek.'),
      kart('Önceden yapılan plan', '"We are going to use digital resources for the project." → Plan hazır.\n"The online session starts at ten tomorrow." → Çizelgede sabit saat.', undefined, { not: 'Gelecek anlatımını takvim, düzenleme ve karar anına göre seç; tek bir zaman her duruma uymaz.' }),
      kart('Nazik teknik yardım', '"Could you fill out this form, please?" → Nazik rica.\n"Will you help me install the app?" → Doğrudan yardım isteği.'),
      kart('Dengeli kullanım', '"The textbook gives a clear sequence, whereas the app offers instant feedback."\nGeleneksel ve dijital araçları amaç, erişim ve dikkat açısından karşılaştır.'),
      kart('Kısa sınıf planı', '"We are meeting on Friday. Handouts will be shared online after the lesson."\nDüzenlenmiş buluşma şimdiki zamanla, gelecek edilgen iş will be ile verilir.'),
    ], [], [
      { soru: '"The smart board will be updated." Odak hangisidir?', siklar: ['Güncellenecek nesne', 'İşi yapan kişi'], dogru: 0, aciklama: { dogru: 'Edilgen yapı akıllı tahtayı öne çıkarır.', yanlis: 'Will be updated yapısı yapan kişiyi söylemeden nesneyi öne çıkarır.' }, kart: 7 },
      { soru: '"Could you fill out this form?" Ne ifade eder?', siklar: ['Kesin gelecek planı', 'Nazik rica'], dogru: 1, aciklama: { dogru: 'Could you, kibarca birinden iş yapmasını ister.', yanlis: 'Could you + fiil, gelecek planı değil nazik ricadır.' }, kart: 9 },
    ]),
  ]),
]
