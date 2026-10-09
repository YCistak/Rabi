import { HARITA_ESLEMESI } from './harita-eslemesi'
import type { YksDers, YksKonu } from './liste'

/**
 * YKS konusunun sınıfı — Konu Takibi'nin en üstündeki `9 · 10 · 11 · 12` sekmesi.
 *
 * YKS sınıf sormuyor ama öğrenci konuyu okulda bir sınıfta görüyor ve
 * listeyi "benim sınıfımda ne var" diye süzmek istiyor. Hangi konunun hangi
 * sınıfta okunduğu **öğrencinin müfredatına** bağlı (kullanıcının kararı,
 * 2026-10): bugünün 12. sınıfları ve mezunlar 2018 ortaöğretim programıyla,
 * 9–11. sınıflar Türkiye Yüzyılı Maarif Modeli'yle okuyor ve iki program
 * konuları farklı sınıflara koyuyor (Polinomlar 2018'de 10, Maarif 9–11'de
 * yok; XX. yüzyıl başları 2018'de 12'nin İnkılap Tarihi, Maarif'te 11).
 *
 * - **Eski program** (`ESKI_SINIF`, 12. sınıf ve mezun): her konu için 2018
 *   programındaki sınıf, 9–12. Harita eşlemesine bakılmıyor — harita Maarif'in
 *   dilinde ve o öğrencinin okulda gördüğü sırayı söylemiyor.
 * - **Maarif** (`maarifSinifi`, 9–11. sınıf ve sınıfı bilinmeyen): önce
 *   harita eşlemesi, yoksa `MAARIF_SINIF`. Maarif 9–11'de karşılığı olmayan
 *   konu `'henuz-yok'`: 12. sınıf programı yayımlanmadı, konunun sınıfını
 *   uydurmak yerine hiçbir sınıfta gösterilmiyor (sekmede yalnız o yılın
 *   konuları; "Tümü" sekmesi kullanıcının isteğiyle kalktı).
 *
 * Ekran sınıf → okul dersi → konu (`okul-dersleri.ts`); kayıt şeması değişmedi.
 */

export type YksSinif = 9 | 10 | 11 | 12

export const YKS_SINIFLARI: readonly YksSinif[] = [9, 10, 11, 12]

/**
 * Haritası tam olmayan sınıf. Eski programda 12 açık; harita yalnız bazı
 * derslerde var, sekmedeki "harita yok" görünen satırlardan hiçbiri haritaya
 * eşli değilse yazılır (`takip.ts`). Maarif'te 12'nin konu verisi yok, sekme
 * hiç listelenmiyor (`sinifSekmeleri`).
 */
export const HARITASIZ_SINIF: YksSinif = 12

/** Maarif 9–11'de karşılığı olmayan konu: 12. sınıf programı henüz yok, gösterilmiyor. */
export const HENUZ_YOK = 'henuz-yok'

/** Konunun öğrencinin müfredatındaki yeri: bir sınıf ya da (Maarif'te) "henüz yok". */
export type SinifYeri = YksSinif | typeof HENUZ_YOK

export type Mufredat = 'maarif' | 'eski'

/**
 * Öğrencinin müfredatı. `buYilSinif` 12 ya da mezun (13) → 2018 programı;
 * 9–11 → Maarif. Bilinmeyen değer (eski kayıt, NaN) Maarif sayılıyor:
 * 12/mezun her zaman kurulumda açıkça seçiliyor, belirsizlik ancak alt
 * sınıflardan gelebilir.
 */
export function ogrenciMufredati(buYilSinif: number): Mufredat {
  return Number.isFinite(buYilSinif) && buYilSinif >= 12 ? 'eski' : 'maarif'
}

/**
 * Harita destesi kimliğinin sınıf öneki: `mat9-…`, `fzk10-…`, `trh11-…`.
 *
 * 12 (`mat12-…`) bilerek okunmuyor: 12. sınıf desteleri 2018 programından ve
 * Maarif öğrencisine "bu konu 12'de" demiyor (Maarif'in 12'si yayımlanmadı).
 * Yalnız 12 destesine eşli konu Maarif'te `MAARIF_SINIF`a düşüyor.
 */
const DESTE_ONEKI = /^[a-z]+(9|10|11)-/

