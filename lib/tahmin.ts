import type { Deneme, OkulYili, OsymTest, PuanTuru, Sablon } from './types'
import { obpSonucu, osymNetleri, type ObpSonucu } from './hesap'
import { sablonBul } from './sablonlar'
import {
  SON_VERI_YILI,
  olcekliNetler,
  sinavPuani,
  yerlestirmePuani,
  type Netler,
} from './puan'
import { siralamaTahmini, type SiralamaSonucu } from './siralama'

/**
 * Deneme(ler)den puan ve sıralama tahmini.
 *
 * Hem sıralama ekranı hem ana sayfa/hedef kartı aynı hesabı kullanıyor;
 * mantık tek yerde durmalı ki ikisi zamanla farklı sayı göstermesin.
 */

export type Tahmin = {
  netler: Netler
  /** Soru sayısı gerçek sınavdan farklı olduğu için oranlanan testler. */
  oranlanan: OsymTest[]
  sinavPuani: number
  yerlestirmePuani: number
  siralama: SiralamaSonucu
  aytVar: boolean
}

/**
 * Denemenin hangi tarafta seçilebileceği, şablonun `tur` alanına değil **gerçekten
 * hangi ÖSYM testlerini kapsadığına** bakılarak belirleniyor.
 *
 * Seviye tespit sınavı buna iyi bir örnek: türü "okul" ama dersleri yalnızca AYT
 * testlerine bağlı, içinde tek bir TYT testi yok. Tür üzerinden filtrelenseydi
 * TYT tarafında da seçilebilir ve seçildiğinde bütün TYT netleri sıfır sayılıp
 * puan gerçeğin çok altına düşerdi.
 */
function testleriniKapsiyorMu(deneme: Deneme, sablonlar: Sablon[], onek: 'tyt-' | 'ayt'): boolean {
  return sablonBul(sablonlar, deneme.sablonId).dersler.some((ders) => {
    if (!ders.osymTesti) return false
    return onek === 'tyt-'
      ? ders.osymTesti.startsWith('tyt-')
      : ders.osymTesti.startsWith('ayt-') || ders.osymTesti === 'ydt'
  })
}

export function tytAdaylari(denemeler: Deneme[], sablonlar: Sablon[]): Deneme[] {
  return denemeler.filter((d) => testleriniKapsiyorMu(d, sablonlar, 'tyt-'))
}

export function aytAdaylari(denemeler: Deneme[], sablonlar: Sablon[]): Deneme[] {
  return denemeler.filter((d) => testleriniKapsiyorMu(d, sablonlar, 'ayt'))
}

/** Listedeki en yeni deneme. */
export function enYeni(denemeler: Deneme[]): Deneme | undefined {
  if (denemeler.length === 0) return undefined
  return [...denemeler].sort((a, b) => b.tarih.localeCompare(a.tarih))[0]
}

/** Elle girilen OBP varsa o kullanılır; yoksa yıl notlarından tahmin edilir. */
export function obpHesapla(
  okulYillari: OkulYili[],
  elleObp: number | null = null,
): ObpSonucu | null {
  return obpSonucu(okulYillari, elleObp)
}

/**
 * Seçilen TYT ve AYT denemesinden tahmin üretir. İkisi de yoksa null döner.
 * Aynı deneme her iki tarafta da seçilebilir (seviye tespit sınavı gibi ikisini de
 * kapsayan şablonlarda bu normaldir).
 */
export function tahminUret({
  tytDenemesi,
  aytDenemesi,
  sablonlar,
  tur,
  obp,
  yil = SON_VERI_YILI,
}: {
  tytDenemesi: Deneme | undefined
  aytDenemesi: Deneme | undefined
  sablonlar: Sablon[]
  tur: PuanTuru
  obp: number | null
  yil?: number
}): Tahmin | null {
  if (!tytDenemesi && !aytDenemesi) return null

  const ham: Netler = {}
  const sablonSorulari: Partial<Record<OsymTest, number>> = {}
  const gorulen = new Set<string>()

  for (const deneme of [tytDenemesi, aytDenemesi]) {
    if (!deneme || gorulen.has(deneme.id)) continue
    gorulen.add(deneme.id)

    const sablon = sablonBul(sablonlar, deneme.sablonId)

    // Soru sayıları önce bu deneme içinde toplanır (TYT Sosyal gibi bloklarda
    // dört ders aynı teste bağlı), sonra birleşik haritaya **yazılır**.
    // Toplanarak yazılsaydı, aynı testi içeren iki deneme seçildiğinde soru
    // sayısı ikiye katlanır ve net yarıya düşerdi.
    const buDenemeninSorulari: Partial<Record<OsymTest, number>> = {}
    for (const ders of sablon.dersler) {
      if (!ders.osymTesti) continue
      buDenemeninSorulari[ders.osymTesti] =
        (buDenemeninSorulari[ders.osymTesti] ?? 0) + ders.soruSayisi
    }

    for (const [test, net] of Object.entries(osymNetleri(deneme, sablon)) as [
      OsymTest,
      number,
    ][]) {
      ham[test] = net
      sablonSorulari[test] = buDenemeninSorulari[test]
    }
  }

  const { netler, oranlanan } = olcekliNetler(ham, sablonSorulari)
  const yp = yerlestirmePuani(tur, netler, obp, yil)

  return {
    netler,
    oranlanan,
    sinavPuani: sinavPuani(tur, netler, yil),
    yerlestirmePuani: yp,
    siralama: siralamaTahmini(yp, tur),
    aytVar: aytDenemesi !== undefined,
  }
}

/** Ana sayfa ve hedef kartı için: en yeni denemelerden otomatik tahmin. */
export function guncelTahmin(
  denemeler: Deneme[],
  sablonlar: Sablon[],
  okulYillari: OkulYili[],
  tur: PuanTuru | null,
  elleObp: number | null = null,
): Tahmin | null {
  // Alan seçilmemişse sıralama hesaplanamaz: puan türü katsayıları da,
  // yerleştirme dağılımı da türe bağlı. Bir tür varsayıp hesaplamak ana
  // sayfada kullanıcının hiç söylemediği bir sıralama gösterirdi.
  if (tur === null) return null
  return tahminUret({
    tytDenemesi: enYeni(tytAdaylari(denemeler, sablonlar)),
    aytDenemesi: enYeni(aytAdaylari(denemeler, sablonlar)),
    sablonlar,
    tur,
    obp: obpHesapla(okulYillari, elleObp)?.obp ?? null,
  })
}
