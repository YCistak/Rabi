'use client'

/**
 * Uygulama önde mi?
 *
 * Android'de ana tuşa basıldığında WebView **durdurulmuyor**: `<audio>` çalmaya,
 * `setTimeout` işlemeye devam ediyor. Sonuç, uygulama görev listesinden
 * silinene kadar arkadan müzik gelmesi ve haftalık özetin kimse bakmazken kart
 * kart ilerleyip bitmesiydi.
 *
 * İki kaynak birlikte dinleniyor:
 *
 * - `visibilitychange` — tarayıcıda ve WebView'da çalışır, ekran kilitlenince de
 *   tetiklenir.
 * - Capacitor'ın `appStateChange` olayı — bazı Android sürümlerinde uygulama
 *   arka plana geçerken `visibilitychange` gecikmeli geliyor; bu olay anında
 *   geliyor.
 *
 * Pomodoro bilerek bunu **kullanmıyor**: orada müziğin ekran kapalıyken de
 * devam etmesi isteniyor, sayaç zaten hedef zaman damgasıyla çalışıyor.
 */

import { useEffect, useState } from 'react'
import { App } from '@capacitor/app'

export function useUygulamaGorunur(): boolean {
  const [gorunur, setGorunur] = useState(true)

  useEffect(() => {
    const belgeDurumu = () => setGorunur(document.visibilityState === 'visible')
    belgeDurumu()
    document.addEventListener('visibilitychange', belgeDurumu)

    // Capacitor eklentisi web'de de yüklü ama olayı yalnızca cihazda üretiyor;
    // `catch` ile sarmalamak gerekmiyor, dinleyici sessizce boşa düşüyor.
    const dinleyici = App.addListener('appStateChange', ({ isActive }) => setGorunur(isActive))

    return () => {
      document.removeEventListener('visibilitychange', belgeDurumu)
      void dinleyici.then((d) => d.remove())
    }
  }, [])

  return gorunur
}
