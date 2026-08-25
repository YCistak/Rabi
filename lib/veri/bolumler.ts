/**
 * Lisans bölümleri — hedef seçiminin sağ yarısı.
 *
 * ## Neden sıralama tutuluyor da taban puan tutulmuyor
 *
 * Her satırda **başarı sırası** var, taban puan yok. Taban puan `puan.ts`
 * içindeki gerçek ÖSYM yerleştirme dağılımından türetiliyor
 * (`siralamadanPuan`). Sebep: sıralama yıldan yıla neredeyse aynı kalıyor,
 * puan ise sınavın zorluğuyla birlikte oynuyor — 2024'te 480 olan bir bölüm
 * 2026'da 465 olabiliyor, ama sırası hâlâ aynı yerde duruyor. Sırayı elle
 * yazıp puanı hesaplattığımızda tahminin bayat kısmı en yavaş bayatlayan
 * sayıya iniyor ve puan her yıl kendiliğinden güncelleniyor.
 *
 * ## İki uç, arası iç değer
 *
 * Her bölüm için iki sayı yazılıyor: 1. kademedeki üniversitede sıra
 * (`ustSira`) ve bölümü açan en düşük kademede sıra (`altSira`). Aradaki
 * kademeler geometrik iç değerle bulunuyor (bkz. `hedef-katalog.ts`).
 * 200 × 78 satırlık gerçek tabloyu elle yazmak yerine iki uç yazılıyor:
 * o tablo hem uygulamayı şişirirdi hem her ağustos elde güncellenirdi.
 *
 * ## `sonKademe`
 *
 * Bölümü açan en düşük kademe. Havacılık ve Uzay Mühendisliği'ni açan bir
 * taşra üniversitesi yok; `sonKademe` o bölümleri alt kademelerde listeden
 * düşürüyor. Fakülte grubu (`alan`) da ayrıca süzüyor — ikisi farklı soru:
 * "bu üniversitenin tıp fakültesi var mı" ile "bu bölüm bu kademede açılıyor
 * mu" aynı şey değil.
 */

import type { PuanTuru } from '../types'
import type { AlanKodu } from './universiteler'

export type Bolum = {
  id: string
  ad: string
  puanTuru: PuanTuru
  /** Bölümün bağlı olduğu fakülte grubu. */
  alan: AlanKodu
  /** Öğrenim süresi (yıl) — listede bölümün yanında yazıyor. */
  sure: number
  /** 1. kademede tahmini başarı sırası. */
  ustSira: number
  /** `sonKademe`de tahmini başarı sırası. */
  altSira: number
  /** Bölümü açan en düşük kademe. */
  sonKademe: number
}

type Satir = [string, string, PuanTuru, AlanKodu, number, number, number, number]

