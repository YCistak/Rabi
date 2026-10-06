import type { PuanTuru } from '../types'
import type { KonuDersId } from '../konu/tip'

/**
 * YKS konu listesi — Konu Takibi aracının verisi. Saf veri, React'e bağlı değil.
 *
 * **Bu liste Maarif haritasından ayrı ve bilerek ayrı.** Harita
 * (`lib/konu/`) Türkiye Yüzyılı Maarif Modeli'nin ders → sınıf → tema → konu
 * yapısını izliyor; YKS ise sınıf değil sınav sorar ve öğrencinin elindeki
 * soru bankaları, dershane listeleri ve deneme karneleri sınavın kendi
 * başlıklarıyla konuşur ("Üslü Sayılar", "Fiilimsiler", "Sermaye ve Emek").
 * İkisini tek listede birleştirmek ya haritayı sınavın diline ya sınavı
 * müfredatın diline çevirmek olurdu. Bağ `harita-eslemesi.ts`teki açık
 * tabloyla kuruluyor.
 *
 * Kaynak: ÖSYM sınav kılavuzu yalnızca testleri ve hangi sınıfların
 * programına dayandığını yazıyor, konu konu liste yayımlamıyor. Başlıklar
 * yayınevlerinin ve dershanelerin ortak kullandığı YKS konu listesinden
 * (2018 ortaöğretim programına dayanan, sınavların hâlâ izlediği liste)
 * derlendi. Bir başlık eklemeden önce o listede gerçekten bulunduğuna bak;
 * listede olmayan bir başlık öğrencinin bankasında da yoktur.
 *
 * **AYT'de TYT konuları tekrar yazılmıyor.** AYT Matematik temel kavramları,
 * AYT Edebiyat anlam ve dil bilgisini, AYT Tarih/Coğrafya da TYT'nin bütün
 * başlıklarını yeniden sorar; ama aynı konuyu iki kez işaretletmek takibi
 * iki kat uzatır ve ikisi zamanla birbirini tutmaz. AYT bölümünde yalnızca
 * AYT'ye özgü başlıklar var; ekran bunu bir notla söylüyor.
 *
 * **Kimlikler kayıt anahtarı.** Öğrencinin işaretleri konu kimliğiyle
 * saklanıyor (`takip.ts`); bir kimliği değiştirmek o konunun kaydını öksüz
 * bırakır. Adı değiştir, kimliğe dokunma.
 */

export type YksOturum = 'tyt' | 'ayt'

export type YksKonu = {
  /** Kalıcı kimlik — kayıt anahtarı, değişmez. */
  id: string
  ad: string
  /**
   * Ders içindeki alt başlık: TYT Matematik'te "Geometri", Felsefe
   * Grubu'nda "Psikoloji". Ekranda konu listesini bölüyor; olmayan konu
   * dersin kendi başlığı altında duruyor.
   */
  bolum?: string
}

export type YksDers = {
  id: string
  oturum: YksOturum
  ad: string
  ikon: string
  /**
   * Renk ailesi — haritadaki dersin rengi (`--konu-<ders>-*`).
   *
   * "Renk derse aittir" kuralının karşılığı: Matematik burada da mavi,
   * Edebiyat sarı. Haritada karşılığı olmayan dersler (Felsefe, Din) `null`
   * ve nötr çiziliyor — Yanlış Soru Bankası'ndaki ders çipleriyle aynı karar
   * (`lib/banka.ts` → `dersRengi`): o derslere bir renk uydurmak, harita ve
   * oyunlarda karşılığı olmayan bir kimlik icat etmek olurdu.
   */
  renk: KonuDersId | null
  /**
   * AYT'de bu dersi gören alanlar. TYT derslerinde yok: TYT herkesin
   * sınavı. ÖSYM kılavuzundaki test dağılımı: Sayısal → Matematik, Fen
   * Bilimleri; Eşit Ağırlık → Matematik, Sosyal Bilimler-1 (Edebiyat,
   * Tarih-1, Coğrafya-1); Sözel → Sosyal Bilimler-1 ve Sosyal Bilimler-2
   * (Tarih-2, Coğrafya-2, Felsefe Grubu, Din); Dil → YDT.
   */
  alanlar?: PuanTuru[]
  konular: YksKonu[]
}

/** Konu kurucusu — listeyi okunur tutmak için. */
function k(id: string, ad: string, bolum?: string): YksKonu {
  return bolum ? { id, ad, bolum } : { id, ad }
}

const GEO = 'Geometri'

// ---------------------------------------------------------------------------
// TYT
// ---------------------------------------------------------------------------

