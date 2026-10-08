import type { OsymTest, PuanTuru, Sablon } from './types'

/**
 * ÖSYM test bloklarının gerçek soru sayıları (2026 YKS).
 * Kaynak: ÖSYM YKS kılavuzu — TYT 120, AYT 160 (4 test × 40), YDT 80.
 *
 * Puan hesabı bu sayıları kullanır: seviye tespit sınavı gibi kısaltılmış bir sınavın neti
 * gerçek sınav ölçeğine oranlanır (bkz. `lib/puan.ts`).
 */
export const OSYM_TEST_SORU: Record<OsymTest, number> = {
  'tyt-turkce': 40,
  'tyt-sosyal': 20,
  'tyt-mat': 40,
  'tyt-fen': 20,
  'ayt-mat': 40,
  'ayt-fizik': 14,
  'ayt-kimya': 13,
  'ayt-biyoloji': 13,
  'ayt-edebiyat': 24,
  'ayt-tarih1': 10,
  'ayt-cografya1': 6,
  'ayt-tarih2': 11,
  'ayt-cografya2': 11,
  'ayt-felsefe': 12,
  'ayt-din': 6,
  ydt: 80,
}

export const OSYM_TEST_ADI: Record<OsymTest, string> = {
  'tyt-turkce': 'TYT Türkçe',
  'tyt-sosyal': 'TYT Sosyal Bilimler',
  'tyt-mat': 'TYT Temel Matematik',
  'tyt-fen': 'TYT Fen Bilimleri',
  'ayt-mat': 'AYT Matematik',
  'ayt-fizik': 'AYT Fizik',
  'ayt-kimya': 'AYT Kimya',
  'ayt-biyoloji': 'AYT Biyoloji',
  'ayt-edebiyat': 'AYT Türk Dili ve Edebiyatı',
  'ayt-tarih1': 'AYT Tarih-1',
  'ayt-cografya1': 'AYT Coğrafya-1',
  'ayt-tarih2': 'AYT Tarih-2',
  'ayt-cografya2': 'AYT Coğrafya-2',
  'ayt-felsefe': 'AYT Felsefe Grubu',
  'ayt-din': 'AYT Din Kültürü',
  ydt: 'Yabancı Dil Testi',
}

/**
 * Hazır şablonlar. Ders dağılımları 2026 YKS'nin resmî soru sayılarına göredir;
 * seviye tespit ise Asaf'ın okulunun uyguladığı 120 soruluk eşit ağırlık
 * formatı (TYT ile aynı soru sayısı ama tamamen farklı dağılım — karıştırılmamalı).
 * O biçim 9. sınıfın; 10, 11 ve 12'ninkiler aşağıda ondan ve AYT'den
 * türetiliyor (`SEVIYE_SABLONLARI`).
 *
 * Şablonun kimliği bilerek `okul` kaldı: kayıtlı denemeler `sablonId` ile buna
 * bağlı, kimlik değişseydi hepsi şablonsuz kalır ve net dökümleri kaybolurdu.
 *
 * Bu liste her açılışta koddan gelir — güncelleme yayınlandığında kullanıcının
 * kendi şablonlarına dokunmadan yenilenir (bkz. `sablonlariBirlestir`).
 */
