/**
 * Zaman Şeridi oyununun olay havuzu.
 *
 * Antlaşma ve Kavram oyunları "bu madde hangi belgeden", "bu kavram ne demek"
 * diye soruyor; ikisi de tek tek bilgiyi ölçüyor. Kronoloji ise bilginin
 * **aralarındaki** ilişkisi: Erzurum Kongresi'nin ne olduğunu bilmek başka,
 * Sivas'tan önce mi sonra mı olduğunu bilmek başka. ÖSYM'nin "aşağıdakilerden
 * hangisi daha önce gerçekleşmiştir" kalıbı tam bunu soruyor ve mevcut iki
 * tarih oyunu bu beceriye hiç dokunmuyordu.
 *
 * Yıl **sıralama için** var, ekranda sorulmuyor: oyun "kaç yılında" değil
 * "hangisi önce" diye soruyor. Yine de cevaptan sonra gösteriliyor — asıl
 * öğrenme orada.
 *
 * Aynı yıla düşen iki olay havuza **alınmadı**: ikisi bir soruda karşılaşırsa
 * hangisinin önce geldiğinin tek doğru cevabı olmazdı. Aylara inip
 * "Erzurum Temmuz, Sivas Eylül" demek mümkündü ama o zaman oyun ay ezberine
 * dönerdi; onun yerine aynı yıl içindeki olaylardan yalnızca biri alındı.
 */

import type { Zorluk } from './ritim'

/**
 * Olayın ait olduğu dönem.
 *
 * `antlasma-havuzu.ts`'teki `TarihDonemi`'nden ayrı duruyor: orada dönemler
 * antlaşma metinlerine göre bölünmüş (belgeler/inkılap ayrı), burada ölçü
 * kronolojik yakınlık. Aynı tipi paylaşsalardı bir oyunun dönem düzenlemesi
 * ötekinin sorularını bozardı.
 */
export type SiraDonemi =
  | 'ilkturk'
  | 'selcuklu'
  | 'kurulus'
  | 'yukselme'
  | 'duraklama'
  | 'dagilma'
  | 'kurtulus'
  | 'inkilap'
  | 'cumhuriyet'
  | 'dunya'

export type SiraliOlay = {
  /** Kartta yazan metin. Kısa tutuldu: beş kart tek ekrana sığmalı. */
  olay: string
  /** Sıralama ölçüsü. Ekranda yalnızca cevaptan sonra görünüyor. */
  yil: number
  donem: SiraDonemi
  zorluk: Zorluk
}

export const SIRA_DONEM_ADI: Record<SiraDonemi, string> = {
  ilkturk: 'İslamiyet öncesi Türk tarihi',
  selcuklu: 'İlk Türk-İslam devletleri',
  kurulus: 'Osmanlı Kuruluş dönemi',
  yukselme: 'Osmanlı Yükselme dönemi',
  duraklama: 'Duraklama ve Gerileme',
  dagilma: 'Dağılma dönemi',
  kurtulus: 'Millî Mücadele',
  inkilap: 'İnkılaplar',
  cumhuriyet: 'Cumhuriyet dönemi',
  dunya: 'Yakın Çağ dünya tarihi',
}

/** `[olay, yıl]` çiftlerini bir döneme ve zorluğa bağlar. */
function donem(
  donem: SiraDonemi,
  zorluk: Zorluk,
  olaylar: readonly (readonly [string, number])[],
): SiraliOlay[] {
  return olaylar.map(([olay, yil]) => ({ olay, yil, donem, zorluk }))
}

/**
 * Havuz.
 *
 * Zorluk **döneme** ait, tek tek olaylara değil — `antlasma-havuzu.ts`'teki
 * gerekçenin aynısı: soru bir dönemden beş olay istiyor ve zorluk olay bazında
 * dağılsaydı "kolay" seçildiğinde hiçbir dönem beş olay çıkaramazdı.
 *
 * Millî Mücadele kolayda: her öğrencinin en çok duyduğu dönem. Klasik dönem
 * Osmanlı ile İslamiyet öncesi zorda: olaylar birbirine yakın ve adları
 * çağrışım vermiyor.
 */
