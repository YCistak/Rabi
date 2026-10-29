'use client'

import { useEffect } from 'react'
import { KOYU_SORGU, TEMA_DEGISIYOR, TEMA_ZEMINI, temaCoz, type Tema, type TemaTercihi } from './tema'
import { yerliTemayaYaz } from './tema-yerli'

function uygula(tema: Tema) {
  const kok = document.documentElement
  if (kok.dataset.tema === tema) return
  kok.classList.add(TEMA_DEGISIYOR)
  kok.dataset.tema = tema
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', TEMA_ZEMINI[tema])
  // İki kare sonra: yeni renkler çizilmeden geçişler geri açılmasın.
  requestAnimationFrame(() => requestAnimationFrame(() => kok.classList.remove(TEMA_DEGISIYOR)))
}

/**
 * Tercihi `<html data-tema>`ya yazar; "Telefona uy"da telefonun modunu dinler.
 * Arka plandan dönüşte de bir kez okur — bazı WebView'ler arka plandayken
 * `change` olayını kaçırıyor.
 */
export function useTema(tercih: TemaTercihi) {
  useEffect(() => {
    yerliTemayaYaz(tercih)
    const sorgu = window.matchMedia?.(KOYU_SORGU)
    const guncelle = () => uygula(temaCoz(tercih, sorgu?.matches ?? false))
    guncelle()
    if (tercih !== 'sistem' || !sorgu) return
    const gorunurlukte = () => {
      if (document.visibilityState === 'visible') guncelle()
    }
    sorgu.addEventListener?.('change', guncelle)
    document.addEventListener('visibilitychange', gorunurlukte)
    return () => {
      sorgu.removeEventListener?.('change', guncelle)
      document.removeEventListener('visibilitychange', gorunurlukte)
    }
  }, [tercih])
}
