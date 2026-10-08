import { sikli, soru, type SoruKarti } from '../tip'

type Iddia = [ifade: string, dogru: boolean, gerekce: string]
type Secim = [metin: string, dogru: string, yanlis: string, gerekce: string]

let secimSirasi = 0

/** 11. sınıf soru dosyasının kalıbı: şıklı soruların doğru şıkkı A/B sırayla, iki biçim iç içe. */
function sorular(iddialar: Iddia[], secimler: Secim[]): Omit<SoruKarti, 'id'>[] {
  const dogruYanlis = iddialar.map(([ifade, dogru, gerekce]) => soru(ifade, dogru, gerekce))
  const ikiSikli = secimler.map(([metin, dogru, yanlis, gerekce]) => {
    const yanit = (secimSirasi++ % 2) as 0 | 1
    return sikli(metin, yanit === 0 ? [dogru, yanlis] : [yanlis, dogru], yanit, gerekce)
  })
  return ikiSikli.flatMap((secim, dizin) => [dogruYanlis[dizin], secim])
    .concat(dogruYanlis.slice(ikiSikli.length))
}

/**
 * 12. sınıf (2018 programı) Matematik yoklamaları. Her soru kartlardaki
 * kuralı **başka sayılarla** kullandırır; yanlış şık, o konunun en sık
 * yapılan hatasının sonucudur (n − 1 yerine n, + c'yi unutmak, işareti
 * ters okumak).
 */