export const SIRALA_HAVUZU: SiraliOlay[] = [
  ...donem('kurtulus', 'kolay', [
    ['Mondros Ateşkes Antlaşması imzalandı', 1918],
    ['Amasya Genelgesi yayımlandı', 1919],
    ['TBMM açıldı', 1920],
    ['Sakarya Meydan Muharebesi kazanıldı', 1921],
    ['Büyük Taarruz ile İzmir’e girildi', 1922],
    ['Lozan Antlaşması imzalandı', 1923],
  ]),

  ...donem('inkilap', 'kolay', [
    ['Saltanat kaldırıldı', 1922],
    ['Halifelik kaldırıldı, Tevhid-i Tedrisat kabul edildi', 1924],
    ['Şapka Kanunu çıkarıldı, tekkeler kapatıldı', 1925],
    ['Türk Medeni Kanunu kabul edildi', 1926],
    ['Harf İnkılabı yapıldı', 1928],
    ['Kadınlara milletvekili seçme ve seçilme hakkı verildi', 1934],
  ]),

  ...donem('cumhuriyet', 'orta', [
    ['Cumhuriyet ilan edildi', 1923],
    ['Terakkiperver Cumhuriyet Fırkası kuruldu', 1924],
    ['Serbest Cumhuriyet Fırkası kuruldu', 1930],
    ['Türkiye Milletler Cemiyeti’ne üye oldu', 1932],
    ['Montrö Boğazlar Sözleşmesi imzalandı', 1936],
    ['Hatay Türkiye’ye katıldı', 1939],
  ]),

  ...donem('yukselme', 'orta', [
    ['İstanbul fethedildi', 1453],
    ['Otlukbeli Savaşı kazanıldı', 1473],
    ['Çaldıran Savaşı kazanıldı', 1514],
    ['Mercidabık ve Ridaniye ile Mısır alındı', 1517],
    ['Mohaç Meydan Muharebesi kazanıldı', 1526],
    ['Preveze Deniz Zaferi kazanıldı', 1538],
  ]),

  ...donem('dagilma', 'orta', [
    ['Tanzimat Fermanı ilan edildi', 1839],
    ['Islahat Fermanı ilan edildi', 1856],
    ['I. Meşrutiyet ilan edildi', 1876],
    ['II. Meşrutiyet ilan edildi', 1908],
    ['Trablusgarp Savaşı başladı', 1911],
    ['Balkan Savaşları başladı', 1912],
  ]),

  ...donem('dunya', 'orta', [
    ['Fransız İhtilali başladı', 1789],
    ['Sanayi İnkılabı İngiltere’de yayıldı', 1830],
    ['I. Dünya Savaşı başladı', 1914],
    ['Rusya’da Bolşevik İhtilali oldu', 1917],
    ['1929 Dünya Ekonomik Buhranı patlak verdi', 1929],
    ['II. Dünya Savaşı başladı', 1939],
  ]),

  ...donem('kurulus', 'zor', [
    ['Osmanlı Devleti kuruldu', 1299],
    ['Koyunhisar Savaşı kazanıldı', 1302],
    ['Bursa başkent yapıldı', 1326],
    ['Rumeli’ye ilk geçiş (Çimpe Kalesi) gerçekleşti', 1353],
    ['I. Kosova Savaşı kazanıldı', 1389],
    ['Ankara Savaşı ile Fetret Devri başladı', 1402],
  ]),

  ...donem('duraklama', 'zor', [
    ['Zitvatorok Antlaşması imzalandı', 1606],
    ['Vasvar Antlaşması imzalandı', 1664],
    ['II. Viyana Kuşatması başarısız oldu', 1683],
    ['Karlofça Antlaşması imzalandı', 1699],
    ['Pasarofça Antlaşması ile Lale Devri başladı', 1718],
    ['Küçük Kaynarca Antlaşması imzalandı', 1774],
  ]),

  ...donem('selcuklu', 'zor', [
    ['Talas Savaşı yapıldı', 751],
    ['Karahanlı Devleti kuruldu', 840],
    ['Gazneli Devleti kuruldu', 963],
    ['Dandanakan Savaşı ile Büyük Selçuklu kuruldu', 1040],
    ['Malazgirt Savaşı kazanıldı', 1071],
    ['Miryokefalon Savaşı kazanıldı', 1176],
  ]),

  ...donem('ilkturk', 'zor', [
    ['Büyük Hun Devleti’nin bilinen ilk hükümdarı Teoman tahta çıktı', -220],
    ['Mete Han tahta çıktı', -209],
    ['I. Kök Türk Devleti kuruldu', 552],
    ['II. Kök Türk (Kutluk) Devleti kuruldu', 682],
    ['Orhun Yazıtları dikildi', 732],
    ['Uygur Devleti kuruldu', 744],
  ]),
]

/** Havuzdaki olay sayısı — tanıtım ekranı bunu yazıyor. */
export const SIRALA_BOYUTU = SIRALA_HAVUZU.length
