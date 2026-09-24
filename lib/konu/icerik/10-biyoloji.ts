import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 10. sınıf Biyoloji — Maarif Modeli.
 *
 * İki tema: **Enerji** ve **Ekoloji**. Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski programda 10. sınıfta olan **kalıtım** Maarif'te burada yok; bu
 * sınıfın tamamı enerji dönüşümleri ve ekoloji üzerine.
 */
export const biyoloji10 = program('biyoloji', 10, 'Enerjiden ekosisteme', [
  tema('byl10-t1', 'Enerji', [
    konu('byl10-enerji-onem', 'Canlılık İçin Enerjinin Önemi', [
      kart(
        'Neden enerji gerekir?',
        'Enerji isteyen işler:\n- Büyüme ve onarım\n- Madde taşınması\n- Hareket\nEnerji kesilirse hücre düzenini koruyamaz.',
      ),
      kart(
        'ATP nedir?',
        'Hücrenin kullanıma hazır enerji birimidir.\nYapısı: adenin + riboz + üç fosfat',
      ),
      kart(
        'Enerji nerede saklı?',
        'Fosfatlar arasındaki bağlarda saklıdır.\nSon fosfat koptuğunda açığa çıkan enerji hücre işlerinde kullanılır.',
      ),
      kart(
        'ATP depolanmaz',
        'Hücre ATP’yi biriktirmez, ihtiyaç oldukça üretir.\nAsıl depo, besin moleküllerinin kendisidir.',
        undefined,
        { not: 'Vücutta anlık ATP birkaç saniye yeter; depo glikojen ve yağ. \'Enerji ATP olarak depolanır\' şıkkı yanlış.' },
      ),
      kart(
        'Döngü',
        '- ATP parçalanır → ADP + fosfat, enerji açığa çıkar.\n- Solunumla ADP yeniden ATP’ye çevrilir.\nBu döngü hiç durmaz.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'ATP', alt: 'enerji hazır' },
            { ad: 'ADP + P', alt: 'enerji kullanıldı' },
          ],
        },
      ),
      kart(
        'Neden ATP, doğrudan besin değil?',
        'Besindeki enerji büyük ve kullanışsız bir pakettir.\nATP, hücrenin her işine yetecek büyüklükte **bozuk para** gibidir.',
      ),
    ], [
      soru('ATP, hücrenin doğrudan kullanabildiği enerji molekülüdür.', true, 'Besindeki enerji önce ATP ye çevriliyor.'),
      soru('Hücre, ihtiyaç duyacağı ATP yi büyük miktarlarda depolar.', false, 'ATP depolanmaz; ihtiyaç oldukça üretiliyor.'),
      soru('Besinlerdeki enerji kimyasal bağlarda saklıdır.', true, 'Bağlar koparıldıkça enerji açığa çıkıyor.'),
      soru('ATP kullanıldığında geri dönüşü olmayacak biçimde yok olur.', false, 'ADP ye dönüşür ve yeniden ATP ye çevrilir; süreç bir döngü.'),
      sikli('ATP kaç fosfat taşır?', ['3', '2'], 0, 'Adenin, riboz, üç fosfat.'),
      sikli('Hücre ATP\'yi ne yapar?', ['İhtiyaç oldukça üretir', 'Biriktirir'], 0, 'Depo besinin kendisi.'),
      soru('ATP parçalanınca ADP oluşur.', true, 'Solunumla yeniden ATP.'),
    ], [
      {
        soru: 'ATP\'de enerji nerede saklıdır?',
        siklar: ['Fosfatlar arasındaki bağlarda', 'Riboz şekerinde'],
        dogru: 0,
        aciklama: {
          dogru: 'Son fosfat koparken açığa çıkan enerji hücrenin işine harcanır.',
          yanlis: 'Riboz yalnızca iskelet. Kullanılan enerji fosfatlar arasındaki bağın kopmasından gelir.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-fotosentez', 'Işık Enerjisiyle Besin Sentezi: Fotosentez', [
      kart(
        'Özet denklem',
        '**CO₂ + H₂O + ışık → glikoz + O₂**\nKloroplastta gerçekleşir.',
      ),
      kart(
        'İki evre',
        'Fotosentez iki basamakta yürür.\nİkinci evre, doğrudan birincinin ürünleriyle çalışır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Işıklı evre', alt: 'tilakoit' },
            { ad: 'ATP + NADPH', renk: 'ikincil' },
            { ad: 'Calvin döngüsü', alt: 'stroma' },
          ],
        },
      ),
      kart(
        'Işığın kullanıldığı tepkimeler',
        'Tilakoit zarda olur:\n- Su parçalanır (fotoliz), O₂ açığa çıkar.\n- ATP ve NADPH üretilir.',
      ),
      kart(
        'Işığın kullanılmadığı tepkimeler',
        'Stromada geçen **Calvin döngüsüdür**.\nCO₂, ışık tepkimelerinin ürettiği ATP ve NADPH ile glikoza bağlanır.',
      ),
      kart(
        'Oksijen sudan gelir',
        'Açığa çıkan oksijenin kaynağı CO₂ değil, **parçalanan sudur**.\nBu, izotoplu deneylerle gösterildi.',
        undefined,
        { not: 'İşaretli O¹⁸ suyla deney: oksijen gazı işaretli çıkar. O₂ sudan, glikozun oksijeni CO₂\'den.' },
      ),
      kart(
        'Pigmentler',
        'Klorofil ışığın kırmızısını ve mavisini soğurur, yeşilini yansıtır.\nYaprakların yeşil görünmesi bundandır.',
      ),
      kart(
        'Hızını etkileyen etmenler',
        'Işık, CO₂ ve sıcaklık artarken hız bir noktaya kadar yükselir.\nSonra sabitlenir.',
        {
          tur: 'koordinat',
          pencere: [0, 6, 0, 6],
          xAd: 'ışık şiddeti',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 0.2],
                [1, 2],
                [2, 3.6],
                [3.5, 4.6],
                [5.5, 4.8],
              ],
            },
          ],
        },
      ),
      kart(
        'Sınırlayıcı etmen',
        'Hız her zaman en yetersiz etmene takılır.\nCO₂ azsa ışığı artırmak hızı artırmaz.',
      ),
      kart(
        'Neden hayati?',
        'İkisinin de neredeyse tamamının kaynağı fotosentezdir:\n- Atmosferdeki oksijen\n- Besin zincirindeki enerji',
      ),
      kart(
        'Sık sorulan kalıp',
        '- **Işık tepkimeleri:** ışık gerekir, gündüz olur.\n- **Calvin döngüsü:** ışığa doğrudan bağlı değil.\nATP ve NADPH bitince Calvin döngüsü de durur; gece uzun sürmez.',
      ),
    ], [
      soru(
        'Grafiğe göre ışık şiddeti arttıkça fotosentez hızı sınırsız olarak artar.',
        false,
        'Eğri bir noktadan sonra yataylaşıyor: başka bir etmen sınırlayıcı hâle geliyor.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 10],
          xAd: 'ışık şiddeti',
          yAd: 'fotosentez hızı',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [2, 4],
                [4, 6.5],
                [6, 7.6],
                [8, 8],
                [9.5, 8.1],
              ],
            },
          ],
        },
      ),
      soru('Fotosentezde açığa çıkan oksijen sudan gelir.', true, 'Su parçalanırken oksijen serbest kalıyor.'),
      soru('Işığın kullanılmadığı tepkimeler yalnızca gece gerçekleşir.', false, 'Işık gerekmiyor ama gündüz de sürüyor; adı yanıltıcı.'),
      soru('Klorofil, ışığın yeşil dalga boylarını en çok soğurur.', false, 'Yeşili yansıtır; yaprakların yeşil görünmesinin sebebi bu.'),
      sikli('Işık tepkimeleri nerede olur?', ['Tilakoit zarda', 'Stromada'], 0, 'Calvin döngüsü stromada.'),
      sikli('Calvin döngüsünde CO₂ neyle glikoza bağlanır?', ['ATP ve NADPH ile', 'Oksijenle'], 0, 'Işık tepkimelerinin ürünleri.'),
      sikli('Klorofil hangi ışığı yansıtır?', ['Yeşil', 'Kırmızı'], 0, 'Kırmızı ve maviyi soğurur.'),
      sikli('Işık artırılıp CO₂ azsa hız ne olur?', ['Artmaz', 'Artar'], 0, 'Sınırlayıcı etmen.'),
      sikli('Suyun parçalanmasına ne denir?', ['Hidroliz', 'Fotoliz'], 1, 'Oksijen açığa çıkar.'),
      sikli('Karanlık tepkimeleri gece neden uzun sürmez?', ['Sıcaklık düşer', 'ATP ve NADPH biter'], 1, 'Işık tepkimeleri beslemez.'),
      soru('Atmosferdeki oksijenin kaynağı büyük ölçüde fotosentezdir.', true, 'Besin zincirindeki enerji de.'),
    ], [
      {
        soru: 'Fotosentezde açığa çıkan oksijen nereden gelir?',
        siklar: ['Parçalanan sudan', 'Karbondioksitten'],
        dogru: 0,
        aciklama: {
          dogru: 'Fotoliz suyu parçalar; izotoplu deneyler oksijenin kaynağının su olduğunu gösterdi.',
          yanlis: 'CO₂\'nin oksijeni glikoza ve suya gider. Havaya salınan O₂ suyun parçalanmasından çıkar.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-kemosentez', 'Işık Kullanılmadan Besin Sentezi: Kemosentez', [
      kart(
        'Tanımı',
        'Bazı bakterilerin, ışık yerine kimyasal tepkimelerden aldıkları enerjiyle besin üretmesidir.',
      ),
      kart(
        'Kimler yapar?',
        'Nitrit, kükürt ve demir bakterileri gibi bazı prokaryotlar yapar.\nÖkaryotlarda görülmez.',
      ),
      kart(
        'Nerede önemli?',
        'Işığın ulaşmadığı okyanus tabanındaki hidrotermal bacalarda.\nOradaki besin zincirini kemosentez başlatır.',
      ),
      kart(
        'Fotosentezden farkı',
        'İki süreç de üreticidir.\nAyrıldıkları yer: enerji kaynağı ve açığa çıkan ürün.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fotosentez', 'Kemosentez'],
          satirlar: [
            ['Enerji', 'Işık', 'Kimyasal bağ'],
            ['Yapan', 'Bitki, alg', 'Bakteri'],
            ['Oksijen', 'Çıkar', 'Çıkmaz'],
          ],
        },
        { not: 'İkisi de CO₂\'den besin yapar. Fark: enerji ışıktan mı (klorofil) kimyasal tepkimeden mi; kemosentezde O₂ çıkmaz.' },
      ),
      kart(
        'Döngülerdeki rolü',
        'Azot döngüsündeki nitrit ve nitrat bakterileri kemosentez yapar.\nToprağın verimliliği buna bağlıdır.',
      ),
      kart(
        'Ortak nokta',
        'İkisi de CO₂’yi organik besine çevirir.\nKemosentezde enerji, inorganik maddelerin oksidasyonundan gelir.',
      ),
    ], [
      soru('Kemosentez yapan canlılar enerjiyi kimyasal maddeleri yükseltgeyerek sağlar.', true, 'Işığa ihtiyaç duymuyorlar.'),
      soru('Kemosentezi bazı bakteri ve arkeler yapar.', true, 'Bitkiler kemosentez yapmaz.'),
      soru('Kemosentezin gerçekleşmesi için ışık gereklidir.', false, 'Işık gerekmez; okyanus tabanındaki karanlıkta da yapılıyor.'),
      soru('Azot döngüsünde kemosentetik bakterilerin bir rolü yoktur.', false, 'Nitrifikasyon bakterileri bu döngünün temel halkası.'),
      sikli('Kemosentez hangi canlılarda görülür?', ['Bazı prokaryotlarda', 'Bitkilerde'], 0, 'Ökaryotta yok.'),
      sikli('Kemosentez ile fotosentezin ortak noktası?', ['CO₂\'den besin üretmek', 'Oksijen çıkarmak'], 0, 'İkisi de üretici.'),
      soru('Hidrotermal bacalarda besin zincirini fotosentez başlatır.', false, 'Işık ulaşmaz; kemosentez başlatır.'),
    ], [
      {
        soru: 'Kemosentez yapan canlılar enerjiyi nereden alır?',
        siklar: ['Kimyasal tepkimelerden', 'Güneş ışığından'],
        dogru: 0,
        aciklama: {
          dogru: 'Amonyak, kükürt ya da demir bileşiklerini yükseltgeyerek enerji elde ederler.',
          yanlis: 'Işık fotosentezin enerjisi. Kemosentez ışıksız ortamda, inorganik maddelerin oksidasyonundan enerji alır.',
        },
        kart: 1,
      },
    ]),
    konu('byl10-sindirim', 'Sindirim', [
      kart(
        'Neden gerekli?',
        'Büyük besin molekülleri hücre zarından geçemez.\nÖnce yapı taşlarına ayrılmaları gerekir.',
      ),
      kart(
        'Hücre içi sindirim',
        'Besin hücreye alınır, lizozom enzimleriyle parçalanır.\nÖrnek: amip, terliksi hayvan',
      ),
      kart(
        'Hücre dışı sindirim',
        'Enzimler dışarı salgılanır; besin dışarıda parçalanıp sonra emilir.\nÖrnek: mantarlar, çok hücreli hayvanlar',
      ),
      kart(
        'Mekanik ve kimyasal',
        '- **Mekanik:** besini küçültür, yüzey alanını artırır.\n- **Kimyasal:** enzimlerle bağları koparır.',
      ),
      kart(
        'Neden ikisi birden?',
        'Enzim yalnızca yüzeyde çalışır.\nMekanik sindirim yüzeyi büyütmeseydi kimyasal sindirim çok yavaş kalırdı.',
        undefined,
        { not: 'Küp şeker bütün hâlde dakikalarca çözünür, toz şeker anında: yüzey alanı. Çiğneme enzime yüzey açar.' },
      ),
      kart(
        'Hidroliz',
        'Kimyasal sindirim, su eklenerek bağ koparmaktır.\nBu yüzden sindirime hidroliz de denir.',
      ),
    ], [
      soru('Sindirim, büyük moleküllerin hücre zarından geçebilecek küçüklüğe getirilmesidir.', true, 'Bu olmadan besin hücreye giremiyor.'),
      soru('Kimyasal sindirim hidroliz tepkimeleriyle gerçekleşir.', true, 'Bağların koparılmasında su kullanılıyor.'),
      soru('Mekanik sindirimde besinin kimyasal yapısı değişir.', false, 'Yalnızca parçalara ayrılır; yapı aynı kalır.'),
      soru('Hücre içi sindirim yalnızca çok hücreli canlılarda görülür.', false, 'Tek hücrelilerin temel sindirim yolu bu.'),
      sikli('Amip nasıl sindirim yapar?', ['Hücre dışı', 'Hücre içi'], 1, 'Lizozom enzimleriyle.'),
      sikli('Kimyasal sindirime hidroliz denmesinin sebebi?', ['Su çıkarılır', 'Su eklenerek bağ koparılır'], 1, 'Hidroliz su ile parçalama.'),
      soru('Büyük besin molekülleri hücre zarından geçebilir.', false, 'Yapı taşlarına ayrılmalı.'),
    ], [
      {
        soru: 'Mekanik sindirimin kimyasal sindirime katkısı nedir?',
        siklar: ['Yüzey alanını büyütür', 'Bağları koparır'],
        dogru: 0,
        aciklama: {
          dogru: 'Enzim yüzeyde çalışır; ufalanan besinde enzimin ulaştığı yüzey artar.',
          yanlis: 'Bağ koparan kimyasal sindirim (enzim). Mekanik sindirim yalnızca küçültüp yüzeyi büyütür.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-sindirim-yapi', 'Canlılarda Sindirim Yapıları', [
      kart(
        'Tek hücrelilerde',
        'Ayrı bir sistem yoktur.\nBesin kofulu lizozomla birleşir, sindirim hücre içinde tamamlanır.',
      ),
      kart(
        'Sölenterelerde',
        'Tek açıklıklı bir sindirim boşluğu vardır.\nAğız hem giriş hem çıkıştır.',
      ),
      kart(
        'Solucanlarda',
        'İki açıklıklı sindirim kanalı gelişir.\nBesin tek yönde ilerler, bölümler uzmanlaşır.',
      ),
      kart(
        'Gelişim çizgisi',
        'Sindirim yapıları basitten karmaşığa doğru uzmanlaşır.\nHer adımda daha çok besin daha verimli işlenir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Koful' },
            { ad: 'Tek açıklık' },
            { ad: 'İki açıklık' },
            { ad: 'Uzman organlar' },
          ],
        },
        { not: 'Hidra tek açıklık (ağız = anüs), solucan iki açıklık. İki açıklık = besin tek yönde, bölümler uzmanlaşır.' },
      ),
      kart(
        'Otçul ve etçillerde',
        '- **Otçul:** bağırsak uzun, selüloz için mikroplu\n- **Etçil:** bağırsak kısa',
      ),
      kart(
        'Geviş getirenler',
        'Dört bölmeli midedeki bakteriler selülozu parçalar.\nHayvan selülozu kendi enzimiyle sindiremez.',
      ),
    ], [
      soru('Sölenterelerde sindirim boşluğunun tek açıklığı vardır.', true, 'Ağız aynı zamanda atık çıkışı olarak kullanılıyor.'),
      soru('Toprak solucanında ağızdan anüse uzanan tam bir sindirim kanalı bulunur.', true, 'Besin tek yönde ilerliyor.'),
      soru('Otçul hayvanlarda sindirim kanalı etçillere göre kısadır.', false, 'Selüloz zor sindirildiği için otçullarda kanal daha uzun.'),
      soru('Geviş getirenler selülozu kendi enzimleriyle sindirir.', false, 'Midelerindeki mikroorganizmalar sindiriyor.'),
      sikli('İki açıklıklı sindirim kanalı ilk hangi grupta gelişir?', ['Solucanlar', 'Sölenterler'], 0, 'Besin tek yönde ilerler.'),
      sikli('Otçulların bağırsağı etçillere göre nasıldır?', ['Uzun', 'Kısa'], 0, 'Selüloz sindirimi için mikroplu.'),
      soru('Geviş getirenler selülozu kendi enzimleriyle sindirir.', false, 'Midedeki bakteriler parçalar.'),
    ], [
      {
        soru: 'Sölenterelerde sindirim sistemi kaç açıklıklıdır?',
        siklar: ['Bir', 'İki'],
        dogru: 0,
        aciklama: {
          dogru: 'Ağız hem giriş hem çıkış; iki açıklık solucanlarla başlar.',
          yanlis: 'İki açıklıklı kanal solucanlarda gelişir. Sölenterelerde tek açıklık hem ağız hem anüs işi görür.',
        },
        kart: 2,
      },
    ]),
    konu('byl10-insan-sindirim', 'İnsanda Sindirim', [
      kart(
        'Ağızda',
        '- **Mekanik:** dişler besini parçalar.\n- **Kimyasal:** tükürükteki amilaz nişastayı sindirmeye başlar.',
      ),
      kart(
        'Midede',
        'Asidik ortamda **pepsin** proteinleri parçalar.\nKarbonhidrat sindirimi asit yüzünden burada durur.',
      ),
      kart(
        'İnce bağırsakta',
        'Sindirimin tamamlandığı yerdir.\nPankreas enzimleri ve safra buraya dökülür.',
      ),
      kart(
        'Nerede ne sindirilir?',
        '- **Karbonhidrat:** ağızda başlar.\n- **Protein:** midede başlar.\n- **Yağ:** ince bağırsakta başlar.\nÜçü de ince bağırsakta biter.',
        {
          tur: 'tablo',
          basliklar: ['Besin', 'Başlar', 'Biter'],
          satirlar: [
            ['Karbonhidrat', 'Ağız', 'İnce bağırsak'],
            ['Protein', 'Mide', 'İnce bağırsak'],
            ['Yağ', 'İnce bağırsak', 'İnce bağırsak'],
          ],
        },
        { not: 'Karbonhidrat ağızda, protein midede, yağ ince bağırsakta başlar; üçü de ince bağırsakta biter. Midede nişasta durur.' },
      ),
      kart(
        'Safranın işi',
        'Safra enzim değildir.\nYağ damlalarını küçültür (emülsiyon), enzimlerin ulaşacağı yüzeyi artırır.',
      ),
      kart(
        'Mide kendini neden sindirmez?',
        '- Mukus tabakası asidi yüzeyden uzak tutar.\n- Pepsin etkisiz bir öncül olarak salgılanır.',
      ),
      kart(
        'Kalın bağırsakta',
        'Sindirim olmaz; su ve mineral emilir.\nBağırsak florası bazı vitaminleri üretir.',
      ),
      kart(
        'Enzim tablosu',
        '- **Amilaz:** nişasta (ağız, ince bağırsak)\n- **Pepsin:** protein (mide)\n- **Tripsin:** protein (ince bağırsak)\n- **Lipaz:** yağ (ince bağırsak)',
      ),
    ], [
      soru('Karbonhidratların kimyasal sindirimi ağızda başlar.', true, 'Tükürükteki amilaz nişastayı parçalamaya başlıyor.'),
      soru('Proteinlerin kimyasal sindirimi midede başlar.', true, 'Pepsin asidik ortamda çalışıyor.'),
      soru('Safra, yağları kimyasal olarak sindirir.', false, 'Safra enzim değil; yağı küçük damlacıklara ayırarak mekanik sindirim yapıyor.'),
      soru('Sindirimin tamamlandığı yer kalın bağırsaktır.', false, 'Sindirim ince bağırsakta tamamlanır; kalın bağırsakta su ve mineral emiliyor.'),
      sikli('Nişastanın sindirimi nerede başlar?', ['Ağızda', 'Midede'], 0, 'Tükürükteki amilaz.'),
      sikli('Pepsin neyi parçalar?', ['Proteinleri', 'Yağları'], 0, 'Midede, asidik ortamda.'),
      sikli('Sindirimin tamamlandığı yer?', ['İnce bağırsak', 'Kalın bağırsak'], 0, 'Pankreas enzimleri ve safra buraya dökülür.'),
      sikli('Kalın bağırsakta ne olur?', ['Su ve mineral emilimi', 'Protein sindirimi'], 0, 'Sindirim olmaz.'),
      sikli('Mide kendini neden sindirmez?', ['Asit zayıftır', 'Mukus tabakası'], 1, 'Pepsin de etkisiz öncül olarak salgılanır.'),
      soru('Karbonhidrat sindirimi midede devam eder.', false, 'Asit yüzünden durur.'),
    ], [
      {
        soru: 'Safra ne yapar?',
        siklar: ['Yağı emülsiyon hâline getirir', 'Yağı kimyasal olarak sindirir'],
        dogru: 0,
        aciklama: {
          dogru: 'Safra enzim değil; yağ damlalarını küçültüp lipazın çalışacağı yüzeyi artırır.',
          yanlis: 'Kimyasal sindirimi lipaz yapar. Safra enzim içermez, yalnızca yağı küçük damlalara ayırır.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-emilim', 'Emilim ve Taşınma', [
      kart(
        'Nerede olur?',
        'Emilim büyük ölçüde **ince bağırsakta** olur.\nVillus ve mikrovilluslar emilim yüzeyini kat kat artırır.',
      ),
      kart(
        'Neden yüzey önemli?',
        'Emilim yüzeyde olur.\nKıvrımlar, villuslar ve mikrovilluslar iç yüzeyi yüzlerce kat büyütür.',
      ),
      kart(
        'Neyin nereye gittiği',
        '- **Glikoz ve amino asitler:** kana geçer.\n- **Yağ asitleri ve gliserol:** önce lenfe geçer.',
        undefined,
        { not: 'Glikoz ve amino asit → kan → karaciğer. Yağ asidi → lenf → kan. Yağ karaciğere uğramadan dolaşıma girer.' },
      ),
      kart(
        'Karaciğerin rolü',
        'Bağırsaktan gelen kan önce karaciğere uğrar.\n- Fazla glikoz glikojen olarak depolanır.\n- Zararlı maddeler süzülür.',
      ),
      kart(
        'Taşıma',
        'Dolaşım sistemi besinleri hücrelere ulaştırır.\nHücreye giriş difüzyon ve aktif taşımayla olur.',
      ),
      kart(
        'Su nerede emilir?',
        '- **Büyük kısmı:** ince bağırsakta\n- **Kalanı:** kalın bağırsakta\nEmilim bozulursa ishal görülür.',
      ),
    ], [
      soru('Emilimin büyük kısmı ince bağırsakta gerçekleşir.', true, 'Yüzeyi villuslarla katlanarak genişletilmiş durumda.'),
      soru('Villuslar emilim yüzeyini artırır.', true, 'Aynı uzunlukta çok daha geniş bir yüzey elde ediliyor.'),
      soru('Yağların emilen ürünleri doğrudan kan damarlarına geçer.', false, 'Önce lenf damarlarına geçiyor, oradan kana karışıyor.'),
      soru('Emilen besinler karaciğere uğramadan doğrudan hücrelere gider.', false, 'Kapı toplardamarı ile önce karaciğere uğruyorlar.'),
      sikli('Villus ve mikrovillus ne yapar?', ['Enzim salgılar', 'Emilim yüzeyini artırır'], 1, 'Yüzey yüzlerce kat büyür.'),
      sikli('Bağırsaktan gelen kan önce nereye uğrar?', ['Kalbe', 'Karaciğere'], 1, 'Fazla glikoz glikojen olur.'),
      soru('Suyun büyük kısmı kalın bağırsakta emilir.', false, 'İnce bağırsakta; kalanı kalın bağırsakta.'),
    ], [
      {
        soru: 'Yağ asitleri emildikten sonra önce nereye geçer?',
        siklar: ['Lenf sistemine', 'Doğrudan kana'],
        dogru: 0,
        aciklama: {
          dogru: 'Glikoz ve amino asitler kana, yağ ürünleri önce lenfe geçer.',
          yanlis: 'Doğrudan kana geçenler glikoz ve amino asitler. Yağ asidi ve gliserol lenf yoluyla dolaşıma katılır.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-solunum', 'Hücresel Solunum', [
      kart(
        'Ne yapar?',
        'Besindeki kimyasal enerjiyi ATP’ye çevirir.\nOksijenli solunumda son ürünler CO₂ ve sudur.',
      ),
      kart(
        'Üç evre',
        'Her evre farklı bir yerde geçer.\nATP’nin büyük kısmı sonuncusunda üretilir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Glikoliz', alt: 'sitoplazma' },
            { ad: 'Sitrik asit döngüsü', alt: 'matriks' },
            { ad: 'Elektron taşıma', alt: 'iç zar', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Glikoliz',
        'Sitoplazmada olur, oksijen gerekmez.\nGlikoz iki piruvata ayrılır, az miktarda ATP üretilir.',
      ),
      kart(
        'Sitrik asit döngüsü',
        'Mitokondri matriksinde olur.\nKarbonlar CO₂ olarak ayrılır, elektron taşıyıcılar yüklenir.',
      ),
      kart(
        'Elektron taşıma sistemi',
        'Mitokondri iç zarında olur; ATP’nin büyük kısmı burada üretilir.\nSon elektron alıcısı **oksijendir** ve su oluşur.',
      ),
      kart(
        'Oksijen neden şart?',
        'Elektronları en sonda alacak bir molekül yoksa zincir tıkanır.\nATP üretimi durur.',
      ),
      kart(
        'Verim',
        '- **Oksijenli solunum:** bir glikozdan çok sayıda ATP\n- **Fermantasyon:** yalnızca 2 ATP',
      ),
      kart(
        'Fotosentezin tersi mi?',
        'Girenler ve çıkanlar birbirinin tersidir.\nAma tepkimeler aynı yolun geri sarılması değil, ayrı süreçlerdir.',
      ),
      kart(
        'Nerede ne oluyor?',
        '- **Glikoliz:** sitoplazma\n- **Sitrik asit döngüsü:** matriks, CO₂ burada çıkar\n- **Elektron taşıma:** iç zar, H₂O burada oluşur',
        undefined,
        { not: 'Glikoliz: sitoplazma, O₂ gerekmez. Krebs: matriks. ETS: iç zar, O₂ son alıcı. ATP\'nin ~%90\'ı ETS\'den.' },
      ),
    ], [
      soru('Glikoliz sitoplazmada gerçekleşir ve oksijen gerektirmez.', true, 'Solunumun ortak ilk basamağı.'),
      soru('Oksijenli solunumda son elektron alıcısı oksijendir.', true, 'Elektronlar sonunda oksijenle birleşip su oluşturuyor.'),
      soru('Oksijenli solunumun tamamı mitokondride gerçekleşir.', false, 'İlk evre olan glikoliz sitoplazmada oluyor.'),
      soru('Oksijenli solunum, fermantasyona göre daha az ATP üretir.', false, 'Çok daha fazla üretir; glikoz tümüyle parçalanıyor.'),
      sikli('Glikoliz için oksijen gerekir mi?', ['Hayır', 'Evet'], 0, 'Sitoplazmada, oksijensiz.'),
      sikli('Sitrik asit döngüsü nerede olur?', ['Mitokondri matriksinde', 'İç zarda'], 0, 'CO₂ burada ayrılır.'),
      sikli('Elektron taşıma sisteminin son elektron alıcısı?', ['Oksijen', 'Karbondioksit'], 0, 'Su oluşur.'),
      sikli('Glikozun iki piruvata ayrılması hangi evredir?', ['Glikoliz', 'Sitrik asit döngüsü'], 0, 'Az ATP üretilir.'),
      sikli('Oksijen yoksa ATP üretimi neden durur?', ['Glikoz bitir', 'Taşıma zinciri tıkanır'], 1, 'Elektronları alacak kimse kalmaz.'),
      soru('Solunum, fotosentezin aynı yolun geri sarılmasıdır.', false, 'Girenler-çıkanlar ters ama ayrı süreçler.'),
    ], [
      {
        soru: 'Oksijenli solunumda ATP\'nin büyük kısmı nerede üretilir?',
        siklar: ['Elektron taşıma sisteminde', 'Glikolizde'],
        dogru: 0,
        aciklama: {
          dogru: 'İç zardaki zincir en büyük ATP kaynağı; glikoliz yalnızca birkaç ATP verir.',
          yanlis: 'Glikoliz az ATP üretir ve oksijen istemez. Büyük kazanç mitokondri iç zarındaki elektron taşıma sisteminde.',
        },
        kart: 5,
      },
    ]),
    konu('byl10-katilma', 'Besinlerin Solunuma Katılma Yolları', [
      kart(
        'Öncelik sırası',
        'Hücre besinleri sırayla kullanır:\nkarbonhidrat → yağ → protein\nProtein en son başvurulan kaynaktır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Karbonhidrat', alt: 'ilk' },
            { ad: 'Yağ' },
            { ad: 'Protein', alt: 'son çare', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Karbonhidratlar',
        'Glikoza çevrilip doğrudan glikolize girer.\nEn hızlı kullanılan yakıttır.',
      ),
      kart(
        'Yağlar',
        'Gliserol ve yağ asitlerine ayrılır.\nGram başına en çok enerjiyi verir ama yavaş kullanılır.',
      ),
      kart(
        'Proteinler',
        'Amino asitlerin azotu ayrılır; bu atık boşaltımla atılır.\nKalan kısım solunum döngüsüne katılır.',
      ),
      kart(
        'Neden protein son?',
        'Protein aynı zamanda yapı ve enzim malzemesidir.\nYakıt olarak kullanılması dokuların harcanması demektir.',
        undefined,
        { not: 'Açlıkta sıra: glikojen (1 gün) → yağ (haftalar) → kas proteini. Protein yakılırsa amonyak/üre atığı çıkar.' },
      ),
      kart(
        'Ortak yol',
        'Üç besin de sonunda aynı döngüye girer.\nBu yüzden fazla alınan karbonhidrat da yağa çevrilip depolanabilir.',
      ),
    ], [
      soru('Solunumda öncelikle karbonhidratlar kullanılır.', true, 'En hızlı ve kolay parçalanan besin grubu.'),
      soru('Yağlar gram başına karbonhidratlardan daha çok enerji verir.', true, 'Bu yüzden uzun süreli enerji deposu olarak kullanılıyorlar.'),
      soru('Proteinler enerji için ilk tercih edilen besin grubudur.', false, 'Son sırada; yapı maddesi oldukları için ancak zorunlu hâlde yakılıyorlar.'),
      soru('Yağlar ve proteinler solunuma katılmadan önce hiçbir dönüşüme uğramaz.', false, 'Ortak yola girebilmek için önce ara moleküllere dönüştürülüyorlar.'),
      sikli('Amino asitler solunuma katılırken ne ayrılır?', ['Azot', 'Karbon'], 0, 'Boşaltımla atılır.'),
      sikli('Fazla alınan karbonhidrat ne olur?', ['Yağa çevrilip depolanır', 'Boşaltımla atılır'], 0, 'Ortak yol sayesinde.'),
      soru('Gliserol ve yağ asitleri en hızlı kullanılan yakıttır.', false, 'En hızlı glikoz; yağ yavaş ama çok enerjili.'),
    ], [
      {
        soru: 'Hücre enerji için en son hangi besini kullanır?',
        siklar: ['Karbonhidrat', 'Protein'],
        dogru: 1,
        aciklama: {
          dogru: 'Protein yapı malzemesi; yakılması dokuların eritilmesi demek, o yüzden en son.',
          yanlis: 'Karbonhidrat ilk kullanılan yakıt. Sıra karbonhidrat → yağ → protein.',
        },
        kart: 1,
      },
    ]),
    konu('byl10-fermantasyon', 'Fermantasyon', [
      kart(
        'Ne zaman olur?',
        'Oksijen yetersizken olur.\nGlikoliz sürsün diye elektron taşıyıcılar başka yolla boşaltılır.',
      ),
      kart(
        'Laktik asit fermantasyonu',
        'Piruvat laktik aside dönüşür.\n- Yoğurt ve turşu bununla yapılır.\n- Kaslarda yorgunlukla ilişkilidir.',
      ),
      kart(
        'Etil alkol fermantasyonu',
        'Mayalarda piruvat, etil alkol ve CO₂’ye dönüşür.\nHamurun kabarması bu gaz sayesindedir.',
      ),
      kart(
        'İkisinin karşılaştırması',
        'Başlangıç aynıdır, yollar piruvattan sonra ayrılır.\nÜrün ne olursa olsun kazanılan ATP sayısı değişmez.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Ürün', 'Yapan'],
          satirlar: [
            ['Laktik asit', 'Laktik asit', 'Bakteri, kas'],
            ['Alkol', 'Etanol + CO₂', 'Maya'],
          ],
        },
        { not: 'Laktik asit: kas, yoğurt, CO₂ çıkmaz. Etil alkol: maya, hamur, CO₂ çıkar. İkisinde de net 2 ATP.' },
      ),
      kart(
        'Verimi düşük',
        'Yalnızca glikolizden gelen az sayıda ATP üretilir.\nBesindeki enerjinin çoğu ürünün içinde kalır.',
      ),
      kart(
        'Neden hâlâ yapılır?',
        'Az ATP, hiç ATP olmamasından iyidir.\nOksijensiz ortamda tek seçenektir ve çok hızlı işler.',
      ),
    ], [
      soru('Fermantasyon, oksijenin yetersiz olduğu durumlarda gerçekleşir.', true, 'Glikoliz sonrası yol oksijensiz devam ediyor.'),
      soru('Etil alkol fermantasyonunda karbondioksit açığa çıkar.', true, 'Hamurun kabarmasının sebebi bu.'),
      soru('Fermantasyonda glikoz tümüyle parçalanır.', false, 'Kısmen parçalanır; bu yüzden elde edilen ATP çok az.'),
      soru('İnsanın kas hücrelerinde etil alkol fermantasyonu görülür.', false, 'İnsanda laktik asit fermantasyonu olur.'),
      sikli('Yoğurt hangi fermantasyonla yapılır?', ['Laktik asit', 'Etil alkol'], 0, 'Turşu da.'),
      sikli('Fermantasyonda ATP nereden gelir?', ['Yalnızca glikolizden', 'Elektron taşıma sisteminden'], 0, 'Verimi bu yüzden düşük.'),
      soru('Laktik asit ve etil alkol fermantasyonunda kazanılan ATP sayısı aynıdır.', true, 'Ayrılma piruvattan sonra.'),
    ], [
      {
        soru: 'Hamurun kabarmasını sağlayan gaz hangi fermantasyondan çıkar?',
        siklar: ['Laktik asit fermantasyonu', 'Etil alkol fermantasyonu'],
        dogru: 1,
        aciklama: {
          dogru: 'Maya piruvatı etil alkol ve CO₂\'ye çevirir; kabartan gaz CO₂.',
          yanlis: 'Laktik asit fermantasyonu gaz çıkarmaz (yoğurt, turşu). Hamurdaki CO₂ mayanın etil alkol fermantasyonundan.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-metabolizma', 'Enerji-Metabolizma İlişkisi', [
      kart(
        'Anabolizma ve katabolizma',
        '- **Anabolizma:** enerji harcayarak yapar.\n- **Katabolizma:** parçalayarak enerji verir.\nMetabolizma ikisinin toplamıdır.',
      ),
      kart(
        'Bazal metabolizma',
        'Dinlenme hâlinde yaşamı sürdürmek için harcanan en az enerjidir.\nYaşa, cinsiyete ve kas kütlesine göre değişir.',
      ),
      kart(
        'Enerji dengesi',
        '- **Alınan > harcanan:** fazlası depolanır.\n- **Alınan < harcanan:** depolar kullanılır.',
      ),
      kart(
        'Neden hep enerji harcanır?',
        'Uyurken bile kalp, solunum ve iyon pompaları çalışır.\nDüzeni korumak sürekli enerji ister.',
        undefined,
        { not: 'Bazal metabolizma günlük enerjinin ~%60–70\'i; koşmak değil, uyurken kalp, beyin ve iyon pompaları yakar.' },
      ),
      kart(
        'Kas kütlesi ve metabolizma',
        'Kas dokusu dinlenirken bile yağ dokusundan çok enerji harcar.\nBazal metabolizmayı en çok etkileyen etken budur.',
      ),
      kart(
        'Metabolizma hormonlarla ayarlanır',
        '- **Tiroit hormonları:** metabolizma hızını belirler.\n- **İnsülin ve glukagon:** kan şekerini dengede tutar.',
      ),
    ], [
      soru('Anabolizma yapım, katabolizma yıkım tepkimelerini kapsar.', true, 'İkisinin toplamı metabolizmayı oluşturuyor.'),
      soru('Bazal metabolizma, dinlenme hâlinde harcanan en az enerji miktarıdır.', true, 'Solunum ve kalp atışı gibi zorunlu işler için harcanıyor.'),
      soru('Kas kütlesi arttıkça bazal metabolizma hızı düşer.', false, 'Kas dokusu enerji harcadığı için metabolizma hızı artar.'),
      soru('Uyku sırasında vücut enerji harcamaz.', false, 'Zorunlu yaşamsal işler sürdüğü için enerji harcanmaya devam ediyor.'),
      sikli('Alınan enerji harcanandan fazlaysa?', ['Atılır', 'Depolanır'], 1, 'Enerji dengesi.'),
      sikli('Metabolizma hızını hangi hormonlar belirler?', ['İnsülin', 'Tiroit hormonları'], 1, 'İnsülin kan şekeri.'),
      soru('Uyurken vücut enerji harcamaz.', false, 'Kalp, solunum ve pompalar çalışır.'),
    ], [
      {
        soru: 'Bazal metabolizmayı en çok etkileyen etken hangisidir?',
        siklar: ['Kas kütlesi', 'Boy'],
        dogru: 0,
        aciklama: {
          dogru: 'Kas dinlenirken bile yağdan çok enerji harcar.',
          yanlis: 'Boy tek başına belirleyici değil; dinlenirken enerji harcayan doku kas. Kas kütlesi bazal metabolizmayı belirler.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('byl10-t2', 'Ekoloji', [
    konu('byl10-bilesen', 'Ekosistemin Bileşenleri', [
      kart(
        'Cansız bileşenler',
        'Işık, sıcaklık, su, toprak, mineraller ve pH.\nHangi canlının nerede yaşayacağını büyük ölçüde bunlar belirler.',
      ),
      kart(
        'Canlı bileşenler',
        '- Üreticiler\n- Tüketiciler\n- Ayrıştırıcılar\nAyrıştırıcılar olmasa madde döngüsü kapanmazdı.',
      ),
      kart(
        'Organizasyon basamakları',
        'Ekoloji bireyden başlayıp biyosfere kadar iç içe basamaklarla çalışır.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Biyosfer' },
            { ad: 'Ekosistem' },
            { ad: 'Komünite' },
            { ad: 'Popülasyon' },
            { ad: 'Birey' },
          ],
        },
      ),
      kart(
        'Popülasyon ve komünite',
        '- **Popülasyon:** aynı türden bireyler\n- **Komünite:** aynı alandaki bütün popülasyonlar',
      ),
      kart(
        'Ekosistem ve biyosfer',
        '- **Ekosistem:** komünite + cansız çevre\n- **Biyosfer:** bütün ekosistemlerin toplamı',
      ),
      kart(
        'Habitat ve niş',
        '- **Habitat:** canlının adresi\n- **Niş:** oradaki mesleği\nİki tür aynı nişi uzun süre paylaşamaz.',
        undefined,
        { not: 'Aslan ve çita aynı habitatta (savan), farklı nişte (avlanma zamanı ve av büyüklüğü). Aynı niş = rekabet.' },
      ),
      kart(
        'Sınırlayıcı etmen',
        'Canlının yayılışını en az bulunan kaynak belirler.\nSınırı bolluk değil, kıtlık çizer.',
      ),
    ], [
      soru('Popülasyon, belirli bir alanda yaşayan aynı türden bireylerin oluşturduğu topluluktur.', true, 'Farklı popülasyonlar bir araya gelince komünite oluşuyor.'),
      soru('Habitat canlının adresi, niş ise o canlının yaptığı iştir.', true, 'İki tür aynı habitatta farklı nişlerde yaşayabiliyor.'),
      soru('Komünite, bir bölgedeki cansız etmenlerin tamamıdır.', false, 'Komünite canlı topluluklarının tamamı; cansızlar abiyotik bileşen.'),
      soru('Biyosfer, ekosistemden daha küçük bir organizasyon basamağıdır.', false, 'Biyosfer en geniş basamak; bütün ekosistemleri kapsıyor.'),
      sikli('Canlının ekosistemdeki "mesleği" nedir?', ['Habitat', 'Niş'], 1, 'Habitat adresi.'),
      sikli('Bir canlının yayılışını ne belirler?', ['En bol kaynak', 'En az bulunan kaynak'], 1, 'Sınırlayıcı etmen.'),
      sikli('Ayrıştırıcılar olmasa ne olurdu?', ['Enerji akışı dururdu', 'Madde döngüsü kapanmazdı'], 1, 'Ölü madde toprağa dönmezdi.'),
      soru('İki tür aynı nişi uzun süre paylaşabilir.', false, 'Biri ötekini dışlar ya da niş ayrışır.'),
    ], [
      {
        soru: 'Aynı alandaki bütün popülasyonların toplamına ne denir?',
        siklar: ['Komünite', 'Ekosistem'],
        dogru: 0,
        aciklama: {
          dogru: 'Komünite yalnızca canlıları sayar; cansız çevre eklenince ekosistem olur.',
          yanlis: 'Ekosistem canlılar + cansız çevre. Yalnızca popülasyonların toplamı komünite.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-etkilesim', 'Tür İçi ve Türler Arası Etkileşimler', [
      kart(
        'Tür içi rekabet',
        'Aynı türün bireyleri aynı kaynağı ister.\nBu yüzden en şiddetli rekabet tür içinde olur.',
      ),
      kart(
        'Av-avcı ilişkisi',
        'Avcı, av popülasyonunu dengeler; av azalınca avcı da azalır.\nİki popülasyon birbirini izler.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'zaman',
          yAd: 'birey',
          egriler: [
            {
              noktalar: [
                [0, 2],
                [1.5, 4.6],
                [3, 2],
                [4.5, 4.6],
                [6, 2],
                [7.5, 4.6],
              ],
              ad: 'av',
            },
            {
              noktalar: [
                [0, 1],
                [1.5, 2],
                [3, 3.4],
                [4.5, 2],
                [6, 3.4],
                [7.5, 2],
              ],
              renk: 'ikincil',
              ad: 'avcı',
            },
          ],
        },
      ),
      kart(
        'Etkileşimlerin haritası',
        'Türler arası ilişkiler, iki tarafın kazanıp kaybetmesine göre adlandırılır.\nTabloda dört ilişki var.',
        {
          tur: 'tablo',
          basliklar: ['İlişki', 'A', 'B'],
          satirlar: [
            ['Mutualizm', '+', '+'],
            ['Kommensalizm', '+', '0'],
            ['Parazitlik', '+', '−'],
            ['Rekabet', '−', '−'],
          ],
        },
        { not: 'Mutualizm +/+, kommensalizm +/0, parazitlik +/−, rekabet −/−. Arı–çiçek +/+; köpek balığı–remora +/0.' },
      ),
      kart(
        'Mutualizm',
        'İki tür de kazanır (+/+).\nÖrnek: arı ile çiçek, baklagil ile azot bakterisi',
      ),
      kart(
        'Kommensalizm',
        'Biri kazanır, öbürü etkilenmez (+/0).\nÖrnek: ağaç dalında yaşayan bir bitki',
      ),
      kart(
        'Parazitlik',
        'Biri kazanır, öbürü zarar görür (+/−).\nParazit konağını genellikle öldürmez; öldürürse kendi yaşamı da biter.',
      ),
      kart(
        'Rekabetçi dışlama',
        'Aynı nişi paylaşan iki türden biri, öbürünü eninde sonunda uzaklaştırır.\nYa da iki tür nişlerini ayırır.',
      ),
    ], [
      soru('Mutualizmde iki taraf da yarar görür.', true, 'Likendeki alg ve mantar ilişkisi buna örnek.'),
      soru('Kommensalizmde bir taraf yarar görür, öteki etkilenmez.', true, 'Zarar gören taraf yok.'),
      soru('Parazit, konağını hemen öldürerek beslenir.', false, 'Konağın yaşaması parazitin de yararına; genelde yavaş zarar verir.'),
      soru('Tür içi rekabet, türler arası rekabetten daha zayıftır.', false, 'Aynı türün bireyleri aynı kaynağı istediği için tür içi rekabet daha şiddetli.'),
      sikli('Bir taraf kazanır, öteki etkilenmez: hangisi?', ['Kommensalizm', 'Parazitlik'], 0, 'Parazitlikte zarar var.'),
      sikli('En şiddetli rekabet nerededir?', ['Tür içinde', 'Türler arasında'], 0, 'Aynı kaynağı isterler.'),
      sikli('Baklagil ile azot bakterisi ilişkisi?', ['Mutualizm', 'Rekabet'], 0, 'İkisi de kazanır.'),
      soru('Parazit konağını genellikle öldürür.', false, 'Öldürürse kendi yaşamı biter.'),
    ], [
      {
        soru: 'Arı ile çiçek arasındaki ilişki hangi türdendir?',
        siklar: ['Kommensalizm', 'Mutualizm'],
        dogru: 1,
        aciklama: {
          dogru: 'Arı besin alır, çiçek tozlaşır; iki taraf da kazanır.',
          yanlis: 'Kommensalizmde bir taraf etkilenmez. Burada arı da çiçek de kazanıyor: mutualizm.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-suksesyon', 'Süksesyon', [
      kart(
        'Tanımı',
        'Bir alandaki canlı topluluğunun zamanla düzenli biçimde değişmesidir.',
      ),
      kart(
        'Birincil süksesyon',
        'Toprağın hiç olmadığı yerde başlar: lav akıntısı, çıplak kaya.\nÖncü tür çoğunlukla **likenlerdir**.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Çıplak kaya' },
            { ad: 'Likenler', alt: 'öncü tür' },
            { ad: 'Otlar ve çalılar' },
            { ad: 'Ağaçlar' },
            { ad: 'Klimaks', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'İkincil süksesyon',
        'Toprak varken başlar: yangın alanı, terk edilmiş tarla.\nBirincilden çok daha hızlı ilerler.',
      ),
      kart(
        'Neden ikincisi hızlı?',
        'Toprak zaten vardır, içinde tohum ve kök kalıntıları durur.\nEn uzun adım olan toprak oluşumu atlanmış olur.',
        undefined,
        { not: 'Lav üstünde orman: yüzyıllar (önce liken, sonra toprak). Yanan ormanda: onlarca yıl. Fark: toprak hazır.' },
      ),
      kart(
        'Klimaks',
        'Süksesyonun kararlı son aşamasıdır.\nTür bileşimi artık büyük ölçüde değişmez.',
      ),
      kart(
        'Klimaks bölgeye göre değişir',
        'Süksesyon her yerde ormanla bitmez; çayır ya da çalılıkla da bitebilir.\nSon durağı iklim belirler.',
      ),
    ], [
      soru('Birincil süksesyon, daha önce canlı barındırmamış bir alanda başlar.', true, 'Kayalık ya da yeni soğumuş lav alanı buna örnek.'),
      soru('İkincil süksesyon birincilden daha hızlı ilerler.', true, 'Toprak zaten var; sıfırdan oluşması gerekmiyor.'),
      soru('Klimaks, süksesyonun en başındaki topluluktur.', false, 'En sonda ulaşılan kararlı topluluk.'),
      soru('Klimaks topluluğu her bölgede aynıdır.', false, 'İklime göre orman, bozkır ya da çöl bitki örtüsü olabiliyor.'),
      sikli('Çıplak kayada öncü tür çoğunlukla nedir?', ['Liken', 'Ağaç'], 0, 'Birincil süksesyon.'),
      sikli('Süksesyonun kararlı son aşaması?', ['Klimaks', 'Öncü'], 0, 'Tür bileşimi değişmez.'),
      soru('Klimaks her yerde ormandır.', false, 'İklime göre çayır ya da çalılık da olabilir.'),
    ], [
      {
        soru: 'Yangından sonra başlayan süksesyon hangi türdendir?',
        siklar: ['İkincil', 'Birincil'],
        dogru: 0,
        aciklama: {
          dogru: 'Toprak duruyor, tohum ve kök kalıntısı var; hızlı ilerler.',
          yanlis: 'Birincil süksesyon toprağın hiç olmadığı çıplak kayada başlar. Yangın toprağı bırakır; bu ikincil süksesyon.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-populasyon', 'Popülasyon Dinamikleri', [
      kart(
        'Büyümeyi belirleyenler',
        '- **Artıranlar:** doğum, içe göç\n- **Azaltanlar:** ölüm, dışa göç',
      ),
      kart(
        'Taşıma kapasitesi',
        'Ortamın sürekli besleyebileceği en büyük birey sayısıdır.\nAşılırsa popülasyon çöker.',
        {
          tur: 'koordinat',
          pencere: [0, 8, 0, 6],
          xAd: 'zaman',
          yAd: 'birey',
          egriler: [
            {
              noktalar: [
                [0, 0.3],
                [2, 1],
                [3.5, 2.6],
                [5, 4.2],
                [7.5, 4.7],
              ],
            },
            {
              noktalar: [
                [0, 4.9],
                [7.5, 4.9],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'taşıma kap.',
            },
          ],
        },
      ),
      kart(
        'Çevre direnci',
        'Büyümeyi sınırlayan etkenlerin tamamıdır:\nbesin kıtlığı, rekabet, avcı, hastalık',
      ),
      kart(
        'Yoğunluğa bağlı ve bağımsız',
        '- **Bağlı:** rekabet ve hastalık kalabalıkla şiddetlenir.\n- **Bağımsız:** kuraklık ve don, büyüklükten bağımsız etkiler.',
        undefined,
        { not: 'Salgın ve besin kıtlığı kalabalıkta artar (bağlı); don ve sel 10 bireyi de 10 bini de aynı vurur (bağımsız).' },
      ),
      kart(
        'Yaş piramidi',
        '- **Genç birey oranı yüksek:** popülasyon büyüyecek.\n- **Yaşlı ağırlıklı:** popülasyon küçülecek.',
      ),
      kart(
        'Popülasyon büyüklüğü nasıl ölçülür?',
        'Tek tek saymak çoğu zaman imkânsızdır.\n**İşaretle-yakala** yöntemiyle örneklemden tahmin edilir.',
      ),
    ], [
      soru(
        'Grafiğe göre popülasyon taşıma kapasitesine yaklaştıkça büyümesi yavaşlar.',
        true,
        'Eğri kesikli çizgiye yaklaşırken yataylaşıyor; çevre direnci artıyor.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 10],
          xAd: 'zaman',
          yAd: 'birey sayısı',
          egriler: [
            {
              noktalar: [
                [0, 0.5],
                [2, 1.2],
                [4, 3.5],
                [6, 6.5],
                [8, 7.6],
                [10, 7.9],
              ],
            },
            {
              noktalar: [
                [0, 8],
                [10, 8],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'taşıma kapasitesi',
            },
          ],
        },
      ),
      soru('Çevre direnci, popülasyonun sınırsız büyümesini engelleyen etmenlerin toplamıdır.', true, 'Besin, yer ve avcılar bu etmenlerden.'),
      soru('Salgın hastalıklar yoğunluğa bağlı olmayan bir etmendir.', false, 'Yoğunluk arttıkça bulaşma da artıyor; yoğunluğa bağlı bir etmen.'),
      soru('Geniş tabanlı yaş piramidi, küçülen bir popülasyonu gösterir.', false, 'Genç birey sayısı fazla demek; popülasyon büyüme eğiliminde.'),
      sikli('Ortamın besleyebileceği en büyük birey sayısı?', ['Çevre direnci', 'Taşıma kapasitesi'], 1, 'Aşılırsa çöker.'),
      sikli('Genç birey oranı yüksek piramit ne söyler?', ['Küçülecek', 'Popülasyon büyüyecek'], 1, 'Yaşlı ağırlıklıysa küçülür.'),
      soru('Popülasyon büyüklüğü işaretle-yakala yöntemiyle tahmin edilebilir.', true, 'Tek tek saymak çoğu zaman imkânsız.'),
    ], [
      {
        soru: 'Kuraklık popülasyonu hangi tür etkendir?',
        siklar: ['Yoğunluğa bağlı', 'Yoğunluktan bağımsız'],
        dogru: 1,
        aciklama: {
          dogru: 'Popülasyon büyük ya da küçük, kuraklık aynı şiddetle vurur.',
          yanlis: 'Yoğunluğa bağlı etkenler kalabalıkla şiddetlenir: rekabet, hastalık. Kuraklık ve don sayıya bakmaz.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-madde-enerji', 'Ekosistemde Madde ve Enerji Akışı', [
      kart(
        'Besin zinciri',
        'Üreticiden tüketiciye doğru tek yönlü enerji aktarımıdır.\nAyrıştırıcılar her basamağa bağlanır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Üretici' },
            { ad: '1. tüketici' },
            { ad: '2. tüketici' },
            { ad: 'Ayrıştırıcı', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Besin ağı',
        'Zincirlerin birbirine bağlanmış hâlidir.\nGerçek ekosistemler zincir değil, ağ biçimindedir.',
      ),
      kart(
        'Enerji piramidi',
        'Her basamağa enerjinin yaklaşık **onda biri** aktarılır.\nKalanı ısı olarak kaybolur.',
        {
          tur: 'katman',
          daralan: true,
          katmanlar: [
            { ad: 'Üreticiler', alt: '%100' },
            { ad: '1. tüketici', alt: '%10' },
            { ad: '2. tüketici', alt: '%1' },
            { ad: '3. tüketici', alt: '%0,1' },
          ],
        },
      ),
      kart(
        'Neden basamak azdır?',
        'Her adımda enerjinin çoğu kaybolur.\nBeşinci basamağa yetecek enerji kalmaz.',
      ),
      kart(
        'Enerji akar, madde döner',
        '- **Enerji:** Güneş’ten gelir, ısı olarak çıkar.\n- **Madde:** döngülerle sürekli yeniden kullanılır.',
        undefined,
        { not: 'Bugün nefes aldığın karbon dinozorlardan geçmiş olabilir; enerji ise Güneş\'ten gelip ısı olarak kayboldu.' },
      ),
      kart(
        'Biyolojik birikim',
        'Parçalanmayan zehirler her basamakta derişir.\nEn büyük zararı zincirin tepesindeki tür görür.',
      ),
      kart(
        'Neden bitkisel beslenme verimli?',
        'Doğrudan bitki tüketmek bir basamağı atlar.\nAynı alandan, o bitkiyle beslenen hayvanı yemekten yaklaşık on kat çok enerji alınır.',
      ),
    ], [
      soru(
        'Bir besin zincirinde enerjinin yaklaşık %10 u bir üst basamağa aktarılır.',
        true,
        'Kalanı solunum ve ısı olarak kaybediliyor.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Üretici' },
            { ad: 'Otçul' },
            { ad: 'Etçil' },
          ],
        },
      ),
      soru('Besin zincirinde basamak sayısının az olmasının sebebi enerji kaybıdır.', true, 'Yukarı çıkıldıkça taşınacak enerji kalmıyor.'),
      soru('Ekosistemde madde akar, enerji döner.', false, 'Tersi geçerli: enerji akar ve tükenir, madde döngülerle geri döner.'),
      soru('Biyolojik birikimde zararlı maddeler zincirin alt basamaklarında yoğunlaşır.', false, 'Üst basamaklarda yoğunlaşır; her basamakta birikerek artıyor.'),
      sikli('Ekosistemde enerji nasıl hareket eder?', ['Tek yönlü akar', 'Döngüyle döner'], 0, 'Madde döner, enerji akar.'),
      sikli('Parçalanmayan zehir zincirde ne yapar?', ['Her basamakta derişir', 'Seyrelir'], 0, 'Biyolojik birikim.'),
      sikli('Aynı alandan en çok enerjiyi kim alır?', ['Doğrudan bitkiyi tüketen', 'Etçil'], 0, 'On kat fark.'),
      soru('Gerçek ekosistemler zincir değil ağ biçimindedir.', true, 'Zincirler birbirine bağlı.'),
    ], [
      {
        soru: 'Enerji piramidinde bir basamaktan diğerine enerjinin ne kadarı geçer?',
        siklar: ['Yaklaşık %90', 'Yaklaşık %10'],
        dogru: 1,
        aciklama: {
          dogru: 'Kalan %90 ısı ve atık olarak kaybolur; bu yüzden basamak sayısı azdır.',
          yanlis: '%90 kaybolan kısım. Aktarılan yalnızca onda biri; beşinci basamağa enerji kalmamasının sebebi bu.',
        },
        kart: 3,
      },
    ]),
    konu('byl10-dongu', 'Madde Döngüleri', [
      kart(
        'Su döngüsü',
        'Buharlaşma → yoğuşma → yağış → akış\nDöngüyü çeviren motor Güneş enerjisidir.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Buharlaşma' },
            { ad: 'Yoğuşma' },
            { ad: 'Yağış' },
            { ad: 'Akış' },
          ],
        },
      ),
      kart(
        'Karbon döngüsü',
        '- **Fotosentez:** karbonu havadan alır.\n- **Solunum ve yanma:** karbonu havaya geri verir.\nFosil yakıtlar bu dengeyi bozdu.',
      ),
      kart(
        'Karbon depoları',
        'Atmosfer, okyanuslar, canlılar, toprak ve fosil yakıtlar.\nFosil yakıt, milyonlarca yıl kilitli kalmış karbondur.',
      ),
      kart(
        'Azot döngüsü',
        'Havadaki azotu canlılar doğrudan kullanamaz.\n- Bakteriler azotu bağlar.\n- Nitrifikasyon ve denitrifikasyon çevrimi tamamlar.',
      ),
      kart(
        'Neden azot bağlanmalı?',
        'Atmosferin dörtte üçü azottur ama N₂’deki üçlü bağ çok güçlüdür.\nOnu yalnızca bazı bakteriler ve yıldırım koparabilir.',
      ),
      kart(
        'Fosfor döngüsü',
        '**Gaz evresi yoktur**; kayaların aşınmasıyla toprağa geçer.\nEn yavaş döngüdür ve çoğu zaman sınırlayıcıdır.',
        undefined,
        { not: 'Fosfor atmosfere hiç çıkmaz; kayadan toprağa, oradan canlıya. En yavaş döngü. Karbon ve azot havadan geçer.' },
      ),
      kart(
        'Neden döngü şart?',
        'Dünyaya dışarıdan madde gelmez.\nElimizdeki atomlar sürekli yeniden kullanılır.',
      ),
    ], [
      soru(
        'Su döngüsünde su tüketilir ve yeryüzündeki toplam su miktarı azalır.',
        false,
        'Döngüde su tükenmez, yalnızca hâl ve yer değiştirir.',
        {
          tur: 'akis',
          donguSel: true,
          adimlar: [
            { ad: 'Buharlaşma' },
            { ad: 'Yoğunlaşma' },
            { ad: 'Yağış' },
            { ad: 'Akış' },
          ],
        },
      ),
      soru('Azot, canlıların çoğu tarafından havadaki hâliyle doğrudan kullanılamaz.', true, 'Önce bakteriler tarafından bağlanması gerekiyor.'),
      soru('Fosfor döngüsünün gaz hâlinde bir aşaması yoktur.', true, 'Kayaçlardan toprağa ve suya geçerek dolaşıyor.'),
      soru('Fotosentez ve solunum karbon döngüsünün parçası değildir.', false, 'İkisi döngünün temel iki halkası.'),
      sikli('Su döngüsünü çeviren enerji?', ['Yer çekimi', 'Güneş'], 1, 'Buharlaşmayı güneş sağlar.'),
      sikli('Havadaki azotu canlılar için bağlayan?', ['Bitkiler', 'Bakteriler'], 1, 'Yıldırım da.'),
      sikli('Fosil yakıt neyi bozdu?', ['Su döngüsünü', 'Karbon dengesini'], 1, 'Kilitli karbon havaya çıktı.'),
      soru('Dünyaya dışarıdan sürekli madde gelir.', false, 'Aynı atomlar yeniden kullanılır.'),
    ], [
      {
        soru: 'Hangi döngünün gaz evresi yoktur?',
        siklar: ['Fosfor', 'Karbon'],
        dogru: 0,
        aciklama: {
          dogru: 'Fosfor kayadan toprağa geçer; bu yüzden en yavaş döngü.',
          yanlis: 'Karbon atmosferde CO₂ olarak dolaşır. Gaz evresi olmayan ve kayaların aşınmasına bağlı olan fosfor.',
        },
        kart: 6,
      },
    ]),
    konu('byl10-surdurulebilirlik', 'Ekolojik Sürdürülebilirliğin Önemi', [
      kart(
        'Tanımı',
        'Doğal kaynakları, yenilenme hızını aşmadan kullanmaktır.\nBöylece gelecek kuşaklar da kullanabilir.',
      ),
      kart(
        'Ekosistem hizmetleri',
        'Temiz hava, su döngüsü, tozlaşma, toprak verimliliği.\nBedava sanılan bu hizmetler yerine konulamaz.',
      ),
      kart(
        'Neden acil?',
        'Tüketim hızı yenilenme hızını geçince açık büyür.\nGeri dönüş giderek zorlaşır.',
      ),
      kart(
        'Devrilme noktası',
        'Bazı değişimler bir eşiği geçince kendini hızlandırır.\nO noktadan sonra durdurmak çok daha zordur.',
        undefined,
        { not: 'Buzul eridikçe koyu deniz daha çok ısı emer, daha çok buzul erir: eşik geçilince döngü kendini besler.' },
      ),
      kart(
        'Ekonomiyle ilişkisi',
        'Sürdürülebilirlik üretimi durdurmak değildir.\nÜretimi doğanın yenilenme hızına uydurmaktır.',
      ),
      kart(
        'Üç ayak',
        '- Çevre\n- Ekonomi\n- Toplumsal adalet\nBiri gözetilmezse öbür ikisi de tutmaz.',
      ),
    ], [
      soru('Ekosistem hizmetleri, doğanın insana sağladığı yararlardır.', true, 'Temiz su, tozlaşma ve iklim düzenlemesi bunlardan.'),
      soru('Devrilme noktası, geri dönüşü çok zor olan bir eşiktir.', true, 'Eşik aşılınca sistem eski hâline kolayca dönemiyor.'),
      soru('Ekolojik sürdürülebilirliğin ekonomiyle ilgisi yoktur.', false, 'Üretim doğal kaynaklara dayanıyor; kaynak tükenince ekonomi de etkileniyor.'),
      soru('Sürdürülebilirlik yalnızca çevrenin korunması demektir.', false, 'Çevre, ekonomi ve toplum olmak üzere üç ayağı var.'),
      sikli('Tozlaşma ve temiz hava nedir?', ['Ekonomik kaynak', 'Ekosistem hizmeti'], 1, 'Bedava sanılan, yerine konulamayan.'),
      sikli('Eşiği geçince kendini hızlandıran değişim?', ['Süksesyon', 'Devrilme noktası'], 1, 'Durdurmak çok zorlaşır.'),
      soru('Sürdürülebilirlik yalnızca çevreyi gözetir.', false, 'Çevre, ekonomi ve toplumsal adalet.'),
    ], [
      {
        soru: 'Sürdürülebilirlik ne demektir?',
        siklar: ['Kaynağı yenilenme hızını aşmadan kullanmak', 'Kaynağı hiç kullanmamak'],
        dogru: 0,
        aciklama: {
          dogru: 'Kullanım serbest, sınır yenilenme hızı; gelecek kuşağa da kalsın diye.',
          yanlis: 'Üretimi durdurmak değil, doğanın yenilenme hızına uydurmak. Kaynak kullanılır ama yenilenme hızı aşılmaz.',
        },
        kart: 1,
      },
    ]),
    konu('byl10-kisitlayan', 'Sürdürülebilirliği Kısıtlayan Durumlar', [
      kart(
        'Habitat kaybı',
        'Tür kayıplarının en büyük sebebidir.\nYaşam alanı bölününce popülasyonlar kopar ve küçülür.',
      ),
      kart(
        'Habitat parçalanması',
        'Yol ve yerleşim bir alanı bölünce küçük popülasyonlar birbirinden yalıtılır.\nGen çeşitliliği düşer.',
      ),
      kart(
        'Kirlilik',
        '- Hava, su ve toprak kirliliği\n- Işık ve gürültü kirliliği\nCanlıların davranışını bozar.',
      ),
      kart(
        'Ötrofikasyon',
        'Sulara karışan gübre yosunu aşırı çoğaltır.\nÖlen yosunlar çürürken oksijen tükenir, balıklar ölür.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Gübre suya karışır' },
            { ad: 'Yosun patlaması' },
            { ad: 'Yosunlar ölür' },
            { ad: 'Oksijen tükenir', renk: 'ikincil' },
          ],
        },
        { not: 'Gübre → alg patlaması → alg ölür → bakteri çürütürken O₂ biter → balık ölür. Zincirin sonu \'ölü bölge\'.' },
      ),
      kart(
        'İstilacı türler',
        'Doğal düşmanı olmayan tür, yeni ortamda hızla çoğalır.\nYerli türleri dışlar.',
      ),
      kart(
        'Biyoçeşitlilik kaybı',
        'Tür azaldıkça ekosistemin şoklara dayanma gücü düşer.\nKayıp geri alınamaz.',
      ),
      kart(
        'İklim değişikliği',
        'Sıcaklık ve yağış düzeni değişince türlerin yayılış alanı kayar.\nUyum sağlayamayanlar yok olur.',
      ),
    ], [
      soru('Ötrofikasyon, sulara karışan aşırı besin maddeleri yüzünden oluşur.', true, 'Aşırı üreyen algler suyun oksijenini tüketiyor.'),
      soru('İstilacı türler yerli türlerle rekabete girerek biyoçeşitliliği azaltır.', true, 'Doğal düşmanları olmadığı için hızla yayılıyorlar.'),
      soru('Habitat parçalanması, toplam alan aynı kaldığı sürece zararsızdır.', false, 'Parçalar arası geçiş kesiliyor; küçük popülasyonlar yalnız kalıp risk altına giriyor.'),
      soru('Biyoçeşitlilik kaybının başlıca sebebi doğal afetlerdir.', false, 'Başta gelen sebep habitat kaybı gibi insan kaynaklı etkiler.'),
      sikli('Tür kayıplarının en büyük sebebi?', ['Işık kirliliği', 'Habitat kaybı'], 1, 'Yaşam alanı bölünür.'),
      sikli('Yol ve yerleşimin alanı bölmesi?', ['Ötrofikasyon', 'Habitat parçalanması'], 1, 'Gen çeşitliliği düşer.'),
      sikli('Doğal düşmanı olmayan yabancı tür?', ['Endemik tür', 'İstilacı tür'], 1, 'Yerli türleri dışlar.'),
      soru('Biyoçeşitlilik kaybı geri alınabilir.', false, 'Kayıp geri alınamaz.'),
    ], [
      {
        soru: 'Gübrenin suya karışmasıyla oksijenin tükenmesine ne denir?',
        siklar: ['Habitat parçalanması', 'Ötrofikasyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Aşırı besin yosunu çoğaltır, çürüyen yosun oksijeni bitirir.',
          yanlis: 'Habitat parçalanması yol ve yerleşimle alanın bölünmesi. Sudaki besin patlaması ve oksijen kaybı ötrofikasyon.',
        },
        kart: 4,
      },
    ]),
    konu('byl10-saglanmasi', 'Ekolojik Sürdürülebilirliğin Sağlanması', [
      kart(
        'Ekolojik ayak izi',
        'Bir kişinin ya da toplumun doğaya bindirdiği yükün **alan** cinsinden ölçüsüdür.\nKüçültmenin ilk adımı ölçmektir.',
      ),
      kart(
        'Nasıl küçültülür?',
        '- Enerji ve su tasarrufu\n- Toplu taşıma\n- Yerel ve mevsiminde beslenme\n- Gereksiz tüketimi azaltma',
      ),
      kart(
        'Atık yönetimi',
        'Sıra önemlidir:\nazalt → yeniden kullan → geri dönüştür',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Azalt' },
            { ad: 'Yeniden kullan' },
            { ad: 'Geri dönüştür' },
          ],
        },
        { not: 'Cam şişeyi geri dönüştürmek enerji ister; yeniden doldurmak istemez; hiç almamak hiçbir şey istemez.' },
      ),
      kart(
        'Korunan alanlar',
        '- **Millî park ve koruma alanları:** habitatı bütün hâlinde korur.\n- **Tohum bankaları:** gen çeşitliliğini saklar.',
      ),
      kart(
        'Ekolojik koridorlar',
        'Parçalanmış habitatları birbirine bağlayan şeritlerdir.\nPopülasyonların karışmasını ve gen akışını sürdürür.',
      ),
      kart(
        'Sürdürülebilir tarım',
        'Toprağı yormadan üretimin yolları:\n- Nöbetleşe ekim\n- Damla sulama\n- Biyolojik mücadele',
      ),
      kart(
        'Bireysel katkının sınırı',
        'Bireysel çaba önemlidir ama yeterli değildir.\nAsıl fark üretim ve enerji politikalarında ortaya çıkar.',
      ),
    ], [
      soru('Ekolojik ayak izi, doğaya bindirdiğimiz yükün ölçüsüdür.', true, 'Tükettiğimizi karşılamak için gereken alanı gösteriyor.'),
      soru('Ekolojik koridorlar, parçalanmış habitatlar arasında geçiş sağlar.', true, 'Popülasyonların birbirine karışmasını sürdürüyor.'),
      soru('Atık yönetiminde ilk basamak geri dönüşümdür.', false, 'İlk basamak atığı hiç oluşturmamak; geri dönüşüm sonra geliyor.'),
      soru('Bireysel önlemler tek başına ekolojik sürdürülebilirliği sağlar.', false, 'Bireysel çaba gerekli ama üretim ve politika düzeyinde karar alınmadan yetmiyor.'),
      sikli('Parçalanmış habitatları bağlayan şerit?', ['Ekolojik koridor', 'Tohum bankası'], 0, 'Gen akışını sürdürür.'),
      sikli('Nöbetleşe ekim ve damla sulama neye örnektir?', ['Sürdürülebilir tarım', 'Atık yönetimi'], 0, 'Toprağı yormadan üretim.'),
      sikli('Asıl fark nerede ortaya çıkar?', ['Üretim ve enerji politikalarında', 'Bireysel çabada'], 0, 'Bireysel çaba önemli ama yetmez.'),
      soru('Ekolojik ayak izini küçültmenin ilk adımı ölçmektir.', true, 'Ölçmeden azaltılamaz.'),
    ], [
      {
        soru: 'Atık yönetiminde ilk sırada ne gelir?',
        siklar: ['Azaltmak', 'Geri dönüştürmek'],
        dogru: 0,
        aciklama: {
          dogru: 'Oluşmayan atığın maliyeti sıfır; geri dönüşüm son çare.',
          yanlis: 'Geri dönüşüm enerji ve su ister, sıranın en sonunda. Önce azalt, sonra yeniden kullan, en son geri dönüştür.',
        },
        kart: 3,
      },
    ]),
  ]),
])
