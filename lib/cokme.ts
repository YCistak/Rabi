/**
 * Çökme raporlamasının web tarafı — köprü ve global hata yakalayıcı.
 *
 * `AGENTS.md`'deki "sunucu yok, dış servise çıkma" kuralının **ikinci**
 * istisnası (ilki `lib/hata-gonder.ts`). Buradan hiçbir şey doğrudan ağa
 * çıkmıyor: yakalanan hata yerli tarafa geçiyor, ağa çıkma kararını
 * Crashlytics veriyor ve o da kullanıcı onay verene kadar kapalı
 * (`AndroidManifest.xml` → `firebase_crashlytics_collection_enabled=false`).
 *
 * React'e bağlı hiçbir şey yok; onay state'ini tutan kanca (hook)
 * `lib/cokme-izni.ts` içinde. Ayrım `hata-gonder.ts` / `hata-kuyrugu.ts`
 * ikilisiyle aynı sebeple: saf mantık `lib/` altında React'siz kalmalı.
 */

import { Capacitor, registerPlugin } from '@capacitor/core'

export type CokmeDurumu = {
  /** Firebase gerçekten kurulu mu (google-services.json ile derlenmiş mi). */
  firebase: boolean
  /** Debug derlemesi mi — test düğmeleri yalnızca o zaman görünüyor. */
  test: boolean
}

type CokmeEklentisi = {
  durum(): Promise<CokmeDurumu>
  izinAyarla(secenekler: { acik: boolean }): Promise<void>
  bildir(secenekler: { kaynak: string; mesaj: string; yigin?: string }): Promise<void>
  testCokmesi(): Promise<void>
  testKayit(): Promise<void>
}

const KAPALI: CokmeDurumu = { firebase: false, test: false }

/**
 * Tarayıcı sahtesi.
 *
 * `npm run dev` sırasında hiçbir şey raporlanmıyor — geliştirirken çıkan
 * hatalar zaten konsolda duruyor ve Crashlytics'e düşerlerse gerçek
 * kullanıcı hatalarının arasına karışırlar.
 */
const sahte: CokmeEklentisi = {
  durum: async () => KAPALI,
  izinAyarla: async () => {},
  bildir: async () => {},
  testCokmesi: async () => {},
  testKayit: async () => {},
}

const eklenti = registerPlugin<CokmeEklentisi>('Cokme', { web: () => sahte })

function destekleniyor(): boolean {
  return Capacitor.isNativePlatform()
}

export async function cokmeDurumu(): Promise<CokmeDurumu> {
  if (!destekleniyor()) return KAPALI
  try {
    return await eklenti.durum()
  } catch {
    return KAPALI
  }
}

/** Kullanıcının kararını yerli tarafa geçirir. */
export async function cokmeIzniniUygula(acik: boolean): Promise<void> {
  if (!destekleniyor()) return
  try {
    await eklenti.izinAyarla({ acik })
  } catch {
    // Eklenti yoksa yapacak bir şey yok; uygulama çalışmaya devam etmeli.
  }
}

export async function testCokmesiTetikle(): Promise<void> {
  if (!destekleniyor()) return
  try {
    await eklenti.testCokmesi()
  } catch {
    // Release derlemede `unavailable` dönüyor — beklenen durum.
  }
}

export async function testKaydiTetikle(): Promise<void> {
  if (!destekleniyor()) return
  try {
    await eklenti.testKayit()
  } catch {
    // Release derlemede `unavailable` dönüyor — beklenen durum.
  }
}

/**
 * Bir oturumda gönderilecek en fazla hata.
 *
 * Yerli taraf da kendi sınırını uyguluyor (`CokmeRaporu.OTURUM_SINIRI`), ama
 * köprüden geçen her çağrının bedeli var: bozuk bir render döngüsünde saniyede
 * yüzlerce çağrı arayüzü kilitler. Ucuz olan tarafta, yani burada, erken
 * kesmek gerekiyor.
 */
const OTURUM_SINIRI = 24

/** Aynı hatanın tekrarı gönderilmiyor. */
const gorulenler = new Set<string>()
let sayac = 0
let kuruldu = false

function gonder(kaynak: string, mesaj: string, yigin?: string): void {
  if (!destekleniyor()) return
  if (sayac >= OTURUM_SINIRI) return

  const imza = `${kaynak}|${mesaj}`
  if (gorulenler.has(imza)) return
  gorulenler.add(imza)
  sayac++

  void eklenti.bildir({ kaynak, mesaj, yigin }).catch(() => {})
}

function metne(deger: unknown): string {
  if (deger instanceof Error) return `${deger.name}: ${deger.message}`
  if (typeof deger === 'string') return deger
  try {
    return JSON.stringify(deger) ?? String(deger)
  } catch {
    return String(deger)
  }
}

/**
 * Global JS hata yakalayıcıları kurar.
 *
 * Bu kanal `onConsoleMessage`'ın yerine geçmiyor, onu tamamlıyor: gerçek
 * `Error.stack` **yalnızca** buradan geliyor ve Crashlytics'in gruplaması
 * yığının tepesindeki kareye bakıyor. Yığın olmadan bütün web hataları tek
 * bir başlık altında toplanır ve rapor işe yaramaz hâle gelir.
 *
 * Dönen fonksiyon dinleyicileri kaldırıyor; `AppShell` bunu temizlikte
 * çağırıyor. İkinci kez kurulmaya karşı korumalı — React'in katı (strict)
 * modunda etkiler iki kez çalışıyor.
 */
export function cokmeYakalayiciyiKur(): () => void {
  if (typeof window === 'undefined' || !destekleniyor() || kuruldu) return () => {}
  kuruldu = true

  const hataDinleyici = (olay: ErrorEvent) => {
    // `olay.error` çoğu zaman bir Error; değilse (ör. `throw 'metin'`)
    // mesaja düşülüyor. Yığın yoksa yerli taraf tek karelik bir yığın üretiyor.
    const hata = olay.error
    gonder(
      'window.onerror',
      hata instanceof Error ? metne(hata) : olay.message || metne(hata),
      hata instanceof Error ? hata.stack : undefined,
    )
  }

  const sozDinleyici = (olay: PromiseRejectionEvent) => {
    const sebep = olay.reason
    gonder(
      'unhandledrejection',
      metne(sebep),
      sebep instanceof Error ? sebep.stack : undefined,
    )
  }

  window.addEventListener('error', hataDinleyici)
  window.addEventListener('unhandledrejection', sozDinleyici)

  return () => {
    window.removeEventListener('error', hataDinleyici)
    window.removeEventListener('unhandledrejection', sozDinleyici)
    kuruldu = false
  }
}
