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
 * React'e bağlı kısım `lib/guncelleme-kolu.ts` içinde — `cokme.ts` /
 * `cokme-izni.ts` ikilisiyle aynı ayrım.
 */

import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core'

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

function destekleniyor(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * Play'de yeni sürüm var mı.
 *
 * `indirildi`: önceki oturumda indirilmiş ama kurulmamış paket — şerit
 * doğrudan "Yeniden başlat" hâliyle çıkmalı.
 */
export async function guncellemeKontrol(): Promise<{ var: boolean; indirildi: boolean }> {
  if (!destekleniyor()) return { var: false, indirildi: false }
  try {
    return await eklenti.kontrol()
  } catch {
    return { var: false, indirildi: false }
  }
}

/** "Güncelle": Play'in onay penceresi açılır, indirme arkada başlar. */
export async function guncellemeyiBaslat(): Promise<void> {
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