/**
 * Eşli harita destelerinden sınıf: en çok desteye sahip sınıf, eşitlikte en
 * erken. AYT Tiyatro bir 9., iki 11. sınıf destesine bağlı ve konunun
 * ağırlığı 11'de; Şiir Bilgisi 9 ve 10'a birer desteyle bağlı ve öğrenci onu
 * ilk kez 9'da görüyor. Önek okunamazsa (kimlik biçimi değişmişse) `null`.
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
 * Maarif: haritada karşılığı olmayan konuların sınıfı. Sayı yazan satırın
 * Maarif 9–11'de karşılığı var (haritanın içerik dosyaları ya da
 * `lib/konu/maarif/iskelet.json`; eşleme ölçüsüne yetmese de). `HENUZ_YOK`
 * Maarif 9–11'de bulunamayan konu: 2018'de 9–11'de okunup Maarif'e girmeyen
 * konular (Polinomlar, Mitoz-Mayoz, Kalıtım, Tork, Tanzimat…) büyük olasılıkla
 * Maarif'in 12. sınıfına kaydı. Program yayımlanınca bu satırlar sınıf alır;
 * ilk 12 yazıldığında 12 sekmesi kod değişmeden açılır (`sinifSekmeleri`).
 *
 * Felsefe ve Din Kültürü iskelette yok (Maarif programları uygulamaya
 * alınmadı); 2018'deki sınıflarıyla duruyorlar — 12. sınıf yarıları hariç.
 */
