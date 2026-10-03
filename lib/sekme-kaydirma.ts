'use client'

import { useEffect, useRef } from 'react'
import type { Sekme } from './gezinme'

/**
 * Ana menüde parmakla yana kaydırarak komşu sekmeye geçmek.
 *
 * Kullanıcı istedi: Araçlar'dayken bir yana kaydırınca Ana Sayfa, öbür yana
 * kaydırınca Harita açılsın. Yön, sayfalı ekranların alışılmış yönü: parmak
 * **sağa** giderse soldaki sekme (sayfa sağa itiliyor, soldaki geliyor),
 * **sola** giderse sağdaki.
 *
 * Yalnızca alt menünün beş sekmesinin kendi ekranlarında çalışıyor; bir
 * araç, form, oyun, deste ya da açık bir pencere varken kapalı (çağıran
 * `etkin` ile söylüyor). Kenardan başlayan hareket sayılmıyor: iOS'ta sol
 * kenar geri kaydırma, Android'de iki kenar sistemin geri hareketi.
 * Yatay kayan bir şeridin (ders çipleri, hafta şeridi) ya da bir yazı
 * alanının içinden başlayan hareket de sayılmıyor — onların kendi kaydırması.
 */

/** Alt menüdeki sıra; `bottom-nav.tsx` de bunu çiziyor. */
export const SEKME_SIRASI: readonly Sekme[] = ['ana', 'daha', 'harita', 'oyunlar', 'ayarlar']

/** Kenara bu kadar yakın başlayan hareket sistemin (geri) hareketi. */
export const KENAR_PAYI = 28
/** Bu kadar yatay yol almadan sekme değişmiyor. */
export const EN_AZ_YOL = 70
/** Yatay yol dikeyin en az bu katı olmalı; yoksa sayfayı kaydırıyordur. */
export const YATAYLIK = 1.6
/** Bu süreden uzun basılı tutulan hareket kaydırma değil sürükleme. */
export const EN_UZUN_SURE = 700

/**
 * Hareketin sonucu: −1 soldaki sekme, +1 sağdaki, 0 hiçbir şey.
 *
 * `baslangicX` kenar denetimi için, `dx`/`dy` toplam yol, `sure` milisaniye.
 */
export function kaydirmaYonu(
  baslangicX: number,
  dx: number,
  dy: number,
  sure: number,
  genislik: number,
): -1 | 0 | 1 {
  if (baslangicX < KENAR_PAYI || baslangicX > genislik - KENAR_PAYI) return 0
  if (sure > EN_UZUN_SURE) return 0
  if (Math.abs(dx) < EN_AZ_YOL) return 0
  if (Math.abs(dx) < Math.abs(dy) * YATAYLIK) return 0
  return dx > 0 ? -1 : 1
}

/** Komşu sekme; uçta `null` (ilk sekmenin solunda bir şey yok). */
export function komsuSekme(sekme: Sekme, yon: -1 | 1): Sekme | null {
  const sira = SEKME_SIRASI.indexOf(sekme) + yon
  return SEKME_SIRASI[sira] ?? null
}

/**
 * Yeni sekmenin hangi yandan geleceği. Ekran kurulurken bir kez okunuyor
 * (`SayfaGecisi`), geri kaydırmadaki yön işaretinin aynısı.
 */
let yon: { taraf: 'sol' | 'sag'; zaman: number } | null = null
const YON_OMRU_MS = 400

export function sekmeGecisYonu(): 'sol' | 'sag' | null {
  if (!yon || typeof performance === 'undefined' || performance.now() - yon.zaman >= YON_OMRU_MS) return null
  return yon.taraf
}

/** Kaydırarak sekme değiştirmeyi dinler. */
export function useSekmeKaydirma(
  sekme: Sekme,
  /** Her dokunuşta soruluyor: açılan bir pencere AppShell'i yeniden çizmiyor. */
  etkin: () => boolean,
  sekmeyeGec: (sekme: Sekme) => void,
) {
  const durum = useRef({ sekme, etkin, sekmeyeGec })
  durum.current = { sekme, etkin, sekmeyeGec }

  useEffect(() => {
    let bas: { x: number; y: number; zaman: number } | null = null

    const yatayKayanIcinde = (hedef: EventTarget | null): boolean => {
      let el = hedef instanceof Element ? hedef : null
      if (el?.closest('input, textarea, select, [contenteditable], nav, [data-sekme-kaydirma-yok]')) return true
      while (el && el !== document.body) {
        if (el instanceof HTMLElement && el.scrollWidth > el.clientWidth + 1) {
          const tasma = getComputedStyle(el).overflowX
          if (tasma === 'auto' || tasma === 'scroll') return true
        }
        el = el.parentElement
      }
      return false
    }

    const basla = (olay: TouchEvent) => {
      bas = null
      if (!durum.current.etkin() || olay.touches.length !== 1) return
      if (yatayKayanIcinde(olay.target)) return
      const t = olay.touches[0]
      bas = { x: t.clientX, y: t.clientY, zaman: performance.now() }
    }

    const bitir = (olay: TouchEvent) => {
      const b = bas
      bas = null
      if (!b || !durum.current.etkin()) return
      const t = olay.changedTouches[0]
      if (!t) return
      const y = kaydirmaYonu(b.x, t.clientX - b.x, t.clientY - b.y, performance.now() - b.zaman, window.innerWidth)
      if (y === 0) return
      const hedef = komsuSekme(durum.current.sekme, y)
      if (!hedef) return
      yon = { taraf: y === 1 ? 'sag' : 'sol', zaman: performance.now() }
      durum.current.sekmeyeGec(hedef)
    }

    const iptal = () => {
      bas = null
    }

    window.addEventListener('touchstart', basla, { passive: true })
    window.addEventListener('touchend', bitir, { passive: true })
    window.addEventListener('touchcancel', iptal, { passive: true })
    return () => {
      window.removeEventListener('touchstart', basla)
      window.removeEventListener('touchend', bitir)
      window.removeEventListener('touchcancel', iptal)
    }
  }, [])
}
