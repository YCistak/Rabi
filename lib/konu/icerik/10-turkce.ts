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
        'Yer ve zaman belirsizdir, olaylar olağanüstüdür. "Bir varmış bir yokmuş" kalıbı bu belirsizliği kurar.',
      ),
      kart(
        'Bölümleri',
        'Beş bölüm sırayla gelir ve ilki masalı gerçek dünyadan koparmak için vardır.',
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
        'Masal kişileri gelişmez: iyi hep iyi, cimri hep cimridir. Bu yüzden karakter değil tip sayılırlar.',
        undefined,
        { not: 'Masalda karakter gelişimi arama; tip, masalın kuralı, eksiği değil.' },
      ),
      kart(
        'Olağanüstülük',
        'Dev, peri, konuşan hayvan ve sihirli nesneler masalın olağan ögeleridir; okuyan bunları sorgulamaz.',
      ),
      kart(
        'Amacı',
        'Eğlendirirken ders verir. Sonunda iyiler kazanır; bu, masalın kurduğu adalet duygusudur.',
      ),
      kart(
        'Masal ve fabl',
        'İkisi de ders verir ama fablın kahramanları hayvandır ve ders sonunda açıkça söylenir.',
      ),
    ], [
      soru('Masallarda yer ve zaman belirsizdir.', true, '"Evvel zaman içinde" kalıbı bu belirsizliği kuruyor.'),
      soru('Masal kişileri tip özelliği gösterir.', true, 'İyi ya da kötü olarak tek yönlü çizilirler; iç dünyaları anlatılmaz.'),
      soru('Masallar gerçekte yaşanmış olayları anlatır.', false, 'Tümüyle hayal ürünüdür; olağanüstü ögeler taşır.'),
      soru('Fabl ile masal aynı türdür.', false, 'Fablın kahramanları hayvanlardır ve sonunda açık bir ders verilir.'),
      sikli('"Bir varmış bir yokmuş" kalıbı ne yapar?', ['Yer ve zamanı belirsizleştirir', 'Olayı özetler'], 0, 'Gerçek dünyadan koparır.'),
      sikli('Fablı masaldan ayıran nedir?', ['Kahramanları hayvan, ders açıkça söylenir', 'Sonu kötü biter'], 0, 'İkisi de ders verir.'),
      soru('Masalda olağanüstü ögeler sorgulanır.', false, 'Okuyan sorgulamaz.'),
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
    ]),
    konu('trk10-anonim', 'Anonim Halk Edebiyatı', [
      kart(
        'Anonim ne demek?',
        'Söyleyeni belli değildir, halkın ortak ürünüdür. Ağızdan ağıza geçtiği için birçok varyantı bulunur.',
      ),
      kart(
        'Türküler',
        'Ezgiyle söylenir; bent ve kavuştak (nakarat) bölümlerinden oluşur. Konusuna göre ninni, ağıt, iş türküsü olabilir.',
      ),
      kart(
        'Mani',
        'Yedili hece ölçüsüyle, aaxa uyak düzeninde dört dizelik ürün. İlk iki dize çoğu zaman doldurmadır, asıl anlam son ikisindedir.',
      ),
      kart(
        'Anonim ürünler',
        'Hepsi sözlü gelenekten gelir ama her biri farklı bir işi görür.',
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
        'Aynı ürünün yöreden yöreye değişmiş hâli. Sözlü gelenekte tek bir "doğru metin" yoktur.',
        undefined,
        { not: '"Hangisi doğru" diye sorma; sözlü gelenekte her varyant aynı ürünün bir yüzü.' },
      ),
      kart(
        'Neden anonimleşir?',
        'Söyleyen unutulur ama söz kalır. Halk beğendiği ürünü tekrarlarken kendine göre değiştirir ve sahiplenir.',
      ),
      kart(
        'Derleme',
        'Anonim ürünler 20. yüzyılda derlenip yazıya geçirildi; bugün bildiğimiz metinler bu derlemelerin ürünü.',
      ),
    ], [
      soru('Anonim halk edebiyatı ürünlerinin söyleyeni belli değildir.', true, 'Ürün zamanla halkın ortak malı hâline gelmiş.'),
      soru('Mani dört dizeden oluşur ve uyak düzeni aaxa dır.', true, 'İlk iki dize çoğu zaman asıl sözü hazırlar.'),
      soru('Varyant, bir ürünün tek ve değişmez biçimidir.', false, 'Varyant, aynı ürünün yörelere göre değişen biçimleri.'),
      soru('Türküler yalnızca yazılı olarak aktarılmıştır.', false, 'Sözlü olarak aktarıldılar; derleme çalışmalarıyla yazıya geçirildiler.'),
      sikli('Türkünün nakarat bölümüne ne denir?', ['Bent', 'Kavuştak'], 1, 'Bent ve kavuştak.'),
      sikli('Aynı ürünün yöreden yöreye değişmiş hâli?', ['Derleme', 'Varyant'], 1, 'Tek doğru metin yok.'),
      sikli('Anonim ürünler ne zaman yazıya geçirildi?', ['13. yüzyılda', '20. yüzyılda'], 1, 'Derleme.'),
      soru('Manide asıl anlam ilk iki dizededir.', false, 'Son ikisinde; ilk ikisi doldurma.'),
    ], [
      {
        soru: 'Yedili hece ölçüsüyle, aaxa düzeninde dört dizelik anonim ürün?',
        siklar: ['Mani', 'Türkü'],
        dogru: 0,
        aciklama: {
          dogru: 'İlk iki dize doldurma, asıl anlam son ikisinde.',
          yanlis: 'Türkü ezgiyle söylenir, bent ve kavuştaktan oluşur. Dört dizelik 7\'li ürün mani.',
        },
        kart: 3,
      },
    ]),
    konu('trk10-ahenk', 'Ahenk Ögeleri', [
      kart(
        'Ahenk nedir?',
        'Şiirdeki ses uyumu. Ölçü, uyak, redif, aliterasyon ve asonansla kurulur.',
      ),
      kart(
        'Ahengin araçları',
        'Beş araç birlikte çalışır; şiirin sesi bunların bileşiminden çıkar.',
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
        'Aliterasyon aynı ünsüzün, asonans aynı ünlünün tekrarıdır. İkisi de dizeyi kulakta tutar.',
      ),
      kart(
        'Ritim',
        'Vurgulu ve vurgusuz hecelerin düzenli sırası. Ölçü ritmi kurar, serbest şiirde ritmi söyleyiş sağlar.',
      ),
      kart(
        'Serbest şiirde ahenk',
        'Ölçü ve uyak olmasa da ahenk kaybolmaz; tekrar, sözcük seçimi ve dize uzunluğu ritmi kurar.',
      ),
      kart(
        'Ses ve anlam birlikte',
        'Ahenk süs değildir: ağır sesler ağırlık, ince ve hızlı sesler kıvraklık duygusu üretir.',
        undefined,
        { not: 'Ahenk sorusunda sesi anlamdan ayırma; şair sesi anlam için seçiyor.' },
      ),
    ], [
      soru('Aliterasyon ünsüz, asonans ünlü tekrarıdır.', true, 'İkisi de sese dayalı ahenk araçları.'),
      soru('Serbest şiirde de ahenk sağlanabilir.', true, 'Ölçü ve uyak olmadan ses tekrarları ve söyleyişle kuruluyor.'),
      soru('Ahengi sağlayan tek araç ölçüdür.', false, 'Uyak, redif, ses tekrarları ve vurgu da ahenge katkı sağlıyor.'),
      soru('Ses tekrarlarının şiirin anlamıyla bir ilgisi yoktur.', false, 'Tekrarlanan ses çoğu zaman anlatılan duyguyu destekliyor.'),
      sikli('Serbest şiirde ritmi ne sağlar?', ['Aruz ölçüsü', 'Söyleyiş, tekrar, dize uzunluğu'], 1, 'Ölçü olmasa da ahenk var.'),
      sikli('Ağır sesler ne duygusu üretir?', ['Kıvraklık', 'Ağırlık'], 1, 'Ses ve anlam birlikte.'),
      soru('Ahenk şiirde yalnızca süstür.', false, 'Anlamla birlikte çalışır.'),
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
    ]),
  ]),
  tema('trk10-t2', 'Kelimelerin Ritmi', [
    konu('trk10-imge', 'Şiirde İmge ve İleti', [
      kart(
        'İmge',
        'Sözcüklerin alışılmadık birleşimiyle zihinde kurulan yeni görüntü. Şiiri düzyazıdan ayıran asıl araç.',
      ),
      kart(
        'Açık ve örtük ileti',
        'Açık ileti metinde doğrudan söylenir; örtük ileti çıkarım yoluyla bulunur. Şiirde ileti çoğunlukla örtüktür.',
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
        'Şiirdeki gerçeklik kurmaca gerçekliktir; anlatılan yaşanmış olsa bile şiirde dönüşmüştür.',
      ),
      kart(
        'Çağrışım',
        'Bir sözcük kendi anlamının yanında başka anlamları da uyandırır. Şiirin çok anlamlılığı buradan doğar.',
      ),
      kart(
        'Üslup',
        'Şairin kendine özgü söyleyiş biçimi: sözcük seçimi, dize uzunluğu ve imge kurma alışkanlığı.',
      ),
      kart(
        'Yorum sınırsız değil',
        'Şiir çok anlamlıdır ama her yorum geçerli değildir; yorum metinden delil gösterebiliyorsa ayakta durur.',
        undefined,
        { not: '"Her yorum geçerli" değil; yorumu metinden bir kanıtla destekle.' },
      ),
    ], [
      soru('İmge, okurun zihninde yeni bir tasarım oluşturur.', true, 'Sözcüğün sözlük anlamının ötesine geçiyor.'),
      soru('Şiirdeki ileti açık ya da örtük olabilir.', true, 'Kimi şiir söyleyeceğini doğrudan söyler, kimi sezdirir.'),
      soru('Şiir yorumlanırken metinden bağımsız her anlam kabul edilir.', false, 'Yorum, metnin verileriyle desteklenmek zorunda.'),
      soru('Şiirdeki gerçeklik günlük hayattaki gerçeklikle aynıdır.', false, 'Şiir gerçeği dönüştürerek yeni bir gerçeklik kuruyor.'),
      sikli('Sözcüğün başka anlamları da uyandırması?', ['Üslup', 'Çağrışım'], 1, 'Çok anlamlılık.'),
      sikli('Şairin kendine özgü söyleyişi?', ['İleti', 'Üslup'], 1, 'Sözcük seçimi, dize uzunluğu.'),
      soru('Şiirde her yorum geçerlidir.', false, 'Metinden delil gösterebilen yorum.'),
    ], [
      {
        soru: 'Şiirde ileti çoğunlukla nasıl verilir?',
        siklar: ['Açık, doğrudan', 'Örtük, çıkarımla'],
        dogru: 1,
        aciklama: {
          dogru: 'Şiir imge ve çağrışımla konuşur; ileti okurun çıkarımıyla bulunur.',
          yanlis: 'Açık ileti öğretici metinde. Şiirde ileti imgelerin ardında, okurun çıkarımıyla bulunur.',
        },
        kart: 2,
      },
    ]),
    konu('trk10-sozcuk-turleri', 'Sözcük Türleri', [
      kart(
        'Sekiz tür',
        'Sözcükler isim soylu ve fiil olmak üzere iki büyük öbeğe ayrılır.',
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
        'Varlıkları karşılar. Özel-cins, somut-soyut, tekil-çoğul-topluluk olarak sınıflandırılır.',
      ),
      kart(
        'Sıfat',
        'İsmi niteler ya da belirtir. Niteleme sıfatı "nasıl", belirtme sıfatı "hangi, kaç, bu" sorularına cevap verir.',
      ),
      kart(
        'Zamir (adıl)',
        'İsmin yerini tutar. Kişi, işaret, belgisiz, soru ve ilgi zamiri (-ki) olmak üzere çeşitleri vardır.',
      ),
      kart(
        'Sıfat mı zamir mi?',
        'Kendinden sonra isim geliyorsa sıfat, ismin yerini tutuyorsa zamirdir: "bu kitap" sıfat, "bu benim" zamir.',
      ),
      kart(
        'Zarf (belirteç)',
        'Fiili, sıfatı ya da başka bir zarfı etkiler. Sıfat isme, zarf fiile bağlanır — ayrımın anahtarı budur.',
      ),
      kart(
        'Edat, bağlaç, ünlem',
        'Edat tek başına anlamsızdır, sözcükler arası ilgi kurar. Bağlaç bağlar, çıkarılınca anlam bozulmaz. Ünlem duygu bildirir.',
      ),
      kart(
        'Tür göreve göre değişir',
        'Bir sözcüğün türü cümledeki görevine göre belirlenir: "güzel" kimi cümlede sıfat, kimi cümlede zarftır.',
        undefined,
        { not: 'Sözcüğü ezberden sınıflandırma; cümledeki görevine bak, tür oradan çıkar.' },
      ),
      kart(
        'Zarf mı sıfat mı testi',
        '"Hızlı araba" → araba nasıl? sıfat. "Hızlı koştu" → nasıl koştu? zarf. Aynı sözcük, bağlandığı şeye göre tür değiştirir.',
      ),
    ], [
      soru('Bir sözcüğün türü, cümledeki görevine göre değişebilir.', true, '"Güzel" kimi cümlede sıfat, kimi cümlede zarf olabiliyor.'),
      soru('Sıfatlar isimden önce gelerek onu niteler ya da belirtir.', true, 'İsim olmadan sıfat da olmaz.'),
      soru('"Bu" sözcüğü her cümlede sıfattır.', false, 'Adın yerini tutuyorsa zamir olur: "Bu, benim kitabım."'),
      soru('Edatlar tek başına anlamlı sözcüklerdir.', false, 'Tek başına anlamları yok; cümlede başka sözcüklerle anlam kazanıyorlar.'),
      sikli('"Hangi kitap?" sorusuna cevap veren?', ['Niteleme sıfatı', 'Belirtme sıfatı'], 1, 'Niteleme "nasıl".'),
      sikli('İsmin yerini tutan sözcük?', ['Zarf', 'Zamir'], 1, 'Kişi, işaret, belgisiz, soru, ilgi.'),
      sikli('Fiili etkileyen sözcük?', ['Sıfat', 'Zarf'], 1, 'Sıfat isme bağlanır.'),
      sikli('Tek başına anlamsız, sözcükler arası ilgi kuran?', ['Bağlaç', 'Edat'], 1, 'Bağlaç çıkarılınca anlam bozulmaz.'),
      sikli('"Hızlı koştu" cümlesinde "hızlı"?', ['Zarf', 'Sıfat'], 0, 'Nasıl koştu?'),
      sikli('Bir sözcüğün türü neye göre belirlenir?', ['Cümledeki görevine', 'Sözlükteki yerine'], 0, 'Göreve göre değişir.'),
      soru('Ünlem duygu bildirir.', true, 'Sekiz türden biri.'),
    ], [
      {
        soru: '"Bu kalem benim" cümlesinde "bu" hangi türdendir?',
        siklar: ['Sıfat', 'Zamir'],
        dogru: 0,
        aciklama: {
          dogru: 'Kendinden sonra isim (kalem) geliyor: işaret sıfatı.',
          yanlis: 'Zamir ismin yerini tutar ("Bu benim"). Burada "bu", "kalem" ismini belirtiyor: sıfat.',
        },
        kart: 5,
      },
    ]),
    konu('trk10-fiil', 'Fiiller', [
      kart(
        'Fiil nedir?',
        'İş, oluş ya da durum bildirir. Mastar eki (-mak/-mek) alabiliyorsa fiildir.',
      ),
      kart(
        'Kip nedir?',
        'Fiilin hangi zamanda ya da hangi dilekle söylendiğini gösteren ek. Her çekimli fiilde bir kip vardır.',
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
        'Haber kipleri zaman bildirir, dilek kipleri bildirmez. "Gelmeli" bir zaman değil bir gereklilik anlatır.',
      ),
      kart(
        'Çatı',
        'Özneye göre etken-edilgen-dönüşlü-işteş, nesneye göre geçişli-geçişsiz. Çatı yalnızca yüklemi fiil olan cümlelerde aranır.',
      ),
      kart(
        'Edilgen çatı',
        'Yapanı belli olmayan cümle kurar: "Kapı açıldı." Özne sözde öznedir, işi kimin yaptığı söylenmez.',
      ),
      kart(
        'Ek fiil',
        'İsim soylu sözcükleri yüklem yapar ya da basit zamanlı fiili birleşik zamanlı hâle getirir.',
      ),
      kart(
        'Fiilimsi',
        'Fiilden türer ama cümlede isim, sıfat ya da zarf görevi görür. Fiilimsi bulunan cümle birleşik cümledir.',
      ),
      kart(
        'Üç fiilimsi',
        'İsim-fiil (-ma, -ış, -mak), sıfat-fiil (-an, -acak, -dık, -mış, -ası, -maz), zarf-fiil (-ip, -arak, -ken, -ince).',
      ),
      kart(
        'Fiilimsi tanıma',
        'Ekleri ezberle: -ma/-ış/-mak isim-fiil, -an/-acak/-dık/-mış/-ası/-maz sıfat-fiil, -ip/-arak/-ken/-ince/-madan zarf-fiil. Bir cümlede fiilimsi varsa o cümle birleşiktir.',
        undefined,
        { not: 'Ekleri bir kâğıda yaz; fiilimsi sorusu ek tanımayla çözülüyor, başka yolu yok.' },
      ),
    ], [
      soru('Ek fiil, isim soylu sözcükleri yüklem yapar.', true, '"Öğrenciydi" örneğinde yüklemi kuran ek fiil.'),
      soru('Fiilimsiler cümlede isim, sıfat ya da zarf görevinde kullanılır.', true, 'Fiil kökünden türerler ama fiil gibi çekimlenmezler.'),
      soru('Edilgen çatılı cümlelerde işi yapan gerçek özne bellidir.', false, 'Gerçek özne söylenmez; cümlede sözde özne bulunur.'),
      soru('Dilek kipleri zaman bildirir.', false, 'Zaman bildirenler haber kipleri; dilek kipleri istek, şart ve gereklilik anlatır.'),
      sikli('Mastar eki alabilen sözcük?', ['Fiil', 'İsim'], 0, '-mak/-mek.'),
      sikli('"Gelmeli" hangi kip grubundadır?', ['Dilek kipi', 'Haber kipi'], 0, 'Zaman değil gereklilik.'),
      sikli('İsim soylu sözcüğü yüklem yapan?', ['Ek fiil', 'Fiilimsi'], 0, 'Birleşik zaman da kurar.'),
      sikli('"-arak, -ken, -ince" ekleri hangi fiilimsiyi kurar?', ['Zarf-fiil', 'İsim-fiil'], 0, 'İsim-fiil -ma, -ış, -mak.'),
      sikli('Fiilimsi bulunan cümle nasıl cümledir?', ['Basit', 'Birleşik'], 1, 'Yan cümle.'),
      sikli('Çatı hangi cümlelerde aranır?', ['Bütün cümlelerde', 'Yüklemi fiil olanlarda'], 1, 'İsim cümlesinde çatı yok.'),
      soru('"-an, -acak, -mış" ekleri sıfat-fiil kurar.', true, '-dık, -ası, -maz da.'),
    ], [
      {
        soru: '"Kapı açıldı" cümlesinin çatısı?',
        siklar: ['Edilgen', 'Etken'],
        dogru: 0,
        aciklama: {
          dogru: 'Açan belli değil; kapı sözde özne.',
          yanlis: 'Etkende işi yapan özne bellidir ("Ali kapıyı açtı"). Yapanı söylenmeyen "açıldı" edilgen.',
        },
        kart: 5,
      },
    ]),
  ]),
  tema('trk10-t3', 'Dünden Bugüne', [
    konu('trk10-destan', 'Destan', [
      kart(
        'Doğal ve yapma destan',
        'Doğal destan halkın ortak ürünüdür, söyleyeni belirsizdir. Yapma destan belli bir şair tarafından yazılır.',
      ),
      kart(
        'Oluşum aşamaları',
        'Doğal destan üç basamakta oluşur ve son basamakta bir şair onu yazıya geçirir.',
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
        'Türk destanları',
        'İslamiyet öncesi: Alp Er Tunga, Oğuz Kağan, Bozkurt, Ergenekon, Göç, Manas. Sonrası: Battalname, Danişmendname.',
      ),
      kart(
        'Destan kahramanı',
        'Milletin ortak değerlerini taşır; kişisel değil toplumsal bir amacı vardır.',
      ),
      kart(
        'Olağanüstülük',
        'Kahramanın doğuşu, atı ve silahı olağanüstüdür. Bu ögeler destanı efsaneye yaklaştırır ama tarihsel çekirdek durur.',
      ),
      kart(
        'Destan ve tarih',
        'Destan tarihsel bir olaydan doğar ama tarih değildir; olayı halkın gözünden ve abartarak anlatır.',
        undefined,
        { not: 'Destanı belge sanma; tarihsel çekirdek var ama anlatan halk, ölçen değil.' },
      ),
    ], [
      soru('Doğal destanlar toplumun ortak belleğinde oluşup sonradan yazıya geçirilir.', true, 'Söyleyeni belli değildir.'),
      soru('Yapma destanların yazarı bellidir.', true, 'Bir şairin doğal destanlara öykünerek yazdığı eserler.'),
      soru('Destanlar tarihî olayları olduğu gibi aktarır.', false, 'Tarihî bir çekirdek taşır ama olağanüstü ögelerle işlenir.'),
      soru('Oğuz Kağan Destanı bir yapma destandır.', false, 'Doğal destandır; halkın belleğinde oluşup sonradan yazıya geçmiş.'),
      sikli('İslamiyet sonrası Türk destanı hangisidir?', ['Battalname', 'Ergenekon'], 0, 'Ergenekon öncesi.'),
      sikli('Destan kahramanının amacı?', ['Toplumsal', 'Kişisel'], 0, 'Milletin ortak değerleri.'),
      soru('Destan olayı halkın gözünden ve abartarak anlatır.', true, 'Tarihsel çekirdek durur ama tarih değil.'),
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
    ]),
    konu('trk10-mesnevi', 'Mesnevi ve Halk Hikâyesi', [
      kart(
        'Mesnevi',
        'Divan edebiyatında uzun konuları anlatmaya yarayan nazım biçimi. Her beyit kendi içinde uyaklıdır (aa, bb, cc).',
      ),
      kart(
        'Neden mesnevi?',
        'Beyit sayısı sınırsız olduğu için romanın işini görürdü: aşk, savaş, öğüt ve din konuları böyle anlatıldı.',
      ),
      kart(
        'Öne çıkan mesneviler',
        'Fuzuli’nin Leyla ile Mecnun’u, Şeyh Galib’in Hüsn ü Aşk’ı ve Mevlânâ’nın Mesnevi’si en çok anılanlar.',
      ),
      kart(
        'Halk hikâyesi',
        'Destanla roman arasında bir tür. Nazım ve nesir karışıktır; âşık, hikâyeyi sazıyla anlatır.',
      ),
      kart(
        'Üç anlatı yan yana',
        'Aynı işi gören üç tür farklı çevrelerde gelişti ve dilleri de birbirinden ayrıldı.',
        {
          tur: 'tablo',
          basliklar: ['Tür', 'Çevre'],
          satirlar: [
            ['Destan', 'Sözlü, halk'],
            ['Mesnevi', 'Divan, saray'],
            ['Halk hikâyesi', 'Âşık geleneği'],
          ],
        },
        { not: 'Üç türü rakip değil komşu diye oku; aynı işi üç ayrı çevre yapmış.' },
      ),
      kart(
        'Fabl',
        'Kahramanları hayvan olan, sonunda ders veren kısa anlatı. Kişileştirme fablın temel aracıdır.',
      ),
      kart(
        'Sözlüden yazılıya',
        'Sözlü ürün her anlatımda değişir; yazıya geçince tek bir metne dönüşür ve varyantları durur.',
      ),
    ], [
      soru('Mesnevide her beyit kendi içinde uyaklıdır.', true, 'Uyak yükü hafif olduğu için uzun anlatıya elverişli.'),
      soru('Mesnevi nazım biçimi uzun anlatılar için elverişlidir.', true, 'Beyit sayısında bir sınır yok.'),
      soru('Halk hikâyeleri yalnızca nazımla anlatılır.', false, 'Nazım ile nesir bir arada kullanılır; türküler araya girer.'),
      soru('Fablın kahramanları insanlardır.', false, 'Kahramanları çoğunlukla hayvanlardır ve insan gibi konuşurlar.'),
      sikli('Leyla ile Mecnun kimin eseridir?', ['Şeyh Galib', 'Fuzuli'], 1, 'Şeyh Galib Hüsn ü Aşk.'),
      sikli('Nazım ve nesir karışık, âşığın sazla anlattığı tür?', ['Mesnevi', 'Halk hikâyesi'], 1, 'Destanla roman arası.'),
      sikli('Fablın temel aracı?', ['Benzetme', 'Kişileştirme'], 1, 'Hayvanlar konuşur.'),
      soru('Sözlü ürün yazıya geçince varyantları durur.', true, 'Tek metne dönüşür.'),
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
    ]),
  ]),
  tema('trk10-t4', 'Nesillerin Mirası', [
    konu('trk10-milli', 'Millî Edebiyat', [
      kart(
        'Doğuşu',
        '1911’de Selanik’te çıkan Genç Kalemler dergisi ve "Yeni Lisan" makalesiyle başlar.',
      ),
      kart(
        'Dilde sadeleşme',
        'Arapça ve Farsça kuralların atılması, konuşma dilinin yazı dili yapılması amaçlandı.',
      ),
      kart(
        'Üç ilke',
        'Akım üç kararla tanımlanır ve üçü de bir öncekiyle hesaplaşır.',
        {
          tur: 'akis',
          adimlar: [
            { ad: 'Sade dil' },
            { ad: 'Hece ölçüsü' },
            { ad: 'Yerli konu' },
          ],
        },
        { not: 'İlkeleri tek tek değil, her birinin neye karşı çıktığıyla birlikte tut.' },
      ),
      kart(
        'Ölçü ve konu',
        'Aruz yerine hece ölçüsü benimsendi; konular Anadolu’ya ve halkın hayatına döndü.',
      ),
      kart(
        'Neden bu dönemde?',
        'Savaşlar ve toprak kayıpları bir kimlik arayışı doğurdu; edebiyat da halka ve kendi diline döndü.',
      ),
      kart(
        'Temsilcileri',
        'Ömer Seyfettin, Ziya Gökalp, Mehmet Emin Yurdakul, Ali Canip Yöntem, Yakup Kadri, Halide Edip, Reşat Nuri.',
      ),
      kart(
        'Servetifünun ile karşıtlığı',
        'Servetifünun ağır dil ve bireysel konuları, Millî Edebiyat sade dil ve toplumsal konuları seçti.',
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
      soru('Millî Edebiyat, Servetifünun un dil anlayışını sürdürmüştür.', false, 'Tam karşısında durdu: sadeleşmeyi savundu.'),
      sikli('Millî Edebiyat hangi ölçüyü benimsedi?', ['Hece', 'Aruz'], 0, 'Konular Anadolu\'ya döndü.'),
      sikli('Yeni Lisan makalesi neyi amaçladı?', ['Konuşma dilini yazı dili yapmak', 'Arapça öğretmek'], 0, 'Sadeleşme.'),
      sikli('Ziya Gökalp hangi akımın temsilcisidir?', ['Millî Edebiyat', 'Servetifünun'], 0, 'Ömer Seyfettin de.'),
      soru('Servetifünun sade dil ve toplumsal konuları seçti.', false, 'Ağır dil ve bireysel konular.'),
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
    ]),
    konu('trk10-milli-turler', 'Millî Edebiyatta Türler', [
      kart(
        'Şiir',
        'Hece ölçüsü ve sade dil öne çıktı. "Beş Hececiler" bu anlayışı sürdürdü.',
      ),
      kart(
        'Hikâye',
        'Ömer Seyfettin, hikâyeyi hem sadeleşmenin hem millî bilincin aracı yaptı; olay hikâyesinin Türk edebiyatındaki ustasıdır.',
      ),
      kart(
        'Roman',
        'Anadolu ilk kez romanın merkezine geçti. Çalıkuşu ve Yaban bu dönüşün örnekleridir.',
      ),
      kart(
        'Anadolu’ya bakış',
        'Yaban aydının halka uzaklığını, Çalıkuşu ise Anadolu’ya gitmeyi bir görev olarak anlatır. İkisi aynı sorunun iki yüzü.',
        undefined,
        { not: 'İki roman aynı Anadolu\'ya iki ayrı gözle bakıyor; farkı kavrarsan dönemi kavrarsın.' },
      ),
      kart(
        'Tiyatro ve deneme',
        'Millî konular sahneye de taşındı; gazete yazıları ve denemeler sadeleşmeyi geniş kitleye yaydı.',
      ),
      kart(
        'Edebiyat ve toplum',
        'Bu dönemde edebiyat, sanat kaygısının yanında toplumu biçimlendirme işini de üstlendi.',
      ),
      kart(
        'Cumhuriyet’e miras',
        'Sade dil ve Anadolu konusu Cumhuriyet dönemi edebiyatının çıkış noktası oldu; kopuş değil süreklilik var.',
      ),
    ], [
      soru('Millî Edebiyat döneminde roman ve hikâyede Anadolu insanı işlenmiştir.', true, 'Mekân İstanbul dan Anadolu ya taşındı.'),
      soru('Ömer Seyfettin dönemin hikâye türündeki önemli adlarındandır.', true, 'Sade dille yazdığı hikâyeler dönemin dil anlayışını yansıtıyor.'),
      soru('Millî Edebiyat sanatçıları toplumsal konulardan uzak durmuştur.', false, 'Toplumsal sorunları doğrudan ele aldılar.'),
      soru('Bu dönemin birikimi Cumhuriyet Dönemi edebiyatını etkilememiştir.', false, 'Dil ve konu anlayışı Cumhuriyet edebiyatına doğrudan miras kaldı.'),
      sikli('Hece ölçüsünü sürdüren şair topluluğu?', ['Beş Hececiler', 'Yedi Meşaleciler'], 0, 'Sade dil.'),
      sikli('Çalıkuşu ne anlatır?', ['Anadolu\'ya gitmeyi görev olarak', 'Aydının halka uzaklığını'], 0, 'Yaban uzaklığı anlatır.'),
      sikli('Cumhuriyet dönemi edebiyatı Millî Edebiyat\'la nasıl ilişkidedir?', ['Süreklilik', 'Kopuş'], 0, 'Sade dil ve Anadolu konusu miras.'),
      soru('Bu dönemde edebiyat toplumu biçimlendirme işini de üstlendi.', true, 'Sanat kaygısının yanında.'),
    ], [
      {
        soru: 'Aydının halka uzaklığını anlatan roman hangisidir?',
        siklar: ['Çalıkuşu', 'Yaban'],
        dogru: 1,
        aciklama: {
          dogru: 'Yakup Kadri\'nin Yaban\'ı aydın-köylü kopukluğunu anlatır.',
          yanlis: 'Çalıkuşu Anadolu\'ya gitmeyi görev olarak anlatır. Aydının halka yabancılığı Yaban\'ın konusu.',
        },
        kart: 4,
      },
    ]),
  ]),
])
