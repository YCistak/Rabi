'use client'

import { useEffect, useRef } from 'react'

/**
 * Geri tuşu katmanları.
 *
 * `AppShell` yalnızca kendi bildiği katmanları biliyor: form → alt ekran →
 * sekme. Ama bir ekranın kendi içinde açtığı tam ekran katmanlar da var
 * (fotoğraf görüntüleyici, silme onayı). Bunlar `AppShell`'e taşınmadan geri
 * tuşuna cevap verebilsin diye burada bir yığın tutuluyor: açılan katman
 * kendini kaydeder, geri tuşu **en son açılanı** kapatır.
 *
 * Yığın olmasının sebebi iç içe açılabilmeleri: görüntüleyicinin üstünde silme
 * onayı açıkken geri tuşu önce onayı kapatmalı, görüntüleyiciyi değil.
 */

type Kapat = () => void

const katmanlar: Kapat[] = []

/** En üstteki katmanı kapatır. Katman yoksa `false` döner — geri tuşu devam eder. */
export function ustKatmaniKapat(): boolean {
  const kapat = katmanlar.pop()
  if (!kapat) return false
  kapat()
  return true
}

/**
 * Açık olduğu sürece geri tuşunu yakalayan katman.
 *
 * `kapat` çoğunlukla satır içi bir ok fonksiyonu olarak veriliyor, yani her
 * çizimde kimliği değişiyor. Doğrudan bağımlılık yapılsaydı katman her çizimde
 * yığından çıkıp yeniden eklenir, iç içe katmanların sırası bozulurdu. Bu
 * yüzden yığına sabit bir sarmalayıcı giriyor, güncel fonksiyon ref'te duruyor.
 */
export function useGeriKatmani(acik: boolean, kapat: () => void) {
  const kapatRef = useRef(kapat)
  kapatRef.current = kapat

  useEffect(() => {
    if (!acik) return
    const katman = () => kapatRef.current()
    katmanlar.push(katman)
    return () => {
      const yer = katmanlar.lastIndexOf(katman)
      if (yer !== -1) katmanlar.splice(yer, 1)
    }
  }, [acik])
}