export const matematik12Sorulari: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'mat12-dizi': sorular([
    ['Bir dizinin tanım kümesi pozitif tam sayılar kümesidir.', true, 'Dizi, ℕ⁺’dan ℝ’ye bir fonksiyondur.'],
    ['aₙ = √(n − 4) bir dizi belirtir.', false, 'n = 1, 2, 3 için kökün içi negatif olur; terimler tanımsız.'],
    ['aₙ = (2n + 8) / (n + 4) sabit bir dizidir.', true, '2(n + 4) / (n + 4) = 2; her terim 2.'],
    ['aₙ = 3n − 1 dizisinde 60 bir terimdir.', false, '3n − 1 = 60 → n = 61/3; n tam sayı çıkmıyor, 60 terim değil.'],
    ['a₁ = 1 ve aₙ₊₁ = aₙ + 2n ise a₃ = 7 olur.', true, 'a₂ = 1 + 2 · 1 = 3, a₃ = 3 + 2 · 2 = 7.'],
    ['aₙ = 5 − 2n dizisi artandır.', false, 'aₙ₊₁ − aₙ = −2 < 0; dizi azalandır.'],
  ], [
    ['aₙ = n² − 1 dizisinin 5. terimi?', '24', '25', 'a₅ = 25 − 1 = 24.'],
    ['aₙ = 4n + 3 dizisinde 63 kaçıncı terim?', '15', '16', '4n + 3 = 63 → 4n = 60 → n = 15.'],
    ['Fibonacci dizisinin 8. terimi?', '21', '13', '1, 1, 2, 3, 5, 8, 13, 21: sekizinci terim 21.'],
    ['aₙ = 2n + 5 dizisinin kaç terimi 40’tan küçük?', '17', '18', '2n + 5 < 40 → n < 17,5; n = 1, …, 17.'],
    ['aₙ = (k + 1)n + 3 ve bₙ = 4n + 3 eşitse k?', '3', '4', 'n’nin katsayıları eşit: k + 1 = 4 → k = 3.'],
  ]),
  'mat12-aritmetik': sorular([
    ['5, 9, 13, 17, … bir aritmetik dizidir.', true, 'Ardışık farklar hep 4.'],
    ['a₁ = 2 ve r = 5 olan aritmetik dizide a₁₀ = 52 olur.', false, 'a₁₀ = 2 + 9 · 5 = 47; 52 için n − 1 yerine n alınmış.'],
    ['aₙ = 7 − 3n dizisinin ortak farkı −3’tür.', true, 'Genel terim doğrusal, n’nin katsayısı r’dir.'],
    ['Aritmetik dizide a₄ + a₁₀ = a₆ + a₈ eşitliği her zaman doğrudur.', true, 'İndis toplamları eşit: 4 + 10 = 6 + 8.'],
    ['aₙ = n² + 1 dizisi aritmetiktir.', false, 'Farklar 3, 5, 7, … değişiyor; sabit değil.'],
    ['1’den 50’ye kadar olan tam sayıların toplamı 1250’dir.', false, '50 · 51 / 2 = 1275.'],
  ], [
    ['a₂ = 7, a₆ = 19 ise r?', '3', '4', '4r = 19 − 7 = 12 → r = 3.'],
    ['x + 1, 7, 2x + 4 aritmetik ise x?', '3', '4', '2 · 7 = (x + 1) + (2x + 4) → 3x = 9 → x = 3; dizi 4, 7, 10.'],
    ['a₁ = 4, r = 3 için ilk 10 terim toplamı?', '175', '157', 'a₁₀ = 31; S₁₀ = 10 · (4 + 31) / 2 = 175.'],
    ['10, 13, 16, …, 70 dizisi kaç terimli?', '21', '20', '(70 − 10) / 3 + 1 = 21.'],
    ['Sₙ = 2n² + n ise a₃?', '11', '21', 'a₃ = S₃ − S₂ = 21 − 10 = 11.'],
    ['a₅ + a₁₁ = 40 ise a₈?', '20', '40', '5 + 11 = 8 + 8 → 2a₈ = 40 → a₈ = 20.'],
  ]),
  'mat12-geometrik': sorular([
    ['2, 6, 18, 54, … bir geometrik dizidir.', true, 'Ardışık oranlar hep 3.'],
    ['a₁ = 3 ve r = 2 olan geometrik dizide a₆ = 192 olur.', false, 'a₆ = 3 · 2⁵ = 96; 192 için üs n − 1 yerine n alınmış.'],
    ['Ortak çarpanı negatif olan geometrik dizi ne artan ne azalandır.', true, 'Terimlerin işareti sırayla değişir.'],
    ['Geometrik dizide a₃ · a₇ = a₅² eşitliği doğrudur.', true, 'İndis toplamları eşit: 3 + 7 = 5 + 5.'],
    ['3, 6, 9, 12, … bir geometrik dizidir.', false, 'Oranlar 2, 1,5, 1,33… sabit değil; farklar sabit, aritmetik.'],
    ['1 + 3 + 9 + 27 + 81 toplamı 121’dir.', true, 'S₅ = (3⁵ − 1) / (3 − 1) = 242 / 2 = 121.'],
  ], [
    ['a₂ = 12, a₄ = 48 ve terimler pozitif ise r?', '2', '4', 'r² = 48 / 12 = 4 → r = 2 (pozitif).'],
    ['3, x, 27 pozitif terimli geometrik ise x?', '9', '15', 'x² = 3 · 27 = 81 → x = 9; 15 aritmetik ortalama.'],
    ['a₁ = 5, r = 2 için ilk 4 terim toplamı?', '75', '80', '5 · (2⁴ − 1) / (2 − 1) = 75.'],
    ['Her yıl %10 artan 2000 kişilik nüfus 2 yıl sonra?', '2420', '2400', '2000 · 1,1² = 2420; 2400 basit artış.'],
    ['a₁ = 64, r = 1/2 dizisinin 4. terimi?', '8', '4', 'a₄ = 64 · (1/2)³ = 8.'],
    ['a₁ · a₉ = 49 ve terimler pozitif ise a₅?', '7', '49', '1 + 9 = 5 + 5 → a₅² = 49 → a₅ = 7.'],
  ]),
  'mat12-toplam-fark': sorular([
    ['sin(a + b) = sin a + sin b her a, b için doğrudur.', false, 'Sinüs toplama dağılmaz: sin 30° + sin 60° ≠ sin 90°.'],
    ['cos(a − b) = cos a · cos b + sin a · sin b eşitliği doğrudur.', true, 'Kosinüs farkında işaret artıdır.'],
    ['sin 15° = (√6 − √2) / 4 olur.', true, 'sin(45° − 30°) = √6/4 − √2/4.'],
    ['cos 2a = 1 − 2cos²a eşitliği her a için doğrudur.', false, 'Doğrusu cos 2a = 2cos²a − 1 ya da 1 − 2sin²a.'],
    ['sin 2a = 2 sin a · cos a eşitliği her a için doğrudur.', true, 'sin(a + a) açılımı: sin a cos a + cos a sin a.'],
    ['sin 20° cos 40° + cos 20° sin 40° = sin 60° olur.', true, 'sin(20° + 40°) = sin 60° = √3/2.'],
    ['Bir ABC üçgeninde cos(A + B) = cos C olur.', false, 'A + B = 180° − C → cos(A + B) = −cos C.'],
  ], [
    ['cos 75° hangisidir?', '(√6 − √2) / 4', '(√6 + √2) / 4', 'cos(45° + 30°) = √6/4 − √2/4.'],
    ['tan a = 2, tan b = 3 ise tan(a + b)?', '−1', '5', '(2 + 3) / (1 − 6) = 5 / (−5) = −1.'],
    ['cos a = 4/5 (a dar açı) ise sin 2a?', '24/25', '7/25', 'sin a = 3/5 → 2 · 3/5 · 4/5 = 24/25.'],
    ['cos a = 1/3 ise cos 2a?', '−7/9', '2/3', '2cos²a − 1 = 2/9 − 1 = −7/9.'],
    ['tan a = 1/2 ise tan 2a?', '4/3', '1', '2 · (1/2) / (1 − 1/4) = 1 / (3/4) = 4/3.'],
    ['sin 22,5° · cos 22,5° kaçtır?', '√2/4', '√2/2', 'sin 45° / 2 = (√2/2) / 2 = √2/4.'],
    ['cos²15° − sin²15° kaçtır?', '√3/2', '1/2', 'cos 2a kalıbı: cos 30° = √3/2.'],
  ]),
  'mat12-limit': sorular([
    ['Bir noktada limitin olması için fonksiyonun o noktada tanımlı olması gerekir.', false, 'Limit yaklaşılan değere bakar; (x² − 1)/(x − 1) x = 1’de tanımsız ama limiti 2.'],
    ['Soldan ve sağdan limitler farklıysa o noktada limit yoktur.', true, 'Limit için iki yan limit eşit olmalıdır.'],
    ['lim (x → −1) (x³ + 2x) = −3 olur.', true, 'Polinomda yerine konur: −1 − 2 = −3.'],
    ['Yerine koyunca 0/0 çıkan limitin değeri her zaman 0’dır.', false, '0/0 belirsizliktir; sadeleştirince farklı değerler çıkar.'],
    ['lim (x → 0⁺) |x| / x = 1 olur.', true, 'x > 0 iken |x| = x, oran 1.'],
    ['Limiti olan her fonksiyon o noktada süreklidir.', false, 'Limit f(a)’ya eşit değilse ya da f(a) yoksa süreksizdir.'],
    ['Polinom fonksiyonlar her gerçek sayıda süreklidir.', true, 'Polinomda limit her noktada fonksiyon değerine eşittir.'],
    ['f(x) = 1 / (x − 3) fonksiyonu x = 3’te süreklidir.', false, 'x = 3’te payda sıfır, f(3) tanımsız.'],
  ], [
    ['lim (x → 5) (x² − 25) / (x − 5)?', '10', '0', '(x − 5)(x + 5)/(x − 5) = x + 5 → 10.'],
    ['lim (x → 9) (√x − 3) / (x − 9)?', '1/6', '1/3', 'Eşlenikle 1 / (√x + 3) → 1/6.'],
    ['lim (x → 2) (3x + 1) / (x + 3)?', '7/5', '7/3', 'Payda sıfır değil, yerine koy: 7 / 5.'],
    ['lim (x → 1) (x² + x − 2) / (x − 1)?', '3', '2', '(x − 1)(x + 2)/(x − 1) = x + 2 → 3.'],
    ['f(x) = x + 1 (x < 2), ax − 1 (x ≥ 2) limiti x = 2’de varsa a?', '2', '3', 'Soldan 3, sağdan 2a − 1: 2a − 1 = 3 → a = 2.'],
    ['f(x) = (x² − 4)/(x − 2) (x ≠ 2), f(2) = k sürekliyse k?', '4', '0', 'Limit x + 2 → 4; sürekli için f(2) = 4.'],
    ['f(x) = (x + 1) / (x² − 9) hangi noktada süreksiz?', 'x = ±3', 'x = −1', 'Payda x² − 9 = 0 → x = 3 ve x = −3.'],
    ['lim (x → 0⁻) |x| / x?', '−1', '1', 'x < 0 iken |x| = −x, oran −1.'],
  ]),
  'mat12-turev': sorular([
    ['f(x) = x² için [2, 4] aralığındaki ortalama değişim oranı 6’dır.', true, '(16 − 4) / (4 − 2) = 6.'],
    ['f′(a), grafiğe a’da çizilen teğetin eğimidir.', true, 'Kesenin eğimi h → 0 iken teğetin eğimine gider.'],
    ['Bir noktada sürekli olan fonksiyonun o noktada türevi mutlaka vardır.', false, '|x| x = 0’da sürekli ama sivri; türevi yok.'],
    ['(x⁵)′ = 5x⁴ olur.', true, 'Kuvvet kuralı: n · xⁿ⁻¹.'],
    ['(f · g)′ = f′ · g′ eşitliği her zaman doğrudur.', false, 'Çarpım kuralı f′g + fg′; (x · x)′ = 2x, 1 · 1 = 1 değil.'],
    ['(√x)′ = 1 / (2√x) olur.', true, 'x^(1/2)’nin türevi (1/2) · x^(−1/2).'],
    ['((3x − 2)⁴)′ = 4(3x − 2)³ olur.', false, 'İçin türevi 3 eksik: 12(3x − 2)³.'],
    ['f(x) = x³ ise f″(1) = 6 olur.', true, 'f′ = 3x², f″ = 6x → 6.'],
    ['f(x) = |x − 3| fonksiyonunun x = 3’te türevi 0’dır.', false, 'Soldan −1, sağdan 1; türev yok.'],
  ], [
    ['f(x) = 2x³ − x² için f′(1)?', '4', '1', 'f′ = 6x² − 2x → 6 − 2 = 4.'],
    ['f(x) = 1/x için f′(2)?', '−1/4', '1/4', 'f′ = −1/x² → −1/4.'],
    ['f(x) = x² · (x + 2) için f′(1)?', '7', '3', 'f′ = 2x(x + 2) + x² → 6 + 1 = 7.'],
    ['f(x) = x / (x + 1) için f′(0)?', '1', '0', '[(x + 1) − x] / (x + 1)² = 1/(x + 1)² → 1.'],
    ['f(x) = (x² + 3)² için f′(1)?', '16', '8', '2(x² + 3) · 2x → 2 · 4 · 2 = 16.'],
    ['y = x² + 1 eğrisine x = 1’deki teğet?', 'y = 2x', 'y = 2x + 2', 'f(1) = 2, f′(1) = 2: y − 2 = 2(x − 1) → y = 2x.'],
    ['s(t) = t² − 4t (m) ise t = 3 s’deki hız?', '2 m/s', '−3 m/s', 's′(t) = 2t − 4 → 2; −3 konumun kendisi.'],
    ['Teğet eğimi 2 olan noktadaki normalin eğimi?', '−1/2', '−2', 'Normal teğete dik: −1 / 2.'],
  ]),
  'mat12-turev-uygulama': sorular([
    ['Bir aralıkta f′(x) < 0 ise f o aralıkta azalandır.', true, 'Teğetlerin eğimi negatif, grafik aşağı iner.'],
    ['f′(c) = 0 olan her noktada yerel ekstremum vardır.', false, 'x³ için f′(0) = 0 ama işaret değişmez.'],
    ['f(x) = x² − 6x fonksiyonunun yerel minimum değeri −9’dur.', true, 'f′ = 2x − 6 = 0 → x = 3, f(3) = 9 − 18 = −9.'],
    ['Kapalı aralıkta en büyük değer yalnızca kritik noktalarda aranır.', false, 'Uç noktalar da aday; en büyük değer uçta olabilir.'],
    ['f″(x) > 0 olan aralıkta grafik çukur yukarıdır.', true, 'Eğim artıyor; kollar yukarı bakar.'],
    ['f(x) = x³ − 3x² fonksiyonunun büküm noktası x = 1’dedir.', true, 'f″ = 6x − 6 → x = 1’de işaret değişir.'],
    ['f′ grafiğinin x eksenini kestiği her noktada f’nin büküm noktası vardır.', false, 'O noktalar f’nin ekstremum adayıdır; büküm, f′ grafiğinin tepe ya da çukur noktasında olur.'],
  ], [
    ['f(x) = x³ − 12x için yerel maksimum hangi x’te?', 'x = −2', 'x = 2', 'f′ = 3x² − 12, işaret −2’de + → −, 2’de − → +.'],
    ['f(x) = −x² + 4x + 1 en büyük değeri?', '5', '4', 'x = 2’de tepe: −4 + 8 + 1 = 5.'],
    ['f(x) = x³ − 3x, [0, 3] aralığında en büyük değer?', '18', '2', 'Adaylar f(0) = 0, f(1) = −2, f(3) = 27 − 9 = 18.'],
    ['f(x) = x² + ax + 3, x = 1’de ekstremum ise a?', '−2', '2', 'f′(1) = 2 + a = 0 → a = −2.'],
    ['f(x) = x³ + kx her yerde artansa k için doğru olan?', 'k ≥ 0', 'k ≤ 0', 'f′ = 3x² + k ≥ 0 her x için → k ≥ 0.'],
    ['Toplamları 20 olan iki pozitif sayının çarpımı en çok?', '100', '96', 'x(20 − x), x = 10’da en büyük: 100.'],
    ['f′(2) = 0 ve f″(2) = −3 ise x = 2’de?', 'Yerel maksimum', 'Yerel minimum', 'f″ < 0: grafik çukur aşağı, tepe noktası.'],
  ]),
  'mat12-belirsiz-integral': sorular([
    ['∫ 4x³ dx = x⁴ + c olur.', true, '(x⁴)′ = 4x³.'],
    ['Bir fonksiyonun yalnızca tek bir ters türevi vardır.', false, 'Ters türevler sabit kadar farklı sonsuz fonksiyondur.'],
    ['∫ (x² + 1) dx = x³/3 + x + c olur.', true, 'Terim terim kuvvet kuralı.'],
    ['∫ x⁻³ dx = −1 / (2x²) + c olur.', true, 'x⁻² / (−2) = −1 / (2x²).'],
    ['∫ 2x dx = 2 + c olur.', false, '2, 2x’in türevi; integral x² + c.'],
    ['∫ f′(x) dx = f(x) + c eşitliği doğrudur.', true, 'Türevin integrali fonksiyonu sabit farkıyla verir.'],
    ['∫ (2x + 1)³ dx = (2x + 1)⁴ / 4 + c olur.', false, 'İçin türevi 2’ye de bölünür: (2x + 1)⁴ / 8 + c.'],
  ], [
    ['∫ (3x² − 2) dx?', 'x³ − 2x + c', '6x + c', 'Kuvvet kuralı; 6x türevdir.'],
    ['∫ 6√x dx?', '4x^(3/2) + c', '3/√x + c', '6 · (2/3) · x^(3/2) = 4x^(3/2).'],
    ['f′(x) = 3x² + 2, f(0) = 1 ise f(1)?', '4', '6', 'f = x³ + 2x + 1 → 1 + 2 + 1 = 4.'],
    ['∫ x(x² − 1)² dx?', '(x² − 1)³ / 6 + c', '(x² − 1)³ / 3 + c', 'u = x² − 1, du = 2x dx → u³/6.'],
    ['Teğet eğimi 2x − 4 ve eğri (0, 3)’ten geçiyorsa eğri?', 'y = x² − 4x + 3', 'y = x² − 4x', 'Ters türev x² − 4x + c, x = 0’da c = 3.'],
    ['v(t) = 4t + 1 ve s(0) = 0 ise s(2)?', '10', '9', 's = 2t² + t → 8 + 2 = 10.'],
  ]),
  'mat12-belirli-integral': sorular([
    ['∫[1, 2] 3x² dx = 7 olur.', true, 'x³: 8 − 1 = 7.'],
    ['∫[2, 2] f(x) dx = 0 olur.', true, 'Sınırlar aynı: F(2) − F(2) = 0.'],
    ['∫[0, 2] f dx = 5 ise ∫[2, 0] f dx = 5 olur.', false, 'Sınırlar yer değiştirince işaret değişir: −5.'],
    ['Belirli integralin sonucu her zaman bir alandır, bu yüzden negatif olamaz.', false, 'Eksenin altındaki bölge eksi sayılır; ∫[0, 1] (−x) dx = −1/2.'],
    ['∫[−3, 3] x⁵ dx = 0 olur.', true, 'x⁵ tek fonksiyon; simetrik aralıkta parçalar birbirini götürür.'],
    ['∫[0, 2] |x − 1| dx = 0 olur.', false, 'Mutlak değer negatif olmaz: 1/2 + 1/2 = 1.'],
    ['F(x) = ∫[0, x] (t³ + 2) dt ise F′(1) = 3 olur.', true, 'F′(x) = x³ + 2 → 3.'],
    ['İki eğri arasındaki alan, alttaki eğriden üstteki çıkarılarak bulunur.', false, 'Üstteki eksi alttaki integre edilir.'],
  ], [
    ['∫[0, 1] (4x³ + 2x) dx?', '2', '6', 'x⁴ + x²: 1 + 1 = 2.'],
    ['∫[1, 4] √x dx?', '14/3', '7/3', '(2/3)x^(3/2): (2/3)(8 − 1) = 14/3.'],
    ['∫[0, 2] f dx = 3, ∫[2, 5] f dx = 4 ise ∫[0, 5] f dx?', '7', '1', 'Ara nokta özelliği: 3 + 4 = 7.'],
    ['y = x² − 1 ile x ekseni arasındaki alan (−1 ile 1 arası)?', '4/3', '−4/3', 'İntegral −4/3, eğri eksenin altında; alan 4/3.'],
    ['y = x² ile y = 4 arasındaki alan?', '32/3', '16/3', '∫[−2, 2] (4 − x²) dx = 16 − 16/3 = 32/3.'],
    ['∫[−1, 1] (x² + x) dx?', '2/3', '0', 'x tek, katkısı 0; x² için 2 · 1/3 = 2/3.'],
    ['v(t) = 2t + 1 m/s ise 0–3 s arası yol?', '12 m', '7 m', '∫[0, 3] (2t + 1) dt = 9 + 3 = 12.'],
  ]),
  'mat12-cember': sorular([
    ['(x + 2)² + (y − 3)² = 16 çemberinin merkezi (−2, 3), yarıçapı 4’tür.', true, 'x − (−2), y − 3; r² = 16.'],
    ['x² + y² = 9 çemberinin yarıçapı 9’dur.', false, 'r² = 9 → r = 3.'],
    ['(1, 2) noktası x² + y² = 5 çemberinin üstündedir.', true, '1 + 4 = 5.'],
    ['x² + 2y² − 4x = 0 denklemi bir çember belirtir.', false, 'x² ve y² katsayıları eşit değil.'],
    ['Merkezi (−4, 3) olan ve y eksenine teğet çemberin yarıçapı 3’tür.', false, 'y eksenine teğette r = |a| = 4.'],
    ['x² + y² = 25 çemberine (3, 4)’teki teğet 3x + 4y = 25’tir.', true, 'x₀x + y₀y = r² kalıbı.'],
    ['Merkezin doğruya uzaklığı yarıçaptan büyükse doğru çemberi keser.', false, 'd > r iken ortak nokta yok.'],
  ], [
    ['x² + y² − 6x + 2y + 6 = 0 merkezi?', '(3, −1)', '(−3, 1)', 'M(−D/2, −E/2) = (3, −1).'],
    ['x² + y² + 4x − 2y − 4 = 0 yarıçapı?', '3', '9', '(x + 2)² + (y − 1)² = 4 + 1 + 4 = 9 → r = 3.'],
    ['Merkezi (2, 5), x eksenine teğet çemberin r’si?', '5', '2', 'x eksenine teğette r = |b| = 5.'],
    ['x² + y² = 4 için P(2, 2) nerede?', 'Dışarıda', 'İçeride', '4 + 4 = 8 > 4.'],
    ['x² + y² = 25 ile 3x + 4y = 0 doğrusu nasıl?', 'Kesişir', 'Teğettir', 'Doğru merkezden geçiyor: d = 0 < 5.'],
    ['x² + y² = 16, P(5, 0)’dan teğet parçası?', '3', '√41', '√(25 − 16) = 3.'],
    ['x² + y² = 9 ile P(8, 6) arası en kısa uzaklık?', '7', '13', '|MP| = 10 → 10 − 3 = 7; 13 en uzun.'],
  ]),
}
