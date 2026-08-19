'use client'

/**
 * Soru başına geri sayım.
 *
 * Eskiden sayaç tura aitti ve bir kez kurulurdu; artık her soruda sıfırlanıyor.
 * Dokuz oyunun her birine ayrı ayrı yazmak yerine tek hook: sayacın hedef zaman
 * damgasıyla çalışması, arka planda donmaması ve süre dolunca **bir kez**
 * haber vermesi dokuz yerde ayrı ayrı doğru yazılması gereken şeylerdi.
 */

import { useEffect, useRef, useState } from 'react'
import { kalanSaniye } from './tur'

export type SoruSayaci = {
  /** Kalan saniye. */
  kalan: number
  /** Bu sorunun toplam süresi — halkanın doluluğu buna göre. */
  toplam: number
}

export function useSoruSayaci({
  aktif,
  sure,
  anahtar,
  onBitti,
}: {
  /** Sayaç işliyor mu: cevap verildikten sonra ya da yardım açıkken duruyor. */
  aktif: boolean
  /** Bu sorunun süresi, saniye. Boss'ta uzun. */
  sure: number
  /** Soru kimliği — değişince sayaç sıfırlanıyor. Genelde sıra numarası. */
  anahtar: number
  onBitti: () => void
}): SoruSayaci {
  const [kalan, setKalan] = useState(sure)
  const bitisRef = useRef(0)
  /**
   * Kalan süre ref olarak da tutuluyor.
   *
   * State'in kendisi okunamaz burada: yeni soruya geçerken `setKalan(sure)`
   * henüz uygulanmamış oluyor ve sayacı kuran efekt bir önceki sorunun kalanını
   * görürdü. Ref eşzamanlı yazıldığı için doğru değeri veriyor.
   */
  const kalanRef = useRef(sure)
  // Süre dolduğunda tam bir kez haber verilmeli: `onBitti` cevap listesine
  // yazıyor, iki kez çağrılsa soru iki kez yanlış sayılırdı.
  const haberVerildi = useRef(false)
  const onBittiRef = useRef(onBitti)
  onBittiRef.current = onBitti

  // Yeni soru: hedef zaman baştan kuruluyor.
  useEffect(() => {
    kalanRef.current = sure
    bitisRef.current = Date.now() + sure * 1000
    haberVerildi.current = false
    setKalan(sure)
  }, [anahtar, sure])

  useEffect(() => {
    if (!aktif) return

    // Duraklamadan dönüş: hedef zaman, donmuş kalan süreye göre yeniden kuruluyor.
    // Yardım açıkken geçen saniyeler böylece oyuncudan götürülmüyor.
    bitisRef.current = Date.now() + kalanRef.current * 1000

    const oku = () => {
      const yeni = kalanSaniye(bitisRef.current)
      kalanRef.current = yeni
      setKalan(yeni)
      if (yeni <= 0 && !haberVerildi.current) {
        haberVerildi.current = true
        onBittiRef.current()
      }
    }
    oku()
    const isaret = setInterval(oku, 250)
    return () => clearInterval(isaret)
  }, [aktif, anahtar, sure])

  return { kalan, toplam: sure }
}
