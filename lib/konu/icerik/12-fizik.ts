import { kart, konu, program, tema } from '../tip'

/**
 * 12. sınıf Fizik — **2018 programı** (MEB Ortaöğretim Fizik, 12. sınıf).
 *
 * Maarif Modeli'nin 12. sınıfı yayımlanmadı; bugünün 12. sınıfları ve
 * mezunlar 2018 programını görüyor (bkz. `docs/kurallar/konu-takibi.md`). Tema
 * adları 2018 programının ünite adları: Çembersel Hareket, Basit Harmonik
 * Hareket, Dalga Mekaniği, Atom Fiziğine Giriş ve Radyoaktivite, Modern
 * Fizik, Modern Fiziğin Teknolojideki Uygulamaları. `maarif.test.ts` bu
 * programı denetlemiyor (iskelette 12 yok).
 *
 * 2018'in 12. sınıf konularından haritada **zaten kartı olan** burada
 * tekrar yazılmadı:
 * - Düzgün çembersel hareket (periyot, merkezcil kuvvet, virajlar, düşey
 *   çember) → `fzk11-cembersel`
 *
 * Basit sarkaç ve yay sarkacının periyodu `fzk10-periyodik`te de var; BHH
 * destesi onu konum-hız-ivme ilişkisi ve yay bağlamayla birlikte, 2018'in
 * istediği bütünlükte anlatıyor. Program "matematiksel hesaplamalara
 * girilmez" dediği yerlerde (eylemsizlik momenti, girişim, görelilik,
 * Compton) kartlar bağıntıyı yalnız değişkenlerin ilişkisi için veriyor.
 * Program metni: MEB 2018 Ortaöğretim Fizik Dersi Öğretim Programı, 12.1–12.6.
 *
 * Konu sonu soruları ayrı dosyada (`12-fizik-sorular.ts`); hızlı kontroller
 * destelerin içinde.
 */
