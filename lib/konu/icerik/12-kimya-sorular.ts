import { sikli, soru, type SoruKarti } from '../tip'

type Iddia = [ifade: string, dogru: boolean, gerekce: string]
type Secim = [metin: string, dogru: string, yanlis: string, gerekce: string]

let secimSirasi = 0

/** 12. sınıf Matematik soru dosyasının kalıbı: şıklı soruların doğru şıkkı A/B sırayla, iki biçim iç içe. */
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
 * 12. sınıf (2018 programı) Kimya yoklamaları. Sorular kartlardaki kuralı
 * çoğunlukla **başka maddelerle ve sayılarla** kullandırır; yanlış şık o
 * konunun en sık yapılan hatasının sonucudur (E°’yi katsayıyla çarpmak,
 * yükseltgen ile indirgeni karıştırmak, H₂O’daki H’yi ikiyle çarpmamak).
 */
export const kimya12Sorulari: Record<string, Omit<SoruKarti, 'id'>[]> = {
  'kim12-redoks': sorular([
    ['K₂Cr₂O₇’de kromun yükseltgenme basamağı +6’dır.', true, '2(+1) + 2x + 7(−2) = 0 → 2x = 12 → x = +6.'],
    ['NaH bileşiğinde hidrojenin yükseltgenme basamağı +1’dir.', false, 'Metal hidrürlerde hidrojen −1 değerini alır.'],
    ['Yükseltgen madde tepkimede elektron alır ve kendisi indirgenir.', true, 'Karşısındakini yükseltgemek için ondan elektron alır; bu yüzden kendisi indirgenir.'],
    ['Fe + 2HCl → FeCl₂ + H₂ tepkimesinde HCl indirgen maddedir.', false, 'H⁺ elektron alıp H₂ olur, yani indirgenir; HCl yükseltgen, Fe indirgen maddedir.'],
    ['CaCO₃ → CaO + CO₂ tepkimesi bir redoks tepkimesidir.', false, 'Ca +2, C +4, O −2 olarak kalır; hiçbir basamak değişmez.'],
    ['Denkleştirilmiş redoks tepkimesinde verilen ve alınan elektron sayıları eşittir.', true, 'Elektronlar yoktan var olmaz; yükseltgenenin verdiği, indirgenenin aldığına eşittir.'],
  ], [
    ['NO₃⁻ iyonunda azotun yükseltgenme basamağı?', '+5', '+3', 'x + 3(−2) = −1 → x = +5.'],
    ['Zn + Cu²⁺ → Zn²⁺ + Cu tepkimesinde indirgen madde?', 'Zn', 'Cu²⁺', 'Zn elektron verip yükseltgenir; karşısındakini indirgediği için indirgendir.'],
    ['Al ile Ag⁺ tepkimesinde 1 Al için kaç Ag⁺ gerekir?', '3', '1', 'Al 3 e⁻ verir, her Ag⁺ 1 e⁻ alır: Al + 3Ag⁺ → Al³⁺ + 3Ag.'],
    ['SO₂ → SO₄²⁻ dönüşümünde kükürt ne olur?', 'Yükseltgenir', 'İndirgenir', 'S, +4’ten +6’ya çıkar; basamak arttığı için yükseltgenir.'],
    ['MnO₄⁻ → Mn²⁺ dönüşümünde bir Mn kaç elektron alır?', '5', '2', 'Mn +7’den +2’ye iner: 5 elektron alır.'],
    ['Hangisi redoks tepkimesidir?', '2Na + Cl₂ → 2NaCl', 'NaOH + HCl → NaCl + H₂O', 'Na 0’dan +1’e, Cl 0’dan −1’e geçer; nötrleşmede basamak değişmez.'],
  ]),
  'kim12-hucre': sorular([
    ['Galvanik hücrede anot negatif kutuptur.', true, 'Anotta yükseltgenme olur ve elektronlar oradan dış devreye çıkar.'],
    ['Elektrolitik hücrede indirgenme anotta olur.', false, 'İndirgenme her hücrede katotta olur; anotta yükseltgenme olur.'],
    ['Tuz köprüsündeki anyonlar katot kabına doğru hareket eder.', false, 'Anot kabında katyon birikir; yükü dengelemek için anyonlar anot kabına gider.'],
    ['Daniell hücresi çalışırken Cu elektrodun kütlesi artar.', true, 'Cu²⁺ katotta indirgenip çubuğun üzerine bakır olarak birikir.'],
    ['Dış devrede elektronlar çözeltinin içinden geçerek katoda ulaşır.', false, 'Elektronlar telden akar; çözeltide ve köprüde yükü iyonlar taşır.'],
    ['Pt elektrot, hidrojen yarı hücresinde tepkimeye girmeden elektron taşır.', true, 'Platin inerttir; yalnız iletken uç görevi görür.'],
  ], [
    ['Galvanik hücre hangi dönüşümü yapar?', 'Kimyasal → elektrik', 'Elektrik → kimyasal', 'İstemli redoksun enerjisi elektrik akımı olarak alınır.'],
    ['Ni | Ni²⁺ || Ag⁺ | Ag şemasında katot hangisi?', 'Ag', 'Ni', 'Şemada katot sağa yazılır; Ag⁺ orada indirgenir.'],
    ['Zn–Cu hücresinde zamanla Zn²⁺ derişimi ne olur?', 'Artar', 'Azalır', 'Anotta Zn yükseltgenip çözeltiye Zn²⁺ olarak geçer.'],
    ['Tuz köprüsü kaldırılırsa ne olur?', 'Akım durur', 'Voltaj artar', 'Kaplarda yük dengesi bozulur, devre tamamlanamaz.'],
    ['Elektrolitik hücrede katot hangi kutba bağlıdır?', 'Güç kaynağının (−) kutbuna', 'Güç kaynağının (+) kutbuna', 'Katotta indirgenme için elektron gerekir; elektronlar (−) kutuptan gelir.'],
  ]),
  'kim12-potansiyel': sorular([
    ['Standart hidrojen elektrodunun potansiyeli 0,00 V kabul edilir.', true, 'Bütün elektrot potansiyelleri bu elektroda göre ölçülür.'],
    ['Ag⁺/Ag potansiyeli +0,80 V ise Ag → Ag⁺ + e⁻ için E° = +0,80 V’tur.', false, 'Tepkime ters çevrilince işaret değişir: yükseltgenme potansiyeli −0,80 V.'],
    ['Cu²⁺ çözeltisine Zn çubuk daldırılırsa çubuk üzerinde bakır birikir.', true, 'Zn, Cu’dan aktiftir (−0,76 < +0,34); Cu²⁺’yı indirger.'],
    ['Ag⁺/Ag yarı tepkimesi 2 ile çarpılırsa E° 1,60 V olur.', false, 'Potansiyel madde miktarına bağlı değildir; E° yine +0,80 V.'],
    ['Cu metali HCl çözeltisinden H₂ gazı açığa çıkarır.', false, 'Cu’nun E°’si +0,34 V, H⁺’nınkinden büyük; Cu H⁺’yı indirgeyemez.'],
    ['E°hücre değeri pozitif olan redoks tepkimesi istemlidir.', true, 'Pozitif hücre potansiyeli tepkimenin kendiliğinden yürüdüğünü gösterir.'],
  ], [
    ['Hangisi daha güçlü yükseltgendir?', 'Ag⁺ (+0,80 V)', 'Zn²⁺ (−0,76 V)', 'İndirgenme potansiyeli büyük olan iyon kolay elektron alır.'],
    ['Fe + Cu²⁺ → Fe²⁺ + Cu için E° kaç V?', '+0,78', '−0,10', 'E° = 0,34 − (−0,44) = +0,78 V.'],
    ['Mg metali Zn²⁺ çözeltisine konursa ne olur?', 'Mg yükseltgenir, Zn birikir', 'Tepkime olmaz', 'Mg’nin E°’si (−2,37) Zn’ninkinden (−0,76) küçük; Mg daha aktiftir.'],
    ['Hangi metal HCl ile H₂ verir?', 'Fe', 'Ag', 'Fe’nin E°’si 0’dan küçüktür; H⁺’yı indirgeyebilir.'],
    ['Standart koşullarda iyon derişimi kaçtır?', '1 M', '0,1 M', 'Standart koşul: 1 M, 1 atm, 25 °C.'],
    ['Cu + 2Ag⁺ → Cu²⁺ + 2Ag için E° kaç V?', '+0,46', '+1,26', 'E° = 0,80 − 0,34 = 0,46 V; Ag’nin potansiyeli 2 ile çarpılmaz.'],
  ]),
  'kim12-pil': sorular([
    ['Zn–Ag pilinin standart voltajı 1,56 V’tur.', true, 'E° = 0,80 − (−0,76) = 1,56 V.'],
    ['Elektrotların yüzey alanı iki katına çıkarılırsa pil voltajı iki katına çıkar.', false, 'Voltaj elektrot boyutuna bağlı değildir; yalnız pilin ömrü uzar.'],
    ['Zn–Cu pilinde Zn²⁺ derişimi artırılırsa voltaj düşer.', true, 'Zn²⁺ üründür; derişimi artınca tepkime eğilimi ve voltaj azalır.'],
    ['Dengeye ulaşan bir pilin voltajı en yüksek değerine çıkar.', false, 'Dengede net tepkime durur; voltaj sıfırdır ve pil bitmiştir.'],
    ['Kurşun akü şarj edilebilen ikincil bir pildir.', true, 'Dışarıdan verilen akım PbSO₄’ü yeniden Pb ve PbO₂’ye çevirir.'],
    ['Lityum iyon pilinde boşalma sırasında Li⁺ iyonları grafit elektroda gider.', false, 'Li⁺ şarjda grafite yerleşir; boşalmada metal oksit elektroda döner.'],
  ], [
    ['Mg–Cu pilinin standart voltajı?', '2,71 V', '2,03 V', 'E° = 0,34 − (−2,37) = 2,71 V.'],
    ['Al–Cu pilinde anot hangisi?', 'Al', 'Cu', 'İndirgenme potansiyeli küçük olan Al (−1,66 V) yükseltgenir.'],
    ['Hangisi pil ömrünü uzatır ama voltajı değiştirmez?', 'Anot metalini büyütmek', 'Katot derişimini artırmak', 'Daha çok madde daha uzun akım verir; derişim ise voltajı değiştirir.'],
    ['Bir otomobil aküsü kaç kurşun hücresinden oluşur?', 'Altı', 'Üç', 'Her hücre yaklaşık 2 V verir; 6 × 2 = 12 V.'],
    ['Lityumun pilde tercih edilme sebebi?', 'Hafif ve E°’si en küçük', 'Ağır ve E°’si büyük', 'Kütle başına çok enerji ve yüksek hücre voltajı sağlar.'],
    ['Zn–Cu pilinde katot kabı seyreltilirse voltaj?', 'Azalır', 'Artar', 'Tepken Cu²⁺ derişimi düşer; tepkime eğilimi ve voltaj azalır.'],
  ]),
  'kim12-elektroliz': sorular([
    ['Elektrolizde anot, güç kaynağının (+) kutbuna bağlıdır.', true, 'Anyonlar (+) kutba çekilir ve orada yükseltgenir.'],
    ['Eriyik NaCl elektrolizinde katotta H₂ gazı oluşur.', false, 'Eriyikte su yoktur; katotta Na⁺ indirgenip sodyum metali oluşur.'],
    ['Sulu CuSO₄ elektrolizinde katotta bakır birikir.', true, 'Cu²⁺ sudan kolay indirgenir.'],
    ['Suyun elektrolizinde anotta toplanan gazın hacmi katottakinin iki katıdır.', false, 'Anotta O₂, katotta H₂ çıkar; H₂ hacmi O₂’nin iki katıdır.'],
    ['2 mol elektron geçtiğinde Cu²⁺ çözeltisinde 1 mol Cu birikir.', true, 'Cu²⁺ + 2e⁻ → Cu: iki mol elektron bir mol bakır verir.'],
    ['Sulu NaCl elektrolizi sonunda çözelti asidik olur.', false, 'Katotta su indirgenirken OH⁻ oluşur; çözeltide NaOH kalır, bazik olur.'],
    ['Gümüş kaplanacak kaşık devrede katot olarak bağlanır.', true, 'Ag⁺ katotta indirgenip kaşığın üzerine gümüş olarak birikir.'],
  ], [
    ['19 300 C yük kaç mol elektrondur?', '0,2', '0,1', '19 300 / 96 500 = 0,2 mol e⁻.'],
    ['0,3 mol e⁻ ile Al³⁺’ten kaç mol Al elde edilir?', '0,1', '0,3', 'Her Al için 3 e⁻ gerekir: 0,3 / 3 = 0,1 mol.'],
    ['Sulu KBr elektrolizinde anotta ne oluşur?', 'Br₂', 'O₂', 'Br⁻ sudan kolay yükseltgenir.'],
    ['Sulu Na₂SO₄ elektrolizinde katot ürünü?', 'H₂', 'Na', 'Na⁺ sulu ortamda indirgenmez; yerine su indirgenir.'],
    ['Seri kaplarda 0,2 mol Cu biriktiğinde Ag kabında kaç mol Ag birikir?', '0,4', '0,2', '0,2 mol Cu için 0,4 mol e⁻ geçer; aynı yük 0,4 mol Ag biriktirir.'],
    ['Bakır arıtmasında ham bakır hangi elektrottur?', 'Anot', 'Katot', 'Ham bakır anotta çözünür, saf bakır katotta birikir.'],
  ]),
  'kim12-korozyon': sorular([
    ['Demirin paslanması bir redoks tepkimesidir.', true, 'Demir elektron verip yükseltgenir, oksijen indirgenir.'],
    ['Demir yalnız oksijen bulunan kuru ortamda hızla paslanır.', false, 'Paslanma için su ve oksijen birlikte gerekir.'],
    ['Galvanizli demirde çinko tabaka çizilse de demir bir süre korunur.', true, 'Zn demirden aktiftir; önce o yükseltgenir.'],
    ['Demire bakır bağlamak demiri korozyondan korur.', false, 'Cu demirden az aktiftir; demir anot olur ve daha hızlı aşınır.'],
    ['Paslanmada demir katot bölgede indirgenir.', false, 'Demir anot bölgede yükseltgenir; katotta O₂ indirgenir.'],
  ], [
    ['Gemi gövdesine bağlanan kurban anot hangisi olabilir?', 'Mg', 'Cu', 'Mg demirden aktiftir; kendisi aşınır, demiri korur.'],
    ['Pas hangi bileşiktir?', 'Fe₂O₃ · xH₂O', 'FeCl₃', 'Pas sulu demir(III) oksittir.'],
    ['Kalaylı demir çizilirse hangisi aşınır?', 'Demir', 'Kalay', 'Fe (−0,44 V) Sn’den (−0,14 V) aktiftir; çizikte demir yükseltgenir.'],
    ['Dış akımla korumada metal hangi kutba bağlanır?', '(−) kutba', '(+) kutba', '(−) kutba bağlı metal katot olur ve yükseltgenmez.'],
    ['Alüminyumu korozyondan koruyan nedir?', 'Yüzeydeki Al₂O₃ tabakası', 'E°’sinin büyük olması', 'Al aktif bir metaldir (−1,66 V); onu yüzeydeki sıkı oksit korur.'],
  ]),
  'kim12-organik': sorular([
    ['CO₂ karbon içerdiği için organik bileşik sayılır.', false, 'CO, CO₂, karbonatlar ve siyanürler karbon içerse de anorganik sayılır.'],
    ['Wöhler’in üre sentezi yaşam gücü teorisini sarstı.', true, 'Organik bir madde, anorganik bir maddeden laboratuvarda üretildi.'],
    ['Organik bileşiklerin çoğu yandığında CO₂ ve H₂O oluşur.', true, 'Yapılarındaki C, CO₂’ye; H, H₂O’ya dönüşür.'],
    ['Etanol ve dimetil eterin molekül formülleri farklıdır.', false, 'İkisi de C₂H₆O’dur; yapıları farklı izomerlerdir.'],
    ['Organik tepkimeler genellikle iyonik tepkimelerden yavaştır.', true, 'Kovalent bağların kırılması iyonların birleşmesinden yavaştır.'],
  ], [
    ['Hangisi anorganik bir bileşiktir?', 'KCN', 'C₂H₅OH', 'Siyanürler karbon içerse de anorganik sayılır.'],
    ['Karbonun çok sayıda bileşik yapmasının başlıca sebebi?', 'Zincir ve halka kurabilmesi', 'Metal olması', 'C bir ametaldir; birbirine bağlanıp zincir ve halka kurması çeşitliliği doğurur.'],
    ['Bir madde yakılınca CO₂ ve H₂O çıkıyorsa kesin olarak ne içerir?', 'C ve H', 'C, H ve O', 'O, yakmada kullanılan O₂’den de gelebilir; kesin olan C ve H’dir.'],
    ['CH₃–CH₂–OH hangi yazılışa örnektir?', 'Yarı açık formül', 'Kapalı formül', 'Kapalı formül C₂H₆O olurdu.'],
    ['Hangisi organik bileşiklerin çoğunda görülür?', 'Düşük erime noktası', 'Suda iyi çözünme', 'Çoğu kovalent ve apolardır; erime noktaları düşük, suda çözünürlükleri azdır.'],
  ]),
  'kim12-formul': sorular([
    ['C₂H₄ ve C₃H₆ bileşiklerinin basit formülü aynıdır.', true, 'İkisinde de C : H = 1 : 2; basit formül CH₂.'],
    ['Basit formülü CH, mol kütlesi 78 olan bileşiğin molekül formülü C₆H₆’dır.', true, 'CH = 13; 78 / 13 = 6 → C₆H₆.'],
    ['H₂O₂’nin basit formülü H₂O’dur.', false, '2 : 2 oranı 1 : 1’e sadeleşir; basit formül HO.'],
    ['Glikozun basit formülü ile molekül formülü aynıdır.', false, 'Glikoz C₆H₁₂O₆, basit formülü CH₂O’dur.'],
    ['Yakma analizinde 0,2 mol H₂O oluşursa örnekte 0,2 mol H atomu vardır.', false, 'Her H₂O iki H taşır: 0,4 mol H.'],
    ['0,1 mol hidrokarbon 0,2 mol CO₂ ve 0,3 mol H₂O verirse bileşik C₂H₆’dır.', true, 'C = 0,2 / 0,1 = 2; H = 2 · 0,3 / 0,1 = 6.'],
  ], [
    ['C₄H₁₀ bileşiğinin basit formülü?', 'C₂H₅', 'CH₂', '4 : 10 oranı 2 : 5’e sadeleşir.'],
    ['Basit formülü CH₂O, mol kütlesi 60 olan bileşik?', 'C₂H₄O₂', 'C₃H₆O₃', '60 / 30 = 2 → C₂H₄O₂.'],
    ['%80 C ve %20 H içeren hidrokarbonun basit formülü?', 'CH₃', 'CH₄', 'C: 80 / 12 ≈ 6,67; H: 20 / 1 = 20; oran 1 : 3.'],
    ['NŞA’da yoğunluğu 1,875 g/L, basit formülü CH₂ olan gaz?', 'C₃H₆', 'C₂H₄', '1,875 · 22,4 = 42; 42 / 14 = 3 → C₃H₆.'],
    ['C : H mol oranı 1 : 1,5 çıktıysa basit formül?', 'C₂H₃', 'CH₂', '1,5 tam sayı değildir; iki tarafı 2 ile çarp: C₂H₃.'],
  ]),
  'kim12-allotrop': sorular([
    ['Elmas ve grafit aynı elementin farklı yapılarıdır.', true, 'İkisi de yalnız karbondan oluşan allotroplardır.'],
    ['Elmasta her C atomu üç C atomuna bağlıdır.', false, 'Elmasta her C dört C’ye bağlıdır; üç bağ grafitte görülür.'],
    ['Grafit katmanları zayıf kuvvetlerle tutunduğu için kaygandır.', true, 'Katmanlar birbiri üzerinde kolayca kayar.'],
    ['Grafenin kalınlığı tek bir atom kadardır.', true, 'Grafen, grafitin tek bir katmanıdır.'],
    ['Standart koşullarda karbonun en kararlı hâli elmastır.', false, 'En kararlı hâl grafittir; ΔH°f değeri 0 olan odur.'],
  ], [
    ['C₆₀ molekülü hangi allotroptur?', 'Fulleren', 'Grafen', 'C₆₀ futbol topu biçiminde kapalı bir kafestir.'],
    ['Kesici uçlarda hangisi kullanılır?', 'Elmas', 'Grafit', 'Elmas bilinen en sert doğal maddedir.'],
    ['Grafen tabakası silindir gibi kıvrılırsa ne oluşur?', 'Karbon nanotüp', 'Fulleren', 'Fulleren kapalı bir küre kafestir; tüp biçimi nanotüptür.'],
    ['Elmas ve grafit yakılınca ne oluşur?', 'İkisinden de CO₂', 'Yalnız grafitten CO₂', 'İkisi de saf karbondur; yanınca CO₂ verir.'],
    ['Grafitte C atomlarının hibriti?', 'sp²', 'sp³', 'Her C üç C’ye bağlıdır ve düzlemdedir: sp².'],
  ]),
  'kim12-hibrit': sorular([
    ['sp³ hibritleşmesinde dört eş orbital oluşur.', true, 'Bir s ve üç p orbitali karışarak dört sp³ orbitali verir.'],
    ['C₂H₂ molekülünde C atomları sp² hibritleşmesi yapar.', false, 'Her C iki σ bağı yapar ve doğrusaldır: sp.'],
    ['Bir çift bağ bir σ ve bir π bağından oluşur.', true, 'İki atom arasında yalnız bir σ olur; ikinci bağ π’dir.'],
    ['π bağı σ bağından daha sağlamdır.', false, 'Yan yana örtüşme daha zayıftır; π bağı σ’dan kolay kırılır.'],
    ['H₂O’da O atomu sp³ hibritleşmesi yaptığı hâlde molekül açısaldır.', true, 'İki ortaklanmamış çift dörtyüzlünün iki köşesini tutar; şekil açısal kalır.'],
    ['C≡C bağı, C–C bağından daha uzundur.', false, 'Bağ sayısı arttıkça bağ kısalır: C≡C 120 pm, C–C 154 pm.'],
  ], [
    ['BF₃ molekülünde B’nin hibriti?', 'sp²', 'sp³', 'Üç σ bağı var, ortaklanmamış çift yok: sp², düzlem üçgen.'],
    ['HC≡N molekülünde kaç π bağı vardır?', '2', '3', 'C–H tek σ; C≡N bir σ ve iki π içerir.'],
    ['CH₄ molekülünde bağ açısı?', '109,5°', '120°', 'sp³ orbitalleri düzgün dörtyüzlünün köşelerine yönelir.'],
    ['NH₃ molekülünde N’nin hibriti?', 'sp³', 'sp²', 'Üç σ bağı ve bir ortaklanmamış çift: toplam 4 → sp³.'],
    ['CH₂=CH–CH₃ molekülünde kaç σ bağı vardır?', '8', '9', 'Altı C–H ve iki C–C σ bağı: 8; çift bağın ikinci çizgisi π’dir.'],
    ['CO₂ molekülünde C’nin hibriti?', 'sp', 'sp²', 'İki σ bağı var, çift yok: sp, doğrusal.'],
  ]),
  'kim12-alkan': sorular([
    ['C₈H₁₈ bir alkandır.', true, 'n = 8 için CₙH₂ₙ₊₂ = C₈H₁₈ (oktan).'],
    ['Alkanlar bromlu suyun rengini hızla giderir.', false, 'Alkanlarda π bağı yoktur; Br₂ katılamaz, renk kalır.'],
    ['C₄H₁₀ formülünün iki yapı izomeri vardır.', true, 'Bütan ve 2-metilpropan.'],
    ['Aynı C sayısında dallanma arttıkça kaynama noktası yükselir.', false, 'Dallanma temas yüzeyini azaltır; kaynama noktası düşer.'],
    ['Metan ile klor ışık altında yer değiştirme tepkimesi verir.', true, 'CH₄ + Cl₂ → CH₃Cl + HCl; bir H yerine Cl geçer.'],
    ['Siklobütan ile 1-büten aynı molekül formülüne sahiptir.', true, 'İkisi de C₄H₈’dir; sikloalkan ile alken izomerdir.'],
    ['Alkanlar polar olduğu için suda iyi çözünür.', false, 'Alkanlar apolardır ve suda çözünmez.'],
  ], [
    ['CH₃–CH(CH₃)–CH(CH₃)–CH₃ bileşiğinin adı?', '2,3-dimetilbütan', '1,2-dimetilbütan', 'Ana zincir 4 C; metiller 2. ve 3. C’de.'],
    ['2C₄H₁₀ + ?O₂ yanma denkleminde O₂’nin katsayısı?', '13', '9', '8 CO₂ ve 10 H₂O için 16 + 10 = 26 O atomu, yani 13 O₂.'],
    ['Hangisi 25 °C’de gazdır?', 'Bütan', 'Oktan', 'C₁–C₄ alkanlar gazdır; oktan benzinin sıvı bileşenidir.'],
    ['C₅H₁₂ formülünün kaç yapı izomeri vardır?', '3', '2', 'Pentan, 2-metilbütan ve 2,2-dimetilpropan.'],
    ['Hangisinin kaynama noktası daha yüksektir?', 'Hekzan', 'Pentan', 'Düz zincirli alkanlarda C sayısı artınca kaynama noktası yükselir.'],
    ['CH₄ + Cl₂ tepkimesinin türü?', 'Yer değiştirme', 'Katılma', 'Bir H çıkar, yerine Cl girer; alkanda katılacak π bağı yoktur.'],
  ]),
  'kim12-alken': sorular([
    ['Eten molekülündeki bütün atomlar aynı düzlemdedir.', true, 'İki sp² C’nin üçgen düzlemleri π bağıyla aynı düzlemde tutulur.'],
    ['Propen molekülü cis-trans izomerliği gösterir.', false, 'Uçtaki C’de iki H vardır; iki farklı grup şartı sağlanmaz.'],
    ['Alkenler hidrojen katılınca alkana dönüşür.', true, 'Ni ya da Pt katalizörüyle π bağına H₂ katılır.'],
    ['Propene HBr katılınca ana ürün 1-bromopropandır.', false, 'Markovnikov: H, H’si çok olan uç C’ye gider; ürün 2-bromopropan.'],
    ['Polietilen, eten moleküllerinin katılma polimerleşmesiyle oluşur.', true, 'Çift bağlar açılır ve monomerler uç uca bağlanır.'],
    ['C₃H₆ formülü yalnız bir alkene aittir; halkalı izomeri yoktur.', false, 'Siklopropan da C₃H₆’dır; propenin halkalı izomeridir.'],
  ], [
    ['CH₃–CH₂–CH=CH₂ bileşiğinin adı?', '1-büten', '3-büten', 'Çift bağa yakın uçtan numaralanır: 1-büten.'],
    ['Eten bromlu suyla ne verir?', '1,2-dibromoetan', 'Bromoeten', 'Br₂ çift bağa katılır; her C’ye bir Br bağlanır.'],
    ['Etene asitli ortamda su katılırsa ürün?', 'Etanol', 'Etan', 'H ve OH çift bağa katılır: CH₃CH₂OH.'],
    ['Hangisi doymamışlığı gösterir?', 'Bromlu suyun renksizleşmesi', 'Turnusolün kızarması', 'π bağına Br₂ katılır ve kahverengi renk kaybolur.'],
    ['PVC hangi monomerden elde edilir?', 'Vinil klorür', 'Tetrafloroeten', 'Tetrafloroetenden teflon elde edilir.'],
    ['Meyveleri olgunlaştıran bitki hormonu?', 'Etilen', 'Asetilen', 'Eten (etilen) bitkilerin ürettiği bir olgunlaşma hormonudur.'],
  ]),
  'kim12-alkin': sorular([
    ['C₂H₂ molekülü doğrusaldır.', true, 'Her C sp’dir; bağ açısı 180°.'],
    ['2-bütin amonyaklı AgNO₃ çözeltisiyle çökelek verir.', false, 'Üçlü bağ ortadadır, ≡C–H yoktur; çökelek vermez.'],
    ['Bir mol etine iki mol H₂ katılınca etan oluşur.', true, 'İki π bağı sırayla açılır: etin → eten → etan.'],
    ['Alkinlerde cis-trans izomerliği görülür.', false, 'Üçlü bağın çevresi doğrusaldır; aynı ya da zıt taraf oluşmaz.'],
    ['Kalsiyum karbür suyla tepkimeye girince asetilen oluşur.', true, 'CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂'],
  ], [
    ['C₅H₈ formülü hangi sınıfa uyabilir?', 'Alkin', 'Alken', 'n = 5 için CₙH₂ₙ₋₂ = C₅H₈; alken C₅H₁₀ olurdu.'],
    ['1-bütin ile 2-bütini ayırt eden test?', 'Amonyaklı AgNO₃', 'Bromlu su', 'İkisi de bromlu suyu renksizleştirir; yalnız uç alkin çökelek verir.'],
    ['Propine su katılınca ana ürün?', 'Propanon', 'Propanal', 'O, Markovnikov’a göre ortadaki C’ye bağlanır: aseton.'],
    ['1 mol propin (C₃H₄) yanınca kaç mol H₂O oluşur?', '2', '4', '4 H atomu 2 H₂O’ya gider; CO₂ ise 3 mol oluşur.'],
    ['Oksiasetilen alevi ne için kullanılır?', 'Metal kesme ve kaynak', 'Meyve olgunlaştırma', 'Alevin sıcaklığı 3000 °C’yi aşar.'],
  ]),
  'kim12-aromatik': sorular([
    ['Benzende C–C bağlarının uzunlukları birbirine eşittir.', true, 'π elektronları halkaya yayılır; altı bağ da 139 pm’dir.'],
    ['Benzen bromlu suyu alkenler gibi hızla renksizleştirir.', false, 'Kararlı halka katılma vermez; bromlu suyun rengi kalır.'],
    ['Toluen, benzen halkasına bir metil grubu bağlanmış bileşiktir.', true, 'Toluenin diğer adı metilbenzendir.'],
    ['Para konumundaki iki grup halkada komşu C atomlarına bağlıdır.', false, 'Komşu konum ortodur; para karşılıklı (1,4) konumdur.'],
    ['Benzenin nitrolanması bir yer değiştirme tepkimesidir.', true, 'Halkadaki bir H yerine –NO₂ grubu geçer.'],
  ], [
    ['Benzen halkasına –OH bağlanırsa hangi bileşik oluşur?', 'Fenol', 'Anilin', 'Anilinde halkaya –NH₂ bağlıdır.'],
    ['1,3-dimetilbenzende grupların konumu?', 'Meta', 'Orto', 'Arada bir C var: meta (1,3).'],
    ['Benzen FeBr₃ varlığında Br₂ ile ne verir?', 'Bromobenzen ve HBr', 'Halkası açılmış bir alkan', 'Halka korunur; bir H yerine Br geçer.'],
    ['Naftalinin molekül formülü?', 'C₁₀H₈', 'C₁₂H₁₀', 'Kenar paylaşan iki halka: 10 C, 8 H.'],
    ['Kanser yapıcı olduğu için kullanımı sınırlanan çözücü?', 'Benzen', 'Etanol', 'Benzen kanserojendir; yerine toluen gibi çözücüler tercih edilir.'],
  ]),
  'kim12-fonksiyonel': sorular([
    ['Alkoller ve eterler aynı genel formüle sahip olabilir.', true, 'İkisi de CₙH₂ₙ₊₂O’dur; etanol ile dimetil eter izomerdir.'],
    ['Karboksilik asitler CₙH₂ₙO genel formülüne uyar.', false, 'CₙH₂ₙO aldehit ve ketonların; asitler CₙH₂ₙO₂ formülündedir.'],
    ['Metil formiat ile asetik asit birbirinin izomeridir.', true, 'İkisi de C₂H₄O₂’dir; biri ester, biri asit.'],
    ['–NH₂ grubu taşıyan bileşikler zayıf asit özelliği gösterir.', false, 'Aminler amonyak gibi zayıf bazdır.'],
    ['Kloroform bir alkil halojenürdür.', true, 'CHCl₃: metandaki üç H yerine Cl bağlanmıştır.'],
  ], [
    ['CH₃–O–CH₂–CH₃ hangi sınıftandır?', 'Eter', 'Alkol', 'O iki C arasındadır; –OH yoktur.'],
    ['CH₃–CO–CH₃ hangi sınıftandır?', 'Keton', 'Aldehit', 'C=O zincirin içindedir ve iki C’ye bağlıdır.'],
    ['C₂H₆O formüllü eter hangisidir?', 'Dimetil eter', 'Dietil eter', 'Dietil eter C₄H₁₀O’dur.'],
    ['R–COO–R′ hangi sınıfın gösterimidir?', 'Ester', 'Karboksilik asit', 'Asitte O’ya H bağlıdır (–COOH); esterde C bağlıdır.'],
  ]),
  'kim12-alkol': sorular([
    ['Etanolün sulu çözeltisi bazik özellik gösterir.', false, 'Alkoldeki –OH iyonlaşıp OH⁻ vermez; çözelti nötrdür.'],
    ['Gliserin üç –OH grubu taşır.', true, 'Gliserin 1,2,3-propantrioldür.'],
    ['Etanolün kaynama noktası dimetil eterinkinden yüksektir.', true, 'Etanol hidrojen bağı kurar (78 °C); eter kuramaz (−24 °C).'],
    ['Uzun zincirli alkoller suda kısa zincirlilerden daha iyi çözünür.', false, 'Apolar zincir uzadıkça sudaki çözünürlük azalır.'],
    ['Sekonder alkol yükseltgenince keton oluşur.', true, '–OH’li C’deki tek H gider, C=O oluşur.'],
    ['Dietil eter sodyumla tepkimeye girip H₂ verir.', false, 'Eterde –OH yoktur; Na ile H₂ vermez.'],
    ['Etanolden derişik H₂SO₄ ile yaklaşık 170 °C’de su çekilirse eten oluşur.', true, 'Molekül içinden su çıkar ve çift bağ oluşur.'],
  ], [
    ['CH₃–CH₂–CH₂–OH bileşiğinin adı?', '1-propanol', '2-propanol', '–OH uçtaki C’dedir.'],
    ['2-metil-2-propanol hangi sınıf alkoldür?', 'Tersiyer', 'Sekonder', '–OH’li C üç C’ye bağlıdır.'],
    ['Primer alkolün yükseltgenmesinde ilk ürün?', 'Aldehit', 'Keton', 'Keton sekonder alkolden oluşur.'],
    ['Antifriz olarak kullanılan dialkol?', 'Etilen glikol', 'Gliserin', 'Gliserin üç –OH taşıyan bir trialkoldür.'],
    ['Körlüğe yol açabilen zehirli alkol?', 'Metanol', 'Etanol', 'Metanol vücutta zehirli ürünlere dönüşür.'],
    ['Etanol ile dimetil eteri ayırt eden tepkime?', 'Na ile H₂ çıkışı', 'Yanma', 'İkisi de yanar; yalnız alkol Na ile H₂ verir.'],
  ]),
  'kim12-karbonil': sorular([
    ['En küçük keton üç karbonludur.', true, 'C=O’nun iki yanında birer C olmalı: propanon.'],
    ['Propanon Fehling çözeltisiyle kırmızı çökelek verir.', false, 'Ketonlar kolay yükseltgenmez; Fehling testini aldehitler verir.'],
    ['Aldehitlere H₂ katılınca primer alkol oluşur.', true, '–CHO, –CH₂OH’ye indirgenir.'],
    ['Aldehit molekülleri birbirleriyle hidrojen bağı kurar.', false, 'O’ya bağlı H yoktur; moleküller arasında yalnız dipol etkileşimi vardır.'],
    ['Bütanal ve 2-bütanon birbirinin izomeridir.', true, 'İkisi de C₄H₈O’dur.'],
  ], [
    ['CH₃–CH₂–CHO bileşiğinin adı?', 'Propanal', 'Propanon', '–CHO uçtadır: aldehit, -al eki.'],
    ['2-propanol yükseltgenirse ne oluşur?', 'Propanon', 'Propanal', 'Sekonder alkol ketona yükseltgenir.'],
    ['Formalin hangi maddenin sulu çözeltisidir?', 'Metanal', 'Etanal', 'Formalin %40’lık formaldehit (metanal) çözeltisidir.'],
    ['Mol kütleleri eşit (58) iki maddeden hangisi daha yüksek sıcaklıkta kaynar?', 'Propanal', 'Bütan', 'Propanalin polar C=O grubu dipol etkileşimi kurar; bütan apolardır.'],
    ['Glikozu Fehling testinde olumlu yapan grup?', 'Aldehit', 'Keton', 'Glikozun zincir hâlindeki –CHO grubu kolay yükseltgenir.'],
  ]),
  'kim12-karboksilik': sorular([
    ['Asetik asit suda tamamen iyonlaşır.', false, 'Asetik asit zayıf asittir; ancak çok küçük bir kısmı iyonlaşır.'],
    ['Karboksilik asitler NaHCO₃ ile CO₂ gazı açığa çıkarır.', true, 'Asit karbonatı bozar; köpürme asidi alkolden ayırır.'],
    ['Formik asit Tollens testine olumlu sonuç verir.', true, 'HCOOH’deki H’li karbon aldehit gibi yükseltgenir.'],
    ['Oleik asit doymuş bir yağ asididir.', false, 'Oleik asidin zincirinde C=C vardır; doymamıştır.'],
    ['Asetik asidin kaynama noktası aynı mol kütleli 1-propanolden yüksektir.', true, 'Asit molekülleri iki hidrojen bağıyla dimer kurar: 118 °C’ye karşı 97 °C.'],
  ], [
    ['CH₃–CH₂–COOH bileşiğinin adı?', 'Propanoik asit', 'Etanoik asit', 'Üç C’li zincir: propan + -oik asit.'],
    ['Etanolün yükseltgenmesinde son ürün?', 'Etanoik asit', 'Etanal', 'Etanal ara üründür; yükseltgenme asitte durur.'],
    ['Asetik asit NaOH ile ne verir?', 'CH₃COONa ve H₂O', 'CH₃COOCH₃ ve H₂O', 'Asit ile baz nötrleşir: tuz ve su oluşur.'],
    ['Karıncanın salgısındaki asit?', 'Metanoik asit', 'Bütanoik asit', 'Formik (metanoik) asit adını karıncadan alır.'],
    ['Hangisi doymamış bir yağ asididir?', 'Oleik asit', 'Stearik asit', 'Oleik asidin zincirinde C=C bağı vardır.'],
  ]),
  'kim12-ester': sorular([
    ['Esterleşme tepkimesinde su da oluşur.', true, 'Asidin –OH’si ve alkolün H’si su olarak ayrılır.'],
    ['Esterlerin bazik hidrolizi tersinir bir tepkimedir.', false, 'Bazik hidrolizde asit tuzuna dönüşür; tepkime tamamlanır.'],
    ['Bitkisel sıvı yağlarda doymamış yağ asitleri çoğunluktadır.', true, 'C=C bağları zincirleri büker, yağ oda sıcaklığında sıvı kalır.'],
    ['Esterlerin kaynama noktası aynı mol kütleli karboksilik asitten yüksektir.', false, 'Esterler hidrojen bağı kuramaz; daha düşük sıcaklıkta kaynar.'],
    ['KOH ile yapılan sabun, NaOH ile yapılandan yumuşaktır.', true, 'Potasyum sabunları yumuşak (sıvı), sodyum sabunları serttir.'],
  ], [
    ['HCOOC₂H₅ bileşiğinin adı?', 'Etil metanoat', 'Metil etanoat', 'O’ya bağlı etil alkol kısmı, HCOO– metanoik asit kısmıdır.'],
    ['Etanoik asit ile metanolden hangi ester oluşur?', 'Metil etanoat', 'Etil metanoat', 'Alkolden metil, asitten etanoat gelir.'],
    ['Yağın NaOH ile tepkimesinin adı?', 'Sabunlaşma', 'Esterleşme', 'Ester bazla hidroliz olur; oluşan yağ asidi tuzu sabundur.'],
    ['Sıvı yağdan margarin üretiminde ne katılır?', 'H₂', 'H₂O', 'C=C bağlarına H₂ katılınca yağ doyar ve katılaşır.'],
    ['Muz kokusu veren ester?', 'İzopentil asetat', 'Etil bütanoat', 'Etil bütanoat ananas kokar.'],
  ]),
  'kim12-fosil': sorular([
    ['Fosil yakıtlar yenilenebilir enerji kaynaklarıdır.', false, 'Oluşmaları milyonlarca yıl sürer; yenilenemez kaynaklardır.'],
    ['Kükürtlü kömürün yanması asit yağmuruna katkıda bulunur.', true, 'Kükürt SO₂’ye, o da havada sülfürik aside dönüşür.'],
    ['Ayrımsal damıtmada büyük moleküllü kesimler kulenin üst kısmında toplanır.', false, 'Büyük moleküllerin kaynama noktası yüksektir; altta toplanırlar.'],
    ['Kraking büyük hidrokarbonları küçük moleküllere parçalar.', true, 'Isı ve katalizörle ağır kesimlerden benzin ve alken elde edilir.'],
    ['n-heptanın oktan sayısı 100 kabul edilir.', false, 'n-heptan 0, izooktan 100 kabul edilir.'],
    ['LPG havadan ağır olduğu için kaçakta yere çöker.', true, 'Propan ve bütanın mol kütlesi havanınkinden büyüktür.'],
  ], [
    ['Petrolün bileşenlerine ayrılması hangi özelliğe dayanır?', 'Kaynama noktası', 'Renk', 'Ayrımsal damıtma bileşenleri kaynama noktası farkıyla ayırır.'],
    ['Doğal gazın ana bileşeni?', 'Metan', 'Propan', 'Propan ve bütan LPG’nin bileşenleridir.'],
    ['Hangisi benzinin oktan sayısını yükseltir?', 'Dallanmış alkanlar', 'Düz zincirli alkanlar', 'n-heptan gibi düz zincirliler kolay vuruntu yapar.'],
    ['Katalitik konvertör CO’yu neye dönüştürür?', 'CO₂', 'C', 'Zehirli CO yükseltgenip CO₂ olur.'],
    ['C₁₄H₃₀ kırılınca C₇H₁₆ ile birlikte ne oluşur?', 'C₇H₁₄', 'C₇H₁₆', 'C: 14 − 7 = 7, H: 30 − 16 = 14; ürün C₇H₁₄ (alken).'],
  ]),
  'kim12-alternatif': sorular([
    ['Rüzgâr enerjisiyle elektrik üretilirken CO₂ salınmaz.', true, 'Türbin hareket enerjisini elektriğe çevirir; yanma yoktur.'],
    ['Hidrojen doğada serbest hâlde bol bulunduğu için birincil enerji kaynağıdır.', false, 'Hidrojen serbest bulunmaz, üretilmesi gerekir; enerji taşıyıcıdır.'],
    ['Biyodizel bitkisel yağlardan üretilebilir.', true, 'Bitkisel yağ metanolle tepkimeye girip yağ asidi metil esterine dönüşür.'],
    ['Nükleer santraller füzyon tepkimesiyle çalışır.', false, 'Santraller fisyonla çalışır; füzyon henüz santralde kullanılmıyor.'],
    ['Biyogazın başlıca yanıcı bileşeni metandır.', true, 'Atıkların oksijensiz çürümesiyle CH₄ ve CO₂ oluşur.'],
    ['Güneş kolektörü ışığı doğrudan elektriğe dönüştürür.', false, 'Kolektör suyu ısıtır; ışığı elektriğe güneş pili çevirir.'],
  ], [
    ['Hangisi yenilenebilir değildir?', 'Doğal gaz', 'Jeotermal', 'Doğal gaz bir fosil yakıttır.'],
    ['Nükleer santralde bölünen çekirdek?', 'U-235', 'H-1', 'Fisyonda ağır U-235 çekirdeği nötronla bölünür.'],
    ['Hidrojen yanınca ne oluşur?', 'Yalnız su', 'CO₂ ve su', 'Hidrojen karbon içermez; CO₂ oluşmaz.'],
    ['Biyoetanol hangi süreçle üretilir?', 'Mayalanma (fermantasyon)', 'Kraking', 'Şeker ve nişasta mayalanarak etanole dönüşür.'],
    ['Nükleer enerjinin başlıca sorunu?', 'Radyoaktif atık', 'Yüksek CO₂ salımı', 'Fisyon CO₂ salmaz; atığı ise uzun süre ışıma yapar.'],
  ]),
}
