import { kart, konu, program, tema } from '../tip'

/**
 * 10. sınıf Türk Dili ve Edebiyatı — Maarif Modeli.
 *
 * Dört tema: **Sözün Ezgisi**, **Kelimelerin Ritmi**, **Dünden Bugüne**,
 * **Nesillerin Mirası**. Dil bilgisi konuları "Kelimelerin Ritmi" temasının
 * altında duruyor: tema zaten kelimenin kendisine bakıyor.
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
        'Döşeme (tekerleme), serim, düğüm, çözüm ve dilek bölümü. Tekerleme masalı gerçek dünyadan koparır.',
      ),
      kart(
        'Kişiler tiptir',
        'Masal kişileri gelişmez: iyi hep iyi, cimri hep cimridir. Bu yüzden karakter değil tip sayılırlar.',
      ),
      kart(
        'Amacı',
        'Eğlendirirken ders verir. Sonunda iyiler kazanır; bu, masalın kurduğu adalet duygusudur.',
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
        'Bilmece, tekerleme, atasözü',
        'Hepsi anonimdir. Bilmece buldurmayı, tekerleme ses oyununu, atasözü öğüdü esas alır.',
      ),
    ]),
    konu('trk10-ahenk', 'Ahenk Ögeleri', [
      kart(
        'Ahenk nedir?',
        'Şiirdeki ses uyumu. Ölçü, uyak, redif, aliterasyon ve asonansla kurulur.',
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
      ),
      kart(
        'Şiirde gerçeklik',
        'Şiirdeki gerçeklik kurmaca gerçekliktir; anlatılan yaşanmış olsa bile şiirde dönüşmüştür.',
      ),
      kart(
        'Çağrışım',
        'Bir sözcük kendi anlamının yanında başka anlamları da uyandırır. Şiirin çok anlamlılığı buradan doğar.',
      ),
    ]),
    konu('trk10-sozcuk-turleri', 'Sözcük Türleri', [
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
        'Zarf (belirteç)',
        'Fiili, sıfatı ya da başka bir zarfı etkiler. Sıfat isme, zarf fiile bağlanır — ayrımın anahtarı budur.',
      ),
      kart(
        'Edat, bağlaç, ünlem',
        'Edat tek başına anlamsızdır, sözcükler arası ilgi kurar. Bağlaç bağlar, çıkarılınca anlam bozulmaz. Ünlem duygu bildirir.',
      ),
    ]),
    konu('trk10-fiil', 'Fiiller', [
      kart(
        'Fiil nedir?',
        'İş, oluş ya da durum bildirir. Mastar eki (-mak/-mek) alabiliyorsa fiildir.',
      ),
      kart(
        'Haber ve dilek kipleri',
        'Haber kipleri zaman bildirir (görülen geçmiş, duyulan geçmiş, şimdiki, gelecek, geniş). Dilek kipleri istek, şart, gereklilik ve emir bildirir.',
      ),
      kart(
        'Çatı',
        'Özneye göre etken-edilgen-dönüşlü-işteş, nesneye göre geçişli-geçişsiz. Çatı yalnızca **yüklemi fiil olan** cümlelerde aranır.',
      ),
      kart(
        'Ek fiil',
        'İsim soylu sözcükleri yüklem yapar ya da basit zamanlı fiili birleşik zamanlı hâle getirir.',
      ),
      kart(
        'Fiilimsi',
        'Fiilden türer ama cümlede isim, sıfat ya da zarf görevi görür. Fiilimsi bulunan cümle birleşik cümledir.',
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
        'Olağanüstü bir olay yaşanır, halk arasında anlatılır ve sonunda bir şair tarafından derlenip yazıya geçirilir.',
      ),
      kart(
        'Türk destanları',
        'Alp Er Tunga, Oğuz Kağan, Bozkurt, Ergenekon, Göç, Manas. İslamiyet sonrası: Battalname, Danişmendname.',
      ),
      kart(
        'Destan kahramanı',
        'Milletin ortak değerlerini taşır; kişisel değil toplumsal bir amacı vardır.',
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
        'Halk hikâyesi',
        'Destanla roman arasında bir tür. Nazım ve nesir karışıktır; âşık, hikâyeyi sazıyla anlatır.',
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
        'Ölçü ve konu',
        'Aruz yerine hece ölçüsü benimsendi; konular Anadolu’ya ve halkın hayatına döndü.',
      ),
      kart(
        'Temsilcileri',
        'Ömer Seyfettin, Ziya Gökalp, Mehmet Emin Yurdakul, Ali Canip Yöntem, Yakup Kadri, Halide Edip, Reşat Nuri.',
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
        'Edebiyat ve toplum',
        'Bu dönemde edebiyat, sanat kaygısının yanında toplumu biçimlendirme işini de üstlendi.',
      ),
    ]),
  ]),
])
