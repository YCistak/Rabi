'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Alttan açılan sayfayı aşağı çekerek kapatmak.
 *
 * Sayfaların hepsinde tepede bir tutamak çizgisi var ve o çizgi telefonda
 * "beni aşağı çek" diyor; ama sayfa yalnızca zemine dokununca ya da Kapat'a
 * basınca kapanıyordu. Kullanıcı tutamağı çekti, hiçbir şey olmadı.
 *
 * Kancanın döndürdüğü fonksiyon sayfanın kutusuna `ref` olarak veriliyor.
 * Dokunuş dinleyicileri React'in değil doğrudan öğenin: `touchmove` içinde
 * `preventDefault` çağırmak gerekiyor (yoksa WKWebView aynı hareketi sayfayı
 * esnetmek için de kullanıyor) ve React dokunuş dinleyicilerini pasif bağlıyor.
 *
 * Sürükleme yalnızca içerik **en üstteyken** başlıyor: kaydırılmış bir
 * listede aşağı çekmek önce listeyi yukarı kaydırmalı, sayfayı değil. Kontrol
 * dokunulan öğeden sayfaya kadar her atada yapılıyor — istatistik sayfası gibi
 * kaydırması iç bir kutuda olan sayfalar da var.
 *
 * Girişi oynatan `alt-pencere-girisi` dolgusu `both`: animasyon bittikten sonra
 * da `transform: none` yazmaya devam ediyor ve satır içi transformu eziyor.
 * Sürükleme başlarken animasyon bu yüzden kaldırılıyor.
 */
export function useAsagiKaydirKapat(onKapat: () => void) {
  const kapatRef = useRef(onKapat)
  kapatRef.current = onKapat
  const [kutu, setKutu] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!kutu) return
    let baslangicY = 0
    let baslangicZamani = 0
    let fark = 0
    /** Bu dokunuş sayfayı sürükleyebilir mi (içerik en üstte mi). */
    let aday = false
    let surukleniyor = false

    const ustteMi = (hedef: EventTarget | null): boolean => {
      let dugum = hedef instanceof HTMLElement ? hedef : null
      while (dugum) {
        if (dugum.scrollTop > 0) return false
        if (dugum === kutu) return true
        dugum = dugum.parentElement
      }
      return true
    }

    const basla = (olay: TouchEvent) => {
      surukleniyor = false
      fark = 0
      const hedef = olay.target instanceof HTMLElement ? olay.target : null
      // Sürgüler ve yazı alanları kendi hareketlerini kullanıyor.
      aday =
        olay.touches.length === 1 &&
        !hedef?.closest('input, textarea, [data-surukleme-yok]') &&
        ustteMi(olay.target)
      baslangicY = olay.touches[0]?.clientY ?? 0
      baslangicZamani = performance.now()
    }

    const hareket = (olay: TouchEvent) => {
      if (!aday) return
      const dy = (olay.touches[0]?.clientY ?? baslangicY) - baslangicY
      if (!surukleniyor) {
        // Yukarı hareket olağan kaydırma; küçük titremeler karar vermiyor.
        if (dy < -6) aday = false
        if (dy < 8) return
        surukleniyor = true
        kutu.style.animation = 'none'
        kutu.style.transition = 'none'
      }
      olay.preventDefault()
      fark = Math.max(0, dy - 8)
      kutu.style.transform = `translateY(${fark}px)`
    }

    const bitir = () => {
      aday = false
      if (!surukleniyor) return
      surukleniyor = false
      const hiz = fark / Math.max(1, performance.now() - baslangicZamani)
      // Ya yeterince uzağa çekildi ya da hızlıca fırlatıldı.
      const kapansin = fark > Math.min(140, kutu.offsetHeight * 0.3) || (hiz > 0.5 && fark > 40)
      kutu.style.transition = 'transform 220ms cubic-bezier(0.2, 0.7, 0.3, 1)'
      if (kapansin) {
        kutu.style.transform = `translateY(${kutu.offsetHeight + 40}px)`
        window.setTimeout(() => kapatRef.current(), 200)
      } else {
        kutu.style.transform = ''
      }
    }

    kutu.addEventListener('touchstart', basla, { passive: true })
    kutu.addEventListener('touchmove', hareket, { passive: false })
    kutu.addEventListener('touchend', bitir)
    kutu.addEventListener('touchcancel', bitir)
    return () => {
      kutu.removeEventListener('touchstart', basla)
      kutu.removeEventListener('touchmove', hareket)
      kutu.removeEventListener('touchend', bitir)
      kutu.removeEventListener('touchcancel', bitir)
    }
  }, [kutu])

  return setKutu
}
