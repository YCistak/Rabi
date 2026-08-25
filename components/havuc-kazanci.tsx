'use client'

import { useEffect, useRef, useState } from 'react'
import { Carrot } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Havuç kazanıldığında kısa süre görünen şerit.
 *
 * Seviye atlamanın kendi tam ekran kutlaması var (`seviye-kutlama.tsx`); bu
 * onun küçük kardeşi. Oyun Bankası'ndan soru düşürmek turun ortasında oluyor ve
 * tam ekran bir kutlama, tur sonu ekranının üstüne binip oyuncuyu asıl sonucundan
 * koparırdı. Görünmez bir ödül de ödül olmadığı için arada bir yer gerekiyordu.
 *
 * `z-[60]`: oyun katmanı `z-50`'de tam ekran açılıyor ve ödül tam orada
 * kazanılıyor — altında kalsaydı hiç görünmezdi.
 */

/** Şeridin ekranda kaldığı süre (ms). */
const GORUNME_SURESI = 4000

export type HavucKazanciVerisi = { miktar: number; sebep: string }

export function HavucKazanci({
  kazanc,
  onKapat,
}: {
  kazanc: HavucKazanciVerisi | null
  onKapat: () => void
}) {
  /** Kapanış animasyonu için: kayıt silinmeden önce şerit yukarı süzülüyor. */
  const [soluyor, setSoluyor] = useState(false)
  /*
    `onKapat` ref üzerinden okunuyor: çağıran taraf onu satır içi yazıyor ve her
    çizimde yeni bir işlev doğuyor. Bağımlılık olsaydı sayaç her çizimde baştan
    kurulur, şerit hiç kapanmazdı.
  */
  const kapatRef = useRef(onKapat)
  kapatRef.current = onKapat

  useEffect(() => {
    if (!kazanc) return
    setSoluyor(false)
    const solma = setTimeout(() => setSoluyor(true), GORUNME_SURESI - 320)
    const kapanma = setTimeout(() => kapatRef.current(), GORUNME_SURESI)
    return () => {
      clearTimeout(solma)
      clearTimeout(kapanma)
    }
  }, [kazanc])

  if (!kazanc) return null

  return (
    <div
      // Şerit bilgi veriyor, engel olmuyor: altındaki tur sonu ekranına
      // dokunulabilmeli.
      className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem+var(--guvenli-ust))] z-[60] flex justify-center px-4"
      role="status"
    >
      <div
        className={cn(
          'flex max-w-md items-center gap-2 rounded-full bg-warning px-3.5 py-2 text-white shadow-[0_8px_24px_rgba(38,58,110,0.22)] transition-all duration-300',
          soluyor ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100',
        )}
      >
        <Carrot size={17} aria-hidden />
        <b className="rakam text-[14px] font-extrabold">+{kazanc.miktar} havuç</b>
        <span className="text-[12px] font-bold opacity-90">{kazanc.sebep}</span>
      </div>
    </div>
  )
}
