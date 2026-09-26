import { kart, konu, program, tema } from '../tip'

/**
 * 11. sınıf Kimya — Maarif Modeli.
 *
 * Üç tema: Etkileşim (tepkimelerde enerji ve hız), Çeşitlilik (kimyasal
 * denge, asit-baz dengesi, çözünürlük dengesi), Sürdürülebilirlik (yeşil
 * hidrojen, nanoteknoloji, mikroplastikler). Konu adları ve sırası
 * `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski (2018) programdan taşınmayanlar: modern atom teorisi ve gazlar (11.
 * sınıfın ilk üniteleriydi), sıvı çözeltilerde koligatif özellikler,
 * elektrokimya. Asit-baz bu programda pH hesabı, titrasyon ve ürün seçimiyle
 * denge başlığının altında işleniyor.
 *
 * Sorular (turuncu kitaplar) henüz yazılmadı; destelerin ortasındaki hızlı
 * kontroller var.
 */
export const kimya11 = program('kimya', 11, 'Enerjiden dengeye, atıktan yakıta', [
  tema('kim11-t1', 'Etkileşim', [
    konu('kim11-enerji-degisim', 'Tepkimelerde Enerji Değişimi', [
      kart(
        'Sistem ve ortam',
        '- **Sistem:** incelenen madde ya da tepkime\n- **Ortam:** sistemin dışında kalan her şey\nEnerji, çoğu zaman ısı olarak, sistemle ortam arasında aktarılır.',
      ),
      kart(
        'Ekzotermik olay',
        'Sistem ortama **ısı verir**, ortam ısınır.\n**ΔH < 0**\nÖrnekler: yanma, nötralleşme, solunum, donma, yoğuşma',
      ),
      kart(
        'Endotermik olay',
        'Sistem ortamdan **ısı alır**, ortam soğur.\n**ΔH > 0**\nÖrnekler: erime, buharlaşma, fotosentez, suyun elektrolizi, CaCO₃’ın ayrışması',
      ),
      kart(
        'Entalpi',
        'Sabit basınçta bir maddenin ısı içeriğine **entalpi (H)** denir.\nEntalpinin kendisi ölçülemez, yalnızca değişimi ölçülür:\n**ΔH = H(ürünler) − H(tepkenler)**',
      ),
      kart(
        'Enerji diyagramı',
        '- **Ekzotermik:** ürünler tepkenlerden aşağıda, ΔH < 0\n- **Endotermik:** ürünler tepkenlerden yukarıda, ΔH > 0',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 7],
          eksenler: true,
          xAd: 'tepkime ilerleyişi',
          yAd: 'enerji',
          egriler: [
            {
              noktalar: [
                [0.3, 4],
                [2, 4],
                [3, 4.5],
                [4.2, 6],
                [5.4, 4.2],
                [6.4, 1.9],
                [7.2, 1.5],
                [9.7, 1.5],
              ],
            },
            {
              noktalar: [
                [2, 4],
                [9.2, 4],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [9.2, 4],
                [9.2, 1.6],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 1.3, y: 4.5, ad: 'tepkenler' },
            { x: 7.3, y: 2.1, ad: 'ürünler' },
            { x: 8.1, y: 3, ad: 'ΔH < 0', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Termokimyasal denklem',
        'Denklemin yanına ΔH yazılır ve maddelerin fiziksel hâli belirtilir.\nCH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(s)  ΔH = −890 kJ\n1 mol metan yandığında 890 kJ ısı açığa çıkar.',
      ),
      kart(
        'ΔH’nin kuralları',
        '- **Katsayı:** denklem 2 ile çarpılırsa ΔH de 2 ile çarpılır.\n- **Ters çevirme:** tepkime ters yazılırsa ΔH’nin işareti değişir.\n- **Fiziksel hâl:** H₂O(g) ile H₂O(s) oluşumunun ΔH’leri farklıdır.',
        undefined,
        { not: 'Tepkimeyi ters çevirdiysen ΔH’nin işaretini, katsayıyı değiştirdiysen büyüklüğünü de değiştir.' },
      ),
      kart(
        'Fiziksel olaylarda enerji',
        '- **Endotermik:** erime, buharlaşma, süblimleşme\n- **Ekzotermik:** donma, yoğuşma, kırağılaşma\nÇözünme ikisi de olabilir: NH₄NO₃ suda soğutur, NaOH ısıtır.',
      ),
      kart(
        'Kalorimetre',
        'Tepkimenin ısısı, yalıtılmış kaptaki suyun sıcaklık değişiminden ölçülür.\n**q = m · c · ΔT**\nSuyun öz ısısı c = 4,18 J/g·°C’dir.',
      ),
      kart(
        'Kalorimetre örneği',
        '100 g su tepkimeden sonra 20 °C’den 30 °C’ye ısınıyor:\nq = 100 · 4,18 · 10 = 4180 J ≈ **4,2 kJ**\nSu ısı kazandı, yani tepkime 4,2 kJ ısı verdi: ekzotermik.',
      ),
      kart(
        'Sıcak ve soğuk paketler',
        '- **Soğuk paket:** NH₄NO₃ suda çözünürken ısı alır, paket soğur.\n- **Sıcak paket:** demir tozunun oksitlenmesi ya da CaCl₂’nin çözünmesi ısı verir.\nİki olay da termometreyle kolayca gözlenir.',
      ),
      kart(
        'Enerji ve kararlılık',
        'Enerjisi düşük olan madde daha **kararlıdır**.\nEkzotermik tepkimede ürünler tepkenlerden kararlıdır; endotermikte tersidir.',
      ),
    ], [], [
      {
        soru: 'Buharlaşma ısı alan mı veren mi bir olaydır?',
        siklar: ['Isı alan (endotermik)', 'Isı veren (ekzotermik)'],
        dogru: 0,
        aciklama: {
          dogru: 'Tanecikler arası çekimi yenmek enerji ister; buharlaşma endotermik.',
          yanlis: 'Isı veren tersi, yoğuşma. Buharlaşmada sıvı ortamdan ısı çeker; ter bu yüzden serinletir.',
        },
        kart: 8,
      },
      {
        soru: 'ΔH = −100 kJ olan tepkime ters yazılırsa ΔH kaç olur?',
        siklar: ['−100 kJ', '+100 kJ'],
        dogru: 1,
        aciklama: {
          dogru: 'Ters tepkimede verilen ısı alınır: işaret değişir, +100 kJ.',
          yanlis: 'Ters yöndeki tepkime aynı ısıyı alır: ΔH’nin işareti değişir, +100 kJ.',
        },
        kart: 7,
      },
    ]),
    konu('kim11-enerji-kaynagi', 'Maddelerin Enerji Potansiyeli', [
      kart(
        'Kimyasal enerji',
        'Maddelerin bağlarında depolanmış enerjidir.\nTepkimede zayıf bağlar kırılıp güçlü bağlar kurulunca bu enerji açığa çıkar.\nYakıtlar ve besinler bu yüzden enerji kaynağıdır.',
      ),
      kart(
        'Yakıt ve yakma ısısı',
        'Yandığında çok enerji veren maddeye **yakıt** denir.\n**Yakma ısısı:** belli miktar yakıt tamamen yandığında açığa çıkan ısı\nkJ/g ya da kJ/mol ile verilir.',
      ),
      kart(
        'Yakıtların enerji değeri',
        'Kütle başına enerji (yaklaşık):',
        {
          tur: 'tablo',
          basliklar: ['Yakıt', 'kJ/g'],
          satirlar: [
            ['Hidrojen', '142'],
            ['Metan (doğal gaz)', '55'],
            ['Benzin', '47'],
            ['Etanol', '30'],
            ['Taş kömürü', '30'],
            ['Odun', '15'],
          ],
        },
      ),
      kart(
        'Gram başına mı mol başına mı?',
        '- **Mol başına:** H₂ 286 kJ/mol, CH₄ 890 kJ/mol\n- **Gram başına:** H₂ 142 kJ/g, CH₄ 55 kJ/g\nHangi yakıtın "daha iyi" olduğu seçilen ölçüte göre değişir.',
        undefined,
        { not: 'Yakıtları karşılaştırırken önce birimi kontrol et; mol başına az, gram başına çok olabilir.' },
      ),
      kart(
        'Besinler de yakıttır',
        'Hücre solunumu besinleri yavaş ve kontrollü yakar.\n- **Karbonhidrat:** ≈ 4 kcal/g (17 kJ)\n- **Protein:** ≈ 4 kcal/g (17 kJ)\n- **Yağ:** ≈ 9 kcal/g (37 kJ)',
      ),
      kart(
        'Besin etiketi',
        '**1 kcal = 4,18 kJ**\n30 g yağ içeren yiyecek: 30 · 9 = 270 kcal ≈ 1130 kJ\nEtiketteki "kalori" aslında kilokaloridir.',
      ),
      kart(
        'Fosil yakıtlar',
        'Kömür, petrol ve doğal gaz milyonlarca yılda oluştu.\n- Rezervleri sınırlıdır.\n- Yanınca CO₂ açığa çıkar ve sera etkisini artırır.\n- Kükürtlü olanlar SO₂ ile asit yağmuruna yol açar.',
      ),
      kart(
        'Yenilenebilir seçenekler',
        '- **Biyoetanol:** şeker ve nişastanın fermantasyonu\n- **Biyodizel:** bitkisel yağlardan\n- **Biyogaz:** atıklardan metan\n- **Hidrojen:** yenilenebilir enerjiyle ya da mikroorganizmalarla',
      ),
      kart(
        'İyi bir yakıtın ölçütleri',
        '- Birim kütlede yüksek enerji\n- Kolay depolanma ve taşınma\n- Düşük maliyet\n- Az kirletici ürün\n- Güvenli tutuşma\n- Yenilenebilir olma',
      ),
      kart(
        'Hipotez kurma',
        '"Alkanda karbon sayısı arttıkça mol başına yakma ısısı artar."\nVeri: metan 890, etan 1560, propan 2220 kJ/mol\nVeri hipotezi destekliyor; her CH₂ yaklaşık 650 kJ ekliyor.',
      ),
      kart(
        'Yalnızca yanma değil',
        'Piller kimyasal enerjiyi doğrudan elektriğe çevirir.\nLityum iyon pil, yakıt hücresi ve kurşun akü, maddelerin enerji kaynağı olmasının yanmasız örnekleridir.',
      ),
    ], [], [
      {
        soru: 'Kütle başına en çok enerji veren yakıt hangisidir?',
        siklar: ['Hidrojen', 'Benzin'],
        dogru: 0,
        aciklama: {
          dogru: 'Hidrojen gram başına ≈ 142 kJ ile benzinin üç katı enerji verir.',
          yanlis: 'Benzin ≈ 47 kJ/g. Hidrojen ≈ 142 kJ/g ile kütle başına en yüksek değerde.',
        },
        kart: 3,
      },
      {
        soru: '10 g yağ kaç kilokalori enerji verir?',
        siklar: ['40 kcal', '90 kcal'],
        dogru: 1,
        aciklama: {
          dogru: 'Yağ ≈ 9 kcal/g: 10 · 9 = 90 kcal.',
          yanlis: '4 kcal/g karbonhidrat ve protein için. Yağ ≈ 9 kcal/g, 10 g → 90 kcal.',
        },
        kart: 5,
      },
    ]),
    konu('kim11-bag-entalpi', 'Bağ Enerjileriyle Tepkime Entalpisi', [
      kart(
        'Bağ enerjisi',
        'Gaz hâlindeki 1 mol bağı koparmak için gereken enerjidir (kJ/mol).\nBağ enerjisi her zaman **pozitiftir**.\nDeğer ne kadar büyükse bağ o kadar sağlamdır.',
      ),
      kart(
        'Kırmak alır, kurmak verir',
        '- **Bağ kırılması:** enerji alır, endotermik\n- **Bağ oluşması:** enerji verir, ekzotermik\nAynı bağ için alınan ve verilen enerji eşittir.',
      ),
      kart(
        'Tepkime entalpisi',
        '**ΔH = Σ(kırılan bağlar) − Σ(oluşan bağlar)**\nKırılan bağlar tepkenlerde, oluşan bağlar ürünlerdedir.\nOluşan bağlar daha güçlüyse ΔH negatif çıkar.',
        undefined,
        { not: 'Bağ enerjisinde sıra "tepken − ürün"; oluşum entalpisinde "ürün − tepken". İkisini karıştırma.' },
      ),
      kart(
        'Ortalama bağ enerjileri',
        'Değerler kJ/mol, yaklaşık:',
        {
          tur: 'tablo',
          basliklar: ['Bağ', 'Enerji', 'Bağ · Enerji'],
          satirlar: [
            ['H–H', '436', 'O=O · 498'],
            ['Cl–Cl', '243', 'O–H · 463'],
            ['H–Cl', '432', 'C–H · 413'],
            ['C–C', '348', 'C=O · 799'],
          ],
        },
      ),
      kart(
        'Örnek: HCl oluşumu',
        'H₂(g) + Cl₂(g) → 2HCl(g)\n- **Kırılan:** 436 + 243 = 679 kJ\n- **Oluşan:** 2 · 432 = 864 kJ\n- **ΔH:** 679 − 864 = **−185 kJ**',
      ),
      kart(
        'Örnek: metanın yanması',
        'CH₄ + 2O₂ → CO₂ + 2H₂O(g)\n- **Kırılan:** 4 · 413 + 2 · 498 = 2648 kJ\n- **Oluşan:** 2 · 799 + 4 · 463 = 3450 kJ\n- **ΔH:** 2648 − 3450 = **−802 kJ**',
      ),
      kart(
        'Bağları doğru saymak',
        '- Önce her molekülün Lewis yapısını çiz.\n- Bağ sayısını katsayıyla çarp.\n- Çift ve üçlü bağları ayrı değerle al: C=O, C–O’dan farklıdır.',
      ),
      kart(
        'Çoklu bağ daha sağlam',
        '- C–C: 348, C=C: 614, C≡C: 839 kJ/mol\n- N≡N: 945 kJ/mol\nAzot gazının bu kadar tepkimesiz olmasının sebebi üçlü bağının sağlamlığıdır.',
      ),
      kart(
        'Sonuç yaklaşıktır',
        'Tablodaki bağ enerjileri birçok molekülün **ortalamasıdır**.\nHesap yalnızca gaz hâlindeki maddeler için yapılır.\nBu yüzden ölçülen ΔH ile küçük farklar çıkar: metanda −802 yerine −803 kJ.',
      ),
      kart(
        'Yanma neden ısı verir?',
        'O=O bağı görece zayıftır.\nÜrünlerdeki C=O ve O–H bağları çok daha sağlamdır.\nZayıf bağlar kırılıp güçlüler kurulduğu için fark ısı olarak açığa çıkar.',
      ),
    ], [], [
      {
        soru: 'Bağ oluşumu hangi tür olaydır?',
        siklar: ['Endotermik', 'Ekzotermik'],
        dogru: 1,
        aciklama: {
          dogru: 'Bağ kurulurken atomlar daha kararlı hâle geçer ve enerji açığa çıkar.',
          yanlis: 'Enerji alan olay bağ kırılması. Bağ oluşurken enerji verilir: ekzotermik.',
        },
        kart: 2,
      },
    ]),
    konu('kim11-olusum-entalpisi', 'Standart Oluşum Entalpileri', [
      kart(
        'Standart koşullar',
        'Termokimyada standart koşul: **25 °C ve 1 atm**\nBu koşullardaki entalpi değişimi ΔH° ile gösterilir.\nTablolardaki değerler bu koşullar içindir.',
      ),
      kart(
        'Standart oluşum entalpisi',
        '1 mol bileşiğin, standart hâldeki **elementlerinden** oluşurken gerçekleşen entalpi değişimidir.\nSembolü **ΔH°f**, birimi kJ/mol’dür.',
      ),
      kart(
        'Elementlerin değeri sıfır',
        'En kararlı hâlindeki elementin oluşum entalpisi **sıfırdır**.\n- O₂(g), H₂(g), N₂(g), C(grafit), Fe(k), Br₂(s) → 0\n- O₃(g) ve C(elmas) sıfır değildir: en kararlı hâl değiller.',
      ),
      kart(
        'Oluşum denklemi',
        'Ürün tek ve 1 moldür, tepkenler yalnızca elementlerdir.\nH₂(g) + ½O₂(g) → H₂O(s)  ΔH°f = −286 kJ/mol\n1 mol ürün için kesirli katsayı kullanılabilir.',
      ),
      kart(
        'Oluşum tepkimesi mi?',
        '- **2H₂ + O₂ → 2H₂O:** değil, 2 mol ürün oluşuyor.\n- **CO + ½O₂ → CO₂:** değil, CO element değil.\n- **C(grafit) + O₂ → CO₂:** evet, ΔH°f(CO₂) = −394 kJ/mol',
      ),
      kart(
        'Hesap formülü',
        '**ΔH°tepkime = Σ n · ΔH°f(ürünler) − Σ n · ΔH°f(tepkenler)**\nHer maddenin oluşum entalpisi denklemdeki katsayısıyla çarpılır.',
        undefined,
        { not: 'Sıra "ürünler − tepkenler"; her ΔH°f’yi katsayıyla çarpmayı ve elementleri sıfır almayı unutma.' },
      ),
      kart(
        'Oluşum entalpileri',
        'Değerler kJ/mol:',
        {
          tur: 'tablo',
          basliklar: ['Madde', 'ΔH°f'],
          satirlar: [
            ['CO₂(g)', '−394'],
            ['H₂O(s)', '−286'],
            ['H₂O(g)', '−242'],
            ['CH₄(g)', '−75'],
            ['NH₃(g)', '−46'],
            ['NO(g)', '+90'],
          ],
        },
      ),
      kart(
        'Örnek: metanın yanması',
        'CH₄ + 2O₂ → CO₂ + 2H₂O(s)\n- **Ürünler:** −394 + 2 · (−286) = −966\n- **Tepkenler:** −75 + 0 = −75\n- **ΔH°:** −966 − (−75) = **−891 kJ**',
      ),
      kart(
        'Bilinmeyen değer',
        'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O(s)  ΔH° = −2220 kJ\n3 · (−394) + 4 · (−286) − x = −2220\n−2326 − x = −2220 → ΔH°f(C₃H₈) = **−106 kJ/mol**',
      ),
      kart(
        'Neden işe yarıyor?',
        'Entalpi bir hâl fonksiyonudur: ΔH, yolun değil başlangıç ve sonun farkına bağlıdır.\nBir tepkime adımların toplamıysa ΔH’ler de toplanır.\nOluşum entalpisi yöntemi bu kuralın sonucudur.',
      ),
      kart(
        'Kararlılık yorumu',
        '- **Büyük negatif ΔH°f:** kararlı bileşik (CO₂, H₂O)\n- **Pozitif ΔH°f:** elementlerine göre enerji depolayan bileşik (NO +90, C₂H₂ +227)\nAsetilenin kaynak alevinde yüksek sıcaklık vermesi bundandır.',
      ),
      kart(
        'İki yöntem',
        '- **Bağ enerjisi:** kırılan − oluşan; ortalama değerlerle yaklaşık sonuç, yalnızca gazlar\n- **Oluşum entalpisi:** ürünler − tepkenler; ölçülmüş değerlerle daha kesin sonuç',
      ),
    ], [], [
      {
        soru: 'Hangisinin standart oluşum entalpisi sıfırdır?',
        siklar: ['O₂(g)', 'O₃(g)'],
        dogru: 0,
        aciklama: {
          dogru: 'Oksijenin en kararlı hâli O₂ gazı; oluşum entalpisi sıfır.',
          yanlis: 'Ozon oksijenin en kararlı hâli değil; ΔH°f(O₃) ≈ +143 kJ/mol. Sıfır olan O₂.',
        },
        kart: 3,
      },
      {
        soru: 'Oluşum entalpileriyle ΔH hesabında sıra hangisidir?',
        siklar: ['Tepkenler − ürünler', 'Ürünler − tepkenler'],
        dogru: 1,
        aciklama: {
          dogru: 'ΔH° = Σ ΔH°f(ürünler) − Σ ΔH°f(tepkenler).',
          yanlis: '"Tepken − ürün" bağ enerjisi yöntemidir. Oluşum entalpisinde sıra ürünler − tepkenler.',
        },
        kart: 6,
      },
    ]),
    konu('kim11-hiz-sartlar', 'Tepkimeler İçin Gerekli Şartlar', [
      kart(
        'Çarpışma teorisi',
        'Tepkime olması için tepken taneciklerinin **çarpışması** gerekir.\nAma her çarpışma tepkimeyle sonuçlanmaz; çoğu tanecik çarpışıp geri seker.',
      ),
      kart(
        'Etkin çarpışmanın iki şartı',
        '- **Enerji:** çarpışan taneciklerin enerjisi aktivasyon enerjisine eşit ya da büyük olmalı.\n- **Yönelim:** tanecikler uygun geometriyle, doğru uçlarından çarpışmalı.\nİki şartı birden sağlayan çarpışmaya **etkin çarpışma** denir.',
      ),
      kart(
        'Uygun yönelim örneği',
        'CO + NO₂ → CO₂ + NO\nCO’nun C atomu, NO₂’nin bir **O atomuna** çarpmalıdır.\nN atomuna çarpan CO, enerjisi yetse bile tepkime oluşturmaz.',
      ),
      kart(
        'Aktivasyon enerjisi',
        'Tepkimenin başlaması için gereken **en düşük** enerjidir (Ea).\n- Ea büyükse az tanecik aşabilir, tepkime yavaştır.\n- Ea küçükse tepkime hızlıdır.',
      ),
      kart(
        'Aktifleşmiş kompleks',
        'Eski bağların koparken yenilerinin kurulduğu, en yüksek enerjili geçiş hâlidir.\nÇok kararsız ve kısa ömürlüdür; ya ürüne ya da geri tepkenlere dönüşür.',
      ),
      kart(
        'Potansiyel enerji diyagramı',
        'Tepe noktası aktifleşmiş komplekstir; tepkenler oraya tırmanmak zorundadır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 8],
          eksenler: true,
          xAd: 'tepkime ilerleyişi',
          yAd: 'potansiyel enerji',
          egriler: [
            {
              noktalar: [
                [0.3, 3],
                [2, 3],
                [3.2, 3.8],
                [4.6, 6.8],
                [5.4, 6.8],
                [6.6, 3],
                [7.6, 1.6],
                [9.7, 1.5],
              ],
            },
            {
              noktalar: [
                [1.6, 7],
                [5, 7],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [1.6, 3],
                [1.6, 6.9],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 5, y: 7.5, ad: 'aktifleşmiş kompleks' },
            { x: 1, y: 2.4, ad: 'tepkenler' },
            { x: 0.9, y: 5, ad: 'Ea', renk: 'ikincil' },
            { x: 8.6, y: 2.1, ad: 'ürünler' },
          ],
        },
      ),
      kart(
        'Diyagramdan okumak',
        '- **Ea(ileri):** kompleksin enerjisi − tepkenlerin enerjisi\n- **Ea(geri):** kompleksin enerjisi − ürünlerin enerjisi\n- **ΔH:** Ea(ileri) − Ea(geri)',
      ),
      kart(
        'Örnek',
        'Ea(ileri) = 50 kJ, Ea(geri) = 80 kJ\nΔH = 50 − 80 = **−30 kJ**: tepkime ekzotermik.\nEkzotermik tepkimede geri yönün aktivasyon enerjisi her zaman büyüktür.',
      ),
      kart(
        'Ekzotermik tepkime de başlatılmalı',
        'Odun ısı veren bir tepkimeyle yanar ama kendiliğinden tutuşmaz.\nKibritin sürtünmesi aktivasyon enerjisini sağlar; sonra tepkimenin kendi ısısı yanmayı sürdürür.',
        undefined,
        { not: 'ΔH ile Ea ayrı şeyler: ekzotermik olmak tepkimenin hızlı ya da kendiliğinden olduğunu söylemez.' },
      ),
      kart(
        'Enerji dağılımı',
        'Aynı sıcaklıkta taneciklerin hepsi aynı enerjide değildir.\nYalnızca enerjisi Ea’dan büyük olan küçük bir kesir tepkimeye girer.\nSıcaklık artınca bu kesir büyür.',
      ),
      kart(
        'Kararlı ama yavaş',
        'Elmasın grafite dönüşmesi ekzotermiktir, yani "olması beklenir".\nAktivasyon enerjisi çok yüksek olduğu için milyonlarca yılda bile fark edilmez.\nEnerji "olur mu?", Ea "ne hızla?" sorusuna cevap verir.',
      ),
    ], [], [
      {
        soru: 'Yeterli enerjiyle çarpışan tanecikler mutlaka tepkimeye girer mi?',
        siklar: ['Evet', 'Hayır, yönelim de uygun olmalı'],
        dogru: 1,
        aciklama: {
          dogru: 'Etkin çarpışma için enerji ve uygun geometri birlikte gerekir.',
          yanlis: 'Enerji tek başına yetmez; tanecikler doğru uçlarından çarpışmalı.',
        },
        kart: 2,
      },
      {
        soru: 'Ea(ileri) 40, Ea(geri) 25 kJ ise tepkime nasıldır?',
        siklar: ['Endotermik, ΔH = +15 kJ', 'Ekzotermik, ΔH = −15 kJ'],
        dogru: 0,
        aciklama: {
          dogru: 'ΔH = Ea(ileri) − Ea(geri) = 40 − 25 = +15 kJ: endotermik.',
          yanlis: 'ΔH = 40 − 25 = +15 kJ, pozitif: tepkime endotermik.',
        },
        kart: 7,
      },
    ]),
    konu('kim11-ortalama-hiz', 'Ortalama Tepkime Hızı', [
      kart(
        'Tepkime hızı',
        'Birim zamanda tepken derişimindeki azalma ya da ürün derişimindeki artıştır.\nBirimi genellikle **mol/L · s** (M/s) olur.',
      ),
      kart(
        'Formül',
        '**r = −Δ[Tepken] / Δt = +Δ[Ürün] / Δt**\nTepken derişimi azaldığı için Δ negatiftir; eksi işareti hızı pozitif yapar.',
      ),
      kart(
        'Katsayılarla ilişki',
        'N₂ + 3H₂ → 2NH₃\n- H₂, N₂’den **3 kat** hızlı harcanır.\n- NH₃, N₂’nin harcanmasından **2 kat** hızlı oluşur.\nTepkimenin tek hızı: r = −Δ[N₂]/Δt = −⅓ Δ[H₂]/Δt = ½ Δ[NH₃]/Δt',
        undefined,
        { not: 'Maddelerin hızları katsayı oranındadır. Tepkimenin hızını yazarken her birini kendi katsayısına böl.' },
      ),
      kart(
        'Örnek hesap',
        '[A] 10 saniyede 0,50 M’den 0,30 M’ye iniyor:\nr = −(0,30 − 0,50) / 10 = **0,02 M/s**',
      ),
      kart(
        'Katsayılı örnek',
        '2N₂O₅ → 4NO₂ + O₂; N₂O₅ 0,02 M/s hızla harcanıyor.\n- **NO₂ oluşumu:** 0,04 M/s\n- **O₂ oluşumu:** 0,01 M/s\n- **Tepkime hızı:** 0,02 / 2 = 0,01 M/s',
      ),
      kart(
        'Hız zamanla azalır',
        'Tepkenler tükendikçe çarpışma sayısı azalır ve hız düşer.\nEğrinin eğimi başta dik, sonra yataydır.',
        {
          tur: 'koordinat',
          pencere: [0, 6.5, 0, 1.15],
          eksenler: true,
          xAd: 'zaman',
          yAd: 'derişim',
          egriler: [
            {
              noktalar: [
                [0, 1],
                [1, 0.6],
                [2, 0.37],
                [3, 0.22],
                [4, 0.14],
                [6, 0.05],
              ],
              ad: 'tepken',
            },
            {
              noktalar: [
                [0, 0],
                [1, 0.4],
                [2, 0.63],
                [3, 0.78],
                [4, 0.86],
                [6, 0.95],
              ],
              renk: 'ikincil',
              ad: 'ürün',
            },
          ],
        },
      ),
      kart(
        'Ortalama ve anlık hız',
        '- **Ortalama hız:** bir zaman aralığındaki toplam değişim / süre\n- **Anlık hız:** belli bir andaki hız, eğriye o noktada çizilen teğetin eğimi\nİlk aralığın ortalama hızı sonrakilerden büyüktür.',
      ),
      kart(
        'Hız nasıl izlenir?',
        'Zamanla değişen ölçülebilir bir özellik seçilir:\n- Renk (Br₂’nin kahverengisinin açılması)\n- Gaz hacmi ya da basıncı\n- Elektrik iletkenliği ya da pH\n- Kütle kaybı, bulanıklık',
      ),
      kart(
        'Gaz hacmiyle ölçüm',
        'Mg + 2HCl → MgCl₂ + H₂\nÇıkan H₂ şırıngada toplanır ve her 10 saniyede hacim okunur.\nHacim-zaman grafiğinin eğimi H₂’nin oluşma hızıdır.',
      ),
      kart(
        'Kütle kaybıyla ölçüm',
        'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂\nAçık kaptan CO₂ kaçtıkça terazideki kütle azalır.\nBirim zamandaki kütle kaybı hızı gösterir.',
      ),
      kart(
        'Grafik okuma',
        '- Tepken eğrisi azalır, ürün eğrisi artar.\n- Eğimlerin oranı katsayıların oranına eşittir.\n- Eğri yataylaşınca tepkime bitmiş ya da dengeye ulaşmıştır.',
      ),
    ], [], [
      {
        soru: 'N₂ + 3H₂ → 2NH₃ tepkimesinde hangisi en hızlı harcanır?',
        siklar: ['N₂', 'H₂'],
        dogru: 1,
        aciklama: {
          dogru: 'Katsayısı 3 olan H₂, N₂’den üç kat hızlı harcanır.',
          yanlis: 'Harcanma hızları katsayılarla orantılı: H₂’nin katsayısı 3, N₂’ninki 1.',
        },
        kart: 3,
      },
      {
        soru: 'Tepkime ilerledikçe hız genelde nasıl değişir?',
        siklar: ['Azalır', 'Artar'],
        dogru: 0,
        aciklama: {
          dogru: 'Tepken derişimi düştükçe çarpışma azalır ve hız düşer.',
          yanlis: 'Tepkenler tükendikçe birim hacimdeki tanecik ve çarpışma azalır; hız düşer.',
        },
        kart: 6,
      },
    ]),
    konu('kim11-hiz-faktor', 'Tepkime Hızına Etki Eden Faktörler', [
      kart(
        'Altı faktör',
        '- Tepkenlerin cinsi\n- Maddelerin fiziksel hâli\n- Derişim\n- Sıcaklık\n- Katı tepkenin temas yüzeyi\n- Katalizör',
      ),
      kart(
        'Tepken cinsi',
        '- **Zıt yüklü iyonlar:** bağ kırılmadığı için anında tepkime verir (Ag⁺ + Cl⁻ → AgCl).\n- **Moleküller:** bağ kırılması gerekir, daha yavaştır.\nKırılacak bağ sayısı ve sağlamlığı arttıkça tepkime yavaşlar.',
      ),
      kart(
        'Fiziksel hâl',
        '**Gaz > çözelti > katı**\nTanecikler ne kadar serbest hareket ediyorsa o kadar sık çarpışır.\nAynı hâldeki (homojen) karışımlar, farklı hâldekilerden hızlı tepkime verir.',
      ),
      kart(
        'Derişim',
        'Derişim artınca birim hacimdeki tanecik sayısı ve **çarpışma sayısı** artar, hız artar.\nGazlarda hacmi küçültmek ya da kısmi basıncı artırmak derişimi artırır.\nSaf katı ve sıvının derişimi değiştirilemez.',
      ),
      kart(
        'Sıcaklık',
        'Sıcaklık artınca:\n- Tanecikler hızlanır, çarpışma sayısı artar.\n- Enerjisi Ea’yı aşan taneciklerin **kesri** artar; asıl etki budur.\nKaba kural: 10 °C artış hızı yaklaşık iki katına çıkarır.',
      ),
      kart(
        'Sıcaklık ve enerji dağılımı',
        'Yüksek sıcaklıkta eğri sağa yayılır, Ea’nın sağındaki alan büyür.\nEa ise sıcaklıkla değişmez.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: true,
          xAd: 'kinetik enerji',
          yAd: 'tanecik sayısı',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 4.2],
                [2, 5],
                [3.5, 3],
                [5, 1.3],
                [7, 0.3],
                [9.5, 0.05],
              ],
            },
            {
              noktalar: [
                [0, 0],
                [1.5, 2.5],
                [3, 3.3],
                [4.5, 2.7],
                [6, 1.6],
                [8, 0.6],
                [9.8, 0.2],
              ],
              renk: 'ikincil',
            },
            {
              noktalar: [
                [6.5, 0],
                [6.5, 5.5],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
              ad: 'Ea',
            },
          ],
          etiketler: [
            { x: 2.4, y: 5.5, ad: 'T₁' },
            { x: 4.8, y: 3.5, ad: 'T₂ > T₁', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Temas yüzeyi',
        'Katı tepken parçalandıkça yüzeyi artar, daha çok tanecik çarpışmaya açılır.\n- Toz şeker kesme şekerden çabuk çözünür.\n- Un tozu havada patlayabilir.\n- Çiğnemek sindirimi hızlandırır.',
      ),
      kart(
        'Katalizör',
        'Tepkimeye girip değişmeden çıkan maddedir.\n- Tepkimeyi daha düşük Ea’lı başka bir yoldan yürütür.\n- İleri ve geri tepkimeyi aynı oranda hızlandırır.\n- ΔH’yi ve oluşan ürün miktarını değiştirmez.',
      ),
      kart(
        'Katalizörlü yol',
        'Katalizör tepeyi alçaltır; başlangıç ve bitiş seviyeleri aynı kalır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 8],
          eksenler: true,
          xAd: 'tepkime ilerleyişi',
          yAd: 'enerji',
          egriler: [
            {
              noktalar: [
                [0.3, 3],
                [2, 3],
                [3.2, 3.8],
                [4.6, 7],
                [5.4, 7],
                [6.6, 3],
                [7.6, 1.6],
                [9.7, 1.5],
              ],
            },
            {
              noktalar: [
                [2, 3],
                [3.4, 3.4],
                [4.6, 4.6],
                [5.4, 4.6],
                [6.6, 2.4],
                [7.6, 1.6],
              ],
              kesik: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 5, y: 7.5, ad: 'katalizörsüz' },
            { x: 5.2, y: 3.5, ad: 'katalizörlü', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Katalizör örnekleri',
        '- **Enzimler:** canlıdaki tepkimeleri hızlandırır; katalaz H₂O₂’yi parçalar.\n- **Katalitik konvertör:** Pt, Pd, Rh; egzozdaki CO ve NO’yu zararsızlaştırır.\n- **Haber yöntemi:** demir katalizör\n- **MnO₂:** H₂O₂’nin ayrışmasını hızlandırır.',
      ),
      kart(
        'İnhibitör',
        'Tepkimeyi **yavaşlatan** maddedir.\nGıdalardaki koruyucular ve antioksidanlar bozulma tepkimelerini yavaşlatır.\nBazı ilaçlar da enzimlerin inhibitörü olarak çalışır.',
      ),
      kart(
        'Günlük hayatta',
        '- **Buzdolabı:** düşük sıcaklık bozulmayı yavaşlatır.\n- **Düdüklü tencere:** yüksek sıcaklık pişmeyi hızlandırır.\n- **Çıra:** ince yongalar kütükten kolay tutuşur.\n- **Oksijen tüpü:** yüksek O₂ derişimi yanmayı şiddetlendirir.',
      ),
      kart(
        'Neyi değiştiriyorlar?',
        'Hızı artıran her etkinin sebebi aynı değildir.',
        {
          tur: 'tablo',
          basliklar: ['Etki', 'Çarpışma sayısı', 'Ea'],
          satirlar: [
            ['Derişimi artırmak', 'Artar', 'Değişmez'],
            ['Yüzeyi artırmak', 'Artar', 'Değişmez'],
            ['Sıcaklığı artırmak', 'Artar, etkin kesir de', 'Değişmez'],
            ['Katalizör eklemek', 'Etkin olan artar', 'Düşer'],
          ],
        },
        { not: 'Sıcaklık Ea’yı düşürmez; Ea’yı aşan tanecik sayısını artırır. Ea’yı düşüren tek etki katalizör.' },
      ),
    ], [], [
      {
        soru: 'Katalizör hangisini değiştirir?',
        siklar: ['ΔH’yi', 'Aktivasyon enerjisini'],
        dogru: 1,
        aciklama: {
          dogru: 'Katalizör daha düşük Ea’lı bir yol açar; ΔH aynı kalır.',
          yanlis: 'Başlangıç ve bitiş enerjileri değişmez, ΔH aynı. Katalizör Ea’yı düşürür.',
        },
        kart: 8,
      },
      {
        soru: 'Sıcaklık artınca hızın artmasının asıl sebebi hangisidir?',
        siklar: ['Ea’yı aşan tanecik kesri artar', 'Ea küçülür'],
        dogru: 0,
        aciklama: {
          dogru: 'Enerji dağılımı sağa kayar; Ea’yı aşan tanecik sayısı hızla artar.',
          yanlis: 'Ea sıcaklıkla değişmez. Değişen, Ea’yı aşabilen taneciklerin oranı.',
        },
        kart: 5,
      },
    ]),
    konu('kim11-hiz-denklemi', 'Hız Denkleminin Belirlenmesi', [
      kart(
        'Hız denklemi',
        'aA + bB → ürünler için:\n**r = k · [A]ᵐ · [B]ⁿ**\n- **k:** hız sabiti\n- **m, n:** A’ya ve B’ye göre tepkime dereceleri',
      ),
      kart(
        'Tek basamaklı tepkime',
        'Tepkime tek adımda gerçekleşiyorsa üsler **katsayılara eşittir**.\n2NO(g) + O₂(g) → 2NO₂(g) tek basamaklıysa:\nr = k · [NO]² · [O₂]',
      ),
      kart(
        'Katı ve sıvılar yazılmaz',
        'Saf katı ve saf sıvının derişimi sabittir; hız denklemine girmez.\nC(k) + O₂(g) → CO₂(g): **r = k · [O₂]**\nKatının etkisi temas yüzeyiyle ortaya çıkar, derişimle değil.',
      ),
      kart(
        'Tepkime derecesi',
        'Üslerin toplamıdır.\nr = k · [A]² · [B] için:\n- A’ya göre 2., B’ye göre 1. dereceden\n- Toplam tepkime derecesi **3**',
      ),
      kart(
        'Deneyle üs bulma',
        'Bir tepkenin derişimi değiştirilirken ötekiler sabit tutulur.\n- **Derişim 2 kat, hız 2 kat:** 1. derece\n- **Derişim 2 kat, hız 4 kat:** 2. derece\n- **Derişim 2 kat, hız değişmiyor:** 0. derece',
      ),
      kart(
        'Veri tablosu',
        '1 ve 2: [A] 2 kat, hız 4 kat → m = 2\n2 ve 3: [B] 2 kat, hız 2 kat → n = 1',
        {
          tur: 'tablo',
          basliklar: ['[A] (M)', '[B] (M)', 'Hız (M/s)'],
          satirlar: [
            ['0,1', '0,1', '2 · 10⁻³'],
            ['0,2', '0,1', '8 · 10⁻³'],
            ['0,2', '0,2', '1,6 · 10⁻²'],
          ],
        },
        { not: 'İki deneyi karşılaştırırken yalnızca bir derişimin değiştiği satırları seç.' },
      ),
      kart(
        'Tablodan sonuç',
        'Hız denklemi: **r = k · [A]² · [B]**\nk’yı herhangi bir deneyden bul:\nk = 2 · 10⁻³ / (0,1² · 0,1) = **2 L²/mol² · s**',
      ),
      kart(
        'Derişim değişirse hız',
        'r = k · [X]² · [Y] tepkimesinde [X] 3 katına, [Y] yarıya iniyor:\nYeni hız = 3² · ½ = **4,5 katı**',
      ),
      kart(
        'Hacim değişince',
        'Gaz tepkimesinde kabın hacmi yarıya inerse **bütün** gaz derişimleri 2 katına çıkar.\nr = k · [A]² · [B] için hız 2³ = **8 katına** çıkar.',
      ),
      kart(
        'Hız sabiti neye bağlı?',
        '- **Bağlı:** sıcaklık ve katalizör\n- **Bağlı değil:** derişim, hacim, basınç\nDerişim hızı değiştirir ama k’yı değiştirmez.',
      ),
      kart(
        'k’nın birimi',
        'Birim, hızın M/s çıkmasını sağlayacak şekildedir.\n- **1. derece:** s⁻¹\n- **2. derece:** L/mol · s\n- **3. derece:** L²/mol² · s',
      ),
      kart(
        'Çok basamaklı tepkimeler',
        'Çoğu tepkime birkaç adımda gerçekleşir; o zaman üsler katsayılardan okunamaz.\nHızı en yavaş adım belirler.\nBu yüzden hız denklemi hesapla değil **deneyle** bulunur.',
      ),
    ], [], [
      {
        soru: 'C(k) + O₂(g) → CO₂(g) için hız denklemi hangisidir?',
        siklar: ['r = k · [C] · [O₂]', 'r = k · [O₂]'],
        dogru: 1,
        aciklama: {
          dogru: 'Katı karbonun derişimi sabit, denkleme yazılmaz.',
          yanlis: 'Saf katının derişimi değişmez; hız denkleminde yalnızca O₂ yer alır.',
        },
        kart: 3,
      },
      {
        soru: 'Hız sabiti k hangisiyle değişir?',
        siklar: ['Sıcaklıkla', 'Derişimle'],
        dogru: 0,
        aciklama: {
          dogru: 'k sıcaklığa ve katalizöre bağlı; derişim yalnızca hızı değiştirir.',
          yanlis: 'Derişim hızı değiştirir ama k sabittir. k sıcaklık ve katalizörle değişir.',
        },
        kart: 10,
      },
    ]),
  ]),
  tema('kim11-t2', 'Çeşitlilik', [
    konu('kim11-tersinir', 'Tersinir Tepkimelerin Özellikleri', [
      kart(
        'Tek yönlü ve tersinir',
        '- **Tek yönlü:** tepkenler tükenene kadar sürer; yanma gibi (→)\n- **Tersinir:** ürünler de birbiriyle tepkimeye girip tepkenleri geri oluşturur (⇌)',
      ),
      kart(
        'Tersinir tepkime örnekleri',
        '- N₂(g) + 3H₂(g) ⇌ 2NH₃(g)\n- N₂O₄(g) ⇌ 2NO₂(g)\n- H₂(g) + I₂(g) ⇌ 2HI(g)\n- Hemoglobin + O₂ ⇌ oksihemoglobin',
      ),
      kart(
        'Kapalı kap şartı',
        'Ürünlerden biri ortamdan kaçıyorsa geri tepkime olamaz.\nCaCO₃ açık kapta ısıtılınca CO₂ uçar ve ayrışma **tamamlanır**.\nKapalı kapta ise CaCO₃ ⇌ CaO + CO₂ dengesi kurulur.',
      ),
      kart(
        'Dengeye ulaşma',
        '- Başta ileri tepkime hızlıdır, geri tepkime hiç yoktur.\n- Tepkenler azaldıkça ileri hız düşer, ürünler arttıkça geri hız yükselir.\n- İki hız eşitlenince sistem **dengeye** ulaşır.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: true,
          xAd: 'zaman',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 5.5],
                [1.5, 3.8],
                [3, 2.9],
                [5, 2.5],
                [9.5, 2.5],
              ],
            },
            {
              noktalar: [
                [0, 0],
                [1.5, 1.4],
                [3, 2.1],
                [5, 2.5],
                [9.5, 2.5],
              ],
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 1.6, y: 5, ad: 'ileri' },
            { x: 1.6, y: 0.7, ad: 'geri', renk: 'ikincil' },
            { x: 7.5, y: 3.2, ad: 'denge' },
          ],
        },
      ),
      kart(
        'Dinamik denge',
        'Dengede tepkimeler **durmaz**; ileri ve geri yönde eşit hızla sürer.\nBu yüzden renk, basınç, derişim ve kütle gibi gözlenebilir özellikler sabit kalır.',
      ),
      kart(
        'Derişimler eşit değildir',
        'Dengede derişimler **sabittir**, ama birbirine **eşit olmak zorunda değildir**.\nEşit olan ileri ve geri tepkimelerin hızıdır.',
        undefined,
        { not: '"Dengede tepken ve ürün miktarları eşittir" yanlış. Eşit olan hızlar, derişimler yalnızca sabit.' },
      ),
      kart(
        'Dengenin ölçütleri',
        '- Sistem kapalıdır.\n- Sıcaklık sabittir.\n- Gözlenebilir özellikler değişmez.\n- Tepkime iki yönde de yürür.',
      ),
      kart(
        'İki yönden ulaşılır',
        'Aynı denge hâline tepkenlerle başlayarak da, ürünlerle başlayarak da ulaşılabilir.\nH₂ ve I₂ ile de, yalnızca HI ile de başlansa aynı sıcaklıkta aynı dengeye varılır.',
      ),
      kart(
        'İki eğilim',
        '- **En düşük enerji eğilimi:** ekzotermik yönü, yani ısı veren yönü ister.\n- **En yüksek düzensizlik eğilimi:** gaz ve tanecik sayısı çok olan yönü ister.\nİki eğilim zıt yönlere çektiğinde tepkime dengeye ulaşır.',
      ),
      kart(
        'Gözlem: NO₂ tüpü',
        '2NO₂ (kahverengi) ⇌ N₂O₄ (renksiz)\n- Tüp sıcak suya konunca renk koyulaşır.\n- Buzlu suya konunca renk açılır.\nRengin iki yöne de değişmesi tepkimenin tersinir olduğunun kanıtıdır.',
      ),
      kart(
        'Verim %100 olmaz',
        'Tersinir tepkimede tepkenler hiçbir zaman tamamen tükenmez.\nEndüstride ürün ortamdan sürekli çekilerek dengenin ürün yönüne kayması sağlanır.',
      ),
    ], [], [
      {
        soru: 'Kimyasal dengede ileri ve geri tepkime hızları nasıldır?',
        siklar: ['Eşit', 'İkisi de sıfır'],
        dogru: 0,
        aciklama: {
          dogru: 'Denge dinamik: iki yön eşit hızla sürer, bu yüzden özellikler sabit.',
          yanlis: 'Tepkimeler durmaz; ileri ve geri yön eşit hızla sürer. Buna dinamik denge denir.',
        },
        kart: 5,
      },
      {
        soru: 'Dengede tepken ve ürün derişimleri eşit midir?',
        siklar: ['Evet, eşittir', 'Hayır, yalnızca sabittir'],
        dogru: 1,
        aciklama: {
          dogru: 'Derişimler sabit kalır ama farklı değerlerde olabilir.',
          yanlis: 'Eşit olan hızlar. Derişimler sabittir, eşit olmaları gerekmez.',
        },
        kart: 6,
      },
    ]),
    konu('kim11-fiziksel-denge', 'Fiziksel ve Kimyasal Denge', [
      kart(
        'Fiziksel denge',
        'Maddenin kimliği değişmeden iki hâl arasında kurulan dengedir.\nH₂O(s) ⇌ H₂O(g)\nKırılan ya da kurulan kimyasal bağ yoktur.',
      ),
      kart(
        'Buhar basıncı dengesi',
        'Kapalı kapta sıvı buharlaşır, buhar da yoğuşur.\nİki hız eşitlenince buhar basıncı **sabit** kalır.\nBu basınç sıcaklığa bağlıdır, sıvının miktarına bağlı değildir.',
      ),
      kart(
        'Çözünürlük dengesi',
        'Doygun çözeltide dipte katı varken:\nçözünme hızı = çökelme hızı\nŞeker kristali çözünür, çözeltideki şeker kristale geri tutunur; derişim değişmez.',
      ),
      kart(
        'Erime dengesi',
        '0 °C’de buz-su karışımı yalıtılmış kapta bekletilirse erime ve donma eşit hızla sürer.\nBuzun ve suyun miktarı değişmez.',
      ),
      kart(
        'Kimyasal denge',
        'Yeni maddelerin oluştuğu tersinir tepkimelerin dengesidir.\nN₂O₄(g) ⇌ 2NO₂(g)\nİleri ve geri yönde kimyasal bağlar kırılır ve yeniden kurulur.',
      ),
      kart(
        'Ortak özellikler',
        '- İkisi de **dinamiktir**.\n- İkisi de kapalı sistemde ve sabit sıcaklıkta kurulur.\n- İkisinde de gözlenebilir özellikler sabittir.\n- İkisi de dış etkiyle bozulup yeniden kurulabilir.',
      ),
      kart(
        'Farkları',
        'İki denge türü, kırılan bağın türüyle ayrılır.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Fiziksel', 'Kimyasal'],
          satirlar: [
            ['Madde kimliği', 'Korunur', 'Yeni madde oluşur'],
            ['Kırılan etkileşim', 'Moleküller arası', 'Kimyasal bağ'],
            ['Örnek', 'Buharlaşma-yoğuşma', 'NH₃ sentezi'],
          ],
        },
      ),
      kart(
        'Buhar basıncı neye bağlı?',
        '- **Sıcaklık:** arttıkça buhar basıncı artar.\n- **Sıvının cinsi:** moleküller arası çekim zayıfsa buhar basıncı yüksektir.\n- **Kabın hacmi:** değişse bile denge yeniden aynı basınçta kurulur.',
        undefined,
        { not: 'Buhar basıncı sıvı miktarına ve kap hacmine bağlı değil; yalnızca sıcaklığa ve sıvının cinsine bağlı.' },
      ),
      kart(
        'Gazlı içecek',
        'Kapalı şişede CO₂(g) ⇌ CO₂(suda) dengesi vardır.\nKapak açılınca gaz kaçar, denge bozulur ve çözünmüş CO₂ kabarcık olarak çıkar.\nİçecek bir süre sonra gazını kaybeder.',
      ),
      kart(
        'Kanda oksijen taşıma',
        'Hb + O₂ ⇌ HbO₂\n- **Akciğerde:** O₂ bol, denge sağa kayar, hemoglobin O₂ yükler.\n- **Dokuda:** O₂ az, denge sola kayar, O₂ bırakılır.',
      ),
    ], [], [
      {
        soru: 'Kapalı kaptaki suyun buhar basıncı neye bağlıdır?',
        siklar: ['Suyun miktarına', 'Sıcaklığa'],
        dogru: 1,
        aciklama: {
          dogru: 'Buhar basıncı sıcaklığa ve sıvının cinsine bağlı; miktar etkisiz.',
          yanlis: 'Sıvı miktarı değişse de buhar basıncı aynı kalır. Belirleyen sıcaklık.',
        },
        kart: 8,
      },
    ]),
    konu('kim11-denge-sabiti', 'Denge Sabiti', [
      kart(
        'Denge sabiti Kc',
        'aA + bB ⇌ cC + dD için:\n**Kc = [C]ᶜ · [D]ᵈ / ([A]ᵃ · [B]ᵇ)**\nDerişimler dengedeki mol/L değerleridir.',
      ),
      kart(
        'Yazma kuralları',
        '- Ürünler paya, tepkenler paydaya yazılır.\n- Katsayılar üs olur.\n- Saf katı ve saf sıvı yazılmaz.\n- Gazlar ve suda çözünmüş maddeler yazılır.',
      ),
      kart(
        'Yazım örnekleri',
        '- **N₂ + 3H₂ ⇌ 2NH₃:** Kc = [NH₃]² / ([N₂] · [H₂]³)\n- **CaCO₃(k) ⇌ CaO(k) + CO₂(g):** Kc = [CO₂]\n- **H₂O(s) ⇌ H₂O(g):** Kc = [H₂O(g)]',
      ),
      kart(
        'Kısmi basınçla Kp',
        'Gaz tepkimelerinde derişim yerine kısmi basınç kullanılabilir:\nKp = P(NH₃)² / (P(N₂) · P(H₂)³)\n**Kp = Kc · (RT)^Δn**, Δn gaz mollerindeki değişim\nΔn = 0 ise Kp = Kc.',
      ),
      kart(
        'K’nın büyüklüğü',
        '- **K ≫ 1:** dengede ürünler çoktur, tepkime büyük ölçüde ilerlemiştir.\n- **K ≪ 1:** dengede tepkenler çoktur.\n- **K ≈ 1:** ikisi de önemli miktardadır.\nK hızı değil, dengenin nerede kurulduğunu söyler.',
      ),
      kart(
        'K yalnızca sıcaklığa bağlı',
        'Derişim, basınç, hacim ve katalizör K’yı **değiştirmez**.\nBu etkiler dengeyi kaydırabilir ama sistem aynı K değerine döner.\nK’yı değiştiren tek etki sıcaklıktır.',
        undefined,
        { not: 'Denge kayması ile K’nın değişmesi ayrı şeyler; derişim dengeyi kaydırır ama K’ya dokunmaz.' },
      ),
      kart(
        'Denklem değişince K',
        '- **Ters çevirme:** K → 1 / K\n- **n ile çarpma:** K → Kⁿ (ikiye bölmek √K demek)\n- **İki tepkimeyi toplama:** K’lar çarpılır',
      ),
      kart(
        'Hesap örneği',
        'H₂ + I₂ ⇌ 2HI, dengede [H₂] = [I₂] = 0,1 M, [HI] = 0,8 M\nKc = 0,8² / (0,1 · 0,1) = 0,64 / 0,01 = **64**',
      ),
      kart(
        'Başlangıç-değişim-denge tablosu',
        '1 L kapta 1 mol H₂ ve 1 mol I₂; x mol H₂ tepkimeye giriyor:',
        {
          tur: 'tablo',
          basliklar: ['Madde', 'Başlangıç → değişim', 'Denge'],
          satirlar: [
            ['H₂', '1 → −x', '1 − x'],
            ['I₂', '1 → −x', '1 − x'],
            ['HI', '0 → +2x', '2x'],
          ],
        },
      ),
      kart(
        'Tablo ile çözüm',
        'Kc = 64 ise: (2x)² / (1 − x)² = 64\n- Karekök al: 2x / (1 − x) = 8\n- 2x = 8 − 8x → x = 0,8\nDengede [HI] = **1,6 M**, [H₂] = [I₂] = 0,2 M',
      ),
      kart(
        'Heterojen denge',
        'Farklı fazların bulunduğu dengedir.\n3Fe(k) + 4H₂O(g) ⇌ Fe₃O₄(k) + 4H₂(g)\n**Kc = [H₂]⁴ / [H₂O]⁴** — katılar yazılmaz.',
      ),
      kart(
        'Önce derişime çevir',
        'Mol sayısı verildiyse önce kabın hacmine bölerek mol/L bul.\n2 L kapta 0,4 mol NH₃ → [NH₃] = 0,2 M\nHacmi 1 L sanmak en sık yapılan hesap hatasıdır.',
      ),
    ], [], [
      {
        soru: 'CaCO₃(k) ⇌ CaO(k) + CO₂(g) için Kc nedir?',
        siklar: ['[CO₂]', '[CaO][CO₂] / [CaCO₃]'],
        dogru: 0,
        aciklama: {
          dogru: 'Saf katılar yazılmaz; yalnızca gaz olan CO₂ kalır.',
          yanlis: 'CaCO₃ ve CaO katı, derişimleri sabit: ifadeye girmez. Kc = [CO₂].',
        },
        kart: 3,
      },
      {
        soru: 'Kc = 4 olan tepkime ters yazılırsa yeni K kaçtır?',
        siklar: ['−4', '1/4'],
        dogru: 1,
        aciklama: {
          dogru: 'Ters tepkimede pay ile payda yer değiştirir: K → 1/K = 0,25.',
          yanlis: 'K negatif olamaz. Ters tepkimede ifade ters döner: 1/4.',
        },
        kart: 7,
      },
    ]),
    konu('kim11-tepkime-orani', 'Tepkime Oranı', [
      kart(
        'Tepkime oranı Q',
        'Kc ile **aynı biçimde** yazılır ama herhangi bir andaki derişimlerle hesaplanır.\nQ, sistemin o an dengeye göre nerede olduğunu söyler.',
      ),
      kart(
        'Q ile K karşılaştırması',
        '- **Q < K:** ürün az, tepkime **ileri** yönde ilerler.\n- **Q = K:** sistem dengededir.\n- **Q > K:** ürün fazla, tepkime **geri** yönde ilerler.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 10],
          isaretler: [5],
          parcalar: [
            { bas: 0, bit: 5, kapaliBit: false, ad: 'Q < K: ileri' },
            { bas: 5, bit: 10, kapaliBas: false, renk: 'ikincil', ad: 'Q > K: geri' },
          ],
          noktalar: [{ deger: 5, ad: 'K' }],
        },
      ),
      kart(
        'Neden bu yön?',
        'Q’nun payında ürünler vardır.\nQ küçükse ürünler azdır; sistem ürün üreterek Q’yu büyütür ve K’ya yaklaştırır.\nQ büyükse ürünler tepkenlere dönüşür.',
      ),
      kart(
        'Örnek 1',
        'A(g) ⇌ 2B(g), Kc = 4\nBir anda [A] = 1 M, [B] = 1 M:\nQ = 1² / 1 = 1 < 4 → tepkime **ileri** yönde ilerler.',
      ),
      kart(
        'Örnek 2',
        'H₂ + I₂ ⇌ 2HI, Kc = 64\n[H₂] = [I₂] = 0,1 M, [HI] = 1 M:\nQ = 1 / 0,01 = 100 > 64 → tepkime **geri** yönde ilerler.',
      ),
      kart(
        'Başta ürün yoksa',
        'Ürün derişimi sıfırsa Q = 0 olur.\nQ < K olduğu için tepkime kesinlikle **ileri** yönde başlar.\nTepken yoksa Q sonsuza gider, tepkime geri yönde başlar.',
      ),
      kart(
        'Q’yu doğru yazmak',
        '- Katı ve sıvılar yazılmaz.\n- Katsayılar üs olur.\n- Mol sayıları kabın hacmine bölünür.\nQ ile K aynı ifadeyle yazılmazsa karşılaştırma anlamsız olur.',
      ),
      kart(
        'Dengeye ulaştı mı?',
        'Zaman içinde ölçülen derişimlerle Q hesaplanır.\n- Q, K’ya yaklaşıyorsa sistem dengeye gidiyordur.\n- Q sabitlenip K’ya eşit olduysa denge kurulmuştur.',
      ),
      kart(
        'Dengeyi bozmak',
        'Dengedeki sisteme madde eklenir ya da çekilirse Q değişir ve K’dan ayrılır.\nSistem Q’yu yeniden K’ya getirecek yönde kayar.\nLe Chatelier ilkesinin hesap karşılığı budur.',
        undefined,
        { not: 'Kaymanın yönünü tahmin etmek yerine Q’yu hesapla: Q < K ileri, Q > K geri.' },
      ),
      kart(
        'Tek istisna: sıcaklık',
        'Sıcaklık değişince Q değil K değişir.\nQ artık yeni K’ya eşit olmadığı için sistem yine kayar.\nYön, tepkimenin ekzotermik ya da endotermik olmasına bağlıdır.',
      ),
    ], [], [
      {
        soru: 'Q = 20, K = 5 ise tepkime hangi yönde ilerler?',
        siklar: ['Geri', 'İleri'],
        dogru: 0,
        aciklama: {
          dogru: 'Q > K: ürünler fazla, tepkime geri yönde ilerleyip Q’yu küçültür.',
          yanlis: 'İleri yön Q < K iken. Burada Q büyük; ürünler tepkenlere dönüşür.',
        },
        kart: 2,
      },
    ]),
    konu('kim11-denge-faktor', 'Dengeyi Etkileyen Faktörler', [
      kart(
        'Le Chatelier ilkesi',
        'Dengedeki bir sisteme dışarıdan bir etki yapılırsa sistem bu etkiyi **azaltacak** yönde kayar.\nSonunda yeni bir denge kurulur; bu yeni dengede de aynı K geçerlidir (sıcaklık değişmediyse).',
      ),
      kart(
        'Derişim',
        '- **Tepken eklenirse:** ileri yöne kayar.\n- **Ürün eklenirse:** geri yöne kayar.\n- **Bir madde çekilirse:** o maddeyi yeniden üreten yöne kayar.\nK değişmez.',
      ),
      kart(
        'Katı ya da sıvı eklemek',
        'Saf katı ve sıvının derişimi sabittir.\nCaCO₃ ⇌ CaO + CO₂ dengesine CaCO₃ eklemek dengeyi **kaydırmaz**.',
      ),
      kart(
        'Hacim ve basınç',
        'Hacim küçültülürse (basınç artar) denge gaz mol sayısı **az** olan tarafa kayar.\nN₂ + 3H₂ ⇌ 2NH₃: 4 molden 2 mole → ürün yönü\nHacim büyütülürse mol sayısı çok olan tarafa kayar.',
      ),
      kart(
        'Mol sayısı eşitse',
        'H₂ + I₂ ⇌ 2HI: iki tarafta da 2 mol gaz\nHacim küçülünce bütün derişimler artar, renk koyulaşır.\nAma denge **kaymaz**, çünkü iki yön de aynı ölçüde etkilenir.',
      ),
      kart(
        'Soy gaz eklemek',
        '- **Sabit hacimde:** kısmi basınçlar ve derişimler değişmez, kayma yok.\n- **Sabit basınçta:** hacim büyür, derişimler düşer, gaz mol sayısı çok olan tarafa kayar.',
      ),
      kart(
        'Sıcaklık',
        'Isıyı bir madde gibi düşün:\n- **Endotermik:** ısı tepkenlerin yanında\n- **Ekzotermik:** ısı ürünlerin yanında\nSıcaklık artınca denge ısıyı harcayan, yani **endotermik** yöne kayar.',
      ),
      kart(
        'Sıcaklık K’yı değiştirir',
        '- **Ekzotermik tepkimede:** sıcaklık artarsa K küçülür.\n- **Endotermik tepkimede:** sıcaklık artarsa K büyür.\nDengeyi etkileyen faktörlerden K’yı değiştiren tek etki sıcaklıktır.',
      ),
      kart(
        'Katalizör',
        'İleri ve geri tepkimeyi **aynı oranda** hızlandırır.\nDengeye daha çabuk ulaşılır ama dengenin yeri ve K değişmez.\nÜrün miktarı artmaz.',
        undefined,
        { not: 'Katalizör dengeyi kaydırmaz, ürün verimini artırmaz; yalnızca dengeye daha çabuk ulaştırır.' },
      ),
      kart(
        'Özet',
        'Her etkide iki soru: denge nereye kayar, K değişir mi?',
        {
          tur: 'tablo',
          basliklar: ['Etki', 'Kayma', 'K'],
          satirlar: [
            ['Tepken eklemek', 'İleri', 'Değişmez'],
            ['Ürün çekmek', 'İleri', 'Değişmez'],
            ['Hacmi küçültmek', 'Az mol gaz yönüne', 'Değişmez'],
            ['Isıtmak', 'Endotermik yöne', 'Değişir'],
            ['Katalizör', 'Kayma yok', 'Değişmez'],
          ],
        },
      ),
      kart(
        'Haber-Bosch yöntemi',
        'N₂ + 3H₂ ⇌ 2NH₃  ΔH < 0\n- **Yüksek basınç (≈ 200 atm):** az mol yönü, ürün\n- **NH₃ sürekli çekilir:** denge ileri kayar\n- **≈ 450 °C + demir katalizör:** düşük sıcaklık verimi artırır ama çok yavaştır; uzlaşma',
      ),
      kart(
        'NO₂ tüpü ve sıcaklık',
        '2NO₂ (kahverengi) ⇌ N₂O₄ (renksiz)  ΔH < 0\n- **Isıtılınca:** endotermik yön, NO₂ artar, renk koyulaşır.\n- **Soğutulunca:** ekzotermik yön, renk açılır.',
      ),
      kart(
        'Yüksek rakımda nefes',
        'Dağda O₂’nin kısmi basıncı düşüktür: Hb + O₂ ⇌ HbO₂ dengesi sola kayar.\nDokulara daha az O₂ gider, baş ağrısı ve yorgunluk olur.\nVücut haftalar içinde daha çok hemoglobin üretip dengeyi yeniden sağa çeker.',
      ),
    ], [], [
      {
        soru: 'N₂ + 3H₂ ⇌ 2NH₃ dengesinde hacim küçültülürse denge nereye kayar?',
        siklar: ['Tepkenlere', 'Ürünlere'],
        dogru: 1,
        aciklama: {
          dogru: 'Basınç artınca denge gaz mol sayısı az olan tarafa, 2 mol NH₃’e kayar.',
          yanlis: 'Tepken tarafında 4 mol, ürün tarafında 2 mol gaz var; basınç artınca az mol tarafına kayar.',
        },
        kart: 4,
      },
      {
        soru: 'Dengeye katalizör eklenirse ne olur?',
        siklar: ['Dengeye daha çabuk ulaşılır', 'Ürün miktarı artar'],
        dogru: 0,
        aciklama: {
          dogru: 'İki yön de eşit hızlanır; denge değişmez, yalnızca daha çabuk kurulur.',
          yanlis: 'Katalizör iki yönü eşit hızlandırdığı için dengeyi kaydırmaz; ürün miktarı değişmez.',
        },
        kart: 9,
      },
    ]),
    konu('kim11-otoiyonizasyon', 'Suyun Otoiyonizasyonu', [
      kart(
        'Otoiyonizasyon',
        'Saf suda moleküllerin çok küçük bir kısmı birbirine proton aktarır:\n**H₂O + H₂O ⇌ H₃O⁺ + OH⁻**\nKısaca: H₂O ⇌ H⁺ + OH⁻',
      ),
      kart(
        'Saf su neden iyi iletmez?',
        'İyon derişimi çok düşüktür: 25 °C’de 10⁻⁷ M.\nYaklaşık 550 milyon su molekülünden yalnızca biri iyonlaşır.\nSaf su elektriği çok zayıf iletir.',
      ),
      kart(
        'Suyun iyonlaşma sabiti',
        '**Kw = [H⁺] · [OH⁻] = 1,0 · 10⁻¹⁴** (25 °C)\nSu saf sıvı olduğu için ifadeye yazılmaz.\nKw her sulu çözeltide geçerlidir.',
      ),
      kart(
        'Saf suda',
        '[H⁺] = [OH⁻] = 1,0 · 10⁻⁷ M\nİki iyon eşit olduğu için saf su **nötrdür**.',
      ),
      kart(
        'pH ve pOH',
        '- **pH = −log[H⁺]**\n- **pOH = −log[OH⁻]**\n- **pH + pOH = 14** (25 °C)',
      ),
      kart(
        'Asidik, nötr, bazik',
        '25 °C’de ölçek 0’dan 14’e okunur.',
        {
          tur: 'sayiDogrusu',
          aralik: [0, 14],
          isaretler: [0, 7, 14],
          parcalar: [
            { bas: 0, bit: 7, kapaliBas: true, kapaliBit: false, ad: 'asidik' },
            { bas: 7, bit: 14, kapaliBas: false, kapaliBit: true, renk: 'ikincil', ad: 'bazik' },
          ],
          noktalar: [{ deger: 7, ad: 'nötr' }],
        },
      ),
      kart(
        'Hesap örneği',
        '[H⁺] = 1 · 10⁻³ M olan çözelti:\n- pH = 3\n- pOH = 14 − 3 = 11\n- [OH⁻] = 10⁻¹¹ M',
      ),
      kart(
        'Asit eklenince',
        'Suya asit eklenince [H⁺] artar, [OH⁻] azalır.\nÇarpımları yine 10⁻¹⁴’tür.\nEn asidik çözeltide bile OH⁻ iyonu **sıfır olmaz**.',
      ),
      kart(
        'Sıcaklığın etkisi',
        'Suyun iyonlaşması endotermiktir; sıcaklık artınca Kw büyür.\n60 °C’de saf suyun pH’ı ≈ 6,5’tir.\nAma su yine **nötrdür**, çünkü [H⁺] = [OH⁻].',
        undefined,
        { not: 'pH 7 nötr demek yalnızca 25 °C’de doğru. Nötrlüğün ölçüsü [H⁺] = [OH⁻] olmasıdır.' },
      ),
      kart(
        'Gündelik pH değerleri',
        'Yaklaşık değerler:',
        {
          tur: 'tablo',
          basliklar: ['Madde', 'pH'],
          satirlar: [
            ['Mide özsuyu', '1–2'],
            ['Limon suyu', '2'],
            ['Kahve', '5'],
            ['Kan', '7,4'],
            ['Deniz suyu', '8'],
            ['Çamaşır suyu', '12–13'],
          ],
        },
      ),
      kart(
        'Logaritmik ölçek',
        'pH’taki 1 birimlik fark [H⁺]’da **10 kat** fark demektir.\npH 3 olan çözelti, pH 5 olandan 100 kat daha fazla H⁺ içerir.',
      ),
    ], [], [
      {
        soru: '25 °C’de pH’ı 4 olan çözeltinin pOH’ı kaçtır?',
        siklar: ['10', '4'],
        dogru: 0,
        aciklama: {
          dogru: 'pH + pOH = 14 → pOH = 10.',
          yanlis: 'pH ile pOH’ın toplamı 14: 14 − 4 = 10.',
        },
        kart: 5,
      },
      {
        soru: '60 °C’de pH’ı 6,5 olan saf su nasıldır?',
        siklar: ['Asidik', 'Nötr'],
        dogru: 1,
        aciklama: {
          dogru: 'Saf suda [H⁺] = [OH⁻] her sıcaklıkta; pH 7’den küçük olsa da nötr.',
          yanlis: 'pH 7 ölçütü yalnızca 25 °C içindir. Saf suda iki iyon eşit: nötr.',
        },
        kart: 9,
      },
    ]),
    konu('kim11-asit-baz-teori', 'Asit ve Baz Teorileri', [
      kart(
        'Arrhenius asidi',
        'Suda çözündüğünde **H⁺** iyonu veren maddedir.\nHCl(suda) → H⁺ + Cl⁻\nH⁺ suda tek başına durmaz, H₃O⁺ (hidronyum) olarak bulunur.',
      ),
      kart(
        'Arrhenius bazı',
        'Suda çözündüğünde **OH⁻** iyonu veren maddedir.\nNaOH(suda) → Na⁺ + OH⁻\nCa(OH)₂ bir formül biriminden iki OH⁻ verir.',
      ),
      kart(
        'Arrhenius’un sınırları',
        '- Yalnızca sulu çözeltileri açıklar.\n- NH₃ formülünde OH⁻ yoktur ama suyu bazik yapar; Arrhenius bunu açıklayamaz.\n- Gaz fazındaki HCl + NH₃ tepkimesini asit-baz olarak göremez.',
      ),
      kart(
        'Brønsted-Lowry tanımı',
        '- **Asit:** proton (H⁺) veren tanecik\n- **Baz:** proton alan tanecik\nSu şartı yoktur; tanım bir tepkimedeki proton alışverişine bakar.',
      ),
      kart(
        'NH₃ örneği',
        'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻\n- NH₃ proton alır → **baz**\n- H₂O proton verir → **asit**\nOH⁻ sudan geldiği için NH₃ bazik çözelti oluşturur.',
      ),
      kart(
        'Konjuge asit-baz çifti',
        'Birbirinden yalnızca bir protonla ayrılan iki taneciktir.\n- HCl / Cl⁻\n- NH₄⁺ / NH₃\n- H₃O⁺ / H₂O\n- H₂O / OH⁻',
        undefined,
        { not: 'Çift bulurken proton farkına bak: protonu fazla olan asit, eksik olan konjuge bazdır.' },
      ),
      kart(
        'Çiftleri bulma',
        'HF + H₂O ⇌ F⁻ + H₃O⁺\n- **1. çift:** HF (asit) / F⁻ (konjuge baz)\n- **2. çift:** H₂O (baz) / H₃O⁺ (konjuge asit)\nHer tepkimede iki çift vardır.',
      ),
      kart(
        'Amfoter tanecik',
        'Karşısındakine göre hem asit hem baz davranabilen taneciktir.\n- **H₂O:** HCl ile baz, NH₃ ile asit\n- **HCO₃⁻:** proton verip CO₃²⁻, alıp H₂CO₃ olur\nAl(OH)₃ ve Zn(OH)₂ hem asitle hem bazla tepkime verir.',
      ),
      kart(
        'İki teori yan yana',
        'Brønsted-Lowry, Arrhenius’u kapsar.',
        {
          tur: 'tablo',
          basliklar: ['Teori', 'Asit', 'Baz'],
          satirlar: [
            ['Arrhenius', 'Suda H⁺ verir', 'Suda OH⁻ verir'],
            ['Brønsted-Lowry', 'Proton verir', 'Proton alır'],
          ],
        },
      ),
      kart(
        'Kapsama ilişkisi',
        'Her Arrhenius asidi bir Brønsted-Lowry asididir.\nTersi doğru değildir: NH₃ ile tepkimede proton veren H₂O Brønsted asididir, Arrhenius asidi değildir.\nBrønsted-Lowry daha çok tepkimeyi açıklar.',
      ),
      kart(
        'Asitlerin ve bazların özellikleri',
        '- **Asitler:** mavi turnusolü kırmızıya çevirir; aktif metallerle H₂ açığa çıkarır.\n- **Bazlar:** kırmızı turnusolü maviye, fenolftaleini pembeye çevirir; ele kayganlık hissi verir.\nLaboratuvarda tatma ve dokunma ile tanınmaz.',
      ),
      kart(
        'Günlük hayattan',
        '- **Asitler:** sirke (asetik asit), limon (sitrik asit), akü (sülfürik asit), mide (HCl)\n- **Bazlar:** sabun, çamaşır sodası, amonyak, lavabo açıcı (NaOH), kireç (Ca(OH)₂)',
      ),
    ], [], [
      {
        soru: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ tepkimesinde su nasıl davranır?',
        siklar: ['Asit', 'Baz'],
        dogru: 0,
        aciklama: {
          dogru: 'Su NH₃’e proton veriyor ve OH⁻’ye dönüşüyor: Brønsted asidi.',
          yanlis: 'Proton alan NH₃. Proton veren su, bu tepkimede asit gibi davranıyor.',
        },
        kart: 5,
      },
      {
        soru: 'H₂O’nun konjuge bazı hangisidir?',
        siklar: ['H₃O⁺', 'OH⁻'],
        dogru: 1,
        aciklama: {
          dogru: 'Konjuge baz bir proton eksiktir: H₂O − H⁺ = OH⁻.',
          yanlis: 'H₃O⁺ bir proton fazladır, konjuge asit. Proton kaybı OH⁻ verir.',
        },
        kart: 7,
      },
    ]),
    konu('kim11-asit-kuvvet', 'Asitlerin ve Bazların Kuvveti', [
      kart(
        'Kuvvetli ve zayıf',
        '- **Kuvvetli:** suda **tamamen** iyonlaşır, tek yönlü (→).\n- **Zayıf:** suda **kısmen** iyonlaşır, denge kurulur (⇌).\nKuvvet, iyonlaşmanın ne kadar tamamlandığıdır.',
      ),
      kart(
        'Kuvvetli asitler ve bazlar',
        '- **Asitler:** HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄\n- **Bazlar:** 1A metallerinin hidroksitleri (NaOH, KOH), Ca(OH)₂, Ba(OH)₂\nListede olmayanların çoğu zayıftır.',
      ),
      kart(
        'Zayıf asitler ve bazlar',
        '- **Asitler:** CH₃COOH (asetik), HF, H₂CO₃, HCN, H₃PO₄\n- **Bazlar:** NH₃, organik aminler\nÇözeltide iyonların yanında iyonlaşmamış moleküller de bulunur.',
      ),
      kart(
        'Kuvvet derişim değildir',
        '- **Kuvvet:** iyonlaşma yüzdesi\n- **Derişim:** litredeki madde miktarı\nDerişik bir zayıf asit de seyreltik bir kuvvetli asit de olabilir; "sulu ve kuvvetli" ayrı sorulardır.',
        undefined,
        { not: '"Kuvvetli" ile "derişik"i karıştırma: 0,001 M HCl kuvvetli ama seyreltik bir asittir.' },
      ),
      kart(
        'Asitlik sabiti Ka',
        'HA ⇌ H⁺ + A⁻\n**Ka = [H⁺] · [A⁻] / [HA]**\nKa büyüdükçe asit kuvvetlenir.',
      ),
      kart(
        'Bazlık sabiti Kb',
        'B + H₂O ⇌ BH⁺ + OH⁻\n**Kb = [BH⁺] · [OH⁻] / [B]**\nKb büyüdükçe baz kuvvetlenir. NH₃ için Kb ≈ 1,8 · 10⁻⁵',
      ),
      kart(
        'Ka · Kb = Kw',
        'Bir konjuge çift için: **Ka · Kb = 1,0 · 10⁻¹⁴**\n- Asit ne kadar kuvvetliyse konjuge bazı o kadar zayıftır.\n- HCl çok kuvvetli, Cl⁻ ise baz gibi davranamayacak kadar zayıftır.',
      ),
      kart(
        'Zayıf asitlerin sırası',
        'Ka değerleri 25 °C’de:',
        {
          tur: 'tablo',
          basliklar: ['Asit', 'Ka'],
          satirlar: [
            ['HF', '6,8 · 10⁻⁴'],
            ['CH₃COOH', '1,8 · 10⁻⁵'],
            ['H₂CO₃ (1. basamak)', '4,3 · 10⁻⁷'],
            ['HCN', '4,9 · 10⁻¹⁰'],
          ],
        },
      ),
      kart(
        'Deneyle karşılaştırma',
        'Aynı derişimdeki kuvvetli ve zayıf asit:\n- **İletkenlik:** kuvvetli asitte lamba daha parlak yanar.\n- **Mg ile tepkime:** kuvvetli asitte gaz çıkışı daha hızlıdır.\n- **pH:** kuvvetli asitte daha düşüktür.',
      ),
      kart(
        'İyonlaşma yüzdesi',
        '**% iyonlaşma = [H⁺] / C · 100**\n0,1 M asetik asitte [H⁺] ≈ 1,3 · 10⁻³ M → yaklaşık %1,3\nZayıf asit seyreltildikçe iyonlaşma yüzdesi artar.',
      ),
      kart(
        'Çok protonlu asitler',
        'H₂SO₄ ve H₃PO₄ gibi asitler protonlarını **basamak basamak** verir.\nHer basamak bir öncekinden zayıftır: H₃PO₄’ün Ka₁ > Ka₂ > Ka₃\nH₂SO₄’ün yalnızca ilk basamağı kuvvetlidir.',
      ),
      kart(
        'Kuvvetin yapıyla ilişkisi',
        '- **Hidrojen halojenürler:** HF < HCl < HBr < HI; bağ zayıfladıkça proton kolay kopar.\n- **Oksiasitler:** HClO < HClO₂ < HClO₃ < HClO₄; oksijen arttıkça kuvvet artar.',
      ),
    ], [], [
      {
        soru: 'Hangisi zayıf asittir?',
        siklar: ['HNO₃', 'CH₃COOH'],
        dogru: 1,
        aciklama: {
          dogru: 'Asetik asit suda kısmen iyonlaşır; Ka ≈ 1,8 · 10⁻⁵.',
          yanlis: 'HNO₃ tamamen iyonlaşan kuvvetli bir asit. Zayıf olan asetik asit.',
        },
        kart: 3,
      },
      {
        soru: 'Kuvvetli bir asidin konjuge bazı nasıldır?',
        siklar: ['Çok zayıf', 'Çok kuvvetli'],
        dogru: 0,
        aciklama: {
          dogru: 'Ka · Kb = Kw: Ka büyüdükçe konjuge bazın Kb’si küçülür.',
          yanlis: 'Ka · Kb sabit olduğu için kuvvetli asidin konjuge bazı çok zayıftır; Cl⁻ gibi.',
        },
        kart: 7,
      },
    ]),
    konu('kim11-ph', 'Kuvvetli ve Zayıf Asit-Bazlarda pH', [
      kart(
        'Kuvvetli asitte pH',
        'Tamamen iyonlaştığı için tek protonlu kuvvetli asitte **[H⁺] = C**.\n- 0,01 M HCl → [H⁺] = 10⁻² → pH = 2\n- 0,1 M HNO₃ → pH = 1',
      ),
      kart(
        'Kuvvetli bazda pH',
        '[OH⁻] = C · (formüldeki OH sayısı)\n- 0,01 M NaOH → pOH = 2 → **pH = 12**\n- 0,005 M Ca(OH)₂ → [OH⁻] = 0,01 → **pH = 12**',
      ),
      kart(
        'Seyreltmenin etkisi',
        'Kuvvetli asit 10 kat seyreltilince [H⁺] 10 kat azalır, pH **1 artar**.\npH 2 olan HCl → 10 kat seyreltme → pH 3\nAsit ne kadar seyreltilse de pH 7’yi geçmez.',
        undefined,
        { not: 'Asidi suyla seyreltmek onu baz yapmaz: pH 7’ye yaklaşır ama aşmaz, çünkü suyun kendi H⁺’ı devreye girer.' },
      ),
      kart(
        'Zayıf asitte pH',
        'HA ⇌ H⁺ + A⁻, başlangıç derişimi C:\nKa = x² / (C − x) ≈ x² / C\n**[H⁺] = x ≈ √(Ka · C)**',
      ),
      kart(
        'Örnek: asetik asit',
        '0,1 M CH₃COOH, Ka = 1,8 · 10⁻⁵\n[H⁺] ≈ √(1,8 · 10⁻⁶) ≈ 1,34 · 10⁻³ M\n**pH ≈ 2,87**',
      ),
      kart(
        'Yaklaşım ne zaman geçerli?',
        'C − x ≈ C varsayımı, x derişimin %5’inden küçükse geçerlidir.\nAsetik asitte x/C ≈ %1,3: yaklaşım uygun.\nKa büyük ya da C çok küçükse ikinci dereceden denklem çözülür.',
      ),
      kart(
        'Zayıf bazda pH',
        '0,1 M NH₃, Kb = 1,8 · 10⁻⁵\n[OH⁻] ≈ √(Kb · C) ≈ 1,34 · 10⁻³ M\npOH ≈ 2,87 → **pH ≈ 11,13**',
      ),
      kart(
        'Aynı derişim, farklı pH',
        '0,1 M çözeltilerin pH değerleri:',
        {
          tur: 'tablo',
          basliklar: ['Çözelti', 'Tür', 'pH'],
          satirlar: [
            ['HCl', 'Kuvvetli asit', '1'],
            ['CH₃COOH', 'Zayıf asit', '≈ 2,9'],
            ['NH₃', 'Zayıf baz', '≈ 11,1'],
            ['NaOH', 'Kuvvetli baz', '13'],
          ],
        },
      ),
      kart(
        'pH’tan Ka bulma',
        '0,1 M HA çözeltisinin pH’ı 3:\n- [H⁺] = [A⁻] = 10⁻³ M\n- Ka = (10⁻³)² / 0,1 = **10⁻⁵**',
      ),
      kart(
        'Logaritma ipuçları',
        '- log 2 ≈ 0,3, log 3 ≈ 0,48, log 5 ≈ 0,7\n- [H⁺] = 2 · 10⁻³ → pH = 3 − 0,3 = 2,7\n- pH = 4,7 → [H⁺] = 2 · 10⁻⁵ M',
      ),
      kart(
        'Adım adım çözüm',
        '- Asit mi baz mı, kuvvetli mi zayıf mı?\n- Kuvvetliyse doğrudan derişim; zayıfsa √(K · C)\n- Bazda önce pOH, sonra pH = 14 − pOH',
      ),
    ], [], [
      {
        soru: '0,001 M HCl çözeltisinin pH’ı kaçtır?',
        siklar: ['3', '11'],
        dogru: 0,
        aciklama: {
          dogru: 'Kuvvetli asit: [H⁺] = 10⁻³ M → pH = 3.',
          yanlis: '11 pOH olurdu. HCl tamamen iyonlaşır: [H⁺] = 10⁻³, pH = 3.',
        },
        kart: 1,
      },
      {
        soru: 'Aynı derişimde HCl ile CH₃COOH’tan hangisinin pH’ı küçüktür?',
        siklar: ['CH₃COOH', 'HCl'],
        dogru: 1,
        aciklama: {
          dogru: 'HCl tamamen iyonlaşır, daha çok H⁺ verir: pH daha küçük.',
          yanlis: 'Asetik asit kısmen iyonlaşır, H⁺ azdır. HCl’nin pH’ı daha küçük.',
        },
        kart: 8,
      },
    ]),
    konu('kim11-notrallesme', 'Nötralleşme Tepkimeleri', [
      kart(
        'Nötralleşme',
        'Asit ile bazın tepkimeye girip tuz ve su oluşturmasıdır.\n**Net iyon denklemi: H⁺ + OH⁻ → H₂O**\nTepkime ekzotermiktir.',
      ),
      kart(
        'Örnekler',
        '- HCl + NaOH → NaCl + H₂O\n- H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O\n- HNO₃ + NH₃ → NH₄NO₃\nSonuncuda su oluşmaz ama proton aktarımı yine nötralleşmedir.',
      ),
      kart(
        'Tam nötralleşme koşulu',
        'Asidin verdiği H⁺ molü bazın verdiği OH⁻ molüne eşit olmalıdır.\n**M(asit) · V(asit) · (H sayısı) = M(baz) · V(baz) · (OH sayısı)**',
      ),
      kart(
        'Örnek hesap',
        '0,2 M 50 mL HCl’yi nötrlemek için kaç mL 0,1 M NaOH gerekir?\n- n(H⁺) = 0,2 · 0,05 = 0,01 mol\n- V = 0,01 / 0,1 = 0,1 L = **100 mL**',
      ),
      kart(
        'Artan varsa pH',
        '0,02 mol HCl ile 0,01 mol NaOH karıştırılıp hacim 1 L yapılıyor:\n- 0,01 mol H⁺ artar → [H⁺] = 0,01 M\n- Buradan pH = **2**\nÖnce hangisinin arttığını bul, sonra artanın derişimini hesapla.',
      ),
      kart(
        'Tuzun pH’ı',
        '- **Kuvvetli asit + kuvvetli baz:** nötr tuz (NaCl)\n- **Kuvvetli asit + zayıf baz:** asidik tuz (NH₄Cl)\n- **Zayıf asit + kuvvetli baz:** bazik tuz (CH₃COONa)',
      ),
      kart(
        'Nötralleşme ≠ pH 7',
        'Eşit mollerde asit ve baz tepkimeye girse bile çözelti ancak kuvvetli-kuvvetli çiftte pH 7 olur.\nZayıf bir bileşenden gelen iyon suyla tepkimeye girip çözeltiyi asidik ya da bazik yapar.',
        undefined,
        { not: '"Nötralleşme bitti, pH 7" her zaman doğru değil. Önce asidin ve bazın kuvvetine bak.' },
      ),
      kart(
        'Açığa çıkan ısı',
        'Kuvvetli asit ile kuvvetli bazın nötralleşmesinde her 1 mol su için ≈ 56 kJ ısı açığa çıkar.\nKarışımın sıcaklığı yükselir; bu, nötralleşmenin gözlenebilir işaretidir.',
      ),
      kart(
        'Nötralleşmeyi gözlemek',
        '- **Sıcaklık:** karışım ısınır.\n- **İndikatör:** renk değişir.\n- **pH ölçer:** değer 7’ye doğru ilerler.\n- **İletkenlik:** H⁺ ve OH⁻ tükendikçe azalır.',
      ),
      kart(
        'Günlük hayatta',
        '- **Mide ekşimesi:** antiasit (Mg(OH)₂, CaCO₃) fazla asidi nötrler.\n- **Arı sokması:** asidik, sabunlu suyla hafifletilir.\n- **Asitli toprak:** kireçleme ile düzeltilir.\n- **Diş macunu:** bakterilerin ürettiği asidi nötrler.',
      ),
      kart(
        'Güvenlik',
        '- Derişik asit seyreltilirken **asit suya** yavaşça eklenir, tersi yapılmaz.\n- Derişik asit-baz karıştırmak şiddetli ısı verir.\n- Dökülen asit NaHCO₃ ile nötrlenip temizlenir.',
      ),
    ], [], [
      {
        soru: 'Nötralleşmenin net iyon denklemi hangisidir?',
        siklar: ['H⁺ + OH⁻ → H₂O', 'Na⁺ + Cl⁻ → NaCl'],
        dogru: 0,
        aciklama: {
          dogru: 'Tuz iyonları seyirci kalır; asıl olay H⁺ ile OH⁻’nin suya dönüşmesi.',
          yanlis: 'Na⁺ ve Cl⁻ çözeltide değişmeden kalır. Asıl tepkime H⁺ + OH⁻ → H₂O.',
        },
        kart: 1,
      },
      {
        soru: 'CH₃COOH ile NaOH eşit molde tepkimeye girerse çözelti nasıl olur?',
        siklar: ['Nötr', 'Bazik'],
        dogru: 1,
        aciklama: {
          dogru: 'Zayıf asit + kuvvetli baz bazik tuz verir: CH₃COO⁻ suyla OH⁻ oluşturur.',
          yanlis: 'Nötr tuz yalnızca kuvvetli asit-kuvvetli baz çiftinde. Burada tuz bazik.',
        },
        kart: 6,
      },
    ]),
    konu('kim11-titrasyon', 'Asit-Baz Titrasyonları', [
      kart(
        'Titrasyon',
        'Derişimi bilinen bir çözeltiyle (**standart çözelti**) derişimi bilinmeyen çözeltinin derişiminin bulunmasıdır.\nAsit-baz titrasyonu nötralleşme tepkimesine dayanır.',
      ),
      kart(
        'Düzenek',
        '- **Büret:** standart çözeltiyi damla damla ve ölçerek verir.\n- **Erlenmayer:** derişimi aranan çözelti ve indikatör\n- **Sabit ayak ve kıskaç:** büreti dik tutar',
      ),
      kart(
        'Eşdeğerlik noktası',
        'Eklenen bazın OH⁻ molünün asidin H⁺ molüne **tam eşit** olduğu andır.\nKuvvetli asit-kuvvetli baz titrasyonunda bu noktada pH = 7’dir.',
      ),
      kart(
        'Dönüm noktası',
        'İndikatörün rengini değiştirdiği andır; titrasyon burada durdurulur.\nİyi seçilmiş indikatörde dönüm noktası eşdeğerlik noktasına çok yakındır.',
        undefined,
        { not: 'Eşdeğerlik hesaplanan an, dönüm gözlenen an. İndikatör doğru seçilirse ikisi neredeyse çakışır.' },
      ),
      kart(
        'İndikatörler',
        'İndikatör, rengi pH’a göre değişen zayıf bir asit ya da bazdır.',
        {
          tur: 'tablo',
          basliklar: ['İndikatör', 'Aralık', 'Renk'],
          satirlar: [
            ['Fenolftalein', '8,2–10', 'Renksiz → pembe'],
            ['Metil oranj', '3,1–4,4', 'Kırmızı → sarı'],
            ['Bromtimol mavisi', '6,0–7,6', 'Sarı → mavi'],
          ],
        },
      ),
      kart(
        'Titrasyon eğrisi',
        'Kuvvetli asidin üstüne kuvvetli baz eklendikçe pH önce yavaş artar.\nEşdeğerlik çevresinde birkaç damlayla **sıçrar**.',
        {
          tur: 'koordinat',
          pencere: [0, 42, 0, 14],
          eksenler: true,
          xAd: 'eklenen baz (mL)',
          yAd: 'pH',
          egriler: [
            {
              noktalar: [
                [0, 1],
                [10, 1.3],
                [20, 1.9],
                [24, 2.7],
                [25, 7],
                [26, 11.3],
                [30, 12.1],
                [40, 12.5],
              ],
            },
          ],
          noktalar: [{ x: 25, y: 7, ad: 'eşdeğerlik' }],
        },
      ),
      kart(
        'Hesap',
        '25 mL HCl, 0,1 M NaOH ile titre ediliyor; 20 mL harcanıyor.\nM(asit) · 25 = 0,1 · 20\n**M(asit) = 0,08 M**',
      ),
      kart(
        'İki protonlu asit',
        'H₂SO₄ gibi asitlerde her mol iki H⁺ verir:\n**M(asit) · V(asit) · 2 = M(baz) · V(baz)**\n10 mL H₂SO₄’ü 0,1 M NaOH’tan 20 mL nötrlüyorsa M(asit) = 0,1 M.',
      ),
      kart(
        'Uygulama adımları',
        '- Büret standart çözeltiyle doldurulur, başlangıç hacmi okunur.\n- Erlenmayere ölçülü çözelti ve 2–3 damla indikatör konur.\n- Damla damla eklenir, erlenmayer sürekli çalkalanır.\n- Renk kalıcı değişince durulur, harcanan hacim okunur.',
      ),
      kart(
        'Hata kaynakları',
        '- Büreti menisküsün altından ve göz hizasından okumamak\n- Büretin ucunda hava kabarcığı kalması\n- Dönüm noktasını birkaç damla aşmak\n- Tek deneyle yetinmek; en az üç tekrarın ortalaması alınır',
      ),
      kart(
        'Nerede kullanılır?',
        '- Sirkedeki asetik asit oranı\n- Sütün ve meyve sularının asitliği\n- İlaçların etken madde kontrolü\n- Havuz ve atık suyun analizi',
      ),
    ], [], [
      {
        soru: 'Titrasyonda indikatörün renk değiştirdiği ana ne denir?',
        siklar: ['Eşdeğerlik noktası', 'Dönüm noktası'],
        dogru: 1,
        aciklama: {
          dogru: 'Rengin değiştiği, gözlenen an dönüm noktası.',
          yanlis: 'Eşdeğerlik, mollerin eşitlendiği hesaplanan an. Rengin döndüğü an dönüm noktası.',
        },
        kart: 4,
      },
      {
        soru: '20 mL HCl’yi 0,2 M NaOH’tan 10 mL nötrlüyor. HCl kaç M?',
        siklar: ['0,1 M', '0,4 M'],
        dogru: 0,
        aciklama: {
          dogru: 'M · 20 = 0,2 · 10 → M = 0,1.',
          yanlis: 'Hacimleri doğru eşleştir: M(asit) · 20 = 0,2 · 10 → 0,1 M.',
        },
        kart: 7,
      },
    ]),
    konu('kim11-urun-secimi', 'Asidik ve Bazik Ürün Seçimi', [
      kart(
        'Ürünlerin pH’ı',
        'Evdeki temizlik, kozmetik ve gıda ürünlerinin çoğu asidik ya da baziktir.\nDoğru ürün, temizlenecek kirin ve yüzeyin kimyasına göre seçilir.',
      ),
      kart(
        'Kireç ve pas için asit',
        'Kireç (CaCO₃) bazik davranan bir tuzdur.\nSirke ya da limon tuzu (sitrik asit) kireci çözer:\nCaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂\nÇaydanlık, duş başlığı ve lavabo kireci böyle temizlenir.',
      ),
      kart(
        'Yağ ve kir için baz',
        'Yağlı kir bazik ürünlerle sabunlaşır ve suyla akar.\n- Sabun, çamaşır sodası (Na₂CO₃)\n- Fırın temizleyici, lavabo açıcı (NaOH)\nKuvvetli bazlar deriye ve göze zarar verir; eldiven şarttır.',
      ),
      kart(
        'Asla karıştırma',
        '- **Çamaşır suyu + tuz ruhu (HCl):** zehirli Cl₂ gazı\n- **Çamaşır suyu + amonyaklı ürün:** zehirli kloramin gazları\n"Daha iyi temizler" diye iki ürünü karıştırmak zehirlenmelere yol açar.',
        undefined,
        { not: 'Çamaşır suyunu asitli ya da amonyaklı hiçbir ürünle karıştırma; çıkan gazlar zehirli.' },
      ),
      kart(
        'Cildin pH’ı',
        'Sağlıklı cilt hafif asidiktir: pH ≈ 5,5.\nBu asidik katman mikroplara karşı koruma sağlar.\nSabun (pH 9–10) bu katmanı bozup cildi kurutabilir; pH’ı cilde yakın ürünler daha az tahriş eder.',
      ),
      kart(
        'Saç bakımı',
        'Bazik ortamda saçın dış pulcukları açılır, saç mat ve kırılgan görünür.\nHafif asidik şampuan ve bakım kremi pulcukları kapatır, saçı parlatır.',
      ),
      kart(
        'Antiasit seçimi',
        'Mide HCl ile asidiktir; fazlası yanmaya yol açar.\n- **Uygun:** zayıf bazlar; Mg(OH)₂, Al(OH)₃, NaHCO₃, CaCO₃\n- **Asla:** NaOH gibi kuvvetli bazlar, dokuyu yakar',
      ),
      kart(
        'Toprak pH’ı',
        'Bitkilerin çoğu pH 6–7 arasını sever.\n- **Asitli toprağa:** kireç (CaCO₃) eklenir.\n- **Bazik toprağa:** kükürt ya da organik madde eklenir.\nOrtanca çiçeği asitli toprakta mavi, bazik toprakta pembe açar.',
      ),
      kart(
        'Yüzeye göre seçim',
        '- **Mermer ve traverten:** CaCO₃ içerir, sirke ve asitli ürünle aşınır.\n- **Alüminyum:** kuvvetli bazla aşınır.\n- **Derz ve taş:** önce görünmeyen bir köşede denenir.',
      ),
      kart(
        'Etiket okuma',
        '- pH ya da "asidik/bazik" bilgisi\n- Aşındırıcı (korozif) ve tahriş edici simgeleri\n- "Başka ürünlerle karıştırmayınız" uyarısı\n- Eldiven, gözlük, havalandırma önerisi',
      ),
      kart(
        'Karar ölçütleri',
        '- **Etkinlik:** kiri gerçekten çözüyor mu?\n- **Güvenlik:** sağlığa ve yüzeye zararı var mı?\n- **Çevre:** biyobozunur mu, fosfat içeriyor mu?\n- **Yeterlilik:** iş için gereğinden güçlü mü?',
      ),
    ], [], [
      {
        soru: 'Çaydanlıktaki kireç hangi ürünle temizlenir?',
        siklar: ['Sirke', 'Sabun'],
        dogru: 0,
        aciklama: {
          dogru: 'Kireç CaCO₃; asidik sirke onu CO₂ çıkararak çözer.',
          yanlis: 'Sabun bazik ve yağ için. Kireç bazik bir tuz, asitle çözülür: sirke.',
        },
        kart: 2,
      },
      {
        soru: 'Mermer tezgâh hangi ürünle silinmemelidir?',
        siklar: ['Hafif sabunlu su', 'Asitli temizleyici'],
        dogru: 1,
        aciklama: {
          dogru: 'Mermer CaCO₃; asit onu çözer ve yüzeyi matlaştırır.',
          yanlis: 'Hafif sabunlu su mermere zarar vermez. Asit CaCO₃’ı çözdüğü için mermeri aşındırır.',
        },
        kart: 9,
      },
    ]),
    konu('kim11-molar-cozunurluk', 'Molar Çözünürlük', [
      kart(
        'Az çözünen tuzlar',
        'AgCl, BaSO₄, CaCO₃, PbI₂ gibi tuzlar suda **çok az** çözünür.\n"Çözünmez" denen tuzlar da aslında az miktarda çözünür.\nÇözünen kısım tamamen iyonlarına ayrılır.',
      ),
      kart(
        'Çözünürlük dengesi',
        'Doygun çözeltide dibe çökmüş katı ile iyonlar arasında denge kurulur:\n**AgCl(k) ⇌ Ag⁺(suda) + Cl⁻(suda)**\nÇözünme ve çökelme hızları eşittir.',
      ),
      kart(
        'Molar çözünürlük',
        'Belli sıcaklıkta 1 L doygun çözeltide çözünebilen tuzun **mol sayısıdır**.\nSembolü **s**, birimi mol/L’dir.',
      ),
      kart(
        'İyon derişimleri',
        'İyon derişimleri formüldeki sayılarla s’nin çarpımıdır.\n- **AgCl:** [Ag⁺] = s, [Cl⁻] = s\n- **PbI₂:** [Pb²⁺] = s, [I⁻] = 2s\n- **Ca₃(PO₄)₂:** [Ca²⁺] = 3s, [PO₄³⁻] = 2s',
        undefined,
        { not: 'İyonun katsayısını s’nin önüne yaz: PbI₂’de iyot iyonu 2s, sonra üs olarak da girecek.' },
      ),
      kart(
        'g/L’den mol/L’ye',
        'Çözünürlük gram olarak verilirse mol kütlesine bölünür.\nBaSO₄: 2,33 · 10⁻³ g/L, mol kütlesi 233 g/mol\ns = 2,33 · 10⁻³ / 233 = **1 · 10⁻⁵ M**',
      ),
      kart(
        'Örnek hesap',
        'PbI₂’nin molar çözünürlüğü 1,5 · 10⁻³ M ise:\n- [Pb²⁺] = 1,5 · 10⁻³ M\n- [I⁻] = 2 · 1,5 · 10⁻³ = 3 · 10⁻³ M',
      ),
      kart(
        'Katı miktarı etkisizdir',
        'Doygun çözeltinin dibine daha fazla katı eklemek iyon derişimlerini **değiştirmez**.\nÇözünürlük yalnızca sıcaklığa ve ortamdaki öteki iyonlara bağlıdır.',
      ),
      kart(
        'Tanecik modeli',
        '- Kristal yüzeyindeki iyonlar su molekülleriyle sarılıp çözeltiye geçer.\n- Çözeltideki iyonlar kristal yüzeyine çarpıp yeniden tutunur.\nDengede iki olay aynı hızda sürer; yüzey hep değişir ama miktar değişmez.',
      ),
      kart(
        'Çözünürlük genellemeleri',
        '- **Çözünür:** Na⁺, K⁺, NH₄⁺ tuzları ve bütün nitratlar\n- **Az çözünür:** çoğu karbonat, fosfat ve sülfür\n- **Az çözünür istisnalar:** AgCl, PbCl₂, BaSO₄, CaSO₄',
      ),
      kart(
        'Günlük örnekler',
        '- **Böbrek taşı:** kalsiyum oksalatın çökmesi\n- **Diş minesi:** az çözünen hidroksiapatit\n- **Sarkıt ve dikitler:** CaCO₃’ın yeniden çökmesi\n- **Röntgen:** BaSO₄ o kadar az çözünür ki zehirli Ba²⁺ kana geçmez',
      ),
    ], [], [
      {
        soru: 'PbI₂’nin molar çözünürlüğü s ise [I⁻] kaçtır?',
        siklar: ['s', '2s'],
        dogru: 1,
        aciklama: {
          dogru: 'Her PbI₂ iki I⁻ verir: [I⁻] = 2s.',
          yanlis: 'Formülde iki iyot var; çözünen her birimden iki I⁻ çıkar: 2s.',
        },
        kart: 4,
      },
    ]),
    konu('kim11-kcc', 'Çözünürlük Çarpımı (Kçç)', [
      kart(
        'Çözünürlük çarpımı',
        'Az çözünen tuzun denge sabitidir.\nAgCl(k) ⇌ Ag⁺ + Cl⁻ → **Kçç = [Ag⁺] · [Cl⁻]**\nKatı tuz ifadeye yazılmaz.',
      ),
      kart(
        'Yazım örnekleri',
        '- **PbI₂:** Kçç = [Pb²⁺] · [I⁻]²\n- **Ag₂CrO₄:** Kçç = [Ag⁺]² · [CrO₄²⁻]\n- **Ca₃(PO₄)₂:** Kçç = [Ca²⁺]³ · [PO₄³⁻]²',
      ),
      kart(
        's ile Kçç',
        '- **AB (AgCl):** Kçç = s²\n- **AB₂ ya da A₂B (PbI₂):** Kçç = 4s³\n- **AB₃ (Fe(OH)₃):** Kçç = 27s⁴\n- **A₃B₂ (Ca₃(PO₄)₂):** Kçç = 108s⁵',
      ),
      kart(
        's’den Kçç',
        'AgCl’nin molar çözünürlüğü 1,3 · 10⁻⁵ M:\nKçç = s² = (1,3 · 10⁻⁵)² ≈ **1,7 · 10⁻¹⁰**',
      ),
      kart(
        'Kçç’den s',
        'Kçç’si 4 · 10⁻⁹ olan AB₂ tuzu için:\n4s³ = 4 · 10⁻⁹ → s³ = 10⁻⁹\n**s = 10⁻³ M**',
      ),
      kart(
        'Karşılaştırma tuzağı',
        'Kçç’yi doğrudan karşılaştırmak yalnızca iyon oranı aynı tuzlarda doğrudur.\n- AgCl: Kçç 1,8 · 10⁻¹⁰, s ≈ 1,3 · 10⁻⁵ M\n- Ag₂CrO₄: Kçç 1,1 · 10⁻¹², s ≈ 6,5 · 10⁻⁵ M\nKçç’si küçük olan Ag₂CrO₄ daha çok çözünür.',
        undefined,
        { not: 'Farklı iyon oranlı tuzları karşılaştırırken Kçç’ye değil hesapladığın s’ye bak.' },
      ),
      kart(
        'Çöker mi? Qçç',
        'İyonlar karıştırılınca Qçç, Kçç ile aynı biçimde hesaplanır.\n- **Qçç > Kçç:** çökelme olur.\n- **Qçç = Kçç:** çözelti doygun.\n- **Qçç < Kçç:** çökelme olmaz, çözelti doymamış.',
      ),
      kart(
        'Çökelme örneği',
        '10⁻³ M AgNO₃ ile 10⁻³ M NaCl eşit hacimde karıştırılıyor.\n- Hacim iki kat, derişimler yarıya iner: 5 · 10⁻⁴ M\n- Qçç = (5 · 10⁻⁴)² = 2,5 · 10⁻⁷ > 1,8 · 10⁻¹⁰\nAgCl **çöker**.',
      ),
      kart(
        'Kçç değerleri',
        '25 °C’de yaklaşık:',
        {
          tur: 'tablo',
          basliklar: ['Tuz', 'Kçç'],
          satirlar: [
            ['CaCO₃', '3,4 · 10⁻⁹'],
            ['AgCl', '1,8 · 10⁻¹⁰'],
            ['BaSO₄', '1,1 · 10⁻¹⁰'],
            ['Mg(OH)₂', '5,6 · 10⁻¹²'],
          ],
        },
      ),
      kart(
        'Kçç yalnızca sıcaklığa bağlı',
        'Her denge sabiti gibi Kçç de yalnızca sıcaklıkla değişir.\nOrtak iyon ya da katı miktarı Kçç’yi değiştirmez; değişen çözünürlüktür.',
      ),
      kart(
        'Seçici çöktürme',
        'Aynı çözeltideki iki iyondan Kçç’si küçük tuzu oluşturan **önce** çöker.\nCl⁻ ve I⁻ içeren çözeltiye Ag⁺ eklenirse önce AgI, sonra AgCl çöker.\nİyonlar bu yolla birbirinden ayrılır.',
      ),
    ], [], [
      {
        soru: 'Qçç > Kçç ise ne olur?',
        siklar: ['Çökelme olur', 'Daha çok katı çözünür'],
        dogru: 0,
        aciklama: {
          dogru: 'İyon çarpımı dengeyi aşmış; fazlası katı olarak çöker.',
          yanlis: 'Çözünme Qçç < Kçç iken sürer. Qçç büyükse iyonlar fazla, çökelme olur.',
        },
        kart: 7,
      },
      {
        soru: 'PbI₂ için Kçç ile s arasındaki ilişki hangisidir?',
        siklar: ['Kçç = s²', 'Kçç = 4s³'],
        dogru: 1,
        aciklama: {
          dogru: '[Pb²⁺] = s, [I⁻] = 2s → Kçç = s · (2s)² = 4s³.',
          yanlis: 's² yalnızca AB tipi tuzlarda. PbI₂’de Kçç = s · (2s)² = 4s³.',
        },
        kart: 3,
      },
    ]),
    konu('kim11-cozunurluk-faktor', 'Çözünürlüğe Etki Eden Faktörler', [
      kart(
        'İki temel faktör',
        '- **Sıcaklık:** hem çözünürlüğü hem Kçç’yi değiştirir.\n- **Ortak iyon:** çözünürlüğü değiştirir, Kçç’yi değiştirmez.\nİkisinin ayrımı hesapların anahtarıdır.',
      ),
      kart(
        'Sıcaklık',
        '- **Çözünmesi endotermik tuzlar:** sıcaklık artınca çözünürlük artar; tuzların çoğu böyledir.\n- **Çözünmesi ekzotermik tuzlar:** sıcaklık artınca çözünürlük azalır; Ca(OH)₂, Li₂CO₃\nLe Chatelier: ısı hangi taraftaysa o yön etkilenir.',
      ),
      kart(
        'Sıcaklık eğrileri',
        'Eğrinin eğimi çözünmenin endotermik mi ekzotermik mi olduğunu gösterir.',
        {
          tur: 'koordinat',
          pencere: [0, 100, 0, 10],
          eksenler: true,
          xAd: 'sıcaklık (°C)',
          yAd: 'çözünürlük',
          egriler: [
            {
              noktalar: [
                [0, 2],
                [25, 3.5],
                [50, 5.5],
                [75, 7.5],
                [100, 9.5],
              ],
            },
            {
              noktalar: [
                [0, 6],
                [25, 5],
                [50, 4],
                [75, 3.2],
                [100, 2.5],
              ],
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: 68, y: 8.8, ad: 'endotermik' },
            { x: 24, y: 6.3, ad: 'ekzotermik', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Ortak iyon etkisi',
        'Tuzun iyonlarından biri çözeltide zaten varsa tuzun çözünürlüğü **azalır**.\nAgCl(k) ⇌ Ag⁺ + Cl⁻ dengesine Cl⁻ eklemek dengeyi katı yönüne kaydırır.',
      ),
      kart(
        'Ortak iyon hesabı',
        'AgCl (Kçç = 1,8 · 10⁻¹⁰) 0,1 M NaCl çözeltisinde:\n- [Cl⁻] ≈ 0,1 M, [Ag⁺] = s\n- s · 0,1 = 1,8 · 10⁻¹⁰ → s = **1,8 · 10⁻⁹ M**\nSaf sudaki 1,3 · 10⁻⁵ M’den yaklaşık 7000 kat az.',
        undefined,
        { not: 'Ortak iyon hesabında dışarıdan gelen iyonun derişimini kullan; s onun yanında ihmal edilir.' },
      ),
      kart(
        'Kçç değişmez',
        'Ortak iyon çözünürlüğü düşürür ama çarpım aynı Kçç’ye eşit kalır.\nİyonlardan biri artınca öteki azalır.\nKçç’yi yalnızca sıcaklık değiştirir.',
      ),
      kart(
        'pH’ın etkisi',
        'Anyonu bazik olan tuzlar asitte daha çok çözünür.\n- CaCO₃ ve Mg(OH)₂ asitte kolay çözünür.\n- Asit yağmuru mermer heykelleri aşındırır.\n- Ağızdaki asit diş minesini çözer; çürük böyle başlar.',
      ),
      kart(
        'Uygulama: suyun yumuşatılması',
        'Sert sudaki Ca²⁺ ve Mg²⁺ iyonları CO₃²⁻ eklenerek karbonat hâlinde çöktürülür.\nOrtak iyon ve düşük Kçç birlikte çalışır.',
      ),
      kart(
        'Uygulama: röntgen ilacı',
        'BaSO₄ bağırsak filminde kullanılır ama Ba²⁺ iyonu zehirlidir.\nKarışıma Na₂SO₄ eklenir: ortak SO₄²⁻ iyonu çözünen Ba²⁺’u daha da azaltır.',
      ),
      kart(
        'Uygulama: mağaralar',
        'CO₂’li yağmur suyu kireç taşını çözerek mağaraları oyar.\nSu damlarken CO₂ kaçar, denge geri kayar ve CaCO₃ yeniden çöker.\nSarkıt ve dikitler böyle oluşur.',
      ),
      kart(
        'Özet',
        'Her etki için iki soru: s ne olur, Kçç ne olur?',
        {
          tur: 'tablo',
          basliklar: ['Etki', 'Çözünürlük (s)', 'Kçç'],
          satirlar: [
            ['Ortak iyon eklemek', 'Azalır', 'Değişmez'],
            ['Isıtmak (endotermik)', 'Artar', 'Artar'],
            ['Isıtmak (ekzotermik)', 'Azalır', 'Azalır'],
            ['Katı eklemek', 'Değişmez', 'Değişmez'],
          ],
        },
      ),
    ], [], [
      {
        soru: 'AgCl’nin çözünürlüğü hangi çözeltide daha azdır?',
        siklar: ['Saf su', 'NaCl çözeltisi'],
        dogru: 1,
        aciklama: {
          dogru: 'NaCl’den gelen Cl⁻ ortak iyondur, dengeyi katı yönüne kaydırır.',
          yanlis: 'Saf suda ortak iyon yok. NaCl çözeltisindeki Cl⁻ AgCl’nin çözünürlüğünü düşürür.',
        },
        kart: 4,
      },
      {
        soru: 'Ortak iyon eklenince Kçç ne olur?',
        siklar: ['Değişmez', 'Azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Kçç yalnızca sıcaklığa bağlı; ortak iyon çözünürlüğü düşürür ama Kçç sabit kalır.',
          yanlis: 'Azalan çözünürlük. Kçç denge sabiti; yalnızca sıcaklıkla değişir.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('kim11-t3', 'Sürdürülebilirlik', [
    konu('kim11-yesil-hidrojen', 'Fermantasyonla Yeşil Hidrojen', [
      kart(
        'Neden hidrojen?',
        '- **Enerji:** kütle başına en yüksek yakma ısısı, ≈ 142 kJ/g\n- **Temizlik:** yanma ürünü yalnızca su\n- **Esneklik:** yakılabilir ya da yakıt hücresinde doğrudan elektriğe çevrilebilir',
      ),
      kart(
        'Hidrojenin renkleri',
        'Renk hidrojenin nasıl üretildiğini anlatır.\n- **Gri:** doğal gazdan, CO₂ havaya salınır.\n- **Mavi:** gri gibi, ama CO₂ yakalanıp depolanır.\n- **Yeşil:** yenilenebilir enerjiyle ya da biyolojik yolla, fosil yakıt kullanılmadan',
      ),
      kart(
        'Fermantasyon',
        'Mikroorganizmaların oksijensiz ortamda organik maddeleri parçalayarak enerji elde etmesidir.\nMayanın ekmeği kabartması da, yoğurdun oluşması da fermantasyondur.',
      ),
      kart(
        'Karanlık fermantasyon',
        'Oksijensiz ortamda yaşayan bazı bakteriler (ör. Clostridium) şekerleri **ışık olmadan** parçalar.\nÜrünler: **H₂**, CO₂ ve asetik, bütirik gibi organik asitler\nIşık gerekmediği için gece gündüz çalışır.',
      ),
      kart(
        'Tepkime',
        'Asetik asit yolunda glikozdan en çok 4 mol H₂ çıkar:\n**C₆H₁₂O₆ + 2H₂O → 2CH₃COOH + 2CO₂ + 4H₂**\nBütirik asit yolunda bu sayı 2 mol’e düşer.',
      ),
      kart(
        'Hammadde: evsel atıklar',
        '- Meyve ve sebze kabukları, bayat ekmek, yemek artıkları\n- Tarım ve gıda sanayisi atıkları\nÇöpe giden atık hem azalır hem enerjiye dönüşür; bu, **döngüsel ekonominin** bir örneğidir.',
      ),
      kart(
        'Süreç',
        'Atıktan yakıta beş adım:',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Atık toplama', alt: 'organik atık ayrılır' },
            { ad: 'Ön işlem', alt: 'öğütme, sulandırma' },
            { ad: 'Biyoreaktör', alt: 'oksijensiz, ≈ 35 °C', renk: 'ikincil' },
            { ad: 'Gaz ayırma', alt: 'H₂ ile CO₂ ayrılır' },
            { ad: 'Kalan çamur', alt: 'biyogaz ya da gübre' },
          ],
        },
      ),
      kart(
        'Hidrojen miktarını etkileyenler',
        '- **pH:** en uygun aralık yaklaşık 5–6\n- **Sıcaklık:** ≈ 35–37 °C’de bakteriler en etkin\n- **Atığın türü:** şekerce ve nişastaca zengin atık daha çok H₂ verir\n- **H₂ birikimi:** gaz çekilmezse üretim yavaşlar',
      ),
      kart(
        'Rakip bakteriler',
        'Metan üreten bakteriler oluşan H₂’yi tüketir ve verimi düşürür.\n- Başlangıç bakteri karışımı kısa süre kaynatılır: sporlu H₂ üreticileri dayanır, metancılar ölür.\n- Hafif asidik pH da metancıları baskılar.',
        undefined,
        { not: 'Verim düşükse sebep çoğu zaman H₂’yi yiyen bakterilerdir; ortamı onlara uygunsuz hâle getirmek gerekir.' },
      ),
      kart(
        'Hipotez kurma',
        '"pH’ı 5,5 olan reaktör, pH’ı 7 olandan daha çok H₂ üretir."\n- **Bağımsız değişken:** pH\n- **Bağımlı değişken:** toplanan H₂ hacmi\n- **Sabit tutulanlar:** sıcaklık, atık türü ve miktarı, süre',
      ),
      kart(
        'Güçlü ve zayıf yanlar',
        '- **Güçlü:** atığı değerlendirir, düşük sıcaklıkta çalışır, yenilenebilir\n- **Zayıf:** verim düşük, CO₂’den ayırma gerekir, depolama zor\nAraştırmalar verimi artırmaya ve kalan asitleri biyogaza çevirmeye odaklanıyor.',
      ),
      kart(
        'Depolama ve kullanım',
        '- **Basınçlı tank:** 350–700 atm\n- **Sıvılaştırma:** −253 °C’ye soğutma\n- **Yakıt hücresi:** 2H₂ + O₂ → 2H₂O + elektrik\nHidrojen çok hafif ve yanıcıdır; sızıntı güvenliği önemlidir.',
      ),
    ], [], [
      {
        soru: 'Yeşil hidrojeni griden ayıran nedir?',
        siklar: ['Fosil yakıt kullanılmadan üretilmesi', 'Renginin yeşil olması'],
        dogru: 0,
        aciklama: {
          dogru: 'Renk üretim yolunu anlatır: yeşil, yenilenebilir ya da biyolojik yolla üretilen hidrojendir.',
          yanlis: 'Hidrojen gazı renksizdir. "Yeşil" fosil yakıt kullanılmadan üretildiğini söyler.',
        },
        kart: 2,
      },
      {
        soru: 'Karanlık fermantasyonda ortam nasıldır?',
        siklar: ['Oksijenli ve ışıklı', 'Oksijensiz'],
        dogru: 1,
        aciklama: {
          dogru: 'Bakteriler şekerleri oksijensiz ortamda, ışık olmadan parçalar.',
          yanlis: 'Oksijen H₂ üreten bakterileri engeller; süreç oksijensiz ortamda yürür.',
        },
        kart: 4,
      },
    ]),
    konu('kim11-nano', 'Nanoteknolojik Ürünler', [
      kart(
        'Nanometre ölçeği',
        '**1 nm = 10⁻⁹ m**, metrenin milyarda biri\nNanoteknoloji 1–100 nm boyutundaki maddeleri tasarlar ve kullanır.\nBir saç telinin kalınlığı yaklaşık 80.000 nm’dir.',
      ),
      kart(
        'Neden farklı davranır?',
        '- Yüzey/hacim oranı **çok büyür**; tepkimeye açık yüzey artar.\n- Bazı özellikler boyuta bağlı hâle gelir.\nAltın nanoparçacıklar sarı değil kırmızı-mor görünür; erime noktası düşer.',
      ),
      kart(
        'Yüzey alanı örneği',
        'Kenarı 1 cm olan bir küpün yüzeyi 6 cm²’dir.\nAynı küp kenarı 1 nm olan küplere bölünürse toplam yüzey **10⁷ kat** artar.\nBir şeker küpü büyüklüğünde madde, 6000 m² yüzey açar.',
      ),
      kart(
        'Faydalı ürünler',
        '- **Gümüş nanoparçacık:** mikrop öldürücü çorap, yara bandı\n- **TiO₂ ve ZnO:** beyaz iz bırakmayan güneş kremi\n- **Kendini temizleyen cam:** kiri ışıkla parçalar\n- **Leke tutmayan kumaş:** su ve yağ damlası kayar',
      ),
      kart(
        'Tıp, enerji, çevre',
        '- **Hedefli ilaç:** ilacı yalnızca hasta hücreye taşır\n- **Güneş pilleri ve piller:** daha yüksek verim ve kapasite\n- **Su arıtma:** nano gözenekli filtreler\n- **Karbon nanotüp:** çelikten güçlü, çok hafif malzeme',
      ),
      kart(
        'Olası zararlar: sağlık',
        '- Çok küçük parçacıklar solunumla akciğerin derinlerine inebilir.\n- Bazıları hücre zarından geçebilir.\n- Hücrelerde zararlı tepkimeleri tetikleyebilir.\nUzun süreli etkileri henüz tam bilinmiyor.',
      ),
      kart(
        'Olası zararlar: çevre',
        'Yıkanan çoraptaki gümüş nanoparçacıklar atık suya karışır.\nArıtma tesislerindeki yararlı bakterileri öldürebilir, toprakta ve suda birikebilir.\nBesin zincirine geçip geçmediği araştırılıyor.',
      ),
      kart(
        'İhtiyat ilkesi',
        'Zararsız olduğu kanıtlanmamış bir ürünü, kanıt gelene kadar **dikkatle** kullanmaktır.\nFayda ile olası risk birlikte tartılır; "yeni" olmak "güvenli" olmak demek değildir.',
      ),
      kart(
        'Seçim soruları',
        '- Bu ürüne gerçekten ihtiyacım var mı?\n- Etikette nano içerik açıkça yazıyor mu?\n- Güvenlik testleri ve sertifikası var mı?\n- Nasıl kullanılıyor: soluyor muyum, yutuyor muyum, sürüyor muyum?\n- Kullanımdan sonra nereye gidecek?',
      ),
      kart(
        'Sprey mi krem mi?',
        '- **Sprey:** parçacıklar havaya dağılır ve solunabilir; risk daha yüksek.\n- **Krem:** ciltte kalır; sağlam deriden geçişi sınırlıdır.\nAynı nano içerik, kullanım biçimine göre farklı risk taşır.',
      ),
      kart(
        'Reklam tuzağı',
        '"Nano" kelimesi ürünü modern göstermek için de kullanılır.\nİddianın arkasında bilimsel bir çalışma var mı, ürün gerçekten nano ölçekte mi, sorulmalıdır.',
        undefined,
        { not: 'Etikette "nano" yazması ne üstünlük ne tehlike kanıtıdır; iddianın kaynağını sor.' },
      ),
    ], [], [
      {
        soru: 'Nanoparçacıkların farklı davranmasının temel sebebi nedir?',
        siklar: ['Yüzey/hacim oranının büyümesi', 'Atomlarının farklı olması'],
        dogru: 0,
        aciklama: {
          dogru: 'Atomlar aynı; parçacık küçüldükçe yüzeydeki atomların oranı çok artar.',
          yanlis: 'Nano altın da altın atomlarından oluşur. Değişen, yüzeyde kalan atomların oranı.',
        },
        kart: 2,
      },
      {
        soru: 'Nano içerikli hangi ürün solunum yoluyla daha çok risk taşır?',
        siklar: ['Krem', 'Sprey'],
        dogru: 1,
        aciklama: {
          dogru: 'Sprey parçacıkları havaya dağıtır ve solunabilir hâle getirir.',
          yanlis: 'Krem ciltte kalır. Sprey parçacıkları havaya saçtığı için solunma riski yüksek.',
        },
        kart: 10,
      },
    ]),
    konu('kim11-mikroplastik', 'Mikroplastik ve Nanoplastikler', [
      kart(
        'Tanımlar',
        '- **Mikroplastik:** 5 mm’den küçük plastik parçacık\n- **Nanoplastik:** 1 μm’den küçük plastik parçacık\nNanoplastikler gözle ve sıradan mikroskopla görülemez.',
      ),
      kart(
        'Birincil kaynaklar',
        'Baştan küçük üretilen plastiklerdir.\n- Kozmetik ürünlerdeki mikro boncuklar (birçok ülkede yasaklandı)\n- Plastik üretiminde kullanılan hammadde taneleri (pelet)\n- Endüstriyel aşındırıcılar',
      ),
      kart(
        'İkincil kaynaklar',
        'Büyük plastiklerin parçalanmasıyla oluşur.\n- Şişe ve poşetlerin güneş ışığı ve dalgayla ufalanması\n- Sentetik kumaşlardan yıkamada kopan lifler\n- Araç lastiklerinin yolda aşınması',
      ),
      kart(
        'Plastik neden yok olmaz?',
        'Plastikleri parçalayabilen canlı çok azdır; plastik küçülür ama kaybolmaz.\nBir plastik şişenin doğada parçalanması yüzlerce yıl sürer.\nHer parçalanma daha çok ve daha küçük parçacık demektir.',
      ),
      kart(
        'Nerede bulunuyor?',
        '- Okyanuslar ve derin deniz tabanı\n- Dağ zirveleri ve kutup buzulları\n- İçme suyu, sofra tuzu, bal\n- İnsan kanı, akciğeri ve plasentası',
      ),
      kart(
        'Deniz canlılarına etkisi',
        '- Besin sanılıp yutulur; sindirim yolunu tıkayabilir.\n- Sahte tokluk hissi verir, canlı yeterince beslenemez.\n- Küçük canlılardan büyüklere, besin zinciri boyunca taşınır.',
      ),
      kart(
        'Kirletici taşıyıcısı',
        '- Yüzeylerine tarım ilaçları ve ağır metaller tutunur.\n- İçlerindeki katkı maddeleri (bazı plastikleştiriciler) zamanla sızar.\nBu maddelerin bazıları hormon sistemini bozabilir.',
      ),
      kart(
        'İnsan sağlığı',
        'Mikroplastikler yiyecek, içecek ve solunan havayla vücuda girer.\nNanoplastikler hücre zarından geçebilir ve iltihabı tetikleyebilir.\nUzun süreli etkiler hâlâ araştırılıyor; bilinmeyen, zararsız demek değildir.',
        undefined,
        { not: 'Nanoplastik küçüldükçe daha tehlikeli olabilir: hücreye girebilecek kadar küçük parçacıklar bunlar.' },
      ),
      kart(
        'Nasıl tespit edilir?',
        '- Su ya da tortu örneği süzülür, parçacıklar filtrede toplanır.\n- Mikroskop altında sayılır ve boyutları ölçülür.\n- Spektroskopi ile hangi plastik türü olduğu belirlenir.',
      ),
      kart(
        'Azaltmak: bireysel',
        '- Tek kullanımlık plastiği azalt, bez çanta ve matara kullan.\n- Mümkünse doğal lifli giysi seç.\n- Çamaşırı dolu makinede, düşük sıcaklıkta yıka.\n- Atıkları doğru ayır, plastiği doğaya bırakma.',
      ),
      kart(
        'Azaltmak: toplumsal',
        '- Kozmetikte mikro boncuk yasakları\n- Arıtma tesislerinde ince filtreler\n- Çamaşır makinelerine lif filtresi\n- Depozito ve geri dönüşüm sistemleri',
      ),
      kart(
        'Biyobozunur plastik çözüm mü?',
        'PLA gibi biyobozunur plastiklerin çoğu yalnızca yüksek sıcaklıklı **endüstriyel kompostta** parçalanır.\nDenizde ya da toprakta sıradan plastik gibi uzun süre kalabilir.\nEn etkili yol, plastik kullanımını azaltmaktır.',
      ),
    ], [], [
      {
        soru: 'Mikroplastik hangi boyuttan küçük plastiktir?',
        siklar: ['5 mm', '5 cm'],
        dogru: 0,
        aciklama: {
          dogru: 'Mikroplastik 5 mm’den küçük; nanoplastik 1 μm’den de küçük.',
          yanlis: '5 cm büyük bir parça. Mikroplastik sınırı 5 mm.',
        },
        kart: 1,
      },
      {
        soru: 'Sentetik giysinin yıkanmasından çıkan lifler hangi kaynaktır?',
        siklar: ['Birincil', 'İkincil'],
        dogru: 1,
        aciklama: {
          dogru: 'Lifler büyük üründen kopuyor: ikincil mikroplastik.',
          yanlis: 'Birincil, baştan küçük üretilen mikro boncuk gibi parçacıklar. Kopan lifler ikincil.',
        },
        kart: 3,
      },
    ]),
  ]),
])
