'use client'

import { useEffect, useRef } from 'react'
import { iosMu } from '@/lib/platform'

/**
 * iOS'ta kenardan geri kaydırmanın görsel tarafı.
 *
 * Hareketin **tanınması** yerli tarafta (`AnaDenetleyici.swift`,
 * `UIScreenEdgePanGestureRecognizer`): JS'te dokunuşla tanımak sayfanın kendi
 * kaydırmasıyla yarışıyordu. Eskiden yerli taraf yalnızca parmak kalkınca
 * `rabiGeri` olayı yolluyordu ve ekran animasyonsuz, bir anda değişiyordu.
 * Şimdi yerli taraf parmak hareket ederken de `window.rabiGeriKaydirma`yı
 * çağırıyor; sayfa parmağı izliyor, bırakılınca ya dışarı kayıyor ya geri
 * yerine oturuyor.
 *
 * Uygulama tek sayfa ve bir önceki ekran DOM'da durmuyor; bu yüzden altta
 * önceki ekranın görünmesi (yerli UINavigationController gibi) yok — kayan
 * sayfanın altında sayfa zemini görünüyor. Sayfa kayınca önceki ekran soldan
 * kısa bir kayışla geliyor (`data-gecis-yon="geri"`, globals.css).
 *
 * Kayan kutu yalnızca `[data-geri-sayfa]` (ekran içeriği); alt menü gibi
 * `fixed` öğeler transformlu bir atanın içine girmesin diye kutunun dışında.
 * Android'de hiçbir şey yapmaz.
 */

type Kolu = {
  basla: () => void
  ilerle: (dx: number) => void
  iptal: () => void
}

declare global {
  interface Window {
    rabiGeriKaydirma?: Kolu
  }
}

const BIRAKMA_MS = 200

function olcek(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--olcek'))
  return Number.isFinite(v) && v > 0 ? v : 1
}

function azaltilmisHareket(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Geri gidiş yönünü bir süre işaretler: önceki ekran soldan gelsin. */
export function geriYonunuIsaretle() {
  if (!iosMu()) return
  const kok = document.documentElement
  kok.dataset.gecisYon = 'geri'
  window.setTimeout(() => {
    delete kok.dataset.gecisYon
  }, 400)
}

/**
 * `kaydirilabilir`: geri gidilecek bir yer var ve sürüklemeyi bozacak bir
 * katman (tam ekran test, açık pencere) yok. Yanlışsa parmak hiçbir şeyi
 * oynatmaz; bırakılınca `geriGit` doğrudan çalışır.
 */
export function useGeriKaydirma(kaydirilabilir: () => boolean, geriGit: () => void) {
  const kaydirRef = useRef(kaydirilabilir)
  const geriRef = useRef(geriGit)
  kaydirRef.current = kaydirilabilir
  geriRef.current = geriGit

  useEffect(() => {
    if (!iosMu()) return

    let kutu: HTMLElement | null = null
    let sonDx = 0
    let bitiyor = false

    const temizle = () => {
      if (kutu) {
        kutu.style.transition = ''
        kutu.style.transform = ''
        kutu.style.boxShadow = ''
        kutu.style.willChange = ''
      }
      kutu = null
      sonDx = 0
      bitiyor = false
    }

    const basla = () => {
      if (bitiyor) return
      temizle()
      if (!kaydirRef.current()) return
      const el = document.querySelector<HTMLElement>('[data-geri-sayfa]')
      if (!el) return
      kutu = el
      el.style.transition = 'none'
      el.style.willChange = 'transform'
      el.style.boxShadow = '-10px 0 28px rgba(0, 0, 0, 0.10)'
    }

    const ilerle = (dx: number) => {
      if (!kutu || bitiyor) return
      sonDx = Math.max(0, dx)
      kutu.style.transform = `translateX(${sonDx / olcek()}px)`
    }

    const iptal = () => {
      if (!kutu || bitiyor) return
      const el = kutu
      if (azaltilmisHareket()) return temizle()
      el.style.transition = `transform ${BIRAKMA_MS}ms cubic-bezier(0.2, 0.7, 0.3, 1)`
      el.style.transform = 'translateX(0px)'
      bitiyor = true
      window.setTimeout(temizle, BIRAKMA_MS + 30)
    }

    // Yerli taraf parmağı kaldırınca yollar (eski ve tek yol).
    const onayla = () => {
      const el = kutu
      if (!el || bitiyor) {
        geriYonunuIsaretle()
        geriRef.current()
        return
      }
      bitiyor = true
      geriYonunuIsaretle()
      const bitir = () => {
        // Önce ekranı değiştir, sonra kutuyu eski yerine al: yeni ekran
        // kendi giriş hareketiyle geliyor, kutu temizlenmeden gelseydi
        // kayık görünürdü. Anahtar değişince kutu zaten sökülüyor.
        geriRef.current()
        temizle()
      }
      if (azaltilmisHareket()) return bitir()
      el.style.transition = `transform ${BIRAKMA_MS}ms cubic-bezier(0.3, 0, 0.8, 0.15)`
      el.style.transform = `translateX(${window.innerWidth / olcek()}px)`
      window.setTimeout(bitir, BIRAKMA_MS)
    }

    window.rabiGeriKaydirma = { basla, ilerle, iptal }
    window.addEventListener('rabiGeri', onayla)
    return () => {
      window.removeEventListener('rabiGeri', onayla)
      delete window.rabiGeriKaydirma
      temizle()
    }
  }, [])
}