const TYT_TURKCE: YksDers = {
  id: 'tyt-turkce',
  oturum: 'tyt',
  ad: 'Türkçe',
  ikon: '📖',
  renk: 'turkce',
  konular: [
    k('tyt-trk-sozcukte-anlam', 'Sözcükte Anlam'),
    k('tyt-trk-soz-yorumu', 'Söz Yorumu (Deyim ve Atasözü)'),
    k('tyt-trk-cumlede-anlam', 'Cümlede Anlam'),
    k('tyt-trk-paragraf', 'Paragrafta Anlam'),
    k('tyt-trk-ses', 'Ses Bilgisi'),
    k('tyt-trk-yazim', 'Yazım Kuralları'),
    k('tyt-trk-noktalama', 'Noktalama İşaretleri'),
    k('tyt-trk-yapi', 'Sözcükte Yapı ve Ekler'),
    k('tyt-trk-isim', 'İsimler (Adlar)'),
    k('tyt-trk-sifat', 'Sıfatlar (Ön Adlar)'),
    k('tyt-trk-zamir', 'Zamirler (Adıllar)'),
    k('tyt-trk-zarf', 'Zarflar (Belirteçler)'),
    k('tyt-trk-edat', 'Edat, Bağlaç ve Ünlem'),
    k('tyt-trk-fiil', 'Fiiller (Kip, Kişi, Yapı)'),
    k('tyt-trk-ek-fiil', 'Ek Fiil'),
    k('tyt-trk-fiilimsi', 'Fiilimsiler'),
    k('tyt-trk-cati', 'Fiilde Çatı'),
    k('tyt-trk-ogeler', 'Cümlenin Ögeleri'),
    k('tyt-trk-cumle-turleri', 'Cümle Türleri'),
    k('tyt-trk-anlatim-bozuklugu', 'Anlatım Bozuklukları'),
  ],
}

const TYT_MATEMATIK: YksDers = {
  id: 'tyt-matematik',
  oturum: 'tyt',
  ad: 'Matematik',
  ikon: '➗',
  renk: 'matematik',
  konular: [
    k('tyt-mat-temel-kavramlar', 'Temel Kavramlar'),
    k('tyt-mat-basamak', 'Sayı Basamakları'),
    k('tyt-mat-bolunebilme', 'Bölme ve Bölünebilme'),
    k('tyt-mat-ebob-ekok', 'EBOB – EKOK'),
    k('tyt-mat-rasyonel', 'Rasyonel Sayılar'),
    k('tyt-mat-esitsizlik', 'Basit Eşitsizlikler'),
    k('tyt-mat-mutlak-deger', 'Mutlak Değer'),
    k('tyt-mat-uslu', 'Üslü Sayılar'),
    k('tyt-mat-koklu', 'Köklü Sayılar'),
    k('tyt-mat-carpanlara-ayirma', 'Çarpanlara Ayırma'),
    k('tyt-mat-oran-oranti', 'Oran – Orantı'),
    k('tyt-mat-denklem', 'Denklem Çözme'),
    k('tyt-mat-sayi-kesir-problem', 'Sayı ve Kesir Problemleri'),
    k('tyt-mat-yas-problem', 'Yaş Problemleri'),
    k('tyt-mat-isci-problem', 'İşçi Problemleri'),
    k('tyt-mat-yuzde-problem', 'Yüzde, Kâr – Zarar Problemleri'),
    k('tyt-mat-karisim-problem', 'Karışım Problemleri'),
    k('tyt-mat-hareket-problem', 'Hareket Problemleri'),
    k('tyt-mat-grafik-problem', 'Grafik Problemleri'),
    k('tyt-mat-kumeler', 'Kümeler ve Kartezyen Çarpım'),
    k('tyt-mat-mantik', 'Mantık'),
    k('tyt-mat-fonksiyon', 'Fonksiyonlar'),
    k('tyt-mat-polinom', 'Polinomlar'),
    k('tyt-mat-permutasyon', 'Permütasyon'),
    k('tyt-mat-kombinasyon', 'Kombinasyon'),
    k('tyt-mat-olasilik', 'Olasılık'),
    k('tyt-mat-istatistik', 'Veri ve İstatistik'),
    k('tyt-geo-dogruda-aci', 'Doğruda Açılar', GEO),
    k('tyt-geo-ucgende-aci', 'Üçgende Açılar', GEO),
    k('tyt-geo-aci-kenar', 'Açı – Kenar Bağıntıları', GEO),
    k('tyt-geo-dik-ucgen', 'Dik Üçgen (Pisagor ve Öklid)', GEO),
    k('tyt-geo-trigonometri', 'Dik Üçgende Trigonometrik Oranlar', GEO),
    k('tyt-geo-ikizkenar-eskenar', 'İkizkenar ve Eşkenar Üçgen', GEO),
    k('tyt-geo-aciortay-kenarortay', 'Açıortay ve Kenarortay', GEO),
    k('tyt-geo-eslik-benzerlik', 'Eşlik ve Benzerlik', GEO),
    k('tyt-geo-ucgende-alan', 'Üçgende Alan', GEO),
    k('tyt-geo-cokgen', 'Çokgenler', GEO),
    k('tyt-geo-dortgen', 'Dörtgenler', GEO),
    k('tyt-geo-ozel-dortgen', 'Özel Dörtgenler (Yamuk, Paralelkenar, Eşkenar Dörtgen, Dikdörtgen, Kare, Deltoid)', GEO),
    k('tyt-geo-cember', 'Çember ve Daire', GEO),
    k('tyt-geo-kati-cisim', 'Katı Cisimler', GEO),
  ],
}

const TYT_FIZIK: YksDers = {
  id: 'tyt-fizik',
  oturum: 'tyt',
  ad: 'Fizik',
  ikon: '🧲',
  renk: 'fizik',
  konular: [
    k('tyt-fiz-giris', 'Fizik Bilimine Giriş'),
    k('tyt-fiz-madde', 'Madde ve Özellikleri'),
    k('tyt-fiz-hareket-kuvvet', 'Hareket ve Kuvvet'),
    k('tyt-fiz-is-enerji', 'İş, Güç ve Enerji'),
    k('tyt-fiz-isi', 'Isı, Sıcaklık ve Genleşme'),
    k('tyt-fiz-elektrostatik', 'Elektrostatik'),
    k('tyt-fiz-elektrik', 'Elektrik Akımı ve Devreler'),
    k('tyt-fiz-manyetizma', 'Manyetizma'),
    k('tyt-fiz-basinc', 'Basınç'),
    k('tyt-fiz-kaldirma', 'Kaldırma Kuvveti'),
    k('tyt-fiz-dalgalar', 'Dalgalar'),
    k('tyt-fiz-optik', 'Optik'),
  ],
}

