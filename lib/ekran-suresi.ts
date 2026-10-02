import { registerPlugin } from '@capacitor/core'
import { iosMu } from './platform'

/**
 * iOS'ta odak kilidinin köprüsü (yerli taraf
 * `ios/App/App/EkranSuresiEklentisi.swift`).
 *
 * Android'deki `lib/odak-kilidi.ts`in karşılığı ama ayrı bir dosya: iki
 * platformun işleyişi birbirine benzemiyor. Android uygulama listesini veriyor
 * ve paket adlarıyla kilitliyor; iOS listeyi hiç vermiyor — seçim Apple'ın
 * kendi seçicisinde yapılıyor, yerli tarafta opak belirteçler olarak duruyor ve
 * buraya yalnızca **kaç tane** seçildiği geliyor. Ortak bir arayüz, iki
 * platformdan birine yalan söylerdi.
 *
 * Seçilen uygulamalar tur boyunca açılmıyor ve bildirimleri gelmiyor; Android'in
 * ayrı "Rahatsız Etme" anahtarı burada yok, kalkan ikisini birden yapıyor.
 */

export type EkranSuresiIzni = 'verildi' | 'reddedildi' | 'sorulmadi' | 'yok'

export type EkranSuresiDurumu = {
  /** iOS 16 ve üstü: kişisel Screen Time yetkisi ancak orada var. */
  destek: boolean
  izin: EkranSuresiIzni
  /** Seçilen uygulama, kategori ve site sayısı. */
  secimSayisi: number
}

type Eklenti = {
  durum(): Promise<EkranSuresiDurumu>
  izinIste(): Promise<{ izin: EkranSuresiIzni }>
  uygulamaSec(): Promise<{ secimSayisi: number; kaydedildi: boolean }>
  kilitle(secenekler: { kilitAcik: boolean; bitisZamani: number }): Promise<{ kilitlendi: boolean }>
  kaldir(): Promise<void>
  listeGoster(yer: ListeYeri): Promise<{ satir: number }>
  listeGizle(): Promise<void>
  listeKaldir(): Promise<void>
}

/**
 * Engelli uygulama listesinin sayfadaki yeri. `x`/`y` belge koordinatında
 * (kaydırmadan bağımsız), `ust`/`alt` ekranda listenin görünebileceği bant.
 */
export type ListeYeri = { x: number; y: number; genislik: number; ust: number; alt: number }

const YOK: EkranSuresiDurumu = { destek: false, izin: 'yok', secimSayisi: 0 }

const eklenti = registerPlugin<Eklenti>('EkranSuresi')

export function ekranSuresiVar(): boolean {
  return iosMu()
}

export async function ekranSuresiDurumu(): Promise<EkranSuresiDurumu> {
  if (!ekranSuresiVar()) return YOK
  try {
    return await eklenti.durum()
  } catch {
    return YOK
  }
}

export async function ekranSuresiIzniIste(): Promise<EkranSuresiIzni> {
  if (!ekranSuresiVar()) return 'yok'
  try {
    return (await eklenti.izinIste()).izin
  } catch {
    return 'yok'
  }
}

/** Apple'ın seçicisini açar; dönen sayı kaydedilen seçimin büyüklüğü. */
export async function ekranSuresiUygulamaSec(): Promise<number | null> {
  if (!ekranSuresiVar()) return null
  try {
    return (await eklenti.uygulamaSec()).secimSayisi
  } catch {
    return null
  }
}

/**
 * Turun başında çağrılıyor; `kilitAcik` yanlışsa kalkanı kaldırıyor.
 *
 * `bitisZamani` mutlak zaman (epoch ms): kalkanı tur sonunda yerli taraftaki
 * zamanlayıcı kaldırıyor, uygulama o an çalışmıyor olabilir.
 */
export async function ekranSuresiKilitle(kilitAcik: boolean, bitisZamani: number): Promise<boolean> {
  if (!ekranSuresiVar()) return false
  try {
    return (await eklenti.kilitle({ kilitAcik, bitisZamani })).kilitlendi
  } catch {
    return false
  }
}

/**
 * Engellenen uygulamaların yerli listesi (yerli taraftaki `listeGoster`ın
 * yorumunda neden yerli olduğu yazıyor). Hata yutuluyor: liste yalnızca
 * gösterim, kilidin kendisi ona bağlı değil.
 */
export async function ekranSuresiListeGoster(yer: ListeYeri): Promise<void> {
  if (!ekranSuresiVar()) return
  try {
    await eklenti.listeGoster(yer)
  } catch {
    // Liste çizilemedi; kilit yine çalışıyor.
  }
}

export async function ekranSuresiListeGizle(): Promise<void> {
  if (!ekranSuresiVar()) return
  try {
    await eklenti.listeGizle()
  } catch {
    // Liste zaten yok.
  }
}

export async function ekranSuresiListeKaldir(): Promise<void> {
  if (!ekranSuresiVar()) return
  try {
    await eklenti.listeKaldir()
  } catch {
    // Liste zaten yok.
  }
}

export async function ekranSuresiKaldir(): Promise<void> {
  if (!ekranSuresiVar()) return
  try {
    await eklenti.kaldir()
  } catch {
    // Kalkan zaten yok olabilir.
  }
}
