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
 * yükleniyor, "Gönderme" derse siliniyor.
 *
 * Önce Ayarlar'da bir anahtar vardı ve açıksa her şey kendiliğinden
 * gidiyordu. Çökmeden **sonra** sormak daha dürüst: kullanıcı neyin
 * gönderileceğini soyut bir ayar olarak değil, gerçekten olmuş bir olay
 * olarak görüyor. Play'in kullanıcı verisi politikası da olumlu bir eylem
 * istiyor ve bu onun en net hâli.
 *
 * Global JS hata yakalayıcıları soruya bakmadan kuruluyor: yakalanan hata
 * zaten ağa çıkmıyor, cihazda bekliyor.
 */

import { useCallback, useEffect, useState } from 'react'
import { ANAHTARLAR, useYerelDepo } from './depo'
import { bekleyenCokme, cokmeYakalayiciyiKur, cokmeleriGonder, cokmeleriSil } from './cokme'

export interface CokmeKolu {
  /** Pencere görünsün mü. */
  soruAcik: boolean
  /** Önceki oturum gerçekten çökmeyle mi bitti — pencerenin metnini seçiyor. */
  cokmeyleBitti: boolean
  onGonder: () => void
  onGonderme: () => void
  /** Kullanıcı "bir daha sorma" dedi mi — Ayarlar'dan geri alınabiliyor. */
  sorulsun: boolean
  onSorulsun: (deger: boolean) => void
}

export function useCokmeRaporu(): CokmeKolu {
  const [sorulsun, setSorulsun] = useYerelDepo<boolean>(ANAHTARLAR.cokmeSorusu, true)
  const [soruAcik, setSoruAcik] = useState(false)
  const [cokmeyleBitti, setCokmeyleBitti] = useState(false)

  useEffect(() => cokmeYakalayiciyiKur(), [])

  /*
    Açılışta bir kez soruluyor.

    `sorulsun` kapalıysa bekleyenler **siliniyor**: kullanıcı sorulmasını
    istemiyor demek, cihazda süresiz bekleyen bir kuyruk tutmak değil.
  */
  useEffect(() => {
    let iptal = false
    void bekleyenCokme().then(({ bekleyen, cokme }) => {
      if (iptal || !bekleyen) return
      if (!sorulsun) {
        void cokmeleriSil()
        return
      }
      setCokmeyleBitti(cokme)
      setSoruAcik(true)
    })
    return () => {
      iptal = true
    }
    // Yalnızca açılışta: `sorulsun` sonradan değişirse soru yeniden açılmamalı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onGonder = useCallback(() => {
    setSoruAcik(false)
    void cokmeleriGonder()
  }, [])

  const onGonderme = useCallback(() => {
    setSoruAcik(false)
    void cokmeleriSil()
  }, [])

  return {
    soruAcik,
    cokmeyleBitti,
    onGonder,
    onGonderme,
    sorulsun,
    onSorulsun: setSorulsun,
  }
}