const SATIRLAR: readonly Satir[] = [
  // --- Sayısal ---
  ['tip', 'Tıp', 'say', 'tip', 6, 400, 60000, 5],
  ['dis-hekimligi', 'Diş Hekimliği', 'say', 'dis', 5, 3000, 110000, 5],
  ['eczacilik', 'Eczacılık', 'say', 'ecz', 5, 12000, 180000, 5],
  ['veteriner', 'Veteriner Hekimliği', 'say', 'vet', 5, 60000, 330000, 5],
  ['bilgisayar-muh', 'Bilgisayar Mühendisliği', 'say', 'muh', 4, 900, 300000, 5],
  ['yazilim-muh', 'Yazılım Mühendisliği', 'say', 'muh', 4, 2500, 320000, 5],
  ['yapay-zeka-muh', 'Yapay Zekâ Mühendisliği', 'say', 'muh', 4, 3000, 200000, 4],
  ['elektrik-muh', 'Elektrik-Elektronik Mühendisliği', 'say', 'muh', 4, 1800, 380000, 5],
  ['endustri-muh', 'Endüstri Mühendisliği', 'say', 'muh', 4, 2200, 400000, 5],
  ['havacilik-muh', 'Havacılık ve Uzay Mühendisliği', 'say', 'muh', 4, 3500, 200000, 4],
  ['makine-muh', 'Makine Mühendisliği', 'say', 'muh', 4, 6000, 450000, 5],
  ['insaat-muh', 'İnşaat Mühendisliği', 'say', 'muh', 4, 20000, 520000, 5],
  ['metalurji-muh', 'Metalurji ve Malzeme Mühendisliği', 'say', 'muh', 4, 20000, 450000, 5],
  ['biyomedikal-muh', 'Biyomedikal Mühendisliği', 'say', 'muh', 4, 22000, 420000, 5],
  ['kimya-muh', 'Kimya Mühendisliği', 'say', 'muh', 4, 28000, 480000, 5],
  ['harita-muh', 'Harita Mühendisliği', 'say', 'muh', 4, 45000, 520000, 5],
  ['cevre-muh', 'Çevre Mühendisliği', 'say', 'muh', 4, 60000, 620000, 5],
  ['gida-muh', 'Gıda Mühendisliği', 'say', 'muh', 4, 110000, 600000, 5],
  ['mimarlik', 'Mimarlık', 'say', 'mim', 4, 12000, 480000, 5],
  ['sehir-planlama', 'Şehir ve Bölge Planlama', 'say', 'mim', 4, 40000, 480000, 5],
  ['ic-mimarlik', 'İç Mimarlık', 'say', 'mim', 4, 45000, 500000, 5],
  ['mbg', 'Moleküler Biyoloji ve Genetik', 'say', 'fen', 4, 18000, 400000, 5],
  ['matematik', 'Matematik', 'say', 'fen', 4, 30000, 550000, 5],
  ['istatistik', 'İstatistik', 'say', 'fen', 4, 45000, 560000, 5],
  ['fizik', 'Fizik', 'say', 'fen', 4, 60000, 620000, 5],
  ['kimya', 'Kimya', 'say', 'fen', 4, 70000, 650000, 5],
  ['biyoloji', 'Biyoloji', 'say', 'fen', 4, 80000, 650000, 5],
  ['fizyoterapi', 'Fizyoterapi ve Rehabilitasyon', 'say', 'sag', 4, 30000, 330000, 5],
  ['dil-konusma', 'Dil ve Konuşma Terapisi', 'say', 'sag', 4, 35000, 300000, 5],
  ['beslenme', 'Beslenme ve Diyetetik', 'say', 'sag', 4, 45000, 350000, 5],
  ['odyoloji', 'Odyoloji', 'say', 'sag', 4, 55000, 380000, 5],
  ['hemsirelik', 'Hemşirelik', 'say', 'sag', 4, 90000, 480000, 5],
  ['ebelik', 'Ebelik', 'say', 'sag', 4, 160000, 560000, 5],
  ['matematik-ogr', 'Matematik Öğretmenliği', 'say', 'egt', 4, 25000, 180000, 5],
  ['fen-bilgisi-ogr', 'Fen Bilgisi Öğretmenliği', 'say', 'egt', 4, 60000, 300000, 5],

  // --- Eşit ağırlık ---
  ['hukuk', 'Hukuk', 'ea', 'huk', 4, 700, 160000, 5],
  ['psikoloji', 'Psikoloji', 'ea', 'sos', 4, 4000, 260000, 5],
  ['uluslararasi-iliskiler', 'Uluslararası İlişkiler', 'ea', 'sos', 4, 12000, 500000, 5],
  ['pdr', 'Rehberlik ve Psikolojik Danışmanlık', 'ea', 'egt', 4, 15000, 220000, 5],
  ['siyaset-kamu', 'Siyaset Bilimi ve Kamu Yönetimi', 'ea', 'sos', 4, 20000, 550000, 5],
  ['iktisat', 'İktisat', 'ea', 'sos', 4, 22000, 620000, 5],
  ['isletme', 'İşletme', 'ea', 'sos', 4, 25000, 620000, 5],
  ['ekonometri', 'Ekonometri', 'ea', 'sos', 4, 55000, 600000, 5],
  ['ozel-egitim-ogr', 'Özel Eğitim Öğretmenliği', 'ea', 'egt', 4, 55000, 300000, 5],
  ['maliye', 'Maliye', 'ea', 'sos', 4, 60000, 620000, 5],
  ['uluslararasi-ticaret', 'Uluslararası Ticaret ve Lojistik', 'ea', 'sos', 4, 60000, 620000, 5],
  ['sosyal-hizmet', 'Sosyal Hizmet', 'ea', 'sos', 4, 60000, 520000, 5],
  ['sinif-ogr', 'Sınıf Öğretmenliği', 'ea', 'egt', 4, 60000, 320000, 5],
  ['okul-oncesi-ogr', 'Okul Öncesi Öğretmenliği', 'ea', 'egt', 4, 90000, 400000, 5],
  ['calisma-ekonomisi', 'Çalışma Ekonomisi ve Endüstri İlişkileri', 'ea', 'sos', 4, 90000, 640000, 5],

  // --- Sözel ---
  ['sosyoloji', 'Sosyoloji', 'soz', 'sos', 4, 7000, 260000, 5],
  ['tde-ogr', 'Türk Dili ve Edebiyatı Öğretmenliği', 'soz', 'egt', 4, 8000, 90000, 5],
  ['tde', 'Türk Dili ve Edebiyatı', 'soz', 'sos', 4, 9000, 260000, 5],
  ['tarih-ogr', 'Tarih Öğretmenliği', 'soz', 'egt', 4, 9000, 90000, 5],
  ['turkce-ogr', 'Türkçe Öğretmenliği', 'soz', 'egt', 4, 9000, 120000, 5],
  ['tarih', 'Tarih', 'soz', 'sos', 4, 12000, 300000, 5],
  ['sosyal-bilgiler-ogr', 'Sosyal Bilgiler Öğretmenliği', 'soz', 'egt', 4, 13000, 140000, 5],
  ['felsefe', 'Felsefe', 'soz', 'sos', 4, 14000, 300000, 5],
  ['rtsinema', 'Radyo, Televizyon ve Sinema', 'soz', 'iln', 4, 15000, 320000, 5],
  ['din-kulturu-ogr', 'Din Kültürü ve Ahlak Bilgisi Öğretmenliği', 'soz', 'ilh', 4, 20000, 180000, 5],
  ['yeni-medya', 'Yeni Medya ve İletişim', 'soz', 'iln', 4, 20000, 330000, 5],
  ['halkla-iliskiler', 'Halkla İlişkiler ve Tanıtım', 'soz', 'iln', 4, 22000, 330000, 5],
  ['ilahiyat', 'İlahiyat', 'soz', 'ilh', 4, 22000, 300000, 5],
  ['gazetecilik', 'Gazetecilik', 'soz', 'iln', 4, 25000, 330000, 5],
  ['reklamcilik', 'Reklamcılık', 'soz', 'iln', 4, 25000, 330000, 5],
  ['arkeoloji', 'Arkeoloji', 'soz', 'sos', 4, 30000, 330000, 5],
  ['cografya', 'Coğrafya', 'soz', 'sos', 4, 35000, 330000, 5],
  ['sanat-tarihi', 'Sanat Tarihi', 'soz', 'sos', 4, 45000, 340000, 5],

  // --- Dil ---
  ['ingiliz-dili', 'İngiliz Dili ve Edebiyatı', 'dil', 'dil', 4, 900, 45000, 5],
  ['ceviribilim', 'Çeviribilim', 'dil', 'dil', 4, 1000, 30000, 4],
  ['mutercim-ingilizce', 'Mütercim-Tercümanlık (İngilizce)', 'dil', 'dil', 4, 1100, 40000, 5],
  ['ingilizce-ogr', 'İngilizce Öğretmenliği', 'dil', 'egt', 4, 1200, 25000, 5],
  ['amerikan-kultur', 'Amerikan Kültürü ve Edebiyatı', 'dil', 'dil', 4, 1500, 20000, 4],
  ['alman-dili', 'Alman Dili ve Edebiyatı', 'dil', 'dil', 4, 4000, 60000, 5],
  ['almanca-ogr', 'Almanca Öğretmenliği', 'dil', 'egt', 4, 4000, 40000, 5],
  ['fransiz-dili', 'Fransız Dili ve Edebiyatı', 'dil', 'dil', 4, 5000, 60000, 5],
  ['rus-dili', 'Rus Dili ve Edebiyatı', 'dil', 'dil', 4, 6000, 60000, 5],
]

export const BOLUMLER: readonly Bolum[] = SATIRLAR.map(
  ([id, ad, puanTuru, alan, sure, ustSira, altSira, sonKademe]) => ({
    id,
    ad,
    puanTuru,
    alan,
    sure,
    ustSira,
    altSira,
    sonKademe,
  }),
)
