'use client'

import { useEffect } from 'react'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import { KADEME_ADI, KADEME_SIRASI, type Rozet } from '@/lib/rozetler'
import { useGeriKatmani } from '@/lib/geri'
import { Buton } from '@/components/ui'
import { KADEME_SINIFI } from '@/components/rozet-renk'
import { Rabi } from '@/components/maskot/rabi'
import { cn } from '@/lib/utils'

/**
 * Yeni rozet kutlaması. Aynı anda birden fazla rozet kazanılabiliyor (ilk kez
 * veri girildiğinde alt basamaklar birlikte gelir), o yüzden liste alıyor.
 */
export function RozetKutlama({ rozetler, onKapat }: { rozetler: Rozet[]; onKapat: () => void }) {
  const acik = rozetler.length > 0

  useGeriKatmani(acik, onKapat)

  // Kutlamanın şiddetini partinin en değerli rozeti belirliyor: altın ve
  // efsane daha sert titriyor, bronz bir rozetle aynı hissettirmesin.
  const enYuksek = rozetler.reduce(
    (en, r) => (KADEME_SIRASI[r.kademe] > KADEME_SIRASI[en.kademe] ? r : en),
    rozetler[0] ?? { kademe: 'bronz' as const },
  ).kademe

  useEffect(() => {
    if (!acik || !Capacitor.isNativePlatform()) return
    // Titreşim kutlamanın bir parçası; başarısız olursa sessizce geçilir
    // (bazı cihazlarda titreşim motoru kapalı olabiliyor).
    const siddet = KADEME_SIRASI[enYuksek] >= KADEME_SIRASI.altin ? ImpactStyle.Heavy : ImpactStyle.Medium
    void Haptics.impact({ style: siddet }).catch(() => {})
  }, [acik, enYuksek])

  if (!acik) return null

  const tekli = rozetler.length === 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 pt-[calc(1rem+var(--guvenli-ust))] pb-[calc(1rem+var(--guvenli-alt))]">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
        <div className="flex justify-center">
          <Rabi durum="kutlama" boyut={110} />
        </div>

        <p className="mt-3 font-display text-xl font-semibold tracking-tight">
          {enYuksek === 'efsane'
            ? 'Efsane rozet!'
            : tekli
              ? 'Yeni rozet!'
              : `${rozetler.length} yeni rozet!`}
        </p>

        <ul className="mt-4 space-y-2 text-left">
          {rozetler.map((rozet) => (
            <li
              key={rozet.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-3 py-2.5',
                KADEME_SINIFI[rozet.kademe].kenar,
                KADEME_SINIFI[rozet.kademe].zemin,
              )}
            >
              <span className="text-2xl leading-none" aria-hidden>
                {rozet.ikon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{rozet.ad}</span>
                <span className="block text-xs text-muted-foreground">{rozet.aciklama}</span>
              </span>
              <span
                className={cn(
                  'shrink-0 text-[10px] font-medium uppercase tracking-wide',
                  KADEME_SINIFI[rozet.kademe].yazi,
                )}
              >
                {KADEME_ADI[rozet.kademe]}
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
