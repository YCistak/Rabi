import type { KonuDerinligi } from './11-yardimci'

export const turkceDerinligi: Record<string, KonuDerinligi> = {
  'trk11-karagoz': {
    kartlar: [
      ['Yanlış anlamanın kaynağı', 'Hacivat’ın süslü sözü Karagöz tarafından başka anlamda alınabilir.\nMizah kelimenin iki kullanımından doğar.'],
      ['Muhaverenin işlevi', 'Girişten sonra Karagöz ile Hacivat konuşur.\nBu bölüm tipleri ve çatışmanın dilini tanıtır.'],
      ['Tipi sözünden tanı', 'Çelebi’nin ve Tiryaki’nin konuşması aynı değildir.\nSöz varlığı sosyal çevreyi gösterebilir.'],
      ['Sahneleme sorusu', 'Aynı replik farklı vurgu ve hareketle başka etki yaratır.\nMetni okurken söz ile gösteriyi birlikte düşün.'],
    ],
    iddialar: [
      ['Aynı sözcüğü iki tip farklı anlıyorsa çatışma dil kullanımından doğmuş olabilir.', true, 'Karagöz mizahı çoğu kez yanlış anlamaya dayanır.'],
      ['Tipin konuşma biçimi kişiliği anlamaya yardım eder; yalnız kıyafeti yeterli değildir.', true, 'Dil ve görünüş birlikte değerlendirilir.'],
    ],
    secimler: [
      ['Hacivat’ın sözü farklı anlamda karşılanıyorsa hangi öge çalışır?', 'Yanlış anlama', 'Şive taklidi', 'Sözün iki anlamı mizahı kurar.'],
      ['Mukaddimeden sonra tipleri tanıtan konuşma?', 'Muhavere', 'Fasıl', 'Muhavere Karagöz-Hacivat konuşmasıdır.'],
      ['Bir tipin sosyal çevresine hangi kanıt daha doğrudan?', 'Sözcük seçimi', 'Perdeye giriş sırası', 'Tipin dili çevresini yansıtabilir.'],
      ['Metindeki komik söz sahnede neden değişebilir?', 'Vurgu ve hareketle', 'Perde ve tasvir boyutuyla', 'Sahneleme ses ve beden içerir.'],
      ['Karagöz ile Hacivat’ın dil farkı neye hizmet eder?', 'Çatışma ve mizaha', 'Tiplerin uzlaşmasına', 'Yanlış anlama oyunu ilerletir.'],
    ],
    kontrol: ['İki tip aynı sözü farklı anlıyorsa neyi incelemeli?', 'Sözün bağlamını', 'Tiplerin kıyafetlerini', 'Mizah bağlam farkından doğabilir.'], kontrolKarti: 7,
  },
  'trk11-mektup': {
    kartlar: [
      ['Aynı olay, iki alıcı', 'Arkadaşa yazıda duygu anlatılır; kuruma yazıda talep ve gerekçe öne çıkar.\nKonu aynı olsa da üslup değişir.'],
      ['Dilekçede açıklık', '“Gereğinin yapılması” tek başına sorunu anlatmaz.\nOlay, tarih ve istek kısa biçimde belirtilmeli.'],
      ['Mektupta ses', 'Hitap ve kapanış alıcıyla ilişkinin ipucudur.\nYazarın amacı metnin içtenlik düzeyini belirler.'],
      ['Metin kanıtı', '“Resmî” yorumunu yalnız başlığa değil, hitap ve sözcük seçimine dayandır.\nBiçim ile dil birlikte okunur.'],
    ],
    iddialar: [
      ['Aynı durumu kuruma ve dosta anlatan iki metnin sözcük seçimi farklı olabilir.', true, 'Alıcı ile amaç üslubu belirler.'],
      ['Dilekçede iletişim bilgisi bulunmaması, kurumun yanıt vermesini zorlaştırmaz.', false, 'İletişim bilgisi kurumun dönüş yapabilmesini sağlar.'],
    ],
    secimler: [
      ['Okul yönetimine başvuruda önce ne açık olmalı?', 'Olay ve talep', 'Yazanın duyguları', 'Kurum hangi işlem istendiğini anlamalı.'],
      ['Arkadaşa yazıyla kuruma yazı arasındaki temel değişken?', 'Alıcı ve amaç', 'Yazım ve noktalama', 'İlişki dili etkiler.'],
      ['“Resmî üslup” yorumunu ne destekler?', 'Hitap ve ölçülü sözler', 'Yer ve tarih bulunması', 'Dil ve yapı birlikte incelenir.'],
      ['Dilekçede ek belge varsa nasıl gösterilir?', 'İstekle ilişkisi belirtilir', 'Hitaptan önce sıralanır', 'Kurum dayanağı görebilmelidir.'],
      ['Özel mektuptaki duygu yoğunluğu kuruma yazıda nasıl değişir?', 'Açık talep ve gerekçeye yer açar', 'Daha süslü anlatıma dönüşür', 'Yazma amacı değişir.'],
    ],
    kontrol: ['Kuruma yazıda hangi bilgi eksikse işlem zorlaşır?', 'Açık talep', 'Kişisel hitap', 'İstenen işlem belirtilmelidir.'], kontrolKarti: 8,
  },
  'trk11-eposta': {
    kartlar: [
      ['Konu satırını sınama', '“Dosya” belirsizdir; “11. sınıf proje dosyası” alıcıya bağlam verir.\nKısa olmak tek başına yeterli değil.'],
      ['İsteğin yeri', 'Gövdenin başında amaç, sonra gerekli ayrıntı verilir.\nAlıcı ne yapacağını son satıra kadar beklememeli.'],
      ['Ton ve kanal', 'Arkadaş grubundaki kısaltmalar resmî yazışmada yanlış anlaşılabilir.\nKanalın hızı üslup kuralını kaldırmaz.'],
      ['Yanıtı kolaylaştır', 'Birden çok talebi maddele ve zaman sınırını açık yaz.\nBelirsiz “yakında” yerine doğrulanabilir tarih kullan.'],
    ],
    iddialar: [
      ['“Yarın” sözü tarih verilmeden yazılırsa iletinin ne zaman okunduğuna göre belirsizleşebilir.', true, 'Kesin tarih daha güvenlidir.'],
      ['Konu satırı açık olsa bile gövdedeki isteğin anlaşılır yazılması gerekir.', true, 'Başlık tek başına işlem talimatı değildir.'],
    ],
    secimler: [
      ['“Dosya” yerine hangi konu satırı alıcıya daha çok bağlam verir?', 'Proje dosyası teslimi', 'Önemli: dosya', 'Konu satırı işin ne olduğunu göstermeli.'],
      ['İki farklı talep aynı iletideyse hangisi okunmayı kolaylaştırır?', 'Maddelerle ayırmak', 'İkisini ekte açıklamak', 'Her istek görünür olur.'],
      ['“Yakında gönderirim” yerine ne daha açık?', 'Tarih belirtmek', 'En kısa sürede demek', 'Alıcı zamanlamayı bilir.'],
      ['Resmî alıcıya arkadaş grubu kısaltması neden riskli?', 'Ton ve anlam belirsizleşir', 'Konu satırı geçersizleşir', 'Alıcı kısaltmayı bilmeyebilir.'],
      ['İleti yanıtı gecikiyorsa hangisi kontrol edilmeli?', 'İstek ve alıcı açıklığı', 'İmza ve unvan biçimi', 'Ne istendiği ve kime gittiği anlaşılmalı.'],
    ],
    kontrol: ['“Dosya” konu satırının sorunu?', 'Bağlam vermemesi', 'Çok uzun olması', 'Alıcı dosyanın ne olduğunu anlamaz.'], kontrolKarti: 7,
  },
  'trk11-turk-dunyasi-hikaye': {
    kartlar: [
      ['Genelleme tuzağı', 'Bir kahramanın tercihi tüm toplumun geleneği sayılamaz.\nMetindeki kişisel olanı kültürel olandan ayır.'],
      ['Kültürel ayrıntı', 'Bir törenin adı metinde geçebilir.\nNe anlama geldiğini olay ve kişinin davranışıyla yorumla.'],
      ['Anlatıcı sınırı', 'Birinci kişi yalnız gördüğünü ve bildiğini anlatır.\nBaşka kişinin içinden doğrudan söz ediyorsa gerekçe ara.'],
      ['Karşılaştırma ölçütü', 'İki hikâyeyi aynı tema üzerinden karşılaştır.\nBiri aileyi sözle, diğeri eylemle anlatabilir.'],
    ],
    iddialar: [
      ['Bir hikâyedeki tek kişinin davranışı bütün kültürün değişmez kuralı sayılamaz.', true, 'Bireysel ve toplumsal düzey ayrılmalıdır.'],
      ['Aynı temalı iki hikâyenin anlatıcıları farklıysa okura verilen bilgi de değişebilir.', true, 'Bakış açısı bilgi sınırını etkiler.'],
    ],
    secimler: [
      ['Bir kahramanın törene gitmemesi neyi kanıtlamaz?', 'Toplumun töreni terk ettiğini', 'Kişinin o gün gitmediğini', 'Tek kişi üzerinden toplum genellenmez.'],
      ['Birinci kişi anlatıcı başkasının iç dünyasını nasıl bilir?', 'Ancak söz ve davranıştan çıkarır', 'Anlatıcı olduğu için bilir', 'Birinci kişi bilgisi sınırlıdır.'],
      ['İki hikâyede aile teması nasıl karşılaştırılır?', 'Aynı ölçütle metin örnekleri', 'Yazarların yaşamöyküleriyle', 'Tema işlenişi kanıtla kıyaslanır.'],
      ['Yerel sözcüğün anlamı belirsizse ilk kaynak?', 'Cümledeki bağlam', 'Türkiye Türkçesindeki benzeri', 'Bağlam kullanımı açar.'],
      ['Ortak kültür iziyle yöresel fark birlikte görüldüğünde?', 'İkisi de kaydedilir', 'Ortak iz esas alınır', 'Ortaklık tek tiplik değildir.'],
    ],
    kontrol: ['Tek bir kişi davranışı neyi göstermez?', 'Bütün toplumun kuralını', 'O kişinin tercihini', 'Kültürel genelleme için daha çok kanıt gerekir.'], kontrolKarti: 7,
  },
  'trk11-orhun': {
    kartlar: [
      ['Konuşan kim?', 'Yazıtta yönetici sesi halka geçmişi hatırlatır.\nSözün hedefi öğüt ve birlik çağrısıdır.'],
      ['Uyarının nedeni', 'Geçmişteki yanlış kararlar anlatılarak geleceğe ders çıkarılır.\nTarih bilgisi söylevin gerekçesine dönüşür.'],
      ['Yineleme', 'Benzer sözlerin dönmesi ana düşünceyi pekiştirir.\nTekrarı gereksiz söz sayma.'],
      ['Belge ve söylev', 'Yazıt tarihî bilgi verirken ikna etmeye de çalışır.\nOlayı ve olayın yorumunu ayır.'],
    ],
    iddialar: [
      ['Yazıtta geçmişteki olayın anılması, dinleyiciye öğüt verme işlevi de taşıyabilir.', true, 'Tarih anlatısı birlik çağrısını destekler.'],
      ['Bir yazıt tarihî belge ise içindeki her söz tarafsız kayıt olmak zorundadır.', false, 'Yönetici sesi yorum ve amaç taşır.'],
    ],
    secimler: [
      ['Yazıtta halka geçmiş yenilgi hatırlatılıyorsa amaç ne olabilir?', 'Gelecek için uyarmak', 'Düşmanı yüceltmek', 'Geçmişten ders çıkarılır.'],
      ['Olay ile yorum nasıl ayrılır?', 'Ne oldu ve nasıl değerlendirildi', 'Kim konuştu ve kime konuştu', 'Yazıt ikna edici ses taşır.'],
      ['Yinelenen birlik çağrısı ne işe yarar?', 'Ana düşünceyi güçlendirir', 'Kronolojiyi kurar', 'Tekrar vurgu yaratır.'],
      ['Bir yazıtta doğrudan “siz” deniyorsa ne anlaşılır?', 'Hedef kitleye seslenildiği', 'Yabancı elçiye yazıldığı', 'Hitap söylev niteliğini gösterir.'],
      ['Orhun’u bugünkü siyasal kavramlarla aynen okumak neden riskli?', 'Dönemin bağlamı farklıdır', 'Yazıtlar Arap harfiyle yazılmıştır', 'Tarihî anlam kendi koşuluyla kurulur.'],
    ],
    kontrol: ['Yazıttaki geçmiş örnekler neye hizmet edebilir?', 'Öğüde', 'Soy kütüğüne', 'Olaylar halka verilen uyarıyı destekler.'], kontrolKarti: 8,
  },
  'trk11-divan-ani': {
    kartlar: [
      ['Sözcük ve kültür', 'Bir sözlükteki deyim yalnız anlam değil kullanım çevresi de verir.\nDil, kültürel yaşantının izidir.'],
      ['Anının seçiciliği', 'Yazar geçmişin bazı anlarını seçer, bazılarını atlar.\nBu seçimi amaç ve bakış açısıyla değerlendir.'],
      ['Kaynak türü farkı', 'Dîvânu Lugâti’t-Türk dil tanıtmayı, anı yaşantı aktarmayı hedefler.\nAynı olayı aynı biçimde anlatmazlar.'],
      ['Tarihçi nasıl kullanır?', 'Anıyı başka belgeyle karşılaştırır.\nKişisel tanıklık değerli olsa da tek başına kesin hüküm değildir.'],
    ],
    iddialar: [
      ['Anıda anlatılmayan bir olayın hiç yaşanmadığı sonucu çıkarılamaz.', true, 'Yazar seçerek anlatır.'],
      ['Sözlükteki atasözü, sözcük anlamı yanında kültürel bağlam da taşıyabilir.', true, 'Kullanım örneği yaşantıdan iz verir.'],
    ],
    secimler: [
      ['Bir anıda olay atlanmışsa hangi yorum temkinli?', 'Yazar seçmiş olabilir', 'Olay kesin yaşanmadı', 'Bellek ve amaç seçimi etkiler.'],
      ['Sözlükte atasözü bulunması neyi gösterir?', 'Dil ve kültür bağını', 'Eserin bir anı olduğunu', 'Kullanım örneği kültür taşır.'],
      ['Bir tarihçi anıyı nasıl kullanmalı?', 'Başka belgeyle karşılaştırarak', 'Tek başına kesin kayıt sayarak', 'Tanıklık bakış açısı içerir.'],
      ['Dîvânu Lugâti’t-Türk ile anının amaç farkı?', 'Dil tanıtımı ve yaşantı aktarımı', 'Şiir derleme ve olay kaydı', 'Metin türleri farklı hedefler taşır.'],
      ['Anlatıcının tarihî olay hakkındaki duygusu ne olarak okunur?', 'Kişisel yorum', 'Nesnel tarih bilgisi', 'Duygu tanıklığa eşlik eder.'],
    ],
    kontrol: ['Anıda eksik olay neyi kanıtlamaz?', 'Olayın hiç yaşanmadığını', 'Yazarın seçici olduğunu', 'Anı seçilmiş yaşantıları aktarır.'], kontrolKarti: 8,
  },
  'trk11-asik': {
    kartlar: [
      ['Yanıtın ilişkisi', 'Atışmada yeni dörtlük önceki söze cevap verir.\nUyak tutsa bile anlam koparsa atışma zayıflar.'],
      ['İcra ve metin', 'Yazılı dörtlük sözleri gösterir; ezgi ve duraklama icrada duyulur.\nİki biçim aynı bilgiyi vermez.'],
      ['Mahlasın işlevi', 'Âşık kendini mahlasla tanıtabilir.\nAdın geçtiği yer geleneğin izini sürmeye yardım eder.'],
      ['Dinleyici etkisi', 'Atışma canlı ortamda dinleyicinin tepkisiyle ilerler.\nSözlü icra sabit sayfa değildir.'],
    ],
    iddialar: [
      ['Uyaklı ama önceki dörtlüğe hiç cevap vermeyen söz, atışmanın anlam ilişkisini zayıflatır.', true, 'Atışma karşılıklı yanıta dayanır.'],
      ['Yazılı şiir metni, ezgi ve duraklamayı dinlemekle aynı bilgiyi verir.', false, 'İcra ses ve zamanlama içerir.'],
    ],
    secimler: [
      ['Bir âşık aynı uyakla ama ilgisiz konu söylerse ne eksik?', 'Karşılıklı yanıt', 'Uyak düzeni', 'Atışmanın anlam bağı kopar.'],
      ['Şiirin yazılı hâli hangi bilgiyi daha az verir?', 'Ezgi ve vurgu', 'Sözcük dizisi', 'Ses icra sırasında duyulur.'],
      ['Mahlas hangi soruya cevap verir?', 'Söyleyen kim?', 'Kaç hece var?', 'Âşığın şiirde kullandığı addır.'],
      ['Dinleyici tepkisi niçin önemli olabilir?', 'Canlı icrayı etkiler', 'Mahlası belirler', 'Âşık performansı ortamla ilişkilidir.'],
      ['İki atışmayı karşılaştırırken hangi ikili gerekir?', 'Söz ve icra', 'Mahlas ve hece sayısı', 'Anlam ve söyleyiş birlikte incelenir.'],
    ],
    kontrol: ['Atışmada uyak dışında ne gerekir?', 'Önceki söze anlamlı yanıt', 'Daha çok sayıda dörtlük', 'Karşılıklı söyleyiş anlamla kurulur.'], kontrolKarti: 7,
  },
  'trk11-muze': {
    kartlar: [
      ['Bilgi ve izlenim', '“Eser 13. yüzyıldan” bilgi; “işçiliği beni etkiledi” izlenimdir.\nİkisini ayrı yazmak metni açık kılar.'],
      ['Seçerek anlat', 'Bütün vitrinleri saymak yerine birkaç eseri gerekçeyle seç.\nSeçim yazının odağını kurar.'],
      ['Sanal gezinin sınırı', 'Ekran malzemenin dokusunu ve gerçek boyutu tam göstermeyebilir.\nGörmediğini gördüm diye yazma.'],
      ['Karşılaştırma', 'Aynı işlevli iki eserin dönem ve yapım farkını incele.\n“Eski” ve “yeni” tek başına yorum değildir.'],
    ],
    iddialar: [
      ['“Taş eser” gözlem; “bana dayanıklılığı düşündürdü” kişisel yorumdur.', true, 'Bilgi ile izlenim ayrılabilir.'],
      ['Çevrim içi gezide görüntülenmeyen arka yüz hakkında kesin ayrıntı yazılabilir.', false, 'Görülmeyen özellik tahminle kesinleşmez.'],
    ],
    secimler: [
      ['İzlenim yazısında iki eser seçmenin yararı?', 'Gerekçeli karşılaştırma', 'Her eseri aynı ayrıntıyla sıralama', 'Seçim odak ve derinlik sağlar.'],
      ['“Eser bronz” ile “beni şaşırttı” nasıl ayrılır?', 'Bilgi ve yorum', 'Tanım ve karşılaştırma', 'Biri özellik, diğeri kişisel etkidir.'],
      ['Sanal gezide eserin boyu belirsizse ne yapılır?', 'Kaynağa bakılır', 'Ekrandan ölçülür', 'Doğrulanmış ölçü gerekir.'],
      ['Müzenin açıklaması ile yazarın düşüncesi nasıl verilir?', 'Kaynak açık belirtilir', 'Tümü tırnak içinde verilir', 'Bilgi ve yorumun sahibi ayrılmalı.'],
      ['İki döneme ait nesneyi kıyaslamada hangi ölçüt yararlı?', 'Yapım ve kullanım', 'Vitrindeki yerleri', 'İşlev ve teknik farkı anlam kurar.'],
    ],
    kontrol: ['“Beni etkiledi” hangi tür ifade?', 'Kişisel izlenim', 'Kaynak künyesi', 'Yazarın deneyimini anlatır.'], kontrolKarti: 7,
  },
  'trk11-roman': {
    kartlar: [
      ['Yaşamdan kurmacaya', 'Yazar gördüğü bir yeri dönüştürerek anlatabilir.\nGerçek yer adı bütün olayın yaşandığını kanıtlamaz.'],
      ['Bakış açısının sınırı', '“Ben” anlatıcı bir odadaki konuşmayı aktarabilir.\nBaşka odadaki düşünceyi nasıl bildiğini metin açıklamalı.'],
      ['Zaman düzeni', 'Roman olayları sırayla anlatmak zorunda değildir.\nGeri dönüş kahramanın bugünkü kararını anlamlandırabilir.'],
      ['Karakter dönüşümü', 'Başlangıç ve son kararı karşılaştır.\nDeğişim varsa hangi olayın etkilediğini metinden göster.'],
    ],
    iddialar: [
      ['Bir romanda gerçek şehir adı geçmesi olayların yaşandığını kanıtlamaz.', true, 'Kurmaca gerçek mekân kullanabilir.'],
      ['Geri dönüş, kahramanın bugünkü davranışına gerekçe sunabilir.', true, 'Geçmiş olay bugünkü çatışmayı açıklayabilir.'],
    ],
    secimler: [
      ['“Ben” anlatıcı başkasının düşüncesini kesin söylüyorsa ne sorgulanır?', 'Bilgi kaynağı', 'Yazarın biyografisi', 'Birinci kişinin bilgisi sınırlıdır.'],
      ['Gerçek kent adı romanı ne yapmaz?', 'Otomatik belge', 'Kurmaca anlatı', 'Mekân gerçek, olay kurmaca olabilir.'],
      ['Kahramanın değişimini neyle kanıtlarsın?', 'İlk ve son kararlarıyla', 'Dış görünüşündeki değişimle', 'Eylem farkı dönüşümü gösterir.'],
      ['Geri dönüş hangi işlevi görebilir?', 'Bugünkü çatışmayı açıklama', 'Kronolojik sırayı koruma', 'Geçmiş bugünün nedenini açar.'],
      ['Yazarın hayatıyla roman arasında bağ kurarken?', 'Metin ve biyografiyi karşılaştırmak', 'Anlatıcıyı doğrudan yazar saymak', 'Benzerlik kanıtla kurulmalıdır.'],
    ],
    kontrol: ['Gerçek şehirli roman otomatik gerçek olay mı?', 'Hayır, kurmaca olabilir', 'Evet, belge olur', 'Mekân adı olayın yaşandığını kanıtlamaz.'], kontrolKarti: 7,
  },
  'trk11-biyografi': {
    kartlar: [
      ['Bilgi ve övgü', 'Tezkirede sanatçıya yönelik değerlendirme bulunabilir.\nÖvgü ile doğrulanabilir yaşam bilgisini ayır.'],
      ['Kaynak çelişkisi', 'İki belge farklı doğum yılı verirse birini rastgele seçme.\nKaynağın zamanı ve güvenilirliği incelenir.'],
      ['Olay seçimi', 'Biyografi her günü anlatmaz; kişiyi ve eserini açıklayan dönüm noktalarını seçer.\nSeçimin amacı önemlidir.'],
      ['Yaşam-eser sınırı', 'Sanatçının yaşadığı kayıp eserde benzer tema yaratmış olabilir.\nTek benzerlik nedensellik kanıtı değildir.'],
    ],
    iddialar: [
      ['Tezkiredeki övgü ifadesi, doğrulanabilir tarihî bilgiyle aynı tür kanıt değildir.', true, 'Değerlendirme ve olgu ayrılmalıdır.'],
      ['İki kaynak çeliştiğinde yayımlandıkları dönem ve dayanakları karşılaştırılmalıdır.', true, 'Kaynak eleştirisi gerekir.'],
    ],
    secimler: [
      ['İki belge farklı tarih veriyorsa ilk adım?', 'Kaynakları sınamak', 'Daha yeni kaynağı seçmek', 'Dayanak ve dönem karşılaştırılır.'],
      ['Tezkirede “eşsiz şair” sözü ne tür ifade?', 'Değerlendirme', 'Yaşam bilgisi', 'Yargı doğrulanabilir tarih değildir.'],
      ['Biyografi neden her günü anlatmaz?', 'Anlamlı dönüm noktalarını seçer', 'Kronolojiyi bozmak ister', 'Seçim kişiyi açıklamaya hizmet eder.'],
      ['Şairin yaşamıyla eseri benzerse hangi yorum temkinli?', 'İlişki olabilir, kanıt aranır', 'Eser yaşamın kopyasıdır', 'Benzerlik tek başına nedensellik değildir.'],
      ['Tezkire ve modern biyografi hangi açıdan karşılaştırılır?', 'Kaynak ve üslup', 'Ölçü ve uyak düzeni', 'Türlerin dönem ve anlatımı farklıdır.'],
    ],
    kontrol: ['“Eşsiz şair” sözü nasıl okunur?', 'Yazarın değerlendirmesi', 'Doğrulanmış yaşam bilgisi', 'Övgü yorumsal ifadedir.'], kontrolKarti: 7,
  },
  'trk11-radyo': {
    kartlar: [
      ['Sesle mekân kurma', 'Uzaktan gelen tren sesi istasyon izlenimi verebilir.\nMetin sahneyi söylemeden ses düşündürür.'],
      ['Aynı söz, iki ton', '“Geldin demek” sevinçle ya da kırgınlıkla söylenebilir.\nTon karakter ilişkisini değiştirir.'],
      ['Görünmeyeni çıkarma', 'Dinleyici ayak sesinden yaklaşmayı çıkarır.\nAncak çıkarımını işitsel ipucuna dayandırmalı.'],
      ['Öyküye dönüştürme', 'Radyo oyunundaki ses işaretini anlatıcının gözlemiyle kur.\nÇatışmayı ve kişilerin niyetini koru.'],
    ],
    iddialar: [
      ['Tren sesi, yer adı söylenmese de mekân hakkında ipucu verebilir.', true, 'Ses sahneyi düşündürür.'],
      ['“Ne güzel!” repliği alaycı bir tonla söylendiğinde de yalnızca beğeni anlamı taşır.', false, 'Tonlama sözü tersine çevirebilir; alay beğeninin tersini iletir.'],
    ],
    secimler: [
      ['Uzaktan tren sesi duyuluyorsa hangi çıkarım temkinli?', 'Bir ulaşım mekânı yakın olabilir', 'Kişiler kesin vagondadır', 'Ses konum ipucu verir, kesin yer değil.'],
      ['“Geldin demek” cümlesi niçin iki anlam verebilir?', 'Tonlama ve bağlam', 'Ses efektinin türü', 'Ses niyeti taşır.'],
      ['Radyo oyunu öyküye çevrilirken ses ipucu nasıl taşınır?', 'Betimleme veya olayla', 'Dipnotla açıklanarak', 'İpucunun işlevi korunmalı.'],
      ['Kimin yaklaştığını ayak sesinden çıkarırken ne gerekir?', 'Ek işitsel bağlam', 'Adımların sayısı', 'Kimlik tek sesle kesinleşmeyebilir.'],
      ['Diyalog ile efekt arasındaki ilişki?', 'Birbirini tamamlayabilir', 'Efekt diyaloğun yerini alır', 'Söz ve ses farklı ipuçları verir.'],
    ],
    kontrol: ['Aynı replikte anlamı ne değiştirebilir?', 'Tonlama', 'Repliğin uzunluğu', 'Ses niyeti duyurur.'], kontrolKarti: 8,
  },
  'trk11-mulakat': {
    kartlar: [
      ['Açık soru örneği', '“Köyden ayrılırken neyi kaybetmekten korktun?” kişiyi konuşturur.\n“Üzüldün mü?” yanıtı daraltır.'],
      ['Metnin sınırı', 'Kişi romanın sonunu henüz bilmiyorsa son olayı ona sordurma.\nGörüşmeyi olay zamanı içinde kur.'],
      ['Yanıtta iz', 'Kişinin yanıtı önceki söz veya eylemiyle uyumlu olmalı.\nÇelişki varsa nedenini göster.'],
      ['Takip sorusu', 'Yanıt yeni bir neden açıyorsa sonraki soru bunu izler.\nHazır listeyi mekanik okumak görüşmeyi zayıflatır.'],
    ],
    iddialar: [
      ['Roman kişisi olayın ortasında görüşülüyorsa sonraki bölümü biliyormuş gibi konuşturulamaz.', true, 'Kurulan zaman bilgiyi sınırlar.'],
      ['Roman kişisine kararının nedenini soran açık uçlu soru, evet/hayır ile yanıtlanan sorudan daha az bilgi açar.', false, 'Neden sorusu gerekçeyi konuşturur; evet/hayır sorusu sınırlı kalır.'],
    ],
    secimler: [
      ['Kişinin karar gerekçesini açan soru hangisi?', 'Neyi kaybetmekten korktun?', 'Evet mi, hayır mı?', 'Açık soru nedenleri konuşturur.'],
      ['Olayın ortasındaki kişiye ne sorulmaz?', 'Henüz yaşamadığı son', 'O ana kadarki karar', 'Bilgi olay zamanıyla sınırlıdır.'],
      ['Bir yanıt önceki sözle çelişiyorsa ne yapılır?', 'Nedeni açıklanır', 'Önceki söz silinir', 'Karakterin sesi tutarlı kurulmalı.'],
      ['Takip sorusu neye bağlanır?', 'Önceki yanıta', 'Romanın bölüm sırasına', 'Görüşme düşünceyi ilerletir.'],
      ['Hayalî mülakatı inandırıcı kılan?', 'Metindeki eylem ve dil', 'Bugünün konuşma diliyle yanıt', 'Karakter kendi bağlamında kalır.'],
    ],
    kontrol: ['Olayın ortasındaki kişi hangi bilgiyi taşımaz?', 'Sonraki bölümü', 'O ana kadarki olayları', 'Görüşme zamanı bilgi sınırını belirler.'], kontrolKarti: 8,
  },
  'trk11-tiyatro': {
    kartlar: [
      ['Yönergeyi sınama', '“Bir adım geri çekilir” sözü korku veya kuşku düşündürebilir.\nAnlamını replik bağlamı belirler.'],
      ['Çatışmanın kaynağı', 'İki kişi aynı nesneyi istiyorsa amaçları çakışır.\nReplikler bu çatışmayı görünür kılar.'],
      ['Sahnede zaman', 'Işık ve dekor değişimi zaman geçişini gösterebilir.\nMetindeki yer ve zaman bilgisini izle.'],
      ['Canlandırma kararı', 'Aynı cümle farklı duraklamayla başka etki bırakır.\nYorum metnin çatışmasına uygun olmalı.'],
    ],
    iddialar: [
      ['Sahne yönergesindeki hareket, kişinin repliğini yorumlamaya yardım edebilir.', true, 'Beden dili sözün anlamını tamamlar.'],
      ['İki kişi aynı şeyi isteyip ona nasıl ulaşılacağında anlaşamıyorsa aralarında çatışma doğmaz.', false, 'Yöntem ayrılığı da karşıtlık ve dramatik gerilim yaratır.'],
    ],
    secimler: [
      ['“Bir adım geri çekilir” ifadesi nasıl yorumlanmalı?', 'Replik bağlamıyla', 'Korkunun kesin işareti olarak', 'Aynı hareket farklı niyet taşıyabilir.'],
      ['Aynı nesneyi isteyen iki kişi ne yaratır?', 'Amaç çatışması', 'Perde değişimi', 'Zıt istekler dramatik hareket kurar.'],
      ['Sahnede ışık değişirse hangi işleve bakılır?', 'Zaman veya mekân geçişine', 'Kişinin repliğine', 'Işık sahne bilgisini taşıyabilir.'],
      ['Oyuncu duraklamayı niçin seçer?', 'Sözün etkisini kurmak için', 'Sahne değiştirmek için', 'Ritim ve duygu yorumlanır.'],
      ['Yönerge ve replik arasındaki ilişki?', 'Hareket sözü tamamlar', 'Yönerge seyirciye okunur', 'Yönerge söylenmez, oynanır.'],
    ],
    kontrol: ['“Kapıyı kapatır” ne tür metin parçası?', 'Sahne yönergesi', 'Sözlü replik', 'Hareket oyuncuya yöneliktir.'], kontrolKarti: 7,
  },
  'trk11-kucurek': {
    kartlar: [
      ['Eksiltilen olay', 'Metin “kapı yine açık kaldı” diyorsa geçmişte de kapandığını ima edebilir.\nİpucu vardır, ayrıntı verilmez.'],
      ['Son cümlenin yükü', 'Küçük bir son söz önceki sahneyi yeniden düşündürebilir.\nDönüşüm için açık açıklama gerekmez.'],
      ['Başlığın geri dönüşü', 'Okumadan önce sıradan görünen başlık sonda yeni anlam kazanabilir.\nBaşlığı iki kez oku.'],
      ['Yorumun sınırı', 'Metnin söylemediği her ayrıntı serbestçe eklenemez.\nÇıkarım ipucu ve bağlamla savunulmalı.'],
    ],
    iddialar: [
      ['“Yine” sözcüğü kısa bir metinde önceki yaşantıya ilişkin ipucu verebilir.', true, 'Tek sözcük geçmiş olayı düşündürür.'],
      ['Küçürek hikâyede son cümle önceki cümlelerin anlamını değiştiremez.', false, 'Kısa metinde son vurgu çok etkilidir.'],
    ],
    secimler: [
      ['“Yine bekledi” sözünden hangi çıkarım dayanaklı?', 'Daha önce de bekledi', 'Tam üç saat bekledi', '“Yine” tekrarı verir, süreyi vermez.'],
      ['Son cümle önceki olayı başka gözle gösteriyorsa ne yapılır?', 'Metin yeniden okunur', 'Son cümle yok sayılır', 'Yeni anlam eski ipuçlarıyla sınanır.'],
      ['Başlık metinden sonra farklı anlaşılıyorsa?', 'Çok anlamlı işlev taşıyabilir', 'Metinle ilgisizdir', 'Metin başlığa yeni bağlam verir.'],
      ['Metinde adı geçmeyen kişiyi yorumlarken ne gerekir?', 'İpucu ve bağlam', 'Okurun kendi deneyimi', 'Kanıtsız ayrıntı eklenmez.'],
      ['Kısalık ile yoğunluk arasındaki ilişki?', 'Az söz çok çıkarım açar', 'Kısa metin tek anlam taşır', 'Kurmaca anlam ve boşluk kurulur.'],
    ],
    kontrol: ['“Yine” sözcüğü hangi çıkarıma izin verir?', 'Tekrara', 'Kesin süreye', 'Önceki benzer olayı düşündürür.'], kontrolKarti: 7,
  },
  'trk11-belgesel': {
    kartlar: [
      ['Görüntü seçimi', 'Belgesel gerçek görüntü kullansa da hangi sahnenin seçildiği bakış açısı oluşturur.\nKurguya dikkat et.'],
      ['Grafik ve bağlam', 'Grafiğin yılı, birimi ve kaynağı yoksa çarpıcı sayı yanıltabilir.\nAfişe geçmeden doğrula.'],
      ['Afişte ayıklama', 'Belgeselin bütün ayrıntısını afişe sığdırma.\nAna düşünceyi koruyan bir görsel ve kısa çağrı seç.'],
      ['Görsel etik', 'Başka bağlamdaki fotoğrafı yeni olaya kanıt diye kullanma.\nKaynağı ve tarihi belirt.'],
    ],
    iddialar: [
      ['Belgeselde gerçek görüntü kullanılması, görüntü seçiminin bakış açısı taşımadığı anlamına gelmez.', true, 'Kurgu ve seçim yorum oluşturur.'],
      ['Yılı ve birimi bilinmeyen grafik afişte kesin kanıt olarak kullanılabilir.', false, 'Verinin bağlamı doğrulanmalıdır.'],
    ],
    secimler: [
      ['Belgeselde bir olayın yalnız bir yüzü gösteriliyorsa ne sorgulanır?', 'Görüntü seçimi', 'Görüntü çözünürlüğü', 'Seçim bakış açısını etkiler.'],
      ['Grafik afişe alınmadan önce ne kontrol edilir?', 'Yıl, birim ve kaynak', 'Renk ve yazı boyutu', 'Bağlam olmadan sayı yanıltır.'],
      ['Afişte uzun anlatım yerine ne korunur?', 'Ana mesaj', 'Bütün ayrıntılar', 'Afiş kısa ve odaklı olmalıdır.'],
      ['Başka olayın fotoğrafı yeni iddiaya eklenirse sorun nedir?', 'Bağlam çarpıtılır', 'Afiş fazla kalabalıklaşır', 'Fotoğraf yanlış kanıt olur.'],
      ['Belgesel ile afiş arasındaki dönüşümde ne değişir?', 'Anlatım biçimi', 'Doğrulanmış ana düşünce', 'Tür değişir, temel bilgi korunur.'],
    ],
    kontrol: ['Kaynağı bilinmeyen grafik afişe neden alınmaz?', 'Yanıltma riski', 'Afişte yer kaplaması', 'Yıl ve birim olmadan sayı yorumlanamaz.'], kontrolKarti: 8,
  },
}