export const MAARIF_SINIF: Readonly<Record<string, YksSinif | typeof HENUZ_YOK>> = {
  // --- TYT Türkçe --------------------------------------------------------
  // Maarif 10 Sözcük Türleri ve Fiiller destesinin yanında; cümle bilgisi
  // ve anlatım bozuklukları Maarif 9–11 dil bilgisinde yok.
  'tyt-trk-yapi': 10,
  'tyt-trk-ogeler': HENUZ_YOK,
  'tyt-trk-cumle-turleri': HENUZ_YOK,
  'tyt-trk-anlatim-bozuklugu': HENUZ_YOK,

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
  'tyt-mat-polinom': HENUZ_YOK, // Maarif 10'da polinom yok
  'tyt-geo-dogruda-aci': 9,
  'tyt-geo-ikizkenar-eskenar': 9,
  'tyt-geo-cember': HENUZ_YOK,
  'tyt-geo-kati-cisim': HENUZ_YOK,

  // --- TYT Fizik ---------------------------------------------------------
  'tyt-fiz-madde': HENUZ_YOK,
  'tyt-fiz-elektrostatik': HENUZ_YOK,
  'tyt-fiz-manyetizma': 11, // Maarif 11 "Manyetik Alan ve Manyetik Kuvvet"

  // --- TYT Kimya ---------------------------------------------------------
  'tyt-kim-kanunlar': 10, // Maarif 10 mol ve kimyasal hesaplamaların yanında
  'tyt-kim-asit-baz': 11, // Maarif 11 asit-baz teorileri
  'tyt-kim-her-yerde': 9, // Maarif 9 "Günlük Hayatta Kimya"

  // --- TYT Biyoloji ------------------------------------------------------
  'tyt-biy-bolunme': HENUZ_YOK,
  'tyt-biy-kalitim': HENUZ_YOK,

  // --- TYT Tarih ---------------------------------------------------------
  'tyt-tar-islam': HENUZ_YOK, // Maarif 9 Orta Çağ medeniyetleri İslam'ı ayrıca işlemiyor
  'tyt-tar-toplum-duzeni': 10, // Maarif 10 "Cihan Devleti Osmanlı (1453-1683)"
  'tyt-tar-degisim-cagi': 10, // Maarif 10 sömürgecilik, 1453-1683 bilim-kültür
  'tyt-tar-denge-stratejisi': 11, // Maarif 11 "Dönüşüm Sürecinde Osmanlı"
  'tyt-tar-gundelik-hayat': 11, // Maarif 11
  'tyt-tar-milli-mucadele': HENUZ_YOK,
  'tyt-tar-ataturkculuk': HENUZ_YOK,

  // --- TYT Coğrafya ------------------------------------------------------
  'tyt-cog-dunya-hareket': HENUZ_YOK,
  'tyt-cog-su-toprak-bitki': HENUZ_YOK,
  'tyt-cog-yer-sekilleri': 10, // Maarif 10 yeryüzü şekilleri
  'tyt-cog-ulasim': HENUZ_YOK,
  'tyt-cog-cevre-toplum': HENUZ_YOK,

  // --- TYT Felsefe (iskelette yok; 2018: 10. sınıf Felsefe) --------------
  'tyt-fel-tanima': 10,
  'tyt-fel-dusunme': 10,
  'tyt-fel-varlik': 10,
  'tyt-fel-bilgi': 10,
  'tyt-fel-bilim': 10,
  'tyt-fel-ahlak': 10,
  'tyt-fel-din': 10,
  'tyt-fel-siyaset': 10,
  'tyt-fel-sanat': 10,

  // --- TYT Din Kültürü (iskelette yok; 2018 DKAB 9 ve 10) -----------------
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
  'ayt-mat-polinom': HENUZ_YOK,
  'ayt-mat-ikinci-derece': HENUZ_YOK,
  'ayt-mat-karmasik': HENUZ_YOK,
  'tyt-mat-binom': HENUZ_YOK, // Maarif 10 Sayma Stratejileri yalnızca Pascal üçgeni
  'ayt-mat-trig-formul': HENUZ_YOK,
  'ayt-mat-diziler': HENUZ_YOK,
  'ayt-mat-limit': HENUZ_YOK,
  'ayt-mat-turev': HENUZ_YOK,
  'ayt-mat-integral': HENUZ_YOK,
  'ayt-geo-cember-analitik': HENUZ_YOK,

  // --- AYT Fizik ---------------------------------------------------------
  // 2018'in 11. sınıf kuvvet-hareket ve elektrik üniteleri Maarif 11'de yok.
  'ayt-fiz-bagil': HENUZ_YOK,
  'ayt-fiz-momentum': HENUZ_YOK,
  'ayt-fiz-tork': HENUZ_YOK,
  'ayt-fiz-denge': HENUZ_YOK,
  'ayt-fiz-basit-makine': HENUZ_YOK,
  'ayt-fiz-potansiyel': HENUZ_YOK,
  'ayt-fiz-sigac': HENUZ_YOK,
  'ayt-fiz-alternatif': HENUZ_YOK,
  'ayt-fiz-donerek-oteleme': HENUZ_YOK,
  'ayt-fiz-kepler': HENUZ_YOK,
  'ayt-fiz-dalga-mekanigi': HENUZ_YOK,
  'ayt-fiz-atom': HENUZ_YOK,
  'ayt-fiz-modern': HENUZ_YOK,
  'ayt-fiz-modern-teknoloji': HENUZ_YOK,

  // --- AYT Kimya ---------------------------------------------------------
  'ayt-kim-elektrik': HENUZ_YOK,
  'ayt-kim-karbon': HENUZ_YOK,
  'ayt-kim-organik': HENUZ_YOK,
  'ayt-kim-enerji-kaynaklari': HENUZ_YOK,

  // --- AYT Biyoloji ------------------------------------------------------
  'ayt-biy-ureme': HENUZ_YOK,
  'ayt-biy-genden-proteine': HENUZ_YOK,
  'ayt-biy-bitki': HENUZ_YOK,
  'ayt-biy-canlilar-cevre': HENUZ_YOK,

  // --- AYT Edebiyat ------------------------------------------------------
  'ayt-edb-gecis': 10, // Maarif 10 Mesnevi ve Halk Hikâyesi
  'ayt-edb-halk-tekke': 10, // Maarif 10 Anonim Halk Edebiyatı'nın yanında
  'ayt-edb-divan': HENUZ_YOK,
  'ayt-edb-tanzimat': HENUZ_YOK,
  'ayt-edb-servetifunun': HENUZ_YOK,
  'ayt-edb-fecriati': HENUZ_YOK,
  'ayt-edb-cumhuriyet': HENUZ_YOK,
  'ayt-edb-akimlar': HENUZ_YOK,
  'ayt-edb-dunya': HENUZ_YOK,

  // --- AYT Tarih (2018'de 12. sınıf Çağdaş Türk ve Dünya Tarihi) ---------
  'ayt-tar-iki-savas-arasi': HENUZ_YOK,
  'ayt-tar-ikinci-dunya': HENUZ_YOK,
  'ayt-tar-soguk-savas': HENUZ_YOK,
  'ayt-tar-toplumsal-devrim': HENUZ_YOK,
  'ayt-tar-xxi-yuzyil': HENUZ_YOK,

  // --- AYT Coğrafya ------------------------------------------------------
  'ayt-cog-ekosistem': HENUZ_YOK,
  'ayt-cog-tarim': 11, // Maarif 11 "Tarımsal Faaliyetler ve Gıda Güvencesi"
  'ayt-cog-sanayi': 11, // Maarif 11 "Sanayileşmenin Mekânsal Etkileri"
  'ayt-cog-ulasim-ticaret': HENUZ_YOK,
  'ayt-cog-jeopolitik': HENUZ_YOK,
  'ayt-cog-orgutler': HENUZ_YOK,
  'ayt-cog-ekstrem': HENUZ_YOK,
  'ayt-cog-cevre': HENUZ_YOK,

  // --- AYT Felsefe Grubu (iskelette yok; 2018'deki 11) -------------------
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

  // --- AYT Din Kültürü (iskelette yok; 2018 DKAB 11, 12'nin yarısı yok) ---
  'ayt-din-dunya-ahiret': 11,
  'ayt-din-kuran-hz-muhammed': 11,
  'ayt-din-kavramlar': 11,
  'ayt-din-inanc-meseleleri': 11,
  'ayt-din-yahudilik-hristiyanlik': 11,
  'ayt-din-islam-bilim': HENUZ_YOK,
  'ayt-din-anadolu': HENUZ_YOK,
  'ayt-din-tasavvuf': HENUZ_YOK,
  'ayt-din-guncel': HENUZ_YOK,
  'ayt-din-hint-cin': HENUZ_YOK,

  // --- YDT ---------------------------------------------------------------
  // Soru tipleri ve dil bilgisi bir sınıfın konusu değil, dört yıla yayılan
  // birikimin sınav biçimi; Dil öğrencisi YDT'ye son sınıfta hazırlanıyor.
  'ydt-zamanlar': HENUZ_YOK,
  'ydt-kipler': HENUZ_YOK,
  'ydt-edilgen': HENUZ_YOK,
  'ydt-kosul': HENUZ_YOK,
  'ydt-sifat-cumlecik': HENUZ_YOK,
  'ydt-isim-cumlecik': HENUZ_YOK,
  'ydt-zarf-cumlecik': HENUZ_YOK,
  'ydt-fiilimsi': HENUZ_YOK,
  'ydt-edatlar': HENUZ_YOK,
  'ydt-kelime': HENUZ_YOK,
  'ydt-cloze': HENUZ_YOK,
  'ydt-cumle-tamamlama': HENUZ_YOK,
  'ydt-ceviri-ing-tr': HENUZ_YOK,
  'ydt-ceviri-tr-ing': HENUZ_YOK,
  'ydt-okuma': HENUZ_YOK,
  'ydt-diyalog': HENUZ_YOK,
  'ydt-yakin-anlam': HENUZ_YOK,
  'ydt-paragraf-tamamlama': HENUZ_YOK,
  'ydt-anlam-butunlugu': HENUZ_YOK,
}

