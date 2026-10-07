import { HARITA_ESLEMESI } from './harita-eslemesi'
import type { YksDers, YksKonu } from './liste'

/**
 * YKS konusunun sınıfı — Konu Takibi'ndeki `9 · 10 · 11 · 12 · Tümü` sekmesi.
 *
 * YKS sınıf sormuyor ama öğrenci konuyu okulda bir sınıfta görüyor ve
 * listeyi "benim sınıfımda ne var" diye süzmek istiyor. Sınıf iki kaynaktan
 * ve bu sırayla geliyor:
 *
 * 1. **Harita eşlemesi** (`harita-eslemesi.ts`). Eşli konunun sınıfı
 *    destelerin önekinden okunuyor (`mat9-`, `fzk10-`, `trh11-`); elle
 *    yazılmıyor, yoksa eşleme değişince iki tablo birbirini tutmazdı. Konu
 *    birden çok sınıfın destesine eşliyse **en çok desteye sahip sınıf**,
 *    eşitlikte **en erken** sınıf (`eslemeSinifi`): AYT Tiyatro bir 9., iki
 *    11. sınıf destesine bağlı ve konunun ağırlığı 11'de; Şiir Bilgisi 9 ve
 *    10'a birer desteyle bağlı ve öğrenci onu ilk kez 9'da görüyor.
 * 2. **Elle tablo** (`ELLE_SINIFLAR`) — haritada karşılığı olmayan konular.
 *    Kural: Maarif 9–11'de (haritanın içerik dosyaları ya da
 *    `lib/konu/maarif/iskelet.json`) karşılığı varsa o sınıf; yoksa 2018
 *    ortaöğretim programındaki sınıfı. Maarif'in 12. sınıf programı henüz
 *    yayımlanmadı ve bugünün 12. sınıfları 2018 programını okuyor; o
 *    programın 12. sınıf konuları (Limit, Türev, İntegral, Millî Mücadele,
 *    Cumhuriyet Dönemi edebiyatı…) burada 12.
 *
 * **12 haritasız sınıf.** 12. sınıfın harita kartları yazılmadı, yani 12
 * olan hiçbir konu haritaya eşli olamaz — eşli konu zaten 9–11 alıyor.
 * `sinif.test.ts` iki tablonun birbirini tutmasını, her konunun bir sınıfı
 * olmasını ve elle tablonun eşli bir konuyu ezmemesini denetliyor.
 *
 * Sınıf yalnızca **liste görünümünü** süzüyor. Özet, tempo, "Devam et",
 * hızlı başlangıç ve Sıradaki bütün dersi sayıyor; kayıt şeması değişmedi.
 */

export type YksSinif = 9 | 10 | 11 | 12

export const YKS_SINIFLARI: readonly YksSinif[] = [9, 10, 11, 12]

/** Sekmedeki seçim: bir sınıf ya da hepsi. */
export type SinifSecimi = YksSinif | 'tumu'

/** Haritası yazılmamış sınıf — sekmede "Haritası yok" diyor. */
export const HARITASIZ_SINIF: YksSinif = 12

/** Harita destesi kimliğinin sınıf öneki: `mat9-…`, `fzk10-…`, `trh11-…`. */
const DESTE_ONEKI = /^[a-z]+(9|10|11)-/

/**
 * Eşli harita destelerinden sınıf: en çok desteye sahip sınıf, eşitlikte en
 * erken. Önek okunamazsa (kimlik biçimi değişmişse) `null`.
 */
export function eslemeSinifi(desteler: readonly string[]): YksSinif | null {
  const sayac = new Map<YksSinif, number>()
  for (const deste of desteler) {
    const eslesme = DESTE_ONEKI.exec(deste)
    if (!eslesme) continue
    const sinif = Number(eslesme[1]) as YksSinif
    sayac.set(sinif, (sayac.get(sinif) ?? 0) + 1)
  }
  let secilen: YksSinif | null = null
  for (const sinif of YKS_SINIFLARI) {
    const sayi = sayac.get(sinif) ?? 0
    if (sayi > 0 && (secilen === null || sayi > (sayac.get(secilen) ?? 0))) secilen = sinif
  }
  return secilen
}

/**
 * Haritada karşılığı olmayan konuların sınıfı. Yorumda "Maarif" yazan satır
 * Maarif 9–11'de karşılığı olan konu (eşleme ölçüsüne yetmese de), "2018"
 * yazan satır Maarif 9–11'de bulunamayan ve eski programın sınıfını alan
 * konu. 2018'de 9–11'de olup Maarif 9–11'e girmeyen konular (Polinomlar,
 * Mitoz-Mayoz, Kalıtım, Tork, Tanzimat…) Maarif'in 12. sınıfına kaymış
 * olabilir; program yayımlanınca yeniden bakılmalı.
 */
