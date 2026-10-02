'use client'

import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { androidMu, iosMu } from '@/lib/platform'
import { GeriKaydirmaDenetcisi, type Kutu } from '@/lib/geri-kaydirma-denetci'

/**
 * Kenardan kaydırarak geri gitmenin görsel tarafı (iOS ve Android).
 *
 * Hareketin **tanınması** yerli tarafta: iOS'ta `AnaDenetleyici.swift`
 * (`UIScreenEdgePanGestureRecognizer`), Android 14+'ta `MainActivity.java`
 * (sistemin öngörülü geri hareketi, `OnBackPressedCallback`). JS'te dokunuşla
 * tanımak sayfanın kendi kaydırmasıyla ve Android'de sistemin geri
 * hareketiyle yarışırdı. İki taraf da aynı arayüzü çağırıyor:
 *
 *   window.rabiGeriKaydirma.basla() → ilerle(dx)… → bitir() | iptal()
 *
 * iOS bırakmayı eskisi gibi `rabiGeri` olayıyla da bildiriyor; o da `bitir`.
 * Mantık `GeriKaydirmaDenetcisi`nde (`lib/geri-kaydirma-denetci.ts`), burası
 * yalnızca onu DOM'a ve React'e bağlıyor.
 *
 * Uygulama tek sayfa ve bir önceki ekran DOM'da durmuyor; kayan sayfanın
 * altında sayfa zemini görünüyor. Sayfa çıkınca önceki ekran **aynı karede**
 * kuruluyor (`flushSync`) ve soldan kısa bir kayışla geliyor
 * (`.sayfa-geri`, globals.css).
 *
 * Kayan kutu yalnızca `[data-geri-sayfa]` (ekran içeriği); alt menü gibi
 * `fixed` öğeler transformlu bir atanın içine girmesin diye kutunun dışında.
 */

type Kolu = {
  basla: () => void
  ilerle: (dx: number) => void
  iptal: () => void
  bitir: () => void
}

declare global {
  interface Window {
    rabiGeriKaydirma?: Kolu
  }
}

/**
 * Kenardan kaydırmayı yok sayan kilitlerin sayısı.
 *
 * Yanlış soru fotoğrafına çizerken sol kenardan başlayan bir çizgi yerli
 * tarafta kenardan kaydırma olarak da tanınıyordu ve çizimi kaydedip
 * kapatıyordu (geri, çizimde "kaydet ve çık" demek). Hareketin tanınmasını
 * yerli taraf yapıyor ve parmağın sayfaya da ulaşması gerekiyor (çizgi o),
 * yani tanımayı kapatmak değil, tanınanı burada yok saymak gerekiyordu.
 * Çizimden çıkmanın yolu Vazgeç/Kaydet. Android'de kilit yalnızca sürüklemeyi
 * kapatıyor; geri hareketi geri tuşu demek ve geri tuşu kilide bakmıyor,
 * orada geri hâlâ kaydedip çıkıyor.
 *
 * Alt menüyü sürüklerken de kilitli (`bottom-nav.tsx`): sol kenardan başlayan
 * bir menü sürüklemesi sayfayı da kaydırıp geri gidiyordu.
 *
 * Sayaç, bayrak değil: iki yer aynı anda kilitlerse ilki açınca ikincisi
 * kilitli kalmalı.
 */
let kilitler = 0

/** Kilidi koyar; dönen fonksiyon kaldırır. Bir etkinin dönüşüne verilmek için. */
export function geriKaydirmayiKilitle(): () => void {
  kilitler++
  let acildi = false
  return () => {
    if (acildi) return
    acildi = true
    kilitler--
  }
}

/**
 * Geri yön işareti. Kaydırarak geri gidilince bir sonraki kurulan ekran
 * soldan gelsin diye. Eskiden kökte bir `data-gecis-yon` özniteliğiydi ve
 * 400 ms sonra siliniyordu: (1) öznitelik konduğu anda **çıkan** sayfanın
 * animasyonunu da `sayfaSoldan`a çeviriyor, sayfa sağa çıkacağına soldan geri
 * giriyordu; (2) silindiğinde yeni ekranın animasyonu `sayfaGirisi`ne dönüp
 * opaklık 0'dan **baştan** oynuyordu (bir kare boş ekran). Artık ekran
 * kurulurken bir kez okunup kutunun kendi sınıfı oluyor (`SayfaGecisi`).
 */
