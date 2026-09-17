/**
 * Konu destesinde geçen sürenin kaydı — saf mantık.
 *
 * Kullanıcıya **gösterilmiyor**; yalnızca aylık özet okuyor ("konu
 * haritasında geçen süre"). Özet o kutuya bir süre pomodoro + oyun toplamını
 * yazıyordu; ikisi ayrı ölçüler ve kullanıcı okuma süresinin kendisini
 * istedi. Ölçüm ekranda sayaç olarak durmuyor: kart okurken akan bir
 * kronometre, okumayı yarışa çevirirdi.
 *
 * Her deste açılışı bir **seans**: konu, gün ve saniye. Konu kaydına
 * (`KonuIlerlemesi`) yazılmadı çünkü orada gün tek (son okuma günü) ve aynı
 * konu iki ayda da okunabiliyor — özet ay ay toplayabilmeli.
 */

export type OkumaSeansi = {
  konuId: string
  /** 'YYYY-AA-GG' */
  tarih: string
  /** Deste açıkken ve uygulama öndeyken geçen süre. */
  saniye: number
}

/**
 * Saklanan seans sayısı. Günde birkaç deste açılsa bile 600 kayıt aylarca
 * yetiyor; sınırsız büyütmenin tek etkisi localStorage kotasını yemek.
 */
export const OKUMA_GECMIS_SINIRI = 600

/**
 * Tek seansa yazılabilecek en uzun süre, saniye (2 saat).
 *
 * Ölçüm yalnızca uygulama öndeyken akıyor ama ekran açık bırakılıp
 * telefon masada unutulabiliyor; bozuk tek bir kayıt özette "konu okumaya
 * 14 saat" gibi bir sayıya dönüşürdü.
 */
export const OKUMA_EN_UZUN = 2 * 60 * 60

/**
 * Seansı geçmişe ekler. Sıfır ya da geçersiz süre yazılmıyor — deste açılıp
 * hemen kapatıldıysa ölçülecek bir şey yok; kaydın kendisi listeyi büyütürdü.
 */
export function okumaSeansiEkle(gecmis: readonly OkumaSeansi[], seans: OkumaSeansi): OkumaSeansi[] {
  const saniye = Math.min(OKUMA_EN_UZUN, Math.round(seans.saniye))
  if (!Number.isFinite(saniye) || saniye <= 0) return [...gecmis]
  return [...gecmis, { ...seans, saniye }].slice(-OKUMA_GECMIS_SINIRI)
}

/** Yedekten gelen listeyi süzer: yalnızca tarihi ve süresi tanınan kayıtlar. */
export function okumaGecmisiniCoz(ham: unknown): OkumaSeansi[] {
  if (!Array.isArray(ham)) return []
  return (ham as Partial<OkumaSeansi>[])
    .filter(
      (s) =>
        typeof s?.konuId === 'string' &&
        typeof s.tarih === 'string' &&
        typeof s.saniye === 'number' &&
        Number.isFinite(s.saniye) &&
        s.saniye > 0,
    )
    .map((s) => ({ konuId: s.konuId as string, tarih: s.tarih as string, saniye: Math.min(OKUMA_EN_UZUN, s.saniye as number) }))
    .slice(-OKUMA_GECMIS_SINIRI)
}
