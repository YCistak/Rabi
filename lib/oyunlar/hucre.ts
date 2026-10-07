import type { HucreKaydi, OrganelSorusu } from './hucre-havuzu'
import { HUCRE_HAVUZU } from './hucre-havuzu'
import { siklariKur as coktanSecmeliSik, SIK_SAYISI, type Sik } from './coktan-secmeli'
import { karistir } from './tur'

/**
 * Hücre ve Organeller oyununun mantığı.
 *
 * Canlıları Sınıflandırma ile aynı mekanik: bir soru cümlesi, dört şık, biri
 * doğru. Puan yok, doğru sayısı var — öteki oyunlarla aynı ölçü.
 *
 * Çeldiriciler sorunun kendi listesinden (`karistirilan`) çekiliyor, bütün
 * organellerden değil: bazı yapılar birbirinin parçası ve rastgele çekilseydi
 * aynı soruya iki doğru şık düşebilirdi (`hucre-havuzu.ts`).
 */

export { SIK_SAYISI }

export type HucreSikki = Sik<string>
export type HucreOyunSorusu = { soru: OrganelSorusu; siklar: HucreSikki[] }

/** Havuzdaki bütün yapı adları — çeldirici listesi bunlardan oluşmalı. */
export const ORGANELLER = HUCRE_HAVUZU.map((s) => s.organel)

/** Bir sorunun şıkları: doğru yapı + sorunun listesinden üç çeldirici, karışık sırada. */
export function siklariKur(
  soru: OrganelSorusu,
  rastgele: () => number = Math.random,
): HucreSikki[] {
  return coktanSecmeliSik(soru.organel, soru.karistirilan, (ad) => ad, rastgele)
}

/**
 * Turun soruları.
 *
 * `karistirilsin` yalnızca sıra **dışarıda** kurulduğunda kapatılıyor:
 * Ekran şeritleri ayrı ayrı eşliyor ve sıralarını koruması gerekiyor: yeniden
 * karıştırmak aynı `sira` numarasını üç şeritte farklı yerlere düşürürdü.
 */
export function turHazirla(
  havuz: readonly OrganelSorusu[] = HUCRE_HAVUZU,
  rastgele: () => number = Math.random,
  karistirilsin = true,
): HucreOyunSorusu[] {
  const sira = karistirilsin ? karistir(havuz, rastgele) : havuz
  return sira.map((soru) => ({ soru, siklar: siklariKur(soru, rastgele) }))
}

/**
 * Banka kaydından sorulabilir soru.
 *
 * Önce havuza bakılıyor, kayda değil: havuzda düzeltilen bir soru ya da
 * çeldirici bankadaki eski kopyada yanlış kalmaya devam ederdi. İpuçlu kart
 * döneminin kayıtları (`soru` alanı yok) da böylece yeni biçimde soruluyor.
 *
 * Havuzdan düşmüş bir yapının kaydı ancak kendi sorusunu ve en az üç
 * çeldiricisini taşıyorsa sorulabiliyor; taşımıyorsa `undefined` — eksik
 * şıklı bir soru kurmaktansa hiç sorulmaması iyi.
 */
export function kayittanSoru(kayit: HucreKaydi): OrganelSorusu | undefined {
  const havuzdaki = HUCRE_HAVUZU.find((s) => s.organel === kayit.organel)
  if (havuzdaki) return havuzdaki
  if (
    typeof kayit.soru === 'string' &&
    Array.isArray(kayit.karistirilan) &&
    kayit.karistirilan.length >= SIK_SAYISI - 1
  ) {
    return {
      organel: kayit.organel,
      soru: kayit.soru,
      karistirilan: kayit.karistirilan,
      aciklama: kayit.aciklama ?? '',
      zorluk: kayit.zorluk ?? 'orta',
    }
  }
  return undefined
}
