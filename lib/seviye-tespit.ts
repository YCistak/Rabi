/**
 * Seviye tespit denemesinin sınıfa göre şablonu ve kullanıcının düzenlediği
 * ders listesi.
 *
 * Seviye tespit bir süre tek şablondu (`okul`) ve 9. sınıfın biçimiydi.
 * Kullanıcı sınıf seçimi istedi (2026-10): 10'da Felsefe ekleniyor, 11 ve
 * 12'de sınav alanın AYT'si gibi. Hazır şablonlar `sablonlar.ts`te; burada
 * hangisinin seçileceği ve kullanıcının "Dersleri düzenle"yle kurduğu
 * şablonun kaydı var. Saf; `seviye-tespit.test.ts`.
 *
 * ## Düzenlenen şablon hazır olanı ezmiyor
 *
 * Kullanıcının dersleri yeni bir şablon olarak kaydediliyor (`hazir: false`,
 * aynı `seviye`), seçimde hazır olanın önüne geçiyor. Kayıtlı denemeler
 * şablonlarına `sablonId` ile bağlı: bir deneme girilmiş şablonun dersleri
 * değişseydi o denemenin boş sayıları ve netleri de değişirdi. O yüzden
 * kullanılmış şablon yerinde değiştirilmiyor, `eski` işaretlenip yanına yenisi
 * ekleniyor; kullanılmamışsa siliniyor, yerine yenisi geliyor (liste şişmesin).
 */

import { HAZIR_SABLONLAR } from './sablonlar'
import type { PuanTuru, Sablon, SablonDers } from './types'

export const SEVIYE_SINIFLARI = [9, 10, 11, 12] as const
export type SeviyeSinifi = (typeof SEVIYE_SINIFLARI)[number]

/** 11 ve 12'de seviye tespit alanın AYT'si gibi; alan seçilmeden şablon belli değil. */
export function alanGerekir(sinif: SeviyeSinifi): boolean {
  return sinif >= 11
}

/** Öğrencinin sınıfına en yakın seviye tespit sınıfı: mezun 12'ninkine düşüyor. */
export function varsayilanSeviyeSinifi(sinif: number): SeviyeSinifi {
  return Math.min(12, Math.max(9, Math.round(sinif))) as SeviyeSinifi
}

function ayniSeviye(sablon: Sablon, sinif: SeviyeSinifi, alan: PuanTuru): boolean {
  if (sablon.seviye?.sinif !== sinif) return false
  return !alanGerekir(sinif) || sablon.seviye.alan === alan
}

/** Sınıfın (11-12'de alanın) hazır seviye tespit şablonu. */
export function hazirSeviyeSablonu(sinif: SeviyeSinifi, alan: PuanTuru): Sablon {
  return HAZIR_SABLONLAR.find((s) => ayniSeviye(s, sinif, alan)) ?? HAZIR_SABLONLAR[0]
}

/**
 * Deneme formunda o sınıfın seviye tespiti: kullanıcının düzenlediği güncel
 * şablon varsa o, yoksa hazır olan.
 */
export function seviyeSablonu(sablonlar: Sablon[], sinif: SeviyeSinifi, alan: PuanTuru): Sablon {
  // Sondan aranıyor: en son kaydedilen geçerli. (`findLast` eski iOS'ta yok.)
  for (let i = sablonlar.length - 1; i >= 0; i--) {
    const s = sablonlar[i]
    if (!s.hazir && !s.seviye?.eski && ayniSeviye(s, sinif, alan)) return s
  }
  return hazirSeviyeSablonu(sinif, alan)
}

/**
 * "Ders ekle" listesi. Kimlikler 9. sınıf şablonunun kimlikleri: aynı ders
 * aynı kimlikle kalsın. ÖSYM testi, hazır seviye tespitlerdeki gibi AYT'nin
 * karşılığı; Türkçe'ninki TYT'de.
 */
