import type { KonuDersId } from '../konu/tip'

/**
 * Kaynak Takibi'nin konu listeleri: sınıf → ders → ünite → konu.
 *
 * - **9, 10, 11: Türkiye Yüzyılı Maarif Modeli.** Ünite adları programın
 *   temaları (tymm.meb.gov.tr, `lib/konu/maarif/iskelet.json`), konu adları
 *   haritanın Maarif'e göre yazılmış destelerinden (`lib/konu/icerik/`).
 * - **12: 2018 programı.** Maarif'in 12. sınıfı yayımlanmadı; bu yılın
 *   12'leri ve mezunlar 2018 programını görüyor. Harita 12'de 9–11'de kartı
 *   olan konuları tekrar yazmıyor (logaritma, trigonometrik denklem,
 *   dönüşümler, enerji dönüşümleri, düzgün çembersel hareket, İnkılap
 *   Tarihi'nin 1. ünitesi); test kitabı onları 12'de işlediği için burada
 *   2018 ünite sırasıyla **yazıldı**.
 * - **İngilizce** test kitapları üniteyle ilerliyor: konu = ünite.
 *
 * Liste haritadan **ayrı** tutuluyor: harita destesinin adı ya da bölünmesi
 * değişince öğrencinin kitapta attığı tikler kaybolmasın. Haritayı içe
 * aktarmak bütün kart içeriğini bu ekrana yüklerdi.
 *
 * Konunun kayıt kimliği adından türüyor (`konuKimligi`): **adı değiştirmek,
 * o konuya atılmış tikleri öksüz bırakır.** Yazım düzeltmesi bile gerekirse
 * eski adı kimlik olarak koruyan bir eşleme ekle.
 */

export type KaynakSinifi = 9 | 10 | 11 | 12

export const KAYNAK_SINIFLARI: readonly KaynakSinifi[] = [9, 10, 11, 12]

export type Unite = { ad: string; konular: readonly string[] }

export type KaynakDersi = {
  /** Renk ve kayıt kimliği: haritadaki dersle aynı (`--konu-<ders>`). */
  id: KonuDersId
  ad: string
  ikon: string
}

/*
  Simgeler haritanın ders listesiyle (`KONU_DERSLERI`) aynı; oradan içe
  aktarılmıyor çünkü `lib/konu` bütün kart içeriğini yüklüyor.
*/
const DERSLER: readonly KaynakDersi[] = [
  { id: 'matematik', ad: 'Matematik', ikon: '➗' },
  { id: 'turkce', ad: 'Edebiyat', ikon: '📖' },
  { id: 'fizik', ad: 'Fizik', ikon: '🧲' },
  { id: 'kimya', ad: 'Kimya', ikon: '⚗️' },
  { id: 'biyoloji', ad: 'Biyoloji', ikon: '🧬' },
  { id: 'tarih', ad: 'Tarih', ikon: '🏛️' },
  { id: 'cografya', ad: 'Coğrafya', ikon: '🗺️' },
  { id: 'ingilizce', ad: 'İngilizce', ikon: '🌐' },
]

/** Sınıfın, konu listesi olan dersleri; sıra ders seçicinin sırası. */
export function kaynakDersleri(sinif: KaynakSinifi): KaynakDersi[] {
  return DERSLER.filter((d) => PROGRAMLAR[`${sinif}-${d.id}`] !== undefined).map((d) => ({
    ...d,
    ad: dersAdi(d.id, sinif),
  }))
}

/**
 * Ekrandaki ders adı. 12'nin Tarih'i 2018'de T.C. İnkılap Tarihi ve
 * Atatürkçülük dersi (Çağdaş Türk ve Dünya Tarihi seçmeli; üniteleri
 * İnkılap Tarihi'nin 4–8. üniteleriyle örtüşüyor).
 */
export function dersAdi(ders: KonuDersId, sinif: KaynakSinifi): string {
  if (ders === 'tarih' && sinif === 12) return 'İnkılap Tarihi'
  return DERSLER.find((d) => d.id === ders)?.ad ?? ders
}

export function dersIkonu(ders: KonuDersId): string {
  return DERSLER.find((d) => d.id === ders)?.ikon ?? '📚'
}

/** Sınıf ve dersin üniteleri; listesi olmayan çift için boş dizi. */
export function uniteler(sinif: KaynakSinifi, ders: KonuDersId): readonly Unite[] {
  return PROGRAMLAR[`${sinif}-${ders}`] ?? []
}