/**
 * Eski program (2018 Ortaöğretim Öğretim Programları): **her** YKS konusunun
 * okunduğu sınıf. 12. sınıf ve mezunun gördüğü sıra bu; harita eşlemesine
 * bakılmıyor. Kaynak MEB'in 2018 ders programlarının ünite dağılımı (TDE,
 * Matematik, Fizik, Kimya, Biyoloji, Tarih + T.C. İnkılap Tarihi + Çağdaş
 * Türk ve Dünya Tarihi, Coğrafya, Felsefe, DKAB). Bir konu iki sınıfa
 * yayılıyorsa ilk okunduğu sınıf. "muhtemel" yazan satır: program o konuyu
 * birden çok sınıfa dağıtıyor ya da ünite yeri okuldan okula değişiyor.
 */
export const ESKI_SINIF: Readonly<Record<string, YksSinif>> = {
  // --- TYT Türkçe (2018 Türk Dili ve Edebiyatı, dil bilgisi kazanımları) --
  // Anlam bilgisi dört yıla yayılıyor; ilk okunduğu 9. Dil bilgisinin sınıf
  // dağılımı muhtemel: ses, yazım, noktalama 9; sözcük yapısı ve isim
  // soylu sözcükler 10; fiil, cümle bilgisi 11; anlatım bozuklukları 12.
  'tyt-trk-sozcukte-anlam': 9,
  'tyt-trk-soz-yorumu': 9,
  'tyt-trk-cumlede-anlam': 9,
  'tyt-trk-paragraf': 9,
  'tyt-trk-ses': 9,
  'tyt-trk-yazim': 9,
  'tyt-trk-noktalama': 9,
  'tyt-trk-yapi': 10,
  'tyt-trk-isim': 10,
  'tyt-trk-sifat': 10,
  'tyt-trk-zamir': 10,
  'tyt-trk-zarf': 10,
  'tyt-trk-edat': 10,
  'tyt-trk-fiil': 11,
  'tyt-trk-ek-fiil': 11,
  'tyt-trk-fiilimsi': 11,
  'tyt-trk-cati': 11,
  'tyt-trk-ogeler': 11,
  'tyt-trk-cumle-turleri': 11,
  'tyt-trk-anlatim-bozuklugu': 12,

  // --- TYT Matematik -----------------------------------------------------
  // 9: Mantık, Kümeler, Denklemler ve Eşitsizlikler (sayılar, bölünebilme,
  // üslü-köklü, oran-orantı, problemler), Üçgenler, Veri. 10: Sayma ve
  // Olasılık, Fonksiyonlar, Polinomlar (çarpanlara ayırma dahil), Dörtgenler
  // ve Çokgenler, Katı Cisimler. 11: Çember ve Daire.
  'tyt-mat-temel-kavramlar': 9,
  'tyt-mat-basamak': 9,
  'tyt-mat-bolunebilme': 9,
  'tyt-mat-ebob-ekok': 9,
  'tyt-mat-rasyonel': 9,
  'tyt-mat-esitsizlik': 9,
  'tyt-mat-mutlak-deger': 9,
  'tyt-mat-uslu': 9,
  'tyt-mat-koklu': 9,
  'tyt-mat-carpanlara-ayirma': 10, // 10. sınıf Polinomlar ünitesinde
  'tyt-mat-oran-oranti': 9,
  'tyt-mat-denklem': 9,
  'tyt-mat-sayi-kesir-problem': 9,
  'tyt-mat-yas-problem': 9,
  'tyt-mat-isci-problem': 9,
  'tyt-mat-yuzde-problem': 9,
  'tyt-mat-karisim-problem': 9,
  'tyt-mat-hareket-problem': 9,
  'tyt-mat-grafik-problem': 9,
  'tyt-mat-kumeler': 9,
  'tyt-mat-mantik': 9,
  'tyt-mat-fonksiyon': 10,
  'tyt-mat-polinom': 10,
  'tyt-mat-permutasyon': 10,
  'tyt-mat-kombinasyon': 10,
  'tyt-mat-olasilik': 10,
  'tyt-mat-istatistik': 9,
  'tyt-geo-dogruda-aci': 9,
  'tyt-geo-ucgende-aci': 9,
  'tyt-geo-aci-kenar': 9,
  'tyt-geo-dik-ucgen': 9,
  'tyt-geo-trigonometri': 9, // 9. sınıf "Dik Üçgen ve Trigonometri"
  'tyt-geo-ikizkenar-eskenar': 9,
  'tyt-geo-aciortay-kenarortay': 9,
  'tyt-geo-eslik-benzerlik': 9,
  'tyt-geo-ucgende-alan': 9,
  'tyt-geo-cokgen': 10,
  'tyt-geo-dortgen': 10,
  'tyt-geo-ozel-dortgen': 10,
  'tyt-geo-cember': 11,
  'tyt-geo-kati-cisim': 10, // muhtemel: prizma-piramit 10, küre-silindir-koni 11

  // --- TYT Fizik ---------------------------------------------------------
  // 9: giriş, madde, hareket-kuvvet, enerji, ısı, elektrostatik. 10:
  // elektrik ve manyetizma, basınç ve kaldırma, dalgalar, optik.
  'tyt-fiz-giris': 9,
  'tyt-fiz-madde': 9,
  'tyt-fiz-hareket-kuvvet': 9,
  'tyt-fiz-is-enerji': 9,
  'tyt-fiz-isi': 9,
  'tyt-fiz-elektrostatik': 9,
  'tyt-fiz-elektrik': 10,
  'tyt-fiz-manyetizma': 10,
  'tyt-fiz-basinc': 10,
  'tyt-fiz-kaldirma': 10,
  'tyt-fiz-dalgalar': 10,
  'tyt-fiz-optik': 10,

  // --- TYT Kimya ---------------------------------------------------------
  'tyt-kim-bilim': 9,
  'tyt-kim-atom-periyodik': 9,
  'tyt-kim-etkilesim': 9,
  'tyt-kim-haller': 9,
  'tyt-kim-doga': 9,
  'tyt-kim-kanunlar': 10,
  'tyt-kim-mol': 10,
  'tyt-kim-tepkimeler': 10,
  'tyt-kim-hesaplamalar': 10,
  'tyt-kim-karisimlar': 10,
  'tyt-kim-asit-baz': 10,
  'tyt-kim-her-yerde': 10,

  // --- TYT Biyoloji ------------------------------------------------------
  'tyt-biy-ortak-ozellik': 9,
  'tyt-biy-bilesenler': 9,
  'tyt-biy-hucre': 9,
  'tyt-biy-madde-gecisi': 9,
  'tyt-biy-siniflandirma': 9,
  'tyt-biy-bolunme': 10,
  'tyt-biy-kalitim': 10,
  'tyt-biy-ekosistem': 10,
  'tyt-biy-cevre': 10,

  // --- TYT Tarih ---------------------------------------------------------
  // Başlıklar 2018 Tarih 9–11 ünite adları; son üçü 12. sınıf T.C. İnkılap
  // Tarihi ve Atatürkçülük.
  'tyt-tar-tarih-zaman': 9,
  'tyt-tar-ilk-donemler': 9,
  'tyt-tar-orta-cag': 9,
  'tyt-tar-turk-dunyasi': 9,
  'tyt-tar-islam': 9,
  'tyt-tar-ilk-turk-islam': 9,
  'tyt-tar-selcuklu': 10,
  'tyt-tar-osmanli-siyaset': 10,
  'tyt-tar-savascilar': 10,
  'tyt-tar-osmanli-medeniyet': 10,
  'tyt-tar-dunya-gucu': 10,
  'tyt-tar-merkez-teskilat': 10,
  'tyt-tar-toplum-duzeni': 10,
  'tyt-tar-degisen-dengeler': 11,
  'tyt-tar-degisim-cagi': 11,
  'tyt-tar-denge-stratejisi': 11,
  'tyt-tar-devrimler-cagi': 11,
  'tyt-tar-sermaye-emek': 11,
  'tyt-tar-gundelik-hayat': 11,
  'tyt-tar-xx-yuzyil': 12,
  'tyt-tar-milli-mucadele': 12,
  'tyt-tar-ataturkculuk': 12,

  // --- TYT Coğrafya ------------------------------------------------------
  'tyt-cog-doga-insan': 9,
  'tyt-cog-dunya-hareket': 9,
  'tyt-cog-konum': 9,
  'tyt-cog-harita': 9,
  'tyt-cog-iklim-bilgisi': 9,
  'tyt-cog-iklim-tipleri': 9,
  'tyt-cog-ic-kuvvet': 10,
  'tyt-cog-dis-kuvvet': 10,
  'tyt-cog-su-toprak-bitki': 10,
  'tyt-cog-nufus': 10,
  'tyt-cog-goc': 10,
  'tyt-cog-yerlesme': 9, // muhtemel: 9 "Yerleşmelerin Özellikleri"
  'tyt-cog-yer-sekilleri': 10,
  'tyt-cog-ekonomik': 10,
  'tyt-cog-bolgeler': 9,
  'tyt-cog-ulasim': 10,
  'tyt-cog-cevre-toplum': 10, // muhtemel
  'tyt-cog-afetler': 10,

  // --- TYT Felsefe (10. sınıf Felsefe) -----------------------------------
  'tyt-fel-tanima': 10,
  'tyt-fel-dusunme': 10,
  'tyt-fel-varlik': 10,
  'tyt-fel-bilgi': 10,
  'tyt-fel-bilim': 10,
  'tyt-fel-ahlak': 10,
  'tyt-fel-din': 10,
  'tyt-fel-siyaset': 10,
  'tyt-fel-sanat': 10,

  // --- TYT Din Kültürü (DKAB: ilk beş ünite 9, sonraki beş 10) -----------
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
  // 10: Fonksiyonlar, Polinomlar, İkinci Dereceden Denklemler (karmaşık
  // sayıya giriş 10.5'te), Sayma (binom). 11: Trigonometri, Analitik
  // Geometri, Fonksiyonlarda Uygulamalar (parabol), Denklem ve Eşitsizlik
  // Sistemleri, Olasılık. 12: Üstel-Logaritmik, Diziler, Trigonometri
  // (toplam-fark, denklemler), Dönüşümler, Türev, İntegral, Çemberin
  // Analitiği.
  'ayt-mat-fonksiyon': 10, // muhtemel: bileşke 10, dört işlem 11'e de yayılıyor
  'ayt-mat-polinom': 10,
  'ayt-mat-ikinci-derece': 10,
  'ayt-mat-karmasik': 10, // muhtemel: 2018'de ayrı ünite yok, 10.5'te giriş
  'ayt-mat-parabol': 11,
  'ayt-mat-esitsizlik': 11,
  'tyt-mat-binom': 10,
  'ayt-mat-kosullu-olasilik': 11,
  'ayt-mat-trig-fonksiyon': 11,
  'ayt-mat-trig-denklem': 12,
  'ayt-mat-trig-formul': 12,
  'ayt-mat-sinus-kosinus': 11,
  'ayt-mat-logaritma': 12,
  'ayt-mat-diziler': 12,
  'ayt-mat-limit': 12,
  'ayt-mat-turev': 12,
  'ayt-mat-integral': 12,
  'ayt-geo-analitik': 11,
  'ayt-geo-donusum': 12, // muhtemel
  'ayt-geo-cember-analitik': 12,

  // --- AYT Fizik (11: kuvvet-hareket, elektrik-manyetizma; 12 geri kalanı)
  'ayt-fiz-vektor': 11,
  'ayt-fiz-bagil': 11,
  'ayt-fiz-newton': 11,
  'ayt-fiz-sabit-ivme': 11,
  'ayt-fiz-iki-boyut': 11,
  'ayt-fiz-enerji-hareket': 11,
  'ayt-fiz-momentum': 11,
  'ayt-fiz-tork': 11,
  'ayt-fiz-denge': 11,
  'ayt-fiz-basit-makine': 11,
  'ayt-fiz-elektrik-alan': 11,
  'ayt-fiz-potansiyel': 11,
  'ayt-fiz-sigac': 11,
  'ayt-fiz-induksiyon': 11,
  'ayt-fiz-alternatif': 11,
  'ayt-fiz-transformator': 11,
  'ayt-fiz-cembersel': 12,
  'ayt-fiz-donerek-oteleme': 12,
  'ayt-fiz-kepler': 12,
  'ayt-fiz-bhh': 12,
  'ayt-fiz-dalga-mekanigi': 12,
  'ayt-fiz-atom': 12,
  'ayt-fiz-modern': 12,
  'ayt-fiz-modern-teknoloji': 12,

  // --- AYT Kimya ---------------------------------------------------------
  'ayt-kim-modern-atom': 11,
  'ayt-kim-gazlar': 11,
  'ayt-kim-cozeltiler': 11,
  'ayt-kim-enerji': 11,
  'ayt-kim-hiz': 11,
  'ayt-kim-denge': 11,
  'ayt-kim-asit-baz': 11,
  'ayt-kim-cozunurluk': 11,
  'ayt-kim-elektrik': 12,
  'ayt-kim-karbon': 12,
  'ayt-kim-organik': 12,
  'ayt-kim-enerji-kaynaklari': 12,

  // --- AYT Biyoloji (11: insan fizyolojisi, komünite; 12 geri kalanı) ----
  'ayt-biy-sinir': 11,
  'ayt-biy-endokrin': 11,
  'ayt-biy-duyu': 11,
  'ayt-biy-destek-hareket': 11,
  'ayt-biy-sindirim': 11,
  'ayt-biy-dolasim': 11,
  'ayt-biy-bagisiklik': 11,
  'ayt-biy-solunum': 11,
  'ayt-biy-uriner': 11,
  'ayt-biy-ureme': 11,
  'ayt-biy-komunite': 11,
  'ayt-biy-genden-proteine': 12,
  'ayt-biy-enerji': 12,
  'ayt-biy-bitki': 12,
  'ayt-biy-canlilar-cevre': 12,

  // --- AYT Edebiyat (TDE: 9 türler, 10 başlangıçtan Divan'a, 11 Tanzimat'tan
  // Millî Edebiyat'a, 12 Cumhuriyet) --------------------------------------
  'ayt-edb-guzel-sanatlar': 9,
  'ayt-edb-siir-bilgisi': 9,
  'ayt-edb-soz-sanatlari': 9,
  'ayt-edb-anlatmaya-bagli': 9,
  'ayt-edb-masal-fabl': 9,
  'ayt-edb-ogretici': 9, // muhtemel: türler dört yıla dağılıyor
  'ayt-edb-tiyatro': 9, // muhtemel: geleneksel tiyatro 10'da
  'ayt-edb-islamiyet-oncesi': 10,
  'ayt-edb-gecis': 10,
  'ayt-edb-halk': 10,
  'ayt-edb-halk-asik': 10,
  'ayt-edb-halk-tekke': 10,
  'ayt-edb-divan': 10,
  'ayt-edb-tanzimat': 11,
  'ayt-edb-servetifunun': 11,
  'ayt-edb-fecriati': 11,
  'ayt-edb-milli': 11,
  'ayt-edb-cumhuriyet': 12,
  'ayt-edb-akimlar': 11, // muhtemel
  'ayt-edb-dunya': 12, // muhtemel

  // --- AYT Tarih (12. sınıf Çağdaş Türk ve Dünya Tarihi) -----------------
  'ayt-tar-iki-savas-arasi': 12,
  'ayt-tar-ikinci-dunya': 12,
  'ayt-tar-soguk-savas': 12,
  'ayt-tar-toplumsal-devrim': 12,
  'ayt-tar-xxi-yuzyil': 12,

  // --- AYT Coğrafya ------------------------------------------------------
  'ayt-cog-ekosistem': 11,
  'ayt-cog-nufus-politika': 11,
  'ayt-cog-sehirler': 11,
  'ayt-cog-turkiye-ekonomi': 11,
  'ayt-cog-tarim': 11,
  'ayt-cog-maden-enerji': 11,
  'ayt-cog-sanayi': 11,
  'ayt-cog-ulasim-ticaret': 12, // 2018: 12.2.7-12.2.17 (ulaşım, ticaret, turizm)
  'ayt-cog-kultur': 11, // muhtemel
  'ayt-cog-jeopolitik': 12,
  'ayt-cog-orgutler': 11, // muhtemel
  'ayt-cog-iklim-degisimi': 12,
  'ayt-cog-ekstrem': 12,
  'ayt-cog-cevre': 12,

  // --- AYT Felsefe Grubu -------------------------------------------------
  // Felsefe tarihi 11. sınıf Felsefe. Psikoloji, Sosyoloji ve Mantık
  // seçmeli ve okuldan okula 10–12 arasında okunuyor; 11 seçildi (muhtemel).
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

  // --- AYT Din Kültürü (DKAB: ilk beş ünite 11, sonraki beş 12) ----------
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
  // Bir sınıfın konusu değil; Dil öğrencisi YDT'ye 12'de hazırlanıyor.
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
 * Konunun Maarif'teki yeri: önce harita eşlemesi (destelerin 9–11 öneki;
 * elle yazılmıyor, yoksa eşleme değişince iki tablo birbirini tutmazdı), yoksa
 * `MAARIF_SINIF` — yalnız 12 destesine eşli konular da buraya düşer. İkisinde de yoksa "henüz yok" — test bu durumu zaten
 * kırıyor, bu yalnızca çalışma anındaki emniyet.
 */
