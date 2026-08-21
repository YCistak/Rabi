import type { EsyaKategorisi } from '@/lib/magaza/esyalar'

/**
 * Boydan tavşanın anatomisi.
 *
 * Eşya çizimleri bu sayılara göre yerleşiyor: bir şapkanın nereye oturacağı
 * ya da bir pantolonun nereden başlayacağı, gövdeyi çizen dosyayla aynı
 * kaynağı okumalı. Sayılar dağınık dursaydı yeni eşya eklemek her seferinde
 * "gövde tam olarak nerede bitiyordu" arayışına dönerdi.
 *
 * Tuval 200×340: dikey, tek tavşan. Ölçüler SVG birimi, piksel değil —
 * bileşen `boyut` propuyla ölçekleniyor.
 */
export const TUVAL = { genislik: 200, yukseklik: 340 } as const

export const ANATOMI = {
  /** Baş elipsi. Üst noktası y = 120 − 44 = 76; şapkalar oraya oturuyor. */
  bas: { x: 100, y: 120, rx: 50, ry: 44 },
  /**
   * Kulaklar dışa yatık.
   *
   * Dik dursalardı başın tepesi kulaklarla dolar, şapkaların çoğu kulakları
   * keserdi. Yirmi derece yatınca tepe boşalıyor ve şapka kulakların arasına
   * oturuyor — tavşan çizimlerinin bu sorunu çözme biçimi de bu.
   */
  kulak: { solX: 72, sagX: 128, y: 50, rx: 12, ry: 40, egim: 20 },
  /** Gövde: omuzdan kalçaya kadar tek yuvarlatılmış dikdörtgen. */
  govde: { sol: 66, sag: 134, ust: 158, alt: 252, yuvarlak: 30 },
  /** Kollar gövdenin iki yanında, omuzdan bileğe. */
  kol: { solX: 58, sagX: 142, ust: 172, alt: 238, kalinlik: 17 },
  /** Bacaklar. Ayakkabılar `ayak` noktasından başlıyor. */
  bacak: { solX: 87, sagX: 113, ust: 244, alt: 300, kalinlik: 18 },
  ayak: { y: 302, solX: 82, sagX: 118, rx: 17, ry: 11 },
  /** Yüz noktaları — gözlükler göz hizasını buradan okuyor. */
  goz: { solX: 82, sagX: 118, y: 118, rx: 7, ry: 8.5 },
  burun: { x: 100, y: 134 },
} as const

/**
 * Mağaza kutucuklarında eşyanın gösterildiği kadraj.
 *
 * Kutucuklar tavşanın tamamını çizip küçültseydi bir gözlük birkaç piksel
 * kalırdı. Onun yerine aynı çizim, kategorinin durduğu bölgeye kırpılıyor:
 * eşya kutucukta da gövdedeki hâliyle görünüyor, ayrı bir "vitrin çizimi"
 * yapmaya gerek kalmıyor.
 */
export const KADRAJ: Record<EsyaKategorisi, string> = {
  /* Kulaklığın kupaları ve kahraman maskesi göz hizasına iniyor; kadraj başın
     tepesiyle bitseydi ikisi de kutucukta kesilirdi. */
  sapka: '36 10 128 136',
  /* Deney ve yüzücü gözlüğünün bantları şakaklardan taşıyor, şaka gözlüğünün
     bıyığı çeneye iniyor. */
  gozluk: '30 92 140 72',
  ust: '42 148 116 116',
  /* Bahçıvan tulumunun göğüslüğü belden yukarıda başlıyor. */
  alt: '54 172 92 148',
  /* Paletin ucu ve çizmelerin konçu tabanın epey dışına çıkıyor. */
  ayakkabi: '50 270 100 64',
  /* Kürkte baş yetiyor: desenlerin hepsinin başta da bir izi var (robotun
     dikişi, benekli benekleri, altının parıltısı) ve renk zaten asıl mesele. */
  kurk: '44 22 112 152',
  sirt: '14 138 172 136',
}
