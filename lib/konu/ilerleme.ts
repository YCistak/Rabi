import type { BilgiKarti, DersProgrami, Konu, KonuDersId, KonuSinifi, Tema } from './tip'

/**
 * Konu Anlatımı'nın kayıtları — saf mantık, React'e bağlı değil.
 *
 * İki ayrı şey tutuluyor: hangi konunun destesi bitirildi (`KonuIlerlemesi`)
 * ve kullanıcının "bilmiyorum" dediği kartlar (`BilinmeyenKart`).
 */

export type KonuIlerlemesi = {
  /** Kullanıcının "biliyorum" dediği kart sayısı. */
  bilinen: number
  /** "Bilmiyorum" dediği kart sayısı. */
  bilinmeyen: number
  /** Destenin sonuna gelindi mi — haritadaki tamamlanma işareti buna bakar. */
  bitti: boolean
  /** Son okuma günü, 'YYYY-AA-GG'. */
  tarih: string
}

export type KonuIlerlemeleri = Record<string, KonuIlerlemesi>

/**
 * Bilinmeyenler bankasındaki tek kart.
 *
 * Kartın **metni kaydın içinde** duruyor, yalnızca kimliği değil. İçerik
 * dosyaları güncellendiğinde kart kimlikleri kayabilir (`tip.ts`); metin
 * burada olduğu için kullanıcının kaydettiği bilgi o zaman da yerinde kalır.
 * Kimlik yalnızca aynı kartın ikinci kez eklenmesini önlemeye yarıyor.
 */
export type BilinmeyenKart = {
  id: string
  konuId: string
  konuAdi: string
  ders: KonuDersId
  sinif: KonuSinifi
  baslik: string
  metin: string
  /** Bankaya eklendiği gün, 'YYYY-AA-GG'. */
  tarih: string
}

/**
 * Bankanın üst sınırı.
 *
 * Sınırsız bir liste localStorage kotasını yiyor ve okunmayacak kadar
 * uzuyor. Sınıra gelindiğinde **en eski** kayıt düşüyor: kullanıcının
 * bugün bilmediği kart, aylar önce bilmediğinden daha önemli.
 */
export const BILINMEYEN_SINIRI = 300

/** Bir konunun destesi tamamlandı mı. */
export function konuBitti(ilerlemeler: KonuIlerlemeleri, konuId: string): boolean {
  return ilerlemeler[konuId]?.bitti === true
}

/** Temada tamamlanan konu sayısı. */
export function temadaBiten(tema: Tema, ilerlemeler: KonuIlerlemeleri): number {
  return tema.konular.filter((k: Konu) => konuBitti(ilerlemeler, k.id)).length
}

/** Derste tamamlanan ve toplam konu sayısı. */
export function dersOrani(
  program: DersProgrami,
  ilerlemeler: KonuIlerlemeleri,
): { biten: number; toplam: number } {
  let biten = 0
  let toplam = 0
  for (const tema of program.temalar) {
    toplam += tema.konular.length
    biten += temadaBiten(tema, ilerlemeler)
  }
  return { biten, toplam }
}

/** Deste bitince yazılan kayıt. Aynı konu yeniden okunursa son okuma kazanır. */
export function ilerlemeyiYaz(
  ilerlemeler: KonuIlerlemeleri,
  konuId: string,
  sonuc: { bilinen: number; bilinmeyen: number; bitti: boolean },
  bugun: string,
): KonuIlerlemeleri {
  return { ...ilerlemeler, [konuId]: { ...sonuc, tarih: bugun } }
}

/**
 * Bilmediği kartları bankaya ekler.
 *
 * Yeni kartlar **başa** giriyor: banka bir okuma listesi ve en son
 * bilinmeyen, en üstte durmalı. Aynı kart ikinci kez "bilmiyorum"
 * işaretlenirse kayıt tazeleniyor, ikinci bir satır açılmıyor.
 */
export function bilinmeyenleriEkle(
  banka: readonly BilinmeyenKart[],
  yeniler: readonly BilinmeyenKart[],
): BilinmeyenKart[] {
  if (yeniler.length === 0) return [...banka]
  const gelenler = new Set(yeniler.map((k) => k.id))
  const kalanlar = banka.filter((k) => !gelenler.has(k.id))
  return [...yeniler, ...kalanlar].slice(0, BILINMEYEN_SINIRI)
}

export function bilinmeyenSil(banka: readonly BilinmeyenKart[], id: string): BilinmeyenKart[] {
  return banka.filter((k) => k.id !== id)
}

/** Bir kartı banka kaydına çevirir. */
export function bilinmeyenKur(
  kart: BilgiKarti,
  konu: Konu,
  ders: KonuDersId,
  sinif: KonuSinifi,
  bugun: string,
): BilinmeyenKart {
  return {
    id: kart.id,
    konuId: konu.id,
    konuAdi: konu.ad,
    ders,
    sinif,
    baslik: kart.baslik,
    metin: kart.metin,
    tarih: bugun,
  }
}

/** Bankadaki kayıtları derse göre sayar — süzgeç çipleri bunu gösteriyor. */
export function bankaDagilimi(banka: readonly BilinmeyenKart[]): Record<string, number> {
  const sayac: Record<string, number> = {}
  for (const kayit of banka) {
    sayac[kayit.ders] = (sayac[kayit.ders] ?? 0) + 1
  }
  return sayac
}
