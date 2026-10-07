'use client'

/**
 * Çökme raporu sorusunun sahibi.
 *
 * `lib/hata-kuyrugu.ts` ile aynı desen: saf köprü `lib/cokme.ts`'te, React'e
 * bağlı olan kısım burada.
 *
 * **Akış:** Crashlytics'in otomatik gönderimi hiç açılmıyor. Çökme cihazda
 * saklanıyor; uygulama yeniden açıldığında bekleyen rapor olup olmadığı
 * soruluyor ve varsa kullanıcıya bir pencere çıkıyor. "Gönder" derse
 * yükleniyor, "Gönderme" derse siliniyor. Soru **yalnız gerçek çökmede**
 * soruluyor; WebView'in yazdığı non-fatal kayıtlar sormadan siliniyor
 * (kullanıcı istedi, 2026-10 — karar `lib/cokme-karari.ts`).
 *
 * Önce Ayarlar'da bir anahtar vardı ve açıksa her şey kendiliğinden
 * gidiyordu. Çökmeden **sonra** sormak daha dürüst: kullanıcı neyin
 * gönderileceğini soyut bir ayar olarak değil, gerçekten olmuş bir olay
 * olarak görüyor. Play'in kullanıcı verisi politikası da olumlu bir eylem
 * istiyor ve bu onun en net hâli.
 *
 * Sonra ayarlarda "çöktüğümde sor" anahtarı kaldı; o da kalktı. Soru her
 * çökmeden sonra çıkıyor ve "Gönderme" raporu siliyor — anahtar aynı hayırı
 * önceden söylemekten başka bir işe yaramıyordu.
 *
 * Global JS hata yakalayıcıları soruya bakmadan kuruluyor: yakalanan hata
 * zaten ağa çıkmıyor, cihazda bekliyor.
 */

import { useCallback, useEffect, useState } from 'react'
import { bekleyenCokme, cokmeYakalayiciyiKur, cokmeleriGonder, cokmeleriSil } from './cokme'
import { bekleyenRaporKarari, CEVAPSIZ_COKME_ANAHTARI } from './cokme-karari'

function cevapsizCokmeOku(): boolean {
  try { return localStorage.getItem(CEVAPSIZ_COKME_ANAHTARI) === 'true' } catch { return false }
}

function cevapsizCokmeYaz(deger: boolean): void {
  try {
    if (deger) localStorage.setItem(CEVAPSIZ_COKME_ANAHTARI, 'true')
    else localStorage.removeItem(CEVAPSIZ_COKME_ANAHTARI)
  } catch {
    // Yazılamazsa en kötü ihtimalle cevaplanmamış çökme bir sonraki açılışta silinir.
  }
}

export interface CokmeKolu {
  /** Pencere görünsün mü. */
  soruAcik: boolean
  onGonder: () => void
  onGonderme: () => void
}

export function useCokmeRaporu(): CokmeKolu {
  const [soruAcik, setSoruAcik] = useState(false)

  useEffect(() => cokmeYakalayiciyiKur(), [])

  /*
    Açılışta bir kez soruluyor. Pencere yalnız gerçek çökmede açılıyor;
    çökme olmayan bekleyen kayıtlar sormadan siliniyor (`lib/cokme-karari.ts`).
  */
  useEffect(() => {
    let iptal = false
    void bekleyenCokme().then(({ bekleyen, cokme }) => {
      if (iptal) return
      const eylem = bekleyenRaporKarari({ bekleyen, cokme, cevapsizCokme: cevapsizCokmeOku() })
      if (eylem === 'sil') {
        cevapsizCokmeYaz(false)
        void cokmeleriSil()
      } else if (eylem === 'sor') {
        cevapsizCokmeYaz(true)
        setSoruAcik(true)
      }
    })
    return () => {
      iptal = true
    }
  }, [])

  const onGonder = useCallback(() => {
    setSoruAcik(false)
    cevapsizCokmeYaz(false)
    void cokmeleriGonder()
  }, [])

  const onGonderme = useCallback(() => {
    setSoruAcik(false)
    cevapsizCokmeYaz(false)
    void cokmeleriSil()
  }, [])

  return {
    soruAcik,
    onGonder,
    onGonderme,
  }
}
