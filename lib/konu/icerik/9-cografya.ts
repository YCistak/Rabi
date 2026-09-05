import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Coğrafya — Maarif Modeli.
 *
 * Yedi tema. Eski programın "Doğal Sistemler / Beşerî Sistemler / Küresel
 * Ortam" üçlüsü değil, programın kendi tema adları kullanılıyor;
 * "Mekânsal Bilgi Teknolojileri" ve "Afetler ve Sürdürülebilir Çevre"
 * Maarif ile ayrı tema oldu.
 */
export const cografya9 = program('cografya', 9, 'Coğrafyanın doğasından küresel bağlantılara', [
  tema('cog9-t1', 'Coğrafyanın Doğası', [
    konu('cog9-dogasi', 'Coğrafyanın Konusu ve Bölümleri', [
      kart(
        'Coğrafya neyi inceler?',
        'İnsanla doğal ortam arasındaki etkileşimi ve bunun mekâna yansımasını inceler. Sorusu her zaman "nerede ve neden orada".',
      ),
      kart(
        'İki ana bölüm',
        'Fizikî coğrafya doğal ortamı (yer şekilleri, iklim, su, toprak), beşerî coğrafya insan etkinliklerini (nüfus, yerleşme, ekonomi) inceler.',
      ),
      kart(
        'İnsan-doğa etkileşimi',
        'Doğa insanı sınırlar, insan doğayı değiştirir. Baraj, tünel ve sulama bu etkileşimin doğrudan izleridir.',
      ),
      kart(
        'Coğrafya niçin öğrenilir?',
        'Yer seçimi, afet önlemi, tarım planlaması ve kaynak yönetimi hep coğrafi karar gerektirir.',
      ),
    ]),
  ]),
  tema('cog9-t2', 'Mekânsal Bilgi Teknolojileri', [
    konu('cog9-harita', 'Harita Bilgisi', [
      kart(
        'Harita nedir?',
        'Yeryüzünün kuş bakışı görünümünün ölçek kullanılarak düzleme aktarılması. Ölçek yoksa o çizim harita değil, krokidir.',
      ),
      kart(
        'Ölçek türleri',
        'Kesir ölçek 1/500.000 gibi yazılır, çizgi ölçek çubuk hâlindedir. Paydası büyüdükçe ölçek küçülür.',
      ),
      kart(
        'Büyük ve küçük ölçek',
        'Büyük ölçekli haritada ayrıntı çok, kapsanan alan küçüktür. Küçük ölçekli haritada tam tersi.',
      ),
      kart(
        'Projeksiyon',
        'Küre düzleme hatasız açılamaz. Silindirik projeksiyon ekvator çevresini, konik orta enlemleri, düzlem kutupları daha doğru gösterir.',
      ),
      kart(
        'İzohips (eş yükselti eğrisi)',
        'Aynı yükseltideki noktaları birleştirir. Eğriler sıklaştıkça eğim artar; iç içe halkalar tepeyi ya da çukuru gösterir.',
      ),
    ]),
    konu('cog9-konum', 'Türkiye’nin Coğrafi Konumu', [
      kart(
        'Matematik konum',
        'Türkiye 36°–42° kuzey paralelleri, 26°–45° doğu meridyenleri arasındadır.',
      ),
      kart(
        'Paralelin sonuçları',
        'Orta kuşakta olduğu için dört mevsim yaşanır, güneyi kuzeyinden sıcaktır ve gölge boyu güneye gidildikçe kısalır.',
      ),
      kart(
        'Meridyenin sonuçları',
        '19 meridyen geçtiği için doğusuyla batısı arasında 76 dakikalık yerel saat farkı vardır. Tek saat dilimi kullanılır.',
      ),
      kart(
        'Özel konum',
        'Üç tarafı denizlerle çevrili, boğazlara sahip, Asya ile Avrupa arasında; enerji yollarının üzerindedir.',
      ),
    ]),
    konu('cog9-cbs', 'Coğrafi Bilgi Sistemleri', [
      kart(
        'CBS nedir?',
        'Konuma bağlı veriyi toplayan, saklayan, çözümleyen ve haritalayan sistem. "Nerede" sorusuna veriyle cevap verir.',
      ),
      kart(
        'Katman mantığı',
        'Yol, akarsu, nüfus ve arazi kullanımı ayrı katmanlardır; üst üste bindirilerek yeni bilgi üretilir.',
      ),
      kart(
        'GPS ve uzaktan algılama',
        'GPS konum belirler, uzaktan algılama uydu ve hava görüntüsüyle yüzey hakkında veri toplar. İkisi CBS’yi besler.',
      ),
      kart(
        'Nerede kullanılır?',
        'Afet risk haritaları, kent planlaması, orman yangını takibi, tarım ve ulaşım güzergâhı seçimi.',
      ),
    ]),
  ]),
  tema('cog9-t3', 'Doğal Sistemler ve Süreçler', [
    konu('cog9-atmosfer', 'Atmosfer ve Hava Olayları', [
      kart(
        'Hava durumu ve iklim',
        'Hava durumu kısa süreli ve dar alanlıdır, iklim uzun yıllara (en az 30 yıl) dayanan ortalamadır.',
      ),
      kart(
        'Atmosferin katmanları',
        'Hava olayları troposferde olur. Ozon tabakası stratosferdedir ve zararlı ışınları süzer.',
      ),
      kart(
        'Sıcaklığı etkileyen etmenler',
        'Güneş ışınlarının geliş açısı, yükselti, denize uzaklık, bakı, nem ve rüzgârlar.',
      ),
      kart(
        'Yükselti ve sıcaklık',
        'Troposferde her 100 metrede sıcaklık ortalama 0,5 °C düşer. Dağ zirvelerinin karlı olmasının sebebi.',
      ),
      kart(
        'Bakı etkisi',
        'Kuzey yarım kürede güneye bakan yamaçlar daha sıcaktır; tarım ve yerleşme çoğunlukla o yamaçlarda toplanır.',
      ),
    ]),
    konu('cog9-basinc', 'Basınç ve Rüzgârlar', [
      kart(
        'Basınç nasıl değişir?',
        'Sıcaklık artınca hava genleşir, yükselir ve alçak basınç oluşur. Soğuk havada yüksek basınç görülür.',
      ),
      kart(
        'Rüzgârın yönü',
        'Rüzgâr her zaman yüksek basınçtan alçak basınca doğru eser. Basınç farkı arttıkça hızı artar.',
      ),
      kart(
        'Sürekli rüzgârlar',
        'Alizeler, batı rüzgârları ve kutup rüzgârları. Yıl boyu aynı yönde eserler.',
      ),
      kart(
        'Yerel rüzgârlar',
        'Meltemler gün içinde yön değiştirir: gündüz denizden karaya, gece karadan denize eser.',
      ),
      kart(
        'Föhn',
        'Dağı aşarken nemini bırakan hava, öteki yamaçtan sıcak ve kuru iner. İnen yamaçta sıcaklık belirgin artar.',
      ),
    ]),
    konu('cog9-nem', 'Nem ve Yağış', [
      kart(
        'Mutlak ve bağıl nem',
        'Mutlak nem havadaki su buharı miktarıdır. Bağıl nem, havanın taşıyabileceğinin yüzde kaçını taşıdığıdır.',
      ),
      kart(
        'Yoğunlaşma',
        'Hava soğuyup doyma noktasına gelince su buharı yoğunlaşır; çiy, kırağı, sis ve bulut böyle oluşur.',
      ),
      kart(
        'Yağış türleri',
        'Yamaç (orografik) yağış dağ yamacında, cephe yağışı sıcak ve soğuk hava kütlesinin karşılaşmasında, konveksiyon yağışı ısınan havanın yükselmesiyle oluşur.',
      ),
      kart(
        'Nem ve sıcaklık farkı',
        'Nemli havada günlük sıcaklık farkı azdır. Çöllerde nem az olduğu için gece ile gündüz arasındaki fark çok yüksektir.',
      ),
    ]),
    konu('cog9-iklim', 'İklim Tipleri ve İklim Değişikliği', [
      kart(
        'Sıcak kuşak iklimleri',
        'Ekvatoral iklimde yıl boyu sıcak ve yağışlı, savanda yazı yağışlı-kışı kurak, çölde her mevsim kuraktır.',
      ),
      kart(
        'Orta kuşak iklimleri',
        'Akdeniz ikliminde yaz kurak-kış yağışlı; okyanus ikliminde yıl boyu yağışlı; karasal iklimde kış sert ve yağış azdır.',
      ),
      kart(
        'Türkiye’nin iklimleri',
        'Kıyı kesimlerde Akdeniz ve Karadeniz iklimi, iç kesimlerde karasal iklim görülür. Dağların uzanışı bu ayrımı belirler.',
      ),
      kart(
        'Sera etkisi',
        'Atmosferdeki gazların yer yüzeyinden yansıyan ısıyı tutmasıdır. Doğal bir olaydır; sorun insan kaynaklı olarak güçlenmesi.',
      ),
      kart(
        'İklim değişikliğinin sonuçları',
        'Buzulların erimesi, deniz seviyesinin yükselmesi, kuraklık, aşırı hava olaylarının sıklaşması ve tarım kuşaklarının kayması.',
      ),
    ]),
  ]),
  tema('cog9-t4', 'Beşerî Sistemler ve Süreçler', [
    konu('cog9-nufus-dagilis', 'Nüfusun Dağılışı', [
      kart(
        'Doğal etmenler',
        'Ilıman iklim, verimli toprak, su kaynağı ve düz arazi nüfusu çeker. Çöl, kutup ve yüksek dağlar seyrek nüfusludur.',
      ),
      kart(
        'Beşerî etmenler',
        'Sanayi, ticaret, ulaşım ve turizm nüfusu toplar. Türkiye’de İstanbul, İzmit ve İzmir bu yüzden yoğundur.',
      ),
      kart(
        'Aritmetik nüfus yoğunluğu',
        'Toplam nüfus / toplam alan. Arazinin kullanılabilir olup olmadığını göstermez, bu yüzden yanıltıcı olabilir.',
      ),
      kart(
        'Tarımsal nüfus yoğunluğu',
        'Kırsal nüfus / tarım alanı. Bu değer yüksekse tarım alanı yetersiz ya da verim düşük demektir.',
      ),
    ]),
    konu('cog9-nufus-degisim', 'Nüfusun Değişimi', [
      kart(
        'Doğal nüfus artışı',
        'Doğum sayısı − ölüm sayısı. Göç hesaba katılırsa gerçek artış bulunur.',
      ),
      kart(
        'Demografik dönüşüm',
        'Doğum ve ölüm oranları yüksek olan toplum, gelişme ile önce ölümlerin sonra doğumların düştüğü bir düzene geçer.',
      ),
      kart(
        'Nüfus piramitleri',
        'Geniş tabanlı piramit genç ve hızlı artan nüfusu, dar tabanlı piramit yaşlanan nüfusu gösterir.',
      ),
      kart(
        'Genç ve yaşlı nüfus',
        'Genç nüfus iş gücü potansiyelidir ama eğitim ve istihdam yükü getirir. Yaşlı nüfus sağlık ve emeklilik yükünü artırır.',
      ),
    ]),
    konu('cog9-goc', 'Göçler', [
      kart(
        'İtici ve çekici güçler',
        'İşsizlik, kuraklık, savaş ve toprak yetersizliği iter; iş imkânı, eğitim ve güvenlik çeker.',
      ),
      kart(
        'İç ve dış göç',
        'İç göç ülke içinde nüfusu yeniden dağıtır, ülke nüfusunu değiştirmez. Dış göç ülke nüfusunu değiştirir.',
      ),
      kart(
        'Göçün sonuçları',
        'Veren yerde nüfus azalır ve yaşlanır; alan yerde çarpık kentleşme, altyapı yetersizliği ve işsizlik görülür.',
      ),
      kart(
        'Mevsimlik göç',
        'Tarım işçiliği ve yaylacılık gibi geçici hareketler. Kalıcı olmadığı için nüfus kaydını değiştirmez.',
      ),
    ]),
  ]),
  tema('cog9-t5', 'Ekonomik Faaliyetler ve Etkileri', [
    konu('cog9-ekonomi', 'Ekonomik Faaliyetler', [
      kart(
        'Üç sektör',
        'Birincil doğadan doğrudan alır (tarım, madencilik), ikincil işler (sanayi), üçüncül hizmet üretir (ticaret, turizm, eğitim).',
      ),
      kart(
        'Gelişmişlik göstergesi',
        'Gelişmiş ülkelerde hizmet sektörünün payı yüksektir; birincil sektörde çalışan oranı yüksekse ülke gelişmekte olan sayılır.',
      ),
      kart(
        'Coğrafi etmenler',
        'İklim ve toprak tarımı, yer altı kaynakları madenciliği, ulaşım ve pazar yakınlığı sanayiyi belirler.',
      ),
      kart(
        'Ekonominin çevreye etkisi',
        'Madencilik arazi bozar, sanayi hava ve suyu kirletir, aşırı sulama toprağı tuzlandırır.',
      ),
    ]),
  ]),
  tema('cog9-t6', 'Afetler ve Sürdürülebilir Çevre', [
    konu('cog9-afet-kavram', 'Tehlike, Risk ve Afet', [
      kart(
        'Üçü ayrı kavram',
        'Tehlike zarar verme ihtimali olan olay, risk beklenen zararın büyüklüğü, afet ise toplumun kendi imkânlarıyla baş edemediği olaydır.',
      ),
      kart(
        'Deprem afet değildir',
        'Boş bir çölde olan deprem afet sayılmaz. Afeti yapan şey olayın kendisi değil, insanla karşılaşmasıdır.',
      ),
      kart(
        'Doğal ve beşerî afetler',
        'Deprem, sel ve heyelan doğal; endüstriyel kaza, orman yangını ve nükleer sızıntı büyük ölçüde insan kaynaklıdır.',
      ),
    ]),
    konu('cog9-afet-turleri', 'Afet Türleri', [
      kart(
        'Deprem',
        'Yer kabuğundaki enerjinin fay hattı boyunca boşalmasıdır. Türkiye’nin büyük bölümü aktif fay kuşağı üzerindedir.',
      ),
      kart(
        'Heyelan',
        'Eğimli arazide suya doymuş toprağın kayması. Karadeniz’de yağış ve eğim yüzünden sık görülür.',
      ),
      kart(
        'Sel ve taşkın',
        'Ani ve şiddetli yağış, dere yataklarının yapılaşmaya açılmasıyla afete dönüşür.',
      ),
      kart(
        'Çığ ve kuraklık',
        'Çığ dik ve karlı yamaçlarda, ağaçsızlaşmayla artar. Kuraklık yavaş gelişen ama en geniş alanı etkileyen afettir.',
      ),
    ]),
    konu('cog9-afet-yonetimi', 'Bütüncül Afet Yönetimi', [
      kart(
        'Dört aşama',
        'Zarar azaltma, hazırlık, müdahale ve iyileştirme. Döngüseldir: iyileştirmede öğrenilenler zarar azaltmaya geri döner.',
      ),
      kart(
        'Kriz değil risk yönetimi',
        'Eski anlayış afet olduktan sonra müdahale ediyordu. Bütüncül yönetim, afetten **önce** riski azaltmayı esas alır.',
      ),
      kart(
        'Zarar azaltma örnekleri',
        'Yapı denetimi, zemin etüdü, dere yatağına yapı yasağı, ağaçlandırma ve erken uyarı sistemleri.',
      ),
      kart(
        'Toplum hazırlığı',
        'Afet çantası, toplanma alanı bilgisi ve tatbikat. Hazırlıklı toplumda aynı deprem daha az kayıpla atlatılır.',
      ),
    ]),
  ]),
  tema('cog9-t7', 'Bölgeler, Ülkeler ve Küresel Bağlantılar', [
    konu('cog9-bolge', 'Bölge Kavramı', [
      kart(
        'Bölge nedir?',
        'Belirli bir ölçüte göre kendi içinde benzerlik gösteren, çevresinden ayrılan alandır. Ölçüt değişirse sınır da değişir.',
      ),
      kart(
        'Sınırlar değişkendir',
        'Coğrafi bölge sınırları siyasi sınırlar gibi kesin değildir; ölçüt seçimine bağlı olduğu için kalıcı da değildir.',
      ),
      kart(
        'Bölge türleri',
        'Doğal bölge (iklim, yer şekli), beşerî bölge (nüfus, kültür), ekonomik bölge (tarım, sanayi, turizm).',
      ),
      kart(
        'Ölçek farkı',
        'Bölge kıtasal ölçekte de olabilir mahalle ölçeğinde de. Kapsam, sorulan soruya göre belirlenir.',
      ),
      kart(
        'Küresel bağlantılar',
        'Ticaret yolları, enerji hatları ve iletişim ağları uzak bölgeleri birbirine bağlar; bir bölgedeki kriz ötekini etkiler.',
      ),
    ]),
  ]),
])
