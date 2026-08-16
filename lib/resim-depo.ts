'use client'

import { useEffect, useState } from 'react'
import { clear, createStore, del, get, keys, set, type UseStore } from 'idb-keyval'

/**
 * Fotoğraf deposu — IndexedDB.
 *
 * Fotoğraflar bilerek localStorage'a **yazılmıyor**: kota ~5 MB ve base64
 * kodlaması boyutu %33 şişiriyor; birkaç soru fotoğrafında kota dolar ve
 * localStorage'a yazan her şey (denemeler, notlar, ayarlar) sessizce
 * kaydedilemez hâle gelirdi. Burada blob'lar ikili olarak, kotası çok daha
 * geniş olan IndexedDB'de duruyor; `YanlisSoru` kaydı yalnızca anahtarı tutuyor.
 */

/**
 * Depo ilk kullanımda açılır. `createStore` çağrıldığı anda `indexedDB.open`
 * çalıştığı için modül yüklenirken açmak, IndexedDB'si olmayan ortamlarda
 * (birim testleri, sunucu tarafı derleme) dosyayı içe aktarmayı bile hataya
 * düşürürdü.
 */
let depoOnbellek: UseStore | null = null

function depo(): UseStore {
  depoOnbellek ??= createStore('rabi-resimler', 'resimler')
  return depoOnbellek
}

export async function resimYaz(id: string, blob: Blob): Promise<void> {
  await set(id, blob, depo())
}

export async function resimOku(id: string): Promise<Blob | undefined> {
  return get<Blob>(id, depo())
}

export async function resimSil(id: string): Promise<void> {
  await del(id, depo())
}

export async function tumResimleriSil(): Promise<void> {
  await clear(depo())
}

/**
 * Kaydı silinmiş ama blob'u depoda kalmış fotoğrafları temizler.
 *
 * Kayıt (localStorage) ile blob (IndexedDB) iki ayrı yerde tutulduğu için
 * silme işleminin ortasında uygulama kapanırsa öksüz blob kalabilir. Bu
 * fonksiyon banka ekranı açıldığında bir kez çalışır ve yeri boşa işgal eden
 * blob'ları atar.
 */
export async function oksuzResimleriSil(kullanilanIdler: string[]): Promise<number> {
  const kullanilan = new Set(kullanilanIdler)
  const mevcut = await keys(depo())
  const oksuz = mevcut.filter((k): k is string => typeof k === 'string' && !kullanilan.has(k))
  await Promise.all(oksuz.map((k) => del(k, depo())))
  return oksuz.length
}

/**
 * Blob'u `<img src>` için geçici bir nesne adresine (object URL) çevirir.
 *
 * Adres bileşen ekrandan kalkarken serbest bırakılıyor; bırakılmazsa galeride
 * gezindikçe blob'lar bellekte birikir. `iptal` bayrağı, okuma bitmeden bileşen
 * kaldırılırsa oluşan adresin de sızmasını engelliyor.
 */
export function useResimUrl(resimId: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!resimId) {
      setUrl(null)
      return
    }

    let iptal = false
    let olusan: string | null = null

    void resimOku(resimId).then((blob) => {
      if (!blob) return
      olusan = URL.createObjectURL(blob)
      if (iptal) {
        URL.revokeObjectURL(olusan)
        return
      }
      setUrl(olusan)
    })

    return () => {
      iptal = true
      if (olusan) URL.revokeObjectURL(olusan)
      setUrl(null)
    }
  }, [resimId])

  return url
}

// ---------------------------------------------------------------------------
// Yedekleme
// ---------------------------------------------------------------------------

/**
 * Fotoğrafları yedeğe konabilecek biçime çevirir (`data:` adresi).
 *
 * Boyutu yaklaşık üçte bir şişiriyor (base64), o yüzden yalnızca kullanıcı
 * fotoğraflı yedek istediğinde çağrılıyor. Depoda bulunamayan kimlikler
 * atlanıyor — eksik bir kayıt yüzünden bütün yedek başarısız olmasın.
 */
export async function resimleriDisaAktar(
  idler: string[],
): Promise<Record<string, string>> {
  const harita: Record<string, string> = {}
  for (const id of idler) {
    const blob = await resimOku(id)
    if (!blob) continue
    harita[id] = await blobdanDataUrl(blob)
  }
  return harita
}

/**
 * Yedekteki fotoğrafları depoya yazar. Geri yükleme bütün veriyi değiştirdiği
 * için önce mevcut fotoğraflar siliniyor; yoksa eski yedeğin fotoğrafları
 * kayıtsız kalıp yer işgal ederdi.
 */
export async function resimleriIceAktar(harita: Record<string, string>): Promise<void> {
  await tumResimleriSil()
  for (const [id, dataUrl] of Object.entries(harita)) {
    const blob = await (await fetch(dataUrl)).blob()
    await resimYaz(id, blob)
  }
}

/** Toplam fotoğraf boyutu (bayt) — yedek almadan önce kullanıcıya gösterilir. */
export async function resimBoyutu(idler: string[]): Promise<number> {
  let toplam = 0
  for (const id of idler) {
    const blob = await resimOku(id)
    if (blob) toplam += blob.size
  }
  return toplam
}

function blobdanDataUrl(blob: Blob): Promise<string> {
  return new Promise((coz, sik) => {
    const okuyucu = new FileReader()
    okuyucu.onload = () => coz(String(okuyucu.result))
    okuyucu.onerror = () => sik(okuyucu.error)
    okuyucu.readAsDataURL(blob)
  })
}
