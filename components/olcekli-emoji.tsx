'use client'

import { useLayoutEffect, useRef } from 'react'

/**
 * Emojiyi yazı olarak değil, kendi çizimine göre ölçülüp ortalanmış bir resim
 * olarak çizer.
 *
 * iOS'ta Araçlar satırlarındaki emojiler aynı yazı boyunda bile birbirinden
 * farklı büyüklükte ve kutunun ortasından kaymış duruyordu: Apple'ın her
 * emojisi kendi kutusunda farklı boşluk bırakıyor (kamera geniş, kalem ince
 * ve çapraz) ve satır ölçüsü emojinin görünen kısmını değil yazı tipinin
 * kutusunu ortalıyor. CSS ile (`.emoji` + `leading-none`) bu ancak kısmen
 * düzeldi. Burada emoji önce gizli bir tuvale çiziliyor, boyalı piksellerin
 * sınırı bulunuyor ve yalnızca o kısım, uzun kenarı `boyut` olacak şekilde
 * kutunun tam ortasına basılıyor. Böylece her emoji, hangi telefonda olursa
 * olsun, kutusunu aynı oranda dolduruyor.
 */

const YAZI_TIPI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"

/** Apple'ın renkli emojisindeki en büyük çizim 160 px; ölçüm onun üstünde bulanıklaşmıyor. */
const OLCUM_PX = 160

/** Aynı emoji her satırda yeniden taranmasın diye: emoji → kırpılmış çizim. */
const kesitler = new Map<string, HTMLCanvasElement | null>()

function kesitAl(emoji: string): HTMLCanvasElement | null {
  const onceki = kesitler.get(emoji)
  if (onceki !== undefined) return onceki

  const kenar = OLCUM_PX * 2
  const tuval = document.createElement('canvas')
  tuval.width = kenar
  tuval.height = kenar
  const c = tuval.getContext('2d', { willReadFrequently: true })
  let kesit: HTMLCanvasElement | null = null

  if (c) {
    c.font = `${OLCUM_PX}px ${YAZI_TIPI}`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillText(emoji, kenar / 2, kenar / 2)

    // Neredeyse saydam kenar pikselleri (yumuşatma) sınırı şişirmesin.
    const { data } = c.getImageData(0, 0, kenar, kenar)
    let x0 = kenar
    let y0 = kenar
    let x1 = -1
    let y1 = -1
    for (let y = 0; y < kenar; y++) {
      for (let x = 0; x < kenar; x++) {
        if (data[(y * kenar + x) * 4 + 3] > 12) {
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
      }
    }

    if (x1 >= 0) {
      const gen = x1 - x0 + 1
      const yuk = y1 - y0 + 1
      kesit = document.createElement('canvas')
      kesit.width = gen
      kesit.height = yuk
      kesit.getContext('2d')?.drawImage(tuval, x0, y0, gen, yuk, 0, 0, gen, yuk)
    }
  }

  kesitler.set(emoji, kesit)
  return kesit
}

export function OlcekliEmoji({
  emoji,
  boyut,
  className,
}: {
  emoji: string
  /** Emojinin uzun kenarı, CSS pikseli. */
  boyut: number
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  // Boyamadan önce çizilsin ki boş kutu bir kare bile görünmesin.
  useLayoutEffect(() => {
    const tuval = ref.current
    if (!tuval) return
    const oran = window.devicePixelRatio || 1
    const px = Math.round(boyut * oran)
    tuval.width = px
    tuval.height = px
    const c = tuval.getContext('2d')
    if (!c) return
    c.clearRect(0, 0, px, px)

    const kesit = kesitAl(emoji)
    if (!kesit) {
      // Tarama olmadıysa (tuval yok, emoji boş çizildi) düz yazıya dön.
      c.font = `${px * 0.9}px ${YAZI_TIPI}`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(emoji, px / 2, px / 2)
      return
    }

    const olcek = px / Math.max(kesit.width, kesit.height)
    const gen = kesit.width * olcek
    const yuk = kesit.height * olcek
    c.imageSmoothingQuality = 'high'
    c.drawImage(kesit, (px - gen) / 2, (px - yuk) / 2, gen, yuk)
  }, [emoji, boyut])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ width: boyut, height: boyut }}
    />
  )
}
