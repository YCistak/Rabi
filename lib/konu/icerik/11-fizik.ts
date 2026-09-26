import { kart, konu, program, tema } from '../tip'

/**
 * 11. sınıf Fizik — Maarif Modeli.
 *
 * Üç tema: Kuvvet ve Hareket, Elektrik ve Manyetizma, Optik. Konu adları ve
 * sırası `maarif/iskelet.json`'dan; `maarif.test.ts` denetliyor.
 *
 * Eski (2018) programdan farkı büyük: iş-enerji, itme-momentum, tork,
 * denge ve kütle çekimi bu sınıfta yok; Newton yasaları ise 11. sınıfta
 * ayrı konu olarak işleniyor. Optik (aynalar, kırılma, mercekler) 10.
 * sınıftan buraya taşındı; elektrikte Coulomb'dan transformatöre kadar
 * alan ve indüksiyon var.
 *
 * Sorular (turuncu kitaplar) henüz yazılmadı; destelerin ortasındaki hızlı
 * kontroller var.
 */
export const fizik11 = program('fizik', 11, 'Hareketten ışığın yoluna', [
  tema('fzk11-t1', 'Kuvvet ve Hareket', [
    konu('fzk11-serbest', 'Serbest Düşme', [
      kart(
        'Serbest düşme nedir?',
        'İlk hızı olmadan bırakılan cismin yalnızca yer çekimi etkisiyle düşmesidir.\n- Hava direnci ihmal edilir.\n- Hareket **sabit ivmelidir**: g ≈ 9,8 m/s², hesapta 10 m/s² alınır.',
      ),
      kart(
        'Galileo ve kütle',
        '- **Aristoteles:** ağır cisim daha hızlı düşer.\n- **Galileo:** hava direnci yoksa bütün cisimler aynı ivmeyle düşer.\n- **Kanıt:** 1971’de Ay’da bırakılan çekiç ile tüy aynı anda yere değdi.',
      ),
      kart(
        'İvme neden kütleden bağımsız?',
        'Ağırlık kütleyle orantılı büyür: G = m · g\nİvme = kuvvet / kütle = m · g / m = **g**\nİki kat ağır cisme iki kat kuvvet etki eder ama iki kat da eylemsizliği vardır.',
      ),
      kart(
        'g her yerde aynı mı?',
        '- **Kutuplar:** ≈ 9,83 m/s²\n- **Ekvator:** ≈ 9,78 m/s²\n- **Ay:** ≈ 1,6 m/s², Dünya’nınkinin yaklaşık altıda biri\nYükseklik arttıkça g çok az azalır.',
      ),
      kart(
        'Hız ve yol denklemleri',
        '- **Hız:** v = g · t\n- **Yol:** h = ½ · g · t²\n- **Zamansız:** v² = 2 · g · h\n20 m’den bırakılan cisim 2 s’de düşer ve 20 m/s ile çarpar.',
      ),
      kart(
        'Saniye saniye düşüş',
        'g = 10 m/s² ile:',
        {
          tur: 'tablo',
          basliklar: ['Süre', 'Hız', 'Toplam yol'],
          satirlar: [
            ['1 s', '10 m/s', '5 m'],
            ['2 s', '20 m/s', '20 m'],
            ['3 s', '30 m/s', '45 m'],
            ['4 s', '40 m/s', '80 m'],
          ],
        },
      ),
      kart(
        'Ardışık saniyelerde yol',
        'Her saniyede alınan yol: 5, 15, 25, 35 m…\nOranları **1 : 3 : 5 : 7** tek sayılardır.\nArdışık eşit aralıklardaki yolların farkı sabit (10 m): bu, ivmenin sabit olduğunun kanıtıdır.',
        undefined,
        { not: 'Toplam yol 1, 4, 9, 16 diye kareler hâlinde; her saniyedeki yol 1, 3, 5, 7. İkisini karıştırma.' },
      ),
      kart(
        'Grafikler',
        '- **İvme-zaman:** yatay doğru, a = g\n- **Hız-zaman:** orijinden çıkan doğru, eğim g\n- **Konum-zaman:** parabol, gittikçe dikleşir',
        {
          tur: 'koordinat',
          pencere: [0, 4.5, 0, 45],
          eksenler: true,
          xAd: 'zaman (s)',
          yAd: 'hız (m/s)',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [4, 40],
              ],
              kirik: true,
              ad: 'eğim = g',
            },
          ],
        },
      ),
      kart(
        'Düşme süresi',
        '**t = √(2h / g)**\n- 80 m → t = √16 = 4 s\n- Yükseklik 4 katına çıkarsa süre yalnızca **2 katına** çıkar.\nSüre kütleye değil yalnızca yüksekliğe bağlıdır.',
      ),
      kart(
        'Aşağı doğru atış',
        'Cisim v₀ ilk hızla aşağı atılırsa:\n- **Hız:** v = v₀ + g · t\n- **Yol:** h = v₀ · t + ½ · g · t²\nİvme yine g’dir; yalnızca başlangıç hızı eklenir.',
      ),
      kart(
        'Yukarı atış',
        '- **Hız:** v = v₀ − g · t\n- **Tepeye çıkış süresi:** t = v₀ / g\n- **En büyük yükseklik:** h = v₀² / 2g\nTepede hız sıfır, ivme yine g ve aşağı yönlüdür.',
      ),
      kart(
        'Deneyle kanıt',
        '- **Stroboskop fotoğrafı:** eşit aralıklarla çekilen karelerde aralıklar düzenli büyür.\n- **Hareket algılayıcı:** hız-zaman grafiği doğru çıkar.\n- **Vakum tüpü:** hava boşaltılınca tüy ile bozuk para birlikte düşer.',
      ),
      kart(
        'Gerçekte hava direnci var',
        'Gerçek düşüşte hız arttıkça hava direnci de artar.\nKâğıt ile taş aynı anda düşmez, çünkü kâğıdın direnci ağırlığına göre büyüktür.\nBu durum **limit hız** konusunda incelenir.',
      ),
    ], [], [
      {
        soru: 'Serbest düşen cismin 3. saniyede aldığı yol kaç metredir?',
        siklar: ['45 m', '25 m'],
        dogru: 1,
        aciklama: {
          dogru: 'Saniyelik yollar 5, 15, 25: üçüncü saniyede 25 m. 45 m, üç saniyedeki toplam yol.',
          yanlis: '45 m ilk üç saniyenin toplamı. Yalnızca 3. saniyede alınan yol 45 − 20 = 25 m.',
        },
        kart: 7,
      },
      {
        soru: 'Düşme yüksekliği 4 katına çıkarsa düşme süresi ne olur?',
        siklar: ['2 katına çıkar', '4 katına çıkar'],
        dogru: 0,
        aciklama: {
          dogru: 't = √(2h / g): yükseklik 4 kat olunca süre √4 = 2 kat.',
          yanlis: 'Süre yüksekliğin karekökü ile orantılı: √4 = 2 kat.',
        },
        kart: 9,
      },
    ]),
    konu('fzk11-iki-boyut', 'İki Boyutta Sabit İvmeli Hareket', [
      kart(
        'Bağımsızlık ilkesi',
        'İki boyutlu hareket, yatay ve düşey iki ayrı hareket olarak incelenir.\n- İki hareket birbirini etkilemez.\n- İkisini bağlayan tek şey **ortak zamandır**.',
      ),
      kart(
        'Yatay atış',
        'Cisim yükseklikten yatay v₀ hızıyla atılır.\n- **Yatayda:** ivme yok, sabit hız, x = v₀ · t\n- **Düşeyde:** serbest düşme, h = ½ · g · t²',
      ),
      kart(
        'Yörünge bir paraboldür',
        'Yatayda eşit adımlar atılırken düşeyde düşüş gittikçe büyür.',
        {
          tur: 'koordinat',
          pencere: [0, 65, 0, 50],
          eksenler: true,
          xAd: 'yatay (m)',
          yAd: 'yükseklik (m)',
          egriler: [
            {
              noktalar: [
                [0, 45],
                [10, 43.75],
                [20, 40],
                [30, 33.75],
                [40, 25],
                [50, 13.75],
                [60, 0],
              ],
              ad: 'yörünge',
            },
          ],
          noktalar: [
            { x: 0, y: 45 },
            { x: 60, y: 0 },
          ],
          etiketler: [
            { x: 22, y: 46.5, ad: 'v₀ = 20 m/s' },
            { x: 46, y: 7, ad: 'menzil 60 m' },
          ],
        },
      ),
      kart(
        'Süre yalnızca yüksekliğe bağlı',
        '**t = √(2h / g)**\nAynı yükseklikten bırakılan ve yatay atılan iki cisim yere **aynı anda** düşer.\nYatay hız süreyi değil, gidilen yatay yolu değiştirir.',
        undefined,
        { not: 'Yatay hız düşme süresini değiştirmez. Süre soruluyorsa yalnızca yüksekliğe bak.' },
      ),
      kart(
        'Menzil',
        '**x = v₀ · t = v₀ · √(2h / g)**\n45 m yükseklikten 20 m/s ile atılan cisim:\n- t = √(90 / 10) = 3 s\n- x = 20 · 3 = **60 m**',
      ),
      kart(
        'Yere çarpma hızı',
        'İki bileşen ayrı bulunur, sonra birleştirilir.\n- **Yatay:** vₓ = v₀ = 20 m/s\n- **Düşey:** vᵧ = g · t = 30 m/s\n- **Bileşke:** v = √(20² + 30²) ≈ 36 m/s',
      ),
      kart(
        'Eğik atış',
        'Cisim yatayla α açısıyla v₀ hızıyla atılır.\n- **Yatay bileşen:** v₀ₓ = v₀ · cos α, hareket boyunca sabit\n- **Düşey bileşen:** v₀ᵧ = v₀ · sin α, yukarı atış gibi değişir',
      ),
      kart(
        'Tepe noktası',
        'Tepede düşey hız sıfırdır, yatay hız **sıfır değildir**.\n- **Çıkış süresi:** t = v₀ᵧ / g\n- **En büyük yükseklik:** h = v₀ᵧ² / 2g\nTepedeki sürat v₀ · cos α’dır.',
      ),
      kart(
        'Uçuş süresi ve menzil',
        'Aynı seviyeye inen eğik atışta:\n- **Uçuş süresi:** 2 · v₀ᵧ / g\n- **Menzil:** v₀ₓ · uçuş süresi = v₀² · sin 2α / g',
      ),
      kart(
        'En büyük menzil',
        'sin 2α en büyük değeri 1’i α = 45°’de alır: **en uzun menzil 45°**’dir.\nToplamı 90° olan açılar (30° ve 60°) aynı menzili verir.\nBüyük açı daha yükseğe çıkar, daha uzun kalır.',
      ),
      kart(
        'Çözümlü örnek',
        'v₀ = 50 m/s, α = 37° (sin 0,6, cos 0,8)\n- **Bileşenler:** v₀ₓ = 40, v₀ᵧ = 30 m/s\n- **Tepe:** 3 s’de 45 m\n- **Uçuş:** 6 s, **menzil:** 40 · 6 = 240 m',
      ),
      kart(
        'Hareketli araçtan atış',
        'Sabit hızla giden trende yukarı atılan top:\n- **Trendeki gözlemci:** top düz yukarı çıkıp eline iner.\n- **Yerdeki gözlemci:** top bir parabol çizer.\nTopun yatay hızı trenin hızıdır.',
      ),
      kart(
        'Genel durum',
        'İvme yalnızca düşey değilse (ör. yatay rüzgâr kuvveti) iki eksende ayrı sabit ivmeler yazılır.\n- x = v₀ₓ · t + ½ · aₓ · t²\n- y = v₀ᵧ · t + ½ · aᵧ · t²',
      ),
    ], [], [
      {
        soru: 'Eğik atışta tepe noktasında hız sıfır mıdır?',
        siklar: ['Evet, cisim durur', 'Hayır, yatay hız kalır'],
        dogru: 1,
        aciklama: {
          dogru: 'Tepede yalnızca düşey hız sıfırlanır; yatay bileşen v₀ · cos α hep aynı kalır.',
          yanlis: 'Sıfır olan yalnızca düşey bileşen. Yatay hız atış boyunca sabit ve tepede de var.',
        },
        kart: 8,
      },
      {
        soru: 'Aynı hızla atılan cisimlerden hangisi daha uzağa gider?',
        siklar: ['45° ile atılan', '60° ile atılan'],
        dogru: 0,
        aciklama: {
          dogru: 'sin 2α en büyük değerini 45°’de alır; en uzun menzil 45°.',
          yanlis: '60° daha yükseğe çıkar ama menzil v₀² · sin 2α / g; sin 90° = 1 ile 45° kazanır.',
        },
        kart: 10,
      },
    ]),
    konu('fzk11-newton', 'Newton Hareket Yasaları', [
      kart(
        'Kuvvet',
        'Cismin hareketini ya da şeklini değiştirebilen itme veya çekmedir.\n- **Vektörel:** büyüklüğü ve yönü var\n- **Birim:** newton, 1 N = 1 kg · m/s²\n- **Ölçüm:** dinamometre',
      ),
      kart(
        'Birinci yasa: eylemsizlik',
        'Net kuvvet sıfırsa:\n- Duran cisim durmaya devam eder.\n- Hareket eden cisim **sabit hızla** düz çizgide gider.\nCismin hâlini koruma eğilimine **eylemsizlik** denir; kütle büyüdükçe artar.',
      ),
      kart(
        'Eylemsizliğe örnekler',
        '- Otobüs aniden fren yapınca yolcu öne savrulur.\n- Hızla çekilen masa örtüsünün üstündeki tabak yerinde kalır.\n- Emniyet kemeri, gövdenin öne gitme eğilimini durdurur.',
      ),
      kart(
        'Hareket için kuvvet gerekmez',
        'Sabit hızla gitmek için net kuvvet **gerekmez**; kuvvet hızı değiştirmek için gerekir.\nBuz üstünde kayan disk, sürtünme olmasaydı sonsuza dek giderdi.',
        undefined,
        { not: '"Cisim hareket ediyorsa üstünde net kuvvet vardır" yanlış. Net kuvvet varsa hız değişir.' },
      ),
      kart(
        'İkinci yasa: temel yasa',
        '**F(net) = m · a**\n- İvme net kuvvetle **aynı yöndedir**.\n- Kuvvet iki katına çıkınca ivme iki katına çıkar.\n- Kütle iki katına çıkınca ivme yarıya iner.',
      ),
      kart(
        'Net kuvvet',
        'Cisme etki eden bütün kuvvetlerin vektörel toplamıdır.\n- **Aynı yönlü:** 10 N + 6 N = 16 N\n- **Zıt yönlü:** 10 N − 6 N = 4 N, büyüğün yönünde\n- **Dik:** √(6² + 8²) = 10 N',
      ),
      kart(
        'Ağırlık ve kütle',
        '- **Kütle:** madde miktarı, kg, her yerde aynı\n- **Ağırlık:** yer çekimi kuvveti, G = m · g, newton\n60 kg’lık öğrenci Dünya’da 600 N, Ay’da yaklaşık 96 N’dur.',
      ),
      kart(
        'Üçüncü yasa: etki-tepki',
        'A cismi B’ye kuvvet uygularsa B de A’ya **eşit büyüklükte, zıt yönde** kuvvet uygular.\n- Kuvvetler hep çift hâlinde doğar.\n- Farklı cisimlere etki ettikleri için **birbirini dengelemez**.',
      ),
      kart(
        'Etki-tepki örnekleri',
        '- **Roket:** gazı geri iter, gaz roketi ileri iter.\n- **Yüzücü:** suyu geri iter, su onu ileri iter.\n- **Elma:** Dünya elmayı çeker, elma da Dünya’yı aynı kuvvetle çeker.',
      ),
      kart(
        'Etki-tepki çifti değil',
        'Masadaki kitapta ağırlık ile normal kuvvet eşit ve zıttır ama **etki-tepki çifti değildir**.\n- İkisi de aynı cisme (kitaba) etki eder.\n- Ağırlığın tepkisi, kitabın Dünya’yı çekmesidir.',
      ),
      kart(
        'Serbest cisim diyagramı',
        'Cismi nokta ya da kutu olarak çiz, **ona etki eden** kuvvetleri ok olarak ekle.\nCismin başkalarına uyguladığı kuvvetler çizilmez.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -3.6, 3.6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [-1, -1],
                [1, -1],
                [1, 1],
                [-1, 1],
              ],
              kirik: true,
              kapali: true,
            },
            {
              noktalar: [
                [0, 1],
                [0, 3],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
              ad: 'N',
            },
            {
              noktalar: [
                [0, -1],
                [0, -3],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
              ad: 'G',
            },
            {
              noktalar: [
                [1, 0],
                [3.4, 0],
              ],
              kirik: true,
              ok: true,
              ad: 'F',
            },
            {
              noktalar: [
                [-1, 0],
                [-2.6, 0],
              ],
              kirik: true,
              ok: true,
              renk: 'soluk',
              ad: 'sürtünme',
            },
          ],
        },
      ),
      kart(
        'Bağlı cisimler',
        '2 kg ve 3 kg iple bağlı, 3 kg’lık öndeki cisim 20 N ile çekiliyor (sürtünmesiz):\n- **Sistem:** a = 20 / (2 + 3) = 4 m/s²\n- **İp:** arkadaki cismi çeker, T = 2 · 4 = 8 N',
      ),
      kart(
        'Asansörde ağırlık',
        'Tartının gösterdiği normal kuvvettir.\n- **Yukarı ivmelenirken:** N = m(g + a), daha ağır\n- **Aşağı ivmelenirken:** N = m(g − a), daha hafif\n- **Sabit hızda:** N = m · g\n- **Serbest düşmede:** N = 0, ağırlıksızlık',
      ),
      kart(
        'Makarada iki kütle',
        'Sürtünmesiz makaradan sarkan m₁ > m₂ kütleleri:\n- **İvme:** a = (m₁ − m₂) · g / (m₁ + m₂)\n- **Örnek:** 3 kg ve 2 kg → a = 2 m/s²\n- **İp:** T = 2 · (10 + 2) = 24 N',
      ),
    ], [], [
      {
        soru: 'Sabit hızla giden cisme etki eden net kuvvet nedir?',
        siklar: ['Sıfır', 'Hareket yönünde'],
        dogru: 0,
        aciklama: {
          dogru: 'Hız değişmiyorsa ivme sıfır; F = m · a ile net kuvvet de sıfır.',
          yanlis: 'Hareketi sürdürmek için net kuvvet gerekmez. Sabit hız sıfır ivme, sıfır net kuvvet demek.',
        },
        kart: 4,
      },
      {
        soru: 'Masadaki kitabın ağırlığının tepkisi hangisidir?',
        siklar: ['Masanın itmesi', 'Kitabın Dünya’yı çekmesi'],
        dogru: 1,
        aciklama: {
          dogru: 'Ağırlık Dünya’nın kitabı çekmesi; tepkisi kitabın Dünya’yı çekmesi.',
          yanlis: 'Masanın itmesi de kitaba etki ediyor; etki-tepki farklı cisimlere etki eder. Tepki, kitabın Dünya’yı çekmesi.',
        },
        kart: 10,
      },
    ]),
    konu('fzk11-surtunme', 'Sürtünme Kuvveti', [
      kart(
        'Sürtünme nedir?',
        'Birbirine değen yüzeyler arasında harekete ya da hareket eğilimine karşı koyan kuvvettir.\n- Yüzeye paraleldir.\n- Kaymanın ya da kayma eğiliminin yönüne zıttır.',
      ),
      kart(
        'Sürtünmenin kaynağı',
        'En düzgün görünen yüzey bile mikroskopta pürüzlüdür.\nYüzeyler yalnızca pürüzlerin uçlarında değer; bu noktalarda moleküller arası çekim oluşur.',
      ),
      kart(
        'Statik sürtünme',
        'Cisim **dururken** oluşur.\n- Uygulanan kuvvete eşit ve zıttır; kuvvet büyüdükçe o da büyür.\n- En büyük değeri: **fₛ,maks = μₛ · N**\nKuvvet bu değeri aşınca cisim kaymaya başlar.',
      ),
      kart(
        'Kinetik sürtünme',
        'Cisim **kayarken** oluşur.\n**fₖ = μₖ · N**\nHıza bağlı değildir, kayma sürdükçe yaklaşık sabit kalır.',
      ),
      kart(
        'Harekete geçirmek daha zor',
        'Genelde **μₛ > μₖ**: cismi kaydırmak, kaymasını sürdürmekten zordur.\nGrafikte sürtünme önce uygulanan kuvvetle artar, kayma başlayınca düşüp sabitlenir.',
        {
          tur: 'koordinat',
          pencere: [0, 10, 0, 6],
          eksenler: true,
          xAd: 'uygulanan kuvvet',
          yAd: 'sürtünme',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [5, 5],
                [5.3, 3.6],
                [10, 3.6],
              ],
              kirik: true,
            },
          ],
          etiketler: [
            { x: 2.2, y: 3.3, ad: 'statik' },
            { x: 7.8, y: 4.2, ad: 'kinetik' },
          ],
        },
      ),
      kart(
        'Sürtünme katsayısı',
        'Birimsizdir ve iki yüzeyin cinsine bağlıdır.',
        {
          tur: 'tablo',
          basliklar: ['Yüzeyler', 'μₛ', 'μₖ'],
          satirlar: [
            ['Lastik – kuru asfalt', '1,0', '0,8'],
            ['Çelik – çelik', '0,7', '0,6'],
            ['Tahta – tahta', '0,5', '0,3'],
            ['Buz – buz', '0,1', '0,03'],
          ],
        },
      ),
      kart(
        'Neye bağlı, neye değil?',
        '- **Bağlı:** yüzeylerin cinsi ve normal kuvvet\n- **Bağlı değil:** temas alanının büyüklüğü ve (kinetikte) hız\nTuğla yan ya da düz yatırılsa da sürtünme kuvveti aynıdır.',
      ),
      kart(
        'Normal kuvvet',
        'Yüzeyin cisme dik tepkisidir; her zaman ağırlığa eşit değildir.\n- **Yatay düzlem:** N = m · g\n- **Yukarı açılı çekme:** N = m · g − F · sin θ\n- **Aşağı açılı itme:** N = m · g + F · sin θ',
        undefined,
        { not: 'Sürtünmeyi hesaplarken önce N’yi bul. N’yi hep mg yazmak açılı kuvvetlerde yanlış sonuç verir.' },
      ),
      kart(
        'Harekete geçer mi?',
        '10 kg, μₛ = 0,4, μₖ = 0,3 (N = 100 N):\n- **F = 30 N:** fₛ,maks = 40 N’dan küçük, hareket yok, sürtünme 30 N\n- **F = 50 N:** kayar, fₖ = 30 N, a = (50 − 30) / 10 = 2 m/s²',
      ),
      kart(
        'Eğik düzlem',
        'Ağırlık iki bileşene ayrılır:\n- **Eğim boyunca:** m · g · sin θ\n- **Yüzeye dik:** m · g · cos θ = N\nCisim tan θ = μₛ olduğu açıda kaymaya başlar.',
      ),
      kart(
        'Eğik düzlemde kayma',
        '37°’lik eğimde μₖ = 0,5 olan cisim:\n**a = g · (sin θ − μₖ · cos θ)**\na = 10 · (0,6 − 0,5 · 0,8) = **2 m/s²**',
      ),
      kart(
        'Yararı ve zararı',
        '- **Yararlı:** yürümek, fren, düğüm, çivinin tutması\n- **Zararlı:** aşınma, ısınma, enerji kaybı\n- **Azaltma:** yağlama, rulman, cilalama\n- **Artırma:** kar lastiği, zincir, kum serpme',
      ),
      kart(
        'Fren ve ABS',
        'Tekerlek kilitlenip kayarsa kinetik sürtünme devreye girer ve durma mesafesi uzar.\nABS tekerleği kaydırmadan döndürür; statik sürtünme daha büyük olduğu için araç daha kısa mesafede durur.',
      ),
    ], [], [
      {
        soru: 'Durgun cisme 30 N uygulanıyor, fₛ,maks 40 N. Sürtünme kaç N’dur?',
        siklar: ['30 N', '40 N'],
        dogru: 0,
        aciklama: {
          dogru: 'Cisim kıpırdamıyor; statik sürtünme uygulanan kuvvete eşit: 30 N.',
          yanlis: '40 N en büyük değer. Cisim durduğu sürece sürtünme uygulanan kuvvete eşittir: 30 N.',
        },
        kart: 9,
      },
      {
        soru: 'Tuğla geniş yüzü yerine dar yüzü üstüne konursa sürtünme ne olur?',
        siklar: ['Azalır', 'Değişmez'],
        dogru: 1,
        aciklama: {
          dogru: 'Sürtünme temas alanına bağlı değil; N ve yüzey cinsi aynı kaldıkça değişmez.',
          yanlis: 'Alan küçülür ama basınç büyür; sürtünme yalnızca N ve μ’ye bağlı, değişmez.',
        },
        kart: 7,
      },
    ]),
    konu('fzk11-limit-hiz', 'Limit Hız', [
      kart(
        'Akışkan direnci',
        'Hava ya da su içinde hareket eden cisme, hareketine zıt yönde bir direnç kuvveti etki eder.\nBu kuvvet cisim hızlandıkça büyür.',
      ),
      kart(
        'Direnç neye bağlı?',
        '- **Hız:** hız arttıkça artar, yüksek hızda yaklaşık v² ile\n- **Kesit alanı:** harekete dik alan büyüdükçe artar\n- **Akışkanın yoğunluğu:** suda havadan çok daha büyük\n- **Şekil:** aerodinamik biçim direnci azaltır',
      ),
      kart(
        'Direnç formülü',
        '**F(direnç) ≈ k · A · v²**\nk; akışkanın yoğunluğunu ve cismin şeklini içeren bir sabittir.\nHız iki katına çıkınca direnç dört katına çıkar.',
      ),
      kart(
        'Limit hıza nasıl ulaşılır?',
        'Düşen cisimde net kuvvet giderek azalır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Cisim bırakılır', alt: 'direnç sıfır, a = g' },
            { ad: 'Hız artar', alt: 'direnç büyür' },
            { ad: 'Net kuvvet azalır', alt: 'ivme küçülür' },
            { ad: 'Direnç = ağırlık', alt: 'a = 0, sabit hız', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Limit hız formülü',
        'Limit hızda direnç ağırlığa eşittir: m · g = k · A · v²\n**v(limit) = √(m · g / (k · A))**\nBundan sonra cisim sabit hızla düşer.',
      ),
      kart(
        'Değişkenlerin etkisi',
        '- **Kütle artarsa:** limit hız artar\n- **Kesit alanı artarsa:** limit hız azalır\n- **Akışkan yoğunlaşırsa:** limit hız azalır\nHava direnci varken aynı biçimdeki ağır cisim daha hızlı düşer.',
      ),
      kart(
        'Hız-zaman grafiği',
        'Eğim (ivme) başta g’dir ve gittikçe azalır.\nEğri limit hıza yaklaşır, yatay bir doğruya dönüşür.',
        {
          tur: 'koordinat',
          pencere: [0, 9, 0, 11.5],
          eksenler: true,
          xAd: 'zaman',
          yAd: 'hız',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 3.9],
                [2, 6.3],
                [3, 7.8],
                [4, 8.6],
                [6, 9.5],
                [8.5, 9.9],
              ],
            },
            {
              noktalar: [
                [0, 10],
                [9, 10],
              ],
              kirik: true,
              kesik: true,
              renk: 'ikincil',
              ad: 'limit hız',
            },
          ],
        },
      ),
      kart(
        'İvme nasıl değişir?',
        '- **Başta:** a = g\n- **Hızlandıkça:** a = (m · g − F(direnç)) / m, küçülür\n- **Limit hızda:** a = 0\nİvme azalırken hız hâlâ artar; yalnızca daha yavaş artar.',
      ),
      kart(
        'Paraşüt',
        'Paraşütçü açmadan önce yaklaşık 55 m/s limit hıza ulaşır.\nParaşüt açılınca kesit alanı büyür, direnç ağırlığı aşar ve paraşütçü **yavaşlar**.\nYeni ve çok küçük bir limit hıza (≈ 5 m/s) iner.',
      ),
      kart(
        'Paraşüt açılınca ivme',
        'Açıldığı anda direnç ağırlıktan büyüktür: net kuvvet ve ivme **yukarı** yönlüdür.\nParaşütçü yine aşağı gider ama yavaşlayarak gider.',
        undefined,
        { not: 'İvme yukarı diye paraşütçü yukarı çıkmaz. Hız aşağı, ivme yukarıysa cisim yavaşlar.' },
      ),
      kart(
        'Yağmur damlası',
        'Yağmur damlası yaklaşık 9 m/s limit hızla yere iner.\nHava direnci olmasaydı 1 km’den düşen damla yaklaşık 140 m/s hızla çarpardı.',
      ),
      kart(
        'Günlük hayatta',
        '- **Araç tasarımı:** aerodinamik gövde, daha az yakıt\n- **Kayakçı:** çömelerek kesit alanını küçültür\n- **Kuşlar:** kanat açarak yavaşlar, katlayarak dalar\n- **Yağda düşen bilye:** hızla sabit hıza ulaşır',
      ),
    ], [], [
      {
        soru: 'Limit hıza ulaşan cismin ivmesi kaçtır?',
        siklar: ['g', 'Sıfır'],
        dogru: 1,
        aciklama: {
          dogru: 'Direnç ağırlığı dengeler, net kuvvet sıfır: ivme sıfır, hız sabit.',
          yanlis: 'g yalnızca bırakıldığı an geçerli. Limit hızda direnç ağırlığa eşit, ivme sıfır.',
        },
        kart: 5,
      },
      {
        soru: 'Paraşüt açıldığı anda ivmenin yönü nedir?',
        siklar: ['Yukarı', 'Aşağı'],
        dogru: 0,
        aciklama: {
          dogru: 'Direnç ağırlıktan büyük olduğu için net kuvvet yukarı; paraşütçü yavaşlar.',
          yanlis: 'Açıldığı an direnç ağırlığı aşar, net kuvvet yukarı. Hız aşağı, ivme yukarı: yavaşlama.',
        },
        kart: 10,
      },
    ]),
    konu('fzk11-cembersel', 'Çembersel Hareket', [
      kart(
        'Düzgün çembersel hareket',
        'Cisim çember üzerinde **sabit süratle** döner.\n- Sürat sabittir.\n- Hız sabit değildir: yönü her an değişir.\nBu yüzden hareket ivmelidir.',
      ),
      kart(
        'Periyot ve frekans',
        '- **Periyot (T):** bir tam turun süresi, saniye\n- **Frekans (f):** bir saniyedeki tur sayısı, hertz\n**f = 1 / T** — 2 saniyede bir tur atan cisim: f = 0,5 Hz',
      ),
      kart(
        'Çizgisel hız',
        '**v = 2πr / T**\nYönü her an çembere **teğettir**.\nr = 2 m, T = 4 s → v = 2π · 2 / 4 = π ≈ 3,14 m/s',
        {
          tur: 'koordinat',
          pencere: [-2.8, 2.8, -1.72, 1.72],
          eksenler: false,
          cemberler: [{ x: 0, y: 0, r: 1.2 }],
          egriler: [
            {
              noktalar: [
                [0, 0],
                [0, 1.2],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
              ad: 'r',
            },
            {
              noktalar: [
                [0, 1.2],
                [1.4, 1.2],
              ],
              kirik: true,
              ok: true,
              ad: 'v',
            },
            {
              noktalar: [
                [0, 1.2],
                [0, 0.35],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
              ad: 'a',
            },
          ],
          noktalar: [{ x: 0, y: 0, ad: 'merkez' }],
        },
      ),
      kart(
        'Açısal hız',
        'Birim zamanda taranan açıdır.\n**ω = 2π / T = 2πf** (rad/s)\n**v = ω · r**',
      ),
      kart(
        'Aynı eksende dönenler',
        'Dönme dolaptaki bütün kabinler aynı sürede tur atar: **ω aynıdır**.\nMerkeze uzak olan daha büyük çember çizdiği için **v daha büyüktür**.',
      ),
      kart(
        'Kayış ve dişli',
        'Kayışla ya da dişliyle bağlı iki kasnağın kenar noktaları aynı yolu alır: **çizgisel hızlar eşittir**.\n- ω₁ · r₁ = ω₂ · r₂\n- Küçük kasnak daha hızlı döner.',
      ),
      kart(
        'Merkezcil ivme',
        'Hızın **yönündeki** değişim ivme yaratır.\n**a = v² / r = ω² · r**\nYönü her an çemberin merkezine doğrudur.',
      ),
      kart(
        'Merkezcil kuvvet',
        '**F = m · v² / r**\nYeni bir kuvvet türü değildir; merkeze doğru olan net kuvvetin adıdır.\n- İpe bağlı taşta: ip gerilmesi\n- Virajdaki araçta: sürtünme\n- Uyduda: kütle çekimi',
      ),
      kart(
        'İp koparsa',
        'Merkezcil kuvvet ortadan kalkar ve cisim o anki hızının yönünde, yani **teğet doğrultusunda** düz gider.\nDışa doğru savuran bir "merkezkaç kuvvet" yoktur; savrulma eylemsizliktir.',
        undefined,
        { not: 'İp kopunca cisim merkezden dışa değil, teğet boyunca gider. Çizimde oku teğete koy.' },
      ),
      kart(
        'Virajda araç',
        'Sürtünme merkezcil kuvveti sağlar: μ · m · g ≥ m · v² / r\n**v(maks) = √(μ · g · r)**\nμ = 0,5, r = 80 m → v(maks) = √400 = 20 m/s (72 km/h)',
      ),
      kart(
        'Eğimli viraj',
        'Yol dışa doğru yükseltilirse normal kuvvetin yatay bileşeni merkeze doğru olur.\nSürtünme olmadan güvenli hız: **tan θ = v² / (r · g)**\nYarış pistleri ve otoyol virajları bu yüzden eğimlidir.',
      ),
      kart(
        'Düşey çemberde ip',
        '- **Tepede:** T + m · g = m · v² / r\n- **Dipte:** T − m · g = m · v² / r\nİp en çok dipte gerilir.\nTepede ipin gevşememesi için en az **v = √(g · r)** gerekir.',
      ),
      kart(
        'Açısal ivme',
        'Dönme hızı değişiyorsa açısal ivme vardır:\n**α = Δω / Δt** (rad/s²)\nDüzgün çembersel harekette açısal ivme sıfırdır; çalıştırılan vantilatörde sıfırdan farklıdır.',
      ),
    ], [], [
      {
        soru: 'Düzgün çembersel harekette hangisi sabittir?',
        siklar: ['Hız vektörü', 'Sürat'],
        dogru: 1,
        aciklama: {
          dogru: 'Sürat (hızın büyüklüğü) sabit; yön değiştiği için hız vektörü değişir.',
          yanlis: 'Hızın yönü her an değişiyor, bu yüzden hız vektörü sabit değil. Sabit olan sürat.',
        },
        kart: 1,
      },
      {
        soru: 'Dönerken ipi kopan taş hangi yönde gider?',
        siklar: ['Teğet boyunca', 'Merkezden dışa'],
        dogru: 0,
        aciklama: {
          dogru: 'Kuvvet kalkınca taş o anki hızıyla, yani teğet doğrultusunda düz gider.',
          yanlis: 'Dışa iten bir kuvvet yok. Taş koptuğu andaki hız yönünde, teğet boyunca gider.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('fzk11-t2', 'Elektrik ve Manyetizma', [
    konu('fzk11-elektrik-alan', 'Elektriksel Kuvvet ve Elektriksel Alan', [
      kart(
        'Yük hatırlatma',
        '- Aynı işaretli yükler birbirini iter, zıt işaretliler çeker.\n- Yük birimi coulombdur (C).\n- En küçük yük elektronunkidir: e = 1,6 · 10⁻¹⁹ C\n- Yük korunur, yoktan var edilemez.',
      ),
      kart(
        'Coulomb yasası',
        '**F = k · q₁ · q₂ / d²**\n- k = 9 · 10⁹ N · m² / C²\n- Kuvvet yüklerin çarpımıyla doğru, uzaklığın karesiyle ters orantılıdır.\n- Kuvvet iki yükü birleştiren doğru boyuncadır.',
      ),
      kart(
        'Uzaklığın etkisi',
        'Kuvvet uzaklığın **karesiyle** ters orantılıdır.\n- Uzaklık 2 katına çıkarsa kuvvet 1/4’üne iner.\n- Uzaklık 3 katına çıkarsa kuvvet 1/9’una iner.\n- Uzaklık yarıya inerse kuvvet 4 katına çıkar.',
        undefined,
        { not: 'Uzaklık değişince kuvvet karesiyle değişir: 2 kat uzaklık yarı değil dörtte bir kuvvet demek.' },
      ),
      kart(
        'Kuvvetler eşittir',
        'Yükler farklı olsa da iki yük birbirine **eşit büyüklükte, zıt yönde** kuvvet uygular.\nBu, Newton’un etki-tepki yasasıdır: 1 μC ile 5 μC aynı kuvveti hisseder.',
      ),
      kart(
        'Örnek hesap',
        'q₁ = 2 μC, q₂ = 3 μC, d = 0,3 m\nF = 9 · 10⁹ · (2 · 10⁻⁶) · (3 · 10⁻⁶) / 0,09\n**F = 0,6 N**, işaretler aynı olduğu için itme',
      ),
      kart(
        'Birden çok yük',
        'Bir yüke etki eden toplam kuvvet, her yükün uyguladığı kuvvetlerin **vektörel toplamıdır**.\n- Aynı doğrultudakiler toplanır ya da çıkarılır.\n- Dik olanlar Pisagor ile birleşir.',
      ),
      kart(
        'Kütle çekimiyle karşılaştırma',
        '- **Benzerlik:** ikisi de uzaklığın karesiyle ters orantılı\n- **Fark 1:** elektrik kuvveti iter de çeker de, kütle çekimi yalnızca çeker.\n- **Fark 2:** iki proton arasında elektrik kuvveti kütle çekiminden ~10³⁶ kat büyüktür.',
      ),
      kart(
        'Elektriksel alan',
        'Yükün çevresinde başka yüklere kuvvet uygulayabildiği bölgedir.\n**E = F / q** (N/C)\nYönü, oraya konan **pozitif** yüke etki eden kuvvetin yönüdür.',
      ),
      kart(
        'Noktasal yükün alanı',
        '**E = k · q / d²**\n- Pozitif yükün alanı dışa doğrudur.\n- Negatif yükün alanı yüke doğrudur.\nAlan, onu ölçen deneme yükünün büyüklüğüne bağlı değildir.',
      ),
      kart(
        'Alan çizgileri',
        '- Pozitif yükten çıkar, negatif yüke girer.\n- Birbirini kesmez.\n- Sık olduğu yerde alan güçlü, seyrek olduğu yerde zayıftır.\n- Bir noktadaki teğet, oradaki alanın yönüdür.',
      ),
      kart(
        'Paralel levhalar',
        'Zıt yüklü iki paralel levha arasında alan **düzgündür**: her noktada aynı büyüklük ve yön.\n**E = V / d**\n12 V’luk üretece bağlı, 2 cm aralıklı levhalar: E = 600 N/C',
      ),
      kart(
        'Alanda yükün hareketi',
        '- Pozitif yük alan yönünde, negatif yük alana zıt kuvvet görür: F = q · E\n- İvme sabittir: a = q · E / m\nLevhalar arasına yatay giren elektron, yatay atıştaki gibi bir parabol çizerek sapar.',
      ),
      kart(
        'Faraday kafesi',
        'İletken bir kabın içinde elektrik alan **sıfırdır**.\nYükler iletkenin dış yüzeyine dağılır ve içeriyi dış alanlardan korur.\nKafesin kapalı bir kutu olması gerekmez; sık bir tel ızgara da yeter.',
      ),
      kart(
        'Faraday kafesinin kullanımı',
        '- **Yıldırım:** otomobil ve uçağın içindekiler korunur.\n- **Mikrodalga fırın:** kapaktaki ızgara dalgaları içeride tutar.\n- **Kablolar:** örgülü zırh parazitleri keser.\n- **Asansör:** telefonun çekmemesinin sebebi metal kabindir.',
      ),
    ], [], [
      {
        soru: 'İki yük arasındaki uzaklık 3 katına çıkarsa kuvvet ne olur?',
        siklar: ['1/3’üne iner', '1/9’una iner'],
        dogru: 1,
        aciklama: {
          dogru: 'Kuvvet uzaklığın karesiyle ters orantılı: 3² = 9, kuvvet 1/9.',
          yanlis: 'Kuvvet uzaklıkla değil uzaklığın karesiyle ters orantılı: 1/3² = 1/9.',
        },
        kart: 3,
      },
      {
        soru: 'İletken bir kabın içindeki elektrik alan nedir?',
        siklar: ['Sıfır', 'Dışarıdakiyle aynı'],
        dogru: 0,
        aciklama: {
          dogru: 'Yükler dış yüzeye dağılır, içeride alan sıfırlanır: Faraday kafesi.',
          yanlis: 'İletken kap içeriyi korur: yükler dış yüzeye dağılır ve içeride alan sıfır olur.',
        },
        kart: 13,
      },
    ]),
    konu('fzk11-manyetik', 'Manyetik Alan ve Manyetik Kuvvet', [
      kart(
        'Mıknatıs ve kutuplar',
        '- Her mıknatısın N (kuzey) ve S (güney) kutbu vardır.\n- Aynı kutuplar iter, zıt kutuplar çeker.\n- Mıknatıs ikiye bölünse iki küçük mıknatıs olur; tek kutuplu mıknatıs yoktur.',
      ),
      kart(
        'Manyetik alan çizgileri',
        '- Mıknatısın dışında N’den çıkıp S’ye girer.\n- Kapalı eğrilerdir ve birbirini kesmez.\n- Pusula iğnesinin N ucu alanın yönünü gösterir.\nManyetik alanın birimi **tesladır** (T).',
      ),
      kart(
        'Dünya’nın manyetik alanı',
        'Pusulanın N ucu coğrafi kuzeye döner.\nZıt kutuplar çektiğine göre coğrafi kuzey yakınında Dünya’nın **manyetik güney** kutbu vardır.\nBu alan Güneş rüzgârını saptırır; kutup ışıkları bunun sonucudur.',
      ),
      kart(
        'Oersted deneyi',
        '1820’de Oersted, akım geçen telin yanındaki pusulanın saptığını gördü.\n**Akım manyetik alan oluşturur.**\nElektrik ile manyetizmanın bağlı olduğunun ilk kanıtıdır.',
      ),
      kart(
        'Düz telin manyetik alanı',
        'Alan çizgileri telin çevresinde eş merkezli çemberlerdir.\n**B = 2k · I / d**, k = 10⁻⁷ T · m / A\n**Sağ el:** başparmak akım yönünde, kıvrılan parmaklar alanın yönünü gösterir.',
      ),
      kart(
        'Akım makarası',
        'Tel sarmal hâle getirilince içeride düzgün, güçlü bir alan oluşur.\n**B = 4πk · N · I / ℓ**\n**Sağ el:** parmaklar akım yönünde kıvrılınca başparmak N kutbunu gösterir.',
      ),
      kart(
        'Makaranın alanını artırma',
        '- **Sarım sayısını (N)** artır.\n- **Akımı (I)** artır.\n- **Boyu (ℓ)** kısalt, sarımları sıklaştır.\n- **Demir çekirdek** koy; alan yüzlerce kat güçlenir.',
      ),
      kart(
        'Elektromıknatıs',
        'Demir çekirdekli makaradır.\n- Akım kesilince manyetizması kaybolur.\n- Gücü akımla ayarlanır.\nKullanım: hurda vinci, zil, röle, hoparlör, MR cihazı, maglev tren',
      ),
      kart(
        'Akımlı tele kuvvet',
        '**F = B · I · ℓ · sin θ**\n- Tel alana dikken (θ = 90°) kuvvet en büyüktür.\n- Tel alana paralelse kuvvet sıfırdır.\nB = 0,5 T, I = 4 A, ℓ = 0,2 m, dik → F = 0,4 N',
      ),
      kart(
        'Kuvvetin yönü',
        '**Sağ el kuralı:** dört parmak manyetik alan yönünde, başparmak akım yönünde tutulur.\nAvuç içinin baktığı yön kuvvetin yönüdür.\nKuvvet hem alana hem akıma diktir.',
        undefined,
        { not: 'Kuvvet ne alan yönünde ne akım yönünde; ikisine de dik. Sağ elini kâğıt üstünde gerçekten çevir.' },
      ),
      kart(
        'Paralel iki tel',
        'Her tel ötekinin alanında durduğu için birbirine kuvvet uygular.\n- **Aynı yönlü akımlar:** teller birbirini çeker.\n- **Zıt yönlü akımlar:** teller birbirini iter.',
      ),
      kart(
        'Hareketli yüke kuvvet',
        '**F = q · v · B · sin θ**\nKuvvet hıza diktir: yük hızlanmaz, yalnızca yönü değişir.\nAlana dik giren yük **çembersel hareket** yapar; kutup ışıkları ve parçacık hızlandırıcılar bu yüzdendir.',
      ),
      kart(
        'Elektrik motoru',
        'Akım geçen makara mıknatısın alanında dönmeye zorlanır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Makaradan akım geçer', alt: 'mıknatısın alanında' },
            { ad: 'İki kenara zıt kuvvet', alt: 'F = B · I · ℓ' },
            { ad: 'Makara döner', alt: 'döndürme etkisi oluşur' },
            { ad: 'Komütatör akımı çevirir', alt: 'her yarım turda', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Motorun gücü',
        'Motor daha güçlü döner, eğer:\n- akım artırılırsa,\n- sarım sayısı artırılırsa,\n- mıknatısın alanı güçlendirilirse.\nMotor elektrik enerjisini hareket enerjisine çevirir.',
      ),
    ], [], [
      {
        soru: 'Manyetik alana paralel duran akımlı tele etki eden kuvvet?',
        siklar: ['En büyüktür', 'Sıfırdır'],
        dogru: 1,
        aciklama: {
          dogru: 'F = B · I · ℓ · sin θ ve θ = 0: sin 0 = 0, kuvvet yok.',
          yanlis: 'En büyük kuvvet tel alana dikken. Paralelken sin 0° = 0 ve kuvvet sıfır.',
        },
        kart: 9,
      },
      {
        soru: 'Aynı yönde akım taşıyan paralel iki tel ne yapar?',
        siklar: ['Birbirini çeker', 'Birbirini iter'],
        dogru: 0,
        aciklama: {
          dogru: 'Aynı yönlü akımlar birbirini çeker; zıt yönlüler iter.',
          yanlis: 'Yüklerin tersine: aynı yönlü akımlar çeker, zıt yönlü akımlar iter.',
        },
        kart: 11,
      },
    ]),
    konu('fzk11-induksiyon', 'İndüksiyon Akımı', [
      kart(
        'Manyetik akı',
        'Bir yüzeyden geçen manyetik alan çizgisi miktarıdır.\n**Φ = B · A · cos θ**\nθ, alan ile yüzeyin normali arasındaki açıdır. Birimi weberdir (Wb).',
      ),
      kart(
        'Akıyı değiştiren üç şey',
        '- **Alanın büyüklüğü:** mıknatısı yaklaştırmak ya da uzaklaştırmak\n- **Yüzeyin alanı:** halkayı genişletmek ya da daraltmak\n- **Açı:** halkayı alanın içinde döndürmek',
      ),
      kart(
        'Faraday’ın gözlemi',
        '- **Mıknatıs bobine yaklaşırken:** galvanometre sapar.\n- **Mıknatıs dururken:** akım yok.\n- **Mıknatıs uzaklaşırken:** akım ters yönde.\nAkımı akının kendisi değil, **akının değişimi** doğurur.',
        undefined,
        { not: 'Güçlü mıknatıs bobinde duruyorsa akım yok. Soruda "değişim" var mı, ona bak.' },
      ),
      kart(
        'İndüksiyon gerilimi',
        '**ε = −N · ΔΦ / Δt**\n- Sarım sayısı arttıkça gerilim artar.\n- Değişim hızlandıkça gerilim artar.\nEksi işareti Lenz yasasını, yani akımın yönünü anlatır.',
      ),
      kart(
        'Örnek hesap',
        '100 sarımlı bobinde akı 0,1 s’de 0,02 Wb’den sıfıra iniyor:\nε = 100 · 0,02 / 0,1 = **20 V**\nAynı değişim 0,05 s’de olsaydı gerilim 40 V olurdu.',
      ),
      kart(
        'Lenz yasası',
        'İndüksiyon akımı, kendisini doğuran değişime **karşı koyacak** yönde oluşur.\n- N kutbu yaklaşırken bobinin o ucu N olur ve iter.\n- N kutbu uzaklaşırken o uç S olur ve çeker.\nBu, enerjinin korunumunun sonucudur.',
      ),
      kart(
        'Hareketli iletken çubuk',
        'Alanın içinde hareket eden çubuğun uçları arasında gerilim oluşur:\n**ε = B · ℓ · v**\nB = 0,5 T, ℓ = 0,4 m, v = 10 m/s → ε = 2 V',
      ),
      kart(
        'Alternatif akım üretimi',
        'Alternatörde bobin manyetik alanın içinde döner.\n- Akı sürekli artıp azalır.\n- Oluşan akımın yönü periyodik olarak değişir: **alternatif akım**\nTürkiye’de şebeke 50 Hz’dir.',
      ),
      kart(
        'Alternatif gerilim grafiği',
        '**V = V(maks) · sin(ωt)**\nYarım periyotta bir yönde, sonraki yarım periyotta öteki yönde akar.',
        {
          tur: 'koordinat',
          pencere: [0, 6.6, -1.5, 1.5],
          eksenler: true,
          xAd: 'zaman',
          yAd: 'gerilim',
          egriler: [
            {
              noktalar: [
                [0, 0],
                [0.785, 0.707],
                [1.571, 1],
                [2.356, 0.707],
                [3.142, 0],
                [3.927, -0.707],
                [4.712, -1],
                [5.498, -0.707],
                [6.283, 0],
              ],
            },
          ],
          etiketler: [
            { x: 1.571, y: 1.3, ad: 'V(maks)' },
            { x: 4.712, y: -1.3, ad: '−V(maks)' },
          ],
        },
      ),
      kart(
        'Etkin değer',
        'Alternatif akımın aynı ısıyı üreten doğru akım karşılığıdır.\n**V(etkin) = V(maks) / √2 ≈ 0,707 · V(maks)**\nPrizdeki 220 V etkin değerdir; tepe değeri yaklaşık 311 V’tur.',
      ),
      kart(
        'Doğru ve alternatif akım',
        'Pil doğru akım, santral alternatif akım üretir.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Doğru akım', 'Alternatif akım'],
          satirlar: [
            ['Yön', 'Sabit', 'Periyodik değişir'],
            ['Kaynak', 'Pil, akü, güneş pili', 'Alternatör, şebeke'],
            ['Gerilim değiştirme', 'Zor', 'Transformatörle kolay'],
          ],
        },
      ),
      kart(
        'Günlük hayatta indüksiyon',
        '- **Santral:** türbin bobini döndürür, elektrik üretilir.\n- **İndüksiyon ocağı:** değişken alan tencerenin tabanında akım oluşturup ısıtır.\n- **Kablosuz şarj:** iki bobin arasında enerji aktarılır.\n- **Metal dedektörü:** metalde oluşan akım fark edilir.',
      ),
      kart(
        'Girdap akımları',
        'Değişken alandaki metal levhada dönen akımlar oluşur.\n- **Faydası:** hızlı trenlerde temassız fren, indüksiyonla ısıtma\n- **Zararı:** transformatör çekirdeğinde ısı kaybı\nÇekirdek bu yüzden ince katmanlardan yapılır.',
      ),
    ], [], [
      {
        soru: 'Mıknatıs bobinin içinde hareketsiz duruyorsa akım oluşur mu?',
        siklar: ['Evet, akı büyük', 'Hayır, akı değişmiyor'],
        dogru: 1,
        aciklama: {
          dogru: 'İndüksiyon akımını akının değişimi doğurur; değişim yoksa akım da yok.',
          yanlis: 'Akının büyüklüğü yetmez; akım yalnızca akı değişirken oluşur.',
        },
        kart: 3,
      },
      {
        soru: 'Prizdeki 220 V hangi değerdir?',
        siklar: ['Etkin değer', 'Tepe değeri'],
        dogru: 0,
        aciklama: {
          dogru: '220 V etkin değer; tepe değeri 220 · √2 ≈ 311 V.',
          yanlis: 'Tepe değeri yaklaşık 311 V. Şebekede yazan 220 V etkin değer.',
        },
        kart: 10,
      },
    ]),
    konu('fzk11-transformator', 'Transformatörler', [
      kart(
        'Transformatör nedir?',
        'Alternatif gerilimi **yükselten ya da düşüren** araçtır.\nŞarj adaptöründen elektrik iletim hattına kadar her yerde kullanılır.',
      ),
      kart(
        'Yapısı',
        '- **Demir çekirdek:** akıyı bir sargıdan ötekine taşır.\n- **Birincil (primer) sargı:** gerilimin girdiği sargı\n- **İkincil (sekonder) sargı:** gerilimin alındığı sargı\nİki sargı birbirine elektriksel olarak bağlı değildir.',
      ),
      kart(
        'Çalışma ilkesi',
        '- Birincil sargıdan geçen alternatif akım değişken bir akı oluşturur.\n- Çekirdek bu akıyı ikincil sargıya taşır.\n- Değişen akı ikincil sargıda indüksiyon gerilimi doğurur.\nDoğru akımda akı değişmez, transformatör çalışmaz.',
        undefined,
        { not: 'Transformatör doğru akımla çalışmaz; gerilimi indüksiyon yapar, indüksiyon da değişim ister.' },
      ),
      kart(
        'Gerilim oranı',
        '**V₂ / V₁ = N₂ / N₁**\nGerilim, sarım sayısıyla doğru orantılıdır.\n- **N₂ > N₁:** yükseltici transformatör\n- **N₂ < N₁:** düşürücü transformatör',
      ),
      kart(
        'Akım oranı',
        'İdeal transformatörde güç korunur: V₁ · I₁ = V₂ · I₂\n**I₂ / I₁ = N₁ / N₂**\nGerilim yükselirken akım aynı oranda düşer; enerji bedava artmaz.',
      ),
      kart(
        'Çözümlü örnek',
        'N₁ = 200, N₂ = 10, V₁ = 220 V\n- **V₂:** 220 · 10 / 200 = 11 V\n- **I₂ = 2 A ise I₁:** 2 · 10 / 200 = 0,1 A\nGüç iki yanda da 22 W.',
      ),
      kart(
        'Verim ve kayıplar',
        '**Verim = çıkış gücü / giriş gücü**\n- Sargı direncinde ısınma\n- Çekirdekte girdap akımları\n- Çekirdeğin tekrar tekrar mıknatıslanması\n- Akının bir kısmının dışarı kaçması',
      ),
      kart(
        'Kayıpları azaltma',
        '- **Katmanlı çekirdek:** girdap akımlarını keser.\n- **Kalın bakır tel:** sargı direncini düşürür.\n- **Yumuşak demir:** kolay mıknatıslanıp kolay bırakır.\n- **Kapalı çekirdek:** akı kaçağını önler.',
      ),
      kart(
        'Neden yüksek gerilimle iletim?',
        'Hatta ısıya giden güç **P = I² · R**’dir.\nAynı güç yüksek gerilimle düşük akımda taşınır.\n1 MW’ı 10 kV yerine 100 kV ile taşımak akımı 10’da birine, kaybı **100’de birine** indirir.',
      ),
      kart(
        'Santralden eve',
        'Gerilim yol boyunca iki kez değiştirilir.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Santral', alt: 'yaklaşık 10–20 kV' },
            { ad: 'Yükseltici', alt: '154–380 kV', renk: 'ikincil' },
            { ad: 'İletim hattı', alt: 'düşük akım, az kayıp' },
            { ad: 'Düşürücü trafolar', alt: 'şehir ve mahalle', renk: 'ikincil' },
            { ad: 'Ev', alt: '220 V' },
          ],
        },
      ),
      kart(
        'Kullanım alanları',
        '- **Şarj adaptörü:** 220 V’u birkaç volta düşürür.\n- **Kaynak makinesi:** gerilimi düşürüp akımı çok büyütür.\n- **Mikrodalga fırın:** gerilimi binlerce volta çıkarır.\n- **Kapı zili, oyuncak tren:** düşük ve güvenli gerilim',
      ),
    ], [], [
      {
        soru: 'N₁ = 100, N₂ = 500 olan transformatör hangisidir?',
        siklar: ['Düşürücü', 'Yükseltici'],
        dogru: 1,
        aciklama: {
          dogru: 'İkincil sargının sarımı fazla: gerilim 5 katına çıkar, yükseltici.',
          yanlis: 'N₂ > N₁ olduğu için gerilim artar: 5 kat yükseltici. Akım ise 5 kat düşer.',
        },
        kart: 4,
      },
      {
        soru: 'Elektrik neden yüksek gerilimle iletilir?',
        siklar: ['Akım düşer, ısı kaybı azalır', 'Enerji artar'],
        dogru: 0,
        aciklama: {
          dogru: 'Kayıp I² · R: akım 10 kat düşünce kayıp 100 kat azalır.',
          yanlis: 'Transformatör enerji üretmez. Yüksek gerilim akımı düşürür ve I² · R kaybını azaltır.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('fzk11-t3', 'Optik', [
    konu('fzk11-aydinlanma', 'Işık Şiddeti, Işık Akısı ve Aydınlanma', [
      kart(
        'Işık şiddeti',
        'Bir kaynağın belli bir yöne, birim katı açıya yaydığı ışık miktarıdır.\n- **Sembol:** I\n- **Birim:** kandela (cd)\nKaynağın kendi özelliğidir; uzaklığa bağlı değildir.',
      ),
      kart(
        'Işık akısı',
        'Kaynaktan her yöne çıkan **toplam** ışık miktarıdır.\n- **Sembol:** Φ\n- **Birim:** lümen (lm)\nHer yöne eşit ışık saçan noktasal kaynakta Φ = 4π · I',
      ),
      kart(
        'Aydınlanma',
        'Bir yüzeyin birim alanına düşen ışık akısıdır.\n**E = Φ / A**\nBirimi lükstür: 1 lx = 1 lm / m²\nAydınlanma kaynağın değil, **yüzeyin** özelliğidir.',
      ),
      kart(
        'Uzaklığın etkisi',
        'Işık dik düşüyorsa: **E = I / d²**\n- Uzaklık 2 katına çıkınca aydınlanma 1/4’üne iner.\n- Uzaklık 3 katına çıkınca 1/9’una iner.\nAynı ışık gittikçe büyüyen bir alana yayılır.',
        undefined,
        { not: 'Lambayı iki kat uzağa koymak masayı yarı değil dörtte bir aydınlatır.' },
      ),
      kart(
        'Eğik düşme',
        'Işık yüzeye eğik gelirse aynı akı daha geniş alana yayılır.\n**E = I · cos α / d²**\nα, ışın ile yüzeyin normali arasındaki açıdır; dik düşmede α = 0 ve cos α = 1.',
      ),
      kart(
        'Örnek hesap',
        '90 cd’lik lamba 3 m uzaktaki masaya dik ışık veriyor:\nE = 90 / 3² = **10 lx**\nIşık normalle 60° yaparsa: E = 10 · cos 60° = **5 lx**',
      ),
      kart(
        'Eşit aydınlatma',
        'İki kaynak bir perdeyi eşit aydınlatıyorsa:\n**I₁ / d₁² = I₂ / d₂²**\n40 cd’lik lamba 2 m’de ise 10 cd’lik lamba 1 m’de aynı aydınlanmayı verir.\nKaynak şiddetleri bu yolla karşılaştırılır.',
      ),
      kart(
        'Fotometre',
        'Işık şiddetlerini karşılaştıran araçtır.\nYağ lekeli kâğıt iki kaynak arasına konur; leke iki yandan eşit aydınlanınca kaybolur.\nO konumdaki uzaklıklarla şiddetlerin oranı bulunur.',
      ),
      kart(
        'Aydınlanma değerleri',
        'Ders çalışılan masada en az 500 lüks önerilir.',
        {
          tur: 'tablo',
          basliklar: ['Ortam', 'Aydınlanma'],
          satirlar: [
            ['Güneşli gün, açık hava', '≈ 100.000 lx'],
            ['Kapalı hava', '≈ 1.000 lx'],
            ['Çalışma masası', '≈ 500 lx'],
            ['Koridor', '≈ 100 lx'],
            ['Dolunay gecesi', '≈ 0,1 lx'],
          ],
        },
      ),
      kart(
        'Lambada lümen',
        'Lamba etiketindeki lümen akıyı, watt harcanan gücü söyler.\n- 800 lm’lik LED ≈ 9 W\n- 800 lm’lik eski akkor lamba ≈ 60 W\nVerim, watt başına düşen lümendir: LED çok daha verimlidir.',
      ),
      kart(
        'Üç kavramı ayırmak',
        '- **Işık şiddeti (cd):** kaynağın bir yöne ne kadar parladığı\n- **Işık akısı (lm):** kaynaktan çıkan toplam ışık\n- **Aydınlanma (lx):** yüzeye birim alan başına düşen ışık',
      ),
    ], [], [
      {
        soru: 'Lamba masadan iki kat uzağa taşınırsa aydınlanma ne olur?',
        siklar: ['Yarıya iner', 'Dörtte birine iner'],
        dogru: 1,
        aciklama: {
          dogru: 'E = I / d²: uzaklık 2 kat, aydınlanma 1/2² = 1/4.',
          yanlis: 'Aydınlanma uzaklığın karesiyle ters orantılı: 1/2² = 1/4.',
        },
        kart: 4,
      },
      {
        soru: 'Lüks hangi niceliğin birimidir?',
        siklar: ['Aydınlanma', 'Işık şiddeti'],
        dogru: 0,
        aciklama: {
          dogru: 'Lüks aydınlanmanın birimi: lümen bölü metrekare.',
          yanlis: 'Işık şiddetinin birimi kandela. Lüks yüzeyin aydınlanmasını ölçer.',
        },
        kart: 11,
      },
    ]),
    konu('fzk11-duzlem-ayna', 'Düzlem Aynalar', [
      kart(
        'Yansıma yasaları',
        '- Gelen ışın, normal ve yansıyan ışın **aynı düzlemdedir**.\n- Gelme açısı **yansıma açısına** eşittir.\nAçılar yüzeye göre değil, yüzeye dik olan **normale** göre ölçülür.',
      ),
      kart(
        'Düzgün ve dağınık yansıma',
        '- **Düzgün:** pürüzsüz yüzeyde paralel ışınlar paralel yansır, görüntü oluşur.\n- **Dağınık:** pürüzlü yüzeyde ışınlar her yöne saçılır, cismi her yönden görürüz.\nYansıma yasaları iki durumda da her ışın için geçerlidir.',
      ),
      kart(
        'Görüntünün özellikleri',
        '- Sanal ve düzdür.\n- Boyu cismin boyuna eşittir.\n- Aynaya uzaklığı cismin uzaklığına eşittir.\n- Sağ ile sol yer değiştirmiş görünür: görüntü cismin simetriğidir.',
      ),
      kart(
        'Görüntü nasıl oluşur?',
        'Cisimden çıkan ışınlar aynadan yansır ve gözümüze gelir.\nBeyin ışınların **uzantılarının** kesiştiği yeri görür; orada gerçek bir ışık yoktur.',
        {
          tur: 'koordinat',
          pencere: [-4, 4, -1, 4],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, -0.5],
                [0, 3.8],
              ],
              kirik: true,
              ad: 'ayna',
            },
            {
              noktalar: [
                [-3, 2],
                [0, 1],
                [-3, 0],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [0, 1],
                [3, 2],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
          ],
          noktalar: [
            { x: -3, y: 2, ad: 'cisim' },
            { x: 3, y: 2, bos: true, ad: 'görüntü' },
          ],
        },
      ),
      kart(
        'Boy aynası',
        'Kişinin kendini boydan boya görmesi için ayna **boyunun yarısı** kadar olmalıdır.\nBu uzunluk aynaya olan uzaklıktan bağımsızdır: geri çekilmek daha çok görmeyi sağlamaz.',
        undefined,
        { not: 'Aynadan uzaklaşınca görüntü küçülmez, yalnızca uzaklaşır; boy aynası yine boyun yarısı olmalı.' },
      ),
      kart(
        'Görüş alanı',
        'Gözün aynadaki görüntüsünden aynanın iki kenarına doğrular çizilir.\nBu iki doğrunun arasında kalan bölge aynada görülebilen alandır.\nAynaya yaklaştıkça görüş alanı genişler.',
      ),
      kart(
        'Aynayı döndürmek',
        'Ayna α kadar döndürülürse yansıyan ışın **2α** kadar döner.\nGelen ışın sabit kalırken normal α döndüğü için hem gelme hem yansıma açısı α değişir.',
      ),
      kart(
        'Aynaya yaklaşmak',
        'Kişi aynaya v hızıyla yaklaşırsa görüntüsü de aynaya v hızıyla yaklaşır.\nKişi ile görüntüsü birbirine **2v** hızıyla yaklaşır.',
      ),
      kart(
        'Açılı iki ayna',
        'Aralarında θ açısı olan iki aynada görüntü sayısı:\n**n = 360° / θ − 1** (360°/θ tam sayıysa)\n- 90° → 3 görüntü\n- 60° → 5 görüntü\n- Paralel aynalar → sonsuz görüntü',
      ),
      kart(
        'Köşe yansıtıcı',
        'Birbirine dik iki aynaya gelen ışın, geldiği doğrultuya **paralel** ve ters yönde döner.\nBisiklet reflektörleri ve Ay’a bırakılan lazer yansıtıcıları bu ilkeyle çalışır.',
      ),
      kart(
        'Periskop',
        'Birbirine paralel ve 45° eğik iki düzlem ayna ışığı iki kez 90° çevirir.\nDenizaltılarda ve siperlerde engelin üstünden bakmak için kullanılır.',
      ),
      kart(
        'Gündelik kullanım',
        '- **Araç iç dikiz aynası:** düzlem ayna, uzaklığı doğru gösterir\n- **Kaleydoskop:** açılı aynalarla çoğaltılmış desenler\n- **Dar mağazalar:** duvar aynası alanı iki kat gösterir',
      ),
    ], [], [
      {
        soru: 'Düzlem aynada görüntünün boyu neye bağlıdır?',
        siklar: ['Aynaya uzaklığa', 'Yalnızca cismin boyuna'],
        dogru: 1,
        aciklama: {
          dogru: 'Düzlem aynada görüntü her uzaklıkta cisimle aynı boydadır.',
          yanlis: 'Uzaklaşınca görüntü küçülmez; uzakta küçük görünmesi gözümüzün algısıdır.',
        },
        kart: 3,
      },
      {
        soru: 'Aralarında 60° olan iki aynada kaç görüntü oluşur?',
        siklar: ['5', '6'],
        dogru: 0,
        aciklama: {
          dogru: 'n = 360 / 60 − 1 = 5.',
          yanlis: '360 / 60 = 6, ama cismin kendisi bu sayının içinde: görüntü sayısı 6 − 1 = 5.',
        },
        kart: 9,
      },
    ]),
    konu('fzk11-kuresel-ayna', 'Küresel Aynalar', [
      kart(
        'Çukur ve tümsek ayna',
        'Küre yüzeyinden kesilmiş aynalardır.\n- **Çukur (içbükey):** iç yüzeyi yansıtır, paralel ışığı toplar.\n- **Tümsek (dışbükey):** dış yüzeyi yansıtır, paralel ışığı dağıtır.',
      ),
      kart(
        'Temel noktalar',
        '- **Merkez (M):** kürenin merkezi\n- **Tepe noktası (T):** aynanın ortası\n- **Odak (F):** M ile T’nin tam ortası, f = r / 2\n- **Asal eksen:** M, F ve T’den geçen doğru',
        {
          tur: 'koordinat',
          pencere: [-1, 9, -3, 3],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [0, 0],
                [9, 0],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [7.1, -2.8],
                [7.7, -1.5],
                [8, 0],
                [7.7, 1.5],
                [7.1, 2.8],
              ],
            },
          ],
          noktalar: [
            { x: 0, y: 0, ad: 'M' },
            { x: 4, y: 0, ad: 'F' },
            { x: 8, y: 0, ad: 'T' },
          ],
        },
      ),
      kart(
        'Çukur aynada özel ışınlar',
        '- **Asal eksene paralel gelen:** odaktan geçerek yansır.\n- **Odaktan geçerek gelen:** asal eksene paralel yansır.\n- **Merkezden geçerek gelen:** kendi üstünden geri döner.\n- **Tepeye gelen:** asal eksene göre simetrik yansır.',
      ),
      kart(
        'Tümsek aynada özel ışınlar',
        '- **Paralel gelen:** uzantısı odaktan geçecek şekilde yansır.\n- **Odağa doğru gelen:** asal eksene paralel yansır.\n- **Merkeze doğru gelen:** kendi üstünden geri döner.\nTümsek aynanın odağı aynanın arkasındadır.',
      ),
      kart(
        'Çukur ayna görüntüleri',
        'Cisim aynaya yaklaştıkça görüntü uzaklaşır ve büyür.',
        {
          tur: 'tablo',
          basliklar: ['Cismin yeri', 'Görüntü'],
          satirlar: [
            ['M’nin dışında', 'F–M arası, gerçek, ters, küçük'],
            ['M’de', 'M’de, gerçek, ters, eşit'],
            ['F ile M arasında', 'M dışı, gerçek, ters, büyük'],
            ['F’de', 'Oluşmaz (sonsuzda)'],
            ['F ile T arasında', 'Arkada, sanal, düz, büyük'],
          ],
        },
      ),
      kart(
        'Tümsek ayna görüntüsü',
        'Cisim nerede olursa olsun görüntü:\n- sanal, düz ve küçüktür;\n- aynanın arkasında, F ile T arasındadır.\nGörüş alanı düzlem aynadan geniştir.',
      ),
      kart(
        'Ayna denklemi',
        '**1 / f = 1 / d(cisim) + 1 / d(görüntü)**\n**Büyütme:** m = h(görüntü) / h(cisim) = −d(görüntü) / d(cisim)\n- Gerçek görüntü uzaklığı +, sanal −\n- Çukur aynada f +, tümsek aynada f −',
      ),
      kart(
        'Gerçek görüntü örneği',
        'f = 10 cm çukur ayna, cisim 30 cm’de:\n- 1 / d(görüntü) = 1/10 − 1/30 = 2/30 → d(görüntü) = 15 cm\n- m = −15 / 30 = −1/2\nGörüntü gerçek, ters ve cismin yarısı boyunda.',
      ),
      kart(
        'Sanal görüntü örneği',
        'f = 10 cm çukur ayna, cisim 5 cm’de:\n- 1 / d(görüntü) = 1/10 − 1/5 = −1/10 → d(görüntü) = −10 cm\n- m = 10 / 5 = 2\nGörüntü sanal, düz, iki kat büyük ve aynanın arkasında.',
      ),
      kart(
        'Gerçek ve sanal görüntü',
        '- **Gerçek:** ışınların kendisi kesişir, perdeye düşer, çukur aynada hep terstir.\n- **Sanal:** ışınların uzantıları kesişir, perdeye düşmez, düzdür.',
        undefined,
        { not: 'Görüntü perdeye düşüyorsa gerçektir. Küresel aynada gerçek görüntü ters, sanal görüntü düzdür.' },
      ),
      kart(
        'Çukur aynanın kullanımı',
        '- **Far ve el feneri:** ampul odakta, ışık paralel çıkar.\n- **Makyaj ve diş hekimi aynası:** yüz F içinde, büyük ve düz görünür.\n- **Güneş ocağı:** paralel güneş ışınları odakta toplanır.\n- **Teleskop:** uzak yıldızın ışığını toplar.',
      ),
      kart(
        'Tümsek aynanın kullanımı',
        '- **Araç yan aynası:** geniş alan gösterir; "nesneler göründüğünden yakındır" yazar.\n- **Kavşak aynası:** kör noktayı gösterir.\n- **Market güvenlik aynası:** bütün koridoru tek bakışta gösterir.',
      ),
    ], [], [
      {
        soru: 'Çukur aynada cisim odak ile ayna arasındaysa görüntü nasıldır?',
        siklar: ['Sanal, düz, büyük', 'Gerçek, ters, küçük'],
        dogru: 0,
        aciklama: {
          dogru: 'F ile T arasındaki cismin görüntüsü aynanın arkasında, sanal, düz ve büyük: makyaj aynası.',
          yanlis: 'Gerçek ve küçük görüntü cisim M’nin dışındayken oluşur. F içindeyse sanal, düz, büyük.',
        },
        kart: 5,
      },
      {
        soru: 'Araç yan aynası neden tümsek yapılır?',
        siklar: ['Görüntüyü büyüttüğü için', 'Geniş alan gösterdiği için'],
        dogru: 1,
        aciklama: {
          dogru: 'Tümsek ayna görüntüyü küçültür ama çok geniş bir alanı gösterir.',
          yanlis: 'Tümsek ayna görüntüyü küçültür. Tercih sebebi görüş alanının genişliği.',
        },
        kart: 12,
      },
    ]),
    konu('fzk11-kirilma', 'Kırılma', [
      kart(
        'Kırılma nedir?',
        'Işık bir saydam ortamdan ötekine geçerken hızı değişir ve doğrultusu kırılır.\nYüzeye **dik** gelen ışın hız değiştirir ama kırılmadan geçer.',
      ),
      kart(
        'Kırıcılık indisi',
        '**n = c / v** — ışığın boşluktaki hızının ortamdaki hızına oranı\nIşık ortamda yavaşladıkça n büyür.',
        {
          tur: 'tablo',
          basliklar: ['Ortam', 'n'],
          satirlar: [
            ['Boşluk, hava', '1,00'],
            ['Su', '1,33'],
            ['Cam', '1,50'],
            ['Elmas', '2,42'],
          ],
        },
      ),
      kart(
        'Snell yasası',
        '**n₁ · sin θ₁ = n₂ · sin θ₂**\nθ₁ gelme, θ₂ kırılma açısıdır; ikisi de normale göre ölçülür.\nKırıcılık indisi büyük olan ortamda açı küçüktür.',
      ),
      kart(
        'Kırılmanın yönü',
        '- **Az yoğundan çok yoğuna** (havadan suya): normale yaklaşır.\n- **Çok yoğundan az yoğuna** (sudan havaya): normalden uzaklaşır.\nYoğunluk burada kırıcılık indisi anlamındadır.',
        {
          tur: 'koordinat',
          pencere: [-3, 3, -2.5, 2.5],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [-3, 0],
                [3, 0],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [0, 2.4],
                [0, -2.4],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
              ad: 'normal',
            },
            {
              noktalar: [
                [-2, 2],
                [0, 0],
              ],
              kirik: true,
              ok: true,
            },
            {
              noktalar: [
                [0, 0],
                [1.1, -2],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          etiketler: [
            { x: -2.4, y: 0.35, ad: 'hava' },
            { x: -2.4, y: -0.4, ad: 'su' },
          ],
        },
      ),
      kart(
        'Örnek hesap',
        'Işık havadan (n = 1) suya (n = 4/3) 53° ile geliyor, sin 53° = 0,8:\n1 · 0,8 = (4/3) · sin θ₂ → sin θ₂ = 0,6\n**θ₂ = 37°**: ışın normale yaklaştı.',
      ),
      kart(
        'Frekans değişmez',
        'Ortam değişince ışığın hızı ve dalga boyu değişir.\n**Frekansı ve dolayısıyla rengi değişmez.**\nSuyun altındaki kırmızı top yine kırmızı görünür.',
      ),
      kart(
        'Sınır açısı',
        'Çok yoğundan az yoğuna geçerken kırılma açısının 90° olduğu gelme açısıdır.\n**sin θₛ = n₂ / n₁** (n₁ > n₂)\n- Su → hava: θₛ ≈ 48,6°\n- Cam → hava: θₛ ≈ 42°',
      ),
      kart(
        'Tam yansıma',
        'Gelme açısı sınır açısından büyükse ışık ikinci ortama hiç geçmez, **tamamen yansır**.\nİki koşul birden gerekir:\n- Işık çok yoğundan az yoğuna gidiyor.\n- Gelme açısı sınır açısından büyük.',
        undefined,
        { not: 'Havadan suya giden ışıkta tam yansıma olmaz; ışık önce yoğun ortamın içinde olmalı.' },
      ),
      kart(
        'Tam yansıma örnekleri',
        '- **Elmas:** sınır açısı yalnızca 24,4°; ışık içeride çok kez yansır ve parlar.\n- **Fiber optik:** ışık lif içinde yansıyarak ilerler.\n- **Dürbün prizması:** ayna yerine tam yansıma kullanılır.',
      ),
      kart(
        'Serap',
        'Sıcak asfaltın hemen üstündeki hava daha sıcak ve seyrektir.\nGökyüzünden gelen ışık bu katmanlarda kırılarak yukarı döner.\nGöz gökyüzünün görüntüsünü yerde görür: yol ıslak gibi parlar.',
      ),
      kart(
        'Paralel yüzlü levha',
        'Işık cam levhaya girerken ve çıkarken iki kez kırılır.\nÇıkan ışın gelen ışına **paraleldir**, yalnızca yana kaymıştır.\nKalın cam arkasındaki cisim biraz kaymış görünür.',
      ),
      kart(
        'Atmosferde kırılma',
        '- Güneş ufkun altına indiği hâlde birkaç dakika daha görünür.\n- Yıldızlar titrer, çünkü hava katmanları sürekli kıpırdar.\n- Batan Güneş basık görünür; alt kenarı daha çok kırılır.',
      ),
    ], [], [
      {
        soru: 'Işık havadan cama geçerken nasıl kırılır?',
        siklar: ['Normalden uzaklaşır', 'Normale yaklaşır'],
        dogru: 1,
        aciklama: {
          dogru: 'Cam daha yüksek indisli; ışık yavaşlar ve normale yaklaşır.',
          yanlis: 'Normalden uzaklaşma yoğundan seyreğe geçişte. Havadan cama ışık normale yaklaşır.',
        },
        kart: 4,
      },
      {
        soru: 'Tam yansıma hangi geçişte olabilir?',
        siklar: ['Sudan havaya', 'Havadan suya'],
        dogru: 0,
        aciklama: {
          dogru: 'Tam yansıma için ışık yüksek indisli ortamdan düşük indisliye gitmeli.',
          yanlis: 'Havadan suya giden ışık hep kırılıp geçer. Tam yansıma yoğundan seyreğe geçişte.',
        },
        kart: 8,
      },
    ]),
    konu('fzk11-gorunur-derinlik', 'Görünür Derinlik', [
      kart(
        'Havuz neden sığ görünür?',
        'Sudaki cisimden gelen ışın yüzeyden çıkarken normalden uzaklaşır.\nGöz ışını geldiği doğrultuda geriye uzatır.\nUzantılar gerçek yerden daha **yukarıda** kesişir: cisim yüksekte görünür.',
      ),
      kart(
        'Görünür derinlik formülü',
        'Yukarıdan, dike yakın bakılınca:\n**h(görünür) = h(gerçek) · n(gözlemci) / n(cisim)**\nHavadan suya bakan için: h(görünür) = h(gerçek) / n(su)',
      ),
      kart(
        'Çözümlü örnek',
        'Derinliği 2 m olan havuz, n(su) = 4/3:\nh(görünür) = 2 · 1 / (4/3) = **1,5 m**\nHavuz olduğundan dörtte bir sığ görünür.',
      ),
      kart(
        'Sudan havaya bakmak',
        'Sudaki balık havadaki kuşa bakarsa kuş **olduğundan uzak** görünür.\nh(görünür) = h(gerçek) · n(su) / n(hava)\nSudan 3 m yukarıdaki kuş balığa 4 m yukarıda görünür.',
      ),
      kart(
        'Bakış açısının etkisi',
        'Formül dike yakın bakış içindir.\nEğik bakıldıkça ışınlar daha çok kırılır ve cisim **daha da sığda** görünür.\nHavuzun uzak ucu yakın ucundan daha sığ görünür.',
      ),
      kart(
        'Kırık görünen kalem',
        'Bardaktaki kalemin sudaki kısmı yukarı kalkmış görünür.\nHavadaki kısım yerinde kaldığı için kalem yüzeyde **kırılmış** gibi durur.',
      ),
      kart(
        'Üst üste ortamlar',
        'Cisim birkaç saydam katmanın altındaysa her katmanın katkısı ayrı hesaplanıp toplanır:\n**h(görünür) = h₁ · n(göz) / n₁ + h₂ · n(göz) / n₂ + …**',
      ),
      kart(
        'Kırıcılık indisini ölçmek',
        'Havadan bakınca: **n = h(gerçek) / h(görünür)**\nKabın dibindeki bozuk para 12 cm derinde, 9 cm’de görünüyorsa:\nn = 12 / 9 = 4/3, sıvı su olabilir.',
      ),
      kart(
        'Deneyle gözlem',
        '- Kabın dibine bir bozuk para koy, suyu yavaş yavaş ekle.\n- Yandan tam görünmeyen para su eklenince görünür hâle gelir.\n- Farklı sıvılarda paranın yükselme miktarını karşılaştır.',
      ),
      kart(
        'Günlük hayatta',
        '- Havuza atlayan kişi derinliği hafife alabilir; bu tehlikelidir.\n- Mızrakla balık avlayan, gördüğü balığın **altına** nişan alır.\n- Dere yatağındaki taşlar olduğundan yakın görünür.',
        undefined,
        { not: 'Sudaki cisim olduğundan yukarıda görünür; asıl yeri gördüğünün altındadır.' },
      ),
    ], [], [
      {
        soru: '4 m derin havuz (n = 4/3) yukarıdan kaç m görünür?',
        siklar: ['3 m', '5,3 m'],
        dogru: 0,
        aciklama: {
          dogru: 'h(görünür) = 4 / (4/3) = 3 m. Havuz olduğundan sığ görünür.',
          yanlis: 'Havadan bakınca derinlik n’ye bölünür: 4 / (4/3) = 3 m. Havuz derin değil sığ görünür.',
        },
        kart: 3,
      },
    ]),
    konu('fzk11-fiber', 'Fiber Optik', [
      kart(
        'Fiber optik kablo nedir?',
        'Işığı içinde **tam yansımayla** taşıyan, saç teli inceliğinde cam ya da plastik liftir.\nIşık lif büküldüğünde bile dışarı kaçmadan ilerler.',
      ),
      kart(
        'Katmanları',
        'Işık yalnızca çekirdekte ilerler.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Dış kılıf', alt: 'mekanik koruma' },
            { ad: 'Tampon', alt: 'darbe emici' },
            { ad: 'Örtü (kaplama)', alt: 'düşük kırıcılık indisi', renk: 'ikincil' },
            { ad: 'Çekirdek', alt: 'yüksek kırıcılık indisi', renk: 'ana' },
          ],
        },
      ),
      kart(
        'Çalışma ilkesi',
        '- Çekirdeğin kırıcılık indisi örtününkinden büyüktür.\n- Işık çekirdek-örtü sınırına sınır açısından büyük açıyla gelir.\n- Her seferinde tam yansır ve zikzak çizerek ilerler.',
        undefined,
        { not: 'Işık lifte aynadan değil, tam yansımadan döner. Çekirdeğin indisi örtüden büyük olmak zorunda.' },
      ),
      kart(
        'Kabul açısı',
        'Lifin ucuna yalnızca belli bir açının içinden gelen ışık iletilir.\nÇok eğik giren ışın sınıra sınır açısından küçük açıyla çarpar ve örtüye kaçar.',
      ),
      kart(
        'Bükülme sınırı',
        'Lif çok keskin bükülürse ışının sınıra gelme açısı küçülür.\nAçı sınır açısının altına düşünce ışık dışarı kaçar ve sinyal zayıflar.\nKablolar bu yüzden en küçük bükülme yarıçapıyla döşenir.',
      ),
      kart(
        'Bakır kabloya üstünlükleri',
        '- **Kapasite:** çok daha fazla veri taşır.\n- **Kayıp:** kilometrelerce az zayıflar.\n- **Parazit:** elektromanyetik girişimden etkilenmez.\n- **Güvenlik:** dinlenmesi zordur, kıvılcım ve kısa devre yoktur.',
      ),
      kart(
        'Tek modlu ve çok modlu',
        '- **Tek modlu:** çekirdek çok ince (≈ 9 μm), ışık tek yoldan gider, uzun mesafe\n- **Çok modlu:** çekirdek kalın (≈ 50 μm), ışık birçok yoldan gider, kısa mesafe',
      ),
      kart(
        'Veri nasıl taşınır?',
        '- Verici bir lazer ya da LED’i çok hızlı yakıp söndürür: 1 ve 0.\n- Işık darbeleri lif boyunca ilerler.\n- Alıcıdaki fotodiyot ışığı yeniden elektrik sinyaline çevirir.',
      ),
      kart(
        'Kullanım alanları',
        '- **İletişim:** internet ve telefon omurgası, okyanus altı kabloları\n- **Tıp:** endoskopi, lazer ameliyatı\n- **Aydınlatma:** süs lambaları, zor erişilen yerler\n- **Algılayıcılar:** köprü ve boru hatlarında gerilme ölçümü',
      ),
      kart(
        'Endoskopi',
        'İnce bir tüpte iki lif demeti bulunur.\n- Biri ışığı vücudun içine taşır.\n- Öteki görüntüyü dışarıdaki kameraya getirir.\nDoktor kesi yapmadan mideyi ya da eklemi görür.',
      ),
      kart(
        'Sınırlamaları',
        '- Kurulumu ve ek yapılması özel ekipman ister.\n- Cam lif kırılgandır, keskin bükülmeye gelmez.\n- Çok uzun hatlarda ışık zayıflar, arada yükselteç gerekir.',
      ),
    ], [], [
      {
        soru: 'Fiber optikte ışığı içeride tutan olay hangisidir?',
        siklar: ['Kırılma', 'Tam yansıma'],
        dogru: 1,
        aciklama: {
          dogru: 'Işık çekirdek-örtü sınırına sınır açısından büyük açıyla gelir ve tamamen yansır.',
          yanlis: 'Kırılsaydı ışık örtüye kaçardı. Işığı içeride tutan tam yansıma.',
        },
        kart: 3,
      },
      {
        soru: 'Çekirdeğin kırıcılık indisi örtüye göre nasıldır?',
        siklar: ['Büyük', 'Küçük'],
        dogru: 0,
        aciklama: {
          dogru: 'Tam yansıma için ışık yüksek indisliden düşük indisliye gitmeli: çekirdek büyük.',
          yanlis: 'Çekirdek küçük olsaydı tam yansıma olmazdı. Çekirdeğin indisi örtüden büyüktür.',
        },
        kart: 3,
      },
    ]),
    konu('fzk11-prizma', 'Prizmalar', [
      kart(
        'Prizma',
        'Aralarında açı bulunan en az iki düzgün yüzü olan saydam cisimdir.\nİki yüz arasındaki açıya **tepe açısı** denir.\nIşık prizmadan geçerken iki kez kırılır.',
      ),
      kart(
        'Işığın yolu',
        '- Girerken normale yaklaşır.\n- Çıkarken normalden uzaklaşır.\n- İki kırılmanın sonunda ışın prizmanın **tabanına doğru** sapar.',
      ),
      kart(
        'Sapma açısı',
        'Gelen ışının doğrultusu ile çıkan ışın arasındaki açıdır.\nTepe açısı küçük olan ince prizmada: **δ ≈ (n − 1) · A**\nn = 1,5, A = 10° → δ ≈ 5°',
      ),
      kart(
        'En küçük sapma',
        'Işın prizmanın içinde **tabana paralel** ilerlediğinde sapma en küçüktür.\nBu durumda giriş ve çıkış açıları eşittir; yol simetriktir.',
      ),
      kart(
        'Renklere ayrılma',
        'Kırıcılık indisi renge göre biraz değişir.\n- **Mor:** en çok kırılır.\n- **Kırmızı:** en az kırılır.\nBeyaz ışık prizmada renklerine ayrılır; buna **dispersiyon** denir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Kırmızı', alt: 'en az sapar' },
            { ad: 'Sarı, yeşil' },
            { ad: 'Mavi' },
            { ad: 'Mor', alt: 'en çok sapar', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Newton’un deneyi',
        'Newton beyaz ışığı prizmayla renklerine ayırdı.\nTek bir rengi ikinci prizmaya gönderdiğinde renk bir daha ayrılmadı.\nSonuç: renkler prizmadan değil, beyaz ışığın kendisinden gelir.',
      ),
      kart(
        'Gökkuşağı',
        '- Güneş ışığı yağmur damlasına girerken kırılır.\n- Damlanın arka yüzünden yansır.\n- Çıkarken bir kez daha kırılır ve renklere ayrılır.\nGökkuşağını görmek için Güneş arkada olmalıdır.',
      ),
      kart(
        'Tam yansımalı prizma',
        'Açıları 45°-90°-45° olan cam prizmada ışın uzun yüze 45° ile çarpar.\nCamın sınır açısı yaklaşık 42° olduğu için ışık tamamen yansır.\nIşık 90° ya da 180° döndürülür.',
      ),
      kart(
        'Ayna yerine prizma',
        'Tam yansıma ışığın neredeyse tamamını geri gönderir; ayna ise bir kısmını soğurur.\n- **Dürbün:** görüntüyü düzeltir, boyu kısaltır.\n- **Periskop:** 45° prizmalarla\n- **Fotoğraf makinesi vizörü:** beşgen prizma',
      ),
      kart(
        'Birleşik prizmalar',
        'Ters çevrilmiş ikinci prizma, ilk prizmanın ayırdığı renkleri yeniden birleştirebilir.\nFarklı camlardan yapılan prizma çiftleri ışığı saptırıp renklere ayırmamak için kullanılır.',
      ),
      kart(
        'Işık yolu çizme',
        '- Her yüzeyde normali çiz.\n- Girerken ve çıkarken Snell yasasını uygula.\n- Çıkmadan önce gelme açısını sınır açısıyla karşılaştır.\nSınırı aşıyorsa ışık o yüzden çıkmaz, yansır.',
        undefined,
        { not: 'Prizma sorusunda her yüzeyde "tam yansıma olur mu?" diye sor; ışık bazen ikinci yüzden hiç çıkmaz.' },
      ),
      kart(
        'Spektroskop',
        'Prizmayla ışığı renklerine ayırıp inceleyen araçtır.\nHer element kendine özgü renk çizgileri verir.\nYıldızların neden yapıldığı bu yolla bulunur.',
      ),
    ], [], [
      {
        soru: 'Beyaz ışık prizmadan geçerken en çok hangi renk sapar?',
        siklar: ['Kırmızı', 'Mor'],
        dogru: 1,
        aciklama: {
          dogru: 'Mor ışık için kırıcılık indisi en büyük; en çok o kırılır.',
          yanlis: 'Kırmızı en az sapar. Kırıcılık indisi mor için en büyük, en çok mor sapar.',
        },
        kart: 5,
      },
      {
        soru: '45°-90°-45° cam prizma ışığı nasıl döndürür?',
        siklar: ['Tam yansımayla', 'Kırarak'],
        dogru: 0,
        aciklama: {
          dogru: 'Işık uzun yüze 45° ile gelir; camın sınır açısı 42°, ışık tamamen yansır.',
          yanlis: '45° sınır açısından (≈ 42°) büyük, ışık dışarı çıkamaz ve tamamen yansır.',
        },
        kart: 8,
      },
    ]),
    konu('fzk11-mercek', 'Mercekler', [
      kart(
        'İki tür mercek',
        '- **İnce kenarlı (yakınsak):** ortası kalın, paralel ışığı bir noktada toplar.\n- **Kalın kenarlı (ıraksak):** kenarları kalın, paralel ışığı dağıtır.\nHavadaki cam mercekler için geçerlidir.',
      ),
      kart(
        'Temel noktalar',
        '- **Optik merkez (O):** merceğin ortası\n- **Odaklar (F):** merceğin iki yanında, eşit uzaklıkta\n- **2F noktaları:** odak uzaklığının iki katında\n- **Asal eksen:** merkezden geçen yatay doğru',
      ),
      kart(
        'İnce kenarlıda özel ışınlar',
        '- **Asal eksene paralel gelen:** öteki taraftaki odaktan geçer.\n- **Odaktan geçerek gelen:** paralel çıkar.\n- **Optik merkezden geçen:** sapmadan yoluna devam eder.',
        {
          tur: 'koordinat',
          pencere: [-6, 6, -3, 3],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [-6, 0],
                [6, 0],
              ],
              kirik: true,
              kesik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [0, -2.6],
                [0, 2.6],
              ],
              kirik: true,
              ad: 'mercek',
            },
            {
              noktalar: [
                [-5, 1.5],
                [0, 1.5],
                [5, -1.5],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
            },
          ],
          noktalar: [
            { x: -2.5, y: 0, ad: 'F' },
            { x: 2.5, y: 0, ad: 'F' },
          ],
        },
      ),
      kart(
        'Kalın kenarlıda özel ışınlar',
        '- **Paralel gelen:** uzantısı geldiği taraftaki odaktan geçecek şekilde dağılır.\n- **Karşı odağa doğru gelen:** paralel çıkar.\n- **Optik merkezden geçen:** sapmadan geçer.',
      ),
      kart(
        'İnce kenarlı mercek görüntüleri',
        'Gerçek görüntü merceğin **arkasında** oluşur.',
        {
          tur: 'tablo',
          basliklar: ['Cismin yeri', 'Görüntü'],
          satirlar: [
            ['2F’nin dışında', 'F–2F arası, gerçek ters küçük'],
            ['2F’de', '2F’de, gerçek, ters, eşit'],
            ['F ile 2F arasında', '2F dışı, gerçek, ters, büyük'],
            ['F’de', 'Oluşmaz (sonsuzda)'],
            ['F ile O arasında', 'Aynı yanda, sanal, düz, büyük'],
          ],
        },
      ),
      kart(
        'Kalın kenarlı mercek görüntüsü',
        'Cisim nerede olursa olsun görüntü:\n- sanal, düz ve küçüktür;\n- cisimle aynı tarafta, F ile O arasındadır.',
      ),
      kart(
        'Mercek denklemi',
        '**1 / f = 1 / d(cisim) + 1 / d(görüntü)**\n**Büyütme:** m = −d(görüntü) / d(cisim)\n- İnce kenarlıda f +, kalın kenarlıda f −\n- Gerçek görüntü uzaklığı +, sanal −',
      ),
      kart(
        'Çözümlü örnek',
        'f = 20 cm ince kenarlı mercek, cisim 60 cm’de:\n- 1 / d(görüntü) = 1/20 − 1/60 = 2/60 → d(görüntü) = 30 cm\n- m = −30 / 60 = −1/2\nGörüntü gerçek, ters, yarı boyda ve merceğin arkasında.',
      ),
      kart(
        'Yakınsama gücü',
        '**P = 1 / f** (f metre cinsinden) — birimi diyoptridir (D).\n- +2 D: odak uzaklığı 50 cm olan ince kenarlı mercek\n- −4 D: odak uzaklığı 25 cm olan kalın kenarlı mercek',
      ),
      kart(
        'Göz ve gözlük',
        'Göz merceği ince kenarlıdır ve retinada gerçek, ters görüntü oluşturur.\n- **Miyop:** uzak bulanık, görüntü retinanın önünde → kalın kenarlı gözlük (−D)\n- **Hipermetrop:** yakın bulanık, görüntü arkada → ince kenarlı gözlük (+D)',
        undefined,
        { not: 'Miyop için eksi, hipermetrop için artı numara. Kalın kenarlı mercek ışığı dağıtıp görüntüyü geri iter.' },
      ),
      kart(
        'Ortamın etkisi',
        '- Mercek daha yoğun bir sıvıya konursa odak uzaklığı **artar**.\n- Sıvının indisi merceğinkine eşitse mercek görünmez olur, ışığı saptırmaz.\n- Sudaki hava kabarcığı ince kenarlı olsa da ışığı dağıtır.',
      ),
      kart(
        'Kullanım alanları',
        '- **Büyüteç:** cisim F içinde, sanal büyük görüntü\n- **Fotoğraf makinesi:** cisim 2F dışında, küçük gerçek görüntü\n- **Projeksiyon:** cisim F ile 2F arasında, büyük gerçek görüntü\n- **Mikroskop ve teleskop:** iki mercek art arda',
      ),
      kart(
        'Ayna ile mercek',
        '- **Çukur ayna ~ ince kenarlı mercek:** ışığı toplar\n- **Tümsek ayna ~ kalın kenarlı mercek:** ışığı dağıtır\n- **Fark:** aynada gerçek görüntü önde, mercekte arkada oluşur.',
      ),
    ], [], [
      {
        soru: 'Büyüteçle bakarken cisim nerede olmalıdır?',
        siklar: ['Odak ile mercek arasında', '2F’nin dışında'],
        dogru: 0,
        aciklama: {
          dogru: 'F ile O arasındaki cismin görüntüsü sanal, düz ve büyük olur.',
          yanlis: '2F dışındaki cismin görüntüsü küçük ve ters: fotoğraf makinesi. Büyüteç için cisim F içinde.',
        },
        kart: 5,
      },
      {
        soru: 'Miyop göz için hangi mercek kullanılır?',
        siklar: ['İnce kenarlı', 'Kalın kenarlı'],
        dogru: 1,
        aciklama: {
          dogru: 'Miyopta görüntü retinanın önüne düşer; kalın kenarlı mercek ışığı dağıtıp geri iter.',
          yanlis: 'İnce kenarlı mercek hipermetrop için. Miyopta ışığı dağıtan kalın kenarlı mercek gerekir.',
        },
        kart: 10,
      },
    ]),
  ]),
])
