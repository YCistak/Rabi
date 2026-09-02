/**
 * İklim Kuşakları'na özgü kısım: şıklar ve haritadaki işaret.
 *
 * Havuz `iklim-havuzu.ts`, harita `dunya-havuzu.ts`, tur sırası ve boss
 * yerleşimi `ritim.ts` içinde; burada yalnızca "bu bölge nasıl sorulur" kararı
 * duruyor.
 */

import { siklariKur as secenekleriKur, type Sik } from './coktan-secmeli'
import { noktayaCevir, ulkeBul, type DunyaUlkesi } from './dunya-havuzu'
import {
  IKLIM_ADI,
  IKLIM_HAVUZU,
  KARISTIRILAN,
  type IklimSorusu,
  type IklimTipi,
} from './iklim-havuzu'
import { karistir } from './tur'

export { SIK_SAYISI } from './coktan-secmeli'

export type IklimSikki = Sik<IklimTipi>
export type IklimOyunSorusu = { soru: IklimSorusu; siklar: IklimSikki[] }

/** Adından soruyu bulur — banka kayıtları yalnızca bölge adını saklıyor. */
export function iklimBul(ad: string): IklimSorusu | undefined {
  return IKLIM_HAVUZU.find((s) => s.ad === ad)
}

/**
 * Bir sorunun şıkları.
 *
 * Seçenek kümesi bütün iklim tipleri değil, o iklimle **karıştırılanlar**
 * (`KARISTIRILAN`): on bir tipten rastgele üçü çekilseydi soruların çoğu
 * haritaya bakmadan elenebilirdi — Grönland'ın yanında Ekvatoral iklim yazan
 * bir şık kimseyi düşündürmez.
 */
export function siklariKur(
  soru: IklimSorusu,
  rastgele: () => number = Math.random,
): IklimSikki[] {
  return secenekleriKur(
    soru.iklim,
    [soru.iklim, ...KARISTIRILAN[soru.iklim]],
    (tip) => IKLIM_ADI[tip],
    rastgele,
  )
}

/**
 * Turun soruları.
 *
 * `karistirilsin` yalnızca sıra **dışarıda** kurulduğunda kapatılıyor:
 * `ritim.ts` boss sorularını belirli konumlara yerleştiriyor, burada yeniden
 * karıştırmak o yerleşimi bozardı.
 */
export function turHazirla(
  havuz: readonly IklimSorusu[],
  rastgele: () => number = Math.random,
  karistirilsin = true,
): IklimOyunSorusu[] {
  const sira = karistirilsin ? karistir(havuz, rastgele) : havuz
  return sira.map((soru) => ({ soru, siklar: siklariKur(soru, rastgele) }))
}

/** Haritada boyanacak ülke; bölge sorularında yok. */
export function soruUlkesi(soru: IklimSorusu): DunyaUlkesi | undefined {
  return soru.ulke === null ? undefined : ulkeBul(soru.ulke)
}

/** İşaret halkasının kutu koordinatı. */
export function isaretNoktasi(soru: IklimSorusu): [number, number] {
  return noktayaCevir(soru.nokta[0], soru.nokta[1])
}

/**
 * Haritada çizilen enlem çizgileri.
 *
 * Süs değil sorunun yarısı: iklim tiplerinin çoğu enleme bağlı ve öğrencinin
 * kurması gereken bağ "bu bölge hangi kuşakta". Dönenceler ile kutup daireleri
 * olmadan harita yalnızca bir şekil oluyor.
 */
export const ENLEM_CIZGILERI: { enlem: number; ad: string }[] = [
  { enlem: 66.5, ad: 'Kuzey Kutup Dairesi' },
  { enlem: 23.5, ad: 'Yengeç Dönencesi' },
  { enlem: 0, ad: 'Ekvator' },
  { enlem: -23.5, ad: 'Oğlak Dönencesi' },
  // Güney Kutup Dairesi haritada yok: kesim enlemi (-56°) onun kuzeyinde
  // kalıyor ve olmayan bir çizgiyi çizmek haritayı yanlış gösterirdi.
]