const TEMEL_SABLONLAR: Sablon[] = [
  {
    id: 'okul',
    ad: 'Seviye Tespit · 9. sınıf',
    tur: 'okul',
    yanlisKatsayi: 4,
    hazir: true,
    seviye: { sinif: 9 },
    dersler: [
      { id: 'edebiyat', ad: 'Edebiyat', soruSayisi: 30, osymTesti: 'ayt-edebiyat' },
      { id: 'matematik', ad: 'Matematik', soruSayisi: 30, osymTesti: 'ayt-mat' },
      { id: 'tarih', ad: 'Tarih', soruSayisi: 12, osymTesti: 'ayt-tarih1' },
      { id: 'cografya', ad: 'Coğrafya', soruSayisi: 12, osymTesti: 'ayt-cografya1' },
      { id: 'fizik', ad: 'Fizik', soruSayisi: 10, osymTesti: 'ayt-fizik' },
      { id: 'kimya', ad: 'Kimya', soruSayisi: 10, osymTesti: 'ayt-kimya' },
      { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 10, osymTesti: 'ayt-biyoloji' },
      { id: 'din', ad: 'Din Kültürü', soruSayisi: 6, osymTesti: 'ayt-din' },
    ],
  },
  {
    id: 'tyt',
    ad: 'TYT',
    tur: 'tyt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'turkce', ad: 'Türkçe', soruSayisi: 40, osymTesti: 'tyt-turkce' },
      { id: 'tarih', ad: 'Tarih', soruSayisi: 5, osymTesti: 'tyt-sosyal' },
      { id: 'cografya', ad: 'Coğrafya', soruSayisi: 5, osymTesti: 'tyt-sosyal' },
      { id: 'felsefe', ad: 'Felsefe', soruSayisi: 5, osymTesti: 'tyt-sosyal' },
      { id: 'din', ad: 'Din Kültürü', soruSayisi: 5, osymTesti: 'tyt-sosyal' },
      { id: 'matematik', ad: 'Temel Matematik', soruSayisi: 40, osymTesti: 'tyt-mat' },
      { id: 'fizik', ad: 'Fizik', soruSayisi: 7, osymTesti: 'tyt-fen' },
      { id: 'kimya', ad: 'Kimya', soruSayisi: 7, osymTesti: 'tyt-fen' },
      { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 6, osymTesti: 'tyt-fen' },
    ],
  },
  {
    id: 'ayt-say',
    ad: 'AYT Sayısal',
    tur: 'ayt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'matematik', ad: 'Matematik', soruSayisi: 40, osymTesti: 'ayt-mat' },
      { id: 'fizik', ad: 'Fizik', soruSayisi: 14, osymTesti: 'ayt-fizik' },
      { id: 'kimya', ad: 'Kimya', soruSayisi: 13, osymTesti: 'ayt-kimya' },
      { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 13, osymTesti: 'ayt-biyoloji' },
    ],
  },
  {
    id: 'ayt-ea',
    ad: 'AYT Eşit Ağırlık',
    tur: 'ayt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'matematik', ad: 'Matematik', soruSayisi: 40, osymTesti: 'ayt-mat' },
      { id: 'edebiyat', ad: 'Türk Dili ve Edebiyatı', soruSayisi: 24, osymTesti: 'ayt-edebiyat' },
      { id: 'tarih1', ad: 'Tarih-1', soruSayisi: 10, osymTesti: 'ayt-tarih1' },
      { id: 'cografya1', ad: 'Coğrafya-1', soruSayisi: 6, osymTesti: 'ayt-cografya1' },
    ],
  },
  {
    id: 'ayt-soz',
    ad: 'AYT Sözel',
    tur: 'ayt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [
      { id: 'edebiyat', ad: 'Türk Dili ve Edebiyatı', soruSayisi: 24, osymTesti: 'ayt-edebiyat' },
      { id: 'tarih1', ad: 'Tarih-1', soruSayisi: 10, osymTesti: 'ayt-tarih1' },
      { id: 'cografya1', ad: 'Coğrafya-1', soruSayisi: 6, osymTesti: 'ayt-cografya1' },
      { id: 'tarih2', ad: 'Tarih-2', soruSayisi: 11, osymTesti: 'ayt-tarih2' },
      { id: 'cografya2', ad: 'Coğrafya-2', soruSayisi: 11, osymTesti: 'ayt-cografya2' },
      { id: 'felsefe', ad: 'Felsefe Grubu', soruSayisi: 12, osymTesti: 'ayt-felsefe' },
      { id: 'din', ad: 'Din Kültürü', soruSayisi: 6, osymTesti: 'ayt-din' },
    ],
  },
  {
    id: 'ydt',
    ad: 'YDT (Yabancı Dil)',
    tur: 'ydt',
    yanlisKatsayi: 4,
    hazir: true,
    dersler: [{ id: 'ydt', ad: 'Yabancı Dil', soruSayisi: 80, osymTesti: 'ydt' }],
  },
]

/** Alanın kısa adı — seviye tespit şablonlarının adında ve alan seçiminde. */
export const ALAN_KISA_ADI: Record<PuanTuru, string> = {
  say: 'Sayısal',
  ea: 'EA',
  soz: 'Sözel',
  dil: 'Dil',
}

/** Alanın gerçek sınavının şablonu: 11 ve 12'nin seviye tespiti onun dersleriyle. */
const ALAN_SINAVI: Record<PuanTuru, string> = {
  say: 'ayt-say',
  ea: 'ayt-ea',
  soz: 'ayt-soz',
  dil: 'ydt',
}

function temelSablon(id: string): Sablon {
  return TEMEL_SABLONLAR.find((s) => s.id === id)!
}

/**
 * 10, 11 ve 12. sınıfın seviye tespit şablonları (kullanıcı istedi, 2026-10).
 *
 * - 10. sınıf: 9'un dersleri ve Felsefe. 10'da Felsefe dersi başlıyor; soru
 *   sayısı Din Kültürü'yle aynı tutuldu (kullanıcı seçti).
 * - 11 ve 12: AYT'nin aynısı, öğrencinin alanına göre. Dersler ve kimlikler
 *   AYT şablonundan kopya; tür yine `okul`, deneme listesinde seviye
 *   tespitlerin yanında duruyor (tahmin türe değil testlere bakıyor).
 *
 * Kullanıcı bunların derslerini "Dersleri düzenle"yle değiştirebiliyor;
 * hazır şablon değişmiyor, yanına kullanıcının şablonu ekleniyor
 * (`lib/seviye-tespit.ts`).
 */