const TYT_KIMYA: YksDers = {
  id: 'tyt-kimya',
  oturum: 'tyt',
  ad: 'Kimya',
  ikon: '⚗️',
  renk: 'kimya',
  konular: [
    k('tyt-kim-bilim', 'Kimya Bilimi'),
    k('tyt-kim-atom-periyodik', 'Atom ve Periyodik Sistem'),
    k('tyt-kim-etkilesim', 'Kimyasal Türler Arası Etkileşimler'),
    k('tyt-kim-haller', 'Maddenin Hâlleri'),
    k('tyt-kim-doga', 'Doğa ve Kimya'),
    k('tyt-kim-kanunlar', 'Kimyanın Temel Kanunları'),
    k('tyt-kim-mol', 'Mol Kavramı'),
    k('tyt-kim-tepkimeler', 'Kimyasal Tepkimeler'),
    k('tyt-kim-hesaplamalar', 'Kimyasal Hesaplamalar'),
    k('tyt-kim-karisimlar', 'Karışımlar'),
    k('tyt-kim-asit-baz', 'Asitler, Bazlar ve Tuzlar'),
    k('tyt-kim-her-yerde', 'Kimya Her Yerde'),
  ],
}

const TYT_BIYOLOJI: YksDers = {
  id: 'tyt-biyoloji',
  oturum: 'tyt',
  ad: 'Biyoloji',
  ikon: '🧬',
  renk: 'biyoloji',
  konular: [
    k('tyt-biy-ortak-ozellik', 'Canlıların Ortak Özellikleri'),
    k('tyt-biy-bilesenler', 'Canlıların Temel Bileşenleri'),
    k('tyt-biy-hucre', 'Hücre ve Organeller'),
    k('tyt-biy-madde-gecisi', 'Hücre Zarından Madde Geçişi'),
    k('tyt-biy-siniflandirma', 'Canlıların Sınıflandırılması'),
    k('tyt-biy-bolunme', 'Hücre Bölünmeleri (Mitoz ve Mayoz)'),
    k('tyt-biy-kalitim', 'Kalıtım'),
    k('tyt-biy-ekosistem', 'Ekosistem Ekolojisi'),
    k('tyt-biy-cevre', 'Güncel Çevre Sorunları ve İnsan'),
  ],
}

const TYT_TARIH: YksDers = {
  id: 'tyt-tarih',
  oturum: 'tyt',
  ad: 'Tarih',
  ikon: '🏛️',
  renk: 'tarih',
  konular: [
    k('tyt-tar-tarih-zaman', 'Tarih ve Zaman'),
    k('tyt-tar-ilk-donemler', 'İnsanlığın İlk Dönemleri'),
    k('tyt-tar-orta-cag', 'Orta Çağ’da Dünya'),
    k('tyt-tar-turk-dunyasi', 'İlk ve Orta Çağlarda Türk Dünyası'),
    k('tyt-tar-islam', 'İslam Medeniyetinin Doğuşu'),
    k('tyt-tar-ilk-turk-islam', 'Türklerin İslamiyet’i Kabulü ve İlk Türk-İslam Devletleri'),
    k('tyt-tar-selcuklu', 'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi'),
    k('tyt-tar-osmanli-siyaset', 'Beylikten Devlete Osmanlı Siyaseti'),
    k('tyt-tar-savascilar', 'Devletleşme Sürecinde Savaşçılar ve Askerler'),
    k('tyt-tar-osmanli-medeniyet', 'Beylikten Devlete Osmanlı Medeniyeti'),
    k('tyt-tar-dunya-gucu', 'Dünya Gücü Osmanlı'),
    k('tyt-tar-merkez-teskilat', 'Sultan ve Osmanlı Merkez Teşkilatı'),
    k('tyt-tar-toplum-duzeni', 'Klasik Çağda Osmanlı Toplum Düzeni'),
    k('tyt-tar-degisen-dengeler', 'Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti'),
    k('tyt-tar-degisim-cagi', 'Değişim Çağında Avrupa ve Osmanlı'),
    k('tyt-tar-denge-stratejisi', 'Uluslararası İlişkilerde Denge Stratejisi (1774-1914)'),
    k('tyt-tar-devrimler-cagi', 'Devrimler Çağında Değişen Devlet-Toplum İlişkileri'),
    k('tyt-tar-sermaye-emek', 'Sermaye ve Emek'),
    k('tyt-tar-gundelik-hayat', 'XIX. ve XX. Yüzyılda Değişen Gündelik Hayat'),
    k('tyt-tar-xx-yuzyil', 'XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya'),
    k('tyt-tar-milli-mucadele', 'Millî Mücadele'),
    k('tyt-tar-ataturkculuk', 'Atatürkçülük ve Türk İnkılabı'),
  ],
}

