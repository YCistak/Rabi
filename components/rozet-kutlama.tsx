'use client'

import { useEffect } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import type { Rozet } from '@/lib/rozetler'
import { useGeriKatmani } from '@/lib/geri'
import { Buton } from '@/components/ui'
import { Rabi } from '@/components/maskot/rabi'

/**
 * Yeni rozet kutlaması. Aynı anda birden fazla rozet kazanılabiliyor (ilk kez
 * veri girildiğinde alt basamaklar birlikte gelir), o yüzden liste alıyor.
 */
export function RozetKutlama({ rozetler, onKapat }: { rozetler: Rozet[]; onKapat: () => void }) {
  const acik = rozetler.length > 0

  useGeriKatmani(acik, onKapat)

  useEffect(() => {
    if (!acik || !Capacitor.isNativePlatform()) return
    // Titreşim kutlamanın bir parçası; başarısız olursa sessizce geçilir
    // (bazı cihazlarda titreşim motoru kapalı olabiliyor).
    void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
  }, [acik])

  if (!acik) return null

  const tekli = rozetler.length === 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
        <div className="flex justify-center">
          <Rabi durum="kutlama" boyut={110} />
        </div>

        <p className="mt-3 font-display text-xl font-semibold tracking-tight">
          {tekli ? 'Yeni rozet!' : `${rozetler.length} yeni rozet!`}
        </p>

        <ul className="mt-4 space-y-2 text-left">
          {rozetler.map((rozet) => (
            <li
              key={rozet.id}
              className="flex items-center gap-3 rounded-xl bg-muted/70 px-3 py-2.5"
            >
              <span className="text-2xl leading-none" aria-hidden>
                {rozet.ikon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{rozet.ad}</span>
                <span className="block text-xs text-muted-foreground">{rozet.aciklama}</span>
              </span>
            </li>
          ))}
        </ul>

        <Buton className="mt-5 w-full" onClick={onKapat}>
          Devam
        </Buton>
      </div>
    </div>
  )
}
