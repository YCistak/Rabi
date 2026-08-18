import { registerPlugin } from '@capacitor/core'
import { Capacitor } from '@capacitor/core'

/** Kilitlenebilecek bir uygulama — liste yerli taraftan geliyor. */
export type KilitlenebilirUygulama = {
  paket: string
  ad: string
  /** base64 data URI; ikon okunamazsa boş. */
  ikon: string
  /** Kurulumda önceden işaretli gelenler. */
  onerilen: boolean
}

export type OdakDurumu = {
  /** Kullanım verisi erişimi verildi mi. */
  kullanimVerisi: boolean
  /** Diğer uygulamaların üzerine çizme izni verildi mi. */
  katman: boolean
  /** Ön plan servisi şu an ayakta mı. */
  calisiyor: boolean
}

export type OdakIzni = 'kullanimVerisi' | 'katman'

type OdakKilidiEklentisi = {
  durum(): Promise<OdakDurumu>
  izinEkraniniAc(secenekler: { izin: OdakIzni }): Promise<{ acildi: boolean }>
  uygulamalar(): Promise<{ uygulamalar: KilitlenebilirUygulama[] }>
  baslat(secenekler: {
    paketler: string[]
    bitisZamani: number
    ders?: string
  }): Promise<{ basladi: boolean }>
  bitir(): Promise<void>
  addListener(
    olay: 'kilitKapatildi',
    dinleyici: () => void,
  ): Promise<{ remove: () => Promise<void> }>
}

const KAPALI_DURUM: OdakDurumu = { kullanimVerisi: false, katman: false, calisiyor: false }

/**
 * Tarayıcı sahtesi.
 *
 * Odak kilidi projedeki **tek** cihaza bağlı özellik: tarayıcıda hangi
 * uygulamanın önde olduğunu görmenin yolu yok. `npm run dev` bozulmasın diye
 * web tarafında her şey "izin yok" döner; arayüz de bunu görüp özelliği
 * gizler. Gerçek test yalnızca cihazda.
 */
const sahte: OdakKilidiEklentisi = {
  durum: async () => KAPALI_DURUM,
  izinEkraniniAc: async () => ({ acildi: false }),
  uygulamalar: async () => ({ uygulamalar: [] }),
  baslat: async () => ({ basladi: false }),
  bitir: async () => {},
  addListener: async () => ({ remove: async () => {} }),
}

const eklenti = registerPlugin<OdakKilidiEklentisi>('OdakKilidi', { web: () => sahte })

/** Özellik yalnızca Android'de var; çağrı yerlerinde tek tek sormamak için. */
export function odakKilidiDesteklenir(): boolean {
  return Capacitor.isNativePlatform()
}

export async function odakDurumu(): Promise<OdakDurumu> {
  if (!odakKilidiDesteklenir()) return KAPALI_DURUM
  try {
    return await eklenti.durum()
  } catch {
    return KAPALI_DURUM
  }
}

export async function odakIzniIste(izin: OdakIzni): Promise<boolean> {
  if (!odakKilidiDesteklenir()) return false
  try {
    const sonuc = await eklenti.izinEkraniniAc({ izin })
    return sonuc.acildi
  } catch {
    return false
  }
}

export async function kilitlenebilirUygulamalar(): Promise<KilitlenebilirUygulama[]> {
  if (!odakKilidiDesteklenir()) return []
  try {
    const sonuc = await eklenti.uygulamalar()
    return sonuc.uygulamalar ?? []
  } catch {
    return []
  }
}

/**
 * Çalışma turu başladı.
 *
 * `bitisZamani` mutlak zaman (epoch ms) olarak geçiyor: uygulama arka plana
 * düşünce JS zamanlayıcıları duraklıyor, kalan süreyi yerli taraf kendisi
 * hesaplamalı.
 */
export async function odakKilidiniBaslat(
  paketler: string[],
  bitisZamani: number,
  ders?: string,
): Promise<boolean> {
  if (!odakKilidiDesteklenir() || paketler.length === 0) return false
  try {
    const sonuc = await eklenti.baslat({ paketler, bitisZamani, ders })
    return sonuc.basladi
  } catch {
    return false
  }
}

export async function odakKilidiniBitir(): Promise<void> {
  if (!odakKilidiDesteklenir()) return
  try {
    await eklenti.bitir()
  } catch {
    // servis zaten durmuş olabilir
  }
}

/**
 * Kullanıcı katmandan "kilidi kapat" dedi. Tur iptal edilmeli — bedeli olmayan
 * bir engel engel değil.
 */
export async function odakKilidiKapatilinca(
  dinleyici: () => void,
): Promise<() => void> {
  if (!odakKilidiDesteklenir()) return () => {}
  try {
    const kayit = await eklenti.addListener('kilitKapatildi', dinleyici)
    return () => {
      void kayit.remove()
    }
  } catch {
    return () => {}
  }
}