export const ELLE_SINIFLAR: Readonly<Record<string, YksSinif>> = {
  // --- TYT Türkçe --------------------------------------------------------
  // Maarif 10 Sözcük Türleri ve Fiiller destesinin yanında; cümle bilgisi
  // ve anlatım bozuklukları Maarif 9–11 dil bilgisinde yok (2018).
  'tyt-trk-yapi': 10,
  'tyt-trk-ogeler': 11,
  'tyt-trk-cumle-turleri': 11,
  'tyt-trk-anlatim-bozuklugu': 12,

  // --- TYT Matematik -----------------------------------------------------
  // Sayılar ve problemler Maarif 9'un "Sayılar" ve "Doğrusal Denklem ve
  // Eşitsizlik Problemleri" temaları.
  'tyt-mat-basamak': 9,
  'tyt-mat-rasyonel': 9,
  'tyt-mat-carpanlara-ayirma': 9,
  'tyt-mat-oran-oranti': 9,
  'tyt-mat-sayi-kesir-problem': 9,
  'tyt-mat-yas-problem': 9,
  'tyt-mat-isci-problem': 9,
  'tyt-mat-yuzde-problem': 9,
  'tyt-mat-karisim-problem': 9,
  'tyt-mat-hareket-problem': 9,
  'tyt-mat-grafik-problem': 9,
  'tyt-mat-kumeler': 9,
  'tyt-mat-polinom': 10, // 2018; Maarif 10'da polinom yok
  'tyt-geo-dogruda-aci': 9,
  'tyt-geo-ikizkenar-eskenar': 9,
  'tyt-geo-cember': 11, // 2018
  'tyt-geo-kati-cisim': 11, // 2018

  // --- TYT Fizik ---------------------------------------------------------
  'tyt-fiz-madde': 9, // 2018
  'tyt-fiz-elektrostatik': 9, // 2018
  'tyt-fiz-manyetizma': 11, // Maarif 11 "Manyetik Alan ve Manyetik Kuvvet"

  // --- TYT Kimya ---------------------------------------------------------
  'tyt-kim-kanunlar': 10, // Maarif 10 mol ve kimyasal hesaplamaların yanında
  'tyt-kim-asit-baz': 11, // Maarif 11 asit-baz teorileri
  'tyt-kim-her-yerde': 9, // Maarif 9 "Günlük Hayatta Kimya"

  // --- TYT Biyoloji ------------------------------------------------------
  'tyt-biy-bolunme': 10, // 2018
  'tyt-biy-kalitim': 10, // 2018; Maarif 10'da kalıtım yok

  // --- TYT Tarih ---------------------------------------------------------
  'tyt-tar-islam': 9, // 2018; Maarif 9 Orta Çağ medeniyetleri
  'tyt-tar-toplum-duzeni': 10, // Maarif 10 "Cihan Devleti Osmanlı (1453-1683)"
  'tyt-tar-degisim-cagi': 10, // Maarif 10 sömürgecilik, 1453-1683 bilim-kültür
  'tyt-tar-denge-stratejisi': 11, // Maarif 11 "Dönüşüm Sürecinde Osmanlı"
  'tyt-tar-gundelik-hayat': 11, // Maarif 11
  'tyt-tar-milli-mucadele': 12,
  'tyt-tar-ataturkculuk': 12,

  // --- TYT Coğrafya ------------------------------------------------------
  'tyt-cog-dunya-hareket': 9, // 2018
  'tyt-cog-su-toprak-bitki': 10, // 2018
  'tyt-cog-yer-sekilleri': 10, // Maarif 10 yeryüzü şekilleri
  'tyt-cog-ulasim': 10, // 2018
  'tyt-cog-cevre-toplum': 10, // 2018

  // --- TYT Felsefe (2018: 10. sınıf Felsefe) -----------------------------
  'tyt-fel-tanima': 10,
  'tyt-fel-dusunme': 10,
  'tyt-fel-varlik': 10,
  'tyt-fel-bilgi': 10,
  'tyt-fel-bilim': 10,
  'tyt-fel-ahlak': 10,
  'tyt-fel-din': 10,
  'tyt-fel-siyaset': 10,
  'tyt-fel-sanat': 10,

  // --- TYT Din Kültürü (2018 DKAB: ilk beş ünite 9, sonraki beş 10) -------
  'tyt-din-bilgi-inanc': 9,
  'tyt-din-din-islam': 9,
  'tyt-din-ibadet': 9,
  'tyt-din-genclik': 9,
  'tyt-din-gonul': 9,
  'tyt-din-allah-insan': 10,
  'tyt-din-hz-muhammed': 10,
  'tyt-din-hayat': 10,
  'tyt-din-ahlak': 10,
  'tyt-din-yorumlar': 10,

  // --- AYT Matematik -----------------------------------------------------
  'ayt-mat-polinom': 10, // 2018
  'ayt-mat-ikinci-derece': 10, // 2018
  'ayt-mat-karmasik': 10, // 2018
  'tyt-mat-binom': 10, // 2018; Maarif 10 Sayma Stratejileri yalnızca Pascal üçgeni
  'ayt-mat-trig-formul': 12,
  'ayt-mat-diziler': 12,
  'ayt-mat-limit': 12,
  'ayt-mat-turev': 12,
  'ayt-mat-integral': 12,
  'ayt-geo-cember-analitik': 12,

  // --- AYT Fizik ---------------------------------------------------------
  // 2018'de 11. sınıfın kuvvet-hareket ve elektrik üniteleri; Maarif 11'de
  // yoklar.
  'ayt-fiz-bagil': 11,
  'ayt-fiz-momentum': 11,
  'ayt-fiz-tork': 11,
  'ayt-fiz-denge': 11,
  'ayt-fiz-basit-makine': 11,
  'ayt-fiz-potansiyel': 11,
  'ayt-fiz-sigac': 11,
  'ayt-fiz-alternatif': 11,
  'ayt-fiz-donerek-oteleme': 12,
  'ayt-fiz-kepler': 12,
  'ayt-fiz-dalga-mekanigi': 12,
  'ayt-fiz-atom': 12,
  'ayt-fiz-modern': 12,
  'ayt-fiz-modern-teknoloji': 12,

  // --- AYT Kimya ---------------------------------------------------------
  'ayt-kim-elektrik': 12,
  'ayt-kim-karbon': 12,
  'ayt-kim-organik': 12,
  'ayt-kim-enerji-kaynaklari': 12,

  // --- AYT Biyoloji ------------------------------------------------------
  'ayt-biy-ureme': 11, // 2018
  'ayt-biy-genden-proteine': 12,
  'ayt-biy-bitki': 12,
  'ayt-biy-canlilar-cevre': 12,

  // --- AYT Edebiyat ------------------------------------------------------
  'ayt-edb-gecis': 10, // Maarif 10 Mesnevi ve Halk Hikâyesi
  'ayt-edb-halk-tekke': 10, // Maarif 10 Anonim Halk Edebiyatı'nın yanında
  'ayt-edb-divan': 10, // 2018
  'ayt-edb-tanzimat': 11, // 2018
  'ayt-edb-servetifunun': 11, // 2018
  'ayt-edb-fecriati': 11, // 2018
  'ayt-edb-cumhuriyet': 12,
  'ayt-edb-akimlar': 11, // 2018
  'ayt-edb-dunya': 12,

  // --- AYT Tarih (2018: 12. sınıf Çağdaş Türk ve Dünya Tarihi) -----------
  'ayt-tar-iki-savas-arasi': 12,
  'ayt-tar-ikinci-dunya': 12,
  'ayt-tar-soguk-savas': 12,
  'ayt-tar-toplumsal-devrim': 12,
  'ayt-tar-xxi-yuzyil': 12,

  // --- AYT Coğrafya ------------------------------------------------------
  'ayt-cog-ekosistem': 11, // 2018
  'ayt-cog-tarim': 11, // Maarif 11 "Tarımsal Faaliyetler ve Gıda Güvencesi"
  'ayt-cog-sanayi': 11, // Maarif 11 "Sanayileşmenin Mekânsal Etkileri"
  'ayt-cog-ulasim-ticaret': 11, // 2018
  'ayt-cog-jeopolitik': 12,
  'ayt-cog-orgutler': 11, // 2018
  'ayt-cog-ekstrem': 12,
  'ayt-cog-cevre': 12,

  // --- AYT Felsefe Grubu -------------------------------------------------
  // Felsefe tarihi 2018'de 11. sınıf Felsefe. Psikoloji, Sosyoloji ve
  // Mantık seçmeli ve okuldan okula 11 ya da 12'de okunuyor; 11 seçildi.
  'ayt-fel-ilk-cag': 11,
  'ayt-fel-orta-cag': 11,
  'ayt-fel-15-17': 11,
  'ayt-fel-18-19': 11,
  'ayt-fel-20': 11,
  'ayt-psi-bilim': 11,
  'ayt-psi-temel-surecler': 11,
  'ayt-psi-ogrenme': 11,
  'ayt-psi-ruh-sagligi': 11,
  'ayt-sos-giris': 11,
  'ayt-sos-birey-toplum': 11,
  'ayt-sos-yapi': 11,
  'ayt-sos-degisme': 11,
  'ayt-sos-kultur': 11,
  'ayt-sos-kurumlar': 11,
  'ayt-man-giris': 11,
  'ayt-man-klasik': 11,
  'ayt-man-dil': 11,
  'ayt-man-sembolik': 11,

  // --- AYT Din Kültürü (2018 DKAB: ilk beş ünite 11, sonraki beş 12) ------
  'ayt-din-dunya-ahiret': 11,
  'ayt-din-kuran-hz-muhammed': 11,
  'ayt-din-kavramlar': 11,
  'ayt-din-inanc-meseleleri': 11,
  'ayt-din-yahudilik-hristiyanlik': 11,
  'ayt-din-islam-bilim': 12,
  'ayt-din-anadolu': 12,
  'ayt-din-tasavvuf': 12,
  'ayt-din-guncel': 12,
  'ayt-din-hint-cin': 12,

  // --- YDT ---------------------------------------------------------------
  // Soru tipleri ve dil bilgisi bir sınıfın konusu değil, dört yıla yayılan
  // birikimin sınav biçimi; Dil öğrencisi YDT'ye 12'de hazırlanıyor. Hepsi
  // 12 — sekmede YDT tek liste olarak "Tümü"de açılıyor.
  'ydt-zamanlar': 12,
  'ydt-kipler': 12,
  'ydt-edilgen': 12,
  'ydt-kosul': 12,
  'ydt-sifat-cumlecik': 12,
  'ydt-isim-cumlecik': 12,
  'ydt-zarf-cumlecik': 12,
  'ydt-fiilimsi': 12,
  'ydt-edatlar': 12,
  'ydt-kelime': 12,
  'ydt-cloze': 12,
  'ydt-cumle-tamamlama': 12,
  'ydt-ceviri-ing-tr': 12,
  'ydt-ceviri-tr-ing': 12,
  'ydt-okuma': 12,
  'ydt-diyalog': 12,
  'ydt-yakin-anlam': 12,
  'ydt-paragraf-tamamlama': 12,
  'ydt-anlam-butunlugu': 12,
}

