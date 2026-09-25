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
        'Bugünkü kurumların, sınırların ve sorunların nereden geldiğini anlatır.\nBugünü açıklayan şey çoğu zaman dündür.',
      ),
      kart(
        'Kimlik ve aidiyet',
        'Ortak geçmiş bilgisi bir toplumu birbirine bağlar.\nKendini tanımanın bir yolu da geçmişini bilmektir.',
      ),
      kart(
        'Eleştirel düşünme',
        'Tarih, kaynağı sorgulamayı öğretir:\n- Kim söylemiş?\n- Neden söylemiş?\n- Neyi atlamış?',
      ),
      kart(
        'Empati kurmak',
        'Geçmişteki insan kendi çağının koşullarıyla anlaşılır.\nBugünün ölçüleriyle yargılamak tarih değil, ahlak dersi olur.',
      ),
      kart(
        'Tekrarlamaz ama benzer',
        'Tarih birebir tekrarlanmaz; benzer koşullar benzer sonuçlar üretir.\nDers alınan şey kalıp değil, örüntüdür.',
      ),
      kart(
        'Kötüye kullanımı',
        'Geçmiş, bugünkü bir siyasi iddiayı haklı çıkarmak için seçilerek anlatılabilir.\nTarih bilgisi bunun panzehiridir.',
        undefined,
        { not: 'Aynı olay iki ülkenin ders kitabında iki ayrı anlatılır; ikisini de okuyan kaynak eleştirisi yapmış olur.' },
      ),
    ], [
      soru('Tarih, geçmişteki olayların birebir tekrar edeceğini gösterir.', false, 'Olaylar aynen tekrarlanmaz; benzer koşullar benzer sonuçlar üretebilir.'),
      soru('Tarih bilgisi, kişinin ait olduğu topluluğu tanımasına katkı sağlar.', true, 'Ortak geçmiş, kimlik ve aidiyet duygusunun kaynaklarından biri.'),
      soru('Tarihî empati, geçmişteki insanları kendi dönemlerinin koşulları içinde anlamaktır.', true, 'Bugünün ölçüleriyle yargılamak, olayı anlamayı engelliyor.'),
      soru('Tarih hiçbir zaman siyasi amaçlarla kullanılmaz.', false, 'Seçilmiş olaylarla kurulan anlatılar tarihin kötüye kullanımına örnek.'),
      sikli('"Kim söylemiş, neden söylemiş, neyi atlamış?" sorusu neyi öğretir?', ['Eleştirel düşünme', 'Kimlik'], 0, 'Kaynak sorgulama.'),
      sikli('Bir olayın iki ülkenin ders kitabında farklı anlatılması neyi gösterir?', ['Kaynak eleştirisinin gerekliliğini', 'Tarihin gereksizliğini'], 0, 'İkisini de okuyup karşılaştıran kaynak eleştirisi yapmış olur.'),
      soru('Bugünkü sınırların ve kurumların kökenini anlamak tarih bilgisi gerektirir.', true, 'Bugünü açıklayan şey çoğu zaman dündür.'),
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
        'Geçmişteki insan topluluklarını inceleyen bilimdir.\n- Yer ve zaman gösterir.\n- Sebep-sonuç ilişkisi kurar.',
      ),
      kart(
        'Neden deney yapılamaz?',
        'Olaylar tek seferliktir ve geri döndürülemez.\nBu yüzden tarih deneye değil **kaynağa** dayanır.',
        undefined,
        { not: 'Malazgirt bir daha yapılamaz; tarihçi kaynak karşılaştırır. \'Tarih deney bilimidir\' şıkkı yanlış.' },
      ),
      kart(
        'Nesnellik sorunu',
        'Tarihçi kendi çağının insanıdır.\nNesnellik, önyargısızlık iddiası değil; kaynağa sadakat ve yöntem disiplinidir.',
      ),
      kart(
        'Yer ve zaman şart',
        'Yeri ve zamanı belirsiz bir anlatı tarih değildir.\nİkisi tarihsel bilginin çerçevesidir.',
      ),
      kart(
        'Çağlara ayırma',
        'Çağ sınırları, tarihçilerin kolaylık için koyduğu ölçülerdir.\nİnsanlar bir sabah "Orta Çağ başladı" diye uyanmadı.',
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
        'İkisini ayıran şey **yazının bulunmasıdır**.\n- **Yazıdan önce:** kalıntılarla incelenir.\n- **Yazıdan sonra:** belgelerle incelenir.',
      ),
      kart(
        'Takvimler',
        'Toplumlar kendi başlangıç noktalarını seçti.\n- **Hicrî takvim:** ay yılına dayanır.\n- **Miladî takvim:** güneş yılına dayanır.',
      ),
      kart(
        'Hicrî ve Miladî çevirme',
        '- **Hicrî yıl:** 354 gün\n- **Miladî yıl:** 365 gün\nKaba çeviri: Miladî = Hicrî − Hicrî/33 + 622',
      ),
    ], [
      soru('Tarihî olaylar laboratuvarda deney yapılarak sınanabilir.', false, 'Olay bir kez yaşandı ve tekrarlanamıyor; tarihçi kaynaklara dayanmak zorunda.'),
      soru('Tarihî bir olay incelenirken yer ve zaman belirtilmek zorundadır.', true, 'Yeri ve zamanı olmayan bir anlatı tarih değil.'),
      soru('Yazının bulunuşu, tarih öncesi çağların sonu kabul edilir.', true, 'Yazılı kaynakla birlikte tarihî çağlar başlıyor.'),
      soru('Tarihçi kaynakları seçerken kendi bakış açısından hiç etkilenmez.', false, 'Nesnellik hedeftir ama hangi kaynağın öne çıkacağı bir seçim.'),
      sikli('Hicrî bir yıl kaç gündür?', ['365', '354'], 1, 'Hicrî takvim ay yılına dayanır; Miladî yıl 365 gün.'),
      sikli('Hicrî takvim neye dayanır?', ['Ay yılına', 'Güneş yılına'], 0, 'Miladî güneş yılı.'),
      sikli('Hicret hangi yıldır?', ['622', '1453'], 0, 'Hicrî takvimin başlangıcı.'),
      sikli('Orta Çağ hangi olayla başlatılır?', ['Kavimler Göçü (375)', 'İstanbul\'un fethi (1453)'], 0, '1453 Orta Çağ\'ı kapatıp Yeni Çağ\'ı başlatır.'),
      soru('Çağ sınırları, tarihçilerin kolaylık için koyduğu ölçülerdir.', true, 'İnsanlar bir sabah "Orta Çağ başladı" diye uyanmadı.'),
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
        '- **Birinci el kaynak:** olayın çağından gelir (belge, kalıntı).\n- **İkinci el kaynak:** olayı sonradan yorumlar.',
      ),
      kart(
        'Yazılı ve yazısız',
        '- **Yazılı:** belge, kitabe, ferman\n- **Yazısız:** kalıntı, sikke, mimari, mezar buluntusu',
      ),
      kart(
        'Kaynak eleştirisi',
        '- **Dış eleştiri:** belge gerçek mi?\n- **İç eleştiri:** içeriği güvenilir mi?',
        undefined,
        { not: 'Dış eleştiri: kâğıt, mühür, yazı tipi sahte mi? İç eleştiri: yazan taraflı mı, olayı görmüş mü?' },
      ),
      kart(
        'Yardımcı bilimler',
        'Tarihin tek başına okuyamadığı kaynakları bu bilimler çözer.\nTabloda en sık sorulan beşi var.',
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
        'Tarama → tasnif → tahlil → tenkit → terkip\nSon adımda parçalar bütünlüklü bir anlatıya dönüşür.',
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
        'Aynı dönem yeniden yazılabilir:\n- Yeni bir belge bulunduğunda\n- Yeni sorular sorulduğunda',
      ),
      kart(
        'Örnekle',
        '- **Osmanlı fermanı:** birinci el kaynak\n- **Onu inceleyen kitap:** ikinci el kaynak\nMührü dış eleştirinin, içindeki iddia iç eleştirinin konusudur.',
      ),
    ], [
      soru('Olayın yaşandığı dönemden kalan belgelere birinci elden kaynak denir.', true, 'Sonradan yazılanlar ikinci elden kaynak sayılıyor.'),
      soru('Kaynak eleştirisi, belgenin gerçekliğini ve güvenilirliğini sorgular.', true, 'Belge sahte olabilir ya da yazan taraflı olabilir.'),
      soru('Sikkeleri inceleyen yardımcı bilim paleografyadır.', false, 'Sikkeleri nümizmatik inceler; paleografya eski yazıların bilimi.'),
      soru('Bir olay hakkındaki tarih yazımı, yeni belgeler bulunsa da değişmez.', false, 'Yeni kaynak, kurulmuş anlatıyı değiştirebiliyor.'),
      sikli('Kitabeleri inceleyen yardımcı bilim?', ['Epigrafya', 'Arkeoloji'], 0, 'Arkeoloji kazıyla kalıntıları inceler.'),
      sikli('Sikke ve mezar buluntusu hangi kaynak türüdür?', ['Yazılı', 'Yazısız'], 1, 'Kitabe yazılı.'),
      sikli('Tarihsel bilgi üretiminin son adımı?', ['Tasnif', 'Terkip'], 1, 'Parçalar bütün anlatıya dönüşür.'),
      soru('Tarih araştırmasında tasnif, toplanan kaynakların sınıflandırılmasıdır.', true, 'Tarama → tasnif → tahlil → tenkit → terkip.'),
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
        'Devlet arşivleri belgeleri sayısallaştırdı.\nEskiden yıllar alan tarama artık uzaktan yapılabiliyor.',
      ),
      kart(
        'Yeni yöntemler',
        'Tarihçinin araç setine girenler:\n- Coğrafi bilgi sistemleriyle haritalama\n- Büyük veriyle nüfus ve ticaret analizi',
      ),
      kart(
        'Dijital sergiler',
        'Müze koleksiyonları ve harabeler üç boyutlu taranıyor.\nUlaşılamayan bir yapı ekranda gezilebiliyor.',
      ),
      kart(
        'Doğrulama sorunu',
        'İnternetteki her metin kaynak değildir.\nDijital ortamda kaynak eleştirisi daha da gerekli hâle geldi.',
        undefined,
        { not: 'Vikipedi başlangıç noktasıdır, kaynak değil; dipnotundaki arşiv belgesi kaynaktır.' },
      ),
      kart(
        'Yapay zekâ ve tarih',
        'Eski el yazmalarını okumada yardımcı oluyor.\nAma ürettiği metin doğrulanmadan tarihsel bilgi sayılamaz.',
      ),
      kart(
        'Dijital kaybolma',
        '- **Kâğıt:** yüzyıllarca dayanır.\n- **Dosya ve disk:** onlarca yılda okunamaz hâle gelebilir.',
      ),
    ], [
      soru('Dijitalleşme, arşiv belgelerine uzaktan erişimi kolaylaştırmıştır.', true, 'Başka ülkedeki bir arşiv artık ekrandan taranabiliyor.'),
      soru('İnternette bulunan her tarihî görsel ve belge doğrudur.', false, 'Kaynağı belirsiz ya da üretilmiş içerikler de dolaşımda; doğrulama şart.'),
      soru('Dijital ortamdaki veriler hiçbir zaman kaybolmaz.', false, 'Kapanan siteler ve eskiyen dosya biçimleri yüzünden dijital kayıp gerçek bir sorun.'),
      soru('Dijital sergiler, müzeye gidemeyenlerin esere ulaşmasını sağlar.', true, 'Erişimi genişletiyor ama eserin kendisinin yerini tutmuyor.'),
      sikli('Yapay zekâ tarihçiye hangi işte yardımcı olabilir?', ['Eski el yazmalarını okumada', 'Kaynağı kendiliğinden doğrulamada'], 0, 'Ürettiği metin yine de kaynakla doğrulanmalı.'),
      sikli('Coğrafi bilgi sistemleri tarihçiye ne verir?', ['Haritalama', 'Doğrulama'], 0, 'Ticaret ve nüfus analizi de büyük veriyle.'),
      soru('Büyük veri, tarihçinin nüfus ve ticaret analizinde kullanılabilir.', true, 'Binlerce kaydı birlikte incelemek elle mümkün değildi.'),
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
        'Yaklaşık 12 bin yıl önce insanlar bitkiyi ve hayvanı evcilleştirdi.\nToplayıcılıktan üretime geçildi.',
      ),
      kart(
        'Zincirleme sonuç',
        'Tek bir değişiklik, birbirini doğuran bir dizi sonuç üretti.\nŞehir ve devlet bu zincirin sonunda durur.',
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
        { not: 'Tarım → yerleşme → artı ürün → iş bölümü → sınıf → yazı → devlet. Sınavda sıra ve sebep sorulur.' },
      ),
      kart(
        'Yerleşik hayat',
        'Tarla bakım istediği için insan yerleşti.\nKöyler, sonra şehirler bu zorunluluktan doğdu.',
      ),
      kart(
        'Artı ürün',
        'İhtiyaçtan fazla üretimdir.\nTarımla uğraşmayan zanaatkâr, asker ve rahip sınıfını mümkün kıldı.',
      ),
      kart(
        'Mülkiyet ve sınıf',
        'Toprak ve depolanan ürün "kimin?" sorusunu doğurdu.\nToplumsal eşitsizlik ve hukuk aynı kökten çıktı.',
      ),
      kart(
        'Yazının doğuşu',
        'Artı ürünün kaydını tutma ihtiyacı yazıyı doğurdu.\nİlk tabletler edebiyat değil, **muhasebe kaydıdır**.',
      ),
      kart(
        'Anadolu’dan izler',
        'Bu geçiş döneminin dünyaca önemli iki merkezi:\n- Göbeklitepe (Şanlıurfa)\n- Çatalhöyük (Konya)',
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
      sikli('İlk yazılı tabletler çoğunlukla ne tür kayıtlardır?', ['Muhasebe kayıtları', 'Destanlar'], 0, 'Yazı artı ürünün kaydını tutma ihtiyacından doğdu.'),
      sikli('Göbeklitepe hangi bölgemizdedir?', ['Karadeniz', 'Güneydoğu Anadolu (Şanlıurfa)'], 1, 'Tarıma geçiş döneminin dünyaca önemli merkezlerinden.'),
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
        '- Site devletleri\n- Krallıklar\n- İmparatorluklar\nToprak büyüdükçe yönetim de merkezîleşti.',
      ),
      kart(
        'Teokratik yönetim',
        'Mısır’da firavun **tanrı-kral** sayılırdı.\nDin ile devletin ayrılmadığı bu yapı yaygındı.',
      ),
      kart(
        'Ordu ve teknoloji',
        'Tunç ve demir silahlar, savaş arabası ve at güç dengesini belirledi.\nDemiri işleyen Hititler öne çıktı.',
      ),
      kart(
        'Atina ve demokrasi',
        'Atina’da yurttaşlar doğrudan karar veriyordu.\nAma kadınlar, köleler ve yabancılar yurttaş sayılmıyordu.',
        undefined,
        { not: 'Atina\'da oy hakkı: yetişkin, erkek, Atina doğumlu yurttaş — nüfusun ~%10\'u. Kadın ve köle dışarıda.' },
      ),
      kart(
        'Sparta',
        'Askerî bir düzen kurulmuştu.\n- Eğitim savaşçı yetiştirmeye ayarlıydı.\n- Yönetim dar bir gruptaydı.',
      ),
      kart(
        'Roma’nın yönetimi',
        'Krallık → cumhuriyet → imparatorluk\nSenato ve konsüllük kalıcı bir yönetim geleneği bıraktı.',
      ),
      kart(
        'Ordunun beslenmesi',
        'Sürekli ordu artı ürüne bağlıdır.\nVergi düzeni bozulan devletin ordusu da kısa sürede çözülürdü.',
      ),
    ], [
      soru('Teokratik yönetimde siyasi güç dinî inanışa dayandırılır.', true, 'Yönetenin yetkisi tanrısal bir kaynaktan geliyor sayılıyordu.'),
      soru('Atina daki doğrudan demokraside kadınlar ve köleler de oy kullanırdı.', false, 'Yalnızca yurttaş sayılan özgür erkekler katılabiliyordu.'),
      soru('Sparta askerî temele dayanan bir toplum ve yönetim düzeni kurmuştur.', true, 'Eğitim de yönetim de asker yetiştirmeye göre kurulmuştu.'),
      soru('Roma tarihi boyunca yalnızca cumhuriyetle yönetilmiştir.', false, 'Krallık, cumhuriyet ve imparatorluk dönemlerinden geçti.'),
      sikli('Toprak büyüdükçe yönetim nasıl değişti?', ['Dağıldı', 'Merkezîleşti'], 1, 'Site devletinden krallığa, oradan imparatorluğa.'),
      sikli('Demiri işleyerek öne çıkan uygarlık?', ['Mısırlılar', 'Hititler'], 1, 'Savaş teknolojisi güç dengesini belirledi.'),
      sikli('Roma\'dan kalan kalıcı yönetim geleneği hangisidir?', ['Senato', 'Divan'], 0, 'Divan İslam devletlerinin yönetim kurumu.'),
      soru('Sürekli bir ordu, artı ürüne ve düzenli vergiye bağlıdır.', true, 'Vergi düzeni bozulan devletin ordusu kısa sürede çözülürdü.'),
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
        'Bilinen ilk yazılı yasalar **Sümerlerde** çıktı.\nAmaç, güçlünün zayıfı ezmesini sınırlamaktı.',
      ),
      kart(
        'Hammurabi kanunları',
        'Babil’de sert ve kısasa dayalı yasalardır.\nYazılı olmaları, keyfî cezayı sınırladığı için ileri bir adımdı.',
      ),
      kart(
        'Hitit hukuku',
        '- Cezalar daha yumuşak ve tazminat ağırlıklıydı.\n- Kadının hukuki durumu çağdaşlarına göre iyiydi.',
      ),
      kart(
        'İki ceza anlayışı',
        'Aynı çağda iki yaklaşım yan yana yaşadı.\nİkisi de bugünkü hukuka iz bıraktı.',
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
        'On İki Levha ile başladı.\nBugünkü Avrupa hukuk sistemlerinin temelinde Roma hukuku vardır.',
      ),
      kart(
        'Ortak yön',
        'Yasanın yazılı olması hukuku hükümdarın ağzından çıkardı.\nHukuk, herkesin bilebileceği bir ölçüye dönüştü.',
        undefined,
        { not: 'Hammurabi \'göze göz\', Hitit tazminat; ortak nokta ikisi de yazılı: ceza artık kralın keyfine değil metne bağlı.' },
      ),
    ], [
      soru('Bilinen ilk yazılı kanunlar Mezopotamya da ortaya çıkmıştır.', true, 'Urgakina kanunları bilinen en eski örneklerden.'),
      soru('Hammurabi kanunları kısasa kısas anlayışını benimsemiştir.', true, 'Ceza, işlenen suçun aynısıyla karşılık buluyordu.'),
      soru('Hitit kanunları, Hammurabi kanunlarına göre daha ağır cezalar içerir.', false, 'Hitit hukuku daha çok tazminat esaslı, yani daha yumuşak.'),
      soru('Roma hukuku günümüz hukuk sistemlerini etkilememiştir.', false, 'Avrupa hukukunun temel kavramlarının çoğu oradan geliyor.'),
      sikli('Hitit hukukunda kadının durumu çağdaşlarına göre nasıldı?', ['Daha iyiydi', 'Daha kötüydü'], 0, 'Hitit hukuku daha yumuşak ve tazminat ağırlıklıydı.'),
      sikli('Roma hukuku hangi metinle başladı?', ['Tıp Kanunu', 'On İki Levha'], 1, 'Tıp Kanunu İbn Sina\'nın eseri.'),
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
        'Doğa olayları tanrılarla açıklanıyordu.\nTapınaklar aynı zamanda ekonomik ve idari merkezlerdi.',
      ),
      kart(
        'Tek tanrılı inanışlar',
        '- **Musevilik:** bu çağda ortaya çıktı.\n- **Akhenaton’un girişimi:** Mısır’da kısa sürdü.',
      ),
      kart(
        'Ölümden sonra',
        'Mısır’daki öbür dünya inancı mumyalamayı ve anıt mezarları doğurdu.\nİnanç mimariyi doğrudan biçimlendirdi.',
      ),
      kart(
        'Bilim',
        '- **Mısırlılar:** geometri ve takvim\n- **Babilliler:** astronomi ve matematik\nİhtiyaç bilimi doğurdu.',
      ),
      kart(
        'Neden geometri Mısır’da?',
        'Nil her yıl taşıp tarla sınırlarını siliyordu.\nArazi yeniden ölçülmek zorundaydı.',
        undefined,
        { not: 'Nil taşkını sınırları siler → ölçüm gerekir → geometri. Babil\'de astronomi de takvim ihtiyacından doğdu.' },
      ),
      kart(
        'Felsefe',
        'Yunan dünyasında olaylar tanrılarla değil **akılla** açıklanmaya başladı.\nBilimsel düşüncenin kökü buradadır.',
      ),
      kart(
        'Sanat',
        'Anıtsal yapılar hem inancın hem gücün gösterisiydi.\nÖrnek: piramit, zigurat, tapınak',
      ),
    ], [
      soru('Mısır da geometrinin gelişmesinde Nil taşkınlarından sonra tarla sınırlarının yeniden ölçülmesi etkili olmuştur.', true, 'İhtiyaç, bilgiyi doğuran sebeplerden biri.'),
      soru('Eski Çağ da bütün toplumlar tek tanrılı inanca sahipti.', false, 'Çok tanrılı inançlar yaygındı; tek tanrılı inanışlar daha sınırlı topluluklardaydı.'),
      soru('Ölümden sonraki yaşam inancı Mısır da mumyalama geleneğine yol açmıştır.', true, 'Bedenin korunması, sonraki yaşam için gerekli görülüyordu.'),
      soru('Eski Çağ da bilim ile din birbirinden tümüyle ayrılmıştı.', false, 'Gök gözlemleri ve takvim gibi bilgiler çoğu zaman tapınakların işiydi.'),
      sikli('Mısır\'da tek tanrılı inanca geçmeye çalışan firavun?', ['Akhenaton', 'Hammurabi'], 0, 'Girişimi kısa sürdü; Hammurabi Babil kralı.'),
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
        'Mevsime göre yaylak ile kışlak arasında düzenli göçtür.\nBaşıboş dolaşmak değil, planlı bir yaşam biçimidir.',
        undefined,
        { not: 'Yazın yayla, kışın kışlak; aynı yol her yıl. \'Göçebe\' başıboş değil, mevsim takvimine bağlı.' },
      ),
      kart(
        'Neden bu yaşam?',
        'Orta Asya’nın bozkır iklimi tarıma elverişsizdi.\nHayvancılık, otlakların takibini zorunlu kılıyordu.',
      ),
      kart(
        'Toplum yapısı',
        'Örgütlenme aileden devlete kadar iç içe halkalar hâlinde büyür:\noguş → urug → boy → budun → il',
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
        '- At ve demir işçiliği\n- Herkesin savaşçı olduğu ordu-millet yapısı\nİkisi birlikte hareket üstünlüğü sağlıyordu.',
      ),
      kart(
        'Kut anlayışı',
        'Yönetme yetkisinin Tanrı tarafından verildiğine inanılırdı.\nKut kan yoluyla geçtiği için taht kavgaları sıktı.',
      ),
      kart(
        'Kültüre etkisi',
        '- **Gelişen:** taşınabilir sanat (at koşumu, halı, madenî eşya)\n- **Öne çıkan:** anıtsal mimari yerine sözlü kültür',
      ),
      kart(
        'Yerleşiklerle ilişki',
        'Bozkır ile tarım havzası birbirini besledi.\n- **Göçebe verdi:** hayvan ve at\n- **Yerleşik verdi:** tahıl ve kumaş',
      ),
    ], [
      soru('Konargöçer yaşamda temel geçim kaynağı hayvancılıktır.', true, 'Sürünün otlak ihtiyacı yaşam biçimini belirliyordu.'),
      soru('Konargöçerlik, yılın her mevsimini aynı yerde geçirmek demektir.', false, 'Yazlak ve kışlak arasında belirli bir düzenle gidip geliniyor; başıboş bir gezinme değil.'),
      soru('Kut anlayışına göre yönetme yetkisi Tanrı tarafından verilir.', true, 'Yetki hükümdara verilmiş sayılıyor, ailenin erkek üyelerine geçiyordu.'),
      soru('Konargöçer toplumda ordu ayrı bir meslek grubudur.', false, 'Halkın tamamı gerektiğinde asker; ordu-millet anlayışı buradan geliyor.'),
      sikli('Kut kan yoluyla geçtiği için hangi sorun sık yaşandı?', ['Taht kavgaları', 'Kıtlık'], 0, 'Hanedanın her erkek üyesi hak iddia edebiliyordu.'),
      sikli('Konargöçerlerde hangi sanat gelişti?', ['Anıtsal mimari', 'Taşınabilir sanat'], 1, 'Halı, madenî eşya ve at koşumu.'),
      sikli('Bozkır ile tarım havzası nasıl ilişkideydi?', ['Birbirini besledi', 'Hiç temas etmedi'], 0, 'At ve hayvan karşılığında tahıl ve kumaş.'),
      soru('Konargöçer toplumda ailenin adı oguştur.', true, 'Oguş → urug → boy → budun → il.'),
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
        'Hunların batıya ilerlemesi Germen kavimlerini yerinden etti.\n**375**’te başlayan bu dalga Avrupa’yı yeniden şekillendirdi.',
      ),
      kart(
        'Göçün sebepleri',
        '- İklim değişikliği\n- Otlak yetersizliği\n- Nüfus baskısı\n- Dış saldırılar',
      ),
      kart(
        'Sonuçları',
        '- Batı Roma yıkıldı (476).\n- Feodalite doğdu.\n- Avrupa’da bugünkü ulusların temeli atıldı.',
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
        'Türk boyları Orta Asya’dan Anadolu, İran ve Hindistan’a yayıldı.\nGittikleri yerlerin kültürünü de dönüştürdüler.',
      ),
      kart(
        'Göç ve din',
        'Göç eden topluluklar gittikleri yerin dinini benimseyebiliyordu.\nTürklerin İslamlaşması bu sürecin sonucudur.',
      ),
      kart(
        'Göç tek yönlü değil',
        'Gelen topluluk yerleşiği değiştirdiği kadar kendisi de değişir.\nKültür alışverişi her zaman iki yönlüdür.',
        undefined,
        { not: 'Kavimler Göçü: Germenler Roma\'yı yıktı ama Hristiyanlığı ve Latinceyi aldı. Yıkan, yıktığından öğrenir.' },
      ),
    ], [
      soru('Kavimler Göçü, Avrupa nın siyasi haritasının değişmesine yol açtı.', true, 'Yeni krallıklar kuruldu, Roma ikiye ayrıldı.'),
      soru('Göçlerin sebepleri arasında iklim değişiklikleri ve otlak yetersizliği vardır.', true, 'Nüfus baskısı ve dış saldırılar da göçü tetikleyen sebepler.'),
      soru('Batı Roma İmparatorluğu 476\'da yıkıldı.', true, 'Kavimler Göçü\'nün en önemli sonuçlarından biri.'),
      soru('Göç eden topluluklar gittikleri yerin kültürünü etkilemez.', false, 'Etkileşim iki yönlü: hem etkilerler hem etkilenirler.'),
      sikli('Kavimler Göçü hangi yılda başladı?', ['375', '1071'], 0, 'Hun baskısı.'),
      sikli('Kavimler Göçü\'nün sonuçlarından biri?', ['Feodalitenin doğuşu', 'Rönesans'], 0, 'Batı Roma yıkıldı, İlk Çağ kapandı.'),
      soru('Türklerin İslamlaşması göç sürecinin bir sonucudur.', true, 'Göç eden topluluklar gittikleri yerin dinini benimseyebiliyordu.'),
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
        'Merkezî otorite zayıflayınca toprak sahibi senyörler güçlendi.\nKoruma karşılığı hizmet ilişkisi kuruldu.',
      ),
      kart(
        'Feodal piramit',
        '- **Yukarıdan aşağı:** yetki ve toprak dağıtılır.\n- **Aşağıdan yukarı:** hizmet ve ürün akar.',
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
        'Roma’nın doğu mirasını sürdürdü.\nGüçlü bürokrasi ve tema sistemiyle uzun süre ayakta kaldı.',
      ),
      kart(
        'İslam devletlerinde yönetim',
        '- **Halifelik:** din ve devlet başkanlığını birleştirdi.\n- **Divan teşkilatı:** yönetimi yürüttü.',
      ),
      kart(
        'Türk-İslam devletleri',
        'Karahanlı, Gazneli ve Selçuklularda **ikta sistemi** uygulandı.\nHem orduyu besledi hem toprağı işletti.',
      ),
      kart(
        'İkta nasıl işler?',
        'Toprağın vergisi bir komutana bırakılır.\nKomutan karşılığında asker besler; devlet nakit ödemeden ordu kurmuş olur.',
        undefined,
        { not: 'İkta: toprak devletin, geliri askerin. Feodalite: toprak da senyörün. Fark mülkiyet; sınav bunu sorar.' },
      ),
      kart(
        'Ordu yapıları',
        '- **Avrupa:** şövalye\n- **Bizans:** tema askeri\n- **İslam dünyası:** gulam ve ikta askerleri',
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
      sikli('Bizans\'ın ordu düzeni?', ['İkta', 'Tema sistemi'], 1, 'İkta Türk-İslam devletlerinin düzeni.'),
      sikli('İslam devletlerinde yönetimi yürüten kurum?', ['Senato', 'Divan'], 1, 'Senato Roma\'nın kurumu.'),
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
        'Çin’den Akdeniz’e uzanırdı.\nYalnızca ipek değil; kâğıt, barut ve pusula da bu yolla batıya geçti.',
      ),
      kart(
        'Baharat Yolu',
        'Hindistan ve Güneydoğu Asya’dan baharat taşırdı.\nBaharat hem lezzet hem koruyucu olduğu için çok değerliydi.',
      ),
      kart(
        'Kürk Yolu',
        'Kuzey bozkırlarından Doğu Avrupa’ya uzanırdı.\nKürk ve orman ürünleri taşırdı.',
      ),
      kart(
        'Üç yol, üç yük',
        'Yolların adı taşıdıkları başlıca maldan gelir.\nHepsi aynı zamanda fikir ve hastalık da taşıdı.',
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
        'Yolu elinde tutan devlet gümrük geliri ve siyasi ağırlık kazanırdı.\nSavaşların sebebi çoğu zaman buydu.',
        undefined,
        { not: 'İpek Yolu Türkler ile Çin arasındaki savaşların ana sebebi; Coğrafi Keşifler bu yolları değersizleştirdi.' },
      ),
      kart(
        'Kervansaraylar',
        'Selçuklular yol güvenliği için kervansaraylar kurdu.\nSigorta benzeri bir tazmin uygulaması da geliştirdiler.',
      ),
      kart(
        'Yolun taşıdığı başka şeyler',
        'Veba salgını da ticaret yollarını izleyerek yayıldı.\n14. yüzyılda Avrupa nüfusunun üçte biri ile yarısı arasını yok etti.',
      ),
    ], [
      soru('İpek Yolu, Çin den Avrupa ya uzanan bir ticaret ağıdır.', true, 'Tek bir yol değil, birbirine bağlanan güzergâhlardan oluşuyordu.'),
      soru('Ticaret yolları yalnızca mal taşımış, düşünce ve inançların yayılmasında rol oynamamıştır.', false, 'Kervanlarla birlikte din, teknoloji ve hastalıklar da yayıldı.'),
      soru('Kervansaraylar tüccarların konaklamasını ve güvenliğini sağlardı.', true, 'Yol güvenliği ticaretin sürmesinin şartıydı.'),
      soru('Baharat Yolu, kürk ticareti için kullanılan kuzey güzergâhıdır.', false, 'Kürk Yolu kuzeyde; Baharat Yolu Hindistan ve Güneydoğu Asya ya uzanıyordu.'),
      sikli('Baharatın değerli olmasının sebebi?', ['Lezzet ve koruyuculuk', 'Nadir bulunması'], 0, 'Hindistan ve Güneydoğu Asya\'dan.'),
      sikli('Kürk Yolu nereden nereye uzanırdı?', ['Çin\'den Akdeniz\'e', 'Kuzey bozkırlarından Doğu Avrupa\'ya'], 1, 'Çin\'den Akdeniz\'e uzanan İpek Yolu.'),
      sikli('14. yüzyılda ticaret yollarıyla yayılan salgın?', ['Veba', 'Kolera'], 0, 'Avrupa nüfusunun üçte biri ile yarısı arasını yok etti.'),
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
        'Bağdat’taki **Beytü’l-Hikme**’de Yunan ve Hint eserleri çevrildi.\nMatematik, tıp ve astronomi ilerledi.',
      ),
      kart(
        'Öne çıkan adlar',
        'Bu bilginlerin eserleri Avrupa üniversitelerinde yüzyıllarca okutuldu.\nTabloda kimin hangi alanda öne çıktığı yazıyor.',
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
        'Çin → Semerkant → İslam dünyası → Avrupa\nKâğıt yayıldıkça bilgi ucuzladı.',
      ),
      kart(
        'Avrupa’da manastırlar',
        'Bilgi manastırlarda korundu.\nÜniversiteler 11. yüzyıldan sonra kuruldu.',
      ),
      kart(
        'Bilgi aktarımı',
        'İslam dünyasındaki birikim Avrupa’ya iki köprüyle geçti:\n- Endülüs\n- Sicilya',
        undefined,
        { not: 'İbn Sina\'nın Tıp Kanunu Avrupa\'da 600 yıl okutuldu; çeviri yolu Endülüs (Toledo) ve Sicilya.' },
      ),
      kart(
        'Medreseler',
        'Selçuklularda Nizamiye medreseleri düzenli bir eğitim ağı kurdu.\nHem din hem pozitif bilim okutuluyordu.',
      ),
      kart(
        'Sanat',
        '- **İslam dünyası:** kubbe, kemer, çini\n- **Avrupa:** romanesk ve gotik üslup\nİnanç, sanatın başlıca konusuydu.',
      ),
    ], [
      soru('Kâğıt üretimi Çin den İslam dünyasına, oradan Avrupa ya yayılmıştır.', true, 'Bilginin çoğaltılması bu yolculukla ucuzladı.'),
      soru('Medreseler Orta Çağ İslam dünyasının eğitim kurumlarıdır.', true, 'Dinî bilimlerin yanında matematik ve tıp da okutuluyordu.'),
      soru('İbn Sina ve Biruni nin eserleri Avrupa da hiç tanınmamıştır.', false, 'Latinceye çevrildiler ve yüzyıllarca ders kitabı olarak okutuldular.'),
      soru('Orta Çağ da bilgi tek bir merkezde üretilmiş, aktarım yaşanmamıştır.', false, 'Çeviri hareketleri ve ticaret yollarıyla bilgi sürekli yer değiştirdi.'),
      sikli('Beytü\'l-Hikme neredeydi?', ['Bağdat', 'Endülüs'], 0, 'Yunan ve Hint eserleri çevrildi.'),
      sikli('Cebirin gelişmesinde öne çıkan İslam bilgini?', ['Harezmî', 'İbn Heysem'], 0, 'İbn Heysem optikte öne çıktı.'),
      sikli('Nizamiye medreselerini kuran devlet?', ['Bizans', 'Selçuklular'], 1, 'Din ve pozitif bilim birlikte okutuluyordu.'),
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
