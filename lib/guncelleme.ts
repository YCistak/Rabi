/**
 * Play'deki yeni sürümün köprüsü — uygulama içi güncelleme şeridi.
 *
 * `AGENTS.md`'deki "ağa çıkılmıyor" kuralının **üçüncü** istisnası ve
 * ötekilerden ayrı bir tür: buradan ağa çıkan bizim kodumuz değil,
 * telefondaki Play Store uygulaması (`GuncellemeEklentisi.kt`). Play'e giden
 * tek şey "bu paketin kurulu sürümü kaç" — Play'in zaten bildiği bir bilgi.
 *
 * Neden var: Play güncellemeyi itmiyor, haber de vermiyor. Otomatik
 * güncellemesi kapalı kullanıcı düzeltilmiş bir hatayı haftalarca eski
 * sürümde yaşıyordu ve bunu ona söyleyecek bir yer yoktu.
 *
 * iOS'ta App Store uygulamaya haber vermiyor ve sorulacak yerli bir API yok;
 * orada Apple'ın herkese açık arama adresine (`itunes.apple.com/lookup`)
 * yalnız paket kimliği gidiyor, kurulu sürümle karşılaştırma telefonda
 * yapılıyor. "Güncelle" App Store'daki sayfayı açıyor — indirme ve kurulum
 * App Store'un işi, şerit yalnız haber veriyor.
 *
 * React'e bağlı kısım `lib/guncelleme-kolu.ts` içinde — `cokme.ts` /
 * `cokme-izni.ts` ikilisiyle aynı ayrım.
 */

import { App } from '@capacitor/app'
import { CapacitorHttp, registerPlugin, type PluginListenerHandle } from '@capacitor/core'
import { androidMu, iosMu } from './platform'
import { surumYeniMi } from './surum-karsilastir'

/** Yerli taraftan gelen indirme durumu. */
export type GuncellemeDurumu = 'indiriliyor' | 'indirildi' | 'kuruluyor' | 'kuruldu' | 'basarisiz'

type GuncellemeEklentisi = {
  kontrol(): Promise<{ var: boolean; indirildi: boolean }>
  baslat(): Promise<void>
  tamamla(): Promise<void>
  addListener(
    olay: 'durum',
    dinleyici: (veri: { durum: GuncellemeDurumu }) => void,
  ): Promise<PluginListenerHandle>
}

/** Tarayıcı sahtesi: `npm run dev`de güncelleme yok. */
const sahte: GuncellemeEklentisi = {
  kontrol: async () => ({ var: false, indirildi: false }),
  baslat: async () => {},
  tamamla: async () => {},
  addListener: async () => ({ remove: async () => {} }),
}

const eklenti = registerPlugin<GuncellemeEklentisi>('Guncelleme', { web: () => sahte })

// Yerli eklenti Play'e ait; iOS kendi yolundan (`appStoreKontrol`) gidiyor.
function destekleniyor(): boolean {
  return androidMu()
}

const PAKET = 'com.fluxifyinteractive.rabi'

/** Son denetimde bulunan App Store sayfası; "Güncelle" bunu açıyor. */
let appStoreAdresi: string | null = null

/**
 * App Store'daki sürümü kuruluyla karşılaştırır.
 *
 * `fetch` değil `CapacitorHttp`: arama adresi CORS başlığı vermiyor, istek
 * yerli taraftan gidiyor. Adresin sonundaki zaman damgası Apple'ın önbelleğini
 * deliyor — yoksa yayından sonra bir gün boyunca eski sürüm dönebiliyor.
 * Uygulama mağazada yoksa (yalnız TestFlight) sonuç boş, şerit çıkmaz.
 */
async function appStoreKontrol(): Promise<{ var: boolean; indirildi: boolean }> {
  const yok = { var: false, indirildi: false }
  try {
    const [{ version: kurulu }, yanit] = await Promise.all([
      App.getInfo(),
      CapacitorHttp.get({
        url: 'https://itunes.apple.com/lookup',
        params: { bundleId: PAKET, country: 'tr', t: String(Date.now()) },
      }),
    ])
    const veri = typeof yanit.data === 'string' ? JSON.parse(yanit.data) : yanit.data
    const kayit = veri?.results?.[0] as { version?: string; trackViewUrl?: string } | undefined
    if (!kayit?.version || !kayit.trackViewUrl) return yok
    if (!surumYeniMi(kayit.version, kurulu)) return yok
    appStoreAdresi = kayit.trackViewUrl
    return { var: true, indirildi: false }
  } catch {
    return yok
  }
}

/**
 * Play'de yeni sürüm var mı.
 *
 * `indirildi`: önceki oturumda indirilmiş ama kurulmamış paket — şerit
 * doğrudan "Yeniden başlat" hâliyle çıkmalı.
 */
export async function guncellemeKontrol(): Promise<{ var: boolean; indirildi: boolean }> {
  if (iosMu()) return appStoreKontrol()
  if (!destekleniyor()) return { var: false, indirildi: false }
  try {
    return await eklenti.kontrol()
  } catch {
    return { var: false, indirildi: false }
  }
}

/**
 * "Güncelle": Play'in onay penceresi açılır, indirme arkada başlar. iOS'ta
 * App Store sayfası açılır (Capacitor `_blank`ı sisteme veriyor).
 */
export async function guncellemeyiBaslat(): Promise<void> {
  if (iosMu()) {
    if (appStoreAdresi) window.open(appStoreAdresi, '_blank')
    return
  }
  if (!destekleniyor()) return
  try {
    await eklenti.baslat()
  } catch {
    // Play yoksa ya da paket Play'den kurulmadıysa sessizce geçiliyor.
  }
}

/** "Yeniden başlat": indirilen paket kurulur, uygulama yeniden açılır. */
export async function guncellemeyiTamamla(): Promise<void> {
  if (!destekleniyor()) return
  try {
    await eklenti.tamamla()
  } catch {
    // Kurulamazsa bir sonraki açılışta yeniden sorulur.
  }
}

/** İndirme durumunu dinler; dönen fonksiyon dinlemeyi bırakır. */
export function guncellemeDurumunuDinle(dinleyici: (durum: GuncellemeDurumu) => void): () => void {
  if (!destekleniyor()) return () => {}
  const soz = eklenti.addListener('durum', ({ durum }) => dinleyici(durum))
  return () => {
    void soz.then((k) => k.remove()).catch(() => {})
  }
}
