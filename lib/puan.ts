import type { OsymTest, PuanTuru } from './types'
import { OSYM_TEST_SORU } from './sablonlar'
import { yuvarla } from './hesap'
import veri from './veri/yks-veri.json'

/**
 * YKS puan hesabı — ÖSYM'nin kendi yöntemi.
 *
 * Kaynak: 2026-YKS Kılavuzu, madde 3.10.1 "Sınav Puanları Nasıl Hesaplanacaktır?"
 *
 *   1. Ham puan   = doğru − yanlış/4
 *   2. Standart puan = 50 + 10 × (ham − ortalama) / standart sapma
 *      (ortalama ve standart sapma: o yıl son sınıfta okuyan adayların değerleri)
 *   3. Ağırlıklı puan = Σ (ağırlık × standart puan)   — Tablo 1C ve 1E
 *   4. "Ağırlıklı puanlar kendi içinde en küçüğü 100, en büyüğü 500 olan
 *      puanlara dönüştürülür" → doğrusal ölçekleme
 *
 * Uygulamanın tek varsayımı 4. adımdaki ölçeğin uçları: ÖSYM o yılın gerçek en
 * küçük/en büyük ağırlıklı puanını kullanıyor, bunlar yayınlanmıyor. Burada üst
 * uç "tam net yapan aday", alt uç ise yayınlanmış puan dağılımının ortalamasına
 * oturtularak çözülüyor (bkz. `olcek`). Bu yüzden sonuç **tahmindir**.
 */

// --- Tablo 1C: TYT puan türünde testlerin ağırlıkları (%) ---
export const TYT_AGIRLIK: Partial<Record<OsymTest, number>> = {
  'tyt-turkce': 33,
  'tyt-sosyal': 17,
  'tyt-mat': 33,
  'tyt-fen': 17,
}

/**
 * Tablo 1E: SAY/EA/SÖZ/DİL puan türlerinde testlerin ağırlıkları (%).
 * `tyt` anahtarı, ağırlıklı TYT puanının (A-TYT) payıdır — dört TYT testi
 * önce kendi içinde birleşip sonra bu oranla giriyor.
 */
export const TUR_AGIRLIK: Record<
  Exclude<PuanTuru, never>,
  { tyt: number } & Partial<Record<OsymTest, number>>
> = {
  say: { tyt: 40, 'ayt-mat': 30, 'ayt-fizik': 10, 'ayt-kimya': 10, 'ayt-biyoloji': 10 },
  ea: { tyt: 40, 'ayt-mat': 30, 'ayt-edebiyat': 18, 'ayt-tarih1': 7, 'ayt-cografya1': 5 },
  soz: {
    tyt: 40,
    'ayt-edebiyat': 18,
    'ayt-tarih1': 7,
    'ayt-cografya1': 5,
    'ayt-tarih2': 8,
    'ayt-cografya2': 8,
    'ayt-felsefe': 9,
    'ayt-din': 5,
  },
  dil: { tyt: 40, ydt: 60 },
}

/** OBP, yerleştirme puanına bu katsayıyla eklenir (2026-YKS Kılavuzu). */
export const OBP_KATSAYI = 0.12

/**
 * Daha önce bir yükseköğretim programına yerleşmiş adaylarda OBP katkısı
 * yarıya iner. Uygulama şimdilik yalnızca ilk kez girenleri varsayıyor.
 */
export const OBP_KATSAYI_YERLESMIS = 0.06

export type YilVerisi = {
  istatistik: Partial<Record<OsymTest, [number, number]>>
  sinav: Record<string, [number, number][]>
  yerlestirme: Record<string, [number, number][]>
}

const YILLAR = veri.yillar as unknown as Record<string, YilVerisi>

/** Veri bulunan yıllar, eskiden yeniye. */
export const VERI_YILLARI: number[] = Object.keys(YILLAR)
  .map(Number)
  .sort((a, b) => a - b)

export const SON_VERI_YILI = VERI_YILLARI[VERI_YILLARI.length - 1]

