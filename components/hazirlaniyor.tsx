'use client'

import { useEffect, useState } from 'react'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Hazırlık ekranının süresi (ms).
 *
 * Tek yerde duruyor: çubuğun dolma süresi de ekranın kalkma anı da buradan
 * çıkıyor. İkisi ayrı sayılara bağlansaydı biri ötekini bekler ya da ekran
 * çubuk dolmadan kalkardı.
 */
export const HAZIRLIK_SURESI = 9110

/**
 * Bekleyiş boyunca sırayla geçen satırlar.
 *
 * Dokuz saniye tek bir cümleye bakmak için uzun; satırlar da "ne oluyor"
 * sorusunu kullanıcının kurulumda verdiği cevaplarla eşleştiriyor. Süre
 * bunlara eşit bölünüyor, sonuncusu kalanı taşıyor.
 */
const SATIRLAR = [
  'Sınıfına göre plan kuruluyor',
  'Sıralama tahminin ayarlanıyor',
  'Günlük hedefin yerleştiriliyor',
  'Son rötuşlar yapılıyor',
]

/**
 * Kurulum bittikten sonra gelen hazırlık ekranı.
 *
 * Kurulum son adımda "Hazırım" denince ana sayfaya bir karede düşüyordu:
 * kullanıcının onca cevabının bir işe yaradığını gösteren hiçbir an yoktu.
 * Ekranın işi bekletmek değil, o cevapların yerine oturduğunu göstermek — bu
 * yüzden satırlar kurulumda sorulan şeyleri sayıyor.
 */
export function Hazirlaniyor({ ad }: { ad: string }) {
  const [sira, setSira] = useState(0)

  useEffect(() => {
    const aralik = setInterval(() => {
      // Sonuncuda duruyor: süre bitmeden başa dönen bir liste, iş yeniden
      // başlıyormuş gibi görünürdü.
      setSira((onceki) => Math.min(SATIRLAR.length - 1, onceki + 1))
    }, HAZIRLIK_SURESI / SATIRLAR.length)
    return () => clearInterval(aralik)
  }, [])

  return (
    <div
      className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-8 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Maskot yuva değil: kurulum sonrası uçuş ana sayfadaki maskota iniyor
          ve aynı kimlikten iki tane olsaydı tavşan buraya inerdi. */}
      <Rabi durum="mutlu" boyut={140} />

      <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
        {/* Ad boş bırakılamıyor ama yine de korunuyor: adsızken cümlenin başına
            virgül ve boşluk düşerdi. */}
        {ad ? `${ad}, uygulaman hazırlanıyor` : 'Uygulaman hazırlanıyor'}
      </h1>

      <div className="mt-7 w-full max-w-[240px]">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="hazirlik-cubugu h-full rounded-full bg-primary-dolu"
            style={{ '--hazirlik-sure': `${HAZIRLIK_SURESI}ms` } as React.CSSProperties}
            aria-hidden
          />
        </div>
        {/* Satır çubuğun altında ve tek satırlık yer kaplıyor: değişirken
            metnin altındaki her şeyi aşağı yukarı oynatmasın diye. */}
        <p className="mt-3 min-h-[20px] text-sm text-muted-foreground transition-opacity duration-300">
          {SATIRLAR[sira]}
        </p>
      </div>
    </div>
  )
}