const TYT_COGRAFYA: YksDers = {
  id: 'tyt-cografya',
  oturum: 'tyt',
  ad: 'Coğrafya',
  ikon: '🗺️',
  renk: 'cografya',
  konular: [
    k('tyt-cog-doga-insan', 'Doğa ve İnsan'),
    k('tyt-cog-dunya-hareket', 'Dünya’nın Şekli ve Hareketleri'),
    k('tyt-cog-konum', 'Coğrafi Konum'),
    k('tyt-cog-harita', 'Harita Bilgisi'),
    k('tyt-cog-iklim-bilgisi', 'İklim Bilgisi (Atmosfer ve İklim Elemanları)'),
    k('tyt-cog-iklim-tipleri', 'İklim Tipleri'),
    k('tyt-cog-ic-kuvvet', 'İç Kuvvetler'),
    k('tyt-cog-dis-kuvvet', 'Dış Kuvvetler'),
    k('tyt-cog-su-toprak-bitki', 'Su, Toprak ve Bitkiler'),
    k('tyt-cog-nufus', 'Nüfus'),
    k('tyt-cog-goc', 'Göç'),
    k('tyt-cog-yerlesme', 'Yerleşme'),
    k('tyt-cog-yer-sekilleri', 'Türkiye’nin Yer Şekilleri'),
    k('tyt-cog-ekonomik', 'Ekonomik Faaliyetler'),
    k('tyt-cog-bolgeler', 'Bölgeler'),
    k('tyt-cog-ulasim', 'Uluslararası Ulaşım Hatları'),
    k('tyt-cog-cevre-toplum', 'Çevre ve Toplum'),
    k('tyt-cog-afetler', 'Doğal Afetler'),
  ],
}

const TYT_FELSEFE: YksDers = {
  id: 'tyt-felsefe',
  oturum: 'tyt',
  ad: 'Felsefe',
  ikon: '💭',
  renk: null,
  konular: [
    k('tyt-fel-tanima', 'Felsefeyi Tanıma'),
    k('tyt-fel-dusunme', 'Felsefe ile Düşünme'),
    k('tyt-fel-varlik', 'Varlık Felsefesi'),
    k('tyt-fel-bilgi', 'Bilgi Felsefesi'),
    k('tyt-fel-bilim', 'Bilim Felsefesi'),
    k('tyt-fel-ahlak', 'Ahlak Felsefesi'),
    k('tyt-fel-din', 'Din Felsefesi'),
    k('tyt-fel-siyaset', 'Siyaset Felsefesi'),
    k('tyt-fel-sanat', 'Sanat Felsefesi'),
  ],
}

const TYT_DIN: YksDers = {
  id: 'tyt-din',
  oturum: 'tyt',
  ad: 'Din Kültürü',
  ikon: '🕌',
  renk: null,
  konular: [
    k('tyt-din-bilgi-inanc', 'Bilgi ve İnanç'),
    k('tyt-din-din-islam', 'Din ve İslam'),
    k('tyt-din-ibadet', 'İslam ve İbadet'),
    k('tyt-din-genclik', 'Gençlik ve Değerler'),
    k('tyt-din-gonul', 'Gönül Coğrafyamız'),
    k('tyt-din-allah-insan', 'Allah İnsan İlişkisi'),
    k('tyt-din-hz-muhammed', 'Hz. Muhammed ve Gençlik'),
    k('tyt-din-hayat', 'Din ve Hayat'),
    k('tyt-din-ahlak', 'Ahlaki Tutum ve Davranışlar'),
    k('tyt-din-yorumlar', 'İslam Düşüncesinde Yorumlar'),
  ],
}

// ---------------------------------------------------------------------------
// AYT — yalnızca AYT'ye özgü başlıklar (bkz. dosya başı)
// ---------------------------------------------------------------------------

const AYT_MATEMATIK: YksDers = {
  id: 'ayt-matematik',
  oturum: 'ayt',
  ad: 'Matematik',
  ikon: '➗',
  renk: 'matematik',
  alanlar: ['say', 'ea'],
  konular: [
    k('ayt-mat-fonksiyon', 'Fonksiyonlar (Bileşke ve Dört İşlem)'),
    // TYT'de "Polinomlar" var (tanım, dört işlem, bölme ve kalan). AYT'nin
    // sorduğu kısım üst dereceden polinomun kökleri, kökler–katsayılar bağı ve
    // çarpanlar; ad o kapsamı söylüyor, kimlik eski kalıyor (kayıt anahtarı).
    k('ayt-mat-polinom', 'Polinomlarda Kökler ve Çarpanlar'),
    k('ayt-mat-ikinci-derece', 'İkinci Dereceden Denklemler'),
    k('ayt-mat-karmasik', 'Karmaşık Sayılar'),
    k('ayt-mat-parabol', 'Parabol'),
    k('ayt-mat-esitsizlik', 'Eşitsizlikler'),
    // Binom bir süre TYT'deydi. 2018–2025 TYT'lerinde Binom'dan soru yok,
    // AYT'lerde her yıl bir soru var; yayınevlerinin listeleri de onu AYT'nin
    // "Sayma, Olasılık ve Binom" başlığında sayıyor. Kimlik `tyt-` önekiyle
    // kaldı: öğrencinin kayıtlı işareti bu kimlikte, yalnızca yeri değişti
    // (`TASINAN_KONULAR`, takip.test.ts).
    k('tyt-mat-binom', 'Binom Açılımı'),
    k('ayt-mat-kosullu-olasilik', 'Koşullu Olasılık'),
    k('ayt-mat-trig-fonksiyon', 'Trigonometrik Fonksiyonlar'),
    k('ayt-mat-trig-denklem', 'Trigonometrik Denklemler'),
    k('ayt-mat-trig-formul', 'Toplam – Fark ve Yarım Açı Formülleri'),
    k('ayt-mat-sinus-kosinus', 'Sinüs ve Kosinüs Teoremleri'),
    k('ayt-mat-logaritma', 'Üstel Fonksiyonlar ve Logaritma'),
    k('ayt-mat-diziler', 'Diziler'),
    k('ayt-mat-limit', 'Limit ve Süreklilik'),
    k('ayt-mat-turev', 'Türev'),
    k('ayt-mat-integral', 'İntegral'),
    k('ayt-geo-analitik', 'Noktanın ve Doğrunun Analitik İncelenmesi', GEO),
    k('ayt-geo-donusum', 'Dönüşüm Geometrisi', GEO),
    k('ayt-geo-cember-analitik', 'Çemberin Analitik İncelenmesi', GEO),
  ],
}