export function yilVerisi(yil: number): YilVerisi {
  const bulunan = YILLAR[String(yil)]
  if (!bulunan) throw new Error(`${yil} için YKS verisi yok.`)
  return bulunan
}

export type Netler = Partial<Record<OsymTest, number>>

/** Standart puan: ortalaması 50, standart sapması 10. */
export function standartPuan(net: number, ortalama: number, sapma: number): number {
  if (sapma <= 0) return 50
  return 50 + (10 * (net - ortalama)) / sapma
}

/** Ağırlıklı TYT puanı (A-TYT). */
export function agirlikliTyt(netler: Netler, yil: number): number {
  const { istatistik } = yilVerisi(yil)
  let toplam = 0
  for (const [test, agirlik] of Object.entries(TYT_AGIRLIK) as [OsymTest, number][]) {
    const ist = istatistik[test]
    if (!ist) continue
    toplam += (agirlik / 100) * standartPuan(netler[test] ?? 0, ist[0], ist[1])
  }
  return toplam
}

/** Puan türüne göre ağırlıklı puan (A-SAY / A-EA / A-SÖZ / A-DİL veya A-TYT). */
export function agirlikliPuan(tur: PuanTuru | 'tyt', netler: Netler, yil: number): number {
  if (tur === 'tyt') return agirlikliTyt(netler, yil)

  const { istatistik } = yilVerisi(yil)
  const agirliklar = TUR_AGIRLIK[tur]
  let toplam = (agirliklar.tyt / 100) * agirlikliTyt(netler, yil)

  for (const [anahtar, agirlik] of Object.entries(agirliklar)) {
    if (anahtar === 'tyt') continue
    const test = anahtar as OsymTest
    const ist = istatistik[test]
    if (!ist) continue
    toplam += (agirlik / 100) * standartPuan(netler[test] ?? 0, ist[0], ist[1])
  }
  return toplam
}

/** Puan türünün kapsadığı testler. */
export function turTestleri(tur: PuanTuru | 'tyt'): OsymTest[] {
  const tytler = Object.keys(TYT_AGIRLIK) as OsymTest[]
  if (tur === 'tyt') return tytler
  const digerleri = Object.keys(TUR_AGIRLIK[tur]).filter((k) => k !== 'tyt') as OsymTest[]
  return [...tytler, ...digerleri]
}

/**
 * Yayınlanmış yığınsal dağılımdan ortalama puan.
 * Kovalar 20 puanlık; her kova orta noktasıyla temsil ediliyor.
 */
export function dagilimOrtalamasi(noktalar: [number, number][]): number {
  // Yüksek eşikten düşüğe: her adımda o kovaya düşen aday sayısı bulunur.
  const inen = [...noktalar].sort((a, b) => b[0] - a[0])
  let agirlikli = 0
  let oncekiSayi = 0

  for (let i = 0; i < inen.length; i++) {
    const [esik, sayi] = inen[i]
    const ust = i > 0 ? inen[i - 1][0] : esik + 20
    agirlikli += (sayi - oncekiSayi) * ((esik + ust) / 2)
    oncekiSayi = sayi
  }

  const toplamAday = inen.length > 0 ? inen[inen.length - 1][1] : 0
  return toplamAday > 0 ? agirlikli / toplamAday : 0
}

export type Olcek = { enKucuk: number; enBuyuk: number }

/**
 * Ağırlıklı puanı 100–500'e çeviren ölçeğin uçları.
 *
 * Üst uç: bütün testlerde tam net yapan adayın ağırlıklı puanı — o yıl 500 alan
 * aday zaten tam nete çok yakın olduğu için iyi bir yaklaşım.
 *
 * Alt uç: doğrudan bilinemiyor. Ortalama netli bir adayın ağırlıklı puanı
 * tanımı gereği tam 50'dir (her testin standart puanı ortalamada 50, ağırlıklar
 * toplamı %100). Bu adayın puanı da yayınlanmış dağılımın ortalaması olmalı;
 * denklem alt uç için çözülüyor.
 *
 * Üç puan türü için bağımsız çözüldüğünde birbirine çok yakın değerler çıkması
 * (2026: 35,2–35,9) modelin tutarlı olduğunu gösteriyor.
 */
