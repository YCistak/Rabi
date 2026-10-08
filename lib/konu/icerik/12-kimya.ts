import { kart, konu, program, tema } from '../tip'

/**
 * 12. sınıf Kimya — **2018 programı** (MEB Ortaöğretim Kimya).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor (bkz. `docs/kurallar/konu-takibi.md`). Tema
 * adları bu yüzden 2018 programının ünite adlarından: Kimya ve Elektrik,
 * Karbon Kimyasına Giriş, Organik Bileşikler, Enerji Kaynakları ve Bilimsel
 * Gelişmeler. `maarif.test.ts` bu programı denetlemiyor (iskelette 12 yok).
 *
 * 2018'in 12. sınıf konularından haritada **zaten kartı olanlar** burada
 * tekrar yazılmadı:
 * - Lewis formülleri → `kim9-lewis` (molekül şekilleri `kim9-polarlik`)
 * - Nanoteknoloji → `kim11-nano`, `kim9-nano`
 * - Sürdürülebilirlik (yeşil kimya, atom ekonomisi, geri dönüşüm,
 *   biyobozunur plastik) → `kim9-yesil`, `kim9-cevresel`, `kim11-mikroplastik`
 * - Hidrojen enerjisinin üretimi ve depolanması → `kim11-yesil-hidrojen`
 *
 * Kapsam bilerek dar: Nernst denklemi ve derişim pilinin hesabı, yakıt pili
 * (yalnız Fen Lisesi programında), polimerlerin ayrıntısı yok; derişimin pil
 * voltajına etkisi yalnız yön olarak var.
 *
 * Konu sonu soruları ayrı dosyada (`12-kimya-sorular.ts`); hızlı kontroller
 * destelerin içinde.
 */
