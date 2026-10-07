'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Kartı kaydırmadan okunur kılan kutu.
 *
 * Kart ekranları (deste, hızlı kontrol, yoklama) içeriği kaydırılabilir bir
 * kutuda tutuyordu ve iPhone'da görselli ya da uzun kartların altı ekranın
 * dışında kalıyordu: çentik ve ana çubuk payı Android'den ~80 piksel fazla
 * yer yiyor. Kullanıcı "bütün kartlar kaydırılmadan okunabilsin" istedi.
 *
 * Sığmayan içerik iki adımda sığdırılıyor:
 *
 * 1. **Süs kalkıyor.** `children(sikisik)` ile çağrılıyor; `sikisik` iken
 *    ekran kartın üstündeki tavşan gibi bilgi taşımayan parçayı çizmiyor.
 *    Yazıyı küçültmek, bir süs uğruna okunurluğu satmak olurdu.
 * 2. **Kalan orantılı küçülüyor** (`transform: scale`). `zoom` değil:
 *    `offsetHeight` dönüşümden etkilenmiyor, ölçülen boy hep doğal boy
 *    kalıyor ve ölçek kendi ölçüsünü değiştirip döngüye girmiyor.
 *
 * Ölçek `enKucuk`ün altına inmiyor — oradan aşağısı okunmuyor; o uçta kutu
 * eskisi gibi kayıyor. Kaydırma yalnızca emniyet.
 *
 * Süs kalkınca içerik kısalıyor ve "artık sığıyor" diye süsü geri getirmek
 * onu yeniden taşırırdı. Süs bu yüzden yalnızca kutu, süslü hâlin ölçülen
 * boyunu (`tamRef`) alacak kadar büyüyünce geri geliyor. İçerik değişince
 * (`anahtar`, yeni kart) her şey baştan ölçülüyor.
 */
export function Sigdir({
  anahtar,
  enKucuk = 0.62,
  ortala = true,
  className,
  children,
}: {
  anahtar: string
  enKucuk?: number
  /** Sığan içerik dikeyde ortalansın mı; `false` ise üstten başlar. */
  ortala?: boolean
  /** Dış kutu: boyu ekranın kalan yeri; `flex-1 min-h-0` burada verilir. */
  className?: string
  children: (sikisik: boolean) => ReactNode
}) {
  const kutuRef = useRef<HTMLDivElement>(null)
  const icRef = useRef<HTMLDivElement>(null)
  const [sikisik, setSikisik] = useState(false)
  const [olcu, setOlcu] = useState({ olcek: 1, boy: 0 })
  /** Süslü hâlin doğal boyu; süs kalktıktan sonra geri gelip gelemeyeceğini o söylüyor. */
  const tamRef = useRef(0)

  // Yeni içerik: süslü ve tam ölçekte baştan. Boyamadan önce — eski kartın
  // ölçeği bir kare yeni kartın üstünde görünmesin.
  useLayoutEffect(() => {
    tamRef.current = 0
    setSikisik(false)
    setOlcu({ olcek: 1, boy: 0 })
  }, [anahtar])

  useLayoutEffect(() => {
    const kutu = kutuRef.current
    const ic = icRef.current
    if (!kutu || !ic) return
    const hesapla = () => {
      const stil = getComputedStyle(kutu)
      const alan = kutu.clientHeight - parseFloat(stil.paddingTop) - parseFloat(stil.paddingBottom)
      const dogal = ic.offsetHeight
      if (alan <= 0 || dogal <= 0) return
      if (!sikisik) {
        tamRef.current = dogal
        if (dogal > alan) {
          setSikisik(true)
          return
        }
      } else if (alan >= tamRef.current) {
        setSikisik(false)
        return
      }
      const olcek = Math.max(enKucuk, Math.min(1, alan / dogal))
      setOlcu((o) =>
        Math.abs(o.olcek - olcek) < 0.002 && o.boy === dogal ? o : { olcek, boy: dogal },
      )
    }
    hesapla()
    const gozcu = new ResizeObserver(hesapla)
    gozcu.observe(kutu)
    gozcu.observe(ic)
    return () => gozcu.disconnect()
  }, [sikisik, enKucuk, anahtar])

  const kucuk = olcu.olcek < 1
  return (
    <div ref={kutuRef} className={cn('flex flex-col overflow-y-auto overscroll-contain', className)}>
      {/* Yer tutucu: dönüşüm yerleşimi değiştirmiyor, küçülen içeriğin boyunu o veriyor. */}
      <div
        className={cn('w-full shrink-0', ortala && 'my-auto')}
        style={kucuk ? { height: olcu.boy * olcu.olcek } : undefined}
      >
        {/* `flow-root`: ilk çocuğun üst boşluğu (`mt-8`) dışarı taşıp ölçüden düşmesin. */}
        <div
          ref={icRef}
          className="flow-root"
          style={
            kucuk ? { transform: `scale(${olcu.olcek})`, transformOrigin: 'top center' } : undefined
          }
        >
          {children(sikisik)}
        </div>
      </div>
    </div>
  )
}
