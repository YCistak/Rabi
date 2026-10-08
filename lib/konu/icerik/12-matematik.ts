import { kart, konu, program, tema } from '../tip'

/**
 * 12. sınıf Matematik — **2018 programı** (MEB Ortaöğretim Matematik).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor (bkz. `docs/kurallar/konu-takibi.md`). Bu
 * yüzden 9–11'in tersine tema adları Maarif'ten değil 2018 programının ünite
 * adlarından: Diziler, Trigonometri, Türev, İntegral, Analitik Geometri.
 * `maarif.test.ts` bu programı denetlemiyor (iskelette 12 yok).
 *
 * 2018'in 12. sınıf ünitelerinden haritada **zaten kartı olanlar** burada
 * tekrar yazılmadı:
 * - Üstel ve Logaritmik Fonksiyonlar → `mat11-ustel` … `mat11-ustel-log-denklem`
 * - Trigonometrik denklemler → `mat11-trig-denklem`
 * - Analitik düzlemde temel dönüşümler → `mat9-donusum`
 *
 * Kapsam bilerek dar tutuldu (program metni doğrulanamadı, emin olunmayan
 * kazanım yazılmadı): türev ve integral polinom, rasyonel ve köklü
 * fonksiyonlarla; trigonometrik/üstel/logaritmik türev, sonsuzda limit,
 * sonsuz geometrik toplam, dönel cisim hacmi ve iki çemberin durumu yok.
 *
 * Konu sonu soruları ayrı dosyada (`12-matematik-sorular.ts`); hızlı
 * kontroller destelerin içinde.
 */
