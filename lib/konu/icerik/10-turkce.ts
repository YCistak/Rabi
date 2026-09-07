import { kart, konu, program, tema } from '../tip'

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
      ),
      kart(
        'Neden anonimleşir?',
        'Söyleyen unutulur ama söz kalır. Halk beğendiği ürünü tekrarlarken kendine göre değiştirir ve sahiplenir.',
      ),
      kart(
        'Derleme',
        'Anonim ürünler 20. yüzyılda derlenip yazıya geçirildi; bugün bildiğimiz metinler bu derlemelerin ürünü.',
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
      kart(
        'Fabl',
        'Kahramanları hayvan olan, sonunda ders veren kısa anlatı. Kişileştirme fablın temel aracıdır.',
      ),
      kart(
        'Sözlüden yazılıya',
        'Sözlü ürün her anlatımda değişir; yazıya geçince tek bir metne dönüşür ve varyantları durur.',
      ),
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
    ]),
  ]),
])
