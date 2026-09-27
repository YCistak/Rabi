import { kart, konu, tema, type Tema } from '../tip'

/** TYMM İngilizce 11, B1.3: 5. ve 6. temaların resmî alt temaları. */
export const ingilizce11Temalar3: Tema[] = [
  tema('ing11-t5', 'Life In The Neighbourhood, City & Social Life', [
    konu('ing11-city-types', 'Types Of Cities', [
      kart('Yaşanabilir kent', 'Liveable, günlük yaşamı kolaylaştıran kent demektir.\nA liveable city has safe streets and public spaces.'),
      kart('Yavaş kent', 'Slow city, yerel yaşamı ve sakin ritmi korumaya çalışır.\nThis slow city protects its local markets and traditions.'),
      kart('Sürdürülebilir kent', 'Sustainable city, kaynakları gelecek için dikkatli kullanır.\nA sustainable city saves water and supports public transport.'),
      kart('Çevre dostu kent', 'Eco-friendly city, çevreye verilen zararı azaltır.\nThe city has built more cycle lanes to reduce traffic.', undefined, {
        not: 'Slow ve sustainable eş anlamlı değil: biri yaşam ritmini, diğeri kaynak kullanımını öne çıkarır.',
      }),
      kart('Metropolis ve mega city', 'Metropolis büyük ve etkili bir kenttir; mega city çok yüksek nüfusuyla anılır.\nA metropolis can grow into a mega city.'),
      kart('Sanayi kenti ve banliyö', 'Industrial city üretimle, suburb ise kent merkezinin dışındaki yerleşimle ilgilidir.\nShe works in the industrial city but lives in a suburb.'),
      kart('Yürünebilir mahalle', 'Walkable yerde temel ihtiyaçlara yürüyerek ulaşılır.\nResidents can walk to the library and the market.'),
      kart('Belediyenin rolü', 'Municipality, yerel hizmetleri planlayan belediyedir.\nThe municipality has opened two new parks this year.'),
      kart('Durum ve süreç', 'Present perfect sonuç veya durumu; progressive süren eylemi vurgular.\nThe city has been green since 2010. / It has been planting trees for years.'),
      kart('Soru eki: question tag', 'Olumlu ana cümleye genellikle olumsuz kısa soru eklenir.\nThis neighbourhood has become quieter, hasn’t it?'),
      kart('Miktar ve edilgen yapı', 'Both iki grubu, all tüm grubu belirtir; edilgen yapı yapılan işe odaklanır.\nBoth districts have been improved; all parks have been repaired.'),
    ], [], [
      {
        soru: 'Yerel kültürü ve sakin yaşamı korumayı öne çıkaran kent hangisi?',
        siklar: ['Slow city', 'Industrial city'], dogru: 0, kart: 2,
        aciklama: { dogru: 'Slow city sakin ritmi ve yerel yaşamı korur.', yanlis: 'Industrial city üretimle ilişkilidir; yerel ve sakin yaşam slow city özelliğidir.' },
      },
      {
        soru: '“The municipality ___ two parks this year.” En uygun tamamlama?',
        siklar: ['has been open', 'has opened'], dogru: 1, kart: 8,
        aciklama: { dogru: 'Has opened tamamlanan ve sonucu görülen eylemi anlatır.', yanlis: 'Has been open parkların açık olma durumunu söyler; belediyenin açma eylemini anlatmaz.' },
      },
    ]),
    konu('ing11-rural-urban-life', 'Social Life In The Rural Areas And Cities', [
      kart('Kırsal ve kentsel yaşam', 'Rural kırsal, urban kentsel demektir; iki yerdeki fırsatlar farklı olabilir.\nUrban areas offer many concerts; rural areas can be quieter.'),
      kart('Residents ve bonds', 'Residents bir yerde yaşayanlar; bonds insanlar arasındaki bağlardır.\nThe residents have built strong bonds through shared work.'),
      kart('Bir araya gelmek', 'Meet up planlı buluşma; come across rastlantıyla karşılaşmadır.\nWe meet up on Fridays, but I came across Ali yesterday.'),
      kart('Sosyalleşmek', 'Socialise, başkalarıyla vakit geçirip ilişki kurmaktır.\nThe new community centre helps neighbours socialise.'),
      kart('Etkinlik seçenekleri', 'Exhibition sergi; recreational activity dinlenme veya eğlenme etkinliğidir.\nThe town has organised an art exhibition and a walking club.', undefined, {
        not: 'Limited sözcüğü “hiç yok” demez; seçeneklerin az olduğunu söyler.',
      }),
      kart('Kısıtlı ve kalabalık', 'Limited seçenek sayısını, overpopulated aşırı nüfusu anlatır.\nThe village has limited events; the city centre is overpopulated.'),
      kart('Samimi ve huzurlu', 'Cosy rahat, sincere içten, peaceful huzurlu anlamına gelir.\nTheir small café feels cosy, and the welcome is sincere.'),
      kart('Uzun süredir sürüyor', 'Present perfect progressive, geçmişte başlayıp süren eylemi vurgular.\nWe have been meeting up every Saturday for three years.'),
      kart('Sonuç ve devam', 'Has organised tamamlanan sonucu; has been organising süren işi öne çıkarır.\nThe group has organised five events. / It has been organising events all year.'),
      kart('Etkinliğin edilgen anlatımı', 'İşi yapan bilinmiyorsa veya önemli değilse edilgen yapı kullanılabilir.\nSeveral concerts have been planned by the municipality.'),
      kart('Seçimleri karşılaştırmak', 'Şehir ve köy için tek bir hüküm yerine ölçüt belirle: ulaşım, huzur, etkinlik.\nBoth places have benefits, but the choice depends on your needs.'),
    ], [], [
      {
        soru: '“I ___ my neighbour by chance.” Boşluğa hangisi gelir?',
        siklar: ['came across', 'met up with'], dogru: 0, kart: 3,
        aciklama: { dogru: 'By chance rastlantıyı anlatır; come across buna uyar.', yanlis: 'Meet up genellikle önceden ayarlanmış bir buluşmadır.' },
      },
      {
        soru: '“They have been meeting up for years.” Hangi anlam öndedir?',
        siklar: ['Tek bir bitmiş buluşma', 'Süren alışkanlık'], dogru: 1, kart: 8,
        aciklama: { dogru: 'Have been meeting up uzun süren ve devam eden eyleme odaklanır.', yanlis: 'Cümle tek bir tamamlanmış buluşmadan söz etmiyor.' },
      },
    ]),
  ]),
  tema('ing11-t6', 'Life In The World & Culture', [
    konu('ing11-cultural-celebrations', 'Cultural (Music And Art) Celebrations In The World', [
      kart('Canlı ve solo gösteri', 'Live performance seyirci önünde yapılır; solo performance tek sanatçılıdır.\nThe singer gave a solo performance at the festival.'),
      kart('Orkestra ve senfoni', 'Orchestra birlikte çalan müzisyenlerdir; symphony uzun bir orkestra eseridir.\nThe orchestra performed a new symphony.'),
      kart('Halk müziği ve miras', 'Folk music bir topluluğun gelenekleriyle ilişkilidir; pass down kuşaklara aktarmaktır.\nThese songs have been passed down for generations.'),
      kart('Sergi ve stüdyo', 'Art exhibition eserlerin gösterildiği etkinlik; studio üretim alanıdır.\nThe artist made the sculpture in her studio.'),
      kart('Mural ve pottery', 'Mural duvara yapılan büyük resimdir; pottery kilden yapılan eşyalardır.\nThe mural is outside, while the handmade pottery is inside.'),
      kart('Sanatçının hazırlığı', 'Rehearse prova yapmak, compose müzik eseri yazmaktır.\nThe performers rehearsed the song that Mina composed.', undefined, {
        not: 'Who kişiye, which nesneye bağlanır; virgül ise yan bilginin çıkarılabildiğini gösterir.',
      }),
      kart('Tanımlayıcı yan cümle', 'Defining relative clause, hangi kişi veya şey olduğunu belirler; virgül almaz.\nThe performer who won the prize plays folk music.'),
      kart('Ek bilgi veren yan cümle', 'Non-defining relative clause ek bilgi verir; iki yanında virgül bulunur.\nThe mural, which was painted last year, is impressive.'),
      kart('Yer ve zaman bağlantısı', 'Where bir yeri, when bir zamanı açıklayan yan cümlede kullanılır.\nThe studio where she works is open on the day when the festival begins.'),
      kart('Sonuç kurmak', 'Therefore ve thus, önceki bilgiden çıkan sonucu bağlar.\nThe band played late; therefore, the crowd stayed longer.'),
      kart('Övgü ve katılım', 'Take part in katılmak; stole the show en çok beğenilen olmak demektir.\nAda took part in the concert, and her solo stole the show.'),
    ], [], [
      {
        soru: '“The artist ___ painted the mural” boşluğuna hangisi gelir?',
        siklar: ['who', 'where'], dogru: 0, kart: 7,
        aciklama: { dogru: 'Artist kişidir; kişi için who kullanılır.', yanlis: 'Where yer belirtir; artist bir kişidir.' },
      },
      {
        soru: '“The mural, which was painted last year, ...” yan bölüm ne verir?',
        siklar: ['Zorunlu ayırt edici bilgi', 'Ek bilgi'], dogru: 1, kart: 8,
        aciklama: { dogru: 'Virgüllü which bölümü çıkarılsa da hangi mural olduğu anlaşılır.', yanlis: 'Zorunlu ayırt edici bölüm virgülle ayrılmaz.' },
      },
    ]),
    konu('ing11-sports-culture', 'Sports And Sports Cultures And Competitions', [
      kart('League ve tournament', 'League sezonluk yarışma düzenidir; tournament kısa eleme veya karşılaşma dizisidir.\nOur team joined a weekend tournament after the league ended.'),
      kart('Championship ve medal', 'Championship şampiyonluk yarışmasıdır; medal derece ödülüdür.\nThe swimmer won a medal at the championship.'),
      kart('Sahadaki kişiler', 'Referee kuralları uygular; spectator izler; supporter takımı destekler.\nThe referee stopped the match while supporters watched.'),
      kart('Mekân ve donanım', 'Court saha, net ağ, stadium büyük stadyumdur.\nThe players crossed the court and hit the ball over the net.'),
      kart('Güvenlik ve hazırlık', 'Helmet başı, gloves elleri korur; warm up ısınmaktır.\nThe cyclist who wore a helmet warmed up before the race.', undefined, {
        not: 'Spectator izler; supporter ayrıca bir takımı tutar. Her seyirci aynı takımın destekçisi değildir.',
      }),
      kart('Hareket fiilleri', 'Kick ayakla vurmak, shoot hedefe atmak, block engellemek, dive dalmaktır.\nShe blocked the shot, then dived to catch the ball.'),
      kart('Teknik ve disiplin', 'Technique bir hareketi yapma yolu; discipline düzenli çalışmadır.\nHis technique improved because he trained with discipline.'),
      kart('Katılım ve tutku', 'Passion güçlü ilgi; competitive kazanma isteği yüksek demektir.\nThe player whose passion inspired the team trained every day.'),
      kart('İptal kararı', 'Call off planlanan etkinliği iptal etmektir.\nThe match, which was due to start at six, was called off because of rain.'),
      kart('Sebep ve sonuç', 'Therefore sonucu bildirir; because sebebi verir.\nThe court was wet; therefore, the referee called off the match.'),
      kart('Sporu anlatmak', 'Who kişi, whose sahiplik, where yer açıklamasında kullanılır.\nThe athlete whose coach won a medal trains in the gym where we met.'),
    ], [], [
      {
        soru: 'Yağmur yüzünden maç yapılmayacaksa hangi ifade uygun?',
        siklar: ['The match was called off.', 'The match warmed up.'], dogru: 0, kart: 9,
        aciklama: { dogru: 'Call off planlanan maçı iptal etmektir.', yanlis: 'Warm up sporcu için ısınmadır; maçın iptalini anlatmaz.' },
      },
      {
        soru: '“The athlete ___ coach won a medal” boşluğuna hangisi gelir?',
        siklar: ['where', 'whose'], dogru: 1, kart: 11,
        aciklama: { dogru: 'Whose sporcuyla antrenörü arasında sahiplik bağı kurar.', yanlis: 'Where yer için kullanılır; coach kişiyle ilişkili bir addır.' },
      },
    ]),
  ]),
]