export const matematik12 = program('matematik', 12, 'Dizilerden integrale, çemberin denklemine', [
  tema('mat12-t1', 'Diziler', [
    konu('mat12-dizi', 'Gerçek Sayı Dizileri', [
      kart(
        'Dizi nedir?',
        'Tanım kümesi pozitif tam sayılar olan fonksiyondur: **f: ℕ⁺ → ℝ**\n- f(n) yerine **aₙ** yazılır, buna genel terim denir.\n- Dizi terimleriyle gösterilir: (aₙ) = (a₁, a₂, a₃, …)',
      ),
      kart(
        'Genel terimden terim bulma',
        'aₙ = 2n + 1 dizisinde n yerine sıra numarası yazılır.\n- a₁ = 3, a₂ = 5, a₁₀ = 21\n- 41 kaçıncı terim? 2n + 1 = 41 → n = 20\nn pozitif tam sayı çıkmazsa sayı dizinin terimi değildir.',
      ),
      kart(
        'Dizi olma şartı',
        'Her n ∈ ℕ⁺ için aₙ tanımlı bir gerçek sayı olmalıdır.\n- aₙ = 1 / (n − 3): n = 3’te tanımsız, dizi değil.\n- aₙ = √(n − 1): her n ≥ 1 için tanımlı, dizi.\n- aₙ = √(5 − n): n = 6’da tanımsız, dizi değil.',
        undefined,
        { not: 'Tek bir n bile sorun çıkarırsa dizi değildir. Paydayı sıfır, kökün içini negatif yapan n’yi ara.' },
      ),
      kart(
        'Sabit dizi',
        'Bütün terimleri aynı olan dizi: **aₙ = c**\naₙ = (3n + 6) / (n + 2) = 3(n + 2) / (n + 2) = 3\nGörünüşü karmaşık olsa da her terimi 3’tür.',
      ),
      kart(
        'Eşit diziler',
        'Her n için aₙ = bₙ ise iki dizi eşittir.\naₙ = (k − 2)n + 5 ve bₙ = 3n + (m + 1) eşitse:\n- **n’nin katsayısı:** k − 2 = 3 → k = 5\n- **Sabit terim:** m + 1 = 5 → m = 4',
      ),
      kart(
        'Artan ve azalan dizi',
        'Ardışık iki terimin farkına bakılır.\n- **aₙ₊₁ − aₙ > 0:** artan dizi\n- **aₙ₊₁ − aₙ < 0:** azalan dizi\naₙ = 2 − 1 / (n + 1): n büyüdükçe çıkarılan küçülür, dizi artandır.',
      ),
      kart(
        'İndirgemeli dizi',
        'Terim, kendinden önceki terimlerle verilir.\na₁ = 2, aₙ₊₁ = 3aₙ − 1\n- a₂ = 3 · 2 − 1 = 5\n- a₃ = 3 · 5 − 1 = 14\n- a₄ = 3 · 14 − 1 = 41',
      ),
      kart(
        'Fibonacci dizisi',
        'a₁ = a₂ = 1, aₙ₊₂ = aₙ₊₁ + aₙ\nTerimler: 1, 1, 2, 3, 5, 8, 13, 21, …\nArdışık terimlerin oranı altın orana (≈ 1,618) yaklaşır.',
      ),
      kart(
        'Koşulu sağlayan terim sayısı',
        'aₙ = 3n − 2 dizisinin kaç terimi 100’den küçük?\n3n − 2 < 100 → n < 34\nn pozitif tam sayı olduğundan n = 1, 2, …, 33: **33 terim**.',
      ),
    ], [], [
      {
        soru: 'aₙ = 4 / (n − 2) bir dizi belirtir mi?',
        siklar: ['Belirtmez', 'Belirtir'],
        dogru: 0,
        aciklama: {
          dogru: 'n = 2’de payda sıfır olur; a₂ tanımsız olduğu için dizi değildir.',
          yanlis: 'Her pozitif tam sayıda tanımlı olmalı. n = 2’de payda sıfır, a₂ yok; bu yüzden dizi değil.',
        },
        kart: 3,
      },
    ]),
    konu('mat12-aritmetik', 'Aritmetik Dizi', [
      kart(
        'Aritmetik dizi',
        'Ardışık terimlerin farkı sabittir: **aₙ₊₁ − aₙ = r** (ortak fark)\n3, 7, 11, 15, … dizisinde r = 4.\n- **r > 0:** artan\n- **r < 0:** azalan\n- **r = 0:** sabit',
      ),
      kart(
        'Genel terim',
        '**aₙ = a₁ + (n − 1) · r**\na₁ = 5, r = 3 ise a₂₀ = 5 + 19 · 3 = 62\nBirinci terimden n’inciye (n − 1) adım atılır.',
      ),
      kart(
        'İki terim arasında',
        '**aₘ = aₖ + (m − k) · r**\na₄ = 10, a₁₀ = 28 ise 6r = 18 → r = 3\nGeri gidilir: a₁ = a₄ − 3r = 10 − 9 = 1',
      ),
      kart(
        'Genel terim doğrusal',
        'aₙ = pn + q biçimindeki her dizi aritmetiktir ve **r = p**.\n- aₙ = 5n − 2: r = 5, a₁ = 3\n- aₙ = n²: farklar 3, 5, 7… değişiyor, aritmetik değil.',
      ),
      kart(
        'Ortadaki terim',
        'Aritmetik dizide her terim, eşit uzaklıktaki iki komşusunun ortalamasıdır.\na, b, c aritmetik ise **2b = a + c**\nx − 1, 2x, x + 7 → 4x = 2x + 6 → x = 3: 2, 6, 10',
      ),
      kart(
        'İndisler toplamı eşitse',
        'm + n = p + k ise **aₘ + aₙ = aₚ + aₖ**\n- a₃ + a₉ = a₅ + a₇ = 2a₆\n- a₂ + a₁₂ = 30 ise a₇ = 15',
      ),
      kart(
        'İlk n terim toplamı',
        '**Sₙ = n · (a₁ + aₙ) / 2**\nAynı toplam: Sₙ = n · [2a₁ + (n − 1)r] / 2\n1 + 2 + … + 100 = 100 · 101 / 2 = 5050',
      ),
      kart(
        'Toplamdan terime',
        'a₁ = S₁ ve n ≥ 2 için **aₙ = Sₙ − Sₙ₋₁**\nSₙ = n² + 2n ise a₁ = 3 ve aₙ = 2n + 1\nSₙ sabit terimsiz ikinci derece ise dizi aritmetiktir.',
      ),
      kart(
        'Terim sayısı',
        '**Terim sayısı = (son − ilk) / r + 1**\n7’den 97’ye 5’er artan dizi: (97 − 7) / 5 + 1 = 19 terim\nToplamı: 19 · (7 + 97) / 2 = 988',
        undefined,
        { not: 'Sondaki +1’i unutma: 1’den 10’a 10 sayı var, 10 − 1 = 9 değil.' },
      ),
      kart(
        'Problem: sıra sıra koltuk',
        'İlk sırada 12 koltuk var, her sıra öncekinden 2 fazla, 15 sıra var.\n- **Son sıra:** a₁₅ = 12 + 14 · 2 = 40\n- **Toplam:** S₁₅ = 15 · (12 + 40) / 2 = 390 koltuk',
      ),
    ], [], [
      {
        soru: 'a₃ = 11 ve a₇ = 23 olan aritmetik dizide ortak fark kaçtır?',
        siklar: ['4', '3'],
        dogru: 1,
        aciklama: {
          dogru: 'İki terim arasında 7 − 3 = 4 adım var: 4r = 12 → r = 3.',
          yanlis: 'Adım sayısı indis farkıdır: 4r = 23 − 11 = 12, yani r = 3.',
        },
        kart: 3,
      },
    ]),
    konu('mat12-geometrik', 'Geometrik Dizi', [
      kart(
        'Geometrik dizi',
        'Ardışık terimlerin oranı sabittir: **aₙ₊₁ / aₙ = r** (ortak çarpan)\n3, 6, 12, 24, … dizisinde r = 2.\nHiçbir terim sıfır olamaz.',
      ),
      kart(
        'Genel terim',
        '**aₙ = a₁ · rⁿ⁻¹**\na₁ = 2, r = 3 ise a₅ = 2 · 3⁴ = 162\nBirinci terimden n’inciye (n − 1) kez r ile çarpılır.',
      ),
      kart(
        'İki terim arasında',
        '**aₘ = aₖ · rᵐ⁻ᵏ**\na₂ = 6, a₅ = 48 ise r³ = 8 → r = 2\nGeri gidilir: a₁ = a₂ / r = 3',
      ),
      kart(
        'Ortak çarpanın işareti',
        '- **a₁ > 0, r > 1:** artan (2, 4, 8, …)\n- **a₁ > 0, 0 < r < 1:** azalan (8, 4, 2, …)\n- **r < 0:** işaret değişir, ne artan ne azalan (1, −2, 4, …)\n- **r = 1:** sabit dizi',
        undefined,
        { not: 'r negatifse terimler bir artı bir eksi gelir. Artan ya da azalan deme.' },
      ),
      kart(
        'Ortadaki terim',
        'a, b, c geometrik ise **b² = a · c**\n4, x, 9 → x² = 36 → x = 6 ya da x = −6\nTerimlerin işareti verilmediyse iki değer de dizi kurar.',
      ),
      kart(
        'İndisler toplamı eşitse',
        'm + n = p + k ise **aₘ · aₙ = aₚ · aₖ**\n- a₂ · a₈ = a₃ · a₇ = a₅²\n- a₁ · a₉ = 36 ve terimler pozitif ise a₅ = 6',
      ),
      kart(
        'İlk n terim toplamı',
        '**Sₙ = a₁ · (rⁿ − 1) / (r − 1)**, r ≠ 1\n1 + 2 + 4 + … + 2⁹ = (2¹⁰ − 1) / (2 − 1) = 1023\nr = 1 ise bütün terimler eşittir: Sₙ = n · a₁',
      ),
      kart(
        'Bileşik faiz bir dizidir',
        '1000 TL yıllık %20 bileşik faizle her yıl 1,2 ile çarpılır.\n1000, 1200, 1440, 1728, …\n3 yıl sonra: 1000 · 1,2³ = 1728 TL',
      ),
      kart(
        'Aritmetik mi geometrik mi?',
        'Fark sabitse aritmetik, oran sabitse geometrik.\n2, 6, 18: oranlar 3, 3 → geometrik\n2, 6, 10: farklar 4, 4 → aritmetik',
        {
          tur: 'tablo',
          basliklar: ['', 'Aritmetik', 'Geometrik'],
          satirlar: [
            ['Sabit olan', 'aₙ₊₁ − aₙ = r', 'aₙ₊₁ / aₙ = r'],
            ['Genel terim', 'a₁ + (n − 1)r', 'a₁ · rⁿ⁻¹'],
            ['Ortadaki', '2b = a + c', 'b² = a · c'],
          ],
        },
      ),
      kart(
        'Karma problem',
        'a, b, c artan aritmetik, toplamı 15; a + 1, b + 3, c + 9 geometrik.\n- **Aritmetik:** b = 5, a = 5 − r, c = 5 + r\n- **Geometrik:** 8² = (6 − r)(14 + r) → r = 2\nDizi 3, 5, 7; geometrik dizi 4, 8, 16.',
      ),
    ], [], [
      {
        soru: 'a₁ = 5 ve r = 2 olan geometrik dizide a₄ kaçtır?',
        siklar: ['40', '80'],
        dogru: 0,
        aciklama: {
          dogru: 'a₄ = a₁ · r³ = 5 · 8 = 40.',
          yanlis: 'Üs n − 1’dir: a₄ = 5 · 2³ = 40. 5 · 2⁴ = 80 beşinci terim olurdu.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('mat12-t2', 'Trigonometri', [
    konu('mat12-toplam-fark', 'Toplam-Fark ve İki Kat Açı Formülleri', [
      kart(
        'Sinüste toplam ve fark',
        '- **sin(a + b)** = sin a · cos b + cos a · sin b\n- **sin(a − b)** = sin a · cos b − cos a · sin b\nsin 75° = sin(45° + 30°) = (√6 + √2) / 4',
      ),
      kart(
        'Kosinüste toplam ve fark',
        '- **cos(a + b)** = cos a · cos b − sin a · sin b\n- **cos(a − b)** = cos a · cos b + sin a · sin b\ncos 15° = cos(45° − 30°) = (√6 + √2) / 4',
        undefined,
        { not: 'Kosinüste işaret ters döner: toplamda eksi, farkta artı. Sinüste işaret aynı kalır.' },
      ),
      kart(
        'Tanjantta toplam ve fark',
        '**tan(a ± b) = (tan a ± tan b) / (1 ∓ tan a · tan b)**\ntan 75° = (1 + √3/3) / (1 − √3/3) = 2 + √3',
      ),
      kart(
        'Açıyı bilinenlere ayır',
        'Özel açıların toplamı ya da farkı olarak yaz.\n- 75° = 45° + 30°, 15° = 45° − 30°\n- 105° = 60° + 45°\ncos 105° = cos 60° cos 45° − sin 60° sin 45° = (√2 − √6) / 4',
      ),
      kart(
        'Formülü tersten tanı',
        'Açılmış hâli görünce formülü geri topla.\n- sin 50° cos 10° + cos 50° sin 10° = sin 60° = √3 / 2\n- cos 70° cos 10° + sin 70° sin 10° = cos 60° = 1 / 2',
      ),
      kart(
        'Üçgende toplam açı',
        'A + B + C = 180° olduğundan:\n- **sin(A + B)** = sin C\n- **cos(A + B)** = −cos C\ncos A = 3/5, cos B = 5/13 ise sin C = 4/5 · 5/13 + 3/5 · 12/13 = 56/65',
      ),
      kart(
        'İki kat açı: sinüs',
        '**sin 2a = 2 · sin a · cos a**\nsin a = 3/5 (a dar açı) → cos a = 4/5\nsin 2a = 2 · 3/5 · 4/5 = 24/25',
      ),
      kart(
        'İki kat açı: kosinüs',
        '**cos 2a = cos²a − sin²a**\n- Yalnız kosinüsle: 2cos²a − 1\n- Yalnız sinüsle: 1 − 2sin²a\nsin a = 3/5 → cos 2a = 1 − 2 · 9/25 = 7/25',
      ),
      kart(
        'İki kat açı: tanjant',
        '**tan 2a = 2 tan a / (1 − tan²a)**\ntan a = 3/4 → tan 2a = (3/2) / (7/16) = 24/7\nKontrol: sin 2a / cos 2a = (24/25) / (7/25) = 24/7',
      ),
      kart(
        'Yarım açı',
        'cos 2a formülünden kare çekilir:\n- **cos²a** = (1 + cos 2a) / 2\n- **sin²a** = (1 − cos 2a) / 2\ncos²15° = (1 + cos 30°) / 2 = (2 + √3) / 4',
      ),
      kart(
        'Sadeleştirmede kalıplar',
        '- **1 + cos 2x** = 2cos²x\n- **1 − cos 2x** = 2sin²x\n- **cos⁴x − sin⁴x** = (cos²x − sin²x)(cos²x + sin²x) = cos 2x\n(1 − cos 2x) / sin 2x = 2sin²x / (2 sin x cos x) = tan x',
      ),
      kart(
        'sin x · cos x çarpımı',
        '**sin x · cos x = sin 2x / 2**\n- sin 15° · cos 15° = sin 30° / 2 = 1/4\n- En büyük değeri 1/2, en küçüğü −1/2\nÇarpım görünce iki kat açıya çevir.',
      ),
    ], [], [
      {
        soru: 'cos(a + b) açılımında ortadaki işaret hangisidir?',
        siklar: ['Artı', 'Eksi'],
        dogru: 1,
        aciklama: {
          dogru: 'cos(a + b) = cos a cos b − sin a sin b: toplamda eksi.',
          yanlis: 'Kosinüste işaret ters döner: cos(a + b) = cos a cos b − sin a sin b.',
        },
        kart: 2,
      },
      {
        soru: 'sin a = 3/5 ve a dar açı ise cos 2a kaçtır?',
        siklar: ['7/25', '24/25'],
        dogru: 0,
        aciklama: {
          dogru: 'cos 2a = 1 − 2sin²a = 1 − 18/25 = 7/25. 24/25 ise sin 2a.',
          yanlis: '24/25, sin 2a’nın değeri. cos 2a = 1 − 2 · 9/25 = 7/25.',
        },
        kart: 8,
      },
    ]),
  ]),
  tema('mat12-t3', 'Türev', [
    konu('mat12-limit', 'Limit ve Süreklilik', [
      kart(
        'Limit fikri',
        'x, a’ya yaklaşırken f(x)’in yaklaştığı değer limittir: **lim (x → a) f(x) = L**\nLimit için f(a)’nın kendisi gerekmez.\nf(a) tanımsız ya da L’den farklı olabilir.',
      ),
      kart(
        'Tabloyla limit',
        'f(x) = (x² − 4) / (x − 2), x = 2’de tanımsız.\n2’ye iki yandan yaklaşınca değerler 4’e yaklaşır: lim (x → 2) f(x) = 4',
        {
          tur: 'tablo',
          basliklar: ['x', 'f(x)', 'Yön'],
          satirlar: [
            ['1,9', '3,9', 'soldan'],
            ['1,99', '3,99', 'soldan'],
            ['2,01', '4,01', 'sağdan'],
            ['2,1', '4,1', 'sağdan'],
          ],
        },
      ),
      kart(
        'Soldan ve sağdan limit',
        '- **x → a⁻:** a’ya soldan (küçük değerlerden) yaklaşma\n- **x → a⁺:** a’ya sağdan (büyük değerlerden) yaklaşma\nLimit vardır ⇔ iki yan limit var ve **eşittir**.\nŞekilde soldan 3, sağdan 1: limit yok.',
        {
          tur: 'koordinat',
          pencere: [-1, 5, -1, 5],
          eksenler: true,
          egriler: [
            { noktalar: [[-1, 0], [2, 3]], kirik: true },
            { noktalar: [[2, 1], [5, 4]], kirik: true },
          ],
          noktalar: [
            { x: 2, y: 3, bos: true },
            { x: 2, y: 1 },
          ],
        },
      ),
      kart(
        'Grafikten okuma',
        'Boş nokta: fonksiyon orada o değeri almıyor. Dolu nokta: f(a) o değer.\nŞekilde lim (x → 1) f(x) = 2 ama f(1) = 3.\nLimit grafiğin yaklaştığı yere, f(1) dolu noktaya bakar.',
        {
          tur: 'koordinat',
          pencere: [-1, 3, -2.5, 4],
          eksenler: true,
          egriler: [{ noktalar: [[-1, -2], [0, 1], [1, 2], [2, 1], [3, -2]] }],
          noktalar: [
            { x: 1, y: 2, bos: true },
            { x: 1, y: 3 },
          ],
        },
      ),
      kart(
        'Polinomda limit',
        'Polinomda limit, değeri yerine koymaktır: **lim (x → a) P(x) = P(a)**\nlim (x → 2) (x² + 3x) = 4 + 6 = 10\nRasyonel fonksiyonda payda sıfır olmuyorsa yine yerine konur.',
      ),
      kart(
        'Limit kuralları',
        'lim f = L ve lim g = M ise:\n- **Toplam:** lim (f ± g) = L ± M\n- **Çarpım:** lim (f · g) = L · M\n- **Bölüm:** lim (f / g) = L / M, M ≠ 0\n- **Sabit:** lim (k · f) = k · L',
      ),
      kart(
        '0/0 belirsizliği',
        'Yerine koyunca 0/0 çıkıyorsa çarpanlara ayır ve sadeleştir.\nlim (x → 3) (x² − 9) / (x − 3) = lim (x → 3) (x + 3) = 6\n0/0 bir sonuç değil, işin henüz bitmediğinin işaretidir.',
        undefined,
        { not: '0/0 görünce "limit yok" deme. Sadeleştir, sonra yeniden yerine koy.' },
      ),
      kart(
        'Köklü ifadede eşlenik',
        'lim (x → 4) (√x − 2) / (x − 4): 0/0\nPay ve paydayı (√x + 2) ile çarp: x − 4 sadeleşir.\nlim (x → 4) 1 / (√x + 2) = 1/4',
      ),
      kart(
        'Parçalı fonksiyonda limit',
        'Kırılma noktasında iki yan limit ayrı hesaplanır.\nf(x) = x² (x < 1), f(x) = 2x + k (x ≥ 1)\n- **Soldan:** x² → 1\n- **Sağdan:** 2x + k → 2 + k\nLimit varsa 1 = 2 + k → k = −1',
      ),
      kart(
        'Mutlak değer ve yan limit',
        'f(x) = |x| / x\n- **x → 0⁻:** x negatif, |x| = −x → limit −1\n- **x → 0⁺:** x pozitif, |x| = x → limit 1\nYan limitler farklı: lim (x → 0) f(x) yoktur.',
      ),
      kart(
        'Süreklilik',
        'f, x = a’da süreklidir ⇔ üç koşul birden:\n- f(a) tanımlı\n- lim (x → a) f(x) var\n- lim (x → a) f(x) = f(a)\nGrafik o noktada kalem kaldırmadan çizilir.',
      ),
      kart(
        'Süreksizlik nasıl olur?',
        '- **Boşluk:** limit var ama f(a) yok ya da farklı\n- **Sıçrama:** soldan ve sağdan limit farklı\n- **Sonsuza kaçma:** payda sıfır olur, dikey asimptot\nHer birinde üç koşuldan en az biri bozulur.',
      ),
      kart(
        'Sürekli yapan değer',
        'f(x) = (x² − 1) / (x − 1) (x ≠ 1), f(1) = k\nlim (x → 1) f(x) = lim (x → 1) (x + 1) = 2\nf sürekli olsun diye **k = 2** seçilir.',
      ),
      kart(
        'Nerede sürekli?',
        '- **Polinom:** her yerde\n- **Rasyonel:** paydayı sıfır yapmayan her yerde\n- **Köklü (çift kök):** tanımlı olduğu aralıkta\nf(x) = 1 / (x² − 4): x = 2 ve x = −2’de süreksiz.',
      ),
    ], [], [
      {
        soru: 'Soldan limit 3, sağdan limit 3 ve f(a) = 5 ise limit kaçtır?',
        siklar: ['3', 'Limit yok'],
        dogru: 0,
        aciklama: {
          dogru: 'Yan limitler eşit, limit 3. f(a) = 5 limiti değil sürekliliği bozar.',
          yanlis: 'Limit için iki yan limitin eşit olması yeter: limit 3. f(a)’nın farklı olması süreksizliktir.',
        },
        kart: 4,
      },
      {
        soru: 'lim (x → 2) (x² − 4) / (x − 2) kaçtır?',
        siklar: ['Tanımsız', '4'],
        dogru: 1,
        aciklama: {
          dogru: '(x − 2)(x + 2) / (x − 2) = x + 2 → 4.',
          yanlis: '0/0 belirsizdir, sonuç değil. Sadeleşince x + 2 kalır ve limit 4 olur.',
        },
        kart: 7,
      },
    ]),
    konu('mat12-turev', 'Anlık Değişim Oranı ve Türev', [
      kart(
        'Ortalama değişim oranı',
        '[a, b] aralığında: **(f(b) − f(a)) / (b − a)**\nf(x) = x², [1, 3]: (9 − 1) / (3 − 1) = 4\nGeometride kesen doğrunun eğimidir.',
      ),
      kart(
        'Anlık değişim oranı',
        'Aralık küçültülünce ortalama oranın limiti:\n**f′(a) = lim (h → 0) [f(a + h) − f(a)] / h**\nKonum fonksiyonunda bu limit anlık hızdır.',
      ),
      kart(
        'Tanımla türev',
        'f(x) = x², a = 3\n[(3 + h)² − 9] / h = (6h + h²) / h = 6 + h\nh → 0 iken limit 6: **f′(3) = 6**',
      ),
      kart(
        'Teğetin eğimi',
        'f′(a), grafiğe (a, f(a)) noktasında çizilen teğetin eğimidir.\nf(x) = x² için f′(1) = 2: (1, 1)’deki teğet y = 2x − 1.',
        {
          tur: 'koordinat',
          pencere: [-2, 3, -2, 4],
          eksenler: true,
          egriler: [
            { noktalar: [[-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4]], ad: 'y = x²' },
            { noktalar: [[-0.5, -2], [2.5, 4]], kirik: true, kesik: true, renk: 'ikincil', ad: 'teğet' },
          ],
          noktalar: [{ x: 1, y: 1, ad: '(1, 1)' }],
        },
      ),
      kart(
        'Türevlenebilme',
        'f′(a) varsa f, a’da süreklidir; tersi her zaman doğru değil.\n- **Süreksiz noktada:** türev yok\n- **Sivri noktada:** |x|, x = 0’da sürekli ama soldan eğim −1, sağdan 1',
        undefined,
        { not: 'Süreklilik türev için şart ama yetmez. Sivri köşede grafik kopmaz, yine de türev yoktur.' },
      ),
      kart(
        'Temel kurallar',
        '- **Sabit:** (c)′ = 0\n- **Kuvvet:** (xⁿ)′ = n · xⁿ⁻¹\n- **Katsayı:** (c · f)′ = c · f′\n- **Toplam:** (f ± g)′ = f′ ± g′\n(4x³ − 5x + 2)′ = 12x² − 5',
      ),
      kart(
        'Köklü ve kesirli ifadeler',
        'Önce üslü yaz, sonra kuvvet kuralını uygula.\n- √x = x^(1/2) → (√x)′ = 1 / (2√x)\n- 1/x = x⁻¹ → (1/x)′ = −1 / x²',
      ),
      kart(
        'Çarpım kuralı',
        '**(f · g)′ = f′ · g + f · g′**\n(x² · (3x + 1))′ = 2x(3x + 1) + x² · 3 = 9x² + 2x\nKontrol: 3x³ + x²’nin türevi de 9x² + 2x.',
      ),
      kart(
        'Bölüm kuralı',
        '**(f / g)′ = (f′ · g − f · g′) / g²**\n((x + 1) / (x − 1))′ = [(x − 1) − (x + 1)] / (x − 1)² = −2 / (x − 1)²\nPaydaki sıra önemli: önce payın türevi.',
      ),
      kart(
        'Zincir kuralı',
        'Bileşkenin türevi: **(f(g(x)))′ = f′(g(x)) · g′(x)**\n((2x + 1)⁵)′ = 5(2x + 1)⁴ · 2 = 10(2x + 1)⁴\nİçteki fonksiyonun türeviyle çarpmayı unutma.',
      ),
      kart(
        'Mutlak değer ve parçalı',
        'f(x) = |x − 2|\n- **x > 2:** f(x) = x − 2, f′ = 1\n- **x < 2:** f(x) = 2 − x, f′ = −1\nx = 2’de soldan ve sağdan türev farklı: f′(2) yok.',
      ),
      kart(
        'İkinci türev',
        'Türevin türevi: **f″ = (f′)′**\nf(x) = x³ → f′(x) = 3x² → f″(x) = 6x\nKonumun ikinci türevi ivmedir.',
      ),
      kart(
        'Hız ve ivme',
        's(t) = t³ − 6t² + 9t (metre, saniye)\n- **Hız:** v(t) = s′(t) = 3t² − 12t + 9 → v(2) = −3 m/s\n- **İvme:** a(t) = v′(t) = 6t − 12 → a(2) = 0\nv(2) < 0: cisim o an geri gidiyor.',
      ),
      kart(
        'Teğet denklemi',
        'f(x) = x² − 3x, x = 1’deki teğet:\n- **Nokta:** f(1) = −2\n- **Eğim:** f′(x) = 2x − 3 → f′(1) = −1\ny + 2 = −1 · (x − 1) → y = −x − 1',
      ),
      kart(
        'Normal doğru',
        'Teğete değme noktasında dik olan doğru.\n**Normalin eğimi = −1 / f′(a)**\nÖnceki örnekte teğet eğimi −1, normal eğimi 1: y = x − 3',
      ),
    ], [], [
      {
        soru: 'f(x) = x³ − 2x için f′(2) kaçtır?',
        siklar: ['10', '4'],
        dogru: 0,
        aciklama: {
          dogru: 'f′(x) = 3x² − 2 → f′(2) = 12 − 2 = 10.',
          yanlis: '4, f(2) = 8 − 4’ün değeri. Türev f′(x) = 3x² − 2, f′(2) = 10.',
        },
        kart: 6,
      },
      {
        soru: '((x² + 1)³)′ hangisidir?',
        siklar: ['3(x² + 1)²', '6x(x² + 1)²'],
        dogru: 1,
        aciklama: {
          dogru: 'Zincir kuralı: 3(x² + 1)² · 2x = 6x(x² + 1)².',
          yanlis: 'İçin türevi eksik: 3(x² + 1)² ile (x² + 1)′ = 2x çarpılır, sonuç 6x(x² + 1)².',
        },
        kart: 10,
      },
    ]),
    konu('mat12-turev-uygulama', 'Türevin Uygulamaları', [
      kart(
        'Artan ve azalan',
        'Bir aralıkta:\n- **f′(x) > 0:** f artan\n- **f′(x) < 0:** f azalan\nTürev, grafiğin o noktadaki yönünü söyler.',
      ),
      kart(
        'İşaret tablosu',
        'f(x) = x³ − 3x → f′(x) = 3x² − 3 = 3(x − 1)(x + 1)\nKökler −1 ve 1; dışlarda artı, aralarında eksi.\nf, (−1, 1)’de azalan, dışarıda artan.',
        {
          tur: 'tablo',
          basliklar: ['Aralık', 'f′(x)', 'f(x)'],
          satirlar: [
            ['x < −1', '+', 'artan'],
            ['−1 < x < 1', '−', 'azalan'],
            ['x > 1', '+', 'artan'],
          ],
        },
      ),
      kart(
        'Yerel maksimum ve minimum',
        'f′ işaret değiştiren noktada ekstremum vardır.\n- **+ → −:** yerel maksimum, x³ − 3x için f(−1) = 2\n- **− → +:** yerel minimum, f(1) = −2',
        {
          tur: 'koordinat',
          pencere: [-2.5, 2.5, -3, 3],
          eksenler: true,
          egriler: [{ noktalar: [[-2, -2], [-1.5, 1.125], [-1, 2], [0, 0], [1, -2], [1.5, -1.125], [2, 2]], ad: 'y = x³ − 3x' }],
          noktalar: [
            { x: -1, y: 2, ad: 'max' },
            { x: 1, y: -2, ad: 'min' },
          ],
        },
      ),
      kart(
        'Kritik nokta',
        'f′(c) = 0 ya da f′(c) tanımsız olan iç nokta.\nHer kritik nokta ekstremum değildir.\nf(x) = x³: f′(0) = 0 ama f′ işaret değiştirmez, ekstremum yok.',
        undefined,
        { not: 'f′(c) = 0 yetmez. İşaret değişiyor mu diye tabloya bak.' },
      ),
      kart(
        'Kapalı aralıkta en büyük, en küçük',
        'Adaylar: kritik noktalar **ve** uç noktalar.\nf(x) = x² − 4x, [0, 5]:\n- **Kritik:** f′ = 2x − 4 = 0 → f(2) = −4\n- **Uçlar:** f(0) = 0, f(5) = 5\nEn büyük 5, en küçük −4.',
      ),
      kart(
        'İkinci türev ve büküm',
        '- **f″ > 0:** grafik çukur yukarı (kollar yukarı)\n- **f″ < 0:** grafik çukur aşağı\nf″ işaret değiştirdiği yer büküm noktasıdır.\nx³ − 3x için f″ = 6x: büküm (0, 0).',
      ),
      kart(
        'İkinci türev testi',
        'f′(c) = 0 olan noktada:\n- **f″(c) > 0:** yerel minimum\n- **f″(c) < 0:** yerel maksimum\nx³ − 3x: f″(1) = 6 > 0 min, f″(−1) = −6 < 0 max',
      ),
      kart(
        'f′ grafiğinden f’yi okumak',
        '- **f′ eksenin üstünde:** f artan\n- **f′ ekseni keserek işaret değiştiriyor:** f’nin ekstremumu\n- **f′ grafiğinin tepe ya da çukur noktası:** f’nin büküm noktası\nVerilen grafik f′ mi f mi, önce ona bak.',
      ),
      kart(
        'Katsayı bulma',
        'f(x) = x³ + ax² + b, x = 2’de yerel ekstremum, f(2) = 1\n- **Ekstremum:** f′(2) = 12 + 4a = 0 → a = −3\n- **Değer:** 8 − 12 + b = 1 → b = 5',
      ),
      kart(
        'Her yerde artan olsun',
        'f(x) = x³ + kx² + 3x her x için artan\nf′(x) = 3x² + 2kx + 3 ≥ 0 her x için → Δ ≤ 0\n4k² − 36 ≤ 0 → **−3 ≤ k ≤ 3**',
      ),
      kart(
        'Optimizasyon',
        '- Büyütülecek ya da küçültülecek niceliği yaz.\n- Koşulla tek değişkene indir.\n- Türevi sıfırla, uç değerleri de dene.\nÇevresi 40 m dikdörtgen: A = x(20 − x) → x = 10, en büyük alan 100 m².',
      ),
      kart(
        'Örnek: üstü açık kutu',
        '12 × 12 cm kartonun köşelerinden x cm’lik kareler kesilip kutu yapılıyor.\nV = x(12 − 2x)² → V′ = (12 − 2x)(12 − 6x)\nV′ = 0 → x = 2 (x = 6 kutu vermez): V = 128 cm³',
      ),
    ], [], [
      {
        soru: 'f′, x = c’de + dan − ye geçiyorsa c’de ne vardır?',
        siklar: ['Yerel maksimum', 'Yerel minimum'],
        dogru: 0,
        aciklama: {
          dogru: 'Önce artıp sonra azalan fonksiyon c’de tepe yapar: yerel maksimum.',
          yanlis: 'Artandan azalana geçiş tepedir; yerel minimum − den + ya geçişte olur.',
        },
        kart: 3,
      },
      {
        soru: 'f(x) = x² − 4x için [0, 5] aralığındaki en büyük değer kaçtır?',
        siklar: ['0', '5'],
        dogru: 1,
        aciklama: {
          dogru: 'Adaylar f(2) = −4, f(0) = 0, f(5) = 5; en büyüğü 5.',
          yanlis: 'Uç noktaların hepsini dene: f(5) = 25 − 20 = 5 > 0.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('mat12-t4', 'İntegral', [
    konu('mat12-belirsiz-integral', 'Belirsiz İntegral', [
      kart(
        'Ters türev',
        'F′(x) = f(x) ise F, f’nin bir ters türevidir.\n**∫ f(x) dx = F(x) + c**\nİntegral, türevi verilen fonksiyonu geri bulmaktır.',
      ),
      kart(
        'Neden + c?',
        'x² + 5 ile x² − 1’in türevi aynıdır: 2x.\nSabit türevde kaybolur, integral onu bilemez.\nBu yüzden her belirsiz integrale + c eklenir.',
        undefined,
        { not: 'Belirsiz integralde + c’yi yazmamak eksik cevaptır. Sabiti bir koşul belirler.' },
      ),
      kart(
        'Kuvvet kuralı',
        '**∫ xⁿ dx = xⁿ⁺¹ / (n + 1) + c**, n ≠ −1\n- ∫ x³ dx = x⁴ / 4 + c\n- ∫ dx = x + c\n- ∫ 5 dx = 5x + c',
      ),
      kart(
        'Toplam ve katsayı',
        '- **Toplam:** ∫ (f ± g) dx = ∫ f dx ± ∫ g dx\n- **Katsayı:** ∫ k · f dx = k · ∫ f dx\n∫ (6x² − 4x + 3) dx = 2x³ − 2x² + 3x + c',
      ),
      kart(
        'Köklü ve kesirli ifadeler',
        'Önce üslü yaz, sonra kuvvet kuralı.\n- ∫ √x dx = ∫ x^(1/2) dx = (2/3) · x^(3/2) + c\n- ∫ 1/x² dx = ∫ x⁻² dx = −1/x + c',
      ),
      kart(
        'Türev ile integral',
        'İkisi birbirini götürür:\n- **Önce integral:** d/dx [∫ f(x) dx] = f(x)\n- **Önce türev:** ∫ f′(x) dx = f(x) + c',
      ),
      kart(
        'Başlangıç koşulu',
        'f′(x) = 4x − 3 ve f(1) = 2\nf(x) = 2x² − 3x + c → 2 − 3 + c = 2 → c = 3\nf(x) = 2x² − 3x + 3',
      ),
      kart(
        'Eğimden eğriye',
        'Eğrinin her noktasındaki teğet eğimi 3x² ve eğri (1, 4)’ten geçiyor.\ny = ∫ 3x² dx = x³ + c → 4 = 1 + c → c = 3\nEğri: y = x³ + 3',
      ),
      kart(
        'Değişken değiştirme',
        '∫ 2x · (x² + 1)³ dx\nu = x² + 1 → du = 2x dx\n∫ u³ du = u⁴ / 4 + c = (x² + 1)⁴ / 4 + c',
      ),
      kart(
        'Doğrusal içli kuvvet',
        '∫ (3x − 1)⁴ dx: u = 3x − 1, du = 3 dx\n= (1/3) · u⁵ / 5 + c = (3x − 1)⁵ / 15 + c\nİçin türevine (3’e) bölmeyi unutma.',
      ),
      kart(
        'Hızdan konuma',
        'Konumun türevi hız, hızın integrali konum.\nv(t) = 6t ve s(0) = 2 ise s(t) = 3t² + c\ns(0) = 2 → c = 2: s(t) = 3t² + 2',
      ),
    ], [], [
      {
        soru: '∫ x⁴ dx hangisidir?',
        siklar: ['4x³ + c', 'x⁵ / 5 + c'],
        dogru: 1,
        aciklama: {
          dogru: 'Üs bir artar, yeni üsse bölünür: x⁵ / 5 + c.',
          yanlis: '4x³, x⁴’ün türevi. İntegralde üs artar: x⁵ / 5 + c.',
        },
        kart: 3,
      },
      {
        soru: 'f′(x) = 2x ve f(0) = 5 ise f(2) kaçtır?',
        siklar: ['9', '4'],
        dogru: 0,
        aciklama: {
          dogru: 'f(x) = x² + c, f(0) = 5 → c = 5; f(2) = 4 + 5 = 9.',
          yanlis: 'Sabit unutulmuş: f(x) = x² + 5, f(2) = 9.',
        },
        kart: 7,
      },
    ]),
    konu('mat12-belirli-integral', 'Belirli İntegral ve Uygulamaları', [
      kart(
        'Alanı dikdörtgenlerle bulmak',
        'Eğrinin altındaki bölge ince dikdörtgenlere bölünür.\nDikdörtgenler inceldikçe alanları toplamı gerçek alana yaklaşır.\nBu toplamın limiti belirli integraldir.',
      ),
      kart(
        'Belirli integral',
        'İntegral hesabın temel teoremi: **∫[a, b] f(x) dx = F(b) − F(a)**\nF, f’nin herhangi bir ters türevi; c sadeleşir.\n∫[1, 3] 2x dx = 3² − 1² = 8',
      ),
      kart(
        'Hesap örneği',
        '∫[0, 2] (3x² − 2x) dx\nTers türev: x³ − x²\n(8 − 4) − (0 − 0) = 4',
      ),
      kart(
        'Özellikler',
        '- **Aynı sınır:** ∫[a, a] f dx = 0\n- **Sınır yer değiştirirse:** ∫[a, b] f dx = −∫[b, a] f dx\n- **Ara nokta:** ∫[a, b] f dx + ∫[b, c] f dx = ∫[a, c] f dx',
      ),
      kart(
        'Parçalı fonksiyonda integral',
        'f(x) = x (x < 1), f(x) = 2 (x ≥ 1)\nİntegral kırılma noktasından bölünür:\n∫[0, 3] f dx = ∫[0, 1] x dx + ∫[1, 3] 2 dx = 1/2 + 4 = 9/2',
      ),
      kart(
        'Mutlak değerli integral',
        '∫[0, 3] |x − 1| dx: içi x = 1’de işaret değiştirir.\n= ∫[0, 1] (1 − x) dx + ∫[1, 3] (x − 1) dx\n= 1/2 + 2 = 5/2',
      ),
      kart(
        'İntegral işaretli alandır',
        'x ekseninin altında kalan bölge eksi sayılır.\n∫[0, 2] (x − 1) dx = 0, oysa taralı alan 1/2 + 1/2 = 1.\nAlan isteniyorsa alttaki parçanın işareti çevrilir.',
        {
          tur: 'koordinat',
          pencere: [-0.5, 2.5, -1.5, 1.5],
          eksenler: true,
          egriler: [
            { noktalar: [[-0.5, -1.5], [2.5, 1.5]], kirik: true, ad: 'y = x − 1' },
            { noktalar: [[0, 0], [0, -1], [1, 0]], kapali: true, kirik: true, renk: 'ikincil' },
            { noktalar: [[1, 0], [2, 1], [2, 0]], kapali: true, kirik: true, renk: 'soluk' },
          ],
        },
        { not: 'İntegral ve alan aynı şey değil. Grafik eksenin altına iniyorsa sınırları oradan böl.' },
      ),
      kart(
        'Eğri ile x ekseni arası alan',
        'Alan = ∫|f(x)| dx; f’nin işaret değiştirdiği yerden bölünür.\ny = x² − 4x, [0, 4] aralığında eksenin altında.\n∫[0, 4] (x² − 4x) dx = 64/3 − 32 = −32/3 → alan 32/3',
      ),
      kart(
        'İki eğri arasındaki alan',
        '**Alan = ∫[a, b] (üstteki − alttaki) dx**\ny = x ve y = x² 0 ile 1’de kesişir; arada y = x üstte.\n∫[0, 1] (x − x²) dx = 1/2 − 1/3 = 1/6',
        {
          tur: 'koordinat',
          pencere: [-0.2, 1.3, -0.2, 1.3],
          eksenler: true,
          egriler: [
            { noktalar: [[-0.2, -0.2], [1.3, 1.3]], kirik: true, ad: 'y = x' },
            { noktalar: [[0, 0], [0.25, 0.0625], [0.5, 0.25], [0.75, 0.5625], [1, 1], [1.1, 1.21]], ad: 'y = x²', renk: 'ikincil' },
          ],
          noktalar: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
          ],
        },
      ),
      kart(
        'Sınırlar kesişimden gelir',
        'y = x² ile y = x + 2 arasındaki alan:\nx² = x + 2 → x = −1 ya da x = 2\n∫[−1, 2] (x + 2 − x²) dx = 10/3 − (−7/6) = 9/2',
      ),
      kart(
        'Simetri kısayolu',
        '- **Tek fonksiyon** (f(−x) = −f(x)): ∫[−a, a] f dx = 0\n- **Çift fonksiyon** (f(−x) = f(x)): ∫[−a, a] f dx = 2 · ∫[0, a] f dx\n∫[−2, 2] x³ dx = 0, ∫[−1, 1] x² dx = 2/3',
      ),
      kart(
        'Üst sınırı değişken integral',
        '**d/dx ∫[a, x] f(t) dt = f(x)**\nF(x) = ∫[1, x] (t² + 1) dt ise F′(x) = x² + 1, F′(2) = 5\nAlt sınır sabitse türevi sonucu etkilemez.',
      ),
      kart(
        'Hızdan alınan yol',
        'Hız hep pozitifse alınan yol hızın integralidir.\nv(t) = 3t² m/s ise ilk 2 saniyede:\n∫[0, 2] 3t² dt = 2³ − 0 = 8 metre',
      ),
    ], [], [
      {
        soru: '∫[0, 3] x² dx kaçtır?',
        siklar: ['9', '27'],
        dogru: 0,
        aciklama: {
          dogru: 'Ters türev x³ / 3: 27/3 − 0 = 9.',
          yanlis: '27, x³’ün değeri; üçe bölmek gerekir: ∫[0, 3] x² dx = 27/3 = 9.',
        },
        kart: 2,
      },
      {
        soru: 'y = x ile y = x² arasında, 0 ile 1 arasındaki alan kaçtır?',
        siklar: ['1/2', '1/6'],
        dogru: 1,
        aciklama: {
          dogru: '∫[0, 1] (x − x²) dx = 1/2 − 1/3 = 1/6.',
          yanlis: '1/2 yalnızca y = x’in altındaki alan; y = x²’nin altındaki 1/3 çıkarılır: 1/6.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('mat12-t5', 'Analitik Geometri', [
    konu('mat12-cember', 'Çemberin Analitik İncelenmesi', [
      kart(
        'Çemberin denklemi',
        'Merkezi M(a, b), yarıçapı r olan çember:\n**(x − a)² + (y − b)² = r²**\nÇember üstündeki her nokta M’ye r uzaklıktadır.',
        {
          tur: 'koordinat',
          pencere: [-1, 5, -2, 4],
          eksenler: true,
          cemberler: [{ x: 2, y: 1, r: 2 }],
          noktalar: [{ x: 2, y: 1, ad: 'M(2, 1)' }],
          egriler: [{ noktalar: [[2, 1], [4, 1]], kirik: true, kesik: true, renk: 'ikincil' }],
          etiketler: [{ x: 3, y: 1.4, ad: 'r = 2' }],
        },
      ),
      kart(
        'Merkezil çember',
        'Merkez orijinse: **x² + y² = r²**\nx² + y² = 25 çemberinin üstünde:\n- (3, 4): 9 + 16 = 25\n- (−5, 0): 25 + 0 = 25',
      ),
      kart(
        'Genel denklem',
        '**x² + y² + Dx + Ey + F = 0**\n- **Merkez:** M(−D/2, −E/2)\n- **Yarıçap:** r = √(D² + E² − 4F) / 2\nx² + y² − 4x + 6y − 3 = 0 → M(2, −3), r = √64 / 2 = 4',
      ),
      kart(
        'Çember belirtme şartı',
        '- x² ile y²’nin katsayıları eşit olmalı.\n- xy’li terim olmamalı.\n- D² + E² − 4F > 0 olmalı.\nBu ifade 0 ise denklem tek nokta, negatifse boş küme belirtir.',
        undefined,
        { not: 'Denklem çembere benziyor diye çember sanma. D² + E² − 4F’nin pozitif olduğunu kontrol et.' },
      ),
      kart(
        'Tam kareye tamamlama',
        'x² + y² + 2x − 8y + 8 = 0\n(x² + 2x + 1) + (y² − 8y + 16) = −8 + 1 + 16\n(x + 1)² + (y − 4)² = 9 → M(−1, 4), r = 3',
      ),
      kart(
        'Eksenlere teğet çember',
        'Merkez M(a, b) ise:\n- **x eksenine teğet:** r = |b|\n- **y eksenine teğet:** r = |a|\n- **İkisine birden:** |a| = |b| = r\nM(3, −2) ve x eksenine teğet → r = 2',
      ),
      kart(
        'Noktanın konumu',
        'd = |MP| ile r karşılaştırılır.\n- **d < r:** nokta çemberin içinde\n- **d = r:** nokta çemberin üstünde\n- **d > r:** nokta çemberin dışında\nx² + y² = 25 ve P(3, 5): 34 > 25 → dışarıda',
      ),
      kart(
        'Doğru ile çember',
        'Merkezin doğruya uzaklığı d = |ax₀ + by₀ + c| / √(a² + b²)\n- **d < r:** doğru çemberi iki noktada keser\n- **d = r:** doğru çembere teğettir\n- **d > r:** ortak nokta yok',
      ),
      kart(
        'Kesişim noktalarını bul',
        'Doğruyu çember denkleminde yerine yaz.\nx² + y² = 25, y = x + 1 → x² + x − 12 = 0 → x = 3 ya da −4\nNoktalar (3, 4) ve (−4, −3); Δ > 0 olduğu için kesen.',
      ),
      kart(
        'Teğet doğrusu',
        'x² + y² = r² çemberine üstündeki (x₀, y₀) noktasında teğet:\n**x₀x + y₀y = r²**\nx² + y² = 10 çemberine (3, 1)’de teğet: 3x + y = 10',
      ),
      kart(
        'Teğet parçasının uzunluğu',
        'Dışarıdaki P’den çizilen teğet parçası: **√(|MP|² − r²)**\nYarıçap teğete dik olduğu için Pisagor’dan gelir.\nx² + y² = 9, P(5, 0): √(25 − 9) = 4',
      ),
      kart(
        'En yakın ve en uzak nokta',
        'Dışarıdaki P için çember üstündeki noktalara:\n- **En kısa uzaklık:** |MP| − r\n- **En uzun uzaklık:** |MP| + r\nx² + y² = 4, P(6, 8): |MP| = 10 → 8 ve 12',
      ),
    ], [], [
      {
        soru: '(x − 1)² + (y + 2)² = 9 çemberinin merkezi hangisidir?',
        siklar: ['(1, −2)', '(−1, 2)'],
        dogru: 0,
        aciklama: {
          dogru: '(x − a)² + (y − b)² kalıbında a = 1, b = −2.',
          yanlis: 'Parantezdeki işaret ters okunur: x − 1 → a = 1, y + 2 → b = −2.',
        },
        kart: 1,
      },
      {
        soru: 'Merkezin doğruya uzaklığı yarıçapa eşitse doğru nedir?',
        siklar: ['Kesen', 'Teğet'],
        dogru: 1,
        aciklama: {
          dogru: 'd = r olduğunda doğru çembere tek noktada değer: teğet.',
          yanlis: 'Kesen için d < r gerekir. d = r iken tek ortak nokta var: teğet.',
        },
        kart: 8,
      },
    ]),
  ]),
])
