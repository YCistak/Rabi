import { program, tema } from '../tip'
import { onBirinciSinifKonusu, type OnBirinciSinifKonusu } from './11-yardimci'

/** 11. sınıf Tarih; konu sırası MEB'in 2026–2027 Maarif içerik çerçevesinden alınmıştır. */
const taslaklar: OnBirinciSinifKonusu[][] = [
  [
    {
      id: 'trh11-mucadele', ad: '1683-1789 Siyasi ve Askerî Mücadeleler',
      kartlar: [
        ['II. Viyana Kuşatması', '1683’te kuşatma başarısız oldu.\nAvrupa devletlerinin Kutsal İttifak oluşturmasına zemin hazırladı.'],
        ['Karlofça (1699)', 'Osmanlı ilk kez büyük çapta Avrupa toprağı kaybetti.\nSavunma siyasetinin ağırlığı arttı.'],
        ['Prut (1711)', 'Osmanlı Rus ordusunu kuşattı.\nAzak Kalesi geri alındı; Rusya’nın Karadeniz’e açılması bir süre engellendi.'],
        ['Pasarofça (1718)', 'Avusturya ve Venedik ile imzalandı.\nBelgrad Avusturya’ya bırakıldı; ardından Lale Devri başladı.'],
        ['Belgrad (1739)', 'Belgrad yeniden Osmanlı’ya geçti.\nRusya’nın Karadeniz’de savaş gemisi bulundurması sınırlandı.'],
        ['Küçük Kaynarca (1774)', 'Kırım bağımsız sayıldı; Rusya Karadeniz’de güçlendi.\nBu, Kırım’ın hemen Rusya’ya bırakıldığı anlamına gelmez.'],
      ],
      not: 'Kırım 1774’te bağımsız sayıldı; Rusya’nın ilhakı 1783’tedir. İki tarihi aynı olay gibi okuma.',
      iddialar: [
        ['Karlofça, Osmanlı’nın Avrupa’da büyük çaplı toprak kaybını kabul ettiği antlaşmadır.', true, '1699 antlaşması bir dönüm noktasıdır.'],
        ['Pasarofça ile Belgrad Osmanlı’ya geri verilmiştir.', false, 'Belgrad 1718’de kaybedildi, 1739’da geri alındı.'],
        ['Küçük Kaynarca’da Kırım doğrudan Rus toprağı olmuştur.', false, 'Antlaşmada bağımsız sayıldı; Rusya 1783’te ilhak etti.'],
        ['Prut Antlaşması ile Azak Kalesi geri alınmıştır.', true, '1711’de Rusya Azak’ı geri verdi.'],
      ],
      secimler: [
        ['Lale Devri hangi antlaşmadan sonra başladı?', 'Pasarofça', 'Karlofça', '1718 Pasarofça’nın ardından başladı.'],
        ['Belgrad hangi antlaşmayla geri alındı?', 'Belgrad', 'Küçük Kaynarca', '1739 Belgrad Antlaşması’yla.'],
        ['Kutsal İttifak hangi olaydan sonra oluştu?', 'II. Viyana bozgunu', 'Prut zaferi', '1683’teki başarısız kuşatma ittifakı tetikledi.'],
      ],
      kontrol: ['Kırım 1774’te hangi statüye geçti?', 'Bağımsız sayıldı', 'Rusya’ya katıldı', 'Rusya’ya katılması 1783’tedir.'], kontrolKarti: 6,
    },
    {
      id: 'trh11-lale', ad: 'Lale Devri ve Toplum Hayatı',
      kartlar: [
        ['Dönemin sınırı', 'Lale Devri, 1718 Pasarofça ile 1730 Patrona Halil İsyanı arasındadır.\nIII. Ahmed ve Nevşehirli Damat İbrahim Paşa öne çıkar.'],
        ['Avrupa’yı tanıma', 'Geçici elçiliklerle Avrupa’daki kurumlar izlendi.\nYirmisekiz Çelebi Mehmed Efendi’nin Paris gözlemleri etkili oldu.'],
        ['Türkçe matbaa', 'İbrahim Müteferrika ve Said Efendi 1727’de Türkçe basım için izin aldı.\nOsmanlı’daki ilk matbaa bu değildir.'],
        ['Kent ve sanat', 'Sadabad çevresinde bahçe ve köşkler yapıldı.\nMinyatürde Levnî, şiirde Nedim dönemin kültürünü yansıttı.'],
        ['Yeni hizmetler', 'Yangınlara müdahale için Tulumbacı Ocağı kuruldu.\nÇiçek aşısına ilişkin uygulamalar da yaygınlaştı.'],
        ['Dönemin sonu', 'Lüks harcamalar ve siyasal hoşnutsuzluk tepki topladı.\n1730 Patrona Halil İsyanı dönemi bitirdi.'],
      ],
      not: 'Matbaanın Osmanlı’ya ilk gelişiyle Türkçe kitap basma iznini ayır: önce başka dillerde basım vardı.',
      iddialar: [
        ['Lale Devri 1718 Pasarofça Antlaşması’ndan sonra başladı.', true, 'Dönem 1718–1730 arasındadır.'],
        ['İbrahim Müteferrika Osmanlı topraklarındaki ilk matbaayı kurmuştur.', false, 'Önceden başka dillerde basım yapan matbaalar vardı.'],
        ['Tulumbacı Ocağı yangınlarla mücadele için kuruldu.', true, 'Kent hizmetlerindeki yeniliklerden biridir.'],
        ['Patrona Halil İsyanı Lale Devri’ni başlatmıştır.', false, '1730’daki isyan dönemi sona erdirdi.'],
      ],
      secimler: [
        ['Paris gözlemleriyle öne çıkan elçi kimdir?', 'Yirmisekiz Çelebi Mehmed Efendi', 'İbrahim Müteferrika', 'Elçi Paris’e gitti; Müteferrika matbaayla tanınır.'],
        ['Lale Devri’nin bitiş olayı hangisidir?', 'Patrona Halil İsyanı', 'II. Viyana Kuşatması', 'İsyan 1730’da dönemi bitirdi.'],
        ['Yangınlara müdahale için kurulan kurum?', 'Tulumbacı Ocağı', 'Nizam-ı Cedid', 'Tulumbacılar yangın söndürmeyle ilgilendi.'],
      ],
      kontrol: ['Lale Devri hangi yıllar arasındadır?', '1718–1730', '1789–1807', 'Pasarofça’dan Patrona Halil İsyanı’na kadardır.'], kontrolKarti: 1,
    },
    {
      id: 'trh11-depremler', ad: '1755 Lizbon ve 1766 İstanbul Depremleri',
      kartlar: [
        ['İki kent, iki afet', '1755 Lizbon ve 1766 İstanbul depremleri büyük yıkıma yol açtı.\nEtkileri yalnızca sarsıntı süresiyle açıklanamaz.'],
        ['Lizbon’da zincirleme etki', 'Depremi tsunami ve yangınlar izledi.\nLiman kenti olması kıyıdaki hasarı ağırlaştırdı.'],
        ['İstanbul’da yıkım', '1766 sarsıntıları evleri, surları ve anıtsal yapıları etkiledi.\nArtçı sarsıntılar onarımı güçleştirdi.'],
        ['Yeniden inşa', 'Lizbon’da sokak düzeni ve yapı tekniği yeniden düşünüldü.\nİstanbul’da cami, konut ve altyapı onarımları yapıldı.'],
        ['Toplumsal sonuç', 'Barınma, su ve gıda temini afet sonrasında öncelik oldu.\nEkonomik yaşam ve gündelik düzen aksadı.'],
        ['Karşılaştırma ölçütü', 'Afetleri can kaybı, ikincil tehlike ve yeniden inşa bakımından karşılaştır.\nFarkı yalnızca büyüklükle açıklama.'],
      ],
      not: 'Depremden sonra yangın veya tsunami varsa etkiler depremin şiddetiyle tek başına açıklanamaz.',
      iddialar: [
        ['Lizbon’da depremden sonra tsunami ve yangınlar da yıkımı artırdı.', true, 'İkincil tehlikeler can ve mal kaybını büyüttü.'],
        ['1766 depremi İstanbul’daki yapıları etkilememiştir.', false, 'Konutlar ve anıtsal yapılar zarar gördü.'],
        ['Afetlerin etkisi yalnızca sarsıntının büyüklüğüne bağlıdır.', false, 'Yapı, yerleşim ve ikincil tehlikeler de belirleyicidir.'],
        ['İki kentte de yeniden inşa ve barınma sorunu ortaya çıktı.', true, 'Yıkımın ardından onarım ve barınma gerekti.'],
      ],
      secimler: [
        ['Lizbon’da depremi izleyen kıyı tehlikesi neydi?', 'Tsunami', 'Kuraklık', 'Kıyıdaki dalgalar hasarı artırdı.'],
        ['1766 depremi hangi kenti etkiledi?', 'İstanbul', 'Lizbon', 'Lizbon depremi 1755’tedir.'],
        ['İki afeti karşılaştırırken hangisi incelenir?', 'Yeniden inşa', 'Yalnız tarihleri', 'Toplumsal ve mekânsal sonuçlara bakılır.'],
      ],
      kontrol: ['Depremin etkisini artırabilen etken?', 'İkincil tehlikeler', 'Yalnız takvim günü', 'Yangın ve tsunami toplam zararı artırabilir.'], kontrolKarti: 2,
    },
    {
      id: 'trh11-sanayi', ad: 'Sanayi Devrimi’nin Etkileri',
      kartlar: [
        ['Üretim değişti', 'Makine gücü ve fabrikalar el emeğine dayalı üretimi dönüştürdü.\nBüyük miktarda standart mal üretilebildi.'],
        ['Buhar ve ulaşım', 'Buhar gücü fabrikayı, demiryolunu ve gemiyi etkiledi.\nHam madde ile pazarlar arasındaki bağ hızlandı.'],
        ['Kentleşme', 'İş için kente göç arttı.\nKonut, sağlık ve çalışma koşullarında yeni sorunlar doğdu.'],
        ['Emek ilişkileri', 'Ücretli işçilik yaygınlaştı.\nUzun çalışma saatleri ve çocuk işçiliği hak arayışlarını güçlendirdi.'],
        ['Dünya ticareti', 'Sanayi devletleri ham madde ve pazar aradı.\nSömürgecilik ve uluslararası rekabet yoğunlaştı.'],
        ['Osmanlı’ya etki', 'Ucuz fabrika malları yerel atölyelerle rekabet etti.\nÜretimde ve dış ticarette baskı arttı.'],
      ],
      not: 'Sanayi Devrimi yalnızca yeni makine değil; göç, emek ve dünya ticaretinde dönüşümdür.',
      iddialar: [
        ['Makineleşme üretim miktarını artırdı.', true, 'Fabrika üretimi büyük ölçeğe ulaştı.'],
        ['Sanayi Devrimi kırdan kente göçü azaltmıştır.', false, 'Fabrika işleri göçü artırdı.'],
        ['Sanayi devletlerinin ham madde arayışı sömürgecilikle ilişkilidir.', true, 'Üretimin girdileri ve pazar ihtiyacı rekabeti büyüttü.'],
        ['Osmanlı atölyeleri fabrika mallarından hiç etkilenmemiştir.', false, 'Ucuz ithal mallar yerel üretimi zorladı.'],
      ],
      secimler: [
        ['Fabrika üretiminde hangi güç öne çıktı?', 'Makine ve buhar', 'Yalnız el emeği', 'Makineleşme üretimi dönüştürdü.'],
        ['Kent nüfusunu artıran neden?', 'İş için göç', 'Tarımda işlerin artması', 'Fabrikalar kentte iş olanağı sağladı.'],
        ['Sanayi devletleri neden ham madde aradı?', 'Üretimi beslemek için', 'Fabrikaları kapatmak için', 'Fabrikaların sürekli girdiye ihtiyacı vardı.'],
      ],
      kontrol: ['Sanayi Devrimi kentlerde neyi artırdı?', 'Ücretli işçiliği', 'Lonca sayısını', 'Fabrika işleri ücretli emeği yaygınlaştırdı.'], kontrolKarti: 4,
    },
  ],
  [
    {
      id: 'trh11-ihtilal', ad: 'Fransız İhtilali’nin Etkileri',
      kartlar: [
        ['1789’un nedenleri', 'Mali kriz, ayrıcalıklı zümreler ve temsil sorunu tepki doğurdu.\nAydınlanma düşüncesi değişim taleplerini besledi.'],
        ['Egemenlik anlayışı', 'Egemenliğin kaynağı olarak millet öne çıktı.\nMutlak monarşinin meşruiyeti sorgulandı.'],
        ['Hak ve yurttaşlık', 'Özgürlük ve eşitlik düşüncesi siyasal hak tartışmalarını büyüttü.\nUygulama herkese aynı anda yayılmadı.'],
        ['Milliyetçilik', 'Ortak kimlik ve bağımsızlık talepleri güçlendi.\nÇok uluslu devletler bu akımdan etkilendi.'],
        ['Avrupa’da savaşlar', 'İhtilal ve Napolyon savaşları fikirlerin yayılmasını hızlandırdı.\nSınırlar ve ittifaklar değişti.'],
        ['Osmanlı’ya yansıma', 'Milliyetçilik, Balkanlardaki ayrılıkçı hareketleri etkiledi.\nOsmanlıcılık ortak yurttaşlık arayışıydı.'],
      ],
      not: 'Milliyetçilik ile eşit yurttaşlık aynı şey değil; Osmanlı’da etkileri farklı siyasal arayışlar doğurdu.',
      iddialar: [
        ['İhtilal, egemenliğin kaynağını tartışmaya açtı.', true, 'Millet egemenliği düşüncesi güçlendi.'],
        ['Milliyetçilik çok uluslu devletleri hiç etkilemedi.', false, 'Ayrılıkçı talepleri güçlendirdi.'],
        ['Osmanlıcılık farklı toplulukları ortak yurttaşlıkta birleştirmeyi amaçladı.', true, 'Dağılmayı önlemeye dönük bir düşünceydi.'],
        ['İhtilalin bütün hakları tüm topluma hemen eşit uygulandı.', false, 'Hakların kapsamı ve uygulanması zamanla değişti.'],
      ],
      secimler: [
        ['1789’da hangi egemenlik fikri güçlendi?', 'Millet egemenliği', 'Hanedan ayrıcalığı', 'Siyasi meşruiyet halka dayandırıldı.'],
        ['Çok uluslu devletleri zorlayan akım?', 'Milliyetçilik', 'Merkantilizm', 'Bağımsızlık taleplerini artırdı.'],
        ['İhtilalin ekonomik nedenlerinden biri?', 'Mali kriz', 'Üretim fazlası', 'Fransa’nın borç ve vergi sorunları vardı.'],
      ],
      kontrol: ['Osmanlıcılık neyi hedefledi?', 'Ortak yurttaşlık', 'Ayrı hanedanlar', 'Farklı toplulukları ortak kimlikte tutmayı amaçladı.'], kontrolKarti: 6,
    },
    {
      id: 'trh11-donusum', ad: '1789-1908 Siyasi ve İdari Dönüşüm',
      kartlar: [
        ['Nizam-ı Cedid', 'III. Selim yeni ordu ve hazine düzeni kurmaya çalıştı.\nKabakçı Mustafa İsyanı yenilikleri durdurdu.'],
        ['II. Mahmud', '1826’da Yeniçeri Ocağı kaldırıldı.\nMerkezî yönetim ve yeni askerî kurumlar güçlendirildi.'],
        ['Tanzimat (1839)', 'Gülhane Hattı can, mal ve namus güvenliğini vurguladı.\nVergi ve askerlikte kurallı uygulama hedeflendi.'],
        ['Islahat (1856)', 'Gayrimüslim tebaanın haklarına ilişkin yeni düzenlemeler getirildi.\nAvrupa devletlerinin baskısı da etkiliydi.'],
        ['Meşrutiyet (1876)', 'Kanun-ı Esasi ilan edildi, Meclis-i Mebusan açıldı.\nPadişahın yetkileri tümüyle kaldırılmadı.'],
        ['1908’e uzanan yol', '1877–78 Osmanlı-Rus Savaşı ağır kayıplar getirdi.\n1908’de II. Meşrutiyet ile meclis yeniden açıldı.'],
      ],
      not: 'Tanzimat, Islahat ve Meşrutiyet aynı belge değil; hak, eşitlik ve temsil vurguları farklıdır.',
      iddialar: [
        ['Yeniçeri Ocağı II. Mahmud döneminde kaldırıldı.', true, '1826 Vakay-ı Hayriye olarak anılır.'],
        ['Kanun-ı Esasi 1839’da ilan edilmiştir.', false, '1839 Tanzimat; anayasa 1876’dadır.'],
        ['Tanzimat Fermanı can ve mal güvenliğini vurguladı.', true, 'Gülhane Hattı’nın temel ilkelerindendir.'],
        ['1908’de meclis kalıcı olarak kapatıldı.', false, 'II. Meşrutiyet ile yeniden açıldı.'],
      ],
      secimler: [
        ['İlk Osmanlı anayasası hangisidir?', 'Kanun-ı Esasi', 'Tanzimat Fermanı', '1876’da Kanun-ı Esasi ilan edildi.'],
        ['Yeniçeri Ocağı hangi yılda kaldırıldı?', '1826', '1876', 'II. Mahmud dönemindeki 1826 düzenlemesidir.'],
        ['Nizam-ı Cedid hangi padişahla ilişkilidir?', 'III. Selim', 'II. Abdülhamid', 'Yeni ordu ve hazine düzeni III. Selim’e aittir.'],
      ],
      kontrol: ['Can ve mal güvenliğini vurgulayan belge?', 'Tanzimat Fermanı', 'Kanun-ı Esasi', '1839 Gülhane Hattı bu güvenliği öne çıkardı.'], kontrolKarti: 3,
    },
    {
      id: 'trh11-bilim', ad: '1789-1908 Bilim, Sanat ve Teknoloji',
      kartlar: [
        ['Yeni eğitim kurumları', 'Askerî ve sivil okullar teknik uzman yetiştirdi.\nTıp ve mühendislik eğitimi kurumsallaştı.'],
        ['Ulaşım ağı', 'Demiryolu ve buharlı gemi yolculuk ile taşımayı hızlandırdı.\nHattın geçtiği yerlerin ekonomisi etkilendi.'],
        ['İletişim', 'Telgraf merkez ile taşra arasındaki haberleşmeyi hızlandırdı.\nYönetim ve ordu için önemliydi.'],
        ['Basın ve kamuoyu', 'Gazete ve dergiler bilgi dolaşımını artırdı.\nSiyasi fikirler daha geniş çevrelere ulaştı.'],
        ['Edebiyatta yenilik', 'Tanzimat’la roman ve tiyatro gibi türler gelişti.\nÇeviri eserler yeni anlatım biçimleri taşıdı.'],
        ['Mimari ve sanat', 'Batı etkili üsluplar kent yapılarında görüldü.\nGeleneksel biçimler de yaşamayı sürdürdü.'],
      ],
      not: 'Teknoloji yalnızca araç eklemedi; haberleşme hızı yönetim ilişkilerini de değiştirdi.',
      iddialar: [
        ['Telgraf haberleşme süresini kısalttı.', true, 'Merkez ile taşra arasındaki iletişim hızlandı.'],
        ['Demiryolu taşımacılığı etkilemedi.', false, 'Mal ve yolcu taşınmasını değiştirdi.'],
        ['Gazeteler fikirlerin yayılmasına katkı sağladı.', true, 'Basın kamuoyu oluşumunda rol oynadı.'],
        ['Tanzimat döneminde roman ve tiyatro tümüyle yasaklandı.', false, 'Bu türlerde eserler verildi.'],
      ],
      secimler: [
        ['Merkez-taşra haberleşmesini hızlandıran araç?', 'Telgraf', 'Kervansaray', 'Telgraf uzak mesafeye hızlı haber iletti.'],
        ['Tanzimat edebiyatında gelişen tür?', 'Roman', 'Destan', 'Roman yeni anlatım türlerinden biridir.'],
        ['Teknik uzman yetiştiren kurum?', 'Mühendislik okulu', 'Lonca çarşısı', 'Yeni okullar teknik eğitim verdi.'],
      ],
      kontrol: ['Gazete hangi toplumsal alanı etkiledi?', 'Kamuoyunu', 'Yalnız tarımı', 'Fikirlerin dolaşımı kamuoyunu güçlendirdi.'], kontrolKarti: 4,
    },
    {
      id: 'trh11-sanayilesme', ad: 'Osmanlı’da Sanayileşme Çabaları',
      kartlar: [
        ['Sorunun kaynağı', 'Avrupa fabrikalarının ucuz malları yerel üreticiyi zorladı.\nSermaye ve teknoloji eksikliği de etkiliydi.'],
        ['Ticaret düzeni', 'Düşük gümrüklerle ithal malların rekabeti arttı.\n1838 Balta Limanı düzenlemesi bu bağlamda önemlidir.'],
        ['Devlet fabrikaları', 'Devlet dokuma ve silah gibi alanlarda fabrika kurdu.\nAma süreklilik için pazar ve uzmanlık gerekiyordu.'],
        ['Islah-ı Sanayi', '1860’larda yerli üretimi geliştirmeye dönük girişimler yapıldı.\nEsnafı yeni üretim koşullarına uyarlamak amaçlandı.'],
        ['Borç ve bağımlılık', 'Dış borçlar mali hareket alanını daralttı.\n1881 Düyun-ı Umumiye bazı gelirleri denetledi.'],
        ['Çözüm düşünmek', 'Eğitim, ulaşım, sermaye ve koruyucu düzenleme birlikte ele alınmalı.\nTek bir fabrika kurmak yeterli olmaz.'],
      ],
      not: 'Sanayileşme için bina değil, makine, sermaye, uzman ve pazarın birlikte işlemesi gerekir.',
      iddialar: [
        ['Ucuz ithal fabrika malları yerel atölyeleri zorladı.', true, 'Rekabet koşulları üreticilerin aleyhine değişti.'],
        ['Osmanlı Devleti hiç fabrika kurmadı.', false, 'Devlet çeşitli alanlarda fabrikalar kurdu.'],
        ['Düyun-ı Umumiye mali bağımsızlığı güçlendirdi.', false, 'Bazı gelirler dış alacaklıların denetimine geçti.'],
        ['Islah-ı Sanayi girişimleri yerli üretimi geliştirmeyi amaçladı.', true, 'Esnaf ve üretim düzeni uyarlanmaya çalışıldı.'],
      ],
      secimler: [
        ['1838 ticaret düzenlemesinin adı?', 'Balta Limanı', 'Karlofça', 'Balta Limanı ticaret ilişkilerini etkiledi.'],
        ['1881’de gelirleri denetleyen kurum?', 'Düyun-ı Umumiye', 'Tulumbacı Ocağı', 'Dış borçların ödenmesi için kuruldu.'],
        ['Sanayi için hangi ikili gerekir?', 'Sermaye ve uzmanlık', 'Yalnız bina ve tabela', 'Üretim sürdürülebilir bir sistem ister.'],
      ],
      kontrol: ['Ucuz ithal mal kime baskı yaptı?', 'Yerli üreticiye', 'Yalnız elçilere', 'Yerel atölyeler fabrika malıyla yarıştı.'], kontrolKarti: 1,
    },
  ],
  [
    {
      id: 'trh11-siyasi', ad: '1908-1918 Siyasi ve Askerî Gelişmeler',
      kartlar: [
        ['II. Meşrutiyet (1908)', 'Anayasal yönetim yeniden işlerlik kazandı.\nMeclis açıldı, siyasi yaşam canlandı.'],
        ['31 Mart Olayı (1909)', 'Meşrutiyete karşı ayaklanma Hareket Ordusu tarafından bastırıldı.\nArdından II. Abdülhamid tahttan indirildi.'],
        ['Trablusgarp (1911–12)', 'İtalya’nın saldırısına karşı Osmanlı subayları yerel direnişi örgütledi.\nUşi Antlaşması’yla bölge İtalya’ya bırakıldı.'],
        ['Balkan Savaşları', '1912–13 savaşları Rumeli’de büyük toprak kaybına yol açtı.\nEdirne ikinci savaşta geri alındı.'],
        ['Bâbıâli Baskını (1913)', 'İttihat ve Terakki yönetimde etkisini artırdı.\nSiyasal iktidar dengesi değişti.'],
        ['I. Dünya Savaşı', 'Osmanlı 1914’te savaşa girdi.\nÇanakkale direnişi başarı, birçok cephe ise ağır kayıp getirdi; 1918 Mondros ile savaş bitti.'],
      ],
      not: 'Edirne Birinci Balkan Savaşı’nda kaybedildi, İkinci Balkan Savaşı’nda geri alındı.',
      iddialar: [
        ['II. Meşrutiyet ile meclis yeniden açıldı.', true, '1908’de anayasal düzen canlandırıldı.'],
        ['Trablusgarp Savaşı Yunanistan’a karşı yapıldı.', false, 'Osmanlı, İtalya’ya karşı savaştı.'],
        ['Edirne İkinci Balkan Savaşı’nda geri alındı.', true, 'Balkan devletlerinin anlaşmazlığı fırsat yarattı.'],
        ['Mondros Ateşkesi 1914’te imzalandı.', false, 'Savaşın sonunda, 1918’de imzalandı.'],
      ],
      secimler: [
        ['31 Mart Olayı’nı bastıran güç?', 'Hareket Ordusu', 'Tulumbacı Ocağı', 'Ayaklanma Hareket Ordusu tarafından bastırıldı.'],
        ['Trablusgarp’ı bırakan antlaşma?', 'Uşi', 'Belgrad', '1912 Uşi Antlaşması’yla bırakıldı.'],
        ['1913’te iktidar dengesini değiştiren olay?', 'Bâbıâli Baskını', 'Patrona Halil İsyanı', 'Bâbıâli Baskını İttihat ve Terakki’nin etkisini artırdı.'],
      ],
      kontrol: ['Osmanlı savaşta hangi cephede direniş başarısı gösterdi?', 'Çanakkale', 'Trablusgarp', 'Çanakkale I. Dünya Savaşı cephesidir.'], kontrolKarti: 6,
    },
    {
      id: 'trh11-goc', ad: '1908-1918 Göçler ve Salgınlar',
      kartlar: [
        ['Göçün nedeni', 'Balkan Savaşları ve I. Dünya Savaşı sivilleri yerinden etti.\nGüvenlik kaybı ve zorunlu göç iç içeydi.'],
        ['Göçün yönü', 'Rumeli’den Anadolu’ya büyük nüfus hareketleri yaşandı.\nKent ve kırsal yerleşmelerin nüfusu değişti.'],
        ['Barınma sorunu', 'Yeni gelenler için konut, gıda ve iş gerekiyordu.\nDevlet ve yerel toplum yardım örgütledi.'],
        ['Sağlık tehdidi', 'Kalabalık ve yetersiz temizlik bulaşıcı hastalık riskini artırdı.\nGöç yolları da sağlık hizmetini zorladı.'],
        ['Toplumsal etki', 'Aileler parçalandı, geçim düzenleri değişti.\nGöçmenler gittikleri yerin kültür ve ekonomisini etkiledi.'],
        ['Kaynağa bakış', 'Nüfus kayıtları ve anılar farklı ayrıntılar verir.\nOlayı anlamak için birden fazla kaynağı karşılaştır.'],
      ],
      not: 'Göç yalnızca nüfus sayısı değildir; barınma, sağlık ve geçim sorunlarını birlikte getirir.',
      iddialar: [
        ['Balkan Savaşları Anadolu’ya göçü artırdı.', true, 'Rumeli’den büyük nüfus hareketi yaşandı.'],
        ['Kalabalık barınma koşulları salgın riskini azaltır.', false, 'Bulaşma ve temiz su sorunu riski artırır.'],
        ['Göç, yerleşmelerin nüfus yapısını değiştirebilir.', true, 'Gelen ve giden nüfus mekânı etkiler.'],
        ['Göçmenler için barınma ve geçim sorunu oluşmadı.', false, 'Konut, iş ve gıda temel ihtiyaçtı.'],
      ],
      secimler: [
        ['Rumeli’den göçün yönü neresiydi?', 'Anadolu', 'Lizbon', 'Savaşlar Anadolu’ya göçü artırdı.'],
        ['Salgın riskini artıran durum?', 'Kalabalık ve kirli barınma', 'Temiz suya erişim', 'Kalabalık ve temizlik yetersizliği bulaşmayı kolaylaştırır.'],
        ['Göçü anlamak için hangisi karşılaştırılır?', 'Kayıtlar ve anılar', 'Yalnız bir söylenti', 'Farklı kaynaklar birbirini tamamlar.'],
      ],
      kontrol: ['Göçten sonra ilk ihtiyaçlardan biri?', 'Barınma', 'Yeni sınır çizmek', 'Yerinden edilen insanların güvenli kalacak yere ihtiyacı vardır.'], kontrolKarti: 3,
    },
    {
      id: 'trh11-katki', ad: 'Osmanlı’nın İnsanlık Tarihine Katkıları',
      kartlar: [
        ['Mimari miras', 'Köprü, kervansaray ve külliyeler toplumsal ihtiyaçlara yanıt verdi.\nMimar Sinan’ın eserleri yapı tekniğiyle de önemlidir.'],
        ['Vakıf düzeni', 'Vakıflar eğitim, sağlık ve yoksullara yardım hizmetlerini destekledi.\nGelir ile hizmet arasında süreklilik kuruldu.'],
        ['Tıp ve sağlık', 'Darüşşifalar tedavi ve bakım sundu.\nTıp bilgisi başka coğrafyalardaki birikimle etkileşim içinde gelişti.'],
        ['Haritacılık', 'Pîrî Reis’in haritaları denizcilik bilgisini bir araya getirdi.\nHarita dönemin gözlemiyle değerlendirilmelidir.'],
        ['Bilim ve sanat', 'Gözlemevleri, hat, minyatür ve musiki farklı bilgi alanlarına katkı sağladı.\nTek bir eser tüm dönemi temsil etmez.'],
        ['Mirası değerlendirme', 'Katkıyı tarihî bağlam ve kaynaklarla açıkla.\nGünümüz kurumlarını geçmişte aynen varmış gibi gösterme.'],
      ],
      not: 'Bir eseri övmek yerine ne işe yaradığını, nasıl üretildiğini ve kimlere ulaştığını sor.',
      iddialar: [
        ['Vakıflar sağlık ve eğitim hizmetlerini destekledi.', true, 'Gelirleri toplumsal hizmetlere ayrılabildi.'],
        ['Pîrî Reis denizcilik haritalarıyla tanınır.', true, 'Haritaları dönemin denizcilik bilgisini taşır.'],
        ['Darüşşifalar yalnızca askerî kışlaydı.', false, 'Tedavi ve bakım sunan sağlık kurumlarıydı.'],
        ['Osmanlı mirası yalnızca saray yapılarından oluşur.', false, 'Köprü, külliye, vakıf ve sanat eserleri de vardır.'],
      ],
      secimler: [
        ['Denizcilik haritalarıyla tanınan kişi?', 'Pîrî Reis', 'Nevşehirli Damat İbrahim Paşa', 'Pîrî Reis denizcilik bilgisiyle öne çıkar.'],
        ['Gelirini kamu hizmetine ayıran kurum?', 'Vakıf', 'Kapitülasyon', 'Vakıflar hizmetleri finanse edebildi.'],
        ['Tarihî katkı nasıl incelenir?', 'Bağlam ve kaynaklarla', 'Yalnız övgüyle', 'İşlev ve kanıt birlikte değerlendirilir.'],
      ],
      kontrol: ['Darüşşifa ne sunardı?', 'Tedavi ve bakım', 'Deniz ticareti', 'Darüşşifa sağlık kurumudur.'], kontrolKarti: 3,
    },
  ],
]

let sira = 0
export const tarih11 = program('tarih', 11, 'Değişen dünyada Osmanlı’nın son yüzyılları', [
  tema('trh11-t1', 'Değişen Dünyada Osmanlı Devleti (1683-1789)', taslaklar[0].map((t) => onBirinciSinifKonusu(t, sira++))),
  tema('trh11-t2', 'Dönüşüm Sürecinde Osmanlı (1789-1908)', taslaklar[1].map((t) => onBirinciSinifKonusu(t, sira++))),
  tema('trh11-t3', 'Savaşlar Sarmalında Osmanlı (1908- 1918)', taslaklar[2].map((t) => onBirinciSinifKonusu(t, sira++))),
])