export function olcek(tur: PuanTuru | 'tyt', yil: number): Olcek {
  const { sinav } = yilVerisi(yil)
  const noktalar = sinav[tur]
  const ortalamaPuan = dagilimOrtalamasi(noktalar)

  const tamNetler: Netler = {}
  for (const test of turTestleri(tur)) tamNetler[test] = OSYM_TEST_SORU[test]
  const enBuyuk = agirlikliPuan(tur, tamNetler, yil)

  // 100 + 400 × (50 − enKucuk) / (enBuyuk − enKucuk) = ortalamaPuan
  const oran = (ortalamaPuan - 100) / 400
  const enKucuk = (50 - oran * enBuyuk) / (1 - oran)

  return { enKucuk, enBuyuk }
}

/** Ağırlıklı puanı 100–500 aralığına çevirir. */
export function olcekle(agirlikli: number, { enKucuk, enBuyuk }: Olcek): number {
  if (enBuyuk <= enKucuk) return 100
  const puan = 100 + (400 * (agirlikli - enKucuk)) / (enBuyuk - enKucuk)
  return Math.min(500, Math.max(100, puan))
}

/** Netlerden sınav puanı (TYT / SAY / EA / SÖZ / DİL). */
export function sinavPuani(tur: PuanTuru | 'tyt', netler: Netler, yil = SON_VERI_YILI): number {
  return yuvarla(olcekle(agirlikliPuan(tur, netler, yil), olcek(tur, yil)), 2)
}

/**
 * Yerleştirme puanı = sınav puanı + OBP × 0,12.
 * OBP 250–500 aralığında bir sayıdır (diploma notu × 5).
 */
export function yerlestirmePuani(
  tur: PuanTuru | 'tyt',
  netler: Netler,
  obp: number | null,
  yil = SON_VERI_YILI,
): number {
  const temel = sinavPuani(tur, netler, yil)
  if (obp === null) return temel
  return yuvarla(temel + obp * OBP_KATSAYI, 2)
}

export type OlcekliNetler = {
  netler: Netler
  /** Soru sayısı gerçek sınavdan farklı olduğu için oranlanan testler. */
  oranlanan: OsymTest[]
}

/**
 * Denemenin netlerini gerçek sınav ölçeğine çevirir.
 *
 * Okul denemesinde Matematik 30 soru, AYT'de 40. Neti doğrudan kullanmak puanı
 * olduğundan düşük gösterirdi; net, soru sayısı oranıyla büyütülüyor
 * (30 soruda 24 net → 40 soruda 32 net varsayımı). Bu bir varsayım olduğu için
 * hangi testlerin oranlandığı geri döndürülüyor ve arayüzde yazılıyor.
 */
export function olcekliNetler(
  hamNetler: Netler,
  sablonSoruSayilari: Partial<Record<OsymTest, number>>,
): OlcekliNetler {
  const netler: Netler = {}
  const oranlanan: OsymTest[] = []

  for (const [anahtar, net] of Object.entries(hamNetler) as [OsymTest, number][]) {
    const gercek = OSYM_TEST_SORU[anahtar]
    const sablonda = sablonSoruSayilari[anahtar]

    if (!sablonda || sablonda === gercek) {
      netler[anahtar] = net
      continue
    }

    netler[anahtar] = yuvarla((net * gercek) / sablonda)
    oranlanan.push(anahtar)
  }

  return { netler, oranlanan }
}

/** Puan hesabı için o türün en az bir AYT/YDT testinde veri olmalı. */
export function aytVerisiVarMi(tur: PuanTuru, netler: Netler): boolean {
  if (tur === 'dil') return (netler.ydt ?? 0) > 0
  const aytTestleri = Object.keys(TUR_AGIRLIK[tur]).filter((k) => k !== 'tyt') as OsymTest[]
  return aytTestleri.some((t) => (netler[t] ?? 0) > 0)
}