const AYT_FIZIK: YksDers = {
  id: 'ayt-fizik',
  oturum: 'ayt',
  ad: 'Fizik',
  ikon: '🧲',
  renk: 'fizik',
  alanlar: ['say'],
  konular: [
    k('ayt-fiz-vektor', 'Vektörler'),
    k('ayt-fiz-bagil', 'Bağıl Hareket'),
    k('ayt-fiz-newton', 'Newton’un Hareket Yasaları'),
    k('ayt-fiz-sabit-ivme', 'Bir Boyutta Sabit İvmeli Hareket'),
    k('ayt-fiz-iki-boyut', 'İki Boyutta Hareket (Atışlar)'),
    k('ayt-fiz-enerji-hareket', 'Enerji ve Hareket'),
    k('ayt-fiz-momentum', 'İtme ve Çizgisel Momentum'),
    k('ayt-fiz-tork', 'Tork'),
    k('ayt-fiz-denge', 'Denge ve Denge Şartları'),
    k('ayt-fiz-basit-makine', 'Basit Makineler'),
    k('ayt-fiz-elektrik-alan', 'Elektriksel Kuvvet ve Elektrik Alan'),
    k('ayt-fiz-potansiyel', 'Elektriksel Potansiyel'),
    k('ayt-fiz-sigac', 'Düzgün Elektrik Alan ve Sığa'),
    k('ayt-fiz-induksiyon', 'Manyetizma ve Elektromanyetik İndüksiyon'),
    k('ayt-fiz-alternatif', 'Alternatif Akım'),
    k('ayt-fiz-transformator', 'Transformatörler'),
    k('ayt-fiz-cembersel', 'Düzgün Çembersel Hareket'),
    k('ayt-fiz-donerek-oteleme', 'Dönerek Öteleme ve Açısal Momentum'),
    k('ayt-fiz-kepler', 'Kütle Çekim ve Kepler Yasaları'),
    k('ayt-fiz-bhh', 'Basit Harmonik Hareket'),
    k('ayt-fiz-dalga-mekanigi', 'Dalga Mekaniği'),
    k('ayt-fiz-atom', 'Atom Fiziğine Giriş ve Radyoaktivite'),
    k('ayt-fiz-modern', 'Modern Fizik'),
    k('ayt-fiz-modern-teknoloji', 'Modern Fiziğin Teknolojideki Uygulamaları'),
  ],
}

const AYT_KIMYA: YksDers = {
  id: 'ayt-kimya',
  oturum: 'ayt',
  ad: 'Kimya',
  ikon: '⚗️',
  renk: 'kimya',
  alanlar: ['say'],
  konular: [
    k('ayt-kim-modern-atom', 'Modern Atom Teorisi'),
    k('ayt-kim-gazlar', 'Gazlar'),
    k('ayt-kim-cozeltiler', 'Sıvı Çözeltiler ve Çözünürlük'),
    k('ayt-kim-enerji', 'Kimyasal Tepkimelerde Enerji'),
    k('ayt-kim-hiz', 'Kimyasal Tepkimelerde Hız'),
    k('ayt-kim-denge', 'Kimyasal Tepkimelerde Denge'),
    k('ayt-kim-asit-baz', 'Asit-Baz Dengesi'),
    k('ayt-kim-cozunurluk', 'Çözünürlük Dengesi'),
    k('ayt-kim-elektrik', 'Kimya ve Elektrik'),
    k('ayt-kim-karbon', 'Karbon Kimyasına Giriş'),
    k('ayt-kim-organik', 'Organik Bileşikler'),
    k('ayt-kim-enerji-kaynaklari', 'Enerji Kaynakları ve Bilimsel Gelişmeler'),
  ],
}

