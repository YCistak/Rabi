import { kart, konu, program, tema } from '../tip'

/**
 * 9. sınıf Kimya — Maarif Modeli.
 *
 * Üç tema: **Etkileşim**, **Çeşitlilik**, **Sürdürülebilirlik**. Eski
 * programdaki "Kimyanın Temel Kanunları", mol kavramı, karışımlar ve
 * asit-baz hesabı 9. sınıfta **yok** — bu yüzden burada da yok.
 */
export const kimya9 = program('kimya', 9, [
  tema('kim9-t1', 'Etkileşim', [
    konu('kim9-hayat', 'Kimya Hayattır', [
      kart(
        'Kimya neyi inceler?',
        'Maddenin yapısını, özelliklerini ve değişimini inceler. Yediğimiz ilaçtan giydiğimiz kumaşa kadar her şey kimyanın konusu.',
      ),
      kart(
        'Alt dalları',
        'Organik, anorganik, analitik, fizikokimya ve biyokimya. Organik kimya karbon bileşiklerine, analitik kimya "ne var, ne kadar var" sorusuna bakar.',
      ),
      kart(
        'Simyadan kimyaya',
        'Simya deneyseldi ama amacı altın elde etmek ve ölümsüzlüktü. Kimya, ölçme ve tekrarlanabilirlikle bilim oldu.',
      ),
      kart(
        'Laboratuvar güvenliği',
        'Uyarı işaretlerini tanı, asidi suya ekle (suyu aside değil), kimyasalı koklama ve tatma, kokuyu elinle yönlendirerek al.',
      ),
      kart(
        'Kimyacı nerede çalışır?',
        'İlaç, gıda, boya, kozmetik, enerji ve arıtma sektörleri; ayrıca kalite kontrol ve adli tıp laboratuvarları.',
      ),
    ]),
    konu('kim9-atom', 'Atomun Yapısı', [
      kart(
        'Atom modelleri',
        'Dalton doluydu; Thomson üzümlü keke benzetti; Rutherford çekirdeği buldu; Bohr elektronu katmanlara yerleştirdi; modern model olasılık bulutu.',
      ),
      kart(
        'Tanecikler',
        'Proton (+) ve nötron (yüksüz) çekirdekte, elektron (−) çevresinde. Atomun kütlesi neredeyse tamamen çekirdektedir.',
      ),
      kart(
        'Atom numarası kimliktir',
        'Proton sayısı elementi belirler; değişirse element değişir. Nötr atomda proton sayısı = elektron sayısı.',
      ),
      kart(
        'İzotop',
        'Proton sayısı aynı, nötron sayısı farklı atomlar. Kimyasal özellikleri aynı, kütleleri farklıdır.',
      ),
      kart(
        'İyon',
        'Elektron veren atom katyon (+), alan atom anyon (−) olur. Proton sayısı hiç değişmez.',
      ),
    ]),
    konu('kim9-elektron', 'Elektron Dizilimi ve Orbitaller', [
      kart(
        'Orbital nedir?',
        'Elektronun bulunma olasılığının en yüksek olduğu bölge. Kesin yörünge değil, bulut gibi düşün.',
      ),
      kart(
        'Orbital türleri',
        's küresel ve 1 tane, p sekiz şeklinde ve 3 tane, d 5, f 7 tanedir. Her orbitalde en fazla 2 elektron bulunur.',
      ),
      kart(
        'Aufbau ilkesi',
        'Elektron en düşük enerjili orbitalden başlayarak yerleşir: 1s 2s 2p 3s 3p 4s 3d… 4s, 3d’den önce dolar.',
      ),
      kart(
        'Hund kuralı',
        'Aynı enerjili orbitallere elektronlar önce birer birer, aynı yönde yerleşir; sonra eşleşmeye başlar.',
      ),
      kart(
        'Değerlik elektronu',
        'En dış katmandaki elektron sayısı. Elementin kimyasal davranışını belirleyen tek şey odur.',
      ),
    ]),
    konu('kim9-periyodik', 'Periyodik Tablo', [
      kart(
        'Sıralama ölçütü',
        'Mendeleyev kütleye göre sıralamıştı; modern tablo **artan atom numarasına** göre dizilir.',
      ),
      kart(
        'Periyot ve grup',
        'Yatay sıra periyot, katman sayısını verir. Dikey sütun grup, değerlik elektron sayısını ve benzer özellikleri gösterir.',
      ),
      kart(
        'Önemli gruplar',
        '1A alkali metaller (çok aktif), 2A toprak alkali, 7A halojenler, 8A soy gazlar (kararlı, tepkimeye girmez).',
      ),
      kart(
        'Metal, ametal, yarı metal',
        'Metaller elektron verir, parlak ve iletkendir. Ametaller elektron alır. Yarı metaller (Si, B) ikisi arasındadır, yarı iletken yapımında kullanılır.',
      ),
    ]),
    konu('kim9-ozellik', 'Periyodik Özellikler', [
      kart(
        'Atom yarıçapı',
        'Grupta aşağı inildikçe artar (katman eklenir), periyotta sağa gidildikçe azalır (çekirdek çekimi artar).',
      ),
      kart(
        'İyonlaşma enerjisi',
        'Elektron koparmak için gereken enerji. Sağa ve yukarı gidildikçe artar. En yüksek soy gazlarda.',
      ),
      kart(
        'Elektronegatiflik',
        'Bağdaki elektronu çekme gücü. Sağa ve yukarı artar; en yüksek flor (F).',
      ),
      kart(
        'Metalik özellik',
        'İyonlaşma enerjisinin tersi yönde: solda ve aşağıda en yüksektir.',
      ),
      kart(
        'İyon yarıçapı',
        'Katyon kendi atomundan küçüktür (katman kaybeder), anyon büyüktür (itme artar).',
      ),
    ]),
  ]),
  tema('kim9-t2', 'Çeşitlilik', [
    konu('kim9-bag', 'Kimyasal Bağlar', [
      kart(
        'Neden bağ kurulur?',
        'Atomlar soy gaz düzenine ulaşıp kararlı olmak ister. Bağ, enerjinin düştüğü yerde kurulur.',
      ),
      kart(
        'İyonik bağ',
        'Metal elektron verir, ametal alır; zıt yükler çeker. Sert, kırılgan, yüksek erime noktalı; suda çözünüp iletken olur.',
      ),
      kart(
        'Kovalent bağ',
        'İki ametal elektronlarını **ortaklaşır**. Apolar kovalentte elektron eşit paylaşılır (H₂), polar kovalentte çekim eşit değildir (HCl).',
      ),
      kart(
        'Metalik bağ',
        'Metal katyonları, ortak elektron denizinde yüzer. Elektronlar serbest olduğu için metaller iletken, dövülebilir ve parlaktır.',
      ),
      kart(
        'Lewis yapısı',
        'Değerlik elektronları nokta ile gösterilir. Oktet kuralı: atomlar son katmanda 8 elektrona ulaşmak ister — hidrojen 2 ile yetinir.',
      ),
    ]),
    konu('kim9-polarlik', 'Molekül Polarlığı', [
      kart(
        'Bağ polarlığı',
        'İki atomun elektronegatiflik farkı büyüdükçe bağ daha polar olur. Fark çok büyürse bağ iyoniğe döner.',
      ),
      kart(
        'Molekül polarlığı ayrı bir şey',
        'Bağlar polar olsa da geometri simetrikse molekül apolar olur. CO₂ bunun klasik örneği: iki polar bağ birbirini götürür.',
      ),
      kart(
        'Su neden polar?',
        'Açılı geometrisi yüzünden bağ polarlıkları birbirini götürmez. Suyun çözücülük gücü buradan gelir.',
      ),
      kart(
        'Benzer benzeri çözer',
        'Polar madde polar çözücüde, apolar madde apolar çözücüde çözünür. Yağ suda bu yüzden çözünmez.',
      ),
    ]),
    konu('kim9-adlandirma', 'Bileşik Adlandırma', [
      kart(
        'İyonik bileşikler',
        'Önce metal, sonra ametal yazılır: NaCl sodyum klorür. Ametalin sonuna "-ür/-it" eki gelir.',
      ),
      kart(
        'Değerliği değişen metaller',
        'Fe, Cu, Pb gibi metallerin yükü parantez içinde Roma rakamıyla yazılır: CuSO₄ bakır(II) sülfat.',
      ),
      kart(
        'Kovalent bileşikler',
        'Atom sayısı ön ekle belirtilir: mono, di, tri, tetra. CO karbon monoksit, CO₂ karbon dioksit.',
      ),
      kart(
        'Sık kullanılan kökler',
        'SO₄²⁻ sülfat, NO₃⁻ nitrat, CO₃²⁻ karbonat, PO₄³⁻ fosfat, OH⁻ hidroksit, NH₄⁺ amonyum.',
      ),
    ]),
    konu('kim9-etkilesim', 'Moleküller Arası Etkileşimler', [
      kart(
        'Bağdan zayıftır',
        'Moleküller arası çekim, molekülün içindeki bağdan çok daha zayıftır. Suyu kaynatınca kopan bu çekimlerdir, O–H bağı değil.',
      ),
      kart(
        'London kuvvetleri',
        'Bütün moleküllerde vardır. Molekül büyüdükçe güçlenir — bu yüzden büyük apolar moleküllerin kaynama noktası daha yüksektir.',
      ),
      kart(
        'Dipol-dipol',
        'Polar moleküller arasındaki çekim. London’dan güçlüdür.',
      ),
      kart(
        'Hidrojen bağı',
        'H atomu F, O ya da N’a bağlıysa ortaya çıkan en güçlü moleküller arası çekim. Suyun yüksek kaynama noktası ve buzun suda yüzmesi bundandır.',
      ),
    ]),
    konu('kim9-hal', 'Sıvı ve Katıların Özellikleri', [
      kart(
        'Buhar basıncı',
        'Moleküller arası çekim zayıfsa buharlaşma kolay, buhar basıncı yüksektir. Kolonya alkolü bu yüzden çabuk uçar.',
      ),
      kart(
        'Kaynama noktası',
        'Buhar basıncının dış basınca eşitlendiği sıcaklık. Dağda basınç düşük olduğu için su 100 °C’nin altında kaynar.',
      ),
      kart(
        'Yüzey gerilimi',
        'Yüzeydeki moleküller içeri çekilir, sıvı kendini büzer. Su damlasının yuvarlaklığı ve iğnenin suda durması bu yüzden.',
      ),
      kart(
        'Adezyon ve kohezyon',
        'Kohezyon aynı moleküllerin, adezyon farklı yüzeylerin çekimidir. Su camda tırmanır (adezyon güçlü), cıva kendini toplar (kohezyon güçlü).',
      ),
      kart(
        'Viskozite',
        'Akmaya karşı direnç. Moleküller arası çekim arttıkça artar, sıcaklık arttıkça azalır — bal ısıtılınca akışkanlaşır.',
      ),
    ]),
  ]),
  tema('kim9-t3', 'Sürdürülebilirlik', [
    konu('kim9-nano', 'Nanoparçacıklar', [
      kart(
        'Nano ne kadar küçük?',
        'Metrenin milyarda biri. Bir maddenin boyutu nano ölçeğe indiğinde rengi, dayanımı ve tepkime hızı değişebilir.',
      ),
      kart(
        'Yüzey/hacim oranı',
        'Parçacık küçüldükçe hacme düşen yüzey artar. Tepkimeler yüzeyde olduğu için nano boyutta çok daha etkin olur.',
      ),
      kart(
        'Kullanım alanları',
        'Gümüş nanoparçacık antibakteriyel kumaşta, titanyum dioksit güneş kreminde, karbon nanotüp hafif ve dayanıklı malzemede.',
      ),
      kart(
        'Riski de var',
        'Küçüklükleri sayesinde hücre zarından geçebilirler. Çevredeki uzun vadeli etkileri hâlâ araştırılıyor.',
      ),
    ]),
    konu('kim9-yesil', 'Yeşil Kimya', [
      kart(
        'Temel fikir',
        'Atığı sonradan temizlemek yerine **hiç oluşturmamak**. Yeşil kimyanın birinci ilkesi budur.',
      ),
      kart(
        'Atom ekonomisi',
        'Girenlerin ne kadarının ürüne dönüştüğü. Yüksek atom ekonomisi, az atık demektir.',
      ),
      kart(
        'Güvenli çözücü',
        'Zehirli ve uçucu çözücüler yerine su ya da çözücüsüz yöntemler tercih edilir.',
      ),
      kart(
        'Yenilenebilir ham madde',
        'Petrol yerine bitkisel kaynak kullanmak, süreci sürdürülebilir kılar.',
      ),
    ]),
  ]),
])
