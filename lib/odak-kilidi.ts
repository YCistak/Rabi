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
  /**
   * Rahatsız Etme erişimi verildi mi — tur boyunca telefon sussun diye.
   *
   * **İsteğe bağlı**: verilmezse kilit çalışır, yalnızca telefon susmaz. Bu
   * yüzden `baslat` bunu şart koşmuyor.
   *
   * Bir süre bunun yerine bildirim dinleyicisi vardı ve paket başına
   * susturabiliyordu. Xiaomi/HyperOS iki yerde birden kapattı: dinleyici
   * tanımlayan APK Play dışından kurulamıyor ("hassas verilere erişebilir",
   * "yine de yükle" düğmesi de yok) ve kurulsa bile bildirim erişimi izni o
   * cihazlarda verilemiyor. Rahatsız Etme telefonun tamamını susturuyor ama
   * her cihazda gerçekten çalışıyor.
   */
  rahatsizEtme: boolean
  /** Ön plan servisi şu an ayakta mı. */
  calisiyor: boolean
}

export type OdakIzni = 'kullanimVerisi' | 'katman' | 'rahatsizEtme'

type OdakKilidiEklentisi = {
  durum(): Promise<OdakDurumu>
  izinEkraniniAc(secenekler: { izin: OdakIzni }): Promise<{ acildi: boolean }>
  uygulamalar(): Promise<{ uygulamalar: KilitlenebilirUygulama[] }>
  baslat(secenekler: {
    paketler: string[]
    bitisZamani: number
    ders?: string
    asama?: string
    rahatsizEtme: boolean
  }): Promise<{ basladi: boolean }>
  duraklat(): Promise<void>
  bitir(): Promise<void>
  addListener(
    olay: 'kilitKapatildi',
    dinleyici: () => void,
  ): Promise<{ remove: () => Promise<void> }>
  addListener(
    olay: 'pomodoroKomutu',
    dinleyici: (veri: PomodoroKomutu) => void,
  ): Promise<{ remove: () => Promise<void> }>
}

/**
 * Kilit ekranındaki bildirimin düğmelerinden gelen komut.
 *
 * `bitisZamani` yalnızca `devam`da anlamlı: buradaki sayaç mutlak zaman
 * damgasından okunuyor (`lib/pomodoro.ts`), yani "devam et" demek yetmiyor,
 * hangi ana kadar olduğu da gelmeli.
 */
export type PomodoroKomutu = {
  komut: 'duraklat' | 'devam' | 'bitir'
  bitisZamani: number
}

const KAPALI_DURUM: OdakDurumu = {
  kullanimVerisi: false,
  katman: false,
  rahatsizEtme: false,
  calisiyor: false,
}

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
  duraklat: async () => {},
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
 * Tur başladı — yerli servis kuruluyor.
 *
 * `bitisZamani` mutlak zaman (epoch ms) olarak geçiyor: uygulama arka plana
 * düşünce JS zamanlayıcıları duraklıyor, kalan süreyi yerli taraf kendisi
 * hesaplamalı.
 *
 * Boş paket listesi ve kapalı Rahatsız Etme artık "başlatma" demek değil:
 * servisin asıl işi kilit ekranındaki sayaç ve o sayaç hiçbir izin
 * istemiyor. Eskiden burada bir "ikisi de kapalıysa vazgeç" dalı vardı ve
 * odak kilidini hiç açmamış kullanıcı — yani çoğunluk — sayacı kilit
 * ekranında hiç görmüyordu.
 */
export async function odakKilidiniBaslat(
  paketler: string[],
  bitisZamani: number,
  ders?: string,
  rahatsizEtme = false,
  asama?: string,
): Promise<boolean> {
  if (!odakKilidiDesteklenir()) return false
  try {
    const sonuc = await eklenti.baslat({ paketler, bitisZamani, ders, asama, rahatsizEtme })
    return sonuc.basladi
  } catch {
    return false
  }
}

/**
 * Sayaç duraklatıldı.
 *
 * `odakKilidiniBitir` değil: duraklatmak turdan çıkmak değil ve servis
 * durdurulsaydı bildirim ekrandan kalkar, duraklatılmış tur kilit ekranında
 * hiç var olmamış gibi görünürdü.
 */
export async function odakKilidiniDuraklat(): Promise<void> {
  if (!odakKilidiDesteklenir()) return
  try {
    await eklenti.duraklat()
  } catch {
    // servis zaten durmuş olabilir
  }
}

/*
  "Devam ettir" diye bir eş yok: uygulamanın Başlat düğmesi servisi
  `odakKilidiniBaslat` ile baştan kuruyor ve o zaten duraklamayı sıfırlıyor.
  Devam yalnızca bildirimin kendi düğmesinden geliyor ve oradan buraya
  `pomodoroKomutu` olayıyla dönüyor.
*/

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
/**
 * Kilit ekranındaki bildirimin düğmesine basıldı.
 *
 * Sayacın iki kopyası var — biri yerli serviste, biri burada — ve bildirim
 * düğmesi yalnızca ilkine dokunuyor. Bu dinleyici olmadan uygulamaya dönen
 * kullanıcı, bildirimden duraklattığı turu hâlâ işlerken bulurdu.
 */
export async function pomodoroKomutuGelince(
  dinleyici: (veri: PomodoroKomutu) => void,
): Promise<() => void> {
  if (!odakKilidiDesteklenir()) return () => {}
  try {
    const kayit = await eklenti.addListener('pomodoroKomutu', dinleyici)
    return () => {
      void kayit.remove()
    }
  } catch {
    return () => {}
  }
}

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