const SEVIYE_SABLONLARI: Sablon[] = [
  {
    ...temelSablon('okul'),
    id: 'okul-10',
    ad: 'Seviye Tespit · 10. sınıf',
    seviye: { sinif: 10 },
    dersler: [
      ...temelSablon('okul').dersler.filter((d) => d.id !== 'din'),
      { id: 'felsefe', ad: 'Felsefe', soruSayisi: 6, osymTesti: 'ayt-felsefe' },
      ...temelSablon('okul').dersler.filter((d) => d.id === 'din'),
    ],
  },
  ...[11, 12].flatMap((sinif) =>
    (Object.keys(ALAN_SINAVI) as PuanTuru[]).map(
      (alan): Sablon => ({
        id: `okul-${sinif}-${alan}`,
        ad: `Seviye Tespit · ${sinif}. sınıf ${ALAN_KISA_ADI[alan]}`,
        tur: 'okul',
        yanlisKatsayi: 4,
        hazir: true,
        seviye: { sinif, alan },
        dersler: temelSablon(ALAN_SINAVI[alan]).dersler,
      }),
    ),
  ),
]

export const HAZIR_SABLONLAR: Sablon[] = [...TEMEL_SABLONLAR, ...SEVIYE_SABLONLARI]

export const VARSAYILAN_SABLON_ID = 'okul'

/** Şablonun toplam soru sayısı. */
export function toplamSoru(sablon: Sablon): number {
  return sablon.dersler.reduce((toplam, ders) => toplam + ders.soruSayisi, 0)
}

/** Kimliğe göre şablon; bilinmeyen kimlikte varsayılana düşer. */
export function sablonBul(sablonlar: Sablon[], id: string): Sablon {
  return (
    sablonlar.find((s) => s.id === id) ??
    sablonlar.find((s) => s.id === VARSAYILAN_SABLON_ID) ??
    sablonlar[0]
  )
}

/**
 * Hazır şablonların güncel tanımı her açılışta koddan gelir; kullanıcının kendi
 * oluşturduğu şablonlar korunur. Böylece ÖSYM dağılımı değişirse uygulama
 * güncellemesiyle düzelir, kullanıcı verisi kaybolmaz.
 */
export function sablonlariBirlestir(kayitli: Sablon[]): Sablon[] {
  const hazirIdler = new Set(HAZIR_SABLONLAR.map((s) => s.id))
  return [...HAZIR_SABLONLAR, ...kayitli.filter((s) => !hazirIdler.has(s.id))]
}

/**
 * Yeni deneme ekranında **seçilebilen** şablonlar. Seviye tespit ve TYT
 * herkeste; AYT ve YDT yalnızca 11, 12 ve mezunda, o da öğrencinin kendi
 * alanının sınavı (`Ayarlar.puanTuru`): sayısal öğrenciye AYT Sözel çipi,
 * 9. sınıfa AYT'nin kendisi giremeyeceği bir sınavı gösteriyordu. "Alanımda
 * karar vermedim" (`null`) diyen öğrenci ise sınıfı ne olursa olsun **tüm**
 * hazır şablonları görüyor: bir alanın sınavını varsayılan diye önermek de,
 * öteki alanları gizlemek de kullanıcının vermediği bir karar olurdu. Bu
 * önce yalnızca 11/12/mezunda böyleydi; kullanıcı kararsız 9-10. sınıfın da
 * istediği denemeyi girebilmesini istedi — dershanede AYT denemesine giren
 * 10. sınıf öğrencisi var. Alanını seçmiş 9-10. sınıfta AYT yine yok.
 *
 * Kullanıcının kendi şablonları süzülmüyor: onları o oluşturdu.
 * Süzgeç yalnızca seçim listesine ait; kayıtlı denemenin şablonu
 * `sablonBul` ile tam listeden bulunmaya devam ediyor.
 */
export function secilebilirSablonlar(
  sablonlar: Sablon[],
  sinif: number,
  puanTuru: PuanTuru | null,
): Sablon[] {
  // Seviye tespit satırda tek düğme (`okul`); sınıfı ve alanı altındaki
  // satırdan seçiliyor, öteki seviye şablonları burada yer tutmuyor.
  const turSatiri = sablonlar.filter((s) => !s.seviye || s.id === 'okul')
  // Kararsız öğrenci: süzgeç yok, tüm hazır şablonlar çıkıyor.
  if (puanTuru === null) return turSatiri
  const alanSinaviId = sinif >= 11 && puanTuru ? ALAN_SINAVI[puanTuru] : null
  return turSatiri.filter(
    (s) => !s.hazir || s.id === 'okul' || s.id === 'tyt' || s.id === alanSinaviId,
  )
}