const AYT_BIYOLOJI: YksDers = {
  id: 'ayt-biyoloji',
  oturum: 'ayt',
  ad: 'Biyoloji',
  ikon: '🧬',
  renk: 'biyoloji',
  alanlar: ['say'],
  konular: [
    k('ayt-biy-sinir', 'Sinir Sistemi'),
    k('ayt-biy-endokrin', 'Endokrin Sistem'),
    k('ayt-biy-duyu', 'Duyu Organları'),
    k('ayt-biy-destek-hareket', 'Destek ve Hareket Sistemi'),
    k('ayt-biy-sindirim', 'Sindirim Sistemi'),
    // "Dolaşım ve Bağışıklık Sistemi" Maarif'in başlıklarıyla ikiye bölündü
    // (Dolaşım Sistemi ve Homeostazi; Doğal ve Kazanılmış Bağışıklık). Eski
    // kimlik Dolaşım'da kaldı, kaydı Bağışıklık'a da kopyalandı
    // (`BOLUNEN_KONULAR`, kayit.ts).
    k('ayt-biy-dolasim', 'Dolaşım Sistemi'),
    k('ayt-biy-bagisiklik', 'Bağışıklık Sistemi'),
    k('ayt-biy-solunum', 'Solunum Sistemi'),
    k('ayt-biy-uriner', 'Üriner Sistem'),
    k('ayt-biy-ureme', 'Üreme Sistemi ve Embriyonik Gelişim'),
    k('ayt-biy-komunite', 'Komünite ve Popülasyon Ekolojisi'),
    k('ayt-biy-genden-proteine', 'Genden Proteine'),
    k('ayt-biy-enerji', 'Canlılarda Enerji Dönüşümleri'),
    k('ayt-biy-bitki', 'Bitki Biyolojisi'),
    k('ayt-biy-canlilar-cevre', 'Canlılar ve Çevre'),
  ],
}

const AYT_EDEBIYAT: YksDers = {
  id: 'ayt-edebiyat',
  oturum: 'ayt',
  ad: 'Edebiyat',
  ikon: '📖',
  renk: 'turkce',
  alanlar: ['ea', 'soz'],
  konular: [
    k('ayt-edb-guzel-sanatlar', 'Güzel Sanatlar ve Edebiyat'),
    k('ayt-edb-siir-bilgisi', 'Şiir Bilgisi (Nazım Biçimi, Ölçü, Uyak, Redif)'),
    k('ayt-edb-soz-sanatlari', 'Söz Sanatları'),
    k('ayt-edb-anlatmaya-bagli', 'Anlatmaya Bağlı Metinler (Hikâye ve Roman)'),
    k('ayt-edb-masal-fabl', 'Masal ve Fabl'),
    k('ayt-edb-ogretici', 'Öğretici Metinler'),
    k('ayt-edb-tiyatro', 'Tiyatro'),
    k('ayt-edb-islamiyet-oncesi', 'İslamiyet Öncesi Türk Edebiyatı (Destan Dönemi)'),
    k('ayt-edb-gecis', 'Geçiş Dönemi Türk Edebiyatı'),
    // "Halk Edebiyatı" üç koluna bölündü: ilk ikisi Maarif'in başlıkları
    // (Anonim Halk Edebiyatı, Âşık Geleneği), üçüncüsünün Maarif'te destesi
    // yok, YKS listelerinin adıyla duruyor. Eski kimlik Anonim'de kaldı,
    // kaydı öteki ikisine de kopyalandı (`BOLUNEN_KONULAR`, kayit.ts).
    k('ayt-edb-halk', 'Anonim Halk Edebiyatı'),
    k('ayt-edb-halk-asik', 'Âşık Edebiyatı (Âşık Geleneği)'),
    k('ayt-edb-halk-tekke', 'Dinî-Tasavvufi Halk Edebiyatı (Tekke)'),
    k('ayt-edb-divan', 'Divan Edebiyatı'),
    k('ayt-edb-tanzimat', 'Tanzimat Edebiyatı'),
    k('ayt-edb-servetifunun', 'Servetifünun Edebiyatı'),
    k('ayt-edb-fecriati', 'Fecriati Edebiyatı'),
    k('ayt-edb-milli', 'Millî Edebiyat'),
    k('ayt-edb-cumhuriyet', 'Cumhuriyet Dönemi Türk Edebiyatı'),
    k('ayt-edb-akimlar', 'Edebî Akımlar'),
    k('ayt-edb-dunya', 'Dünya Edebiyatı'),
  ],
}

/**
 * AYT Tarih ve Coğrafya tek ders.
 *
 * ÖSYM Tarih-1 ile Tarih-2'yi (Coğrafya-1 ile -2'yi) ayrı testlerde soruyor
 * ama kapsamları konu konu ayrılmıyor: ikisi de bütün ortaöğretim
 * programına dayanıyor. Aynı başlıkları iki ders altında yazmak öğrenciye
 * her konuyu iki kez işaretletmek olurdu. Ders adı alana göre değişiyor
 * (`dersAdi`): Eşit Ağırlık öğrencisi "Tarih-1", Sözel "Tarih-1 ve 2" görüyor.
 */
const AYT_TARIH: YksDers = {
  id: 'ayt-tarih',
  oturum: 'ayt',
  ad: 'Tarih',
  ikon: '🏛️',
  renk: 'tarih',
  alanlar: ['ea', 'soz'],
  konular: [
    k('ayt-tar-iki-savas-arasi', 'İki Savaş Arasındaki Dönemde Türkiye ve Dünya'),
    k('ayt-tar-ikinci-dunya', 'II. Dünya Savaşı Sürecinde Türkiye ve Dünya'),
    k('ayt-tar-soguk-savas', 'II. Dünya Savaşı Sonrasında Türkiye ve Dünya'),
    k('ayt-tar-toplumsal-devrim', 'Toplumsal Devrim Çağında Dünya ve Türkiye'),
    k('ayt-tar-xxi-yuzyil', 'XXI. Yüzyılın Eşiğinde Türkiye ve Dünya'),
  ],
}

