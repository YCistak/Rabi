import type { BilgiKarti, DersProgrami, Konu, KonuDersId, KonuSinifi, Tema } from './tip'

/**
 * Konu Anlatımı'nın kayıtları — saf mantık, React'e bağlı değil.
 *
 * İki ayrı şey tutuluyor: hangi konunun destesi bitirildi (`KonuIlerlemesi`)
 * ve kullanıcının "bilmiyorum" dediği kartlar (`BilinmeyenKart`).
 *
 * **Bilinmeyenler bankası şu an arayüze bağlı değil.** Deste karar sormayı
 * bıraktı (bkz. `components/konu/kart-destesi.tsx`), yani bankaya yeni kayıt
 * düşmüyor ve haritadaki girişi kaldırıldı. Kod ve depo anahtarı duruyor:
 * kayıtlı kartları silmek, o listeyi biriktirmiş kullanıcının verisini
 * atmak olurdu ve haritanın o köşesi başka bir iş için ayrıldı.
 */

export type KonuIlerlemesi = {
  /**
   * Okunan kart sayısı.
   *
   * Deste artık karar sormuyor, yalnızca ileri geri geziliyor; ölçülebilen
   * tek şey kaç karta kadar gidildiği. Alan **isteğe bağlı**: eski
   * kayıtlarda yerine `bilinen`/`bilinmeyen` vardı ve o kayıtlar duruyor —
   * silinmeleri, bitirilmiş konuların haritada bitmemiş görünmesi demekti.
   */
  okunan?: number
  /**
   * Deste bitince sorulan sorulardan kaç tanesine "doğru" dendiği.
   *
   * Sorular yarıda bırakılabildiği için `okunan`dan bağımsız duruyor ve
   * hiç soru sorulmamış eski kayıtlarda yok.
   */
  dogru?: number
  /** Destenin sonuna gelindi mi — konunun tamamlanması buna **ve** soru oranına bakar. */
  bitti: boolean
  /**
   * Kilidi elle açıldı mı.
   *
   * Kayda giriyor, bileşen state'inde durmuyor: kilidi bilerek açan kullanıcı
   * haritaya her döndüğünde aynı uyarıyı yeniden okusaydı, verdiği karar
   * ekrandan çıkınca unutulmuş olurdu.
   */
  acildi?: boolean
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

/**
 * Soruların geçme oranı, yüzde.
 *
 * Sayı yuvarlak değil bir eşik: altında kalan konu haritada yeşile dönmüyor,
 * düğümünde soru işareti kalıyor. Kartları okumak konuyu "gördüm" yapıyor,
 * soruları geçmek "biliyorum" yapıyor ve harita ikincisini sayıyor.
 */
export const GECME_ORANI = 80

/** Bir konunun destesi sonuna kadar okundu mu. */
export function konuBitti(ilerlemeler: KonuIlerlemeleri, konuId: string): boolean {
  return ilerlemeler[konuId]?.bitti === true
}

/**
 * Sorulardan alınan yüzde; soru sorulmamışsa `null`.
 *
 * Soru metinleri henüz hiçbir konuda yok (`lib/konu/icerik/`), o yüzden bugün
 * hemen her konuda `null` dönüyor ve tamamlanma yalnızca desteye bakıyor.
 */
export function soruOrani(ilerlemeler: KonuIlerlemeleri, konu: Konu): number | null {
  const toplam = konu.sorular.length
  const dogru = ilerlemeler[konu.id]?.dogru
  if (toplam === 0 || dogru === undefined) return null
  return Math.round((dogru / toplam) * 100)
}

/**
 * Konu tamamlandı mı — haritadaki yeşil düğümün ölçütü.
 *
 * Sorusu olan konuda deste **ve** geçme oranı gerekiyor; sorusu olmayanda
 * deste tek başına yetiyor. Yoksa sorusu yazılmamış her konu sonsuza kadar
 * yarım kalır ve harita hiç bitmezdi.
 */
export function konuTamam(ilerlemeler: KonuIlerlemeleri, konu: Konu): boolean {
  if (!konuBitti(ilerlemeler, konu.id)) return false
  const oran = soruOrani(ilerlemeler, konu)
  return oran === null || oran >= GECME_ORANI
}

/**
 * Deste bitti ama sorular geçilmedi — düğümdeki soru işareti bunu gösteriyor.
 */
export function soruBekliyor(ilerlemeler: KonuIlerlemeleri, konu: Konu): boolean {
  const oran = soruOrani(ilerlemeler, konu)
  return konuBitti(ilerlemeler, konu.id) && oran !== null && oran < GECME_ORANI
}

/**
 * Konu kilitli mi.
 *
 * Kilit **bir önceki konuya** bakıyor, tema sınırına değil: patika program
 * boyunca tek bir sıra ve tema başlığı o sırayı bölmüyor. İlk konu hep açık;
 * kilidi elle açılan konu (`acildi`) da açık sayılıyor.
 */
export function konuKilitli(
  ilerlemeler: KonuIlerlemeleri,
  sirali: readonly Konu[],
  sira: number,
): boolean {
  if (sira <= 0) return false
  if (ilerlemeler[sirali[sira].id]?.acildi === true) return false
  return !konuTamam(ilerlemeler, sirali[sira - 1])
}

/** Kilidi elle açar. Kayıt yoksa açılıyor; okunan kart bilgisi bozulmuyor. */
export function kilidiAc(
  ilerlemeler: KonuIlerlemeleri,
  konuId: string,
  bugun: string,
): KonuIlerlemeleri {
  const onceki = ilerlemeler[konuId] ?? { bitti: false, tarih: bugun }
  return { ...ilerlemeler, [konuId]: { ...onceki, acildi: true } }
}

/** Temada tamamlanan konu sayısı. */
export function temadaBiten(tema: Tema, ilerlemeler: KonuIlerlemeleri): number {
  return tema.konular.filter((k: Konu) => konuTamam(ilerlemeler, k)).length
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

/**
 * Deste bitince yazılan kayıt. Aynı konu yeniden okunursa son okuma kazanır.
 *
 * Kayıt **üzerine yazılmıyor, birleşiyor**: destenin bitmesi soru sonucunu
 * (`dogru`) ve elle açılmış kilidi (`acildi`) taşımıyor. Değiştirmeden
 * yazsaydık, geçilmiş bir konunun kartlarına ikinci kez bakmak o konuyu
 * haritada yeniden yarım gösterirdi.
 */
export function ilerlemeyiYaz(
  ilerlemeler: KonuIlerlemeleri,
  konuId: string,
  sonuc: { okunan: number; bitti: boolean; dogru?: number },
  bugun: string,
): KonuIlerlemeleri {
  return { ...ilerlemeler, [konuId]: { ...ilerlemeler[konuId], ...sonuc, tarih: bugun } }
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
