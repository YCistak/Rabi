import type { TanitimEylemi, TanitimTuru } from './tanitim'

/*
  Rehberin gizlenmesi, geri tuşu ve geçiş sırasında gelen olaylar — turun
  takılıp kalmasını önleyen kararlar. React'ten bağımsız, testli
  (`tanitim-rehber.test.ts`); bağlam (`tanitim-baglami.tsx`) ve `AppShell`
  yalnızca uygular.

  Hata (Android, 2026-10): Oyunlar turunda "Başlat"tan sonraki geri sayımda
  rehber gizleniyordu. Sayım sürerken geri tuşu adımı "Hazırlık"a döndürdü,
  sayım bitince gelen "oyun başladı" olayı adım uymadığı için yok sayıldı ve
  rehber yalnızca "Bir işlemi çöz" adımında geri geldiği için bir daha hiç
  açılmadı: tur kaydedilmeden açık kaldı, geri tuşu ve Oyun Bankası düğmesi
  oturum boyunca çalışmadı, tur her açılışta yeniden çıktı.
*/

/**
 * Gizliliğin ait olduğu adım. Rehber yalnızca gizlendiği adımda gizli kalır:
 * adım ya da tur değişince (geri tuşu, yeni tur, tur bitişi) kendiliğinden
 * görünür — gizlilik ayrı bir bayrak olarak kalıp unutulamaz.
 */
export function rehberAnahtari(tur: TanitimTuru | null, adim: number | null): string | null {
  return tur === null || adim === null ? null : `${tur}:${adim}`
}

export function rehberGizliMi(gizliAnahtar: string | null, guncelAnahtar: string | null): boolean {
  return gizliAnahtar !== null && gizliAnahtar === guncelAnahtar
}

/** Geri sayımın sürdüğü adım: rehber burada sayım boyunca gizli. */
export const SAYIM_ADIMI = 'oyun-baslat'

/**
 * Sayım 3 · 2 · 1 · Başla ~2,4 sn (`oyun-geri-sayim.tsx`) ve ardından bir
 * geçiş. Rehber bu adımda bundan uzun gizli kaldıysa "oyun başladı" olayı bir
 * yerde kaybolmuştur; tur hazırlığa döndürülüp rehber geri getirilir.
 */
export const SAYIM_KORUMA_MS = 8000

/** Sayım koruması kurulmalı mı: rehber sayım adımında gizli. */
export function sayimKorumasiGerekli(d: { rehberGizli: boolean; adimKimligi: string | null }): boolean {
  return d.rehberGizli && d.adimKimligi === SAYIM_ADIMI
}

/**
 * Turdayken Android geri tuşunun ne yapacağı.
 *
 * - `yut`: geri sayım sürüyor. Adım geri alınırsa sayım sonunda gelen olay
 *   yeni adıma uymaz ve tur kilitlenir; tuş hiçbir şey yapmaz.
 * - `katman`: rehber başka bir sebeple gizli (deneme formunda Okut açık) ve
 *   açık bir katman var: tuş önce o katmanı kapatır, rehber geri gelir.
 * - `adim-geri`: her zamanki gibi bir adım geri.
 * - `normal`: tur yok, uygulamanın kendi geri sırası.
 */
export type TanitimGeriKarari = 'normal' | 'yut' | 'katman' | 'adim-geri'

export function tanitimGeriKarari(d: {
  tanitimdaMi: boolean
  rehberGizli: boolean
  adimKimligi: string | null
  katmanVar: boolean
}): TanitimGeriKarari {
  if (!d.tanitimdaMi) return 'normal'
  if (d.rehberGizli && d.adimKimligi === SAYIM_ADIMI) return 'yut'
  if (d.rehberGizli && d.katmanVar) return 'katman'
  return 'adim-geri'
}

/**
 * Geçiş (balon/spot animasyonu) sürerken gelen eylem ne olur.
 *
 * Kullanıcı dokunuşları (`ileri`, `geri`, hedefe dokunma) **düşürülür**: aynı
 * hareketin iki adımı atlamasını önleyen çift dokunuş koruması bu. Oyundan ya
 * da formdan gelen olaylar ise (oyun başladı, oyun bitti, kayıt eklendi) bir
 * kez olur ve tekrarı yoktur; düşerse tur o adımda takılır. Bunlar sıraya
 * alınır ve geçiş bitince işlenir.
 */
export type GecisteEylemKarari = 'kuyruk' | 'dusur'

/** Oyunun kendisinin gönderdiği "hedefe dokunma" olayları (kullanıcı dokunuşu değil). */
const OYUN_OLAYI_HEDEFLERI = ['demo-baslat']

export function gecisteEylemKarari(eylem: TanitimEylemi): GecisteEylemKarari {
  if (eylem.tur === 'oyun-bitti' || eylem.tur === 'kayit-eklendi') return 'kuyruk'
  if (eylem.tur === 'hedefe-dokun' && OYUN_OLAYI_HEDEFLERI.includes(eylem.hedef)) return 'kuyruk'
  return 'dusur'
}

/** Aynı olay sırada zaten bekliyorsa ikinci kez eklenmez. */
export function kuyrugaEkle(kuyruk: readonly TanitimEylemi[], eylem: TanitimEylemi): TanitimEylemi[] {
  const ayni = kuyruk.some((oge) => oge.tur === eylem.tur && eylemImzasi(oge) === eylemImzasi(eylem))
  return ayni ? [...kuyruk] : [...kuyruk, eylem]
}

function eylemImzasi(eylem: TanitimEylemi): string {
  if (eylem.tur === 'hedefe-dokun') return eylem.hedef
  if (eylem.tur === 'kayit-eklendi') return eylem.kayit
  if (eylem.tur === 'oyun-bitti') return `${eylem.dogru}/${eylem.yanlis}`
  return ''
}

/**
 * Sıradan çıkan olay hangi adıma göre işlenir: gönderildiği andaki değil,
 * geçiş bittikten sonraki adıma. Olay oyunun durumunu anlatıyor; adımı reducer
 * (`tanitimGecisi`) yine kendisi denetliyor (oyun bitti yalnız soru adımında,
 * oyun başladı yalnız Başlat adımında geçer). Tur kimliği korunur: tur bu
 * arada bittiyse olay yok sayılır.
 */
export function kuyruktanCikar(eylem: TanitimEylemi): TanitimEylemi {
  const { beklenenAdim: _adim, ...kalan } = eylem
  return kalan as TanitimEylemi
}