const AYT_COGRAFYA: YksDers = {
  id: 'ayt-cografya',
  oturum: 'ayt',
  ad: 'Coğrafya',
  ikon: '🗺️',
  renk: 'cografya',
  alanlar: ['ea', 'soz'],
  konular: [
    k('ayt-cog-ekosistem', 'Ekosistemlerin İşleyişi ve Madde Döngüleri'),
    k('ayt-cog-nufus-politika', 'Nüfus Politikaları'),
    k('ayt-cog-sehirler', 'Şehirlerin Fonksiyonları ve Etki Alanları'),
    k('ayt-cog-turkiye-ekonomi', 'Türkiye Ekonomisi'),
    k('ayt-cog-tarim', 'Türkiye’de Tarım ve Hayvancılık'),
    k('ayt-cog-maden-enerji', 'Madenler ve Enerji Kaynakları'),
    k('ayt-cog-sanayi', 'Türkiye’de Sanayi'),
    k('ayt-cog-ulasim-ticaret', 'Türkiye’de Ulaşım, Ticaret ve Turizm'),
    k('ayt-cog-kultur', 'Kültür Bölgeleri ve Türk Kültürü'),
    k('ayt-cog-jeopolitik', 'Jeopolitik Konum ve Ülkeler Arası Etkileşim'),
    k('ayt-cog-orgutler', 'Küresel ve Bölgesel Örgütler'),
    k('ayt-cog-iklim-degisimi', 'Küresel İklim Değişimi'),
    k('ayt-cog-ekstrem', 'Ekstrem Doğa Olayları'),
    k('ayt-cog-cevre', 'Çevre Sorunları ve Doğal Kaynakların Sürdürülebilir Kullanımı'),
  ],
}

const AYT_FELSEFE: YksDers = {
  id: 'ayt-felsefe',
  oturum: 'ayt',
  ad: 'Felsefe Grubu',
  ikon: '💭',
  renk: null,
  alanlar: ['soz'],
  konular: [
    k('ayt-fel-ilk-cag', 'MÖ 6. Yüzyıl – MS 2. Yüzyıl Felsefesi', 'Felsefe'),
    k('ayt-fel-orta-cag', 'MS 2. Yüzyıl – MS 15. Yüzyıl Felsefesi', 'Felsefe'),
    k('ayt-fel-15-17', '15. – 17. Yüzyıl Felsefesi', 'Felsefe'),
    k('ayt-fel-18-19', '18. – 19. Yüzyıl Felsefesi', 'Felsefe'),
    k('ayt-fel-20', '20. Yüzyıl Felsefesi', 'Felsefe'),
    k('ayt-psi-bilim', 'Psikoloji Bilimini Tanıyalım', 'Psikoloji'),
    k('ayt-psi-temel-surecler', 'Psikolojinin Temel Süreçleri', 'Psikoloji'),
    k('ayt-psi-ogrenme', 'Öğrenme, Bellek, Düşünme', 'Psikoloji'),
    k('ayt-psi-ruh-sagligi', 'Ruh Sağlığının Temelleri', 'Psikoloji'),
    k('ayt-sos-giris', 'Sosyolojiye Giriş', 'Sosyoloji'),
    k('ayt-sos-birey-toplum', 'Birey ve Toplum', 'Sosyoloji'),
    k('ayt-sos-yapi', 'Toplumsal Yapı', 'Sosyoloji'),
    k('ayt-sos-degisme', 'Toplumsal Değişme ve Gelişme', 'Sosyoloji'),
    k('ayt-sos-kultur', 'Toplum ve Kültür', 'Sosyoloji'),
    k('ayt-sos-kurumlar', 'Toplumsal Kurumlar', 'Sosyoloji'),
    k('ayt-man-giris', 'Mantığa Giriş', 'Mantık'),
    k('ayt-man-klasik', 'Klasik Mantık', 'Mantık'),
    k('ayt-man-dil', 'Mantık ve Dil', 'Mantık'),
    k('ayt-man-sembolik', 'Sembolik Mantık', 'Mantık'),
  ],
}

const AYT_DIN: YksDers = {
  id: 'ayt-din',
  oturum: 'ayt',
  ad: 'Din Kültürü',
  ikon: '🕌',
  renk: null,
  alanlar: ['soz'],
  konular: [
    k('ayt-din-dunya-ahiret', 'Dünya ve Ahiret'),
    k('ayt-din-kuran-hz-muhammed', 'Kur’an’a Göre Hz. Muhammed'),
    k('ayt-din-kavramlar', 'Kur’an’da Bazı Kavramlar'),
    k('ayt-din-inanc-meseleleri', 'İnançla İlgili Meseleler'),
    k('ayt-din-yahudilik-hristiyanlik', 'Yahudilik ve Hristiyanlık'),
    k('ayt-din-islam-bilim', 'İslam ve Bilim'),
    k('ayt-din-anadolu', 'Anadolu’da İslam'),
    k('ayt-din-tasavvuf', 'İslam Düşüncesinde Tasavvufi Yorumlar'),
    k('ayt-din-guncel', 'Güncel Dinî Meseleler'),
    k('ayt-din-hint-cin', 'Hint ve Çin Dinleri'),
  ],
}

/**
 * YDT — konu değil soru tipi ve dil bilgisi başlıkları.
 *
 * YDT bir dil sınavı; öğrencinin çalışma listesi ÖSYM'nin soru tiplerinden
 * (kelime, cloze test, çeviri, okuma…) ve dil bilgisi başlıklarından
 * oluşuyor. Adlar Türkçe, yaygın İngilizce karşılığı parantezde: dil
 * öğrencisinin kaynakları iki adı da kullanıyor.
 */