export const SEVIYE_DERS_SECENEKLERI: readonly SablonDers[] = [
  { id: 'turkce', ad: 'Türkçe', soruSayisi: 10, osymTesti: 'tyt-turkce' },
  { id: 'edebiyat', ad: 'Edebiyat', soruSayisi: 10, osymTesti: 'ayt-edebiyat' },
  { id: 'matematik', ad: 'Matematik', soruSayisi: 10, osymTesti: 'ayt-mat' },
  { id: 'fizik', ad: 'Fizik', soruSayisi: 10, osymTesti: 'ayt-fizik' },
  { id: 'kimya', ad: 'Kimya', soruSayisi: 10, osymTesti: 'ayt-kimya' },
  { id: 'biyoloji', ad: 'Biyoloji', soruSayisi: 10, osymTesti: 'ayt-biyoloji' },
  { id: 'tarih', ad: 'Tarih', soruSayisi: 10, osymTesti: 'ayt-tarih1' },
  { id: 'cografya', ad: 'Coğrafya', soruSayisi: 10, osymTesti: 'ayt-cografya1' },
  { id: 'felsefe', ad: 'Felsefe', soruSayisi: 10, osymTesti: 'ayt-felsefe' },
  { id: 'din', ad: 'Din Kültürü', soruSayisi: 10, osymTesti: 'ayt-din' },
  { id: 'ingilizce', ad: 'İngilizce', soruSayisi: 10, osymTesti: 'ydt' },
]

/** Bir derste en çok bu kadar soru: kutu üç hane alıyor, gerçek sınavlarda ders başı 80'i geçmiyor. */
export const DERS_EN_COK_SORU = 200

/** Ders listesinde kaydı engelleyen ilk sorun; yoksa null. */
export function dersleriDenetle(dersler: readonly SablonDers[]): string | null {
  if (dersler.length === 0) return 'En az bir ders olmalı.'
  const adlar = new Set<string>()
  for (const ders of dersler) {
    const ad = ders.ad.trim()
    if (!ad) return 'Her dersin bir adı olmalı.'
    const anahtar = ad.toLocaleLowerCase('tr')
    if (adlar.has(anahtar)) return `"${ad}" iki kez yazılmış.`
    adlar.add(anahtar)
    if (!Number.isInteger(ders.soruSayisi) || ders.soruSayisi < 1 || ders.soruSayisi > DERS_EN_COK_SORU) {
      return `${ad}: soru sayısı 1 ile ${DERS_EN_COK_SORU} arasında olmalı.`
    }
  }
  return null
}

function ayniDersler(a: readonly SablonDers[], b: readonly SablonDers[]): boolean {
  return (
    a.length === b.length &&
    a.every((d, i) => d.id === b[i].id && d.ad === b[i].ad && d.soruSayisi === b[i].soruSayisi && d.osymTesti === b[i].osymTesti)
  )
}

/**
 * Kullanıcının seviye tespit derslerini kaydeder; yeni kayıtlı şablon listesi.
 *
 * `kayitli` yalnızca kullanıcının şablonları (hazırlar koddan geliyor).
 * Dersler hazır şablonunkiyle aynıysa ("Varsayılana dön") yeni şablon
 * eklenmiyor, düzenlenmişler kalkıyor ya da eskiye ayrılıyor; seçim hazır
 * olana dönüyor.
 */
export function seviyeDersleriniKaydet(
  kayitli: Sablon[],
  sinif: SeviyeSinifi,
  alan: PuanTuru,
  dersler: SablonDers[],
  kullanilanSablonIdleri: ReadonlySet<string>,
  yeniKimlik: string,
): Sablon[] {
  const hazir = hazirSeviyeSablonu(sinif, alan)
  const temiz = dersler.map((d) => ({ ...d, ad: d.ad.trim() }))
  // Bu sınıfın düzenlenmiş şablonları: kullanılmamışsa siliniyor, kullanılmışsa eskiye ayrılıyor.
  const sonraki = kayitli.flatMap((s) => {
    if (s.hazir || s.seviye?.eski || !ayniSeviye(s, sinif, alan)) return [s]
    if (!kullanilanSablonIdleri.has(s.id)) return []
    return [{ ...s, seviye: { ...s.seviye!, eski: true } }]
  })
  if (ayniDersler(temiz, hazir.dersler)) return sonraki
  return [
    ...sonraki,
    {
      id: yeniKimlik,
      ad: hazir.ad,
      tur: 'okul',
      yanlisKatsayi: hazir.yanlisKatsayi,
      hazir: false,
      seviye: alanGerekir(sinif) ? { sinif, alan } : { sinif },
      dersler: temiz,
    },
  ]
}
