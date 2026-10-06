/**
 * Çökme raporu sorusu ile tanıtım turunun sırası.
 *
 * İkisi aynı anda görünemez. Tur katmanı (`spot-isigi.tsx`) belge düzeyinde
 * dokunmaları ve odağı yutuyor; pencere onun altında kalınca "Gönder" /
 * "Gönderme" çalışmıyor, tur da hedefine dokunulamadığı için ilerlemiyordu —
 * kullanıcı kilitleniyor, yeniden açınca aynı döngüye giriyordu.
 *
 * Kural:
 * - Pencere bekliyorsa tur (ana tur ve mini turlar) **başlamaz**; pencere
 *   cevaplanınca başlar.
 * - Tur zaten sürüyorsa (ya da kapanış animasyonundaysa) pencere tur bitene
 *   kadar **ertelenir**. Turu gizlemek yerine pencereyi ertelemek seçildi:
 *   rapor cihazda bekliyor, beklemekle bir şey kaybolmaz; oysa yarıda
 *   gizlenen tur demo verisiyle açık bir ekran/form bırakıyor ve tur
 *   atlanamaz olduğu için ona dönüş yolu da yok.
 */
export interface CokmeTanitimDurumu {
  /** Bekleyen bir çökme raporu var ve henüz cevaplanmadı. */
  cokmeBekliyor: boolean
  /** Bir tur (ana ya da mini) adımda. */
  tanitimdaMi: boolean
  /** Tur bitti ama katmanı hâlâ sönüyor. */
  turKapaniyor: boolean
}

export interface CokmeTanitimKarari {
  /** Tur başlatan etkiler çalışabilir mi. */
  turBaslayabilir: boolean
  /** Çökme penceresi şimdi gösterilsin mi. */
  soruGorunsun: boolean
}

export function cokmeTanitimKarari(d: CokmeTanitimDurumu): CokmeTanitimKarari {
  const turSuruyor = d.tanitimdaMi || d.turKapaniyor
  return {
    turBaslayabilir: !d.cokmeBekliyor,
    soruGorunsun: d.cokmeBekliyor && !turSuruyor,
  }
}
