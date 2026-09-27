import { sikli, soru, type SoruKarti } from '../tip'

type Iddia = [ifade: string, dogru: boolean, aciklama: string]
type Secim = [metin: string, dogru: string, yanlis: string, aciklama: string]

function derle(iddialar: Iddia[], secimler: Secim[]): Omit<SoruKarti, 'id'>[] {
  const sonuc: Omit<SoruKarti, 'id'>[] = []
  for (let i = 0; i < iddialar.length; i++) {
    sonuc.push(soru(...iddialar[i]))
    const [metin, dogru, yanlis, aciklama] = secimler[i]
    const konum = (i % 2) as 0 | 1
    sonuc.push(sikli(metin, konum === 0 ? [dogru, yanlis] : [yanlis, dogru], konum, aciklama))
  }
  return sonuc
}

export const ingilizce11Sorulari3: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'ing11-city-types': derle([
    ['“A walkable neighbourhood” temel yerlere yürüyerek ulaşılabilen mahalledir.', true, 'Walkable yakın hizmetlere yürüyüşle erişmeyi anlatır.'],
    ['“Slow city” ile “sustainable city” tam olarak aynı kent özelliğini anlatır.', false, 'Slow sakin yaşamı, sustainable kaynakların geleceğe uygun kullanımını öne çıkarır.'],
    ['“The city has built new parks” cümlesi tamamlanmış işin sonucunu öne çıkarır.', true, 'Present perfect yeni parkların artık var olduğunu vurgular.'],
    ['“The city has been planting trees for years” yalnız bitmiş tek bir eylemi anlatır.', false, 'Present perfect progressive yıllardır süren çalışmayı vurgular.'],
    ['“This city has changed” cümlesine “hasn’t it” kısa onay sorusu eklenebilir.', true, 'Olumlu has ile kurulan cümleye olumsuz hasn’t it eklenir.'],
    ['“Both districts” üç ya da daha çok bölgenin tamamını belirtir.', false, 'Both yalnız iki bölgeyi anlatır; daha geniş grup için all kullanılır.'],
  ], [
    ['Kaldırımları ve yakın hizmetleri olan mahalle için hangi sıfat uygun?', 'Walkable', 'Overpopulated', 'Walkable yaya olarak ulaşılabilir çevreyi anlatır.'],
    ['Yerel ritmi koruyan şehir için hangi ifade uygundur?', 'Slow city', 'Industrial city', 'Slow city sakin yaşam ve yerel kültürle ilgilidir.'],
    ['“The municipality ___ two parks.” Sonucu vurgulayan tamamlama?', 'has opened', 'has been opening', 'Bitmiş iki park somut sonuçtur; has opened uygundur.'],
    ['“It has been ___ trees for years.” Boşluğa hangi sözcük gelir?', 'planting', 'planted', 'Has been + fiil-ing süren eylemi anlatır.'],
    ['“The suburb is quieter, ___?” için doğru kısa soru?', 'isn’t it', 'doesn’t it', 'Ana cümlede is kullanıldığından tag isn’t it olur.'],
    ['“All parks have been repaired.” Cümlede hangi odak vardır?', 'Yapılan iş ve sonucu', 'Onaran kişinin kimliği', 'Edilgen yapı parkların onarılmasına odaklanır.'],
  ]),
  'ing11-rural-urban-life': derle([
    ['“We met up” önceden ayarlanmış bir buluşmayı anlatabilir.', true, 'Meet up bir araya gelmek için kullanılan doğal ifadedir.'],
    ['“I came across her by chance” planlanmış buluşma demektir.', false, 'Come across rastlantıyla karşılaşmayı anlatır.'],
    ['“Limited activities” hiç etkinlik bulunmadığını zorunlu olarak söyler.', false, 'Limited seçeneklerin az olduğunu söyler, sıfır olduğunu değil.'],
    ['“The residents have built strong bonds” ilişkilerin sonucunu anlatır.', true, 'Strong bonds güçlü toplumsal bağlar demektir.'],
    ['“They have been meeting for years” devam eden bir alışkanlığı vurgular.', true, 'Present perfect progressive geçmişten bugüne süren eylemi gösterir.'],
    ['“Exhibitions have been planned” cümlesinde düzenleyen kişi ana odaktır.', false, 'Edilgen yapı planlanan sergileri öne alır.'],
  ], [
    ['“I saw my old friend unexpectedly.” Hangi ifade aynı anlamdadır?', 'I came across my friend.', 'I met up with my friend.', 'Unexpectedly plansız karşılaşmayı belirtir.'],
    ['Planlanmış cuma buluşması için hangi cümle uygun?', 'We meet up on Fridays.', 'We come across on Fridays.', 'Meet up bilinçli buluşmadır; come across rastlantısaldır.'],
    ['“A cosy café” nasıl bir yer izlenimi verir?', 'Rahat ve sıcak', 'Aşırı kalabalık', 'Cosy rahat ve samimi ortam için kullanılır.'],
    ['“The village has limited events” cümlesinden ne çıkarılır?', 'Etkinlik seçeneği azdır', 'Hiç etkinlik yoktur', 'Limited az sayıda seçeneği belirtir.'],
    ['“We have ___ a walking club this year.” Tamamlanmış sonuç?', 'organised', 'been organising', 'Kulübün kurulmuş olması sonuçtur: have organised.'],
    ['“Concerts have been planned.” Hangi ifade cümleyi en iyi açıklar?', 'Etkinliklerin planlandığı', 'Kimin planladığının açıklandığı', 'Edilgen cümle eylemi anlatır; özne olarak düzenleyeni belirtmez.'],
  ]),
  'ing11-cultural-celebrations': derle([
    ['“A solo performance” sahnede tek sanatçının öne çıktığı gösteridir.', true, 'Solo tek kişi tarafından yapılan icrayı belirtir.'],
    ['“The songs were passed down” şarkıların kuşaklar arasında aktarıldığını söyler.', true, 'Pass down gelenek ve bilgiyi sonraki kuşağa iletmektir.'],
    ['“The artist who painted the mural” ifadesindeki who bir yeri açıklar.', false, 'Who kişi olan artist sözcüğünü tanımlar.'],
    ['“The mural, which was painted last year, ...” bölümü zorunlu ayırt edici bilgidir.', false, 'Virgülle ayrılmış yan cümle ek bilgi verir.'],
    ['“The music was loud; therefore, we left early” ikinci bölüm bir sonuçtur.', true, 'Therefore önceki durumun sonucunu bağlar.'],
    ['“Rehearse” bir müzik eserini ilk kez bestelemek anlamına gelir.', false, 'Rehearse prova yapmak, compose beste yapmak demektir.'],
  ], [
    ['Duvara yapılan büyük resim için hangi sözcük uygundur?', 'Mural', 'Pottery', 'Mural duvar resmidir; pottery kil eserleridir.'],
    ['“The performer ___ won the prize” boşluğuna ne gelir?', 'who', 'where', 'Performer bir kişidir; who kişi tanımlar.'],
    ['“The studio ___ she works” için hangi bağlayıcı uygun?', 'where', 'when', 'Studio bir yerdir; where yer ilişkisini kurar.'],
    ['“The band was excellent; ___, the audience stayed.” Sonuç bağlacı?', 'therefore', 'although', 'Kalabalığın kalması önceki bilginin sonucu olarak sunuluyor.'],
    ['“The song ___ he composed” için hangi bağlayıcı uygundur?', 'that', 'who', 'Song bir eserdir; that nesneyi tanımlayabilir.'],
    ['“Her solo stole the show” neyi anlatır?', 'En çok beğenilen kısmı', 'Sahnenin kapandığını', 'Stole the show en çok ilgi ve beğeniyi toplamak demektir.'],
  ]),
  'ing11-sports-culture': derle([
    ['“A spectator” maçı izleyen kişidir; takım tutması gerekmez.', true, 'Supporter ayrıca bir takıma destek verir.'],
    ['“The referee called off the match” maçın başlatıldığını anlatır.', false, 'Call off planlanmış maçı iptal etmektir.'],
    ['“The athlete whose coach won a medal” ifadesinde whose sahiplik ilişkisi kurar.', true, 'Whose antrenörün hangi sporcuya ait olduğunu bağlar.'],
    ['“The court was wet; therefore, the match was cancelled” sonuç bildirir.', true, 'Therefore ikinci bölümün birinci bölümden çıkan sonuç olduğunu gösterir.'],
    ['“Warm up” yarışma sonrasında madalya almak demektir.', false, 'Warm up yarışma veya antrenmandan önce ısınmaktır.'],
    ['“League” yalnız tek günlük eleme yarışması anlamına gelir.', false, 'League genellikle düzenli fikstürlü yarışmadır; tek günlük eleme bunun tek anlamı değildir.'],
  ], [
    ['Kuralları uygulayıp maçı yöneten kişi kimdir?', 'Referee', 'Spectator', 'Referee hakemdir; spectator izleyicidir.'],
    ['“The player ___ trained daily won.” Boşluğa hangi sözcük gelir?', 'who', 'where', 'Player kişi olduğu için who kullanılır.'],
    ['Yağmur yüzünden maç iptal edilirse hangi fiil uygundur?', 'call off', 'warm up', 'Call off planlanan etkinliği iptal etmektir.'],
    ['“The athlete ___ coach won” ifadesini hangi sözcük tamamlar?', 'whose', 'which', 'Whose sporcu ve antrenörü arasında sahiplik ilişkisi kurar.'],
    ['“The court was wet; ___, we moved inside.” Sonuç sözcüğü?', 'therefore', 'because', 'Therefore ıslak sahanın sonucunu belirtir.'],
    ['Takımlar sezon boyunca puan toplayıp sıralanıyor. Hangi sözcük daha doğal?', 'League', 'Tournament', 'Düzenli fikstür ve puan sıralaması genellikle league diye anılır; tournament farklı usullerle yapılabilir.'],
  ]),
}
