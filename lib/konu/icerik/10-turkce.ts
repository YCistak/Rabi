import { kart, konu, program, sikli, soru, tema } from '../tip'

/**
 * 10. sınıf Türk Dili ve Edebiyatı — Maarif Modeli.
 *
 * Dört tema: **Sözün Ezgisi**, **Kelimelerin Ritmi**, **Dünden Bugüne**,
 * **Nesillerin Mirası**. Dil bilgisi konuları "Kelimelerin Ritmi" temasının
 * altında duruyor: tema zaten kelimenin kendisine bakıyor.
 *
 * Konu listesi bu derste `maarif.test.ts` tarafından denetlenmiyor; sebebi
 * 9. sınıf dosyasında yazılı (programın İçerik Çerçevesi burada konu değil
 * beceri sayıyor).
 */
export const turkce10 = program('turkce', 10, 'Sözün ezgisinden nesillerin mirasına', [
  tema('trk10-t1', 'Sözün Ezgisi', [
    konu('trk10-masal', 'Masal', [
      kart(
        'Masalın dünyası',
        'Yer ve zaman belirsiz, olaylar olağanüstüdür.\n"Bir varmış bir yokmuş" kalıbı bu belirsizliği kurar.',
      ),
      kart(
        'Bölümleri',
        'Beş bölüm sırayla gelir:\ndöşeme → serim → düğüm → çözüm → dilek\nDöşeme, masalı gerçek dünyadan koparmak için vardır.',
        {
          tur: 'akis',
          dikey: true,
          adimlar: [
            { ad: 'Döşeme', alt: 'tekerleme' },
            { ad: 'Serim' },
            { ad: 'Düğüm' },
            { ad: 'Çözüm' },
            { ad: 'Dilek', alt: 'kapanış', renk: 'soluk' },
          ],
        },
      ),
      kart(
        'Kişiler tiptir',
        'Masal kişileri gelişmez: iyi hep iyi, cimri hep cimridir.\nBu yüzden karakter değil, **tip** sayılırlar.',
        undefined,
        { not: 'Keloğlan her masalda aynı kurnaz Keloğlan; roman kahramanı gibi değişmez. Sınav \'karakter\' derse masal dışıdır.' },
      ),
      kart(
        'Olağanüstülük',
        'Dev, peri, konuşan hayvan ve sihirli nesneler masalın olağan ögeleridir.\nOkuyan bunları sorgulamaz.',
      ),
      kart(
        'Kalıp sözler',
        '- **Döşeme:** "Evvel zaman içinde, kalbur saman içinde…"\n- **Geçiş:** "Az gittik uz gittik, dere tepe düz gittik."\n- **Dilek:** "Onlar ermiş muradına, biz çıkalım kerevetine."',
      ),
      kart(
        'Sayılar ve motifler',
        '- **Kalıp sayılar:** 3, 7, 40 (üç kardeş, yedi kat yer, kırk gün)\n- **Motifler:** sihirli nesne, dev, peri, cadı, üç dilek\nAynı motif farklı milletlerin masallarında da görülür.',
      ),
      kart(
        'Anlatım özellikleri',
        '- Öyküleyici anlatım ağır basar.\n- Anlatıcı her şeyi bilir (ilahi bakış açısı).\n- Anlatım çoğunlukla duyulan geçmiş zamanla (-mış) yapılır.',
      ),
      kart(
        'Amacı',
        'Eğlendirirken ders verir.\nSonunda iyiler kazanır; masalın kurduğu adalet duygusu budur.',
      ),
      kart(
        'Masal türleri',
        '- **Olağanüstü masallar:** dev, peri, sihir\n- **Hayvan masalları:** konuşan hayvanlar\n- **Gülmece masalları:** güldürerek düşündürür.\n- **Zincirleme masallar:** olaylar birbirine eklenerek ilerler.',
      ),
      kart(
        'Masal ve fabl',
        'İkisi de ders verir. Fablı ayıran iki şey:\n- Kahramanları hayvandır.\n- Ders sonunda açıkça söylenir.',
      ),
      kart(
        'Masal, efsane, destan',
        '- **Masal:** inanılması beklenmez, eğlendirir.\n- **Efsane:** inanılır; bir yere ya da kişiye bağlıdır (Kız Kulesi).\n- **Destan:** bir milletin ortak olayını anlatır.',
      ),
      kart(
        'Masalı derleyenler',
        '- **Grimm Kardeşler:** Alman masallarını derledi.\n- **Pertev Naili Boratav:** Türk masallarını derleyip sınıfladı.\n- **Eflatun Cem Güney:** masalları çocuklar için yazıya geçirdi.',
      ),
    ], [
      soru('Masallarda yer ve zaman belirsizdir.', true, '"Evvel zaman içinde" kalıbı bu belirsizliği kuruyor.'),
      soru('Masal kişileri tip özelliği gösterir.', true, 'İyi ya da kötü olarak tek yönlü çizilirler; iç dünyaları anlatılmaz.'),
      soru('Masallar gerçekte yaşanmış olayları anlatır.', false, 'Tümüyle hayal ürünüdür; olağanüstü ögeler taşır.'),
      soru('Fabl ile masal aynı türdür.', false, 'Fablın kahramanları hayvanlardır ve sonunda açık bir ders verilir.'),
      sikli('Masalın başındaki tekerleme bölümüne ne denir?', ['Döşeme', 'Dilek'], 0, 'Döşeme masalı gerçek dünyadan koparır; dilek kapanış bölümü.'),
      sikli('Masalın amacı nedir?', ['Eğlendirirken ders vermek', 'Tarihî olayı belgelemek'], 0, 'Sonunda iyiler kazanır; masal adalet duygusu kurar.'),
      soru('Masalda olağanüstü ögeler sorgulanır.', false, 'Okuyan sorgulamaz.'),
      soru('Efsaneler bir yere ya da kişiye bağlıdır ve halk tarafından inanılır.', true, 'Masalın ise inanılması beklenmez.'),
      soru('Masallarda 3, 7, 40 gibi kalıp sayılar sık kullanılır.', true, 'Üç kardeş, yedi kat yer, kırk gün.'),
      soru('Masallar çoğunlukla gözlemci bakış açısıyla anlatılır.', false, 'Anlatıcı her şeyi bilir: ilahi bakış açısı.'),
      soru('Pertev Naili Boratav, Alman masallarını derlemiştir.', false, 'Alman masallarını Grimm Kardeşler derledi; Boratav Türk masallarını.'),
      sikli('"Az gittik uz gittik" hangi işlevi görür?', ['Geçiş kalıbı', 'Dilek'], 0, 'Dilek masalın kapanışındaki "Onlar ermiş muradına…"'),
      sikli('Olayların birbirine eklenerek ilerlediği masal türü?', ['Hayvan masalı', 'Zincirleme masal'], 1, 'Hayvan masalında kahramanlar konuşan hayvanlardır.'),
      sikli('Kız Kulesi\'ne bağlı anlatı hangi türdür?', ['Masal', 'Efsane'], 1, 'Belli bir yere bağlı ve inanılan anlatı efsanedir.'),
    ], [
      {
        soru: 'Masal kişileri neden karakter değil tip sayılır?',
        siklar: ['Değişip gelişmedikleri için', 'İsimleri olmadığı için'],
        dogru: 0,
        aciklama: {
          dogru: 'İyi hep iyi, cimri hep cimri; tek özellik, sıfır gelişim.',
          yanlis: 'İsim olup olmaması ölçüt değil. Tip, gelişmeyen ve tek özellikle tanımlanan kişidir; masal kişileri böyledir.',
        },
        kart: 3,
      },
      {
        soru: 'Bir yere bağlı olan ve halkın inandığı anlatı?',
        siklar: ['Efsane', 'Masal'],
        dogru: 0,
        aciklama: {
          dogru: 'Efsane inanılır ve bir yere ya da kişiye bağlıdır.',
          yanlis: 'Masalın inanılması beklenmez, yeri belirsizdir. İnanılan ve yere bağlı anlatı efsane.',
        },
        kart: 11,
      },
    ]),
    konu('trk10-anonim', 'Anonim Halk Edebiyatı', [
      kart(
        'Anonim ne demek?',
        'Söyleyeni belli değildir, halkın ortak ürünüdür.\nAğızdan ağıza geçtiği için birçok varyantı bulunur.',
      ),
      kart(
        'Halk edebiyatının üç kolu',
        '- **Anonim:** söyleyeni belli değil (türkü, mani, bilmece)\n- **Âşık edebiyatı:** sazlı, söyleyeni belli (Karacaoğlan)\n- **Dinî-tasavvufi (tekke):** tasavvufu anlatır (Yunus Emre)',
      ),
      kart(
        'Ortak biçim özellikleri',
        '- Hece ölçüsü (çoğunlukla 7’li, 8’li, 11’li)\n- Nazım birimi dörtlük\n- Çoğunlukla yarım uyak ve redif\n- Halkın konuştuğu sade dil',
      ),
      kart(
        'Türküler',
        'Ezgiyle söylenir; iki bölümden oluşur:\n- **Bent:** asıl sözler\n- **Kavuştak:** nakarat\nKonusuna göre ninni, ağıt ya da iş türküsü olabilir.',
      ),
      kart(
        'Türkü türleri',
        '- **Ezgiye göre:** uzun hava (serbest ritim), kırık hava (belli ritim)\n- **Konuya göre:** ninni, ağıt, iş, askerlik, kahramanlık, oyun türküleri',
      ),
      kart(
        'Ninni ve ağıt',
        '- **Ninni:** çocuğu uyutmak için ezgiyle söylenir; annenin dilekleri de içindedir.\n- **Ağıt:** ölümün ardından söylenir; ölenin iyiliği ve acı anlatılır.',
      ),
      kart(
        'Mani',
        '- **Ölçü:** yedili hece\n- **Uyak düzeni:** aaxa\n- **Yapı:** dört dize\nİlk iki dize çoğu zaman doldurmadır, asıl anlam son ikisindedir.',
      ),
      kart(
        'Anonim ürünler',
        'Hepsi sözlü gelenekten gelir.\nAma her biri farklı bir işi görür.',
        {
          tur: 'tablo',
          basliklar: ['Ürün', 'İşlevi'],
          satirlar: [
            ['Türkü', 'Ezgiyle anlatır'],
            ['Mani', 'Duygu iletir'],
            ['Bilmece', 'Buldurur'],
            ['Tekerleme', 'Ses oyunu'],
            ['Atasözü', 'Öğüt verir'],
          ],
        },
      ),
      kart(
        'Varyant nedir?',
        'Aynı ürünün yöreden yöreye değişmiş hâlidir.\nSözlü gelenekte tek bir "doğru metin" yoktur.',
        undefined,
        { not: '\'Çanakkale Türküsü\'nün İzmir ve Erzurum söylenişi farklı sözlerle var; ikisi de doğru, ikisi de varyant.' },
      ),
      kart(
        'Neden anonimleşir?',
        'Söyleyen unutulur ama söz kalır.\nHalk beğendiği ürünü tekrarlarken değiştirir ve sahiplenir.',
      ),
      kart(
        'Derleme',
        'Anonim ürünler 20. yüzyılda derlenip yazıya geçirildi.\nBugün bildiğimiz metinler bu derlemelerin ürünüdür.',
      ),
      kart(
        'Bilmece ve tekerleme',
        '- **Bilmece:** bir varlık dolaylı anlatılır, dinleyen bulur; çoğunlukla manzum.\n- **Tekerleme:** ses oyunu; masal döşemesinde ve çocuk oyunlarında kullanılır.',
      ),
      kart(
        'Nasreddin Hoca fıkraları',
        'Kısa, güldürürken düşündüren anlatılardır.\nZamanla Hoca’ya mal edilmiş anonim fıkralar da vardır.\nSonunda nükte, yani ince bir espri bulunur.',
      ),
    ], [
      soru('Anonim halk edebiyatı ürünlerinin söyleyeni belli değildir.', true, 'Ürün zamanla halkın ortak malı hâline gelmiş.'),
      soru('Mani dört dizeden oluşur ve uyak düzeni aaxa dır.', true, 'İlk iki dize çoğu zaman asıl sözü hazırlar.'),
      soru('Varyant, bir ürünün tek ve değişmez biçimidir.', false, 'Varyant, aynı ürünün yörelere göre değişen biçimleri.'),
      soru('Türküler yalnızca yazılı olarak aktarılmıştır.', false, 'Sözlü olarak aktarıldılar; derleme çalışmalarıyla yazıya geçirildiler.'),
      sikli('Türkünün nakarat bölümüne ne denir?', ['Bent', 'Kavuştak'], 1, 'Bent ve kavuştak.'),
      sikli('Hangisi anonim halk edebiyatı ürünüdür?', ['Gazel', 'Bilmece'], 1, 'Bilmece sözlü gelenekten gelir; gazel divan şiirinin nazım biçimi.'),
      sikli('Söyleyeni unutulan bir ürünü halk nasıl sahiplenir?', ['Tekrarlarken değiştirerek', 'Hiç değiştirmeden'], 0, 'Her anlatımda biraz değişir; ürün böylece halkın ortak malı olur.'),
      soru('Manide asıl anlam ilk iki dizededir.', false, 'Son ikisinde; ilk ikisi doldurma.'),
      soru('Âşık edebiyatında ürünün söyleyeni bellidir.', true, 'Karacaoğlan, Köroğlu gibi âşıklar adını son dörtlükte söyler.'),
      soru('Anonim halk şiirinde çoğunlukla aruz ölçüsü kullanılır.', false, 'Hece ölçüsü kullanılır; aruz divan şiirinin ölçüsü.'),
      soru('Ağıt, ölümün ardından söylenen türküdür.', true, 'Ölenin iyiliği ve bıraktığı acı anlatılır.'),
      soru('Uzun hava belli bir ritimle söylenen türküdür.', false, 'Belli ritimli olan kırık hava; uzun hava serbest ritimlidir.'),
      sikli('Yunus Emre halk edebiyatının hangi kolundadır?', ['Âşık edebiyatı', 'Dinî-tasavvufi'], 1, 'Tekke edebiyatının en büyük adı.'),
      sikli('Nasreddin Hoca fıkralarının sonunda ne bulunur?', ['Nükte', 'Dilek'], 0, 'Dilek masalın kapanış bölümü.'),
      sikli('Bir varlığı dolaylı anlatıp buldurmaya çalışan ürün?', ['Tekerleme', 'Bilmece'], 1, 'Tekerleme ses oyunudur.'),
    ], [
      {
        soru: 'Yedili hece ölçüsüyle, aaxa düzeninde dört dizelik anonim ürün?',
        siklar: ['Mani', 'Türkü'],
        dogru: 0,
        aciklama: {
          dogru: 'İlk iki dize doldurma, asıl anlam son ikisinde.',
          yanlis: 'Türkü ezgiyle söylenir, bent ve kavuştaktan oluşur. Dört dizelik 7\'li ürün mani.',
        },
        kart: 7,
      },
      {
        soru: 'Serbest ritimle söylenen türküye ne denir?',
        siklar: ['Kırık hava', 'Uzun hava'],
        dogru: 1,
        aciklama: {
          dogru: 'Uzun hava serbest ritimlidir; kırık havanın ritmi bellidir.',
          yanlis: 'Kırık hava belli bir ritimle söylenir. Serbest ritimli türkü uzun hava.',
        },
        kart: 5,
      },
    ]),
    konu('trk10-ahenk', 'Ahenk Ögeleri', [
      kart(
        'Ahenk nedir?',
        'Şiirdeki ses uyumudur.\nÖlçü, uyak, redif, aliterasyon ve asonansla kurulur.',
      ),
      kart(
        'Ahengin araçları',
        'Beş araç birlikte çalışır.\nŞiirin sesi bunların bileşiminden çıkar.',
        {
          tur: 'tablo',
          basliklar: ['Öge', 'Nasıl?'],
          satirlar: [
            ['Ölçü', 'Hece düzeni'],
            ['Uyak', 'Ses benzerliği'],
            ['Redif', 'Aynı ek ya da söz'],
            ['Aliterasyon', 'Ünsüz tekrarı'],
            ['Asonans', 'Ünlü tekrarı'],
          ],
        },
      ),
      kart(
        'Aliterasyon ve asonans',
        '- **Aliterasyon:** aynı ünsüzün tekrarı\n- **Asonans:** aynı ünlünün tekrarı\nİkisi de dizeyi kulakta tutar.',
      ),
      kart(
        'İç uyak ve seci',
        '- **İç uyak:** uyak dize sonunda değil, dizenin içinde kurulur.\n- **Seci:** düzyazıda cümle sonlarının uyaklı olması\nSeci, düzyazıya da şiirin sesini katar.',
      ),
      kart(
        'Tekrir ve nakarat',
        '- **Tekrir:** bir sözcüğün ya da sözün yinelenmesi\n- **Nakarat:** her bölümün sonunda aynen dönen dize\nTürküdeki kavuştak bir nakarattır.',
      ),
      kart(
        'Ritim',
        'Vurgulu ve vurgusuz hecelerin düzenli sırasıdır.\n- **Ölçülü şiirde:** ritmi ölçü kurar.\n- **Serbest şiirde:** ritmi söyleyiş sağlar.',
      ),
      kart(
        'Serbest şiirde ahenk',
        'Ölçü ve uyak olmasa da ahenk kaybolmaz.\nRitmi tekrar, sözcük seçimi ve dize uzunluğu kurar.',
      ),
      kart(
        'Üç gelenekte ahenk',
        '- **Halk şiiri:** hece ölçüsü, yarım uyak, redif\n- **Divan şiiri:** aruz, tam ve zengin uyak\n- **Modern şiir:** serbest ölçü; ahenk iç ses ve tekrarla',
      ),
      kart(
        'Vurgu ve tonlama',
        'Şiir sesli okunmak için de yazılır.\nVurgulanan sözcük ve sesin iniş çıkışı anlamı değiştirebilir.\nAynı dize coşkuyla ya da hüzünle okunduğunda başka şey söyler.',
      ),
      kart(
        'Ses ve anlam birlikte',
        'Ahenk süs değildir.\n- **Ağır sesler:** ağırlık duygusu\n- **İnce, hızlı sesler:** kıvraklık duygusu',
        undefined,
        { not: '\'Karşı yaka\'da k ve a tekrarı sertlik, \'yeşil yeşil\' yumuşaklık verir: aliterasyon anlamı taşır, süslemez.' },
      ),
      kart(
        'Ahengi incelemek',
        '- Ölçüyü bul: hece mi, aruz mu, serbest mi?\n- Redifi at, uyağı adlandır.\n- Tekrar eden ses, sözcük ve dizeleri işaretle.\n- Sesin anlatılan duyguyu nasıl desteklediğini söyle.',
      ),
    ], [
      soru('Aliterasyon ünsüz, asonans ünlü tekrarıdır.', true, 'İkisi de sese dayalı ahenk araçları.'),
      soru('Serbest şiirde de ahenk sağlanabilir.', true, 'Ölçü ve uyak olmadan ses tekrarları ve söyleyişle kuruluyor.'),
      soru('Ahengi sağlayan tek araç ölçüdür.', false, 'Uyak, redif, ses tekrarları ve vurgu da ahenge katkı sağlıyor.'),
      soru('Ses tekrarlarının şiirin anlamıyla bir ilgisi yoktur.', false, 'Tekrarlanan ses çoğu zaman anlatılan duyguyu destekliyor.'),
      sikli('Dize sonunda tekrar eden aynı ek ya da sözcüğe ne denir?', ['Uyak', 'Redif'], 1, 'Redif aynı görevdeki ek ya da sözcük; uyak redifin önündeki ses benzerliği.'),
      sikli('Ağır sesler ne duygusu üretir?', ['Kıvraklık', 'Ağırlık'], 1, 'Ses ve anlam birlikte.'),
      soru('Ölçülü şiirde ritmi ölçü kurar.', true, 'Serbest şiirde ise ritmi söyleyiş, tekrar ve dize uzunluğu sağlar.'),
      soru('Seci, düzyazıda cümle sonlarının uyaklı olmasıdır.', true, 'Düzyazıya şiirin sesini katar.'),
      soru('Nakarat, şiirde yalnızca bir kez geçen dizedir.', false, 'Nakarat her bölümün sonunda aynen döner.'),
      soru('Divan şiirinde ahengi hece ölçüsü kurar.', false, 'Divan şiirinin ölçüsü aruz; hece halk şiirinin.'),
      sikli('Uyağın dize içinde kurulmasına ne denir?', ['İç uyak', 'Redif'], 0, 'Redif dize sonundaki aynı ek ya da sözcük.'),
      sikli('Türküdeki kavuştak neye örnektir?', ['Seci', 'Nakarat'], 1, 'Seci düzyazıdaki uyaktır.'),
      sikli('Modern şiirde ahengi çoğunlukla ne kurar?', ['Aruz ölçüsü', 'İç ses ve tekrar'], 1, 'Serbest şiirde ölçü zorunluluğu yok.'),
    ], [
      {
        soru: '"Sessiz sedasız süzüldü" dizesinde hangi ahenk ögesi var?',
        siklar: ['Asonans', 'Aliterasyon (s tekrarı)'],
        dogru: 1,
        aciklama: {
          dogru: 'Aynı ünsüzün tekrarı aliterasyon; ünlü tekrarı asonans olurdu.',
          yanlis: 'Asonans aynı ünlünün tekrarı. Burada tekrar eden s ünsüzü: aliterasyon.',
        },
        kart: 3,
      },
      {
        soru: 'Her bölümün sonunda aynen dönen dizeye ne denir?',
        siklar: ['Nakarat', 'İç uyak'],
        dogru: 0,
        aciklama: {
          dogru: 'Nakarat bölüm sonlarında yinelenir; türküdeki kavuştak da böyledir.',
          yanlis: 'İç uyak dizenin içindeki ses benzerliği. Bölüm sonlarında dönen dize nakarat.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('trk10-t2', 'Kelimelerin Ritmi', [
    konu('trk10-imge', 'Şiirde İmge ve İleti', [
      kart(
        'İmge',
        'Sözcüklerin alışılmadık birleşimiyle zihinde kurulan yeni görüntüdür.\nŞiiri düzyazıdan ayıran asıl araçtır.',
      ),
      kart(
        'Duyulara göre imge',
        '- **Görsel:** "kızıl bir akşam"\n- **İşitsel:** "rüzgârın uğultusu"\n- **Dokunsal:** "buz gibi eller"\n- **Koku:** "ıhlamur kokulu sokak"\n- **Tat:** "acı bir sabah"',
      ),
      kart(
        'Sembol (simge)',
        'Somut bir varlığın soyut bir kavramı temsil etmesidir.\n- **Güvercin:** barış\n- **Gül:** sevgili, güzellik\n- **Yol:** hayat, arayış\nİmge bir kez kurulur; sembol gelenekte yerleşmiştir.',
      ),
      kart(
        'Açık ve örtük ileti',
        '- **Açık ileti:** metinde doğrudan söylenir.\n- **Örtük ileti:** çıkarım yoluyla bulunur.\nŞiirde ileti çoğunlukla örtüktür.',
        {
          tur: 'tablo',
          basliklar: ['Açık ileti', 'Örtük ileti'],
          satirlar: [
            ['Metinde yazılı', 'Çıkarılır'],
            ['Tek anlam', 'Yoruma açık'],
            ['Öğretici metin', 'Şiir, öykü'],
          ],
        },
      ),
      kart(
        'Şiirde gerçeklik',
        'Şiirdeki gerçeklik **kurmaca** gerçekliktir.\nAnlatılan yaşanmış olsa bile şiirde dönüşmüştür.',
      ),
      kart(
        'Çağrışım',
        'Bir sözcük kendi anlamının yanında başka anlamları da uyandırır.\nŞiirin çok anlamlılığı buradan doğar.',
      ),
      kart(
        'Üslup',
        'Şairin kendine özgü söyleyiş biçimidir:\n- Sözcük seçimi\n- Dize uzunluğu\n- İmge kurma alışkanlığı',
      ),
      kart(
        'Şiirde bağlam',
        'Şiir yazıldığı dönemden ve şairin hayatından izler taşır.\nBağlamı bilmek yorumu güçlendirir ama metnin yerine geçmez.\nÖrnek: Âkif’in şiirleri Kurtuluş Savaşı’yla birlikte okunur.',
      ),
      kart(
        'Metinlerarasılık',
        'Bir metin başka bir metne gönderme yapabilir.\nŞiirde Leyla ile Mecnun anılıyorsa, okur o hikâyeyi bildiği ölçüde anlamı tamamlar.\nTelmih sanatı bunun eski adıdır.',
      ),
      kart(
        'Şiir çözümleme yolu',
        '- **Yapı:** nazım birimi, ölçü, uyak\n- **Tema ve konu:** egemen duygu ne?\n- **İmge ve sanat:** hangi görüntüler kurulmuş?\n- **İleti:** okura ne söyleniyor?\n- **Bağlam:** şair ve dönem',
      ),
      kart(
        'Yorum sınırsız değil',
        'Şiir çok anlamlıdır ama her yorum geçerli değildir.\nYorum, metinden delil gösterebiliyorsa ayakta durur.',
        undefined,
        { not: '\'Kalbimin kapısı\' imgesini \'şair marangoz\' diye yorumlayamazsın; yorum metindeki başka dizelerle tutmalı.' },
      ),
    ], [
      soru('İmge, okurun zihninde yeni bir tasarım oluşturur.', true, 'Sözcüğün sözlük anlamının ötesine geçiyor.'),
      soru('Şiirdeki ileti açık ya da örtük olabilir.', true, 'Kimi şiir söyleyeceğini doğrudan söyler, kimi sezdirir.'),
      soru('Şiir yorumlanırken metinden bağımsız her anlam kabul edilir.', false, 'Yorum, metnin verileriyle desteklenmek zorunda.'),
      soru('Şiirdeki gerçeklik günlük hayattaki gerçeklikle aynıdır.', false, 'Şiir gerçeği dönüştürerek yeni bir gerçeklik kuruyor.'),
      sikli('Sözcüğün başka anlamları da uyandırması?', ['Üslup', 'Çağrışım'], 1, 'Çok anlamlılık.'),
      sikli('Şairin kendine özgü söyleyişi?', ['İleti', 'Üslup'], 1, 'Sözcük seçimi, dize uzunluğu.'),
      soru('İmge, şiiri düzyazıdan ayıran temel araçlardandır.', true, 'Sözcüklerin alışılmadık birleşimi zihinde yeni bir görüntü kuruyor.'),
      soru('"Rüzgârın uğultusu" işitsel bir imgedir.', true, 'İşitme duyusuna seslenir.'),
      soru('Sembolün anlamı her şiirde şair tarafından yeniden kurulur.', false, 'Sembol gelenekte yerleşmiştir (güvercin: barış); imge ise yeni kurulur.'),
      soru('Bağlamı bilmek şiirin yorumunu güçlendirebilir.', true, 'Ama yorum yine metnin verilerine dayanmalı.'),
      sikli('"Buz gibi eller" hangi duyuya seslenir?', ['Görme', 'Dokunma'], 1, 'Soğukluk dokunmayla algılanır.'),
      sikli('Bir şiirin başka bir metne gönderme yapması?', ['Metinlerarasılık', 'Çağrışım'], 0, 'Eski edebiyattaki adı telmih.'),
      sikli('Şiirde "yol" çoğunlukla neyin sembolüdür?', ['Hayat, arayış', 'Barış'], 0, 'Barışın sembolü güvercin.'),
    ], [
      {
        soru: 'Şiirde ileti çoğunlukla nasıl verilir?',
        siklar: ['Açık, doğrudan', 'Örtük, çıkarımla'],
        dogru: 1,
        aciklama: {
          dogru: 'Şiir imge ve çağrışımla konuşur; ileti okurun çıkarımıyla bulunur.',
          yanlis: 'Açık ileti öğretici metinde. Şiirde ileti imgelerin ardında, okurun çıkarımıyla bulunur.',
        },
        kart: 4,
      },
      {
        soru: 'Güvercinin barışı temsil etmesine ne denir?',
        siklar: ['İmge', 'Sembol'],
        dogru: 1,
        aciklama: {
          dogru: 'Gelenekte yerleşmiş temsil sembol; imge şairin yeni kurduğu görüntü.',
          yanlis: 'İmge şairin kurduğu yeni görüntüdür. Güvercin=barış gelenekte yerleşmiş: sembol.',
        },
        kart: 3,
      },
    ]),
    konu('trk10-sozcuk-turleri', 'Sözcük Türleri', [
      kart(
        'Sekiz tür',
        'Sözcükler iki büyük öbeğe ayrılır:\n- **İsim soylu:** isim, sıfat, zamir, zarf, edat, bağlaç, ünlem\n- **Fiil**',
        {
          tur: 'tablo',
          basliklar: ['İsim soylu', 'Fiil'],
          satirlar: [
            ['İsim, sıfat, zamir', 'Fiil'],
            ['Zarf, edat', ''],
            ['Bağlaç, ünlem', ''],
          ],
        },
      ),
      kart(
        'İsim (ad)',
        'Varlıkları karşılar. Şöyle sınıflandırılır:\n- Özel – cins\n- Somut – soyut\n- Tekil – çoğul – topluluk',
      ),
      kart(
        'Sıfat',
        'İsmi niteler ya da belirtir.\n- **Niteleme sıfatı:** "nasıl?"\n- **Belirtme sıfatı:** "hangi? kaç?"',
      ),
      kart(
        'Belirtme sıfatının türleri',
        '- **İşaret:** bu ev, şu kapı\n- **Sayı:** iki (asıl), ikinci (sıra), ikişer (üleştirme), yarım (kesir)\n- **Belgisiz:** birkaç, her, bazı\n- **Soru:** hangi, kaç, ne',
      ),
      kart(
        'Sıfat ve isim tamlaması',
        '- **Sıfat tamlaması:** sıfat + isim (kırmızı elma)\n- **Belirtili isim tamlaması:** iki ek de var (okulun bahçesi)\n- **Belirtisiz:** yalnız sondaki ek (okul bahçesi)\n- **Takısız:** ek yok (demir kapı)',
      ),
      kart(
        'Zamir (adıl)',
        'İsmin yerini tutar. Çeşitleri:\n- Kişi ve işaret zamiri\n- Belgisiz ve soru zamiri\n- İlgi zamiri (-ki)',
      ),
      kart(
        'Zamirlere örnekler',
        '- **Kişi:** ben, sen, o; dönüşlülük: kendi\n- **İşaret:** bu, şu, o, bunlar\n- **Belgisiz:** biri, hepsi, kimse\n- **Soru:** kim, ne, hangisi',
      ),
      kart(
        'Sıfat mı zamir mi?',
        '- **Sonra isim geliyorsa:** sıfat ("bu kitap")\n- **İsmin yerini tutuyorsa:** zamir ("bu benim")',
      ),
      kart(
        'Zarf (belirteç)',
        'Fiili, sıfatı ya da başka bir zarfı etkiler.\nAyrımın anahtarı: sıfat isme, zarf fiile bağlanır.',
      ),
      kart(
        'Zarf türleri',
        '- **Durum:** nasıl? (hızlı koştu)\n- **Zaman:** ne zaman? (yarın gelir)\n- **Yer-yön:** nereye? (içeri girdi)\n- **Miktar:** ne kadar? (çok güzel)\n- **Soru:** niçin, nasıl, ne zaman',
      ),
      kart(
        'Edat, bağlaç, ünlem',
        '- **Edat:** tek başına anlamsız, sözcükler arası ilgi kurar.\n- **Bağlaç:** bağlar; çıkarılınca anlam bozulmaz.\n- **Ünlem:** duygu bildirir.',
      ),
      kart(
        'Tür göreve göre değişir',
        'Sözcüğün türü cümledeki görevine göre belirlenir.\n"Güzel" kimi cümlede sıfat, kimi cümlede zarftır.',
        undefined,
        { not: '\'Güzel kız\' sıfat, \'güzel konuştu\' zarf, \'güzeller yarıştı\' isim. Aynı sözcük üç tür; cümleye bak.' },
      ),
      kart(
        'Zarf mı sıfat mı testi',
        '- **"Hızlı araba":** araba nasıl? → sıfat\n- **"Hızlı koştu":** nasıl koştu? → zarf\nAynı sözcük, bağlandığı şeye göre tür değiştirir.',
      ),
    ], [
      soru('Bir sözcüğün türü, cümledeki görevine göre değişebilir.', true, '"Güzel" kimi cümlede sıfat, kimi cümlede zarf olabiliyor.'),
      soru('Sıfatlar isimden önce gelerek onu niteler ya da belirtir.', true, 'İsim olmadan sıfat da olmaz.'),
      soru('"Bu" sözcüğü her cümlede sıfattır.', false, 'Adın yerini tutuyorsa zamir olur: "Bu, benim kitabım."'),
      soru('Edatlar tek başına anlamlı sözcüklerdir.', false, 'Tek başına anlamları yok; cümlede başka sözcüklerle anlam kazanıyorlar.'),
      sikli('"Hangi kitap?" sorusuna cevap veren?', ['Niteleme sıfatı', 'Belirtme sıfatı'], 1, 'Niteleme "nasıl".'),
      sikli('İsmin yerini tutan sözcük?', ['Zarf', 'Zamir'], 1, 'Kişi, işaret, belgisiz, soru, ilgi.'),
      sikli('Fiili etkileyen sözcük?', ['Sıfat', 'Zarf'], 1, 'Sıfat isme bağlanır.'),
      sikli('"gibi, kadar, için" hangi türdendir?', ['Zamir', 'Edat'], 1, 'Tek başına anlamları yok; sözcükler arasında ilgi kurarlar.'),
      sikli('"Sürü" sözcüğü hangi tür isimdir?', ['Topluluk ismi', 'Soyut isim'], 0, 'Tekil biçimde bir topluluğu karşılıyor; somut bir varlık.'),
      sikli('"ve, ile, ama" sözcükleri hangi türdendir?', ['Bağlaç', 'Edat'], 0, 'Sözcükleri ya da cümleleri bağlarlar; çıkarılınca anlam bozulmaz.'),
      soru('"Kitabınki daha yeni" cümlesindeki -ki, ilgi zamiridir.', true, '"Kitabınki" = kitabının kitabı; -ki bir ismin yerini tutuyor.'),
      soru('"Okulun bahçesi" belirtisiz isim tamlamasıdır.', false, 'İki ek de var (-un, -si): belirtili isim tamlaması.'),
      soru('"İkişer" sözcüğü üleştirme sayı sıfatıdır.', true, 'Eşit paylaştırmayı bildirir.'),
      sikli('"Yarın gelir" cümlesinde "yarın" hangi zarftır?', ['Zaman zarfı', 'Durum zarfı'], 0, '"Ne zaman?" sorusuna cevap veriyor.'),
      sikli('"Kendi" hangi zamir türüdür?', ['İşaret zamiri', 'Dönüşlülük zamiri'], 1, 'Kişi zamirlerinin dönüşlü biçimi.'),
    ], [
      {
        soru: '"Bu kalem benim" cümlesinde "bu" hangi türdendir?',
        siklar: ['Sıfat', 'Zamir'],
        dogru: 0,
        aciklama: {
          dogru: 'Kendinden sonra isim (kalem) geliyor: işaret sıfatı.',
          yanlis: 'Zamir ismin yerini tutar ("Bu benim"). Burada "bu", "kalem" ismini belirtiyor: sıfat.',
        },
        kart: 8,
      },
      {
        soru: '"İçeri girdi" cümlesinde "içeri" hangi zarftır?',
        siklar: ['Miktar zarfı', 'Yer-yön zarfı'],
        dogru: 1,
        aciklama: {
          dogru: '"Nereye girdi?" sorusuna cevap veriyor: yer-yön zarfı.',
          yanlis: 'Miktar zarfı "ne kadar" sorusunu karşılar. "Nereye?" sorusunun cevabı yer-yön zarfı.',
        },
        kart: 10,
      },
    ]),
    konu('trk10-fiil', 'Fiiller', [
      kart(
        'Fiil nedir?',
        'İş, oluş ya da durum bildirir.\nMastar eki (-mak, -mek) alabiliyorsa fiildir.',
      ),
      kart(
        'Anlamına göre fiiller',
        '- **İş fiili:** nesne alabilir (yazmak, kırmak).\n- **Durum fiili:** nesne almaz, özne kendi yapar (uyumak, gülmek).\n- **Oluş fiili:** kendiliğinden, zamanla olur (büyümek, sararmak).',
      ),
      kart(
        'Yapısına göre fiiller',
        '- **Basit:** gel-, oku-\n- **Türemiş:** yapım ekiyle (su-la-, baş-la-)\n- **Birleşik:** iki sözcükten (yardım etmek, yapıver-, düşüp kalk-)',
      ),
      kart(
        'Kip nedir?',
        'Fiilin zamanını ya da dileğini gösteren ektir.\nHer çekimli fiilde bir kip vardır.',
        {
          tur: 'tablo',
          basliklar: ['Haber kipleri', 'Dilek kipleri'],
          satirlar: [
            ['Görülen geçmiş', 'İstek'],
            ['Duyulan geçmiş', 'Şart'],
            ['Şimdiki', 'Gereklilik'],
            ['Gelecek, geniş', 'Emir'],
          ],
        },
      ),
      kart(
        'Haber ve dilek ayrımı',
        '- **Haber kipleri:** zaman bildirir.\n- **Dilek kipleri:** zaman bildirmez.\n"Gelmeli" bir zaman değil, bir gereklilik anlatır.',
      ),
      kart(
        'Kip ekleri',
        '- **-dı:** geldi\n- **-mış:** gelmiş\n- **-yor:** geliyor\n- **-acak:** gelecek\n- **-r, -ar:** gelir\n- **-a (istek):** gele\n- **-sa (şart):** gelse\n- **-malı:** gelmeli',
      ),
      kart(
        'Kişi ekleri',
        '- **Zamir kökenli:** geliyor-um, gelecek-sin\n- **İyelik kökenli:** geldi-m, gelse-n\n- **Emir:** gel, gelsin, gelin\n- **İstek:** gele-lim',
      ),
      kart(
        'Çatı',
        '- **Özneye göre:** etken, edilgen, dönüşlü, işteş\n- **Nesneye göre:** geçişli, geçişsiz\nÇatı yalnızca yüklemi fiil olan cümlelerde aranır.',
      ),
      kart(
        'Edilgen çatı',
        'Yapanı belli olmayan cümle kurar: "Kapı açıldı."\nÖzne sözde öznedir; işi kimin yaptığı söylenmez.',
      ),
      kart(
        'Çatı ekleri',
        '- **Edilgen (-l, -n):** yıkandı (biri yıkadı)\n- **Dönüşlü (-n, -l):** yıkandı (kendini yıkadı)\n- **İşteş (-ş):** selamlaştılar\n- **Ettirgen (-dır, -t):** yazdırdı',
      ),
      kart(
        'Ek fiil',
        'İki işi vardır:\n- İsim soylu sözcükleri yüklem yapar.\n- Basit zamanlı fiili birleşik zamanlı yapar.',
      ),
      kart(
        'Birleşik zamanlar',
        'Ek fiil çekimli fiile üç biçimde gelir:\n- **Hikâye (-dı):** geliyordu\n- **Rivayet (-mış):** geliyormuş\n- **Şart (-sa):** geliyorsa',
      ),
      kart(
        'Fiilimsi',
        'Fiilden türer ama cümlede isim, sıfat ya da zarf görevi görür.\nFiilimsi bulunan cümle **birleşik cümledir**.',
      ),
      kart(
        'Üç fiilimsi',
        '- **İsim-fiil:** -ma, -ış, -mak\n- **Sıfat-fiil:** -an, -acak, -dık, -mış, -ası, -maz\n- **Zarf-fiil:** -ip, -arak, -ken, -ince',
      ),
      kart(
        'Fiilimsi tanıma',
        'Önce eke bak, sonra göreve:\n- **İsim yerine geçiyorsa:** isim-fiil (koşma)\n- **İsmi niteliyorsa:** sıfat-fiil (koşan çocuk)\n- **Fiili niteliyorsa:** zarf-fiil (koşarak geldi)',
        undefined,
        { not: '-ma/-ış/-mak isim-fiil (koşma, geliş); -an/-acak/-dık/-mış sıfat-fiil (koşan, gelecek); -ip/-ken/-erek zarf-fiil.' },
      ),
    ], [
      soru('Ek fiil, isim soylu sözcükleri yüklem yapar.', true, '"Öğrenciydi" örneğinde yüklemi kuran ek fiil.'),
      soru('Fiilimsiler cümlede isim, sıfat ya da zarf görevinde kullanılır.', true, 'Fiil kökünden türerler ama fiil gibi çekimlenmezler.'),
      soru('Edilgen çatılı cümlelerde işi yapan gerçek özne bellidir.', false, 'Gerçek özne söylenmez; cümlede sözde özne bulunur.'),
      soru('Dilek kipleri zaman bildirir.', false, 'Zaman bildirenler haber kipleri; dilek kipleri istek, şart ve gereklilik anlatır.'),
      sikli('Mastar eki alabilen sözcük?', ['Fiil', 'İsim'], 0, '-mak/-mek.'),
      sikli('"Okuyacaksın" fiilinde hangi kip var?', ['Gelecek zaman', 'Gereklilik'], 0, '-acak gelecek zaman eki; bir haber kipi.'),
      sikli('"Geliyordu" fiili hangi zamanlıdır?', ['Birleşik zamanlı', 'Basit zamanlı'], 0, 'Şimdiki zaman + ek fiilin hikâyesi; ek fiilin ikinci işi birleşik zaman kurmak.'),
      sikli('"-arak, -ken, -ince" ekleri hangi fiilimsiyi kurar?', ['Zarf-fiil', 'İsim-fiil'], 0, 'İsim-fiil -ma, -ış, -mak.'),
      sikli('Fiilimsi bulunan cümle nasıl cümledir?', ['Basit', 'Birleşik'], 1, 'Yan cümle.'),
      sikli('Çatı hangi cümlelerde aranır?', ['Bütün cümlelerde', 'Yüklemi fiil olanlarda'], 1, 'İsim cümlesinde çatı yok.'),
      soru('"-an, -acak, -mış" ekleri sıfat-fiil kurar.', true, '-dık, -ası, -maz da.'),
      soru('"Sararmak" bir oluş fiilidir.', true, 'Kendiliğinden, zamanla gerçekleşir.'),
      soru('"Uyumak" bir iş fiilidir.', false, 'Nesne almaz ve özne kendi yapar: durum fiili.'),
      soru('"Geldim" fiilindeki kişi eki iyelik kökenlidir.', true, '-dı ve -sa eklerinden sonra iyelik kökenli ekler gelir.'),
      soru('"Selamlaştılar" fiili ettirgen çatılıdır.', false, 'İş karşılıklı yapılıyor: işteş çatı (-ş).'),
      sikli('"Geliyormuş" hangi birleşik zamandır?', ['Rivayet', 'Hikâye'], 0, 'Hikâye -dı ile kurulur: geliyordu.'),
      sikli('"Yazdırdı" fiilinin çatısı?', ['Dönüşlü', 'Ettirgen'], 1, 'İş başkasına yaptırılıyor.'),
    ], [
      {
        soru: '"Kapı açıldı" cümlesinin çatısı?',
        siklar: ['Edilgen', 'Etken'],
        dogru: 0,
        aciklama: {
          dogru: 'Açan belli değil; kapı sözde özne.',
          yanlis: 'Etkende işi yapan özne bellidir ("Ali kapıyı açtı"). Yapanı söylenmeyen "açıldı" edilgen.',
        },
        kart: 9,
      },
      {
        soru: '"Büyümek" hangi tür fiildir?',
        siklar: ['İş fiili', 'Oluş fiili'],
        dogru: 1,
        aciklama: {
          dogru: 'Kendiliğinden, zamanla gerçekleşir: oluş fiili.',
          yanlis: 'İş fiili nesne alabilir (kırmak). Büyümek kendiliğinden olur: oluş fiili.',
        },
        kart: 2,
      },
    ]),
  ]),
  tema('trk10-t3', 'Dünden Bugüne', [
    konu('trk10-destan', 'Destan', [
      kart(
        'Doğal ve yapma destan',
        '- **Doğal destan:** halkın ortak ürünü, söyleyeni belirsiz\n- **Yapma destan:** belli bir şair tarafından yazılır',
      ),
      kart(
        'Oluşum aşamaları',
        'Doğal destan üç basamakta oluşur.\nSon basamakta bir şair onu yazıya geçirir.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Doğuş', alt: 'olay yaşanır' },
            { ad: 'Yayılma', alt: 'anlatılır' },
            { ad: 'Derleme', alt: 'yazıya geçer' },
          ],
        },
      ),
      kart(
        'Ortak özellikler',
        '- Olağanüstü olaylar ve kahramanlar vardır.\n- Millî duyguyu ve ortak belleği taşır.\n- Sözlü doğar, sonradan yazıya geçer.\n- Çoğunlukla nazımla, hece ölçüsüyle söylenir.',
      ),
      kart(
        'Türk destanları',
        '- **İslamiyet öncesi:** Alp Er Tunga, Oğuz Kağan, Bozkurt, Ergenekon, Göç\n- **İslamiyet sonrası:** Manas, Satuk Buğra Han, Battalname, Danişmendname',
      ),
      kart(
        'Destanlar ve toplulukları',
        '- **Saka:** Alp Er Tunga, Şu\n- **Hun:** Oğuz Kağan\n- **Göktürk:** Bozkurt, Ergenekon\n- **Uygur:** Türeyiş, Göç\n- **Kırgız:** Manas',
      ),
      kart(
        'Oğuz Kağan Destanı',
        'Oğuz’un olağanüstü doğuşunu ve cihan hâkimiyeti ülküsünü anlatır.\nGök kurt ordunun önünde yol gösterir.\nOğuz’un altı oğlu (Gün, Ay, Yıldız, Gök, Dağ, Deniz) Oğuz boylarının atasıdır.',
      ),
      kart(
        'Dünya destanları',
        '- **İlyada, Odysseia:** Yunan (Homeros)\n- **Şehname:** İran (Firdevsi)\n- **Gılgamış:** Sümer\n- **Kalevala:** Fin\n- **Nibelungen:** Alman\n- **Mahabharata:** Hint',
      ),
      kart(
        'Destan kahramanı',
        'Milletin ortak değerlerini taşır.\nKişisel değil, toplumsal bir amacı vardır.',
      ),
      kart(
        'Olağanüstülük',
        'Kahramanın doğuşu, atı ve silahı olağanüstüdür.\nBu ögeler destanı efsaneye yaklaştırır ama tarihsel çekirdek durur.',
      ),
      kart(
        'Destan ve tarih',
        'Destan tarihsel bir olaydan doğar ama tarih değildir.\nOlayı halkın gözünden ve abartarak anlatır.',
        undefined,
        { not: 'Ergenekon\'da demir dağ eritilir (olağanüstü) ama Göktürklerin çıkışı tarihsel çekirdek. Belge değil, iz.' },
      ),
      kart(
        'Dede Korkut Hikâyeleri',
        'Destandan halk hikâyesine geçişin eseridir.\n12 hikâyede Oğuzların yaşayışı anlatılır.\nNazım ile nesir iç içedir.',
      ),
      kart(
        'Yapma destan örnekleri',
        '- **Kuvâyi Milliye Destanı:** Nâzım Hikmet\n- **Üç Şehitler Destanı:** Fazıl Hüsnü Dağlarca\n- **Çanakkale Destanı:** Fazıl Hüsnü Dağlarca\nKonuları çoğunlukla Kurtuluş Savaşı ve Çanakkale’dir.',
      ),
    ], [
      soru('Doğal destanlar toplumun ortak belleğinde oluşup sonradan yazıya geçirilir.', true, 'Söyleyeni belli değildir.'),
      soru('Ergenekon Destanı Göktürklere aittir.', true, 'Göktürklerin demir dağı eritip çıkışını anlatır.'),
      soru('Destanlar tarihî olayları olduğu gibi aktarır.', false, 'Tarihî bir çekirdek taşır ama olağanüstü ögelerle işlenir.'),
      soru('Oğuz Kağan Destanı bir yapma destandır.', false, 'Doğal destandır; halkın belleğinde oluşup sonradan yazıya geçmiş.'),
      sikli('İslamiyet sonrası Türk destanı hangisidir?', ['Battalname', 'Ergenekon'], 0, 'Ergenekon öncesi.'),
      sikli('Destan kahramanının amacı?', ['Toplumsal', 'Kişisel'], 0, 'Milletin ortak değerleri.'),
      soru('Destan kahramanının doğuşu, atı ve silahı çoğu zaman olağanüstüdür.', true, 'Bu ögeler destanı efsaneye yaklaştırır; tarihsel çekirdek yine durur.'),
      sikli('Destandan halk hikâyesine geçişi gösteren eser?', ['Dede Korkut Hikâyeleri', 'Leyla ile Mecnun'], 0, 'Leyla ile Mecnun divan edebiyatında bir mesnevi.'),
      soru('Manas Destanı Kırgız Türklerine aittir.', true, 'Dünyanın en uzun destanlarından biri.'),
      soru('Şehname, Yunan destanıdır.', false, 'Firdevsi\'nin eseri, İran destanı; Yunan destanları İlyada ve Odysseia.'),
      soru('Oğuz Kağan Destanı\'nda orduya gök kurt yol gösterir.', true, 'Kurt motifi Türk destanlarında kılavuzluğu temsil eder.'),
      soru('Kuvâyi Milliye Destanı doğal destandır.', false, 'Nâzım Hikmet\'in yazdığı yapma destan.'),
      sikli('Alp Er Tunga Destanı hangi topluluğa aittir?', ['Sakalar', 'Uygurlar'], 0, 'Uygurların destanları Türeyiş ve Göç.'),
      sikli('Kalevala hangi milletin destanıdır?', ['Alman', 'Fin'], 1, 'Almanların destanı Nibelungen.'),
    ], [
      {
        soru: 'Belli bir şair tarafından yazılan destana ne denir?',
        siklar: ['Doğal destan', 'Yapma destan'],
        dogru: 1,
        aciklama: {
          dogru: 'Doğal destan halkın ortak ürünü, söyleyeni belirsiz.',
          yanlis: 'Doğal destanın söyleyeni bilinmez (Oğuz Kağan). Şairi belli olan yapma destan (Üç Şehitler Destanı).',
        },
        kart: 1,
      },
      {
        soru: 'Bozkurt ve Ergenekon destanları kime aittir?',
        siklar: ['Uygurlar', 'Göktürkler'],
        dogru: 1,
        aciklama: {
          dogru: 'İkisi de Göktürk destanı; Uygurların destanları Türeyiş ve Göç.',
          yanlis: 'Uygurların destanları Türeyiş ve Göç. Bozkurt ve Ergenekon Göktürklerin.',
        },
        kart: 5,
      },
    ]),
    konu('trk10-mesnevi', 'Mesnevi ve Halk Hikâyesi', [
      kart(
        'Mesnevi',
        'Divan edebiyatında uzun konuları anlatmaya yarayan nazım biçimidir.\nHer beyit kendi içinde uyaklıdır: aa, bb, cc',
      ),
      kart(
        'Neden mesnevi?',
        'Beyit sayısı sınırsız olduğu için romanın işini görürdü.\nAşk, savaş, öğüt ve din konuları böyle anlatıldı.',
      ),
      kart(
        'Öne çıkan mesneviler',
        '- **Leyla ile Mecnun:** Fuzuli\n- **Hüsn ü Aşk:** Şeyh Galib\n- **Mesnevi:** Mevlânâ (Farsça)',
      ),
      kart(
        'Mesnevinin bölümleri',
        '- **Tevhit:** Allah’ın birliği\n- **Münacat:** Allah’a yakarış\n- **Naat:** Peygamber övgüsü\n- **Sebeb-i telif:** eserin yazılış sebebi\n- **Asıl hikâye**\n- **Hatime:** sonuç, dua',
      ),
      kart(
        'Konularına göre mesneviler',
        '- **Aşk:** Leyla ile Mecnun (Fuzuli)\n- **Dinî:** Mevlid (Süleyman Çelebi)\n- **Tasavvufi:** Hüsn ü Aşk (Şeyh Galib)\n- **Mizahi:** Harname (Şeyhi)',
      ),
      kart(
        'Hamse',
        'Bir şairin yazdığı beş mesneviye **hamse** denir.\nTürk edebiyatında ilk hamseyi **Ali Şir Nevai** yazdı.\nHamse yazmak şairlik gücünün kanıtı sayılırdı.',
      ),
      kart(
        'Halk hikâyesi',
        'Destanla roman arasında bir türdür.\nNazım ile nesir karışıktır; âşık, hikâyeyi sazıyla anlatır.',
      ),
      kart(
        'Halk hikâyesinin yapısı',
        '- **Döşeme:** tekerleme gibi bir girişle başlar.\n- **Olay:** nesirle anlatılır, duygulu yerlerde türkü girer.\n- **Dua:** hikâye dinleyene iyi dileklerle biter.',
      ),
      kart(
        'Halk hikâyesi türleri',
        '- **Aşk hikâyeleri:** Kerem ile Aslı, Arzu ile Kamber, Tahir ile Zühre\n- **Kahramanlık hikâyeleri:** Köroğlu',
      ),
      kart(
        'Üç anlatı yan yana',
        'Aynı işi gören üç tür farklı çevrelerde gelişti.\nDilleri de birbirinden ayrıldı.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Çevre'],
          satirlar: [
            ['Destan', 'Sözlü, halk'],
            ['Mesnevi', 'Divan, saray'],
            ['Halk hikâyesi', 'Âşık geleneği'],
          ],
        },
        { not: 'Mesnevi saray (aruz, Farsça sözcük), halk hikâyesi köy meydanı (saz, nesir+nazım), destan boy (sözlü). Aynı iş, üç dil.' },
      ),
      kart(
        'Fabl',
        'Kahramanları hayvan olan, sonunda ders veren kısa anlatıdır.\nFablın temel aracı kişileştirmedir.',
      ),
      kart(
        'Sözlüden yazılıya',
        'Sözlü ürün her anlatımda değişir.\nYazıya geçince tek bir metne dönüşür, varyantları durur.',
      ),
    ], [
      soru('Mesnevide her beyit kendi içinde uyaklıdır.', true, 'Uyak yükü hafif olduğu için uzun anlatıya elverişli.'),
      soru('Mesnevi nazım biçimi uzun anlatılar için elverişlidir.', true, 'Beyit sayısında bir sınır yok.'),
      soru('Halk hikâyeleri yalnızca nazımla anlatılır.', false, 'Nazım ile nesir bir arada kullanılır; türküler araya girer.'),
      soru('Fablın kahramanları insanlardır.', false, 'Kahramanları çoğunlukla hayvanlardır ve insan gibi konuşurlar.'),
      sikli('Leyla ile Mecnun kimin eseridir?', ['Şeyh Galib', 'Fuzuli'], 1, 'Şeyh Galib Hüsn ü Aşk.'),
      sikli('Mesnevi hangi çevrede gelişti?', ['Âşık geleneği', 'Divan, saray'], 1, 'Aruzla yazılan divan nazım biçimi; âşık geleneği halk hikâyesini üretti.'),
      sikli('Mevlânâ\'nın Mesnevi\'si hangi dille yazıldı?', ['Farsça', 'Türkçe'], 0, 'Dönemin Anadolu Selçuklu çevresinde edebiyat dili Farsçaydı.'),
      soru('Sözlü ürün yazıya geçince varyantları durur.', true, 'Tek metne dönüşür.'),
      soru('Naat, Allah\'ın birliğini anlatan bölümdür.', false, 'Naat Peygamber övgüsü; Allah\'ın birliğini anlatan tevhit.'),
      soru('Türk edebiyatında ilk hamseyi Ali Şir Nevai yazmıştır.', true, 'Beş mesneviden oluşan hamse şairlik gücünün kanıtı sayılırdı.'),
      soru('Köroğlu bir aşk hikâyesidir.', false, 'Köroğlu kahramanlık hikâyesi; Kerem ile Aslı aşk hikâyesi.'),
      sikli('Mevlid\'in yazarı kimdir?', ['Süleyman Çelebi', 'Şeyhi'], 0, 'Şeyhi\'nin mizahi mesnevisi Harname.'),
      sikli('Eserin yazılış sebebinin anlatıldığı bölüm?', ['Hatime', 'Sebeb-i telif'], 1, 'Hatime sonuç ve dua bölümü.'),
      sikli('Halk hikâyesi nasıl biter?', ['Dua ile', 'Soru ile'], 0, 'Âşık dinleyene iyi dileklerde bulunur.'),
    ], [
      {
        soru: 'Mesnevinin uyak düzeni nasıldır?',
        siklar: ['Her beyit kendi içinde (aa, bb, cc)', 'Bütün beyitler aynı uyakta'],
        dogru: 0,
        aciklama: {
          dogru: 'Bu düzen beyit sayısını sınırsız yapar; uzun konular böyle anlatılır.',
          yanlis: 'Tümü aynı uyakta olsaydı beyit sayısı sınırlı kalırdı. Mesnevi her beyti kendi içinde uyaklayarak sınırsız uzar.',
        },
        kart: 1,
      },
      {
        soru: 'Bir şairin yazdığı beş mesneviye ne denir?',
        siklar: ['Divan', 'Hamse'],
        dogru: 1,
        aciklama: {
          dogru: 'Hamse "beşli" demek; Türk edebiyatında ilki Ali Şir Nevai\'nin.',
          yanlis: 'Divan şairin şiirlerini topladığı kitap. Beş mesnevinin adı hamse.',
        },
        kart: 6,
      },
    ]),
  ]),
  tema('trk10-t4', 'Nesillerin Mirası', [
    konu('trk10-milli', 'Millî Edebiyat', [
      kart(
        'Doğuşu',
        '1911’de Selanik’te başlar:\n- **Genç Kalemler** dergisi\n- **"Yeni Lisan"** makalesi',
      ),
      kart(
        'Dilde sadeleşme',
        'Arapça ve Farsça kurallar atılmak istendi.\nAmaç, konuşma dilini yazı dili yapmaktı.',
      ),
      kart(
        'Üç ilke',
        'Akım üç kararla tanımlanır:\n- Sade dil\n- Hece ölçüsü\n- Yerli konu',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Sade dil' },
            { ad: 'Hece ölçüsü' },
            { ad: 'Yerli konu' },
          ],
        },
        { not: 'Aruz yerine hece (Servetifünun\'a karşı), Osmanlıca yerine sade Türkçe, bireysel yerine millî konu. Üçü de tepki.' },
      ),
      kart(
        'Ölçü ve konu',
        'Aruz yerine **hece ölçüsü** benimsendi.\nKonular Anadolu’ya ve halkın hayatına döndü.',
      ),
      kart(
        'Neden bu dönemde?',
        'Savaşlar ve toprak kayıpları bir kimlik arayışı doğurdu.\nEdebiyat da halka ve kendi diline döndü.',
      ),
      kart(
        'Dönemin fikir akımları',
        '- **Osmanlıcılık:** bütün unsurları bir arada tutmak\n- **İslamcılık:** Müslümanları birleştirmek\n- **Batıcılık:** Batı’yı örnek almak\n- **Türkçülük:** Türk kimliğini öne çıkarmak',
      ),
      kart(
        'Genç Kalemler kadrosu',
        '- **Ömer Seyfettin:** hikâye, "Yeni Lisan"\n- **Ali Canip Yöntem:** eleştiri ve şiir\n- **Ziya Gökalp:** fikir önderi\nDerginin çıkış amacı dili sadeleştirmekti.',
      ),
      kart(
        'Temsilcileri',
        '- **Hikâye:** Ömer Seyfettin\n- **Şiir ve fikir:** Ziya Gökalp, Mehmet Emin Yurdakul\n- **Roman:** Yakup Kadri, Halide Edip, Reşat Nuri',
      ),
      kart(
        'Ziya Gökalp ve Mehmet Emin',
        '- **Ziya Gökalp:** Türkçülüğün kuramcısı; Türkçülüğün Esasları, Kızılelma\n- **Mehmet Emin Yurdakul:** "Millî şair"; hece ölçüsüyle ilk şiir "Cenge Giderken"',
      ),
      kart(
        'Dönemin bağımsızları',
        'Aynı yıllarda akıma katılmadan yazanlar da vardı:\n- **Mehmet Âkif:** Safahat, İstiklal Marşı; aruz ama sade dil\n- **Yahya Kemal:** aruz, İstanbul, "Kendi Gök Kubbemiz"',
      ),
      kart(
        'Servetifünun ile karşıtlığı',
        '- **Servetifünun:** ağır dil, bireysel konular\n- **Millî Edebiyat:** sade dil, toplumsal konular',
      ),
    ], [
      soru(
        'Millî Edebiyat sanatçıları ağır ve süslü bir dil kullanmıştır.',
        false,
        'Tabloda görüldüğü gibi bu dönemin dili sade ve konuşma diline yakındır.',
        {
          tur: 'tablo',
          basliklar: ['Dönem', 'Dil anlayışı'],
          satirlar: [
            ['Servetifünun', 'Ağır ve süslü'],
            ['Millî Edebiyat', 'Sade, konuşma dili'],
          ],
        },
      ),
      soru('Millî Edebiyat döneminde hece ölçüsü benimsenmiştir.', true, 'Halk şiirinin ölçüsü olarak görüldüğü için tercih edildi.'),
      soru('Millî Edebiyat ta konular Anadolu ve halk hayatından seçilmiştir.', true, 'Edebiyatın kapısı İstanbul dışına açıldı.'),
      soru('Ömer Seyfettin, Millî Edebiyat\'ın şiir alanındaki temsilcisidir.', false, 'Hikâyenin temsilcisidir; şiirde Ziya Gökalp ve Mehmet Emin Yurdakul öne çıkar.'),
      sikli('Genç Kalemler dergisi hangi şehirde çıktı?', ['Selanik', 'İstanbul'], 0, 'Akım 1911\'de Selanik\'te başladı.'),
      sikli('Yeni Lisan makalesi neyi amaçladı?', ['Konuşma dilini yazı dili yapmak', 'Arapça öğretmek'], 0, 'Sadeleşme.'),
      sikli('Ziya Gökalp hangi akımın temsilcisidir?', ['Millî Edebiyat', 'Servetifünun'], 0, 'Ömer Seyfettin de.'),
      soru('Millî Edebiyat, savaşlar ve toprak kayıplarının doğurduğu kimlik arayışıyla güçlendi.', true, 'Edebiyat bu dönemde halka ve kendi diline döndü.'),
      soru('Mehmet Âkif Ersoy şiirlerinde hece ölçüsünü kullanmıştır.', false, 'Âkif aruzu kullandı ama dili sade tuttu.'),
      soru('Türkçülüğün Esasları Ziya Gökalp\'in eseridir.', true, 'Gökalp Türkçülük akımının kuramcısı.'),
      soru('Yahya Kemal Millî Edebiyat akımına katılmış bir hececidir.', false, 'Akıma katılmadı ve aruzu sürdürdü.'),
      sikli('"Millî şair" diye anılan kimdir?', ['Mehmet Emin Yurdakul', 'Ali Canip Yöntem'], 0, 'Hece ölçüsüyle ilk şiir sayılan "Cenge Giderken"in şairi.'),
      sikli('Batı\'yı örnek almayı savunan akım?', ['İslamcılık', 'Batıcılık'], 1, 'İslamcılık Müslümanları birleştirmeyi amaçlar.'),
      sikli('Safahat kimin eseridir?', ['Yahya Kemal', 'Mehmet Âkif'], 1, 'İstiklal Marşı\'nın da şairi.'),
    ], [
      {
        soru: 'Millî Edebiyat hangi dergi ve makaleyle başlar?',
        siklar: ['Genç Kalemler, Yeni Lisan', 'Servetifünun, Edebiyat-ı Cedide'],
        dogru: 0,
        aciklama: {
          dogru: '1911, Selanik; sade dil çağrısı buradan.',
          yanlis: 'Servetifünun, Millî Edebiyat\'ın karşı çıktığı önceki akım. Başlangıç 1911\'de Genç Kalemler\'deki Yeni Lisan makalesi.',
        },
        kart: 1,
      },
      {
        soru: 'Hece ölçüsüyle yazılan ilk şiir sayılan "Cenge Giderken" kimin?',
        siklar: ['Ziya Gökalp', 'Mehmet Emin Yurdakul'],
        dogru: 1,
        aciklama: {
          dogru: 'Mehmet Emin Yurdakul, "Millî şair".',
          yanlis: 'Ziya Gökalp akımın fikir önderi. "Cenge Giderken" Mehmet Emin Yurdakul\'un.',
        },
        kart: 9,
      },
    ]),
    konu('trk10-milli-turler', 'Millî Edebiyatta Türler', [
      kart(
        'Şiir',
        'Hece ölçüsü ve sade dil öne çıktı.\n"Beş Hececiler" bu anlayışı sürdürdü.',
      ),
      kart(
        'Beş Hececiler',
        '- Faruk Nafiz Çamlıbel\n- Enis Behiç Koryürek\n- Halit Fahri Ozansoy\n- Orhan Seyfi Orhon\n- Yusuf Ziya Ortaç\nFaruk Nafiz’in "Han Duvarları" memleketçi şiirin simgesidir.',
      ),
      kart(
        'Hikâye',
        '**Ömer Seyfettin** hikâyeyi hem sadeleşmenin hem millî bilincin aracı yaptı.\nTürk edebiyatında olay hikâyesinin ustasıdır.',
      ),
      kart(
        'Refik Halit ve memleket hikâyesi',
        '**Refik Halit Karay**, Memleket Hikâyeleri’nde Anadolu’yu gerçekçi bir gözle anlattı.\nSürgünde tanıdığı taşra hayatı hikâyelerine konu oldu.',
      ),
      kart(
        'Roman',
        'Anadolu ilk kez romanın merkezine geçti.\nÖrnek: Çalıkuşu, Yaban',
      ),
      kart(
        'Dönemin romancıları',
        '- **Halide Edip:** Ateşten Gömlek, Vurun Kahpeye\n- **Reşat Nuri:** Çalıkuşu, Yaprak Dökümü\n- **Yakup Kadri:** Kiralık Konak, Yaban\n- **Refik Halit:** Yezidin Kızı',
      ),
      kart(
        'Anadolu’ya bakış',
        '- **Yaban:** aydının halka uzaklığını anlatır.\n- **Çalıkuşu:** Anadolu’ya gitmeyi bir görev olarak anlatır.\nİkisi aynı sorunun iki yüzüdür.',
        undefined,
        { not: 'Yaban: aydın köylüye yabancı, köylü aydına düşman. Çalıkuşu: Anadolu\'ya gitmek görev. Aynı dönem, iki tavır.' },
      ),
      kart(
        'Tiyatro ve deneme',
        'Millî konular sahneye de taşındı.\nGazete yazıları ve denemeler sadeleşmeyi geniş kitleye yaydı.\nTiyatroda Musahipzade Celal’in İstanbul Efendisi öne çıkar.',
      ),
      kart(
        'Edebiyat ve toplum',
        'Bu dönemde edebiyat iki işi birlikte üstlendi:\n- Sanat kaygısı\n- Toplumu biçimlendirme',
      ),
      kart(
        'Cumhuriyet’e miras',
        'Sade dil ve Anadolu konusu, Cumhuriyet dönemi edebiyatının çıkış noktası oldu.\nKopuş değil, süreklilik var.',
      ),
      kart(
        'Ömer Seyfettin’den örnekler',
        '- **Kaşağı:** vicdan ve pişmanlık\n- **Pembe İncili Kaftan:** onur, tarihî olay\n- **Forsa:** kahramanlık\nHikâyeleri kısa, olay merkezli ve sade dillidir.',
      ),
    ], [
      soru('Millî Edebiyat döneminde roman ve hikâyede Anadolu insanı işlenmiştir.', true, 'Mekân İstanbul dan Anadolu ya taşındı.'),
      soru('Ömer Seyfettin dönemin hikâye türündeki önemli adlarındandır.', true, 'Sade dille yazdığı hikâyeler dönemin dil anlayışını yansıtıyor.'),
      soru('Millî Edebiyat sanatçıları toplumsal konulardan uzak durmuştur.', false, 'Toplumsal sorunları doğrudan ele aldılar.'),
      soru('Bu dönemin birikimi Cumhuriyet Dönemi edebiyatını etkilememiştir.', false, 'Dil ve konu anlayışı Cumhuriyet edebiyatına doğrudan miras kaldı.'),
      sikli('Hece ölçüsünü sürdüren şair topluluğu?', ['Beş Hececiler', 'Yedi Meşaleciler'], 0, 'Sade dil.'),
      sikli('Çalıkuşu ne anlatır?', ['Anadolu\'ya gitmeyi görev olarak', 'Aydının halka uzaklığını'], 0, 'Yaban uzaklığı anlatır.'),
      sikli('"Pembe İncili Kaftan" kimin hikâyesidir?', ['Ömer Seyfettin', 'Reşat Nuri'], 0, 'Ömer Seyfettin tarihî olayları kısa, olay merkezli hikâyelere dönüştürdü.'),
      soru('Gazete yazıları ve denemeler, sadeleşmeyi geniş kitleye yaydı.', true, 'Sade dil yalnızca şiir ve romanda değil gündelik yazıda da yerleşti.'),
      sikli('"Kaşağı" hikâyesi hangi duyguyu işler?', ['Kahramanlık', 'Vicdan ve pişmanlık'], 1, 'Anlatıcı, kardeşine attığı iftiranın pişmanlığını taşır.'),
      soru('Faruk Nafiz Çamlıbel Beş Hececiler arasındadır.', true, '"Han Duvarları" memleketçi şiirin simgesi.'),
      soru('Memleket Hikâyeleri Ömer Seyfettin\'in eseridir.', false, 'Refik Halit Karay\'ın eseri; Anadolu\'yu gerçekçi gözle anlatır.'),
      soru('Ateşten Gömlek Kurtuluş Savaşı\'nı anlatan bir Halide Edip romanıdır.', true, 'Vurun Kahpeye de aynı dönemi işler.'),
      sikli('Yaprak Dökümü kimin romanıdır?', ['Reşat Nuri', 'Yakup Kadri'], 0, 'Yakup Kadri\'nin romanları Kiralık Konak ve Yaban.'),
    ], [
      {
        soru: 'Aydının halka uzaklığını anlatan roman hangisidir?',
        siklar: ['Çalıkuşu', 'Yaban'],
        dogru: 1,
        aciklama: {
          dogru: 'Yakup Kadri\'nin Yaban\'ı aydın-köylü kopukluğunu anlatır.',
          yanlis: 'Çalıkuşu Anadolu\'ya gitmeyi görev olarak anlatır. Aydının halka yabancılığı Yaban\'ın konusu.',
        },
        kart: 7,
      },
      {
        soru: '"Han Duvarları" şiiri kimindir?',
        siklar: ['Faruk Nafiz Çamlıbel', 'Mehmet Emin Yurdakul'],
        dogru: 0,
        aciklama: {
          dogru: 'Beş Hececilerden Faruk Nafiz; memleketçi şiirin simgesi.',
          yanlis: 'Mehmet Emin "Cenge Giderken"in şairi. Han Duvarları Faruk Nafiz Çamlıbel\'in.',
        },
        kart: 2,
      },
    ]),
  ]),
])
