/**
 * Denemeler listesinin süzme ve sıralama mantığı.
 *
 * Ekrandan ayrı tutuldu: hem saf mantık `lib/` altında kalsın diye, hem de
 * "değişim" hesabı sıralamadan etkilenmesin diye. Değişim her zaman **tarih
 * sırasına** göre çıkarılır (bir önceki aynı şablonlu denemeye göre); kullanıcı
 * listeyi nete göre sıralayınca "önceki deneme" kavramı bozulurdu.
 */

import { denemeOzeti, tarihSirala, yuvarla, type DenemeOzeti } from './hesap'
import type { Deneme, Sablon, SablonTuru } from './types'

/** Listede tek satır: deneme, şablonu, özeti ve bir öncekine göre net farkı. */
export type DenemeSatiri = {
  deneme: Deneme
  /** Şablon silinmişse null — netler hesaplanamaz. */
  sablon: Sablon | null
  ozet: DenemeOzeti | null
  /** Aynı şablondaki bir önceki denemeye göre net farkı; ilk denemede null. */
  degisim: number | null
}

/** Süzme seçeneği: `hepsi` ya da bir şablon türü. */
export type DenemeSuzgeci = 'hepsi' | SablonTuru

export type DenemeSiralamasi = 'yeni' | 'eski' | 'yuksek' | 'dusuk'

/** Menüdeki sıra: önce tarih, sonra net — kullanıcı en sık tarihe göre bakıyor. */
export const SIRALAMA_SIRASI: DenemeSiralamasi[] = ['yeni', 'eski', 'yuksek', 'dusuk']

export const SIRALAMA_ADLARI: Record<DenemeSiralamasi, string> = {
  yeni: 'En yeni',
  eski: 'En eski',
  yuksek: 'En yüksek net',
  dusuk: 'En düşük net',
}

/** Süzgeç çipleri için tür adları. `okul` kullanıcının gördüğü adla yazılır. */
export const TUR_ADLARI: Record<SablonTuru, string> = {
  tyt: 'TYT',
  ayt: 'AYT',
  ydt: 'YDT',
  okul: 'Okul',
}

/** Süzgeç çiplerinin sırası — TYT ve AYT en sık kullanılanlar, başta. */
export const TUR_SIRASI: SablonTuru[] = ['tyt', 'ayt', 'ydt', 'okul']

/**
 * Denemeleri tarih sırasında satırlara çevirir (eskiden yeniye) ve her satıra
 * bir öncekine göre net değişimini yazar.
 */
export function denemeSatirlari(denemeler: Deneme[], sablonlar: Sablon[]): DenemeSatiri[] {
  const sonNetler = new Map<string, number>()

  return tarihSirala(denemeler).map((deneme) => {
    const sablon = sablonlar.find((s) => s.id === deneme.sablonId)
    if (!sablon) return { deneme, sablon: null, ozet: null, degisim: null }

    const ozet = denemeOzeti(deneme, sablon)
    const onceki = sonNetler.get(deneme.sablonId)
    sonNetler.set(deneme.sablonId, ozet.toplamNet)

    return {
      deneme,
      sablon,
      ozet,
      degisim: onceki === undefined ? null : yuvarla(ozet.toplamNet - onceki),
    }
  })
}

/** Listede hangi süzgeç çiplerinin görüneceği — yalnızca kaydı olan türler. */
export function mevcutTurler(satirlar: DenemeSatiri[]): SablonTuru[] {
  const turler = new Set(satirlar.map((s) => s.sablon?.tur).filter((t) => t !== undefined))
  return TUR_SIRASI.filter((tur) => turler.has(tur))
}

/**
 * Satırları süzer ve sıralar.
 *
 * Girdi tarih sırasında (eskiden yeniye) bekleniyor — `denemeSatirlari` böyle
 * veriyor. Şablonu silinmiş denemelerin neti yok; nete göre sıralamada bunlar
 * her iki yönde de en sona düşer, yoksa "en düşük net" listesinin başını
 * hesaplanamayan kayıtlar kapatırdı.
 */
export function suzVeSirala(
  satirlar: DenemeSatiri[],
  suzgec: DenemeSuzgeci,
  sira: DenemeSiralamasi,
): DenemeSatiri[] {
  const suzulen =
    suzgec === 'hepsi' ? [...satirlar] : satirlar.filter((s) => s.sablon?.tur === suzgec)

  if (sira === 'eski') return suzulen
  if (sira === 'yeni') return suzulen.reverse()

  return suzulen.sort((a, b) => {
    if (a.ozet === null || b.ozet === null) {
      if (a.ozet === b.ozet) return 0
      return a.ozet === null ? 1 : -1
    }
    const fark = a.ozet.toplamNet - b.ozet.toplamNet
    // Netler eşitse yeni deneme üstte: liste kayıt sırasına göre rastgele görünmesin.
    if (fark === 0) return b.deneme.tarih.localeCompare(a.deneme.tarih)
    return sira === 'yuksek' ? -fark : fark
  })
}
