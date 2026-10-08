import type { PuanTuru } from '../types'
import type { KonuDersId } from '../konu/tip'
import { yksDersBul, type YksDers, type YksKonu } from './liste'
import { YKS_SINIFLARI, sinifKonulari, type YksSinif } from './sinif'

/**
 * Konu Takibi'nin ekran düzeni: **sınıf → okul dersi → o sınıfın konuları**.
 *
 * Kullanıcı istedi (2026-10): "Konu takibinde TYT AYT diye hiç ayırma. 9 10
 * 11 12 diye ayıracaksın, sadece o yılın konuları olacak." Öğrenci takibi
 * okuldaki dersinin yanında tutuyor; TYT/AYT ayrımı sınavın, okulun değil.
 * Liste (`liste.ts`) yine YKS'nin dilinde ve kimlikler aynı — bu dosya yalnız
 * TYT ve AYT derslerini okul dersi başına **birleştiriyor**, sınıfa göre
 * `sinifAtamasi` süzüyor.
 *
 * Birleştirme kararları (okul dersi ← YKS dersleri):
 * - **Türk Dili ve Edebiyatı** ← TYT Türkçe + AYT Edebiyat. Okulda tek ders;
 *   TYT Türkçe'nin anlam ve dil bilgisi kazanımları da bu dersin programında.
 *   İki kaynak bölüm başlığıyla ayrılıyor ("Dil ve Anlatım" / "Edebiyat"),
 *   çünkü aynı sınıfta yan yana dizildiklerinde konu türleri birbirine
 *   karışıyordu.
 * - **Matematik** ← TYT Matematik + AYT Matematik. Okulda Geometri ayrı ders
 *   değil, Matematik'in üniteleri (2018 ve Maarif): ayrı ders yapılmadı,
 *   konu listesindeki "Geometri" bölümüyle duruyor.
 * - Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Din Kültürü ← TYT + AYT'deki
 *   aynı adlı ders.
 * - **Felsefe** ← TYT Felsefe + AYT Felsefe Grubu. Psikoloji, Sosyoloji,
 *   Mantık okulda ayrı seçmeli dersler ama YKS'de tek test; konu
 *   listesindeki bölümleriyle ayrılıyor.
 * - **Yabancı Dil** ← YDT; yalnız Dil alanında ve (2018 tablosunda) 12'de.
 */

/** Ekranda bir satır: tek YKS konusu ya da aynı içeriği taşıyan TYT+AYT çifti. */
export type TakipSatiri = YksKonu & {
  /**
   * Satırın okuyup yazdığı kayıt kimlikleri. Yoksa yalnız `id`. Birleşen
   * çiftte iki kimlik: satır ikisini birlikte işaretliyor, kayıt şeması
   * değişmiyor (`satirKimlikleri`, `takip.ts` → `satirDurumu`).
   */
  kimlikler?: readonly string[]
}

export function satirKimlikleri(satir: TakipSatiri): readonly string[] {
  return satir.kimlikler ?? [satir.id]
}

/** Bir sınıftaki okul dersi — ders listesinin satırı ve ders ekranı. */
export type TakipDersi = {
  /** Okul dersinin kimliği (oturumluk hatırlamada kullanılıyor; kayıtta yok). */
  id: string
  ad: string
  ikon: string
  renk: KonuDersId | null
  sinif: YksSinif
  konular: TakipSatiri[]
}

type Kaynak = { ders: string; bolum?: string }

export type OkulDersi = {
  id: string
  ad: string
  ikon: string
  renk: KonuDersId | null
  /** Sıra önemli: aynı bölümde önce TYT, sonra AYT konuları. */
  kaynaklar: readonly Kaynak[]
}