export function maarifSinifi(konuId: string): SinifYeri {
  const desteler = HARITA_ESLEMESI[konuId]
  return (desteler && eslemeSinifi(desteler)) ?? MAARIF_SINIF[konuId] ?? HENUZ_YOK
}

/** Konunun 2018 programındaki sınıfı. Tabloda yoksa 12 (test kırıyor; emniyet). */
export function eskiSinifi(konuId: string): YksSinif {
  return ESKI_SINIF[konuId] ?? 12
}

/** Konunun, öğrencinin müfredatına göre sınıfı. */
export function sinifAtamasi(konuId: string, ogrenciSinifi: number): SinifYeri {
  return ogrenciMufredati(ogrenciSinifi) === 'eski' ? eskiSinifi(konuId) : maarifSinifi(konuId)
}

/**
 * Bir YKS dersinin seçili sınıftaki konuları, müfredat sırasıyla. Maarif'te
 * 12 boş (sekme listelenmiyor) ve "henüz yok" konular hiçbir sınıfta yok.
 */
export function sinifKonulari(ders: YksDers, sinif: YksSinif, ogrenciSinifi: number): YksKonu[] {
  return ders.konular.filter((k) => sinifAtamasi(k.id, ogrenciSinifi) === sinif)
}

/**
 * Ekran açılırken seçili sınıf: öğrencinin kendi sınıfı; mezun (13) 12'de —
 * son okuduğu sınıf. Bilinmeyen değer (eski kayıt) 9: Maarif sayılıyor ve
 * en baştan başlamak boş bir sekmeye açılmaktan iyi.
 */
export function varsayilanSinif(buYilSinif: number): YksSinif {
  if (!Number.isFinite(buYilSinif)) return 9
  if (buYilSinif >= 12) return 12
  if (buYilSinif === 10 || buYilSinif === 11) return buYilSinif
  return 9
}

/** Oturumdan okunan değer bir sınıf mı. */
export function sinifMi(deger: unknown): deger is YksSinif {
  return YKS_SINIFLARI.includes(deger as YksSinif)
}