let geriYonuZamani = -Infinity
const YON_OMRU_MS = 400

export function geriYonunuIsaretle() {
  geriYonuZamani = performance.now()
}

/** Şu an kurulan ekran kaydırarak geri gelinen ekran mı? */
export function geriGecisiMi(): boolean {
  return typeof performance !== 'undefined' && performance.now() - geriYonuZamani < YON_OMRU_MS
}

function olcek(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--olcek'))
  return Number.isFinite(v) && v > 0 ? v : 1
}

/**
 * `kaydirilabilir`: geri gidilecek bir yer var ve sürüklemeyi bozacak bir
 * katman (tam ekran test, açık pencere, tanıtım turu) yok. Yanlışsa parmak
 * hiçbir şeyi oynatmaz; bırakılınca `geriGit` doğrudan çalışır.
 *
 * `geriGit` gidecek yer kalmadıysa `false` dönmeli; o zaman `cikis` çağrılır.
 */
export function useGeriKaydirma(kaydirilabilir: () => boolean, geriGit: () => boolean, cikis: () => void) {
  const kaydirRef = useRef(kaydirilabilir)
  const geriRef = useRef(geriGit)
  const cikisRef = useRef(cikis)
  kaydirRef.current = kaydirilabilir
  geriRef.current = geriGit
  cikisRef.current = cikis

  useEffect(() => {
    const ios = iosMu()
    if (!ios && !androidMu()) return

    let olcekDegeri = 1
    const denetci = new GeriKaydirmaDenetcisi({
      kutuBul: () => {
        olcekDegeri = olcek()
        return document.querySelector<HTMLElement>('[data-geri-sayfa]')
      },
      kaydirilabilir: () => kaydirRef.current(),
      kilitli: () => kilitler > 0,
      kilitBirakmayiYutar: ios,
      // Ekran aynı görevde değişmeli: değişim React'in bir sonraki işine
      // kalınca kutu bir kare boyunca ekranın dışında ya da (eski hâlinde)
      // yerinde eski ekranı gösteriyordu.
      geriGit: () => {
        let sonuc = false
        flushSync(() => {
          sonuc = geriRef.current()
        })
        return sonuc
      },
      cikis: () => cikisRef.current(),
      yonIsaretle: geriYonunuIsaretle,
      yonuTemizle: () => {
        geriYonuZamani = -Infinity
      },
      anlikKonum: (kutu: Kutu) => {
        const t = getComputedStyle(kutu as unknown as HTMLElement).transform
        return t && t !== 'none' ? new DOMMatrix(t).m41 * olcekDegeri : 0
      },
      sabitleriGizle: (kutu: Kutu) => {
        // Transformlu kutu içindeki `fixed` öğelerin kapsayıcı bloğu olur:
        // ekranın altındaki bir bildirim sayfanın (uzun) dibine kayardı.
        // Kaydırma boyunca gizleniyor; vazgeçilirse geri geliyor.
        const el = kutu as unknown as HTMLElement
        const gizlenen = [...el.querySelectorAll<HTMLElement>('.fixed')].filter(
          (x) => getComputedStyle(x).position === 'fixed',
        )
        const eski = gizlenen.map((x) => x.style.visibility)
        gizlenen.forEach((x) => (x.style.visibility = 'hidden'))
        return () => gizlenen.forEach((x, i) => (x.style.visibility = eski[i]))
      },
      genislik: () => window.innerWidth,
      olcek: () => olcekDegeri,
      azaltilmis: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      simdi: () => performance.now(),
      zamanla: (is, ms) => window.setTimeout(is, ms),
      zamanlamaIptal: (k) => window.clearTimeout(k as number),
    })

    window.rabiGeriKaydirma = {
      basla: denetci.basla,
      ilerle: denetci.ilerle,
      iptal: denetci.iptal,
      bitir: denetci.bitir,
    }
    // iOS'un yerli tarafı bırakmayı bu olayla bildiriyor (eski ve tek yol).
    window.addEventListener('rabiGeri', denetci.bitir)
    return () => {
      window.removeEventListener('rabiGeri', denetci.bitir)
      delete window.rabiGeriKaydirma
      denetci.birak()
    }
  }, [])
}