/** Konunun kayıt kimliği: küçük harf, Türkçe harfler sadeleşmiş, tireli. */
export function konuKimligi(ad: string): string {
  return ad
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşüâîû]/g, (h) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' })[h] ?? h)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const PROGRAMLAR: Partial<Record<string, readonly Unite[]>> = {
  '9-matematik': [
    {
      ad: 'Sayılar',
      konular: [
        'Üslü ve Köklü Gösterimlerle İşlemler',
        'Gerçek Sayı Aralıkları ve Küme Sembolleri',
        'Sayı Kümeleri ve İşlem Özellikleri',
        'İşlem Özelliklerini Cebirsel Olarak İfade Etme',
      ],
    },
    {
      ad: 'Nicelikler ve Değişimler',
      konular: [
        'Doğrusal Fonksiyonlar ve Nitel Özellikleri',
        'Mutlak Değer Fonksiyonu ve Nitel Özellikleri',
        'Doğrusal Denklem ve Eşitsizlikler İçeren Problemler',
      ],
    },
    {
      ad: 'Geometrik Şekiller',
      konular: [
        'Üçgende Açı ve Kenarla İlgili Özellikler',
      ],
    },
    {
      ad: 'Eşlik ve Benzerlik',
      konular: [
        'Geometrik Dönüşümler',
        'Eşlik ve Benzerlik Koşulları',
        'Benzer Üçgenler Oluşturma',
        'Tales, Öklid ve Pisagor Teoremleri',
        'Eşlik ve Benzerlik Problemleri',
      ],
    },
    {
      ad: 'Algoritma ve Bilişim',
      konular: [
        'Algoritma Temelli Problemler',
        'Mantık Bağlaçları ve Niceleyiciler',
        'Mantık Bağlaçlarının Algoritmik Kullanımı',
      ],
    },
    {
      ad: 'İstatistiksel Araştırma Süreci',
      konular: [
        'Tek Nicel Değişkenli Veri Dağılımları',
        'Başkalarının Oluşturduğu Veri Dağılımlarını İnceleme',
      ],
    },
    {
      ad: 'Veriden Olasılığa',
      konular: [
        'Deneysel Olasılık',
        'Teorik Olasılık',
      ],
    },
  ],
  '9-turkce': [
    {
      ad: 'Sözün İnceliği',
      konular: [
        'Edebiyat ve Güzel Sanatlar',
        'Şiir Bilgisi',
        'Söz Sanatları',
        'Deneme ve Düşünce Yazıları',
      ],
    },
    {
      ad: 'Anlam Arayışı',
      konular: [
        'Sözcükte Anlam',
        'Deyim, Atasözü ve Söz Öbekleri',
        'Cümlede Anlam',
        'Paragrafta Anlam',
      ],
    },
    {
      ad: 'Anlamın Yapı Taşları',
      konular: [
        'Anlatmaya Bağlı Metinlerin Yapısı',
        'Anlatıcı ve Bakış Açısı',
        'Hikâye ve Roman',
        'Tiyatro',
      ],
    },
    {
      ad: 'Dilin Zenginliği',
      konular: [
        'Ses Bilgisi',
        'Yazım Kuralları',
        'Noktalama İşaretleri',
        'Türkçenin Söz Varlığı',
      ],
    },
  ],
  '9-fizik': [
    {
      ad: 'Fizik Bilimi ve Kariyer Keşfi',
      konular: [
        'Fizik Bilimi',
        'Fizik Biliminin Alt Dalları',
        'Fizik Bilimine Yön Verenler',
        'Fizik Bilimi ile İlgili Kariyer Keşfi',
      ],
    },
    {
      ad: 'Kuvvet ve Hareket',
      konular: [
        'Temel ve Türetilmiş Nicelikler',
        'Skaler ve Vektörel Nicelikler',
        'Vektörler',
        'Doğadaki Temel Kuvvetler',
        'Hareket ve Hareket Türleri',
      ],
    },
    {
      ad: 'Akışkanlar',
      konular: [
        'Basınç',
        'Sıvılarda Basınç',
        'Açık Hava Basıncı',
        'Kaldırma Kuvveti',
        'Bernoulli İlkesi',
      ],
    },
    {
      ad: 'Enerji',
      konular: [
        'İç Enerji, Isı ve Sıcaklık',
        'Isı, Öz Isı ve Isı Sığası',
        'Hâl Değişimi',
        'Isıl Denge',
        'Isı Aktarım Yolları',
        'Isı İletim Hızı',
      ],
    },
  ],
  '9-kimya': [
    {
      ad: 'Etkileşim',
      konular: [
        'Günlük Hayatta Kimya',
        'Kimyasal Maddelerin Kullanımı ve Güvenlik',
        'Kimyanın Alt Disiplinleri',
        'Kimya Alanında Kariyer Olanakları',
        'Atom Teorileri ve Atomun Yapısı',
        'Atom Orbitalleri ve Elektron Dizilimi',
        'Periyodik Tabloda Yer Bulma',
        'Periyodik Özellikler',
      ],
    },
    {
      ad: 'Çeşitlilik',
      konular: [
        'Metalik Bağ',
        'İyonik Bağ',
        'Kovalent Bağ',
        'Lewis Nokta Yapısı',
        'Molekül Polarlığı ve Apolarlığı',
        'Bileşiklerin Adlandırılması',
        'Moleküller Arası Etkileşimler',
        'Katılar ve Özellikleri',
        'Sıvılar ve Özellikleri',
      ],
    },
    {
      ad: 'Sürdürülebilirlik',
      konular: [
        'Metal Nanoparçacıklar',
        'Metal ve Alaşımların Çevresel Etkileri',
        'Yeşil Kimyanın Atık Önleme İlkesi',
      ],
    },
  ],
  '9-biyoloji': [
    {
      ad: 'Yaşam',
      konular: [
        'Biyolojinin Önemi',
        'Biyoloji Biliminin Gelişimindeki Dönüm Noktaları',
        'Bilimin Doğası',
        'Bilimsel Araştırma Süreçleri',
        'Bilim Etiği',
        'Canlıların Ortak Özellikleri',
        'İnorganik Moleküller',
        'Organik Moleküller',
      ],
    },
    {
      ad: 'Organizasyon',
      konular: [
        'Prokaryot ve Ökaryot Hücre',
        'Hücre Zarı',
        'Sitoplazma',
        'Sitoplazmik Yapılar',
        'Organeller ve Çekirdek',
        'Hücre Zarından Madde Geçişleri',
        'Sınıflandırmada Temel Yaklaşımlar',
        'Üç Üst Âlem Sisteminde Canlılar',
        'Biyoçeşitlilik',
      ],
    },
  ],
  '9-tarih': [
    {
      ad: 'Geçmişin İnşa Sürecinde Tarih',
      konular: [
        'Tarih Öğrenmenin Faydaları',
        'Tarihin Doğası',
        'Tarihsel Bilginin Üretim Süreci',
        'Tarih Araştırma ve Yazımında Dijitalleşme',
      ],
    },
    {
      ad: 'Eski Çağ Medeniyetleri',
      konular: [
        'Tarım Devrimi’nin Yerleşmeye ve Ekonomiye Etkisi',
        'Eski Çağ Medeniyetlerinde Yönetim ve Ordu',
        'Eski Çağ Medeniyetlerinde Hukuk',
        'Eski Çağ’da İnançlar, Bilim ve Sanat',
        'Türklerde Konargöçer Yaşam',
      ],
    },
    {
      ad: 'Orta Çağ Medeniyetleri',
      konular: [
        'Orta Çağ’da Yaşanan Kitlesel Göçler',
        'Orta Çağ Devletlerinde Yönetim ve Ordu',
        'Orta Çağ’daki Ticaret Yolları',
        'Orta Çağ’da Bilim, Kültür ve Sanat',
      ],
    },
  ],
  '9-cografya': [
    {
      ad: 'Coğrafyanın Doğası',
      konular: [
        'Coğrafya Biliminin Konusu ve Bölümleri',
        'Niçin Coğrafya Öğrenmeliyiz?',
        'Coğrafya Biliminin Gelişimi',
      ],
    },
    {
      ad: 'Mekânsal Bilgi Teknolojileri',
      konular: [
        'Mekânın Aynası Haritalar',
        'Türkiye’nin Coğrafi Konumu',
        'Mekânsal Bilgi Teknolojilerinin Bileşenleri',
      ],
    },
    {
      ad: 'Doğal Sistemler ve Süreçler',
      konular: [
        'Hava Olayları ve Günlük Hayata Etkileri',
        'İklim Sisteminin Bileşen ve Değişkenleri',
        'İklim Türleri',
        'İklim Sisteminde Yaşanan Değişiklikler',
      ],
    },
    {
      ad: 'Beşerî Sistemler ve Süreçler',
      konular: [
        'Nüfusun Tarihsel Değişimi ve Geleceği',
        'Nüfusun Dağılışı ve Hareketleri',
        'Demografik Dönüşüm ve Nüfus Piramitleri',
        'Nüfusla İlgili Fırsat, Sorun ve Politikalar',
      ],
    },
    {
      ad: 'Ekonomik Faaliyetler ve Etkileri',
      konular: [
        'Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler',
      ],
    },
    {
      ad: 'Afetler ve Sürdürülebilir Çevre',
      konular: [
        'Tehlike, Risk ve Afet',
        'Afet Türleri',
        'Bütüncül Afet Yönetimi',
      ],
    },
    {
      ad: 'Bölgeler, Ülkeler ve Küresel Bağlantılar',
      konular: [
        'Bölge ve Bölge Sınırı',
      ],
    },
  ],
  '10-matematik': [
    {
      ad: 'Geometrik Şekiller',
      konular: [
        'Dik Üçgende Trigonometrik Oranlar ve Özdeşlikler',
        'Üçgende Yardımcı Elemanlar',
        'Üçgenin Alanı',
        'Sinüs ve Kosinüs Teoremleri',
      ],
    },
    {
      ad: 'İstatistiksel Araştırma Süreci',
      konular: [
        'İki Kategorik Değişkenli Veriler',
        'Başkalarının Oluşturduğu Kategorik Verileri İnceleme',
      ],
    },
    {
      ad: 'Sayılar',
      konular: [
        'Bir Doğal Sayının Asal Çarpanları ve Bölenleri',
        'En Büyük Ortak Bölen, En Küçük Ortak Kat',
        'Bölünebilme',
      ],
    },
    {
      ad: 'Nicelikler ve Değişimler',
      konular: [
        'Gerçek Sayılarda Fonksiyon Olma Şartları',
        'Karesel Fonksiyon ve Nitel Özellikleri',
        'Karekök Fonksiyonu ve Nitel Özellikleri',
        'Rasyonel Fonksiyon ve Nitel Özellikleri',
        'Fonksiyonların Ters Fonksiyonları',
        'Fonksiyonlarla Denklem ve Eşitsizlik Problemleri',
      ],
    },
    {
      ad: 'Sayma, Algoritma ve Bilişim',
      konular: [
        'Sayma Stratejileri',
        'Cebirsel İşlemlerin Algoritmik Yapısı',
      ],
    },
    {
      ad: 'Analitik İnceleme',
      konular: [
        'Dik Koordinat Sisteminde Noktanın Analitik İncelenmesi',
        'Dik Koordinat Sisteminde Doğrunun Analitik İncelenmesi',
      ],
    },
    {
      ad: 'Veriden Olasılığa',
      konular: [
        'Koşullu Olasılık',
        'Bayes Teoremi',
      ],
    },
  ],
  '10-turkce': [
    {
      ad: 'Sözün Ezgisi',
      konular: [
        'Masal',
        'Anonim Halk Edebiyatı',
        'Ahenk Ögeleri',
      ],
    },
    {
      ad: 'Kelimelerin Ritmi',
      konular: [
        'Şiirde İmge ve İleti',
        'Sözcük Türleri',
        'Fiiller',
      ],
    },
    {
      ad: 'Dünden Bugüne',
      konular: [
        'Destan',
        'Mesnevi ve Halk Hikâyesi',
      ],
    },
    {
      ad: 'Nesillerin Mirası',
      konular: [
        'Millî Edebiyat',
        'Millî Edebiyatta Türler',
      ],
    },
  ],
  '10-fizik': [
    {
      ad: 'Kuvvet ve Hareket',
      konular: [
        'Sabit Hızlı Hareket',
        'Bir Boyutta Sabit İvmeli Hareket',
      ],
    },
    {
      ad: 'Enerji',
      konular: [
        'İş, Enerji ve Güç',
        'Enerji Biçimleri',
        'Mekanik Enerji',
        'Enerji Kaynakları',
      ],
    },
    {
      ad: 'Elektrik',
      konular: [
        'Basit Elektrik Devreleri',
        'Elektrik Akımı',
        'Ohm Yasası',
        'Dirençlerin Bağlanması',
        'Üreteçlerin Bağlanması',
        'Elektrik Akımının Tehlikelerine Karşı Önlemler',
        'Topraklamanın Önemi',
      ],
    },
    {
      ad: 'Dalgalar',
      konular: [
        'Periyodik Hareketler',
        'Dalgaların Temel Kavramları',
        'Dalgaların Sınıflandırılması',
        'Dalgaların Yayılma Süratini Etkileyen Etmenler',
        'Su Dalgalarında Yansıma ve Kırılma',
        'Rezonans ve Deprem',
      ],
    },
  ],
  '10-kimya': [
    {
      ad: 'Etkileşim',
      konular: [
        'Kimyasal Değişimin Göstergeleri',
        'Kimyasal Tepkimelerin Oluşumu',
        'Kimyasal Tepkime Türleri',
        'Mol Kavramı',
        'Kimyasal Tepkime Denklemlerinin Denkleştirilmesi',
        'Kimyasal Hesaplamalar',
        'Gazların Özellikleri ve Kinetik Moleküler Teori',
        'Gaz Yasaları',
        'İdeal Gaz Yasası',
        'Graham Difüzyon ve Efüzyon Yasası',
      ],
    },
    {
      ad: 'Çeşitlilik',
      konular: [
        'Çözünme Süreci',
        'Maddelerin Birbiri İçindeki Çözünebilirliği',
        'Çözünme Olayının Sınıflandırılması',
        'Çözünürlük',
        'Çözünürlüğe Etki Eden Faktörler',
        'Çözeltilerin Sınıflandırılması',
        'Derişim Birimleri',
        'Koligatif Özellikler',
      ],
    },
    {
      ad: 'Sürdürülebilirlik',
      konular: [
        'Makro ve Mikro Ölçekli Deneyler',
        'Atmosferdeki Tepkimeler ve Küresel Sorunlar',
      ],
    },
  ],
  '10-biyoloji': [
    {
      ad: 'Enerji',
      konular: [
        'Canlılık İçin Enerjinin Önemi',
        'Işık Enerjisiyle Besin Sentezi: Fotosentez',
        'Işık Kullanılmadan Besin Sentezi: Kemosentez',
        'Sindirim',
        'Canlılarda Sindirim Yapıları',
        'İnsanda Sindirim',
        'Emilim ve Taşınma',
        'Hücresel Solunum',
        'Besinlerin Solunuma Katılma Yolları',
        'Fermantasyon',
        'Enerji-Metabolizma İlişkisi',
      ],
    },
    {
      ad: 'Ekoloji',
      konular: [
        'Ekosistemin Bileşenleri',
        'Tür İçi ve Türler Arası Etkileşimler',
        'Süksesyon',
        'Popülasyon Dinamikleri',
        'Ekosistemde Madde ve Enerji Akışı',
        'Madde Döngüleri',
        'Ekolojik Sürdürülebilirliğin Önemi',
        'Sürdürülebilirliği Kısıtlayan Durumlar',
        'Ekolojik Sürdürülebilirliğin Sağlanması',
      ],
    },
  ],
  '10-tarih': [
    {
      ad: 'Türkistan’dan Türkiye’ye (1040-1299)',
      konular: [
        'Türkistan’dan Türkiye’ye Askerî Mücadeleler',
        'Türk Devlet ve Ordu Teşkilatındaki Değişim',
        'Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri',
        'Türk-İslam Medeniyetinde Bilim, Kültür ve Sanat',
      ],
    },
    {
      ad: 'Beylikten Devlete Osmanlı (1299-1453)',
      konular: [
        'Osmanlı Devleti’nin Kuruluşuna Dair Görüşler',
        'Anadolu ve Rumeli’deki Siyasi ve Askerî Mücadeleler',
        'Devletleşme Süreci: Ordu, Hukuk ve Toprak',
        'Fethettiği Topraklarda Kalıcı Olma Politikaları',
        'İlim ve İrfan Geleneğinin Oluşması',
      ],
    },
    {
      ad: 'Cihan Devleti Osmanlı (1453-1683)',
      konular: [
        '1453-1683 Arasındaki Siyasi ve Askerî Mücadeleler',
        'Yönetim ve Ordu Yapısındaki Değişim',
        'Avrupa’nın Sömürgeci Politikalarının Etkileri',
        'Önemli İsyanların Neden ve Sonuçları',
        '1453-1683 Arasında Bilim, Kültür ve Sanat',
      ],
    },
  ],
  '10-cografya': [
    {
      ad: 'Coğrafyanın Doğası',
      konular: [
        'Coğrafi Bakış',
      ],
    },
    {
      ad: 'Mekânsal Bilgi Teknolojileri',
      konular: [
        'CBS ve Uzaktan Algılamanın Uygulama Alanları',
        'Mekânsal Verilerin Haritalara Aktarılması',
      ],
    },
    {
      ad: 'Doğal Sistemler ve Süreçler',
      konular: [
        'Tektonik Süreçler',
        'İklim ve Kayaç Yapısının Aşınmaya Etkisi',
        'Aşınım ve Birikim Süreçlerinin Etkisi',
        'Yeryüzü Şekilleri ile İlgili Saha Çalışması',
        'Yeryüzü Şekilleri ile Beşerî Faaliyetler',
      ],
    },
    {
      ad: 'Beşerî Sistemler ve Süreçler',
      konular: [
        'Yerleşmelerin Kuruluşu ve Gelişimi',
        'Yerleşmelerin Fonksiyonları',
      ],
    },
    {
      ad: 'Ekonomik Faaliyetler ve Etkileri',
      konular: [
        'Ekonomik Faaliyetlerin Özellikleri',
        'Ekonomik Sektörler ve Gelişmişlik',
        'Türkiye Ekonomisinin Sektörel Dağılımı',
      ],
    },
    {
      ad: 'Afetler ve Sürdürülebilir Çevre',
      konular: [
        'Afetlerle Mücadelede İyi Uygulama Örnekleri',
        'Afetlere Karşı Dirençli Yaşam Alanları',
        'Afetlerden Korunma',
        'Afet Bilinci',
      ],
    },
    {
      ad: 'Bölgeler, Ülkeler ve Küresel Bağlantılar',
      konular: [
        'Türk Kültürünün Mekânsal Özellikleri',
      ],
    },
  ],
  '11-matematik': [
    {
      ad: 'İstatistiksel Araştırma Süreci',
      konular: [
        'İki Nicel Değişkenli Veriler',
        'Hazır Nicel Verileri İnceleme',
      ],
    },
    {
      ad: 'Geometrik Şekiller',
      konular: [
        'Dörtgenlerin Özellikleri',
        'Özel Dörtgenler Arasındaki İlişkiler',
        'Çokgenlerin Sınıflandırılması',
        'Dışbükey Çokgenlerin Özellikleri',
        'Çokgenlerle İlgili Problemler',
      ],
    },
    {
      ad: 'Nicelikler ve Değişimler · Trigonometri',
      konular: [
        'Trigonometrik Fonksiyonlar',
        'Trigonometrik Denklemler',
      ],
    },
    {
      ad: 'Nicelikler ve Değişimler · Logaritma',
      konular: [
        'Üstel Fonksiyonlar',
        'Üstel Fonksiyonların Tersi',
        'Logaritmik Fonksiyonlar',
        'Üstel ve Logaritmik Denklemler',
      ],
    },
    {
      ad: 'Nicelikler ve Değişimler · Fonksiyonlar',
      konular: [
        'Fonksiyonların Bileşkesi',
        'Fonksiyonlarda Dört İşlem',
      ],
    },
  ],
  '11-turkce': [
    {
      ad: 'Bir Diyeceğim Var!',
      konular: [
        'Karagöz ve Geleneksel Tiyatro',
        'Mektup ve Dilekçe',
        'E-posta ve İletişim',
      ],
    },
    {
      ad: 'Kültür Yolculuğu',
      konular: [
        'Türk Dünyasından Hikâye',
        'Orhun Yazıtları',
        'Dîvânu Lugâti’t-Türk ve Anı',
        'Âşık Geleneği ve Atışma',
        'Müze İzlenimi ve Kültürel Anlatım',
      ],
    },
    {
      ad: 'Yaşamın İzinde',
      konular: [
        'Roman ve Sanatçı-Yaşam İlişkisi',
        'Biyografi ve Tezkire',
        'Radyo Tiyatrosu',
        'Roman Kişisiyle Hayalî Mülakat',
      ],
    },
    {
      ad: 'Hayatın Aynası',
      konular: [
        'Tiyatro Metnini Çözümleme',
        'Küçürek Hikâye',
        'Belgesel ve Afiş',
      ],
    },
  ],
  '11-fizik': [
    {
      ad: 'Kuvvet ve Hareket',
      konular: [
        'Serbest Düşme',
        'İki Boyutta Sabit İvmeli Hareket',
        'Newton Hareket Yasaları',
        'Sürtünme Kuvveti',
        'Limit Hız',
        'Çembersel Hareket',
      ],
    },
    {
      ad: 'Elektrik ve Manyetizma',
      konular: [
        'Elektriksel Kuvvet ve Elektriksel Alan',
        'Manyetik Alan ve Manyetik Kuvvet',
        'İndüksiyon Akımı',
        'Transformatörler',
      ],
    },
    {
      ad: 'Optik',
      konular: [
        'Işık Şiddeti, Işık Akısı ve Aydınlanma',
        'Düzlem Aynalar',
        'Küresel Aynalar',
        'Kırılma',
        'Görünür Derinlik',
        'Fiber Optik',
        'Prizmalar',
        'Mercekler',
      ],
    },
  ],
  '11-kimya': [
    {
      ad: 'Etkileşim',
      konular: [
        'Tepkimelerde Enerji Değişimi',
        'Maddelerin Enerji Potansiyeli',
        'Bağ Enerjileriyle Tepkime Entalpisi',
        'Standart Oluşum Entalpileri',
        'Tepkimeler İçin Gerekli Şartlar',
        'Ortalama Tepkime Hızı',
        'Tepkime Hızına Etki Eden Faktörler',
        'Hız Denkleminin Belirlenmesi',
      ],
    },
    {
      ad: 'Çeşitlilik',
      konular: [
        'Tersinir Tepkimelerin Özellikleri',
        'Fiziksel ve Kimyasal Denge',
        'Denge Sabiti',
        'Tepkime Oranı',
        'Dengeyi Etkileyen Faktörler',
        'Suyun Otoiyonizasyonu',
        'Asit ve Baz Teorileri',
        'Asitlerin ve Bazların Kuvveti',
        'Kuvvetli ve Zayıf Asit-Bazlarda pH',
        'Nötralleşme Tepkimeleri',
        'Asit-Baz Titrasyonları',
        'Asidik ve Bazik Ürün Seçimi',
        'Molar Çözünürlük',
        'Çözünürlük Çarpımı (Kçç)',
        'Çözünürlüğe Etki Eden Faktörler',
      ],
    },
    {
      ad: 'Sürdürülebilirlik',
      konular: [
        'Fermantasyonla Yeşil Hidrojen',
        'Nanoteknolojik Ürünler',
        'Mikroplastik ve Nanoplastikler',
      ],
    },
  ],
  '11-biyoloji': [
    {
      ad: 'Tepki',
      konular: [
        'Canlıların Uyaranlara Tepkileri',
        'Bitkilerde Hormonlar',
        'Bitkilerde Tepki Mekanizmaları',
        'Uyartıların Alınması',
        'Nöronların Yapısı',
        'Nöronlarda Sinyal İletimi ve Sinaps',
        'Duyu Organları',
        'Uyarıların Yorumlanması',
        'Hayvanlarda Sinir Sistemleri',
        'İnsan Sinir Sisteminin Yapısı',
        'Refleksler',
        'Kemik Dokusu',
        'Eklem ve Kasların Hareketteki Rolü',
        'Kemik ve Kasların Birlikte Çalışması',
        'Kaslarda Kasılmanın Kontrolü',
        'Kasların Kasılma Mekanizması',
        'Doğal Bağışıklık',
        'Kazanılmış Bağışıklık',
        'Alerji',
      ],
    },
    {
      ad: 'Homeostazi',
      konular: [
        'Canlılarda Homeostatik Sistemler',
        'Homeostatik Süreçler',
        'Pozitif ve Negatif Geri Bildirim',
        'Sinir Sistemi ve Homeostazi',
        'Endokrin Sistem ve Homeostazi',
        'Dolaşım Sistemi ve Homeostazi',
        'Solunum Sistemi ve Homeostazi',
        'Boşaltım Sistemi ve Homeostazi',
        'Sistemlerin Eş Güdümlü Çalışması',
        'Homeostazinin Sağlanamadığı Durumlar',
      ],
    },
  ],
  '11-tarih': [
    {
      ad: 'Değişen Dünyada Osmanlı Devleti (1683-1789)',
      konular: [
        '1683-1789 Siyasi ve Askerî Mücadeleler',
        'Lale Devri ve Toplum Hayatı',
        '1755 Lizbon ve 1766 İstanbul Depremleri',
        'Sanayi Devrimi’nin Etkileri',
      ],
    },
    {
      ad: 'Dönüşüm Sürecinde Osmanlı (1789-1908)',
      konular: [
        'Fransız İhtilali’nin Etkileri',
        '1789-1908 Siyasi ve İdari Dönüşüm',
        '1789-1908 Bilim, Sanat ve Teknoloji',
        'Osmanlı’da Sanayileşme Çabaları',
      ],
    },
    {
      ad: 'Savaşlar Sarmalında Osmanlı (1908- 1918)',
      konular: [
        '1908-1918 Siyasi ve Askerî Gelişmeler',
        '1908-1918 Göçler ve Salgınlar',
        'Osmanlı’nın İnsanlık Tarihine Katkıları',
      ],
    },
  ],
  '11-cografya': [
    {
      ad: 'Coğrafyanın Doğası',
      konular: [
        'Mekânsal Sorunlar Karşısında Coğrafya',
      ],
    },
    {
      ad: 'Mekânsal Bilgi Teknolojileri',
      konular: [
        'Web Tabanlı CBS Uygulamaları',
      ],
    },
    {
      ad: 'Doğal Sistemler ve Süreçler',
      konular: [
        'Su Kaynakları',
        'Türkiye’deki Su Kaynaklarının Etkileri',
      ],
    },
    {
      ad: 'Beşerî Sistemler ve Süreçler',
      konular: [
        'Yerleşmelerin Mekânsal Organizasyonu',
        'Yerleşmelerin Etki Alanları',
      ],
    },
    {
      ad: 'Ekonomik Faaliyetler ve Etkileri',
      konular: [
        'Tarımsal Faaliyetler ve Gıda Güvencesi',
        'Tarım Uygulamalarında Sürdürülebilirlik',
        'Stratejik ve Kritik Madenler',
        'Enerji Kaynakları',
        'Sanayileşmenin Mekânsal Etkileri',
      ],
    },
    {
      ad: 'Afetler ve Sürdürülebilir Çevre',
      konular: [
        'Gezegen Sınırı',
        'Küresel İklim Değişikliği',
        'Türkiye’de Suyun Sürdürülebilir Kullanımı',
      ],
    },
    {
      ad: 'Bölgeler, Ülkeler ve Küresel Bağlantılar',
      konular: [
        'Türkiye’nin Kültürel Hinterlandı',
        'Tarımsal Üretim: Örnek Ülke',
        'Sanayileşme Süreci: Örnek Ülkeler',
        'Madencilik Faaliyetleri: Örnek Ülke',
        'Enerji Kaynakları: Örnek Ülkeler',
      ],
    },
  ],
  '11-ingilizce': [
    {
      ad: 'Üniteler',
      konular: [
        'School Life & Education',
        'Classroom Life & Learning',
        'Personal Life & Well-Being',
        'Family Life & Home',
        'Life in the Neighbourhood, City & Social Life',
        'Life in the World & Culture',
        'Life in Nature & Global Problems',
        'Life in the Universe & Future',
      ],
    },
  ],
  '12-matematik': [
    {
      ad: 'Üstel ve Logaritmik Fonksiyonlar',
      konular: [
        'Üstel Fonksiyon',
        'Logaritma Fonksiyonu',
        'Üstel ve Logaritmik Denklem ve Eşitsizlikler',
      ],
    },
    {
      ad: 'Diziler',
      konular: [
        'Gerçek Sayı Dizileri',
        'Aritmetik Dizi',
        'Geometrik Dizi',
      ],
    },
    {
      ad: 'Trigonometri',
      konular: [
        'Toplam-Fark ve İki Kat Açı Formülleri',
        'Trigonometrik Denklemler',
      ],
    },
    {
      ad: 'Dönüşümler',
      konular: [
        'Analitik Düzlemde Temel Dönüşümler',
      ],
    },
    {
      ad: 'Türev',
      konular: [
        'Limit ve Süreklilik',
        'Anlık Değişim Oranı ve Türev',
        'Türevin Uygulamaları',
      ],
    },
    {
      ad: 'İntegral',
      konular: [
        'Belirsiz İntegral',
        'Belirli İntegral ve Uygulamaları',
      ],
    },
    {
      ad: 'Çemberin Analitik İncelenmesi',
      konular: [
        'Çemberin Analitik İncelenmesi',
      ],
    },
  ],
  '12-turkce': [
    {
      ad: 'Türk Dili ve Edebiyatına Giriş',
      konular: [
        'Dilin Değişimi ve Türkçe Sözlükler',
      ],
    },
    {
      ad: 'Hikâye',
      konular: [
        'Cumhuriyet Dönemi Hikâyesi (1923–1960)',
        '1960 Sonrası Hikâye',
      ],
    },
    {
      ad: 'Şiir',
      konular: [
        'Hececiler ve Millî Şiir Çizgisi',
        'Saf Şiir ve Bireysel Eğilimler',
        'Toplumcu Gerçekçi Şiir',
        'Garip Akımı',
        'İkinci Yeni',
        'Dinî Değerler ve Metafizik Şiir',
        '1960 ve 1980 Sonrası Şiir',
        'Cumhuriyet Dönemi Halk Şiiri',
      ],
    },
    {
      ad: 'Roman',
      konular: [
        'Cumhuriyet Dönemi Romanı (1923–1950)',
        'Köy ve Toplumcu Gerçekçi Roman',
        'Bireysel ve Modernist Roman',
        '1980 Sonrası Roman ve Postmodernizm',
        'Türk Dünyası ve Dünya Romanı',
      ],
    },
    {
      ad: 'Tiyatro',
      konular: [
        'Cumhuriyet Dönemi Tiyatrosu ve Kurumları',
        'Epik ve Absürt Tiyatro',
      ],
    },
    {
      ad: 'Deneme',
      konular: [
        'Deneme: Dünyada ve Türkçede',
      ],
    },
    {
      ad: 'Söylev',
      konular: [
        'Söylev (Nutuk)',
      ],
    },
  ],
  '12-fizik': [
    {
      ad: 'Çembersel Hareket',
      konular: [
        'Düzgün Çembersel Hareket',
        'Dönerek Öteleme Hareketi',
        'Açısal Momentum',
        'Kütle Çekim Kuvveti',
        'Kepler Kanunları',
      ],
    },
    {
      ad: 'Basit Harmonik Hareket',
      konular: [
        'Basit Harmonik Hareket',
      ],
    },
    {
      ad: 'Dalga Mekaniği',
      konular: [
        'Su Dalgalarında Kırınım ve Girişim',
        'Işıkta Girişim ve Kırınım',
        'Doppler Olayı',
        'Elektromanyetik Dalgalar',
      ],
    },
    {
      ad: 'Atom Fiziğine Giriş ve Radyoaktivite',
      konular: [
        'Atom Kavramının Tarihsel Gelişimi',
        'Atomun Uyarılma Yolları',
        'Büyük Patlama ve Evrenin Oluşumu',
        'Radyoaktivite',
        'Fisyon, Füzyon ve Radyasyon',
      ],
    },
    {
      ad: 'Modern Fizik',
      konular: [
        'Özel Görelilik',
        'Kuantum Fiziğine Giriş',
        'Fotoelektrik Olayı',
        'Compton Saçılması ve de Broglie Dalga Boyu',
      ],
    },
    {
      ad: 'Modern Fiziğin Teknolojideki Uygulamaları',
      konular: [
        'Görüntüleme Teknolojileri',
        'Yarı İletken Teknolojisi',
        'Süper İletkenler',
        'Nanoteknoloji',
        'LASER Işınları',
      ],
    },
  ],
  '12-kimya': [
    {
      ad: 'Kimya ve Elektrik',
      konular: [
        'İndirgenme-Yükseltgenme Tepkimeleri',
        'Elektrotlar ve Elektrokimyasal Hücreler',
        'Standart Elektrot Potansiyelleri',
        'Galvanik Piller',
        'Elektroliz',
        'Korozyon ve Korunma',
      ],
    },
    {
      ad: 'Karbon Kimyasına Giriş',
      konular: [
        'Anorganik ve Organik Bileşikler',
        'Basit ve Molekül Formülü',
        'Doğada Karbon',
        'Hibritleşme ve Molekül Geometrisi',
      ],
    },
    {
      ad: 'Organik Bileşikler',
      konular: [
        'Alkanlar',
        'Alkenler',
        'Alkinler',
        'Aromatik Hidrokarbonlar',
        'Fonksiyonel Gruplar',
        'Alkoller ve Eterler',
        'Aldehitler ve Ketonlar',
        'Karboksilik Asitler',
        'Esterler',
      ],
    },
    {
      ad: 'Enerji Kaynakları ve Bilimsel Gelişmeler',
      konular: [
        'Fosil Yakıtlar',
        'Alternatif Enerji Kaynakları',
      ],
    },
  ],
  '12-biyoloji': [
    {
      ad: 'Genden Proteine',
      konular: [
        'Nükleik Asitlerin Keşfi',
        'DNA ve RNA’nın Yapısı',
        'Genetik Materyalin Organizasyonu',
        'DNA’nın Kendini Eşlemesi',
        'Genetik Şifre ve Transkripsiyon',
        'Translasyon: Proteinin Kurulması',
        'Genetik Mühendisliği ve Biyoteknoloji',
        'Biyoteknoloji Uygulamaları ve Etkileri',
      ],
    },
    {
      ad: 'Canlılarda Enerji Dönüşümleri',
      konular: [
        'Canlılık ve Enerji (ATP)',
        'Fotosentez',
        'Kemosentez',
        'Hücresel Solunum ve Fermantasyon',
      ],
    },
    {
      ad: 'Bitki Biyolojisi',
      konular: [
        'Bitki Dokuları',
        'Kök, Gövde ve Yaprak',
        'Köklerde Su ve Mineral Emilimi',
        'Su ve Minerallerin Taşınması',
        'Fotosentez Ürünlerinin Taşınması',
        'Çiçeğin Yapısı',
        'Döllenme, Tohum ve Meyve',
        'Tohum Çimlenmesi ve Dormansi',
      ],
    },
    {
      ad: 'Canlılar ve Çevre',
      konular: [
        'Çevre Şartları ve Genetik Değişim',
        'Tarım ve Hayvancılıkta Yapay Seçilim',
      ],
    },
  ],
  '12-tarih': [
    {
      ad: '20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya',
      konular: [
        'Mustafa Kemal’in Hayatı (1881-1918)',
        'Trablusgarp ve Balkan Savaşları',
        'I. Dünya Savaşı',
      ],
    },
    {
      ad: 'Millî Mücadele',
      konular: [
        'Mondros Ateşkesi ve İşgaller',
        'Millî Mücadele’nin Hazırlık Dönemi',
        'TBMM’nin Açılışı ve İç Ayaklanmalar',
        'Doğu ve Güney Cepheleri',
        'Batı Cephesi ve Büyük Taarruz',
        'Diplomatik Başarılar ve Lozan',
      ],
    },
    {
      ad: 'Atatürkçülük ve Türk İnkılabı',
      konular: [
        'Atatürk İlkeleri',
        'Siyasi Alandaki İnkılaplar',
        'Hukuk Alanındaki İnkılaplar',
        'Eğitim ve Kültür Alanındaki İnkılaplar',
        'Toplumsal Alandaki İnkılaplar ve Sağlık',
        'Ekonomik Alandaki Gelişmeler',
      ],
    },
    {
      ad: 'İki Savaş Arasındaki Dönemde Türkiye ve Dünya',
      konular: [
        'Atatürk Dönemi İç Politika (1923-1938)',
        'Atatürk Dönemi Türk Dış Politikası',
        'İki Savaş Arasında Dünya',
      ],
    },
    {
      ad: 'II. Dünya Savaşı Sürecinde Türkiye ve Dünya',
      konular: [
        'II. Dünya Savaşı’nın Nedenleri ve Seyri',
        'II. Dünya Savaşı’nda Türkiye',
        'II. Dünya Savaşı’nın Sonuçları',
      ],
    },
    {
      ad: 'II. Dünya Savaşı Sonrasında Türkiye ve Dünya',
      konular: [
        'Blokların Kuruluşu ve Soğuk Savaş',
        'Orta Doğu, Uzak Doğu ve Sömürgelerin Çözülmesi',
        'Türkiye: 1945-1960',
      ],
    },
    {
      ad: 'Toplumsal Devrim Çağında Dünya ve Türkiye',
      konular: [
        'Yumuşama Dönemi',
        'Arap-İsrail Savaşları, Petrol ve İran-Irak Savaşı',
        'Türkiye: 1960-1980',
      ],
    },
    {
      ad: 'XXI. Yüzyılın Eşiğinde Türkiye ve Dünya',
      konular: [
        'SSCB’nin Dağılması ve Yeni Devletler',
        'Asya’da Yeni Yapılanma ve Küreselleşme',
        'Balkanlar ve Orta Doğu’da Yeni Dönem',
        'Türkiye ve Avrupa Birliği',
        'Türkiye: 1980 Sonrası',
      ],
    },
  ],
  '12-cografya': [
    {
      ad: 'Doğal Sistemler',
      konular: [
        'Ekstrem Doğa Olayları ve Etkileri',
        'Doğal Sistemlerdeki Değişimler ve Gelecek',
      ],
    },
    {
      ad: 'Beşerî Sistemler',
      konular: [
        'Baskın Ekonomik Faaliyet ve Yaşam',
        'Şehirleşme, Göç ve Sanayileşme',
        'Nüfus ve Ekonomide Gelecek Değişimler',
        'İşlevsel Bölgeler',
        'Bölgesel Kalkınma Projeleri',
        'Hizmet Sektörü ve Kalkınma',
        'Ulaşım Sistemi, Ağlar ve Yerleşme',
        'Türkiye’de Ulaşım Sisteminin Gelişimi',
        'Dünya Ticaret Merkezleri ve Ağları',
        'Türkiye’de Ticaret Merkezleri ve Dış Ticaret',
        'Tarihî Ticaret Yolları ve Türkiye’nin Konumu',
        'Doğal-Kültürel Semboller ve Turizm Potansiyeli',
        'Turizm Politikaları ve Ekonomideki Yeri',
      ],
    },
    {
      ad: 'Küresel Ortam',
      konular: [
        'Bölgeler ve Ülkeler: Kıta ve Okyanusların Değişen Önemi',
        'Ülkelerin Konumunun Bölgesel ve Küresel Etkisi',
        'Türkiye’nin Tarihsel Jeopolitik Konumu',
        'Türkiye ve Yakın Jeopolitik Bölgeler',
        'Türk Kültür Bölgeleri ve Türkiye',
        'Teknoloji ve Küresel Etkileşim',
        'Gelişmişlik Düzeyi ve Ülke Grupları',
        'Doğal Kaynaklar ve Ülkeler Arası İlişkiler',
        'Enerji Nakil Hatları ve Etkileri',
        'Çatışma Alanları ve Mekânsal Unsurlar',
      ],
    },
    {
      ad: 'Çevre ve Toplum',
      konular: [
        'Doğal Çevrenin Sınırlılığı',
        'Ülkelerin Çevre Politikaları',
        'Çevre Örgütleri ve Uluslararası Anlaşmalar',
        'Ortak Doğal ve Kültürel Mirasa Tehditler',
      ],
    },
  ],
  '12-ingilizce': [
    {
      ad: 'Üniteler',
      konular: [
        'Music',
        'Friendship',
        'Human Rights',
        'Coming Soon',
        'Psychology',
        'Favors',
        'News Stories',
        'Alternative Energy',
        'Technology',
        'Manners',
      ],
    },
  ],
  '9-ingilizce': [
    {
      ad: 'Üniteler',
      konular: [
        'School Life',
        'Classroom Life',
        'Personal Life: Physical Appearance & Personality',
        'Family Life',
        'Life in the House & Neighbourhood',
        'Life in the City & Country',
        'Life in the World & Nature',
        'Life in the Universe & Future',
      ],
    },
  ],
  '10-ingilizce': [
    {
      ad: 'Üniteler',
      konular: [
        'School Life & Education',
        'Classroom Life & Learning',
        'Personal Life & Well-Being',
        'Family Life & Home',
        'Life in the Neighbourhood, City & Social Life',
        'Life in the World & Culture',
        'Life in Nature & Global Problems',
        'Life in the Universe & the Future',
      ],
    },
  ],
}