/**
 * Konunun sınıfı: önce harita eşlemesi, yoksa elle tablo. İkisinde de yoksa
 * 12 — haritası olmayan sınıf; test bu durumu zaten kırıyor, bu yalnızca
 * çalışma anındaki emniyet.
 */
export function konuSinifi(konuId: string): YksSinif {
  const desteler = HARITA_ESLEMESI[konuId]
  return (desteler && eslemeSinifi(desteler)) ?? ELLE_SINIFLAR[konuId] ?? HARITASIZ_SINIF
}

/**
 * Sekmede görünen konular. Sınıfta yalnızca o sınıfınkiler, müfredat
 * sırasıyla; "Tümü"de hepsi, sınıf sınıf (9'dan 12'ye) ve sınıfın içinde
 * müfredat sırasıyla — ekran onları sınıf başlıkları altında grupluyor.
 */
export function sinifKonulari(ders: YksDers, secim: SinifSecimi): YksKonu[] {
  if (secim !== 'tumu') return ders.konular.filter((k) => konuSinifi(k.id) === secim)
  return YKS_SINIFLARI.flatMap((s) => ders.konular.filter((k) => konuSinifi(k.id) === s))
}

/**
 * Ders ekranı açılırken seçili sekme: öğrencinin kendi sınıfı (9–11). 12.
 * sınıf ve mezun "Tümü"de açılıyor — YKS'ye hazırlanan öğrenci bütün
 * konuların karşısında, yalnızca 12'ninkilerle değil. Kendi sınıfında o
 * dersin konusu yoksa (9. sınıfta AYT Edebiyat'ın bir kısmı, YDT) yine
 * "Tümü": boş bir sekmeye açılmak "liste bozuk" diye okunur.
 */
export function varsayilanSinifSecimi(ders: YksDers, buYilSinif: number): SinifSecimi {
  if (buYilSinif !== 9 && buYilSinif !== 10 && buYilSinif !== 11) return 'tumu'
  return ders.konular.some((k) => konuSinifi(k.id) === buYilSinif) ? buYilSinif : 'tumu'
}

/**
 * Belirli bir konuya gidilirken sekme ("Devam et", Sıradaki): konu seçili
 * sekmede görünüyorsa sekme kalıyor, görünmüyorsa konunun sınıfına geçiliyor.
 */
export function konuyuGosterenSecim(konuId: string, secim: SinifSecimi): SinifSecimi {
  if (secim === 'tumu') return secim
  const sinif = konuSinifi(konuId)
  return sinif === secim ? secim : sinif
}
