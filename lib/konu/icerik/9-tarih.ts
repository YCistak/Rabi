import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 9. sınıf Tarih — Maarif Modeli.
 *
 * Üç tema: Geçmişin İnşa Sürecinde Tarih, Eski Çağ Medeniyetleri, Orta Çağ
 * Medeniyetleri. Konu adları ve sırası `maarif/iskelet.json`'dan;
 * `maarif.test.ts` denetliyor.
 *
 * Program konuları **medeniyet ekseninde** kuruyor: eski programdaki
 * "Mezopotamya", "Anadolu Medeniyetleri" gibi coğrafya başlıkları yok;
 * yerine yönetim, hukuk, inanç gibi karşılaştırmalı başlıklar var.
 */
export const tarih9 = program('tarih', 9, 'Tarihin doğasından Orta Çağ’a', [
  tema('trh9-t1', 'Geçmişin İnşa Sürecinde Tarih', [
    konu('trh9-fayda', 'Tarih Öğrenmenin Faydaları', [
      kart(
        'Neden tarih?',
        'Bugünkü kurumların, sınırların ve sorunların nereden geldiğini anlatır. Bugünü açıklayan şey çoğu zaman dündür.',
      ),
      kart(
        'Kimlik ve aidiyet',
        'Ortak geçmiş bilgisi bir toplumu birbirine bağlar; kendini tanımanın bir yolu da geçmişini bilmektir.',
      ),
      kart(
        'Eleştirel düşünme',
        'Tarih, kaynak sorgulamayı öğretir: kim söylemiş, neden söylemiş, neyi atlamış?',
      ),
      kart(
        'Empati kurmak',
        'Geçmişteki insanı kendi çağının koşullarıyla anlamak; bugünün ölçüleriyle yargılamak tarih değil, ahlak dersi olur.',
      ),
      kart(
        'Tekrarlamaz ama benzer',
        'Tarih birebir tekrarlanmaz; benzer koşullar benzer sonuçlar üretir. Ders alınan şey kalıp değil örüntüdür.',
      ),
      kart(
        'Kötüye kullanımı',
        'Geçmiş, bugünün siyasi iddiasını haklı çıkarmak için seçilerek anlatılabilir. Tarih bilgisi bunun panzehiridir.',
      ),
    ], [
      soru('Tarih, geçmişteki olayların birebir tekrar edeceğini gösterir.', false, 'Olaylar aynen tekrarlanmaz; benzer koşullar benzer sonuçlar üretebilir.'),
      soru('Tarih bilgisi, kişinin ait olduğu topluluğu tanımasına katkı sağlar.', true, 'Ortak geçmiş, kimlik ve aidiyet duygusunun kaynaklarından biri.'),
      soru('Tarihî empati, geçmişteki insanları kendi dönemlerinin koşulları içinde anlamaktır.', true, 'Bugünün ölçüleriyle yargılamak, olayı anlamayı engelliyor.'),
      soru('Tarih hiçbir zaman siyasi amaçlarla kullanılmaz.', false, 'Seçilmiş olaylarla kurulan anlatılar tarihin kötüye kullanımına örnek.'),
      sikli('"Kim söylemiş, neden söylemiş, neyi atlamış?" sorusu neyi öğretir?', ['Eleştirel düşünme', 'Kimlik'], 0, 'Kaynak sorgulama.'),
      sikli('Geçmişin bugünkü siyasi iddia için seçilerek anlatılmasına karşı panzehir?', ['Tarih bilgisi', 'Takvim'], 0, 'Kötüye kullanımı fark ettirir.'),
      soru('Tarih birebir tekrarlanır.', false, 'Benzer koşullar benzer sonuç; kalıp değil örüntü.'),
    ], [
      {
        soru: 'Geçmişteki insanı kendi çağının koşullarıyla anlamaya ne denir?',
        siklar: ['Empati', 'Nesnellik'],
        dogru: 0,
        aciklama: {
          dogru: 'Bugünün ölçüleriyle yargılamak tarih değil ahlak dersi olur.',
          yanlis: 'Nesnellik kaynağa sadakat ve yöntem disiplini. Geçmişin insanını kendi koşullarında anlamak empati.',
        },
        kart: 4,
      },
    ]),
    konu('trh9-doga', 'Tarihin Doğası', [
      kart(
        'Tarih nedir?',
        'Geçmişteki insan topluluklarını, yer ve zaman göstererek, sebep-sonuç ilişkisi içinde inceleyen bilim.',
      ),
      kart(
        'Neden deney yapılamaz?',
        'Olaylar tek seferliktir ve geri döndürülemez. Bu yüzden tarih deneye değil kaynağa dayanır.',
      ),
      kart(
        'Nesnellik sorunu',
        'Tarihçi kendi çağının insanıdır. Nesnellik, önyargısızlık iddiası değil, kaynağa sadakat ve yöntem disiplinidir.',
      ),
      kart(
        'Yer ve zaman şart',
        'Yeri ve zamanı belirsiz bir anlatı tarih değildir. İkisi tarihsel bilginin çerçevesidir.',
      ),
      kart(
        'Çağlara ayırma',
        'Çağ sınırları tarihçilerin kolaylık için koyduğu ölçülerdir; insanlar 476’da "Orta Çağ başladı" diye uyanmadı.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'İlk Çağ', alt: 'yazı → 375' },
            { ad: 'Orta Çağ', alt: '375 → 1453' },
            { ad: 'Yeni Çağ', alt: '1453 → 1789' },
            { ad: 'Yakın Çağ', alt: '1789 →' },
          ],
        },
      ),
      kart(
        'Tarih öncesi ve tarihî çağlar',
        'Ayıran şey yazının bulunmasıdır. Yazıdan öncesi kalıntılarla, sonrası belgelerle incelenir.',
      ),
      kart(
        'Takvimler',
        'Toplumlar kendi başlangıç noktalarını seçti: Hicrî takvim ay yılına, Miladî takvim güneş yılına dayanır.',
      ),
      kart(
        'Hicrî ve Miladî çevirme',
        'Hicrî yıl 354 gün (ay yılı), Miladî yıl 365 gün. Hicret 622\'de; Miladî = Hicrî − Hicrî/33 + 622 kabaca çevirir.',
      ),
    ], [
      soru('Tarihî olaylar laboratuvarda deney yapılarak sınanabilir.', false, 'Olay bir kez yaşandı ve tekrarlanamıyor; tarihçi kaynaklara dayanmak zorunda.'),
      soru('Tarihî bir olay incelenirken yer ve zaman belirtilmek zorundadır.', true, 'Yeri ve zamanı olmayan bir anlatı tarih değil.'),
      soru('Yazının bulunuşu, tarih öncesi çağların sonu kabul edilir.', true, 'Yazılı kaynakla birlikte tarihî çağlar başlıyor.'),
      soru('Tarihçi kaynakları seçerken kendi bakış açısından hiç etkilenmez.', false, 'Nesnellik hedeftir ama hangi kaynağın öne çıkacağı bir seçim.'),
      sikli('Tarih neden deney yapamaz?', ['Olaylar tek seferlik', 'Belge yoktur'], 0, 'Geri döndürülemez; kaynağa dayanır.'),
      sikli('Hicrî takvim neye dayanır?', ['Ay yılına', 'Güneş yılına'], 0, 'Miladî güneş yılı.'),
      sikli('Hicret hangi yıldır?', ['622', '1453'], 0, 'Hicrî takvimin başlangıcı.'),
      sikli('Tarihçinin nesnelliği ne demektir?', ['Kaynağa sadakat ve yöntem', 'Hiç önyargısı olmaması'], 0, 'Tarihçi kendi çağının insanı.'),
      soru('İnsanlar 476\'da Orta Çağ\'ın başladığını hemen fark etti.', false, 'Çağ sınırı tarihçilerin kolaylık için koyduğu ölçü.'),
    ], [
      {
        soru: 'Tarih öncesi ile tarihî çağları ayıran nedir?',
        siklar: ['Ateşin bulunması', 'Yazının bulunması'],
        dogru: 1,
        aciklama: {
          dogru: 'Yazıdan öncesi kalıntıyla, sonrası belgeyle incelenir.',
          yanlis: 'Ateş tarih öncesinin kendi içinde bir dönüm noktası. Çağları ayıran ölçüt yazının bulunması.',
        },
        kart: 6,
      },
    ]),
    konu('trh9-uretim', 'Tarihsel Bilginin Üretim Süreci', [
      kart(
        'Kaynak türleri',
        'Birinci elden kaynak olayın çağından gelir (belge, kalıntı); ikinci elden kaynak onu yorumlar.',
      ),
      kart(
        'Yazılı ve yazısız',
        'Yazılı kaynak belge, kitabe ve ferman; yazısız kaynak kalıntı, sikke, mimari ve mezar buluntusudur.',
      ),
      kart(
        'Kaynak eleştirisi',
        'Dış eleştiri belgenin gerçek olup olmadığını, iç eleştiri içeriğinin güvenilirliğini sorgular.',
      ),
      kart(
        'Yardımcı bilimler',
        'Tarihin tek başına okuyamadığı kaynakları bu bilimler çözer.',
        {
          tur: 'tablo',
          basliklar: ['Bilim', 'Neyi inceler?'],
          satirlar: [
            ['Arkeoloji', 'Kalıntı'],
            ['Paleografya', 'Eski yazı'],
            ['Nümizmatik', 'Para'],
            ['Epigrafya', 'Kitabe'],
            ['Kronoloji', 'Zaman'],
          ],
        },
      ),
      kart(
        'Adımlar',
        'Kaynak tarama, tasnif, tahlil, tenkit ve terkip. Son adımda parçalar bütünlüklü bir anlatıya dönüşür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tarama', alt: 'kaynak toplanır' },
            { ad: 'Tasnif', alt: 'sınıflanır' },
            { ad: 'Tahlil', alt: 'çözümlenir' },
            { ad: 'Tenkit', alt: 'eleştirilir' },
            { ad: 'Terkip', alt: 'birleştirilir' },
          ],
        },
      ),
      kart(
        'Tarih yazımı değişir',
        'Yeni belge bulunduğunda ya da yeni sorular sorulduğunda aynı dönem yeniden yazılır.',
      ),
      kart(
        'Örnekle',
        'Bir Osmanlı fermanı birinci elden kaynak; onu inceleyen bir tarih kitabı ikinci elden. Belgenin mührü dış eleştiri, içindeki iddia iç eleştiri konusu.',
      ),
    ], [
      soru('Olayın yaşandığı dönemden kalan belgelere birinci elden kaynak denir.', true, 'Sonradan yazılanlar ikinci elden kaynak sayılıyor.'),
      soru('Kaynak eleştirisi, belgenin gerçekliğini ve güvenilirliğini sorgular.', true, 'Belge sahte olabilir ya da yazan taraflı olabilir.'),
      soru('Sikkeleri inceleyen yardımcı bilim paleografyadır.', false, 'Sikkeleri nümizmatik inceler; paleografya eski yazıların bilimi.'),
      soru('Bir olay hakkındaki tarih yazımı, yeni belgeler bulunsa da değişmez.', false, 'Yeni kaynak, kurulmuş anlatıyı değiştirebiliyor.'),
      sikli('Bir Osmanlı fermanı hangi kaynak türüdür?', ['İkinci elden', 'Birinci elden'], 1, 'Onu inceleyen kitap ikinci elden.'),
      sikli('Sikke ve mezar buluntusu hangi kaynak türüdür?', ['Yazılı', 'Yazısız'], 1, 'Kitabe yazılı.'),
      sikli('Tarihsel bilgi üretiminin son adımı?', ['Tasnif', 'Terkip'], 1, 'Parçalar bütün anlatıya dönüşür.'),
      soru('Aynı dönem yeni belge bulununca yeniden yazılabilir.', true, 'Tarih yazımı değişir.'),
    ], [
      {
        soru: 'Belgenin sahte olup olmadığını sorgulamak hangi eleştiridir?',
        siklar: ['İç eleştiri', 'Dış eleştiri'],
        dogru: 1,
        aciklama: {
          dogru: 'Dış eleştiri belgenin kendisine (kâğıt, mühür, yazı) bakar.',
          yanlis: 'İç eleştiri içeriğin güvenilirliğini sorgular. Belgenin gerçekliği dış eleştirinin konusu.',
        },
        kart: 3,
      },
    ]),
    konu('trh9-dijital', 'Tarih Araştırma ve Yazımında Dijitalleşme', [
      kart(
        'Arşivler açıldı',
        'Devlet arşivleri belgeleri sayısallaştırdı; eskiden yıllar alan tarama artık uzaktan yapılabiliyor.',
      ),
      kart(
        'Yeni yöntemler',
        'Coğrafi bilgi sistemleriyle haritalama, büyük veriyle nüfus ve ticaret analizi tarihçinin araç setine girdi.',
      ),
      kart(
        'Dijital sergiler',
        'Müze koleksiyonları ve harabeler üç boyutlu taranıyor; ulaşılamayan bir yapı ekranda gezilebiliyor.',
      ),
      kart(
        'Doğrulama sorunu',
        'İnternetteki her metin kaynak değildir. Dijital ortamda kaynak eleştirisi daha da gerekli hâle geldi.',
      ),
      kart(
        'Yapay zekâ ve tarih',
        'Eski el yazmalarını okumada yardımcı oluyor; ama ürettiği metin doğrulanmadan tarihsel bilgi sayılamaz.',
      ),
      kart(
        'Dijital kaybolma',
        'Kâğıt yüzyıllar dayanır; dosya biçimleri ve diskler onlarca yılda okunamaz hâle gelebilir.',
      ),
    ], [
      soru('Dijitalleşme, arşiv belgelerine uzaktan erişimi kolaylaştırmıştır.', true, 'Başka ülkedeki bir arşiv artık ekrandan taranabiliyor.'),
      soru('İnternette bulunan her tarihî görsel ve belge doğrudur.', false, 'Kaynağı belirsiz ya da üretilmiş içerikler de dolaşımda; doğrulama şart.'),
      soru('Dijital ortamdaki veriler hiçbir zaman kaybolmaz.', false, 'Kapanan siteler ve eskiyen dosya biçimleri yüzünden dijital kayıp gerçek bir sorun.'),
      soru('Dijital sergiler, müzeye gidemeyenlerin esere ulaşmasını sağlar.', true, 'Erişimi genişletiyor ama eserin kendisinin yerini tutmuyor.'),
      sikli('Kâğıt ile dijital dosyayı kalıcılıkta ayıran nedir?', ['Dosya biçimleri okunamaz hâle gelebilir', 'Kâğıt çabuk çürür'], 0, 'Kâğıt yüzyıllar dayanır.'),
      sikli('Coğrafi bilgi sistemleri tarihçiye ne verir?', ['Haritalama', 'Doğrulama'], 0, 'Ticaret ve nüfus analizi de büyük veriyle.'),
      soru('İnternetteki her metin tarihsel kaynak sayılır.', false, 'Kaynak eleştirisi dijitalde daha gerekli.'),
    ], [
      {
        soru: 'Yapay zekânın ürettiği bir metin ne zaman tarihsel bilgi sayılır?',
        siklar: ['Kaynakla doğrulandığında', 'Yeterince ayrıntılıysa'],
        dogru: 0,
        aciklama: {
          dogru: 'Dijital ortam kaynak eleştirisini kaldırmıyor, daha da gerekli kılıyor.',
          yanlis: 'Ayrıntı doğruluğun ölçüsü değil. Üretilen metin kaynağa dayanıp doğrulanmadan tarihsel bilgi olmaz.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('trh9-t2', 'Eski Çağ Medeniyetleri', [
    konu('trh9-tarim', 'Tarım Devrimi’nin Yerleşmeye ve Ekonomiye Etkisi', [
      kart(
        'Tarım devrimi',
        'Yaklaşık 12 bin yıl önce insanlar bitkiyi ve hayvanı evcilleştirdi. Toplayıcılıktan üretime geçildi.',
      ),
      kart(
        'Zincirleme sonuç',
        'Tek bir değişiklik, birbirini doğuran bir dizi sonuç üretti; şehir ve devlet bu zincirin sonunda duruyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Tarım' },
            { ad: 'Yerleşik hayat' },
            { ad: 'Artı ürün' },
            { ad: 'İş bölümü' },
            { ad: 'Şehir ve devlet' },
          ],
        },
      ),
      kart(
        'Yerleşik hayat',
        'Tarla bakım istediği için insan yerleşti. Köyler, sonra şehirler bu zorunluluktan doğdu.',
      ),
      kart(
        'Artı ürün',
        'İhtiyaçtan fazla üretim; tarımla uğraşmayan zanaatkâr, asker ve rahip sınıfını mümkün kıldı.',
      ),
      kart(
        'Mülkiyet ve sınıf',
        'Toprak ve depolanan ürün "kimin" sorusunu doğurdu; toplumsal eşitsizlik ve hukuk aynı kökten çıktı.',
      ),
      kart(
        'Yazının doğuşu',
        'Artı ürünün kaydını tutma ihtiyacı yazıyı doğurdu. İlk tabletler edebiyat değil, muhasebe kaydıdır.',
      ),
      kart(
        'Anadolu’dan izler',
        'Göbeklitepe ve Çatalhöyük, bu geçiş döneminin dünyaca önemli merkezleridir.',
      ),
    ], [
      soru(
        'Şemaya göre yazı, artı ürün ortaya çıkmadan önce bulunmuştur.',
        false,
        'Sıra tersine: artı ürün kayıt tutmayı gerektirdi ve yazı bu ihtiyaçtan doğdu.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Tarım' },
            { ad: 'Yerleşik hayat' },
            { ad: 'Artı ürün' },
            { ad: 'Yazı' },
          ],
        },
      ),
      soru('Tarım devrimiyle insanlar avcı-toplayıcı yaşamdan yerleşik yaşama geçti.', true, 'Ekilen toprağın başında kalmak gerekiyordu.'),
      soru('Artı ürün, ticaretin ve meslek çeşitliliğinin ortaya çıkmasını sağladı.', true, 'Herkesin besin üretmesi gerekmeyince başka işler doğdu.'),
      soru('Tarıma geçişle birlikte özel mülkiyet kavramı ortadan kalktı.', false, 'Toprak ve ürün üzerindeki mülkiyet tam da bu dönemde doğdu.'),
      sikli('İhtiyaçtan fazla üretime ne denir?', ['Mülkiyet', 'Artı ürün'], 1, 'Zanaatkâr, asker ve rahip sınıfını mümkün kıldı.'),
      sikli('Toplumsal eşitsizlik hangi kökten çıktı?', ['Yazı', 'Mülkiyet'], 1, '"Kimin" sorusu.'),
      sikli('Göbeklitepe ve Çatalhöyük neyin merkezidir?', ['Roma dönemi', 'Tarıma geçiş dönemi'], 1, 'Anadolu\'dan izler.'),
      soru('Tarım devrimi yaklaşık 12 bin yıl önce başladı.', true, 'Bitki ve hayvan evcilleştirildi.'),
    ], [
      {
        soru: 'Yazının doğmasına yol açan ihtiyaç neydi?',
        siklar: ['Artı ürünün kaydını tutmak', 'Destan yazmak'],
        dogru: 0,
        aciklama: {
          dogru: 'İlk tabletler muhasebe kaydı; edebiyat çok sonra geldi.',
          yanlis: 'Destanlar sözlüydü. Yazıyı doğuran şey depolanan ürünün ve vergilerin kaydını tutma ihtiyacı.',
        },
        kart: 6,
      },
    ]),
    konu('trh9-yonetim', 'Eski Çağ Medeniyetlerinde Yönetim ve Ordu', [
      kart(
        'Yönetim biçimleri',
        'Site devletleri, krallıklar ve imparatorluklar. Toprak büyüdükçe yönetim de merkezîleşti.',
      ),
      kart(
        'Teokratik yönetim',
        'Mısır’da firavun tanrı-kral sayılırdı. Din ile devletin ayrılmadığı bu yapı yaygındı.',
      ),
      kart(
        'Ordu ve teknoloji',
        'Tunç ve demir silahlar, savaş arabası ve at, güç dengesini belirledi. Demiri işleyen Hititler öne çıktı.',
      ),
      kart(
        'Atina ve demokrasi',
        'Atina’da yurttaşlar doğrudan karar veriyordu; ama kadınlar, köleler ve yabancılar yurttaş sayılmıyordu.',
      ),
      kart(
        'Sparta',
        'Askerî bir düzen kurulmuştu: eğitim savaşçı yetiştirmeye ayarlıydı ve yönetim dar bir gruptaydı.',
      ),
      kart(
        'Roma’nın yönetimi',
        'Krallıktan cumhuriyete, oradan imparatorluğa geçti. Senato ve konsüllük kalıcı bir yönetim geleneği bıraktı.',
      ),
      kart(
        'Ordunun beslenmesi',
        'Sürekli ordu artı ürüne bağlıdır. Vergi düzeni bozulan devletin ordusu da kısa sürede çözülürdü.',
      ),
    ], [
      soru('Teokratik yönetimde siyasi güç dinî inanışa dayandırılır.', true, 'Yönetenin yetkisi tanrısal bir kaynaktan geliyor sayılıyordu.'),
      soru('Atina daki doğrudan demokraside kadınlar ve köleler de oy kullanırdı.', false, 'Yalnızca yurttaş sayılan özgür erkekler katılabiliyordu.'),
      soru('Sparta askerî temele dayanan bir toplum ve yönetim düzeni kurmuştur.', true, 'Eğitim de yönetim de asker yetiştirmeye göre kurulmuştu.'),
      soru('Roma tarihi boyunca yalnızca cumhuriyetle yönetilmiştir.', false, 'Krallık, cumhuriyet ve imparatorluk dönemlerinden geçti.'),
      sikli('Firavunun tanrı-kral sayıldığı yönetim?', ['Demokratik', 'Teokratik'], 1, 'Din ile devlet ayrılmaz.'),
      sikli('Demiri işleyerek öne çıkan uygarlık?', ['Mısırlılar', 'Hititler'], 1, 'Savaş teknolojisi güç dengesini belirledi.'),
      sikli('Eğitimi savaşçı yetiştirmeye ayarlı şehir?', ['Atina', 'Sparta'], 1, 'Yönetim dar bir grupta.'),
      soru('Roma krallıktan cumhuriyete, sonra imparatorluğa geçti.', true, 'Senato kalıcı bir gelenek bıraktı.'),
    ], [
      {
        soru: 'Atina demokrasisinde kimler yurttaş sayılmıyordu?',
        siklar: ['Kadınlar, köleler ve yabancılar', 'Toprak sahipleri'],
        dogru: 0,
        aciklama: {
          dogru: 'Doğrudan demokrasi vardı ama katılım dar bir gruba açıktı.',
          yanlis: 'Toprak sahipleri tam da yurttaş olanlar. Dışarıda kalanlar kadınlar, köleler ve yabancılardı.',
        },
        kart: 4,
      },
    ]),
    konu('trh9-hukuk', 'Eski Çağ Medeniyetlerinde Hukuk', [
      kart(
        'Urgakina kanunları',
        'Bilinen ilk yazılı yasalar Sümerlerde çıktı; amaç güçlünün zayıfı ezmesini sınırlamaktı.',
      ),
      kart(
        'Hammurabi kanunları',
        'Babil’de sert ve kısasa dayalı yasalar. Yazılı olması, keyfî cezayı sınırlaması bakımından ileri bir adımdı.',
      ),
      kart(
        'Hitit hukuku',
        'Cezalar daha yumuşak ve tazminat ağırlıklıydı; kadınların hukuki durumu çağdaşlarına göre iyiydi.',
      ),
      kart(
        'İki ceza anlayışı',
        'Aynı çağda iki yaklaşım yan yana yaşadı ve ikisi de bugünkü hukuka iz bıraktı.',
        {
          tur: 'tablo',
          basliklar: ['Anlayış', 'Örnek'],
          satirlar: [
            ['Kısas', 'Hammurabi'],
            ['Tazminat', 'Hitit'],
          ],
        },
      ),
      kart(
        'Roma hukuku',
        'On İki Levha ile başladı; bugünkü Avrupa hukuk sistemlerinin temelinde Roma hukuku vardır.',
      ),
      kart(
        'Ortak yön',
        'Yasanın yazılı olması, hukuku hükümdarın ağzından çıkarıp herkesin bilebileceği bir ölçüye çevirdi.',
      ),
    ], [
      soru('Bilinen ilk yazılı kanunlar Mezopotamya da ortaya çıkmıştır.', true, 'Urgakina kanunları bilinen en eski örneklerden.'),
      soru('Hammurabi kanunları kısasa kısas anlayışını benimsemiştir.', true, 'Ceza, işlenen suçun aynısıyla karşılık buluyordu.'),
      soru('Hitit kanunları, Hammurabi kanunlarına göre daha ağır cezalar içerir.', false, 'Hitit hukuku daha çok tazminat esaslı, yani daha yumuşak.'),
      soru('Roma hukuku günümüz hukuk sistemlerini etkilememiştir.', false, 'Avrupa hukukunun temel kavramlarının çoğu oradan geliyor.'),
      sikli('Kısasa dayalı sert yasalar hangisinde?', ['Hammurabi', 'Hitit'], 0, 'Hitit cezaları tazminat ağırlıklı.'),
      sikli('Avrupa hukukunun temelinde hangi hukuk vardır?', ['Roma', 'Sümer'], 0, 'On İki Levha ile başladı.'),
      soru('Yazılı yasa hukuku hükümdarın ağzından çıkarıp herkesin bilebileceği ölçüye çevirdi.', true, 'Ortak yön.'),
    ], [
      {
        soru: 'Bilinen ilk yazılı yasalar hangi uygarlıkta çıktı?',
        siklar: ['Romalılar', 'Sümerler'],
        dogru: 1,
        aciklama: {
          dogru: 'Urgakina kanunları; Hammurabi ve Roma sonra geldi.',
          yanlis: 'Roma hukuku On İki Levha ile çok sonra başladı. İlk yazılı yasalar Sümerlerde Urgakina kanunları.',
        },
        kart: 1,
      },
    ]),
    konu('trh9-inanc', 'Eski Çağ’da İnançlar, Bilim ve Sanat', [
      kart(
        'Çok tanrılı inançlar',
        'Doğa olayları tanrılarla açıklanıyordu. Tapınaklar aynı zamanda ekonomik ve idari merkezlerdi.',
      ),
      kart(
        'Tek tanrılı inanışlar',
        'Musevilik bu çağda ortaya çıktı; Mısır’da Akhenaton’un girişimi kısa sürdü.',
      ),
      kart(
        'Ölümden sonra',
        'Mısır’da öbür dünya inancı mumyalamayı ve anıt mezarları doğurdu; inanç mimariyi doğrudan biçimlendirdi.',
      ),
      kart(
        'Bilim',
        'Mısırlılar geometri ve takvimde, Babilliler astronomi ve matematikte ilerledi. İhtiyaç bilimi doğurdu.',
      ),
      kart(
        'Neden geometri Mısır’da?',
        'Nil her yıl taşıp tarla sınırlarını siliyordu; arazi yeniden ölçülmek zorundaydı.',
      ),
      kart(
        'Felsefe',
        'Yunan dünyasında olaylar tanrılarla değil akılla açıklanmaya başladı; bilimsel düşüncenin kökü buradadır.',
      ),
      kart(
        'Sanat',
        'Anıtsal yapılar (piramit, zigurat, tapınak) hem inancın hem gücün gösterisiydi.',
      ),
    ], [
      soru('Mısır da geometrinin gelişmesinde Nil taşkınlarından sonra tarla sınırlarının yeniden ölçülmesi etkili olmuştur.', true, 'İhtiyaç, bilgiyi doğuran sebeplerden biri.'),
      soru('Eski Çağ da bütün toplumlar tek tanrılı inanca sahipti.', false, 'Çok tanrılı inançlar yaygındı; tek tanrılı inanışlar daha sınırlı topluluklardaydı.'),
      soru('Ölümden sonraki yaşam inancı Mısır da mumyalama geleneğine yol açmıştır.', true, 'Bedenin korunması, sonraki yaşam için gerekli görülüyordu.'),
      soru('Eski Çağ da bilim ile din birbirinden tümüyle ayrılmıştı.', false, 'Gök gözlemleri ve takvim gibi bilgiler çoğu zaman tapınakların işiydi.'),
      sikli('Mumyalamayı ve anıt mezarları doğuran inanç?', ['Çok tanrıcılık', 'Öbür dünya inancı'], 1, 'İnanç mimariyi biçimlendirdi.'),
      sikli('Olayları tanrılarla değil akılla açıklama nerede başladı?', ['Mısır\'da', 'Yunan dünyasında'], 1, 'Felsefe.'),
      sikli('Astronomi ve matematikte ilerleyen uygarlık?', ['Hititler', 'Babilliler'], 1, 'Mısırlılar geometri ve takvim.'),
      soru('Tapınaklar yalnızca ibadet yeriydi.', false, 'Ekonomik ve idari merkezlerdi.'),
    ], [
      {
        soru: 'Geometrinin Mısır\'da gelişmesinin sebebi?',
        siklar: ['Nil taşkınları tarla sınırlarını siliyordu', 'Piramit yapmak isteniyordu'],
        dogru: 0,
        aciklama: {
          dogru: 'Her yıl arazi yeniden ölçülmek zorundaydı; ihtiyaç bilimi doğurdu.',
          yanlis: 'Piramit sonuç, sebep değil. Nil her yıl sınırları silince arazi ölçme zorunluluğu geometriyi geliştirdi.',
        },
        kart: 5,
      },
    ]),
    konu('trh9-konargocer', 'Türklerde Konargöçer Yaşam', [
      kart(
        'Konargöçerlik nedir?',
        'Mevsime göre yaylak ve kışlak arasında düzenli göç. Başıboş dolaşmak değil, planlı bir yaşam biçimidir.',
      ),
      kart(
        'Neden bu yaşam?',
        'Orta Asya’nın bozkır iklimi tarıma elverişsizdi; hayvancılık otlak takibini zorunlu kılıyordu.',
      ),
      kart(
        'Toplum yapısı',
        'Örgütlenme aileden başlayıp devlete kadar iç içe halkalar hâlinde büyür.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'İl (devlet)' },
            { ad: 'Budun (millet)' },
            { ad: 'Boy' },
            { ad: 'Urug' },
            { ad: 'Oguş (aile)' },
          ],
        },
      ),
      kart(
        'Askerî güç',
        'At ve demir işçiliği; herkesin savaşçı olduğu ordu-millet yapısı hareket üstünlüğü sağlıyordu.',
      ),
      kart(
        'Kut anlayışı',
        'Yönetme yetkisinin Tanrı tarafından verildiğine inanılırdı. Kut kan yoluyla geçtiği için taht kavgaları sıktı.',
      ),
      kart(
        'Kültüre etkisi',
        'Taşınabilir sanat (at koşumu, halı, madenî eşya) gelişti; anıtsal mimari yerine sözlü kültür öne çıktı.',
      ),
      kart(
        'Yerleşiklerle ilişki',
        'Bozkır ile tarım havzası birbirini besledi: göçebe hayvan ve at, yerleşik tahıl ve kumaş verdi.',
      ),
    ], [
      soru('Konargöçer yaşamda temel geçim kaynağı hayvancılıktır.', true, 'Sürünün otlak ihtiyacı yaşam biçimini belirliyordu.'),
      soru('Konargöçerlik, yılın her mevsimini aynı yerde geçirmek demektir.', false, 'Yazlak ve kışlak arasında belirli bir düzenle gidip geliniyor; başıboş bir gezinme değil.'),
      soru('Kut anlayışına göre yönetme yetkisi Tanrı tarafından verilir.', true, 'Yetki hükümdara verilmiş sayılıyor, ailenin erkek üyelerine geçiyordu.'),
      soru('Konargöçer toplumda ordu ayrı bir meslek grubudur.', false, 'Halkın tamamı gerektiğinde asker; ordu-millet anlayışı buradan geliyor.'),
      sikli('Yönetme yetkisinin Tanrı\'dan geldiği inancı?', ['Kut', 'İkta'], 0, 'Kan yoluyla geçtiği için taht kavgaları sık.'),
      sikli('Konargöçerlerde hangi sanat gelişti?', ['Taşınabilir sanat', 'Anıtsal mimari'], 0, 'Halı, madenî eşya, at koşumu.'),
      sikli('Bozkır ile tarım havzası nasıl ilişkideydi?', ['Birbirini besledi', 'Hiç temas etmedi'], 0, 'At ve hayvan karşılığında tahıl ve kumaş.'),
      soru('Konargöçerlik başıboş dolaşmaktır.', false, 'Yaylak-kışlak arasında planlı göç.'),
    ], [
      {
        soru: 'Türklerde konargöçerlik neden yaygındı?',
        siklar: ['Bozkır tarıma elverişsizdi', 'Tarım bilinmiyordu'],
        dogru: 0,
        aciklama: {
          dogru: 'Hayvancılık otlak takibini zorunlu kıldı; göç planlıydı, başıboş değil.',
          yanlis: 'Tarım biliniyordu ama bozkır iklimi ona elverişli değildi. Hayvancılık yaylak-kışlak göçünü zorunlu kıldı.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('trh9-t3', 'Orta Çağ Medeniyetleri', [
    konu('trh9-goc', 'Orta Çağ’da Yaşanan Kitlesel Göçler', [
      kart(
        'Kavimler Göçü',
        'Hunların batıya ilerlemesi Germen kavimlerini yerinden etti; 375’te başlayan bu dalga Avrupa’yı yeniden şekillendirdi.',
      ),
      kart(
        'Göçün sebepleri',
        'İklim değişikliği, otlak yetersizliği, nüfus baskısı ve dış saldırılar.',
      ),
      kart(
        'Sonuçları',
        'Batı Roma yıkıldı, feodalite doğdu, Avrupa’da bugünkü ulusların temeli atıldı. İlk Çağ kapandı.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Hun baskısı', alt: '375' },
            { ad: 'Germen göçü' },
            { ad: 'Batı Roma yıkıldı', alt: '476' },
            { ad: 'Feodalite' },
          ],
        },
      ),
      kart(
        'Türk göçleri',
        'Türk boyları Orta Asya’dan Anadolu, İran ve Hindistan’a yayıldı; gittikleri yerlerin kültürünü de dönüştürdüler.',
      ),
      kart(
        'Göç ve din',
        'Göç eden topluluklar gittikleri yerin dinini benimseyebiliyordu; Türklerin İslamlaşması bu sürecin sonucudur.',
      ),
      kart(
        'Göç tek yönlü değil',
        'Gelen topluluk yerleşiği değiştirdiği kadar kendisi de değişir. Kültür alışverişi her zaman iki yönlüdür.',
      ),
    ], [
      soru('Kavimler Göçü, Avrupa nın siyasi haritasının değişmesine yol açtı.', true, 'Yeni krallıklar kuruldu, Roma ikiye ayrıldı.'),
      soru('Göçlerin sebepleri arasında iklim değişiklikleri ve otlak yetersizliği vardır.', true, 'Nüfus baskısı ve dış saldırılar da göçü tetikleyen sebepler.'),
      soru('Kavimler Göçü sonucunda Roma İmparatorluğu güçlenmiştir.', false, 'Tersine, ikiye ayrılmasında ve Batı Roma nın yıkılışında etkili oldu.'),
      soru('Göç eden topluluklar gittikleri yerin kültürünü etkilemez.', false, 'Etkileşim iki yönlü: hem etkilerler hem etkilenirler.'),
      sikli('Kavimler Göçü hangi yılda başladı?', ['375', '1071'], 0, 'Hun baskısı.'),
      sikli('Kavimler Göçü\'nün sonuçlarından biri?', ['Feodalitenin doğuşu', 'Rönesans'], 0, 'Batı Roma yıkıldı, İlk Çağ kapandı.'),
      soru('Göçte yalnızca gelen topluluk değişir.', false, 'Kültür alışverişi iki yönlü.'),
    ], [
      {
        soru: 'Kavimler Göçü\'nü başlatan olay nedir?',
        siklar: ['Batı Roma\'nın yıkılması', 'Hunların batıya ilerlemesi'],
        dogru: 1,
        aciklama: {
          dogru: '375\'te Hun baskısı Germen kavimlerini yerinden etti.',
          yanlis: 'Batı Roma\'nın yıkılması göçün sonucu, sebebi değil. Başlatan Hunların batıya ilerlemesi.',
        },
        kart: 1,
      },
    ]),
    konu('trh9-devletler', 'Orta Çağ Devletlerinde Yönetim ve Ordu', [
      kart(
        'Feodalite',
        'Merkezî otorite zayıflayınca toprak sahibi senyörler güçlendi. Koruma karşılığı hizmet ilişkisi kuruldu.',
      ),
      kart(
        'Feodal piramit',
        'Yetki ve toprak yukarıdan aşağı dağıtılır, hizmet ve ürün aşağıdan yukarı akardı.',
        {
          tur: 'katman',
          daralan: false,
          katmanlar: [
            { ad: 'Kral' },
            { ad: 'Soylular' },
            { ad: 'Şövalyeler' },
            { ad: 'Serfler' },
          ],
        },
      ),
      kart(
        'Bizans',
        'Roma’nın doğu mirasını sürdürdü; güçlü bürokrasi ve tema sistemiyle uzun süre ayakta kaldı.',
      ),
      kart(
        'İslam devletlerinde yönetim',
        'Halifelik makamı din ve devlet başkanlığını birleştirdi; divan teşkilatı yönetimi yürüttü.',
      ),
      kart(
        'Türk-İslam devletleri',
        'Karahanlılar, Gazneliler ve Selçuklularda ikta sistemi hem orduyu besledi hem toprağı işletti.',
      ),
      kart(
        'İkta nasıl işler?',
        'Toprağın vergisi bir komutana bırakılır, o da karşılığında asker besler. Devlet nakit ödemeden ordu kurmuş olur.',
      ),
      kart(
        'Ordu yapıları',
        'Avrupa’da şövalye, Bizans’ta tema askeri, İslam dünyasında gulam ve ikta askerleri.',
      ),
    ], [
      soru(
        'Feodal düzende toprağı işleyen köylüler piramidin en üstünde yer alır.',
        false,
        'Köylüler en altta; üstte kral ve toprağı ondan alan soylular bulunuyor.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Kral' },
            { ad: 'Soylular' },
            { ad: 'Şövalyeler' },
            { ad: 'Köylüler' },
          ],
        },
      ),
      soru('İkta sisteminde toprağın geliri, karşılığında asker yetiştirmek üzere görevlilere bırakılır.', true, 'Toprağın mülkiyeti devlette kalıyor.'),
      soru('Bizans ta imparator hem siyasi hem dinî otoriteye sahiptir.', true, 'Kilise üzerinde de söz sahibiydi.'),
      soru('Feodalitede kralın merkezî otoritesi güçlüdür.', false, 'Toprak ve askerî güç soyluların elinde; kralın otoritesi zayıftır.'),
      sikli('Feodalitede koruma karşılığında ne verilirdi?', ['Hizmet', 'Vergi muafiyeti'], 0, 'Senyör-vasal ilişkisi.'),
      sikli('Bizans\'ın ordu düzeni?', ['Tema sistemi', 'İkta'], 0, 'Güçlü bürokrasi ile uzun süre ayakta kaldı.'),
      sikli('İslam devletlerinde yönetimi yürüten kurum?', ['Divan', 'Senato'], 0, 'Halifelik din ve devlet başkanlığını birleştirdi.'),
      soru('Avrupa\'da şövalye, İslam dünyasında gulam askerleri vardı.', true, 'Ordu yapıları farklıydı.'),
    ], [
      {
        soru: 'İkta sisteminde devlet ne kazanır?',
        siklar: ['Merkezde toplanan vergi', 'Nakit ödemeden ordu'],
        dogru: 1,
        aciklama: {
          dogru: 'Toprağın vergisi komutana bırakılır, o asker besler; hazineden para çıkmaz.',
          yanlis: 'Vergi merkeze gitmez, komutanda kalır. Devletin kazancı hazineden para çıkmadan beslenen ordu.',
        },
        kart: 6,
      },
    ]),
    konu('trh9-ticaret', 'Orta Çağ’daki Ticaret Yolları', [
      kart(
        'İpek Yolu',
        'Çin’den Akdeniz’e uzanırdı. Yalnızca ipek değil; kâğıt, barut ve pusula da bu yolla batıya geçti.',
      ),
      kart(
        'Baharat Yolu',
        'Hindistan ve Güneydoğu Asya’dan baharatı taşıyordu. Baharat hem lezzet hem koruyucu olduğu için çok değerliydi.',
      ),
      kart(
        'Kürk Yolu',
        'Kuzey bozkırlarından Doğu Avrupa’ya uzanan yol; kürk ve orman ürünleri taşıyordu.',
      ),
      kart(
        'Üç yol, üç yük',
        'Yolların adı taşıdıkları başlıca maldan gelir ama hepsi aynı zamanda fikir ve hastalık da taşıdı.',
        {
          tur: 'tablo',
          basliklar: ['Yol', 'Güzergâh'],
          satirlar: [
            ['İpek', 'Çin → Akdeniz'],
            ['Baharat', 'Hindistan → Mısır'],
            ['Kürk', 'Sibirya → Avrupa'],
          ],
        },
      ),
      kart(
        'Yol denetimi güçtür',
        'Yolları elinde tutan devlet gümrük geliri ve siyasi ağırlık kazanırdı. Savaşların sebebi çoğu zaman buydu.',
      ),
      kart(
        'Kervansaraylar',
        'Selçuklular yol güvenliği için kervansaray kurdu ve sigorta benzeri bir tazmin uygulaması geliştirdi.',
      ),
      kart(
        'Yolun taşıdığı başka şeyler',
        'Veba salgını da ticaret yollarını izleyerek yayıldı; 14. yüzyılda Avrupa nüfusunun büyük kısmını yok etti.',
      ),
    ], [
      soru('İpek Yolu, Çin den Avrupa ya uzanan bir ticaret ağıdır.', true, 'Tek bir yol değil, birbirine bağlanan güzergâhlardan oluşuyordu.'),
      soru('Ticaret yolları yalnızca mal taşımış, düşünce ve inançların yayılmasında rol oynamamıştır.', false, 'Kervanlarla birlikte din, teknoloji ve hastalıklar da yayıldı.'),
      soru('Kervansaraylar tüccarların konaklamasını ve güvenliğini sağlardı.', true, 'Yol güvenliği ticaretin sürmesinin şartıydı.'),
      soru('Baharat Yolu, kürk ticareti için kullanılan kuzey güzergâhıdır.', false, 'Kürk Yolu kuzeyde; Baharat Yolu Hindistan ve Güneydoğu Asya ya uzanıyordu.'),
      sikli('Baharatın değerli olmasının sebebi?', ['Lezzet ve koruyuculuk', 'Nadir bulunması'], 0, 'Hindistan ve Güneydoğu Asya\'dan.'),
      sikli('Selçukluların yol güvenliği için kurduğu yapı?', ['Kervansaray', 'Medrese'], 0, 'Sigorta benzeri tazmin de vardı.'),
      sikli('14. yüzyılda ticaret yollarıyla yayılan salgın?', ['Veba', 'Kolera'], 0, 'Avrupa nüfusunun büyük kısmını yok etti.'),
      soru('Ticaret yollarını denetleyen devlet gümrük geliri kazanırdı.', true, 'Savaşların sebebi çoğu zaman buydu.'),
    ], [
      {
        soru: 'Kâğıt, barut ve pusula batıya hangi yolla geçti?',
        siklar: ['Kürk Yolu', 'İpek Yolu'],
        dogru: 1,
        aciklama: {
          dogru: 'Çin\'den Akdeniz\'e uzanan yol yalnızca ipek taşımadı.',
          yanlis: 'Kürk Yolu kuzey bozkırlarından orman ürünü taşıdı. Çin buluşları İpek Yolu\'yla batıya geçti.',
        },
        kart: 1,
      },
    ]),
    konu('trh9-medeniyet', 'Orta Çağ’da Bilim, Kültür ve Sanat', [
      kart(
        'İslam bilim havzası',
        'Bağdat’taki Beytü’l-Hikme’de Yunan ve Hint eserleri çevrildi; matematik, tıp ve astronomi ilerledi.',
      ),
      kart(
        'Öne çıkan adlar',
        'Bu adların eserleri Avrupa üniversitelerinde yüzyıllarca ders kitabı olarak okutuldu.',
        {
          tur: 'tablo',
          basliklar: ['Bilgin', 'Katkısı'],
          satirlar: [
            ['Harezmî', 'Cebir'],
            ['İbn Sina', 'Tıp'],
            ['Birunî', 'Astronomi'],
            ['İbn Heysem', 'Optik'],
          ],
        },
      ),
      kart(
        'Kâğıdın yolculuğu',
        'Çin’de bulunan kâğıt Semerkant üzerinden İslam dünyasına, oradan Avrupa’ya geçti ve bilgi ucuzladı.',
      ),
      kart(
        'Avrupa’da manastırlar',
        'Bilgi manastırlarda korundu. Üniversiteler 11. yüzyıldan sonra kuruldu.',
      ),
      kart(
        'Bilgi aktarımı',
        'Endülüs ve Sicilya, İslam dünyasındaki birikimin Avrupa’ya geçtiği köprülerdi.',
      ),
      kart(
        'Medreseler',
        'Selçuklularda Nizamiye medreseleri düzenli bir eğitim ağı kurdu; hem din hem pozitif bilim okutuluyordu.',
      ),
      kart(
        'Sanat',
        'Mimaride kubbe, kemer ve çini; Avrupa’da romanesk ve gotik üsluplar. İnanç, sanatın başlıca konusuydu.',
      ),
    ], [
      soru('Kâğıt üretimi Çin den İslam dünyasına, oradan Avrupa ya yayılmıştır.', true, 'Bilginin çoğaltılması bu yolculukla ucuzladı.'),
      soru('Medreseler Orta Çağ İslam dünyasının eğitim kurumlarıdır.', true, 'Dinî bilimlerin yanında matematik ve tıp da okutuluyordu.'),
      soru('İbn Sina ve Biruni nin eserleri Avrupa da hiç tanınmamıştır.', false, 'Latinceye çevrildiler ve yüzyıllarca ders kitabı olarak okutuldular.'),
      soru('Orta Çağ da bilgi tek bir merkezde üretilmiş, aktarım yaşanmamıştır.', false, 'Çeviri hareketleri ve ticaret yollarıyla bilgi sürekli yer değiştirdi.'),
      sikli('Beytü\'l-Hikme neredeydi?', ['Bağdat', 'Endülüs'], 0, 'Yunan ve Hint eserleri çevrildi.'),
      sikli('Kâğıt Avrupa\'ya hangi yolla ulaştı?', ['Çin → Semerkant → İslam dünyası → Avrupa', 'Doğrudan Çin\'den'], 0, 'Bilgi ucuzladı.'),
      sikli('Nizamiye medreselerini kuran devlet?', ['Selçuklular', 'Bizans'], 0, 'Din ve pozitif bilim okutuluyordu.'),
      soru('Avrupa üniversiteleri 11. yüzyıldan sonra kuruldu.', true, 'Öncesinde bilgi manastırlarda korundu.'),
    ], [
      {
        soru: 'İslam dünyasındaki bilgi Avrupa\'ya hangi köprülerden geçti?',
        siklar: ['Bağdat ve Semerkant', 'Endülüs ve Sicilya'],
        dogru: 1,
        aciklama: {
          dogru: 'İki bölge de Avrupa ile İslam dünyasının fiziksel temas noktasıydı.',
          yanlis: 'Bağdat ve Semerkant üretim ve çeviri merkezleri. Avrupa\'ya aktaran köprüler Endülüs ve Sicilya.',
        },
        kart: 5,
      },
    ]),
  ]),
])
