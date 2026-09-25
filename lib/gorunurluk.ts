'use client'

/**
 * Uygulama önde mi?
 *
 * Android'de ana tuşa basıldığında WebView **durdurulmuyor**: `<audio>` çalmaya,
 * `setTimeout` işlemeye devam ediyor. Sonuç, uygulama görev listesinden
 * silinene kadar arkadan ses gelmesi ve aylık özetin müziğinin kimse bakmazken
 * çalmaya devam etmesiydi.
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
import { bugun } from './utils'

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

/**
 * Bugünün tarihi, 'YYYY-AA-GG' — gün dönünce yeniden çizdiren hâli.
 *
 * Android uygulamayı günlerce bellekte tutuyor; sabah açılan uygulama çoğu
 * zaman dün geceki oturumun devamı. `bugun()` her çizimde doğru günü veriyor
 * ama gün dönünce kendiliğinden bir çizim gelmiyor ve güne bağlı `useMemo`lar
 * dünkü değerde kalıyordu: ayın 1'inde uygulamayı arka plandan açan
 * kullanıcıya aylık özet kartı hiç çıkmıyordu — ve o kart yalnızca o gün var.
 *
 * Gün iki yerden yeniden soruluyor: uygulama öne geldiğinde (en sık yol) ve
 * dakikada bir (uygulama gece yarısını önde geçirirse). Değer değişmedikçe
 * state aynı kalıyor, çizim tetiklenmiyor.
 */
export function useBugun(): string {
  const [gun, setGun] = useState(bugun)

  useEffect(() => {
    const tazele = () => setGun(bugun())
    const zamanlayici = window.setInterval(tazele, 60_000)
    document.addEventListener('visibilitychange', tazele)
    const dinleyici = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) tazele()
    })
    return () => {
      window.clearInterval(zamanlayici)
      document.removeEventListener('visibilitychange', tazele)
      void dinleyici.then((d) => d.remove())
    }
  }, [])

  return gun
}
