import type { KavramEsi, KavramKonusu } from './kavram-havuzu'
import { KAVRAM_HAVUZU } from './kavram-havuzu'
import { karistir, sec } from './tur'

/**
 * Kavram eşleştirme oyununun tahta kurucusu.
 *
 * Bir "tahta" solda üç kavram, sağda beş tanım: üçü bu kavramlara ait, ikisi
 * **çeldirici**. Üç eşleşme yapılınca iki tanım açıkta kalıyor ve yeni tahta
 * geliyor.
 *
 * Çeldirici neden var: her tanımın bir karşılığı olsaydı son eşleştirme
 * kendiliğinden doğru olurdu — iki kavramı bilen üçüncüsünü bilmeden
 * tamamlardı. Açıkta kalan iki tanım bu bedavayı kaldırıyor.
 *
 * Çeldiriciler **aynı konudan** seçiliyor. Başka konudan gelselerdi ("Balbal"
 * tanımı Osmanlı vergilerinin arasında) göze batar, okumadan elenirdi.
 */

/** Tahtadaki kavram sayısı. */
export const KAVRAM_SAYISI = 3

/** Karşılığı olmayan tanım sayısı. */
export const CELDIRICI_SAYISI = 2

/** Sağ sütundaki toplam tanım sayısı. */
export const TANIM_SAYISI = KAVRAM_SAYISI + CELDIRICI_SAYISI

export type KavramTahtasi = {
  /** Tahta tek konudan kurulduysa o konu; karışıksa null. */
  konu: KavramKonusu | null
  /** Eşleştirilecek üç çift. */
  esler: KavramEsi[]
  /** Ekrandaki sıraya göre karıştırılmış kavramlar. */
  kavramlar: string[]
  /** Üç doğru tanım ile iki çeldirici, karışık. */
  tanimlar: string[]
}

/**
 * Sıradaki tahta.
 *
 * `kullanilan`, tur boyunca sorulmuş kavramlar — aynı kavram bir turda iki kez
 * sorulmasın diye. Çeldiriciler bu kısıtın dışında: bir kavramın tanımı bu
 * tahtada çeldirici olarak durup sonraki tahtada sorulabilir, hatta bu iyidir —
 * oyuncu bir kez okuduğu tanımı hatırlamak zorunda kalır.
 *
 * Havuz tükenince `null` dönüyor ve tur erken bitiyor.
 */
export function tahtaHazirla(
  kullanilan: ReadonlySet<string> = new Set(),
  havuz: readonly KavramEsi[] = KAVRAM_HAVUZU,
  rastgele: () => number = Math.random,
  /**
   * Çeldiricilerin geldiği havuz — varsayılan olarak soruların havuzu.
   *
   * Ayrı verilebiliyor çünkü zorluk süzgeci **sorulan** kavramlar için var,
   * çeldiriciler için değil: çeldirici cevaplanmıyor, yalnızca yanıltıyor.
   * Süzülmüş havuzla kurulsalardı küçük konularda beş kavram kalmaz, tahta
   * konu bütünlüğünü kaybederdi — asıl zorluk oradan geliyor.
   */
  celdiriciHavuzu: readonly KavramEsi[] = havuz,
): KavramTahtasi | null {
  const kalan = havuz.filter((e) => !kullanilan.has(e.kavram))
  if (kalan.length < KAVRAM_SAYISI || celdiriciHavuzu.length < TANIM_SAYISI) return null

  // Konu bazında: sorulacak üç kavram için yeterli **kullanılmamış** kavram,
  // çeldiriciler için de yeterli toplam kavram olmalı.
  const konular = new Map<KavramKonusu, KavramEsi[]>()
  for (const es of kalan) {
    const liste = konular.get(es.konu)
    if (liste) liste.push(es)
    else konular.set(es.konu, [es])
  }

  const uygunKonular = [...konular.entries()].filter(
    ([konu, esler]) =>
      esler.length >= KAVRAM_SAYISI &&
      celdiriciHavuzu.filter((e) => e.konu === konu).length >= TANIM_SAYISI,
  )

  const [konu, kaynak] =
    uygunKonular.length > 0 ? sec(uygunKonular, rastgele) : ([null, kalan] as [null, KavramEsi[]])

  const esler = karistir(kaynak, rastgele).slice(0, KAVRAM_SAYISI)
  if (esler.length < KAVRAM_SAYISI) return null

  // Çeldiriciler: aynı konudan, tahtadaki üç kavramın dışından. Konu tek başına
  // yetmezse (karışık tahta) bütün havuz kullanılıyor.
  const secilenKavramlar = new Set(esler.map((e) => e.kavram))
  const celdiriciKaynak = celdiriciHavuzu.filter(
    (e) => (konu === null || e.konu === konu) && !secilenKavramlar.has(e.kavram),
  )
  const celdiriciler = karistir(celdiriciKaynak, rastgele).slice(0, CELDIRICI_SAYISI)
  if (celdiriciler.length < CELDIRICI_SAYISI) return null

  return {
    konu,
    esler,
    kavramlar: karistir(esler.map((e) => e.kavram), rastgele),
    tanimlar: karistir([...esler, ...celdiriciler].map((e) => e.tanim), rastgele),
  }
}

/** Seçilen kavram ile tanım aynı eşe mi ait. */
export function eslesiyorMu(tahta: KavramTahtasi, kavram: string, tanim: string): boolean {
  return tahta.esler.some((e) => e.kavram === kavram && e.tanim === tanim)
}

/** Bir kavramın doğru tanımı — yanlış eşleştirmede doğrusunu göstermek için. */
export function taniminiBul(tahta: KavramTahtasi, kavram: string): string | null {
  return tahta.esler.find((e) => e.kavram === kavram)?.tanim ?? null
}

/** Bir tanımın sahibi; çeldiricide null döner — "bu tanım kimseye ait değildi" demek için. */
export function tanimSahibi(tahta: KavramTahtasi, tanim: string): string | null {
  return tahta.esler.find((e) => e.tanim === tanim)?.kavram ?? null
}