const YDT: YksDers = {
  id: 'ydt',
  oturum: 'ayt',
  ad: 'YDT',
  ikon: '🌐',
  renk: 'ingilizce',
  alanlar: ['dil'],
  konular: [
    k('ydt-zamanlar', 'Zamanlar (Tenses)', 'Dil Bilgisi'),
    k('ydt-kipler', 'Kipler (Modals)', 'Dil Bilgisi'),
    k('ydt-edilgen', 'Edilgen Yapı (Passive Voice)', 'Dil Bilgisi'),
    k('ydt-kosul', 'Koşul Cümleleri (If Clauses)', 'Dil Bilgisi'),
    k('ydt-sifat-cumlecik', 'Sıfat Cümlecikleri (Relative Clauses)', 'Dil Bilgisi'),
    k('ydt-isim-cumlecik', 'İsim Cümlecikleri (Noun Clauses)', 'Dil Bilgisi'),
    k('ydt-zarf-cumlecik', 'Zarf Cümlecikleri ve Bağlaçlar', 'Dil Bilgisi'),
    k('ydt-fiilimsi', 'Fiilimsiler (Gerunds and Infinitives)', 'Dil Bilgisi'),
    k('ydt-edatlar', 'Edatlar (Prepositions)', 'Dil Bilgisi'),
    k('ydt-kelime', 'Kelime Bilgisi', 'Soru Tipleri'),
    k('ydt-cloze', 'Cloze Test', 'Soru Tipleri'),
    k('ydt-cumle-tamamlama', 'Cümle Tamamlama', 'Soru Tipleri'),
    k('ydt-ceviri-ing-tr', 'Çeviri (İngilizce – Türkçe)', 'Soru Tipleri'),
    k('ydt-ceviri-tr-ing', 'Çeviri (Türkçe – İngilizce)', 'Soru Tipleri'),
    k('ydt-okuma', 'Okuma Parçaları', 'Soru Tipleri'),
    k('ydt-diyalog', 'Diyalog Tamamlama', 'Soru Tipleri'),
    k('ydt-yakin-anlam', 'Anlamca En Yakın Cümle', 'Soru Tipleri'),
    k('ydt-paragraf-tamamlama', 'Paragraf Tamamlama', 'Soru Tipleri'),
    k('ydt-anlam-butunlugu', 'Anlam Bütünlüğünü Bozan Cümle', 'Soru Tipleri'),
  ],
}

/** Bütün dersler, ekrandaki sırayla. TYT'de sıra sınavdaki test sırası. */
export const YKS_DERSLERI: readonly YksDers[] = [
  TYT_TURKCE,
  TYT_MATEMATIK,
  TYT_FIZIK,
  TYT_KIMYA,
  TYT_BIYOLOJI,
  TYT_TARIH,
  TYT_COGRAFYA,
  TYT_FELSEFE,
  TYT_DIN,
  AYT_MATEMATIK,
  AYT_FIZIK,
  AYT_KIMYA,
  AYT_BIYOLOJI,
  AYT_EDEBIYAT,
  AYT_TARIH,
  AYT_COGRAFYA,
  AYT_FELSEFE,
  AYT_DIN,
  YDT,
]

/**
 * Bir oturumda öğrencinin gördüğü dersler.
 *
 * TYT herkese aynı. AYT öğrencinin alanına göre süzülüyor; alan seçilmemişse
 * (`null`, "Karar vermedim") boş liste dönüyor ve ekran alanı soruyor —
 * hedef kataloğundaki kuralın aynısı (AGENTS.md → "Alan seçilmemiş
 * olabilir"): bir alan varsayıp ona göre ders göstermek, öğrencinin hiç
 * söylemediği bir kararı onun yerine vermek olurdu.
 */
export function oturumDersleri(oturum: YksOturum, alan: PuanTuru | null): YksDers[] {
  if (oturum === 'tyt') return YKS_DERSLERI.filter((d) => d.oturum === 'tyt')
  if (alan === null) return []
  return YKS_DERSLERI.filter((d) => d.oturum === 'ayt' && d.alanlar?.includes(alan))
}

/**
 * Ekranda yazılan ders adı. AYT Tarih/Coğrafya alana göre test adını alıyor
 * (bkz. `AYT_TARIH`); öteki dersler kendi adını.
 */
export function dersAdi(ders: YksDers, alan: PuanTuru | null): string {
  if (ders.id !== 'ayt-tarih' && ders.id !== 'ayt-cografya') return ders.ad
  if (alan === 'ea') return `${ders.ad}-1`
  if (alan === 'soz') return `${ders.ad}-1 ve 2`
  return ders.ad
}

/** Kimlikten ders. */
export function yksDersBul(id: string): YksDers | null {
  return YKS_DERSLERI.find((d) => d.id === id) ?? null
}

/** Bütün konular, kimlikle — kayıt doğrulaması ve testler için. */
export function tumYksKonulari(): YksKonu[] {
  return YKS_DERSLERI.flatMap((d) => d.konular)
}

/** Alanların ekrandaki adı — Ayarlar › Alanım ve kurulumla aynı adlar. */
export const ALAN_ADLARI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'Eşit Ağırlık',
  soz: 'Sözel',
  dil: 'Dil',
}