/** Okul dersleri, ekrandaki sırayla (okul ders çizelgesinin alışılmış sırası). */
export const OKUL_DERSLERI: readonly OkulDersi[] = [
  {
    id: 'edebiyat',
    ad: 'Türk Dili ve Edebiyatı',
    ikon: '📖',
    renk: 'turkce',
    kaynaklar: [
      { ders: 'tyt-turkce', bolum: 'Dil ve Anlatım' },
      { ders: 'ayt-edebiyat', bolum: 'Edebiyat' },
    ],
  },
  {
    id: 'matematik',
    ad: 'Matematik',
    ikon: '➗',
    renk: 'matematik',
    kaynaklar: [{ ders: 'tyt-matematik' }, { ders: 'ayt-matematik' }],
  },
  { id: 'fizik', ad: 'Fizik', ikon: '🧲', renk: 'fizik', kaynaklar: [{ ders: 'tyt-fizik' }, { ders: 'ayt-fizik' }] },
  { id: 'kimya', ad: 'Kimya', ikon: '⚗️', renk: 'kimya', kaynaklar: [{ ders: 'tyt-kimya' }, { ders: 'ayt-kimya' }] },
  {
    id: 'biyoloji',
    ad: 'Biyoloji',
    ikon: '🧬',
    renk: 'biyoloji',
    kaynaklar: [{ ders: 'tyt-biyoloji' }, { ders: 'ayt-biyoloji' }],
  },
  { id: 'tarih', ad: 'Tarih', ikon: '🏛️', renk: 'tarih', kaynaklar: [{ ders: 'tyt-tarih' }, { ders: 'ayt-tarih' }] },
  {
    id: 'cografya',
    ad: 'Coğrafya',
    ikon: '🗺️',
    renk: 'cografya',
    kaynaklar: [{ ders: 'tyt-cografya' }, { ders: 'ayt-cografya' }],
  },
  { id: 'felsefe', ad: 'Felsefe', ikon: '💭', renk: null, kaynaklar: [{ ders: 'tyt-felsefe' }, { ders: 'ayt-felsefe' }] },
  { id: 'din', ad: 'Din Kültürü', ikon: '🕌', renk: null, kaynaklar: [{ ders: 'tyt-din' }, { ders: 'ayt-din' }] },
  { id: 'yabanci-dil', ad: 'Yabancı Dil', ikon: '🌐', renk: 'ingilizce', kaynaklar: [{ ders: 'ydt' }] },
]

/**
 * Aynı sınıfta yan yana düşünce **tek satırda** birleşen TYT–AYT çiftleri:
 * `[TYT kimliği, AYT kimliği, satırın adı?]`.
 *
 * Liste AYT'de TYT konusunu tekrar yazmıyor ama bazı AYT başlıkları TYT
 * başlığının devamı ve okulda aynı ünitede, aynı sınıfta okunuyor; okul
 * listesinde iki "Fonksiyonlar" satırı çift görünüyordu.
 * - Fonksiyonlar ↔ Fonksiyonlar (Bileşke ve Dört İşlem), Polinomlar ↔
 *   Polinomlarda Kökler ve Çarpanlar: 2018'de ikisi de 10. sınıfın ünitesi.
 * - İş, Güç ve Enerji ↔ Enerji ve Hareket: aynı harita destelerine bağlı
 *   (Maarif 10).
 * - Manyetizma ↔ Manyetizma ve Elektromanyetik İndüksiyon: Maarif 11'in
 *   "Manyetik Alan ve Manyetik Kuvvet" ünitesi; satır AYT'nin geniş adını
 *   alıyor.
 *
 * Satır ilk kimliğin sırasını alıyor, iki kimliği birlikte işaretliyor.
 * Çift farklı sınıflara düşerse (Maarif'te Fonksiyonlar 10, Bileşke 11) ya
 * da AYT yarısı alan dışıysa birleşmiyor; satır tek kimlikle duruyor.
 */
export const BIRLESEN_KONULAR: readonly (readonly [string, string, string?])[] = [
  ['tyt-mat-fonksiyon', 'ayt-mat-fonksiyon'],
  ['tyt-mat-polinom', 'ayt-mat-polinom'],
  ['tyt-fiz-is-enerji', 'ayt-fiz-enerji-hareket'],
  ['tyt-fiz-manyetizma', 'ayt-fiz-induksiyon', 'Manyetizma ve Elektromanyetik İndüksiyon'],
]