export const fizik12 = program('fizik', 12, 'Dönen tekerden lazere', [
  tema('fzk12-t1', 'Çembersel Hareket', [
    konu('fzk12-donerek-oteleme', 'Dönerek Öteleme Hareketi', [
      kart(
        'Öteleme ve dönme',
        '- **Öteleme:** cismin bütün noktaları aynı yönde, aynı yolu alır (buzda kayan kutu).\n- **Dönme:** noktalar sabit bir eksen çevresinde çember çizer (vantilatör pervanesi).',
      ),
      kart(
        'Dönerek öteleme',
        'Yuvarlanan teker hem kendi ekseni çevresinde döner hem ilerler.\nKaymadan yuvarlanmada merkezin hızı **v = ω · r** olur.\nBir tam turda teker çevresi kadar, yani **2πr** yol alır.',
      ),
      kart(
        'Tekerin noktalarının hızı',
        'Kaymadan yuvarlanan tekerde yere göre hızlar:\n- **Yere değen nokta:** o an durur, hızı 0\n- **Merkez:** v\n- **En üst nokta:** 2v',
        {
          tur: 'koordinat',
          pencere: [-2.2, 3.2, -0.45, 2.86],
          eksenler: false,
          cemberler: [{ x: 0, y: 1, r: 1 }],
          egriler: [
            {
              noktalar: [
                [-2, 0],
                [3, 0],
              ],
              kirik: true,
              renk: 'soluk',
            },
            {
              noktalar: [
                [0, 2],
                [2, 2],
              ],
              kirik: true,
              ok: true,
              ad: '2v',
            },
            {
              noktalar: [
                [0, 1],
                [1, 1],
              ],
              kirik: true,
              ok: true,
              renk: 'ikincil',
              ad: 'v',
            },
          ],
          noktalar: [{ x: 0, y: 0, ad: 'v = 0' }],
        },
      ),
      kart(
        'Eylemsizlik momenti',
        'Cismin dönme hareketindeki değişime gösterdiği dirençtir (I).\nKütleye ve kütlenin **dönme eksenine uzaklığına** bağlıdır.\nNoktasal kütle için **I = m · r²**',
      ),
      kart(
        'Aynı kütle, farklı dağılım',
        'Kütlesi ve yarıçapı aynı üç cisim:\n- **Çember (halka):** I = m · r²\n- **Dolu disk:** I = ½ · m · r²\n- **Dolu küre:** I = ⅖ · m · r²\nKütle kenara toplandıkça I büyür.',
      ),
      kart(
        'Dönme kinetik enerjisi',
        'Dönen cismin kinetik enerjisi: **E = ½ · I · ω²**\nÖteleme enerjisindeki (½mv²) kütlenin yerini I, hızın yerini ω alır.',
      ),
      kart(
        'Yuvarlanan cismin enerjisi',
        'Dönerek öteleme yapan cismin toplam kinetik enerjisi iki parçadır:\n**E = ½ · m · v² + ½ · I · ω²**\nAynı hızda yuvarlanan teker, aynı hızda kayan kutudan fazla enerji taşır.',
      ),
      kart(
        'Eğik düzlem yarışı',
        'Aynı yükseklikten kaymadan yuvarlanan cisimlerde potansiyel enerji öteleme ve dönme arasında paylaşılır.\nDönmeye az enerji ayıran hızlı iner: **dolu küre → disk → halka**',
        undefined,
        { not: 'Yarışı kütle ya da yarıçap değil, kütlenin dağılımı belirler. Aynı biçimdeki iki cisim birlikte iner.' },
      ),
    ], [], [
      {
        soru: 'Kaymadan yuvarlanan tekerin en üst noktasının yere göre hızı nedir?',
        siklar: ['2v', 'v'],
        dogru: 0,
        aciklama: {
          dogru: 'Üst noktada dönme hızı ilerleme hızına eklenir: v + v = 2v.',
          yanlis: 'Merkez v ile gider; en üst noktada buna ωr = v eklenir, sonuç 2v.',
        },
        kart: 3,
      },
    ]),
    konu('fzk12-acisal-momentum', 'Açısal Momentum', [
      kart(
        'Açısal momentum',
        'Dönen cismin dönme hareketinin miktarıdır, **vektörel** bir niceliktir.\n**L = I · ω**, birimi kg · m² / s',
      ),
      kart(
        'Çizgisel momentumla ilişkisi',
        'r yarıçaplı çemberde v hızıyla dolanan noktasal cisim için:\n**L = m · v · r** (I = mr², ω = v / r)\nYani açısal momentum, çizgisel momentumun (p = mv) dönme eksenine göre karşılığıdır.',
      ),
      kart(
        'Yönü: sağ el kuralı',
        'Sağ elin dört parmağı dönme yönünde kıvrılır, başparmak **L’nin yönünü** gösterir.\nÜstten bakınca saatin tersine dönen diskin L’si yukarı doğrudur.',
      ),
      kart(
        'Tork açısal momentumu değiştirir',
        '**τ = ΔL / Δt**\nKuvvet çizgisel momentumu değiştirir (F = Δp / Δt); tork da açısal momentumu.\nTork yoksa açısal momentum değişmez.',
      ),
      kart(
        'Tork ve açısal ivme',
        '**τ = I · α**\nNewton’un F = m · a bağıntısının dönmedeki karşılığıdır.\nAynı torkta eylemsizlik momenti büyük olan cisim daha yavaş hızlanır.',
      ),
      kart(
        'Doğrusal ve dönme karşılıkları',
        'Dönmenin her niceliğinin doğrusal hareketten bir eşi vardır.\nBağıntılar aynı kalıptadır: kütle yerine I, hız yerine ω yazılır.',
        {
          tur: 'tablo',
          basliklar: ['Doğrusal', 'Dönme'],
          satirlar: [
            ['hız v', 'açısal hız ω'],
            ['kütle m', 'eylemsizlik momenti I'],
            ['momentum p = mv', 'açısal momentum L = Iω'],
            ['kuvvet F = ma', 'tork τ = Iα'],
          ],
        },
      ),
      kart(
        'Açısal momentumun korunumu',
        'Dış tork sıfırsa açısal momentum sabit kalır:\n**I₁ · ω₁ = I₂ · ω₂**\nEylemsizlik momenti küçülürse açısal hız aynı oranda büyür.',
        undefined,
        { not: 'Korunan L’dir, ω değil. Kütle eksene yaklaşınca I azalır, dönme hızlanır.' },
      ),
      kart(
        'Patenci ve dalgıç',
        '- **Patenci:** kollarını gövdesine çekince I küçülür, daha hızlı döner.\n- **Dalgıç:** havada vücudunu toplayınca takla hızlanır, açınca yavaşlar.',
      ),
      kart(
        'Gezegenler',
        'Güneş’in çekim kuvveti hep Güneş’e doğrudur ve tork yapmaz; gezegenin L’si korunur.\n**m · v · r = sabit:** Güneş’e yakınken r küçük, hız büyüktür.',
      ),
      kart(
        'Atomda açısal momentum',
        'Açısal momentum atom ölçeğinde de fiziksel bir niceliktir.\nBohr modelinde elektronun açısal momentumu yalnız belirli değerler alır: **L = n · h / 2π**',
      ),
    ], [], [
      {
        soru: 'Dış tork yokken eylemsizlik momenti yarıya inerse açısal hız ne olur?',
        siklar: ['Yarıya iner', 'İki katına çıkar'],
        dogru: 1,
        aciklama: {
          dogru: 'L = I · ω sabit; I yarıya inince ω iki katına çıkar.',
          yanlis: 'Korunan I · ω çarpımıdır. I yarıya inerse ω iki katına çıkmalı.',
        },
        kart: 7,
      },
    ]),
    konu('fzk12-kutle-cekim', 'Kütle Çekim Kuvveti', [
      kart(
        'Newton’un kütle çekim yasası',
        '**F = G · m₁ · m₂ / d²**\nG = 6,67 · 10⁻¹¹ N · m² / kg²\nKuvvet kütlelerin çarpımıyla doğru, aradaki uzaklığın karesiyle ters orantılıdır.',
      ),
      kart(
        'Etki ve tepki',
        'Dünya elmayı ne kadar çekiyorsa elma da Dünya’yı o kadar çeker.\nKuvvetler eşittir ama ivmeler kütleyle ters orantılıdır: Dünya’nın ivmesi ölçülemeyecek kadar küçüktür.',
      ),
      kart(
        'Uzaklık değişirse',
        'F, uzaklığın karesiyle ters orantılıdır.\n- **d iki katına çıkarsa:** F dörtte birine iner\n- **d üç katına çıkarsa:** F dokuzda birine iner\n- **Kütlelerden biri iki katına çıkarsa:** F iki katına çıkar',
      ),
      kart(
        'Yüzeyde çekim ivmesi',
        'Yüzeydeki m kütleli cisim için m · g = G · M · m / R²\n**g = G · M / R²**\ng, düşen cismin kütlesine bağlı değildir; gezegenin kütlesine ve yarıçapına bağlıdır.',
      ),
      kart(
        'Başka gezegende g',
        'Kütlesi Dünya’nın 2, yarıçapı 2 katı olan gezegen:\ng′ = G · 2M / (2R)² = g / 2\nDünya’da g = 10 m/s² ise orada **5 m/s²** olur.',
      ),
      kart(
        'Yükseldikçe g azalır',
        'Merkeze uzaklık r = R + h olmak üzere:\n**g′ = G · M / r²**\nYüzeyden R kadar yükseklikte r = 2R olur: g′ = g / 4',
        undefined,
        { not: 'Uzaklığı yüzeyden değil merkezden ölç. h = R iken r = 2R, g dörtte birine iner.' },
      ),
      kart(
        'Kürenin içi ve dışı',
        'Homojen kürede çekim ivmesi:\n- **İçeride:** merkeze uzaklıkla doğru orantılı, merkezde sıfır\n- **Yüzeyde:** en büyük\n- **Dışarıda:** uzaklığın karesiyle ters orantılı azalır',
        {
          tur: 'koordinat',
          pencere: [0, 3.2, 0, 1.25],
          egriler: [
            {
              noktalar: [
                [0, 0],
                [1, 1],
              ],
              kirik: true,
            },
            {
              noktalar: [
                [1, 1],
                [1.5, 0.444],
                [2, 0.25],
                [2.5, 0.16],
                [3, 0.111],
              ],
            },
          ],
          noktalar: [{ x: 1, y: 1, ad: 'yüzey (R)' }],
          xAd: 'r',
          yAd: 'g',
        },
      ),
      kart(
        'Kütle çekim alanı',
        'Her kütle çevresinde bir kütle çekim alanı oluşturur.\nAlan çizgileri kütlenin merkezine doğru yönelir.\nÇizgilerin sık olduğu yerde alan güçlüdür.',
      ),
      kart(
        'Kütle çekim potansiyel enerjisi',
        '**Eₚ = −G · M · m / r**\nSonsuzda sıfır kabul edilir; cisim yaklaştıkça daha negatif olur.\nmgh yalnız yüzeye yakın, küçük yükseklikler için bir yaklaşımdır.',
      ),
      kart(
        'Bağlanma ve kurtulma',
        'Yüzeydeki cismin bağlanma enerjisi G · M · m / R’dir.\nBu, cismi çekimden kurtarmak için gereken en küçük enerjidir.\nBu enerji hızla verilirse **v(kurtulma) = √(2GM / R)**, Dünya için ≈ 11,2 km/s',
      ),
      kart(
        'Uydular ve Ay',
        'Uydu sürekli Dünya’ya düşer ama yatay hızı yüzünden yüzeye ulaşamaz.\nÇekim kuvveti merkezcil kuvveti sağlar: **v = √(G · M / r)**\nYörünge hızı uydunun kütlesine bağlı değildir.',
      ),
    ], [], [
      {
        soru: 'Kütleler arası uzaklık üç katına çıkarsa çekim kuvveti ne olur?',
        siklar: ['Dokuzda birine iner', 'Üçte birine iner'],
        dogru: 0,
        aciklama: {
          dogru: 'F ∝ 1/d²; d üç katına çıkınca F, 3² = 9’da birine iner.',
          yanlis: 'Uzaklığın karesi önemli: 3² = 9, kuvvet dokuzda birine iner.',
        },
        kart: 3,
      },
      {
        soru: 'Homojen bir kürenin merkezinde çekim ivmesi nasıldır?',
        siklar: ['En büyük', 'Sıfır'],
        dogru: 1,
        aciklama: {
          dogru: 'Merkezde her yönden gelen çekimler birbirini dengeler; g sıfırdır.',
          yanlis: 'İçeride g merkeze uzaklıkla orantılı azalır; merkezde sıfırdır. En büyük değer yüzeydedir.',
        },
        kart: 7,
      },
    ]),
    konu('fzk12-kepler', 'Kepler Kanunları', [
      kart(
        'Gökyüzünü ölçenler',
        '- **Uluğ Bey:** Semerkant’ta rasathane kurdu, yıldız kataloğu içeren zîcini hazırlattı.\n- **Ali Kuşçu:** onun öğrencisi; zîc çalışmasına katıldı, İstanbul’da astronomi öğretti.\n- **Galileo:** teleskopla Jüpiter’in uydularını gözledi.',
      ),
      kart(
        'Gözlemden yasaya',
        'Kepler, Tycho Brahe’nin yıllarca yaptığı Mars gözlemlerini çözümledi.\nYörüngelerin çember olmadığını bularak üç yasasını yazdı (1609 ve 1619).',
      ),
      kart(
        'Birinci yasa: yörüngeler',
        'Gezegenler Güneş çevresinde **elips** yörüngelerde dolanır.\nGüneş elipsin merkezinde değil, **odaklarından birindedir**.',
        {
          tur: 'koordinat',
          pencere: [-2.6, 2.6, -1.6, 1.6],
          eksenler: false,
          egriler: [
            {
              noktalar: [
                [2, 0],
                [1.73, 0.7],
                [1, 1.21],
                [0, 1.4],
                [-1, 1.21],
                [-1.73, 0.7],
                [-2, 0],
                [-1.73, -0.7],
                [-1, -1.21],
                [0, -1.4],
                [1, -1.21],
                [1.73, -0.7],
                [2, 0],
              ],
            },
          ],
          noktalar: [
            { x: 1.43, y: 0, ad: 'Güneş' },
            { x: -1.43, y: 0, bos: true },
          ],
          etiketler: [
            { x: 2.2, y: -0.35, ad: 'günberi', renk: 'ikincil' },
            { x: -2.2, y: -0.35, ad: 'günöte', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'İkinci yasa: eşit alanlar',
        'Güneş’i gezegene birleştiren doğru, **eşit sürelerde eşit alanlar** tarar.\n- **Günberi (Güneş’e en yakın):** gezegen en hızlı\n- **Günöte (en uzak):** gezegen en yavaş',
        undefined,
        { not: 'Eşit olan alanlardır, yaylar değil. Güneş’e yakın yay uzundur, gezegen orada hızlıdır.' },
      ),
      kart(
        'Alanlar yasasının sebebi',
        'Güneş’in çekimi Güneş’e doğrudur ve tork yapmaz; açısal momentum korunur.\n**m · v · r = sabit:** r küçülünce v büyür.',
      ),
      kart(
        'Üçüncü yasa: periyotlar',
        '**T² / r³ = sabit** (r: Güneş’e ortalama uzaklık)\nUzak gezegenin yılı uzundur.\nOrtalama uzaklığı Dünya’nın 4 katı olan gezegen: T² = 4³ = 64, T = **8 yıl**',
      ),
      kart(
        'Sabit neye bağlı?',
        'T² / r³ oranı **dolanılan** cismin kütlesine bağlıdır, dolanan gezegenin kütlesine bağlı değildir.\nGüneş’in gezegenleri için bir değer, Dünya’nın uyduları için başka bir değer alır.',
      ),
      kart(
        'Yalnız gezegenler değil',
        'Ay, yapay uydular ve kuyruklu yıldızlar da bu yasalara uyar.\nHalley Kuyruklu Yıldızı çok basık bir elips izler, yaklaşık 76 yılda bir döner.\nGüneş’e yaklaşınca çok hızlanır.',
      ),
    ], [], [
      {
        soru: 'Gezegen yörüngesinin hangi noktasında en hızlıdır?',
        siklar: ['Güneş’e en uzak noktada', 'Güneş’e en yakın noktada'],
        dogru: 1,
        aciklama: {
          dogru: 'Eşit sürede eşit alan için yakın noktada uzun yay taranır; hız en büyüktür.',
          yanlis: 'Uzak noktada gezegen en yavaştır. Alanlar yasası yakın noktada hızlanmayı gerektirir.',
        },
        kart: 4,
      },
    ]),
  ]),
  tema('fzk12-t2', 'Basit Harmonik Hareket', [
    konu('fzk12-bhh', 'Basit Harmonik Hareket', [
      kart(
        'Basit harmonik hareket',
        'Denge noktası çevresinde, geri çağırıcı kuvvetle yapılan periyodik harekettir.\nKuvvet uzanımla doğru orantılı, ona zıt yönlüdür: **F = −k · x**\nÖrnek: yay sarkacı, küçük açılı sarkaç.',
      ),
      kart(
        'Temel kavramlar',
        '- **Denge noktası:** net kuvvetin sıfır olduğu yer\n- **Uzanım (x):** denge noktasına uzaklık\n- **Genlik (A):** en büyük uzanım\n- **Periyot (T):** bir tam salınımın süresi',
      ),
      kart(
        'Çembersel hareketin gölgesi',
        'Düzgün çembersel hareket yapan cismin bir çap üzerindeki izdüşümü BHH yapar.\nÇemberin yarıçapı genliğe, açısal hızı **ω = 2π / T** salınımınkine eşittir.',
      ),
      kart(
        'Konum-zaman grafiği',
        'Uçtan bırakılan cismin konumu: **x = A · cos(ωt)**\nGrafik bir kosinüs eğrisidir: A ile −A arasında gidip gelir, her T sürede kendini tekrarlar.',
        {
          tur: 'koordinat',
          pencere: [0, 6.6, -1.35, 1.35],
          egriler: [
            {
              noktalar: [
                [0, 1],
                [0.785, 0.707],
                [1.571, 0],
                [2.356, -0.707],
                [3.142, -1],
                [3.927, -0.707],
                [4.712, 0],
                [5.498, 0.707],
                [6.283, 1],
              ],
            },
          ],
          etiketler: [
            { x: 0.35, y: 1.18, ad: 'A' },
            { x: 3.142, y: -1.2, ad: '−A' },
            { x: 6.1, y: 1.2, ad: 'T' },
          ],
          xAd: 't',
          yAd: 'x',
        },
      ),
      kart(
        'Hız denge noktasında en büyük',
        '- **Uç noktalarda (x = ±A):** cisim durur, hız sıfır\n- **Denge noktasında (x = 0):** hız en büyük\n**v(maks) = A · ω**',
      ),
      kart(
        'İvme uçlarda en büyük',
        '**a = −ω² · x**\nDenge noktasında kuvvet ve ivme sıfırdır; uçlarda en büyüktür: a(maks) = ω² · A\nİvmenin yönü her an denge noktasına doğrudur.',
        undefined,
        { not: 'İvme ve kuvvet hep denge noktasına bakar. Hızın yönü ise cismin hangi yöne gittiğine bağlıdır.' },
      ),
      kart(
        'Konuma göre özet',
        'Hız ile ivme ters davranır: biri en büyükken öteki sıfırdır.',
        {
          tur: 'tablo',
          basliklar: ['Konum', 'Hız', 'İvme ve kuvvet'],
          satirlar: [
            ['Denge (x = 0)', 'en büyük', 'sıfır'],
            ['Uç (x = ±A)', 'sıfır', 'en büyük'],
          ],
        },
      ),
      kart(
        'Hız ve konum',
        '**v = ω · √(A² − x²)**\nA = 10 cm, ω = 2 rad/s, x = 6 cm:\nv = 2 · √(100 − 36) = 2 · 8 = **16 cm/s**',
      ),
      kart(
        'Enerji dönüşümü',
        'Yay sarkacında toplam enerji sabittir: **E = ½ · k · A²**\n- **Uçta:** enerjinin tamamı yayda (potansiyel)\n- **Dengede:** tamamı kinetik',
      ),
      kart(
        'Yay sarkacının periyodu',
        '**T = 2π · √(m / k)**\nGenliğe ve yer çekimine bağlı değildir; Ay’da da aynıdır.\nKütle 4 katına çıkarsa periyot 2 katına çıkar.',
      ),
      kart(
        'Seri ve paralel yaylar',
        '- **Seri:** 1 / k = 1 / k₁ + 1 / k₂ (sistem yumuşar)\n- **Paralel:** k = k₁ + k₂ (sistem sertleşir)\nÖzdeş iki yay: seride k / 2, paralelde 2k',
      ),
      kart(
        'Yay kesilirse',
        'Yay iki eşit parçaya kesilirse her parçanın sabiti **2k** olur.\nİki parça paralel bağlanırsa eş değer sabit 4k olur, periyot yarıya iner.',
      ),
      kart(
        'Basit sarkaç',
        'Küçük açılarda basit sarkaç da BHH yapar: **T = 2π · √(L / g)**\nKütleye ve genliğe bağlı değildir.\nYukarı ivmelenen asansörde etkin çekim g + a olur, periyot kısalır.',
      ),
    ], [], [
      {
        soru: 'BHH’de cismin hızı nerede en büyüktür?',
        siklar: ['Denge noktasında', 'Uç noktalarda'],
        dogru: 0,
        aciklama: {
          dogru: 'Uçlarda cisim durur; denge noktasından geçerken hız A · ω olur.',
          yanlis: 'Uç noktada cisim döner, hızı sıfırdır. En büyük hız denge noktasındadır.',
        },
        kart: 5,
      },
      {
        soru: 'Özdeş iki yay seri bağlanırsa eş değer yay sabiti ne olur?',
        siklar: ['2k', 'k / 2'],
        dogru: 1,
        aciklama: {
          dogru: '1/k(eş) = 1/k + 1/k = 2/k; seri bağlı sistem yumuşar, sabit k/2 olur.',
          yanlis: '2k paralel bağlamanın sonucudur. Seride 1/k(eş) = 2/k, yani k/2.',
        },
        kart: 11,
      },
    ]),
  ]),
  tema('fzk12-t3', 'Dalga Mekaniği', [
    konu('fzk12-su-girisim', 'Su Dalgalarında Kırınım ve Girişim', [
      kart(
        'Kırınım',
        'Dalganın dar bir aralıktan ya da engelin kenarından geçerken bükülüp arkaya yayılmasıdır.\nKırınımda dalganın hızı, frekansı ve dalga boyu değişmez.',
      ),
      kart(
        'Yarık genişliği ve dalga boyu',
        '- **Yarık dalga boyundan çok genişse:** dalga büyük ölçüde düz geçer, kırınım azdır.\n- **Yarık dalga boyuna yakın ya da dar:** yarık noktasal kaynak gibi davranır, dairesel dalgalar çıkar.',
        undefined,
        { not: 'Kırınımı yarık ya da dalga boyu tek başına değil, ikisinin oranı belirler: λ / w büyüdükçe artar.' },
      ),
      kart(
        'Kırınımı artırmak',
        '- **Yarığı daraltmak:** kırınım artar.\n- **Frekansı azaltmak:** dalga boyu büyür, kırınım artar.\n- **Daha derin bölge:** hız ve dalga boyu büyür, kırınım artar.',
      ),
      kart(
        'Girişim',
        'Aynı ortamda karşılaşan iki dalga üst üste biner.\n- **Tepe + tepe:** daha büyük tepe (yapıcı girişim)\n- **Tepe + çukur:** dalgalar birbirini söndürür (yıkıcı girişim)',
      ),
      kart(
        'Kararlı girişim deseni',
        'Aynı frekansta ve aynı anda tepe üreten iki noktasal kaynak kararlı bir desen oluşturur.\nFrekanslar farklıysa desen sürekli değişir, kararlı çizgiler görülmez.',
      ),
      kart(
        'Katar ve düğüm çizgileri',
        '- **Katar çizgisi:** dalgaların hep birbirini güçlendirdiği noktalar\n- **Düğüm çizgisi:** dalgaların hep birbirini söndürdüğü noktalar\nKaynakların tam ortasından geçen dik çizgi **merkez katardır**.',
      ),
      kart(
        'Yol farkı kuralı',
        'Bir P noktasının kaynaklara uzaklıkları farkına bakılır:\n- **Katar:** |PK₁ − PK₂| = n · λ\n- **Düğüm:** |PK₁ − PK₂| = (n − ½) · λ\nλ = 2 cm, uzaklıklar 9 ve 5 cm: fark 2λ, P 2. katarda.',
      ),
      kart(
        'Desen neyle değişir?',
        '- **Frekans artarsa:** λ küçülür, çizgiler sıklaşır ve sayıları artar.\n- **Kaynaklar arası uzaklık artarsa:** çizgi sayısı artar.',
      ),
      kart(
        'Katarda su durmaz',
        'Katar çizgisi boyunca su en büyük genlikle inip kalkar.\nDüğüm çizgisinde iki dalga birbirini hep söndürür; su orada hiç titreşmez.',
      ),
      kart(
        'Neden önemli?',
        'Kırınım ve girişim dalgalara özgüdür; tanecikler böyle davranmaz.\nIşığın da girişim deseni oluşturması, onun dalga doğasının kanıtı oldu.',
      ),
    ], [], [
      {
        soru: 'Su dalgasının geçtiği yarık daraltılırsa kırınım ne olur?',
        siklar: ['Azalır', 'Artar'],
        dogru: 1,
        aciklama: {
          dogru: 'Yarık dalga boyuna göre daraldıkça dalga daha çok bükülür; kırınım artar.',
          yanlis: 'Dar yarık noktasal kaynak gibi davranır. Yarık daraldıkça kırınım artar.',
        },
        kart: 3,
      },
    ]),
    konu('fzk12-isik-girisim', 'Işıkta Girişim ve Kırınım', [
      kart(
        'Young’ın çift yarık deneyi',
        '1800’lerin başında Thomas Young tek renkli ışığı iki dar yarıktan geçirdi.\nPerdede aydınlık ve karanlık saçaklar sıralandı.\nBu, ışığın dalga gibi girişim yaptığını gösterdi.',
      ),
      kart(
        'Aydınlık ve karanlık saçaklar',
        'Perdedeki noktanın yarıklara uzaklıkları farkı (yol farkı):\n- **Aydınlık saçak:** n · λ (yapıcı girişim)\n- **Karanlık saçak:** (n − ½) · λ (yıkıcı girişim)\nTam ortada yol farkı sıfırdır: merkezî aydınlık saçak.',
      ),
      kart(
        'Saçak aralığı',
        'Ardışık iki aydınlık (ya da iki karanlık) saçak arasındaki uzaklık:\n**Δx = λ · L / d**\nL: yarıkların perdeye uzaklığı, d: iki yarık arası uzaklık',
      ),
      kart(
        'Saçakları genişletmek',
        'Δx = λ · L / d bağıntısından:\n- **Dalga boyu büyürse:** saçaklar genişler (kırmızı ışık)\n- **Perde uzaklaşırsa:** saçaklar genişler\n- **Yarıklar birbirine yaklaşırsa:** saçaklar genişler',
        undefined,
        { not: 'd paydada: yarıklar arası uzaklık büyürse saçaklar daralır. En geniş saçakları kırmızı ışık verir.' },
      ),
      kart(
        'Ortam değişirse',
        'Düzenek kırıcılık indisi n olan sıvıya konursa ışığın dalga boyu λ / n olur.\nSaçak aralığı da aynı oranda küçülür; suda (n = 4/3) saçaklar ¾ oranında daralır.',
      ),
      kart(
        'Beyaz ışıkla deney',
        'Bütün renkler merkezde yapıcı girişim yaptığı için merkezî saçak **beyazdır**.\nYan saçaklar renklidir: dalga boyu küçük mor merkeze yakın, kırmızı dışta kalır.',
      ),
      kart(
        'Tek yarıkta kırınım',
        'Tek dar yarıktan geçen ışık perdede geniş, parlak bir merkez saçak oluşturur.\nİki yanda gittikçe sönükleşen aydınlık saçaklar sıralanır.\nMerkez saçak, yan saçakların yaklaşık iki katı geniştir.',
      ),
      kart(
        'Kırınım desenini genişletmek',
        '- **Yarık daralırsa:** merkez saçak genişler.\n- **Dalga boyu büyürse:** merkez saçak genişler.\n- **Perde uzaklaşırsa:** merkez saçak genişler.',
      ),
      kart(
        'Çift yarık mı, tek yarık mı?',
        'Perdedeki desene bakarak hangi düzenek olduğu anlaşılır.',
        {
          tur: 'tablo',
          basliklar: ['', 'Çift yarık', 'Tek yarık'],
          satirlar: [
            ['Merkez saçak', 'ötekilerle eş genişlikte', 'iki kat geniş'],
            ['Parlaklık', 'saçaklarda yakın', 'dışa doğru hızla azalır'],
          ],
        },
      ),
      kart(
        'Işık bir dalgadır',
        'Kırınım ve girişim yalnız dalga modeliyle açıklanır.\nNewton’un tanecik modeli saçakları açıklayamadı; Young ve Fresnel’in deneyleri dalga modelini güçlendirdi.',
      ),
      kart(
        'Günlük hayatta',
        '- CD ya da DVD yüzeyindeki renkler, sık ve düzenli çizgilerdeki kırınımdan doğar.\n- Kirpiklerin arasından lambaya bakınca görülen ışık çizgileri kırınımdır.',
      ),
      kart(
        'Ses köşeyi döner, ışık dönmez',
        'Sesin dalga boyu santimetrelerle metreler arasındadır, kapı genişliğine yakındır: belirgin kırınır.\nGörünür ışığın dalga boyu yaklaşık 400–700 nm’dir; kapıda kırınımı fark edilmez.',
      ),
    ], [], [
      {
        soru: 'Çift yarıkta yarıklar arası uzaklık azaltılırsa saçak aralığı ne olur?',
        siklar: ['Artar', 'Azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Δx = λL/d; d paydada olduğu için d azalınca saçaklar genişler.',
          yanlis: 'd paydadadır: Δx = λL/d. Yarıklar yaklaşınca saçak aralığı artar.',
        },
        kart: 4,
      },
      {
        soru: 'Tek yarık daraltılırsa merkez aydınlık saçak ne olur?',
        siklar: ['Daralır', 'Genişler'],
        dogru: 1,
        aciklama: {
          dogru: 'Dar yarıkta kırınım artar; ışık daha geniş açıya yayılır, merkez saçak genişler.',
          yanlis: 'Yarık daraldıkça kırınım artar ve merkez saçak genişler.',
        },
        kart: 8,
      },
    ]),
    konu('fzk12-doppler', 'Doppler Olayı', [
      kart(
        'Doppler olayı',
        'Kaynak ile gözlemci birbirine göre hareket ederken algılanan frekans değişir.\nGözlemci, kaynağın yaydığından farklı bir frekans duyar.\nBu olay ses ve ışık dahil bütün dalgalarda görülür.',
      ),
      kart(
        'Yaklaşan ve uzaklaşan kaynak',
        '- **Yaklaşırken:** önündeki dalga tepeleri sıkışır, λ kısalır, frekans yükselir.\n- **Uzaklaşırken:** arkasındaki tepeler açılır, λ uzar, frekans düşer.',
        {
          tur: 'koordinat',
          pencere: [-2.6, 2, -1.41, 1.41],
          eksenler: false,
          cemberler: [
            { x: -0.45, y: 0, r: 1.35, renk: 'soluk' },
            { x: -0.15, y: 0, r: 0.9, renk: 'soluk' },
            { x: 0.15, y: 0, r: 0.45, renk: 'soluk' },
          ],
          egriler: [
            {
              noktalar: [
                [0.35, 0],
                [1.4, 0],
              ],
              kirik: true,
              ok: true,
              ad: 'hareket',
            },
          ],
          noktalar: [{ x: 0.35, y: 0, ad: 'kaynak' }],
          etiketler: [
            { x: 1.35, y: -0.45, ad: 'sık: yüksek f', renk: 'ikincil' },
            { x: -1.75, y: -1.2, ad: 'seyrek: düşük f', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Ambulans sireni',
        'Yaklaşan ambulansın sireni tiz duyulur; yanınızdan geçtiği an birden kalınlaşır.\nAmbulansın sürücüsü sireni hep aynı duyar: kaynağa göre hareket etmez.',
      ),
      kart(
        'Kaynağın frekansı değişmez',
        'Değişen, kaynağın yaydığı frekans değil, **gözlemcinin algıladığı** frekanstır.\nSesin inceliği frekansa, yüksekliği şiddete bağlıdır; Doppler inceliği değiştirir.',
        undefined,
        { not: 'Siren aslında değişmiyor; değişen senin kulağına birim zamanda gelen dalga sayısı.' },
      ),
      kart(
        'Gözlemci hareket ederse',
        'Duran kaynağa doğru giden gözlemci birim zamanda daha çok dalga tepesiyle karşılaşır.\nBu yüzden frekansı yüksek algılar.\nKaynaktan uzaklaşan gözlemci düşük frekans algılar.',
      ),
      kart(
        'Işıkta Doppler',
        '- **Uzaklaşan yıldız ya da galaksi:** ışığın dalga boyu uzar, tayf çizgileri **kırmızıya** kayar.\n- **Yaklaşan:** dalga boyu kısalır, **maviye** kayar.\nUzak galaksilerin kırmızıya kayması evrenin genişlediğini gösterdi.',
      ),
      kart(
        'Radar ile hız ölçümü',
        'Trafik radarı araca dalga gönderir; yansıyan dalganın frekans kayması aracın hızını verir.\nHava durumu radarları yağmur bulutlarının hareketini aynı yolla izler.',
      ),
      kart(
        'Tıpta ve doğada',
        '- **Doppler ultrason:** kan hücrelerinden yansıyan sesin frekans kayması kan akışının hızını ve yönünü gösterir.\n- **Yarasalar:** yankının frekansından avın hareketini algılar.',
      ),
    ], [], [
      {
        soru: 'Yaklaşan kaynaktan gelen sesin algılanan dalga boyu nasıldır?',
        siklar: ['Daha uzun', 'Daha kısa'],
        dogru: 1,
        aciklama: {
          dogru: 'Kaynak dalgaların peşinden gittiği için önündeki tepeler sıkışır; λ kısalır.',
          yanlis: 'Yaklaşan kaynağın önünde tepeler sıkışır. Dalga boyu kısalır, frekans yükselir.',
        },
        kart: 2,
      },
    ]),
    konu('fzk12-em-dalga', 'Elektromanyetik Dalgalar', [
      kart(
        'Maxwell’in teorisi',
        'Maxwell, 1860’larda elektrik ve manyetizmayı tek bir teoride birleştirdi.\nElektromanyetik teorinin kurucusudur.\nTeoriden ışık hızını hesapladı; ışığın elektromanyetik dalga olduğunu gösterdi.',
      ),
      kart(
        'Nasıl oluşur?',
        'Değişen elektrik alan manyetik alan, değişen manyetik alan elektrik alan doğurur.\n**İvmeli hareket eden yükler** EM dalga yayar; antende titreşen elektronlar radyo dalgası üretir.',
      ),
      kart(
        'Yapısı',
        'Elektrik ve manyetik alanlar birbirine ve yayılma doğrultusuna **diktir**.\nBu yüzden EM dalgalar enine dalgadır.\nHertz, 1880’lerin sonunda bu dalgaları laboratuvarda üretip algıladı.',
      ),
      kart(
        'Ortak özellikler',
        '- **Ortam:** gerekmez, boşlukta yayılır.\n- **Hız:** boşlukta hepsi c = 3 · 10⁸ m/s\n- **Yük:** yoktur; elektrik ve manyetik alanda sapmaz.\n- **Davranış:** yansır, kırılır, kırınır, girişim yapar.',
      ),
      kart(
        'Frekans, dalga boyu, enerji',
        '**c = λ · f** ve foton enerjisi **E = h · f**\nFrekans büyüdükçe dalga boyu küçülür, enerji büyür.\n100 MHz radyo dalgası: λ = 3 · 10⁸ / 10⁸ = **3 m**',
      ),
      kart(
        'Spektrum sırası',
        'Frekans ve enerji aşağı doğru artar, dalga boyu azalır.',
        {
          tur: 'katman',
          katmanlar: [
            { ad: 'Radyo', alt: 'm – km' },
            { ad: 'Mikrodalga', alt: 'mm – cm' },
            { ad: 'Kızılötesi', alt: 'µm' },
            { ad: 'Görünür ışık', alt: '400 – 700 nm', renk: 'ana' },
            { ad: 'Morötesi', alt: '10 – 400 nm' },
            { ad: 'X ve gama', alt: '10 nm’den kısa', renk: 'ikincil' },
          ],
          eksenAdi: 'enerji artar',
        },
        { not: 'Dalga boyu kısaldıkça enerji artar. Görünür ışıkta mor, kırmızıdan daha enerjiliktir.' },
      ),
      kart(
        'Radyo ve mikrodalga',
        '- **Radyo dalgaları:** radyo ve televizyon yayını, haberleşme\n- **Mikrodalga:** radar, cep telefonu, kablosuz ağ; fırında yiyecekteki su moleküllerini titreştirip ısıtır',
      ),
      kart(
        'Kızılötesi ve görünür',
        '- **Kızılötesi:** sıcak cisimler yayar; uzaktan kumanda, termal kamera, gece görüş\n- **Görünür ışık:** gözün algıladığı tek bölge; mordan (kısa λ) kırmızıya (uzun λ)',
      ),
      kart(
        'Morötesi',
        'Güneş’ten gelir; ciltte D vitamini yapımına yardım eder, mikropları öldürür, sahte parayı belli eder.\nFazlası cildi yakar ve kanser riskini artırır; büyük kısmını ozon tabakası tutar.',
      ),
      kart(
        'X ve gama ışınları',
        '- **X ışını:** hızlı elektronların hedefte yavaşlamasıyla oluşur; röntgen, havalimanı güvenliği\n- **Gama:** radyoaktif çekirdeklerden çıkar; kanser tedavisi, sterilizasyon\nİkisi de iyonlaştırıcıdır.',
      ),
    ], [], [
      {
        soru: 'Hangisi elektromanyetik dalga yayar?',
        siklar: ['İvmeli hareket eden yük', 'Sabit hızla giden yük'],
        dogru: 0,
        aciklama: {
          dogru: 'EM dalgayı ivmeli yükler yayar; antende ileri geri titreşen elektronlar buna örnek.',
          yanlis: 'Sabit hızlı yük dalga yaymaz. Dalga için yükün hızı değişmeli, yani ivmeli olmalı.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('fzk12-t4', 'Atom Fiziğine Giriş ve Radyoaktivite', [
    konu('fzk12-atom-model', 'Atom Kavramının Tarihsel Gelişimi', [
      kart(
        'Atom fikri',
        '- **Demokritos (MÖ 5. yüzyıl):** madde bölünemeyen küçük parçacıklardan oluşur, adı “atomos”.\n- **Dalton (1800’lerin başı):** her elementin atomları özdeştir; atom bölünmez, içi dolu bir küredir.',
      ),
      kart(
        'Thomson ve elektron',
        'Thomson (1897) katot ışınlarını elektrik ve manyetik alanda saptırarak **e / m** oranını ölçtü ve elektronu buldu.\nModeli: pozitif yüklü küreye gömülü elektronlar (üzümlü kek).',
      ),
      kart(
        'Millikan yağ damlası deneyi',
        'Millikan, elektrik alanda asılı kalan yağ damlalarının yüklerini ölçtü.\nYükler hep **1,6 · 10⁻¹⁹ C**’un tam katlarıydı: elektronun yükü.\ne / m ile birlikte elektronun kütlesi bulundu.',
      ),
      kart(
        'Rutherford saçılması',
        'İnce altın levhaya alfa parçacıkları gönderildi (1909–1911).\n- **Çoğu doğrudan geçti:** atomun büyük kısmı boşluktur.\n- **Çok azı geri döndü:** pozitif yük ve kütle çok küçük bir çekirdekte toplanmıştır.',
      ),
      kart(
        'Rutherford modelinin sorunu',
        'Çekirdek çevresinde dolanan elektron ivmelidir.\nKlasik fiziğe göre ışıyıp enerji kaybetmeli ve çekirdeğe düşmeliydi.\nModel, atomun kararlılığını ve kesikli çizgi tayfını açıklayamadı.',
      ),
      kart(
        'Bohr’un varsayımları',
        'Bohr (1913): elektron yalnız belirli yörüngelerde bulunur ve buralarda ışıma yapmaz.\nSeviye değiştirirken enerji farkı kadar foton salar ya da soğurur:\n**h · f = E(üst) − E(alt)**',
        undefined,
        { not: 'Elektron yörüngede dolanırken değil, seviye değiştirirken ışır. Foton enerjisi iki seviyenin farkıdır.' },
      ),
      kart(
        'Enerji seviyeleri ve yarıçap',
        'Hidrojende n = 1 temel hâldir: en düşük enerji, en küçük yörünge.\n- **Yarıçap:** rₙ = n² · r₁, n büyüdükçe büyür\n- **Enerji:** Eₙ = −13,6 / n² eV, n büyüdükçe sıfıra yaklaşır',
      ),
      kart(
        'İyonlaşma',
        'Elektronu atomdan tamamen koparmak için gereken en küçük enerjiye iyonlaşma enerjisi denir.\nTemel hâldeki hidrojen için **13,6 eV**’tur: elektron E = 0 düzeyine çıkarılır.',
      ),
      kart(
        'Bohr modelinin sınırı',
        'Model yalnız tek elektronlu atom ve iyonlarda (H, He⁺, Li²⁺) başarılıdır.\nÇok elektronlu atomların tayfını açıklayamaz; elektronu kesin bir yörüngede düşünmesi de yanlıştır.',
      ),
      kart(
        'Modern atom teorisi',
        'Elektronun yeri kesin bilinemez; bulunma olasılığının yüksek olduğu bölgelerden (orbital) söz edilir.\nBu olasılık dalgasını **Schrödinger dalga denklemi** verir.\nElektronun durumu kuantum sayılarıyla belirlenir.',
      ),
      kart(
        'Heisenberg belirsizlik ilkesi',
        'Bir parçacığın konumu ve momentumu aynı anda istenen kesinlikte ölçülemez.\nBiri ne kadar kesin bilinirse öteki o kadar belirsizleşir.\nBu, ölçüm aletinin kusuru değil, doğanın özelliğidir.',
      ),
      kart(
        'Türk bilim insanları',
        '- **Feza Gürsey:** temel parçacık fiziğinde simetri kuramları\n- **Asım Orhan Barut:** atom ve parçacıkların kuantum kuramı\n- **Behram Kurşunoğlu:** birleşik alan kuramı ve parçacık fiziği',
      ),
    ], [], [
      {
        soru: 'Alfa parçacıklarının çoğu altın levhadan doğrudan geçti. Bu neyi gösterir?',
        siklar: ['Atomun çoğu boşluktur', 'Atom içi dolu bir küredir'],
        dogru: 0,
        aciklama: {
          dogru: 'Parçacıkların çoğu hiçbir şeye çarpmadan geçti; atomun büyük kısmı boşluk.',
          yanlis: 'İçi dolu kürede parçacıklar saparak yavaşlardı. Çoğunun düz geçmesi atomun boş olduğunu gösterir.',
        },
        kart: 4,
      },
      {
        soru: 'Temel hâldeki hidrojenin iyonlaşma enerjisi kaç eV’tur?',
        siklar: ['10,2 eV', '13,6 eV'],
        dogru: 1,
        aciklama: {
          dogru: 'Elektron E₁ = −13,6 eV’tan E = 0’a çıkarılır; 13,6 eV gerekir.',
          yanlis: '10,2 eV yalnız n = 2’ye uyarır. Koparmak için E = 0’a, yani 13,6 eV gerekir.',
        },
        kart: 8,
      },
    ]),
    konu('fzk12-uyarilma', 'Atomun Uyarılma Yolları', [
      kart(
        'Uyarılma',
        'Temel hâldeki elektronun enerji alıp üst bir seviyeye çıkmasıdır.\nUyarılmış atom kararsızdır; çok kısa sürede foton yayarak alt seviyelere döner.',
      ),
      kart(
        'Fotonla uyarılma',
        'Foton, enerjisi iki seviye arasındaki farka **tam eşitse** soğurulur.\nEşit değilse atom fotonu hiç soğurmaz.\nİyonlaşma enerjisinden büyük foton elektronu koparır, artan enerji kinetik olur.',
      ),
      kart(
        'Elektronla uyarılma',
        'Çarpan elektron, enerjisinin gerektiği kadarını atoma verir, kalanıyla yoluna devam eder.\nBu yüzden enerjisi seviye farkına **eşit ya da büyükse** uyarabilir.',
      ),
      kart(
        'Hidrojenin seviyeleri',
        'Uyarma sorularında temel hâlden olan farklara bakılır.',
        {
          tur: 'tablo',
          basliklar: ['Seviye', 'Enerji (eV)', 'Temelden fark (eV)'],
          satirlar: [
            ['n = 1', '−13,6', '0'],
            ['n = 2', '−3,4', '10,2'],
            ['n = 3', '−1,51', '12,09'],
            ['n = 4', '−0,85', '12,75'],
            ['n = ∞', '0', '13,6'],
          ],
        },
      ),
      kart(
        'Foton ile elektronun farkı',
        'Temel hâldeki hidrojene 11 eV’luk parçacık gelirse:\n- **Foton:** 11 eV hiçbir farka eşit değil, soğurulmaz.\n- **Elektron:** 10,2 eV verir, atomu n = 2’ye uyarır, 0,8 eV ile çıkar.',
        undefined,
        { not: 'Foton ya hep ya hiç verir, elektron yeteni verir. Önce gelenin foton mu elektron mu olduğuna bak.' },
      ),
      kart(
        'Isıyla ve çarpışmayla',
        '- **Isıyla:** sıcaklık artınca hızlanan atomlar çarpışıp birbirini uyarır; kızgın metal ve yıldızlar böyle ışır.\n- **Gaz tüpünde:** hızlandırılan elektronlar gaz atomlarını uyarır (neon lamba).',
      ),
      kart(
        'Geri dönüş: ışıma',
        'Uyarılmış elektron temel hâle tek atlamayla ya da basamak basamak iner.\nn = 3’ten inen elektron üç farklı foton verebilir: 3 → 1, 3 → 2, 2 → 1\nn’inci seviyeden en çok **n(n − 1) / 2** çizgi çıkar.',
      ),
      kart(
        'Yayınma ve soğurma tayfı',
        '- **Yayınma:** ısıtılan gaz yalnız belirli dalga boylarında parlak çizgiler yayar.\n- **Soğurma:** beyaz ışık soğuk gazdan geçince aynı dalga boylarında karanlık çizgiler oluşur.',
      ),
      kart(
        'Tayf parmak izidir',
        'Her elementin çizgileri kendine özgüdür.\nYıldız ışığındaki karanlık çizgilerden yıldızın atmosferindeki elementler bulunur.\nHelyum ilk kez Güneş’in tayfında (1868) fark edildi.',
      ),
      kart(
        'Foton enerjisi ve dalga boyu',
        '**E = h · f = h · c / λ**: enerjisi büyük fotonun dalga boyu kısadır.\nHidrojende n = 1’e inişler morötesi, n = 2’ye inişler görünür ışık verir.',
      ),
    ], [], [
      {
        soru: 'Temel hâldeki hidrojen hangi fotonu soğurabilir?',
        siklar: ['10,2 eV', '11 eV'],
        dogru: 0,
        aciklama: {
          dogru: '10,2 eV, n = 1 ile n = 2 arasındaki farka tam eşit; foton soğurulur.',
          yanlis: '11 eV hiçbir seviye farkına eşit değil. Foton ancak tam farka eşitse soğurulur: 10,2 eV.',
        },
        kart: 4,
      },
    ]),
    konu('fzk12-buyuk-patlama', 'Büyük Patlama ve Evrenin Oluşumu', [
      kart(
        'Büyük patlama teorisi',
        'Evren yaklaşık **13,8 milyar yıl** önce son derece sıcak ve yoğun bir hâlden genişleyerek oluştu.\nPatlama bir noktadan boşluğa saçılma değil, uzayın kendisinin genişlemesidir.',
        undefined,
        { not: 'Büyük patlamayı boşlukta patlayan bir bomba gibi düşünme. Genişleyen, uzayın kendisi.' },
      ),
      kart(
        'Genişleyen evren',
        'Hubble (1929) uzak galaksilerin ışığının kırmızıya kaydığını, yani bizden uzaklaştıklarını gösterdi.\n**Hubble Yasası:** galaksi ne kadar uzaksa o kadar hızlı uzaklaşır.',
      ),
      kart(
        'Kozmik mikrodalga fon ışıması',
        'Penzias ve Wilson (1965) her yönden eşit gelen zayıf bir mikrodalga ışıması buldu.\nBu, evrenin ilk dönemlerinden kalan ışıktır; teorinin en güçlü kanıtlarından biridir.',
      ),
      kart(
        'Hafif elementlerin bolluğu',
        'Evrendeki sıradan maddenin kütlece yaklaşık dörtte üçü hidrojen, dörtte biri helyumdur.\nBu oran, teorinin ilk dakikalar için öngördüğüyle uyumludur.',
      ),
      kart(
        'Başka görüşler',
        'Kararlı durum teorisi evrenin hep aynı kaldığını savundu; fon ışımasının bulunmasıyla gücünü yitirdi.\nEvrenin geleceği (sonsuz genişleme ya da çöküş) bugün de araştırılıyor.',
      ),
      kart(
        'Standart model',
        'Atom altı parçacıkları sınıflandıran kuramdır.\n- **Kuarklar:** proton ve nötronu oluşturur.\n- **Leptonlar:** elektron ve nötrino gibi parçacıklar\n- **Bozonlar:** kuvvetleri taşır (foton, gluon, W ve Z).',
      ),
      kart(
        'Kuarklar',
        'Altı çeşittir: yukarı, aşağı, tılsım, garip, üst, alt. Tek başına bulunmazlar.\n- **Proton:** uud → +⅔ + ⅔ − ⅓ = +1\n- **Nötron:** udd → +⅔ − ⅓ − ⅓ = 0',
      ),
      kart(
        'Leptonlar',
        'Altı leptondan üçü elektron, müon ve tau, üçü de bunların nötrinolarıdır.\nElektron temel parçacıktır, iç yapısı yoktur.\nNötrinolar yüksüzdür ve kütleleri çok küçüktür.',
      ),
      kart(
        'Elektrozayıf birleşme',
        'Abdus Salam, Sheldon Glashow ve Steven Weinberg 1979 Nobel Fizik Ödülü’nü aldı.\nElektromanyetik ve zayıf kuvvetin yüksek enerjide tek kuvvetin iki yüzü olduğunu gösterdiler.',
      ),
      kart(
        'Higgs bozonu',
        'Temel parçacıklara kütle kazandıran Higgs alanının parçacığıdır.\n2012’de CERN’deki Büyük Hadron Çarpıştırıcısı’nda gözlendi.',
      ),
      kart(
        'Maddenin oluşumu',
        'Evren soğudukça parçacıklar birleşip daha büyük yapılar kurdu.\nAğır elementler sonradan yıldızlarda oluştu.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Kuarklar ve gluonlar', alt: 'çok sıcak ilk an' },
            { ad: 'Proton ve nötron', alt: 'ilk saniye' },
            { ad: 'Hafif çekirdekler', alt: 'ilk dakikalar: H, He' },
            { ad: 'Atomlar', alt: 'yaklaşık 380 000 yıl' },
            { ad: 'Yıldız ve galaksiler', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Madde ve antimadde',
        'Her parçacığın kütlesi aynı, yükü zıt bir antiparçacığı vardır: elektronun karşılığı **pozitron**.\nKarşılaştıklarında yok olurlar, kütleleri enerjiye (gama fotonları) dönüşür.',
      ),
    ], [], [
      {
        soru: 'Büyük patlamadan kalan fon ışıması hangi bölgededir?',
        siklar: ['Mikrodalga', 'Gama'],
        dogru: 0,
        aciklama: {
          dogru: 'Evren genişledikçe ilk ışığın dalga boyu uzadı; bugün mikrodalga bölgesinde.',
          yanlis: 'Kalıntı ışık her yönden gelen zayıf bir mikrodalga ışımasıdır; gama değil.',
        },
        kart: 3,
      },
      {
        soru: 'Protonun kuark yapısı hangisidir?',
        siklar: ['udd', 'uud'],
        dogru: 1,
        aciklama: {
          dogru: 'İki yukarı, bir aşağı kuark: ⅔ + ⅔ − ⅓ = +1.',
          yanlis: 'udd’nin yükü sıfırdır, o nötron. Proton uud: ⅔ + ⅔ − ⅓ = +1.',
        },
        kart: 7,
      },
    ]),
    konu('fzk12-radyoaktivite', 'Radyoaktivite', [
      kart(
        'Kararlı ve kararsız çekirdek',
        'Çekirdekteki protonları, elektriksel itmeye karşı güçlü nükleer kuvvet bir arada tutar.\nNötron-proton dengesi uygun çekirdek kararlıdır; değilse ışıma yaparak kararlı hâle geçer.',
      ),
      kart(
        'Radyoaktivite',
        'Kararsız çekirdeğin kendiliğinden ışıma yaparak başka bir çekirdeğe dönüşmesidir.\nBöyle çekirdekler içeren maddeye radyoaktif madde denir.\nSıcaklık, basınç ve kimyasal tepkime bozunmayı etkilemez.',
      ),
      kart(
        'Keşfedenler',
        '- **Röntgen (1895):** X ışınlarını buldu.\n- **Becquerel (1896):** uranyumun kendiliğinden ışıdığını buldu.\n- **Marie ve Pierre Curie:** polonyum ve radyumu keşfetti; Marie Curie fizik ve kimyada iki Nobel aldı.',
      ),
      kart(
        'Alfa bozunması',
        'Çekirdek bir helyum çekirdeği (⁴₂He) salar.\nKütle numarası 4, atom numarası 2 azalır.\n²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He',
      ),
      kart(
        'Beta eksi bozunması',
        'Nötronu fazla olan çekirdekte bir nötron protona dönüşür, bir elektron ve bir antinötrino çıkar.\nAtom numarası 1 artar, kütle numarası değişmez.\n¹⁴₆C → ¹⁴₇N + e⁻',
        undefined,
        { not: 'Çıkan elektron çekirdekte hazır durmuyordu; nötron protona dönüşürken oluşur.' },
      ),
      kart(
        'Beta artı bozunması',
        'Protonu fazla olan çekirdekte bir proton nötrona dönüşür, bir pozitron ve bir nötrino çıkar.\nAtom numarası 1 azalır, kütle numarası değişmez.',
      ),
      kart(
        'Gama ışıması',
        'Uyarılmış çekirdek fazla enerjisini yüksek enerjili foton olarak verir.\nKütle numarası ve atom numarası değişmez, element aynı kalır.\nÇoğunlukla alfa ya da beta bozunmasının ardından gelir.',
      ),
      kart(
        'Bozunma özeti',
        'Tepkimenin iki yanında kütle numaraları toplamı ve atom numaraları toplamı eşittir.',
        {
          tur: 'tablo',
          basliklar: ['Işıma', 'Kütle no (A)', 'Atom no (Z)'],
          satirlar: [
            ['α', '4 azalır', '2 azalır'],
            ['β⁻', 'değişmez', '1 artar'],
            ['β⁺', 'değişmez', '1 azalır'],
            ['γ', 'değişmez', 'değişmez'],
          ],
        },
      ),
      kart(
        'Bozunma zinciri',
        'Çekirdek 2 alfa ve 1 beta eksi yayarsa:\n- **Kütle numarası:** 2 · 4 = 8 azalır\n- **Atom numarası:** −4 + 1 = 3 azalır\n²³⁸₉₂U bu yolla ²³⁰₈₉Ac’ye dönüşür.',
      ),
      kart(
        'Giricilik ve sapma',
        '- **Alfa:** en az girici, kâğıt durdurur; en çok iyonlaştırır.\n- **Beta:** orta, ince alüminyum durdurur.\n- **Gama:** en girici, kalın kurşun ya da beton gerekir.\nElektrik alanda α ve β zıt yönlere sapar, γ sapmaz.',
      ),
      kart(
        'Bozunmada enerji',
        'Bozunma ürünlerinin toplam kütlesi, ilk çekirdeğin kütlesinden biraz azdır.\nBu kütle farkı **E = m · c²** ile enerjiye dönüşür: çıkan parçacıkların kinetik enerjisi ve gama ışını.',
      ),
    ], [], [
      {
        soru: 'Alfa bozunmasında atom numarası nasıl değişir?',
        siklar: ['2 azalır', '4 azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Çıkan ⁴₂He iki proton taşır; Z 2, A 4 azalır.',
          yanlis: '4 azalan kütle numarasıdır. Atom numarası, çıkan iki proton kadar, yani 2 azalır.',
        },
        kart: 4,
      },
      {
        soru: 'Gama ışımasında kütle numarası nasıl değişir?',
        siklar: ['1 artar', 'Değişmez'],
        dogru: 1,
        aciklama: {
          dogru: 'Gama bir fotondur; çekirdekten parçacık çıkmaz, A ve Z aynı kalır.',
          yanlis: 'Gama ışımasında yalnız enerji verilir. Kütle ve atom numarası değişmez.',
        },
        kart: 7,
      },
    ]),
    konu('fzk12-nukleer', 'Fisyon, Füzyon ve Radyasyon', [
      kart(
        'Nükleer fisyon',
        'Ağır bir çekirdeğin (uranyum-235) nötron soğurup iki orta büyüklükte çekirdeğe bölünmesidir.\n2–3 nötron ve büyük bir enerji açığa çıkar; enerji, ürünlerdeki kütle kaybından gelir.',
      ),
      kart(
        'Zincirleme tepkime',
        'Fisyonda çıkan nötronlar başka çekirdekleri böler, tepkime kendini sürdürür.\n- **Kontrolsüz:** atom bombası\n- **Kontrollü:** nükleer reaktör',
      ),
      kart(
        'Nükleer reaktör',
        '- **Yakıt:** zenginleştirilmiş uranyum\n- **Yavaşlatıcı:** su ya da grafit, nötronları yavaşlatır\n- **Kontrol çubukları:** bor ya da kadmiyum, nötron soğurur\n- **Soğutucu:** ısıyı taşır, buharla türbin döner',
      ),
      kart(
        'Santrallerin iki yüzü',
        '- **Artısı:** az yakıttan çok enerji, çalışırken sera gazı salmaz\n- **Eksisi:** uzun ömürlü radyoaktif atık, kaza riski (Çernobil 1986, Fukuşima 2011)\nTürkiye’nin ilk nükleer santrali Mersin Akkuyu’dadır (Akkuyu Nükleer Güç Santrali).',
      ),
      kart(
        'Atom bombası ve barış',
        '1945’te Hiroşima ve Nagazaki’ye atılan atom bombaları yüz binlerce insanın ölümüne yol açtı.\nRadyasyonun etkileri yıllarca sürdü.\nNükleer silahsızlanma dünya barışı için önemlidir.',
      ),
      kart(
        'Nükleer füzyon',
        'Hafif çekirdeklerin birleşip daha ağır bir çekirdek oluşturmasıdır.\nDöteryum + trityum → helyum + nötron + enerji\nÇekirdekler arasındaki itmeyi yenmek için milyonlarca derece sıcaklık gerekir.',
      ),
      kart(
        'Yıldızların enerjisi',
        'Güneş’in merkezinde hidrojen çekirdekleri füzyonla helyuma dönüşür; kütle farkı ışık ve ısı olarak yayılır.\nYeryüzünde füzyonla enerji üretme çalışmaları (ITER) deneme aşamasındadır.',
      ),
      kart(
        'Fisyon ve füzyon',
        'İkisinde de ürünlerin kütlesi azalır, fark enerjiye dönüşür.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fisyon', 'Füzyon'],
          satirlar: [
            ['Çekirdek', 'ağır olan bölünür', 'hafifler birleşir'],
            ['Örnek', 'nükleer santral', 'Güneş'],
            ['Koşul', 'yavaş nötron', 'çok yüksek sıcaklık'],
          ],
        },
        { not: 'Enerji iki tepkimede de kütle kaybından gelir. Ayıran, çekirdeğin bölünmesi mi birleşmesi mi.' },
      ),
      kart(
        'İyonlaştırıcı radyasyon',
        'Atomdan elektron koparabilecek enerjideki ışımadır: alfa, beta, gama ve X ışını.\nHücrede DNA’ya zarar verebilir; yüksek doz yanık, kanser ve kalıtsal hasar yapar.\nRadyo, mikrodalga ve görünür ışık iyonlaştırıcı değildir.',
      ),
      kart(
        'Radyasyon kaynakları',
        '- **Doğal:** kozmik ışınlar, topraktaki uranyum, radon gazı, vücuttaki potasyum-40\n- **Yapay:** röntgen ve tomografi, nükleer tıp\nRadon kapalı alanda birikir; havalandırma önemlidir.',
      ),
      kart(
        'Korunma ve faydalı kullanım',
        'Korunma: kaynağın yanında **az kal**, ondan **uzak dur**, araya **zırh** (kurşun, beton) koy.\nFaydası: kanser tedavisi, tıbbi aletlerin ve gıdanın ışınlanarak mikroptan arındırılması.',
      ),
    ], [], [
      {
        soru: 'Nükleer reaktörde kontrol çubuklarının görevi nedir?',
        siklar: ['Nötron soğurmak', 'Nötronları yavaşlatmak'],
        dogru: 0,
        aciklama: {
          dogru: 'Bor ya da kadmiyum çubuklar nötron yutar; içeri itildikçe tepkime yavaşlar.',
          yanlis: 'Yavaşlatma suyun ya da grafitin işi. Kontrol çubukları nötron soğurarak tepkimeyi ayarlar.',
        },
        kart: 3,
      },
      {
        soru: 'Güneş’in enerjisi hangi tepkimeden gelir?',
        siklar: ['Fisyon', 'Füzyon'],
        dogru: 1,
        aciklama: {
          dogru: 'Güneş’te hidrojen çekirdekleri birleşip helyum oluşturur: füzyon.',
          yanlis: 'Güneş’te çekirdekler bölünmez, birleşir. Hidrojenden helyum üreten tepkime füzyondur.',
        },
        kart: 7,
      },
    ]),
  ]),
  tema('fzk12-t5', 'Modern Fizik', [
    konu('fzk12-gorelilik', 'Özel Görelilik', [
      kart(
        'Esir arayışı',
        '19. yüzyılda fizikçiler ışığın da ses gibi bir ortamda, “esir”de yayıldığını düşünüyordu.\nDünya esirin içinde hareket ediyorsa ışığın hızı yöne göre farklı ölçülmeliydi.',
      ),
      kart(
        'Michelson–Morley deneyi',
        '1887’de girişimölçerde ışık birbirine dik iki kola ayrıldı, aynalardan yansıtılıp yeniden birleştirildi.\nDüzenek döndürülünce girişim saçaklarının kayması bekleniyordu.',
      ),
      kart(
        'Deneyin sonucu',
        'Beklenen kayma görülmedi: ışığın hızı her yönde aynıydı, esir yoktu.\nDeney farklı koşullarda, farklı bilim insanlarınca defalarca tekrarlandı; sonuç değişmedi.',
        undefined,
        { not: 'Olumsuz sonuç da bir sonuçtur. Beklenen kaymanın görülmemesi, esir fikrini çürüttü.' },
      ),
      kart(
        'Einstein’ın postülaları',
        'Einstein (1905) özel göreliliği iki postülaya dayandırdı:\n- Fizik yasaları bütün eylemsiz (sabit hızlı) gözlem çerçevelerinde aynıdır.\n- Işığın boşluktaki hızı, kaynağın ve gözlemcinin hızından bağımsız olarak herkes için c’dir.',
      ),
      kart(
        'Işık hızı toplanmaz',
        '0,5c ile giden roketin önüne yaktığı ışık, yerdeki gözlemciye göre 1,5c değil **c** hızındadır.\nKütleli hiçbir cisim boşlukta ışık hızına ulaşamaz.',
      ),
      kart(
        'Zaman genişlemesi',
        'Gözlemciye göre hareket eden saat daha yavaş işler.\nSaatle birlikte hareket edenin ölçtüğü süre (**öz zaman**) en kısadır.\nEtki ancak ışık hızına yakın hızlarda belirgindir.',
      ),
      kart(
        'Müonlar yere nasıl ulaşır?',
        'Atmosferin üst katmanlarında oluşan müonların ömrü çok kısadır; klasik hesapla yere ulaşamamalıydılar.\nIşığa yakın hızla gittikleri için Dünya’dan bakınca zamanları yavaşlar, çoğu yere ulaşır.',
      ),
      kart(
        'Uzunluk kısalması',
        'Hareket eden cismin hareket doğrultusundaki boyu, duran gözlemciye kısa görünür.\nHarekete dik boyutlar değişmez.\nCisimle birlikte hareket eden ölçer **öz uzunluğu**, yani en uzun değeri.',
      ),
      kart(
        'Kütle-enerji eşdeğerliği',
        '**E = m · c²**\nKütle de bir enerji biçimidir; çok küçük bir kütle çok büyük bir enerjiye karşılık gelir.\n1 g kütlenin tamamı enerjiye dönüşse 10⁻³ · (3 · 10⁸)² = 9 · 10¹³ J açığa çıkar.',
      ),
      kart(
        'Eşdeğerliğin kanıtları',
        '- Nükleer tepkimelerde ürünlerin kütlesi azalır, fark enerji olarak çıkar.\n- Madde ile antimadde karşılaşınca kütlenin tamamı gama ışınına dönüşür.',
      ),
      kart(
        'Görelilik günlük hayatta',
        'GPS uydularının saatleri, hareketleri ve yükseklikleri yüzünden yerdeki saatlerden farklı işler.\nBu göreli fark düzeltilmeseydi konum hatası her gün kilometrelerce büyürdü.',
      ),
    ], [], [
      {
        soru: 'Michelson–Morley deneyinin sonucu neydi?',
        siklar: ['Esir bulunamadı', 'Esirin hızı ölçüldü'],
        dogru: 0,
        aciklama: {
          dogru: 'Saçaklarda beklenen kayma görülmedi; ışık hızı her yönde aynıydı, esire gerek kalmadı.',
          yanlis: 'Beklenen kayma hiç görülmedi. Deney esirin varlığına dair bir iz bulamadı.',
        },
        kart: 3,
      },
      {
        soru: 'Hızla giden çubuğun hareket yönündeki boyu yerden nasıl ölçülür?',
        siklar: ['Daha uzun', 'Daha kısa'],
        dogru: 1,
        aciklama: {
          dogru: 'Hareket doğrultusundaki boy kısalır; en uzun değeri çubukla birlikte giden ölçer.',
          yanlis: 'Uzunluk kısalması olur: hareketli çubuk duran gözlemciye kısa görünür.',
        },
        kart: 8,
      },
    ]),
    konu('fzk12-siyah-cisim', 'Kuantum Fiziğine Giriş', [
      kart(
        'Siyah cisim',
        'Üzerine düşen bütün ışımayı soğuran ideal cisimdir.\nIsıtılınca her dalga boyunda ışır; ışımasının dağılımı yalnız **sıcaklığına** bağlıdır.\nKüçük delikli kapalı bir kutu ve yıldızlar siyah cisme yakındır.',
      ),
      kart(
        'Sıcaklık ve renk',
        'Sıcaklık arttıkça toplam ışıma artar, en çok ışıma yapılan dalga boyu kısalır.\nIsıtılan demir önce kırmızı, sonra turuncu, sarı ve beyaz parlar.\nMavi yıldızlar kırmızı yıldızlardan sıcaktır.',
      ),
      kart(
        'Işıma şiddeti grafiği',
        'Her sıcaklıkta eğri bir tepe yapar.\nSıcaklık artınca tepe yükselir ve **kısa dalga boyuna** kayar.',
        {
          tur: 'koordinat',
          pencere: [0, 5.3, 0, 2.3],
          egriler: [
            {
              noktalar: [
                [0.3, 0.02],
                [0.8, 0.9],
                [1.2, 1.8],
                [1.5, 2],
                [2, 1.6],
                [3, 0.8],
                [4, 0.4],
                [5, 0.2],
              ],
              ad: 'T₂ (sıcak)',
            },
            {
              noktalar: [
                [0.6, 0.01],
                [1.5, 0.35],
                [2, 0.7],
                [2.5, 0.8],
                [3, 0.72],
                [4, 0.45],
                [5, 0.25],
              ],
              renk: 'ikincil',
              ad: 'T₁',
            },
          ],
          xAd: 'λ',
          yAd: 'şiddet',
        },
      ),
      kart(
        'Klasik fiziğin çıkmazı',
        'Klasik fizik, dalga boyu kısaldıkça ışıma şiddetinin sınırsız artacağını öngörüyordu (morötesi felaketi).\nDeneyde ise şiddet kısa dalga boylarında sıfıra iniyordu.',
      ),
      kart(
        'Planck’ın hipotezi',
        'Planck (1900): ışıma enerjisi sürekli değil, paketler (kuantum) hâlinde yayılır ve soğurulur.\n**E = h · f**, h = 6,63 · 10⁻³⁴ J · s\nBu varsayım deneysel eğriyi tam olarak açıkladı.',
      ),
      kart(
        'Kuantumlanma',
        'Enerji yalnız h · f’nin tam katlarını alabilir: hf, 2hf, 3hf…\nh çok küçük olduğu için günlük hayatta bu basamaklar fark edilmez.',
        undefined,
        { not: 'Kuantum, enerjinin kesikli olması demek: rampa değil merdiven. İki basamak arasında değer yok.' },
      ),
      kart(
        'Kuantum fiziğinin doğuşu',
        'Planck’ın varsayımı, klasik fiziğin açıklayamadığı olaylara kapı açtı: fotoelektrik olay, atom tayfları.\nEinstein, Bohr, de Broglie, Heisenberg ve Schrödinger ile kuantum fiziği kuruldu.',
      ),
      kart(
        'Gündelik örnekler',
        '- Kulak termometresi ve termal kamera vücudun kızılötesi ışımasını ölçer.\n- Yıldızın rengi yüzey sıcaklığını verir.\n- Akkor ampulün ışımasının çoğu kızılötesidir; bu yüzden verimsizdir.',
      ),
    ], [], [
      {
        soru: 'Sıcaklık artınca en çok ışıma yapılan dalga boyu ne olur?',
        siklar: ['Uzar', 'Kısalır'],
        dogru: 1,
        aciklama: {
          dogru: 'Tepe kısa dalga boyuna kayar; kızgın demir kırmızıdan beyaza döner.',
          yanlis: 'Sıcak cisim daha kısa dalga boyunda en çok ışır. Tepe sola, kısa λ’ya kayar.',
        },
        kart: 3,
      },
    ]),
    konu('fzk12-fotoelektrik', 'Fotoelektrik Olayı', [
      kart(
        'Foton',
        'Einstein (1905): ışık, foton denen enerji paketlerinden oluşur.\nFoton yüksüzdür, kütlesi yoktur, boşlukta c ile gider.\n**E = h · f = h · c / λ** — pratik hesap: E (eV) ≈ 1240 / λ (nm)',
      ),
      kart(
        'Fotoelektrik olayı',
        'Metal yüzeye yeterince yüksek frekanslı ışık düşünce yüzeyden elektron sökülür; bunlara fotoelektron denir.\nHertz (1887) morötesi ışığın elektrotlar arasındaki kıvılcımı kolaylaştırdığını fark etti.',
      ),
      kart(
        'Eşik frekansı',
        'Her metalin bir eşik frekansı f₀ ve eşik enerjisi **E₀ = h · f₀** vardır.\nf < f₀ ise ışık ne kadar şiddetli olursa olsun elektron sökülmez.',
      ),
      kart(
        'Einstein’ın denklemi',
        '**h · f = E₀ + Eₖ(maks)**\nFoton enerjisinin E₀ kadarı elektronu sökmeye harcanır, kalanı en hızlı elektronun kinetik enerjisi olur.',
      ),
      kart(
        'Örnek hesap',
        'Eşik enerjisi 2 eV olan metale 5 eV’luk foton düşüyor:\nEₖ(maks) = 5 − 2 = **3 eV**\nBu elektronları durdurmak için 3 V ters gerilim gerekir.',
      ),
      kart(
        'Şiddet mi, frekans mı?',
        '- **Işık şiddeti artarsa:** foton sayısı artar; sökülen elektron sayısı ve akım artar, Eₖ(maks) değişmez.\n- **Frekans artarsa:** her fotonun enerjisi artar, Eₖ(maks) artar.',
        undefined,
        { not: 'Şiddet elektron sayısını, frekans elektronun hızını değiştirir. Soruyu bu ikisine ayır.' },
      ),
      kart(
        'Durdurma gerilimi',
        'Fotoselde anoda ters gerilim uygulanır; en hızlı elektronu durduran gerilim Vₖ’dir:\n**e · Vₖ = Eₖ(maks)**\nVₖ yalnız ışığın frekansına ve metale bağlıdır.',
      ),
      kart(
        'Eₖ – frekans grafiği',
        'Doğrunun eğimi Planck sabitidir; bütün metallerin doğruları paraleldir.\nDoğrunun yatay ekseni kestiği nokta metalin eşik frekansıdır.',
        {
          tur: 'koordinat',
          pencere: [0, 5.4, 0, 3.4],
          egriler: [
            {
              noktalar: [
                [1, 0],
                [4, 3],
              ],
              kirik: true,
              ad: 'metal A',
            },
            {
              noktalar: [
                [2, 0],
                [5, 3],
              ],
              kirik: true,
              renk: 'ikincil',
              ad: 'metal B',
            },
          ],
          noktalar: [
            { x: 1, y: 0, ad: 'f₀(A)' },
            { x: 2, y: 0, ad: 'f₀(B)' },
          ],
          xAd: 'f',
          yAd: 'Eₖ(maks)',
        },
      ),
      kart(
        'Fotosel akımı',
        'Gerilim artınca akım artar; sökülen bütün elektronlar toplanınca **doyma akımına** ulaşır.\nDoyma akımı ışık şiddetiyle büyür.\nAkım, ters gerilim Vₖ olunca sıfırlanır.',
      ),
      kart(
        'Dalga modeli neden yetmedi?',
        'Dalga modeline göre şiddetli ışık her frekansta elektron sökmeli ve sökme bir süre beklemeliydi.\nDeneyde ise eşik frekansı var ve elektron anında çıkıyor: ışık tanecik gibi davranıyor.',
      ),
      kart(
        'Eşik dalga boyu',
        '**λ₀ = h · c / E₀** — bundan kısa dalga boylu ışık elektron söker.\nE₀ = 2,48 eV ise λ₀ = 1240 / 2,48 = 500 nm.\nMavi ışık söker, kırmızı ışık sökmez.',
      ),
      kart(
        'Günlük hayatta',
        '- Otomatik musluklar ve kapılar, ışık kesilince çalışır.\n- Sokak lambaları hava kararınca fotoselle yanar.\n- Dijital kamera algılayıcıları ışığı elektrik sinyaline çevirir.',
      ),
      kart(
        'Sahte güneş gözlüğü',
        'Koyu cam göze gelen ışığı azaltır, göz bebeği büyür.\nCam morötesini süzmüyorsa göze daha çok yüksek enerjili foton girer ve retina zarar görür.\nZararı fotonun enerjisi belirler, ışığın parlaklığı değil.',
      ),
    ], [], [
      {
        soru: 'Eşik frekansının altındaki ışığın şiddeti artırılırsa ne olur?',
        siklar: ['Elektron sökülmez', 'Elektron sökülür'],
        dogru: 0,
        aciklama: {
          dogru: 'Her fotonun enerjisi E₀’dan küçük; foton sayısı artsa da hiçbiri elektron sökemez.',
          yanlis: 'Şiddet foton sayısını artırır, foton enerjisini değil. Enerji eşikten küçükse elektron çıkmaz.',
        },
        kart: 3,
      },
      {
        soru: 'Fotosel devresinde doyma akımını ne artırır?',
        siklar: ['Işığın frekansı', 'Işığın şiddeti'],
        dogru: 1,
        aciklama: {
          dogru: 'Şiddetli ışıkta daha çok foton, dolayısıyla daha çok elektron sökülür; doyma akımı büyür.',
          yanlis: 'Frekans elektronların enerjisini değiştirir, sayısını değil. Doyma akımını şiddet artırır.',
        },
        kart: 9,
      },
    ]),
    konu('fzk12-compton', 'Compton Saçılması ve de Broglie Dalga Boyu', [
      kart(
        'Compton olayı',
        'Compton (1923) X ışınlarını grafit hedefe gönderdi.\nHedefteki elektronlardan saçılan X ışınlarının dalga boyunun, gelenlerinkinden **büyük** olduğunu buldu.',
      ),
      kart(
        'Bilardo topu gibi',
        'Foton elektrona çarpar, enerjisinin bir kısmını ona aktarır; elektron geri teper.\nSaçılan fotonun enerjisi ve frekansı azalır, dalga boyu artar.',
        undefined,
        { not: 'Saçılan foton yavaşlamaz, yine c ile gider. Azalan enerjisi, uzayan dalga boyunda görünür.' },
      ),
      kart(
        'Korunum',
        'Çarpışmada enerji ve momentum korunur:\n**E(gelen) = E(saçılan) + Eₖ(elektron)**\nFoton kütlesiz olsa da momentum taşır: **p = h / λ**',
      ),
      kart(
        'Saçılma açısı',
        'Saçılma açısı büyüdükçe dalga boyundaki artış büyür; en büyük artış geri saçılmada (180°) olur.\nArtış, gelen fotonun dalga boyuna değil yalnız açıya bağlıdır.',
      ),
      kart(
        'Neden X ışını?',
        'Dalga boyundaki artış en çok birkaç pikometredir.\nGörünür ışığın yüzlerce nanometrelik dalga boyunun yanında bu ölçülemez; X ışınında fark edilir.',
      ),
      kart(
        'Compton ve fotoelektrik',
        'İki olayda da ışık elektronla tek tek, tanecik gibi etkileşir.',
        {
          tur: 'tablo',
          basliklar: ['', 'Fotoelektrik', 'Compton'],
          satirlar: [
            ['Foton', 'tamamen soğurulur', 'saçılır, enerjisi azalır'],
            ['Elektron', 'metalden sökülür', 'geri teper'],
            ['Işık', 'görünür, morötesi', 'X ışını'],
          ],
        },
      ),
      kart(
        'Işığın ikili doğası',
        '- **Dalga modeli:** girişim, kırınım, kutuplanma\n- **Tanecik modeli:** fotoelektrik olay, Compton olayı, siyah cisim ışıması\n- **İkisi de:** yansıma ve kırılma',
      ),
      kart(
        'İkili doğa ne demek?',
        'Işık bazı deneylerde dalga, bazılarında tanecik gibi davranır.\nİki model birbirini tamamlar; ışığı tek başına hiçbiri tam açıklayamaz.',
      ),
      kart(
        'De Broglie hipotezi',
        'De Broglie (1924): ışık tanecik gibi davranabiliyorsa, madde de dalga gibi davranabilir.\nHareketli her parçacığa bir dalga eşlik eder:\n**λ = h / (m · v)**',
      ),
      kart(
        'Top neden dalga gibi değil?',
        'h çok küçüktür. 10 m/s ile giden 0,1 kg’lık topun dalga boyu yaklaşık 6,6 · 10⁻³⁴ m’dir; ölçülemez.\nElektronun dalga boyu ise atom boyutlarındadır, kırınımı gözlenir.',
      ),
      kart(
        'Elektron kırınımı',
        'Davisson ve Germer (1927) elektronların kristalden kırınıma uğradığını gözledi; de Broglie doğrulandı.\nElektron mikroskobu, elektronun dalga boyu çok kısa olduğu için çok küçük ayrıntıları gösterir.',
      ),
    ], [], [
      {
        soru: 'Compton saçılmasında saçılan fotonun dalga boyu ne olur?',
        siklar: ['Artar', 'Azalır'],
        dogru: 0,
        aciklama: {
          dogru: 'Foton enerjisinin bir kısmını elektrona verir; E = hc/λ azalınca λ artar.',
          yanlis: 'Enerji azalır, dalga boyu enerjiyle ters orantılıdır; λ artar.',
        },
        kart: 2,
      },
      {
        soru: 'Elektronun hızı artarsa de Broglie dalga boyu ne olur?',
        siklar: ['Artar', 'Azalır'],
        dogru: 1,
        aciklama: {
          dogru: 'λ = h/(mv); hız payda olduğu için hız artınca dalga boyu küçülür.',
          yanlis: 'Hız paydada: λ = h/(mv). Hız artınca dalga boyu azalır.',
        },
        kart: 9,
      },
    ]),
  ]),
  tema('fzk12-t6', 'Modern Fiziğin Teknolojideki Uygulamaları', [
    konu('fzk12-goruntuleme', 'Görüntüleme Teknolojileri', [
      kart(
        'Röntgen',
        'X ışınları vücuttan geçerken kemik gibi yoğun dokular onları daha çok soğurur.\nArkadaki algılayıcıda kemik açık, yumuşak doku koyu görünür.\nX ışını iyonlaştırıcıdır; gereksiz çekimden kaçınılır.',
      ),
      kart(
        'Bilgisayarlı tomografi',
        'X ışını kaynağı ve algılayıcılar hastanın çevresinde döner.\nFarklı açılardan alınan görüntüler bilgisayarda birleştirilip vücudun **kesit** görüntüsü elde edilir.\nDozu tek röntgenden fazladır.',
      ),
      kart(
        'MR',
        'Güçlü manyetik alan vücuttaki hidrojen çekirdeklerini hizalar.\nRadyo dalgasıyla uyarılan çekirdekler eski hâline dönerken sinyal yayar.\nDokuya göre değişen sinyalden görüntü kurulur.\nİyonlaştırıcı radyasyon yoktur.',
      ),
      kart(
        'PET',
        'Hastaya şekere bağlanmış, pozitron yayan bir madde verilir.\nPozitron bir elektronla yok olunca zıt yönlü iki gama fotonu çıkar.\nAlgılayıcılar bunlardan maddenin toplandığı yeri bulur.\nHücrelerin çalışmasını gösterir.',
      ),
      kart(
        'Ultrason',
        'Kulağın duyamadığı, 20 000 Hz’in üstündeki ses dalgaları dokulara gönderilir.\nDoku sınırlarından yansıyan yankıların süresinden görüntü oluşturulur.\nRadyasyon yoktur; gebelikte güvenle kullanılır.',
      ),
      kart(
        'Sonar',
        'Gemi suya ses dalgası gönderir; yankının dönme süresinden derinlik bulunur.\nSes gidip döndüğü için **d = v · t / 2**\nSuda v = 1500 m/s, yankı 2 s sonra dönerse d = 1500 m',
      ),
      kart(
        'Radar',
        'Radyo dalgası ya da mikrodalga gönderilir, yansıyan dalgadan cismin uzaklığı ve yeri bulunur.\nDalga ışık hızıyla gider: 2 · 10⁻⁴ s’de dönen dalga için d = 3 · 10⁸ · 2 · 10⁻⁴ / 2 = 30 km',
      ),
      kart(
        'Termal kamera',
        'Her cisim sıcaklığına bağlı olarak kızılötesi ışıma yapar.\nTermal kamera bu ışımayı algılar, sıcaklık farklarını renklerle gösterir.\nKaranlıkta da çalışır: arama-kurtarma, bina ısı kaçağı, ateş taraması.',
      ),
      kart(
        'Hangisi ne gönderir?',
        'Her cihaz başka bir dalga türünden yararlanır.',
        {
          tur: 'tablo',
          basliklar: ['Cihaz', 'Dalga ya da ışıma'],
          satirlar: [
            ['Röntgen, tomografi', 'X ışını'],
            ['MR', 'manyetik alan ve radyo dalgası'],
            ['PET', 'gama fotonları'],
            ['Ultrason, sonar', 'ses dalgası'],
            ['Radar', 'radyo dalgası, mikrodalga'],
            ['Termal kamera', 'kızılötesi (yalnız algılar)'],
          ],
        },
        { not: 'MR’da X ışını, ultrasonda elektromanyetik dalga yok. Önce cihazın ne gönderdiğini ayır.' },
      ),
      kart(
        'LCD ekran',
        'Sıvı kristaller elektrik alana göre yönelip ışığın kutuplanmasını değiştirir.\nİki kutuplayıcı arasında, arkadan gelen ışığın geçip geçmemesini ayarlarlar.\nKendileri ışık üretmez; arkadan aydınlatma gerekir.',
      ),
      kart(
        'Plazma ekran',
        'Her pikseldeki küçük hücrelerde soy gaz elektrikle plazmaya dönüşür ve morötesi ışık yayar.\nMorötesi ışık hücredeki fosforu uyarır; fosfor kırmızı, yeşil ya da mavi ışık verir.',
      ),
      kart(
        'Piksel ve renk',
        'Ekrandaki her piksel kırmızı, yeşil ve mavi alt piksellerden oluşur.\nÜçünün parlaklığı ayarlanarak bütün renkler elde edilir.',
      ),
    ], [], [
      {
        soru: 'MR görüntülemede hangisi kullanılmaz?',
        siklar: ['X ışını', 'Radyo dalgası'],
        dogru: 0,
        aciklama: {
          dogru: 'MR manyetik alan ve radyo dalgasıyla çalışır; iyonlaştırıcı X ışını kullanmaz.',
          yanlis: 'Radyo dalgası MR’ın parçasıdır, çekirdekleri o uyarır. Kullanılmayan X ışınıdır.',
        },
        kart: 3,
      },
      {
        soru: 'Termal kamera hangi ışımayı algılar?',
        siklar: ['Morötesi', 'Kızılötesi'],
        dogru: 1,
        aciklama: {
          dogru: 'Sıcak cisimler kızılötesi ışır; kamera bu ışımadaki farkları renklere çevirir.',
          yanlis: 'Vücut ve sıcak cisimler morötesi değil kızılötesi ışıma yapar.',
        },
        kart: 8,
      },
    ]),
    konu('fzk12-yari-iletken', 'Yarı İletken Teknolojisi', [
      kart(
        'Yarı iletken',
        'İletkenliği iletkenlerle yalıtkanlar arasındadır: silisyum, germanyum.\nSaf hâlde düşük sıcaklıkta yalıtkana yakındır.\nSıcaklık arttıkça iletkenliği artar.',
        undefined,
        { not: 'Yarı iletkende sıcaklık artınca iletkenlik artar; metallerde azalır. İkisini karıştırma.' },
      ),
      kart(
        'Bant yapısı',
        'Değerlik bandı ile iletim bandı arasında **yasak enerji aralığı** vardır.\n- **İletken:** aralık yok\n- **Yarı iletken:** küçük (silisyumda yaklaşık 1,1 eV)\n- **Yalıtkan:** çok büyük',
      ),
      kart(
        'Elektron ve boşluk',
        'Isı ya da ışıkla iletim bandına çıkan elektron, geride pozitif yüklü bir **boşluk** bırakır.\nYarı iletkende akımı hem elektronlar hem boşluklar taşır.',
      ),
      kart(
        'Katkılama',
        'Saf yarı iletkene çok az başka element eklenir, iletkenlik büyük ölçüde artar.\n- **n tipi:** 5 değerlikli atom (fosfor, arsenik), elektron fazlası\n- **p tipi:** 3 değerlikli atom (bor, galyum), boşluk fazlası',
      ),
      kart(
        'Diyot',
        'p ve n tipi birleştirilir (p-n eklemi); akımı tek yönde geçirir.\n- **İleri yönde (p artı uca):** akım geçer.\n- **Ters yönde:** akım geçmez.\nAlternatif akımı doğru akıma çevirmede kullanılır.',
      ),
      kart(
        'Transistör',
        'Üç katmanlı yarı iletken elemandır (npn ya da pnp).\n- **Yükselteç:** küçük bir akımla büyük bir akımı denetler.\n- **Anahtar:** açılıp kapanır; işlemcilerde milyarlarcası 0 ve 1’leri işler.',
      ),
      kart(
        'Kumdan yongaya',
        'Kumdaki silisyum dioksitten çok saf silisyum elde edilir.\nIşıkla desen basılıp katkılanan dilimler üzerinde devreler kurulur.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Kum (SiO₂)' },
            { ad: 'Saf silisyum' },
            { ad: 'Tek kristal külçe', alt: 'ince dilimlere kesilir' },
            { ad: 'Yonga (çip)', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'LED',
        'Işık yayan diyottur.\nİleri yönde akım geçince elektronlar boşluklarla birleşir, aradaki enerji foton olarak çıkar.\nRengi yasak enerji aralığına bağlıdır: aralık büyükse mavi, küçükse kırmızı.',
      ),
      kart(
        'LED nerede?',
        'Aydınlatma, trafik lambaları, ekranlar, araç farları; uzaktan kumandada kızılötesi LED.\nAkkor ampule göre çok az ısınır, enerjinin çoğunu ışığa çevirir, ömrü uzundur.',
      ),
      kart(
        'Güneş pili',
        'p-n eklemine düşen foton bir elektron-boşluk çifti oluşturur.\nEklemdeki elektrik alan bunları ayırır: elektronlar n, boşluklar p tarafına gider.\nDış devrede akım oluşur; ışık doğrudan elektriğe dönüşür.',
      ),
      kart(
        'Güneş pilinin yeri',
        '- **Artısı:** sessiz, yakıtsız, çalışırken sera gazı salmaz\n- **Eksisi:** verimi sınırlı, gece üretmez, depolama gerekir\nGüneşlenme süresi uzun olan Türkiye’de potansiyeli büyüktür.',
      ),
      kart(
        'Güneş enerjili sistem',
        'Panel doğru akım üretir; fazlası aküde depolanır.\nEv aletleri için evirici (inverter) akımı alternatif akıma çevirir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Güneş paneli' },
            { ad: 'Şarj denetleyici' },
            { ad: 'Akü' },
            { ad: 'Pompa, lamba', renk: 'ikincil' },
          ],
        },
      ),
    ], [], [
      {
        soru: 'Silisyuma fosfor eklenirse hangi tip yarı iletken olur?',
        siklar: ['n tipi', 'p tipi'],
        dogru: 0,
        aciklama: {
          dogru: 'Fosfor 5 değerliklidir; fazla elektron verir, n tipi olur.',
          yanlis: 'p tipi için 3 değerlikli atom (bor) gerekir. Fosfor elektron fazlası verir: n tipi.',
        },
        kart: 4,
      },
      {
        soru: 'LED’in rengini ne belirler?',
        siklar: ['Akımın şiddeti', 'Yasak enerji aralığı'],
        dogru: 1,
        aciklama: {
          dogru: 'Foton enerjisi aralığa eşittir; büyük aralık mavi, küçük aralık kırmızı ışık verir.',
          yanlis: 'Akım parlaklığı değiştirir. Renk, yarı iletkenin yasak enerji aralığına bağlıdır.',
        },
        kart: 8,
      },
    ]),
    konu('fzk12-super-iletken', 'Süper İletkenler', [
      kart(
        'Süper iletken',
        'Kritik sıcaklığın altına soğutulunca elektrik direnci **tamamen sıfır** olan maddedir.\nKamerlingh Onnes (1911), cıvanın yaklaşık 4 K’de direncinin yok olduğunu buldu.',
      ),
      kart(
        'Kritik sıcaklık',
        'Kritik sıcaklığın (Tc) üstünde madde dirençlidir; altında direnç birden sıfıra düşer.\nSıfır dirençte akım ısı kaybı olmadan dolaşır.',
        {
          tur: 'koordinat',
          pencere: [0, 5.3, 0, 2],
          egriler: [
            {
              noktalar: [
                [0.2, 0],
                [2, 0],
                [2, 1.1],
                [3, 1.3],
                [5, 1.7],
              ],
              kirik: true,
            },
          ],
          noktalar: [{ x: 2, y: 0, ad: 'Tc' }],
          xAd: 'T',
          yAd: 'R',
        },
      ),
      kart(
        'Yüksek sıcaklık süper iletkenleri',
        '1986’dan sonra bulunan bazı seramik oksitler, sıvı azot sıcaklığının (77 K) üstünde süper iletken olur.\nSıvı azot ucuz olduğu için bu malzemeler kullanımı kolaylaştırdı.',
      ),
      kart(
        'Meissner etkisi',
        'Süper iletken, manyetik alanı içinden dışarı iter.\nBu yüzden soğutulmuş süper iletkenin üstündeki mıknatıs havada asılı kalır.',
        undefined,
        { not: 'Mıknatısı havada tutan şey sıfır direnç değil, alanın dışlanmasıdır: Meissner etkisi.' },
      ),
      kart(
        'Hızlı trenler',
        'Manyetik kaldırmalı (maglev) trenlerde süper iletken mıknatıslar treni raydan kaldırır.\nRayla sürtünme olmadığı için denemelerde 600 km/h’nin üstüne çıkılmıştır.',
      ),
      kart(
        'Parçacık hızlandırıcıları',
        'CERN’deki Büyük Hadron Çarpıştırıcısı’nda süper iletken mıknatıslar parçacıkları çembersel yolda tutar.\nDirençsiz bobin çok büyük akım taşır, ısınmadan çok güçlü manyetik alan üretir.',
      ),
      kart(
        'Başka kullanımlar ve engel',
        'MR cihazlarının güçlü mıknatısları süper iletken bobinlerle yapılır; kayıpsız enerji iletimi araştırılır.\nEn büyük engel soğutmanın maliyetidir.',
      ),
    ], [], [
      {
        soru: 'Süper iletkenin mıknatısı havada tutması hangi olayla açıklanır?',
        siklar: ['Fotoelektrik olay', 'Meissner etkisi'],
        dogru: 1,
        aciklama: {
          dogru: 'Süper iletken manyetik alanı dışlar; mıknatıs bu yüzden havada asılı kalır.',
          yanlis: 'Fotoelektrik olay ışıkla elektron sökmektir. Mıknatısı Meissner etkisi havada tutar.',
        },
        kart: 4,
      },
    ]),
    konu('fzk12-nano', 'Nanoteknoloji', [
      kart(
        'Nanometre',
        '1 nm = 10⁻⁹ m, metrenin milyarda biridir.\nSaç teli 50 000–100 000 nm kalınlıktadır; DNA sarmalı yaklaşık 2 nm genişliğindedir.\nNanobilim 1–100 nm boyutundaki yapıları inceler.',
      ),
      kart(
        'Fizikle bağı',
        'Bu boyutta yüzey ve kuantum etkileri baskın hâle gelir; maddenin davranışı kuantum fiziğiyle açıklanır.\nFeynman 1959’da atomları tek tek düzenleme fikrini ortaya attı.',
      ),
      kart(
        'Küçülünce yeni özellikler',
        'Boyut küçüldükçe yüzey alanının hacme oranı çok büyür, kimyasal etkinlik artar.\nRenk, erime noktası, iletkenlik ve dayanıklılık değişebilir.\nAltın nanoparçacıklar boyutlarına göre kırmızı ya da mor görünür.',
        undefined,
        { not: 'Nano olmak yalnız küçülmek değil: aynı madde bu boyutta başka renkte, başka sertlikte olabilir.' },
      ),
      kart(
        'Doğadaki nanoyapılar',
        '- **Nilüfer yaprağı:** nano çıkıntılar suyu iter, kiri alıp götürür.\n- **Geko:** ayaklarındaki nano tüyler duvara tutunmasını sağlar.\n- **Kelebek kanadı:** bazı renkler boyadan değil nanoyapıdan gelir.',
      ),
      kart(
        'Karbon nanoyapılar',
        '- **Karbon nanotüp:** çok hafif, çelikten çok daha dayanıklı, iyi iletken\n- **Grafen:** tek atom kalınlığında karbon tabakası; çok sağlam, elektriği ve ısıyı çok iyi iletir',
      ),
      kart(
        'Kullanım alanları',
        '- **Tıp:** ilacı hastalıklı hücreye taşıyan nanoparçacıklar\n- **Elektronik:** nanometre boyutunda transistörler\n- **Tekstil:** leke tutmayan, mikrop üretmeyen kumaşlar\n- **Enerji:** daha verimli güneş pilleri ve aküler',
      ),
      kart(
        'Kendini temizleyen yüzeyler',
        'Titanyum dioksit nano kaplamalı camlar, güneş ışığıyla kiri parçalar ve suyu yayarak temizlenir.\nSu itici nano kaplamalar giysilerde ve araç camlarında kullanılır.',
      ),
      kart(
        'Bilinmeyenler',
        'Nanoparçacıklar çok küçük oldukları için solunarak ya da deriden vücuda girebilir.\nUzun vadeli sağlık ve çevre etkileri hâlâ araştırılıyor.',
      ),
    ], [], [
      {
        soru: 'Madde nano boyuta indirilince yüzey alanının hacme oranı ne olur?',
        siklar: ['Büyür', 'Küçülür'],
        dogru: 0,
        aciklama: {
          dogru: 'Parçacık küçüldükçe atomların çoğu yüzeye çıkar; oran büyür, etkinlik artar.',
          yanlis: 'Küçük parçacıkta yüzey, hacme göre büyüktür. Oran büyür, kimyasal etkinlik artar.',
        },
        kart: 3,
      },
    ]),
    konu('fzk12-laser', 'LASER Işınları', [
      kart(
        'LASER ne demek?',
        'İngilizce “uyarılmış ışıma ile ışığın yükseltilmesi” sözünün baş harfleridir.\nEinstein uyarılmış ışımayı 1917’de öngördü; ilk laseri 1960’ta Maiman yakut kristaliyle yaptı.',
      ),
      kart(
        'Kendiliğinden ve uyarılmış ışıma',
        '- **Kendiliğinden:** uyarılmış atom rastgele bir anda, rastgele yönde foton salar.\n- **Uyarılmış:** gelen foton, uyarılmış atoma aynı enerjide, aynı yönde ve aynı fazda ikinci bir foton saldırır.',
        undefined,
        { not: 'Uyarılmış ışımada gelen foton soğurulmaz; ikiz bir foton doğar ve ikisi birlikte yola çıkar.' },
      ),
      kart(
        'Nüfus terslenmesi',
        'Normalde atomların çoğu alt seviyededir.\nLaser için üst seviyedeki atomların alttakilerden **fazla** olması gerekir.\nBu durum dışarıdan enerji verilerek (pompalama) sağlanır.',
      ),
      kart(
        'Laser nasıl oluşur?',
        'Bir foton zincirleme yeni fotonlar doğurur.\nUçlardaki aynalar ışığı ileri geri gönderip yükseltir; yarı geçirgen aynadan demet çıkar.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Pompalama', alt: 'ışık ya da elektrik' },
            { ad: 'Nüfus terslenmesi' },
            { ad: 'Uyarılmış ışıma', alt: 'ikiz fotonlar' },
            { ad: 'Aynalar arasında çoğalma' },
            { ad: 'Laser demeti', alt: 'yarı geçirgen aynadan', renk: 'ikincil' },
          ],
        },
      ),
      kart(
        'Laser ışığının özellikleri',
        '- **Tek renkli:** tek dalga boyundadır.\n- **Eş fazlı:** dalgalar aynı fazda ilerler.\n- **Paralel:** demet çok az dağılır.\n- **Yoğun:** enerji küçük bir alanda toplanır.',
      ),
      kart(
        'Sıradan ışıkla farkı',
        'Ampul her yöne, birçok dalga boyunda, rastgele fazlı ışık yayar.\nLaser dar bir demet olarak az dağılır; Ay’daki yansıtıcılara gönderilen laserle Dünya–Ay uzaklığı ölçülür.',
      ),
      kart(
        'Teknolojide laser',
        '- **Tıp:** göz ameliyatı, ince cerrahi\n- **Sanayi:** metal kesme ve kaynak\n- **İletişim:** fiber optik kablolarla veri taşıma\n- **Gündelik:** barkod okuyucu, lazer yazıcı, uzaklık ölçer',
      ),
      kart(
        'Canlılara etkisi',
        'Göze gelen laser retinada küçük bir noktaya odaklanır, kalıcı hasar yapabilir.\nGüçlü laser deriyi yakar.\nLaser işaretçiyi göze ya da araç ve uçak sürücülerine tutmak çok tehlikelidir.',
      ),
      kart(
        'Güvenli kullanım',
        'Laser cihazları güçlerine göre sınıflara ayrılır ve uyarı etiketi taşır.\nÇalışırken dalga boyuna uygun koruyucu gözlük takılır; yansıyan demet de tehlikelidir.',
      ),
    ], [], [
      {
        soru: 'Laser ışığı elde etmek için ne gerekir?',
        siklar: ['Atomların çoğunun temel hâlde olması', 'Nüfus terslenmesi'],
        dogru: 1,
        aciklama: {
          dogru: 'Uyarılmış ışımanın soğurmadan baskın olması için üst seviyede daha çok atom gerekir.',
          yanlis: 'Atomların çoğu alt seviyedeyse fotonlar soğurulur. Laser için nüfus terslenmesi şart.',
        },
        kart: 3,
      },
    ]),
  ]),
])
