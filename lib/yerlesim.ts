'use client'

import { useSyncExternalStore } from 'react'

/**
 * Tablet yerleşimi — JS tarafı.
 *
 * Yerleşim betiği (`app/layout.tsx`) `<html>`e `data-yerlesim="tablet"` ve
 * `data-yon="yatay|dikey"` yazıyor; CSS `tablet:` / `yatay:` varyantlarıyla
 * onlara bakıyor (`globals.css` → "Tablet yerleşimi"). Çoğu ekran için CSS
 * yetiyor; bu kanca yalnızca sütun sayısını **hesapta** kullanan yerler için
 * (Oyunlar'ın ızgarasında tek kalan kartın geniş çizilmesi gibi).
 */
export type Yerlesim = 'telefon' | 'tablet-dikey' | 'tablet-yatay'

function oku(): Yerlesim {
  const kok = document.documentElement
  if (kok.dataset.yerlesim !== 'tablet') return 'telefon'
  return kok.dataset.yon === 'yatay' ? 'tablet-yatay' : 'tablet-dikey'
}

function abone(degisti: () => void): () => void {
  // Öznitelikleri betik `resize`da yeniden yazıyor; döndürünce değişiyor.
  const gozcu = new MutationObserver(degisti)
  gozcu.observe(document.documentElement, { attributes: true, attributeFilter: ['data-yerlesim', 'data-yon'] })
  return () => gozcu.disconnect()
}

export function useYerlesim(): Yerlesim {
  return useSyncExternalStore(abone, oku, () => 'telefon')
}

/** Kart ızgaralarının sütun sayısı: telefonda 2, dikey tablette 3, yatayda 4. */
export function izgaraSutunu(yerlesim: Yerlesim): number {
  return yerlesim === 'tablet-yatay' ? 4 : yerlesim === 'tablet-dikey' ? 3 : 2
}