/**
 * YKS dersi öğrencinin alanında görünür mü. TYT herkese. AYT dersi alanın
 * testindeyse (ÖSYM kılavuzu: Sayısal → Mat, Fen; EA → Mat, Edebiyat,
 * Tarih-1, Coğrafya-1; Sözel → Edebiyat, Tarih, Coğrafya, Felsefe Grubu,
 * Din; Dil → YDT). Alan seçilmemişse (`null`) bütün AYT dersleri görünüyor —
 * YDT hariç: o ayrı bir dil sınavı, yalnız Dil alanında.
 */
export function kaynakGorunur(ders: YksDers, alan: PuanTuru | null): boolean {
  if (!ders.alanlar) return true
  if (alan === null) return ders.id !== 'ydt'
  return ders.alanlar.includes(alan)
}

/**
 * Okul dersinin bir sınıftaki satırları: her kaynaktan o sınıfa düşen
 * konular (`sinifKonulari`, öğrencinin müfredatına göre). Bölümsüz konular
 * başta, sonra bölümler ilk göründükleri sırayla; bölüm içinde önce TYT,
 * sonra AYT. Maarif'te "henüz yok" konular hiçbir sınıfta yok.
 */
export function okulDersiSatirlari(
  okulDersi: OkulDersi,
  sinif: YksSinif,
  alan: PuanTuru | null,
  ogrenciSinifi: number,
): TakipSatiri[] {
  const parcalar: { bolum: string | null; konu: YksKonu }[] = []
  for (const kaynak of okulDersi.kaynaklar) {
    const ders = yksDersBul(kaynak.ders)
    if (!ders || !kaynakGorunur(ders, alan)) continue
    for (const konu of sinifKonulari(ders, sinif, ogrenciSinifi)) {
      const bolum = konu.bolum ?? kaynak.bolum ?? null
      parcalar.push({ bolum, konu: bolum === null ? { id: konu.id, ad: konu.ad } : { id: konu.id, ad: konu.ad, bolum } })
    }
  }

  // Bölüm sırası: bölümsüz önce, sonra ilk görünüş sırası.
  const bolumler: (string | null)[] = []
  for (const p of parcalar) if (!bolumler.includes(p.bolum)) bolumler.push(p.bolum)
  bolumler.sort((a, b) => (a === null ? -1 : b === null ? 1 : 0))
  const satirlar: TakipSatiri[] = bolumler.flatMap((b) => parcalar.filter((p) => p.bolum === b).map((p) => p.konu))

  for (const [ilk, ikinci, ad] of BIRLESEN_KONULAR) {
    const i = satirlar.findIndex((s) => s.id === ilk)
    const j = satirlar.findIndex((s) => s.id === ikinci)
    if (i === -1 || j === -1) continue
    satirlar[i] = { ...satirlar[i], ad: ad ?? satirlar[i].ad, kimlikler: [ilk, ikinci] }
    satirlar.splice(j, 1)
  }
  return satirlar
}

/** Seçili sınıfta görünen okul dersleri; o sınıfta konusu olmayan ders yok. */
export function sinifDersleri(sinif: YksSinif, alan: PuanTuru | null, ogrenciSinifi: number): TakipDersi[] {
  return OKUL_DERSLERI.flatMap((d) => {
    const konular = okulDersiSatirlari(d, sinif, alan, ogrenciSinifi)
    if (konular.length === 0) return []
    return [{ id: d.id, ad: d.ad, ikon: d.ikon, renk: d.renk, sinif, konular }]
  })
}

/** Dört sınıfın dersleri birlikte — "Devam et" ve sekme yüzdeleri için. */
export function tumSinifDersleri(alan: PuanTuru | null, ogrenciSinifi: number): TakipDersi[] {
  return YKS_SINIFLARI.flatMap((s) => sinifDersleri(s, alan, ogrenciSinifi))
}