export const kimya12 = program('kimya', 12, 'Pilden elektrolize, karbondan yakıta', [
  tema('kim12-t1', 'Kimya ve Elektrik', [
    konu('kim12-redoks', 'İndirgenme-Yükseltgenme Tepkimeleri', [
      kart(
        'Redoks nedir?',
        'Elektron alışverişiyle yürüyen tepkimedir; iki yarı olay hep birlikte olur.\n- **Yükseltgenme:** elektron verme, yükseltgenme basamağı artar\n- **İndirgenme:** elektron alma, yükseltgenme basamağı azalır',
      ),
      kart(
        'Yükseltgenme basamağı kuralları',
        '- **Element:** serbest hâlde 0 (Na, O₂, Fe)\n- **Tek atomlu iyon:** yüküne eşit (Cl⁻ → −1)\n- **Bileşik:** basamakların toplamı 0\n- **Çok atomlu iyon:** toplam, iyonun yüküne eşit',
      ),
      kart(
        'Sabit sayılabilecek basamaklar',
        '- **F:** her bileşikte −1\n- **O:** genelde −2; peroksitte (H₂O₂) −1, OF₂’de +2\n- **H:** ametalle +1, metal hidrürde (NaH) −1\n- **1A ve 2A metalleri:** +1 ve +2',
      ),
      kart(
        'Basamak hesabı',
        'Bilinmeyeni x al, toplamı yüke eşitle:\n- H₂SO₄: 2(+1) + x + 4(−2) = 0 → S = +6\n- MnO₄⁻: x + 4(−2) = −1 → Mn = +7\n- NH₄⁺: x + 4(+1) = +1 → N = −3',
      ),
      kart(
        'Yükseltgen ve indirgen',
        '- **Yükseltgen madde:** karşısındakini yükseltger, kendisi indirgenir (elektron alır).\n- **İndirgen madde:** karşısındakini indirger, kendisi yükseltgenir (elektron verir).',
        undefined,
        { not: 'Ad, maddenin karşısındakine yaptığını söyler; kendisine olan bunun tersidir.' },
      ),
      kart(
        'Örnek tepkime',
        '2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu\n- **Al:** 0 → +3, yükseltgenir; indirgen maddedir.\n- **Cu²⁺:** +2 → 0, indirgenir; yükseltgen maddedir.',
      ),
      kart(
        'Elektron sayısını denkleştir',
        'Verilen elektron sayısı alınan elektron sayısına eşit olmalıdır.\nAl 3 e⁻ verir, Cu²⁺ 2 e⁻ alır; ortak kat 6’dır.\nBu yüzden 2 Al ve 3 Cu²⁺ yazılır, toplam 6 e⁻ aktarılır.',
      ),
      kart(
        'Yük de denk olmalı',
        'Denkleştirilmiş redokste atomlar ve toplam yük iki tarafta eşittir.\nMnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O\nSol: −1 + 10 + 8 = +17; sağ: +2 + 15 = +17',
      ),
      kart(
        'Redoks olmayan tepkimeler',
        'Hiçbir atomun basamağı değişmiyorsa tepkime redoks değildir:\n- HCl + NaOH → NaCl + H₂O (nötrleşme)\n- AgNO₃ + NaCl → AgCl + NaNO₃ (çökelme)\nSerbest element bileşiğe giriyor ya da bileşikten çıkıyorsa redokstur.',
      ),
      kart(
        'Redokstan elektriğe',
        'Zn çubuk CuSO₄ çözeltisine daldırılırsa elektronlar doğrudan Cu²⁺’ya geçer, enerji ısı olur.\nİki yarı tepkime ayrı kaplarda tutulup telle bağlanırsa elektronlar telden akar.\nBu akış elektrik akımıdır.',
      ),
    ], [], [
      {
        soru: 'H₂O₂’de oksijenin yükseltgenme basamağı kaçtır?',
        siklar: ['−2', '−1'],
        dogru: 1,
        aciklama: {
          dogru: 'Peroksitte O–O bağı vardır; 2(+1) + 2x = 0 → x = −1.',
          yanlis: 'Oksijen genelde −2’dir ama peroksit istisnadır: 2(+1) + 2x = 0 → x = −1.',
        },
        kart: 3,
      },
    ]),
    konu('kim12-hucre', 'Elektrotlar ve Elektrokimyasal Hücreler', [
      kart(
        'Elektrot ve yarı hücre',
        '- **Elektrot:** elektriği ileten katı uç; metal çubuk ya da grafit\n- **Elektrolit:** iyonları taşıyan çözelti ya da eriyik\n- **Yarı hücre:** metal ve kendi iyonlarının çözeltisi (Zn | Zn²⁺)',
      ),
      kart(
        'Anot ve katot',
        'Elektrodun adı, üzerinde olan olaydan gelir:\n- **Anot:** yükseltgenme olur.\n- **Katot:** indirgenme olur.\nBu tanım pilde de elektrolizde de aynıdır.',
      ),
      kart(
        'İki hücre türü',
        'Galvanik hücre istemli redokstan elektrik üretir.\nElektrolitik hücre, dışarıdan verilen elektrikle istemsiz bir redoksu yürütür.',
        {
          tur: 'tablo',
          basliklar: ['', 'Galvanik (pil)', 'Elektrolitik'],
          satirlar: [
            ['Olay', 'İstemli', 'İstemsiz'],
            ['Enerji', 'Kimyasal → elektrik', 'Elektrik → kimyasal'],
            ['Anot', '(−) kutup', '(+) kutup'],
            ['Katot', '(+) kutup', '(−) kutup'],
          ],
        },
      ),
      kart(
        'Daniell hücresi',
        'Zn çubuk ZnSO₄, Cu çubuk CuSO₄ çözeltisinde; kaplar tel ve tuz köprüsüyle bağlı.\n- **Anot (Zn):** Zn → Zn²⁺ + 2e⁻\n- **Katot (Cu):** Cu²⁺ + 2e⁻ → Cu',
      ),
      kart(
        'Elektron ve iyon akışı',
        '- **Elektronlar:** dış devrede, telden anottan katoda akar.\n- **İyonlar:** çözeltide ve tuz köprüsünde hareket eder.\nElektronlar çözeltiye girmez; devreyi iyonlar tamamlar.',
      ),
      kart(
        'Tuz köprüsü',
        'KNO₃ ya da KCl gibi tepkimeye girmeyen bir tuzun çözeltisidir.\n- **Anyonlar:** anot kabına gider.\n- **Katyonlar:** katot kabına gider.\nYük dengesini korur; köprü kaldırılırsa akım durur.',
      ),
      kart(
        'Kaplarda ne değişir?',
        '- **Anot kabı:** çubuk incelir, Zn²⁺ derişimi artar.\n- **Katot kabı:** çubukta Cu birikir, Cu²⁺ derişimi azalır.\nCuSO₄ çözeltisinin mavi rengi zamanla açılır.',
        undefined,
        { not: 'Anot kabında katyon çoğalır, bu yüzden köprüden oraya anyon gelir; katot kabında tersi.' },
      ),
      kart(
        'Hücre şeması',
        'Anot sola, katot sağa yazılır:\nZn(k) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(k)\n- **Tek çizgi:** faz sınırı\n- **Çift çizgi:** tuz köprüsü',
      ),
      kart(
        'İnert elektrot',
        'Yarı tepkimede katı metal yoksa (H⁺/H₂, Fe³⁺/Fe²⁺) elektronu taşıyacak bir uç gerekir.\nPlatin ya da grafit tepkimeye girmeden bu işi görür.',
      ),
    ], [], [
      {
        soru: 'Daniell hücresinde dış devrede elektronlar nereye akar?',
        siklar: ['Zn’den Cu’ya', 'Cu’dan Zn’ye'],
        dogru: 0,
        aciklama: {
          dogru: 'Zn anottur, elektron verir; elektronlar telden katot olan Cu’ya gider.',
          yanlis: 'Elektronlar yükseltgenmenin olduğu anottan (Zn) indirgenmenin olduğu katoda (Cu) akar.',
        },
        kart: 5,
      },
    ]),
    konu('kim12-potansiyel', 'Standart Elektrot Potansiyelleri', [
      kart(
        'Potansiyel neyi ölçer?',
        'Elektrot potansiyeli, yarı hücrenin elektron alma ya da verme eğilimidir.\nTek başına ölçülemez; başka bir yarı hücreye karşı ölçülür.',
      ),
      kart(
        'Standart hidrojen elektrodu',
        '2H⁺(aq) + 2e⁻ → H₂(g)   E° = 0,00 V\nPt elektrot, 1 M H⁺, 1 atm H₂, 25 °C\nBütün değerler bu elektroda göre verilir.',
      ),
      kart(
        'Standart koşullar',
        '- **Derişim:** 1 M\n- **Gaz basıncı:** 1 atm\n- **Sıcaklık:** 25 °C\nBu koşullarda ölçülen potansiyel E° ile gösterilir.',
      ),
      kart(
        'İndirgenme potansiyelleri',
        'Tablolar yarı tepkimeyi indirgenme yönünde yazar: Mⁿ⁺ + ne⁻ → M\nDeğer büyüdükçe iyonun elektron alma eğilimi artar.',
        {
          tur: 'tablo',
          basliklar: ['Yarı tepkime', 'E° (V)'],
          satirlar: [
            ['Li⁺ / Li', '−3,04'],
            ['Mg²⁺ / Mg', '−2,37'],
            ['Al³⁺ / Al', '−1,66'],
            ['Zn²⁺ / Zn', '−0,76'],
            ['Fe²⁺ / Fe', '−0,44'],
            ['2H⁺ / H₂', '0,00'],
            ['Cu²⁺ / Cu', '+0,34'],
            ['Ag⁺ / Ag', '+0,80'],
          ],
        },
      ),
      kart(
        'Yükseltgenme potansiyeli',
        'Yarı tepkime ters çevrilince işaret değişir:\nZn²⁺ + 2e⁻ → Zn   E° = −0,76 V\nZn → Zn²⁺ + 2e⁻   E° = +0,76 V',
      ),
      kart(
        'Kim kimi yükseltger?',
        '- **E° büyük:** iyonu kolay indirgenir; güçlü yükseltgendir (Ag⁺, Cu²⁺).\n- **E° küçük:** metali kolay yükseltgenir; güçlü indirgendir (Li, Mg, Zn).',
      ),
      kart(
        'Katsayı E°’yi değiştirmez',
        'Yarı tepkime 2 ile çarpılsa da E° aynı kalır.\nAg⁺ + e⁻ → Ag ve 2Ag⁺ + 2e⁻ → 2Ag için E° = +0,80 V\nPotansiyel, madde miktarına bağlı değildir.',
        undefined,
        { not: 'ΔH katsayıyla çarpılır, E° çarpılmaz; iki kuralı karıştırma.' },
      ),
      kart(
        'İstemlilik',
        'E°hücre = E°katot − E°anot (ikisi de indirgenme potansiyeli)\n- **E° > 0:** tepkime istemlidir.\n- **E° < 0:** istemsizdir; ters yönü istemlidir.',
      ),
      kart(
        'Metal ve metal iyonu',
        'Zn + Cu²⁺ → Zn²⁺ + Cu: E° = 0,34 − (−0,76) = +1,10 V, istemli\nCu + Zn²⁺ → Cu²⁺ + Zn: E° = −1,10 V, istemsiz\nAktif metal, daha az aktif metalin iyonunu indirger.',
      ),
      kart(
        'Metal ve asit',
        'E°’si 0’dan küçük metal, H⁺’yı indirger ve HCl’den H₂ çıkarır.\n- **Zn, Fe, Mg:** HCl ile H₂ verir.\n- **Cu, Ag, Au:** HCl ile H₂ vermez.',
      ),
    ], [], [
      {
        soru: 'Hangisi daha güçlü indirgendir?',
        siklar: ['Cu (E° = +0,34 V)', 'Mg (E° = −2,37 V)'],
        dogru: 1,
        aciklama: {
          dogru: 'İndirgenme potansiyeli küçük olan metal kolay elektron verir; Mg güçlü indirgendir.',
          yanlis: 'Büyük E° iyonun kolay indirgendiğini söyler. Elektronu kolay veren, E°’si küçük olan Mg’dir.',
        },
        kart: 6,
      },
    ]),
    konu('kim12-pil', 'Galvanik Piller', [
      kart(
        'Pil voltajı',
        'E°pil = E°katot − E°anot\nDaniell pili: 0,34 − (−0,76) = **1,10 V**\nİki yarı hücrenin potansiyel farkı büyüdükçe pil voltajı artar.',
      ),
      kart(
        'Anodu ve katodu bul',
        'İndirgenme potansiyeli küçük olan metal anottur, yükseltgenir.\nBüyük olanın iyonu katotta indirgenir.\nZn–Ag pilinde Zn anottur: E° = 0,80 − (−0,76) = 1,56 V',
      ),
      kart(
        'Voltaj neye bağlı?',
        '- **Bağlı:** elektrot türü, iyon derişimi, sıcaklık\n- **Bağlı değil:** elektrot boyutu, çözelti hacmi, tuz köprüsünün boyu',
        undefined,
        { not: 'Çubuğu büyütmek pili uzun ömürlü yapar ama voltajını değiştirmez.' },
      ),
      kart(
        'Derişimin etkisi',
        'Pil tepkimesi denge gibi davranır (Zn + Cu²⁺ → Zn²⁺ + Cu):\n- **Katot iyonu (Cu²⁺) artarsa:** tepkime ürüne kayar, voltaj artar.\n- **Anot iyonu (Zn²⁺) artarsa:** voltaj azalır.',
      ),
      kart(
        'Pil neden biter?',
        'Tepkime ilerledikçe katot iyonu azalır, anot iyonu artar ve voltaj düşer.\nSistem dengeye ulaşınca voltaj 0 olur; pil bitmiştir.',
      ),
      kart(
        'Pil ömrü',
        'Ömür, harcanabilecek madde miktarına bağlıdır:\n- Anot metalinin kütlesi\n- Katot çözeltisindeki iyonun mol sayısı\nVoltaj aynı olsa da büyük pil daha uzun süre akım verir.',
      ),
      kart(
        'Gündelik piller',
        'Kuru pilde elektrolit NH₄Cl macunu, alkalin pilde KOH’tır.\nAlkalin pil aynı voltajda daha uzun ömürlüdür.',
        {
          tur: 'tablo',
          basliklar: ['Pil', 'Anot / Katot', 'Voltaj'],
          satirlar: [
            ['Çinko-karbon (kuru)', 'Zn / MnO₂', '1,5 V'],
            ['Alkalin', 'Zn / MnO₂', '1,5 V'],
            ['Kurşun akü', 'Pb / PbO₂', '2 V (hücre)'],
            ['Lityum iyon', 'Grafit / LiCoO₂', '~3,7 V'],
          ],
        },
      ),
      kart(
        'Kurşun akü',
        'Arabalarda kullanılır; altı hücre seri bağlanıp 12 V verir.\n- **Boşalma:** Pb ve PbO₂, H₂SO₄ ile PbSO₄’e dönüşür.\n- **Şarj:** dışarıdan verilen akım tepkimeyi geri çevirir.\nŞarj edilebildiği için ikincil pildir.',
      ),
      kart(
        'Lityum iyon pili',
        'Li⁺ iyonları iki elektrot arasında gidip gelir:\n- **Şarjda:** Li⁺ grafit elektrota yerleşir.\n- **Boşalmada:** Li⁺ metal oksit (LiCoO₂) elektrota döner.\nTelefon, dizüstü bilgisayar ve elektrikli araçlarda kullanılır.',
      ),
      kart(
        'Neden lityum?',
        '- **En hafif metal:** kütle başına çok enerji depolar.\n- **En küçük E° (−3,04 V):** yüksek hücre voltajı verir.\n- **Şarj edilebilir:** yüzlerce kez dolup boşalır.',
      ),
    ], [], [
      {
        soru: 'Zn–Cu pilinde Cu²⁺ derişimi artırılırsa voltaj ne olur?',
        siklar: ['Artar', 'Azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Cu²⁺ tepkendir; derişimi artınca tepkime ürüne kayar ve voltaj yükselir.',
          yanlis: 'Azaltan anot iyonu Zn²⁺’nın artmasıdır. Tepken olan Cu²⁺ artınca voltaj yükselir.',
        },
        kart: 4,
      },
    ]),
    konu('kim12-elektroliz', 'Elektroliz', [
      kart(
        'Elektroliz nedir?',
        'İstemsiz bir redoks tepkimesini dışarıdan verilen elektrikle yürütmektir.\n- **Anot (+):** anyonlar gelir, yükseltgenme olur.\n- **Katot (−):** katyonlar gelir, indirgenme olur.',
      ),
      kart(
        'Eriyik NaCl',
        'Ortamda yalnız Na⁺ ve Cl⁻ vardır:\n- **Katot:** Na⁺ + e⁻ → Na\n- **Anot:** 2Cl⁻ → Cl₂ + 2e⁻\nSodyum metali sanayide böyle üretilir.',
      ),
      kart(
        'Sulu çözeltide katot',
        'Katotta metal iyonu ile su yarışır:\n- **Cu²⁺, Ag⁺:** metal olarak birikir.\n- **Na⁺, K⁺, Mg²⁺, Al³⁺:** yerine su indirgenir, H₂ çıkar.\n2H₂O + 2e⁻ → H₂ + 2OH⁻',
      ),
      kart(
        'Sulu çözeltide anot',
        'İnert elektrotta:\n- **Cl⁻, Br⁻, I⁻:** halojen olarak açığa çıkar (derişik çözeltide).\n- **SO₄²⁻, NO₃⁻, F⁻:** yerine su yükseltgenir, O₂ çıkar.\n2H₂O → O₂ + 4H⁺ + 4e⁻',
      ),
      kart(
        'Suyun elektrolizi',
        'Saf su akımı iyi iletmez; az miktar H₂SO₄ ya da Na₂SO₄ eklenir.\n- **Katot:** H₂ gazı\n- **Anot:** O₂ gazı\nAynı koşulda H₂ hacmi O₂ hacminin iki katıdır.',
      ),
      kart(
        'Sulu NaCl: klor-alkali',
        'Katotta H₂, anotta Cl₂ çıkar; çözeltide Na⁺ ve OH⁻ kalır.\nToplam: 2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂\nTek işlemde üç ürün elde edilir.',
      ),
      kart(
        'Elektrik yükü ve mol',
        '**Q = I · t** (amper × saniye = coulomb)\n1 mol elektronun yükü 96 500 C’dir; buna 1 faraday denir.\nmol e⁻ = Q / 96 500',
      ),
      kart(
        'Biriken kütle',
        '9,65 A akım 1000 s geçerse Q = 9650 C, yani 0,1 mol e⁻\n- **Ag⁺ + e⁻ → Ag:** 0,1 mol Ag = 10,8 g\n- **Cu²⁺ + 2e⁻ → Cu:** 0,05 mol Cu = 3,2 g',
      ),
      kart(
        'Seri bağlı kaplar',
        'Seri bağlı kaplardan aynı yük, yani aynı mol elektron geçer.\n0,6 mol e⁻ geçerse 0,6 mol Ag, 0,3 mol Cu, 0,2 mol Al birikir.\nİyonun yükü büyüdükçe biriken mol azalır.',
        undefined,
        { not: 'Önce geçen mol elektronu bul; her kapta onu iyonun yüküne böl.' },
      ),
      kart(
        'Kaplama ve arıtma',
        '- **Kaplama:** eşya katot, kaplama metali anot; gümüş kaplamada AgNO₃\n- **Bakır arıtma:** ham bakır anot, saf bakır katot; CuSO₄ çözeltisi\nAnodun altına Ag ve Au gibi değerli metaller çöker.',
      ),
      kart(
        'Alüminyum üretimi',
        'Sulu çözeltide katotta su indirgendiği için Al bu yolla elde edilemez.\nAl₂O₃ eritilmiş kriyolitte (Na₃AlF₆) çözülüp elektroliz edilir.\n- **Katot:** Al³⁺ + 3e⁻ → Al\n- **Anot:** karbon; oluşan O₂ ile yanıp aşınır.',
      ),
    ], [], [
      {
        soru: 'Sulu KNO₃ çözeltisinin elektrolizinde katotta ne oluşur?',
        siklar: ['K metali', 'H₂ gazı'],
        dogru: 1,
        aciklama: {
          dogru: 'K⁺ sudan çok daha zor indirgenir; katotta su indirgenir ve H₂ çıkar.',
          yanlis: 'K⁺ sulu ortamda indirgenmez; onun yerine su indirgenir ve H₂ oluşur.',
        },
        kart: 3,
      },
      {
        soru: 'Cu²⁺ çözeltisinden 0,2 mol e⁻ geçerse kaç mol Cu birikir?',
        siklar: ['0,1', '0,2'],
        dogru: 0,
        aciklama: {
          dogru: 'Her Cu²⁺ iki elektron alır: 0,2 / 2 = 0,1 mol Cu.',
          yanlis: 'Bir Cu için iki elektron gerekir; 0,2 mol e⁻ yalnız 0,1 mol Cu biriktirir.',
        },
        kart: 8,
      },
    ]),
    konu('kim12-korozyon', 'Korozyon ve Korunma', [
      kart(
        'Korozyon',
        'Metalin çevresindeki O₂, su ve iyonlarla redoks tepkimesine girip aşınmasıdır.\nMetal yükseltgenir ve yapı zayıflar.\nEn bilinen örnek demirin paslanmasıdır.',
      ),
      kart(
        'Demir nasıl paslanır?',
        'Yüzeyde küçük bir pil kurulur:\n- **Anot bölge:** Fe → Fe²⁺ + 2e⁻\n- **Katot bölge:** O₂ + 2H₂O + 4e⁻ → 4OH⁻\nFe²⁺ daha da yükseltgenir; pas Fe₂O₃ · xH₂O’dur.',
      ),
      kart(
        'Paslanmanın şartları',
        '- **Gerekli:** su ve oksijen birlikte\n- **Hızlandıran:** tuz (iyonlar), asidik ortam, sıcaklık\nKuru havada ya da oksijensiz suda demir pek paslanmaz.',
      ),
      kart(
        'Yüzeyi kapatmak',
        'Metal su ve havadan yalıtılır:\n- Boya, vernik, yağ ya da plastik kaplama\n- Başka bir metalle kaplama\nBoya çizilirse açılan noktada paslanma başlar.',
      ),
      kart(
        'Galvaniz ve kalay',
        '- **Galvanizli (Zn kaplı) demir:** çizilse de önce Zn yükseltgenir, demir korunur.\n- **Kalaylı (Sn kaplı) demir:** çizilirse daha aktif olan demir aşınır, pas hızlanır.',
        undefined,
        { not: 'Kaplama metali demirden aktifse çizikte de korur; değilse çizik pası hızlandırır.' },
      ),
      kart(
        'Kurban anot',
        'Demire, ondan daha aktif bir metal (Mg ya da Zn) bağlanır.\nAktif metal anot olup aşınır; demir katot olarak korunur.\nÖrnek: gemi gövdesi, boru hattı, termosifondaki Mg çubuk',
      ),
      kart(
        'Dış akımla koruma',
        'Korunacak metal bir güç kaynağının (−) kutbuna bağlanır.\nMetal katot olur ve yükseltgenmez.\nAşınan yardımcı anot belirli aralıklarla değiştirilir.',
      ),
      kart(
        'Kendini koruyan metaller',
        'Alüminyum yüzeyinde ince ve sıkı bir Al₂O₃ tabakası oluşur, alttaki metali korur.\nPaslanmaz çelikte aynı işi krom (Cr) görür.\nDemir pası ise gevrektir, dökülür ve yeni yüzey açar.',
      ),
    ], [], [
      {
        soru: 'Demir hangi ortamda daha hızlı paslanır?',
        siklar: ['Kuru hava', 'Tuzlu, nemli hava'],
        dogru: 1,
        aciklama: {
          dogru: 'Su ve oksijen birlikte gerekir; tuzdaki iyonlar akımı taşıyıp paslanmayı hızlandırır.',
          yanlis: 'Kuru havada su yoktur, pas pek oluşmaz. Tuzlu nem paslanmayı hızlandırır.',
        },
        kart: 3,
      },
    ]),
  ]),
  tema('kim12-t2', 'Karbon Kimyasına Giriş', [
    konu('kim12-organik', 'Anorganik ve Organik Bileşikler', [
      kart(
        'Organik bileşik',
        'Karbonun H ile, çoğu zaman O, N, S, P ve halojenlerle birlikte kurduğu bileşiklerdir.\nCanlıların yapısındaki karbonhidrat, yağ ve protein organiktir.',
      ),
      kart(
        'Karbonlu ama anorganik',
        '- CO ve CO₂\n- Karbonatlar: CaCO₃, Na₂CO₃\n- Siyanürler: HCN, KCN\n- Karbürler: CaC₂, SiC\nBunlar özellikleriyle anorganik bileşiklere benzer.',
        undefined,
        { not: 'Formülde C görmek yetmez; CO₂ ve CaCO₃ anorganik sayılır.' },
      ),
      kart(
        'Yaşam gücü teorisi',
        'Organik maddelerin yalnız canlılarda, bir "yaşam gücü" ile oluşabildiği sanılıyordu.\n1828’de Wöhler, anorganik amonyum siyanattan üre sentezledi.\nOrganik maddenin laboratuvarda da üretilebildiği görüldü.',
      ),
      kart(
        'Karbonu özel yapan',
        '- **Dört bağ:** her C dört kovalent bağ kurar.\n- **Zincir:** C atomları birbirine bağlanıp uzun zincir ve halka yapar.\n- **Çoklu bağ:** C=C ve C≡C kurabilir.\nBu yüzden milyonlarca organik bileşik vardır.',
      ),
      kart(
        'İki grubun farkı',
        'Bunlar genellemedir: şeker ve etanol organik olduğu hâlde suda iyi çözünür.',
        {
          tur: 'tablo',
          basliklar: ['Özellik', 'Organik', 'Anorganik'],
          satirlar: [
            ['Bağ', 'Çoğunlukla kovalent', 'Çoğu iyonik'],
            ['Erime noktası', 'Genelde düşük', 'Genelde yüksek'],
            ['Yanma', 'Çoğu yanar', 'Çoğu yanmaz'],
            ['Suda çözünme', 'Çoğu az', 'Çoğu iyi'],
            ['Tepkime hızı', 'Yavaş', 'Hızlı (iyonlar)'],
          ],
        },
      ),
      kart(
        'İzomeri',
        'Molekül formülü aynı, yapısı farklı bileşiklere izomer denir.\nC₂H₆O: etanol (CH₃CH₂OH) ve dimetil eter (CH₃OCH₃)\nFormül aynı olsa da özellikleri farklıdır.',
      ),
      kart(
        'Organik bileşiğin analizi',
        'Örnek oksijenle yakılır:\n- **C:** CO₂’ye dönüşür; CO₂ kütlesinden C bulunur.\n- **H:** H₂O’ya dönüşür; su kütlesinden H bulunur.\nC, H, O’lu bileşikte kalan kütle oksijendir.',
      ),
      kart(
        'Formül yazılışları',
        '- **Açık formül:** bütün bağlar çizilir.\n- **Yarı açık formül:** CH₃–CH₂–OH\n- **Kapalı formül:** C₂H₆O\nYarı açık formül hem kısadır hem yapıyı gösterir.',
      ),
    ], [], [
      {
        soru: 'Hangisi organik bileşiktir?',
        siklar: ['CaCO₃', 'CH₃OH'],
        dogru: 1,
        aciklama: {
          dogru: 'Metanol C–H bağları olan bir alkoldür; organiktir.',
          yanlis: 'Karbonatlar karbon içerse de anorganik sayılır. Organik olan CH₃OH’dir.',
        },
        kart: 2,
      },
    ]),
    konu('kim12-formul', 'Basit ve Molekül Formülü', [
      kart(
        'Basit formül',
        'Bileşikteki atomların **en küçük tam sayılı oranını** gösterir.\n- C₆H₁₂O₆ → CH₂O\n- C₂H₄ → CH₂\n- H₂O₂ → HO',
      ),
      kart(
        'Molekül formülü',
        'Bir moleküldeki gerçek atom sayılarını verir.\n**Molekül formülü = (basit formül)ₙ**\nn = mol kütlesi / basit formülün kütlesi',
      ),
      kart(
        'Aynı basit formül',
        'C₂H₂ (asetilen) ve C₆H₆ (benzen) ikisinin de basit formülü CH’dir.\nBasit formül bileşiği tanımaya yetmez; mol kütlesi de gerekir.',
        undefined,
        { not: 'Basit formülden molekül formülüne geçmek için mol kütlesi şart; o yoksa n bulunamaz.' },
      ),
      kart(
        'Kütle yüzdesinden',
        '%40 C, %6,7 H, %53,3 O içeren bileşik:\n- C: 40 / 12 ≈ 3,33\n- H: 6,7 / 1 = 6,7\n- O: 53,3 / 16 ≈ 3,33\nEn küçüğe bölünce 1 : 2 : 1 → **CH₂O**',
      ),
      kart(
        'Mol kütlesiyle bitir',
        'CH₂O’nun kütlesi 12 + 2 + 16 = 30’dur.\nMol kütlesi 180 ise n = 180 / 30 = 6\nMolekül formülü C₆H₁₂O₆ (glikoz)',
      ),
      kart(
        'Yakma ile analiz',
        '0,1 mol hidrokarbon yakılınca 0,3 mol CO₂ ve 0,4 mol H₂O oluşuyor:\n- C sayısı = 0,3 / 0,1 = 3\n- H sayısı = 2 · 0,4 / 0,1 = 8\nBileşik C₃H₈ (propan)',
      ),
      kart(
        'Oksijenli bileşik',
        '4,6 g bileşik yanınca 8,8 g CO₂ ve 5,4 g H₂O veriyor:\n- C: 0,2 mol (2,4 g), H: 0,6 mol (0,6 g)\n- O: 4,6 − 3,0 = 1,6 g → 0,1 mol\nOran 2 : 6 : 1 → **C₂H₆O**',
      ),
      kart(
        'Gaz yoğunluğundan',
        'NŞA’da 1 mol gaz 22,4 L hacim kaplar.\nYoğunluğu 1,25 g/L olan gazın mol kütlesi 1,25 · 22,4 = 28\nBasit formülü CH₂ (14) ise n = 2 → C₂H₄',
      ),
      kart(
        'Sık yapılan hatalar',
        '- H₂O’daki H sayısını 2 ile çarpmayı unutmak\n- Oranı en küçüğe bölmeden yuvarlamak\n- 1,5 ya da 1,33 çıkan oranı 2 ya da 3 ile genişletmemek',
      ),
    ], [], [
      {
        soru: 'C₆H₆’nın basit formülü hangisidir?',
        siklar: ['CH', 'C₂H₂'],
        dogru: 0,
        aciklama: {
          dogru: '6 : 6 oranı en küçük tam sayılarla 1 : 1’dir; basit formül CH.',
          yanlis: 'C₂H₂ de 1 : 1 oranındadır ama en küçük tam sayılar değildir. Basit formül CH.',
        },
        kart: 3,
      },
    ]),
    konu('kim12-allotrop', 'Doğada Karbon', [
      kart(
        'Allotrop',
        'Aynı elementin atomlarının farklı dizilmesiyle oluşan hâllerdir.\nKarbonun allotropları: elmas, grafit, grafen, fulleren, karbon nanotüp\nOksijende de O₂ ve O₃ allotroptur.',
      ),
      kart(
        'Elmas',
        'Her C atomu dört C’ye tek bağla bağlıdır; üç boyutlu bir ağ örgü oluşur.\n- Bilinen en sert doğal maddedir.\n- Elektriği iletmez, ısıyı çok iyi iletir.\n- Kesici ve delici uçlarda kullanılır.',
      ),
      kart(
        'Grafit',
        'Her C üç C’ye bağlıdır; altıgenlerden oluşan düz katmanlar vardır.\n- Katmanlar zayıf kuvvetlerle tutunur ve kayar: yumuşak, kaygan.\n- Serbest elektronları vardır: elektriği iletir.\nKurşun kalem ucu, elektrot ve kayganlaştırıcıdır.',
      ),
      kart(
        'Elmas mı grafit mi?',
        'Bütün farklar atomların dizilişinden gelir; ikisi de yalnız karbondur.\nYanınca ikisi de CO₂ verir.',
        {
          tur: 'tablo',
          basliklar: ['', 'Elmas', 'Grafit'],
          satirlar: [
            ['Bağlı C sayısı', '4', '3'],
            ['Hibrit', 'sp³', 'sp²'],
            ['Sertlik', 'Çok sert', 'Yumuşak'],
            ['Elektrik', 'İletmez', 'İletir'],
            ['Yoğunluk', '3,5 g/cm³', '2,2 g/cm³'],
          ],
        },
        { not: 'Grafit elektriği iletir ama metal değildir; iletkenlik katmanlardaki serbest elektronlardan.' },
      ),
      kart(
        'Grafen',
        'Grafitin tek bir katmanıdır: bir atom kalınlığında altıgen ağ.\n- Çok sağlam ve esnektir.\n- Elektriği ve ısıyı çok iyi iletir.\n2004’te ayrı olarak elde edildi; 2010 Nobel Fizik Ödülü bu çalışmaya verildi.',
      ),
      kart(
        'Fulleren',
        'C₆₀ molekülü, beşgen ve altıgenlerden kurulu futbol topu biçiminde bir kafestir.\n1985’te keşfedildi.\nKafesin içine atom ya da ilaç yerleştirme üzerine çalışılıyor.',
      ),
      kart(
        'Karbon nanotüp',
        'Grafen tabakasının silindir gibi kıvrılmasıyla oluşan, nanometre çaplı tüptür.\n- Çelikten çok daha sağlam ve çok hafiftir.\n- Elektriği iletebilir.\nSpor malzemesi, kompozit ve elektronikte kullanılır.',
      ),
      kart(
        'En kararlı hâl',
        'Standart koşulda karbonun en kararlı allotropu grafittir; ΔH°f = 0.\nElmasın grafite dönüşmesi istemlidir ama son derece yavaştır.\nYapay elmas, grafitten çok yüksek basınç ve sıcaklıkta üretilir.',
      ),
    ], [], [
      {
        soru: 'Hangisi elektriği iletir?',
        siklar: ['Elmas', 'Grafit'],
        dogru: 1,
        aciklama: {
          dogru: 'Grafitte her C üç bağ kurar; kalan elektron katman boyunca serbestçe hareket eder.',
          yanlis: 'Elmasta dört elektron da bağdadır, serbest elektron yoktur. İleten grafittir.',
        },
        kart: 3,
      },
    ]),
    konu('kim12-hibrit', 'Hibritleşme ve Molekül Geometrisi', [
      kart(
        'Karbonun bilmecesi',
        'C: 1s² 2s² 2p²; yalnız iki yarı dolu orbitali vardır.\nOysa CH₄’te C dört eş bağ yapar.\nAçıklama: bir 2s elektronu 2p’ye uyarılır ve orbitaller karışır.',
      ),
      kart(
        'Hibritleşme',
        'Aynı atomun farklı enerjili orbitallerinin karışıp eş enerjili yeni orbitaller oluşturmasıdır.\nKaç orbital karışırsa o kadar hibrit orbital oluşur.',
      ),
      kart(
        'sp³',
        '1 s + 3 p → 4 sp³ orbitali\nOrbitaller düzgün dörtyüzlünün köşelerine yönelir; açı **109,5°**\nÖrnek: CH₄, C₂H₆ ve elmastaki C',
      ),
      kart(
        'sp²',
        '1 s + 2 p → 3 sp² orbitali; düzlem üçgen, açı **120°**\nHibritleşmeyen bir p orbitali kalır ve π bağı kurar.\nÖrnek: C₂H₄, BF₃ ve grafitteki C',
      ),
      kart(
        'sp',
        '1 s + 1 p → 2 sp orbitali; doğrusal, açı **180°**\nHibritleşmeyen iki p orbitali kalır ve iki π bağı kurar.\nÖrnek: C₂H₂, CO₂’deki C, BeH₂',
      ),
      kart(
        'σ ve π bağı',
        '- **σ (sigma):** orbitaller uç uca örtüşür; iki atom arasında yalnız bir tane olur.\n- **π (pi):** p orbitalleri yan yana örtüşür; σ’dan zayıftır.\nTek bağ 1σ, çift bağ 1σ + 1π, üçlü bağ 1σ + 2π',
      ),
      kart(
        'Bağ sayma',
        'Her bağ çizgisinde bir σ vardır; çift ve üçlü bağdaki fazla çizgiler π’dir.',
        {
          tur: 'tablo',
          basliklar: ['Molekül', 'σ', 'π'],
          satirlar: [
            ['C₂H₆', '7', '0'],
            ['C₂H₄', '5', '1'],
            ['C₂H₂', '3', '2'],
            ['HCN', '2', '2'],
            ['C₆H₆', '12', '3'],
          ],
        },
      ),
      kart(
        'Hibriti hızlı bul',
        'Merkez atomdaki σ bağı ile ortaklanmamış elektron çifti sayısını topla:\n- **4:** sp³\n- **3:** sp²\n- **2:** sp\nπ bağları bu sayıma girmez.',
        undefined,
        { not: 'Çift ve üçlü bağı tek σ say; hibriti π bağları değil, σ bağları ve çiftler belirler.' },
      ),
      kart(
        'Ortaklanmamış çift şekli büker',
        'NH₃ ve H₂O’da merkez atom sp³’tür ama şekil dörtyüzlü değildir:\n- **NH₃:** 1 çift; üçgen piramit, ~107°\n- **H₂O:** 2 çift; açısal (kırık), ~104,5°\nÇiftler bağları daha çok iter, açı daralır.',
      ),
      kart(
        'Bağ uzunluğu ve sağlamlığı',
        '- **C–C:** 154 pm, 348 kJ/mol\n- **C=C:** 134 pm, 614 kJ/mol\n- **C≡C:** 120 pm, 839 kJ/mol\nBağ sayısı arttıkça bağ kısalır ve güçlenir.',
      ),
    ], [], [
      {
        soru: 'Eten (C₂H₄) molekülündeki C atomlarının hibriti nedir?',
        siklar: ['sp³', 'sp²'],
        dogru: 1,
        aciklama: {
          dogru: 'Her C üç σ bağı yapar (iki H, bir C) ve çifti yoktur: sp², açı 120°.',
          yanlis: 'sp³ dört σ bağı ister. Eten C’si üç σ bağı ve bir π bağı yapar: sp².',
        },
        kart: 4,
      },
    ]),
  ]),
  tema('kim12-t3', 'Organik Bileşikler', [
    konu('kim12-alkan', 'Alkanlar', [
      kart(
        'Alkan nedir?',
        'Yalnız C ve H içeren, bütün bağları tek olan hidrokarbonlardır.\n**Genel formül: CₙH₂ₙ₊₂**\nDoymuş hidrokarbon da denir; C atomları sp³’tür.',
      ),
      kart(
        'İlk alkanlar',
        'Ad kökü C sayısını, -an eki alkan olduğunu söyler.\nArdışık iki alkan bir CH₂ farkla homolog seri oluşturur.',
        {
          tur: 'tablo',
          basliklar: ['C', 'Ad', 'Formül'],
          satirlar: [
            ['1', 'Metan', 'CH₄'],
            ['2', 'Etan', 'C₂H₆'],
            ['3', 'Propan', 'C₃H₈'],
            ['4', 'Bütan', 'C₄H₁₀'],
            ['5', 'Pentan', 'C₅H₁₂'],
            ['6', 'Hekzan', 'C₆H₁₄'],
            ['7', 'Heptan', 'C₇H₁₆'],
            ['8', 'Oktan', 'C₈H₁₈'],
          ],
        },
      ),
      kart(
        'Alkil grupları',
        'Alkandan bir H çıkınca alkil grubu kalır:\n- **Metil:** CH₃–\n- **Etil:** CH₃CH₂–\n- **Propil:** CH₃CH₂CH₂–\n- **İzopropil:** (CH₃)₂CH–',
      ),
      kart(
        'Adlandırma',
        '- En uzun karbon zincirini bul.\n- Dala en yakın uçtan numarala.\n- Dalın konumunu, adını ve ana zincirin adını sırayla yaz.\nCH₃–CH(CH₃)–CH₂–CH₃ → 2-metilbütan',
      ),
      kart(
        'Birden çok dal',
        '- Aynı dallar di-, tri- ile toplanır: 2,2-dimetilpropan\n- Farklı dallar alfabetik sıralanır: 3-etil-2-metilhekzan\n- Numaralar, dal konumlarının toplamı en küçük olacak yönden verilir.',
      ),
      kart(
        'Yapı izomerleri',
        'C₄H₁₀: bütan ve 2-metilpropan\nC₅H₁₂: pentan, 2-metilbütan, 2,2-dimetilpropan\nC sayısı arttıkça izomer sayısı hızla artar (C₆H₁₄: 5 izomer).',
      ),
      kart(
        'Fiziksel özellikler',
        '- Apolardır; suda çözünmez ve sudan hafiftir.\n- C sayısı arttıkça kaynama noktası yükselir.\n- 25 °C’de C₁–C₄ gaz, C₅–C₁₇ sıvı, daha büyükleri katıdır.',
      ),
      kart(
        'Dallanma ve kaynama',
        'Aynı formülde dallanma arttıkça molekül küreselleşir, temas yüzeyi ve London kuvvetleri azalır.\nBu yüzden kaynama noktası düşer.',
        {
          tur: 'tablo',
          basliklar: ['C₅H₁₂ izomeri', 'Kaynama (°C)'],
          satirlar: [
            ['Pentan', '36'],
            ['2-metilbütan', '28'],
            ['2,2-dimetilpropan', '9,5'],
          ],
        },
        { not: 'İki kural: C sayısı artınca kaynama yükselir; aynı C sayısında dallanma artınca düşer.' },
      ),
      kart(
        'Tepkimeleri',
        '- **Yanma:** C₃H₈ + 5O₂ → 3CO₂ + 4H₂O\n- **Halojenle yer değiştirme (ışıkta):** CH₄ + Cl₂ → CH₃Cl + HCl\nBütün bağları tek olduğu için katılma tepkimesi vermez.',
      ),
      kart(
        'Kullanım alanları',
        '- **Metan:** doğal gazın ana bileşeni\n- **Propan ve bütan:** LPG, çakmak gazı\n- **Oktan ve benzerleri:** benzin\n- **Uzun zincirliler:** parafin mumu, vazelin',
      ),
      kart(
        'Sikloalkanlar',
        'Uçları birleşip halka kuran doymuş hidrokarbonlardır.\n**Genel formül: CₙH₂ₙ**\nSiklopropan (C₃H₆) ile propen aynı formüllü izomerlerdir.',
      ),
    ], [], [
      {
        soru: 'Hangisi bir alkanın formülüdür?',
        siklar: ['C₆H₁₄', 'C₆H₁₂'],
        dogru: 0,
        aciklama: {
          dogru: 'n = 6 için CₙH₂ₙ₊₂ = C₆H₁₄.',
          yanlis: 'C₆H₁₂, CₙH₂ₙ kalıbına uyar: alken ya da sikloalkan. Alkan C₆H₁₄’tür.',
        },
        kart: 2,
      },
      {
        soru: 'Hangisinin kaynama noktası daha yüksektir?',
        siklar: ['2,2-dimetilpropan', 'Pentan'],
        dogru: 1,
        aciklama: {
          dogru: 'Düz zincirli pentanın temas yüzeyi büyüktür; London kuvvetleri daha güçlüdür.',
          yanlis: 'Formül aynı; dallanmış 2,2-dimetilpropan küreseldir ve daha düşük sıcaklıkta kaynar.',
        },
        kart: 8,
      },
    ]),
    konu('kim12-alken', 'Alkenler', [
      kart(
        'Alken nedir?',
        'En az bir C=C çift bağı içeren hidrokarbonlardır.\n**Genel formül: CₙH₂ₙ** (tek çift bağlı, halkasız)\nÇift bağlı C’ler sp²’dir; ilk üye eten (etilen), C₂H₄.',
      ),
      kart(
        'Adlandırma',
        '- Çift bağı içeren en uzun zinciri seç.\n- Çift bağa yakın uçtan numarala.\n- -an yerine -en yaz, çift bağın konumunu belirt.\nCH₂=CH–CH₂–CH₃ → 1-büten',
      ),
      kart(
        'Örnekler',
        '- CH₃–CH=CH–CH₃ → 2-büten\n- CH₂=C(CH₃)–CH₃ → 2-metilpropen\n- CH₂=CH–CH=CH₂ → 1,3-bütadien (iki çift bağ)',
      ),
      kart(
        'Cis-trans izomerliği',
        'Çift bağ dönmez; gruplar aynı ya da zıt tarafta sabit kalır.\n- **Cis:** benzer gruplar aynı tarafta\n- **Trans:** benzer gruplar zıt tarafta\nŞart: çift bağlı her C’de iki farklı grup olmalıdır.',
      ),
      kart(
        'Kimde var, kimde yok?',
        '- **2-büten:** her C’de H ve CH₃ var; cis ve trans hâli olur.\n- **1-büten:** uçtaki C’de iki H var; olmaz.\n- **Propen:** uçtaki C’de iki H var; olmaz.',
        undefined,
        { not: 'Çift bağın bir ucunda iki aynı grup varsa cis-trans aramayı bırak.' },
      ),
      kart(
        'Katılma tepkimeleri',
        'π bağı kırılır, iki C’ye birer atom bağlanır:\n- **H₂ (Ni ya da Pt):** alkan\n- **Br₂:** dibromoalkan\n- **HCl:** kloroalkan\n- **H₂O (asitle):** alkol',
      ),
      kart(
        'Bromlu su testi',
        'Kırmızı-kahverengi bromlu su alkenle karışınca renksizleşir.\nAlkanlar bu rengi gidermez.\nTest çift ya da üçlü bağın varlığını gösterir.',
      ),
      kart(
        'Markovnikov kuralı',
        'HX ya da su, simetrik olmayan alkene katılırken H, hidrojeni çok olan C’ye bağlanır.\nCH₂=CH–CH₃ + HBr → CH₃–CHBr–CH₃ (2-bromopropan)',
      ),
      kart(
        'Polimerleşme',
        'Çok sayıda küçük molekül (monomer) birbirine katılıp dev bir zincir (polimer) kurar:\n- **Eten:** polietilen (poşet)\n- **Propen:** polipropilen\n- **Vinil klorür:** PVC (boru)\n- **Tetrafloroeten:** teflon',
      ),
      kart(
        'Etilen',
        'Eten, plastik ve etanol üretiminin başlıca hammaddesidir.\nBitkiler de üretir: meyveleri olgunlaştıran bir hormondur.\nLaboratuvarda etanolden derişik H₂SO₄ ile su çekilerek elde edilir.',
      ),
    ], [], [
      {
        soru: 'Hangisinde cis-trans izomerliği görülür?',
        siklar: ['1-büten', '2-büten'],
        dogru: 1,
        aciklama: {
          dogru: '2-bütende çift bağlı her C’de H ve CH₃ vardır; iki farklı grup şartı sağlanır.',
          yanlis: '1-bütenin uç C’sinde iki H vardır, cis-trans olmaz. 2-bütende olur.',
        },
        kart: 4,
      },
    ]),
    konu('kim12-alkin', 'Alkinler', [
      kart(
        'Alkin nedir?',
        'En az bir C≡C üçlü bağı içeren hidrokarbonlardır.\n**Genel formül: CₙH₂ₙ₋₂**\nÜçlü bağlı C’ler sp’dir; bu kısım doğrusaldır.',
      ),
      kart(
        'Etin (asetilen)',
        'En küçük alkindir: HC≡CH\nKalsiyum karbür suyla tepkimeye girince oluşur:\nCaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂\nOksiasetilen alevi 3000 °C’yi aşar; metal kesme ve kaynakta kullanılır.',
      ),
      kart(
        'Adlandırma',
        '-an yerine -in eki gelir; üçlü bağa yakın uçtan numaralanır:\n- CH≡C–CH₂–CH₃ → 1-bütin\n- CH₃–C≡C–CH₃ → 2-bütin\n- CH≡C–CH₃ → propin',
      ),
      kart(
        'Cis-trans yok',
        'Üçlü bağın çevresi doğrusal olduğu için alkinlerde cis-trans izomerliği görülmez.\nC₄H₆ formülünün izomerlerinden üçü: 1-bütin, 2-bütin ve 1,3-bütadien',
      ),
      kart(
        'Katılma',
        'İki π bağı vardır; iki basamakta iki mol katılır:\nHC≡CH + H₂ → CH₂=CH₂\nCH₂=CH₂ + H₂ → CH₃–CH₃\nAlkinler de bromlu suyu renksizleştirir.',
      ),
      kart(
        'Su katılması',
        'Alkine su katılınca önce enol oluşur, o da karbonil bileşiğine dönüşür:\n- **Etin:** etanal (asetaldehit)\n- **Propin:** propanon (aseton)',
      ),
      kart(
        'Uç alkinin asitliği',
        'Üçlü bağlı C’deki H (≡C–H) zayıf asidiktir.\nAmonyaklı AgNO₃ ya da CuCl çözeltisiyle çökelek verir.\n- **1-bütin:** çökelek verir.\n- **2-bütin:** vermez; uçta H yok.',
        undefined,
        { not: '1-bütin ile 2-bütini ayırmanın yolu bu: ucunda H olan alkin çökelek verir.' },
      ),
      kart(
        'Yanma',
        'Alkinler C oranı yüksek olduğu için isli alevle yanar.\n2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O\nAlkinde H₂O molü CO₂ molünden azdır; alkende eşit, alkanda fazladır.',
      ),
    ], [], [
      {
        soru: 'CH₃–C≡C–CH₃ bileşiğinin adı nedir?',
        siklar: ['1-bütin', '2-bütin'],
        dogru: 1,
        aciklama: {
          dogru: 'Dört C’li zincirde üçlü bağ 2. ve 3. C arasında: 2-bütin.',
          yanlis: '1-bütinde üçlü bağ uçtadır (CH≡C–). Burada ortada; ad 2-bütin.',
        },
        kart: 3,
      },
    ]),
    konu('kim12-aromatik', 'Aromatik Hidrokarbonlar', [
      kart(
        'Benzen',
        'C₆H₆: altı C’lu düzlem halka; her C sp² ve birer H taşır.\nAltı C–C bağının uzunluğu eşittir (139 pm); tek ve çift bağ arasındadır.',
      ),
      kart(
        'Elektron bulutu',
        'Üç π bağının elektronları tek bir bağa ait değildir; halkanın üstüne ve altına yayılır.\nBu yayılma (delokalizasyon) benzeni çok kararlı yapar.\nHalka bu yüzden içinde daire olan altıgenle de çizilir.',
      ),
      kart(
        'Katılma değil yer değiştirme',
        'Benzen, alken gibi bromlu suyu renksizleştirmez.\nKararlı halkayı korumak için H yerine başka grup bağlar:\n- **Bromlama (FeBr₃):** bromobenzen\n- **Nitrolama (HNO₃ + H₂SO₄):** nitrobenzen',
        undefined,
        { not: 'Benzende üç çift bağ çizilse de alken gibi davranmaz; katılma değil yer değiştirme yapar.' },
      ),
      kart(
        'Önemli türevler',
        'Halkaya bağlanan grup bileşiğin adını ve davranışını belirler.',
        {
          tur: 'tablo',
          basliklar: ['Grup', 'Bileşik'],
          satirlar: [
            ['–CH₃', 'Toluen (metilbenzen)'],
            ['–OH', 'Fenol'],
            ['–NH₂', 'Anilin'],
            ['–COOH', 'Benzoik asit'],
          ],
        },
      ),
      kart(
        'Orto, meta, para',
        'Halkada iki grup varsa konumları:\n- **Orto (1,2):** komşu C’ler\n- **Meta (1,3):** arada bir C\n- **Para (1,4):** karşılıklı C’ler\nDimetilbenzenin (ksilen) bu yüzden üç izomeri vardır.',
      ),
      kart(
        'Çok halkalı aromatikler',
        'Naftalin (C₁₀H₈), kenar paylaşan iki benzen halkasından oluşur.\nKeskin kokulu beyaz bir katıdır ve süblimleşir.\nEskiden güve kovucu olarak kullanılırdı.',
      ),
      kart(
        'Kullanım ve sağlık',
        '- **Benzen:** çözücü ve hammadde; kanser yapıcıdır.\n- **Toluen:** tiner ve boya çözücüsü\n- **TNT (trinitrotoluen):** patlayıcı\n- **Stiren:** polistiren (köpük) monomeri',
      ),
      kart(
        'Yanma',
        'Aromatikler C oranı yüksek olduğu için isli, sarı alevle yanar.\n2C₆H₆ + 15O₂ → 12CO₂ + 6H₂O',
      ),
    ], [], [
      {
        soru: 'Benzendeki C atomlarının hibriti nedir?',
        siklar: ['sp²', 'sp³'],
        dogru: 0,
        aciklama: {
          dogru: 'Her C iki C ve bir H ile üç σ bağı yapar; kalan p orbitali π bulutuna katılır.',
          yanlis: 'sp³ dörtyüzlü olurdu; benzen düzlemdir ve her C üç σ bağı yapar: sp².',
        },
        kart: 1,
      },
    ]),
    konu('kim12-fonksiyonel', 'Fonksiyonel Gruplar', [
      kart(
        'Fonksiyonel grup',
        'Organik molekülün tepkimelerini ve özelliklerini belirleyen atom ya da atom grubudur.\nAynı grubu taşıyan bileşikler benzer davranır.',
      ),
      kart(
        'Başlıca gruplar',
        'R, molekülün hidrokarbon kısmını gösterir.',
        {
          tur: 'tablo',
          basliklar: ['Grup', 'Sınıf', 'Örnek'],
          satirlar: [
            ['–OH', 'Alkol', 'CH₃OH'],
            ['–O–', 'Eter', 'CH₃OCH₃'],
            ['–CHO', 'Aldehit', 'CH₃CHO'],
            ['–CO–', 'Keton', 'CH₃COCH₃'],
            ['–COOH', 'Karboksilik asit', 'CH₃COOH'],
            ['–COO–', 'Ester', 'CH₃COOCH₃'],
            ['–NH₂', 'Amin', 'CH₃NH₂'],
          ],
        },
      ),
      kart(
        'Genel formüller',
        'Doymuş, halkasız ve tek gruplu bileşikler için:\n- **Alkol, eter:** CₙH₂ₙ₊₂O\n- **Aldehit, keton:** CₙH₂ₙO\n- **Karboksilik asit, ester:** CₙH₂ₙO₂',
      ),
      kart(
        'Fonksiyonel izomerler',
        'Aynı genel formülü paylaşan iki sınıf birbirinin izomeri olabilir:\n- **C₂H₆O:** etanol ve dimetil eter\n- **C₃H₆O:** propanal ve propanon\n- **C₂H₄O₂:** asetik asit ve metil formiat',
      ),
      kart(
        'Alkil halojenürler',
        'Alkandaki bir H yerine halojen bağlanır: R–X\n- CH₃Cl: klorometan\n- CHCl₃: kloroform (triklorometan)\nEskiden soğutucu olan CFC’ler ozon tabakasına zarar verdi.',
      ),
      kart(
        'Aminler',
        'Amonyaktaki H yerine alkil bağlanır: R–NH₂\nMetilamin (CH₃NH₂) zayıf bazdır ve balık kokar.\nAmino asitler hem –NH₂ hem –COOH taşır.',
      ),
      kart(
        'Grubu tanıma',
        'Önce oksijenin nereye bağlı olduğuna bak:\n- C–O–H → alkol\n- C–O–C → eter\n- Uçta C=O → aldehit\n- Zincir içinde C=O → keton',
        undefined,
        { not: 'C=O’nun yanında –OH varsa asit, –O–C varsa esterdir; önce komşusuna bak.' },
      ),
    ], [], [
      {
        soru: 'C₃H₆O formüllü fonksiyonel izomer çifti hangisidir?',
        siklar: ['Propanal – propanon', 'Propanol – propanon'],
        dogru: 0,
        aciklama: {
          dogru: 'Aldehit ve keton aynı CₙH₂ₙO formülünü paylaşır; ikisi de C₃H₆O’dur.',
          yanlis: 'Propanol C₃H₈O’dur, propanonla izomer olamaz. Çift propanal – propanondur.',
        },
        kart: 4,
      },
    ]),
    konu('kim12-alkol', 'Alkoller ve Eterler', [
      kart(
        'Alkol',
        'Doymuş C’ye bağlı –OH grubu taşıyan bileşiklerdir: R–OH\n**Genel formül: CₙH₂ₙ₊₁OH**\nAlkoldeki –OH, OH⁻ iyonu vermez; alkoller bazik değildir.',
      ),
      kart(
        'Adlandırma',
        '- Alkan adına -ol eklenir: metanol, etanol\n- –OH’ye yakın uçtan numaralanır: 1-propanol, 2-propanol\n- 2-propanolün yaygın adı izopropil alkoldür.',
      ),
      kart(
        'Primer, sekonder, tersiyer',
        '–OH taşıyan C’ye kaç C bağlı?\n- **1 (primer):** etanol, 1-propanol\n- **2 (sekonder):** 2-propanol\n- **3 (tersiyer):** 2-metil-2-propanol',
      ),
      kart(
        'OH sayısına göre',
        '- **Monoalkol:** etanol\n- **Dialkol:** etilen glikol (1,2-etandiol); antifriz\n- **Trialkol:** gliserin (1,2,3-propantriol); kozmetik ve gıda',
      ),
      kart(
        'Hidrojen bağı',
        '–OH, alkol molekülleri arasında hidrojen bağı kurar.\nEtanol 78 °C’de kaynar; aynı formüllü dimetil eter −24 °C’de.\nKüçük alkoller suyla her oranda karışır; zincir uzadıkça çözünürlük azalır.',
      ),
      kart(
        'Metanol ve etanol',
        '- **Metanol:** odun ispirtosu; çok zehirlidir, körlük ve ölüme yol açar.\n- **Etanol:** şekerin mayalanmasıyla elde edilir; dezenfektan ve yakıt katkısı\nC₆H₁₂O₆ → 2C₂H₅OH + 2CO₂',
      ),
      kart(
        'Aktif metalle tepkime',
        'Alkoller Na, K gibi aktif metallerle H₂ verir:\n2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂\nEterler bu tepkimeyi vermez; ikisini ayırmada kullanılır.',
      ),
      kart(
        'Yükseltgenme',
        'KMnO₄ ya da K₂Cr₂O₇ ile:\n- **Primer:** önce aldehit, sonra karboksilik asit\n- **Sekonder:** keton\n- **Tersiyer:** yükseltgenmez',
        undefined,
        { not: 'Sonucu –OH taşıyan C’deki H sayısı belirler; o C’de H yoksa yükseltgenme olmaz.' },
      ),
      kart(
        'Su çekme',
        'Derişik H₂SO₄ ile ısıtılınca:\n- **Yüksek sıcaklık (~170 °C):** molekül içinden su çıkar, alken oluşur.\n- **Daha düşük sıcaklık (~140 °C):** iki molekül arasından su çıkar, eter oluşur.',
      ),
      kart(
        'Eter',
        'Oksijen iki alkil grubuna bağlıdır: R–O–R′\n- Dimetil eter: CH₃–O–CH₃\n- Dietil eter: C₂H₅–O–C₂H₅\nAdı alkil adları ve "eter" ile verilir: etil metil eter.',
      ),
      kart(
        'Eterin özellikleri',
        'Eter molekülleri arasında hidrojen bağı yoktur; aynı formüllü alkolden çok düşük sıcaklıkta kaynar.\nDietil eter uçucu ve çok yanıcı bir çözücüdür; eskiden narkozda kullanıldı.',
      ),
    ], [], [
      {
        soru: '2-propanol hangi sınıf alkoldür?',
        siklar: ['Primer', 'Sekonder'],
        dogru: 1,
        aciklama: {
          dogru: '–OH ortadaki C’dedir; o C iki C’ye bağlıdır: sekonder.',
          yanlis: 'Primerde –OH’li C tek C’ye bağlıdır (1-propanol). 2-propanolde iki C’ye bağlı: sekonder.',
        },
        kart: 3,
      },
      {
        soru: 'Tersiyer alkol KMnO₄ ile ne verir?',
        siklar: ['Keton', 'Tepkime vermez'],
        dogru: 1,
        aciklama: {
          dogru: '–OH’li C’de H olmadığı için tersiyer alkol yükseltgenmez.',
          yanlis: 'Keton sekonder alkolden oluşur. Tersiyer alkolde –OH’li C’de H yok; yükseltgenmez.',
        },
        kart: 8,
      },
    ]),
    konu('kim12-karbonil', 'Aldehitler ve Ketonlar', [
      kart(
        'Karbonil grubu',
        'C=O grubuna karbonil denir.\n- **Aldehit:** C=O zincirin ucunda, bir H’ye bağlı (–CHO)\n- **Keton:** C=O zincirin içinde, iki C’ye bağlı (–CO–)',
      ),
      kart(
        'Adlandırma',
        '- Aldehitte alkan adına -al gelir: metanal, etanal\n- Ketonda alkan adına -on gelir: propanon, 2-bütanon\nEn küçük keton üç C’lidir; C=O’nun iki yanında C olmalıdır.',
      ),
      kart(
        'Tanınmış örnekler',
        '- **Metanal (formaldehit):** %40’lık sulu çözeltisi formalin; doku saklamada\n- **Etanal (asetaldehit):** etanolün vücutta yükseltgenme ürünü\n- **Propanon (aseton):** oje çıkarıcı, çözücü',
      ),
      kart(
        'Nereden gelirler?',
        '- **Primer alkol yükseltgenirse:** aldehit\n- **Sekonder alkol yükseltgenirse:** keton\nTersine, H₂ katılınca aldehit primer, keton sekonder alkole döner.',
      ),
      kart(
        'Ayırt etme',
        'Aldehit kolay yükseltgenir, keton yükseltgenmez:\n- **Tollens (amonyaklı AgNO₃):** aldehit gümüş aynası verir.\n- **Fehling:** aldehit kırmızı Cu₂O çökeleği verir.\nKetonlar iki testte de değişmez.',
        undefined,
        { not: 'Gümüş aynası ve kırmızı çökelek aldehidin işaretidir; aseton bu testleri vermez.' },
      ),
      kart(
        'Fiziksel özellikler',
        'C=O polardır ama moleküller arasında hidrojen bağı yoktur.\nBenzer kütlede kaynama sırası: alkan < aldehit, keton < alkol\nKüçükleri suyla hidrojen bağı kurup çözünür.',
      ),
      kart(
        'İzomerlik',
        'Aynı C sayılı aldehit ve keton izomerdir: CₙH₂ₙO\nC₃H₆O: propanal (CH₃CH₂CHO) ve propanon (CH₃COCH₃)\nC₂H₄O’nun keton izomeri yoktur.',
      ),
      kart(
        'Şekerlerde karbonil',
        'Glikoz zincir hâlinde bir aldehit grubu taşır; fruktoz bir keton grubu taşır.\nGlikoz bu yüzden Tollens ve Fehling testlerini verir.',
      ),
    ], [], [
      {
        soru: 'Hangisi Tollens testinde gümüş aynası verir?',
        siklar: ['Propanon', 'Propanal'],
        dogru: 1,
        aciklama: {
          dogru: 'Propanal bir aldehittir; kolay yükseltgenir ve Ag⁺’yı gümüşe indirger.',
          yanlis: 'Propanon bir ketondur ve yükseltgenmez. Gümüş aynasını aldehit olan propanal verir.',
        },
        kart: 5,
      },
    ]),
    konu('kim12-karboksilik', 'Karboksilik Asitler', [
      kart(
        'Karboksil grubu',
        'Karbonil ve hidroksil aynı C’de: –COOH\n**Genel formül: CₙH₂ₙO₂** (doymuş, tek –COOH)\nAdı alkan adı ve -oik asit ekiyle verilir: etanoik asit',
      ),
      kart(
        'Tanınmış asitler',
        'Yaygın adların çoğu ilk bulundukları yerden gelir: formica Latincede karınca demektir.',
        {
          tur: 'tablo',
          basliklar: ['Asit', 'Nerede?'],
          satirlar: [
            ['Metanoik (formik)', 'Karınca, ısırgan otu'],
            ['Etanoik (asetik)', 'Sirke (%4–5)'],
            ['Bütanoik', 'Bozulmuş tereyağı'],
            ['Benzoik', 'Gıda koruyucu'],
            ['Sitrik', 'Limon'],
            ['Laktik', 'Ekşi süt, yorgun kas'],
          ],
        },
      ),
      kart(
        'Zayıf asit',
        'Suda kısmen iyonlaşır:\nCH₃COOH ⇌ CH₃COO⁻ + H⁺\nMavi turnusolü kırmızıya çevirir; aynı derişimde HCl’den çok daha az H⁺ verir.',
      ),
      kart(
        'Asit tepkimeleri',
        '- **Bazla:** CH₃COOH + NaOH → CH₃COONa + H₂O\n- **Aktif metalle:** H₂ gazı çıkar.\n- **Karbonatla:** CO₂ gazı çıkar.',
        undefined,
        { not: 'Karbonatla köpürme asidi alkolden ayırır; alkol NaHCO₃ ile CO₂ vermez.' },
      ),
      kart(
        'Kaynama noktası',
        'İki asit molekülü iki hidrojen bağıyla çift (dimer) oluşturur.\nAsetik asit 118 °C’de, aynı mol kütleli 1-propanol 97 °C’de kaynar.\nKüçük asitler suda iyi çözünür.',
      ),
      kart(
        'Nasıl elde edilir?',
        'Primer alkol ya da aldehit yükseltgenince oluşur:\nCH₃CH₂OH → CH₃CHO → CH₃COOH\nŞarap açıkta kalınca bakteriler etanolü sirkeye çevirir.',
      ),
      kart(
        'Yağ asitleri',
        'Uzun zincirli karboksilik asitlerdir:\n- **Doymuş:** palmitik, stearik; zincirde çift bağ yok\n- **Doymamış:** oleik; zincirde C=C var\nYağların yapısında gliserine bağlı bulunurlar.',
      ),
      kart(
        'Formik asit istisnası',
        'HCOOH’de karboksil C’si bir H taşır; molekül aldehit gibi de davranır.\nBu yüzden basit asitlerden yalnız formik asit Tollens testini verir.',
      ),
    ], [], [
      {
        soru: 'Sirkenin asidi hangisidir?',
        siklar: ['Etanoik asit', 'Metanoik asit'],
        dogru: 0,
        aciklama: {
          dogru: 'Sirke %4–5 oranında etanoik (asetik) asit içerir.',
          yanlis: 'Metanoik (formik) asit karıncada bulunur. Sirkedeki asit etanoik asittir.',
        },
        kart: 2,
      },
    ]),
    konu('kim12-ester', 'Esterler', [
      kart(
        'Esterleşme',
        'Karboksilik asit ve alkol, asit katalizörlüğünde ester ve su verir:\nCH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O\nTepkime tersinirdir.',
      ),
      kart(
        'Adlandırma',
        'Önce alkolden gelen alkil, sonra asitten gelen kısım (-oat) söylenir:\n- CH₃COOC₂H₅: etil etanoat (etil asetat)\n- HCOOCH₃: metil metanoat (metil formiat)',
        undefined,
        { not: 'Adda önce O’ya bağlı alkil, sonra asit kısmı gelir; formülde sıra terstir.' },
      ),
      kart(
        'Koku ve tat',
        'Küçük esterler uçucudur ve meyvemsi kokar.\nGıdalarda yapay aroma olarak kullanılır.',
        {
          tur: 'tablo',
          basliklar: ['Ester', 'Koku'],
          satirlar: [
            ['Etil bütanoat', 'Ananas'],
            ['İzopentil asetat', 'Muz'],
            ['Oktil asetat', 'Portakal'],
          ],
        },
      ),
      kart(
        'Fiziksel özellikler',
        'Ester molekülleri arasında hidrojen bağı yoktur.\nKaynama noktası, aynı mol kütleli asit ve alkolden düşüktür.\nEtil asetat oje çıkarıcı ve yapıştırıcılarda çözücüdür.',
      ),
      kart(
        'Hidroliz',
        'Ester suyla ayrışıp asit ve alkole döner:\n- **Asitli ortamda:** tersinirdir; esterleşmenin tersi\n- **Bazik ortamda (NaOH):** tamamlanır; asit yerine tuzu oluşur',
      ),
      kart(
        'Yağlar',
        'Gliserin ile üç yağ asidinin esteridir (trigliserit):\n- **Doymuş yağ asitli:** oda sıcaklığında katı, çoğu hayvansal\n- **Doymamış yağ asitli:** sıvı, çoğu bitkisel',
      ),
      kart(
        'Sabunlaşma',
        'Yağ + 3NaOH → gliserin + 3 sabun (yağ asidinin Na tuzu)\nNaOH sert sabun, KOH yumuşak sabun verir.\nSabunun uzun apolar ucu yağı, iyonik ucu suyu tutar.',
      ),
      kart(
        'Margarin ve poliester',
        '- **Margarin:** sıvı yağın C=C bağlarına H₂ katılır, yağ katılaşır.\n- **Poliester (PET):** iki uçlu asit ve iki uçlu alkol ester bağlarıyla zincir kurar; şişe ve kumaş',
      ),
    ], [], [
      {
        soru: 'CH₃COOCH₃ hangi asit ve alkolden oluşur?',
        siklar: ['Etanoik asit + metanol', 'Metanoik asit + etanol'],
        dogru: 0,
        aciklama: {
          dogru: 'CH₃CO– kısmı asetik asitten, –OCH₃ kısmı metanolden gelir: metil etanoat.',
          yanlis: 'O’ya bağlı CH₃ alkolden gelir (metanol); C=O’lu CH₃CO– asetik asitten.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('kim12-t4', 'Enerji Kaynakları ve Bilimsel Gelişmeler', [
    konu('kim12-fosil', 'Fosil Yakıtlar', [
      kart(
        'Fosil yakıt',
        'Milyonlarca yıl önce gömülen canlı kalıntılarının ısı ve basınç altında dönüşmesiyle oluşur.\nKömür, petrol ve doğal gaz bu gruptadır.\nOluşumları çok yavaş olduğu için yenilenemez kaynaklardır.',
      ),
      kart(
        'Kömür türleri',
        'Kömürleşme ilerledikçe C oranı ve ısıl değer artar.\nTürkiye’de linyit yaygındır; taşkömürü Zonguldak’ta çıkarılır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Turba' },
            { ad: 'Linyit' },
            { ad: 'Taşkömürü' },
            { ad: 'Antrasit', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Kömürün sorunları',
        '- **Kükürt:** yanınca SO₂ verir; asit yağmuruna yol açar.\n- **Kül ve partikül:** hava kirliliği yapar.\n- **CO₂:** aynı enerji için en çok CO₂ veren fosil yakıttır.',
      ),
      kart(
        'Petrol',
        'Ham petrol, çoğu alkan olan binlerce hidrokarbonun karışımıdır.\nKullanılmadan önce rafineride bileşenlerine ayrılır.',
      ),
      kart(
        'Ayrımsal damıtma',
        'Isıtılan ham petrol kuleye verilir; bileşenler kaynama noktalarına göre farklı yükseklikte yoğuşur.\nKüçük moleküller üstte, büyükler altta toplanır.',
        {
          tur: 'katman',
          eksenAdi: 'kaynama noktası artar',
          katmanlar: [
            { ad: 'Rafineri gazı', alt: 'C₁–C₄, LPG' },
            { ad: 'Benzin', alt: 'taşıt yakıtı' },
            { ad: 'Gazyağı', alt: 'uçak yakıtı' },
            { ad: 'Motorin', alt: 'dizel' },
            { ad: 'Fuel oil', alt: 'gemi, kalorifer' },
            { ad: 'Asfalt', alt: 'kalıntı', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Kraking',
        'Büyük hidrokarbon moleküllerini ısı ve katalizörle küçük moleküllere parçalamaktır.\nAğır kesimlerden daha çok benzin ve eten gibi alkenler elde edilir.\nÖrnek: C₁₆H₃₄ → C₈H₁₈ + C₈H₁₆',
      ),
      kart(
        'Oktan sayısı',
        'Benzinin motorda erken tutuşmaya (vuruntuya) karşı direncidir.\n- **İzooktan (2,2,4-trimetilpentan):** 100\n- **n-heptan:** 0\nDallanmış ve aromatik hidrokarbonlar oktan sayısını yükseltir.',
        undefined,
        { not: '95 oktan benzin, vuruntu direnci %95 izooktan karışımına eş olan benzindir; içeriği o değil.' },
      ),
      kart(
        'Doğal gaz ve LPG',
        '- **Doğal gaz:** büyük kısmı metandır; kokusuz olduğu için kaçak fark edilsin diye kokulu bir madde eklenir.\n- **LPG:** propan-bütan karışımı; basınçla sıvılaşır, havadan ağırdır ve yere çöker.',
      ),
      kart(
        'Katalitik konvertör',
        'Taşıt egzozundaki zararlı gazları Pt, Pd ve Rh katalizörleriyle dönüştürür:\n- CO → CO₂\n- NOₓ → N₂\n- Yanmamış hidrokarbon → CO₂ + H₂O',
      ),
    ], [], [
      {
        soru: 'Hangisinin C oranı ve ısıl değeri daha yüksektir?',
        siklar: ['Linyit', 'Antrasit'],
        dogru: 1,
        aciklama: {
          dogru: 'Antrasit kömürleşmenin en ileri aşamasıdır; C oranı ve ısıl değeri en yüksektir.',
          yanlis: 'Linyit genç bir kömürdür; nem ve uçucu madde oranı yüksek, ısıl değeri düşüktür.',
        },
        kart: 2,
      },
    ]),
    konu('kim12-alternatif', 'Alternatif Enerji Kaynakları', [
      kart(
        'Yenilenebilir enerji',
        'Kullanıldıkça doğada yeniden oluşan ya da tükenmeyen kaynaklardır.\nGüneş, rüzgâr, su gücü, jeotermal ve biyokütle bu gruptadır.\nNükleer enerji fosil değildir ama yakıtı olan uranyum tükenebilir.',
      ),
      kart(
        'Güneş enerjisi',
        '- **Güneş pili (fotovoltaik):** silisyum yarı iletkende ışık doğrudan elektriğe dönüşür.\n- **Güneş kolektörü:** ışık suyu ısıtır.\nGece ve bulutlu havada üretim düşer; depolama gerekir.',
      ),
      kart(
        'Rüzgâr ve su',
        '- **Rüzgâr:** türbin kanatları jeneratörü döndürür; üretim rüzgâra bağlıdır.\n- **Hidroelektrik:** barajdaki suyun potansiyel enerjisi türbinle elektriğe dönüşür.\nİkisi de çalışırken CO₂ salmaz.',
      ),
      kart(
        'Jeotermal',
        'Yer altındaki sıcak su ve buharın ısısıdır.\nElektrik üretiminde, sera ve konut ısıtmada kullanılır.\nTürkiye’de Denizli, Aydın ve Manisa çevresi bu bakımdan zengindir.',
      ),
      kart(
        'Hidrojen',
        'Yanınca yalnız su verir: 2H₂ + O₂ → 2H₂O\nKütle başına enerjisi çok yüksektir (142 kJ/g).\nDoğada serbest bulunmaz, üretilmesi enerji ister; bu yüzden kaynak değil enerji taşıyıcıdır.',
      ),
      kart(
        'Biyokütle',
        'Bitki ve hayvan kökenli maddelerden enerji elde edilir:\n- **Biyoetanol:** şeker ve nişastanın mayalanması\n- **Biyodizel:** bitkisel yağ ve metanolden yağ asidi metil esteri\n- **Biyogaz:** atıkların oksijensiz çürümesiyle CH₄ ve CO₂',
      ),
      kart(
        'Biyoyakıt ve CO₂',
        'Bitki büyürken havadan CO₂ alır; yakıt yanınca bu CO₂ geri verilir.\nBu yüzden net CO₂ katkısı fosil yakıttan düşüktür.\nAma tarım alanının gıdadan yakıta kayması tartışılır.',
        undefined,
        { not: 'Biyoyakıt da yanınca CO₂ verir; fark, o karbonun yakın zamanda havadan alınmış olmasıdır.' },
      ),
      kart(
        'Nükleer enerji',
        '- **Fisyon:** U-235 çekirdeği nötronla bölünür, çok büyük enerji açığa çıkar; santraller böyle çalışır.\n- **Füzyon:** hafif çekirdekler birleşir; Güneş’in enerjisidir, santralde henüz kullanılmıyor.\nFisyonun en büyük sorunu radyoaktif atıktır.',
      ),
      kart(
        'Karşılaştırma',
        'Tek kaynak yetmez; enerji karması ve depolama birlikte planlanır.',
        {
          tur: 'tablo',
          basliklar: ['Kaynak', 'Artısı', 'Eksisi'],
          satirlar: [
            ['Güneş', 'Tükenmez, temiz', 'Gece yok'],
            ['Rüzgâr', 'Temiz', 'Kesintili'],
            ['Hidroelektrik', 'Sürekli, depolanabilir', 'Doğal alanı değiştirir'],
            ['Nükleer', 'CO₂ yok, sürekli', 'Radyoaktif atık'],
            ['Biyokütle', 'Atığı değerlendirir', 'Tarım alanı ister'],
          ],
        },
      ),
    ], [], [
      {
        soru: 'Güneş pili ışığı neye dönüştürür?',
        siklar: ['Doğrudan elektriğe', 'Önce ısıya, sonra elektriğe'],
        dogru: 0,
        aciklama: {
          dogru: 'Fotovoltaik hücrede ışık yarı iletkende elektron hareketi başlatır; doğrudan elektrik üretir.',
          yanlis: 'Isı üreten güneş kolektörüdür. Güneş pili ışığı doğrudan elektriğe çevirir.',
        },
        kart: 2,
      },
    ]),
  ]),
])
