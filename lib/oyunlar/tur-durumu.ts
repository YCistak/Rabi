'use client'

/**
 * Tur sonu ekranı açık mı — müziğin bilmesi gereken tek şey.
 *
 * Müzik `components/ekranlar/oyunlar.tsx` içinde kuruluyor ama turun bittiğini
 * yalnızca `TurSonu` biliyor (`components/oyun-kabuk.tsx`). Aradaki yol 18 oyun
 * dosyasından geçiyor: her oyun kendi `SonucGorunumu`'nu çiziyor, oyunlar.tsx
 * onların iç aşamasını görmüyor.
 *
 * Bilgiyi prop olarak geçirmek 18 dosyaya birer satır eklemek demekti — mod
 * müziğinin kendisi de (`mod-muzigi.ts`) tam bu sebeple modül düzeyinde tekil
 * duruyor, oradaki gerekçenin aynısı. Burada da tek bir bayrak ve ona abone
 * olan bir kanca var; state kütüphanesi değil, iki fonksiyonluk bir anahtar.
 *
 * Bayrağı `TurSonu` kuruyor: ekran açılınca `true`, kapanınca `false`.
 * "Kapanınca" iki anlama geliyor ve ikisi de doğru sonucu veriyor:
 * - **Tekrar**: yeni tur başlıyor, müzik geri geliyor.
 * - **Çık**: oyun ekranı kapanıyor, `acikOyun` null oluyor ve müzik zaten
 *   oyunlar.tsx tarafında susuyor.
 */

import { useSyncExternalStore } from 'react'

let turSonu = false
const dinleyiciler = new Set<() => void>()

/** `TurSonu` ekranı açılıp kapandıkça çağrılıyor. */
export function turSonuBildir(deger: boolean) {
  if (turSonu === deger) return
  turSonu = deger
  for (const dinleyici of dinleyiciler) dinleyici()
}

function abone(dinleyici: () => void) {
  dinleyiciler.add(dinleyici)
  return () => {
    dinleyiciler.delete(dinleyici)
  }
}

function oku() {
  return turSonu
}

/**
 * Sunucuda çizilen HTML'de tur sonu diye bir şey yok.
 *
 * `useSyncExternalStore`'un üçüncü argümanı olmadan statik export sırasında
 * hata veriyor; sabit `false` doğru cevap çünkü tur ancak tarayıcıda başlıyor.
 */
function sunucudaOku() {
  return false
}

export function useTurSonu(): boolean {
  return useSyncExternalStore(abone, oku, sunucudaOku)
}
