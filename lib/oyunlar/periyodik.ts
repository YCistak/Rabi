import {
  ELEMENTLER,
  ILK_YIRMI,
  SORU_HAVUZU,
  tabloKonumu,
  type Element,
  type SorulanElement,
} from './periyodik-havuzu'
import { karistir, sec } from './tur'

/**
 * Periyodik Tablo oyununun soru mantığı.
 *
 * Havuz `periyodik-havuzu.ts`, tur sırası ve boss yerleşimi `ritim.ts`; burada
 * yalnızca "bu element nasıl sorulur" ve "yanlış şık ne olmalı" kararları var.
 *
 * Bir element bir **el**: ilk 20'deyse iki aşama (önce adı, doğruysa hemen
 * ardından sembolü), değilse tek aşama (ad da verilir, yalnızca sembol
 * sorulur). Aşamalar ele bağlı çünkü ikincisi ancak birincisi doğru
 * bilindiğinde soruluyor — ayrı sorular olsalardı sıra bozulurdu.
 */

/** Şık sayısı ikiye sabit: soru zaten "biliyor musun", eleme değil. */
export const SIK_SAYISI = 2

export type PeriyodikAsamasi = 'ad' | 'sembol'

export type PeriyodikSorusu = {
  element: SorulanElement
  asama: PeriyodikAsamasi
  /** İki şık, karışık sırayla: doğrusu ve bir çeldirici. */
  siklar: string[]
}

export type PeriyodikEli = {
  element: SorulanElement
  /** Sırayla sorulacak aşamalar; ilk 20'de iki, sonrasında bir tane. */
  asamalar: PeriyodikSorusu[]
}

export function ilkYirmiMi(element: Element): boolean {
  return element.numara <= ILK_YIRMI
}

export function dogruCevap(soru: PeriyodikSorusu): string {
  return soru.asama === 'ad' ? soru.element.ad : soru.element.sembol
}

/**
 * Türkçe harfleri Latin karşılıklarına indirger.
 *
 * Sembolleri elementin **Türkçe adıyla** karşılaştırmak için gerekiyor: Cıva
 * "C" ile, Çinko yine "C" ile, Kükürt "K" ile başlar ama JavaScript'in
 * varsayılan küçültmesi "I"yı "i" yapıp "İ"yi noktalı bir çifte çevirdiği için
 * bu karşılaştırmalar sessizce yanlış sonuç verirdi.
 */
function sadeles(metin: string): string {
  return metin
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ç/gi, 'c')
    .replace(/ğ/gi, 'g')
    .replace(/ö/gi, 'o')
    .replace(/ş/gi, 's')
    .replace(/ü/gi, 'u')
    .toLowerCase()
}

/**
 * En yüksek puanı alan adaylar.
 *
 * Çeldirici seçimi "en iyisini bul" değil "en iyi kümeden birini çek": tek bir
 * en iyi seçilseydi aynı element her sorulduğunda aynı yanlış şık gelir ve
 * oyuncu birkaç turda ikiliyi ezberlerdi.
 */
function enIyiler<T>(adaylar: readonly T[], puan: (aday: T) => number): T[] {
  let enYuksek = -1
  let secilenler: T[] = []
  for (const aday of adaylar) {
    const p = puan(aday)
    if (p > enYuksek) {
      enYuksek = p
      secilenler = [aday]
    } else if (p === enYuksek) {
      secilenler.push(aday)
    }
  }
  return secilenler
}

/**
 * "Adı hangisi?" sorusunun yanlış şıkkı.
 *
 * Rastgele bir element adı işe yaramazdı: 17 numara sorulup şıklara "Altın"
 * konsaydı, tabloya bakan biri 17'nin halojen sütununda durduğunu görüp
 * elerdi. En iyi çeldirici **aynı gruptan** olanı: konum ipucu vermiyor,
 * elementi gerçekten bilmek gerekiyor. Sonra aynı bölge, sonra komşu numara
 * geliyor.
 */
export function adCeldiricisi(
  element: Element,
  havuz: readonly Element[] = SORU_HAVUZU,
  rastgele: () => number = Math.random,
): string {
  const kaynak = havuz.length > 1 ? havuz : ELEMENTLER
  const adaylar = kaynak.filter((a) => a.numara !== element.numara)
  if (adaylar.length === 0) return ''

  const sutun = tabloKonumu(element.numara).sutun
  return sec(
    enIyiler(adaylar, (aday) => {
      if (tabloKonumu(aday.numara).sutun === sutun) return 3
      if (aday.bolge === element.bolge) return 2
      if (Math.abs(aday.numara - element.numara) <= 4) return 1
      return 0
    }),
    rastgele,
  ).ad
}

/**
 * "Sembolü hangisi?" sorusunun yanlış şıkkı.
 *
 * Öğrencinin gerçekten yaptığı hata belli: sembolü Türkçe addan türetmek —
 * bakıra "Ba", altına "Al", kurşuna "K" demek. Bunlar aynı zamanda **başka
 * elementlerin gerçek sembolleri** olduğu için çeldirici uydurmaya gerek yok;
 * en yüksek puan tam bu duruma veriliyor.
 *
 * Adaylar 118'in tamamından geliyor, sorulan elementlerden değil: "Flor"un en
 * iyi çeldiricisi Flerovyum'un "Fl"si ve o element hiç sorulmuyor.
 */
export function sembolCeldiricisi(
  element: Element,
  rastgele: () => number = Math.random,
): string {
  const ad = sadeles(element.ad)
  const adaylar = ELEMENTLER.filter((a) => a.numara !== element.numara)

  return sec(
    enIyiler(adaylar, (aday) => {
      const sembol = sadeles(aday.sembol)
      if (ad.startsWith(sembol)) return 3
      if (ad.startsWith(sembol[0])) return 2
      if (aday.bolge === element.bolge || Math.abs(aday.numara - element.numara) <= 3) return 1
      return 0
    }),
    rastgele,
  ).sembol
}

export function asamaKur(
  element: SorulanElement,
  asama: PeriyodikAsamasi,
  havuz: readonly SorulanElement[] = SORU_HAVUZU,
  rastgele: () => number = Math.random,
): PeriyodikSorusu {
  const dogru = asama === 'ad' ? element.ad : element.sembol
  const celdirici =
    asama === 'ad' ? adCeldiricisi(element, havuz, rastgele) : sembolCeldiricisi(element, rastgele)
  return { element, asama, siklar: karistir([dogru, celdirici], rastgele) }
}

/** Bir elementin bütün aşamaları, sorulacak sırayla. */
export function eliKur(
  element: SorulanElement,
  havuz: readonly SorulanElement[] = SORU_HAVUZU,
  rastgele: () => number = Math.random,
): PeriyodikEli {
  const asamalar: PeriyodikAsamasi[] = ilkYirmiMi(element) ? ['ad', 'sembol'] : ['sembol']
  return {
    element,
    asamalar: asamalar.map((asama) => asamaKur(element, asama, havuz, rastgele)),
  }
}
